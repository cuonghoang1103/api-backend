/**
 * CRM401 — Research Method (Phương pháp Nghiên cứu Khoa học). Ngành Ngôn ngữ
 * Trung, FPTU Kỳ 7. Môn phương pháp nghiên cứu KHOA HỌC XÃ HỘI - NHÂN VĂN /
 * NGÔN NGỮ HỌC cho SV làm khoá luận về ngôn ngữ &amp; văn hoá Trung Quốc —
 * KHÔNG phải phương pháp nghiên cứu kỹ thuật/tự nhiên. Giáo trình tham khảo
 * (trích dẫn, không upload PDF): "Research Methods in Linguistics"
 * (Litosseliti); "Doing Applied Linguistics Research"; "语言学研究方法". 8
 * chương: (1) tổng quan nghiên cứu khoa học & ngôn ngữ, (2) vấn đề/câu hỏi
 * nghiên cứu & tổng quan tài liệu, (3) thiết kế định tính vs định lượng, (4)
 * thu thập dữ liệu ngôn ngữ (khảo sát/phỏng vấn/corpus), (5) phân tích dữ
 * liệu & công cụ, (6) đối chiếu/dịch thuật/văn hoá, (7) viết đề cương & báo
 * cáo (APA), (8) đạo đức nghiên cứu & bảo vệ khoá luận.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('crm401-0-0-materials', 'Course materials & references|||Tài liệu tham khảo môn học',
  'Ba nguồn tham khảo chính (trích dẫn, không upload PDF) + kho ngữ liệu, công cụ, YouTube miễn phí cho nghiên cứu ngôn ngữ Trung.',
  [[
    `<span class="eyebrow">CRM401 · Course materials</span>
<h2>Reference materials</h2>
<p class="lead">This course draws on three main references, <strong>cited</strong>, not distributed as PDFs. Use the official FLM (flm.fpt.edu.vn) slide deck as the primary source, and the links below to go deeper.</p>
<h3>📘 Core references (cited)</h3>
<ul>
<li><strong>"Research Methods in Linguistics"</strong> — Lia Litosseliti (ed.), Bloomsbury — the standard English-language methods textbook for linguistics students.</li>
<li><strong>"Doing Applied Linguistics Research"</strong> — a practical guide to designing and conducting applied-linguistics studies (surveys, interviews, corpora, classroom research).</li>
<li><strong>《语言学研究方法》</strong> (<em>Language Research Methods</em>) — Chinese-language methods textbook covering the same ground for 汉语 (Mandarin) research specifically.</li>
</ul>
<h3>🌐 Free, legitimate resources</h3>
<ul>
<li><a href="https://scholar.google.com/" target="_blank" rel="noopener">Google Scholar</a> — search academic literature &amp; citation counts</li>
<li><a href="https://bcc.blcu.edu.cn/" target="_blank" rel="noopener">BCC Corpus (北京语言大学)</a> — a large, free, searchable Chinese corpus</li>
<li><a href="http://ccl.pku.edu.cn/corpus.asp" target="_blank" rel="noopener">CCL Corpus (北京大学)</a> — classical &amp; modern Chinese corpus, concordance search</li>
<li><a href="https://apastyle.apa.org/" target="_blank" rel="noopener">APA Style official site</a> — citation &amp; reference rules</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.laurenceanthony.net/software/antconc/" target="_blank" rel="noopener">AntConc</a> — free concordance/corpus analysis tool, widely used in linguistics theses</li>
<li><a href="https://www.mendeley.com/" target="_blank" rel="noopener">Mendeley</a> / <a href="https://www.zotero.org/" target="_blank" rel="noopener">Zotero</a> — free reference managers, auto-format APA citations</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Đây là nguồn để tự nghiên cứu thêm, không thay thế slide chính thức của FLM. Mọi ví dụ đề tài trong môn đều mang tính minh hoạ phương pháp, không phải đề tài bắt buộc phải làm.</div>`,
    `<span class="eyebrow">CRM401 · Tài liệu tham khảo</span>
<h2>Tài liệu tham khảo</h2>
<p class="lead">Môn này dựa trên ba nguồn tham khảo chính, được <strong>trích dẫn</strong>, không phát PDF. Dùng slide chính thức của FLM (flm.fpt.edu.vn) làm nguồn chính, và các đường dẫn dưới đây để đọc thêm.</p>
<h3>📘 Nguồn tham khảo chính (trích dẫn)</h3>
<ul>
<li><strong>"Research Methods in Linguistics"</strong> — Lia Litosseliti (chủ biên), Bloomsbury — giáo trình phương pháp nghiên cứu ngôn ngữ học tiếng Anh chuẩn.</li>
<li><strong>"Doing Applied Linguistics Research"</strong> — hướng dẫn thực hành thiết kế và triển khai nghiên cứu ngôn ngữ học ứng dụng (khảo sát, phỏng vấn, corpus, nghiên cứu lớp học).</li>
<li><strong>《语言学研究方法》</strong> (<em>Phương pháp nghiên cứu ngôn ngữ học</em>) — giáo trình tiếng Trung, trình bày cùng nội dung nhưng dành riêng cho nghiên cứu tiếng Hán (汉语).</li>
</ul>
<h3>🌐 Tài liệu miễn phí, hợp pháp</h3>
<ul>
<li><a href="https://scholar.google.com/" target="_blank" rel="noopener">Google Scholar</a> — tra cứu tài liệu học thuật &amp; số lượt trích dẫn</li>
<li><a href="https://bcc.blcu.edu.cn/" target="_blank" rel="noopener">Kho ngữ liệu BCC (北京语言大学)</a> — kho ngữ liệu tiếng Trung lớn, tra miễn phí</li>
<li><a href="http://ccl.pku.edu.cn/corpus.asp" target="_blank" rel="noopener">Kho ngữ liệu CCL (北京大学)</a> — ngữ liệu Hán cổ &amp; hiện đại, tra theo ngữ cảnh</li>
<li><a href="https://apastyle.apa.org/" target="_blank" rel="noopener">Trang chính thức APA Style</a> — quy tắc trích dẫn &amp; tài liệu tham khảo</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.laurenceanthony.net/software/antconc/" target="_blank" rel="noopener">AntConc</a> — công cụ phân tích corpus/concordance miễn phí, dùng nhiều trong khoá luận ngôn ngữ</li>
<li><a href="https://www.mendeley.com/" target="_blank" rel="noopener">Mendeley</a> / <a href="https://www.zotero.org/" target="_blank" rel="noopener">Zotero</a> — phần mềm quản lý tài liệu tham khảo miễn phí, tự định dạng trích dẫn APA</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Đây là nguồn để tự nghiên cứu thêm, không thay thế slide chính thức của FLM. Mọi ví dụ đề tài trong môn chỉ minh hoạ phương pháp, không phải đề tài bắt buộc.</div>`,
  ]]);

const c1 = doc('crm401-1-1-overview', '1.1 — Scientific research & linguistic research: an overview|||1.1 — Tổng quan nghiên cứu khoa học & nghiên cứu ngôn ngữ',
  'Nghiên cứu khoa học là gì (khách quan, có hệ thống, kiểm chứng được); khác biệt khoa học tự nhiên vs khoa học xã hội - nhân văn; các nhánh của ngôn ngữ học; chu trình nghiên cứu 6 bước.',
  [[
    `<span class="eyebrow">CRM401 · Chapter 1 · Lesson 1.1</span>
<h2>Scientific research &amp; linguistic research: an overview</h2>
<h3>What makes research "scientific"</h3>
<p>Scientific research is a <strong>systematic, objective and verifiable</strong> way of answering a question — it is not the same as "having an opinion" or "reading a lot." Four features distinguish it:</p>
<ul>
<li><strong>Systematic</strong> — follows an explicit, repeatable procedure, not ad hoc impressions.</li>
<li><strong>Objective</strong> — conclusions rest on evidence/data, not on the researcher's personal preference.</li>
<li><strong>Empirical</strong> — grounded in observation or data, not pure speculation.</li>
<li><strong>Verifiable</strong> — another researcher, given the same method, should be able to check or replicate the finding.</li>
</ul>
<h3>Natural science vs. social science &amp; humanities</h3>
<p>Natural sciences (physics, chemistry) usually study phenomena that behave the same way under controlled conditions. Language and culture research sits in the <strong>social sciences and humanities</strong>: the "object" studied is human behavior — speech, writing, meaning, culture — which varies by speaker, context and society. This does not make it less rigorous; it means methods must be adapted (see Chapter 3: qualitative vs. quantitative design).</p>
<h3>Branches of linguistics you may research</h3>
<pre><code>语音学 yǔyīnxué   — Phonetics/phonology (sound system)
词汇学 cíhuìxué    — Lexicology (vocabulary, word formation)
语法学 yǔfǎxué    — Grammar/syntax
语用学 yǔyòngxué  — Pragmatics (language in use, context)
社会语言学        — Sociolinguistics (language & society)
对比语言学        — Contrastive linguistics (Chapter 6)
翻译学 fānyìxué   — Translation studies (Chapter 6)
</code></pre>
<h3>The research cycle — 6 steps</h3>
<pre><code>1. Choose a topic          -&gt; 2. Define the problem & questions (Ch.2)
3. Design the study (Ch.3) -&gt; 4. Collect data (Ch.4)
5. Analyze data (Ch.5)     -&gt; 6. Write & defend the report (Ch.7-8)
</code></pre>
<div class="callout"><span class="badge">Why this matters for a Chinese-language graduate</span> Your graduation thesis (khoá luận) is a piece of scientific research about language or culture — e.g. how Vietnamese learners use Chinese classifiers, or how a Chinese idiom is best translated into Vietnamese. This course gives you the method to do that rigorously, not just "write an essay about Chinese."</div>`,
    `<span class="eyebrow">CRM401 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan nghiên cứu khoa học &amp; nghiên cứu ngôn ngữ</h2>
<h3>Điều gì làm một nghiên cứu "khoa học"</h3>
<p>Nghiên cứu khoa học là cách trả lời một câu hỏi một cách <strong>có hệ thống, khách quan và kiểm chứng được</strong> — nó khác với "có ý kiến riêng" hay "đọc nhiều." Bốn đặc điểm phân biệt:</p>
<ul>
<li><strong>Có hệ thống</strong> — theo một quy trình rõ ràng, lặp lại được, không phải cảm tính tuỳ hứng.</li>
<li><strong>Khách quan</strong> — kết luận dựa trên bằng chứng/dữ liệu, không dựa trên sở thích cá nhân của người nghiên cứu.</li>
<li><strong>Thực chứng</strong> — dựa trên quan sát hoặc dữ liệu thật, không phải suy đoán thuần tuý.</li>
<li><strong>Kiểm chứng được</strong> — một người khác, dùng đúng phương pháp, phải kiểm tra hoặc lặp lại được kết quả.</li>
</ul>
<h3>Khoa học tự nhiên vs. khoa học xã hội - nhân văn</h3>
<p>Khoa học tự nhiên (vật lý, hoá học) thường nghiên cứu hiện tượng hoạt động giống nhau trong điều kiện kiểm soát. Nghiên cứu ngôn ngữ &amp; văn hoá thuộc <strong>khoa học xã hội - nhân văn</strong>: "đối tượng" nghiên cứu là hành vi con người — lời nói, chữ viết, nghĩa, văn hoá — vốn thay đổi theo người nói, ngữ cảnh và xã hội. Điều này không làm nó kém chặt chẽ hơn; nó có nghĩa phương pháp phải được điều chỉnh phù hợp (xem Chương 3: thiết kế định tính vs định lượng).</p>
<h3>Các nhánh ngôn ngữ học bạn có thể nghiên cứu</h3>
<pre><code>语音学 yǔyīnxué   — Ngữ âm học (hệ thống âm thanh)
词汇学 cíhuìxué    — Từ vựng học (vốn từ, cấu tạo từ)
语法学 yǔfǎxué    — Ngữ pháp học/cú pháp
语用学 yǔyòngxué  — Ngữ dụng học (ngôn ngữ trong sử dụng, ngữ cảnh)
社会语言学        — Xã hội ngôn ngữ học (ngôn ngữ & xã hội)
对比语言学        — Ngôn ngữ học đối chiếu (Chương 6)
翻译学 fānyìxué   — Dịch thuật học (Chương 6)
</code></pre>
<h3>Chu trình nghiên cứu — 6 bước</h3>
<pre><code>1. Chọn đề tài                -&gt; 2. Xác định vấn đề & câu hỏi (Ch.2)
3. Thiết kế nghiên cứu (Ch.3) -&gt; 4. Thu thập dữ liệu (Ch.4)
5. Phân tích dữ liệu (Ch.5)   -&gt; 6. Viết & bảo vệ báo cáo (Ch.7-8)
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng với SV ngành Ngôn ngữ Trung</span> Khoá luận tốt nghiệp của bạn là một công trình nghiên cứu khoa học về ngôn ngữ hoặc văn hoá — vd người Việt học tiếng Trung dùng sai lượng từ (量词) thế nào, hay dịch một thành ngữ tiếng Trung sang tiếng Việt ra sao là tốt nhất. Môn này cho bạn phương pháp làm điều đó một cách chặt chẽ, chứ không chỉ "viết bài luận về Trung Quốc."</div>`,
  ]]);

const c1q = quiz('crm401-quiz-1', 'Quiz 1 — Overview of scientific & linguistic research|||Quiz 1 — Tổng quan nghiên cứu khoa học & ngôn ngữ', [
  { id: 'q1', question: 'Đặc điểm nào KHÔNG thuộc bốn đặc điểm của nghiên cứu khoa học đã học?', options: ['Có hệ thống', 'Khách quan', 'Dựa hoàn toàn vào cảm nhận cá nhân', 'Kiểm chứng được'], correctIndex: 2, explanation: 'Nghiên cứu khoa học phải khách quan, dựa trên bằng chứng — không dựa hoàn toàn vào cảm nhận cá nhân.' },
  { id: 'q2', question: 'Nghiên cứu ngôn ngữ & văn hoá thuộc lĩnh vực nào?', options: ['Khoa học tự nhiên thuần tuý', 'Khoa học xã hội - nhân văn', 'Không phải khoa học', 'Kỹ thuật - công nghệ'], correctIndex: 1, explanation: 'Ngôn ngữ và văn hoá nghiên cứu hành vi con người, biến đổi theo ngữ cảnh — thuộc khoa học xã hội - nhân văn.' },
  { id: 'q3', question: 'Bước đầu tiên của chu trình nghiên cứu là gì?', options: ['Phân tích dữ liệu', 'Chọn đề tài', 'Viết báo cáo', 'Thu thập dữ liệu'], correctIndex: 1, explanation: 'Chu trình nghiên cứu bắt đầu từ chọn đề tài, rồi mới xác định vấn đề, thiết kế, thu thập, phân tích, viết báo cáo.' },
]);

const c2 = doc('crm401-2-1-problem-litreview', '2.1 — Research problem, questions & literature review|||2.1 — Xác định vấn đề, câu hỏi nghiên cứu & tổng quan tài liệu',
  'Tiêu chí chọn đề tài (khả thi, mới, có ý nghĩa); từ khoảng trống nghiên cứu đến vấn đề; viết câu hỏi/mục tiêu nghiên cứu; tổng quan tài liệu và tránh đạo văn.',
  [[
    `<span class="eyebrow">CRM401 · Chapter 2 · Lesson 2.1</span>
<h2>Research problem, questions &amp; literature review</h2>
<h3>Choosing a topic</h3>
<p>A good thesis topic passes three tests: <strong>feasible</strong> (data you can actually collect in the time you have — e.g. Vietnamese learners you have access to, not a corpus you cannot obtain), <strong>relevant</strong> to your major (Chinese language/culture), and <strong>reasonably novel</strong> (adds something, even small, that existing studies have not fully answered).</p>
<h3>From a gap in the literature to a research problem</h3>
<p>A <strong>research problem</strong> is a specific gap or unresolved issue you found by reading existing studies — not just "I'm interested in Chinese idioms" but, e.g., "existing contrastive studies of Chinese-Vietnamese animal idioms do not cover idioms containing 牛 (niú, ox/buffalo), despite the animal's cultural importance to both nations."</p>
<h3>Writing research questions &amp; objectives</h3>
<p>From the problem, state one main <strong>research question</strong> (and 2-3 sub-questions), plus matching <strong>objectives</strong>. Example:</p>
<pre><code>Problem: Vietnamese learners frequently misuse Chinese classifiers (量词 liàngcí)
Main question: What types of classifier errors do Vietnamese learners of
               Chinese make most often, and why?
Sub-questions: 1) Which classifiers are most often confused?
               2) Does Vietnamese L1 influence cause specific error patterns?
Objective:     Classify and explain classifier errors to inform teaching.
</code></pre>
<h3>Literature review</h3>
<p>A <strong>literature review</strong> is not a list of summaries — it <strong>synthesizes</strong> what is already known, identifies agreements/disagreements between studies, and shows precisely where your study fits the gap. Search academic databases (CNKI 中国知网 for Chinese-language sources, Google Scholar for English), and always cite properly (Chapter 7) — copying text without citation is <strong>plagiarism</strong>, a serious academic-integrity violation that can fail a thesis outright.</p>
<div class="callout"><span class="badge">Practical tip</span> Keep a simple table while reading: author/year, method used, main finding, and how it relates to your topic. This becomes the skeleton of your literature-review chapter.</div>`,
    `<span class="eyebrow">CRM401 · Chương 2 · Bài 2.1</span>
<h2>Xác định vấn đề, câu hỏi nghiên cứu &amp; tổng quan tài liệu</h2>
<h3>Chọn đề tài</h3>
<p>Một đề tài khoá luận tốt cần vượt qua ba phép thử: <strong>khả thi</strong> (dữ liệu bạn thực sự thu thập được trong thời gian cho phép — vd người học tiếng Việt bạn tiếp cận được, chứ không phải một kho ngữ liệu bạn không có quyền truy cập), <strong>liên quan</strong> đến chuyên ngành (ngôn ngữ/văn hoá Trung), và <strong>có tính mới</strong> ở mức hợp lý (bổ sung điều gì đó, dù nhỏ, mà các nghiên cứu hiện có chưa trả lời hết).</p>
<h3>Từ khoảng trống trong tài liệu đến vấn đề nghiên cứu</h3>
<p>Một <strong>vấn đề nghiên cứu</strong> là khoảng trống hoặc điểm chưa giải quyết cụ thể mà bạn tìm ra khi đọc các nghiên cứu hiện có — không chỉ là "tôi thích thành ngữ tiếng Trung" mà, ví dụ, "các nghiên cứu đối chiếu thành ngữ động vật Trung-Việt hiện chưa bao quát thành ngữ chứa từ 牛 (niú, trâu/bò), dù con vật này có tầm quan trọng văn hoá với cả hai dân tộc."</p>
<h3>Viết câu hỏi &amp; mục tiêu nghiên cứu</h3>
<p>Từ vấn đề, nêu một <strong>câu hỏi nghiên cứu</strong> chính (kèm 2-3 câu hỏi phụ), cùng <strong>mục tiêu</strong> tương ứng. Ví dụ:</p>
<pre><code>Vấn đề: Người Việt học tiếng Trung thường dùng sai lượng từ (量词 liàngcí)
Câu hỏi chính: Người Việt học tiếng Trung mắc những loại lỗi lượng từ nào
               phổ biến nhất, và vì sao?
Câu hỏi phụ:   1) Lượng từ nào bị nhầm lẫn nhiều nhất?
               2) Tiếng Việt (ngôn ngữ mẹ đẻ) có gây ra kiểu lỗi riêng không?
Mục tiêu:      Phân loại và giải thích lỗi lượng từ để phục vụ giảng dạy.
</code></pre>
<h3>Tổng quan tài liệu</h3>
<p>Một <strong>tổng quan tài liệu (literature review)</strong> không phải danh sách tóm tắt — nó <strong>tổng hợp</strong> những gì đã biết, chỉ ra điểm đồng thuận/bất đồng giữa các nghiên cứu, và cho thấy chính xác nghiên cứu của bạn khớp vào khoảng trống nào. Tìm kiếm trên các cơ sở dữ liệu học thuật (CNKI 中国知网 cho nguồn tiếng Trung, Google Scholar cho tiếng Anh), và luôn trích dẫn đúng cách (Chương 7) — chép văn bản mà không trích dẫn là <strong>đạo văn (plagiarism)</strong>, một vi phạm liêm chính học thuật nghiêm trọng có thể khiến khoá luận bị đánh trượt hoàn toàn.</p>
<div class="callout"><span class="badge">Mẹo thực hành</span> Khi đọc, giữ một bảng đơn giản: tác giả/năm, phương pháp dùng, kết quả chính, và liên hệ với đề tài của bạn. Bảng này trở thành khung xương cho chương tổng quan tài liệu.</div>`,
  ]]);

const c2q = quiz('crm401-quiz-2', 'Quiz 2 — Research problem & literature review|||Quiz 2 — Vấn đề nghiên cứu & tổng quan tài liệu', [
  { id: 'q1', question: 'Ba tiêu chí để chọn một đề tài khoá luận tốt là gì?', options: ['Khả thi, liên quan, có tính mới', 'Dài, khó, độc lạ', 'Dễ viết, ngắn, không cần dữ liệu', 'Được thầy cô chọn sẵn, không cần lý do'], correctIndex: 0, explanation: 'Đề tài tốt cần khả thi (thu thập được dữ liệu), liên quan chuyên ngành, và có tính mới hợp lý.' },
  { id: 'q2', question: 'Tổng quan tài liệu (literature review) tốt cần làm gì, KHÔNG chỉ là gì?', options: ['Chỉ là danh sách tóm tắt từng bài báo', 'Tổng hợp, chỉ ra đồng thuận/bất đồng, và định vị khoảng trống nghiên cứu', 'Chỉ liệt kê tên tác giả và năm xuất bản', 'Sao chép nguyên văn các bài đã đọc'], correctIndex: 1, explanation: 'Literature review phải tổng hợp và định vị nghiên cứu của bạn trong bức tranh chung, không chỉ liệt kê tóm tắt.' },
  { id: 'q3', question: 'Chép văn bản của người khác vào bài mà không trích dẫn gọi là gì, và hậu quả ra sao?', options: ['Trích dẫn hợp lệ, không sao', 'Đạo văn (plagiarism) — vi phạm liêm chính học thuật nghiêm trọng', 'Là cách viết tổng quan tài liệu bình thường', 'Chỉ bị trừ điểm nhỏ, không ảnh hưởng khoá luận'], correctIndex: 1, explanation: 'Đây là đạo văn — vi phạm liêm chính học thuật, có thể khiến khoá luận bị đánh trượt.' },
]);

const c3 = doc('crm401-3-1-qual-quant-design', '3.1 — Qualitative vs. quantitative research design|||3.1 — Thiết kế nghiên cứu định tính vs định lượng',
  'Định tính (mô tả, diễn giải sâu) vs định lượng (đo lường, số liệu, kiểm định); mixed methods; thành phần thiết kế: mẫu, biến số, độ tin cậy/độ giá trị; case study, cắt ngang, theo chiều dọc.',
  [[
    `<span class="eyebrow">CRM401 · Chapter 3 · Lesson 3.1</span>
<h2>Qualitative vs. quantitative research design</h2>
<h3>Two broad approaches</h3>
<table>
<tr><th></th><th>Qualitative (định tính)</th><th>Quantitative (định lượng)</th></tr>
<tr><td>Goal</td><td>Deep, contextual understanding</td><td>Measurement, generalizable patterns</td></tr>
<tr><td>Data</td><td>Words, interview transcripts, texts</td><td>Numbers, counts, scores</td></tr>
<tr><td>Sample size</td><td>Small, purposeful</td><td>Larger, aiming for representativeness</td></tr>
<tr><td>Example in linguistics</td><td>Discourse analysis of a TV interview</td><td>Frequency count of a grammar structure in a corpus</td></tr>
</table>
<p>Many linguistics theses use <strong>mixed methods</strong> — e.g. a quantitative error count from a written test, followed by qualitative interviews to explain <em>why</em> those errors happen. Neither approach is "more scientific" than the other; the choice depends on your research question.</p>
<h3>Design components</h3>
<ul>
<li><strong>Population &amp; sample</strong> — who/what you study (e.g. all 3rd-year Chinese-language students) vs. who you actually sample (e.g. 60 students at one university).</li>
<li><strong>Variables</strong> — what you measure or compare (e.g. classifier error rate; native language background).</li>
<li><strong>Validity</strong> — does your instrument actually measure what it claims to measure?</li>
<li><strong>Reliability</strong> — would you get consistent results if you repeated the measurement?</li>
</ul>
<h3>Common design types</h3>
<pre><code>Case study      — deep look at one person/class/text (often qualitative)
Cross-sectional — one snapshot in time across a group (e.g. a test given once)
Longitudinal    — the same subjects observed over time (e.g. across a semester)
</code></pre>
<div class="callout"><span class="badge">Design first, collect second</span> Decide your design BEFORE collecting data — changing methodology mid-way after data collection usually means starting over. Chapter 4 covers how to actually collect the data for each design.</div>`,
    `<span class="eyebrow">CRM401 · Chương 3 · Bài 3.1</span>
<h2>Thiết kế nghiên cứu định tính vs định lượng</h2>
<h3>Hai hướng tiếp cận lớn</h3>
<table>
<tr><th></th><th>Định tính (qualitative)</th><th>Định lượng (quantitative)</th></tr>
<tr><td>Mục tiêu</td><td>Hiểu sâu, có ngữ cảnh</td><td>Đo lường, tìm quy luật khái quát</td></tr>
<tr><td>Dữ liệu</td><td>Chữ, bản ghi phỏng vấn, văn bản</td><td>Số, số đếm, điểm số</td></tr>
<tr><td>Cỡ mẫu</td><td>Nhỏ, chọn có chủ đích</td><td>Lớn hơn, hướng tới tính đại diện</td></tr>
<tr><td>Ví dụ trong ngôn ngữ học</td><td>Phân tích diễn ngôn một buổi phỏng vấn TV</td><td>Đếm tần suất một cấu trúc ngữ pháp trong corpus</td></tr>
</table>
<p>Nhiều khoá luận ngôn ngữ dùng <strong>phương pháp hỗn hợp (mixed methods)</strong> — vd đếm số lỗi định lượng từ một bài kiểm tra viết, sau đó phỏng vấn định tính để giải thích <em>vì sao</em> các lỗi đó xảy ra. Không cách nào "khoa học hơn" cách nào; lựa chọn phụ thuộc vào câu hỏi nghiên cứu của bạn.</p>
<h3>Các thành phần thiết kế</h3>
<ul>
<li><strong>Tổng thể &amp; mẫu</strong> — bạn nghiên cứu ai/cái gì (vd toàn bộ SV năm 3 ngành tiếng Trung) so với mẫu thực tế lấy (vd 60 SV tại một trường).</li>
<li><strong>Biến số</strong> — cái bạn đo hoặc so sánh (vd tỷ lệ lỗi lượng từ; nền ngôn ngữ mẹ đẻ).</li>
<li><strong>Độ giá trị (validity)</strong> — công cụ của bạn có thực sự đo đúng cái nó tuyên bố đo không?</li>
<li><strong>Độ tin cậy (reliability)</strong> — nếu đo lại, bạn có được kết quả nhất quán không?</li>
</ul>
<h3>Các loại thiết kế phổ biến</h3>
<pre><code>Case study (nghiên cứu trường hợp) — nhìn sâu một người/lớp/văn bản (thường định tính)
Cắt ngang (cross-sectional)        — một lát cắt thời điểm trên nhóm (vd một bài test)
Theo chiều dọc (longitudinal)      — cùng đối tượng quan sát qua thời gian (vd cả kỳ học)
</code></pre>
<div class="callout"><span class="badge">Thiết kế trước, thu thập sau</span> Quyết định thiết kế TRƯỚC khi thu thập dữ liệu — đổi phương pháp giữa chừng sau khi đã thu thập thường có nghĩa phải làm lại từ đầu. Chương 4 sẽ nói cách thu thập dữ liệu thực tế cho từng loại thiết kế.</div>`,
  ]]);

const c3q = quiz('crm401-quiz-3', 'Quiz 3 — Qualitative vs quantitative design|||Quiz 3 — Thiết kế định tính vs định lượng', [
  { id: 'q1', question: 'Nghiên cứu định lượng thường dùng loại dữ liệu nào?', options: ['Bản ghi phỏng vấn dài', 'Số liệu, số đếm, điểm số', 'Chỉ hình ảnh minh hoạ', 'Cảm nhận cá nhân của người viết'], correctIndex: 1, explanation: 'Định lượng đo lường bằng số (tần suất, điểm số, tỷ lệ %) để tìm quy luật khái quát.' },
  { id: 'q2', question: 'Thiết kế "theo chiều dọc" (longitudinal) nghĩa là gì?', options: ['Quan sát một lần duy nhất trên nhiều người', 'Quan sát cùng một nhóm đối tượng qua nhiều thời điểm', 'Chỉ nghiên cứu một trường hợp duy nhất', 'Không cần thu thập dữ liệu thật'], correctIndex: 1, explanation: 'Longitudinal theo dõi cùng đối tượng qua thời gian, khác với cross-sectional (một lát cắt thời điểm).' },
  { id: 'q3', question: '"Độ giá trị" (validity) của một công cụ nghiên cứu là gì?', options: ['Công cụ có được dùng lại được lần sau không', 'Công cụ có thực sự đo đúng cái nó tuyên bố đo không', 'Công cụ có tốn nhiều thời gian không', 'Công cụ có được nhiều người biết đến không'], correctIndex: 1, explanation: 'Validity: đo đúng cái cần đo. Reliability (khác): đo có nhất quán qua các lần lặp lại hay không.' },
]);

const c4 = doc('crm401-4-1-data-collection', '4.1 — Collecting linguistic data: surveys, interviews & corpora|||4.1 — Phương pháp thu thập dữ liệu ngôn ngữ (khảo sát, phỏng vấn, corpus)',
  'Thiết kế bảng hỏi (thang Likert); phỏng vấn có cấu trúc/bán cấu trúc/nhóm tập trung; ngữ liệu corpus (语料库) và công cụ concordance; đạo đức khi thu thập dữ liệu con người.',
  [[
    `<span class="eyebrow">CRM401 · Chapter 4 · Lesson 4.1</span>
<h2>Collecting linguistic data: surveys, interviews &amp; corpora</h2>
<h3>Surveys / questionnaires</h3>
<p>Best for quantitative data from many respondents (e.g. how confident students feel using Chinese classifiers). Use a <strong>Likert scale</strong> (e.g. 1 = strongly disagree … 5 = strongly agree) for attitudes, and clear, unambiguous, single-idea questions. Pilot the survey on 3-5 people first to catch confusing wording before distributing it widely.</p>
<h3>Interviews</h3>
<ul>
<li><strong>Structured</strong> — fixed question list, same order for everyone; easiest to compare across respondents.</li>
<li><strong>Semi-structured</strong> — a question guide, but you can follow up on interesting answers; most common in linguistics/culture research.</li>
<li><strong>Focus group</strong> — several participants discuss together; useful for cultural-attitude topics, but one dominant speaker can bias the discussion.</li>
</ul>
<h3>Corpus data (语料库 yǔliàokù)</h3>
<p>A <strong>corpus</strong> is a large, structured collection of authentic language texts you can search. Rather than collecting your own examples one by one, you query an existing corpus with a <strong>concordance tool</strong> (e.g. AntConc, or a corpus's own search interface) to see every occurrence of a word/structure in real context (this is called a <strong>KWIC</strong> view — KeyWord In Context).</p>
<pre><code>Example corpora for Chinese-language research
BCC (北京语言大学)  — huge, free, multi-genre modern Chinese corpus
CCL (北京大学)      — classical & modern Chinese, strong for diachronic study
HSK dynamic corpus  — learner corpus: real errors by non-native Chinese learners
</code></pre>
<h3>Research ethics in data collection</h3>
<p>Whenever you collect data from real people — surveys, interviews, recordings — you must get <strong>informed consent</strong> (participants know what the study is for and agree voluntarily), protect their <strong>anonymity/confidentiality</strong>, and never coerce participation (e.g. through a teacher pressuring their own students). Chapter 8 covers this in full.</p>
<div class="callout"><span class="badge">Match method to question</span> Want to know "how many/how often"? Survey or corpus counts. Want to know "why/how it feels"? Interviews. Many strong theses combine both.</div>`,
    `<span class="eyebrow">CRM401 · Chương 4 · Bài 4.1</span>
<h2>Phương pháp thu thập dữ liệu ngôn ngữ: khảo sát, phỏng vấn, corpus</h2>
<h3>Khảo sát / bảng hỏi</h3>
<p>Phù hợp nhất để lấy dữ liệu định lượng từ nhiều người trả lời (vd sinh viên tự tin đến đâu khi dùng lượng từ tiếng Trung). Dùng <strong>thang Likert</strong> (vd 1 = hoàn toàn không đồng ý … 5 = hoàn toàn đồng ý) cho câu hỏi thái độ, và câu hỏi rõ ràng, không mập mờ, mỗi câu chỉ hỏi một ý. Thử nghiệm bảng hỏi trên 3-5 người trước để bắt lỗi diễn đạt gây nhầm lẫn trước khi phát rộng.</p>
<h3>Phỏng vấn</h3>
<ul>
<li><strong>Có cấu trúc</strong> — danh sách câu hỏi cố định, thứ tự giống nhau cho mọi người; dễ so sánh giữa các đáp viên nhất.</li>
<li><strong>Bán cấu trúc</strong> — có khung câu hỏi hướng dẫn, nhưng có thể hỏi thêm khi câu trả lời thú vị; phổ biến nhất trong nghiên cứu ngôn ngữ/văn hoá.</li>
<li><strong>Nhóm tập trung (focus group)</strong> — nhiều người tham gia cùng thảo luận; hữu ích cho chủ đề thái độ văn hoá, nhưng một người nói lấn át có thể làm lệch cuộc thảo luận.</li>
</ul>
<h3>Dữ liệu corpus (语料库 yǔliàokù)</h3>
<p>Một <strong>corpus (ngữ liệu)</strong> là kho văn bản ngôn ngữ thật, lớn, có cấu trúc, mà bạn có thể tra cứu. Thay vì tự thu thập từng ví dụ một, bạn truy vấn một corpus có sẵn bằng <strong>công cụ concordance</strong> (vd AntConc, hoặc giao diện tra cứu riêng của corpus) để xem mọi lần xuất hiện của một từ/cấu trúc trong ngữ cảnh thật (gọi là khung nhìn <strong>KWIC</strong> — KeyWord In Context).</p>
<pre><code>Ví dụ kho ngữ liệu cho nghiên cứu tiếng Trung
BCC (北京语言大学)  — kho ngữ liệu tiếng Trung hiện đại lớn, đa thể loại, miễn phí
CCL (北京大学)      — Hán cổ & hiện đại, mạnh cho nghiên cứu lịch đại
HSK dynamic corpus  — corpus người học: lỗi thật của người học tiếng Trung không bản ngữ
</code></pre>
<h3>Đạo đức khi thu thập dữ liệu</h3>
<p>Bất cứ khi nào thu thập dữ liệu từ người thật — khảo sát, phỏng vấn, ghi âm — bạn phải có <strong>sự đồng ý tự nguyện có thông tin (informed consent)</strong> (người tham gia biết mục đích nghiên cứu và đồng ý tự nguyện), bảo vệ <strong>tính ẩn danh/bảo mật</strong>, và không bao giờ ép buộc tham gia (vd giáo viên gây áp lực lên chính học sinh mình). Chương 8 sẽ nói đầy đủ về vấn đề này.</p>
<div class="callout"><span class="badge">Khớp phương pháp với câu hỏi</span> Muốn biết "bao nhiêu/thường xuyên đến đâu"? Dùng khảo sát hoặc đếm corpus. Muốn biết "vì sao/cảm nhận thế nào"? Dùng phỏng vấn. Nhiều khoá luận mạnh kết hợp cả hai.</div>`,
  ]]);

const c4q = quiz('crm401-quiz-4', 'Quiz 4 — Data collection methods|||Quiz 4 — Phương pháp thu thập dữ liệu', [
  { id: 'q1', question: 'Loại phỏng vấn nào phổ biến nhất trong nghiên cứu ngôn ngữ/văn hoá, cho phép hỏi thêm khi câu trả lời thú vị?', options: ['Có cấu trúc', 'Bán cấu trúc', 'Nhóm tập trung bắt buộc', 'Không cần chuẩn bị câu hỏi'], correctIndex: 1, explanation: 'Phỏng vấn bán cấu trúc có khung câu hỏi nhưng linh hoạt hỏi thêm — phổ biến nhất trong nghiên cứu định tính về ngôn ngữ/văn hoá.' },
  { id: 'q2', question: 'Khung nhìn "KWIC" trong công cụ concordance (vd AntConc) dùng để làm gì?', options: ['Dịch tự động văn bản', 'Xem mọi lần xuất hiện của một từ/cấu trúc trong ngữ cảnh thật', 'Tạo bảng hỏi Likert', 'Tính điểm số bài kiểm tra'], correctIndex: 1, explanation: 'KWIC (KeyWord In Context) hiển thị mỗi lần từ khoá xuất hiện cùng ngữ cảnh xung quanh trong corpus.' },
  { id: 'q3', question: 'Điều gì BẮT BUỘC khi thu thập dữ liệu từ người thật (khảo sát, phỏng vấn)?', options: ['Không cần thông báo mục đích nghiên cứu', 'Sự đồng ý tự nguyện có thông tin (informed consent) & bảo mật', 'Ép người tham gia trả lời cho đủ số lượng', 'Công khai tên người tham gia trong báo cáo'], correctIndex: 1, explanation: 'Đạo đức nghiên cứu yêu cầu sự đồng ý tự nguyện có thông tin và bảo vệ tính ẩn danh/bảo mật của người tham gia.' },
]);

const c5 = doc('crm401-5-1-data-analysis-tools', '5.1 — Data analysis & tools|||5.1 — Phân tích dữ liệu & công cụ',
  'Thống kê mô tả cơ bản (tần suất, tỷ lệ %, trung bình); kiểm định chi-square cho phân tích lỗi; phân tích định tính (mã hoá, phân tích chủ đề); phần mềm SPSS/Excel/AntConc.',
  [[
    `<span class="eyebrow">CRM401 · Chapter 5 · Lesson 5.1</span>
<h2>Data analysis &amp; tools</h2>
<h3>Basic quantitative analysis</h3>
<p>You rarely need advanced statistics for an undergraduate linguistics thesis — descriptive statistics go a long way:</p>
<ul>
<li><strong>Frequency &amp; percentage</strong> — how often does each classifier error type occur, out of the total errors?</li>
<li><strong>Mean / average</strong> — average survey score per question.</li>
<li><strong>Chi-square test (χ²)</strong> — tests whether a difference between groups (e.g. error rate of two classifiers) is likely due to chance or is a real pattern; typically the threshold is <strong>p &lt; 0.05</strong> to call a result statistically significant.</li>
</ul>
<pre><code>Worked example — error-rate calculation
Total classifier occurrences in test:  200
Incorrect uses:                         46
Error rate = 46 / 200 = 23%
</code></pre>
<h3>Qualitative analysis</h3>
<p>For interview transcripts or open-ended survey answers: read repeatedly, assign short <strong>codes</strong> to recurring ideas (e.g. "confuses 个/位", "relies on Vietnamese classifier"), then group codes into broader <strong>themes</strong>. This is called <strong>thematic analysis</strong> — the qualitative counterpart of counting frequencies.</p>
<h3>Common tools</h3>
<pre><code>Excel / Google Sheets — frequency counts, simple charts, small datasets
SPSS                  — standard statistics software for chi-square, t-tests
AntConc               — corpus concordance & frequency analysis (Chapter 4)
Python / R (optional) — for larger datasets or automated corpus processing
</code></pre>
<div class="callout"><span class="badge">Numbers need explaining</span> A percentage or a p-value never speaks for itself in a linguistics thesis — always follow it with a linguistic explanation of WHY the pattern exists (e.g. L1 transfer from Vietnamese). Chapter 6 shows how contrastive analysis supplies exactly that explanation.</div>`,
    `<span class="eyebrow">CRM401 · Chương 5 · Bài 5.1</span>
<h2>Phân tích dữ liệu &amp; công cụ</h2>
<h3>Phân tích định lượng cơ bản</h3>
<p>Khoá luận đại học hiếm khi cần thống kê nâng cao — thống kê mô tả đã đủ dùng trong hầu hết trường hợp:</p>
<ul>
<li><strong>Tần suất &amp; tỷ lệ %</strong> — mỗi loại lỗi lượng từ xuất hiện bao nhiêu lần, trên tổng số lỗi?</li>
<li><strong>Trung bình</strong> — điểm khảo sát trung bình cho mỗi câu hỏi.</li>
<li><strong>Kiểm định chi-square (χ²)</strong> — kiểm tra xem khác biệt giữa các nhóm (vd tỷ lệ lỗi của hai lượng từ) có phải do ngẫu nhiên hay là quy luật thật; ngưỡng thường dùng là <strong>p &lt; 0,05</strong> để coi là có ý nghĩa thống kê.</li>
</ul>
<pre><code>Ví dụ tính toán — tỷ lệ lỗi
Tổng số lần dùng lượng từ trong bài test:  200
Số lần dùng sai:                            46
Tỷ lệ lỗi = 46 / 200 = 23%
</code></pre>
<h3>Phân tích định tính</h3>
<p>Với bản ghi phỏng vấn hoặc câu trả lời mở trong khảo sát: đọc nhiều lần, gán <strong>mã (code)</strong> ngắn cho các ý lặp lại (vd "nhầm 个/位", "dựa vào lượng từ tiếng Việt"), rồi gộp các mã thành <strong>chủ đề (theme)</strong> rộng hơn. Đây gọi là <strong>phân tích chủ đề (thematic analysis)</strong> — phần tương ứng của định lượng bên phía định tính.</p>
<h3>Công cụ phổ biến</h3>
<pre><code>Excel / Google Sheets — đếm tần suất, biểu đồ đơn giản, dữ liệu nhỏ
SPSS                  — phần mềm thống kê chuẩn cho chi-square, t-test
AntConc               — phân tích concordance & tần suất corpus (Chương 4)
Python / R (tuỳ chọn) — cho dữ liệu lớn hoặc xử lý corpus tự động
</code></pre>
<div class="callout"><span class="badge">Số liệu cần được giải thích</span> Một tỷ lệ % hay giá trị p KHÔNG bao giờ tự nói lên điều gì trong khoá luận ngôn ngữ — luôn theo sau bằng giải thích ngôn ngữ học VÌ SAO quy luật đó tồn tại (vd chuyển di từ tiếng Việt L1). Chương 6 sẽ chỉ cách phân tích đối chiếu cung cấp đúng lời giải thích đó.</div>`,
  ]]);

const c5q = quiz('crm401-quiz-5', 'Quiz 5 — Data analysis & tools|||Quiz 5 — Phân tích dữ liệu & công cụ', [
  { id: 'q1', question: 'Nếu 46 trên tổng 200 lần dùng lượng từ là sai, tỷ lệ lỗi là bao nhiêu?', options: ['4,6%', '23%', '46%', '68%'], correctIndex: 1, explanation: '46/200 = 0,23 = 23%.' },
  { id: 'q2', question: 'Kiểm định chi-square (χ²) dùng để làm gì?', options: ['Đo độ dài văn bản', 'Kiểm tra khác biệt giữa các nhóm có phải do ngẫu nhiên hay là quy luật thật', 'Dịch từ tiếng Trung sang tiếng Việt', 'Ghi âm phỏng vấn'], correctIndex: 1, explanation: 'Chi-square kiểm tra ý nghĩa thống kê của khác biệt giữa các nhóm, thường dùng ngưỡng p < 0,05.' },
  { id: 'q3', question: '"Phân tích chủ đề" (thematic analysis) là kỹ thuật phân tích cho loại dữ liệu nào?', options: ['Chỉ dữ liệu số từ khảo sát Likert', 'Dữ liệu định tính như bản ghi phỏng vấn, câu trả lời mở', 'Chỉ dữ liệu từ kiểm định chi-square', 'Chỉ dữ liệu corpus lớn'], correctIndex: 1, explanation: 'Thematic analysis mã hoá và gộp chủ đề từ dữ liệu định tính (lời nói, văn bản), khác với đếm tần suất định lượng.' },
]);

const c6 = doc('crm401-6-1-contrastive-translation-culture', '6.1 — Contrastive, translation & cultural research|||6.1 — Nghiên cứu đối chiếu, dịch thuật & văn hoá',
  'Ngôn ngữ học đối chiếu (对比语言学): mô tả - đối sánh - so sánh; phương pháp nghiên cứu dịch thuật (tương đương, dịch ngược); nghiên cứu văn hoá qua thành ngữ/tục ngữ; ví dụ đối chiếu Trung-Việt.',
  [[
    `<span class="eyebrow">CRM401 · Chapter 6 · Lesson 6.1</span>
<h2>Contrastive, translation &amp; cultural research</h2>
<h3>Contrastive linguistics (对比语言学 duìbǐ yǔyánxué)</h3>
<p>Contrastive analysis systematically compares two languages to explain similarities/differences — often exactly what explains the "why" behind an error count from Chapter 5. The standard three-step method:</p>
<pre><code>1. Description   — describe feature X in Language A on its own terms
2. Juxtaposition — describe the corresponding feature in Language B
3. Comparison    — state precisely where they match / diverge, and predict
                    the learning difficulty this creates
</code></pre>
<p>Example: Chinese classifiers (量词, e.g. 个/位/只) have no direct equivalent category in Vietnamese noun phrases in the same grammatical form — this structural gap is the linguistic reason Vietnamese learners over-apply one "default" classifier (个) in Chapter 4-5's error data.</p>
<h3>Translation studies methods</h3>
<ul>
<li><strong>Equivalence</strong> — does the translation preserve meaning, form, or effect? (Full equivalence is often impossible — a translator chooses which to prioritize.)</li>
<li><strong>Back-translation</strong> — translate a text into the target language, then have someone independently translate it back to the source language, and compare to the original — a check used in translation-quality research.</li>
<li><strong>Parallel corpus</strong> — a corpus of original texts aligned sentence-by-sentence with their published translation, useful for studying real translator choices at scale.</li>
</ul>
<h3>Cultural research through idioms &amp; proverbs</h3>
<p>Idioms/proverbs (成语 chéngyǔ, 谚语 yànyǔ) encode cultural values, so contrastive idiom studies are a common, well-scoped thesis topic. Example: <strong>汉越颜色词文化内涵对比研究</strong> (a contrastive study of the cultural connotations of color words in Chinese and Vietnamese) — comparing what 红 (hóng, red) or 黄 (huáng, yellow) symbolizes in each culture, beyond their literal color meaning.</p>
<div class="callout"><span class="badge">A ready-made thesis shape</span> Contrastive + cultural topics fit this course's methods directly: pick a linguistic item (word/idiom/structure) → describe in Chinese → describe in Vietnamese → compare → explain cultural or pedagogical implications.</div>`,
    `<span class="eyebrow">CRM401 · Chương 6 · Bài 6.1</span>
<h2>Nghiên cứu đối chiếu, dịch thuật &amp; văn hoá</h2>
<h3>Ngôn ngữ học đối chiếu (对比语言学 duìbǐ yǔyánxué)</h3>
<p>Phân tích đối chiếu so sánh có hệ thống hai ngôn ngữ để giải thích điểm giống/khác nhau — thường chính là điều giải thích "vì sao" đằng sau số liệu lỗi ở Chương 5. Phương pháp ba bước chuẩn:</p>
<pre><code>1. Mô tả       — mô tả hiện tượng X trong Ngôn ngữ A theo đúng bản chất của nó
2. Đối sánh    — mô tả hiện tượng tương ứng trong Ngôn ngữ B
3. So sánh     — chỉ ra chính xác điểm giống/khác, và dự đoán khó khăn học tập
                 mà sự khác biệt này gây ra
</code></pre>
<p>Ví dụ: lượng từ tiếng Trung (量词, vd 个/位/只) không có phạm trù tương đương trực tiếp trong cụm danh từ tiếng Việt ở cùng dạng ngữ pháp — khoảng trống cấu trúc này chính là lý do ngôn ngữ học khiến người Việt học tiếng Trung lạm dụng một lượng từ "mặc định" (个) trong dữ liệu lỗi ở Chương 4-5.</p>
<h3>Phương pháp nghiên cứu dịch thuật</h3>
<ul>
<li><strong>Tính tương đương (equivalence)</strong> — bản dịch giữ được nghĩa, hình thức, hay hiệu quả? (Tương đương hoàn toàn thường là bất khả thi — người dịch chọn ưu tiên điều gì.)</li>
<li><strong>Dịch ngược (back-translation)</strong> — dịch văn bản sang ngôn ngữ đích, rồi nhờ người khác dịch ngược độc lập về ngôn ngữ gốc, so sánh với bản gốc — một cách kiểm tra dùng trong nghiên cứu chất lượng dịch thuật.</li>
<li><strong>Corpus song song (parallel corpus)</strong> — kho ngữ liệu văn bản gốc căn chỉnh theo từng câu với bản dịch đã xuất bản, hữu ích để nghiên cứu lựa chọn thực tế của dịch giả trên quy mô lớn.</li>
</ul>
<h3>Nghiên cứu văn hoá qua thành ngữ &amp; tục ngữ</h3>
<p>Thành ngữ/tục ngữ (成语 chéngyǔ, 谚语 yànyǔ) mã hoá giá trị văn hoá, nên nghiên cứu đối chiếu thành ngữ là đề tài khoá luận phổ biến, phạm vi vừa phải. Ví dụ: <strong>汉越颜色词文化内涵对比研究</strong> (nghiên cứu đối chiếu hàm nghĩa văn hoá của từ chỉ màu sắc trong tiếng Trung và tiếng Việt) — so sánh 红 (hóng, đỏ) hay 黄 (huáng, vàng) biểu trưng cho điều gì trong mỗi nền văn hoá, ngoài nghĩa màu sắc thuần tuý.</p>
<div class="callout"><span class="badge">Một khung khoá luận có sẵn</span> Đề tài đối chiếu + văn hoá khớp trực tiếp với phương pháp của môn này: chọn một đơn vị ngôn ngữ (từ/thành ngữ/cấu trúc) → mô tả trong tiếng Trung → mô tả trong tiếng Việt → so sánh → giải thích hàm ý văn hoá hoặc sư phạm.</div>`,
  ]]);

const c6q = quiz('crm401-quiz-6', 'Quiz 6 — Contrastive, translation & cultural research|||Quiz 6 — Đối chiếu, dịch thuật & văn hoá', [
  { id: 'q1', question: 'Ba bước chuẩn của phân tích đối chiếu (对比语言学) là gì?', options: ['Dịch - kiểm tra - xuất bản', 'Mô tả - đối sánh - so sánh', 'Khảo sát - phỏng vấn - phân tích', 'Chọn đề tài - viết đề cương - bảo vệ'], correctIndex: 1, explanation: 'Phân tích đối chiếu: mô tả ngôn ngữ A → đối sánh (mô tả) ngôn ngữ B → so sánh điểm giống/khác và hệ quả.' },
  { id: 'q2', question: '"Dịch ngược" (back-translation) dùng để làm gì trong nghiên cứu dịch thuật?', options: ['Tăng tốc độ dịch', 'Kiểm tra chất lượng dịch bằng cách dịch ngược lại rồi so với bản gốc', 'Thay thế hoàn toàn việc đọc bản gốc', 'Chỉ dùng cho văn bản pháp lý'], correctIndex: 1, explanation: 'Back-translation là công cụ kiểm tra: dịch sang ngôn ngữ đích, dịch ngược độc lập về nguồn, so sánh với bản gốc.' },
  { id: 'q3', question: 'Vì sao lượng từ tiếng Trung (量词) là một đề tài đối chiếu Trung-Việt hay được chọn?', options: ['Vì tiếng Việt có hệ thống lượng từ giống hệt tiếng Trung', 'Vì tiếng Việt không có phạm trù tương đương trực tiếp cùng dạng ngữ pháp, gây khó khăn học tập dự đoán được', 'Vì lượng từ không xuất hiện trong tiếng Trung hiện đại', 'Vì đây là chủ đề không liên quan đến ngôn ngữ học'], correctIndex: 1, explanation: 'Khoảng trống cấu trúc giữa hai ngôn ngữ (lượng từ Trung vs không có phạm trù tương đương ở Việt) giải thích lỗi của người học — đúng bản chất phân tích đối chiếu.' },
]);

const c7 = doc('crm401-7-1-proposal-writing-apa', '7.1 — Writing the proposal & thesis report (structure, APA)|||7.1 — Viết đề cương & báo cáo/khoá luận (cấu trúc, trích dẫn APA)',
  'Cấu trúc đề cương nghiên cứu; cấu trúc khoá luận IMRaD (Mở đầu-Tổng quan-Phương pháp-Kết quả-Bàn luận-Kết luận); quy tắc trích dẫn APA trong văn bản và danh mục tài liệu tham khảo; trích dẫn nguồn tiếng Trung.',
  [[
    `<span class="eyebrow">CRM401 · Chapter 7 · Lesson 7.1</span>
<h2>Writing the proposal &amp; thesis report</h2>
<h3>Research proposal structure</h3>
<p>Before writing the full thesis, most programs require a short <strong>proposal</strong> approved by a supervisor, typically covering: title, background/rationale, research problem &amp; questions (Chapter 2), brief literature review, planned methodology (Chapters 3-4), expected significance, and a timeline.</p>
<h3>Thesis structure — IMRaD</h3>
<pre><code>1. Introduction     — background, problem, questions, significance, scope
2. Literature Review — synthesis of prior studies, theoretical framework
3. Methodology       — design, participants/data, instruments, procedure
4. Results            — findings, presented with tables/figures, no interpretation yet
5. Discussion         — interpret results, relate back to literature & questions
6. Conclusion         — summary, limitations, recommendations for future research
</code></pre>
<p>This IMRaD pattern (Introduction, Methods, Results, and Discussion) is the near-universal skeleton across social-science and linguistics theses worldwide — Chinese-language 语言学研究方法 texts use the same structure under different chapter labels.</p>
<h3>APA citation basics</h3>
<ul>
<li><strong>In-text citation</strong> — (Litosseliti, 2018) or Litosseliti (2018) argues that … For direct quotes, add a page number: (Litosseliti, 2018, p. 45).</li>
<li><strong>Reference list</strong> — every in-text citation must have a matching full entry, alphabetized by author surname, e.g.: <em>Litosseliti, L. (Ed.). (2018). Research methods in linguistics. Bloomsbury.</em></li>
<li><strong>Citing Chinese-language sources</strong> — give the original characters, a romanization/translation of the title in brackets, and the same author-date format, e.g.: <em>王力 [Wang, L.]. (1985). 汉语语法史 [A history of Chinese grammar]. 商务印书馆.</em></li>
</ul>
<div class="callout"><span class="badge">Use a reference manager</span> Tools like Zotero/Mendeley (Course materials tab) auto-generate correctly formatted APA in-text citations and reference lists as you write — far less error-prone than typing them by hand.</div>`,
    `<span class="eyebrow">CRM401 · Chương 7 · Bài 7.1</span>
<h2>Viết đề cương &amp; báo cáo khoá luận</h2>
<h3>Cấu trúc đề cương nghiên cứu</h3>
<p>Trước khi viết khoá luận đầy đủ, hầu hết chương trình yêu cầu một <strong>đề cương (proposal)</strong> ngắn được giảng viên hướng dẫn duyệt, thường gồm: tên đề tài, bối cảnh/lý do chọn đề tài, vấn đề &amp; câu hỏi nghiên cứu (Chương 2), tổng quan tài liệu tóm tắt, phương pháp dự kiến (Chương 3-4), ý nghĩa dự kiến, và tiến độ thực hiện.</p>
<h3>Cấu trúc khoá luận — IMRaD</h3>
<pre><code>1. Mở đầu (Introduction)      — bối cảnh, vấn đề, câu hỏi, ý nghĩa, phạm vi
2. Tổng quan tài liệu          — tổng hợp nghiên cứu trước, khung lý thuyết
3. Phương pháp (Methodology)  — thiết kế, đối tượng/dữ liệu, công cụ, quy trình
4. Kết quả (Results)          — trình bày kết quả bằng bảng/biểu, chưa diễn giải
5. Bàn luận (Discussion)      — diễn giải kết quả, liên hệ tài liệu & câu hỏi
6. Kết luận (Conclusion)      — tóm tắt, hạn chế, khuyến nghị nghiên cứu tiếp
</code></pre>
<p>Khung IMRaD (Introduction, Methods, Results, Discussion) này gần như là bộ khung phổ quát cho khoá luận khoa học xã hội và ngôn ngữ học trên toàn thế giới — giáo trình tiếng Trung 《语言学研究方法》 dùng cùng cấu trúc dưới tên chương khác.</p>
<h3>Quy tắc trích dẫn APA cơ bản</h3>
<ul>
<li><strong>Trích dẫn trong văn bản</strong> — (Litosseliti, 2018) hoặc Litosseliti (2018) cho rằng … Với trích dẫn trực tiếp, thêm số trang: (Litosseliti, 2018, p. 45).</li>
<li><strong>Danh mục tài liệu tham khảo</strong> — mỗi trích dẫn trong văn bản phải có một mục đầy đủ tương ứng, sắp theo họ tác giả, vd: <em>Litosseliti, L. (Ed.). (2018). Research methods in linguistics. Bloomsbury.</em></li>
<li><strong>Trích dẫn nguồn tiếng Trung</strong> — ghi Hán tự gốc, kèm phiên âm/dịch tên trong ngoặc, cùng định dạng tác giả-năm, vd: <em>王力 [Wang, L.]. (1985). 汉语语法史 [Lịch sử ngữ pháp tiếng Hán]. 商务印书馆.</em></li>
</ul>
<div class="callout"><span class="badge">Dùng phần mềm quản lý tài liệu</span> Công cụ như Zotero/Mendeley (tab Tài liệu tham khảo) tự sinh trích dẫn trong văn bản và danh mục tham khảo APA đúng chuẩn khi bạn viết — ít lỗi hơn nhiều so với gõ tay.</div>`,
  ]]);

const c7q = quiz('crm401-quiz-7', 'Quiz 7 — Proposal & thesis writing (APA)|||Quiz 7 — Viết đề cương & báo cáo (APA)', [
  { id: 'q1', question: 'Khung cấu trúc IMRaD gồm những phần nào, theo đúng thứ tự?', options: ['Kết luận - Kết quả - Mở đầu - Phương pháp', 'Mở đầu - Tổng quan tài liệu - Phương pháp - Kết quả - Bàn luận - Kết luận', 'Chỉ có Kết quả và Bàn luận', 'Phương pháp - Mở đầu - Kết luận - Tổng quan'], correctIndex: 1, explanation: 'IMRaD: Mở đầu → Tổng quan tài liệu → Phương pháp → Kết quả → Bàn luận → Kết luận.' },
  { id: 'q2', question: 'Trong phần "Kết quả" (Results) của khoá luận, bạn nên làm gì?', options: ['Trình bày kết quả và diễn giải ý nghĩa ngay lập tức', 'Chỉ trình bày kết quả (bảng/biểu), chưa diễn giải — diễn giải để dành cho phần Bàn luận', 'Bỏ qua phần này, gộp vào Kết luận', 'Chỉ liệt kê tài liệu tham khảo'], correctIndex: 1, explanation: 'Theo IMRaD, Kết quả chỉ trình bày dữ liệu; diễn giải ý nghĩa thuộc về phần Bàn luận (Discussion).' },
  { id: 'q3', question: 'Trích dẫn APA trong văn bản cho một trích dẫn trực tiếp cần thêm thông tin gì so với trích dẫn ý tưởng thông thường?', options: ['Không cần thêm gì', 'Số trang, vd (Litosseliti, 2018, p. 45)', 'Tên đầy đủ của nhà xuất bản', 'Địa chỉ email của tác giả'], correctIndex: 1, explanation: 'Trích dẫn trực tiếp (nguyên văn) trong APA cần thêm số trang bên cạnh tác giả-năm.' },
]);

const c8 = doc('crm401-8-1-ethics-defense', '8.1 — Research ethics, presentation & thesis defense|||8.1 — Đạo đức nghiên cứu, trình bày & bảo vệ khoá luận',
  'Nguyên tắc đạo đức nghiên cứu (đồng ý tự nguyện, bảo mật, trung thực, không đạo văn/bịa số liệu); khái niệm hội đồng xét duyệt đạo đức; quy trình bảo vệ khoá luận; câu hỏi hội đồng thường gặp.',
  [[
    `<span class="eyebrow">CRM401 · Chapter 8 · Lesson 8.1</span>
<h2>Research ethics, presentation &amp; thesis defense</h2>
<h3>Core research ethics principles</h3>
<ul>
<li><strong>Informed consent</strong> (revisited from Chapter 4) — participants must know the purpose, procedures and their right to withdraw at any time, without penalty.</li>
<li><strong>Confidentiality &amp; anonymity</strong> — store raw data (recordings, filled surveys) securely; report results in a way that no individual can be identified.</li>
<li><strong>Honesty</strong> — never fabricate or alter data to fit your expected conclusion; report unexpected or "inconvenient" results too.</li>
<li><strong>No plagiarism</strong> (revisited from Chapter 2) — every idea, quote or dataset that is not originally yours must be cited.</li>
</ul>
<p>Many universities require sensitive studies (e.g. involving minors, medical/psychological topics) to pass an <strong>ethics review board</strong> before data collection begins; for a typical undergraduate linguistics survey/interview this is usually lighter — but the principles above always apply regardless of formal review.</p>
<h3>Preparing the defense presentation</h3>
<pre><code>Typical defense slide structure (10-15 min):
1. Title, your name, supervisor       5. Key results (1-2 slides, visual)
2. Research problem & questions       6. Discussion / interpretation
3. Brief literature gap               7. Conclusion & contribution
4. Methodology summary                8. Limitations & future research
</code></pre>
<h3>Common committee questions</h3>
<ul>
<li>"Why did you choose this method over an alternative?" — be ready to justify your Chapter 3 design choice.</li>
<li>"What is the practical/theoretical contribution of your findings?" — connect back to the gap from Chapter 2.</li>
<li>"What would you do differently with more time/resources?" — this is expected; naming real limitations shows maturity, not weakness.</li>
</ul>
<div class="callout"><span class="badge">Confidence, not memorization</span> The committee is testing whether YOU understand your own study, not whether you can recite it. Know your data well enough to answer a question you did not rehearse.</div>`,
    `<span class="eyebrow">CRM401 · Chương 8 · Bài 8.1</span>
<h2>Đạo đức nghiên cứu, trình bày &amp; bảo vệ khoá luận</h2>
<h3>Nguyên tắc đạo đức nghiên cứu cốt lõi</h3>
<ul>
<li><strong>Đồng ý tự nguyện có thông tin</strong> (nhắc lại từ Chương 4) — người tham gia phải biết mục đích, quy trình, và quyền rút lui bất cứ lúc nào mà không bị ảnh hưởng gì.</li>
<li><strong>Bảo mật &amp; ẩn danh</strong> — lưu trữ dữ liệu thô (bản ghi âm, phiếu khảo sát) an toàn; báo cáo kết quả sao cho không ai nhận diện được cá nhân cụ thể.</li>
<li><strong>Trung thực</strong> — không bao giờ bịa hoặc chỉnh sửa dữ liệu cho khớp với kết luận mong muốn; báo cáo cả kết quả bất ngờ hoặc "bất lợi."</li>
<li><strong>Không đạo văn</strong> (nhắc lại từ Chương 2) — mọi ý tưởng, trích dẫn hoặc bộ dữ liệu không phải của bạn đều phải được trích dẫn nguồn.</li>
</ul>
<p>Nhiều trường yêu cầu các nghiên cứu nhạy cảm (vd liên quan trẻ vị thành niên, chủ đề y tế/tâm lý) phải qua <strong>hội đồng xét duyệt đạo đức</strong> trước khi thu thập dữ liệu; với khảo sát/phỏng vấn ngôn ngữ học thông thường ở bậc đại học, quy trình này thường nhẹ hơn — nhưng các nguyên tắc trên luôn áp dụng bất kể có xét duyệt chính thức hay không.</p>
<h3>Chuẩn bị bài trình bày bảo vệ</h3>
<pre><code>Cấu trúc slide bảo vệ điển hình (10-15 phút):
1. Tên đề tài, tên bạn, GVHD           5. Kết quả chính (1-2 slide, trực quan)
2. Vấn đề & câu hỏi nghiên cứu          6. Bàn luận / diễn giải
3. Khoảng trống tài liệu (tóm tắt)     7. Kết luận & đóng góp
4. Tóm tắt phương pháp                 8. Hạn chế & hướng nghiên cứu tiếp
</code></pre>
<h3>Câu hỏi hội đồng thường gặp</h3>
<ul>
<li>"Vì sao bạn chọn phương pháp này thay vì phương án khác?" — chuẩn bị sẵn lý do bảo vệ lựa chọn thiết kế ở Chương 3.</li>
<li>"Đóng góp thực tiễn/lý thuyết của kết quả nghiên cứu là gì?" — liên hệ ngược lại khoảng trống đã nêu ở Chương 2.</li>
<li>"Nếu có thêm thời gian/nguồn lực, bạn sẽ làm khác đi điều gì?" — câu hỏi này luôn được hỏi; nêu hạn chế thật thể hiện sự chín chắn, không phải điểm yếu.</li>
</ul>
<div class="callout"><span class="badge">Tự tin, không học thuộc</span> Hội đồng kiểm tra xem CHÍNH BẠN có hiểu nghiên cứu của mình không, chứ không phải bạn có thuộc lòng được không. Hiểu dữ liệu của mình đủ sâu để trả lời cả câu hỏi bạn chưa từng luyện tập trước.</div>`,
  ]]);

const c8q = quiz('crm401-quiz-8', 'Quiz 8 — Research ethics & thesis defense|||Quiz 8 — Đạo đức nghiên cứu & bảo vệ khoá luận', [
  { id: 'q1', question: 'Nguyên tắc nào sau đây KHÔNG thuộc đạo đức nghiên cứu cơ bản?', options: ['Đồng ý tự nguyện có thông tin', 'Trung thực khi báo cáo dữ liệu', 'Chỉnh sửa dữ liệu cho khớp với kết luận mong muốn', 'Bảo mật danh tính người tham gia'], correctIndex: 2, explanation: 'Chỉnh sửa/bịa dữ liệu là gian lận nghiên cứu, vi phạm nghiêm trọng nguyên tắc trung thực.' },
  { id: 'q2', question: 'Khi hội đồng hỏi "nếu có thêm thời gian, bạn sẽ làm khác đi điều gì", câu trả lời tốt nên thể hiện điều gì?', options: ['Phủ nhận khoá luận có bất kỳ hạn chế nào', 'Nêu hạn chế thật một cách chín chắn, cho thấy bạn hiểu rõ nghiên cứu của mình', 'Đổ lỗi cho giảng viên hướng dẫn', 'Từ chối trả lời vì câu hỏi không công bằng'], correctIndex: 1, explanation: 'Nêu hạn chế thật là dấu hiệu hiểu sâu và trưởng thành trong nghiên cứu, được hội đồng đánh giá cao.' },
  { id: 'q3', question: 'Mục tiêu chính của buổi bảo vệ khoá luận, theo bài học, là gì?', options: ['Kiểm tra khả năng học thuộc lòng bài trình bày', 'Kiểm tra xem chính bạn có hiểu sâu nghiên cứu của mình không', 'Chỉ để xác nhận bạn đã nộp đúng hạn', 'Đánh giá kỹ năng thiết kế slide đẹp'], correctIndex: 1, explanation: 'Hội đồng muốn kiểm tra mức độ hiểu và làm chủ nghiên cứu của chính người trình bày, không phải khả năng học thuộc.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'CRM401',
    slug: 'crm401-research-method',
    title: 'Research Method',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CRM401.webp',
    shortDescription: 'Research methods for Chinese-language studies: problem & literature review, qualitative vs quantitative design, data collection (surveys/interviews/corpora), analysis, contrastive/translation research, thesis writing (APA), ethics & defense.|||Phương pháp nghiên cứu ngôn ngữ Trung: vấn đề & tổng quan tài liệu, thiết kế định tính/định lượng, thu thập dữ liệu (khảo sát/phỏng vấn/corpus), phân tích, đối chiếu/dịch thuật, viết khoá luận (APA), đạo đức & bảo vệ.',
    description: 'Môn <strong>CRM401 — Research Method</strong> (Phương pháp Nghiên cứu Khoa học, kỳ 7, ngành Ngôn ngữ Trung) trang bị phương pháp nghiên cứu <strong>khoa học xã hội - nhân văn/ngôn ngữ học</strong> để làm khoá luận về ngôn ngữ &amp; văn hoá Trung Quốc. Từ <strong>tổng quan nghiên cứu khoa học</strong> → <strong>xác định vấn đề, câu hỏi &amp; tổng quan tài liệu</strong> → <strong>thiết kế định tính vs định lượng</strong> → <strong>thu thập dữ liệu ngôn ngữ</strong> (khảo sát, phỏng vấn, corpus) → <strong>phân tích dữ liệu &amp; công cụ</strong> → <strong>nghiên cứu đối chiếu, dịch thuật &amp; văn hoá</strong> → <strong>viết đề cương &amp; báo cáo (APA)</strong> → <strong>đạo đức nghiên cứu &amp; bảo vệ khoá luận</strong>. Song ngữ Anh-Việt, ví dụ đề tài kèm chữ Hán + pinyin, quiz mỗi chương.',
    whatYouLearn: 'Đặc điểm nghiên cứu khoa học & các nhánh ngôn ngữ học; cách xác định vấn đề, câu hỏi nghiên cứu & viết tổng quan tài liệu tránh đạo văn; thiết kế định tính/định lượng/hỗn hợp, biến số, độ tin cậy & độ giá trị; khảo sát Likert, phỏng vấn, khai thác corpus (BCC/CCL) bằng công cụ concordance; thống kê mô tả & chi-square, phân tích chủ đề, phần mềm SPSS/AntConc; phương pháp đối chiếu ngôn ngữ, dịch thuật (tương đương, dịch ngược), nghiên cứu văn hoá qua thành ngữ; cấu trúc đề cương & khoá luận IMRaD, trích dẫn APA; đạo đức nghiên cứu & kỹ năng bảo vệ khoá luận.',
    requirements: 'Đã học các môn tiếng Trung cơ bản của ngành Ngôn ngữ Trung. Không cần kiến thức thống kê hay nghiên cứu khoa học trước đó.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Ba nguồn tham khảo chính (Litosseliti, Doing Applied Linguistics Research, 语言学研究方法) + kho ngữ liệu, công cụ miễn phí.', lessons: [taiLieu] },
    { title: 'Chương 1 — Tổng quan nghiên cứu khoa học & ngôn ngữ|||Chapter 1 — Overview of scientific & linguistic research', description: 'Đặc điểm nghiên cứu khoa học, các nhánh ngôn ngữ học, chu trình nghiên cứu.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Vấn đề, câu hỏi nghiên cứu & tổng quan tài liệu|||Chapter 2 — Problem, questions & literature review', description: 'Chọn đề tài, viết câu hỏi nghiên cứu, tổng quan tài liệu, tránh đạo văn.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thiết kế định tính vs định lượng|||Chapter 3 — Qualitative vs quantitative design', description: 'So sánh hai hướng tiếp cận, thành phần thiết kế, các loại thiết kế phổ biến.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thu thập dữ liệu ngôn ngữ|||Chapter 4 — Collecting linguistic data', description: 'Khảo sát, phỏng vấn, ngữ liệu corpus (BCC/CCL), đạo đức thu thập dữ liệu.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân tích dữ liệu & công cụ|||Chapter 5 — Data analysis & tools', description: 'Thống kê mô tả, chi-square, phân tích chủ đề, SPSS/Excel/AntConc.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đối chiếu, dịch thuật & văn hoá|||Chapter 6 — Contrastive, translation & cultural research', description: 'Ngôn ngữ học đối chiếu, phương pháp dịch thuật, nghiên cứu văn hoá qua thành ngữ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Viết đề cương & báo cáo (APA)|||Chapter 7 — Proposal & thesis writing (APA)', description: 'Cấu trúc đề cương, khoá luận IMRaD, quy tắc trích dẫn APA.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đạo đức nghiên cứu & bảo vệ khoá luận|||Chapter 8 — Research ethics & thesis defense', description: 'Nguyên tắc đạo đức, chuẩn bị trình bày, câu hỏi hội đồng thường gặp.', lessons: [c8, c8q] },
  ],
};
