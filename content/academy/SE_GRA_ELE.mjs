/**
 * SE_GRA_ELE — Graduation Elective - Software Engineering. Học phần TỰ CHỌN
 * tốt nghiệp ngành Kỹ thuật phần mềm: KHÔNG có nội dung cố định theo giáo
 * trình. Khung bài học hướng dẫn sinh viên tự chọn một chủ đề KTPM nâng cao,
 * tự học có kế hoạch (learning contract), nghiên cứu sâu, làm mini-project,
 * viết báo cáo kỹ thuật và bảo vệ trước hội đồng. Song ngữ + quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('se-gra-ele-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: quy định học phần tự chọn tốt nghiệp trên FLM, sách nền tảng KTPM nâng cao, khoá học Coursera/edX, tài liệu chính thức miễn phí, công cụ nghiên cứu.',
  [[
    `<span class="eyebrow">SE_GRA_ELE · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">This is a <strong>graduation elective</strong> — there is no fixed syllabus. Your main resource is whatever your <strong>chosen advanced Software Engineering topic</strong> requires. Below is a starting hub: how to read the official elective regulation, foundational books that apply to almost any topic, and free platforms for structured learning.</p>
<h3>📘 Official regulation</h3>
<p>The graduation elective's registration rule, credit weight, and topic-approval process live on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> and your department's academic advisor page — check them before locking a topic, requirements change per intake.</p>
<h3>📗 Foundational books (apply to most topics)</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/" target="_blank" rel="noopener"><em>Clean Architecture</em> — Robert C. Martin</a> — software structure &amp; dependency rules, useful for almost any architecture-adjacent topic.</li>
<li><a href="https://dataintensive.net/" target="_blank" rel="noopener"><em>Designing Data-Intensive Applications</em> — Martin Kleppmann</a> — the reference for anyone whose topic touches databases, distributed systems, or scalability.</li>
</ul>
<h3>🌐 Structured, free-to-audit courses</h3>
<ul>
<li><a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera</a> — audit university-level courses on cloud, DevOps, ML engineering, security for free (no certificate needed to learn).</li>
<li><a href="https://www.edx.org/" target="_blank" rel="noopener">edX</a> — MIT/Harvard-backed courses on systems, distributed computing, and software architecture.</li>
<li><a href="https://roadmap.sh/" target="_blank" rel="noopener">roadmap.sh</a> — visual, up-to-date learning maps per SE specialization (backend, DevOps, cloud, AI engineer...).</li>
</ul>
<h3>🛠️ Research &amp; documentation tools</h3>
<ul>
<li><a href="https://github.com/" target="_blank" rel="noopener">GitHub</a> — host your mini-project, use Issues/Projects to track your own learning contract milestones.</li>
<li><a href="https://www.notion.so/" target="_blank" rel="noopener">Notion</a> or a plain Markdown repo — keep your research log and technical report drafts.</li>
</ul>
<div class="callout"><span class="badge">Do not upload PDFs as "the syllabus"</span> A graduation elective has no single official PDF to memorize — your deliverable is proof you can <strong>choose, learn and build</strong> independently. Treat every source above as a starting point, not a checklist to copy.</div>`,
    `<span class="eyebrow">SE_GRA_ELE · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Đây là <strong>học phần tự chọn tốt nghiệp</strong> — không có giáo trình cố định. Tài liệu chính của bạn là bất cứ thứ gì <strong>chủ đề Kỹ thuật phần mềm nâng cao</strong> bạn chọn đòi hỏi. Bên dưới là điểm khởi đầu: cách đọc quy định học phần tự chọn chính thức, sách nền tảng áp dụng cho gần như mọi chủ đề, và nền tảng học có cấu trúc miễn phí.</p>
<h3>📘 Quy định chính thức</h3>
<p>Quy định đăng ký học phần tự chọn tốt nghiệp, số tín chỉ, và quy trình duyệt đề tài nằm trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> và trang cố vấn học tập của khoa — kiểm tra trước khi chốt đề tài, yêu cầu có thể đổi theo từng khoá.</p>
<h3>📗 Sách nền tảng (áp dụng cho hầu hết chủ đề)</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/" target="_blank" rel="noopener"><em>Clean Architecture</em> — Robert C. Martin</a> — cấu trúc phần mềm &amp; quy tắc phụ thuộc, hữu ích cho gần như mọi chủ đề liên quan kiến trúc.</li>
<li><a href="https://dataintensive.net/" target="_blank" rel="noopener"><em>Designing Data-Intensive Applications</em> — Martin Kleppmann</a> — tài liệu tham chiếu cho ai làm chủ đề liên quan cơ sở dữ liệu, hệ phân tán, hoặc khả năng mở rộng.</li>
</ul>
<h3>🌐 Khoá học có cấu trúc, học miễn phí</h3>
<ul>
<li><a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera</a> — audit (học không lấy chứng chỉ) miễn phí các khoá cấp đại học về cloud, DevOps, ML engineering, an ninh.</li>
<li><a href="https://www.edx.org/" target="_blank" rel="noopener">edX</a> — khoá học từ MIT/Harvard về hệ thống, điện toán phân tán, kiến trúc phần mềm.</li>
<li><a href="https://roadmap.sh/" target="_blank" rel="noopener">roadmap.sh</a> — bản đồ học tập trực quan, cập nhật, theo từng hướng chuyên sâu KTPM (backend, DevOps, cloud, AI engineer...).</li>
</ul>
<h3>🛠️ Công cụ nghiên cứu &amp; ghi chép</h3>
<ul>
<li><a href="https://github.com/" target="_blank" rel="noopener">GitHub</a> — lưu mini-project, dùng Issues/Projects để theo dõi tiến độ learning contract của chính mình.</li>
<li><a href="https://www.notion.so/" target="_blank" rel="noopener">Notion</a> hoặc một kho Markdown thuần — ghi nhật ký nghiên cứu và bản nháp báo cáo kỹ thuật.</li>
</ul>
<div class="callout"><span class="badge">Đừng tải PDF lên coi như "giáo trình"</span> Học phần tự chọn tốt nghiệp không có một file PDF chính thức duy nhất để học thuộc — sản phẩm bạn cần chứng minh là khả năng <strong>tự chọn, tự học và tự làm</strong>. Coi mọi nguồn trên là điểm khởi đầu, không phải danh sách để chép lại.</div>`,
  ]]);

const intro = doc('se-gra-ele-0-1-overview', 'Course overview: a graduation elective, not a fixed syllabus|||Tổng quan: học phần tự chọn, không phải giáo trình cố định',
  'Học phần tự chọn tốt nghiệp là gì, vì sao không có nội dung cố định, deliverable cần nộp (đề tài, learning contract, mini-project, báo cáo, bảo vệ), và rubric chấm điểm tổng quát.',
  [[
    `<span class="eyebrow">SE_GRA_ELE · Lesson 0.1 · Overview</span>
<h2>Graduation Elective — Software Engineering</h2>
<p class="lead">This is not a course with a fixed textbook. It exists so you can go <strong>deep on one advanced Software Engineering topic of your own choosing</strong> — something you did not have room for in the regular curriculum — and prove you can learn it, build with it, and explain it, largely on your own.</p>
<h3>Why no fixed content</h3>
<p>Software Engineering is too broad for one syllabus to cover everyone's next step: some students head into backend/cloud, some into DevOps, some into AI engineering or security. Instead of a shared reading list, this framework teaches the <strong>process</strong> — pick a topic, plan the learning, execute a mini-project, document it, defend it — which transfers to any specialization.</p>
<h3>What you must deliver</h3>
<ul>
<li><strong>A chosen topic</strong> — one advanced SE area, scoped to what you can realistically learn and build in one term.</li>
<li><strong>A learning contract</strong> — a short document stating objectives, resources, milestones, and how success will be judged.</li>
<li><strong>A mini-project</strong> — a small but real piece of software that demonstrates the topic in practice.</li>
<li><strong>A technical report</strong> — write-up of what you learned, what you built, and what you would do differently.</li>
<li><strong>A defense</strong> — a short presentation and Q&amp;A with your supervisor/committee.</li>
</ul>
<h3>How this is graded (typical rubric)</h3>
<pre><code>Component                  Weight   What it checks
Topic relevance & scoping   10%     Fits SE, realistic for one term
Learning contract           15%     Clear objectives, honest plan
Mini-project quality        40%     Works, matches the chosen topic
Technical report            20%     Clarity, depth, honest evaluation
Presentation & defense      15%     Can explain and defend own choices
</code></pre>
<div class="callout"><span class="badge">Read this first</span> Chapters 1–4 help you choose a topic and plan; chapters 5–6 are the actual work (research + build); chapters 7–8 are how you present it. Confirm your exact deliverable list and rubric with your supervisor — this is the general shape used across FPTU cohorts, not a substitute for your department's own guideline.</div>`,
    `<span class="eyebrow">SE_GRA_ELE · Bài 0.1 · Tổng quan</span>
<h2>Học phần tự chọn tốt nghiệp — Kỹ thuật phần mềm</h2>
<p class="lead">Đây không phải môn có giáo trình cố định. Nó tồn tại để bạn <strong>đào sâu một chủ đề Kỹ thuật phần mềm nâng cao do chính bạn chọn</strong> — thứ mà chương trình chính khoá chưa có chỗ — và chứng minh bạn có thể tự học, tự làm và tự trình bày nó, phần lớn là tự lực.</p>
<h3>Vì sao không có nội dung cố định</h3>
<p>Kỹ thuật phần mềm quá rộng để một giáo trình phủ hết bước tiếp theo của mọi sinh viên: có người đi backend/cloud, có người đi DevOps, có người đi AI engineering hoặc an ninh. Thay vì một danh sách đọc chung, khung này dạy <strong>quy trình</strong> — chọn chủ đề, lên kế hoạch học, làm mini-project, viết tài liệu, bảo vệ — quy trình này dùng được cho bất kỳ hướng chuyên sâu nào.</p>
<h3>Bạn phải nộp gì</h3>
<ul>
<li><strong>Một chủ đề đã chọn</strong> — một hướng KTPM nâng cao, vừa sức học và làm thật trong một kỳ.</li>
<li><strong>Một learning contract</strong> — tài liệu ngắn nêu mục tiêu, tài nguyên, mốc tiến độ, và tiêu chí đánh giá thành công.</li>
<li><strong>Một mini-project</strong> — một sản phẩm phần mềm nhỏ nhưng thật, minh hoạ chủ đề trong thực tế.</li>
<li><strong>Một báo cáo kỹ thuật</strong> — ghi lại đã học gì, đã làm gì, và sẽ làm khác đi thế nào nếu làm lại.</li>
<li><strong>Một buổi bảo vệ</strong> — trình bày ngắn và trả lời câu hỏi trước giảng viên hướng dẫn/hội đồng.</li>
</ul>
<h3>Cách chấm điểm điển hình</h3>
<pre><code>Thành phần                 Tỉ trọng  Kiểm tra điều gì
Chủ đề & phạm vi phù hợp     10%     Thuộc KTPM, vừa sức trong một kỳ
Learning contract            15%     Mục tiêu rõ, kế hoạch trung thực
Chất lượng mini-project      40%     Chạy được, đúng chủ đề đã chọn
Báo cáo kỹ thuật              20%     Rõ ràng, đủ sâu, tự đánh giá trung thực
Trình bày & bảo vệ            15%     Giải thích và bảo vệ được lựa chọn của mình
</code></pre>
<div class="callout"><span class="badge">Đọc trước</span> Chương 1–4 giúp bạn chọn chủ đề và lên kế hoạch; chương 5–6 là phần làm thật (nghiên cứu + xây dựng); chương 7–8 là cách trình bày. Xác nhận danh sách deliverable và rubric chính xác với giảng viên hướng dẫn — đây là khung chung dùng ở nhiều khoá FPTU, không thay thế hướng dẫn riêng của khoa bạn.</div>`,
  ]]);

const c1 = doc('se-gra-ele-1-1-chon-de-tai', '1.1 — What a graduation elective is & how to pick a topic|||1.1 — Học phần tự chọn là gì & cách chọn chủ đề',
  'Định nghĩa học phần tự chọn tốt nghiệp; 4 tiêu chí chọn chủ đề theo định hướng nghề: liên quan nghề nghiệp, có tài nguyên học, khả thi trong một kỳ, đủ hứng thú để duy trì động lực.',
  [[
    `<span class="eyebrow">SE_GRA_ELE · Chapter 1 · Lesson 1.1</span>
<h2>What a graduation elective is &amp; how to pick a topic</h2>
<h3>Definition</h3>
<p>A <strong>graduation elective</strong> is a credit-bearing subject with an open topic: instead of following a shared syllabus, you propose and (with your supervisor's approval) study one advanced area of Software Engineering that is not otherwise covered in your regular courses.</p>
<h3>Four criteria for a good topic</h3>
<ul>
<li><strong>Career relevance</strong> — does it point toward the kind of engineering job you actually want next (backend, cloud/DevOps, mobile, data/ML, security...)?</li>
<li><strong>Resource availability</strong> — can you find real documentation, courses, or open-source code to learn from? A topic with zero learnable material is a trap.</li>
<li><strong>One-term feasibility</strong> — can a meaningful mini-project be scoped down to a few weeks of work, not a multi-year research program?</li>
<li><strong>Sustained interest</strong> — will you still want to work on this in week 10? Self-directed study without genuine interest tends to stall.</li>
</ul>
<h3>A simple scoring table</h3>
<pre><code>Candidate topic          Career fit  Resources  Feasible  Interest  Pick?
Microservices w/ Docker      4          5           4         4      likely
Building an ML pipeline      3          4           2         5      too big — narrow it
CI/CD for a real repo        5          5           5         3      likely
(score each 1-5, then discuss the lowest-scoring row with your supervisor)
</code></pre>
<div class="callout"><span class="badge">Narrow it, don't drop it</span> A topic that scores low on feasibility is usually too broad, not a bad idea — e.g. "AI/ML engineering" becomes feasible once narrowed to "deploy one trained model behind a REST API with monitoring."</div>`,
    `<span class="eyebrow">SE_GRA_ELE · Chương 1 · Bài 1.1</span>
<h2>Học phần tự chọn là gì &amp; cách chọn chủ đề</h2>
<h3>Định nghĩa</h3>
<p>Một <strong>học phần tự chọn tốt nghiệp</strong> là môn có tín chỉ nhưng chủ đề mở: thay vì theo một giáo trình chung, bạn đề xuất và (được giảng viên hướng dẫn duyệt) tự học một hướng Kỹ thuật phần mềm nâng cao mà các môn chính khoá chưa phủ tới.</p>
<h3>Bốn tiêu chí chọn chủ đề tốt</h3>
<ul>
<li><strong>Liên quan định hướng nghề</strong> — chủ đề có hướng tới công việc kỹ sư bạn thực sự muốn làm tiếp không (backend, cloud/DevOps, mobile, data/ML, an ninh...)?</li>
<li><strong>Có tài nguyên để học</strong> — bạn có tìm được tài liệu, khoá học, mã nguồn mở thật để học không? Chủ đề không có tài liệu học được là cái bẫy.</li>
<li><strong>Khả thi trong một kỳ</strong> — có thể thu hẹp thành một mini-project đủ ý nghĩa trong vài tuần, không phải chương trình nghiên cứu nhiều năm?</li>
<li><strong>Đủ hứng thú để duy trì</strong> — đến tuần 10 bạn còn muốn làm tiếp không? Tự học không có hứng thú thật dễ bị bỏ dở.</li>
</ul>
<h3>Bảng chấm điểm đơn giản</h3>
<pre><code>Chủ đề ứng viên            Hợp nghề  Tài nguyên  Khả thi  Hứng thú  Chọn?
Microservices với Docker       4          5          4        4      nên chọn
Xây pipeline ML                3          4          2        5      quá rộng — thu hẹp lại
CI/CD cho một repo thật         5          5          5        3      nên chọn
(chấm mỗi cột 1-5, rồi bàn dòng điểm thấp nhất với giảng viên hướng dẫn)
</code></pre>
<div class="callout"><span class="badge">Thu hẹp, đừng bỏ</span> Chủ đề điểm khả thi thấp thường do quá rộng, không phải ý tưởng tồi — vd "AI/ML engineering" trở nên khả thi khi thu hẹp thành "triển khai một mô hình đã train sau một REST API kèm giám sát".</div>`,
  ]]);

const c1q = quiz('se-gra-ele-quiz-1', 'Quiz 1 — Choosing a topic|||Quiz 1 — Chọn chủ đề', [
  { id: 'q1', question: 'Học phần tự chọn tốt nghiệp khác môn chính khoá ở điểm nào?', options: ['Không có tín chỉ', 'Chủ đề mở, sinh viên tự đề xuất và tự học', 'Không cần giảng viên hướng dẫn', 'Không cần nộp sản phẩm nào'], correctIndex: 1, explanation: 'Đây là môn có tín chỉ nhưng nội dung không cố định — sinh viên chọn chủ đề, được giảng viên duyệt.' },
  { id: 'q2', question: 'Một chủ đề "quá rộng, điểm khả thi thấp" thì nên xử lý thế nào?', options: ['Bỏ hẳn chủ đề đó', 'Thu hẹp phạm vi cho vừa một kỳ', 'Cứ giữ nguyên và làm cố', 'Đổi sang chủ đề không liên quan nghề nghiệp'], correctIndex: 1, explanation: 'Chủ đề rộng thường vẫn tốt nếu thu hẹp lại (vd AI/ML → triển khai một mô hình sau API) thay vì bỏ hẳn.' },
  { id: 'q3', question: 'Đâu KHÔNG phải một trong 4 tiêu chí chọn chủ đề đã nêu?', options: ['Liên quan định hướng nghề', 'Có tài nguyên để học', 'Chủ đề phải trùng với đồ án tốt nghiệp chính', 'Đủ hứng thú để duy trì động lực'], correctIndex: 2, explanation: 'Bốn tiêu chí là: hợp nghề, có tài nguyên, khả thi trong một kỳ, đủ hứng thú — không yêu cầu trùng đồ án chính.' },
]);

const c2 = doc('se-gra-ele-2-1-ban-do-chu-de', '2.1 — Map of advanced Software Engineering topics|||2.1 — Bản đồ chủ đề KTPM nâng cao',
  'Tổng quan các nhóm chủ đề KTPM nâng cao để chọn: kiến trúc/microservices, DevOps & CI/CD, cloud-native, testing tự động, mobile/web nâng cao, AI/ML engineering, blockchain, an ninh phần mềm.',
  [[
    `<span class="eyebrow">SE_GRA_ELE · Chapter 2 · Lesson 2.1</span>
<h2>Map of advanced Software Engineering topics</h2>
<p>Use this as a menu, not a checklist — you are choosing <strong>one</strong> row, then going deep.</p>
<pre><code>Area                     What it covers                        Example mini-project
Architecture/Microservices  Service boundaries, API design,     Split a monolith into 2-3
                             event-driven communication          services with a message queue
DevOps & CI/CD               Build/test/deploy pipelines,        A GitHub Actions pipeline that
                             infra-as-code                       tests, builds & deploys on push
Cloud-native                 Containers, orchestration,          Deploy a containerized app to
                             managed cloud services               a free-tier Kubernetes/App Service
Automated testing            Unit/integration/E2E, test          Add a test suite + coverage gate
                             pyramids, mocking                    to an existing small app
Advanced mobile/web          PWAs, offline-first, native         Turn a web app into an
                             modules, performance                offline-capable PWA
AI/ML engineering            Serving models, pipelines,          Wrap a trained model behind
                             monitoring drift                    a REST API with basic monitoring
Blockchain                   Smart contracts, consensus,         A minimal smart contract +
                             wallets                             test suite on a testnet
Software security             AuthN/Z, OWASP Top 10,             Run OWASP ZAP against your own
                             secure coding                       app and fix the top findings
</code></pre>
<div class="callout"><span class="badge">Pick by elimination</span> Read the table, cross out anything with zero personal interest, then apply the 4 criteria from Chapter 1 to what remains.</div>`,
    `<span class="eyebrow">SE_GRA_ELE · Chương 2 · Bài 2.1</span>
<h2>Bản đồ chủ đề KTPM nâng cao</h2>
<p>Dùng bảng này như một thực đơn, không phải danh sách phải làm hết — bạn chọn <strong>một</strong> dòng rồi đào sâu.</p>
<pre><code>Nhóm chủ đề              Bao gồm gì                            Ví dụ mini-project
Kiến trúc/Microservices     Ranh giới service, thiết kế API,    Tách một monolith thành 2-3
                             giao tiếp hướng sự kiện             service với hàng đợi message
DevOps & CI/CD               Pipeline build/test/deploy,         Pipeline GitHub Actions tự
                             hạ tầng dạng mã (IaC)               test/build/deploy khi push
Cloud-native                 Container, điều phối,               Deploy app đóng gói container
                             dịch vụ cloud có quản lý            lên Kubernetes/App Service free
Testing tự động               Unit/integration/E2E, kim tự      Thêm bộ test + ngưỡng coverage
                             tháp test, mocking                  cho một app nhỏ có sẵn
Mobile/web nâng cao           PWA, offline-first, module         Biến web app thành PWA
                             native, hiệu năng                   dùng offline được
AI/ML engineering             Phục vụ mô hình, pipeline,         Bọc một mô hình đã train sau
                             giám sát trôi dạt (drift)           REST API kèm giám sát cơ bản
Blockchain                    Smart contract, đồng thuận,        Một smart contract tối giản
                             ví                                  + bộ test trên testnet
An ninh phần mềm               AuthN/Z, OWASP Top 10,            Chạy OWASP ZAP lên app của
                             viết mã an toàn                     mình và vá các lỗi hàng đầu
</code></pre>
<div class="callout"><span class="badge">Chọn bằng loại trừ</span> Đọc bảng, gạch bỏ dòng nào không có chút hứng thú nào, rồi áp 4 tiêu chí ở Chương 1 cho phần còn lại.</div>`,
  ]]);

const c2q = quiz('se-gra-ele-quiz-2', 'Quiz 2 — Topic map|||Quiz 2 — Bản đồ chủ đề', [
  { id: 'q1', question: 'Ví dụ mini-project "bọc một mô hình đã train sau REST API" thuộc nhóm chủ đề nào?', options: ['DevOps & CI/CD', 'AI/ML engineering', 'Blockchain', 'An ninh phần mềm'], correctIndex: 1, explanation: 'Phục vụ (serving) mô hình sau API và giám sát drift là công việc của AI/ML engineering.' },
  { id: 'q2', question: 'Chạy OWASP ZAP để tìm và vá lỗi trên chính app của mình là mini-project của nhóm nào?', options: ['An ninh phần mềm', 'Mobile/web nâng cao', 'Kiến trúc/Microservices', 'Cloud-native'], correctIndex: 0, explanation: 'OWASP Top 10 và quét lỗ hổng thuộc nhóm an ninh phần mềm.' },
  { id: 'q3', question: 'Bản đồ chủ đề trong bài nên được dùng như thế nào?', options: ['Làm hết mọi dòng trong một kỳ', 'Chọn đúng một dòng rồi đào sâu', 'Chỉ tham khảo, không cần chọn gì', 'Nộp nguyên bảng làm learning contract'], correctIndex: 1, explanation: 'Đây là thực đơn để chọn MỘT hướng rồi đi sâu, không phải checklist phải hoàn thành hết.' },
]);

const c3 = doc('se-gra-ele-3-1-cong-cu-he-sinh-thai', '3.1 — Tools & ecosystem|||3.1 — Công cụ & hệ sinh thái',
  'Git nâng cao (rebase, cherry-pick, hooks), container hoá với Docker/Kubernetes, và làm quen cloud AWS/Azure/GCP qua free tier — nền tảng công cụ cho hầu hết chủ đề đã chọn.',
  [[
    `<span class="eyebrow">SE_GRA_ELE · Chapter 3 · Lesson 3.1</span>
<h2>Tools &amp; ecosystem</h2>
<p>Whatever topic you pick, a small common toolset makes the work possible. Learn these at "can use confidently", not "can recite":</p>
<h3>Git, beyond add/commit/push</h3>
<pre><code>rebase          rewrite your branch history onto a new base
cherry-pick     copy one specific commit onto another branch
hooks           run a script automatically on commit/push
                (e.g. run tests before allowing a push)
</code></pre>
<h3>Containers &amp; orchestration</h3>
<p><strong>Docker</strong> packages an app with everything it needs to run, so it behaves the same on your laptop and in the cloud. <strong>Kubernetes</strong> runs many containers across machines and restarts/scales them automatically — most cloud providers offer a free-tier managed cluster or a single-node option good enough for a mini-project.</p>
<h3>Cloud, minimum viable</h3>
<p>You do not need to master a whole cloud provider. Pick <strong>one</strong> (AWS, Azure, or GCP), use its free tier, and learn exactly the 2-3 services your mini-project needs (e.g. a container service + a managed database + basic monitoring).</p>
<div class="callout"><span class="badge">Depth over breadth</span> One tool used well in a working mini-project outweighs five tools only read about. Choose the smallest toolset that makes your chosen topic real.</div>`,
    `<span class="eyebrow">SE_GRA_ELE · Chương 3 · Bài 3.1</span>
<h2>Công cụ &amp; hệ sinh thái</h2>
<p>Dù chọn chủ đề nào, một bộ công cụ chung nhỏ gọn giúp việc làm khả thi. Học đến mức "dùng tự tin", không phải "thuộc lòng":</p>
<h3>Git, xa hơn add/commit/push</h3>
<pre><code>rebase          viết lại lịch sử nhánh trên một gốc mới
cherry-pick     chép đúng một commit sang nhánh khác
hooks           tự chạy một script khi commit/push
                (vd chạy test trước khi cho phép push)
</code></pre>
<h3>Container &amp; điều phối</h3>
<p><strong>Docker</strong> đóng gói một app cùng mọi thứ nó cần để chạy, nên nó chạy giống nhau trên máy bạn lẫn trên cloud. <strong>Kubernetes</strong> chạy nhiều container trên nhiều máy và tự khởi động lại/mở rộng — hầu hết nhà cung cấp cloud có bản free-tier cụm quản lý hoặc bản một-node đủ cho mini-project.</p>
<h3>Cloud, ở mức tối thiểu cần thiết</h3>
<p>Bạn không cần thành thạo cả một nhà cung cấp cloud. Chọn <strong>một</strong> (AWS, Azure, hoặc GCP), dùng free tier, và học đúng 2-3 dịch vụ mini-project của bạn cần (vd một dịch vụ container + một database quản lý + giám sát cơ bản).</p>
<div class="callout"><span class="badge">Sâu hơn là rộng</span> Một công cụ dùng tốt trong mini-project chạy được có giá trị hơn năm công cụ chỉ đọc qua. Chọn bộ công cụ nhỏ nhất đủ để hiện thực chủ đề đã chọn.</div>`,
  ]]);

const c3q = quiz('se-gra-ele-quiz-3', 'Quiz 3 — Tools & ecosystem|||Quiz 3 — Công cụ & hệ sinh thái', [
  { id: 'q1', question: 'Git "cherry-pick" dùng để làm gì?', options: ['Xoá toàn bộ lịch sử commit', 'Chép đúng một commit cụ thể sang nhánh khác', 'Tự động chạy test trước khi push', 'Gộp hai nhánh bằng merge commit'], correctIndex: 1, explanation: 'cherry-pick lấy đúng một commit và áp nó lên nhánh hiện tại.' },
  { id: 'q2', question: 'Vì sao Docker giúp app "chạy giống nhau" ở mọi nơi?', options: ['Vì nó thay thế Git', 'Vì nó đóng gói app cùng mọi thứ cần để chạy', 'Vì nó tự viết code cho app', 'Vì nó chỉ chạy trên cloud'], correctIndex: 1, explanation: 'Container đóng gói ứng dụng + dependency + môi trường chạy thành một đơn vị nhất quán.' },
  { id: 'q3', question: 'Lời khuyên chọn cloud cho mini-project là gì?', options: ['Học cả ba AWS/Azure/GCP song song', 'Chọn một nhà cung cấp, dùng free tier, học đúng vài dịch vụ cần', 'Tránh cloud, chỉ chạy local', 'Bắt buộc dùng Kubernetes multi-node trả phí'], correctIndex: 1, explanation: 'Chọn một cloud, dùng free tier, học đúng 2-3 dịch vụ cần cho mini-project — sâu hơn rộng.' },
]);

const c4 = doc('se-gra-ele-4-1-tu-hoc-learning-contract', '4.1 — Self-study method & the learning contract|||4.1 — Phương pháp tự học & learning contract',
  'Cách lập kế hoạch tự học có kiểm soát: viết learning contract (mục tiêu, tài nguyên, mốc tiến độ, tiêu chí thành công), dùng Coursera/edX có cấu trúc, tuân quy định FPTU — không nộp PDF thay cho sản phẩm.',
  [[
    `<span class="eyebrow">SE_GRA_ELE · Chapter 4 · Lesson 4.1</span>
<h2>Self-study method &amp; the learning contract</h2>
<h3>Why write a contract with yourself</h3>
<p>Self-directed learning fails most often not from lack of ability but from <strong>lack of a plan you can be held to</strong>. A <strong>learning contract</strong> is a one-to-two-page document, agreed with your supervisor, that turns "study an advanced topic" into something checkable.</p>
<h3>What goes in it</h3>
<pre><code>Section          Content
Objective        1-2 sentences: what you will be able to do by the end
Resources        Specific courses/books/docs you will use (see Ch.2, Materials)
Milestones       Week-by-week checkpoints (research done, prototype done,
                 mini-project done, report drafted, defense-ready)
Success criteria How your supervisor will know you met the objective
                 (a working demo, a passed test suite, a reviewed report)
</code></pre>
<h3>Using structured platforms well</h3>
<p>Courses on <strong>Coursera</strong> or <strong>edX</strong> give you a syllabus and pacing when your topic has none — audit relevant modules instead of reading random blog posts. Cite what you actually used in your report; do not upload a course's own PDF slides as if they were your work.</p>
<div class="callout"><span class="badge">Follow FPTU's own rule</span> Registration, approval, and submission format for the graduation elective are set by FPTU/your department on FLM — this chapter is a general method, not a substitute for that official process.</div>`,
    `<span class="eyebrow">SE_GRA_ELE · Chương 4 · Bài 4.1</span>
<h2>Phương pháp tự học &amp; learning contract</h2>
<h3>Vì sao cần một bản cam kết với chính mình</h3>
<p>Tự học thường thất bại không phải vì thiếu năng lực mà vì <strong>thiếu một kế hoạch có thể bị đối chiếu lại</strong>. <strong>Learning contract</strong> là tài liệu một-đến-hai trang, được giảng viên hướng dẫn thông qua, biến "tự học một chủ đề nâng cao" thành thứ kiểm tra được.</p>
<h3>Nội dung cần có</h3>
<pre><code>Mục              Nội dung
Mục tiêu          1-2 câu: cuối kỳ bạn làm được gì
Tài nguyên        Khoá học/sách/tài liệu cụ thể sẽ dùng (xem Ch.2, Tài liệu)
Mốc tiến độ       Checkpoint theo tuần (xong nghiên cứu, xong prototype,
                 xong mini-project, xong bản nháp báo cáo, sẵn sàng bảo vệ)
Tiêu chí thành công Cách giảng viên biết bạn đạt mục tiêu
                 (một demo chạy được, bộ test pass, báo cáo đã review)
</code></pre>
<h3>Dùng tốt các nền tảng có cấu trúc</h3>
<p>Khoá học trên <strong>Coursera</strong> hoặc <strong>edX</strong> cho bạn một giáo trình và nhịp độ khi chủ đề của bạn không có sẵn — audit các module liên quan thay vì đọc rải rác blog. Trích dẫn đúng thứ bạn thực sự dùng trong báo cáo; đừng tải slide PDF của một khoá học lên rồi coi như bài làm của mình.</p>
<div class="callout"><span class="badge">Theo đúng quy định FPTU</span> Đăng ký, duyệt đề tài, và định dạng nộp học phần tự chọn tốt nghiệp do FPTU/khoa quy định trên FLM — chương này là phương pháp chung, không thay thế quy trình chính thức đó.</div>`,
  ]]);

const c4q = quiz('se-gra-ele-quiz-4', 'Quiz 4 — Self-study & learning contract|||Quiz 4 — Tự học & learning contract', [
  { id: 'q1', question: 'Learning contract chủ yếu giải quyết vấn đề gì của tự học?', options: ['Thiếu máy tính cấu hình cao', 'Thiếu một kế hoạch có thể bị đối chiếu lại', 'Thiếu bạn học nhóm', 'Thiếu quyền truy cập internet'], correctIndex: 1, explanation: 'Tự học hay thất bại vì không có kế hoạch kiểm tra được — learning contract giải quyết đúng chỗ đó.' },
  { id: 'q2', question: 'Dùng khoá học Coursera/edX trong học phần này thế nào là đúng?', options: ['Tải slide PDF của khoá học nộp làm báo cáo của mình', 'Audit module liên quan và trích dẫn đúng phần đã dùng', 'Không được dùng vì môn không cho phép', 'Bắt buộc lấy chứng chỉ trả phí mới tính'], correctIndex: 1, explanation: 'Coursera/edX là nguồn tham khảo có cấu trúc — dùng và trích dẫn đúng, không nộp nguyên tài liệu của họ làm bài mình.' },
  { id: 'q3', question: 'Đâu KHÔNG phải một mục cần có trong learning contract theo bài học?', options: ['Mục tiêu', 'Mốc tiến độ theo tuần', 'Tiêu chí thành công', 'Bảng lương dự kiến sau khi ra trường'], correctIndex: 3, explanation: 'Bốn mục cần có: mục tiêu, tài nguyên, mốc tiến độ, tiêu chí thành công — không phải kế hoạch tài chính cá nhân.' },
]);

const c5 = doc('se-gra-ele-5-1-nghien-cuu-chuyen-sau', '5.1 — Deep research on your chosen topic|||5.1 — Nghiên cứu chuyên sâu chủ đề đã chọn',
  'Phương pháp nghiên cứu sâu: đọc có mục đích (Clean Architecture, Designing Data-Intensive Applications), so sánh công cụ/khung, làm spike/prototype nhỏ, ghi nhật ký nghiên cứu trung thực cả thất bại.',
  [[
    `<span class="eyebrow">SE_GRA_ELE · Chapter 5 · Lesson 5.1</span>
<h2>Deep research on your chosen topic</h2>
<h3>Read with a question, not just cover-to-cover</h3>
<p>Two books apply to a wide range of SE topics: <em>Clean Architecture</em> (Robert C. Martin) for anything touching system structure and dependency direction, and <em>Designing Data-Intensive Applications</em> (Martin Kleppmann) for anything touching data, scale, or distributed systems. Read the chapters relevant to your topic first, not the whole book in order.</p>
<h3>Compare before you commit</h3>
<pre><code>Question to answer for each candidate tool/framework:
1. Does it solve the exact problem my mini-project has?
2. Is there enough documentation/community to get unstuck?
3. What is the smallest thing I can build with it in 1-2 days
   to prove it works for my case? (this is a "spike")
</code></pre>
<h3>Keep a research log</h3>
<p>A short, dated log (what you tried, what worked, what did not, and why) becomes the raw material for your technical report later — and is itself evidence of real research, not just reading.</p>
<div class="callout"><span class="badge">Failed spikes count too</span> A prototype that proves an approach does not fit your case is not wasted time — write it down. "I tried X, it did not fit because Y" is a legitimate, gradeable research finding.</div>`,
    `<span class="eyebrow">SE_GRA_ELE · Chương 5 · Bài 5.1</span>
<h2>Nghiên cứu chuyên sâu chủ đề đã chọn</h2>
<h3>Đọc có mục đích, không phải đọc từ đầu tới cuối</h3>
<p>Hai cuốn sách áp dụng cho nhiều chủ đề KTPM: <em>Clean Architecture</em> (Robert C. Martin) cho bất cứ thứ gì liên quan cấu trúc hệ thống và hướng phụ thuộc, và <em>Designing Data-Intensive Applications</em> (Martin Kleppmann) cho bất cứ thứ gì liên quan dữ liệu, quy mô, hoặc hệ phân tán. Đọc chương liên quan chủ đề của bạn trước, không cần đọc hết theo thứ tự sách.</p>
<h3>So sánh trước khi chốt</h3>
<pre><code>Câu hỏi cần trả lời cho mỗi công cụ/framework ứng viên:
1. Nó có giải đúng vấn đề mini-project của tôi không?
2. Có đủ tài liệu/cộng đồng để tự gỡ khi kẹt không?
3. Thứ nhỏ nhất tôi có thể dựng trong 1-2 ngày để chứng
   minh nó hợp với trường hợp của tôi là gì? (đây là "spike")
</code></pre>
<h3>Ghi nhật ký nghiên cứu</h3>
<p>Một nhật ký ngắn, có ngày tháng (đã thử gì, cái gì được, cái gì không, vì sao) trở thành nguyên liệu thô cho báo cáo kỹ thuật sau này — và tự nó là bằng chứng nghiên cứu thật, không chỉ đọc suông.</p>
<div class="callout"><span class="badge">Spike thất bại cũng có giá trị</span> Một prototype chứng minh một hướng KHÔNG hợp với trường hợp của bạn không phải thời gian lãng phí — hãy ghi lại. "Tôi thử X, không hợp vì Y" là một phát hiện nghiên cứu hợp lệ, được tính điểm.</div>`,
  ]]);

const c5q = quiz('se-gra-ele-quiz-5', 'Quiz 5 — Deep research|||Quiz 5 — Nghiên cứu chuyên sâu', [
  { id: 'q1', question: '"Designing Data-Intensive Applications" của Kleppmann phù hợp nhất cho chủ đề nào?', options: ['Thiết kế giao diện UI/UX', 'Dữ liệu, khả năng mở rộng, hệ phân tán', 'Vẽ banner marketing', 'Học tiếng Anh chuyên ngành'], correctIndex: 1, explanation: 'Sách của Kleppmann là tài liệu tham chiếu cho các chủ đề liên quan dữ liệu, quy mô, hệ phân tán.' },
  { id: 'q2', question: '"Spike" trong nghiên cứu chủ đề nghĩa là gì?', options: ['Bản báo cáo cuối kỳ', 'Một prototype nhỏ để kiểm tra một công cụ/hướng có hợp không', 'Buổi bảo vệ trước hội đồng', 'Danh sách tài liệu tham khảo'], correctIndex: 1, explanation: 'Spike là thử nghiệm nhỏ, nhanh (1-2 ngày) để kiểm chứng một hướng trước khi commit lâu dài.' },
  { id: 'q3', question: 'Một spike thất bại (hướng đó không hợp) thì nên xử lý thế nào trong nghiên cứu?', options: ['Xoá đi, coi như chưa từng làm', 'Ghi lại vào nhật ký nghiên cứu, đó vẫn là phát hiện có giá trị', 'Giấu đi khi viết báo cáo', 'Nộp lại y nguyên làm mini-project chính'], correctIndex: 1, explanation: 'Ghi lại lý do một hướng không phù hợp là bằng chứng nghiên cứu thật, nên đưa vào nhật ký/báo cáo.' },
]);

const c6 = doc('se-gra-ele-6-1-mini-project', '6.1 — The mini-project: design & implementation|||6.1 — Mini-project: thiết kế & hiện thực',
  'Xác định phạm vi mini-project, thiết kế trước khi code (kiến trúc, luồng dữ liệu), kế hoạch lặp theo tuần, và tiêu chí "hoàn thành tối thiểu" (MVP) để tránh làm tràn phạm vi.',
  [[
    `<span class="eyebrow">SE_GRA_ELE · Chapter 6 · Lesson 6.1</span>
<h2>The mini-project: design &amp; implementation</h2>
<h3>Scope it as an MVP, not a product</h3>
<p>Your mini-project's job is to <strong>demonstrate your chosen topic</strong>, not to be production software. Define a minimum viable scope first, then treat anything extra as a stretch goal.</p>
<pre><code>Example (topic: CI/CD for a real repo)
MVP:      push to main -> automated tests run -> build produces
          an artifact -> artifact deploys to a staging environment
Stretch:  add a manual approval gate, rollback on failed health-check,
          Slack notification on deploy
</code></pre>
<h3>Design before you code</h3>
<p>Sketch the architecture in plain terms first: what are the pieces, how does data/control flow between them, where are the boundaries. A few lines of ASCII or a short diagram description is enough — the point is catching a design mistake on paper, which is far cheaper than catching it in code.</p>
<h3>Iterate weekly against your learning contract milestones</h3>
<p>Build the smallest end-to-end slice first (even a fake/hardcoded version of every step), get it working, then replace pieces with the real implementation one at a time. This keeps you with a working demo at every checkpoint instead of many half-finished parts.</p>
<div class="callout"><span class="badge">Working &gt; complete</span> A small mini-project that runs end-to-end and clearly shows your topic beats a large one that is 80% done and does not run.</div>`,
    `<span class="eyebrow">SE_GRA_ELE · Chương 6 · Bài 6.1</span>
<h2>Mini-project: thiết kế &amp; hiện thực</h2>
<h3>Đặt phạm vi kiểu MVP, không phải sản phẩm hoàn chỉnh</h3>
<p>Nhiệm vụ của mini-project là <strong>minh hoạ chủ đề đã chọn</strong>, không phải trở thành phần mềm chạy production. Xác định phạm vi tối thiểu (MVP) trước, mọi thứ thêm coi như mục tiêu vươn tới nếu còn thời gian.</p>
<pre><code>Ví dụ (chủ đề: CI/CD cho một repo thật)
MVP:      push lên main -> test tự động chạy -> build ra artifact
          -> artifact deploy lên môi trường staging
Vươn tới: thêm cổng duyệt thủ công, rollback khi health-check fail,
          báo Slack khi deploy xong
</code></pre>
<h3>Thiết kế trước khi viết code</h3>
<p>Phác thảo kiến trúc bằng lời trước: có những phần nào, dữ liệu/luồng điều khiển đi giữa chúng ra sao, ranh giới nằm ở đâu. Vài dòng ASCII hoặc mô tả sơ đồ ngắn là đủ — mục đích là bắt lỗi thiết kế trên giấy, rẻ hơn nhiều so với bắt lỗi trong code.</p>
<h3>Lặp theo tuần, bám mốc trong learning contract</h3>
<p>Dựng lát cắt đầu-cuối nhỏ nhất trước (kể cả bản giả/hardcode ở mỗi bước), cho nó chạy được, rồi thay từng phần bằng hiện thực thật. Cách này giữ cho bạn luôn có một demo chạy được ở mỗi checkpoint thay vì nhiều phần dở dang.</p>
<div class="callout"><span class="badge">Chạy được &gt; hoàn chỉnh</span> Một mini-project nhỏ chạy đầu-cuối và thể hiện rõ chủ đề tốt hơn một dự án lớn làm được 80% mà không chạy được.</div>`,
  ]]);

const c6q = quiz('se-gra-ele-quiz-6', 'Quiz 6 — Mini-project|||Quiz 6 — Mini-project', [
  { id: 'q1', question: 'Mục đích chính của mini-project trong học phần này là gì?', options: ['Trở thành phần mềm chạy production ngay', 'Minh hoạ chủ đề đã chọn ở quy mô nhỏ nhưng thật', 'Thay thế hoàn toàn đồ án tốt nghiệp chính', 'Chỉ để nộp điểm danh, không cần chạy được'], correctIndex: 1, explanation: 'Mini-project cần đủ nhỏ để khả thi trong một kỳ nhưng đủ thật để minh hoạ chủ đề.' },
  { id: 'q2', question: 'Chiến lược lặp được khuyến nghị trong bài là gì?', options: ['Làm hết phần khó nhất trước, phần dễ để cuối', 'Dựng lát cắt đầu-cuối nhỏ nhất chạy được trước, rồi thay dần bằng phần thật', 'Viết toàn bộ thiết kế xong mới bắt đầu code, không lặp', 'Làm song song tất cả các phần rồi ráp lại cuối kỳ'], correctIndex: 1, explanation: 'Dựng bản end-to-end tối giản trước rồi thay từng phần giữ cho luôn có demo chạy được.' },
  { id: 'q3', question: 'Vì sao nên thiết kế trước khi viết code?', options: ['Vì rubric bắt buộc có bản vẽ đẹp', 'Vì bắt lỗi thiết kế trên giấy rẻ hơn bắt lỗi trong code', 'Vì thiết kế thay thế được việc test', 'Vì không cần thiết, code trước sẽ nhanh hơn'], correctIndex: 1, explanation: 'Phác thảo kiến trúc trước giúp phát hiện sai sót sớm, chi phí sửa thấp hơn nhiều so với sửa trong code.' },
]);

const c7 = doc('se-gra-ele-7-1-bao-cao-ky-thuat', '7.1 — Writing the technical report & documentation|||7.1 — Viết báo cáo & tài liệu kỹ thuật',
  'Cấu trúc báo cáo kỹ thuật chuẩn (giới thiệu, nền tảng, thiết kế, hiện thực, đánh giá, kết luận, tài liệu tham khảo); chuẩn tài liệu hoá dự án (README, ghi quyết định kiến trúc - ADR).',
  [[
    `<span class="eyebrow">SE_GRA_ELE · Chapter 7 · Lesson 7.1</span>
<h2>Writing the technical report &amp; documentation</h2>
<h3>A standard report structure</h3>
<pre><code>1. Introduction     - the topic, why you chose it, the mini-project goal
2. Background       - the concepts/tools a reader needs to follow along
3. Design           - your architecture and the decisions behind it
4. Implementation   - what you built, key challenges, how you solved them
5. Evaluation       - does it work? what are its limits? what would you
                      change if you did it again?
6. Conclusion       - what you learned, how it connects to your career goal
7. References       - every book/course/doc/article you actually used
</code></pre>
<h3>Project documentation, not just the report</h3>
<p>Your repository itself should be understandable without you present: a <strong>README</strong> (what it is, how to run it) and, for any non-obvious design choice, a short <strong>Architecture Decision Record (ADR)</strong> — one page stating the decision, the alternatives considered, and why you picked this one.</p>
<div class="callout"><span class="badge">Honest evaluation scores higher</span> A report that says "X did not scale the way I expected, and here is why" demonstrates more engineering judgment than one that only lists successes.</div>`,
    `<span class="eyebrow">SE_GRA_ELE · Chương 7 · Bài 7.1</span>
<h2>Viết báo cáo &amp; tài liệu kỹ thuật</h2>
<h3>Cấu trúc báo cáo chuẩn</h3>
<pre><code>1. Giới thiệu        - chủ đề, vì sao chọn, mục tiêu mini-project
2. Nền tảng          - khái niệm/công cụ người đọc cần biết để theo kịp
3. Thiết kế          - kiến trúc và lý do đằng sau các quyết định
4. Hiện thực         - đã xây gì, thách thức chính, cách giải quyết
5. Đánh giá          - có chạy đúng không? giới hạn ở đâu? nếu làm lại
                      sẽ đổi gì?
6. Kết luận          - đã học được gì, liên hệ với định hướng nghề ra sao
7. Tài liệu tham khảo - mọi sách/khoá học/tài liệu/bài viết đã thực sự dùng
</code></pre>
<h3>Tài liệu hoá dự án, không chỉ báo cáo</h3>
<p>Kho mã của bạn cần tự nó hiểu được mà không cần bạn giải thích trực tiếp: một <strong>README</strong> (nó là gì, chạy thế nào) và, với mỗi quyết định thiết kế không hiển nhiên, một <strong>Architecture Decision Record (ADR)</strong> ngắn — một trang nêu quyết định, các phương án đã cân nhắc, và vì sao chọn phương án này.</p>
<div class="callout"><span class="badge">Đánh giá trung thực được điểm cao hơn</span> Một báo cáo nói "X không mở rộng được như tôi kỳ vọng, và đây là lý do" thể hiện tư duy kỹ thuật rõ hơn một báo cáo chỉ liệt kê thành công.</div>`,
  ]]);

const c7q = quiz('se-gra-ele-quiz-7', 'Quiz 7 — Technical report|||Quiz 7 — Báo cáo kỹ thuật', [
  { id: 'q1', question: 'Phần "Evaluation" trong báo cáo kỹ thuật nên trả lời điều gì?', options: ['Chỉ liệt kê những gì đã làm thành công', 'Sản phẩm có chạy đúng không, giới hạn ở đâu, sẽ đổi gì nếu làm lại', 'Danh sách tài liệu tham khảo', 'Lịch học của môn'], correctIndex: 1, explanation: 'Evaluation cần đánh giá trung thực: hoạt động đúng không, hạn chế gì, và cải thiện gì nếu làm lại.' },
  { id: 'q2', question: 'ADR (Architecture Decision Record) dùng để ghi lại điều gì?', options: ['Lịch trình học tập cá nhân', 'Một quyết định thiết kế, phương án đã cân nhắc, và lý do chọn', 'Điểm số dự kiến của môn học', 'Danh sách lỗi đã sửa trong tuần'], correctIndex: 1, explanation: 'ADR là tài liệu ngắn ghi lại một quyết định kiến trúc, các lựa chọn thay thế, và lý do chọn phương án cuối.' },
  { id: 'q3', question: 'Vì sao báo cáo thừa nhận một hạn chế lại được đánh giá cao hơn?', options: ['Vì rubric yêu cầu phải có ít nhất một lỗi', 'Vì nó thể hiện tư duy đánh giá kỹ thuật trung thực, không chỉ liệt kê thành công', 'Vì báo cáo ngắn hơn sẽ được điểm cao hơn', 'Vì giảng viên thích đọc về thất bại'], correctIndex: 1, explanation: 'Đánh giá trung thực, có phân tích hạn chế, cho thấy năng lực tư duy kỹ thuật thật sự.' },
]);

const c8 = doc('se-gra-ele-8-1-trinh-bay-phan-bien', '8.1 — Presentation, defense & career direction|||8.1 — Trình bày, phản biện & định hướng nghề',
  'Cấu trúc slide bảo vệ, cách chuẩn bị trả lời câu hỏi phản biện thường gặp, và cách dùng chứng chỉ liên quan chủ đề (AWS/Azure/GCP, bảo mật, v.v.) để định hướng bước tiếp theo trong nghề.',
  [[
    `<span class="eyebrow">SE_GRA_ELE · Chapter 8 · Lesson 8.1</span>
<h2>Presentation, defense &amp; career direction</h2>
<h3>A slide structure that survives Q&amp;A</h3>
<pre><code>1. Why this topic (30s)       - your career motivation
2. What you built (2-3 min)   - a live/recorded demo beats a screenshot
3. Key decisions (2-3 min)    - the 1-2 hardest choices, and why
4. What you'd change (1 min)  - honest limits, next steps
5. Q&A                        - defend your choices, don't oversell them
</code></pre>
<h3>Preparing for common defense questions</h3>
<ul>
<li><em>"Why this approach over the obvious alternative?"</em> — have your comparison from Chapter 5 ready.</li>
<li><em>"What happens if X fails / scales up?"</em> — know your mini-project's actual limits; guessing badly is worse than saying "I did not test that, but here's what I'd expect."</li>
<li><em>"What did you learn that you didn't expect?"</em> — this is where your research log (Ch.5) pays off.</li>
</ul>
<h3>After the defense: certificates &amp; next steps</h3>
<p>If your topic maps to an industry certificate (e.g. an AWS/Azure/GCP associate-level cert, a security certification), finishing the reading/labs you already did for this elective often leaves you close to exam-ready — check the official certification page for your chosen provider, never a paid "guaranteed pass" course.</p>
<div class="callout"><span class="badge">This elective is a career signal</span> Committee members read this subject as evidence of how you learn independently — the topic you picked and how you defend it says more about your next job fit than any single grade.</div>`,
    `<span class="eyebrow">SE_GRA_ELE · Chương 8 · Bài 8.1</span>
<h2>Trình bày, phản biện &amp; định hướng nghề</h2>
<h3>Cấu trúc slide sống sót qua phần hỏi đáp</h3>
<pre><code>1. Vì sao chọn chủ đề này (30s)   - động lực nghề nghiệp của bạn
2. Đã xây được gì (2-3 phút)      - demo trực tiếp/quay sẵn tốt hơn ảnh chụp
3. Quyết định then chốt (2-3 phút) - 1-2 lựa chọn khó nhất, và vì sao
4. Sẽ đổi gì (1 phút)             - hạn chế trung thực, bước tiếp theo
5. Hỏi đáp                        - bảo vệ lựa chọn, đừng thổi phồng
</code></pre>
<h3>Chuẩn bị cho các câu hỏi phản biện thường gặp</h3>
<ul>
<li><em>"Vì sao chọn cách này thay vì phương án hiển nhiên hơn?"</em> — chuẩn bị sẵn bảng so sánh từ Chương 5.</li>
<li><em>"Nếu X hỏng / mở rộng quy mô thì sao?"</em> — nắm rõ giới hạn thật của mini-project; đoán mò sai còn tệ hơn nói "tôi chưa test phần đó, nhưng dự đoán của tôi là...".</li>
<li><em>"Bạn học được điều gì ngoài dự tính?"</em> — đây là lúc nhật ký nghiên cứu (Ch.5) phát huy tác dụng.</li>
</ul>
<h3>Sau buổi bảo vệ: chứng chỉ &amp; bước tiếp theo</h3>
<p>Nếu chủ đề của bạn ánh xạ tới một chứng chỉ ngành (vd chứng chỉ AWS/Azure/GCP mức associate, chứng chỉ an ninh), phần đọc/lab bạn đã làm cho học phần này thường đưa bạn gần sẵn sàng thi — kiểm tra trang chứng chỉ chính thức của nhà cung cấp đã chọn, tuyệt đối tránh khoá "cam kết đậu" trả phí.</p>
<div class="callout"><span class="badge">Học phần này là tín hiệu nghề nghiệp</span> Hội đồng đọc môn này như bằng chứng bạn tự học độc lập ra sao — chủ đề bạn chọn và cách bạn bảo vệ nó nói nhiều về sự phù hợp công việc tiếp theo hơn bất kỳ điểm số đơn lẻ nào.</div>`,
  ]]);

const c8q = quiz('se-gra-ele-quiz-8', 'Quiz 8 — Presentation & defense|||Quiz 8 — Trình bày & phản biện', [
  { id: 'q1', question: 'Khi bị hỏi "nếu X hỏng/mở rộng quy mô thì sao?" mà chưa từng test, nên trả lời thế nào?', options: ['Bịa một con số cụ thể cho có vẻ chắc chắn', 'Nói thẳng chưa test phần đó, kèm dự đoán có cơ sở', 'Lảng sang câu hỏi khác', 'Trả lời "không biết" rồi dừng lại'], correctIndex: 1, explanation: 'Thừa nhận giới hạn kèm dự đoán có cơ sở đáng tin hơn nhiều so với đoán mò hoặc né tránh.' },
  { id: 'q2', question: 'Phần nào của quá trình làm học phần giúp trả lời tốt câu "bạn học được gì ngoài dự tính"?', options: ['Slide bảo vệ', 'Nhật ký nghiên cứu đã ghi từ Chương 5', 'Rubric chấm điểm', 'Danh sách chứng chỉ ngành'], correctIndex: 1, explanation: 'Nhật ký nghiên cứu ghi lại thử-sai theo thời gian là nguồn trả lời chân thực nhất cho câu hỏi này.' },
  { id: 'q3', question: 'Học phần tự chọn tốt nghiệp được hội đồng nhìn nhận chủ yếu như thế nào?', options: ['Chỉ là một điểm số cần đạt để tốt nghiệp', 'Bằng chứng khả năng tự học và tự định hướng nghề nghiệp', 'Một môn không ai xem trọng', 'Bài kiểm tra trí nhớ giáo trình'], correctIndex: 1, explanation: 'Vì không có nội dung cố định, đây là tín hiệu rõ nhất về năng lực tự học và định hướng nghề của sinh viên.' },
]);

export default {
  semester: { code: 'FPTU_Hola9', name: 'Kỳ 9', ordinal: 11 },
  course: {
    courseCode: 'SE_GRA_ELE',
    slug: 'se-gra-ele-graduation-elective-software-engineering',
    title: 'Graduation Elective - Software Engineering',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SE_GRA_ELE.webp',
    shortDescription: 'Graduation elective in Software Engineering: how to pick an advanced SE topic, a topic map (architecture, DevOps, cloud, testing, AI/ML, security), self-study & learning contract, deep research, mini-project, technical report and defense.|||Học phần tự chọn tốt nghiệp Kỹ thuật phần mềm: cách chọn chủ đề nâng cao, bản đồ chủ đề (kiến trúc, DevOps, cloud, testing, AI/ML, an ninh), tự học & learning contract, nghiên cứu sâu, mini-project, báo cáo kỹ thuật và bảo vệ.',
    description: 'Môn <strong>SE_GRA_ELE — Graduation Elective - Software Engineering</strong> (kỳ 9) là <strong>học phần tự chọn tốt nghiệp</strong> — không có nội dung cố định. Khung 8 chương hướng dẫn quy trình: <strong>chọn chủ đề</strong> theo định hướng nghề → nhìn <strong>bản đồ chủ đề KTPM nâng cao</strong> (kiến trúc/microservices, DevOps/CI-CD, cloud-native, testing, mobile/web nâng cao, AI/ML engineering, blockchain, an ninh) → làm quen <strong>công cụ &amp; hệ sinh thái</strong> → lập <strong>learning contract</strong> tự học có kế hoạch → <strong>nghiên cứu chuyên sâu</strong> → xây <strong>mini-project</strong> → viết <strong>báo cáo kỹ thuật</strong> → <strong>trình bày &amp; bảo vệ</strong>. Song ngữ, có quiz mỗi chương.',
    whatYouLearn: 'Cách chọn một chủ đề Kỹ thuật phần mềm nâng cao vừa sức và hợp định hướng nghề; bản đồ các hướng chuyên sâu (kiến trúc, DevOps, cloud, testing, AI/ML, blockchain, an ninh); Git nâng cao, container hoá, làm quen một nhà cung cấp cloud; viết learning contract; phương pháp nghiên cứu sâu và ghi nhật ký; thiết kế & xây mini-project theo kiểu MVP; viết báo cáo kỹ thuật và tài liệu hoá dự án (README, ADR); chuẩn bị trình bày và bảo vệ trước hội đồng.',
    requirements: 'Đã hoàn tất phần lớn các môn chuyên ngành Kỹ thuật phần mềm ở các kỳ trước. Xem điều kiện tiên quyết và quy định đăng ký đề tài chính thức trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Quy định học phần trên FLM, sách nền tảng, Coursera/edX, công cụ nghiên cứu.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Học phần tự chọn là gì, deliverable, rubric.', lessons: [intro] },
    { title: 'Chương 1 — Chọn chủ đề|||Chapter 1 — Choosing a topic', description: 'Học phần tự chọn là gì & cách chọn chủ đề.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Bản đồ chủ đề|||Chapter 2 — Topic map', description: 'Các hướng KTPM nâng cao để chọn.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Công cụ & hệ sinh thái|||Chapter 3 — Tools & ecosystem', description: 'Git nâng cao, Docker/K8s, cloud.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tự học & learning contract|||Chapter 4 — Self-study & contract', description: 'Lập kế hoạch tự học có kiểm soát.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nghiên cứu chuyên sâu|||Chapter 5 — Deep research', description: 'Đọc có mục đích, so sánh, spike, nhật ký.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mini-project|||Chapter 6 — Mini-project', description: 'Thiết kế & hiện thực theo kiểu MVP.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Báo cáo kỹ thuật|||Chapter 7 — Technical report', description: 'Cấu trúc báo cáo, README, ADR.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Trình bày & bảo vệ|||Chapter 8 — Presentation & defense', description: 'Slide, phản biện, chứng chỉ, định hướng nghề.', lessons: [c8, c8q] },
  ],
};
