/**
 * RMB301 — Business Research Methods (Phương pháp nghiên cứu trong kinh doanh). Khối QTKD, kỳ 4.
 * Bám ĐỀ CƯƠNG FLM sylID 12391 (QĐ 1363/QĐ-ĐHFPT, 06/12/2024) + sách CHÍNH Saunders, Lewis &
 * Thornhill — Research Methods for Business Students (Pearson, 9th ed.; 8th ed. 2019 cũng được):
 * đủ 14 chương ĐÚNG thứ tự đề cương, gom 5 phần theo tiến trình GA1 (đề tài) → GA2 (tổng quan +
 * khung lý thuyết) → GA3 (đề cương hoàn chỉnh); hồi quy tham khảo Wooldridge — Introductory
 * Econometrics (Cengage); thống kê tham khảo OpenStax Introductory Business Statistics 2e.
 * Tích hợp AI đúng tinh thần đề cương (có quy trình kiểm chứng, liêm chính học thuật).
 * Song ngữ + ví dụ số (đã kiểm bằng máy; số liệu là GIẢ ĐỊNH) + bài tập + quiz kiểu thi cuối kỳ.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('rmb301-0-1-overview', 'Course overview: from a research idea to a defensible proposal|||Tổng quan: từ một ý tưởng nghiên cứu tới một đề cương bảo vệ được',
  'Nghiên cứu kinh doanh là gì, bốn chuẩn đầu ra (CLO) của môn, cấu trúc đánh giá GA1–GA2–GA3–thi cuối kỳ, tiến trình nghiên cứu theo Saunders, lộ trình 5 phần bám 14 chương, và quy tắc dùng AI trong môn học.',
  [[
    `<span class="eyebrow">RMB301 · Lesson 0.1 · Overview</span>
<h2>Business Research Methods</h2>
<p class="lead">Research is a process that people carry out <strong>systematically</strong> in order to <strong>find things out</strong> and so increase knowledge. In business and management, it must satisfy two tests at once: <strong>rigour</strong> (sound theory and method) and <strong>relevance</strong> (useful to managers and organisations). This course takes you from a vague interest to a research proposal you can present and defend — the foundation of your graduation thesis.</p>
<h3>What you will be able to do (course learning outcomes)</h3>
<table>
<tr><th>CLO</th><th>Outcome</th><th>Where it is built</th></tr>
<tr><td>1</td><td>Write a literature review that synthesises and critically evaluates the literature on a topic to justify a research question</td><td>Part 1 → GA1, GA2</td></tr>
<tr><td>2</td><td>Apply a research design and methods that fit a research question, and identify their ethical implications</td><td>Parts 2–4</td></tr>
<tr><td>3</td><td>Build a research proposal that can serve as the basis of a thesis</td><td>Part 5 → GA3</td></tr>
<tr><td>4</td><td>Present and defend the research proposal</td><td>Part 5 → presentation</td></tr>
</table>
<h3>How the course is assessed (syllabus on FLM)</h3>
<table>
<tr><th>Component</th><th>Weight</th><th>What you submit</th></tr>
<tr><td>Participation</td><td>15%</td><td>Class activities and discussion questions</td></tr>
<tr><td>Group assignment 1 (GA1)</td><td>10%</td><td>Research topic, research questions and objectives (max. 2 pages)</td></tr>
<tr><td>Group assignment 2 (GA2)</td><td>20%</td><td>Literature review and theoretical framework (max. 15 pages)</td></tr>
<tr><td>Group assignment 3 (GA3)</td><td>25%</td><td>Complete proposal: methodology, scope, planned thesis structure (max. 20 pages)</td></tr>
<tr><td>Final exam</td><td>30%</td><td>50 multiple-choice questions in 60 minutes</td></tr>
</table>
<h3>The research process</h3>
<p>Following Saunders, Lewis &amp; Thornhill, a research project moves through these stages — not in a straight line, but with frequent loops back as your understanding grows:</p>
<ol>
<li>Formulate and clarify the research topic (Ch 2).</li>
<li>Critically review the literature (Ch 3).</li>
<li>Understand your research philosophy and approach to theory development (Ch 4).</li>
<li>Formulate the research design (Ch 5) and negotiate access while addressing ethics (Ch 6).</li>
<li>Plan data collection and collect data: sampling, secondary data, observation, interviews, questionnaires (Ch 7–11).</li>
<li>Analyse the data quantitatively and/or qualitatively (Ch 12–13).</li>
<li>Write and present the project report (Ch 14).</li>
</ol>
<h3>Roadmap of this course</h3>
<table>
<tr><th>Part</th><th>Textbook chapters</th><th>Linked assignment</th></tr>
<tr><td>1 — Topic &amp; literature review</td><td>Ch 1–3</td><td>GA1</td></tr>
<tr><td>2 — Philosophy, approach &amp; design</td><td>Ch 4–6</td><td>GA2 (framework) and GA3 (method)</td></tr>
<tr><td>3 — Sampling &amp; data collection</td><td>Ch 7–11</td><td>GA3 (method)</td></tr>
<tr><td>4 — Analysing data</td><td>Ch 12–13</td><td>GA3 (analysis plan), thesis</td></tr>
<tr><td>5 — Writing &amp; presenting</td><td>Ch 14 + responsible use of AI</td><td>GA3 and the defence</td></tr>
</table>
<h3>Using AI in this course</h3>
<p>The syllabus integrates AI tools: to generate and refine topics, suggest content, act as a partner for discussion questions, identify credible sources, and summarise findings from structured data and templates. Four rules apply throughout: <strong>you remain the author</strong>; <strong>verify every claim and every reference</strong> (AI tools can invent citations that look real); <strong>disclose</strong> how you used AI as your lecturer requires; and <strong>never paste respondents’ personal data</strong> into public AI tools.</p>
<div class="callout"><span class="badge">One idea to keep</span> A good research project is a chain of justified choices: question → theory → design → data → analysis → conclusion. Every link must be defensible when an examiner asks "why?".</div>`,
    `<span class="eyebrow">RMB301 · Bài 0.1 · Tổng quan</span>
<h2>Phương pháp nghiên cứu trong kinh doanh</h2>
<p class="lead">Nghiên cứu là một quá trình con người thực hiện <strong>có hệ thống</strong> nhằm <strong>tìm hiểu sự việc</strong> và nhờ đó gia tăng hiểu biết. Trong kinh doanh và quản trị, nghiên cứu phải cùng lúc qua hai phép thử: <strong>tính chặt chẽ</strong> (lý thuyết và phương pháp vững) và <strong>tính thiết thực</strong> (hữu ích cho nhà quản trị và tổ chức). Môn học đưa bạn từ một mối quan tâm còn mơ hồ tới một đề cương nghiên cứu có thể trình bày và bảo vệ — nền móng cho khoá luận tốt nghiệp.</p>
<h3>Bạn sẽ làm được gì (chuẩn đầu ra của môn)</h3>
<table>
<tr><th>CLO</th><th>Chuẩn đầu ra</th><th>Được xây ở đâu</th></tr>
<tr><td>1</td><td>Viết tổng quan tài liệu tổng hợp và đánh giá phê phán các nghiên cứu về một chủ đề để biện minh cho câu hỏi nghiên cứu</td><td>Phần 1 → GA1, GA2</td></tr>
<tr><td>2</td><td>Áp dụng thiết kế và phương pháp nghiên cứu phù hợp với câu hỏi nghiên cứu, nhận diện các hệ quả đạo đức</td><td>Phần 2–4</td></tr>
<tr><td>3</td><td>Xây dựng đề cương nghiên cứu làm cơ sở cho khoá luận</td><td>Phần 5 → GA3</td></tr>
<tr><td>4</td><td>Trình bày và bảo vệ đề cương nghiên cứu</td><td>Phần 5 → thuyết trình</td></tr>
</table>
<h3>Cách đánh giá (đề cương trên FLM)</h3>
<table>
<tr><th>Thành phần</th><th>Trọng số</th><th>Sản phẩm nộp</th></tr>
<tr><td>Tham gia lớp</td><td>15%</td><td>Hoạt động trên lớp và câu hỏi thảo luận</td></tr>
<tr><td>Bài tập nhóm 1 (GA1)</td><td>10%</td><td>Đề tài, câu hỏi và mục tiêu nghiên cứu (tối đa 2 trang)</td></tr>
<tr><td>Bài tập nhóm 2 (GA2)</td><td>20%</td><td>Tổng quan tài liệu và khung lý thuyết (tối đa 15 trang)</td></tr>
<tr><td>Bài tập nhóm 3 (GA3)</td><td>25%</td><td>Đề cương hoàn chỉnh: phương pháp, phạm vi, cấu trúc khoá luận dự kiến (tối đa 20 trang)</td></tr>
<tr><td>Thi cuối kỳ</td><td>30%</td><td>50 câu trắc nghiệm trong 60 phút</td></tr>
</table>
<h3>Tiến trình nghiên cứu</h3>
<p>Theo Saunders, Lewis &amp; Thornhill, một dự án nghiên cứu đi qua các giai đoạn sau — không theo đường thẳng mà thường xuyên quay lại các bước trước khi hiểu biết của bạn sâu thêm:</p>
<ol>
<li>Hình thành và làm rõ đề tài nghiên cứu (Ch 2).</li>
<li>Tổng quan tài liệu một cách phê phán (Ch 3).</li>
<li>Hiểu triết lý nghiên cứu và cách tiếp cận phát triển lý thuyết của mình (Ch 4).</li>
<li>Xây dựng thiết kế nghiên cứu (Ch 5), đàm phán quyền tiếp cận và xử lý vấn đề đạo đức (Ch 6).</li>
<li>Lập kế hoạch và thu thập dữ liệu: chọn mẫu, dữ liệu thứ cấp, quan sát, phỏng vấn, bảng hỏi (Ch 7–11).</li>
<li>Phân tích dữ liệu định lượng và/hoặc định tính (Ch 12–13).</li>
<li>Viết và trình bày báo cáo dự án (Ch 14).</li>
</ol>
<h3>Lộ trình môn học</h3>
<table>
<tr><th>Phần</th><th>Chương sách</th><th>Gắn với bài tập</th></tr>
<tr><td>1 — Đề tài &amp; tổng quan tài liệu</td><td>Ch 1–3</td><td>GA1</td></tr>
<tr><td>2 — Triết lý, cách tiếp cận &amp; thiết kế</td><td>Ch 4–6</td><td>GA2 (khung lý thuyết) và GA3 (phương pháp)</td></tr>
<tr><td>3 — Chọn mẫu &amp; thu thập dữ liệu</td><td>Ch 7–11</td><td>GA3 (phương pháp)</td></tr>
<tr><td>4 — Phân tích dữ liệu</td><td>Ch 12–13</td><td>GA3 (kế hoạch phân tích), khoá luận</td></tr>
<tr><td>5 — Viết &amp; trình bày</td><td>Ch 14 + dùng AI có trách nhiệm</td><td>GA3 và buổi bảo vệ</td></tr>
</table>
<h3>Dùng AI trong môn học</h3>
<p>Đề cương tích hợp công cụ AI: để sinh và tinh chỉnh đề tài, gợi ý nội dung, làm bạn đồng hành với câu hỏi thảo luận, xác định nguồn đáng tin cậy, và tóm tắt kết quả từ dữ liệu, biểu mẫu có cấu trúc. Bốn quy tắc áp dụng suốt môn: <strong>bạn vẫn là tác giả</strong>; <strong>kiểm chứng mọi nhận định và mọi trích dẫn</strong> (công cụ AI có thể bịa ra trích dẫn trông như thật); <strong>công khai</strong> cách bạn dùng AI theo yêu cầu của giảng viên; và <strong>không bao giờ dán dữ liệu cá nhân của người trả lời</strong> vào công cụ AI công cộng.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Một dự án nghiên cứu tốt là chuỗi lựa chọn có lý do: câu hỏi → lý thuyết → thiết kế → dữ liệu → phân tích → kết luận. Mắt xích nào cũng phải bảo vệ được khi hội đồng hỏi "vì sao?".</div>`,
  ]]);

const c1 = doc('rmb301-1-1-business-research', '1.1 — Ch 1: Business and management research|||1.1 — Ch 1: Nghiên cứu kinh doanh và quản trị',
  'Nghiên cứu là gì, đặc điểm của nghiên cứu kinh doanh và quản trị (chặt chẽ và thiết thực), nghiên cứu cơ bản và nghiên cứu ứng dụng, nghiên cứu và tư vấn, tri thức Mode 1 và Mode 2, tiến trình nghiên cứu và nhật ký phản tư.',
  [[
    `<span class="eyebrow">RMB301 · Part 1 · Lesson 1.1</span>
<h2>Business and management research</h2>
<p class="lead">Everyday "research" often means looking something up. Academic research is different: it has a <strong>clear purpose</strong>, data are collected and interpreted <strong>systematically</strong>, and the reasoning is <strong>transparent</strong>, so that others can judge — and ideally repeat — what you did.</p>
<h3>What makes business and management research distinctive</h3>
<ul>
<li><strong>It borrows from many disciplines</strong> — economics, psychology, sociology, statistics — and combines them to study organisations and their people.</li>
<li><strong>It must be rigorous and relevant.</strong> Findings should rest on sound theory and method, and they should also mean something to managers.</li>
<li><strong>Access and politics matter.</strong> Managers are busy and organisations guard sensitive information, so gaining access (Ch 6) is part of the method, not an afterthought.</li>
</ul>
<h3>Basic versus applied research</h3>
<table>
<tr><th></th><th>Basic (fundamental) research</th><th>Applied research</th></tr>
<tr><td>Purpose</td><td>Expand knowledge of business and management processes</td><td>Improve understanding of a particular business problem</td></tr>
<tr><td>Typical result</td><td>General principles, theory development</td><td>A solution or recommendation for that problem</td></tr>
<tr><td>Main audience</td><td>Academics and society at large</td><td>Managers in the organisation concerned</td></tr>
<tr><td>Who sets the agenda</td><td>Mainly the researcher</td><td>Negotiated with the organisation or client</td></tr>
<tr><td>Time scale</td><td>Usually flexible</td><td>Usually tight</td></tr>
</table>
<p>Most projects sit somewhere on a <strong>continuum</strong> between the two. A student thesis on "factors influencing Gen Z’s adoption of e-wallets" leans towards basic research; a study commissioned by one retail chain on why its loyalty-app usage is falling is applied research.</p>
<h3>Research and consultancy</h3>
<p>Consultancy also investigates business problems, but it is driven by a client, the findings may be confidential, and the method is not always reported openly. A consultancy project becomes <em>research</em> when it is systematic, transparent about its method and connects its findings to existing knowledge. Your thesis must meet academic standards even if it helps a real company.</p>
<h3>Two modes of knowledge creation</h3>
<p><strong>Mode 1</strong> knowledge is created mainly within universities, for academic purposes, and judged by academic peers. <strong>Mode 2</strong> knowledge is produced in the context of application, often together with practitioners, and judged by its usefulness. Business research frequently tries to bridge the two.</p>
<h3>Keeping a reflective diary</h3>
<p>Because research is iterative, Saunders and colleagues encourage a <strong>reflective diary</strong> (research notebook). After each step, note: what happened, what you learned, what you would do differently, and how it links to theory. The diary helps you justify decisions in the method chapter and prepares you for the defence.</p>
<pre><code class="language-text">Diary entry (illustrative) — Week 3
What happened : 20 articles found on "e-wallet adoption"; most use TAM or UTAUT.
What I learned: few studies look at trust after a security incident.
Next step     : narrow the question to trust; ask the lecturer if the scope is feasible.</code></pre>
<div class="callout"><span class="badge">Remember</span> "Systematic" is the key word. If you cannot explain how you found, selected and analysed your evidence, it is not yet research.</div>`,
    `<span class="eyebrow">RMB301 · Phần 1 · Bài 1.1</span>
<h2>Nghiên cứu kinh doanh và quản trị</h2>
<p class="lead">"Tìm hiểu" hằng ngày thường chỉ là tra cứu một thông tin. Nghiên cứu học thuật thì khác: có <strong>mục đích rõ ràng</strong>, dữ liệu được thu thập và diễn giải <strong>có hệ thống</strong>, và lập luận <strong>minh bạch</strong> để người khác đánh giá được — lý tưởng là lặp lại được — những gì bạn đã làm.</p>
<h3>Điều gì làm nghiên cứu kinh doanh và quản trị khác biệt</h3>
<ul>
<li><strong>Vay mượn từ nhiều ngành</strong> — kinh tế học, tâm lý học, xã hội học, thống kê — và kết hợp chúng để nghiên cứu tổ chức và con người trong tổ chức.</li>
<li><strong>Phải vừa chặt chẽ vừa thiết thực.</strong> Kết quả phải dựa trên lý thuyết và phương pháp vững, đồng thời phải có ý nghĩa với nhà quản trị.</li>
<li><strong>Quyền tiếp cận và yếu tố chính trị trong tổ chức rất quan trọng.</strong> Nhà quản trị bận rộn và tổ chức giữ kín thông tin nhạy cảm, nên việc tiếp cận (Ch 6) là một phần của phương pháp, không phải việc tính sau.</li>
</ul>
<h3>Nghiên cứu cơ bản và nghiên cứu ứng dụng</h3>
<table>
<tr><th></th><th>Nghiên cứu cơ bản</th><th>Nghiên cứu ứng dụng</th></tr>
<tr><td>Mục đích</td><td>Mở rộng hiểu biết về các quá trình kinh doanh và quản trị</td><td>Hiểu rõ hơn một vấn đề kinh doanh cụ thể</td></tr>
<tr><td>Kết quả điển hình</td><td>Nguyên lý chung, phát triển lý thuyết</td><td>Giải pháp hoặc khuyến nghị cho vấn đề đó</td></tr>
<tr><td>Người đọc chính</td><td>Giới học thuật và xã hội nói chung</td><td>Nhà quản trị của tổ chức liên quan</td></tr>
<tr><td>Ai định hướng</td><td>Chủ yếu là nhà nghiên cứu</td><td>Thương lượng với tổ chức hoặc khách hàng</td></tr>
<tr><td>Thời gian</td><td>Thường linh hoạt</td><td>Thường gấp</td></tr>
</table>
<p>Phần lớn dự án nằm đâu đó trên một <strong>trục liên tục</strong> giữa hai loại. Khoá luận về "các nhân tố ảnh hưởng tới việc Gen Z sử dụng ví điện tử" nghiêng về nghiên cứu cơ bản; một nghiên cứu do một chuỗi bán lẻ đặt hàng để tìm hiểu vì sao lượt dùng ứng dụng khách hàng thân thiết của họ giảm là nghiên cứu ứng dụng.</p>
<h3>Nghiên cứu và tư vấn</h3>
<p>Tư vấn cũng tìm hiểu vấn đề kinh doanh, nhưng do khách hàng dẫn dắt, kết quả có thể phải giữ bí mật, và phương pháp không phải lúc nào cũng được công bố. Một dự án tư vấn trở thành <em>nghiên cứu</em> khi nó có hệ thống, minh bạch về phương pháp và gắn kết quả với tri thức sẵn có. Khoá luận của bạn phải đạt chuẩn học thuật kể cả khi nó giúp ích cho một doanh nghiệp thật.</p>
<h3>Hai phương thức tạo tri thức</h3>
<p>Tri thức <strong>Mode 1</strong> được tạo ra chủ yếu trong trường đại học, phục vụ mục đích học thuật và được đồng nghiệp học thuật thẩm định. Tri thức <strong>Mode 2</strong> được tạo ra trong bối cảnh ứng dụng, thường cùng với người làm thực tiễn, và được đánh giá bằng tính hữu dụng. Nghiên cứu kinh doanh thường cố gắng bắc cầu giữa hai phương thức này.</p>
<h3>Viết nhật ký phản tư</h3>
<p>Vì nghiên cứu mang tính lặp, Saunders và cộng sự khuyến khích viết <strong>nhật ký phản tư</strong> (sổ tay nghiên cứu). Sau mỗi bước, ghi lại: điều gì đã xảy ra, bạn học được gì, lần sau sẽ làm khác thế nào, và điều đó liên hệ với lý thuyết ra sao. Nhật ký giúp bạn biện minh cho các quyết định trong chương phương pháp và chuẩn bị cho buổi bảo vệ.</p>
<pre><code class="language-text">Nhật ký (minh hoạ) — Tuần 3
Việc đã làm : tìm được 20 bài về "chấp nhận ví điện tử"; đa số dùng TAM hoặc UTAUT.
Điều học được: ít nghiên cứu xem xét niềm tin sau một sự cố bảo mật.
Bước tiếp    : thu hẹp câu hỏi vào niềm tin; hỏi giảng viên phạm vi có khả thi không.</code></pre>
<div class="callout"><span class="badge">Ghi nhớ</span> "Có hệ thống" là từ khoá. Nếu bạn không giải thích được mình đã tìm, chọn lọc và phân tích bằng chứng thế nào, thì đó chưa phải là nghiên cứu.</div>`,
  ]]);

const c2 = doc('rmb301-1-2-research-topic', '1.2 — Ch 2: Formulating and clarifying the research topic|||1.2 — Ch 2: Hình thành và làm rõ đề tài nghiên cứu',
  'Tiêu chí một đề tài tốt, kỹ thuật sinh ý tưởng lý tính và sáng tạo (kể cả dùng AI có kiểm chứng), phép thử Goldilocks, câu hỏi nghiên cứu tổng quát và câu hỏi con, mục tiêu nghiên cứu, vai trò của lý thuyết, phạm vi, thời gian và nguồn lực, cấu trúc đề cương sơ bộ (GA1).',
  [[
    `<span class="eyebrow">RMB301 · Part 1 · Lesson 1.2</span>
<h2>Formulating and clarifying the research topic</h2>
<h3>Attributes of a good research topic</h3>
<table>
<tr><th>Check</th><th>Question to ask yourself</th></tr>
<tr><td>Capability</td><td>Am I genuinely interested? Do I have (or can I learn) the skills? Can I finish within the time and budget? Can I get access to the data?</td></tr>
<tr><td>Appropriateness</td><td>Does it meet the assessment requirements? Is there a clear link to theory? Can I state clear research questions? Will it offer a fresh insight? Are all possible outcomes worth reporting — including a "no effect" result?</td></tr>
<tr><td>Fulfilment</td><td>Does it fit my career goals and motivate me for months, not weeks?</td></tr>
</table>
<h3>Generating and refining ideas</h3>
<p><strong>Rational thinking</strong>: examine your own strengths and interests, look at past project titles, talk to lecturers and practitioners, search the literature, scan business media. <strong>Creative thinking</strong>: keep a notebook of ideas, build a <em>relevance tree</em> (a broad concept branching into narrower sub-topics), brainstorm in a group. A <strong>Delphi technique</strong> — asking a group of informed people for ideas in several rounds, feeding back each round’s results — can help refine an idea, and a short preliminary study (a few articles, one or two informal conversations) tests feasibility.</p>
<p><strong>With AI (as the syllabus suggests):</strong> ask a chatbot for ten possible angles on your interest, then ask it to critique each one for feasibility and theoretical link. Treat the output as brainstorming only — then check in Google Scholar whether the angle has been studied, and decide yourself.</p>
<h3>From topic to research question</h3>
<p>Apply the <strong>Goldilocks test</strong>: a question can be too big (needs huge resources), too small (trivial or already answered), too "hot" (too sensitive or politically risky for now) — you want one that is "just right". Then use the <strong>Russian doll principle</strong>: strip the idea down until the essential question remains.</p>
<pre><code class="language-text">Too big   : How does digital technology affect Vietnamese consumers?
Better    : What factors influence university students’ intention to use e-wallets
            for everyday purchases in Hanoi?
Sub-questions
  1. How does perceived usefulness affect intention to use?
  2. How does trust in the provider affect intention to use?
  3. Does the effect of trust differ between frequent and occasional users?</code></pre>
<p>Good questions usually ask <em>why</em> or <em>how</em> (explanatory) rather than only <em>what</em> (descriptive), and they should be answerable with data you can realistically collect.</p>
<h3>Research objectives</h3>
<p>Objectives turn questions into specific, measurable steps and signal a clear sense of purpose. Start each with an action verb: <em>to identify…, to examine the effect of…, to compare…, to recommend…</em>. Example: "To examine the effect of perceived usefulness and trust on students’ intention to use e-wallets" and "To recommend actions for e-wallet providers to increase adoption among students".</p>
<h3>The role of theory</h3>
<p>A theory explains how and why concepts or variables relate. Your topic should connect to at least one theory — for example the Technology Acceptance Model (Davis) or the Theory of Planned Behaviour (Ajzen) for adoption and intention studies. The theory you choose shapes your variables, hypotheses and questionnaire.</p>
<h3>Scope, time and resources</h3>
<p>Define the <strong>scope</strong> explicitly: population (who), context (where, which industry), period (when), and variables (what). Draw a simple timeline (Gantt chart) back from the deadline, and list resources: data access, software, travel, budget.</p>
<h3>The research proposal — first version (GA1)</h3>
<p>A proposal organises your ideas, convinces your audience that the project is worthwhile and feasible, and works as a contract with your supervisor. A typical structure: title; background; research questions and objectives; method; timescale; resources; references. GA1 covers the first parts in no more than two pages.</p>
<div class="callout"><span class="badge">Tip</span> If you cannot write your research question in one sentence without "and", you probably have two projects.</div>`,
    `<span class="eyebrow">RMB301 · Phần 1 · Bài 1.2</span>
<h2>Hình thành và làm rõ đề tài nghiên cứu</h2>
<h3>Tiêu chí của một đề tài tốt</h3>
<table>
<tr><th>Kiểm tra</th><th>Câu tự hỏi</th></tr>
<tr><td>Năng lực</td><td>Mình có thật sự quan tâm không? Mình có (hoặc học được) kỹ năng cần thiết không? Có hoàn thành được trong thời gian và ngân sách không? Có tiếp cận được dữ liệu không?</td></tr>
<tr><td>Tính phù hợp</td><td>Có đáp ứng yêu cầu đánh giá không? Có liên hệ rõ với lý thuyết không? Có phát biểu được câu hỏi nghiên cứu rõ ràng không? Có mang lại góc nhìn mới không? Mọi kết quả có thể xảy ra — kể cả kết quả "không có tác động" — có đáng để báo cáo không?</td></tr>
<tr><td>Động lực</td><td>Có phù hợp mục tiêu nghề nghiệp và đủ sức giữ động lực cho mình trong nhiều tháng chứ không chỉ vài tuần không?</td></tr>
</table>
<h3>Sinh và tinh chỉnh ý tưởng</h3>
<p><strong>Tư duy lý tính</strong>: xem xét thế mạnh và sở thích của bản thân, xem tên các đề tài khoá trước, trao đổi với giảng viên và người làm thực tiễn, tìm đọc tài liệu, theo dõi báo chí kinh doanh. <strong>Tư duy sáng tạo</strong>: ghi sổ tay ý tưởng, vẽ <em>cây liên quan</em> (một khái niệm rộng tách nhánh thành các chủ đề con hẹp dần), động não theo nhóm. <strong>Kỹ thuật Delphi</strong> — hỏi ý kiến một nhóm người am hiểu qua nhiều vòng, mỗi vòng phản hồi lại kết quả vòng trước — giúp tinh chỉnh ý tưởng, còn một nghiên cứu sơ bộ ngắn (vài bài báo, một hai cuộc trò chuyện không chính thức) giúp kiểm tra tính khả thi.</p>
<p><strong>Dùng AI (như đề cương gợi ý):</strong> nhờ chatbot đưa ra mười góc tiếp cận cho mối quan tâm của bạn, rồi yêu cầu nó phản biện từng góc về tính khả thi và mối liên hệ với lý thuyết. Chỉ coi kết quả là nguyên liệu động não — sau đó kiểm tra trên Google Scholar xem góc đó đã được nghiên cứu chưa, và tự bạn quyết định.</p>
<h3>Từ đề tài tới câu hỏi nghiên cứu</h3>
<p>Áp dụng <strong>phép thử Goldilocks</strong>: câu hỏi có thể quá lớn (cần nguồn lực khổng lồ), quá nhỏ (vụn vặt hoặc đã có câu trả lời), quá "nóng" (quá nhạy cảm hoặc rủi ro vào thời điểm này) — bạn cần câu hỏi "vừa khéo". Sau đó dùng <strong>nguyên tắc búp bê Nga</strong>: bóc dần ý tưởng cho tới khi chỉ còn câu hỏi cốt lõi.</p>
<pre><code class="language-text">Quá lớn  : Công nghệ số ảnh hưởng thế nào tới người tiêu dùng Việt Nam?
Tốt hơn  : Những nhân tố nào ảnh hưởng tới ý định sử dụng ví điện tử cho các giao dịch
           hằng ngày của sinh viên đại học tại Hà Nội?
Câu hỏi con
  1. Cảm nhận về tính hữu ích ảnh hưởng thế nào tới ý định sử dụng?
  2. Niềm tin vào nhà cung cấp ảnh hưởng thế nào tới ý định sử dụng?
  3. Tác động của niềm tin có khác nhau giữa người dùng thường xuyên và thỉnh thoảng không?</code></pre>
<p>Câu hỏi tốt thường hỏi <em>vì sao</em> hoặc <em>như thế nào</em> (giải thích) chứ không chỉ hỏi <em>cái gì</em> (mô tả), và phải trả lời được bằng dữ liệu bạn thực sự thu thập được.</p>
<h3>Mục tiêu nghiên cứu</h3>
<p>Mục tiêu biến câu hỏi thành các bước cụ thể, đo lường được và cho thấy bạn có định hướng rõ ràng. Mở đầu mỗi mục tiêu bằng một động từ hành động: <em>xác định…, kiểm định tác động của…, so sánh…, đề xuất…</em>. Ví dụ: "Kiểm định tác động của cảm nhận về tính hữu ích và niềm tin tới ý định sử dụng ví điện tử của sinh viên" và "Đề xuất giải pháp để các nhà cung cấp ví điện tử tăng mức độ chấp nhận ở sinh viên".</p>
<h3>Vai trò của lý thuyết</h3>
<p>Lý thuyết giải thích các khái niệm hay biến có quan hệ với nhau như thế nào và vì sao. Đề tài của bạn nên gắn với ít nhất một lý thuyết — chẳng hạn Mô hình chấp nhận công nghệ (TAM, Davis) hoặc Thuyết hành vi có kế hoạch (TPB, Ajzen) cho các nghiên cứu về chấp nhận và ý định. Lý thuyết bạn chọn định hình các biến, giả thuyết và bảng hỏi.</p>
<h3>Phạm vi, thời gian và nguồn lực</h3>
<p>Xác định <strong>phạm vi</strong> rõ ràng: tổng thể (ai), bối cảnh (ở đâu, ngành nào), thời gian (khi nào) và biến số (cái gì). Vẽ một tiến độ đơn giản (biểu đồ Gantt) tính ngược từ hạn nộp, và liệt kê nguồn lực: quyền tiếp cận dữ liệu, phần mềm, đi lại, kinh phí.</p>
<h3>Đề cương nghiên cứu — phiên bản đầu (GA1)</h3>
<p>Đề cương giúp sắp xếp ý tưởng, thuyết phục người đọc rằng dự án đáng làm và khả thi, và đóng vai trò như một "hợp đồng" với người hướng dẫn. Cấu trúc thường gặp: tên đề tài; bối cảnh; câu hỏi và mục tiêu nghiên cứu; phương pháp; tiến độ; nguồn lực; tài liệu tham khảo. GA1 bao gồm các phần đầu trong tối đa hai trang.</p>
<div class="callout"><span class="badge">Mẹo</span> Nếu bạn không viết được câu hỏi nghiên cứu thành một câu mà không cần chữ "và", có lẽ bạn đang có hai dự án.</div>`,
  ]]);

const c3 = doc('rmb301-1-3-literature-review', '1.3 — Ch 3: Critically reviewing the literature|||1.3 — Ch 3: Tổng quan tài liệu một cách phê phán',
  'Mục đích và nghĩa của "phê phán", cấu trúc hình phễu, nguồn tài liệu cấp một, cấp hai, cấp ba, chiến lược tìm kiếm (từ khoá, toán tử Boolean), đánh giá nguồn, tổng quan hệ thống với tiêu chí đưa vào/loại ra và sơ đồ PRISMA, hội đồng chuyên gia, trích dẫn, dùng AI tìm nguồn có kiểm chứng; câu hỏi ôn Phần 1.',
  [[
    `<span class="eyebrow">RMB301 · Part 1 · Lesson 1.3</span>
<h2>Critically reviewing the literature</h2>
<h3>Why review the literature?</h3>
<p>A literature review helps you refine your research question, discover what has already been found (so you do not simply repeat it), spot recommendations for further research, learn which theories and methods others used, and — above all — <strong>justify your own question by showing a gap</strong>.</p>
<h3>What "critical" means</h3>
<p>Critical does not mean negative. It means making reasoned <strong>judgements</strong>: comparing and contrasting authors, weighing the strength of evidence, noting limitations (small samples, a single country, cross-sectional data), and explaining how the studies relate to your question. Organise the review by <strong>themes</strong>, not author by author, and move like a funnel: general context → key theories → closely related studies → the gap → your research question.</p>
<pre><code class="language-text">Descriptive : Nguyen (2021) found that trust affects e-wallet use. Tran (2022) found the same.
Critical    : Although several studies report a positive effect of trust (e.g., Nguyen, 2021;
              Tran, 2022), both used convenience samples of existing users, so the effect
              among non-users remains unclear — the gap this study addresses.
              (Author names and years are illustrative.)</code></pre>
<h3>Literature sources</h3>
<table>
<tr><th>Type</th><th>Examples</th><th>Notes</th></tr>
<tr><td>Primary literature</td><td>Reports, theses, conference proceedings, some government publications</td><td>First appearance of the work; detailed but harder to find</td></tr>
<tr><td>Secondary literature</td><td>Refereed academic journals, books, professional journals</td><td>Later publication of primary work; refereed journals are the core of most reviews</td></tr>
<tr><td>Tertiary literature (search tools)</td><td>Databases, indexes and abstracts, encyclopaedias, catalogues</td><td>Help you locate primary and secondary literature</td></tr>
</table>
<p>Do not confuse <em>secondary literature</em> (published research you review) with <em>secondary data</em> (data collected by others that you re-analyse, Ch 8).</p>
<h3>Searching systematically</h3>
<ol>
<li>Set search parameters: language, subject area, industry, geography, publication period, literature type.</li>
<li>Build keywords and synonyms, then combine them with Boolean operators: <strong>AND</strong> narrows, <strong>OR</strong> widens, <strong>NOT</strong> excludes; use quotation marks for phrases and * for truncation.</li>
<li>Search several databases (your library databases, Google Scholar), then snowball: check reference lists and "cited by" links.</li>
<li>Record every source and search string in a reference manager such as Zotero.</li>
</ol>
<pre><code class="language-text">("e-wallet" OR "mobile payment" OR "digital wallet") AND (trust OR "perceived risk")
AND (adoption OR intention) AND (student* OR "Gen Z")</code></pre>
<h3>Evaluating a source</h3>
<p>Ask: Is it relevant to my question? Is it recent enough (or a classic)? Is it peer-reviewed, and who is the author? Is the method appropriate and clearly reported? Are the conclusions supported by the data? Could the author or funder be biased?</p>
<h3>Systematic review</h3>
<p>A systematic review follows an explicit, replicable protocol: define the question; set <strong>inclusion and exclusion criteria</strong>; search several databases with recorded strings; screen titles and abstracts, then full texts; appraise quality; extract and synthesise findings. The selection process is usually reported with a <strong>PRISMA</strong> flow diagram.</p>
<table>
<tr><th>Criterion</th><th>Include</th><th>Exclude</th></tr>
<tr><td>Publication type</td><td>Peer-reviewed empirical articles</td><td>Opinion pieces, blogs</td></tr>
<tr><td>Period</td><td>2015 onwards (illustrative)</td><td>Before 2015</td></tr>
<tr><td>Topic</td><td>Adoption or use of mobile payment by consumers</td><td>Studies of merchants only</td></tr>
<tr><td>Language</td><td>English or Vietnamese</td><td>Other languages</td></tr>
</table>
<h3>Using an expert panel</h3>
<p>Some reviews ask an <strong>expert panel</strong> (academics, practitioners) to advise on search terms, criteria or the relevance of sources. <em>Advantages</em>: specialist insight, key sources you might miss, credibility. <em>Disadvantages</em>: the experts’ own biases, dominant voices or groupthink, time and cost, and possible disagreement that must be resolved transparently.</p>
<h3>Referencing and AI</h3>
<p>Reference every idea you borrow using one style consistently (e.g., APA or Harvard). AI tools can suggest keywords and summarise articles you supply, but they can also <strong>fabricate references</strong> that look real. Never cite a source you have not located and read yourself.</p>
<h3>Review and discussion questions — Part 1</h3>
<ol>
<li>How does basic research differ from applied research? Give one example of each for your own topic.</li>
<li>State your research questions and objectives. Do they pass the Goldilocks test?</li>
<li>Define the scope of your study: who, where, when, which variables?</li>
<li>Who will your respondents or participants be, and how will you reach them?</li>
<li>How much time and which resources does your project need?</li>
<li>Which theories relate to your topic, and why?</li>
<li>Find at least five secondary reports or datasets relevant to your topic and evaluate their credibility.</li>
<li>What are the advantages and disadvantages of using an expert panel?</li>
<li>Propose inclusion and exclusion criteria for a systematic review on your topic.</li>
</ol>
<div class="callout"><span class="badge">Watch out</span> A list of summaries is not a review. Each paragraph should make a point about the literature and show how it leads to your question.</div>`,
    `<span class="eyebrow">RMB301 · Phần 1 · Bài 1.3</span>
<h2>Tổng quan tài liệu một cách phê phán</h2>
<h3>Vì sao phải tổng quan tài liệu?</h3>
<p>Tổng quan tài liệu giúp bạn tinh chỉnh câu hỏi nghiên cứu, biết những gì đã được phát hiện (để không lặp lại), nhận ra các khuyến nghị cho nghiên cứu tiếp theo, học xem người khác đã dùng lý thuyết và phương pháp nào, và — quan trọng nhất — <strong>biện minh cho câu hỏi của mình bằng cách chỉ ra khoảng trống nghiên cứu</strong>.</p>
<h3>"Phê phán" nghĩa là gì</h3>
<p>Phê phán không có nghĩa là chê bai. Đó là đưa ra <strong>nhận định</strong> có lý lẽ: so sánh và đối chiếu các tác giả, cân nhắc sức mạnh của bằng chứng, chỉ ra hạn chế (mẫu nhỏ, chỉ một quốc gia, dữ liệu cắt ngang), và giải thích các nghiên cứu đó liên quan thế nào tới câu hỏi của bạn. Sắp xếp phần tổng quan theo <strong>chủ đề</strong>, không theo từng tác giả, và đi theo hình phễu: bối cảnh chung → các lý thuyết chính → các nghiên cứu sát nhất → khoảng trống → câu hỏi nghiên cứu của bạn.</p>
<pre><code class="language-text">Mô tả    : Nguyễn (2021) thấy niềm tin ảnh hưởng tới việc dùng ví điện tử. Trần (2022) cũng vậy.
Phê phán : Dù nhiều nghiên cứu ghi nhận tác động tích cực của niềm tin (vd Nguyễn, 2021;
           Trần, 2022), cả hai đều dùng mẫu thuận tiện gồm người đang dùng, nên tác động ở
           nhóm chưa dùng vẫn chưa rõ — đó là khoảng trống nghiên cứu này giải quyết.
           (Tên tác giả và năm chỉ là minh hoạ.)</code></pre>
<h3>Các nguồn tài liệu</h3>
<table>
<tr><th>Loại</th><th>Ví dụ</th><th>Ghi chú</th></tr>
<tr><td>Tài liệu cấp một</td><td>Báo cáo, luận văn, kỷ yếu hội thảo, một số ấn phẩm của chính phủ</td><td>Nơi công trình xuất hiện lần đầu; chi tiết nhưng khó tìm hơn</td></tr>
<tr><td>Tài liệu cấp hai</td><td>Tạp chí khoa học có bình duyệt, sách, tạp chí chuyên ngành</td><td>Công bố sau từ công trình cấp một; tạp chí có bình duyệt là lõi của hầu hết bài tổng quan</td></tr>
<tr><td>Tài liệu cấp ba (công cụ tìm kiếm)</td><td>Cơ sở dữ liệu, chỉ mục và tóm tắt, bách khoa thư, danh mục thư viện</td><td>Giúp bạn tìm ra tài liệu cấp một và cấp hai</td></tr>
</table>
<p>Đừng nhầm <em>tài liệu cấp hai</em> (các nghiên cứu đã công bố mà bạn tổng quan) với <em>dữ liệu thứ cấp</em> (dữ liệu do người khác thu thập mà bạn phân tích lại, Ch 8).</p>
<h3>Tìm kiếm có hệ thống</h3>
<ol>
<li>Đặt tham số tìm kiếm: ngôn ngữ, lĩnh vực, ngành, địa bàn, khoảng thời gian công bố, loại tài liệu.</li>
<li>Lập từ khoá và từ đồng nghĩa, rồi kết hợp bằng toán tử Boolean: <strong>AND</strong> thu hẹp, <strong>OR</strong> mở rộng, <strong>NOT</strong> loại trừ; dùng dấu ngoặc kép cho cụm từ và dấu * để tìm theo gốc từ.</li>
<li>Tìm trên nhiều cơ sở dữ liệu (cơ sở dữ liệu của thư viện, Google Scholar), rồi lần theo kiểu "quả cầu tuyết": xem danh mục tài liệu tham khảo và mục "được trích dẫn bởi".</li>
<li>Ghi lại mọi nguồn và mọi chuỗi tìm kiếm trong phần mềm quản lý tài liệu như Zotero.</li>
</ol>
<pre><code class="language-text">("e-wallet" OR "mobile payment" OR "digital wallet") AND (trust OR "perceived risk")
AND (adoption OR intention) AND (student* OR "Gen Z")</code></pre>
<h3>Đánh giá một nguồn</h3>
<p>Tự hỏi: Nguồn có liên quan tới câu hỏi của mình không? Có đủ mới không (hay là công trình kinh điển)? Có được bình duyệt không, tác giả là ai? Phương pháp có phù hợp và được mô tả rõ không? Kết luận có được dữ liệu ủng hộ không? Tác giả hoặc nhà tài trợ có thể thiên lệch không?</p>
<h3>Tổng quan hệ thống</h3>
<p>Tổng quan hệ thống tuân theo một quy trình tường minh, lặp lại được: xác định câu hỏi; đặt <strong>tiêu chí đưa vào và loại ra</strong>; tìm trên nhiều cơ sở dữ liệu với chuỗi tìm kiếm được ghi lại; sàng lọc tiêu đề và tóm tắt, rồi toàn văn; đánh giá chất lượng; trích xuất và tổng hợp kết quả. Quá trình chọn lọc thường được báo cáo bằng sơ đồ <strong>PRISMA</strong>.</p>
<table>
<tr><th>Tiêu chí</th><th>Đưa vào</th><th>Loại ra</th></tr>
<tr><td>Loại công bố</td><td>Bài nghiên cứu thực nghiệm có bình duyệt</td><td>Bài bình luận, blog</td></tr>
<tr><td>Thời gian</td><td>Từ 2015 trở đi (minh hoạ)</td><td>Trước 2015</td></tr>
<tr><td>Chủ đề</td><td>Việc người tiêu dùng chấp nhận hoặc sử dụng thanh toán di động</td><td>Nghiên cứu chỉ về người bán</td></tr>
<tr><td>Ngôn ngữ</td><td>Tiếng Anh hoặc tiếng Việt</td><td>Ngôn ngữ khác</td></tr>
</table>
<h3>Dùng hội đồng chuyên gia</h3>
<p>Một số bài tổng quan nhờ <strong>hội đồng chuyên gia</strong> (giảng viên, người làm thực tiễn) góp ý về từ khoá, tiêu chí hay mức độ liên quan của các nguồn. <em>Ưu điểm</em>: hiểu biết chuyên sâu, những nguồn quan trọng bạn có thể bỏ sót, tăng độ tin cậy. <em>Nhược điểm</em>: định kiến riêng của chuyên gia, tiếng nói lấn át hoặc tư duy bầy đàn, tốn thời gian và chi phí, và bất đồng cần được giải quyết minh bạch.</p>
<h3>Trích dẫn và AI</h3>
<p>Trích dẫn mọi ý tưởng bạn vay mượn theo một chuẩn thống nhất (vd APA hoặc Harvard). Công cụ AI có thể gợi ý từ khoá và tóm tắt những bài báo bạn đưa vào, nhưng cũng có thể <strong>bịa ra tài liệu tham khảo</strong> trông như thật. Không bao giờ trích dẫn một nguồn mà bạn chưa tự tìm thấy và đọc.</p>
<h3>Câu hỏi ôn tập và thảo luận — Phần 1</h3>
<ol>
<li>Nghiên cứu cơ bản khác nghiên cứu ứng dụng thế nào? Nêu một ví dụ mỗi loại cho đề tài của bạn.</li>
<li>Phát biểu câu hỏi và mục tiêu nghiên cứu của bạn. Chúng có qua được phép thử Goldilocks không?</li>
<li>Xác định phạm vi nghiên cứu: ai, ở đâu, khi nào, những biến nào?</li>
<li>Người trả lời hay người tham gia nghiên cứu của bạn là ai, và bạn tiếp cận họ bằng cách nào?</li>
<li>Dự án cần bao nhiêu thời gian và những nguồn lực nào?</li>
<li>Những lý thuyết nào liên quan tới đề tài của bạn, và vì sao?</li>
<li>Tìm ít nhất năm báo cáo hoặc bộ dữ liệu thứ cấp liên quan tới đề tài và đánh giá độ tin cậy của chúng.</li>
<li>Dùng hội đồng chuyên gia có những ưu và nhược điểm gì?</li>
<li>Đề xuất tiêu chí đưa vào và loại ra cho một tổng quan hệ thống về đề tài của bạn.</li>
</ol>
<div class="callout"><span class="badge">Cẩn thận</span> Một danh sách tóm tắt không phải là bài tổng quan. Mỗi đoạn phải nêu một luận điểm về các nghiên cứu và cho thấy nó dẫn tới câu hỏi của bạn như thế nào.</div>`,
  ]]);

const c3e = doc('rmb301-1-4-exercise', 'Exercise 1 — from a broad interest to a GA1-ready topic|||Bài tập 1 — từ một mối quan tâm rộng tới đề tài sẵn sàng cho GA1',
  'Bài tập: thu hẹp đề tài bằng phép thử Goldilocks, viết câu hỏi tổng quát, câu hỏi con và mục tiêu, xác định phạm vi, đặt tiêu chí đưa vào/loại ra và chuỗi tìm kiếm Boolean cho tình huống giả định về việc người lao động trẻ nghỉ việc; kèm lời giải.',
  [[
    `<span class="eyebrow">RMB301 · Part 1 · Exercise</span>
<h2>Exercise 1 — from a broad interest to a GA1-ready topic</h2>
<div class="callout"><span class="badge">Problem</span> A fictional student group writes: "We want to study why young people quit their jobs." (a) Apply the Goldilocks test and narrow the topic to something feasible in one semester. (b) Write one overarching research question, three sub-questions and matching objectives. (c) State the scope. (d) Propose four inclusion/exclusion criteria and one Boolean search string for the literature review.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Goldilocks test
    Too big  : all young people, all jobs, all reasons — impossible to cover.
    Too hot? : naming a specific employer’s problems could be sensitive -> keep firms anonymous.
    Narrowed : first-job turnover intention of Gen Z office employees in Ho Chi Minh City.

(b) Overarching question
    What factors influence the turnover intention of Gen Z employees in their first job?
    Sub-questions                               Objectives
    1. How does perceived career development    1. To examine the effect of perceived career
       affect turnover intention?                  development on turnover intention.
    2. How does the relationship with the       2. To examine the effect of supervisor support
       direct supervisor affect it?                on turnover intention.
    3. Does the effect of pay satisfaction      3. To compare the effect of pay satisfaction
       differ by industry?                         across industries and recommend HR actions.

(c) Scope
    Who   : employees born 1997 or later, in their first full-time job, office roles
    Where : Ho Chi Minh City; private companies
    When  : cross-sectional survey in one semester
    What  : turnover intention (dependent); career development, supervisor support,
            pay satisfaction (independent)

(d) Inclusion / exclusion (illustrative)
    Include: peer-reviewed empirical studies; 2015 onwards; employee-level data;
             English or Vietnamese
    Exclude: studies of executives only; opinion pieces; studies without a clear method
    Search : ("turnover intention" OR "intention to quit") AND ("Gen Z" OR "generation Z"
             OR "young employee*") AND ("career development" OR "supervisor support"
             OR "pay satisfaction")</code></pre>
<p><strong>Why:</strong> the narrowed topic fixes the population, context and variables, so the questions can be answered with one survey. Using "turnover intention" rather than actual quitting is a deliberate choice: intention can be measured at one point in time, while actual turnover would need longitudinal data. The criteria and search string make the literature search transparent and repeatable — exactly what a critical review needs.</p>`,
    `<span class="eyebrow">RMB301 · Phần 1 · Bài tập</span>
<h2>Bài tập 1 — từ một mối quan tâm rộng tới đề tài sẵn sàng cho GA1</h2>
<div class="callout"><span class="badge">Đề</span> Một nhóm sinh viên (tình huống giả định) viết: "Chúng em muốn nghiên cứu vì sao người trẻ nghỉ việc." (a) Áp dụng phép thử Goldilocks và thu hẹp đề tài để làm được trong một học kỳ. (b) Viết một câu hỏi nghiên cứu tổng quát, ba câu hỏi con và các mục tiêu tương ứng. (c) Nêu phạm vi. (d) Đề xuất bốn tiêu chí đưa vào/loại ra và một chuỗi tìm kiếm Boolean cho phần tổng quan tài liệu.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Phép thử Goldilocks
    Quá lớn   : mọi người trẻ, mọi công việc, mọi lý do — không thể bao quát.
    Quá nóng? : nêu tên vấn đề của một công ty cụ thể có thể nhạy cảm -> ẩn danh doanh nghiệp.
    Thu hẹp   : ý định nghỉ việc ở công việc đầu tiên của nhân viên văn phòng Gen Z tại TP.HCM.

(b) Câu hỏi tổng quát
    Những nhân tố nào ảnh hưởng tới ý định nghỉ việc của nhân viên Gen Z ở công việc đầu tiên?
    Câu hỏi con                                  Mục tiêu
    1. Cảm nhận về cơ hội phát triển nghề nghiệp 1. Kiểm định tác động của cảm nhận về phát
       ảnh hưởng thế nào tới ý định nghỉ việc?      triển nghề nghiệp tới ý định nghỉ việc.
    2. Quan hệ với quản lý trực tiếp ảnh hưởng   2. Kiểm định tác động của sự hỗ trợ từ quản
       thế nào?                                     lý trực tiếp tới ý định nghỉ việc.
    3. Tác động của sự hài lòng về lương có      3. So sánh tác động của sự hài lòng về lương
       khác nhau giữa các ngành không?              giữa các ngành và đề xuất giải pháp nhân sự.

(c) Phạm vi
    Ai      : người lao động sinh từ 1997 trở đi, đang ở công việc toàn thời gian đầu tiên,
              vị trí văn phòng
    Ở đâu   : TP.HCM; doanh nghiệp tư nhân
    Khi nào : khảo sát cắt ngang trong một học kỳ
    Cái gì  : ý định nghỉ việc (biến phụ thuộc); phát triển nghề nghiệp, hỗ trợ của quản lý,
              hài lòng về lương (biến độc lập)

(d) Đưa vào / loại ra (minh hoạ)
    Đưa vào : nghiên cứu thực nghiệm có bình duyệt; từ 2015; dữ liệu cấp nhân viên;
              tiếng Anh hoặc tiếng Việt
    Loại ra : nghiên cứu chỉ về cấp điều hành; bài bình luận; nghiên cứu không nêu rõ phương pháp
    Chuỗi   : ("turnover intention" OR "intention to quit") AND ("Gen Z" OR "generation Z"
              OR "young employee*") AND ("career development" OR "supervisor support"
              OR "pay satisfaction")</code></pre>
<p><strong>Vì sao:</strong> đề tài sau khi thu hẹp đã cố định tổng thể, bối cảnh và biến số, nên các câu hỏi trả lời được bằng một cuộc khảo sát. Dùng "ý định nghỉ việc" thay vì hành vi nghỉ việc thực tế là một lựa chọn có chủ đích: ý định đo được tại một thời điểm, còn nghỉ việc thực tế cần dữ liệu theo thời gian. Các tiêu chí và chuỗi tìm kiếm làm cho việc tìm tài liệu minh bạch và lặp lại được — đúng điều một bài tổng quan phê phán cần.</p>`,
  ]]);

const q1 = quiz('rmb301-quiz-1', 'Quiz 1 — Research, topics & literature|||Quiz 1 — Nghiên cứu, đề tài & tổng quan tài liệu', [
  { id: 'q1', question: 'A retail chain commissions a study to find out why use of its loyalty app is falling; objectives are agreed with the chain and the deadline is tight. This is best described as…|||Một chuỗi bán lẻ đặt hàng nghiên cứu vì sao lượt dùng ứng dụng khách hàng thân thiết giảm; mục tiêu được thống nhất với chuỗi và thời hạn gấp. Nghiên cứu này đúng nhất là…', options: ['basic (fundamental) research|||nghiên cứu cơ bản', 'applied research|||nghiên cứu ứng dụng', 'a systematic review|||một tổng quan hệ thống', 'pure theory development|||phát triển lý thuyết thuần tuý'], correctIndex: 1, explanation: 'Applied research addresses a specific organisational problem, with objectives negotiated with the organisation and tight time scales.|||Nghiên cứu ứng dụng giải quyết một vấn đề cụ thể của tổ chức, mục tiêu được thương lượng với tổ chức và thời gian gấp.' },
  { id: 'q2', question: 'In the classification used by Saunders et al., refereed academic journal articles are generally treated as…|||Theo cách phân loại của Saunders và cộng sự, bài báo trên tạp chí khoa học có bình duyệt thường được xếp vào…', options: ['primary literature|||tài liệu cấp một', 'tertiary literature|||tài liệu cấp ba', 'secondary literature|||tài liệu cấp hai', 'secondary data|||dữ liệu thứ cấp'], correctIndex: 2, explanation: 'Journals and books are secondary literature; primary literature is the first appearance of work (reports, theses, conference proceedings); tertiary sources are search tools such as databases and indexes.|||Tạp chí và sách là tài liệu cấp hai; tài liệu cấp một là nơi công trình xuất hiện lần đầu (báo cáo, luận văn, kỷ yếu hội thảo); tài liệu cấp ba là công cụ tìm kiếm như cơ sở dữ liệu và chỉ mục.' },
  { id: 'q3', question: 'The main purpose of inclusion and exclusion criteria in a systematic review is to…|||Mục đích chính của tiêu chí đưa vào và loại ra trong tổng quan hệ thống là…', options: ['make the selection of studies explicit, transparent and replicable|||làm cho việc chọn nghiên cứu tường minh, minh bạch và lặp lại được', 'keep only studies that support the researcher’s hypothesis|||chỉ giữ những nghiên cứu ủng hộ giả thuyết của nhà nghiên cứu', 'replace the need for a search strategy|||thay thế cho chiến lược tìm kiếm', 'increase the number of sources as much as possible|||tăng số nguồn càng nhiều càng tốt'], correctIndex: 0, explanation: 'Explicit criteria let others see and repeat how studies were selected, reducing selection bias.|||Tiêu chí tường minh cho phép người khác thấy và lặp lại cách chọn nghiên cứu, giảm thiên lệch khi chọn.' },
]);

const c4 = doc('rmb301-2-1-philosophies-approaches', '2.1 — Ch 4: Research philosophies and approaches to theory development|||2.1 — Ch 4: Triết lý nghiên cứu và cách tiếp cận phát triển lý thuyết',
  'Củ hành nghiên cứu sáu lớp, ba giả định (bản thể luận, nhận thức luận, giá trị luận), so sánh năm triết lý (thực chứng, hiện thực phê phán, diễn giải, hậu hiện đại, thực dụng), suy diễn – quy nạp – abductive, giả thuyết H0/H1 và khung nghiên cứu với biến độc lập, phụ thuộc, trung gian, điều tiết.',
  [[
    `<span class="eyebrow">RMB301 · Part 2 · Lesson 2.1</span>
<h2>Research philosophies and approaches to theory development</h2>
<h3>The research onion</h3>
<p>Saunders and colleagues picture research decisions as an <strong>onion</strong>: you peel from the outer layers (your assumptions) to the centre (the actual techniques). Each inner choice should be consistent with the layers outside it.</p>
<ol>
<li><strong>Research philosophy</strong> — your assumptions about reality and knowledge.</li>
<li><strong>Approach to theory development</strong> — deduction, induction or abduction.</li>
<li><strong>Methodological choice</strong> — quantitative, qualitative, multi-method or mixed methods.</li>
<li><strong>Strategy(ies)</strong> — experiment, survey, case study, ethnography, and so on.</li>
<li><strong>Time horizon</strong> — cross-sectional or longitudinal.</li>
<li><strong>Techniques and procedures</strong> — data collection and data analysis.</li>
</ol>
<h3>Three kinds of assumption</h3>
<ul>
<li><strong>Ontology</strong> — the nature of reality: is it external and objective, or socially constructed?</li>
<li><strong>Epistemology</strong> — what counts as acceptable, valid knowledge: measurable facts, or meanings and narratives?</li>
<li><strong>Axiology</strong> — the role of values: can the researcher be value-free, or are values part of the research?</li>
</ul>
<h3>Five research philosophies compared</h3>
<table>
<tr><th>Philosophy</th><th>Reality (ontology)</th><th>Knowledge (epistemology)</th><th>Values (axiology)</th><th>Typical methods</th></tr>
<tr><td>Positivism</td><td>Real, external, independent; one true reality</td><td>Observable, measurable facts; law-like generalisations</td><td>Value-free; researcher detached</td><td>Deductive, highly structured, large samples, measurement — typically quantitative</td></tr>
<tr><td>Critical realism</td><td>Layered: what we experience is not all that exists; deeper causal mechanisms</td><td>Knowledge is historically situated; aim to explain underlying mechanisms</td><td>Value-laden; researcher tries to recognise and minimise bias</td><td>Retroductive, in-depth historically situated analysis; quantitative or qualitative</td></tr>
<tr><td>Interpretivism</td><td>Complex, rich, socially constructed through culture and language; multiple realities</td><td>Narratives, stories, perceptions and interpretations; new understandings</td><td>Value-bound; researcher is part of what is researched</td><td>Typically inductive; small samples, in-depth qualitative investigations</td></tr>
<tr><td>Postmodernism</td><td>Socially constructed through power relations; some meanings dominate others</td><td>"Truth" is decided by dominant ideologies; aim to expose power relations</td><td>Value-constituted; radically reflexive</td><td>Deconstruction of texts and realities; in-depth qualitative</td></tr>
<tr><td>Pragmatism</td><td>Reality is the practical consequences of ideas</td><td>Knowledge is valued for enabling successful action</td><td>Value-driven; research starts from the researcher’s doubts and beliefs</td><td>Follows the research problem; mixed, multiple, quantitative, qualitative or action research</td></tr>
</table>
<h3>Approaches to theory development</h3>
<table>
<tr><th></th><th>Deduction</th><th>Induction</th><th>Abduction</th></tr>
<tr><td>Logic</td><td>If the premises are true, the conclusion must be true</td><td>Known premises are used to generate untested conclusions</td><td>Known premises generate testable conclusions</td></tr>
<tr><td>Direction</td><td>Theory → hypotheses → data → test</td><td>Data → patterns → theory</td><td>Surprising fact → plausible theory → new data to test; back and forth</td></tr>
<tr><td>Use of data</td><td>Evaluate propositions or hypotheses</td><td>Explore a phenomenon, identify themes</td><td>Explore, identify themes, locate them in a framework, then test</td></tr>
<tr><td>Theory</td><td>Falsification or verification</td><td>Theory generation and building</td><td>Theory generation or modification</td></tr>
</table>
<h3>Hypotheses</h3>
<p>A <strong>hypothesis</strong> is a testable statement about the relationship between variables. The <strong>null hypothesis (H0)</strong> states that there is no relationship or difference; the <strong>alternative hypothesis (H1)</strong> states that there is one, and it may be directional ("positively affects").</p>
<pre><code class="language-text">H0: Perceived usefulness has no effect on intention to use e-wallets.
H1: Perceived usefulness has a positive effect on intention to use e-wallets.</code></pre>
<h3>Research (conceptual) framework</h3>
<p>A framework shows the variables and the hypothesised links between them, derived from theory and the literature — the heart of GA2.</p>
<pre><code class="language-text">Perceived usefulness ──H1(+)──┐
Perceived ease of use ─H2(+)──┼──►  Intention to use e-wallets
Trust in provider ─────H3(+)──┘            ▲
                        Usage frequency ── moderator (H4)
Independent variables: cause or predictor      Dependent variable: outcome explained
Mediating variable: transmits the effect       Moderating variable: changes its strength</code></pre>
<div class="callout"><span class="badge">Exam tip</span> A philosophy is not a label to decorate the method chapter. Examiners check consistency: a positivist study with three unstructured interviews, or an interpretivist study testing ten hypotheses, signals that the onion was not thought through.</div>`,
    `<span class="eyebrow">RMB301 · Phần 2 · Bài 2.1</span>
<h2>Triết lý nghiên cứu và cách tiếp cận phát triển lý thuyết</h2>
<h3>Củ hành nghiên cứu</h3>
<p>Saunders và cộng sự hình dung các quyết định nghiên cứu như một <strong>củ hành</strong>: bóc từ lớp ngoài (các giả định của bạn) vào tới lõi (kỹ thuật cụ thể). Mỗi lựa chọn bên trong phải nhất quán với các lớp bên ngoài nó.</p>
<ol>
<li><strong>Triết lý nghiên cứu</strong> — giả định của bạn về thực tại và tri thức.</li>
<li><strong>Cách tiếp cận phát triển lý thuyết</strong> — suy diễn, quy nạp hay abductive (suy luận giả định).</li>
<li><strong>Lựa chọn phương pháp luận</strong> — định lượng, định tính, đa phương pháp hay hỗn hợp.</li>
<li><strong>Chiến lược</strong> — thực nghiệm, khảo sát, nghiên cứu tình huống, dân tộc học, v.v.</li>
<li><strong>Khung thời gian</strong> — cắt ngang hay theo thời gian (dọc).</li>
<li><strong>Kỹ thuật và quy trình</strong> — thu thập và phân tích dữ liệu.</li>
</ol>
<h3>Ba loại giả định</h3>
<ul>
<li><strong>Bản thể luận</strong> — bản chất của thực tại: thực tại tồn tại khách quan bên ngoài, hay được kiến tạo về mặt xã hội?</li>
<li><strong>Nhận thức luận</strong> — thế nào là tri thức chấp nhận được, có giá trị: các sự kiện đo lường được, hay ý nghĩa và câu chuyện?</li>
<li><strong>Giá trị luận</strong> — vai trò của giá trị: nhà nghiên cứu có thể trung lập về giá trị, hay giá trị là một phần của nghiên cứu?</li>
</ul>
<h3>So sánh năm triết lý nghiên cứu</h3>
<table>
<tr><th>Triết lý</th><th>Thực tại (bản thể luận)</th><th>Tri thức (nhận thức luận)</th><th>Giá trị (giá trị luận)</th><th>Phương pháp điển hình</th></tr>
<tr><td>Thực chứng</td><td>Có thật, bên ngoài, độc lập; một thực tại đúng duy nhất</td><td>Sự kiện quan sát, đo lường được; khái quát hoá dạng quy luật</td><td>Trung lập về giá trị; nhà nghiên cứu tách biệt</td><td>Suy diễn, cấu trúc chặt, mẫu lớn, đo lường — thường là định lượng</td></tr>
<tr><td>Hiện thực phê phán</td><td>Nhiều tầng: điều ta trải nghiệm không phải là tất cả; có các cơ chế nhân quả sâu hơn</td><td>Tri thức gắn với bối cảnh lịch sử; mục tiêu là giải thích các cơ chế nền tảng</td><td>Chịu ảnh hưởng giá trị; nhà nghiên cứu cố nhận diện và giảm thiên lệch</td><td>Suy luận ngược (retroductive), phân tích sâu gắn bối cảnh lịch sử; định lượng hoặc định tính</td></tr>
<tr><td>Diễn giải</td><td>Phức tạp, phong phú, được kiến tạo qua văn hoá và ngôn ngữ; nhiều thực tại</td><td>Câu chuyện, cảm nhận và cách diễn giải; hiểu biết mới</td><td>Gắn với giá trị; nhà nghiên cứu là một phần của đối tượng nghiên cứu</td><td>Thường quy nạp; mẫu nhỏ, nghiên cứu định tính chuyên sâu</td></tr>
<tr><td>Hậu hiện đại</td><td>Được kiến tạo qua quan hệ quyền lực; một số ý nghĩa lấn át ý nghĩa khác</td><td>"Sự thật" do hệ tư tưởng thống trị quyết định; mục tiêu là phơi bày quan hệ quyền lực</td><td>Do giá trị cấu thành; phản tư triệt để</td><td>Giải cấu trúc văn bản và thực tại; định tính chuyên sâu</td></tr>
<tr><td>Thực dụng</td><td>Thực tại là hệ quả thực tiễn của các ý tưởng</td><td>Tri thức có giá trị khi giúp hành động thành công</td><td>Do giá trị dẫn dắt; nghiên cứu bắt đầu từ hoài nghi và niềm tin của nhà nghiên cứu</td><td>Theo vấn đề nghiên cứu; hỗn hợp, đa phương pháp, định lượng, định tính hoặc nghiên cứu hành động</td></tr>
</table>
<h3>Các cách tiếp cận phát triển lý thuyết</h3>
<table>
<tr><th></th><th>Suy diễn</th><th>Quy nạp</th><th>Abductive (suy luận giả định)</th></tr>
<tr><td>Logic</td><td>Nếu tiền đề đúng thì kết luận chắc chắn đúng</td><td>Từ các tiền đề đã biết rút ra kết luận chưa được kiểm định</td><td>Từ các tiền đề đã biết rút ra kết luận có thể kiểm định</td></tr>
<tr><td>Hướng đi</td><td>Lý thuyết → giả thuyết → dữ liệu → kiểm định</td><td>Dữ liệu → quy luật → lý thuyết</td><td>Sự kiện bất ngờ → lý thuyết khả dĩ → dữ liệu mới để kiểm định; đi lại qua lại</td></tr>
<tr><td>Dùng dữ liệu để</td><td>Đánh giá mệnh đề hoặc giả thuyết</td><td>Khám phá hiện tượng, nhận diện chủ đề</td><td>Khám phá, nhận diện chủ đề, đặt vào một khung khái niệm, rồi kiểm định</td></tr>
<tr><td>Lý thuyết</td><td>Bác bỏ hoặc xác nhận</td><td>Tạo lập và xây dựng lý thuyết</td><td>Tạo lập hoặc điều chỉnh lý thuyết</td></tr>
</table>
<h3>Giả thuyết</h3>
<p><strong>Giả thuyết</strong> là một phát biểu có thể kiểm định về quan hệ giữa các biến. <strong>Giả thuyết không (H0)</strong> phát biểu rằng không có quan hệ hay khác biệt; <strong>giả thuyết đối (H1)</strong> phát biểu rằng có, và có thể nêu chiều ("tác động tích cực").</p>
<pre><code class="language-text">H0: Cảm nhận về tính hữu ích không ảnh hưởng tới ý định sử dụng ví điện tử.
H1: Cảm nhận về tính hữu ích có tác động tích cực tới ý định sử dụng ví điện tử.</code></pre>
<h3>Khung nghiên cứu (khung khái niệm)</h3>
<p>Khung nghiên cứu thể hiện các biến và các quan hệ giả thuyết giữa chúng, rút ra từ lý thuyết và tổng quan tài liệu — trái tim của GA2.</p>
<pre><code class="language-text">Cảm nhận tính hữu ích ──H1(+)──┐
Cảm nhận tính dễ dùng ──H2(+)──┼──►  Ý định sử dụng ví điện tử
Niềm tin vào nhà cung cấp─H3(+)┘            ▲
                        Tần suất sử dụng ── biến điều tiết (H4)
Biến độc lập: nguyên nhân hay biến dự báo    Biến phụ thuộc: kết quả cần giải thích
Biến trung gian: truyền dẫn tác động         Biến điều tiết: làm thay đổi độ mạnh tác động</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> Triết lý không phải cái nhãn để trang trí chương phương pháp. Người chấm kiểm tính nhất quán: một nghiên cứu thực chứng chỉ có ba cuộc phỏng vấn phi cấu trúc, hay một nghiên cứu diễn giải kiểm định mười giả thuyết, cho thấy "củ hành" chưa được suy nghĩ thấu đáo.</div>`,
  ]]);

const c5 = doc('rmb301-2-2-research-design', '2.2 — Ch 5: Formulating the research design|||2.2 — Ch 5: Xây dựng thiết kế nghiên cứu',
  'Mục đích nghiên cứu (khám phá, mô tả, giải thích, đánh giá), lựa chọn định lượng – định tính – hỗn hợp, tám chiến lược nghiên cứu, khung thời gian cắt ngang và theo thời gian, độ tin cậy và độ giá trị cùng các mối đe doạ, tiêu chí chất lượng cho nghiên cứu định tính; tình huống đào tạo nhân viên siêu thị.',
  [[
    `<span class="eyebrow">RMB301 · Part 2 · Lesson 2.2</span>
<h2>Formulating the research design</h2>
<p class="lead">The research design is your general plan for answering the research question: its purpose, methodological choice, strategy, time horizon, and how you will ensure quality and ethics.</p>
<h3>Purpose of the research</h3>
<table>
<tr><th>Purpose</th><th>Question it answers</th><th>Typical techniques</th></tr>
<tr><td>Exploratory</td><td>What is happening? What are the issues?</td><td>Literature search, expert interviews, in-depth interviews, focus groups; flexible</td></tr>
<tr><td>Descriptive</td><td>Who, what, where, when, how much? An accurate profile</td><td>Surveys, structured observation, secondary data; often a forerunner of explanation</td></tr>
<tr><td>Explanatory</td><td>Why? What causes what? Relationships between variables</td><td>Experiments, surveys with statistical tests, case studies</td></tr>
<tr><td>Evaluative</td><td>How well does something work (a policy, a programme)?</td><td>Mixed designs comparing outcomes against criteria</td></tr>
</table>
<h3>Methodological choice</h3>
<table>
<tr><th></th><th>Quantitative</th><th>Qualitative</th><th>Mixed methods</th></tr>
<tr><td>Data</td><td>Numbers; variables measured</td><td>Words, images, meanings</td><td>Both, integrated</td></tr>
<tr><td>Usual philosophy/approach</td><td>Positivism; deduction</td><td>Interpretivism; induction (or abduction)</td><td>Often pragmatism or critical realism</td></tr>
<tr><td>Sample</td><td>Larger, often probability</td><td>Smaller, purposive</td><td>Different samples for each phase</td></tr>
<tr><td>Analysis</td><td>Statistics</td><td>Coding, themes, interpretation</td><td>Both, then integration</td></tr>
</table>
<p>A <strong>mono method</strong> uses one technique; a <strong>multi-method</strong> design uses several techniques of the same type (e.g., interviews plus diaries); <strong>mixed methods</strong> combine quantitative and qualitative — <em>concurrent</em> (in parallel), <em>sequential exploratory</em> (qualitative first, to build a questionnaire) or <em>sequential explanatory</em> (quantitative first, then interviews to explain the results).</p>
<h3>Research strategies</h3>
<table>
<tr><th>Strategy</th><th>In brief</th></tr>
<tr><td>Experiment</td><td>Manipulate an independent variable and compare an experimental group with a control group</td></tr>
<tr><td>Survey</td><td>Collect standardised data from a sizeable population, usually by questionnaire</td></tr>
<tr><td>Archival and documentary research</td><td>Use existing records and documents as the main data source</td></tr>
<tr><td>Case study</td><td>In-depth study of a phenomenon in its real-life context (one or several cases)</td></tr>
<tr><td>Ethnography</td><td>Study the culture or social world of a group by immersion over time</td></tr>
<tr><td>Action research</td><td>Participative, iterative cycles of diagnosing, planning, acting and evaluating to solve a real problem</td></tr>
<tr><td>Grounded theory</td><td>Build theory from data through systematic, constant comparison</td></tr>
<tr><td>Narrative inquiry</td><td>Collect and analyse participants’ accounts as complete stories</td></tr>
</table>
<h3>Time horizon</h3>
<p><strong>Cross-sectional</strong> research studies a phenomenon at one point in time (most student surveys). <strong>Longitudinal</strong> research follows change over time (panels, diaries, repeated observations) and is stronger for studying change and causality.</p>
<h3>Quality: reliability and validity</h3>
<p><strong>Reliability</strong> is about consistency — would another researcher, or you on another occasion, obtain the same findings? <strong>Validity</strong> is about whether you measure what you intend (measurement validity), whether a causal conclusion is justified (<strong>internal validity</strong>), and whether findings generalise (<strong>external validity</strong>).</p>
<table>
<tr><th>Threats to reliability</th><th>Threats to internal validity</th></tr>
<tr><td>Participant error (e.g., tired respondents on a Friday evening); participant bias (saying what the boss wants to hear); researcher error (misreading answers); researcher bias (interpreting through own views)</td><td>Past or recent events (history); testing (a pre-test changes behaviour); instrumentation (the measure changes); mortality (participants drop out); maturation (people change naturally); ambiguity about causal direction</td></tr>
</table>
<p>Qualitative researchers often use parallel criteria: <strong>credibility</strong>, <strong>transferability</strong>, <strong>dependability</strong> and <strong>confirmability</strong>.</p>
<h3>Worked case: evaluating a supermarket training programme</h3>
<p>A fictional supermarket chain trains cashiers in customer service and wants to know whether performance improves. How can the design protect validity?</p>
<table>
<tr><th>Threat</th><th>Design measure</th></tr>
<tr><td>History (a sales promotion happens at the same time)</td><td>Add a <strong>control group</strong> of comparable stores measured over the same period</td></tr>
<tr><td>Selection (best stores volunteer)</td><td>Assign stores to training randomly, or match them on size and past scores</td></tr>
<tr><td>Testing and instrumentation</td><td>Use the same mystery-shopper checklist and trained raters before and after; raters do not know which stores were trained</td></tr>
<tr><td>Mortality (staff leave)</td><td>Record drop-outs and compare those who left with those who stayed</td></tr>
<tr><td>Maturation (staff improve with experience anyway)</td><td>The control group shows the improvement that happens without training</td></tr>
<tr><td>Participant bias</td><td>Use objective measures (transaction time, complaint rates) alongside ratings</td></tr>
</table>
<div class="callout"><span class="badge">Key idea</span> Design is where most of the quality of a study is decided. Statistics cannot repair a design with no comparison group.</div>`,
    `<span class="eyebrow">RMB301 · Phần 2 · Bài 2.2</span>
<h2>Xây dựng thiết kế nghiên cứu</h2>
<p class="lead">Thiết kế nghiên cứu là kế hoạch tổng thể để trả lời câu hỏi nghiên cứu: mục đích, lựa chọn phương pháp luận, chiến lược, khung thời gian, và cách bảo đảm chất lượng cùng đạo đức.</p>
<h3>Mục đích nghiên cứu</h3>
<table>
<tr><th>Mục đích</th><th>Câu hỏi được trả lời</th><th>Kỹ thuật điển hình</th></tr>
<tr><td>Khám phá</td><td>Chuyện gì đang diễn ra? Vấn đề là gì?</td><td>Tìm tài liệu, phỏng vấn chuyên gia, phỏng vấn sâu, thảo luận nhóm tập trung; linh hoạt</td></tr>
<tr><td>Mô tả</td><td>Ai, cái gì, ở đâu, khi nào, bao nhiêu? Một bức tranh chính xác</td><td>Khảo sát, quan sát có cấu trúc, dữ liệu thứ cấp; thường là bước đệm cho giải thích</td></tr>
<tr><td>Giải thích</td><td>Vì sao? Cái gì gây ra cái gì? Quan hệ giữa các biến</td><td>Thực nghiệm, khảo sát có kiểm định thống kê, nghiên cứu tình huống</td></tr>
<tr><td>Đánh giá</td><td>Một điều gì đó (chính sách, chương trình) hiệu quả tới đâu?</td><td>Thiết kế hỗn hợp so sánh kết quả với tiêu chí</td></tr>
</table>
<h3>Lựa chọn phương pháp luận</h3>
<table>
<tr><th></th><th>Định lượng</th><th>Định tính</th><th>Hỗn hợp</th></tr>
<tr><td>Dữ liệu</td><td>Con số; đo lường các biến</td><td>Lời nói, hình ảnh, ý nghĩa</td><td>Cả hai, được tích hợp</td></tr>
<tr><td>Triết lý/cách tiếp cận thường gặp</td><td>Thực chứng; suy diễn</td><td>Diễn giải; quy nạp (hoặc abductive)</td><td>Thường là thực dụng hoặc hiện thực phê phán</td></tr>
<tr><td>Mẫu</td><td>Lớn hơn, thường là mẫu xác suất</td><td>Nhỏ hơn, chọn có chủ đích</td><td>Mẫu khác nhau cho từng giai đoạn</td></tr>
<tr><td>Phân tích</td><td>Thống kê</td><td>Mã hoá, chủ đề, diễn giải</td><td>Cả hai, rồi tích hợp</td></tr>
</table>
<p><strong>Đơn phương pháp</strong> dùng một kỹ thuật; thiết kế <strong>đa phương pháp</strong> dùng nhiều kỹ thuật cùng loại (vd phỏng vấn kết hợp nhật ký); <strong>phương pháp hỗn hợp</strong> kết hợp định lượng và định tính — <em>đồng thời</em> (song song), <em>tuần tự khám phá</em> (định tính trước, để xây bảng hỏi) hoặc <em>tuần tự giải thích</em> (định lượng trước, rồi phỏng vấn để giải thích kết quả).</p>
<h3>Các chiến lược nghiên cứu</h3>
<table>
<tr><th>Chiến lược</th><th>Tóm tắt</th></tr>
<tr><td>Thực nghiệm</td><td>Tác động có chủ đích vào biến độc lập và so sánh nhóm thực nghiệm với nhóm đối chứng</td></tr>
<tr><td>Khảo sát</td><td>Thu thập dữ liệu chuẩn hoá từ một tổng thể khá lớn, thường bằng bảng hỏi</td></tr>
<tr><td>Nghiên cứu lưu trữ và tư liệu</td><td>Dùng hồ sơ, tài liệu có sẵn làm nguồn dữ liệu chính</td></tr>
<tr><td>Nghiên cứu tình huống</td><td>Nghiên cứu sâu một hiện tượng trong bối cảnh thực của nó (một hay nhiều tình huống)</td></tr>
<tr><td>Dân tộc học</td><td>Nghiên cứu văn hoá hay thế giới xã hội của một nhóm bằng cách hoà mình vào nhóm trong thời gian dài</td></tr>
<tr><td>Nghiên cứu hành động</td><td>Các chu kỳ có sự tham gia, lặp lại gồm chẩn đoán, lập kế hoạch, hành động và đánh giá để giải quyết một vấn đề thực</td></tr>
<tr><td>Lý thuyết nền (grounded theory)</td><td>Xây dựng lý thuyết từ dữ liệu qua so sánh liên tục, có hệ thống</td></tr>
<tr><td>Nghiên cứu tự sự</td><td>Thu thập và phân tích lời kể của người tham gia như những câu chuyện trọn vẹn</td></tr>
</table>
<h3>Khung thời gian</h3>
<p>Nghiên cứu <strong>cắt ngang</strong> xem xét hiện tượng tại một thời điểm (phần lớn khảo sát của sinh viên). Nghiên cứu <strong>theo thời gian (dọc)</strong> theo dõi sự thay đổi qua thời gian (dữ liệu bảng, nhật ký, quan sát lặp lại) và mạnh hơn khi nghiên cứu sự thay đổi và quan hệ nhân quả.</p>
<h3>Chất lượng: độ tin cậy và độ giá trị</h3>
<p><strong>Độ tin cậy</strong> là tính nhất quán — một nhà nghiên cứu khác, hoặc chính bạn vào dịp khác, có thu được cùng kết quả không? <strong>Độ giá trị</strong> là việc bạn có đo đúng cái định đo (giá trị đo lường), kết luận nhân quả có xác đáng không (<strong>giá trị nội tại</strong>), và kết quả có khái quát hoá được không (<strong>giá trị ngoại tại</strong>).</p>
<table>
<tr><th>Đe doạ độ tin cậy</th><th>Đe doạ giá trị nội tại</th></tr>
<tr><td>Sai sót của người tham gia (vd người trả lời mệt vào tối thứ Sáu); thiên lệch của người tham gia (nói điều sếp muốn nghe); sai sót của nhà nghiên cứu (đọc nhầm câu trả lời); thiên lệch của nhà nghiên cứu (diễn giải theo quan điểm riêng)</td><td>Sự kiện trong quá khứ hoặc gần đây (lịch sử); tác động của lần đo trước (pre-test làm thay đổi hành vi); công cụ đo thay đổi; hao hụt mẫu (người tham gia bỏ cuộc); sự trưởng thành tự nhiên của con người; mơ hồ về chiều nhân quả</td></tr>
</table>
<p>Nhà nghiên cứu định tính thường dùng các tiêu chí tương ứng: <strong>độ khả tín</strong> (credibility), <strong>khả năng chuyển giao</strong> (transferability), <strong>độ tin cậy phụ thuộc</strong> (dependability) và <strong>khả năng xác nhận</strong> (confirmability).</p>
<h3>Tình huống mẫu: đánh giá chương trình đào tạo ở siêu thị</h3>
<p>Một chuỗi siêu thị (giả định) đào tạo thu ngân về dịch vụ khách hàng và muốn biết hiệu quả công việc có cải thiện không. Thiết kế có thể bảo vệ độ giá trị thế nào?</p>
<table>
<tr><th>Mối đe doạ</th><th>Biện pháp trong thiết kế</th></tr>
<tr><td>Lịch sử (một đợt khuyến mãi diễn ra cùng lúc)</td><td>Thêm <strong>nhóm đối chứng</strong> gồm các cửa hàng tương đương, đo trong cùng thời kỳ</td></tr>
<tr><td>Chọn mẫu (cửa hàng tốt nhất tự nguyện tham gia)</td><td>Phân cửa hàng vào nhóm đào tạo một cách ngẫu nhiên, hoặc ghép cặp theo quy mô và điểm số trước đó</td></tr>
<tr><td>Tác động của lần đo và công cụ đo</td><td>Dùng cùng một bảng kiểm của khách hàng bí mật và cùng người chấm đã được tập huấn trước và sau; người chấm không biết cửa hàng nào được đào tạo</td></tr>
<tr><td>Hao hụt mẫu (nhân viên nghỉ việc)</td><td>Ghi nhận người rời đi và so sánh nhóm rời đi với nhóm ở lại</td></tr>
<tr><td>Trưởng thành (nhân viên tự giỏi lên nhờ kinh nghiệm)</td><td>Nhóm đối chứng cho thấy mức cải thiện xảy ra khi không có đào tạo</td></tr>
<tr><td>Thiên lệch của người tham gia</td><td>Dùng thước đo khách quan (thời gian giao dịch, tỷ lệ khiếu nại) bên cạnh điểm đánh giá</td></tr>
</table>
<div class="callout"><span class="badge">Ý chính</span> Phần lớn chất lượng của một nghiên cứu được quyết định ở khâu thiết kế. Thống kê không cứu được một thiết kế không có nhóm so sánh.</div>`,
  ]]);

const c6 = doc('rmb301-2-3-access-ethics', '2.3 — Ch 6: Negotiating access and research ethics|||2.3 — Ch 6: Đàm phán quyền tiếp cận và đạo đức nghiên cứu',
  'Các kiểu và cấp độ tiếp cận, người gác cổng, chiến lược giành quyền tiếp cận, các nguyên tắc đạo đức nghiên cứu, đồng thuận có hiểu biết, bảo mật và ẩn danh, bảo vệ dữ liệu cá nhân (GDPR, Nghị định 13/2023/NĐ-CP — kiểm văn bản hiện hành), đạo đức khi dùng AI; câu hỏi ôn Phần 2.',
  [[
    `<span class="eyebrow">RMB301 · Part 2 · Lesson 2.3</span>
<h2>Negotiating access and research ethics</h2>
<h3>Types and levels of access</h3>
<p>Access may be <strong>traditional</strong> (face-to-face, on site), <strong>internet-mediated</strong> (online surveys, video interviews, online communities), <strong>intranet-mediated</strong> (through an organisation’s internal network) or a <strong>hybrid</strong>. It also has levels: <strong>physical access</strong> (getting in), <strong>continuing access</strong> (staying in over time) and <strong>cognitive access</strong> (getting participants to share what you really need). <strong>Gatekeepers</strong> — managers, HR, community leaders — control the first. Being an internal researcher (an employee) makes access easier but raises role conflicts and concerns about confidentiality.</p>
<h3>Strategies to gain access</h3>
<ul>
<li>Know the organisation, and allow sufficient time — requests are often slow.</li>
<li>Use existing contacts and develop new ones (alumni, internships, lecturers).</li>
<li>Give a clear account of the purpose and the type of access you need (time, people, documents).</li>
<li>Address organisational concerns about time, sensitivity and confidentiality.</li>
<li>Identify possible benefits for the organisation (a summary report of findings).</li>
<li>Use suitable, jargon-free language; make replying easy; build access step by step; establish credibility.</li>
</ul>
<h3>What research ethics means</h3>
<p>Ethics refers to the standards of behaviour that guide your conduct towards the <strong>rights of those who become the subject of your work or are affected by it</strong>. Ethical issues arise at every stage — design, access, collection, analysis, reporting and data management.</p>
<table>
<tr><th>Principle</th><th>In practice</th></tr>
<tr><td>Integrity and objectivity</td><td>Be honest and open; never fabricate or falsify data</td></tr>
<tr><td>Respect for others</td><td>Respect dignity, rights and differences of participants</td></tr>
<tr><td>Avoidance of harm</td><td>No embarrassment, stress, discomfort or damage to participants or organisations</td></tr>
<tr><td>Privacy</td><td>Do not intrude beyond what the study needs</td></tr>
<tr><td>Voluntary participation and right to withdraw</td><td>No pressure, e.g., from a manager or lecturer; withdraw without penalty</td></tr>
<tr><td>Informed consent</td><td>Participants know the purpose, what is involved, risks, and how data will be used, before agreeing</td></tr>
<tr><td>Confidentiality and anonymity</td><td>Protect identities; report so that individuals and firms cannot be identified</td></tr>
<tr><td>Responsibility in analysis and reporting</td><td>Report findings fully and accurately, including those that do not support you</td></tr>
<tr><td>Compliance in data management</td><td>Store data securely, keep it only as long as needed, follow data protection law</td></tr>
<tr><td>Researcher safety</td><td>Avoid situations that put you at risk</td></tr>
</table>
<h3>Informed consent in practice</h3>
<p>Prepare a <strong>participant information sheet</strong> (who you are, purpose, what participation involves, time needed, risks and benefits, voluntary nature, right to withdraw, confidentiality, data storage, contact details) and a <strong>consent form</strong>. For an online questionnaire, the first screen can serve this purpose, with a clear "I agree" option.</p>
<h3>Personal data protection</h3>
<p>Saunders discusses the EU General Data Protection Regulation (GDPR). In Vietnam, <strong>Decree 13/2023/ND-CP</strong> on personal data protection (effective from 1 July 2023) set out rules such as consent that is voluntary and specific, extra care for sensitive personal data (for example health, religion or financial information), and rights of data subjects. The framework has since been raised to the level of a dedicated law, reported as taking effect in 2026 — <strong>check the text currently in force</strong> on the official legal database (vbpl.vn) and your university’s rules before collecting data. In practice: collect only the personal data you need, separate identifiers from answers, anonymise early, store files securely, and delete them when the retention period ends.</p>
<h3>Ethics and AI</h3>
<p>Do not upload interview transcripts or survey files containing identifiable information to public AI tools; do not let AI invent data, quotes or references; and report honestly how AI supported your work.</p>
<h3>Review and discussion questions — Part 2</h3>
<ol>
<li>Describe the research onion and explain the choices you make in each layer for your project.</li>
<li>Distinguish primary from secondary data; which will your study use?</li>
<li>Draw your research framework: which variables are independent, dependent, mediating or moderating?</li>
<li>Write your hypotheses in H0/H1 form.</li>
<li>Compare positivism, interpretivism and pragmatism: which fits your question, and why?</li>
<li>Compare deduction, induction and abduction with an example of each.</li>
<li>In the supermarket training case, which measures would you use to ensure validity?</li>
<li>Is your study exploratory, descriptive or explanatory (causal)? Justify.</li>
<li>When would you choose a qualitative rather than a quantitative design?</li>
<li>What ethical issues could arise in your project, and how will you address them?</li>
</ol>
<div class="callout"><span class="badge">Remember</span> Consent obtained under pressure is not consent. Asking your own employees or classmates to "voluntarily" participate needs extra care.</div>`,
    `<span class="eyebrow">RMB301 · Phần 2 · Bài 2.3</span>
<h2>Đàm phán quyền tiếp cận và đạo đức nghiên cứu</h2>
<h3>Các kiểu và cấp độ tiếp cận</h3>
<p>Việc tiếp cận có thể là <strong>truyền thống</strong> (trực tiếp, tại chỗ), <strong>qua internet</strong> (khảo sát trực tuyến, phỏng vấn video, cộng đồng mạng), <strong>qua mạng nội bộ</strong> (intranet của tổ chức) hoặc <strong>kết hợp</strong>. Tiếp cận còn có các cấp độ: <strong>tiếp cận vật lý</strong> (vào được tổ chức), <strong>tiếp cận liên tục</strong> (duy trì được theo thời gian) và <strong>tiếp cận nhận thức</strong> (người tham gia chia sẻ đúng điều bạn cần). <strong>Người gác cổng</strong> — quản lý, bộ phận nhân sự, người đứng đầu cộng đồng — kiểm soát cấp độ đầu tiên. Là nhà nghiên cứu nội bộ (nhân viên của tổ chức) giúp tiếp cận dễ hơn nhưng dễ xung đột vai trò và khiến người tham gia lo ngại về bảo mật.</p>
<h3>Chiến lược giành quyền tiếp cận</h3>
<ul>
<li>Hiểu rõ tổ chức và dành đủ thời gian — các đề nghị thường được trả lời chậm.</li>
<li>Dùng các mối quan hệ sẵn có và phát triển quan hệ mới (cựu sinh viên, nơi thực tập, giảng viên).</li>
<li>Trình bày rõ mục đích và loại tiếp cận bạn cần (thời gian, con người, tài liệu).</li>
<li>Giải toả lo ngại của tổ chức về thời gian, tính nhạy cảm và bảo mật.</li>
<li>Nêu lợi ích có thể mang lại cho tổ chức (một bản tóm tắt kết quả).</li>
<li>Dùng ngôn ngữ phù hợp, không thuật ngữ khó; giúp họ trả lời dễ dàng; mở rộng tiếp cận từng bước; tạo dựng uy tín.</li>
</ul>
<h3>Đạo đức nghiên cứu là gì</h3>
<p>Đạo đức là các chuẩn mực hành xử định hướng cách bạn đối xử với <strong>quyền của những người trở thành đối tượng nghiên cứu hoặc chịu ảnh hưởng bởi nghiên cứu</strong>. Vấn đề đạo đức phát sinh ở mọi giai đoạn — thiết kế, tiếp cận, thu thập, phân tích, báo cáo và quản lý dữ liệu.</p>
<table>
<tr><th>Nguyên tắc</th><th>Trong thực hành</th></tr>
<tr><td>Chính trực và khách quan</td><td>Trung thực, cởi mở; không bao giờ bịa đặt hay làm sai lệch dữ liệu</td></tr>
<tr><td>Tôn trọng người khác</td><td>Tôn trọng phẩm giá, quyền và sự khác biệt của người tham gia</td></tr>
<tr><td>Tránh gây hại</td><td>Không gây ngượng ngùng, căng thẳng, khó chịu hay thiệt hại cho người tham gia hoặc tổ chức</td></tr>
<tr><td>Quyền riêng tư</td><td>Không xâm phạm quá mức nghiên cứu cần</td></tr>
<tr><td>Tham gia tự nguyện và quyền rút lui</td><td>Không gây áp lực, vd từ quản lý hay giảng viên; rút lui không bị thiệt thòi</td></tr>
<tr><td>Đồng thuận có hiểu biết</td><td>Người tham gia biết mục đích, việc phải làm, rủi ro và cách dữ liệu được dùng trước khi đồng ý</td></tr>
<tr><td>Bảo mật và ẩn danh</td><td>Bảo vệ danh tính; báo cáo sao cho không nhận diện được cá nhân và doanh nghiệp</td></tr>
<tr><td>Trách nhiệm khi phân tích và báo cáo</td><td>Báo cáo đầy đủ, chính xác, kể cả kết quả không ủng hộ bạn</td></tr>
<tr><td>Tuân thủ trong quản lý dữ liệu</td><td>Lưu trữ an toàn, chỉ giữ trong thời gian cần thiết, tuân thủ pháp luật về bảo vệ dữ liệu</td></tr>
<tr><td>An toàn của nhà nghiên cứu</td><td>Tránh các tình huống khiến bản thân gặp nguy hiểm</td></tr>
</table>
<h3>Đồng thuận có hiểu biết trong thực tế</h3>
<p>Chuẩn bị <strong>phiếu thông tin cho người tham gia</strong> (bạn là ai, mục đích, việc tham gia gồm những gì, thời gian cần, rủi ro và lợi ích, tính tự nguyện, quyền rút lui, bảo mật, cách lưu trữ dữ liệu, thông tin liên hệ) và <strong>phiếu đồng thuận</strong>. Với bảng hỏi trực tuyến, màn hình đầu tiên có thể đảm nhận vai trò này, kèm lựa chọn "Tôi đồng ý" rõ ràng.</p>
<h3>Bảo vệ dữ liệu cá nhân</h3>
<p>Saunders bàn về Quy định chung về bảo vệ dữ liệu của EU (GDPR). Ở Việt Nam, <strong>Nghị định 13/2023/NĐ-CP</strong> về bảo vệ dữ liệu cá nhân (hiệu lực từ 01/7/2023) đặt ra các quy tắc như sự đồng ý phải tự nguyện và cụ thể, cẩn trọng hơn với dữ liệu cá nhân nhạy cảm (ví dụ sức khoẻ, tôn giáo, thông tin tài chính), và các quyền của chủ thể dữ liệu. Khung pháp lý này sau đó được nâng lên thành một đạo luật riêng, theo thông tin công bố là có hiệu lực từ năm 2026 — <strong>hãy kiểm văn bản đang có hiệu lực</strong> trên cơ sở dữ liệu văn bản pháp luật chính thức (vbpl.vn) và quy định của trường trước khi thu thập dữ liệu. Trong thực hành: chỉ thu dữ liệu cá nhân cần thiết, tách thông tin định danh khỏi câu trả lời, ẩn danh sớm, lưu trữ an toàn và xoá khi hết thời hạn lưu giữ.</p>
<h3>Đạo đức và AI</h3>
<p>Không tải bản ghi phỏng vấn hay tệp khảo sát chứa thông tin nhận diện được lên công cụ AI công cộng; không để AI bịa dữ liệu, trích dẫn lời nói hay tài liệu tham khảo; và báo cáo trung thực AI đã hỗ trợ công việc của bạn thế nào.</p>
<h3>Câu hỏi ôn tập và thảo luận — Phần 2</h3>
<ol>
<li>Mô tả củ hành nghiên cứu và giải thích lựa chọn của bạn ở từng lớp cho dự án của mình.</li>
<li>Phân biệt dữ liệu sơ cấp và dữ liệu thứ cấp; nghiên cứu của bạn dùng loại nào?</li>
<li>Vẽ khung nghiên cứu của bạn: biến nào là độc lập, phụ thuộc, trung gian hay điều tiết?</li>
<li>Viết các giả thuyết của bạn dưới dạng H0/H1.</li>
<li>So sánh thực chứng, diễn giải và thực dụng: triết lý nào hợp với câu hỏi của bạn, vì sao?</li>
<li>So sánh suy diễn, quy nạp và abductive, mỗi cách một ví dụ.</li>
<li>Trong tình huống đào tạo nhân viên siêu thị, bạn dùng biện pháp nào để bảo đảm độ giá trị?</li>
<li>Nghiên cứu của bạn là khám phá, mô tả hay giải thích (nhân quả)? Hãy biện minh.</li>
<li>Khi nào bạn chọn thiết kế định tính thay vì định lượng?</li>
<li>Dự án của bạn có thể phát sinh những vấn đề đạo đức nào, và bạn xử lý ra sao?</li>
</ol>
<div class="callout"><span class="badge">Ghi nhớ</span> Sự đồng ý có được dưới áp lực không phải là sự đồng ý. Mời chính nhân viên hay bạn cùng lớp của mình "tự nguyện" tham gia cần cẩn trọng gấp bội.</div>`,
  ]]);

const q2 = quiz('rmb301-quiz-2', 'Quiz 2 — Philosophy, approach, design & ethics|||Quiz 2 — Triết lý, cách tiếp cận, thiết kế & đạo đức', [
  { id: 'q1', question: 'A researcher believes reality is socially constructed, focuses on participants’ meanings and uses a small number of in-depth interviews. Which philosophy does this best reflect?|||Một nhà nghiên cứu tin rằng thực tại được kiến tạo về mặt xã hội, tập trung vào ý nghĩa của người tham gia và dùng một số ít cuộc phỏng vấn sâu. Điều này phản ánh rõ nhất triết lý nào?', options: ['Positivism|||Thực chứng', 'Critical realism|||Hiện thực phê phán', 'Interpretivism|||Diễn giải', 'Deduction|||Suy diễn'], correctIndex: 2, explanation: 'Interpretivism sees reality as socially constructed with multiple meanings and typically uses small samples and in-depth qualitative methods. Deduction is an approach to theory development, not a philosophy.|||Diễn giải coi thực tại được kiến tạo xã hội với nhiều ý nghĩa và thường dùng mẫu nhỏ, phương pháp định tính chuyên sâu. Suy diễn là cách tiếp cận phát triển lý thuyết, không phải triết lý.' },
  { id: 'q2', question: 'A study starts from a surprising observation, proposes a plausible explanation and then tests it with new data, moving back and forth between data and theory. This approach is…|||Một nghiên cứu bắt đầu từ một quan sát bất ngờ, đề xuất lời giải thích khả dĩ rồi kiểm định bằng dữ liệu mới, đi lại qua lại giữa dữ liệu và lý thuyết. Cách tiếp cận này là…', options: ['abduction|||abductive (suy luận giả định)', 'deduction|||suy diễn', 'induction|||quy nạp', 'falsification only|||chỉ bác bỏ giả thuyết'], correctIndex: 0, explanation: 'Abduction combines deduction and induction: a surprising fact leads to a plausible theory, which is then tested.|||Abductive kết hợp suy diễn và quy nạp: một sự kiện bất ngờ dẫn tới lý thuyết khả dĩ, sau đó được kiểm định.' },
  { id: 'q3', question: 'In an evaluation of a staff training programme, several employees in the trained group leave the company before the post-test. This threat to internal validity is called…|||Khi đánh giá một chương trình đào tạo nhân viên, một số người trong nhóm được đào tạo nghỉ việc trước lần đo sau. Mối đe doạ giá trị nội tại này gọi là…', options: ['maturation|||sự trưởng thành', 'testing|||tác động của lần đo trước', 'instrumentation|||công cụ đo thay đổi', 'mortality|||hao hụt mẫu (mortality)'], correctIndex: 3, explanation: 'Mortality refers to participants dropping out, which can bias results if those who leave differ from those who stay.|||Hao hụt mẫu là việc người tham gia rời khỏi nghiên cứu, có thể làm lệch kết quả nếu người rời đi khác người ở lại.' },
]);

const c7 = doc('rmb301-3-1-sampling', '3.1 — Ch 7: Selecting samples|||3.1 — Ch 7: Chọn mẫu',
  'Vì sao phải chọn mẫu, tổng thể – tổng thể mục tiêu – khung mẫu – mẫu, chọn mẫu xác suất (ngẫu nhiên đơn giản, hệ thống, phân tầng, cụm, nhiều giai đoạn) và phi xác suất (định mức, có chủ đích, tự nguyện/quả cầu tuyết, thuận tiện), cỡ mẫu, tỷ lệ phản hồi, bão hoà dữ liệu, bảng so sánh.',
  [[
    `<span class="eyebrow">RMB301 · Part 3 · Lesson 3.1</span>
<h2>Selecting samples</h2>
<h3>Why sample?</h3>
<p>Collecting data from every member of a population (a <strong>census</strong>) is often impossible or impractical: the population is too large, the budget and time are limited, or results are needed quickly. A well-chosen sample can even be <em>more</em> accurate than a census, because more time can go into designing, piloting and checking the data from fewer cases.</p>
<h3>Key terms</h3>
<table>
<tr><th>Term</th><th>Meaning</th><th>Example (illustrative)</th></tr>
<tr><td>Population</td><td>The full set of cases or group members</td><td>All e-wallet users in Vietnam</td></tr>
<tr><td>Target population</td><td>The part of the population the research actually focuses on</td><td>Full-time students of one university in Hanoi</td></tr>
<tr><td>Sampling frame</td><td>A complete list of all cases in the target population, from which a probability sample is drawn</td><td>The university’s list of 3,000 enrolled students (used with permission)</td></tr>
<tr><td>Sample</td><td>The subgroup actually selected</td><td>341 students selected at random</td></tr>
</table>
<h3>Probability versus non-probability sampling</h3>
<p>In <strong>probability sampling</strong>, every case has a known, non-zero chance of selection, so you can make statistical inferences about the target population. In <strong>non-probability sampling</strong>, the chance is unknown; you cannot generalise statistically, but you can gain rich insight or generalise to theory.</p>
<h3>Probability techniques</h3>
<ul>
<li><strong>Simple random</strong>: select cases using random numbers from the sampling frame.</li>
<li><strong>Systematic random</strong>: pick a random start, then every k-th case (k = population / sample size). Beware periodic patterns in the list.</li>
<li><strong>Stratified random</strong>: divide the frame into relevant strata (e.g., year of study), then sample randomly within each stratum — often in proportion to its size. Improves representativeness.</li>
<li><strong>Cluster</strong>: divide the population into naturally occurring groups (e.g., classes, branches), randomly select whole clusters. Cheaper for dispersed populations, but usually less precise.</li>
<li><strong>Multi-stage</strong>: sample in stages — e.g., select provinces, then stores within them, then customers.</li>
</ul>
<h3>How large should a probability sample be?</h3>
<p>Size depends on the <strong>confidence level</strong> you need (usually 95%), the <strong>margin of error</strong> you can tolerate (e.g., ±5%), the types of analysis planned (sub-groups need enough cases each), and the population size. For estimating a proportion:</p>
<pre><code class="language-text">Minimum sample size   n0 = z^2 x p x (1 − p) / e^2
   z = 1.96 (95% confidence), p = expected proportion (0.5 if unknown), e = margin of error
   n0 = 1.96^2 x 0.5 x 0.5 / 0.05^2 = 384.16  ->  385
Finite population correction (small populations):  n = n0 / (1 + (n0 − 1) / N)
Actual sample to contact = n / expected response rate</code></pre>
<p>Response rates must be reported honestly: <em>total response rate</em> = responses / (sample − ineligible cases); <em>active response rate</em> = responses / (sample − (ineligible + unreachable)).</p>
<h3>Non-probability techniques</h3>
<ul>
<li><strong>Quota</strong>: fill quotas that mirror the population on key characteristics (e.g., 50% male, 50% female); selection within quotas is not random.</li>
<li><strong>Purposive</strong> (judgemental): choose cases that best answer the question — extreme (deviant) case, heterogeneous (maximum variation), homogeneous, critical case or typical case.</li>
<li><strong>Volunteer</strong>: <em>snowball</em> (each participant identifies others — useful for hard-to-reach groups) or <em>self-selection</em> (people respond to an open invitation).</li>
<li><strong>Haphazard (convenience)</strong>: whoever is easiest to reach. Quick and cheap, but highly prone to bias.</li>
</ul>
<p>For qualitative, non-probability samples there is no formula; many researchers continue until <strong>data saturation</strong> — when additional cases produce little or no new information.</p>
<table>
<tr><th>Technique</th><th>Sampling frame needed?</th><th>Relative cost</th><th>Can generalise statistically?</th></tr>
<tr><td>Simple / systematic random</td><td>Yes</td><td>Moderate to high</td><td>Yes</td></tr>
<tr><td>Stratified random</td><td>Yes, with stratum information</td><td>Moderate</td><td>Yes, often better</td></tr>
<tr><td>Cluster / multi-stage</td><td>Only for selected clusters</td><td>Lower for dispersed populations</td><td>Yes, but less precise</td></tr>
<tr><td>Quota</td><td>No</td><td>Low</td><td>No (though often representative in practice)</td></tr>
<tr><td>Purposive, snowball, self-selection</td><td>No</td><td>Low to moderate</td><td>No — generalise to theory</td></tr>
<tr><td>Haphazard (convenience)</td><td>No</td><td>Lowest</td><td>No</td></tr>
</table>
<div class="callout"><span class="badge">Watch out</span> A large online convenience sample is still a convenience sample. 1,000 responses from a Facebook group cannot represent all consumers, however large the number.</div>`,
    `<span class="eyebrow">RMB301 · Phần 3 · Bài 3.1</span>
<h2>Chọn mẫu</h2>
<h3>Vì sao phải chọn mẫu?</h3>
<p>Thu thập dữ liệu từ mọi phần tử của tổng thể (<strong>tổng điều tra</strong>) thường là không thể hoặc không thực tế: tổng thể quá lớn, ngân sách và thời gian có hạn, hoặc cần kết quả nhanh. Một mẫu được chọn tốt thậm chí có thể <em>chính xác hơn</em> tổng điều tra, vì có thêm thời gian để thiết kế, thử nghiệm và kiểm tra dữ liệu từ ít phần tử hơn.</p>
<h3>Thuật ngữ chính</h3>
<table>
<tr><th>Thuật ngữ</th><th>Nghĩa</th><th>Ví dụ (minh hoạ)</th></tr>
<tr><td>Tổng thể</td><td>Toàn bộ các phần tử hay thành viên của nhóm</td><td>Mọi người dùng ví điện tử tại Việt Nam</td></tr>
<tr><td>Tổng thể mục tiêu</td><td>Phần của tổng thể mà nghiên cứu thực sự tập trung vào</td><td>Sinh viên chính quy của một trường đại học ở Hà Nội</td></tr>
<tr><td>Khung mẫu</td><td>Danh sách đầy đủ mọi phần tử của tổng thể mục tiêu, dùng để rút mẫu xác suất</td><td>Danh sách 3.000 sinh viên đang học của trường (được phép sử dụng)</td></tr>
<tr><td>Mẫu</td><td>Nhóm con thực sự được chọn</td><td>341 sinh viên được chọn ngẫu nhiên</td></tr>
</table>
<h3>Chọn mẫu xác suất và phi xác suất</h3>
<p>Trong <strong>chọn mẫu xác suất</strong>, mỗi phần tử có xác suất được chọn biết trước và khác không, nên bạn có thể suy luận thống kê cho tổng thể mục tiêu. Trong <strong>chọn mẫu phi xác suất</strong>, xác suất này không biết trước; bạn không khái quát hoá thống kê được, nhưng có thể thu được hiểu biết sâu hoặc khái quát hoá về mặt lý thuyết.</p>
<h3>Các kỹ thuật xác suất</h3>
<ul>
<li><strong>Ngẫu nhiên đơn giản</strong>: chọn phần tử bằng số ngẫu nhiên từ khung mẫu.</li>
<li><strong>Ngẫu nhiên hệ thống</strong>: chọn ngẫu nhiên điểm bắt đầu, rồi cứ cách k phần tử lấy một (k = cỡ tổng thể / cỡ mẫu). Cẩn thận nếu danh sách có tính chu kỳ.</li>
<li><strong>Ngẫu nhiên phân tầng</strong>: chia khung mẫu thành các tầng có ý nghĩa (vd năm học), rồi chọn ngẫu nhiên trong từng tầng — thường theo tỷ lệ quy mô tầng. Tăng tính đại diện.</li>
<li><strong>Theo cụm</strong>: chia tổng thể thành các nhóm có sẵn (vd lớp học, chi nhánh), chọn ngẫu nhiên nguyên cụm. Rẻ hơn khi tổng thể phân tán, nhưng thường kém chính xác hơn.</li>
<li><strong>Nhiều giai đoạn</strong>: chọn mẫu theo từng bước — vd chọn tỉnh, rồi chọn cửa hàng trong tỉnh, rồi chọn khách hàng.</li>
</ul>
<h3>Mẫu xác suất cần lớn tới đâu?</h3>
<p>Cỡ mẫu phụ thuộc vào <strong>độ tin cậy</strong> cần có (thường 95%), <strong>sai số cho phép</strong> (vd ±5%), loại phân tích dự kiến (mỗi nhóm con cần đủ số phần tử) và quy mô tổng thể. Khi ước lượng một tỷ lệ:</p>
<pre><code class="language-text">Cỡ mẫu tối thiểu   n0 = z^2 x p x (1 − p) / e^2
   z = 1,96 (độ tin cậy 95%), p = tỷ lệ dự kiến (0,5 nếu chưa biết), e = sai số cho phép
   n0 = 1,96^2 x 0,5 x 0,5 / 0,05^2 = 384,16  ->  385
Hiệu chỉnh tổng thể hữu hạn (tổng thể nhỏ):  n = n0 / (1 + (n0 − 1) / N)
Số người cần liên hệ thực tế = n / tỷ lệ phản hồi dự kiến</code></pre>
<p>Tỷ lệ phản hồi phải được báo cáo trung thực: <em>tỷ lệ phản hồi tổng</em> = số phản hồi / (cỡ mẫu − số phần tử không đủ điều kiện); <em>tỷ lệ phản hồi chủ động</em> = số phản hồi / (cỡ mẫu − (số không đủ điều kiện + số không liên lạc được)).</p>
<h3>Các kỹ thuật phi xác suất</h3>
<ul>
<li><strong>Định mức (quota)</strong>: lấy đủ chỉ tiêu phản ánh tổng thể theo các đặc điểm chính (vd 50% nam, 50% nữ); việc chọn trong từng chỉ tiêu không ngẫu nhiên.</li>
<li><strong>Có chủ đích</strong> (theo phán đoán): chọn các phần tử trả lời câu hỏi tốt nhất — tình huống cực đoan (lệch chuẩn), không đồng nhất (đa dạng tối đa), đồng nhất, tình huống then chốt hoặc tình huống điển hình.</li>
<li><strong>Tự nguyện</strong>: <em>quả cầu tuyết</em> (người tham gia giới thiệu người khác — hữu ích với nhóm khó tiếp cận) hoặc <em>tự chọn</em> (mọi người hưởng ứng một lời mời mở).</li>
<li><strong>Tình cờ (thuận tiện)</strong>: ai dễ tiếp cận nhất thì chọn. Nhanh và rẻ nhưng rất dễ thiên lệch.</li>
</ul>
<p>Với mẫu phi xác suất trong nghiên cứu định tính không có công thức; nhiều nhà nghiên cứu tiếp tục cho tới khi <strong>bão hoà dữ liệu</strong> — khi thêm phần tử mới hầu như không mang lại thông tin mới.</p>
<table>
<tr><th>Kỹ thuật</th><th>Cần khung mẫu?</th><th>Chi phí tương đối</th><th>Khái quát hoá thống kê được?</th></tr>
<tr><td>Ngẫu nhiên đơn giản / hệ thống</td><td>Có</td><td>Trung bình tới cao</td><td>Có</td></tr>
<tr><td>Ngẫu nhiên phân tầng</td><td>Có, kèm thông tin về tầng</td><td>Trung bình</td><td>Có, thường tốt hơn</td></tr>
<tr><td>Theo cụm / nhiều giai đoạn</td><td>Chỉ cho các cụm được chọn</td><td>Thấp hơn khi tổng thể phân tán</td><td>Có, nhưng kém chính xác hơn</td></tr>
<tr><td>Định mức</td><td>Không</td><td>Thấp</td><td>Không (dù trên thực tế thường khá đại diện)</td></tr>
<tr><td>Có chủ đích, quả cầu tuyết, tự chọn</td><td>Không</td><td>Thấp tới trung bình</td><td>Không — khái quát hoá về lý thuyết</td></tr>
<tr><td>Tình cờ (thuận tiện)</td><td>Không</td><td>Thấp nhất</td><td>Không</td></tr>
</table>
<div class="callout"><span class="badge">Cẩn thận</span> Một mẫu thuận tiện trực tuyến rất lớn vẫn là mẫu thuận tiện. 1.000 câu trả lời từ một nhóm Facebook không đại diện được cho mọi người tiêu dùng, dù con số lớn đến đâu.</div>`,
  ]]);

const c7e = doc('rmb301-3-2-exercise', 'Exercise 2 — sample size and stratified allocation|||Bài tập 2 — cỡ mẫu và phân bổ mẫu phân tầng',
  'Bài tập: tính cỡ mẫu Cochran cho tỷ lệ (z = 1,96, p = 0,5, e = 5%), hiệu chỉnh tổng thể hữu hạn cho 3.000 sinh viên, phân bổ mẫu phân tầng theo tỷ lệ cho ba khoá và số phiếu cần gửi với tỷ lệ phản hồi dự kiến 65%; số liệu giả định, kèm lời giải.',
  [[
    `<span class="eyebrow">RMB301 · Part 3 · Exercise</span>
<h2>Exercise 2 — how many students must we survey?</h2>
<div class="callout"><span class="badge">Problem</span> A fictional university has N = 3,000 business students: Year 1 = 1,200, Year 2 = 1,050, Year 3 = 750. You want to estimate the proportion who use e-wallets weekly with 95% confidence and a margin of error of ±5%. No earlier estimate exists. (a) Compute the minimum sample size n0. (b) Apply the finite population correction. (c) Allocate the sample proportionally across the three strata. (d) If you expect a 65% response rate, how many students should you invite? (All figures are illustrative.)</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) p unknown -> use p = 0.5 (it maximises p(1 − p) = 0.25, the safest choice)
    n0 = 1.96^2 x 0.5 x 0.5 / 0.05^2 = 3.8416 x 0.25 / 0.0025 = 384.16  ->  385

(b) n = n0 / (1 + (n0 − 1) / N) = 384.16 / (1 + 383.16 / 3,000)
      = 384.16 / 1.12772 = 340.65  ->  341
    (the simplified form n0 / (1 + n0 / N) gives 340.55 -> also 341)

(c) Proportional allocation  n_h = n x N_h / N
    Year 1: 341 x 1,200 / 3,000 = 136.40
    Year 2: 341 x 1,050 / 3,000 = 119.35
    Year 3: 341 x   750 / 3,000 =  85.25
    Round down: 136 + 119 + 85 = 340 -> one place left; give it to the largest
    remainder (Year 1, .40)   =>   137 + 119 + 85 = 341

(d) Invitations = 341 / 0.65 = 524.6  ->  525 students
    (sampling fraction 341 / 3,000 = 11.4%)</code></pre>
<p><strong>Why:</strong> 385 is the textbook minimum for a large population; because 3,000 is small relative to the needed sample, the finite population correction saves 44 responses. Stratifying by year guarantees each year is represented in proportion, which reduces sampling error if e-wallet use differs by year. Always round sample sizes <em>up</em>, and plan for non-response — otherwise the achieved sample falls short and the margin of error widens.</p>`,
    `<span class="eyebrow">RMB301 · Phần 3 · Bài tập</span>
<h2>Bài tập 2 — cần khảo sát bao nhiêu sinh viên?</h2>
<div class="callout"><span class="badge">Đề</span> Một trường đại học (giả định) có N = 3.000 sinh viên kinh doanh: năm 1 = 1.200, năm 2 = 1.050, năm 3 = 750. Bạn muốn ước lượng tỷ lệ sinh viên dùng ví điện tử hằng tuần với độ tin cậy 95% và sai số ±5%. Chưa có ước lượng nào trước đó. (a) Tính cỡ mẫu tối thiểu n0. (b) Áp dụng hiệu chỉnh tổng thể hữu hạn. (c) Phân bổ mẫu theo tỷ lệ cho ba tầng. (d) Nếu tỷ lệ phản hồi dự kiến là 65%, cần mời bao nhiêu sinh viên? (Mọi số liệu đều là minh hoạ.)</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Chưa biết p -> dùng p = 0,5 (làm p(1 − p) lớn nhất = 0,25, lựa chọn an toàn nhất)
    n0 = 1,96^2 x 0,5 x 0,5 / 0,05^2 = 3,8416 x 0,25 / 0,0025 = 384,16  ->  385

(b) n = n0 / (1 + (n0 − 1) / N) = 384,16 / (1 + 383,16 / 3.000)
      = 384,16 / 1,12772 = 340,65  ->  341
    (dạng rút gọn n0 / (1 + n0 / N) cho 340,55 -> cũng là 341)

(c) Phân bổ theo tỷ lệ  n_h = n x N_h / N
    Năm 1: 341 x 1.200 / 3.000 = 136,40
    Năm 2: 341 x 1.050 / 3.000 = 119,35
    Năm 3: 341 x   750 / 3.000 =  85,25
    Làm tròn xuống: 136 + 119 + 85 = 340 -> còn thiếu một; cộng cho tầng có phần dư
    lớn nhất (năm 1, ,40)   =>   137 + 119 + 85 = 341

(d) Số lời mời = 341 / 0,65 = 524,6  ->  525 sinh viên
    (tỷ lệ chọn mẫu 341 / 3.000 = 11,4%)</code></pre>
<p><strong>Vì sao:</strong> 385 là cỡ mẫu tối thiểu kinh điển cho tổng thể lớn; vì 3.000 là nhỏ so với cỡ mẫu cần có, hiệu chỉnh tổng thể hữu hạn giúp bớt 44 phiếu. Phân tầng theo năm học bảo đảm mỗi khoá có mặt đúng tỷ lệ, giúp giảm sai số chọn mẫu nếu mức dùng ví điện tử khác nhau giữa các khoá. Luôn làm tròn cỡ mẫu <em>lên</em> và dự trù trường hợp không phản hồi — nếu không, mẫu thu được sẽ thiếu và sai số rộng ra.</p>`,
  ]]);

const c8 = doc('rmb301-3-3-secondary-data', '3.3 — Ch 8: Using secondary data|||3.3 — Ch 8: Sử dụng dữ liệu thứ cấp',
  'Dữ liệu thứ cấp và sơ cấp, dữ liệu thô và đã tổng hợp, ba nhóm (tư liệu, dựa trên khảo sát, đa nguồn), cách tìm, ưu và nhược điểm, đánh giá mức phù hợp (giá trị đo lường, độ bao phủ, độ tin cậy, thiên lệch đo lường, chi phí – lợi ích), dùng AI tóm tắt báo cáo có kiểm chứng.',
  [[
    `<span class="eyebrow">RMB301 · Part 3 · Lesson 3.3</span>
<h2>Using secondary data</h2>
<p class="lead"><strong>Secondary data</strong> are data originally collected for some other purpose, which you re-analyse to answer your own question. <strong>Primary data</strong> are collected specifically for your study. Secondary data may be <em>raw</em> (little or no processing) or <em>compiled</em> (selected or summarised).</p>
<h3>Three broad types</h3>
<table>
<tr><th>Type</th><th>Sub-types and examples</th></tr>
<tr><td>Documentary</td><td><em>Text</em>: notices, correspondence and emails, minutes, reports to shareholders, diaries, transcripts, websites, newspaper articles. <em>Non-text</em>: audio and video recordings, pictures, drawings, films, TV programmes</td></tr>
<tr><td>Survey-based</td><td><em>Censuses</em> (population, enterprise); <em>continuous and regular surveys</em> (labour force, household living standards); <em>ad hoc surveys</em> (one-off studies by governments, firms or researchers)</td></tr>
<tr><td>Multiple-source</td><td>Compiled from different sources — area-based (country profiles, e.g., World Bank Open Data) or time-series (longitudinal compilations such as annual reports over ten years)</td></tr>
</table>
<p>Large volumes of digital data — online reviews, social media posts, transaction records — can also be used as secondary data, subject to terms of use, ethics and data protection rules.</p>
<h3>Locating secondary data</h3>
<p>Use tertiary finding aids (library catalogues, data archives, statistics portals), official statistics from national and international agencies, company annual reports and websites, industry and trade associations, and datasets published with journal articles. Always record the exact source, table and date accessed.</p>
<h3>Advantages and disadvantages</h3>
<table>
<tr><th>Advantages</th><th>Disadvantages</th></tr>
<tr><td>Fewer resources: saves time and money</td><td>Collected for a different purpose, so may not match your question</td></tr>
<tr><td>Unobtrusive; no burden on respondents</td><td>Access may be difficult or costly</td></tr>
<tr><td>Makes longitudinal and comparative studies feasible</td><td>Definitions and aggregations may be unsuitable</td></tr>
<tr><td>Often high-quality, large samples (e.g., national surveys)</td><td>No real control over data quality</td></tr>
<tr><td>Can lead to unforeseen discoveries; data are permanent and checkable</td><td>The original purpose may shape how data are presented</td></tr>
</table>
<h3>Evaluating secondary data</h3>
<ol>
<li><strong>Overall suitability</strong>: <em>measurement validity</em> — do the data measure what you need? <em>Coverage</em> — the right population, period and variables, and are key variables missing?</li>
<li><strong>Precise suitability</strong>: <em>reliability and validity</em> — who collected the data, how, with what sample and response rate? <em>Measurement bias</em> — deliberate distortion (e.g., a company presenting results favourably) or changes in how data were collected over time.</li>
<li><strong>Costs and benefits</strong>: is the value of the data worth the cost and effort to obtain and clean them?</li>
</ol>
<pre><code class="language-text">Checklist before using a secondary dataset (illustrative study on SME revenue)
[ ] Definition of "SME" matches my study?          [ ] Period covers my years of interest?
[ ] Sampling method and response rate reported?     [ ] Unit (VND bn, USD m) and base year clear?
[ ] Any break in the series (new method, new classification)?</code></pre>
<h3>AI and secondary reports</h3>
<p>AI tools can summarise a long industry report quickly — but summaries may drop qualifiers, misread tables or mix up years. Always check every number you use against the original table, and cite the original source, not the AI summary.</p>
<div class="callout"><span class="badge">Tip</span> Secondary data are often the fastest way to describe the context of your thesis (market size, industry structure). Primary data then answer the question the secondary data cannot.</div>`,
    `<span class="eyebrow">RMB301 · Phần 3 · Bài 3.3</span>
<h2>Sử dụng dữ liệu thứ cấp</h2>
<p class="lead"><strong>Dữ liệu thứ cấp</strong> là dữ liệu ban đầu được thu thập cho mục đích khác, được bạn phân tích lại để trả lời câu hỏi của mình. <strong>Dữ liệu sơ cấp</strong> được thu thập riêng cho nghiên cứu của bạn. Dữ liệu thứ cấp có thể là dữ liệu <em>thô</em> (chưa hoặc ít qua xử lý) hoặc <em>đã tổng hợp</em> (được chọn lọc hay tóm tắt).</p>
<h3>Ba nhóm lớn</h3>
<table>
<tr><th>Nhóm</th><th>Loại nhỏ và ví dụ</th></tr>
<tr><td>Tư liệu</td><td><em>Dạng văn bản</em>: thông báo, thư từ và email, biên bản họp, báo cáo gửi cổ đông, nhật ký, bản ghi lời, trang web, bài báo. <em>Không phải văn bản</em>: bản ghi âm và ghi hình, ảnh, bản vẽ, phim, chương trình truyền hình</td></tr>
<tr><td>Dựa trên khảo sát</td><td><em>Tổng điều tra</em> (dân số, doanh nghiệp); <em>khảo sát liên tục và định kỳ</em> (lao động việc làm, mức sống hộ gia đình); <em>khảo sát đột xuất</em> (nghiên cứu một lần của chính phủ, doanh nghiệp hay nhà nghiên cứu)</td></tr>
<tr><td>Đa nguồn</td><td>Tổng hợp từ nhiều nguồn — theo khu vực (hồ sơ quốc gia, vd World Bank Open Data) hoặc theo chuỗi thời gian (tổng hợp dài hạn như báo cáo thường niên mười năm)</td></tr>
</table>
<p>Khối lượng lớn dữ liệu số — đánh giá trực tuyến, bài đăng mạng xã hội, hồ sơ giao dịch — cũng có thể dùng làm dữ liệu thứ cấp, với điều kiện tuân thủ điều khoản sử dụng, đạo đức và quy định bảo vệ dữ liệu.</p>
<h3>Tìm dữ liệu thứ cấp</h3>
<p>Dùng công cụ tra cứu cấp ba (danh mục thư viện, kho lưu trữ dữ liệu, cổng thống kê), số liệu thống kê chính thức của các cơ quan trong nước và quốc tế, báo cáo thường niên và trang web doanh nghiệp, hiệp hội ngành nghề, và các bộ dữ liệu công bố kèm bài báo khoa học. Luôn ghi lại chính xác nguồn, bảng số liệu và ngày truy cập.</p>
<h3>Ưu và nhược điểm</h3>
<table>
<tr><th>Ưu điểm</th><th>Nhược điểm</th></tr>
<tr><td>Ít nguồn lực: tiết kiệm thời gian và tiền bạc</td><td>Được thu thập cho mục đích khác nên có thể không khớp câu hỏi của bạn</td></tr>
<tr><td>Không gây phiền; không tạo gánh nặng cho người trả lời</td><td>Có thể khó hoặc tốn kém để tiếp cận</td></tr>
<tr><td>Giúp nghiên cứu theo thời gian và so sánh trở nên khả thi</td><td>Định nghĩa và cách gộp số liệu có thể không phù hợp</td></tr>
<tr><td>Thường có chất lượng cao, mẫu lớn (vd khảo sát quốc gia)</td><td>Không thực sự kiểm soát được chất lượng dữ liệu</td></tr>
<tr><td>Có thể dẫn tới phát hiện bất ngờ; dữ liệu tồn tại lâu dài và kiểm tra lại được</td><td>Mục đích ban đầu có thể chi phối cách trình bày dữ liệu</td></tr>
</table>
<h3>Đánh giá dữ liệu thứ cấp</h3>
<ol>
<li><strong>Mức phù hợp tổng thể</strong>: <em>giá trị đo lường</em> — dữ liệu có đo đúng cái bạn cần không? <em>Độ bao phủ</em> — đúng tổng thể, thời kỳ và biến số chưa, có thiếu biến quan trọng nào không?</li>
<li><strong>Mức phù hợp chi tiết</strong>: <em>độ tin cậy và độ giá trị</em> — ai thu thập, bằng cách nào, với mẫu và tỷ lệ phản hồi ra sao? <em>Thiên lệch đo lường</em> — bóp méo có chủ ý (vd doanh nghiệp trình bày kết quả theo hướng có lợi) hoặc thay đổi cách thu thập theo thời gian.</li>
<li><strong>Chi phí và lợi ích</strong>: giá trị của dữ liệu có xứng với chi phí, công sức để có và làm sạch chúng không?</li>
</ol>
<pre><code class="language-text">Bảng kiểm trước khi dùng một bộ dữ liệu thứ cấp (nghiên cứu minh hoạ về doanh thu DNNVV)
[ ] Định nghĩa "DNNVV" khớp với nghiên cứu?        [ ] Thời kỳ bao phủ các năm cần xét?
[ ] Có nêu phương pháp chọn mẫu, tỷ lệ phản hồi?   [ ] Đơn vị (tỷ đồng, triệu USD) và năm gốc rõ?
[ ] Chuỗi số liệu có bị gián đoạn (đổi phương pháp, đổi cách phân loại) không?</code></pre>
<h3>AI và báo cáo thứ cấp</h3>
<p>Công cụ AI có thể tóm tắt nhanh một báo cáo ngành dài — nhưng bản tóm tắt có thể bỏ mất các điều kiện kèm theo, đọc sai bảng hoặc lẫn năm. Luôn đối chiếu từng con số bạn dùng với bảng gốc, và trích dẫn nguồn gốc chứ không trích bản tóm tắt của AI.</p>
<div class="callout"><span class="badge">Mẹo</span> Dữ liệu thứ cấp thường là cách nhanh nhất để mô tả bối cảnh của khoá luận (quy mô thị trường, cấu trúc ngành). Dữ liệu sơ cấp sau đó trả lời câu hỏi mà dữ liệu thứ cấp không trả lời được.</div>`,
  ]]);

const c9 = doc('rmb301-3-4-observation-interviews', '3.4 — Ch 9–10: Observation and interviews|||3.4 — Ch 9–10: Quan sát và phỏng vấn',
  'Ch 9: quan sát tham dự với bốn vai trò, quan sát có cấu trúc và phiếu mã hoá, hiệu ứng người quan sát. Ch 10: phỏng vấn có cấu trúc, bán cấu trúc, sâu, phỏng vấn nhóm và nhóm tập trung, vấn đề chất lượng dữ liệu (thiên lệch), chuẩn bị và kỹ năng phỏng vấn, phỏng vấn trực tuyến, bão hoà.',
  [[
    `<span class="eyebrow">RMB301 · Part 3 · Lesson 3.4</span>
<h2>Observation and interviews</h2>
<h3>Ch 9 — Collecting primary data through observation</h3>
<p>Observation is the systematic viewing, recording, description, analysis and interpretation of people’s behaviour. It captures what people <em>do</em>, not just what they <em>say</em> they do.</p>
<table>
<tr><th></th><th>Researcher takes part in the activity</th><th>Researcher only observes</th></tr>
<tr><td>Identity revealed</td><td><strong>Participant-as-observer</strong> — participates openly as a researcher</td><td><strong>Observer-as-participant</strong> — watches openly without taking part</td></tr>
<tr><td>Identity concealed</td><td><strong>Complete participant</strong> — joins the group without revealing the research purpose</td><td><strong>Complete observer</strong> — watches without taking part and without revealing the purpose</td></tr>
</table>
<p><strong>Participant observation</strong> is mainly qualitative: it seeks the meanings people attach to their actions (e.g., working a shift in a café to understand staff culture). Covert roles raise serious ethical questions about consent and should be justified carefully. <strong>Structured observation</strong> is quantitative: a <em>coding schedule</em> records how often predefined behaviours occur (e.g., greetings, upselling attempts and waiting time at a checkout). Internet-mediated observation of online communities and video recording are also common.</p>
<p>Main threats: <strong>observer effect</strong> (people behave differently when watched — reduced by habituation), <strong>observer error and bias</strong>, and <strong>time error</strong> (observing at unrepresentative times). Pilot the schedule and train observers.</p>
<h3>Ch 10 — Semi-structured, in-depth and group interviews</h3>
<table>
<tr><th>Type</th><th>Features</th><th>Typical use</th></tr>
<tr><td>Structured</td><td>Standardised questions read out in the same order; pre-coded answers</td><td>Quantitative, descriptive surveys (an interviewer-completed questionnaire)</td></tr>
<tr><td>Semi-structured</td><td>A list of themes and key questions; order and wording can vary; probing</td><td>Explanatory and exploratory studies; understanding reasons and relationships</td></tr>
<tr><td>Unstructured (in-depth)</td><td>Informal; the participant talks freely around a topic</td><td>Exploratory research; sensitive or complex experiences</td></tr>
<tr><td>Group interview / focus group</td><td>Several participants discuss a topic led by a moderator; interaction produces data</td><td>Exploring reactions to products, services, campaigns</td></tr>
</table>
<p>Semi-structured and in-depth interviews are appropriate when you need to understand meanings, when questions are complex or open-ended, when the order and logic of questions may need to vary, or when the topic is sensitive and people prefer to talk rather than tick boxes.</p>
<h3>Data quality issues and how to overcome them</h3>
<ul>
<li><strong>Dependability</strong>: non-standardised interviews are not meant to be repeated exactly — keep notes on design, context and decisions so others can follow your process.</li>
<li><strong>Interviewer bias</strong>: tone, comments or non-verbal behaviour that steers answers.</li>
<li><strong>Interviewee (response) bias</strong>: participants may hide sensitive information or give socially desirable answers.</li>
<li><strong>Participation bias</strong>: those willing to give an hour of their time may differ from those who refuse.</li>
<li><strong>Generalisability</strong>: small samples generalise to theory (transferability) rather than to populations.</li>
</ul>
<p>Good practice: prepare an interview guide; send themes in advance when appropriate; choose a quiet, safe location; open by explaining purpose, confidentiality and recording; ask <em>open</em> questions, then <em>probing</em> questions ("Can you give an example?"), then <em>specific or closed</em> questions to confirm facts; listen actively; summarise to test your understanding; audio-record only with permission, and take notes.</p>
<pre><code class="language-text">Interview guide extract (illustrative — first-job turnover study)
Theme 1  Career development
  Open   : Tell me about how your role has developed since you joined.
  Probe  : Can you give an example of a time you felt you were (not) learning?
  Closed : Have you had a formal development review? (yes / no)</code></pre>
<p><strong>Online and telephone interviews</strong> save travel and reach dispersed participants, but rapport and non-verbal cues may be weaker and connection problems can interrupt. Automatic transcription tools save time but make errors, and uploading recordings to external services raises consent and data protection issues. For the number of interviews, aim for <strong>saturation</strong> rather than a fixed quota.</p>
<div class="callout"><span class="badge">Remember</span> The interview guide is a guide, not a script. The best data often come from the follow-up question you did not plan.</div>`,
    `<span class="eyebrow">RMB301 · Phần 3 · Bài 3.4</span>
<h2>Quan sát và phỏng vấn</h2>
<h3>Ch 9 — Thu thập dữ liệu sơ cấp bằng quan sát</h3>
<p>Quan sát là việc xem xét, ghi chép, mô tả, phân tích và diễn giải hành vi của con người một cách có hệ thống. Nó ghi nhận điều con người <em>làm</em>, chứ không chỉ điều họ <em>nói</em> là mình làm.</p>
<table>
<tr><th></th><th>Nhà nghiên cứu tham gia hoạt động</th><th>Nhà nghiên cứu chỉ quan sát</th></tr>
<tr><td>Công khai danh tính</td><td><strong>Người tham gia kiêm quan sát</strong> — tham gia công khai với tư cách nhà nghiên cứu</td><td><strong>Người quan sát kiêm tham gia</strong> — quan sát công khai, không tham gia</td></tr>
<tr><td>Giấu danh tính</td><td><strong>Người tham gia hoàn toàn</strong> — nhập vào nhóm mà không tiết lộ mục đích nghiên cứu</td><td><strong>Người quan sát hoàn toàn</strong> — quan sát, không tham gia và không tiết lộ mục đích</td></tr>
</table>
<p><strong>Quan sát tham dự</strong> chủ yếu mang tính định tính: tìm hiểu ý nghĩa con người gán cho hành động của mình (vd làm một ca ở quán cà phê để hiểu văn hoá của nhân viên). Các vai trò giấu danh tính đặt ra câu hỏi đạo đức nghiêm trọng về sự đồng ý và cần được biện minh thận trọng. <strong>Quan sát có cấu trúc</strong> mang tính định lượng: một <em>phiếu mã hoá</em> ghi lại tần suất xuất hiện của các hành vi đã định sẵn (vd lời chào, số lần mời mua thêm và thời gian chờ ở quầy thu ngân). Quan sát cộng đồng trực tuyến và quay video cũng phổ biến.</p>
<p>Các mối đe doạ chính: <strong>hiệu ứng người quan sát</strong> (con người cư xử khác khi bị theo dõi — giảm bằng cách để họ quen dần), <strong>sai sót và thiên lệch của người quan sát</strong>, và <strong>sai lệch thời điểm</strong> (quan sát vào lúc không đại diện). Hãy thử nghiệm phiếu mã hoá và tập huấn người quan sát.</p>
<h3>Ch 10 — Phỏng vấn bán cấu trúc, phỏng vấn sâu và phỏng vấn nhóm</h3>
<table>
<tr><th>Loại</th><th>Đặc điểm</th><th>Dùng khi</th></tr>
<tr><td>Có cấu trúc</td><td>Câu hỏi chuẩn hoá, đọc theo cùng thứ tự; câu trả lời được mã hoá sẵn</td><td>Khảo sát mô tả, định lượng (bảng hỏi do người phỏng vấn điền)</td></tr>
<tr><td>Bán cấu trúc</td><td>Danh sách chủ đề và câu hỏi chính; thứ tự và cách hỏi có thể thay đổi; có hỏi đào sâu</td><td>Nghiên cứu giải thích và khám phá; tìm hiểu lý do và mối quan hệ</td></tr>
<tr><td>Phi cấu trúc (phỏng vấn sâu)</td><td>Không chính thức; người tham gia nói tự do quanh một chủ đề</td><td>Nghiên cứu khám phá; trải nghiệm nhạy cảm hoặc phức tạp</td></tr>
<tr><td>Phỏng vấn nhóm / nhóm tập trung</td><td>Nhiều người thảo luận một chủ đề do người điều phối dẫn dắt; sự tương tác tạo ra dữ liệu</td><td>Tìm hiểu phản ứng với sản phẩm, dịch vụ, chiến dịch</td></tr>
</table>
<p>Phỏng vấn bán cấu trúc và phỏng vấn sâu phù hợp khi cần hiểu ý nghĩa, khi câu hỏi phức tạp hoặc mở, khi thứ tự và logic câu hỏi có thể phải thay đổi, hoặc khi chủ đề nhạy cảm và người ta muốn kể hơn là đánh dấu vào ô.</p>
<h3>Vấn đề chất lượng dữ liệu và cách khắc phục</h3>
<ul>
<li><strong>Độ tin cậy phụ thuộc</strong>: phỏng vấn không chuẩn hoá vốn không nhằm lặp lại y hệt — hãy ghi chép về thiết kế, bối cảnh và các quyết định để người khác theo dõi được quy trình.</li>
<li><strong>Thiên lệch do người phỏng vấn</strong>: giọng điệu, bình luận hay cử chỉ dẫn dắt câu trả lời.</li>
<li><strong>Thiên lệch do người trả lời</strong>: người tham gia có thể giấu thông tin nhạy cảm hoặc trả lời theo hướng được xã hội ưa chuộng.</li>
<li><strong>Thiên lệch do sự tham gia</strong>: người sẵn lòng dành một giờ có thể khác người từ chối.</li>
<li><strong>Khả năng khái quát hoá</strong>: mẫu nhỏ khái quát hoá về lý thuyết (khả năng chuyển giao) chứ không phải về tổng thể.</li>
</ul>
<p>Thực hành tốt: chuẩn bị bản hướng dẫn phỏng vấn; gửi trước các chủ đề khi phù hợp; chọn địa điểm yên tĩnh, an toàn; mở đầu bằng việc giải thích mục đích, bảo mật và việc ghi âm; hỏi câu <em>mở</em>, rồi câu <em>đào sâu</em> ("Anh/chị cho một ví dụ được không?"), rồi câu <em>cụ thể hoặc đóng</em> để xác nhận sự kiện; lắng nghe chủ động; tóm tắt lại để kiểm tra mình hiểu đúng; chỉ ghi âm khi được phép, và ghi chép tay.</p>
<pre><code class="language-text">Trích bản hướng dẫn phỏng vấn (minh hoạ — nghiên cứu nghỉ việc ở công việc đầu tiên)
Chủ đề 1  Phát triển nghề nghiệp
  Mở      : Anh/chị kể về việc vai trò của mình đã phát triển thế nào kể từ khi vào công ty.
  Đào sâu : Anh/chị cho một ví dụ về lúc cảm thấy mình đang (không) học hỏi được gì?
  Đóng    : Anh/chị đã có buổi đánh giá phát triển chính thức nào chưa? (có / chưa)</code></pre>
<p><strong>Phỏng vấn trực tuyến và qua điện thoại</strong> tiết kiệm đi lại và tiếp cận được người ở xa, nhưng sự gắn kết và tín hiệu phi ngôn ngữ có thể yếu hơn, và sự cố kết nối có thể làm gián đoạn. Công cụ chuyển giọng nói thành văn bản tự động tiết kiệm thời gian nhưng có lỗi, và việc tải bản ghi âm lên dịch vụ bên ngoài đặt ra vấn đề đồng thuận và bảo vệ dữ liệu. Về số cuộc phỏng vấn, hãy hướng tới <strong>bão hoà</strong> thay vì một chỉ tiêu cố định.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Bản hướng dẫn phỏng vấn là để dẫn đường, không phải kịch bản. Dữ liệu tốt nhất thường đến từ câu hỏi nối tiếp mà bạn không định trước.</div>`,
  ]]);

const c11 = doc('rmb301-3-5-questionnaires', '3.5 — Ch 11: Collecting primary data using questionnaires|||3.5 — Ch 11: Thu thập dữ liệu sơ cấp bằng bảng hỏi',
  'Khi nào dùng bảng hỏi, bảng hỏi tự điền (trực tuyến, gửi bưu điện, phát tận tay – thu lại) và do người phỏng vấn điền, ba loại biến dữ liệu, bốn thang đo (định danh, thứ bậc, khoảng, tỷ lệ), các dạng câu hỏi, lỗi thường gặp khi đặt câu hỏi, dịch ngược, độ giá trị và độ tin cậy, thử nghiệm; câu hỏi ôn Phần 3.',
  [[
    `<span class="eyebrow">RMB301 · Part 3 · Lesson 3.5</span>
<h2>Collecting primary data using questionnaires</h2>
<p class="lead">"Questionnaire" covers all techniques in which each person is asked to respond to <strong>the same set of questions in a predetermined order</strong>. It is efficient for large samples and suits descriptive and explanatory research — but you usually get only one chance, so design matters.</p>
<h3>Types of questionnaire</h3>
<table>
<tr><th>Type</th><th>Strengths</th><th>Weaknesses</th></tr>
<tr><td>Self-completed: internet (online, mobile)</td><td>Cheap, fast, large samples, automatic data entry</td><td>Needs internet access; low control over who answers; response rates can be low</td></tr>
<tr><td>Self-completed: postal (mail)</td><td>Reaches people without internet; respondents answer in their own time</td><td>Slow; postage costs; low response rates; no clarification</td></tr>
<tr><td>Self-completed: delivery and collection</td><td>Handed out and collected in person (e.g., in a workplace); higher response rates</td><td>Time-consuming; limited geographical spread</td></tr>
<tr><td>Interviewer-completed: telephone</td><td>Quick; interviewer can clarify; good control</td><td>Shorter questionnaires; no visual aids; costs</td></tr>
<tr><td>Interviewer-completed: face-to-face (structured interview)</td><td>Highest response rates; complex questions possible</td><td>Most expensive; interviewer bias; fewer respondents</td></tr>
</table>
<h3>Types of data variable</h3>
<p>Questionnaires collect three types: <strong>factual or demographic</strong> (age, income, job title), <strong>attitudes and opinions</strong> (how people feel or what they believe), and <strong>behaviours and events</strong> (what people did or do, how often).</p>
<h3>Four measurement scales</h3>
<table>
<tr><th>Scale</th><th>Property</th><th>Example</th><th>Typical statistics</th></tr>
<tr><td>Nominal</td><td>Categories with no order</td><td>Preferred channel: online / in-store / both</td><td>Frequencies, mode, chi-square</td></tr>
<tr><td>Ordinal</td><td>Ordered categories; gaps not equal</td><td>Rank of five brands; "very dissatisfied … very satisfied"</td><td>Median, percentiles, rank tests</td></tr>
<tr><td>Interval</td><td>Equal gaps; no true zero</td><td>Temperature in °C; a summated attitude score</td><td>Mean, standard deviation, correlation</td></tr>
<tr><td>Ratio</td><td>Equal gaps and a true zero</td><td>Monthly spending (VND), age in years, number of purchases</td><td>All of the above, plus ratios ("twice as much")</td></tr>
</table>
<p>A single Likert-type item is strictly ordinal; averages of several items forming a scale are often treated as interval in business research — state this assumption in your method chapter.</p>
<h3>Question types</h3>
<p><strong>Open</strong> (free text), <strong>list</strong> (tick all that apply), <strong>category</strong> (one answer from mutually exclusive categories), <strong>ranking</strong> (order items), <strong>rating</strong> (Likert-type agree–disagree, semantic differential, numeric scales), <strong>quantity</strong> (a number), and <strong>matrix</strong> (a grid of items sharing the same answer scale).</p>
<h3>Common mistakes when writing questions</h3>
<table>
<tr><th>Mistake</th><th>Poor question</th><th>Better</th></tr>
<tr><td>Double-barrelled</td><td>How satisfied are you with the price and quality of our service?</td><td>Two questions: one on price, one on quality</td></tr>
<tr><td>Leading</td><td>Don’t you agree that the new app is easier to use?</td><td>How easy or difficult is the new app to use?</td></tr>
<tr><td>Ambiguous / vague</td><td>Do you shop online regularly?</td><td>In the last 30 days, how many times did you buy online?</td></tr>
<tr><td>Jargon or abbreviations</td><td>Do you value the app’s UX and KYC flow?</td><td>Use plain words: "screen design", "identity check"</td></tr>
<tr><td>Double negative</td><td>I would not prefer not to pay by card.</td><td>I prefer to pay by card.</td></tr>
<tr><td>Overlapping or non-exhaustive categories</td><td>Age: 18–25, 25–30, 30–40</td><td>18–24, 25–29, 30–39, 40 or over</td></tr>
<tr><td>Hypothetical or too demanding recall</td><td>Would you use a wallet that pays 5% cashback? / How much did you spend on coffee last year?</td><td>Ask about actual recent behaviour over a short period</td></tr>
</table>
<h3>Translation, validity, reliability and piloting</h3>
<p>When a scale comes from English literature, use <strong>back-translation</strong>: translate into Vietnamese, have another person translate back into English, compare and fix differences in meaning. Check <strong>validity</strong> — <em>content validity</em> (the items cover the concept, often judged by experts), <em>criterion-related validity</em> (scores predict an outcome) and <em>construct validity</em> (the items measure the intended construct). Check <strong>reliability</strong> — <em>test-retest</em>, <em>internal consistency</em> (Cronbach’s alpha, Exercise 3) and <em>alternative form</em>. Always <strong>pilot test</strong> with a few people like your respondents to catch unclear wording, and time how long it takes.</p>
<h3>Review and discussion questions — Part 3</h3>
<ol>
<li>What is the difference between a sample and a population? Define both for your study.</li>
<li>What is a sampling frame, and what will yours be?</li>
<li>Why do researchers sample rather than survey everyone?</li>
<li>Compare probability and non-probability sampling methods; which will you use and why?</li>
<li>Explain the four measurement scales with an example of each from your questionnaire.</li>
<li>Draft five questions for your questionnaire and check them for common mistakes.</li>
<li>Compare the advantages and disadvantages of online, delivery-and-collection and face-to-face data collection.</li>
<li>When would you choose interviews or observation instead of a questionnaire?</li>
</ol>
<div class="callout"><span class="badge">Tip</span> Borrow established scales from published studies (with citation) instead of inventing items — then adapt wording carefully, back-translate and pilot.</div>`,
    `<span class="eyebrow">RMB301 · Phần 3 · Bài 3.5</span>
<h2>Thu thập dữ liệu sơ cấp bằng bảng hỏi</h2>
<p class="lead">"Bảng hỏi" bao gồm mọi kỹ thuật trong đó mỗi người được đề nghị trả lời <strong>cùng một bộ câu hỏi theo một thứ tự định sẵn</strong>. Bảng hỏi hiệu quả với mẫu lớn, phù hợp nghiên cứu mô tả và giải thích — nhưng thường bạn chỉ có một cơ hội, nên thiết kế rất quan trọng.</p>
<h3>Các loại bảng hỏi</h3>
<table>
<tr><th>Loại</th><th>Điểm mạnh</th><th>Điểm yếu</th></tr>
<tr><td>Tự điền: qua internet (trực tuyến, di động)</td><td>Rẻ, nhanh, mẫu lớn, dữ liệu tự động nhập</td><td>Cần có internet; khó kiểm soát ai trả lời; tỷ lệ phản hồi có thể thấp</td></tr>
<tr><td>Tự điền: gửi qua bưu điện</td><td>Tiếp cận người không dùng internet; người trả lời điền lúc thuận tiện</td><td>Chậm; tốn cước; tỷ lệ phản hồi thấp; không giải thích được khi họ thắc mắc</td></tr>
<tr><td>Tự điền: phát tận tay và thu lại</td><td>Phát và thu trực tiếp (vd tại nơi làm việc); tỷ lệ phản hồi cao hơn</td><td>Tốn thời gian; phạm vi địa lý hẹp</td></tr>
<tr><td>Người phỏng vấn điền: qua điện thoại</td><td>Nhanh; giải thích được; kiểm soát tốt</td><td>Bảng hỏi phải ngắn hơn; không có hình minh hoạ; tốn chi phí</td></tr>
<tr><td>Người phỏng vấn điền: trực tiếp (phỏng vấn có cấu trúc)</td><td>Tỷ lệ phản hồi cao nhất; hỏi được câu phức tạp</td><td>Đắt nhất; thiên lệch do người phỏng vấn; ít người trả lời hơn</td></tr>
</table>
<h3>Các loại biến dữ liệu</h3>
<p>Bảng hỏi thu ba loại: <strong>thông tin thực tế hoặc nhân khẩu học</strong> (tuổi, thu nhập, chức danh), <strong>thái độ và quan điểm</strong> (người ta cảm thấy hay tin điều gì), và <strong>hành vi và sự kiện</strong> (người ta đã làm hay đang làm gì, bao lâu một lần).</p>
<h3>Bốn thang đo lường</h3>
<table>
<tr><th>Thang đo</th><th>Đặc tính</th><th>Ví dụ</th><th>Thống kê thường dùng</th></tr>
<tr><td>Định danh</td><td>Các nhóm không có thứ tự</td><td>Kênh mua ưa thích: trực tuyến / tại cửa hàng / cả hai</td><td>Tần số, mode, chi bình phương</td></tr>
<tr><td>Thứ bậc</td><td>Các nhóm có thứ tự; khoảng cách không bằng nhau</td><td>Xếp hạng năm thương hiệu; "rất không hài lòng … rất hài lòng"</td><td>Trung vị, phân vị, kiểm định dựa trên hạng</td></tr>
<tr><td>Khoảng</td><td>Khoảng cách bằng nhau; không có điểm 0 tuyệt đối</td><td>Nhiệt độ °C; điểm thái độ cộng gộp</td><td>Trung bình, độ lệch chuẩn, tương quan</td></tr>
<tr><td>Tỷ lệ</td><td>Khoảng cách bằng nhau và có điểm 0 thực</td><td>Chi tiêu hằng tháng (đồng), tuổi, số lần mua</td><td>Tất cả các thống kê trên, cộng phép so sánh tỷ số ("gấp đôi")</td></tr>
</table>
<p>Một mục hỏi dạng Likert đơn lẻ về nguyên tắc là thang thứ bậc; trung bình của nhiều mục tạo thành một thang đo thường được coi là thang khoảng trong nghiên cứu kinh doanh — hãy nêu rõ giả định này trong chương phương pháp.</p>
<h3>Các dạng câu hỏi</h3>
<p>Câu hỏi <strong>mở</strong> (trả lời tự do), <strong>danh sách</strong> (chọn mọi phương án phù hợp), <strong>phân loại</strong> (chọn một trong các nhóm loại trừ nhau), <strong>xếp hạng</strong> (sắp thứ tự các mục), <strong>đánh giá</strong> (thang Likert đồng ý – không đồng ý, thang đối nghĩa, thang số), <strong>số lượng</strong> (một con số), và <strong>ma trận</strong> (lưới các mục dùng chung một thang trả lời).</p>
<h3>Lỗi thường gặp khi đặt câu hỏi</h3>
<table>
<tr><th>Lỗi</th><th>Câu hỏi kém</th><th>Tốt hơn</th></tr>
<tr><td>Hai ý trong một câu</td><td>Bạn hài lòng thế nào với giá và chất lượng dịch vụ của chúng tôi?</td><td>Tách hai câu: một về giá, một về chất lượng</td></tr>
<tr><td>Dẫn dắt</td><td>Bạn có đồng ý là ứng dụng mới dễ dùng hơn không?</td><td>Ứng dụng mới dễ hay khó sử dụng ở mức nào?</td></tr>
<tr><td>Mơ hồ</td><td>Bạn có thường xuyên mua sắm trực tuyến không?</td><td>Trong 30 ngày qua, bạn mua trực tuyến bao nhiêu lần?</td></tr>
<tr><td>Thuật ngữ, viết tắt</td><td>Bạn có đánh giá cao UX và luồng KYC của ứng dụng không?</td><td>Dùng từ thông thường: "thiết kế màn hình", "xác minh danh tính"</td></tr>
<tr><td>Phủ định kép</td><td>Tôi không phải là không thích thanh toán bằng thẻ.</td><td>Tôi thích thanh toán bằng thẻ.</td></tr>
<tr><td>Nhóm chồng lấn hoặc không bao quát</td><td>Tuổi: 18–25, 25–30, 30–40</td><td>18–24, 25–29, 30–39, từ 40 trở lên</td></tr>
<tr><td>Giả định hoặc đòi hỏi nhớ quá nhiều</td><td>Bạn có dùng ví hoàn tiền 5% không? / Năm ngoái bạn chi bao nhiêu cho cà phê?</td><td>Hỏi về hành vi thực tế gần đây trong một khoảng thời gian ngắn</td></tr>
</table>
<h3>Dịch thuật, độ giá trị, độ tin cậy và thử nghiệm</h3>
<p>Khi thang đo lấy từ tài liệu tiếng Anh, hãy dùng <strong>dịch ngược</strong>: dịch sang tiếng Việt, nhờ người khác dịch lại sang tiếng Anh, so sánh và sửa những chỗ lệch nghĩa. Kiểm tra <strong>độ giá trị</strong> — <em>giá trị nội dung</em> (các mục bao quát khái niệm, thường do chuyên gia nhận định), <em>giá trị liên hệ tiêu chuẩn</em> (điểm số dự báo được một kết quả) và <em>giá trị cấu trúc</em> (các mục đo đúng khái niệm dự định). Kiểm tra <strong>độ tin cậy</strong> — <em>kiểm tra – kiểm tra lại</em>, <em>nhất quán nội tại</em> (hệ số Cronbach’s alpha, Bài tập 3) và <em>dạng tương đương</em>. Luôn <strong>thử nghiệm</strong> bảng hỏi với vài người giống đối tượng khảo sát để phát hiện câu chữ khó hiểu, và đo thời gian trả lời.</p>
<h3>Câu hỏi ôn tập và thảo luận — Phần 3</h3>
<ol>
<li>Mẫu khác tổng thể thế nào? Xác định cả hai cho nghiên cứu của bạn.</li>
<li>Khung mẫu là gì, và khung mẫu của bạn sẽ là gì?</li>
<li>Vì sao nhà nghiên cứu chọn mẫu thay vì khảo sát tất cả?</li>
<li>So sánh các phương pháp chọn mẫu xác suất và phi xác suất; bạn sẽ dùng phương pháp nào, vì sao?</li>
<li>Giải thích bốn thang đo, mỗi thang một ví dụ lấy từ bảng hỏi của bạn.</li>
<li>Soạn năm câu hỏi cho bảng hỏi của bạn và rà lỗi thường gặp.</li>
<li>So sánh ưu nhược điểm của thu thập trực tuyến, phát tận tay – thu lại và trực tiếp.</li>
<li>Khi nào bạn chọn phỏng vấn hoặc quan sát thay vì bảng hỏi?</li>
</ol>
<div class="callout"><span class="badge">Mẹo</span> Hãy mượn thang đo đã được kiểm chứng trong các nghiên cứu đã công bố (có trích dẫn) thay vì tự nghĩ ra mục hỏi — rồi điều chỉnh câu chữ cẩn thận, dịch ngược và thử nghiệm.</div>`,
  ]]);

const c11e = doc('rmb301-3-6-exercise', 'Exercise 3 — is the scale reliable? Cronbach’s alpha|||Bài tập 3 — thang đo có đáng tin cậy không? Hệ số Cronbach’s alpha',
  'Bài tập: tính Cronbach’s alpha của thang đo 4 mục từ phương sai mục và phương sai tổng giả định, alpha khi loại từng mục, tương quan biến – tổng hiệu chỉnh, diễn giải và quyết định loại mục; kèm lời giải.',
  [[
    `<span class="eyebrow">RMB301 · Part 3 · Exercise</span>
<h2>Exercise 3 — is the scale reliable? Cronbach’s alpha</h2>
<div class="callout"><span class="badge">Problem</span> A fictional pilot study measures "trust in the e-wallet provider" with four 5-point Likert items (T1–T4). The pilot data give: item variances T1 = 0.90, T2 = 1.00, T3 = 0.95, T4 = 1.20; variance of the total score (T1 + T2 + T3 + T4) = 7.85. The variance of the total of the <em>other three</em> items when each item is removed is: without T1 = 4.65, without T2 = 4.49, without T3 = 4.50, without T4 = 6.11. (a) Compute Cronbach’s alpha for the 4-item scale. (b) Compute "alpha if item deleted" for each item. (c) Compute the corrected item–total correlation of T4. (d) Interpret and decide whether to drop an item. (Illustrative data.)</div>
<h3>Worked solution</h3>
<pre><code class="language-text">Formula:  alpha = k / (k − 1) x (1 − sum of item variances / variance of total)

(a) k = 4; sum of item variances = 0.90 + 1.00 + 0.95 + 1.20 = 4.05
    alpha = 4/3 x (1 − 4.05 / 7.85) = 1.3333 x 0.4841 = 0.645

(b) Alpha if item deleted (k = 3):
    without T1: 3/2 x (1 − (1.00 + 0.95 + 1.20) / 4.65) = 1.5 x (1 − 3.15 / 4.65) = 0.484
    without T2: 3/2 x (1 − (0.90 + 0.95 + 1.20) / 4.49) = 1.5 x (1 − 3.05 / 4.49) = 0.481
    without T3: 3/2 x (1 − (0.90 + 1.00 + 1.20) / 4.50) = 1.5 x (1 − 3.10 / 4.50) = 0.467
    without T4: 3/2 x (1 − (0.90 + 1.00 + 0.95) / 6.11) = 1.5 x (1 − 2.85 / 6.11) = 0.800

(c) Var(total) = Var(T4) + Var(rest) + 2 x Cov(T4, rest)
    Cov(T4, rest) = (7.85 − 1.20 − 6.11) / 2 = 0.27
    r(T4, rest)  = 0.27 / sqrt(1.20 x 6.11) = 0.27 / 2.708 = 0.100
    (same method for T1: (7.85 − 0.90 − 4.65) / 2 = 1.15; 1.15 / sqrt(0.90 x 4.65) = 0.562)

(d) alpha = 0.645 is below the common 0.70 rule of thumb.
    Removing T4 raises alpha to 0.800; removing any other item lowers it.
    T4’s corrected item–total correlation (0.10) is well below the usual 0.30 guideline.
    -> Check T4’s wording first (is it reverse-worded and not recoded?).
       If not, drop T4 and use the 3-item scale (alpha = 0.80).</code></pre>
<p><strong>Why:</strong> Cronbach’s alpha measures internal consistency — whether items that are meant to measure the same construct move together. Here T1–T3 hang together well, but T4 barely relates to them, so it adds noise. The 0.70 and 0.30 cut-offs are widely used conventions, not laws; the decision should also consider content validity (does the 3-item scale still cover "trust"?). A very common cause of a low item–total correlation is a negatively worded item that was not reverse-coded before analysis.</p>`,
    `<span class="eyebrow">RMB301 · Phần 3 · Bài tập</span>
<h2>Bài tập 3 — thang đo có đáng tin cậy không? Hệ số Cronbach’s alpha</h2>
<div class="callout"><span class="badge">Đề</span> Một nghiên cứu thử nghiệm (giả định) đo "niềm tin vào nhà cung cấp ví điện tử" bằng bốn mục Likert 5 điểm (T1–T4). Dữ liệu thử nghiệm cho: phương sai mục T1 = 0,90, T2 = 1,00, T3 = 0,95, T4 = 1,20; phương sai của điểm tổng (T1 + T2 + T3 + T4) = 7,85. Phương sai của tổng <em>ba mục còn lại</em> khi bỏ từng mục là: bỏ T1 = 4,65, bỏ T2 = 4,49, bỏ T3 = 4,50, bỏ T4 = 6,11. (a) Tính Cronbach’s alpha của thang đo 4 mục. (b) Tính "alpha nếu loại mục" cho từng mục. (c) Tính tương quan biến – tổng hiệu chỉnh của T4. (d) Diễn giải và quyết định có loại mục nào không. (Dữ liệu minh hoạ.)</div>
<h3>Lời giải</h3>
<pre><code class="language-text">Công thức:  alpha = k / (k − 1) x (1 − tổng phương sai các mục / phương sai điểm tổng)

(a) k = 4; tổng phương sai các mục = 0,90 + 1,00 + 0,95 + 1,20 = 4,05
    alpha = 4/3 x (1 − 4,05 / 7,85) = 1,3333 x 0,4841 = 0,645

(b) Alpha nếu loại mục (k = 3):
    bỏ T1: 3/2 x (1 − (1,00 + 0,95 + 1,20) / 4,65) = 1,5 x (1 − 3,15 / 4,65) = 0,484
    bỏ T2: 3/2 x (1 − (0,90 + 0,95 + 1,20) / 4,49) = 1,5 x (1 − 3,05 / 4,49) = 0,481
    bỏ T3: 3/2 x (1 − (0,90 + 1,00 + 1,20) / 4,50) = 1,5 x (1 − 3,10 / 4,50) = 0,467
    bỏ T4: 3/2 x (1 − (0,90 + 1,00 + 0,95) / 6,11) = 1,5 x (1 − 2,85 / 6,11) = 0,800

(c) Var(tổng) = Var(T4) + Var(phần còn lại) + 2 x Cov(T4, phần còn lại)
    Cov(T4, phần còn lại) = (7,85 − 1,20 − 6,11) / 2 = 0,27
    r(T4, phần còn lại)   = 0,27 / căn(1,20 x 6,11) = 0,27 / 2,708 = 0,100
    (cùng cách cho T1: (7,85 − 0,90 − 4,65) / 2 = 1,15; 1,15 / căn(0,90 x 4,65) = 0,562)

(d) alpha = 0,645, thấp hơn ngưỡng kinh nghiệm phổ biến 0,70.
    Bỏ T4 làm alpha tăng lên 0,800; bỏ bất kỳ mục nào khác đều làm alpha giảm.
    Tương quan biến – tổng hiệu chỉnh của T4 (0,10) thấp hơn nhiều so với ngưỡng 0,30 thường dùng.
    -> Trước hết kiểm tra câu chữ của T4 (có phải câu phủ định mà quên đảo mã không?).
       Nếu không, loại T4 và dùng thang đo 3 mục (alpha = 0,80).</code></pre>
<p><strong>Vì sao:</strong> Cronbach’s alpha đo tính nhất quán nội tại — các mục cùng đo một khái niệm có biến động cùng nhau không. Ở đây T1–T3 gắn kết tốt, còn T4 hầu như không liên quan tới chúng nên chỉ thêm nhiễu. Các ngưỡng 0,70 và 0,30 là quy ước được dùng rộng rãi chứ không phải định luật; quyết định còn phải xét giá trị nội dung (thang 3 mục có còn bao quát "niềm tin" không?). Nguyên nhân rất hay gặp khiến tương quan biến – tổng thấp là một câu hỏi phủ định chưa được đảo mã trước khi phân tích.</p>`,
  ]]);

const q3 = quiz('rmb301-quiz-3', 'Quiz 3 — Sampling & data collection|||Quiz 3 — Chọn mẫu & thu thập dữ liệu', [
  { id: 'q1', question: 'A complete list of all cases in the target population, from which a probability sample is drawn, is called the…|||Danh sách đầy đủ mọi phần tử của tổng thể mục tiêu, dùng để rút mẫu xác suất, được gọi là…', options: ['census|||tổng điều tra', 'sampling frame|||khung mẫu', 'quota|||chỉ tiêu định mức', 'cluster|||cụm'], correctIndex: 1, explanation: 'Probability sampling requires a sampling frame; without one, each case’s chance of selection cannot be known.|||Chọn mẫu xác suất cần có khung mẫu; không có nó thì không biết được xác suất được chọn của mỗi phần tử.' },
  { id: 'q2', question: 'To study informal workers who are hard to reach, a researcher asks each participant to introduce others who meet the criteria. This technique is…|||Để nghiên cứu lao động phi chính thức khó tiếp cận, nhà nghiên cứu nhờ mỗi người tham gia giới thiệu những người khác đáp ứng tiêu chí. Kỹ thuật này là…', options: ['systematic random sampling|||chọn mẫu ngẫu nhiên hệ thống', 'quota sampling|||chọn mẫu định mức', 'snowball sampling|||chọn mẫu quả cầu tuyết', 'cluster sampling|||chọn mẫu theo cụm'], correctIndex: 2, explanation: 'Snowball sampling is a volunteer, non-probability technique in which participants identify further cases — useful when no sampling frame exists.|||Quả cầu tuyết là kỹ thuật phi xác suất dạng tự nguyện, trong đó người tham gia chỉ ra thêm phần tử — hữu ích khi không có khung mẫu.' },
  { id: 'q3', question: 'What is the main problem with the question: "How satisfied are you with the price and quality of our service?"|||Vấn đề chính của câu hỏi "Bạn hài lòng thế nào với giá và chất lượng dịch vụ của chúng tôi?" là gì?', options: ['It is a ranking question|||Đó là câu hỏi xếp hạng', 'It is measured on a ratio scale|||Nó được đo bằng thang tỷ lệ', 'It is a hypothetical question|||Đó là câu hỏi giả định', 'It is a double-barrelled question|||Đó là câu hỏi hai ý trong một'], correctIndex: 3, explanation: 'It asks about two things at once; a respondent happy with quality but not price cannot answer accurately. Split it into two questions.|||Câu hỏi hỏi hai điều cùng lúc; người hài lòng về chất lượng nhưng không hài lòng về giá không thể trả lời chính xác. Hãy tách thành hai câu.' },
]);

const c12 = doc('rmb301-4-1-quantitative-describe', '4.1 — Ch 12 (I): Preparing and describing quantitative data|||4.1 — Ch 12 (I): Chuẩn bị và mô tả dữ liệu định lượng',
  'Ma trận dữ liệu, sổ mã hoá, dữ liệu khuyết, kiểm tra lỗi nhập, đảo mã câu phủ định, chọn bảng và biểu đồ theo thang đo, xu hướng trung tâm (mean, median, mode), độ phân tán (range, phương sai, độ lệch chuẩn, hệ số biến thiên) với ví dụ số có giá trị ngoại lai.',
  [[
    `<span class="eyebrow">RMB301 · Part 4 · Lesson 4.1</span>
<h2>Preparing and describing quantitative data</h2>
<h3>Preparing the data</h3>
<ul>
<li><strong>Data matrix</strong>: one row per case (respondent), one column per variable.</li>
<li><strong>Codebook</strong>: every variable’s name, question, codes (1 = strongly disagree … 5 = strongly agree) and measurement scale.</li>
<li><strong>Missing data</strong>: use a consistent code and record why data are missing (not applicable, refused, don’t know).</li>
<li><strong>Checking</strong>: look for illegitimate codes (a 7 on a 5-point scale), illogical relationships (age 19 with 20 years of work experience) and inconsistent answers.</li>
<li><strong>Reverse-coding</strong>: recode negatively worded items (6 − x on a 5-point scale) before building scale scores.</li>
</ul>
<h3>Choosing tables and charts</h3>
<table>
<tr><th>To show…</th><th>Nominal / ordinal data</th><th>Interval / ratio data</th></tr>
<tr><td>Specific values</td><td>Frequency table</td><td>Frequency table of grouped values</td></tr>
<tr><td>Highest and lowest</td><td>Bar chart</td><td>Histogram</td></tr>
<tr><td>Proportions of a whole</td><td>Pie chart or percentage bar chart</td><td>Grouped pie or bar chart</td></tr>
<tr><td>Trends over time</td><td>—</td><td>Line graph</td></tr>
<tr><td>Distribution and outliers</td><td>—</td><td>Box plot</td></tr>
<tr><td>Relationship between two variables</td><td>Cross-tabulation (contingency table)</td><td>Scatter graph</td></tr>
</table>
<h3>Worked example: weekly coffee spending</h3>
<p>Ten respondents report weekly coffee spending in VND thousand (illustrative data):</p>
<pre><code class="language-text">Data (sorted): 30  35  40  40  40  45  50  55  60  205       n = 10, sum = 600

CENTRAL TENDENCY
Mean   = 600 / 10 = 60.0
Median = average of the 5th and 6th values = (40 + 45) / 2 = 42.5
Mode   = 40 (appears three times)

DISPERSION
Range  = 205 − 30 = 175
Deviations from the mean: −30 −25 −20 −20 −20 −15 −10 −5 0 145
Sum of squared deviations = 900+625+400+400+400+225+100+25+0+21,025 = 24,100
Sample variance  s^2 = 24,100 / (n − 1) = 24,100 / 9 = 2,677.8
Standard deviation s = sqrt(2,677.8) = 51.7
Coefficient of variation = 51.7 / 60.0 = 86.2%

Without the outlier (205): mean 43.9, median 40, SD 9.6</code></pre>
<p>One heavy spender pulls the mean far above the typical value, while the median barely moves. The distribution is <strong>positively skewed</strong> (mean &gt; median). Report the median (and the interquartile range) for skewed data; check whether the outlier is a genuine case or an entry error before deciding what to do.</p>
<table>
<tr><th>Measure</th><th>Suitable scales</th><th>Strength</th><th>Weakness</th></tr>
<tr><td>Mode</td><td>All (only option for nominal)</td><td>Most common value</td><td>May not be unique; ignores other values</td></tr>
<tr><td>Median</td><td>Ordinal, interval, ratio</td><td>Resistant to outliers</td><td>Ignores the size of extreme values</td></tr>
<tr><td>Mean</td><td>Interval, ratio</td><td>Uses every value; basis of most tests</td><td>Distorted by outliers and skew</td></tr>
<tr><td>Range / IQR</td><td>Ordinal (IQR), interval, ratio</td><td>Simple; IQR resists outliers</td><td>Range depends only on two extreme values</td></tr>
<tr><td>Variance / SD</td><td>Interval, ratio</td><td>Uses every value; SD is in the original units</td><td>Sensitive to outliers</td></tr>
</table>
<p>In a spreadsheet: AVERAGE, MEDIAN, MODE.SNGL, VAR.S and STDEV.S (the ".S" versions divide by n − 1 for a sample). Free tools such as jamovi, or SPSS, produce the same statistics with charts. If you ask an AI tool to compute or summarise descriptives, re-check the figures in the spreadsheet — language models can make arithmetic slips.</p>
<div class="callout"><span class="badge">Remember</span> Always describe before you test. Descriptive statistics reveal errors, outliers and skew that would otherwise contaminate every test that follows.</div>`,
    `<span class="eyebrow">RMB301 · Phần 4 · Bài 4.1</span>
<h2>Chuẩn bị và mô tả dữ liệu định lượng</h2>
<h3>Chuẩn bị dữ liệu</h3>
<ul>
<li><strong>Ma trận dữ liệu</strong>: mỗi dòng là một phần tử (người trả lời), mỗi cột là một biến.</li>
<li><strong>Sổ mã hoá</strong>: tên, câu hỏi, các mã (1 = rất không đồng ý … 5 = rất đồng ý) và thang đo của từng biến.</li>
<li><strong>Dữ liệu khuyết</strong>: dùng một mã thống nhất và ghi lý do khuyết (không áp dụng, từ chối, không biết).</li>
<li><strong>Kiểm tra</strong>: tìm mã không hợp lệ (giá trị 7 trên thang 5 điểm), quan hệ phi lý (19 tuổi mà có 20 năm kinh nghiệm) và câu trả lời mâu thuẫn.</li>
<li><strong>Đảo mã</strong>: mã hoá lại các câu phủ định (6 − x với thang 5 điểm) trước khi tính điểm thang đo.</li>
</ul>
<h3>Chọn bảng và biểu đồ</h3>
<table>
<tr><th>Để thể hiện…</th><th>Dữ liệu định danh / thứ bậc</th><th>Dữ liệu khoảng / tỷ lệ</th></tr>
<tr><td>Giá trị cụ thể</td><td>Bảng tần số</td><td>Bảng tần số theo nhóm giá trị</td></tr>
<tr><td>Cao nhất và thấp nhất</td><td>Biểu đồ cột</td><td>Biểu đồ tần suất (histogram)</td></tr>
<tr><td>Tỷ trọng trong tổng thể</td><td>Biểu đồ tròn hoặc cột phần trăm</td><td>Biểu đồ tròn hoặc cột theo nhóm</td></tr>
<tr><td>Xu hướng theo thời gian</td><td>—</td><td>Biểu đồ đường</td></tr>
<tr><td>Phân phối và giá trị ngoại lai</td><td>—</td><td>Biểu đồ hộp</td></tr>
<tr><td>Quan hệ giữa hai biến</td><td>Bảng chéo (bảng ngẫu nhiên)</td><td>Biểu đồ phân tán</td></tr>
</table>
<h3>Ví dụ mẫu: chi tiêu cà phê hằng tuần</h3>
<p>Mười người trả lời cho biết chi tiêu cà phê hằng tuần, đơn vị nghìn đồng (dữ liệu minh hoạ):</p>
<pre><code class="language-text">Dữ liệu (đã sắp xếp): 30  35  40  40  40  45  50  55  60  205    n = 10, tổng = 600

XU HƯỚNG TRUNG TÂM
Trung bình (mean) = 600 / 10 = 60,0
Trung vị (median) = trung bình của giá trị thứ 5 và thứ 6 = (40 + 45) / 2 = 42,5
Yếu vị (mode)     = 40 (xuất hiện ba lần)

ĐỘ PHÂN TÁN
Khoảng biến thiên = 205 − 30 = 175
Độ lệch so với trung bình: −30 −25 −20 −20 −20 −15 −10 −5 0 145
Tổng bình phương độ lệch = 900+625+400+400+400+225+100+25+0+21.025 = 24.100
Phương sai mẫu  s^2 = 24.100 / (n − 1) = 24.100 / 9 = 2.677,8
Độ lệch chuẩn   s = căn(2.677,8) = 51,7
Hệ số biến thiên = 51,7 / 60,0 = 86,2%

Bỏ giá trị ngoại lai (205): trung bình 43,9, trung vị 40, độ lệch chuẩn 9,6</code></pre>
<p>Một người chi nhiều kéo trung bình lên xa hẳn mức điển hình, trong khi trung vị gần như không đổi. Phân phối <strong>lệch phải</strong> (trung bình &gt; trung vị). Với dữ liệu lệch, hãy báo cáo trung vị (và khoảng tứ phân vị); kiểm tra xem giá trị ngoại lai là trường hợp thật hay lỗi nhập liệu trước khi quyết định xử lý.</p>
<table>
<tr><th>Thước đo</th><th>Thang đo phù hợp</th><th>Điểm mạnh</th><th>Điểm yếu</th></tr>
<tr><td>Yếu vị</td><td>Mọi thang (lựa chọn duy nhất cho định danh)</td><td>Giá trị phổ biến nhất</td><td>Có thể không duy nhất; bỏ qua các giá trị khác</td></tr>
<tr><td>Trung vị</td><td>Thứ bậc, khoảng, tỷ lệ</td><td>Ít bị ảnh hưởng bởi ngoại lai</td><td>Bỏ qua độ lớn của giá trị cực trị</td></tr>
<tr><td>Trung bình</td><td>Khoảng, tỷ lệ</td><td>Dùng mọi giá trị; nền tảng của hầu hết kiểm định</td><td>Bị ngoại lai và độ lệch làm sai lệch</td></tr>
<tr><td>Khoảng biến thiên / IQR</td><td>Thứ bậc (IQR), khoảng, tỷ lệ</td><td>Đơn giản; IQR ít bị ngoại lai ảnh hưởng</td><td>Khoảng biến thiên chỉ phụ thuộc hai giá trị cực trị</td></tr>
<tr><td>Phương sai / độ lệch chuẩn</td><td>Khoảng, tỷ lệ</td><td>Dùng mọi giá trị; độ lệch chuẩn có cùng đơn vị với dữ liệu</td><td>Nhạy với ngoại lai</td></tr>
</table>
<p>Trên bảng tính: AVERAGE, MEDIAN, MODE.SNGL, VAR.S và STDEV.S (bản ".S" chia cho n − 1 khi tính trên mẫu). Công cụ miễn phí như jamovi, hoặc SPSS, cho cùng các thống kê này kèm biểu đồ. Nếu nhờ công cụ AI tính hoặc tóm tắt thống kê mô tả, hãy kiểm lại trên bảng tính — mô hình ngôn ngữ có thể tính nhầm.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Luôn mô tả trước khi kiểm định. Thống kê mô tả làm lộ ra lỗi, ngoại lai và độ lệch mà nếu bỏ qua sẽ làm hỏng mọi kiểm định phía sau.</div>`,
  ]]);

const c13 = doc('rmb301-4-2-tests-correlation-regression', '4.2 — Ch 12 (II): Hypothesis testing, correlation and regression|||4.2 — Ch 12 (II): Kiểm định giả thuyết, tương quan và hồi quy',
  'Logic kiểm định giả thuyết, mức ý nghĩa và p-value, sai lầm loại I và II, chọn kiểm định theo loại dữ liệu, hệ số tương quan Pearson và kiểm định ý nghĩa, hồi quy đơn và đọc bảng kết quả hồi quy bội (B, SE, t, p, beta chuẩn hoá, VIF, R², R² hiệu chỉnh, F) theo tinh thần Wooldridge; số liệu giả định.',
  [[
    `<span class="eyebrow">RMB301 · Part 4 · Lesson 4.2</span>
<h2>Hypothesis testing, correlation and regression</h2>
<h3>The logic of hypothesis testing</h3>
<ol>
<li>State H0 (no relationship or difference) and H1.</li>
<li>Choose the significance level α — usually 0.05.</li>
<li>Choose the test that fits your data and question, and compute the test statistic.</li>
<li>Obtain the <strong>p-value</strong>: the probability of a result at least as extreme as the one observed, <em>if H0 were true</em>.</li>
<li>Decide: if p ≤ α, reject H0 — the result is <strong>statistically significant</strong>; if p &gt; α, you <em>fail to reject</em> H0 (you have not "proved" H0).</li>
</ol>
<table>
<tr><th></th><th>H0 actually true</th><th>H0 actually false</th></tr>
<tr><td>Reject H0</td><td><strong>Type I error</strong> (probability α)</td><td>Correct decision</td></tr>
<tr><td>Do not reject H0</td><td>Correct decision</td><td><strong>Type II error</strong> (more likely with small samples)</td></tr>
</table>
<p>Statistical significance is not the same as practical importance: with a very large sample, a tiny effect can be significant. Report an <strong>effect size</strong> (e.g., r, R², Cramér’s V) alongside p.</p>
<h3>Choosing a test</h3>
<table>
<tr><th>Question</th><th>Data</th><th>Test</th></tr>
<tr><td>Are two categorical variables associated?</td><td>Nominal / ordinal</td><td>Chi-square test of independence (Exercise 4)</td></tr>
<tr><td>Do two groups differ?</td><td>Numerical outcome</td><td>Independent-samples t-test (Mann–Whitney U if ordinal or strongly non-normal)</td></tr>
<tr><td>Do three or more groups differ?</td><td>Numerical outcome</td><td>One-way ANOVA (Kruskal–Wallis if ordinal)</td></tr>
<tr><td>How strongly are two variables related?</td><td>Interval / ratio (ranked)</td><td>Pearson’s r (Spearman’s rho)</td></tr>
<tr><td>How do one or more variables predict an outcome?</td><td>Numerical outcome</td><td>Linear regression</td></tr>
</table>
<h3>Correlation: an example with eight stores</h3>
<pre><code class="language-text">Illustrative data   Training hours per employee (x): 2  4  5  6  8  9 11 12
                    Customer satisfaction score (y): 64 70 63 71 69 76 74 79
Means: x̄ = 7.125, ȳ = 70.75;  Sxx = 84.875, Syy = 215.5, Sxy = 114.25
Pearson r = Sxy / sqrt(Sxx x Syy) = 114.25 / sqrt(84.875 x 215.5) = 0.845
Test H0: ρ = 0   t = r x sqrt(n − 2) / sqrt(1 − r^2) = 0.845 x sqrt(6) / sqrt(0.286) = 3.87
Critical t (df = 6, two-tailed, 5%) = 2.447  ->  3.87 &gt; 2.447, reject H0 (p = 0.008)</code></pre>
<p>r ranges from −1 (perfect negative) to +1 (perfect positive); 0 means no <em>linear</em> relationship. A strong, significant r still does not prove that training <em>causes</em> satisfaction — a third variable (e.g., better store managers) might drive both.</p>
<h3>Simple linear regression</h3>
<pre><code class="language-text">b1 = Sxy / Sxx = 114.25 / 84.875 = 1.346        b0 = ȳ − b1 x̄ = 70.75 − 1.346 x 7.125 = 61.16
ŷ = 61.16 + 1.346 x      R^2 = r^2 = 0.714     adjusted R^2 = 0.666
Slope: SE = 0.348, t = 3.87, p = 0.008
Prediction for 10 hours: 61.16 + 1.346 x 10 = 74.6</code></pre>
<p>Each extra training hour is associated with a satisfaction score about 1.35 points higher; training hours explain about 71% of the variation in satisfaction across these stores. Do not extrapolate far beyond the observed range (2–12 hours).</p>
<h3>Reading a multiple regression output</h3>
<p>Following the interpretation in Wooldridge, each coefficient in a multiple regression shows the effect of that variable <strong>holding the other variables constant</strong>. Illustrative output from a survey of n = 150 (dependent variable: intention to use an e-wallet, 1–5 scale):</p>
<table>
<tr><th>Variable</th><th>B</th><th>SE</th><th>Standardised β</th><th>t</th><th>p</th><th>VIF</th></tr>
<tr><td>Constant</td><td>0.497</td><td>0.242</td><td></td><td>2.06</td><td>0.041</td><td></td></tr>
<tr><td>Perceived usefulness (H1)</td><td>0.403</td><td>0.053</td><td>0.497</td><td>7.61</td><td>&lt; 0.001</td><td>1.27</td></tr>
<tr><td>Trust (H2)</td><td>0.277</td><td>0.054</td><td>0.334</td><td>5.11</td><td>&lt; 0.001</td><td>1.28</td></tr>
<tr><td>Perceived price (H3)</td><td>−0.005</td><td>0.043</td><td>−0.007</td><td>−0.12</td><td>0.904</td><td>1.01</td></tr>
</table>
<p>R² = 0.511, adjusted R² = 0.501, F(3, 146) = 50.91, p &lt; 0.001. (t values are computed from unrounded coefficients.)</p>
<ul>
<li><strong>F-test</strong>: the model as a whole explains a significant share of the variance; <strong>adjusted R²</strong> — about 50% of the variation in intention is explained.</li>
<li><strong>H1 supported</strong>: holding trust and price constant, a one-point increase in perceived usefulness is associated with a 0.40-point increase in intention (p &lt; 0.001).</li>
<li><strong>H2 supported</strong>: trust also has a positive, significant effect; the standardised β values show usefulness has the stronger effect.</li>
<li><strong>H3 not supported</strong>: p = 0.904 &gt; 0.05, so there is no evidence that perceived price affects intention in this sample.</li>
<li><strong>VIF</strong> values near 1 suggest no serious multicollinearity (common rules of thumb flag values above 5 or 10). Also check the assumptions: linearity, independence of errors, constant variance (homoscedasticity) and roughly normal residuals — look at residual plots.</li>
</ul>
<div class="callout"><span class="badge">Writing it up</span> "Perceived usefulness had a significant positive effect on intention to use (B = 0.40, p &lt; 0.001), supporting H1." An AI tool can help draft such sentences from your output table — but check that every number matches the output and never ask it to reinterpret a non-significant result as significant.</div>`,
    `<span class="eyebrow">RMB301 · Phần 4 · Bài 4.2</span>
<h2>Kiểm định giả thuyết, tương quan và hồi quy</h2>
<h3>Logic của kiểm định giả thuyết</h3>
<ol>
<li>Phát biểu H0 (không có quan hệ hay khác biệt) và H1.</li>
<li>Chọn mức ý nghĩa α — thường là 0,05.</li>
<li>Chọn kiểm định phù hợp với dữ liệu và câu hỏi, rồi tính thống kê kiểm định.</li>
<li>Tìm <strong>p-value</strong>: xác suất thu được kết quả ít nhất cực đoan như kết quả quan sát được, <em>nếu H0 đúng</em>.</li>
<li>Quyết định: nếu p ≤ α, bác bỏ H0 — kết quả <strong>có ý nghĩa thống kê</strong>; nếu p &gt; α, bạn <em>chưa đủ cơ sở bác bỏ</em> H0 (bạn không "chứng minh" được H0).</li>
</ol>
<table>
<tr><th></th><th>H0 thực sự đúng</th><th>H0 thực sự sai</th></tr>
<tr><td>Bác bỏ H0</td><td><strong>Sai lầm loại I</strong> (xác suất α)</td><td>Quyết định đúng</td></tr>
<tr><td>Không bác bỏ H0</td><td>Quyết định đúng</td><td><strong>Sai lầm loại II</strong> (dễ xảy ra hơn khi mẫu nhỏ)</td></tr>
</table>
<p>Ý nghĩa thống kê không đồng nghĩa với tầm quan trọng thực tiễn: với mẫu rất lớn, một tác động rất nhỏ cũng có thể có ý nghĩa thống kê. Hãy báo cáo <strong>độ lớn tác động</strong> (vd r, R², Cramér’s V) bên cạnh p.</p>
<h3>Chọn kiểm định</h3>
<table>
<tr><th>Câu hỏi</th><th>Dữ liệu</th><th>Kiểm định</th></tr>
<tr><td>Hai biến phân loại có liên hệ không?</td><td>Định danh / thứ bậc</td><td>Kiểm định chi bình phương về tính độc lập (Bài tập 4)</td></tr>
<tr><td>Hai nhóm có khác nhau không?</td><td>Kết quả dạng số</td><td>Kiểm định t mẫu độc lập (Mann–Whitney U nếu dữ liệu thứ bậc hoặc lệch chuẩn mạnh)</td></tr>
<tr><td>Ba nhóm trở lên có khác nhau không?</td><td>Kết quả dạng số</td><td>ANOVA một yếu tố (Kruskal–Wallis nếu thứ bậc)</td></tr>
<tr><td>Hai biến liên hệ mạnh tới đâu?</td><td>Khoảng / tỷ lệ (dạng hạng)</td><td>Hệ số Pearson r (Spearman rho)</td></tr>
<tr><td>Một hay nhiều biến dự báo một kết quả thế nào?</td><td>Kết quả dạng số</td><td>Hồi quy tuyến tính</td></tr>
</table>
<h3>Tương quan: ví dụ với tám cửa hàng</h3>
<pre><code class="language-text">Dữ liệu minh hoạ   Giờ đào tạo mỗi nhân viên (x): 2  4  5  6  8  9 11 12
                   Điểm hài lòng của khách (y):  64 70 63 71 69 76 74 79
Trung bình: x̄ = 7,125, ȳ = 70,75;  Sxx = 84,875, Syy = 215,5, Sxy = 114,25
Pearson r = Sxy / căn(Sxx x Syy) = 114,25 / căn(84,875 x 215,5) = 0,845
Kiểm định H0: ρ = 0   t = r x căn(n − 2) / căn(1 − r^2) = 0,845 x căn(6) / căn(0,286) = 3,87
t tới hạn (df = 6, hai phía, 5%) = 2,447  ->  3,87 &gt; 2,447, bác bỏ H0 (p = 0,008)</code></pre>
<p>r nằm trong khoảng từ −1 (nghịch hoàn hảo) tới +1 (thuận hoàn hảo); 0 nghĩa là không có quan hệ <em>tuyến tính</em>. Một hệ số r mạnh và có ý nghĩa vẫn không chứng minh đào tạo <em>gây ra</em> sự hài lòng — một biến thứ ba (vd cửa hàng trưởng giỏi hơn) có thể tác động tới cả hai.</p>
<h3>Hồi quy tuyến tính đơn</h3>
<pre><code class="language-text">b1 = Sxy / Sxx = 114,25 / 84,875 = 1,346        b0 = ȳ − b1 x̄ = 70,75 − 1,346 x 7,125 = 61,16
ŷ = 61,16 + 1,346 x      R^2 = r^2 = 0,714     R^2 hiệu chỉnh = 0,666
Hệ số góc: SE = 0,348, t = 3,87, p = 0,008
Dự báo với 10 giờ: 61,16 + 1,346 x 10 = 74,6</code></pre>
<p>Mỗi giờ đào tạo tăng thêm gắn với điểm hài lòng cao hơn khoảng 1,35 điểm; số giờ đào tạo giải thích khoảng 71% biến động của điểm hài lòng giữa các cửa hàng này. Không ngoại suy quá xa khỏi khoảng quan sát (2–12 giờ).</p>
<h3>Đọc bảng kết quả hồi quy bội</h3>
<p>Theo cách diễn giải của Wooldridge, mỗi hệ số trong hồi quy bội thể hiện tác động của biến đó <strong>khi giữ các biến khác không đổi</strong>. Kết quả minh hoạ từ một khảo sát n = 150 (biến phụ thuộc: ý định sử dụng ví điện tử, thang 1–5):</p>
<table>
<tr><th>Biến</th><th>B</th><th>SE</th><th>β chuẩn hoá</th><th>t</th><th>p</th><th>VIF</th></tr>
<tr><td>Hằng số</td><td>0,497</td><td>0,242</td><td></td><td>2,06</td><td>0,041</td><td></td></tr>
<tr><td>Cảm nhận tính hữu ích (H1)</td><td>0,403</td><td>0,053</td><td>0,497</td><td>7,61</td><td>&lt; 0,001</td><td>1,27</td></tr>
<tr><td>Niềm tin (H2)</td><td>0,277</td><td>0,054</td><td>0,334</td><td>5,11</td><td>&lt; 0,001</td><td>1,28</td></tr>
<tr><td>Cảm nhận về giá (H3)</td><td>−0,005</td><td>0,043</td><td>−0,007</td><td>−0,12</td><td>0,904</td><td>1,01</td></tr>
</table>
<p>R² = 0,511, R² hiệu chỉnh = 0,501, F(3, 146) = 50,91, p &lt; 0,001. (Giá trị t được tính từ hệ số chưa làm tròn.)</p>
<ul>
<li><strong>Kiểm định F</strong>: mô hình nói chung giải thích được một phần biến động có ý nghĩa; <strong>R² hiệu chỉnh</strong> — khoảng 50% biến động của ý định được giải thích.</li>
<li><strong>H1 được ủng hộ</strong>: giữ niềm tin và giá không đổi, cảm nhận tính hữu ích tăng một điểm gắn với ý định tăng 0,40 điểm (p &lt; 0,001).</li>
<li><strong>H2 được ủng hộ</strong>: niềm tin cũng có tác động dương, có ý nghĩa; hệ số β chuẩn hoá cho thấy tính hữu ích có tác động mạnh hơn.</li>
<li><strong>H3 không được ủng hộ</strong>: p = 0,904 &gt; 0,05, nên không có bằng chứng cảm nhận về giá ảnh hưởng tới ý định trong mẫu này.</li>
<li>Giá trị <strong>VIF</strong> gần 1 cho thấy không có đa cộng tuyến nghiêm trọng (các quy tắc kinh nghiệm phổ biến cảnh báo khi VIF trên 5 hoặc 10). Cũng cần kiểm tra các giả định: tuyến tính, sai số độc lập, phương sai không đổi và phần dư xấp xỉ phân phối chuẩn — hãy xem đồ thị phần dư.</li>
</ul>
<div class="callout"><span class="badge">Viết kết quả</span> "Cảm nhận tính hữu ích có tác động dương, có ý nghĩa tới ý định sử dụng (B = 0,40, p &lt; 0,001), ủng hộ H1." Công cụ AI có thể giúp soạn những câu như vậy từ bảng kết quả — nhưng hãy kiểm từng con số khớp với bảng và không bao giờ yêu cầu nó diễn giải một kết quả không có ý nghĩa thành có ý nghĩa.</div>`,
  ]]);

const c13e = doc('rmb301-4-3-exercise', 'Exercise 4 — chi-square test of independence (2 × 3)|||Bài tập 4 — kiểm định chi bình phương về tính độc lập (2 × 3)',
  'Bài tập: bảng chéo 2 × 3 giả định (nhóm khách hàng × kênh mua ưa thích), tính tần số kỳ vọng, χ², bậc tự do, so với giá trị tới hạn 5,991 ở mức 5%, Cramér’s V và viết đoạn diễn giải chuẩn học thuật; kèm lời giải.',
  [[
    `<span class="eyebrow">RMB301 · Part 4 · Exercise</span>
<h2>Exercise 4 — does preferred channel depend on customer type?</h2>
<div class="callout"><span class="badge">Problem</span> A fictional survey of 200 customers cross-tabulates customer type with preferred purchase channel:<br>Students (n = 120): Online 58, In-store 24, Both 38.<br>Working adults (n = 80): Online 26, In-store 30, Both 24.<br>(a) State H0 and H1. (b) Compute the expected frequencies. (c) Compute χ² and the degrees of freedom and compare with the critical value at α = 0.05. (d) Compute Cramér’s V. (e) Write an academic interpretation. (Illustrative data.)</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) H0: customer type and preferred channel are independent (no association).
    H1: customer type and preferred channel are associated.

(b) Column totals: Online 84, In-store 54, Both 62; N = 200.  E = row total x column total / N
                  Online              In-store            Both
    Students      120x84/200 = 50.4   120x54/200 = 32.4   120x62/200 = 37.2
    Working       80x84/200  = 33.6   80x54/200  = 21.6   80x62/200  = 24.8
    All expected counts ≥ 5 -> the test is appropriate.

(c) χ² = Σ (O − E)^2 / E
    Students : (58−50.4)^2/50.4 = 1.146   (24−32.4)^2/32.4 = 2.178   (38−37.2)^2/37.2 = 0.017
    Working  : (26−33.6)^2/33.6 = 1.719   (30−21.6)^2/21.6 = 3.267   (24−24.8)^2/24.8 = 0.026
    χ² = 8.35      df = (2 − 1) x (3 − 1) = 2
    Critical value χ²(0.05; 2) = 5.991  ->  8.35 &gt; 5.991  ->  reject H0   (p = 0.015)
    (at α = 0.01 the critical value is 9.210, so the result is not significant at 1%)

(d) Cramér’s V = sqrt(χ² / (N x (min(rows, columns) − 1))) = sqrt(8.35 / (200 x 1)) = 0.20

(e) Row percentages: Students 48.3% online, 20.0% in-store, 31.7% both;
                     Working adults 32.5% online, 37.5% in-store, 30.0% both.</code></pre>
<p><strong>Interpretation (academic style):</strong> "A chi-square test of independence indicated a statistically significant association between customer type and preferred purchase channel, χ²(2, N = 200) = 8.35, p = 0.015, Cramér’s V = 0.20. Students were more likely than working adults to prefer online purchasing (48.3% vs 32.5%), whereas working adults more often preferred in-store purchasing (37.5% vs 20.0%). The association is small to moderate in strength."</p>
<p><strong>Why:</strong> the test compares what we observe with what we would expect if the two variables were unrelated. The largest contributions (3.27 and 2.18) come from the in-store column, which tells you where the association lies. A significant χ² shows association, not causation, and Cramér’s V reminds you that "significant" does not mean "strong".</p>`,
    `<span class="eyebrow">RMB301 · Phần 4 · Bài tập</span>
<h2>Bài tập 4 — kênh mua ưa thích có phụ thuộc nhóm khách hàng không?</h2>
<div class="callout"><span class="badge">Đề</span> Một khảo sát (giả định) với 200 khách hàng lập bảng chéo giữa nhóm khách hàng và kênh mua ưa thích:<br>Sinh viên (n = 120): Trực tuyến 58, Tại cửa hàng 24, Cả hai 38.<br>Người đi làm (n = 80): Trực tuyến 26, Tại cửa hàng 30, Cả hai 24.<br>(a) Phát biểu H0 và H1. (b) Tính tần số kỳ vọng. (c) Tính χ² và bậc tự do, so với giá trị tới hạn ở α = 0,05. (d) Tính Cramér’s V. (e) Viết đoạn diễn giải chuẩn học thuật. (Dữ liệu minh hoạ.)</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) H0: nhóm khách hàng và kênh mua ưa thích độc lập với nhau (không có liên hệ).
    H1: nhóm khách hàng và kênh mua ưa thích có liên hệ với nhau.

(b) Tổng cột: Trực tuyến 84, Tại cửa hàng 54, Cả hai 62; N = 200.  E = tổng dòng x tổng cột / N
                  Trực tuyến          Tại cửa hàng        Cả hai
    Sinh viên     120x84/200 = 50,4   120x54/200 = 32,4   120x62/200 = 37,2
    Người đi làm  80x84/200  = 33,6   80x54/200  = 21,6   80x62/200  = 24,8
    Mọi tần số kỳ vọng ≥ 5 -> kiểm định phù hợp.

(c) χ² = Σ (O − E)^2 / E
    Sinh viên   : (58−50,4)^2/50,4 = 1,146   (24−32,4)^2/32,4 = 2,178   (38−37,2)^2/37,2 = 0,017
    Người đi làm: (26−33,6)^2/33,6 = 1,719   (30−21,6)^2/21,6 = 3,267   (24−24,8)^2/24,8 = 0,026
    χ² = 8,35      df = (2 − 1) x (3 − 1) = 2
    Giá trị tới hạn χ²(0,05; 2) = 5,991  ->  8,35 &gt; 5,991  ->  bác bỏ H0   (p = 0,015)
    (ở α = 0,01 giá trị tới hạn là 9,210, nên kết quả không có ý nghĩa ở mức 1%)

(d) Cramér’s V = căn(χ² / (N x (min(số dòng, số cột) − 1))) = căn(8,35 / (200 x 1)) = 0,20

(e) Phần trăm theo dòng: Sinh viên 48,3% trực tuyến, 20,0% tại cửa hàng, 31,7% cả hai;
                         Người đi làm 32,5% trực tuyến, 37,5% tại cửa hàng, 30,0% cả hai.</code></pre>
<p><strong>Diễn giải (văn phong học thuật):</strong> "Kiểm định chi bình phương về tính độc lập cho thấy có mối liên hệ có ý nghĩa thống kê giữa nhóm khách hàng và kênh mua ưa thích, χ²(2, N = 200) = 8,35, p = 0,015, Cramér’s V = 0,20. Sinh viên có xu hướng ưa mua trực tuyến hơn người đi làm (48,3% so với 32,5%), trong khi người đi làm thường ưa mua tại cửa hàng hơn (37,5% so với 20,0%). Mức độ liên hệ ở mức yếu tới trung bình."</p>
<p><strong>Vì sao:</strong> kiểm định so sánh điều ta quan sát được với điều ta kỳ vọng nếu hai biến không liên quan. Các phần đóng góp lớn nhất (3,27 và 2,18) nằm ở cột "tại cửa hàng", cho biết mối liên hệ nằm ở đâu. χ² có ý nghĩa cho thấy có liên hệ chứ không phải quan hệ nhân quả, và Cramér’s V nhắc bạn rằng "có ý nghĩa" không có nghĩa là "mạnh".</p>`,
  ]]);

const c14 = doc('rmb301-4-4-qualitative-analysis', '4.4 — Ch 13: Analysing qualitative data|||4.4 — Ch 13: Phân tích dữ liệu định tính',
  'Bản chất dữ liệu định tính, chuẩn bị (chép lời, ẩn danh), cách tiếp cận suy diễn và quy nạp, các công cụ hỗ trợ, phân tích chủ đề bốn bước, phân tích theo khuôn mẫu, lý thuyết nền, phân tích tự sự, diễn ngôn, nội dung, trình bày dữ liệu dạng ma trận, phần mềm CAQDAS, tiêu chí chất lượng và dùng AI mã hoá có kiểm chứng; câu hỏi ôn Phần 4.',
  [[
    `<span class="eyebrow">RMB301 · Part 4 · Lesson 4.4</span>
<h2>Analysing qualitative data</h2>
<p class="lead">Qualitative data — interview transcripts, notes, documents, images — are non-standardised and rich in meaning. Analysis is <strong>interactive</strong>: collecting, preparing and analysing overlap, and early analysis shapes later data collection.</p>
<h3>Preparing the data</h3>
<ul>
<li><strong>Transcribe</strong> interviews (verbatim where wording matters) and check a sample of the transcript against the recording.</li>
<li><strong>Anonymise</strong>: replace names of people and firms with codes (P1, P2, Firm A).</li>
<li>Keep analytical aids: <strong>interim summaries</strong> after each interview, <strong>self-memos</strong> recording ideas as they occur, and your <strong>reflective diary</strong>.</li>
</ul>
<h3>Deductive or inductive?</h3>
<p>A <strong>deductive</strong> approach starts from theory and uses its concepts as initial codes (e.g., TAM constructs). An <strong>inductive</strong> approach lets codes and themes emerge from the data. Many projects combine the two, as in abduction.</p>
<h3>Thematic analysis — four steps</h3>
<ol>
<li><strong>Become familiar with the data</strong>: read and re-read transcripts, noting initial ideas.</li>
<li><strong>Code the data</strong>: attach labels to units of data (a phrase, a sentence, a paragraph) that carry meaning relevant to your question.</li>
<li><strong>Search for themes and recognise relationships</strong>: group codes into broader themes; look for links between themes.</li>
<li><strong>Refine themes and test propositions</strong>: check themes against the whole dataset, look for negative cases, and develop testable propositions.</li>
</ol>
<pre><code class="language-text">Illustrative coding — first-job turnover interviews
Data extract                                                  Code              Theme
"My manager never gives feedback, I don’t know if I’m good."  lack of feedback  Supervisor support
"I learn the same thing every day for a year."                 no learning       Career development
"My friends at other firms earn 30% more." (P4)                pay comparison    Pay fairness
"Once my manager started weekly 1:1s, I stopped looking."      feedback retains  Supervisor support</code></pre>
<h3>Other analytical techniques</h3>
<table>
<tr><th>Technique</th><th>In brief</th></tr>
<tr><td>Template analysis</td><td>A hierarchical coding template, often partly from theory, revised as analysis proceeds</td></tr>
<tr><td>Explanation building and testing</td><td>Build an explanation, test it against cases, refine it</td></tr>
<tr><td>Analytic induction</td><td>Revise a hypothesis each time a case does not fit, until it explains all cases</td></tr>
<tr><td>Grounded theory method</td><td>Open, axial and selective coding with constant comparison, to generate theory from data</td></tr>
<tr><td>Narrative analysis</td><td>Analyse accounts as whole stories — sequence, turning points, meaning</td></tr>
<tr><td>Discourse analysis</td><td>Examine how language constructs and sustains social reality and power</td></tr>
<tr><td>Content analysis</td><td>Code text into predefined categories and count them — a way of quantifying qualitative data</td></tr>
<tr><td>Data display and analysis</td><td>Summarise data in matrices or networks (e.g., themes × participants) to see patterns</td></tr>
</table>
<h3>Software, quality and AI</h3>
<p><strong>CAQDAS</strong> (computer-assisted qualitative data analysis software) — commercial packages such as NVivo, ATLAS.ti and MAXQDA, or free tools such as Taguette — helps you store, code, search and retrieve data, but <em>you</em> do the thinking. To show quality, report how you ensured <strong>credibility</strong> (e.g., checking interpretations with participants), <strong>dependability</strong> (an audit trail of decisions), <strong>transferability</strong> (thick description of context) and <strong>confirmability</strong>. AI tools can suggest candidate codes or summarise transcripts, but they may miss nuance or even invent quotations: check every quote against the transcript, and never upload identifiable data to a public tool.</p>
<h3>Review and discussion questions — Part 4</h3>
<ol>
<li>Compare the mean, the median and the mode; when would you report each?</li>
<li>Compare the range, variance and standard deviation; why is the SD used more often?</li>
<li>Explain the steps of hypothesis testing and what a p-value means.</li>
<li>What does a correlation coefficient of −0.6 tell you, and what does it not tell you?</li>
<li>How do you interpret a regression coefficient, its p-value and R²?</li>
<li>Describe the four steps of thematic analysis using an example from your topic.</li>
</ol>
<div class="callout"><span class="badge">Remember</span> A theme is not a topic heading. "Pay" is a topic; "young employees judge pay by comparison with peers, not by absolute level" is a theme.</div>`,
    `<span class="eyebrow">RMB301 · Phần 4 · Bài 4.4</span>
<h2>Phân tích dữ liệu định tính</h2>
<p class="lead">Dữ liệu định tính — bản ghi lời phỏng vấn, ghi chép, tài liệu, hình ảnh — không chuẩn hoá và giàu ý nghĩa. Việc phân tích mang tính <strong>tương tác</strong>: thu thập, chuẩn bị và phân tích đan xen nhau, và phân tích sớm định hướng việc thu thập dữ liệu về sau.</p>
<h3>Chuẩn bị dữ liệu</h3>
<ul>
<li><strong>Chép lời</strong> phỏng vấn (nguyên văn khi câu chữ quan trọng) và đối chiếu một phần bản chép với bản ghi âm.</li>
<li><strong>Ẩn danh</strong>: thay tên người và doanh nghiệp bằng mã (P1, P2, Công ty A).</li>
<li>Duy trì các công cụ hỗ trợ phân tích: <strong>tóm tắt tạm thời</strong> sau mỗi cuộc phỏng vấn, <strong>ghi nhớ cho bản thân</strong> (memo) ghi lại ý tưởng ngay khi nảy ra, và <strong>nhật ký phản tư</strong>.</li>
</ul>
<h3>Suy diễn hay quy nạp?</h3>
<p>Cách tiếp cận <strong>suy diễn</strong> xuất phát từ lý thuyết và dùng các khái niệm của nó làm mã ban đầu (vd các khái niệm của TAM). Cách tiếp cận <strong>quy nạp</strong> để mã và chủ đề nảy sinh từ dữ liệu. Nhiều dự án kết hợp cả hai, như trong abductive.</p>
<h3>Phân tích chủ đề — bốn bước</h3>
<ol>
<li><strong>Làm quen với dữ liệu</strong>: đọc đi đọc lại bản chép lời, ghi lại các ý tưởng ban đầu.</li>
<li><strong>Mã hoá dữ liệu</strong>: gắn nhãn cho các đơn vị dữ liệu (một cụm từ, một câu, một đoạn) mang ý nghĩa liên quan tới câu hỏi của bạn.</li>
<li><strong>Tìm chủ đề và nhận diện quan hệ</strong>: gom các mã thành chủ đề rộng hơn; tìm mối liên hệ giữa các chủ đề.</li>
<li><strong>Tinh chỉnh chủ đề và kiểm định mệnh đề</strong>: đối chiếu chủ đề với toàn bộ dữ liệu, tìm các trường hợp ngược, và phát triển các mệnh đề có thể kiểm định.</li>
</ol>
<pre><code class="language-text">Mã hoá minh hoạ — phỏng vấn về nghỉ việc ở công việc đầu tiên
Trích dữ liệu                                                    Mã                 Chủ đề
"Sếp không bao giờ góp ý, em chẳng biết mình làm tốt không."     thiếu phản hồi     Hỗ trợ của quản lý
"Suốt một năm ngày nào em cũng học lại đúng một việc."           không học được gì  Phát triển nghề nghiệp
"Bạn em ở công ty khác lương cao hơn 30%." (P4)                  so sánh lương      Công bằng về lương
"Từ khi sếp họp 1:1 hằng tuần, em thôi tìm việc mới."            phản hồi giữ chân  Hỗ trợ của quản lý</code></pre>
<h3>Các kỹ thuật phân tích khác</h3>
<table>
<tr><th>Kỹ thuật</th><th>Tóm tắt</th></tr>
<tr><td>Phân tích theo khuôn mẫu</td><td>Một khuôn mã hoá phân cấp, thường một phần lấy từ lý thuyết, được sửa dần trong quá trình phân tích</td></tr>
<tr><td>Xây dựng và kiểm định lời giải thích</td><td>Xây một lời giải thích, kiểm định với các tình huống, tinh chỉnh nó</td></tr>
<tr><td>Quy nạp phân tích</td><td>Sửa giả thuyết mỗi khi gặp một tình huống không khớp, cho tới khi giải thích được mọi tình huống</td></tr>
<tr><td>Phương pháp lý thuyết nền</td><td>Mã hoá mở, mã hoá trục và mã hoá chọn lọc cùng so sánh liên tục để tạo lập lý thuyết từ dữ liệu</td></tr>
<tr><td>Phân tích tự sự</td><td>Phân tích lời kể như những câu chuyện trọn vẹn — trình tự, bước ngoặt, ý nghĩa</td></tr>
<tr><td>Phân tích diễn ngôn</td><td>Xem xét ngôn ngữ kiến tạo và duy trì thực tại xã hội, quyền lực như thế nào</td></tr>
<tr><td>Phân tích nội dung</td><td>Mã hoá văn bản theo các nhóm định sẵn và đếm — một cách định lượng hoá dữ liệu định tính</td></tr>
<tr><td>Trình bày và phân tích dữ liệu</td><td>Tóm tắt dữ liệu thành ma trận hoặc mạng lưới (vd chủ đề × người tham gia) để thấy quy luật</td></tr>
</table>
<h3>Phần mềm, chất lượng và AI</h3>
<p><strong>CAQDAS</strong> (phần mềm hỗ trợ phân tích dữ liệu định tính) — các gói thương mại như NVivo, ATLAS.ti, MAXQDA, hoặc công cụ miễn phí như Taguette — giúp lưu trữ, mã hoá, tìm kiếm và truy xuất dữ liệu, nhưng việc tư duy là của <em>bạn</em>. Để chứng tỏ chất lượng, hãy báo cáo cách bạn bảo đảm <strong>độ khả tín</strong> (vd kiểm tra cách diễn giải với người tham gia), <strong>độ tin cậy phụ thuộc</strong> (hồ sơ lưu vết các quyết định), <strong>khả năng chuyển giao</strong> (mô tả bối cảnh chi tiết) và <strong>khả năng xác nhận</strong>. Công cụ AI có thể gợi ý mã hoặc tóm tắt bản chép lời, nhưng có thể bỏ sót sắc thái hay thậm chí bịa ra lời trích dẫn: hãy đối chiếu từng câu trích với bản chép lời, và không bao giờ tải dữ liệu nhận diện được lên công cụ công cộng.</p>
<h3>Câu hỏi ôn tập và thảo luận — Phần 4</h3>
<ol>
<li>So sánh trung bình, trung vị và yếu vị; khi nào báo cáo từng thước đo?</li>
<li>So sánh khoảng biến thiên, phương sai và độ lệch chuẩn; vì sao độ lệch chuẩn được dùng nhiều hơn?</li>
<li>Giải thích các bước kiểm định giả thuyết và ý nghĩa của p-value.</li>
<li>Hệ số tương quan −0,6 cho bạn biết điều gì, và không cho biết điều gì?</li>
<li>Diễn giải một hệ số hồi quy, p-value của nó và R² thế nào?</li>
<li>Mô tả bốn bước phân tích chủ đề bằng một ví dụ từ đề tài của bạn.</li>
</ol>
<div class="callout"><span class="badge">Ghi nhớ</span> Chủ đề (theme) không phải là tiêu đề mục. "Lương" là một đề mục; "nhân viên trẻ đánh giá lương bằng cách so với bạn bè chứ không theo mức tuyệt đối" mới là một chủ đề.</div>`,
  ]]);

const q4 = quiz('rmb301-quiz-4', 'Quiz 4 — Analysing data|||Quiz 4 — Phân tích dữ liệu', [
  { id: 'q1', question: 'For the data 2, 3, 3, 5, 12, which statement is correct?|||Với dữ liệu 2, 3, 3, 5, 12, phát biểu nào đúng?', options: ['mean 3, median 5, mode 3|||trung bình 3, trung vị 5, yếu vị 3', 'mean 5, median 5, mode 12|||trung bình 5, trung vị 5, yếu vị 12', 'mean 5, median 3, mode 3|||trung bình 5, trung vị 3, yếu vị 3', 'mean 5, median 3, mode 5|||trung bình 5, trung vị 3, yếu vị 5'], correctIndex: 2, explanation: 'Mean = 25 / 5 = 5; the middle (3rd) value is 3; 3 appears most often. The outlier 12 pulls the mean above the median.|||Trung bình = 25 / 5 = 5; giá trị ở giữa (thứ 3) là 3; 3 xuất hiện nhiều nhất. Giá trị ngoại lai 12 kéo trung bình lên trên trung vị.' },
  { id: 'q2', question: 'A regression coefficient has p = 0.03 and the significance level is 0.05. The correct conclusion is…|||Một hệ số hồi quy có p = 0,03 với mức ý nghĩa 0,05. Kết luận đúng là…', options: ['H1 has been proved true|||H1 đã được chứng minh là đúng', 'reject H0 that the coefficient is zero: the effect is statistically significant|||bác bỏ H0 rằng hệ số bằng 0: tác động có ý nghĩa thống kê', 'fail to reject H0 because 0.03 is small|||không bác bỏ H0 vì 0,03 là nhỏ', 'the effect must be large and important|||tác động chắc chắn lớn và quan trọng'], correctIndex: 1, explanation: 'Since p ≤ α we reject H0. Significance does not prove H1 and says nothing by itself about the size of the effect.|||Vì p ≤ α nên bác bỏ H0. Có ý nghĩa thống kê không chứng minh H1 và tự nó không nói gì về độ lớn của tác động.' },
  { id: 'q3', question: 'In thematic analysis, attaching labels to units of data that carry meaning relevant to the research question is called…|||Trong phân tích chủ đề, việc gắn nhãn cho các đơn vị dữ liệu mang ý nghĩa liên quan tới câu hỏi nghiên cứu được gọi là…', options: ['coding|||mã hoá', 'weighting|||gán trọng số', 'sampling|||chọn mẫu', 'triangulation|||kiểm tra chéo (triangulation)'], correctIndex: 0, explanation: 'Coding is the second step of thematic analysis; codes are then grouped into themes.|||Mã hoá là bước thứ hai của phân tích chủ đề; các mã sau đó được gom thành chủ đề.' },
]);

const c15 = doc('rmb301-5-1-writing-presenting', '5.1 — Ch 14: Writing and presenting your project report|||5.1 — Ch 14: Viết và trình bày báo cáo dự án',
  'Viết như một cách tư duy, cấu trúc báo cáo truyền thống, bốn yếu tố của bản tóm tắt, văn phong và trích dẫn, cấu trúc đề cương hoàn chỉnh GA3 nối GA1–GA2, liên hệ khoá luận tốt nghiệp khối kinh tế, thuyết trình và bảo vệ đề cương (CLO4).',
  [[
    `<span class="eyebrow">RMB301 · Part 5 · Lesson 5.1</span>
<h2>Writing and presenting your project report</h2>
<h3>Writing is part of thinking</h3>
<p>Do not wait until the analysis is finished. Start writing early, write regularly in small sections, and share drafts with your supervisor or group. Writing reveals gaps in your argument while there is still time to fix them. Keep backups and a consistent file structure.</p>
<h3>A traditional report structure</h3>
<table>
<tr><th>Section</th><th>What it does</th></tr>
<tr><td>Title page, acknowledgements</td><td>Precise title that reflects the question; thanks to those who helped</td></tr>
<tr><td>Abstract</td><td>Short, self-contained summary of the whole project</td></tr>
<tr><td>Contents, lists of figures and tables</td><td>Navigation</td></tr>
<tr><td>Introduction</td><td>Background, research problem, questions and objectives, scope, structure of the report</td></tr>
<tr><td>Literature review</td><td>Critical review leading to the framework and hypotheses</td></tr>
<tr><td>Method</td><td>Philosophy, approach, design, sampling, data collection, analysis, reliability and validity, ethics — with justification</td></tr>
<tr><td>Results / findings</td><td>What the data show, presented clearly, without over-interpreting</td></tr>
<tr><td>Discussion</td><td>What the findings mean, compared with the literature</td></tr>
<tr><td>Conclusions</td><td>Answers to each research question, contribution, implications or recommendations, limitations, further research</td></tr>
<tr><td>References, appendices</td><td>Every cited source in one style; instruments, consent forms, extra tables</td></tr>
</table>
<p>A good <strong>abstract</strong> answers four questions: What were the main issues and purpose? How did you go about it (method)? What did you find? What are the conclusions and implications? Write it last and keep to the required length.</p>
<h3>Style</h3>
<ul>
<li>Clear, simple sentences; define key terms; avoid unexplained jargon and abbreviations.</li>
<li>Use tense consistently (past tense for what you did and found is common).</li>
<li>Whether you write "I" or use the passive voice depends on your philosophy and your university’s guidance — interpretivist studies often use the first person.</li>
<li>Use non-discriminatory language, protect anonymity, and link every conclusion back to evidence.</li>
<li>Reference consistently (APA or Harvard); paraphrase and cite — never copy without quotation marks and a reference.</li>
</ul>
<h3>GA3 — the complete research proposal</h3>
<table>
<tr><th>Proposal section</th><th>Built from</th></tr>
<tr><td>Title; background and rationale; research problem</td><td>GA1, revised</td></tr>
<tr><td>Research questions and objectives; scope</td><td>GA1, revised</td></tr>
<tr><td>Literature review summary; theoretical framework and hypotheses</td><td>GA2, condensed</td></tr>
<tr><td>Methodology: philosophy, approach, design and strategy, time horizon, sampling (with sample size), instrument (draft questionnaire or interview guide), analysis plan, reliability and validity, ethics and access</td><td>Parts 2–4 of this course</td></tr>
<tr><td>Expected contribution and limitations</td><td>Your judgement</td></tr>
<tr><td>Timeline (Gantt chart) and resources</td><td>Ch 2 planning</td></tr>
<tr><td>Proposed thesis structure (chapters)</td><td>The structure above</td></tr>
<tr><td>References and appendices</td><td>Zotero library; draft instruments</td></tr>
</table>
<h3>From proposal to graduation thesis</h3>
<p>The syllabus refers to FPT University’s graduation thesis guideline for business and economics (Decision 870/QĐ-ĐHFPT, 2021) and the graduation-thesis course syllabi (GRx491). A common thesis structure is: introduction → literature review → methodology → results or findings → discussion, conclusions and recommendations. Always follow the <strong>current official guideline on FLM</strong>, which takes precedence over any general template, including this one.</p>
<h3>Presenting and defending the proposal (CLO4)</h3>
<ul>
<li><strong>Plan</strong>: know your audience and time limit; one clear storyline — problem → questions → theory → method → expected results and timeline.</li>
<li><strong>Slides</strong>: one idea per slide, few words, the framework as a diagram, readable tables; a summary poster works on the same principles.</li>
<li><strong>Rehearse</strong> aloud and time yourself; share speaking parts in a group so transitions are smooth.</li>
<li><strong>Anticipate questions</strong>: Why this topic? Why this theory? Why this sample size and technique? How will you handle ethics? What are the limitations?</li>
<li><strong>Answer honestly</strong>: acknowledge limitations and explain how you will address them; do not claim more than your design can deliver.</li>
</ul>
<div class="callout"><span class="badge">Tip</span> Examiners read the abstract, the research questions and the conclusions first. If those three agree with each other, the rest of the report is read in a positive light.</div>`,
    `<span class="eyebrow">RMB301 · Phần 5 · Bài 5.1</span>
<h2>Viết và trình bày báo cáo dự án</h2>
<h3>Viết là một phần của tư duy</h3>
<p>Đừng đợi phân tích xong mới viết. Hãy bắt đầu viết sớm, viết đều đặn từng phần nhỏ, và chia sẻ bản nháp với người hướng dẫn hoặc với nhóm. Việc viết làm lộ ra những lỗ hổng trong lập luận khi vẫn còn thời gian để sửa. Luôn sao lưu và giữ cấu trúc thư mục nhất quán.</p>
<h3>Cấu trúc báo cáo truyền thống</h3>
<table>
<tr><th>Phần</th><th>Chức năng</th></tr>
<tr><td>Trang bìa, lời cảm ơn</td><td>Tên đề tài chính xác, phản ánh câu hỏi; cảm ơn những người đã giúp đỡ</td></tr>
<tr><td>Tóm tắt</td><td>Bản tóm tắt ngắn, độc lập, về toàn bộ dự án</td></tr>
<tr><td>Mục lục, danh mục hình và bảng</td><td>Điều hướng</td></tr>
<tr><td>Giới thiệu</td><td>Bối cảnh, vấn đề nghiên cứu, câu hỏi và mục tiêu, phạm vi, cấu trúc báo cáo</td></tr>
<tr><td>Tổng quan tài liệu</td><td>Tổng quan phê phán dẫn tới khung nghiên cứu và giả thuyết</td></tr>
<tr><td>Phương pháp</td><td>Triết lý, cách tiếp cận, thiết kế, chọn mẫu, thu thập và phân tích dữ liệu, độ tin cậy và độ giá trị, đạo đức — có biện minh</td></tr>
<tr><td>Kết quả / phát hiện</td><td>Dữ liệu cho thấy điều gì, trình bày rõ ràng, không diễn giải quá mức</td></tr>
<tr><td>Thảo luận</td><td>Ý nghĩa của kết quả, so sánh với các nghiên cứu trước</td></tr>
<tr><td>Kết luận</td><td>Trả lời từng câu hỏi nghiên cứu, đóng góp, hàm ý hay khuyến nghị, hạn chế, hướng nghiên cứu tiếp</td></tr>
<tr><td>Tài liệu tham khảo, phụ lục</td><td>Mọi nguồn được trích theo một chuẩn; công cụ đo, phiếu đồng thuận, bảng bổ sung</td></tr>
</table>
<p>Một <strong>bản tóm tắt</strong> tốt trả lời bốn câu hỏi: Vấn đề và mục đích chính là gì? Bạn đã tiến hành thế nào (phương pháp)? Bạn phát hiện ra gì? Kết luận và hàm ý là gì? Hãy viết nó sau cùng và giữ đúng độ dài quy định.</p>
<h3>Văn phong</h3>
<ul>
<li>Câu rõ ràng, đơn giản; định nghĩa thuật ngữ then chốt; tránh biệt ngữ và viết tắt không giải thích.</li>
<li>Dùng thì nhất quán (thì quá khứ cho những gì bạn đã làm và đã phát hiện là phổ biến).</li>
<li>Viết ở ngôi thứ nhất hay dùng câu bị động tuỳ triết lý nghiên cứu và hướng dẫn của trường — nghiên cứu theo trường phái diễn giải thường dùng ngôi thứ nhất.</li>
<li>Dùng ngôn ngữ không phân biệt đối xử, bảo vệ tính ẩn danh, và gắn mọi kết luận với bằng chứng.</li>
<li>Trích dẫn nhất quán (APA hoặc Harvard); diễn đạt lại và ghi nguồn — không bao giờ chép mà không có ngoặc kép và trích dẫn.</li>
</ul>
<h3>GA3 — đề cương nghiên cứu hoàn chỉnh</h3>
<table>
<tr><th>Phần của đề cương</th><th>Được xây từ</th></tr>
<tr><td>Tên đề tài; bối cảnh và lý do chọn đề tài; vấn đề nghiên cứu</td><td>GA1, đã chỉnh sửa</td></tr>
<tr><td>Câu hỏi và mục tiêu nghiên cứu; phạm vi</td><td>GA1, đã chỉnh sửa</td></tr>
<tr><td>Tóm lược tổng quan tài liệu; khung lý thuyết và giả thuyết</td><td>GA2, rút gọn</td></tr>
<tr><td>Phương pháp: triết lý, cách tiếp cận, thiết kế và chiến lược, khung thời gian, chọn mẫu (kèm cỡ mẫu), công cụ (bảng hỏi hoặc hướng dẫn phỏng vấn dự thảo), kế hoạch phân tích, độ tin cậy và độ giá trị, đạo đức và quyền tiếp cận</td><td>Phần 2–4 của môn học</td></tr>
<tr><td>Đóng góp dự kiến và hạn chế</td><td>Nhận định của bạn</td></tr>
<tr><td>Tiến độ (biểu đồ Gantt) và nguồn lực</td><td>Lập kế hoạch ở Ch 2</td></tr>
<tr><td>Cấu trúc khoá luận dự kiến (các chương)</td><td>Cấu trúc ở trên</td></tr>
<tr><td>Tài liệu tham khảo và phụ lục</td><td>Thư viện Zotero; công cụ đo dự thảo</td></tr>
</table>
<h3>Từ đề cương tới khoá luận tốt nghiệp</h3>
<p>Đề cương môn học dẫn chiếu hướng dẫn làm khoá luận tốt nghiệp khối kinh tế của Trường Đại học FPT (Quyết định 870/QĐ-ĐHFPT, 2021) và đề cương các môn khoá luận (GRx491). Cấu trúc khoá luận thường gặp là: giới thiệu → tổng quan tài liệu → phương pháp nghiên cứu → kết quả hoặc phát hiện → thảo luận, kết luận và khuyến nghị. Luôn tuân theo <strong>hướng dẫn chính thức hiện hành trên FLM</strong>, văn bản này có giá trị cao hơn mọi mẫu chung, kể cả mẫu ở đây.</p>
<h3>Trình bày và bảo vệ đề cương (CLO4)</h3>
<ul>
<li><strong>Lập kế hoạch</strong>: biết người nghe và giới hạn thời gian; một mạch chuyện rõ ràng — vấn đề → câu hỏi → lý thuyết → phương pháp → kết quả dự kiến và tiến độ.</li>
<li><strong>Slide</strong>: mỗi slide một ý, ít chữ, khung nghiên cứu dạng sơ đồ, bảng dễ đọc; một poster tóm tắt cũng theo đúng các nguyên tắc này.</li>
<li><strong>Tập nói</strong> thành tiếng và bấm giờ; chia phần nói trong nhóm để chuyển tiếp mượt mà.</li>
<li><strong>Dự đoán câu hỏi</strong>: Vì sao chọn đề tài này? Vì sao chọn lý thuyết này? Vì sao cỡ mẫu và kỹ thuật này? Xử lý vấn đề đạo đức thế nào? Hạn chế là gì?</li>
<li><strong>Trả lời trung thực</strong>: thừa nhận hạn chế và nêu cách khắc phục; đừng tuyên bố nhiều hơn những gì thiết kế của bạn làm được.</li>
</ul>
<div class="callout"><span class="badge">Mẹo</span> Hội đồng thường đọc tóm tắt, câu hỏi nghiên cứu và kết luận trước tiên. Nếu ba phần đó khớp nhau, phần còn lại của báo cáo sẽ được đọc với con mắt thiện cảm.</div>`,
  ]]);

const c16 = doc('rmb301-5-2-ai-integrity', '5.2 — Using AI responsibly across the research project|||5.2 — Dùng AI có trách nhiệm trong suốt dự án nghiên cứu',
  'Tích hợp AI đúng tinh thần đề cương: AI hỗ trợ ở từng giai đoạn (đề tài, tìm nguồn, thiết kế công cụ, tóm tắt kết quả) kèm rủi ro và bước kiểm chứng, mẫu câu lệnh, quy trình kiểm chứng tài liệu tham khảo, quy tắc liêm chính học thuật, mẫu tuyên bố sử dụng AI; câu hỏi ôn Phần 5.',
  [[
    `<span class="eyebrow">RMB301 · Part 5 · Lesson 5.2</span>
<h2>Using AI responsibly across the research project</h2>
<p class="lead">The RMB301 syllabus integrates AI tools to help generate and refine topics, suggest content, work on discussion questions, identify credible sources, and summarise findings using structured data and templates. Used well, AI is a fast research assistant. Used badly, it produces confident, fluent, <strong>wrong</strong> text — and the responsibility is always yours.</p>
<h3>Where AI helps — and how to check it</h3>
<table>
<tr><th>Stage</th><th>Good use</th><th>Risk</th><th>Your verification step</th></tr>
<tr><td>Topic (Ch 2)</td><td>Brainstorm angles; critique a question with the Goldilocks test</td><td>Generic, already-studied topics</td><td>Search Google Scholar; discuss with your lecturer</td></tr>
<tr><td>Literature (Ch 3)</td><td>Suggest keywords and Boolean strings; summarise articles you provide</td><td><strong>Fabricated references</strong>; wrong summaries</td><td>Locate and read every source yourself</td></tr>
<tr><td>Design and instruments (Ch 4–11)</td><td>Critique a draft questionnaire for double-barrelled or leading items; explain a concept</td><td>Invented "validated scales"; wrong definitions</td><td>Use scales from published studies; check against the textbook</td></tr>
<tr><td>Analysis (Ch 12–13)</td><td>Explain an output table; suggest candidate codes</td><td>Arithmetic errors; invented quotes; missed nuance</td><td>Recompute in software; check quotes against transcripts</td></tr>
<tr><td>Writing (Ch 14)</td><td>Improve clarity of your own paragraph; check structure</td><td>Text that is not your own work; lost meaning</td><td>Follow your university’s AI policy; disclose use</td></tr>
</table>
<h3>Prompt patterns that work</h3>
<pre><code class="language-text">Context + role + task + constraints + output format
1. "I am a business student in Vietnam. My interest is Gen Z e-wallet use. Suggest 8 research
   angles, each with one possible theory and one data source. Mark which are feasible for a
   one-semester student survey."
2. "Here is my research question: [...]. Critique it using the Goldilocks test and suggest
   a narrower version. Do not write the proposal for me."
3. "Suggest synonyms and a Boolean search string for: trust, e-wallet, adoption, students."
4. "Here is my regression output table: [...]. Explain what each column means. Do not
   change any number."</code></pre>
<h3>Verifying a reference an AI suggests</h3>
<ol>
<li>Search the exact title on Google Scholar or the publisher’s site.</li>
<li>If a DOI is given, resolve it at doi.org and check that the authors, year and journal match.</li>
<li>Read at least the abstract — ideally the full text — and confirm it says what you will cite it for.</li>
<li>Only then add it to your reference manager (e.g., Zotero). If you cannot find it, it does not exist for your report.</li>
</ol>
<h3>Academic integrity rules</h3>
<ul>
<li><strong>Authorship</strong>: the ideas, analysis and final wording you submit must be your own; AI cannot be an author.</li>
<li><strong>Disclosure</strong>: state how you used AI, in the form your lecturer or the university requires.</li>
<li><strong>No fabrication or falsification</strong>: never let AI generate data, responses, quotations or references.</li>
<li><strong>Privacy</strong>: never paste identifiable respondent data or confidential company information into public AI tools (see Ch 6).</li>
<li><strong>Accountability</strong>: citing a non-existent source is misconduct even if an AI tool produced it.</li>
</ul>
<pre><code class="language-text">Example disclosure statement (adapt to your lecturer’s requirements)
"We used an AI chatbot to brainstorm topic angles and to check our draft questionnaire for
unclear wording. All sources were located and read by the authors; all analysis was carried
out in jamovi by the authors; no respondent data were shared with AI tools."</code></pre>
<h3>Review and discussion questions — Part 5</h3>
<ol>
<li>What four questions should an abstract answer? Draft one for your proposal.</li>
<li>Which sections of GA3 come from GA1 and GA2, and what must be added?</li>
<li>List five questions an examiner is likely to ask at your defence, and prepare answers.</li>
<li>For each stage of your project, where could AI help, and how will you verify its output?</li>
<li>Why is citing an AI-fabricated reference an integrity problem even if it was unintentional?</li>
</ol>
<div class="callout"><span class="badge">Rule of thumb</span> Use AI to think faster, not to think less. If you cannot explain and defend a sentence without the AI, it should not be in your report.</div>`,
    `<span class="eyebrow">RMB301 · Phần 5 · Bài 5.2</span>
<h2>Dùng AI có trách nhiệm trong suốt dự án nghiên cứu</h2>
<p class="lead">Đề cương RMB301 tích hợp công cụ AI để hỗ trợ sinh và tinh chỉnh đề tài, gợi ý nội dung, làm câu hỏi thảo luận, xác định nguồn đáng tin cậy, và tóm tắt kết quả bằng dữ liệu và biểu mẫu có cấu trúc. Dùng đúng, AI là một trợ lý nghiên cứu nhanh nhạy. Dùng sai, nó tạo ra văn bản tự tin, trôi chảy nhưng <strong>sai</strong> — và trách nhiệm luôn thuộc về bạn.</p>
<h3>AI giúp ở đâu — và kiểm chứng thế nào</h3>
<table>
<tr><th>Giai đoạn</th><th>Cách dùng tốt</th><th>Rủi ro</th><th>Bước kiểm chứng của bạn</th></tr>
<tr><td>Đề tài (Ch 2)</td><td>Động não các góc tiếp cận; phản biện câu hỏi bằng phép thử Goldilocks</td><td>Đề tài chung chung, đã được nghiên cứu nhiều</td><td>Tìm trên Google Scholar; trao đổi với giảng viên</td></tr>
<tr><td>Tổng quan tài liệu (Ch 3)</td><td>Gợi ý từ khoá và chuỗi Boolean; tóm tắt bài báo bạn đưa vào</td><td><strong>Tài liệu tham khảo bịa</strong>; tóm tắt sai</td><td>Tự tìm và đọc từng nguồn</td></tr>
<tr><td>Thiết kế và công cụ (Ch 4–11)</td><td>Rà bảng hỏi dự thảo tìm câu hai ý hay câu dẫn dắt; giải thích một khái niệm</td><td>"Thang đo đã kiểm định" bịa ra; định nghĩa sai</td><td>Dùng thang đo từ nghiên cứu đã công bố; đối chiếu giáo trình</td></tr>
<tr><td>Phân tích (Ch 12–13)</td><td>Giải thích bảng kết quả; gợi ý mã ban đầu</td><td>Tính sai; bịa lời trích; bỏ sót sắc thái</td><td>Tính lại bằng phần mềm; đối chiếu lời trích với bản chép lời</td></tr>
<tr><td>Viết (Ch 14)</td><td>Làm rõ đoạn văn của chính bạn; rà cấu trúc</td><td>Văn bản không phải công sức của bạn; lệch nghĩa</td><td>Tuân thủ quy định về AI của trường; công khai việc sử dụng</td></tr>
</table>
<h3>Những mẫu câu lệnh hiệu quả</h3>
<pre><code class="language-text">Bối cảnh + vai trò + nhiệm vụ + ràng buộc + định dạng đầu ra
1. "Tôi là sinh viên kinh doanh ở Việt Nam, quan tâm việc Gen Z dùng ví điện tử. Gợi ý 8 góc
   nghiên cứu, mỗi góc kèm một lý thuyết khả dĩ và một nguồn dữ liệu. Đánh dấu góc nào khả thi
   cho một khảo sát sinh viên trong một học kỳ."
2. "Đây là câu hỏi nghiên cứu của tôi: [...]. Phản biện nó bằng phép thử Goldilocks và gợi ý
   một phiên bản hẹp hơn. Đừng viết đề cương thay tôi."
3. "Gợi ý từ đồng nghĩa và một chuỗi tìm kiếm Boolean cho: trust, e-wallet, adoption, students."
4. "Đây là bảng kết quả hồi quy của tôi: [...]. Giải thích ý nghĩa từng cột. Không thay đổi
   con số nào."</code></pre>
<h3>Kiểm chứng một tài liệu tham khảo do AI gợi ý</h3>
<ol>
<li>Tìm chính xác tên bài trên Google Scholar hoặc trang của nhà xuất bản.</li>
<li>Nếu có DOI, tra tại doi.org và kiểm tra tác giả, năm, tạp chí có khớp không.</li>
<li>Đọc ít nhất phần tóm tắt — tốt nhất là toàn văn — và xác nhận nó nói đúng điều bạn định trích.</li>
<li>Chỉ khi đó mới đưa vào phần mềm quản lý tài liệu (vd Zotero). Nếu không tìm thấy, nguồn đó không tồn tại đối với báo cáo của bạn.</li>
</ol>
<h3>Quy tắc liêm chính học thuật</h3>
<ul>
<li><strong>Quyền tác giả</strong>: ý tưởng, phân tích và câu chữ cuối cùng bạn nộp phải là của bạn; AI không thể là tác giả.</li>
<li><strong>Công khai</strong>: nêu rõ bạn đã dùng AI thế nào, theo hình thức giảng viên hoặc nhà trường yêu cầu.</li>
<li><strong>Không bịa đặt, không làm sai lệch</strong>: không bao giờ để AI tạo ra dữ liệu, câu trả lời, lời trích dẫn hay tài liệu tham khảo.</li>
<li><strong>Quyền riêng tư</strong>: không dán dữ liệu nhận diện được của người trả lời hay thông tin mật của doanh nghiệp vào công cụ AI công cộng (xem Ch 6).</li>
<li><strong>Trách nhiệm</strong>: trích dẫn một nguồn không tồn tại là vi phạm liêm chính kể cả khi công cụ AI tạo ra nó.</li>
</ul>
<pre><code class="language-text">Mẫu tuyên bố sử dụng AI (điều chỉnh theo yêu cầu của giảng viên)
"Nhóm đã dùng một chatbot AI để động não các góc tiếp cận đề tài và rà bảng hỏi dự thảo tìm câu
chữ khó hiểu. Mọi nguồn tài liệu do các tác giả tự tìm và đọc; mọi phân tích do các tác giả thực
hiện trên jamovi; không có dữ liệu nào của người trả lời được chia sẻ với công cụ AI."</code></pre>
<h3>Câu hỏi ôn tập và thảo luận — Phần 5</h3>
<ol>
<li>Bản tóm tắt cần trả lời bốn câu hỏi nào? Soạn một bản cho đề cương của bạn.</li>
<li>Phần nào của GA3 lấy từ GA1 và GA2, và cần bổ sung gì?</li>
<li>Liệt kê năm câu hỏi hội đồng nhiều khả năng sẽ hỏi khi bảo vệ, và chuẩn bị câu trả lời.</li>
<li>Ở từng giai đoạn của dự án, AI có thể giúp ở đâu, và bạn kiểm chứng kết quả của nó thế nào?</li>
<li>Vì sao trích dẫn một tài liệu do AI bịa ra là vấn đề liêm chính kể cả khi vô tình?</li>
</ol>
<div class="callout"><span class="badge">Quy tắc kinh nghiệm</span> Dùng AI để nghĩ nhanh hơn, không phải để nghĩ ít đi. Nếu bạn không giải thích và bảo vệ được một câu khi không có AI, câu đó không nên nằm trong báo cáo.</div>`,
  ]]);

const q5 = quiz('rmb301-quiz-5', 'Quiz 5 — Writing, presenting & AI integrity|||Quiz 5 — Viết, trình bày & liêm chính khi dùng AI', [
  { id: 'q1', question: 'Which part of a research report is a short, self-contained summary of the purpose, method, main findings and implications?|||Phần nào của báo cáo nghiên cứu là bản tóm tắt ngắn, độc lập về mục đích, phương pháp, kết quả chính và hàm ý?', options: ['The introduction|||Phần giới thiệu', 'An appendix|||Một phụ lục', 'The abstract|||Bản tóm tắt (abstract)', 'The reference list|||Danh mục tài liệu tham khảo'], correctIndex: 2, explanation: 'The abstract answers: what were the issues, how did you investigate them, what did you find, and what does it mean.|||Bản tóm tắt trả lời: vấn đề là gì, bạn đã nghiên cứu thế nào, phát hiện gì, và điều đó có ý nghĩa gì.' },
  { id: 'q2', question: 'An AI chatbot gives you five journal articles that support your hypothesis. What should you do before citing them?|||Một chatbot AI đưa cho bạn năm bài báo khoa học ủng hộ giả thuyết của bạn. Bạn nên làm gì trước khi trích dẫn?', options: ['Locate each article (e.g., Google Scholar, DOI), read it and confirm it supports the claim|||Tìm từng bài (vd trên Google Scholar, qua DOI), đọc và xác nhận nó ủng hộ nhận định', 'Cite them directly, because the chatbot provided full details|||Trích dẫn luôn vì chatbot đã cho đủ thông tin', 'Cite them but add "(AI)" after each reference|||Trích dẫn nhưng thêm "(AI)" sau mỗi tài liệu', 'Ask the chatbot whether the articles are real|||Hỏi lại chatbot xem các bài đó có thật không'], correctIndex: 0, explanation: 'AI tools can fabricate references that look real; only sources you have found and read yourself may be cited. Asking the same chatbot is not verification.|||Công cụ AI có thể bịa tài liệu tham khảo trông như thật; chỉ được trích những nguồn bạn đã tự tìm thấy và đọc. Hỏi lại chính chatbot đó không phải là kiểm chứng.' },
  { id: 'q3', question: 'Which content belongs in the conclusions chapter rather than in the results chapter?|||Nội dung nào thuộc chương kết luận chứ không thuộc chương kết quả?', options: ['Tables of descriptive statistics|||Các bảng thống kê mô tả', 'The sampling frame and response rate|||Khung mẫu và tỷ lệ phản hồi', 'Codes and themes with supporting quotations|||Mã, chủ đề kèm lời trích minh hoạ', 'Answers to the research questions, limitations and suggestions for further research|||Trả lời các câu hỏi nghiên cứu, hạn chế và gợi ý nghiên cứu tiếp theo'], correctIndex: 3, explanation: 'Results present what the data show; conclusions answer each research question and state the contribution, limitations and further research. The sampling frame belongs in the method chapter.|||Chương kết quả trình bày dữ liệu cho thấy gì; chương kết luận trả lời từng câu hỏi nghiên cứu, nêu đóng góp, hạn chế và hướng nghiên cứu tiếp. Khung mẫu thuộc chương phương pháp.' },
]);

const taiLieu = doc('rmb301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">RMB301 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning business research methods: the official syllabus and slides, the textbooks, free open resources, video channels, research tools and a self-study roadmap aligned with GA1, GA2 and GA3.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official RMB301 syllabus (<strong>sylID 12391</strong>, approved by Decision 1363/QĐ-ĐHFPT dated 06/12/2024; 3 credits; no prerequisite) and the lecture slides. Key facts from the syllabus:</p>
<ul>
<li><strong>Main textbook</strong>: Mark Saunders, Philip Lewis &amp; Adrian Thornhill — <em>Research Methods for Business Students</em>, Pearson; the syllabus lists the 8th edition (2019) and the 9th edition (2024) and recommends the latest.</li>
<li><strong>References</strong>: Jeffrey M. Wooldridge — <em>Introductory Econometrics: A Modern Approach</em> (Cengage); FPT University’s graduation thesis guideline for business and economics (Decision 870/QĐ-ĐHFPT, 2021) and the GRx491 thesis syllabi; the Coursera Guided Project "Basic data analysis using SPSS" (search the title on <a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera</a>).</li>
<li><strong>Emphasis</strong>: integrating AI tools to generate and refine topics, suggest content, identify credible sources and summarise findings.</li>
</ul>
<table>
<tr><th>Assessment</th><th>Weight</th></tr>
<tr><td>Participation</td><td>15%</td></tr>
<tr><td>GA1 — topic, research questions and objectives (max. 2 pages)</td><td>10%</td></tr>
<tr><td>GA2 — literature review and theoretical framework (max. 15 pages)</td><td>20%</td></tr>
<tr><td>GA3 — complete proposal: methodology, scope, thesis structure (max. 20 pages)</td><td>25%</td></tr>
<tr><td>Final exam — 50 multiple-choice questions, 60 minutes</td><td>30%</td></tr>
</table>
<p>The syllabus on FLM is the reference for assessment; check it for the version in force.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.pearson.com/en-gb/subject-catalog/p/research-methods-for-business-students/P200000010080/9781292402727" target="_blank" rel="noopener">Research Methods for Business Students, 9th edition</a> — Saunders, Lewis &amp; Thornhill (Pearson): the main textbook; this course follows its 14 chapters in order.</li>
<li><a href="https://www.cengage.com/" target="_blank" rel="noopener">Introductory Econometrics: A Modern Approach</a> — Jeffrey M. Wooldridge (Cengage): the reference for regression; search the title on the publisher’s site for the current edition.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://openstax.org/details/books/introductory-business-statistics-2e" target="_blank" rel="noopener">OpenStax — Introductory Business Statistics 2e</a> — free, peer-reviewed textbook: descriptive statistics, hypothesis testing, chi-square, correlation and regression.</li>
<li><a href="https://openstax.org/details/books/introductory-statistics-2e" target="_blank" rel="noopener">OpenStax — Introductory Statistics 2e</a> — a second free text with many worked examples.</li>
<li><a href="https://scholar.google.com/" target="_blank" rel="noopener">Google Scholar</a> — search academic literature, follow "cited by" links, and verify references.</li>
<li><a href="https://core.ac.uk/" target="_blank" rel="noopener">CORE</a> — millions of open-access research papers.</li>
<li><a href="https://www.prisma-statement.org/" target="_blank" rel="noopener">PRISMA statement</a> — the reporting guideline and flow diagram for systematic reviews.</li>
<li><a href="https://apastyle.apa.org/" target="_blank" rel="noopener">APA Style</a> — official guidance on citing and referencing.</li>
<li><a href="https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research" target="_blank" rel="noopener">UNESCO — Guidance for generative AI in education and research</a> — principles for responsible AI use.</li>
<li><a href="https://vbpl.vn/" target="_blank" rel="noopener">vbpl.vn</a> — Vietnam’s official legal database: check the personal data protection texts in force.</li>
<li><a href="https://data.worldbank.org/" target="_blank" rel="noopener">World Bank Open Data</a> — secondary data by country for the context of your study.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GradCoach" target="_blank" rel="noopener">Grad Coach</a> — plain-language videos on research questions, literature reviews, methodology and dissertations.</li>
<li><a href="https://www.youtube.com/@StatQuest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — clear explanations of p-values, hypothesis tests, correlation and regression.</li>
<li><a href="https://www.youtube.com/@CrashCourse" target="_blank" rel="noopener">CrashCourse</a> — its Statistics series covers sampling, distributions and tests.</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — step-by-step lessons on descriptive statistics and inference.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.zotero.org/" target="_blank" rel="noopener">Zotero</a> — free reference manager: collect sources, cite in Word or Google Docs, build the reference list.</li>
<li><a href="https://www.google.com/forms/about/" target="_blank" rel="noopener">Google Forms</a> — build and distribute online questionnaires.</li>
<li><a href="https://www.jamovi.org/" target="_blank" rel="noopener">jamovi</a> — free statistics software: descriptives, reliability (Cronbach’s alpha), chi-square, t-tests, regression.</li>
<li><a href="https://www.ibm.com/products/spss-statistics" target="_blank" rel="noopener">IBM SPSS Statistics</a> — the package used in the syllabus’s Coursera project and many theses.</li>
<li><a href="https://www.taguette.org/" target="_blank" rel="noopener">Taguette</a> — free, open-source tool for coding qualitative data.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — AVERAGE, MEDIAN, STDEV.S, CORREL and quick charts.</li>
<li><a href="https://www.doi.org/" target="_blank" rel="noopener">DOI Foundation</a> — resolve a DOI to check that a reference really exists.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>GA1 (weeks 1–3)</strong> — Part 1: choose and narrow a topic, write questions and objectives; redo Exercise 1 for your own topic.</li>
<li><strong>GA2 (weeks 4–6)</strong> — Parts 1–2: run a recorded search, build a Zotero library of 30+ verified sources, write a thematic review and draw your framework with hypotheses.</li>
<li><strong>GA3 (weeks 7–9)</strong> — Parts 3–5: decide sampling and sample size (Exercise 2), draft and pilot the instrument, plan the analysis (Exercises 3–4), write the full proposal and rehearse the defence.</li>
<li><strong>Final exam</strong> — revise the key concepts of all 14 chapters with the five quizzes and the review questions at the end of each part; practise reading output tables and p-values.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">RMB301 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học phương pháp nghiên cứu trong kinh doanh: giáo trình &amp; slide chính thức, sách giáo khoa, tài liệu mở miễn phí, kênh video, công cụ nghiên cứu, và lộ trình tự học bám GA1, GA2, GA3.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc đề cương chính thức của RMB301 (<strong>sylID 12391</strong>, ban hành theo Quyết định 1363/QĐ-ĐHFPT ngày 06/12/2024; 3 tín chỉ; không có môn tiên quyết) và slide bài giảng. Thông tin chính từ đề cương:</p>
<ul>
<li><strong>Giáo trình chính</strong>: Mark Saunders, Philip Lewis &amp; Adrian Thornhill — <em>Research Methods for Business Students</em>, Pearson; đề cương ghi ấn bản 8 (2019) và ấn bản 9 (2024), ưu tiên bản mới nhất.</li>
<li><strong>Tài liệu tham khảo</strong>: Jeffrey M. Wooldridge — <em>Introductory Econometrics: A Modern Approach</em> (Cengage); hướng dẫn làm khoá luận tốt nghiệp khối kinh tế của Trường Đại học FPT (Quyết định 870/QĐ-ĐHFPT, 2021) và đề cương các môn khoá luận GRx491; Coursera Guided Project "Basic data analysis using SPSS" (tìm theo tên trên <a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera</a>).</li>
<li><strong>Điểm nhấn</strong>: tích hợp công cụ AI để sinh và tinh chỉnh đề tài, gợi ý nội dung, xác định nguồn đáng tin cậy và tóm tắt kết quả nghiên cứu.</li>
</ul>
<table>
<tr><th>Đánh giá</th><th>Trọng số</th></tr>
<tr><td>Tham gia lớp</td><td>15%</td></tr>
<tr><td>GA1 — đề tài, câu hỏi và mục tiêu nghiên cứu (tối đa 2 trang)</td><td>10%</td></tr>
<tr><td>GA2 — tổng quan tài liệu và khung lý thuyết (tối đa 15 trang)</td><td>20%</td></tr>
<tr><td>GA3 — đề cương hoàn chỉnh: phương pháp, phạm vi, cấu trúc khoá luận (tối đa 20 trang)</td><td>25%</td></tr>
<tr><td>Thi cuối kỳ — 50 câu trắc nghiệm, 60 phút</td><td>30%</td></tr>
</table>
<p>Đề cương trên FLM là căn cứ cho việc đánh giá; hãy kiểm tra phiên bản đang áp dụng.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.pearson.com/en-gb/subject-catalog/p/research-methods-for-business-students/P200000010080/9781292402727" target="_blank" rel="noopener">Research Methods for Business Students, 9th edition</a> — Saunders, Lewis &amp; Thornhill (Pearson): giáo trình chính; môn học này đi theo đúng thứ tự 14 chương của sách.</li>
<li><a href="https://www.cengage.com/" target="_blank" rel="noopener">Introductory Econometrics: A Modern Approach</a> — Jeffrey M. Wooldridge (Cengage): tài liệu tham khảo cho phần hồi quy; tra tên sách trên trang nhà xuất bản để xem ấn bản hiện hành.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://openstax.org/details/books/introductory-business-statistics-2e" target="_blank" rel="noopener">OpenStax — Introductory Business Statistics 2e</a> — giáo trình mở miễn phí, có bình duyệt: thống kê mô tả, kiểm định giả thuyết, chi bình phương, tương quan và hồi quy.</li>
<li><a href="https://openstax.org/details/books/introductory-statistics-2e" target="_blank" rel="noopener">OpenStax — Introductory Statistics 2e</a> — một giáo trình miễn phí khác với nhiều ví dụ có lời giải.</li>
<li><a href="https://scholar.google.com/" target="_blank" rel="noopener">Google Scholar</a> — tìm tài liệu học thuật, lần theo mục "được trích dẫn bởi" và kiểm chứng tài liệu tham khảo.</li>
<li><a href="https://core.ac.uk/" target="_blank" rel="noopener">CORE</a> — hàng triệu bài nghiên cứu truy cập mở.</li>
<li><a href="https://www.prisma-statement.org/" target="_blank" rel="noopener">PRISMA statement</a> — hướng dẫn báo cáo và sơ đồ luồng cho tổng quan hệ thống.</li>
<li><a href="https://apastyle.apa.org/" target="_blank" rel="noopener">APA Style</a> — hướng dẫn chính thức về trích dẫn và lập danh mục tài liệu tham khảo.</li>
<li><a href="https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research" target="_blank" rel="noopener">UNESCO — Guidance for generative AI in education and research</a> — các nguyên tắc dùng AI có trách nhiệm.</li>
<li><a href="https://vbpl.vn/" target="_blank" rel="noopener">vbpl.vn</a> — cơ sở dữ liệu văn bản pháp luật chính thức: kiểm các văn bản về bảo vệ dữ liệu cá nhân đang có hiệu lực.</li>
<li><a href="https://data.worldbank.org/" target="_blank" rel="noopener">World Bank Open Data</a> — dữ liệu thứ cấp theo quốc gia cho phần bối cảnh nghiên cứu.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GradCoach" target="_blank" rel="noopener">Grad Coach</a> — video dễ hiểu về câu hỏi nghiên cứu, tổng quan tài liệu, phương pháp luận và luận văn.</li>
<li><a href="https://www.youtube.com/@StatQuest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — giải thích rõ ràng về p-value, kiểm định giả thuyết, tương quan và hồi quy.</li>
<li><a href="https://www.youtube.com/@CrashCourse" target="_blank" rel="noopener">CrashCourse</a> — loạt Statistics bao quát chọn mẫu, phân phối và kiểm định.</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — bài học từng bước về thống kê mô tả và suy luận thống kê.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.zotero.org/" target="_blank" rel="noopener">Zotero</a> — phần mềm quản lý tài liệu miễn phí: lưu nguồn, chèn trích dẫn trong Word hoặc Google Docs, tạo danh mục tài liệu tham khảo.</li>
<li><a href="https://www.google.com/forms/about/" target="_blank" rel="noopener">Google Forms</a> — tạo và phát bảng hỏi trực tuyến.</li>
<li><a href="https://www.jamovi.org/" target="_blank" rel="noopener">jamovi</a> — phần mềm thống kê miễn phí: thống kê mô tả, độ tin cậy (Cronbach’s alpha), chi bình phương, kiểm định t, hồi quy.</li>
<li><a href="https://www.ibm.com/products/spss-statistics" target="_blank" rel="noopener">IBM SPSS Statistics</a> — phần mềm dùng trong dự án Coursera của đề cương và nhiều khoá luận.</li>
<li><a href="https://www.taguette.org/" target="_blank" rel="noopener">Taguette</a> — công cụ mã nguồn mở, miễn phí để mã hoá dữ liệu định tính.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — AVERAGE, MEDIAN, STDEV.S, CORREL và biểu đồ nhanh.</li>
<li><a href="https://www.doi.org/" target="_blank" rel="noopener">DOI Foundation</a> — tra một mã DOI để kiểm tra tài liệu tham khảo có thật.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>GA1 (tuần 1–3)</strong> — Phần 1: chọn và thu hẹp đề tài, viết câu hỏi và mục tiêu; làm lại Bài tập 1 cho chính đề tài của bạn.</li>
<li><strong>GA2 (tuần 4–6)</strong> — Phần 1–2: tìm kiếm có ghi chép, xây thư viện Zotero trên 30 nguồn đã kiểm chứng, viết tổng quan theo chủ đề và vẽ khung nghiên cứu kèm giả thuyết.</li>
<li><strong>GA3 (tuần 7–9)</strong> — Phần 3–5: quyết định cách chọn mẫu và cỡ mẫu (Bài tập 2), soạn và thử nghiệm công cụ đo, lập kế hoạch phân tích (Bài tập 3–4), viết đề cương hoàn chỉnh và tập bảo vệ.</li>
<li><strong>Thi cuối kỳ</strong> — ôn các khái niệm then chốt của cả 14 chương bằng năm bài quiz và câu hỏi ôn cuối mỗi phần; luyện đọc bảng kết quả và p-value.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'RMB301',
    slug: 'rmb301-business-research-methods',
    title: 'Business Research Methods',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/RMB301.webp',
    shortDescription: 'From topic to defensible proposal, following Saunders et al.: literature review, philosophy and design, ethics, sampling, questionnaires and interviews, statistics and regression, qualitative analysis, writing and responsible AI use. Bilingual.|||Từ đề tài tới đề cương bảo vệ được, theo Saunders: tổng quan tài liệu, triết lý, thiết kế, đạo đức, chọn mẫu, bảng hỏi, phỏng vấn, thống kê, hồi quy, phân tích định tính, viết báo cáo, dùng AI có trách nhiệm.',
    description: 'Môn <strong>RMB301 — Business Research Methods (Phương pháp nghiên cứu trong kinh doanh)</strong> (khối Quản trị Kinh doanh, kỳ 4) đưa bạn từ một mối quan tâm còn mơ hồ tới <strong>một đề cương nghiên cứu có thể trình bày và bảo vệ</strong> — nền móng cho khoá luận tốt nghiệp. Bám đề cương FLM (sylID 12391) và sách chính <strong>Saunders, Lewis &amp; Thornhill — Research Methods for Business Students</strong> theo đúng thứ tự 14 chương: <strong>đề tài, câu hỏi và tổng quan tài liệu phê phán</strong> (GA1) → <strong>triết lý, cách tiếp cận, thiết kế, quyền tiếp cận và đạo đức</strong> (GA2) → <strong>chọn mẫu, dữ liệu thứ cấp, quan sát, phỏng vấn, bảng hỏi</strong> → <strong>phân tích định lượng</strong> (thống kê mô tả, kiểm định, tương quan, hồi quy — tham khảo Wooldridge) và <strong>định tính</strong> → <strong>viết, trình bày đề cương hoàn chỉnh</strong> (GA3). Tích hợp AI đúng tinh thần đề cương, luôn kèm quy trình kiểm chứng và liêm chính học thuật. Song ngữ Anh–Việt, mọi ví dụ số đã kiểm bằng máy (số liệu giả định), bài tập có lời giải và quiz kiểu thi cuối kỳ.',
    whatYouLearn: 'Phân biệt nghiên cứu cơ bản và ứng dụng; hình thành đề tài, câu hỏi và mục tiêu nghiên cứu qua phép thử Goldilocks (GA1)\nViết tổng quan tài liệu phê phán: tìm kiếm có hệ thống, tiêu chí đưa vào/loại ra, khung lý thuyết và giả thuyết (CLO1, GA2)\nSo sánh năm triết lý nghiên cứu và suy diễn – quy nạp – abductive; chọn thiết kế, chiến lược, khung thời gian phù hợp câu hỏi (CLO2)\nNhận diện vấn đề đạo đức, đồng thuận có hiểu biết và yêu cầu bảo vệ dữ liệu cá nhân trong nghiên cứu (CLO2)\nChọn mẫu xác suất và phi xác suất, tính cỡ mẫu; thiết kế bảng hỏi, phỏng vấn, quan sát và đánh giá dữ liệu thứ cấp\nMô tả dữ liệu, kiểm định giả thuyết (chi bình phương), đọc tương quan và bảng hồi quy; đánh giá độ tin cậy thang đo bằng Cronbach’s alpha\nPhân tích dữ liệu định tính bằng mã hoá và phân tích chủ đề\nViết đề cương hoàn chỉnh (GA3), trình bày và bảo vệ đề cương; dùng AI có kiểm chứng, đúng liêm chính học thuật (CLO3–4)',
    requirements: 'Không có môn tiên quyết theo đề cương; nên nắm thống kê cơ bản (trung bình, phần trăm, phân phối)\nĐọc hiểu tiếng Anh học thuật để đọc bài báo khoa học\nBảng tính (Google Sheets, Excel) hoặc phần mềm thống kê (jamovi, SPSS) để luyện phân tích',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Nghiên cứu kinh doanh là gì, CLO, đánh giá GA1–GA3, tiến trình nghiên cứu, quy tắc dùng AI.', lessons: [intro] },
    { title: 'Part 1 — Research topic & literature review (Ch 1–3)|||Phần 1 — Đề tài & tổng quan tài liệu (Ch 1–3)', description: 'Nghiên cứu cơ bản và ứng dụng, đề tài, câu hỏi và mục tiêu, tổng quan tài liệu phê phán, tổng quan hệ thống — nền cho GA1.', lessons: [c1, c2, c3, c3e, q1] },
    { title: 'Part 2 — Philosophy, approach & research design (Ch 4–6)|||Phần 2 — Triết lý, cách tiếp cận & thiết kế nghiên cứu (Ch 4–6)', description: 'Củ hành nghiên cứu, năm triết lý, suy diễn – quy nạp – abductive, giả thuyết và khung nghiên cứu, thiết kế, độ tin cậy – độ giá trị, quyền tiếp cận và đạo đức — nền cho GA2.', lessons: [c4, c5, c6, q2] },
    { title: 'Part 3 — Sampling & data collection (Ch 7–11)|||Phần 3 — Chọn mẫu & thu thập dữ liệu (Ch 7–11)', description: 'Chọn mẫu và cỡ mẫu, dữ liệu thứ cấp, quan sát, phỏng vấn, bảng hỏi, thang đo, độ tin cậy Cronbach’s alpha.', lessons: [c7, c7e, c8, c9, c11, c11e, q3] },
    { title: 'Part 4 — Analysing quantitative & qualitative data (Ch 12–13)|||Phần 4 — Phân tích dữ liệu định lượng & định tính (Ch 12–13)', description: 'Thống kê mô tả, kiểm định giả thuyết, chi bình phương, tương quan, hồi quy, phân tích chủ đề.', lessons: [c12, c13, c13e, c14, q4] },
    { title: 'Part 5 — Writing, presenting & responsible AI (Ch 14)|||Phần 5 — Viết, trình bày & dùng AI có trách nhiệm (Ch 14)', description: 'Cấu trúc báo cáo, đề cương hoàn chỉnh GA3, bảo vệ đề cương, quy trình kiểm chứng khi dùng AI, liêm chính học thuật.', lessons: [c15, c16, q5] },
  ],
};
