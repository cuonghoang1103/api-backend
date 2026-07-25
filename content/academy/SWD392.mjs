/**
 * SWD392 — Software Architecture and Design (Kiến trúc và thiết kế phần mềm). Kỳ 7.
 * Bám syllabus FPTU (sylID 14179, 7 CLO, 60 buổi). Tiên quyết: SWE201c/SWE202c, PRO192. 3 tín chỉ.
 * Giáo trình: Gomaa (COMET/UML) + Fowler (UML Distilled) + GoF Design Patterns (Gamma et al).
 * Nội dung: nền tảng thiết kế, UML, COMET analysis model, kiến trúc phần mềm, quality attributes,
 *   design patterns (GoF), thiết kế CSDL quan hệ, và dùng AI (ChatGPT/PlantUML/Copilot) hỗ trợ.
 * Grading: Course Project 25% (>=5) + Progress Test 15% + Final Exam 60% (=Practical 20% >=4 + Theory 40% >=4), avg >=5.
 * Chuẩn CHUYÊN NGHIỆP như SWP391: thang điểm, checklist, anti-fail/high-mark, ngân hàng câu hỏi thi + vấn đáp theo CLO,
 *   ngân hàng đề tài project + rubric, code snippet bank cho pattern.
 * Song ngữ EN/VN đối xứng. Ví dụ có lời giải + ★ ngoài giáo trình.
 * Deep-link CodeLab: java-core (OOP/patterns), system-design. UML tools → Exp Hub.
 * ESCAPE: backtick trong code -> &#96; ; ${..} -> \${ ; < > & trong <pre> -> &lt; &gt; &amp;
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/SWD392.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    academyType: 'FPT',
    courseCode: 'SWD392',
    title: 'Software Architecture and Design',
    slug: 'software-architecture-and-design',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Design software systems that scale: design concepts (coupling, cohesion, abstraction), UML modeling, the COMET method, architectural styles, quality attributes, the GoF design patterns, relational design, and AI-assisted modeling.|||Thiết kế hệ thống phần mềm có thể mở rộng: khái niệm thiết kế (coupling, cohesion, trừu tượng), mô hình UML, phương pháp COMET, kiểu kiến trúc, quality attributes, design patterns GoF, thiết kế quan hệ, và mô hình hoá có AI hỗ trợ.',
    description: 'SWD392 là môn KIẾN TRÚC & THIẾT KẾ PHẦN MỀM của Kỳ 7, dạy cách thiết kế các hệ thống phần mềm đủ lớn và phức tạp cần nhiều người làm nhiều tháng. Bạn học nền tảng thiết kế (quy trình, khái niệm: trừu tượng, mô-đun, coupling/cohesion, che giấu thông tin, ký hiệu) → mô hình hoá UML (class, sequence, statechart, use case) và phương pháp COMET của Gomaa → mô hình phân tích (analysis model): lớp/đối tượng, statechart → thiết kế KIẾN TRÚC phần mềm (các kiểu/pattern kiến trúc) và quality attributes (Chương 20) → DESIGN PATTERNS (GoF: cấu trúc và cách tài liệu hoá một pattern) → thiết kế cơ sở dữ liệu quan hệ trong design model → và dùng công cụ AI (ChatGPT, PlantUML, Copilot) hỗ trợ phân tích & thiết kế. Có Course Project nhóm (thiết kế một hệ thống phức tạp) + Practical Exam + Theory Exam. Tiên quyết: SWE201c/SWE202c và PRO192. Đây là môn nâng tư duy từ "viết code" lên "thiết kế hệ thống".',
    whatYouLearn: 'Nắm nền tảng thiết kế phần mềm: quy trình, trừu tượng, mô-đun hoá, coupling vs cohesion, che giấu thông tin; đọc và vẽ các sơ đồ UML (class, sequence, statechart, use case); áp dụng phương pháp COMET (use case → analysis model → design model); xây analysis model với lớp/đối tượng và statechart; thiết kế kiến trúc phần mềm bằng các kiểu kiến trúc (layered, client-server, MVC, microservices, event-driven, pipe-and-filter); phân tích và cân bằng quality attributes (hiệu năng, khả mở, bảo mật, khả bảo trì); hiểu và tài liệu hoá các design pattern GoF (creational/structural/behavioral); thiết kế cơ sở dữ liệu quan hệ từ mô hình lớp; và dùng AI (ChatGPT sinh use case, PlantUML sinh sơ đồ, Copilot sinh boilerplate) một cách có trách nhiệm.',
    requirements: 'Tiên quyết: SWE201c hoặc SWE202c (Kỹ nghệ phần mềm) và PRO192 (OOP với Java). Cần: một công cụ mô hình UML (Visual Paradigm / MagicDraw / draw.io / PlantUML — PlantUML miễn phí và hợp tự động hoá), và một tài khoản AI (ChatGPT/Gemini) + GitHub Copilot (tuỳ chọn). Nên vững OOP (lớp, kế thừa, đa hình, interface) từ PRO192.',
    documentsNote: 'Giáo trình: Hassan Gomaa — Software Modeling and Design: UML, Use Cases, Patterns, and Software Architectures (Cambridge) • Martin Fowler — UML Distilled (Addison-Wesley) • Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides — Design Patterns: Elements of Reusable Object-Oriented Software (GoF). Công cụ mô hình: Visual Paradigm, MagicDraw, Microsoft Visio, Rational Software Architect, PlantUML, draw.io. Công cụ AI (CLO7): ChatGPT (sinh use case), PlantUML (sinh sơ đồ từ text), GitHub Copilot (boilerplate). Luyện code pattern trên Code Lab: track Java Core (OOP & patterns); kiến trúc trên track System Design. UML tools → Exp Hub. Kèm file syllabus gốc SWD392.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn thiết kế gì, hành trình từ yêu cầu tới kiến trúc, điều kiện qua môn & các thành phần điểm, chuẩn đầu ra, công cụ UML, ngân hàng đề tài project, và bí quyết điểm cao.',
      lessons: [
        {
          title: '0.1 — About SWD392 & the design journey map|||0.1 — Giới thiệu SWD392 & bản đồ hành trình thiết kế',
          slug: 'swd392-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Kiến trúc & thiết kế phần mềm là gì, khác lập trình ra sao, và bản đồ từ yêu cầu tới thiết kế chi tiết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About SWD392 — Software Architecture and Design</h2>
<p class="lead">This course lifts you from <em>writing code</em> to <strong>designing systems</strong>. Before a large system is built, someone decides its structure: what the components are, how they interact, where data lives, and which qualities (speed, security, changeability) matter most. SWD392 teaches you to make those decisions and communicate them with UML.</p>
<p>You work through the COMET method (Gomaa): requirements → use cases → an analysis model → an architecture → a detailed design with patterns → a database. A team Course Project applies it all to one complex system.</p>
<h3>Design vs coding — the shift in altitude</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Coding</b><span>make one class/function work</span></div>
  <div class="lz-step"><b>Design</b><span>decide the classes and how they relate</span></div>
  <div class="lz-step"><b>Architecture</b><span>decide the big components &amp; their interactions</span></div>
</div>
<h3>Your journey — from requirements to a designed system</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Design fundamentals &amp; UML</div><div class="lz-nsub">abstraction · modularity · coupling/cohesion · UML diagrams</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Requirements &amp; analysis (COMET)</div><div class="lz-nsub">use cases · analysis model · classes · statecharts</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Software architecture</div><div class="lz-nsub">architectural styles · quality attributes &amp; trade-offs</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Design patterns (GoF)</div><div class="lz-nsub">creational · structural · behavioral</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Database design &amp; AI tools</div><div class="lz-nsub">relational design · ChatGPT/PlantUML/Copilot</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Project, defense &amp; exams</div><div class="lz-nsub">design a complex system · present · Theory + Practical</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">SOLID · anti-patterns · microservices &amp; DDD</div><div class="lz-nsub">design like a senior engineer</div></div></div>
</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-architecture-and-design%2Flearn&reflabel=SWD392#module-249" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: OOP in Java (Code Lab)</span><span class="lc-sub">Design patterns build on solid OOP — refresh it on the Java Core track.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout ok">The one idea behind everything: <strong>manage complexity through structure</strong>. Good design is not about clever code — it is about organising a system so that each part is simple, changes stay local, and a new developer can understand it. Every concept here serves that goal.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu SWD392 — Kiến trúc & thiết kế phần mềm</h2>
<p class="lead">Môn này nâng bạn từ <em>viết code</em> lên <strong>thiết kế hệ thống</strong>. Trước khi một hệ thống lớn được xây, ai đó quyết định cấu trúc của nó: có những thành phần gì, chúng tương tác thế nào, dữ liệu nằm ở đâu, và phẩm chất nào (tốc độ, bảo mật, dễ đổi) quan trọng nhất. SWD392 dạy bạn ra những quyết định đó và truyền đạt chúng bằng UML.</p>
<p>Bạn đi qua phương pháp COMET (Gomaa): yêu cầu → use case → analysis model → kiến trúc → thiết kế chi tiết với pattern → cơ sở dữ liệu. Một Course Project nhóm áp dụng tất cả vào một hệ thống phức tạp.</p>
<h3>Thiết kế vs lập trình — cú đổi độ cao</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Lập trình</b><span>làm một lớp/hàm chạy</span></div>
  <div class="lz-step"><b>Thiết kế</b><span>quyết các lớp và cách chúng liên hệ</span></div>
  <div class="lz-step"><b>Kiến trúc</b><span>quyết các thành phần lớn &amp; tương tác của chúng</span></div>
</div>
<h3>Hành trình của bạn — từ yêu cầu tới một hệ thống đã thiết kế</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Nền tảng thiết kế &amp; UML</div><div class="lz-nsub">trừu tượng · mô-đun · coupling/cohesion · sơ đồ UML</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Yêu cầu &amp; phân tích (COMET)</div><div class="lz-nsub">use case · analysis model · lớp · statechart</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Kiến trúc phần mềm</div><div class="lz-nsub">kiểu kiến trúc · quality attributes &amp; đánh đổi</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Design patterns (GoF)</div><div class="lz-nsub">creational · structural · behavioral</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế CSDL &amp; công cụ AI</div><div class="lz-nsub">thiết kế quan hệ · ChatGPT/PlantUML/Copilot</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Project, vấn đáp &amp; thi</div><div class="lz-nsub">thiết kế hệ phức tạp · thuyết trình · Theory + Practical</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">SOLID · anti-pattern · microservices &amp; DDD</div><div class="lz-nsub">thiết kế như một kỹ sư senior</div></div></div>
</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-architecture-and-design%2Flearn&reflabel=SWD392#module-249" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: OOP trong Java (Code Lab)</span><span class="lc-sub">Design pattern dựng trên OOP vững — ôn nó trên track Java Core.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout ok">Một ý tưởng đằng sau mọi thứ: <strong>quản lý độ phức tạp bằng cấu trúc</strong>. Thiết kế tốt không phải là code khôn ngoan — mà là tổ chức một hệ thống sao cho mỗi phần đơn giản, thay đổi ở lại cục bộ, và một dev mới hiểu được nó. Mọi khái niệm ở đây phục vụ mục tiêu đó.</div>
</div>`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'swd392-dieu-kien-qua-mon',
          type: 'VIDEO',
          description: 'Tín chỉ, tiên quyết, các thành phần điểm, và ba cổng (Project ≥5, Practical ≥4, Theory ≥4).',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">SWD392 has three gates: the Course Project must reach 5, and both halves of the Final Exam (Theory and Practical) must reach 4. Miss any one and you fail regardless of the average.</p>
<div class="kv-grid">
  <div class="kv"><b>Credits</b><span>3</span></div>
  <div class="kv"><b>Prerequisite</b><span>SWE201c/SWE202c, PRO192</span></div>
  <div class="kv"><b>Attendance</b><span>≥80% contact slots to sit the exam</span></div>
  <div class="kv"><b>Pass</b><span>Project ≥5 AND Theory ≥4 AND Practical ≥4 AND avg ≥5</span></div>
</div>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Format</th><th>Gate</th></tr></thead>
  <tbody>
    <tr><td>Course Project</td><td>25%</td><td>Team (5–6) design of a complex system</td><td><b>≥ 5</b></td></tr>
    <tr><td>Progress Test (×3)</td><td>15%</td><td>Short tests, 30 min each</td><td>—</td></tr>
    <tr><td>Theory Exam</td><td>40%</td><td>Concepts, UML, patterns, 60 min</td><td><b>≥ 4</b></td></tr>
    <tr><td>Practical Exam</td><td>20%</td><td>Applied modeling/design, 85 min</td><td><b>≥ 4</b></td></tr>
  </tbody>
</table>
<p>The Theory + Practical exams together make up the 60% "Final Exam" (145 minutes total).</p>
<div class="formula"><span class="lbl">TO PASS</span> Course Project ≥ 5 &nbsp;AND&nbsp; Theory ≥ 4 &nbsp;AND&nbsp; Practical ≥ 4 &nbsp;AND&nbsp; weighted average ≥ 5</div>
<div class="callout warn">The <strong>Course Project (25%, gate ≥5)</strong> is a team design of a complex system — not code, but a full design: use cases, analysis model, architecture, design with patterns, and a database. It is graded on design quality and defended in a final evaluation (session 59).</div>
<div class="out"><b>Worked example:</b> Student has Project 7, Progress 6, Theory 6, but Practical 3.5. The <b>Practical ≥4 gate fails them</b> despite a strong average. Lesson: practise applied modeling (draw diagrams, apply a pattern) under time — theory alone is not enough.</div>
<div class="pitfall">Three independent gates mean you cannot compensate a weak part with a strong one. A brilliant project cannot rescue a Theory exam below 4. Prepare all three deliberately.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">SWD392 có ba cổng: Course Project phải đạt 5, và cả hai nửa của Final Exam (Theory và Practical) phải đạt 4. Thiếu một cái là rớt bất kể trung bình.</p>
<div class="kv-grid">
  <div class="kv"><b>Tín chỉ</b><span>3</span></div>
  <div class="kv"><b>Tiên quyết</b><span>SWE201c/SWE202c, PRO192</span></div>
  <div class="kv"><b>Điểm danh</b><span>≥80% buổi mới được thi</span></div>
  <div class="kv"><b>Đậu</b><span>Project ≥5 VÀ Theory ≥4 VÀ Practical ≥4 VÀ avg ≥5</span></div>
</div>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Hình thức</th><th>Cổng</th></tr></thead>
  <tbody>
    <tr><td>Course Project</td><td>25%</td><td>Nhóm (5–6) thiết kế một hệ thống phức tạp</td><td><b>≥ 5</b></td></tr>
    <tr><td>Progress Test (×3)</td><td>15%</td><td>Test ngắn, 30 phút mỗi cái</td><td>—</td></tr>
    <tr><td>Theory Exam</td><td>40%</td><td>Khái niệm, UML, pattern, 60 phút</td><td><b>≥ 4</b></td></tr>
    <tr><td>Practical Exam</td><td>20%</td><td>Mô hình/thiết kế áp dụng, 85 phút</td><td><b>≥ 4</b></td></tr>
  </tbody>
</table>
<p>Theory + Practical cùng tạo thành "Final Exam" 60% (tổng 145 phút).</p>
<div class="formula"><span class="lbl">ĐỂ ĐẬU</span> Course Project ≥ 5 &nbsp;VÀ&nbsp; Theory ≥ 4 &nbsp;VÀ&nbsp; Practical ≥ 4 &nbsp;VÀ&nbsp; trung bình có trọng số ≥ 5</div>
<div class="callout warn"><strong>Course Project (25%, cổng ≥5)</strong> là một thiết kế nhóm cho một hệ thống phức tạp — không phải code, mà là một thiết kế đầy đủ: use case, analysis model, kiến trúc, thiết kế với pattern, và một cơ sở dữ liệu. Nó được chấm theo chất lượng thiết kế và bảo vệ ở đánh giá cuối (buổi 59).</div>
<div class="out"><b>Ví dụ có lời giải:</b> Sinh viên có Project 7, Progress 6, Theory 6, nhưng Practical 3.5. <b>Cổng Practical ≥4 làm rớt</b> dù trung bình mạnh. Bài học: luyện mô hình hoá áp dụng (vẽ sơ đồ, áp một pattern) có tính giờ — lý thuyết không mình đủ.</div>
<div class="pitfall">Ba cổng độc lập nghĩa là bạn không thể bù một phần yếu bằng một phần mạnh. Một project xuất sắc không cứu được Theory dưới 4. Chuẩn bị cả ba có chủ đích.</div>
</div>`,
        },
        {
          title: '0.3 — Learning outcomes (CLOs)|||0.3 — Chuẩn đầu ra (CLO)',
          slug: 'swd392-chuan-dau-ra',
          type: 'VIDEO',
          description: '7 chuẩn đầu ra và cách chúng gắn vào các chương.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Course learning outcomes (CLOs)</h2>
<p class="lead">Seven CLOs trace the COMET pipeline from fundamentals to patterns, ending with AI-assisted design.</p>
<table>
  <thead><tr><th>CLO</th><th>You will be able to…</th><th>Chapter</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Know the fundamentals of software design (process, concepts, notation)</td><td>Ch1</td></tr>
    <tr><td>CLO2</td><td>Explain the steps in using COMET/UML and design concepts</td><td>Ch1-2</td></tr>
    <tr><td>CLO3</td><td>Use artifacts to develop an analysis model (classes, statecharts)</td><td>Ch2</td></tr>
    <tr><td>CLO4</td><td>Design the overall software architecture in the design model</td><td>Ch3</td></tr>
    <tr><td>CLO5</td><td>Design a relational database in the design model</td><td>Ch5</td></tr>
    <tr><td>CLO6</td><td>Explain the structure of and document a design pattern</td><td>Ch4</td></tr>
    <tr><td>CLO7</td><td>Use AI tools (ChatGPT, PlantUML, Copilot) to support design</td><td>Ch5</td></tr>
  </tbody>
</table>
<div class="callout">Notice the verbs: "know", "explain", "use", "design". The Theory exam tests the first two; the Practical exam and Project test the last two. Practise producing diagrams and design decisions, not just defining terms.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">Bảy CLO đi theo đường ống COMET từ nền tảng tới pattern, kết bằng thiết kế có AI hỗ trợ.</p>
<table>
  <thead><tr><th>CLO</th><th>Bạn sẽ có thể…</th><th>Chương</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Nắm nền tảng thiết kế phần mềm (quy trình, khái niệm, ký hiệu)</td><td>Ch1</td></tr>
    <tr><td>CLO2</td><td>Giải thích các bước dùng COMET/UML và khái niệm thiết kế</td><td>Ch1-2</td></tr>
    <tr><td>CLO3</td><td>Dùng artifact để xây analysis model (lớp, statechart)</td><td>Ch2</td></tr>
    <tr><td>CLO4</td><td>Thiết kế kiến trúc phần mềm tổng thể trong design model</td><td>Ch3</td></tr>
    <tr><td>CLO5</td><td>Thiết kế cơ sở dữ liệu quan hệ trong design model</td><td>Ch5</td></tr>
    <tr><td>CLO6</td><td>Giải thích cấu trúc và tài liệu hoá một design pattern</td><td>Ch4</td></tr>
    <tr><td>CLO7</td><td>Dùng công cụ AI (ChatGPT, PlantUML, Copilot) hỗ trợ thiết kế</td><td>Ch5</td></tr>
  </tbody>
</table>
<div class="callout">Để ý các động từ: "nắm", "giải thích", "dùng", "thiết kế". Theory exam kiểm hai cái đầu; Practical exam và Project kiểm hai cái cuối. Luyện tạo ra sơ đồ và quyết định thiết kế, không chỉ định nghĩa thuật ngữ.</div>
</div>`,
        },
        {
          title: '0.4 — Tools & UML modeling setup|||0.4 — Công cụ & cài đặt mô hình UML',
          slug: 'swd392-cong-cu',
          type: 'VIDEO',
          description: 'Visual Paradigm, draw.io, PlantUML, và công cụ AI — cách cài và khi nào dùng cái nào.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Your modeling toolkit</h2>
<p class="lead">This course is about producing diagrams and design documents. Pick a UML tool you are fast in — and PlantUML, which turns text into diagrams (perfect for version control and AI generation).</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Visual Paradigm / MagicDraw</b> — full UML CASE tools (class, sequence, statechart, use case).</div>
  <div class="lz-layer"><b>draw.io (diagrams.net)</b> — free, browser-based, great for quick diagrams.</div>
  <div class="lz-layer"><b>PlantUML</b> — write UML as text; ideal for Git and AI-generated diagrams (CLO7).</div>
  <div class="lz-layer"><b>ChatGPT + Copilot</b> — generate use case descriptions and boilerplate (CLO7).</div>
</div>
<div class="out"><b>PlantUML — a class diagram from text:</b>
<pre>@startuml
class Order {
  +id: int
  +total: decimal
  +addItem()
}
class Customer
Customer "1" -- "*" Order
@enduml</pre>
<em>PlantUML renders this into a real class diagram. Because it is text, it lives in Git, diffs cleanly, and an AI can generate it from your requirements.</em></div>
<a class="link-card exphub" href="/exp-hub/swd392-cong-cu-uml?ref=%2Fcourses%2Fsoftware-architecture-and-design%2Flearn&reflabel=SWD392" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Set up your UML tools — step by step</span><span class="lc-sub">Install Visual Paradigm / PlantUML and draw your first diagram, with links, on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout ok">A diagram is a communication tool, not decoration. The best tool is the one that lets you <strong>think and revise fast</strong>. For quick ideation use draw.io; for versioned, AI-friendly diagrams use PlantUML; for the formal project deliverable use Visual Paradigm.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Bộ công cụ mô hình của bạn</h2>
<p class="lead">Môn này là về tạo ra sơ đồ và tài liệu thiết kế. Chọn một công cụ UML bạn dùng nhanh — và PlantUML, biến text thành sơ đồ (hoàn hảo cho version control và sinh bằng AI).</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Visual Paradigm / MagicDraw</b> — công cụ UML CASE đầy đủ (class, sequence, statechart, use case).</div>
  <div class="lz-layer"><b>draw.io (diagrams.net)</b> — miễn phí, chạy trình duyệt, tốt cho sơ đồ nhanh.</div>
  <div class="lz-layer"><b>PlantUML</b> — viết UML bằng text; lý tưởng cho Git và sơ đồ sinh bằng AI (CLO7).</div>
  <div class="lz-layer"><b>ChatGPT + Copilot</b> — sinh mô tả use case và boilerplate (CLO7).</div>
</div>
<div class="out"><b>PlantUML — một class diagram từ text:</b>
<pre>@startuml
class Order {
  +id: int
  +total: decimal
  +addItem()
}
class Customer
Customer "1" -- "*" Order
@enduml</pre>
<em>PlantUML render cái này thành một class diagram thật. Vì là text, nó nằm trong Git, diff sạch, và một AI có thể sinh nó từ yêu cầu của bạn.</em></div>
<a class="link-card exphub" href="/exp-hub/swd392-cong-cu-uml?ref=%2Fcourses%2Fsoftware-architecture-and-design%2Flearn&reflabel=SWD392" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài đặt công cụ UML — từng bước</span><span class="lc-sub">Cài Visual Paradigm / PlantUML và vẽ sơ đồ đầu tiên, kèm link, trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout ok">Một sơ đồ là công cụ giao tiếp, không phải trang trí. Công cụ tốt nhất là cái cho bạn <strong>nghĩ và sửa nhanh</strong>. Cho ý tưởng nhanh dùng draw.io; cho sơ đồ có version, thân thiện AI dùng PlantUML; cho sản phẩm project chính thức dùng Visual Paradigm.</div>
</div>`,
        },
        {
          title: '0.5 — Course-project topic bank & how to choose (mentor guide)|||0.5 — Ngân hàng đề tài project & cách chọn (mentor)',
          slug: 'swd392-ngan-hang-de-tai',
          type: 'VIDEO',
          description: '12 đề tài hệ thống đã kiểm phạm vi cho Course Project + rubric 6 phép thử chọn đề.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Choosing your course project</h2>
<p class="lead">The Course Project (25%, ≥5) asks a team to <strong>design</strong> a complex system — not fully build it. The best system is rich enough to need multiple use cases, several classes, an architectural decision, at least one design pattern, and a real database — yet bounded enough to model well.</p>
<h3>The 6-test rubric — score a system before committing</h3>
<table>
  <thead><tr><th>#</th><th>Test</th><th>Ask yourself</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Multiple actors</td><td>Are there ≥2 roles with different use cases (customer, admin)?</td></tr>
    <tr><td>2</td><td>Rich domain</td><td>Are there 6–12 core classes with real relationships?</td></tr>
    <tr><td>3</td><td>Stateful behaviour</td><td>Is there an entity with a lifecycle worth a statechart (an order, a booking)?</td></tr>
    <tr><td>4</td><td>Architectural choice</td><td>Does it invite a real decision (layered? client-server? which components)?</td></tr>
    <tr><td>5</td><td>Pattern opportunity</td><td>Is there a place a GoF pattern genuinely helps (notifications → Observer)?</td></tr>
    <tr><td>6</td><td>A quality attribute</td><td>Does one quality clearly matter (security for banking, scale for ticketing)?</td></tr>
  </tbody>
</table>
<h3>Topic bank — 12 scope-checked systems</h3>
<ol>
  <li>Online course platform — enroll, learn, grade; roles: student/instructor/admin</li>
  <li>Hospital appointment system — booking, records; states: scheduled→done→cancelled</li>
  <li>E-commerce marketplace — catalog, cart, orders, payment; multiple actors</li>
  <li>Ride-hailing backend — request, match, trip, rating; stateful trips</li>
  <li>Hotel/homestay booking — search, book, manage; overlap rules</li>
  <li>Library management — catalog, loans, reservations; loan lifecycle</li>
  <li>Food-delivery platform — restaurants, orders, delivery tracking</li>
  <li>Event ticketing — events, seats, purchase; scalability under load</li>
  <li>Banking/e-wallet — accounts, transfers, statements; security-critical</li>
  <li>Smart-home hub — devices, rules, notifications; Observer pattern fits</li>
  <li>Learning management (LMS) — courses, assignments, submissions, grading</li>
  <li>Warehouse/inventory system — stock, orders, suppliers; reporting</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write the "architecturally significant requirements" first.</b> Not all requirements shape the architecture — but a few do (must handle 10k concurrent users; must keep an audit trail; must integrate a payment gateway). Identify these 3–5 drivers early; they justify your architectural choices to the graders. Distinguishing architecture-shaping requirements from ordinary ones is a senior skill the project brief assumes but does not spell out.</div>
<div class="pitfall">Avoid a system so small it needs no architectural decision (a single-user to-do app). If there is no real choice to make — no components to separate, no pattern to justify — the project cannot demonstrate CLO4 and CLO6, and the design write-up has nothing to say.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Chọn course project của bạn</h2>
<p class="lead">Course Project (25%, ≥5) yêu cầu một nhóm <strong>thiết kế</strong> một hệ thống phức tạp — không xây hết. Hệ tốt nhất đủ giàu để cần nhiều use case, vài lớp, một quyết định kiến trúc, ít nhất một design pattern, và một database thật — nhưng đủ giới hạn để mô hình hoá tốt.</p>
<h3>Rubric 6 phép thử — chấm hệ thống trước khi cam kết</h3>
<table>
  <thead><tr><th>#</th><th>Phép thử</th><th>Tự hỏi</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Nhiều actor</td><td>Có ≥2 vai với use case khác nhau (khách, admin) không?</td></tr>
    <tr><td>2</td><td>Domain giàu</td><td>Có 6–12 lớp cốt lõi với quan hệ thật không?</td></tr>
    <tr><td>3</td><td>Hành vi có trạng thái</td><td>Có một thực thể có vòng đời đáng vẽ statechart (một order, một booking) không?</td></tr>
    <tr><td>4</td><td>Lựa chọn kiến trúc</td><td>Nó có mời một quyết định thật (layered? client-server? thành phần nào) không?</td></tr>
    <tr><td>5</td><td>Cơ hội dùng pattern</td><td>Có chỗ một GoF pattern thật sự giúp (notification → Observer) không?</td></tr>
    <tr><td>6</td><td>Một quality attribute</td><td>Có một phẩm chất rõ ràng quan trọng (bảo mật cho ngân hàng, khả mở cho bán vé) không?</td></tr>
  </tbody>
</table>
<h3>Ngân hàng đề tài — 12 hệ thống đã kiểm phạm vi</h3>
<ol>
  <li>Nền tảng khoá học online — ghi danh, học, chấm; vai: sinh viên/giảng viên/admin</li>
  <li>Hệ đặt lịch bệnh viện — đặt lịch, hồ sơ; trạng thái: đặt→xong→huỷ</li>
  <li>Sàn thương mại điện tử — danh mục, giỏ, đơn, thanh toán; nhiều actor</li>
  <li>Backend gọi xe — yêu cầu, ghép, chuyến, đánh giá; chuyến có trạng thái</li>
  <li>Đặt phòng khách sạn/homestay — tìm, đặt, quản lý; luật chồng ngày</li>
  <li>Quản lý thư viện — danh mục, mượn, đặt trước; vòng đời phiếu mượn</li>
  <li>Nền tảng giao đồ ăn — nhà hàng, đơn, theo dõi giao</li>
  <li>Bán vé sự kiện — sự kiện, ghế, mua; khả mở dưới tải</li>
  <li>Ngân hàng/ví điện tử — tài khoản, chuyển, sao kê; trọng bảo mật</li>
  <li>Hub nhà thông minh — thiết bị, luật, thông báo; hợp Observer pattern</li>
  <li>Hệ quản lý học tập (LMS) — khoá, bài tập, nộp, chấm</li>
  <li>Hệ kho/tồn kho — hàng, đơn, nhà cung cấp; báo cáo</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết "các yêu cầu có ý nghĩa kiến trúc" trước.</b> Không phải mọi yêu cầu định hình kiến trúc — nhưng vài cái có (phải chịu 10k người dùng đồng thời; phải giữ audit trail; phải tích hợp cổng thanh toán). Nhận diện 3–5 driver này sớm; chúng biện minh cho các lựa chọn kiến trúc của bạn với giám khảo. Phân biệt yêu cầu định-hình-kiến-trúc với yêu cầu thường là một kỹ năng senior mà đề project mặc định nhưng không nói rõ.</div>
<div class="pitfall">Tránh một hệ nhỏ tới mức không cần quyết định kiến trúc (một app to-do một-người-dùng). Nếu không có lựa chọn thật để làm — không thành phần để tách, không pattern để biện minh — project không thể thể hiện CLO4 và CLO6, và bản viết thiết kế chẳng có gì để nói.</div>
</div>`,
        },
        {
          title: '0.6 — Why students lose marks & the formula for a high grade|||0.6 — Vì sao mất điểm & công thức điểm cao',
          slug: 'swd392-chong-mat-diem',
          type: 'VIDEO',
          description: '7 kiểu mất điểm trong SWD392 + cờ xanh/đỏ + công thức điểm cao — kiểu SWP391.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>Why students lose marks — and how to score high</h2>
<p class="lead">Design is judged on clarity and justification, not decoration. Here is where marks leak across the project and both exams.</p>
<h3>The 7 ways to lose marks</h3>
<table>
  <thead><tr><th>#</th><th>Loss</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Wrong UML notation (arrows, multiplicity)</td><td>Learn the exact meaning of each relationship (association, aggregation, composition, inheritance).</td></tr>
    <tr><td>2</td><td>High coupling / low cohesion designs</td><td>Aim for loose coupling and high cohesion — each class one clear responsibility.</td></tr>
    <tr><td>3</td><td>Naming a pattern but misapplying it</td><td>Use a pattern only where it fits; explain the problem it solves here.</td></tr>
    <tr><td>4</td><td>Architecture with no justification</td><td>Tie every architectural choice to a quality attribute / requirement.</td></tr>
    <tr><td>5</td><td>Diagrams that disagree with each other</td><td>Class, sequence and DB must be consistent — same entities, same relationships.</td></tr>
    <tr><td>6</td><td>Only definitions on the Theory exam</td><td>Apply concepts (draw, compare, choose), not just recite.</td></tr>
    <tr><td>7</td><td>AI-generated design you cannot explain</td><td>Use AI to draft, then verify and own every decision (CLO7).</td></tr>
  </tbody>
</table>
<h3>Green flags vs red flags</h3>
<div class="kv-grid">
  <div class="kv"><b>🟢 Green</b><span>correct notation · loose coupling/high cohesion · justified architecture · pattern fits the problem · consistent diagrams</span></div>
  <div class="kv"><b>🔴 Red</b><span>wrong arrows · god class · pattern for its own sake · "we chose MVC because" (no why) · diagrams contradict</span></div>
</div>
<div class="formula"><span class="lbl">HIGH-GRADE FORMULA</span> Correct UML + loose coupling &amp; high cohesion + architecture justified by quality attributes + patterns applied where they fit + consistent, defensible diagrams</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Every design decision needs a "because".</b> The single biggest differentiator between an average and an excellent design write-up is justification: "We used a layered architecture <em>because</em> the requirement to swap the database later demands separating persistence." Graders and examiners reward the reasoning as much as the diagram. Rehearse defending each choice — this is exactly what the project evaluation and Practical exam probe, and what the syllabus assumes but never drills.</div>
<div class="pitfall">Adding patterns "to look advanced" backfires — an unnecessary Singleton or Factory that complicates a simple design loses marks for over-engineering. The best design uses the <em>fewest</em> structures that solve the problem clearly.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>Vì sao sinh viên mất điểm — và cách điểm cao</h2>
<p class="lead">Thiết kế được chấm theo sự rõ ràng và biện minh, không phải trang trí. Đây là nơi điểm rò rỉ qua project và cả hai bài thi.</p>
<h3>7 kiểu mất điểm</h3>
<table>
  <thead><tr><th>#</th><th>Mất điểm</th><th>Cách sửa</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Sai ký hiệu UML (mũi tên, multiplicity)</td><td>Học chính xác nghĩa mỗi quan hệ (association, aggregation, composition, inheritance).</td></tr>
    <tr><td>2</td><td>Thiết kế coupling cao / cohesion thấp</td><td>Nhắm coupling lỏng và cohesion cao — mỗi lớp một trách nhiệm rõ.</td></tr>
    <tr><td>3</td><td>Gọi tên một pattern nhưng áp sai</td><td>Dùng pattern chỉ nơi nó vừa; giải thích vấn đề nó giải quyết ở đây.</td></tr>
    <tr><td>4</td><td>Kiến trúc không biện minh</td><td>Gắn mọi lựa chọn kiến trúc với một quality attribute / yêu cầu.</td></tr>
    <tr><td>5</td><td>Các sơ đồ mâu thuẫn nhau</td><td>Class, sequence và DB phải nhất quán — cùng thực thể, cùng quan hệ.</td></tr>
    <tr><td>6</td><td>Chỉ định nghĩa ở Theory exam</td><td>Áp dụng khái niệm (vẽ, so sánh, chọn), không chỉ đọc vẹt.</td></tr>
    <tr><td>7</td><td>Thiết kế AI sinh mà không giải thích được</td><td>Dùng AI để phác, rồi kiểm và sở hữu mọi quyết định (CLO7).</td></tr>
  </tbody>
</table>
<h3>Cờ xanh vs cờ đỏ</h3>
<div class="kv-grid">
  <div class="kv"><b>🟢 Xanh</b><span>ký hiệu đúng · coupling lỏng/cohesion cao · kiến trúc có biện minh · pattern vừa vấn đề · sơ đồ nhất quán</span></div>
  <div class="kv"><b>🔴 Đỏ</b><span>mũi tên sai · god class · pattern cho có · "chọn MVC vì" (không lý do) · sơ đồ mâu thuẫn</span></div>
</div>
<div class="formula"><span class="lbl">CÔNG THỨC ĐIỂM CAO</span> UML đúng + coupling lỏng &amp; cohesion cao + kiến trúc biện minh bằng quality attribute + pattern áp nơi nó vừa + sơ đồ nhất quán, bảo vệ được</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mọi quyết định thiết kế cần một chữ "vì".</b> Khác biệt lớn nhất giữa một bản viết thiết kế trung bình và xuất sắc là sự biện minh: "Chúng em dùng kiến trúc phân lớp <em>vì</em> yêu cầu đổi database sau này đòi tách tầng lưu trữ." Giám khảo và người thi thưởng lý lẽ ngang với sơ đồ. Tập bảo vệ từng lựa chọn — đây chính là điều đánh giá project và Practical exam dò, và điều giáo trình mặc định nhưng không luyện.</div>
<div class="pitfall">Thêm pattern "cho trông nâng cao" phản tác dụng — một Singleton hay Factory không cần thiết làm phức tạp một thiết kế đơn giản mất điểm vì over-engineer. Thiết kế tốt nhất dùng <em>ít nhất</em> cấu trúc mà giải quyết vấn đề rõ ràng.</div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — DESIGN FUNDAMENTALS & UML ══════════════════ */
    {
      title: 'Chapter 1 — Design fundamentals & UML|||Chương 1 — Nền tảng thiết kế & UML',
      description: 'Khái niệm thiết kế (trừu tượng, mô-đun, coupling/cohesion, che giấu thông tin) và các sơ đồ UML cốt lõi.',
      lessons: [
        {
          title: '1.1 — Core design concepts: coupling, cohesion & abstraction|||1.1 — Khái niệm cốt lõi: coupling, cohesion & trừu tượng',
          slug: 'swd392-1-1-design-concepts',
          type: 'VIDEO',
          description: 'Trừu tượng, mô-đun hoá, che giấu thông tin, và cặp đôi quyết định chất lượng: coupling & cohesion.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The concepts that make design "good" (CLO1)</h2>
<p class="lead">Every design principle serves one goal: manage complexity so the system is understandable and changeable. Five concepts do most of the work.</p>
<table>
  <thead><tr><th>Concept</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>Abstraction</td><td>Show the essential, hide the detail (an interface, not the implementation)</td></tr>
    <tr><td>Modularity</td><td>Split the system into parts you can build/understand separately</td></tr>
    <tr><td>Information hiding</td><td>A module hides its internals behind a stable interface</td></tr>
    <tr><td>Coupling</td><td>How much modules depend on each other — want it LOW</td></tr>
    <tr><td>Cohesion</td><td>How focused one module is on a single job — want it HIGH</td></tr>
  </tbody>
</table>
<h3>Loose coupling &amp; high cohesion — the golden pair</h3>
<div class="out"><b>Worked example — bad vs good:</b><br>
<b>Bad (high coupling):</b> <code>OrderService</code> directly creates and queries a <code>MySQLConnection</code>. Swapping the database means editing OrderService.<br>
<b>Good (low coupling):</b> <code>OrderService</code> depends on a <code>Repository</code> <em>interface</em>; a <code>MySQLRepository</code> implements it. Swapping the database means writing a new implementation — OrderService is untouched.<br>
<em>Depending on an abstraction (interface), not a concrete class, is how you loosen coupling.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Cohesion has a spectrum, and you want "functional".</b> The weakest cohesion is "coincidental" (a Utils class of unrelated methods); the strongest is "functional" (every element contributes to one task). Naming the levels — coincidental, logical, temporal, procedural, communicational, sequential, functional — lets you diagnose <em>why</em> a class feels wrong, not just that it does. This vocabulary from classic design theory sharpens the "high cohesion" advice the syllabus states plainly.</div>
<div class="pitfall">A "god class" that does everything (validation + database + business rules + formatting) has low cohesion and high coupling to the whole system. It is the most common design smell — split it by responsibility.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Các khái niệm làm thiết kế "tốt" (CLO1)</h2>
<p class="lead">Mọi nguyên tắc thiết kế phục vụ một mục tiêu: quản lý độ phức tạp để hệ thống dễ hiểu và dễ đổi. Năm khái niệm làm phần lớn việc.</p>
<table>
  <thead><tr><th>Khái niệm</th><th>Nghĩa</th></tr></thead>
  <tbody>
    <tr><td>Abstraction (trừu tượng)</td><td>Hiện cái thiết yếu, giấu chi tiết (một interface, không phải cài đặt)</td></tr>
    <tr><td>Modularity (mô-đun)</td><td>Chia hệ thành các phần xây/hiểu riêng được</td></tr>
    <tr><td>Information hiding (che giấu)</td><td>Một module giấu nội tại sau một interface ổn định</td></tr>
    <tr><td>Coupling</td><td>Các module phụ thuộc nhau bao nhiêu — muốn THẤP</td></tr>
    <tr><td>Cohesion</td><td>Một module tập trung vào một việc bao nhiêu — muốn CAO</td></tr>
  </tbody>
</table>
<h3>Coupling lỏng &amp; cohesion cao — cặp đôi vàng</h3>
<div class="out"><b>Ví dụ có lời giải — tệ vs tốt:</b><br>
<b>Tệ (coupling cao):</b> <code>OrderService</code> trực tiếp tạo và truy vấn một <code>MySQLConnection</code>. Đổi database là phải sửa OrderService.<br>
<b>Tốt (coupling thấp):</b> <code>OrderService</code> phụ thuộc một <em>interface</em> <code>Repository</code>; một <code>MySQLRepository</code> hiện thực nó. Đổi database là viết một cài đặt mới — OrderService không bị đụng.<br>
<em>Phụ thuộc một trừu tượng (interface), không phải lớp cụ thể, là cách bạn nới lỏng coupling.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cohesion có một phổ, và bạn muốn "functional".</b> Cohesion yếu nhất là "coincidental" (một lớp Utils toàn hàm không liên quan); mạnh nhất là "functional" (mọi phần tử góp cho một việc). Gọi tên các mức — coincidental, logical, temporal, procedural, communicational, sequential, functional — cho bạn chẩn đoán <em>vì sao</em> một lớp thấy sai, không chỉ là nó sai. Vốn từ này từ lý thuyết thiết kế cổ điển mài sắc lời khuyên "cohesion cao" mà giáo trình nói trơn.</div>
<div class="pitfall">Một "god class" làm mọi thứ (validation + database + luật nghiệp vụ + định dạng) có cohesion thấp và coupling cao với cả hệ. Đây là design smell phổ biến nhất — chia nó theo trách nhiệm.</div>
</div>`,
        },
        {
          title: '1.2 — UML diagrams you must read & draw|||1.2 — Các sơ đồ UML bạn phải đọc & vẽ',
          slug: 'swd392-1-2-uml',
          type: 'VIDEO',
          description: 'Class diagram (quan hệ & multiplicity), sequence, statechart, use case — và khi nào dùng cái nào.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>UML — the language of design (CLO1-2)</h2>
<p class="lead">UML is how designers communicate. You need four diagrams fluently, each answering a different question about the system.</p>
<table>
  <thead><tr><th>Diagram</th><th>Answers</th></tr></thead>
  <tbody>
    <tr><td>Use case</td><td>WHO uses the system to do WHAT (actors + goals)</td></tr>
    <tr><td>Class</td><td>WHAT the structure is (classes, attributes, relationships)</td></tr>
    <tr><td>Sequence</td><td>HOW objects collaborate over time for one scenario</td></tr>
    <tr><td>Statechart</td><td>How ONE object changes state through its lifecycle</td></tr>
  </tbody>
</table>
<h3>Class-diagram relationships (a top exam topic)</h3>
<table>
  <thead><tr><th>Relationship</th><th>Meaning</th><th>Notation</th></tr></thead>
  <tbody>
    <tr><td>Association</td><td>"knows about" / uses</td><td>plain line</td></tr>
    <tr><td>Aggregation</td><td>"has-a", parts can exist alone</td><td>hollow diamond</td></tr>
    <tr><td>Composition</td><td>"owns", parts die with the whole</td><td>filled diamond</td></tr>
    <tr><td>Inheritance</td><td>"is-a"</td><td>hollow triangle arrow</td></tr>
  </tbody>
</table>
<h3>Multiplicity — how many</h3>
<div class="out">A <code>Customer "1" -- "*" Order</code> means one customer has many orders; each order has exactly one customer. Multiplicity (1, 0..1, *, 1..*) is easy marks on the exam — and easy to get wrong if you guess.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Aggregation vs composition is decided by lifecycle, not feeling.</b> Ask: "if the whole is deleted, must the part be deleted too?" A university <em>has</em> departments (composition — delete the university, departments go); a team <em>has</em> players (aggregation — disband the team, players still exist). Deciding by the lifecycle question, not intuition, is what makes your class diagrams defensible — a precision the notation lesson introduces but rarely drills.</div>
<div class="pitfall">Do not overload one diagram. A class diagram shows structure, not flow; do not draw method-call order on it — that is what a sequence diagram is for. Mixing concerns makes both harder to read and costs marks.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>UML — ngôn ngữ của thiết kế (CLO1-2)</h2>
<p class="lead">UML là cách các nhà thiết kế giao tiếp. Bạn cần thành thạo bốn sơ đồ, mỗi cái trả lời một câu hỏi khác về hệ thống.</p>
<table>
  <thead><tr><th>Sơ đồ</th><th>Trả lời</th></tr></thead>
  <tbody>
    <tr><td>Use case</td><td>AI dùng hệ thống để làm GÌ (actor + mục tiêu)</td></tr>
    <tr><td>Class</td><td>Cấu trúc là GÌ (lớp, thuộc tính, quan hệ)</td></tr>
    <tr><td>Sequence</td><td>Các đối tượng phối hợp THẾ NÀO theo thời gian cho một kịch bản</td></tr>
    <tr><td>Statechart</td><td>MỘT đối tượng đổi trạng thái thế nào qua vòng đời</td></tr>
  </tbody>
</table>
<h3>Quan hệ trong class diagram (chủ đề thi hàng đầu)</h3>
<table>
  <thead><tr><th>Quan hệ</th><th>Nghĩa</th><th>Ký hiệu</th></tr></thead>
  <tbody>
    <tr><td>Association</td><td>"biết về" / dùng</td><td>đường thẳng thường</td></tr>
    <tr><td>Aggregation</td><td>"có-một", phần tồn tại riêng được</td><td>hình thoi rỗng</td></tr>
    <tr><td>Composition</td><td>"sở hữu", phần chết cùng tổng thể</td><td>hình thoi đặc</td></tr>
    <tr><td>Inheritance</td><td>"là-một"</td><td>mũi tên tam giác rỗng</td></tr>
  </tbody>
</table>
<h3>Multiplicity — bao nhiêu</h3>
<div class="out">Một <code>Customer "1" -- "*" Order</code> nghĩa là một khách có nhiều order; mỗi order có đúng một khách. Multiplicity (1, 0..1, *, 1..*) là điểm dễ trong thi — và dễ sai nếu bạn đoán.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Aggregation vs composition quyết bởi vòng đời, không phải cảm giác.</b> Hỏi: "nếu tổng thể bị xoá, phần có phải bị xoá theo không?" Một trường đại học <em>có</em> các khoa (composition — xoá trường, khoa mất); một đội <em>có</em> cầu thủ (aggregation — giải tán đội, cầu thủ vẫn tồn tại). Quyết bằng câu hỏi vòng đời, không phải trực giác, là điều làm class diagram của bạn bảo vệ được — một độ chính xác mà bài ký hiệu giới thiệu nhưng ít luyện.</div>
<div class="pitfall">Đừng chất quá tải một sơ đồ. Class diagram hiện cấu trúc, không phải luồng; đừng vẽ thứ tự gọi hàm lên nó — đó là việc của sequence diagram. Trộn mối quan tâm làm cả hai khó đọc và mất điểm.</div>
</div>`,
        },
        {
          title: 'Quiz 1 — Design fundamentals & UML|||Quiz 1 — Nền tảng thiết kế & UML',
          slug: 'swd392-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra coupling/cohesion, trừu tượng và quan hệ UML.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Good design aims for coupling that is… and cohesion that is…|||Thiết kế tốt nhắm coupling… và cohesion…', options: ['high; low|||cao; thấp', 'low; high|||thấp; cao', 'high; high|||cao; cao', 'low; low|||thấp; thấp'], correctIndex: 1, points: 1 },
              { question: 'Depending on an interface instead of a concrete class mainly reduces…|||Phụ thuộc một interface thay vì lớp cụ thể chủ yếu giảm…', options: ['cohesion', 'coupling', 'the number of classes|||số lớp', 'performance|||hiệu năng'], correctIndex: 1, points: 1 },
              { question: 'The class-diagram relationship where parts die with the whole is…|||Quan hệ class-diagram mà phần chết cùng tổng thể là…', options: ['association', 'aggregation', 'composition', 'inheritance'], correctIndex: 2, points: 1 },
              { question: 'Customer "1" -- "*" Order means…|||Customer "1" -- "*" Order nghĩa là…', options: ['one order has many customers|||một order có nhiều khách', 'one customer has many orders|||một khách có nhiều order', 'orders have no customer|||order không có khách', 'a one-to-one link|||liên kết một-một'], correctIndex: 1, points: 1 },
              { question: 'A class that does validation, database access and formatting all at once is a…|||Một lớp làm validation, truy cập database và định dạng cùng lúc là…', options: ['good abstraction|||trừu tượng tốt', 'god class (low cohesion)|||god class (cohesion thấp)', 'a design pattern|||một design pattern', 'an interface|||một interface'], correctIndex: 1, points: 1 },
              { question: 'To decide aggregation vs composition you ask whether… (beyond-syllabus)|||Để quyết aggregation vs composition bạn hỏi liệu… (ngoài giáo trình)', options: ['the classes look similar|||các lớp trông giống nhau', 'the part must be deleted when the whole is deleted|||phần có phải bị xoá khi tổng thể bị xoá', 'there are many classes|||có nhiều lớp', 'the names match|||tên khớp'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — REQUIREMENTS & ANALYSIS (COMET) ══════════════════ */
    {
      title: 'Chapter 2 — Requirements & analysis modeling (COMET)|||Chương 2 — Mô hình yêu cầu & phân tích (COMET)',
      description: 'Use case modeling, và analysis model của COMET: lớp/đối tượng và statechart cho hành vi.',
      lessons: [
        {
          title: '2.1 — Use case modeling & requirements|||2.1 — Mô hình use case & yêu cầu',
          slug: 'swd392-2-1-use-cases',
          type: 'VIDEO',
          description: 'Actor, use case, quan hệ include/extend, và viết mô tả use case (kịch bản chính + ngoại lệ).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Use case modeling (CLO2)</h2>
<p class="lead">The COMET method starts from requirements captured as <strong>use cases</strong>: an actor's goal-oriented interaction with the system. Use cases become the backbone the whole design traces back to.</p>
<h3>The pieces</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Actor</b><span>a role using the system (Customer, Admin, Payment Gateway)</span></div>
  <div class="lz-step"><b>Use case</b><span>a goal the actor achieves (Place Order)</span></div>
  <div class="lz-step"><b>Relationships</b><span>&lt;&lt;include&gt;&gt; (always), &lt;&lt;extend&gt;&gt; (optional)</span></div>
</div>
<h3>A use case description</h3>
<div class="out"><b>Use case: Place Order</b><br>
<b>Actor:</b> Customer &nbsp; <b>Precondition:</b> logged in, cart not empty<br>
<b>Main flow:</b> 1) Customer confirms cart → 2) System shows total → 3) Customer pays → 4) System creates order, sends confirmation<br>
<b>Alternative flow (3a):</b> payment fails → System shows error, order not created<br>
<em>The main flow + alternatives is exactly what the analysis and sequence diagrams will realise. Write it clearly and the rest of the design follows.</em></div>
<h3>Include vs extend</h3>
<p><code>&lt;&lt;include&gt;&gt;</code> is a mandatory sub-use-case reused by others (Place Order <em>includes</em> Validate Payment). <code>&lt;&lt;extend&gt;&gt;</code> adds optional behaviour under a condition (Place Order <em>extended by</em> Apply Coupon).</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write use cases at the "user goal" level, not too big or too small.</b> "Use the system" is too vague; "Click the pay button" is too small (a step, not a goal). The sweet spot is a goal a user would list as a reason to open the app ("Place an order", "Track a delivery"). Getting this altitude right — the "elementary business process" level — makes your whole model coherent, a judgment the include/extend mechanics do not teach.</div>
<div class="pitfall">Do not model UI steps ("enter email", "click button") as use cases — those are interaction details, not user goals. Overly fine use cases explode the diagram and hide the real requirements.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Mô hình use case (CLO2)</h2>
<p class="lead">Phương pháp COMET bắt đầu từ yêu cầu ghi lại dưới dạng <strong>use case</strong>: tương tác hướng-mục-tiêu của một actor với hệ thống. Use case trở thành xương sống mà cả thiết kế truy về.</p>
<h3>Các thành phần</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Actor</b><span>một vai dùng hệ (Customer, Admin, Payment Gateway)</span></div>
  <div class="lz-step"><b>Use case</b><span>một mục tiêu actor đạt được (Place Order)</span></div>
  <div class="lz-step"><b>Quan hệ</b><span>&lt;&lt;include&gt;&gt; (luôn), &lt;&lt;extend&gt;&gt; (tuỳ chọn)</span></div>
</div>
<h3>Một mô tả use case</h3>
<div class="out"><b>Use case: Place Order</b><br>
<b>Actor:</b> Customer &nbsp; <b>Tiền điều kiện:</b> đã đăng nhập, giỏ không rỗng<br>
<b>Luồng chính:</b> 1) Customer xác nhận giỏ → 2) Hệ hiện tổng → 3) Customer thanh toán → 4) Hệ tạo order, gửi xác nhận<br>
<b>Luồng thay thế (3a):</b> thanh toán thất bại → Hệ hiện lỗi, không tạo order<br>
<em>Luồng chính + thay thế chính là thứ analysis và sequence diagram sẽ hiện thực. Viết nó rõ ràng thì phần còn lại của thiết kế theo sau.</em></div>
<h3>Include vs extend</h3>
<p><code>&lt;&lt;include&gt;&gt;</code> là một sub-use-case bắt buộc được nhiều cái tái dùng (Place Order <em>include</em> Validate Payment). <code>&lt;&lt;extend&gt;&gt;</code> thêm hành vi tuỳ chọn dưới một điều kiện (Place Order <em>extend bởi</em> Apply Coupon).</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết use case ở mức "mục tiêu người dùng", không quá to hay quá nhỏ.</b> "Dùng hệ thống" quá mơ hồ; "Bấm nút thanh toán" quá nhỏ (một bước, không phải mục tiêu). Điểm ngọt là một mục tiêu người dùng sẽ liệt như lý do mở app ("Đặt một order", "Theo dõi giao hàng"). Chọn đúng độ cao này — mức "elementary business process" — làm cả mô hình mạch lạc, một phán đoán mà cơ chế include/extend không dạy.</div>
<div class="pitfall">Đừng mô hình các bước UI ("nhập email", "bấm nút") thành use case — đó là chi tiết tương tác, không phải mục tiêu người dùng. Use case quá mịn làm nổ sơ đồ và giấu yêu cầu thật.</div>
</div>`,
        },
        {
          title: '2.2 — Analysis model: classes & statecharts|||2.2 — Analysis model: lớp & statechart',
          slug: 'swd392-2-2-analysis-model',
          type: 'VIDEO',
          description: 'Phân loại đối tượng COMET (entity/boundary/control), tìm lớp từ use case, và statechart cho hành vi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>The analysis model (CLO3)</h2>
<p class="lead">COMET turns use cases into an <strong>analysis model</strong>: the classes the system needs and how stateful objects behave. It is structured object modeling before you decide the technology.</p>
<h3>COMET object categories</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Entity objects</b> — the data/domain (Order, Customer, Product) — often become tables.</div>
  <div class="lz-layer"><b>Boundary objects</b> — interface with actors (a screen, an API endpoint, a gateway).</div>
  <div class="lz-layer"><b>Control objects</b> — coordinate a use case (OrderController orchestrates Place Order).</div>
</div>
<p>This entity–boundary–control split keeps the domain (entities) independent of the UI (boundaries) and the workflow (controls) — naturally low coupling.</p>
<h3>Finding classes from a use case</h3>
<div class="out"><b>Worked example:</b> From "Place Order", the nouns suggest entities (Order, Cart, Payment, Customer); the actor interaction suggests a boundary (CheckoutScreen); the workflow suggests a control (PlaceOrderController). Verbs become methods (confirm, pay, createOrder).<br>
<em>Noun-and-verb analysis of the use case text is a fast first pass to a class list.</em></div>
<h3>Statecharts — modeling a lifecycle</h3>
<div class="out"><b>An Order's statechart:</b>
<pre>[*] --&gt; Pending
Pending --&gt; Paid : payment ok
Pending --&gt; Cancelled : timeout
Paid --&gt; Shipped : dispatch
Shipped --&gt; Delivered</pre>
<em>A statechart captures the allowed states and transitions of one object — invaluable for entities with a lifecycle (order, booking, ticket). It answers "can it go from X to Y?".</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Statecharts prevent illegal transitions in code.</b> A well-drawn statechart is not just documentation — it tells you exactly which transitions your code must reject (an order cannot go Delivered → Pending). Implementing the state machine from the chart (a status field with guarded transitions) turns a design artifact into a bug-prevention mechanism. This design-to-code link is where SWD392 meets the concurrency-safe state machines you saw in the K6 projects.</div>
<div class="pitfall">Do not confuse a statechart (states of ONE object) with an activity/sequence diagram (flow across objects). A statechart has states and events; if you are drawing steps between different objects, you want a different diagram.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Analysis model (CLO3)</h2>
<p class="lead">COMET biến use case thành một <strong>analysis model</strong>: các lớp hệ thống cần và cách các đối tượng có trạng thái hành xử. Đây là mô hình đối tượng có cấu trúc, trước khi bạn quyết công nghệ.</p>
<h3>Các loại đối tượng COMET</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Entity object</b> — dữ liệu/domain (Order, Customer, Product) — thường thành bảng.</div>
  <div class="lz-layer"><b>Boundary object</b> — giao tiếp với actor (một màn hình, một API endpoint, một gateway).</div>
  <div class="lz-layer"><b>Control object</b> — điều phối một use case (OrderController điều phối Place Order).</div>
</div>
<p>Chia entity–boundary–control giữ domain (entity) độc lập với UI (boundary) và workflow (control) — tự nhiên coupling thấp.</p>
<h3>Tìm lớp từ một use case</h3>
<div class="out"><b>Ví dụ có lời giải:</b> Từ "Place Order", các danh từ gợi entity (Order, Cart, Payment, Customer); tương tác actor gợi một boundary (CheckoutScreen); workflow gợi một control (PlaceOrderController). Động từ thành method (confirm, pay, createOrder).<br>
<em>Phân tích danh-từ-và-động-từ trên văn bản use case là một lượt đầu nhanh để có danh sách lớp.</em></div>
<h3>Statechart — mô hình một vòng đời</h3>
<div class="out"><b>Statechart của một Order:</b>
<pre>[*] --&gt; Pending
Pending --&gt; Paid : payment ok
Pending --&gt; Cancelled : timeout
Paid --&gt; Shipped : dispatch
Shipped --&gt; Delivered</pre>
<em>Một statechart nắm bắt các trạng thái và chuyển đổi hợp lệ của một đối tượng — vô giá cho entity có vòng đời (order, booking, ticket). Nó trả lời "nó có thể đi từ X sang Y không?".</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Statechart chặn chuyển đổi bất hợp lệ trong code.</b> Một statechart vẽ tốt không chỉ là tài liệu — nó nói chính xác chuyển đổi nào code phải từ chối (một order không thể đi Delivered → Pending). Hiện thực máy trạng thái từ sơ đồ (một field trạng thái với chuyển đổi có bảo vệ) biến một artifact thiết kế thành cơ chế chống bug. Mối nối thiết-kế-tới-code này là nơi SWD392 gặp các máy trạng thái an-toàn-tương-tranh bạn thấy ở các project K6.</div>
<div class="pitfall">Đừng nhầm statechart (trạng thái của MỘT đối tượng) với activity/sequence diagram (luồng qua nhiều đối tượng). Statechart có trạng thái và sự kiện; nếu bạn đang vẽ các bước giữa các đối tượng khác nhau, bạn muốn một sơ đồ khác.</div>
</div>`,
        },
        {
          title: 'Quiz 2 — Requirements & analysis|||Quiz 2 — Yêu cầu & phân tích',
          slug: 'swd392-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra use case, include/extend, và analysis model COMET.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A use case describes…|||Một use case mô tả…', options: ['a UI button|||một nút UI', 'an actor\'s goal-oriented interaction with the system|||tương tác hướng mục tiêu của actor với hệ', 'a database table|||một bảng database', 'a class method|||một method của lớp'], correctIndex: 1, points: 1 },
              { question: 'A mandatory sub-use-case reused by others is linked with…|||Một sub-use-case bắt buộc được nhiều cái tái dùng nối bằng…', options: ['<<extend>>', '<<include>>', 'inheritance', 'association'], correctIndex: 1, points: 1 },
              { question: 'In COMET, an object that holds domain data (like Order) is a… object.|||Trong COMET, một đối tượng giữ dữ liệu domain (như Order) là đối tượng…', options: ['boundary', 'control', 'entity', 'actor'], correctIndex: 2, points: 1 },
              { question: 'A statechart models…|||Một statechart mô hình…', options: ['the flow across many objects|||luồng qua nhiều đối tượng', 'the states and transitions of one object|||trạng thái và chuyển đổi của một đối tượng', 'the database schema|||schema database', 'the class hierarchy|||cây phân cấp lớp'], correctIndex: 1, points: 1 },
              { question: 'Which object type coordinates a use case in COMET?|||Loại đối tượng nào điều phối một use case trong COMET?', options: ['entity', 'boundary', 'control', 'actor'], correctIndex: 2, points: 1 },
              { question: 'A use case should be written at the level of… (beyond-syllabus)|||Một use case nên viết ở mức… (ngoài giáo trình)', options: ['a single UI click|||một cú bấm UI', 'a user goal (elementary business process)|||một mục tiêu người dùng (elementary business process)', 'the whole system|||cả hệ thống', 'one database query|||một truy vấn database'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — SOFTWARE ARCHITECTURE ══════════════════ */
    {
      title: 'Chapter 3 — Software architecture & quality attributes|||Chương 3 — Kiến trúc phần mềm & quality attributes',
      description: 'Các kiểu kiến trúc (layered/client-server/MVC/microservices/event-driven) và cân bằng quality attributes.',
      lessons: [
        {
          title: '3.1 — Architectural styles|||3.1 — Các kiểu kiến trúc',
          slug: 'swd392-3-1-architecture-styles',
          type: 'VIDEO',
          description: 'Layered, client-server, MVC, pipe-and-filter, event-driven, microservices — và khi nào chọn cái nào.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Architectural styles (CLO4)</h2>
<p class="lead">Architecture is the highest-level structure: the big components and how they interact. An <strong>architectural style</strong> is a proven template for that structure. Knowing the common ones lets you pick a starting point instead of inventing structure from scratch.</p>
<table>
  <thead><tr><th>Style</th><th>Idea</th><th>Fits</th></tr></thead>
  <tbody>
    <tr><td>Layered</td><td>Stacked layers (presentation → business → data), each uses the one below</td><td>Most business apps; easy to test/replace a layer</td></tr>
    <tr><td>Client-Server</td><td>Clients request, a server serves</td><td>Web/mobile apps talking to a backend</td></tr>
    <tr><td>MVC</td><td>Model, View, Controller separated</td><td>UIs and web frameworks</td></tr>
    <tr><td>Pipe-and-Filter</td><td>Data flows through processing stages</td><td>Data pipelines, compilers, ETL</td></tr>
    <tr><td>Event-Driven</td><td>Components react to events/messages</td><td>Realtime, loosely-coupled systems</td></tr>
    <tr><td>Microservices</td><td>Small independent services, each own data</td><td>Large systems needing independent scaling/teams</td></tr>
  </tbody>
</table>
<h3>Worked example — choosing a style</h3>
<div class="out"><b>System:</b> an e-commerce site, small team, one database, needs to swap the DB later.<br>
<b>Choice:</b> a <b>layered</b> architecture (presentation / business / data-access). <b>Why:</b> separating the data-access layer means the DB can be swapped by replacing one layer; the small team does not need the operational cost of microservices. <br>
<em>The justification — tie to the requirement (swap DB) and the constraint (small team) — is what earns the marks, not the diagram alone.</em></div>
<a class="link-card codelab" href="/code-lab/system-design?ref=%2Fcourses%2Fsoftware-architecture-and-design%2Flearn&reflabel=SWD392#module-1819" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: Real-World Architecture Patterns (Code Lab)</span><span class="lc-sub">Explore architecture patterns on the System Design track.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Microservices are a trade-off, not an upgrade.</b> They give independent scaling and deployment — at the cost of network calls, distributed data, and operational complexity. For a class project or a small team, a well-layered "modular monolith" is usually the <em>better</em> engineering choice. Knowing when NOT to use microservices is a more senior signal than knowing how to draw them — and the opposite of what hype suggests.</div>
<div class="pitfall">A style is a starting template, not a straitjacket. Real systems combine styles (a layered service inside a microservices system, MVC inside the presentation layer). Do not force one label onto the whole system.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Các kiểu kiến trúc (CLO4)</h2>
<p class="lead">Kiến trúc là cấu trúc mức cao nhất: các thành phần lớn và cách chúng tương tác. Một <strong>kiểu kiến trúc</strong> là một khuôn đã được kiểm chứng cho cấu trúc đó. Biết các kiểu phổ biến cho bạn chọn một điểm khởi đầu thay vì tự chế cấu trúc từ đầu.</p>
<table>
  <thead><tr><th>Kiểu</th><th>Ý tưởng</th><th>Hợp với</th></tr></thead>
  <tbody>
    <tr><td>Layered (phân lớp)</td><td>Các lớp xếp chồng (presentation → business → data), mỗi lớp dùng lớp dưới</td><td>Hầu hết app nghiệp vụ; dễ test/thay một lớp</td></tr>
    <tr><td>Client-Server</td><td>Client yêu cầu, server phục vụ</td><td>App web/mobile nói chuyện với backend</td></tr>
    <tr><td>MVC</td><td>Model, View, Controller tách rời</td><td>UI và web framework</td></tr>
    <tr><td>Pipe-and-Filter</td><td>Dữ liệu chảy qua các tầng xử lý</td><td>Pipeline dữ liệu, compiler, ETL</td></tr>
    <tr><td>Event-Driven</td><td>Thành phần phản ứng với sự kiện/message</td><td>Hệ realtime, coupling lỏng</td></tr>
    <tr><td>Microservices</td><td>Các service nhỏ độc lập, mỗi cái dữ liệu riêng</td><td>Hệ lớn cần mở rộng/đội độc lập</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải — chọn một kiểu</h3>
<div class="out"><b>Hệ:</b> một site thương mại điện tử, đội nhỏ, một database, cần đổi DB sau này.<br>
<b>Chọn:</b> một kiến trúc <b>layered</b> (presentation / business / data-access). <b>Vì:</b> tách tầng data-access nghĩa là DB có thể đổi bằng cách thay một lớp; đội nhỏ không cần chi phí vận hành của microservices.<br>
<em>Sự biện minh — gắn với yêu cầu (đổi DB) và ràng buộc (đội nhỏ) — là thứ được điểm, không phải sơ đồ đơn thuần.</em></div>
<a class="link-card codelab" href="/code-lab/system-design?ref=%2Fcourses%2Fsoftware-architecture-and-design%2Flearn&reflabel=SWD392#module-1819" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: Real-World Architecture Patterns (Code Lab)</span><span class="lc-sub">Khám phá pattern kiến trúc trên track System Design.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Microservices là một đánh đổi, không phải nâng cấp.</b> Chúng cho mở rộng và triển khai độc lập — với cái giá là lời gọi mạng, dữ liệu phân tán, và độ phức tạp vận hành. Cho một project lớp học hay đội nhỏ, một "modular monolith" phân lớp tốt thường là lựa chọn kỹ thuật <em>tốt hơn</em>. Biết khi nào KHÔNG dùng microservices là tín hiệu senior hơn biết cách vẽ chúng — và ngược với điều trend gợi ý.</div>
<div class="pitfall">Một kiểu là khuôn khởi đầu, không phải áo bó. Hệ thật kết hợp các kiểu (một service phân lớp bên trong một hệ microservices, MVC bên trong tầng presentation). Đừng ép một nhãn lên cả hệ.</div>
</div>`,
        },
        {
          title: '3.2 — Quality attributes & trade-offs|||3.2 — Quality attributes & đánh đổi',
          slug: 'swd392-3-2-quality-attributes',
          type: 'VIDEO',
          description: 'Các thuộc tính chất lượng (performance, scalability, security, maintainability…) và cách chúng xung đột.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Quality attributes (CLO4, Ch20)</h2>
<p class="lead">Two designs can both "work" yet differ hugely in quality. <strong>Quality attributes</strong> (a.k.a. non-functional requirements) are what architecture optimises for — and they often conflict, so you must choose.</p>
<table>
  <thead><tr><th>Attribute</th><th>Question it answers</th></tr></thead>
  <tbody>
    <tr><td>Performance</td><td>How fast does it respond?</td></tr>
    <tr><td>Scalability</td><td>Does it cope as load grows?</td></tr>
    <tr><td>Availability</td><td>How much uptime? (redundancy)</td></tr>
    <tr><td>Security</td><td>How well is data protected?</td></tr>
    <tr><td>Maintainability</td><td>How easily can it be changed?</td></tr>
    <tr><td>Usability</td><td>How easy for users?</td></tr>
  </tbody>
</table>
<h3>Trade-offs — you cannot maximise everything</h3>
<div class="out"><b>Worked example:</b> Adding heavy encryption improves <b>security</b> but hurts <b>performance</b>. Caching improves <b>performance</b> but can hurt <b>consistency</b> (stale data). Adding redundancy improves <b>availability</b> but raises <b>cost</b> and complexity. <br>
<em>Architecture is the art of choosing which quality wins where — and documenting why. "We prioritise security over raw speed because this is a banking system" is a design decision, not a compromise you hide.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Make quality attributes measurable (scenarios).</b> "Fast" is unarguable; "95% of requests return within 200ms under 1,000 concurrent users" is testable. Writing quality attributes as concrete <em>quality-attribute scenarios</em> (stimulus → environment → response → measure) turns vague goals into criteria you can design toward and defend. This ATAM-style rigor is what separates a professional architecture document from a wish list — and it deeply impresses graders.</div>
<div class="pitfall">Ignoring non-functional requirements is a top design failure. A system that has every feature but is unusably slow, or insecure, or impossible to change, has failed — even though it "works". Design for the qualities, not just the features.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Quality attributes (CLO4, Ch20)</h2>
<p class="lead">Hai thiết kế có thể đều "chạy" nhưng khác nhau lớn về chất lượng. <strong>Quality attributes</strong> (còn gọi yêu cầu phi chức năng) là thứ kiến trúc tối ưu cho — và chúng thường xung đột, nên bạn phải chọn.</p>
<table>
  <thead><tr><th>Thuộc tính</th><th>Câu hỏi nó trả lời</th></tr></thead>
  <tbody>
    <tr><td>Performance (hiệu năng)</td><td>Nó phản hồi nhanh thế nào?</td></tr>
    <tr><td>Scalability (khả mở)</td><td>Nó chịu được khi tải tăng không?</td></tr>
    <tr><td>Availability (khả dụng)</td><td>Uptime bao nhiêu? (dự phòng)</td></tr>
    <tr><td>Security (bảo mật)</td><td>Dữ liệu được bảo vệ tốt thế nào?</td></tr>
    <tr><td>Maintainability (khả bảo trì)</td><td>Nó dễ đổi thế nào?</td></tr>
    <tr><td>Usability (khả dụng người dùng)</td><td>Dễ cho người dùng thế nào?</td></tr>
  </tbody>
</table>
<h3>Đánh đổi — bạn không thể tối đa mọi thứ</h3>
<div class="out"><b>Ví dụ có lời giải:</b> Thêm mã hoá nặng cải thiện <b>bảo mật</b> nhưng hại <b>hiệu năng</b>. Cache cải thiện <b>hiệu năng</b> nhưng có thể hại <b>tính nhất quán</b> (dữ liệu cũ). Thêm dự phòng cải thiện <b>khả dụng</b> nhưng tăng <b>chi phí</b> và phức tạp.<br>
<em>Kiến trúc là nghệ thuật chọn phẩm chất nào thắng ở đâu — và ghi lại vì sao. "Chúng em ưu tiên bảo mật hơn tốc độ thô vì đây là hệ ngân hàng" là một quyết định thiết kế, không phải một sự thoả hiệp bạn giấu.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Làm quality attribute đo được (scenario).</b> "Nhanh" không tranh cãi được; "95% request trả trong 200ms dưới 1.000 người dùng đồng thời" thì test được. Viết quality attribute thành <em>quality-attribute scenario</em> cụ thể (kích thích → môi trường → phản hồi → đo) biến mục tiêu mơ hồ thành tiêu chí bạn thiết kế hướng tới và bảo vệ được. Sự chặt chẽ kiểu ATAM này tách một tài liệu kiến trúc chuyên nghiệp khỏi một danh sách ước — và gây ấn tượng sâu với giám khảo.</div>
<div class="pitfall">Bỏ qua yêu cầu phi chức năng là một thất bại thiết kế hàng đầu. Một hệ có đủ mọi tính năng nhưng chậm không dùng được, hoặc không an toàn, hoặc không thể đổi, là đã thất bại — dù nó "chạy". Thiết kế cho các phẩm chất, không chỉ tính năng.</div>
</div>`,
        },
        {
          title: 'Quiz 3 — Architecture & quality|||Quiz 3 — Kiến trúc & chất lượng',
          slug: 'swd392-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra kiểu kiến trúc, quality attributes và đánh đổi.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A layered architecture is often chosen because it…|||Kiến trúc phân lớp thường được chọn vì nó…', options: ['is the fastest possible|||nhanh nhất có thể', 'lets you replace/test one layer (e.g., swap the DB)|||cho thay/test một lớp (vd đổi DB)', 'needs no database|||không cần database', 'removes all coupling|||bỏ mọi coupling'], correctIndex: 1, points: 1 },
              { question: 'Microservices mainly trade simplicity for…|||Microservices chủ yếu đánh đổi sự đơn giản lấy…', options: ['nothing|||không gì', 'independent scaling/deployment (at operational cost)|||mở rộng/triển khai độc lập (với chi phí vận hành)', 'fewer servers|||ít server hơn', 'no network calls|||không lời gọi mạng'], correctIndex: 1, points: 1 },
              { question: 'Quality attributes are also known as…|||Quality attributes còn gọi là…', options: ['functional requirements|||yêu cầu chức năng', 'non-functional requirements|||yêu cầu phi chức năng', 'use cases|||use case', 'design patterns|||design pattern'], correctIndex: 1, points: 1 },
              { question: 'Adding heavy encryption typically improves security but hurts…|||Thêm mã hoá nặng thường cải thiện bảo mật nhưng hại…', options: ['maintainability|||khả bảo trì', 'performance|||hiệu năng', 'security|||bảo mật', 'usability|||khả dụng người dùng'], correctIndex: 1, points: 1 },
              { question: 'A system with all features but that is unusably slow has…|||Một hệ đủ tính năng nhưng chậm không dùng được là…', options: ['succeeded|||thành công', 'failed on a quality attribute|||thất bại ở một quality attribute', 'good architecture|||kiến trúc tốt', 'high cohesion|||cohesion cao'], correctIndex: 1, points: 1 },
              { question: 'A good quality-attribute requirement is written as a measurable scenario, e.g.… (beyond-syllabus)|||Một yêu cầu quality-attribute tốt viết dưới dạng scenario đo được, vd… (ngoài giáo trình)', options: ['"the system is fast"|||"hệ thống nhanh"', '"95% of requests return within 200ms under 1000 users"|||"95% request trả trong 200ms dưới 1000 người dùng"', '"it should be good"|||"nó nên tốt"', '"users like it"|||"người dùng thích"'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — DESIGN PATTERNS (GoF) ══════════════════ */
    {
      title: 'Chapter 4 — Design patterns (GoF)|||Chương 4 — Design patterns (GoF)',
      description: 'Design pattern là gì, cách tài liệu hoá, và các pattern creational/structural/behavioral tiêu biểu.',
      lessons: [
        {
          title: '4.1 — What is a pattern? Creational patterns|||4.1 — Pattern là gì? Nhóm creational',
          slug: 'swd392-4-1-creational',
          type: 'VIDEO',
          description: 'Cấu trúc và cách tài liệu hoá một pattern; Factory, Singleton, Builder với code.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Design patterns: reusable solutions (CLO6)</h2>
<p class="lead">A <strong>design pattern</strong> is a named, proven solution to a recurring design problem. It is not code you copy — it is a structure you adapt. The GoF book documents 23; you must be able to explain a pattern's structure and when to use it.</p>
<h3>How a pattern is documented</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Name</b><span>a shared vocabulary (Observer, Factory)</span></div>
  <div class="lz-step"><b>Problem / Intent</b><span>what recurring problem it solves</span></div>
  <div class="lz-step"><b>Structure</b><span>the participating classes &amp; relationships (a UML diagram)</span></div>
  <div class="lz-step"><b>Consequences</b><span>trade-offs of using it</span></div>
</div>
<h3>Creational patterns — how objects are made</h3>
<table>
  <thead><tr><th>Pattern</th><th>Solves</th></tr></thead>
  <tbody>
    <tr><td>Factory Method</td><td>Create objects without hard-coding the concrete class</td></tr>
    <tr><td>Singleton</td><td>Ensure exactly one instance (a config, a connection pool)</td></tr>
    <tr><td>Builder</td><td>Construct a complex object step by step</td></tr>
  </tbody>
</table>
<h3>Worked example — Factory Method</h3>
<div class="out"><pre><span class="tok-comment">// instead of: new PdfReport() scattered everywhere</span>
<span class="tok-keyword">interface</span> Report { <span class="tok-keyword">void</span> <span class="tok-function">render</span>(); }

<span class="tok-keyword">abstract class</span> ReportFactory {
  <span class="tok-keyword">abstract</span> Report <span class="tok-function">create</span>();       <span class="tok-comment">// the factory method</span>
}
<span class="tok-keyword">class</span> PdfFactory <span class="tok-keyword">extends</span> ReportFactory {
  Report <span class="tok-function">create</span>() { <span class="tok-keyword">return</span> <span class="tok-keyword">new</span> <span class="tok-function">PdfReport</span>(); }
}</pre>
<em>Client code calls <code>factory.create()</code> and depends only on the <code>Report</code> interface — adding an ExcelReport means a new factory, no change to client code. That is loose coupling via a pattern.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Singleton is the most overused pattern — often an anti-pattern.</b> A global single instance is really a global variable in disguise: it hides dependencies, makes testing hard (you cannot substitute a fake), and creates hidden coupling. Modern designs prefer dependency injection (pass the one instance in) over Singleton. Knowing <em>why</em> a famous pattern is often a bad idea is a more advanced insight than knowing how to write it.</div>
<div class="pitfall">Do not apply a pattern just because you learned it. A pattern used where its problem does not exist adds complexity for nothing. First identify the recurring problem, then reach for the pattern that fits it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Design pattern: giải pháp tái dùng (CLO6)</h2>
<p class="lead">Một <strong>design pattern</strong> là một giải pháp có tên, đã kiểm chứng cho một vấn đề thiết kế lặp lại. Nó không phải code bạn chép — mà là một cấu trúc bạn thích ứng. Sách GoF tài liệu hoá 23 cái; bạn phải giải thích được cấu trúc một pattern và khi nào dùng.</p>
<h3>Một pattern được tài liệu hoá thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Name (tên)</b><span>một vốn từ chung (Observer, Factory)</span></div>
  <div class="lz-step"><b>Problem / Intent</b><span>vấn đề lặp lại nó giải quyết</span></div>
  <div class="lz-step"><b>Structure (cấu trúc)</b><span>các lớp tham gia &amp; quan hệ (một sơ đồ UML)</span></div>
  <div class="lz-step"><b>Consequences</b><span>đánh đổi khi dùng nó</span></div>
</div>
<h3>Creational pattern — cách đối tượng được tạo</h3>
<table>
  <thead><tr><th>Pattern</th><th>Giải quyết</th></tr></thead>
  <tbody>
    <tr><td>Factory Method</td><td>Tạo đối tượng mà không hard-code lớp cụ thể</td></tr>
    <tr><td>Singleton</td><td>Đảm bảo đúng một instance (một config, một connection pool)</td></tr>
    <tr><td>Builder</td><td>Dựng một đối tượng phức tạp từng bước</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải — Factory Method</h3>
<div class="out"><pre><span class="tok-comment">// thay vi: new PdfReport() rai rac khap noi</span>
<span class="tok-keyword">interface</span> Report { <span class="tok-keyword">void</span> <span class="tok-function">render</span>(); }

<span class="tok-keyword">abstract class</span> ReportFactory {
  <span class="tok-keyword">abstract</span> Report <span class="tok-function">create</span>();       <span class="tok-comment">// factory method</span>
}
<span class="tok-keyword">class</span> PdfFactory <span class="tok-keyword">extends</span> ReportFactory {
  Report <span class="tok-function">create</span>() { <span class="tok-keyword">return</span> <span class="tok-keyword">new</span> <span class="tok-function">PdfReport</span>(); }
}</pre>
<em>Code client gọi <code>factory.create()</code> và chỉ phụ thuộc interface <code>Report</code> — thêm một ExcelReport nghĩa là một factory mới, không đổi code client. Đó là coupling lỏng qua một pattern.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Singleton là pattern bị lạm dụng nhất — thường là anti-pattern.</b> Một instance đơn toàn cục thực ra là một biến toàn cục trá hình: nó giấu phụ thuộc, làm test khó (không thể thay bằng một fake), và tạo coupling ẩn. Thiết kế hiện đại ưa dependency injection (truyền instance đó vào) hơn Singleton. Biết <em>vì sao</em> một pattern nổi tiếng thường là ý tồi là một insight nâng cao hơn biết cách viết nó.</div>
<div class="pitfall">Đừng áp một pattern chỉ vì bạn đã học nó. Một pattern dùng nơi vấn đề của nó không tồn tại thêm phức tạp vô ích. Trước hết nhận diện vấn đề lặp lại, rồi mới với tới pattern vừa nó.</div>
</div>`,
        },
        {
          title: '4.2 — Structural & behavioral patterns|||4.2 — Nhóm structural & behavioral',
          slug: 'swd392-4-2-structural-behavioral',
          type: 'VIDEO',
          description: 'Adapter, Decorator, Facade (structural) và Observer, Strategy, Template Method (behavioral).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Structural &amp; behavioral patterns (CLO6)</h2>
<p class="lead">Structural patterns organise classes into larger structures; behavioral patterns organise how objects communicate. Know a few of each and where they fit.</p>
<table>
  <thead><tr><th>Pattern</th><th>Category</th><th>Solves</th></tr></thead>
  <tbody>
    <tr><td>Adapter</td><td>Structural</td><td>Make an incompatible interface usable (wrap a legacy API)</td></tr>
    <tr><td>Decorator</td><td>Structural</td><td>Add behaviour without subclassing (add scrollbars to a window)</td></tr>
    <tr><td>Facade</td><td>Structural</td><td>A simple front over a complex subsystem</td></tr>
    <tr><td>Observer</td><td>Behavioral</td><td>Notify many objects when one changes (events, pub/sub)</td></tr>
    <tr><td>Strategy</td><td>Behavioral</td><td>Swap an algorithm at runtime (sort orders, payment methods)</td></tr>
    <tr><td>Template Method</td><td>Behavioral</td><td>Fix an algorithm skeleton, let subclasses fill steps</td></tr>
  </tbody>
</table>
<h3>Worked example — Strategy</h3>
<div class="out"><pre><span class="tok-keyword">interface</span> PaymentStrategy { <span class="tok-keyword">void</span> <span class="tok-function">pay</span>(<span class="tok-keyword">int</span> amount); }
<span class="tok-keyword">class</span> CardPayment <span class="tok-keyword">implements</span> PaymentStrategy { <span class="tok-keyword">public void</span> <span class="tok-function">pay</span>(<span class="tok-keyword">int</span> a){ <span class="tok-comment">/*…*/</span> } }
<span class="tok-keyword">class</span> WalletPayment <span class="tok-keyword">implements</span> PaymentStrategy { <span class="tok-keyword">public void</span> <span class="tok-function">pay</span>(<span class="tok-keyword">int</span> a){ <span class="tok-comment">/*…*/</span> } }

<span class="tok-comment">// the context picks a strategy at runtime</span>
checkout.<span class="tok-function">setStrategy</span>(<span class="tok-keyword">new</span> <span class="tok-function">WalletPayment</span>());
checkout.<span class="tok-function">pay</span>(<span class="tok-number">100</span>);</pre>
<em>Strategy replaces a big if/else over payment types with interchangeable classes — add a new payment method without touching existing code (open/closed).</em></div>
<h3>Observer — the pattern behind events</h3>
<p>When an Order changes, many things must react (email, inventory, analytics). Observer lets the Order notify a list of observers without knowing who they are — exactly how notification systems and UI event handlers work.</p>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-architecture-and-design%2Flearn&reflabel=SWD392#module-253" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: Java patterns &amp; interfaces (Code Lab)</span><span class="lc-sub">Implement Strategy, Observer and more on the Java Core track.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Patterns are trade-offs, and many map to a SOLID principle.</b> Strategy and Factory both serve the Open/Closed Principle (open to extension, closed to modification); Adapter serves the Dependency Inversion Principle. Seeing patterns as concrete tools that realise abstract principles — rather than 23 things to memorise — is how experienced designers reason. Naming the principle a pattern upholds is a strong answer at the exam and defense.</div>
<div class="pitfall">Overusing Decorator or nesting patterns can create a tangle harder to follow than the problem it solved. A pattern must make the design <em>clearer</em>; if it makes it more confusing, remove it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Structural &amp; behavioral pattern (CLO6)</h2>
<p class="lead">Structural pattern tổ chức các lớp thành cấu trúc lớn hơn; behavioral pattern tổ chức cách các đối tượng giao tiếp. Biết vài cái mỗi nhóm và nơi chúng vừa.</p>
<table>
  <thead><tr><th>Pattern</th><th>Nhóm</th><th>Giải quyết</th></tr></thead>
  <tbody>
    <tr><td>Adapter</td><td>Structural</td><td>Làm một interface không tương thích dùng được (bọc một API cũ)</td></tr>
    <tr><td>Decorator</td><td>Structural</td><td>Thêm hành vi không cần kế thừa (thêm scrollbar cho một window)</td></tr>
    <tr><td>Facade</td><td>Structural</td><td>Một mặt tiền đơn giản trên một subsystem phức tạp</td></tr>
    <tr><td>Observer</td><td>Behavioral</td><td>Báo cho nhiều đối tượng khi một cái đổi (event, pub/sub)</td></tr>
    <tr><td>Strategy</td><td>Behavioral</td><td>Đổi một thuật toán lúc chạy (kiểu sắp xếp, phương thức thanh toán)</td></tr>
    <tr><td>Template Method</td><td>Behavioral</td><td>Cố định bộ khung thuật toán, để lớp con điền các bước</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải — Strategy</h3>
<div class="out"><pre><span class="tok-keyword">interface</span> PaymentStrategy { <span class="tok-keyword">void</span> <span class="tok-function">pay</span>(<span class="tok-keyword">int</span> amount); }
<span class="tok-keyword">class</span> CardPayment <span class="tok-keyword">implements</span> PaymentStrategy { <span class="tok-keyword">public void</span> <span class="tok-function">pay</span>(<span class="tok-keyword">int</span> a){ <span class="tok-comment">/*…*/</span> } }
<span class="tok-keyword">class</span> WalletPayment <span class="tok-keyword">implements</span> PaymentStrategy { <span class="tok-keyword">public void</span> <span class="tok-function">pay</span>(<span class="tok-keyword">int</span> a){ <span class="tok-comment">/*…*/</span> } }

<span class="tok-comment">// context chon mot strategy luc chay</span>
checkout.<span class="tok-function">setStrategy</span>(<span class="tok-keyword">new</span> <span class="tok-function">WalletPayment</span>());
checkout.<span class="tok-function">pay</span>(<span class="tok-number">100</span>);</pre>
<em>Strategy thay một if/else lớn theo loại thanh toán bằng các lớp thay thế được — thêm một phương thức mới không đụng code cũ (open/closed).</em></div>
<h3>Observer — pattern đằng sau event</h3>
<p>Khi một Order đổi, nhiều thứ phải phản ứng (email, tồn kho, analytics). Observer cho Order báo một danh sách observer mà không biết chúng là ai — đúng cách hệ notification và event handler UI hoạt động.</p>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-architecture-and-design%2Flearn&reflabel=SWD392#module-253" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: Java pattern &amp; interface (Code Lab)</span><span class="lc-sub">Hiện thực Strategy, Observer và hơn nữa trên track Java Core.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Pattern là đánh đổi, và nhiều cái ánh xạ một nguyên tắc SOLID.</b> Strategy và Factory đều phục vụ Open/Closed Principle (mở để mở rộng, đóng để sửa); Adapter phục vụ Dependency Inversion Principle. Thấy pattern là công cụ cụ thể hiện thực các nguyên tắc trừu tượng — thay vì 23 thứ để học thuộc — là cách nhà thiết kế lão luyện tư duy. Gọi tên nguyên tắc một pattern gìn giữ là một câu trả lời mạnh ở thi và vấn đáp.</div>
<div class="pitfall">Lạm dụng Decorator hay lồng pattern có thể tạo một mớ rối khó theo hơn vấn đề nó giải. Một pattern phải làm thiết kế <em>rõ hơn</em>; nếu nó làm rối hơn, bỏ nó.</div>
</div>`,
        },
        {
          title: 'Quiz 4 — Design patterns|||Quiz 4 — Design patterns',
          slug: 'swd392-quiz-4',
          type: 'QUIZ',
          description: 'Kiểm tra tài liệu pattern, creational/structural/behavioral.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A design pattern is…|||Một design pattern là…', options: ['code you copy verbatim|||code bạn chép nguyên văn', 'a named, proven, adaptable solution to a recurring problem|||một giải pháp có tên, kiểm chứng, thích ứng được cho vấn đề lặp lại', 'a programming language|||một ngôn ngữ lập trình', 'a UML tool|||một công cụ UML'], correctIndex: 1, points: 1 },
              { question: 'Singleton ensures…|||Singleton đảm bảo…', options: ['many instances|||nhiều instance', 'exactly one instance of a class|||đúng một instance của một lớp', 'no instances|||không instance', 'faster code|||code nhanh hơn'], correctIndex: 1, points: 1 },
              { question: 'Swapping an algorithm at runtime (e.g., payment methods) is the… pattern.|||Đổi một thuật toán lúc chạy (vd phương thức thanh toán) là pattern…', options: ['Singleton', 'Strategy', 'Adapter', 'Facade'], correctIndex: 1, points: 1 },
              { question: 'Notifying many objects when one changes is the… pattern.|||Báo nhiều đối tượng khi một cái đổi là pattern…', options: ['Observer', 'Builder', 'Decorator', 'Factory'], correctIndex: 0, points: 1 },
              { question: 'Making an incompatible legacy interface usable is the… pattern.|||Làm một interface cũ không tương thích dùng được là pattern…', options: ['Adapter', 'Strategy', 'Observer', 'Singleton'], correctIndex: 0, points: 1 },
              { question: 'Strategy and Factory both help satisfy which SOLID principle? (beyond-syllabus)|||Strategy và Factory đều giúp thoả nguyên tắc SOLID nào? (ngoài giáo trình)', options: ['Single Responsibility', 'Open/Closed (open to extension, closed to modification)|||Open/Closed (mở mở rộng, đóng sửa)', 'no principle|||không nguyên tắc', 'Liskov only|||chỉ Liskov'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — DATABASE DESIGN & AI TOOLS ══════════════════ */
    {
      title: 'Chapter 5 — Relational database design & AI tools|||Chương 5 — Thiết kế CSDL quan hệ & công cụ AI',
      description: 'Chuyển analysis model thành thiết kế CSDL quan hệ, và dùng AI (ChatGPT/PlantUML/Copilot) hỗ trợ thiết kế.',
      lessons: [
        {
          title: '5.1 — Relational design from the model|||5.1 — Thiết kế quan hệ từ mô hình',
          slug: 'swd392-5-1-database-design',
          type: 'VIDEO',
          description: 'Ánh xạ lớp → bảng, quan hệ → khoá ngoại, và nhắc lại chuẩn hoá cho design model.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>From classes to tables (CLO5)</h2>
<p class="lead">The design model includes the database. There is a systematic mapping from your entity classes to relational tables — get it right and the schema follows the design, not the other way around.</p>
<h3>The mapping rules</h3>
<table>
  <thead><tr><th>Class model</th><th>Relational</th></tr></thead>
  <tbody>
    <tr><td>Entity class</td><td>Table</td></tr>
    <tr><td>Attribute</td><td>Column</td></tr>
    <tr><td>1-to-many association</td><td>Foreign key on the "many" side</td></tr>
    <tr><td>Many-to-many</td><td>A junction/associative table</td></tr>
    <tr><td>Inheritance</td><td>One table per hierarchy / per class / per concrete class</td></tr>
  </tbody>
</table>
<h3>Worked example — many-to-many</h3>
<div class="out"><b>Model:</b> a <code>Student</code> enrolls in many <code>Course</code>s; a Course has many Students.<br>
<b>Relational:</b> you cannot put a foreign key on either side. Create a junction table <code>Enrollment(student_id, course_id, enrolled_at)</code> with a composite key.<br>
<pre>Student(id PK, name)
Course(id PK, title)
Enrollment(student_id FK, course_id FK, enrolled_at,
           PRIMARY KEY(student_id, course_id))</pre>
<em>Every many-to-many becomes a junction table — a rule the exam tests directly.</em></div>
<h3>Normalization — a quick refresher</h3>
<p>Normalize to remove redundancy: 1NF (atomic values), 2NF (no partial dependency on part of a composite key), 3NF (no transitive dependency between non-key columns). This is the DBI202 material applied inside the design model.</p>
<a class="link-card codelab" href="/code-lab/system-design?ref=%2Fcourses%2Fsoftware-architecture-and-design%2Flearn&reflabel=SWD392#module-1811" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: System design fundamentals (Code Lab)</span><span class="lc-sub">Reinforce data &amp; component design on the System Design track.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Deliberate denormalization is a design decision, not a mistake.</b> Strict 3NF is the default, but real systems sometimes denormalize (store a computed total, duplicate a name) to hit a performance quality attribute — accepting redundancy for speed. The mature move is to normalize first, then denormalize <em>consciously</em> where a measured need justifies it, and document why. Knowing when to break the rule — and recording the trade-off — is the design maturity that pure normalization theory omits.</div>
<div class="pitfall">Do not design the database first and force the classes to match it. In COMET, the analysis model (classes) drives the schema. A DB-first design often produces anemic classes that are just data bags with no behaviour.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Từ lớp tới bảng (CLO5)</h2>
<p class="lead">Design model bao gồm cơ sở dữ liệu. Có một ánh xạ hệ thống từ các lớp entity của bạn tới bảng quan hệ — làm đúng thì schema theo thiết kế, không phải ngược lại.</p>
<h3>Các luật ánh xạ</h3>
<table>
  <thead><tr><th>Mô hình lớp</th><th>Quan hệ</th></tr></thead>
  <tbody>
    <tr><td>Lớp entity</td><td>Bảng</td></tr>
    <tr><td>Thuộc tính</td><td>Cột</td></tr>
    <tr><td>Quan hệ 1-nhiều</td><td>Khoá ngoại ở phía "nhiều"</td></tr>
    <tr><td>Nhiều-nhiều</td><td>Một bảng trung gian (junction)</td></tr>
    <tr><td>Kế thừa</td><td>Một bảng cho cả cây / mỗi lớp / mỗi lớp cụ thể</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải — nhiều-nhiều</h3>
<div class="out"><b>Mô hình:</b> một <code>Student</code> ghi danh nhiều <code>Course</code>; một Course có nhiều Student.<br>
<b>Quan hệ:</b> không thể đặt khoá ngoại ở bên nào. Tạo một bảng trung gian <code>Enrollment(student_id, course_id, enrolled_at)</code> với khoá phức.<br>
<pre>Student(id PK, name)
Course(id PK, title)
Enrollment(student_id FK, course_id FK, enrolled_at,
           PRIMARY KEY(student_id, course_id))</pre>
<em>Mọi nhiều-nhiều thành một bảng trung gian — một luật thi kiểm trực tiếp.</em></div>
<h3>Chuẩn hoá — nhắc nhanh</h3>
<p>Chuẩn hoá để bỏ dư thừa: 1NF (giá trị nguyên tử), 2NF (không phụ thuộc một phần vào một phần khoá phức), 3NF (không phụ thuộc bắc cầu giữa các cột không khoá). Đây là kiến thức DBI202 áp dụng bên trong design model.</p>
<a class="link-card codelab" href="/code-lab/system-design?ref=%2Fcourses%2Fsoftware-architecture-and-design%2Flearn&reflabel=SWD392#module-1811" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: System design fundamentals (Code Lab)</span><span class="lc-sub">Củng cố thiết kế dữ liệu &amp; thành phần trên track System Design.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Denormalize có chủ đích là một quyết định thiết kế, không phải lỗi.</b> 3NF chặt là mặc định, nhưng hệ thật đôi khi denormalize (lưu một tổng đã tính, nhân đôi một tên) để đạt một quality attribute hiệu năng — chấp nhận dư thừa lấy tốc độ. Nước đi chín là chuẩn hoá trước, rồi denormalize <em>có ý thức</em> nơi một nhu cầu đo được biện minh, và ghi lại vì sao. Biết khi nào phá luật — và ghi lại đánh đổi — là sự chín thiết kế mà lý thuyết chuẩn hoá thuần bỏ qua.</div>
<div class="pitfall">Đừng thiết kế database trước rồi ép các lớp khớp nó. Trong COMET, analysis model (lớp) dẫn schema. Thiết kế DB-first thường tạo các lớp thiếu máu chỉ là túi dữ liệu không hành vi.</div>
</div>`,
        },
        {
          title: '5.2 — AI tools for architecture & design|||5.2 — Công cụ AI cho kiến trúc & thiết kế',
          slug: 'swd392-5-2-ai-tools',
          type: 'VIDEO',
          description: 'Dùng ChatGPT sinh use case, PlantUML sinh sơ đồ, Copilot sinh boilerplate — và ranh giới trách nhiệm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2 · CLO7</span>
<h2>AI tools that accelerate design (CLO7)</h2>
<p class="lead">AI can draft the tedious parts of modeling — use case text, diagram code, boilerplate — so you spend your time on the decisions. Used well it is a force multiplier; used blindly it produces confident nonsense you must catch.</p>
<h3>Where AI genuinely helps</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>ChatGPT</b> — "draft use case descriptions from these requirements" then you refine actors, flows and edge cases.</div>
  <div class="lz-layer"><b>PlantUML (AI-generated)</b> — ask an AI to output PlantUML for a class/sequence diagram, then correct the relationships.</div>
  <div class="lz-layer"><b>GitHub Copilot</b> — generate boilerplate (entity classes, DAO stubs) from your design, which you review.</div>
</div>
<div class="out"><b>Worked example — AI to PlantUML:</b><br>
Prompt: "Generate PlantUML for a Library system: Book, Member, Loan; a Member has many Loans; a Loan references one Book."<br>
The AI returns PlantUML text; you paste it into a renderer and <b>check the multiplicities and relationship types</b> — AI often gets association vs composition wrong. You own the final diagram.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Use AI to generate alternatives, then choose — do not accept the first design.</b> Ask "give me three architectural options for this system with trade-offs". AI is excellent at breadth (surfacing options you did not consider); you supply the judgment (which fits the requirements and constraints). This "AI for options, human for the decision" division is the emerging professional norm — and it maps exactly to the design-justification skill the whole course rewards.</div>
<div class="pitfall">Never present an AI-generated design you cannot defend. At the project evaluation and Practical exam you must explain every class, relationship and decision. AI that "did it for you" collapses under one "why did you choose this?" — verify and internalise everything.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2 · CLO7</span>
<h2>Công cụ AI tăng tốc thiết kế (CLO7)</h2>
<p class="lead">AI có thể phác những phần nhọc của mô hình hoá — văn bản use case, code sơ đồ, boilerplate — để bạn dành thời gian cho các quyết định. Dùng tốt nó là bội số sức mạnh; dùng mù quáng nó tạo thứ vô nghĩa đầy tự tin bạn phải bắt.</p>
<h3>Nơi AI thật sự giúp</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>ChatGPT</b> — "phác mô tả use case từ các yêu cầu này" rồi bạn tinh chỉnh actor, luồng và ca biên.</div>
  <div class="lz-layer"><b>PlantUML (AI sinh)</b> — nhờ AI xuất PlantUML cho một class/sequence diagram, rồi bạn sửa các quan hệ.</div>
  <div class="lz-layer"><b>GitHub Copilot</b> — sinh boilerplate (lớp entity, stub DAO) từ thiết kế của bạn, mà bạn review.</div>
</div>
<div class="out"><b>Ví dụ có lời giải — AI ra PlantUML:</b><br>
Prompt: "Sinh PlantUML cho một hệ Library: Book, Member, Loan; một Member có nhiều Loan; một Loan tham chiếu một Book."<br>
AI trả về text PlantUML; bạn dán vào một renderer và <b>kiểm multiplicity và loại quan hệ</b> — AI thường sai association vs composition. Bạn sở hữu sơ đồ cuối.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dùng AI để sinh các phương án, rồi chọn — đừng nhận thiết kế đầu tiên.</b> Hỏi "cho tôi ba phương án kiến trúc cho hệ này kèm đánh đổi". AI xuất sắc về bề rộng (nêu các phương án bạn chưa nghĩ); bạn cung cấp phán đoán (cái nào vừa yêu cầu và ràng buộc). Phân công "AI cho phương án, người cho quyết định" này là chuẩn chuyên nghiệp đang nổi — và ánh xạ đúng kỹ năng biện-minh-thiết-kế mà cả môn thưởng.</div>
<div class="pitfall">Đừng bao giờ trình một thiết kế AI sinh mà bạn không bảo vệ được. Ở đánh giá project và Practical exam bạn phải giải thích mọi lớp, quan hệ và quyết định. AI "làm hộ bạn" sụp đổ dưới một câu "vì sao em chọn cái này?" — kiểm chứng và thấm mọi thứ.</div>
</div>`,
        },
        {
          title: 'Quiz 5 — Database design & AI|||Quiz 5 — Thiết kế CSDL & AI',
          slug: 'swd392-quiz-5',
          type: 'QUIZ',
          description: 'Kiểm tra ánh xạ lớp→bảng, chuẩn hoá, và dùng AI có trách nhiệm.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A many-to-many relationship maps to…|||Một quan hệ nhiều-nhiều ánh xạ tới…', options: ['a foreign key on one side|||khoá ngoại ở một bên', 'a junction/associative table|||một bảng trung gian', 'a single table|||một bảng đơn', 'no table|||không bảng'], correctIndex: 1, points: 1 },
              { question: 'A 1-to-many association is implemented with a foreign key on the…|||Một quan hệ 1-nhiều được hiện thực bằng khoá ngoại ở phía…', options: ['"one" side|||phía "một"', '"many" side|||phía "nhiều"', 'both sides|||cả hai', 'neither|||không bên nào'], correctIndex: 1, points: 1 },
              { question: 'In COMET, the schema should be driven by…|||Trong COMET, schema nên được dẫn bởi…', options: ['the database first|||database trước', 'the analysis model (classes)|||analysis model (các lớp)', 'the UI|||giao diện', 'the framework|||framework'], correctIndex: 1, points: 1 },
              { question: 'When an AI generates a class diagram, you must…|||Khi một AI sinh một class diagram, bạn phải…', options: ['use it as-is|||dùng nguyên xi', 'verify multiplicities and relationship types|||kiểm multiplicity và loại quan hệ', 'delete it|||xoá nó', 'never use AI|||không bao giờ dùng AI'], correctIndex: 1, points: 1 },
              { question: 'The best use of AI in design is to…|||Cách dùng AI tốt nhất trong thiết kế là…', options: ['make all decisions for you|||quyết mọi thứ hộ bạn', 'generate options and drafts you then judge and own|||sinh phương án và bản nháp bạn rồi phán đoán và sở hữu', 'replace the designer|||thay thế nhà thiết kế', 'skip the requirements|||bỏ qua yêu cầu'], correctIndex: 1, points: 1 },
              { question: 'Deliberately denormalizing a schema for performance is… (beyond-syllabus)|||Chủ đích denormalize một schema vì hiệu năng là… (ngoài giáo trình)', options: ['always a mistake|||luôn là lỗi', 'a conscious trade-off to document|||một đánh đổi có ý thức cần ghi lại', 'required by 3NF|||bắt buộc bởi 3NF', 'impossible|||bất khả'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — PROJECT, DEFENSE & EXAM PREP ══════════════════ */
    {
      title: 'Chapter 6 — Project, defense & exam prep|||Chương 6 — Project, vấn đáp & ôn thi',
      description: 'Checklist project thiết kế, ngân hàng câu hỏi vấn đáp + kịch bản thuyết trình, và ngân hàng câu hỏi Theory/Practical theo CLO.',
      lessons: [
        {
          title: '6.1 — Project checklist & defense question bank|||6.1 — Checklist project & ngân hàng câu hỏi vấn đáp',
          slug: 'swd392-6-1-defense',
          type: 'VIDEO',
          description: 'Danh sách kiểm bản thiết kế theo CLO, kịch bản thuyết trình, và ngân hàng câu hỏi bảo vệ có gợi ý trả lời.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>The project design &amp; its defense</h2>
<p class="lead">The Course Project (≥5 gate) is a design document defended in a final evaluation. It is judged on completeness, correctness, consistency, and — above all — justification. Use the checklist, prepare a presentation, and drill the question bank.</p>
<h3>Design-document checklist (map to CLOs)</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Use case model</div><div class="lz-nsub">actors · use cases · descriptions · include/extend (CLO2)</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Analysis model</div><div class="lz-nsub">class diagram (entity/boundary/control) · statechart for a lifecycle (CLO3)</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Architecture</div><div class="lz-nsub">chosen style · justified by quality attributes (CLO4)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Design patterns</div><div class="lz-nsub">≥1 pattern applied &amp; documented (structure + why) (CLO6)</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Database design</div><div class="lz-nsub">schema mapped from classes · normalized (CLO5)</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Consistency</div><div class="lz-nsub">all diagrams agree · one entity traceable end-to-end</div></div></div>
</div>
<h3>Defense question bank (with answer hints)</h3>
<ul>
  <li><b>Why this architectural style?</b> Tie it to a specific quality attribute/requirement.</li>
  <li><b>Where is coupling high, and could it be lower?</b> Show you thought about dependencies.</li>
  <li><b>Justify this design pattern — what problem does it solve here?</b> Name the recurring problem.</li>
  <li><b>Show me the lifecycle of X.</b> Point to the statechart; explain illegal transitions.</li>
  <li><b>Why is this aggregation not composition?</b> Use the lifecycle test.</li>
  <li><b>How does this class diagram match your database?</b> Trace one entity to its table.</li>
  <li><b>What quality did you prioritise and what did you sacrifice?</b> Name the trade-off.</li>
  <li><b>What would you change with more time?</b> A thoughtful limitation shows maturity.</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Lead your presentation with the decisions, not the diagrams.</b> Weak teams narrate "here is our class diagram, here is our sequence diagram". Strong teams frame it as decisions: "Our key challenge was X; we chose architecture Y because Z; here is the pattern that solves W." Presenting the <em>reasoning</em> first, with diagrams as evidence, is what a real design review looks like — and it directly earns the justification marks the rubric weights most heavily.</div>
<div class="pitfall">Inconsistency between diagrams is the fastest way to lose defense marks: if your class diagram has a Payment entity but your database has none, or your sequence diagram calls a method that is not on any class, examiners spot it immediately. Cross-check every diagram before submitting.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Bản thiết kế project &amp; buổi bảo vệ</h2>
<p class="lead">Course Project (cổng ≥5) là một tài liệu thiết kế được bảo vệ ở một đánh giá cuối. Nó được chấm theo tính đầy đủ, đúng đắn, nhất quán, và — trên hết — biện minh. Dùng checklist, chuẩn bị một bài thuyết trình, và luyện ngân hàng câu hỏi.</p>
<h3>Checklist tài liệu thiết kế (ánh xạ CLO)</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Use case model</div><div class="lz-nsub">actor · use case · mô tả · include/extend (CLO2)</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Analysis model</div><div class="lz-nsub">class diagram (entity/boundary/control) · statechart cho một vòng đời (CLO3)</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Kiến trúc</div><div class="lz-nsub">kiểu đã chọn · biện minh bằng quality attribute (CLO4)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Design pattern</div><div class="lz-nsub">≥1 pattern áp dụng &amp; tài liệu hoá (cấu trúc + vì sao) (CLO6)</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế CSDL</div><div class="lz-nsub">schema ánh xạ từ lớp · chuẩn hoá (CLO5)</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Nhất quán</div><div class="lz-nsub">mọi sơ đồ khớp nhau · truy một entity từ đầu tới cuối</div></div></div>
</div>
<h3>Ngân hàng câu hỏi vấn đáp (kèm gợi ý trả lời)</h3>
<ul>
  <li><b>Vì sao kiểu kiến trúc này?</b> Gắn nó với một quality attribute/yêu cầu cụ thể.</li>
  <li><b>Coupling cao ở đâu, và có thể thấp hơn không?</b> Cho thấy bạn đã nghĩ về phụ thuộc.</li>
  <li><b>Biện minh design pattern này — nó giải quyết vấn đề gì ở đây?</b> Gọi tên vấn đề lặp lại.</li>
  <li><b>Chỉ tôi vòng đời của X.</b> Chỉ vào statechart; giải thích chuyển đổi bất hợp lệ.</li>
  <li><b>Vì sao aggregation này không phải composition?</b> Dùng phép thử vòng đời.</li>
  <li><b>Class diagram này khớp database của bạn thế nào?</b> Truy một entity tới bảng của nó.</li>
  <li><b>Bạn ưu tiên phẩm chất nào và hy sinh gì?</b> Gọi tên đánh đổi.</li>
  <li><b>Bạn sẽ đổi gì nếu có thêm thời gian?</b> Một giới hạn chín chắn cho thấy sự trưởng thành.</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mở thuyết trình bằng các quyết định, không phải sơ đồ.</b> Nhóm yếu kể "đây là class diagram, đây là sequence diagram". Nhóm mạnh đóng khung nó thành quyết định: "Thách thức chính của chúng em là X; chúng em chọn kiến trúc Y vì Z; đây là pattern giải quyết W." Trình <em>lý lẽ</em> trước, với sơ đồ làm bằng chứng, là hình dạng của một design review thật — và trực tiếp được điểm biện minh mà rubric đánh trọng nhất.</div>
<div class="pitfall">Mâu thuẫn giữa các sơ đồ là cách nhanh nhất mất điểm vấn đáp: nếu class diagram có entity Payment mà database không có, hoặc sequence diagram gọi một method không có trên lớp nào, giám khảo thấy ngay. Đối chiếu chéo mọi sơ đồ trước khi nộp.</div>
</div>`,
        },
        {
          title: '6.2 — Exam prep: Theory, Practical & CLO question bank|||6.2 — Ôn thi: Theory, Practical & ngân hàng câu hỏi theo CLO',
          slug: 'swd392-6-2-exam-question-bank',
          type: 'VIDEO',
          description: 'Chiến lược Theory + Practical exam và ngân hàng câu hỏi ôn theo 7 CLO.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Preparing for both exams</h2>
<p class="lead">The Theory exam (40%, ≥4) tests concepts and reading diagrams; the Practical exam (20%, ≥4) tests producing them under time. Both gate your pass — prepare each.</p>
<h3>Strategy</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Theory (60 min)</b><span>drill definitions, notation, pattern intents, trade-offs</span></div>
  <div class="lz-step"><b>Practical (85 min)</b><span>practise drawing a class/statechart and applying a pattern from a scenario</span></div>
</div>
<h3>Question bank — practise by CLO</h3>
<p><b>CLO1-2 (fundamentals, UML, COMET):</b></p>
<ul>
  <li>Define coupling and cohesion; give a high-coupling example and fix it.</li>
  <li>Explain the difference between aggregation and composition with an example.</li>
  <li>List the COMET steps from requirements to design model.</li>
</ul>
<p><b>CLO3-4 (analysis &amp; architecture):</b></p>
<ul>
  <li>From a short scenario, draw a class diagram with correct multiplicities.</li>
  <li>Draw a statechart for an Order (or Booking) lifecycle.</li>
  <li>Choose an architectural style for a given system and justify it with a quality attribute.</li>
</ul>
<p><b>CLO5-6 (database &amp; patterns):</b></p>
<ul>
  <li>Map a class model (including a many-to-many) to relational tables.</li>
  <li>Identify which design pattern fits a scenario and explain its structure.</li>
  <li>Given code with a big if/else over types, refactor it with Strategy.</li>
</ul>
<p><b>CLO7 (AI):</b></p>
<ul>
  <li>Describe a responsible workflow for using AI to draft a use case or diagram.</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>On the Practical exam, annotate your diagrams with a one-line justification.</b> A class diagram alone earns the structure marks; a note like "Repository interface here to decouple the DB (maintainability)" earns the reasoning marks too — for almost no extra time. Examiners cannot read your mind; a short written justification beside a design decision converts silent competence into visible marks. This habit alone often lifts a Practical score by a band.</div>
<div class="pitfall">On the Theory exam, "reading a diagram" questions are easy marks you must not lose: a wrong multiplicity or misread arrow direction gives away points that need no design skill, just careful notation knowledge. Drill the notation until it is automatic.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Chuẩn bị cả hai bài thi</h2>
<p class="lead">Theory exam (40%, ≥4) kiểm khái niệm và đọc sơ đồ; Practical exam (20%, ≥4) kiểm tạo ra chúng có tính giờ. Cả hai là cổng đậu — chuẩn bị từng cái.</p>
<h3>Chiến lược</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Theory (60 phút)</b><span>luyện định nghĩa, ký hiệu, intent của pattern, đánh đổi</span></div>
  <div class="lz-step"><b>Practical (85 phút)</b><span>luyện vẽ class/statechart và áp một pattern từ một kịch bản</span></div>
</div>
<h3>Ngân hàng câu hỏi — luyện theo CLO</h3>
<p><b>CLO1-2 (nền tảng, UML, COMET):</b></p>
<ul>
  <li>Định nghĩa coupling và cohesion; cho một ví dụ coupling cao và sửa nó.</li>
  <li>Giải thích khác biệt aggregation và composition kèm ví dụ.</li>
  <li>Liệt kê các bước COMET từ yêu cầu tới design model.</li>
</ul>
<p><b>CLO3-4 (phân tích &amp; kiến trúc):</b></p>
<ul>
  <li>Từ một kịch bản ngắn, vẽ một class diagram với multiplicity đúng.</li>
  <li>Vẽ một statechart cho vòng đời một Order (hoặc Booking).</li>
  <li>Chọn một kiểu kiến trúc cho một hệ cho sẵn và biện minh bằng một quality attribute.</li>
</ul>
<p><b>CLO5-6 (database &amp; pattern):</b></p>
<ul>
  <li>Ánh xạ một mô hình lớp (gồm một nhiều-nhiều) sang bảng quan hệ.</li>
  <li>Nhận diện design pattern nào vừa một kịch bản và giải thích cấu trúc nó.</li>
  <li>Cho code có một if/else lớn theo loại, refactor nó bằng Strategy.</li>
</ul>
<p><b>CLO7 (AI):</b></p>
<ul>
  <li>Mô tả một quy trình có trách nhiệm để dùng AI phác một use case hay sơ đồ.</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ở Practical exam, chú thích sơ đồ bằng một dòng biện minh.</b> Một class diagram đơn được điểm cấu trúc; một ghi chú như "Repository interface ở đây để tách DB (maintainability)" được cả điểm lý lẽ — với gần như không thêm thời gian. Giám khảo không đọc được ý bạn; một biện minh viết ngắn bên cạnh một quyết định thiết kế biến năng lực thầm lặng thành điểm nhìn thấy được. Riêng thói quen này thường nâng điểm Practical lên một bậc.</div>
<div class="pitfall">Ở Theory exam, câu "đọc sơ đồ" là điểm dễ bạn không được mất: một multiplicity sai hay đọc nhầm chiều mũi tên cho đi điểm không cần kỹ năng thiết kế, chỉ cần kiến thức ký hiệu cẩn thận. Luyện ký hiệu đến khi tự động.</div>
</div>`,
        },
        {
          title: 'Quiz 6 — Project & exam readiness|||Quiz 6 — Project & sẵn sàng thi',
          slug: 'swd392-quiz-6',
          type: 'QUIZ',
          description: 'Kiểm tra chuẩn bị vấn đáp và chiến lược thi.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The Course Project is graded above all on…|||Course Project được chấm trên hết theo…', options: ['how many diagrams|||số sơ đồ', 'justification of design decisions|||biện minh các quyết định thiết kế', 'code line count|||số dòng code', 'colour of diagrams|||màu sơ đồ'], correctIndex: 1, points: 1 },
              { question: 'If your class diagram has a Payment entity but your DB schema has none, this is…|||Nếu class diagram có entity Payment mà schema DB không có, đây là…', options: ['fine|||ổn', 'an inconsistency that loses marks|||một mâu thuẫn làm mất điểm', 'required|||bắt buộc', 'good design|||thiết kế tốt'], correctIndex: 1, points: 1 },
              { question: 'When asked "why this architecture?" the best answer ties it to…|||Khi được hỏi "vì sao kiến trúc này?" câu trả lời tốt nhất gắn nó với…', options: ['personal taste|||sở thích cá nhân', 'a quality attribute / requirement|||một quality attribute / yêu cầu', 'the deadline|||hạn chót', 'what looks advanced|||cái trông nâng cao'], correctIndex: 1, points: 1 },
              { question: 'A strong design presentation leads with…|||Một thuyết trình thiết kế mạnh mở đầu bằng…', options: ['every diagram in order|||mọi sơ đồ theo thứ tự', 'the key decisions and their reasoning|||các quyết định chính và lý lẽ', 'the team names|||tên nhóm', 'the tools used|||công cụ dùng'], correctIndex: 1, points: 1 },
              { question: 'The Practical exam (≥4 gate) tests your ability to…|||Practical exam (cổng ≥4) kiểm khả năng…', options: ['recite definitions|||đọc vẹt định nghĩa', 'produce diagrams and apply patterns under time|||tạo sơ đồ và áp pattern có tính giờ', 'write essays|||viết luận', 'attend class|||dự lớp'], correctIndex: 1, points: 1 },
              { question: 'On the Practical exam, a quick way to earn reasoning marks is to… (beyond-syllabus)|||Ở Practical exam, một cách nhanh được điểm lý lẽ là… (ngoài giáo trình)', options: ['draw more classes|||vẽ thêm lớp', 'annotate each design decision with a one-line justification|||chú thích mỗi quyết định thiết kế bằng một dòng biện minh', 'use more colour|||dùng nhiều màu', 'write faster|||viết nhanh hơn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 (NÂNG CAO ★) — SOLID & MODERN ARCHITECTURE ══════════════════ */
    {
      title: 'Chapter 7 (Advanced) — SOLID, anti-patterns & modern architecture|||Chương 7 (Nâng cao) — SOLID, anti-pattern & kiến trúc hiện đại',
      description: 'Ngoài giáo trình: nguyên tắc SOLID, các anti-pattern thường gặp, và kiến trúc hiện đại (clean architecture, DDD, microservices).',
      lessons: [
        {
          title: '7.1 — SOLID principles & anti-patterns|||7.1 — Nguyên tắc SOLID & anti-pattern',
          slug: 'swd392-7-1-solid',
          type: 'VIDEO',
          description: 'Năm nguyên tắc SOLID với ví dụ, và các anti-pattern (god class, spaghetti, golden hammer) cần tránh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1 · ★ Beyond the syllabus</span>
<h2>SOLID — five principles of good OO design</h2>
<p class="lead">SOLID is the modern distillation of what makes object-oriented design maintainable. Each principle attacks a specific way designs rot.</p>
<table>
  <thead><tr><th>Principle</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><b>S</b> — Single Responsibility</td><td>A class should have one reason to change (high cohesion)</td></tr>
    <tr><td><b>O</b> — Open/Closed</td><td>Open to extension, closed to modification (add, don't edit)</td></tr>
    <tr><td><b>L</b> — Liskov Substitution</td><td>A subclass must be usable wherever its parent is</td></tr>
    <tr><td><b>I</b> — Interface Segregation</td><td>Many small interfaces beat one fat interface</td></tr>
    <tr><td><b>D</b> — Dependency Inversion</td><td>Depend on abstractions, not concretions</td></tr>
  </tbody>
</table>
<div class="out"><b>Worked example — Dependency Inversion:</b> The earlier <code>OrderService</code> depending on a <code>Repository</code> interface (not <code>MySQLConnection</code>) IS the D in SOLID. Notice how it connects to Chapter 1's coupling and Chapter 4's patterns — SOLID is the through-line uniting the whole course.</div>
<h3>Anti-patterns — named bad solutions</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>God class / Blob</b> — one class does everything (violates SRP).</div>
  <div class="lz-layer"><b>Spaghetti code</b> — no structure, tangled control flow.</div>
  <div class="lz-layer"><b>Golden hammer</b> — using one favourite tool/pattern for every problem.</div>
  <div class="lz-layer"><b>Premature optimization</b> — complicating design for speed you have not measured a need for.</div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>SOLID unifies everything you learned.</b> Coupling/cohesion (Ch1), patterns (Ch4), architecture (Ch3) are all instances of applying SOLID. When a design "feels wrong", name the SOLID principle it breaks — that turns vague discomfort into a precise, fixable diagnosis. Being able to say "this violates the Single Responsibility Principle" instead of "this class is messy" is exactly the senior-level articulation the project defense rewards.</div>
<div class="pitfall">SOLID is a guide, not dogma. Rigidly applying every principle to a tiny system creates needless indirection (an interface for a class with one implementation that will never change). Apply the principles where the design will actually grow or vary.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1 · ★ Ngoài giáo trình</span>
<h2>SOLID — năm nguyên tắc thiết kế OO tốt</h2>
<p class="lead">SOLID là bản chưng cất hiện đại của điều làm thiết kế hướng đối tượng dễ bảo trì. Mỗi nguyên tắc đánh vào một cách cụ thể mà thiết kế mục ruỗng.</p>
<table>
  <thead><tr><th>Nguyên tắc</th><th>Nghĩa</th></tr></thead>
  <tbody>
    <tr><td><b>S</b> — Single Responsibility</td><td>Một lớp nên có một lý do để đổi (cohesion cao)</td></tr>
    <tr><td><b>O</b> — Open/Closed</td><td>Mở để mở rộng, đóng để sửa (thêm, đừng sửa)</td></tr>
    <tr><td><b>L</b> — Liskov Substitution</td><td>Một lớp con phải dùng được ở mọi nơi lớp cha dùng được</td></tr>
    <tr><td><b>I</b> — Interface Segregation</td><td>Nhiều interface nhỏ hơn một interface béo</td></tr>
    <tr><td><b>D</b> — Dependency Inversion</td><td>Phụ thuộc trừu tượng, không phải cụ thể</td></tr>
  </tbody>
</table>
<div class="out"><b>Ví dụ có lời giải — Dependency Inversion:</b> Cái <code>OrderService</code> trước phụ thuộc một interface <code>Repository</code> (không phải <code>MySQLConnection</code>) CHÍNH LÀ chữ D trong SOLID. Để ý nó nối với coupling ở Chương 1 và pattern ở Chương 4 — SOLID là sợi chỉ xuyên suốt nối cả môn học.</div>
<h3>Anti-pattern — các giải pháp tồi có tên</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>God class / Blob</b> — một lớp làm mọi thứ (vi phạm SRP).</div>
  <div class="lz-layer"><b>Spaghetti code</b> — không cấu trúc, luồng điều khiển rối.</div>
  <div class="lz-layer"><b>Golden hammer</b> — dùng một công cụ/pattern yêu thích cho mọi vấn đề.</div>
  <div class="lz-layer"><b>Premature optimization</b> — làm phức tạp thiết kế vì tốc độ bạn chưa đo được nhu cầu.</div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>SOLID hợp nhất mọi thứ bạn đã học.</b> Coupling/cohesion (Ch1), pattern (Ch4), kiến trúc (Ch3) đều là các trường hợp áp dụng SOLID. Khi một thiết kế "thấy sai", gọi tên nguyên tắc SOLID nó phá — điều đó biến sự khó chịu mơ hồ thành một chẩn đoán chính xác, sửa được. Nói được "cái này vi phạm Single Responsibility Principle" thay vì "lớp này lộn xộn" chính là cách diễn đạt cấp senior mà buổi bảo vệ project thưởng.</div>
<div class="pitfall">SOLID là kim chỉ nam, không phải giáo điều. Áp cứng nhắc mọi nguyên tắc vào một hệ bé tạo indirection vô ích (một interface cho một lớp có một cài đặt sẽ không bao giờ đổi). Áp các nguyên tắc nơi thiết kế thực sự sẽ lớn hoặc thay đổi.</div>
</div>`,
        },
        {
          title: '7.2 — Modern architecture: clean architecture, DDD & microservices|||7.2 — Kiến trúc hiện đại: clean architecture, DDD & microservices',
          slug: 'swd392-7-2-modern-arch',
          type: 'VIDEO',
          description: 'Clean/hexagonal architecture, Domain-Driven Design, và microservices — khi nào phù hợp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2 · ★ Beyond the syllabus</span>
<h2>Where architecture is heading</h2>
<p class="lead">The classic styles (Ch3) evolved into modern approaches that push loose coupling further. Knowing these positions you ahead of the syllabus and connects to real industry practice.</p>
<h3>Clean / hexagonal architecture</h3>
<p>Put the <strong>domain at the centre</strong>, independent of frameworks, UI and database. Outer layers (web, DB) depend inward on the domain via interfaces (Dependency Inversion at architecture scale). The result: you can swap the database or UI without touching business rules.</p>
<h3>Domain-Driven Design (DDD)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Ubiquitous language</b> — code and conversation use the same domain terms.</div>
  <div class="lz-layer"><b>Bounded contexts</b> — split a large domain into independent models with clear boundaries.</div>
  <div class="lz-layer"><b>Aggregates</b> — cluster entities under a root that guards invariants (an Order and its OrderItems).</div>
</div>
<h3>Microservices &amp; the monolith-first rule</h3>
<p>Microservices suit large systems with independent teams and scaling needs. But the pragmatic rule is <strong>monolith-first</strong>: start with a well-structured modular monolith, and extract services only when a real need (independent scaling, team autonomy) appears.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Conway's Law: your architecture mirrors your org.</b> "Organizations design systems that copy their communication structure." A system built by three siloed teams tends to have three loosely-connected components. This means architecture is partly a <em>people</em> decision — and that reorganising teams can be a tool to fix an architecture. This socio-technical insight is invisible in a purely technical syllabus but shapes every large real system.</div>
<div class="pitfall">Adopting DDD or microservices on a small student project is textbook golden-hammer over-engineering. These approaches pay off at scale and cost complexity below it. Cite them to show awareness; apply them only if your project's size genuinely warrants it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2 · ★ Ngoài giáo trình</span>
<h2>Kiến trúc đang đi về đâu</h2>
<p class="lead">Các kiểu cổ điển (Ch3) tiến hoá thành các cách hiện đại đẩy coupling lỏng xa hơn. Biết những cái này đặt bạn trước giáo trình và nối với thực hành ngành thật.</p>
<h3>Clean / hexagonal architecture</h3>
<p>Đặt <strong>domain ở trung tâm</strong>, độc lập với framework, UI và database. Các lớp ngoài (web, DB) phụ thuộc vào trong tới domain qua interface (Dependency Inversion ở quy mô kiến trúc). Kết quả: bạn có thể đổi database hay UI mà không đụng luật nghiệp vụ.</p>
<h3>Domain-Driven Design (DDD)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Ubiquitous language</b> — code và hội thoại dùng cùng các thuật ngữ domain.</div>
  <div class="lz-layer"><b>Bounded context</b> — chia một domain lớn thành các mô hình độc lập có ranh giới rõ.</div>
  <div class="lz-layer"><b>Aggregate</b> — gom các entity dưới một root gìn giữ bất biến (một Order và các OrderItem).</div>
</div>
<h3>Microservices &amp; luật monolith-first</h3>
<p>Microservices hợp hệ lớn với đội độc lập và nhu cầu mở rộng. Nhưng luật thực dụng là <strong>monolith-first</strong>: bắt đầu với một monolith mô-đun có cấu trúc tốt, và tách service chỉ khi một nhu cầu thật (mở rộng độc lập, tự chủ đội) xuất hiện.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Định luật Conway: kiến trúc phản chiếu tổ chức của bạn.</b> "Các tổ chức thiết kế hệ thống sao chép cấu trúc giao tiếp của họ." Một hệ do ba đội tách biệt xây thường có ba thành phần nối lỏng. Điều này nghĩa là kiến trúc một phần là quyết định <em>con người</em> — và tổ chức lại đội có thể là công cụ sửa một kiến trúc. Insight socio-technical này vô hình trong một giáo trình thuần kỹ thuật nhưng định hình mọi hệ lớn thật.</div>
<div class="pitfall">Áp DDD hay microservices vào một project sinh viên nhỏ là over-engineer kiểu golden-hammer sách giáo khoa. Các cách này sinh lợi ở quy mô lớn và tốn phức tạp dưới nó. Trích chúng để cho thấy nhận thức; áp chúng chỉ khi quy mô project thực sự đáng.</div>
</div>`,
        },
        {
          title: 'Quiz 7 — SOLID & modern architecture|||Quiz 7 — SOLID & kiến trúc hiện đại',
          slug: 'swd392-quiz-7',
          type: 'QUIZ',
          description: 'Kiểm tra SOLID, anti-pattern, và kiến trúc hiện đại.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The "S" in SOLID means a class should have…|||Chữ "S" trong SOLID nghĩa một lớp nên có…', options: ['many responsibilities|||nhiều trách nhiệm', 'one reason to change|||một lý do để đổi', 'no methods|||không method', 'static fields|||field tĩnh'], correctIndex: 1, points: 1 },
              { question: 'Depending on abstractions rather than concrete classes is the… principle.|||Phụ thuộc trừu tượng thay vì lớp cụ thể là nguyên tắc…', options: ['Single Responsibility', 'Open/Closed', 'Dependency Inversion', 'Liskov'], correctIndex: 2, points: 1 },
              { question: 'A class that does everything (validation, DB, formatting) is the… anti-pattern.|||Một lớp làm mọi thứ (validation, DB, định dạng) là anti-pattern…', options: ['golden hammer', 'god class / blob', 'spaghetti', 'singleton'], correctIndex: 1, points: 1 },
              { question: 'Clean/hexagonal architecture puts… at the centre.|||Clean/hexagonal architecture đặt… ở trung tâm.', options: ['the database|||database', 'the domain, independent of frameworks|||domain, độc lập framework', 'the UI|||giao diện', 'the network|||mạng'], correctIndex: 1, points: 1 },
              { question: 'The pragmatic rule about microservices is…|||Luật thực dụng về microservices là…', options: ['always use them|||luôn dùng chúng', 'monolith-first, extract services only when a real need appears|||monolith-first, tách service chỉ khi có nhu cầu thật', 'never use a database|||không bao giờ dùng database', 'they are only for small apps|||chỉ cho app nhỏ'], correctIndex: 1, points: 1 },
              { question: 'Conway\'s Law says a system\'s structure tends to mirror… (beyond-syllabus)|||Định luật Conway nói cấu trúc hệ thống có xu hướng phản chiếu… (ngoài giáo trình)', options: ['the programming language|||ngôn ngữ lập trình', 'the organization\'s communication structure|||cấu trúc giao tiếp của tổ chức', 'the database engine|||engine database', 'the deadline|||hạn chót'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ gồm PE (thi thực hành) và FE (trắc nghiệm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "PE — Practical Exam|||PE — Thi thực hành",
          "slug": "swd392-final-exam-pe",
          "type": "article",
          "description": "Khung thi thực hành (PE) của môn — format, cách chấm và cách chuẩn bị. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · PE</span>\n<h2>PE — Practical Exam</h2>\n<p class=\"lead\">The Practical Exam (PE) is a <strong>hands-on coding exam</strong>: you are given a problem or feature and must write (and usually run) working code on the machine within a time limit. It is graded on correctness, whether it runs, and good practice.</p>\n<h3>How to prepare</h3>\n<ul>\n<li>Rebuild small features from a blank file, <em>without notes</em> &mdash; copying tutorials is not enough.</li>\n<li>Practise the core pattern of this subject end-to-end until you can do it from memory.</li>\n<li>Read the requirement twice; build the smallest working version first, then extend.</li>\n<li>Test as you go; a program that runs and does 80% beats one that does not compile.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> A real practical prompt bank for this subject will be added here later, in the exam room. Use the guidance above to prepare now.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · PE</span>\n<h2>PE — Thi thực hành</h2>\n<p class=\"lead\">Thi thực hành (PE) là <strong>thi code trực tiếp</strong>: bạn được giao một bài toán/tính năng và phải viết (thường là chạy) code hoạt động trên máy trong thời gian quy định. Chấm theo tính đúng, có chạy được không, và thực hành tốt.</p>\n<h3>Cách chuẩn bị</h3>\n<ul>\n<li>Dựng lại các tính năng nhỏ từ một file trống, <em>không nhìn ghi chú</em> &mdash; chép tutorial là chưa đủ.</li>\n<li>Luyện mẫu cốt lõi của môn đầu-cuối tới khi làm được từ trí nhớ.</li>\n<li>Đọc yêu cầu hai lần; dựng bản chạy được nhỏ nhất trước, rồi mở rộng.</li>\n<li>Test dọc đường; một chương trình chạy và làm được 80% hơn một chương trình không biên dịch nổi.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Ngân hàng đề thực hành thật cho môn này sẽ được thêm vào đây sau, trong trang phòng thi. Dùng hướng dẫn trên để chuẩn bị ngay từ giờ.</div>\n</div>"
        },
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "swd392-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "Good design aims for coupling that is… and cohesion that is…|||Thiết kế tốt nhắm coupling… và cohesion…",
                "options": [
                  "high; low|||cao; thấp",
                  "low; high|||thấp; cao",
                  "high; high|||cao; cao",
                  "low; low|||thấp; thấp"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "Depending on an interface instead of a concrete class mainly reduces…|||Phụ thuộc một interface thay vì lớp cụ thể chủ yếu giảm…",
                "options": [
                  "cohesion",
                  "coupling",
                  "the number of classes|||số lớp",
                  "performance|||hiệu năng"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "The class-diagram relationship where parts die with the whole is…|||Quan hệ class-diagram mà phần chết cùng tổng thể là…",
                "options": [
                  "association",
                  "aggregation",
                  "composition",
                  "inheritance"
                ],
                "correctIndex": 2
              },
              {
                "id": "q4",
                "points": 1,
                "question": "Customer \"1\" -- \"*\" Order means…|||Customer \"1\" -- \"*\" Order nghĩa là…",
                "options": [
                  "one order has many customers|||một order có nhiều khách",
                  "one customer has many orders|||một khách có nhiều order",
                  "orders have no customer|||order không có khách",
                  "a one-to-one link|||liên kết một-một"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "A class that does validation, database access and formatting all at once is a…|||Một lớp làm validation, truy cập database và định dạng cùng lúc là…",
                "options": [
                  "good abstraction|||trừu tượng tốt",
                  "god class (low cohesion)|||god class (cohesion thấp)",
                  "a design pattern|||một design pattern",
                  "an interface|||một interface"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "To decide aggregation vs composition you ask whether… (beyond-syllabus)|||Để quyết aggregation vs composition bạn hỏi liệu… (ngoài giáo trình)",
                "options": [
                  "the classes look similar|||các lớp trông giống nhau",
                  "the part must be deleted when the whole is deleted|||phần có phải bị xoá khi tổng thể bị xoá",
                  "there are many classes|||có nhiều lớp",
                  "the names match|||tên khớp"
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
