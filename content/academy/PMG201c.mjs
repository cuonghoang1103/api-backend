/**
 * PMG201c — Project Management (Quản trị dự án). Kỳ 7.
 * Bám syllabus FPTU (sylID 12548, 4 CLO, 12 buổi). Tiên quyết: None. 3 tín chỉ.
 * Môn COURSERA: 4 course "Introduction to Project Management Principles and Practices" (UC Irvine)
 *   → thi TE 50% (MCQ, 60') + PE 50% (thực hành, 120'). Pass: TE>=4 & PE>=4 & FR>=5.
 *   FR = min(10, (TE+PE)/2 + Bonus); Bonus = 1 điểm nếu hoàn thành mọi MOOC đúng hạn.
 * Giáo trình: Schwalbe (ITPM) + PMBOK Guide + Sommerville SE8.
 * Chuẩn CHUYÊN NGHIỆP như SWP391: thang điểm đầy đủ, checklist theo mốc/artifact, anti-fail/high-mark,
 * ngân hàng câu hỏi thi theo CLO, ngân hàng đề tài capstone + rubric chọn đề, công thức CPM/PERT/EVM có ví dụ giải.
 * Song ngữ EN/VN đối xứng. KHÔNG code → KHÔNG CodeLab. Link Coursera + Exp Hub (GanttProject/MS Project/Trello/Excel EVM).
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/PMG201c.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    academyType: 'FPT',
    courseCode: 'PMG201c',
    title: 'Project Management',
    slug: 'project-management',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Plan, budget, schedule and control real projects: scope & WBS, estimating, the critical path, risk & change management, earned value, and a full project plan capstone — built on the UC Irvine Coursera specialization.|||Lập kế hoạch, ngân sách, tiến độ và kiểm soát dự án thật: phạm vi & WBS, ước lượng, đường găng, quản lý rủi ro & thay đổi, giá trị thu được, và một đồ án kế hoạch dự án hoàn chỉnh — dựa trên chuỗi Coursera của UC Irvine.',
    description: 'PMG201c là môn QUẢN TRỊ DỰ ÁN của Kỳ 7, học qua bốn khoá Coursera "Introduction to Project Management Principles and Practices" của Đại học California, Irvine, bám khung PMBOK và giáo trình Schwalbe. Bạn đi từ khởi tạo & lập kế hoạch (dự án là gì, tam giác ràng buộc, các bên liên quan, phạm vi, project charter) → ngân sách & tiến độ (WBS, ước lượng, sơ đồ mạng, đường găng CPM, biểu đồ Gantt) → quản lý rủi ro & thay đổi (nhận diện & ứng phó rủi ro, sổ rủi ro, quản lý truyền thông, kiểm soát thay đổi) → và một CAPSTONE lập một bản kế hoạch dự án trọn vẹn có bình duyệt (peer review). Thi cuối gồm hai phần: TE (lý thuyết, trắc nghiệm, 50%) và PE (thực hành, 50%). Đây là kỹ năng nền cho SWP391, đồ án tốt nghiệp và mọi vai trò kỹ sư/leader sau này. Tiên quyết: Không.',
    whatYouLearn: 'Định nghĩa dự án và phân biệt dự án với vận hành; áp dụng tam giác ràng buộc (phạm vi–thời gian–chi phí); xác định các bên liên quan và quyền lực vs ảnh hưởng; viết project charter và tuyên bố phạm vi; xây cấu trúc phân rã công việc (WBS); ước lượng bằng analogous/parametric/three-point (PERT); dựng sơ đồ mạng, tính đường găng (CPM), độ trễ (float) và vẽ Gantt; nén tiến độ (crashing, fast-tracking); nhận diện, phân tích và ứng phó rủi ro (avoid/transfer/mitigate/accept) với sổ rủi ro; lập kế hoạch truyền thông và kiểm soát thay đổi; đo tiến độ bằng Earned Value (PV/EV/AC, CPI/SPI); và tích hợp tất cả thành một bản kế hoạch dự án chuyên nghiệp.',
    requirements: 'Tiên quyết: Không. Cần: một tài khoản Coursera (ghi danh qua lời mời của admin lớp), Internet để học ≥5 giờ/tuần, một công cụ lập lịch dự án (GanttProject miễn phí, hoặc MS Project / ProjectLibre), và bảng tính (Excel / Google Sheets) để tính ước lượng, đường găng và Earned Value.',
    documentsNote: 'Chuỗi MOOC bắt buộc (Coursera — UC Irvine, "Introduction to Project Management Principles and Practices"): (1) Initiating and Planning Projects, (2) Budgeting and Scheduling Projects, (3) Managing Project Risks and Changes, (4) Project Management Capstone. Phải hoàn thành để được thi. Giáo trình: Kathy Schwalbe — Information Technology Project Management (Cengage) • PMBOK Guide (PMI) • Ian Sommerville — Software Engineering 8e. Công cụ: GanttProject / MS Project / ProjectLibre (lịch & Gantt), Excel/Google Sheets (ước lượng, CPM, EVM), Trello / Jira (theo dõi công việc), Miro/Lucidchart (sơ đồ mạng & stakeholder map). Kèm file syllabus gốc PMG201c.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: quản trị dự án là gì, học qua 4 course nào, điều kiện qua môn & TE/PE, chuẩn đầu ra, công cụ, ngân hàng đề tài capstone, và bí quyết điểm cao.',
      lessons: [
        {
          title: '0.1 — About PMG201c & the project-management map|||0.1 — Giới thiệu PMG201c & bản đồ quản trị dự án',
          slug: 'pmg201c-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Quản trị dự án là gì, năm nhóm quy trình PMBOK, và bản đồ 4 course từ khởi tạo tới capstone.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About PMG201c — Project Management</h2>
<p class="lead">A project is a <strong>temporary effort to create a unique product or result</strong> — it has a start, an end, and a goal. Project management is the discipline of delivering that goal <em>on scope, on time, and on budget</em>, despite risk and change. PMG201c teaches this through four UC Irvine Coursera courses, framed by the global standard: the PMBOK Guide.</p>
<p>This is the skill that turns "we should build an app" into a plan with a scope, a schedule, a budget, a risk register, and a way to measure progress. You will use it directly in SWP391 and in every team you ever lead.</p>
<h3>The five process groups — the heartbeat of every project</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Initiating</b><span>charter · stakeholders · why the project exists</span></div>
  <div class="lz-step"><b>Planning</b><span>scope · WBS · schedule · budget · risk plan</span></div>
  <div class="lz-step"><b>Executing</b><span>build the deliverables · lead the team</span></div>
  <div class="lz-step"><b>Monitoring &amp; Controlling</b><span>track progress · manage change · earned value</span></div>
  <div class="lz-step"><b>Closing</b><span>hand over · lessons learned</span></div>
</div>
<h3>Your journey — four courses building one project plan</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Initiating &amp; Planning Projects</div><div class="lz-nsub">What is a project · stakeholders · scope · project charter</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Budgeting &amp; Scheduling Projects</div><div class="lz-nsub">WBS · estimating · critical path (CPM) · Gantt</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Managing Project Risks &amp; Changes</div><div class="lz-nsub">Risk register · response strategies · communications · change control</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Project Management Capstone</div><div class="lz-nsub">Integrate everything into one project plan · peer review</div></div></div>
  <div class="lz-stage">On campus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">TE (theory) + PE (practical) exams</div><div class="lz-nsub">50% + 50%</div></div></div>
</div>
<a class="link-card codelab" href="https://www.coursera.org/specializations/project-management" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">Introduction to Project Management (Coursera · UC Irvine)</span><span class="lc-sub">The official 4-course specialization for this course — start here.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
<div class="callout ok">The one idea behind everything: the <strong>triple constraint</strong> — scope, time, and cost — are linked. You cannot add scope without adding time or cost. Every technique in this course is a way to balance these three under pressure.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu PMG201c — Quản trị dự án</h2>
<p class="lead">Dự án là <strong>một nỗ lực tạm thời để tạo ra một sản phẩm hoặc kết quả duy nhất</strong> — có điểm bắt đầu, điểm kết thúc và một mục tiêu. Quản trị dự án là nghề đưa mục tiêu đó về đích <em>đúng phạm vi, đúng hạn, đúng ngân sách</em>, bất chấp rủi ro và thay đổi. PMG201c dạy điều này qua bốn khoá Coursera của UC Irvine, đóng khung bởi chuẩn toàn cầu: PMBOK Guide.</p>
<p>Đây là kỹ năng biến "chúng ta nên làm một app" thành một bản kế hoạch có phạm vi, tiến độ, ngân sách, sổ rủi ro, và cách đo tiến độ. Bạn sẽ dùng nó trực tiếp trong SWP391 và trong mọi nhóm bạn dẫn dắt.</p>
<h3>Năm nhóm quy trình — nhịp tim của mọi dự án</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Khởi tạo</b><span>charter · các bên liên quan · vì sao dự án tồn tại</span></div>
  <div class="lz-step"><b>Lập kế hoạch</b><span>phạm vi · WBS · tiến độ · ngân sách · kế hoạch rủi ro</span></div>
  <div class="lz-step"><b>Thực hiện</b><span>làm ra sản phẩm bàn giao · dẫn dắt nhóm</span></div>
  <div class="lz-step"><b>Giám sát &amp; Kiểm soát</b><span>theo dõi tiến độ · quản lý thay đổi · earned value</span></div>
  <div class="lz-step"><b>Kết thúc</b><span>bàn giao · bài học kinh nghiệm</span></div>
</div>
<h3>Hành trình của bạn — bốn khoá dựng nên một bản kế hoạch</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Khởi tạo &amp; Lập kế hoạch dự án</div><div class="lz-nsub">Dự án là gì · các bên liên quan · phạm vi · project charter</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Ngân sách &amp; Tiến độ dự án</div><div class="lz-nsub">WBS · ước lượng · đường găng (CPM) · Gantt</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Quản lý Rủi ro &amp; Thay đổi</div><div class="lz-nsub">Sổ rủi ro · chiến lược ứng phó · truyền thông · kiểm soát thay đổi</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Capstone Quản trị dự án</div><div class="lz-nsub">Tích hợp mọi thứ thành một bản kế hoạch · bình duyệt</div></div></div>
  <div class="lz-stage">Tại campus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Thi TE (lý thuyết) + PE (thực hành)</div><div class="lz-nsub">50% + 50%</div></div></div>
</div>
<a class="link-card codelab" href="https://www.coursera.org/specializations/project-management" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">Introduction to Project Management (Coursera · UC Irvine)</span><span class="lc-sub">Chuỗi 4 khoá chính thức của môn — bắt đầu từ đây.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
<div class="callout ok">Một ý tưởng đằng sau mọi thứ: <strong>tam giác ràng buộc</strong> — phạm vi, thời gian, chi phí — gắn với nhau. Bạn không thể thêm phạm vi mà không thêm thời gian hoặc chi phí. Mọi kỹ thuật trong môn này là một cách cân bằng ba thứ đó dưới áp lực.</div>
</div>`,
        },
        {
          title: '0.2 — Passing requirements: TE, PE & grading|||0.2 — Điều kiện qua môn: TE, PE & cấu trúc điểm',
          slug: 'pmg201c-dieu-kien-qua-mon',
          type: 'VIDEO',
          description: 'Tín chỉ, thời lượng, điều kiện được thi, và cách tính FR từ TE + PE + Bonus.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">PMG201c has TWO final exams that both matter, plus a MOOC-completion bonus. Three thresholds decide pass/fail — miss any one and you fail.</p>
<div class="kv-grid">
  <div class="kv"><b>Credits</b><span>3</span></div>
  <div class="kv"><b>Prerequisite</b><span>None</span></div>
  <div class="kv"><b>Time</b><span>60h online + 3h offline + exams + 84h self-study</span></div>
  <div class="kv"><b>Pass</b><span>TE ≥ 4 AND PE ≥ 4 AND FR ≥ 5</span></div>
</div>
<h3>How the grade is built</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Format</th><th>Threshold</th></tr></thead>
  <tbody>
    <tr><td>Theory Exam (TE)</td><td>50%</td><td>Multiple choice, 60 min, computer-marked</td><td>TE ≥ 4</td></tr>
    <tr><td>Practical Exam (PE)</td><td>50%</td><td>Applied tasks (WBS, schedule, EVM…), 120 min</td><td>PE ≥ 4</td></tr>
    <tr><td>Bonus</td><td>+1</td><td>Complete all MOOCs before the deadline</td><td>added into FR</td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">FINAL RESULT</span> FR = min(10, (TE + PE) / 2 + Bonus) &nbsp;·&nbsp; PASS only if <b>TE ≥ 4</b> AND <b>PE ≥ 4</b> AND <b>FR ≥ 5</b></div>
<div class="callout warn"><strong>You must complete the online courses to be allowed to sit the final exam.</strong> The MOOC completion is both your exam ticket and your +1 bonus. Skipping it costs you twice.</div>
<h3>Worked example — do these students pass?</h3>
<div class="out"><b>Student A:</b> MOOCs on time (Bonus 1), TE = 6, PE = 5.
→ FR = min(10, (6+5)/2 + 1) = min(10, 6.5) = 6.5. TE ≥ 4 ✓ PE ≥ 4 ✓ FR ≥ 5 ✓ → <b>PASS (6.5)</b>.<br><br>
<b>Student B:</b> Bonus 0 (late), TE = 7, PE = 3.5.
→ PE = 3.5 &lt; 4 ✗ → <b>FAIL</b>, even though the average ((7+3.5)/2 = 5.25) looks passing. The PE ≥ 4 gate is independent.<br><br>
<b>Student C:</b> Bonus 1, TE = 4, PE = 4. → FR = min(10, 4 + 1) = 5.0. All gates met → <b>PASS (5.0)</b> — the bonus was decisive.</div>
<div class="pitfall">The commonest failure is neglecting the <strong>PE (practical) half</strong> — students revise MCQ theory but never actually practise building a WBS, a network diagram, or an EVM table under time. The PE has its own ≥4 gate; theory alone cannot carry you.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">PMG201c có HAI bài thi cuối đều quan trọng, cộng điểm thưởng hoàn thành MOOC. Ba ngưỡng quyết định đậu/rớt — thiếu một cái là rớt.</p>
<div class="kv-grid">
  <div class="kv"><b>Tín chỉ</b><span>3</span></div>
  <div class="kv"><b>Tiên quyết</b><span>Không</span></div>
  <div class="kv"><b>Thời lượng</b><span>60h online + 3h offline + thi + 84h tự học</span></div>
  <div class="kv"><b>Đậu</b><span>TE ≥ 4 VÀ PE ≥ 4 VÀ FR ≥ 5</span></div>
</div>
<h3>Điểm được cấu thành thế nào</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Hình thức</th><th>Ngưỡng</th></tr></thead>
  <tbody>
    <tr><td>Thi lý thuyết (TE)</td><td>50%</td><td>Trắc nghiệm, 60 phút, máy chấm</td><td>TE ≥ 4</td></tr>
    <tr><td>Thi thực hành (PE)</td><td>50%</td><td>Bài áp dụng (WBS, tiến độ, EVM…), 120 phút</td><td>PE ≥ 4</td></tr>
    <tr><td>Điểm thưởng</td><td>+1</td><td>Hoàn thành mọi MOOC trước hạn</td><td>cộng vào FR</td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">KẾT QUẢ CUỐI</span> FR = min(10, (TE + PE) / 2 + Bonus) &nbsp;·&nbsp; ĐẬU chỉ khi <b>TE ≥ 4</b> VÀ <b>PE ≥ 4</b> VÀ <b>FR ≥ 5</b></div>
<div class="callout warn"><strong>Bạn phải hoàn thành các khoá online mới được vào phòng thi cuối kỳ.</strong> Hoàn thành MOOC vừa là vé thi vừa là +1 điểm thưởng. Bỏ nó là mất gấp đôi.</div>
<h3>Ví dụ có lời giải — những bạn này có đậu không?</h3>
<div class="out"><b>Bạn A:</b> MOOC đúng hạn (Bonus 1), TE = 6, PE = 5.
→ FR = min(10, (6+5)/2 + 1) = min(10, 6.5) = 6.5. TE ≥ 4 ✓ PE ≥ 4 ✓ FR ≥ 5 ✓ → <b>ĐẬU (6.5)</b>.<br><br>
<b>Bạn B:</b> Bonus 0 (trễ), TE = 7, PE = 3.5.
→ PE = 3.5 &lt; 4 ✗ → <b>RỚT</b>, dù trung bình ((7+3.5)/2 = 5.25) trông có vẻ đậu. Cổng PE ≥ 4 là độc lập.<br><br>
<b>Bạn C:</b> Bonus 1, TE = 4, PE = 4. → FR = min(10, 4 + 1) = 5.0. Đủ mọi cổng → <b>ĐẬU (5.0)</b> — điểm thưởng quyết định.</div>
<div class="pitfall">Kiểu rớt phổ biến nhất là lơ là <strong>phần PE (thực hành)</strong> — sinh viên ôn lý thuyết trắc nghiệm nhưng chưa bao giờ thực sự luyện dựng WBS, sơ đồ mạng, hay bảng EVM có tính giờ. PE có cổng ≥4 riêng; lý thuyết không mình cõng bạn qua được.</div>
</div>`,
        },
        {
          title: '0.3 — Learning outcomes (CLOs) & how they map to the courses|||0.3 — Chuẩn đầu ra (CLO) & ánh xạ vào các khoá',
          slug: 'pmg201c-chuan-dau-ra',
          type: 'VIDEO',
          description: '4 chuẩn đầu ra và cách chúng gắn vào 4 course và hai bài thi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Course learning outcomes (CLOs)</h2>
<p class="lead">Four CLOs cover the whole plan-build-control cycle. The PE tests you on <em>doing</em> these, not just naming them.</p>
<table>
  <thead><tr><th>CLO</th><th>You will be able to…</th><th>Course</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Define a project plan and the elements of project initiation</td><td>Course 1 · Ch1</td></tr>
    <tr><td>CLO2</td><td>Define scope, build a WBS, allocate resources, and create a schedule/budget</td><td>Course 2 · Ch2</td></tr>
    <tr><td>CLO3</td><td>Define a communications management plan and identify &amp; manage risks</td><td>Course 3 · Ch3</td></tr>
    <tr><td>CLO4</td><td>Practise integrating all of the above into a complete project plan</td><td>Course 4 · Ch4</td></tr>
  </tbody>
</table>
<div class="callout">Notice CLO4 is "practise" — the capstone and the PE reward <em>applied</em> skill. Do not memorise definitions; produce artifacts (charter, WBS, network diagram, risk register, EVM table) until each is fast and automatic.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">Bốn CLO bao trọn vòng lập-làm-kiểm soát. PE kiểm bạn ở việc <em>làm</em> những cái này, không chỉ gọi tên.</p>
<table>
  <thead><tr><th>CLO</th><th>Bạn sẽ có thể…</th><th>Khoá</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Định nghĩa kế hoạch dự án và các thành phần khởi tạo dự án</td><td>Course 1 · Ch1</td></tr>
    <tr><td>CLO2</td><td>Xác định phạm vi, xây WBS, phân bổ nguồn lực, và tạo tiến độ/ngân sách</td><td>Course 2 · Ch2</td></tr>
    <tr><td>CLO3</td><td>Xác định kế hoạch quản lý truyền thông và nhận diện &amp; quản lý rủi ro</td><td>Course 3 · Ch3</td></tr>
    <tr><td>CLO4</td><td>Luyện tích hợp mọi cái trên thành một bản kế hoạch dự án hoàn chỉnh</td><td>Course 4 · Ch4</td></tr>
  </tbody>
</table>
<div class="callout">Để ý CLO4 là "luyện tập" — capstone và PE thưởng kỹ năng <em>áp dụng</em>. Đừng học vẹt định nghĩa; hãy tạo ra sản phẩm (charter, WBS, sơ đồ mạng, sổ rủi ro, bảng EVM) đến khi mỗi cái nhanh và tự động.</div>
</div>`,
        },
        {
          title: '0.4 — Tools & setup for project management|||0.4 — Công cụ & cài đặt cho quản trị dự án',
          slug: 'pmg201c-cong-cu',
          type: 'VIDEO',
          description: 'Coursera, GanttProject/MS Project, Excel EVM, Trello/Jira — và cách cài.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Your project-management toolkit</h2>
<p class="lead">The PE asks you to produce schedules and calculations. Having the right tools ready means you practise the technique, not fight the software.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Coursera</b> — the four courses; log the certificates. Your gate to the exam and the +1 bonus.</div>
  <div class="lz-layer"><b>GanttProject / MS Project / ProjectLibre</b> — build a WBS, network diagram, and Gantt chart.</div>
  <div class="lz-layer"><b>Excel / Google Sheets</b> — estimating, critical-path tables, and Earned Value (CPI/SPI).</div>
  <div class="lz-layer"><b>Trello / Jira</b> — track tasks and simulate execution/monitoring on a real board.</div>
  <div class="lz-layer"><b>Miro / Lucidchart</b> — draw stakeholder maps and network diagrams cleanly.</div>
</div>
<a class="link-card exphub" href="/exp-hub/pmg201c-cong-cu-du-an?ref=%2Fcourses%2Fproject-management%2Flearn&reflabel=PMG201c" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Set up your PM tools — step by step</span><span class="lc-sub">Install GanttProject, an Excel EVM template and a Trello board, with links, on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout ok">A tool draws the Gantt chart, but it cannot decide the <strong>logic</strong> — which task depends on which. Learn to build a network diagram <em>by hand</em> first; the software only speeds up what you already understand.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Bộ công cụ quản trị dự án của bạn</h2>
<p class="lead">PE yêu cầu bạn tạo tiến độ và tính toán. Có công cụ sẵn sàng nghĩa là bạn luyện kỹ thuật, không phải vật lộn với phần mềm.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Coursera</b> — bốn khoá học; lưu chứng chỉ. Cánh cổng vào phòng thi và +1 điểm thưởng.</div>
  <div class="lz-layer"><b>GanttProject / MS Project / ProjectLibre</b> — xây WBS, sơ đồ mạng, và biểu đồ Gantt.</div>
  <div class="lz-layer"><b>Excel / Google Sheets</b> — ước lượng, bảng đường găng, và Earned Value (CPI/SPI).</div>
  <div class="lz-layer"><b>Trello / Jira</b> — theo dõi công việc và mô phỏng thực hiện/giám sát trên bảng thật.</div>
  <div class="lz-layer"><b>Miro / Lucidchart</b> — vẽ bản đồ stakeholder và sơ đồ mạng gọn gàng.</div>
</div>
<a class="link-card exphub" href="/exp-hub/pmg201c-cong-cu-du-an?ref=%2Fcourses%2Fproject-management%2Flearn&reflabel=PMG201c" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài đặt công cụ PM — từng bước</span><span class="lc-sub">Cài GanttProject, mẫu Excel EVM và một bảng Trello, kèm link, trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout ok">Công cụ vẽ biểu đồ Gantt, nhưng không quyết định được <strong>logic</strong> — việc nào phụ thuộc việc nào. Hãy học dựng sơ đồ mạng <em>bằng tay</em> trước; phần mềm chỉ tăng tốc điều bạn đã hiểu.</div>
</div>`,
        },
        {
          title: '0.5 — Capstone project topic bank & how to choose (mentor guide)|||0.5 — Ngân hàng đề tài capstone & cách chọn (mentor)',
          slug: 'pmg201c-ngan-hang-de-tai',
          type: 'VIDEO',
          description: '12 đề tài dự án đã kiểm phạm vi cho capstone + rubric 6 phép thử chọn đề dễ lập kế hoạch.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Choosing your capstone project</h2>
<p class="lead">The Capstone asks you to write a full project plan for a project <strong>you choose</strong>. The right project is one you can fully <em>plan</em> — with a clear scope, 15–30 tasks, real dependencies, identifiable risks, and a measurable budget. Too big and you drown; too vague and you have nothing to schedule.</p>
<h3>The 6-test rubric — score a project before committing</h3>
<table>
  <thead><tr><th>#</th><th>Test</th><th>Ask yourself</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Clear deliverable</td><td>Can you name the finished product in one sentence?</td></tr>
    <tr><td>2</td><td>Right size</td><td>Does it break into 15–30 tasks (not 5, not 200)?</td></tr>
    <tr><td>3</td><td>Real dependencies</td><td>Do some tasks clearly depend on others (so a critical path exists)?</td></tr>
    <tr><td>4</td><td>Estimable</td><td>Can you put a duration and cost on each task?</td></tr>
    <tr><td>5</td><td>Has risks</td><td>Are there ≥5 realistic risks to manage?</td></tr>
    <tr><td>6</td><td>Stakeholders</td><td>Are there ≥3 distinct stakeholders with different interests?</td></tr>
  </tbody>
</table>
<h3>Topic bank — 12 scope-checked projects</h3>
<p>Each is planning-friendly: a clear deliverable, natural phases, and obvious risks.</p>
<ol>
  <li>Organise a two-day university tech conference (200 attendees)</li>
  <li>Launch a campus food-delivery mobile app (MVP in one semester)</li>
  <li>Migrate a company's on-premise files to the cloud</li>
  <li>Plan and run a charity fun-run event</li>
  <li>Build and deploy a departmental website with a CMS</li>
  <li>Open a small coffee shop (fit-out to opening day)</li>
  <li>Roll out a new HR system across a 100-person company</li>
  <li>Produce a 6-episode educational YouTube series</li>
  <li>Set up a computer lab for a rural school (20 machines)</li>
  <li>Organise a hackathon weekend with sponsors and prizes</li>
  <li>Develop and release a mobile game (small studio)</li>
  <li>Plan a product launch marketing campaign (8 weeks)</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write a one-line "project charter statement" before you commit.</b> Format: <em>"Deliver [product] for [stakeholder] by [date] within [budget], so that [benefit]."</em> If you cannot fill every bracket, the project is not yet defined enough to plan. This single sentence — the seed of a real project charter — filters vague ideas faster than any checklist.</div>
<div class="pitfall">Avoid "research"-style topics ("investigate AI in healthcare"). They have no deliverable, no tasks, and no critical path — nothing to <em>manage</em>. A capstone project must <strong>produce something concrete</strong> by a deadline.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Chọn dự án capstone</h2>
<p class="lead">Capstone yêu cầu bạn viết một bản kế hoạch dự án hoàn chỉnh cho một dự án <strong>bạn tự chọn</strong>. Dự án đúng là dự án bạn có thể <em>lập kế hoạch</em> trọn vẹn — phạm vi rõ, 15–30 công việc, phụ thuộc thật, rủi ro nhận diện được, và ngân sách đo được. To quá thì chìm; mơ hồ quá thì chẳng có gì để lên lịch.</p>
<h3>Rubric 6 phép thử — chấm dự án trước khi cam kết</h3>
<table>
  <thead><tr><th>#</th><th>Phép thử</th><th>Tự hỏi</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Sản phẩm rõ</td><td>Bạn gọi tên được sản phẩm hoàn thành trong một câu không?</td></tr>
    <tr><td>2</td><td>Đúng cỡ</td><td>Có chia thành 15–30 công việc (không phải 5, không phải 200)?</td></tr>
    <tr><td>3</td><td>Phụ thuộc thật</td><td>Có việc rõ ràng phụ thuộc việc khác (để có đường găng) không?</td></tr>
    <tr><td>4</td><td>Ước lượng được</td><td>Bạn gán được thời lượng và chi phí cho mỗi việc không?</td></tr>
    <tr><td>5</td><td>Có rủi ro</td><td>Có ≥5 rủi ro thực tế để quản lý không?</td></tr>
    <tr><td>6</td><td>Các bên liên quan</td><td>Có ≥3 bên liên quan khác nhau với lợi ích khác nhau không?</td></tr>
  </tbody>
</table>
<h3>Ngân hàng đề tài — 12 dự án đã kiểm phạm vi</h3>
<p>Mỗi cái dễ lập kế hoạch: sản phẩm rõ, các pha tự nhiên, và rủi ro hiển nhiên.</p>
<ol>
  <li>Tổ chức hội nghị công nghệ hai ngày ở trường (200 người)</li>
  <li>Ra mắt app giao đồ ăn trong campus (MVP một học kỳ)</li>
  <li>Chuyển tệp on-premise của công ty lên cloud</li>
  <li>Lập và chạy một sự kiện chạy bộ gây quỹ từ thiện</li>
  <li>Xây và triển khai website phòng ban có CMS</li>
  <li>Mở một quán cà phê nhỏ (thi công đến ngày khai trương)</li>
  <li>Triển khai hệ thống HR mới cho công ty 100 người</li>
  <li>Sản xuất chuỗi 6 tập YouTube giáo dục</li>
  <li>Lắp phòng máy tính cho một trường vùng quê (20 máy)</li>
  <li>Tổ chức một cuối tuần hackathon có nhà tài trợ và giải thưởng</li>
  <li>Phát triển và phát hành một game mobile (studio nhỏ)</li>
  <li>Lập chiến dịch marketing ra mắt sản phẩm (8 tuần)</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết một câu "tuyên bố charter dự án" trước khi cam kết.</b> Khuôn: <em>"Bàn giao [sản phẩm] cho [bên liên quan] trước [ngày] trong [ngân sách], để [lợi ích]."</em> Nếu không điền hết được các ô, dự án chưa đủ rõ để lập kế hoạch. Câu duy nhất này — hạt giống của project charter thật — lọc ý tưởng mơ hồ nhanh hơn mọi checklist.</div>
<div class="pitfall">Tránh đề kiểu "nghiên cứu" ("khảo sát AI trong y tế"). Chúng không có sản phẩm, không công việc, không đường găng — chẳng có gì để <em>quản lý</em>. Dự án capstone phải <strong>tạo ra thứ cụ thể</strong> trước một hạn chót.</div>
</div>`,
        },
        {
          title: '0.6 — Why students lose marks & the formula for a high grade|||0.6 — Vì sao mất điểm & công thức điểm cao',
          slug: 'pmg201c-chong-mat-diem',
          type: 'VIDEO',
          description: '7 kiểu mất điểm trong PMG201c + cờ xanh/đỏ + công thức điểm cao — kiểu SWP391.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>Why students lose marks — and how to score high</h2>
<p class="lead">The TE catches conceptual gaps; the PE catches unpractised technique. Here is where marks leak, and the formula to keep them.</p>
<h3>The 7 ways to lose marks</h3>
<table>
  <thead><tr><th>#</th><th>Loss</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Confusing scope, WBS and schedule</td><td>Scope = WHAT; WBS = decomposition of the what; schedule = WHEN. Keep them distinct.</td></tr>
    <tr><td>2</td><td>Critical-path errors (wrong path or float)</td><td>Do forward + backward pass carefully; critical path = longest, float = 0.</td></tr>
    <tr><td>3</td><td>Guessing at estimates</td><td>Use a named method (analogous, parametric, three-point/PERT).</td></tr>
    <tr><td>4</td><td>Vague risk entries ("something might go wrong")</td><td>Each risk: cause → event → impact, with probability × impact and a response.</td></tr>
    <tr><td>5</td><td>Mixing up EVM terms (PV/EV/AC, CPI/SPI)</td><td>Memorise the formulas; practise one full EVM table.</td></tr>
    <tr><td>6</td><td>Ignoring change control</td><td>Every change goes through a documented request → assess → approve/reject.</td></tr>
    <tr><td>7</td><td>Neglecting the PE (practical)</td><td>Practise producing artifacts under time — the PE has its own ≥4 gate.</td></tr>
  </tbody>
</table>
<h3>Green flags vs red flags</h3>
<div class="kv-grid">
  <div class="kv"><b>🟢 Green</b><span>Clear charter · decomposed WBS · correct critical path · quantified risks · EVM tracked · change log</span></div>
  <div class="kv"><b>🔴 Red</b><span>Scope = task list · no dependencies · gut-feel estimates · "risks: bugs" · no progress measure</span></div>
</div>
<div class="formula"><span class="lbl">HIGH-GRADE FORMULA</span> Solid TE theory + fluent PE artifacts (WBS · network/CPM · risk register · EVM) + the MOOC bonus + practising each calculation until it is automatic</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Build a one-page "formula card" and rehearse it.</b> PERT = (O + 4M + P)/6; EV = %complete × BAC-of-task; CPI = EV/AC; SPI = EV/PV; EAC = BAC/CPI. On the PE, students who can recall and apply these in seconds finish calmly; those who re-derive them mid-exam run out of time. The syllabus lists the concepts — a rehearsed formula card is what makes them exam-fast.</div>
<div class="pitfall">Do not treat the two exams as one blended average. Because <strong>PE ≥ 4 and TE ≥ 4 are separate gates</strong>, a brilliant TE cannot rescue a weak PE. Split your revision time roughly 50/50, theory and practice.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>Vì sao sinh viên mất điểm — và cách điểm cao</h2>
<p class="lead">TE bắt lỗ hổng khái niệm; PE bắt kỹ thuật chưa luyện. Đây là nơi điểm rò rỉ, và công thức giữ chúng lại.</p>
<h3>7 kiểu mất điểm</h3>
<table>
  <thead><tr><th>#</th><th>Mất điểm</th><th>Cách sửa</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Lẫn phạm vi, WBS và tiến độ</td><td>Phạm vi = CÁI GÌ; WBS = phân rã cái gì; tiến độ = KHI NÀO. Giữ tách bạch.</td></tr>
    <tr><td>2</td><td>Sai đường găng (sai đường hoặc float)</td><td>Làm forward + backward pass cẩn thận; đường găng = dài nhất, float = 0.</td></tr>
    <tr><td>3</td><td>Đoán mò ước lượng</td><td>Dùng phương pháp có tên (analogous, parametric, three-point/PERT).</td></tr>
    <tr><td>4</td><td>Mục rủi ro mơ hồ ("có thể có gì đó sai")</td><td>Mỗi rủi ro: nguyên nhân → sự kiện → tác động, có xác suất × tác động và cách ứng phó.</td></tr>
    <tr><td>5</td><td>Lẫn thuật ngữ EVM (PV/EV/AC, CPI/SPI)</td><td>Học thuộc công thức; luyện một bảng EVM đầy đủ.</td></tr>
    <tr><td>6</td><td>Bỏ qua kiểm soát thay đổi</td><td>Mọi thay đổi qua một yêu cầu ghi lại → đánh giá → duyệt/từ chối.</td></tr>
    <tr><td>7</td><td>Lơ là PE (thực hành)</td><td>Luyện tạo sản phẩm có tính giờ — PE có cổng ≥4 riêng.</td></tr>
  </tbody>
</table>
<h3>Cờ xanh vs cờ đỏ</h3>
<div class="kv-grid">
  <div class="kv"><b>🟢 Xanh</b><span>Charter rõ · WBS phân rã · đường găng đúng · rủi ro định lượng · EVM theo dõi · nhật ký thay đổi</span></div>
  <div class="kv"><b>🔴 Đỏ</b><span>Phạm vi = danh sách việc · không phụ thuộc · ước lượng cảm tính · "rủi ro: bug" · không đo tiến độ</span></div>
</div>
<div class="formula"><span class="lbl">CÔNG THỨC ĐIỂM CAO</span> Lý thuyết TE chắc + sản phẩm PE thuần thục (WBS · network/CPM · sổ rủi ro · EVM) + điểm thưởng MOOC + luyện mỗi phép tính đến khi tự động</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Làm một "thẻ công thức" một trang và tập nhẩm.</b> PERT = (O + 4M + P)/6; EV = %hoàn thành × BAC-của-việc; CPI = EV/AC; SPI = EV/PV; EAC = BAC/CPI. Ở PE, sinh viên nhớ và áp dụng chúng trong vài giây thì làm xong bình tĩnh; ai tự dựng lại giữa giờ thi thì hết giờ. Giáo trình liệt kê khái niệm — một thẻ công thức đã tập là thứ làm chúng nhanh trong phòng thi.</div>
<div class="pitfall">Đừng coi hai bài thi như một trung bình gộp. Vì <strong>PE ≥ 4 và TE ≥ 4 là hai cổng riêng</strong>, một TE xuất sắc không cứu được PE yếu. Chia thời gian ôn khoảng 50/50, lý thuyết và thực hành.</div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — COURSE 1: INITIATING & PLANNING ══════════════════ */
    {
      title: 'Chapter 1 — Course 1: Initiating & planning projects|||Chương 1 — Course 1: Khởi tạo & lập kế hoạch dự án',
      description: 'Dự án là gì, tam giác ràng buộc, vòng đời dự án, các bên liên quan, phạm vi và project charter.',
      lessons: [
        {
          title: '1.1 — What is a project? Triple constraint & life cycle|||1.1 — Dự án là gì? Tam giác ràng buộc & vòng đời',
          slug: 'pmg201c-1-1-what-is-project',
          type: 'VIDEO',
          description: 'Định nghĩa dự án vs vận hành, tam giác phạm vi–thời gian–chi phí, và vòng đời dự án.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>What is a project?</h2>
<p class="lead">A <strong>project</strong> is temporary (start and end) and produces a unique result. <strong>Operations</strong> are ongoing and repetitive. Building a new app = project; answering support tickets forever = operations.</p>
<h3>The triple constraint (the iron triangle)</h3>
<p>Every project balances three linked forces. Change one and at least one other must move:</p>
<div class="lz-flow">
  <div class="lz-step"><b>Scope</b><span>what will be delivered</span></div>
  <div class="lz-step"><b>Time</b><span>the schedule / deadline</span></div>
  <div class="lz-step"><b>Cost</b><span>the budget / resources</span></div>
</div>
<div class="out"><b>Worked example — the triangle in action:</b> Your client says "add a payments feature" (more scope) but keeps the same deadline. Something must give: either <b>cost</b> rises (hire more developers) or <b>quality</b> drops (rush and ship bugs). A project manager makes this trade-off <em>explicit</em> and gets the client to choose — rather than silently missing the deadline.</div>
<h3>The project life cycle</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Initiating</div><div class="lz-nsub">Why? Charter, stakeholders, high-level scope</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Planning</div><div class="lz-nsub">Scope, WBS, schedule, budget, risk plan</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Executing</div><div class="lz-nsub">Do the work, lead the team</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Monitoring &amp; Controlling</div><div class="lz-nsub">Measure, manage change, correct course</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Closing</div><div class="lz-nsub">Deliver, sign off, capture lessons</div></div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Add "quality" and "risk" — the triangle is really a star.</b> Modern PMBOK treats scope, time, cost, quality, resources and risk as six interacting constraints. Squeezing time usually inflates cost <em>and</em> risk while cutting quality. Thinking in six dimensions, not three, is why senior PMs anticipate the side-effects the basic triangle hides.</div>
<div class="pitfall">"Scope creep" — quietly adding features without adjusting time or cost — is the number-one project killer. Every new request must be evaluated against the triangle, not just said "yes" to.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Dự án là gì?</h2>
<p class="lead">Một <strong>dự án</strong> là tạm thời (có đầu, có cuối) và tạo ra một kết quả duy nhất. <strong>Vận hành</strong> là liên tục và lặp lại. Xây một app mới = dự án; trả lời ticket hỗ trợ mãi mãi = vận hành.</p>
<h3>Tam giác ràng buộc (tam giác sắt)</h3>
<p>Mọi dự án cân bằng ba lực gắn với nhau. Đổi một thì ít nhất một cái khác phải dịch:</p>
<div class="lz-flow">
  <div class="lz-step"><b>Phạm vi</b><span>cái gì sẽ được bàn giao</span></div>
  <div class="lz-step"><b>Thời gian</b><span>tiến độ / hạn chót</span></div>
  <div class="lz-step"><b>Chi phí</b><span>ngân sách / nguồn lực</span></div>
</div>
<div class="out"><b>Ví dụ có lời giải — tam giác vận hành:</b> Khách hàng nói "thêm tính năng thanh toán" (thêm phạm vi) nhưng giữ nguyên hạn chót. Phải có cái nhường: hoặc <b>chi phí</b> tăng (thuê thêm dev) hoặc <b>chất lượng</b> giảm (làm vội, ship bug). Người quản lý dự án làm đánh đổi này <em>rõ ràng</em> và để khách chọn — thay vì âm thầm trễ hạn.</div>
<h3>Vòng đời dự án</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Khởi tạo</div><div class="lz-nsub">Vì sao? Charter, các bên liên quan, phạm vi cấp cao</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Lập kế hoạch</div><div class="lz-nsub">Phạm vi, WBS, tiến độ, ngân sách, kế hoạch rủi ro</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Thực hiện</div><div class="lz-nsub">Làm việc, dẫn dắt nhóm</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Giám sát &amp; Kiểm soát</div><div class="lz-nsub">Đo, quản lý thay đổi, chỉnh hướng</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Kết thúc</div><div class="lz-nsub">Bàn giao, ký nghiệm thu, ghi bài học</div></div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thêm "chất lượng" và "rủi ro" — tam giác thực ra là ngôi sao.</b> PMBOK hiện đại coi phạm vi, thời gian, chi phí, chất lượng, nguồn lực và rủi ro là sáu ràng buộc tương tác. Ép thời gian thường thổi phồng chi phí <em>và</em> rủi ro trong khi cắt chất lượng. Tư duy sáu chiều, không phải ba, là lý do PM cấp cao lường trước các tác dụng phụ mà tam giác cơ bản giấu đi.</div>
<div class="pitfall">"Scope creep" — âm thầm thêm tính năng mà không chỉnh thời gian hay chi phí — là kẻ giết dự án số một. Mọi yêu cầu mới phải được đánh giá theo tam giác, không chỉ nói "được".</div>
</div>`,
        },
        {
          title: '1.2 — Stakeholders, scope & the project charter|||1.2 — Các bên liên quan, phạm vi & project charter',
          slug: 'pmg201c-1-2-stakeholders-charter',
          type: 'VIDEO',
          description: 'Nhận diện & phân loại stakeholder (power/interest), viết charter, và tuyên bố phạm vi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Stakeholders, scope &amp; the charter</h2>
<p class="lead">Before any schedule, you must answer three questions: <em>Who cares? What exactly are we delivering? Who authorises it?</em> The stakeholder analysis, scope statement, and charter answer these.</p>
<h3>Stakeholder analysis — the power/interest grid</h3>
<p>Plot each stakeholder by how much power they hold and how much interest they have. Your strategy differs per quadrant:</p>
<table>
  <thead><tr><th></th><th>Low interest</th><th>High interest</th></tr></thead>
  <tbody>
    <tr><td><b>High power</b></td><td>Keep satisfied (sponsor who is busy)</td><td>Manage closely (client, key sponsor)</td></tr>
    <tr><td><b>Low power</b></td><td>Monitor (minimal effort)</td><td>Keep informed (end users)</td></tr>
  </tbody>
</table>
<h3>Authority vs influence</h3>
<p><strong>Authority</strong> is formal power to decide (the sponsor signs the budget). <strong>Influence</strong> is the informal ability to sway others (a respected senior engineer). Good PMs use both — and know who has which.</p>
<h3>The project charter</h3>
<div class="out"><b>A charter authorises the project and names, at minimum:</b><br>
• Purpose / business case (why)<br>
• High-level scope &amp; deliverables (what)<br>
• Objectives &amp; success criteria (how we know we won)<br>
• Key stakeholders &amp; the sponsor<br>
• High-level budget, timeline &amp; major risks<br>
• The project manager and their authority<br>
<em>The charter is signed by the sponsor — it is the PM's mandate to spend time and money.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write a scope statement with an explicit "out of scope" list.</b> Most scope disputes come from unstated assumptions. Listing what you are <em>not</em> doing ("mobile app is out of scope for phase 1") is often more powerful than listing what you are — it pre-empts scope creep and protects the deadline. The syllabus teaches "define scope"; professionals define the boundary in both directions.</div>
<div class="pitfall">Do not confuse the <strong>product scope</strong> (features of the thing) with the <strong>project scope</strong> (work needed to deliver it). Exam questions test this distinction; a WBS decomposes the <em>project</em> scope (the work), not just the feature list.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Các bên liên quan, phạm vi &amp; charter</h2>
<p class="lead">Trước mọi tiến độ, bạn phải trả lời ba câu: <em>Ai quan tâm? Chính xác chúng ta bàn giao gì? Ai cho phép?</em> Phân tích stakeholder, tuyên bố phạm vi, và charter trả lời những cái này.</p>
<h3>Phân tích stakeholder — lưới quyền lực/quan tâm</h3>
<p>Đặt mỗi bên liên quan theo mức quyền lực họ nắm và mức quan tâm họ có. Chiến lược khác nhau theo mỗi ô:</p>
<table>
  <thead><tr><th></th><th>Ít quan tâm</th><th>Rất quan tâm</th></tr></thead>
  <tbody>
    <tr><td><b>Quyền lực cao</b></td><td>Giữ hài lòng (sponsor bận)</td><td>Quản lý sát (khách, sponsor chính)</td></tr>
    <tr><td><b>Quyền lực thấp</b></td><td>Theo dõi (nỗ lực tối thiểu)</td><td>Giữ thông tin (người dùng cuối)</td></tr>
  </tbody>
</table>
<h3>Quyền hạn vs ảnh hưởng</h3>
<p><strong>Quyền hạn (authority)</strong> là quyền chính thức để quyết (sponsor ký ngân sách). <strong>Ảnh hưởng (influence)</strong> là khả năng phi chính thức tác động người khác (một kỹ sư senior được nể). PM giỏi dùng cả hai — và biết ai có cái nào.</p>
<h3>Project charter</h3>
<div class="out"><b>Charter cho phép dự án và nêu, tối thiểu:</b><br>
• Mục đích / business case (vì sao)<br>
• Phạm vi cấp cao &amp; sản phẩm bàn giao (cái gì)<br>
• Mục tiêu &amp; tiêu chí thành công (biết mình thắng thế nào)<br>
• Các bên liên quan chính &amp; sponsor<br>
• Ngân sách cấp cao, timeline &amp; rủi ro lớn<br>
• Người quản lý dự án và quyền hạn của họ<br>
<em>Charter do sponsor ký — nó là mệnh lệnh cho PM được chi thời gian và tiền.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết tuyên bố phạm vi có danh sách "ngoài phạm vi" rõ ràng.</b> Phần lớn tranh cãi phạm vi đến từ giả định không nói ra. Liệt kê cái bạn <em>không</em> làm ("app mobile ngoài phạm vi pha 1") thường mạnh hơn liệt kê cái bạn làm — nó chặn trước scope creep và bảo vệ hạn chót. Giáo trình dạy "xác định phạm vi"; người chuyên nghiệp xác định ranh giới cả hai chiều.</div>
<div class="pitfall">Đừng lẫn <strong>phạm vi sản phẩm</strong> (tính năng của thứ đó) với <strong>phạm vi dự án</strong> (công việc cần để bàn giao). Câu hỏi thi kiểm tra phân biệt này; WBS phân rã phạm vi <em>dự án</em> (công việc), không chỉ danh sách tính năng.</div>
</div>`,
        },
        {
          title: 'Quiz 1 — Initiating & planning|||Quiz 1 — Khởi tạo & lập kế hoạch',
          slug: 'pmg201c-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra dự án vs vận hành, tam giác ràng buộc, stakeholder và charter.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A project is best defined as…|||Dự án được định nghĩa tốt nhất là…', options: ['ongoing repetitive work|||công việc lặp lại liên tục', 'a temporary effort producing a unique result|||nỗ lực tạm thời tạo kết quả duy nhất', 'any task with a computer|||bất kỳ việc gì có máy tính', 'a permanent department|||một phòng ban thường trực'], correctIndex: 1, points: 1 },
              { question: 'In the triple constraint, if scope increases but time is fixed, then…|||Trong tam giác ràng buộc, nếu phạm vi tăng mà thời gian cố định, thì…', options: ['nothing else changes|||không gì khác đổi', 'cost and/or quality must change|||chi phí và/hoặc chất lượng phải đổi', 'the project is cancelled|||dự án bị huỷ', 'risk disappears|||rủi ro biến mất'], correctIndex: 1, points: 1 },
              { question: 'A stakeholder with high power and high interest should be…|||Một bên liên quan quyền lực cao, quan tâm cao nên được…', options: ['monitored with minimal effort|||theo dõi tối thiểu', 'managed closely|||quản lý sát', 'ignored|||bỏ qua', 'kept uninformed|||giữ không thông tin'], correctIndex: 1, points: 1 },
              { question: 'The project charter is primarily used to…|||Project charter chủ yếu dùng để…', options: ['list every task in detail|||liệt kê mọi việc chi tiết', 'authorise the project and empower the PM|||cho phép dự án và trao quyền cho PM', 'write the source code|||viết mã nguồn', 'replace the WBS|||thay thế WBS'], correctIndex: 1, points: 1 },
              { question: 'Silently adding features without adjusting time or cost is called…|||Âm thầm thêm tính năng không chỉnh thời gian hay chi phí gọi là…', options: ['fast-tracking', 'scope creep', 'crashing', 'leveling'], correctIndex: 1, points: 1 },
              { question: 'Formal power to decide (e.g., signing the budget) is called… while informally swaying others is… (beyond-syllabus)|||Quyền chính thức để quyết (vd ký ngân sách) là… còn tác động phi chính thức người khác là… (ngoài giáo trình)', options: ['influence; authority|||ảnh hưởng; quyền hạn', 'authority; influence|||quyền hạn; ảnh hưởng', 'scope; cost|||phạm vi; chi phí', 'risk; quality|||rủi ro; chất lượng'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — COURSE 2: BUDGETING & SCHEDULING ══════════════════ */
    {
      title: 'Chapter 2 — Course 2: Budgeting & scheduling projects|||Chương 2 — Course 2: Ngân sách & tiến độ dự án',
      description: 'WBS, ước lượng (analogous/parametric/PERT), sơ đồ mạng, đường găng CPM, float, và biểu đồ Gantt.',
      lessons: [
        {
          title: '2.1 — WBS, resources & estimating|||2.1 — WBS, nguồn lực & ước lượng',
          slug: 'pmg201c-2-1-wbs-estimating',
          type: 'VIDEO',
          description: 'Phân rã công việc thành WBS, phân bổ nguồn lực, và ba phương pháp ước lượng gồm PERT.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Work breakdown structure (WBS) &amp; estimating</h2>
<p class="lead">You cannot schedule or budget a vague project. The WBS decomposes the whole scope into small, estimable <strong>work packages</strong> — the atoms of a plan.</p>
<h3>The WBS — decompose until estimable</h3>
<p>Break the deliverable into phases → tasks → work packages. A work package is small enough to estimate its duration and cost (rule of thumb: 8–80 hours).</p>
<div class="diagram">Project: Campus App
├─ 1 Planning
│  ├─ 1.1 Requirements
│  └─ 1.2 UI mockups
├─ 2 Development
│  ├─ 2.1 Backend API
│  ├─ 2.2 Mobile app
│  └─ 2.3 Integration
└─ 3 Launch
   ├─ 3.1 Testing
   └─ 3.2 Deployment</div>
<h3>Three estimating methods</h3>
<table>
  <thead><tr><th>Method</th><th>How</th><th>When</th></tr></thead>
  <tbody>
    <tr><td>Analogous</td><td>Compare to a similar past project</td><td>Early, little detail (fast, rough)</td></tr>
    <tr><td>Parametric</td><td>Unit rate × quantity (e.g., 200 LOC/day)</td><td>When you have a measurable driver</td></tr>
    <tr><td>Three-point (PERT)</td><td>Weighted optimistic/most-likely/pessimistic</td><td>When uncertainty is high</td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">PERT ESTIMATE</span> E = (O + 4M + P) / 6 &nbsp;·&nbsp; where O = optimistic, M = most likely, P = pessimistic</div>
<div class="out"><b>Worked example — PERT:</b> A task is optimistically 4 days, most likely 6 days, pessimistically 14 days.<br>
E = (4 + 4×6 + 14) / 6 = (4 + 24 + 14) / 6 = 42 / 6 = <b>7 days</b>.<br>
<em>PERT pulls the estimate toward the most-likely value but respects the long tail of the pessimistic case — more honest than a single guess.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>PERT also gives you the uncertainty, not just the mean.</b> Standard deviation ≈ (P − O)/6. In the example, σ ≈ (14 − 4)/6 ≈ 1.7 days. A large σ flags a risky task worth padding or investigating. Reporting an estimate as "7 days ± 1.7" is far more professional than a bare "7 days" — the syllabus gives the mean formula but rarely the spread.</div>
<div class="pitfall">Do not estimate the <strong>whole project</strong> in one number. Estimate each work package, then roll up (bottom-up). A single top-down guess is almost always wrong and hides where the risk lives.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Cấu trúc phân rã công việc (WBS) &amp; ước lượng</h2>
<p class="lead">Bạn không thể lên lịch hay ngân sách một dự án mơ hồ. WBS phân rã toàn bộ phạm vi thành các <strong>gói công việc (work package)</strong> nhỏ, ước lượng được — nguyên tử của một bản kế hoạch.</p>
<h3>WBS — phân rã đến khi ước lượng được</h3>
<p>Chia sản phẩm bàn giao thành pha → công việc → gói công việc. Một gói công việc đủ nhỏ để ước lượng thời lượng và chi phí (kinh nghiệm: 8–80 giờ).</p>
<div class="diagram">Dự án: Campus App
├─ 1 Lập kế hoạch
│  ├─ 1.1 Yêu cầu
│  └─ 1.2 Mockup giao diện
├─ 2 Phát triển
│  ├─ 2.1 Backend API
│  ├─ 2.2 App mobile
│  └─ 2.3 Tích hợp
└─ 3 Ra mắt
   ├─ 3.1 Kiểm thử
   └─ 3.2 Triển khai</div>
<h3>Ba phương pháp ước lượng</h3>
<table>
  <thead><tr><th>Phương pháp</th><th>Cách</th><th>Khi nào</th></tr></thead>
  <tbody>
    <tr><td>Analogous (tương tự)</td><td>So với dự án quá khứ tương tự</td><td>Sớm, ít chi tiết (nhanh, thô)</td></tr>
    <tr><td>Parametric (tham số)</td><td>Đơn giá × số lượng (vd 200 LOC/ngày)</td><td>Khi có một driver đo được</td></tr>
    <tr><td>Three-point (PERT)</td><td>Trọng số lạc quan/thường/bi quan</td><td>Khi bất định cao</td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">ƯỚC LƯỢNG PERT</span> E = (O + 4M + P) / 6 &nbsp;·&nbsp; với O = lạc quan, M = thường gặp, P = bi quan</div>
<div class="out"><b>Ví dụ có lời giải — PERT:</b> Một công việc lạc quan 4 ngày, thường gặp 6 ngày, bi quan 14 ngày.<br>
E = (4 + 4×6 + 14) / 6 = (4 + 24 + 14) / 6 = 42 / 6 = <b>7 ngày</b>.<br>
<em>PERT kéo ước lượng về giá trị thường gặp nhưng tôn trọng cái đuôi dài của trường hợp bi quan — trung thực hơn một cú đoán đơn.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>PERT còn cho bạn độ bất định, không chỉ trung bình.</b> Độ lệch chuẩn ≈ (P − O)/6. Trong ví dụ, σ ≈ (14 − 4)/6 ≈ 1.7 ngày. σ lớn báo hiệu một việc rủi ro đáng đệm hoặc điều tra thêm. Báo ước lượng "7 ngày ± 1.7" chuyên nghiệp hơn nhiều so với "7 ngày" trơn — giáo trình cho công thức trung bình nhưng ít khi cho độ trải.</div>
<div class="pitfall">Đừng ước lượng <strong>cả dự án</strong> bằng một con số. Ước lượng từng gói công việc, rồi cộng dồn (bottom-up). Một cú đoán top-down đơn hầu như luôn sai và giấu nơi rủi ro nằm.</div>
</div>`,
        },
        {
          title: '2.2 — Network diagrams, the critical path (CPM) & Gantt|||2.2 — Sơ đồ mạng, đường găng (CPM) & Gantt',
          slug: 'pmg201c-2-2-critical-path',
          type: 'VIDEO',
          description: 'Dựng sơ đồ mạng từ phụ thuộc, tính forward/backward pass, đường găng, float, và nén tiến độ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>The critical path (CPM)</h2>
<p class="lead">The critical path is the <strong>longest chain of dependent tasks</strong> — it sets the shortest possible project duration. Any delay on it delays the whole project. This is the single most-tested PE topic.</p>
<h3>Worked example — find the critical path</h3>
<div class="out"><b>Tasks (duration, depends on):</b><br>
A (3d, start) · B (4d, after A) · C (2d, after A) · D (5d, after B) · E (3d, after C) · F (2d, after D &amp; E)<br><br>
<b>Paths and lengths:</b><br>
• A→B→D→F = 3+4+5+2 = <b>14 days</b> ← longest = CRITICAL PATH<br>
• A→C→E→F = 3+2+3+2 = 10 days<br><br>
<b>Float on the non-critical path:</b> path A→C→E→F is 10 days; it can slip up to 14 − 10 = <b>4 days</b> without delaying the project. Tasks C and E have float; A, B, D, F have zero float (critical).</div>
<h3>Forward &amp; backward pass (how float is computed)</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Forward pass</b><span>compute Earliest Start/Finish left-to-right</span></div>
  <div class="lz-step"><b>Backward pass</b><span>compute Latest Start/Finish right-to-left</span></div>
  <div class="lz-step"><b>Float</b><span>Float = Latest Start − Earliest Start (0 on the critical path)</span></div>
</div>
<h3>Compressing the schedule</h3>
<table>
  <thead><tr><th>Technique</th><th>What</th><th>Cost</th></tr></thead>
  <tbody>
    <tr><td>Crashing</td><td>Add resources to critical tasks</td><td>More money</td></tr>
    <tr><td>Fast-tracking</td><td>Run tasks in parallel that were sequential</td><td>More risk (rework)</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Only crash tasks ON the critical path.</b> Adding people to a non-critical task wastes money and shortens nothing — the project is still gated by the critical path. And crashing can create a <em>new</em> critical path: once you shorten the longest path enough, a different path becomes the longest. Always re-check the critical path after every compression. The syllabus teaches crashing; the pro habit is re-computing the path afterwards.</div>
<div class="pitfall">Do not confuse the critical path (schedule) with "critical" (important) tasks. A low-importance task with zero float is still on the critical path; a vital feature with lots of float is not. The critical path is purely about <strong>dependency and duration</strong>.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Đường găng (CPM)</h2>
<p class="lead">Đường găng là <strong>chuỗi dài nhất các công việc phụ thuộc</strong> — nó đặt thời lượng dự án ngắn nhất có thể. Bất kỳ trễ nào trên nó làm trễ cả dự án. Đây là chủ đề PE được kiểm nhiều nhất.</p>
<h3>Ví dụ có lời giải — tìm đường găng</h3>
<div class="out"><b>Công việc (thời lượng, phụ thuộc):</b><br>
A (3d, bắt đầu) · B (4d, sau A) · C (2d, sau A) · D (5d, sau B) · E (3d, sau C) · F (2d, sau D &amp; E)<br><br>
<b>Các đường và độ dài:</b><br>
• A→B→D→F = 3+4+5+2 = <b>14 ngày</b> ← dài nhất = ĐƯỜNG GĂNG<br>
• A→C→E→F = 3+2+3+2 = 10 ngày<br><br>
<b>Float trên đường không găng:</b> đường A→C→E→F dài 10 ngày; nó có thể trễ tối đa 14 − 10 = <b>4 ngày</b> mà không làm trễ dự án. Công việc C và E có float; A, B, D, F có float bằng 0 (găng).</div>
<h3>Forward &amp; backward pass (float được tính thế nào)</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Forward pass</b><span>tính Sớm nhất Bắt đầu/Kết thúc từ trái sang phải</span></div>
  <div class="lz-step"><b>Backward pass</b><span>tính Muộn nhất Bắt đầu/Kết thúc từ phải sang trái</span></div>
  <div class="lz-step"><b>Float</b><span>Float = Muộn nhất Bắt đầu − Sớm nhất Bắt đầu (0 trên đường găng)</span></div>
</div>
<h3>Nén tiến độ</h3>
<table>
  <thead><tr><th>Kỹ thuật</th><th>Là gì</th><th>Cái giá</th></tr></thead>
  <tbody>
    <tr><td>Crashing</td><td>Thêm nguồn lực cho công việc găng</td><td>Tốn tiền hơn</td></tr>
    <tr><td>Fast-tracking</td><td>Chạy song song các việc vốn tuần tự</td><td>Rủi ro hơn (làm lại)</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chỉ crash các công việc TRÊN đường găng.</b> Thêm người vào việc không găng phí tiền và không rút ngắn gì — dự án vẫn bị chặn bởi đường găng. Và crashing có thể tạo <em>đường găng mới</em>: khi bạn rút đường dài nhất đủ nhiều, một đường khác thành dài nhất. Luôn kiểm lại đường găng sau mỗi lần nén. Giáo trình dạy crashing; thói quen pro là tính lại đường sau đó.</div>
<div class="pitfall">Đừng lẫn đường găng (tiến độ) với công việc "quan trọng". Một việc ít quan trọng có float 0 vẫn nằm trên đường găng; một tính năng sống còn có nhiều float thì không. Đường găng thuần về <strong>phụ thuộc và thời lượng</strong>.</div>
</div>`,
        },
        {
          title: 'Quiz 2 — Budgeting & scheduling|||Quiz 2 — Ngân sách & tiến độ',
          slug: 'pmg201c-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra WBS, ước lượng PERT, đường găng và nén tiến độ.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'A work package in a WBS should be…|||Một gói công việc trong WBS nên…', options: ['as large as possible|||càng lớn càng tốt', 'small enough to estimate duration and cost|||đủ nhỏ để ước lượng thời lượng và chi phí', 'a single line of code|||một dòng code', 'the whole project|||cả dự án'], correctIndex: 1, points: 1 },
              { question: 'PERT estimate for O=2, M=5, P=14 is…|||Ước lượng PERT với O=2, M=5, P=14 là…', options: ['5', '6', '7', '8'], correctIndex: 1, points: 1 },
              { question: 'The critical path is the… path through the network.|||Đường găng là đường… qua sơ đồ mạng.', options: ['shortest|||ngắn nhất', 'longest|||dài nhất', 'cheapest|||rẻ nhất', 'most important|||quan trọng nhất'], correctIndex: 1, points: 1 },
              { question: 'Tasks on the critical path have a float of…|||Công việc trên đường găng có float bằng…', options: ['maximum|||tối đa', 'zero|||không', 'one day always|||luôn một ngày', 'negative|||âm'], correctIndex: 1, points: 1 },
              { question: 'Running previously sequential tasks in parallel to save time is…|||Chạy song song các việc vốn tuần tự để tiết kiệm thời gian là…', options: ['crashing', 'fast-tracking', 'leveling', 'estimating'], correctIndex: 1, points: 1 },
              { question: 'After crashing the critical path, you must… because the critical path may change. (beyond-syllabus)|||Sau khi crash đường găng, bạn phải… vì đường găng có thể đổi. (ngoài giáo trình)', options: ['delete the WBS|||xoá WBS', 're-compute the critical path|||tính lại đường găng', 'add more scope|||thêm phạm vi', 'ignore float|||bỏ qua float'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — COURSE 3: RISK & CHANGE ══════════════════ */
    {
      title: 'Chapter 3 — Course 3: Managing risks & changes|||Chương 3 — Course 3: Quản lý rủi ro & thay đổi',
      description: 'Nhận diện & phân tích rủi ro, chiến lược ứng phó, sổ rủi ro, kế hoạch truyền thông, và kiểm soát thay đổi.',
      lessons: [
        {
          title: '3.1 — Risk management & the risk register|||3.1 — Quản lý rủi ro & sổ rủi ro',
          slug: 'pmg201c-3-1-risk',
          type: 'VIDEO',
          description: 'Quy trình rủi ro, phân tích định tính (P×I), bốn chiến lược ứng phó, và sổ rủi ro.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Risk management</h2>
<p class="lead">A risk is an <strong>uncertain event that, if it occurs, affects an objective</strong>. Good PMs do not eliminate risk (impossible) — they identify it early and plan a response before it hits.</p>
<h3>The risk process</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Identify</b><span>brainstorm, checklists, lessons learned</span></div>
  <div class="lz-step"><b>Analyse</b><span>score probability × impact</span></div>
  <div class="lz-step"><b>Plan response</b><span>choose a strategy per risk</span></div>
  <div class="lz-step"><b>Monitor</b><span>track in the risk register, review regularly</span></div>
</div>
<h3>Qualitative analysis — probability × impact</h3>
<div class="formula"><span class="lbl">RISK SCORE</span> Score = Probability × Impact &nbsp;·&nbsp; (rank risks; treat the high-score ones first)</div>
<div class="out"><b>Worked example:</b> "Key developer may quit." Probability = 0.3, Impact (on a 1–10 scale) = 9 → score = 2.7. "Server outage during demo." Probability = 0.1, Impact = 8 → score = 0.8. → Address the developer-attrition risk first; it carries the higher expected impact.</div>
<h3>Four response strategies (for threats)</h3>
<table>
  <thead><tr><th>Strategy</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Avoid</td><td>Remove the cause</td><td>Drop a risky feature entirely</td></tr>
    <tr><td>Transfer</td><td>Shift the impact to a third party</td><td>Buy insurance; outsource</td></tr>
    <tr><td>Mitigate</td><td>Reduce probability or impact</td><td>Cross-train two developers</td></tr>
    <tr><td>Accept</td><td>Do nothing but plan a reserve</td><td>Keep a contingency budget</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Risks are not only threats — they include opportunities.</b> The mirror strategies for positive risks are exploit, share, enhance, and accept. If a new library <em>might</em> cut your dev time in half, you can "exploit" it by planning the project around it. Treating uncertainty as two-sided — downside and upside — is a maturity the basic syllabus rarely emphasises.</div>
<div class="pitfall">A risk written as "bugs" or "delays" is useless. State it as <strong>cause → uncertain event → effect on objective</strong>: "Because the API is undocumented (cause), integration may take longer than planned (event), delaying launch by two weeks (impact)." Only then can you score and respond to it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Quản lý rủi ro</h2>
<p class="lead">Rủi ro là <strong>một sự kiện bất định mà nếu xảy ra sẽ ảnh hưởng một mục tiêu</strong>. PM giỏi không loại bỏ rủi ro (bất khả) — họ nhận diện sớm và lên kế hoạch ứng phó trước khi nó xảy đến.</p>
<h3>Quy trình rủi ro</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Nhận diện</b><span>brainstorm, checklist, bài học cũ</span></div>
  <div class="lz-step"><b>Phân tích</b><span>chấm xác suất × tác động</span></div>
  <div class="lz-step"><b>Lập ứng phó</b><span>chọn chiến lược cho mỗi rủi ro</span></div>
  <div class="lz-step"><b>Giám sát</b><span>theo dõi trong sổ rủi ro, review đều</span></div>
</div>
<h3>Phân tích định tính — xác suất × tác động</h3>
<div class="formula"><span class="lbl">ĐIỂM RỦI RO</span> Điểm = Xác suất × Tác động &nbsp;·&nbsp; (xếp hạng rủi ro; xử lý cái điểm cao trước)</div>
<div class="out"><b>Ví dụ có lời giải:</b> "Dev chủ chốt có thể nghỉ." Xác suất = 0.3, Tác động (thang 1–10) = 9 → điểm = 2.7. "Server sập lúc demo." Xác suất = 0.1, Tác động = 8 → điểm = 0.8. → Xử lý rủi ro dev nghỉ trước; nó mang tác động kỳ vọng cao hơn.</div>
<h3>Bốn chiến lược ứng phó (cho mối đe doạ)</h3>
<table>
  <thead><tr><th>Chiến lược</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Avoid (né)</td><td>Loại bỏ nguyên nhân</td><td>Bỏ hẳn một tính năng rủi ro</td></tr>
    <tr><td>Transfer (chuyển)</td><td>Dời tác động sang bên thứ ba</td><td>Mua bảo hiểm; thuê ngoài</td></tr>
    <tr><td>Mitigate (giảm nhẹ)</td><td>Giảm xác suất hoặc tác động</td><td>Đào tạo chéo hai dev</td></tr>
    <tr><td>Accept (chấp nhận)</td><td>Không làm gì nhưng lập dự phòng</td><td>Giữ ngân sách dự phòng</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Rủi ro không chỉ là mối đe doạ — còn có cơ hội.</b> Các chiến lược đối xứng cho rủi ro tích cực là exploit (khai thác), share (chia sẻ), enhance (tăng cường), và accept. Nếu một thư viện mới <em>có thể</em> cắt nửa thời gian dev, bạn "exploit" bằng cách lập kế hoạch quanh nó. Coi bất định là hai chiều — mặt hại và mặt lợi — là sự chín chắn mà giáo trình cơ bản ít nhấn.</div>
<div class="pitfall">Một rủi ro viết là "bug" hay "trễ" thì vô dụng. Nêu nó dưới dạng <strong>nguyên nhân → sự kiện bất định → tác động lên mục tiêu</strong>: "Vì API không có tài liệu (nguyên nhân), tích hợp có thể lâu hơn dự kiến (sự kiện), làm trễ ra mắt hai tuần (tác động)." Chỉ khi đó mới chấm và ứng phó được.</div>
</div>`,
        },
        {
          title: '3.2 — Communications & change control|||3.2 — Truyền thông & kiểm soát thay đổi',
          slug: 'pmg201c-3-2-comms-change',
          type: 'VIDEO',
          description: 'Kế hoạch truyền thông (ai/gì/khi/kênh) và quy trình kiểm soát thay đổi chính thức.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Communications management &amp; change control</h2>
<p class="lead">Studies find PMs spend up to 90% of their time communicating. A communications plan makes that deliberate; change control keeps the triple constraint from silently breaking.</p>
<h3>The communications plan — a simple table</h3>
<table>
  <thead><tr><th>Who</th><th>What</th><th>When</th><th>Channel</th></tr></thead>
  <tbody>
    <tr><td>Sponsor</td><td>Status &amp; risks summary</td><td>Weekly</td><td>Email + monthly meeting</td></tr>
    <tr><td>Team</td><td>Tasks &amp; blockers</td><td>Daily</td><td>Standup + Trello</td></tr>
    <tr><td>End users</td><td>Release notes</td><td>Per release</td><td>Announcement</td></tr>
  </tbody>
</table>
<h3>The change control process</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Request</b><span>anyone submits a written change request</span></div>
  <div class="lz-step"><b>Assess</b><span>impact on scope, time, cost, risk</span></div>
  <div class="lz-step"><b>Decide</b><span>change control board approves or rejects</span></div>
  <div class="lz-step"><b>Update</b><span>revise the plan &amp; baseline; communicate</span></div>
</div>
<div class="out"><b>Worked example:</b> Mid-project the client asks for a dark-mode UI. Instead of a developer just doing it, the PM logs a change request, assesses it (+3 days, +$600, low risk), and the board approves it <em>with</em> a new deadline. The baseline is updated. Now nobody is surprised when the schedule shifts — because the change was controlled, not silent.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Protect the baseline.</b> The <em>baseline</em> is the approved snapshot of scope, schedule and cost you measure against. Uncontrolled changes corrupt it, and then you cannot tell whether you are "behind" or just working to a different plan than you are measuring. Every approved change must formally re-baseline. This discipline — measuring against a fixed reference — is what makes earned-value tracking meaningful.</div>
<div class="pitfall">Verbal "yes, sure, add it" agreements are how projects die. If a change is not written down, assessed, and approved, it did not happen through change control — and its impact on the deadline is now invisible.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Quản lý truyền thông &amp; kiểm soát thay đổi</h2>
<p class="lead">Nghiên cứu thấy PM dành tới 90% thời gian để truyền thông. Kế hoạch truyền thông làm điều đó có chủ đích; kiểm soát thay đổi giữ tam giác ràng buộc khỏi vỡ âm thầm.</p>
<h3>Kế hoạch truyền thông — một bảng đơn giản</h3>
<table>
  <thead><tr><th>Ai</th><th>Cái gì</th><th>Khi nào</th><th>Kênh</th></tr></thead>
  <tbody>
    <tr><td>Sponsor</td><td>Tóm tắt trạng thái &amp; rủi ro</td><td>Hàng tuần</td><td>Email + họp tháng</td></tr>
    <tr><td>Nhóm</td><td>Công việc &amp; điểm nghẽn</td><td>Hàng ngày</td><td>Standup + Trello</td></tr>
    <tr><td>Người dùng cuối</td><td>Ghi chú phát hành</td><td>Mỗi bản phát hành</td><td>Thông báo</td></tr>
  </tbody>
</table>
<h3>Quy trình kiểm soát thay đổi</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Yêu cầu</b><span>bất kỳ ai nộp một yêu cầu thay đổi bằng văn bản</span></div>
  <div class="lz-step"><b>Đánh giá</b><span>tác động lên phạm vi, thời gian, chi phí, rủi ro</span></div>
  <div class="lz-step"><b>Quyết định</b><span>ban kiểm soát thay đổi duyệt hoặc từ chối</span></div>
  <div class="lz-step"><b>Cập nhật</b><span>chỉnh kế hoạch &amp; baseline; truyền thông</span></div>
</div>
<div class="out"><b>Ví dụ có lời giải:</b> Giữa dự án khách xin giao diện dark-mode. Thay vì một dev cứ thế làm, PM ghi một yêu cầu thay đổi, đánh giá (+3 ngày, +600$, rủi ro thấp), và ban duyệt nó <em>cùng với</em> một hạn chót mới. Baseline được cập nhật. Giờ không ai bất ngờ khi tiến độ dịch — vì thay đổi được kiểm soát, không âm thầm.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bảo vệ baseline.</b> <em>Baseline</em> là ảnh chụp đã duyệt của phạm vi, tiến độ và chi phí mà bạn đo theo. Thay đổi không kiểm soát làm hỏng nó, và rồi bạn không biết mình "chậm" hay chỉ đang làm theo một kế hoạch khác với cái mình đang đo. Mọi thay đổi được duyệt phải chính thức lập lại baseline. Kỷ luật này — đo theo một mốc cố định — là thứ làm cho theo dõi earned-value có ý nghĩa.</div>
<div class="pitfall">Đồng ý miệng "được, thêm đi" là cách dự án chết. Nếu một thay đổi không được ghi lại, đánh giá và duyệt, thì nó không đi qua kiểm soát thay đổi — và tác động của nó lên hạn chót giờ vô hình.</div>
</div>`,
        },
        {
          title: 'Quiz 3 — Risk & change|||Quiz 3 — Rủi ro & thay đổi',
          slug: 'pmg201c-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra quy trình rủi ro, P×I, chiến lược ứng phó và kiểm soát thay đổi.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A risk is best described as…|||Rủi ro được mô tả tốt nhất là…', options: ['a problem that has already happened|||một vấn đề đã xảy ra', 'an uncertain event that would affect an objective|||một sự kiện bất định sẽ ảnh hưởng mục tiêu', 'a task in the WBS|||một việc trong WBS', 'a stakeholder|||một bên liên quan'], correctIndex: 1, points: 1 },
              { question: 'Buying insurance to shift a risk\'s impact to a third party is which strategy?|||Mua bảo hiểm để dời tác động rủi ro sang bên thứ ba là chiến lược nào?', options: ['avoid|||né', 'transfer|||chuyển', 'mitigate|||giảm nhẹ', 'accept|||chấp nhận'], correctIndex: 1, points: 1 },
              { question: 'Cross-training two developers so losing one hurts less is…|||Đào tạo chéo hai dev để mất một người ít đau hơn là…', options: ['avoiding|||né', 'transferring|||chuyển', 'mitigating|||giảm nhẹ', 'accepting|||chấp nhận'], correctIndex: 2, points: 1 },
              { question: 'A mid-project change should first be…|||Một thay đổi giữa dự án trước hết nên được…', options: ['implemented immediately by a developer|||dev làm ngay lập tức', 'logged as a request and assessed for impact|||ghi lại thành yêu cầu và đánh giá tác động', 'ignored|||bỏ qua', 'added silently to the scope|||thêm âm thầm vào phạm vi'], correctIndex: 1, points: 1 },
              { question: 'To prioritise risks, you rank them by…|||Để ưu tiên rủi ro, bạn xếp hạng theo…', options: ['alphabetical order|||thứ tự bảng chữ cái', 'probability × impact|||xác suất × tác động', 'who reported them|||ai báo cáo', 'task duration|||thời lượng công việc'], correctIndex: 1, points: 1 },
              { question: 'The mirror strategies for positive risks (opportunities) include exploit, share, and… (beyond-syllabus)|||Các chiến lược đối xứng cho rủi ro tích cực (cơ hội) gồm exploit, share, và… (ngoài giáo trình)', options: ['avoid|||né', 'enhance|||tăng cường', 'transfer|||chuyển', 'mitigate|||giảm nhẹ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — COURSE 4: CAPSTONE ══════════════════ */
    {
      title: 'Chapter 4 — Course 4: The project management capstone|||Chương 4 — Course 4: Capstone quản trị dự án',
      description: 'Tích hợp charter, WBS, tiến độ, ngân sách, rủi ro thành một bản kế hoạch dự án hoàn chỉnh + bình duyệt.',
      lessons: [
        {
          title: '4.1 — Integrating the full project plan|||4.1 — Tích hợp bản kế hoạch dự án hoàn chỉnh',
          slug: 'pmg201c-4-1-integrate-plan',
          type: 'VIDEO',
          description: 'Ghép mọi artifact thành một bản kế hoạch nhất quán và cách bình duyệt (peer review).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Integrating the full project plan</h2>
<p class="lead">The capstone assembles everything you built into one coherent project plan. The skill being graded is <strong>integration</strong> — making the pieces consistent with each other, not just individually correct.</p>
<h3>The plan components — and how they connect</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Charter</div><div class="lz-nsub">why + high-level scope + sponsor → feeds the scope statement</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Scope statement + WBS</div><div class="lz-nsub">the work → feeds the schedule &amp; budget</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Schedule (network, CPM, Gantt)</div><div class="lz-nsub">durations + dependencies → sets the timeline &amp; cost baseline</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Budget</div><div class="lz-nsub">rolled-up estimates → the cost baseline for EVM</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Risk register + comms plan</div><div class="lz-nsub">manage uncertainty + who-hears-what</div></div></div>
</div>
<div class="callout ok">Consistency is the grade. If your WBS has a "testing" package but your schedule has no testing task, or your budget omits it, the plan is <em>internally broken</em> — reviewers spot this instantly. Trace one deliverable end to end: charter → scope → WBS → schedule → budget → risk. It must appear in all of them.</div>
<h3>Peer review — give and receive</h3>
<p>The capstone includes reviewing classmates' plans against a rubric and receiving the same. Use a checklist; give specific, actionable feedback ("the critical path skips task D") rather than vague praise.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Add a one-page executive summary on top.</b> Real sponsors do not read a 20-page plan; they read a one-page summary: objective, timeline, budget, top 3 risks, and the ask. Being able to compress your whole plan into a page that a busy decision-maker grasps in 60 seconds is a career skill the capstone rubric only implies.</div>
<div class="pitfall">Do not treat peer review as a formality to rush. Reviewing others trains your eye to catch the same inconsistencies in your own plan — and the feedback you receive is free improvement you cannot generate alone.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Tích hợp bản kế hoạch dự án hoàn chỉnh</h2>
<p class="lead">Capstone ghép mọi thứ bạn dựng thành một bản kế hoạch dự án nhất quán. Kỹ năng được chấm là <strong>tích hợp</strong> — làm các mảnh nhất quán với nhau, không chỉ đúng riêng lẻ.</p>
<h3>Các thành phần kế hoạch — và cách chúng nối nhau</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Charter</div><div class="lz-nsub">vì sao + phạm vi cấp cao + sponsor → nuôi tuyên bố phạm vi</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Tuyên bố phạm vi + WBS</div><div class="lz-nsub">công việc → nuôi tiến độ &amp; ngân sách</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Tiến độ (mạng, CPM, Gantt)</div><div class="lz-nsub">thời lượng + phụ thuộc → đặt timeline &amp; baseline chi phí</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Ngân sách</div><div class="lz-nsub">ước lượng cộng dồn → baseline chi phí cho EVM</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Sổ rủi ro + kế hoạch truyền thông</div><div class="lz-nsub">quản lý bất định + ai nghe cái gì</div></div></div>
</div>
<div class="callout ok">Sự nhất quán là điểm số. Nếu WBS có gói "kiểm thử" mà tiến độ không có việc kiểm thử, hoặc ngân sách bỏ sót nó, thì kế hoạch <em>vỡ bên trong</em> — người review thấy ngay. Hãy truy một sản phẩm bàn giao từ đầu đến cuối: charter → phạm vi → WBS → tiến độ → ngân sách → rủi ro. Nó phải xuất hiện trong tất cả.</div>
<h3>Bình duyệt — cho và nhận</h3>
<p>Capstone gồm review kế hoạch bạn cùng lớp theo rubric và nhận lại tương tự. Dùng checklist; góp ý cụ thể, hành động được ("đường găng bỏ sót việc D") thay vì khen chung chung.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thêm một trang tóm tắt điều hành lên trên cùng.</b> Sponsor thật không đọc bản kế hoạch 20 trang; họ đọc một trang tóm tắt: mục tiêu, timeline, ngân sách, 3 rủi ro lớn, và yêu cầu. Nén cả kế hoạch vào một trang mà một người quyết định bận nắm được trong 60 giây là kỹ năng nghề nghiệp mà rubric capstone chỉ hàm ý.</div>
<div class="pitfall">Đừng coi bình duyệt là thủ tục để làm cho nhanh. Review người khác luyện mắt bắt cùng sự thiếu nhất quán trong kế hoạch của bạn — và phản hồi bạn nhận là cải thiện miễn phí bạn không tự tạo được.</div>
</div>`,
        },
        {
          title: 'Capstone — the project-plan checklist|||Capstone — checklist bản kế hoạch dự án',
          slug: 'pmg201c-capstone-checklist',
          type: 'VIDEO',
          description: 'Danh sách kiểm hoàn chỉnh cho bản kế hoạch dự án capstone theo từng thành phần.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Milestone</span>
<h2>Capstone project-plan checklist</h2>
<p class="lead">Use this as a gate before submitting your capstone. A component that fails its check will cost marks — fix it before you hand in.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Charter</div><div class="lz-nsub">purpose · deliverables · sponsor · success criteria · PM authority</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Scope statement</div><div class="lz-nsub">in-scope AND explicit out-of-scope list · acceptance criteria</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">WBS</div><div class="lz-nsub">decomposed to 8–80h work packages · every deliverable covered</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Estimates &amp; budget</div><div class="lz-nsub">named method (PERT etc.) · rolled up bottom-up · contingency reserve</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Schedule</div><div class="lz-nsub">network diagram · critical path identified · Gantt with dependencies</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Risk register</div><div class="lz-nsub">≥5 risks · cause-event-impact · P×I score · response strategy each</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Comms &amp; change plan</div><div class="lz-nsub">who/what/when/channel · a change-control process</div></div></div>
</div>
<div class="callout ok">Final consistency check: pick any one deliverable and trace it through all seven components. If it is missing from any, or the numbers disagree (WBS says 5 tasks, schedule shows 4), your plan is not integrated — fix before submitting.</div>
<div class="pitfall">A beautiful Gantt chart with no risk register, or a risk register disconnected from the schedule, scores low. The capstone rewards a <strong>coherent whole</strong>, not one impressive artifact.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Mốc</span>
<h2>Checklist bản kế hoạch dự án capstone</h2>
<p class="lead">Dùng cái này như một cổng trước khi nộp capstone. Một thành phần trượt kiểm sẽ mất điểm — sửa trước khi nộp.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Charter</div><div class="lz-nsub">mục đích · sản phẩm bàn giao · sponsor · tiêu chí thành công · quyền hạn PM</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Tuyên bố phạm vi</div><div class="lz-nsub">trong phạm vi VÀ danh sách ngoài-phạm-vi rõ · tiêu chí nghiệm thu</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">WBS</div><div class="lz-nsub">phân rã tới gói 8–80h · mọi sản phẩm bàn giao được phủ</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Ước lượng &amp; ngân sách</div><div class="lz-nsub">phương pháp có tên (PERT…) · cộng dồn bottom-up · dự phòng</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Tiến độ</div><div class="lz-nsub">sơ đồ mạng · xác định đường găng · Gantt có phụ thuộc</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Sổ rủi ro</div><div class="lz-nsub">≥5 rủi ro · nguyên nhân-sự kiện-tác động · điểm P×I · chiến lược mỗi cái</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Kế hoạch truyền thông &amp; thay đổi</div><div class="lz-nsub">ai/gì/khi/kênh · một quy trình kiểm soát thay đổi</div></div></div>
</div>
<div class="callout ok">Kiểm nhất quán cuối: chọn một sản phẩm bàn giao bất kỳ và truy nó qua cả bảy thành phần. Nếu nó thiếu ở bất kỳ đâu, hoặc số liệu vênh (WBS nói 5 việc, tiến độ hiện 4), thì kế hoạch chưa tích hợp — sửa trước khi nộp.</div>
<div class="pitfall">Một biểu đồ Gantt đẹp mà không sổ rủi ro, hoặc một sổ rủi ro rời khỏi tiến độ, thì điểm thấp. Capstone thưởng một <strong>tổng thể mạch lạc</strong>, không phải một artifact ấn tượng đơn lẻ.</div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — EXAM PREP (TE + PE) ══════════════════ */
    {
      title: 'Chapter 5 — Final exam prep & question bank|||Chương 5 — Ôn thi cuối kỳ & ngân hàng câu hỏi',
      description: 'Định dạng TE + PE, thẻ công thức CPM/PERT/EVM, và ngân hàng câu hỏi ôn theo CLO — kiểu SWP391.',
      lessons: [
        {
          title: '5.1 — TE + PE format, formula card & CLO question bank|||5.1 — Định dạng TE + PE, thẻ công thức & ngân hàng câu hỏi theo CLO',
          slug: 'pmg201c-5-1-exam-question-bank',
          type: 'VIDEO',
          description: 'Cấu trúc hai bài thi, thẻ công thức PERT/CPM/EVM có ví dụ, và ngân hàng câu hỏi theo 4 CLO.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>The two exams — TE (theory) + PE (practical)</h2>
<p class="lead">TE (60 min, MCQ) tests concepts; PE (120 min) tests whether you can <em>produce</em> artifacts and calculations. Prepare for both separately — each has its own ≥4 gate.</p>
<h3>The formula card — memorise and rehearse</h3>
<div class="formula"><span class="lbl">PERT</span> E = (O + 4M + P)/6 &nbsp;·&nbsp; σ ≈ (P − O)/6</div>
<div class="formula"><span class="lbl">EARNED VALUE</span> EV = %complete × BAC · CPI = EV/AC · SPI = EV/PV · CV = EV − AC · SV = EV − PV · EAC = BAC/CPI</div>
<div class="out"><b>Worked EVM example:</b> Budget at completion BAC = $10,000. At the check point, work is 40% done (EV = 0.40 × 10,000 = $4,000), you have spent AC = $5,000, and you planned to be 50% done (PV = $5,000).<br>
• CPI = EV/AC = 4,000/5,000 = <b>0.8</b> → over budget (getting $0.80 of value per $1 spent).<br>
• SPI = EV/PV = 4,000/5,000 = <b>0.8</b> → behind schedule.<br>
• EAC = BAC/CPI = 10,000/0.8 = <b>$12,500</b> → forecast final cost if the trend holds.<br>
<em>CPI &lt; 1 = over budget; SPI &lt; 1 = behind schedule. Both below 1 here → the project needs corrective action.</em></div>
<h3>Question bank — practise by CLO</h3>
<p><b>CLO1 (initiation):</b></p>
<ul>
  <li>List five elements a project charter must contain.</li>
  <li>Classify these four stakeholders on a power/interest grid and state a strategy for each.</li>
  <li>Explain the difference between product scope and project scope.</li>
</ul>
<p><b>CLO2 (scope, WBS, schedule, budget):</b></p>
<ul>
  <li>Given tasks A–F with durations and dependencies, find the critical path and the project duration.</li>
  <li>Compute the PERT estimate for O=3, M=7, P=17.</li>
  <li>Build a 3-level WBS for a given deliverable.</li>
  <li>Which task has float, and how much, in this network?</li>
</ul>
<p><b>CLO3 (risk &amp; communications):</b></p>
<ul>
  <li>Write a proper risk statement (cause → event → impact) for a given scenario, and choose a response strategy.</li>
  <li>Rank three risks by probability × impact.</li>
  <li>Draft a one-row communications plan for the sponsor.</li>
</ul>
<p><b>CLO4 (integration &amp; control):</b></p>
<ul>
  <li>Given BAC, EV, AC, PV, compute CPI, SPI and EAC and interpret them.</li>
  <li>Walk a mid-project change request through the change-control process.</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Interpret, don't just compute.</b> The PE often asks "is the project healthy?" after an EVM calculation. Full marks go to the answer that reads the numbers: "CPI 0.8 and SPI 0.8 mean the project is both over budget and behind schedule; recommend crashing the critical path or re-baselining." Turning numbers into a management recommendation is the skill that separates a technician from a project manager — and the exam rewards it.</div>
<div class="pitfall">On the PE, do not spend all your time making one artifact perfect. Partial credit is given per task — attempt every question (a rough WBS, a started EVM table) before polishing any single one.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Hai bài thi — TE (lý thuyết) + PE (thực hành)</h2>
<p class="lead">TE (60 phút, trắc nghiệm) kiểm khái niệm; PE (120 phút) kiểm bạn có <em>tạo ra</em> được artifact và tính toán không. Ôn riêng cho cả hai — mỗi cái có cổng ≥4 riêng.</p>
<h3>Thẻ công thức — học thuộc và tập nhẩm</h3>
<div class="formula"><span class="lbl">PERT</span> E = (O + 4M + P)/6 &nbsp;·&nbsp; σ ≈ (P − O)/6</div>
<div class="formula"><span class="lbl">EARNED VALUE</span> EV = %hoàn thành × BAC · CPI = EV/AC · SPI = EV/PV · CV = EV − AC · SV = EV − PV · EAC = BAC/CPI</div>
<div class="out"><b>Ví dụ EVM có lời giải:</b> Ngân sách hoàn thành BAC = 10.000$. Tại điểm kiểm, công việc xong 40% (EV = 0.40 × 10.000 = 4.000$), đã chi AC = 5.000$, và dự kiến xong 50% (PV = 5.000$).<br>
• CPI = EV/AC = 4.000/5.000 = <b>0.8</b> → vượt ngân sách (nhận 0.80$ giá trị mỗi 1$ chi).<br>
• SPI = EV/PV = 4.000/5.000 = <b>0.8</b> → chậm tiến độ.<br>
• EAC = BAC/CPI = 10.000/0.8 = <b>12.500$</b> → dự báo chi phí cuối nếu xu hướng giữ nguyên.<br>
<em>CPI &lt; 1 = vượt ngân sách; SPI &lt; 1 = chậm tiến độ. Cả hai dưới 1 ở đây → dự án cần hành động khắc phục.</em></div>
<h3>Ngân hàng câu hỏi — luyện theo CLO</h3>
<p><b>CLO1 (khởi tạo):</b></p>
<ul>
  <li>Liệt kê năm thành phần project charter phải có.</li>
  <li>Xếp bốn stakeholder này lên lưới quyền lực/quan tâm và nêu chiến lược mỗi bên.</li>
  <li>Giải thích khác biệt giữa phạm vi sản phẩm và phạm vi dự án.</li>
</ul>
<p><b>CLO2 (phạm vi, WBS, tiến độ, ngân sách):</b></p>
<ul>
  <li>Cho công việc A–F với thời lượng và phụ thuộc, tìm đường găng và thời lượng dự án.</li>
  <li>Tính ước lượng PERT cho O=3, M=7, P=17.</li>
  <li>Xây WBS 3 tầng cho một sản phẩm bàn giao cho sẵn.</li>
  <li>Việc nào có float, và bao nhiêu, trong sơ đồ mạng này?</li>
</ul>
<p><b>CLO3 (rủi ro &amp; truyền thông):</b></p>
<ul>
  <li>Viết một câu rủi ro đúng (nguyên nhân → sự kiện → tác động) cho một tình huống, và chọn chiến lược ứng phó.</li>
  <li>Xếp hạng ba rủi ro theo xác suất × tác động.</li>
  <li>Soạn một dòng kế hoạch truyền thông cho sponsor.</li>
</ul>
<p><b>CLO4 (tích hợp &amp; kiểm soát):</b></p>
<ul>
  <li>Cho BAC, EV, AC, PV, tính CPI, SPI và EAC và diễn giải.</li>
  <li>Dẫn một yêu cầu thay đổi giữa dự án qua quy trình kiểm soát thay đổi.</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Diễn giải, đừng chỉ tính.</b> PE thường hỏi "dự án có khoẻ không?" sau một phép tính EVM. Điểm tối đa thuộc về câu trả lời đọc được con số: "CPI 0.8 và SPI 0.8 nghĩa là dự án vừa vượt ngân sách vừa chậm tiến độ; khuyến nghị crash đường găng hoặc lập lại baseline." Biến con số thành khuyến nghị quản lý là kỹ năng tách một kỹ thuật viên khỏi một người quản lý dự án — và bài thi thưởng nó.</div>
<div class="pitfall">Ở PE, đừng dồn hết giờ hoàn hảo một artifact. Điểm chia theo từng bài — làm mọi câu (một WBS thô, một bảng EVM mới bắt đầu) trước khi đánh bóng bất kỳ cái nào.</div>
</div>`,
        },
        {
          title: 'Quiz 5 — Exam readiness & EVM|||Quiz 5 — Sẵn sàng thi & EVM',
          slug: 'pmg201c-quiz-5',
          type: 'QUIZ',
          description: 'Kiểm tra công thức EVM, diễn giải chỉ số, và chiến lược làm bài thi.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'CPI is computed as…|||CPI được tính là…', options: ['EV / PV', 'EV / AC', 'AC / EV', 'PV / EV'], correctIndex: 1, points: 1 },
              { question: 'A CPI of 0.8 means the project is…|||CPI bằng 0.8 nghĩa là dự án…', options: ['under budget|||dưới ngân sách', 'over budget|||vượt ngân sách', 'ahead of schedule|||sớm tiến độ', 'exactly on plan|||đúng kế hoạch'], correctIndex: 1, points: 1 },
              { question: 'SPI is computed as EV / PV. An SPI below 1 means…|||SPI = EV / PV. SPI dưới 1 nghĩa là…', options: ['ahead of schedule|||sớm tiến độ', 'behind schedule|||chậm tiến độ', 'over budget|||vượt ngân sách', 'no data|||không dữ liệu'], correctIndex: 1, points: 1 },
              { question: 'With BAC = 10,000 and CPI = 0.5, the estimate at completion (EAC = BAC/CPI) is…|||Với BAC = 10.000 và CPI = 0.5, ước lượng khi hoàn thành (EAC = BAC/CPI) là…', options: ['5,000', '10,000', '20,000', '2,000'], correctIndex: 2, points: 1 },
              { question: 'Because TE and PE have separate ≥4 gates, your revision should be…|||Vì TE và PE có cổng ≥4 riêng, ôn tập của bạn nên…', options: ['all theory|||toàn lý thuyết', 'split between theory and practical artifacts|||chia giữa lý thuyết và artifact thực hành', 'all practical|||toàn thực hành', 'skip the MOOCs|||bỏ MOOC'], correctIndex: 1, points: 1 },
              { question: 'On the PE, full marks after an EVM calculation usually require you to also… (beyond-syllabus)|||Ở PE, điểm tối đa sau một phép tính EVM thường đòi bạn còn phải… (ngoài giáo trình)', options: ['compute more numbers|||tính thêm số', 'interpret the result and recommend action|||diễn giải kết quả và khuyến nghị hành động', 'redraw the Gantt|||vẽ lại Gantt', 'cite a source|||trích một nguồn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 (NÂNG CAO ★) — AGILE & EVM/AI ══════════════════ */
    {
      title: 'Chapter 6 (Advanced) — Agile, adaptive planning & AI in PM|||Chương 6 (Nâng cao) — Agile, lập kế hoạch thích ứng & AI trong PM',
      description: 'Ngoài giáo trình: predictive vs adaptive (Agile/Scrum/Kanban), khi nào dùng cái nào, và AI hỗ trợ quản trị dự án.',
      lessons: [
        {
          title: '6.1 — Predictive vs adaptive: Waterfall, Agile & Scrum|||6.1 — Predictive vs adaptive: Waterfall, Agile & Scrum',
          slug: 'pmg201c-6-1-agile',
          type: 'VIDEO',
          description: 'So sánh kế hoạch tuần tự và thích ứng, vòng lặp Scrum, và cách chọn theo bối cảnh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1 · ★ Beyond the syllabus</span>
<h2>Predictive vs adaptive project management</h2>
<p class="lead">The course teaches classic <em>predictive</em> (plan-everything-upfront) management. Modern software teams often use <em>adaptive</em> (Agile) approaches. Knowing both — and when each fits — is what employers expect.</p>
<table>
  <thead><tr><th></th><th>Predictive (Waterfall)</th><th>Adaptive (Agile)</th></tr></thead>
  <tbody>
    <tr><td>Plan</td><td>Detailed, upfront, fixed scope</td><td>Rolling, evolving, fixed time-box</td></tr>
    <tr><td>Delivery</td><td>One big release at the end</td><td>Small increments every sprint</td></tr>
    <tr><td>Change</td><td>Controlled, discouraged</td><td>Welcomed, even late</td></tr>
    <tr><td>Best when</td><td>Requirements are stable &amp; known</td><td>Requirements are uncertain / evolving</td></tr>
  </tbody>
</table>
<h3>The Scrum loop</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Product backlog</b><span>prioritised list of features</span></div>
  <div class="lz-step"><b>Sprint planning</b><span>pick a sprint’s worth of work</span></div>
  <div class="lz-step"><b>Sprint (1–4 wks)</b><span>build + daily standup</span></div>
  <div class="lz-step"><b>Review + retro</b><span>demo increment, improve process</span></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Most real projects are hybrid.</b> A team may plan the overall roadmap and budget predictively (for the sponsor) while executing in Agile sprints (for the developers). The triple constraint still applies — Agile just fixes <em>time and cost</em> (the sprint) and flexes <em>scope</em> (what fits). Understanding that Agile is a different way to balance the same constraints, not a way to escape them, is a genuinely senior insight.</div>
<div class="pitfall">Agile is not "no planning" or "no documentation". It plans continuously and documents what adds value. Teams that use "we’re Agile" as an excuse to skip planning fail just as hard as those that over-plan — this is called cargo-cult Agile.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1 · ★ Ngoài giáo trình</span>
<h2>Quản trị dự án predictive vs adaptive</h2>
<p class="lead">Môn học dạy quản trị <em>predictive</em> cổ điển (lập trọn kế hoạch từ đầu). Nhóm phần mềm hiện đại thường dùng cách <em>adaptive</em> (Agile). Biết cả hai — và khi nào dùng cái nào — là điều nhà tuyển dụng mong đợi.</p>
<table>
  <thead><tr><th></th><th>Predictive (Waterfall)</th><th>Adaptive (Agile)</th></tr></thead>
  <tbody>
    <tr><td>Kế hoạch</td><td>Chi tiết, từ đầu, phạm vi cố định</td><td>Cuốn chiếu, tiến hóa, cố định time-box</td></tr>
    <tr><td>Bàn giao</td><td>Một bản phát hành lớn ở cuối</td><td>Từng phần nhỏ mỗi sprint</td></tr>
    <tr><td>Thay đổi</td><td>Kiểm soát, không khuyến khích</td><td>Chào đón, kể cả muộn</td></tr>
    <tr><td>Tốt khi</td><td>Yêu cầu ổn định &amp; đã biết</td><td>Yêu cầu bất định / tiến hóa</td></tr>
  </tbody>
</table>
<h3>Vòng lặp Scrum</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Product backlog</b><span>danh sách tính năng đã ưu tiên</span></div>
  <div class="lz-step"><b>Sprint planning</b><span>chọn khối lượng cho một sprint</span></div>
  <div class="lz-step"><b>Sprint (1–4 tuần)</b><span>build + standup hằng ngày</span></div>
  <div class="lz-step"><b>Review + retro</b><span>demo phần tăng, cải tiến quy trình</span></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phần lớn dự án thật là lai (hybrid).</b> Một nhóm có thể lập roadmap và ngân sách tổng thể theo predictive (cho sponsor) trong khi thực hiện bằng sprint Agile (cho dev). Tam giác ràng buộc vẫn đúng — Agile chỉ cố định <em>thời gian và chi phí</em> (sprint) và co giãn <em>phạm vi</em> (cái gì vừa). Hiểu Agile là một cách khác để cân bằng cùng những ràng buộc đó, không phải cách trốn chúng, là một insight thực sự cấp cao.</div>
<div class="pitfall">Agile không phải "không lập kế hoạch" hay "không tài liệu". Nó lập kế hoạch liên tục và ghi tài liệu thứ có giá trị. Nhóm lấy "chúng tôi Agile" làm cớ bỏ lập kế hoạch cũng thất bại nặng như nhóm lập kế hoạch quá đà — gọi là cargo-cult Agile.</div>
</div>`,
        },
        {
          title: '6.2 — AI-assisted project management|||6.2 — Quản trị dự án có AI hỗ trợ',
          slug: 'pmg201c-6-2-ai-pm',
          type: 'VIDEO',
          description: 'AI hỗ trợ ước lượng, phân tích rủi ro, tóm tắt trạng thái — và ranh giới trách nhiệm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2 · ★ Beyond the syllabus</span>
<h2>AI as a project-management assistant</h2>
<p class="lead">AI tools now help plan, estimate, and report. Used well they save hours; used blindly they produce confident nonsense. The PM stays accountable for every decision.</p>
<h3>Where AI genuinely helps</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Draft a WBS</b> — "break this project into tasks" then you validate dependencies and estimates.</div>
  <div class="lz-layer"><b>Brainstorm risks</b> — "list 15 risks for a mobile-app launch" then you score and prune them.</div>
  <div class="lz-layer"><b>Summarise status</b> — turn a week of standup notes into a one-page sponsor update.</div>
  <div class="lz-layer"><b>Estimate sanity-check</b> — compare AI’s estimate to yours to surface blind spots.</div>
</div>
<h3>The accountability line</h3>
<div class="out"><b>Worked example:</b> You ask AI to estimate a task and it says "2 days". Your team, who know the legacy code, say "closer to 8". <b>Trust the informed humans.</b> AI has no context on your specific system, team skill, or hidden complexity. Use its number as a <em>prompt to discuss</em>, never as the decision. The PM owns the estimate that goes in the plan.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>AI is strong at breadth, weak at your context.</b> It will list risks you forgot (breadth) but cannot know your sponsor is risk-averse or your one database expert is on leave (context). The winning pattern is: AI for a comprehensive first pass, human judgment for prioritisation and commitment. This division of labour — machine breadth, human accountability — is the emerging norm the syllabus predates.</div>
<div class="pitfall">Never paste confidential project data (client contracts, budgets, personal data) into a public AI tool. Doing so can leak sensitive information and breach agreements — a governance risk a modern PM must manage, not just a convenience question.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2 · ★ Ngoài giáo trình</span>
<h2>AI như một trợ lý quản trị dự án</h2>
<p class="lead">Công cụ AI nay giúp lập kế hoạch, ước lượng và báo cáo. Dùng tốt tiết kiệm hàng giờ; dùng mù quáng sinh ra thứ vô nghĩa đầy tự tin. PM vẫn chịu trách nhiệm mọi quyết định.</p>
<h3>Nơi AI thật sự giúp</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Nháp WBS</b> — "chia dự án này thành công việc" rồi bạn kiểm phụ thuộc và ước lượng.</div>
  <div class="lz-layer"><b>Brainstorm rủi ro</b> — "liệt kê 15 rủi ro cho ra mắt app mobile" rồi bạn chấm và tỉa.</div>
  <div class="lz-layer"><b>Tóm tắt trạng thái</b> — biến một tuần ghi chú standup thành một trang cập nhật cho sponsor.</div>
  <div class="lz-layer"><b>Kiểm tra ước lượng</b> — so ước lượng của AI với của bạn để lộ điểm mù.</div>
</div>
<h3>Ranh giới trách nhiệm</h3>
<div class="out"><b>Ví dụ có lời giải:</b> Bạn nhờ AI ước lượng một việc và nó nói "2 ngày". Nhóm bạn, người biết code cũ, nói "gần 8 hơn". <b>Tin những con người có thông tin.</b> AI không có ngữ cảnh về hệ thống cụ thể, kỹ năng nhóm, hay độ phức tạp ẩn của bạn. Dùng số của nó như một <em>gợi ý để bàn</em>, đừng bao giờ như quyết định. PM sở hữu ước lượng đi vào kế hoạch.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>AI mạnh về bề rộng, yếu về ngữ cảnh của bạn.</b> Nó sẽ liệt kê rủi ro bạn quên (bề rộng) nhưng không biết sponsor của bạn ngại rủi ro hay chuyên gia database duy nhất đang nghỉ phép (ngữ cảnh). Khuôn thắng là: AI cho lượt đầu toàn diện, phán đoán con người cho ưu tiên và cam kết. Phân công này — máy lo bề rộng, người chịu trách nhiệm — là chuẩn mực đang nổi mà giáo trình có trước.</div>
<div class="pitfall">Đừng bao giờ dán dữ liệu dự án bảo mật (hợp đồng khách, ngân sách, dữ liệu cá nhân) vào một công cụ AI công cộng. Làm vậy có thể rò rỉ thông tin nhạy cảm và vi phạm thỏa thuận — một rủi ro quản trị mà PM hiện đại phải quản lý, không chỉ là câu chuyện tiện lợi.</div>
</div>`,
        },
        {
          title: 'Quiz 6 — Agile & AI in PM|||Quiz 6 — Agile & AI trong PM',
          slug: 'pmg201c-quiz-6',
          type: 'QUIZ',
          description: 'Kiểm tra predictive vs adaptive, Scrum, và ranh giới dùng AI.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Adaptive (Agile) approaches are best when…|||Cách adaptive (Agile) tốt nhất khi…', options: ['requirements are fully known and stable|||yêu cầu đã biết hết và ổn định', 'requirements are uncertain and evolving|||yêu cầu bất định và tiến hóa', 'there is no team|||không có nhóm', 'the budget is unlimited|||ngân sách vô hạn'], correctIndex: 1, points: 1 },
              { question: 'In Scrum, work is delivered in…|||Trong Scrum, công việc được bàn giao theo…', options: ['one big release at the end|||một bản phát hành lớn ở cuối', 'small increments each sprint|||từng phần nhỏ mỗi sprint', 'no fixed rhythm|||không nhịp cố định', 'yearly cycles|||chu kỳ hằng năm'], correctIndex: 1, points: 1 },
              { question: 'Agile fixes time and cost (the sprint) and flexes…|||Agile cố định thời gian và chi phí (sprint) và co giãn…', options: ['the team|||nhóm', 'scope (what fits in the sprint)|||phạm vi (cái gì vừa sprint)', 'the language|||ngôn ngữ', 'nothing|||không gì'], correctIndex: 1, points: 1 },
              { question: 'When AI\'s estimate conflicts with your informed team, you should…|||Khi ước lượng của AI mâu thuẫn với nhóm có hiểu biết của bạn, bạn nên…', options: ['always trust the AI|||luôn tin AI', 'trust the informed humans and use AI as a discussion prompt|||tin con người có thông tin và dùng AI như gợi ý để bàn', 'delete the plan|||xoá kế hoạch', 'average the two blindly|||trung bình hai cái mù quáng'], correctIndex: 1, points: 1 },
              { question: 'Using "we\'re Agile" as an excuse to skip all planning is called…|||Lấy "chúng tôi Agile" làm cớ bỏ mọi lập kế hoạch gọi là…', options: ['fast-tracking', 'cargo-cult Agile', 'crashing', 'the critical path'], correctIndex: 1, points: 1 },
              { question: 'Pasting confidential budgets into a public AI tool is risky because it can… (beyond-syllabus)|||Dán ngân sách bảo mật vào công cụ AI công cộng rủi ro vì có thể… (ngoài giáo trình)', options: ['speed up the project|||tăng tốc dự án', 'leak sensitive data and breach agreements|||rò rỉ dữ liệu nhạy cảm và vi phạm thỏa thuận', 'improve the estimate|||cải thiện ước lượng', 'reduce the budget|||giảm ngân sách'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
  ],
};
