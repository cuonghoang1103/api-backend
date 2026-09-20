/**
 * EXE401 — Graduation Thesis Startup Project. Đồ án tốt nghiệp Khởi nghiệp,
 * ngành Hệ thống thông tin (Kỳ 9). Khung KHÔNG theo 8 chương lý thuyết mà theo
 * 8 GIAI ĐOẠN xây dựng một startup thật: từ ý tưởng → khách hàng → BMC → MVP →
 * kiểm chứng → go-to-market → tài chính/gọi vốn → vận hành/pháp lý/bảo vệ.
 * Trích dẫn: Lean Startup (Ries), Business Model Generation (Osterwalder),
 * Zero to One (Thiel), Y Combinator Startup School.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức giai đoạn.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('exe401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách khởi nghiệp (Lean Startup, BMC, Zero to One), Y Combinator Startup School, công cụ, lộ trình đồ án.',
  [[
    `<span class="eyebrow">EXE401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything for a <strong>graduation startup thesis</strong> — idea, customers, business model, MVP, validation, go-to-market, funding and defense — in one place. Official slides &amp; rubric live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình, project template &amp; grading rubric for EXE401 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://theleanstartup.com/" target="_blank" rel="noopener"><em>The Lean Startup</em> — Eric Ries</a> (build-measure-learn, MVP, validated learning)</li>
<li><a href="https://www.strategyzer.com/library/the-business-model-canvas" target="_blank" rel="noopener"><em>Business Model Generation</em> — Osterwalder &amp; Pigneur</a> (Business Model Canvas)</li>
<li><a href="https://en.wikipedia.org/wiki/Zero_to_One" target="_blank" rel="noopener"><em>Zero to One</em> — Peter Thiel</a> (từ 0 tới 1, lợi thế độc quyền)</li>
</ul>
<h3>🌐 Free courses &amp; docs</h3>
<ul>
<li><a href="https://www.startupschool.org/" target="_blank" rel="noopener">Y Combinator — Startup School</a> (free curriculum + library)</li>
<li><a href="https://www.ycombinator.com/library" target="_blank" rel="noopener">YC Startup Library</a> — essays &amp; talks (How to Start a Startup)</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.strategyzer.com/canvas/business-model-canvas" target="_blank" rel="noopener">Business Model Canvas (Strategyzer)</a></li>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — wireframe &amp; prototype the MVP</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — build the pitch deck</li>
</ul>
<div class="callout"><span class="badge">How the thesis is graded</span> Typical deliverables: a written business plan / thesis report, the working MVP (demo), a financial model, and a live <strong>pitch defense</strong> before a committee. Marks weigh problem clarity, customer evidence, feasibility of the model, and quality of execution — not slide polish.</div>`,
    `<span class="eyebrow">EXE401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho một <strong>đồ án tốt nghiệp khởi nghiệp</strong> — ý tưởng, khách hàng, mô hình kinh doanh, MVP, kiểm chứng, go-to-market, gọi vốn và bảo vệ — gom về một chỗ. Slide &amp; rubric chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU, mẫu đồ án &amp; rubric chấm của EXE401 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://theleanstartup.com/" target="_blank" rel="noopener"><em>The Lean Startup</em> — Eric Ries</a> (dựng-đo-học, MVP, học có kiểm chứng)</li>
<li><a href="https://www.strategyzer.com/library/the-business-model-canvas" target="_blank" rel="noopener"><em>Business Model Generation</em> — Osterwalder &amp; Pigneur</a> (Business Model Canvas)</li>
<li><a href="https://en.wikipedia.org/wiki/Zero_to_One" target="_blank" rel="noopener"><em>Zero to One</em> — Peter Thiel</a> (từ 0 tới 1, lợi thế độc quyền)</li>
</ul>
<h3>🌐 Khoá học &amp; tài liệu miễn phí</h3>
<ul>
<li><a href="https://www.startupschool.org/" target="_blank" rel="noopener">Y Combinator — Startup School</a> (chương trình + thư viện miễn phí)</li>
<li><a href="https://www.ycombinator.com/library" target="_blank" rel="noopener">YC Startup Library</a> — bài viết &amp; talk (How to Start a Startup)</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.strategyzer.com/canvas/business-model-canvas" target="_blank" rel="noopener">Business Model Canvas (Strategyzer)</a></li>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — vẽ wireframe &amp; prototype cho MVP</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — dựng pitch deck</li>
</ul>
<div class="callout"><span class="badge">Đồ án được chấm thế nào</span> Sản phẩm nộp điển hình: báo cáo kế hoạch kinh doanh / thesis, MVP chạy được (demo), mô hình tài chính, và buổi <strong>bảo vệ pitch</strong> trước hội đồng. Điểm cân theo độ rõ của vấn đề, bằng chứng khách hàng, tính khả thi của mô hình và chất lượng thực thi — không phải độ bóng của slide.</div>`,
  ]]);

const intro = doc('exe401-0-1-overview', 'Course overview: building a startup, end to end|||Tổng quan: xây một startup từ đầu đến cuối',
  'Đồ án khởi nghiệp là gì; deliverable (business plan, MVP, tài chính, pitch); rubric; lộ trình 8 giai đoạn từ ý tưởng đến bảo vệ.',
  [[
    `<span class="eyebrow">EXE401 · Lesson 0.1 · Overview</span>
<h2>Graduation Thesis Startup Project</h2>
<p class="lead">This is <strong>not a theory course with 8 chapters</strong>. It is a capstone where you build a real startup: find a problem worth solving, discover customers, design a business model, ship an <strong>MVP</strong>, validate it in the market, plan go-to-market and finance, then <strong>defend</strong> it before a committee.</p>
<h3>What you deliver</h3>
<ul>
<li><strong>Business plan / thesis report</strong> — the written argument for your venture.</li>
<li><strong>MVP</strong> — a working minimum product real users can try.</li>
<li><strong>Financial model</strong> — costs, revenue, unit economics, funding ask.</li>
<li><strong>Pitch deck &amp; defense</strong> — a 10-slide story presented live.</li>
</ul>
<h3>The mindset</h3>
<p>Eric Ries's core loop is <strong>Build → Measure → Learn</strong>: turn assumptions into experiments, and let evidence — not opinion — decide what to build next. Peter Thiel adds: aim to go from <strong>0 to 1</strong> (create something new) rather than copy what exists.</p>
<pre><code>The 8 stages (this course)
 1 Idea &amp; problem        -> problem-solution fit
 2 Market &amp; customers     -> customer discovery
 3 Business model         -> Business Model Canvas
 4 MVP                    -> build the smallest testable product
 5 Validation            -> product-market fit
 6 Go-to-market          -> marketing, sales, growth
 7 Finance &amp; fundraising  -> model, pitch deck, ask
 8 Ops, legal &amp; defense   -> scale, protect, present
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Talk to users before you write a line of code. Most graduation startups fail not because the code was bad, but because <strong>nobody wanted the product</strong>.</div>`,
    `<span class="eyebrow">EXE401 · Bài 0.1 · Tổng quan</span>
<h2>Đồ án tốt nghiệp Khởi nghiệp</h2>
<p class="lead">Đây <strong>không phải môn lý thuyết 8 chương</strong>. Đây là đồ án tổng hợp nơi bạn xây một startup thật: tìm một vấn đề đáng giải, khám phá khách hàng, thiết kế mô hình kinh doanh, ra <strong>MVP</strong>, kiểm chứng ngoài thị trường, lập kế hoạch go-to-market và tài chính, rồi <strong>bảo vệ</strong> trước hội đồng.</p>
<h3>Bạn nộp gì</h3>
<ul>
<li><strong>Kế hoạch kinh doanh / báo cáo đồ án</strong> — lập luận bằng văn bản cho dự án.</li>
<li><strong>MVP</strong> — sản phẩm tối thiểu chạy được để người dùng thật thử.</li>
<li><strong>Mô hình tài chính</strong> — chi phí, doanh thu, kinh tế đơn vị, số vốn cần.</li>
<li><strong>Pitch deck &amp; bảo vệ</strong> — câu chuyện 10 slide trình bày trực tiếp.</li>
</ul>
<h3>Tư duy cốt lõi</h3>
<p>Vòng lặp của Eric Ries là <strong>Dựng → Đo → Học</strong>: biến giả định thành thí nghiệm, và để bằng chứng — không phải ý kiến — quyết định làm gì tiếp. Peter Thiel bổ sung: hãy đi từ <strong>0 tới 1</strong> (tạo cái mới) thay vì sao chép cái đã có.</p>
<pre><code>8 giai đoạn (môn này)
 1 Ý tưởng &amp; vấn đề       -> khớp vấn đề-giải pháp
 2 Thị trường &amp; khách hàng -> customer discovery
 3 Mô hình kinh doanh     -> Business Model Canvas
 4 MVP                    -> dựng sản phẩm nhỏ nhất kiểm được
 5 Kiểm chứng            -> product-market fit
 6 Go-to-market          -> marketing, bán hàng, tăng trưởng
 7 Tài chính &amp; gọi vốn    -> mô hình, pitch deck, số vốn
 8 Vận hành, pháp lý, bảo vệ -> mở rộng, bảo vệ, trình bày
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc vàng</span> Nói chuyện với người dùng trước khi viết một dòng code. Phần lớn startup đồ án thất bại không vì code tệ, mà vì <strong>không ai cần sản phẩm</strong>.</div>`,
  ]]);

const c1 = doc('exe401-1-1-idea-problem', '1 — Idea & the problem (problem-solution fit)|||1 — Ý tưởng & vấn đề (khớp vấn đề-giải pháp)',
  'Bắt đầu từ vấn đề, không từ giải pháp; tiêu chí ý tưởng tốt; phỏng vấn vấn đề (Mom Test); khớp vấn đề-giải pháp.',
  [[
    `<span class="eyebrow">EXE401 · Stage 1</span>
<h2>Idea &amp; the problem</h2>
<p>Great startups start from a <strong>problem</strong>, not from a cool solution. Your first job is to find a problem that is <strong>real, frequent, and painful</strong> for a specific group of people.</p>
<h3>Is the idea worth pursuing?</h3>
<ul>
<li><strong>Real pain</strong> — do people already spend time or money working around it?</li>
<li><strong>Frequency</strong> — a problem faced daily beats one faced once a year.</li>
<li><strong>Reachable users</strong> — can you find and talk to them?</li>
<li><strong>Founder fit</strong> — do you have an unfair insight or interest here?</li>
</ul>
<h3>Interview the problem, not your solution</h3>
<p>Use "The Mom Test" idea: ask about their <em>past behavior</em>, not hypotheticals. "How do you do X today? What was hard about it last time?" — never "Would you buy my app?"</p>
<pre><code>Problem statement template
 [User] struggles to [job to be done]
 because [obstacle],
 which costs them [time / money / stress].
 Today they cope by [current workaround].
</code></pre>
<div class="callout"><span class="badge">Problem-solution fit</span> You reach it when a clearly defined customer segment agrees the problem is real AND your proposed solution plausibly removes the pain — verified in conversations, before you build.</div>`,
    `<span class="eyebrow">EXE401 · Giai đoạn 1</span>
<h2>Ý tưởng &amp; vấn đề</h2>
<p>Startup tốt bắt đầu từ một <strong>vấn đề</strong>, không phải từ một giải pháp hay ho. Việc đầu tiên là tìm một vấn đề <strong>có thật, xảy ra thường xuyên và gây đau</strong> cho một nhóm người cụ thể.</p>
<h3>Ý tưởng có đáng theo đuổi?</h3>
<ul>
<li><strong>Đau thật</strong> — người ta có đang tốn thời gian/tiền để lách qua nó không?</li>
<li><strong>Tần suất</strong> — vấn đề gặp mỗi ngày hơn hẳn vấn đề gặp mỗi năm một lần.</li>
<li><strong>Tiếp cận được</strong> — bạn có tìm và nói chuyện được với họ không?</li>
<li><strong>Hợp với founder</strong> — bạn có góc nhìn hay lợi thế riêng ở đây không?</li>
</ul>
<h3>Phỏng vấn vấn đề, đừng phỏng vấn giải pháp</h3>
<p>Theo tinh thần "The Mom Test": hỏi về <em>hành vi trong quá khứ</em>, không hỏi giả định. "Hiện giờ bạn làm việc X thế nào? Lần gần nhất khó ở chỗ nào?" — đừng hỏi "Bạn có mua app của tôi không?"</p>
<pre><code>Mẫu phát biểu vấn đề
 [Người dùng] khó [công việc cần làm]
 vì [trở ngại],
 khiến họ mất [thời gian / tiền / căng thẳng].
 Hiện họ chống chế bằng [cách lách hiện tại].
</code></pre>
<div class="callout"><span class="badge">Khớp vấn đề-giải pháp</span> Đạt được khi một nhóm khách hàng xác định rõ đồng ý vấn đề có thật VÀ giải pháp bạn đề xuất gỡ được cái đau đó — kiểm bằng trò chuyện, trước khi dựng.</div>`,
  ]]);

const c1q = quiz('exe401-quiz-1', 'Quiz 1 — Idea & problem|||Quiz 1 — Ý tưởng & vấn đề', [
  { id: 'q1', question: 'Một startup tốt nên bắt đầu từ đâu?', options: ['Từ một giải pháp công nghệ hay ho', 'Từ một vấn đề có thật, thường xuyên và gây đau', 'Từ số vốn gọi được', 'Từ một cái tên thương hiệu đẹp'], correctIndex: 1, explanation: 'Bắt đầu từ vấn đề thật của một nhóm người cụ thể, không phải từ giải pháp.' },
  { id: 'q2', question: 'Theo tinh thần "The Mom Test", câu hỏi phỏng vấn tốt là?', options: ['"Bạn có mua app của tôi không?"', '"Bạn thấy ý tưởng này hay chứ?"', '"Hiện giờ bạn làm việc X thế nào, lần gần nhất khó ở đâu?"', '"Bạn sẽ trả bao nhiêu cho sản phẩm chưa có?"'], correctIndex: 2, explanation: 'Hỏi về hành vi trong quá khứ, không hỏi giả định — tránh câu trả lời chiều lòng.' },
  { id: 'q3', question: '"Problem-solution fit" (khớp vấn đề-giải pháp) đạt khi?', options: ['Đã viết xong toàn bộ code', 'Khách hàng xác định rõ đồng ý vấn đề có thật và giải pháp gỡ được đau, kiểm qua trò chuyện', 'Đã đăng ký nhãn hiệu', 'Đã có logo và website'], correctIndex: 1, explanation: 'Khớp vấn đề-giải pháp được xác nhận bằng bằng chứng từ khách hàng trước khi dựng sản phẩm.' },
]);

const c2 = doc('exe401-2-1-market-customers', '2 — Market & customer discovery|||2 — Thị trường & khám phá khách hàng',
  'Chân dung khách hàng & early adopter; quy mô thị trường TAM/SAM/SOM; phỏng vấn khám phá; đối thủ & phân khúc.',
  [[
    `<span class="eyebrow">EXE401 · Stage 2</span>
<h2>Market &amp; customer discovery</h2>
<p>Now go outside the building and <strong>talk to real people</strong>. The goal is to learn who your customer is, how big the opportunity is, and who you compete with.</p>
<h3>Segment &amp; early adopters</h3>
<p>Do not target "everyone". Pick a narrow segment feeling the pain most acutely — your <strong>early adopters</strong>. They tolerate a rough product because they need the solution now.</p>
<h3>Sizing the market</h3>
<pre><code>TAM / SAM / SOM
 TAM (Total Addressable Market)  = everyone who could ever buy
 SAM (Serviceable Available)     = the slice you can reach/serve
 SOM (Serviceable Obtainable)    = the realistic share in a few years
</code></pre>
<h3>Discovery interviews</h3>
<ul>
<li>Aim for 15–30 conversations before committing.</li>
<li>Listen for the words customers use — they become your marketing copy.</li>
<li>Map competitors and current alternatives (including "a spreadsheet" or "doing nothing").</li>
</ul>
<div class="callout"><span class="badge">Warning sign</span> If every interviewee is polite but nobody is frustrated with today's options, the pain may be too small to build a business on.</div>`,
    `<span class="eyebrow">EXE401 · Giai đoạn 2</span>
<h2>Thị trường &amp; khám phá khách hàng</h2>
<p>Giờ hãy ra khỏi phòng và <strong>nói chuyện với người thật</strong>. Mục tiêu là hiểu khách hàng là ai, cơ hội lớn cỡ nào, và bạn cạnh tranh với ai.</p>
<h3>Phân khúc &amp; người dùng tiên phong</h3>
<p>Đừng nhắm "tất cả mọi người". Chọn một phân khúc hẹp đang đau nhất — <strong>early adopter</strong> của bạn. Họ chấp nhận sản phẩm còn thô vì cần giải pháp ngay.</p>
<h3>Ước lượng quy mô thị trường</h3>
<pre><code>TAM / SAM / SOM
 TAM (tổng thị trường)     = tất cả những ai có thể mua
 SAM (phần phục vụ được)   = phần bạn tiếp cận/phục vụ được
 SOM (phần chiếm được)     = phần thực tế đạt trong vài năm
</code></pre>
<h3>Phỏng vấn khám phá</h3>
<ul>
<li>Nhắm 15–30 cuộc trò chuyện trước khi cam kết.</li>
<li>Nghe đúng từ ngữ khách hàng dùng — chúng thành câu chữ marketing của bạn.</li>
<li>Vẽ bản đồ đối thủ và giải pháp thay thế hiện tại (kể cả "một file Excel" hay "không làm gì cả").</li>
</ul>
<div class="callout"><span class="badge">Dấu hiệu cảnh báo</span> Nếu ai cũng lịch sự nhưng không ai bực với lựa chọn hiện tại, cái đau có thể quá nhỏ để dựng nên một doanh nghiệp.</div>`,
  ]]);

const c2q = quiz('exe401-quiz-2', 'Quiz 2 — Market & customers|||Quiz 2 — Thị trường & khách hàng', [
  { id: 'q1', question: '"Early adopter" (người dùng tiên phong) là?', options: ['Nhà đầu tư đầu tiên', 'Nhóm khách hàng đau nhất, chấp nhận sản phẩm còn thô vì cần giải pháp ngay', 'Nhân viên đầu tiên của công ty', 'Đối thủ lớn nhất trên thị trường'], correctIndex: 1, explanation: 'Early adopter cảm nhận cái đau mạnh nhất nên chịu dùng sản phẩm chưa hoàn thiện.' },
  { id: 'q2', question: 'Trong TAM/SAM/SOM, SOM là gì?', options: ['Tổng tất cả người có thể mua', 'Phần thị trường thực tế bạn chiếm được trong vài năm', 'Chi phí marketing mỗi tháng', 'Số vốn cần gọi'], correctIndex: 1, explanation: 'SOM (Serviceable Obtainable Market) là phần thực tế đạt được, nhỏ hơn SAM và TAM.' },
  { id: 'q3', question: 'Khi lập bản đồ đối thủ, "giải pháp thay thế" cần tính cả?', options: ['Chỉ các app đối thủ trực tiếp', 'Cách chống chế hiện tại như dùng Excel hoặc không làm gì cả', 'Chỉ các công ty niêm yết', 'Chỉ đối thủ nước ngoài'], correctIndex: 1, explanation: 'Đối thủ thật sự gồm mọi cách khách hàng đang giải quyết vấn đề, kể cả thủ công hay bỏ qua.' },
]);

const c3 = doc('exe401-3-1-business-model-canvas', '3 — Business Model Canvas & value proposition|||3 — Business Model Canvas & đề xuất giá trị',
  'Đề xuất giá trị (value proposition); 9 ô Business Model Canvas của Osterwalder; dòng doanh thu & cấu trúc chi phí.',
  [[
    `<span class="eyebrow">EXE401 · Stage 3</span>
<h2>Business model &amp; value proposition</h2>
<p>A great product with no business model is a hobby. Osterwalder's <strong>Business Model Canvas (BMC)</strong> puts your whole business on one page — 9 building blocks.</p>
<h3>The value proposition</h3>
<p>Your <strong>value proposition</strong> is the single sentence answering: "Why would a customer choose us over the alternative?" It maps your product's <em>pain relievers</em> and <em>gain creators</em> to the customer's real pains and gains.</p>
<pre><code>Business Model Canvas (9 blocks)
 Key Partners | Key Activities  | Value          | Customer      | Customer
              | Key Resources   | Propositions   | Relationships | Segments
 -------------------------------------------------  Channels
 Cost Structure                 | Revenue Streams
</code></pre>
<h3>Money in, money out</h3>
<ul>
<li><strong>Revenue streams</strong> — subscription, one-off sale, freemium, commission, ads.</li>
<li><strong>Cost structure</strong> — what drives cost (people, servers, marketing); fixed vs variable.</li>
</ul>
<div class="callout"><span class="badge">Thiel: 0 to 1</span> A defensible business does something others cannot easily copy — a real edge (technology, network effect, brand), not just "the same thing, cheaper".</div>`,
    `<span class="eyebrow">EXE401 · Giai đoạn 3</span>
<h2>Mô hình kinh doanh &amp; đề xuất giá trị</h2>
<p>Sản phẩm hay mà không có mô hình kinh doanh chỉ là một thú vui. <strong>Business Model Canvas (BMC)</strong> của Osterwalder đặt cả doanh nghiệp lên một trang — 9 khối.</p>
<h3>Đề xuất giá trị</h3>
<p><strong>Đề xuất giá trị (value proposition)</strong> là một câu trả lời cho: "Vì sao khách hàng chọn ta thay vì lựa chọn khác?" Nó nối các <em>thứ gỡ đau</em> và <em>thứ tạo lợi</em> của sản phẩm với cái đau và cái lợi thật của khách hàng.</p>
<pre><code>Business Model Canvas (9 khối)
 Đối tác   | Hoạt động chính | Đề xuất      | Quan hệ     | Phân khúc
 chính     | Nguồn lực chính | giá trị      | khách hàng  | khách hàng
 -------------------------------------------------  Kênh phân phối
 Cấu trúc chi phí               | Dòng doanh thu
</code></pre>
<h3>Tiền vào, tiền ra</h3>
<ul>
<li><strong>Dòng doanh thu</strong> — thuê bao, bán đứt, freemium, hoa hồng, quảng cáo.</li>
<li><strong>Cấu trúc chi phí</strong> — cái gì đẩy chi phí (nhân sự, máy chủ, marketing); cố định và biến đổi.</li>
</ul>
<div class="callout"><span class="badge">Thiel: 0 tới 1</span> Doanh nghiệp có phòng thủ làm điều người khác khó sao chép — một lợi thế thật (công nghệ, hiệu ứng mạng, thương hiệu), không chỉ là "y hệt nhưng rẻ hơn".</div>`,
  ]]);

const c3q = quiz('exe401-quiz-3', 'Quiz 3 — BMC & value proposition|||Quiz 3 — BMC & đề xuất giá trị', [
  { id: 'q1', question: 'Business Model Canvas của Osterwalder gồm bao nhiêu khối?', options: ['5 khối', '9 khối', '12 khối', '3 khối'], correctIndex: 1, explanation: 'BMC gồm 9 khối, đặt toàn bộ mô hình kinh doanh lên một trang.' },
  { id: 'q2', question: 'Đề xuất giá trị (value proposition) trả lời câu hỏi nào?', options: ['Chúng ta cần bao nhiêu vốn?', 'Vì sao khách hàng chọn ta thay vì lựa chọn khác?', 'Ai là CEO?', 'Máy chủ đặt ở đâu?'], correctIndex: 1, explanation: 'Value proposition nối thứ gỡ đau/tạo lợi của sản phẩm với đau và lợi thật của khách hàng.' },
  { id: 'q3', question: 'Theo Thiel (Zero to One), lợi thế bền vững KHÔNG phải là?', options: ['Hiệu ứng mạng', 'Công nghệ độc quyền', 'Làm y hệt đối thủ nhưng rẻ hơn một chút', 'Thương hiệu mạnh'], correctIndex: 2, explanation: 'Chỉ rẻ hơn thì dễ bị sao chép; lợi thế thật đến từ điều khó copy.' },
]);

const c4 = doc('exe401-4-1-mvp-product', '4 — MVP & product development|||4 — MVP & phát triển sản phẩm',
  'MVP là gì và không là gì; các loại MVP (landing, concierge, Wizard of Oz); build-measure-learn; ưu tiên tính năng.',
  [[
    `<span class="eyebrow">EXE401 · Stage 4</span>
<h2>MVP &amp; product development</h2>
<p>An <strong>MVP (Minimum Viable Product)</strong> is the smallest thing you can build to <em>learn</em> whether customers want the product — not a tiny version of the final app, but a learning experiment.</p>
<h3>Kinds of MVP</h3>
<ul>
<li><strong>Landing page</strong> — describe the offer, measure sign-ups before building.</li>
<li><strong>Concierge</strong> — deliver the service manually to the first users.</li>
<li><strong>Wizard of Oz</strong> — the front looks automated; humans do the work behind.</li>
</ul>
<h3>Build-Measure-Learn</h3>
<pre><code>       Build
      /      \\
  Learn        Measure
      \\      /
       (loop fast, cheaply)
 Each turn tests ONE risky assumption.
</code></pre>
<h3>Prioritize ruthlessly</h3>
<p>Cut every feature not needed to test the core assumption. Ship the one thing that proves or disproves demand; everything else waits.</p>
<div class="callout"><span class="badge">MVP is not an excuse for junk</span> Minimum means small in scope, not sloppy. The one feature you ship should work well enough that its result is trustworthy.</div>`,
    `<span class="eyebrow">EXE401 · Giai đoạn 4</span>
<h2>MVP &amp; phát triển sản phẩm</h2>
<p><strong>MVP (Minimum Viable Product)</strong> là thứ nhỏ nhất bạn dựng được để <em>học</em> xem khách hàng có muốn sản phẩm không — không phải bản thu nhỏ của app hoàn chỉnh, mà là một thí nghiệm để học.</p>
<h3>Các loại MVP</h3>
<ul>
<li><strong>Landing page</strong> — mô tả lời chào hàng, đo lượt đăng ký trước khi dựng.</li>
<li><strong>Concierge</strong> — cung cấp dịch vụ thủ công cho vài người dùng đầu tiên.</li>
<li><strong>Wizard of Oz</strong> — mặt tiền trông tự động; con người làm việc phía sau.</li>
</ul>
<h3>Dựng-Đo-Học</h3>
<pre><code>       Dựng
      /     \\
  Học         Đo
      \\     /
       (lặp nhanh, rẻ)
 Mỗi vòng kiểm MỘT giả định rủi ro.
</code></pre>
<h3>Ưu tiên tàn nhẫn</h3>
<p>Cắt mọi tính năng không cần để kiểm giả định cốt lõi. Ra đúng một thứ chứng minh hoặc bác bỏ nhu cầu; phần còn lại chờ.</p>
<div class="callout"><span class="badge">MVP không phải cớ để làm ẩu</span> Tối thiểu nghĩa là hẹp về phạm vi, không phải cẩu thả. Tính năng bạn ra phải chạy đủ tốt để kết quả đáng tin.</div>`,
  ]]);

const c4q = quiz('exe401-quiz-4', 'Quiz 4 — MVP & product|||Quiz 4 — MVP & sản phẩm', [
  { id: 'q1', question: 'Mục đích chính của một MVP là?', options: ['Bán được nhiều nhất ngay lập tức', 'Học xem khách hàng có thật sự muốn sản phẩm không, với chi phí nhỏ nhất', 'Trình diễn mọi tính năng đã lên kế hoạch', 'Gây ấn tượng với nhà đầu tư bằng độ hoàn thiện'], correctIndex: 1, explanation: 'MVP là thí nghiệm học có kiểm chứng, dựng nhỏ nhất để kiểm giả định.' },
  { id: 'q2', question: 'MVP kiểu "Wizard of Oz" nghĩa là?', options: ['Toàn bộ đã tự động hoá hoàn chỉnh', 'Mặt tiền trông tự động nhưng con người làm việc phía sau', 'Chỉ có một trang landing page', 'Một video giới thiệu sản phẩm'], correctIndex: 1, explanation: 'Wizard of Oz mô phỏng trải nghiệm tự động trong khi thao tác thủ công phía sau để học nhanh.' },
  { id: 'q3', question: 'Vòng lặp cốt lõi của Lean Startup là?', options: ['Lập kế hoạch → Thực thi → Báo cáo', 'Dựng → Đo → Học', 'Thiết kế → Gọi vốn → Mở rộng', 'Marketing → Bán → Hỗ trợ'], correctIndex: 1, explanation: 'Build-Measure-Learn: mỗi vòng kiểm một giả định rủi ro rồi điều chỉnh.' },
]);

const c5 = doc('exe401-5-1-validation-pmf', '5 — Validation & product-market fit|||5 — Kiểm chứng & product-market fit',
  'Học có kiểm chứng; chỉ số phễu AARRR & metric ảo; pivot hay kiên trì; dấu hiệu product-market fit.',
  [[
    `<span class="eyebrow">EXE401 · Stage 5</span>
<h2>Validation &amp; product-market fit</h2>
<p>Now measure whether the market actually pulls the product. <strong>Validated learning</strong> means every claim is backed by data from real usage, not opinions.</p>
<h3>Metrics that matter</h3>
<pre><code>AARRR funnel (pirate metrics)
 Acquisition -> how do users find you?
 Activation  -> do they get first value?
 Retention   -> do they come back?
 Referral    -> do they tell others?
 Revenue     -> do they pay?
</code></pre>
<p>Beware <strong>vanity metrics</strong> (total sign-ups, page views): they always go up and hide the truth. Track <strong>actionable metrics</strong> like retention and conversion by cohort.</p>
<h3>Pivot or persevere?</h3>
<p>If the data says the current approach is not working, <strong>pivot</strong> — change one core element (segment, problem, or solution) while keeping what you learned. If it works, persevere and push harder.</p>
<div class="callout"><span class="badge">Product-market fit</span> The moment usage grows on its own, users are upset when the product is down, and you struggle to keep up with demand. Before PMF, everything is about finding it — not scaling.</div>`,
    `<span class="eyebrow">EXE401 · Giai đoạn 5</span>
<h2>Kiểm chứng &amp; product-market fit</h2>
<p>Giờ đo xem thị trường có thật sự kéo sản phẩm không. <strong>Học có kiểm chứng</strong> nghĩa là mọi khẳng định phải có dữ liệu từ việc dùng thật đứng sau, không phải ý kiến.</p>
<h3>Chỉ số quan trọng</h3>
<pre><code>Phễu AARRR (pirate metrics)
 Acquisition -> người dùng tìm thấy bạn bằng cách nào?
 Activation  -> họ có nhận giá trị lần đầu không?
 Retention   -> họ có quay lại không?
 Referral    -> họ có giới thiệu người khác không?
 Revenue     -> họ có trả tiền không?
</code></pre>
<p>Coi chừng <strong>metric ảo (vanity metrics)</strong> (tổng lượt đăng ký, lượt xem): chúng luôn tăng và che sự thật. Hãy theo dõi <strong>metric hành động được</strong> như retention và tỉ lệ chuyển đổi theo cohort.</p>
<h3>Pivot hay kiên trì?</h3>
<p>Nếu dữ liệu nói hướng hiện tại không chạy, hãy <strong>pivot</strong> — đổi một yếu tố cốt lõi (phân khúc, vấn đề, hoặc giải pháp) mà giữ lại điều đã học. Nếu chạy, kiên trì và đẩy mạnh hơn.</p>
<div class="callout"><span class="badge">Product-market fit</span> Là lúc lượng dùng tự tăng, người dùng bực khi sản phẩm sập, và bạn vất vả theo kịp nhu cầu. Trước PMF, mọi thứ là để TÌM nó — chưa phải mở rộng.</div>`,
  ]]);

const c5q = quiz('exe401-quiz-5', 'Quiz 5 — Validation & PMF|||Quiz 5 — Kiểm chứng & PMF', [
  { id: 'q1', question: 'Đâu là một "metric ảo" (vanity metric)?', options: ['Tỉ lệ giữ chân (retention) theo cohort', 'Tổng lượt đăng ký tích luỹ luôn tăng', 'Tỉ lệ chuyển đổi trả tiền', 'Doanh thu theo tháng'], correctIndex: 1, explanation: 'Metric ảo luôn tăng và che sự thật; nên dùng metric hành động được như retention/chuyển đổi.' },
  { id: 'q2', question: 'Trong phễu AARRR, "Retention" đo điều gì?', options: ['Người dùng tìm thấy bạn thế nào', 'Người dùng có quay lại dùng tiếp không', 'Người dùng có trả tiền không', 'Người dùng có giới thiệu bạn bè không'], correctIndex: 1, explanation: 'Retention đo việc quay lại — dấu hiệu mạnh cho thấy sản phẩm tạo giá trị bền.' },
  { id: 'q3', question: '"Pivot" nghĩa là?', options: ['Bỏ hẳn dự án', 'Đổi một yếu tố cốt lõi (phân khúc/vấn đề/giải pháp) nhưng giữ điều đã học', 'Gọi thêm vốn', 'Tăng giá sản phẩm'], correctIndex: 1, explanation: 'Pivot là thay đổi hướng có chủ đích dựa trên điều đã học, không phải bỏ cuộc.' },
]);

const c6 = doc('exe401-6-1-go-to-market', '6 — Marketing, sales & growth (go-to-market)|||6 — Marketing, bán hàng & tăng trưởng (go-to-market)',
  'Chiến lược go-to-market; kênh tiếp cận; phễu bán hàng; CAC & LTV; kênh tăng trưởng bền.',
  [[
    `<span class="eyebrow">EXE401 · Stage 6</span>
<h2>Go-to-market: marketing, sales &amp; growth</h2>
<p>A validated product still fails if nobody hears about it. Your <strong>go-to-market (GTM)</strong> plan says how you reach customers and turn them into paying, repeat users.</p>
<h3>Channels &amp; the funnel</h3>
<ul>
<li><strong>Channels</strong> — content/SEO, social, ads, communities, direct sales, partnerships. Pick a few and go deep.</li>
<li><strong>Sales funnel</strong> — awareness → interest → consideration → purchase → retention.</li>
</ul>
<h3>The two numbers that decide it</h3>
<pre><code>Unit economics
 CAC = Customer Acquisition Cost   (cost to win one customer)
 LTV = Lifetime Value             (profit from a customer over time)

 Healthy business: LTV / CAC  >=  3
 Payback period: recover CAC within ~12 months
</code></pre>
<p>If it costs more to acquire a customer than they will ever pay you, growth just burns money faster.</p>
<div class="callout"><span class="badge">Sustainable growth</span> Ries names three engines: <strong>sticky</strong> (high retention), <strong>viral</strong> (users bring users), <strong>paid</strong> (spend less than LTV). Pick the one your data supports and focus.</div>`,
    `<span class="eyebrow">EXE401 · Giai đoạn 6</span>
<h2>Go-to-market: marketing, bán hàng &amp; tăng trưởng</h2>
<p>Sản phẩm đã kiểm chứng vẫn thất bại nếu không ai biết đến. Kế hoạch <strong>go-to-market (GTM)</strong> nói bạn tiếp cận khách hàng thế nào và biến họ thành người trả tiền, quay lại.</p>
<h3>Kênh &amp; phễu</h3>
<ul>
<li><strong>Kênh</strong> — nội dung/SEO, mạng xã hội, quảng cáo, cộng đồng, bán trực tiếp, đối tác. Chọn vài kênh và đi sâu.</li>
<li><strong>Phễu bán hàng</strong> — nhận biết → quan tâm → cân nhắc → mua → giữ chân.</li>
</ul>
<h3>Hai con số quyết định tất cả</h3>
<pre><code>Kinh tế đơn vị
 CAC = Chi phí thu hút khách   (tốn bao nhiêu để có 1 khách)
 LTV = Giá trị trọn đời        (lợi nhuận từ 1 khách theo thời gian)

 Kinh doanh lành mạnh: LTV / CAC  &gt;=  3
 Kỳ hoàn vốn: thu lại CAC trong khoảng 12 tháng
</code></pre>
<p>Nếu tốn nhiều tiền để có một khách hơn số họ từng trả, tăng trưởng chỉ là đốt tiền nhanh hơn.</p>
<div class="callout"><span class="badge">Tăng trưởng bền</span> Ries nêu ba động cơ: <strong>dính (sticky)</strong> (giữ chân cao), <strong>lan (viral)</strong> (người dùng kéo người dùng), <strong>trả tiền (paid)</strong> (chi ít hơn LTV). Chọn cái dữ liệu ủng hộ và tập trung.</div>`,
  ]]);

const c6q = quiz('exe401-quiz-6', 'Quiz 6 — Go-to-market|||Quiz 6 — Go-to-market', [
  { id: 'q1', question: 'CAC là gì?', options: ['Giá trị trọn đời của khách hàng', 'Chi phí để thu hút được một khách hàng', 'Tổng doanh thu năm', 'Chi phí máy chủ hàng tháng'], correctIndex: 1, explanation: 'CAC (Customer Acquisition Cost) là chi phí bỏ ra để có một khách hàng mới.' },
  { id: 'q2', question: 'Một doanh nghiệp lành mạnh thường có tỉ lệ LTV/CAC?', options: ['Nhỏ hơn 1', 'Bằng đúng 1', 'Lớn hơn hoặc bằng 3', 'Không quan trọng'], correctIndex: 2, explanation: 'LTV/CAC ≥ 3 là mốc tham chiếu cho thấy thu về gấp nhiều lần chi phí thu hút khách.' },
  { id: 'q3', question: 'Nếu CAC lớn hơn số tiền khách hàng từng trả (LTV), thì tăng trưởng?', options: ['Càng nhanh càng tốt', 'Chỉ khiến đốt tiền nhanh hơn', 'Không ảnh hưởng gì', 'Tự động sinh lời'], correctIndex: 1, explanation: 'Thu hút mỗi khách lỗ thì mở rộng chỉ làm khoản lỗ lớn nhanh hơn.' },
]);

const c7 = doc('exe401-7-1-finance-fundraising', '7 — Finance, fundraising & pitch deck|||7 — Tài chính, gọi vốn & pitch deck',
  'Mô hình tài chính & dự báo; điểm hoà vốn; các vòng gọi vốn & định giá; cấu trúc pitch deck 10 slide.',
  [[
    `<span class="eyebrow">EXE401 · Stage 7</span>
<h2>Finance, fundraising &amp; the pitch</h2>
<p>You need numbers that hang together and a story that makes an investor lean in.</p>
<h3>The financial model</h3>
<pre><code>Simple projection (per month)
 Revenue      = paying users x price
 - COGS       (servers, payment fees)
 = Gross profit
 - OpEx       (salaries, marketing, rent)
 = Net profit / burn
 Break-even   = when revenue covers total costs
 Runway       = cash / monthly burn  (months of life left)
</code></pre>
<h3>Raising money</h3>
<ul>
<li><strong>Bootstrapping</strong> — grow on revenue, no outside money.</li>
<li><strong>Pre-seed / seed / Series A</strong> — stages of raising, at rising valuations, giving up equity.</li>
<li><strong>The ask</strong> — how much, for what milestones, and what it buys the investor.</li>
</ul>
<h3>Pitch deck (about 10 slides)</h3>
<pre><code>1 Problem   2 Solution   3 Market (TAM/SAM/SOM)
4 Product   5 Business model   6 Traction
7 Competition   8 Team   9 Financials   10 The ask
</code></pre>
<div class="callout"><span class="badge">Traction speaks loudest</span> Investors fund evidence, not ideas. One real chart of growing usage or revenue beats ten slides of projections.</div>`,
    `<span class="eyebrow">EXE401 · Giai đoạn 7</span>
<h2>Tài chính, gọi vốn &amp; pitch</h2>
<p>Bạn cần những con số ăn khớp với nhau và một câu chuyện khiến nhà đầu tư nghiêng người tới.</p>
<h3>Mô hình tài chính</h3>
<pre><code>Dự báo đơn giản (mỗi tháng)
 Doanh thu    = số khách trả tiền x giá
 - COGS       (máy chủ, phí thanh toán)
 = Lợi nhuận gộp
 - OpEx       (lương, marketing, thuê mặt bằng)
 = Lãi ròng / mức đốt tiền
 Điểm hoà vốn = khi doanh thu bù đủ tổng chi phí
 Runway       = tiền mặt / mức đốt mỗi tháng  (còn sống được mấy tháng)
</code></pre>
<h3>Gọi vốn</h3>
<ul>
<li><strong>Bootstrapping</strong> — lớn lên bằng doanh thu, không tiền ngoài.</li>
<li><strong>Pre-seed / seed / Series A</strong> — các vòng gọi vốn, định giá tăng dần, đổi lấy cổ phần.</li>
<li><strong>Số vốn cần (the ask)</strong> — bao nhiêu, để đạt cột mốc gì, và nhà đầu tư nhận được gì.</li>
</ul>
<h3>Pitch deck (khoảng 10 slide)</h3>
<pre><code>1 Vấn đề   2 Giải pháp   3 Thị trường (TAM/SAM/SOM)
4 Sản phẩm   5 Mô hình kinh doanh   6 Traction
7 Cạnh tranh   8 Đội ngũ   9 Tài chính   10 Số vốn cần
</code></pre>
<div class="callout"><span class="badge">Traction nói to nhất</span> Nhà đầu tư rót tiền vào bằng chứng, không vào ý tưởng. Một biểu đồ thật về lượng dùng hay doanh thu đang tăng hơn hẳn mười slide dự báo.</div>`,
  ]]);

const c7q = quiz('exe401-quiz-7', 'Quiz 7 — Finance & pitch|||Quiz 7 — Tài chính & pitch', [
  { id: 'q1', question: '"Runway" của startup nghĩa là?', options: ['Tổng doanh thu năm', 'Số tháng còn sống được = tiền mặt chia cho mức đốt tiền mỗi tháng', 'Số nhân viên', 'Số vòng gọi vốn đã qua'], correctIndex: 1, explanation: 'Runway = tiền mặt / burn mỗi tháng, cho biết còn bao lâu trước khi hết tiền.' },
  { id: 'q2', question: 'Điểm hoà vốn (break-even) đạt khi?', options: ['Gọi được vòng seed', 'Doanh thu bù đủ tổng chi phí', 'Ra mắt MVP', 'Có 1000 lượt đăng ký'], correctIndex: 1, explanation: 'Hoà vốn là khi doanh thu vừa đủ trang trải toàn bộ chi phí, hết đốt tiền.' },
  { id: 'q3', question: 'Điều gì thuyết phục nhà đầu tư mạnh nhất trong pitch?', options: ['Slide thiết kế đẹp', 'Traction thật — bằng chứng lượng dùng hoặc doanh thu đang tăng', 'Định giá cao', 'Nhiều tính năng đã lên kế hoạch'], correctIndex: 1, explanation: 'Nhà đầu tư rót tiền vào bằng chứng; traction thật thuyết phục hơn dự báo.' },
]);

const c8 = doc('exe401-8-1-ops-legal-defense', '8 — Operations, legal, scaling & the defense|||8 — Vận hành, pháp lý, mở rộng & bảo vệ đồ án',
  'Vận hành & đội ngũ; pháp lý (loại hình doanh nghiệp, sở hữu trí tuệ, hợp đồng); mở rộng; chuẩn bị buổi bảo vệ.',
  [[
    `<span class="eyebrow">EXE401 · Stage 8</span>
<h2>Operations, legal, scaling &amp; defense</h2>
<h3>Operations &amp; team</h3>
<p>Turn the experiment into a running business: clear roles, simple processes, and metrics you review weekly. As a founder, hire for the gaps in your own skills.</p>
<h3>Legal essentials</h3>
<ul>
<li><strong>Business entity</strong> — register the right legal form; understand tax and liability.</li>
<li><strong>Intellectual property</strong> — trademark the brand, protect know-how, respect others' IP and open-source licenses.</li>
<li><strong>Contracts &amp; data</strong> — co-founder agreement, terms of service, privacy/PDPA compliance.</li>
</ul>
<h3>Scaling</h3>
<p>Only scale <em>after</em> product-market fit. Scaling before it just multiplies a broken model. Watch that unit economics (LTV/CAC) hold as you grow.</p>
<h3>The defense</h3>
<pre><code>Defense checklist
 [ ] Problem + evidence customers care
 [ ] Solution + working MVP demo
 [ ] Business model + unit economics
 [ ] Traction / validation data
 [ ] Financials + the ask
 [ ] Team + roadmap
 [ ] Q&amp;A: know your numbers cold
</code></pre>
<div class="callout"><span class="badge">On defense day</span> Tell a clear story, show the demo live, and answer with data. The committee tests whether you understand your own business — so know every number on your slides.</div>`,
    `<span class="eyebrow">EXE401 · Giai đoạn 8</span>
<h2>Vận hành, pháp lý, mở rộng &amp; bảo vệ</h2>
<h3>Vận hành &amp; đội ngũ</h3>
<p>Biến thí nghiệm thành một doanh nghiệp chạy được: vai trò rõ, quy trình đơn giản, và các chỉ số bạn xem lại mỗi tuần. Là founder, hãy tuyển vào đúng chỗ mình còn thiếu kỹ năng.</p>
<h3>Cốt lõi pháp lý</h3>
<ul>
<li><strong>Loại hình doanh nghiệp</strong> — đăng ký đúng hình thức pháp lý; hiểu thuế và trách nhiệm.</li>
<li><strong>Sở hữu trí tuệ</strong> — đăng ký nhãn hiệu, bảo vệ bí quyết, tôn trọng IP của người khác và giấy phép nguồn mở.</li>
<li><strong>Hợp đồng &amp; dữ liệu</strong> — thoả thuận đồng sáng lập, điều khoản dịch vụ, tuân thủ bảo vệ dữ liệu cá nhân.</li>
</ul>
<h3>Mở rộng</h3>
<p>Chỉ mở rộng <em>sau khi</em> có product-market fit. Mở rộng trước đó chỉ nhân lên một mô hình hỏng. Canh cho kinh tế đơn vị (LTV/CAC) vẫn đứng vững khi lớn lên.</p>
<h3>Buổi bảo vệ</h3>
<pre><code>Checklist bảo vệ
 [ ] Vấn đề + bằng chứng khách hàng quan tâm
 [ ] Giải pháp + demo MVP chạy được
 [ ] Mô hình kinh doanh + kinh tế đơn vị
 [ ] Dữ liệu traction / kiểm chứng
 [ ] Tài chính + số vốn cần
 [ ] Đội ngũ + lộ trình
 [ ] Hỏi đáp: thuộc lòng các con số
</code></pre>
<div class="callout"><span class="badge">Ngày bảo vệ</span> Kể một câu chuyện rõ ràng, demo trực tiếp, và trả lời bằng dữ liệu. Hội đồng kiểm xem bạn có hiểu chính doanh nghiệp mình không — nên hãy thuộc từng con số trên slide.</div>`,
  ]]);

const c8q = quiz('exe401-quiz-8', 'Quiz 8 — Ops, legal & defense|||Quiz 8 — Vận hành, pháp lý & bảo vệ', [
  { id: 'q1', question: 'Nên mở rộng (scaling) startup vào lúc nào?', options: ['Ngay khi có ý tưởng', 'Sau khi đạt product-market fit', 'Ngay sau khi ra MVP đầu tiên', 'Khi đăng ký nhãn hiệu xong'], correctIndex: 1, explanation: 'Mở rộng trước PMF chỉ nhân lên một mô hình còn hỏng; hãy tìm PMF trước.' },
  { id: 'q2', question: 'Việc nào thuộc phần pháp lý cốt lõi của startup?', options: ['Chọn màu logo', 'Đăng ký loại hình doanh nghiệp và bảo vệ sở hữu trí tuệ', 'Thiết kế slide', 'Viết blog'], correctIndex: 1, explanation: 'Đăng ký pháp nhân, nhãn hiệu, hợp đồng và tuân thủ dữ liệu là nền pháp lý bắt buộc.' },
  { id: 'q3', question: 'Trong buổi bảo vệ đồ án, điều hội đồng đánh giá cao nhất thường là?', options: ['Slide nhiều hiệu ứng', 'Hiểu rõ doanh nghiệp của mình, demo chạy được và trả lời bằng dữ liệu', 'Số lượng tính năng hứa hẹn', 'Định giá công ty thật cao'], correctIndex: 1, explanation: 'Hội đồng kiểm mức độ bạn hiểu chính dự án: bằng chứng, demo thật và số liệu vững.' },
]);

export default {
  semester: { code: 'FPTU_Hola9', name: 'Kỳ 9', ordinal: 11 },
  course: {
    courseCode: 'EXE401',
    slug: 'exe401-graduation-thesis-startup-project',
    title: 'Graduation Thesis Startup Project',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EXE401.webp',
    shortDescription: 'Build a real startup — idea & problem, customer discovery, Business Model Canvas, MVP, product-market fit, go-to-market, finance & fundraising, ops/legal & the defense. Lean Startup, BMC, Zero to One. Bilingual, 8 stages + quizzes.|||Xây một startup thật — ý tưởng & vấn đề, khám phá khách hàng, Business Model Canvas, MVP, product-market fit, go-to-market, tài chính & gọi vốn, vận hành/pháp lý & bảo vệ. Lean Startup, BMC, Zero to One. Song ngữ, 8 giai đoạn + quiz.',
    description: 'Môn <strong>EXE401 — Graduation Thesis Startup Project</strong> (Đồ án tốt nghiệp Khởi nghiệp, ngành Hệ thống thông tin, Kỳ 9) là một đồ án tổng hợp: bạn xây một startup thật thay vì học 8 chương lý thuyết. Khung theo <strong>quy trình xây dựng startup thực tế qua 8 giai đoạn</strong>: (1) ý tưởng &amp; vấn đề → (2) khám phá khách hàng &amp; thị trường → (3) Business Model Canvas &amp; đề xuất giá trị → (4) MVP → (5) kiểm chứng &amp; product-market fit → (6) go-to-market → (7) tài chính, gọi vốn &amp; pitch deck → (8) vận hành, pháp lý, mở rộng &amp; bảo vệ. Deliverable: kế hoạch kinh doanh, MVP chạy được, mô hình tài chính, và buổi bảo vệ pitch trước hội đồng. Dựa trên <em>The Lean Startup</em> (Ries), <em>Business Model Generation</em> (Osterwalder), <em>Zero to One</em> (Thiel) và Y Combinator Startup School. Song ngữ, mỗi giai đoạn một tài liệu + quiz.',
    whatYouLearn: 'Tìm &amp; kiểm chứng vấn đề (problem-solution fit); phỏng vấn khám phá khách hàng &amp; ước lượng thị trường (TAM/SAM/SOM); dựng Business Model Canvas 9 khối &amp; đề xuất giá trị; xây MVP theo vòng Build-Measure-Learn; đo product-market fit bằng phễu AARRR &amp; tránh metric ảo; lập go-to-market với CAC/LTV; dựng mô hình tài chính, runway, điểm hoà vốn, các vòng gọi vốn &amp; pitch deck 10 slide; vận hành, pháp lý (pháp nhân, sở hữu trí tuệ), mở rộng &amp; bảo vệ đồ án.',
    requirements: 'Đã hoàn thành các môn EXE/nền tảng theo khung ngành Hệ thống thông tin. Nên có một ý tưởng khởi nghiệp ban đầu và sẵn sàng nói chuyện với người dùng thật. Xem điều kiện tiên quyết chính thức trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & rubric trên FLM, sách khởi nghiệp, YC Startup School, công cụ, deliverable.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đồ án khởi nghiệp là gì, deliverable, rubric, lộ trình 8 giai đoạn.', lessons: [intro] },
    { title: 'Giai đoạn 1 — Ý tưởng & vấn đề|||Stage 1 — Idea & problem', description: 'Problem-solution fit, phỏng vấn vấn đề.', lessons: [c1, c1q] },
    { title: 'Giai đoạn 2 — Thị trường & khách hàng|||Stage 2 — Market & customers', description: 'Customer discovery, TAM/SAM/SOM, đối thủ.', lessons: [c2, c2q] },
    { title: 'Giai đoạn 3 — Business Model Canvas|||Stage 3 — Business Model Canvas', description: 'BMC 9 khối, đề xuất giá trị, doanh thu/chi phí.', lessons: [c3, c3q] },
    { title: 'Giai đoạn 4 — MVP & sản phẩm|||Stage 4 — MVP & product', description: 'Các loại MVP, Build-Measure-Learn, ưu tiên.', lessons: [c4, c4q] },
    { title: 'Giai đoạn 5 — Kiểm chứng & PMF|||Stage 5 — Validation & PMF', description: 'AARRR, metric ảo, pivot, product-market fit.', lessons: [c5, c5q] },
    { title: 'Giai đoạn 6 — Go-to-market|||Stage 6 — Go-to-market', description: 'Kênh, phễu bán hàng, CAC/LTV, tăng trưởng.', lessons: [c6, c6q] },
    { title: 'Giai đoạn 7 — Tài chính & gọi vốn|||Stage 7 — Finance & fundraising', description: 'Mô hình tài chính, runway, gọi vốn, pitch deck.', lessons: [c7, c7q] },
    { title: 'Giai đoạn 8 — Vận hành, pháp lý & bảo vệ|||Stage 8 — Ops, legal & defense', description: 'Vận hành, pháp lý, sở hữu trí tuệ, mở rộng, bảo vệ.', lessons: [c8, c8q] },
  ],
};
