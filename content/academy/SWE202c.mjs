/**
 * SWE202c — Introduction to Software Engineering. Giáo trình FLM. Không slide gốc
 * → soạn từ syllabus (SDLC + GenAI, UML modeling, coding/testing, design & PM) +
 * kiến thức, song ngữ, kèm BÀI TẬP. Giữ NGUYÊN slug. ⚠️ code mẫu: KHÔNG backtick/${ }/\n literal.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức module.', quiz: { timeLimitSeconds: 420, questions } });

const intro = doc('swe202c-0-1-overview', 'Course overview: Intro to Software Engineering|||Tổng quan môn: Nhập môn kỹ thuật phần mềm',
  'Mục tiêu, 4 CLO (GenAI trong SDLC; mô hình hoá UML; coding/testing/debugging; design & quản lý dự án), 3 module, và đồ án cuối.',
  [[
    `<span class="eyebrow">SWE202c · Lesson 0.1 · Overview</span>
<h2>Introduction to Software Engineering</h2>
<p class="lead">Software engineering is the <strong>disciplined</strong> approach to building software that works, is maintainable, and is delivered on time. This modern course pairs classic foundations — the software lifecycle, <strong>UML modeling</strong>, testing, design, project management — with <strong>Generative AI</strong> used across the development lifecycle.</p>
<h3>CLOs</h3>
<ul>
<li><strong>CLO1</strong> — apply Generative AI across the SDLC (code gen, testing, debugging, docs) responsibly (ethics, security, IP)</li>
<li><strong>CLO2</strong> — software modeling with UML (requirements → structure &amp; behavior diagrams)</li>
<li><strong>CLO3</strong> — coding standards, testing techniques, debugging &amp; code quality</li>
<li><strong>CLO4</strong> — design principles &amp; patterns; plan and manage a software project as a team</li>
</ul>
<h3>What makes it "engineering"?</h3>
<p>Anyone can write code; engineering adds <strong>process</strong> (a lifecycle from requirements to maintenance), <strong>modeling</strong> (think before you build), <strong>quality</strong> (testing, reviews), and <strong>teamwork/planning</strong> — so software scales beyond one person and one weekend.</p>`,
    `<span class="eyebrow">SWE202c · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn kỹ thuật phần mềm</h2>
<p class="lead">Kỹ thuật phần mềm là cách tiếp cận <strong>có kỷ luật</strong> để xây phần mềm chạy được, bảo trì được, giao đúng hạn. Môn hiện đại này ghép nền tảng kinh điển — vòng đời phần mềm, <strong>mô hình hoá UML</strong>, kiểm thử, thiết kế, quản lý dự án — với <strong>Generative AI</strong> dùng xuyên vòng đời phát triển.</p>
<h3>CLO</h3>
<ul>
<li><strong>CLO1</strong> — áp GenAI xuyên SDLC (sinh code, test, debug, tài liệu) có trách nhiệm (đạo đức, bảo mật, sở hữu trí tuệ)</li>
<li><strong>CLO2</strong> — mô hình hoá phần mềm với UML (yêu cầu → sơ đồ cấu trúc &amp; hành vi)</li>
<li><strong>CLO3</strong> — chuẩn code, kỹ thuật test, debug &amp; chất lượng code</li>
<li><strong>CLO4</strong> — nguyên tắc &amp; mẫu thiết kế; lập kế hoạch và quản lý dự án theo nhóm</li>
</ul>
<h3>Điều gì làm nên "kỹ thuật"?</h3>
<p>Ai cũng viết được code; kỹ thuật thêm <strong>quy trình</strong> (vòng đời từ yêu cầu tới bảo trì), <strong>mô hình hoá</strong> (nghĩ trước khi xây), <strong>chất lượng</strong> (test, review), và <strong>làm nhóm/lập kế hoạch</strong> — để phần mềm mở rộng vượt một người và một cuối tuần.</p>`,
  ]]);

/* M1: SE fundamentals + SDLC + GenAI */
const m1 = doc('swe202c-1-1-sdlc', 'M1.1 — The software development lifecycle (SDLC)|||M1.1 — Vòng đời phát triển phần mềm (SDLC)',
  'Các pha SDLC (requirements → design → implementation → testing → deployment → maintenance), mô hình waterfall vs agile/Scrum, và vai trò system analysis & design.',
  [[
    `<span class="eyebrow">SWE202c · Module 1 · Lesson 1.1</span>
<h2>The software development lifecycle</h2>
<p class="lead">The <strong>SDLC</strong> is the sequence of activities to build and maintain software: <strong>requirements → analysis &amp; design → implementation → testing → deployment → maintenance</strong>. Different <em>process models</em> arrange these differently.</p>
<h3>Process models</h3>
<ul>
<li><strong>Waterfall</strong> — do each phase fully before the next; simple but rigid, late feedback.</li>
<li><strong>Iterative/Incremental</strong> — build in slices, learn as you go.</li>
<li><strong>Agile / Scrum</strong> — short <strong>sprints</strong> (1–4 weeks), a <strong>product backlog</strong>, continuous customer feedback, working software each sprint. Roles: Product Owner, Scrum Master, Dev Team; events: sprint planning, daily standup, review, retrospective.</li>
</ul>
<h3>System analysis &amp; design</h3>
<p><strong>Analysis</strong> answers "what should the system do" (requirements, use cases); <strong>design</strong> answers "how" (architecture, modules, data). Modeling (UML, next lessons) makes both explicit before code is written.</p>`,
    `<span class="eyebrow">SWE202c · Module 1 · Bài 1.1</span>
<h2>Vòng đời phát triển phần mềm</h2>
<p class="lead"><strong>SDLC</strong> là chuỗi hoạt động để xây và bảo trì phần mềm: <strong>yêu cầu → phân tích &amp; thiết kế → hiện thực → kiểm thử → triển khai → bảo trì</strong>. Các <em>mô hình quy trình</em> sắp xếp chúng khác nhau.</p>
<h3>Mô hình quy trình</h3>
<ul>
<li><strong>Waterfall</strong> — làm xong hẳn mỗi pha rồi sang pha sau; đơn giản nhưng cứng, phản hồi muộn.</li>
<li><strong>Iterative/Incremental</strong> — xây theo lát, học dần.</li>
<li><strong>Agile / Scrum</strong> — <strong>sprint</strong> ngắn (1–4 tuần), một <strong>product backlog</strong>, phản hồi khách liên tục, phần mềm chạy được mỗi sprint. Vai: Product Owner, Scrum Master, Dev Team; sự kiện: sprint planning, daily standup, review, retrospective.</li>
</ul>
<h3>Phân tích &amp; thiết kế hệ thống</h3>
<p><strong>Phân tích</strong> trả lời "hệ thống nên làm gì" (yêu cầu, use case); <strong>thiết kế</strong> trả lời "làm thế nào" (kiến trúc, module, dữ liệu). Mô hình hoá (UML, bài sau) làm cả hai tường minh trước khi viết code.</p>`,
  ]]);

const m1b = doc('swe202c-1-2-genai', 'M1.2 — Generative AI across the SDLC|||M1.2 — Generative AI xuyên SDLC',
  'Dùng GenAI để sinh code, viết test, debug, và tài liệu; đánh giá chất lượng output; và tuân thủ đạo đức/bảo mật/sở hữu trí tuệ.',
  [[
    `<span class="eyebrow">SWE202c · Module 1 · Lesson 1.2</span>
<h2>Generative AI in software development</h2>
<p class="lead">Modern engineers use <strong>GenAI assistants</strong> (Copilot, ChatGPT, Claude) throughout the lifecycle — but as a <em>tool you supervise</em>, not a replacement for judgment.</p>
<h3>Where it helps</h3>
<ul>
<li><strong>Code generation</strong> — scaffolding, boilerplate, converting a spec to a draft.</li>
<li><strong>Testing</strong> — generating unit tests and edge cases from a function.</li>
<li><strong>Debugging</strong> — explaining an error, suggesting fixes.</li>
<li><strong>Documentation</strong> — docstrings, READMEs, commit messages.</li>
</ul>
<h3>Using it responsibly</h3>
<ul>
<li><strong>Evaluate output</strong> — AI hallucinates; <em>read, test and review</em> generated code before trusting it.</li>
<li><strong>Security</strong> — don't paste secrets/credentials into prompts; scan generated code for vulnerabilities.</li>
<li><strong>Intellectual property &amp; ethics</strong> — respect licenses, disclose AI use per your team/course policy, and stay accountable for what you ship.</li>
</ul>
<div class="callout"><span class="badge">★ Nguyên tắc</span> AI là "pair programmer" tăng tốc bạn, nhưng <b>bạn</b> chịu trách nhiệm về đúng/sai, bảo mật và bản quyền của mã cuối cùng.</div>`,
    `<span class="eyebrow">SWE202c · Module 1 · Bài 1.2</span>
<h2>Generative AI trong phát triển phần mềm</h2>
<p class="lead">Kỹ sư hiện đại dùng <strong>trợ lý GenAI</strong> (Copilot, ChatGPT, Claude) xuyên vòng đời — nhưng như một <em>công cụ bạn giám sát</em>, không thay phán đoán của bạn.</p>
<h3>Nơi nó giúp</h3>
<ul>
<li><strong>Sinh code</strong> — scaffold, boilerplate, chuyển spec thành bản nháp.</li>
<li><strong>Kiểm thử</strong> — sinh unit test và ca biên từ một hàm.</li>
<li><strong>Debug</strong> — giải thích lỗi, gợi ý sửa.</li>
<li><strong>Tài liệu</strong> — docstring, README, commit message.</li>
</ul>
<h3>Dùng có trách nhiệm</h3>
<ul>
<li><strong>Đánh giá output</strong> — AI ảo giác; <em>đọc, test và review</em> code sinh ra trước khi tin.</li>
<li><strong>Bảo mật</strong> — đừng dán secret/credential vào prompt; quét lỗ hổng trong code sinh ra.</li>
<li><strong>Sở hữu trí tuệ &amp; đạo đức</strong> — tôn trọng license, khai báo việc dùng AI theo chính sách nhóm/môn, và chịu trách nhiệm cho cái bạn ship.</li>
</ul>
<div class="callout"><span class="badge">★ Nguyên tắc</span> AI là "pair programmer" tăng tốc bạn, nhưng <b>bạn</b> chịu trách nhiệm đúng/sai, bảo mật và bản quyền của mã cuối cùng.</div>`,
  ]]);

const m1q = quiz('swe202c-quiz-1', 'Quiz M1 — SDLC & GenAI|||Quiz M1 — SDLC & GenAI', [
  { id: 'q1', question: 'Đặc trưng của Scrum là?', options: ['Làm xong hẳn mỗi pha rồi mới sang', 'Sprint ngắn + backlog + phản hồi liên tục', 'Không có kế hoạch', 'Chỉ một người làm'], correctIndex: 1, explanation: 'Scrum = sprint ngắn, product backlog, phản hồi khách liên tục.' },
  { id: 'q2', question: 'Khi dùng code do AI sinh, việc QUAN TRỌNG nhất?', options: ['Tin ngay', 'Đọc/test/review trước khi tin (AI có thể ảo giác)', 'Xoá đi', 'Không cần test'], correctIndex: 1, explanation: 'Luôn kiểm chứng output AI; bạn chịu trách nhiệm.' },
  { id: 'q3', question: 'Phân tích (analysis) trả lời câu hỏi?', options: ['Làm thế nào', 'Hệ thống nên làm GÌ', 'Deploy ở đâu', 'Ai trả tiền'], correctIndex: 1, explanation: 'Analysis = "cái gì" (yêu cầu); design = "thế nào".' },
]);

/* M2: UML modeling */
const m2 = doc('swe202c-2-1-uml', 'M2.1 — Modeling with UML: use case, class, sequence|||M2.1 — Mô hình hoá với UML: use case, class, sequence',
  'UML là gì, sơ đồ cấu trúc vs hành vi; use case diagram (actor/use case), class diagram (lớp/quan hệ/multiplicity), sequence diagram (tương tác theo thời gian).',
  [[
    `<span class="eyebrow">SWE202c · Module 2 · Lesson 2.1</span>
<h2>Modeling with UML</h2>
<p class="lead"><strong>UML</strong> (Unified Modeling Language) is a standard visual language for modeling software. <strong>Structural</strong> diagrams show what the system <em>is</em> (class); <strong>behavioral</strong> diagrams show what it <em>does</em> (use case, sequence, state machine).</p>
<h3>Use case diagram</h3>
<p>Shows <strong>actors</strong> (users/systems) and the <strong>use cases</strong> (goals) they perform — the scope of the system at a glance. Relationships: association (actor↔use case), <em>include</em> (reused sub-flow), <em>extend</em> (optional flow).</p>
<h3>Class diagram</h3>
<p>Shows <strong>classes</strong> (name, attributes, methods) and their relationships: <strong>association</strong>, <strong>aggregation/composition</strong> (whole-part), <strong>inheritance</strong> (is-a), with <strong>multiplicity</strong> (1, 0..*, 1..*). It's the blueprint of the object-oriented design.</p>
<h3>Sequence diagram</h3>
<p>Shows objects exchanging <strong>messages over time</strong> (vertical lifelines, horizontal arrows) for one scenario — how a use case actually runs, method call by method call.</p>`,
    `<span class="eyebrow">SWE202c · Module 2 · Bài 2.1</span>
<h2>Mô hình hoá với UML</h2>
<p class="lead"><strong>UML</strong> (Unified Modeling Language) là ngôn ngữ trực quan chuẩn để mô hình phần mềm. Sơ đồ <strong>cấu trúc</strong> chỉ hệ thống <em>là gì</em> (class); sơ đồ <strong>hành vi</strong> chỉ hệ thống <em>làm gì</em> (use case, sequence, state machine).</p>
<h3>Use case diagram</h3>
<p>Chỉ <strong>actor</strong> (người dùng/hệ thống) và các <strong>use case</strong> (mục tiêu) họ thực hiện — phạm vi hệ thống trong nháy mắt. Quan hệ: association (actor↔use case), <em>include</em> (luồng con dùng lại), <em>extend</em> (luồng tuỳ chọn).</p>
<h3>Class diagram</h3>
<p>Chỉ <strong>class</strong> (tên, thuộc tính, phương thức) và quan hệ: <strong>association</strong>, <strong>aggregation/composition</strong> (toàn thể-bộ phận), <strong>inheritance</strong> (is-a), với <strong>multiplicity</strong> (1, 0..*, 1..*). Đây là bản thiết kế của thiết kế hướng đối tượng.</p>
<h3>Sequence diagram</h3>
<p>Chỉ các đối tượng trao đổi <strong>thông điệp theo thời gian</strong> (lifeline dọc, mũi tên ngang) cho một kịch bản — một use case chạy thực tế ra sao, từng lời gọi phương thức.</p>`,
  ]]);

const m2b = doc('swe202c-2-2-state-machine', 'M2.2 — State machine diagrams|||M2.2 — Sơ đồ máy trạng thái',
  'State machine: trạng thái, chuyển (transition) với sự kiện/điều kiện, trạng thái đầu/cuối; mô hình đối tượng có vòng đời (đơn hàng, kết nối); ví dụ.',
  [[
    `<span class="eyebrow">SWE202c · Module 2 · Lesson 2.2</span>
<h2>State machine diagrams</h2>
<p class="lead">A <strong>state machine</strong> models an object whose behavior depends on its <strong>state</strong> — an order, a connection, a document. States are boxes; <strong>transitions</strong> are arrows labeled <code>event [guard] / action</code>.</p>
<pre><code class="language-text">Order lifecycle:
  (start) → [New] --submit--> [Placed] --pay--> [Paid]
     [Paid] --ship--> [Shipped] --deliver--> [Delivered] → (end)
     [Placed] --cancel--> [Cancelled] → (end)
</code></pre>
<p>Reading it answers design questions precisely: <em>can a Delivered order be cancelled?</em> (no transition ⇒ no). State machines expose missing or illegal transitions that prose hides — the same value you saw for requirements validation in SWR302. Use them for any object with a meaningful lifecycle.</p>`,
    `<span class="eyebrow">SWE202c · Module 2 · Bài 2.2</span>
<h2>Sơ đồ máy trạng thái</h2>
<p class="lead">Một <strong>máy trạng thái</strong> mô hình một đối tượng mà hành vi phụ thuộc <strong>trạng thái</strong> — đơn hàng, kết nối, tài liệu. Trạng thái là hộp; <strong>chuyển (transition)</strong> là mũi tên gắn nhãn <code>sự_kiện [điều_kiện] / hành_động</code>.</p>
<pre><code class="language-text">Vòng đời đơn hàng:
  (bắt đầu) → [New] --submit--> [Placed] --pay--> [Paid]
     [Paid] --ship--> [Shipped] --deliver--> [Delivered] → (kết thúc)
     [Placed] --cancel--> [Cancelled] → (kết thúc)
</code></pre>
<p>Đọc nó trả lời câu hỏi thiết kế chính xác: <em>đơn Delivered có huỷ được không?</em> (không có chuyển ⇒ không). Máy trạng thái lộ các chuyển thiếu hoặc bất hợp lệ mà văn xuôi giấu — đúng giá trị bạn thấy khi thẩm định yêu cầu ở SWR302. Dùng cho mọi đối tượng có vòng đời có nghĩa.</p>`,
  ]]);

const m2e = doc('swe202c-2-3-exercise', 'Exercise 1 — model a library|||Bài tập 1 — mô hình thư viện',
  'Bài tập: liệt kê actor & use case cho hệ mượn sách, và phác class diagram (Book/Member/Loan) với multiplicity; kèm lời giải.',
  [[
    `<span class="eyebrow">SWE202c · Module 2 · Exercise</span>
<h2>Exercise 1 — model a simple library</h2>
<div class="callout"><span class="badge">Đề</span> For a library system: (a) list actors and their main use cases; (b) sketch the class diagram for Book, Member, Loan with multiplicities.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Actors &amp; use cases
  Member:    Search Book, Borrow Book, Return Book, View Loans
  Librarian: Add/Remove Book, Manage Members, View Overdue Loans

(b) Class diagram (relationships)
  Member  1 ────── 0..*  Loan          (a member has many loans)
  Book    1 ────── 0..*  Loan          (a book appears in many loans over time)
  Loan: { borrowDate, dueDate, returnDate }
  Book: { isbn, title, author, available }
  Member: { id, name, email }
</code></pre>
<p><strong>Why:</strong> <code>Loan</code> is the association class linking Member and Book (a classic many-to-many resolved by an in-between entity — like the RTM idea from SWR302). Multiplicities (1 to 0..*) capture the rule "one member, many loans; one book, many loans." Use cases scope <em>who</em> does <em>what</em>.</p>`,
    `<span class="eyebrow">SWE202c · Module 2 · Bài tập</span>
<h2>Bài tập 1 — mô hình một thư viện đơn giản</h2>
<div class="callout"><span class="badge">Đề</span> Cho hệ thư viện: (a) liệt kê actor và use case chính; (b) phác class diagram cho Book, Member, Loan với multiplicity.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Actor &amp; use case
  Member:    Tìm sách, Mượn sách, Trả sách, Xem các lượt mượn
  Librarian: Thêm/Xoá sách, Quản lý thành viên, Xem lượt quá hạn

(b) Class diagram (quan hệ)
  Member  1 ────── 0..*  Loan          (một member có nhiều loan)
  Book    1 ────── 0..*  Loan          (một book xuất hiện ở nhiều loan theo thời gian)
  Loan: { borrowDate, dueDate, returnDate }
  Book: { isbn, title, author, available }
  Member: { id, name, email }
</code></pre>
<p><strong>Vì sao:</strong> <code>Loan</code> là association class nối Member và Book (nhiều-nhiều kinh điển được giải bằng một thực thể ở giữa — như ý RTM ở SWR302). Multiplicity (1 tới 0..*) nắm luật "một member, nhiều loan; một book, nhiều loan." Use case khoanh <em>ai</em> làm <em>gì</em>.</p>`,
  ]]);

const m2q = quiz('swe202c-quiz-2', 'Quiz M2 — UML|||Quiz M2 — UML', [
  { id: 'q1', question: 'Sơ đồ nào là CẤU TRÚC?', options: ['Use case', 'Sequence', 'Class', 'State machine'], correctIndex: 2, explanation: 'Class diagram là structural; use case/sequence/state là behavioral.' },
  { id: 'q2', question: 'Sequence diagram thể hiện?', options: ['Trạng thái đối tượng', 'Thông điệp giữa object theo thời gian', 'Quan hệ kế thừa', 'Actor và use case'], correctIndex: 1, explanation: 'Sequence chỉ tương tác (message) theo trục thời gian.' },
  { id: 'q3', question: 'Multiplicity "0..*" nghĩa là?', options: ['Đúng 0', 'Đúng 1', 'Không hoặc nhiều', 'Ít nhất 1'], correctIndex: 2, explanation: '0..* = không hoặc nhiều; 1..* = ít nhất một.' },
]);

/* M3: coding, testing, design, PM */
const m3 = doc('swe202c-3-1-quality', 'M3.1 — Coding standards, testing & debugging|||M3.1 — Chuẩn code, kiểm thử & debug',
  'Chuẩn code & clean code, các mức test (unit/integration/system/acceptance), test case & coverage, TDD ngắn gọn; debug có hệ thống; verification vs validation.',
  [[
    `<span class="eyebrow">SWE202c · Module 3 · Lesson 3.1</span>
<h2>Coding standards, testing &amp; debugging</h2>
<h3>Code quality</h3>
<p>Follow a <strong>coding standard</strong> (naming, formatting) so a team's code reads as one voice; write <strong>clean code</strong> — small functions, clear names, no duplication. Code is read far more than written.</p>
<h3>Levels of testing</h3>
<ul>
<li><strong>Unit</strong> — one function/class in isolation.</li>
<li><strong>Integration</strong> — modules working together.</li>
<li><strong>System</strong> — the whole app against requirements.</li>
<li><strong>Acceptance</strong> — the customer confirms it meets their needs.</li>
</ul>
<p>A <strong>test case</strong> = input + expected output; aim for good <strong>coverage</strong> of normal, boundary and error paths. <strong>TDD</strong> writes the test first, then code to pass it.</p>
<h3>Verification vs validation &amp; debugging</h3>
<p><strong>Verification</strong> = "building it right" (meets the spec); <strong>validation</strong> = "building the right thing" (meets the need). <strong>Debug systematically</strong>: reproduce → localize (bisect, logs) → fix the root cause → add a test so it can't regress.</p>`,
    `<span class="eyebrow">SWE202c · Module 3 · Bài 3.1</span>
<h2>Chuẩn code, kiểm thử &amp; debug</h2>
<h3>Chất lượng code</h3>
<p>Theo một <strong>chuẩn code</strong> (đặt tên, định dạng) để code cả nhóm đọc như một giọng; viết <strong>clean code</strong> — hàm nhỏ, tên rõ, không trùng lặp. Code được đọc nhiều hơn viết.</p>
<h3>Các mức kiểm thử</h3>
<ul>
<li><strong>Unit</strong> — một hàm/class cô lập.</li>
<li><strong>Integration</strong> — các module phối hợp.</li>
<li><strong>System</strong> — cả app so với yêu cầu.</li>
<li><strong>Acceptance</strong> — khách xác nhận đáp ứng nhu cầu.</li>
</ul>
<p>Một <strong>test case</strong> = input + output mong đợi; nhắm <strong>coverage</strong> tốt cho luồng thường, biên và lỗi. <strong>TDD</strong> viết test trước, rồi code để pass.</p>
<h3>Verification vs validation &amp; debug</h3>
<p><strong>Verification</strong> = "làm đúng cách" (đúng spec); <strong>validation</strong> = "làm đúng thứ" (đúng nhu cầu). <strong>Debug có hệ thống</strong>: tái hiện → khoanh vùng (bisect, log) → sửa nguyên nhân gốc → thêm test để không tái phát.</p>`,
  ]]);

const m3b = doc('swe202c-3-2-design-pm', 'M3.2 — Design principles & project management|||M3.2 — Nguyên tắc thiết kế & quản lý dự án',
  'Nguyên tắc thiết kế (cohesion/coupling, SOLID, DRY), design pattern phổ biến; và quản lý dự án (phạm vi/thời gian/nguồn lực, ước lượng, theo dõi, làm nhóm).',
  [[
    `<span class="eyebrow">SWE202c · Module 3 · Lesson 3.2</span>
<h2>Design principles &amp; project management</h2>
<h3>Design principles</h3>
<ul>
<li><strong>High cohesion, low coupling</strong> — each module does one thing; modules depend on each other minimally.</li>
<li><strong>SOLID</strong> — the five OO design principles (Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion).</li>
<li><strong>DRY</strong> — Don't Repeat Yourself; <strong>KISS</strong> — keep it simple.</li>
<li><strong>Design patterns</strong> — reusable solutions (Singleton, Factory, Observer, Strategy, MVC) to recurring problems.</li>
</ul>
<h3>Project management</h3>
<p>Balance the <strong>triple constraint</strong> — scope, time, cost — at a target quality. Break work down (WBS/backlog), <strong>estimate</strong> (story points, planning poker), <strong>track</strong> progress (burndown, standups), manage <strong>risk</strong>, and coordinate the <strong>team</strong> (roles, communication, reviews). Deliver in increments so problems surface early.</p>
<div class="callout"><span class="badge">★ Đồ án cuối</span> Module 3 kết bằng một <b>đồ án nhóm</b>: áp cả vòng — yêu cầu → UML → code theo chuẩn + test → quản lý &amp; trình bày. Bắt đầu sớm, chia việc, tích hợp liên tục.</div>`,
    `<span class="eyebrow">SWE202c · Module 3 · Bài 3.2</span>
<h2>Nguyên tắc thiết kế &amp; quản lý dự án</h2>
<h3>Nguyên tắc thiết kế</h3>
<ul>
<li><strong>Cohesion cao, coupling thấp</strong> — mỗi module làm một việc; các module phụ thuộc nhau tối thiểu.</li>
<li><strong>SOLID</strong> — năm nguyên tắc thiết kế OO (Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion).</li>
<li><strong>DRY</strong> — đừng lặp lại; <strong>KISS</strong> — giữ đơn giản.</li>
<li><strong>Design pattern</strong> — giải pháp tái dùng (Singleton, Factory, Observer, Strategy, MVC) cho vấn đề lặp lại.</li>
</ul>
<h3>Quản lý dự án</h3>
<p>Cân <strong>tam giác ràng buộc</strong> — phạm vi, thời gian, chi phí — ở mức chất lượng mục tiêu. Phân rã việc (WBS/backlog), <strong>ước lượng</strong> (story point, planning poker), <strong>theo dõi</strong> tiến độ (burndown, standup), quản <strong>rủi ro</strong>, và điều phối <strong>nhóm</strong> (vai, giao tiếp, review). Giao theo tăng dần để lộ vấn đề sớm.</p>
<div class="callout"><span class="badge">★ Đồ án cuối</span> Module 3 kết bằng một <b>đồ án nhóm</b>: áp cả vòng — yêu cầu → UML → code theo chuẩn + test → quản lý &amp; trình bày. Bắt đầu sớm, chia việc, tích hợp liên tục.</div>`,
  ]]);

const m3q = quiz('swe202c-quiz-3', 'Quiz M3 — Quality, design & PM|||Quiz M3 — Chất lượng, thiết kế & PM', [
  { id: 'q1', question: 'Unit test kiểm thử cái gì?', options: ['Cả hệ thống', 'Một hàm/class cô lập', 'Giao diện người dùng', 'Khách hàng'], correctIndex: 1, explanation: 'Unit test kiểm một đơn vị (hàm/class) cô lập.' },
  { id: 'q2', question: 'Thiết kế tốt nhắm?', options: ['Cohesion thấp, coupling cao', 'Cohesion cao, coupling thấp', 'Nhiều trùng lặp', 'Một class khổng lồ'], correctIndex: 1, explanation: 'High cohesion + low coupling = module dễ hiểu, dễ đổi.' },
  { id: 'q3', question: 'Tam giác ràng buộc dự án gồm?', options: ['Scope, time, cost', 'Code, test, deploy', 'UML, Scrum, Git', 'Actor, use case, class'], correctIndex: 0, explanation: 'Triple constraint: phạm vi–thời gian–chi phí ở mức chất lượng.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'SWE202c',
    slug: 'swe202c-introduction-to-software-engineering',
    title: 'Introduction to Software Engineering',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SWE202c.webp',
    shortDescription: 'The disciplined craft of building software — SDLC & Scrum, GenAI across the lifecycle, UML modeling, testing & debugging, design principles & project management. Bilingual, with exercises.|||Nghề xây phần mềm có kỷ luật — SDLC & Scrum, GenAI xuyên vòng đời, mô hình hoá UML, kiểm thử & debug, nguyên tắc thiết kế & quản lý dự án. Song ngữ, có bài tập.',
    description: 'Môn <strong>SWE202c — Nhập môn kỹ thuật phần mềm</strong> (ngành Kỹ thuật phần mềm, kỳ 3). Ghép nền tảng kinh điển với AI hiện đại: <strong>SDLC &amp; quy trình (waterfall/Scrum)</strong>, <strong>Generative AI xuyên vòng đời</strong> (sinh code/test/debug/tài liệu, có trách nhiệm), <strong>mô hình hoá UML</strong> (use case, class, sequence, state machine), <strong>kiểm thử &amp; debug</strong>, và <strong>nguyên tắc thiết kế + quản lý dự án</strong>. Bám giáo trình FLM (4 CLO), song ngữ, kèm bài tập.',
    whatYouLearn: 'SDLC & mô hình quy trình (waterfall, iterative, Agile/Scrum); GenAI trong SDLC (code/test/debug/docs, đạo đức/bảo mật/IP); UML (use case, class + multiplicity, sequence, state machine); chuẩn code & clean code; các mức test (unit→acceptance), TDD, V&V, debug hệ thống; nguyên tắc thiết kế (cohesion/coupling, SOLID, DRY) & design pattern; quản lý dự án (triple constraint, ước lượng, theo dõi, làm nhóm).',
    requirements: 'Nên biết lập trình cơ bản (một ngôn ngữ bất kỳ). Không cần nền kỹ thuật phần mềm trước.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao "kỹ thuật", 4 CLO, lộ trình 3 module.', lessons: [intro] },
    { title: 'Module 1 — SDLC & GenAI|||Module 1 — SDLC & GenAI', description: 'Vòng đời, waterfall/Scrum, GenAI xuyên SDLC.', lessons: [m1, m1b, m1q] },
    { title: 'Module 2 — Mô hình hoá UML|||Module 2 — UML modeling', description: 'Use case, class, sequence, state machine.', lessons: [m2, m2b, m2e, m2q] },
    { title: 'Module 3 — Chất lượng, thiết kế & PM|||Module 3 — Quality, design & PM', description: 'Test/debug, design principles, quản lý dự án.', lessons: [m3, m3b, m3q] },
  ],
};
