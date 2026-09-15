/**
 * REM301 — Research Methods (Phương pháp nghiên cứu kinh doanh tổng quát).
 * Giáo trình tham khảo (trích dẫn, không upload PDF): "Business Research
 * Methods" (Zikmund/Babin), "Research Methods for Business" (Sekaran &
 * Bougie), "Research Methods for Business Students" (Saunders). Khối BBA,
 * kỳ 8 — cân bằng định tính + định lượng, phục vụ khoá luận/dự án tốt nghiệp.
 * Phân biệt với RMB302 (định lượng chuyên sâu) và RMC301 (giao tiếp nghiên
 * cứu) — REM301 là quy trình TOÀN CỤC. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('rem301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: ba giáo trình chuẩn (Zikmund/Babin, Sekaran & Bougie, Saunders), công cụ tìm tài liệu & thống kê, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">REM301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn business Research Methods — from framing a problem to writing the final report — for your thesis or graduation project. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; the three textbooks below are the standard references cited across BBA research-methods courses.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><em>Business Research Methods</em> — Zikmund, Babin, Carr &amp; Griffin (rigorous, strong on sampling &amp; measurement)</li>
<li><em>Research Methods for Business</em> — Uma Sekaran &amp; Roger Bougie (clear on the research process &amp; hypothesis testing)</li>
<li><em>Research Methods for Business Students</em> — Saunders, Lewis &amp; Thornhill (the "research onion" model; strong on design choices)</li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — official slides &amp; syllabus, sign in with your FPTU account</li>
<li><a href="https://scholar.google.com" target="_blank" rel="noopener">Google Scholar</a> — search peer-reviewed literature</li>
<li><a href="https://conjointly.com/kb/" target="_blank" rel="noopener">Research Methods Knowledge Base</a> (W. Trochim) — free reference on design, measurement &amp; analysis</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@DrToddGrande" target="_blank" rel="noopener">Dr. Todd Grande</a> — research methods &amp; statistics explained</li>
<li><a href="https://www.youtube.com/@GrahamRGibbs" target="_blank" rel="noopener">Graham R. Gibbs</a> — qualitative research &amp; thematic analysis</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.ibm.com/products/spss-statistics" target="_blank" rel="noopener">IBM SPSS Statistics</a> — the standard quantitative-analysis package used in BBA courses</li>
<li><a href="https://www.zotero.org/" target="_blank" rel="noopener">Zotero</a> / <a href="https://www.mendeley.com/" target="_blank" rel="noopener">Mendeley</a> — citation managers (APA style)</li>
<li><a href="https://forms.google.com/" target="_blank" rel="noopener">Google Forms</a> — quick questionnaire deployment &amp; piloting</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the research process, problem framing, literature review.</li>
<li><strong>Design</strong> — theoretical framework, hypotheses, research design choices.</li>
<li><strong>Execution</strong> — measurement &amp; questionnaires, sampling &amp; data collection, then qualitative or quantitative analysis as the question demands.</li>
<li><strong>Delivery</strong> — write the report, present the data honestly, and respect research ethics throughout.</li>
</ol></div>`,
    `<span class="eyebrow">REM301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Phương pháp nghiên cứu kinh doanh — từ đặt vấn đề đến viết báo cáo cuối — phục vụ khoá luận/dự án tốt nghiệp. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; ba giáo trình dưới đây là tài liệu chuẩn được trích dẫn trong các môn phương pháp nghiên cứu khối BBA.</p>
<h3>📘 Giáo trình chính</h3>
<ul>
<li><em>Business Research Methods</em> — Zikmund, Babin, Carr &amp; Griffin (chặt chẽ, mạnh về chọn mẫu &amp; đo lường)</li>
<li><em>Research Methods for Business</em> — Uma Sekaran &amp; Roger Bougie (rõ về quy trình nghiên cứu &amp; kiểm định giả thuyết)</li>
<li><em>Research Methods for Business Students</em> — Saunders, Lewis &amp; Thornhill (mô hình "củ hành nghiên cứu"; mạnh về lựa chọn thiết kế)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — slide &amp; giáo trình chính thức, đăng nhập bằng tài khoản FPTU</li>
<li><a href="https://scholar.google.com" target="_blank" rel="noopener">Google Scholar</a> — tìm tài liệu bình duyệt (peer-reviewed)</li>
<li><a href="https://conjointly.com/kb/" target="_blank" rel="noopener">Research Methods Knowledge Base</a> (W. Trochim) — tài liệu miễn phí về thiết kế, đo lường &amp; phân tích</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@DrToddGrande" target="_blank" rel="noopener">Dr. Todd Grande</a> — giảng phương pháp nghiên cứu &amp; thống kê</li>
<li><a href="https://www.youtube.com/@GrahamRGibbs" target="_blank" rel="noopener">Graham R. Gibbs</a> — nghiên cứu định tính &amp; phân tích chủ đề</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.ibm.com/products/spss-statistics" target="_blank" rel="noopener">IBM SPSS Statistics</a> — công cụ phân tích định lượng chuẩn trong các môn BBA</li>
<li><a href="https://www.zotero.org/" target="_blank" rel="noopener">Zotero</a> / <a href="https://www.mendeley.com/" target="_blank" rel="noopener">Mendeley</a> — quản lý trích dẫn (chuẩn APA)</li>
<li><a href="https://forms.google.com/" target="_blank" rel="noopener">Google Forms</a> — triển khai &amp; thử nghiệm bảng hỏi nhanh</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — quy trình nghiên cứu, đặt vấn đề, tổng quan tài liệu.</li>
<li><strong>Thiết kế</strong> — khung lý thuyết, giả thuyết, các lựa chọn thiết kế nghiên cứu.</li>
<li><strong>Triển khai</strong> — đo lường &amp; bảng hỏi, chọn mẫu &amp; thu thập dữ liệu, rồi phân tích định tính hoặc định lượng theo đúng câu hỏi nghiên cứu.</li>
<li><strong>Hoàn thiện</strong> — viết báo cáo, trình bày dữ liệu trung thực, và tôn trọng đạo đức nghiên cứu suốt quá trình.</li>
</ol></div>`,
  ]]);

const intro = doc('rem301-0-1-overview', 'Course overview: Research Methods for business|||Tổng quan: Phương pháp nghiên cứu kinh doanh',
  'Vì sao cần một môn phương pháp nghiên cứu tổng quát (khác RMB302 định lượng, RMC301 giao tiếp nghiên cứu); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">REM301 · Lesson 0.1 · Overview</span>
<h2>Research Methods for Business</h2>
<p class="lead">This course builds the practical skill of turning a vague business worry — "sales are down", "customers keep churning" — into a properly designed study with a defensible answer. It underlies every thesis, graduation project and workplace market study you'll ever run.</p>
<h3>Why a general methods course</h3>
<p>Two sibling courses each go deep on one tool: <strong>RMB302</strong> drills quantitative statistics, <strong>RMC301</strong> drills research communication. REM301 sits underneath both — it teaches the <strong>whole cycle</strong>, qualitative and quantitative together, so you can pick the right tool for a given business question instead of reaching for the one you already know.</p>
<h3>Roadmap</h3>
<p>Overview &amp; the research process → defining the problem &amp; literature review → theoretical framework &amp; design → measurement &amp; questionnaires → sampling &amp; data collection → qualitative methods → quantitative methods &amp; SPSS → report writing &amp; ethics.</p>`,
    `<span class="eyebrow">REM301 · Bài 0.1 · Tổng quan</span>
<h2>Phương pháp nghiên cứu kinh doanh</h2>
<p class="lead">Môn này xây dựng kỹ năng thực hành biến một lo lắng mơ hồ trong kinh doanh — "doanh số giảm", "khách hàng cứ rời bỏ" — thành một nghiên cứu được thiết kế đúng đắn với câu trả lời có căn cứ. Đây là nền cho mọi khoá luận, dự án tốt nghiệp và khảo sát thị trường sau này.</p>
<h3>Vì sao cần một môn phương pháp tổng quát</h3>
<p>Hai môn song hành đi sâu vào một công cụ: <strong>RMB302</strong> đào sâu thống kê định lượng, <strong>RMC301</strong> đào sâu giao tiếp nghiên cứu. REM301 nằm bên dưới cả hai — dạy <strong>toàn bộ quy trình</strong>, định tính và định lượng cùng nhau, để bạn chọn đúng công cụ cho từng câu hỏi kinh doanh, thay vì chỉ dùng công cụ mình đã biết.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; quy trình nghiên cứu → xác định vấn đề &amp; tổng quan tài liệu → khung lý thuyết &amp; thiết kế → đo lường &amp; bảng hỏi → chọn mẫu &amp; thu thập dữ liệu → nghiên cứu định tính → nghiên cứu định lượng &amp; SPSS → viết báo cáo &amp; đạo đức.</p>`,
  ]]);

const c1 = doc('rem301-1-1-overview-process', '1.1 — Overview & the business research process|||1.1 — Tổng quan & quy trình nghiên cứu kinh doanh',
  'Định nghĩa nghiên cứu kinh doanh; quy trình 7 bước; ba mục đích nghiên cứu (khám phá/mô tả/nhân quả); ứng dụng vs cơ bản.',
  [[
    `<span class="eyebrow">REM301 · Chapter 1 · Lesson 1.1</span>
<h2>Overview &amp; the business research process</h2>
<h3>What counts as "business research"?</h3>
<p><strong>Business research</strong> is the systematic, objective process of gathering, recording and analyzing data to help managers make better decisions — distinct from gut feeling or a single anecdote.</p>
<h3>The research process — a 7-step cycle</h3>
<pre><code>1. Define the management problem / opportunity
2. Review the literature (what is already known)
3. Formulate research questions / hypotheses & design
4. Decide sampling & data-collection method
5. Collect the data
6. Analyze the data
7. Report findings & recommend action
</code></pre>
<h3>Three purposes of research</h3>
<ul>
<li><strong>Exploratory</strong> — the problem is vague; the goal is to clarify it (interviews, case studies).</li>
<li><strong>Descriptive</strong> — "what is happening" (surveys, market profiles).</li>
<li><strong>Causal (explanatory)</strong> — "why", testing cause-effect (experiments).</li>
</ul>
<div class="callout"><span class="badge">Applied, not academic</span> Business research is <strong>applied</strong> — it exists to support one specific decision, on a deadline and a budget, not to advance theory for its own sake.</div>`,
    `<span class="eyebrow">REM301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan &amp; quy trình nghiên cứu kinh doanh</h2>
<h3>"Nghiên cứu kinh doanh" là gì?</h3>
<p><strong>Nghiên cứu kinh doanh</strong> là quá trình thu thập, ghi nhận và phân tích dữ liệu một cách có hệ thống, khách quan để giúp nhà quản lý ra quyết định tốt hơn — khác với cảm tính hay một câu chuyện đơn lẻ.</p>
<h3>Quy trình nghiên cứu — chu trình 7 bước</h3>
<pre><code>1. Xác định vấn đề/cơ hội quản trị
2. Tổng quan tài liệu (cái đã biết)
3. Xây dựng câu hỏi/giả thuyết nghiên cứu & thiết kế
4. Quyết định cách chọn mẫu & thu thập dữ liệu
5. Thu thập dữ liệu
6. Phân tích dữ liệu
7. Báo cáo kết quả & đề xuất hành động
</code></pre>
<h3>Ba mục đích nghiên cứu</h3>
<ul>
<li><strong>Khám phá (exploratory)</strong> — vấn đề còn mơ hồ; mục tiêu là làm rõ nó (phỏng vấn, nghiên cứu tình huống).</li>
<li><strong>Mô tả (descriptive)</strong> — "điều gì đang xảy ra" (khảo sát, chân dung thị trường).</li>
<li><strong>Nhân quả (causal)</strong> — "vì sao", kiểm định quan hệ nhân quả (thực nghiệm).</li>
</ul>
<div class="callout"><span class="badge">Ứng dụng, không phải hàn lâm</span> Nghiên cứu kinh doanh mang tính <strong>ứng dụng</strong> — tồn tại để hỗ trợ một quyết định cụ thể, có thời hạn và ngân sách, không phải để phát triển lý thuyết vì lý thuyết.</div>`,
  ]]);

const c1q = quiz('rem301-quiz-1', 'Quiz 1 — Overview & process|||Quiz 1 — Tổng quan & quy trình', [
  { id: 'q1', question: 'Bước đầu tiên trong quy trình nghiên cứu kinh doanh là gì?', options: ['Thu thập dữ liệu', 'Xác định vấn đề quản trị', 'Viết báo cáo kết quả', 'Chọn mẫu'], correctIndex: 1, explanation: 'Quy trình bắt đầu từ việc xác định rõ vấn đề/cơ hội quản trị, trước cả tổng quan tài liệu.' },
  { id: 'q2', question: 'Nghiên cứu nhằm trả lời "vì sao/nguyên nhân dẫn đến kết quả" thuộc loại nào?', options: ['Khám phá (exploratory)', 'Mô tả (descriptive)', 'Nhân quả (causal)', 'Cơ bản (basic)'], correctIndex: 2, explanation: 'Nghiên cứu nhân quả kiểm định quan hệ nguyên nhân - kết quả, thường qua thực nghiệm.' },
  { id: 'q3', question: 'Nghiên cứu kinh doanh khác gì so với cảm tính của nhà quản lý?', options: ['Có hệ thống, khách quan, dựa trên dữ liệu', 'Luôn nhanh hơn cảm tính', 'Không cần dữ liệu thật', 'Luôn cho kết quả đúng tuyệt đối'], correctIndex: 0, explanation: 'Điểm khác biệt cốt lõi là tính hệ thống và khách quan dựa trên dữ liệu, không phải tốc độ hay sự chắc chắn tuyệt đối.' },
]);

const c2 = doc('rem301-2-1-problem-literature', '2.1 — Problem definition, research questions & literature review|||2.1 — Xác định vấn đề, câu hỏi & tổng quan tài liệu',
  'Vấn đề quản trị vs vấn đề nghiên cứu; câu hỏi & mục tiêu nghiên cứu; vai trò tổng quan tài liệu; tránh đạo văn, trích dẫn APA.',
  [[
    `<span class="eyebrow">REM301 · Chapter 2 · Lesson 2.1</span>
<h2>Defining the problem, research questions &amp; literature review</h2>
<h3>Management problem vs. research problem</h3>
<p>A <strong>management problem</strong> is symptom-level ("revenue dropped 12% this quarter"). Translating it into a <strong>research problem</strong> — a specific, answerable question about <em>why</em> — is the single most important, and most skipped, step; a well-designed study answering the wrong question wastes the whole budget.</p>
<h3>From problem to research questions &amp; objectives</h3>
<ul>
<li><strong>Research question</strong> — e.g. "Does delivery delay drive customer churn among online grocery shoppers?"</li>
<li><strong>Research objectives</strong> — the specific, measurable things the study will produce.</li>
</ul>
<h3>Literature review — standing on others' shoulders</h3>
<p>A literature review is not a shopping list of summaries — it synthesizes what's known, spots gaps, and justifies your study's variables and hypotheses. Search peer-reviewed journals (via Google Scholar or a university library database), not just the open web; track sources with a citation manager and cite properly (APA is the FPTU norm) to avoid plagiarism.</p>
<pre><code>Good research question checklist:
- Specific (not "does marketing matter?")
- Answerable with data you can realistically collect
- Grounded in a gap the literature review revealed
</code></pre>`,
    `<span class="eyebrow">REM301 · Chương 2 · Bài 2.1</span>
<h2>Xác định vấn đề, câu hỏi &amp; tổng quan tài liệu</h2>
<h3>Vấn đề quản trị vs. vấn đề nghiên cứu</h3>
<p><strong>Vấn đề quản trị</strong> nằm ở mức triệu chứng ("doanh thu giảm 12% trong quý"). Chuyển nó thành <strong>vấn đề nghiên cứu</strong> — một câu hỏi cụ thể, có thể trả lời được về <em>vì sao</em> — là bước quan trọng nhất, và cũng thường bị bỏ qua nhất; một nghiên cứu thiết kế tốt nhưng trả lời sai câu hỏi sẽ lãng phí toàn bộ ngân sách.</p>
<h3>Từ vấn đề đến câu hỏi &amp; mục tiêu nghiên cứu</h3>
<ul>
<li><strong>Câu hỏi nghiên cứu</strong> — vd "Chậm giao hàng có khiến khách mua sắm trực tuyến rời bỏ không?"</li>
<li><strong>Mục tiêu nghiên cứu</strong> — những kết quả cụ thể, đo được mà nghiên cứu sẽ tạo ra.</li>
</ul>
<h3>Tổng quan tài liệu — đứng trên vai người khác</h3>
<p>Tổng quan tài liệu không phải danh sách tóm tắt các bài — nó tổng hợp cái đã biết, chỉ ra khoảng trống, và làm nền cho biến số &amp; giả thuyết của nghiên cứu. Tìm trong tạp chí bình duyệt (qua Google Scholar hoặc cơ sở dữ liệu thư viện trường), không chỉ web mở; theo dõi nguồn bằng công cụ quản lý trích dẫn và trích dẫn đúng chuẩn (APA theo quy định FPTU) để tránh đạo văn.</p>
<pre><code>Danh sách kiểm câu hỏi nghiên cứu tốt:
- Cụ thể (không phải "marketing có quan trọng không?")
- Trả lời được bằng dữ liệu bạn thực tế thu thập được
- Bám vào một khoảng trống mà tổng quan tài liệu chỉ ra
</code></pre>`,
  ]]);

const c2q = quiz('rem301-quiz-2', 'Quiz 2 — Problem & literature review|||Quiz 2 — Vấn đề & tổng quan tài liệu', [
  { id: 'q1', question: '"Doanh thu giảm 12% trong quý" là ví dụ của gì?', options: ['Vấn đề nghiên cứu', 'Vấn đề quản trị (management problem)', 'Giả thuyết nghiên cứu', 'Thang đo Likert'], correctIndex: 1, explanation: 'Đây là mức triệu chứng - vấn đề quản trị; cần dịch thành vấn đề nghiên cứu cụ thể trước khi thiết kế nghiên cứu.' },
  { id: 'q2', question: 'Vai trò chính của tổng quan tài liệu là gì?', options: ['Chỉ liệt kê tóm tắt các bài báo đã đọc', 'Tổng hợp cái đã biết, chỉ ra khoảng trống, làm nền cho biến số & giả thuyết', 'Thay thế hoàn toàn cho việc thu thập dữ liệu', 'Chỉ cần dùng bất kỳ trang web nào tìm được'], correctIndex: 1, explanation: 'Tổng quan tài liệu tổng hợp và định hướng nghiên cứu, không phải một bản tóm tắt rời rạc.' },
  { id: 'q3', question: 'Nguồn nào nên ưu tiên khi tìm tài liệu học thuật cho nghiên cứu?', options: ['Bài đăng mạng xã hội', 'Tạp chí bình duyệt (peer-reviewed) qua Google Scholar hoặc thư viện trường', 'Blog cá nhân không rõ tác giả', 'Diễn đàn thảo luận công khai'], correctIndex: 1, explanation: 'Tạp chí bình duyệt đảm bảo chất lượng và độ tin cậy học thuật cao hơn các nguồn không kiểm duyệt.' },
]);

const c3 = doc('rem301-3-1-framework-hypotheses-design', '3.1 — Theoretical framework, hypotheses & research design|||3.1 — Khung lý thuyết, giả thuyết & thiết kế nghiên cứu',
  'Biến độc lập/phụ thuộc, biến trung gian/điều tiết; giả thuyết H0/Ha; lựa chọn thiết kế (cắt ngang/dọc, đơn/đa phương pháp).',
  [[
    `<span class="eyebrow">REM301 · Chapter 3 · Lesson 3.1</span>
<h2>Theoretical framework, hypotheses &amp; research design</h2>
<h3>Conceptual/theoretical framework</h3>
<p>A framework maps your variables and the relationships you expect: an <strong>independent variable (IV)</strong> (the presumed cause), a <strong>dependent variable (DV)</strong> (the outcome), plus optional <strong>mediators</strong> (explain <em>how</em> IV affects DV) and <strong>moderators</strong> (change the <em>strength</em> of that effect).</p>
<pre><code>Example: Service quality (IV) -> Customer satisfaction (DV)
         Trust = mediator (service quality builds trust, trust drives satisfaction)
         Price sensitivity = moderator (effect weaker for price-sensitive customers)
</code></pre>
<h3>Hypotheses</h3>
<ul>
<li><strong>H0 (null)</strong> — no relationship / no difference.</li>
<li><strong>Ha/H1 (alternative)</strong> — the relationship the researcher expects, stated directionally when theory supports it ("higher X leads to higher Y").</li>
</ul>
<h3>Research design — key choices (Saunders' "research onion")</h3>
<ul>
<li><strong>Time horizon</strong> — cross-sectional (one point in time) vs. longitudinal (over time).</li>
<li><strong>Strategy</strong> — survey, case study, experiment, ethnography, action research.</li>
<li><strong>Choice</strong> — mono method, mixed methods, or multi-method (qual + quant).</li>
</ul>
<div class="callout"><span class="badge">Design before data</span> Design decisions lock in what you CAN conclude later — fixing a design mistake after collecting data is often impossible.</div>`,
    `<span class="eyebrow">REM301 · Chương 3 · Bài 3.1</span>
<h2>Khung lý thuyết, giả thuyết &amp; thiết kế nghiên cứu</h2>
<h3>Khung khái niệm/lý thuyết</h3>
<p>Một khung lý thuyết vẽ ra các biến số và mối quan hệ kỳ vọng: <strong>biến độc lập (IV)</strong> (nguyên nhân giả định), <strong>biến phụ thuộc (DV)</strong> (kết quả), cùng <strong>biến trung gian</strong> (giải thích <em>cách</em> IV ảnh hưởng đến DV) và <strong>biến điều tiết</strong> (thay đổi <em>độ mạnh</em> của ảnh hưởng đó).</p>
<pre><code>Ví dụ: Chất lượng dịch vụ (IV) -> Sự hài lòng khách hàng (DV)
       Niềm tin = biến trung gian (chất lượng dịch vụ xây niềm tin, niềm tin tạo hài lòng)
       Độ nhạy giá = biến điều tiết (ảnh hưởng yếu hơn ở khách nhạy cảm giá)
</code></pre>
<h3>Giả thuyết</h3>
<ul>
<li><strong>H0 (giả thuyết không - null)</strong> — không có mối quan hệ/khác biệt.</li>
<li><strong>Ha/H1 (giả thuyết đối)</strong> — mối quan hệ nhà nghiên cứu kỳ vọng, phát biểu có hướng khi lý thuyết ủng hộ ("X cao hơn dẫn đến Y cao hơn").</li>
</ul>
<h3>Thiết kế nghiên cứu — các lựa chọn chính ("củ hành nghiên cứu" của Saunders)</h3>
<ul>
<li><strong>Khung thời gian</strong> — cắt ngang (một thời điểm) vs. theo chiều dọc (qua nhiều thời điểm).</li>
<li><strong>Chiến lược</strong> — khảo sát, nghiên cứu tình huống, thực nghiệm, dân tộc học, nghiên cứu hành động.</li>
<li><strong>Lựa chọn phương pháp</strong> — đơn phương pháp, phương pháp hỗn hợp, hoặc đa phương pháp (định tính + định lượng).</li>
</ul>
<div class="callout"><span class="badge">Thiết kế trước dữ liệu</span> Quyết định thiết kế chốt lại những gì bạn CÓ THỂ kết luận sau này — sửa lỗi thiết kế sau khi đã thu thập dữ liệu thường là không thể.</div>`,
  ]]);

const c3q = quiz('rem301-quiz-3', 'Quiz 3 — Framework, hypotheses & design|||Quiz 3 — Khung lý thuyết, giả thuyết & thiết kế', [
  { id: 'q1', question: 'Biến giải thích CƠ CHẾ vì sao IV ảnh hưởng đến DV gọi là gì?', options: ['Biến điều tiết (moderator)', 'Biến trung gian (mediator)', 'Biến kiểm soát', 'Biến phụ thuộc (DV)'], correctIndex: 1, explanation: 'Biến trung gian giải thích cơ chế (cách) mà IV tác động đến DV; biến điều tiết chỉ thay đổi độ mạnh của tác động.' },
  { id: 'q2', question: 'Giả thuyết H0 (null) phát biểu điều gì?', options: ['Có mối quan hệ mạnh giữa các biến', 'Không có mối quan hệ/khác biệt giữa các biến', 'Nghiên cứu chắc chắn đúng', 'Mẫu phải đủ lớn'], correctIndex: 1, explanation: 'H0 luôn là giả thuyết "không có quan hệ/khác biệt", dùng để kiểm định thống kê.' },
  { id: 'q3', question: 'Thiết kế thu dữ liệu tại NHIỀU thời điểm khác nhau để theo dõi thay đổi theo thời gian gọi là gì?', options: ['Cắt ngang (cross-sectional)', 'Theo chiều dọc (longitudinal)', 'Thực nghiệm', 'Khám phá'], correctIndex: 1, explanation: 'Nghiên cứu theo chiều dọc thu dữ liệu nhiều lần theo thời gian để quan sát sự thay đổi.' },
]);

const c4 = doc('rem301-4-1-measurement-scales-questionnaire', '4.1 — Measurement, scales & questionnaire design|||4.1 — Đo lường, thang đo & xây dựng bảng hỏi',
  'Bốn mức đo lường; thang Likert; độ tin cậy (Cronbach\'s alpha) & độ giá trị; nguyên tắc soạn bảng hỏi, thử nghiệm trước.',
  [[
    `<span class="eyebrow">REM301 · Chapter 4 · Lesson 4.1</span>
<h2>Measurement, scales &amp; questionnaire design</h2>
<h3>Levels of measurement</h3>
<pre><code>Nominal  -> categories, no order       (gender, industry sector)
Ordinal  -> ranked, unequal gaps       (satisfaction: low/medium/high)
Interval -> equal gaps, no true zero   (Likert 1-5 treated as interval)
Ratio    -> equal gaps, true zero      (revenue, age, number of employees)
</code></pre>
<h3>The Likert scale</h3>
<p>A 5- or 7-point agreement scale ("Strongly disagree" → "Strongly agree") is the workhorse of business surveys — easy for respondents, and its ordinal responses are commonly analyzed as interval data.</p>
<h3>Reliability &amp; validity</h3>
<ul>
<li><strong>Reliability</strong> — consistency of the measure; <strong>Cronbach's alpha</strong> ≥ 0.7 is the common rule-of-thumb for a multi-item scale.</li>
<li><strong>Validity</strong> — does it measure what it claims to? Content validity (experts agree items cover the concept), construct validity (relates as theory predicts), criterion validity (predicts a real outcome).</li>
</ul>
<h3>Designing a good questionnaire</h3>
<ul>
<li>One idea per question — avoid double-barreled items ("Is the price fair and the service fast?").</li>
<li>Avoid leading/loaded wording.</li>
<li>Order: easy/general questions first, sensitive/demographic questions last.</li>
<li><strong>Always pilot-test</strong> on a small sample before the full rollout.</li>
</ul>`,
    `<span class="eyebrow">REM301 · Chương 4 · Bài 4.1</span>
<h2>Đo lường, thang đo &amp; xây dựng bảng hỏi</h2>
<h3>Bốn mức đo lường</h3>
<pre><code>Định danh  -> phân loại, không thứ tự       (giới tính, ngành nghề)
Thứ bậc    -> có thứ tự, khoảng cách không đều (mức hài lòng: thấp/vừa/cao)
Khoảng     -> khoảng cách đều, không có 0 thật  (Likert 1-5 xem như khoảng)
Tỉ lệ      -> khoảng cách đều, có 0 thật        (doanh thu, tuổi, số nhân viên)
</code></pre>
<h3>Thang đo Likert</h3>
<p>Thang đồng ý 5 hoặc 7 mức ("Hoàn toàn không đồng ý" → "Hoàn toàn đồng ý") là công cụ chủ lực của khảo sát kinh doanh — dễ cho người trả lời, và dữ liệu thứ bậc của nó thường được phân tích như dữ liệu khoảng.</p>
<h3>Độ tin cậy &amp; độ giá trị</h3>
<ul>
<li><strong>Độ tin cậy (reliability)</strong> — tính nhất quán của phép đo; <strong>Cronbach's alpha</strong> ≥ 0,7 là quy tắc thường dùng cho thang đo nhiều mục.</li>
<li><strong>Độ giá trị (validity)</strong> — thang đo có đo đúng cái nó claim không? Giá trị nội dung (chuyên gia đồng thuận các mục bao quát khái niệm), giá trị cấu trúc (quan hệ đúng như lý thuyết dự đoán), giá trị tiêu chí (dự báo được một kết quả thực tế).</li>
</ul>
<h3>Soạn một bảng hỏi tốt</h3>
<ul>
<li>Mỗi câu hỏi chỉ một ý — tránh câu hỏi hai ý ("Giá có hợp lý và dịch vụ có nhanh không?").</li>
<li>Tránh dùng từ ngữ dẫn dắt/áp đặt.</li>
<li>Thứ tự: câu dễ/chung trước, câu nhạy cảm/thông tin cá nhân đặt cuối.</li>
<li><strong>Luôn thử nghiệm (pilot test)</strong> trên mẫu nhỏ trước khi triển khai đại trà.</li>
</ul>`,
  ]]);

const c4q = quiz('rem301-quiz-4', 'Quiz 4 — Measurement & questionnaire|||Quiz 4 — Đo lường & bảng hỏi', [
  { id: 'q1', question: 'Thang đo nào có "0 thật" và các khoảng cách bằng nhau, ví dụ doanh thu, tuổi?', options: ['Định danh (nominal)', 'Thứ bậc (ordinal)', 'Khoảng (interval)', 'Tỉ lệ (ratio)'], correctIndex: 3, explanation: 'Thang tỉ lệ có 0 thật và khoảng cách đều, cho phép so sánh tỉ lệ (ví dụ doanh thu gấp đôi).' },
  { id: 'q2', question: 'Hệ số Cronbach\'s alpha dùng để đo điều gì của thang đo?', options: ['Độ giá trị (validity)', 'Độ tin cậy (reliability)', 'Kích thước mẫu', 'Sai số chọn mẫu'], correctIndex: 1, explanation: 'Cronbach\'s alpha đo tính nhất quán nội tại (độ tin cậy) của một thang đo nhiều mục.' },
  { id: 'q3', question: 'Câu hỏi "Giá có hợp lý và dịch vụ có nhanh không?" mắc lỗi gì trong thiết kế bảng hỏi?', options: ['Dẫn dắt (leading)', 'Hai ý gộp trong một câu (double-barreled)', 'Câu quá ngắn', 'Không liên quan đến chủ đề'], correctIndex: 1, explanation: 'Câu hỏi gộp hai ý (giá và tốc độ dịch vụ) khiến người trả lời không biết đang trả lời cho ý nào.' },
]);

const c5 = doc('rem301-5-1-sampling-data-collection', '5.1 — Sampling & data collection|||5.1 — Chọn mẫu & thu thập dữ liệu',
  'Tổng thể vs mẫu; chọn mẫu xác suất (ngẫu nhiên đơn giản/phân tầng/cụm/hệ thống) vs phi xác suất; dữ liệu sơ cấp vs thứ cấp.',
  [[
    `<span class="eyebrow">REM301 · Chapter 5 · Lesson 5.1</span>
<h2>Sampling &amp; data collection</h2>
<h3>Population vs. sample</h3>
<p>The <strong>population</strong> is everyone/everything you want to conclude about (all customers of a chain); the <strong>sample</strong> is the subset you actually study. Good sampling lets you generalize from a small, affordable sample back to the whole population.</p>
<h3>Probability sampling — every unit has a known chance</h3>
<ul>
<li><strong>Simple random</strong> — pure lottery.</li>
<li><strong>Stratified</strong> — split into subgroups (e.g. by region), sample within each — guarantees representation.</li>
<li><strong>Cluster</strong> — sample whole groups (e.g. entire stores), then study everyone inside.</li>
<li><strong>Systematic</strong> — every k-th unit from a list.</li>
</ul>
<h3>Non-probability sampling — faster, cheaper, less generalizable</h3>
<ul>
<li><strong>Convenience</strong> — whoever's easiest to reach (common for student projects).</li>
<li><strong>Judgment/purposive</strong> — deliberately chosen experts/typical cases.</li>
<li><strong>Quota</strong> — fill target counts per subgroup, non-randomly.</li>
<li><strong>Snowball</strong> — existing respondents refer new ones (hard-to-reach populations).</li>
</ul>
<h3>Data sources</h3>
<p><strong>Primary data</strong> — collected for this study (survey, interview, experiment). <strong>Secondary data</strong> — already exists (company records, government statistics, industry reports) — faster to check, but verify relevance and reliability first.</p>
<div class="callout"><span class="badge">Bigger isn't automatically better</span> A large convenience sample can still be badly biased; a smaller, well-designed probability sample often generalizes better.</div>`,
    `<span class="eyebrow">REM301 · Chương 5 · Bài 5.1</span>
<h2>Chọn mẫu &amp; thu thập dữ liệu</h2>
<h3>Tổng thể vs. mẫu</h3>
<p><strong>Tổng thể (population)</strong> là toàn bộ đối tượng bạn muốn kết luận đến (mọi khách hàng của một chuỗi); <strong>mẫu (sample)</strong> là tập con bạn thực sự nghiên cứu. Chọn mẫu tốt cho phép suy rộng từ một mẫu nhỏ, tiết kiệm chi phí, ra toàn bộ tổng thể.</p>
<h3>Chọn mẫu xác suất — mỗi đơn vị có xác suất được chọn xác định</h3>
<ul>
<li><strong>Ngẫu nhiên đơn giản</strong> — như rút số ngẫu nhiên thuần túy.</li>
<li><strong>Phân tầng (stratified)</strong> — chia thành nhóm con (vd theo vùng), chọn mẫu trong từng nhóm — đảm bảo tính đại diện.</li>
<li><strong>Cụm (cluster)</strong> — chọn cả nhóm (vd toàn bộ cửa hàng), rồi nghiên cứu mọi người trong đó.</li>
<li><strong>Hệ thống (systematic)</strong> — chọn mỗi phần tử thứ k trong danh sách.</li>
</ul>
<h3>Chọn mẫu phi xác suất — nhanh hơn, rẻ hơn, khó suy rộng hơn</h3>
<ul>
<li><strong>Thuận tiện (convenience)</strong> — ai dễ tiếp cận nhất (thường dùng cho dự án sinh viên).</li>
<li><strong>Có chủ đích (judgment/purposive)</strong> — chọn có chủ ý chuyên gia/trường hợp điển hình.</li>
<li><strong>Hạn ngạch (quota)</strong> — đủ số lượng chỉ tiêu theo nhóm con, không ngẫu nhiên.</li>
<li><strong>Quả cầu tuyết (snowball)</strong> — người trả lời hiện tại giới thiệu người mới (tổng thể khó tiếp cận).</li>
</ul>
<h3>Nguồn dữ liệu</h3>
<p><strong>Dữ liệu sơ cấp (primary)</strong> — thu thập riêng cho nghiên cứu này (khảo sát, phỏng vấn, thực nghiệm). <strong>Dữ liệu thứ cấp (secondary)</strong> — đã có sẵn (hồ sơ công ty, thống kê nhà nước, báo cáo ngành) — kiểm tra nhanh hơn, nhưng phải xác minh độ liên quan và độ tin cậy trước.</p>
<div class="callout"><span class="badge">Mẫu lớn không tự động tốt hơn</span> Một mẫu thuận tiện lớn vẫn có thể lệch nghiêm trọng; một mẫu xác suất nhỏ hơn nhưng thiết kế tốt thường suy rộng tốt hơn.</div>`,
  ]]);

const c5q = quiz('rem301-quiz-5', 'Quiz 5 — Sampling & data collection|||Quiz 5 — Chọn mẫu & thu thập dữ liệu', [
  { id: 'q1', question: 'Toàn bộ nhóm bạn muốn kết luận đến (ví dụ mọi khách hàng của một chuỗi) gọi là gì?', options: ['Mẫu (sample)', 'Tổng thể (population)', 'Biến nghiên cứu', 'Thang đo'], correctIndex: 1, explanation: 'Tổng thể là toàn bộ đối tượng nghiên cứu muốn kết luận đến; mẫu chỉ là tập con được nghiên cứu thực tế.' },
  { id: 'q2', question: 'Phương pháp chia tổng thể theo nhóm con (vd vùng miền) rồi chọn mẫu trong từng nhóm để đảm bảo tính đại diện gọi là gì?', options: ['Chọn mẫu thuận tiện', 'Chọn mẫu phân tầng (stratified)', 'Chọn mẫu quả cầu tuyết (snowball)', 'Chọn mẫu theo hạn ngạch (quota)'], correctIndex: 1, explanation: 'Chọn mẫu phân tầng chia tổng thể thành các nhóm con rồi chọn mẫu xác suất trong từng nhóm.' },
  { id: 'q3', question: 'Dữ liệu công ty/nhà nước đã có sẵn (báo cáo, thống kê) mà nhà nghiên cứu chỉ khai thác lại gọi là gì?', options: ['Dữ liệu sơ cấp (primary)', 'Dữ liệu thứ cấp (secondary)', 'Dữ liệu định tính', 'Giả thuyết nghiên cứu'], correctIndex: 1, explanation: 'Dữ liệu thứ cấp đã được thu thập trước đó cho mục đích khác, nhà nghiên cứu chỉ khai thác lại.' },
]);

const c6 = doc('rem301-6-1-qualitative', '6.1 — Qualitative research: interviews, observation & thematic analysis|||6.1 — Nghiên cứu định tính: phỏng vấn, quan sát & phân tích chủ đề',
  'Khi nào chọn định tính; phỏng vấn sâu, nhóm tập trung, quan sát, nghiên cứu tình huống; các bước phân tích chủ đề; tiêu chí đánh giá.',
  [[
    `<span class="eyebrow">REM301 · Chapter 6 · Lesson 6.1</span>
<h2>Qualitative research: interviews, observation &amp; thematic analysis</h2>
<h3>When to go qualitative</h3>
<p>Choose qualitative methods when you need <strong>depth over breadth</strong> — understanding <em>why</em> customers feel a certain way, exploring a topic too new for a structured survey, or hearing the words people actually use before you can write good questionnaire items.</p>
<h3>Core methods</h3>
<ul>
<li><strong>In-depth / semi-structured interviews</strong> — an interview guide with open questions, room to probe follow-ups.</li>
<li><strong>Focus groups</strong> — 6-10 participants, moderated discussion; group dynamics surface reactions an individual interview might miss.</li>
<li><strong>Observation</strong> — participant (researcher joins in) vs. non-participant (watches from outside); captures behavior people don't self-report accurately.</li>
<li><strong>Case study</strong> — deep dive into one organization/situation, often combining several of the above.</li>
</ul>
<h3>Thematic analysis</h3>
<pre><code>1. Transcribe the interviews/notes
2. Code - tag meaningful segments with short labels
3. Group codes into candidate themes
4. Review themes against the full dataset
5. Name & define final themes, support with quotes
</code></pre>
<h3>Judging qualitative work</h3>
<p>Qualitative studies aren't judged by statistical generalization — they're judged by <strong>credibility</strong> (does it ring true to participants?), <strong>transferability</strong> (could it apply elsewhere?) and <strong>transparency</strong> (can a reader trace the coding from raw data to theme?).</p>`,
    `<span class="eyebrow">REM301 · Chương 6 · Bài 6.1</span>
<h2>Nghiên cứu định tính: phỏng vấn, quan sát &amp; phân tích chủ đề</h2>
<h3>Khi nào chọn định tính</h3>
<p>Chọn phương pháp định tính khi cần <strong>độ sâu hơn độ rộng</strong> — hiểu <em>vì sao</em> khách hàng cảm thấy như vậy, khám phá một chủ đề quá mới để làm khảo sát có cấu trúc, hoặc nghe đúng ngôn từ người thật dùng trước khi soạn được câu hỏi bảng hỏi tốt.</p>
<h3>Các phương pháp chính</h3>
<ul>
<li><strong>Phỏng vấn sâu/bán cấu trúc</strong> — có hướng dẫn phỏng vấn với câu hỏi mở, có chỗ để hỏi thêm.</li>
<li><strong>Nhóm tập trung (focus group)</strong> — 6-10 người, có người điều phối; tương tác nhóm bộc lộ phản ứng mà phỏng vấn cá nhân có thể bỏ sót.</li>
<li><strong>Quan sát</strong> — tham dự (nhà nghiên cứu tham gia cùng) vs. không tham dự (quan sát từ ngoài); ghi nhận hành vi mà người tham gia không tự báo cáo chính xác.</li>
<li><strong>Nghiên cứu tình huống (case study)</strong> — đào sâu một tổ chức/tình huống, thường kết hợp nhiều phương pháp trên.</li>
</ul>
<h3>Phân tích chủ đề (thematic analysis)</h3>
<pre><code>1. Gỡ băng/ghi lại nội dung phỏng vấn/ghi chú
2. Mã hoá - gắn nhãn ngắn cho các đoạn có ý nghĩa
3. Nhóm các mã thành chủ đề tạm
4. Rà soát lại chủ đề với toàn bộ dữ liệu
5. Đặt tên & định nghĩa chủ đề cuối, minh hoạ bằng trích dẫn
</code></pre>
<h3>Đánh giá một nghiên cứu định tính</h3>
<p>Nghiên cứu định tính không được đánh giá bằng khả năng suy rộng thống kê — mà bằng <strong>độ tin cậy nội dung</strong> (có đúng với trải nghiệm người tham gia?), <strong>khả năng chuyển giao</strong> (có áp dụng được ở nơi khác?) và <strong>tính minh bạch</strong> (người đọc có lần theo được từ dữ liệu thô đến chủ đề?).</p>`,
  ]]);

const c6q = quiz('rem301-quiz-6', 'Quiz 6 — Qualitative research|||Quiz 6 — Nghiên cứu định tính', [
  { id: 'q1', question: 'Nên chọn phương pháp định tính khi mục tiêu chính là gì?', options: ['Đo lường chính xác trên mẫu lớn', 'Hiểu sâu "vì sao/thế nào", khám phá ý nghĩa', 'Kiểm định giả thuyết bằng thống kê', 'Tính cỡ mẫu tối thiểu cần thiết'], correctIndex: 1, explanation: 'Định tính ưu tiên độ sâu và ý nghĩa hơn là suy rộng số liệu trên mẫu lớn.' },
  { id: 'q2', question: 'Thảo luận nhóm 6-10 người, có người điều phối, tận dụng tương tác giữa các thành viên, gọi là gì?', options: ['Phỏng vấn sâu', 'Nhóm tập trung (focus group)', 'Quan sát tham dự', 'Khảo sát bảng hỏi'], correctIndex: 1, explanation: 'Nhóm tập trung dùng tương tác giữa nhiều người tham gia để bộc lộ những phản ứng mà phỏng vấn cá nhân có thể bỏ sót.' },
  { id: 'q3', question: 'Bước ĐẦU TIÊN của phân tích chủ đề sau khi có dữ liệu phỏng vấn thô là gì?', options: ['Đặt tên chủ đề cuối cùng ngay', 'Gỡ băng/ghi lại rồi mã hoá các đoạn có ý nghĩa', 'Tính hệ số Cronbach\'s alpha', 'Chạy hồi quy trên SPSS'], correctIndex: 1, explanation: 'Phân tích chủ đề bắt đầu bằng việc ghi lại dữ liệu thô rồi mã hoá, trước khi nhóm thành chủ đề.' },
]);

const c7 = doc('rem301-7-1-quantitative-spss', '7.1 — Quantitative research & basic statistical analysis (SPSS)|||7.1 — Nghiên cứu định lượng & phân tích thống kê cơ bản (SPSS)',
  'Làm sạch & mã hoá dữ liệu khảo sát; thống kê mô tả; tổng quan thống kê suy diễn (tương quan, t-test, hồi quy) và logic p-value.',
  [[
    `<span class="eyebrow">REM301 · Chapter 7 · Lesson 7.1</span>
<h2>Quantitative research &amp; basic statistical analysis (SPSS)</h2>
<h3>From questionnaire to numbers</h3>
<p>After collecting a survey, data must be <strong>cleaned</strong> (remove incomplete/invalid responses), <strong>coded</strong> (turn categories into numbers) and entered into a stats package — <strong>SPSS</strong> is the standard tool in most FPTU BBA courses.</p>
<h3>Descriptive statistics — describing the sample</h3>
<ul>
<li><strong>Mean</strong> — average; <strong>median</strong> — middle value (better for skewed data); <strong>mode</strong> — most frequent.</li>
<li><strong>Standard deviation (SD)</strong> — how spread out responses are around the mean.</li>
<li><strong>Frequency tables</strong> — counts/percentages per category (e.g. gender split).</li>
</ul>
<h3>Inferential statistics — testing a claim (overview)</h3>
<pre><code>Correlation  -> is there a relationship between two variables?
t-test       -> do two group means differ?
Regression   -> how much does X predict/explain Y?
</code></pre>
<p>The logic behind all of them: compare a <strong>p-value</strong> against a <strong>significance level</strong> (conventionally α = 0.05). p &lt; 0.05 usually means "unlikely to be chance" — reject H0. (RMB302 goes deep on running and interpreting these tests; here you only need the overview to choose the right test for your design.)</p>
<div class="callout"><span class="badge">Statistical ≠ practical significance</span> A huge sample can make a tiny, meaningless difference "statistically significant." Always ask whether the effect size matters for the business decision, not just whether p &lt; 0.05.</div>`,
    `<span class="eyebrow">REM301 · Chương 7 · Bài 7.1</span>
<h2>Nghiên cứu định lượng &amp; phân tích thống kê cơ bản (SPSS)</h2>
<h3>Từ bảng hỏi đến số liệu</h3>
<p>Sau khi thu thập khảo sát, dữ liệu cần được <strong>làm sạch</strong> (loại phiếu thiếu/không hợp lệ), <strong>mã hoá</strong> (chuyển các nhóm thành số) rồi nhập vào phần mềm thống kê — <strong>SPSS</strong> là công cụ chuẩn trong hầu hết các môn BBA của FPTU.</p>
<h3>Thống kê mô tả — mô tả mẫu</h3>
<ul>
<li><strong>Trung bình (mean)</strong> — giá trị trung bình; <strong>trung vị (median)</strong> — giá trị giữa (tốt hơn khi dữ liệu lệch); <strong>yếu vị (mode)</strong> — giá trị xuất hiện nhiều nhất.</li>
<li><strong>Độ lệch chuẩn (SD)</strong> — mức độ phân tán của các câu trả lời xung quanh giá trị trung bình.</li>
<li><strong>Bảng tần số</strong> — số lượng/tỉ lệ phần trăm theo từng nhóm (vd tỉ lệ giới tính).</li>
</ul>
<h3>Thống kê suy diễn — kiểm định một khẳng định (tổng quan)</h3>
<pre><code>Tương quan (correlation) -> có mối quan hệ giữa hai biến không?
Kiểm định t (t-test)     -> hai trung bình nhóm có khác nhau không?
Hồi quy (regression)     -> X dự báo/giải thích được bao nhiêu phần của Y?
</code></pre>
<p>Logic chung: so sánh <strong>giá trị p (p-value)</strong> với <strong>mức ý nghĩa</strong> (thường α = 0,05). p &lt; 0,05 thường được hiểu là "khó xảy ra do ngẫu nhiên" — bác bỏ H0. (RMB302 sẽ đào sâu cách chạy và diễn giải các kiểm định này; ở đây chỉ cần nắm tổng quan để chọn đúng kiểm định cho thiết kế của mình.)</p>
<div class="callout"><span class="badge">Ý nghĩa thống kê ≠ ý nghĩa thực tiễn</span> Một mẫu rất lớn có thể làm một khác biệt nhỏ, không đáng kể trở nên "có ý nghĩa thống kê". Luôn hỏi độ lớn ảnh hưởng có quan trọng với quyết định kinh doanh không, không chỉ nhìn p &lt; 0,05.</div>`,
  ]]);

const c7q = quiz('rem301-quiz-7', 'Quiz 7 — Quantitative & SPSS|||Quiz 7 — Định lượng & SPSS', [
  { id: 'q1', question: 'Trước khi đưa dữ liệu khảo sát vào SPSS, bước cần làm là gì?', options: ['Chạy hồi quy ngay', 'Làm sạch (loại phiếu lỗi/thiếu) và mã hoá dữ liệu', 'Viết báo cáo kết quả', 'Tính giá trị p trước tiên'], correctIndex: 1, explanation: 'Dữ liệu phải được làm sạch và mã hoá trước khi nhập vào phần mềm thống kê để phân tích.' },
  { id: 'q2', question: 'Giá trị p nhỏ hơn mức ý nghĩa thông thường (0,05) thường được hiểu như thế nào?', options: ['Kết quả chắc chắn đúng tuyệt đối', 'Khác biệt/quan hệ khó xảy ra do ngẫu nhiên, nên bác bỏ H0', 'Mẫu nghiên cứu quá nhỏ', 'Không cần phân tích thống kê thêm nữa'], correctIndex: 1, explanation: 'p nhỏ hơn mức ý nghĩa cho thấy kết quả khó xảy ra do ngẫu nhiên, nên bác bỏ giả thuyết H0.' },
  { id: 'q3', question: 'Vì sao "có ý nghĩa thống kê" chưa chắc "có ý nghĩa thực tiễn"?', options: ['Vì giá trị p luôn tính sai', 'Vì mẫu lớn có thể làm một khác biệt rất nhỏ vẫn ra ý nghĩa thống kê', 'Vì SPSS thường tính sai kết quả', 'Vì thống kê chỉ áp dụng cho nghiên cứu định tính'], correctIndex: 1, explanation: 'Với mẫu đủ lớn, ngay cả một khác biệt rất nhỏ và không quan trọng về kinh doanh cũng có thể đạt ý nghĩa thống kê.' },
]);

const c8 = doc('rem301-8-1-report-ethics', '8.1 — Writing & presenting the research report, and research ethics|||8.1 — Viết & trình bày báo cáo nghiên cứu, đạo đức nghiên cứu',
  'Cấu trúc báo cáo chuẩn; trình bày dữ liệu trung thực; các nguyên tắc đạo đức nghiên cứu (đồng thuận, bảo mật, trung thực, trích dẫn).',
  [[
    `<span class="eyebrow">REM301 · Chapter 8 · Lesson 8.1</span>
<h2>Writing &amp; presenting the research report, and research ethics</h2>
<h3>The standard report structure</h3>
<pre><code>1. Introduction        - problem, objectives, significance
2. Literature review   - what's known, gap, framework
3. Methodology         - design, sample, measures, procedure
4. Findings/Results    - what the data show (no interpretation yet)
5. Discussion          - what it MEANS, tied back to literature
6. Conclusion & recommendations - actionable, tied to the original problem
</code></pre>
<h3>Presenting data honestly</h3>
<ul>
<li>Choose tables/charts that match the data (bar for categories, line for trends over time).</li>
<li>Never truncate a bar-chart y-axis just to exaggerate a small difference.</li>
<li>Report sample size and response rate — a reader needs them to judge how much to trust the numbers.</li>
</ul>
<h3>Research ethics</h3>
<ul>
<li><strong>Informed consent</strong> — participants know what the study is for and agree to take part.</li>
<li><strong>Confidentiality/anonymity</strong> — protect who said what; strip identifying details from published quotes.</li>
<li><strong>No harm</strong> — the study must not damage participants' interests, wellbeing or employment.</li>
<li><strong>Honesty</strong> — never fabricate or selectively drop inconvenient data; disclose limitations.</li>
<li><strong>No plagiarism</strong> — cite every idea and quote that isn't originally yours (APA style at FPTU).</li>
</ul>
<div class="callout"><span class="badge">Ethics isn't a formality</span> A brilliant design built on a fabricated or coerced dataset is worthless — and can get a thesis rejected outright.</div>`,
    `<span class="eyebrow">REM301 · Chương 8 · Bài 8.1</span>
<h2>Viết &amp; trình bày báo cáo nghiên cứu, đạo đức nghiên cứu</h2>
<h3>Cấu trúc báo cáo chuẩn</h3>
<pre><code>1. Giới thiệu       - vấn đề, mục tiêu, ý nghĩa
2. Tổng quan tài liệu - cái đã biết, khoảng trống, khung lý thuyết
3. Phương pháp      - thiết kế, mẫu, thang đo, quy trình
4. Kết quả          - dữ liệu cho thấy gì (chưa diễn giải)
5. Thảo luận        - dữ liệu CÓ NGHĨA gì, gắn lại với tài liệu
6. Kết luận & khuyến nghị - hành động cụ thể, gắn với vấn đề gốc
</code></pre>
<h3>Trình bày dữ liệu trung thực</h3>
<ul>
<li>Chọn bảng/biểu đồ phù hợp với dữ liệu (cột cho phân loại, đường cho xu hướng theo thời gian).</li>
<li>Không bao giờ cắt bớt trục Y của biểu đồ cột chỉ để thổi phồng một khác biệt nhỏ.</li>
<li>Báo cáo kích thước mẫu và tỉ lệ phản hồi — người đọc cần chúng để đánh giá độ tin cậy của số liệu.</li>
</ul>
<h3>Đạo đức nghiên cứu</h3>
<ul>
<li><strong>Đồng thuận có hiểu biết (informed consent)</strong> — người tham gia biết mục đích nghiên cứu và đồng ý tham gia.</li>
<li><strong>Bảo mật/ẩn danh</strong> — bảo vệ danh tính ai nói gì; loại bỏ thông tin nhận diện khỏi các trích dẫn công bố.</li>
<li><strong>Không gây hại</strong> — nghiên cứu không được ảnh hưởng xấu đến lợi ích, sức khoẻ tinh thần hay công việc của người tham gia.</li>
<li><strong>Trung thực</strong> — không bao giờ bịa đặt hoặc lọc bỏ có chọn lọc dữ liệu bất lợi; công bố rõ hạn chế nghiên cứu.</li>
<li><strong>Không đạo văn</strong> — trích dẫn mọi ý tưởng và câu trích không phải của mình (chuẩn APA theo FPTU).</li>
</ul>
<div class="callout"><span class="badge">Đạo đức không phải thủ tục hình thức</span> Một thiết kế xuất sắc dựa trên dữ liệu bịa đặt hoặc ép buộc là vô giá trị — và có thể khiến khoá luận bị đánh trượt ngay lập tức.</div>`,
  ]]);

const c8q = quiz('rem301-quiz-8', 'Quiz 8 — Report & ethics|||Quiz 8 — Báo cáo & đạo đức', [
  { id: 'q1', question: 'Phần nào của báo cáo nghiên cứu trình bày dữ liệu THUẦN, CHƯA diễn giải ý nghĩa?', options: ['Thảo luận (Discussion)', 'Kết quả (Findings/Results)', 'Kết luận & khuyến nghị', 'Giới thiệu'], correctIndex: 1, explanation: 'Phần Kết quả chỉ trình bày dữ liệu thu được; việc diễn giải ý nghĩa nằm ở phần Thảo luận.' },
  { id: 'q2', question: 'Nguyên tắc đạo đức yêu cầu người tham gia biết mục đích nghiên cứu và đồng ý tham gia gọi là gì?', options: ['Bảo mật (confidentiality)', 'Đồng thuận có hiểu biết (informed consent)', 'Trung thực dữ liệu', 'Trích dẫn nguồn đầy đủ'], correctIndex: 1, explanation: 'Đồng thuận có hiểu biết là nguyên tắc người tham gia được thông báo rõ và tự nguyện đồng ý tham gia.' },
  { id: 'q3', question: 'Việc cắt bớt trục Y của biểu đồ cột để thổi phồng một khác biệt nhỏ là vi phạm điều gì?', options: ['Không vi phạm điều gì cả', 'Nguyên tắc trình bày dữ liệu trung thực (gây hiểu lầm, phi đạo đức)', 'Nguyên tắc chọn mẫu', 'Nguyên tắc đo lường'], correctIndex: 1, explanation: 'Việc bóp méo biểu đồ để phóng đại khác biệt là hành vi trình bày dữ liệu sai lệch, thiếu trung thực.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'REM301',
    slug: 'rem301-research-methods',
    title: 'Research Methods',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/REM301.webp',
    shortDescription: 'Turn a business problem into a defensible study: problem framing, literature review, theoretical framework & hypotheses, measurement & questionnaires, sampling, qualitative & quantitative methods (incl. SPSS), report writing & ethics.|||Biến vấn đề kinh doanh thành nghiên cứu có căn cứ: xác định vấn đề, tổng quan tài liệu, khung lý thuyết & giả thuyết, đo lường & bảng hỏi, chọn mẫu, phương pháp định tính & định lượng (SPSS), viết báo cáo & đạo đức.',
    description: 'Môn <strong>REM301 — Research Methods</strong> (kỳ 8, khối Quản trị Kinh doanh) dạy <strong>quy trình nghiên cứu kinh doanh tổng quát</strong>, cân bằng định tính &amp; định lượng — nền tảng cho khoá luận/dự án tốt nghiệp. Khác với <strong>RMB302</strong> (đào sâu định lượng) và <strong>RMC301</strong> (giao tiếp nghiên cứu), REM301 đi từ <strong>xác định vấn đề &amp; tổng quan tài liệu</strong> → <strong>khung lý thuyết, giả thuyết &amp; thiết kế</strong> → <strong>đo lường &amp; bảng hỏi</strong> → <strong>chọn mẫu &amp; thu thập dữ liệu</strong> → <strong>nghiên cứu định tính</strong> → <strong>nghiên cứu định lượng &amp; SPSS</strong> → <strong>viết báo cáo &amp; đạo đức nghiên cứu</strong>. Trích dẫn ba giáo trình chuẩn (Zikmund/Babin, Sekaran &amp; Bougie, Saunders), song ngữ, có quiz mỗi chương.',
    whatYouLearn: 'Quy trình nghiên cứu 7 bước & mục đích nghiên cứu (khám phá/mô tả/nhân quả); vấn đề quản trị vs vấn đề nghiên cứu; tổng quan tài liệu & trích dẫn APA; khung lý thuyết (IV/DV/trung gian/điều tiết) & giả thuyết H0/Ha; lựa chọn thiết kế nghiên cứu; bốn mức đo lường & thang Likert; độ tin cậy (Cronbach\'s alpha) & độ giá trị; soạn bảng hỏi & pilot test; chọn mẫu xác suất/phi xác suất; dữ liệu sơ cấp/thứ cấp; phỏng vấn, nhóm tập trung, quan sát & phân tích chủ đề; thống kê mô tả & suy diễn cơ bản trên SPSS; cấu trúc báo cáo nghiên cứu & đạo đức nghiên cứu.',
    requirements: 'Không yêu cầu kiến thức thống kê chuyên sâu (RMB302 sẽ đào sâu định lượng). Nên có sẵn ý tưởng đề tài khoá luận/dự án tốt nghiệp để áp dụng ngay các khái niệm. Xem giáo trình chi tiết trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Ba giáo trình chuẩn, công cụ tìm tài liệu & thống kê (SPSS), YouTube, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao cần môn phương pháp tổng quát; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & quy trình nghiên cứu|||Chapter 1 — Overview & research process', description: 'Định nghĩa, quy trình 7 bước, ba mục đích nghiên cứu.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Vấn đề, câu hỏi & tổng quan tài liệu|||Chapter 2 — Problem, questions & literature review', description: 'Vấn đề quản trị vs nghiên cứu, câu hỏi/mục tiêu, tổng quan tài liệu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Khung lý thuyết, giả thuyết & thiết kế|||Chapter 3 — Framework, hypotheses & design', description: 'IV/DV/trung gian/điều tiết, H0/Ha, lựa chọn thiết kế.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đo lường, thang đo & bảng hỏi|||Chapter 4 — Measurement, scales & questionnaire', description: 'Bốn mức đo lường, Likert, độ tin cậy/giá trị, soạn bảng hỏi.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chọn mẫu & thu thập dữ liệu|||Chapter 5 — Sampling & data collection', description: 'Chọn mẫu xác suất/phi xác suất, dữ liệu sơ cấp/thứ cấp.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nghiên cứu định tính|||Chapter 6 — Qualitative research', description: 'Phỏng vấn, nhóm tập trung, quan sát, phân tích chủ đề.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Nghiên cứu định lượng & SPSS|||Chapter 7 — Quantitative research & SPSS', description: 'Làm sạch dữ liệu, thống kê mô tả & suy diễn cơ bản.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Viết báo cáo & đạo đức nghiên cứu|||Chapter 8 — Report writing & research ethics', description: 'Cấu trúc báo cáo, trình bày dữ liệu trung thực, đạo đức nghiên cứu.', lessons: [c8, c8q] },
  ],
};
