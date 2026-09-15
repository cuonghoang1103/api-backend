/**
 * OJB202 — On-the-Job Training. Khối Kinh doanh (BBA), FPTU, kỳ 6 — Thực tập.
 * ⚠️ Đây là môn THỰC TẬP: khung theo 8 GIAI ĐOẠN của một kỳ OJT tại doanh
 * nghiệp (chuẩn bị → xin việc → hoà nhập → đạo đức nghề → thực hiện việc &
 * nhật ký → giao tiếp/xử lý tình huống → viết báo cáo → đánh giá & định
 * hướng), KHÔNG phải 8 chương lý thuyết. Song ngữ + checklist/mẫu + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức giai đoạn.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ojb202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: quy định thực tập FPTU (FLM), kỹ năng nghề nghiệp, CV/phỏng vấn, LinkedIn Learning — không upload PDF.',
  [[
    `<span class="eyebrow">OJB202 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need for a successful <strong>On-the-Job Training (OJT)</strong> term — from finding a placement to writing the final report — in one place. Official FPTU regulations live on <strong>FLM</strong>; below are free, legal resources for professional and job-seeking skills.</p>
<h3>📘 FPTU internship regulations</h3>
<p>The official OJT guideline, report template and grading rubric are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account and check your major's OJT syllabus for exact deliverables and deadlines.</p>
<h3>🎓 Career &amp; professional skills (free)</h3>
<ul>
<li><a href="https://www.linkedin.com/learning/" target="_blank" rel="noopener">LinkedIn Learning</a> — workplace communication, professionalism, business etiquette courses (often free via university/library access).</li>
<li><a href="https://www.themuse.com/advice" target="_blank" rel="noopener">The Muse — Career Advice</a> — internship, resume and interview guides.</li>
<li><a href="https://www.indeed.com/career-advice" target="_blank" rel="noopener">Indeed Career Guide</a> — CV templates, interview questions, workplace skills.</li>
</ul>
<h3>📝 CV &amp; interview</h3>
<ul>
<li><a href="https://www.themuse.com/advice/resume" target="_blank" rel="noopener">The Muse — Resume examples</a></li>
<li><a href="https://www.indeed.com/career-advice/interviewing/star-interview-method" target="_blank" rel="noopener">Indeed — the STAR interview method</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@LinkedIn" target="_blank" rel="noopener">LinkedIn</a> — job search &amp; interview tips</li>
<li><a href="https://www.youtube.com/@IndeedCareerGuide" target="_blank" rel="noopener">Indeed Career Guide (YouTube)</a> — resume &amp; interview walkthroughs</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Before the term</strong> — self-assess skills/goals, search placements, prepare CV &amp; ace the interview.</li>
<li><strong>First weeks</strong> — onboard fast: org chart, culture, IT/security rules, meet your supervisor.</li>
<li><strong>Through the term</strong> — do the work with professionalism &amp; ethics, keep a daily logbook, communicate well.</li>
<li><strong>Closing out</strong> — write a well-structured report, prepare the defense, plan your next career step.</li>
</ol></div>`,
    `<span class="eyebrow">OJB202 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cần cho một kỳ <strong>Thực tập doanh nghiệp (OJT)</strong> thành công — từ tìm nơi thực tập đến viết báo cáo cuối kỳ — gom về một chỗ. Quy định chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp cho kỹ năng nghề nghiệp và xin việc.</p>
<h3>📘 Quy định thực tập FPTU</h3>
<p>Hướng dẫn OJT chính thức, mẫu báo cáo và rubric chấm điểm có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU và xem đúng syllabus OJT của ngành mình để biết deliverable và hạn nộp cụ thể.</p>
<h3>🎓 Kỹ năng nghề nghiệp (miễn phí)</h3>
<ul>
<li><a href="https://www.linkedin.com/learning/" target="_blank" rel="noopener">LinkedIn Learning</a> — khoá giao tiếp công sở, sự chuyên nghiệp, ứng xử doanh nghiệp (thường miễn phí qua trường/thư viện).</li>
<li><a href="https://www.themuse.com/advice" target="_blank" rel="noopener">The Muse — Career Advice</a> — hướng dẫn thực tập, CV, phỏng vấn.</li>
<li><a href="https://www.indeed.com/career-advice" target="_blank" rel="noopener">Indeed Career Guide</a> — mẫu CV, câu hỏi phỏng vấn, kỹ năng công sở.</li>
</ul>
<h3>📝 CV &amp; phỏng vấn</h3>
<ul>
<li><a href="https://www.themuse.com/advice/resume" target="_blank" rel="noopener">The Muse — mẫu CV</a></li>
<li><a href="https://www.indeed.com/career-advice/interviewing/star-interview-method" target="_blank" rel="noopener">Indeed — phương pháp phỏng vấn STAR</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@LinkedIn" target="_blank" rel="noopener">LinkedIn</a> — mẹo tìm việc &amp; phỏng vấn</li>
<li><a href="https://www.youtube.com/@IndeedCareerGuide" target="_blank" rel="noopener">Indeed Career Guide (YouTube)</a> — hướng dẫn CV &amp; phỏng vấn</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Trước kỳ thực tập</strong> — tự đánh giá kỹ năng/mục tiêu, tìm nơi thực tập, chuẩn bị CV &amp; phỏng vấn tốt.</li>
<li><strong>Những tuần đầu</strong> — hoà nhập nhanh: sơ đồ tổ chức, văn hoá, quy định IT/an toàn, gặp người hướng dẫn.</li>
<li><strong>Trong suốt kỳ</strong> — làm việc chuyên nghiệp &amp; có đạo đức nghề, ghi nhật ký hằng ngày, giao tiếp tốt.</li>
<li><strong>Kết thúc kỳ</strong> — viết báo cáo mạch lạc, chuẩn bị bảo vệ, định hướng bước tiếp theo trong nghề nghiệp.</li>
</ol></div>`,
  ]]);

const intro = doc('ojb202-0-1-overview', 'Overview: What is On-the-Job Training?|||Tổng quan: Thực tập doanh nghiệp (OJT) là gì',
  'OJT là gì, mục tiêu, 3 deliverable (nhật ký, báo cáo, đánh giá doanh nghiệp), rubric chấm điểm, mốc thời gian của kỳ thực tập.',
  [[
    `<span class="eyebrow">OJB202 · Lesson 0.1 · Overview</span>
<h2>What is On-the-Job Training?</h2>
<p class="lead"><strong>On-the-Job Training (OJT)</strong> is a supervised internship term: you work at a real business for a fixed period, apply what you learned in class to real tasks, and are assessed by both your <strong>employer</strong> and your <strong>university</strong>. This is not a theory course — the "chapters" below are the actual stages you go through.</p>
<h3>Three deliverables</h3>
<ul>
<li><strong>Internship logbook / diary</strong> — a running record of tasks, hours and learning, usually signed weekly by your supervisor.</li>
<li><strong>Internship report</strong> — a structured write-up of the company, your tasks and your reflection, following FLM's template.</li>
<li><strong>Employer evaluation</strong> — a form your supervisor fills in, scoring attitude, skills and task completion.</li>
</ul>
<h3>How grading usually works</h3>
<pre><code>Employer evaluation  ~30-40%   (attitude, punctuality, task quality)
Internship report    ~30-40%   (structure, content, reflection, writing)
Defense / presentation ~20-30% (Q&amp;A with your supervisor/committee)
</code></pre>
<p>Check your major's exact OJT syllabus on FLM for the real weights and deadlines.</p>
<h3>Timeline of the term</h3>
<p>Preparation &amp; placement search → CV &amp; interview → onboarding (first 1-2 weeks) → doing the work with daily logging (the bulk of the term) → writing the report (final weeks) → evaluation, defense &amp; next steps.</p>
<div class="callout"><span class="badge">Mindset</span> Treat OJT as your first real job, not a school assignment — the habits, network and reference letter you build here follow you into your career.</div>`,
    `<span class="eyebrow">OJB202 · Bài 0.1 · Tổng quan</span>
<h2>Thực tập doanh nghiệp (OJT) là gì?</h2>
<p class="lead"><strong>On-the-Job Training (OJT)</strong> là một kỳ thực tập có giám sát: bạn làm việc tại một doanh nghiệp thật trong một khoảng thời gian cố định, áp dụng những gì đã học vào công việc thật, và được đánh giá bởi cả <strong>doanh nghiệp</strong> lẫn <strong>trường</strong>. Đây không phải môn lý thuyết — các "chương" dưới đây chính là các giai đoạn thật bạn sẽ trải qua.</p>
<h3>Ba sản phẩm cần nộp</h3>
<ul>
<li><strong>Nhật ký / sổ thực tập</strong> — ghi lại liên tục công việc, số giờ và những gì học được, thường được người hướng dẫn ký xác nhận theo tuần.</li>
<li><strong>Báo cáo thực tập</strong> — bài viết có cấu trúc về doanh nghiệp, công việc đã làm và phần phản ánh (reflection), theo mẫu của FLM.</li>
<li><strong>Đánh giá của doanh nghiệp</strong> — phiếu do người hướng dẫn điền, chấm thái độ, kỹ năng và mức hoàn thành công việc.</li>
</ul>
<h3>Cách chấm điểm thường thấy</h3>
<pre><code>Đánh giá của doanh nghiệp ~30-40%   (thái độ, đúng giờ, chất lượng việc)
Báo cáo thực tập          ~30-40%   (cấu trúc, nội dung, phản ánh, hành văn)
Bảo vệ / thuyết trình      ~20-30% (hỏi-đáp với người hướng dẫn/hội đồng)
</code></pre>
<p>Xem đúng syllabus OJT của ngành mình trên FLM để biết trọng số và hạn nộp thật.</p>
<h3>Mốc thời gian trong kỳ</h3>
<p>Chuẩn bị &amp; tìm nơi thực tập → CV &amp; phỏng vấn → hoà nhập (1-2 tuần đầu) → làm việc &amp; ghi nhật ký hằng ngày (phần lớn thời gian kỳ) → viết báo cáo (những tuần cuối) → đánh giá, bảo vệ &amp; bước tiếp theo.</p>
<div class="callout"><span class="badge">Tư duy đúng</span> Hãy coi OJT như công việc thật đầu tiên, không phải bài tập ở trường — thói quen, mối quan hệ và thư giới thiệu bạn xây được ở đây sẽ theo bạn suốt sự nghiệp.</div>`,
  ]]);

const c1 = doc('ojb202-1-1-chuan-bi-tim-noi-thuc-tap', 'Stage 1 — Preparing for OJT & finding a placement|||Giai đoạn 1 — Chuẩn bị thực tập & tìm doanh nghiệp',
  'Tự đánh giá kỹ năng/mục tiêu, kênh tìm nơi thực tập, khớp với ngành/FLM, hồ sơ pháp lý, mốc thời gian trước khi bắt đầu.',
  [[
    `<span class="eyebrow">OJB202 · Stage 1 · Lesson 1.1</span>
<h2>Preparing for OJT &amp; finding a placement</h2>
<h3>Self-assessment first</h3>
<p>Before searching, list: your major's required OJT domain (check FLM), the skills you want to practice, and your constraints (location, schedule, paid/unpaid). A placement that matches your major and goals is easier to get approved and easier to write a good report about.</p>
<h3>Where to look</h3>
<ul>
<li><strong>University channels</strong> — FPTU career center, department referrals, alumni network.</li>
<li><strong>Job boards &amp; LinkedIn</strong> — search "intern" / "internship" in your field; follow target companies.</li>
<li><strong>Personal network</strong> — family, seniors, clubs; a warm referral beats a cold application.</li>
<li><strong>Direct outreach</strong> — email a short, specific message to a company you want, even without a posted opening.</li>
</ul>
<h3>Paperwork &amp; approval</h3>
<p>Once you have an offer, confirm it satisfies your major's OJT requirements, sign the internship agreement (company + university), and register on FLM before your start date — a placement that isn't registered in time can delay your whole term.</p>
<pre><code>Placement checklist:
[ ] Matches major's OJT domain (checked on FLM)
[ ] Offer confirmed in writing (email/letter)
[ ] Internship agreement signed by company + university
[ ] Registered on FLM before start date
[ ] Supervisor/mentor contact confirmed
</code></pre>
<div class="callout"><span class="badge">Start early</span> Good placements fill up fast — start searching at least 4-6 weeks before your OJT term begins.</div>`,
    `<span class="eyebrow">OJB202 · Giai đoạn 1 · Bài 1.1</span>
<h2>Chuẩn bị thực tập &amp; tìm doanh nghiệp</h2>
<h3>Tự đánh giá trước</h3>
<p>Trước khi tìm, hãy liệt kê: lĩnh vực OJT ngành mình yêu cầu (xem trên FLM), kỹ năng muốn rèn, và giới hạn của bản thân (địa điểm, thời gian, có lương/không lương). Nơi thực tập khớp với ngành và mục tiêu sẽ dễ được duyệt hơn và dễ viết báo cáo tốt hơn.</p>
<h3>Tìm ở đâu</h3>
<ul>
<li><strong>Kênh của trường</strong> — trung tâm hướng nghiệp FPTU, giới thiệu từ khoa/bộ môn, mạng lưới cựu sinh viên.</li>
<li><strong>Trang tuyển dụng &amp; LinkedIn</strong> — tìm từ khoá "intern" / "thực tập" đúng lĩnh vực; theo dõi công ty mục tiêu.</li>
<li><strong>Mạng lưới cá nhân</strong> — gia đình, anh chị đi trước, club; giới thiệu quen biết dễ hơn nộp đơn trôi nổi.</li>
<li><strong>Liên hệ trực tiếp</strong> — gửi email ngắn, cụ thể tới công ty muốn vào, dù họ không đăng tuyển.</li>
</ul>
<h3>Hồ sơ &amp; phê duyệt</h3>
<p>Khi có lời mời, xác nhận nó đáp ứng yêu cầu OJT của ngành, ký thoả thuận thực tập (doanh nghiệp + trường), và đăng ký trên FLM trước ngày bắt đầu — nơi thực tập không đăng ký kịp có thể làm trễ cả kỳ.</p>
<pre><code>Checklist chọn nơi thực tập:
[ ] Khớp lĩnh vực OJT của ngành (đã kiểm trên FLM)
[ ] Lời mời xác nhận bằng văn bản (email/thư)
[ ] Thoả thuận thực tập được ký bởi doanh nghiệp + trường
[ ] Đăng ký trên FLM trước ngày bắt đầu
[ ] Xác nhận người hướng dẫn/mentor liên hệ được
</code></pre>
<div class="callout"><span class="badge">Bắt đầu sớm</span> Nơi thực tập tốt hết chỗ nhanh — bắt đầu tìm trước ít nhất 4-6 tuần so với ngày kỳ OJT bắt đầu.</div>`,
  ]]);

const c1q = quiz('ojb202-quiz-1', 'Quiz 1 — Preparing & finding a placement|||Quiz 1 — Chuẩn bị & tìm nơi thực tập', [
  { id: 'q1', question: 'Trước khi tìm nơi thực tập, việc nên làm đầu tiên là gì?', options: ['Nộp đơn ngẫu nhiên càng nhiều càng tốt', 'Tự đánh giá kỹ năng, mục tiêu và lĩnh vực OJT của ngành', 'Chờ trường chỉ định', 'Chỉ tìm nơi có lương cao nhất'], correctIndex: 1, explanation: 'Tự đánh giá giúp chọn nơi khớp ngành/mục tiêu, dễ được duyệt và dễ viết báo cáo.' },
  { id: 'q2', question: 'Vì sao nên bắt đầu tìm nơi thực tập sớm (4-6 tuần trước)?', options: ['Vì quy định bắt phải nộp sớm', 'Vì nơi thực tập tốt hết chỗ nhanh', 'Vì FLM chỉ mở đăng ký một ngày', 'Không cần thiết, tìm lúc nào cũng được'], correctIndex: 1, explanation: 'Các vị trí thực tập tốt cạnh tranh cao và lấp đầy nhanh.' },
  { id: 'q3', question: 'Bước nào KHÔNG thể thiếu trước khi bắt đầu đi thực tập?', options: ['Ký thoả thuận thực tập & đăng ký trên FLM', 'Mua đồng phục công ty', 'Học trước toàn bộ nghiệp vụ công ty', 'Xin nghỉ toàn bộ môn học khác'], correctIndex: 0, explanation: 'Thoả thuận ký giữa doanh nghiệp-trường và đăng ký FLM đúng hạn là điều kiện bắt buộc.' },
]);

const c2 = doc('ojb202-2-1-cv-phong-van', 'Stage 2 — CV, interview & job-seeking skills|||Giai đoạn 2 — CV, phỏng vấn & kỹ năng xin việc',
  'Cấu trúc CV thực tập, thư xin việc, câu hỏi phỏng vấn thường gặp, phương pháp STAR, tác phong & email theo sau.',
  [[
    `<span class="eyebrow">OJB202 · Stage 2 · Lesson 2.1</span>
<h2>CV, interview &amp; job-seeking skills</h2>
<h3>An internship CV</h3>
<p>Keep it one page: contact info, a short objective, education, relevant coursework/projects, skills (tools, languages), and any part-time/volunteer experience — quantify results where you can ("built a 3-page website", "organized an event for 50 people").</p>
<h3>The interview: STAR method</h3>
<p>For behavioural questions ("tell me about a time..."), structure your answer as:</p>
<pre><code>S - Situation:  the context
T - Task:       what you needed to do
A - Action:     what you actually did
R - Result:     the outcome, ideally with a number
</code></pre>
<h3>Common questions to prepare</h3>
<ul>
<li>"Tell me about yourself" — a 60-second summary, not your whole life story.</li>
<li>"Why this company / this role?" — show you researched them.</li>
<li>"What's a weakness?" — pick a real one, show what you're doing about it.</li>
<li>Have 1-2 questions ready to ask them back — it shows genuine interest.</li>
</ul>
<h3>Professional conduct &amp; follow-up</h3>
<p>Dress appropriately, arrive early, and send a short thank-you email within 24 hours restating your interest — small things that make you memorable among many candidates.</p>
<div class="callout"><span class="badge">Practice out loud</span> Rehearsing answers with a friend beats only writing them down — interviews are a speaking skill.</div>`,
    `<span class="eyebrow">OJB202 · Giai đoạn 2 · Bài 2.1</span>
<h2>CV, phỏng vấn &amp; kỹ năng xin việc</h2>
<h3>CV cho vị trí thực tập</h3>
<p>Giữ trong một trang: thông tin liên hệ, mục tiêu ngắn, học vấn, môn học/đồ án liên quan, kỹ năng (công cụ, ngôn ngữ), và kinh nghiệm bán thời gian/tình nguyện nếu có — lượng hoá kết quả khi có thể ("xây website 3 trang", "tổ chức sự kiện cho 50 người").</p>
<h3>Phỏng vấn: phương pháp STAR</h3>
<p>Với câu hỏi hành vi ("kể lần bạn từng..."), trả lời theo cấu trúc:</p>
<pre><code>S - Situation (Bối cảnh):  hoàn cảnh
T - Task (Nhiệm vụ):       việc cần làm
A - Action (Hành động):    bạn đã làm gì
R - Result (Kết quả):      kết quả, tốt nhất có số liệu
</code></pre>
<h3>Câu hỏi thường gặp cần chuẩn bị</h3>
<ul>
<li>"Giới thiệu về bản thân" — tóm tắt 60 giây, không kể hết cả cuộc đời.</li>
<li>"Vì sao chọn công ty/vị trí này?" — cho thấy bạn đã tìm hiểu họ.</li>
<li>"Điểm yếu của bạn?" — chọn điểm yếu thật, kèm bạn đang cải thiện thế nào.</li>
<li>Chuẩn bị sẵn 1-2 câu hỏi ngược lại — thể hiện sự quan tâm thật.</li>
</ul>
<h3>Tác phong &amp; theo sau</h3>
<p>Ăn mặc phù hợp, đến sớm, và gửi email cảm ơn ngắn trong 24 giờ nhắc lại sự quan tâm của mình — những chi tiết nhỏ giúp bạn được nhớ đến giữa nhiều ứng viên.</p>
<div class="callout"><span class="badge">Luyện nói to</span> Tập trả lời cùng bạn bè tốt hơn chỉ viết ra giấy — phỏng vấn là kỹ năng nói.</div>`,
  ]]);

const c2q = quiz('ojb202-quiz-2', 'Quiz 2 — CV & interview|||Quiz 2 — CV & phỏng vấn', [
  { id: 'q1', question: 'Phương pháp STAR dùng để trả lời loại câu hỏi phỏng vấn nào?', options: ['Câu hỏi tính toán số liệu', 'Câu hỏi hành vi ("kể lần bạn từng...")', 'Câu hỏi về lương', 'Câu hỏi trắc nghiệm IQ'], correctIndex: 1, explanation: 'STAR (Situation-Task-Action-Result) cấu trúc câu trả lời cho câu hỏi hành vi.' },
  { id: 'q2', question: 'Chữ "R" trong STAR là gì?', options: ['Reason (Lý do)', 'Result (Kết quả)', 'Rule (Quy tắc)', 'Report (Báo cáo)'], correctIndex: 1, explanation: 'R = Result — kết quả đạt được, tốt nhất có số liệu cụ thể.' },
  { id: 'q3', question: 'Sau buổi phỏng vấn, nên làm gì trong 24 giờ?', options: ['Không cần làm gì thêm', 'Gửi email cảm ơn ngắn, nhắc lại sự quan tâm', 'Gọi điện liên tục hỏi kết quả', 'Đăng lên mạng xã hội chê công ty'], correctIndex: 1, explanation: 'Một email cảm ơn ngắn giúp bạn được nhớ đến và thể hiện tính chuyên nghiệp.' },
]);

const c3 = doc('ojb202-3-1-hoa-nhap-van-hoa', 'Stage 3 — Onboarding & company culture|||Giai đoạn 3 — Hoà nhập môi trường & văn hoá doanh nghiệp',
  'Checklist ngày/tuần đầu, sơ đồ tổ chức, văn hoá & giá trị công ty, quy tắc ứng xử, chính sách IT/an toàn, quan hệ với người hướng dẫn.',
  [[
    `<span class="eyebrow">OJB202 · Stage 3 · Lesson 3.1</span>
<h2>Onboarding &amp; company culture</h2>
<h3>Your first day and week</h3>
<p>Arrive early, bring a notebook, and expect to spend the first days mostly listening and learning systems — that's normal, not a sign you're behind.</p>
<pre><code>First-week checklist:
[ ] Meet supervisor/mentor, confirm your main contact for questions
[ ] Learn the org chart - who does what, who to ask for what
[ ] Read the employee handbook / IT & security policy
[ ] Set up accounts, tools, workstation access
[ ] Clarify your first assignments and how progress is checked
</code></pre>
<h3>Reading the culture</h3>
<p>Every company has unwritten rules: how formal is communication (email vs chat), how strict is punctuality, is initiative welcomed or should you always ask first. Watch before you act — copy how experienced staff behave.</p>
<h3>The supervisor/mentor relationship</h3>
<p>Your supervisor is both your boss and your evaluator. Agree early on a check-in rhythm (daily stand-up, weekly 1:1), and ask clarifying questions rather than guessing — asking a good question early is far cheaper than redoing wrong work.</p>
<div class="callout"><span class="badge">Confidentiality from day one</span> Treat company data, client info and internal documents as confidential by default, even before signing anything explicit — this protects both the company and your own reputation.</div>`,
    `<span class="eyebrow">OJB202 · Giai đoạn 3 · Bài 3.1</span>
<h2>Hoà nhập môi trường &amp; văn hoá doanh nghiệp</h2>
<h3>Ngày và tuần đầu tiên</h3>
<p>Đến sớm, mang theo sổ tay, và đừng ngạc nhiên nếu những ngày đầu chủ yếu là lắng nghe và học hệ thống — đó là bình thường, không phải dấu hiệu bạn chậm hơn người khác.</p>
<pre><code>Checklist tuần đầu:
[ ] Gặp người hướng dẫn/mentor, xác nhận đầu mối liên hệ khi có câu hỏi
[ ] Học sơ đồ tổ chức - ai làm gì, hỏi ai việc gì
[ ] Đọc quy định nhân viên / chính sách IT & an toàn
[ ] Thiết lập tài khoản, công cụ, quyền truy cập máy trạm
[ ] Làm rõ nhiệm vụ đầu tiên và cách tiến độ được kiểm tra
</code></pre>
<h3>Đọc văn hoá công ty</h3>
<p>Mỗi công ty có quy tắc bất thành văn: giao tiếp trang trọng đến đâu (email hay chat), đúng giờ được coi trọng thế nào, chủ động có được khuyến khích hay nên hỏi trước. Quan sát trước khi hành động — học theo cách người có kinh nghiệm hành xử.</p>
<h3>Quan hệ với người hướng dẫn/mentor</h3>
<p>Người hướng dẫn vừa là cấp trên vừa là người đánh giá bạn. Thống nhất sớm nhịp trao đổi (họp đầu ngày, 1:1 hằng tuần), và hỏi làm rõ thay vì đoán — hỏi đúng lúc rẻ hơn nhiều so với làm lại việc sai.</p>
<div class="callout"><span class="badge">Bảo mật từ ngày đầu</span> Coi dữ liệu công ty, thông tin khách hàng và tài liệu nội bộ là bảo mật theo mặc định, ngay cả trước khi ký cam kết rõ ràng — điều này bảo vệ cả công ty và uy tín của bạn.</div>`,
  ]]);

const c3q = quiz('ojb202-quiz-3', 'Quiz 3 — Onboarding & culture|||Quiz 3 — Hoà nhập & văn hoá', [
  { id: 'q1', question: 'Trong tuần đầu thực tập, việc bình thường và không đáng lo là gì?', options: ['Được giao ngay dự án lớn một mình', 'Chủ yếu lắng nghe, học hệ thống và quy trình', 'Không ai giao việc gì cả kỳ', 'Phải tự học hết chuyên môn công ty trong 1 ngày'], correctIndex: 1, explanation: 'Tuần đầu thường dành để làm quen hệ thống, quy trình — đó là bình thường.' },
  { id: 'q2', question: 'Cách tốt nhất để hiểu văn hoá bất thành văn của công ty là?', options: ['Hỏi ChatGPT', 'Quan sát cách người có kinh nghiệm hành xử trước khi tự hành động', 'Áp dụng nguyên văn hoá công ty cũ', 'Bỏ qua, không quan trọng'], correctIndex: 1, explanation: 'Quan sát trước giúp tránh phạm quy tắc bất thành văn.' },
  { id: 'q3', question: 'Với dữ liệu/thông tin công ty trong lúc thực tập, nên?', options: ['Chia sẻ tự do để học hỏi thêm', 'Coi là bảo mật theo mặc định, ngay từ ngày đầu', 'Chỉ giữ bí mật nếu được ký NDA', 'Đăng lên mạng xã hội để làm portfolio'], correctIndex: 1, explanation: 'Bảo mật thông tin là mặc định, không cần đợi cam kết rõ ràng.' },
]);

const c4 = doc('ojb202-4-1-dao-duc-nghe', 'Stage 4 — Professional skills & work ethics|||Giai đoạn 4 — Kỹ năng làm việc chuyên nghiệp & đạo đức nghề',
  'Tính chuyên nghiệp (đúng giờ, giao tiếp, trang phục), bảo mật/NDA, xung đột lợi ích, nhận phản hồi, quản lý thời gian.',
  [[
    `<span class="eyebrow">OJB202 · Stage 4 · Lesson 4.1</span>
<h2>Professional skills &amp; work ethics</h2>
<h3>What "professionalism" means day to day</h3>
<ul>
<li><strong>Reliability</strong> — show up on time, meet deadlines, or flag delays early instead of going silent.</li>
<li><strong>Ownership</strong> — if you make a mistake, report it and propose a fix rather than hiding it.</li>
<li><strong>Communication</strong> — reply to messages within a reasonable time; over-communicate progress rather than go quiet.</li>
</ul>
<h3>Confidentiality &amp; conflict of interest</h3>
<p>Never share client data, source code, financial figures or internal strategy outside the company, even after your internship ends. If a task ever conflicts with your personal interests (e.g. dealing with a family business, a competitor), disclose it to your supervisor immediately rather than deciding alone.</p>
<h3>Receiving feedback</h3>
<p>Feedback on your work is not a personal attack — it's the fastest way to improve. Listen fully, ask a clarifying question if unclear, and thank the person, even for critical feedback.</p>
<h3>Time management</h3>
<pre><code>Simple daily habit:
1. Morning: check what's due today, confirm priorities with supervisor if unsure
2. During: track time spent per task (feeds your logbook later)
3. End of day: note what's done, what's blocked, what's next
</code></pre>
<div class="callout"><span class="badge">Ethics beats speed</span> An intern who is slow but honest and reliable is far more valuable to a company than one who cuts corners.</div>`,
    `<span class="eyebrow">OJB202 · Giai đoạn 4 · Bài 4.1</span>
<h2>Kỹ năng làm việc chuyên nghiệp &amp; đạo đức nghề</h2>
<h3>"Chuyên nghiệp" nghĩa là gì trong công việc hằng ngày</h3>
<ul>
<li><strong>Đáng tin cậy</strong> — đến đúng giờ, hoàn thành đúng hạn, hoặc báo trễ sớm thay vì im lặng biến mất.</li>
<li><strong>Chịu trách nhiệm</strong> — nếu làm sai, báo cáo và đề xuất cách sửa thay vì giấu đi.</li>
<li><strong>Giao tiếp</strong> — trả lời tin nhắn trong thời gian hợp lý; chủ động báo tiến độ thay vì im lặng.</li>
</ul>
<h3>Bảo mật &amp; xung đột lợi ích</h3>
<p>Không bao giờ chia sẻ dữ liệu khách hàng, mã nguồn, số liệu tài chính hay chiến lược nội bộ ra ngoài công ty, ngay cả sau khi kỳ thực tập kết thúc. Nếu một nhiệm vụ xung đột với lợi ích cá nhân (ví dụ liên quan công ty gia đình, đối thủ cạnh tranh), hãy báo ngay cho người hướng dẫn thay vì tự quyết.</p>
<h3>Nhận phản hồi</h3>
<p>Phản hồi về công việc không phải chỉ trích cá nhân — đó là cách nhanh nhất để tiến bộ. Nghe hết, hỏi lại nếu chưa rõ, và cảm ơn người góp ý, ngay cả khi phản hồi là tiêu cực.</p>
<h3>Quản lý thời gian</h3>
<pre><code>Thói quen hằng ngày đơn giản:
1. Sáng: xem việc cần xong hôm nay, xác nhận độ ưu tiên với người hướng dẫn nếu chưa rõ
2. Trong ngày: theo dõi thời gian cho mỗi việc (dùng để ghi nhật ký sau)
3. Cuối ngày: ghi lại việc đã xong, việc bị kẹt, việc tiếp theo
</code></pre>
<div class="callout"><span class="badge">Đạo đức quan trọng hơn tốc độ</span> Một thực tập sinh làm chậm nhưng trung thực và đáng tin cậy có giá trị hơn nhiều so với người làm nhanh nhưng gian dối.</div>`,
  ]]);

const c4q = quiz('ojb202-quiz-4', 'Quiz 4 — Professionalism & ethics|||Quiz 4 — Chuyên nghiệp & đạo đức nghề', [
  { id: 'q1', question: 'Khi lỡ làm sai một việc trong lúc thực tập, nên?', options: ['Giấu đi, hy vọng không ai phát hiện', 'Báo cáo và đề xuất cách sửa', 'Đổ lỗi cho đồng nghiệp khác', 'Nghỉ luôn không đi làm nữa'], correctIndex: 1, explanation: 'Chịu trách nhiệm và báo cáo sớm là biểu hiện của tính chuyên nghiệp.' },
  { id: 'q2', question: 'Khi một nhiệm vụ có khả năng xung đột lợi ích cá nhân, nên?', options: ['Tự quyết định một mình, không nói ai', 'Báo ngay cho người hướng dẫn', 'Từ chối làm hết mọi việc từ đó', 'Chia sẻ tình huống lên mạng xã hội'], correctIndex: 1, explanation: 'Xung đột lợi ích cần được công khai với người hướng dẫn, không tự quyết một mình.' },
  { id: 'q3', question: 'Cách đúng để nhận phản hồi (feedback) tiêu cực về công việc là?', options: ['Coi đó là chỉ trích cá nhân, phản ứng gay gắt', 'Nghe hết, hỏi lại nếu chưa rõ, và cảm ơn', 'Bỏ ngoài tai, tiếp tục làm như cũ', 'Report lên trường ngay lập tức'], correctIndex: 1, explanation: 'Phản hồi là công cụ để tiến bộ, cần được tiếp nhận cởi mở.' },
]);

const c5 = doc('ojb202-5-1-nhat-ky-thuc-tap', 'Stage 5 — Doing the work & internship journal|||Giai đoạn 5 — Thực hiện công việc & ghi nhật ký thực tập',
  'Chu trình nhận-lập kế hoạch-làm-rà soát công việc, cấu trúc nhật ký hằng ngày, tổng kết tuần, ký xác nhận của người hướng dẫn.',
  [[
    `<span class="eyebrow">OJB202 · Stage 5 · Lesson 5.1</span>
<h2>Doing the work &amp; the internship journal</h2>
<h3>The task execution loop</h3>
<pre><code>Receive task -> Clarify scope & deadline -> Plan steps
  -> Do the work -> Self-check / test -> Submit for review
  -> Apply feedback -> Log it
</code></pre>
<p>Skipping "clarify" is the most common intern mistake — a few minutes of questions upfront saves hours of rework.</p>
<h3>Why keep a daily logbook</h3>
<p>The logbook is not busywork — it is your evidence for the final report and for your employer evaluation, and it forces you to notice what you're actually learning, not just what you're doing.</p>
<pre><code>Daily log entry template:
Date:        [dd/mm/yyyy]
Task(s):     [what you worked on]
Time spent:  [hours]
What I did:  [1-3 sentences, concrete]
What I learned: [skill/tool/insight]
Issues/questions: [anything blocked or unclear]
Supervisor sign-off: [ ]
</code></pre>
<h3>Weekly summary</h3>
<p>At the end of each week, roll up your daily entries into 3-5 sentences: main achievements, one challenge, one thing to improve next week. This is what makes writing the final report fast — you're not reconstructing months from memory.</p>
<div class="callout"><span class="badge">Log the same day</span> Write your entry the same day, not at the end of the month — details and numbers fade fast, and a logbook filled in retroactively is easy to spot and hurts your evaluation.</div>`,
    `<span class="eyebrow">OJB202 · Giai đoạn 5 · Bài 5.1</span>
<h2>Thực hiện công việc &amp; ghi nhật ký thực tập</h2>
<h3>Chu trình thực hiện một công việc</h3>
<pre><code>Nhận việc -> Làm rõ phạm vi & hạn -> Lập kế hoạch bước làm
  -> Thực hiện -> Tự kiểm tra -> Nộp để xét duyệt
  -> Áp dụng phản hồi -> Ghi vào nhật ký
</code></pre>
<p>Bỏ qua bước "làm rõ" là lỗi phổ biến nhất của thực tập sinh — vài phút hỏi trước tiết kiệm hàng giờ làm lại sau.</p>
<h3>Vì sao phải ghi nhật ký hằng ngày</h3>
<p>Nhật ký không phải việc làm cho có — đó là bằng chứng cho báo cáo cuối kỳ và cho đánh giá của doanh nghiệp, và nó buộc bạn nhận ra mình thực sự học được gì, không chỉ làm được gì.</p>
<pre><code>Mẫu nhật ký một ngày:
Ngày:              [dd/mm/yyyy]
Công việc:          [đã làm gì]
Thời gian:          [số giờ]
Đã làm:             [1-3 câu, cụ thể]
Học được:           [kỹ năng/công cụ/nhận ra điều gì]
Vướng mắc/câu hỏi:  [chỗ nào bị kẹt hoặc chưa rõ]
Người hướng dẫn ký: [ ]
</code></pre>
<h3>Tổng kết tuần</h3>
<p>Cuối mỗi tuần, gộp các mục hằng ngày thành 3-5 câu: thành tích chính, một khó khăn, một điều cần cải thiện tuần sau. Đây là thứ giúp viết báo cáo cuối kỳ nhanh — bạn không phải nhớ lại cả mấy tháng từ đầu.</p>
<div class="callout"><span class="badge">Ghi ngay trong ngày</span> Viết nhật ký ngay hôm đó, không để cuối tháng mới ghi — chi tiết và số liệu phai nhanh, và nhật ký ghi dồn rất dễ bị nhận ra, ảnh hưởng đến đánh giá của bạn.</div>`,
  ]]);

const c5q = quiz('ojb202-quiz-5', 'Quiz 5 — Doing the work & logbook|||Quiz 5 — Thực hiện việc & nhật ký', [
  { id: 'q1', question: 'Bước nào hay bị thực tập sinh bỏ qua nhất trong chu trình làm việc, gây tốn thời gian nhất?', options: ['Ghi nhật ký', 'Làm rõ phạm vi & hạn công việc trước khi làm', 'Nộp bài để xét duyệt', 'Tự kiểm tra kết quả'], correctIndex: 1, explanation: 'Không làm rõ yêu cầu trước dễ dẫn đến làm sai hướng và phải làm lại.' },
  { id: 'q2', question: 'Nhật ký thực tập nên được ghi khi nào?', options: ['Cuối kỳ, ghi lại một lần', 'Ngay trong ngày làm việc đó', 'Chỉ khi người hướng dẫn nhắc', 'Không cần ghi, nhớ trong đầu là đủ'], correctIndex: 1, explanation: 'Ghi ngay trong ngày giữ chi tiết chính xác; ghi dồn dễ bị phát hiện và thiếu chính xác.' },
  { id: 'q3', question: 'Vì sao nhật ký hằng ngày quan trọng cho việc viết báo cáo cuối kỳ?', options: ['Không liên quan gì đến báo cáo', 'Là bằng chứng và nguyên liệu để tổng hợp báo cáo nhanh hơn', 'Chỉ để cho có, không dùng lại', 'Thay thế hoàn toàn cho báo cáo'], correctIndex: 1, explanation: 'Nhật ký + tổng kết tuần giúp viết báo cáo mà không cần nhớ lại cả kỳ từ đầu.' },
]);

const c6 = doc('ojb202-6-1-giao-tiep-nhom', 'Stage 6 — Communication, teamwork & handling situations|||Giai đoạn 6 — Giao tiếp, làm việc nhóm & xử lý tình huống công sở',
  'Kênh giao tiếp công sở, kỹ năng làm việc nhóm, xử lý tình huống (lỗi sai, chỉ dẫn không rõ, quá tải), hỏi giúp đỡ chuyên nghiệp.',
  [[
    `<span class="eyebrow">OJB202 · Stage 6 · Lesson 6.1</span>
<h2>Communication, teamwork &amp; handling workplace situations</h2>
<h3>Choosing the right channel</h3>
<ul>
<li><strong>Chat/IM</strong> — quick questions, status updates.</li>
<li><strong>Email</strong> — anything that needs a record, external contacts, formal requests.</li>
<li><strong>Meetings/calls</strong> — decisions, complex problems, disagreements — never argue a nuanced issue over chat.</li>
</ul>
<h3>Working in a team</h3>
<p>Show up prepared to meetings, do what you commit to by when you commit to it, and give credit to others' contributions. If you disagree with an approach, ask a question ("what if we tried...") rather than flatly rejecting it.</p>
<h3>Handling common situations</h3>
<pre><code>Instructions are unclear -> Ask a specific clarifying question, don't guess silently
You're overloaded         -> Tell your supervisor early with a proposed priority, not at the deadline
You made a mistake        -> Report it, propose a fix, learn from it
You disagree with feedback -> Ask "help me understand why", don't argue on the spot
</code></pre>
<h3>Asking for help the professional way</h3>
<p>Show what you already tried, be specific about what's blocking you, and suggest a next step if you have one — this gets you help faster and builds trust, versus a vague "I'm stuck."</p>
<div class="callout"><span class="badge">Over-communicate, don't over-explain</span> Short, frequent updates ("done with X, starting Y") beat silence and beat long unread paragraphs.</div>`,
    `<span class="eyebrow">OJB202 · Giai đoạn 6 · Bài 6.1</span>
<h2>Giao tiếp, làm việc nhóm &amp; xử lý tình huống công sở</h2>
<h3>Chọn đúng kênh giao tiếp</h3>
<ul>
<li><strong>Chat/tin nhắn</strong> — câu hỏi nhanh, cập nhật tiến độ.</li>
<li><strong>Email</strong> — việc cần lưu lại bằng chứng, liên hệ bên ngoài, yêu cầu chính thức.</li>
<li><strong>Họp/gọi điện</strong> — quyết định, vấn đề phức tạp, bất đồng — đừng tranh luận việc tinh vi qua chat.</li>
</ul>
<h3>Làm việc nhóm</h3>
<p>Chuẩn bị trước khi họp, làm đúng cam kết và đúng hạn, và ghi nhận đóng góp của người khác. Nếu không đồng ý với một cách làm, hãy hỏi ("nếu thử theo cách này thì sao") thay vì phản đối thẳng.</p>
<h3>Xử lý các tình huống thường gặp</h3>
<pre><code>Chỉ dẫn không rõ  -> Hỏi lại cụ thể, không đoán trong im lặng
Bị quá tải        -> Báo sớm cho người hướng dẫn kèm đề xuất ưu tiên, không để tới hạn mới nói
Làm sai một việc  -> Báo cáo, đề xuất cách sửa, rút kinh nghiệm
Không đồng ý phản hồi -> Hỏi "giúp em hiểu vì sao", không tranh luận ngay tại chỗ
</code></pre>
<h3>Hỏi giúp đỡ một cách chuyên nghiệp</h3>
<p>Cho thấy bạn đã thử gì, nói cụ thể chỗ bị kẹt, và đề xuất bước tiếp theo nếu có — điều này giúp bạn được giúp nhanh hơn và tạo niềm tin, so với câu nói mơ hồ "em bị kẹt rồi."</p>
<div class="callout"><span class="badge">Báo tiến độ đều, đừng giải thích dài</span> Cập nhật ngắn, thường xuyên ("đã xong X, bắt đầu Y") tốt hơn im lặng và tốt hơn đoạn văn dài không ai đọc.</div>`,
  ]]);

const c6q = quiz('ojb202-quiz-6', 'Quiz 6 — Communication & handling situations|||Quiz 6 — Giao tiếp & xử lý tình huống', [
  { id: 'q1', question: 'Khi chỉ dẫn công việc không rõ ràng, nên?', options: ['Đoán và làm theo ý mình, không hỏi ai', 'Hỏi lại cụ thể chỗ chưa rõ', 'Bỏ qua công việc đó', 'Chờ tới hạn nộp mới hỏi'], correctIndex: 1, explanation: 'Hỏi lại cụ thể tránh làm sai hướng, tốt hơn đoán trong im lặng.' },
  { id: 'q2', question: 'Khi cảm thấy bị quá tải công việc, nên báo với người hướng dẫn khi nào?', options: ['Ngay khi nhận ra, kèm đề xuất ưu tiên', 'Chỉ khi đã trễ hạn', 'Không bao giờ báo, tự cố gắng', 'Báo cho đồng nghiệp khác thay vì người hướng dẫn'], correctIndex: 0, explanation: 'Báo sớm và có đề xuất ưu tiên giúp xử lý tình huống hiệu quả hơn.' },
  { id: 'q3', question: 'Kênh nào phù hợp nhất để giải quyết một bất đồng phức tạp trong công việc?', options: ['Chat/tin nhắn nhanh', 'Họp hoặc gọi điện trực tiếp', 'Đăng lên mạng xã hội nội bộ công ty', 'Im lặng chờ tự hết'], correctIndex: 1, explanation: 'Vấn đề phức tạp/bất đồng nên xử lý qua họp hoặc gọi điện, tránh hiểu lầm qua chat.' },
]);

const c7 = doc('ojb202-7-1-viet-bao-cao', 'Stage 7 — Writing the internship report|||Giai đoạn 7 — Viết báo cáo thực tập',
  'Cấu trúc báo cáo (giới thiệu, tổng quan doanh nghiệp, công việc, phản ánh, kết luận), viết reflection, trích dẫn, lỗi thường gặp.',
  [[
    `<span class="eyebrow">OJB202 · Stage 7 · Lesson 7.1</span>
<h2>Writing the internship report</h2>
<h3>Typical structure (check FLM's exact template)</h3>
<pre><code>1. Introduction        - purpose of the report, internship period
2. Company overview    - industry, size, structure, your department
3. Tasks performed     - what you did, tools/methods used, with examples
4. Results & reflection - what you learned, skills gained, gaps vs. coursework
5. Conclusion & recommendations - for yourself and/or the company
6. Appendices           - logbook excerpts, sample outputs, evaluation form
</code></pre>
<p>Always confirm the exact sections, page limit and formatting against your major's official OJT template on FLM — this generic structure is a starting point, not the final answer.</p>
<h3>Writing the reflection section well</h3>
<p>A weak reflection just restates tasks ("I did X, then Y"). A strong one connects tasks to learning: what surprised you, what you'd do differently, how a specific course concept did or didn't match real practice.</p>
<h3>Citations &amp; originality</h3>
<p>Cite any external source you use (company documents, articles, frameworks) properly, and never copy another student's report — plagiarism in an OJT report is treated as seriously as in any academic work.</p>
<h3>Common mistakes</h3>
<ul>
<li>Writing the whole report at the last minute instead of from your weekly logbook summaries.</li>
<li>Describing tasks with no reflection — reads like a to-do list, not a report.</li>
<li>Ignoring the official template/format and losing points on formatting alone.</li>
</ul>
<div class="callout"><span class="badge">Draft early, revise once</span> Write a rough draft from your logbook well before the deadline, then revise once with fresh eyes — never submit your only draft.</div>`,
    `<span class="eyebrow">OJB202 · Giai đoạn 7 · Bài 7.1</span>
<h2>Viết báo cáo thực tập</h2>
<h3>Cấu trúc thường gặp (kiểm mẫu chính thức trên FLM)</h3>
<pre><code>1. Giới thiệu        - mục đích báo cáo, thời gian thực tập
2. Tổng quan doanh nghiệp - ngành, quy mô, cơ cấu, phòng ban của bạn
3. Công việc đã thực hiện - đã làm gì, công cụ/phương pháp, có ví dụ
4. Kết quả & phản ánh (reflection) - học được gì, kỹ năng đạt, khoảng cách với lý thuyết
5. Kết luận & đề xuất - cho bản thân và/hoặc cho doanh nghiệp
6. Phụ lục            - trích nhật ký, sản phẩm mẫu, phiếu đánh giá
</code></pre>
<p>Luôn kiểm đúng các phần, số trang và định dạng theo mẫu OJT chính thức của ngành mình trên FLM — cấu trúc chung này chỉ là điểm khởi đầu, không phải câu trả lời cuối cùng.</p>
<h3>Viết phần phản ánh (reflection) cho tốt</h3>
<p>Phản ánh yếu chỉ kể lại công việc ("em đã làm X, rồi Y"). Phản ánh tốt kết nối công việc với việc học: điều gì bất ngờ, điều gì sẽ làm khác đi, một khái niệm học ở trường có khớp thực tế hay không.</p>
<h3>Trích dẫn &amp; tính nguyên bản</h3>
<p>Trích dẫn đúng cách mọi nguồn ngoài bạn dùng (tài liệu công ty, bài báo, khung lý thuyết), và không bao giờ chép báo cáo của bạn khác — đạo văn trong báo cáo OJT bị xử lý nghiêm như mọi bài học thuật khác.</p>
<h3>Lỗi thường gặp</h3>
<ul>
<li>Viết cả báo cáo vào phút cuối thay vì dựa trên tổng kết tuần đã ghi sẵn.</li>
<li>Chỉ kể lại công việc mà không có phản ánh — đọc như bản to-do list, không phải báo cáo.</li>
<li>Bỏ qua mẫu/định dạng chính thức và mất điểm chỉ vì trình bày sai.</li>
</ul>
<div class="callout"><span class="badge">Viết sớm, sửa một lần</span> Viết bản thô từ nhật ký thật sớm trước hạn, rồi sửa lại một lần với góc nhìn mới — không bao giờ nộp bản duy nhất chưa từng sửa.</div>`,
  ]]);

const c7q = quiz('ojb202-quiz-7', 'Quiz 7 — Writing the report|||Quiz 7 — Viết báo cáo thực tập', [
  { id: 'q1', question: 'Vì sao nên viết báo cáo dựa trên tổng kết tuần đã ghi trong nhật ký, thay vì viết vào phút cuối?', options: ['Vì trường bắt buộc phải làm vậy', 'Vì nhật ký đã có sẵn chi tiết, dễ tổng hợp và chính xác hơn', 'Vì viết phút cuối luôn ngắn hơn', 'Không có sự khác biệt'], correctIndex: 1, explanation: 'Nhật ký/tổng kết tuần cung cấp nguyên liệu chính xác, tránh phải nhớ lại cả kỳ.' },
  { id: 'q2', question: 'Điều gì làm một phần "phản ánh" (reflection) trong báo cáo bị coi là yếu?', options: ['Có kết nối bài học với thực tế công việc', 'Chỉ kể lại công việc đã làm mà không phân tích gì thêm', 'Có nêu điều bất ngờ đã gặp', 'So sánh với kiến thức đã học ở trường'], correctIndex: 1, explanation: 'Phản ánh yếu chỉ là danh sách công việc, không có phân tích/liên hệ.' },
  { id: 'q3', question: 'Khi dùng tài liệu công ty hoặc bài báo trong báo cáo, cần?', options: ['Chép trực tiếp không cần ghi nguồn', 'Trích dẫn nguồn đúng cách', 'Chỉ cần nhớ trong đầu là đủ', 'Xoá hết phần đó cho an toàn'], correctIndex: 1, explanation: 'Trích dẫn đúng cách tránh đạo văn và đảm bảo tính nguyên bản.' },
]);

const c8 = doc('ojb202-8-1-danh-gia-dinh-huong', 'Stage 8 — Evaluation, defense & career direction|||Giai đoạn 8 — Đánh giá, bảo vệ & định hướng nghề nghiệp',
  'Ba thành phần điểm (đánh giá doanh nghiệp, báo cáo, bảo vệ), chuẩn bị hỏi-đáp, cập nhật CV/LinkedIn, hướng đi sau OJT.',
  [[
    `<span class="eyebrow">OJB202 · Stage 8 · Lesson 8.1</span>
<h2>Evaluation, defense &amp; career direction</h2>
<h3>The three grading components, revisited</h3>
<ul>
<li><strong>Employer evaluation form</strong> — your supervisor scores attitude, reliability, task quality; a fair heads-up ("anything I should improve before this is submitted?") shows maturity.</li>
<li><strong>Internship report</strong> — submitted by the FLM deadline, following the official template.</li>
<li><strong>Defense/presentation</strong> — a short talk plus Q&amp;A with your committee/supervisor about what you did and learned.</li>
</ul>
<h3>Preparing for the defense</h3>
<pre><code>Defense prep checklist:
[ ] 5-10 slide summary: company, your role, key tasks, results, learning
[ ] Rehearse out loud, time yourself
[ ] Anticipate 5 likely questions and prepare short answers
[ ] Bring/know your logbook - be ready to give a concrete example
[ ] Know your report well enough to defend any claim in it
</code></pre>
<h3>After OJT: your next step</h3>
<p>Update your CV and LinkedIn with real, specific achievements from the internship (not just "completed OJT"). Ask your supervisor for a reference or recommendation while the relationship is fresh, and reflect on whether this field/role is the direction you want — that clarity is one of OJT's biggest hidden benefits.</p>
<div class="callout"><span class="badge">Keep the relationship</span> Many return offers and referrals come from staying in touch with your supervisor and colleagues after the internship ends — a short thank-you message goes a long way.</div>`,
    `<span class="eyebrow">OJB202 · Giai đoạn 8 · Bài 8.1</span>
<h2>Đánh giá, bảo vệ &amp; định hướng nghề nghiệp</h2>
<h3>Nhìn lại ba thành phần điểm</h3>
<ul>
<li><strong>Phiếu đánh giá của doanh nghiệp</strong> — người hướng dẫn chấm thái độ, độ tin cậy, chất lượng công việc; hỏi trước một cách khéo ("em có gì cần cải thiện trước khi anh/chị nộp phiếu không?") thể hiện sự trưởng thành.</li>
<li><strong>Báo cáo thực tập</strong> — nộp đúng hạn trên FLM, theo mẫu chính thức.</li>
<li><strong>Bảo vệ/thuyết trình</strong> — trình bày ngắn kèm hỏi-đáp với hội đồng/người hướng dẫn về việc đã làm và học được.</li>
</ul>
<h3>Chuẩn bị buổi bảo vệ</h3>
<pre><code>Checklist chuẩn bị bảo vệ:
[ ] Tóm tắt 5-10 slide: công ty, vai trò, công việc chính, kết quả, học được
[ ] Tập nói to, tự bấm giờ
[ ] Dự đoán 5 câu hỏi thường gặp và chuẩn bị câu trả lời ngắn
[ ] Mang/nhớ rõ nhật ký - sẵn sàng đưa ví dụ cụ thể
[ ] Hiểu rõ báo cáo đủ để bảo vệ mọi nội dung đã viết trong đó
</code></pre>
<h3>Sau OJT: bước tiếp theo</h3>
<p>Cập nhật CV và LinkedIn với thành tích thật, cụ thể từ kỳ thực tập (không chỉ "đã hoàn thành OJT"). Xin thư giới thiệu/nhận xét từ người hướng dẫn khi quan hệ còn mới, và tự hỏi liệu lĩnh vực/vai trò này có phải hướng mình muốn đi — sự rõ ràng đó là một trong những lợi ích ẩn lớn nhất của OJT.</p>
<div class="callout"><span class="badge">Giữ mối quan hệ</span> Nhiều lời mời làm việc chính thức và giới thiệu việc đến từ việc giữ liên lạc với người hướng dẫn và đồng nghiệp sau khi kỳ thực tập kết thúc — một lời cảm ơn ngắn có giá trị lâu dài.</div>`,
  ]]);

const c8q = quiz('ojb202-quiz-8', 'Quiz 8 — Evaluation & career direction|||Quiz 8 — Đánh giá & định hướng nghề nghiệp', [
  { id: 'q1', question: 'Ba thành phần thường cấu thành điểm OJT là gì?', options: ['Điểm danh, bài tập, thi cuối kỳ', 'Đánh giá của doanh nghiệp, báo cáo thực tập, bảo vệ/thuyết trình', 'Chỉ có báo cáo thực tập', 'Số giờ đã làm việc'], correctIndex: 1, explanation: 'Theo bài 0.1: đánh giá doanh nghiệp + báo cáo + bảo vệ là ba phần chính.' },
  { id: 'q2', question: 'Trong buổi bảo vệ, việc chuẩn bị nào là quan trọng?', options: ['Không cần chuẩn bị, nói tự nhiên', 'Dự đoán câu hỏi thường gặp và tập nói to có bấm giờ', 'Chỉ cần đọc lại báo cáo một lần', 'Ghi nhớ toàn văn báo cáo không sai một chữ'], correctIndex: 1, explanation: 'Chuẩn bị câu hỏi và luyện tập nói giúp bảo vệ tự tin, đúng thời gian.' },
  { id: 'q3', question: 'Sau khi kết thúc OJT, hành động nào giúp ích cho định hướng nghề nghiệp sau này?', options: ['Cắt liên lạc với công ty ngay khi xong kỳ', 'Cập nhật CV/LinkedIn với thành tích thật và giữ liên lạc với người hướng dẫn', 'Không cần suy nghĩ gì thêm về lĩnh vực này', 'Xoá hết nhật ký và báo cáo sau khi nộp'], correctIndex: 1, explanation: 'Cập nhật hồ sơ và giữ quan hệ nghề nghiệp mở ra cơ hội tương lai (referral, thư giới thiệu).' },
]);

export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    courseCode: 'OJB202',
    slug: 'ojb202-on-the-job-training',
    title: 'On-the-job training',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/OJB202.webp',
    shortDescription: 'On-the-Job Training at a real business: finding a placement, CV & interview, onboarding, work ethics, daily tasks & logbook, workplace communication, writing the report, and evaluation & career direction. Bilingual, with checklists & quizzes.|||Thực tập doanh nghiệp (OJT): tìm nơi thực tập, CV & phỏng vấn, hoà nhập, đạo đức nghề, làm việc & ghi nhật ký, giao tiếp công sở, viết báo cáo, đánh giá & định hướng nghề nghiệp. Song ngữ, có checklist & quiz.',
    description: 'Môn <strong>OJB202 — On-the-Job Training</strong> (kỳ 6 — Thực tập, khối Quản trị Kinh doanh) đi theo <strong>8 giai đoạn thật của một kỳ thực tập</strong> tại doanh nghiệp: <strong>chuẩn bị &amp; tìm nơi thực tập</strong> → <strong>CV, phỏng vấn &amp; kỹ năng xin việc</strong> → <strong>hoà nhập &amp; văn hoá doanh nghiệp</strong> → <strong>kỹ năng chuyên nghiệp &amp; đạo đức nghề</strong> → <strong>thực hiện công việc &amp; ghi nhật ký</strong> → <strong>giao tiếp, làm việc nhóm &amp; xử lý tình huống</strong> → <strong>viết báo cáo thực tập</strong> → <strong>đánh giá, bảo vệ &amp; định hướng nghề nghiệp</strong>. Song ngữ, có checklist/mẫu thực tế và quiz mỗi giai đoạn; bám quy định thực tập của FPTU trên FLM.',
    whatYouLearn: 'Tìm & chọn nơi thực tập khớp ngành; viết CV thực tập & trả lời phỏng vấn (STAR); hoà nhập nhanh vào văn hoá doanh nghiệp; tác phong chuyên nghiệp, bảo mật & đạo đức nghề; thực hiện công việc theo chu trình & ghi nhật ký thực tập hằng ngày; giao tiếp công sở, làm việc nhóm & xử lý tình huống; viết báo cáo thực tập có phản ánh (reflection) đúng mẫu FLM; chuẩn bị bảo vệ & định hướng nghề nghiệp sau OJT.',
    requirements: 'Đã hoặc đang đủ điều kiện đăng ký OJT theo khung chương trình khối Quản trị Kinh doanh trên FLM (xem điều kiện tiên quyết theo ngành). Không cần thiết bị đặc biệt — cần một máy tính để ghi nhật ký/viết báo cáo và, khi đến kỳ, một nơi thực tập đã được xác nhận.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Quy định thực tập FPTU (FLM), kỹ năng nghề nghiệp, CV/phỏng vấn, YouTube.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'OJT là gì, 3 deliverable, rubric, mốc thời gian.', lessons: [intro] },
    { title: 'Giai đoạn 1 — Chuẩn bị & tìm nơi thực tập|||Stage 1 — Preparing & finding a placement', description: 'Tự đánh giá, kênh tìm nơi thực tập, hồ sơ & đăng ký FLM.', lessons: [c1, c1q] },
    { title: 'Giai đoạn 2 — CV, phỏng vấn & kỹ năng xin việc|||Stage 2 — CV, interview & job-seeking', description: 'CV thực tập, STAR, câu hỏi thường gặp, theo sau.', lessons: [c2, c2q] },
    { title: 'Giai đoạn 3 — Hoà nhập & văn hoá doanh nghiệp|||Stage 3 — Onboarding & culture', description: 'Checklist tuần đầu, sơ đồ tổ chức, văn hoá, quan hệ mentor.', lessons: [c3, c3q] },
    { title: 'Giai đoạn 4 — Chuyên nghiệp & đạo đức nghề|||Stage 4 — Professionalism & ethics', description: 'Đáng tin cậy, bảo mật, xung đột lợi ích, nhận phản hồi.', lessons: [c4, c4q] },
    { title: 'Giai đoạn 5 — Thực hiện việc & nhật ký thực tập|||Stage 5 — Doing the work & logbook', description: 'Chu trình làm việc, mẫu nhật ký ngày/tuần.', lessons: [c5, c5q] },
    { title: 'Giai đoạn 6 — Giao tiếp, làm việc nhóm & xử lý tình huống|||Stage 6 — Communication & handling situations', description: 'Chọn kênh giao tiếp, làm việc nhóm, xử lý tình huống công sở.', lessons: [c6, c6q] },
    { title: 'Giai đoạn 7 — Viết báo cáo thực tập|||Stage 7 — Writing the internship report', description: 'Cấu trúc báo cáo, reflection, trích dẫn, lỗi thường gặp.', lessons: [c7, c7q] },
    { title: 'Giai đoạn 8 — Đánh giá, bảo vệ & định hướng nghề nghiệp|||Stage 8 — Evaluation, defense & career direction', description: 'Ba thành phần điểm, chuẩn bị bảo vệ, bước tiếp theo.', lessons: [c8, c8q] },
  ],
};
