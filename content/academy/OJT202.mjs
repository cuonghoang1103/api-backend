/**
 * OJT202 — On the Job Training (kỳ thực tập doanh nghiệp, ngành SE FPTU).
 * Không phải lý thuyết hàn lâm — đây là CẨM NANG thực tập chuyên nghiệp:
 * chuẩn bị hồ sơ → tìm & ứng tuyển → hoà nhập doanh nghiệp → kỹ năng làm việc
 * thực tế → nhật ký & minh chứng → viết báo cáo & bảo vệ → đạo đức nghề nghiệp.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n; "&"→&amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ojt202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: quy định & biểu mẫu OJT (FLM/FAP), tài liệu miễn phí viết CV/phỏng vấn, YouTube chuẩn bị phỏng vấn IT, công cụ (LinkedIn, ITviec/TopCV, Git/Jira), lộ trình 4 bước.',
  [[
    `<span class="eyebrow">OJT202 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need for a successful internship — from writing a CV to defending your final report — gathered in one place. The official OJT regulations, forms and evaluation rubric live on <strong>FLM/FAP</strong>; below are free, legal resources to prepare.</p>
<h3>📘 OJT regulations &amp; forms</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — official OJT syllabus, weekly log template, report template &amp; evaluation rubric. Sign in with your FPTU account.</li>
<li><a href="https://fap.fpt.edu.vn" target="_blank" rel="noopener">FAP (fap.fpt.edu.vn)</a> — OJT registration, company confirmation form, supervisor evaluation submission.</li>
</ul>
<h3>🌐 Free CV, cover letter &amp; interview guides</h3>
<ul>
<li><a href="https://www.themuse.com/advice" target="_blank" rel="noopener">The Muse — Career Advice</a> — CV, cover letter &amp; interview articles.</li>
<li><a href="https://www.freecodecamp.org/news/tag/career/" target="_blank" rel="noopener">freeCodeCamp — Career</a> — landing your first developer job.</li>
<li><a href="https://www.thebalancemoney.com/job-searching-4161976" target="_blank" rel="noopener">The Balance — Job Searching</a> — resumes, applications &amp; interviews.</li>
</ul>
<h3>▶️ YouTube — IT interview prep</h3>
<ul>
<li><a href="https://www.youtube.com/@NeetCode" target="_blank" rel="noopener">NeetCode</a> — coding interview patterns &amp; technical practice.</li>
<li><a href="https://www.youtube.com/@LifeatGoogle" target="_blank" rel="noopener">Life at Google</a> — how tech interviews really work.</li>
</ul>
<h3>🛠️ Tools you'll use</h3>
<ul>
<li><a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a> — professional profile &amp; networking.</li>
<li><a href="https://itviec.com/" target="_blank" rel="noopener">ITviec</a> &amp; <a href="https://www.topcv.vn/" target="_blank" rel="noopener">TopCV</a> — IT job boards in Vietnam.</li>
<li><a href="https://git-scm.com/doc" target="_blank" rel="noopener">Git</a> &amp; <a href="https://www.atlassian.com/software/jira/guides" target="_blank" rel="noopener">Jira</a> — the version control &amp; task tools every team uses.</li>
</ul>
<div class="callout"><span class="badge">4-step roadmap</span>
<ol>
<li><strong>Prepare</strong> — polish your CV, build a GitHub portfolio, drill technical &amp; behavioral interviews.</li>
<li><strong>Apply</strong> — target companies on ITviec/TopCV/LinkedIn, use your network, attend job fairs.</li>
<li><strong>Intern</strong> — integrate into the team, follow Git/Scrum, ask good questions, keep a daily log.</li>
<li><strong>Report</strong> — collect evidence, write a reflective OJT report, and defend it.</li>
</ol></div>`,
    `<span class="eyebrow">OJT202 · Tài liệu</span>
<h2>Trung tâm tài liệu &amp; nguồn tham khảo</h2>
<p class="lead">Mọi thứ cho một kỳ thực tập thành công — từ viết CV đến bảo vệ báo cáo cuối — gom về một chỗ. Quy định OJT, biểu mẫu và bảng chấm chính thức nằm trên <strong>FLM/FAP</strong>; bên dưới là nguồn miễn phí, hợp pháp để chuẩn bị.</p>
<h3>📘 Quy định &amp; biểu mẫu OJT</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — syllabus OJT chính thức, mẫu nhật ký tuần, mẫu báo cáo &amp; bảng tiêu chí chấm. Đăng nhập bằng tài khoản FPTU.</li>
<li><a href="https://fap.fpt.edu.vn" target="_blank" rel="noopener">FAP (fap.fpt.edu.vn)</a> — đăng ký OJT, phiếu xác nhận công ty, nộp phiếu đánh giá của người hướng dẫn.</li>
</ul>
<h3>🌐 Hướng dẫn viết CV, thư xin việc &amp; phỏng vấn (miễn phí)</h3>
<ul>
<li><a href="https://www.themuse.com/advice" target="_blank" rel="noopener">The Muse — Career Advice</a> — bài viết về CV, thư xin việc &amp; phỏng vấn.</li>
<li><a href="https://www.freecodecamp.org/news/tag/career/" target="_blank" rel="noopener">freeCodeCamp — Career</a> — cách kiếm việc lập trình đầu tiên.</li>
<li><a href="https://www.thebalancemoney.com/job-searching-4161976" target="_blank" rel="noopener">The Balance — Job Searching</a> — CV, hồ sơ &amp; phỏng vấn.</li>
</ul>
<h3>▶️ YouTube — chuẩn bị phỏng vấn IT</h3>
<ul>
<li><a href="https://www.youtube.com/@NeetCode" target="_blank" rel="noopener">NeetCode</a> — mẫu bài phỏng vấn code &amp; luyện kỹ thuật.</li>
<li><a href="https://www.youtube.com/@LifeatGoogle" target="_blank" rel="noopener">Life at Google</a> — phỏng vấn công nghệ diễn ra thế nào.</li>
</ul>
<h3>🛠️ Công cụ bạn sẽ dùng</h3>
<ul>
<li><a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a> — hồ sơ chuyên nghiệp &amp; kết nối mạng lưới.</li>
<li><a href="https://itviec.com/" target="_blank" rel="noopener">ITviec</a> &amp; <a href="https://www.topcv.vn/" target="_blank" rel="noopener">TopCV</a> — sàn tuyển dụng IT tại Việt Nam.</li>
<li><a href="https://git-scm.com/doc" target="_blank" rel="noopener">Git</a> &amp; <a href="https://www.atlassian.com/software/jira/guides" target="_blank" rel="noopener">Jira</a> — công cụ quản lý mã &amp; công việc mọi đội đều dùng.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình 4 bước</span>
<ol>
<li><strong>Chuẩn bị</strong> — chỉnh CV, dựng portfolio GitHub, luyện phỏng vấn kỹ thuật &amp; hành vi.</li>
<li><strong>Ứng tuyển</strong> — nhắm công ty trên ITviec/TopCV/LinkedIn, dùng mạng lưới, dự hội chợ việc làm.</li>
<li><strong>Thực tập</strong> — hoà nhập đội, theo Git/Scrum, hỏi đúng cách, ghi nhật ký mỗi ngày.</li>
<li><strong>Báo cáo</strong> — thu thập minh chứng, viết báo cáo OJT có phản tư, và bảo vệ.</li>
</ol></div>`,
  ]]);

const intro = doc('ojt202-0-1-overview', 'What is OJT? Goals, credits & assessment|||OJT là gì? Mục tiêu, tín chỉ & đánh giá',
  'OJT là gì và vì sao là bước ngoặt của kỳ 6; mục tiêu chuẩn đầu ra; số tín chỉ &amp; thời lượng; điều kiện đăng ký; cách đánh giá (công ty + báo cáo + bảo vệ).',
  [[
    `<span class="eyebrow">OJT202 · Overview</span>
<h2>On the Job Training (OJT)</h2>
<p class="lead"><strong>OJT202</strong> is the FPTU internship semester (semester 6) where you leave the classroom and work inside a real software company — usually <strong>full-time for 3–4 months</strong>. It is the bridge between "studying software engineering" and "being a software engineer".</p>
<h3>Why it matters</h3>
<ul>
<li>You apply what you learned (coding, testing, databases, teamwork) to <strong>real products with real users</strong>.</li>
<li>You learn things a classroom cannot teach: company culture, code review, deadlines, communicating with a mentor and a team.</li>
<li>A strong internship often <strong>converts into a full-time job offer</strong> — and always becomes the first real line on your CV.</li>
</ul>
<h3>Credits &amp; format</h3>
<p>OJT202 typically carries <strong>a full block of credits</strong> for one semester of full-time work at a company that has an agreement with, or is accepted by, the university. You have a <strong>company supervisor (mentor)</strong> and a <strong>university coordinator</strong>.</p>
<h3>How you're assessed</h3>
<pre><code>Final OJT grade = company supervisor evaluation
               + OJT report (written)
               + report defense / presentation
(exact weights: see the official rubric on FLM)</code></pre>
<div class="callout"><span class="badge">Prerequisite reality</span> You must have passed the required earlier subjects and accumulated enough credits before you can register for OJT. Check your standing on FAP <strong>early</strong> — being short by one subject delays the whole internship.</div>`,
    `<span class="eyebrow">OJT202 · Tổng quan</span>
<h2>Thực tập tại doanh nghiệp (OJT)</h2>
<p class="lead"><strong>OJT202</strong> là kỳ thực tập của FPTU (kỳ 6) — bạn rời giảng đường và làm việc bên trong một công ty phần mềm thật, thường là <strong>toàn thời gian 3–4 tháng</strong>. Đây là cây cầu nối giữa "học kỹ thuật phần mềm" và "là một kỹ sư phần mềm".</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li>Bạn áp dụng kiến thức đã học (lập trình, kiểm thử, cơ sở dữ liệu, làm nhóm) vào <strong>sản phẩm thật có người dùng thật</strong>.</li>
<li>Bạn học điều lớp học không dạy được: văn hoá công ty, review code, deadline, giao tiếp với mentor và cả đội.</li>
<li>Một kỳ thực tập tốt thường <strong>chuyển thành lời mời làm chính thức</strong> — và luôn là dòng thật đầu tiên trong CV của bạn.</li>
</ul>
<h3>Tín chỉ &amp; hình thức</h3>
<p>OJT202 thường mang <strong>một khối tín chỉ trọn kỳ</strong> cho một học kỳ làm toàn thời gian tại công ty có thoả thuận, hoặc được trường chấp nhận. Bạn có <strong>người hướng dẫn tại công ty (mentor)</strong> và một <strong>điều phối viên phía trường</strong>.</p>
<h3>Cách đánh giá</h3>
<pre><code>Điểm OJT = đánh giá của người hướng dẫn tại công ty
        + báo cáo OJT (viết)
        + bảo vệ / thuyết trình báo cáo
(trọng số chính xác: xem bảng tiêu chí trên FLM)</code></pre>
<div class="callout"><span class="badge">Sự thật về điều kiện tiên quyết</span> Bạn phải qua các môn học trước bắt buộc và tích luỹ đủ tín chỉ mới được đăng ký OJT. Hãy kiểm tra tình trạng trên FAP <strong>sớm</strong> — thiếu một môn là trễ cả kỳ thực tập.</div>`,
  ]]);

// ── Chapter 1 ──
const c1 = doc('ojt202-1-1-what-is-ojt', '1.1 — OJT, prerequisites & the FPTU process|||1.1 — OJT, điều kiện tiên quyết & quy trình FPTU',
  'OJT là gì và vì sao quan trọng; điều kiện tiên quyết (tín chỉ, môn đã qua); quy trình FPTU: đăng ký → tìm chỗ → xác nhận công ty → thực tập → nộp báo cáo.',
  [[
    `<span class="eyebrow">OJT202 · Chapter 1 · Lesson 1.1</span>
<h2>OJT, prerequisites &amp; the FPTU process</h2>
<h3>What OJT is — and is not</h3>
<p>OJT is <strong>supervised professional work</strong>, not a school project. You are expected to behave like a junior employee: keep working hours, follow the team's process, and deliver real tasks. It is graded, but the real product is <strong>experience and a reference</strong>.</p>
<h3>Prerequisites</h3>
<ul>
<li>Passed the required prior subjects and reached the <strong>credit threshold</strong> set by your program.</li>
<li>No blocking academic debt. Confirm your eligibility on <strong>FAP</strong> before the OJT registration window.</li>
</ul>
<h3>The FPTU OJT process</h3>
<pre><code>1. Register for OJT on FAP (within the window)
2. Find a company (self-sourced or from the university list)
3. Company accepts you -> confirmation form to the coordinator
4. Intern full-time; keep a weekly log; stay in touch with the coordinator
5. Company supervisor fills the evaluation
6. Write the OJT report -> submit -> defend</code></pre>
<div class="callout"><span class="badge">Start early</span> Good companies fill internship slots weeks in advance. Begin your CV and applications <strong>before</strong> the semester starts, not on day one.</div>`,
    `<span class="eyebrow">OJT202 · Chương 1 · Bài 1.1</span>
<h2>OJT, điều kiện tiên quyết &amp; quy trình FPTU</h2>
<h3>OJT là gì — và không phải gì</h3>
<p>OJT là <strong>công việc nghề nghiệp có người giám sát</strong>, không phải đồ án môn học. Bạn được kỳ vọng cư xử như một nhân viên mới: giữ giờ làm, theo quy trình của đội, và hoàn thành công việc thật. Có chấm điểm, nhưng sản phẩm thật là <strong>kinh nghiệm và một người tham chiếu (reference)</strong>.</p>
<h3>Điều kiện tiên quyết</h3>
<ul>
<li>Đã qua các môn học trước bắt buộc và đạt <strong>ngưỡng tín chỉ</strong> chương trình quy định.</li>
<li>Không nợ học vụ chặn. Xác nhận đủ điều kiện trên <strong>FAP</strong> trước hạn đăng ký OJT.</li>
</ul>
<h3>Quy trình OJT của FPTU</h3>
<pre><code>1. Đăng ký OJT trên FAP (trong thời hạn)
2. Tìm công ty (tự tìm hoặc từ danh sách của trường)
3. Công ty nhận -> phiếu xác nhận gửi điều phối viên
4. Thực tập toàn thời gian; ghi nhật ký tuần; giữ liên lạc với điều phối viên
5. Người hướng dẫn tại công ty điền phiếu đánh giá
6. Viết báo cáo OJT -> nộp -> bảo vệ</code></pre>
<div class="callout"><span class="badge">Bắt đầu sớm</span> Công ty tốt lấp đầy suất thực tập trước nhiều tuần. Hãy làm CV và ứng tuyển <strong>trước</strong> khi kỳ học bắt đầu, đừng đợi đến ngày đầu.</div>`,
  ]]);

const c1q = quiz('ojt202-quiz-1', 'Quiz 1 — OJT & the process|||Quiz 1 — OJT & quy trình', [
  { id: 'q1', question: 'OJT202 về bản chất là gì?', options: ['Một đồ án môn học ở trường', 'Kỳ thực tập toàn thời gian tại doanh nghiệp', 'Một kỳ thi vấn đáp', 'Một khoá học online'], correctIndex: 1, explanation: 'OJT là kỳ thực tập có giám sát tại công ty thật, thường 3–4 tháng.' },
  { id: 'q2', question: 'Nên kiểm tra điều kiện tiên quyết (tín chỉ, môn đã qua) ở đâu và khi nào?', options: ['FAP, càng sớm càng tốt trước hạn đăng ký', 'Không cần kiểm tra', 'Chỉ hỏi mentor công ty', 'Sau khi đã thực tập xong'], correctIndex: 0, explanation: 'Thiếu một môn hay chưa đủ tín chỉ sẽ chặn đăng ký — soi FAP sớm.' },
  { id: 'q3', question: 'Bước nào KHÔNG thuộc quy trình OJT của FPTU?', options: ['Đăng ký trên FAP', 'Công ty gửi phiếu xác nhận', 'Tự ý bỏ báo cáo cuối kỳ', 'Viết và bảo vệ báo cáo'], correctIndex: 2, explanation: 'Báo cáo và bảo vệ là bắt buộc; bỏ báo cáo là không hoàn thành môn.' },
]);

// ── Chapter 2 ──
const c2 = doc('ojt202-2-1-cv-portfolio', '2.1 — CV, portfolio & interview prep|||2.1 — CV, portfolio & chuẩn bị phỏng vấn',
  'Viết CV một trang có kết quả đo được; portfolio GitHub (README, dự án chọn lọc); thư xin việc ngắn; chuẩn bị phỏng vấn kỹ thuật (thuật toán, hệ thống nhỏ, kể dự án).',
  [[
    `<span class="eyebrow">OJT202 · Chapter 2 · Lesson 2.1</span>
<h2>CV, portfolio &amp; interview prep</h2>
<h3>A CV that gets read</h3>
<ul>
<li><strong>One page</strong>, clean, reverse-chronological. Sections: contact, summary, skills, projects, education.</li>
<li>Describe projects with <strong>action + result</strong>: "Built a REST API in Node.js serving 3 endpoints; cut query time 40% with an index" beats "worked on backend".</li>
<li>List real <strong>skills</strong> (Java, SQL, Git, React) — not "hardworking". Tailor keywords to the job post.</li>
</ul>
<h3>Portfolio = your GitHub</h3>
<ul>
<li>Pin <strong>2–4 real projects</strong> with a clear <code>README</code> (what it does, how to run, a screenshot).</li>
<li>Clean commit history &amp; a live demo link if possible. Employers <em>will</em> open your GitHub.</li>
</ul>
<h3>Cover letter</h3>
<p>Short (3 short paragraphs): who you are, why <em>this</em> company, what you bring. Address a person if you can.</p>
<h3>Technical interview prep</h3>
<pre><code>- Arrays/strings, hash maps, sorting, recursion, Big-O
- Explain ONE of your projects end to end (design + trade-offs)
- Behavioral: use STAR (Situation, Task, Action, Result)
- Practice out loud; it's a conversation, not a written exam</code></pre>
<div class="callout"><span class="badge">Show, don't tell</span> One well-documented GitHub project convinces a reviewer more than ten adjectives on your CV.</div>`,
    `<span class="eyebrow">OJT202 · Chương 2 · Bài 2.1</span>
<h2>CV, portfolio &amp; chuẩn bị phỏng vấn</h2>
<h3>Một CV được đọc</h3>
<ul>
<li><strong>Một trang</strong>, gọn, sắp xếp mới nhất trước. Các phần: liên hệ, tóm tắt, kỹ năng, dự án, học vấn.</li>
<li>Mô tả dự án theo <strong>hành động + kết quả</strong>: "Xây REST API bằng Node.js với 3 endpoint; giảm 40% thời gian truy vấn nhờ index" hơn hẳn "làm backend".</li>
<li>Liệt kê <strong>kỹ năng thật</strong> (Java, SQL, Git, React) — không phải "chăm chỉ". Chỉnh từ khoá theo tin tuyển.</li>
</ul>
<h3>Portfolio chính là GitHub của bạn</h3>
<ul>
<li>Ghim <strong>2–4 dự án thật</strong> có <code>README</code> rõ (làm gì, chạy sao, một ảnh chụp).</li>
<li>Lịch sử commit sạch &amp; link demo chạy được nếu có. Nhà tuyển dụng <em>sẽ</em> mở GitHub của bạn.</li>
</ul>
<h3>Thư xin việc</h3>
<p>Ngắn (3 đoạn nhỏ): bạn là ai, vì sao <em>công ty này</em>, bạn mang lại gì. Nếu được, ghi tên người nhận cụ thể.</p>
<h3>Chuẩn bị phỏng vấn kỹ thuật</h3>
<pre><code>- Mảng/chuỗi, hash map, sắp xếp, đệ quy, Big-O
- Kể MỘT dự án của bạn từ đầu tới cuối (thiết kế + đánh đổi)
- Hành vi: dùng STAR (Tình huống, Nhiệm vụ, Hành động, Kết quả)
- Luyện nói thành tiếng; đây là hội thoại, không phải bài viết</code></pre>
<div class="callout"><span class="badge">Cho thấy, đừng nói suông</span> Một dự án GitHub tài liệu tốt thuyết phục hơn mười tính từ trên CV.</div>`,
  ]]);

const c2q = quiz('ojt202-quiz-2', 'Quiz 2 — CV & interview|||Quiz 2 — CV & phỏng vấn', [
  { id: 'q1', question: 'Cách mô tả dự án trong CV nào MẠNH nhất?', options: ['"Làm backend"', '"Chăm chỉ, ham học"', '"Xây REST API Node.js, giảm 40% thời gian truy vấn nhờ index"', '"Biết nhiều ngôn ngữ"'], correctIndex: 2, explanation: 'Hành động cụ thể + kết quả đo được thuyết phục nhà tuyển dụng.' },
  { id: 'q2', question: 'STAR trong phỏng vấn hành vi là viết tắt của?', options: ['Situation, Task, Action, Result', 'Speed, Time, Accuracy, Rank', 'Skill, Test, Ability, Role', 'Study, Try, Ask, Repeat'], correctIndex: 0, explanation: 'STAR = Tình huống, Nhiệm vụ, Hành động, Kết quả — khung kể chuyện có cấu trúc.' },
  { id: 'q3', question: 'Vì sao README tốt trên GitHub lại quan trọng khi ứng tuyển?', options: ['Không ai xem GitHub của sinh viên', 'Nhà tuyển dụng sẽ mở GitHub và README cho thấy dự án làm gì, chạy sao', 'README chỉ để trang trí', 'Chỉ cần nhiều commit là đủ'], correctIndex: 1, explanation: 'Portfolio GitHub là bằng chứng năng lực; README rõ giúp người review hiểu ngay.' },
]);

// ── Chapter 3 ──
const c3 = doc('ojt202-3-1-find-apply', '3.1 — Finding & applying for an internship|||3.1 — Tìm & ứng tuyển thực tập',
  'Kênh tìm việc (ITviec, TopCV, LinkedIn, danh sách trường); xây mạng lưới; dự hội chợ việc làm; ứng tuyển có chọn lọc, theo dõi, và ứng xử sau phỏng vấn.',
  [[
    `<span class="eyebrow">OJT202 · Chapter 3 · Lesson 3.1</span>
<h2>Finding &amp; applying for an internship</h2>
<h3>Where to look</h3>
<ul>
<li><strong>Job boards:</strong> <a href="https://itviec.com/" target="_blank" rel="noopener">ITviec</a>, <a href="https://www.topcv.vn/" target="_blank" rel="noopener">TopCV</a> — filter for "intern / fresher".</li>
<li><strong>LinkedIn:</strong> follow companies, turn on job alerts, message recruiters politely.</li>
<li><strong>University list &amp; partner companies</strong> — the coordinator's list is a shortcut to accepted employers.</li>
</ul>
<h3>Networking &amp; job fairs</h3>
<ul>
<li>Tell seniors, alumni and lecturers you're looking — <strong>referrals</strong> beat cold applications.</li>
<li>At a <strong>job fair</strong>: bring printed CVs, a 30-second self-intro, and questions for each booth.</li>
</ul>
<h3>Apply smart, not spray-and-pray</h3>
<pre><code>- Tailor the CV keywords to each posting
- Track applications in a sheet (company / date / status)
- Follow up politely after ~1 week of silence
- After an interview: send a short thank-you note</code></pre>
<div class="callout"><span class="badge">Rejection is data</span> Not hearing back is normal. Apply widely, learn from each interview, and keep the pipeline full instead of waiting on one company.</div>`,
    `<span class="eyebrow">OJT202 · Chương 3 · Bài 3.1</span>
<h2>Tìm &amp; ứng tuyển thực tập</h2>
<h3>Tìm ở đâu</h3>
<ul>
<li><strong>Sàn tuyển dụng:</strong> <a href="https://itviec.com/" target="_blank" rel="noopener">ITviec</a>, <a href="https://www.topcv.vn/" target="_blank" rel="noopener">TopCV</a> — lọc "intern / fresher".</li>
<li><strong>LinkedIn:</strong> theo dõi công ty, bật thông báo việc, nhắn nhà tuyển dụng lịch sự.</li>
<li><strong>Danh sách trường &amp; công ty đối tác</strong> — danh sách của điều phối viên là đường tắt tới nhà tuyển dụng đã được chấp nhận.</li>
</ul>
<h3>Mạng lưới &amp; hội chợ việc làm</h3>
<ul>
<li>Nói với anh chị khoá trên, cựu sinh viên và giảng viên rằng bạn đang tìm — <strong>được giới thiệu</strong> hơn ứng tuyển lạnh.</li>
<li>Tại <strong>hội chợ việc làm</strong>: mang CV in, một lời tự giới thiệu 30 giây, và câu hỏi cho từng gian.</li>
</ul>
<h3>Ứng tuyển có chọn lọc, đừng rải vô tội vạ</h3>
<pre><code>- Chỉnh từ khoá CV theo từng tin tuyển
- Theo dõi trong một bảng (công ty / ngày / trạng thái)
- Nhắc lại lịch sự sau ~1 tuần im lặng
- Sau phỏng vấn: gửi lời cảm ơn ngắn</code></pre>
<div class="callout"><span class="badge">Bị từ chối là dữ liệu</span> Không hồi âm là chuyện thường. Hãy ứng tuyển rộng, học từ mỗi lần phỏng vấn, và giữ nhiều cơ hội thay vì chờ một công ty.</div>`,
  ]]);

const c3q = quiz('ojt202-quiz-3', 'Quiz 3 — Finding & applying|||Quiz 3 — Tìm & ứng tuyển', [
  { id: 'q1', question: 'Đâu là kênh phù hợp để tìm thực tập IT tại Việt Nam?', options: ['ITviec và TopCV', 'Chỉ hỏi bạn cùng lớp', 'Chờ công ty tự gọi', 'Không cần tìm, trường tự xếp hết'], correctIndex: 0, explanation: 'ITviec/TopCV/LinkedIn và danh sách công ty đối tác của trường là các kênh chính.' },
  { id: 'q2', question: 'Vì sao "được giới thiệu (referral)" thường hiệu quả hơn ứng tuyển lạnh?', options: ['Vì không cần CV', 'Vì có người trong công ty bảo chứng, hồ sơ được chú ý hơn', 'Vì lương cao hơn', 'Vì bỏ qua được phỏng vấn'], correctIndex: 1, explanation: 'Mạng lưới/giới thiệu giúp hồ sơ nổi bật và được tin cậy hơn.' },
  { id: 'q3', question: 'Sau khi phỏng vấn xong nên làm gì?', options: ['Không liên lạc lại nữa', 'Gửi một lời cảm ơn ngắn, lịch sự', 'Gọi điện mỗi ngày để hỏi kết quả', 'Đăng công khai chê công ty'], correctIndex: 1, explanation: 'Một thư cảm ơn ngắn thể hiện chuyên nghiệp; theo dõi lịch sự chứ không hối thúc.' },
]);

// ── Chapter 4 ──
const c4 = doc('ojt202-4-1-integrate', '4.1 — Integrating into the company|||4.1 — Hoà nhập môi trường doanh nghiệp',
  'Văn hoá công ty; quy tắc ứng xử (giờ giấc, trang phục, email/chat lịch sự); giao tiếp với mentor và team; 30 ngày đầu — quan sát, hỏi, nhận việc nhỏ và hoàn thành.',
  [[
    `<span class="eyebrow">OJT202 · Chapter 4 · Lesson 4.1</span>
<h2>Integrating into the company</h2>
<h3>Read the culture</h3>
<p>Every company has unwritten rules — working hours, how formal chat is, whether people use tickets for everything. <strong>Observe first</strong>, then match the team's rhythm.</p>
<h3>Professional conduct basics</h3>
<ul>
<li><strong>Be on time</strong> and tell someone early if you'll be late or absent.</li>
<li>Dress to the team's norm; keep chat/email <strong>polite and clear</strong> (greeting, the ask, thanks).</li>
<li>Respect confidentiality and office etiquette from day one.</li>
</ul>
<h3>Working with your mentor &amp; team</h3>
<ul>
<li>Agree on a <strong>check-in rhythm</strong> (e.g. a short daily or twice-weekly sync).</li>
<li>Take notes so you don't ask the same thing twice. Update your mentor on progress <em>and</em> blockers.</li>
<li>Be reliable on small tasks first — trust compounds into bigger, more interesting work.</li>
</ul>
<pre><code>Your first 30 days:
  Week 1  -> set up the dev environment, read the codebase, meet the team
  Week 2  -> ship a tiny first task (a bug fix, a small feature)
  Week 3+ -> take on real tickets, join stand-ups, ask good questions</code></pre>
<div class="callout"><span class="badge">Attitude &gt; skill (at first)</span> Interns are judged more on reliability, curiosity and communication than on knowing everything. Nobody expects you to. They expect you to learn fast and follow through.</div>`,
    `<span class="eyebrow">OJT202 · Chương 4 · Bài 4.1</span>
<h2>Hoà nhập môi trường doanh nghiệp</h2>
<h3>Đọc văn hoá công ty</h3>
<p>Công ty nào cũng có luật ngầm — giờ làm, mức độ trang trọng khi chat, có phải mọi việc đều mở ticket. <strong>Quan sát trước</strong>, rồi khớp nhịp với đội.</p>
<h3>Nền tảng ứng xử chuyên nghiệp</h3>
<ul>
<li><strong>Đúng giờ</strong> và báo sớm nếu trễ hoặc nghỉ.</li>
<li>Ăn mặc theo chuẩn của đội; email/chat <strong>lịch sự và rõ ràng</strong> (chào, nêu việc cần, cảm ơn).</li>
<li>Tôn trọng bảo mật và phép lịch sự văn phòng ngay từ ngày đầu.</li>
</ul>
<h3>Làm việc với mentor &amp; đội</h3>
<ul>
<li>Thống nhất <strong>nhịp check-in</strong> (vd một buổi sync ngắn mỗi ngày hoặc hai lần/tuần).</li>
<li>Ghi chú để không hỏi lại cùng một việc. Báo mentor cả tiến độ <em>lẫn</em> chỗ bị kẹt.</li>
<li>Đáng tin với việc nhỏ trước — niềm tin tích luỹ thành việc lớn, thú vị hơn.</li>
</ul>
<pre><code>30 ngày đầu của bạn:
  Tuần 1  -> dựng môi trường dev, đọc codebase, làm quen đội
  Tuần 2  -> hoàn thành một việc nhỏ đầu tiên (sửa bug, tính năng nhỏ)
  Tuần 3+ -> nhận ticket thật, dự stand-up, hỏi những câu hỏi tốt</code></pre>
<div class="callout"><span class="badge">Thái độ &gt; kỹ năng (lúc đầu)</span> Thực tập sinh được đánh giá qua sự đáng tin, ham học và giao tiếp nhiều hơn là biết hết mọi thứ. Không ai kỳ vọng bạn biết hết. Họ kỳ vọng bạn học nhanh và làm tới nơi.</div>`,
  ]]);

const c4q = quiz('ojt202-quiz-4', 'Quiz 4 — Integrating|||Quiz 4 — Hoà nhập', [
  { id: 'q1', question: 'Việc đầu tiên nên làm khi vào một môi trường công ty mới?', options: ['Đề xuất đổi toàn bộ quy trình ngay', 'Quan sát văn hoá và khớp nhịp với đội', 'Chỉ làm theo ý mình', 'Tránh giao tiếp với mọi người'], correctIndex: 1, explanation: 'Quan sát luật ngầm (giờ giấc, cách giao tiếp) rồi hoà theo là bước đầu khôn ngoan.' },
  { id: 'q2', question: 'Thực tập sinh thường được đánh giá cao nhất nhờ điều gì lúc đầu?', options: ['Biết mọi công nghệ', 'Sự đáng tin, ham học và giao tiếp tốt', 'Code nhanh nhất phòng', 'Không bao giờ hỏi ai'], correctIndex: 1, explanation: 'Không ai kỳ vọng intern biết hết; thái độ và độ tin cậy quan trọng hơn.' },
  { id: 'q3', question: 'Khi sắp đi trễ hoặc nghỉ, cách chuyên nghiệp là?', options: ['Im lặng, không báo ai', 'Báo mentor/đội sớm nhất có thể', 'Chỉ báo sau khi đã nghỉ', 'Nhờ bạn báo hộ mà không nói lý do'], correctIndex: 1, explanation: 'Báo sớm giúp đội chủ động và thể hiện tinh thần trách nhiệm.' },
]);

// ── Chapter 5 ──
const c5 = doc('ojt202-5-1-real-work-skills', '5.1 — Real work: Git, code review & Agile|||5.1 — Kỹ năng làm việc thực tế: Git, code review & Agile',
  'Git theo nhánh (feature branch, pull request); code review (đón nhận góp ý); Agile/Scrum (sprint, stand-up, backlog); quản lý task trên Jira; và cách HỎI đúng khi bị kẹt.',
  [[
    `<span class="eyebrow">OJT202 · Chapter 5 · Lesson 5.1</span>
<h2>Real work: Git, code review &amp; Agile</h2>
<h3>Git the team way</h3>
<pre><code>git checkout -b feature/login-form   # branch per task
# ... commit small, meaningful changes ...
git push origin feature/login-form
# open a Pull Request -> get review -> merge</code></pre>
<p>Never push straight to <code>main</code>. Write clear commit messages. One branch = one task.</p>
<h3>Code review — a gift, not an attack</h3>
<ul>
<li>Reviewers comment on the <em>code</em>, not you. Read feedback, ask if unclear, and update.</li>
<li>When reviewing others, be kind and specific.</li>
</ul>
<h3>Agile / Scrum in one screen</h3>
<ul>
<li><strong>Sprint</strong> — a fixed 1–2 week cycle of planned work.</li>
<li><strong>Stand-up</strong> — daily: what I did / will do / what's blocking me.</li>
<li><strong>Backlog &amp; board</strong> — tasks tracked in <strong>Jira</strong> (To Do → In Progress → Done).</li>
</ul>
<h3>How to ask a good question</h3>
<pre><code>Not: "It doesn't work, help."
Yes: "I'm trying to X. I expected Y but got Z.
      I already tried A and B. Here's the error + my code."</code></pre>
<div class="callout"><span class="badge">The 30-minute rule</span> Struggle on your own for a while, but don't stay stuck for hours in silence. Try, search, then ask with context. Wasting a day quietly is worse than asking after 30 minutes.</div>`,
    `<span class="eyebrow">OJT202 · Chương 5 · Bài 5.1</span>
<h2>Kỹ năng làm việc thực tế: Git, code review &amp; Agile</h2>
<h3>Git theo cách của đội</h3>
<pre><code>git checkout -b feature/login-form   # mỗi việc một nhánh
# ... commit nhỏ, có ý nghĩa ...
git push origin feature/login-form
# mở Pull Request -> được review -> merge</code></pre>
<p>Đừng bao giờ push thẳng vào <code>main</code>. Viết commit message rõ ràng. Một nhánh = một việc.</p>
<h3>Code review — món quà, không phải công kích</h3>
<ul>
<li>Người review góp ý về <em>code</em>, không phải về bạn. Đọc góp ý, chưa rõ thì hỏi, rồi sửa.</li>
<li>Khi review người khác, hãy tử tế và cụ thể.</li>
</ul>
<h3>Agile / Scrum gói trong một màn hình</h3>
<ul>
<li><strong>Sprint</strong> — chu kỳ cố định 1–2 tuần cho khối việc đã lên kế hoạch.</li>
<li><strong>Stand-up</strong> — mỗi ngày: hôm qua làm gì / hôm nay làm gì / đang kẹt gì.</li>
<li><strong>Backlog &amp; bảng</strong> — công việc theo dõi trên <strong>Jira</strong> (To Do → In Progress → Done).</li>
</ul>
<h3>Hỏi một câu hỏi tốt như thế nào</h3>
<pre><code>Không: "Nó không chạy, cứu với."
Nên:   "Em đang làm X. Em mong Y nhưng nhận Z.
        Em đã thử A và B. Đây là lỗi + đoạn code của em."</code></pre>
<div class="callout"><span class="badge">Quy tắc 30 phút</span> Hãy tự vật lộn một lúc, nhưng đừng kẹt hàng giờ trong im lặng. Thử, tìm, rồi hỏi kèm ngữ cảnh. Mất cả ngày âm thầm còn tệ hơn hỏi sau 30 phút.</div>`,
  ]]);

const c5q = quiz('ojt202-quiz-5', 'Quiz 5 — Real work skills|||Quiz 5 — Kỹ năng làm việc thực tế', [
  { id: 'q1', question: 'Quy ước làm việc với Git trong đội thường là?', options: ['Push thẳng vào main mọi lúc', 'Mỗi việc một nhánh, mở Pull Request để được review rồi merge', 'Không dùng nhánh, sửa trực tiếp', 'Chỉ một người được commit'], correctIndex: 1, explanation: 'Feature branch + Pull Request + review là chuẩn cộng tác an toàn.' },
  { id: 'q2', question: 'Trong stand-up hằng ngày của Scrum, bạn thường trình bày?', options: ['Toàn bộ mã đã viết', 'Hôm qua làm gì / hôm nay làm gì / đang kẹt gì', 'Lương của mình', 'Kế hoạch cả năm'], correctIndex: 1, explanation: 'Stand-up ngắn: đã làm / sẽ làm / vướng mắc — để đội đồng bộ và gỡ kẹt.' },
  { id: 'q3', question: 'Cách HỎI khi bị kẹt tốt nhất là?', options: ['"Nó không chạy, cứu với" rồi thôi', 'Im lặng cả ngày tự loay hoay', 'Nêu mục tiêu, kết quả mong đợi vs thực tế, cái đã thử và lỗi cụ thể', 'Hỏi ngay giây đầu tiên chưa thử gì'], correctIndex: 2, explanation: 'Hỏi kèm ngữ cảnh (mục tiêu, lỗi, đã thử gì) giúp người khác giúp bạn nhanh.' },
]);

// ── Chapter 6 ──
const c6 = doc('ojt202-6-1-log-evidence', '6.1 — Internship log, evidence & time management|||6.1 — Nhật ký, minh chứng & quản lý thời gian',
  'Ghi nhật ký thực tập (theo mẫu FLM) đều đặn; thu thập minh chứng (task, commit, ảnh màn hình, phản hồi) để dùng cho báo cáo; quản lý thời gian và ưu tiên công việc.',
  [[
    `<span class="eyebrow">OJT202 · Chapter 6 · Lesson 6.1</span>
<h2>Internship log, evidence &amp; time management</h2>
<h3>Keep a weekly log — from day one</h3>
<p>The <strong>weekly log</strong> (template on FLM) is part of your grade and the raw material for your report. Don't reconstruct it from memory at the end — write it as you go.</p>
<pre><code>For each week, record:
  - Tasks assigned &amp; completed
  - Technologies/skills used
  - Problems faced &amp; how you solved them
  - What you learned; mentor feedback</code></pre>
<h3>Collect evidence continuously</h3>
<ul>
<li>Ticket IDs, merged pull requests, screenshots of features you built.</li>
<li>Mentor/team feedback (with permission), demo notes.</li>
<li><strong>Only share what the company allows</strong> — never leak internal code or data (see Chapter 8).</li>
</ul>
<h3>Manage your time</h3>
<ul>
<li>Prioritize: do the <strong>important + urgent</strong> first; clarify deadlines up front.</li>
<li>Break big tasks into small ones; estimate, then update your estimate honestly.</li>
<li>Protect focus time; batch questions instead of interrupting constantly.</li>
</ul>
<div class="callout"><span class="badge">Write it now, thank yourself later</span> A 10-minute log every Friday turns into a rich, accurate OJT report — with zero panic in the final week.</div>`,
    `<span class="eyebrow">OJT202 · Chương 6 · Bài 6.1</span>
<h2>Nhật ký, minh chứng &amp; quản lý thời gian</h2>
<h3>Ghi nhật ký tuần — ngay từ ngày đầu</h3>
<p><strong>Nhật ký tuần</strong> (mẫu trên FLM) là một phần điểm và là nguyên liệu thô cho báo cáo. Đừng dựng lại từ trí nhớ vào phút cuối — hãy ghi khi đang làm.</p>
<pre><code>Mỗi tuần, ghi lại:
  - Việc được giao &amp; đã hoàn thành
  - Công nghệ/kỹ năng đã dùng
  - Vấn đề gặp phải &amp; cách bạn giải quyết
  - Điều học được; phản hồi của mentor</code></pre>
<h3>Thu thập minh chứng liên tục</h3>
<ul>
<li>Mã ticket, các pull request đã merge, ảnh chụp tính năng bạn làm.</li>
<li>Phản hồi của mentor/đội (khi được phép), ghi chú buổi demo.</li>
<li><strong>Chỉ chia sẻ điều công ty cho phép</strong> — không bao giờ lộ mã hay dữ liệu nội bộ (xem Chương 8).</li>
</ul>
<h3>Quản lý thời gian</h3>
<ul>
<li>Ưu tiên: làm việc <strong>quan trọng + gấp</strong> trước; hỏi rõ deadline ngay từ đầu.</li>
<li>Chia việc lớn thành nhỏ; ước lượng, rồi cập nhật ước lượng một cách trung thực.</li>
<li>Giữ thời gian tập trung; gom câu hỏi lại thay vì ngắt quãng liên tục.</li>
</ul>
<div class="callout"><span class="badge">Ghi ngay, cảm ơn mình sau</span> 10 phút nhật ký mỗi thứ Sáu biến thành một báo cáo OJT đầy đủ, chính xác — và không hoảng loạn vào tuần cuối.</div>`,
  ]]);

const c6q = quiz('ojt202-quiz-6', 'Quiz 6 — Log & time|||Quiz 6 — Nhật ký & thời gian', [
  { id: 'q1', question: 'Khi nào nên bắt đầu ghi nhật ký thực tập?', options: ['Ngay từ ngày đầu, đều đặn mỗi tuần', 'Chỉ vào tuần cuối, dựng lại từ trí nhớ', 'Không cần ghi nhật ký', 'Chỉ khi mentor yêu cầu'], correctIndex: 0, explanation: 'Nhật ký tuần theo mẫu FLM là điểm và nguyên liệu cho báo cáo — ghi khi đang làm.' },
  { id: 'q2', question: 'Minh chứng nào phù hợp để dùng cho báo cáo OJT?', options: ['Toàn bộ mã nguồn mật của công ty đăng công khai', 'Mã ticket, pull request đã merge, ảnh tính năng — trong giới hạn công ty cho phép', 'Dữ liệu khách hàng thật', 'Không cần minh chứng gì'], correctIndex: 1, explanation: 'Thu thập minh chứng hợp pháp, chỉ những gì công ty cho phép chia sẻ.' },
  { id: 'q3', question: 'Nguyên tắc quản lý thời gian hợp lý là?', options: ['Làm việc nào tiện tay trước', 'Ưu tiên việc quan trọng + gấp, chia việc lớn thành nhỏ', 'Để dồn hết vào cuối kỳ', 'Không ước lượng thời gian gì cả'], correctIndex: 1, explanation: 'Ưu tiên theo tầm quan trọng/độ gấp và chia nhỏ giúp kiểm soát tiến độ.' },
]);

// ── Chapter 7 ──
const c7 = doc('ojt202-7-1-report-defense', '7.1 — Writing the OJT report & defending it|||7.1 — Viết báo cáo OJT & bảo vệ',
  'Cấu trúc báo cáo OJT (giới thiệu công ty → nhiệm vụ → công nghệ → kết quả → phản tư); viết phần reflection có chiều sâu; chuẩn bị thuyết trình và trả lời câu hỏi bảo vệ.',
  [[
    `<span class="eyebrow">OJT202 · Chapter 7 · Lesson 7.1</span>
<h2>Writing the OJT report &amp; defending it</h2>
<h3>A solid report structure</h3>
<pre><code>1. Introduction — the company, its products, your team
2. Your role — tasks &amp; responsibilities assigned
3. Technologies &amp; process — stack, Git, Scrum you worked in
4. Results — what you built/fixed, with evidence
5. Reflection — what you learned, challenges, growth
6. Conclusion &amp; references</code></pre>
<p>Follow the <strong>official FLM template</strong> for exact sections and formatting.</p>
<h3>Reflection is where the marks are</h3>
<p>Don't just <em>list</em> tasks — reflect. What was hard? What did you do about it? How did you change as an engineer? Honest, specific reflection shows real learning, which is what OJT grades.</p>
<h3>Defending your report</h3>
<ul>
<li>Prepare a <strong>short, clear presentation</strong> (problem → what you did → result → lesson).</li>
<li>Rehearse out loud; keep to time; be ready to <strong>demo</strong> if allowed.</li>
<li>Answer questions calmly. "I don't know, but here's how I'd find out" is a valid answer.</li>
</ul>
<div class="callout"><span class="badge">Tell a story, not a diary</span> The best reports have a narrative arc: where you started, what you struggled with, and who you became by the end. Evidence backs each claim.</div>`,
    `<span class="eyebrow">OJT202 · Chương 7 · Bài 7.1</span>
<h2>Viết báo cáo OJT &amp; bảo vệ</h2>
<h3>Một cấu trúc báo cáo chắc chắn</h3>
<pre><code>1. Giới thiệu — công ty, sản phẩm, đội của bạn
2. Vai trò của bạn — nhiệm vụ &amp; trách nhiệm được giao
3. Công nghệ &amp; quy trình — stack, Git, Scrum bạn đã làm
4. Kết quả — bạn đã xây/sửa gì, có minh chứng
5. Phản tư (reflection) — điều học được, thách thức, trưởng thành
6. Kết luận &amp; tài liệu tham khảo</code></pre>
<p>Theo <strong>mẫu chính thức trên FLM</strong> để đúng các phần và định dạng.</p>
<h3>Phản tư là nơi có điểm</h3>
<p>Đừng chỉ <em>liệt kê</em> công việc — hãy phản tư. Khó ở đâu? Bạn đã làm gì với nó? Bạn thay đổi thế nào với tư cách một kỹ sư? Phản tư trung thực, cụ thể cho thấy sự học thật — đó là thứ OJT chấm.</p>
<h3>Bảo vệ báo cáo</h3>
<ul>
<li>Chuẩn bị một <strong>bài thuyết trình ngắn, rõ</strong> (vấn đề → bạn làm gì → kết quả → bài học).</li>
<li>Tập nói thành tiếng; đúng thời lượng; sẵn sàng <strong>demo</strong> nếu được phép.</li>
<li>Trả lời câu hỏi bình tĩnh. "Em chưa biết, nhưng em sẽ tìm hiểu theo cách này" là một câu trả lời hợp lệ.</li>
</ul>
<div class="callout"><span class="badge">Kể một câu chuyện, không phải nhật ký</span> Báo cáo hay có một mạch: bạn bắt đầu từ đâu, vật lộn với gì, và trở thành ai vào cuối. Mỗi khẳng định đều có minh chứng.</div>`,
  ]]);

const c7q = quiz('ojt202-quiz-7', 'Quiz 7 — Report & defense|||Quiz 7 — Báo cáo & bảo vệ', [
  { id: 'q1', question: 'Phần nào của báo cáo OJT thường được chấm cao khi làm sâu?', options: ['Danh sách công việc dài nhất có thể', 'Phần phản tư (reflection): khó khăn, cách xử lý, sự trưởng thành', 'Trang bìa đẹp', 'Số trang nhiều nhất'], correctIndex: 1, explanation: 'Reflection trung thực, cụ thể chứng minh sự học thật — thứ OJT đánh giá.' },
  { id: 'q2', question: 'Khi được hỏi một câu bạn không biết trong buổi bảo vệ, cách tốt là?', options: ['Im lặng hoặc bịa đại', 'Bình tĩnh: "Em chưa biết, nhưng em sẽ tìm hiểu theo cách này"', 'Đổ lỗi cho công ty', 'Bỏ ra ngoài'], correctIndex: 1, explanation: 'Thành thật và cho thấy cách tiếp cận vấn đề được đánh giá cao hơn bịa.' },
  { id: 'q3', question: 'Nên dựa vào đâu để đúng cấu trúc và định dạng báo cáo?', options: ['Tự nghĩ ra định dạng riêng', 'Mẫu báo cáo chính thức trên FLM', 'Sao chép báo cáo của bạn khác', 'Không cần theo mẫu nào'], correctIndex: 1, explanation: 'Mẫu chính thức trên FLM quy định các phần và định dạng bắt buộc.' },
]);

// ── Chapter 8 ──
const c8 = doc('ojt202-8-1-ethics-transition', '8.1 — Professional ethics, confidentiality & the transition|||8.1 — Đạo đức nghề nghiệp, bảo mật & chuyển sang nhân viên',
  'Đạo đức nghề nghiệp (trung thực, trách nhiệm); bảo mật thông tin công ty (NDA, không lộ mã/dữ liệu); và cách biến kỳ thực tập thành lời mời làm chính thức.',
  [[
    `<span class="eyebrow">OJT202 · Chapter 8 · Lesson 8.1</span>
<h2>Professional ethics, confidentiality &amp; the transition</h2>
<h3>Ethics on the job</h3>
<ul>
<li><strong>Be honest</strong> — about progress, about mistakes, about what you did and didn't do.</li>
<li><strong>Own your work</strong> — meet commitments, admit and fix errors, give credit to others.</li>
<li>Respect people and property; no plagiarism, no shortcuts that hurt users.</li>
</ul>
<h3>Confidentiality — this is serious</h3>
<ul>
<li>You may sign an <strong>NDA</strong>. Treat internal code, data, customers and roadmaps as <strong>secret</strong>.</li>
<li>Never push company code to a public GitHub, never share customer data, never post secrets.</li>
<li>In your OJT report, describe your work at a level the company approves — <strong>ask before publishing anything</strong>.</li>
</ul>
<h3>From intern to employee</h3>
<pre><code>To earn a return offer:
  - Be reliable and easy to work with
  - Take feedback well and improve visibly
  - Take initiative on small problems
  - Near the end: say you're interested, ask about openings</code></pre>
<div class="callout"><span class="badge">Your reputation is portable</span> The Vietnam tech scene is small. How you behave as an intern — honest, discreet, dependable — follows you into every future job and reference. Guard it.</div>`,
    `<span class="eyebrow">OJT202 · Chương 8 · Bài 8.1</span>
<h2>Đạo đức nghề nghiệp, bảo mật &amp; chuyển sang nhân viên</h2>
<h3>Đạo đức khi làm việc</h3>
<ul>
<li><strong>Trung thực</strong> — về tiến độ, về lỗi, về việc bạn đã và chưa làm.</li>
<li><strong>Chịu trách nhiệm với việc của mình</strong> — giữ cam kết, nhận và sửa lỗi, ghi công người khác.</li>
<li>Tôn trọng con người và tài sản; không đạo mã, không đi tắt gây hại người dùng.</li>
</ul>
<h3>Bảo mật — chuyện nghiêm túc</h3>
<ul>
<li>Bạn có thể ký <strong>NDA</strong>. Coi mã, dữ liệu, khách hàng và lộ trình nội bộ là <strong>bí mật</strong>.</li>
<li>Không bao giờ đẩy mã công ty lên GitHub công khai, không chia sẻ dữ liệu khách hàng, không đăng khoá bí mật.</li>
<li>Trong báo cáo OJT, mô tả công việc ở mức công ty cho phép — <strong>hỏi trước khi công bố bất cứ điều gì</strong>.</li>
</ul>
<h3>Từ thực tập sinh thành nhân viên</h3>
<pre><code>Để có lời mời ở lại:
  - Đáng tin và dễ làm việc cùng
  - Đón nhận góp ý tốt và tiến bộ thấy rõ
  - Chủ động với những vấn đề nhỏ
  - Gần cuối kỳ: nói rõ bạn quan tâm, hỏi về vị trí tuyển</code></pre>
<div class="callout"><span class="badge">Danh tiếng đi theo bạn</span> Giới công nghệ Việt Nam nhỏ. Cách bạn cư xử khi thực tập — trung thực, kín đáo, đáng tin — theo bạn vào mọi công việc và người tham chiếu sau này. Hãy giữ gìn.</div>`,
  ]]);

const c8q = quiz('ojt202-quiz-8', 'Quiz 8 — Ethics & transition|||Quiz 8 — Đạo đức & chuyển tiếp', [
  { id: 'q1', question: 'Với mã nguồn và dữ liệu nội bộ của công ty, bạn nên?', options: ['Đẩy lên GitHub công khai để làm portfolio', 'Coi là bí mật, không chia sẻ; hỏi trước khi đưa bất cứ gì vào báo cáo', 'Chia sẻ tự do cho bạn bè', 'Đăng lên mạng xã hội'], correctIndex: 1, explanation: 'NDA và bảo mật: mã/dữ liệu nội bộ là bí mật; chỉ mô tả ở mức công ty cho phép.' },
  { id: 'q2', question: 'Cách ứng xử đạo đức khi bạn mắc lỗi trong công việc?', options: ['Giấu đi và hy vọng không ai biết', 'Trung thực nhận lỗi và sửa', 'Đổ cho người khác', 'Bỏ dở việc'], correctIndex: 1, explanation: 'Trung thực và chịu trách nhiệm là nền của đạo đức nghề nghiệp.' },
  { id: 'q3', question: 'Điều gì giúp một kỳ thực tập chuyển thành lời mời làm chính thức?', options: ['Đáng tin, đón nhận góp ý, chủ động và bày tỏ sự quan tâm gần cuối kỳ', 'Chỉ im lặng làm cho hết giờ', 'Không giao tiếp với ai', 'Từ chối mọi phản hồi'], correctIndex: 0, explanation: 'Độ tin cậy, tinh thần cầu tiến và chủ động ngỏ ý là con đường tới return offer.' },
]);

export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    courseCode: 'OJT202',
    slug: 'ojt202-on-the-job-training',
    title: 'On the job training',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/OJT202.webp',
    shortDescription: 'A professional handbook for your FPTU internship — CV & portfolio, finding & applying, fitting into a company, real work skills (Git, code review, Agile), keeping a log, writing & defending the OJT report, and professional ethics. Bilingual, with quizzes.|||Cẩm nang thực tập chuyên nghiệp cho kỳ OJT của FPTU — CV & portfolio, tìm & ứng tuyển, hoà nhập doanh nghiệp, kỹ năng làm việc thật (Git, code review, Agile), ghi nhật ký, viết & bảo vệ báo cáo OJT, và đạo đức nghề nghiệp. Song ngữ, có quiz.',
    description: 'Môn <strong>OJT202 — On the Job Training</strong> (kỳ 6) là kỳ <strong>thực tập toàn thời gian tại doanh nghiệp</strong> — cây cầu giữa việc học và việc làm kỹ sư phần mềm. Đây không phải lý thuyết hàn lâm mà là một <strong>cẩm nang thực chiến</strong>: từ <strong>chuẩn bị hồ sơ</strong> (CV, portfolio GitHub, phỏng vấn) → <strong>tìm &amp; ứng tuyển</strong> (ITviec/TopCV/LinkedIn, mạng lưới) → <strong>hoà nhập doanh nghiệp</strong> (văn hoá, mentor, team) → <strong>kỹ năng làm việc thật</strong> (Git, code review, Agile/Scrum, Jira) → <strong>nhật ký &amp; minh chứng</strong> → <strong>viết &amp; bảo vệ báo cáo OJT</strong> → <strong>đạo đức nghề nghiệp &amp; bảo mật</strong>. Song ngữ, có quiz mỗi chương. Quy định &amp; biểu mẫu chính thức trên FLM/FAP.',
    whatYouLearn: 'Hiểu OJT là gì, điều kiện tiên quyết &amp; quy trình FPTU; viết CV một trang có kết quả đo được &amp; portfolio GitHub; chuẩn bị phỏng vấn kỹ thuật (STAR); tìm &amp; ứng tuyển thực tập, xây mạng lưới; hoà nhập văn hoá công ty &amp; làm việc với mentor; Git theo nhánh + Pull Request, code review, Agile/Scrum, Jira; cách hỏi đúng khi bị kẹt; ghi nhật ký &amp; thu thập minh chứng; viết báo cáo OJT có phản tư &amp; bảo vệ; đạo đức nghề nghiệp, NDA/bảo mật, và chuyển từ thực tập sang nhân viên.',
    requirements: 'Đã qua các môn học trước bắt buộc và đủ tín chỉ theo khung ngành SE (kiểm tra trên FAP). Nên có một vài dự án cá nhân/nhóm để đưa vào CV &amp; portfolio.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Quy định & biểu mẫu OJT (FLM/FAP), tài liệu viết CV/phỏng vấn, YouTube, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu OJT|||OJT introduction', description: 'OJT là gì, mục tiêu, tín chỉ, điều kiện, đánh giá.', lessons: [intro] },
    { title: 'Chương 1 — OJT & quy trình|||Chapter 1 — OJT & the process', description: 'OJT là gì, điều kiện tiên quyết, quy trình FPTU.', lessons: [c1, c1q] },
    { title: 'Chương 2 — CV & phỏng vấn|||Chapter 2 — CV & interview', description: 'CV, portfolio GitHub, thư xin việc, phỏng vấn kỹ thuật.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tìm & ứng tuyển|||Chapter 3 — Find & apply', description: 'ITviec/TopCV/LinkedIn, mạng lưới, hội chợ việc làm.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Hoà nhập doanh nghiệp|||Chapter 4 — Integrating', description: 'Văn hoá công ty, ứng xử, mentor & team, 30 ngày đầu.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kỹ năng làm việc thật|||Chapter 5 — Real work skills', description: 'Git, code review, Agile/Scrum, Jira, hỏi đúng cách.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nhật ký & thời gian|||Chapter 6 — Log & time', description: 'Nhật ký thực tập, thu thập minh chứng, quản lý thời gian.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Báo cáo & bảo vệ|||Chapter 7 — Report & defense', description: 'Cấu trúc báo cáo OJT, phản tư, thuyết trình bảo vệ.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đạo đức & chuyển tiếp|||Chapter 8 — Ethics & transition', description: 'Đạo đức nghề nghiệp, bảo mật/NDA, thực tập → nhân viên.', lessons: [c8, c8q] },
  ],
};
