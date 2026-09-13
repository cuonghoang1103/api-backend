/**
 * OTP101 — Orientation and General Training Program (định hướng nhập học).
 * Kỳ 1, ngành Kỹ thuật phần mềm (SE) FPTU. CẨM NANG tân sinh viên: chào mừng,
 * hệ thống học tập (FLM/FAP/EduNext), quy chế học vụ & đạo đức học thuật,
 * phương pháp học đại học, kỹ năng số & tiếng Anh, đời sống SV, định hướng
 * nghề nghiệp sớm, tư duy phát triển. Song ngữ EN+VI, có quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML; "&"→&amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('otp101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Sổ tay sinh viên & quy chế trên FLM/FAP, tài liệu kỹ năng học tập miễn phí (Learning How to Learn, Deep Work), YouTube, công cụ (FLM/FAP/EduNext/Google Workspace/Notion), lộ trình 4 bước làm quen.',
  [[
    `<span class="eyebrow">OTP101 · Materials</span>
<h2>Freshman survival kit &amp; resource hub</h2>
<p class="lead">Everything you need to start strong at <strong>FPT University</strong> — the systems you'll live in, the rules that decide whether you pass, and the study skills that separate students who thrive from those who struggle. Bookmark this page and come back to it in week 1 of every semester.</p>
<h3>📘 Official handbooks &amp; regulations</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — syllabus, slides, learning materials for every course. Sign in with your FPTU account.</li>
<li><a href="https://fap.fpt.edu.vn" target="_blank" rel="noopener">FAP (fap.fpt.edu.vn)</a> — grades, schedule, attendance, tuition, the student handbook (Sổ tay sinh viên) &amp; academic regulations (Quy chế đào tạo).</li>
</ul>
<h3>📗 Free study-skills resources</h3>
<ul>
<li><a href="https://www.coursera.org/learn/learning-how-to-learn" target="_blank" rel="noopener">Learning How to Learn (Coursera)</a> — the most popular course in the world on how your brain learns; free to audit.</li>
<li><a href="https://www.calnewport.com/books/deep-work/" target="_blank" rel="noopener">Cal Newport — <em>Deep Work</em></a> — focused, distraction-free work as a superpower.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Thomasfrank" target="_blank" rel="noopener">Thomas Frank</a> — study systems, note-taking, productivity for students.</li>
<li><a href="https://www.youtube.com/@aliabdaal" target="_blank" rel="noopener">Ali Abdaal</a> — evidence-based studying, habits and time management.</li>
</ul>
<h3>🛠️ Tools you'll use daily</h3>
<ul>
<li><strong>FLM</strong> — course syllabus &amp; materials.</li>
<li><strong>FAP</strong> — grades, timetable, registration, attendance.</li>
<li><strong>EduNext / LMS</strong> — in-class discussion, assignments, submissions.</li>
<li><strong>Google Workspace</strong> (your @fpt.edu.vn account) — mail, Docs, Drive, Meet.</li>
<li><strong>Notion</strong> — notes, task tracking, personal knowledge base.</li>
</ul>
<div class="callout"><span class="badge">First 4 steps</span>
<ol>
<li><strong>Activate accounts</strong> — log in to FAP, FLM and your @fpt.edu.vn email; change default passwords.</li>
<li><strong>Read the rules</strong> — open the student handbook &amp; academic regulations on FAP; note the grading scale and attendance limit.</li>
<li><strong>Find your curriculum</strong> — locate your SE (Software Engineering) program on FLM's <em>View Curriculum</em>; see the 9-semester map.</li>
<li><strong>Set up your workspace</strong> — put your timetable in a calendar, create a Notion/Docs page for each course.</li>
</ol></div>`,
    `<span class="eyebrow">OTP101 · Tài liệu</span>
<h2>Bộ cẩm nang sống sót cho tân sinh viên</h2>
<p class="lead">Mọi thứ để bạn khởi đầu vững vàng ở <strong>Đại học FPT</strong> — các hệ thống bạn sẽ dùng mỗi ngày, những quy định quyết định bạn qua hay trượt môn, và kỹ năng học tập tách người học giỏi khỏi người chật vật. Lưu trang này và quay lại vào tuần đầu mỗi kỳ.</p>
<h3>📘 Sổ tay &amp; quy chế chính thức</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đề cương (syllabus), slide, tài liệu học của từng môn. Đăng nhập bằng tài khoản FPTU.</li>
<li><a href="https://fap.fpt.edu.vn" target="_blank" rel="noopener">FAP (fap.fpt.edu.vn)</a> — điểm, lịch học, điểm danh, học phí, Sổ tay sinh viên &amp; Quy chế đào tạo.</li>
</ul>
<h3>📗 Tài liệu kỹ năng học tập miễn phí</h3>
<ul>
<li><a href="https://www.coursera.org/learn/learning-how-to-learn" target="_blank" rel="noopener">Learning How to Learn (Coursera)</a> — khoá học phổ biến nhất thế giới về cách bộ não học; học miễn phí (audit).</li>
<li><a href="https://www.calnewport.com/books/deep-work/" target="_blank" rel="noopener">Cal Newport — <em>Deep Work</em></a> — làm việc tập trung, không xao nhãng như một siêu năng lực.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Thomasfrank" target="_blank" rel="noopener">Thomas Frank</a> — hệ thống học, ghi chú, năng suất cho sinh viên.</li>
<li><a href="https://www.youtube.com/@aliabdaal" target="_blank" rel="noopener">Ali Abdaal</a> — học dựa trên bằng chứng, thói quen &amp; quản lý thời gian.</li>
</ul>
<h3>🛠️ Công cụ dùng hằng ngày</h3>
<ul>
<li><strong>FLM</strong> — đề cương &amp; tài liệu môn học.</li>
<li><strong>FAP</strong> — điểm, thời khoá biểu, đăng ký môn, điểm danh.</li>
<li><strong>EduNext / LMS</strong> — thảo luận trên lớp, bài tập, nộp bài.</li>
<li><strong>Google Workspace</strong> (tài khoản @fpt.edu.vn) — mail, Docs, Drive, Meet.</li>
<li><strong>Notion</strong> — ghi chú, quản lý việc, kho kiến thức cá nhân.</li>
</ul>
<div class="callout"><span class="badge">4 bước đầu tiên</span>
<ol>
<li><strong>Kích hoạt tài khoản</strong> — đăng nhập FAP, FLM và mail @fpt.edu.vn; đổi mật khẩu mặc định.</li>
<li><strong>Đọc quy chế</strong> — mở Sổ tay sinh viên &amp; Quy chế đào tạo trên FAP; ghi nhớ thang điểm và giới hạn vắng.</li>
<li><strong>Tìm khung chương trình</strong> — tìm ngành SE (Kỹ thuật phần mềm) trong <em>View Curriculum</em> trên FLM; xem lộ trình 9 kỳ.</li>
<li><strong>Dựng không gian học</strong> — đưa thời khoá biểu vào lịch, tạo một trang Notion/Docs cho mỗi môn.</li>
</ol></div>`,
  ]]);

const intro = doc('otp101-0-1-overview', 'Course overview: Orientation & general training|||Tổng quan: Định hướng & huấn luyện chung',
  'OTP101 làm gì; vì sao môn định hướng quan trọng; 8 chương: chào mừng FPTU → hệ thống học tập → quy chế học vụ → phương pháp học → kỹ năng số & tiếng Anh → đời sống SV → định hướng nghề nghiệp → tư duy phát triển.',
  [[
    `<span class="eyebrow">OTP101 · Lesson 0.1 · Overview</span>
<h2>Orientation &amp; General Training Program</h2>
<p class="lead">This is your <strong>first course at FPT University</strong> — and the one that pays off in every course after it. It isn't about coding yet; it's about <strong>how to be a university student who succeeds</strong>: knowing the systems, the rules, the study methods and the mindset that make four years work.</p>
<h3>Why an orientation course matters</h3>
<p>Most students who struggle at university don't fail because the material is too hard — they fail because they never learned <em>how</em> to learn at this level, missed a rule about attendance or academic integrity, or drifted without goals. This course closes those gaps <strong>before</strong> they cost you a semester.</p>
<h3>What we'll cover</h3>
<ul>
<li><strong>Ch.1 — Welcome to FPTU:</strong> education philosophy, training model, learning outcomes, the SE program.</li>
<li><strong>Ch.2 — Learning systems:</strong> FLM, FAP, EduNext/LMS; curriculum &amp; course registration.</li>
<li><strong>Ch.3 — Academic regulations:</strong> grading scale, passing conditions, academic warning, integrity.</li>
<li><strong>Ch.4 — How to study at university:</strong> active learning, time management, note-taking.</li>
<li><strong>Ch.5 — Digital skills &amp; English:</strong> why English matters, the TOEIC path, AI study tools.</li>
<li><strong>Ch.6 — Student life:</strong> clubs, activities, mental health, balance, dormitory.</li>
<li><strong>Ch.7 — Early career orientation:</strong> the 9-semester roadmap, OJT, portfolio &amp; GitHub from year 1.</li>
<li><strong>Ch.8 — Growth mindset:</strong> SMART goals and the habits of successful students.</li>
</ul>
<div class="callout"><span class="badge">Mindset</span> Treat these four years as a project you're the product manager of. This course hands you the tools; the results are up to how you use them.</div>`,
    `<span class="eyebrow">OTP101 · Bài 0.1 · Tổng quan</span>
<h2>Định hướng &amp; huấn luyện chung</h2>
<p class="lead">Đây là <strong>môn học đầu tiên ở Đại học FPT</strong> — và là môn sinh lời trong mọi môn sau nó. Nó chưa nói về lập trình; nó nói về <strong>cách trở thành một sinh viên đại học thành công</strong>: hiểu các hệ thống, quy chế, phương pháp học và tư duy làm cho bốn năm học hiệu quả.</p>
<h3>Vì sao môn định hướng lại quan trọng</h3>
<p>Phần lớn sinh viên chật vật ở đại học không trượt vì kiến thức quá khó — họ trượt vì chưa học được <em>cách</em> học ở bậc này, bỏ sót một quy định về điểm danh hay đạo đức học thuật, hoặc trôi đi không mục tiêu. Môn này lấp những lỗ hổng đó <strong>trước khi</strong> chúng khiến bạn mất một học kỳ.</p>
<h3>Chúng ta sẽ học gì</h3>
<ul>
<li><strong>Ch.1 — Chào mừng tới FPTU:</strong> triết lý giáo dục, mô hình đào tạo, chuẩn đầu ra, ngành SE.</li>
<li><strong>Ch.2 — Hệ thống học tập:</strong> FLM, FAP, EduNext/LMS; khung chương trình &amp; đăng ký môn.</li>
<li><strong>Ch.3 — Quy chế học vụ:</strong> thang điểm, điều kiện qua môn, cảnh báo học vụ, liêm chính.</li>
<li><strong>Ch.4 — Cách học ở đại học:</strong> học chủ động, quản lý thời gian, ghi chú.</li>
<li><strong>Ch.5 — Kỹ năng số &amp; tiếng Anh:</strong> vì sao tiếng Anh quan trọng, lộ trình TOEIC, công cụ AI.</li>
<li><strong>Ch.6 — Đời sống sinh viên:</strong> CLB, hoạt động, sức khoẻ tinh thần, cân bằng, ký túc xá.</li>
<li><strong>Ch.7 — Định hướng nghề nghiệp sớm:</strong> lộ trình 9 kỳ, OJT, portfolio &amp; GitHub từ năm 1.</li>
<li><strong>Ch.8 — Tư duy phát triển:</strong> mục tiêu SMART và thói quen của sinh viên thành công.</li>
</ul>
<div class="callout"><span class="badge">Tư duy</span> Hãy coi bốn năm này là một dự án mà bạn là quản lý sản phẩm. Môn này trao công cụ; kết quả tuỳ vào cách bạn dùng chúng.</div>`,
  ]]);

const c1 = doc('otp101-1-1-welcome', '1.1 — Welcome to FPT University|||1.1 — Chào mừng tới Đại học FPT',
  'Triết lý giáo dục FPTU, mô hình đào tạo (learning by doing, OJT, hội nhập quốc tế), chuẩn đầu ra, và ngành Kỹ thuật phần mềm (SE).',
  [[
    `<span class="eyebrow">OTP101 · Chapter 1 · Lesson 1.1</span>
<h2>Welcome to FPT University</h2>
<h3>Education philosophy</h3>
<p>FPT University was founded by FPT Corporation — Vietnam's largest IT company — to train people industry actually needs. Its philosophy blends <strong>"learning by doing"</strong>, close ties to real companies, and international integration. You're not just studying theory; you're being prepared to build things and work in global teams.</p>
<h3>The training model</h3>
<ul>
<li><strong>Project- and practice-based learning</strong> — courses end in real deliverables, not only exams.</li>
<li><strong>OJT (On-the-Job Training)</strong> — a full semester working inside a real company, usually in year 3.</li>
<li><strong>English as the medium</strong> — most specialized courses are taught and examined in English.</li>
<li><strong>Soft skills &amp; character</strong> — teamwork, communication and Vovinam are part of the program.</li>
</ul>
<h3>Learning outcomes</h3>
<p>By graduation you should be able to analyse, design, build and test software; work in a team using modern tools; communicate in English; and keep learning on your own. Each course lists its own <strong>CLOs (Course Learning Outcomes)</strong> in the FLM syllabus — read them; they tell you exactly what the exam will test.</p>
<h3>The Software Engineering (SE) major</h3>
<p>SE focuses on the <em>engineering</em> of software — not just writing code, but building reliable systems: requirements, design, coding, testing, and delivery. Over 9 semesters you go from programming fundamentals to databases, web/mobile, software architecture, and a capstone project.</p>
<div class="callout"><span class="badge">Read your syllabus</span> Every course's goals, assessment weights and pass mark are written in its FLM syllabus. Students who read it on day one are never surprised by the exam.</div>`,
    `<span class="eyebrow">OTP101 · Chương 1 · Bài 1.1</span>
<h2>Chào mừng tới Đại học FPT</h2>
<h3>Triết lý giáo dục</h3>
<p>Đại học FPT được sáng lập bởi Tập đoàn FPT — công ty CNTT lớn nhất Việt Nam — để đào tạo đúng người ngành công nghiệp cần. Triết lý của trường kết hợp <strong>"học qua làm" (learning by doing)</strong>, gắn kết chặt với doanh nghiệp thật và hội nhập quốc tế. Bạn không chỉ học lý thuyết; bạn được chuẩn bị để tạo ra sản phẩm và làm việc trong đội ngũ toàn cầu.</p>
<h3>Mô hình đào tạo</h3>
<ul>
<li><strong>Học qua dự án &amp; thực hành</strong> — môn học kết thúc bằng sản phẩm thật, không chỉ bài thi.</li>
<li><strong>OJT (thực tập tại doanh nghiệp)</strong> — một học kỳ trọn vẹn làm việc trong công ty thật, thường ở năm 3.</li>
<li><strong>Tiếng Anh là ngôn ngữ giảng dạy</strong> — hầu hết môn chuyên ngành dạy và thi bằng tiếng Anh.</li>
<li><strong>Kỹ năng mềm &amp; rèn người</strong> — làm việc nhóm, giao tiếp và Vovinam là một phần chương trình.</li>
</ul>
<h3>Chuẩn đầu ra</h3>
<p>Khi tốt nghiệp bạn cần phân tích, thiết kế, xây dựng và kiểm thử phần mềm; làm việc nhóm với công cụ hiện đại; giao tiếp bằng tiếng Anh; và tự học suốt đời. Mỗi môn liệt kê <strong>CLO (chuẩn đầu ra môn học)</strong> trong đề cương FLM — hãy đọc; chúng cho biết chính xác bài thi kiểm tra gì.</p>
<h3>Ngành Kỹ thuật phần mềm (SE)</h3>
<p>SE tập trung vào <em>kỹ thuật</em> làm phần mềm — không chỉ viết code mà xây hệ thống đáng tin cậy: yêu cầu, thiết kế, lập trình, kiểm thử và bàn giao. Qua 9 kỳ, bạn đi từ nền lập trình đến cơ sở dữ liệu, web/mobile, kiến trúc phần mềm và đồ án tốt nghiệp.</p>
<div class="callout"><span class="badge">Đọc đề cương</span> Mục tiêu, tỉ trọng điểm và mức đạt của mọi môn đều ghi trong đề cương FLM. Sinh viên đọc nó ngay ngày đầu không bao giờ bất ngờ với bài thi.</div>`,
  ]]);

const c1q = quiz('otp101-quiz-1', 'Quiz 1 — Welcome to FPTU|||Quiz 1 — Chào mừng FPTU', [
  { id: 'q1', question: 'Triết lý đào tạo đặc trưng của FPTU nhấn mạnh điều gì?', options: ['Chỉ học lý thuyết trên giảng đường', 'Học qua làm, gắn doanh nghiệp & hội nhập quốc tế', 'Thi trắc nghiệm là chính', 'Tự học hoàn toàn, không có giảng viên'], correctIndex: 1, explanation: 'FPTU theo "learning by doing", gắn với doanh nghiệp và hội nhập quốc tế.' },
  { id: 'q2', question: 'OJT trong mô hình FPTU là gì?', options: ['Một môn thể thao', 'Một kỳ thực tập làm việc tại doanh nghiệp thật', 'Kỳ thi cuối khoá', 'Câu lạc bộ sinh viên'], correctIndex: 1, explanation: 'OJT (On-the-Job Training) là học kỳ thực tập tại công ty thật, thường ở năm 3.' },
  { id: 'q3', question: 'Muốn biết chính xác một môn sẽ kiểm tra gì, nên đọc?', options: ['Bảng tin Facebook', 'CLO/đề cương (syllabus) của môn trên FLM', 'Điểm của bạn cùng lớp', 'Lịch nghỉ lễ'], correctIndex: 1, explanation: 'CLO và đề cương trên FLM ghi rõ mục tiêu và cách đánh giá của môn.' },
]);

const c2 = doc('otp101-2-1-systems', '2.1 — Learning systems: FLM, FAP, EduNext|||2.1 — Hệ thống học tập: FLM, FAP, EduNext',
  'FLM (đề cương & tài liệu), FAP (điểm/lịch/điểm danh/học phí), EduNext & LMS (thảo luận/nộp bài); cách tra khung chương trình và đăng ký môn.',
  [[
    `<span class="eyebrow">OTP101 · Chapter 2 · Lesson 2.1</span>
<h2>The systems you'll live in</h2>
<p>FPTU runs on a few core platforms. Knowing which one does what saves you from missing a deadline or a rule.</p>
<table>
<thead><tr><th>System</th><th>What it's for</th></tr></thead>
<tbody>
<tr><td><strong>FLM</strong></td><td>Course syllabus, learning outcomes, slides &amp; materials; <em>View Curriculum</em> for your program map.</td></tr>
<tr><td><strong>FAP</strong></td><td>Grades, timetable, attendance, tuition, course registration, student handbook &amp; regulations.</td></tr>
<tr><td><strong>EduNext / LMS</strong></td><td>In-class discussion questions, assignments, quizzes &amp; submissions.</td></tr>
<tr><td><strong>@fpt.edu.vn mail</strong></td><td>Official notices from the school — check it daily.</td></tr>
</tbody>
</table>
<h3>Reading the curriculum</h3>
<p>On FLM's <strong>View Curriculum</strong>, pick your major (Software Engineering) to see all 9 semesters, the courses in each, their credits and prerequisites. This is your map for the whole degree — use it to see what's coming and what a course depends on.</p>
<h3>Registering for courses</h3>
<p>Each semester you register (or confirm) your courses in <strong>FAP</strong> within the announced window. Watch prerequisites — you can't take a course before its required earlier course. Miss the window and you may be placed automatically or have to wait a term.</p>
<div class="callout"><span class="badge">Check daily</span> Grades and attendance update in FAP; class questions appear in EduNext; official mail lands in @fpt.edu.vn. Build a habit of a 5-minute daily check across all three.</div>`,
    `<span class="eyebrow">OTP101 · Chương 2 · Bài 2.1</span>
<h2>Những hệ thống bạn sẽ sống cùng</h2>
<p>FPTU vận hành trên vài nền tảng lõi. Biết cái nào làm gì giúp bạn khỏi lỡ hạn nộp hay lỡ một quy định.</p>
<table>
<thead><tr><th>Hệ thống</th><th>Dùng để làm gì</th></tr></thead>
<tbody>
<tr><td><strong>FLM</strong></td><td>Đề cương, chuẩn đầu ra, slide &amp; tài liệu môn; <em>View Curriculum</em> để xem bản đồ chương trình.</td></tr>
<tr><td><strong>FAP</strong></td><td>Điểm, thời khoá biểu, điểm danh, học phí, đăng ký môn, sổ tay &amp; quy chế.</td></tr>
<tr><td><strong>EduNext / LMS</strong></td><td>Câu hỏi thảo luận trên lớp, bài tập, quiz &amp; nộp bài.</td></tr>
<tr><td><strong>Mail @fpt.edu.vn</strong></td><td>Thông báo chính thức của trường — kiểm mỗi ngày.</td></tr>
</tbody>
</table>
<h3>Tra khung chương trình</h3>
<p>Trong <strong>View Curriculum</strong> trên FLM, chọn ngành của bạn (Kỹ thuật phần mềm) để xem cả 9 kỳ, các môn từng kỳ, số tín chỉ và môn tiên quyết. Đây là bản đồ cho cả bằng học — dùng nó để thấy sắp học gì và một môn phụ thuộc môn nào.</p>
<h3>Đăng ký môn</h3>
<p>Mỗi kỳ bạn đăng ký (hoặc xác nhận) môn trong <strong>FAP</strong> trong thời gian mở. Chú ý môn tiên quyết — không thể học một môn trước môn bắt buộc đứng trước nó. Bỏ lỡ thời gian mở, bạn có thể bị xếp tự động hoặc phải chờ kỳ sau.</p>
<div class="callout"><span class="badge">Kiểm mỗi ngày</span> Điểm và điểm danh cập nhật ở FAP; câu hỏi lớp học ở EduNext; mail chính thức ở @fpt.edu.vn. Tạo thói quen 5 phút mỗi ngày kiểm cả ba.</div>`,
  ]]);

const c2q = quiz('otp101-quiz-2', 'Quiz 2 — Learning systems|||Quiz 2 — Hệ thống học tập', [
  { id: 'q1', question: 'Xem điểm, lịch học, điểm danh và đăng ký môn ở đâu?', options: ['FLM', 'FAP', 'Notion', 'YouTube'], correctIndex: 1, explanation: 'FAP là nơi quản lý điểm, thời khoá biểu, điểm danh, học phí và đăng ký môn.' },
  { id: 'q2', question: 'Muốn xem đề cương, slide và bản đồ khung chương trình 9 kỳ, dùng?', options: ['FAP', 'FLM (View Curriculum)', 'EduNext', 'Google Meet'], correctIndex: 1, explanation: 'FLM chứa đề cương/tài liệu và View Curriculum cho khung chương trình.' },
  { id: 'q3', question: '"Môn tiên quyết" (prerequisite) nghĩa là gì?', options: ['Môn tự chọn', 'Môn phải hoàn thành trước khi học môn phụ thuộc nó', 'Môn dễ nhất', 'Môn học lại'], correctIndex: 1, explanation: 'Phải qua môn tiên quyết mới được đăng ký môn phụ thuộc nó.' },
]);

const c3 = doc('otp101-3-1-regulations', '3.1 — Academic regulations & integrity|||3.1 — Quy chế học vụ & liêm chính',
  'Thang điểm & điểm chữ, điều kiện qua môn/điểm danh, cảnh báo học vụ, và đạo đức học thuật (cấm gian lận, đạo văn).',
  [[
    `<span class="eyebrow">OTP101 · Chapter 3 · Lesson 3.1</span>
<h2>Academic regulations &amp; integrity</h2>
<h3>The grading scale</h3>
<p>Each course grade combines several components (assignments, progress tests, practical exam, final exam) with weights set in the syllabus. A course typically requires a final-exam minimum <em>and</em> a total at or above the pass mark. Grades map to letters and a 4-point GPA scale.</p>
<pre><code>Example weighting (illustrative — check each syllabus):
  Assignments / labs .... 20%
  Progress tests ........ 20%
  Practical exam ........ 20%
  Final exam ............ 40%   (often needs >= a minimum on its own)
  PASS = total >= 5.0 (on a 10 scale) AND final exam >= its floor
</code></pre>
<h3>Attendance</h3>
<p>Attendance is graded. Exceeding the absence limit for a course (commonly around 20% of sessions) can <strong>block you from the final exam</strong> regardless of your other marks. Treat attendance as a hard rule, not a suggestion.</p>
<h3>Academic warning &amp; progression</h3>
<p>A low GPA or too many failed credits in a term triggers an <strong>academic warning (cảnh báo học vụ)</strong>. Repeated warnings can lead to suspension. Progression to the next level depends on accumulating enough passed credits — falling behind stacks up.</p>
<h3>Academic integrity — non-negotiable</h3>
<p>Cheating, copying, plagiarism, contract-writing and submitting others' work are serious violations with heavy penalties, up to a zero or expulsion. Using AI where it's disallowed, or without citing it, counts too. <strong>When in doubt, ask the lecturer and cite your sources.</strong></p>
<div class="callout"><span class="badge">Two rules that fail people quietly</span> The attendance limit and the final-exam floor sink more students than hard material does. Know both numbers for every course from week 1.</div>`,
    `<span class="eyebrow">OTP101 · Chương 3 · Bài 3.1</span>
<h2>Quy chế học vụ &amp; liêm chính học thuật</h2>
<h3>Thang điểm</h3>
<p>Điểm mỗi môn ghép nhiều thành phần (bài tập, kiểm tra tiến độ, thi thực hành, thi cuối kỳ) với tỉ trọng ghi trong đề cương. Môn thường yêu cầu điểm thi cuối tối thiểu <em>và</em> tổng đạt mức qua. Điểm quy về điểm chữ và GPA thang 4.</p>
<pre><code>Ví dụ tỉ trọng (minh hoạ — xem từng đề cương):
  Bài tập / lab ......... 20%
  Kiểm tra tiến độ ...... 20%
  Thi thực hành ......... 20%
  Thi cuối kỳ ........... 40%   (thường cần >= mức sàn riêng)
  ĐẠT = tổng >= 5.0 (thang 10) VÀ thi cuối >= sàn của nó
</code></pre>
<h3>Điểm danh</h3>
<p>Điểm danh được tính điểm. Vượt giới hạn vắng của môn (thường khoảng 20% số buổi) có thể <strong>khiến bạn không được thi cuối kỳ</strong> dù các điểm khác tốt. Hãy coi điểm danh là luật cứng, không phải gợi ý.</p>
<h3>Cảnh báo học vụ &amp; lên lớp</h3>
<p>GPA thấp hoặc rớt quá nhiều tín chỉ trong kỳ sẽ kích hoạt <strong>cảnh báo học vụ</strong>. Cảnh báo lặp lại có thể dẫn tới buộc thôi học tạm. Việc lên cấp phụ thuộc vào tích luỹ đủ tín chỉ đã qua — tụt lại thì chồng dồn.</p>
<h3>Liêm chính học thuật — không thoả hiệp</h3>
<p>Gian lận, chép bài, đạo văn, thuê viết và nộp bài của người khác là vi phạm nặng, phạt tới điểm 0 hoặc đuổi học. Dùng AI ở chỗ bị cấm, hoặc không ghi nguồn, cũng tính. <strong>Khi phân vân, hỏi giảng viên và trích dẫn nguồn.</strong></p>
<div class="callout"><span class="badge">Hai quy định đánh trượt âm thầm</span> Giới hạn vắng và mức sàn thi cuối làm rớt nhiều sinh viên hơn cả kiến thức khó. Biết cả hai con số cho mọi môn ngay từ tuần 1.</div>`,
  ]]);

const c3q = quiz('otp101-quiz-3', 'Quiz 3 — Regulations & integrity|||Quiz 3 — Quy chế & liêm chính', [
  { id: 'q1', question: 'Vượt giới hạn số buổi vắng của một môn có thể dẫn tới?', options: ['Được cộng điểm', 'Bị cấm thi cuối kỳ dù điểm khác tốt', 'Không ảnh hưởng gì', 'Tự động qua môn'], correctIndex: 1, explanation: 'Vắng quá giới hạn có thể chặn bạn khỏi kỳ thi cuối, bất kể điểm thành phần.' },
  { id: 'q2', question: 'Đạo văn / chép bài / thuê viết bị xử lý thế nào?', options: ['Được khuyến khích', 'Là vi phạm liêm chính, phạt nặng tới điểm 0/đuổi học', 'Chỉ bị nhắc nhở nhẹ', 'Không có quy định'], correctIndex: 1, explanation: 'Gian lận và đạo văn là vi phạm nghiêm trọng, hình phạt rất nặng.' },
  { id: 'q3', question: 'GPA thấp hoặc rớt quá nhiều tín chỉ trong kỳ sẽ dẫn tới?', options: ['Học bổng', 'Cảnh báo học vụ', 'Miễn học phí', 'Rút ngắn khoá học'], correctIndex: 1, explanation: 'Kết quả yếu kích hoạt cảnh báo học vụ; lặp lại có thể buộc thôi học tạm.' },
]);

const c4 = doc('otp101-4-1-study-methods', '4.1 — How to study at university|||4.1 — Phương pháp học đại học',
  'Học chủ động & tự học, quản lý thời gian (Pomodoro, ma trận Eisenhower), và ghi chú hiệu quả.',
  [[
    `<span class="eyebrow">OTP101 · Chapter 4 · Lesson 4.1</span>
<h2>How to study at university</h2>
<h3>From passive to active learning</h3>
<p>High school often rewards memorising what the teacher says. University rewards <strong>active learning</strong>: you read before class, ask questions, do the exercises, and teach the idea back to yourself. Most of the real learning happens <em>outside</em> the classroom — expect roughly two hours of self-study for every hour in class.</p>
<h3>Time management</h3>
<ul>
<li><strong>Pomodoro</strong> — work in focused 25-minute blocks with 5-minute breaks; after four blocks, a longer break. It beats procrastination by making the first step small.</li>
<li><strong>Eisenhower matrix</strong> — sort tasks by <em>urgent</em> vs <em>important</em>; do the important-not-urgent work (studying, projects) <strong>before</strong> it becomes a last-minute emergency.</li>
</ul>
<pre><code>Eisenhower matrix:
             URGENT            NOT URGENT
IMPORTANT    Do now            Schedule  <- live here
NOT IMPORTANT Delegate/limit   Eliminate
</code></pre>
<h3>Note-taking</h3>
<p>Notes are for <em>recall</em>, not transcription. Use a system — Cornell (cue / notes / summary), an outline, or a mind map — and review within 24 hours. Better still, use <strong>active recall</strong> (quiz yourself) and <strong>spaced repetition</strong> (revisit at growing intervals) — the two most evidence-backed study techniques there are.</p>
<div class="callout"><span class="badge">The two-hour rule</span> Plan self-study time on your calendar the way you plan classes. Time that isn't scheduled tends to vanish.</div>`,
    `<span class="eyebrow">OTP101 · Chương 4 · Bài 4.1</span>
<h2>Phương pháp học đại học</h2>
<h3>Từ học thụ động sang học chủ động</h3>
<p>Phổ thông thường thưởng cho việc nhớ lời thầy cô. Đại học thưởng cho <strong>học chủ động</strong>: bạn đọc trước buổi học, đặt câu hỏi, làm bài tập, và tự giảng lại ý cho chính mình. Phần lớn việc học thật diễn ra <em>ngoài</em> lớp — hãy tính khoảng hai giờ tự học cho mỗi giờ trên lớp.</p>
<h3>Quản lý thời gian</h3>
<ul>
<li><strong>Pomodoro</strong> — làm theo khối tập trung 25 phút, nghỉ 5 phút; sau bốn khối nghỉ dài hơn. Nó thắng trì hoãn bằng cách làm bước đầu tiên nhỏ lại.</li>
<li><strong>Ma trận Eisenhower</strong> — phân việc theo <em>khẩn</em> và <em>quan trọng</em>; làm việc quan-trọng-nhưng-chưa-khẩn (học, đồ án) <strong>trước khi</strong> nó thành khẩn cấp phút chót.</li>
</ul>
<pre><code>Ma trận Eisenhower:
                  KHẨN           CHƯA KHẨN
QUAN TRỌNG        Làm ngay       Lên lịch  <- sống ở đây
KHÔNG QUAN TRỌNG  Uỷ thác/hạn    Loại bỏ
</code></pre>
<h3>Ghi chú</h3>
<p>Ghi chú để <em>nhớ lại</em>, không phải chép nguyên. Dùng một hệ thống — Cornell (gợi ý / ghi chú / tóm tắt), dàn ý, hay sơ đồ tư duy — và ôn trong 24 giờ. Tốt hơn nữa, dùng <strong>gợi nhớ chủ động</strong> (tự kiểm) và <strong>lặp lại ngắt quãng</strong> (ôn lại theo khoảng tăng dần) — hai kỹ thuật học có bằng chứng mạnh nhất.</p>
<div class="callout"><span class="badge">Quy tắc hai giờ</span> Xếp thời gian tự học vào lịch như xếp lịch học. Thời gian không được lên lịch thường biến mất.</div>`,
  ]]);

const c4q = quiz('otp101-quiz-4', 'Quiz 4 — Study methods|||Quiz 4 — Phương pháp học', [
  { id: 'q1', question: 'Kỹ thuật Pomodoro làm việc theo?', options: ['Học liên tục 5 giờ không nghỉ', 'Khối tập trung 25 phút xen nghỉ ngắn', 'Chỉ học khi có hứng', 'Học nhóm bắt buộc'], correctIndex: 1, explanation: 'Pomodoro: các khối 25 phút tập trung, nghỉ 5 phút, sau 4 khối nghỉ dài.' },
  { id: 'q2', question: 'Trong ma trận Eisenhower, nên dành nhiều công cho ô nào để tránh khủng hoảng phút chót?', options: ['Khẩn & không quan trọng', 'Quan trọng nhưng chưa khẩn (lên lịch)', 'Không quan trọng & không khẩn', 'Chỉ ô khẩn'], correctIndex: 1, explanation: 'Làm việc quan-trọng-chưa-khẩn sớm giúp nó không trở thành khẩn cấp.' },
  { id: 'q3', question: 'Hai kỹ thuật học có bằng chứng mạnh nhất là?', options: ['Đọc lại nhiều lần & tô màu', 'Gợi nhớ chủ động (active recall) & lặp lại ngắt quãng', 'Nghe nhạc & học đêm', 'Học dồn trước thi'], correctIndex: 1, explanation: 'Active recall và spaced repetition là hai kỹ thuật hiệu quả nhất theo nghiên cứu.' },
]);

const c5 = doc('otp101-5-1-digital-english', '5.1 — Digital skills & English|||5.1 — Kỹ năng số & tiếng Anh',
  'Vì sao tiếng Anh quan trọng ở FPTU, lộ trình TOEIC/chuẩn đầu ra ngoại ngữ, và dùng công cụ AI học tập đúng cách.',
  [[
    `<span class="eyebrow">OTP101 · Chapter 5 · Lesson 5.1</span>
<h2>Digital skills &amp; English</h2>
<h3>Why English is non-negotiable here</h3>
<p>At FPTU most specialized courses are <strong>taught and examined in English</strong>, and the entire software industry documents in English. Your English level is a gate, not a bonus: a graduation-level requirement (typically a <strong>TOEIC</strong> target) must be met to progress and graduate. Weak English slows down every technical course you take.</p>
<h3>The English path</h3>
<ul>
<li>Many students begin with preparatory English levels before specialized courses.</li>
<li>Build a daily habit: read documentation in English, watch tech talks with English subtitles, keep a vocabulary log.</li>
<li>Practice all four skills — listening &amp; reading are tested by TOEIC, but speaking &amp; writing decide interviews.</li>
</ul>
<h3>Digital &amp; AI study tools — used well</h3>
<p>You'll rely on Google Workspace, a good editor, version control and note tools. <strong>AI assistants</strong> can explain a concept, generate practice questions, or review your writing — but they also invent facts. Use them to <em>learn faster</em>, never to <em>submit work you don't understand</em>, and follow each course's rules on AI. Verify anything an AI tells you against the syllabus or documentation.</p>
<div class="callout"><span class="badge">English compounds</span> Thirty minutes of English every day beats cramming before a TOEIC test. Start in semester 1 — it makes semesters 2 through 9 easier.</div>`,
    `<span class="eyebrow">OTP101 · Chương 5 · Bài 5.1</span>
<h2>Kỹ năng số &amp; tiếng Anh</h2>
<h3>Vì sao tiếng Anh không thể thương lượng ở đây</h3>
<p>Ở FPTU, phần lớn môn chuyên ngành <strong>dạy và thi bằng tiếng Anh</strong>, và cả ngành phần mềm ghi tài liệu bằng tiếng Anh. Trình độ tiếng Anh là cửa ải, không phải điểm cộng: một yêu cầu chuẩn đầu ra (thường là mốc <strong>TOEIC</strong>) phải đạt mới được lên lớp và tốt nghiệp. Tiếng Anh yếu làm chậm mọi môn kỹ thuật bạn học.</p>
<h3>Lộ trình tiếng Anh</h3>
<ul>
<li>Nhiều sinh viên bắt đầu với các cấp tiếng Anh dự bị trước khi vào môn chuyên ngành.</li>
<li>Xây thói quen mỗi ngày: đọc tài liệu tiếng Anh, xem talk công nghệ có phụ đề Anh, ghi sổ từ vựng.</li>
<li>Luyện cả bốn kỹ năng — TOEIC kiểm nghe &amp; đọc, nhưng nói &amp; viết quyết định buổi phỏng vấn.</li>
</ul>
<h3>Công cụ số &amp; AI học tập — dùng đúng</h3>
<p>Bạn sẽ dựa vào Google Workspace, một trình soạn tốt, quản lý phiên bản và công cụ ghi chú. <strong>Trợ lý AI</strong> có thể giải thích khái niệm, sinh câu hỏi luyện tập, hay soát bài viết — nhưng chúng cũng bịa sự thật. Dùng để <em>học nhanh hơn</em>, đừng bao giờ <em>nộp thứ mình không hiểu</em>, và tuân quy định về AI của từng môn. Kiểm lại mọi điều AI nói với đề cương hoặc tài liệu.</p>
<div class="callout"><span class="badge">Tiếng Anh sinh lãi kép</span> Ba mươi phút tiếng Anh mỗi ngày thắng việc nhồi trước kỳ thi TOEIC. Bắt đầu từ kỳ 1 — nó làm kỳ 2 đến 9 nhẹ hơn.</div>`,
  ]]);

const c5q = quiz('otp101-quiz-5', 'Quiz 5 — Digital skills & English|||Quiz 5 — Kỹ năng số & tiếng Anh', [
  { id: 'q1', question: 'Ở FPTU, tiếng Anh có vai trò thế nào?', options: ['Chỉ là môn phụ tuỳ chọn', 'Là chuẩn đầu ra bắt buộc & ngôn ngữ dạy môn chuyên ngành', 'Không cần dùng', 'Chỉ dùng năm cuối'], correctIndex: 1, explanation: 'Nhiều môn dạy/thi bằng tiếng Anh; đạt chuẩn ngoại ngữ (TOEIC) là điều kiện lên lớp/tốt nghiệp.' },
  { id: 'q2', question: 'Cách dùng trợ lý AI trong học tập đúng đắn là?', options: ['Nộp thẳng bài AI viết mà không đọc', 'Học nhanh hơn nhưng kiểm chứng và tuân quy định môn', 'Tin tuyệt đối mọi thứ AI nói', 'Dùng để gian lận thi'], correctIndex: 1, explanation: 'AI có thể bịa; dùng để học, kiểm chứng lại và theo quy định về AI của môn.' },
  { id: 'q3', question: 'Thói quen tiếng Anh hiệu quả nhất là?', options: ['Nhồi một đêm trước thi', 'Luyện đều mỗi ngày từ kỳ 1', 'Chỉ học ngữ pháp', 'Đợi tới năm cuối'], correctIndex: 1, explanation: 'Luyện đều đặn hằng ngày (sinh lãi kép) hiệu quả hơn nhồi trước thi.' },
]);

const c6 = doc('otp101-6-1-student-life', '6.1 — Student life & wellbeing|||6.1 — Đời sống sinh viên & sức khoẻ',
  'CLB & hoạt động, sức khoẻ tinh thần, cân bằng học–chơi–nghỉ, và đời sống nội trú/ký túc xá.',
  [[
    `<span class="eyebrow">OTP101 · Chapter 6 · Lesson 6.1</span>
<h2>Student life &amp; wellbeing</h2>
<h3>Clubs &amp; activities</h3>
<p>FPTU has dozens of clubs — coding, English, music, sports, entrepreneurship, volunteering. Joining one is the fastest way to make friends, build soft skills and find mentors a year or two ahead of you. Employers notice leadership in a club; so do the seniors who later refer you for internships.</p>
<h3>Mental health matters</h3>
<p>The jump to university — new city, new workload, living away from home — is real. Stress, homesickness and burnout are common and <strong>not a weakness</strong>. Talk to friends, mentors, or the school's student-support services early. A bad week is normal; a bad month is a signal to ask for help.</p>
<h3>Balance</h3>
<ul>
<li><strong>Sleep</strong> — 7–8 hours; all-nighters wreck the memory consolidation that studying depends on.</li>
<li><strong>Move</strong> — exercise (Vovinam, gym, sport) lifts focus and mood.</li>
<li><strong>Boundaries</strong> — schedule rest deliberately so work doesn't sprawl into all hours.</li>
</ul>
<h3>Dormitory &amp; living away from home</h3>
<p>Many first-years live in the dormitory (ký túc xá). It teaches independence — budgeting, cooking, sharing space, resolving roommate friction. Learn campus services (library, health, IT support) in week one so you're not hunting for them mid-crisis.</p>
<div class="callout"><span class="badge">You're not alone</span> Everyone in your cohort is adjusting too. Reaching out early — to a club, a mentor, support services — is a strength, not a failure.</div>`,
    `<span class="eyebrow">OTP101 · Chương 6 · Bài 6.1</span>
<h2>Đời sống sinh viên &amp; sức khoẻ</h2>
<h3>Câu lạc bộ &amp; hoạt động</h3>
<p>FPTU có hàng chục CLB — lập trình, tiếng Anh, âm nhạc, thể thao, khởi nghiệp, tình nguyện. Tham gia một CLB là cách nhanh nhất để kết bạn, xây kỹ năng mềm và tìm những đàn anh đi trước một hai năm. Nhà tuyển dụng để ý vai trò lãnh đạo trong CLB; các anh chị khoá trên — người sau này giới thiệu bạn đi thực tập — cũng vậy.</p>
<h3>Sức khoẻ tinh thần rất quan trọng</h3>
<p>Bước nhảy lên đại học — thành phố mới, khối lượng học mới, sống xa nhà — là có thật. Căng thẳng, nhớ nhà và kiệt sức là chuyện thường và <strong>không phải điểm yếu</strong>. Hãy nói với bạn bè, mentor, hoặc dịch vụ hỗ trợ sinh viên của trường sớm. Một tuần tệ là bình thường; một tháng tệ là tín hiệu cần tìm giúp đỡ.</p>
<h3>Cân bằng</h3>
<ul>
<li><strong>Ngủ</strong> — 7–8 giờ; thức trắng phá hỏng quá trình củng cố trí nhớ mà việc học dựa vào.</li>
<li><strong>Vận động</strong> — tập luyện (Vovinam, gym, thể thao) nâng sự tập trung và tâm trạng.</li>
<li><strong>Ranh giới</strong> — chủ động xếp lịch nghỉ để việc học không tràn vào mọi giờ.</li>
</ul>
<h3>Nội trú &amp; sống xa nhà</h3>
<p>Nhiều sinh viên năm nhất ở ký túc xá. Nó dạy tự lập — quản lý chi tiêu, nấu ăn, chia sẻ không gian, giải quyết va chạm với bạn cùng phòng. Tìm hiểu dịch vụ trong trường (thư viện, y tế, hỗ trợ IT) ngay tuần đầu để không phải lần mò giữa lúc khủng hoảng.</p>
<div class="callout"><span class="badge">Bạn không đơn độc</span> Mọi người trong khoá đều đang thích nghi. Chủ động tìm đến — một CLB, một mentor, dịch vụ hỗ trợ — là điểm mạnh, không phải thất bại.</div>`,
  ]]);

const c6q = quiz('otp101-quiz-6', 'Quiz 6 — Student life|||Quiz 6 — Đời sống sinh viên', [
  { id: 'q1', question: 'Lợi ích lớn của việc tham gia CLB ở FPTU là?', options: ['Được miễn thi', 'Kết bạn, rèn kỹ năng mềm, có mentor & mạng lưới', 'Tăng GPA tự động', 'Không có lợi ích'], correctIndex: 1, explanation: 'CLB giúp kết bạn, xây kỹ năng mềm, tìm mentor và mở mạng lưới nghề nghiệp.' },
  { id: 'q2', question: 'Khi thấy căng thẳng/nhớ nhà/kiệt sức kéo dài, nên?', options: ['Giấu đi vì đó là điểm yếu', 'Tìm bạn, mentor hoặc hỗ trợ sinh viên sớm', 'Bỏ học', 'Thức trắng học bù'], correctIndex: 1, explanation: 'Stress là bình thường; tìm giúp đỡ sớm là điểm mạnh, không phải thất bại.' },
  { id: 'q3', question: 'Vì sao thức trắng học bài lại phản tác dụng?', options: ['Vì tốn điện', 'Vì thiếu ngủ phá hỏng củng cố trí nhớ', 'Vì bị phạt tiền', 'Không phản tác dụng'], correctIndex: 1, explanation: 'Ngủ đủ giúp củng cố trí nhớ; thức trắng làm giảm khả năng ghi nhớ.' },
]);

const c7 = doc('otp101-7-1-career', '7.1 — Early career orientation|||7.1 — Định hướng nghề nghiệp sớm',
  'Lộ trình 9 kỳ của ngành SE, OJT (thực tập doanh nghiệp), chọn chuyên ngành hẹp, và xây portfolio/GitHub ngay từ năm 1.',
  [[
    `<span class="eyebrow">OTP101 · Chapter 7 · Lesson 7.1</span>
<h2>Early career orientation</h2>
<h3>The 9-semester roadmap</h3>
<p>The SE degree runs about 9 semesters. Broadly: foundations (programming, math, OOP) → core software (data structures, databases, web/mobile) → engineering &amp; specialization (software architecture, testing, a chosen track) → <strong>OJT</strong> → capstone project → graduation. Knowing where you are on this map keeps each course from feeling random.</p>
<h3>OJT — On-the-Job Training</h3>
<p>A full semester inside a real company. It's where classroom skills meet real deadlines, code review and teams. Students who arrived with a portfolio and real projects get the better placements — so the work you do <em>now</em> shapes the OJT you get later.</p>
<h3>Choosing a specialization</h3>
<p>Later semesters let you lean into a track — web/back-end, mobile, AI/data, embedded, security, and so on. You don't have to decide today, but sampling early (side projects, clubs, electives) tells you what you actually enjoy.</p>
<h3>Build a portfolio &amp; GitHub from year 1</h3>
<ul>
<li>Put <strong>every</strong> project — even coursework — on <a href="https://github.com" target="_blank" rel="noopener">GitHub</a> with a clear README.</li>
<li>Commit small and often; a green, active history shows employers you actually build.</li>
<li>By graduation you want 3–5 projects you can talk about in depth, not just a transcript.</li>
</ul>
<div class="callout"><span class="badge">Start the clock now</span> A student who opens a GitHub in semester 1 and ships one small project per course graduates with a portfolio. The transcript is expected; the portfolio is what gets the interview.</div>`,
    `<span class="eyebrow">OTP101 · Chương 7 · Bài 7.1</span>
<h2>Định hướng nghề nghiệp sớm</h2>
<h3>Lộ trình 9 kỳ</h3>
<p>Bằng SE kéo dài khoảng 9 kỳ. Đại thể: nền tảng (lập trình, toán, OOP) → phần mềm cốt lõi (cấu trúc dữ liệu, cơ sở dữ liệu, web/mobile) → kỹ thuật &amp; chuyên sâu (kiến trúc phần mềm, kiểm thử, một hướng đã chọn) → <strong>OJT</strong> → đồ án tốt nghiệp → ra trường. Biết mình đang ở đâu trên bản đồ này giúp từng môn không còn ngẫu nhiên.</p>
<h3>OJT — thực tập tại doanh nghiệp</h3>
<p>Một học kỳ trọn vẹn bên trong công ty thật. Đây là nơi kỹ năng trên lớp gặp deadline thật, review code và làm việc nhóm. Sinh viên đến với portfolio và dự án thật nhận được vị trí tốt hơn — nên việc bạn làm <em>bây giờ</em> định hình OJT bạn có về sau.</p>
<h3>Chọn chuyên ngành hẹp</h3>
<p>Các kỳ sau cho bạn nghiêng vào một hướng — web/back-end, mobile, AI/dữ liệu, nhúng, bảo mật, v.v. Không phải quyết hôm nay, nhưng thử sớm (dự án phụ, CLB, môn tự chọn) cho bạn biết mình thật sự thích gì.</p>
<h3>Xây portfolio &amp; GitHub từ năm 1</h3>
<ul>
<li>Đưa <strong>mọi</strong> dự án — kể cả bài tập môn — lên <a href="https://github.com" target="_blank" rel="noopener">GitHub</a> kèm README rõ ràng.</li>
<li>Commit nhỏ và đều; một lịch sử xanh, năng động cho nhà tuyển dụng thấy bạn thật sự làm.</li>
<li>Đến khi tốt nghiệp, hãy có 3–5 dự án bạn nói sâu được, không chỉ bảng điểm.</li>
</ul>
<div class="callout"><span class="badge">Bấm giờ từ bây giờ</span> Sinh viên mở GitHub từ kỳ 1 và ship một dự án nhỏ mỗi môn sẽ tốt nghiệp với một portfolio. Bảng điểm là điều đương nhiên; portfolio mới là thứ mang lại buổi phỏng vấn.</div>`,
  ]]);

const c7q = quiz('otp101-quiz-7', 'Quiz 7 — Career orientation|||Quiz 7 — Định hướng nghề nghiệp', [
  { id: 'q1', question: 'OJT trong ngành SE là gì?', options: ['Một kỳ thi', 'Một học kỳ thực tập làm việc tại doanh nghiệp thật', 'Môn thể thao', 'Đồ án nhóm nhỏ trên lớp'], correctIndex: 1, explanation: 'OJT là học kỳ thực tập tại công ty thật, nơi kỹ năng gặp deadline và làm việc nhóm.' },
  { id: 'q2', question: 'Vì sao nên xây GitHub/portfolio ngay từ năm 1?', options: ['Để tăng GPA tự động', 'Để tích luỹ 3–5 dự án nói sâu được, giúp có OJT/việc làm tốt', 'Vì bắt buộc mỗi ngày', 'Không cần thiết'], correctIndex: 1, explanation: 'Portfolio tích luỹ theo thời gian; nó là thứ mang lại phỏng vấn ngoài bảng điểm.' },
  { id: 'q3', question: 'Chọn chuyên ngành hẹp nên làm thế nào?', options: ['Quyết ngay ngày đầu, không đổi', 'Thử sớm qua dự án phụ/CLB/môn tự chọn rồi chọn hướng', 'Chờ đến khi ra trường', 'Chọn ngẫu nhiên'], correctIndex: 1, explanation: 'Thử nhiều hướng sớm giúp bạn biết mình thích gì trước khi chuyên sâu.' },
]);

const c8 = doc('otp101-8-1-growth-mindset', '8.1 — Growth mindset & SMART goals|||8.1 — Tư duy phát triển & mục tiêu SMART',
  'Tư duy phát triển (growth mindset), đặt mục tiêu SMART, và những thói quen của sinh viên thành công.',
  [[
    `<span class="eyebrow">OTP101 · Chapter 8 · Lesson 8.1</span>
<h2>Growth mindset &amp; SMART goals</h2>
<h3>Fixed vs growth mindset</h3>
<p>A <strong>fixed mindset</strong> says ability is set — "I'm just not a math person." A <strong>growth mindset</strong> says ability grows with effort and good strategy. The research (Carol Dweck) is clear: students who treat difficulty as a signal to try a new approach, not proof they can't, learn more. In programming especially, <em>everyone</em> is confused at first — that's the job, not a verdict on you.</p>
<h3>Set SMART goals</h3>
<p>Vague goals ("do better this semester") don't drive action. Make them <strong>SMART</strong>:</p>
<table>
<thead><tr><th>Letter</th><th>Means</th><th>Example</th></tr></thead>
<tbody>
<tr><td><strong>S</strong>pecific</td><td>Clear target</td><td>Reach TOEIC 600</td></tr>
<tr><td><strong>M</strong>easurable</td><td>You can check it</td><td>Score on a mock test</td></tr>
<tr><td><strong>A</strong>chievable</td><td>Realistic</td><td>+100 points this term</td></tr>
<tr><td><strong>R</strong>elevant</td><td>Matters to you</td><td>Needed to graduate</td></tr>
<tr><td><strong>T</strong>ime-bound</td><td>Has a deadline</td><td>By end of semester</td></tr>
</tbody>
</table>
<h3>Habits of successful students</h3>
<ul>
<li>Show up — attendance and consistency beat bursts of cramming.</li>
<li>Start early — begin assignments the day they're given, not the night before.</li>
<li>Ask for help fast — a stuck hour is fine; a stuck week is wasted.</li>
<li>Reflect weekly — a 10-minute review of what worked keeps you steering.</li>
</ul>
<div class="callout"><span class="badge">One system beats one goal</span> Goals set the direction; daily habits do the work. Design a small routine you can keep even on a bad day, and let it compound over four years.</div>`,
    `<span class="eyebrow">OTP101 · Chương 8 · Bài 8.1</span>
<h2>Tư duy phát triển &amp; mục tiêu SMART</h2>
<h3>Tư duy cố định và tư duy phát triển</h3>
<p><strong>Tư duy cố định</strong> cho rằng năng lực là bất biến — "tôi vốn không hợp với toán". <strong>Tư duy phát triển</strong> tin năng lực lớn lên nhờ nỗ lực và chiến lược tốt. Nghiên cứu (Carol Dweck) rất rõ: sinh viên coi khó khăn là tín hiệu để thử cách mới, chứ không phải bằng chứng mình bất tài, sẽ học được nhiều hơn. Trong lập trình, <em>ai</em> cũng rối lúc đầu — đó là bản chất công việc, không phải phán xét về bạn.</p>
<h3>Đặt mục tiêu SMART</h3>
<p>Mục tiêu mơ hồ ("kỳ này học tốt hơn") không tạo hành động. Hãy làm nó <strong>SMART</strong>:</p>
<table>
<thead><tr><th>Chữ</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td><strong>S</strong> — Cụ thể</td><td>Đích rõ ràng</td><td>Đạt TOEIC 600</td></tr>
<tr><td><strong>M</strong> — Đo được</td><td>Kiểm chứng được</td><td>Điểm bài thi thử</td></tr>
<tr><td><strong>A</strong> — Khả thi</td><td>Thực tế</td><td>+100 điểm trong kỳ</td></tr>
<tr><td><strong>R</strong> — Liên quan</td><td>Có ý nghĩa với bạn</td><td>Cần để tốt nghiệp</td></tr>
<tr><td><strong>T</strong> — Có hạn</td><td>Có deadline</td><td>Trước cuối kỳ</td></tr>
</tbody>
</table>
<h3>Thói quen của sinh viên thành công</h3>
<ul>
<li>Có mặt — đi học đều &amp; kiên trì thắng những đợt nhồi ngắn.</li>
<li>Bắt đầu sớm — làm bài ngay hôm được giao, không phải đêm trước hạn.</li>
<li>Hỏi giúp đỡ nhanh — kẹt một giờ là bình thường; kẹt một tuần là lãng phí.</li>
<li>Nhìn lại hằng tuần — 10 phút xem điều gì hiệu quả giúp bạn giữ lái.</li>
</ul>
<div class="callout"><span class="badge">Hệ thống thắng mục tiêu đơn lẻ</span> Mục tiêu định hướng; thói quen hằng ngày mới làm việc. Thiết kế một nếp nhỏ bạn giữ được cả trong ngày tệ, và để nó sinh lãi kép qua bốn năm.</div>`,
  ]]);

const c8q = quiz('otp101-quiz-8', 'Quiz 8 — Growth mindset & goals|||Quiz 8 — Tư duy phát triển & mục tiêu', [
  { id: 'q1', question: 'Tư duy phát triển (growth mindset) tin rằng?', options: ['Năng lực là bất biến bẩm sinh', 'Năng lực lớn lên nhờ nỗ lực & chiến lược tốt', 'Chỉ người thông minh mới học được', 'Khó khăn nghĩa là nên bỏ cuộc'], correctIndex: 1, explanation: 'Growth mindset: năng lực phát triển qua nỗ lực và cách học tốt; khó khăn là tín hiệu thử cách mới.' },
  { id: 'q2', question: 'Chữ "M" trong mục tiêu SMART nghĩa là?', options: ['Motivated (có động lực)', 'Measurable (đo được)', 'Massive (to lớn)', 'Manual (thủ công)'], correctIndex: 1, explanation: 'SMART = Specific, Measurable, Achievable, Relevant, Time-bound; M là đo được.' },
  { id: 'q3', question: 'Thói quen nào giúp tránh khủng hoảng phút chót nhất?', options: ['Nhồi đêm trước hạn', 'Bắt đầu bài ngay hôm được giao', 'Chỉ học khi có hứng', 'Bỏ qua bài khó'], correctIndex: 1, explanation: 'Bắt đầu sớm và làm đều giúp tránh dồn việc và khủng hoảng phút chót.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'OTP101',
    slug: 'otp101-orientation-and-general-training-program',
    title: 'Orientation and General Training Program',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/OTP101.webp',
    shortDescription: 'Your first course at FPTU — a freshman survival guide: welcome & the SE program, the learning systems (FLM/FAP/EduNext), academic regulations & integrity, how to study at university, digital skills & English, student life, early career orientation, and a growth mindset. Bilingual, with quizzes.|||Môn đầu tiên ở FPTU — cẩm nang tân sinh viên: chào mừng & ngành SE, hệ thống học tập (FLM/FAP/EduNext), quy chế học vụ & liêm chính, cách học đại học, kỹ năng số & tiếng Anh, đời sống SV, định hướng nghề nghiệp sớm và tư duy phát triển. Song ngữ, có quiz.',
    description: 'Môn <strong>OTP101 — Orientation and General Training Program</strong> (Kỳ 1, ngành Kỹ thuật phần mềm) là <strong>cẩm nang định hướng nhập học</strong> giúp bạn khởi đầu vững ở Đại học FPT. Nội dung đi từ <strong>chào mừng &amp; triết lý đào tạo, ngành SE</strong> → <strong>hệ thống học tập</strong> (FLM, FAP, EduNext) → <strong>quy chế học vụ &amp; đạo đức học thuật</strong> → <strong>phương pháp học đại học</strong> (Pomodoro, Eisenhower, ghi chú) → <strong>kỹ năng số &amp; tiếng Anh</strong> (TOEIC, công cụ AI) → <strong>đời sống sinh viên</strong> → <strong>định hướng nghề nghiệp sớm</strong> (lộ trình 9 kỳ, OJT, portfolio/GitHub) → <strong>tư duy phát triển &amp; mục tiêu SMART</strong>. Song ngữ EN+VI, thực tế &amp; truyền cảm hứng, quiz mỗi chương.',
    whatYouLearn: 'Cách dùng FLM/FAP/EduNext; tra khung chương trình & đăng ký môn; thang điểm, điều kiện qua môn, giới hạn điểm danh, cảnh báo học vụ & liêm chính học thuật; học chủ động, quản lý thời gian (Pomodoro/Eisenhower), ghi chú (active recall/spaced repetition); vai trò tiếng Anh & lộ trình TOEIC; dùng công cụ AI đúng cách; đời sống SV & sức khoẻ tinh thần; lộ trình 9 kỳ, OJT, xây portfolio/GitHub từ năm 1; tư duy phát triển & đặt mục tiêu SMART.',
    requirements: 'Không có điều kiện tiên quyết. Kích hoạt tài khoản FPTU (FAP, FLM, mail @fpt.edu.vn) trước khi bắt đầu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sổ tay & quy chế trên FLM/FAP, tài liệu kỹ năng học tập, YouTube, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'OTP101 làm gì & vì sao môn định hướng quan trọng.', lessons: [intro] },
    { title: 'Chương 1 — Chào mừng tới FPTU|||Chapter 1 — Welcome to FPTU', description: 'Triết lý, mô hình đào tạo, chuẩn đầu ra, ngành SE.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hệ thống học tập|||Chapter 2 — Learning systems', description: 'FLM, FAP, EduNext; khung chương trình & đăng ký môn.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quy chế học vụ|||Chapter 3 — Academic regulations', description: 'Thang điểm, qua môn, điểm danh, cảnh báo, liêm chính.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phương pháp học đại học|||Chapter 4 — How to study', description: 'Học chủ động, Pomodoro, Eisenhower, ghi chú.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kỹ năng số & tiếng Anh|||Chapter 5 — Digital skills & English', description: 'Tiếng Anh, TOEIC, công cụ AI học tập.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đời sống sinh viên|||Chapter 6 — Student life', description: 'CLB, sức khoẻ tinh thần, cân bằng, ký túc xá.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Định hướng nghề nghiệp sớm|||Chapter 7 — Early career', description: 'Lộ trình 9 kỳ, OJT, chuyên ngành, portfolio/GitHub.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tư duy phát triển|||Chapter 8 — Growth mindset', description: 'Growth mindset, mục tiêu SMART, thói quen thành công.', lessons: [c8, c8q] },
  ],
};
