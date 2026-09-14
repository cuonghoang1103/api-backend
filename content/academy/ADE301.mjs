/**
 * ADE301 — Visual Communication Project (Đồ án Thiết kế truyền thông thị giác).
 * Ngành Thiết kế mỹ thuật số, Kỳ 7, FPTU.
 * ⚠️ Đây là môn ĐỒ ÁN — khung theo QUY TRÌNH LÀM ĐỒ ÁN THẬT (8 giai đoạn),
 * KHÔNG phải 8 chương lý thuyết rời. Mỗi giai đoạn = 1 DOCUMENT song ngữ + 1 QUIZ.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "<"→&lt; trong text.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức giai đoạn.', quiz: { timeLimitSeconds: 300, questions } });

const taiLieu = doc('ade301-0-0-tai-lieu', '📚 Course materials &amp; references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền tảng, nguồn cảm hứng, công cụ, lộ trình làm đồ án.',
  [[
    `<span class="eyebrow">ADE301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to run a <strong>visual communication project</strong> end-to-end — from brief to portfolio — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal references. This is a <strong>project course</strong>, so treat every link as ammunition for your own deliverables, not chapters to memorise.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for ADE301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account. <strong>Do not upload the PDF</strong> here; read it on FLM.</p>
<h3>📗 Foundational books</h3>
<ul>
<li><em>Designing Brand Identity</em> — Alina Wheeler (the 5-phase brand process this course mirrors).</li>
<li><em>Making and Breaking the Grid</em> — Timothy Samara (layout &amp; grid systems).</li>
<li><em>Design Thinking</em> — IDEO (empathise → define → ideate → prototype → test).</li>
<li><em>Thinking with Type</em> — Ellen Lupton (typography in practice).</li>
</ul>
<h3>🌐 Inspiration &amp; benchmarking</h3>
<ul>
<li><a href="https://www.behance.net/" target="_blank" rel="noopener">Behance</a> — full case studies with process, not just final shots.</li>
<li><a href="https://dribbble.com/" target="_blank" rel="noopener">Dribbble</a> — visual exploration &amp; trends.</li>
<li><a href="https://designthinking.ideo.com/" target="_blank" rel="noopener">IDEO Design Thinking</a> — method &amp; toolkit.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — layout, prototype, FigJam moodboards.</li>
<li>Adobe Illustrator / Photoshop / InDesign — vector, image, print layout.</li>
<li><a href="https://coolors.co/" target="_blank" rel="noopener">Coolors</a> — palette generation; <a href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a> — type pairing.</li>
</ul>
<div class="callout"><span class="badge">How to use this course</span>
<ol>
<li><strong>Read the brief carefully</strong> — the grade lives in solving the stated communication problem, not in "pretty" work.</li>
<li><strong>Work in stages</strong> — do not jump to Illustrator before research and concept are locked.</li>
<li><strong>Document everything</strong> — moodboards, sketches, iterations. The process IS the deliverable.</li>
<li><strong>Build the portfolio as you go</strong> — a strong case study is worth more than the final poster alone.</li>
</ol></div>`,
    `<span class="eyebrow">ADE301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để chạy trọn một <strong>đồ án truyền thông thị giác</strong> — từ brief tới portfolio — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp. Đây là <strong>môn đồ án</strong>, nên hãy xem mỗi link là đạn dược cho sản phẩm của bạn, không phải chương để học thuộc.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ADE301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU. <strong>Đừng upload PDF</strong> lên đây; đọc trực tiếp trên FLM.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><em>Designing Brand Identity</em> — Alina Wheeler (quy trình 5 pha xây thương hiệu mà môn này bám theo).</li>
<li><em>Making and Breaking the Grid</em> — Timothy Samara (hệ thống layout &amp; lưới).</li>
<li><em>Design Thinking</em> — IDEO (empathise → define → ideate → prototype → test).</li>
<li><em>Thinking with Type</em> — Ellen Lupton (typography trong thực hành).</li>
</ul>
<h3>🌐 Cảm hứng &amp; đối sánh</h3>
<ul>
<li><a href="https://www.behance.net/" target="_blank" rel="noopener">Behance</a> — case study đầy đủ có quy trình, không chỉ ảnh cuối.</li>
<li><a href="https://dribbble.com/" target="_blank" rel="noopener">Dribbble</a> — khám phá thị giác &amp; xu hướng.</li>
<li><a href="https://designthinking.ideo.com/" target="_blank" rel="noopener">IDEO Design Thinking</a> — phương pháp &amp; bộ công cụ.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — layout, prototype, moodboard FigJam.</li>
<li>Adobe Illustrator / Photoshop / InDesign — vector, ảnh, layout in ấn.</li>
<li><a href="https://coolors.co/" target="_blank" rel="noopener">Coolors</a> — tạo bảng màu; <a href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a> — ghép font.</li>
</ul>
<div class="callout"><span class="badge">Cách dùng môn này</span>
<ol>
<li><strong>Đọc kỹ brief</strong> — điểm nằm ở việc giải đúng vấn đề truyền thông, không phải làm "đẹp".</li>
<li><strong>Làm theo giai đoạn</strong> — đừng nhảy vào Illustrator trước khi chốt nghiên cứu và concept.</li>
<li><strong>Ghi lại mọi thứ</strong> — moodboard, sketch, các bản lặp. Quy trình CHÍNH LÀ sản phẩm nộp.</li>
<li><strong>Dựng portfolio song song</strong> — một case study tốt giá trị hơn tấm poster cuối đơn lẻ.</li>
</ol></div>`,
  ]]);

const intro = doc('ade301-0-1-overview', 'Course overview: how this project runs|||Tổng quan: đồ án này chạy thế nào',
  'Đây là môn ĐỒ ÁN, không phải lý thuyết: deliverable, cách chấm (rubric), 8 giai đoạn quy trình, mốc nộp.',
  [[
    `<span class="eyebrow">ADE301 · Lesson 0.1 · Overview</span>
<h2>Visual Communication Project — how it runs</h2>
<p class="lead">ADE301 is a <strong>project (đồ án) course</strong>, not a set of eight disconnected theory chapters. You take a real communication brief and drive it, in stages, from <strong>problem</strong> to a finished <strong>system of deliverables</strong> plus a defended portfolio. You are assessed on the <em>process and the reasoning</em>, not only on the final artwork.</p>
<h3>What you deliver</h3>
<ul>
<li><strong>Project book / process document</strong> — brief analysis, research, moodboards, sketches, iterations.</li>
<li><strong>Design system</strong> — logo/mark, typography, colour, grid, usage rules (a mini brand guideline).</li>
<li><strong>Applied deliverables</strong> — e.g. poster, brochure, social kit, motion teaser.</li>
<li><strong>Presentation &amp; portfolio case study</strong> — you defend the decisions out loud.</li>
</ul>
<h3>How it is graded</h3>
<pre><code>Typical weighting (check FLM for the exact split):
  Process &amp; research    ~20%   depth of insight, benchmarking
  Concept &amp; strategy    ~25%   is the big idea sharp and on-brief?
  Design execution       ~30%   craft, system consistency, grid, type
  Presentation/defense   ~15%   clarity, rationale, Q&amp;A
  Portfolio case study   ~10%   documentation quality
</code></pre>
<h3>The 8 stages (roadmap)</h3>
<pre><code>1  Receive &amp; analyse the brief   -> problem + audience
2  Research &amp; insight            -> moodboard, benchmark, competitors
3  Creative strategy &amp; big idea  -> concept, message, tone
4  Ideation &amp; development        -> sketches, thumbnails, options
5  Design &amp; identity system      -> type, colour, layout, grid
6  Production of the deliverables -> poster/social/motion, guideline
7  Critique, revise &amp; test       -> feedback + audience testing
8  Present, defend &amp; portfolio   -> pitch + case study
</code></pre>
<div class="callout"><span class="badge">The golden rule</span> Every visual decision must trace back to the brief. If you cannot say <em>why</em> a colour, font or layout serves the communication goal and the audience, it is decoration — and decoration does not pass a project defense.</div>`,
    `<span class="eyebrow">ADE301 · Bài 0.1 · Tổng quan</span>
<h2>Đồ án Truyền thông thị giác — chạy thế nào</h2>
<p class="lead">ADE301 là <strong>môn đồ án</strong>, không phải tám chương lý thuyết rời rạc. Bạn nhận một brief truyền thông thật và dẫn nó, theo từng giai đoạn, từ <strong>vấn đề</strong> tới một <strong>hệ thống sản phẩm</strong> hoàn chỉnh cộng một portfolio được bảo vệ. Bạn được chấm trên <em>quy trình và lập luận</em>, không chỉ trên tấm hình cuối.</p>
<h3>Bạn nộp những gì</h3>
<ul>
<li><strong>Project book / tài liệu quy trình</strong> — phân tích brief, nghiên cứu, moodboard, sketch, các bản lặp.</li>
<li><strong>Hệ thống thiết kế</strong> — logo/mark, typography, màu, lưới, quy tắc dùng (một brand guideline thu nhỏ).</li>
<li><strong>Sản phẩm ứng dụng</strong> — vd poster, brochure, bộ social, teaser motion.</li>
<li><strong>Thuyết trình &amp; case study portfolio</strong> — bạn bảo vệ quyết định bằng lời.</li>
</ul>
<h3>Chấm điểm ra sao</h3>
<pre><code>Trọng số điển hình (xem FLM để biết tỉ lệ chính xác):
  Quy trình &amp; nghiên cứu   ~20%   độ sâu insight, đối sánh
  Concept &amp; chiến lược     ~25%   big idea có sắc &amp; đúng brief không?
  Thực thi thiết kế         ~30%   độ tinh, tính hệ thống, lưới, chữ
  Thuyết trình/bảo vệ       ~15%   rõ ràng, lý lẽ, hỏi-đáp
  Case study portfolio      ~10%   chất lượng ghi chép
</code></pre>
<h3>8 giai đoạn (lộ trình)</h3>
<pre><code>1  Nhận &amp; phân tích brief      -> vấn đề + đối tượng
2  Nghiên cứu &amp; insight        -> moodboard, benchmark, đối thủ
3  Chiến lược &amp; big idea        -> concept, thông điệp, tone
4  Phác thảo &amp; phát triển       -> sketch, thumbnail, phương án
5  Thiết kế &amp; hệ thống nhận diện-> chữ, màu, layout, lưới
6  Triển khai bộ sản phẩm        -> poster/social/motion, guideline
7  Phản biện, chỉnh &amp; kiểm thử  -> feedback + test với đối tượng
8  Trình bày, bảo vệ &amp; portfolio-> pitch + case study
</code></pre>
<div class="callout"><span class="badge">Quy tắc vàng</span> Mọi quyết định thị giác phải truy ngược về brief. Nếu bạn không nói được <em>vì sao</em> một màu, font hay layout phục vụ mục tiêu truyền thông và đối tượng, thì đó là trang trí — và trang trí không qua nổi buổi bảo vệ đồ án.</div>`,
  ]]);

const s1 = doc('ade301-1-1-brief', 'Stage 1 — Receive &amp; analyse the brief|||Giai đoạn 1 — Nhận &amp; phân tích brief',
  'Đọc và mổ brief, xác định vấn đề truyền thông thật, đối tượng mục tiêu, mục tiêu đo được, ràng buộc, tiêu chí thành công.',
  [[
    `<span class="eyebrow">ADE301 · Stage 1</span>
<h2>Receive &amp; analyse the brief</h2>
<p class="lead">A project lives or dies here. Before a single pixel is drawn you must convert a vague client request into a <strong>clear communication problem</strong>, a defined <strong>audience</strong>, and <strong>measurable objectives</strong>.</p>
<h3>Interrogate the brief</h3>
<ul>
<li><strong>Problem, not task.</strong> "Design a poster" is a task. "Get first-year students to attend the design club fair" is the problem. Solve the problem.</li>
<li><strong>Audience.</strong> Who exactly? Age, context, what they already think, where they will see this.</li>
<li><strong>Objective.</strong> What should the audience <em>do, feel, or know</em> afterwards — and how will you know it worked?</li>
<li><strong>Constraints.</strong> Deliverables, formats, sizes, deadline, budget, brand rules, do-not-touch items.</li>
</ul>
<h3>Rewrite it as a design brief</h3>
<pre><code>PROJECT BRIEF (one page)
- Problem:      what communication gap are we closing?
- Audience:     primary + secondary, in one sentence each
- Objective:    desired action/feeling + success metric
- Message:      the single most important thing to land
- Deliverables: list with formats + sizes
- Constraints:  deadline, brand, budget, mandatories
- Success:      "we win if ______"
</code></pre>
<div class="callout"><span class="badge">Deliverable of this stage</span> A one-page <strong>rewritten brief</strong> you and the client both sign off. Ambiguity resolved now costs minutes; discovered at production it costs the whole project.</div>`,
    `<span class="eyebrow">ADE301 · Giai đoạn 1</span>
<h2>Nhận &amp; phân tích brief</h2>
<p class="lead">Đồ án sống hay chết ở đây. Trước khi vẽ một pixel, bạn phải biến một yêu cầu mơ hồ của khách thành một <strong>vấn đề truyền thông rõ ràng</strong>, một <strong>đối tượng</strong> xác định, và <strong>mục tiêu đo được</strong>.</p>
<h3>Mổ xẻ brief</h3>
<ul>
<li><strong>Vấn đề, không phải việc.</strong> "Thiết kế một poster" là việc. "Khiến sinh viên năm nhất tới hội chợ CLB thiết kế" là vấn đề. Hãy giải vấn đề.</li>
<li><strong>Đối tượng.</strong> Chính xác là ai? Tuổi, bối cảnh, họ đang nghĩ gì, sẽ thấy cái này ở đâu.</li>
<li><strong>Mục tiêu.</strong> Sau đó đối tượng cần <em>làm, cảm, hay biết</em> điều gì — và làm sao bạn biết nó hiệu quả?</li>
<li><strong>Ràng buộc.</strong> Sản phẩm, định dạng, kích thước, deadline, ngân sách, quy tắc thương hiệu, thứ cấm động.</li>
</ul>
<h3>Viết lại thành design brief</h3>
<pre><code>BRIEF ĐỒ ÁN (một trang)
- Vấn đề:      ta đang lấp khoảng trống truyền thông nào?
- Đối tượng:   chính + phụ, mỗi thứ một câu
- Mục tiêu:    hành động/cảm xúc mong muốn + chỉ số thành công
- Thông điệp:  một điều quan trọng nhất phải chạm tới
- Sản phẩm:    liệt kê kèm định dạng + kích thước
- Ràng buộc:   deadline, thương hiệu, ngân sách, bắt buộc
- Thành công:  "ta thắng nếu ______"
</code></pre>
<div class="callout"><span class="badge">Sản phẩm giai đoạn này</span> Một <strong>brief viết lại</strong> một trang mà cả bạn và khách cùng chốt. Mơ hồ gỡ bây giờ tốn vài phút; phát hiện lúc triển khai thì tốn cả đồ án.</div>`,
  ]]);

const s1q = quiz('ade301-quiz-1', 'Quiz 1 — Brief|||Quiz 1 — Phân tích brief', [
  { id: 'q1', question: 'Điều quan trọng nhất cần rút ra khi phân tích brief là gì?', options: ['Chọn font đẹp', 'Vấn đề truyền thông + đối tượng mục tiêu', 'Bảng màu thời thượng', 'Số lượng poster'], correctIndex: 1, explanation: 'Brief phải chuyển thành vấn đề truyền thông rõ ràng và đối tượng xác định; mọi thứ khác đi sau.' },
  { id: 'q2', question: '"Thiết kế một poster" khác "vấn đề truyền thông" ở chỗ nào?', options: ['Không khác gì', 'Đó là một VIỆC (task), chưa nói được mục tiêu cần đạt với ai', 'Poster luôn là vấn đề', 'Vấn đề chỉ có ở đồ án lớn'], correctIndex: 1, explanation: 'Poster là task/đầu ra; vấn đề là kết quả cần đạt với một đối tượng cụ thể. Ta giải vấn đề, không làm task.' },
  { id: 'q3', question: 'Vì sao cần tiêu chí thành công (success metric) ngay từ giai đoạn 1?', options: ['Để trang trí brief', 'Để có thước đo đánh giá thiết kế có giải đúng vấn đề không', 'Vì giảng viên bắt buộc', 'Không cần thiết'], correctIndex: 1, explanation: 'Không có tiêu chí thành công thì không thể phán "thiết kế hiệu quả" — chỉ còn cảm tính đẹp/xấu.' },
]);

const s2 = doc('ade301-2-1-research', 'Stage 2 — Research &amp; insight|||Giai đoạn 2 — Nghiên cứu &amp; thu thập insight',
  'Nghiên cứu đối tượng &amp; bối cảnh, dựng moodboard, benchmark và phân tích đối thủ để tìm khoảng trống và insight dẫn ý tưởng.',
  [[
    `<span class="eyebrow">ADE301 · Stage 2</span>
<h2>Research &amp; insight</h2>
<p class="lead">Research is how you earn the right to have an opinion. You gather evidence about the audience, the context and the competitive field, then distil it into an <strong>insight</strong> — a true, useful, non-obvious statement that a concept can be built on.</p>
<h3>Three research fronts</h3>
<ul>
<li><strong>Audience &amp; context</strong> — interviews, observation, existing data. What do they value, fear, ignore?</li>
<li><strong>Benchmark</strong> — what does "good" look like in this category and beyond it? Collect references with a reason attached to each.</li>
<li><strong>Competitor analysis</strong> — how do rivals look and sound? Map them so you can deliberately look <em>different</em>, not accidentally the same.</li>
</ul>
<h3>Moodboard, done properly</h3>
<p>A moodboard is an argument, not a Pinterest dump. Each image justifies a direction — tone, colour, texture, type feeling. Cluster them and label the clusters.</p>
<pre><code>INSIGHT template
  Observation:  what we saw in research
  Tension:      the gap / contradiction / unmet need
  Insight:      "Because [observation], the audience actually
                 wants [X] — so the design must [Y]."
</code></pre>
<div class="callout"><span class="badge">Deliverable of this stage</span> A research summary + <strong>moodboard</strong> + a competitor map + one sharp <strong>insight statement</strong>. The insight is the bridge from research into the big idea.</div>`,
    `<span class="eyebrow">ADE301 · Giai đoạn 2</span>
<h2>Nghiên cứu &amp; thu thập insight</h2>
<p class="lead">Nghiên cứu là cách bạn giành quyền có ý kiến. Bạn thu bằng chứng về đối tượng, bối cảnh và bức tranh cạnh tranh, rồi cô lại thành <strong>insight</strong> — một mệnh đề đúng, hữu ích, không hiển nhiên, để concept bám vào.</p>
<h3>Ba mặt trận nghiên cứu</h3>
<ul>
<li><strong>Đối tượng &amp; bối cảnh</strong> — phỏng vấn, quan sát, dữ liệu có sẵn. Họ coi trọng gì, sợ gì, phớt lờ gì?</li>
<li><strong>Benchmark</strong> — "tốt" trong ngành này và ngoài nó trông thế nào? Gom tham chiếu kèm lý do cho từng cái.</li>
<li><strong>Phân tích đối thủ</strong> — đối thủ nhìn và nói ra sao? Vẽ bản đồ để bạn cố tình khác đi, không vô tình giống.</li>
</ul>
<h3>Moodboard làm đúng cách</h3>
<p>Moodboard là một lập luận, không phải bãi ảnh Pinterest. Mỗi ảnh biện minh cho một hướng — tone, màu, chất liệu, cảm giác chữ. Gom cụm và đặt tên cho cụm.</p>
<pre><code>Mẫu INSIGHT
  Quan sát:  ta thấy gì trong nghiên cứu
  Căng thẳng: khoảng trống / mâu thuẫn / nhu cầu chưa được đáp
  Insight:   "Vì [quan sát], đối tượng thật ra muốn [X] —
              nên thiết kế phải [Y]."
</code></pre>
<div class="callout"><span class="badge">Sản phẩm giai đoạn này</span> Bản tóm tắt nghiên cứu + <strong>moodboard</strong> + bản đồ đối thủ + một <strong>insight</strong> sắc. Insight là cây cầu từ nghiên cứu sang big idea.</div>`,
  ]]);

const s2q = quiz('ade301-quiz-2', 'Quiz 2 — Research|||Quiz 2 — Nghiên cứu', [
  { id: 'q1', question: 'Một moodboard tốt khác một bãi ảnh sưu tầm ở điểm nào?', options: ['Nhiều ảnh hơn', 'Mỗi ảnh biện minh cho một hướng (tone/màu/chất liệu), có gom cụm & đặt tên', 'Toàn ảnh đẹp', 'Chỉ lấy từ Dribbble'], correctIndex: 1, explanation: 'Moodboard là một lập luận có chủ đích: mỗi ảnh phục vụ một quyết định hướng thẩm mỹ, không phải góp cho vui.' },
  { id: 'q2', question: 'Mục đích chính của phân tích đối thủ (competitor analysis) là gì?', options: ['Sao chép đối thủ mạnh nhất', 'Biết bức tranh chung để chủ động khác biệt, không vô tình trùng lặp', 'Chê đối thủ', 'Đếm số đối thủ'], correctIndex: 1, explanation: 'Vẽ bản đồ đối thủ giúp bạn định vị khác biệt có chủ đích thay vì tình cờ giống họ.' },
  { id: 'q3', question: 'Insight trong nghiên cứu là gì?', options: ['Một tấm ảnh đẹp', 'Mệnh đề đúng, hữu ích, không hiển nhiên — cầu nối từ nghiên cứu sang ý tưởng', 'Danh sách màu', 'Số liệu khảo sát thô'], correctIndex: 1, explanation: 'Insight cô đọng quan sát thành một phát hiện dẫn hướng cho big idea; nó không phải dữ liệu thô hay ảnh.' },
]);

const s3 = doc('ade301-3-1-strategy', 'Stage 3 — Creative strategy &amp; big idea|||Giai đoạn 3 — Chiến lược sáng tạo &amp; big idea',
  'Từ insight ra chiến lược sáng tạo: concept/big idea, thông điệp cốt lõi, giọng điệu (tone of voice) và định hướng thị giác.',
  [[
    `<span class="eyebrow">ADE301 · Stage 3</span>
<h2>Creative strategy &amp; big idea</h2>
<p class="lead">The strategy turns the insight into a <strong>big idea</strong> — one central creative concept that everything else expresses. A big idea is memorable, ownable, and flexible enough to run across every deliverable.</p>
<h3>The building blocks</h3>
<ul>
<li><strong>Concept / big idea</strong> — the organising thought. Test: can you say it in one line, and does it come <em>from</em> the insight?</li>
<li><strong>Core message</strong> — the single takeaway, phrased for the audience.</li>
<li><strong>Tone of voice</strong> — playful? authoritative? warm? It governs copy AND visuals.</li>
<li><strong>Visual direction</strong> — the mood the design will carry, stated in words before any layout exists.</li>
</ul>
<h3>Pressure-test the idea</h3>
<pre><code>The big-idea checklist
  [ ] On-brief?     solves the stated problem
  [ ] Insight-led?  grows from the research, not a whim
  [ ] Single?       one idea, not three stapled together
  [ ] Ownable?      a competitor could not run the same line
  [ ] Extendable?   works on poster AND social AND motion
</code></pre>
<div class="callout"><span class="badge">Deliverable of this stage</span> A one-line <strong>concept statement</strong> + core message + tone of voice + a short written visual direction. Lock this before you design — it is the contract the rest of the project answers to.</div>`,
    `<span class="eyebrow">ADE301 · Giai đoạn 3</span>
<h2>Chiến lược sáng tạo &amp; big idea</h2>
<p class="lead">Chiến lược biến insight thành một <strong>big idea</strong> — một concept sáng tạo trung tâm mà mọi thứ khác diễn đạt. Big idea phải dễ nhớ, "sở hữu được", và đủ linh hoạt để chạy qua mọi sản phẩm.</p>
<h3>Các khối cấu thành</h3>
<ul>
<li><strong>Concept / big idea</strong> — ý tưởng tổ chức. Kiểm: nói được trong một câu không, và có sinh <em>từ</em> insight không?</li>
<li><strong>Thông điệp cốt lõi</strong> — điều duy nhất cần đọng lại, viết cho đối tượng.</li>
<li><strong>Tone of voice (giọng điệu)</strong> — tinh nghịch? uy tín? ấm áp? Nó chi phối cả câu chữ LẪN thị giác.</li>
<li><strong>Định hướng thị giác</strong> — tâm trạng thiết kế sẽ mang, nói bằng lời trước khi có layout.</li>
</ul>
<h3>Ép ý tưởng chịu áp lực</h3>
<pre><code>Checklist big idea
  [ ] Đúng brief?    giải đúng vấn đề đã nêu
  [ ] Dẫn từ insight? mọc từ nghiên cứu, không phải ngẫu hứng
  [ ] Duy nhất?      một ý, không ghim ba ý vào nhau
  [ ] Sở hữu được?   đối thủ không thể chạy cùng câu đó
  [ ] Mở rộng được?  chạy trên poster VÀ social VÀ motion
</code></pre>
<div class="callout"><span class="badge">Sản phẩm giai đoạn này</span> Một <strong>concept statement</strong> một dòng + thông điệp cốt lõi + tone of voice + một định hướng thị giác viết ngắn. Chốt cái này trước khi thiết kế — đó là bản hợp đồng mà phần còn lại của đồ án phải trả lời.</div>`,
  ]]);

const s3q = quiz('ade301-quiz-3', 'Quiz 3 — Strategy|||Quiz 3 — Chiến lược & big idea', [
  { id: 'q1', question: 'Một big idea tốt cần đặc điểm nào?', options: ['Càng nhiều ý càng tốt', 'Duy nhất, dẫn từ insight, đúng brief và mở rộng được qua nhiều sản phẩm', 'Chỉ cần nhìn đẹp', 'Sao chép xu hướng mới nhất'], correctIndex: 1, explanation: 'Big idea là MỘT ý tổ chức, sinh từ insight, giải đúng brief và chạy được trên mọi deliverable.' },
  { id: 'q2', question: 'Tone of voice (giọng điệu) chi phối những gì?', options: ['Chỉ câu chữ', 'Chỉ hình ảnh', 'Cả câu chữ lẫn thị giác của toàn bộ sản phẩm', 'Chỉ logo'], correctIndex: 2, explanation: 'Tone of voice thống nhất cả nội dung chữ và cảm giác thị giác để thương hiệu nói cùng một "giọng".' },
  { id: 'q3', question: 'Vì sao phải chốt concept statement TRƯỚC khi vào thiết kế?', options: ['Để nộp cho đủ bài', 'Vì nó là "hợp đồng" mà mọi quyết định thiết kế sau phải trả lời', 'Không cần, cứ thiết kế trước', 'Để chọn phần mềm'], correctIndex: 1, explanation: 'Concept chốt sớm giúp mọi lựa chọn màu/chữ/layout có neo; thiết kế trước rồi gán concept sau dễ rời rạc.' },
]);

const s4 = doc('ade301-4-1-ideation', 'Stage 4 — Ideation &amp; development|||Giai đoạn 4 — Phác thảo &amp; phát triển ý tưởng',
  'Bung ý tưởng bằng sketch/thumbnail, tạo nhiều phương án khác nhau, rồi sàng lọc theo concept để chọn 2-3 hướng phát triển.',
  [[
    `<span class="eyebrow">ADE301 · Stage 4</span>
<h2>Ideation &amp; development</h2>
<p class="lead">Now you generate <strong>many</strong> visual translations of the big idea — fast, cheap, on paper — before committing to software. Quantity first, then ruthless selection.</p>
<h3>Diverge, then converge</h3>
<ul>
<li><strong>Thumbnails</strong> — tiny, quick sketches. Aim for dozens; do not judge while drawing.</li>
<li><strong>Explore genuinely different routes</strong> — typographic, illustrative, photographic, symbolic. Three <em>variations of one</em> idea is not three ideas.</li>
<li><strong>Converge</strong> — score each route against the concept and brief; keep 2–3 to develop.</li>
<li><strong>Develop</strong> — tighten the survivors into rough comps you can react to.</li>
</ul>
<h3>Selection criteria</h3>
<pre><code>Score each route 1-5
  Fit to concept ......  does it express the big idea?
  Fit to audience .....  will THEY read it correctly?
  Distinctiveness .....  does it stand apart from competitors?
  Feasibility .........  can you execute it well in the time?
  Extendability .......  will it survive across all deliverables?
</code></pre>
<div class="callout"><span class="badge">Deliverable of this stage</span> A spread of <strong>sketches/thumbnails</strong> showing real breadth, plus <strong>2–3 developed directions</strong> with a written rationale for why they were chosen. Keep the rejected ones — they show the thinking in your case study.</div>`,
    `<span class="eyebrow">ADE301 · Giai đoạn 4</span>
<h2>Phác thảo &amp; phát triển ý tưởng</h2>
<p class="lead">Giờ bạn tạo <strong>nhiều</strong> cách dịch big idea sang thị giác — nhanh, rẻ, trên giấy — trước khi cam kết với phần mềm. Số lượng trước, rồi sàng lọc thẳng tay.</p>
<h3>Bung ra, rồi thu lại</h3>
<ul>
<li><strong>Thumbnail</strong> — sketch nhỏ, nhanh. Nhắm hàng chục cái; đừng phán xét trong lúc vẽ.</li>
<li><strong>Thử các hướng thật sự khác nhau</strong> — theo chữ, minh hoạ, nhiếp ảnh, biểu tượng. Ba <em>biến thể của một</em> ý không phải ba ý.</li>
<li><strong>Thu lại</strong> — chấm mỗi hướng theo concept và brief; giữ 2–3 để phát triển.</li>
<li><strong>Phát triển</strong> — siết các bản sống sót thành comp thô để có cái mà phản ứng.</li>
</ul>
<h3>Tiêu chí chọn lọc</h3>
<pre><code>Chấm mỗi hướng 1-5
  Khớp concept ........  có diễn đạt big idea không?
  Khớp đối tượng ......  HỌ có đọc đúng không?
  Khác biệt ...........  có nổi tách khỏi đối thủ không?
  Khả thi .............  làm tốt được trong thời gian không?
  Mở rộng .............  sống sót qua mọi sản phẩm không?
</code></pre>
<div class="callout"><span class="badge">Sản phẩm giai đoạn này</span> Một loạt <strong>sketch/thumbnail</strong> cho thấy độ rộng thật, cộng <strong>2–3 hướng đã phát triển</strong> kèm lý do chọn viết ra. Giữ cả bản bị loại — chúng thể hiện tư duy trong case study.</div>`,
  ]]);

const s4q = quiz('ade301-quiz-4', 'Quiz 4 — Ideation|||Quiz 4 — Phác thảo', [
  { id: 'q1', question: 'Vì sao phác thảo thumbnail trên giấy trước khi vào phần mềm?', options: ['Vì máy tính chậm', 'Để bung nhiều ý nhanh & rẻ, tránh cam kết sớm vào một hướng', 'Vì giảng viên cấm dùng máy', 'Không có lý do'], correctIndex: 1, explanation: 'Sketch nhanh giúp tạo số lượng lớn phương án với chi phí thấp; vào phần mềm sớm dễ bị dính vào một hướng chưa chọn kỹ.' },
  { id: 'q2', question: '"Ba biến thể của một ý" có phải là ba ý tưởng khác nhau không?', options: ['Có', 'Không — đó vẫn là một ý; cần các hướng thật sự khác (chữ/minh hoạ/ảnh/biểu tượng)', 'Tuỳ giảng viên', 'Chỉ khi đổi màu'], correctIndex: 1, explanation: 'Đa dạng thật đến từ các hướng tiếp cận khác nhau, không phải chỉnh sửa nhỏ trên cùng một concept thị giác.' },
  { id: 'q3', question: 'Nên làm gì với các phương án bị loại?', options: ['Xoá ngay cho gọn', 'Giữ lại để thể hiện quy trình tư duy trong case study', 'Nộp hết cho khách', 'Không quan trọng'], correctIndex: 1, explanation: 'Phương án bị loại là bằng chứng của quá trình cân nhắc — rất giá trị khi trình bày và làm portfolio.' },
]);

const s5 = doc('ade301-5-1-system', 'Stage 5 — Design &amp; identity system|||Giai đoạn 5 — Thiết kế &amp; hệ thống nhận diện',
  'Xây hệ thống thị giác nhất quán: typography, bảng màu, layout &amp; lưới (grid), và các phần tử nhận diện lặp lại.',
  [[
    `<span class="eyebrow">ADE301 · Stage 5</span>
<h2>Design &amp; identity system</h2>
<p class="lead">A single nice poster is not a project. You build a <strong>system</strong> — the repeatable rules for type, colour, layout and elements — so every deliverable feels like one family. Consistency is what turns a design into an identity.</p>
<h3>The system pillars</h3>
<ul>
<li><strong>Typography</strong> — a type pairing (often one display + one text face), a scale, and clear hierarchy (Lupton, <em>Thinking with Type</em>).</li>
<li><strong>Colour</strong> — a purposeful palette: primary, secondary, accent, plus meaning and contrast/accessibility.</li>
<li><strong>Layout &amp; grid</strong> — a grid gives alignment, rhythm and reusability (Samara, <em>Making and Breaking the Grid</em>).</li>
<li><strong>Signature elements</strong> — logo/mark, shapes, textures, image treatment that recur and become recognisable.</li>
</ul>
<h3>Grid basics</h3>
<pre><code>A grid gives you:
  Columns  -> where content sits (e.g. 12 columns)
  Gutters  -> consistent spacing between columns
  Margins  -> breathing room at the edges
  Baseline -> vertical rhythm for text
Break the grid ON PURPOSE for emphasis - never by accident.
</code></pre>
<div class="callout"><span class="badge">Deliverable of this stage</span> A <strong>mini brand/style system</strong>: type specimen, colour palette with values, grid definition and the signature elements — the toolkit every applied piece in Stage 6 is built from.</div>`,
    `<span class="eyebrow">ADE301 · Giai đoạn 5</span>
<h2>Thiết kế &amp; hệ thống nhận diện</h2>
<p class="lead">Một tấm poster đẹp đơn lẻ không phải là đồ án. Bạn xây một <strong>hệ thống</strong> — bộ quy tắc lặp lại cho chữ, màu, layout và phần tử — để mọi sản phẩm cảm giác như cùng một gia đình. Tính nhất quán là thứ biến thiết kế thành nhận diện.</p>
<h3>Các trụ của hệ thống</h3>
<ul>
<li><strong>Typography</strong> — một cặp font (thường một display + một text), một thang cỡ, và phân cấp rõ (Lupton, <em>Thinking with Type</em>).</li>
<li><strong>Màu</strong> — bảng màu có chủ đích: chính, phụ, nhấn, kèm ý nghĩa và tương phản/khả dụng.</li>
<li><strong>Layout &amp; lưới (grid)</strong> — lưới cho căn hàng, nhịp điệu và tái sử dụng (Samara, <em>Making and Breaking the Grid</em>).</li>
<li><strong>Phần tử ký hiệu</strong> — logo/mark, hình khối, chất liệu, cách xử lý ảnh lặp lại và trở nên nhận ra được.</li>
</ul>
<h3>Nền tảng về lưới</h3>
<pre><code>Lưới cho bạn:
  Cột (columns) -> chỗ nội dung nằm (vd 12 cột)
  Gutter        -> khoảng cách nhất quán giữa các cột
  Lề (margins)  -> khoảng thở ở rìa
  Baseline      -> nhịp dọc cho chữ
Phá lưới CÓ CHỦ ĐÍCH để nhấn - đừng bao giờ phá do vô tình.
</code></pre>
<div class="callout"><span class="badge">Sản phẩm giai đoạn này</span> Một <strong>hệ thống nhận diện thu nhỏ</strong>: type specimen, bảng màu kèm giá trị, định nghĩa lưới và các phần tử ký hiệu — bộ công cụ để dựng mọi sản phẩm ứng dụng ở Giai đoạn 6.</div>`,
  ]]);

const s5q = quiz('ade301-quiz-5', 'Quiz 5 — Identity system|||Quiz 5 — Hệ thống nhận diện', [
  { id: 'q1', question: 'Vì sao cần xây một "hệ thống" thay vì chỉ một sản phẩm đẹp?', options: ['Để nộp nhiều file hơn', 'Để mọi deliverable nhất quán như một gia đình — nhận diện, không phải tấm hình rời', 'Vì giảng viên yêu cầu số lượng', 'Không cần thiết'], correctIndex: 1, explanation: 'Tính nhất quán của type/màu/lưới/phần tử biến thiết kế rời thành một nhận diện thống nhất.' },
  { id: 'q2', question: 'Lưới (grid) mang lại điều gì trong layout?', options: ['Làm layout cứng nhắc vô ích', 'Căn hàng, nhịp điệu và khả năng tái sử dụng nhất quán', 'Chỉ để trang trí', 'Bắt buộc 12 cột mọi lúc'], correctIndex: 1, explanation: 'Grid tạo alignment, rhythm và reusability; phá lưới là có chủ đích để nhấn, không phải do cẩu thả.' },
  { id: 'q3', question: 'Một hệ thống typography tối thiểu nên có gì?', options: ['Càng nhiều font càng tốt', 'Cặp font hợp lý, thang cỡ và phân cấp rõ ràng', 'Chỉ một font duy nhất cho mọi thứ', 'Font theo cảm hứng từng trang'], correctIndex: 1, explanation: 'Cặp font + thang cỡ + hierarchy đảm bảo đọc được và nhất quán; nhồi nhiều font phá vỡ hệ thống.' },
]);

const s6 = doc('ade301-6-1-production', 'Stage 6 — Production of the deliverables|||Giai đoạn 6 — Triển khai bộ sản phẩm',
  'Áp hệ thống vào bộ sản phẩm thật: poster, brochure, bộ social, motion teaser; đóng gói thành brand guideline & chuẩn bị file.',
  [[
    `<span class="eyebrow">ADE301 · Stage 6</span>
<h2>Production of the deliverables</h2>
<p class="lead">Now the system meets the real world. You apply the identity to every required <strong>deliverable</strong>, keeping the family resemblance while respecting each medium's constraints.</p>
<h3>Common deliverables &amp; their rules</h3>
<ul>
<li><strong>Poster</strong> — one dominant message, readable at distance, print-safe (bleed, CMYK, resolution).</li>
<li><strong>Brochure</strong> — a reading sequence; the grid carries multi-page flow.</li>
<li><strong>Social kit</strong> — multiple ratios (feed, story), safe zones, legible on small screens.</li>
<li><strong>Motion teaser</strong> — the system in time: pacing, entrances, a sound-off-first mindset.</li>
</ul>
<h3>Package it: the brand guideline</h3>
<pre><code>BRAND GUIDELINE (mini) contents
  - Logo: clear space, min size, do's &amp; don'ts
  - Colour: values (HEX/RGB/CMYK) + usage
  - Type: fonts, scale, hierarchy
  - Grid &amp; layout principles
  - Imagery / iconography style
  - Applied examples (the deliverables above)
</code></pre>
<div class="callout"><span class="badge">Deliverable of this stage</span> The full <strong>set of applied pieces</strong> plus a <strong>mini brand guideline</strong> that documents the rules. Prepare production-ready files (correct sizes, colour mode, exports) — a defense is undermined by a blurry export.</div>`,
    `<span class="eyebrow">ADE301 · Giai đoạn 6</span>
<h2>Triển khai bộ sản phẩm</h2>
<p class="lead">Giờ hệ thống gặp thế giới thật. Bạn áp nhận diện lên mọi <strong>sản phẩm</strong> yêu cầu, giữ nét gia đình trong khi tôn trọng ràng buộc của từng phương tiện.</p>
<h3>Sản phẩm thường gặp &amp; quy tắc</h3>
<ul>
<li><strong>Poster</strong> — một thông điệp trội, đọc được từ xa, an toàn khi in (bleed, CMYK, độ phân giải).</li>
<li><strong>Brochure</strong> — một trình tự đọc; lưới gánh dòng chảy nhiều trang.</li>
<li><strong>Bộ social</strong> — nhiều tỉ lệ (feed, story), vùng an toàn, đọc được trên màn nhỏ.</li>
<li><strong>Motion teaser</strong> — hệ thống trong thời gian: nhịp, cách vào, tư duy "tắt tiếng vẫn hiểu".</li>
</ul>
<h3>Đóng gói: brand guideline</h3>
<pre><code>Nội dung BRAND GUIDELINE (thu nhỏ)
  - Logo: vùng thở, cỡ tối thiểu, nên &amp; không nên
  - Màu: giá trị (HEX/RGB/CMYK) + cách dùng
  - Chữ: font, thang cỡ, phân cấp
  - Nguyên tắc lưới &amp; layout
  - Phong cách ảnh / icon
  - Ví dụ ứng dụng (các sản phẩm ở trên)
</code></pre>
<div class="callout"><span class="badge">Sản phẩm giai đoạn này</span> Trọn <strong>bộ sản phẩm ứng dụng</strong> cộng một <strong>brand guideline thu nhỏ</strong> ghi lại quy tắc. Chuẩn bị file sẵn sàng sản xuất (đúng kích thước, hệ màu, export) — một bản export mờ có thể phá cả buổi bảo vệ.</div>`,
  ]]);

const s6q = quiz('ade301-quiz-6', 'Quiz 6 — Production|||Quiz 6 — Triển khai', [
  { id: 'q1', question: 'Khi áp hệ thống lên nhiều phương tiện (poster, social, motion), điều cốt lõi cần giữ là gì?', options: ['Mỗi phương tiện một phong cách riêng biệt', 'Nét gia đình (family resemblance) nhất quán trong khi tôn trọng ràng buộc từng phương tiện', 'Dùng đúng một layout cho mọi thứ', 'Càng nhiều màu càng tốt'], correctIndex: 1, explanation: 'Hệ thống phải nhận ra được xuyên suốt (nhất quán) nhưng vẫn thích ứng ràng buộc riêng của từng kênh.' },
  { id: 'q2', question: 'Brand guideline (mini) dùng để làm gì?', options: ['Trang trí portfolio', 'Ghi lại quy tắc dùng logo/màu/chữ/lưới để ai cũng áp dụng nhất quán', 'Thay cho thiết kế', 'Chỉ để nộp cho đủ'], correctIndex: 1, explanation: 'Guideline tài liệu hoá hệ thống để nhận diện được áp dụng đúng và nhất quán về sau.' },
  { id: 'q3', question: 'Vì sao phải chuẩn bị file "sẵn sàng sản xuất" (đúng kích thước, hệ màu, export)?', options: ['Không quan trọng', 'Vì bản in/export sai (mờ, sai màu) làm hỏng cả chất lượng cảm nhận và buổi bảo vệ', 'Chỉ để làm màu', 'Vì phần mềm bắt buộc'], correctIndex: 1, explanation: 'Chi tiết kỹ thuật (bleed, CMYK, độ phân giải, tỉ lệ) quyết định sản phẩm cuối trông chuyên nghiệp hay lỗi.' },
]);

const s7 = doc('ade301-7-1-critique', 'Stage 7 — Critique, revise &amp; test|||Giai đoạn 7 — Phản biện, chỉnh sửa &amp; kiểm thử',
  'Nhận phản biện có cấu trúc, lặp chỉnh sửa, và kiểm thử với chính đối tượng mục tiêu để xác nhận thông điệp truyền đạt đúng.',
  [[
    `<span class="eyebrow">ADE301 · Stage 7</span>
<h2>Critique, revise &amp; test</h2>
<p class="lead">Design is iterative. Before the final defense you subject the work to <strong>critique</strong>, revise deliberately, and <strong>test it on the real audience</strong> — because the only opinion that ultimately matters is whether the target reads it as intended.</p>
<h3>Run a useful critique</h3>
<ul>
<li><strong>Present the problem first</strong> — critics need the brief to judge fit, not taste.</li>
<li><strong>Ask specific questions</strong> — "does the hierarchy lead the eye to the CTA?" beats "do you like it?".</li>
<li><strong>Separate signal from noise</strong> — a recurring reaction is data; one loud opinion is not.</li>
</ul>
<h3>Test with the audience</h3>
<pre><code>Quick audience test
  1  Show the piece for ~5 seconds (attention is short)
  2  Ask: "What is this about? What should you do?"
  3  If they can't answer -> the message failed, not them
  4  Note where the eye went first (hierarchy check)
  5  Revise the ONE thing that broke, retest
</code></pre>
<div class="callout"><span class="badge">Deliverable of this stage</span> A documented <strong>before/after</strong> with the feedback and test findings that drove each change. "We changed X because testing showed Y" is exactly the reasoning a defense rewards — and never take a change you cannot justify.</div>`,
    `<span class="eyebrow">ADE301 · Giai đoạn 7</span>
<h2>Phản biện, chỉnh sửa &amp; kiểm thử</h2>
<p class="lead">Thiết kế là lặp. Trước buổi bảo vệ cuối, bạn đưa bài qua <strong>phản biện</strong>, chỉnh sửa có chủ đích, và <strong>kiểm thử trên đối tượng thật</strong> — vì ý kiến cuối cùng đáng kể duy nhất là liệu đối tượng có đọc đúng như bạn định hay không.</p>
<h3>Chạy một buổi phản biện có ích</h3>
<ul>
<li><strong>Trình vấn đề trước</strong> — người phản biện cần brief để chấm độ khớp, không phải gu.</li>
<li><strong>Hỏi câu cụ thể</strong> — "phân cấp có dẫn mắt tới CTA không?" hơn hẳn "bạn có thích không?".</li>
<li><strong>Tách tín hiệu khỏi nhiễu</strong> — phản ứng lặp lại là dữ liệu; một ý kiến to đơn lẻ thì không.</li>
</ul>
<h3>Kiểm thử với đối tượng</h3>
<pre><code>Kiểm thử nhanh với đối tượng
  1  Cho xem sản phẩm ~5 giây (chú ý rất ngắn)
  2  Hỏi: "Cái này nói về gì? Bạn nên làm gì?"
  3  Nếu họ không trả lời được -> thông điệp hỏng, không phải họ
  4  Ghi mắt họ nhìn vào đâu trước (kiểm phân cấp)
  5  Sửa ĐÚNG MỘT thứ bị vỡ, rồi kiểm lại
</code></pre>
<div class="callout"><span class="badge">Sản phẩm giai đoạn này</span> Một bản <strong>trước/sau</strong> có ghi feedback và kết quả kiểm thử dẫn tới từng thay đổi. "Ta đổi X vì kiểm thử cho thấy Y" chính là lập luận mà buổi bảo vệ tưởng thưởng — và đừng nhận thay đổi nào bạn không biện minh được.</div>`,
  ]]);

const s7q = quiz('ade301-quiz-7', 'Quiz 7 — Critique & test|||Quiz 7 — Phản biện & kiểm thử', [
  { id: 'q1', question: 'Câu hỏi nào hữu ích hơn trong một buổi phản biện thiết kế?', options: ['"Bạn có thích nó không?"', '"Phân cấp có dẫn mắt tới CTA không?" — câu cụ thể, gắn với mục tiêu', '"Màu này hợp thời không?"', '"Bao lâu thì xong?"'], correctIndex: 1, explanation: 'Câu hỏi cụ thể gắn với brief/mục tiêu tạo phản hồi hành động được; "thích/không thích" chỉ là gu cá nhân.' },
  { id: 'q2', question: 'Nếu đối tượng thử không hiểu sản phẩm nói gì sau ~5 giây, kết luận đúng là?', options: ['Đối tượng kém, chọn người khác', 'Thông điệp/phân cấp đang hỏng và cần chỉnh, không phải lỗi của họ', 'Bỏ qua, cứ giữ nguyên', 'Thêm nhiều chữ vào'], correctIndex: 1, explanation: 'Kiểm thử đo hiệu quả truyền đạt: người xem không đọc ra thông điệp nghĩa là thiết kế cần sửa.' },
  { id: 'q3', question: 'Cách phân biệt phản hồi đáng theo và ý kiến nhiễu là gì?', options: ['Nghe người nói to nhất', 'Phản ứng LẶP LẠI ở nhiều người là dữ liệu; một ý kiến đơn lẻ thì chưa', 'Chỉ nghe giảng viên', 'Bỏ hết mọi phản hồi'], correctIndex: 1, explanation: 'Mẫu lặp lại (pattern) đáng tin hơn một tiếng nói lớn đơn lẻ; đó là cách tách tín hiệu khỏi nhiễu.' },
]);

const s8 = doc('ade301-8-1-present', 'Stage 8 — Present, defend &amp; portfolio|||Giai đoạn 8 — Trình bày, bảo vệ đồ án &amp; portfolio',
  'Kể câu chuyện đồ án từ vấn đề tới giải pháp, bảo vệ quyết định trước hội đồng, và dựng case study portfolio (Behance).',
  [[
    `<span class="eyebrow">ADE301 · Stage 8</span>
<h2>Present, defend &amp; portfolio</h2>
<p class="lead">A project you cannot explain is a project you cannot pass. The final stage is <strong>storytelling and rationale</strong>: you walk the panel from the problem to the solution, defend your decisions, and package it all as a portfolio case study.</p>
<h3>Structure the presentation as a story</h3>
<pre><code>Presentation arc
  1  The problem   -> the brief, audience, objective
  2  The insight   -> what research revealed
  3  The big idea   -> your concept, in one line
  4  The system     -> type, colour, grid
  5  The work        -> deliverables in context (mockups)
  6  The proof        -> testing / results
  7  The ask          -> next steps / impact
</code></pre>
<h3>Defend, don't decorate</h3>
<p>For every major choice, be ready to answer "why?" with the brief, the insight or a test result. "It looked nice" fails; "we chose this typeface because the audience is X and the tone is Y" passes.</p>
<h3>Turn it into a portfolio piece</h3>
<p>On <a href="https://www.behance.net/" target="_blank" rel="noopener">Behance</a> or your own site, show <em>process</em>, not just the hero shot: problem → research → concept → system → deliverables (in realistic mockups) → outcome. A documented case study is what gets you hired.</p>
<div class="callout"><span class="badge">Deliverable of this stage</span> A <strong>presentation deck</strong>, a spoken <strong>defense</strong>, and a published <strong>portfolio case study</strong>. This is the moment the whole 8-stage process pays off — the story is as graded as the artwork.</div>`,
    `<span class="eyebrow">ADE301 · Giai đoạn 8</span>
<h2>Trình bày, bảo vệ đồ án &amp; portfolio</h2>
<p class="lead">Một đồ án bạn không giải thích được là đồ án bạn không qua được. Giai đoạn cuối là <strong>kể chuyện và lập luận</strong>: bạn dẫn hội đồng từ vấn đề tới giải pháp, bảo vệ các quyết định, và đóng gói tất cả thành một case study portfolio.</p>
<h3>Dựng bài trình bày như một câu chuyện</h3>
<pre><code>Mạch trình bày
  1  Vấn đề    -> brief, đối tượng, mục tiêu
  2  Insight   -> nghiên cứu hé lộ điều gì
  3  Big idea   -> concept của bạn, trong một câu
  4  Hệ thống    -> chữ, màu, lưới
  5  Sản phẩm     -> deliverable trong ngữ cảnh (mockup)
  6  Bằng chứng    -> kiểm thử / kết quả
  7  Đề xuất        -> bước tiếp / tác động
</code></pre>
<h3>Bảo vệ, đừng trang trí</h3>
<p>Với mỗi lựa chọn lớn, sẵn sàng trả lời "vì sao?" bằng brief, insight hoặc kết quả kiểm thử. "Nhìn đẹp" thì trượt; "chọn font này vì đối tượng là X và tone là Y" thì qua.</p>
<h3>Biến thành portfolio</h3>
<p>Trên <a href="https://www.behance.net/" target="_blank" rel="noopener">Behance</a> hay web riêng, hãy trình <em>quy trình</em>, không chỉ tấm hero: vấn đề → nghiên cứu → concept → hệ thống → sản phẩm (trong mockup thực tế) → kết quả. Một case study có ghi chép là thứ giúp bạn được tuyển.</p>
<div class="callout"><span class="badge">Sản phẩm giai đoạn này</span> Một <strong>bộ slide trình bày</strong>, một buổi <strong>bảo vệ</strong> bằng lời, và một <strong>case study portfolio</strong> đã xuất bản. Đây là lúc cả quy trình 8 giai đoạn được đền đáp — câu chuyện được chấm ngang với tấm hình.</div>`,
  ]]);

const s8q = quiz('ade301-quiz-8', 'Quiz 8 — Present & portfolio|||Quiz 8 — Trình bày & portfolio', [
  { id: 'q1', question: 'Một bài bảo vệ đồ án tốt chủ yếu chấm điều gì?', options: ['Chỉ tấm hình cuối đẹp', 'Câu chuyện & lập luận: vì sao mỗi quyết định phục vụ vấn đề/đối tượng', 'Số lượng slide', 'Phần mềm đã dùng'], correctIndex: 1, explanation: 'Bảo vệ là kể chuyện có lý lẽ; mỗi lựa chọn phải truy về brief, insight hoặc kết quả kiểm thử.' },
  { id: 'q2', question: 'Khi bị hỏi "vì sao chọn font này?", câu trả lời nào đạt?', options: ['"Vì nó nhìn đẹp"', '"Vì đối tượng là X và tone cần Y nên font này phù hợp"', '"Vì đang thịnh hành"', '"Vì em quen dùng"'], correctIndex: 1, explanation: 'Câu trả lời gắn quyết định với đối tượng và mục tiêu truyền thông mới có sức thuyết phục; "đẹp" là cảm tính.' },
  { id: 'q3', question: 'Một case study portfolio mạnh nên trình bày điều gì?', options: ['Chỉ tấm hero shot', 'Cả quy trình: vấn đề → nghiên cứu → concept → hệ thống → sản phẩm → kết quả', 'Chỉ logo', 'Danh sách phần mềm'], correctIndex: 1, explanation: 'Nhà tuyển dụng muốn thấy tư duy và quy trình, không chỉ sản phẩm cuối; case study đầy đủ tạo khác biệt.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'ADE301',
    slug: 'ade301-visual-communication-project',
    title: 'Visual Communication Project',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ADE301.webp',
    shortDescription: 'Project capstone in visual communication design — run as a real design project through 8 stages: brief analysis, research, creative strategy, ideation, identity system, production, critique & testing, presentation & portfolio.|||Đồ án thiết kế truyền thông thị giác — làm theo quy trình đồ án thật qua 8 giai đoạn: phân tích brief, nghiên cứu, chiến lược sáng tạo, phác thảo, hệ thống nhận diện, triển khai, phản biện & kiểm thử, trình bày & portfolio. Song ngữ.',
    description: 'Môn <strong>ADE301 — Visual Communication Project</strong> (Đồ án Thiết kế truyền thông thị giác, kỳ 7, ngành Thiết kế mỹ thuật số) là một môn <strong>ĐỒ ÁN</strong> — không phải tám chương lý thuyết rời rạc. Bạn nhận một brief truyền thông thật và dẫn nó qua <strong>8 giai đoạn của quy trình làm đồ án</strong>: (1) nhận &amp; phân tích brief, (2) nghiên cứu &amp; insight, (3) chiến lược sáng tạo &amp; big idea, (4) phác thảo &amp; phát triển ý tưởng, (5) thiết kế &amp; hệ thống nhận diện, (6) triển khai bộ sản phẩm, (7) phản biện, chỉnh sửa &amp; kiểm thử, (8) trình bày, bảo vệ &amp; portfolio. Bám tài liệu nền (<em>Designing Brand Identity</em>, <em>Making and Breaking the Grid</em>, IDEO Design Thinking, Behance/Dribbble), song ngữ, có brief/checklist/rubric và quiz mỗi giai đoạn.',
    whatYouLearn: 'Phân tích brief &amp; xác định vấn đề truyền thông + đối tượng; nghiên cứu, moodboard, benchmark &amp; phân tích đối thủ; chuyển insight thành big idea, thông điệp &amp; tone of voice; phác thảo/thumbnail &amp; sàng lọc nhiều phương án; dựng hệ thống nhận diện (typography, màu, layout, lưới); triển khai poster/brochure/social/motion &amp; brand guideline; chạy phản biện &amp; kiểm thử với đối tượng; trình bày, bảo vệ đồ án &amp; dựng case study portfolio.',
    requirements: 'Nền tảng thiết kế cơ bản (bố cục, màu, typography) và biết dùng công cụ (Figma / Adobe Illustrator, Photoshop, InDesign). Xem điều kiện tiên quyết trong khung chương trình ngành Thiết kế mỹ thuật số trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách nền tảng, Behance/Dribbble, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Môn đồ án: deliverable, rubric, 8 giai đoạn.', lessons: [intro] },
    { title: 'Giai đoạn 1 — Phân tích brief|||Stage 1 — Analyse the brief', description: 'Vấn đề truyền thông, đối tượng, mục tiêu.', lessons: [s1, s1q] },
    { title: 'Giai đoạn 2 — Nghiên cứu & insight|||Stage 2 — Research & insight', description: 'Moodboard, benchmark, phân tích đối thủ.', lessons: [s2, s2q] },
    { title: 'Giai đoạn 3 — Chiến lược & big idea|||Stage 3 — Strategy & big idea', description: 'Concept, thông điệp, tone of voice.', lessons: [s3, s3q] },
    { title: 'Giai đoạn 4 — Phác thảo ý tưởng|||Stage 4 — Ideation', description: 'Sketch, thumbnail, nhiều phương án.', lessons: [s4, s4q] },
    { title: 'Giai đoạn 5 — Hệ thống nhận diện|||Stage 5 — Identity system', description: 'Typography, màu, layout, lưới.', lessons: [s5, s5q] },
    { title: 'Giai đoạn 6 — Triển khai sản phẩm|||Stage 6 — Production', description: 'Poster/social/motion, brand guideline.', lessons: [s6, s6q] },
    { title: 'Giai đoạn 7 — Phản biện & kiểm thử|||Stage 7 — Critique & test', description: 'Feedback, chỉnh sửa, test với đối tượng.', lessons: [s7, s7q] },
    { title: 'Giai đoạn 8 — Trình bày & portfolio|||Stage 8 — Present & portfolio', description: 'Pitch, bảo vệ, case study portfolio.', lessons: [s8, s8q] },
  ],
};
