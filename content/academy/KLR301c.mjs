/**
 * KLR301c — Scientific Research Methods (Phương pháp Nghiên cứu Khoa học),
 * ngành Ngôn ngữ Hàn. Giáo trình tham khảo (trích dẫn, không upload PDF):
 * "Research Methods in Linguistics" (Litosseliti), "Doing Applied Linguistics
 * Research", "학술 연구 방법론". 8 chương: tổng quan NCKH & NC ngôn ngữ →
 * vấn đề/câu hỏi NC & tổng quan tài liệu → thiết kế định tính/định lượng →
 * thu thập dữ liệu (khảo sát, phỏng vấn, corpus) → phân tích & công cụ →
 * đối chiếu Hàn-Việt, dịch thuật & văn hoá → viết đề cương/khoá luận (IMRaD,
 * APA) → đạo đức NC, trình bày & bảo vệ. Song ngữ + ví dụ đề tài tiếng Hàn
 * (Hangeul + romaja). Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${};
 * "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('klr301c-0-1-overview', 'Course overview: Scientific Research Methods|||Tổng quan: Phương pháp Nghiên cứu Khoa học',
  'NCKH là gì, vì sao SV Ngôn ngữ Hàn cần môn này (chuẩn bị làm khoá luận); lộ trình 8 chương từ chọn đề tài đến bảo vệ; ba giáo trình tham khảo.',
  [[
    `<span class="eyebrow">KLR301c · Lesson 0.1 · Overview</span>
<h2>Scientific Research Methods</h2>
<p class="lead">This course prepares <strong>Korean Language majors</strong> to plan and write a graduation thesis on Korean language, translation or culture. You will learn the full research cycle — from choosing a topic to defending it — grounded in <strong>social-science and linguistics</strong> research methodology.</p>
<h3>Why this matters for a Korean Language major</h3>
<p>A thesis on, say, honorifics (경어법), loanwords, or subtitling strategy is not just "writing about Korean" — it is a <strong>research project</strong>: a clear question, a defensible method, real data, and a structured argument. This course supplies that scaffolding.</p>
<h3>Roadmap (8 chapters)</h3>
<ol>
<li>Overview of scientific &amp; linguistics research</li>
<li>Research problem, research questions &amp; literature review</li>
<li>Qualitative vs quantitative research design</li>
<li>Language data collection (surveys, interviews, corpus)</li>
<li>Data analysis &amp; tools (basic statistics, software)</li>
<li>Korean-Vietnamese contrastive research, translation &amp; culture</li>
<li>Writing the proposal &amp; thesis (IMRaD, APA citation)</li>
<li>Research ethics, presentation &amp; thesis defense</li>
</ol>
<h3>Reference textbooks</h3>
<ul>
<li><em>Research Methods in Linguistics</em> (Litosseliti, ed.)</li>
<li><em>Doing Applied Linguistics Research</em></li>
<li><em>학술 연구 방법론</em> (Academic Research Methodology)</li>
</ul>`,
    `<span class="eyebrow">KLR301c · Bài 0.1 · Tổng quan</span>
<h2>Phương pháp Nghiên cứu Khoa học</h2>
<p class="lead">Môn này chuẩn bị cho <strong>SV ngành Ngôn ngữ Hàn</strong> khả năng lên kế hoạch và viết <strong>khoá luận tốt nghiệp</strong> về ngôn ngữ, dịch thuật hay văn hoá Hàn Quốc. Bạn học trọn chu trình nghiên cứu — từ chọn đề tài đến bảo vệ — dựa trên phương pháp luận <strong>khoa học xã hội &amp; ngôn ngữ học</strong>.</p>
<h3>Vì sao SV Ngôn ngữ Hàn cần môn này</h3>
<p>Một khoá luận về kính ngữ (경어법), từ vay mượn, hay chiến lược dịch phụ đề không chỉ là "viết về tiếng Hàn" — đó là một <strong>công trình nghiên cứu</strong>: có câu hỏi rõ ràng, phương pháp bảo vệ được, dữ liệu thật, và lập luận có cấu trúc. Môn này cung cấp khung sườn đó.</p>
<h3>Lộ trình (8 chương)</h3>
<ol>
<li>Tổng quan nghiên cứu khoa học &amp; nghiên cứu ngôn ngữ</li>
<li>Vấn đề nghiên cứu, câu hỏi nghiên cứu &amp; tổng quan tài liệu</li>
<li>Thiết kế nghiên cứu định tính vs định lượng</li>
<li>Thu thập dữ liệu ngôn ngữ (khảo sát, phỏng vấn, corpus)</li>
<li>Phân tích dữ liệu &amp; công cụ (thống kê cơ bản, phần mềm)</li>
<li>Nghiên cứu đối chiếu Hàn-Việt, dịch thuật &amp; văn hoá</li>
<li>Viết đề cương &amp; khoá luận (IMRaD, trích dẫn APA)</li>
<li>Đạo đức nghiên cứu, trình bày &amp; bảo vệ khoá luận</li>
</ol>
<h3>Giáo trình tham khảo</h3>
<ul>
<li><em>Research Methods in Linguistics</em> (Litosseliti chủ biên)</li>
<li><em>Doing Applied Linguistics Research</em></li>
<li><em>학술 연구 방법론</em> (Phương pháp luận nghiên cứu học thuật)</li>
</ul>`,
  ]]);

const c1 = doc('klr301c-1-1-overview-research', '1.1 — Scientific research & language research|||1.1 — Nghiên cứu khoa học & nghiên cứu ngôn ngữ',
  'Định nghĩa NCKH (hệ thống, khách quan, kiểm chứng được); nghiên cứu cơ bản vs ứng dụng; các nhánh nghiên cứu ngôn ngữ (ứng dụng, đối chiếu, xã hội ngôn ngữ, dịch thuật).',
  [[
    `<span class="eyebrow">KLR301c · Chapter 1 · Lesson 1.1</span>
<h2>Scientific research &amp; language research</h2>
<h3>What counts as "scientific"</h3>
<p><strong>Scientific research</strong> is a systematic, objective and verifiable process of answering a question: it states an explicit question, follows a method other researchers can repeat, and bases conclusions on evidence rather than opinion.</p>
<ul>
<li><strong>Basic research</strong> — builds theory/knowledge (e.g. how honorific systems evolve).</li>
<li><strong>Applied research</strong> — solves a practical problem (e.g. why Vietnamese learners misuse Korean case particles).</li>
</ul>
<h3>Branches relevant to a Korean Language thesis</h3>
<ul>
<li><strong>Applied linguistics</strong> — language teaching/learning, error analysis, textbook evaluation.</li>
<li><strong>Contrastive linguistics</strong> — comparing two languages' systems (see Chapter 6).</li>
<li><strong>Sociolinguistics</strong> — language &amp; society (honorifics, gender, media Korean).</li>
<li><strong>Translation studies</strong> — equivalence, strategy, culture-specific items.</li>
</ul>
<pre><code>Research cycle (this course, chapter by chapter):
 1. Topic idea -> 2. Problem + research question -> 3. Design
 -> 4. Data collection -> 5. Analysis -> 6. Interpretation
 -> 7. Write-up (proposal/thesis) -> 8. Defense
</code></pre>
<div class="callout"><span class="badge">Sample topic</span> "Đối chiếu cách dùng kính ngữ (경어법) trong tiếng Hàn và tiếng Việt" combines contrastive linguistics with sociolinguistics — a typical, feasible topic for this major.</div>`,
    `<span class="eyebrow">KLR301c · Chương 1 · Bài 1.1</span>
<h2>Nghiên cứu khoa học &amp; nghiên cứu ngôn ngữ</h2>
<h3>Thế nào là "khoa học"</h3>
<p><strong>Nghiên cứu khoa học (NCKH)</strong> là quá trình trả lời một câu hỏi một cách có hệ thống, khách quan và kiểm chứng được: nêu rõ câu hỏi, đi theo phương pháp mà người khác có thể lặp lại, và kết luận dựa trên bằng chứng chứ không phải cảm tính.</p>
<ul>
<li><strong>Nghiên cứu cơ bản (basic)</strong> — xây dựng lý thuyết/tri thức (vd hệ thống kính ngữ hình thành thế nào).</li>
<li><strong>Nghiên cứu ứng dụng (applied)</strong> — giải quyết vấn đề thực tế (vd vì sao SV Việt dùng sai trợ từ cách trong tiếng Hàn).</li>
</ul>
<h3>Các nhánh liên quan tới khoá luận Ngôn ngữ Hàn</h3>
<ul>
<li><strong>Ngôn ngữ học ứng dụng</strong> — dạy/học ngôn ngữ, phân tích lỗi, đánh giá giáo trình.</li>
<li><strong>Ngôn ngữ học đối chiếu</strong> — so sánh hệ thống hai ngôn ngữ (xem Chương 6).</li>
<li><strong>Xã hội ngôn ngữ học</strong> — ngôn ngữ &amp; xã hội (kính ngữ, giới, tiếng Hàn trên truyền thông).</li>
<li><strong>Dịch thuật học</strong> — tương đương dịch, chiến lược dịch, yếu tố đặc thù văn hoá.</li>
</ul>
<pre><code>Chu trình nghiên cứu (theo từng chương môn này):
 1. Ý tưởng đề tài -> 2. Vấn đề + câu hỏi NC -> 3. Thiết kế
 -> 4. Thu thập dữ liệu -> 5. Phân tích -> 6. Diễn giải
 -> 7. Viết (đề cương/khoá luận) -> 8. Bảo vệ
</code></pre>
<div class="callout"><span class="badge">Đề tài mẫu</span> "Đối chiếu cách dùng kính ngữ (경어법) trong tiếng Hàn và tiếng Việt" kết hợp ngôn ngữ học đối chiếu với xã hội ngôn ngữ học — một đề tài khả thi, điển hình cho ngành này.</div>`,
  ]]);

const c1q = quiz('klr301c-quiz-1', 'Quiz 1 — Overview|||Quiz 1 — Tổng quan', [
  { id: 'q1', question: 'Đặc điểm bắt buộc của một nghiên cứu khoa học là gì?', options: ['Dựa trên cảm nhận cá nhân của tác giả', 'Có hệ thống, khách quan, kiểm chứng/lặp lại được', 'Không cần nêu câu hỏi nghiên cứu', 'Chỉ cần trích dẫn càng nhiều sách càng tốt'], correctIndex: 1, explanation: 'NCKH phải có phương pháp rõ ràng, khách quan và người khác kiểm chứng/lặp lại được.' },
  { id: 'q2', question: '"Vì sao SV Việt hay dùng sai trợ từ cách trong tiếng Hàn" thuộc loại nghiên cứu nào?', options: ['Nghiên cứu cơ bản', 'Nghiên cứu ứng dụng', 'Không phải nghiên cứu', 'Nghiên cứu định lượng thuần tuý về số học'], correctIndex: 1, explanation: 'Giải quyết một vấn đề thực tế trong dạy/học ngôn ngữ = nghiên cứu ứng dụng.' },
  { id: 'q3', question: 'Đối chiếu hệ thống kính ngữ Hàn-Việt thuộc nhánh nghiên cứu nào?', options: ['Ngôn ngữ học đối chiếu', 'Vật lý ngôn ngữ', 'Toán ứng dụng', 'Sinh học'], correctIndex: 0, explanation: 'So sánh hệ thống của hai ngôn ngữ là đối tượng của ngôn ngữ học đối chiếu (contrastive linguistics).' },
]);

const c2 = doc('klr301c-2-1-rq-literature', '2.1 — Research problem, questions & literature review|||2.1 — Vấn đề, câu hỏi NC & tổng quan tài liệu',
  'Từ chủ đề rộng đến vấn đề nghiên cứu cụ thể; tiêu chí FINER cho câu hỏi nghiên cứu tốt; mục đích & cấu trúc tổng quan tài liệu; khoảng trống nghiên cứu (research gap).',
  [[
    `<span class="eyebrow">KLR301c · Chapter 2 · Lesson 2.1</span>
<h2>Research problem, questions &amp; literature review</h2>
<h3>From broad topic to research question</h3>
<p>A broad interest ("Korean honorifics") is not yet researchable. Narrow it into a <strong>research problem</strong> (a gap or difficulty worth studying), then state one or two precise <strong>research questions (RQ)</strong>.</p>
<pre><code>Topic:    Korean honorifics
Problem:  Vietnamese learners often misuse subject-honorific -si-
          because Vietnamese has no equivalent grammatical marker
RQ:       What errors do Vietnamese learners of Korean make when
          using the subject honorific suffix -si-, and why?
</code></pre>
<h3>FINER — a quick quality check for a research question</h3>
<ul>
<li><strong>F</strong>easible — data and time realistically available for a thesis.</li>
<li><strong>I</strong>nteresting — to you and to the field.</li>
<li><strong>N</strong>ovel — adds something not already answered (see literature review).</li>
<li><strong>E</strong>thical — doable without harming participants (Chapter 8).</li>
<li><strong>R</strong>elevant — matters to Korean-language teaching, translation or research.</li>
</ul>
<h3>Literature review: purpose &amp; structure</h3>
<p>A <strong>literature review</strong> is not a list of summaries — it <strong>synthesizes</strong> prior studies to show what is known, what disagrees, and where the <strong>gap</strong> is that your thesis will fill (see Litosseliti, <em>Research Methods in Linguistics</em>, on framing a study within existing work). Organize thematically (by sub-topic), not one paragraph per source.</p>
<div class="callout"><span class="badge">Avoid this trap</span> "No one has studied X" is rarely literally true — search harder, or reframe: "existing studies on X focus on A, but not on B (my angle)."</div>`,
    `<span class="eyebrow">KLR301c · Chương 2 · Bài 2.1</span>
<h2>Vấn đề, câu hỏi nghiên cứu &amp; tổng quan tài liệu</h2>
<h3>Từ chủ đề rộng đến câu hỏi nghiên cứu</h3>
<p>Một mối quan tâm rộng ("kính ngữ tiếng Hàn") chưa thể nghiên cứu được. Thu hẹp thành một <strong>vấn đề nghiên cứu</strong> (một khoảng trống hay khó khăn đáng tìm hiểu), rồi phát biểu một-hai <strong>câu hỏi nghiên cứu (RQ)</strong> thật cụ thể.</p>
<pre><code>Chủ đề:      Kính ngữ tiếng Hàn
Vấn đề:      SV Việt hay dùng sai tiền tố kính ngữ chủ ngữ -si-
             vì tiếng Việt không có dấu hiệu ngữ pháp tương đương
Câu hỏi NC:  SV Việt học tiếng Hàn mắc lỗi gì khi dùng tiền tố
             kính ngữ chủ ngữ -si-, và vì sao?
</code></pre>
<h3>FINER — kiểm nhanh chất lượng câu hỏi nghiên cứu</h3>
<ul>
<li><strong>F</strong>easible (khả thi) — dữ liệu &amp; thời gian thực tế đủ cho một khoá luận.</li>
<li><strong>I</strong>nteresting (thú vị) — với bạn và với ngành.</li>
<li><strong>N</strong>ovel (mới) — thêm điều chưa ai trả lời (xem tổng quan tài liệu).</li>
<li><strong>E</strong>thical (đạo đức) — làm được mà không gây hại người tham gia (Chương 8).</li>
<li><strong>R</strong>elevant (liên quan) — có ý nghĩa với dạy tiếng Hàn, dịch thuật hay nghiên cứu ngôn ngữ.</li>
</ul>
<h3>Tổng quan tài liệu: mục đích &amp; cấu trúc</h3>
<p><strong>Tổng quan tài liệu (literature review)</strong> không phải danh sách tóm tắt — nó <strong>tổng hợp</strong> các nghiên cứu trước để chỉ ra điều đã biết, điều còn tranh cãi, và <strong>khoảng trống</strong> mà khoá luận của bạn sẽ lấp (xem Litosseliti, <em>Research Methods in Linguistics</em>, về cách đặt nghiên cứu trong bối cảnh tài liệu sẵn có). Tổ chức theo chủ đề, không viết mỗi đoạn tóm tắt một nguồn.</p>
<div class="callout"><span class="badge">Bẫy thường gặp</span> "Chưa ai nghiên cứu X" hiếm khi đúng theo nghĩa đen — tìm kỹ hơn, hoặc diễn đạt lại: "các nghiên cứu về X tập trung vào A, chưa xét đến B (góc tiếp cận của tôi)."</div>`,
  ]]);

const c2q = quiz('klr301c-quiz-2', 'Quiz 2 — RQ & literature review|||Quiz 2 — Câu hỏi NC & tổng quan tài liệu', [
  { id: 'q1', question: 'Trong tiêu chí FINER, chữ "N" đại diện cho điều gì?', options: ['Numeric (phải có số liệu)', 'Novel — thêm điều chưa được trả lời', 'National — phạm vi quốc gia', 'Neutral — không thiên vị'], correctIndex: 1, explanation: 'N = Novel: câu hỏi phải bổ sung điều chưa có trong tài liệu hiện có.' },
  { id: 'q2', question: 'Tổng quan tài liệu (literature review) tốt cần làm gì?', options: ['Liệt kê tóm tắt từng bài báo theo thứ tự đọc được', 'Tổng hợp theo chủ đề để chỉ ra điều đã biết và khoảng trống', 'Chỉ trích dẫn sách của giảng viên hướng dẫn', 'Bỏ qua các nghiên cứu trái quan điểm với mình'], correctIndex: 1, explanation: 'Literature review phải tổng hợp (synthesize) theo chủ đề, làm rõ research gap.' },
  { id: 'q3', question: 'Câu nào dưới đây là một câu hỏi nghiên cứu được thu hẹp đúng cách?', options: ['"Tiếng Hàn có kính ngữ."', '"Kính ngữ tiếng Hàn thú vị."', '"SV Việt mắc lỗi gì khi dùng tiền tố kính ngữ -si-, và vì sao?"', '"Nên học tiếng Hàn hay không?"'], correctIndex: 2, explanation: 'Câu hỏi cụ thể, có đối tượng, hiện tượng ngôn ngữ rõ và hỏi "gì/vì sao" — khả thi để nghiên cứu.' },
]);

const c3 = doc('klr301c-3-1-qual-quant', '3.1 — Qualitative vs quantitative design|||3.1 — Thiết kế định tính vs định lượng',
  'Mục đích, dữ liệu, cách phân tích của nghiên cứu định tính và định lượng; nghiên cứu hỗn hợp (mixed methods); ví dụ đề tài liên quan tiếng Hàn cho mỗi hướng.',
  [[
    `<span class="eyebrow">KLR301c · Chapter 3 · Lesson 3.1</span>
<h2>Qualitative vs quantitative design</h2>
<table><thead><tr><th></th><th>Qualitative</th><th>Quantitative</th></tr></thead><tbody>
<tr><td>Aim</td><td>Understand, explore, describe in depth</td><td>Measure, test a hypothesis, generalize</td></tr>
<tr><td>Data</td><td>Text, interview transcripts, observation notes</td><td>Numbers (scores, frequencies, ratings)</td></tr>
<tr><td>Sample</td><td>Small, purposive</td><td>Larger, aiming for representativeness</td></tr>
<tr><td>Analysis</td><td>Thematic/discourse analysis, coding</td><td>Descriptive &amp; inferential statistics</td></tr>
</tbody></table>
<h3>Mixed methods</h3>
<p>Many linguistics theses combine both: a <strong>survey</strong> (quantitative) to see how widespread a pattern is, plus <strong>interviews</strong> (qualitative) to understand why — this triangulation strengthens a thesis's conclusions.</p>
<pre><code>Example pair on the same topic (honorific -si- errors):
 Quantitative: survey 200 students, % who overuse/omit -si-
 Qualitative:  interview 10 students on WHY they hesitate
</code></pre>
<div class="callout"><span class="badge">Choose by question, not habit</span> "How often" / "how many" -&gt; quantitative. "Why" / "how does it feel" / "what strategy" -&gt; qualitative. Let the RQ from Chapter 2 decide the design, not the other way round.</div>`,
    `<span class="eyebrow">KLR301c · Chương 3 · Bài 3.1</span>
<h2>Thiết kế nghiên cứu định tính vs định lượng</h2>
<table><thead><tr><th></th><th>Định tính (qualitative)</th><th>Định lượng (quantitative)</th></tr></thead><tbody>
<tr><td>Mục đích</td><td>Hiểu sâu, khám phá, mô tả chi tiết</td><td>Đo lường, kiểm định giả thuyết, khái quát hoá</td></tr>
<tr><td>Dữ liệu</td><td>Văn bản, bản ghi phỏng vấn, ghi chú quan sát</td><td>Số liệu (điểm số, tần suất, thang đo)</td></tr>
<tr><td>Mẫu</td><td>Nhỏ, chọn có chủ đích</td><td>Lớn hơn, hướng tới tính đại diện</td></tr>
<tr><td>Phân tích</td><td>Phân tích chủ đề/diễn ngôn, mã hoá (coding)</td><td>Thống kê mô tả &amp; suy diễn</td></tr>
</tbody></table>
<h3>Nghiên cứu hỗn hợp (mixed methods)</h3>
<p>Nhiều khoá luận ngôn ngữ học kết hợp cả hai: một <strong>khảo sát</strong> (định lượng) để xem hiện tượng phổ biến đến đâu, cộng một <strong>phỏng vấn</strong> (định tính) để hiểu vì sao — cách tam giác hoá (triangulation) này làm kết luận khoá luận chắc chắn hơn.</p>
<pre><code>Ví dụ cặp trên cùng đề tài (lỗi kính ngữ -si-):
 Định lượng: khảo sát 200 SV, tỉ lệ % dùng thừa/thiếu -si-
 Định tính:  phỏng vấn 10 SV về LÝ DO họ do dự khi dùng -si-
</code></pre>
<div class="callout"><span class="badge">Chọn theo câu hỏi, không theo thói quen</span> "Bao nhiêu / tần suất thế nào" → định lượng. "Vì sao / cảm nhận ra sao / chiến lược gì" → định tính. Câu hỏi NC ở Chương 2 quyết định thiết kế, không phải ngược lại.</div>`,
  ]]);

const c3q = quiz('klr301c-quiz-3', 'Quiz 3 — Qual vs quant|||Quiz 3 — Định tính vs định lượng', [
  { id: 'q1', question: 'Nghiên cứu định lượng phù hợp nhất với câu hỏi nào?', options: ['"SV cảm thấy thế nào khi dùng kính ngữ?"', '"Bao nhiêu % SV dùng sai tiền tố -si-?"', '"Chiến lược dịch nào được người dịch chọn và vì sao?"', '"Trải nghiệm học tiếng Hàn của một SV cụ thể ra sao?"'], correctIndex: 1, explanation: 'Câu hỏi hỏi "bao nhiêu %" cần đo lường và số liệu — phù hợp định lượng.' },
  { id: 'q2', question: 'Kết hợp khảo sát (định lượng) và phỏng vấn (định tính) trên cùng đề tài gọi là gì?', options: ['Nghiên cứu hỗn hợp (mixed methods)', 'Nghiên cứu cơ bản', 'Nghiên cứu thứ cấp', 'Không hợp lệ về phương pháp'], correctIndex: 0, explanation: 'Mixed methods kết hợp hai hướng để tam giác hoá kết quả.' },
  { id: 'q3', question: 'Mẫu (sample) trong nghiên cứu định tính thường có đặc điểm gì?', options: ['Rất lớn, chọn ngẫu nhiên toàn quốc', 'Nhỏ, chọn có chủ đích để hiểu sâu', 'Không cần người tham gia', 'Luôn bằng đúng 200 người'], correctIndex: 1, explanation: 'Định tính ưu tiên hiểu sâu nên mẫu nhỏ, chọn có chủ đích (purposive).' },
]);

const c4 = doc('klr301c-4-1-data-collection', '4.1 — Language data collection: surveys, interviews, corpus|||4.1 — Thu thập dữ liệu ngôn ngữ: khảo sát, phỏng vấn, corpus',
  'Thiết kế bảng hỏi (thang Likert, pilot test); loại phỏng vấn (có cấu trúc/bán cấu trúc/tự do); corpus ngôn ngữ (Sejong Corpus) & phân tích tần suất; cách chọn mẫu.',
  [[
    `<span class="eyebrow">KLR301c · Chapter 4 · Lesson 4.1</span>
<h2>Language data collection</h2>
<h3>Surveys / questionnaires</h3>
<p>Use a <strong>Likert scale</strong> (e.g. 1=strongly disagree to 5=strongly agree) for attitudes/frequency items. Always <strong>pilot test</strong> on a few people first — a confusing item wastes an entire dataset. See <em>Doing Applied Linguistics Research</em> on questionnaire wording and piloting.</p>
<h3>Interviews</h3>
<ul>
<li><strong>Structured</strong> — fixed questions, same order, easy to compare.</li>
<li><strong>Semi-structured</strong> — a guide, but follow-up freely — most common for theses.</li>
<li><strong>Unstructured</strong> — open conversation, for deep exploratory work.</li>
</ul>
<h3>Corpus linguistics</h3>
<p>A <strong>corpus</strong> is a large, structured collection of real language use, searchable for frequency and patterns. Korean studies commonly use the <strong>Sejong Corpus</strong> (세종 말뭉치). Example use: counting how often Sino-Korean loanwords appear in newspaper vs. spoken corpora.</p>
<pre><code>Sampling methods:
 Random      -> every unit has equal chance (best for generalizing)
 Convenience -> whoever is available (common but weaker claims)
 Purposive   -> chosen for a reason (typical in qualitative work)
</code></pre>
<div class="callout"><span class="badge">Match method to question</span> "How common" -&gt; corpus/survey. "Why/how" -&gt; interview. Combining both is the mixed-methods pattern from Chapter 3.</div>`,
    `<span class="eyebrow">KLR301c · Chương 4 · Bài 4.1</span>
<h2>Thu thập dữ liệu ngôn ngữ</h2>
<h3>Khảo sát / bảng hỏi</h3>
<p>Dùng <strong>thang Likert</strong> (vd 1=rất không đồng ý đến 5=rất đồng ý) cho các câu hỏi thái độ/tần suất. Luôn <strong>thử nghiệm trước (pilot test)</strong> trên vài người — một câu hỏi gây hiểu nhầm sẽ làm hỏng cả bộ dữ liệu. Xem <em>Doing Applied Linguistics Research</em> về cách đặt câu hỏi và pilot.</p>
<h3>Phỏng vấn</h3>
<ul>
<li><strong>Có cấu trúc</strong> — câu hỏi cố định, cùng thứ tự, dễ so sánh.</li>
<li><strong>Bán cấu trúc</strong> — có dàn ý nhưng hỏi thêm tự do — phổ biến nhất cho khoá luận.</li>
<li><strong>Tự do (không cấu trúc)</strong> — trò chuyện mở, dùng cho khám phá sâu.</li>
</ul>
<h3>Ngôn ngữ học kho ngữ liệu (corpus)</h3>
<p>Một <strong>corpus</strong> là tập hợp lớn, có cấu trúc, của ngôn ngữ sử dụng thật, có thể tra tần suất và mẫu hình. Nghiên cứu tiếng Hàn thường dùng <strong>Sejong Corpus</strong> (세종 말뭉치). Ví dụ: đếm tần suất từ Hán-Hàn xuất hiện trong corpus báo chí so với corpus khẩu ngữ.</p>
<pre><code>Cách chọn mẫu:
 Ngẫu nhiên   -> mọi đơn vị có cơ hội bằng nhau (tốt để khái quát)
 Thuận tiện   -> ai sẵn có thì chọn (phổ biến nhưng kết luận yếu hơn)
 Có chủ đích  -> chọn vì lý do cụ thể (thường dùng cho định tính)
</code></pre>
<div class="callout"><span class="badge">Khớp phương pháp với câu hỏi</span> "Phổ biến đến đâu" → corpus/khảo sát. "Vì sao/thế nào" → phỏng vấn. Kết hợp cả hai chính là mẫu hình mixed methods ở Chương 3.</div>`,
  ]]);

const c4q = quiz('klr301c-quiz-4', 'Quiz 4 — Data collection|||Quiz 4 — Thu thập dữ liệu', [
  { id: 'q1', question: 'Vì sao cần "pilot test" một bảng hỏi trước khi phát chính thức?', options: ['Để bảng hỏi dài hơn', 'Để phát hiện câu hỏi gây hiểu nhầm trước khi mất cả bộ dữ liệu', 'Vì quy định bắt buộc phải có', 'Để không cần thang Likert'], correctIndex: 1, explanation: 'Pilot test giúp phát hiện lỗi thiết kế bảng hỏi sớm, tránh hỏng toàn bộ dữ liệu thu thập chính thức.' },
  { id: 'q2', question: 'Loại phỏng vấn có dàn ý nhưng cho phép hỏi thêm tự do gọi là gì?', options: ['Có cấu trúc', 'Bán cấu trúc', 'Tự do hoàn toàn', 'Khảo sát bằng bảng hỏi'], correctIndex: 1, explanation: 'Phỏng vấn bán cấu trúc (semi-structured) là dạng phổ biến nhất cho khoá luận.' },
  { id: 'q3', question: 'Sejong Corpus (세종 말뭉치) được dùng để làm gì?', options: ['Chấm điểm bài thi tiếng Hàn', 'Tra tần suất và mẫu hình sử dụng ngôn ngữ thật', 'Dịch máy tự động không cần kiểm tra', 'Thay thế hoàn toàn phỏng vấn'], correctIndex: 1, explanation: 'Corpus là kho ngữ liệu thật, dùng để tra tần suất/mẫu hình — một nguồn dữ liệu định lượng cho ngôn ngữ học.' },
]);

const c5 = doc('klr301c-5-1-analysis-tools', '5.1 — Data analysis & tools|||5.1 — Phân tích dữ liệu & công cụ',
  'Phân tích định tính (mã hoá, thematic analysis, NVivo); thống kê mô tả & suy diễn cơ bản (mean, SD, t-test, chi-square); công cụ ngôn ngữ học (AntConc) & Excel/SPSS.',
  [[
    `<span class="eyebrow">KLR301c · Chapter 5 · Lesson 5.1</span>
<h2>Data analysis &amp; tools</h2>
<h3>Analyzing qualitative data</h3>
<p><strong>Coding</strong> means labeling chunks of interview/text data with short tags, then grouping tags into <strong>themes</strong> (thematic analysis). Software like <strong>NVivo</strong> organizes codes; for a small thesis a spreadsheet works too.</p>
<h3>Basic statistics for quantitative data</h3>
<ul>
<li><strong>Descriptive</strong> — mean, standard deviation (SD), frequency/percentage: "how the data looks."</li>
<li><strong>Inferential</strong> — <strong>t-test</strong> (compare two group means), <strong>chi-square</strong> (compare frequencies/categories), <strong>correlation</strong> (relationship between two variables): "is the pattern likely real, not chance."</li>
</ul>
<pre><code>Example: overuse rate of honorific -si-
 Group A (beginners): mean = 42%, SD = 8
 Group B (advanced):  mean = 18%, SD = 6
 -&gt; a t-test checks if this difference is statistically significant
    (commonly reported as p &lt; 0.05)
</code></pre>
<h3>Tools</h3>
<ul>
<li><strong>Excel / SPSS</strong> — general statistics for surveys.</li>
<li><strong>AntConc</strong> — free concordance tool: search a corpus for a word/pattern and see it in context (KWIC), count frequency automatically.</li>
</ul>
<div class="callout"><span class="badge">Statistics support the claim, not replace it</span> A p-value alone means nothing without stating what was compared and why — always pair a number with its interpretation.</div>`,
    `<span class="eyebrow">KLR301c · Chương 5 · Bài 5.1</span>
<h2>Phân tích dữ liệu &amp; công cụ</h2>
<h3>Phân tích dữ liệu định tính</h3>
<p><strong>Mã hoá (coding)</strong> nghĩa là gắn nhãn ngắn cho từng đoạn dữ liệu phỏng vấn/văn bản, rồi gộp các nhãn thành <strong>chủ đề (theme)</strong> — gọi là phân tích chủ đề (thematic analysis). Phần mềm như <strong>NVivo</strong> giúp tổ chức mã; với khoá luận nhỏ, dùng bảng tính cũng được.</p>
<h3>Thống kê cơ bản cho dữ liệu định lượng</h3>
<ul>
<li><strong>Mô tả (descriptive)</strong> — trung bình (mean), độ lệch chuẩn (SD), tần suất/tỉ lệ: "dữ liệu trông như thế nào."</li>
<li><strong>Suy diễn (inferential)</strong> — <strong>t-test</strong> (so hai giá trị trung bình), <strong>chi-square</strong> (so tần suất/nhóm phân loại), <strong>tương quan (correlation)</strong> (mối liên hệ giữa hai biến): "khác biệt này có thật hay chỉ do ngẫu nhiên."</li>
</ul>
<pre><code>Ví dụ: tỉ lệ dùng thừa kính ngữ -si-
 Nhóm A (sơ cấp):  trung bình = 42%, SD = 8
 Nhóm B (cao cấp): trung bình = 18%, SD = 6
 -&gt; t-test kiểm tra khác biệt này có ý nghĩa thống kê không
    (thường báo cáo dạng p &lt; 0.05)
</code></pre>
<h3>Công cụ</h3>
<ul>
<li><strong>Excel / SPSS</strong> — thống kê tổng quát cho khảo sát.</li>
<li><strong>AntConc</strong> — công cụ tra cứu ngữ liệu miễn phí: tìm một từ/mẫu trong corpus và xem ngữ cảnh (KWIC), tự động đếm tần suất.</li>
</ul>
<div class="callout"><span class="badge">Thống kê hỗ trợ lập luận, không thay thế nó</span> Một giá trị p đơn lẻ vô nghĩa nếu không nói rõ đang so sánh gì và vì sao — luôn đi kèm con số với cách diễn giải.</div>`,
  ]]);

const c5q = quiz('klr301c-quiz-5', 'Quiz 5 — Analysis & tools|||Quiz 5 — Phân tích & công cụ', [
  { id: 'q1', question: 'Gắn nhãn từng đoạn dữ liệu phỏng vấn rồi gộp thành chủ đề gọi là gì?', options: ['t-test', 'Mã hoá & phân tích chủ đề (coding/thematic analysis)', 'Chi-square', 'Sampling ngẫu nhiên'], correctIndex: 1, explanation: 'Đây là quy trình phân tích dữ liệu định tính phổ biến nhất.' },
  { id: 'q2', question: 'Muốn so sánh trung bình của hai nhóm (sơ cấp vs cao cấp) xem khác biệt có ý nghĩa thống kê không, dùng phép kiểm nào?', options: ['t-test', 'AntConc', 'NVivo', 'Thang Likert'], correctIndex: 0, explanation: 't-test dùng để so sánh trung bình của hai nhóm.' },
  { id: 'q3', question: 'AntConc dùng để làm gì?', options: ['Ghi âm phỏng vấn', 'Tra một từ/mẫu trong corpus và xem ngữ cảnh, đếm tần suất', 'Tính t-test tự động', 'Thiết kế bảng hỏi Likert'], correctIndex: 1, explanation: 'AntConc là công cụ concordance cho ngôn ngữ học kho ngữ liệu (corpus linguistics).' },
]);

const c6 = doc('klr301c-6-1-contrastive-translation', '6.1 — Korean-Vietnamese contrastive research, translation & culture|||6.1 — Đối chiếu Hàn-Việt, dịch thuật & văn hoá',
  'Ngôn ngữ học đối chiếu: so hệ thống ngữ âm/ngữ pháp/từ vựng Hàn-Việt; dịch thuật học: tương đương, Việt hoá vs giữ nguyên gốc, yếu tố văn hoá không dịch trực tiếp.',
  [[
    `<span class="eyebrow">KLR301c · Chapter 6 · Lesson 6.1</span>
<h2>Korean-Vietnamese contrastive research, translation &amp; culture</h2>
<h3>Contrastive linguistics</h3>
<p><strong>Contrastive analysis</strong> systematically compares two languages' systems — phonology, grammar, vocabulary — to predict learner difficulty and inform teaching/translation. Example: Korean is agglutinative and SOV with case particles; Vietnamese is analytic/isolating with fixed SVO word order and no particles — this structural gap explains many learner errors with particles like 이/가, 을/를.</p>
<h3>Translation studies</h3>
<ul>
<li><strong>Equivalence</strong> — finding the closest meaning, not a word-for-word match.</li>
<li><strong>Domestication vs foreignization</strong> — adapt a text to feel natural to the target reader, or keep foreign flavor to preserve source culture.</li>
<li><strong>Culture-specific items (CSIs)</strong> — honorific titles, kinship terms, food names — often need a translation strategy (borrowing, explanation, substitution), not a literal one.</li>
</ul>
<pre><code>Example CSI: 형/오빠 (hyeong/oppa, "older brother" said by
younger male/female) have no single Vietnamese word that
also encodes speaker gender + closeness -&gt; translator must
choose a strategy depending on context, not a fixed dictionary word.
</code></pre>
<div class="callout"><span class="badge">A common thesis angle</span> "Đối chiếu chiến lược dịch thành ngữ Hàn sang Việt" or "Đối chiếu hệ thống kính ngữ Hàn-Việt" both combine Chapters 3–5's methods with this chapter's framework — see <em>학술 연구 방법론</em> for the cross-cultural research-design angle.</div>`,
    `<span class="eyebrow">KLR301c · Chương 6 · Bài 6.1</span>
<h2>Đối chiếu Hàn-Việt, dịch thuật &amp; văn hoá</h2>
<h3>Ngôn ngữ học đối chiếu</h3>
<p><strong>Phân tích đối chiếu (contrastive analysis)</strong> so sánh có hệ thống hệ thống của hai ngôn ngữ — ngữ âm, ngữ pháp, từ vựng — để dự đoán khó khăn của người học và phục vụ dạy học/dịch thuật. Ví dụ: tiếng Hàn là ngôn ngữ chắp dính, trật tự Chủ-Tân-Động, có trợ từ cách; tiếng Việt là ngôn ngữ đơn lập, trật tự Chủ-Động-Tân cố định, không có trợ từ — khoảng cách cấu trúc này giải thích nhiều lỗi của người học với trợ từ như 이/가, 을/를.</p>
<h3>Dịch thuật học</h3>
<ul>
<li><strong>Tương đương (equivalence)</strong> — tìm nghĩa gần nhất, không phải dịch từng từ.</li>
<li><strong>Việt hoá vs giữ nguyên gốc (domestication vs foreignization)</strong> — làm văn bản tự nhiên với người đọc đích, hoặc giữ màu sắc ngoại lai để bảo tồn văn hoá gốc.</li>
<li><strong>Yếu tố đặc thù văn hoá (CSI)</strong> — xưng hô kính ngữ, từ chỉ quan hệ họ hàng, tên món ăn — thường cần chiến lược dịch (mượn từ, giải thích, thay thế), không dịch nghĩa đen.</li>
</ul>
<pre><code>Ví dụ CSI: 형/오빠 (hyeong/oppa, "anh trai" người nói là nam/nữ)
không có một từ tiếng Việt duy nhất vừa mang giới tính người nói
vừa mang mức độ thân thiết -&gt; người dịch phải chọn chiến lược
tuỳ ngữ cảnh, không có từ điển cố định.
</code></pre>
<div class="callout"><span class="badge">Một hướng khoá luận phổ biến</span> "Đối chiếu chiến lược dịch thành ngữ Hàn sang Việt" hay "Đối chiếu hệ thống kính ngữ Hàn-Việt" đều kết hợp phương pháp ở Chương 3–5 với khung của chương này — xem <em>학술 연구 방법론</em> về góc nhìn thiết kế nghiên cứu liên văn hoá.</div>`,
  ]]);

const c6q = quiz('klr301c-quiz-6', 'Quiz 6 — Contrastive & translation|||Quiz 6 — Đối chiếu & dịch thuật', [
  { id: 'q1', question: 'Ngôn ngữ học đối chiếu (contrastive linguistics) làm gì?', options: ['Chỉ dịch văn bản không cần phân tích', 'So sánh có hệ thống hai ngôn ngữ để dự đoán khó khăn học tập/dịch thuật', 'Chỉ nghiên cứu một ngôn ngữ duy nhất', 'Chỉ áp dụng cho văn nói'], correctIndex: 1, explanation: 'Contrastive linguistics so sánh hệ thống ngữ âm/ngữ pháp/từ vựng của hai ngôn ngữ.' },
  { id: 'q2', question: 'Việt hoá một văn bản dịch cho tự nhiên với người đọc Việt gọi là gì?', options: ['Foreignization (giữ nguyên gốc)', 'Domestication (Việt hoá)', 'Transliteration máy móc', 'Corpus linguistics'], correctIndex: 1, explanation: 'Domestication = điều chỉnh để tự nhiên với văn hoá/ngôn ngữ đích.' },
  { id: 'q3', question: 'Vì sao 형/오빠 khó dịch sang một từ tiếng Việt duy nhất?', options: ['Vì tiếng Việt không có từ chỉ anh trai', 'Vì từ Hàn mã hoá cả giới tính người nói lẫn mức độ thân thiết mà tiếng Việt không gộp trong một từ', 'Vì đó là từ vay mượn tiếng Anh', 'Vì đây là thuật ngữ khoa học'], correctIndex: 1, explanation: 'Đây là ví dụ điển hình về yếu tố đặc thù văn hoá (CSI) cần chiến lược dịch, không dịch nghĩa đen.' },
]);

const c7 = doc('klr301c-7-1-writing-imrad-apa', '7.1 — Writing the proposal & thesis (IMRaD, APA)|||7.1 — Viết đề cương & khoá luận (IMRaD, APA)',
  'Cấu trúc đề cương nghiên cứu; cấu trúc khoá luận IMRaD (Introduction–Methods–Results–Discussion); cách trích dẫn APA trong bài và trong danh mục tài liệu tham khảo.',
  [[
    `<span class="eyebrow">KLR301c · Chapter 7 · Lesson 7.1</span>
<h2>Writing the proposal &amp; thesis (IMRaD, APA)</h2>
<h3>Research proposal structure</h3>
<ol>
<li>Title &amp; rationale (why this topic matters)</li>
<li>Research problem &amp; questions (Chapter 2)</li>
<li>Literature review / research gap (Chapter 2)</li>
<li>Methodology — design, data, sample, tools (Chapters 3–5)</li>
<li>Expected contribution &amp; timeline</li>
</ol>
<h3>IMRaD — the thesis skeleton</h3>
<pre><code>Abstract   - the whole thesis in ~200 words
Introduction - problem, RQ, why it matters
Methods      - design, participants, instruments, procedure
Results      - what the data showed (no interpretation yet)
Discussion   - what it means, limitations, conclusion
References   - full list, APA style
</code></pre>
<h3>APA citation basics</h3>
<p>In-text: <code>(Litosseliti, 2018)</code> or "Litosseliti (2018) argues that…". Reference list entry (book): <code>Author, A. A. (Year). Title of work. Publisher.</code> Every source cited in-text must appear in the reference list, and vice versa — mismatches are a common defense-committee complaint.</p>
<div class="callout"><span class="badge">Common mistakes</span> Methods section not actually matching the RQ; Results mixed with Discussion (interpreting data too early); copying literature review sentences without paraphrasing (plagiarism — see Chapter 8).</div>`,
    `<span class="eyebrow">KLR301c · Chương 7 · Bài 7.1</span>
<h2>Viết đề cương &amp; khoá luận (IMRaD, APA)</h2>
<h3>Cấu trúc đề cương nghiên cứu</h3>
<ol>
<li>Tên đề tài &amp; lý do chọn đề tài</li>
<li>Vấn đề &amp; câu hỏi nghiên cứu (Chương 2)</li>
<li>Tổng quan tài liệu / khoảng trống nghiên cứu (Chương 2)</li>
<li>Phương pháp luận — thiết kế, dữ liệu, mẫu, công cụ (Chương 3–5)</li>
<li>Đóng góp dự kiến &amp; tiến độ thực hiện</li>
</ol>
<h3>IMRaD — khung xương khoá luận</h3>
<pre><code>Abstract     - tóm tắt cả khoá luận trong ~200 từ
Introduction - vấn đề, câu hỏi NC, vì sao quan trọng
Methods      - thiết kế, người tham gia, công cụ, quy trình
Results      - dữ liệu cho thấy gì (chưa diễn giải)
Discussion   - ý nghĩa, hạn chế, kết luận
References   - danh mục đầy đủ, theo chuẩn APA
</code></pre>
<h3>Trích dẫn APA cơ bản</h3>
<p>Trong bài: <code>(Litosseliti, 2018)</code> hoặc "Litosseliti (2018) cho rằng…". Mục trong danh mục tài liệu (sách): <code>Tác giả, A. A. (Năm). Tên tác phẩm. Nhà xuất bản.</code> Mọi nguồn trích trong bài phải xuất hiện trong danh mục tài liệu, và ngược lại — lệch nhau là lỗi hội đồng thường bắt lỗi.</p>
<div class="callout"><span class="badge">Lỗi thường gặp</span> Phần Methods không khớp với câu hỏi nghiên cứu; Results lẫn với Discussion (diễn giải dữ liệu quá sớm); chép câu từ tổng quan tài liệu mà không diễn đạt lại (đạo văn — xem Chương 8).</div>`,
  ]]);

const c7q = quiz('klr301c-quiz-7', 'Quiz 7 — Writing IMRaD/APA|||Quiz 7 — Viết IMRaD/APA', [
  { id: 'q1', question: 'Trong cấu trúc IMRaD, phần "Results" nên chứa gì?', options: ['Chỉ diễn giải ý nghĩa dữ liệu', 'Dữ liệu thu được, chưa diễn giải', 'Danh mục tài liệu tham khảo', 'Lý do chọn đề tài'], correctIndex: 1, explanation: 'Results trình bày dữ liệu; việc diễn giải ý nghĩa thuộc phần Discussion.' },
  { id: 'q2', question: 'Theo chuẩn APA, trích dẫn trong bài cho một nguồn (Litosseliti, năm 2018) viết đúng là?', options: ['[Litosseliti-18]', '(Litosseliti, 2018)', '{Litosseliti}', 'Litosseliti/2018'], correctIndex: 1, explanation: 'APA in-text citation dùng dạng (Tác giả, Năm).' },
  { id: 'q3', question: 'Vì sao mọi nguồn trích trong bài phải xuất hiện trong danh mục tài liệu tham khảo?', options: ['Không bắt buộc, chỉ để đẹp', 'Để hội đồng dễ đối chiếu và tránh lệch trích dẫn — lỗi hay gặp khi bảo vệ', 'Vì phần mềm yêu cầu', 'Chỉ cần với sách tiếng Hàn'], correctIndex: 1, explanation: 'Trích dẫn trong bài và danh mục tài liệu phải khớp nhau hoàn toàn.' },
]);

const c8 = doc('klr301c-8-1-ethics-defense', '8.1 — Research ethics, presentation & thesis defense|||8.1 — Đạo đức nghiên cứu, trình bày & bảo vệ khoá luận',
  'Đạo đức nghiên cứu (sự đồng ý, bảo mật danh tính, tránh đạo văn); chuẩn bị slide/poster; cấu trúc buổi bảo vệ khoá luận & cách trả lời hội đồng.',
  [[
    `<span class="eyebrow">KLR301c · Chapter 8 · Lesson 8.1</span>
<h2>Research ethics, presentation &amp; thesis defense</h2>
<h3>Research ethics</h3>
<ul>
<li><strong>Informed consent</strong> — participants know the purpose and agree before a survey/interview.</li>
<li><strong>Anonymity &amp; confidentiality</strong> — no names in the thesis; store raw data securely.</li>
<li><strong>Avoiding plagiarism</strong> — paraphrase and cite (Chapter 7); universities check similarity with tools like Turnitin.</li>
</ul>
<h3>Presenting the work</h3>
<p>Slides should carry the argument (RQ → method → key result → conclusion) in visuals, not paragraphs of text read aloud. Rehearse timing — a defense slot is usually short (10–15 minutes).</p>
<h3>Thesis defense structure</h3>
<pre><code>1. Presentation (~10-15 min): problem -> method -> findings -> conclusion
2. Committee Q&amp;A: defend choices (why this method? why this sample?)
3. Common questions: "What is your contribution?" "Limitations?"
   "Why didn't you use [other method]?"
</code></pre>
<div class="callout"><span class="badge">Defense-day checklist</span> Know your own numbers cold; be honest about limitations (a strong "future research" answer beats a defensive one); bring a printed copy of your thesis and proposal.</div>`,
    `<span class="eyebrow">KLR301c · Chương 8 · Bài 8.1</span>
<h2>Đạo đức nghiên cứu, trình bày &amp; bảo vệ khoá luận</h2>
<h3>Đạo đức nghiên cứu</h3>
<ul>
<li><strong>Sự đồng ý (informed consent)</strong> — người tham gia biết rõ mục đích và đồng ý trước khi khảo sát/phỏng vấn.</li>
<li><strong>Ẩn danh &amp; bảo mật</strong> — không nêu tên trong khoá luận; lưu trữ dữ liệu thô an toàn.</li>
<li><strong>Tránh đạo văn</strong> — diễn đạt lại và trích dẫn (Chương 7); trường thường kiểm tra độ trùng lặp bằng công cụ như Turnitin.</li>
</ul>
<h3>Trình bày kết quả</h3>
<p>Slide nên mang lập luận (câu hỏi NC → phương pháp → kết quả chính → kết luận) bằng hình ảnh, không phải đoạn văn đọc lại từng chữ. Luyện tập canh giờ — thời lượng bảo vệ thường ngắn (10–15 phút).</p>
<h3>Cấu trúc buổi bảo vệ khoá luận</h3>
<pre><code>1. Trình bày (~10-15 phút): vấn đề -> phương pháp -> kết quả -> kết luận
2. Hội đồng hỏi-đáp: bảo vệ lựa chọn (vì sao phương pháp này? vì sao mẫu này?)
3. Câu hỏi thường gặp: "Đóng góp của bạn là gì?" "Hạn chế?"
   "Vì sao không dùng [phương pháp khác]?"
</code></pre>
<div class="callout"><span class="badge">Checklist ngày bảo vệ</span> Nắm chắc số liệu của chính mình; thành thật về hạn chế (câu trả lời "hướng nghiên cứu tiếp theo" tốt hơn là né tránh); mang bản in khoá luận và đề cương.</div>`,
  ]]);

const c8q = quiz('klr301c-quiz-8', 'Quiz 8 — Ethics & defense|||Quiz 8 — Đạo đức & bảo vệ', [
  { id: 'q1', question: '"Informed consent" trong nghiên cứu nghĩa là gì?', options: ['Người tham gia không cần biết mục đích nghiên cứu', 'Người tham gia biết mục đích và đồng ý trước khi tham gia', 'Chỉ cần đồng ý bằng miệng sau khi khảo sát xong', 'Không áp dụng cho phỏng vấn'], correctIndex: 1, explanation: 'Sự đồng ý phải được thông báo rõ ràng và có trước khi thu thập dữ liệu.' },
  { id: 'q2', question: 'Trường thường dùng công cụ nào để kiểm tra đạo văn trong khoá luận?', options: ['AntConc', 'Turnitin (kiểm tra độ trùng lặp)', 'SPSS', 'NVivo'], correctIndex: 1, explanation: 'Turnitin là công cụ phổ biến kiểm tra độ trùng lặp/đạo văn.' },
  { id: 'q3', question: 'Khi hội đồng hỏi về hạn chế (limitations) của khoá luận, nên trả lời thế nào?', options: ['Phủ nhận là khoá luận không có hạn chế', 'Thành thật nêu hạn chế và đề xuất hướng nghiên cứu tiếp theo', 'Đổ lỗi cho giảng viên hướng dẫn', 'Bỏ qua câu hỏi'], correctIndex: 1, explanation: 'Thừa nhận hạn chế một cách chuyên nghiệp, kèm hướng khắc phục/nghiên cứu tiếp, là câu trả lời tốt nhất.' },
]);

export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    courseCode: 'KLR301c',
    slug: 'klr301c-scientific-research-methods',
    title: 'Scientific Research Methods',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KLR301c.webp',
    shortDescription: 'Research methods for Korean Language majors — RQ, literature review, qual/quant design, data collection (survey, interview, corpus), basic stats, Korean-Vietnamese contrastive & translation, thesis writing (IMRaD, APA), ethics.|||PP nghiên cứu cho SV Ngôn ngữ Hàn — câu hỏi NC, tổng quan tài liệu, thiết kế định tính/lượng, thu thập dữ liệu (khảo sát, phỏng vấn, corpus), thống kê cơ bản, đối chiếu Hàn-Việt & dịch thuật, viết khoá luận (IMRaD, APA), đạo đức NC.',
    description: 'Môn <strong>KLR301c — Scientific Research Methods</strong> (kỳ 6) trang bị cho SV ngành <strong>Ngôn ngữ Hàn</strong> phương pháp làm <strong>khoá luận tốt nghiệp</strong>. Từ <strong>tổng quan NCKH &amp; nghiên cứu ngôn ngữ</strong> → <strong>câu hỏi nghiên cứu &amp; tổng quan tài liệu</strong> → <strong>thiết kế định tính/định lượng</strong> → <strong>thu thập dữ liệu ngôn ngữ</strong> (khảo sát, phỏng vấn, corpus) → <strong>phân tích &amp; công cụ</strong> → <strong>đối chiếu Hàn-Việt, dịch thuật &amp; văn hoá</strong> → <strong>viết đề cương/khoá luận</strong> (IMRaD, APA) → <strong>đạo đức nghiên cứu &amp; bảo vệ</strong>. Trích dẫn ba giáo trình: <em>Research Methods in Linguistics</em> (Litosseliti), <em>Doing Applied Linguistics Research</em>, <em>학술 연구 방법론</em>. Song ngữ, ví dụ đề tài tiếng Hàn (Hangeul + romaja), quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa NCKH, nghiên cứu cơ bản/ứng dụng, các nhánh nghiên cứu ngôn ngữ; đặt vấn đề, câu hỏi NC (FINER), viết tổng quan tài liệu & tìm research gap; thiết kế định tính vs định lượng vs hỗn hợp; thu thập dữ liệu qua khảo sát/phỏng vấn/corpus (Sejong Corpus); thống kê mô tả & suy diễn cơ bản (mean, SD, t-test, chi-square), công cụ AntConc/SPSS/NVivo; ngôn ngữ học đối chiếu Hàn-Việt & dịch thuật (equivalence, CSI); cấu trúc IMRaD & trích dẫn APA; đạo đức nghiên cứu, trình bày & bảo vệ khoá luận.',
    requirements: 'Đã học các môn ngôn ngữ Hàn nền tảng và kỹ năng viết học thuật cơ bản; nên đọc trước giáo trình chính thức của môn trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'NCKH là gì, vì sao cần cho khoá luận Ngôn ngữ Hàn, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan NCKH & nghiên cứu ngôn ngữ|||Chapter 1 — Overview of scientific & language research', description: 'NCKH là gì, các nhánh nghiên cứu ngôn ngữ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Vấn đề, câu hỏi NC & tổng quan tài liệu|||Chapter 2 — Research problem, questions & literature review', description: 'FINER, tổng quan tài liệu, research gap.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thiết kế định tính vs định lượng|||Chapter 3 — Qualitative vs quantitative design', description: 'So sánh hai hướng, mixed methods.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thu thập dữ liệu ngôn ngữ|||Chapter 4 — Language data collection', description: 'Khảo sát, phỏng vấn, corpus, chọn mẫu.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân tích dữ liệu & công cụ|||Chapter 5 — Data analysis & tools', description: 'Coding, thống kê cơ bản, AntConc/SPSS.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đối chiếu Hàn-Việt, dịch thuật & văn hoá|||Chapter 6 — Korean-Vietnamese contrastive research & translation', description: 'Ngôn ngữ học đối chiếu, dịch thuật học, CSI.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Viết đề cương & khoá luận|||Chapter 7 — Writing the proposal & thesis', description: 'IMRaD, trích dẫn APA.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đạo đức NC, trình bày & bảo vệ|||Chapter 8 — Research ethics, presentation & defense', description: 'Đạo đức, slide, buổi bảo vệ.', lessons: [c8, c8q] },
  ],
};
