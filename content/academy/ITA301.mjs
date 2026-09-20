/**
 * ITA301 — Information System Analysis and Design (Phân tích & Thiết kế Hệ
 * thống thông tin). Ngành Hệ thống thông tin, FPTU, kỳ 4. Khung 8 chương bám
 * giáo trình chuẩn quốc tế: Kendall & Kendall "Systems Analysis and Design",
 * Dennis "Systems Analysis and Design: An Object-Oriented Approach", Satzinger,
 * UML docs. Mỗi chương = 1 DOCUMENT song ngữ + 1 QUIZ 3 câu. Lộ trình 4 bước.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ trong HTML; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ita301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Kendall, Dennis, Satzinger), tài liệu UML chính thức, YouTube, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">ITA301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Information System Analysis and Design</strong> — the SDLC, requirements, process &amp; data modeling, object-oriented analysis with UML, and system design — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are the standard textbooks and free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for ITA301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (international standard)</h3>
<ul>
<li>Kendall &amp; Kendall — <em>Systems Analysis and Design</em> (Pearson)</li>
<li>Dennis, Wixom &amp; Roth — <em>Systems Analysis and Design: An Object-Oriented Approach with UML</em> (Wiley)</li>
<li>Satzinger, Jackson &amp; Burd — <em>Systems Analysis and Design in a Changing World</em> (Cengage)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.omg.org/spec/UML/" target="_blank" rel="noopener">OMG UML specification (omg.org)</a> — the authoritative UML standard</li>
<li><a href="https://www.uml-diagrams.org/" target="_blank" rel="noopener">UML Diagrams reference (uml-diagrams.org)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@LucidSoftware" target="_blank" rel="noopener">Lucid Software</a> — UML, ERD &amp; DFD tutorials</li>
<li><a href="https://www.youtube.com/results?search_query=systems+analysis+and+design" target="_blank" rel="noopener">Systems Analysis &amp; Design lectures</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://app.diagrams.net/" target="_blank" rel="noopener">draw.io / diagrams.net</a> — free UML, ERD &amp; DFD editor</li>
<li><a href="https://www.lucidchart.com/" target="_blank" rel="noopener">Lucidchart</a> — online diagramming</li>
<li><a href="https://plantuml.com/" target="_blank" rel="noopener">PlantUML</a> — diagrams as text/code</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the SDLC, the analyst role, requirements gathering, and what a good requirement looks like.</li>
<li><strong>Model the current &amp; future system</strong> — DFDs for processes, ERDs for data, UML use cases &amp; class diagrams.</li>
<li><strong>Design</strong> — architecture, interfaces, database, and applying basic design patterns.</li>
<li><strong>Deliver</strong> — testing, conversion, training, maintenance, and running the project.</li>
</ol></div>`,
    `<span class="eyebrow">ITA301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Phân tích &amp; Thiết kế Hệ thống thông tin</strong> — vòng đời phát triển (SDLC), yêu cầu, mô hình hoá quy trình &amp; dữ liệu, phân tích hướng đối tượng với UML, và thiết kế hệ thống — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách chuẩn và nguồn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ITA301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (chuẩn quốc tế)</h3>
<ul>
<li>Kendall &amp; Kendall — <em>Systems Analysis and Design</em> (Pearson)</li>
<li>Dennis, Wixom &amp; Roth — <em>Systems Analysis and Design: An Object-Oriented Approach with UML</em> (Wiley)</li>
<li>Satzinger, Jackson &amp; Burd — <em>Systems Analysis and Design in a Changing World</em> (Cengage)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.omg.org/spec/UML/" target="_blank" rel="noopener">Đặc tả UML của OMG (omg.org)</a> — chuẩn UML gốc</li>
<li><a href="https://www.uml-diagrams.org/" target="_blank" rel="noopener">Tham khảo UML Diagrams (uml-diagrams.org)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@LucidSoftware" target="_blank" rel="noopener">Lucid Software</a> — hướng dẫn UML, ERD &amp; DFD</li>
<li><a href="https://www.youtube.com/results?search_query=systems+analysis+and+design" target="_blank" rel="noopener">Bài giảng Phân tích &amp; Thiết kế Hệ thống</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://app.diagrams.net/" target="_blank" rel="noopener">draw.io / diagrams.net</a> — trình vẽ UML, ERD &amp; DFD miễn phí</li>
<li><a href="https://www.lucidchart.com/" target="_blank" rel="noopener">Lucidchart</a> — vẽ sơ đồ trực tuyến</li>
<li><a href="https://plantuml.com/" target="_blank" rel="noopener">PlantUML</a> — vẽ sơ đồ bằng văn bản/mã</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — SDLC, vai trò analyst, thu thập yêu cầu, và thế nào là một yêu cầu tốt.</li>
<li><strong>Mô hình hệ thống hiện tại &amp; tương lai</strong> — DFD cho quy trình, ERD cho dữ liệu, UML use case &amp; class diagram.</li>
<li><strong>Thiết kế</strong> — kiến trúc, giao diện, cơ sở dữ liệu, và áp dụng mẫu thiết kế cơ bản.</li>
<li><strong>Bàn giao</strong> — kiểm thử, chuyển đổi, đào tạo, bảo trì và quản lý dự án.</li>
</ol></div>`,
  ]]);

const intro = doc('ita301-0-1-overview', 'Course overview: Analysis & design of information systems|||Tổng quan: Phân tích & thiết kế hệ thống thông tin',
  'Phân tích thiết kế HT là gì; vì sao dự án cần analyst; lộ trình: SDLC & yêu cầu → mô hình hoá quy trình (DFD) & dữ liệu (ERD) → phân tích hướng đối tượng (UML) → thiết kế → triển khai & bảo trì.',
  [[
    `<span class="eyebrow">ITA301 · Lesson 0.1 · Overview</span>
<h2>Analysis &amp; design of information systems</h2>
<p class="lead">This course teaches you how to turn a messy real-world business need into a <strong>clear, buildable specification</strong> for an information system. The systems analyst sits between users and developers: understanding the problem, modeling the solution, and handing engineers a design they can implement.</p>
<h3>Why it matters</h3>
<p>Most software projects fail not because the code is hard, but because the team built the <em>wrong thing</em>. Solid analysis &amp; design catches misunderstandings on paper — where a fix costs minutes — instead of in production, where it costs weeks.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Foundations</strong> — the SDLC, the analyst role, and gathering &amp; writing requirements.</li>
<li><strong>Modeling</strong> — process modeling with Data Flow Diagrams, data modeling with Entity-Relationship Diagrams.</li>
<li><strong>Object-oriented analysis</strong> — UML use case, class, sequence &amp; activity diagrams.</li>
<li><strong>Design &amp; delivery</strong> — architecture, interface &amp; database design, patterns, then testing, conversion &amp; maintenance.</li>
</ul>
<div class="callout"><span class="badge">Big idea</span> A model is a simplification you can reason about. Analysis models describe <em>what</em> the system must do; design models describe <em>how</em> it will do it.</div>`,
    `<span class="eyebrow">ITA301 · Bài 0.1 · Tổng quan</span>
<h2>Phân tích &amp; thiết kế hệ thống thông tin</h2>
<p class="lead">Môn này dạy bạn biến một nhu cầu nghiệp vụ ngoài đời còn rối rắm thành một <strong>đặc tả rõ ràng, làm được</strong> cho hệ thống thông tin. Chuyên viên phân tích (analyst) đứng giữa người dùng và lập trình viên: hiểu vấn đề, mô hình hoá giải pháp, và trao cho kỹ sư một thiết kế có thể hiện thực.</p>
<h3>Vì sao quan trọng</h3>
<p>Đa số dự án phần mềm thất bại không phải vì mã khó, mà vì đội làm <em>sai thứ cần làm</em>. Phân tích &amp; thiết kế tốt bắt lỗi hiểu nhầm ngay trên giấy — nơi sửa chỉ tốn vài phút — thay vì lúc đã lên production, nơi sửa tốn hàng tuần.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Nền tảng</strong> — SDLC, vai trò analyst, thu thập &amp; viết yêu cầu.</li>
<li><strong>Mô hình hoá</strong> — quy trình bằng sơ đồ luồng dữ liệu (DFD), dữ liệu bằng sơ đồ thực thể - quan hệ (ERD).</li>
<li><strong>Phân tích hướng đối tượng</strong> — UML use case, class, sequence &amp; activity.</li>
<li><strong>Thiết kế &amp; bàn giao</strong> — kiến trúc, thiết kế giao diện &amp; cơ sở dữ liệu, mẫu thiết kế, rồi kiểm thử, chuyển đổi &amp; bảo trì.</li>
</ul>
<div class="callout"><span class="badge">Ý lớn</span> Mô hình là một sự đơn giản hoá để ta suy luận được. Mô hình phân tích mô tả hệ thống phải làm <em>gì</em>; mô hình thiết kế mô tả nó sẽ làm <em>thế nào</em>.</div>`,
  ]]);

const c1 = doc('ita301-1-1-sdlc', '1.1 — SDLC, the analyst role & process models|||1.1 — SDLC, vai trò analyst & mô hình quy trình',
  'Vòng đời phát triển hệ thống (SDLC): các pha planning → analysis → design → implementation → maintenance; vai trò analyst; so sánh waterfall / iterative / agile.',
  [[
    `<span class="eyebrow">ITA301 · Chapter 1 · Lesson 1.1</span>
<h2>SDLC, the analyst role &amp; process models</h2>
<h3>The System Development Life Cycle (SDLC)</h3>
<p>Every information system is built through a repeatable set of phases — the <strong>SDLC</strong>. The classic five:</p>
<pre><code>Planning       -> why build it? feasibility, scope, schedule
Analysis       -> what must it do? requirements, current-system study
Design         -> how will it work? architecture, data, interface
Implementation -> build, test, convert, train
Maintenance    -> fix, enhance, support in operation
</code></pre>
<h3>The systems analyst</h3>
<p>The <strong>analyst</strong> is the bridge between the business and the technical team. Core skills are communication (interviews, workshops), modeling (DFD, ERD, UML), and judgment (feasibility, trade-offs). The analyst owns the requirements — the single source of truth for what the system must do.</p>
<h3>Process models: waterfall vs iterative vs agile</h3>
<ul>
<li><strong>Waterfall</strong> — phases run once, in sequence. Simple and well-documented, but late feedback: you only see the system at the end.</li>
<li><strong>Iterative / incremental</strong> — repeat the cycle on slices of the system, delivering usable pieces early.</li>
<li><strong>Agile (Scrum, XP)</strong> — short sprints, working software every few weeks, requirements evolving with the customer.</li>
</ul>
<div class="callout"><span class="badge">Real system</span> A university registration system is often built iteratively: enrolment first, then grades, then tuition — each slice usable before the next begins.</div>`,
    `<span class="eyebrow">ITA301 · Chương 1 · Bài 1.1</span>
<h2>SDLC, vai trò analyst &amp; mô hình quy trình</h2>
<h3>Vòng đời phát triển hệ thống (SDLC)</h3>
<p>Mọi hệ thống thông tin đều được dựng qua một chuỗi pha lặp lại — <strong>SDLC</strong>. Năm pha kinh điển:</p>
<pre><code>Lập kế hoạch  -> vì sao làm? khả thi, phạm vi, lịch
Phân tích     -> phải làm gì? yêu cầu, khảo sát hệ thống hiện tại
Thiết kế      -> làm thế nào? kiến trúc, dữ liệu, giao diện
Triển khai    -> xây, kiểm thử, chuyển đổi, đào tạo
Bảo trì       -> sửa, nâng cấp, hỗ trợ khi vận hành
</code></pre>
<h3>Chuyên viên phân tích hệ thống</h3>
<p><strong>Analyst</strong> là cầu nối giữa nghiệp vụ và đội kỹ thuật. Kỹ năng cốt lõi là giao tiếp (phỏng vấn, workshop), mô hình hoá (DFD, ERD, UML) và phán đoán (khả thi, đánh đổi). Analyst sở hữu bộ yêu cầu — nguồn sự thật duy nhất về việc hệ thống phải làm gì.</p>
<h3>Mô hình quy trình: waterfall vs iterative vs agile</h3>
<ul>
<li><strong>Thác nước (waterfall)</strong> — các pha chạy một lần, tuần tự. Đơn giản, tài liệu rõ, nhưng phản hồi muộn: chỉ thấy hệ thống ở cuối.</li>
<li><strong>Lặp / tăng dần (iterative)</strong> — lặp chu trình trên từng lát của hệ thống, giao phần dùng được sớm.</li>
<li><strong>Agile (Scrum, XP)</strong> — sprint ngắn, phần mềm chạy được sau vài tuần, yêu cầu tiến hoá cùng khách hàng.</li>
</ul>
<div class="callout"><span class="badge">Hệ thống thật</span> Hệ thống đăng ký học ở trường đại học thường dựng theo kiểu lặp: đăng ký môn trước, rồi điểm số, rồi học phí — mỗi lát dùng được trước khi làm lát sau.</div>`,
  ]]);

const c1q = quiz('ita301-quiz-1', 'Quiz 1 — SDLC & analyst|||Quiz 1 — SDLC & analyst', [
  { id: 'q1', question: 'Thứ tự đúng các pha kinh điển của SDLC?', options: ['Thiết kế → Phân tích → Lập kế hoạch → Triển khai → Bảo trì', 'Lập kế hoạch → Phân tích → Thiết kế → Triển khai → Bảo trì', 'Phân tích → Lập kế hoạch → Triển khai → Thiết kế → Bảo trì', 'Triển khai → Thiết kế → Phân tích → Lập kế hoạch → Bảo trì'], correctIndex: 1, explanation: 'Planning → Analysis → Design → Implementation → Maintenance.' },
  { id: 'q2', question: 'Vai trò chính của chuyên viên phân tích (analyst) là?', options: ['Viết toàn bộ mã nguồn', 'Cầu nối giữa nghiệp vụ và kỹ thuật, sở hữu yêu cầu', 'Quản trị máy chủ', 'Kiểm thử tự động'], correctIndex: 1, explanation: 'Analyst hiểu vấn đề nghiệp vụ, mô hình hoá và sở hữu bộ yêu cầu.' },
  { id: 'q3', question: 'Đặc trưng của mô hình Agile so với waterfall?', options: ['Chỉ giao sản phẩm một lần ở cuối', 'Sprint ngắn, phần mềm chạy được sớm, yêu cầu tiến hoá', 'Không có tài liệu nào', 'Bỏ qua pha kiểm thử'], correctIndex: 1, explanation: 'Agile giao phần mềm dùng được theo chu kỳ ngắn, yêu cầu thay đổi dần.' },
]);

const c2 = doc('ita301-2-1-requirements', '2.1 — Project initiation & requirements|||2.1 — Khởi tạo dự án & khảo sát yêu cầu',
  'Nghiên cứu khả thi (feasibility: kỹ thuật/kinh tế/tổ chức); kỹ thuật thu thập yêu cầu (phỏng vấn, khảo sát, quan sát, phân tích tài liệu); yêu cầu chức năng vs phi chức năng.',
  [[
    `<span class="eyebrow">ITA301 · Chapter 2 · Lesson 2.1</span>
<h2>Project initiation &amp; requirements</h2>
<h3>Feasibility study</h3>
<p>Before committing money, an analyst checks whether the project is worth doing along three axes:</p>
<ul>
<li><strong>Technical</strong> — can we build it with available technology &amp; skills?</li>
<li><strong>Economic</strong> — do benefits outweigh costs? (cost-benefit analysis, ROI, payback)</li>
<li><strong>Organizational / operational</strong> — will users adopt it; does it fit the business?</li>
</ul>
<h3>Requirements gathering techniques</h3>
<ul>
<li><strong>Interviews</strong> — deep, one-on-one; best for understanding goals &amp; exceptions.</li>
<li><strong>Questionnaires / surveys</strong> — reach many people cheaply; good for quantitative facts.</li>
<li><strong>Observation</strong> — watch real work; reveals what users <em>do</em>, not just what they <em>say</em>.</li>
<li><strong>Document analysis</strong> — forms, reports &amp; existing systems show the current process.</li>
</ul>
<h3>Functional vs non-functional requirements</h3>
<pre><code>Functional     -> WHAT the system does
                  "The system shall let a student enrol in a course."
Non-functional -> HOW WELL (quality attributes)
                  performance, security, usability, availability
</code></pre>
<div class="callout"><span class="badge">Real system</span> For an online banking app, "transfer money between accounts" is functional; "respond within 2 seconds and encrypt every transaction" is non-functional.</div>`,
    `<span class="eyebrow">ITA301 · Chương 2 · Bài 2.1</span>
<h2>Khởi tạo dự án &amp; khảo sát yêu cầu</h2>
<h3>Nghiên cứu khả thi</h3>
<p>Trước khi bỏ tiền, analyst kiểm dự án có đáng làm không theo ba trục:</p>
<ul>
<li><strong>Kỹ thuật</strong> — xây được với công nghệ &amp; kỹ năng đang có không?</li>
<li><strong>Kinh tế</strong> — lợi ích có vượt chi phí? (phân tích chi phí - lợi ích, ROI, thời gian hoàn vốn)</li>
<li><strong>Tổ chức / vận hành</strong> — người dùng có chịu dùng; có hợp với nghiệp vụ không?</li>
</ul>
<h3>Kỹ thuật thu thập yêu cầu</h3>
<ul>
<li><strong>Phỏng vấn</strong> — sâu, một-một; tốt để hiểu mục tiêu &amp; ngoại lệ.</li>
<li><strong>Bảng hỏi / khảo sát</strong> — tới nhiều người, rẻ; tốt cho dữ kiện định lượng.</li>
<li><strong>Quan sát</strong> — xem công việc thật; lộ ra điều người dùng <em>làm</em>, không chỉ điều họ <em>nói</em>.</li>
<li><strong>Phân tích tài liệu</strong> — biểu mẫu, báo cáo &amp; hệ thống hiện có cho thấy quy trình hiện tại.</li>
</ul>
<h3>Yêu cầu chức năng vs phi chức năng</h3>
<pre><code>Chức năng     -> hệ thống LÀM GÌ
                 "Hệ thống cho phép sinh viên đăng ký một môn học."
Phi chức năng -> LÀM TỐT THẾ NÀO (thuộc tính chất lượng)
                 hiệu năng, bảo mật, dễ dùng, sẵn sàng
</code></pre>
<div class="callout"><span class="badge">Hệ thống thật</span> Với app ngân hàng trực tuyến, "chuyển tiền giữa hai tài khoản" là chức năng; "phản hồi dưới 2 giây và mã hoá mọi giao dịch" là phi chức năng.</div>`,
  ]]);

const c2q = quiz('ita301-quiz-2', 'Quiz 2 — Feasibility & requirements|||Quiz 2 — Khả thi & yêu cầu', [
  { id: 'q1', question: 'Ba loại khả thi thường xét trong nghiên cứu feasibility là?', options: ['Kỹ thuật, kinh tế, tổ chức/vận hành', 'Frontend, backend, database', 'Sáng, trưa, tối', 'Alpha, beta, release'], correctIndex: 0, explanation: 'Technical, economic, organizational/operational feasibility.' },
  { id: 'q2', question: 'Kỹ thuật thu thập yêu cầu nào tốt nhất để thấy người dùng THỰC SỰ làm gì?', options: ['Phỏng vấn', 'Bảng hỏi', 'Quan sát (observation)', 'Đọc email'], correctIndex: 2, explanation: 'Quan sát lộ ra hành vi thật, khác với điều người dùng tự thuật.' },
  { id: 'q3', question: '"Hệ thống phải phản hồi dưới 2 giây" là loại yêu cầu gì?', options: ['Yêu cầu chức năng', 'Yêu cầu phi chức năng', 'Ràng buộc khả thi', 'Ca sử dụng'], correctIndex: 1, explanation: 'Hiệu năng là thuộc tính chất lượng → yêu cầu phi chức năng.' },
]);

const c3 = doc('ita301-3-1-dfd', '3.1 — Process modeling with Data Flow Diagrams|||3.1 — Mô hình hoá quy trình bằng DFD',
  'Sơ đồ luồng dữ liệu (DFD): 4 ký hiệu (process, data flow, data store, external entity); sơ đồ ngữ cảnh (context) → Level 0 → phân rã (decomposition); quy tắc cân bằng.',
  [[
    `<span class="eyebrow">ITA301 · Chapter 3 · Lesson 3.1</span>
<h2>Process modeling with Data Flow Diagrams</h2>
<h3>What a DFD shows</h3>
<p>A <strong>Data Flow Diagram</strong> models how data moves through a system: who sends it, what transforms it, and where it is stored — <em>without</em> caring about the technology. Four symbols only:</p>
<pre><code>Process         (circle/rounded box) -> transforms data
Data flow       (arrow)              -> data in motion
Data store      (open box)           -> data at rest (a file/table)
External entity (square)             -> source/sink outside the system
</code></pre>
<h3>Levelling &amp; decomposition</h3>
<ul>
<li><strong>Context diagram</strong> — the whole system as ONE process plus external entities; the highest-level view.</li>
<li><strong>Level 0</strong> — that one process exploded into its major sub-processes.</li>
<li><strong>Decomposition</strong> — each sub-process can be exploded again (Level 1, 2 ...) until it is simple enough.</li>
</ul>
<h3>Balancing rule</h3>
<p>Data flows in and out of a parent process must match the flows of its child diagram — this is <strong>balancing</strong>. If a flow appears on the parent but vanishes in the child, the model is wrong.</p>
<div class="callout"><span class="badge">Real system</span> An online shop context diagram has one process "Process Order"; Level 0 breaks it into Verify Payment, Check Stock, Ship Goods — each reading/writing the Inventory &amp; Order data stores.</div>`,
    `<span class="eyebrow">ITA301 · Chương 3 · Bài 3.1</span>
<h2>Mô hình hoá quy trình bằng DFD</h2>
<h3>DFD cho thấy điều gì</h3>
<p><strong>Sơ đồ luồng dữ liệu (DFD)</strong> mô hình cách dữ liệu di chuyển qua hệ thống: ai gửi, cái gì biến đổi nó, và nó lưu ở đâu — <em>không</em> quan tâm công nghệ. Chỉ bốn ký hiệu:</p>
<pre><code>Tiến trình      (hình tròn/hộp bo) -> biến đổi dữ liệu
Luồng dữ liệu   (mũi tên)          -> dữ liệu đang chảy
Kho dữ liệu     (hộp hở)           -> dữ liệu đứng yên (file/bảng)
Tác nhân ngoài  (hình vuông)       -> nguồn/đích ngoài hệ thống
</code></pre>
<h3>Phân cấp &amp; phân rã</h3>
<ul>
<li><strong>Sơ đồ ngữ cảnh (context)</strong> — cả hệ thống là MỘT tiến trình cộng các tác nhân ngoài; mức cao nhất.</li>
<li><strong>Mức 0 (Level 0)</strong> — tiến trình đó nổ ra thành các tiến trình con chính.</li>
<li><strong>Phân rã</strong> — mỗi tiến trình con lại nổ tiếp (Mức 1, 2 ...) đến khi đủ đơn giản.</li>
</ul>
<h3>Quy tắc cân bằng</h3>
<p>Luồng dữ liệu vào/ra một tiến trình cha phải khớp với luồng ở sơ đồ con của nó — đó là <strong>cân bằng (balancing)</strong>. Nếu một luồng có ở cha nhưng biến mất ở con thì mô hình sai.</p>
<div class="callout"><span class="badge">Hệ thống thật</span> Sơ đồ ngữ cảnh của shop online có một tiến trình "Xử lý đơn"; Mức 0 tách thành Kiểm thanh toán, Kiểm tồn kho, Giao hàng — mỗi cái đọc/ghi kho dữ liệu Tồn kho &amp; Đơn hàng.</div>`,
  ]]);

const c3q = quiz('ita301-quiz-3', 'Quiz 3 — Data Flow Diagrams|||Quiz 3 — Sơ đồ luồng dữ liệu', [
  { id: 'q1', question: 'DFD KHÔNG có ký hiệu chuẩn nào sau đây?', options: ['Tiến trình (process)', 'Kho dữ liệu (data store)', 'Vòng lặp for', 'Tác nhân ngoài (external entity)'], correctIndex: 2, explanation: 'DFD chỉ có 4 ký hiệu: process, data flow, data store, external entity.' },
  { id: 'q2', question: 'Sơ đồ ngữ cảnh (context diagram) biểu diễn hệ thống thế nào?', options: ['Chia thành nhiều tiến trình con', 'Toàn hệ thống là MỘT tiến trình cùng các tác nhân ngoài', 'Chỉ gồm cơ sở dữ liệu', 'Là mã giả của thuật toán'], correctIndex: 1, explanation: 'Context diagram là mức cao nhất: một process duy nhất + external entities.' },
  { id: 'q3', question: '"Cân bằng" (balancing) giữa DFD cha và con nghĩa là?', options: ['Số tiến trình cha bằng số con', 'Luồng dữ liệu vào/ra cha khớp với luồng ở sơ đồ con', 'Hai sơ đồ có cùng số kho dữ liệu', 'Các mũi tên cùng độ dài'], correctIndex: 1, explanation: 'Luồng vào/ra ở cha phải nhất quán với luồng ở diagram con.' },
]);

const c4 = doc('ita301-4-1-erd', '4.1 — Data modeling: ERD & normalization|||4.1 — Mô hình hoá dữ liệu: ERD & chuẩn hoá',
  'Sơ đồ thực thể - quan hệ (ERD): entity, attribute, relationship, khoá chính/ngoại, lực lượng (1:1, 1:N, M:N); từ điển dữ liệu (data dictionary); chuẩn hoá 1NF/2NF/3NF.',
  [[
    `<span class="eyebrow">ITA301 · Chapter 4 · Lesson 4.1</span>
<h2>Data modeling: ERD &amp; normalization</h2>
<h3>Entity-Relationship Diagram</h3>
<p>Where a DFD models <em>processes</em>, an <strong>ERD</strong> models <em>data structure</em>: the things the business remembers and how they connect.</p>
<ul>
<li><strong>Entity</strong> — a thing we store data about (Student, Course).</li>
<li><strong>Attribute</strong> — a property of an entity (Student.name, Student.id).</li>
<li><strong>Relationship</strong> — an association between entities (a Student <em>enrols in</em> a Course).</li>
<li><strong>Keys</strong> — a <strong>primary key</strong> uniquely identifies a row; a <strong>foreign key</strong> links to another entity.</li>
</ul>
<h3>Cardinality</h3>
<pre><code>1:1  one-to-one   (Person  - Passport)
1:N  one-to-many  (Customer - Orders)
M:N  many-to-many (Student  - Course)  -> needs a junction table
</code></pre>
<h3>Data dictionary &amp; normalization</h3>
<p>A <strong>data dictionary</strong> records each data element: name, type, length, allowed values. <strong>Normalization</strong> removes redundancy step by step:</p>
<ul>
<li><strong>1NF</strong> — atomic values, no repeating groups.</li>
<li><strong>2NF</strong> — 1NF + no partial dependency on part of a composite key.</li>
<li><strong>3NF</strong> — 2NF + no transitive dependency (non-key depending on non-key).</li>
</ul>
<div class="callout"><span class="badge">Real system</span> A library: entities Book, Member, Loan. A Member borrows many Books over time, so Loan is the junction resolving the M:N between Member and Book.</div>`,
    `<span class="eyebrow">ITA301 · Chương 4 · Bài 4.1</span>
<h2>Mô hình hoá dữ liệu: ERD &amp; chuẩn hoá</h2>
<h3>Sơ đồ thực thể - quan hệ (ERD)</h3>
<p>DFD mô hình <em>quy trình</em>, còn <strong>ERD</strong> mô hình <em>cấu trúc dữ liệu</em>: những thứ nghiệp vụ cần nhớ và cách chúng liên kết.</p>
<ul>
<li><strong>Thực thể (entity)</strong> — một thứ ta lưu dữ liệu về nó (Sinh viên, Môn học).</li>
<li><strong>Thuộc tính (attribute)</strong> — một tính chất của thực thể (SinhVien.ten, SinhVien.mã).</li>
<li><strong>Quan hệ (relationship)</strong> — liên kết giữa các thực thể (Sinh viên <em>đăng ký</em> Môn học).</li>
<li><strong>Khoá</strong> — <strong>khoá chính</strong> định danh duy nhất một dòng; <strong>khoá ngoại</strong> liên kết tới thực thể khác.</li>
</ul>
<h3>Lực lượng (cardinality)</h3>
<pre><code>1:1  một-một    (Người   - Hộ chiếu)
1:N  một-nhiều  (Khách   - Đơn hàng)
M:N  nhiều-nhiều (Sinh viên - Môn học) -> cần bảng trung gian
</code></pre>
<h3>Từ điển dữ liệu &amp; chuẩn hoá</h3>
<p><strong>Từ điển dữ liệu</strong> ghi từng phần tử dữ liệu: tên, kiểu, độ dài, giá trị hợp lệ. <strong>Chuẩn hoá</strong> gỡ dư thừa theo từng bước:</p>
<ul>
<li><strong>1NF</strong> — giá trị nguyên tử, không nhóm lặp.</li>
<li><strong>2NF</strong> — 1NF + không phụ thuộc một phần vào một phần của khoá ghép.</li>
<li><strong>3NF</strong> — 2NF + không phụ thuộc bắc cầu (thuộc tính không khoá phụ thuộc thuộc tính không khoá).</li>
</ul>
<div class="callout"><span class="badge">Hệ thống thật</span> Thư viện: thực thể Sách, Thành viên, Lượt mượn. Một thành viên mượn nhiều sách theo thời gian, nên Lượt mượn là bảng trung gian giải quan hệ M:N giữa Thành viên và Sách.</div>`,
  ]]);

const c4q = quiz('ita301-quiz-4', 'Quiz 4 — ERD & normalization|||Quiz 4 — ERD & chuẩn hoá', [
  { id: 'q1', question: 'Quan hệ nhiều-nhiều (M:N) trong ERD thường được giải bằng?', options: ['Bỏ bớt một thực thể', 'Một bảng trung gian (junction table)', 'Thêm một khoá chính kép cho cả hai', 'Không lưu quan hệ đó'], correctIndex: 1, explanation: 'M:N cần bảng trung gian chứa khoá ngoại tới cả hai thực thể.' },
  { id: 'q2', question: 'Khoá dùng để liên kết một thực thể tới thực thể khác gọi là?', options: ['Khoá chính', 'Khoá ngoại (foreign key)', 'Khoá dự tuyển', 'Chỉ mục'], correctIndex: 1, explanation: 'Foreign key tham chiếu tới khoá chính của thực thể khác.' },
  { id: 'q3', question: 'Chuẩn 3NF yêu cầu loại bỏ điều gì (ngoài các điều kiện 2NF)?', options: ['Mọi khoá ngoại', 'Phụ thuộc bắc cầu (transitive dependency)', 'Mọi quan hệ 1:N', 'Các thuộc tính đa trị'], correctIndex: 1, explanation: '3NF: không thuộc tính không khoá nào phụ thuộc bắc cầu vào khoá.' },
]);

const c5 = doc('ita301-5-1-ooa-uml', '5.1 — Object-oriented analysis with UML|||5.1 — Phân tích hướng đối tượng với UML',
  'UML trong phân tích: use case diagram (actor, use case, include/extend); class diagram (thuộc tính, phương thức, association/aggregation/inheritance); sequence & activity diagram.',
  [[
    `<span class="eyebrow">ITA301 · Chapter 5 · Lesson 5.1</span>
<h2>Object-oriented analysis with UML</h2>
<p>Object-oriented analysis models a system as <strong>collaborating objects</strong> rather than processes and data stores. <strong>UML</strong> is the standard notation; four diagrams matter most.</p>
<h3>Use case diagram — what the system does, from outside</h3>
<ul>
<li><strong>Actor</strong> — a user or external system (stick figure).</li>
<li><strong>Use case</strong> — a goal the actor achieves (an oval).</li>
<li><strong>include</strong> — a use case always uses another; <strong>extend</strong> — optional/conditional behavior.</li>
</ul>
<h3>Class diagram — the static structure</h3>
<pre><code>+----------------------+
| Order                |   <- class name
+----------------------+
| - id : int           |   <- attributes
| - total : money      |
+----------------------+
| + addItem(item)      |   <- operations/methods
| + checkout()         |
+----------------------+
Associations: association, aggregation (has-a), inheritance (is-a)
</code></pre>
<h3>Sequence &amp; activity diagrams — the dynamic behavior</h3>
<ul>
<li><strong>Sequence diagram</strong> — objects exchanging messages over time (lifelines, ordered top to bottom).</li>
<li><strong>Activity diagram</strong> — the flow of a process with decisions, forks &amp; merges (like a flowchart for a workflow).</li>
</ul>
<div class="callout"><span class="badge">Real system</span> An ATM: actor Customer; use cases Withdraw Cash (includes Authenticate); classes Account, Card, Transaction; a sequence diagram traces insertCard -&gt; enterPIN -&gt; dispenseCash.</div>`,
    `<span class="eyebrow">ITA301 · Chương 5 · Bài 5.1</span>
<h2>Phân tích hướng đối tượng với UML</h2>
<p>Phân tích hướng đối tượng mô hình hệ thống thành các <strong>đối tượng cộng tác</strong> thay vì tiến trình và kho dữ liệu. <strong>UML</strong> là ký pháp chuẩn; bốn sơ đồ quan trọng nhất.</p>
<h3>Use case diagram — hệ thống làm gì, nhìn từ ngoài</h3>
<ul>
<li><strong>Tác nhân (actor)</strong> — người dùng hoặc hệ thống ngoài (hình que).</li>
<li><strong>Ca sử dụng (use case)</strong> — một mục tiêu tác nhân đạt được (hình bầu dục).</li>
<li><strong>include</strong> — một use case luôn dùng use case khác; <strong>extend</strong> — hành vi tuỳ chọn/có điều kiện.</li>
</ul>
<h3>Class diagram — cấu trúc tĩnh</h3>
<pre><code>+----------------------+
| Order                |   <- tên lớp
+----------------------+
| - id : int           |   <- thuộc tính
| - total : money      |
+----------------------+
| + addItem(item)      |   <- phương thức
| + checkout()         |
+----------------------+
Liên kết: association, aggregation (có-một), inheritance (là-một)
</code></pre>
<h3>Sequence &amp; activity diagram — hành vi động</h3>
<ul>
<li><strong>Sequence diagram</strong> — các đối tượng trao đổi thông điệp theo thời gian (lifeline, xếp trên xuống dưới).</li>
<li><strong>Activity diagram</strong> — luồng một quy trình với rẽ nhánh, fork &amp; merge (như lưu đồ cho một workflow).</li>
</ul>
<div class="callout"><span class="badge">Hệ thống thật</span> Máy ATM: actor Khách; use case Rút tiền (include Xác thực); lớp Account, Card, Transaction; sequence diagram lần theo insertCard -&gt; enterPIN -&gt; dispenseCash.</div>`,
  ]]);

const c5q = quiz('ita301-quiz-5', 'Quiz 5 — UML analysis|||Quiz 5 — Phân tích UML', [
  { id: 'q1', question: 'Trong use case diagram, quan hệ "include" nghĩa là?', options: ['Hành vi tuỳ chọn có điều kiện', 'Một use case LUÔN dùng lại một use case khác', 'Một actor kế thừa actor khác', 'Hai use case loại trừ nhau'], correctIndex: 1, explanation: 'include = use case này luôn gọi/tái dùng use case kia; extend mới là tuỳ chọn.' },
  { id: 'q2', question: 'Sơ đồ UML nào mô tả CẤU TRÚC TĨNH gồm lớp, thuộc tính, phương thức?', options: ['Sequence diagram', 'Activity diagram', 'Class diagram', 'Use case diagram'], correctIndex: 2, explanation: 'Class diagram thể hiện cấu trúc tĩnh: lớp và quan hệ giữa chúng.' },
  { id: 'q3', question: 'Sơ đồ dùng để thể hiện các đối tượng trao đổi thông điệp theo THỜI GIAN?', options: ['Sequence diagram', 'ERD', 'Class diagram', 'DFD'], correctIndex: 0, explanation: 'Sequence diagram cho thấy trình tự thông điệp giữa các lifeline theo thời gian.' },
]);

const c6 = doc('ita301-6-1-system-design', '6.1 — System design: architecture, UI & database|||6.1 — Thiết kế hệ thống: kiến trúc, giao diện & CSDL',
  'Chuyển từ phân tích sang thiết kế; kiến trúc (client-server, 3 lớp presentation/logic/data); thiết kế giao diện & input/output (validation, form); thiết kế cơ sở dữ liệu (bảng, chỉ mục).',
  [[
    `<span class="eyebrow">ITA301 · Chapter 6 · Lesson 6.1</span>
<h2>System design: architecture, UI &amp; database</h2>
<p>Analysis said <em>what</em>; design decides <em>how</em>. Design turns models into a concrete blueprint developers can build.</p>
<h3>Architecture</h3>
<ul>
<li><strong>Client-server</strong> — clients request, a server serves shared resources.</li>
<li><strong>Three-tier</strong> — separate <em>presentation</em> (UI), <em>business logic</em>, and <em>data</em> layers, so each can change independently.</li>
</ul>
<h3>Interface &amp; input/output design</h3>
<ul>
<li><strong>Input</strong> — forms should minimize typing, validate early, and prevent errors (dropdowns over free text).</li>
<li><strong>Output</strong> — reports &amp; screens present the right data, at the right level, to the right user.</li>
<li><strong>Usability</strong> — consistency, clear feedback, and forgiving error handling.</li>
</ul>
<h3>Database design</h3>
<pre><code>ERD (logical) -> tables (physical)
  entity   -> table
  attribute-> column
  1:N      -> foreign key on the "many" side
  M:N      -> junction table
  add indexes on columns you search/join often
</code></pre>
<div class="callout"><span class="badge">Real system</span> A web store uses three tiers: React UI (presentation), an API applying pricing &amp; stock rules (logic), and PostgreSQL tables (data) — each replaceable without rewriting the others.</div>`,
    `<span class="eyebrow">ITA301 · Chương 6 · Bài 6.1</span>
<h2>Thiết kế hệ thống: kiến trúc, giao diện &amp; CSDL</h2>
<p>Phân tích nói <em>làm gì</em>; thiết kế quyết <em>làm thế nào</em>. Thiết kế biến mô hình thành bản vẽ cụ thể để lập trình viên dựng.</p>
<h3>Kiến trúc</h3>
<ul>
<li><strong>Client-server</strong> — client gửi yêu cầu, server phục vụ tài nguyên dùng chung.</li>
<li><strong>Ba lớp (three-tier)</strong> — tách <em>trình bày</em> (UI), <em>logic nghiệp vụ</em>, và <em>dữ liệu</em>, để mỗi lớp đổi độc lập.</li>
</ul>
<h3>Thiết kế giao diện &amp; input/output</h3>
<ul>
<li><strong>Đầu vào (input)</strong> — biểu mẫu giảm gõ tay, kiểm hợp lệ sớm, chặn lỗi (dropdown thay vì gõ tự do).</li>
<li><strong>Đầu ra (output)</strong> — báo cáo &amp; màn hình trình đúng dữ liệu, đúng mức, cho đúng người.</li>
<li><strong>Khả dụng (usability)</strong> — nhất quán, phản hồi rõ, và xử lý lỗi khoan dung.</li>
</ul>
<h3>Thiết kế cơ sở dữ liệu</h3>
<pre><code>ERD (logic) -> bảng (vật lý)
  thực thể   -> bảng
  thuộc tính -> cột
  1:N        -> khoá ngoại đặt ở phía "nhiều"
  M:N        -> bảng trung gian
  thêm chỉ mục cho cột hay tìm/nối
</code></pre>
<div class="callout"><span class="badge">Hệ thống thật</span> Web bán hàng dùng ba lớp: UI React (trình bày), API áp luật giá &amp; tồn kho (logic), và bảng PostgreSQL (dữ liệu) — mỗi lớp thay được mà không viết lại lớp khác.</div>`,
  ]]);

const c6q = quiz('ita301-quiz-6', 'Quiz 6 — System design|||Quiz 6 — Thiết kế hệ thống', [
  { id: 'q1', question: 'Kiến trúc ba lớp (three-tier) tách hệ thống thành?', options: ['Frontend, mobile, desktop', 'Trình bày (UI), logic nghiệp vụ, dữ liệu', 'Dev, test, prod', 'HTML, CSS, JavaScript'], correctIndex: 1, explanation: 'Presentation, business logic, data — mỗi lớp thay đổi độc lập.' },
  { id: 'q2', question: 'Khi chuyển ERD sang bảng, quan hệ 1:N thường được hiện thực bằng?', options: ['Một bảng trung gian', 'Khoá ngoại đặt ở phía "nhiều"', 'Gộp hai thực thể làm một bảng', 'Bỏ khoá chính'], correctIndex: 1, explanation: '1:N: đặt foreign key ở bảng phía nhiều trỏ về phía một.' },
  { id: 'q3', question: 'Nguyên tắc thiết kế đầu vào (input) tốt là?', options: ['Bắt người dùng gõ càng nhiều càng tốt', 'Giảm gõ tay, kiểm hợp lệ sớm, chặn lỗi', 'Không cần thông báo lỗi', 'Dùng free text cho mọi trường'], correctIndex: 1, explanation: 'Form tốt tối thiểu hoá nhập liệu và ngăn lỗi ngay khi nhập.' },
]);

const c7 = doc('ita301-7-1-detailed-design-patterns', '7.1 — Detailed design, modularity & patterns|||7.1 — Thiết kế chi tiết, mô-đun & mẫu',
  'Thiết kế chi tiết mô-đun (coupling thấp, cohesion cao); mẫu thiết kế cơ bản (Singleton, Factory, Observer, MVC); thiết kế UI/UX hệ thống (điều hướng, wireframe, tính nhất quán).',
  [[
    `<span class="eyebrow">ITA301 · Chapter 7 · Lesson 7.1</span>
<h2>Detailed design, modularity &amp; patterns</h2>
<h3>Good module structure</h3>
<p>Break the system into <strong>modules</strong> and judge them by two measures:</p>
<ul>
<li><strong>Coupling (low is good)</strong> — how much modules depend on each other; loose coupling means one can change without breaking others.</li>
<li><strong>Cohesion (high is good)</strong> — how focused a module is; a cohesive module does one job well.</li>
</ul>
<h3>Basic design patterns</h3>
<pre><code>Singleton -> exactly one shared instance (e.g. a config/registry)
Factory   -> create objects without naming the concrete class
Observer  -> notify many subscribers when a subject changes
MVC       -> split Model (data), View (UI), Controller (input)
</code></pre>
<p>Patterns are <em>reusable solutions</em> to recurring design problems — they give teams a shared vocabulary.</p>
<h3>UI / UX design of the system</h3>
<ul>
<li><strong>Navigation</strong> — a clear map; users always know where they are and how to get back.</li>
<li><strong>Wireframes</strong> — low-fidelity screen layouts to agree structure before visuals.</li>
<li><strong>Consistency</strong> — the same action looks and behaves the same everywhere.</li>
</ul>
<div class="callout"><span class="badge">Real system</span> A web framework often uses MVC (controller handles the request, model queries the DB, view renders HTML) and an Observer to push live notifications to the browser.</div>`,
    `<span class="eyebrow">ITA301 · Chương 7 · Bài 7.1</span>
<h2>Thiết kế chi tiết, mô-đun &amp; mẫu</h2>
<h3>Cấu trúc mô-đun tốt</h3>
<p>Chia hệ thống thành các <strong>mô-đun</strong> và đánh giá bằng hai thước đo:</p>
<ul>
<li><strong>Kết dính ngoài / coupling (thấp là tốt)</strong> — mức mô-đun phụ thuộc nhau; coupling lỏng thì đổi cái này không vỡ cái kia.</li>
<li><strong>Kết dính trong / cohesion (cao là tốt)</strong> — độ tập trung của mô-đun; mô-đun cohesion cao làm tốt một việc.</li>
</ul>
<h3>Mẫu thiết kế cơ bản</h3>
<pre><code>Singleton -> đúng một thực thể dùng chung (vd config/registry)
Factory   -> tạo đối tượng mà không gọi tên lớp cụ thể
Observer  -> báo cho nhiều người đăng ký khi đối tượng đổi
MVC       -> tách Model (dữ liệu), View (UI), Controller (đầu vào)
</code></pre>
<p>Mẫu là <em>giải pháp tái dùng</em> cho vấn đề thiết kế lặp lại — cho cả đội một vốn từ chung.</p>
<h3>Thiết kế UI / UX của hệ thống</h3>
<ul>
<li><strong>Điều hướng</strong> — một bản đồ rõ; người dùng luôn biết đang ở đâu và cách quay lại.</li>
<li><strong>Wireframe</strong> — bố cục màn hình phác thảo để thống nhất cấu trúc trước khi làm hình.</li>
<li><strong>Nhất quán</strong> — cùng một hành động trông và hoạt động giống nhau ở mọi nơi.</li>
</ul>
<div class="callout"><span class="badge">Hệ thống thật</span> Một web framework thường dùng MVC (controller nhận request, model truy vấn DB, view dựng HTML) và Observer để đẩy thông báo trực tiếp lên trình duyệt.</div>`,
  ]]);

const c7q = quiz('ita301-quiz-7', 'Quiz 7 — Design patterns & modularity|||Quiz 7 — Mẫu thiết kế & mô-đun', [
  { id: 'q1', question: 'Một thiết kế mô-đun tốt hướng tới?', options: ['Coupling cao, cohesion thấp', 'Coupling thấp, cohesion cao', 'Coupling cao, cohesion cao', 'Coupling thấp, cohesion thấp'], correctIndex: 1, explanation: 'Ít phụ thuộc nhau (low coupling) và mỗi mô-đun tập trung một việc (high cohesion).' },
  { id: 'q2', question: 'Mẫu thiết kế đảm bảo một lớp chỉ có đúng MỘT thực thể dùng chung là?', options: ['Factory', 'Observer', 'Singleton', 'MVC'], correctIndex: 2, explanation: 'Singleton giới hạn đúng một instance được chia sẻ.' },
  { id: 'q3', question: 'Trong MVC, thành phần nào chịu trách nhiệm xử lý đầu vào và điều phối?', options: ['Model', 'View', 'Controller', 'Database'], correctIndex: 2, explanation: 'Controller nhận input, điều phối Model và chọn View để hiển thị.' },
]);

const c8 = doc('ita301-8-1-implementation-maintenance', '8.1 — Implementation, testing & maintenance|||8.1 — Triển khai, kiểm thử & bảo trì',
  'Kiểm thử (unit/integration/system/acceptance); chiến lược chuyển đổi (direct/parallel/pilot/phased); đào tạo & tài liệu; bảo trì (sửa lỗi/thích nghi/hoàn thiện); quản lý dự án (phạm vi, lịch, rủi ro).',
  [[
    `<span class="eyebrow">ITA301 · Chapter 8 · Lesson 8.1</span>
<h2>Implementation, testing &amp; maintenance</h2>
<h3>Testing levels</h3>
<pre><code>Unit        -> one module in isolation
Integration -> modules working together
System      -> the whole system vs requirements
Acceptance  -> the customer confirms it meets their needs (UAT)
</code></pre>
<h3>Conversion strategies (going live)</h3>
<ul>
<li><strong>Direct (big bang)</strong> — switch off old, switch on new; cheapest but riskiest.</li>
<li><strong>Parallel</strong> — run old &amp; new together until confident; safest but costly.</li>
<li><strong>Pilot</strong> — roll out to one site/group first.</li>
<li><strong>Phased</strong> — introduce the system module by module.</li>
</ul>
<h3>Training, documentation &amp; maintenance</h3>
<p>Users need <strong>training</strong> and clear <strong>documentation</strong>. After go-live, <strong>maintenance</strong> takes over — usually the biggest cost over a system's life:</p>
<ul>
<li><strong>Corrective</strong> — fix defects.</li>
<li><strong>Adaptive</strong> — keep up with a changing environment (new OS, law, hardware).</li>
<li><strong>Perfective</strong> — add enhancements users ask for.</li>
</ul>
<h3>Project management</h3>
<p>Throughout, the analyst helps manage <strong>scope, schedule, cost &amp; risk</strong> — tools like Gantt charts and milestones keep the plan honest.</p>
<div class="callout"><span class="badge">Real system</span> A bank replacing its core system rarely does big-bang: it runs the new system in parallel for months, then does a phased regional rollout to limit risk.</div>`,
    `<span class="eyebrow">ITA301 · Chương 8 · Bài 8.1</span>
<h2>Triển khai, kiểm thử &amp; bảo trì</h2>
<h3>Các mức kiểm thử</h3>
<pre><code>Đơn vị (unit)   -> một mô-đun riêng lẻ
Tích hợp        -> các mô-đun chạy cùng nhau
Hệ thống        -> cả hệ thống so với yêu cầu
Chấp nhận (UAT) -> khách hàng xác nhận đáp ứng nhu cầu
</code></pre>
<h3>Chiến lược chuyển đổi (go-live)</h3>
<ul>
<li><strong>Trực tiếp (big bang)</strong> — tắt hệ cũ, bật hệ mới; rẻ nhất nhưng rủi ro nhất.</li>
<li><strong>Song song (parallel)</strong> — chạy cũ &amp; mới cùng lúc đến khi yên tâm; an toàn nhất nhưng tốn.</li>
<li><strong>Thí điểm (pilot)</strong> — triển khai ở một điểm/nhóm trước.</li>
<li><strong>Theo pha (phased)</strong> — đưa hệ thống vào từng mô-đun một.</li>
</ul>
<h3>Đào tạo, tài liệu &amp; bảo trì</h3>
<p>Người dùng cần <strong>đào tạo</strong> và <strong>tài liệu</strong> rõ. Sau go-live, <strong>bảo trì</strong> tiếp quản — thường là chi phí lớn nhất trong vòng đời hệ thống:</p>
<ul>
<li><strong>Sửa lỗi (corrective)</strong> — vá khiếm khuyết.</li>
<li><strong>Thích nghi (adaptive)</strong> — theo kịp môi trường đổi (OS, luật, phần cứng mới).</li>
<li><strong>Hoàn thiện (perfective)</strong> — thêm cải tiến người dùng yêu cầu.</li>
</ul>
<h3>Quản lý dự án</h3>
<p>Suốt quá trình, analyst giúp quản <strong>phạm vi, lịch, chi phí &amp; rủi ro</strong> — công cụ như biểu đồ Gantt và cột mốc giữ cho kế hoạch trung thực.</p>
<div class="callout"><span class="badge">Hệ thống thật</span> Ngân hàng thay hệ lõi hiếm khi big-bang: họ chạy song song hệ mới nhiều tháng, rồi triển khai theo pha từng vùng để giảm rủi ro.</div>`,
  ]]);

const c8q = quiz('ita301-quiz-8', 'Quiz 8 — Implementation & maintenance|||Quiz 8 — Triển khai & bảo trì', [
  { id: 'q1', question: 'Kiểm thử mà KHÁCH HÀNG xác nhận hệ thống đáp ứng nhu cầu của họ là?', options: ['Unit testing', 'Integration testing', 'Kiểm thử chấp nhận (acceptance/UAT)', 'System testing'], correctIndex: 2, explanation: 'UAT (acceptance testing) do khách hàng xác nhận đúng nhu cầu.' },
  { id: 'q2', question: 'Chiến lược chuyển đổi nào AN TOÀN nhất nhưng tốn kém do chạy hai hệ cùng lúc?', options: ['Trực tiếp (big bang)', 'Song song (parallel)', 'Thí điểm (pilot)', 'Theo pha (phased)'], correctIndex: 1, explanation: 'Parallel chạy cả hệ cũ và mới đến khi tin tưởng — an toàn nhưng tốn.' },
  { id: 'q3', question: 'Bảo trì để "theo kịp môi trường thay đổi (OS, luật, phần cứng mới)" gọi là?', options: ['Bảo trì sửa lỗi (corrective)', 'Bảo trì thích nghi (adaptive)', 'Bảo trì hoàn thiện (perfective)', 'Bảo trì phòng ngừa'], correctIndex: 1, explanation: 'Adaptive maintenance thích nghi hệ thống với môi trường đổi.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'ITA301',
    slug: 'ita301-information-system-analysis-and-design',
    title: 'Information System Analysis and Design',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ITA301.webp',
    shortDescription: 'Turn a business need into a buildable system: SDLC & requirements, process modeling (DFD), data modeling (ERD), UML analysis, architecture, database & interface design, testing & maintenance. Bilingual, with quizzes.|||Biến nhu cầu nghiệp vụ thành hệ thống làm được: SDLC & yêu cầu, mô hình quy trình (DFD), dữ liệu (ERD), phân tích UML, kiến trúc, thiết kế CSDL & giao diện, kiểm thử & bảo trì. Song ngữ, có quiz.',
    description: 'Môn <strong>ITA301 — Information System Analysis and Design</strong> (kỳ 4, ngành Hệ thống thông tin) dạy cách biến một nhu cầu nghiệp vụ còn rối thành đặc tả hệ thống làm được. Từ <strong>SDLC &amp; vai trò analyst</strong> → <strong>khảo sát &amp; viết yêu cầu</strong> → <strong>mô hình hoá quy trình (DFD)</strong> và <strong>dữ liệu (ERD, chuẩn hoá)</strong> → <strong>phân tích hướng đối tượng với UML</strong> (use case, class, sequence, activity) → <strong>thiết kế hệ thống</strong> (kiến trúc, giao diện, cơ sở dữ liệu) → <strong>thiết kế chi tiết &amp; mẫu</strong> → <strong>triển khai &amp; bảo trì</strong>. Bám sách chuẩn Kendall &amp; Kendall, Dennis, Satzinger; song ngữ, có ví dụ hệ thống thật và quiz mỗi chương.',
    whatYouLearn: 'SDLC và vai trò analyst; waterfall/iterative/agile; nghiên cứu khả thi; kỹ thuật thu thập yêu cầu; yêu cầu chức năng vs phi chức năng; DFD (context, phân rã, cân bằng); ERD, khoá chính/ngoại, lực lượng, từ điển dữ liệu, chuẩn hoá 1NF/2NF/3NF; UML use case/class/sequence/activity; kiến trúc ba lớp; thiết kế giao diện, input/output &amp; cơ sở dữ liệu; coupling/cohesion &amp; mẫu thiết kế (Singleton, Factory, Observer, MVC); kiểm thử, chiến lược chuyển đổi, bảo trì và quản lý dự án.',
    requirements: 'Kiến thức lập trình cơ bản và cơ sở dữ liệu nhập môn (bảng, khoá). Không cần kinh nghiệm dự án trước đó.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, UML docs, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Phân tích thiết kế HT là gì, vai trò analyst, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — SDLC & vai trò analyst|||Chapter 1 — SDLC & the analyst', description: 'SDLC, analyst, waterfall/iterative/agile.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khởi tạo & yêu cầu|||Chapter 2 — Initiation & requirements', description: 'Khả thi, thu thập yêu cầu, chức năng vs phi chức năng.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mô hình hoá quy trình (DFD)|||Chapter 3 — Process modeling (DFD)', description: 'DFD, context, phân rã, cân bằng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mô hình hoá dữ liệu (ERD)|||Chapter 4 — Data modeling (ERD)', description: 'ERD, khoá, lực lượng, chuẩn hoá.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân tích hướng đối tượng (UML)|||Chapter 5 — OO analysis (UML)', description: 'Use case, class, sequence, activity.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thiết kế hệ thống|||Chapter 6 — System design', description: 'Kiến trúc, giao diện, input/output, CSDL.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thiết kế chi tiết & mẫu|||Chapter 7 — Detailed design & patterns', description: 'Coupling/cohesion, design patterns, UI/UX.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Triển khai & bảo trì|||Chapter 8 — Implementation & maintenance', description: 'Kiểm thử, chuyển đổi, đào tạo, bảo trì, QLDA.', lessons: [c8, c8q] },
  ],
};
