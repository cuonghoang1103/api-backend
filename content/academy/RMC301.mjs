/**
 * RMC301 — Research Methods in Communication. Phương pháp nghiên cứu chuyên
 * về TRUYỀN THÔNG & media (khác REM301 — nghiên cứu kinh doanh tổng quát; và
 * RMB302 — định lượng): phân tích nội dung, nghiên cứu khán giả, media
 * effects, nghiên cứu media số. Giáo trình tham khảo: Hansen "Mass
 * Communication Research Methods"; Neuendorf "The Content Analysis
 * Guidebook"; Berger "Media & Communication Research Methods".
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('rmc301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo (Hansen, Neuendorf, Berger), tài liệu chính thức miễn phí, YouTube, công cụ (Google Forms, Voyant, NVivo), lộ trình tự học.',
  [[
    `<span class="eyebrow">RMC301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Research Methods in Communication — content analysis, audience research, qualitative methods, and digital/social media analytics — in one place. The official FPTU giáo trình &amp; slides live on <strong>FLM</strong>; below are the reference textbooks and free tools this course draws on.</p>
<h3>📗 Reference textbooks</h3>
<ul>
<li><em>Mass Communication Research Methods</em> — Anders Hansen, Simon Cottle, Ralph Negrine &amp; Chris Newbold</li>
<li><em>The Content Analysis Guidebook</em> — Kimberly A. Neuendorf</li>
<li><em>Media &amp; Communication Research Methods</em> — Arthur Asa Berger</li>
</ul>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for RMC301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://scholar.google.com/" target="_blank" rel="noopener">Google Scholar</a> — search academic literature on communication &amp; media effects</li>
<li><a href="https://www.pewresearch.org/methods/" target="_blank" rel="noopener">Pew Research Center — Methods</a> — real-world survey &amp; content analysis methodology write-ups</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@MikeCrittenden" target="_blank" rel="noopener">Research method explainer channels</a> — search "content analysis tutorial", "focus group moderation"</li>
<li><a href="https://www.youtube.com/results?search_query=discourse+analysis+media" target="_blank" rel="noopener">"Discourse analysis media" (YouTube search)</a> — worked examples on news &amp; ad texts</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://voyant-tools.org/" target="_blank" rel="noopener">Voyant Tools</a> — free browser-based text analysis (word frequency, collocation)</li>
<li><a href="https://forms.google.com/" target="_blank" rel="noopener">Google Forms</a> — free survey design &amp; distribution for audience research</li>
<li><a href="https://www.qualcoder.wordpress.com/" target="_blank" rel="noopener">QualCoder</a> — free, open-source alternative to NVivo/Atlas.ti for qualitative coding</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — research problem, theory (agenda-setting, framing, cultivation), research design, ethics.</li>
<li><strong>Practice</strong> — code a small set of news articles or ads by hand with a simple codebook; run intercoder reliability with a classmate.</li>
<li><strong>Go deeper</strong> — try a short in-depth interview or mini focus group; build one survey in Google Forms.</li>
<li><strong>Job-ready</strong> — pull public posts from one social platform's API, run a basic sentiment/topic pass, and write a short IMRaD report.</li>
</ol></div>`,
    `<span class="eyebrow">RMC301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Phương pháp nghiên cứu truyền thông — phân tích nội dung, nghiên cứu khán giả, phương pháp định tính, và phân tích media số/mạng xã hội — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là sách tham khảo và công cụ miễn phí môn này dùng.</p>
<h3>📗 Sách giáo trình tham khảo</h3>
<ul>
<li><em>Mass Communication Research Methods</em> — Anders Hansen, Simon Cottle, Ralph Negrine &amp; Chris Newbold</li>
<li><em>The Content Analysis Guidebook</em> — Kimberly A. Neuendorf</li>
<li><em>Media &amp; Communication Research Methods</em> — Arthur Asa Berger</li>
</ul>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của RMC301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://scholar.google.com/" target="_blank" rel="noopener">Google Scholar</a> — tra tài liệu học thuật về truyền thông &amp; tác động media</li>
<li><a href="https://www.pewresearch.org/methods/" target="_blank" rel="noopener">Pew Research Center — Methods</a> — bài viết phương pháp khảo sát &amp; phân tích nội dung thực tế</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=content+analysis+tutorial" target="_blank" rel="noopener">"Content analysis tutorial" (tìm YouTube)</a> — ví dụ mã hoá nội dung thực tế</li>
<li><a href="https://www.youtube.com/results?search_query=discourse+analysis+media" target="_blank" rel="noopener">"Discourse analysis media" (tìm YouTube)</a> — ví dụ phân tích diễn ngôn báo chí &amp; quảng cáo</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://voyant-tools.org/" target="_blank" rel="noopener">Voyant Tools</a> — phân tích văn bản miễn phí trên trình duyệt (tần suất từ, đi cùng từ)</li>
<li><a href="https://forms.google.com/" target="_blank" rel="noopener">Google Forms</a> — thiết kế &amp; phát khảo sát miễn phí cho nghiên cứu khán giả</li>
<li><a href="https://www.qualcoder.wordpress.com/" target="_blank" rel="noopener">QualCoder</a> — thay thế miễn phí, mã nguồn mở cho NVivo/Atlas.ti khi mã hoá định tính</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — vấn đề nghiên cứu, lý thuyết (agenda-setting, framing, cultivation), thiết kế nghiên cứu, đạo đức.</li>
<li><strong>Luyện tập</strong> — mã hoá tay một nhóm nhỏ bài báo hoặc quảng cáo theo codebook đơn giản; kiểm intercoder reliability với bạn học.</li>
<li><strong>Đào sâu thực tế</strong> — thử một phỏng vấn sâu ngắn hoặc focus group mini; dựng một khảo sát trên Google Forms.</li>
<li><strong>Sẵn sàng đi làm</strong> — lấy bài đăng công khai từ một nền tảng mạng xã hội qua API, chạy phân tích cảm xúc/chủ đề cơ bản, viết báo cáo IMRaD ngắn.</li>
</ol></div>`,
  ]]);

const intro = doc('rmc301-0-1-overview', 'Course overview: Research Methods in Communication|||Tổng quan: Phương pháp nghiên cứu truyền thông',
  'Nghiên cứu truyền thông là gì, khác gì nghiên cứu kinh doanh tổng quát; lộ trình: lý thuyết & vấn đề → thiết kế & đạo đức → phân tích nội dung → định tính → khán giả & khảo sát → media số → viết báo cáo.',
  [[
    `<span class="eyebrow">RMC301 · Lesson 0.1 · Overview</span>
<h2>Research Methods in Communication</h2>
<p class="lead">This course teaches you how communication scholars and media professionals study <strong>media messages, audiences and effects</strong> — scientifically, not by opinion. Unlike a general business-research course, every method here is applied to <strong>media content, media use, and media impact</strong>: newspaper framing, ad content, TV audiences, social platforms.</p>
<h3>Why it matters</h3>
<ul>
<li><strong>Academic</strong> — testing theories like agenda-setting, framing, cultivation, uses &amp; gratifications.</li>
<li><strong>Industry</strong> — measuring campaign effectiveness, audience ratings, brand perception, social listening.</li>
<li><strong>Policy</strong> — evidence for media regulation, misinformation studies, media literacy programs.</li>
</ul>
<h3>Roadmap</h3>
<p>Overview &amp; role of communication research → research problems, theory &amp; literature review → research design &amp; ethics → quantitative content analysis → qualitative methods (discourse analysis, interviews, focus groups) → audience research &amp; surveys → digital/social media analytics → analysis, interpretation &amp; report writing.</p>`,
    `<span class="eyebrow">RMC301 · Bài 0.1 · Tổng quan</span>
<h2>Phương pháp nghiên cứu truyền thông</h2>
<p class="lead">Môn này dạy bạn cách các nhà nghiên cứu truyền thông và người làm media nghiên cứu <strong>thông điệp truyền thông, khán giả và tác động</strong> — một cách khoa học, không phải bằng cảm tính. Khác với môn nghiên cứu kinh doanh tổng quát, mọi phương pháp ở đây đều áp dụng cho <strong>nội dung media, việc sử dụng media và tác động của media</strong>: cách báo đưa tin, nội dung quảng cáo, khán giả TV, các nền tảng mạng xã hội.</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li><strong>Học thuật</strong> — kiểm định các lý thuyết như agenda-setting, framing, cultivation, uses &amp; gratifications.</li>
<li><strong>Ngành nghề</strong> — đo hiệu quả chiến dịch, rating khán giả, nhận thức thương hiệu, social listening.</li>
<li><strong>Chính sách</strong> — bằng chứng cho quản lý media, nghiên cứu tin giả, các chương trình dân trí truyền thông.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; vai trò nghiên cứu truyền thông → vấn đề nghiên cứu, lý thuyết &amp; tổng quan tài liệu → thiết kế nghiên cứu &amp; đạo đức → phân tích nội dung định lượng → phương pháp định tính (phân tích diễn ngôn, phỏng vấn sâu, focus group) → nghiên cứu khán giả &amp; khảo sát → phân tích media số/mạng xã hội → phân tích, diễn giải &amp; viết báo cáo.</p>`,
  ]]);

/* ---------- Chương 1 — Tổng quan nghiên cứu truyền thông & vai trò ---------- */
const c1 = doc('rmc301-1-1-overview-role', '1.1 — What is communication research & why it matters|||1.1 — Nghiên cứu truyền thông là gì & vai trò',
  'Định nghĩa nghiên cứu truyền thông; nghiên cứu học thuật vs ứng dụng; vai trò trong kiểm định lý thuyết, đo hiệu quả chiến dịch, hoạch định chính sách; quy trình tổng thể.',
  [[
    `<span class="eyebrow">RMC301 · Chapter 1 · Lesson 1.1</span>
<h2>What is communication research &amp; why it matters</h2>
<h3>Definition</h3>
<p><strong>Communication research</strong> is the systematic, scientific study of how messages are created, transmitted, received, and how they affect people — across mass media, interpersonal, and now digital/social channels. It answers questions no single opinion can: does violent content increase aggression? Does a news outlet frame an issue one-sidedly? Which channel actually reaches a target audience?</p>
<h3>Academic vs applied</h3>
<ul>
<li><strong>Academic (basic) research</strong> — tests and builds theory (e.g. does exposure to a media frame shift public opinion?). Published in journals, not tied to a client's deadline.</li>
<li><strong>Applied (industry) research</strong> — answers a client's practical question: campaign effectiveness, audience ratings (Nielsen-style), brand tracking, social listening for a PR crisis.</li>
</ul>
<h3>Role of communication research</h3>
<ul>
<li><strong>Theory testing</strong> — validating or challenging models like agenda-setting or cultivation theory with real data.</li>
<li><strong>Practice &amp; decision-making</strong> — guiding content strategy, ad spend, platform choice.</li>
<li><strong>Policy &amp; society</strong> — evidence for regulation, misinformation countermeasures, media literacy.</li>
</ul>
<pre><code>Overall research process (this course's spine):
 1. Research problem   -> what do we want to know, and why?
 2. Theory & literature -> what do we already know / expect?
 3. Design              -> how will we find out, ethically?
 4. Data collection     -> content analysis / interviews / survey / digital data
 5. Analysis            -> statistics or qualitative coding
 6. Interpretation & report -> what does it mean, and to whom?
</code></pre>
<div class="callout"><span class="badge">Communication-specific</span> Every method in this course is aimed at <strong>media content, media audiences, or media effects</strong> — not general business questions like pricing or supply chains.</div>`,
    `<span class="eyebrow">RMC301 · Chương 1 · Bài 1.1</span>
<h2>Nghiên cứu truyền thông là gì &amp; vì sao quan trọng</h2>
<h3>Định nghĩa</h3>
<p><strong>Nghiên cứu truyền thông</strong> là nghiên cứu khoa học, có hệ thống về cách thông điệp được tạo ra, truyền đi, tiếp nhận, và tác động của nó lên con người — qua truyền thông đại chúng, giao tiếp liên cá nhân, và cả kênh số/mạng xã hội ngày nay. Nó trả lời những câu hỏi mà cảm tính không trả lời được: nội dung bạo lực có làm tăng hành vi hung hăng? Một tờ báo có đưa tin một chiều? Kênh nào thực sự tiếp cận đúng đối tượng mục tiêu?</p>
<h3>Học thuật vs ứng dụng</h3>
<ul>
<li><strong>Nghiên cứu học thuật (cơ bản)</strong> — kiểm định &amp; xây dựng lý thuyết (vd tiếp xúc với một khung truyền thông có làm thay đổi dư luận không?). Công bố trên tạp chí khoa học, không gắn deadline khách hàng.</li>
<li><strong>Nghiên cứu ứng dụng (ngành nghề)</strong> — trả lời câu hỏi thực tế của khách hàng: hiệu quả chiến dịch, rating khán giả (kiểu Nielsen), theo dõi thương hiệu, social listening khi khủng hoảng PR.</li>
</ul>
<h3>Vai trò của nghiên cứu truyền thông</h3>
<ul>
<li><strong>Kiểm định lý thuyết</strong> — xác nhận hoặc phản biện các mô hình như agenda-setting hay cultivation theory bằng dữ liệu thật.</li>
<li><strong>Thực tiễn &amp; ra quyết định</strong> — dẫn hướng chiến lược nội dung, chi tiêu quảng cáo, chọn kênh.</li>
<li><strong>Chính sách &amp; xã hội</strong> — bằng chứng cho quản lý truyền thông, đối phó tin giả, dân trí truyền thông.</li>
</ul>
<pre><code>Quy trình nghiên cứu tổng thể (xuyên suốt môn):
 1. Vấn đề nghiên cứu   -> muốn biết điều gì, và vì sao?
 2. Lý thuyết & tài liệu -> đã biết gì / kỳ vọng gì?
 3. Thiết kế             -> tìm hiểu bằng cách nào, có đạo đức?
 4. Thu thập dữ liệu     -> phân tích nội dung / phỏng vấn / khảo sát / dữ liệu số
 5. Phân tích            -> thống kê hoặc mã hoá định tính
 6. Diễn giải & báo cáo  -> nghĩa là gì, cho ai?
</code></pre>
<div class="callout"><span class="badge">Đặc thù truyền thông</span> Mọi phương pháp trong môn này nhằm vào <strong>nội dung media, khán giả media, hoặc tác động của media</strong> — không phải câu hỏi kinh doanh tổng quát như giá cả hay chuỗi cung ứng.</div>`,
  ]]);

const c1q = quiz('rmc301-quiz-1', 'Quiz 1 — Overview & role|||Quiz 1 — Tổng quan & vai trò', [
  { id: 'q1', question: 'Nghiên cứu truyền thông tập trung nghiên cứu điều gì?', options: ['Chuỗi cung ứng doanh nghiệp', 'Cách thông điệp được tạo, truyền, tiếp nhận và tác động qua media', 'Chỉ giá cổ phiếu công ty truyền thông', 'Cấu trúc bộ máy nhân sự'], correctIndex: 1, explanation: 'Nghiên cứu truyền thông nghiên cứu quá trình tạo/truyền/tiếp nhận thông điệp và tác động của nó qua các kênh media.' },
  { id: 'q2', question: 'Nghiên cứu ứng dụng (applied) trong truyền thông thường trả lời câu hỏi nào?', options: ['Kiểm định lý thuyết agenda-setting để công bố tạp chí', 'Hiệu quả chiến dịch, rating khán giả cho khách hàng thực tế', 'Chỉ mang tính triết học trừu tượng', 'Không liên quan tới media'], correctIndex: 1, explanation: 'Nghiên cứu ứng dụng gắn với câu hỏi thực tế của khách hàng/ngành, như hiệu quả chiến dịch hay đo rating.' },
  { id: 'q3', question: 'Bước ĐẦU TIÊN trong quy trình nghiên cứu tổng thể là gì?', options: ['Phân tích thống kê', 'Xác định vấn đề nghiên cứu', 'Viết báo cáo', 'Thu thập dữ liệu'], correctIndex: 1, explanation: 'Quy trình bắt đầu từ việc xác định vấn đề nghiên cứu — muốn biết điều gì và vì sao — trước khi thiết kế và thu thập dữ liệu.' },
]);

/* ---------- Chương 2 — Vấn đề nghiên cứu, lý thuyết truyền thông & tổng quan tài liệu ---------- */
const c2 = doc('rmc301-2-1-problem-theory-litreview', '2.1 — Research problems, communication theory & literature review|||2.1 — Vấn đề nghiên cứu, lý thuyết truyền thông & tổng quan tài liệu',
  'Từ hiện tượng media đến câu hỏi nghiên cứu & giả thuyết; lý thuyết truyền thông làm khung (agenda-setting, framing, cultivation, uses & gratifications, spiral of silence); tổng quan tài liệu; biến & khái niệm hoá/đo lường hoá.',
  [[
    `<span class="eyebrow">RMC301 · Chapter 2 · Lesson 2.1</span>
<h2>Research problems, theory &amp; literature review</h2>
<h3>From a media phenomenon to a research question</h3>
<p>Good research starts with an observed problem — e.g. "coverage of a political scandal seems one-sided" — narrowed into a <strong>research question</strong> ("Does Outlet X frame Candidate Y more negatively than Outlet Z?") and, when testable, a <strong>hypothesis</strong> ("Outlet X uses more negative frames for Candidate Y than Outlet Z does").</p>
<h3>Communication theories as a framework</h3>
<ul>
<li><strong>Agenda-setting</strong> — media coverage volume shapes what audiences think is important.</li>
<li><strong>Framing</strong> — HOW an issue is presented (angle, emphasis) shapes interpretation.</li>
<li><strong>Cultivation theory</strong> — long-term, heavy media exposure shapes perceptions of reality (e.g. overestimating crime after heavy TV viewing).</li>
<li><strong>Uses &amp; gratifications</strong> — audiences actively choose media to satisfy needs (information, entertainment, social).</li>
<li><strong>Spiral of silence</strong> — people withhold minority opinions when they perceive them as unpopular, partly shaped by media climate.</li>
</ul>
<h3>Literature review</h3>
<p>A <strong>literature review</strong> surveys prior academic work to: position your study (what's already known?), avoid duplicating existing findings, and build the theoretical framework your hypotheses rest on. Search academic databases (Google Scholar, JSTOR) using theory + topic keywords, then synthesize — don't just list — sources.</p>
<h3>Variables, conceptualization &amp; operationalization</h3>
<p>A <strong>variable</strong> is anything that can vary and be measured (e.g. "media exposure", "perceived bias"). <strong>Conceptualization</strong> defines what a concept means abstractly; <strong>operationalization</strong> turns it into something measurable (e.g. "media exposure" measured as hours/week of news consumption self-reported on a survey).</p>
<div class="callout"><span class="badge">Independent vs dependent</span> The <strong>independent variable</strong> is the presumed cause (media exposure); the <strong>dependent variable</strong> is the presumed effect (perceived crime risk).</div>`,
    `<span class="eyebrow">RMC301 · Chương 2 · Bài 2.1</span>
<h2>Vấn đề nghiên cứu, lý thuyết &amp; tổng quan tài liệu</h2>
<h3>Từ hiện tượng media đến câu hỏi nghiên cứu</h3>
<p>Một nghiên cứu tốt bắt đầu từ vấn đề quan sát được — vd "tin tức về một vụ bê bối chính trị có vẻ đưa tin một chiều" — thu hẹp lại thành <strong>câu hỏi nghiên cứu</strong> ("Báo X có đưa tin về ứng viên Y tiêu cực hơn báo Z không?") và, khi có thể kiểm định, một <strong>giả thuyết</strong> ("Báo X dùng khung tiêu cực nhiều hơn cho ứng viên Y so với báo Z").</p>
<h3>Lý thuyết truyền thông làm khung</h3>
<ul>
<li><strong>Agenda-setting</strong> — mức độ đưa tin của media định hình điều công chúng nghĩ là quan trọng.</li>
<li><strong>Framing (đóng khung)</strong> — CÁCH một vấn đề được trình bày (góc nhìn, nhấn mạnh) định hình cách diễn giải.</li>
<li><strong>Cultivation theory (lý thuyết trồng cấy)</strong> — tiếp xúc media lâu dài, nặng liều định hình nhận thức về thực tế (vd xem TV nhiều làm ước lượng tỉ lệ tội phạm cao hơn thực tế).</li>
<li><strong>Uses &amp; gratifications</strong> — khán giả chủ động chọn media để thoả mãn nhu cầu (thông tin, giải trí, xã hội).</li>
<li><strong>Spiral of silence (vòng xoáy im lặng)</strong> — người ta giữ im ý kiến thiểu số khi cảm thấy nó không phổ biến, một phần do bầu không khí media tạo ra.</li>
</ul>
<h3>Tổng quan tài liệu</h3>
<p><strong>Tổng quan tài liệu</strong> rà soát các nghiên cứu học thuật trước đó để: định vị nghiên cứu của bạn (đã biết gì rồi?), tránh trùng lặp phát hiện đã có, và xây khung lý thuyết cho giả thuyết. Tìm trên các cơ sở dữ liệu học thuật (Google Scholar, JSTOR) bằng từ khoá lý thuyết + chủ đề, rồi tổng hợp — không chỉ liệt kê — các nguồn.</p>
<h3>Biến, khái niệm hoá &amp; đo lường hoá</h3>
<p><strong>Biến</strong> là bất cứ thứ gì có thể thay đổi và đo được (vd "mức tiếp xúc media", "cảm nhận thiên vị"). <strong>Khái niệm hoá</strong> định nghĩa một khái niệm ở mức trừu tượng; <strong>đo lường hoá</strong> biến nó thành thứ đo được cụ thể (vd "mức tiếp xúc media" đo bằng số giờ/tuần xem tin tức, tự khai báo trong khảo sát).</p>
<div class="callout"><span class="badge">Độc lập vs phụ thuộc</span> <strong>Biến độc lập</strong> là nguyên nhân giả định (mức tiếp xúc media); <strong>biến phụ thuộc</strong> là hệ quả giả định (cảm nhận nguy cơ tội phạm).</div>`,
  ]]);

const c2q = quiz('rmc301-quiz-2', 'Quiz 2 — Problem, theory & lit review|||Quiz 2 — Vấn đề, lý thuyết & tổng quan tài liệu', [
  { id: 'q1', question: 'Lý thuyết cho rằng tiếp xúc media lâu dài, nặng liều định hình nhận thức về thực tế (vd ước lượng tội phạm quá cao) là?', options: ['Agenda-setting', 'Cultivation theory', 'Uses & gratifications', 'Spiral of silence'], correctIndex: 1, explanation: 'Cultivation theory: xem TV nhiều, lâu dài "trồng cấy" nhận thức lệch về thực tế.' },
  { id: 'q2', question: 'Mục đích chính của tổng quan tài liệu (literature review) là gì?', options: ['Thay thế hoàn toàn việc thu thập dữ liệu', 'Định vị nghiên cứu, tránh trùng lặp, xây khung lý thuyết', 'Chỉ để làm dài báo cáo', 'Chọn mẫu khảo sát'], correctIndex: 1, explanation: 'Tổng quan tài liệu giúp định vị nghiên cứu so với cái đã biết và xây khung lý thuyết cho giả thuyết.' },
  { id: 'q3', question: '"Đo lường hoá" (operationalization) một khái niệm nghĩa là gì?', options: ['Định nghĩa khái niệm ở mức trừu tượng', 'Biến khái niệm trừu tượng thành thứ đo được cụ thể', 'Xoá khái niệm khỏi nghiên cứu', 'Chỉ áp dụng cho biến phụ thuộc'], correctIndex: 1, explanation: 'Đo lường hoá là bước cụ thể hoá một khái niệm trừu tượng thành chỉ số/cách đo được, khác với khái niệm hoá (định nghĩa trừu tượng).' },
]);

/* ---------- Chương 3 — Thiết kế nghiên cứu & đạo đức trong nghiên cứu media ---------- */
const c3 = doc('rmc301-3-1-design-ethics', '3.1 — Research design & ethics in media research|||3.1 — Thiết kế nghiên cứu & đạo đức trong nghiên cứu media',
  'Các loại thiết kế (mô tả, tương quan, thực nghiệm), longitudinal vs cross-sectional; độ tin cậy & độ giá trị; chọn mẫu; đạo đức nghiên cứu (informed consent, bảo mật, nội dung nhạy cảm, IRB).',
  [[
    `<span class="eyebrow">RMC301 · Chapter 3 · Lesson 3.1</span>
<h2>Research design &amp; ethics in media research</h2>
<h3>Types of design</h3>
<ul>
<li><strong>Descriptive</strong> — describes patterns (e.g. how much violence appears on prime-time TV).</li>
<li><strong>Correlational</strong> — examines relationships between variables without manipulating them (e.g. heavier news use correlates with higher perceived crime risk).</li>
<li><strong>Experimental</strong> — manipulates a variable in controlled conditions to test causation (e.g. show one group a violent clip, a control group a neutral clip, then measure aggression) — the only design that can claim <strong>cause and effect</strong>.</li>
<li><strong>Cross-sectional vs longitudinal</strong> — a single snapshot in time vs repeated measures over time (tracking how media effects evolve).</li>
</ul>
<h3>Reliability &amp; validity</h3>
<p><strong>Reliability</strong> — would the measure give consistent results if repeated (e.g. would two coders classify the same article the same way)? <strong>Validity</strong> — does the measure actually capture the concept it claims to (e.g. does "hours of TV watched" really capture "media exposure", or miss streaming/mobile)?</p>
<h3>Sampling</h3>
<p><strong>Probability sampling</strong> (random, stratified) lets you generalize to a population — used for audience surveys claiming national reach. <strong>Non-probability sampling</strong> (convenience, purposive) is common in qualitative/exploratory media studies but limits generalization. Sample size for audience surveys is chosen for statistical power, not "as many as possible".</p>
<h3>Ethics in media research</h3>
<ul>
<li><strong>Informed consent</strong> — participants know what the study involves and agree voluntarily, especially in interviews/focus groups.</li>
<li><strong>Confidentiality</strong> — protecting participant identity and data, particularly sensitive opinions about media/politics.</li>
<li><strong>Sensitive content</strong> — extra care when studying violence, misinformation, or content involving minors.</li>
<li><strong>IRB (Institutional Review Board)</strong> — ethics review board that approves human-subjects research before it begins.</li>
</ul>
<div class="callout"><span class="badge">Design ≠ afterthought</span> The design choice (experimental vs correlational) determines whether you can even claim <strong>causation</strong> — pick it before collecting data, not after.</div>`,
    `<span class="eyebrow">RMC301 · Chương 3 · Bài 3.1</span>
<h2>Thiết kế nghiên cứu &amp; đạo đức trong nghiên cứu media</h2>
<h3>Các loại thiết kế</h3>
<ul>
<li><strong>Mô tả (descriptive)</strong> — mô tả khuôn mẫu (vd mức độ bạo lực xuất hiện trên TV giờ vàng).</li>
<li><strong>Tương quan (correlational)</strong> — xem xét quan hệ giữa các biến mà không can thiệp (vd dùng tin tức nhiều tương quan với cảm nhận nguy cơ tội phạm cao hơn).</li>
<li><strong>Thực nghiệm (experimental)</strong> — can thiệp một biến trong điều kiện có kiểm soát để kiểm định nhân quả (vd cho một nhóm xem clip bạo lực, nhóm đối chứng xem clip trung tính, rồi đo hành vi hung hăng) — thiết kế DUY NHẤT có thể khẳng định <strong>nhân quả</strong>.</li>
<li><strong>Cắt ngang vs theo chiều dài (cross-sectional vs longitudinal)</strong> — một lát cắt thời điểm vs đo lặp lại theo thời gian (theo dõi tác động media thay đổi ra sao).</li>
</ul>
<h3>Độ tin cậy &amp; độ giá trị</h3>
<p><strong>Độ tin cậy (reliability)</strong> — đo lại có cho kết quả nhất quán không (vd hai người mã hoá có phân loại cùng một bài báo giống nhau không)? <strong>Độ giá trị (validity)</strong> — thước đo có thực sự nắm bắt đúng khái niệm nó tuyên bố đo không (vd "số giờ xem TV" có thực sự nắm bắt "mức tiếp xúc media", hay bỏ sót streaming/mobile)?</p>
<h3>Chọn mẫu</h3>
<p><strong>Chọn mẫu xác suất</strong> (ngẫu nhiên, phân tầng) cho phép suy rộng ra tổng thể — dùng cho khảo sát khán giả tuyên bố mang tính đại diện quốc gia. <strong>Chọn mẫu phi xác suất</strong> (thuận tiện, chủ đích) phổ biến trong nghiên cứu định tính/khám phá về media nhưng hạn chế khả năng suy rộng. Cỡ mẫu cho khảo sát khán giả được chọn theo lực thống kê (statistical power), không phải "càng nhiều càng tốt".</p>
<h3>Đạo đức trong nghiên cứu media</h3>
<ul>
<li><strong>Informed consent (đồng ý có hiểu biết)</strong> — người tham gia biết nghiên cứu liên quan gì và tự nguyện đồng ý, đặc biệt trong phỏng vấn/focus group.</li>
<li><strong>Bảo mật</strong> — bảo vệ danh tính và dữ liệu người tham gia, đặc biệt ý kiến nhạy cảm về media/chính trị.</li>
<li><strong>Nội dung nhạy cảm</strong> — cẩn trọng hơn khi nghiên cứu bạo lực, tin giả, hoặc nội dung liên quan trẻ em.</li>
<li><strong>IRB (Hội đồng đạo đức)</strong> — hội đồng xét duyệt đạo đức phê duyệt nghiên cứu trên con người trước khi tiến hành.</li>
</ul>
<div class="callout"><span class="badge">Thiết kế không phải nghĩ sau</span> Lựa chọn thiết kế (thực nghiệm vs tương quan) quyết định bạn có được phép khẳng định <strong>nhân quả</strong> hay không — chọn TRƯỚC khi thu thập dữ liệu, không phải sau.</div>`,
  ]]);

const c3q = quiz('rmc301-quiz-3', 'Quiz 3 — Design & ethics|||Quiz 3 — Thiết kế & đạo đức', [
  { id: 'q1', question: 'Thiết kế nghiên cứu DUY NHẤT có thể khẳng định quan hệ nhân quả là?', options: ['Mô tả (descriptive)', 'Tương quan (correlational)', 'Thực nghiệm (experimental)', 'Cắt ngang (cross-sectional)'], correctIndex: 2, explanation: 'Chỉ thiết kế thực nghiệm — can thiệp biến trong điều kiện kiểm soát — mới cho phép khẳng định nhân quả.' },
  { id: 'q2', question: 'Độ tin cậy (reliability) của một thước đo trong nghiên cứu media nói về điều gì?', options: ['Thước đo có đúng khái niệm cần đo không', 'Đo lại có cho kết quả nhất quán không', 'Cỡ mẫu có đủ lớn không', 'Có xin phép IRB chưa'], correctIndex: 1, explanation: 'Reliability là tính nhất quán khi đo lặp lại; validity mới là "đo đúng khái niệm cần đo".' },
  { id: 'q3', question: 'Informed consent trong nghiên cứu truyền thông nghĩa là?', options: ['Chỉ nhà nghiên cứu cần biết mục đích nghiên cứu', 'Người tham gia được biết nội dung nghiên cứu và tự nguyện đồng ý', 'Không cần áp dụng khi nghiên cứu nội dung media công khai', 'Chỉ áp dụng cho nghiên cứu định lượng'], correctIndex: 1, explanation: 'Informed consent yêu cầu người tham gia hiểu rõ nghiên cứu liên quan gì và đồng ý tự nguyện, đặc biệt trong phỏng vấn/focus group.' },
]);

/* ---------- Chương 4 — Phân tích nội dung định lượng ---------- */
const c4 = doc('rmc301-4-1-quantitative-content-analysis', '4.1 — Quantitative content analysis|||4.1 — Phân tích nội dung định lượng',
  'Định nghĩa content analysis (Neuendorf); quy trình: unit of analysis, codebook, coder training, intercoder reliability (kappa/alpha), mã hoá & phân tích; ứng dụng phân tích khung tin, quảng cáo, đại diện giới/dân tộc.',
  [[
    `<span class="eyebrow">RMC301 · Chapter 4 · Lesson 4.1</span>
<h2>Quantitative content analysis</h2>
<h3>What is content analysis?</h3>
<p>Per Neuendorf, <strong>content analysis</strong> is "the systematic, objective, quantitative analysis of message characteristics" — it turns qualitative media content (articles, ads, TV segments, posts) into countable, comparable categories, without the researcher's personal opinion driving the classification.</p>
<h3>The process</h3>
<pre><code>1. Define the unit of analysis  -> what gets coded: a whole article? a paragraph? a single visual frame?
2. Build the codebook           -> categories + clear rules for each variable
                                    (e.g. "tone": positive / negative / neutral)
3. Train coders                 -> everyone applies the codebook the same way
4. Test intercoder reliability  -> do independent coders agree on a pilot sample?
                                    (Cohen's kappa for 2 coders, Krippendorff's alpha for more)
5. Code the full sample
6. Analyze statistically        -> frequencies, cross-tabs, comparisons across outlets/time
</code></pre>
<h3>Applications</h3>
<ul>
<li><strong>News framing</strong> — coding whether coverage of an issue is framed as conflict, human-interest, economic, etc.</li>
<li><strong>Advertising content</strong> — coding appeals used (emotional, rational, celebrity), product claims.</li>
<li><strong>Representation</strong> — coding gender, ethnicity, age representation on TV or in ads to study diversity/stereotyping.</li>
</ul>
<pre><code>Example codebook snippet (news tone):
 Variable: TONE
 1 = Positive  (favorable language toward the subject)
 2 = Negative  (critical/unfavorable language)
 3 = Neutral   (balanced or purely factual)
 Unit: each news article about Topic X
</code></pre>
<div class="callout"><span class="badge">Reliability first</span> Without an acceptable intercoder reliability score, the coding is not trustworthy — no amount of statistical analysis afterward fixes that.</div>`,
    `<span class="eyebrow">RMC301 · Chương 4 · Bài 4.1</span>
<h2>Phân tích nội dung định lượng</h2>
<h3>Phân tích nội dung là gì?</h3>
<p>Theo Neuendorf, <strong>phân tích nội dung (content analysis)</strong> là "phân tích có hệ thống, khách quan, định lượng các đặc điểm của thông điệp" — nó biến nội dung media định tính (bài báo, quảng cáo, đoạn TV, bài đăng) thành các phạm trù đếm được, so sánh được, không để ý kiến cá nhân của người nghiên cứu chi phối việc phân loại.</p>
<h3>Quy trình</h3>
<pre><code>1. Xác định đơn vị phân tích -> cái gì được mã hoá: cả bài báo? một đoạn? một khung hình?
2. Xây codebook               -> các phạm trù + quy tắc rõ ràng cho từng biến
                                  (vd "tông giọng": tích cực / tiêu cực / trung tính)
3. Huấn luyện người mã hoá    -> mọi người áp dụng codebook giống nhau
4. Kiểm intercoder reliability -> người mã hoá độc lập có đồng thuận trên mẫu thử không?
                                   (Cohen's kappa cho 2 người, Krippendorff's alpha cho nhiều hơn)
5. Mã hoá toàn bộ mẫu
6. Phân tích thống kê          -> tần suất, bảng chéo, so sánh giữa các báo/thời điểm
</code></pre>
<h3>Ứng dụng</h3>
<ul>
<li><strong>Khung tin tức (framing)</strong> — mã hoá xem tin về một vấn đề được đóng khung là xung đột, quan tâm con người, kinh tế, v.v.</li>
<li><strong>Nội dung quảng cáo</strong> — mã hoá kiểu thu hút được dùng (cảm xúc, lý tính, người nổi tiếng), tuyên bố sản phẩm.</li>
<li><strong>Đại diện (representation)</strong> — mã hoá đại diện giới, dân tộc, tuổi trên TV hoặc quảng cáo để nghiên cứu đa dạng/định kiến.</li>
</ul>
<pre><code>Ví dụ trích codebook (tông tin tức):
 Biến: TÔNG GIỌNG
 1 = Tích cực (ngôn ngữ ủng hộ đối tượng)
 2 = Tiêu cực (ngôn ngữ chỉ trích/bất lợi)
 3 = Trung tính (cân bằng hoặc thuần túy khách quan)
 Đơn vị: mỗi bài báo về Chủ đề X
</code></pre>
<div class="callout"><span class="badge">Reliability trước hết</span> Không có điểm intercoder reliability đạt yêu cầu, việc mã hoá không đáng tin — phân tích thống kê sau đó không sửa được điều này.</div>`,
  ]]);

const c4q = quiz('rmc301-quiz-4', 'Quiz 4 — Quantitative content analysis|||Quiz 4 — Phân tích nội dung định lượng', [
  { id: 'q1', question: 'Theo Neuendorf, content analysis là gì?', options: ['Phỏng vấn sâu người xem media', 'Phân tích có hệ thống, khách quan, định lượng đặc điểm thông điệp', 'Chỉ đọc lướt và nêu cảm nhận cá nhân', 'Một loại khảo sát khán giả'], correctIndex: 1, explanation: 'Content analysis là phân tích hệ thống, khách quan, định lượng các đặc điểm thông điệp — không dựa cảm tính cá nhân.' },
  { id: 'q2', question: 'Intercoder reliability dùng để kiểm tra điều gì?', options: ['Cỡ mẫu có đủ lớn', 'Các người mã hoá độc lập có đồng thuận khi áp dụng codebook không', 'Bài báo có bao nhiêu từ', 'Khảo sát có đại diện quốc gia không'], correctIndex: 1, explanation: 'Intercoder reliability đo mức đồng thuận giữa các coder độc lập khi áp dụng cùng một codebook — vd bằng Cohen\'s kappa.' },
  { id: 'q3', question: 'Bước nào PHẢI làm TRƯỚC khi mã hoá toàn bộ mẫu?', options: ['Phân tích thống kê', 'Viết báo cáo cuối', 'Xây codebook, huấn luyện coder, kiểm intercoder reliability', 'Xoá dữ liệu thử nghiệm'], correctIndex: 2, explanation: 'Codebook, huấn luyện coder và kiểm intercoder reliability trên mẫu thử phải hoàn tất trước khi mã hoá toàn bộ mẫu, để đảm bảo mã hoá đáng tin.' },
]);

/* ---------- Chương 5 — Nghiên cứu định tính: diễn ngôn, phỏng vấn sâu, focus group ---------- */
const c5 = doc('rmc301-5-1-qualitative-methods', '5.1 — Qualitative methods: discourse analysis, in-depth interviews, focus groups|||5.1 — Nghiên cứu định tính: phân tích diễn ngôn, phỏng vấn sâu, focus group',
  'Phân tích diễn ngôn (ngôn ngữ, quyền lực, ý nghĩa ẩn); phỏng vấn sâu bán cấu trúc; focus group đo phản ứng nhóm; mã hoá theo chủ đề (thematic coding) & grounded theory.',
  [[
    `<span class="eyebrow">RMC301 · Chapter 5 · Lesson 5.1</span>
<h2>Qualitative methods: discourse analysis, interviews, focus groups</h2>
<h3>Discourse analysis</h3>
<p><strong>Discourse analysis</strong> studies language use in media texts closely — word choice, metaphor, who gets to speak, whose voice is missing — to uncover implicit meaning, ideology, and power relations. Example: analyzing how news language labels protesters as "activists" vs "rioters" depending on the outlet.</p>
<h3>In-depth interviews</h3>
<p>A <strong>semi-structured in-depth interview</strong> uses a flexible guide of open-ended questions to understand an individual's experience, motivations, or interpretation of media (e.g. why someone trusts one news source over another). Depth over breadth — usually a small number of participants, analyzed for rich meaning rather than statistical generalization.</p>
<h3>Focus groups</h3>
<p>A <strong>focus group</strong> gathers 6–10 participants to discuss a topic together, moderated by a researcher — useful for observing how people react to media content (an ad, a trailer) collectively, including disagreement and group dynamics that a one-on-one interview would miss.</p>
<h3>Analyzing qualitative data</h3>
<ul>
<li><strong>Thematic coding</strong> — reading transcripts repeatedly, tagging recurring ideas ("themes") that answer the research question.</li>
<li><strong>Grounded theory</strong> — building theory FROM the data itself (bottom-up), rather than testing a pre-existing theory — codes and categories emerge as you analyze.</li>
</ul>
<div class="callout"><span class="badge">Depth, not counts</span> Qualitative methods trade sample size for richness — they answer <em>why</em> and <em>how</em> questions that a survey number alone cannot.</div>`,
    `<span class="eyebrow">RMC301 · Chương 5 · Bài 5.1</span>
<h2>Nghiên cứu định tính: diễn ngôn, phỏng vấn sâu, focus group</h2>
<h3>Phân tích diễn ngôn</h3>
<p><strong>Phân tích diễn ngôn (discourse analysis)</strong> xem xét kỹ cách dùng ngôn ngữ trong văn bản media — lựa chọn từ, ẩn dụ, ai được nói, tiếng nói nào bị thiếu — để lộ ra ý nghĩa ngầm, hệ tư tưởng, và quan hệ quyền lực. Ví dụ: phân tích cách ngôn ngữ tin tức gọi người biểu tình là "nhà hoạt động" hay "kẻ gây rối" tuỳ theo tờ báo.</p>
<h3>Phỏng vấn sâu</h3>
<p><strong>Phỏng vấn sâu bán cấu trúc</strong> dùng một dàn câu hỏi mở, linh hoạt để hiểu trải nghiệm, động cơ, hoặc cách một cá nhân diễn giải media (vd vì sao ai đó tin tưởng một nguồn tin hơn nguồn khác). Ưu tiên độ sâu hơn độ rộng — thường số lượng người tham gia ít, được phân tích để lấy ý nghĩa phong phú hơn là suy rộng thống kê.</p>
<h3>Focus group</h3>
<p><strong>Focus group</strong> tập hợp 6–10 người thảo luận cùng nhau về một chủ đề, do nhà nghiên cứu điều phối — hữu ích để quan sát cách người ta phản ứng TẬP THỂ với nội dung media (một quảng cáo, một trailer), bao gồm cả bất đồng và động lực nhóm mà phỏng vấn một-một không thấy được.</p>
<h3>Phân tích dữ liệu định tính</h3>
<ul>
<li><strong>Mã hoá theo chủ đề (thematic coding)</strong> — đọc lại bản ghi nhiều lần, gắn nhãn các ý lặp lại ("chủ đề") trả lời cho câu hỏi nghiên cứu.</li>
<li><strong>Grounded theory</strong> — xây lý thuyết TỪ dữ liệu (từ dưới lên), thay vì kiểm định một lý thuyết có sẵn — mã và phạm trù nổi lên trong lúc phân tích.</li>
</ul>
<div class="callout"><span class="badge">Sâu, không phải đếm</span> Phương pháp định tính đánh đổi cỡ mẫu để lấy độ phong phú — trả lời câu hỏi <em>vì sao</em> và <em>như thế nào</em> mà riêng số liệu khảo sát không trả lời được.</div>`,
  ]]);

const c5q = quiz('rmc301-quiz-5', 'Quiz 5 — Qualitative methods|||Quiz 5 — Phương pháp định tính', [
  { id: 'q1', question: 'Phân tích diễn ngôn (discourse analysis) tập trung vào điều gì?', options: ['Đếm tần suất từ khoá bằng phần mềm', 'Cách dùng ngôn ngữ, ai được nói, ý nghĩa ẩn & quyền lực trong văn bản media', 'Chỉ số rating khán giả', 'Thiết kế bảng hỏi khảo sát'], correctIndex: 1, explanation: 'Discourse analysis xem xét ngôn ngữ, tiếng nói, và quan hệ quyền lực/ý nghĩa ẩn trong văn bản media.' },
  { id: 'q2', question: 'Ưu điểm chính của focus group so với phỏng vấn một-một là gì?', options: ['Cho kết quả suy rộng ra tổng thể', 'Quan sát được phản ứng và động lực nhóm khi thảo luận cùng nhau', 'Không cần người điều phối', 'Luôn nhanh hơn khảo sát online'], correctIndex: 1, explanation: 'Focus group cho thấy tương tác, bất đồng và động lực nhóm khi nhiều người cùng phản ứng với một nội dung media — điều phỏng vấn một-một không thấy được.' },
  { id: 'q3', question: 'Grounded theory khác gì so với kiểm định một lý thuyết có sẵn?', options: ['Grounded theory bỏ qua dữ liệu, chỉ dùng lý thuyết cũ', 'Grounded theory xây lý thuyết từ dữ liệu, mã/phạm trù nổi lên trong lúc phân tích', 'Grounded theory chỉ áp dụng cho content analysis định lượng', 'Không có sự khác biệt'], correctIndex: 1, explanation: 'Grounded theory là hướng từ dưới lên: lý thuyết được xây dựng từ chính dữ liệu, khác với kiểm định một lý thuyết có sẵn từ trên xuống.' },
]);

/* ---------- Chương 6 — Nghiên cứu khán giả & khảo sát ---------- */
const c6 = doc('rmc301-6-1-audience-survey', '6.1 — Audience research & surveys|||6.1 — Nghiên cứu khán giả & khảo sát',
  'Thiết kế bảng hỏi & thang đo Likert; đo lường khán giả (rating, cross-platform); uses & gratifications trong khảo sát; sai lệch khảo sát (response bias, social desirability, non-response).',
  [[
    `<span class="eyebrow">RMC301 · Chapter 6 · Lesson 6.1</span>
<h2>Audience research &amp; surveys</h2>
<h3>Survey design</h3>
<p>A <strong>survey</strong> collects standardized answers from many respondents, letting you compare and generalize (with proper sampling). Attitudes and habits are usually measured with a <strong>Likert scale</strong> (e.g. "Strongly disagree" to "Strongly agree", 5 or 7 points), which turns subjective opinion into an analyzable number.</p>
<h3>Audience measurement</h3>
<ul>
<li><strong>Ratings</strong> — traditional TV audience measurement (Nielsen-style panels) estimating how many people watched a program.</li>
<li><strong>Cross-platform measurement</strong> — modern audience research must track a single audience across TV, streaming, and mobile, since viewing has fragmented across devices.</li>
<li><strong>Uses &amp; gratifications in surveys</strong> — asking WHY audiences use a medium (information-seeking, entertainment, social connection) rather than only how much.</li>
</ul>
<h3>Survey bias to watch for</h3>
<ul>
<li><strong>Response bias</strong> — question wording or order nudges answers in a direction.</li>
<li><strong>Social desirability bias</strong> — respondents answer to look good (e.g. under-reporting entertainment/tabloid consumption).</li>
<li><strong>Non-response bias</strong> — the people who skip the survey differ systematically from those who answer, skewing results.</li>
</ul>
<pre><code>Example Likert item:
 "I trust the news I get from social media."
 1 Strongly disagree · 2 Disagree · 3 Neutral · 4 Agree · 5 Strongly agree
</code></pre>
<div class="callout"><span class="badge">Sample matters more than size</span> A large but biased/non-random audience sample can be LESS trustworthy than a smaller, properly probability-sampled one.</div>`,
    `<span class="eyebrow">RMC301 · Chương 6 · Bài 6.1</span>
<h2>Nghiên cứu khán giả &amp; khảo sát</h2>
<h3>Thiết kế bảng hỏi</h3>
<p><strong>Khảo sát</strong> thu thập câu trả lời chuẩn hoá từ nhiều người, cho phép so sánh và suy rộng (nếu chọn mẫu đúng). Thái độ và thói quen thường được đo bằng <strong>thang đo Likert</strong> (vd "Hoàn toàn không đồng ý" đến "Hoàn toàn đồng ý", 5 hoặc 7 mức), biến ý kiến chủ quan thành con số phân tích được.</p>
<h3>Đo lường khán giả</h3>
<ul>
<li><strong>Rating</strong> — đo khán giả TV truyền thống (kiểu panel Nielsen) ước lượng số người xem một chương trình.</li>
<li><strong>Đo đa nền tảng (cross-platform)</strong> — nghiên cứu khán giả hiện đại phải theo dõi cùng một khán giả trên TV, streaming và mobile, vì việc xem đã phân tán qua nhiều thiết bị.</li>
<li><strong>Uses &amp; gratifications trong khảo sát</strong> — hỏi VÌ SAO khán giả dùng một phương tiện (tìm thông tin, giải trí, kết nối xã hội) chứ không chỉ hỏi dùng BAO NHIÊU.</li>
</ul>
<h3>Sai lệch khảo sát cần lưu ý</h3>
<ul>
<li><strong>Response bias</strong> — cách đặt câu hỏi hoặc thứ tự câu hỏi đẩy câu trả lời theo một hướng.</li>
<li><strong>Social desirability bias</strong> — người trả lời trả lời để trông tốt hơn (vd khai báo thấp việc xem tin giải trí/lá cải).</li>
<li><strong>Non-response bias</strong> — người bỏ qua khảo sát khác biệt hệ thống so với người trả lời, làm lệch kết quả.</li>
</ul>
<pre><code>Ví dụ câu hỏi Likert:
 "Tôi tin tưởng tin tức mình nhận được từ mạng xã hội."
 1 Hoàn toàn không đồng ý · 2 Không đồng ý · 3 Trung lập · 4 Đồng ý · 5 Hoàn toàn đồng ý
</code></pre>
<div class="callout"><span class="badge">Mẫu quan trọng hơn cỡ</span> Một mẫu khán giả lớn nhưng lệch/không ngẫu nhiên có thể KÉM tin cậy hơn một mẫu nhỏ nhưng chọn theo xác suất đúng cách.</div>`,
  ]]);

const c6q = quiz('rmc301-quiz-6', 'Quiz 6 — Audience research & survey|||Quiz 6 — Nghiên cứu khán giả & khảo sát', [
  { id: 'q1', question: 'Thang đo Likert dùng để đo điều gì trong khảo sát khán giả?', options: ['Số lượng bài báo xuất bản', 'Mức độ đồng ý/thái độ, biến ý kiến chủ quan thành số đo được', 'Doanh thu quảng cáo', 'Cỡ mẫu khảo sát'], correctIndex: 1, explanation: 'Likert scale đo mức độ đồng ý/thái độ trên một thang điểm, giúp phân tích định lượng ý kiến chủ quan.' },
  { id: 'q2', question: 'Social desirability bias trong khảo sát khán giả là gì?', options: ['Câu hỏi được đặt theo thứ tự ngẫu nhiên', 'Người trả lời trả lời để trông tốt hơn, không phản ánh đúng thói quen thật', 'Khán giả không biết đọc câu hỏi', 'Chỉ xảy ra với khảo sát TV, không với online'], correctIndex: 1, explanation: 'Social desirability bias là khi người trả lời chỉnh câu trả lời để trông tốt hơn, vd khai thấp việc xem nội dung giải trí/lá cải.' },
  { id: 'q3', question: 'Vì sao đo lường khán giả hiện đại cần "cross-platform measurement"?', options: ['Vì Nielsen panel đã ngừng hoạt động', 'Vì việc xem đã phân tán qua TV, streaming, mobile nên cần theo dõi cùng một khán giả trên nhiều nền tảng', 'Vì thang đo Likert không dùng được nữa', 'Vì focus group thay thế hoàn toàn khảo sát'], correctIndex: 1, explanation: 'Khán giả ngày nay xem nội dung qua nhiều thiết bị/nền tảng, nên đo lường phải theo dõi xuyên nền tảng để không đếm trùng hoặc bỏ sót.' },
]);

/* ---------- Chương 7 — Nghiên cứu media số & phân tích mạng xã hội ---------- */
const c7 = doc('rmc301-7-1-digital-social-analytics', '7.1 — Digital media research & social media analytics|||7.1 — Nghiên cứu media số & phân tích mạng xã hội',
  'Thu thập dữ liệu qua API/web scraping; phân tích mạng (influencer, virality, community detection); sentiment analysis & topic modeling; đạo đức dữ liệu số (quyền riêng tư, dữ liệu công khai vs cá nhân).',
  [[
    `<span class="eyebrow">RMC301 · Chapter 7 · Lesson 7.1</span>
<h2>Digital media research &amp; social media analytics</h2>
<h3>Collecting digital data</h3>
<p>Social media research often pulls large-scale data via a platform's <strong>API</strong> (structured, permitted access) or <strong>web scraping</strong> (extracting data directly from pages when no API access exists) — turning millions of public posts into an analyzable dataset instead of relying on self-reported survey answers.</p>
<h3>Network analysis</h3>
<p><strong>Network analysis</strong> maps who connects to, mentions, or shares content with whom — revealing <strong>influencers</strong> (highly connected nodes), <strong>virality</strong> (how fast/far content spreads through the network), and <strong>community detection</strong> (clusters of tightly connected users, e.g. echo chambers).</p>
<h3>Automated text analysis</h3>
<ul>
<li><strong>Sentiment analysis</strong> — automatically classifying text as positive/negative/neutral at scale (e.g. brand mentions during a PR crisis).</li>
<li><strong>Topic modeling (e.g. LDA)</strong> — an algorithm that discovers recurring themes/topics across a large body of text without pre-set categories.</li>
<li><strong>Text mining</strong> — the broader practice of extracting patterns from unstructured text data (posts, comments, reviews).</li>
</ul>
<h3>Ethics of digital data</h3>
<p>Even "public" posts raise ethical questions: a user posting publicly did not necessarily consent to being <em>studied</em>. Researchers must weigh <strong>public vs private</strong> expectations, avoid re-identifying individuals from aggregated data, and follow platform terms of service and applicable privacy regulation.</p>
<div class="callout"><span class="badge">Scale ≠ certainty</span> Millions of posts don't automatically mean a representative sample — platform user bases, bots, and algorithmic visibility all skew what you actually collect.</div>`,
    `<span class="eyebrow">RMC301 · Chương 7 · Bài 7.1</span>
<h2>Nghiên cứu media số &amp; phân tích mạng xã hội</h2>
<h3>Thu thập dữ liệu số</h3>
<p>Nghiên cứu mạng xã hội thường lấy dữ liệu quy mô lớn qua <strong>API</strong> của nền tảng (truy cập có cấu trúc, được cho phép) hoặc <strong>web scraping</strong> (trích xuất dữ liệu trực tiếp từ trang khi không có API) — biến hàng triệu bài đăng công khai thành tập dữ liệu phân tích được, thay vì chỉ dựa vào câu trả lời tự khai trong khảo sát.</p>
<h3>Phân tích mạng</h3>
<p><strong>Phân tích mạng (network analysis)</strong> vẽ ra ai kết nối, nhắc đến, hoặc chia sẻ nội dung với ai — lộ ra <strong>influencer</strong> (nút kết nối cao), <strong>virality</strong> (nội dung lan nhanh/rộng thế nào qua mạng), và <strong>community detection</strong> (các cụm người dùng kết nối chặt, vd buồng vọng âm/echo chamber).</p>
<h3>Phân tích văn bản tự động</h3>
<ul>
<li><strong>Sentiment analysis</strong> — tự động phân loại văn bản tích cực/tiêu cực/trung tính ở quy mô lớn (vd nhắc đến thương hiệu trong khủng hoảng PR).</li>
<li><strong>Topic modeling (vd LDA)</strong> — thuật toán phát hiện các chủ đề lặp lại trong một lượng lớn văn bản mà không cần đặt phạm trù trước.</li>
<li><strong>Text mining</strong> — thực hành rộng hơn: trích xuất khuôn mẫu từ dữ liệu văn bản không cấu trúc (bài đăng, bình luận, đánh giá).</li>
</ul>
<h3>Đạo đức dữ liệu số</h3>
<p>Ngay cả bài đăng "công khai" cũng đặt ra câu hỏi đạo đức: người đăng công khai không hẳn đã đồng ý bị <em>nghiên cứu</em>. Nhà nghiên cứu phải cân nhắc kỳ vọng <strong>công khai vs riêng tư</strong>, tránh nhận diện lại cá nhân từ dữ liệu tổng hợp, và tuân theo điều khoản dịch vụ của nền tảng cùng quy định về quyền riêng tư liên quan.</p>
<div class="callout"><span class="badge">Quy mô ≠ chắc chắn</span> Hàng triệu bài đăng không tự động nghĩa là mẫu đại diện — cơ sở người dùng của nền tảng, bot, và khả năng hiển thị theo thuật toán đều làm lệch những gì bạn thực sự thu thập được.</div>`,
  ]]);

const c7q = quiz('rmc301-quiz-7', 'Quiz 7 — Digital & social media analytics|||Quiz 7 — Phân tích media số & mạng xã hội', [
  { id: 'q1', question: 'Network analysis trong nghiên cứu mạng xã hội giúp phát hiện điều gì?', options: ['Thang đo Likert của khảo sát', 'Influencer, mức lan truyền (virality), và cụm cộng đồng kết nối chặt', 'Codebook cho content analysis', 'Cỡ mẫu tối thiểu cần thiết'], correctIndex: 1, explanation: 'Network analysis vẽ ra quan hệ kết nối/chia sẻ giữa người dùng, lộ ra influencer, virality, và community detection.' },
  { id: 'q2', question: 'Topic modeling (vd LDA) khác gì so với content analysis mã hoá tay theo codebook?', options: ['Không khác gì cả', 'Topic modeling tự động phát hiện chủ đề mà không cần đặt phạm trù trước', 'Topic modeling chỉ dùng được cho khảo sát', 'Topic modeling thay thế hoàn toàn phân tích mạng'], correctIndex: 1, explanation: 'Topic modeling là thuật toán tự động khám phá chủ đề lặp lại trong văn bản, khác với content analysis mã hoá tay theo codebook định sẵn.' },
  { id: 'q3', question: 'Vì sao bài đăng "công khai" trên mạng xã hội vẫn đặt ra vấn đề đạo đức khi nghiên cứu?', options: ['Vì nền tảng luôn xoá dữ liệu công khai sau 24 giờ', 'Vì người đăng công khai không hẳn đã đồng ý bị nghiên cứu, và dữ liệu có thể bị nhận diện lại', 'Vì bài đăng công khai không thể thu thập được', 'Vì chỉ áp dụng cho phỏng vấn sâu'], correctIndex: 1, explanation: 'Đăng công khai không đồng nghĩa với đồng ý được nghiên cứu; cần cân nhắc kỳ vọng riêng tư và tránh nhận diện lại cá nhân từ dữ liệu.' },
]);

/* ---------- Chương 8 — Phân tích, diễn giải & viết báo cáo nghiên cứu truyền thông ---------- */
const c8 = doc('rmc301-8-1-analysis-report-writing', '8.1 — Analysis, interpretation & writing the communication research report|||8.1 — Phân tích, diễn giải & viết báo cáo nghiên cứu truyền thông',
  'Thống kê cơ bản (mô tả, t-test, chi-square, tương quan) cho dữ liệu truyền thông; diễn giải gắn lý thuyết & bối cảnh; cấu trúc báo cáo IMRaD; trình bày dữ liệu & trích dẫn APA.',
  [[
    `<span class="eyebrow">RMC301 · Chapter 8 · Lesson 8.1</span>
<h2>Analysis, interpretation &amp; report writing</h2>
<h3>Basic statistics for communication data</h3>
<ul>
<li><strong>Descriptive statistics</strong> — frequencies, means, percentages (e.g. "62% of prime-time ads used an emotional appeal").</li>
<li><strong>Chi-square test</strong> — compares category frequencies (e.g. does tone of coverage differ by outlet?).</li>
<li><strong>T-test</strong> — compares means between two groups (e.g. average perceived credibility: social media news vs traditional news).</li>
<li><strong>Correlation</strong> — measures how strongly two variables move together (e.g. media exposure and perceived crime risk), without proving causation on its own.</li>
</ul>
<h3>Interpreting results</h3>
<p>A number alone means little — interpretation ties results back to <strong>theory</strong> (does this support or challenge cultivation theory?) and to real-world <strong>context</strong> (what changed in the media landscape during data collection?). A statistically significant result is not automatically a practically important one.</p>
<h3>Report structure (IMRaD)</h3>
<pre><code>Introduction  -> the problem, why it matters, research question(s)
Method        -> design, sample, measures, procedure (so it can be replicated)
Results       -> what the data show, without interpretation yet
Discussion    -> what it means, ties to theory, limitations, implications
</code></pre>
<h3>Presenting data &amp; citing sources</h3>
<p>Use tables/charts for quantitative patterns and direct quotes for qualitative findings — each should earn its place, not just decorate. Cite every source, including your own literature review, consistently (commonly <strong>APA style</strong> in communication research) to avoid plagiarism and let readers trace claims back to evidence.</p>
<div class="callout"><span class="badge">Full circle</span> The report closes the loop back to Chapter 1 &amp; 2: the research question you started with should be answered — or honestly shown as unanswered — by the end.</div>`,
    `<span class="eyebrow">RMC301 · Chương 8 · Bài 8.1</span>
<h2>Phân tích, diễn giải &amp; viết báo cáo</h2>
<h3>Thống kê cơ bản cho dữ liệu truyền thông</h3>
<ul>
<li><strong>Thống kê mô tả</strong> — tần suất, trung bình, tỉ lệ phần trăm (vd "62% quảng cáo giờ vàng dùng thu hút cảm xúc").</li>
<li><strong>Kiểm định chi-square</strong> — so sánh tần suất giữa các phạm trù (vd tông đưa tin có khác nhau giữa các báo không?).</li>
<li><strong>Kiểm định t (t-test)</strong> — so sánh trung bình giữa hai nhóm (vd độ tin cậy cảm nhận trung bình: tin trên mạng xã hội vs tin truyền thống).</li>
<li><strong>Tương quan (correlation)</strong> — đo mức độ hai biến biến đổi cùng nhau (vd mức tiếp xúc media và cảm nhận nguy cơ tội phạm), nhưng bản thân nó KHÔNG chứng minh nhân quả.</li>
</ul>
<h3>Diễn giải kết quả</h3>
<p>Một con số đơn lẻ không nói lên nhiều — diễn giải phải gắn kết quả lại với <strong>lý thuyết</strong> (kết quả này ủng hộ hay phản biện cultivation theory?) và với <strong>bối cảnh thực tế</strong> (điều gì đã thay đổi trong bối cảnh media lúc thu thập dữ liệu?). Một kết quả có ý nghĩa thống kê không tự động là một kết quả quan trọng trong thực tế.</p>
<h3>Cấu trúc báo cáo (IMRaD)</h3>
<pre><code>Introduction (Mở đầu) -> vấn đề, vì sao quan trọng, câu hỏi nghiên cứu
Method (Phương pháp)  -> thiết kế, mẫu, cách đo, quy trình (để lặp lại được)
Results (Kết quả)     -> dữ liệu cho thấy gì, chưa diễn giải
Discussion (Thảo luận) -> nghĩa là gì, gắn lý thuyết, hạn chế, ý nghĩa
</code></pre>
<h3>Trình bày dữ liệu &amp; trích dẫn</h3>
<p>Dùng bảng/biểu đồ cho khuôn mẫu định lượng và trích dẫn trực tiếp cho phát hiện định tính — mỗi thứ phải xứng đáng có mặt, không chỉ để trang trí. Trích dẫn mọi nguồn, kể cả tổng quan tài liệu của chính mình, một cách nhất quán (thường theo <strong>chuẩn APA</strong> trong nghiên cứu truyền thông) để tránh đạo văn và giúp người đọc truy lại bằng chứng.</p>
<div class="callout"><span class="badge">Vòng khép kín</span> Báo cáo khép lại vòng quay về Chương 1 &amp; 2: câu hỏi nghiên cứu ban đầu phải được trả lời — hoặc được nêu rõ là chưa trả lời được — ở phần cuối.</div>`,
  ]]);

const c8q = quiz('rmc301-quiz-8', 'Quiz 8 — Analysis & report writing|||Quiz 8 — Phân tích & viết báo cáo', [
  { id: 'q1', question: 'Tương quan (correlation) giữa hai biến truyền thông cho biết điều gì?', options: ['Chứng minh chắc chắn quan hệ nhân quả', 'Mức độ hai biến biến đổi cùng nhau, không tự chứng minh nhân quả', 'Cỡ mẫu khảo sát', 'Codebook đã đủ tin cậy'], correctIndex: 1, explanation: 'Tương quan đo mức độ hai biến đi cùng nhau nhưng không chứng minh được nhân quả — cần thiết kế thực nghiệm cho điều đó.' },
  { id: 'q2', question: 'Trong cấu trúc báo cáo IMRaD, phần "Results" nên chứa gì?', options: ['Diễn giải ý nghĩa và hạn chế của nghiên cứu', 'Dữ liệu cho thấy gì, CHƯA diễn giải', 'Câu hỏi nghiên cứu ban đầu', 'Danh sách tài liệu tham khảo'], correctIndex: 1, explanation: 'Results trình bày dữ liệu/kết quả thuần, việc diễn giải ý nghĩa thuộc về phần Discussion.' },
  { id: 'q3', question: 'Một kết quả có ý nghĩa thống kê (statistically significant) thì có luôn quan trọng trong thực tế không?', options: ['Có, luôn luôn quan trọng', 'Không nhất thiết — ý nghĩa thống kê khác với ý nghĩa thực tế', 'Chỉ đúng với content analysis', 'Chỉ đúng khi cỡ mẫu nhỏ'], correctIndex: 1, explanation: 'Ý nghĩa thống kê không tự động đồng nghĩa với tầm quan trọng thực tế — cần diễn giải trong bối cảnh và lý thuyết.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'RMC301',
    slug: 'rmc301-research-methods-in-communication',
    title: 'Research methods in Communication',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/RMC301.webp',
    shortDescription: 'How to research media: theory (agenda-setting, framing, cultivation), content analysis, qualitative methods (discourse, interviews, focus groups), audience surveys & social analytics, ethics, report writing. Bilingual, quizzes.|||Cách nghiên cứu media: lý thuyết (agenda-setting, framing, cultivation), phân tích nội dung, định tính (diễn ngôn, phỏng vấn, focus group), khảo sát khán giả & phân tích mạng xã hội, đạo đức, viết báo cáo. Song ngữ, có quiz.',
    description: 'Môn <strong>RMC301 — Research Methods in Communication</strong> (kỳ 3, khối Quản trị Kinh doanh — chuyên ngành Truyền thông) dạy cách nghiên cứu <strong>media &amp; truyền thông</strong> một cách khoa học — khác nghiên cứu kinh doanh tổng quát (REM301) hay định lượng (RMB302). Từ <strong>vấn đề nghiên cứu &amp; lý thuyết truyền thông</strong> (agenda-setting, framing, cultivation, uses &amp; gratifications) → <strong>thiết kế &amp; đạo đức</strong> → <strong>phân tích nội dung định lượng</strong> (content analysis, intercoder reliability) → <strong>phương pháp định tính</strong> (phân tích diễn ngôn, phỏng vấn sâu, focus group) → <strong>nghiên cứu khán giả &amp; khảo sát</strong> → <strong>phân tích media số &amp; mạng xã hội</strong> (network analysis, sentiment, topic modeling) → <strong>phân tích, diễn giải &amp; viết báo cáo</strong> (IMRaD). Tham khảo Hansen, Neuendorf, Berger. Song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Vai trò nghiên cứu truyền thông (học thuật vs ứng dụng); lý thuyết truyền thông (agenda-setting, framing, cultivation, uses & gratifications, spiral of silence); câu hỏi nghiên cứu, giả thuyết, tổng quan tài liệu, biến & đo lường hoá; thiết kế nghiên cứu (mô tả/tương quan/thực nghiệm), độ tin cậy & độ giá trị, chọn mẫu, đạo đức (informed consent, IRB); phân tích nội dung định lượng (codebook, intercoder reliability); phân tích diễn ngôn, phỏng vấn sâu, focus group, thematic coding; khảo sát & đo lường khán giả (Likert, rating, cross-platform), sai lệch khảo sát; phân tích media số & mạng xã hội (API/scraping, network analysis, sentiment, topic modeling); thống kê cơ bản (t-test, chi-square, tương quan) & viết báo cáo IMRaD.',
    requirements: 'Không yêu cầu kiến thức thống kê nâng cao. Nên đã học/biết khái niệm truyền thông đại chúng cơ bản; đọc tiếng Anh học thuật ở mức trung bình để tra tài liệu tham khảo.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách tham khảo (Hansen, Neuendorf, Berger), giáo trình trên FLM, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nghiên cứu truyền thông là gì, khác gì nghiên cứu kinh doanh tổng quát.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & vai trò|||Chapter 1 — Overview & role', description: 'Nghiên cứu truyền thông, học thuật vs ứng dụng, quy trình.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Vấn đề, lý thuyết & tổng quan tài liệu|||Chapter 2 — Problem, theory & literature review', description: 'Agenda-setting, framing, cultivation, biến & đo lường hoá.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thiết kế & đạo đức|||Chapter 3 — Design & ethics', description: 'Thực nghiệm/tương quan, độ tin cậy/độ giá trị, chọn mẫu, đạo đức.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phân tích nội dung định lượng|||Chapter 4 — Quantitative content analysis', description: 'Codebook, intercoder reliability, ứng dụng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nghiên cứu định tính|||Chapter 5 — Qualitative research', description: 'Diễn ngôn, phỏng vấn sâu, focus group, thematic coding.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nghiên cứu khán giả & khảo sát|||Chapter 6 — Audience research & survey', description: 'Likert, đo lường khán giả, sai lệch khảo sát.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Media số & mạng xã hội|||Chapter 7 — Digital & social media analytics', description: 'API/scraping, network analysis, sentiment, topic modeling.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Phân tích & viết báo cáo|||Chapter 8 — Analysis & report writing', description: 'Thống kê cơ bản, diễn giải, cấu trúc IMRaD, trích dẫn.', lessons: [c8, c8q] },
  ],
};
