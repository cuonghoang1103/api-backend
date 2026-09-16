/**
 * JLR302 — Research Method (Phương pháp Nghiên cứu Khoa học), ngành Ngôn ngữ
 * Nhật, FPTU Kỳ 7. Trích dẫn giáo trình (KHÔNG upload PDF): "Research Methods
 * in Linguistics" (Litosseliti), "Doing Applied Linguistics Research",
 * 「日本語研究の方法」. 8 chương, mỗi chương 1 DOCUMENT + 1 QUIZ.
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('jlr302-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo (Litosseliti, Doing Applied Linguistics Research, 日本語研究の方法), nguồn tra cứu tiếng Nhật (CiNii, J-STAGE, BCCWJ), hướng dẫn trích dẫn APA.',
  [[
    `<span class="eyebrow">JLR302 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Research Method for Japanese Studies majors — from research design to thesis writing. The official FPTU syllabus &amp; slides live on <strong>FLM</strong>; below are the reference textbooks and free tools this course draws on.</p>
<h3>📘 Reference textbooks (cited, not uploaded)</h3>
<ul>
<li><em>Research Methods in Linguistics</em> — Lia Litosseliti (ed.). Core reference for qualitative/quantitative design and data collection in language research.</li>
<li><em>Doing Applied Linguistics Research</em> — a practical guide to research questions, ethics and write-up for applied/language studies.</li>
<li><em>日本語研究の方法</em> (Methods of Japanese Language Research) — methodology reference specific to Japanese linguistics and corpus work.</li>
</ul>
<h3>🌐 Free tools &amp; databases</h3>
<ul>
<li><a href="https://scholar.google.com/" target="_blank" rel="noopener">Google Scholar</a> — general academic search.</li>
<li><a href="https://cir.nii.ac.jp/" target="_blank" rel="noopener">CiNii Research</a> — Japanese academic articles &amp; theses database.</li>
<li><a href="https://www.jstage.jst.go.jp/" target="_blank" rel="noopener">J-STAGE</a> — Japanese scientific journals, many free full-text.</li>
<li><a href="https://clrd.ninjal.ac.jp/bccwj/en/" target="_blank" rel="noopener">BCCWJ — Balanced Corpus of Contemporary Written Japanese</a> — reference corpus, 日本語コーパス.</li>
<li><a href="https://owl.purdue.edu/owl/research_and_citation/apa_style/apa_formatting_and_style_guide/general_format.html" target="_blank" rel="noopener">Purdue OWL — APA Style Guide</a> — citation format used in this course.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what research is, research questions, literature review.</li>
<li><strong>Design</strong> — qualitative vs quantitative, data collection methods.</li>
<li><strong>Analysis</strong> — coding, basic statistics, contrastive Japanese-Vietnamese study.</li>
<li><strong>Write-up</strong> — proposal, IMRaD thesis structure, APA citation, ethics, defense.</li>
</ol></div>`,
    `<span class="eyebrow">JLR302 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Phương pháp nghiên cứu khoa học cho SV ngành Ngôn ngữ Nhật — từ thiết kế nghiên cứu tới viết khoá luận. Giáo trình &amp; slide chính thức của trường nằm trên <strong>FLM</strong>; bên dưới là các sách tham khảo và công cụ miễn phí môn này dựa vào.</p>
<h3>📘 Sách tham khảo (trích dẫn, không upload)</h3>
<ul>
<li><em>Research Methods in Linguistics</em> — Lia Litosseliti (chủ biên). Tài liệu nền cho thiết kế định tính/định lượng và thu thập dữ liệu ngôn ngữ.</li>
<li><em>Doing Applied Linguistics Research</em> — hướng dẫn thực hành đặt câu hỏi nghiên cứu, đạo đức và viết báo cáo cho nghiên cứu ứng dụng ngôn ngữ.</li>
<li>「日本語研究の方法」(Phương pháp nghiên cứu tiếng Nhật) — tài liệu phương pháp luận riêng cho ngôn ngữ học tiếng Nhật và làm việc với corpus.</li>
</ul>
<h3>🌐 Công cụ &amp; cơ sở dữ liệu miễn phí</h3>
<ul>
<li><a href="https://scholar.google.com/" target="_blank" rel="noopener">Google Scholar</a> — tra cứu học thuật tổng quát.</li>
<li><a href="https://cir.nii.ac.jp/" target="_blank" rel="noopener">CiNii Research</a> — cơ sở dữ liệu bài báo &amp; luận văn tiếng Nhật.</li>
<li><a href="https://www.jstage.jst.go.jp/" target="_blank" rel="noopener">J-STAGE</a> — tạp chí khoa học Nhật Bản, nhiều bài đọc miễn phí.</li>
<li><a href="https://clrd.ninjal.ac.jp/bccwj/en/" target="_blank" rel="noopener">BCCWJ — Balanced Corpus of Contemporary Written Japanese</a> — corpus tham chiếu, 日本語コーパス.</li>
<li><a href="https://owl.purdue.edu/owl/research_and_citation/apa_style/apa_formatting_and_style_guide/general_format.html" target="_blank" rel="noopener">Purdue OWL — Hướng dẫn APA</a> — chuẩn trích dẫn dùng trong môn này.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — nghiên cứu khoa học là gì, câu hỏi nghiên cứu, tổng quan tài liệu.</li>
<li><strong>Thiết kế</strong> — định tính vs định lượng, phương pháp thu thập dữ liệu.</li>
<li><strong>Phân tích</strong> — mã hoá dữ liệu, thống kê cơ bản, đối chiếu Nhật-Việt.</li>
<li><strong>Viết</strong> — đề cương, cấu trúc IMRaD, trích dẫn APA, đạo đức, bảo vệ.</li>
</ol></div>`,
  ]]);

const c1 = doc('jlr302-1-1-tong-quan', '1.1 — Scientific research & language research overview|||1.1 — Tổng quan nghiên cứu khoa học & nghiên cứu ngôn ngữ',
  'Nghiên cứu khoa học là gì, đặc điểm (khách quan, hệ thống, kiểm chứng được); nghiên cứu cơ bản vs ứng dụng; đối tượng đặc thù của nghiên cứu ngôn ngữ; quy trình nghiên cứu 6 bước; ví dụ đề tài tiếng Nhật.',
  [[
    `<span class="eyebrow">JLR302 · Chapter 1 · Lesson 1.1</span>
<h2>What is scientific research?</h2>
<p class="lead">Scientific research is a <strong>systematic, objective, and verifiable</strong> process of answering a question or solving a problem — different from opinion or casual observation because every claim must be backed by evidence others can check.</p>
<h3>Three defining traits</h3>
<ul>
<li><strong>Systematic</strong> — follows a planned procedure, not random exploration.</li>
<li><strong>Objective</strong> — conclusions come from data, not the researcher's bias.</li>
<li><strong>Verifiable</strong> — another researcher can repeat the method and check the result.</li>
</ul>
<h3>Basic vs applied research</h3>
<p><strong>Basic research</strong> builds theory (e.g. how honorific systems evolve historically). <strong>Applied research</strong> solves a practical problem (e.g. why Vietnamese learners of Japanese misuse keigo 敬語 in job interviews). Most undergraduate theses in Japanese Studies are applied.</p>
<h3>What makes language research different</h3>
<p>The object of study is <strong>language itself</strong> — sounds (phonetics/phonology), words (lexicology), grammar (syntax), meaning (semantics/pragmatics), and language-in-society (sociolinguistics). For Japanese Studies students, this usually means studying Japanese structure, Japanese-Vietnamese contrast, translation, or how Japanese is taught/learned (日本語教育).</p>
<h3>The 6-step research process</h3>
<pre><code>1. Chọn chủ đề / đề tài
2. Đặt câu hỏi nghiên cứu (Research Question)
3. Thiết kế nghiên cứu (định tính / định lượng / hỗn hợp)
4. Thu thập dữ liệu
5. Phân tích dữ liệu
6. Viết báo cáo và trình bày / bảo vệ
</code></pre>
<div class="callout"><span class="badge">Example topics</span> "Sự biến đổi cách dùng kính ngữ (敬語, keigo) của giới trẻ Nhật Bản trên mạng xã hội", "Ảnh hưởng của từ ngoại lai (外来語, gairaigo) đến từ vựng tiếng Nhật hiện đại", "Khó khăn của sinh viên Việt Nam khi học trợ từ tiếng Nhật (助詞, joshi)".</div>`,
    `<span class="eyebrow">JLR302 · Chương 1 · Bài 1.1</span>
<h2>Nghiên cứu khoa học là gì?</h2>
<p class="lead">Nghiên cứu khoa học là quá trình trả lời một câu hỏi hoặc giải quyết một vấn đề một cách <strong>hệ thống, khách quan và kiểm chứng được</strong> — khác với ý kiến cá nhân hay quan sát tuỳ tiện vì mọi kết luận đều phải có bằng chứng người khác kiểm tra lại được.</p>
<h3>Ba đặc điểm cốt lõi</h3>
<ul>
<li><strong>Hệ thống</strong> — theo một quy trình có kế hoạch, không khám phá ngẫu nhiên.</li>
<li><strong>Khách quan</strong> — kết luận đến từ dữ liệu, không phải định kiến người nghiên cứu.</li>
<li><strong>Kiểm chứng được</strong> — người khác lặp lại phương pháp và kiểm tra được kết quả.</li>
</ul>
<h3>Nghiên cứu cơ bản vs ứng dụng</h3>
<p><strong>Nghiên cứu cơ bản</strong> xây dựng lý thuyết (vd hệ thống kính ngữ biến đổi thế nào theo lịch sử). <strong>Nghiên cứu ứng dụng</strong> giải quyết vấn đề thực tế (vd vì sao sinh viên Việt Nam học tiếng Nhật dùng sai kính ngữ 敬語 khi phỏng vấn xin việc). Đa số khoá luận đại học ngành Ngôn ngữ Nhật thuộc loại ứng dụng.</p>
<h3>Điều gì làm nghiên cứu ngôn ngữ khác biệt</h3>
<p>Đối tượng nghiên cứu là <strong>chính bản thân ngôn ngữ</strong> — âm (ngữ âm/âm vị học), từ (từ vựng học), ngữ pháp (cú pháp), nghĩa (ngữ nghĩa/ngữ dụng), và ngôn ngữ trong xã hội (ngôn ngữ học xã hội). Với sinh viên Ngôn ngữ Nhật, thường là nghiên cứu cấu trúc tiếng Nhật, đối chiếu Nhật-Việt, dịch thuật, hoặc giảng dạy tiếng Nhật (日本語教育).</p>
<h3>Quy trình nghiên cứu 6 bước</h3>
<pre><code>1. Chọn chủ đề / đề tài
2. Đặt câu hỏi nghiên cứu (Research Question)
3. Thiết kế nghiên cứu (định tính / định lượng / hỗn hợp)
4. Thu thập dữ liệu
5. Phân tích dữ liệu
6. Viết báo cáo và trình bày / bảo vệ
</code></pre>
<div class="callout"><span class="badge">Ví dụ đề tài</span> "Sự biến đổi cách dùng kính ngữ (敬語, keigo) của giới trẻ Nhật Bản trên mạng xã hội", "Ảnh hưởng của từ ngoại lai (外来語, gairaigo) đến từ vựng tiếng Nhật hiện đại", "Khó khăn của sinh viên Việt Nam khi học trợ từ tiếng Nhật (助詞, joshi)".</div>`,
  ]]);

const c1q = quiz('jlr302-quiz-1', 'Quiz 1 — Research overview|||Quiz 1 — Tổng quan nghiên cứu', [
  { id: 'q1', question: 'Ba đặc điểm cốt lõi của nghiên cứu khoa học là gì?', options: ['Nhanh, rẻ, dễ', 'Hệ thống, khách quan, kiểm chứng được', 'Sáng tạo, cảm tính, cá nhân', 'Bí mật, không công bố, không lặp lại'], correctIndex: 1, explanation: 'Nghiên cứu khoa học phải hệ thống, khách quan (dựa trên dữ liệu) và kiểm chứng được (người khác lặp lại được).' },
  { id: 'q2', question: 'Đề tài "Vì sao sinh viên Việt Nam dùng sai kính ngữ khi phỏng vấn xin việc" thuộc loại nghiên cứu nào?', options: ['Nghiên cứu cơ bản', 'Nghiên cứu ứng dụng', 'Không phải nghiên cứu khoa học', 'Nghiên cứu định lượng thuần tuý'], correctIndex: 1, explanation: 'Đây là nghiên cứu ứng dụng vì giải quyết một vấn đề thực tế cụ thể, khác với xây dựng lý thuyết tổng quát.' },
  { id: 'q3', question: 'Bước nào đến NGAY SAU khi chọn chủ đề trong quy trình 6 bước?', options: ['Thu thập dữ liệu', 'Phân tích dữ liệu', 'Đặt câu hỏi nghiên cứu', 'Bảo vệ khoá luận'], correctIndex: 2, explanation: 'Sau khi chọn chủ đề, bước tiếp theo là thu hẹp thành câu hỏi nghiên cứu (Research Question) cụ thể.' },
]);

const c2 = doc('jlr302-2-1-van-de-tong-quan', '2.1 — Research problem, questions & literature review|||2.1 — Xác định vấn đề, câu hỏi NC & tổng quan tài liệu',
  'Từ chủ đề rộng thành research problem cụ thể; tiêu chí câu hỏi nghiên cứu tốt; khoảng trống nghiên cứu (research gap); cách tìm và tổng hợp tài liệu (Google Scholar, CiNii, J-STAGE).',
  [[
    `<span class="eyebrow">JLR302 · Chapter 2 · Lesson 2.1</span>
<h2>From topic to research question</h2>
<h3>Narrowing a broad topic</h3>
<p>A topic like "keigo 敬語" is too broad to research directly. Narrow it by asking <strong>who, what context, and what angle</strong>: "How do Vietnamese employees at Japanese companies in Vietnam use keigo with their superiors?" is researchable — specific population, context, and focus.</p>
<h3>What makes a good research question</h3>
<ul>
<li><strong>Clear</strong> — no vague terms; anyone reading it understands exactly what is being asked.</li>
<li><strong>Focused</strong> — narrow enough to answer within the time/resources of a thesis.</li>
<li><strong>Researchable</strong> — data to answer it can actually be collected.</li>
<li><strong>Significant</strong> — the answer matters to teaching, translation, or intercultural communication.</li>
</ul>
<h3>Finding the research gap</h3>
<p>A <strong>literature review</strong> reads what others already found on your topic, so you can locate the <strong>gap</strong> — what is still unanswered, under-studied for Vietnamese learners specifically, or contradictory between studies. Your thesis should fill that gap, not repeat what is already well established.</p>
<h3>Where to search</h3>
<pre><code>Chủ đề rộng: 敬語 (keigo)
 -> Google Scholar: "keigo" + "Vietnamese learners"
 -> CiNii Research: 敬語 習得 ベトナム人学習者
 -> J-STAGE: bài báo tiếng Nhật đã bình duyệt
 -> Tổng hợp theo CHỦ ĐỀ (không phải liệt kê từng bài) -> tìm khoảng trống
</code></pre>
<div class="callout"><span class="badge">Common mistake</span> Summarizing sources one by one ("Paper A said... Paper B said...") is NOT a literature review. Group findings by theme and compare/contrast them — that is what reveals the gap.</div>`,
    `<span class="eyebrow">JLR302 · Chương 2 · Bài 2.1</span>
<h2>Từ chủ đề đến câu hỏi nghiên cứu</h2>
<h3>Thu hẹp một chủ đề rộng</h3>
<p>Một chủ đề như "kính ngữ 敬語" quá rộng để nghiên cứu trực tiếp. Thu hẹp bằng cách hỏi <strong>ai, trong bối cảnh nào, ở góc độ nào</strong>: "Nhân viên người Việt tại công ty Nhật ở Việt Nam dùng kính ngữ với cấp trên như thế nào?" là câu hỏi nghiên cứu được — có đối tượng, bối cảnh và trọng tâm cụ thể.</p>
<h3>Tiêu chí một câu hỏi nghiên cứu tốt</h3>
<ul>
<li><strong>Rõ ràng</strong> — không mơ hồ; ai đọc cũng hiểu chính xác đang hỏi gì.</li>
<li><strong>Tập trung</strong> — đủ hẹp để trả lời được trong thời gian/nguồn lực của một khoá luận.</li>
<li><strong>Có thể nghiên cứu được</strong> — dữ liệu để trả lời thực sự thu thập được.</li>
<li><strong>Có ý nghĩa</strong> — câu trả lời có giá trị cho giảng dạy, dịch thuật, hoặc giao tiếp liên văn hoá.</li>
</ul>
<h3>Tìm khoảng trống nghiên cứu</h3>
<p><strong>Tổng quan tài liệu</strong> là đọc những gì người khác đã tìm ra về chủ đề của bạn, để xác định <strong>khoảng trống (gap)</strong> — điều gì chưa được trả lời, chưa được nghiên cứu cho riêng người học Việt Nam, hoặc các nghiên cứu mâu thuẫn nhau. Khoá luận của bạn nên lấp khoảng trống đó, không lặp lại điều đã rõ.</p>
<h3>Tìm tài liệu ở đâu</h3>
<pre><code>Chủ đề rộng: 敬語 (keigo)
 -> Google Scholar: "keigo" + "Vietnamese learners"
 -> CiNii Research: 敬語 習得 ベトナム人学習者
 -> J-STAGE: bài báo tiếng Nhật đã bình duyệt
 -> Tổng hợp theo CHỦ ĐỀ (không phải liệt kê từng bài) -> tìm khoảng trống
</code></pre>
<div class="callout"><span class="badge">Lỗi thường gặp</span> Tóm tắt từng nguồn một ("Bài A nói... Bài B nói...") KHÔNG phải tổng quan tài liệu. Phải nhóm phát hiện theo chủ đề rồi so sánh/đối chiếu — đó mới là cách lộ ra khoảng trống.</div>`,
  ]]);

const c2q = quiz('jlr302-quiz-2', 'Quiz 2 — Research question & literature review|||Quiz 2 — Câu hỏi NC & tổng quan tài liệu', [
  { id: 'q1', question: '"Kính ngữ 敬語" đơn thuần là một chủ đề tốt để làm câu hỏi nghiên cứu không?', options: ['Có, đã đủ cụ thể', 'Không, cần thu hẹp theo đối tượng/bối cảnh/góc độ', 'Có, vì càng rộng càng dễ nghiên cứu', 'Không liên quan đến nghiên cứu ngôn ngữ'], correctIndex: 1, explanation: 'Chủ đề rộng cần thu hẹp thành câu hỏi cụ thể (ai, bối cảnh nào, góc độ nào) mới nghiên cứu được.' },
  { id: 'q2', question: 'Mục đích chính của tổng quan tài liệu là gì?', options: ['Liệt kê càng nhiều bài báo càng tốt', 'Tìm khoảng trống nghiên cứu (research gap)', 'Chứng minh người viết đọc nhiều sách', 'Thay thế cho việc thu thập dữ liệu'], correctIndex: 1, explanation: 'Tổng quan tài liệu giúp xác định điều gì chưa được nghiên cứu, để khoá luận lấp đúng khoảng trống đó.' },
  { id: 'q3', question: 'Vì sao tóm tắt tuần tự "Bài A nói... Bài B nói..." KHÔNG được xem là tổng quan tài liệu tốt?', options: ['Vì thiếu tổng hợp/so sánh theo chủ đề để lộ ra khoảng trống', 'Vì phải viết bằng tiếng Nhật', 'Vì không được trích dẫn nguồn', 'Vì quá ngắn'], correctIndex: 0, explanation: 'Tổng quan tài liệu tốt nhóm phát hiện theo chủ đề và so sánh/đối chiếu, chứ không liệt kê rời rạc từng bài.' },
]);

const c3 = doc('jlr302-3-1-dinh-tinh-dinh-luong', '3.1 — Qualitative vs quantitative research design|||3.1 — Thiết kế nghiên cứu định tính vs định lượng',
  'So sánh triết lý, mục tiêu, dữ liệu, phân tích của nghiên cứu định tính và định lượng; khi nào dùng loại nào; nghiên cứu hỗn hợp (mixed methods).',
  [[
    `<span class="eyebrow">JLR302 · Chapter 3 · Lesson 3.1</span>
<h2>Qualitative vs quantitative design</h2>
<h3>Two different goals</h3>
<p><strong>Quantitative research</strong> asks "how much / how often / is there a significant difference" — it measures variables numerically and generalizes to a population. <strong>Qualitative research</strong> asks "why / how / what does this mean" — it explores meaning, context and experience in depth, usually with a small number of cases.</p>
<pre><code>                Qualitative              Quantitative
Goal            Understand meaning       Measure & generalize
Data            Words, text, interview   Numbers, scores, counts
Sample size     Small, in-depth          Large, representative
Analysis        Coding, themes           Statistics
Example Q       "How do learners FEEL    "What PERCENTAGE of learners
                 about using keigo?"      misuse keigo forms?"
</code></pre>
<h3>Choosing a design</h3>
<p>Use <strong>qualitative</strong> when you need rich, contextual understanding of a small group (e.g. interviewing 8 Japanese-major seniors about their keigo anxiety). Use <strong>quantitative</strong> when you need to measure a pattern across many people (e.g. a 200-respondent survey on keigo error frequency by grade level). <strong>Mixed methods</strong> combines both — e.g. a survey (quantitative) followed by interviews with outlier respondents (qualitative) to explain the numbers.</p>
<div class="callout"><span class="badge">Match method to question</span> The research question should decide the design, not the other way around — do not force a "how many" question into an interview, or a "why" question into a survey with fixed options only.</div>`,
    `<span class="eyebrow">JLR302 · Chương 3 · Bài 3.1</span>
<h2>Thiết kế nghiên cứu định tính vs định lượng</h2>
<h3>Hai mục tiêu khác nhau</h3>
<p><strong>Nghiên cứu định lượng</strong> hỏi "bao nhiêu / thường xuyên thế nào / có khác biệt có ý nghĩa không" — đo lường biến số bằng con số và khái quát hoá cho cả tổng thể. <strong>Nghiên cứu định tính</strong> hỏi "vì sao / như thế nào / điều này có ý nghĩa gì" — khám phá ý nghĩa, bối cảnh và trải nghiệm một cách sâu, thường với số ca nhỏ.</p>
<pre><code>                Định tính                Định lượng
Mục tiêu        Hiểu ý nghĩa             Đo lường & khái quát hoá
Dữ liệu         Chữ, văn bản, phỏng vấn  Con số, điểm, số đếm
Cỡ mẫu          Nhỏ, sâu                 Lớn, đại diện
Phân tích       Mã hoá, chủ đề           Thống kê
Câu hỏi VD      "Người học CẢM THẤY thế  "BAO NHIÊU PHẦN TRĂM người học
                 nào khi dùng kính ngữ?"  dùng sai kính ngữ?"
</code></pre>
<h3>Chọn thiết kế nào</h3>
<p>Dùng <strong>định tính</strong> khi cần hiểu sâu, có bối cảnh về một nhóm nhỏ (vd phỏng vấn 8 sinh viên năm cuối ngành Ngôn ngữ Nhật về nỗi lo dùng sai kính ngữ). Dùng <strong>định lượng</strong> khi cần đo một khuôn mẫu trên nhiều người (vd khảo sát 200 người về tần suất lỗi kính ngữ theo năm học). <strong>Nghiên cứu hỗn hợp</strong> kết hợp cả hai — vd khảo sát (định lượng) rồi phỏng vấn những trường hợp bất thường (định tính) để giải thích con số.</p>
<div class="callout"><span class="badge">Khớp phương pháp với câu hỏi</span> Câu hỏi nghiên cứu phải quyết định thiết kế, không phải ngược lại — đừng ép câu hỏi "bao nhiêu" vào phỏng vấn, hay câu hỏi "vì sao" vào khảo sát chỉ có lựa chọn cố định.</div>`,
  ]]);

const c3q = quiz('jlr302-quiz-3', 'Quiz 3 — Qualitative vs quantitative|||Quiz 3 — Định tính vs định lượng', [
  { id: 'q1', question: 'Nghiên cứu định lượng chủ yếu trả lời loại câu hỏi nào?', options: ['Vì sao / như thế nào (ý nghĩa)', 'Bao nhiêu / có khác biệt ý nghĩa không (đo lường)', 'Câu hỏi không cần dữ liệu', 'Chỉ áp dụng cho khoa học tự nhiên'], correctIndex: 1, explanation: 'Định lượng đo lường biến số bằng số liệu và khái quát hoá cho tổng thể.' },
  { id: 'q2', question: 'Phỏng vấn sâu 8 sinh viên về cảm nhận khi dùng kính ngữ phù hợp với thiết kế nào?', options: ['Định lượng', 'Định tính', 'Không thuộc thiết kế nào', 'Chỉ dùng được với khảo sát online'], correctIndex: 1, explanation: 'Số ca nhỏ, khai thác sâu ý nghĩa/trải nghiệm — đây là đặc trưng của nghiên cứu định tính.' },
  { id: 'q3', question: 'Nghiên cứu hỗn hợp (mixed methods) là gì?', options: ['Chỉ dùng thống kê nâng cao', 'Kết hợp cả định tính và định lượng trong cùng nghiên cứu', 'Nghiên cứu không có câu hỏi rõ ràng', 'Chỉ dùng cho luận án tiến sĩ'], correctIndex: 1, explanation: 'Mixed methods phối hợp cả hai cách tiếp cận, ví dụ khảo sát số liệu rồi phỏng vấn để giải thích sâu hơn.' },
]);

const c4 = doc('jlr302-4-1-thu-thap-du-lieu', '4.1 — Collecting language data: survey, interview, corpus|||4.1 — Thu thập dữ liệu ngôn ngữ: khảo sát, phỏng vấn, corpus',
  'Bảng khảo sát (thang Likert), phỏng vấn (có cấu trúc/bán cấu trúc/tự do), quan sát &amp; ghi âm hội thoại, ngôn ngữ học corpus và corpus tiếng Nhật (BCCWJ, 日本語コーパス).',
  [[
    `<span class="eyebrow">JLR302 · Chapter 4 · Lesson 4.1</span>
<h2>Collecting language data</h2>
<h3>Surveys / questionnaires</h3>
<p>Best for reaching many respondents quickly. A common scale is the <strong>Likert scale</strong> (e.g. 1 = strongly disagree ... 5 = strongly agree). Keep items short, unambiguous, and pilot-test with 3-5 people before sending it out — a confusing item produces unusable data.</p>
<h3>Interviews</h3>
<ul>
<li><strong>Structured</strong> — fixed questions, fixed order; easy to compare across interviewees.</li>
<li><strong>Semi-structured</strong> — a question guide, but you can probe follow-ups; most common for thesis work.</li>
<li><strong>Unstructured</strong> — open conversation around a topic; maximum depth, hardest to compare.</li>
</ul>
<h3>Observation &amp; recorded conversation</h3>
<p>Recording real Japanese conversation (with consent) captures how keigo, fillers, or turn-taking actually work in practice — not how speakers say they use them. Always transcribe with a consistent notation and anonymize speaker names.</p>
<h3>Corpus linguistics</h3>
<p>A <strong>corpus</strong> is a large, structured collection of real language text/speech, searchable for frequency and patterns. For Japanese, the reference corpus is <strong>BCCWJ (Balanced Corpus of Contemporary Written Japanese, 日本語コーパス)</strong> — you can search how often a word appears, in which register, and next to which collocates, without collecting your own data.</p>
<pre><code>Method       Best for                         Example use
Survey       Broad patterns, many people      "How often do 200 students use X?"
Interview    Deep individual meaning          "Why do learners avoid keigo?"
Recording    Real spontaneous usage           Turn-taking, filler words
Corpus       Frequency/collocation at scale   How common is a word in BCCWJ?
</code></pre>
<div class="callout"><span class="badge">Triangulation</span> Combining two or more methods (e.g. survey + corpus check) makes findings more trustworthy than relying on a single source of data.</div>`,
    `<span class="eyebrow">JLR302 · Chương 4 · Bài 4.1</span>
<h2>Thu thập dữ liệu ngôn ngữ</h2>
<h3>Khảo sát / bảng hỏi</h3>
<p>Phù hợp khi cần tiếp cận nhiều người trả lời nhanh. Thang đo phổ biến là <strong>thang Likert</strong> (vd 1 = hoàn toàn không đồng ý ... 5 = hoàn toàn đồng ý). Câu hỏi nên ngắn, không mơ hồ, và thử nghiệm với 3-5 người trước khi gửi đại trà — một câu hỏi khó hiểu sẽ cho dữ liệu không dùng được.</p>
<h3>Phỏng vấn</h3>
<ul>
<li><strong>Có cấu trúc</strong> — câu hỏi cố định, thứ tự cố định; dễ so sánh giữa các người được phỏng vấn.</li>
<li><strong>Bán cấu trúc</strong> — có dàn ý câu hỏi nhưng có thể hỏi thêm khi cần; phổ biến nhất cho khoá luận.</li>
<li><strong>Tự do</strong> — trò chuyện mở quanh một chủ đề; sâu nhất nhưng khó so sánh nhất.</li>
</ul>
<h3>Quan sát &amp; ghi âm hội thoại</h3>
<p>Ghi âm hội thoại tiếng Nhật thật (có sự đồng ý) cho thấy kính ngữ, từ đệm, hay lượt lời thực sự vận hành thế nào trong thực tế — chứ không phải người nói TỰ NGHĨ mình dùng thế nào. Luôn phiên âm theo một quy ước nhất quán và ẩn danh tên người nói.</p>
<h3>Ngôn ngữ học corpus</h3>
<p>Một <strong>corpus</strong> là tập hợp lớn, có cấu trúc của văn bản/lời nói ngôn ngữ thật, tra cứu được về tần suất và khuôn mẫu. Với tiếng Nhật, corpus tham chiếu là <strong>BCCWJ (Balanced Corpus of Contemporary Written Japanese, 日本語コーパス)</strong> — bạn tra được một từ xuất hiện bao nhiêu lần, ở văn phong nào, đi cùng từ nào, mà không cần tự thu thập dữ liệu.</p>
<pre><code>Phương pháp   Phù hợp khi                       Ví dụ dùng
Khảo sát      Khuôn mẫu rộng, nhiều người       "Bao nhiêu trong 200 SV dùng sai X?"
Phỏng vấn     Ý nghĩa cá nhân sâu               "Vì sao người học né dùng kính ngữ?"
Ghi âm        Cách dùng tự nhiên thật           Lượt lời, từ đệm
Corpus        Tần suất/kết hợp từ ở quy mô lớn  Từ này phổ biến thế nào trong BCCWJ?
</code></pre>
<div class="callout"><span class="badge">Đối chiếu nguồn (triangulation)</span> Kết hợp từ hai phương pháp trở lên (vd khảo sát + kiểm tra corpus) làm kết quả đáng tin hơn là chỉ dựa vào một nguồn dữ liệu duy nhất.</div>`,
  ]]);

const c4q = quiz('jlr302-quiz-4', 'Quiz 4 — Data collection|||Quiz 4 — Thu thập dữ liệu', [
  { id: 'q1', question: 'Phỏng vấn có dàn ý câu hỏi nhưng cho phép hỏi thêm khi cần gọi là gì?', options: ['Có cấu trúc', 'Bán cấu trúc', 'Tự do hoàn toàn', 'Khảo sát Likert'], correctIndex: 1, explanation: 'Phỏng vấn bán cấu trúc có dàn ý nhưng linh hoạt hỏi thêm — phổ biến nhất cho khoá luận.' },
  { id: 'q2', question: 'BCCWJ là gì?', options: ['Một phần mềm thống kê', 'Một corpus tham chiếu tiếng Nhật (日本語コーパス)', 'Một thang đo Likert', 'Một tạp chí khoa học'], correctIndex: 1, explanation: 'BCCWJ (Balanced Corpus of Contemporary Written Japanese) là corpus lớn để tra tần suất/kết hợp từ tiếng Nhật thật.' },
  { id: 'q3', question: 'Vì sao nên thử nghiệm (pilot test) bảng khảo sát trước khi gửi đại trà?', options: ['Để tăng số câu hỏi', 'Để phát hiện câu hỏi mơ hồ trước khi thu dữ liệu không dùng được', 'Vì bắt buộc theo luật', 'Để khảo sát chạy nhanh hơn'], correctIndex: 1, explanation: 'Pilot test với vài người giúp phát hiện câu hỏi khó hiểu trước khi phát hành rộng, tránh thu dữ liệu hỏng.' },
]);

const c5 = doc('jlr302-5-1-phan-tich-cong-cu', '5.1 — Data analysis & tools|||5.1 — Phân tích dữ liệu & công cụ',
  'Phân tích định tính (mã hoá, chủ đề, phân tích diễn ngôn); thống kê mô tả &amp; suy luận cơ bản (t-test, chi-square); công cụ: Excel/SPSS, NVivo, AntConc.',
  [[
    `<span class="eyebrow">JLR302 · Chapter 5 · Lesson 5.1</span>
<h2>Analyzing data &amp; choosing tools</h2>
<h3>Qualitative analysis</h3>
<p><strong>Coding</strong> means tagging chunks of interview/text data with short labels (e.g. "keigo-anxiety", "workplace-pressure"), then grouping codes into broader <strong>themes</strong>. <strong>Discourse analysis</strong> goes further, examining how language choices (e.g. honorific level, hedging) construct meaning or power relations in context.</p>
<h3>Quantitative analysis</h3>
<p><strong>Descriptive statistics</strong> summarize data: mean, frequency, percentage — e.g. "68% of respondents used sonkeigo 尊敬語 incorrectly at least once." <strong>Basic inferential statistics</strong> test whether a pattern is likely real or due to chance:</p>
<ul>
<li><strong>t-test</strong> — compares the means of two groups (e.g. keigo scores of year-3 vs year-4 students).</li>
<li><strong>chi-square test</strong> — checks if two categorical variables are related (e.g. gender vs preferred honorific form).</li>
</ul>
<p>You do not need to derive the formulas by hand for a thesis — understanding <em>what question each test answers</em> and reading software output correctly is enough.</p>
<h3>Tools</h3>
<pre><code>Type            Tool examples
Quantitative    Excel (basic), SPSS (t-test/chi-square with a few clicks)
Qualitative     NVivo (coding & theme management)
Corpus          AntConc (free concordancer), KH Coder (Japanese text mining)
</code></pre>
<div class="callout"><span class="badge">Analysis follows design</span> Choose the analysis method to match the data type and research question decided in Chapter 3 — do not run a t-test on interview transcripts, or code-and-theme a 200-response Likert survey.</div>`,
    `<span class="eyebrow">JLR302 · Chương 5 · Bài 5.1</span>
<h2>Phân tích dữ liệu &amp; chọn công cụ</h2>
<h3>Phân tích định tính</h3>
<p><strong>Mã hoá (coding)</strong> là gắn nhãn ngắn cho từng đoạn dữ liệu phỏng vấn/văn bản (vd "lo-lắng-kính-ngữ", "áp-lực-công-sở"), rồi gom các mã thành <strong>chủ đề (theme)</strong> lớn hơn. <strong>Phân tích diễn ngôn</strong> đi sâu hơn, xem xét lựa chọn ngôn ngữ (vd mức độ kính ngữ, cách giảm nhẹ lời nói) kiến tạo ý nghĩa hoặc quan hệ quyền lực trong bối cảnh thế nào.</p>
<h3>Phân tích định lượng</h3>
<p><strong>Thống kê mô tả</strong> tóm tắt dữ liệu: trung bình, tần suất, phần trăm — vd "68% người trả lời dùng sai tôn kính ngữ (尊敬語, sonkeigo) ít nhất một lần." <strong>Thống kê suy luận cơ bản</strong> kiểm tra một khuôn mẫu có thật hay chỉ do ngẫu nhiên:</p>
<ul>
<li><strong>t-test</strong> — so sánh trung bình của hai nhóm (vd điểm dùng kính ngữ của SV năm 3 vs năm 4).</li>
<li><strong>chi-square</strong> — kiểm tra hai biến phân loại có liên quan không (vd giới tính vs dạng kính ngữ ưa dùng).</li>
</ul>
<p>Không cần tự suy ra công thức bằng tay khi làm khoá luận — hiểu <em>mỗi phép kiểm trả lời câu hỏi gì</em> và đọc đúng kết quả phần mềm là đủ.</p>
<h3>Công cụ</h3>
<pre><code>Loại            Ví dụ công cụ
Định lượng      Excel (cơ bản), SPSS (t-test/chi-square vài cú nhấp chuột)
Định tính       NVivo (mã hoá & quản lý chủ đề)
Corpus          AntConc (tra từ miễn phí), KH Coder (khai phá văn bản tiếng Nhật)
</code></pre>
<div class="callout"><span class="badge">Phân tích đi theo thiết kế</span> Chọn cách phân tích khớp với loại dữ liệu và câu hỏi nghiên cứu đã quyết ở Chương 3 — đừng chạy t-test trên bản ghi phỏng vấn, hay mã hoá-chủ đề một khảo sát Likert 200 người trả lời.</div>`,
  ]]);

const c5q = quiz('jlr302-quiz-5', 'Quiz 5 — Analysis & tools|||Quiz 5 — Phân tích & công cụ', [
  { id: 'q1', question: 'Gom các mã (code) nhỏ thành nhóm lớn hơn trong phân tích định tính gọi là gì?', options: ['t-test', 'Chủ đề (theme)', 'Chi-square', 'Thang Likert'], correctIndex: 1, explanation: 'Sau khi mã hoá từng đoạn dữ liệu, các mã liên quan được gom thành chủ đề (theme) lớn hơn.' },
  { id: 'q2', question: 'Muốn so sánh điểm trung bình dùng kính ngữ giữa SV năm 3 và năm 4, nên dùng phép kiểm nào?', options: ['Chi-square', 't-test', 'Phân tích diễn ngôn', 'Mã hoá chủ đề'], correctIndex: 1, explanation: 't-test dùng để so sánh trung bình của hai nhóm.' },
  { id: 'q3', question: 'AntConc và KH Coder chủ yếu dùng để làm gì?', options: ['Thiết kế bảng khảo sát', 'Tra cứu tần suất/khai phá văn bản trong corpus', 'Phỏng vấn trực tuyến', 'Trích dẫn APA tự động'], correctIndex: 1, explanation: 'AntConc là công cụ tra từ (concordancer) miễn phí, KH Coder dùng khai phá văn bản tiếng Nhật.' },
]);

const c6 = doc('jlr302-6-1-doi-chieu-nhat-viet', '6.1 — Japanese-Vietnamese contrastive study, translation & culture|||6.1 — Nghiên cứu đối chiếu Nhật-Việt, dịch thuật & văn hoá',
  'Ngôn ngữ học đối chiếu (kính ngữ vs xưng hô Việt, trợ từ vs giới từ); nghiên cứu dịch thuật (tương đương, Domestication/Foreignization); giao tiếp liên văn hoá công sở Nhật-Việt.',
  [[
    `<span class="eyebrow">JLR302 · Chapter 6 · Lesson 6.1</span>
<h2>Contrastive study, translation &amp; culture</h2>
<h3>Contrastive linguistics</h3>
<p><strong>Contrastive linguistics</strong> systematically compares two language systems to find similarities and differences — not to say one is "better." A classic thesis angle: Japanese <strong>keigo 敬語</strong> (a full grammatical system of honorifics) vs Vietnamese <strong>hệ thống xưng hô</strong> (pronoun choice based on age/status) — both encode social hierarchy, but Japanese does it through verb morphology while Vietnamese does it through pronoun choice.</p>
<p>Another common pair: Japanese <strong>助詞 (joshi, particles: は/が/を/に)</strong> vs Vietnamese <strong>giới từ</strong> — particles attach to a noun and mark grammatical role, while Vietnamese relies more on word order and prepositions. This kind of contrast explains many learner errors.</p>
<h3>Translation studies</h3>
<p><strong>Equivalence</strong> asks how closely a translation preserves meaning, not just words. Two classic strategies:</p>
<ul>
<li><strong>Domestication</strong> — adapt the text to feel natural in the target culture (translate 敬語 politeness with Vietnamese honorific pronouns instead of literal wording).</li>
<li><strong>Foreignization</strong> — keep the source culture visible (keep a Japanese term like "senpai" untranslated with a footnote).</li>
</ul>
<p>A thesis can analyze real subtitle/manga/business-document translations and classify which strategy was used, and where it fails.</p>
<h3>Intercultural communication</h3>
<p>Culture research examines how Japanese and Vietnamese workplace norms differ — e.g. indirect refusal (曖昧な断り方) in Japanese business culture vs more direct Vietnamese communication — and how this causes real misunderstandings between staff.</p>
<div class="callout"><span class="badge">Example topics</span> "Đối chiếu cách sử dụng kính ngữ (敬語) trong giao tiếp công sở Nhật Bản và Việt Nam"; "Chiến lược dịch thuật ngữ văn hoá Nhật trong phụ đề phim (domestication vs foreignization)"; "Đối chiếu trợ từ は/が tiếng Nhật với chủ đề-chủ ngữ tiếng Việt."</div>`,
    `<span class="eyebrow">JLR302 · Chương 6 · Bài 6.1</span>
<h2>Nghiên cứu đối chiếu, dịch thuật &amp; văn hoá</h2>
<h3>Ngôn ngữ học đối chiếu</h3>
<p><strong>Ngôn ngữ học đối chiếu</strong> so sánh có hệ thống hai hệ thống ngôn ngữ để tìm điểm giống và khác — không phải để nói ngôn ngữ nào "hơn". Một góc khoá luận kinh điển: <strong>kính ngữ 敬語</strong> tiếng Nhật (một hệ thống ngữ pháp kính ngữ đầy đủ) vs <strong>hệ thống xưng hô</strong> tiếng Việt (chọn đại từ theo tuổi/địa vị) — cả hai đều mã hoá tôn ti xã hội, nhưng tiếng Nhật làm qua biến đổi hình thái động từ còn tiếng Việt qua lựa chọn đại từ.</p>
<p>Một cặp phổ biến khác: <strong>trợ từ tiếng Nhật (助詞, joshi: は/が/を/に)</strong> vs <strong>giới từ tiếng Việt</strong> — trợ từ gắn vào danh từ để đánh dấu vai trò ngữ pháp, còn tiếng Việt dựa nhiều vào trật tự từ và giới từ. Kiểu đối chiếu này giải thích được nhiều lỗi của người học.</p>
<h3>Nghiên cứu dịch thuật</h3>
<p><strong>Tương đương (equivalence)</strong> hỏi bản dịch giữ được ý nghĩa gốc gần đến đâu, không chỉ giữ từng từ. Hai chiến lược kinh điển:</p>
<ul>
<li><strong>Domestication (bản địa hoá)</strong> — chuyển văn bản sao cho tự nhiên với văn hoá đích (dịch mức độ lịch sự của 敬語 bằng đại từ xưng hô kính trọng tiếng Việt thay vì dịch sát chữ).</li>
<li><strong>Foreignization (giữ lạ hoá)</strong> — giữ nguyên dấu ấn văn hoá nguồn (giữ nguyên từ Nhật như "senpai" kèm chú thích).</li>
</ul>
<p>Một khoá luận có thể phân tích bản dịch phụ đề/manga/văn bản kinh doanh thật, phân loại chiến lược nào được dùng và ở đâu nó thất bại.</p>
<h3>Giao tiếp liên văn hoá</h3>
<p>Nghiên cứu văn hoá xem xét chuẩn mực công sở Nhật và Việt khác nhau thế nào — vd cách từ chối gián tiếp (曖昧な断り方) trong văn hoá kinh doanh Nhật so với giao tiếp trực tiếp hơn của người Việt — và điều này gây hiểu lầm thật giữa nhân viên hai bên ra sao.</p>
<div class="callout"><span class="badge">Ví dụ đề tài</span> "Đối chiếu cách sử dụng kính ngữ (敬語) trong giao tiếp công sở Nhật Bản và Việt Nam"; "Chiến lược dịch thuật ngữ văn hoá Nhật trong phụ đề phim (domestication vs foreignization)"; "Đối chiếu trợ từ は/が tiếng Nhật với chủ đề-chủ ngữ tiếng Việt."</div>`,
  ]]);

const c6q = quiz('jlr302-quiz-6', 'Quiz 6 — Contrastive study & translation|||Quiz 6 — Đối chiếu & dịch thuật', [
  { id: 'q1', question: 'Mục đích của ngôn ngữ học đối chiếu là gì?', options: ['Chứng minh một ngôn ngữ hơn ngôn ngữ khác', 'So sánh có hệ thống để tìm điểm giống/khác giữa hai hệ thống ngôn ngữ', 'Chỉ dùng cho dịch máy', 'Thay thế hoàn toàn cho ngữ pháp học'], correctIndex: 1, explanation: 'Đối chiếu ngôn ngữ nhằm tìm điểm tương đồng và khác biệt có hệ thống, không đánh giá hơn kém.' },
  { id: 'q2', question: 'Giữ nguyên từ "senpai" trong bản dịch kèm chú thích, thay vì dịch nghĩa, là chiến lược nào?', options: ['Domestication', 'Foreignization', 'Thống kê mô tả', 'Mã hoá chủ đề'], correctIndex: 1, explanation: 'Foreignization giữ dấu ấn văn hoá nguồn hiện diện trong bản dịch.' },
  { id: 'q3', question: 'Kính ngữ tiếng Nhật và hệ thống xưng hô tiếng Việt giống nhau ở điểm nào?', options: ['Cả hai đều dùng biến đổi động từ', 'Cả hai đều mã hoá tôn ti xã hội, nhưng bằng cơ chế ngữ pháp khác nhau', 'Cả hai đều không liên quan đến địa vị xã hội', 'Cả hai đều chỉ dùng trong văn viết'], correctIndex: 1, explanation: 'Cả hai mã hoá quan hệ tôn ti, nhưng tiếng Nhật qua hình thái động từ còn tiếng Việt qua lựa chọn đại từ.' },
]);

const c7 = doc('jlr302-7-1-de-cuong-khoa-luan', '7.1 — Writing the proposal & thesis (IMRaD, APA)|||7.1 — Viết đề cương & khoá luận (IMRaD, trích dẫn APA)',
  'Cấu trúc đề cương nghiên cứu; cấu trúc khoá luận theo IMRaD (Introduction, Methods, Results, Discussion); quy tắc trích dẫn APA; tránh đạo văn.',
  [[
    `<span class="eyebrow">JLR302 · Chapter 7 · Lesson 7.1</span>
<h2>Writing the proposal &amp; thesis</h2>
<h3>Research proposal structure</h3>
<pre><code>1. Tên đề tài
2. Lý do chọn đề tài (rationale)
3. Mục tiêu & câu hỏi nghiên cứu
4. Đối tượng & phạm vi nghiên cứu
5. Phương pháp nghiên cứu
6. Ý nghĩa khoa học/thực tiễn
7. Kế hoạch thực hiện (timeline)
</code></pre>
<h3>IMRaD — the standard thesis structure</h3>
<ul>
<li><strong>Introduction</strong> — background, problem, research question, significance.</li>
<li><strong>Methods</strong> — participants, data collection instrument, procedure, analysis method (so a reader could replicate it).</li>
<li><strong>Results</strong> — what you found, presented objectively (tables/figures/quotes), without interpretation yet.</li>
<li><strong>and Discussion</strong> — what the results MEAN, how they relate to prior literature, limitations, and implications.</li>
</ul>
<p>Add an <strong>Abstract</strong> before and a <strong>Conclusion + References</strong> after — that is the full thesis skeleton.</p>
<h3>APA citation basics</h3>
<pre><code>In-text:  ...được ghi nhận trong nghiên cứu trước (Litosseliti, 2010).
Reference list (alphabetical, hanging indent):
  Litosseliti, L. (Ed.). (2010). Research methods in linguistics.
     Continuum.
  田中太郎. (2018). 日本語研究の方法. 〇〇出版.
</code></pre>
<p>Every claim taken from a source needs an in-text citation; every in-text citation needs a matching entry in the reference list — mismatches are the most common formatting error graders flag.</p>
<div class="callout"><span class="badge">Avoiding plagiarism</span> Paraphrase in your own words AND cite the source, or quote directly with quotation marks AND a page number. Copying sentences and only changing a few words is still plagiarism even with a citation nearby.</div>`,
    `<span class="eyebrow">JLR302 · Chương 7 · Bài 7.1</span>
<h2>Viết đề cương &amp; khoá luận</h2>
<h3>Cấu trúc đề cương nghiên cứu</h3>
<pre><code>1. Tên đề tài
2. Lý do chọn đề tài (rationale)
3. Mục tiêu & câu hỏi nghiên cứu
4. Đối tượng & phạm vi nghiên cứu
5. Phương pháp nghiên cứu
6. Ý nghĩa khoa học/thực tiễn
7. Kế hoạch thực hiện (timeline)
</code></pre>
<h3>IMRaD — cấu trúc chuẩn của khoá luận</h3>
<ul>
<li><strong>Introduction (Mở đầu)</strong> — bối cảnh, vấn đề, câu hỏi nghiên cứu, ý nghĩa.</li>
<li><strong>Methods (Phương pháp)</strong> — người tham gia, công cụ thu thập dữ liệu, quy trình, cách phân tích (để người đọc lặp lại được).</li>
<li><strong>Results (Kết quả)</strong> — trình bày khách quan những gì tìm được (bảng/biểu đồ/trích dẫn), chưa diễn giải.</li>
<li><strong>and Discussion (Bàn luận)</strong> — kết quả CÓ Ý NGHĨA GÌ, liên hệ với tài liệu trước, hạn chế và hàm ý.</li>
</ul>
<p>Thêm <strong>Tóm tắt (Abstract)</strong> ở đầu và <strong>Kết luận + Tài liệu tham khảo</strong> ở cuối — đó là bộ khung đầy đủ của khoá luận.</p>
<h3>Trích dẫn APA cơ bản</h3>
<pre><code>Trong bài:  ...đã được ghi nhận trong nghiên cứu trước (Litosseliti, 2010).
Danh mục tài liệu (theo alphabet, thụt dòng treo):
  Litosseliti, L. (Ed.). (2010). Research methods in linguistics.
     Continuum.
  田中太郎. (2018). 日本語研究の方法. 〇〇出版.
</code></pre>
<p>Mọi ý lấy từ nguồn cần trích dẫn trong bài; mọi trích dẫn trong bài cần có mục tương ứng trong danh mục tài liệu — lệch nhau là lỗi trình bày phổ biến nhất bị trừ điểm.</p>
<div class="callout"><span class="badge">Tránh đạo văn</span> Diễn giải bằng lời của mình VÀ trích nguồn, hoặc trích dẫn nguyên văn có dấu ngoặc kép VÀ số trang. Chép câu rồi chỉ đổi vài từ vẫn là đạo văn dù có ghi nguồn gần đó.</div>`,
  ]]);

const c7q = quiz('jlr302-quiz-7', 'Quiz 7 — Proposal & thesis writing|||Quiz 7 — Đề cương & viết khoá luận', [
  { id: 'q1', question: 'IMRaD viết tắt cho các phần nào của khoá luận?', options: ['Introduction, Methods, Results, and Discussion', 'Idea, Method, Review, and Data', 'Interview, Measure, Report, and Defense', 'Introduction, Materials, Review, and Data'], correctIndex: 0, explanation: 'IMRaD = Introduction, Methods, Results, and Discussion — cấu trúc chuẩn của báo cáo/khoá luận khoa học.' },
  { id: 'q2', question: 'Phần nào của IMRaD trình bày kết quả một cách khách quan, CHƯA diễn giải ý nghĩa?', options: ['Introduction', 'Methods', 'Results', 'Discussion'], correctIndex: 2, explanation: 'Results chỉ trình bày dữ liệu tìm được; việc diễn giải ý nghĩa thuộc phần Discussion.' },
  { id: 'q3', question: 'Chép câu của nguồn rồi chỉ đổi vài từ, có ghi nguồn gần đó, có tính là đạo văn không?', options: ['Không, vì có ghi nguồn', 'Có, vì không thực sự diễn giải bằng lời của mình', 'Chỉ tính đạo văn nếu không ghi số trang', 'Không, vì đây là cách trích dẫn APA đúng'], correctIndex: 1, explanation: 'Diễn giải hời hợt (đổi vài từ) vẫn giữ nguyên cấu trúc câu gốc — vẫn là đạo văn dù có trích nguồn.' },
]);

const c8 = doc('jlr302-8-1-dao-duc-bao-ve', '8.1 — Research ethics, presentation & thesis defense|||8.1 — Đạo đức nghiên cứu, trình bày & bảo vệ khoá luận',
  'Nguyên tắc đạo đức nghiên cứu (informed consent, bảo mật, trung thực dữ liệu); chuẩn bị slide/poster trình bày; cấu trúc buổi bảo vệ khoá luận và cách trả lời hội đồng.',
  [[
    `<span class="eyebrow">JLR302 · Chapter 8 · Lesson 8.1</span>
<h2>Research ethics, presentation &amp; defense</h2>
<h3>Core ethical principles</h3>
<ul>
<li><strong>Informed consent</strong> — participants must know what the study is about and agree to take part before data collection (a short written or verbal consent statement is enough for a thesis).</li>
<li><strong>Confidentiality</strong> — anonymize names in transcripts/quotes; store recordings securely; only report data in aggregate or anonymized form.</li>
<li><strong>Data honesty</strong> — never invent, cherry-pick, or alter data to fit a hypothesis; report results that contradict your expectation too.</li>
<li><strong>Respecting copyrighted material</strong> — get permission (or use free/licensed corpora like BCCWJ) before reusing large amounts of copyrighted text for corpus analysis.</li>
</ul>
<h3>Presenting your work</h3>
<p>A defense slide deck should carry the argument on its own: <strong>problem → question → method → key result → conclusion</strong>, one idea per slide, tables/figures instead of dense paragraphs. Rehearse out loud with a timer — most defenses give 10-15 minutes to present.</p>
<h3>Thesis defense structure</h3>
<pre><code>1. Trình bày (10-15 phút): vấn đề -> câu hỏi -> phương pháp -> kết quả -> kết luận
2. Hội đồng đặt câu hỏi
3. Trả lời: nghe hết câu hỏi, trả lời ĐÚNG TRỌNG TÂM,
   thừa nhận hạn chế thay vì chống chế
4. Hội đồng hội ý & công bố điểm/góp ý
</code></pre>
<div class="callout"><span class="badge">Answering committee questions</span> If you do not know an answer, say so honestly and explain how you would find out — this is safer than guessing or arguing, and committees respect an honest "I did not test that, but based on X I would expect...".</div>`,
    `<span class="eyebrow">JLR302 · Chương 8 · Bài 8.1</span>
<h2>Đạo đức nghiên cứu, trình bày &amp; bảo vệ khoá luận</h2>
<h3>Các nguyên tắc đạo đức cốt lõi</h3>
<ul>
<li><strong>Sự đồng ý có hiểu biết (informed consent)</strong> — người tham gia phải biết nghiên cứu về gì và đồng ý tham gia trước khi thu dữ liệu (một câu đồng ý viết/nói ngắn là đủ cho khoá luận).</li>
<li><strong>Bảo mật</strong> — ẩn danh tên trong bản ghi/trích dẫn; lưu bản ghi âm an toàn; chỉ báo cáo dữ liệu ở dạng tổng hợp hoặc đã ẩn danh.</li>
<li><strong>Trung thực dữ liệu</strong> — không bịa đặt, chọn lọc thiên vị, hay chỉnh sửa dữ liệu để khớp giả thuyết; phải báo cáo cả kết quả trái ngược kỳ vọng.</li>
<li><strong>Tôn trọng bản quyền</strong> — xin phép (hoặc dùng corpus miễn phí/có giấy phép như BCCWJ) trước khi dùng lượng lớn văn bản có bản quyền để phân tích corpus.</li>
</ul>
<h3>Trình bày kết quả</h3>
<p>Slide bảo vệ nên tự mang được mạch lập luận: <strong>vấn đề → câu hỏi → phương pháp → kết quả chính → kết luận</strong>, một ý mỗi slide, dùng bảng/biểu đồ thay vì đoạn văn dày đặc. Tập nói to có bấm giờ — hầu hết buổi bảo vệ chỉ cho 10-15 phút trình bày.</p>
<h3>Cấu trúc buổi bảo vệ khoá luận</h3>
<pre><code>1. Trình bày (10-15 phút): vấn đề -> câu hỏi -> phương pháp -> kết quả -> kết luận
2. Hội đồng đặt câu hỏi
3. Trả lời: nghe hết câu hỏi, trả lời ĐÚNG TRỌNG TÂM,
   thừa nhận hạn chế thay vì chống chế
4. Hội đồng hội ý & công bố điểm/góp ý
</code></pre>
<div class="callout"><span class="badge">Trả lời câu hỏi hội đồng</span> Nếu không biết câu trả lời, hãy thành thật nói vậy và giải thích cách bạn sẽ tìm hiểu thêm — an toàn hơn nhiều so với đoán bừa hay tranh cãi, và hội đồng tôn trọng một câu trả lời thành thật "em chưa kiểm chứng điều đó, nhưng dựa trên X em nghĩ...".</div>`,
  ]]);

const c8q = quiz('jlr302-quiz-8', 'Quiz 8 — Ethics & defense|||Quiz 8 — Đạo đức & bảo vệ khoá luận', [
  { id: 'q1', question: 'Informed consent nghĩa là gì?', options: ['Người tham gia biết về nghiên cứu và đồng ý tham gia trước khi thu dữ liệu', 'Người nghiên cứu tự quyết định không cần hỏi ai', 'Chỉ áp dụng cho nghiên cứu định lượng', 'Chỉ cần thiết khi nghiên cứu có tài trợ'], correctIndex: 0, explanation: 'Informed consent là nguyên tắc đạo đức cơ bản: người tham gia phải hiểu và đồng ý trước khi dữ liệu được thu thập.' },
  { id: 'q2', question: 'Nếu dữ liệu thu được TRÁI với kỳ vọng ban đầu của người nghiên cứu, nên làm gì?', options: ['Bỏ dữ liệu đó đi', 'Chỉnh sửa cho khớp giả thuyết', 'Vẫn báo cáo trung thực kết quả đó', 'Không đề cập trong khoá luận'], correctIndex: 2, explanation: 'Trung thực dữ liệu đòi hỏi báo cáo cả kết quả trái ngược kỳ vọng, không được bỏ qua hay chỉnh sửa.' },
  { id: 'q3', question: 'Khi không biết câu trả lời cho câu hỏi của hội đồng, cách xử lý tốt nhất là gì?', options: ['Đoán đại một đáp án', 'Tranh cãi để bảo vệ quan điểm ban đầu', 'Thành thật nói chưa kiểm chứng và giải thích hướng tìm hiểu thêm', 'Im lặng không trả lời'], correctIndex: 2, explanation: 'Trả lời thành thật và có hướng giải quyết được đánh giá cao hơn đoán bừa hoặc chống chế.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'JLR302',
    slug: 'jlr302-resech-method',
    title: 'Research Method',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JLR302.webp',
    shortDescription: 'Research methods for Japanese Studies majors: RQ & literature review, qualitative vs quantitative design, data collection (survey, interview, corpus), Japanese-Vietnamese contrastive study, IMRaD thesis writing & APA, ethics & defense.|||Phương pháp NCKH cho ngành Ngôn ngữ Nhật: câu hỏi NC & tổng quan tài liệu, thiết kế định tính/định lượng, thu thập dữ liệu (khảo sát, phỏng vấn, corpus), đối chiếu Nhật-Việt, viết khoá luận IMRaD & APA, đạo đức & bảo vệ.',
    description: 'Môn <strong>JLR302 — Research Method</strong> (Phương pháp Nghiên cứu Khoa học, kỳ 7) trang bị cho sinh viên ngành <strong>Ngôn ngữ Nhật</strong> quy trình làm khoá luận từ đầu đến cuối: <strong>xác định vấn đề &amp; câu hỏi nghiên cứu</strong> → <strong>tổng quan tài liệu</strong> → <strong>thiết kế định tính/định lượng</strong> → <strong>thu thập dữ liệu ngôn ngữ</strong> (khảo sát, phỏng vấn, corpus tiếng Nhật) → <strong>phân tích &amp; công cụ</strong> → <strong>nghiên cứu đối chiếu Nhật-Việt, dịch thuật &amp; văn hoá</strong> → <strong>viết đề cương &amp; khoá luận theo IMRaD, trích dẫn APA</strong> → <strong>đạo đức nghiên cứu &amp; bảo vệ khoá luận</strong>. Trích dẫn <em>Research Methods in Linguistics</em> (Litosseliti), <em>Doing Applied Linguistics Research</em>, và 「日本語研究の方法」; ví dụ đề tài gắn với kính ngữ (敬語), trợ từ (助詞), corpus BCCWJ (日本語コーパス). Song ngữ Việt-Anh, kèm quiz mỗi chương.',
    whatYouLearn: 'Đặc điểm nghiên cứu khoa học & nghiên cứu ngôn ngữ; đặt câu hỏi nghiên cứu, tìm khoảng trống qua tổng quan tài liệu (Google Scholar, CiNii, J-STAGE); phân biệt thiết kế định tính/định lượng/hỗn hợp; thu thập dữ liệu bằng khảo sát, phỏng vấn, ghi âm hội thoại, corpus tiếng Nhật (BCCWJ); mã hoá & chủ đề, thống kê mô tả/suy luận cơ bản (t-test, chi-square), công cụ (SPSS, NVivo, AntConc); đối chiếu ngôn ngữ Nhật-Việt (kính ngữ, trợ từ), chiến lược dịch thuật (domestication/foreignization); cấu trúc đề cương & khoá luận IMRaD, trích dẫn APA, tránh đạo văn; đạo đức nghiên cứu, kỹ năng trình bày & bảo vệ khoá luận.',
    requirements: 'Đã hoàn thành các môn tiếng Nhật & kiến thức nền ngành Ngôn ngữ Nhật ở các kỳ trước. Xem điều kiện tiên quyết chi tiết trong khung chương trình ngành Ngôn ngữ Nhật trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách tham khảo (Litosseliti, Doing Applied Linguistics Research, 日本語研究の方法), CiNii, J-STAGE, BCCWJ, hướng dẫn APA.', lessons: [taiLieu] },
    { title: 'Chương 1 — Tổng quan nghiên cứu khoa học & nghiên cứu ngôn ngữ|||Chapter 1 — Research & language research overview', description: 'Đặc điểm NCKH, cơ bản vs ứng dụng, quy trình 6 bước, ví dụ đề tài tiếng Nhật.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Xác định vấn đề, câu hỏi NC & tổng quan tài liệu|||Chapter 2 — Problem, RQ & literature review', description: 'Thu hẹp chủ đề, tiêu chí câu hỏi NC tốt, tìm khoảng trống nghiên cứu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thiết kế nghiên cứu định tính vs định lượng|||Chapter 3 — Qualitative vs quantitative design', description: 'So sánh triết lý, dữ liệu, phân tích; mixed methods.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phương pháp thu thập dữ liệu ngôn ngữ|||Chapter 4 — Collecting language data', description: 'Khảo sát, phỏng vấn, ghi âm, corpus tiếng Nhật (BCCWJ).', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân tích dữ liệu & công cụ|||Chapter 5 — Data analysis & tools', description: 'Mã hoá & chủ đề, thống kê cơ bản, SPSS/NVivo/AntConc.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nghiên cứu đối chiếu Nhật-Việt, dịch thuật & văn hoá|||Chapter 6 — Japanese-Vietnamese contrastive study, translation & culture', description: 'Đối chiếu kính ngữ/trợ từ, chiến lược dịch thuật, giao tiếp liên văn hoá.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Viết đề cương & khoá luận (IMRaD, APA)|||Chapter 7 — Writing the proposal & thesis (IMRaD, APA)', description: 'Cấu trúc đề cương, IMRaD, trích dẫn APA, tránh đạo văn.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đạo đức nghiên cứu, trình bày & bảo vệ khoá luận|||Chapter 8 — Research ethics, presentation & defense', description: 'Nguyên tắc đạo đức, chuẩn bị trình bày, cấu trúc buổi bảo vệ.', lessons: [c8, c8q] },
  ],
};
