/**
 * SSG104 — Communication and In-Group Working Skills (Kỹ năng giao tiếp và cộng tác).
 * Kỳ 2. Bám syllabus FPTU (12 CLO) + tài liệu Business Communication / Working in Groups
 * + chương nâng cao. Song ngữ EN/VN realtime (khối .ml-en / .ml-vi, tiêu đề EN|||VI).
 * Sơ đồ .lz-map/.lz-flow/.lz-stack. Công cụ cộng tác → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/SSG104.mjs --apply
 */
export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'SSG104',
    slug: 'communication-and-in-group-working-skills',
    title: 'Communication and In-Group Working Skills',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The people skills that make or break a career: teamwork & group psychology, verbal & nonverbal communication, leadership, conflict management, persuasive presentations and business writing.|||Kỹ năng con người quyết định sự nghiệp: làm việc nhóm & tâm lý nhóm, giao tiếp lời & phi lời, lãnh đạo, quản lý xung đột, thuyết trình thuyết phục và viết văn bản công việc.',
    description: 'Môn kỹ năng mềm nền tảng về giao tiếp và làm việc nhóm. Học lý thuyết nhóm & tâm lý nhóm, giao tiếp hiệu quả, lãnh đạo, quản lý xung đột, thuyết trình thuyết phục và viết văn bản công việc. Nhiều bài tập nhóm và một dự án nhóm.',
    whatYouLearn: 'Phân biệt nhóm & đội, tâm lý nhóm & các giai đoạn phát triển; giao tiếp lời & phi lời, lắng nghe; lý thuyết lãnh đạo & quyền lực trong nhóm; nhận diện & quản lý xung đột; thuyết trình thuyết phục; viết email/thư/đề xuất/báo cáo; tổ chức cuộc họp; tư duy phản biện & sáng tạo; kỹ năng nghề nghiệp.',
    requirements: 'Không có môn tiên quyết. Sẵn sàng làm việc nhóm và thuyết trình — phần lớn điểm là hoạt động nhóm và dự án nhóm.',
    documentsNote: 'Tài liệu: Problem Solving in Teams and Groups (Cameron Piercy) · Business Communication for Success · Working in Groups (Pearson). Kèm file syllabus gốc SSG104.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, học ra sao, điều kiện qua môn và lộ trình.',
      lessons: [
        {
          title: '0.1 — About SSG104 & the course map|||0.1 — Giới thiệu SSG104 & bản đồ môn học',
          slug: 'ssg104-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Vì sao kỹ năng mềm quan trọng, và bản đồ toàn bộ môn học.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About SSG104 — Communication and In-Group Working Skills</h2>
<p class="lead">Technical skill gets you the job; <strong>people skills</strong> get you the career. SSG104 teaches the two abilities that every workplace demands and that separate good engineers from great ones: <strong>communicating clearly</strong> and <strong>working well in a team</strong>.</p>
<p>Software is built by teams, not lone geniuses. You will spend your career in group projects, meetings, presentations and written reports. This course gives you the theory and practice to thrive in all of them — from understanding group psychology to giving a persuasive presentation and managing conflict when it arises.</p>
<h3>Course map</h3>
<div class="lz-map">
  <div class="lz-stage">Working together</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Groups &amp; Teams</div><div class="lz-nsub">Group vs team · group psychology · stages</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Communication Skills</div><div class="lz-nsub">Verbal &amp; nonverbal · listening</div></div></div>
  <div class="lz-stage">Leading &amp; resolving</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Leadership</div><div class="lz-nsub">Theories · power in teams</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Conflict Management</div><div class="lz-nsub">Why conflict happens · resolving it</div></div></div>
  <div class="lz-stage">Communicating professionally</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Persuasive Presentations</div><div class="lz-nsub">Present with impact</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Business Writing &amp; Meetings</div><div class="lz-nsub">Email · report · running meetings</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Putting it together · career &amp; the group project</div><div class="lz-nsub">Applying every skill for real</div></div></div>
</div>
<p>SSG104 complements <span class="badge">SSL101c</span> (study skills) and prepares you for every group project ahead — <span class="badge">PRJ301</span>, <span class="badge">SWP391</span> and beyond. These skills matter in interviews, internships and your whole professional life.</p>
<div class="callout ok">Do not underestimate a "soft" subject. Technical brilliance is wasted if you cannot explain your idea, work with your team, or present your work convincingly. These skills often decide who gets promoted — and they are learned by practicing, not just reading.</div>
<a class="link-card exphub" href="/exp-hub/ssg104-cong-cu-hoc-tap?ref=%2Fcourses%2Fcommunication-and-in-group-working-skills%2Flearn&reflabel=SSG104%20%E2%80%94%20Communication%20and%20In-Group%20Working%20Skills" target="_blank" rel="noopener">
  <span class="lc-ico">🤝</span>
  <span class="lc-body"><span class="lc-title">Tools for SSG104 — teamwork, slides &amp; writing</span><span class="lc-sub">Free tools for group work, presentations and reports — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu SSG104 — Kỹ năng giao tiếp và cộng tác</h2>
<p class="lead">Kỹ năng kỹ thuật giúp bạn có việc; <strong>kỹ năng con người</strong> giúp bạn có sự nghiệp. SSG104 dạy hai khả năng mà mọi nơi làm việc đòi hỏi và phân biệt kỹ sư giỏi với kỹ sư xuất sắc: <strong>giao tiếp rõ ràng</strong> và <strong>làm việc nhóm tốt</strong>.</p>
<p>Phần mềm được xây bởi các đội, không phải thiên tài đơn độc. Bạn sẽ dành cả sự nghiệp trong các dự án nhóm, cuộc họp, thuyết trình và báo cáo. Môn này cho bạn lý thuyết và thực hành để phát triển trong tất cả — từ hiểu tâm lý nhóm tới thuyết trình thuyết phục và quản lý xung đột khi nó phát sinh.</p>
<h3>Bản đồ môn học</h3>
<div class="lz-map">
  <div class="lz-stage">Làm việc cùng nhau</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Nhóm &amp; Đội</div><div class="lz-nsub">Nhóm vs đội · tâm lý nhóm · giai đoạn</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Kỹ năng giao tiếp</div><div class="lz-nsub">Lời &amp; phi lời · lắng nghe</div></div></div>
  <div class="lz-stage">Lãnh đạo &amp; giải quyết</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Lãnh đạo</div><div class="lz-nsub">Lý thuyết · quyền lực trong nhóm</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Quản lý xung đột</div><div class="lz-nsub">Vì sao có xung đột · giải quyết</div></div></div>
  <div class="lz-stage">Giao tiếp chuyên nghiệp</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Thuyết trình thuyết phục</div><div class="lz-nsub">Trình bày có sức nặng</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Viết công việc &amp; Họp</div><div class="lz-nsub">Email · báo cáo · điều hành họp</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Ghép lại · nghề nghiệp &amp; dự án nhóm</div><div class="lz-nsub">Áp dụng mọi kỹ năng thực tế</div></div></div>
</div>
<p>SSG104 bổ trợ <span class="badge">SSL101c</span> (kỹ năng học) và chuẩn bị cho mọi dự án nhóm phía trước — <span class="badge">PRJ301</span>, <span class="badge">SWP391</span> và xa hơn. Các kỹ năng này quan trọng trong phỏng vấn, thực tập và cả đời làm nghề.</p>
<div class="callout ok">Đừng đánh giá thấp một môn "mềm". Tài năng kỹ thuật vô ích nếu bạn không giải thích được ý tưởng, không làm việc được với đội, hay không trình bày công việc một cách thuyết phục. Các kỹ năng này thường quyết định ai được thăng tiến — và học bằng thực hành, không chỉ đọc.</div>
<a class="link-card exphub" href="/exp-hub/ssg104-cong-cu-hoc-tap?ref=%2Fcourses%2Fcommunication-and-in-group-working-skills%2Flearn&reflabel=SSG104%20%E2%80%94%20Communication%20and%20In-Group%20Working%20Skills" target="_blank" rel="noopener">
  <span class="lc-ico">🤝</span>
  <span class="lc-body"><span class="lc-title">Công cụ cho SSG104 — cộng tác, slide &amp; viết</span><span class="lc-sub">Công cụ miễn phí cho làm nhóm, thuyết trình và báo cáo — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — How the course is graded|||0.2 — Cách tính điểm & qua môn',
          slug: 'ssg104-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Hoạt động, bài tập nhóm, dự án nhóm và điều kiện qua môn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>How SSG104 is graded</h2>
<p class="lead">From the official SSG104 syllabus. This is an almost entirely <strong>on-going</strong> course — 80% is activities, group work and a project done through the term. Participation is everything.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class + exam + 104.5h self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of slots</span></div>
</div>
<h3>Grade structure</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Activity</td><td>15%</td><td>3 in-class activities (5% each)</td></tr>
    <tr><td>Group Assignment</td><td>20%</td><td>2 assignments (10% each)</td></tr>
    <tr><td>Group Project</td><td>30%</td><td>3 parts: proposal, product, presentation/report (10% each)</td></tr>
    <tr><td>Participation</td><td>10%</td><td>Engagement throughout the term</td></tr>
    <tr><td>Quiz</td><td>5%</td><td>One short quiz on concepts</td></tr>
    <tr><td>Final Exam</td><td>20%</td><td>30 min — must score ≥ 4 to pass</td></tr>
  </tbody>
</table>
<div class="callout warn">Two gates: weighted average ≥ 5.0 AND the final ≥ 4.0. With 80% on-going and much of it group-based, <strong>showing up and contributing to your team is the grade.</strong> Do your share of every group task — your teammates and your marks depend on it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cách tính điểm SSG104</h2>
<p class="lead">Từ syllabus chính thức SSG104. Đây gần như hoàn toàn là môn <strong>quá trình</strong> — 80% là hoạt động, làm nhóm và một dự án làm suốt kỳ. Tham gia là tất cả.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h học + thi + 104.5h tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% số buổi</span></div>
</div>
<h3>Cấu trúc điểm</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Hoạt động (Activity)</td><td>15%</td><td>3 hoạt động trên lớp (5% mỗi cái)</td></tr>
    <tr><td>Bài tập nhóm</td><td>20%</td><td>2 bài (10% mỗi cái)</td></tr>
    <tr><td>Dự án nhóm</td><td>30%</td><td>3 phần: đề xuất, sản phẩm, thuyết trình/báo cáo (10% mỗi phần)</td></tr>
    <tr><td>Tham gia (Participation)</td><td>10%</td><td>Tích cực suốt kỳ</td></tr>
    <tr><td>Quiz</td><td>5%</td><td>Một quiz ngắn về khái niệm</td></tr>
    <tr><td>Thi cuối kỳ</td><td>20%</td><td>30 phút — phải đạt ≥ 4 mới qua môn</td></tr>
  </tbody>
</table>
<div class="callout warn">Hai cửa: trung bình có trọng số ≥ 5.0 VÀ thi cuối ≥ 4.0. Với 80% là quá trình và phần lớn dựa vào nhóm, <strong>đi học và đóng góp cho đội chính là điểm.</strong> Làm phần của mình trong mọi việc nhóm — bạn cùng nhóm và điểm của bạn phụ thuộc vào đó.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning outcomes (CLOs)|||0.3 — Chuẩn đầu ra (CLO)',
          slug: 'ssg104-chuan-dau-ra',
          type: 'VIDEO',
          description: 'Các kỹ năng nhà trường cam kết bạn phát triển được.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The Course Learning Outcomes (CLOs)</h2>
<p class="lead">Each CLO is a people skill you develop and demonstrate — mostly through group work and presentations. They map onto the chapters.</p>
<table>
  <thead><tr><th>#</th><th>You will be able to…</th><th>Covered in</th></tr></thead>
  <tbody>
    <tr><td>CLO1–2</td><td>Understand teamwork, communication &amp; group psychology</td><td>Chapter 1</td></tr>
    <tr><td>CLO8</td><td>Apply verbal &amp; nonverbal communication in teams</td><td>Chapter 2</td></tr>
    <tr><td>CLO5–6</td><td>Analyse effective leaders &amp; leadership theories</td><td>Chapter 3</td></tr>
    <tr><td>CLO7</td><td>Understand &amp; manage conflict in groups</td><td>Chapter 4</td></tr>
    <tr><td>CLO9</td><td>Present a persuasive message professionally</td><td>Chapter 5</td></tr>
    <tr><td>CLO4, CLO10</td><td>Apply business writing; organize a meeting</td><td>Chapter 6</td></tr>
    <tr><td>CLO3, CLO11–12</td><td>Critical/creative thinking; career skills; apply it all</td><td>Advanced + Project</td></tr>
  </tbody>
</table>
<div class="note-ct">Almost every CLO is "apply" or "demonstrate" — you prove them by doing, in the group project and presentations. Read the concepts here, then practice them with your team.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">Mỗi CLO là một kỹ năng con người bạn phát triển và thể hiện — chủ yếu qua làm nhóm và thuyết trình. Chúng khớp với các chương.</p>
<table>
  <thead><tr><th>#</th><th>Bạn sẽ làm được…</th><th>Học ở</th></tr></thead>
  <tbody>
    <tr><td>CLO1–2</td><td>Hiểu làm việc nhóm, giao tiếp &amp; tâm lý nhóm</td><td>Chương 1</td></tr>
    <tr><td>CLO8</td><td>Áp dụng giao tiếp lời &amp; phi lời trong nhóm</td><td>Chương 2</td></tr>
    <tr><td>CLO5–6</td><td>Phân tích lãnh đạo hiệu quả &amp; lý thuyết lãnh đạo</td><td>Chương 3</td></tr>
    <tr><td>CLO7</td><td>Hiểu &amp; quản lý xung đột trong nhóm</td><td>Chương 4</td></tr>
    <tr><td>CLO9</td><td>Trình bày một thông điệp thuyết phục chuyên nghiệp</td><td>Chương 5</td></tr>
    <tr><td>CLO4, CLO10</td><td>Áp dụng viết công việc; tổ chức một cuộc họp</td><td>Chương 6</td></tr>
    <tr><td>CLO3, CLO11–12</td><td>Tư duy phản biện/sáng tạo; kỹ năng nghề; áp dụng tất cả</td><td>Nâng cao + Dự án</td></tr>
  </tbody>
</table>
<div class="note-ct">Gần như mọi CLO là "áp dụng" hoặc "thể hiện" — bạn chứng minh chúng bằng cách làm, trong dự án nhóm và thuyết trình. Đọc khái niệm ở đây, rồi thực hành với đội.</div>
</div>
`,
        },
        {
          title: '0.4 — Materials & how to study|||0.4 — Tài liệu & cách học',
          slug: 'ssg104-tai-lieu',
          type: 'VIDEO',
          description: 'Tài liệu, công cụ cộng tác và cách tận dụng làm việc nhóm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials &amp; how to study</h2>
<h3>Materials</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Problem Solving in Teams and Groups — Cameron Piercy</div><div class="lz-ld">Open textbook on how groups work and solve problems together.</div></div>
  <div class="lz-layer"><div class="lz-lt">Business Communication for Success</div><div class="lz-ld">Practical guide to professional writing and speaking.</div></div>
  <div class="lz-layer"><div class="lz-lt">Working in Groups (Pearson)</div><div class="lz-ld">The theory of teams, leadership and conflict.</div></div>
</div>
<h3>Tools that help teamwork</h3>
<ul>
  <li><strong>Trello / a shared task board</strong> — divide group work and track who does what.</li>
  <li><strong>Google Slides / Canva</strong> — build presentations together, in real time.</li>
  <li><strong>Grammarly</strong> — polish business emails and reports.</li>
</ul>
<h3>How to get the most from this course</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Learn</div><div class="lz-t">the concept</div><div class="lz-d">read the chapter</div></div>
  <div class="lz-step"><div class="lz-k">Practice</div><div class="lz-t">in your group</div><div class="lz-d">the real learning</div></div>
  <div class="lz-step"><div class="lz-k">Reflect</div><div class="lz-t">what worked?</div><div class="lz-d">improve next time</div></div>
</div>
<div class="callout ok">This is the rare course where the "homework" is genuinely fun and useful: you learn by collaborating, presenting and giving feedback. Lean into the group work — the skills you build here you will use in every job, forever.</div>
<a class="link-card exphub" href="/exp-hub/ssg104-cong-cu-hoc-tap?ref=%2Fcourses%2Fcommunication-and-in-group-working-skills%2Flearn&reflabel=SSG104%20%E2%80%94%20Communication%20and%20In-Group%20Working%20Skills" target="_blank" rel="noopener">
  <span class="lc-ico">🤝</span>
  <span class="lc-body"><span class="lc-title">Trello, Canva &amp; collaboration tools</span><span class="lc-sub">Free tools for group projects, slides and reports.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu &amp; cách học</h2>
<h3>Tài liệu</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Problem Solving in Teams and Groups — Cameron Piercy</div><div class="lz-ld">Giáo trình mở về cách nhóm hoạt động và giải quyết vấn đề cùng nhau.</div></div>
  <div class="lz-layer"><div class="lz-lt">Business Communication for Success</div><div class="lz-ld">Hướng dẫn thực hành viết và nói chuyên nghiệp.</div></div>
  <div class="lz-layer"><div class="lz-lt">Working in Groups (Pearson)</div><div class="lz-ld">Lý thuyết về đội, lãnh đạo và xung đột.</div></div>
</div>
<h3>Công cụ hỗ trợ làm nhóm</h3>
<ul>
  <li><strong>Trello / bảng công việc chung</strong> — chia việc nhóm và theo dõi ai làm gì.</li>
  <li><strong>Google Slides / Canva</strong> — dựng thuyết trình cùng nhau, thời gian thực.</li>
  <li><strong>Grammarly</strong> — trau chuốt email và báo cáo công việc.</li>
</ul>
<h3>Cách tận dụng tối đa môn này</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Học</div><div class="lz-t">khái niệm</div><div class="lz-d">đọc chương</div></div>
  <div class="lz-step"><div class="lz-k">Thực hành</div><div class="lz-t">trong nhóm</div><div class="lz-d">nơi học thật sự</div></div>
  <div class="lz-step"><div class="lz-k">Ngẫm</div><div class="lz-t">cái gì hiệu quả?</div><div class="lz-d">cải thiện lần sau</div></div>
</div>
<div class="callout ok">Đây là môn hiếm hoi mà "bài tập" thật sự vui và hữu ích: bạn học bằng cộng tác, thuyết trình và góp ý. Hãy dấn thân vào việc nhóm — các kỹ năng xây ở đây bạn dùng trong mọi công việc, mãi mãi.</div>
<a class="link-card exphub" href="/exp-hub/ssg104-cong-cu-hoc-tap?ref=%2Fcourses%2Fcommunication-and-in-group-working-skills%2Flearn&reflabel=SSG104%20%E2%80%94%20Communication%20and%20In-Group%20Working%20Skills" target="_blank" rel="noopener">
  <span class="lc-ico">🤝</span>
  <span class="lc-body"><span class="lc-title">Trello, Canva &amp; công cụ cộng tác</span><span class="lc-sub">Công cụ miễn phí cho dự án nhóm, slide và báo cáo.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — NHÓM & ĐỘI ══════════════════ */
    {
      title: 'Chapter 1 — Groups & Teams|||Chương 1 — Nhóm & Đội',
      description: 'Phân biệt nhóm và đội, tâm lý nhóm và các giai đoạn phát triển.',
      lessons: [
        {
          title: '1.1 — Group vs team & how teams form|||1.1 — Nhóm vs đội & cách đội hình thành',
          slug: 'ssg104-1-1-nhom-doi',
          type: 'VIDEO',
          description: 'Khác biệt nhóm/đội và bốn giai đoạn phát triển của một đội.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>A group is not a team</h2>
<p class="lead">People often use "group" and "team" interchangeably, but they differ (CLO1). A <strong>group</strong> is people who happen to be together; a <strong>team</strong> is people working toward a <em>shared goal</em>, with complementary roles and mutual accountability. Turning a group into a team is the heart of this course.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Group</div><div class="lz-ld">Individuals sharing a space or category. Each works on their own; success is individual.</div></div>
  <div class="lz-layer"><div class="lz-lt">Team</div><div class="lz-ld">Members with a common goal, interdependent roles, and shared responsibility for the result.</div></div>
</div>
<h3>How teams develop — Tuckman&#39;s stages</h3>
<p>Teams do not become effective instantly (CLO2). They typically pass through predictable stages:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Forming</div><div class="lz-t">polite, uncertain</div><div class="lz-d">getting to know each other</div></div>
  <div class="lz-step"><div class="lz-k">Storming</div><div class="lz-t">conflict emerges</div><div class="lz-d">differing ideas &amp; roles clash</div></div>
  <div class="lz-step"><div class="lz-k">Norming</div><div class="lz-t">agree on norms</div><div class="lz-d">roles settle, trust grows</div></div>
  <div class="lz-step"><div class="lz-k">Performing</div><div class="lz-t">high productivity</div><div class="lz-d">the team clicks</div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Psychological safety beats talent.</b> Google&#39;s Project Aristotle studied 180+ teams and found the top predictor of a high-performing team was not who was on it, but <em>psychological safety</em> — members feeling safe to speak up, ask questions and admit mistakes without being punished. A team of average people who feel safe will outperform a team of stars who do not. <em>The syllabus lists Tuckman&#39;s stages but not what actually makes the &quot;performing&quot; stage possible.</em></div>
<div class="callout ok">Knowing these stages is powerful: when your group project hits the "storming" phase and everyone disagrees, that is normal — not failure. Push through it (with the conflict skills of Chapter 4) and you reach "performing." Every strong team went through storming first.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Nhóm không phải là đội</h2>
<p class="lead">Người ta thường dùng "nhóm" và "đội" như nhau, nhưng chúng khác (CLO1). Một <strong>nhóm (group)</strong> là những người tình cờ ở cùng nhau; một <strong>đội (team)</strong> là những người làm việc hướng tới một <em>mục tiêu chung</em>, với vai trò bổ trợ và trách nhiệm chung. Biến một nhóm thành một đội là trái tim của môn này.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Nhóm</div><div class="lz-ld">Các cá nhân chia sẻ một không gian hay phân loại. Mỗi người làm việc riêng; thành công là cá nhân.</div></div>
  <div class="lz-layer"><div class="lz-lt">Đội</div><div class="lz-ld">Thành viên có mục tiêu chung, vai trò phụ thuộc lẫn nhau, và trách nhiệm chung cho kết quả.</div></div>
</div>
<h3>Đội phát triển thế nào — các giai đoạn Tuckman</h3>
<p>Đội không trở nên hiệu quả ngay (CLO2). Chúng thường đi qua các giai đoạn dự đoán được:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Hình thành</div><div class="lz-t">lịch sự, chưa chắc</div><div class="lz-d">làm quen nhau</div></div>
  <div class="lz-step"><div class="lz-k">Bão tố</div><div class="lz-t">xung đột nổi lên</div><div class="lz-d">ý tưởng &amp; vai trò va nhau</div></div>
  <div class="lz-step"><div class="lz-k">Chuẩn hoá</div><div class="lz-t">thống nhất quy tắc</div><div class="lz-d">vai trò ổn định, tin tưởng lớn lên</div></div>
  <div class="lz-step"><div class="lz-k">Hoạt động</div><div class="lz-t">năng suất cao</div><div class="lz-d">đội ăn ý</div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>An toàn tâm lý thắng tài năng.</b> Dự án Aristotle của Google nghiên cứu hơn 180 đội và phát hiện yếu tố dự báo hàng đầu của một đội hiệu suất cao không phải là ai trong đội, mà là <em>an toàn tâm lý</em> — thành viên cảm thấy an toàn để lên tiếng, đặt câu hỏi và thừa nhận sai lầm mà không bị trừng phạt. Một đội người bình thường thấy an toàn sẽ thắng một đội ngôi sao không dám nói. <em>Syllabus liệt kê các giai đoạn Tuckman nhưng không nói điều gì thực sự làm cho giai đoạn &quot;hoạt động&quot; khả thi.</em></div>
<div class="callout ok">Biết các giai đoạn này rất hữu ích: khi dự án nhóm của bạn tới pha "bão tố" và ai cũng bất đồng, đó là bình thường — không phải thất bại. Vượt qua nó (với kỹ năng xung đột ở Chương 4) và bạn tới "hoạt động". Mọi đội mạnh đều đi qua bão tố trước.</div>
</div>
`,
        },
        {
          title: 'Chapter 1 Quiz|||Quiz chương 1',
          slug: 'ssg104-quiz-ch1',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: nhóm vs đội, các giai đoạn Tuckman.',
          quiz: {
            timeLimitSeconds: 240,
            questions: [
              { question: 'The key difference between a group and a team is…|||Khác biệt then chốt giữa nhóm và đội là…', options: ['size|||kích thước', 'a team shares a common goal with interdependent roles|||đội có mục tiêu chung với vai trò phụ thuộc lẫn nhau', 'a group is bigger|||nhóm lớn hơn', 'there is no difference|||không có khác biệt'], correctIndex: 1, points: 1 },
              { question: 'The correct order of Tuckman\'s stages is…|||Thứ tự đúng các giai đoạn Tuckman là…', options: ['Storming → Forming → Norming → Performing', 'Forming → Storming → Norming → Performing', 'Norming → Forming → Storming → Performing', 'Performing → Forming → Storming → Norming'], correctIndex: 1, points: 1 },
              { question: 'In which stage does conflict typically emerge?|||Xung đột thường nổi lên ở giai đoạn nào?', options: ['Forming|||Hình thành', 'Storming|||Bão tố', 'Norming|||Chuẩn hoá', 'Performing|||Hoạt động'], correctIndex: 1, points: 1 },
              { question: 'When your team hits the storming stage, you should…|||Khi đội bạn tới giai đoạn bão tố, bạn nên…', options: ['give up — it failed|||bỏ cuộc — đội hỏng', 'recognize it as normal and work through it|||nhận ra đó là bình thường và vượt qua', 'remove all members|||loại mọi thành viên', 'skip to performing|||nhảy tới hoạt động'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — KỸ NĂNG GIAO TIẾP ══════════════════ */
    {
      title: 'Chapter 2 — Communication Skills|||Chương 2 — Kỹ năng giao tiếp',
      description: 'Giao tiếp lời & phi lời và nghệ thuật lắng nghe chủ động.',
      lessons: [
        {
          title: '2.1 — Verbal, nonverbal & listening|||2.1 — Lời, phi lời & lắng nghe',
          slug: 'ssg104-2-1-giao-tiep',
          type: 'VIDEO',
          description: 'Thông điệp không chỉ là lời nói; và lắng nghe chủ động là kỹ năng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Communication is more than words</h2>
<p class="lead">Effective communication (CLO8) has two channels: <strong>verbal</strong> (the words) and <strong>nonverbal</strong> (tone, body language, facial expression). Famously, much of a message&#39;s impact comes from <em>how</em> you say it, not just what you say.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Verbal</div><div class="lz-ld">The actual words. Be clear, concise, and appropriate to your audience (as in SSL101c).</div></div>
  <div class="lz-layer"><div class="lz-lt">Nonverbal</div><div class="lz-ld">Tone of voice, eye contact, posture, gestures, facial expression. Often speaks louder than words — and reveals confidence or nervousness.</div></div>
</div>
<h3>Active listening — the underrated half</h3>
<p>Communication is two-way. <strong>Active listening</strong> means fully focusing on the speaker, not just waiting to talk. It builds trust and prevents misunderstandings — a superpower in teamwork.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Focus</div><div class="lz-t">give full attention</div><div class="lz-d">phone down, eyes up</div></div>
  <div class="lz-step"><div class="lz-k">Reflect</div><div class="lz-t">paraphrase back</div><div class="lz-d">"so you mean…?"</div></div>
  <div class="lz-step"><div class="lz-k">Clarify</div><div class="lz-t">ask questions</div><div class="lz-d">confirm understanding</div></div>
</div>
<div class="pitfall">Communication barriers derail teams: assuming instead of asking, distractions, jargon the other person does not know, or letting emotions hijack the message. Naming a barrier is the first step to removing it.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The &quot;7-38-55 rule&quot; is real — but misused.</b> Albert Mehrabian&#39;s famous figures (7% words, 38% tone, 55% body language) apply <em>only</em> to communicating feelings and attitudes when the words contradict the tone — not to messages in general. Concluding &quot;words barely matter&quot; is wrong. The real lesson: when your verbal and nonverbal signals clash, people believe the nonverbal one. <em>Textbooks quote the numbers as a universal law; knowing their narrow scope stops you misapplying them.</em></div>
<div class="note-ct">In a team, most problems are really <em>communication</em> problems. Saying clearly what you mean, and truly listening to teammates, prevents the misunderstandings that cause missed deadlines and conflict (Chapter 4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Giao tiếp không chỉ là lời nói</h2>
<p class="lead">Giao tiếp hiệu quả (CLO8) có hai kênh: <strong>lời (verbal)</strong> (từ ngữ) và <strong>phi lời (nonverbal)</strong> (giọng điệu, ngôn ngữ cơ thể, nét mặt). Nổi tiếng là phần lớn tác động của một thông điệp đến từ <em>cách</em> bạn nói, không chỉ điều bạn nói.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Lời (verbal)</div><div class="lz-ld">Từ ngữ thực tế. Rõ ràng, súc tích, và phù hợp người nghe (như SSL101c).</div></div>
  <div class="lz-layer"><div class="lz-lt">Phi lời (nonverbal)</div><div class="lz-ld">Giọng điệu, giao tiếp mắt, tư thế, cử chỉ, nét mặt. Thường nói to hơn lời — và tiết lộ sự tự tin hay lo lắng.</div></div>
</div>
<h3>Lắng nghe chủ động — nửa bị đánh giá thấp</h3>
<p>Giao tiếp là hai chiều. <strong>Lắng nghe chủ động (active listening)</strong> nghĩa là tập trung hoàn toàn vào người nói, không chỉ chờ tới lượt nói. Nó xây dựng tin tưởng và ngăn hiểu lầm — một siêu năng lực trong làm việc nhóm.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Tập trung</div><div class="lz-t">dồn hết chú ý</div><div class="lz-d">cất điện thoại, ngước mắt lên</div></div>
  <div class="lz-step"><div class="lz-k">Phản hồi</div><div class="lz-t">diễn giải lại</div><div class="lz-d">"vậy ý bạn là…?"</div></div>
  <div class="lz-step"><div class="lz-k">Làm rõ</div><div class="lz-t">đặt câu hỏi</div><div class="lz-d">xác nhận đã hiểu</div></div>
</div>
<div class="pitfall">Rào cản giao tiếp làm hỏng đội: giả định thay vì hỏi, xao nhãng, thuật ngữ người kia không biết, hoặc để cảm xúc chiếm lấy thông điệp. Gọi tên một rào cản là bước đầu để gỡ nó.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>&quot;Quy tắc 7-38-55&quot; có thật — nhưng bị dùng sai.</b> Các con số nổi tiếng của Albert Mehrabian (7% từ ngữ, 38% giọng điệu, 55% ngôn ngữ cơ thể) chỉ áp dụng khi truyền đạt cảm xúc và thái độ mà lời nói mâu thuẫn với giọng điệu — không phải cho mọi thông điệp. Kết luận &quot;từ ngữ gần như vô nghĩa&quot; là sai. Bài học thật: khi tín hiệu lời và phi lời của bạn xung khắc, người ta tin cái phi lời. <em>Giáo trình trích các con số như một định luật phổ quát; hiểu phạm vi hẹp của chúng giúp bạn không áp dụng sai.</em></div>
<div class="note-ct">Trong một đội, phần lớn vấn đề thực ra là vấn đề <em>giao tiếp</em>. Nói rõ điều bạn muốn, và thực sự lắng nghe đồng đội, ngăn các hiểu lầm gây trễ hạn và xung đột (Chương 4).</div>
</div>
`,
        },
        {
          title: 'Chapter 2 Quiz|||Quiz chương 2',
          slug: 'ssg104-quiz-ch2',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: lời vs phi lời, lắng nghe chủ động, rào cản.',
          quiz: {
            timeLimitSeconds: 240,
            questions: [
              { question: 'Nonverbal communication includes…|||Giao tiếp phi lời gồm…', options: ['the exact words|||từ ngữ chính xác', 'tone, body language, facial expression|||giọng điệu, ngôn ngữ cơ thể, nét mặt', 'email text|||văn bản email', 'a written report|||một báo cáo viết'], correctIndex: 1, points: 1 },
              { question: 'Active listening means…|||Lắng nghe chủ động nghĩa là…', options: ['waiting for your turn to talk|||chờ tới lượt nói', 'fully focusing on the speaker and reflecting back|||tập trung hoàn toàn vào người nói và phản hồi lại', 'interrupting to correct them|||ngắt lời để sửa họ', 'multitasking|||làm nhiều việc cùng lúc'], correctIndex: 1, points: 1 },
              { question: 'A common communication barrier is…|||Một rào cản giao tiếp phổ biến là…', options: ['listening carefully|||lắng nghe cẩn thận', 'assuming instead of asking|||giả định thay vì hỏi', 'clear wording|||dùng từ rõ ràng', 'eye contact|||giao tiếp mắt'], correctIndex: 1, points: 1 },
              { question: 'Most team problems are actually…|||Phần lớn vấn đề của đội thực ra là…', options: ['communication problems|||vấn đề giao tiếp', 'technical bugs|||lỗi kỹ thuật', 'budget issues|||vấn đề ngân sách', 'hardware failures|||hỏng phần cứng'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — LÃNH ĐẠO ══════════════════ */
    {
      title: 'Chapter 3 — Leadership|||Chương 3 — Lãnh đạo',
      description: 'Lý thuyết lãnh đạo, phong cách và quyền lực trong nhóm.',
      lessons: [
        {
          title: '3.1 — Leadership styles & power in teams|||3.1 — Phong cách lãnh đạo & quyền lực trong nhóm',
          slug: 'ssg104-3-1-lanh-dao',
          type: 'VIDEO',
          description: 'Các phong cách lãnh đạo và các loại quyền lực trong một đội.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>What makes an effective leader?</h2>
<p class="lead">Leadership (CLO5, CLO6) is not a title — it is the ability to guide a team toward a goal. There is no single "best" style; effective leaders adapt to the situation and the people.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Autocratic</div><div class="lz-ld">The leader decides alone. Fast, useful in a crisis — but demotivating if overused.</div></div>
  <div class="lz-layer"><div class="lz-lt">Democratic</div><div class="lz-ld">The leader involves the team in decisions. Builds buy-in and better ideas — but slower.</div></div>
  <div class="lz-layer"><div class="lz-lt">Laissez-faire</div><div class="lz-ld">The leader gives freedom, minimal direction. Great for skilled, self-driven teams; risky for beginners.</div></div>
</div>
<h3>Power in teams</h3>
<p>Leaders (and members) have different <strong>sources of power</strong>. Recognizing them helps you understand team dynamics:</p>
<table>
  <thead><tr><th>Type of power</th><th>Comes from</th></tr></thead>
  <tbody>
    <tr><td>Legitimate</td><td>An official position/role</td></tr>
    <tr><td>Expert</td><td>Knowledge &amp; skill others need</td></tr>
    <tr><td>Referent</td><td>Being respected &amp; liked (charisma)</td></tr>
    <tr><td>Reward / Coercive</td><td>Ability to give rewards or penalties</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Match your style to the person, not your preference.</b> Hersey and Blanchard&#39;s <em>Situational Leadership</em> model says the best style depends on a follower&#39;s competence and commitment for a given task: direct a nervous beginner, coach a learner, support a capable-but-unsure member, and delegate to an expert. Great leaders switch styles within one team, sometimes within one hour. <em>The syllabus lists fixed styles (autocratic/democratic/laissez-faire) as if you pick one; real leadership is fluid and person-specific.</em></div>
<div class="callout ok">The most respected leaders rely on <strong>expert</strong> and <strong>referent</strong> power — earned through competence and trust — rather than just position or coercion. In a student group project, the real leader is often whoever the team trusts, not whoever was assigned the role.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Điều gì làm nên một lãnh đạo hiệu quả?</h2>
<p class="lead">Lãnh đạo (CLO5, CLO6) không phải một chức danh — mà là khả năng dẫn dắt một đội tới mục tiêu. Không có phong cách "tốt nhất" duy nhất; lãnh đạo hiệu quả thích nghi với tình huống và con người.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Độc đoán (autocratic)</div><div class="lz-ld">Lãnh đạo tự quyết một mình. Nhanh, hữu ích khi khủng hoảng — nhưng làm mất động lực nếu lạm dụng.</div></div>
  <div class="lz-layer"><div class="lz-lt">Dân chủ (democratic)</div><div class="lz-ld">Lãnh đạo lôi kéo đội vào quyết định. Xây sự đồng thuận và ý tưởng tốt hơn — nhưng chậm hơn.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thả lỏng (laissez-faire)</div><div class="lz-ld">Lãnh đạo cho tự do, ít chỉ đạo. Tuyệt cho đội giỏi, tự thân vận động; rủi ro với người mới.</div></div>
</div>
<h3>Quyền lực trong nhóm</h3>
<p>Lãnh đạo (và thành viên) có các <strong>nguồn quyền lực</strong> khác nhau. Nhận ra chúng giúp bạn hiểu động lực nhóm:</p>
<table>
  <thead><tr><th>Loại quyền lực</th><th>Đến từ</th></tr></thead>
  <tbody>
    <tr><td>Chính danh</td><td>Một vị trí/vai trò chính thức</td></tr>
    <tr><td>Chuyên môn</td><td>Kiến thức &amp; kỹ năng người khác cần</td></tr>
    <tr><td>Tham chiếu</td><td>Được tôn trọng &amp; yêu mến (sức hút)</td></tr>
    <tr><td>Thưởng / Cưỡng chế</td><td>Khả năng cho thưởng hoặc phạt</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chọn phong cách theo người, không theo sở thích của bạn.</b> Mô hình <em>Lãnh đạo tình huống</em> của Hersey và Blanchard nói phong cách tốt nhất tuỳ vào năng lực và cam kết của người theo với một nhiệm vụ cụ thể: chỉ dẫn người mới đang lo lắng, kèm cặp người đang học, hỗ trợ người có khả năng nhưng chưa chắc, và uỷ quyền cho chuyên gia. Lãnh đạo giỏi đổi phong cách trong cùng một đội, đôi khi trong cùng một giờ. <em>Syllabus liệt kê các phong cách cố định (độc đoán/dân chủ/thả lỏng) như thể bạn chọn một; lãnh đạo thật thì linh hoạt và tuỳ từng người.</em></div>
<div class="callout ok">Các lãnh đạo được tôn trọng nhất dựa vào quyền lực <strong>chuyên môn</strong> và <strong>tham chiếu</strong> — giành được qua năng lực và tin tưởng — hơn là chỉ vị trí hay cưỡng chế. Trong một dự án nhóm sinh viên, lãnh đạo thật thường là người đội tin tưởng, không phải người được giao vai trò.</div>
</div>
`,
        },
        {
          title: 'Chapter 3 Quiz|||Quiz chương 3',
          slug: 'ssg104-quiz-ch3',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: phong cách lãnh đạo, các nguồn quyền lực.',
          quiz: {
            timeLimitSeconds: 240,
            questions: [
              { question: 'Which leadership style involves the team in decisions?|||Phong cách lãnh đạo nào lôi kéo đội vào quyết định?', options: ['Autocratic|||Độc đoán', 'Democratic|||Dân chủ', 'Laissez-faire|||Thả lỏng', 'None|||Không cái nào'], correctIndex: 1, points: 1 },
              { question: 'There is… single best leadership style.|||Có… một phong cách lãnh đạo tốt nhất duy nhất.', options: ['one|||một', 'no (leaders adapt to the situation)|||không (lãnh đạo thích nghi tình huống)', 'always autocratic|||luôn là độc đoán', 'always laissez-faire|||luôn là thả lỏng'], correctIndex: 1, points: 1 },
              { question: 'Power that comes from knowledge and skill is…|||Quyền lực đến từ kiến thức và kỹ năng là…', options: ['legitimate power|||quyền lực chính danh', 'expert power|||quyền lực chuyên môn', 'coercive power|||quyền lực cưỡng chế', 'reward power|||quyền lực thưởng'], correctIndex: 1, points: 1 },
              { question: 'The most respected leaders tend to rely on…|||Các lãnh đạo được tôn trọng nhất thường dựa vào…', options: ['coercion and position only|||chỉ cưỡng chế và vị trí', 'expert and referent power|||quyền lực chuyên môn và tham chiếu', 'punishments|||hình phạt', 'their title alone|||chỉ chức danh'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — QUẢN LÝ XUNG ĐỘT ══════════════════ */
    {
      title: 'Chapter 4 — Conflict Management|||Chương 4 — Quản lý xung đột',
      description: 'Xung đột phát sinh ra sao và các phong cách giải quyết.',
      lessons: [
        {
          title: '4.1 — Understanding & resolving conflict|||4.1 — Hiểu & giải quyết xung đột',
          slug: 'ssg104-4-1-xung-dot',
          type: 'VIDEO',
          description: 'Nguồn gốc xung đột và năm phong cách xử lý (Thomas-Kilmann).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Conflict is normal — and can be useful</h2>
<p class="lead">Whenever people work together, conflict happens (CLO7). It is not automatically bad: <em>task conflict</em> (disagreeing about ideas) can produce better decisions. The danger is <em>relationship conflict</em> (personal friction). The skill is managing conflict so it strengthens the team rather than breaking it.</p>
<h3>Common sources of conflict</h3>
<ul>
  <li>Unclear goals or roles (who does what?).</li>
  <li>Different working styles or values.</li>
  <li>Scarce resources or unequal workload.</li>
  <li>Poor communication (Chapter 2!) and misunderstandings.</li>
</ul>
<h3>Five ways to handle conflict (Thomas-Kilmann)</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Competing</div><div class="lz-ld">Pursue your own goal at others&#39; expense. Fast, but damages relationships.</div></div>
  <div class="lz-layer"><div class="lz-lt">Avoiding</div><div class="lz-ld">Sidestep the issue. Sometimes buys time, but unresolved conflict festers.</div></div>
  <div class="lz-layer"><div class="lz-lt">Accommodating</div><div class="lz-ld">Give in to keep harmony. Good for minor issues, bad if you always yield.</div></div>
  <div class="lz-layer"><div class="lz-lt">Compromising</div><div class="lz-ld">Both sides give a little. A quick, fair-enough middle ground.</div></div>
  <div class="lz-layer"><div class="lz-lt">Collaborating</div><div class="lz-ld">Work together for a win-win that satisfies everyone. The ideal — but takes time &amp; trust.</div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Even &quot;good&quot; conflict has a ceiling.</b> A large meta-analysis by De Dreu and Weingart found that <em>both</em> relationship and task conflict tend to hurt team performance and satisfaction — the hoped-for benefit of task conflict is smaller and more fragile than people assume. A little debate about ideas helps; too much of any conflict, or conflict that turns personal, drags a team down. <em>The syllabus says task conflict &quot;can produce better decisions&quot;; the research adds the crucial caveat that the effect is weak and easily tips negative.</em></div>
<div class="callout ok">There is no single right style — but <strong>collaborating</strong> (win-win) is usually best for a team you will keep working with. When your group project hits a disagreement, focus on the shared goal, listen actively (Chapter 2), and look for a solution everyone can support.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Xung đột là bình thường — và có thể hữu ích</h2>
<p class="lead">Bất cứ khi nào người ta làm việc cùng nhau, xung đột xảy ra (CLO7). Nó không tự động xấu: <em>xung đột công việc</em> (bất đồng về ý tưởng) có thể tạo quyết định tốt hơn. Nguy hiểm là <em>xung đột quan hệ</em> (mâu thuẫn cá nhân). Kỹ năng là quản lý xung đột để nó làm mạnh đội thay vì phá vỡ.</p>
<h3>Các nguồn xung đột phổ biến</h3>
<ul>
  <li>Mục tiêu hay vai trò không rõ (ai làm gì?).</li>
  <li>Phong cách làm việc hay giá trị khác nhau.</li>
  <li>Tài nguyên khan hiếm hoặc khối lượng việc không đều.</li>
  <li>Giao tiếp kém (Chương 2!) và hiểu lầm.</li>
</ul>
<h3>Năm cách xử lý xung đột (Thomas-Kilmann)</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Cạnh tranh (competing)</div><div class="lz-ld">Theo đuổi mục tiêu của mình bất chấp người khác. Nhanh, nhưng làm hỏng quan hệ.</div></div>
  <div class="lz-layer"><div class="lz-lt">Né tránh (avoiding)</div><div class="lz-ld">Lảng tránh vấn đề. Đôi khi mua thời gian, nhưng xung đột chưa giải quyết sẽ âm ỉ.</div></div>
  <div class="lz-layer"><div class="lz-lt">Nhượng bộ (accommodating)</div><div class="lz-ld">Nhường để giữ hoà khí. Tốt cho việc nhỏ, xấu nếu luôn nhường.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thoả hiệp (compromising)</div><div class="lz-ld">Cả hai bên nhường một chút. Một điểm giữa nhanh, đủ công bằng.</div></div>
  <div class="lz-layer"><div class="lz-lt">Hợp tác (collaborating)</div><div class="lz-ld">Làm việc cùng nhau cho một win-win thoả mãn tất cả. Lý tưởng — nhưng cần thời gian &amp; tin tưởng.</div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ngay cả xung đột &quot;tốt&quot; cũng có trần.</b> Một phân tích tổng hợp lớn của De Dreu và Weingart phát hiện <em>cả</em> xung đột quan hệ lẫn xung đột công việc đều có xu hướng làm hại hiệu suất và sự hài lòng của đội — lợi ích kỳ vọng của xung đột công việc nhỏ và mong manh hơn ta tưởng. Một chút tranh luận về ý tưởng thì tốt; quá nhiều xung đột bất kỳ loại nào, hay xung đột hoá cá nhân, đều kéo đội xuống. <em>Syllabus nói xung đột công việc &quot;có thể tạo quyết định tốt hơn&quot;; nghiên cứu bổ sung cảnh báo quan trọng rằng hiệu ứng đó yếu và dễ trượt sang tiêu cực.</em></div>
<div class="callout ok">Không có phong cách đúng duy nhất — nhưng <strong>hợp tác</strong> (win-win) thường tốt nhất cho một đội bạn sẽ tiếp tục làm cùng. Khi dự án nhóm gặp bất đồng, tập trung vào mục tiêu chung, lắng nghe chủ động (Chương 2), và tìm một giải pháp mọi người ủng hộ được.</div>
</div>
`,
        },
        {
          title: 'Chapter 4 Quiz|||Quiz chương 4',
          slug: 'ssg104-quiz-ch4',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: task vs relationship conflict, 5 phong cách.',
          quiz: {
            timeLimitSeconds: 240,
            questions: [
              { question: 'Which type of conflict can actually improve decisions?|||Loại xung đột nào thực ra có thể cải thiện quyết định?', options: ['relationship conflict|||xung đột quan hệ', 'task conflict (about ideas)|||xung đột công việc (về ý tưởng)', 'no conflict ever helps|||không xung đột nào giúp ích', 'personal conflict|||xung đột cá nhân'], correctIndex: 1, points: 1 },
              { question: 'The "collaborating" conflict style aims for…|||Phong cách xung đột "hợp tác" nhắm tới…', options: ['a win for one side|||thắng cho một bên', 'a win-win that satisfies everyone|||win-win thoả mãn tất cả', 'avoiding the issue|||né vấn đề', 'giving in|||nhường'], correctIndex: 1, points: 1 },
              { question: 'Always avoiding conflict tends to…|||Luôn né tránh xung đột thường…', options: ['solve it permanently|||giải quyết vĩnh viễn', 'let it fester unresolved|||để nó âm ỉ chưa giải quyết', 'build trust|||xây tin tưởng', 'improve decisions|||cải thiện quyết định'], correctIndex: 1, points: 1 },
              { question: 'A common source of team conflict is…|||Một nguồn xung đột nhóm phổ biến là…', options: ['clear roles|||vai trò rõ ràng', 'unclear goals/roles &amp; poor communication|||mục tiêu/vai trò không rõ &amp; giao tiếp kém', 'active listening|||lắng nghe chủ động', 'a shared goal|||một mục tiêu chung'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — THUYẾT TRÌNH THUYẾT PHỤC ══════════════════ */
    {
      title: 'Chapter 5 — Persuasive Presentations|||Chương 5 — Thuyết trình thuyết phục',
      description: 'Cấu trúc, trình bày và ngôn ngữ cơ thể của một bài thuyết trình hiệu quả.',
      lessons: [
        {
          title: '5.1 — Presenting with impact|||5.1 — Trình bày có sức nặng',
          slug: 'ssg104-5-1-thuyet-trinh',
          type: 'VIDEO',
          description: 'Cấu trúc bài thuyết trình, trình bày tự tin và làm chủ nỗi lo.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Delivering a persuasive presentation</h2>
<p class="lead">Presenting (CLO9) is a make-or-break professional skill — pitching an idea, defending a project, interviewing. A great presentation has a clear <strong>structure</strong>, confident <strong>delivery</strong>, and knows its <strong>audience</strong>.</p>
<h3>The classic structure</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Open</div><div class="lz-t">hook + roadmap</div><div class="lz-d">grab attention, say what&#39;s coming</div></div>
  <div class="lz-step"><div class="lz-k">Body</div><div class="lz-t">2–3 key points</div><div class="lz-d">each with evidence</div></div>
  <div class="lz-step"><div class="lz-k">Close</div><div class="lz-t">summary + call to action</div><div class="lz-d">what should they do/think?</div></div>
</div>
<p>"Tell them what you&#39;ll say, say it, then tell them what you said." Simple structure helps the audience follow — same principle as the essay structure in SSL101c.</p>
<h3>Delivery &amp; nonverbal</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Body language (Ch 2)</div><div class="lz-ld">Stand tall, make eye contact, use natural gestures. Confidence is shown, not just told.</div></div>
  <div class="lz-layer"><div class="lz-lt">Voice</div><div class="lz-ld">Speak clearly, vary your pace, pause for emphasis. Avoid a monotone.</div></div>
  <div class="lz-layer"><div class="lz-lt">Slides</div><div class="lz-ld">Visual aids, not a script. Few words, clear images — you are the presentation, not the slides.</div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Reading your slides aloud makes people understand less.</b> Cognitive-load research (Richard Mayer&#39;s <em>redundancy principle</em>) shows that when a slide is full of text and you read the same words, the audience&#39;s brain must process the same message twice through competing channels — comprehension drops. Put a few words or one image on the slide, then <em>speak</em> the detail. <em>The syllabus says &quot;few words, clear images&quot; as a style tip; the science explains why text-heavy slides actively sabotage your message.</em></div>
<div class="callout ok">Handling nerves: everyone feels them. The cure is <strong>preparation and practice</strong> — rehearse out loud, know your opening cold, and remember the audience wants you to succeed. Persuasion comes from clarity and genuine belief, not tricks.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Trình bày một bài thuyết trình thuyết phục</h2>
<p class="lead">Thuyết trình (CLO9) là một kỹ năng nghề nghiệp then chốt — chào một ý tưởng, bảo vệ một dự án, phỏng vấn. Một bài thuyết trình xuất sắc có <strong>cấu trúc</strong> rõ, <strong>trình bày</strong> tự tin, và hiểu <strong>người nghe</strong>.</p>
<h3>Cấu trúc kinh điển</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Mở</div><div class="lz-t">móc câu + lộ trình</div><div class="lz-d">thu hút, nói sắp trình bày gì</div></div>
  <div class="lz-step"><div class="lz-k">Thân</div><div class="lz-t">2–3 ý chính</div><div class="lz-d">mỗi ý có bằng chứng</div></div>
  <div class="lz-step"><div class="lz-k">Kết</div><div class="lz-t">tóm tắt + kêu gọi hành động</div><div class="lz-d">họ nên làm/nghĩ gì?</div></div>
</div>
<p>"Nói họ nghe bạn sẽ nói gì, nói điều đó, rồi nói lại điều bạn đã nói." Cấu trúc đơn giản giúp người nghe theo được — cùng nguyên tắc cấu trúc bài luận ở SSL101c.</p>
<h3>Trình bày &amp; phi lời</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Ngôn ngữ cơ thể (Ch 2)</div><div class="lz-ld">Đứng thẳng, giao tiếp mắt, dùng cử chỉ tự nhiên. Sự tự tin được cho thấy, không chỉ nói.</div></div>
  <div class="lz-layer"><div class="lz-lt">Giọng nói</div><div class="lz-ld">Nói rõ, thay đổi nhịp độ, ngừng để nhấn mạnh. Tránh giọng đều đều.</div></div>
  <div class="lz-layer"><div class="lz-lt">Slide</div><div class="lz-ld">Hỗ trợ hình ảnh, không phải kịch bản. Ít chữ, hình rõ — bạn là bài thuyết trình, không phải slide.</div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đọc slide thành tiếng khiến người ta hiểu ít hơn.</b> Nghiên cứu tải nhận thức (<em>nguyên tắc dư thừa</em> của Richard Mayer) cho thấy khi một slide đầy chữ và bạn đọc đúng những chữ đó, não người nghe phải xử lý cùng một thông điệp hai lần qua các kênh cạnh tranh — khả năng hiểu giảm. Hãy đặt vài chữ hoặc một hình lên slide, rồi <em>nói</em> phần chi tiết. <em>Syllabus nói &quot;ít chữ, hình rõ&quot; như một mẹo phong cách; khoa học giải thích vì sao slide dày chữ chủ động phá hoại thông điệp của bạn.</em></div>
<div class="callout ok">Làm chủ nỗi lo: ai cũng có. Cách chữa là <strong>chuẩn bị và luyện tập</strong> — tập nói thành tiếng, thuộc lòng phần mở, và nhớ người nghe muốn bạn thành công. Thuyết phục đến từ sự rõ ràng và niềm tin thật, không phải mánh khoé.</div>
</div>
`,
        },
        {
          title: 'Chapter 5 Quiz|||Quiz chương 5',
          slug: 'ssg104-quiz-ch5',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: cấu trúc, trình bày, slide, làm chủ nỗi lo.',
          quiz: {
            timeLimitSeconds: 240,
            questions: [
              { question: 'A classic presentation structure is…|||Một cấu trúc thuyết trình kinh điển là…', options: ['random points|||các ý ngẫu nhiên', 'opening (hook) → body (key points) → close (call to action)|||mở (móc câu) → thân (ý chính) → kết (kêu gọi)', 'only slides|||chỉ slide', 'read a script|||đọc kịch bản'], correctIndex: 1, points: 1 },
              { question: 'Good presentation slides should…|||Slide thuyết trình tốt nên…', options: ['contain the full script|||chứa toàn bộ kịch bản', 'be few words &amp; clear visuals (a visual aid)|||ít chữ &amp; hình rõ (hỗ trợ hình ảnh)', 'be read word for word|||đọc từng chữ', 'have no images|||không có hình'], correctIndex: 1, points: 1 },
              { question: 'The best cure for presentation nerves is…|||Cách chữa nỗi lo thuyết trình tốt nhất là…', options: ['avoiding eye contact|||tránh giao tiếp mắt', 'preparation and practice|||chuẩn bị và luyện tập', 'speaking as fast as possible|||nói nhanh nhất có thể', 'reading from slides|||đọc từ slide'], correctIndex: 1, points: 1 },
              { question: 'Confidence in a presentation is mostly shown through…|||Sự tự tin trong thuyết trình chủ yếu thể hiện qua…', options: ['long words|||từ dài', 'body language, eye contact and voice|||ngôn ngữ cơ thể, giao tiếp mắt và giọng nói', 'the number of slides|||số lượng slide', 'reading fast|||đọc nhanh'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 6 — VIẾT CÔNG VIỆC & HỌP ══════════════════ */
    {
      title: 'Chapter 6 — Business Writing & Meetings|||Chương 6 — Viết công việc & Họp',
      description: 'Viết email/thư/báo cáo chuyên nghiệp và điều hành cuộc họp hiệu quả.',
      lessons: [
        {
          title: '6.1 — Business writing & running meetings|||6.1 — Viết công việc & điều hành họp',
          slug: 'ssg104-6-1-viet-hop',
          type: 'VIDEO',
          description: 'Cấu trúc email/báo cáo chuyên nghiệp và cách họp không lãng phí.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Writing that gets results</h2>
<p class="lead">In the workplace you communicate constantly in writing (CLO4): emails, proposals, reports. Good business writing is <strong>clear, concise and professional</strong> — it respects the reader&#39;s time.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Email</div><div class="lz-ld">A clear subject line, a polite greeting, the point up front, a specific ask, and a sign-off. Short and to the point.</div></div>
  <div class="lz-layer"><div class="lz-lt">Report</div><div class="lz-ld">Structured: title, summary, findings, conclusion, recommendations. The summary lets a busy reader grasp it fast.</div></div>
  <div class="lz-layer"><div class="lz-lt">Proposal</div><div class="lz-ld">States a problem, a proposed solution, and its benefits &amp; cost — to persuade a decision-maker.</div></div>
</div>
<h3>Running an effective meeting</h3>
<p>Meetings (CLO10) waste enormous time when run badly. A few habits fix that:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Before</div><div class="lz-t">agenda + purpose</div><div class="lz-d">why are we meeting?</div></div>
  <div class="lz-step"><div class="lz-k">During</div><div class="lz-t">stay on agenda</div><div class="lz-d">everyone contributes, on time</div></div>
  <div class="lz-step"><div class="lz-k">After</div><div class="lz-t">minutes + actions</div><div class="lz-d">who does what by when</div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Amazon banned slides in favour of six-page memos.</b> At Amazon, meetings begin with everyone silently reading a narrative memo — no bullet-point decks — because prose forces clearer thinking than fragmented slides. Many organisations pair this with <em>BLUF</em> (Bottom Line Up Front): state your conclusion and the decision you need in the first line, then the detail. <em>The syllabus teaches email and report structure; these real corporate practices show how the highest-performing companies actually write and meet.</em></div>
<div class="note-ct">The golden rule of meetings: every meeting should end with clear <strong>action items</strong> — who does what, by when. A meeting with no decisions and no next steps was probably an email. Writing clear minutes is a skill you will use constantly.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Viết mang lại kết quả</h2>
<p class="lead">Ở nơi làm việc bạn giao tiếp liên tục bằng chữ viết (CLO4): email, đề xuất, báo cáo. Viết công việc tốt là <strong>rõ ràng, súc tích và chuyên nghiệp</strong> — nó tôn trọng thời gian người đọc.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Email</div><div class="lz-ld">Dòng tiêu đề rõ, lời chào lịch sự, đặt điểm chính lên đầu, một yêu cầu cụ thể, và lời kết. Ngắn và đúng trọng tâm.</div></div>
  <div class="lz-layer"><div class="lz-lt">Báo cáo</div><div class="lz-ld">Có cấu trúc: tiêu đề, tóm tắt, phát hiện, kết luận, khuyến nghị. Phần tóm tắt cho người đọc bận nắm nhanh.</div></div>
  <div class="lz-layer"><div class="lz-lt">Đề xuất</div><div class="lz-ld">Nêu một vấn đề, một giải pháp đề xuất, và lợi ích &amp; chi phí — để thuyết phục người ra quyết định.</div></div>
</div>
<h3>Điều hành một cuộc họp hiệu quả</h3>
<p>Họp (CLO10) lãng phí rất nhiều thời gian khi điều hành tệ. Vài thói quen khắc phục điều đó:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Trước</div><div class="lz-t">chương trình + mục đích</div><div class="lz-d">vì sao ta họp?</div></div>
  <div class="lz-step"><div class="lz-k">Trong</div><div class="lz-t">bám chương trình</div><div class="lz-d">mọi người đóng góp, đúng giờ</div></div>
  <div class="lz-step"><div class="lz-k">Sau</div><div class="lz-t">biên bản + hành động</div><div class="lz-d">ai làm gì tới khi nào</div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Amazon cấm slide, thay bằng bản ghi nhớ sáu trang.</b> Ở Amazon, cuộc họp bắt đầu bằng việc mọi người im lặng đọc một bản ghi nhớ dạng văn xuôi — không có bộ slide gạch đầu dòng — vì văn xuôi buộc tư duy rõ ràng hơn slide rời rạc. Nhiều tổ chức kết hợp điều này với <em>BLUF</em> (Bottom Line Up Front — Kết luận lên đầu): nêu kết luận và quyết định bạn cần ngay dòng đầu, rồi mới tới chi tiết. <em>Syllabus dạy cấu trúc email và báo cáo; các thực hành doanh nghiệp thật này cho thấy các công ty hiệu suất cao nhất thực sự viết và họp thế nào.</em></div>
<div class="note-ct">Quy tắc vàng của họp: mọi cuộc họp nên kết thúc với các <strong>hạng mục hành động (action item)</strong> rõ — ai làm gì, tới khi nào. Một cuộc họp không quyết định và không bước tiếp theo có lẽ chỉ nên là một email. Viết biên bản rõ ràng là kỹ năng bạn dùng liên tục.</div>
</div>
`,
        },
        {
          title: 'Chapter 6 Quiz|||Quiz chương 6',
          slug: 'ssg104-quiz-ch6',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: email/báo cáo, cấu trúc, họp hiệu quả, action items.',
          quiz: {
            timeLimitSeconds: 240,
            questions: [
              { question: 'Good business writing is…|||Viết công việc tốt là…', options: ['long and formal|||dài và trang trọng', 'clear, concise and professional|||rõ ràng, súc tích và chuyên nghiệp', 'full of jargon|||đầy thuật ngữ', 'as vague as possible|||mơ hồ nhất có thể'], correctIndex: 1, points: 1 },
              { question: 'A report&#39;s summary is important because it…|||Phần tóm tắt của báo cáo quan trọng vì nó…', options: ['makes the report longer|||làm báo cáo dài hơn', 'lets a busy reader grasp the key points fast|||cho người đọc bận nắm nhanh các ý chính', 'replaces the whole report|||thay cả báo cáo', 'is decorative|||chỉ để trang trí'], correctIndex: 1, points: 1 },
              { question: 'An effective meeting should start with a…|||Một cuộc họp hiệu quả nên bắt đầu với một…', options: ['random chat|||nói chuyện phiếm', 'clear agenda and purpose|||chương trình và mục đích rõ ràng', 'no plan|||không kế hoạch', 'long presentation|||một bài thuyết trình dài'], correctIndex: 1, points: 1 },
              { question: 'Every meeting should end with…|||Mọi cuộc họp nên kết thúc với…', options: ['clear action items (who does what by when)|||các hạng mục hành động rõ (ai làm gì tới khi nào)', 'no decisions|||không quyết định', 'a new meeting only|||chỉ một cuộc họp mới', 'silence|||sự im lặng'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 1 — GHÉP LẠI & NGHỀ NGHIỆP (CAPSTONE) ══════════════════ */
    {
      title: 'Advanced 1 — Putting it all together: teamwork & career|||Nâng cao 1 — Ghép lại: làm nhóm & nghề nghiệp',
      description: 'Ngoài giáo trình — bài tổng kết: dùng mọi kỹ năng trong dự án nhóm và sự nghiệp.',
      lessons: [
        {
          title: 'N1.1 — The group project & your career|||N1.1 — Dự án nhóm & sự nghiệp của bạn',
          slug: 'ssg104-n1-1-nghe-nghiep',
          type: 'VIDEO',
          description: 'Áp dụng tất cả kỹ năng vào dự án nhóm, và vì sao chúng theo bạn cả đời.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 1 · Lesson N1.1</span>
<h2>Every skill, applied at once</h2>
<p class="lead">The group project (CLO12) is where everything in SSG104 comes together. It is not busywork — it is a rehearsal for your entire career, because professional software is built exactly this way: teams, roles, meetings, conflict, presentations and reports.</p>
<div class="lz-map">
  <div class="lz-stage">Running a group project well</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Form the team (Ch 1)</div><div class="lz-nsub">Set a shared goal, assign roles, expect a storming phase</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Communicate (Ch 2)</div><div class="lz-nsub">Clear updates, active listening, a shared task board</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Lead &amp; resolve (Ch 3–4)</div><div class="lz-nsub">Someone coordinates; handle disagreements by collaborating</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Present &amp; write (Ch 5–6)</div><div class="lz-nsub">A persuasive final presentation + a clear report</div></div></div>
</div>
<h3>Critical &amp; creative thinking in teams</h3>
<p>Great teams combine <strong>creative thinking</strong> (generating many ideas together, like MAD101/SSL101c) with <strong>critical thinking</strong> (evaluating them honestly). Diverse perspectives, well managed, beat any single person — that is the whole point of working in a group (CLO3).</p>
<h3>These skills are your career (CLO11)</h3>
<div class="callout ok">In every job interview you will be asked about teamwork and communication. In every workplace, the people who get ahead are not just technically skilled — they collaborate, communicate, lead and present well. SSG104 is a direct investment in your future earning power and professional reputation.</div>
<div class="note-ct">Congratulations on completing SSG104 — and Semester 2. You can now work effectively in a team, communicate clearly in speech and writing, lead and resolve conflict, and present persuasively. Combined with your technical courses, these people skills are what turn a good student into a valued professional. Use them in every project from here on.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 1 · Bài N1.1</span>
<h2>Mọi kỹ năng, áp dụng cùng lúc</h2>
<p class="lead">Dự án nhóm (CLO12) là nơi mọi thứ trong SSG104 ghép lại. Nó không phải việc cho có — mà là một buổi diễn tập cho cả sự nghiệp của bạn, vì phần mềm chuyên nghiệp được xây đúng theo cách này: đội, vai trò, họp, xung đột, thuyết trình và báo cáo.</p>
<div class="lz-map">
  <div class="lz-stage">Chạy một dự án nhóm tốt</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Lập đội (Ch 1)</div><div class="lz-nsub">Đặt mục tiêu chung, chia vai trò, lường trước pha bão tố</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Giao tiếp (Ch 2)</div><div class="lz-nsub">Cập nhật rõ, lắng nghe chủ động, một bảng công việc chung</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Lãnh đạo &amp; giải quyết (Ch 3–4)</div><div class="lz-nsub">Ai đó điều phối; xử bất đồng bằng hợp tác</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Trình bày &amp; viết (Ch 5–6)</div><div class="lz-nsub">Một bài thuyết trình cuối thuyết phục + một báo cáo rõ</div></div></div>
</div>
<h3>Tư duy phản biện &amp; sáng tạo trong nhóm</h3>
<p>Đội tuyệt vời kết hợp <strong>tư duy sáng tạo</strong> (tạo nhiều ý tưởng cùng nhau, như MAD101/SSL101c) với <strong>tư duy phản biện</strong> (đánh giá chúng trung thực). Góc nhìn đa dạng, được quản lý tốt, thắng bất kỳ cá nhân nào — đó là toàn bộ mục đích của làm việc nhóm (CLO3).</p>
<h3>Các kỹ năng này chính là sự nghiệp của bạn (CLO11)</h3>
<div class="callout ok">Trong mọi buổi phỏng vấn bạn sẽ bị hỏi về làm việc nhóm và giao tiếp. Ở mọi nơi làm việc, người tiến lên không chỉ giỏi kỹ thuật — họ cộng tác, giao tiếp, lãnh đạo và thuyết trình tốt. SSG104 là một khoản đầu tư trực tiếp vào khả năng kiếm tiền tương lai và uy tín nghề nghiệp của bạn.</div>
<div class="note-ct">Chúc mừng bạn hoàn thành SSG104 — và Kỳ 2. Giờ bạn có thể làm việc hiệu quả trong đội, giao tiếp rõ ràng bằng nói và viết, lãnh đạo và giải quyết xung đột, và thuyết trình thuyết phục. Kết hợp với các môn kỹ thuật, các kỹ năng con người này biến một sinh viên giỏi thành một người làm nghề có giá trị. Hãy dùng chúng trong mọi dự án từ đây.</div>
</div>
`,
        },
      ],
    },
  ],
};
