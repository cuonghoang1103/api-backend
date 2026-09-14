/**
 * ENM302 — Business English - Level 1. Giáo trình tham khảo (trích dẫn, KHÔNG
 * upload PDF): Market Leader (Pearson), Business Result (OUP), English for
 * Business Communication (Cambridge). 8 chương: giới thiệu bản thân/công ty,
 * công việc & phòng ban, điện thoại & hẹn gặp, email, họp & nêu ý kiến, sản
 * phẩm/dịch vụ & mô tả số liệu, giao tiếp xã hội, văn hoá công ty. Song ngữ.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('enm302-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo (Market Leader, Business Result, English for Business Communication), tài liệu chính thức miễn phí, YouTube, công cụ luyện nói/viết, lộ trình tự học.',
  [[
    `<span class="eyebrow">ENM302 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Business English Level 1 — introductions, jobs, phone calls, emails, meetings, data description, small talk and workplace culture — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are the reference textbooks and free, legal resources.</p>
<h3>📘 Reference textbooks (cited, not uploaded)</h3>
<ul>
<li><em>Market Leader</em> (Pearson) — the standard Business English course used widely in FPTU-style curricula; strong on vocabulary and case studies.</li>
<li><em>Business Result</em> (Oxford University Press) — practical, workplace-task focused; good for telephoning and meetings units.</li>
<li><em>English for Business Communication</em> (Cambridge) — strong on emails, correspondence and presentations.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<p>The official FPTU syllabus &amp; lecture slides for ENM302 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<ul>
<li><a href="https://www.britishcouncil.org/business-english" target="_blank" rel="noopener">British Council — Business English</a></li>
<li><a href="https://learnenglish.britishcouncil.org/business-english" target="_blank" rel="noopener">LearnEnglish (British Council) — Business English section</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@BBCLearningEnglish" target="_blank" rel="noopener">BBC Learning English</a> — workplace vocabulary &amp; phrases</li>
<li><a href="https://www.youtube.com/@EnglishwithLucy" target="_blank" rel="noopener">English with Lucy</a> — pronunciation &amp; professional English</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.cambridge.org/dictionary/" target="_blank" rel="noopener">Cambridge Dictionary</a> — definitions, collocations, pronunciation audio</li>
<li><a href="https://www.grammarly.com/" target="_blank" rel="noopener">Grammarly</a> — check emails &amp; written correspondence</li>
<li><a href="https://www.ted.com/talks" target="_blank" rel="noopener">TED Talks</a> — listening practice for business &amp; workplace topics</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — introductions, jobs &amp; departments, basic Present Simple for facts.</li>
<li><strong>Practice</strong> — role-play phone calls and write short business emails using the key phrases.</li>
<li><strong>Go deeper</strong> — meetings, opinions, describing data trends.</li>
<li><strong>Workplace-ready</strong> — small talk, company culture, giving/receiving feedback.</li>
</ol></div>`,
    `<span class="eyebrow">ENM302 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Tiếng Anh thương mại Cấp độ 1 — giới thiệu bản thân, công việc, gọi điện, email, họp, mô tả số liệu, giao tiếp xã hội và văn hoá công ty — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là sách tham khảo và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Sách giáo trình tham khảo (trích dẫn, không upload)</h3>
<ul>
<li><em>Market Leader</em> (Pearson) — giáo trình Tiếng Anh thương mại chuẩn, dùng rộng rãi trong các khung chương trình kiểu FPTU; mạnh về từ vựng và case study.</li>
<li><em>Business Result</em> (Oxford University Press) — thiên về tác vụ thực tế nơi làm việc; tốt cho phần điện thoại và họp.</li>
<li><em>English for Business Communication</em> (Cambridge) — mạnh về email, thư tín và thuyết trình.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ENM302 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<ul>
<li><a href="https://www.britishcouncil.org/business-english" target="_blank" rel="noopener">British Council — Business English</a></li>
<li><a href="https://learnenglish.britishcouncil.org/business-english" target="_blank" rel="noopener">LearnEnglish (British Council) — mục Business English</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BBCLearningEnglish" target="_blank" rel="noopener">BBC Learning English</a> — từ vựng &amp; cụm từ công sở</li>
<li><a href="https://www.youtube.com/@EnglishwithLucy" target="_blank" rel="noopener">English with Lucy</a> — phát âm &amp; tiếng Anh chuyên nghiệp</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.cambridge.org/dictionary/" target="_blank" rel="noopener">Cambridge Dictionary</a> — định nghĩa, collocation, audio phát âm</li>
<li><a href="https://www.grammarly.com/" target="_blank" rel="noopener">Grammarly</a> — kiểm tra email &amp; thư tín</li>
<li><a href="https://www.ted.com/talks" target="_blank" rel="noopener">TED Talks</a> — luyện nghe chủ đề kinh doanh &amp; công sở</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — giới thiệu bản thân, công việc &amp; phòng ban, Present Simple cho sự thật.</li>
<li><strong>Luyện tập</strong> — nhập vai gọi điện và viết email ngắn dùng đúng mẫu câu.</li>
<li><strong>Đào sâu</strong> — họp, nêu ý kiến, mô tả xu hướng số liệu.</li>
<li><strong>Sẵn sàng đi làm</strong> — giao tiếp xã hội, văn hoá công ty, phản hồi (feedback).</li>
</ol></div>`,
  ]]);

const intro = doc('enm302-0-1-overview', 'Course overview: Business English - Level 1|||Tổng quan: Tiếng Anh thương mại - Cấp độ 1',
  'Tiếng Anh dùng trong công việc: giới thiệu bản thân/công ty, gọi điện, email, họp, mô tả sản phẩm & số liệu, giao tiếp xã hội, văn hoá công ty. Lộ trình 8 chương.',
  [[
    `<span class="eyebrow">ENM302 · Lesson 0.1 · Overview</span>
<h2>Business English &amp; Communication — Level 1</h2>
<p class="lead">This course builds the <strong>English you actually use at work</strong>: introducing yourself and your company, talking about your job and department, making phone calls, writing emails, taking part in meetings, describing products and data, making small talk, and understanding workplace culture.</p>
<h3>Why it matters</h3>
<p>Technical skills get you the interview; clear, professional English keeps you in the room — on calls with clients, in emails to partners, in meetings with your team. This course focuses on <strong>practical phrases</strong> you can use immediately, not just grammar rules.</p>
<h3>Roadmap</h3>
<p>Introducing yourself &amp; your company → jobs, responsibilities &amp; departments → telephoning &amp; making arrangements → emails &amp; business correspondence → meetings &amp; giving opinions → products, services &amp; describing data → socializing &amp; small talk → company culture &amp; workplace English. Each chapter pairs <strong>target vocabulary</strong>, <strong>key phrases</strong>, a <strong>sample dialogue</strong> and a <strong>grammar focus</strong>, bilingual, with a quiz.</p>`,
    `<span class="eyebrow">ENM302 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Anh thương mại &amp; giao tiếp — Cấp độ 1</h2>
<p class="lead">Môn này xây dựng <strong>tiếng Anh bạn thực sự dùng trong công việc</strong>: giới thiệu bản thân và công ty, nói về công việc và phòng ban của mình, gọi điện thoại, viết email, tham gia họp, mô tả sản phẩm và số liệu, giao tiếp xã hội, và hiểu văn hoá nơi làm việc.</p>
<h3>Vì sao quan trọng</h3>
<p>Kỹ năng chuyên môn giúp bạn có buổi phỏng vấn; tiếng Anh rõ ràng, chuyên nghiệp giúp bạn giữ được vị trí trong phòng — khi gọi điện với khách hàng, viết email cho đối tác, họp cùng đội của mình. Môn này tập trung vào <strong>cụm từ thực dụng</strong> dùng được ngay, không chỉ là quy tắc ngữ pháp.</p>
<h3>Lộ trình</h3>
<p>Giới thiệu bản thân &amp; công ty → công việc, trách nhiệm &amp; phòng ban → gọi điện &amp; hẹn gặp → email &amp; thư tín thương mại → họp &amp; nêu ý kiến → sản phẩm, dịch vụ &amp; mô tả số liệu → giao tiếp xã hội &amp; small talk → văn hoá công ty &amp; tiếng Anh công sở. Mỗi chương gồm <strong>từ vựng trọng tâm</strong>, <strong>mẫu câu chính</strong>, <strong>hội thoại mẫu</strong> và <strong>ngữ pháp trọng tâm</strong>, song ngữ, kèm quiz.</p>`,
  ]]);

const c1 = doc('enm302-1-1-introductions', '1.1 — Introducing yourself & your company|||1.1 — Giới thiệu bản thân & công ty',
  'Từ vựng: chức danh, ngành nghề, trụ sở, thành lập, nhân viên. Mẫu câu giới thiệu bản thân/công ty. Hội thoại gặp mặt. Ngữ pháp: Present Simple cho sự thật & thói quen.',
  [[
    `<span class="eyebrow">ENM302 · Chapter 1 · Lesson 1.1</span>
<h2>Introducing yourself &amp; your company</h2>
<h3>Target vocabulary</h3>
<pre><code>job title       - chức danh công việc
industry        - ngành nghề
headquarters    - trụ sở chính
founded (in)    - được thành lập (vào năm)
employees       - nhân viên
branch / office - chi nhánh / văn phòng
based in        - có trụ sở tại
specialize in   - chuyên về</code></pre>
<h3>Key phrases</h3>
<ul>
<li><strong>Let me introduce myself.</strong> I'm [name], and I work for [company].</li>
<li><strong>I'm in the [department] department.</strong> / <strong>I work as a [job title].</strong></li>
<li><strong>We specialize in...</strong> / <strong>We're based in...</strong></li>
<li><strong>Nice to meet you. And you? / Pleased to meet you.</strong></li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>A: Hi, let me introduce myself. I'm Lan, I work for VinTech.
B: Nice to meet you, Lan. I'm Minh, from FPT Software.
A: What does FPT Software do?
B: We specialize in software outsourcing. We're headquartered
   in Hanoi, with offices in over 20 countries.
A: That's impressive. How long have you worked there?
B: About three years now.</code></pre>
<h3>Grammar focus: Present Simple for facts &amp; routines</h3>
<p>Use the <strong>Present Simple</strong> for permanent facts, jobs and routines: <em>"I work for..."</em>, <em>"The company produces..."</em>, <em>"She manages the Marketing team."</em> Remember the third-person -s: <em>He work<strong>s</strong></em>, <em>She manage<strong>s</strong></em>.</p>
<div class="callout"><span class="badge">Tip</span> "Work for" a company, "work in" a department, "work as" a job title — three prepositions, three different meanings.</div>`,
    `<span class="eyebrow">ENM302 · Chương 1 · Bài 1.1</span>
<h2>Giới thiệu bản thân &amp; công ty</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>job title       - chức danh công việc
industry        - ngành nghề
headquarters    - trụ sở chính
founded (in)    - được thành lập (vào năm)
employees       - nhân viên
branch / office - chi nhánh / văn phòng
based in        - có trụ sở tại
specialize in   - chuyên về</code></pre>
<h3>Mẫu câu chính</h3>
<ul>
<li><strong>Let me introduce myself.</strong> Tôi là [tên], và tôi làm cho [công ty].</li>
<li><strong>I'm in the [department] department.</strong> / <strong>I work as a [chức danh].</strong></li>
<li><strong>We specialize in...</strong> / <strong>We're based in...</strong></li>
<li><strong>Nice to meet you. And you? / Pleased to meet you.</strong></li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>A: Hi, let me introduce myself. I'm Lan, I work for VinTech.
B: Nice to meet you, Lan. I'm Minh, from FPT Software.
A: What does FPT Software do?
B: We specialize in software outsourcing. We're headquartered
   in Hanoi, with offices in over 20 countries.
A: That's impressive. How long have you worked there?
B: About three years now.</code></pre>
<h3>Ngữ pháp trọng tâm: Present Simple cho sự thật &amp; thói quen</h3>
<p>Dùng <strong>Present Simple</strong> cho sự thật cố định, công việc và thói quen: <em>"I work for..."</em>, <em>"The company produces..."</em>, <em>"She manages the Marketing team."</em> Nhớ thêm -s ở ngôi thứ ba: <em>He work<strong>s</strong></em>, <em>She manage<strong>s</strong></em>.</p>
<div class="callout"><span class="badge">Lưu ý</span> "Work for" một công ty, "work in" một phòng ban, "work as" một chức danh — ba giới từ, ba nghĩa khác nhau.</div>`,
  ]]);

const c1q = quiz('enm302-quiz-1', 'Quiz 1 — Introductions|||Quiz 1 — Giới thiệu bản thân & công ty', [
  { id: 'q1', question: 'Câu nào đúng khi nói "tôi làm cho công ty ABC"?', options: ['I work in ABC.', 'I work for ABC.', 'I work at as ABC.', 'I work about ABC.'], correctIndex: 1, explanation: '"Work for" + tên công ty. "Work in" dùng cho phòng ban, "work as" dùng cho chức danh.' },
  { id: 'q2', question: 'Chọn câu chia đúng ngôi thứ ba số ít (Present Simple):', options: ['She manage the team.', 'She managing the team.', 'She manages the team.', 'She managed the team.'], correctIndex: 2, explanation: 'Ngôi thứ ba số ít thêm -s/-es: manage → manages.' },
  { id: 'q3', question: '"We specialize in software outsourcing" nghĩa là?', options: ['Chúng tôi tuyển dụng phần mềm', 'Chúng tôi chuyên về gia công phần mềm', 'Chúng tôi bán phần cứng', 'Chúng tôi mới thành lập'], correctIndex: 1, explanation: '"Specialize in" = chuyên về một lĩnh vực.' },
]);

const c2 = doc('enm302-2-1-jobs-departments', '2.1 — Jobs, responsibilities & departments|||2.1 — Công việc, trách nhiệm & phòng ban',
  'Từ vựng: phòng ban (HR, Finance, Marketing, Sales, IT, R&D), chức danh, mẫu câu mô tả trách nhiệm ("responsible for", "report to"). Hội thoại & ngữ pháp: động từ + gerund.',
  [[
    `<span class="eyebrow">ENM302 · Chapter 2 · Lesson 2.1</span>
<h2>Jobs, responsibilities &amp; departments</h2>
<h3>Target vocabulary — departments &amp; titles</h3>
<pre><code>HR (Human Resources)   - phòng nhân sự
Finance / Accounting   - phòng tài chính / kế toán
Marketing               - phòng marketing
Sales                   - phòng kinh doanh
IT                      - phòng công nghệ thông tin
Production              - phòng sản xuất
R&amp;D (Research &amp; Dev.) - nghiên cứu &amp; phát triển
Customer Service        - dịch vụ khách hàng
manager / supervisor    - quản lý / giám sát
executive / assistant   - chuyên viên / trợ lý
intern                  - thực tập sinh</code></pre>
<h3>Key phrases</h3>
<ul>
<li><strong>I'm in charge of...</strong> / <strong>I'm responsible for...</strong> (+ noun/gerund)</li>
<li><strong>I report to...</strong> (my manager) / <strong>My team reports to me.</strong></li>
<li><strong>My main duties include...</strong> / <strong>On a typical day, I...</strong></li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>A: What do you do exactly?
B: I'm a supervisor in the Production department.
   I'm responsible for scheduling shifts and quality control.
A: Who do you report to?
B: I report directly to the Production Manager.
A: Sounds like a lot of responsibility!
B: It is, but I have a great team.</code></pre>
<h3>Grammar focus: "be responsible for" + gerund</h3>
<p>After <strong>responsible for / in charge of</strong>, use a <strong>gerund</strong> (verb + -ing), not the infinitive: <em>"I'm responsible for <strong>managing</strong> the budget"</em> (NOT "to manage"). Also compare: <em>report <strong>to</strong> someone (a person)</em> vs. <em>be responsible <strong>for</strong> something (a task)</em>.</p>
<div class="callout"><span class="badge">Common mistake</span> "I'm responsible to organize the event" ✗ → "I'm responsible <strong>for organizing</strong> the event" ✓.</div>`,
    `<span class="eyebrow">ENM302 · Chương 2 · Bài 2.1</span>
<h2>Công việc, trách nhiệm &amp; phòng ban</h2>
<h3>Từ vựng — phòng ban &amp; chức danh</h3>
<pre><code>HR (Human Resources)   - phòng nhân sự
Finance / Accounting   - phòng tài chính / kế toán
Marketing               - phòng marketing
Sales                   - phòng kinh doanh
IT                      - phòng công nghệ thông tin
Production              - phòng sản xuất
R&amp;D (Research &amp; Dev.) - nghiên cứu &amp; phát triển
Customer Service        - dịch vụ khách hàng
manager / supervisor    - quản lý / giám sát
executive / assistant   - chuyên viên / trợ lý
intern                  - thực tập sinh</code></pre>
<h3>Mẫu câu chính</h3>
<ul>
<li><strong>I'm in charge of...</strong> / <strong>I'm responsible for...</strong> (+ danh từ/động từ -ing)</li>
<li><strong>I report to...</strong> (quản lý của tôi) / <strong>My team reports to me.</strong></li>
<li><strong>My main duties include...</strong> / <strong>On a typical day, I...</strong></li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>A: What do you do exactly?
B: I'm a supervisor in the Production department.
   I'm responsible for scheduling shifts and quality control.
A: Who do you report to?
B: I report directly to the Production Manager.
A: Sounds like a lot of responsibility!
B: It is, but I have a great team.</code></pre>
<h3>Ngữ pháp trọng tâm: "be responsible for" + gerund</h3>
<p>Sau <strong>responsible for / in charge of</strong>, dùng <strong>gerund</strong> (động từ + -ing), không dùng động từ nguyên mẫu có "to": <em>"I'm responsible for <strong>managing</strong> the budget"</em> (KHÔNG phải "to manage"). So sánh: <em>report <strong>to</strong> ai đó (một người)</em> với <em>be responsible <strong>for</strong> việc gì (một nhiệm vụ)</em>.</p>
<div class="callout"><span class="badge">Lỗi thường gặp</span> "I'm responsible to organize the event" ✗ → "I'm responsible <strong>for organizing</strong> the event" ✓.</div>`,
  ]]);

const c2q = quiz('enm302-quiz-2', 'Quiz 2 — Jobs & departments|||Quiz 2 — Công việc & phòng ban', [
  { id: 'q1', question: 'Chọn câu đúng ngữ pháp:', options: ['I am responsible to manage the budget.', 'I am responsible for manage the budget.', 'I am responsible for managing the budget.', 'I am responsible manage the budget.'], correctIndex: 2, explanation: 'Sau "responsible for" dùng gerund (-ing): "for managing".' },
  { id: 'q2', question: 'Phòng ban nào phụ trách tuyển dụng & tiền lương?', options: ['Marketing', 'HR (Human Resources)', 'R&D', 'Customer Service'], correctIndex: 1, explanation: 'HR (Human Resources) phụ trách nhân sự: tuyển dụng, lương, phúc lợi.' },
  { id: 'q3', question: '"I report to the Production Manager" nghĩa là?', options: ['Tôi báo cáo/dưới quyền quản lý sản xuất', 'Tôi thay thế quản lý sản xuất', 'Tôi phỏng vấn quản lý sản xuất', 'Tôi là quản lý sản xuất'], correctIndex: 0, explanation: '"Report to" = báo cáo cho / chịu sự quản lý của.' },
]);

const c3 = doc('enm302-3-1-telephoning', '3.1 — Telephoning & making arrangements|||3.1 — Gọi điện & hẹn gặp',
  'Từ vựng điện thoại: put through, hold the line, leave a message, extension. Mẫu câu hẹn gặp. Hội thoại đặt lịch họp. Ngữ pháp: câu hỏi lịch sự với Could/Would, thì hiện tại tiếp diễn cho kế hoạch.',
  [[
    `<span class="eyebrow">ENM302 · Chapter 3 · Lesson 3.1</span>
<h2>Telephoning &amp; making arrangements</h2>
<h3>Target vocabulary</h3>
<pre><code>put someone through   - chuyển máy cho ai
hold the line          - giữ máy
leave a message        - để lại lời nhắn
voicemail               - hộp thư thoại
extension               - số máy nội bộ
get back to someone    - gọi lại cho ai
reschedule              - đổi lịch
confirm an appointment - xác nhận lịch hẹn</code></pre>
<h3>Key phrases</h3>
<ul>
<li><strong>Could I speak to [name], please?</strong> / <strong>Could you put me through to...?</strong></li>
<li><strong>Can I take a message?</strong> / <strong>I'll get back to you as soon as possible.</strong></li>
<li><strong>Would Tuesday at 10 a.m. work for you?</strong> / <strong>I'm afraid I have a conflict. Could we reschedule?</strong></li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>A: Good morning, ABC Company. How can I help you?
B: Good morning. Could I speak to Ms. Tran, please?
A: I'm sorry, she's in a meeting right now. Can I take a message?
B: Yes, please tell her I'd like to reschedule our appointment.
   Would Thursday at 2 p.m. work instead?
A: I'll pass on the message and get back to you shortly.
B: Thank you very much.</code></pre>
<h3>Grammar focus: polite requests &amp; fixed arrangements</h3>
<p>Use <strong>Could / Would</strong> for polite requests: <em>"Could I speak to...?"</em>, <em>"Would you mind holding?"</em> For fixed future plans, use the <strong>Present Continuous</strong>: <em>"I'm meeting the client at 3 p.m."</em> (a scheduled arrangement, not a general prediction).</p>
<div class="callout"><span class="badge">Tip</span> "Can" sounds direct; "Could/Would" sound more polite — always prefer them on the phone with people you don't know well.</div>`,
    `<span class="eyebrow">ENM302 · Chương 3 · Bài 3.1</span>
<h2>Gọi điện &amp; hẹn gặp</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>put someone through   - chuyển máy cho ai
hold the line          - giữ máy
leave a message        - để lại lời nhắn
voicemail               - hộp thư thoại
extension               - số máy nội bộ
get back to someone    - gọi lại cho ai
reschedule              - đổi lịch
confirm an appointment - xác nhận lịch hẹn</code></pre>
<h3>Mẫu câu chính</h3>
<ul>
<li><strong>Could I speak to [tên], please?</strong> / <strong>Could you put me through to...?</strong></li>
<li><strong>Can I take a message?</strong> / <strong>I'll get back to you as soon as possible.</strong></li>
<li><strong>Would Tuesday at 10 a.m. work for you?</strong> / <strong>I'm afraid I have a conflict. Could we reschedule?</strong></li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>A: Good morning, ABC Company. How can I help you?
B: Good morning. Could I speak to Ms. Tran, please?
A: I'm sorry, she's in a meeting right now. Can I take a message?
B: Yes, please tell her I'd like to reschedule our appointment.
   Would Thursday at 2 p.m. work instead?
A: I'll pass on the message and get back to you shortly.
B: Thank you very much.</code></pre>
<h3>Ngữ pháp trọng tâm: câu hỏi lịch sự &amp; lịch cố định</h3>
<p>Dùng <strong>Could / Would</strong> cho yêu cầu lịch sự: <em>"Could I speak to...?"</em>, <em>"Would you mind holding?"</em> Với kế hoạch tương lai đã cố định, dùng <strong>hiện tại tiếp diễn</strong>: <em>"I'm meeting the client at 3 p.m."</em> (lịch đã sắp xếp, không phải dự đoán chung).</p>
<div class="callout"><span class="badge">Lưu ý</span> "Can" nghe trực tiếp; "Could/Would" nghe lịch sự hơn — luôn ưu tiên khi gọi điện với người chưa quen.</div>`,
  ]]);

const c3q = quiz('enm302-quiz-3', 'Quiz 3 — Telephoning|||Quiz 3 — Gọi điện & hẹn gặp', [
  { id: 'q1', question: 'Câu lịch sự nhất để yêu cầu nói chuyện với ai đó qua điện thoại?', options: ['I speak to Ms. Tran now.', 'Could I speak to Ms. Tran, please?', 'Give me Ms. Tran.', 'Ms. Tran, speak now.'], correctIndex: 1, explanation: '"Could I speak to..., please?" là mẫu lịch sự chuẩn khi gọi điện.' },
  { id: 'q2', question: '"Would Thursday at 2 p.m. work instead?" dùng để?', options: ['Hỏi giờ hiện tại', 'Đề xuất đổi lịch hẹn', 'Từ chối cuộc gọi', 'Xin số điện thoại'], correctIndex: 1, explanation: '"Would ... work?" dùng để đề xuất/hỏi ý kiến về một thời điểm mới.' },
  { id: 'q3', question: 'Câu nào diễn tả đúng một kế hoạch tương lai ĐÃ CỐ ĐỊNH?', options: ['I meet the client tomorrow.', "I'm meeting the client tomorrow.", 'I will meeting the client tomorrow.', 'I meeting the client tomorrow.'], correctIndex: 1, explanation: 'Hiện tại tiếp diễn (Present Continuous) diễn tả lịch đã sắp xếp cố định.' },
]);

const c4 = doc('enm302-4-1-emails', '4.1 — Emails & business correspondence|||4.1 — Email & thư tín thương mại',
  'Từ vựng email: subject line, attachment, CC/BCC, reply/forward. Cấu trúc email trang trọng. Mẫu câu mở/kết thư. Ngữ pháp: modal verbs cho yêu cầu, văn phong trang trọng vs thân mật.',
  [[
    `<span class="eyebrow">ENM302 · Chapter 4 · Lesson 4.1</span>
<h2>Emails &amp; business correspondence</h2>
<h3>Target vocabulary</h3>
<pre><code>subject line   - dòng chủ đề
attachment      - tệp đính kèm
CC / BCC        - đồng gửi / đồng gửi ẩn
reply / forward - trả lời / chuyển tiếp
recipient        - người nhận
follow up on...  - theo dõi/nhắc lại việc gì</code></pre>
<h3>Key phrases</h3>
<ul>
<li><strong>Opening:</strong> "I am writing to..." / "I am writing with regard to..." / "Further to our conversation..."</li>
<li><strong>Body:</strong> "Please find attached..." / "Could you please...?" / "I would appreciate it if you could..."</li>
<li><strong>Closing:</strong> "I look forward to hearing from you." / "Please let me know if you have any questions." / "Best regards,"</li>
</ul>
<h3>Sample email</h3>
<pre><code>Subject: Meeting Request - Q3 Marketing Plan

Dear Mr. Nguyen,

I am writing to request a meeting to discuss the Q3 marketing
plan. Would you be available this Friday at 10 a.m.?

Please find attached the draft proposal for your review.

I look forward to hearing from you.

Best regards,
Lan Pham
Marketing Executive</code></pre>
<h3>Grammar focus: formal register &amp; polite requests</h3>
<p>Business emails use a <strong>formal register</strong>: full forms (not contractions), no slang, and modal verbs for politeness — <em>"Could you please..."</em>, <em>"Would it be possible to...?"</em>, <em>"I would appreciate it if..."</em> — instead of a blunt "I want you to...".</p>
<div class="callout"><span class="badge">Tip</span> Keep the subject line short and specific — "Meeting Request - Q3 Marketing Plan" tells the reader exactly what's inside before they even open it.</div>`,
    `<span class="eyebrow">ENM302 · Chương 4 · Bài 4.1</span>
<h2>Email &amp; thư tín thương mại</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>subject line   - dòng chủ đề
attachment      - tệp đính kèm
CC / BCC        - đồng gửi / đồng gửi ẩn
reply / forward - trả lời / chuyển tiếp
recipient        - người nhận
follow up on...  - theo dõi/nhắc lại việc gì</code></pre>
<h3>Mẫu câu chính</h3>
<ul>
<li><strong>Mở đầu:</strong> "I am writing to..." / "I am writing with regard to..." / "Further to our conversation..."</li>
<li><strong>Nội dung:</strong> "Please find attached..." / "Could you please...?" / "I would appreciate it if you could..."</li>
<li><strong>Kết thư:</strong> "I look forward to hearing from you." / "Please let me know if you have any questions." / "Best regards,"</li>
</ul>
<h3>Email mẫu</h3>
<pre><code>Subject: Meeting Request - Q3 Marketing Plan

Dear Mr. Nguyen,

I am writing to request a meeting to discuss the Q3 marketing
plan. Would you be available this Friday at 10 a.m.?

Please find attached the draft proposal for your review.

I look forward to hearing from you.

Best regards,
Lan Pham
Marketing Executive</code></pre>
<h3>Ngữ pháp trọng tâm: văn phong trang trọng &amp; yêu cầu lịch sự</h3>
<p>Email thương mại dùng <strong>văn phong trang trọng</strong>: viết đầy đủ (không viết tắt kiểu I'm/don't), không dùng ngôn ngữ suồng sã, và dùng modal verb để lịch sự — <em>"Could you please..."</em>, <em>"Would it be possible to...?"</em>, <em>"I would appreciate it if..."</em> — thay vì nói thẳng "I want you to...".</p>
<div class="callout"><span class="badge">Lưu ý</span> Giữ dòng chủ đề ngắn và cụ thể — "Meeting Request - Q3 Marketing Plan" cho người đọc biết ngay nội dung trước khi mở email.</div>`,
  ]]);

const c4q = quiz('enm302-quiz-4', 'Quiz 4 — Emails|||Quiz 4 — Email & thư tín', [
  { id: 'q1', question: 'Câu mở đầu email trang trọng phù hợp nhất?', options: ['Hey, whats up?', 'I am writing to request a meeting.', 'Gimme a meeting time.', 'U free Friday?'], correctIndex: 1, explanation: '"I am writing to..." là mẫu mở đầu email trang trọng chuẩn.' },
  { id: 'q2', question: '"Please find attached the draft proposal" nghĩa là?', options: ['Đề xuất bị từ chối', 'Có tệp đính kèm là bản đề xuất nháp', 'Yêu cầu xoá tệp', 'Đề xuất đã được duyệt'], correctIndex: 1, explanation: '"Please find attached..." báo có tệp đính kèm gửi cùng email.' },
  { id: 'q3', question: 'Câu nào lịch sự & trang trọng nhất để yêu cầu ai đó làm việc gì?', options: ['I want you to send the report.', 'Send me the report now.', 'Could you please send me the report?', 'Report. Now.'], correctIndex: 2, explanation: '"Could you please...?" dùng modal verb để yêu cầu lịch sự.' },
]);

const c5 = doc('enm302-5-1-meetings-opinions', '5.1 — Meetings & giving opinions|||5.1 — Họp & nêu ý kiến',
  'Từ vựng họp: agenda, minutes, action points, chairperson. Mẫu câu nêu ý kiến, đồng ý/không đồng ý. Hội thoại họp nhóm. Ngữ pháp: cấu trúc nêu quan điểm lịch sự.',
  [[
    `<span class="eyebrow">ENM302 · Chapter 5 · Lesson 5.1</span>
<h2>Meetings &amp; giving opinions</h2>
<h3>Target vocabulary</h3>
<pre><code>agenda         - chương trình họp
minutes         - biên bản họp
action points   - việc cần làm sau họp
chairperson     - người chủ trì
attendee        - người tham dự
to raise a point - nêu một vấn đề</code></pre>
<h3>Key phrases</h3>
<ul>
<li><strong>Giving opinions:</strong> "In my opinion..." / "From my point of view..." / "I think we should..."</li>
<li><strong>Agreeing:</strong> "I agree with you because..." / "That's a good point."</li>
<li><strong>Disagreeing (politely):</strong> "I see your point, but..." / "I'm not sure I agree, because..."</li>
<li><strong>Moving on:</strong> "Shall we move on to the next item?" / "Let's come back to that later."</li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>Chair: Let's move to item two: the new supplier contract.
       What do you all think?
A: In my opinion, the new supplier offers better prices.
B: I see your point, but their delivery times are longer.
A: That's true, but I think the savings are worth it.
Chair: OK, let's note that as an action point for Procurement
       to review by Friday.</code></pre>
<h3>Grammar focus: softening opinions</h3>
<p>Direct opinions can sound too strong in meetings. Soften them with <em>"I think..."</em>, <em>"I'm not sure, but..."</em>, or <em>"It seems to me that..."</em> instead of a flat statement. To disagree politely, acknowledge first: <em>"I see your point, but..."</em> rather than "You're wrong."</p>
<div class="callout"><span class="badge">Tip</span> "Shall we...?" is a very common, polite way to suggest the next step in a meeting — softer than "Let's...".</div>`,
    `<span class="eyebrow">ENM302 · Chương 5 · Bài 5.1</span>
<h2>Họp &amp; nêu ý kiến</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>agenda         - chương trình họp
minutes         - biên bản họp
action points   - việc cần làm sau họp
chairperson     - người chủ trì
attendee        - người tham dự
to raise a point - nêu một vấn đề</code></pre>
<h3>Mẫu câu chính</h3>
<ul>
<li><strong>Nêu ý kiến:</strong> "In my opinion..." / "From my point of view..." / "I think we should..."</li>
<li><strong>Đồng ý:</strong> "I agree with you because..." / "That's a good point."</li>
<li><strong>Không đồng ý (lịch sự):</strong> "I see your point, but..." / "I'm not sure I agree, because..."</li>
<li><strong>Chuyển ý:</strong> "Shall we move on to the next item?" / "Let's come back to that later."</li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>Chair: Let's move to item two: the new supplier contract.
       What do you all think?
A: In my opinion, the new supplier offers better prices.
B: I see your point, but their delivery times are longer.
A: That's true, but I think the savings are worth it.
Chair: OK, let's note that as an action point for Procurement
       to review by Friday.</code></pre>
<h3>Ngữ pháp trọng tâm: làm dịu ý kiến</h3>
<p>Ý kiến quá trực tiếp có thể nghe gay gắt trong họp. Làm dịu bằng <em>"I think..."</em>, <em>"I'm not sure, but..."</em>, hoặc <em>"It seems to me that..."</em> thay vì nói thẳng như một khẳng định. Để không đồng ý lịch sự, hãy công nhận trước: <em>"I see your point, but..."</em> thay vì "You're wrong."</p>
<div class="callout"><span class="badge">Lưu ý</span> "Shall we...?" là cách rất phổ biến, lịch sự để đề xuất bước tiếp theo trong họp — nhẹ nhàng hơn "Let's...".</div>`,
  ]]);

const c5q = quiz('enm302-quiz-5', 'Quiz 5 — Meetings & opinions|||Quiz 5 — Họp & nêu ý kiến', [
  { id: 'q1', question: '"Minutes" trong ngữ cảnh họp nghĩa là?', options: ['Số phút họp kéo dài', 'Biên bản họp', 'Chương trình họp', 'Người chủ trì'], correctIndex: 1, explanation: '"Minutes" (danh từ số nhiều) = biên bản ghi lại nội dung cuộc họp.' },
  { id: 'q2', question: 'Cách lịch sự nhất để KHÔNG đồng ý trong họp?', options: ["You're wrong.", 'I see your point, but...', 'No way.', 'That is a bad idea.'], correctIndex: 1, explanation: 'Công nhận ý kiến trước ("I see your point") rồi mới nêu quan điểm khác nghe lịch sự hơn.' },
  { id: 'q3', question: '"Shall we move on to the next item?" dùng để?', options: ['Kết thúc cuộc họp', 'Đề xuất chuyển sang nội dung tiếp theo', 'Yêu cầu nghỉ giải lao', 'Phản đối chương trình họp'], correctIndex: 1, explanation: '"Shall we...?" là cách lịch sự đề xuất bước/nội dung kế tiếp.' },
]);

const c6 = doc('enm302-6-1-products-data', '6.1 — Products, services & describing data|||6.1 — Sản phẩm, dịch vụ & mô tả số liệu',
  'Từ vựng: feature, benefit, market share, revenue. Mô tả xu hướng (rise/fall/peak). Hội thoại thuyết trình sản phẩm. Ngữ pháp: so sánh & động từ/trạng từ mô tả xu hướng.',
  [[
    `<span class="eyebrow">ENM302 · Chapter 6 · Lesson 6.1</span>
<h2>Products, services &amp; describing data</h2>
<h3>Target vocabulary</h3>
<pre><code>feature          - tính năng
benefit           - lợi ích
market share      - thị phần
revenue           - doanh thu
growth / decline  - tăng trưởng / suy giảm
rise / fall       - tăng / giảm
peak / bottom out - đạt đỉnh / chạm đáy
fluctuate         - dao động</code></pre>
<h3>Key phrases</h3>
<ul>
<li><strong>Describing a product:</strong> "This product is designed to..." / "One of its main features is..." / "It's ideal for..."</li>
<li><strong>Describing data:</strong> "Sales increased by 15% compared to last year." / "Revenue rose sharply in Q2 before leveling off."</li>
<li><strong>Comparing:</strong> "This model is more efficient than the previous one." / "It's the best-selling product in our range."</li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>A: Can you tell me about this new product?
B: Sure. It's designed to save energy — one of its main
   features is the smart sensor that adjusts automatically.
A: How have sales performed so far?
B: Sales increased by 20% in the first quarter and are
   still rising steadily.</code></pre>
<h3>Grammar focus: comparatives &amp; trend verbs</h3>
<p>Use <strong>comparatives/superlatives</strong> to compare products: <em>more efficient than</em>, <em>the best-selling</em>. To describe data trends, combine a <strong>verb + adverb</strong>: <em>increased sharply</em>, <em>fell slightly</em>, <em>rose steadily</em>. The verb shows direction; the adverb shows how fast/strong the change was.</p>
<div class="callout"><span class="badge">Tip</span> "Increase/rise" = go up; "decrease/fall/decline" = go down; "level off" = stop changing, stay flat.</div>`,
    `<span class="eyebrow">ENM302 · Chương 6 · Bài 6.1</span>
<h2>Sản phẩm, dịch vụ &amp; mô tả số liệu</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>feature          - tính năng
benefit           - lợi ích
market share      - thị phần
revenue           - doanh thu
growth / decline  - tăng trưởng / suy giảm
rise / fall       - tăng / giảm
peak / bottom out - đạt đỉnh / chạm đáy
fluctuate         - dao động</code></pre>
<h3>Mẫu câu chính</h3>
<ul>
<li><strong>Mô tả sản phẩm:</strong> "This product is designed to..." / "One of its main features is..." / "It's ideal for..."</li>
<li><strong>Mô tả số liệu:</strong> "Sales increased by 15% compared to last year." / "Revenue rose sharply in Q2 before leveling off."</li>
<li><strong>So sánh:</strong> "This model is more efficient than the previous one." / "It's the best-selling product in our range."</li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>A: Can you tell me about this new product?
B: Sure. It's designed to save energy — one of its main
   features is the smart sensor that adjusts automatically.
A: How have sales performed so far?
B: Sales increased by 20% in the first quarter and are
   still rising steadily.</code></pre>
<h3>Ngữ pháp trọng tâm: so sánh &amp; động từ mô tả xu hướng</h3>
<p>Dùng <strong>so sánh hơn/nhất</strong> để so sánh sản phẩm: <em>more efficient than</em>, <em>the best-selling</em>. Để mô tả xu hướng số liệu, kết hợp <strong>động từ + trạng từ</strong>: <em>increased sharply</em>, <em>fell slightly</em>, <em>rose steadily</em>. Động từ cho biết chiều hướng; trạng từ cho biết mức độ/tốc độ thay đổi.</p>
<div class="callout"><span class="badge">Lưu ý</span> "Increase/rise" = tăng lên; "decrease/fall/decline" = giảm xuống; "level off" = ngừng thay đổi, đi ngang.</div>`,
  ]]);

const c6q = quiz('enm302-quiz-6', 'Quiz 6 — Products & data|||Quiz 6 — Sản phẩm & số liệu', [
  { id: 'q1', question: '"Revenue rose sharply" nghĩa là?', options: ['Doanh thu giảm mạnh', 'Doanh thu tăng mạnh', 'Doanh thu không đổi', 'Doanh thu dao động'], correctIndex: 1, explanation: '"Rose" (quá khứ của "rise") + "sharply" = tăng mạnh.' },
  { id: 'q2', question: 'Chọn câu so sánh đúng ngữ pháp:', options: ['This model is efficient than the old one.', 'This model is more efficient than the old one.', 'This model is most efficient than the old one.', 'This model is efficienter than the old one.'], correctIndex: 1, explanation: 'So sánh hơn với tính từ dài: more + adj + than.' },
  { id: 'q3', question: '"Level off" trong mô tả số liệu nghĩa là?', options: ['Tăng vọt', 'Giảm mạnh', 'Đi ngang, không đổi', 'Dao động liên tục'], correctIndex: 2, explanation: '"Level off" = xu hướng dừng lại, đi ngang sau khi tăng/giảm.' },
]);

const c7 = doc('enm302-7-1-socializing', '7.1 — Socializing & small talk|||7.1 — Giao tiếp xã hội & small talk',
  'Từ vựng & chủ đề small talk (thời tiết, cuối tuần, du lịch). Mẫu câu bắt chuyện, giữ liên lạc. Hội thoại bữa tối công việc. Ngữ pháp: câu hỏi & thì quá khứ đơn cho việc gần đây.',
  [[
    `<span class="eyebrow">ENM302 · Chapter 7 · Lesson 7.1</span>
<h2>Socializing &amp; small talk</h2>
<h3>Target vocabulary</h3>
<pre><code>small talk       - chuyện xã giao, nói chuyện phiếm
networking        - kết nối, mở rộng quan hệ
business lunch/dinner - bữa ăn công việc
keep in touch     - giữ liên lạc
break the ice     - phá vỡ sự im lặng, mở đầu câu chuyện</code></pre>
<h3>Key phrases</h3>
<ul>
<li><strong>Starting small talk:</strong> "How was your weekend?" / "Did you have a good trip?" / "Have you been to this conference before?"</li>
<li><strong>Weather/neutral topics:</strong> "Nice weather we're having, isn't it?" / "How's business been lately?"</li>
<li><strong>Ending politely:</strong> "It was great talking to you." / "Let's keep in touch." / "Here's my card."</li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>A: Hi, I don't think we've met. I'm Nam, from the Sales team.
B: Hi Nam, I'm Anna. Nice to meet you. Did you have a good
   trip here?
A: Yes, it was smooth, thanks. How was your weekend?
B: Pretty relaxing, thanks — I went hiking with some friends.
A: That sounds nice! Well, it was great talking to you.
   Let's keep in touch.
B: Definitely. Here's my card.</code></pre>
<h3>Grammar focus: questions &amp; Past Simple for recent events</h3>
<p>Small talk relies on <strong>questions</strong> to keep the conversation going: <em>"Did you...?"</em>, <em>"Have you...?"</em>, <em>"How was...?"</em>. Use the <strong>Past Simple</strong> for a finished recent event: <em>"How was your weekend?"</em>, <em>"Did you have a good trip?"</em> — not the present.</p>
<div class="callout"><span class="badge">Tip</span> Safe small-talk topics: travel, the weather, weekends, local food. Avoid politics, salary, and personal/religious topics with people you've just met.</div>`,
    `<span class="eyebrow">ENM302 · Chương 7 · Bài 7.1</span>
<h2>Giao tiếp xã hội &amp; small talk</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>small talk       - chuyện xã giao, nói chuyện phiếm
networking        - kết nối, mở rộng quan hệ
business lunch/dinner - bữa ăn công việc
keep in touch     - giữ liên lạc
break the ice     - phá vỡ sự im lặng, mở đầu câu chuyện</code></pre>
<h3>Mẫu câu chính</h3>
<ul>
<li><strong>Bắt đầu small talk:</strong> "How was your weekend?" / "Did you have a good trip?" / "Have you been to this conference before?"</li>
<li><strong>Chủ đề trung tính (thời tiết/công việc):</strong> "Nice weather we're having, isn't it?" / "How's business been lately?"</li>
<li><strong>Kết thúc lịch sự:</strong> "It was great talking to you." / "Let's keep in touch." / "Here's my card."</li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>A: Hi, I don't think we've met. I'm Nam, from the Sales team.
B: Hi Nam, I'm Anna. Nice to meet you. Did you have a good
   trip here?
A: Yes, it was smooth, thanks. How was your weekend?
B: Pretty relaxing, thanks — I went hiking with some friends.
A: That sounds nice! Well, it was great talking to you.
   Let's keep in touch.
B: Definitely. Here's my card.</code></pre>
<h3>Ngữ pháp trọng tâm: câu hỏi &amp; quá khứ đơn cho việc gần đây</h3>
<p>Small talk dựa vào <strong>câu hỏi</strong> để duy trì cuộc nói chuyện: <em>"Did you...?"</em>, <em>"Have you...?"</em>, <em>"How was...?"</em>. Dùng <strong>quá khứ đơn (Past Simple)</strong> cho việc đã kết thúc gần đây: <em>"How was your weekend?"</em>, <em>"Did you have a good trip?"</em> — không dùng hiện tại.</p>
<div class="callout"><span class="badge">Lưu ý</span> Chủ đề small talk an toàn: du lịch, thời tiết, cuối tuần, ẩm thực địa phương. Tránh chính trị, lương bổng và chủ đề cá nhân/tôn giáo với người mới gặp.</div>`,
  ]]);

const c7q = quiz('enm302-quiz-7', 'Quiz 7 — Socializing|||Quiz 7 — Giao tiếp xã hội', [
  { id: 'q1', question: 'Câu hỏi small talk phù hợp khi vừa gặp ai đó sau chuyến bay?', options: ['How much do you earn?', 'Did you have a good trip?', 'Why are you late?', 'What is your religion?'], correctIndex: 1, explanation: '"Did you have a good trip?" là câu hỏi xã giao an toàn, dùng quá khứ đơn.' },
  { id: 'q2', question: 'Chủ đề nên TRÁNH khi small talk với người mới gặp?', options: ['Thời tiết', 'Cuối tuần', 'Lương bổng cá nhân', 'Chuyến đi công tác'], correctIndex: 2, explanation: 'Lương bổng, chính trị, tôn giáo là chủ đề nên tránh khi mới gặp.' },
  { id: 'q3', question: 'Cách kết thúc small talk lịch sự?', options: ['Bye, I have to go now.', 'It was great talking to you. Let\'s keep in touch.', 'OK, done talking.', 'I have nothing more to say.'], correctIndex: 1, explanation: '"It was great talking to you. Let\'s keep in touch." là cách kết thúc lịch sự, chuyên nghiệp.' },
]);

const c8 = doc('enm302-8-1-company-culture', '8.1 — Company culture & workplace English|||8.1 — Văn hoá công ty & tiếng Anh công sở',
  'Từ vựng: values, mission statement, teamwork, work-life balance, deadline, feedback. Mẫu câu về giá trị công ty & phản hồi. Ngữ pháp: modal verbs cho quy định (must/have to/should).',
  [[
    `<span class="eyebrow">ENM302 · Chapter 8 · Lesson 8.1</span>
<h2>Company culture &amp; workplace English</h2>
<h3>Target vocabulary</h3>
<pre><code>values             - giá trị (cốt lõi)
mission statement  - tuyên bố sứ mệnh
teamwork            - làm việc nhóm
work-life balance  - cân bằng công việc & cuộc sống
deadline            - hạn chót
feedback            - phản hồi, góp ý
performance review - đánh giá hiệu suất</code></pre>
<h3>Key phrases</h3>
<ul>
<li><strong>Describing culture:</strong> "Our company values honesty and teamwork." / "We believe in a healthy work-life balance."</li>
<li><strong>Company policy (rules):</strong> "All employees must complete the training." / "You don't have to come in on weekends." / "You should submit the report by Friday."</li>
<li><strong>Feedback:</strong> "Could you give me some feedback on my report?" / "I really appreciate your input." / "One thing you could improve is..."</li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>A: How would you describe the culture here?
B: Honestly, it's great. The company really values teamwork
   and a healthy work-life balance.
A: Are there strict rules about working hours?
B: Not really — we must finish our tasks by the deadline,
   but we don't have to be in the office at fixed hours.
A: That's flexible. Could you give me some feedback on my
   report before I submit it?
B: Sure, happy to help.</code></pre>
<h3>Grammar focus: must / have to / should</h3>
<p><strong>Must</strong> and <strong>have to</strong> both express obligation, but <em>must</em> often comes from the speaker's authority/rules, while <em>have to</em> often refers to an outside rule. <strong>Don't have to</strong> = it's not necessary (not the same as "mustn't" = it's forbidden!). Use <strong>should</strong> for advice/recommendation, not a strict rule: <em>"You should submit the report by Friday"</em> (a suggestion).</p>
<div class="callout"><span class="badge">Common mistake</span> "Don't have to" ≠ "mustn't". "You don't have to work Saturday" (optional) vs. "You mustn't smoke here" (forbidden).</div>`,
    `<span class="eyebrow">ENM302 · Chương 8 · Bài 8.1</span>
<h2>Văn hoá công ty &amp; tiếng Anh công sở</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>values             - giá trị (cốt lõi)
mission statement  - tuyên bố sứ mệnh
teamwork            - làm việc nhóm
work-life balance  - cân bằng công việc & cuộc sống
deadline            - hạn chót
feedback            - phản hồi, góp ý
performance review - đánh giá hiệu suất</code></pre>
<h3>Mẫu câu chính</h3>
<ul>
<li><strong>Mô tả văn hoá:</strong> "Our company values honesty and teamwork." / "We believe in a healthy work-life balance."</li>
<li><strong>Quy định công ty:</strong> "All employees must complete the training." / "You don't have to come in on weekends." / "You should submit the report by Friday."</li>
<li><strong>Phản hồi:</strong> "Could you give me some feedback on my report?" / "I really appreciate your input." / "One thing you could improve is..."</li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>A: How would you describe the culture here?
B: Honestly, it's great. The company really values teamwork
   and a healthy work-life balance.
A: Are there strict rules about working hours?
B: Not really — we must finish our tasks by the deadline,
   but we don't have to be in the office at fixed hours.
A: That's flexible. Could you give me some feedback on my
   report before I submit it?
B: Sure, happy to help.</code></pre>
<h3>Ngữ pháp trọng tâm: must / have to / should</h3>
<p><strong>Must</strong> và <strong>have to</strong> đều diễn tả sự bắt buộc, nhưng <em>must</em> thường xuất phát từ ý muốn/quy tắc của người nói, còn <em>have to</em> thường là quy định từ bên ngoài. <strong>Don't have to</strong> = không cần thiết (KHÁC với "mustn't" = bị cấm!). Dùng <strong>should</strong> cho lời khuyên/gợi ý, không phải quy tắc bắt buộc: <em>"You should submit the report by Friday"</em> (một gợi ý).</p>
<div class="callout"><span class="badge">Lỗi thường gặp</span> "Don't have to" ≠ "mustn't". "You don't have to work Saturday" (không bắt buộc) khác với "You mustn't smoke here" (bị cấm).</div>`,
  ]]);

const c8q = quiz('enm302-quiz-8', 'Quiz 8 — Company culture|||Quiz 8 — Văn hoá công ty', [
  { id: 'q1', question: '"You don\'t have to come in on weekends" nghĩa là?', options: ['Bị cấm đi làm cuối tuần', 'Không bắt buộc đi làm cuối tuần', 'Bắt buộc đi làm cuối tuần', 'Nên đi làm cuối tuần'], correctIndex: 1, explanation: '"Don\'t have to" = không cần thiết/không bắt buộc, khác với "mustn\'t" (bị cấm).' },
  { id: 'q2', question: 'Câu nào dùng đúng "should" để đưa ra lời khuyên/gợi ý?', options: ['You should submit the report by Friday.', 'You should to submit the report.', 'You must should submit the report.', 'You shoulding submit the report.'], correctIndex: 0, explanation: '"Should" + động từ nguyên mẫu (không "to"), dùng cho lời khuyên.' },
  { id: 'q3', question: '"Feedback" trong công sở nghĩa là?', options: ['Hạn chót nộp bài', 'Phản hồi, góp ý về công việc', 'Tuyên bố sứ mệnh công ty', 'Đánh giá lương'], correctIndex: 1, explanation: '"Feedback" = ý kiến phản hồi, góp ý (thường về hiệu suất/công việc).' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'ENM302',
    slug: 'enm302-business-english-level-1',
    title: 'Business English - Level 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ENM302.webp',
    shortDescription: 'Practical Business English: introductions, jobs & departments, phone calls, emails, meetings, describing products & data, small talk, workplace culture. Bilingual, with vocabulary, sample dialogues, grammar focus & quizzes.|||Tiếng Anh thương mại thực dụng: giới thiệu, công việc & phòng ban, gọi điện, email, họp, mô tả sản phẩm & số liệu, giao tiếp xã hội, văn hoá công ty. Song ngữ, có từ vựng, hội thoại mẫu, ngữ pháp trọng tâm & quiz.',
    description: 'Môn <strong>ENM302 — Business English - Level 1</strong> (kỳ 1, khối Quản trị Kinh doanh) xây dựng <strong>tiếng Anh dùng trong công việc</strong>. Từ <strong>giới thiệu bản thân &amp; công ty</strong> → <strong>công việc, trách nhiệm &amp; phòng ban</strong> → <strong>gọi điện &amp; hẹn gặp</strong> → <strong>email &amp; thư tín thương mại</strong> → <strong>họp &amp; nêu ý kiến</strong> → <strong>sản phẩm, dịch vụ &amp; mô tả số liệu</strong> → <strong>giao tiếp xã hội</strong> → <strong>văn hoá công ty &amp; tiếng Anh công sở</strong>. Tham khảo Market Leader (Pearson), Business Result (OUP), English for Business Communication (Cambridge); song ngữ, có từ vựng, mẫu câu, hội thoại và quiz mỗi chương.',
    whatYouLearn: 'Giới thiệu bản thân & công ty (Present Simple); phòng ban & chức danh, "responsible for" + gerund; gọi điện & hẹn gặp (Could/Would, hiện tại tiếp diễn); viết email trang trọng; nêu & bảo vệ ý kiến trong họp; mô tả sản phẩm & xu hướng số liệu (so sánh, động từ xu hướng); small talk & giao tiếp xã hội; văn hoá công ty, must/have to/should, cho & nhận feedback.',
    requirements: 'Trình độ tiếng Anh cơ bản (tương đương A2). Không yêu cầu kiến thức chuyên ngành trước đó.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách tham khảo (Market Leader, Business Result, English for Business Communication), tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tiếng Anh dùng trong công việc, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Giới thiệu bản thân & công ty|||Chapter 1 — Introductions', description: 'Từ vựng, mẫu câu, hội thoại, Present Simple.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Công việc & phòng ban|||Chapter 2 — Jobs & departments', description: 'Phòng ban, chức danh, "responsible for".', lessons: [c2, c2q] },
    { title: 'Chương 3 — Gọi điện & hẹn gặp|||Chapter 3 — Telephoning', description: 'Từ vựng điện thoại, Could/Would, hiện tại tiếp diễn.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Email & thư tín|||Chapter 4 — Emails', description: 'Cấu trúc email, văn phong trang trọng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Họp & nêu ý kiến|||Chapter 5 — Meetings & opinions', description: 'Nêu ý kiến, đồng ý/không đồng ý lịch sự.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Sản phẩm & mô tả số liệu|||Chapter 6 — Products & data', description: 'So sánh, động từ mô tả xu hướng.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Giao tiếp xã hội|||Chapter 7 — Socializing', description: 'Small talk, câu hỏi, quá khứ đơn.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Văn hoá công ty|||Chapter 8 — Company culture', description: 'Must/have to/should, feedback.', lessons: [c8, c8q] },
  ],
};
