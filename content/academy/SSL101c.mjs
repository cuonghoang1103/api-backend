/**
 * SSL101c — Academic Skills for University Success (Kỹ năng học tập ở Đại học).
 * Kỳ 1. Dựa trên Coursera Specialization "Academic Skills for University Success"
 * (University of Sydney, 5 MOOC) + dự án FPT "Avoid Plagiarism" + chương nâng cao.
 * Song ngữ EN/VN realtime (khối .ml-en / .ml-vi, tiêu đề EN|||VI).
 * Sơ đồ dùng .lz-map / .lz-flow / .lz-stack (KHÔNG ascii). Công cụ → Exp Hub;
 * link MOOC gốc Coursera trong nội dung.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/SSL101c.mjs --apply
 */
export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'SSL101c',
    slug: 'academic-skills-for-university-success',
    title: 'Academic Skills for University Success',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The four university survival skills — finding & judging information, solving problems, thinking critically, and communicating clearly — plus academic integrity. The habits that make every other course easier.|||Bốn kỹ năng sống còn ở đại học — tìm & đánh giá thông tin, giải quyết vấn đề, tư duy phản biện, và giao tiếp rõ ràng — cùng liêm chính học thuật. Những thói quen làm mọi môn khác dễ hơn.',
    description: 'Môn kỹ năng học tập nền tảng, dựa trên bộ Coursera "Academic Skills for University Success" (Đại học Sydney). Học cách tìm và đánh giá nguồn tin, giải quyết vấn đề, tư duy phản biện, giao tiếp học thuật và tránh đạo văn — nền cho toàn bộ 4 năm đại học.',
    whatYouLearn: 'Tìm–lọc–quản lý thông tin & đánh giá độ tin cậy nguồn; định nghĩa và giải bài toán mở; tư duy phản biện, nhận diện lập luận & thiên kiến; giao tiếp nói/viết/hình ảnh; trích dẫn đúng cách & tránh đạo văn; hoàn thành một dự án capstone.',
    requirements: 'Không có môn tiên quyết. Cần tài khoản Coursera (đăng ký qua lớp) và một máy tính có Internet để học các MOOC.',
    documentsNote: 'Bộ MOOC Coursera "Academic Skills for University Success" (University of Sydney, 5 khoá) + dự án FPT "How To Avoid Plagiarism with Digital Tools". Kèm file syllabus gốc SSL101c.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, học trên Coursera ra sao, điều kiện qua môn và 5 kỹ năng.',
      lessons: [
        {
          title: '0.1 — About SSL101c & the four skills|||0.1 — Giới thiệu SSL101c & bốn kỹ năng',
          slug: 'ssl101c-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Vì sao có môn kỹ năng học tập, học trên Coursera thế nào, và bản đồ 5 kỹ năng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About SSL101c — Academic Skills for University Success</h2>
<p class="lead">University is not just harder high-school. It expects you to <strong>learn on your own</strong>: find reliable information, solve open-ended problems, question what you read, and communicate your ideas clearly. SSL101c teaches these skills directly — and they quietly determine how well you do in <em>every other subject</em>.</p>
<p>The course is delivered as a <strong>Coursera specialization</strong> from the University of Sydney (five short MOOCs) plus an FPT project on avoiding plagiarism. You study the videos online, then sit a theory exam on campus. This Academy course is your bilingual companion: it summarizes and structures each skill so you learn faster and remember longer.</p>
<h3>Course map — the four core skills + integrity + capstone</h3>
<div class="lz-map">
  <div class="lz-stage">The four skills (4 MOOCs)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Information &amp; Digital Literacy</div><div class="lz-nsub">Find, filter, judge &amp; manage information</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Problem Solving &amp; Creativity</div><div class="lz-nsub">Define real problems, generate ideas</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Critical Thinking</div><div class="lz-nsub">Analyse arguments, spot bias</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Communication</div><div class="lz-nsub">Speak, write &amp; present clearly</div></div></div>
  <div class="lz-stage">Doing it honestly</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Academic Integrity</div><div class="lz-nsub">Cite sources &amp; avoid plagiarism</div></div></div>
  <div class="lz-stage">Putting it together</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Capstone: Research &amp; Communication</div><div class="lz-nsub">Use all skills in one project</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Note-taking · time management · ethical AI use</div><div class="lz-nsub">Habits that supercharge self-study</div></div></div>
</div>
<div class="callout ok">Do not treat SSL101c as an easy "soft" subject to rush through. These are the exact skills that separate students who thrive from those who burn out. A few good habits learned now pay off in every semester ahead.</div>
<a class="link-card exphub" href="/exp-hub/ssl101c-cong-cu-hoc-tap?ref=%2Fcourses%2Facademic-skills-for-university-success%2Flearn&reflabel=SSL101c%20%E2%80%94%20Academic%20Skills%20for%20University%20Success" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Tools for SSL101c — Coursera, Zotero, note-taking</span><span class="lc-sub">How to enroll and the free tools that make studying easier — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu SSL101c — Kỹ năng học tập ở Đại học</h2>
<p class="lead">Đại học không chỉ là trung học khó hơn. Nó đòi hỏi bạn <strong>tự học</strong>: tìm thông tin đáng tin, giải các bài toán mở, đặt câu hỏi với thứ mình đọc, và trình bày ý tưởng rõ ràng. SSL101c dạy thẳng những kỹ năng này — và chúng âm thầm quyết định bạn học tốt đến đâu ở <em>mọi môn khác</em>.</p>
<p>Môn được dạy dưới dạng một <strong>bộ chuyên đề Coursera</strong> của Đại học Sydney (năm MOOC ngắn) cộng một dự án FPT về tránh đạo văn. Bạn học video online, rồi thi lý thuyết tại trường. Khóa Academy này là bạn đồng hành song ngữ: tóm tắt và sắp xếp từng kỹ năng để bạn học nhanh hơn và nhớ lâu hơn.</p>
<h3>Bản đồ môn học — bốn kỹ năng cốt lõi + liêm chính + capstone</h3>
<div class="lz-map">
  <div class="lz-stage">Bốn kỹ năng (4 MOOC)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Thông tin &amp; Kỹ năng số</div><div class="lz-nsub">Tìm, lọc, đánh giá &amp; quản lý thông tin</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Giải quyết vấn đề &amp; Sáng tạo</div><div class="lz-nsub">Định nghĩa vấn đề thật, tạo ý tưởng</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Tư duy phản biện</div><div class="lz-nsub">Phân tích lập luận, nhận diện thiên kiến</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Giao tiếp</div><div class="lz-nsub">Nói, viết &amp; trình bày rõ ràng</div></div></div>
  <div class="lz-stage">Làm một cách trung thực</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Liêm chính học thuật</div><div class="lz-nsub">Trích dẫn nguồn &amp; tránh đạo văn</div></div></div>
  <div class="lz-stage">Ghép lại với nhau</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Capstone: Nghiên cứu &amp; Giao tiếp</div><div class="lz-nsub">Dùng mọi kỹ năng trong một dự án</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Ghi chép · quản lý thời gian · dùng AI có đạo đức</div><div class="lz-nsub">Thói quen tăng tốc việc tự học</div></div></div>
</div>
<div class="callout ok">Đừng coi SSL101c là môn "mềm" dễ để học vội. Đây đúng là những kỹ năng phân biệt sinh viên phát triển với sinh viên kiệt sức. Vài thói quen tốt học ngay bây giờ sẽ sinh lời ở mọi kỳ phía trước.</div>
<a class="link-card exphub" href="/exp-hub/ssl101c-cong-cu-hoc-tap?ref=%2Fcourses%2Facademic-skills-for-university-success%2Flearn&reflabel=SSL101c%20%E2%80%94%20Academic%20Skills%20for%20University%20Success" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Công cụ cho SSL101c — Coursera, Zotero, ghi chép</span><span class="lc-sub">Cách đăng ký và các công cụ miễn phí giúp học dễ hơn — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — How the course is graded|||0.2 — Cách tính điểm & qua môn',
          slug: 'ssl101c-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'MOOC, điểm thưởng, bài thi lý thuyết và điều kiện qua môn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>How SSL101c is graded</h2>
<p class="lead">SSL101c is scored differently from a normal lecture course. There is one exam, but your MOOC progress earns a bonus — so finishing the online courses on time directly protects your grade.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Time</span><span class="v">42h online + 4.5h offline + 1h exam + 102.5h self-study</span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when Final Result ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam gate</span><span class="v">Must complete ALL MOOCs (with certificates) to sit the exam</span></div>
</div>
<h3>How the final result is built</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Study</div><div class="lz-t">complete the 5 MOOCs on time</div><div class="lz-d">earns a Bonus</div></div>
  <div class="lz-step"><div class="lz-k">Exam</div><div class="lz-t">Theoretical Exam (TE)</div><div class="lz-d">60 min, multiple choice, on campus</div></div>
  <div class="lz-step"><div class="lz-k">Result</div><div class="lz-t">FR = min(10, TE + Bonus)</div><div class="lz-d">bonus lifts your score</div></div>
</div>
<div class="callout warn">Two conditions to pass: the exam score <strong>TE ≥ 4</strong> AND the final result <strong>FR ≥ 5</strong>. And there is a hard gate: you can only take the exam if you have <strong>completed every MOOC with its certificate</strong>. Do not leave the MOOCs to the last week — the certificates are your ticket to the exam.</div>
<div class="note-ct">The exam is multiple choice covering all five skill areas (CLO1–5). That means broad, precise understanding matters more than one deep topic — exactly what the chapter quizzes in this course rehearse.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cách tính điểm SSL101c</h2>
<p class="lead">SSL101c tính điểm khác một môn giảng đường thường. Chỉ có một bài thi, nhưng tiến độ MOOC của bạn kiếm điểm thưởng — nên hoàn thành các khoá online đúng hạn trực tiếp bảo vệ điểm của bạn.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Thời lượng</span><span class="v">42h online + 4.5h offline + 1h thi + 102.5h tự học</span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi Kết quả cuối ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện thi</span><span class="v">Phải hoàn thành TẤT CẢ MOOC (có chứng chỉ) mới được thi</span></div>
</div>
<h3>Kết quả cuối được tính thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Học</div><div class="lz-t">hoàn thành 5 MOOC đúng hạn</div><div class="lz-d">kiếm điểm Thưởng (Bonus)</div></div>
  <div class="lz-step"><div class="lz-k">Thi</div><div class="lz-t">Bài thi lý thuyết (TE)</div><div class="lz-d">60 phút, trắc nghiệm, tại trường</div></div>
  <div class="lz-step"><div class="lz-k">Kết quả</div><div class="lz-t">FR = min(10, TE + Bonus)</div><div class="lz-d">điểm thưởng nâng điểm bạn</div></div>
</div>
<div class="callout warn">Hai điều kiện để qua: điểm thi <strong>TE ≥ 4</strong> VÀ kết quả cuối <strong>FR ≥ 5</strong>. Và có một cửa cứng: bạn chỉ được thi nếu đã <strong>hoàn thành mọi MOOC kèm chứng chỉ</strong>. Đừng để MOOC tới tuần cuối — chứng chỉ là vé vào phòng thi của bạn.</div>
<div class="note-ct">Bài thi là trắc nghiệm phủ cả năm kỹ năng (CLO1–5). Nghĩa là hiểu rộng và chính xác quan trọng hơn một chủ đề sâu — đúng thứ mà các quiz chương trong khóa này rèn.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning outcomes (5 CLOs)|||0.3 — Chuẩn đầu ra (5 CLO)',
          slug: 'ssl101c-chuan-dau-ra',
          type: 'VIDEO',
          description: '5 kỹ năng nhà trường cam kết bạn phát triển được.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The 5 Course Learning Outcomes (CLOs)</h2>
<p class="lead">Each CLO is a skill you will develop and demonstrate. They map cleanly onto the course chapters, so they are also your revision checklist.</p>
<table>
  <thead><tr><th>#</th><th>You will be able to…</th><th>Covered in</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Develop Information &amp; Digital Literacy skills</td><td>Chapter 1</td></tr>
    <tr><td>CLO2</td><td>Develop Problem Solving &amp; Creativity skills</td><td>Chapter 2</td></tr>
    <tr><td>CLO3</td><td>Develop Critical Thinking skills</td><td>Chapter 3</td></tr>
    <tr><td>CLO4</td><td>Develop Communication skills</td><td>Chapter 4</td></tr>
    <tr><td>CLO5</td><td>Apply all the skills to build a Capstone Project</td><td>Chapters 5–6</td></tr>
  </tbody>
</table>
<div class="note-ct">Notice these are <em>skills</em>, not facts to memorize. The exam tests your understanding of the methods; the real payoff is using them in your other courses from week one.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>5 Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">Mỗi CLO là một kỹ năng bạn sẽ phát triển và thể hiện. Chúng khớp gọn với các chương, nên cũng là checklist ôn tập của bạn.</p>
<table>
  <thead><tr><th>#</th><th>Bạn sẽ làm được…</th><th>Học ở</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Phát triển kỹ năng Thông tin &amp; Kỹ năng số</td><td>Chương 1</td></tr>
    <tr><td>CLO2</td><td>Phát triển kỹ năng Giải quyết vấn đề &amp; Sáng tạo</td><td>Chương 2</td></tr>
    <tr><td>CLO3</td><td>Phát triển kỹ năng Tư duy phản biện</td><td>Chương 3</td></tr>
    <tr><td>CLO4</td><td>Phát triển kỹ năng Giao tiếp</td><td>Chương 4</td></tr>
    <tr><td>CLO5</td><td>Áp dụng mọi kỹ năng để xây một Dự án Capstone</td><td>Chương 5–6</td></tr>
  </tbody>
</table>
<div class="note-ct">Để ý đây là <em>kỹ năng</em>, không phải sự kiện để học thuộc. Bài thi kiểm bạn hiểu các phương pháp; phần thưởng thật là dùng chúng trong các môn khác ngay từ tuần đầu.</div>
</div>
`,
        },
        {
          title: '0.4 — How to enroll & study on Coursera|||0.4 — Cách đăng ký & học trên Coursera',
          slug: 'ssl101c-tai-lieu',
          type: 'VIDEO',
          description: 'Đăng ký Coursera qua lớp, học video hiệu quả và các công cụ hỗ trợ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Getting set up &amp; studying well</h2>
<h3>The Coursera specialization</h3>
<p>The course content lives in the <strong>Academic Skills for University Success</strong> specialization (University of Sydney) on Coursera. You are invited/enrolled by the class admin — join promptly, and enroll in each of the five MOOCs.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">MOOC 1 — Information &amp; Digital Literacy</div><div class="lz-ld">Finding, evaluating and managing information.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 2 — Problem-Solving Skills</div><div class="lz-ld">Defining and tackling ill-defined problems.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 3 — Critical Thinking Skills</div><div class="lz-ld">Analysing arguments and bias.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 4 — Communication Skills</div><div class="lz-ld">Academic speaking, writing and participation.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 5 — Capstone</div><div class="lz-ld">Applying all four skills in a project.</div></div>
</div>
<h3>How to actually study the MOOCs</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Weekly</div><div class="lz-t">≥ 5 hrs</div><div class="lz-d">watch, read, quiz — steadily</div></div>
  <div class="lz-step"><div class="lz-k">Active</div><div class="lz-t">take notes</div><div class="lz-d">don&#39;t just watch passively</div></div>
  <div class="lz-step"><div class="lz-k">Engage</div><div class="lz-t">forums &amp; peer reviews</div><div class="lz-d">part of the grade</div></div>
  <div class="lz-step"><div class="lz-k">Finish</div><div class="lz-t">get every certificate</div><div class="lz-d">your exam ticket + bonus</div></div>
</div>
<div class="callout ok">Passive video-watching is the classic trap. Aim to be able to <em>explain each idea in your own words</em> after each module — that is when a skill becomes yours. The advanced lessons in this course cover note-taking and time-management systems to help.</div>
<a class="link-card exphub" href="/exp-hub/ssl101c-cong-cu-hoc-tap?ref=%2Fcourses%2Facademic-skills-for-university-success%2Flearn&reflabel=SSL101c%20%E2%80%94%20Academic%20Skills%20for%20University%20Success" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Coursera, Zotero &amp; note-taking tools</span><span class="lc-sub">Set-up links and free study tools for SSL101c.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cài đặt &amp; học sao cho tốt</h2>
<h3>Bộ chuyên đề Coursera</h3>
<p>Nội dung môn nằm trong bộ chuyên đề <strong>Academic Skills for University Success</strong> (Đại học Sydney) trên Coursera. Bạn được admin lớp mời/ghi danh — hãy tham gia sớm, và đăng ký từng khoá trong năm MOOC.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">MOOC 1 — Thông tin &amp; Kỹ năng số</div><div class="lz-ld">Tìm, đánh giá và quản lý thông tin.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 2 — Kỹ năng Giải quyết vấn đề</div><div class="lz-ld">Định nghĩa và xử lý các vấn đề mở.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 3 — Kỹ năng Tư duy phản biện</div><div class="lz-ld">Phân tích lập luận và thiên kiến.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 4 — Kỹ năng Giao tiếp</div><div class="lz-ld">Nói, viết và tham gia học thuật.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 5 — Capstone</div><div class="lz-ld">Áp dụng cả bốn kỹ năng trong một dự án.</div></div>
</div>
<h3>Học MOOC thế nào cho hiệu quả</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Hàng tuần</div><div class="lz-t">≥ 5 giờ</div><div class="lz-d">xem, đọc, làm quiz — đều đặn</div></div>
  <div class="lz-step"><div class="lz-k">Chủ động</div><div class="lz-t">ghi chép</div><div class="lz-d">đừng chỉ xem thụ động</div></div>
  <div class="lz-step"><div class="lz-k">Tham gia</div><div class="lz-t">forum &amp; chấm chéo</div><div class="lz-d">một phần của điểm</div></div>
  <div class="lz-step"><div class="lz-k">Hoàn tất</div><div class="lz-t">lấy mọi chứng chỉ</div><div class="lz-d">vé thi + điểm thưởng</div></div>
</div>
<div class="callout ok">Xem video thụ động là cái bẫy kinh điển. Hãy nhắm tới việc <em>giải thích được mỗi ý bằng lời của mình</em> sau mỗi module — đó là lúc một kỹ năng thành của bạn. Các bài nâng cao trong khóa này bàn về hệ thống ghi chép và quản lý thời gian để hỗ trợ.</div>
<a class="link-card exphub" href="/exp-hub/ssl101c-cong-cu-hoc-tap?ref=%2Fcourses%2Facademic-skills-for-university-success%2Flearn&reflabel=SSL101c%20%E2%80%94%20Academic%20Skills%20for%20University%20Success" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Coursera, Zotero &amp; công cụ ghi chép</span><span class="lc-sub">Link cài đặt và công cụ học miễn phí cho SSL101c.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — THÔNG TIN & KỸ NĂNG SỐ ══════════════════ */
    {
      title: 'Chapter 1 — Information & Digital Literacy|||Chương 1 — Thông tin & Kỹ năng số',
      description: 'Tìm, đánh giá độ tin cậy, quản lý và trích dẫn thông tin.',
      lessons: [
        {
          title: '1.1 — Finding & evaluating information|||1.1 — Tìm & đánh giá thông tin',
          slug: 'ssl101c-1-1-tim-danh-gia',
          type: 'VIDEO',
          description: 'Chiến lược tìm kiếm và cách đánh giá nguồn có đáng tin không.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Finding good information — and judging it</h2>
<p class="lead">At university, the problem is rarely too little information — it is too much, of mixed quality (CLO1). The skill is <strong>searching smartly</strong> and then <strong>evaluating</strong> whether a source can be trusted.</p>
<h3>Search smarter, not harder</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Define</div><div class="lz-t">key concepts</div><div class="lz-d">pull the main terms from your question</div></div>
  <div class="lz-step"><div class="lz-k">Search</div><div class="lz-t">use the right tools</div><div class="lz-d">library databases, Google Scholar — not just Google</div></div>
  <div class="lz-step"><div class="lz-k">Refine</div><div class="lz-t">filter &amp; narrow</div><div class="lz-d">by date, type, keywords</div></div>
</div>
<h3>Evaluating a source — the CRAAP test</h3>
<p>Before trusting any source, run it through five quick questions:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Currency</div><div class="lz-ld">How recent is it? Is up-to-date info important here?</div></div>
  <div class="lz-layer"><div class="lz-lt">Relevance</div><div class="lz-ld">Does it actually address your question, at the right level?</div></div>
  <div class="lz-layer"><div class="lz-lt">Authority</div><div class="lz-ld">Who wrote it? What are their credentials? Who published it?</div></div>
  <div class="lz-layer"><div class="lz-lt">Accuracy</div><div class="lz-ld">Is it supported by evidence and references? Can you verify it elsewhere?</div></div>
  <div class="lz-layer"><div class="lz-lt">Purpose</div><div class="lz-ld">Why was it made — to inform, sell, or persuade? Is there bias?</div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Lateral reading beats CRAAP.</b> Stanford researchers found professional fact-checkers barely read a suspicious page before leaving it — they open new tabs to ask "who is behind this?" That is <em>lateral</em> reading (the SIFT method: Stop, Investigate the source, Find better coverage, Trace claims to the original), and it catches slick fakes that pass a checklist-style CRAAP read. <em>CRAAP judges a page from the inside; the research shows judging it from the outside web is faster and more reliable.</em></div>
<div class="callout ok">A peer-reviewed journal article and a random blog post can say the same thing — but one has been checked by experts and the other has not. Digital literacy is knowing the difference and choosing accordingly, especially now that AI can generate confident-sounding but wrong text.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/digital-literacy" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 1 — Information &amp; Digital Literacy</span><span class="lc-sub">The official University of Sydney course on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Tìm thông tin tốt — và đánh giá nó</h2>
<p class="lead">Ở đại học, vấn đề hiếm khi là quá ít thông tin — mà là quá nhiều, chất lượng lẫn lộn (CLO1). Kỹ năng là <strong>tìm kiếm thông minh</strong> rồi <strong>đánh giá</strong> xem một nguồn có đáng tin không.</p>
<h3>Tìm khôn hơn, không phải cực hơn</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Xác định</div><div class="lz-t">khái niệm chính</div><div class="lz-d">rút các từ khoá chính từ câu hỏi</div></div>
  <div class="lz-step"><div class="lz-k">Tìm</div><div class="lz-t">dùng đúng công cụ</div><div class="lz-d">CSDL thư viện, Google Scholar — không chỉ Google</div></div>
  <div class="lz-step"><div class="lz-k">Tinh chỉnh</div><div class="lz-t">lọc &amp; thu hẹp</div><div class="lz-d">theo ngày, loại, từ khoá</div></div>
</div>
<h3>Đánh giá một nguồn — bài kiểm CRAAP</h3>
<p>Trước khi tin bất kỳ nguồn nào, chạy nó qua năm câu hỏi nhanh:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Currency (Tính thời sự)</div><div class="lz-ld">Nó mới đến đâu? Ở đây thông tin cập nhật có quan trọng không?</div></div>
  <div class="lz-layer"><div class="lz-lt">Relevance (Liên quan)</div><div class="lz-ld">Nó có thực sự trả lời câu hỏi của bạn, ở đúng mức độ không?</div></div>
  <div class="lz-layer"><div class="lz-lt">Authority (Thẩm quyền)</div><div class="lz-ld">Ai viết? Trình độ họ ra sao? Ai xuất bản?</div></div>
  <div class="lz-layer"><div class="lz-lt">Accuracy (Chính xác)</div><div class="lz-ld">Có bằng chứng và trích dẫn hỗ trợ không? Kiểm chứng được ở nơi khác không?</div></div>
  <div class="lz-layer"><div class="lz-lt">Purpose (Mục đích)</div><div class="lz-ld">Vì sao nó được tạo — để thông tin, bán hàng, hay thuyết phục? Có thiên kiến không?</div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đọc ngang (lateral reading) thắng CRAAP.</b> Nghiên cứu ở Stanford thấy các nhà kiểm chứng chuyên nghiệp gần như không đọc trang đáng ngờ trước khi rời đi — họ mở tab mới để hỏi "ai đứng sau nguồn này?" Đó là đọc <em>ngang</em> (phương pháp SIFT: Dừng, Điều tra nguồn, Tìm nguồn tốt hơn, Truy vết khẳng định về gốc), bắt được các trang giả bóng bẩy vượt qua kiểu đọc CRAAP theo checklist. <em>CRAAP đánh giá trang từ bên trong; nghiên cứu cho thấy đánh giá từ bên ngoài web thì nhanh và đáng tin hơn.</em></div>
<div class="callout ok">Một bài báo khoa học bình duyệt và một bài blog bất kỳ có thể nói cùng một điều — nhưng một cái đã được chuyên gia kiểm, cái kia thì chưa. Kỹ năng số là biết khác biệt đó và chọn cho đúng, nhất là bây giờ khi AI có thể sinh văn bản nghe rất tự tin nhưng sai.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/digital-literacy" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 1 — Thông tin &amp; Kỹ năng số</span><span class="lc-sub">Khoá chính chủ của Đại học Sydney trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — Managing & referencing information|||1.2 — Quản lý & trích dẫn thông tin',
          slug: 'ssl101c-1-2-quan-ly-trich-dan',
          type: 'VIDEO',
          description: 'Tổ chức nguồn tin và trích dẫn đúng để không đạo văn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Keeping track of your sources</h2>
<p class="lead">Once you find good information, you must <strong>organize</strong> it and <strong>credit</strong> it. Poor source management is how honest students accidentally plagiarize — they lose track of what came from where.</p>
<h3>Referencing — giving credit</h3>
<p>A <strong>reference</strong> (citation) records where an idea came from. It serves two purposes: it gives credit to the original author (integrity), and it lets your reader verify your claims (credibility). Common styles include APA, MLA, and IEEE — your course will specify which.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">In-text</div><div class="lz-t">a short marker</div><div class="lz-d">(Author, Year) where you use the idea</div></div>
  <div class="lz-step"><div class="lz-k">Reference list</div><div class="lz-t">full details</div><div class="lz-d">at the end, so it can be found</div></div>
</div>
<h3>Use a reference manager</h3>
<p>Tools like <strong>Zotero</strong> or <strong>Mendeley</strong> save every source as you find it and generate perfectly formatted citations automatically. This turns hours of tedious formatting into one click and prevents lost sources.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Snowball your way to better sources.</b> Instead of hoping one search returns everything, use citation chaining: read a good paper's reference list to go <em>backward</em> to its foundations, and use Google Scholar's "Cited by" to go <em>forward</em> to newer work that built on it. Zotero makes each hop one click, and it surfaces the key papers a keyword search misses. <em>The CRAAP lesson evaluates sources one at a time; snowballing is a research-librarian technique for mapping a whole field fast.</em></div>
<div class="note-ct">Golden rule: record the source the moment you take a note from it. A note without its source is a future plagiarism risk. Chapter 5 goes deeper into avoiding plagiarism — referencing is your first line of defense.</div>
<a class="link-card exphub" href="/exp-hub/ssl101c-cong-cu-hoc-tap?ref=%2Fcourses%2Facademic-skills-for-university-success%2Flearn&reflabel=SSL101c%20%E2%80%94%20Academic%20Skills%20for%20University%20Success" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Set up Zotero — the free reference manager</span><span class="lc-sub">Install &amp; quick-start on the SSL101c tools guide.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Theo dõi nguồn của bạn</h2>
<p class="lead">Khi đã tìm được thông tin tốt, bạn phải <strong>tổ chức</strong> nó và <strong>ghi công</strong>. Quản lý nguồn kém là cách sinh viên trung thực vô tình đạo văn — họ mất dấu cái gì đến từ đâu.</p>
<h3>Trích dẫn — ghi công</h3>
<p>Một <strong>trích dẫn (reference/citation)</strong> ghi lại nơi một ý tưởng đến từ đâu. Nó phục vụ hai mục đích: ghi công tác giả gốc (liêm chính), và cho người đọc kiểm chứng khẳng định của bạn (uy tín). Các kiểu phổ biến gồm APA, MLA, và IEEE — môn của bạn sẽ chỉ định dùng kiểu nào.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Trong bài</div><div class="lz-t">một dấu ngắn</div><div class="lz-d">(Tác giả, Năm) tại chỗ dùng ý</div></div>
  <div class="lz-step"><div class="lz-k">Danh mục</div><div class="lz-t">chi tiết đầy đủ</div><div class="lz-d">ở cuối, để tìm lại được</div></div>
</div>
<h3>Dùng trình quản lý trích dẫn</h3>
<p>Công cụ như <strong>Zotero</strong> hoặc <strong>Mendeley</strong> lưu mọi nguồn khi bạn tìm thấy và tự tạo trích dẫn định dạng chuẩn. Điều này biến hàng giờ định dạng tẻ nhạt thành một cú nhấp và ngăn mất nguồn.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Lăn cầu tuyết tới nguồn tốt hơn.</b> Thay vì hy vọng một lần tìm ra hết, hãy dùng citation chaining: đọc danh mục tài liệu của một bài tốt để đi <em>ngược</em> về nền tảng của nó, và dùng nút "Cited by" của Google Scholar để đi <em>xuôi</em> tới các bài mới hơn kế thừa nó. Zotero biến mỗi bước nhảy thành một cú nhấp, phát lộ những bài then chốt mà tìm từ khoá bỏ sót. <em>Bài học CRAAP đánh giá từng nguồn một; snowballing là kỹ thuật của thủ thư nghiên cứu để lập bản đồ cả một lĩnh vực nhanh chóng.</em></div>
<div class="note-ct">Quy tắc vàng: ghi lại nguồn ngay khi bạn ghi chép từ nó. Một ghi chú không có nguồn là rủi ro đạo văn tương lai. Chương 5 đi sâu hơn về tránh đạo văn — trích dẫn là tuyến phòng thủ đầu tiên của bạn.</div>
<a class="link-card exphub" href="/exp-hub/ssl101c-cong-cu-hoc-tap?ref=%2Fcourses%2Facademic-skills-for-university-success%2Flearn&reflabel=SSL101c%20%E2%80%94%20Academic%20Skills%20for%20University%20Success" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Cài Zotero — trình quản lý trích dẫn miễn phí</span><span class="lc-sub">Cài đặt &amp; hướng dẫn nhanh ở guide công cụ SSL101c.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 1 Quiz|||Quiz chương 1',
          slug: 'ssl101c-quiz-ch1',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: tìm kiếm, CRAAP, trích dẫn, quản lý nguồn.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The CRAAP test is used to…|||Bài kiểm CRAAP được dùng để…', options: ['write faster|||viết nhanh hơn', 'evaluate whether a source is trustworthy|||đánh giá một nguồn có đáng tin không', 'format a document|||định dạng tài liệu', 'search Google|||tìm trên Google'], correctIndex: 1, points: 1 },
              { question: 'The "A" for Authority in CRAAP asks…|||Chữ "A" Authority trong CRAAP hỏi…', options: ['how recent it is|||nó mới đến đâu', 'who wrote it and their credentials|||ai viết và trình độ của họ', 'how long it is|||nó dài bao nhiêu', 'what it costs|||nó giá bao nhiêu'], correctIndex: 1, points: 1 },
              { question: 'A reference (citation) mainly serves to…|||Một trích dẫn chủ yếu phục vụ để…', options: ['make the paper longer|||làm bài dài hơn', 'give credit and let readers verify claims|||ghi công và cho người đọc kiểm chứng', 'hide your sources|||giấu nguồn của bạn', 'replace the conclusion|||thay phần kết luận'], correctIndex: 1, points: 1 },
              { question: 'A tool like Zotero helps you…|||Một công cụ như Zotero giúp bạn…', options: ['write the essay for you|||viết bài luận hộ bạn', 'save sources and generate formatted citations|||lưu nguồn và tạo trích dẫn định dạng chuẩn', 'grade your work|||chấm bài bạn', 'search social media|||tìm mạng xã hội'], correctIndex: 1, points: 1 },
              { question: 'The golden rule to avoid accidental plagiarism is…|||Quy tắc vàng để tránh đạo văn vô tình là…', options: ['never take notes|||không bao giờ ghi chép', 'record the source the moment you take a note|||ghi lại nguồn ngay khi ghi chép', 'copy everything exactly|||chép mọi thứ y hệt', 'avoid all references|||tránh mọi trích dẫn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — GIẢI QUYẾT VẤN ĐỀ & SÁNG TẠO ══════════════════ */
    {
      title: 'Chapter 2 — Problem Solving & Creativity|||Chương 2 — Giải quyết vấn đề & Sáng tạo',
      description: 'Định nghĩa vấn đề mở và tạo ra giải pháp bằng tư duy sáng tạo.',
      lessons: [
        {
          title: '2.1 — Defining the real problem|||2.1 — Định nghĩa đúng vấn đề',
          slug: 'ssl101c-2-1-dinh-nghia-van-de',
          type: 'VIDEO',
          description: 'Biến một vấn đề mơ hồ thành một vấn đề rõ ràng có thể giải.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Most problems are "ill-defined"</h2>
<p class="lead">Textbook problems come neatly stated. Real problems (CLO2) arrive vague: "our group project is a mess". Before you can solve it, you must turn that <strong>ill-defined</strong> problem into a <strong>well-defined</strong> one with clear goals.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Vague</div><div class="lz-t">"the project is a mess"</div><div class="lz-d">no clear target</div></div>
  <div class="lz-step"><div class="lz-k">Clarify</div><div class="lz-t">ask what &amp; why</div><div class="lz-d">what exactly is wrong?</div></div>
  <div class="lz-step"><div class="lz-k">Defined</div><div class="lz-t">"tasks aren&#39;t assigned, so nothing gets done by Friday"</div><div class="lz-d">now solvable</div></div>
</div>
<h3>Separate the symptom from the root cause</h3>
<p>A missed deadline is a <em>symptom</em>; the root cause might be unclear responsibilities or poor communication. Solving the symptom (working overnight) fixes today; solving the root cause (a task board) fixes every future week. Ask <strong>"why?"</strong> a few times to dig down.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Identify the goal</div><div class="lz-ld">What does a solved state actually look like? Make it concrete.</div></div>
  <div class="lz-layer"><div class="lz-lt">Find the constraints</div><div class="lz-ld">Time, budget, skills, rules — what limits the solution?</div></div>
  <div class="lz-layer"><div class="lz-lt">State it clearly</div><div class="lz-ld">A well-framed problem is half solved.</div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Run a pre-mortem before you commit.</b> Psychologist Gary Klein's pre-mortem flips risk analysis: imagine it is months later and your project has failed spectacularly, then write down every reason why. This "prospective hindsight" makes people markedly better at naming real risks than asking "what could go wrong?", because a concrete failure is easier to explain than an abstract one. <em>The lesson teaches defining the problem; the pre-mortem stress-tests your definition before you sink time into the wrong solution.</em></div>
<div class="callout ok">Students often rush to solutions before understanding the problem — and solve the wrong thing. Spending a few minutes to define the real problem and its goal is the highest-leverage move in problem solving.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/problem-solving-skills" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 2 — Problem-Solving Skills</span><span class="lc-sub">The official University of Sydney course on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Hầu hết vấn đề đều "mơ hồ"</h2>
<p class="lead">Bài toán trong sách được phát biểu gọn gàng. Vấn đề thật (CLO2) đến một cách mơ hồ: "dự án nhóm của tụi mình đang loạn". Trước khi giải, bạn phải biến vấn đề <strong>mơ hồ</strong> đó thành vấn đề <strong>rõ ràng</strong> với mục tiêu cụ thể.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Mơ hồ</div><div class="lz-t">"dự án đang loạn"</div><div class="lz-d">không có đích rõ</div></div>
  <div class="lz-step"><div class="lz-k">Làm rõ</div><div class="lz-t">hỏi cái gì &amp; vì sao</div><div class="lz-d">chính xác cái gì sai?</div></div>
  <div class="lz-step"><div class="lz-k">Rõ ràng</div><div class="lz-t">"chưa chia việc, nên tới thứ Sáu không xong gì"</div><div class="lz-d">giờ giải được</div></div>
</div>
<h3>Tách triệu chứng khỏi nguyên nhân gốc</h3>
<p>Trễ hạn là một <em>triệu chứng</em>; nguyên nhân gốc có thể là trách nhiệm không rõ hoặc giao tiếp kém. Giải triệu chứng (thức đêm làm) chữa hôm nay; giải nguyên nhân gốc (một bảng công việc) chữa mọi tuần sau. Hỏi <strong>"vì sao?"</strong> vài lần để đào xuống.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Xác định mục tiêu</div><div class="lz-ld">Trạng thái "đã giải" thực sự trông thế nào? Làm nó cụ thể.</div></div>
  <div class="lz-layer"><div class="lz-lt">Tìm ràng buộc</div><div class="lz-ld">Thời gian, ngân sách, kỹ năng, luật lệ — cái gì giới hạn giải pháp?</div></div>
  <div class="lz-layer"><div class="lz-lt">Phát biểu rõ ràng</div><div class="lz-ld">Một vấn đề được đặt khung tốt đã giải được một nửa.</div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chạy pre-mortem trước khi lao vào.</b> Pre-mortem của nhà tâm lý Gary Klein lật ngược phân tích rủi ro: hãy tưởng tượng vài tháng sau, dự án của bạn đã thất bại thảm hại, rồi viết ra mọi lý do vì sao. "Hồi tưởng trước" (prospective hindsight) này giúp người ta nêu rủi ro thật tốt hơn hẳn so với hỏi "có gì có thể sai?", vì một thất bại cụ thể dễ giải thích hơn một cái trừu tượng. <em>Bài học dạy định nghĩa vấn đề; pre-mortem kiểm áp lực định nghĩa đó trước khi bạn đổ thời gian vào giải pháp sai.</em></div>
<div class="callout ok">Sinh viên thường lao vào giải pháp trước khi hiểu vấn đề — và giải nhầm thứ. Bỏ vài phút định nghĩa đúng vấn đề và mục tiêu của nó là nước đi đòn bẩy cao nhất trong giải quyết vấn đề.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/problem-solving-skills" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 2 — Kỹ năng Giải quyết vấn đề</span><span class="lc-sub">Khoá chính chủ của Đại học Sydney trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Generating creative solutions|||2.2 — Tạo giải pháp sáng tạo',
          slug: 'ssl101c-2-2-sang-tao',
          type: 'VIDEO',
          description: 'Tư duy phân kỳ và hội tụ, brainstorm và các công cụ ý tưởng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>From one problem to many ideas</h2>
<p class="lead">Creativity is not a magic gift — it is a <strong>process</strong> you can practice. The core rhythm alternates between opening up (many ideas) and narrowing down (the best one).</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Diverge</div><div class="lz-t">generate many ideas</div><div class="lz-d">quantity first, no judging yet</div></div>
  <div class="lz-step"><div class="lz-k">Converge</div><div class="lz-t">evaluate &amp; choose</div><div class="lz-d">now apply criteria</div></div>
</div>
<p>The classic mistake is judging ideas as you generate them — that kills the flow. Separate the two phases: brainstorm freely first, criticize later.</p>
<h3>Thinking tools that spark ideas</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Brainstorming</div><div class="lz-ld">List as many ideas as possible without judgement. Wild ideas often lead to good ones.</div></div>
  <div class="lz-layer"><div class="lz-lt">Mind mapping</div><div class="lz-ld">Branch out from the central problem visually to see connections.</div></div>
  <div class="lz-layer"><div class="lz-lt">Ask "what if?" / reverse it</div><div class="lz-ld">Challenge assumptions: what if the constraint didn&#39;t exist? What if we did the opposite?</div></div>
  <div class="lz-layer"><div class="lz-lt">SCAMPER</div><div class="lz-ld">Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse — prompts to transform an idea.</div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Brainwriting beats brainstorming out loud.</b> Decades of research (Diehl &amp; Stroebe) show a group brainstorming aloud produces fewer and worse ideas than the same people thinking alone — blocked by having to wait their turn, fear of judgement, and free-riding. The fix is brainwriting: everyone writes ideas silently first, then the group pools and builds on them. <em>The lesson praises brainstorming; the research adds the crucial caveat that idea generation should start solo, not as a noisy group.</em></div>
<div class="note-ct">Creativity and critical thinking are partners: you <em>diverge</em> creatively to find options, then <em>converge</em> critically (Chapter 3) to judge them. Good problem solving needs both — generate widely, then choose wisely.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Từ một vấn đề tới nhiều ý tưởng</h2>
<p class="lead">Sáng tạo không phải năng khiếu thần kỳ — nó là một <strong>quy trình</strong> bạn có thể luyện. Nhịp cốt lõi luân phiên giữa mở ra (nhiều ý tưởng) và thu hẹp (chọn cái tốt nhất).</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Phân kỳ</div><div class="lz-t">tạo nhiều ý tưởng</div><div class="lz-d">số lượng trước, chưa phán xét</div></div>
  <div class="lz-step"><div class="lz-k">Hội tụ</div><div class="lz-t">đánh giá &amp; chọn</div><div class="lz-d">giờ mới áp tiêu chí</div></div>
</div>
<p>Sai lầm kinh điển là phán xét ý tưởng ngay khi tạo ra — điều đó giết mạch chảy. Tách hai giai đoạn: brainstorm tự do trước, phê bình sau.</p>
<h3>Các công cụ tư duy khơi ý tưởng</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Brainstorming (động não)</div><div class="lz-ld">Liệt kê càng nhiều ý càng tốt, không phán xét. Ý "điên" thường dẫn tới ý hay.</div></div>
  <div class="lz-layer"><div class="lz-lt">Sơ đồ tư duy (mind map)</div><div class="lz-ld">Phân nhánh trực quan từ vấn đề trung tâm để thấy các kết nối.</div></div>
  <div class="lz-layer"><div class="lz-lt">Hỏi "nếu như?" / đảo ngược</div><div class="lz-ld">Thách thức giả định: nếu ràng buộc không tồn tại thì sao? Nếu làm ngược lại thì sao?</div></div>
  <div class="lz-layer"><div class="lz-lt">SCAMPER</div><div class="lz-ld">Thay thế, Kết hợp, Thích nghi, Sửa đổi, Dùng cho việc khác, Loại bỏ, Đảo ngược — gợi ý để biến đổi một ý tưởng.</div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Brainwriting thắng brainstorm nói to.</b> Hàng chục năm nghiên cứu (Diehl &amp; Stroebe) cho thấy một nhóm động não nói to tạo ra ít ý và ý tệ hơn so với cùng những người đó nghĩ một mình — bị chặn bởi phải chờ tới lượt, sợ bị phán xét, và ăn theo. Cách chữa là brainwriting: mọi người viết ý trong im lặng trước, rồi nhóm mới gộp và phát triển tiếp. <em>Bài học khen brainstorming; nghiên cứu bổ sung lưu ý then chốt rằng việc tạo ý nên bắt đầu một mình, không phải một nhóm ồn ào.</em></div>
<div class="note-ct">Sáng tạo và tư duy phản biện là đối tác: bạn <em>phân kỳ</em> sáng tạo để tìm lựa chọn, rồi <em>hội tụ</em> phản biện (Chương 3) để đánh giá chúng. Giải quyết vấn đề tốt cần cả hai — tạo rộng, rồi chọn khôn.</div>
</div>
`,
        },
        {
          title: 'Chapter 2 Quiz|||Quiz chương 2',
          slug: 'ssl101c-quiz-ch2',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: vấn đề mở, nguyên nhân gốc, phân kỳ/hội tụ.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'An "ill-defined" problem is one that…|||Một vấn đề "mơ hồ" là vấn đề…', options: ['is stated clearly with a goal|||được phát biểu rõ với mục tiêu', 'is vague and needs clarifying before solving|||mơ hồ và cần làm rõ trước khi giải', 'has no solution|||không có lời giải', 'is from a textbook|||từ sách giáo khoa'], correctIndex: 1, points: 1 },
              { question: 'A missed deadline is usually a… of a deeper cause.|||Trễ hạn thường là một… của một nguyên nhân sâu hơn.', options: ['root cause|||nguyên nhân gốc', 'symptom|||triệu chứng', 'solution|||giải pháp', 'goal|||mục tiêu'], correctIndex: 1, points: 1 },
              { question: 'In the divergent phase of creativity you should…|||Trong giai đoạn phân kỳ của sáng tạo bạn nên…', options: ['judge each idea immediately|||phán xét ngay mỗi ý', 'generate many ideas without judging|||tạo nhiều ý mà không phán xét', 'pick the first idea|||chọn ý đầu tiên', 'stop after one idea|||dừng sau một ý'], correctIndex: 1, points: 1 },
              { question: 'The classic creativity mistake is…|||Sai lầm sáng tạo kinh điển là…', options: ['generating too many ideas|||tạo quá nhiều ý', 'judging ideas while you are still generating them|||phán xét ý tưởng khi vẫn đang tạo ra chúng', 'using a mind map|||dùng sơ đồ tư duy', 'asking why|||hỏi vì sao'], correctIndex: 1, points: 1 },
              { question: 'Creativity and critical thinking relate how?|||Sáng tạo và tư duy phản biện liên hệ thế nào?', options: ['they are opposites that cannot mix|||chúng là đối lập không thể trộn', 'diverge creatively to find options, then converge critically to judge|||phân kỳ sáng tạo tìm lựa chọn, rồi hội tụ phản biện để đánh giá', 'only one is needed|||chỉ cần một cái', 'they are the same thing|||chúng là một'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — TƯ DUY PHẢN BIỆN ══════════════════ */
    {
      title: 'Chapter 3 — Critical Thinking|||Chương 3 — Tư duy phản biện',
      description: 'Phân tích lập luận, nhận diện thiên kiến và đánh giá khẳng định.',
      lessons: [
        {
          title: '3.1 — Arguments & reasoning|||3.1 — Lập luận & suy luận',
          slug: 'ssl101c-3-1-lap-luan',
          type: 'VIDEO',
          description: 'Khẳng định, tiền đề, kết luận và cách nhận ra một lập luận tốt.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>What is an argument?</h2>
<p class="lead">In critical thinking (CLO3), an <strong>argument</strong> is not a fight — it is a set of reasons (premises) offered to support a conclusion. Learning to see this structure lets you judge whether a claim is actually justified.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Claim / conclusion</div><div class="lz-ld">The main point being asserted. "This app will succeed."</div></div>
  <div class="lz-layer"><div class="lz-lt">Premises / reasons</div><div class="lz-ld">The evidence given to support it. "Because it solves a real problem and has no competitor."</div></div>
  <div class="lz-layer"><div class="lz-lt">Inference</div><div class="lz-ld">The logical link — do the premises actually lead to the conclusion?</div></div>
</div>
<h3>Two kinds of reasoning</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Deductive</div><div class="lz-t">general → specific</div><div class="lz-d">if premises true, conclusion MUST be true</div></div>
  <div class="lz-step"><div class="lz-k">Inductive</div><div class="lz-t">specific → general</div><div class="lz-d">premises make conclusion LIKELY, not certain</div></div>
</div>
<p>A <strong>strong</strong> argument has true premises AND a valid logical link. Both matter: true facts with a broken inference, or perfect logic built on false facts, both fail.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Steelman before you argue.</b> The opposite of a straw man is a steelman: restate the other side's argument in its strongest, most charitable form — often stronger than they put it — and only then respond. If you can pass their "ideological Turing test" (state their view so well they would nod along), your critique is honest and far more persuasive. <em>The lesson defines argument structure; steelmanning is an intellectual-honesty discipline that also makes your own essays much harder to dismiss.</em></div>
<div class="callout ok">Critical thinking starts by asking of any claim: "What is the conclusion, what are the reasons, and do the reasons really support it?" This simple habit protects you from persuasive-but-empty arguments — in essays, ads, news, and AI output alike.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/critical-thinking-skills" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 3 — Critical Thinking Skills</span><span class="lc-sub">The official University of Sydney course on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Lập luận là gì?</h2>
<p class="lead">Trong tư duy phản biện (CLO3), một <strong>lập luận (argument)</strong> không phải là cãi nhau — nó là một tập lý do (tiền đề) đưa ra để hỗ trợ một kết luận. Học cách nhìn thấy cấu trúc này cho bạn đánh giá xem một khẳng định có thực sự có căn cứ không.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Khẳng định / kết luận</div><div class="lz-ld">Điểm chính được đưa ra. "App này sẽ thành công."</div></div>
  <div class="lz-layer"><div class="lz-lt">Tiền đề / lý do</div><div class="lz-ld">Bằng chứng đưa ra để hỗ trợ. "Vì nó giải một vấn đề thật và chưa có đối thủ."</div></div>
  <div class="lz-layer"><div class="lz-lt">Suy luận (inference)</div><div class="lz-ld">Liên kết logic — các tiền đề có thực sự dẫn tới kết luận không?</div></div>
</div>
<h3>Hai kiểu suy luận</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Diễn dịch</div><div class="lz-t">tổng quát → cụ thể</div><div class="lz-d">nếu tiền đề đúng, kết luận PHẢI đúng</div></div>
  <div class="lz-step"><div class="lz-k">Quy nạp</div><div class="lz-t">cụ thể → tổng quát</div><div class="lz-d">tiền đề làm kết luận CÓ KHẢ NĂNG, không chắc chắn</div></div>
</div>
<p>Một lập luận <strong>mạnh</strong> có tiền đề đúng VÀ liên kết logic hợp lệ. Cả hai đều quan trọng: dữ kiện đúng với suy luận hỏng, hoặc logic hoàn hảo dựng trên dữ kiện sai — cả hai đều thất bại.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dựng steelman trước khi phản biện.</b> Đối lập của người rơm (straw man) là steelman: phát biểu lại lập luận của phía kia ở dạng mạnh nhất, thiện chí nhất — thường mạnh hơn cả cách họ nói — rồi mới phản hồi. Nếu bạn qua được "bài kiểm Turing tư tưởng" của họ (trình bày quan điểm họ hay tới mức họ phải gật đầu), phê phán của bạn trung thực và thuyết phục hơn nhiều. <em>Bài học định nghĩa cấu trúc lập luận; steelmanning là kỷ luật trung thực trí tuệ, đồng thời làm bài luận của bạn khó bị bác bỏ hơn nhiều.</em></div>
<div class="callout ok">Tư duy phản biện bắt đầu bằng việc hỏi mọi khẳng định: "Kết luận là gì, lý do là gì, và các lý do có thực sự hỗ trợ nó không?" Thói quen đơn giản này bảo vệ bạn khỏi các lập luận nghe thuyết phục nhưng rỗng — trong bài luận, quảng cáo, tin tức, và cả đầu ra của AI.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/critical-thinking-skills" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 3 — Kỹ năng Tư duy phản biện</span><span class="lc-sub">Khoá chính chủ của Đại học Sydney trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — Bias & evaluating claims|||3.2 — Thiên kiến & đánh giá khẳng định',
          slug: 'ssl101c-3-2-thien-kien',
          type: 'VIDEO',
          description: 'Thiên kiến nhận thức và các ngụy biện logic hay gặp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>The mind&#39;s blind spots — bias</h2>
<p class="lead">Even smart people reason badly when <strong>bias</strong> creeps in. A bias is a systematic tendency to think in a skewed way. Knowing the common ones helps you catch them — in others&#39; arguments and your own.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Confirmation bias</div><div class="lz-ld">Noticing evidence that confirms what you already believe, ignoring the rest. The most common trap in research.</div></div>
  <div class="lz-layer"><div class="lz-lt">Anchoring</div><div class="lz-ld">Over-relying on the first piece of information you saw.</div></div>
  <div class="lz-layer"><div class="lz-lt">Bandwagon</div><div class="lz-ld">Believing something because many people do.</div></div>
</div>
<h3>Common logical fallacies</h3>
<p>A <strong>fallacy</strong> is a flaw in reasoning that makes an argument invalid even if it sounds convincing:</p>
<table>
  <thead><tr><th>Fallacy</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td>Ad hominem</td><td>Attacks the person instead of their argument</td></tr>
    <tr><td>Straw man</td><td>Distorts an opponent&#39;s view to attack an easier version</td></tr>
    <tr><td>False dilemma</td><td>Presents only two options when more exist</td></tr>
    <tr><td>Appeal to authority</td><td>Claims something is true just because an authority said so</td></tr>
    <tr><td>Correlation ≠ causation</td><td>Assumes because two things occur together, one caused the other</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The Dunning-Kruger trap.</b> Psychologists Dunning and Kruger found that the less competent people are at something, the more they tend to overrate their skill — because the very knowledge needed to do it well is what is needed to see how badly you are doing. Experts, paradoxically, often underrate themselves. <em>It complements the bias list with a bias about your own competence — the reason to seek feedback and stay humble about what you "obviously" already know.</em></div>
<div class="note-ct">Critical thinking is not being negative — it is being fair and evidence-based. Turn it on your <em>own</em> work too: what am I assuming? What evidence would change my mind? That honesty is the mark of a real thinker, and it directly improves your essays and the capstone.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Điểm mù của tâm trí — thiên kiến</h2>
<p class="lead">Ngay cả người thông minh cũng suy luận tệ khi <strong>thiên kiến (bias)</strong> len vào. Thiên kiến là xu hướng hệ thống suy nghĩ theo cách lệch. Biết các loại phổ biến giúp bạn bắt được chúng — trong lập luận của người khác và của chính mình.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Thiên kiến xác nhận</div><div class="lz-ld">Chỉ để ý bằng chứng xác nhận điều bạn đã tin, bỏ qua phần còn lại. Cái bẫy phổ biến nhất trong nghiên cứu.</div></div>
  <div class="lz-layer"><div class="lz-lt">Neo (anchoring)</div><div class="lz-ld">Quá dựa vào mẩu thông tin đầu tiên bạn thấy.</div></div>
  <div class="lz-layer"><div class="lz-lt">Đám đông (bandwagon)</div><div class="lz-ld">Tin một điều vì nhiều người tin.</div></div>
</div>
<h3>Các ngụy biện logic phổ biến</h3>
<p>Một <strong>ngụy biện (fallacy)</strong> là lỗi trong suy luận làm lập luận vô hiệu dù nghe có vẻ thuyết phục:</p>
<table>
  <thead><tr><th>Ngụy biện</th><th>Nó làm gì</th></tr></thead>
  <tbody>
    <tr><td>Công kích cá nhân (ad hominem)</td><td>Tấn công người thay vì lập luận của họ</td></tr>
    <tr><td>Người rơm (straw man)</td><td>Bóp méo quan điểm đối phương để đánh phiên bản dễ hơn</td></tr>
    <tr><td>Lưỡng nan giả</td><td>Chỉ đưa hai lựa chọn trong khi có nhiều hơn</td></tr>
    <tr><td>Viện dẫn thẩm quyền</td><td>Cho rằng đúng chỉ vì một người có thẩm quyền nói vậy</td></tr>
    <tr><td>Tương quan ≠ nhân quả</td><td>Cho rằng vì hai thứ xảy ra cùng nhau, cái này gây cái kia</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cái bẫy Dunning-Kruger.</b> Các nhà tâm lý Dunning và Kruger phát hiện rằng người càng kém ở một việc lại càng có xu hướng tự đánh giá kỹ năng mình cao — vì chính kiến thức cần để làm tốt cũng là thứ cần để thấy mình đang làm tệ đến đâu. Ngược đời thay, chuyên gia thường tự đánh giá thấp bản thân. <em>Nó bổ sung vào danh sách thiên kiến một thiên kiến về năng lực của chính bạn — lý do để tìm phản hồi và khiêm tốn với những gì bạn nghĩ mình "hiển nhiên" đã biết.</em></div>
<div class="note-ct">Tư duy phản biện không phải là tiêu cực — mà là công bằng và dựa trên bằng chứng. Hãy bật nó lên cả với công việc <em>của chính bạn</em>: mình đang giả định gì? Bằng chứng nào sẽ làm mình đổi ý? Sự trung thực đó là dấu hiệu của một người tư duy thật, và nó trực tiếp cải thiện bài luận và capstone của bạn.</div>
</div>
`,
        },
        {
          title: 'Chapter 3 Quiz|||Quiz chương 3',
          slug: 'ssl101c-quiz-ch3',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: lập luận, suy luận, thiên kiến, ngụy biện.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'In critical thinking, an argument is…|||Trong tư duy phản biện, một lập luận là…', options: ['a fight or quarrel|||một cuộc cãi vã', 'reasons (premises) offered to support a conclusion|||các lý do (tiền đề) đưa ra để hỗ trợ một kết luận', 'an opinion with no reasons|||một ý kiến không có lý do', 'a bias|||một thiên kiến'], correctIndex: 1, points: 1 },
              { question: 'In deductive reasoning, if the premises are true then the conclusion…|||Trong suy luận diễn dịch, nếu tiền đề đúng thì kết luận…', options: ['is only likely|||chỉ có khả năng', 'must be true|||phải đúng', 'is always false|||luôn sai', 'is irrelevant|||không liên quan'], correctIndex: 1, points: 1 },
              { question: 'Confirmation bias is the tendency to…|||Thiên kiến xác nhận là xu hướng…', options: ['seek evidence that confirms what you already believe|||tìm bằng chứng xác nhận điều bạn đã tin', 'change your mind too easily|||đổi ý quá dễ', 'ignore all evidence|||bỏ qua mọi bằng chứng', 'trust nobody|||không tin ai'], correctIndex: 0, points: 1 },
              { question: 'Attacking the person instead of their argument is the… fallacy.|||Tấn công người thay vì lập luận của họ là ngụy biện…', options: ['straw man|||người rơm', 'ad hominem|||công kích cá nhân', 'false dilemma|||lưỡng nan giả', 'bandwagon|||đám đông'], correctIndex: 1, points: 1 },
              { question: '"Two things happen together, so one caused the other" is the error of…|||"Hai thứ xảy ra cùng nhau, nên cái này gây cái kia" là lỗi…', options: ['confusing correlation with causation|||nhầm tương quan với nhân quả', 'deductive reasoning|||suy luận diễn dịch', 'referencing|||trích dẫn', 'brainstorming|||động não'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — GIAO TIẾP ══════════════════ */
    {
      title: 'Chapter 4 — Communication|||Chương 4 — Giao tiếp',
      description: 'Giao tiếp học thuật nói/viết/hình ảnh và trình bày lập luận.',
      lessons: [
        {
          title: '4.1 — Academic communication|||4.1 — Giao tiếp học thuật',
          slug: 'ssl101c-4-1-giao-tiep-hoc-thuat',
          type: 'VIDEO',
          description: 'Nói, viết, trình bày hình ảnh và điều chỉnh theo người nghe.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Communicating in an academic culture</h2>
<p class="lead">Great ideas are worthless if you cannot convey them (CLO4). Academic communication comes in several forms, and the key skill is matching your message to your <strong>audience</strong> and <strong>purpose</strong>.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">🗣️</div><div class="lz-nbody"><div class="lz-ntitle">Spoken</div><div class="lz-nsub">Tutorials, presentations, group discussion, questions in lectures</div></div></div>
  <div class="lz-node"><div class="lz-badge">✍️</div><div class="lz-nbody"><div class="lz-ntitle">Written</div><div class="lz-nsub">Essays, reports, forum posts, emails to lecturers</div></div></div>
  <div class="lz-node"><div class="lz-badge">📊</div><div class="lz-nbody"><div class="lz-ntitle">Visual</div><div class="lz-nsub">Charts, diagrams, slides — show, don&#39;t just tell</div></div></div>
</div>
<h3>Know your audience</h3>
<p>The same idea is communicated differently to a professor, a classmate, or the public. Adjust your vocabulary, formality and level of detail. In academic settings, aim for <strong>clarity and precision</strong> over sounding clever — simple, well-organized writing wins marks.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Who</div><div class="lz-t">audience</div><div class="lz-d">what do they already know?</div></div>
  <div class="lz-step"><div class="lz-k">Why</div><div class="lz-t">purpose</div><div class="lz-d">inform, persuade, or discuss?</div></div>
  <div class="lz-step"><div class="lz-k">How</div><div class="lz-t">form &amp; tone</div><div class="lz-d">match the setting</div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Beware the curse of knowledge.</b> Once you understand something it becomes almost impossible to imagine not knowing it — so experts skip the very steps a beginner needs. In a famous Stanford study people tapped out well-known songs; the tappers guessed listeners would recognize 50% of tunes, but only 2.5% did. The cure is to spell out your assumptions and test your explanation on a real novice. <em>The lesson says "know your audience"; the curse of knowledge names the cognitive reason we misjudge them, and how to counter it.</em></div>
<div class="callout ok">Participation counts — engaging in tutorials, online forums and group work is part of both learning and, often, your grade. Asking a thoughtful question is itself a communication skill worth practicing.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/communication-skills" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 4 — Communication Skills</span><span class="lc-sub">The official University of Sydney course on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Giao tiếp trong văn hoá học thuật</h2>
<p class="lead">Ý tưởng hay là vô giá trị nếu bạn không truyền đạt được (CLO4). Giao tiếp học thuật có nhiều hình thức, và kỹ năng then chốt là khớp thông điệp với <strong>người nghe</strong> và <strong>mục đích</strong>.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">🗣️</div><div class="lz-nbody"><div class="lz-ntitle">Nói</div><div class="lz-nsub">Tutorial, thuyết trình, thảo luận nhóm, đặt câu hỏi trên lớp</div></div></div>
  <div class="lz-node"><div class="lz-badge">✍️</div><div class="lz-nbody"><div class="lz-ntitle">Viết</div><div class="lz-nsub">Bài luận, báo cáo, bài forum, email cho giảng viên</div></div></div>
  <div class="lz-node"><div class="lz-badge">📊</div><div class="lz-nbody"><div class="lz-ntitle">Hình ảnh</div><div class="lz-nsub">Biểu đồ, sơ đồ, slide — cho thấy, không chỉ kể</div></div></div>
</div>
<h3>Hiểu người nghe của bạn</h3>
<p>Cùng một ý được truyền đạt khác nhau tới một giáo sư, một bạn học, hay công chúng. Điều chỉnh từ ngữ, mức trang trọng và độ chi tiết. Trong môi trường học thuật, hãy nhắm tới <strong>rõ ràng và chính xác</strong> hơn là nghe thông minh — viết đơn giản, có tổ chức tốt sẽ được điểm.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Ai</div><div class="lz-t">người nghe</div><div class="lz-d">họ đã biết gì?</div></div>
  <div class="lz-step"><div class="lz-k">Vì sao</div><div class="lz-t">mục đích</div><div class="lz-d">thông tin, thuyết phục, hay thảo luận?</div></div>
  <div class="lz-step"><div class="lz-k">Thế nào</div><div class="lz-t">hình thức &amp; giọng điệu</div><div class="lz-d">khớp bối cảnh</div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Coi chừng lời nguyền tri thức.</b> Một khi đã hiểu điều gì, gần như không thể tưởng tượng cảnh chưa biết nó — nên chuyên gia bỏ qua đúng những bước người mới cần. Trong một nghiên cứu nổi tiếng ở Stanford, người ta gõ nhịp các bài hát quen; người gõ đoán người nghe sẽ nhận ra 50% giai điệu, nhưng chỉ 2,5% nhận ra. Cách chữa là nói rõ giả định của bạn và thử lời giải thích trên một người thật sự chưa biết. <em>Bài học nói "hiểu người nghe"; lời nguyền tri thức đặt tên cho lý do nhận thức khiến ta đánh giá sai họ, và cách khắc phục.</em></div>
<div class="callout ok">Tham gia được tính điểm — tham gia tutorial, forum online và làm việc nhóm là một phần của việc học và, thường, của điểm bạn. Đặt một câu hỏi sâu sắc bản thân nó là một kỹ năng giao tiếp đáng luyện.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/communication-skills" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 4 — Kỹ năng Giao tiếp</span><span class="lc-sub">Khoá chính chủ của Đại học Sydney trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: '4.2 — Structuring & presenting arguments|||4.2 — Cấu trúc & trình bày lập luận',
          slug: 'ssl101c-4-2-cau-truc-lap-luan',
          type: 'VIDEO',
          description: 'Cấu trúc bài luận/thuyết trình rõ ràng để thuyết phục.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Structure makes you persuasive</h2>
<p class="lead">Whether writing an essay or giving a talk, a clear structure lets your audience follow your reasoning. The classic academic shape is simple and reliable.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Introduction</div><div class="lz-ld">State your topic and your main claim (thesis). Tell them what you will argue.</div></div>
  <div class="lz-layer"><div class="lz-lt">Body</div><div class="lz-ld">One clear point per paragraph, each with a claim, evidence, and explanation. Build the case step by step.</div></div>
  <div class="lz-layer"><div class="lz-lt">Conclusion</div><div class="lz-ld">Restate your position and summarize how the evidence supports it. No new information.</div></div>
</div>
<h3>Formulating an argument from research</h3>
<p>Communicating research findings means turning what you found into a clear argument: state a claim, back it with the evidence you gathered (Chapter 1), reason from it critically (Chapter 3), and present it clearly here. All four skills combine.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Claim</div><div class="lz-t">your position</div><div class="lz-d">the thesis</div></div>
  <div class="lz-step"><div class="lz-k">Evidence</div><div class="lz-t">cited sources</div><div class="lz-d">from your research</div></div>
  <div class="lz-step"><div class="lz-k">Reasoning</div><div class="lz-t">why it supports the claim</div><div class="lz-d">the logical link</div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The Toulmin model: add the warrant.</b> Philosopher Stephen Toulmin showed a real argument needs more than claim + evidence: it needs a <em>warrant</em> — the often-unstated principle that links the two — plus a qualifier ("usually", "probably") and a rebuttal that names the exceptions. Making the warrant explicit is exactly where weak essays are exposed and strong ones convince. <em>The lesson gives claim-evidence-reasoning; Toulmin's warrant/qualifier/rebuttal is the graduate-level upgrade examiners reward.</em></div>
<div class="note-ct">A well-structured argument is easier to write, easier to read, and easier to grade well. When stuck, outline first: one line per paragraph. If the outline flows logically, the full piece will too. This is exactly the process the capstone (Chapter 6) asks you to run end-to-end.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Cấu trúc làm bạn thuyết phục</h2>
<p class="lead">Dù viết bài luận hay thuyết trình, một cấu trúc rõ ràng cho người nghe theo được lập luận của bạn. Khuôn học thuật kinh điển đơn giản và đáng tin.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Mở bài</div><div class="lz-ld">Nêu chủ đề và khẳng định chính (luận điểm). Cho họ biết bạn sẽ lập luận điều gì.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thân bài</div><div class="lz-ld">Một ý rõ mỗi đoạn, mỗi đoạn có khẳng định, bằng chứng, và giải thích. Xây lập luận từng bước.</div></div>
  <div class="lz-layer"><div class="lz-lt">Kết bài</div><div class="lz-ld">Nhắc lại lập trường và tóm tắt bằng chứng hỗ trợ nó ra sao. Không thêm thông tin mới.</div></div>
</div>
<h3>Hình thành lập luận từ nghiên cứu</h3>
<p>Truyền đạt kết quả nghiên cứu nghĩa là biến điều bạn tìm được thành một lập luận rõ: nêu khẳng định, chống đỡ bằng bằng chứng bạn thu thập (Chương 1), suy luận phản biện từ nó (Chương 3), và trình bày rõ ràng ở đây. Cả bốn kỹ năng kết hợp.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Khẳng định</div><div class="lz-t">lập trường của bạn</div><div class="lz-d">luận điểm</div></div>
  <div class="lz-step"><div class="lz-k">Bằng chứng</div><div class="lz-t">nguồn đã trích dẫn</div><div class="lz-d">từ nghiên cứu của bạn</div></div>
  <div class="lz-step"><div class="lz-k">Suy luận</div><div class="lz-t">vì sao nó hỗ trợ khẳng định</div><div class="lz-d">liên kết logic</div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mô hình Toulmin: thêm cơ sở lập luận (warrant).</b> Nhà triết học Stephen Toulmin chỉ ra một lập luận thật cần hơn là khẳng định + bằng chứng: nó cần một <em>warrant</em> — nguyên tắc thường ngầm ẩn nối hai thứ đó — cộng một bộ hạn định ("thường", "có lẽ") và một phản bác nêu các ngoại lệ. Làm warrant hiện rõ đúng là nơi bài luận yếu bị lộ và bài mạnh thuyết phục. <em>Bài học cho khẳng định-bằng chứng-suy luận; warrant/hạn định/phản bác của Toulmin là bản nâng cấp trình độ cao mà giám khảo tưởng thưởng.</em></div>
<div class="note-ct">Một lập luận có cấu trúc tốt dễ viết hơn, dễ đọc hơn, và dễ được chấm điểm cao hơn. Khi bí, hãy lập dàn ý trước: một dòng mỗi đoạn. Nếu dàn ý trôi chảy logic, cả bài cũng vậy. Đây đúng là quy trình mà capstone (Chương 6) yêu cầu bạn chạy từ đầu đến cuối.</div>
</div>
`,
        },
        {
          title: 'Chapter 4 Quiz|||Quiz chương 4',
          slug: 'ssl101c-quiz-ch4',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: hình thức giao tiếp, người nghe, cấu trúc lập luận.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The key to good academic communication is matching your message to…|||Chìa khoá của giao tiếp học thuật tốt là khớp thông điệp với…', options: ['the longest words possible|||các từ dài nhất có thể', 'your audience and purpose|||người nghe và mục đích của bạn', 'the deadline|||hạn nộp', 'the font size|||cỡ chữ'], correctIndex: 1, points: 1 },
              { question: 'In academic writing you should aim for…|||Trong viết học thuật bạn nên nhắm tới…', options: ['sounding as clever as possible|||nghe thông minh nhất có thể', 'clarity and precision|||rõ ràng và chính xác', 'as many words as possible|||càng nhiều từ càng tốt', 'no structure|||không cấu trúc'], correctIndex: 1, points: 1 },
              { question: 'A standard essay body paragraph should contain…|||Một đoạn thân bài luận chuẩn nên chứa…', options: ['many unrelated points|||nhiều ý không liên quan', 'one clear point with claim, evidence and explanation|||một ý rõ với khẳng định, bằng chứng và giải thích', 'only a quotation|||chỉ một trích dẫn', 'the whole argument|||cả lập luận'], correctIndex: 1, points: 1 },
              { question: 'A conclusion should…|||Phần kết bài nên…', options: ['introduce brand-new evidence|||đưa bằng chứng hoàn toàn mới', 'restate the position and summarize the support|||nhắc lại lập trường và tóm tắt phần hỗ trợ', 'ask a new question|||đặt một câu hỏi mới', 'be the longest section|||là phần dài nhất'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — LIÊM CHÍNH & TRÁNH ĐẠO VĂN ══════════════════ */
    {
      title: 'Chapter 5 — Academic Integrity & Avoiding Plagiarism|||Chương 5 — Liêm chính & Tránh đạo văn',
      description: 'Đạo văn là gì, hậu quả, và cách trích dẫn/diễn giải để tránh.',
      lessons: [
        {
          title: '5.1 — What plagiarism is & how to avoid it|||5.1 — Đạo văn là gì & cách tránh',
          slug: 'ssl101c-5-1-tranh-dao-van',
          type: 'VIDEO',
          description: 'Trích dẫn, diễn giải đúng cách và dùng công cụ số để không đạo văn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Academic integrity — doing your work honestly</h2>
<p class="lead"><strong>Plagiarism</strong> is presenting someone else&#39;s words, ideas or work as your own without proper credit. It is one of the most serious academic offences — and much of it is <em>accidental</em>, from sloppy note-taking. This FPT-authored module (CLO5) teaches you to avoid it with digital tools.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Copying text without quotes/citation</div><div class="lz-ld">Even a single sentence copied word-for-word needs quotation marks AND a citation.</div></div>
  <div class="lz-layer"><div class="lz-lt">Paraphrasing without citation</div><div class="lz-ld">Rewording someone&#39;s idea still uses their idea — you must still cite them.</div></div>
  <div class="lz-layer"><div class="lz-lt">Self-plagiarism &amp; unauthorized collaboration</div><div class="lz-ld">Reusing your own past submission, or copying a friend&#39;s work, also count.</div></div>
</div>
<h3>How to avoid it — three tools</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Quote</div><div class="lz-t">use exact words</div><div class="lz-d">quotation marks + citation</div></div>
  <div class="lz-step"><div class="lz-k">Paraphrase</div><div class="lz-t">reword in your own way</div><div class="lz-d">still cite the source</div></div>
  <div class="lz-step"><div class="lz-k">Cite</div><div class="lz-t">reference every source</div><div class="lz-d">in-text + reference list</div></div>
</div>
<p><strong>Paraphrasing well</strong> means genuinely re-expressing an idea in your own words and structure — not swapping a few synonyms. And even a perfect paraphrase still needs a citation, because the idea is not yours.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>How similarity detectors really work.</b> Turnitin does not "understand" your essay — it breaks the text into overlapping word-string fingerprints and matches them against a huge index of papers and web pages, returning a similarity percentage. So correctly quoted-and-cited passages and common phrases can inflate the score, while a clever paraphrase may slip past. That means the score is a flag for a human to read, not a verdict — and honest citation, not evasion, is the real defence. <em>The lesson warns that tools detect copying; knowing they match fingerprints (not meaning) explains both their false alarms and their blind spots.</em></div>
<div class="callout warn">Digital tools like <strong>Turnitin</strong> detect copied text automatically, and universities take breaches seriously — penalties range from zero marks to expulsion. But integrity is not about fear of getting caught; it is about learning honestly and earning trust. Cite generously and you are always safe.</div>
<a class="link-card exphub" href="/exp-hub/ssl101c-cong-cu-hoc-tap?ref=%2Fcourses%2Facademic-skills-for-university-success%2Flearn&reflabel=SSL101c%20%E2%80%94%20Academic%20Skills%20for%20University%20Success" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Citation &amp; plagiarism-check tools</span><span class="lc-sub">Zotero, citation generators and integrity resources on the tools guide.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Liêm chính học thuật — làm bài một cách trung thực</h2>
<p class="lead"><strong>Đạo văn (plagiarism)</strong> là trình bày lời, ý tưởng hoặc công trình của người khác như của mình mà không ghi công đúng cách. Đây là một trong những vi phạm học thuật nghiêm trọng nhất — và phần lớn là <em>vô tình</em>, do ghi chép cẩu thả. Module do FPT biên soạn này (CLO5) dạy bạn tránh nó bằng công cụ số.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Chép văn bản không đặt ngoặc/trích dẫn</div><div class="lz-ld">Dù chỉ một câu chép nguyên văn cũng cần dấu ngoặc kép VÀ một trích dẫn.</div></div>
  <div class="lz-layer"><div class="lz-lt">Diễn giải mà không trích dẫn</div><div class="lz-ld">Viết lại ý của người khác vẫn dùng ý của họ — bạn vẫn phải trích dẫn họ.</div></div>
  <div class="lz-layer"><div class="lz-lt">Tự đạo văn &amp; hợp tác trái phép</div><div class="lz-ld">Dùng lại bài nộp cũ của mình, hoặc chép bài của bạn bè, cũng bị tính.</div></div>
</div>
<h3>Cách tránh — ba công cụ</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Trích dẫn nguyên văn</div><div class="lz-t">dùng đúng lời</div><div class="lz-d">dấu ngoặc kép + trích dẫn</div></div>
  <div class="lz-step"><div class="lz-k">Diễn giải</div><div class="lz-t">viết lại theo cách của bạn</div><div class="lz-d">vẫn trích dẫn nguồn</div></div>
  <div class="lz-step"><div class="lz-k">Ghi nguồn</div><div class="lz-t">trích dẫn mọi nguồn</div><div class="lz-d">trong bài + danh mục</div></div>
</div>
<p><strong>Diễn giải tốt</strong> nghĩa là thực sự tái diễn đạt một ý bằng lời và cấu trúc của bạn — không phải đổi vài từ đồng nghĩa. Và ngay cả một bản diễn giải hoàn hảo vẫn cần trích dẫn, vì ý tưởng không phải của bạn.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Công cụ dò trùng lặp thật ra hoạt động thế nào.</b> Turnitin không "hiểu" bài của bạn — nó cắt văn bản thành các dấu vân chuỗi-từ chồng lấp và đối chiếu với một kho khổng lồ các bài và trang web, trả về phần trăm trùng lặp. Vậy nên đoạn trích dẫn đúng và các cụm từ thông dụng có thể đẩy điểm lên, trong khi một bản diễn giải khéo có thể lọt qua. Nghĩa là điểm số là dấu hiệu để con người đọc, không phải phán quyết — và trích dẫn trung thực, chứ không phải né tránh, mới là phòng thủ thật. <em>Bài học cảnh báo công cụ phát hiện sao chép; biết chúng khớp dấu vân (không phải nghĩa) giải thích cả báo động giả lẫn điểm mù của chúng.</em></div>
<div class="callout warn">Công cụ số như <strong>Turnitin</strong> phát hiện văn bản sao chép tự động, và các trường xử lý vi phạm nghiêm túc — hình phạt từ 0 điểm tới đuổi học. Nhưng liêm chính không phải là sợ bị bắt; mà là học trung thực và giành được sự tin cậy. Trích dẫn hào phóng và bạn luôn an toàn.</div>
<a class="link-card exphub" href="/exp-hub/ssl101c-cong-cu-hoc-tap?ref=%2Fcourses%2Facademic-skills-for-university-success%2Flearn&reflabel=SSL101c%20%E2%80%94%20Academic%20Skills%20for%20University%20Success" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Công cụ trích dẫn &amp; kiểm đạo văn</span><span class="lc-sub">Zotero, trình tạo trích dẫn và tài nguyên liêm chính ở guide công cụ.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 5 Quiz|||Quiz chương 5',
          slug: 'ssl101c-quiz-ch5',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: định nghĩa đạo văn, quote/paraphrase/cite.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Plagiarism is…|||Đạo văn là…', options: ['citing too many sources|||trích dẫn quá nhiều nguồn', 'presenting others\' words or ideas as your own without credit|||trình bày lời/ý của người khác như của mình mà không ghi công', 'writing a long essay|||viết một bài luận dài', 'using a reference manager|||dùng trình quản lý trích dẫn'], correctIndex: 1, points: 1 },
              { question: 'If you paraphrase an idea in your own words, you…|||Nếu bạn diễn giải một ý bằng lời của mình, bạn…', options: ['do not need to cite it|||không cần trích dẫn', 'still must cite the original source|||vẫn phải trích dẫn nguồn gốc', 'have committed no academic act|||chưa làm hành vi học thuật nào', 'can claim it as fully your own|||có thể coi hoàn toàn là của mình'], correctIndex: 1, points: 1 },
              { question: 'Copying one sentence word-for-word requires…|||Chép một câu nguyên văn cần…', options: ['nothing|||không gì', 'quotation marks AND a citation|||dấu ngoặc kép VÀ một trích dẫn', 'only a mention in the conclusion|||chỉ nhắc ở kết bài', 'a longer paragraph|||một đoạn dài hơn'], correctIndex: 1, points: 1 },
              { question: 'Good paraphrasing means…|||Diễn giải tốt nghĩa là…', options: ['swapping a few synonyms|||đổi vài từ đồng nghĩa', 're-expressing the idea in your own words and structure|||tái diễn đạt ý bằng lời và cấu trúc của bạn', 'copying with quotes|||chép có ngoặc kép', 'deleting the source|||xoá nguồn'], correctIndex: 1, points: 1 },
              { question: 'Reusing your own previously submitted work can be…|||Dùng lại bài nộp trước đây của chính mình có thể là…', options: ['always fine|||luôn ổn', 'self-plagiarism|||tự đạo văn', 'good referencing|||trích dẫn tốt', 'required|||bắt buộc'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 6 — CAPSTONE ══════════════════ */
    {
      title: 'Chapter 6 — Capstone: Research & Communication|||Chương 6 — Capstone: Nghiên cứu & Giao tiếp',
      description: 'Ghép cả bốn kỹ năng vào một dự án nghiên cứu hoàn chỉnh.',
      lessons: [
        {
          title: '6.1 — Bringing the skills together|||6.1 — Ghép các kỹ năng lại',
          slug: 'ssl101c-6-1-capstone',
          type: 'VIDEO',
          description: 'Chạy một dự án nhỏ từ câu hỏi tới bài trình bày, dùng cả 4 kỹ năng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>The capstone — all four skills, one project</h2>
<p class="lead">The capstone (CLO5) is where the four skills stop being separate lessons and become a single workflow: research a question, think it through, and communicate your findings — honestly. This is exactly how real academic and professional projects run.</p>
<div class="lz-map">
  <div class="lz-stage">A research project, end to end</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Frame the question (Ch 2)</div><div class="lz-nsub">Turn a broad topic into a focused, answerable question</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Research it (Ch 1)</div><div class="lz-nsub">Find, evaluate and manage credible sources</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Analyse critically (Ch 3)</div><div class="lz-nsub">Weigh evidence, check bias, form a reasoned position</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Communicate it (Ch 4)</div><div class="lz-nsub">Present a clear, structured, cited argument</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Do it honestly (Ch 5)</div><div class="lz-nsub">Cite everything · no plagiarism</div></div></div>
</div>
<div class="callout ok">Notice the loop is not strictly linear — as you research you refine the question, and as you write you spot gaps to research. That back-and-forth is normal and healthy. The skills reinforce each other.</div>
<h3>Course wrap-up</h3>
<p>You now have the four university survival skills plus integrity: you can <strong>find and judge information</strong>, <strong>define and solve problems</strong>, <strong>think critically</strong>, and <strong>communicate clearly and honestly</strong>. Every essay, lab report, presentation and group project from here on is these skills in action.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Aim for far transfer.</b> Learning scientists distinguish <em>near transfer</em> (using a skill in a nearly identical task) from <em>far transfer</em> (using it in a very different context) — and far transfer is notoriously hard and rarely automatic. Skills stay locked to the class you learned them in unless you deliberately practise them elsewhere and name the principle each time you reuse it. <em>The lesson urges you to reuse these skills; transfer research explains why that reuse must be deliberate, not assumed to just happen.</em></div>
<div class="note-ct">Do not file these away after the exam. Use them deliberately in your very next assignment — that is how a "study skill" becomes second nature and quietly raises every grade you earn.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/academic-skills-project" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 5 — Academic Skills Capstone</span><span class="lc-sub">The official University of Sydney capstone on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Capstone — cả bốn kỹ năng, một dự án</h2>
<p class="lead">Capstone (CLO5) là nơi bốn kỹ năng thôi là các bài học riêng lẻ và trở thành một quy trình duy nhất: nghiên cứu một câu hỏi, tư duy thấu đáo, và truyền đạt kết quả — một cách trung thực. Đây đúng là cách các dự án học thuật và nghề nghiệp thật vận hành.</p>
<div class="lz-map">
  <div class="lz-stage">Một dự án nghiên cứu, từ đầu đến cuối</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Đặt khung câu hỏi (Ch 2)</div><div class="lz-nsub">Biến chủ đề rộng thành câu hỏi tập trung, trả lời được</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Nghiên cứu (Ch 1)</div><div class="lz-nsub">Tìm, đánh giá và quản lý nguồn đáng tin</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Phân tích phản biện (Ch 3)</div><div class="lz-nsub">Cân bằng chứng, kiểm thiên kiến, hình thành lập trường có lý</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Truyền đạt (Ch 4)</div><div class="lz-nsub">Trình bày một lập luận rõ, có cấu trúc, có trích dẫn</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Làm trung thực (Ch 5)</div><div class="lz-nsub">Trích dẫn mọi thứ · không đạo văn</div></div></div>
</div>
<div class="callout ok">Để ý vòng lặp không hoàn toàn tuyến tính — khi nghiên cứu bạn tinh chỉnh câu hỏi, và khi viết bạn phát hiện lỗ hổng cần nghiên cứu. Sự qua lại đó là bình thường và lành mạnh. Các kỹ năng củng cố lẫn nhau.</div>
<h3>Tổng kết môn</h3>
<p>Giờ bạn có bốn kỹ năng sống còn ở đại học cộng liêm chính: bạn có thể <strong>tìm và đánh giá thông tin</strong>, <strong>định nghĩa và giải vấn đề</strong>, <strong>tư duy phản biện</strong>, và <strong>giao tiếp rõ ràng và trung thực</strong>. Mọi bài luận, báo cáo lab, thuyết trình và dự án nhóm từ đây là các kỹ năng này trong hành động.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nhắm tới "chuyển giao xa" (far transfer).</b> Các nhà khoa học học tập phân biệt <em>chuyển giao gần</em> (dùng kỹ năng ở một việc gần như y hệt) với <em>chuyển giao xa</em> (dùng nó ở bối cảnh rất khác) — và chuyển giao xa nổi tiếng là khó và hiếm khi tự động. Kỹ năng bị khoá cứng vào chính lớp bạn học nó, trừ khi bạn cố ý luyện ở nơi khác và gọi tên nguyên tắc mỗi lần tái dùng. <em>Bài học thúc bạn tái dùng các kỹ năng này; nghiên cứu về chuyển giao giải thích vì sao việc tái dùng đó phải có chủ đích, không mặc định tự xảy ra.</em></div>
<div class="note-ct">Đừng cất chúng đi sau kỳ thi. Hãy dùng chúng có chủ đích ngay trong bài tập kế tiếp — đó là cách một "kỹ năng học tập" trở thành bản năng và âm thầm nâng mọi điểm bạn giành được.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/academic-skills-project" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 5 — Academic Skills Capstone</span><span class="lc-sub">Capstone chính chủ của Đại học Sydney trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 6 Quiz|||Quiz chương 6',
          slug: 'ssl101c-quiz-ch6',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: quy trình capstone, kết hợp các kỹ năng.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The capstone project mainly asks you to…|||Dự án capstone chủ yếu yêu cầu bạn…', options: ['memorize definitions|||học thuộc định nghĩa', 'combine all four skills in one research project|||kết hợp cả bốn kỹ năng trong một dự án nghiên cứu', 'skip research|||bỏ nghiên cứu', 'work without citing|||làm không trích dẫn'], correctIndex: 1, points: 1 },
              { question: 'A good first step in a research project is to…|||Bước đầu tốt trong một dự án nghiên cứu là…', options: ['write the conclusion first|||viết kết luận trước', 'turn a broad topic into a focused, answerable question|||biến chủ đề rộng thành câu hỏi tập trung, trả lời được', 'copy an existing paper|||chép một bài có sẵn', 'ignore sources|||bỏ qua nguồn'], correctIndex: 1, points: 1 },
              { question: 'The research-to-communication process is usually…|||Quy trình từ nghiên cứu tới truyền đạt thường…', options: ['strictly linear, never revisited|||hoàn toàn tuyến tính, không quay lại', 'iterative — you refine the question as you research and write|||lặp — bạn tinh chỉnh câu hỏi khi nghiên cứu và viết', 'done in one pass with no changes|||làm một lần không thay đổi', 'only about writing|||chỉ về viết'], correctIndex: 1, points: 1 },
              { question: 'The best way to keep these skills is to…|||Cách tốt nhất để giữ các kỹ năng này là…', options: ['forget them after the exam|||quên chúng sau kỳ thi', 'deliberately use them in your next assignments|||dùng chúng có chủ đích trong các bài tập kế tiếp', 'only use them in SSL101c|||chỉ dùng trong SSL101c', 'avoid group work|||tránh làm nhóm'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 1 — GHI CHÉP & ĐỌC CHỦ ĐỘNG ══════════════════ */
    {
      title: 'Advanced 1 — Note-taking & active reading|||Nâng cao 1 — Ghi chép & đọc chủ động',
      description: 'Ngoài giáo trình: hệ thống ghi chép (Cornell) và đọc chủ động (SQ3R).',
      lessons: [
        {
          title: 'N1.1 — Cornell notes & the SQ3R method|||N1.1 — Ghi chú Cornell & phương pháp SQ3R',
          slug: 'ssl101c-n1-1-ghi-chep',
          type: 'VIDEO',
          description: 'Hai hệ thống biến việc nghe/đọc thụ động thành ghi nhớ chủ động.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 1 · Lesson N1.1</span>
<h2>Note-taking that actually helps you remember</h2>
<p class="lead">Copying slides word-for-word is nearly useless. Good notes force you to process ideas. Two proven systems make notes active rather than passive.</p>
<h3>Cornell notes</h3>
<p>Divide a page into three zones: a wide <strong>notes</strong> column, a narrow <strong>cue</strong> column on the left, and a <strong>summary</strong> strip at the bottom.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Notes (right, during class)</div><div class="lz-ld">Main ideas in your own words, not verbatim.</div></div>
  <div class="lz-layer"><div class="lz-lt">Cues (left, after class)</div><div class="lz-ld">Keywords and questions that trigger recall of the notes.</div></div>
  <div class="lz-layer"><div class="lz-lt">Summary (bottom)</div><div class="lz-ld">2–3 sentences capturing the whole page — the reviewing step that cements memory.</div></div>
</div>
<h3>SQ3R — active reading</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Survey</div><div class="lz-t">skim headings first</div><div class="lz-d">get the shape</div></div>
  <div class="lz-step"><div class="lz-k">Question</div><div class="lz-t">turn headings into questions</div><div class="lz-d">read to answer them</div></div>
  <div class="lz-step"><div class="lz-k">Read</div><div class="lz-t">actively seek answers</div><div class="lz-d">not passive scanning</div></div>
  <div class="lz-step"><div class="lz-k">Recite &amp; Review</div><div class="lz-t">say it, revisit later</div><div class="lz-d">spaced repetition</div></div>
</div>
<div class="callout ok">The common thread is <strong>retrieval</strong>: memory strengthens when you try to recall, not when you re-read. Cornell cues and SQ3R questions both force recall. Combined with reviewing a day later, they beat hours of passive highlighting.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 1 · Bài N1.1</span>
<h2>Ghi chép thực sự giúp bạn nhớ</h2>
<p class="lead">Chép slide nguyên văn gần như vô dụng. Ghi chép tốt buộc bạn xử lý ý tưởng. Hai hệ thống đã được chứng minh biến ghi chép thành chủ động thay vì thụ động.</p>
<h3>Ghi chú Cornell</h3>
<p>Chia trang thành ba vùng: cột <strong>ghi chú</strong> rộng, cột <strong>gợi ý (cue)</strong> hẹp bên trái, và dải <strong>tóm tắt</strong> ở dưới cùng.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Ghi chú (phải, trong giờ)</div><div class="lz-ld">Ý chính bằng lời của bạn, không nguyên văn.</div></div>
  <div class="lz-layer"><div class="lz-lt">Gợi ý (trái, sau giờ)</div><div class="lz-ld">Từ khoá và câu hỏi kích hoạt nhớ lại phần ghi chú.</div></div>
  <div class="lz-layer"><div class="lz-lt">Tóm tắt (dưới)</div><div class="lz-ld">2–3 câu tóm cả trang — bước ôn tập gắn chặt trí nhớ.</div></div>
</div>
<h3>SQ3R — đọc chủ động</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Survey (Khảo sát)</div><div class="lz-t">lướt tiêu đề trước</div><div class="lz-d">nắm hình dạng</div></div>
  <div class="lz-step"><div class="lz-k">Question (Hỏi)</div><div class="lz-t">biến tiêu đề thành câu hỏi</div><div class="lz-d">đọc để trả lời chúng</div></div>
  <div class="lz-step"><div class="lz-k">Read (Đọc)</div><div class="lz-t">chủ động tìm câu trả lời</div><div class="lz-d">không lướt thụ động</div></div>
  <div class="lz-step"><div class="lz-k">Recite &amp; Review</div><div class="lz-t">nói lại, ôn lại sau</div><div class="lz-d">lặp lại giãn cách</div></div>
</div>
<div class="callout ok">Sợi chỉ chung là <strong>truy hồi (retrieval)</strong>: trí nhớ mạnh lên khi bạn cố nhớ lại, không phải khi đọc lại. Gợi ý Cornell và câu hỏi SQ3R đều buộc nhớ lại. Kết hợp với ôn lại sau một ngày, chúng thắng hàng giờ tô màu thụ động.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 2 — QUẢN LÝ THỜI GIAN ══════════════════ */
    {
      title: 'Advanced 2 — Time management & deep work|||Nâng cao 2 — Quản lý thời gian & làm việc sâu',
      description: 'Ngoài giáo trình: quản lý thời gian tự học và tập trung sâu.',
      lessons: [
        {
          title: 'N2.1 — Managing self-study time|||N2.1 — Quản lý thời gian tự học',
          slug: 'ssl101c-n2-1-thoi-gian',
          type: 'VIDEO',
          description: 'Ưu tiên việc, chống trì hoãn và tập trung sâu với Pomodoro.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 2 · Lesson N2.1</span>
<h2>The hidden skill: managing 102 hours of self-study</h2>
<p class="lead">This course alone expects ~100 hours of independent study. No one schedules that for you — managing your own time is the skill that quietly decides whether you thrive or drown at university.</p>
<h3>Prioritize — not everything is equally urgent</h3>
<p>The <strong>Eisenhower matrix</strong> sorts tasks by urgency and importance, so you spend time where it counts instead of just reacting.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Important + Urgent</div><div class="lz-ld">Do now — deadlines today, the exam tomorrow.</div></div>
  <div class="lz-layer"><div class="lz-lt">Important + Not urgent</div><div class="lz-ld">Schedule it — this is where real progress lives (studying before the crunch).</div></div>
  <div class="lz-layer"><div class="lz-lt">Urgent + Not important</div><div class="lz-ld">Minimize/delegate — many notifications live here.</div></div>
  <div class="lz-layer"><div class="lz-lt">Neither</div><div class="lz-ld">Cut it — endless scrolling.</div></div>
</div>
<h3>Focus deeply with Pomodoro</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Focus</div><div class="lz-t">25 min, one task</div><div class="lz-d">phone away, no tabs</div></div>
  <div class="lz-step"><div class="lz-k">Break</div><div class="lz-t">5 min rest</div><div class="lz-d">stand, stretch</div></div>
  <div class="lz-step"><div class="lz-k">Repeat</div><div class="lz-t">longer break after 4</div><div class="lz-d">sustainable focus</div></div>
</div>
<div class="callout ok">Procrastination usually comes from a task feeling too big or vague. The fix: shrink it — "write the intro paragraph", not "do the essay". A tiny, clear next step is easy to start, and starting is 90% of the battle.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 2 · Bài N2.1</span>
<h2>Kỹ năng ẩn: quản lý 102 giờ tự học</h2>
<p class="lead">Riêng môn này đã đòi ~100 giờ tự học. Không ai xếp lịch đó cho bạn — quản lý thời gian của chính mình là kỹ năng âm thầm quyết định bạn phát triển hay chìm ở đại học.</p>
<h3>Ưu tiên — không phải việc nào cũng gấp như nhau</h3>
<p><strong>Ma trận Eisenhower</strong> phân loại việc theo độ gấp và độ quan trọng, để bạn dành thời gian đúng chỗ thay vì chỉ phản ứng.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Quan trọng + Gấp</div><div class="lz-ld">Làm ngay — hạn hôm nay, thi ngày mai.</div></div>
  <div class="lz-layer"><div class="lz-lt">Quan trọng + Không gấp</div><div class="lz-ld">Lên lịch — đây là nơi tiến bộ thật sự nằm (học trước khi nước tới chân).</div></div>
  <div class="lz-layer"><div class="lz-lt">Gấp + Không quan trọng</div><div class="lz-ld">Giảm thiểu/uỷ thác — nhiều thông báo nằm ở đây.</div></div>
  <div class="lz-layer"><div class="lz-lt">Không cả hai</div><div class="lz-ld">Cắt bỏ — lướt mạng vô tận.</div></div>
</div>
<h3>Tập trung sâu với Pomodoro</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Tập trung</div><div class="lz-t">25 phút, một việc</div><div class="lz-d">cất điện thoại, không tab thừa</div></div>
  <div class="lz-step"><div class="lz-k">Nghỉ</div><div class="lz-t">5 phút</div><div class="lz-d">đứng dậy, vươn vai</div></div>
  <div class="lz-step"><div class="lz-k">Lặp</div><div class="lz-t">nghỉ dài sau 4 lượt</div><div class="lz-d">tập trung bền vững</div></div>
</div>
<div class="callout ok">Trì hoãn thường đến từ việc cảm thấy quá lớn hoặc mơ hồ. Cách chữa: thu nhỏ nó — "viết đoạn mở bài", không phải "làm bài luận". Một bước kế tiếp nhỏ, rõ ràng thì dễ bắt đầu, và bắt đầu là 90% của trận chiến.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 3 — DÙNG AI CÓ ĐẠO ĐỨC ══════════════════ */
    {
      title: 'Advanced 3 — Using AI tools ethically|||Nâng cao 3 — Dùng công cụ AI có đạo đức',
      description: 'Ngoài giáo trình — bài tổng kết: AI hỗ trợ học mà không đạo văn hay lệ thuộc.',
      lessons: [
        {
          title: 'N3.1 — AI as a study partner, not a shortcut|||N3.1 — AI là bạn học, không phải lối tắt',
          slug: 'ssl101c-n3-1-ai-dao-duc',
          type: 'VIDEO',
          description: 'Dùng ChatGPT/AI để học thật, tránh đạo văn và mất kỹ năng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 3 · Lesson N3.1</span>
<h2>AI and academic integrity — the modern dilemma</h2>
<p class="lead">Tools like ChatGPT can explain, summarize and draft in seconds. Used well, AI is a powerful tutor. Used badly, it is plagiarism and it quietly erodes the very skills this course builds. This capstone ties integrity (Ch 5) and critical thinking (Ch 3) to today&#39;s reality.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">✅ Good uses — AI as a tutor</div><div class="lz-ld">Explain a concept another way, quiz you, check your grammar, suggest an essay outline, brainstorm angles — <em>then you do the thinking and writing</em>.</div></div>
  <div class="lz-layer"><div class="lz-lt">❌ Misuse — AI as a ghostwriter</div><div class="lz-ld">Submitting AI-generated text as your own is plagiarism, usually against the rules, and detectable. Worse, you learn nothing.</div></div>
</div>
<h3>Two dangers beyond getting caught</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Hallucination</div><div class="lz-t">AI invents facts &amp; fake sources</div><div class="lz-d">apply CRAAP &amp; verify (Ch 1)</div></div>
  <div class="lz-step"><div class="lz-k">Skill atrophy</div><div class="lz-t">outsource thinking → lose it</div><div class="lz-d">the skills stop growing</div></div>
</div>
<p>AI confidently produces wrong facts and non-existent citations. Everything it gives you must pass the same source-evaluation and critical-thinking tests as any other source. And if you let it do all the thinking, you never build the judgement you came to university for.</p>
<div class="callout ok">The honest test: does the tool help you <em>learn and produce your own work</em>, or does it produce the work <em>instead</em> of you? Always follow your course&#39;s AI policy, disclose AI use when required, and treat AI as a smart study partner — never as the author of your submission.</div>
<div class="note-ct">Congratulations on finishing SSL101c. You leave with the skills to find truth in a sea of information, solve messy problems, think for yourself, communicate with impact, and do it all with integrity — including alongside AI. These are the foundations of every course, and of a thoughtful professional life.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 3 · Bài N3.1</span>
<h2>AI và liêm chính học thuật — thế lưỡng nan hiện đại</h2>
<p class="lead">Công cụ như ChatGPT có thể giải thích, tóm tắt và soạn nháp trong vài giây. Dùng đúng, AI là một gia sư mạnh mẽ. Dùng sai, nó là đạo văn và âm thầm bào mòn chính những kỹ năng môn này xây. Bài tổng kết này nối liêm chính (Ch 5) và tư duy phản biện (Ch 3) với thực tế hôm nay.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">✅ Dùng tốt — AI như gia sư</div><div class="lz-ld">Giải thích một khái niệm theo cách khác, kiểm tra bạn, sửa ngữ pháp, gợi dàn ý bài luận, brainstorm góc nhìn — <em>rồi bạn tự tư duy và viết</em>.</div></div>
  <div class="lz-layer"><div class="lz-lt">❌ Lạm dụng — AI như người viết thuê</div><div class="lz-ld">Nộp văn bản do AI sinh như của mình là đạo văn, thường trái quy định, và phát hiện được. Tệ hơn, bạn không học được gì.</div></div>
</div>
<h3>Hai mối nguy ngoài việc bị bắt</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Ảo giác (hallucination)</div><div class="lz-t">AI bịa dữ kiện &amp; nguồn giả</div><div class="lz-d">áp CRAAP &amp; kiểm chứng (Ch 1)</div></div>
  <div class="lz-step"><div class="lz-k">Teo kỹ năng</div><div class="lz-t">giao tư duy ra ngoài → mất nó</div><div class="lz-d">kỹ năng ngừng lớn</div></div>
</div>
<p>AI tự tin sản xuất dữ kiện sai và trích dẫn không tồn tại. Mọi thứ nó cho bạn phải qua cùng các bài kiểm đánh giá nguồn và tư duy phản biện như bất kỳ nguồn nào khác. Và nếu bạn để nó tư duy hộ hết, bạn không bao giờ xây được khả năng phán đoán mà bạn tới đại học để có.</p>
<div class="callout ok">Bài kiểm trung thực: công cụ có giúp bạn <em>học và tạo ra công trình của chính mình</em> không, hay nó tạo công trình <em>thay</em> bạn? Luôn tuân theo chính sách AI của môn, khai báo việc dùng AI khi được yêu cầu, và coi AI như một bạn học thông minh — không bao giờ là tác giả của bài nộp.</div>
<div class="note-ct">Chúc mừng bạn hoàn thành SSL101c. Bạn rời đi với các kỹ năng để tìm sự thật trong biển thông tin, giải các vấn đề rối rắm, tự tư duy, giao tiếp có sức nặng, và làm tất cả với liêm chính — kể cả khi đi cùng AI. Đây là nền tảng của mọi môn học, và của một đời sống nghề nghiệp biết suy nghĩ.</div>
</div>
`,
        },
      ],
    },
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ FE (trắc nghiệm, máy chấm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "ssl101c-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "The CRAAP test is used to…|||Bài kiểm CRAAP được dùng để…",
                "options": [
                  "write faster|||viết nhanh hơn",
                  "evaluate whether a source is trustworthy|||đánh giá một nguồn có đáng tin không",
                  "format a document|||định dạng tài liệu",
                  "search Google|||tìm trên Google"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "The \"A\" for Authority in CRAAP asks…|||Chữ \"A\" Authority trong CRAAP hỏi…",
                "options": [
                  "how recent it is|||nó mới đến đâu",
                  "who wrote it and their credentials|||ai viết và trình độ của họ",
                  "how long it is|||nó dài bao nhiêu",
                  "what it costs|||nó giá bao nhiêu"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "A reference (citation) mainly serves to…|||Một trích dẫn chủ yếu phục vụ để…",
                "options": [
                  "make the paper longer|||làm bài dài hơn",
                  "give credit and let readers verify claims|||ghi công và cho người đọc kiểm chứng",
                  "hide your sources|||giấu nguồn của bạn",
                  "replace the conclusion|||thay phần kết luận"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "A tool like Zotero helps you…|||Một công cụ như Zotero giúp bạn…",
                "options": [
                  "write the essay for you|||viết bài luận hộ bạn",
                  "save sources and generate formatted citations|||lưu nguồn và tạo trích dẫn định dạng chuẩn",
                  "grade your work|||chấm bài bạn",
                  "search social media|||tìm mạng xã hội"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "The golden rule to avoid accidental plagiarism is…|||Quy tắc vàng để tránh đạo văn vô tình là…",
                "options": [
                  "never take notes|||không bao giờ ghi chép",
                  "record the source the moment you take a note|||ghi lại nguồn ngay khi ghi chép",
                  "copy everything exactly|||chép mọi thứ y hệt",
                  "avoid all references|||tránh mọi trích dẫn"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "An \"ill-defined\" problem is one that…|||Một vấn đề \"mơ hồ\" là vấn đề…",
                "options": [
                  "is stated clearly with a goal|||được phát biểu rõ với mục tiêu",
                  "is vague and needs clarifying before solving|||mơ hồ và cần làm rõ trước khi giải",
                  "has no solution|||không có lời giải",
                  "is from a textbook|||từ sách giáo khoa"
                ],
                "correctIndex": 1
              }
            ]
          }
        }
      ]
    },
  ],
};
