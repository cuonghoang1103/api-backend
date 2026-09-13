/**
 * ENW493c — Research Methods & Academic Writing Skills (ngành SE FPTU, Kỳ 6).
 * Giáo trình FLM: phương pháp nghiên cứu + kỹ năng viết học thuật — loại nghiên
 * cứu, câu hỏi/giả thuyết, literature review, trích dẫn (APA/IEEE) & đạo văn,
 * IMRaD, đoạn văn (coherence/cohesion), lập luận & phản biện, thu thập dữ liệu
 * & đạo đức, văn phong (hedging), trình bày & bảo vệ. Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('enw493c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ENW493c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to do <strong>research</strong> and write <strong>academically</strong> — asking a good research question, reviewing the literature, citing correctly, structuring a paper (IMRaD) and defending it — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ENW493c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.amazon.com/They-Say-Say-Moves-Academic/dp/0393538702" target="_blank" rel="noopener"><em>They Say / I Say: The Moves That Matter in Academic Writing</em> — Graff &amp; Birkenstein</a> — templates for entering a scholarly conversation.</li>
<li><a href="https://press.uchicago.edu/ucp/books/book/chicago/C/bo23521678.html" target="_blank" rel="noopener"><em>The Craft of Research</em> — Booth, Colomb, Williams &amp; Bizup</a> — from question to argument to draft.</li>
<li><a href="https://apastyle.apa.org/products/publication-manual-7th-edition" target="_blank" rel="noopener"><em>Publication Manual of the APA</em> (7th ed.)</a> — the reference standard for APA citation.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://owl.purdue.edu/owl/purdue_owl.html" target="_blank" rel="noopener">Purdue OWL (owl.purdue.edu)</a> — APA, MLA &amp; IEEE guides, grammar, and the writing process.</li>
<li><a href="https://scholar.google.com" target="_blank" rel="noopener">Google Scholar</a> — search scholarly papers and grab ready-made citations.</li>
<li><a href="https://www.zotero.org/support/" target="_blank" rel="noopener">Zotero Documentation</a> — how to collect, organise and cite sources automatically.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@AcademicEnglishNow" target="_blank" rel="noopener">Academic English Now</a> — academic writing &amp; research paper skills.</li>
<li><a href="https://www.youtube.com/@DavidStuckler" target="_blank" rel="noopener">How to write a research paper</a> — structure, method, and publishing walkthroughs.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.zotero.org" target="_blank" rel="noopener">Zotero</a> / <a href="https://www.mendeley.com" target="_blank" rel="noopener">Mendeley</a> — reference managers (collect, cite, build a bibliography).</li>
<li><a href="https://www.grammarly.com" target="_blank" rel="noopener">Grammarly</a> — grammar &amp; clarity checker (aid, not a substitute for your own edit).</li>
<li><a href="https://www.overleaf.com" target="_blank" rel="noopener">Overleaf</a> (LaTeX) / Microsoft Word — write and format the paper.</li>
<li><a href="https://www.turnitin.com" target="_blank" rel="noopener">Turnitin</a> — similarity check to help you avoid plagiarism.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what research is, framing a research question and a hypothesis, qualitative vs quantitative.</li>
<li><strong>Sources &amp; citation</strong> — find and evaluate literature on Google Scholar, then cite it in APA/IEEE and manage it in Zotero.</li>
<li><strong>Structure &amp; style</strong> — IMRaD, abstracts, coherent paragraphs, a clear thesis, and objective academic style.</li>
<li><strong>Deliver</strong> — collect data ethically, write it up, and present/defend it with a poster or slides.</li>
</ol></div>`,
    `<span class="eyebrow">ENW493c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để <strong>làm nghiên cứu</strong> và viết <strong>học thuật</strong> — đặt câu hỏi nghiên cứu tốt, tổng quan tài liệu, trích dẫn đúng chuẩn, dựng cấu trúc bài (IMRaD) và bảo vệ nó — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ENW493c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.amazon.com/They-Say-Say-Moves-Academic/dp/0393538702" target="_blank" rel="noopener"><em>They Say / I Say: The Moves That Matter in Academic Writing</em> — Graff &amp; Birkenstein</a> — mẫu câu để bước vào cuộc đối thoại học thuật.</li>
<li><a href="https://press.uchicago.edu/ucp/books/book/chicago/C/bo23521678.html" target="_blank" rel="noopener"><em>The Craft of Research</em> — Booth, Colomb, Williams &amp; Bizup</a> — từ câu hỏi đến lập luận đến bản thảo.</li>
<li><a href="https://apastyle.apa.org/products/publication-manual-7th-edition" target="_blank" rel="noopener"><em>Publication Manual of the APA</em> (bản 7)</a> — chuẩn tham chiếu cho trích dẫn APA.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://owl.purdue.edu/owl/purdue_owl.html" target="_blank" rel="noopener">Purdue OWL (owl.purdue.edu)</a> — hướng dẫn APA, MLA &amp; IEEE, ngữ pháp và quy trình viết.</li>
<li><a href="https://scholar.google.com" target="_blank" rel="noopener">Google Scholar</a> — tìm bài báo học thuật và lấy trích dẫn có sẵn.</li>
<li><a href="https://www.zotero.org/support/" target="_blank" rel="noopener">Zotero Documentation</a> — cách thu thập, sắp xếp và trích dẫn nguồn tự động.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AcademicEnglishNow" target="_blank" rel="noopener">Academic English Now</a> — kỹ năng viết học thuật &amp; bài báo nghiên cứu.</li>
<li><a href="https://www.youtube.com/@DavidStuckler" target="_blank" rel="noopener">How to write a research paper</a> — cấu trúc, phương pháp và cách xuất bản.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.zotero.org" target="_blank" rel="noopener">Zotero</a> / <a href="https://www.mendeley.com" target="_blank" rel="noopener">Mendeley</a> — quản lý tài liệu (thu thập, trích dẫn, dựng danh mục tham khảo).</li>
<li><a href="https://www.grammarly.com" target="_blank" rel="noopener">Grammarly</a> — kiểm ngữ pháp &amp; độ rõ (chỉ hỗ trợ, không thay việc tự biên tập).</li>
<li><a href="https://www.overleaf.com" target="_blank" rel="noopener">Overleaf</a> (LaTeX) / Microsoft Word — viết và định dạng bài.</li>
<li><a href="https://www.turnitin.com" target="_blank" rel="noopener">Turnitin</a> — kiểm tra độ tương đồng để tránh đạo văn.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — nghiên cứu là gì, đặt câu hỏi nghiên cứu và giả thuyết, định tính vs định lượng.</li>
<li><strong>Nguồn &amp; trích dẫn</strong> — tìm và đánh giá tài liệu trên Google Scholar, trích dẫn APA/IEEE và quản lý bằng Zotero.</li>
<li><strong>Cấu trúc &amp; văn phong</strong> — IMRaD, abstract, đoạn văn mạch lạc, luận điểm rõ, văn phong khách quan.</li>
<li><strong>Hoàn thiện</strong> — thu thập dữ liệu có đạo đức, viết lên bài và trình bày/bảo vệ bằng poster hoặc slide.</li>
</ol></div>`,
  ]]);

const intro = doc('enw493c-0-1-overview', 'Course overview: Research methods & academic writing|||Tổng quan: Phương pháp nghiên cứu & viết học thuật',
  'Môn học làm gì; nghiên cứu học thuật là quá trình có phương pháp; lộ trình 9 chương: từ câu hỏi nghiên cứu → nguồn & trích dẫn → cấu trúc & văn phong → trình bày & bảo vệ.',
  [[
    `<span class="eyebrow">ENW493c · Lesson 0.1 · Overview</span>
<h2>Research Methods &amp; Academic Writing</h2>
<p class="lead">This course teaches you to <strong>investigate a question systematically</strong> and to <strong>write about it the way scholars do</strong> — clearly, honestly, and with evidence. These are the skills behind your capstone report, your thesis, and any technical paper you will publish in your SE career.</p>
<h3>What is academic writing?</h3>
<p>Academic writing is <strong>evidence-based, objective and structured</strong>. Unlike a blog post or an opinion piece, every claim is backed by a source or by data, the tone stays impersonal, and the shape of the document follows shared conventions (like IMRaD) so readers know exactly where to look.</p>
<h3>Two halves, one process</h3>
<ul>
<li><strong>Research methods</strong> — how you find, evaluate and generate reliable knowledge: framing a question, reviewing the literature, choosing qualitative or quantitative methods, collecting data ethically.</li>
<li><strong>Academic writing</strong> — how you communicate it: citing sources, structuring the paper, building coherent paragraphs, arguing a thesis, and defending your work.</li>
</ul>
<h3>Roadmap</h3>
<p>What research is &amp; research questions → finding &amp; evaluating sources → citation &amp; avoiding plagiarism → academic structure (IMRaD) → paragraphs → argument &amp; critical thinking → data collection &amp; ethics → academic style → presenting &amp; defending. Bilingual, with real citation examples and quizzes per chapter.</p>`,
    `<span class="eyebrow">ENW493c · Bài 0.1 · Tổng quan</span>
<h2>Phương pháp nghiên cứu &amp; viết học thuật</h2>
<p class="lead">Môn này dạy bạn <strong>khảo sát một vấn đề một cách có hệ thống</strong> và <strong>viết về nó theo cách của giới học thuật</strong> — rõ ràng, trung thực, có bằng chứng. Đây là kỹ năng nền cho báo cáo capstone, khoá luận và mọi bài báo kỹ thuật bạn sẽ công bố trong nghề SE.</p>
<h3>Viết học thuật là gì?</h3>
<p>Viết học thuật <strong>dựa trên bằng chứng, khách quan và có cấu trúc</strong>. Khác với bài blog hay bài nêu quan điểm, mọi khẳng định đều được chống đỡ bằng nguồn hoặc dữ liệu, giọng văn giữ vô ngã, và hình dạng bài tuân theo quy ước chung (như IMRaD) để người đọc biết chính xác cần tìm gì ở đâu.</p>
<h3>Hai nửa, một quá trình</h3>
<ul>
<li><strong>Phương pháp nghiên cứu</strong> — cách bạn tìm, đánh giá và tạo ra tri thức đáng tin: đặt câu hỏi, tổng quan tài liệu, chọn phương pháp định tính hay định lượng, thu thập dữ liệu có đạo đức.</li>
<li><strong>Viết học thuật</strong> — cách bạn truyền đạt: trích dẫn nguồn, dựng cấu trúc bài, viết đoạn văn mạch lạc, lập luận cho luận điểm và bảo vệ công trình.</li>
</ul>
<h3>Lộ trình</h3>
<p>Nghiên cứu là gì &amp; câu hỏi nghiên cứu → tìm &amp; đánh giá nguồn → trích dẫn &amp; tránh đạo văn → cấu trúc học thuật (IMRaD) → đoạn văn → lập luận &amp; tư duy phản biện → thu thập dữ liệu &amp; đạo đức → văn phong học thuật → trình bày &amp; bảo vệ. Song ngữ, có ví dụ trích dẫn thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('enw493c-1-1-what-is-research', '1.1 — What is research? Questions & hypotheses|||1.1 — Nghiên cứu là gì? Câu hỏi & giả thuyết',
  'Nghiên cứu là gì; định tính vs định lượng (và hỗn hợp); câu hỏi nghiên cứu tốt (FINER/tiêu chí); giả thuyết & biến.',
  [[
    `<span class="eyebrow">ENW493c · Chapter 1 · Lesson 1.1</span>
<h2>What is research? Questions &amp; hypotheses</h2>
<p>Research is a <strong>systematic investigation</strong> that creates new, reliable knowledge — not just googling until you find agreement. It starts with a question, gathers evidence with a defensible method, and reasons to an answer others can check.</p>
<h3>Qualitative vs quantitative</h3>
<ul>
<li><strong>Quantitative</strong> — measures with <em>numbers</em> to test relationships (surveys with scales, experiments, metrics). Answers "how much / how many / does X affect Y". Analysed with statistics.</li>
<li><strong>Qualitative</strong> — explores <em>meaning</em> with words (interviews, open questions, observation). Answers "why / how / what is it like". Analysed by finding themes.</li>
<li><strong>Mixed methods</strong> — combines both, e.g. a survey for scale plus interviews for depth.</li>
</ul>
<h3>A good research question</h3>
<p>Use the <strong>FINER</strong> test — Feasible, Interesting, Novel, Ethical, Relevant. A good question is <em>focused</em> and <em>answerable</em> with your resources.</p>
<pre><code>Too broad: "Is AI good for software testing?"
Focused:   "Does using an AI code-review tool reduce the number of
            bugs found in code review for junior developers?"
</code></pre>
<h3>Hypothesis &amp; variables</h3>
<ul>
<li><strong>Hypothesis</strong> — a testable, predictive statement, often "If ... then ...".</li>
<li><strong>Independent variable</strong> — what you change (the AI tool: used / not used).</li>
<li><strong>Dependent variable</strong> — what you measure (number of bugs found).</li>
</ul>
<div class="callout"><span class="badge">Question first, method second</span> Let the question decide the method — not the other way round. "Why do users abandon signup?" is qualitative; "which of two layouts converts better?" is quantitative.</div>`,
    `<span class="eyebrow">ENW493c · Chương 1 · Bài 1.1</span>
<h2>Nghiên cứu là gì? Câu hỏi &amp; giả thuyết</h2>
<p>Nghiên cứu là một <strong>khảo sát có hệ thống</strong> tạo ra tri thức mới, đáng tin — không phải google đến khi thấy ai đó đồng ý. Nó bắt đầu bằng một câu hỏi, thu bằng chứng bằng phương pháp bảo vệ được, và lập luận tới một câu trả lời người khác kiểm tra lại được.</p>
<h3>Định tính vs định lượng</h3>
<ul>
<li><strong>Định lượng (quantitative)</strong> — đo bằng <em>con số</em> để kiểm quan hệ (khảo sát thang điểm, thực nghiệm, chỉ số). Trả lời "bao nhiêu / X có ảnh hưởng Y không". Phân tích bằng thống kê.</li>
<li><strong>Định tính (qualitative)</strong> — khám phá <em>ý nghĩa</em> bằng lời (phỏng vấn, câu hỏi mở, quan sát). Trả lời "vì sao / như thế nào". Phân tích bằng cách tìm chủ đề.</li>
<li><strong>Hỗn hợp (mixed)</strong> — kết hợp cả hai, vd khảo sát để có quy mô cộng phỏng vấn để có chiều sâu.</li>
</ul>
<h3>Câu hỏi nghiên cứu tốt</h3>
<p>Dùng bộ tiêu chí <strong>FINER</strong> — Khả thi, Thú vị, Mới, Đạo đức, Liên quan. Câu hỏi tốt thì <em>hẹp</em> và <em>trả lời được</em> với nguồn lực bạn có.</p>
<pre><code>Quá rộng: "AI có tốt cho kiểm thử phần mềm không?"
Hẹp lại:  "Dùng công cụ AI review code có làm giảm số lỗi tìm thấy
           khi review code của lập trình viên mới không?"
</code></pre>
<h3>Giả thuyết &amp; biến</h3>
<ul>
<li><strong>Giả thuyết</strong> — phát biểu dự đoán, kiểm được, thường dạng "Nếu ... thì ...".</li>
<li><strong>Biến độc lập</strong> — thứ bạn thay đổi (công cụ AI: có dùng / không dùng).</li>
<li><strong>Biến phụ thuộc</strong> — thứ bạn đo (số lỗi tìm thấy).</li>
</ul>
<div class="callout"><span class="badge">Câu hỏi trước, phương pháp sau</span> Để câu hỏi quyết định phương pháp — đừng làm ngược lại. "Vì sao người dùng bỏ dở đăng ký?" là định tính; "trong hai giao diện, cái nào chuyển đổi tốt hơn?" là định lượng.</div>`,
  ]]);

const c1q = quiz('enw493c-quiz-1', 'Quiz 1 — Research & questions|||Quiz 1 — Nghiên cứu & câu hỏi', [
  { id: 'q1', question: 'Nghiên cứu định lượng (quantitative) chủ yếu làm gì?', options: ['Khám phá ý nghĩa bằng lời', 'Đo bằng con số để kiểm quan hệ', 'Chỉ đọc tài liệu cũ', 'Nêu quan điểm cá nhân'], correctIndex: 1, explanation: 'Định lượng đo bằng số và phân tích bằng thống kê; định tính khám phá ý nghĩa bằng lời.' },
  { id: 'q2', question: 'Trong thí nghiệm, biến bạn ĐO (kết quả) gọi là?', options: ['Biến độc lập', 'Biến phụ thuộc', 'Giả thuyết', 'Câu hỏi nghiên cứu'], correctIndex: 1, explanation: 'Biến phụ thuộc là thứ được đo; biến độc lập là thứ bạn chủ động thay đổi.' },
  { id: 'q3', question: 'Bộ tiêu chí FINER cho câu hỏi nghiên cứu KHÔNG bao gồm chữ nào?', options: ['Feasible (khả thi)', 'Ethical (đạo đức)', 'Novel (mới)', 'Fast (nhanh)'], correctIndex: 3, explanation: 'FINER = Feasible, Interesting, Novel, Ethical, Relevant — không có "Fast".' },
]);

const c2 = doc('enw493c-2-1-finding-sources', '2.1 — Finding & evaluating sources|||2.1 — Tìm & đánh giá nguồn',
  'Literature review là gì & để làm gì; nguồn học thuật vs phổ thông (peer-review); tìm trên Google Scholar/thư viện; đánh giá nguồn (CRAAP).',
  [[
    `<span class="eyebrow">ENW493c · Chapter 2 · Lesson 2.1</span>
<h2>Finding &amp; evaluating sources</h2>
<h3>The literature review</h3>
<p>A <strong>literature review</strong> is a structured summary of what is already known about your topic. It shows you have read the field, and — crucially — it exposes the <strong>gap</strong> your research fills. It is a <em>synthesis</em> (grouping ideas across sources), not a list of summaries one after another.</p>
<h3>Scholarly vs popular sources</h3>
<table>
<tr><th>Scholarly</th><th>Popular</th></tr>
<tr><td>Peer-reviewed journals, conference papers</td><td>News sites, blogs, magazines</td></tr>
<tr><td>Written by researchers, cited references</td><td>Written for a general audience</td></tr>
<tr><td>Strong evidence for a paper</td><td>Good for background &amp; context only</td></tr>
</table>
<p><strong>Peer review</strong> means other experts checked the work before publication — a key marker of a reliable academic source.</p>
<h3>Where to search</h3>
<ul>
<li><strong>Google Scholar</strong> — broad academic search; follow "Cited by" to find related work.</li>
<li><strong>Your university library / databases</strong> — IEEE Xplore, ACM Digital Library, ScienceDirect for SE topics.</li>
</ul>
<h3>Evaluate every source — the CRAAP test</h3>
<ul>
<li><strong>C</strong>urrency — is it recent enough for the topic?</li>
<li><strong>R</strong>elevance — does it actually address your question?</li>
<li><strong>A</strong>uthority — who wrote it, and are they credible?</li>
<li><strong>A</strong>ccuracy — is it evidence-based and verifiable?</li>
<li><strong>P</strong>urpose — inform, or persuade/sell?</li>
</ul>
<div class="callout"><span class="badge">Synthesise, don't list</span> "Author A and Author B both found X, but C disagrees because Y" is a synthesis. "A said... B said... C said..." is just a list — and a weak literature review.</div>`,
    `<span class="eyebrow">ENW493c · Chương 2 · Bài 2.1</span>
<h2>Tìm &amp; đánh giá nguồn</h2>
<h3>Tổng quan tài liệu (literature review)</h3>
<p>Một <strong>tổng quan tài liệu</strong> là bản tóm lược có cấu trúc về những gì đã biết quanh đề tài của bạn. Nó cho thấy bạn đã đọc lĩnh vực này, và — quan trọng nhất — nó chỉ ra <strong>khoảng trống (gap)</strong> mà nghiên cứu của bạn lấp vào. Đây là một bản <em>tổng hợp</em> (gom ý qua nhiều nguồn), không phải danh sách tóm tắt nối tiếp nhau.</p>
<h3>Nguồn học thuật vs phổ thông</h3>
<table>
<tr><th>Học thuật</th><th>Phổ thông</th></tr>
<tr><td>Tạp chí bình duyệt, bài hội nghị</td><td>Báo mạng, blog, tạp chí thường</td></tr>
<tr><td>Do nhà nghiên cứu viết, có trích dẫn nguồn</td><td>Viết cho công chúng</td></tr>
<tr><td>Bằng chứng mạnh cho bài</td><td>Chỉ hợp làm bối cảnh &amp; nền</td></tr>
</table>
<p><strong>Bình duyệt (peer review)</strong> nghĩa là các chuyên gia khác đã kiểm tra công trình trước khi xuất bản — dấu hiệu then chốt của nguồn học thuật đáng tin.</p>
<h3>Tìm ở đâu</h3>
<ul>
<li><strong>Google Scholar</strong> — tìm học thuật diện rộng; theo "Cited by" để tìm công trình liên quan.</li>
<li><strong>Thư viện / CSDL của trường</strong> — IEEE Xplore, ACM Digital Library, ScienceDirect cho đề tài SE.</li>
</ul>
<h3>Đánh giá mọi nguồn — bộ CRAAP</h3>
<ul>
<li><strong>C</strong>urrency — đủ mới cho đề tài không?</li>
<li><strong>R</strong>elevance — có thực sự trả lời câu hỏi của bạn không?</li>
<li><strong>A</strong>uthority — ai viết, có đáng tin không?</li>
<li><strong>A</strong>ccuracy — dựa trên bằng chứng, kiểm chứng được không?</li>
<li><strong>P</strong>urpose — để thông tin, hay để thuyết phục/bán hàng?</li>
</ul>
<div class="callout"><span class="badge">Tổng hợp, đừng liệt kê</span> "Tác giả A và B cùng thấy X, nhưng C không đồng ý vì Y" là tổng hợp. "A nói... B nói... C nói..." chỉ là danh sách — và là một tổng quan tài liệu yếu.</div>`,
  ]]);

const c2q = quiz('enw493c-quiz-2', 'Quiz 2 — Sources|||Quiz 2 — Nguồn tài liệu', [
  { id: 'q1', question: '"Peer review" (bình duyệt) nghĩa là?', options: ['Tác giả tự đọc lại', 'Chuyên gia khác kiểm tra trước khi xuất bản', 'Có nhiều người đọc', 'Được đăng trên báo lớn'], correctIndex: 1, explanation: 'Peer review = các chuyên gia độc lập thẩm định trước khi công bố — dấu hiệu nguồn đáng tin.' },
  { id: 'q2', question: 'Mục đích chính của literature review là?', options: ['Kéo dài bài viết', 'Tổng hợp cái đã biết và chỉ ra khoảng trống nghiên cứu', 'Liệt kê mọi bài từng đọc', 'Thay cho phần kết luận'], correctIndex: 1, explanation: 'Literature review tổng hợp tri thức hiện có và làm lộ gap mà nghiên cứu của bạn lấp vào.' },
  { id: 'q3', question: 'Trong bộ CRAAP, chữ "A" (Authority) hỏi điều gì?', options: ['Tài liệu mới đến đâu', 'Ai viết và có đáng tin không', 'Có liên quan không', 'Mục đích là gì'], correctIndex: 1, explanation: 'Authority = uy tín/chuyên môn của tác giả và nơi xuất bản.' },
]);

const c3 = doc('enw493c-3-1-citation-plagiarism', '3.1 — Citation, references & plagiarism|||3.1 — Trích dẫn, tài liệu tham khảo & đạo văn',
  'Vì sao phải trích dẫn; APA vs IEEE; in-text citation & reference list; đạo văn là gì & cách tránh; quản lý bằng Zotero.',
  [[
    `<span class="eyebrow">ENW493c · Chapter 3 · Lesson 3.1</span>
<h2>Citation, references &amp; plagiarism</h2>
<p>You cite to <strong>give credit</strong>, to let readers verify your claims, and to place your work in the scholarly conversation. Every citation has two parts: a short <strong>in-text citation</strong> and a full entry in the <strong>reference list</strong>.</p>
<h3>APA vs IEEE</h3>
<table>
<tr><th>Style</th><th>In-text</th><th>Common in</th></tr>
<tr><td>APA (author–date)</td><td>(Nguyen, 2023)</td><td>Social science, education, general</td></tr>
<tr><td>IEEE (numbered)</td><td>[1]</td><td>Engineering, computer science</td></tr>
</table>
<h3>Examples — the same source, two styles</h3>
<pre><code>APA in-text:  Automated review reduced defects (Nguyen &amp; Tran, 2023).
APA reference:
  Nguyen, A., &amp; Tran, B. (2023). Automated code review in agile teams.
  Journal of Software Engineering, 15(2), 45-60.

IEEE in-text: Automated review reduced defects [1].
IEEE reference:
  [1] A. Nguyen and B. Tran, "Automated code review in agile teams,"
      J. Softw. Eng., vol. 15, no. 2, pp. 45-60, 2023.
</code></pre>
<h3>Plagiarism — and how to avoid it</h3>
<p><strong>Plagiarism</strong> is presenting someone else's words or ideas as your own. It includes copy-paste, weak paraphrase (changing a few words), and forgetting to cite. Avoid it by:</p>
<ul>
<li><strong>Quoting</strong> exact words in "quotation marks" with a citation, or</li>
<li><strong>Paraphrasing</strong> — restating the idea fully in your own words <em>and still citing</em>, or</li>
<li><strong>Summarising</strong> the main point in your words, with a citation.</li>
</ul>
<div class="callout"><span class="badge">Let a tool do the bookkeeping</span> <strong>Zotero</strong> saves each source with one click, inserts in-text citations, and builds the reference list in APA or IEEE automatically — switch styles with a dropdown. It removes the most common cause of lost marks: formatting slips.</div>`,
    `<span class="eyebrow">ENW493c · Chương 3 · Bài 3.1</span>
<h2>Trích dẫn, tài liệu tham khảo &amp; đạo văn</h2>
<p>Bạn trích dẫn để <strong>ghi công</strong>, để người đọc kiểm chứng khẳng định của bạn, và để đặt công trình vào cuộc đối thoại học thuật. Mỗi trích dẫn có hai phần: một <strong>trích dẫn trong bài (in-text)</strong> ngắn và một mục đầy đủ trong <strong>danh mục tài liệu tham khảo</strong>.</p>
<h3>APA vs IEEE</h3>
<table>
<tr><th>Chuẩn</th><th>Trong bài</th><th>Phổ biến ở</th></tr>
<tr><td>APA (tác giả–năm)</td><td>(Nguyen, 2023)</td><td>KHXH, giáo dục, tổng quát</td></tr>
<tr><td>IEEE (đánh số)</td><td>[1]</td><td>Kỹ thuật, khoa học máy tính</td></tr>
</table>
<h3>Ví dụ — cùng một nguồn, hai chuẩn</h3>
<pre><code>APA trong bài:  Review tự động làm giảm lỗi (Nguyen &amp; Tran, 2023).
APA tài liệu:
  Nguyen, A., &amp; Tran, B. (2023). Automated code review in agile teams.
  Journal of Software Engineering, 15(2), 45-60.

IEEE trong bài: Review tự động làm giảm lỗi [1].
IEEE tài liệu:
  [1] A. Nguyen and B. Tran, "Automated code review in agile teams,"
      J. Softw. Eng., vol. 15, no. 2, pp. 45-60, 2023.
</code></pre>
<h3>Đạo văn — và cách tránh</h3>
<p><strong>Đạo văn (plagiarism)</strong> là trình bày lời hay ý của người khác như của mình. Nó gồm copy-paste, diễn giải hời hợt (đổi vài chữ), và quên trích dẫn. Tránh bằng cách:</p>
<ul>
<li><strong>Trích dẫn nguyên văn</strong> đặt trong "dấu ngoặc kép" kèm nguồn, hoặc</li>
<li><strong>Diễn giải (paraphrase)</strong> — nói lại trọn ý bằng lời của bạn <em>và vẫn trích nguồn</em>, hoặc</li>
<li><strong>Tóm tắt</strong> ý chính bằng lời của bạn, có trích nguồn.</li>
</ul>
<div class="callout"><span class="badge">Để công cụ lo phần sổ sách</span> <strong>Zotero</strong> lưu mỗi nguồn bằng một cú nhấp, chèn trích dẫn trong bài, và dựng danh mục tham khảo theo APA hay IEEE tự động — đổi chuẩn bằng một menu. Nó gỡ nguyên nhân mất điểm phổ biến nhất: sai định dạng.</div>`,
  ]]);

const c3q = quiz('enw493c-quiz-3', 'Quiz 3 — Citation & plagiarism|||Quiz 3 — Trích dẫn & đạo văn', [
  { id: 'q1', question: 'Chuẩn trích dẫn nào dùng số trong ngoặc vuông như [1], phổ biến trong khoa học máy tính?', options: ['APA', 'MLA', 'IEEE', 'Chicago'], correctIndex: 2, explanation: 'IEEE dùng số [1]; APA dùng (tác giả, năm).' },
  { id: 'q2', question: 'Diễn giải (paraphrase) đúng cách nghĩa là?', options: ['Đổi vài chữ, giữ nguyên câu gốc', 'Nói lại trọn ý bằng lời của mình VÀ vẫn trích nguồn', 'Chép nguyên nhưng không để ngoặc kép', 'Không cần trích vì đã đổi chữ'], correctIndex: 1, explanation: 'Paraphrase đúng là viết lại hoàn toàn bằng lời mình và vẫn trích nguồn; đổi vài chữ vẫn là đạo văn.' },
  { id: 'q3', question: 'Công cụ Zotero giúp gì?', options: ['Viết bài thay bạn', 'Thu thập nguồn và tạo trích dẫn/danh mục tự động', 'Chấm điểm bài', 'Dịch bài sang tiếng Anh'], correctIndex: 1, explanation: 'Zotero quản lý nguồn, chèn in-text citation và dựng reference list theo chuẩn chọn sẵn.' },
]);

const c4 = doc('enw493c-4-1-imrad-structure', '4.1 — Structure of an academic paper (IMRaD)|||4.1 — Cấu trúc bài viết học thuật (IMRaD)',
  'IMRaD (Introduction, Methods, Results, and Discussion); abstract; mở–thân–kết; vai trò từng phần.',
  [[
    `<span class="eyebrow">ENW493c · Chapter 4 · Lesson 4.1</span>
<h2>Structure of an academic paper — IMRaD</h2>
<p>Most empirical papers follow <strong>IMRaD</strong>, a shape so standard that reviewers know exactly where to look. Each section answers one question.</p>
<pre><code>Abstract    -> the whole paper in ~200 words (last thing you write)
Introduction-> What is the problem, and why does it matter?  (+ gap, aim)
Methods     -> What did you do, so others can reproduce it?
Results     -> What did you find?  (facts only, no interpretation)
Discussion  -> What does it mean?  (interpretation, limits, future work)
</code></pre>
<h3>The shape: wide → narrow → wide</h3>
<p>Introduction and Discussion are <strong>broad</strong> (context, meaning); Methods and Results are <strong>narrow</strong> (specific, factual). It looks like an hourglass: you funnel from the general problem down to your specific study, then open back out to what it means for the field.</p>
<h3>The abstract</h3>
<p>A one-paragraph summary containing <strong>purpose, method, key result, and conclusion</strong>. Readers decide from the abstract alone whether to read on — so write it last, and make every word earn its place.</p>
<h3>Intro–body–conclusion inside a section</h3>
<ul>
<li><strong>Introduction</strong> — hook, background, gap, and your aim/thesis at the end.</li>
<li><strong>Body</strong> — one idea per paragraph, in a logical order.</li>
<li><strong>Conclusion</strong> — restate the finding, its significance, and what comes next (no new evidence).</li>
</ul>
<div class="callout"><span class="badge">Results ≠ Discussion</span> Keep them apart. Results state "the AI group found 30% more bugs." Discussion explains "this suggests automated review complements human reviewers, though our sample was small."</div>`,
    `<span class="eyebrow">ENW493c · Chương 4 · Bài 4.1</span>
<h2>Cấu trúc bài viết học thuật — IMRaD</h2>
<p>Hầu hết bài thực nghiệm theo <strong>IMRaD</strong>, một hình dạng chuẩn đến mức người bình duyệt biết ngay cần tìm gì ở đâu. Mỗi phần trả lời một câu hỏi.</p>
<pre><code>Abstract    -> cả bài gói trong ~200 chữ (viết sau cùng)
Introduction-> Vấn đề là gì, vì sao quan trọng?  (+ gap, mục tiêu)
Methods     -> Bạn đã làm gì, để người khác lặp lại được?
Results     -> Bạn tìm thấy gì?  (chỉ dữ kiện, không diễn giải)
Discussion  -> Nó có nghĩa gì?  (diễn giải, hạn chế, hướng tiếp)
</code></pre>
<h3>Hình dạng: rộng → hẹp → rộng</h3>
<p>Introduction và Discussion thì <strong>rộng</strong> (bối cảnh, ý nghĩa); Methods và Results thì <strong>hẹp</strong> (cụ thể, dữ kiện). Trông như đồng hồ cát: bạn thu hẹp từ vấn đề chung xuống nghiên cứu cụ thể, rồi mở lại ra ý nghĩa cho lĩnh vực.</p>
<h3>Abstract</h3>
<p>Tóm tắt một đoạn gồm <strong>mục đích, phương pháp, kết quả chính và kết luận</strong>. Người đọc quyết định đọc tiếp hay không chỉ từ abstract — nên viết nó sau cùng, và mỗi chữ phải xứng đáng.</p>
<h3>Mở–thân–kết trong một phần</h3>
<ul>
<li><strong>Mở bài</strong> — dẫn nhập, bối cảnh, gap, và mục tiêu/luận điểm đặt ở cuối.</li>
<li><strong>Thân bài</strong> — mỗi đoạn một ý, theo trật tự hợp lý.</li>
<li><strong>Kết bài</strong> — nhắc lại phát hiện, ý nghĩa và bước tiếp (không đưa bằng chứng mới).</li>
</ul>
<div class="callout"><span class="badge">Results ≠ Discussion</span> Giữ hai phần tách bạch. Results nêu "nhóm dùng AI tìm nhiều hơn 30% lỗi." Discussion giải thích "điều này gợi ý review tự động bổ trợ cho người review, dù mẫu của chúng tôi còn nhỏ."</div>`,
  ]]);

const c4q = quiz('enw493c-quiz-4', 'Quiz 4 — IMRaD|||Quiz 4 — IMRaD', [
  { id: 'q1', question: 'Chữ "M" trong IMRaD là phần nào?', options: ['Motivation', 'Methods (Phương pháp)', 'Materials', 'Meaning'], correctIndex: 1, explanation: 'IMRaD = Introduction, Methods, Results, and Discussion. Methods mô tả cách làm để người khác lặp lại được.' },
  { id: 'q2', question: 'Phần Results (Kết quả) nên chứa gì?', options: ['Diễn giải và bàn luận ý nghĩa', 'Chỉ trình bày dữ kiện/phát hiện, chưa diễn giải', 'Đề xuất hướng nghiên cứu tương lai', 'Tổng quan tài liệu'], correctIndex: 1, explanation: 'Results chỉ nêu phát hiện; diễn giải và ý nghĩa để dành cho Discussion.' },
  { id: 'q3', question: 'Vì sao nên viết Abstract SAU CÙNG?', options: ['Vì nó không quan trọng', 'Vì nó tóm tắt toàn bài — chỉ viết chính xác khi bài đã xong', 'Vì giáo viên yêu cầu', 'Vì abstract dài nhất'], correctIndex: 1, explanation: 'Abstract gói mục đích/phương pháp/kết quả/kết luận, nên viết sau khi đã có đủ các phần đó.' },
]);

const c5 = doc('enw493c-5-1-paragraphs', '5.1 — Writing paragraphs: coherence & cohesion|||5.1 — Viết đoạn văn: mạch lạc & liên kết',
  'Topic sentence & đoạn văn thống nhất; coherence (ý nối ý) vs cohesion (liên kết ngôn ngữ); từ chuyển ý (transitions).',
  [[
    `<span class="eyebrow">ENW493c · Chapter 5 · Lesson 5.1</span>
<h2>Writing paragraphs: coherence &amp; cohesion</h2>
<p>A paragraph is one <strong>unit of thought</strong> — one idea, developed. The reader should be able to see that idea in the first sentence and never get lost.</p>
<h3>Topic sentence + support</h3>
<p>Open with a <strong>topic sentence</strong> that states the paragraph's single point, then support it with explanation, evidence and an example. A common shape is <strong>P-E-E-L</strong>: Point, Evidence, Explanation, Link.</p>
<h3>Coherence vs cohesion</h3>
<ul>
<li><strong>Coherence</strong> — the ideas <em>logically</em> flow and stay on one point. It is about meaning and order.</li>
<li><strong>Cohesion</strong> — the <em>words</em> connect: transitions, pronouns, and repeated key terms stitch sentences together on the surface.</li>
</ul>
<h3>Transitions — signpost the logic</h3>
<table>
<tr><th>To...</th><th>Use</th></tr>
<tr><td>add</td><td>moreover, in addition, furthermore</td></tr>
<tr><td>contrast</td><td>however, in contrast, nevertheless</td></tr>
<tr><td>show cause</td><td>therefore, consequently, as a result</td></tr>
<tr><td>give example</td><td>for instance, for example, specifically</td></tr>
</table>
<pre><code>Weak (no cohesion):
  Automated review finds bugs early. Human review is slow.
Cohesive:
  Automated review finds bugs early; human review, HOWEVER,
  is slower but catches design issues machines miss.
</code></pre>
<div class="callout"><span class="badge">One idea, one paragraph</span> If you can't write a topic sentence that covers the whole paragraph, it probably contains two ideas — split it. If two paragraphs make the same point, merge them.</div>`,
    `<span class="eyebrow">ENW493c · Chương 5 · Bài 5.1</span>
<h2>Viết đoạn văn: mạch lạc &amp; liên kết</h2>
<p>Một đoạn văn là một <strong>đơn vị ý tưởng</strong> — một ý, được triển khai. Người đọc phải thấy được ý đó ngay câu đầu và không bao giờ lạc.</p>
<h3>Câu chủ đề + phần chống đỡ</h3>
<p>Mở bằng một <strong>câu chủ đề (topic sentence)</strong> nêu ý duy nhất của đoạn, rồi chống đỡ bằng giải thích, bằng chứng và ví dụ. Một khung phổ biến là <strong>P-E-E-L</strong>: Point (điểm), Evidence (bằng chứng), Explanation (giải thích), Link (nối).</p>
<h3>Mạch lạc (coherence) vs liên kết (cohesion)</h3>
<ul>
<li><strong>Mạch lạc (coherence)</strong> — các ý chảy theo <em>lô-gic</em> và bám một điểm. Nói về ý nghĩa và trật tự.</li>
<li><strong>Liên kết (cohesion)</strong> — các <em>từ ngữ</em> nối nhau: từ chuyển ý, đại từ, và lặp lại thuật ngữ then chốt khâu các câu lại trên bề mặt.</li>
</ul>
<h3>Từ chuyển ý — cắm biển chỉ đường cho lô-gic</h3>
<table>
<tr><th>Để...</th><th>Dùng</th></tr>
<tr><td>bổ sung</td><td>moreover, in addition, furthermore</td></tr>
<tr><td>tương phản</td><td>however, in contrast, nevertheless</td></tr>
<tr><td>chỉ nguyên nhân</td><td>therefore, consequently, as a result</td></tr>
<tr><td>nêu ví dụ</td><td>for instance, for example, specifically</td></tr>
</table>
<pre><code>Yếu (thiếu liên kết):
  Review tự động tìm lỗi sớm. Review người thì chậm.
Có liên kết:
  Review tự động tìm lỗi sớm; TUY NHIÊN review người
  chậm hơn nhưng bắt được vấn đề thiết kế mà máy bỏ sót.
</code></pre>
<div class="callout"><span class="badge">Một ý, một đoạn</span> Nếu không viết nổi một câu chủ đề bao trọn cả đoạn, đoạn đó có lẽ chứa hai ý — hãy tách. Nếu hai đoạn cùng nói một điểm, hãy gộp.</div>`,
  ]]);

const c5q = quiz('enw493c-quiz-5', 'Quiz 5 — Paragraphs|||Quiz 5 — Đoạn văn', [
  { id: 'q1', question: 'Câu chủ đề (topic sentence) làm gì?', options: ['Kết thúc đoạn', 'Nêu ý chính duy nhất của cả đoạn', 'Trích dẫn nguồn', 'Đưa số liệu thống kê'], correctIndex: 1, explanation: 'Topic sentence nêu điểm duy nhất mà cả đoạn triển khai, thường đặt ở đầu đoạn.' },
  { id: 'q2', question: 'Sự khác nhau giữa coherence và cohesion?', options: ['Không khác gì', 'Coherence là lô-gic/trật tự ý; cohesion là liên kết ngôn ngữ trên bề mặt', 'Coherence là chính tả; cohesion là ngữ pháp', 'Cả hai đều chỉ độ dài đoạn'], correctIndex: 1, explanation: 'Coherence = ý chảy hợp lô-gic; cohesion = từ nối (transition, đại từ, lặp thuật ngữ) khâu câu lại.' },
  { id: 'q3', question: 'Từ chuyển ý nào dùng để chỉ TƯƠNG PHẢN?', options: ['Moreover', 'However', 'Therefore', 'For example'], correctIndex: 1, explanation: '"However" chỉ tương phản; "moreover" bổ sung, "therefore" chỉ kết quả, "for example" nêu ví dụ.' },
]);

const c6 = doc('enw493c-6-1-argument', '6.1 — Argument & critical thinking|||6.1 — Lập luận & tư duy phản biện',
  'Thesis statement; claim–evidence–reasoning; lô-gic & nguỵ biện; phản biện (counterargument & rebuttal).',
  [[
    `<span class="eyebrow">ENW493c · Chapter 6 · Lesson 6.1</span>
<h2>Argument &amp; critical thinking</h2>
<p>An academic argument is not a quarrel — it is a <strong>reasoned case</strong> built from a claim and evidence, that honestly engages opposing views.</p>
<h3>The thesis statement</h3>
<p>Your <strong>thesis</strong> is the single, arguable claim the whole paper defends. It must be <em>debatable</em> (someone could disagree) and <em>specific</em>.</p>
<pre><code>Not a thesis: "This paper is about AI code review."   (a topic)
A thesis:     "AI code review improves defect detection for junior
               developers, but only when paired with human review."
</code></pre>
<h3>Claim – Evidence – Reasoning</h3>
<ul>
<li><strong>Claim</strong> — the point you assert.</li>
<li><strong>Evidence</strong> — data or cited sources that support it.</li>
<li><strong>Reasoning</strong> — the explicit link explaining <em>why</em> the evidence supports the claim. Never leave this implicit.</li>
</ul>
<h3>Logic &amp; common fallacies</h3>
<ul>
<li><strong>Ad hominem</strong> — attacking the person, not the argument.</li>
<li><strong>Hasty generalisation</strong> — a sweeping claim from too little data.</li>
<li><strong>Correlation ≠ causation</strong> — two things moving together does not prove one causes the other.</li>
</ul>
<h3>Counterargument &amp; rebuttal</h3>
<p>Strong writing <strong>anticipates objections</strong>. State the opposing view fairly (counterargument), then answer it (rebuttal): "Some argue X; however, the evidence shows Y." Ignoring the other side makes your case look weaker, not stronger.</p>
<div class="callout"><span class="badge">Concede, then counter</span> Admitting what is true in the opposing view ("automated tools do miss design flaws") builds credibility — then you show why your thesis still holds.</div>`,
    `<span class="eyebrow">ENW493c · Chương 6 · Bài 6.1</span>
<h2>Lập luận &amp; tư duy phản biện</h2>
<p>Lập luận học thuật không phải cãi nhau — nó là một <strong>lý lẽ có cơ sở</strong> dựng từ một khẳng định và bằng chứng, và trung thực đối diện với quan điểm trái chiều.</p>
<h3>Luận điểm (thesis statement)</h3>
<p><strong>Luận điểm</strong> của bạn là khẳng định duy nhất, tranh luận được, mà cả bài bảo vệ. Nó phải <em>bàn cãi được</em> (có người có thể không đồng ý) và <em>cụ thể</em>.</p>
<pre><code>Không phải luận điểm: "Bài này nói về AI review code."  (một chủ đề)
Là luận điểm:         "AI review code cải thiện phát hiện lỗi cho
                       lập trình viên mới, nhưng chỉ khi đi kèm
                       review của con người."
</code></pre>
<h3>Khẳng định – Bằng chứng – Lập luận</h3>
<ul>
<li><strong>Khẳng định (claim)</strong> — điểm bạn nêu.</li>
<li><strong>Bằng chứng (evidence)</strong> — dữ liệu hoặc nguồn trích dẫn chống đỡ nó.</li>
<li><strong>Lập luận (reasoning)</strong> — cầu nối tường minh giải thích <em>vì sao</em> bằng chứng chống đỡ khẳng định. Đừng bao giờ để ngầm.</li>
</ul>
<h3>Lô-gic &amp; nguỵ biện thường gặp</h3>
<ul>
<li><strong>Công kích cá nhân (ad hominem)</strong> — đánh vào người, không vào lập luận.</li>
<li><strong>Vơ đũa (hasty generalisation)</strong> — kết luận rộng từ quá ít dữ liệu.</li>
<li><strong>Tương quan ≠ nhân quả</strong> — hai thứ biến động cùng nhau không chứng minh cái này gây ra cái kia.</li>
</ul>
<h3>Phản biện &amp; bác lại (counterargument &amp; rebuttal)</h3>
<p>Viết mạnh thì <strong>lường trước phản đối</strong>. Nêu quan điểm trái chiều một cách công bằng (counterargument), rồi trả lời nó (rebuttal): "Có người cho rằng X; tuy nhiên, bằng chứng cho thấy Y." Lờ đi phía bên kia làm lý lẽ của bạn yếu hơn, không mạnh hơn.</p>
<div class="callout"><span class="badge">Nhượng bộ, rồi phản lại</span> Thừa nhận điều đúng ở quan điểm trái chiều ("công cụ tự động đúng là bỏ sót lỗi thiết kế") tạo độ tin cậy — rồi bạn chỉ ra vì sao luận điểm của mình vẫn đứng vững.</div>`,
  ]]);

const c6q = quiz('enw493c-quiz-6', 'Quiz 6 — Argument|||Quiz 6 — Lập luận', [
  { id: 'q1', question: 'Một thesis statement tốt phải?', options: ['Chỉ là một chủ đề chung chung', 'Là khẳng định cụ thể, tranh luận được', 'Không ai phản đối được', 'Dài ít nhất một đoạn'], correctIndex: 1, explanation: 'Thesis phải cụ thể và debatable — có thể có người không đồng ý và bạn bảo vệ nó bằng bằng chứng.' },
  { id: 'q2', question: 'Nguỵ biện "correlation ≠ causation" cảnh báo điều gì?', options: ['Đừng công kích cá nhân', 'Hai thứ biến động cùng nhau không chứng minh cái này gây ra cái kia', 'Đừng vơ đũa cả nắm', 'Phải luôn trích nguồn'], correctIndex: 1, explanation: 'Tương quan không đồng nghĩa nhân quả — cần bằng chứng riêng để chứng minh quan hệ nguyên nhân.' },
  { id: 'q3', question: 'Trong lập luận, phần "rebuttal" là?', options: ['Nêu quan điểm trái chiều', 'Trả lời/bác lại quan điểm trái chiều', 'Trích dẫn nguồn', 'Câu chủ đề của đoạn'], correctIndex: 1, explanation: 'Counterargument nêu ý trái chiều; rebuttal là phần bạn đáp lại và cho thấy luận điểm mình vẫn vững.' },
]);

const c7 = doc('enw493c-7-1-data-collection-ethics', '7.1 — Data collection methods & research ethics|||7.1 — Thu thập dữ liệu & đạo đức nghiên cứu',
  'Khảo sát, phỏng vấn, thực nghiệm, quan sát; mẫu (population/sample); độ tin cậy & giá trị; đạo đức (đồng thuận, ẩn danh, tránh gian lận).',
  [[
    `<span class="eyebrow">ENW493c · Chapter 7 · Lesson 7.1</span>
<h2>Data collection methods &amp; research ethics</h2>
<h3>Ways to collect data</h3>
<ul>
<li><strong>Survey / questionnaire</strong> — many responses, structured; good for measuring attitudes at scale (quantitative).</li>
<li><strong>Interview</strong> — deep, flexible; good for exploring "why" (qualitative). Can be structured, semi-structured, or open.</li>
<li><strong>Experiment</strong> — manipulate a variable, measure the effect, ideally with a control group.</li>
<li><strong>Observation</strong> — watch behaviour in context, recording what actually happens.</li>
</ul>
<h3>Sampling</h3>
<p>You rarely study everyone (the <strong>population</strong>), so you study a <strong>sample</strong>. A <em>representative</em> sample lets you generalise; a biased one does not. Watch out for <strong>sampling bias</strong> — e.g. only surveying your own friends.</p>
<h3>Reliability vs validity</h3>
<ul>
<li><strong>Reliability</strong> — consistency: the same measurement gives the same result if repeated.</li>
<li><strong>Validity</strong> — accuracy: you are actually measuring what you claim to measure.</li>
</ul>
<h3>Research ethics</h3>
<ul>
<li><strong>Informed consent</strong> — participants know what the study involves and agree freely.</li>
<li><strong>Anonymity / confidentiality</strong> — protect participants' identities and data.</li>
<li><strong>No harm</strong> — the study must not put participants at risk.</li>
<li><strong>Integrity</strong> — never fabricate, falsify, or selectively hide data.</li>
</ul>
<div class="callout"><span class="badge">Ethics is not optional</span> Fabricating results or skipping consent invalidates the whole study — and, in academia and industry alike, ends careers. Design the ethics in from the start, not as an afterthought.</div>`,
    `<span class="eyebrow">ENW493c · Chương 7 · Bài 7.1</span>
<h2>Thu thập dữ liệu &amp; đạo đức nghiên cứu</h2>
<h3>Các cách thu thập dữ liệu</h3>
<ul>
<li><strong>Khảo sát / bảng hỏi</strong> — nhiều phản hồi, có cấu trúc; hợp để đo thái độ ở quy mô lớn (định lượng).</li>
<li><strong>Phỏng vấn</strong> — sâu, linh hoạt; hợp để khám phá "vì sao" (định tính). Có thể có cấu trúc, bán cấu trúc, hoặc mở.</li>
<li><strong>Thực nghiệm</strong> — thay đổi một biến, đo tác động, tốt nhất là có nhóm đối chứng.</li>
<li><strong>Quan sát</strong> — theo dõi hành vi trong bối cảnh, ghi lại những gì thực sự diễn ra.</li>
</ul>
<h3>Chọn mẫu (sampling)</h3>
<p>Bạn hiếm khi nghiên cứu tất cả (<strong>tổng thể/population</strong>), nên bạn nghiên cứu một <strong>mẫu (sample)</strong>. Mẫu <em>đại diện</em> cho phép khái quát hoá; mẫu thiên lệch thì không. Coi chừng <strong>thiên lệch chọn mẫu</strong> — vd chỉ khảo sát bạn bè mình.</p>
<h3>Độ tin cậy vs giá trị</h3>
<ul>
<li><strong>Độ tin cậy (reliability)</strong> — tính nhất quán: cùng phép đo lặp lại cho cùng kết quả.</li>
<li><strong>Giá trị (validity)</strong> — tính chính xác: bạn thực sự đo đúng thứ bạn tuyên bố đo.</li>
</ul>
<h3>Đạo đức nghiên cứu</h3>
<ul>
<li><strong>Đồng thuận có hiểu biết (informed consent)</strong> — người tham gia biết nghiên cứu gồm gì và tự nguyện đồng ý.</li>
<li><strong>Ẩn danh / bảo mật</strong> — bảo vệ danh tính và dữ liệu người tham gia.</li>
<li><strong>Không gây hại</strong> — nghiên cứu không được đặt người tham gia vào rủi ro.</li>
<li><strong>Liêm chính</strong> — không bịa, không xuyên tạc, không giấu chọn lọc dữ liệu.</li>
</ul>
<div class="callout"><span class="badge">Đạo đức không phải tuỳ chọn</span> Bịa kết quả hay bỏ qua đồng thuận làm vô hiệu cả nghiên cứu — và ở cả học thuật lẫn công nghiệp, nó chấm dứt sự nghiệp. Hãy thiết kế đạo đức ngay từ đầu, không phải nghĩ sau.</div>`,
  ]]);

const c7q = quiz('enw493c-quiz-7', 'Quiz 7 — Data & ethics|||Quiz 7 — Dữ liệu & đạo đức', [
  { id: 'q1', question: 'Phương pháp nào hợp nhất để khám phá SÂU câu hỏi "vì sao"?', options: ['Khảo sát quy mô lớn', 'Phỏng vấn (định tính)', 'Đếm số lượt tải', 'Bảng hỏi trắc nghiệm'], correctIndex: 1, explanation: 'Phỏng vấn cho chiều sâu và sự linh hoạt, hợp để hiểu "vì sao/như thế nào".' },
  { id: 'q2', question: 'Sự khác nhau giữa reliability và validity?', options: ['Giống nhau', 'Reliability là nhất quán khi lặp lại; validity là đo đúng thứ cần đo', 'Reliability là đo đúng; validity là lặp lại', 'Cả hai chỉ cỡ mẫu'], correctIndex: 1, explanation: 'Reliability = nhất quán/lặp lại ra cùng kết quả; validity = chính xác, đo đúng khái niệm cần đo.' },
  { id: 'q3', question: '"Informed consent" (đồng thuận có hiểu biết) trong đạo đức nghiên cứu nghĩa là?', options: ['Người tham gia biết rõ và tự nguyện đồng ý', 'Nghiên cứu được cấp kinh phí', 'Dữ liệu được mã hoá', 'Kết quả được công bố'], correctIndex: 0, explanation: 'Người tham gia phải hiểu nghiên cứu gồm gì và đồng ý một cách tự nguyện trước khi tham gia.' },
]);

const c8 = doc('enw493c-8-1-academic-style', '8.1 — Academic style: objectivity, hedging & common errors|||8.1 — Văn phong học thuật: khách quan, hedging & lỗi thường gặp',
  'Khách quan & chính xác; hedging (rào đón thận trọng); từ vựng học thuật; lỗi thường gặp (đại từ ngôi 1, từ nói, câu quá dài, khẳng định tuyệt đối).',
  [[
    `<span class="eyebrow">ENW493c · Chapter 8 · Lesson 8.1</span>
<h2>Academic style: objectivity, hedging &amp; common errors</h2>
<h3>Objective &amp; precise</h3>
<p>Academic writing is <strong>impersonal, precise and formal</strong>. Prefer specific nouns over vague ones ("three defects" not "some problems"), and let the evidence — not your emotion — carry the point.</p>
<h3>Hedging — claim carefully</h3>
<p><strong>Hedging</strong> is cautious, qualified language. Research rarely proves things absolutely, so scholars write "<em>may</em>", "<em>suggests</em>", "<em>appears to</em>", "<em>tends to</em>" rather than "proves" or "always". It signals honesty about certainty.</p>
<pre><code>Overclaiming: "AI review ALWAYS eliminates bugs."
Hedged:       "AI review MAY reduce certain classes of bugs,
               although human review REMAINS necessary."
</code></pre>
<h3>Common errors to avoid</h3>
<table>
<tr><th>Avoid</th><th>Prefer</th></tr>
<tr><td>Contractions (don't, it's)</td><td>do not, it is</td></tr>
<tr><td>Informal words (a lot, kids, stuff)</td><td>many, children, elements</td></tr>
<tr><td>Absolute claims (always, never, proves)</td><td>often, rarely, suggests</td></tr>
<tr><td>Vague quantifiers (some, a few)</td><td>exact figures where possible</td></tr>
<tr><td>Very long run-on sentences</td><td>one idea per sentence</td></tr>
</table>
<p><strong>First person?</strong> Many technical styles avoid "I/we" (using the passive: "a survey was conducted"), though some journals now accept "we". Follow your course's required style.</p>
<div class="callout"><span class="badge">Precise, not fancy</span> Academic ≠ using big words. It means being <em>exact</em> and <em>honest about certainty</em>. A clear, hedged sentence beats an impressive but overstated one.</div>`,
    `<span class="eyebrow">ENW493c · Chương 8 · Bài 8.1</span>
<h2>Văn phong học thuật: khách quan, hedging &amp; lỗi thường gặp</h2>
<h3>Khách quan &amp; chính xác</h3>
<p>Viết học thuật thì <strong>vô ngã, chính xác và trang trọng</strong>. Ưu tiên danh từ cụ thể thay vì mơ hồ ("ba lỗi" thay vì "một số vấn đề"), và để bằng chứng — không phải cảm xúc — gánh lấy điểm chính.</p>
<h3>Hedging — khẳng định thận trọng</h3>
<p><strong>Hedging (rào đón)</strong> là cách nói dè dặt, có điều kiện. Nghiên cứu hiếm khi chứng minh điều gì tuyệt đối, nên giới học thuật viết "<em>may/có thể</em>", "<em>suggests/gợi ý</em>", "<em>appears to/dường như</em>", "<em>tends to/có xu hướng</em>" thay vì "chứng minh" hay "luôn luôn". Nó thể hiện sự trung thực về mức độ chắc chắn.</p>
<pre><code>Nói quá: "AI review LUÔN LUÔN loại bỏ hết lỗi."
Rào đón: "AI review CÓ THỂ giảm một số nhóm lỗi nhất định,
          dù review của con người VẪN cần thiết."
</code></pre>
<h3>Lỗi thường gặp cần tránh</h3>
<table>
<tr><th>Tránh</th><th>Nên dùng</th></tr>
<tr><td>Viết tắt (don't, it's)</td><td>do not, it is</td></tr>
<tr><td>Từ nói (a lot, kids, stuff)</td><td>many, children, elements</td></tr>
<tr><td>Khẳng định tuyệt đối (always, never, proves)</td><td>often, rarely, suggests</td></tr>
<tr><td>Lượng từ mơ hồ (some, a few)</td><td>con số chính xác khi có thể</td></tr>
<tr><td>Câu quá dài lê thê</td><td>mỗi câu một ý</td></tr>
</table>
<p><strong>Ngôi thứ nhất?</strong> Nhiều văn phong kỹ thuật tránh "I/we" (dùng bị động: "a survey was conducted"), dù một số tạp chí nay chấp nhận "we". Hãy theo chuẩn môn học yêu cầu.</p>
<div class="callout"><span class="badge">Chính xác, không phải hoa mỹ</span> Học thuật ≠ dùng từ to. Nó là <em>chính xác</em> và <em>trung thực về mức độ chắc chắn</em>. Một câu rõ, có rào đón thắng một câu nghe kêu nhưng nói quá.</div>`,
  ]]);

const c8q = quiz('enw493c-quiz-8', 'Quiz 8 — Academic style|||Quiz 8 — Văn phong học thuật', [
  { id: 'q1', question: '"Hedging" trong văn phong học thuật là?', options: ['Dùng từ càng to càng tốt', 'Ngôn ngữ thận trọng, có điều kiện (may, suggests, tends to)', 'Viết tắt cho gọn', 'Dùng ngôi thứ nhất'], correctIndex: 1, explanation: 'Hedging là rào đón — thừa nhận mức độ chắc chắn giới hạn bằng các từ như "may", "suggests".' },
  { id: 'q2', question: 'Câu nào phù hợp văn phong học thuật NHẤT?', options: ['AI luôn luôn loại bỏ hết lỗi.', 'AI có thể giảm một số nhóm lỗi nhất định.', 'AI review là đỉnh nhất.', "AI's gonna fix all bugs."], correctIndex: 1, explanation: 'Câu có rào đón, cụ thể và không nói quá là phù hợp nhất; "luôn/hết" là khẳng định tuyệt đối cần tránh.' },
  { id: 'q3', question: 'Điều nào NÊN tránh trong viết học thuật?', options: ['Danh từ cụ thể', 'Từ viết tắt như "don\'t", "it\'s"', 'Trích dẫn nguồn', 'Câu chủ đề rõ ràng'], correctIndex: 1, explanation: 'Viết học thuật trang trọng nên tránh viết tắt; dùng dạng đầy đủ "do not", "it is".' },
]);

const c9 = doc('enw493c-9-1-presenting-defending', '9.1 — Presenting & defending research|||9.1 — Trình bày & bảo vệ nghiên cứu',
  'Poster & slide học thuật; cấu trúc bài nói; thiết kế slide (ít chữ, một ý/slide); trả lời câu hỏi hội đồng (Q&A/defense).',
  [[
    `<span class="eyebrow">ENW493c · Chapter 9 · Lesson 9.1</span>
<h2>Presenting &amp; defending research</h2>
<p>Doing the research is half the job; <strong>communicating it</strong> to an audience — a class, a conference, a capstone panel — is the other half.</p>
<h3>Posters vs slides</h3>
<ul>
<li><strong>Poster</strong> — a single visual page (often following IMRaD sections). Big title, minimal text, clear figures; it must be readable from a metre away and stand alone.</li>
<li><strong>Slides</strong> — support a spoken talk. They accompany <em>you</em>; they are not your script.</li>
</ul>
<h3>Structure of a research talk</h3>
<pre><code>1. Problem &amp; motivation   (why should anyone care?)
2. Research question / aim
3. Method                  (briefly - what you did)
4. Key results             (1-2 headline findings, a chart)
5. Conclusion &amp; implications
6. Q&amp;A
</code></pre>
<h3>Slide design — less is more</h3>
<ul>
<li><strong>One idea per slide</strong>; use keywords and visuals, not paragraphs.</li>
<li>Large, readable font; high contrast; a chart beats a table of numbers.</li>
<li>Do not read your slides word-for-word — the audience can read faster than you speak.</li>
</ul>
<h3>The defense (Q&amp;A)</h3>
<ul>
<li><strong>Listen</strong> to the whole question before answering; rephrase it if unsure.</li>
<li><strong>Be honest about limitations</strong> — "that is a limitation; a larger sample would strengthen it" is a strong answer, not a weak one.</li>
<li>Anticipate the obvious questions (sample size, threats to validity, alternative explanations) and prepare them.</li>
</ul>
<div class="callout"><span class="badge">Know your limits, own them</span> A panel respects a researcher who understands the weaknesses of their own study more than one who pretends there are none. Confidence is honesty plus preparation.</div>`,
    `<span class="eyebrow">ENW493c · Chương 9 · Bài 9.1</span>
<h2>Trình bày &amp; bảo vệ nghiên cứu</h2>
<p>Làm nghiên cứu mới là nửa việc; <strong>truyền đạt nó</strong> tới người nghe — một lớp học, một hội nghị, một hội đồng capstone — là nửa còn lại.</p>
<h3>Poster vs slide</h3>
<ul>
<li><strong>Poster</strong> — một trang trực quan (thường theo các phần IMRaD). Tiêu đề lớn, ít chữ, hình rõ; phải đọc được từ cách một mét và tự đứng một mình.</li>
<li><strong>Slide</strong> — hỗ trợ bài nói. Chúng đi kèm <em>bạn</em>; không phải kịch bản của bạn.</li>
</ul>
<h3>Cấu trúc một bài nói nghiên cứu</h3>
<pre><code>1. Vấn đề &amp; động cơ        (vì sao ai cũng nên quan tâm?)
2. Câu hỏi / mục tiêu nghiên cứu
3. Phương pháp             (ngắn gọn - bạn đã làm gì)
4. Kết quả chính           (1-2 phát hiện nổi bật, một biểu đồ)
5. Kết luận &amp; hàm ý
6. Hỏi &amp; đáp (Q&amp;A)
</code></pre>
<h3>Thiết kế slide — càng ít càng tốt</h3>
<ul>
<li><strong>Một ý một slide</strong>; dùng từ khoá và hình ảnh, không phải đoạn văn.</li>
<li>Chữ to, dễ đọc; tương phản cao; một biểu đồ hơn một bảng số.</li>
<li>Đừng đọc slide từng chữ — người nghe đọc nhanh hơn bạn nói.</li>
</ul>
<h3>Bảo vệ (Q&amp;A)</h3>
<ul>
<li><strong>Nghe</strong> hết câu hỏi rồi mới trả lời; nếu chưa chắc thì diễn đạt lại câu hỏi.</li>
<li><strong>Trung thực về hạn chế</strong> — "đó là một hạn chế; mẫu lớn hơn sẽ củng cố" là câu trả lời mạnh, không yếu.</li>
<li>Lường trước câu hỏi hiển nhiên (cỡ mẫu, mối đe doạ tới giá trị, cách giải thích khác) và chuẩn bị sẵn.</li>
</ul>
<div class="callout"><span class="badge">Biết giới hạn, nhận nó</span> Hội đồng tôn trọng người hiểu điểm yếu của chính nghiên cứu mình hơn là người vờ như không có. Tự tin là trung thực cộng chuẩn bị.</div>`,
  ]]);

const c9q = quiz('enw493c-quiz-9', 'Quiz 9 — Presenting|||Quiz 9 — Trình bày', [
  { id: 'q1', question: 'Nguyên tắc thiết kế slide học thuật tốt là?', options: ['Nhồi càng nhiều chữ càng tốt', 'Một ý mỗi slide, dùng từ khoá và hình ảnh', 'Đọc nguyên văn slide cho khán giả', 'Không cần biểu đồ'], correctIndex: 1, explanation: 'Slide tốt: một ý/slide, ít chữ, ưu tiên hình/biểu đồ; slide hỗ trợ người nói chứ không thay kịch bản.' },
  { id: 'q2', question: 'Khi hội đồng chỉ ra một hạn chế trong nghiên cứu, cách trả lời tốt là?', options: ['Phủ nhận mọi hạn chế', 'Thừa nhận trung thực và nêu cách củng cố (vd mẫu lớn hơn)', 'Đổi chủ đề', 'Nói rằng câu hỏi sai'], correctIndex: 1, explanation: 'Trung thực về hạn chế và đề xuất cách cải thiện thể hiện sự hiểu biết — mạnh hơn là chối bỏ.' },
  { id: 'q3', question: 'Poster nghiên cứu tốt nên?', options: ['Nhiều chữ, chi tiết như bài báo', 'Tiêu đề lớn, ít chữ, hình rõ, đọc được từ xa', 'Chỉ có một biểu đồ duy nhất', 'Không theo cấu trúc nào'], correctIndex: 1, explanation: 'Poster cần trực quan, ít chữ, hình rõ và đọc được từ cách một mét, thường theo cấu trúc IMRaD.' },
]);

export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    courseCode: 'ENW493c',
    slug: 'enw493c-research-methods-academic-writing-skills',
    title: 'Research Methods & Academic Writing Skills',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ENW493c.webp',
    shortDescription: 'How to do research and write academically — research questions & hypotheses, literature review, APA/IEEE citation & plagiarism, IMRaD, coherent paragraphs, argument, data collection & ethics, academic style & defending your work. Bilingual, with real examples & quizzes.|||Cách làm nghiên cứu và viết học thuật — câu hỏi & giả thuyết, tổng quan tài liệu, trích dẫn APA/IEEE & đạo văn, IMRaD, đoạn văn mạch lạc, lập luận, thu thập dữ liệu & đạo đức, văn phong & bảo vệ công trình. Song ngữ, có ví dụ thật & quiz.',
    description: 'Môn <strong>ENW493c — Research Methods & Academic Writing Skills</strong> (Kỳ 6) dạy bạn <strong>khảo sát một vấn đề có hệ thống và viết về nó theo cách học thuật</strong>. Từ <strong>nghiên cứu là gì</strong> (định tính/định lượng, câu hỏi &amp; giả thuyết) → <strong>tìm &amp; đánh giá nguồn</strong> (literature review, Google Scholar) → <strong>trích dẫn</strong> (APA/IEEE, tránh đạo văn, Zotero) → <strong>cấu trúc</strong> (IMRaD, abstract) → <strong>đoạn văn &amp; lập luận</strong> → <strong>thu thập dữ liệu &amp; đạo đức</strong> → <strong>văn phong học thuật</strong> → <strong>trình bày &amp; bảo vệ</strong>. Bám giáo trình FLM, song ngữ, có ví dụ trích dẫn thật và quiz mỗi chương.',
    whatYouLearn: 'Định tính vs định lượng, câu hỏi nghiên cứu (FINER) &amp; giả thuyết/biến; literature review &amp; đánh giá nguồn (CRAAP); trích dẫn APA/IEEE, in-text &amp; reference list, tránh đạo văn, Zotero; IMRaD &amp; abstract; câu chủ đề, coherence/cohesion, transitions; thesis, claim–evidence–reasoning, nguỵ biện, phản biện; khảo sát/phỏng vấn/thực nghiệm, mẫu, reliability/validity, đạo đức nghiên cứu; văn phong khách quan &amp; hedging; poster/slide &amp; bảo vệ (Q&amp;A).',
    requirements: 'Tiếng Anh trình độ đọc–viết cơ bản. Nên có sẵn tài khoản Google Scholar và cài Zotero/Mendeley để luyện trích dẫn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nghiên cứu & viết học thuật là gì; lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Nghiên cứu là gì|||Chapter 1 — What is research', description: 'Định tính/định lượng, câu hỏi, giả thuyết & biến.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tìm & đánh giá nguồn|||Chapter 2 — Finding sources', description: 'Literature review, nguồn học thuật vs phổ thông, CRAAP.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Trích dẫn & đạo văn|||Chapter 3 — Citation & plagiarism', description: 'APA/IEEE, in-text, tránh đạo văn, Zotero.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Cấu trúc (IMRaD)|||Chapter 4 — Structure (IMRaD)', description: 'IMRaD, abstract, mở–thân–kết.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đoạn văn|||Chapter 5 — Paragraphs', description: 'Topic sentence, coherence/cohesion, transitions.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Lập luận & phản biện|||Chapter 6 — Argument', description: 'Thesis, claim–evidence–reasoning, nguỵ biện, phản biện.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Dữ liệu & đạo đức|||Chapter 7 — Data & ethics', description: 'Khảo sát/phỏng vấn/thực nghiệm, mẫu, đạo đức.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Văn phong học thuật|||Chapter 8 — Academic style', description: 'Khách quan, hedging, lỗi thường gặp.', lessons: [c8, c8q] },
    { title: 'Chương 9 — Trình bày & bảo vệ|||Chapter 9 — Presenting', description: 'Poster/slide, bài nói, Q&A/defense.', lessons: [c9, c9q] },
  ],
};
