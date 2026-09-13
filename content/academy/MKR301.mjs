/**
 * MKR301 — Marketing Research (Nghiên cứu marketing). Khối Công nghệ Truyền
 * thông FPTU, kỳ 2. KHÔNG có FLM syllabus chi tiết → bám giáo trình chuẩn
 * quốc tế: Malhotra "Marketing Research: An Applied Orientation"; Aaker,
 * Kumar & Day "Marketing Research"; Churchill "Marketing Research:
 * Methodological Foundations". Công cụ thật: Qualtrics/Google Forms, SPSS,
 * Statista, Nielsen. Song ngữ VI+EN, khái niệm + phương pháp + ví dụ nghiên
 * cứu thật, quiz mỗi chương. Giữ NGUYÊN slug/semester/courseCode/thumb(v3).
 * ⚠️ KHÔNG backtick/${; "&"→&amp; chỉ trong HTML content; content PHẢI
 * .join('\n') ra STRING (mảng làm Prisma văng lúc seed).
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mkr301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách chuẩn (Malhotra, Aaker/Kumar/Day, Churchill), công cụ khảo sát (Qualtrics, Google Forms), phân tích (SPSS, Excel), nguồn dữ liệu (Statista, Nielsen), lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">MKR301 · Materials</span>
<h2>Materials &amp; resource hub</h2>
<p class="lead">Everything for <strong>Marketing Research</strong> in one place — turning a manager's fuzzy question into a rigorous study, running it, and reading the numbers so a decision follows. You'll cover the full pipeline: define → design → collect → sample → clean → analyse → report.</p>
<h3>📗 Core textbooks</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/marketing-research-an-applied-orientation/P200000005493" target="_blank" rel="noopener">Naresh K. Malhotra — <em>Marketing Research: An Applied Orientation</em></a> (the 6-step framework this course follows)</li>
<li>Aaker, Kumar &amp; Day — <em>Marketing Research</em> (Wiley) — strong on design &amp; analysis</li>
<li>Churchill &amp; Iacobucci — <em>Marketing Research: Methodological Foundations</em></li>
</ul>
<h3>🛠️ Survey &amp; data tools</h3>
<ul>
<li><a href="https://www.qualtrics.com/" target="_blank" rel="noopener">Qualtrics</a> &amp; <a href="https://forms.google.com/" target="_blank" rel="noopener">Google Forms</a> — build and field questionnaires</li>
<li><a href="https://www.ibm.com/products/spss-statistics" target="_blank" rel="noopener">IBM SPSS Statistics</a> &amp; Excel — cross-tabs, t-test, ANOVA, regression</li>
</ul>
<h3>🌐 Real data sources</h3>
<ul>
<li><a href="https://www.statista.com/" target="_blank" rel="noopener">Statista</a> — market &amp; consumer statistics (secondary data)</li>
<li><a href="https://www.nielsen.com/" target="_blank" rel="noopener">Nielsen</a> — audience &amp; retail measurement; <a href="https://www.pewresearch.org/" target="_blank" rel="noopener">Pew Research</a> — survey methodology</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the role of research &amp; the 6-step process; management vs research problem.</li>
<li><strong>Design</strong> — pick exploratory / descriptive / causal; choose secondary, qualitative or survey methods.</li>
<li><strong>Do it</strong> — write a questionnaire in Google Forms, sample, collect, clean &amp; code the data.</li>
<li><strong>Job-ready</strong> — analyse in SPSS/Excel (cross-tab, t-test, regression) and write a decision-ready report.</li>
</ol></div>`,
    `<span class="eyebrow">MKR301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho <strong>Nghiên cứu marketing</strong> gom về một chỗ — biến câu hỏi mơ hồ của nhà quản trị thành một nghiên cứu chặt chẽ, chạy nó, rồi đọc con số để ra quyết định. Bạn đi hết quy trình: xác định → thiết kế → thu thập → chọn mẫu → làm sạch → phân tích → báo cáo.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/marketing-research-an-applied-orientation/P200000005493" target="_blank" rel="noopener">Naresh K. Malhotra — <em>Marketing Research: An Applied Orientation</em></a> (khung 6 bước môn này bám theo)</li>
<li>Aaker, Kumar &amp; Day — <em>Marketing Research</em> (Wiley) — mạnh về thiết kế &amp; phân tích</li>
<li>Churchill &amp; Iacobucci — <em>Marketing Research: Methodological Foundations</em></li>
</ul>
<h3>🛠️ Công cụ khảo sát &amp; dữ liệu</h3>
<ul>
<li><a href="https://www.qualtrics.com/" target="_blank" rel="noopener">Qualtrics</a> &amp; <a href="https://forms.google.com/" target="_blank" rel="noopener">Google Forms</a> — dựng và phát bảng hỏi</li>
<li><a href="https://www.ibm.com/products/spss-statistics" target="_blank" rel="noopener">IBM SPSS Statistics</a> &amp; Excel — cross-tab, t-test, ANOVA, hồi quy</li>
</ul>
<h3>🌐 Nguồn dữ liệu thật</h3>
<ul>
<li><a href="https://www.statista.com/" target="_blank" rel="noopener">Statista</a> — thống kê thị trường &amp; người tiêu dùng (dữ liệu thứ cấp)</li>
<li><a href="https://www.nielsen.com/" target="_blank" rel="noopener">Nielsen</a> — đo lường khán giả &amp; bán lẻ; <a href="https://www.pewresearch.org/" target="_blank" rel="noopener">Pew Research</a> — phương pháp khảo sát</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — vai trò của nghiên cứu &amp; quy trình 6 bước; vấn đề quản trị vs vấn đề nghiên cứu.</li>
<li><strong>Thiết kế</strong> — chọn khám phá / mô tả / nhân quả; chọn phương pháp thứ cấp, định tính hay khảo sát.</li>
<li><strong>Làm thật</strong> — soạn bảng hỏi trên Google Forms, chọn mẫu, thu thập, làm sạch &amp; mã hoá dữ liệu.</li>
<li><strong>Sẵn sàng đi làm</strong> — phân tích trong SPSS/Excel (cross-tab, t-test, hồi quy) và viết báo cáo ra được quyết định.</li>
</ol></div>`,
  ]]);

const intro = doc('mkr301-0-1-overview', 'Course overview: Marketing Research|||Tổng quan: Nghiên cứu marketing',
  'Nghiên cứu marketing là gì và vì sao cần; nó giảm rủi ro quyết định bằng dữ liệu; lộ trình 8 chương: quy trình 6 bước → thiết kế → dữ liệu thứ cấp/định tính → khảo sát & thang đo → chọn mẫu → thu thập/xử lý → phân tích → báo cáo & đạo đức.',
  [[
    `<span class="eyebrow">MKR301 · Lesson 0.1 · Overview</span>
<h2>What marketing research is — and why it matters</h2>
<p class="lead"><strong>Marketing research</strong> is the systematic gathering, recording and analysis of data to help managers make better marketing decisions. Its job is simple to state and hard to do well: <strong>reduce the uncertainty</strong> of a decision by replacing guesswork with evidence.</p>
<h3>From a business question to an answer</h3>
<p>A manager asks "Why are sales falling?" or "Which of two package designs should we launch?". Research turns that into a study you can actually run — with a method, a sample, data, and an analysis that points to an answer. Done badly it wastes money; done well it is the cheapest insurance a company buys.</p>
<h3>The 8-chapter roadmap</h3>
<p>The research process &amp; role → defining the problem &amp; research design → secondary data &amp; qualitative research → quantitative surveys &amp; measurement scales → sampling → data collection &amp; processing → data analysis → reporting, ethics &amp; turning insight into decisions.</p>
<div class="callout"><span class="badge">Big idea</span> Research does not make the decision — it <em>informs</em> it. Good research shrinks the risk of a big, expensive mistake to the size of a small, cheap study.</div>`,
    `<span class="eyebrow">MKR301 · Bài 0.1 · Tổng quan</span>
<h2>Nghiên cứu marketing là gì — và vì sao quan trọng</h2>
<p class="lead"><strong>Nghiên cứu marketing</strong> là việc thu thập, ghi nhận và phân tích dữ liệu một cách có hệ thống để giúp nhà quản trị ra quyết định marketing tốt hơn. Nhiệm vụ của nó dễ nói khó làm: <strong>giảm sự bất định</strong> của quyết định bằng cách thay phỏng đoán bằng bằng chứng.</p>
<h3>Từ câu hỏi kinh doanh đến câu trả lời</h3>
<p>Nhà quản trị hỏi "Vì sao doanh số giảm?" hay "Nên tung mẫu bao bì nào trong hai mẫu?". Nghiên cứu biến câu đó thành một nghiên cứu chạy được — có phương pháp, mẫu, dữ liệu, và một phân tích chỉ tới câu trả lời. Làm dở thì phí tiền; làm tốt thì là khoản bảo hiểm rẻ nhất doanh nghiệp mua.</p>
<h3>Lộ trình 8 chương</h3>
<p>Quy trình &amp; vai trò nghiên cứu → xác định vấn đề &amp; thiết kế nghiên cứu → dữ liệu thứ cấp &amp; nghiên cứu định tính → khảo sát định lượng &amp; thang đo → chọn mẫu → thu thập &amp; xử lý dữ liệu → phân tích dữ liệu → báo cáo, đạo đức &amp; biến insight thành quyết định.</p>
<div class="callout"><span class="badge">Ý lớn</span> Nghiên cứu không ra quyết định thay bạn — nó <em>soi sáng</em> quyết định. Nghiên cứu tốt thu nhỏ rủi ro của một sai lầm lớn, đắt tiền xuống bằng một nghiên cứu nhỏ, rẻ.</div>`,
  ]]);

const c1 = doc('mkr301-1-1-process-role', '1.1 — The marketing research process|||1.1 — Quy trình nghiên cứu marketing',
  'Vai trò của nghiên cứu marketing, quy trình 6 bước (Malhotra), và phân biệt hệ thống thông tin marketing (MIS) với dự án nghiên cứu (MR).',
  [[
    `<span class="eyebrow">MKR301 · Chapter 1 · Lesson 1.1</span>
<h2>The marketing research process</h2>
<h3>The 6-step process (Malhotra)</h3>
<ol>
<li><strong>Define the problem</strong> — the management problem &amp; the research problem.</li>
<li><strong>Develop the approach</strong> — theory, models, research questions, hypotheses.</li>
<li><strong>Formulate the research design</strong> — exploratory / descriptive / causal.</li>
<li><strong>Collect the data</strong> — fieldwork (survey, interview, experiment).</li>
<li><strong>Prepare &amp; analyse the data</strong> — clean, code, run statistics.</li>
<li><strong>Report &amp; act</strong> — present findings so a decision follows.</li>
</ol>
<h3>MIS vs MR — a system vs a project</h3>
<pre><code>MIS (Marketing Information System)
   - CONTINUOUS: dashboards, sales &amp; CRM data, always on
MR  (Marketing Research project)
   - A ONE-OFF study for a SPECIFIC decision, with a start &amp; end
</code></pre>
<p>An MIS answers "what is happening now?" every day; a research project answers "why?" or "which?" for one decision, then ends.</p>
<div class="callout"><span class="badge">Real study</span> When Netflix tests a new sign-up flow it runs a controlled experiment (an MR project) — separate from the always-on MIS dashboards that track daily churn.</div>`,
    `<span class="eyebrow">MKR301 · Chương 1 · Bài 1.1</span>
<h2>Quy trình nghiên cứu marketing</h2>
<h3>Quy trình 6 bước (Malhotra)</h3>
<ol>
<li><strong>Xác định vấn đề</strong> — vấn đề quản trị &amp; vấn đề nghiên cứu.</li>
<li><strong>Xây cách tiếp cận</strong> — lý thuyết, mô hình, câu hỏi nghiên cứu, giả thuyết.</li>
<li><strong>Lập thiết kế nghiên cứu</strong> — khám phá / mô tả / nhân quả.</li>
<li><strong>Thu thập dữ liệu</strong> — thực địa (khảo sát, phỏng vấn, thí nghiệm).</li>
<li><strong>Chuẩn bị &amp; phân tích dữ liệu</strong> — làm sạch, mã hoá, chạy thống kê.</li>
<li><strong>Báo cáo &amp; hành động</strong> — trình bày kết quả để ra được quyết định.</li>
</ol>
<h3>MIS vs MR — một hệ thống vs một dự án</h3>
<pre><code>MIS (Hệ thống thông tin marketing)
   - LIÊN TỤC: dashboard, dữ liệu bán hàng &amp; CRM, luôn chạy
MR  (Dự án nghiên cứu marketing)
   - Nghiên cứu MỘT LẦN cho MỘT quyết định cụ thể, có đầu &amp; cuối
</code></pre>
<p>MIS trả lời "đang xảy ra chuyện gì?" mỗi ngày; dự án nghiên cứu trả lời "vì sao?" hay "cái nào?" cho một quyết định rồi kết thúc.</p>
<div class="callout"><span class="badge">Nghiên cứu thật</span> Khi Netflix thử một luồng đăng ký mới, họ chạy một thí nghiệm có kiểm soát (một dự án MR) — tách khỏi các dashboard MIS luôn bật theo dõi churn hằng ngày.</div>`,
  ]]);

const c1q = quiz('mkr301-quiz-1', 'Quiz 1 — Process & role|||Quiz 1 — Quy trình & vai trò', [
  { id: 'q1', question: 'Bước ĐẦU TIÊN trong quy trình nghiên cứu marketing 6 bước là?', options: ['Thu thập dữ liệu', 'Xác định vấn đề', 'Phân tích dữ liệu', 'Viết báo cáo'], correctIndex: 1, explanation: 'Quy trình bắt đầu bằng xác định vấn đề (quản trị & nghiên cứu) — sai bước này thì cả nghiên cứu lệch.' },
  { id: 'q2', question: 'Điểm khác cốt lõi giữa MIS và một dự án nghiên cứu marketing (MR)?', options: ['MIS đắt hơn MR', 'MIS chạy LIÊN TỤC cho nhiều quyết định; MR là nghiên cứu MỘT LẦN cho một quyết định cụ thể', 'MR không dùng dữ liệu', 'MIS chỉ dùng dữ liệu định tính'], correctIndex: 1, explanation: 'MIS là hệ thống thông tin luôn bật; MR là dự án có đầu-cuối phục vụ một quyết định.' },
  { id: 'q3', question: 'Vai trò chính của nghiên cứu marketing là?', options: ['Ra quyết định thay nhà quản trị', 'Giảm sự bất định của quyết định bằng dữ liệu/bằng chứng', 'Tăng doanh số ngay lập tức', 'Thay thế bộ phận bán hàng'], correctIndex: 1, explanation: 'Nghiên cứu soi sáng quyết định — giảm rủi ro bằng bằng chứng, không quyết định thay.' },
]);

const c2 = doc('mkr301-2-1-problem-design', '2.1 — Problem definition & research design|||2.1 — Xác định vấn đề & thiết kế nghiên cứu',
  'Phân biệt vấn đề quản trị (management problem) với vấn đề nghiên cứu (research problem); ba loại thiết kế: khám phá (exploratory), mô tả (descriptive), nhân quả (causal).',
  [[
    `<span class="eyebrow">MKR301 · Chapter 2 · Lesson 2.1</span>
<h2>Problem definition &amp; research design</h2>
<h3>Management problem vs research problem</h3>
<pre><code>MANAGEMENT PROBLEM (decision-oriented, "what to DO")
   -> "Should we launch the new flavour?"
RESEARCH PROBLEM (information-oriented, "what to KNOW")
   -> "How do 18-25s rate the new flavour vs the current one?"
</code></pre>
<p>The manager owns the decision; the researcher translates it into a precise information need. Getting this translation wrong is the most common — and most expensive — mistake in the whole field.</p>
<h3>Three research designs</h3>
<ul>
<li><strong>Exploratory</strong> — when the problem is vague; goal is <em>insight &amp; ideas</em> (interviews, focus groups, secondary data). Flexible, qualitative.</li>
<li><strong>Descriptive</strong> — describe a market or segment; <em>who / what / how many</em> (surveys, panels). Structured, planned.</li>
<li><strong>Causal</strong> — test cause and effect; <em>does X cause Y?</em> (experiments, A/B tests). Controls variables.</li>
</ul>
<div class="callout"><span class="badge">Real study</span> A brand unsure why loyalty dropped runs exploratory focus groups (find hypotheses), then a descriptive survey (measure how widespread), then a causal price experiment (test the fix) — designs stacked in sequence.</div>`,
    `<span class="eyebrow">MKR301 · Chương 2 · Bài 2.1</span>
<h2>Xác định vấn đề &amp; thiết kế nghiên cứu</h2>
<h3>Vấn đề quản trị vs vấn đề nghiên cứu</h3>
<pre><code>VẤN ĐỀ QUẢN TRỊ (hướng quyết định, "làm GÌ")
   -> "Có nên tung vị mới không?"
VẤN ĐỀ NGHIÊN CỨU (hướng thông tin, "cần BIẾT gì")
   -> "Nhóm 18-25 chấm vị mới so với vị hiện tại thế nào?"
</code></pre>
<p>Nhà quản trị sở hữu quyết định; người nghiên cứu dịch nó thành nhu cầu thông tin chính xác. Dịch sai bước này là lỗi phổ biến nhất — và đắt nhất — của cả ngành.</p>
<h3>Ba loại thiết kế nghiên cứu</h3>
<ul>
<li><strong>Khám phá (exploratory)</strong> — khi vấn đề còn mơ hồ; mục tiêu là <em>hiểu &amp; ý tưởng</em> (phỏng vấn, nhóm tập trung, dữ liệu thứ cấp). Linh hoạt, định tính.</li>
<li><strong>Mô tả (descriptive)</strong> — mô tả một thị trường/phân khúc; <em>ai / cái gì / bao nhiêu</em> (khảo sát, panel). Có cấu trúc, hoạch định trước.</li>
<li><strong>Nhân quả (causal)</strong> — kiểm định nhân-quả; <em>X có gây ra Y?</em> (thí nghiệm, A/B test). Kiểm soát biến.</li>
</ul>
<div class="callout"><span class="badge">Nghiên cứu thật</span> Một thương hiệu chưa rõ vì sao lòng trung thành giảm: chạy nhóm tập trung khám phá (tìm giả thuyết), rồi khảo sát mô tả (đo mức phổ biến), rồi thí nghiệm giá nhân quả (kiểm thử cách sửa) — các thiết kế xếp tuần tự.</div>`,
  ]]);

const c2q = quiz('mkr301-quiz-2', 'Quiz 2 — Problem & design|||Quiz 2 — Vấn đề & thiết kế', [
  { id: 'q1', question: '"Có nên tung sản phẩm mới không?" là ví dụ của?', options: ['Vấn đề nghiên cứu (research problem)', 'Vấn đề quản trị (management problem)', 'Giả thuyết thống kê', 'Thang đo Likert'], correctIndex: 1, explanation: 'Đây là câu hỏi hướng QUYẾT ĐỊNH (làm gì) — vấn đề quản trị; người nghiên cứu dịch nó thành vấn đề nghiên cứu.' },
  { id: 'q2', question: 'Thiết kế nào phù hợp nhất khi vấn đề còn MƠ HỒ, cần tìm ý tưởng & giả thuyết?', options: ['Nhân quả (causal)', 'Mô tả (descriptive)', 'Khám phá (exploratory)', 'Thực nghiệm ngẫu nhiên'], correctIndex: 2, explanation: 'Nghiên cứu khám phá (phỏng vấn, FGD, dữ liệu thứ cấp) dùng khi chưa rõ vấn đề, mục tiêu là hiểu & sinh giả thuyết.' },
  { id: 'q3', question: 'Muốn kiểm định "giảm giá 10% có LÀM TĂNG doanh số không", nên dùng thiết kế?', options: ['Khám phá', 'Mô tả', 'Nhân quả (thí nghiệm/A/B test)', 'Phỏng vấn sâu'], correctIndex: 2, explanation: 'Câu hỏi nhân-quả (X gây ra Y?) cần thiết kế nhân quả — thí nghiệm có kiểm soát hoặc A/B test.' },
]);

const c3 = doc('mkr301-3-1-secondary-qualitative', '3.1 — Secondary data & qualitative research|||3.1 — Dữ liệu thứ cấp & nghiên cứu định tính',
  'Dữ liệu thứ cấp (secondary) vs sơ cấp (primary); các phương pháp định tính: nhóm tập trung (FGD), phỏng vấn sâu (in-depth interview), quan sát (observation).',
  [[
    `<span class="eyebrow">MKR301 · Chapter 3 · Lesson 3.1</span>
<h2>Secondary data &amp; qualitative research</h2>
<h3>Secondary vs primary data</h3>
<p><strong>Secondary data</strong> already exists — collected by someone else for another purpose (Statista, Nielsen, government reports, company records). It is <em>fast and cheap</em>, so you always start here. <strong>Primary data</strong> is collected fresh, by you, for this problem — slower and dearer, used when secondary data cannot answer the question.</p>
<h3>Three qualitative methods</h3>
<ul>
<li><strong>Focus group (FGD)</strong> — 6-10 people, a moderator, group dynamics surface attitudes and language. Great for reactions to concepts/ads.</li>
<li><strong>In-depth interview</strong> — one-on-one, probes deep on sensitive or complex topics without group pressure.</li>
<li><strong>Observation</strong> — watch real behaviour (in-store, ethnography) instead of asking; captures what people <em>do</em>, not what they <em>say</em>.</li>
</ul>
<pre><code>Qualitative = WHY &amp; how (rich, small n, not projectable)
Quantitative = WHAT &amp; how many (numbers, large n, projectable)
</code></pre>
<div class="callout"><span class="badge">Real study</span> Before a redesign, a supermarket runs in-store observation and finds shoppers ignore a promo end-cap — a "why" no survey number revealed, then confirmed at scale by a follow-up quantitative study.</div>`,
    `<span class="eyebrow">MKR301 · Chương 3 · Bài 3.1</span>
<h2>Dữ liệu thứ cấp &amp; nghiên cứu định tính</h2>
<h3>Dữ liệu thứ cấp vs sơ cấp</h3>
<p><strong>Dữ liệu thứ cấp (secondary)</strong> đã có sẵn — do người khác thu cho mục đích khác (Statista, Nielsen, báo cáo nhà nước, hồ sơ công ty). Nó <em>nhanh và rẻ</em>, nên luôn bắt đầu từ đây. <strong>Dữ liệu sơ cấp (primary)</strong> do chính bạn thu mới cho vấn đề này — chậm và đắt hơn, dùng khi dữ liệu thứ cấp không trả lời được.</p>
<h3>Ba phương pháp định tính</h3>
<ul>
<li><strong>Nhóm tập trung (FGD)</strong> — 6-10 người, một điều phối viên, động lực nhóm làm lộ thái độ và ngôn ngữ. Hợp để đo phản ứng với concept/quảng cáo.</li>
<li><strong>Phỏng vấn sâu (in-depth interview)</strong> — một-một, đào sâu chủ đề nhạy cảm hoặc phức tạp mà không bị áp lực nhóm.</li>
<li><strong>Quan sát (observation)</strong> — nhìn hành vi thật (tại cửa hàng, dân tộc học) thay vì hỏi; ghi lại điều người ta <em>làm</em>, không phải điều họ <em>nói</em>.</li>
</ul>
<pre><code>Định tính  = VÌ SAO &amp; như thế nào (giàu, n nhỏ, không suy rộng)
Định lượng = CÁI GÌ &amp; bao nhiêu   (con số, n lớn, suy rộng được)
</code></pre>
<div class="callout"><span class="badge">Nghiên cứu thật</span> Trước khi thiết kế lại, một siêu thị quan sát tại quầy và phát hiện khách phớt lờ một quầy khuyến mãi đầu kệ — một "vì sao" mà không con số khảo sát nào lộ ra, rồi được xác nhận ở quy mô bằng một nghiên cứu định lượng tiếp theo.</div>`,
  ]]);

const c3q = quiz('mkr301-quiz-3', 'Quiz 3 — Secondary & qualitative|||Quiz 3 — Thứ cấp & định tính', [
  { id: 'q1', question: 'Dữ liệu từ báo cáo Statista/Nielsen (thu cho mục đích khác) thuộc loại?', options: ['Dữ liệu sơ cấp (primary)', 'Dữ liệu thứ cấp (secondary)', 'Dữ liệu thí nghiệm', 'Dữ liệu định tính'], correctIndex: 1, explanation: 'Dữ liệu thứ cấp đã tồn tại sẵn do người khác thu — nhanh, rẻ, nên khảo sát bắt đầu từ đây.' },
  { id: 'q2', question: 'Phương pháp định tính nào ghi lại điều người ta LÀM thay vì điều họ NÓI?', options: ['Phỏng vấn sâu', 'Khảo sát bảng hỏi', 'Quan sát (observation)', 'Nhóm tập trung'], correctIndex: 2, explanation: 'Quan sát ghi lại hành vi thực tế; khắc phục khoảng cách giữa điều người ta nói và điều họ thực sự làm.' },
  { id: 'q3', question: 'Đặc điểm nào ĐÚNG về nghiên cứu định tính?', options: ['Cỡ mẫu lớn, suy rộng ra tổng thể được', 'Cho biết "bao nhiêu %" một cách chính xác', 'Đào sâu "vì sao & như thế nào", cỡ mẫu nhỏ, không suy rộng', 'Luôn dùng SPSS để phân tích'], correctIndex: 2, explanation: 'Định tính giàu chiều sâu (vì sao/như thế nào), n nhỏ, không đại diện tổng thể — khác định lượng suy rộng được.' },
]);

const c4 = doc('mkr301-4-1-survey-scales', '4.1 — Quantitative surveys & measurement scales|||4.1 — Khảo sát định lượng & thang đo',
  'Các phương thức khảo sát (online/điện thoại/trực tiếp/thư); bốn cấp thang đo (nominal, ordinal, interval, ratio) & thang Likert; nguyên tắc thiết kế bảng hỏi.',
  [[
    `<span class="eyebrow">MKR301 · Chapter 4 · Lesson 4.1</span>
<h2>Quantitative surveys &amp; measurement scales</h2>
<h3>Survey methods</h3>
<ul>
<li><strong>Online</strong> (Qualtrics, Google Forms) — cheap, fast, wide reach; risk of self-selection bias.</li>
<li><strong>Telephone / in-person / mail</strong> — higher cost or slower, but reach groups that are hard to get online.</li>
</ul>
<h3>The four levels of measurement</h3>
<pre><code>NOMINAL  - labels, no order      (gender, city)      -> mode
ORDINAL  - ranked, gaps unequal  (satisfaction rank) -> median
INTERVAL - equal gaps, no true 0 (Likert, temp °C)   -> mean, SD
RATIO    - equal gaps + true 0   (age, income, sales) -> all stats
</code></pre>
<p>The scale decides which statistic is valid — you can average an interval scale but not a nominal one. The <strong>Likert scale</strong> (e.g. 1 = strongly disagree … 5 = strongly agree) is the workhorse for measuring attitudes and is treated as interval.</p>
<h3>Questionnaire design rules</h3>
<p>One idea per question; avoid <strong>leading</strong> ("Don't you agree our great service…?"), <strong>double-barrelled</strong> ("Is the food tasty and cheap?") and loaded wording; put easy questions first, sensitive ones last; always pilot-test.</p>
<div class="callout"><span class="badge">Real study</span> Airbnb measures stay satisfaction on a 5-star (ordinal→treated interval) scale plus open text; the number ranks hosts, the text explains why — quant and qual in one form.</div>`,
    `<span class="eyebrow">MKR301 · Chương 4 · Bài 4.1</span>
<h2>Khảo sát định lượng &amp; thang đo</h2>
<h3>Các phương thức khảo sát</h3>
<ul>
<li><strong>Trực tuyến</strong> (Qualtrics, Google Forms) — rẻ, nhanh, phủ rộng; rủi ro thiên lệch tự chọn mẫu.</li>
<li><strong>Điện thoại / trực tiếp / thư</strong> — tốn kém hơn hoặc chậm hơn, nhưng chạm được nhóm khó lấy online.</li>
</ul>
<h3>Bốn cấp đo lường</h3>
<pre><code>NOMINAL (định danh) - nhãn, không thứ tự (giới tính, thành phố) -> mode
ORDINAL (thứ bậc)   - có xếp hạng, khoảng không đều (hạng hài lòng) -> trung vị
INTERVAL (khoảng)   - khoảng đều, không có 0 thật (Likert, °C) -> trung bình, SD
RATIO (tỉ lệ)       - khoảng đều + 0 thật (tuổi, thu nhập, doanh số) -> mọi thống kê
</code></pre>
<p>Cấp thang quyết định thống kê nào hợp lệ — bạn tính trung bình được thang interval nhưng không tính được thang nominal. <strong>Thang Likert</strong> (vd 1 = rất không đồng ý … 5 = rất đồng ý) là chủ lực để đo thái độ và được coi như interval.</p>
<h3>Nguyên tắc thiết kế bảng hỏi</h3>
<p>Mỗi câu một ý; tránh câu <strong>dẫn dắt</strong> ("Bạn không đồng ý dịch vụ tuyệt vời của chúng tôi sao?"), câu <strong>hai nòng</strong> ("Món ăn có ngon và rẻ không?") và từ ngữ tải cảm xúc; đặt câu dễ trước, câu nhạy cảm sau; luôn thử nghiệm mồi (pilot-test).</p>
<div class="callout"><span class="badge">Nghiên cứu thật</span> Airbnb đo mức hài lòng bằng thang 5 sao (ordinal→coi như interval) kèm ô chữ mở; con số xếp hạng chủ nhà, chữ giải thích vì sao — định lượng và định tính trong một biểu mẫu.</div>`,
  ]]);

const c4q = quiz('mkr301-quiz-4', 'Quiz 4 — Surveys & scales|||Quiz 4 — Khảo sát & thang đo', [
  { id: 'q1', question: 'Thang Likert "1 = rất không đồng ý … 5 = rất đồng ý" thường được coi là cấp đo?', options: ['Nominal (định danh)', 'Interval (khoảng)', 'Ratio (tỉ lệ) có 0 thật', 'Không phải thang đo'], correctIndex: 1, explanation: 'Likert được xử lý như thang interval — khoảng giữa các mức coi như đều, cho phép tính trung bình & độ lệch chuẩn.' },
  { id: 'q2', question: 'Biến "giới tính" (nam/nữ/khác) là cấp đo nào?', options: ['Nominal — chỉ là nhãn, không thứ tự', 'Ordinal — có xếp hạng', 'Interval', 'Ratio'], correctIndex: 0, explanation: 'Giới tính chỉ là nhãn phân loại không có thứ tự → thang nominal; thống kê hợp lệ là mode/tần suất, không tính trung bình.' },
  { id: 'q3', question: 'Câu "Món ăn có ngon và rẻ không?" mắc lỗi thiết kế bảng hỏi nào?', options: ['Câu dẫn dắt (leading)', 'Câu hai nòng (double-barrelled) — hỏi hai điều trong một câu', 'Thang đo sai', 'Cỡ mẫu nhỏ'], correctIndex: 1, explanation: 'Hỏi "ngon" VÀ "rẻ" cùng lúc là câu hai nòng — người trả lời không biết đang trả lời điều nào; tách thành hai câu.' },
]);

const c5 = doc('mkr301-5-1-sampling', '5.1 — Sampling|||5.1 — Chọn mẫu',
  'Tổng thể vs mẫu; chọn mẫu xác suất (probability) vs phi xác suất (non-probability); cỡ mẫu; sai số chọn mẫu (sampling error) và ngoài chọn mẫu (non-sampling error).',
  [[
    `<span class="eyebrow">MKR301 · Chapter 5 · Lesson 5.1</span>
<h2>Sampling</h2>
<h3>Why we sample</h3>
<p>You rarely study a whole <strong>population</strong> — it is too costly. You study a <strong>sample</strong> and infer back. The whole game is: does the sample <em>represent</em> the population?</p>
<h3>Probability vs non-probability</h3>
<ul>
<li><strong>Probability</strong> — every member has a known, non-zero chance of selection; results are projectable with a measurable error. Types: simple random, systematic, stratified, cluster.</li>
<li><strong>Non-probability</strong> — selection by convenience/judgement/quota/snowball; cheap and fast but <em>not</em> statistically projectable.</li>
</ul>
<pre><code>Bigger sample  -> smaller sampling error (more precise)
                  but higher cost &amp; diminishing returns
Margin of error shrinks with sqrt(n): 4x the sample
                  -> only half the error
</code></pre>
<h3>Two kinds of error</h3>
<p><strong>Sampling error</strong> comes from studying a sample not the whole population (shrinks as n grows). <strong>Non-sampling error</strong> (bad questions, non-response, data entry) does <em>not</em> shrink with n — a huge biased sample is still biased.</p>
<div class="callout"><span class="badge">Real study</span> The 1936 <em>Literary Digest</em> poll had 2.4 million responses but a biased (non-probability) frame and wrongly predicted the US election — proof that size cannot fix bias.</div>`,
    `<span class="eyebrow">MKR301 · Chương 5 · Bài 5.1</span>
<h2>Chọn mẫu</h2>
<h3>Vì sao phải chọn mẫu</h3>
<p>Hiếm khi nghiên cứu cả <strong>tổng thể</strong> — quá tốn kém. Ta nghiên cứu một <strong>mẫu</strong> rồi suy ngược. Cả cuộc chơi nằm ở: mẫu có <em>đại diện</em> cho tổng thể không?</p>
<h3>Xác suất vs phi xác suất</h3>
<ul>
<li><strong>Xác suất (probability)</strong> — mỗi phần tử có xác suất được chọn đã biết, khác 0; kết quả suy rộng được với sai số đo được. Loại: ngẫu nhiên đơn, hệ thống, phân tầng, cụm.</li>
<li><strong>Phi xác suất (non-probability)</strong> — chọn theo thuận tiện/phán đoán/hạn ngạch/quả cầu tuyết; rẻ và nhanh nhưng <em>không</em> suy rộng thống kê được.</li>
</ul>
<pre><code>Mẫu lớn hơn -> sai số chọn mẫu nhỏ hơn (chính xác hơn)
               nhưng tốn hơn &amp; lợi ích giảm dần
Biên sai số co theo sqrt(n): mẫu gấp 4 lần
               -> sai số chỉ còn một nửa
</code></pre>
<h3>Hai loại sai số</h3>
<p><strong>Sai số chọn mẫu</strong> đến từ việc nghiên cứu mẫu chứ không phải cả tổng thể (co lại khi n tăng). <strong>Sai số ngoài chọn mẫu</strong> (câu hỏi tồi, không phản hồi, nhập liệu) <em>không</em> co theo n — một mẫu khổng lồ nhưng thiên lệch vẫn cứ thiên lệch.</p>
<div class="callout"><span class="badge">Nghiên cứu thật</span> Thăm dò của <em>Literary Digest</em> năm 1936 có 2,4 triệu phản hồi nhưng khung chọn (phi xác suất) thiên lệch nên dự đoán SAI cuộc bầu cử Mỹ — bằng chứng rằng cỡ mẫu không sửa được thiên lệch.</div>`,
  ]]);

const c5q = quiz('mkr301-quiz-5', 'Quiz 5 — Sampling|||Quiz 5 — Chọn mẫu', [
  { id: 'q1', question: 'Đặc điểm ĐỊNH NGHĨA của chọn mẫu XÁC SUẤT là?', options: ['Chọn ai tiện nhất', 'Mỗi phần tử có xác suất được chọn đã biết và khác 0', 'Luôn dùng cỡ mẫu lớn', 'Chỉ khảo sát online'], correctIndex: 1, explanation: 'Chọn mẫu xác suất: mọi phần tử có cơ hội được chọn xác định, khác 0 → kết quả suy rộng được với sai số đo được.' },
  { id: 'q2', question: 'Loại sai số nào KHÔNG giảm khi tăng cỡ mẫu?', options: ['Sai số chọn mẫu (sampling error)', 'Sai số ngoài chọn mẫu (non-sampling: thiên lệch, không phản hồi, nhập liệu)', 'Cả hai đều giảm', 'Không loại nào'], correctIndex: 1, explanation: 'Sai số ngoài chọn mẫu (thiên lệch, câu hỏi tồi...) không co theo n — mẫu lớn mà thiên lệch vẫn thiên lệch.' },
  { id: 'q3', question: 'Mẫu thuận tiện (convenience) — hỏi người qua đường gần trường — thuộc loại và có nhược điểm gì?', options: ['Xác suất; suy rộng chính xác', 'Phi xác suất; rẻ nhanh nhưng không suy rộng thống kê được', 'Phân tầng; luôn đại diện', 'Cụm; không có sai số'], correctIndex: 1, explanation: 'Mẫu thuận tiện là phi xác suất — nhanh, rẻ nhưng không đại diện tổng thể, không suy rộng thống kê được.' },
]);

const c6 = doc('mkr301-6-1-collection-processing', '6.1 — Data collection & processing|||6.1 — Thu thập & xử lý dữ liệu',
  'Thực địa (fieldwork) & kiểm soát chất lượng phỏng vấn viên; làm sạch dữ liệu (data cleaning): giá trị thiếu, ngoại lai, không nhất quán; mã hoá (coding) câu mở.',
  [[
    `<span class="eyebrow">MKR301 · Chapter 6 · Lesson 6.1</span>
<h2>Data collection &amp; processing</h2>
<h3>Fieldwork</h3>
<p><strong>Fieldwork</strong> is the act of collecting the data — interviewers on the street, an online form going live, a phone bank calling. Its enemy is error: interviewer bias, cheating ("curbstoning" = faking responses), and non-response. Control it with training, supervision, and back-checks/validation of a sample of responses.</p>
<h3>Data cleaning</h3>
<p>Raw data is never analysis-ready. Cleaning fixes:</p>
<ul>
<li><strong>Missing values</strong> — blanks; decide to drop, ignore or impute.</li>
<li><strong>Outliers</strong> — an income of "999,999,999"; check if real or a typo.</li>
<li><strong>Inconsistencies</strong> — a respondent aged 12 who is "married with 3 kids"; logic checks catch it.</li>
</ul>
<h3>Coding</h3>
<pre><code>Closed question: already numeric (1=Male, 2=Female)
Open question:  "It was too expensive" -> code 3 = PRICE
                "Staff were rude"       -> code 5 = SERVICE
(group free text into categories -> countable data)
</code></pre>
<div class="callout"><span class="badge">Real study</span> A telco survey found 8% of records had impossible ages after fieldwork; cleaning &amp; validation removed them before analysis — skip this and every later statistic inherits the dirt.</div>`,
    `<span class="eyebrow">MKR301 · Chương 6 · Bài 6.1</span>
<h2>Thu thập &amp; xử lý dữ liệu</h2>
<h3>Thực địa (fieldwork)</h3>
<p><strong>Thực địa</strong> là hành động thu dữ liệu — phỏng vấn viên ngoài đường, một biểu mẫu online lên sóng, tổng đài gọi điện. Kẻ thù của nó là sai sót: thiên lệch phỏng vấn viên, gian lận ("curbstoning" = bịa câu trả lời), và không phản hồi. Kiểm soát bằng huấn luyện, giám sát, và kiểm tra lại/xác thực một phần mẫu phản hồi.</p>
<h3>Làm sạch dữ liệu</h3>
<p>Dữ liệu thô không bao giờ sẵn sàng để phân tích. Làm sạch sửa:</p>
<ul>
<li><strong>Giá trị thiếu</strong> — ô trống; quyết định bỏ, phớt lờ hay điền thay (impute).</li>
<li><strong>Ngoại lai (outlier)</strong> — thu nhập "999.999.999"; kiểm xem thật hay gõ nhầm.</li>
<li><strong>Không nhất quán</strong> — người 12 tuổi mà "đã kết hôn, 3 con"; kiểm tra logic bắt được.</li>
</ul>
<h3>Mã hoá (coding)</h3>
<pre><code>Câu đóng: đã là số sẵn (1=Nam, 2=Nữ)
Câu mở:   "Nó quá đắt"     -> mã 3 = GIÁ
          "Nhân viên thô lỗ" -> mã 5 = DỊCH VỤ
(gom chữ tự do thành nhóm -> dữ liệu đếm được)
</code></pre>
<div class="callout"><span class="badge">Nghiên cứu thật</span> Một khảo sát viễn thông phát hiện 8% bản ghi có tuổi bất khả thi sau thực địa; làm sạch &amp; xác thực loại chúng trước khi phân tích — bỏ qua bước này thì mọi thống kê sau đều thừa hưởng cái bẩn.</div>`,
  ]]);

const c6q = quiz('mkr301-quiz-6', 'Quiz 6 — Collection & processing|||Quiz 6 — Thu thập & xử lý', [
  { id: 'q1', question: '"Curbstoning" trong thực địa nghĩa là?', options: ['Làm sạch dữ liệu', 'Phỏng vấn viên BỊA câu trả lời thay vì phỏng vấn thật', 'Chọn mẫu phân tầng', 'Mã hoá câu mở'], correctIndex: 1, explanation: 'Curbstoning là gian lận: phỏng vấn viên tự điền/bịa phản hồi — kiểm soát bằng giám sát và kiểm tra lại (back-check).' },
  { id: 'q2', question: 'Mục đích của "mã hoá" (coding) câu hỏi MỞ là?', options: ['Xoá các câu trả lời xấu', 'Gom chữ tự do thành các nhóm/số để đếm & phân tích được', 'Tăng cỡ mẫu', 'Đổi thang đo sang ratio'], correctIndex: 1, explanation: 'Coding chuyển câu trả lời chữ tự do thành nhóm mã số, biến dữ liệu định tính thành dữ liệu đếm/phân tích được.' },
  { id: 'q3', question: 'Bản ghi "12 tuổi, đã kết hôn, 3 con" là lỗi dữ liệu loại nào cần làm sạch?', options: ['Giá trị thiếu (missing)', 'Không nhất quán (inconsistency) — bắt bằng kiểm tra logic', 'Ngoại lai hợp lệ', 'Không phải lỗi'], correctIndex: 1, explanation: 'Đây là mâu thuẫn logic giữa các trường — phát hiện bằng kiểm tra tính nhất quán trong bước làm sạch.' },
]);

const c7 = doc('mkr301-7-1-analysis', '7.1 — Data analysis|||7.1 — Phân tích dữ liệu',
  'Thống kê mô tả (trung bình/median/mode, phân tán); bảng chéo (cross-tabulation); tổng quan kiểm định: t-test, ANOVA, hồi quy (regression); phần mềm SPSS & Excel.',
  [[
    `<span class="eyebrow">MKR301 · Chapter 7 · Lesson 7.1</span>
<h2>Data analysis</h2>
<h3>Descriptive statistics</h3>
<p>First, <em>describe</em>: central tendency (<strong>mean, median, mode</strong>) and spread (<strong>range, variance, standard deviation</strong>). These summarise "what the data looks like" before any test.</p>
<h3>Cross-tabulation</h3>
<pre><code>          | Buys  | Doesn't |
----------|-------|---------|
Age 18-25 |  120  |   80    |
Age 26-40 |   60  |  140    |
(a cross-tab shows how ONE variable relates to another)
</code></pre>
<h3>Inferential tests (overview)</h3>
<ul>
<li><strong>t-test</strong> — compare the means of <em>two</em> groups (men vs women spend).</li>
<li><strong>ANOVA</strong> — compare means of <em>three+</em> groups (spend across 4 regions).</li>
<li><strong>Regression</strong> — model how one/more predictors drive an outcome (does ad spend &amp; price predict sales?).</li>
</ul>
<p>A <strong>p-value &lt; 0.05</strong> conventionally means the result is statistically significant (unlikely to be chance). Tools: <strong>SPSS</strong> for full stats, <strong>Excel</strong> for descriptives &amp; simple tests.</p>
<div class="callout"><span class="badge">Real study</span> A retailer regresses weekly sales on price + ad spend + weather and finds price elasticity is the strongest driver — a number that directly sets the next promotion.</div>`,
    `<span class="eyebrow">MKR301 · Chương 7 · Bài 7.1</span>
<h2>Phân tích dữ liệu</h2>
<h3>Thống kê mô tả</h3>
<p>Trước hết, <em>mô tả</em>: xu hướng trung tâm (<strong>trung bình, trung vị, mode</strong>) và độ phân tán (<strong>khoảng, phương sai, độ lệch chuẩn</strong>). Chúng tóm tắt "dữ liệu trông thế nào" trước mọi kiểm định.</p>
<h3>Bảng chéo (cross-tabulation)</h3>
<pre><code>          | Mua  | Không |
----------|------|-------|
18-25     | 120  |  80   |
26-40     |  60  | 140   |
(bảng chéo cho thấy MỘT biến liên hệ với biến khác ra sao)
</code></pre>
<h3>Kiểm định suy diễn (tổng quan)</h3>
<ul>
<li><strong>t-test</strong> — so trung bình của <em>hai</em> nhóm (nam vs nữ chi tiêu).</li>
<li><strong>ANOVA</strong> — so trung bình của <em>ba nhóm trở lên</em> (chi tiêu ở 4 vùng).</li>
<li><strong>Hồi quy (regression)</strong> — mô hình hoá việc một/nhiều biến dự báo tác động ra kết quả (chi quảng cáo &amp; giá có dự báo doanh số?).</li>
</ul>
<p><strong>p-value &lt; 0,05</strong> theo quy ước nghĩa là kết quả có ý nghĩa thống kê (khó do ngẫu nhiên). Công cụ: <strong>SPSS</strong> cho thống kê đầy đủ, <strong>Excel</strong> cho mô tả &amp; kiểm định đơn giản.</p>
<div class="callout"><span class="badge">Nghiên cứu thật</span> Một nhà bán lẻ hồi quy doanh số tuần theo giá + chi quảng cáo + thời tiết và thấy độ co giãn theo giá là yếu tố mạnh nhất — một con số ấn định trực tiếp đợt khuyến mãi kế tiếp.</div>`,
  ]]);

const c7q = quiz('mkr301-quiz-7', 'Quiz 7 — Data analysis|||Quiz 7 — Phân tích dữ liệu', [
  { id: 'q1', question: 'Muốn so sánh trung bình chi tiêu giữa BA vùng trở lên, dùng kiểm định nào?', options: ['t-test', 'ANOVA', 'Cross-tabulation', 'Mode'], correctIndex: 1, explanation: 't-test so trung bình hai nhóm; ANOVA (phân tích phương sai) so trung bình từ ba nhóm trở lên.' },
  { id: 'q2', question: 'p-value < 0,05 theo quy ước thường được hiểu là?', options: ['Kết quả chắc chắn đúng 100%', 'Kết quả có ý nghĩa thống kê — khó xảy ra do ngẫu nhiên', 'Cỡ mẫu quá nhỏ', 'Dữ liệu bị lỗi'], correctIndex: 1, explanation: 'p < 0,05 nghĩa là xác suất kết quả do ngẫu nhiên thấp → coi là có ý nghĩa thống kê (không phải bằng chứng tuyệt đối).' },
  { id: 'q3', question: 'Kỹ thuật nào mô hình hoá quan hệ để dự báo một biến kết quả từ một/nhiều biến dự báo?', options: ['Bảng chéo (cross-tab)', 'Hồi quy (regression)', 'Mode', 'Thống kê mô tả'], correctIndex: 1, explanation: 'Hồi quy ước lượng mối quan hệ giữa biến phụ thuộc và các biến dự báo (vd doanh số theo giá & chi quảng cáo).' },
]);

const c8 = doc('mkr301-8-1-report-ethics', '8.1 — Reporting, ethics & insight-to-decision|||8.1 — Báo cáo, đạo đức & từ insight tới quyết định',
  'Viết báo cáo nghiên cứu (cấu trúc, executive summary); trực quan hoá dữ liệu; đạo đức nghiên cứu (đồng thuận, riêng tư, không bịa số); biến insight thành quyết định marketing.',
  [[
    `<span class="eyebrow">MKR301 · Chapter 8 · Lesson 8.1</span>
<h2>Reporting, ethics &amp; turning insight into decisions</h2>
<h3>The research report</h3>
<p>A report managers act on has a clear structure: <strong>executive summary</strong> (findings &amp; recommendation first), then background, method, results, limitations, appendix. Busy decision-makers read the summary — put the answer at the top, not the end.</p>
<h3>Visualisation</h3>
<p>Pick the chart for the message: <strong>bar</strong> to compare, <strong>line</strong> for trend, <strong>pie</strong> for share (sparingly), <strong>cross-tab table</strong> for exact numbers. A good chart makes the insight obvious in three seconds; a bad one hides or distorts it (truncated axes lie).</p>
<h3>Research ethics</h3>
<ul>
<li><strong>Informed consent</strong> &amp; the right to withdraw.</li>
<li><strong>Privacy / anonymity</strong> and lawful data handling (e.g. GDPR).</li>
<li><strong>No fabrication</strong> — never invent or cherry-pick data to please a client.</li>
</ul>
<h3>Insight → decision</h3>
<pre><code>DATA      "62% of churned users cite price"
INSIGHT   price is the churn driver for the mid segment
DECISION  launch a lower mid-tier plan &amp; retest
</code></pre>
<div class="callout"><span class="badge">Real study</span> Research is only valuable when it changes an action. The report's last job is a clear recommendation the manager can approve — data that never reaches a decision is money spent for nothing.</div>`,
    `<span class="eyebrow">MKR301 · Chương 8 · Bài 8.1</span>
<h2>Báo cáo, đạo đức &amp; từ insight tới quyết định</h2>
<h3>Báo cáo nghiên cứu</h3>
<p>Báo cáo mà nhà quản trị hành động theo có cấu trúc rõ: <strong>tóm tắt điều hành (executive summary)</strong> (kết quả &amp; khuyến nghị trước), rồi bối cảnh, phương pháp, kết quả, hạn chế, phụ lục. Người ra quyết định bận rộn chỉ đọc phần tóm tắt — đặt câu trả lời lên đầu, đừng để cuối.</p>
<h3>Trực quan hoá</h3>
<p>Chọn biểu đồ theo thông điệp: <strong>cột</strong> để so sánh, <strong>đường</strong> cho xu hướng, <strong>tròn</strong> cho tỉ trọng (dùng hạn chế), <strong>bảng chéo</strong> cho con số chính xác. Biểu đồ tốt làm insight hiện rõ trong ba giây; biểu đồ tồi che hoặc bóp méo nó (trục cắt cụt là nói dối).</p>
<h3>Đạo đức nghiên cứu</h3>
<ul>
<li><strong>Đồng thuận có hiểu biết (informed consent)</strong> &amp; quyền rút lui.</li>
<li><strong>Riêng tư / ẩn danh</strong> và xử lý dữ liệu hợp pháp (vd GDPR).</li>
<li><strong>Không bịa số</strong> — không bao giờ chế ra hay chọn lọc số liệu để làm vừa lòng khách hàng.</li>
</ul>
<h3>Insight → quyết định</h3>
<pre><code>DỮ LIỆU   "62% người rời bỏ nêu lý do GIÁ"
INSIGHT   giá là yếu tố churn của phân khúc tầm trung
QUYẾT ĐỊNH ra gói tầm-trung giá thấp hơn &amp; kiểm lại
</code></pre>
<div class="callout"><span class="badge">Nghiên cứu thật</span> Nghiên cứu chỉ có giá trị khi nó đổi được một hành động. Việc cuối của báo cáo là một khuyến nghị rõ mà nhà quản trị duyệt được — dữ liệu không bao giờ tới quyết định là tiền tiêu vô ích.</div>`,
  ]]);

const c8q = quiz('mkr301-quiz-8', 'Quiz 8 — Reporting & ethics|||Quiz 8 — Báo cáo & đạo đức', [
  { id: 'q1', question: 'Trong báo cáo nghiên cứu, phần nào nên đặt kết quả & khuyến nghị LÊN ĐẦU cho người ra quyết định bận rộn?', options: ['Phụ lục', 'Tóm tắt điều hành (executive summary)', 'Phần phương pháp', 'Danh mục tài liệu'], correctIndex: 1, explanation: 'Executive summary đặt câu trả lời & khuyến nghị lên đầu — người quản trị thường chỉ đọc phần này.' },
  { id: 'q2', question: 'Hành vi nào VI PHẠM đạo đức nghiên cứu?', options: ['Xin đồng thuận có hiểu biết của người tham gia', 'Ẩn danh dữ liệu cá nhân', 'Bịa/chọn lọc số liệu để làm vừa lòng khách hàng', 'Nêu rõ hạn chế của nghiên cứu'], correctIndex: 2, explanation: 'Bịa hoặc cherry-pick số liệu là vi phạm nghiêm trọng; đạo đức đòi trung thực, đồng thuận và bảo vệ riêng tư.' },
  { id: 'q3', question: 'Chuỗi "dữ liệu → insight → quyết định" nhấn mạnh điều gì?', options: ['Càng nhiều biểu đồ càng tốt', 'Nghiên cứu chỉ có giá trị khi biến thành một hành động/quyết định cụ thể', 'Nên giữ kết quả bí mật', 'Luôn dùng biểu đồ tròn'], correctIndex: 1, explanation: 'Đích cuối của nghiên cứu là thay đổi một quyết định — dữ liệu không dẫn tới hành động là lãng phí.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'MKR301',
    slug: 'mkr301-marketing-research',
    title: 'Marketing Research',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MKR301.webp',
    shortDescription: 'Marketing research end-to-end — the 6-step process, research design, secondary & qualitative data, surveys & scales, sampling, data cleaning, analysis (cross-tab, ANOVA/regression, SPSS) & reporting. Bilingual, real studies & quizzes.|||Nghiên cứu marketing trọn quy trình — 6 bước, thiết kế nghiên cứu, dữ liệu thứ cấp & định tính, khảo sát & thang đo, chọn mẫu, làm sạch & phân tích dữ liệu (cross-tab, ANOVA/hồi quy, SPSS) & báo cáo. Song ngữ, nghiên cứu thật & quiz.',
    description: 'Môn <strong>MKR301 — Marketing Research (Nghiên cứu marketing)</strong> thuộc khối Công nghệ Truyền thông, kỳ 2, dạy cách biến câu hỏi kinh doanh mơ hồ thành một nghiên cứu chặt chẽ để ra quyết định. Lộ trình 8 chương: <strong>quy trình 6 bước &amp; vai trò</strong> → <strong>xác định vấn đề &amp; thiết kế nghiên cứu</strong> (khám phá/mô tả/nhân quả) → <strong>dữ liệu thứ cấp &amp; định tính</strong> (FGD, phỏng vấn sâu, quan sát) → <strong>khảo sát định lượng &amp; thang đo</strong> (Likert, nominal/interval) → <strong>chọn mẫu</strong> (xác suất/phi xác suất, cỡ mẫu, sai số) → <strong>thu thập &amp; xử lý dữ liệu</strong> (fieldwork, làm sạch, mã hoá) → <strong>phân tích dữ liệu</strong> (cross-tab, t-test/ANOVA/hồi quy, SPSS/Excel) → <strong>báo cáo &amp; đạo đức</strong> (viết báo cáo, trực quan hoá, insight→quyết định). Bám giáo trình chuẩn quốc tế (Malhotra; Aaker, Kumar &amp; Day; Churchill), song ngữ, công cụ thật &amp; ví dụ nghiên cứu, quiz mỗi chương.',
    whatYouLearn: 'Quy trình nghiên cứu 6 bước & phân biệt MIS vs MR; vấn đề quản trị vs vấn đề nghiên cứu; ba thiết kế (khám phá/mô tả/nhân quả); dữ liệu thứ cấp vs sơ cấp, phương pháp định tính (FGD, phỏng vấn sâu, quan sát); khảo sát & bốn cấp thang đo (nominal/ordinal/interval/ratio), Likert, thiết kế bảng hỏi; chọn mẫu xác suất/phi xác suất, cỡ mẫu, sai số chọn mẫu vs ngoài chọn mẫu; thực địa, làm sạch & mã hoá dữ liệu; thống kê mô tả, cross-tab, t-test/ANOVA/hồi quy trên SPSS/Excel; viết báo cáo, trực quan hoá, đạo đức nghiên cứu & biến insight thành quyết định.',
    requirements: 'Toán/thống kê phổ thông là lợi thế cho phần phân tích. Nên có tài khoản Google (dùng Google Forms) và cài SPSS hoặc dùng Excel để thực hành phân tích dữ liệu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chuẩn (Malhotra, Aaker/Kumar/Day, Churchill), công cụ (Qualtrics, SPSS), nguồn dữ liệu, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nghiên cứu marketing là gì & vì sao giảm rủi ro quyết định.', lessons: [intro] },
    { title: 'Chương 1 — Quy trình nghiên cứu|||Chapter 1 — The research process', description: 'Vai trò, quy trình 6 bước, MIS vs MR.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Vấn đề & thiết kế|||Chapter 2 — Problem & design', description: 'Vấn đề quản trị vs nghiên cứu; khám phá/mô tả/nhân quả.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thứ cấp & định tính|||Chapter 3 — Secondary & qualitative', description: 'Dữ liệu thứ cấp, FGD, phỏng vấn sâu, quan sát.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Khảo sát & thang đo|||Chapter 4 — Surveys & scales', description: 'Phương thức khảo sát, thang đo, thiết kế bảng hỏi.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chọn mẫu|||Chapter 5 — Sampling', description: 'Xác suất/phi xác suất, cỡ mẫu, sai số.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thu thập & xử lý|||Chapter 6 — Collection & processing', description: 'Fieldwork, làm sạch dữ liệu, mã hoá.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phân tích dữ liệu|||Chapter 7 — Data analysis', description: 'Mô tả, cross-tab, t-test/ANOVA/hồi quy, SPSS.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Báo cáo & đạo đức|||Chapter 8 — Reporting & ethics', description: 'Viết báo cáo, trực quan hoá, đạo đức, insight→quyết định.', lessons: [c8, c8q] },
  ],
};
