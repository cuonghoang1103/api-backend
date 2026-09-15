/**
 * MKT301 — Marketing Research. Giáo trình FLM (syl): quy trình nghiên cứu
 * marketing từ xác định vấn đề → thiết kế nghiên cứu (định tính/định lượng)
 * → chọn mẫu & thu thập dữ liệu → phân tích (SPSS) → báo cáo & đạo đức.
 * Tham khảo: Malhotra "Marketing Research"; Churchill "Marketing Research";
 * Kotler. Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mkt301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo, tài liệu chính thức miễn phí, YouTube, công cụ khảo sát, lộ trình tự học.',
  [[
    `<span class="eyebrow">MKT301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Marketing Research</strong> — problem definition, qualitative &amp; quantitative methods, sampling, data analysis and reporting — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MKT301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Marketing Research: An Applied Orientation</em> — Naresh K. Malhotra (core textbook of this course)</li>
<li><em>Marketing Research: Methodological Foundations</em> — Gilbert A. Churchill</li>
<li><em>Principles of Marketing</em> / <em>Marketing Management</em> — Philip Kotler (framework for where research fits in the marketing process)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.insightsassociation.org/" target="_blank" rel="noopener">Insights Association</a> — industry standards &amp; guides for market research</li>
<li><a href="https://www.questionpro.com/blog/" target="_blank" rel="noopener">QuestionPro blog</a> — practical guides on surveys, sampling, scales</li>
<li><a href="https://www.surveymonkey.com/mp/survey-guidelines/" target="_blank" rel="noopener">SurveyMonkey — survey guidelines</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@marketing91" target="_blank" rel="noopener">Marketing91</a> — marketing &amp; research concepts explained</li>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot</a> — market research &amp; customer insight tutorials</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://forms.google.com/" target="_blank" rel="noopener">Google Forms</a> — free survey design &amp; collection</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — quick secondary-data check on demand/interest</li>
<li><strong>IBM SPSS Statistics</strong> — standard tool for quantitative data analysis in this course</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the research process, problem definition, research design types.</li>
<li><strong>Practice</strong> — write a real questionnaire, pilot it with 5-10 people, spot the flawed questions.</li>
<li><strong>Go deeper</strong> — sampling methods, scale design, running a t-test/ANOVA in SPSS.</li>
<li><strong>Job-ready</strong> — turn a dataset into a client-ready report with clear recommendations.</li>
</ol></div>`,
    `<span class="eyebrow">MKT301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Nghiên cứu Marketing</strong> — xác định vấn đề, phương pháp định tính &amp; định lượng, chọn mẫu, phân tích dữ liệu và báo cáo — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MKT301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Marketing Research: An Applied Orientation</em> — Naresh K. Malhotra (giáo trình gốc của môn)</li>
<li><em>Marketing Research: Methodological Foundations</em> — Gilbert A. Churchill</li>
<li><em>Principles of Marketing</em> / <em>Marketing Management</em> — Philip Kotler (khung để thấy nghiên cứu nằm ở đâu trong tiến trình marketing)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.insightsassociation.org/" target="_blank" rel="noopener">Insights Association</a> — chuẩn ngành &amp; hướng dẫn nghiên cứu thị trường</li>
<li><a href="https://www.questionpro.com/blog/" target="_blank" rel="noopener">QuestionPro blog</a> — hướng dẫn thực tế về khảo sát, chọn mẫu, thang đo</li>
<li><a href="https://www.surveymonkey.com/mp/survey-guidelines/" target="_blank" rel="noopener">SurveyMonkey — hướng dẫn làm khảo sát</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@marketing91" target="_blank" rel="noopener">Marketing91</a> — giải thích khái niệm marketing &amp; nghiên cứu</li>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot</a> — hướng dẫn nghiên cứu thị trường &amp; insight khách hàng</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://forms.google.com/" target="_blank" rel="noopener">Google Forms</a> — thiết kế &amp; thu khảo sát miễn phí</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — kiểm nhanh dữ liệu thứ cấp về nhu cầu/quan tâm</li>
<li><strong>IBM SPSS Statistics</strong> — công cụ chuẩn để phân tích dữ liệu định lượng trong môn này</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — quy trình nghiên cứu, xác định vấn đề, các loại thiết kế nghiên cứu.</li>
<li><strong>Luyện tập</strong> — viết một bảng hỏi thật, thử nghiệm với 5-10 người, tìm câu hỏi bị lỗi.</li>
<li><strong>Đào sâu thực tế</strong> — phương pháp chọn mẫu, thiết kế thang đo, chạy t-test/ANOVA trong SPSS.</li>
<li><strong>Sẵn sàng đi làm</strong> — biến một tập dữ liệu thành báo cáo cho khách hàng với khuyến nghị rõ ràng.</li>
</ol></div>`,
  ]]);

const intro = doc('mkt301-0-1-overview', 'Course overview: Marketing Research|||Tổng quan: Nghiên cứu Marketing',
  'Nghiên cứu marketing là gì, vì sao cần; quy trình 6 bước; lộ trình môn học từ xác định vấn đề đến báo cáo & đạo đức nghiên cứu.',
  [[
    `<span class="eyebrow">MKT301 · Lesson 0.1 · Overview</span>
<h2>Marketing Research</h2>
<p class="lead">This course teaches you to <strong>systematically gather, analyze and interpret information</strong> to solve marketing problems — from "should we launch this product?" to "why are customers switching to a competitor?". You'll learn the full research process end-to-end: defining the problem, choosing a design, collecting data (qualitative and quantitative), sampling, analyzing with <strong>SPSS</strong>, and writing an actionable, ethical report.</p>
<h3>Why marketing research matters</h3>
<ul>
<li><strong>Reduces risk</strong> — decisions backed by data beat decisions backed by gut feeling alone.</li>
<li><strong>Links the firm to the customer</strong> — it is the formal channel through which customer needs, perceptions and behavior reach decision-makers.</li>
<li><strong>Underpins the whole marketing mix</strong> — product, pricing, promotion and distribution decisions all draw on research findings.</li>
</ul>
<h3>Roadmap</h3>
<p>Overview &amp; process → problem definition &amp; research design → secondary data &amp; qualitative research (focus groups, interviews) → quantitative research &amp; surveys → questionnaire &amp; scale design → sampling &amp; data collection → data analysis (descriptive stats, hypothesis tests, SPSS) → interpretation, reporting &amp; research ethics.</p>`,
    `<span class="eyebrow">MKT301 · Bài 0.1 · Tổng quan</span>
<h2>Nghiên cứu Marketing</h2>
<p class="lead">Môn này dạy bạn cách <strong>thu thập, phân tích và diễn giải thông tin một cách có hệ thống</strong> để giải quyết vấn đề marketing — từ "có nên ra mắt sản phẩm này?" đến "vì sao khách hàng chuyển sang đối thủ?". Bạn học toàn bộ quy trình nghiên cứu: xác định vấn đề, chọn thiết kế, thu thập dữ liệu (định tính và định lượng), chọn mẫu, phân tích bằng <strong>SPSS</strong>, và viết báo cáo có thể hành động được, tuân thủ đạo đức nghiên cứu.</p>
<h3>Vì sao nghiên cứu marketing quan trọng</h3>
<ul>
<li><strong>Giảm rủi ro</strong> — quyết định dựa trên dữ liệu tốt hơn quyết định chỉ dựa trên cảm tính.</li>
<li><strong>Kết nối doanh nghiệp với khách hàng</strong> — là kênh chính thức để nhu cầu, nhận thức và hành vi khách hàng đến được người ra quyết định.</li>
<li><strong>Là nền cho toàn bộ marketing mix</strong> — quyết định về sản phẩm, giá, truyền thông và phân phối đều dựa trên kết quả nghiên cứu.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; quy trình → xác định vấn đề &amp; thiết kế nghiên cứu → dữ liệu thứ cấp &amp; nghiên cứu định tính (focus group, phỏng vấn) → nghiên cứu định lượng &amp; khảo sát → thiết kế bảng hỏi &amp; thang đo → chọn mẫu &amp; thu thập dữ liệu → phân tích dữ liệu (thống kê mô tả, kiểm định, SPSS) → diễn giải, báo cáo kết quả &amp; đạo đức nghiên cứu.</p>`,
  ]]);

const c1 = doc('mkt301-1-1-overview-process', '1.1 — Marketing research overview & the research process|||1.1 — Tổng quan nghiên cứu marketing & quy trình',
  'Định nghĩa nghiên cứu marketing; phân loại (探索/mô tả/nhân quả); quy trình 6 bước từ xác định vấn đề đến trình bày kết quả.',
  [[
    `<span class="eyebrow">MKT301 · Chapter 1 · Lesson 1.1</span>
<h2>Marketing research overview &amp; the research process</h2>
<h3>What is marketing research?</h3>
<p><strong>Marketing research</strong> is the systematic and objective identification, collection, analysis, dissemination and use of information to improve decision-making related to marketing problems and opportunities. It is <em>systematic</em> (planned steps, not ad-hoc guessing) and <em>objective</em> (unbiased, evidence-based).</p>
<h3>Three types of research design</h3>
<ul>
<li><strong>Exploratory</strong> — used when the problem is loosely defined; goal is to gain insight and generate hypotheses (e.g. focus groups).</li>
<li><strong>Descriptive</strong> — describes market characteristics or functions (e.g. "what percentage of customers use our app weekly?").</li>
<li><strong>Causal</strong> — tests cause-and-effect relationships, usually via experiments (e.g. "does a price cut cause higher sales?").</li>
</ul>
<h3>The six-step research process</h3>
<pre><code>1. Define the problem &amp; research objectives
2. Develop the research plan (design, data sources, methods, sample, instruments)
3. Collect the data
4. Analyze the data
5. Present the findings
6. Make the decision
</code></pre>
<div class="callout"><span class="badge">Garbage in, garbage out</span> A brilliant analysis cannot fix a badly defined problem or a badly designed plan — steps 1 and 2 decide most of the study's quality before a single data point is collected.</div>`,
    `<span class="eyebrow">MKT301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan nghiên cứu marketing &amp; quy trình</h2>
<h3>Nghiên cứu marketing là gì?</h3>
<p><strong>Nghiên cứu marketing</strong> là việc xác định, thu thập, phân tích, phổ biến và sử dụng thông tin một cách <em>có hệ thống</em> và <em>khách quan</em> để cải thiện việc ra quyết định liên quan đến các vấn đề và cơ hội marketing. "Có hệ thống" nghĩa là theo các bước đã hoạch định, không phải đoán bừa; "khách quan" nghĩa là không thiên vị, dựa trên bằng chứng.</p>
<h3>Ba loại thiết kế nghiên cứu</h3>
<ul>
<li><strong>Khám phá (exploratory)</strong> — dùng khi vấn đề chưa rõ; mục tiêu là có insight và hình thành giả thuyết (vd focus group).</li>
<li><strong>Mô tả (descriptive)</strong> — mô tả đặc điểm hoặc chức năng của thị trường (vd "bao nhiêu % khách dùng app mỗi tuần?").</li>
<li><strong>Nhân quả (causal)</strong> — kiểm tra quan hệ nhân quả, thường qua thực nghiệm (vd "giảm giá có làm tăng doanh số không?").</li>
</ul>
<h3>Quy trình nghiên cứu 6 bước</h3>
<pre><code>1. Xác định vấn đề &amp; mục tiêu nghiên cứu
2. Xây dựng kế hoạch nghiên cứu (thiết kế, nguồn dữ liệu, phương pháp, mẫu, công cụ)
3. Thu thập dữ liệu
4. Phân tích dữ liệu
5. Trình bày kết quả
6. Ra quyết định
</code></pre>
<div class="callout"><span class="badge">Rác vào, rác ra</span> Phân tích dù xuất sắc cũng không cứu được một vấn đề bị định nghĩa sai hay một kế hoạch thiết kế tệ — bước 1 và 2 quyết định phần lớn chất lượng nghiên cứu trước khi có bất kỳ dữ liệu nào.</div>`,
  ]]);

const c1q = quiz('mkt301-quiz-1', 'Quiz 1 — Overview & process|||Quiz 1 — Tổng quan & quy trình', [
  { id: 'q1', question: 'Nghiên cứu marketing được định nghĩa là mang tính chất gì?', options: ['Ngẫu nhiên & chủ quan', 'Có hệ thống & khách quan', 'Chỉ định tính', 'Chỉ dùng khi có khủng hoảng'], correctIndex: 1, explanation: 'Định nghĩa nhấn mạnh tính hệ thống (theo bước) và khách quan (không thiên vị).' },
  { id: 'q2', question: 'Loại thiết kế nào dùng khi vấn đề còn mơ hồ, cần có insight ban đầu?', options: ['Mô tả', 'Nhân quả', 'Khám phá (exploratory)', 'Thực nghiệm'], correctIndex: 2, explanation: 'Exploratory dùng khi vấn đề chưa rõ, mục tiêu là hình thành giả thuyết.' },
  { id: 'q3', question: 'Bước ĐẦU TIÊN trong quy trình nghiên cứu 6 bước là gì?', options: ['Thu thập dữ liệu', 'Xác định vấn đề & mục tiêu nghiên cứu', 'Phân tích dữ liệu', 'Trình bày kết quả'], correctIndex: 1, explanation: 'Xác định đúng vấn đề là bước đầu tiên và quan trọng nhất — mọi bước sau đều dựa vào nó.' },
]);

const c2 = doc('mkt301-2-1-problem-definition-design', '2.1 — Problem definition & research design|||2.1 — Xác định vấn đề & thiết kế nghiên cứu',
  'Từ vấn đề quản trị (management problem) sang vấn đề nghiên cứu (research problem); mục tiêu nghiên cứu; chọn thiết kế phù hợp.',
  [[
    `<span class="eyebrow">MKT301 · Chapter 2 · Lesson 2.1</span>
<h2>Problem definition &amp; research design</h2>
<h3>Management problem vs. research problem</h3>
<p>A <strong>management problem</strong> is action-oriented ("should we launch a new flavor?"). A <strong>research problem</strong> is information-oriented ("what do target customers think of the new flavor compared to competitors?"). Translating the first into the second — correctly — is often the hardest part of the whole project.</p>
<h3>Components of the research problem</h3>
<ul>
<li><strong>Background</strong> — context and symptoms that triggered the need for research.</li>
<li><strong>Research objectives</strong> — specific, measurable statements of what the study must find out.</li>
<li><strong>Theoretical framework</strong> — the concepts/variables to be examined and how they relate.</li>
</ul>
<h3>Choosing a research design</h3>
<pre><code>Problem is vague       -> Exploratory design (secondary data, qualitative)
Need to describe/count -> Descriptive design (surveys, observation)
Need to test cause     -> Causal design (experiments)
</code></pre>
<p>Many studies actually combine all three in sequence: exploratory first (to sharpen the question), then descriptive or causal to get the definitive answer.</p>
<div class="callout"><span class="badge">Common trap</span> Jumping straight to a survey before the problem is clearly defined wastes budget on precisely-measured answers to the wrong question.</div>`,
    `<span class="eyebrow">MKT301 · Chương 2 · Bài 2.1</span>
<h2>Xác định vấn đề &amp; thiết kế nghiên cứu</h2>
<h3>Vấn đề quản trị vs. vấn đề nghiên cứu</h3>
<p><strong>Vấn đề quản trị</strong> hướng về hành động ("có nên ra mắt vị mới không?"). <strong>Vấn đề nghiên cứu</strong> hướng về thông tin ("khách hàng mục tiêu nghĩ gì về vị mới so với đối thủ?"). Chuyển đúng từ vấn đề thứ nhất sang vấn đề thứ hai thường là phần khó nhất của cả dự án.</p>
<h3>Các thành phần của vấn đề nghiên cứu</h3>
<ul>
<li><strong>Bối cảnh (background)</strong> — hoàn cảnh và dấu hiệu khiến cần nghiên cứu.</li>
<li><strong>Mục tiêu nghiên cứu</strong> — các phát biểu cụ thể, đo được về điều nghiên cứu phải tìm ra.</li>
<li><strong>Khung lý thuyết</strong> — các khái niệm/biến sẽ được xem xét và quan hệ giữa chúng.</li>
</ul>
<h3>Chọn thiết kế nghiên cứu</h3>
<pre><code>Vấn đề mơ hồ         -> Thiết kế khám phá (dữ liệu thứ cấp, định tính)
Cần mô tả/đo lường   -> Thiết kế mô tả (khảo sát, quan sát)
Cần kiểm tra nhân quả -> Thiết kế nhân quả (thực nghiệm)
</code></pre>
<p>Nhiều nghiên cứu thực ra kết hợp cả ba theo trình tự: khám phá trước (để làm rõ câu hỏi), rồi mô tả hoặc nhân quả để có câu trả lời dứt điểm.</p>
<div class="callout"><span class="badge">Bẫy thường gặp</span> Nhảy thẳng vào khảo sát trước khi xác định rõ vấn đề sẽ tốn ngân sách để đo chính xác câu trả lời cho một câu hỏi sai.</div>`,
  ]]);

const c2q = quiz('mkt301-quiz-2', 'Quiz 2 — Problem & design|||Quiz 2 — Vấn đề & thiết kế', [
  { id: 'q1', question: 'Câu "khách hàng nghĩ gì về vị sản phẩm mới?" là loại vấn đề nào?', options: ['Vấn đề quản trị', 'Vấn đề nghiên cứu', 'Vấn đề đạo đức', 'Vấn đề chọn mẫu'], correctIndex: 1, explanation: 'Vấn đề nghiên cứu hướng về THÔNG TIN cần thu thập, khác vấn đề quản trị hướng về hành động.' },
  { id: 'q2', question: 'Khi vấn đề còn mơ hồ, nên chọn thiết kế nào trước?', options: ['Nhân quả (thực nghiệm)', 'Mô tả (khảo sát)', 'Khám phá (exploratory)', 'Không cần thiết kế'], correctIndex: 2, explanation: 'Exploratory giúp làm rõ vấn đề trước khi đầu tư vào mô tả hoặc thực nghiệm chính xác.' },
  { id: 'q3', question: 'Bỏ qua bước xác định vấn đề và nhảy thẳng vào khảo sát dẫn tới rủi ro gì?', options: ['Tốn tiền đo chính xác một câu hỏi sai', 'Kết quả luôn đúng hơn', 'Không có rủi ro', 'Chỉ tốn thêm thời gian, không tốn tiền'], correctIndex: 0, explanation: 'Đo chính xác nhưng đo đúng vấn đề mới có giá trị — sai vấn đề thì kết quả chính xác cũng vô nghĩa.' },
]);

const c3 = doc('mkt301-3-1-secondary-qualitative', '3.1 — Secondary data & qualitative research|||3.1 — Dữ liệu thứ cấp & nghiên cứu định tính',
  'Dữ liệu thứ cấp (nội bộ/bên ngoài) và ưu nhược điểm; nghiên cứu định tính: focus group, phỏng vấn sâu, quan sát.',
  [[
    `<span class="eyebrow">MKT301 · Chapter 3 · Lesson 3.1</span>
<h2>Secondary data &amp; qualitative research</h2>
<h3>Secondary data: fast and cheap, but not tailor-made</h3>
<p><strong>Secondary data</strong> was collected for some other purpose but can help solve the current problem. <strong>Internal</strong> sources: sales records, CRM data, past studies. <strong>External</strong> sources: government statistics, industry reports, published studies, competitor websites. Always check it first — it is far cheaper and faster than collecting new (primary) data — but evaluate its <em>relevance</em> (fits your problem?) and <em>validity</em> (who collected it, how, and when?).</p>
<h3>Qualitative research: understanding the "why"</h3>
<ul>
<li><strong>Focus groups</strong> — 8-12 participants, a moderator, guided discussion; good for uncovering a range of opinions and the language customers actually use.</li>
<li><strong>Depth interviews</strong> — one-on-one, unstructured or semi-structured; good for sensitive topics or complex individual decision processes.</li>
<li><strong>Observation</strong> — watching behavior directly (in-store, online), avoiding the gap between what people say and what people do.</li>
</ul>
<pre><code>Qualitative research is:
  Small samples, NOT statistically representative
  Rich, in-depth data (words, not numbers)
  Used to EXPLORE and generate hypotheses, not to generalize to the population
</code></pre>
<div class="callout"><span class="badge">Don't skip it</span> Running a survey before any qualitative exploration risks writing questions about the wrong things, in the wrong words.</div>`,
    `<span class="eyebrow">MKT301 · Chương 3 · Bài 3.1</span>
<h2>Dữ liệu thứ cấp &amp; nghiên cứu định tính</h2>
<h3>Dữ liệu thứ cấp: nhanh và rẻ, nhưng không "đo ni đóng giày"</h3>
<p><strong>Dữ liệu thứ cấp</strong> được thu thập cho mục đích khác nhưng có thể giúp giải quyết vấn đề hiện tại. Nguồn <strong>nội bộ</strong>: hồ sơ bán hàng, dữ liệu CRM, nghiên cứu cũ. Nguồn <strong>bên ngoài</strong>: thống kê nhà nước, báo cáo ngành, nghiên cứu đã công bố, website đối thủ. Luôn kiểm tra dữ liệu thứ cấp trước — rẻ và nhanh hơn nhiều so với thu thập dữ liệu mới (dữ liệu sơ cấp) — nhưng phải đánh giá <em>tính liên quan</em> (có phù hợp với vấn đề?) và <em>độ tin cậy</em> (ai thu thập, bằng cách nào, khi nào?).</p>
<h3>Nghiên cứu định tính: hiểu "vì sao"</h3>
<ul>
<li><strong>Focus group</strong> — 8-12 người tham gia, có người điều phối, thảo luận có hướng dẫn; tốt để khám phá nhiều quan điểm và ngôn ngữ khách hàng thực sự dùng.</li>
<li><strong>Phỏng vấn sâu</strong> — một đối một, không cấu trúc hoặc bán cấu trúc; tốt cho chủ đề nhạy cảm hoặc quy trình quyết định cá nhân phức tạp.</li>
<li><strong>Quan sát</strong> — theo dõi hành vi trực tiếp (tại cửa hàng, trực tuyến), tránh khoảng cách giữa lời nói và hành động thật.</li>
</ul>
<pre><code>Nghiên cứu định tính là:
  Mẫu nhỏ, KHÔNG đại diện thống kê
  Dữ liệu sâu, phong phú (bằng lời, không phải số)
  Dùng để KHÁM PHÁ và tạo giả thuyết, không dùng để suy rộng ra tổng thể
</code></pre>
<div class="callout"><span class="badge">Đừng bỏ qua</span> Chạy khảo sát trước khi có khám phá định tính dễ dẫn tới hỏi sai điều cần hỏi, bằng từ ngữ sai.</div>`,
  ]]);

const c3q = quiz('mkt301-quiz-3', 'Quiz 3 — Secondary & qualitative|||Quiz 3 — Thứ cấp & định tính', [
  { id: 'q1', question: 'Dữ liệu thứ cấp là gì?', options: ['Dữ liệu thu mới riêng cho vấn đề hiện tại', 'Dữ liệu đã thu thập cho mục đích khác, dùng lại', 'Chỉ có từ focus group', 'Luôn đáng tin hơn dữ liệu sơ cấp'], correctIndex: 1, explanation: 'Thứ cấp là dữ liệu có sẵn, thu cho mục đích khác, được tận dụng lại — cần kiểm liên quan & tin cậy.' },
  { id: 'q2', question: 'Focus group thường có bao nhiêu người tham gia?', options: ['1-2 người', '8-12 người', '50-100 người', 'Toàn bộ khách hàng'], correctIndex: 1, explanation: 'Focus group điển hình gồm 8-12 người, có người điều phối dẫn thảo luận.' },
  { id: 'q3', question: 'Nghiên cứu định tính (focus group, phỏng vấn sâu) phù hợp nhất để làm gì?', options: ['Suy rộng số liệu ra toàn thị trường', 'Khám phá "vì sao" & tạo giả thuyết', 'Kiểm định giả thuyết bằng thống kê', 'Thay hoàn toàn cho khảo sát định lượng'], correctIndex: 1, explanation: 'Mẫu nhỏ, không đại diện thống kê — dùng để khám phá và hình thành giả thuyết, không để suy rộng.' },
]);

const c4 = doc('mkt301-4-1-quantitative-surveys', '4.1 — Quantitative research & surveys|||4.1 — Nghiên cứu định lượng & khảo sát',
  'Đặc điểm nghiên cứu định lượng; phương pháp khảo sát (mặt đối mặt, điện thoại, online); ưu nhược điểm mỗi phương pháp.',
  [[
    `<span class="eyebrow">MKT301 · Chapter 4 · Lesson 4.1</span>
<h2>Quantitative research &amp; surveys</h2>
<h3>Quantitative vs. qualitative</h3>
<p><strong>Quantitative research</strong> uses structured questions on large, representative samples to produce numbers that can be statistically analyzed and generalized to the population — the opposite of qualitative's small, unstructured exploration. The survey is its most common data-collection method.</p>
<h3>Survey methods</h3>
<ul>
<li><strong>Face-to-face</strong> — highest response quality and ability to clarify/probe, but expensive and slow to field.</li>
<li><strong>Telephone</strong> — faster and cheaper than face-to-face, but shorter attention span and no visual aids.</li>
<li><strong>Mail (postal)</strong> — low cost, no interviewer bias, but slow and typically low response rate.</li>
<li><strong>Online / mobile</strong> — cheapest, fastest, easiest to scale; risk of sample bias (only reaches people online) and higher dropout.</li>
</ul>
<pre><code>Choosing a method: trade-off triangle
  Cost      <-> Speed      <-> Data quality/control
  Online is usually cheapest+fastest, face-to-face usually highest quality
</code></pre>
<div class="callout"><span class="badge">No perfect method</span> Every survey mode trades off cost, speed and data quality — the "right" method depends on the budget, timeline and the sensitivity of the topic, not on which one is newest.</div>`,
    `<span class="eyebrow">MKT301 · Chương 4 · Bài 4.1</span>
<h2>Nghiên cứu định lượng &amp; khảo sát</h2>
<h3>Định lượng vs. định tính</h3>
<p><strong>Nghiên cứu định lượng</strong> dùng câu hỏi có cấu trúc trên mẫu lớn, đại diện, để tạo ra số liệu có thể phân tích thống kê và suy rộng ra tổng thể — ngược với nghiên cứu định tính (mẫu nhỏ, không cấu trúc, mang tính khám phá). Khảo sát là phương pháp thu thập dữ liệu phổ biến nhất của nó.</p>
<h3>Các phương pháp khảo sát</h3>
<ul>
<li><strong>Mặt đối mặt</strong> — chất lượng trả lời cao nhất, có thể giải thích/hỏi thêm, nhưng đắt và chậm triển khai.</li>
<li><strong>Điện thoại</strong> — nhanh và rẻ hơn mặt đối mặt, nhưng người trả lời tập trung ngắn hơn, không dùng được hình ảnh minh họa.</li>
<li><strong>Gửi thư</strong> — chi phí thấp, không bị thiên lệch do người phỏng vấn, nhưng chậm và tỷ lệ hồi đáp thường thấp.</li>
<li><strong>Trực tuyến / di động</strong> — rẻ nhất, nhanh nhất, dễ mở rộng quy mô nhất; rủi ro thiên lệch mẫu (chỉ tiếp cận được người dùng internet) và tỷ lệ bỏ giữa chừng cao hơn.</li>
</ul>
<pre><code>Chọn phương pháp: tam giác đánh đổi
  Chi phí   <-> Tốc độ    <-> Chất lượng/kiểm soát dữ liệu
  Online thường rẻ+nhanh nhất, mặt đối mặt thường chất lượng cao nhất
</code></pre>
<div class="callout"><span class="badge">Không có phương pháp hoàn hảo</span> Mọi hình thức khảo sát đều đánh đổi giữa chi phí, tốc độ và chất lượng dữ liệu — phương pháp "đúng" phụ thuộc vào ngân sách, thời hạn và độ nhạy cảm của chủ đề, không phải phương pháp nào mới nhất.</div>`,
  ]]);

const c4q = quiz('mkt301-quiz-4', 'Quiz 4 — Quantitative & surveys|||Quiz 4 — Định lượng & khảo sát', [
  { id: 'q1', question: 'Nghiên cứu định lượng khác định tính chủ yếu ở điểm nào?', options: ['Định lượng dùng mẫu nhỏ, không cấu trúc', 'Định lượng dùng mẫu lớn, có cấu trúc, suy rộng bằng thống kê', 'Định lượng không cần mẫu', 'Hai loại giống nhau hoàn toàn'], correctIndex: 1, explanation: 'Định lượng: câu hỏi cấu trúc, mẫu lớn đại diện, kết quả suy rộng ra tổng thể bằng thống kê.' },
  { id: 'q2', question: 'Phương pháp khảo sát nào thường RẺ và NHANH nhất nhưng dễ thiên lệch mẫu?', options: ['Mặt đối mặt', 'Gửi thư', 'Trực tuyến / di động', 'Điện thoại'], correctIndex: 2, explanation: 'Online rẻ, nhanh, dễ mở rộng, nhưng chỉ tiếp cận được người dùng internet — rủi ro thiên lệch mẫu.' },
  { id: 'q3', question: 'Vì sao không có "phương pháp khảo sát hoàn hảo"?', options: ['Vì luật cấm một số phương pháp', 'Vì mỗi phương pháp đánh đổi giữa chi phí, tốc độ, chất lượng dữ liệu', 'Vì khảo sát online luôn tốt nhất', 'Vì mặt đối mặt luôn rẻ nhất'], correctIndex: 1, explanation: 'Chọn phương pháp là bài toán đánh đổi theo ngân sách, thời hạn, độ nhạy cảm chủ đề — không có lựa chọn thắng tuyệt đối.' },
]);

const c5 = doc('mkt301-5-1-questionnaire-scale-design', '5.1 — Questionnaire & scale design|||5.1 — Thiết kế bảng hỏi & thang đo',
  'Quy trình thiết kế bảng hỏi; các loại câu hỏi; thang đo (Likert, danh nghĩa, thứ bậc, khoảng, tỉ lệ); lỗi thường gặp.',
  [[
    `<span class="eyebrow">MKT301 · Chapter 5 · Lesson 5.1</span>
<h2>Questionnaire &amp; scale design</h2>
<h3>Questionnaire design process</h3>
<pre><code>1. Specify what information is needed
2. Decide question type &amp; wording
3. Decide question sequence &amp; layout
4. Pilot-test on a small sample
5. Revise and finalize
</code></pre>
<h3>Question types</h3>
<ul>
<li><strong>Open-ended</strong> — respondent answers in their own words; rich but harder to analyze at scale.</li>
<li><strong>Closed-ended</strong> — fixed set of options (multiple-choice, dichotomous, scaled); easy to code and analyze, but limits what the respondent can say.</li>
</ul>
<h3>The four levels of measurement scale</h3>
<pre><code>Nominal   -> labels only, no order          (e.g. gender, brand used)
Ordinal   -> ranked, gaps not equal         (e.g. 1st/2nd/3rd choice)
Interval  -> equal gaps, no true zero       (e.g. 5-point Likert scale)
Ratio     -> equal gaps + true zero         (e.g. money spent, age)
</code></pre>
<p>The <strong>Likert scale</strong> (typically "strongly disagree" to "strongly agree", 5 or 7 points) is the workhorse of marketing surveys — it is an interval scale, treated as such in most statistical analysis.</p>
<div class="callout"><span class="badge">Common wording traps</span> Leading questions ("don't you agree our product is great?"), double-barreled questions (asking two things at once), and jargon respondents don't understand all silently corrupt the data before analysis ever begins.</div>`,
    `<span class="eyebrow">MKT301 · Chương 5 · Bài 5.1</span>
<h2>Thiết kế bảng hỏi &amp; thang đo</h2>
<h3>Quy trình thiết kế bảng hỏi</h3>
<pre><code>1. Xác định thông tin cần thu thập
2. Quyết định loại câu hỏi &amp; cách diễn đạt
3. Quyết định thứ tự &amp; bố cục câu hỏi
4. Thử nghiệm (pilot) trên mẫu nhỏ
5. Chỉnh sửa và hoàn thiện
</code></pre>
<h3>Các loại câu hỏi</h3>
<ul>
<li><strong>Câu hỏi mở</strong> — người trả lời tự do diễn đạt bằng lời của mình; giàu thông tin nhưng khó phân tích trên quy mô lớn.</li>
<li><strong>Câu hỏi đóng</strong> — bộ lựa chọn cố định (trắc nghiệm, hai lựa chọn, thang đo); dễ mã hoá và phân tích, nhưng hạn chế điều người trả lời có thể nói.</li>
</ul>
<h3>Bốn cấp độ thang đo</h3>
<pre><code>Danh nghĩa (nominal) -> chỉ là nhãn, không có thứ tự    (vd giới tính, nhãn hiệu dùng)
Thứ bậc (ordinal)    -> có xếp hạng, khoảng cách không đều (vd chọn thứ 1/2/3)
Khoảng (interval)    -> khoảng cách đều, không có gốc 0 thật (vd thang Likert 5 điểm)
Tỉ lệ (ratio)        -> khoảng cách đều + có gốc 0 thật    (vd tiền chi, tuổi)
</code></pre>
<p><strong>Thang đo Likert</strong> (thường "hoàn toàn không đồng ý" đến "hoàn toàn đồng ý", 5 hoặc 7 mức) là công cụ chủ lực của khảo sát marketing — về bản chất là thang khoảng, và được xử lý như vậy trong hầu hết phân tích thống kê.</p>
<div class="callout"><span class="badge">Bẫy diễn đạt thường gặp</span> Câu hỏi dẫn dắt ("bạn có đồng ý sản phẩm của chúng tôi tuyệt vời không?"), câu hỏi "hai trong một" (hỏi hai điều cùng lúc), và thuật ngữ người trả lời không hiểu — tất cả đều làm hỏng dữ liệu một cách âm thầm, ngay trước khi phân tích bắt đầu.</div>`,
  ]]);

const c5q = quiz('mkt301-quiz-5', 'Quiz 5 — Questionnaire & scale|||Quiz 5 — Bảng hỏi & thang đo', [
  { id: 'q1', question: 'Thang đo nào có khoảng cách đều nhưng KHÔNG có gốc 0 thật, ví dụ thang Likert?', options: ['Danh nghĩa (nominal)', 'Thứ bậc (ordinal)', 'Khoảng (interval)', 'Tỉ lệ (ratio)'], correctIndex: 2, explanation: 'Interval có khoảng cách đều nhưng không có điểm 0 tuyệt đối — đúng đặc điểm của thang Likert.' },
  { id: 'q2', question: 'Câu hỏi "Bạn có đồng ý sản phẩm chúng tôi tuyệt vời không?" mắc lỗi gì?', options: ['Câu hỏi mở', 'Câu hỏi dẫn dắt (leading question)', 'Thang đo tỉ lệ', 'Không mắc lỗi gì'], correctIndex: 1, explanation: 'Câu hỏi gợi ý sẵn câu trả lời mong muốn — đây là lỗi câu hỏi dẫn dắt, làm sai lệch dữ liệu.' },
  { id: 'q3', question: 'Bước nào trong quy trình thiết kế bảng hỏi giúp phát hiện câu hỏi bị lỗi TRƯỚC khi khảo sát chính thức?', options: ['Xác định thông tin cần thu thập', 'Quyết định bố cục', 'Thử nghiệm (pilot-test) trên mẫu nhỏ', 'Ra quyết định'], correctIndex: 2, explanation: 'Pilot-test trên mẫu nhỏ giúp phát hiện câu hỏi khó hiểu, dẫn dắt hoặc hai-trong-một trước khi triển khai đại trà.' },
]);

const c6 = doc('mkt301-6-1-sampling-data-collection', '6.1 — Sampling & data collection|||6.1 — Chọn mẫu & thu thập dữ liệu',
  'Tổng thể & mẫu; chọn mẫu xác suất vs phi xác suất; cỡ mẫu; sai số mẫu & sai số không do mẫu; kiểm soát thực địa.',
  [[
    `<span class="eyebrow">MKT301 · Chapter 6 · Lesson 6.1</span>
<h2>Sampling &amp; data collection</h2>
<h3>Population vs. sample</h3>
<p>The <strong>population</strong> is the entire group you want to draw conclusions about; the <strong>sample</strong> is the subset you actually collect data from. Good sampling lets a few hundred people's answers stand in for millions — as long as the sample is chosen correctly.</p>
<h3>Probability vs. non-probability sampling</h3>
<pre><code>Probability sampling (every unit has a known chance of selection)
  - Simple random     - every member has an equal chance
  - Stratified         - divide into groups (e.g. by age), sample within each
  - Cluster            - randomly select whole groups (e.g. stores), survey all in them

Non-probability sampling (selection chance is unknown)
  - Convenience        - whoever is easiest to reach
  - Judgmental         - researcher picks who seems "typical"
  - Quota              - fill fixed quotas per subgroup, non-randomly within them
</code></pre>
<p>Only probability sampling lets you statistically generalize to the population with a known margin of error; non-probability sampling is faster/cheaper but the results are not formally generalizable.</p>
<h3>Two families of error</h3>
<ul>
<li><strong>Sampling error</strong> — the natural gap between a sample statistic and the true population value; shrinks as sample size grows.</li>
<li><strong>Non-sampling error</strong> — mistakes unrelated to sample size: poor questionnaire design, interviewer bias, non-response, data-entry errors. Often bigger than sampling error, and NOT fixed by collecting more responses.</li>
</ul>
<div class="callout"><span class="badge">Bigger isn't always better</span> A large biased sample is still biased — a bigger sample only reduces sampling error, never non-sampling error.</div>`,
    `<span class="eyebrow">MKT301 · Chương 6 · Bài 6.1</span>
<h2>Chọn mẫu &amp; thu thập dữ liệu</h2>
<h3>Tổng thể vs. mẫu</h3>
<p><strong>Tổng thể</strong> là toàn bộ nhóm bạn muốn rút ra kết luận; <strong>mẫu</strong> là tập con bạn thực sự thu thập dữ liệu từ đó. Chọn mẫu đúng cách cho phép câu trả lời của vài trăm người đại diện cho hàng triệu người — với điều kiện mẫu được chọn đúng.</p>
<h3>Chọn mẫu xác suất vs. phi xác suất</h3>
<pre><code>Chọn mẫu xác suất (mỗi đơn vị có xác suất được chọn ĐÃ BIẾT)
  - Ngẫu nhiên đơn giản  - mọi thành viên có cơ hội bằng nhau
  - Phân tầng            - chia nhóm (vd theo tuổi), lấy mẫu trong mỗi nhóm
  - Cụm                  - chọn ngẫu nhiên cả nhóm (vd cửa hàng), khảo sát hết trong đó

Chọn mẫu phi xác suất (xác suất được chọn KHÔNG rõ)
  - Thuận tiện    - ai dễ tiếp cận nhất
  - Theo phán đoán - nhà nghiên cứu chọn người có vẻ "tiêu biểu"
  - Định mức (quota) - đủ số lượng cố định mỗi nhóm nhỏ, không ngẫu nhiên trong nhóm
</code></pre>
<p>Chỉ chọn mẫu xác suất cho phép suy rộng ra tổng thể bằng thống kê với sai số biết trước; chọn mẫu phi xác suất nhanh/rẻ hơn nhưng kết quả không suy rộng chính thức được.</p>
<h3>Hai nhóm sai số</h3>
<ul>
<li><strong>Sai số mẫu (sampling error)</strong> — khoảng cách tự nhiên giữa số liệu mẫu và giá trị thật của tổng thể; giảm khi cỡ mẫu tăng.</li>
<li><strong>Sai số không do mẫu (non-sampling error)</strong> — lỗi không liên quan đến cỡ mẫu: bảng hỏi thiết kế kém, thiên lệch của người phỏng vấn, không phản hồi, lỗi nhập liệu. Thường LỚN HƠN sai số mẫu, và KHÔNG được khắc phục bằng cách thu thêm phản hồi.</li>
</ul>
<div class="callout"><span class="badge">Lớn hơn không luôn tốt hơn</span> Một mẫu lớn nhưng thiên lệch vẫn thiên lệch — tăng cỡ mẫu chỉ giảm sai số mẫu, không bao giờ giảm sai số không do mẫu.</div>`,
  ]]);

const c6q = quiz('mkt301-quiz-6', 'Quiz 6 — Sampling & collection|||Quiz 6 — Chọn mẫu & thu thập', [
  { id: 'q1', question: 'Chọn mẫu xác suất khác phi xác suất ở điểm nào?', options: ['Xác suất luôn rẻ hơn', 'Xác suất: mỗi đơn vị có xác suất được chọn đã biết, cho phép suy rộng thống kê', 'Phi xác suất luôn chính xác hơn', 'Hai loại không khác gì nhau'], correctIndex: 1, explanation: 'Chọn mẫu xác suất có xác suất chọn biết trước, cho phép suy rộng ra tổng thể với sai số ước lượng được.' },
  { id: 'q2', question: 'Sai số nào KHÔNG giảm được chỉ bằng cách tăng cỡ mẫu?', options: ['Sai số mẫu (sampling error)', 'Sai số không do mẫu (non-sampling error)', 'Cả hai đều giảm khi tăng mẫu', 'Không loại sai số nào giảm được'], correctIndex: 1, explanation: 'Non-sampling error đến từ thiết kế bảng hỏi kém, thiên lệch phỏng vấn viên, không phản hồi... — tăng mẫu không sửa được.' },
  { id: 'q3', question: 'Chọn mẫu "thuận tiện" (convenience sampling) thuộc loại nào?', options: ['Chọn mẫu xác suất', 'Chọn mẫu phi xác suất', 'Chọn mẫu phân tầng', 'Chọn mẫu cụm'], correctIndex: 1, explanation: 'Convenience sampling chọn ai dễ tiếp cận nhất — xác suất được chọn không biết trước, thuộc phi xác suất.' },
]);

const c7 = doc('mkt301-7-1-data-analysis-spss', '7.1 — Data analysis: descriptive stats, hypothesis tests, SPSS|||7.1 — Phân tích dữ liệu: thống kê mô tả, kiểm định, SPSS',
  'Chuẩn bị dữ liệu (mã hoá, làm sạch); thống kê mô tả (trung bình, độ lệch chuẩn, tần suất); kiểm định giả thuyết (t-test, ANOVA, chi-square) và quy trình cơ bản trong SPSS.',
  [[
    `<span class="eyebrow">MKT301 · Chapter 7 · Lesson 7.1</span>
<h2>Data analysis: descriptive stats, hypothesis tests &amp; SPSS</h2>
<h3>Prepare before you analyze</h3>
<p><strong>Editing</strong> catches incomplete/inconsistent responses; <strong>coding</strong> assigns numbers to categories (e.g. male=1, female=2) so software can process them; <strong>data cleaning</strong> checks for out-of-range values and consistency errors. Skipping this step is the single fastest way to get confidently wrong results.</p>
<h3>Descriptive statistics — summarize the sample</h3>
<pre><code>Mean   -> average value                (only meaningful for interval/ratio data)
Median -> middle value when sorted     (robust to outliers)
Mode   -> most frequent value          (works for any scale, incl. nominal)
Standard deviation -> how spread out the responses are around the mean
Frequency/percentage -> how many respondents chose each category
</code></pre>
<h3>Hypothesis testing — is a difference real or just noise?</h3>
<ul>
<li><strong>t-test</strong> — compares the means of TWO groups (e.g. do men and women rate the brand differently?).</li>
<li><strong>ANOVA</strong> — compares the means of THREE OR MORE groups at once (e.g. across four age brackets).</li>
<li><strong>Chi-square test</strong> — tests association between two categorical variables (e.g. is gender related to brand preference?).</li>
</ul>
<p>Every test produces a <strong>p-value</strong>: by common convention, p &lt; 0.05 means the observed difference is unlikely to be due to chance alone, so we treat it as statistically significant.</p>
<h3>A basic SPSS workflow</h3>
<pre><code>1. Define variables &amp; scale types in Variable View
2. Enter/import coded data into Data View
3. Analyze -> Descriptive Statistics -> Frequencies / Descriptives
4. Analyze -> Compare Means -> Independent-Samples T Test / One-Way ANOVA
5. Read the Sig. (p-value) column to decide significance
</code></pre>
<div class="callout"><span class="badge">Statistical ≠ practical significance</span> With a large enough sample, even a tiny, meaningless difference can become "statistically significant" — always ask whether the effect size is large enough to matter for the business decision.</div>`,
    `<span class="eyebrow">MKT301 · Chương 7 · Bài 7.1</span>
<h2>Phân tích dữ liệu: thống kê mô tả, kiểm định, SPSS</h2>
<h3>Chuẩn bị trước khi phân tích</h3>
<p><strong>Kiểm tra (editing)</strong> phát hiện câu trả lời thiếu/mâu thuẫn; <strong>mã hoá (coding)</strong> gán số cho các phạm trù (vd nam=1, nữ=2) để phần mềm xử lý được; <strong>làm sạch dữ liệu</strong> kiểm tra giá trị nằm ngoài khoảng hợp lý và lỗi không nhất quán. Bỏ qua bước này là cách nhanh nhất để có kết quả sai mà vẫn tự tin là đúng.</p>
<h3>Thống kê mô tả — tóm tắt mẫu dữ liệu</h3>
<pre><code>Trung bình (mean)   -> giá trị trung bình      (chỉ có ý nghĩa với dữ liệu khoảng/tỉ lệ)
Trung vị (median)   -> giá trị giữa khi sắp xếp (ít bị ảnh hưởng bởi giá trị ngoại lai)
Yếu vị (mode)       -> giá trị xuất hiện nhiều nhất (dùng được cho mọi loại thang, cả danh nghĩa)
Độ lệch chuẩn       -> mức độ phân tán của câu trả lời quanh trung bình
Tần suất/tỉ lệ %    -> bao nhiêu người trả lời chọn mỗi phạm trù
</code></pre>
<h3>Kiểm định giả thuyết — khác biệt là thật hay chỉ do nhiễu?</h3>
<ul>
<li><strong>t-test</strong> — so sánh trung bình của HAI nhóm (vd nam và nữ đánh giá thương hiệu khác nhau không?).</li>
<li><strong>ANOVA</strong> — so sánh trung bình của BA NHÓM TRỞ LÊN cùng lúc (vd theo bốn nhóm tuổi).</li>
<li><strong>Kiểm định Chi-square</strong> — kiểm tra mối liên hệ giữa hai biến định danh/phạm trù (vd giới tính có liên quan đến sở thích thương hiệu không?).</li>
</ul>
<p>Mỗi kiểm định cho ra một <strong>giá trị p (p-value)</strong>: theo quy ước phổ biến, p &lt; 0.05 nghĩa là khác biệt quan sát được khó xảy ra chỉ do ngẫu nhiên, nên ta coi là có ý nghĩa thống kê.</p>
<h3>Quy trình cơ bản trong SPSS</h3>
<pre><code>1. Khai báo biến &amp; loại thang đo trong Variable View
2. Nhập/nhập khẩu dữ liệu đã mã hoá vào Data View
3. Analyze -> Descriptive Statistics -> Frequencies / Descriptives
4. Analyze -> Compare Means -> Independent-Samples T Test / One-Way ANOVA
5. Đọc cột Sig. (giá trị p) để quyết định có ý nghĩa thống kê hay không
</code></pre>
<div class="callout"><span class="badge">Ý nghĩa thống kê ≠ ý nghĩa thực tế</span> Với mẫu đủ lớn, một khác biệt rất nhỏ, không đáng kể vẫn có thể trở nên "có ý nghĩa thống kê" — luôn hỏi thêm liệu độ lớn hiệu ứng có đủ quan trọng cho quyết định kinh doanh không.</div>`,
  ]]);

const c7q = quiz('mkt301-quiz-7', 'Quiz 7 — Analysis & SPSS|||Quiz 7 — Phân tích & SPSS', [
  { id: 'q1', question: 'Kiểm định nào dùng để so sánh trung bình của BA NHÓM trở lên cùng lúc?', options: ['t-test', 'ANOVA', 'Chi-square', 'Trung vị'], correctIndex: 1, explanation: 'ANOVA (phân tích phương sai) so sánh trung bình từ ba nhóm trở lên trong một lần kiểm định.' },
  { id: 'q2', question: 'Giá trị p < 0.05 (theo quy ước phổ biến) thường được diễn giải là gì?', options: ['Khác biệt chắc chắn không có thật', 'Khác biệt có ý nghĩa thống kê, khó do ngẫu nhiên', 'Cỡ mẫu quá nhỏ', 'Dữ liệu bị lỗi'], correctIndex: 1, explanation: 'p < 0.05 nghĩa là khác biệt quan sát được khó xảy ra chỉ do ngẫu nhiên — coi là có ý nghĩa thống kê.' },
  { id: 'q3', question: 'Vì sao "có ý nghĩa thống kê" không đồng nghĩa với "quan trọng trong thực tế"?', options: ['Vì thống kê luôn sai', 'Vì mẫu đủ lớn có thể làm một khác biệt rất nhỏ trở nên có ý nghĩa thống kê', 'Vì SPSS tính sai p-value', 'Vì ý nghĩa thống kê chỉ áp dụng cho ANOVA'], correctIndex: 1, explanation: 'Với mẫu lớn, khác biệt nhỏ vẫn có thể đạt ý nghĩa thống kê — cần xét thêm độ lớn hiệu ứng có đáng kể về kinh doanh không.' },
]);

const c8 = doc('mkt301-8-1-interpretation-reporting-ethics', '8.1 — Interpretation, reporting & research ethics|||8.1 — Diễn giải, báo cáo kết quả & đạo đức nghiên cứu',
  'Từ số liệu sang khuyến nghị hành động; cấu trúc báo cáo nghiên cứu; đạo đức nghiên cứu (đồng thuận, bảo mật, không bịa/thao túng dữ liệu).',
  [[
    `<span class="eyebrow">MKT301 · Chapter 8 · Lesson 8.1</span>
<h2>Interpretation, reporting &amp; research ethics</h2>
<h3>From numbers to recommendations</h3>
<p>Interpretation means connecting statistical results back to the <strong>original management problem</strong> — a p-value or a percentage alone is useless to a manager. The final step is always: "given this finding, what should the business DO?"</p>
<h3>Structure of a research report</h3>
<pre><code>1. Title page &amp; table of contents
2. Executive summary          -> the ONE page a busy manager will actually read
3. Introduction &amp; problem definition
4. Methodology                -> design, sample, data collection, limitations
5. Results &amp; findings         -> tables/charts, plain-language explanation
6. Conclusions &amp; recommendations
7. Appendices                 -> questionnaire, raw tables, technical detail
</code></pre>
<p>A good executive summary states the key finding and the recommended action in the first two sentences — managers should not have to read past page one to know what to do.</p>
<h3>Research ethics</h3>
<ul>
<li><strong>Informed consent</strong> — respondents must know they are part of a study and agree to participate.</li>
<li><strong>Confidentiality &amp; privacy</strong> — protect respondent identity and personal data; only use data for the stated purpose.</li>
<li><strong>Data integrity</strong> — never fabricate, alter, or selectively report data to fit a preferred conclusion — this includes not misrepresenting confidence in a finding.</li>
<li><strong>Client's rights</strong> — the client is entitled to a truthful, complete report, even when the findings are unwelcome.</li>
</ul>
<div class="callout"><span class="badge">The report is the product</span> A methodologically perfect study that is reported unclearly, or dishonestly, delivers zero value — the report is what the business decision actually depends on.</div>`,
    `<span class="eyebrow">MKT301 · Chương 8 · Bài 8.1</span>
<h2>Diễn giải, báo cáo kết quả &amp; đạo đức nghiên cứu</h2>
<h3>Từ số liệu sang khuyến nghị</h3>
<p>Diễn giải nghĩa là gắn kết quả thống kê trở lại với <strong>vấn đề quản trị ban đầu</strong> — một giá trị p hay một tỉ lệ % đứng riêng lẻ vô nghĩa với người quản lý. Câu hỏi cuối cùng luôn là: "với phát hiện này, doanh nghiệp nên LÀM GÌ?"</p>
<h3>Cấu trúc một báo cáo nghiên cứu</h3>
<pre><code>1. Trang bìa &amp; mục lục
2. Tóm tắt cho lãnh đạo (executive summary) -> trang DUY NHẤT người quản lý bận rộn sẽ đọc
3. Giới thiệu &amp; xác định vấn đề
4. Phương pháp                -> thiết kế, mẫu, cách thu thập dữ liệu, hạn chế
5. Kết quả &amp; phát hiện        -> bảng/biểu đồ, giải thích bằng ngôn ngữ dễ hiểu
6. Kết luận &amp; khuyến nghị
7. Phụ lục                    -> bảng hỏi, bảng số liệu thô, chi tiết kỹ thuật
</code></pre>
<p>Một tóm tắt cho lãnh đạo tốt nêu rõ phát hiện chính và hành động khuyến nghị ngay trong hai câu đầu — người quản lý không cần đọc quá trang đầu để biết phải làm gì.</p>
<h3>Đạo đức nghiên cứu</h3>
<ul>
<li><strong>Sự đồng thuận (informed consent)</strong> — người trả lời phải biết mình đang tham gia một nghiên cứu và đồng ý tham gia.</li>
<li><strong>Bảo mật &amp; quyền riêng tư</strong> — bảo vệ danh tính và dữ liệu cá nhân người trả lời; chỉ dùng dữ liệu cho mục đích đã nêu.</li>
<li><strong>Tính trung thực của dữ liệu</strong> — không bao giờ bịa đặt, chỉnh sửa, hoặc chọn lọc dữ liệu để khớp với kết luận mong muốn — kể cả việc không thể hiện sai mức độ tin cậy của một phát hiện.</li>
<li><strong>Quyền của khách hàng (client)</strong> — khách hàng có quyền nhận một báo cáo trung thực, đầy đủ, ngay cả khi kết quả không như mong đợi.</li>
</ul>
<div class="callout"><span class="badge">Báo cáo chính là sản phẩm</span> Một nghiên cứu hoàn hảo về phương pháp nhưng được báo cáo mơ hồ hoặc thiếu trung thực thì tạo ra giá trị bằng không — báo cáo mới là thứ quyết định kinh doanh thực sự dựa vào.</div>`,
  ]]);

const c8q = quiz('mkt301-quiz-8', 'Quiz 8 — Interpretation, reporting & ethics|||Quiz 8 — Diễn giải, báo cáo & đạo đức', [
  { id: 'q1', question: 'Phần nào trong báo cáo nghiên cứu là trang mà người quản lý bận rộn thường đọc kỹ nhất?', options: ['Phụ lục', 'Phương pháp', 'Tóm tắt cho lãnh đạo (executive summary)', 'Mục lục'], correctIndex: 2, explanation: 'Executive summary nêu phát hiện chính & khuyến nghị hành động ngay từ đầu, phù hợp người đọc bận rộn.' },
  { id: 'q2', question: 'Hành vi nào sau đây VI PHẠM đạo đức nghiên cứu?', options: ['Xin sự đồng thuận trước khi khảo sát', 'Bảo mật thông tin người trả lời', 'Chỉnh sửa/chọn lọc dữ liệu để khớp kết luận mong muốn', 'Báo cáo trung thực dù kết quả không như mong đợi'], correctIndex: 2, explanation: 'Bịa đặt hoặc chọn lọc dữ liệu để khớp kết luận mong muốn là vi phạm nghiêm trọng tính trung thực dữ liệu.' },
  { id: 'q3', question: 'Bước cuối cùng của việc diễn giải kết quả nghiên cứu là gì?', options: ['Chỉ nêu giá trị p', 'Gắn kết quả với vấn đề quản trị và đề xuất doanh nghiệp nên làm gì', 'Dừng lại ở thống kê mô tả', 'Không cần liên hệ với vấn đề ban đầu'], correctIndex: 1, explanation: 'Diễn giải phải trả lời được: dựa trên phát hiện này, doanh nghiệp nên hành động thế nào — không dừng ở số liệu thô.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'MKT301',
    slug: 'mkt301-marketing-research',
    title: 'Marketing Research',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MKT301.webp',
    shortDescription: 'The marketing research process end to end: problem definition & design, secondary data & qualitative methods, surveys, questionnaire & scale design, sampling, SPSS analysis, reporting & ethics. Bilingual, with examples & quizzes.|||Toàn bộ quy trình nghiên cứu marketing: xác định vấn đề & thiết kế, dữ liệu thứ cấp & định tính, khảo sát, bảng hỏi & thang đo, chọn mẫu, phân tích SPSS, báo cáo & đạo đức. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>MKT301 — Marketing Research</strong> (kỳ 8, khối Quản trị Kinh doanh) dạy quy trình nghiên cứu marketing đầy đủ: từ <strong>xác định vấn đề &amp; thiết kế nghiên cứu</strong> → <strong>dữ liệu thứ cấp &amp; nghiên cứu định tính</strong> (focus group, phỏng vấn) → <strong>nghiên cứu định lượng &amp; khảo sát</strong> → <strong>thiết kế bảng hỏi &amp; thang đo</strong> → <strong>chọn mẫu &amp; thu thập dữ liệu</strong> → <strong>phân tích dữ liệu</strong> (thống kê mô tả, kiểm định, SPSS) → <strong>diễn giải, báo cáo kết quả &amp; đạo đức nghiên cứu</strong>. Tham khảo Malhotra, Churchill, Kotler; song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Quy trình nghiên cứu marketing 6 bước; phân biệt vấn đề quản trị & vấn đề nghiên cứu; chọn thiết kế khám phá/mô tả/nhân quả; đánh giá dữ liệu thứ cấp; focus group & phỏng vấn sâu; phương pháp khảo sát (mặt đối mặt, điện thoại, thư, online); thiết kế bảng hỏi & tránh lỗi diễn đạt; bốn cấp thang đo & thang Likert; chọn mẫu xác suất/phi xác suất; sai số mẫu & không do mẫu; thống kê mô tả; kiểm định t-test/ANOVA/chi-square; quy trình cơ bản trong SPSS; viết báo cáo & tuân thủ đạo đức nghiên cứu.',
    requirements: 'Kiến thức marketing căn bản (Principles of Marketing). Nên có máy tính cài hoặc truy cập được IBM SPSS Statistics để thực hành phân tích dữ liệu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách tham khảo, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nghiên cứu marketing là gì, quy trình 6 bước, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & quy trình|||Chapter 1 — Overview & process', description: 'Định nghĩa, phân loại thiết kế, quy trình 6 bước.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Xác định vấn đề & thiết kế|||Chapter 2 — Problem definition & design', description: 'Vấn đề quản trị vs nghiên cứu, chọn thiết kế.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Dữ liệu thứ cấp & định tính|||Chapter 3 — Secondary data & qualitative', description: 'Dữ liệu thứ cấp, focus group, phỏng vấn sâu, quan sát.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Định lượng & khảo sát|||Chapter 4 — Quantitative research & surveys', description: 'Định lượng vs định tính, phương pháp khảo sát.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Bảng hỏi & thang đo|||Chapter 5 — Questionnaire & scale design', description: 'Quy trình thiết kế bảng hỏi, các thang đo, lỗi diễn đạt.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chọn mẫu & thu thập dữ liệu|||Chapter 6 — Sampling & data collection', description: 'Xác suất vs phi xác suất, sai số mẫu & không do mẫu.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phân tích dữ liệu & SPSS|||Chapter 7 — Data analysis & SPSS', description: 'Thống kê mô tả, t-test/ANOVA/chi-square, quy trình SPSS.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Diễn giải, báo cáo & đạo đức|||Chapter 8 — Interpretation, reporting & ethics', description: 'Từ số liệu sang khuyến nghị, cấu trúc báo cáo, đạo đức nghiên cứu.', lessons: [c8, c8q] },
  ],
};
