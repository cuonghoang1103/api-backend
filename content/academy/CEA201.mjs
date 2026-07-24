/**
 * CEA201 — Computer Organization and Architecture (Tổ chức & Kiến trúc máy tính).
 * Kỳ 1. Bám giáo trình William Stallings "Computer Organization and Architecture:
 * Design for Performance" (9e) + chương nâng cao ngoài giáo trình.
 * Song ngữ EN/VN realtime (khối .ml-en / .ml-vi, tiêu đề EN|||VI).
 * Sơ đồ dùng .lz-map / .lz-flow / .lz-stack (KHÔNG ascii). Luyện code low-level →
 * CodeLab; simulator (MARIE, CPU-Z, Logisim) → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/CEA201.mjs --apply
 */
export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'CEA201',
    slug: 'computer-organization-and-architecture',
    title: 'Computer Organization and Architecture',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'How a computer is really built and how it runs: CPU internals, the memory hierarchy and cache, buses, I/O, digital logic, instruction sets, pipelining, RISC and multicore — the hardware layer beneath every program.|||Máy tính thực sự được xây và chạy ra sao: bên trong CPU, phân cấp bộ nhớ & cache, bus, I/O, logic số, tập lệnh, pipeline, RISC và đa nhân — tầng phần cứng bên dưới mọi chương trình.',
    description: 'Môn nhập môn kiến trúc và tổ chức máy tính theo giáo trình Stallings. Đi từ mô hình cỗ máy, hiệu năng, phân cấp bộ nhớ, logic số, tập lệnh, tới cấu trúc bộ xử lý, RISC, pipeline và xử lý song song. Có thực hành hợp ngữ trên MARIE simulator.',
    whatYouLearn: 'Phân biệt organization vs architecture; đo & tối ưu hiệu năng (Amdahl); phân cấp bộ nhớ & cache; bộ nhớ trong/ngoài; I/O (polling/interrupt/DMA); đại số Boole & mạch logic; tập lệnh & addressing modes; cấu trúc CPU & pipeline; RISC vs CISC; ILP/superscalar; đa nhân.',
    requirements: 'Không có môn tiên quyết. Nên học song song hoặc sau CSI104. Cần trình duyệt web để dùng MARIE simulator và các công cụ mô phỏng.',
    documentsNote: 'Giáo trình chính: Computer Organization and Architecture: Design for Performance — William Stallings (9e). Tham khảo: Computer Architecture: A Quantitative Approach (Hennessy & Patterson). Công cụ: MARIE simulator, ParaCacheSimulator, CPU-Z, Logisim. Kèm file syllabus gốc CEA201.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, học ra sao, điều kiện qua môn, lộ trình các chương và công cụ.',
      lessons: [
        {
          title: '0.1 — About CEA201 & the course map|||0.1 — Giới thiệu môn CEA201 & bản đồ môn học',
          slug: 'cea201-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Organization vs Architecture, học xong biết gì, và bản đồ toàn bộ các chương.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About CEA201 — Computer Organization and Architecture</h2>
<p class="lead">CSI104 gave you the big picture of computer science; CEA201 zooms all the way <strong>into the machine</strong>. It answers the question every serious programmer eventually asks: <em>what is actually happening in the hardware when my code runs?</em> — from the transistors and logic gates up to caches, pipelines and multicore CPUs.</p>
<h3>The one distinction that names the course</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Architecture — what the programmer sees</div><div class="lz-ld">The attributes visible to software: instruction set, data types, number of registers, addressing modes. "Does this CPU have a multiply instruction?" is an architecture question.</div></div>
  <div class="lz-layer"><div class="lz-lt">Organization — how it is built</div><div class="lz-ld">The hardware details that implement the architecture: is there a hardware multiplier or is multiply done by repeated addition? Cache size, bus width, control signals. Invisible to software, but it decides speed and cost.</div></div>
</div>
<p>Two CPUs can share the same <em>architecture</em> (run the same programs) yet have very different <em>organization</em> (one cheap and slow, one expensive and fast). That is the whole Intel product line in one idea.</p>
<h3>Course map — the Stallings journey</h3>
<div class="lz-map">
  <div class="lz-stage">Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Introduction</div><div class="lz-nsub">Organization vs architecture · structure &amp; function</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Evolution &amp; Performance</div><div class="lz-nsub">History · Moore&#39;s law · Amdahl&#39;s law</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Top-Level View &amp; Interconnection</div><div class="lz-nsub">Components · function · the bus</div></div></div>
  <div class="lz-stage">The memory system</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Cache Memory</div><div class="lz-nsub">Locality · mapping · the hierarchy</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Internal Memory</div><div class="lz-nsub">RAM/ROM · DRAM vs SRAM</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">External Memory</div><div class="lz-nsub">Disk · RAID · SSD/flash</div></div></div>
  <div class="lz-stage">Talking &amp; managing</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Input/Output</div><div class="lz-nsub">Polling · interrupts · DMA</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">OS Support</div><div class="lz-nsub">Scheduling · memory management</div></div></div>
  <div class="lz-stage">Logic &amp; instructions</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Digital Logic</div><div class="lz-nsub">Boolean algebra · gates · circuits</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Instruction Sets: Characteristics</div><div class="lz-nsub">Operands · operations · data types</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Instruction Sets: Addressing</div><div class="lz-nsub">Addressing modes &amp; formats</div></div></div>
  <div class="lz-stage">The processor</div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Processor Structure &amp; Function</div><div class="lz-nsub">Registers · instruction cycle · pipelining</div></div></div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">RISC</div><div class="lz-nsub">RISC vs CISC · register windows</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">ILP &amp; Superscalar</div><div class="lz-nsub">Doing several instructions at once</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Parallel Processing &amp; Multicore</div><div class="lz-nsub">SMP · cache coherence · GPUs</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">MARIE assembly · pipeline hazards · modern CPU security</div><div class="lz-nsub">Hands-on &amp; deeper connections</div></div></div>
</div>
<p>CEA201 pairs with <span class="badge">CSI104</span> in semester 1 and is the hardware backbone for <span class="badge">OSG202</span> (Operating Systems), <span class="badge">IOT102</span> and any low-level or performance work later. Where PRF192 taught you to write code, CEA201 shows you the machine that runs it.</p>
<div class="callout ok">Study tip: this course is full of numbers (cache sizes, clock cycles, address bits). Do not memorize them — understand the <strong>trade-offs</strong> behind them. Every design choice in hardware answers "faster, smaller, or cheaper — pick two".</div>
<a class="link-card exphub" href="/exp-hub/cea201-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Tools for CEA201 — MARIE, CPU-Z, Logisim</span><span class="lc-sub">The simulators the syllabus uses, with setup links — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu môn CEA201 — Tổ chức &amp; Kiến trúc máy tính</h2>
<p class="lead">CSI104 cho bạn bức tranh lớn của khoa học máy tính; CEA201 phóng to hẳn <strong>vào bên trong cỗ máy</strong>. Nó trả lời câu hỏi mọi lập trình viên nghiêm túc rồi cũng hỏi: <em>thực ra phần cứng đang làm gì khi code của tôi chạy?</em> — từ transistor và cổng logic lên tới cache, pipeline và CPU đa nhân.</p>
<h3>Một phân biệt đặt tên cho cả môn</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Kiến trúc (Architecture) — thứ lập trình viên thấy</div><div class="lz-ld">Các thuộc tính phần mềm nhìn thấy: tập lệnh, kiểu dữ liệu, số thanh ghi, addressing mode. "CPU này có lệnh nhân không?" là câu hỏi kiến trúc.</div></div>
  <div class="lz-layer"><div class="lz-lt">Tổ chức (Organization) — cách nó được xây</div><div class="lz-ld">Chi tiết phần cứng hiện thực kiến trúc: có mạch nhân phần cứng hay nhân bằng cộng lặp? Kích thước cache, độ rộng bus, tín hiệu điều khiển. Vô hình với phần mềm, nhưng quyết định tốc độ và giá.</div></div>
</div>
<p>Hai CPU có thể cùng <em>kiến trúc</em> (chạy cùng chương trình) nhưng <em>tổ chức</em> rất khác (một cái rẻ và chậm, một cái đắt và nhanh). Đó là cả dòng sản phẩm Intel gói trong một ý tưởng.</p>
<h3>Bản đồ môn học — hành trình theo Stallings</h3>
<div class="lz-map">
  <div class="lz-stage">Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Giới thiệu</div><div class="lz-nsub">Organization vs architecture · cấu trúc &amp; chức năng</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Tiến hoá &amp; Hiệu năng</div><div class="lz-nsub">Lịch sử · định luật Moore · định luật Amdahl</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Cái nhìn tổng thể &amp; Kết nối</div><div class="lz-nsub">Thành phần · chức năng · bus</div></div></div>
  <div class="lz-stage">Hệ thống bộ nhớ</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Bộ nhớ Cache</div><div class="lz-nsub">Tính cục bộ · ánh xạ · phân cấp</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Bộ nhớ trong</div><div class="lz-nsub">RAM/ROM · DRAM vs SRAM</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Bộ nhớ ngoài</div><div class="lz-nsub">Đĩa · RAID · SSD/flash</div></div></div>
  <div class="lz-stage">Giao tiếp &amp; quản lý</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Nhập/Xuất (I/O)</div><div class="lz-nsub">Polling · ngắt · DMA</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Hỗ trợ hệ điều hành</div><div class="lz-nsub">Lập lịch · quản lý bộ nhớ</div></div></div>
  <div class="lz-stage">Logic &amp; tập lệnh</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Logic số</div><div class="lz-nsub">Đại số Boole · cổng · mạch</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Tập lệnh: Đặc điểm</div><div class="lz-nsub">Toán hạng · phép toán · kiểu dữ liệu</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Tập lệnh: Addressing</div><div class="lz-nsub">Addressing mode &amp; định dạng lệnh</div></div></div>
  <div class="lz-stage">Bộ xử lý</div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Cấu trúc &amp; Chức năng CPU</div><div class="lz-nsub">Thanh ghi · chu trình lệnh · pipeline</div></div></div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">RISC</div><div class="lz-nsub">RISC vs CISC · cửa sổ thanh ghi</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">ILP &amp; Superscalar</div><div class="lz-nsub">Làm nhiều lệnh cùng lúc</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Xử lý song song &amp; Đa nhân</div><div class="lz-nsub">SMP · nhất quán cache · GPU</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Hợp ngữ MARIE · hazard pipeline · bảo mật CPU hiện đại</div><div class="lz-nsub">Thực hành &amp; kết nối sâu hơn</div></div></div>
</div>
<p>CEA201 đi cặp với <span class="badge">CSI104</span> ở kỳ 1 và là xương sống phần cứng cho <span class="badge">OSG202</span> (Hệ điều hành), <span class="badge">IOT102</span> và mọi việc low-level hay tối ưu hiệu năng sau này. PRF192 dạy bạn viết code, còn CEA201 cho bạn thấy cỗ máy chạy code đó.</p>
<div class="callout ok">Mẹo học: môn này đầy con số (kích thước cache, chu kỳ clock, số bit địa chỉ). Đừng học thuộc — hãy hiểu <strong>đánh đổi</strong> đằng sau chúng. Mọi lựa chọn thiết kế phần cứng đều trả lời "nhanh, nhỏ, hay rẻ — chọn hai".</div>
<a class="link-card exphub" href="/exp-hub/cea201-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Công cụ cho CEA201 — MARIE, CPU-Z, Logisim</span><span class="lc-sub">Các simulator syllabus dùng, kèm link cài đặt — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'cea201-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết, điểm sàn qua môn và trọng số từng cột điểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">The rules straight from the official CEA201 syllabus. Note this course has an unusually heavy on-going weight — steady work pays off.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class + 1h exam + 104h self-study</small></span></div>
  <div class="kv"><span class="k">Sessions</span><span class="v">60 sessions <small>45 min each</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of sessions</span></div>
</div>
<h3>Grade structure</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Assignment</td><td>20%</td><td>On-going, 2 parts — a report or a small project/simulation at home (All CLOs)</td></tr>
    <tr><td>Exercises</td><td>40%</td><td>On-going, 4 parts — done at home throughout the term</td></tr>
    <tr><td>Final exam</td><td>40%</td><td>60 minutes, multiple choice — must score ≥ 4 to pass the course</td></tr>
  </tbody>
</table>
<div class="callout warn">Two gates as always: <strong>(1)</strong> weighted average ≥ 5.0 and <strong>(2)</strong> the final exam alone ≥ 4.0. With 60% on-going, if you actually do the exercises and assignment you enter the final with a strong cushion — but you still cannot skip the final.</div>
<div class="note-ct">The final is multiple choice, which rewards broad, precise understanding of concepts and terminology (exactly what the chapter quizzes here drill). The assignment often involves a simulator (MARIE) or a written report — start it early, do not leave it to the last week.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Luật lấy thẳng từ syllabus chính thức CEA201. Lưu ý môn này có trọng số quá trình rất nặng — làm đều tay là thắng.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h học + 1h thi + 104h tự học</small></span></div>
  <div class="kv"><span class="k">Số buổi</span><span class="v">60 buổi <small>45 phút/buổi</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% số buổi</span></div>
</div>
<h3>Cấu trúc điểm</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Assignment</td><td>20%</td><td>Thường xuyên, 2 phần — báo cáo hoặc dự án/mô phỏng nhỏ làm ở nhà (mọi CLO)</td></tr>
    <tr><td>Exercises (bài tập)</td><td>40%</td><td>Thường xuyên, 4 phần — làm ở nhà suốt kỳ</td></tr>
    <tr><td>Thi cuối kỳ</td><td>40%</td><td>60 phút, trắc nghiệm — phải đạt ≥ 4 mới qua môn</td></tr>
  </tbody>
</table>
<div class="callout warn">Hai cửa như thường lệ: <strong>(1)</strong> trung bình có trọng số ≥ 5.0 và <strong>(2)</strong> riêng thi cuối ≥ 4.0. Với 60% là quá trình, nếu bạn thực sự làm bài tập và assignment thì vào thi cuối với lợi thế lớn — nhưng vẫn không được bỏ thi cuối.</div>
<div class="note-ct">Thi cuối là trắc nghiệm, thưởng cho hiểu rộng và chính xác về khái niệm và thuật ngữ (đúng thứ mà quiz các chương ở đây rèn). Assignment thường dùng simulator (MARIE) hoặc viết báo cáo — bắt đầu sớm, đừng để tuần cuối.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning outcomes (10 CLOs)|||0.3 — Chuẩn đầu ra (10 CLO)',
          slug: 'cea201-chuan-dau-ra',
          type: 'VIDEO',
          description: '10 điều nhà trường cam kết bạn làm được — dùng làm checklist ôn thi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The 10 Course Learning Outcomes (CLOs)</h2>
<p class="lead">Each CLO is a skill the course promises. They double as your exam checklist — the multiple-choice final samples across all of them.</p>
<table>
  <thead><tr><th>#</th><th>You will be able to…</th><th>Covered in</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Explain the general functions and structure of a digital computer</td><td>Ch 1, 3</td></tr>
    <tr><td>CLO2</td><td>Present the evolution of computer technology over time</td><td>Ch 2</td></tr>
    <tr><td>CLO3</td><td>Understand the key performance issues in computer design</td><td>Ch 2</td></tr>
    <tr><td>CLO4</td><td>Describe the essential elements: bus, memory, I/O</td><td>Ch 3–7</td></tr>
    <tr><td>CLO5</td><td>Summarize the key functions of an operating system</td><td>Ch 8</td></tr>
    <tr><td>CLO6</td><td>Apply Boolean algebra &amp; digital logic to design circuits</td><td>Ch 9</td></tr>
    <tr><td>CLO7</td><td>Present addressing modes and instruction-set characteristics</td><td>Ch 10–11</td></tr>
    <tr><td>CLO8</td><td>Explain processor structure, function &amp; RISC operation</td><td>Ch 12–13</td></tr>
    <tr><td>CLO9</td><td>Investigate trends: instruction-level parallelism, multicore</td><td>Ch 14–15</td></tr>
    <tr><td>CLO10</td><td>Use AI tools &amp; simulators to explore the concepts</td><td>All + Advanced (MARIE)</td></tr>
  </tbody>
</table>
<div class="note-ct">CLO10 is unusual and modern: the syllabus explicitly expects you to use <strong>simulators</strong> (MARIE, ParaCacheSimulator) and AI tools to explore ideas hands-on. The Exp Hub tools guide and the advanced MARIE lesson here are built for exactly that.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>10 Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">Mỗi CLO là một kỹ năng môn học cam kết. Chúng cũng là checklist ôn thi — bài trắc nghiệm cuối kỳ lấy mẫu khắp các CLO.</p>
<table>
  <thead><tr><th>#</th><th>Bạn sẽ làm được…</th><th>Học ở</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Giải thích chức năng và cấu trúc chung của máy tính số</td><td>Ch 1, 3</td></tr>
    <tr><td>CLO2</td><td>Trình bày sự tiến hoá của công nghệ máy tính qua thời gian</td><td>Ch 2</td></tr>
    <tr><td>CLO3</td><td>Hiểu các vấn đề hiệu năng then chốt trong thiết kế máy tính</td><td>Ch 2</td></tr>
    <tr><td>CLO4</td><td>Mô tả các thành phần cốt lõi: bus, bộ nhớ, I/O</td><td>Ch 3–7</td></tr>
    <tr><td>CLO5</td><td>Tóm tắt các chức năng chính của hệ điều hành</td><td>Ch 8</td></tr>
    <tr><td>CLO6</td><td>Áp dụng đại số Boole &amp; logic số để thiết kế mạch</td><td>Ch 9</td></tr>
    <tr><td>CLO7</td><td>Trình bày addressing mode và đặc điểm tập lệnh</td><td>Ch 10–11</td></tr>
    <tr><td>CLO8</td><td>Giải thích cấu trúc, chức năng CPU &amp; hoạt động RISC</td><td>Ch 12–13</td></tr>
    <tr><td>CLO9</td><td>Khảo sát xu hướng: song song mức lệnh, đa nhân</td><td>Ch 14–15</td></tr>
    <tr><td>CLO10</td><td>Dùng công cụ AI &amp; simulator để khám phá khái niệm</td><td>Mọi chương + Nâng cao (MARIE)</td></tr>
  </tbody>
</table>
<div class="note-ct">CLO10 khá đặc biệt và hiện đại: syllabus yêu cầu rõ bạn dùng <strong>simulator</strong> (MARIE, ParaCacheSimulator) và công cụ AI để khám phá ý tưởng bằng tay. Guide công cụ trên Exp Hub và bài MARIE nâng cao ở đây được làm ra đúng cho việc này.</div>
</div>
`,
        },
        {
          title: '0.4 — Materials, simulators & how to study|||0.4 — Tài liệu, simulator & cách học',
          slug: 'cea201-tai-lieu',
          type: 'VIDEO',
          description: 'Giáo trình Stallings, MARIE/CPU-Z/Logisim và cách học môn nhiều con số.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials, tools &amp; how to study</h2>
<h3>Textbooks</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Computer Organization and Architecture: Design for Performance — William Stallings (9e)</div><div class="lz-ld">The spine of the course. Every chapter here follows Stallings, with the same names. Comes with a rich instructor/student website of animations.</div></div>
  <div class="lz-layer"><div class="lz-lt">Computer Architecture: A Quantitative Approach — Hennessy &amp; Patterson</div><div class="lz-ld">A deeper reference for performance and parallelism; only the intro chapters are needed at this level.</div></div>
</div>
<h3>Simulators you will actually use (CLO10)</h3>
<ul>
  <li><strong>MARIE</strong> — a teaching CPU with a tiny assembly language; write and single-step programs to see registers and the instruction cycle.</li>
  <li><strong>Logisim / logic simulators</strong> — build gates and circuits for the Digital Logic chapter.</li>
  <li><strong>CPU-Z</strong> — read your real CPU&#39;s specs (cores, cache sizes, clock) to connect theory to your own machine.</li>
</ul>
<h3>A study rhythm for a numbers-heavy course</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Grasp</div><div class="lz-t">the trade-off</div><div class="lz-d">why this design, not the number</div></div>
  <div class="lz-step"><div class="lz-k">Draw</div><div class="lz-t">the diagram</div><div class="lz-d">memory hierarchy, pipeline, bus</div></div>
  <div class="lz-step"><div class="lz-k">Simulate</div><div class="lz-t">in MARIE</div><div class="lz-d">see it actually run</div></div>
  <div class="lz-step"><div class="lz-k">Self-quiz</div><div class="lz-t">weekly</div><div class="lz-d">for the MCQ final</div></div>
</div>
<div class="callout ok">The trap in CEA201 is drowning in details. The cure: for every topic, ask "what problem does this solve, and what does it cost?" Cache solves the slow-RAM problem at the cost of complexity; pipelining solves idle-CPU at the cost of hazards. Trade-offs are the real content.</div>
<a class="link-card exphub" href="/exp-hub/cea201-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Set up MARIE, Logisim &amp; CPU-Z</span><span class="lc-sub">One-click links and quick-start for the CEA201 simulators.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu, công cụ &amp; cách học</h2>
<h3>Giáo trình</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Computer Organization and Architecture: Design for Performance — William Stallings (9e)</div><div class="lz-ld">Xương sống của môn. Mọi chương ở đây bám Stallings, cùng tên. Kèm website giảng viên/sinh viên nhiều hoạt hình minh hoạ.</div></div>
  <div class="lz-layer"><div class="lz-lt">Computer Architecture: A Quantitative Approach — Hennessy &amp; Patterson</div><div class="lz-ld">Tham khảo sâu về hiệu năng và song song; ở mức này chỉ cần các chương mở đầu.</div></div>
</div>
<h3>Simulator bạn sẽ thật sự dùng (CLO10)</h3>
<ul>
  <li><strong>MARIE</strong> — một CPU dạy học với hợp ngữ tí hon; viết và chạy từng bước để thấy thanh ghi và chu trình lệnh.</li>
  <li><strong>Logisim / trình mô phỏng logic</strong> — dựng cổng và mạch cho chương Logic số.</li>
  <li><strong>CPU-Z</strong> — đọc thông số CPU thật của bạn (nhân, kích thước cache, clock) để nối lý thuyết với máy của chính mình.</li>
</ul>
<h3>Một nhịp học cho môn nhiều con số</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nắm</div><div class="lz-t">đánh đổi</div><div class="lz-d">vì sao thiết kế này, không phải con số</div></div>
  <div class="lz-step"><div class="lz-k">Vẽ</div><div class="lz-t">sơ đồ</div><div class="lz-d">phân cấp bộ nhớ, pipeline, bus</div></div>
  <div class="lz-step"><div class="lz-k">Mô phỏng</div><div class="lz-t">trên MARIE</div><div class="lz-d">thấy nó chạy thật</div></div>
  <div class="lz-step"><div class="lz-k">Tự kiểm</div><div class="lz-t">hàng tuần</div><div class="lz-d">cho bài thi trắc nghiệm</div></div>
</div>
<div class="callout ok">Cái bẫy ở CEA201 là chìm trong chi tiết. Cách chữa: với mỗi chủ đề, hỏi "nó giải vấn đề gì, và cái giá là gì?" Cache giải bài toán RAM chậm với giá là độ phức tạp; pipeline giải CPU rảnh với giá là hazard. Đánh đổi mới là nội dung thật.</div>
<a class="link-card exphub" href="/exp-hub/cea201-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Cài đặt MARIE, Logisim &amp; CPU-Z</span><span class="lc-sub">Link một cú nhấp và hướng dẫn nhanh cho các simulator CEA201.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — GIỚI THIỆU ══════════════════ */
    {
      title: 'Chapter 1 — Introduction|||Chương 1 — Giới thiệu',
      description: 'Organization vs Architecture và cấu trúc–chức năng của máy tính số.',
      lessons: [
        {
          title: '1.1 — Organization vs Architecture|||1.1 — Tổ chức vs Kiến trúc',
          slug: 'cea201-1-1-org-vs-arch',
          type: 'VIDEO',
          description: 'Hai góc nhìn về máy tính và vì sao phân biệt chúng lại quan trọng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Two views of the same machine</h2>
<p class="lead">This distinction runs through the whole course (CLO1), so it is worth nailing down with examples. Both describe a computer, but from different heights.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Architecture = the programmer&#39;s contract</div><div class="lz-ld">Attributes visible to a program: the instruction set, word length, number and type of registers, addressing modes, how memory is addressed. It answers "what can I ask the machine to do?"</div></div>
  <div class="lz-layer"><div class="lz-lt">Organization = the engineer&#39;s implementation</div><div class="lz-ld">The operational units and how they connect to realize the architecture: control signals, the actual cache, whether multiply is a dedicated circuit or done in microcode, bus widths. It answers "how is it built and how fast?"</div></div>
</div>
<h3>Why keep them separate?</h3>
<p>Because a family of computers can share <strong>one architecture</strong> but many <strong>organizations</strong>. Intel&#39;s x86 architecture has run for decades: a program compiled long ago still runs on a modern chip — same architecture. Yet each generation is organized completely differently inside (bigger caches, more execution units), giving huge speedups without breaking old software.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Architecture Q</span><span class="v">Is there a multiply instruction? <small>visible to code</small></span></div>
  <div class="kv"><span class="k">Organization Q</span><span class="v">Is multiply a hardware unit or repeated adds? <small>hidden from code</small></span></div>
</div>
<div class="callout ok">The payoff of this separation is <strong>compatibility</strong>: manufacturers improve organization every year (the hidden how) while keeping architecture stable (the visible what), so your software keeps working while hardware keeps getting faster.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Hai góc nhìn về cùng một cỗ máy</h2>
<p class="lead">Phân biệt này chạy xuyên suốt cả môn (CLO1), nên đáng chốt chặt bằng ví dụ. Cả hai đều mô tả một máy tính, nhưng từ hai độ cao khác nhau.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Kiến trúc = hợp đồng với lập trình viên</div><div class="lz-ld">Thuộc tính chương trình nhìn thấy: tập lệnh, độ dài từ, số và loại thanh ghi, addressing mode, cách địa chỉ bộ nhớ. Nó trả lời "tôi có thể yêu cầu máy làm gì?"</div></div>
  <div class="lz-layer"><div class="lz-lt">Tổ chức = cách kỹ sư hiện thực</div><div class="lz-ld">Các đơn vị vận hành và cách chúng nối để hiện thực kiến trúc: tín hiệu điều khiển, cache thực tế, phép nhân là mạch riêng hay bằng microcode, độ rộng bus. Nó trả lời "được xây thế nào và nhanh ra sao?"</div></div>
</div>
<h3>Vì sao phải tách riêng?</h3>
<p>Vì một họ máy tính có thể chung <strong>một kiến trúc</strong> nhưng nhiều <strong>tổ chức</strong>. Kiến trúc x86 của Intel đã chạy hàng chục năm: một chương trình biên dịch từ lâu vẫn chạy trên chip hiện đại — cùng kiến trúc. Nhưng mỗi thế hệ được tổ chức hoàn toàn khác bên trong (cache lớn hơn, nhiều đơn vị thực thi hơn), cho tăng tốc khổng lồ mà không phá vỡ phần mềm cũ.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Câu hỏi Kiến trúc</span><span class="v">Có lệnh nhân không? <small>code thấy được</small></span></div>
  <div class="kv"><span class="k">Câu hỏi Tổ chức</span><span class="v">Nhân là mạch phần cứng hay cộng lặp? <small>giấu khỏi code</small></span></div>
</div>
<div class="callout ok">Lợi ích của việc tách này là <strong>tương thích</strong>: nhà sản xuất cải tiến tổ chức mỗi năm (cái "làm sao" ẩn) trong khi giữ kiến trúc ổn định (cái "gì" hiện), nên phần mềm của bạn vẫn chạy còn phần cứng vẫn nhanh dần.</div>
</div>
`,
        },
        {
          title: '1.2 — Structure & Function|||1.2 — Cấu trúc & Chức năng',
          slug: 'cea201-1-2-structure-function',
          type: 'VIDEO',
          description: 'Bốn chức năng cơ bản và cấu trúc phân cấp của máy tính.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>What a computer does — four basic functions</h2>
<p class="lead">Stallings frames every computer, no matter how complex, as performing just <strong>four basic functions</strong>. Everything else is detail on top of these.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Data processing</div><div class="lz-nsub">Perform operations on data (the ALU&#39;s job)</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Data storage</div><div class="lz-nsub">Hold data short-term (memory) and long-term (disk)</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Data movement</div><div class="lz-nsub">Move data to/from the outside world (I/O) and internally</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Control</div><div class="lz-nsub">Coordinate the other three (the control unit)</div></div></div>
</div>
<h3>Structure — the hierarchy of parts</h3>
<p>A computer is understood as a <strong>hierarchy</strong>: each level is built from components of the level below. This lets us study one level without drowning in the one beneath it.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Computer</div><div class="lz-ld">CPU + Memory + I/O + System interconnection (bus)</div></div>
  <div class="lz-layer"><div class="lz-lt">CPU</div><div class="lz-ld">Control Unit + ALU + Registers + internal CPU interconnection</div></div>
  <div class="lz-layer"><div class="lz-lt">Control Unit</div><div class="lz-ld">Sequencing logic + control-unit registers &amp; decoders (the deepest level we study)</div></div>
</div>
<div class="note-ct">This top-down map is the plan of the whole course: Chapters 3–7 study Memory and I/O, Chapters 9–15 zoom into the CPU (logic, instructions, processor, RISC, parallelism). Keep this hierarchy in mind and every chapter has an obvious home.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Máy tính làm gì — bốn chức năng cơ bản</h2>
<p class="lead">Stallings mô tả mọi máy tính, dù phức tạp đến đâu, chỉ thực hiện <strong>bốn chức năng cơ bản</strong>. Mọi thứ khác là chi tiết chồng lên chúng.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Xử lý dữ liệu</div><div class="lz-nsub">Thực hiện phép toán trên dữ liệu (việc của ALU)</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Lưu trữ dữ liệu</div><div class="lz-nsub">Giữ dữ liệu ngắn hạn (bộ nhớ) và dài hạn (đĩa)</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Di chuyển dữ liệu</div><div class="lz-nsub">Chuyển dữ liệu ra/vào thế giới ngoài (I/O) và nội bộ</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Điều khiển</div><div class="lz-nsub">Điều phối ba chức năng kia (đơn vị điều khiển)</div></div></div>
</div>
<h3>Cấu trúc — phân cấp các bộ phận</h3>
<p>Một máy tính được hiểu như một <strong>phân cấp</strong>: mỗi mức được xây từ thành phần của mức dưới. Điều này cho ta nghiên cứu một mức mà không chìm trong mức dưới nó.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Máy tính</div><div class="lz-ld">CPU + Bộ nhớ + I/O + Kết nối hệ thống (bus)</div></div>
  <div class="lz-layer"><div class="lz-lt">CPU</div><div class="lz-ld">Đơn vị điều khiển + ALU + Thanh ghi + kết nối nội bộ CPU</div></div>
  <div class="lz-layer"><div class="lz-lt">Đơn vị điều khiển</div><div class="lz-ld">Logic tuần tự + thanh ghi &amp; bộ giải mã của control unit (mức sâu nhất ta học)</div></div>
</div>
<div class="note-ct">Bản đồ top-down này là kế hoạch của cả môn: Chương 3–7 học Bộ nhớ và I/O, Chương 9–15 phóng vào CPU (logic, tập lệnh, bộ xử lý, RISC, song song). Giữ phân cấp này trong đầu và mọi chương đều có chỗ đứng rõ ràng.</div>
</div>
`,
        },
        {
          title: 'Chapter 1 Quiz|||Quiz chương 1',
          slug: 'cea201-quiz-ch1',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: organization vs architecture, chức năng & cấu trúc.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Which is an ARCHITECTURE attribute (visible to the programmer)?|||Cái nào là thuộc tính KIẾN TRÚC (lập trình viên thấy được)?', options: ['Cache size|||Kích thước cache', 'The instruction set|||Tập lệnh', 'Bus width|||Độ rộng bus', 'Control signals|||Tín hiệu điều khiển'], correctIndex: 1, points: 1 },
              { question: 'Whether multiply is a hardware unit or done by repeated addition is a question of…|||Việc nhân là một mạch phần cứng hay làm bằng cộng lặp là câu hỏi về…', options: ['architecture|||kiến trúc', 'organization|||tổ chức', 'the operating system|||hệ điều hành', 'the compiler|||trình biên dịch'], correctIndex: 1, points: 1 },
              { question: 'Keeping architecture stable while improving organization gives us…|||Giữ kiến trúc ổn định trong khi cải tiến tổ chức cho ta…', options: ['slower computers|||máy chậm hơn', 'software compatibility across generations|||tương thích phần mềm qua các thế hệ', 'no benefit|||không lợi ích', 'smaller instruction sets|||tập lệnh nhỏ hơn'], correctIndex: 1, points: 1 },
              { question: 'Which is NOT one of the four basic computer functions?|||Cái nào KHÔNG phải một trong bốn chức năng cơ bản?', options: ['Data processing|||Xử lý dữ liệu', 'Data storage|||Lưu trữ dữ liệu', 'Data compression|||Nén dữ liệu', 'Control|||Điều khiển'], correctIndex: 2, points: 1 },
              { question: 'In the structural hierarchy, the CPU contains…|||Trong phân cấp cấu trúc, CPU chứa…', options: ['the disk and printer|||đĩa và máy in', 'Control Unit, ALU and registers|||Control Unit, ALU và thanh ghi', 'only memory|||chỉ bộ nhớ', 'the operating system|||hệ điều hành'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — TIẾN HOÁ & HIỆU NĂNG ══════════════════ */
    {
      title: 'Chapter 2 — Computer Evolution & Performance|||Chương 2 — Tiến hoá & Hiệu năng máy tính',
      description: 'Lịch sử máy tính, định luật Moore, các động lực hiệu năng và định luật Amdahl.',
      lessons: [
        {
          title: '2.1 — A brief history & Moore\'s law|||2.1 — Lịch sử ngắn gọn & định luật Moore',
          slug: 'cea201-2-1-history-moore',
          type: 'VIDEO',
          description: 'Từ ENIAC tới vi xử lý, và vì sao chip cứ mạnh gấp đôi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>How computing hardware evolved</h2>
<p class="lead">Understanding where computers came from (CLO2) explains why they are shaped the way they are today. The story is one of shrinking switches and exploding speed.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Vacuum tubes · ENIAC (1946)</div><div class="lz-nsub">18,000 tubes, 30 tons, room-sized. First general-purpose electronic computer.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Transistors (late 1950s)</div><div class="lz-nsub">Smaller, cooler, far more reliable than tubes.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Integrated circuits (1960s)</div><div class="lz-nsub">Many transistors on one silicon chip. IBM System/360 defined "architecture".</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Microprocessors (1971→)</div><div class="lz-nsub">A whole CPU on one chip (Intel 4004) — the personal computer becomes possible.</div></div></div>
</div>
<h3>Moore&#39;s law</h3>
<p>In 1965 Gordon Moore observed that the number of transistors on a chip roughly <strong>doubles about every two years</strong>. This exponential trend drove decades of progress: more transistors meant more speed, more memory, lower cost per function.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">More transistors</div><div class="lz-t">smaller &amp; denser</div><div class="lz-d">every ~2 years</div></div>
  <div class="lz-step"><div class="lz-k">Shorter paths</div><div class="lz-t">higher clock speed</div><div class="lz-d">signals travel less</div></div>
  <div class="lz-step"><div class="lz-k">Cheaper</div><div class="lz-t">more function per dollar</div><div class="lz-d">the whole industry</div></div>
</div>
<div class="pitfall">Moore&#39;s law is an observation/economic trend, not a law of physics — and it is now slowing as transistors approach atomic size and power/heat limits. This is exactly why the industry turned to multicore (Chapter 15): you cannot just crank the clock forever.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Phần cứng máy tính tiến hoá thế nào</h2>
<p class="lead">Hiểu máy tính đến từ đâu (CLO2) giải thích vì sao chúng có hình hài như hôm nay. Câu chuyện là về công tắc co nhỏ dần và tốc độ bùng nổ.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Đèn chân không · ENIAC (1946)</div><div class="lz-nsub">18.000 đèn, 30 tấn, to bằng cả phòng. Máy tính điện tử đa dụng đầu tiên.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Transistor (cuối 1950s)</div><div class="lz-nsub">Nhỏ hơn, mát hơn, tin cậy hơn đèn nhiều.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Vi mạch tích hợp (1960s)</div><div class="lz-nsub">Nhiều transistor trên một chip silicon. IBM System/360 định nghĩa "kiến trúc".</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Vi xử lý (1971→)</div><div class="lz-nsub">Cả CPU trên một chip (Intel 4004) — máy tính cá nhân thành khả thi.</div></div></div>
</div>
<h3>Định luật Moore</h3>
<p>Năm 1965 Gordon Moore nhận xét số transistor trên một chip <strong>tăng gấp đôi khoảng mỗi hai năm</strong>. Xu hướng lũy thừa này thúc đẩy hàng chục năm tiến bộ: nhiều transistor hơn nghĩa là nhanh hơn, nhiều bộ nhớ hơn, chi phí trên mỗi chức năng thấp hơn.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nhiều transistor</div><div class="lz-t">nhỏ &amp; dày hơn</div><div class="lz-d">mỗi ~2 năm</div></div>
  <div class="lz-step"><div class="lz-k">Đường ngắn hơn</div><div class="lz-t">clock cao hơn</div><div class="lz-d">tín hiệu đi ít hơn</div></div>
  <div class="lz-step"><div class="lz-k">Rẻ hơn</div><div class="lz-t">nhiều chức năng/đồng</div><div class="lz-d">cả ngành</div></div>
</div>
<div class="pitfall">Định luật Moore là một quan sát/xu hướng kinh tế, không phải định luật vật lý — và nay đang chậm lại khi transistor tiến gần kích thước nguyên tử và giới hạn điện/nhiệt. Đây chính là lý do ngành chuyển sang đa nhân (Chương 15): không thể cứ đẩy clock lên mãi.</div>
</div>
`,
        },
        {
          title: '2.2 — Performance: clock, CPI, MIPS & Amdahl\'s law|||2.2 — Hiệu năng: clock, CPI, MIPS & định luật Amdahl',
          slug: 'cea201-2-2-performance-amdahl',
          type: 'VIDEO',
          description: 'Cách đo tốc độ CPU và vì sao tăng tốc một phần không tăng tốc cả hệ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Measuring computer performance</h2>
<p class="lead">"Which computer is faster?" is subtler than clock speed alone (CLO3). Several metrics matter, and one famous law limits how much any single improvement can help.</p>
<h3>The basic metrics</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Clock speed (GHz)</div><div class="lz-ld">Ticks per second. 3 GHz = 3 billion cycles/sec. But more cycles is useless if each does little work.</div></div>
  <div class="lz-layer"><div class="lz-lt">CPI — Cycles Per Instruction</div><div class="lz-ld">Average clock cycles each instruction takes. Lower is better; pipelining aims to push CPI toward 1.</div></div>
  <div class="lz-layer"><div class="lz-lt">MIPS — Millions of Instructions Per Second</div><div class="lz-ld">A rough throughput measure. Flawed across different instruction sets, but a common headline number.</div></div>
</div>
<div class="out"><b>CPU time</b> = Instruction count × CPI × Clock cycle time<br>Speed up by: fewer instructions, lower CPI, or a faster clock.</div>
<h3>Amdahl&#39;s law — the reality check</h3>
<p>Amdahl&#39;s law says the overall speedup from improving one part is limited by how much time that part actually takes. If a task spends only 25% of its time on the part you speed up, then even making that part <em>infinitely</em> fast cuts total time by at most 25%.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Improve</div><div class="lz-t">one component</div><div class="lz-d">e.g. make it 10× faster</div></div>
  <div class="lz-step"><div class="lz-k">Limited by</div><div class="lz-t">its time fraction</div><div class="lz-d">the untouched part dominates</div></div>
  <div class="lz-step"><div class="lz-k">Lesson</div><div class="lz-t">optimize the bottleneck</div><div class="lz-d">speed up what takes the most time</div></div>
</div>
<div class="callout ok">Amdahl&#39;s law is one of the most useful ideas in all of computing: <strong>make the common case fast</strong>. It also explains why adding more CPU cores gives diminishing returns — the parts of a program that cannot run in parallel become the ceiling.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Đo hiệu năng máy tính</h2>
<p class="lead">"Máy nào nhanh hơn?" tinh tế hơn chỉ tốc độ clock (CLO3). Nhiều thước đo quan trọng, và một định luật nổi tiếng giới hạn mức mà bất kỳ cải tiến đơn lẻ nào có thể giúp.</p>
<h3>Các thước đo cơ bản</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Tốc độ clock (GHz)</div><div class="lz-ld">Số nhịp mỗi giây. 3 GHz = 3 tỷ chu kỳ/giây. Nhưng nhiều chu kỳ vô ích nếu mỗi chu kỳ làm được ít.</div></div>
  <div class="lz-layer"><div class="lz-lt">CPI — Chu kỳ trên mỗi lệnh</div><div class="lz-ld">Số chu kỳ clock trung bình mỗi lệnh tốn. Càng thấp càng tốt; pipeline nhắm đẩy CPI về 1.</div></div>
  <div class="lz-layer"><div class="lz-lt">MIPS — Triệu lệnh mỗi giây</div><div class="lz-ld">Một thước đo thông lượng thô. Không chuẩn khi so tập lệnh khác nhau, nhưng là con số hay được nêu.</div></div>
</div>
<div class="out"><b>Thời gian CPU</b> = Số lệnh × CPI × Thời gian một chu kỳ<br>Tăng tốc bằng: ít lệnh hơn, CPI thấp hơn, hoặc clock nhanh hơn.</div>
<h3>Định luật Amdahl — cú kiểm tra thực tế</h3>
<p>Định luật Amdahl nói mức tăng tốc tổng thể từ cải tiến một phần bị giới hạn bởi phần đó thực sự chiếm bao nhiêu thời gian. Nếu một tác vụ chỉ dành 25% thời gian cho phần bạn tăng tốc, thì dù làm phần đó nhanh <em>vô hạn</em> cũng chỉ cắt tối đa 25% tổng thời gian.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Cải tiến</div><div class="lz-t">một thành phần</div><div class="lz-d">vd làm nhanh gấp 10</div></div>
  <div class="lz-step"><div class="lz-k">Bị giới hạn bởi</div><div class="lz-t">tỷ lệ thời gian của nó</div><div class="lz-d">phần không đụng tới thống trị</div></div>
  <div class="lz-step"><div class="lz-k">Bài học</div><div class="lz-t">tối ưu điểm nghẽn</div><div class="lz-d">tăng tốc cái tốn nhiều thời gian nhất</div></div>
</div>
<div class="callout ok">Định luật Amdahl là một trong những ý tưởng hữu ích nhất của cả ngành máy tính: <strong>làm cho trường hợp phổ biến nhanh</strong>. Nó cũng giải thích vì sao thêm nhiều nhân CPU cho lợi ích giảm dần — phần chương trình không chạy song song được trở thành trần.</div>
</div>
`,
        },
        {
          title: 'Chapter 2 Quiz|||Quiz chương 2',
          slug: 'cea201-quiz-ch2',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: lịch sử, Moore, thước đo hiệu năng, Amdahl.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Which technology defined the FIRST generation of computers?|||Công nghệ nào định nghĩa thế hệ máy tính ĐẦU TIÊN?', options: ['Transistors|||Transistor', 'Integrated circuits|||Vi mạch tích hợp', 'Vacuum tubes|||Đèn chân không', 'Microprocessors|||Vi xử lý'], correctIndex: 2, points: 1 },
              { question: 'Moore\'s law states that transistors per chip…|||Định luật Moore nói số transistor trên chip…', options: ['halve every year|||giảm nửa mỗi năm', 'roughly double about every two years|||tăng gấp đôi khoảng mỗi hai năm', 'stay constant|||không đổi', 'grow only with clock speed|||chỉ tăng theo clock'], correctIndex: 1, points: 1 },
              { question: 'CPI stands for…|||CPI là viết tắt của…', options: ['Chips Per Inch', 'Cycles Per Instruction|||Chu kỳ trên mỗi lệnh', 'Cost Per Instruction', 'Cache Per Instruction'], correctIndex: 1, points: 1 },
              { question: 'CPU time equals…|||Thời gian CPU bằng…', options: ['clock speed only|||chỉ tốc độ clock', 'Instruction count × CPI × Clock cycle time|||Số lệnh × CPI × Thời gian một chu kỳ', 'MIPS × cache size|||MIPS × kích thước cache', 'transistors × voltage|||transistor × điện áp'], correctIndex: 1, points: 1 },
              { question: 'Amdahl\'s law tells us to…|||Định luật Amdahl bảo ta…', options: ['always raise the clock speed|||luôn tăng tốc độ clock', 'optimize the part that takes the most time|||tối ưu phần tốn nhiều thời gian nhất', 'add as many cores as possible|||thêm càng nhiều nhân càng tốt', 'ignore bottlenecks|||bỏ qua điểm nghẽn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — CÁI NHÌN TỔNG THỂ & KẾT NỐI ══════════════════ */
    {
      title: 'Chapter 3 — Top-Level View & Interconnection|||Chương 3 — Cái nhìn tổng thể & Kết nối',
      description: 'Các thành phần chính, chu trình lệnh và cấu trúc bus nối chúng.',
      lessons: [
        {
          title: '3.1 — Components & the instruction cycle|||3.1 — Thành phần & chu trình lệnh',
          slug: 'cea201-3-1-components-cycle',
          type: 'VIDEO',
          description: 'Ba thành phần chính và vòng lặp fetch–execute có thêm ngắt.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>The top-level components</h2>
<p class="lead">At the highest level (CLO4), a computer is three components plus the wiring between them: the <strong>CPU</strong>, <strong>Main Memory</strong>, and <strong>I/O</strong>, connected by the <strong>system bus</strong>.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">CPU</div><div class="lz-nbody"><div class="lz-ntitle">Processor</div><div class="lz-nsub">Fetches and executes instructions</div></div></div>
  <div class="lz-node"><div class="lz-badge">MEM</div><div class="lz-nbody"><div class="lz-ntitle">Main memory</div><div class="lz-nsub">Holds instructions and data</div></div></div>
  <div class="lz-node"><div class="lz-badge">I/O</div><div class="lz-nbody"><div class="lz-ntitle">Input/Output</div><div class="lz-nsub">Moves data to/from the outside</div></div></div>
</div>
<h3>The instruction cycle — with interrupts</h3>
<p>The CPU repeats a basic <strong>fetch–execute</strong> cycle: fetch the next instruction (using the Program Counter), then execute it. Stallings adds a crucial real-world stage: after each execute, the CPU checks for <strong>interrupts</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Fetch</div><div class="lz-t">read instruction</div><div class="lz-d">PC points to it</div></div>
  <div class="lz-step"><div class="lz-k">Execute</div><div class="lz-t">carry it out</div><div class="lz-d">ALU / memory / branch</div></div>
  <div class="lz-step"><div class="lz-k">Interrupt?</div><div class="lz-t">check &amp; handle</div><div class="lz-d">respond to devices/events</div></div>
</div>
<p>An <strong>interrupt</strong> lets a slow device (or a timer, or an error) signal the CPU asynchronously. The CPU pauses, saves its state, runs an <em>interrupt handler</em>, then resumes — this is what makes responsive, multitasking systems possible.</p>
<div class="note-ct">You met fetch–execute in CSI104; here it is formalized with the interrupt check that real machines need. Interrupts reappear in Chapter 7 (I/O) and Chapter 8 (OS support) — they are how hardware and software cooperate.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Các thành phần mức cao nhất</h2>
<p class="lead">Ở mức cao nhất (CLO4), một máy tính là ba thành phần cộng với dây nối giữa chúng: <strong>CPU</strong>, <strong>Bộ nhớ chính</strong>, và <strong>I/O</strong>, nối bằng <strong>bus hệ thống</strong>.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">CPU</div><div class="lz-nbody"><div class="lz-ntitle">Bộ xử lý</div><div class="lz-nsub">Nạp và thực thi lệnh</div></div></div>
  <div class="lz-node"><div class="lz-badge">MEM</div><div class="lz-nbody"><div class="lz-ntitle">Bộ nhớ chính</div><div class="lz-nsub">Giữ lệnh và dữ liệu</div></div></div>
  <div class="lz-node"><div class="lz-badge">I/O</div><div class="lz-nbody"><div class="lz-ntitle">Nhập/Xuất</div><div class="lz-nsub">Chuyển dữ liệu ra/vào bên ngoài</div></div></div>
</div>
<h3>Chu trình lệnh — có thêm ngắt</h3>
<p>CPU lặp một chu trình cơ bản <strong>nạp–thực thi (fetch–execute)</strong>: nạp lệnh kế (dùng Program Counter), rồi thực thi. Stallings thêm một bước quan trọng thực tế: sau mỗi lần thực thi, CPU kiểm tra <strong>ngắt (interrupt)</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nạp</div><div class="lz-t">đọc lệnh</div><div class="lz-d">PC trỏ tới nó</div></div>
  <div class="lz-step"><div class="lz-k">Thực thi</div><div class="lz-t">thực hiện</div><div class="lz-d">ALU / bộ nhớ / nhảy</div></div>
  <div class="lz-step"><div class="lz-k">Ngắt?</div><div class="lz-t">kiểm &amp; xử lý</div><div class="lz-d">đáp ứng thiết bị/sự kiện</div></div>
</div>
<p>Một <strong>ngắt</strong> cho một thiết bị chậm (hoặc timer, hoặc lỗi) báo cho CPU một cách bất đồng bộ. CPU tạm dừng, lưu trạng thái, chạy một <em>trình xử lý ngắt</em>, rồi tiếp tục — đây là thứ làm nên hệ thống phản hồi nhanh, đa nhiệm.</p>
<div class="note-ct">Bạn đã gặp nạp–thực thi ở CSI104; ở đây nó được hình thức hoá với bước kiểm ngắt mà máy thật cần. Ngắt trở lại ở Chương 7 (I/O) và Chương 8 (hỗ trợ OS) — đó là cách phần cứng và phần mềm hợp tác.</div>
</div>
`,
        },
        {
          title: '3.2 — The bus & interconnection|||3.2 — Bus & kết nối',
          slug: 'cea201-3-2-bus',
          type: 'VIDEO',
          description: 'Ba loại đường bus và vì sao bus đơn trở thành điểm nghẽn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>How components talk — the bus</h2>
<p class="lead">A <strong>bus</strong> is a shared set of wires connecting the CPU, memory and I/O so they can exchange data. "Shared" is the key word: only one transfer can use the bus at a time. A system bus carries three kinds of signal.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Data bus</div><div class="lz-ld">Carries the actual data. Its width (e.g. 32 or 64 lines) sets how many bits move at once — a key performance factor.</div></div>
  <div class="lz-layer"><div class="lz-lt">Address bus</div><div class="lz-ld">Carries which memory/I/O location is targeted. Its width sets how much memory can be addressed (n lines → 2ⁿ locations).</div></div>
  <div class="lz-layer"><div class="lz-lt">Control bus</div><div class="lz-ld">Carries commands and timing: memory read/write, I/O read/write, interrupt signals, clock.</div></div>
</div>
<h3>Why a single bus becomes a bottleneck</h3>
<p>Because every device shares one bus, they compete for it — and the bus can only go as fast as its slowest participant. As CPUs got much faster than devices, a single bus throttled everything.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Problem</div><div class="lz-t">one shared bus</div><div class="lz-d">contention + speed mismatch</div></div>
  <div class="lz-step"><div class="lz-k">Fix</div><div class="lz-t">multiple bus layers</div><div class="lz-d">fast bus near CPU, slower for I/O</div></div>
  <div class="lz-step"><div class="lz-k">Modern</div><div class="lz-t">point-to-point links</div><div class="lz-d">PCIe: dedicated high-speed lanes</div></div>
</div>
<div class="note-ct">Modern systems replaced the single shared bus with hierarchies and dedicated point-to-point links (like PCI Express) precisely to remove this bottleneck — a direct application of "find and fix the bottleneck" from Amdahl&#39;s law.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Các thành phần nói chuyện thế nào — bus</h2>
<p class="lead">Một <strong>bus</strong> là một bộ dây dùng chung nối CPU, bộ nhớ và I/O để chúng trao đổi dữ liệu. "Dùng chung" là từ khoá: chỉ một lần truyền được dùng bus tại một thời điểm. Một bus hệ thống mang ba loại tín hiệu.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Bus dữ liệu (data bus)</div><div class="lz-ld">Mang dữ liệu thực. Độ rộng của nó (vd 32 hay 64 đường) quyết định bao nhiêu bit chuyển cùng lúc — một yếu tố hiệu năng then chốt.</div></div>
  <div class="lz-layer"><div class="lz-lt">Bus địa chỉ (address bus)</div><div class="lz-ld">Mang vị trí bộ nhớ/I/O được nhắm tới. Độ rộng quyết định địa chỉ được bao nhiêu bộ nhớ (n đường → 2ⁿ vị trí).</div></div>
  <div class="lz-layer"><div class="lz-lt">Bus điều khiển (control bus)</div><div class="lz-ld">Mang lệnh và định thời: đọc/ghi bộ nhớ, đọc/ghi I/O, tín hiệu ngắt, clock.</div></div>
</div>
<h3>Vì sao bus đơn trở thành điểm nghẽn</h3>
<p>Vì mọi thiết bị dùng chung một bus, chúng tranh nhau — và bus chỉ nhanh bằng thành phần chậm nhất. Khi CPU nhanh hơn thiết bị nhiều, một bus đơn bóp nghẹt tất cả.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Vấn đề</div><div class="lz-t">một bus dùng chung</div><div class="lz-d">tranh chấp + lệch tốc độ</div></div>
  <div class="lz-step"><div class="lz-k">Cách sửa</div><div class="lz-t">nhiều tầng bus</div><div class="lz-d">bus nhanh gần CPU, chậm cho I/O</div></div>
  <div class="lz-step"><div class="lz-k">Hiện đại</div><div class="lz-t">liên kết điểm-điểm</div><div class="lz-d">PCIe: làn tốc độ cao riêng</div></div>
</div>
<div class="note-ct">Hệ thống hiện đại thay bus dùng chung đơn bằng phân cấp và liên kết điểm-điểm riêng (như PCI Express) chính là để loại điểm nghẽn này — một ứng dụng trực tiếp của "tìm và sửa điểm nghẽn" từ định luật Amdahl.</div>
</div>
`,
        },
        {
          title: 'Chapter 3 Quiz|||Quiz chương 3',
          slug: 'cea201-quiz-ch3',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: thành phần, chu trình lệnh, ngắt, bus.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The three top-level components of a computer are…|||Ba thành phần mức cao nhất của máy tính là…', options: ['CPU, cache, disk|||CPU, cache, đĩa', 'CPU, main memory, I/O|||CPU, bộ nhớ chính, I/O', 'ALU, registers, bus|||ALU, thanh ghi, bus', 'keyboard, screen, printer|||bàn phím, màn hình, máy in'], correctIndex: 1, points: 1 },
              { question: 'What does an interrupt allow the CPU to do?|||Ngắt cho phép CPU làm gì?', options: ['run faster clocks|||chạy clock nhanh hơn', 'respond to devices/events asynchronously|||đáp ứng thiết bị/sự kiện bất đồng bộ', 'store more data|||lưu nhiều dữ liệu hơn', 'skip the fetch stage|||bỏ bước nạp'], correctIndex: 1, points: 1 },
              { question: 'The width of the ADDRESS bus determines…|||Độ rộng bus ĐỊA CHỈ quyết định…', options: ['how many bits of data move at once|||bao nhiêu bit dữ liệu chuyển cùng lúc', 'how much memory can be addressed|||địa chỉ được bao nhiêu bộ nhớ', 'the clock speed|||tốc độ clock', 'the cache size|||kích thước cache'], correctIndex: 1, points: 1 },
              { question: 'Which signals travel on the control bus?|||Tín hiệu nào đi trên bus điều khiển?', options: ['the actual data|||dữ liệu thực', 'memory location numbers|||số vị trí bộ nhớ', 'read/write commands and timing|||lệnh đọc/ghi và định thời', 'pixel colors|||màu pixel'], correctIndex: 2, points: 1 },
              { question: 'A single shared bus becomes a bottleneck because…|||Một bus dùng chung đơn thành điểm nghẽn vì…', options: ['it is too short|||nó quá ngắn', 'only one transfer can use it at a time|||chỉ một lần truyền dùng nó tại một thời điểm', 'it has no address lines|||nó không có đường địa chỉ', 'it cannot carry control signals|||nó không mang được tín hiệu điều khiển'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — BỘ NHỚ CACHE ══════════════════ */
    {
      title: 'Chapter 4 — Cache Memory|||Chương 4 — Bộ nhớ Cache',
      description: 'Tính cục bộ, nguyên lý cache, các cách ánh xạ và chính sách thay thế.',
      lessons: [
        {
          title: '4.1 — Locality & the cache principle|||4.1 — Tính cục bộ & nguyên lý cache',
          slug: 'cea201-4-1-locality',
          type: 'VIDEO',
          description: 'Vì sao một bộ nhớ nhỏ nhanh lại giúp cả hệ nhanh lên rõ rệt.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>The memory hierarchy problem, solved by cache</h2>
<p class="lead">The CPU is far faster than main memory (RAM). Cache (CLO4) is a small, very fast memory between them that keeps copies of recently used data — turning most memory requests into fast hits. It works because of a deep property of programs called <strong>locality of reference</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Temporal locality</div><div class="lz-ld">If you used a piece of data recently, you will probably use it again soon (e.g. a loop counter).</div></div>
  <div class="lz-layer"><div class="lz-lt">Spatial locality</div><div class="lz-ld">If you used one location, you will probably use nearby ones soon (e.g. array elements in order).</div></div>
</div>
<p>Because programs behave this way, keeping recently and nearby data in a small fast cache satisfies most requests without touching slow RAM.</p>
<h3>Hit, miss, and blocks</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Request</div><div class="lz-t">CPU needs address X</div><div class="lz-d">check cache first</div></div>
  <div class="lz-step"><div class="lz-k">Hit</div><div class="lz-t">X is in cache</div><div class="lz-d">fast — done</div></div>
  <div class="lz-step"><div class="lz-k">Miss</div><div class="lz-t">X not in cache</div><div class="lz-d">fetch a whole BLOCK from RAM</div></div>
</div>
<p>On a miss, the cache loads not just X but a whole <strong>block</strong> (line) of neighboring bytes — exploiting spatial locality so the next few accesses hit. The <strong>hit ratio</strong> (fraction of accesses found in cache) is the key performance number; real caches achieve 90%+.</p>
<div class="note-ct">Modern CPUs stack multiple cache levels (L1, L2, L3), each bigger and slower than the last — a mini memory hierarchy inside the chip. This is why writing cache-friendly code (accessing arrays in order) can make programs several times faster with no algorithm change.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture#module-575" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Feel cache in real code</span><span class="lc-sub">The C "Performance &amp; Cache-Conscious Programming" module shows locality speedups you can measure.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Bài toán phân cấp bộ nhớ, giải bằng cache</h2>
<p class="lead">CPU nhanh hơn bộ nhớ chính (RAM) rất nhiều. Cache (CLO4) là một bộ nhớ nhỏ, rất nhanh nằm giữa chúng, giữ bản sao dữ liệu vừa dùng — biến hầu hết yêu cầu bộ nhớ thành hit nhanh. Nó hiệu quả nhờ một tính chất sâu của chương trình gọi là <strong>tính cục bộ tham chiếu (locality of reference)</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Cục bộ thời gian</div><div class="lz-ld">Nếu bạn vừa dùng một dữ liệu, bạn có lẽ sẽ dùng lại nó sớm (vd biến đếm vòng lặp).</div></div>
  <div class="lz-layer"><div class="lz-lt">Cục bộ không gian</div><div class="lz-ld">Nếu bạn dùng một vị trí, bạn có lẽ sẽ dùng các vị trí lân cận sớm (vd phần tử mảng theo thứ tự).</div></div>
</div>
<p>Vì chương trình hành xử như vậy, giữ dữ liệu vừa dùng và lân cận trong một cache nhỏ nhanh đáp ứng được hầu hết yêu cầu mà không đụng RAM chậm.</p>
<h3>Hit, miss, và block</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Yêu cầu</div><div class="lz-t">CPU cần địa chỉ X</div><div class="lz-d">kiểm cache trước</div></div>
  <div class="lz-step"><div class="lz-k">Hit (trúng)</div><div class="lz-t">X có trong cache</div><div class="lz-d">nhanh — xong</div></div>
  <div class="lz-step"><div class="lz-k">Miss (trượt)</div><div class="lz-t">X không có trong cache</div><div class="lz-d">nạp cả một BLOCK từ RAM</div></div>
</div>
<p>Khi miss, cache nạp không chỉ X mà cả một <strong>block</strong> (dòng) byte lân cận — tận dụng cục bộ không gian để vài truy cập kế tiếp trúng. <strong>Tỷ lệ hit</strong> (phần truy cập tìm thấy trong cache) là con số hiệu năng then chốt; cache thật đạt 90%+.</p>
<div class="note-ct">CPU hiện đại xếp nhiều mức cache (L1, L2, L3), mỗi mức lớn hơn và chậm hơn mức trước — một phân cấp bộ nhớ mini bên trong chip. Đây là lý do viết code thân thiện cache (truy cập mảng theo thứ tự) có thể làm chương trình nhanh gấp mấy lần mà không đổi thuật toán.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture#module-575" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Cảm nhận cache trong code thật</span><span class="lc-sub">Module C "Performance &amp; Cache-Conscious Programming" cho thấy tăng tốc nhờ locality mà bạn đo được.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '4.2 — Cache mapping & replacement|||4.2 — Ánh xạ cache & thay thế',
          slug: 'cea201-4-2-mapping',
          type: 'VIDEO',
          description: 'Direct, associative, set-associative và cách chọn dòng để thay.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Where does a memory block go in the cache?</h2>
<p class="lead">Cache is much smaller than RAM, so many memory blocks must share cache slots. The <strong>mapping function</strong> decides which cache line a block can occupy — a classic trade-off between speed and flexibility.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Direct mapping</div><div class="lz-ld">Each block maps to exactly one fixed line (block number mod number of lines). Simple &amp; fast to check, but two hot blocks that map to the same line keep evicting each other (conflict misses).</div></div>
  <div class="lz-layer"><div class="lz-lt">Fully associative</div><div class="lz-ld">A block can go in any line. No conflict misses, but checking all lines is expensive hardware.</div></div>
  <div class="lz-layer"><div class="lz-lt">Set-associative</div><div class="lz-ld">The compromise used in practice: lines are grouped into sets; a block maps to one set but any line within it (e.g. 4-way = 4 choices). Most of the flexibility, affordable to check.</div></div>
</div>
<h3>Replacement policy</h3>
<p>When a set is full and a new block arrives, which existing line is evicted? Common policy: <strong>LRU (Least Recently Used)</strong> — throw out the line unused for the longest, betting on temporal locality. (Direct mapping needs no policy — there is only one choice.)</p>
<h3>Write policy</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Write-through</div><div class="lz-t">update cache + RAM</div><div class="lz-d">simple, always consistent, slower</div></div>
  <div class="lz-step"><div class="lz-k">Write-back</div><div class="lz-t">update cache only</div><div class="lz-d">write to RAM later; faster, needs a dirty bit</div></div>
</div>
<div class="note-ct">Exam framing: direct = fast but rigid; associative = flexible but costly; set-associative = the practical middle ground. This "simple-vs-flexible" tension repeats everywhere in architecture. Try the ParaCacheSimulator (Exp Hub) to watch hits, misses and evictions happen.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Một block bộ nhớ nằm ở đâu trong cache?</h2>
<p class="lead">Cache nhỏ hơn RAM rất nhiều, nên nhiều block bộ nhớ phải chia sẻ các ô cache. <strong>Hàm ánh xạ (mapping)</strong> quyết định một block được nằm ở dòng cache nào — một đánh đổi kinh điển giữa tốc độ và linh hoạt.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Ánh xạ trực tiếp (direct)</div><div class="lz-ld">Mỗi block ánh xạ tới đúng một dòng cố định (số block mod số dòng). Đơn giản &amp; kiểm nhanh, nhưng hai block "nóng" ánh xạ cùng dòng cứ đẩy nhau ra (conflict miss).</div></div>
  <div class="lz-layer"><div class="lz-lt">Kết hợp đầy đủ (fully associative)</div><div class="lz-ld">Một block nằm ở dòng nào cũng được. Không có conflict miss, nhưng kiểm mọi dòng là phần cứng tốn kém.</div></div>
  <div class="lz-layer"><div class="lz-lt">Kết hợp theo tập (set-associative)</div><div class="lz-ld">Dung hoà, dùng trong thực tế: dòng gom thành các set; một block ánh xạ tới một set nhưng dòng nào trong đó cũng được (vd 4-way = 4 lựa chọn). Đa số sự linh hoạt, kiểm được với giá phải chăng.</div></div>
</div>
<h3>Chính sách thay thế</h3>
<p>Khi một set đầy và một block mới tới, dòng hiện có nào bị đẩy ra? Chính sách phổ biến: <strong>LRU (Least Recently Used — ít dùng gần đây nhất)</strong> — bỏ dòng lâu không dùng nhất, đặt cược vào cục bộ thời gian. (Ánh xạ trực tiếp không cần chính sách — chỉ có một lựa chọn.)</p>
<h3>Chính sách ghi</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Write-through</div><div class="lz-t">cập nhật cache + RAM</div><div class="lz-d">đơn giản, luôn nhất quán, chậm hơn</div></div>
  <div class="lz-step"><div class="lz-k">Write-back</div><div class="lz-t">chỉ cập nhật cache</div><div class="lz-d">ghi RAM sau; nhanh hơn, cần bit "dirty"</div></div>
</div>
<div class="note-ct">Khung thi: direct = nhanh nhưng cứng; associative = linh hoạt nhưng tốn; set-associative = trung gian thực tế. Căng thẳng "đơn giản-vs-linh hoạt" này lặp lại khắp kiến trúc. Thử ParaCacheSimulator (Exp Hub) để xem hit, miss và eviction diễn ra.</div>
</div>
`,
        },
        {
          title: 'Chapter 4 Quiz|||Quiz chương 4',
          slug: 'cea201-quiz-ch4',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: locality, hit/miss, mapping, thay thế.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Cache works because programs exhibit…|||Cache hiệu quả vì chương trình thể hiện…', options: ['randomness|||tính ngẫu nhiên', 'locality of reference|||tính cục bộ tham chiếu', 'infinite loops|||vòng lặp vô hạn', 'compilation|||biên dịch'], correctIndex: 1, points: 1 },
              { question: 'Reusing a loop counter many times is an example of…|||Dùng lại một biến đếm vòng lặp nhiều lần là ví dụ của…', options: ['spatial locality|||cục bộ không gian', 'temporal locality|||cục bộ thời gian', 'a cache miss|||một cache miss', 'write-back'], correctIndex: 1, points: 1 },
              { question: 'On a cache MISS, the cache loads…|||Khi cache MISS, cache nạp…', options: ['only the single byte requested|||chỉ đúng một byte được yêu cầu', 'a whole block of neighboring bytes|||cả một block byte lân cận', 'the entire RAM|||toàn bộ RAM', 'nothing|||không gì'], correctIndex: 1, points: 1 },
              { question: 'Which mapping is the practical compromise used in real CPUs?|||Ánh xạ nào là dung hoà thực tế dùng trong CPU thật?', options: ['Direct mapping|||Ánh xạ trực tiếp', 'Fully associative|||Kết hợp đầy đủ', 'Set-associative|||Kết hợp theo tập', 'No mapping|||Không ánh xạ'], correctIndex: 2, points: 1 },
              { question: 'The LRU replacement policy evicts the line that is…|||Chính sách thay thế LRU đẩy ra dòng…', options: ['most recently used|||dùng gần đây nhất', 'least recently used|||ít dùng gần đây nhất', 'largest|||lớn nhất', 'first loaded|||nạp đầu tiên'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — BỘ NHỚ TRONG ══════════════════ */
    {
      title: 'Chapter 5 — Internal Memory|||Chương 5 — Bộ nhớ trong',
      description: 'RAM/ROM, khác biệt DRAM vs SRAM và ý niệm sửa lỗi bộ nhớ.',
      lessons: [
        {
          title: '5.1 — RAM, ROM, DRAM vs SRAM|||5.1 — RAM, ROM, DRAM vs SRAM',
          slug: 'cea201-5-1-ram-rom',
          type: 'VIDEO',
          description: 'Các loại bộ nhớ bán dẫn và vì sao có cả DRAM lẫn SRAM.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>The main memory technologies</h2>
<p class="lead">Internal (main) memory is built from semiconductor chips (CLO4). The two big families are RAM (read-write, volatile) and ROM (read-mostly, non-volatile).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">RAM — Random Access Memory</div><div class="lz-ld">Read and written freely; volatile (lost on power-off). This is your working memory.</div></div>
  <div class="lz-layer"><div class="lz-lt">ROM — Read-Only Memory</div><div class="lz-ld">Non-volatile, keeps its contents without power. Holds firmware like the BIOS. Variants: PROM, EPROM, EEPROM (erasable), and flash.</div></div>
</div>
<h3>DRAM vs SRAM — two kinds of RAM</h3>
<table>
  <thead><tr><th></th><th>DRAM (Dynamic)</th><th>SRAM (Static)</th></tr></thead>
  <tbody>
    <tr><td>Stores a bit with</td><td>A tiny capacitor (charge)</td><td>A flip-flop (transistors)</td></tr>
    <tr><td>Needs refreshing?</td><td>Yes — charge leaks, must be topped up</td><td>No — holds while powered</td></tr>
    <tr><td>Density &amp; cost</td><td>Dense &amp; cheap per bit</td><td>Less dense, expensive</td></tr>
    <tr><td>Speed</td><td>Slower</td><td>Faster</td></tr>
    <tr><td>Used for</td><td>Main memory (lots of it)</td><td>Cache (small &amp; fast)</td></tr>
  </tbody>
</table>
<div class="callout ok">The reason your PC has "16 GB of RAM" (DRAM) but only megabytes of cache (SRAM): DRAM is cheap and dense so you can have a lot; SRAM is fast but costly so you use a little where speed matters most. Same trade-off triangle again — fast, big, cheap: pick two.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Các công nghệ bộ nhớ chính</h2>
<p class="lead">Bộ nhớ trong (chính) được xây từ chip bán dẫn (CLO4). Hai họ lớn là RAM (đọc-ghi, bay hơi) và ROM (chủ yếu đọc, không bay hơi).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">RAM — Bộ nhớ truy cập ngẫu nhiên</div><div class="lz-ld">Đọc và ghi tự do; bay hơi (mất khi tắt điện). Đây là bộ nhớ làm việc của bạn.</div></div>
  <div class="lz-layer"><div class="lz-lt">ROM — Bộ nhớ chỉ đọc</div><div class="lz-ld">Không bay hơi, giữ nội dung không cần điện. Chứa firmware như BIOS. Biến thể: PROM, EPROM, EEPROM (xoá được), và flash.</div></div>
</div>
<h3>DRAM vs SRAM — hai loại RAM</h3>
<table>
  <thead><tr><th></th><th>DRAM (Động)</th><th>SRAM (Tĩnh)</th></tr></thead>
  <tbody>
    <tr><td>Lưu một bit bằng</td><td>Một tụ điện tí hon (điện tích)</td><td>Một flip-flop (transistor)</td></tr>
    <tr><td>Cần làm tươi (refresh)?</td><td>Có — điện tích rò, phải nạp lại</td><td>Không — giữ khi còn điện</td></tr>
    <tr><td>Mật độ &amp; giá</td><td>Dày &amp; rẻ trên mỗi bit</td><td>Ít dày hơn, đắt</td></tr>
    <tr><td>Tốc độ</td><td>Chậm hơn</td><td>Nhanh hơn</td></tr>
    <tr><td>Dùng cho</td><td>Bộ nhớ chính (rất nhiều)</td><td>Cache (nhỏ &amp; nhanh)</td></tr>
  </tbody>
</table>
<div class="callout ok">Lý do PC của bạn có "16 GB RAM" (DRAM) nhưng chỉ vài megabyte cache (SRAM): DRAM rẻ và dày nên có nhiều; SRAM nhanh nhưng đắt nên chỉ dùng một ít ở nơi tốc độ quan trọng nhất. Lại chính tam giác đánh đổi — nhanh, lớn, rẻ: chọn hai.</div>
</div>
`,
        },
        {
          title: '5.2 — Memory organization & error correction|||5.2 — Tổ chức bộ nhớ & sửa lỗi',
          slug: 'cea201-5-2-error-correction',
          type: 'VIDEO',
          description: 'Cách ghép chip thành module và bit chẵn lẻ / ECC bắt lỗi ra sao.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>From chips to memory modules</h2>
<p class="lead">A single chip stores a limited number of bits, so memory is built by combining many chips into <strong>modules</strong> (like the DIMM sticks in a PC). Chips are wired so that together they provide the full word width and address range the CPU expects.</p>
<h3>Errors happen — and can be caught</h3>
<p>Memory is physical, so bits occasionally flip (cosmic rays, electrical noise, wear). Systems detect and even correct this with extra bits computed from the data.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Parity bit — detect 1-bit errors</div><div class="lz-ld">One extra bit makes the total number of 1s even (or odd). If a single bit flips, the parity no longer matches → error detected (but not corrected).</div></div>
  <div class="lz-layer"><div class="lz-lt">ECC (Error-Correcting Code) — Hamming codes</div><div class="lz-ld">Several extra bits let the system not only detect but pinpoint and correct a single-bit error automatically. Used in servers where reliability matters.</div></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Store</div><div class="lz-t">data + check bits</div><div class="lz-d">computed from the data</div></div>
  <div class="lz-step"><div class="lz-k">Read</div><div class="lz-t">recompute check</div><div class="lz-d">compare with stored</div></div>
  <div class="lz-step"><div class="lz-k">Mismatch</div><div class="lz-t">locate &amp; fix the bit</div><div class="lz-d">ECC corrects automatically</div></div>
</div>
<div class="note-ct">The idea of adding redundant bits to detect/correct errors reappears everywhere: RAID disks (Chapter 6), network packets, QR codes. It is the same principle — trade a little extra storage for reliability. Servers use ECC RAM precisely because a silent bit-flip in a bank or hospital system is unacceptable.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Từ chip tới module bộ nhớ</h2>
<p class="lead">Một chip đơn lưu số bit hạn chế, nên bộ nhớ được xây bằng cách ghép nhiều chip thành <strong>module</strong> (như thanh DIMM trong PC). Các chip được đấu để cùng nhau cung cấp đủ độ rộng từ và dải địa chỉ mà CPU mong đợi.</p>
<h3>Lỗi có xảy ra — và có thể bắt được</h3>
<p>Bộ nhớ là vật lý, nên thi thoảng bit bị lật (tia vũ trụ, nhiễu điện, hao mòn). Hệ thống phát hiện và thậm chí sửa điều này bằng các bit thêm tính từ dữ liệu.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Bit chẵn lẻ (parity) — phát hiện lỗi 1 bit</div><div class="lz-ld">Một bit thêm làm tổng số bit 1 thành chẵn (hoặc lẻ). Nếu một bit lật, parity không còn khớp → phát hiện lỗi (nhưng không sửa).</div></div>
  <div class="lz-layer"><div class="lz-lt">ECC (Mã sửa lỗi) — mã Hamming</div><div class="lz-ld">Vài bit thêm cho hệ thống không chỉ phát hiện mà xác định vị trí và sửa tự động một lỗi 1 bit. Dùng trong máy chủ nơi độ tin cậy quan trọng.</div></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Lưu</div><div class="lz-t">dữ liệu + bit kiểm</div><div class="lz-d">tính từ dữ liệu</div></div>
  <div class="lz-step"><div class="lz-k">Đọc</div><div class="lz-t">tính lại bit kiểm</div><div class="lz-d">so với bản đã lưu</div></div>
  <div class="lz-step"><div class="lz-k">Lệch</div><div class="lz-t">định vị &amp; sửa bit</div><div class="lz-d">ECC sửa tự động</div></div>
</div>
<div class="note-ct">Ý tưởng thêm bit dư để phát hiện/sửa lỗi xuất hiện khắp nơi: đĩa RAID (Chương 6), gói mạng, mã QR. Vẫn nguyên lý đó — đổi một ít lưu trữ thêm lấy độ tin cậy. Máy chủ dùng RAM ECC chính vì một lỗi lật bit im lặng trong hệ thống ngân hàng hay bệnh viện là không chấp nhận được.</div>
</div>
`,
        },
        {
          title: 'Chapter 5 Quiz|||Quiz chương 5',
          slug: 'cea201-quiz-ch5',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: RAM/ROM, DRAM vs SRAM, parity/ECC.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Which memory keeps its contents WITHOUT power?|||Bộ nhớ nào giữ nội dung KHÔNG cần điện?', options: ['DRAM', 'SRAM', 'ROM', 'Cache'], correctIndex: 2, points: 1 },
              { question: 'DRAM stores each bit using…|||DRAM lưu mỗi bit bằng…', options: ['a flip-flop|||một flip-flop', 'a tiny capacitor that needs refreshing|||một tụ điện tí hon cần làm tươi', 'a magnetic domain|||một miền từ', 'a light pulse|||một xung ánh sáng'], correctIndex: 1, points: 1 },
              { question: 'Why is SRAM used for cache rather than main memory?|||Vì sao SRAM dùng cho cache thay vì bộ nhớ chính?', options: ['it is cheaper|||nó rẻ hơn', 'it is faster (but costlier and less dense)|||nó nhanh hơn (nhưng đắt và ít dày hơn)', 'it is non-volatile|||nó không bay hơi', 'it needs refreshing|||nó cần làm tươi'], correctIndex: 1, points: 1 },
              { question: 'A single parity bit can…|||Một bit chẵn lẻ có thể…', options: ['detect a single-bit error but not correct it|||phát hiện lỗi một bit nhưng không sửa', 'correct any error|||sửa mọi lỗi', 'double the memory|||tăng gấp đôi bộ nhớ', 'speed up reads|||tăng tốc đọc'], correctIndex: 0, points: 1 },
              { question: 'ECC memory can…|||Bộ nhớ ECC có thể…', options: ['only store more data|||chỉ lưu nhiều dữ liệu hơn', 'detect AND automatically correct a single-bit error|||phát hiện VÀ tự động sửa một lỗi bit', 'run without power|||chạy không cần điện', 'replace the CPU|||thay CPU'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 6 — BỘ NHỚ NGOÀI ══════════════════ */
    {
      title: 'Chapter 6 — External Memory|||Chương 6 — Bộ nhớ ngoài',
      description: 'Đĩa từ, RAID, ổ thể rắn (SSD/flash) và đĩa quang.',
      lessons: [
        {
          title: '6.1 — Magnetic disk & how it stores data|||6.1 — Đĩa từ & cách lưu dữ liệu',
          slug: 'cea201-6-1-magnetic-disk',
          type: 'VIDEO',
          description: 'Cấu tạo đĩa cứng và vì sao truy cập đĩa chậm hơn RAM nhiều.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Permanent storage — the hard disk</h2>
<p class="lead">External (secondary) memory (CLO4) is non-volatile and huge, but far slower than RAM. The classic device is the <strong>magnetic hard disk</strong>, which stores bits as magnetized spots on spinning platters.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Platters &amp; tracks</div><div class="lz-ld">Data lives on concentric circles (tracks) on spinning platters, divided into sectors (blocks).</div></div>
  <div class="lz-layer"><div class="lz-lt">Read/write head</div><div class="lz-ld">An arm moves a head across the platter to reach the right track, while the platter spins to bring the right sector under it.</div></div>
</div>
<h3>Why disk access is slow</h3>
<p>Reaching data on a spinning disk takes mechanical movement, which dominates the time:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Seek time</div><div class="lz-t">move the head</div><div class="lz-d">to the right track</div></div>
  <div class="lz-step"><div class="lz-k">Rotational delay</div><div class="lz-t">wait for spin</div><div class="lz-d">right sector rotates under head</div></div>
  <div class="lz-step"><div class="lz-k">Transfer time</div><div class="lz-t">read the data</div><div class="lz-d">once positioned</div></div>
</div>
<p>Seek and rotation are measured in <em>milliseconds</em> — millions of times slower than the CPU&#39;s nanoseconds. This enormous gap is exactly why we have RAM caching disk, and cache caching RAM: the whole memory hierarchy exists to hide slow storage.</p>
<div class="note-ct">This mechanical latency is why programs feel slow when they "hit the disk" (loading, swapping) and fast when data is already in RAM. It is also why SSDs (next lesson), with no moving parts, transformed computing.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Lưu trữ lâu dài — đĩa cứng</h2>
<p class="lead">Bộ nhớ ngoài (thứ cấp) (CLO4) không bay hơi và rất lớn, nhưng chậm hơn RAM nhiều. Thiết bị kinh điển là <strong>đĩa cứng từ</strong>, lưu bit dưới dạng các điểm từ hoá trên các đĩa quay.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Đĩa (platter) &amp; track</div><div class="lz-ld">Dữ liệu nằm trên các vòng tròn đồng tâm (track) trên đĩa quay, chia thành sector (block).</div></div>
  <div class="lz-layer"><div class="lz-lt">Đầu đọc/ghi</div><div class="lz-ld">Một cần di chuyển đầu đọc ngang mặt đĩa để tới đúng track, trong khi đĩa quay để đưa đúng sector xuống dưới nó.</div></div>
</div>
<h3>Vì sao truy cập đĩa chậm</h3>
<p>Tới được dữ liệu trên đĩa quay cần chuyển động cơ học, và nó chiếm phần lớn thời gian:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Seek time</div><div class="lz-t">di chuyển đầu đọc</div><div class="lz-d">tới đúng track</div></div>
  <div class="lz-step"><div class="lz-k">Trễ quay</div><div class="lz-t">chờ đĩa quay</div><div class="lz-d">đúng sector xoay xuống đầu đọc</div></div>
  <div class="lz-step"><div class="lz-k">Transfer time</div><div class="lz-t">đọc dữ liệu</div><div class="lz-d">khi đã định vị xong</div></div>
</div>
<p>Seek và quay đo bằng <em>mili-giây</em> — chậm hơn nano-giây của CPU hàng triệu lần. Khoảng cách khổng lồ này chính là lý do có RAM cache cho đĩa, và cache cache cho RAM: cả phân cấp bộ nhớ tồn tại để che lưu trữ chậm.</p>
<div class="note-ct">Độ trễ cơ học này là lý do chương trình cảm thấy chậm khi "đụng đĩa" (nạp, swap) và nhanh khi dữ liệu đã ở RAM. Nó cũng là lý do SSD (bài kế), không có bộ phận chuyển động, đã biến đổi ngành máy tính.</div>
</div>
`,
        },
        {
          title: '6.2 — RAID, SSD & optical storage|||6.2 — RAID, SSD & lưu trữ quang',
          slug: 'cea201-6-2-raid-ssd',
          type: 'VIDEO',
          description: 'Ghép nhiều đĩa cho tốc độ/an toàn, và bộ nhớ flash không cơ học.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Beyond a single disk</h2>
<h3>RAID — many disks working as one</h3>
<p><strong>RAID</strong> (Redundant Array of Independent Disks) combines multiple disks to gain <em>speed</em>, <em>reliability</em>, or both. Two core ideas power all RAID levels:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Striping (RAID 0) — speed</div><div class="lz-ld">Split data across disks so they read/write in parallel. Faster, but if any disk dies, all data is lost — no redundancy.</div></div>
  <div class="lz-layer"><div class="lz-lt">Mirroring (RAID 1) — reliability</div><div class="lz-ld">Keep an identical copy on a second disk. If one fails, the other has everything. Costs double the storage.</div></div>
  <div class="lz-layer"><div class="lz-lt">Parity (RAID 5) — the balance</div><div class="lz-ld">Stripe data plus a computed parity block across disks, so any one disk can fail and be rebuilt. Good speed + reliability without full duplication.</div></div>
</div>
<h3>SSD &amp; flash — storage with no moving parts</h3>
<p>A <strong>solid-state drive (SSD)</strong> stores data in <strong>flash memory</strong> (non-volatile semiconductor cells), with no platters or heads. No seek time, no rotation → dramatically faster and more rugged than a hard disk. The trade-off: higher cost per GB and limited write endurance per cell.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">HDD</div><div class="lz-t">mechanical, cheap, big</div><div class="lz-d">ms latency</div></div>
  <div class="lz-step"><div class="lz-k">SSD</div><div class="lz-t">flash, fast, rugged</div><div class="lz-d">µs latency, pricier</div></div>
  <div class="lz-step"><div class="lz-k">Optical</div><div class="lz-t">CD/DVD/Blu-ray</div><div class="lz-d">cheap archival, slow</div></div>
</div>
<div class="note-ct">Notice RAID reuses Chapter 5&#39;s idea: add redundancy (a parity block) to survive failure. Storage technology is a ladder of speed-vs-cost-vs-safety trade-offs — the same triangle that shaped cache and RAM.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Vượt ra ngoài một đĩa đơn</h2>
<h3>RAID — nhiều đĩa hoạt động như một</h3>
<p><strong>RAID</strong> (Mảng đĩa độc lập dư thừa) ghép nhiều đĩa để có <em>tốc độ</em>, <em>độ tin cậy</em>, hoặc cả hai. Hai ý tưởng cốt lõi tạo nên mọi mức RAID:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Striping (RAID 0) — tốc độ</div><div class="lz-ld">Chia dữ liệu ra nhiều đĩa để đọc/ghi song song. Nhanh hơn, nhưng nếu một đĩa hỏng, mất hết dữ liệu — không dư thừa.</div></div>
  <div class="lz-layer"><div class="lz-lt">Mirroring (RAID 1) — độ tin cậy</div><div class="lz-ld">Giữ bản sao y hệt trên đĩa thứ hai. Nếu một hỏng, cái kia có đủ. Tốn gấp đôi dung lượng.</div></div>
  <div class="lz-layer"><div class="lz-lt">Parity (RAID 5) — cân bằng</div><div class="lz-ld">Chia dữ liệu cộng một block parity tính toán ra nhiều đĩa, để một đĩa bất kỳ hỏng vẫn dựng lại được. Tốc độ + tin cậy tốt mà không cần nhân đôi hoàn toàn.</div></div>
</div>
<h3>SSD &amp; flash — lưu trữ không bộ phận chuyển động</h3>
<p>Một <strong>ổ thể rắn (SSD)</strong> lưu dữ liệu trong <strong>bộ nhớ flash</strong> (ô bán dẫn không bay hơi), không có đĩa hay đầu đọc. Không seek time, không quay → nhanh và bền hơn hẳn đĩa cứng. Đánh đổi: giá trên mỗi GB cao hơn và số lần ghi mỗi ô có giới hạn.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">HDD</div><div class="lz-t">cơ học, rẻ, lớn</div><div class="lz-d">độ trễ ms</div></div>
  <div class="lz-step"><div class="lz-k">SSD</div><div class="lz-t">flash, nhanh, bền</div><div class="lz-d">độ trễ µs, đắt hơn</div></div>
  <div class="lz-step"><div class="lz-k">Quang</div><div class="lz-t">CD/DVD/Blu-ray</div><div class="lz-d">lưu trữ rẻ, chậm</div></div>
</div>
<div class="note-ct">Để ý RAID tái dùng ý tưởng Chương 5: thêm dư thừa (một block parity) để sống sót khi hỏng. Công nghệ lưu trữ là một cái thang các đánh đổi tốc độ-vs-giá-vs-an toàn — cùng tam giác đã định hình cache và RAM.</div>
</div>
`,
        },
        {
          title: 'Chapter 6 Quiz|||Quiz chương 6',
          slug: 'cea201-quiz-ch6',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: đĩa từ, thời gian truy cập, RAID, SSD.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Which contributes MOST to hard-disk access time?|||Cái nào đóng góp NHIỀU NHẤT vào thời gian truy cập đĩa cứng?', options: ['transfer time|||thời gian truyền', 'mechanical seek and rotation|||seek và quay cơ học', 'the CPU clock|||clock CPU', 'the bus width|||độ rộng bus'], correctIndex: 1, points: 1 },
              { question: 'RAID 0 (striping) provides…|||RAID 0 (striping) cho…', options: ['redundancy but no speed|||dư thừa nhưng không tốc độ', 'speed but no redundancy|||tốc độ nhưng không dư thừa', 'both fully|||cả hai hoàn toàn', 'neither|||không cái nào'], correctIndex: 1, points: 1 },
              { question: 'RAID 1 (mirroring) works by…|||RAID 1 (mirroring) hoạt động bằng cách…', options: ['keeping an identical copy on another disk|||giữ bản sao y hệt trên đĩa khác', 'compressing data|||nén dữ liệu', 'encrypting data|||mã hoá dữ liệu', 'deleting old files|||xoá tệp cũ'], correctIndex: 0, points: 1 },
              { question: 'An SSD is faster than a hard disk mainly because it…|||SSD nhanh hơn đĩa cứng chủ yếu vì nó…', options: ['spins faster|||quay nhanh hơn', 'has no moving parts (no seek/rotation)|||không có bộ phận chuyển động (không seek/quay)', 'is larger|||lớn hơn', 'uses optical light|||dùng ánh sáng quang'], correctIndex: 1, points: 1 },
              { question: 'RAID 5 uses parity to…|||RAID 5 dùng parity để…', options: ['double the storage|||tăng gấp đôi dung lượng', 'survive a single disk failure and rebuild it|||sống sót khi một đĩa hỏng và dựng lại nó', 'speed up the CPU|||tăng tốc CPU', 'encrypt the array|||mã hoá mảng đĩa'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 7 — NHẬP/XUẤT (I/O) ══════════════════ */
    {
      title: 'Chapter 7 — Input/Output|||Chương 7 — Nhập/Xuất (I/O)',
      description: 'Module I/O và ba kỹ thuật: programmed I/O, interrupt-driven, DMA.',
      lessons: [
        {
          title: '7.1 — I/O modules & three techniques|||7.1 — Module I/O & ba kỹ thuật',
          slug: 'cea201-7-1-io-techniques',
          type: 'VIDEO',
          description: 'Polling, ngắt và DMA — ba cách CPU giao tiếp thiết bị.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Connecting the CPU to slow devices</h2>
<p class="lead">Devices (keyboard, disk, network) run far slower than the CPU and speak different electrical languages. An <strong>I/O module</strong> sits between them and the bus, handling the details so the CPU sees a clean interface (CLO4). The big question: how does the CPU coordinate transfers without wasting time?</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Programmed I/O (polling)</div><div class="lz-ld">The CPU issues a command, then loops checking "ready yet?" until the device responds. Simple, but the CPU is stuck busy-waiting — wasting cycles it could spend on real work.</div></div>
  <div class="lz-layer"><div class="lz-lt">Interrupt-driven I/O</div><div class="lz-ld">The CPU issues the command and goes off to do other work. When the device is ready, it raises an <em>interrupt</em>; the CPU handles it, then resumes. Much more efficient — no busy-waiting.</div></div>
  <div class="lz-layer"><div class="lz-lt">Direct Memory Access (DMA)</div><div class="lz-ld">For big transfers, even interrupts-per-byte are too much overhead. A DMA controller moves data directly between the device and memory, interrupting the CPU only once when the whole block is done.</div></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Polling</div><div class="lz-t">CPU waits &amp; checks</div><div class="lz-d">simplest, wastes CPU</div></div>
  <div class="lz-step"><div class="lz-k">Interrupt</div><div class="lz-t">device signals CPU</div><div class="lz-d">efficient for events</div></div>
  <div class="lz-step"><div class="lz-k">DMA</div><div class="lz-t">controller moves data</div><div class="lz-d">best for big blocks</div></div>
</div>
<div class="callout ok">The trend is clear: each technique frees the CPU to do more useful work. Polling ties it up completely; interrupts free it between events; DMA frees it during the entire transfer. This is why loading a big file barely slows a modern PC — DMA handles the movement while the CPU works on.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Nối CPU với thiết bị chậm</h2>
<p class="lead">Thiết bị (bàn phím, đĩa, mạng) chạy chậm hơn CPU nhiều và nói ngôn ngữ điện khác. Một <strong>module I/O</strong> nằm giữa chúng và bus, xử lý chi tiết để CPU thấy một giao diện gọn (CLO4). Câu hỏi lớn: CPU điều phối truyền dữ liệu thế nào mà không phí thời gian?</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Programmed I/O (hỏi vòng — polling)</div><div class="lz-ld">CPU phát lệnh, rồi lặp kiểm "xong chưa?" tới khi thiết bị trả lời. Đơn giản, nhưng CPU bị kẹt chờ bận — phí chu kỳ đáng lẽ làm việc thật.</div></div>
  <div class="lz-layer"><div class="lz-lt">Interrupt-driven I/O</div><div class="lz-ld">CPU phát lệnh rồi đi làm việc khác. Khi thiết bị sẵn sàng, nó phát một <em>ngắt</em>; CPU xử lý, rồi tiếp tục. Hiệu quả hơn nhiều — không chờ bận.</div></div>
  <div class="lz-layer"><div class="lz-lt">Truy cập bộ nhớ trực tiếp (DMA)</div><div class="lz-ld">Với khối lớn, ngay cả ngắt-mỗi-byte cũng quá tốn. Một bộ điều khiển DMA chuyển dữ liệu thẳng giữa thiết bị và bộ nhớ, chỉ ngắt CPU một lần khi cả block xong.</div></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Polling</div><div class="lz-t">CPU chờ &amp; kiểm</div><div class="lz-d">đơn giản nhất, phí CPU</div></div>
  <div class="lz-step"><div class="lz-k">Ngắt</div><div class="lz-t">thiết bị báo CPU</div><div class="lz-d">hiệu quả cho sự kiện</div></div>
  <div class="lz-step"><div class="lz-k">DMA</div><div class="lz-t">controller chuyển dữ liệu</div><div class="lz-d">tốt nhất cho khối lớn</div></div>
</div>
<div class="callout ok">Xu hướng rõ ràng: mỗi kỹ thuật giải phóng CPU làm nhiều việc hữu ích hơn. Polling trói nó hoàn toàn; ngắt giải phóng giữa các sự kiện; DMA giải phóng suốt cả lần truyền. Đây là lý do nạp một tệp lớn hầu như không làm chậm PC hiện đại — DMA lo di chuyển trong khi CPU làm việc tiếp.</div>
</div>
`,
        },
        {
          title: 'Chapter 7 Quiz|||Quiz chương 7',
          slug: 'cea201-quiz-ch7',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: module I/O, polling, ngắt, DMA.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'In programmed I/O (polling), the CPU…|||Trong programmed I/O (polling), CPU…', options: ['does other work until interrupted|||làm việc khác tới khi bị ngắt', 'busy-waits, repeatedly checking the device|||chờ bận, liên tục kiểm thiết bị', 'never talks to the device|||không bao giờ nói với thiết bị', 'moves data without involvement|||chuyển dữ liệu không tham gia'], correctIndex: 1, points: 1 },
              { question: 'Interrupt-driven I/O is more efficient than polling because…|||I/O điều khiển bằng ngắt hiệu quả hơn polling vì…', options: ['it uses more electricity|||nó dùng nhiều điện hơn', 'the CPU can do other work until the device signals|||CPU có thể làm việc khác tới khi thiết bị báo', 'it needs no I/O module|||không cần module I/O', 'it is older|||nó cũ hơn'], correctIndex: 1, points: 1 },
              { question: 'DMA is best suited for…|||DMA phù hợp nhất cho…', options: ['single-byte transfers|||truyền một byte', 'large block transfers|||truyền khối lớn', 'doing arithmetic|||làm phép toán', 'running the OS|||chạy hệ điều hành'], correctIndex: 1, points: 1 },
              { question: 'With DMA, the CPU is interrupted…|||Với DMA, CPU bị ngắt…', options: ['for every byte|||cho mỗi byte', 'only once, when the whole block is done|||chỉ một lần, khi cả block xong', 'never|||không bao giờ', 'continuously|||liên tục'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 8 — HỖ TRỢ HỆ ĐIỀU HÀNH ══════════════════ */
    {
      title: 'Chapter 8 — Operating System Support|||Chương 8 — Hỗ trợ Hệ điều hành',
      description: 'Vai trò OS, lập lịch, quản lý bộ nhớ và bộ nhớ ảo/phân trang.',
      lessons: [
        {
          title: '8.1 — Scheduling, memory management & virtual memory|||8.1 — Lập lịch, quản lý bộ nhớ & bộ nhớ ảo',
          slug: 'cea201-8-1-os-support',
          type: 'VIDEO',
          description: 'Hardware giúp OS chia sẻ CPU và bộ nhớ giữa nhiều chương trình ra sao.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Why architecture cares about the OS</h2>
<p class="lead">The OS manages the machine (CLO5), but it relies on <strong>hardware support</strong> to do so safely and quickly. This chapter is where organization and operating systems meet.</p>
<h3>Scheduling — sharing the CPU</h3>
<p>With many programs wanting the CPU, the OS <strong>schedules</strong> them, giving each a slice of time and switching between them. Hardware helps with a <em>timer interrupt</em> that periodically returns control to the OS so no single program can hog the CPU forever.</p>
<h3>Memory management &amp; protection</h3>
<p>Multiple programs share memory, so the hardware must keep them isolated. Special registers and a <strong>Memory Management Unit (MMU)</strong> check every address, so program A cannot read or corrupt program B&#39;s memory.</p>
<h3>Virtual memory &amp; paging</h3>
<p><strong>Virtual memory</strong> lets each program act as if it has a large, private, continuous memory — even if physical RAM is smaller and shared. The MMU translates <em>virtual</em> addresses to <em>physical</em> ones, using <strong>paging</strong>: memory is split into fixed-size pages, and inactive pages can be pushed out to disk.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Program uses</div><div class="lz-t">virtual address</div><div class="lz-d">its own clean space</div></div>
  <div class="lz-step"><div class="lz-k">MMU translates</div><div class="lz-t">→ physical address</div><div class="lz-d">via a page table</div></div>
  <div class="lz-step"><div class="lz-k">Page not in RAM?</div><div class="lz-t">page fault → load from disk</div><div class="lz-d">the OS handles it</div></div>
</div>
<div class="note-ct">This is where CEA201 hands off to OSG202. Here you learn the <em>hardware mechanisms</em> (timer interrupts, MMU, page tables) that make multitasking and memory protection possible; OSG202 teaches the <em>policies</em> the OS runs on top of them.</div>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture#module-483" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">See scheduling &amp; memory live</span><span class="lc-sub">Inspect processes and memory from the shell — the Linux "Process Management" module.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Vì sao kiến trúc quan tâm tới OS</h2>
<p class="lead">OS quản lý cỗ máy (CLO5), nhưng nó dựa vào <strong>hỗ trợ phần cứng</strong> để làm điều đó an toàn và nhanh. Chương này là nơi tổ chức máy tính và hệ điều hành gặp nhau.</p>
<h3>Lập lịch — chia sẻ CPU</h3>
<p>Với nhiều chương trình muốn CPU, OS <strong>lập lịch</strong> chúng, cho mỗi cái một lát thời gian và chuyển giữa chúng. Phần cứng giúp bằng một <em>ngắt timer</em> định kỳ trả quyền điều khiển về OS, để không chương trình nào chiếm CPU mãi.</p>
<h3>Quản lý &amp; bảo vệ bộ nhớ</h3>
<p>Nhiều chương trình dùng chung bộ nhớ, nên phần cứng phải giữ chúng cô lập. Các thanh ghi đặc biệt và một <strong>Đơn vị quản lý bộ nhớ (MMU)</strong> kiểm mọi địa chỉ, để chương trình A không đọc hay phá được bộ nhớ của chương trình B.</p>
<h3>Bộ nhớ ảo &amp; phân trang</h3>
<p><strong>Bộ nhớ ảo (virtual memory)</strong> cho mỗi chương trình hành xử như thể nó có một bộ nhớ lớn, riêng, liên tục — dù RAM vật lý nhỏ hơn và dùng chung. MMU dịch địa chỉ <em>ảo</em> sang <em>vật lý</em>, dùng <strong>phân trang (paging)</strong>: bộ nhớ chia thành các trang cỡ cố định, và trang không hoạt động có thể đẩy ra đĩa.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Chương trình dùng</div><div class="lz-t">địa chỉ ảo</div><div class="lz-d">không gian riêng gọn của nó</div></div>
  <div class="lz-step"><div class="lz-k">MMU dịch</div><div class="lz-t">→ địa chỉ vật lý</div><div class="lz-d">qua bảng trang (page table)</div></div>
  <div class="lz-step"><div class="lz-k">Trang không ở RAM?</div><div class="lz-t">page fault → nạp từ đĩa</div><div class="lz-d">OS xử lý</div></div>
</div>
<div class="note-ct">Đây là nơi CEA201 bàn giao cho OSG202. Ở đây bạn học <em>cơ chế phần cứng</em> (ngắt timer, MMU, bảng trang) làm cho đa nhiệm và bảo vệ bộ nhớ khả thi; OSG202 dạy <em>chính sách</em> mà OS chạy bên trên chúng.</p></div>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture#module-483" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Xem lập lịch &amp; bộ nhớ trực tiếp</span><span class="lc-sub">Soi tiến trình và bộ nhớ từ shell — module Linux "Process Management".</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 8 Quiz|||Quiz chương 8',
          slug: 'cea201-quiz-ch8',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: lập lịch, MMU, bộ nhớ ảo, phân trang.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Which hardware feature stops a program from hogging the CPU forever?|||Tính năng phần cứng nào ngăn một chương trình chiếm CPU mãi?', options: ['the cache|||cache', 'a timer interrupt|||một ngắt timer', 'the address bus|||bus địa chỉ', 'DMA'], correctIndex: 1, points: 1 },
              { question: 'The MMU (Memory Management Unit) mainly…|||MMU (Đơn vị quản lý bộ nhớ) chủ yếu…', options: ['speeds up the clock|||tăng tốc clock', 'translates virtual addresses to physical and enforces protection|||dịch địa chỉ ảo sang vật lý và cưỡng chế bảo vệ', 'stores files|||lưu tệp', 'runs the ALU|||chạy ALU'], correctIndex: 1, points: 1 },
              { question: 'Virtual memory lets a program…|||Bộ nhớ ảo cho một chương trình…', options: ['use only the exact RAM installed|||chỉ dùng đúng RAM đã lắp', 'act as if it has a large private continuous memory|||hành xử như thể có bộ nhớ lớn, riêng, liên tục', 'skip the CPU|||bỏ qua CPU', 'run without an OS|||chạy không cần OS'], correctIndex: 1, points: 1 },
              { question: 'A page fault occurs when…|||Page fault xảy ra khi…', options: ['the CPU overheats|||CPU quá nóng', 'a needed page is not in RAM and must be loaded from disk|||một trang cần dùng không ở RAM và phải nạp từ đĩa', 'the cache is full|||cache đầy', 'two programs share a bus|||hai chương trình dùng chung bus'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 9 — LOGIC SỐ ══════════════════ */
    {
      title: 'Chapter 9 — Digital Logic|||Chương 9 — Logic số',
      description: 'Đại số Boole, cổng logic, mạch tổ hợp và mạch tuần tự (CLO6).',
      lessons: [
        {
          title: '9.1 — Boolean algebra & logic gates|||9.1 — Đại số Boole & cổng logic',
          slug: 'cea201-9-1-boolean-gates',
          type: 'VIDEO',
          description: 'Ngôn ngữ toán của mạch số và các cổng hiện thực nó.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>The math of digital circuits</h2>
<p class="lead">This chapter (CLO6) is the bridge from bits to hardware. <strong>Boolean algebra</strong> is the mathematics of true/false (1/0) values, and <strong>logic gates</strong> are the physical circuits that implement its operations.</p>
<table>
  <thead><tr><th>Gate</th><th>Boolean</th><th>Output 1 when</th></tr></thead>
  <tbody>
    <tr><td>AND</td><td>A · B</td><td>both inputs are 1</td></tr>
    <tr><td>OR</td><td>A + B</td><td>at least one input is 1</td></tr>
    <tr><td>NOT</td><td>Ā</td><td>the input is 0</td></tr>
    <tr><td>NAND</td><td>not(A · B)</td><td>NOT both 1 — universal gate</td></tr>
    <tr><td>NOR</td><td>not(A + B)</td><td>neither is 1 — universal gate</td></tr>
    <tr><td>XOR</td><td>A ⊕ B</td><td>the inputs differ</td></tr>
  </tbody>
</table>
<h3>Boolean laws let us simplify circuits</h3>
<p>Boolean algebra has laws (identity, De Morgan&#39;s, distributive) that let engineers <strong>simplify</strong> an expression — and thus use fewer gates, making the chip smaller, cheaper and faster.</p>
<div class="out"><b>De Morgan&#39;s law:</b> not(A · B) = Ā + B̄  ·  not(A + B) = Ā · B̄</div>
<div class="callout ok">NAND and NOR are called <strong>universal gates</strong> because any logic function can be built from NAND alone (or NOR alone). This is a profound fact: a whole CPU can be manufactured from just one repeated gate type — enormously simplifying chip fabrication.</div>
<a class="link-card exphub" href="/exp-hub/cea201-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Build circuits in Logisim</span><span class="lc-sub">Drag gates, wire them, and test truth tables — setup on the CEA201 tools guide.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Toán học của mạch số</h2>
<p class="lead">Chương này (CLO6) là cầu nối từ bit tới phần cứng. <strong>Đại số Boole</strong> là toán học của các giá trị đúng/sai (1/0), và <strong>cổng logic</strong> là mạch vật lý hiện thực các phép của nó.</p>
<table>
  <thead><tr><th>Cổng</th><th>Boole</th><th>Ra 1 khi</th></tr></thead>
  <tbody>
    <tr><td>AND</td><td>A · B</td><td>cả hai đầu vào là 1</td></tr>
    <tr><td>OR</td><td>A + B</td><td>ít nhất một đầu vào là 1</td></tr>
    <tr><td>NOT</td><td>Ā</td><td>đầu vào là 0</td></tr>
    <tr><td>NAND</td><td>not(A · B)</td><td>KHÔNG cả hai đều 1 — cổng vạn năng</td></tr>
    <tr><td>NOR</td><td>not(A + B)</td><td>không cái nào là 1 — cổng vạn năng</td></tr>
    <tr><td>XOR</td><td>A ⊕ B</td><td>hai đầu vào khác nhau</td></tr>
  </tbody>
</table>
<h3>Các luật Boole cho phép đơn giản hoá mạch</h3>
<p>Đại số Boole có các luật (đồng nhất, De Morgan, phân phối) cho kỹ sư <strong>đơn giản hoá</strong> một biểu thức — nhờ đó dùng ít cổng hơn, làm chip nhỏ hơn, rẻ hơn và nhanh hơn.</p>
<div class="out"><b>Luật De Morgan:</b> not(A · B) = Ā + B̄  ·  not(A + B) = Ā · B̄</div>
<div class="callout ok">NAND và NOR được gọi là <strong>cổng vạn năng</strong> vì mọi hàm logic đều xây được chỉ từ NAND (hoặc chỉ từ NOR). Đây là một sự thật sâu sắc: cả một CPU có thể được sản xuất chỉ từ một loại cổng lặp lại — đơn giản hoá rất nhiều việc chế tạo chip.</div>
<a class="link-card exphub" href="/exp-hub/cea201-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Dựng mạch trong Logisim</span><span class="lc-sub">Kéo cổng, đấu dây, và kiểm bảng chân trị — cài đặt ở guide công cụ CEA201.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '9.2 — Combinational & sequential circuits|||9.2 — Mạch tổ hợp & mạch tuần tự',
          slug: 'cea201-9-2-circuits',
          type: 'VIDEO',
          description: 'Mạch không nhớ (bộ cộng) vs mạch có nhớ (flip-flop, thanh ghi).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Two families of digital circuits</h2>
<p class="lead">Wiring gates together produces two fundamentally different kinds of circuit, distinguished by one thing: <strong>memory</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Combinational circuits — no memory</div><div class="lz-ld">Output depends only on the current inputs. Same inputs always give the same output. Examples: adders, multiplexers, decoders. The ALU is built from these.</div></div>
  <div class="lz-layer"><div class="lz-lt">Sequential circuits — with memory</div><div class="lz-ld">Output depends on current inputs AND past state (stored bits). They remember. Examples: flip-flops, registers, counters. Memory and registers are built from these.</div></div>
</div>
<h3>The adder — a combinational building block</h3>
<p>A <strong>half-adder</strong> adds two bits: the sum is A XOR B, the carry is A AND B. Chain <em>full-adders</em> together and you get a circuit that adds multi-bit numbers — the heart of the ALU.</p>
<table>
  <thead><tr><th>A</th><th>B</th><th>Sum (XOR)</th><th>Carry (AND)</th></tr></thead>
  <tbody>
    <tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>0</td><td>1</td><td>1</td><td>0</td></tr>
    <tr><td>1</td><td>0</td><td>1</td><td>0</td></tr>
    <tr><td>1</td><td>1</td><td>0</td><td>1</td></tr>
  </tbody>
</table>
<h3>The flip-flop — a 1-bit memory</h3>
<p>A <strong>flip-flop</strong> is a sequential circuit that stores one bit stably until told to change, driven by the clock. Put many side by side and you get a <strong>register</strong>; that is literally how the CPU&#39;s registers and SRAM cache are built.</p>
<div class="note-ct">Now the full picture connects: gates → combinational adders (the ALU) + sequential flip-flops (registers/memory) → together they make a CPU. Everything in the earlier chapters ultimately reduces to these two circuit families switching billions of times a second.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Hai họ mạch số</h2>
<p class="lead">Đấu các cổng với nhau tạo ra hai loại mạch khác nhau cơ bản, phân biệt bởi một thứ: <strong>bộ nhớ</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Mạch tổ hợp — không nhớ</div><div class="lz-ld">Đầu ra chỉ phụ thuộc đầu vào hiện tại. Cùng đầu vào luôn cho cùng đầu ra. Ví dụ: bộ cộng, multiplexer, decoder. ALU xây từ những cái này.</div></div>
  <div class="lz-layer"><div class="lz-lt">Mạch tuần tự — có nhớ</div><div class="lz-ld">Đầu ra phụ thuộc đầu vào hiện tại VÀ trạng thái quá khứ (bit đã lưu). Chúng nhớ. Ví dụ: flip-flop, thanh ghi, bộ đếm. Bộ nhớ và thanh ghi xây từ những cái này.</div></div>
</div>
<h3>Bộ cộng — một viên gạch tổ hợp</h3>
<p>Một <strong>bộ nửa cộng (half-adder)</strong> cộng hai bit: tổng là A XOR B, nhớ là A AND B. Nối các <em>full-adder</em> với nhau và bạn có mạch cộng số nhiều bit — trái tim của ALU.</p>
<table>
  <thead><tr><th>A</th><th>B</th><th>Tổng (XOR)</th><th>Nhớ (AND)</th></tr></thead>
  <tbody>
    <tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>0</td><td>1</td><td>1</td><td>0</td></tr>
    <tr><td>1</td><td>0</td><td>1</td><td>0</td></tr>
    <tr><td>1</td><td>1</td><td>0</td><td>1</td></tr>
  </tbody>
</table>
<h3>Flip-flop — một bộ nhớ 1 bit</h3>
<p>Một <strong>flip-flop</strong> là mạch tuần tự lưu một bit ổn định tới khi được bảo đổi, dẫn bởi clock. Đặt nhiều cái cạnh nhau và bạn có một <strong>thanh ghi (register)</strong>; đó đúng là cách thanh ghi CPU và cache SRAM được xây.</p>
<div class="note-ct">Giờ bức tranh đầy đủ nối lại: cổng → bộ cộng tổ hợp (ALU) + flip-flop tuần tự (thanh ghi/bộ nhớ) → cùng nhau tạo nên một CPU. Mọi thứ ở các chương trước rốt cuộc rút về hai họ mạch này chuyển mạch hàng tỷ lần mỗi giây.</div>
</div>
`,
        },
        {
          title: 'Chapter 9 Quiz|||Quiz chương 9',
          slug: 'cea201-quiz-ch9',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: Boole, cổng, De Morgan, mạch tổ hợp/tuần tự.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Why are NAND and NOR called "universal" gates?|||Vì sao NAND và NOR được gọi là cổng "vạn năng"?', options: ['they are the fastest|||chúng nhanh nhất', 'any logic function can be built from them alone|||mọi hàm logic đều xây được chỉ từ chúng', 'they store data|||chúng lưu dữ liệu', 'they use no power|||chúng không dùng điện'], correctIndex: 1, points: 1 },
              { question: 'A combinational circuit\'s output depends on…|||Đầu ra của một mạch tổ hợp phụ thuộc…', options: ['current inputs only|||chỉ đầu vào hiện tại', 'past state only|||chỉ trạng thái quá khứ', 'the clock only|||chỉ clock', 'nothing|||không gì'], correctIndex: 0, points: 1 },
              { question: 'In a half-adder, the SUM bit is produced by which gate?|||Trong half-adder, bit TỔNG do cổng nào tạo ra?', options: ['AND', 'OR', 'XOR', 'NOT'], correctIndex: 2, points: 1 },
              { question: 'A flip-flop is used to…|||Một flip-flop được dùng để…', options: ['add numbers|||cộng số', 'store one bit of state|||lưu một bit trạng thái', 'convert bases|||chuyển cơ số', 'move data on the bus|||chuyển dữ liệu trên bus'], correctIndex: 1, points: 1 },
              { question: 'De Morgan\'s law states not(A · B) equals…|||Luật De Morgan nói not(A · B) bằng…', options: ['Ā · B̄', 'Ā + B̄', 'A + B', 'A · B'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 10 — TẬP LỆNH: ĐẶC ĐIỂM ══════════════════ */
    {
      title: 'Chapter 10 — Instruction Sets: Characteristics|||Chương 10 — Tập lệnh: Đặc điểm',
      description: 'Một lệnh máy gồm gì: mã lệnh, toán hạng, phép toán và kiểu dữ liệu.',
      lessons: [
        {
          title: '10.1 — Anatomy of a machine instruction|||10.1 — Giải phẫu một lệnh máy',
          slug: 'cea201-10-1-instruction-anatomy',
          type: 'VIDEO',
          description: 'Opcode + toán hạng, các loại phép toán và số địa chỉ trong một lệnh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>What is a machine instruction?</h2>
<p class="lead">The <strong>instruction set</strong> is the vocabulary of the CPU — the complete list of operations it can perform (CLO7). Each instruction is a bit pattern with two conceptual parts.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Opcode (operation code)</div><div class="lz-ld">What to do: ADD, LOAD, STORE, JUMP…</div></div>
  <div class="lz-layer"><div class="lz-lt">Operands</div><div class="lz-ld">What to do it to: registers, memory addresses, or immediate values.</div></div>
</div>
<div class="out"><b>Example (MARIE-style):</b>  ADD X   →  opcode ADD, operand X (add the value at address X)</div>
<h3>Types of operations</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Data transfer</div><div class="lz-nsub">LOAD, STORE, MOVE — move data around</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Arithmetic &amp; logic</div><div class="lz-nsub">ADD, SUB, AND, OR — the ALU work</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Control flow</div><div class="lz-nsub">JUMP, BRANCH, CALL — change what runs next</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">I/O</div><div class="lz-nsub">INPUT, OUTPUT — talk to devices</div></div></div>
</div>
<h3>How many addresses per instruction?</h3>
<p>Instruction sets differ in how many operands an instruction names — 3-address (ADD A, B, C → C = A + B), 2-address, 1-address (using an implied accumulator, like MARIE), or 0-address (stack machines). Fewer addresses means shorter instructions but more instructions to do the same work — an architecture trade-off.</p>
<div class="note-ct">The instruction set is the precise boundary between hardware and software — it is the "architecture" from Chapter 1. A compiler&#39;s ultimate job is to turn your high-level code into a sequence of these instructions.</div>
<a class="link-card exphub" href="/exp-hub/cea201-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">Write real instructions in MARIE</span><span class="lc-sub">Type LOAD/ADD/STORE and single-step them — MARIE setup on the tools guide.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Một lệnh máy là gì?</h2>
<p class="lead"><strong>Tập lệnh (instruction set)</strong> là từ vựng của CPU — danh sách đầy đủ các phép nó thực hiện được (CLO7). Mỗi lệnh là một mẫu bit gồm hai phần khái niệm.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Opcode (mã phép toán)</div><div class="lz-ld">Làm gì: ADD, LOAD, STORE, JUMP…</div></div>
  <div class="lz-layer"><div class="lz-lt">Toán hạng (operand)</div><div class="lz-ld">Làm với cái gì: thanh ghi, địa chỉ bộ nhớ, hoặc giá trị tức thời.</div></div>
</div>
<div class="out"><b>Ví dụ (kiểu MARIE):</b>  ADD X   →  opcode ADD, toán hạng X (cộng giá trị tại địa chỉ X)</div>
<h3>Các loại phép toán</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Chuyển dữ liệu</div><div class="lz-nsub">LOAD, STORE, MOVE — di chuyển dữ liệu</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Số học &amp; logic</div><div class="lz-nsub">ADD, SUB, AND, OR — việc của ALU</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Điều khiển luồng</div><div class="lz-nsub">JUMP, BRANCH, CALL — đổi lệnh chạy kế</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">I/O</div><div class="lz-nsub">INPUT, OUTPUT — nói chuyện thiết bị</div></div></div>
</div>
<h3>Mỗi lệnh có bao nhiêu địa chỉ?</h3>
<p>Các tập lệnh khác nhau ở số toán hạng một lệnh nêu — 3 địa chỉ (ADD A, B, C → C = A + B), 2 địa chỉ, 1 địa chỉ (dùng thanh ghi tích luỹ ngầm, như MARIE), hay 0 địa chỉ (máy ngăn xếp). Ít địa chỉ hơn nghĩa là lệnh ngắn hơn nhưng cần nhiều lệnh hơn cho cùng việc — một đánh đổi kiến trúc.</p>
<div class="note-ct">Tập lệnh là ranh giới chính xác giữa phần cứng và phần mềm — nó là "kiến trúc" ở Chương 1. Nhiệm vụ tối hậu của trình biên dịch là biến code bậc cao của bạn thành một chuỗi các lệnh này.</div>
<a class="link-card exphub" href="/exp-hub/cea201-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">Viết lệnh thật trong MARIE</span><span class="lc-sub">Gõ LOAD/ADD/STORE và chạy từng bước — cài đặt MARIE ở guide công cụ.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 10 Quiz|||Quiz chương 10',
          slug: 'cea201-quiz-ch10',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: opcode/toán hạng, loại phép toán, số địa chỉ.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The two conceptual parts of a machine instruction are…|||Hai phần khái niệm của một lệnh máy là…', options: ['cache and register|||cache và thanh ghi', 'opcode and operand(s)|||opcode và toán hạng', 'address and data bus|||bus địa chỉ và dữ liệu', 'input and output|||nhập và xuất'], correctIndex: 1, points: 1 },
              { question: 'JUMP and BRANCH are which type of operation?|||JUMP và BRANCH thuộc loại phép toán nào?', options: ['data transfer|||chuyển dữ liệu', 'arithmetic|||số học', 'control flow|||điều khiển luồng', 'I/O'], correctIndex: 2, points: 1 },
              { question: 'The instruction set is essentially the CPU\'s…|||Tập lệnh về cơ bản là… của CPU', options: ['power supply|||nguồn điện', 'vocabulary of operations (its architecture)|||từ vựng các phép (kiến trúc của nó)', 'cache|||cache', 'clock|||đồng hồ'], correctIndex: 1, points: 1 },
              { question: 'Using fewer addresses per instruction generally means…|||Dùng ít địa chỉ hơn mỗi lệnh nói chung nghĩa là…', options: ['shorter instructions but more of them|||lệnh ngắn hơn nhưng cần nhiều lệnh hơn', 'longer instructions|||lệnh dài hơn', 'no operands at all ever|||không bao giờ có toán hạng', 'a faster clock|||clock nhanh hơn'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 11 — TẬP LỆNH: ADDRESSING ══════════════════ */
    {
      title: 'Chapter 11 — Instruction Sets: Addressing Modes|||Chương 11 — Tập lệnh: Addressing Modes',
      description: 'Các cách một lệnh chỉ ra toán hạng nằm ở đâu.',
      lessons: [
        {
          title: '11.1 — Addressing modes|||11.1 — Các addressing mode',
          slug: 'cea201-11-1-addressing-modes',
          type: 'VIDEO',
          description: 'Immediate, direct, indirect, register và indexed — và vì sao cần nhiều kiểu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Where is the operand? Addressing modes</h2>
<p class="lead">An instruction like "ADD X" must specify <em>where</em> the operand X lives. An <strong>addressing mode</strong> is a rule for interpreting the operand field (CLO7). Different modes trade off flexibility, speed and instruction size.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Immediate</div><div class="lz-ld">The operand IS the value, right in the instruction. e.g. ADD 5 → add the number 5. Fastest (no memory access) but the value is fixed.</div></div>
  <div class="lz-layer"><div class="lz-lt">Direct</div><div class="lz-ld">The operand field holds the memory address of the value. ADD X → add what is stored at address X.</div></div>
  <div class="lz-layer"><div class="lz-lt">Indirect</div><div class="lz-ld">The operand field points to a location that holds the address of the value (a pointer to a pointer). Flexible but slower — two memory lookups.</div></div>
  <div class="lz-layer"><div class="lz-lt">Register</div><div class="lz-ld">The operand is in a register (fast, small field). Register-indirect = the register holds the address.</div></div>
  <div class="lz-layer"><div class="lz-lt">Indexed</div><div class="lz-ld">Address = a base + an index register. Perfect for stepping through arrays: change the index to reach each element.</div></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Immediate</div><div class="lz-t">value in instruction</div><div class="lz-d">no memory access</div></div>
  <div class="lz-step"><div class="lz-k">Direct</div><div class="lz-t">address in instruction</div><div class="lz-d">one memory access</div></div>
  <div class="lz-step"><div class="lz-k">Indirect</div><div class="lz-t">address of the address</div><div class="lz-d">two memory accesses</div></div>
</div>
<div class="note-ct">This is the hardware reality behind <strong>pointers</strong> and <strong>arrays</strong> you meet in C. Indirect addressing is a pointer; indexed addressing is exactly how array[i] is computed. Understanding modes here makes low-level programming click.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Toán hạng ở đâu? Các addressing mode</h2>
<p class="lead">Một lệnh như "ADD X" phải chỉ ra <em>toán hạng X nằm đâu</em>. Một <strong>addressing mode</strong> là quy tắc diễn giải trường toán hạng (CLO7). Các mode khác nhau đánh đổi linh hoạt, tốc độ và kích thước lệnh.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Immediate (tức thời)</div><div class="lz-ld">Toán hạng CHÍNH LÀ giá trị, nằm ngay trong lệnh. vd ADD 5 → cộng số 5. Nhanh nhất (không truy cập bộ nhớ) nhưng giá trị cố định.</div></div>
  <div class="lz-layer"><div class="lz-lt">Direct (trực tiếp)</div><div class="lz-ld">Trường toán hạng giữ địa chỉ bộ nhớ của giá trị. ADD X → cộng thứ lưu tại địa chỉ X.</div></div>
  <div class="lz-layer"><div class="lz-lt">Indirect (gián tiếp)</div><div class="lz-ld">Trường toán hạng trỏ tới một vị trí giữ địa chỉ của giá trị (con trỏ tới con trỏ). Linh hoạt nhưng chậm hơn — hai lần tra bộ nhớ.</div></div>
  <div class="lz-layer"><div class="lz-lt">Register (thanh ghi)</div><div class="lz-ld">Toán hạng nằm trong một thanh ghi (nhanh, trường nhỏ). Register-indirect = thanh ghi giữ địa chỉ.</div></div>
  <div class="lz-layer"><div class="lz-lt">Indexed (chỉ số)</div><div class="lz-ld">Địa chỉ = một base + một thanh ghi chỉ số. Hoàn hảo để duyệt mảng: đổi chỉ số để tới từng phần tử.</div></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Immediate</div><div class="lz-t">giá trị trong lệnh</div><div class="lz-d">không truy cập bộ nhớ</div></div>
  <div class="lz-step"><div class="lz-k">Direct</div><div class="lz-t">địa chỉ trong lệnh</div><div class="lz-d">một lần truy cập bộ nhớ</div></div>
  <div class="lz-step"><div class="lz-k">Indirect</div><div class="lz-t">địa chỉ của địa chỉ</div><div class="lz-d">hai lần truy cập bộ nhớ</div></div>
</div>
<div class="note-ct">Đây là hiện thực phần cứng đằng sau <strong>con trỏ</strong> và <strong>mảng</strong> bạn gặp trong C. Indirect addressing là một con trỏ; indexed addressing đúng là cách array[i] được tính. Hiểu các mode ở đây làm lập trình low-level "khớp" ngay.</div>
</div>
`,
        },
        {
          title: 'Chapter 11 Quiz|||Quiz chương 11',
          slug: 'cea201-quiz-ch11',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: immediate/direct/indirect/register/indexed.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'In IMMEDIATE addressing, the operand is…|||Trong addressing IMMEDIATE, toán hạng là…', options: ['a memory address|||một địa chỉ bộ nhớ', 'the actual value, inside the instruction|||giá trị thực, nằm trong lệnh', 'a register number|||một số thanh ghi', 'an index|||một chỉ số'], correctIndex: 1, points: 1 },
              { question: 'DIRECT addressing means the operand field contains…|||Addressing DIRECT nghĩa là trường toán hạng chứa…', options: ['the value itself|||chính giá trị', 'the memory address of the value|||địa chỉ bộ nhớ của giá trị', 'the address of an address|||địa chỉ của một địa chỉ', 'nothing|||không gì'], correctIndex: 1, points: 1 },
              { question: 'INDIRECT addressing corresponds in C to a…|||Addressing INDIRECT tương ứng trong C với một…', options: ['constant|||hằng số', 'pointer|||con trỏ', 'loop|||vòng lặp', 'comment|||chú thích'], correctIndex: 1, points: 1 },
              { question: 'INDEXED addressing is especially useful for…|||Addressing INDEXED đặc biệt hữu ích cho…', options: ['stepping through array elements|||duyệt qua các phần tử mảng', 'adding two constants|||cộng hai hằng số', 'reading the clock|||đọc clock', 'shutting down|||tắt máy'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 12 — CẤU TRÚC & CHỨC NĂNG CPU ══════════════════ */
    {
      title: 'Chapter 12 — Processor Structure & Function|||Chương 12 — Cấu trúc & Chức năng CPU',
      description: 'Thanh ghi, chu trình lệnh chi tiết và pipeline.',
      lessons: [
        {
          title: '12.1 — Registers & the instruction cycle|||12.1 — Thanh ghi & chu trình lệnh',
          slug: 'cea201-12-1-registers-cycle',
          type: 'VIDEO',
          description: 'Các thanh ghi bên trong CPU và các bước chi tiết của một lệnh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>Inside the processor — registers</h2>
<p class="lead">Registers are the CPU&#39;s own tiny, ultra-fast storage (CLO8). Some are visible to the programmer; others are internal control registers the CPU uses to run instructions.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Program Counter (PC)</div><div class="lz-ld">Holds the address of the next instruction to fetch.</div></div>
  <div class="lz-layer"><div class="lz-lt">Instruction Register (IR)</div><div class="lz-ld">Holds the instruction currently being decoded/executed.</div></div>
  <div class="lz-layer"><div class="lz-lt">Memory Address / Data Registers (MAR / MBR)</div><div class="lz-ld">Hold the address to access and the data going to/from memory.</div></div>
  <div class="lz-layer"><div class="lz-lt">Accumulator / general registers</div><div class="lz-ld">Hold operands and results the ALU is working on.</div></div>
  <div class="lz-layer"><div class="lz-lt">Status/flag register</div><div class="lz-ld">Records results of operations (zero, carry, overflow, sign) — used by conditional branches.</div></div>
</div>
<h3>The instruction cycle in detail</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Fetch</div><div class="lz-t">PC → MAR → memory → IR</div><div class="lz-d">get the instruction, advance PC</div></div>
  <div class="lz-step"><div class="lz-k">Decode</div><div class="lz-t">read opcode &amp; operands</div><div class="lz-d">figure out what to do</div></div>
  <div class="lz-step"><div class="lz-k">Fetch operands</div><div class="lz-t">from memory/registers</div><div class="lz-d">using the addressing mode</div></div>
  <div class="lz-step"><div class="lz-k">Execute</div><div class="lz-t">ALU does the work</div><div class="lz-d">store result, set flags</div></div>
</div>
<div class="note-ct">The status flags are the hardware behind if/while in your code: a compare sets the zero/sign flags, and a conditional branch instruction reads them to decide whether to jump. High-level control flow bottoms out in these bits.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture#module-282" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Touch registers &amp; memory in C</span><span class="lc-sub">The "Pointers &amp; Memory" module gets you as close to the metal as a language lets you.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Bên trong bộ xử lý — thanh ghi</h2>
<p class="lead">Thanh ghi là bộ nhớ tí hon, cực nhanh của chính CPU (CLO8). Một số thấy được với lập trình viên; số khác là thanh ghi điều khiển nội bộ CPU dùng để chạy lệnh.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Program Counter (PC)</div><div class="lz-ld">Giữ địa chỉ lệnh kế cần nạp.</div></div>
  <div class="lz-layer"><div class="lz-lt">Instruction Register (IR)</div><div class="lz-ld">Giữ lệnh đang được giải mã/thực thi.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thanh ghi địa chỉ / dữ liệu bộ nhớ (MAR / MBR)</div><div class="lz-ld">Giữ địa chỉ cần truy cập và dữ liệu đi tới/từ bộ nhớ.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thanh ghi tích luỹ / đa dụng</div><div class="lz-ld">Giữ toán hạng và kết quả mà ALU đang xử lý.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thanh ghi trạng thái/cờ</div><div class="lz-ld">Ghi kết quả phép toán (zero, carry, overflow, dấu) — dùng bởi các lệnh rẽ nhánh có điều kiện.</div></div>
</div>
<h3>Chu trình lệnh chi tiết</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nạp</div><div class="lz-t">PC → MAR → bộ nhớ → IR</div><div class="lz-d">lấy lệnh, tăng PC</div></div>
  <div class="lz-step"><div class="lz-k">Giải mã</div><div class="lz-t">đọc opcode &amp; toán hạng</div><div class="lz-d">hiểu cần làm gì</div></div>
  <div class="lz-step"><div class="lz-k">Nạp toán hạng</div><div class="lz-t">từ bộ nhớ/thanh ghi</div><div class="lz-d">theo addressing mode</div></div>
  <div class="lz-step"><div class="lz-k">Thực thi</div><div class="lz-t">ALU làm việc</div><div class="lz-d">lưu kết quả, đặt cờ</div></div>
</div>
<div class="note-ct">Các cờ trạng thái là phần cứng đằng sau if/while trong code của bạn: một phép so sánh đặt cờ zero/dấu, và một lệnh rẽ nhánh có điều kiện đọc chúng để quyết định có nhảy không. Điều khiển luồng bậc cao rốt cuộc nằm ở các bit này.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture#module-282" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Chạm thanh ghi &amp; bộ nhớ trong C</span><span class="lc-sub">Module "Pointers &amp; Memory" đưa bạn gần "kim loại" nhất mà một ngôn ngữ cho phép.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '12.2 — Pipelining|||12.2 — Pipeline (đường ống lệnh)',
          slug: 'cea201-12-2-pipelining',
          type: 'VIDEO',
          description: 'Chồng lấn các giai đoạn lệnh để tăng thông lượng, và các hazard.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Pipelining — an assembly line for instructions</h2>
<p class="lead">If each instruction goes through stages (fetch, decode, execute, write), why make each instruction finish before starting the next? <strong>Pipelining</strong> overlaps them like a factory assembly line — while one instruction executes, the next is decoded and a third is fetched.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Cycle 1</div><div class="lz-t">Fetch I1</div><div class="lz-d">—</div></div>
  <div class="lz-step"><div class="lz-k">Cycle 2</div><div class="lz-t">Decode I1 · Fetch I2</div><div class="lz-d">two in flight</div></div>
  <div class="lz-step"><div class="lz-k">Cycle 3</div><div class="lz-t">Exec I1 · Dec I2 · Fetch I3</div><div class="lz-d">pipe full</div></div>
</div>
<p>Pipelining does not make one instruction finish faster, but it dramatically raises <strong>throughput</strong>: with a full pipeline the CPU finishes roughly one instruction every cycle instead of every few cycles.</p>
<h3>Hazards — why pipelines stall</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Data hazard</div><div class="lz-ld">An instruction needs a result the previous one has not written yet. Fixed with forwarding or a stall.</div></div>
  <div class="lz-layer"><div class="lz-lt">Control hazard</div><div class="lz-ld">A branch changes which instruction comes next, but the pipeline already fetched the wrong ones. Fixed with branch prediction.</div></div>
  <div class="lz-layer"><div class="lz-lt">Structural hazard</div><div class="lz-ld">Two stages need the same hardware resource at once.</div></div>
</div>
<div class="callout ok">Pipelining is one of the biggest ideas that made CPUs fast without raising the clock. Its main enemy is the branch (if/loop): a mispredicted branch flushes the pipeline. That is why modern CPUs invest heavily in <strong>branch prediction</strong> — the topic of the advanced chapter.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Pipeline — dây chuyền lắp ráp cho lệnh</h2>
<p class="lead">Nếu mỗi lệnh đi qua các giai đoạn (nạp, giải mã, thực thi, ghi), vì sao phải để mỗi lệnh xong trước khi bắt đầu lệnh kế? <strong>Pipeline</strong> chồng lấn chúng như dây chuyền lắp ráp nhà máy — trong khi một lệnh thực thi, lệnh kế được giải mã và lệnh thứ ba được nạp.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Chu kỳ 1</div><div class="lz-t">Nạp I1</div><div class="lz-d">—</div></div>
  <div class="lz-step"><div class="lz-k">Chu kỳ 2</div><div class="lz-t">Giải mã I1 · Nạp I2</div><div class="lz-d">hai lệnh trong ống</div></div>
  <div class="lz-step"><div class="lz-k">Chu kỳ 3</div><div class="lz-t">Thực thi I1 · GM I2 · Nạp I3</div><div class="lz-d">ống đầy</div></div>
</div>
<p>Pipeline không làm một lệnh xong nhanh hơn, nhưng tăng mạnh <strong>thông lượng</strong>: với ống đầy, CPU hoàn tất khoảng một lệnh mỗi chu kỳ thay vì mỗi vài chu kỳ.</p>
<h3>Hazard — vì sao pipeline bị kẹt</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Data hazard (nghẽn dữ liệu)</div><div class="lz-ld">Một lệnh cần kết quả mà lệnh trước chưa ghi xong. Sửa bằng forwarding hoặc chèn dừng (stall).</div></div>
  <div class="lz-layer"><div class="lz-lt">Control hazard (nghẽn điều khiển)</div><div class="lz-ld">Một lệnh nhảy đổi lệnh kế, nhưng pipeline đã nạp nhầm lệnh. Sửa bằng dự đoán nhảy (branch prediction).</div></div>
  <div class="lz-layer"><div class="lz-lt">Structural hazard (nghẽn tài nguyên)</div><div class="lz-ld">Hai giai đoạn cần cùng một tài nguyên phần cứng cùng lúc.</div></div>
</div>
<div class="callout ok">Pipeline là một trong những ý tưởng lớn nhất giúp CPU nhanh mà không tăng clock. Kẻ thù chính của nó là lệnh nhảy (if/loop): một dự đoán nhảy sai xả sạch pipeline. Đó là lý do CPU hiện đại đầu tư mạnh vào <strong>dự đoán nhảy</strong> — chủ đề của chương nâng cao.</div>
</div>
`,
        },
        {
          title: 'Chapter 12 Quiz|||Quiz chương 12',
          slug: 'cea201-quiz-ch12',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: thanh ghi, chu trình lệnh, pipeline, hazard.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Which register holds the address of the NEXT instruction?|||Thanh ghi nào giữ địa chỉ của lệnh KẾ TIẾP?', options: ['Instruction Register (IR)', 'Program Counter (PC)', 'Accumulator', 'Status register|||Thanh ghi trạng thái'], correctIndex: 1, points: 1 },
              { question: 'The status/flag register is read by…|||Thanh ghi trạng thái/cờ được đọc bởi…', options: ['conditional branch instructions|||các lệnh rẽ nhánh có điều kiện', 'the power supply|||nguồn điện', 'the cache|||cache', 'the keyboard|||bàn phím'], correctIndex: 0, points: 1 },
              { question: 'Pipelining improves…|||Pipeline cải thiện…', options: ['the time for a single instruction|||thời gian cho một lệnh đơn', 'throughput (instructions finished per unit time)|||thông lượng (lệnh hoàn tất trên đơn vị thời gian)', 'the clock frequency|||tần số clock', 'cache size|||kích thước cache'], correctIndex: 1, points: 1 },
              { question: 'A control hazard is caused by…|||Control hazard gây ra bởi…', options: ['a full cache|||cache đầy', 'a branch changing which instruction comes next|||một lệnh nhảy đổi lệnh kế tiếp', 'too much RAM|||quá nhiều RAM', 'a slow disk|||đĩa chậm'], correctIndex: 1, points: 1 },
              { question: 'Modern CPUs invest in branch prediction to…|||CPU hiện đại đầu tư vào dự đoán nhảy để…', options: ['increase cache misses|||tăng cache miss', 'avoid flushing the pipeline on branches|||tránh xả pipeline khi gặp lệnh nhảy', 'slow down execution|||làm chậm thực thi', 'save electricity only|||chỉ tiết kiệm điện'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 13 — RISC ══════════════════ */
    {
      title: 'Chapter 13 — Reduced Instruction Set Computers (RISC)|||Chương 13 — Máy tính tập lệnh rút gọn (RISC)',
      description: 'Triết lý RISC vs CISC và vì sao điện thoại của bạn là RISC.',
      lessons: [
        {
          title: '13.1 — RISC vs CISC|||13.1 — RISC vs CISC',
          slug: 'cea201-13-1-risc-cisc',
          type: 'VIDEO',
          description: 'Hai triết lý thiết kế tập lệnh đối lập.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>Two philosophies of instruction-set design</h2>
<p class="lead">By the 1980s, instruction sets had grown huge and complex (CISC). Researchers asked a radical question (CLO8): what if we made instructions <em>simpler</em> but ran them much faster? That is <strong>RISC</strong>.</p>
<table>
  <thead><tr><th></th><th>CISC (Complex)</th><th>RISC (Reduced)</th></tr></thead>
  <tbody>
    <tr><td>Instructions</td><td>Many, complex, variable length</td><td>Few, simple, fixed length</td></tr>
    <tr><td>Per-instruction work</td><td>One instruction can do a lot</td><td>Each does a little</td></tr>
    <tr><td>Cycles per instruction</td><td>Varies, often many</td><td>Close to 1 — pipeline-friendly</td></tr>
    <tr><td>Memory access</td><td>Many instructions touch memory</td><td>Only LOAD/STORE touch memory</td></tr>
    <tr><td>Example</td><td>x86 (Intel/AMD)</td><td>ARM (phones), RISC-V</td></tr>
  </tbody>
</table>
<h3>Why RISC often wins</h3>
<p>Simple, uniform, fixed-length instructions <strong>pipeline beautifully</strong> (Chapter 12) — the pipeline rarely stalls when every instruction is regular. RISC also uses many registers (the <em>load/store</em> model) to keep operands in fast registers instead of slow memory.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Simple ops</div><div class="lz-t">uniform &amp; fast</div><div class="lz-d">easy to pipeline</div></div>
  <div class="lz-step"><div class="lz-k">Load/store</div><div class="lz-t">memory only via 2 ops</div><div class="lz-d">the rest work in registers</div></div>
  <div class="lz-step"><div class="lz-k">Result</div><div class="lz-t">high throughput</div><div class="lz-d">low power per op</div></div>
</div>
<div class="callout ok">The phone in your pocket runs a RISC (ARM) chip — its simplicity means low power, which means long battery life. Modern x86 CPUs are CISC on the outside but translate instructions into RISC-like micro-ops internally, blending both worlds.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Hai triết lý thiết kế tập lệnh</h2>
<p class="lead">Đến thập niên 1980, tập lệnh đã phình to và phức tạp (CISC). Các nhà nghiên cứu đặt một câu hỏi cấp tiến (CLO8): nếu ta làm lệnh <em>đơn giản hơn</em> nhưng chạy nhanh hơn nhiều thì sao? Đó là <strong>RISC</strong>.</p>
<table>
  <thead><tr><th></th><th>CISC (Phức tạp)</th><th>RISC (Rút gọn)</th></tr></thead>
  <tbody>
    <tr><td>Lệnh</td><td>Nhiều, phức tạp, độ dài thay đổi</td><td>Ít, đơn giản, độ dài cố định</td></tr>
    <tr><td>Việc mỗi lệnh</td><td>Một lệnh làm được nhiều</td><td>Mỗi lệnh làm một chút</td></tr>
    <tr><td>Chu kỳ mỗi lệnh</td><td>Thay đổi, thường nhiều</td><td>Gần 1 — thân thiện pipeline</td></tr>
    <tr><td>Truy cập bộ nhớ</td><td>Nhiều lệnh đụng bộ nhớ</td><td>Chỉ LOAD/STORE đụng bộ nhớ</td></tr>
    <tr><td>Ví dụ</td><td>x86 (Intel/AMD)</td><td>ARM (điện thoại), RISC-V</td></tr>
  </tbody>
</table>
<h3>Vì sao RISC thường thắng</h3>
<p>Lệnh đơn giản, đồng đều, độ dài cố định <strong>pipeline rất đẹp</strong> (Chương 12) — pipeline hiếm khi kẹt khi mọi lệnh đều đều đặn. RISC cũng dùng nhiều thanh ghi (mô hình <em>load/store</em>) để giữ toán hạng trong thanh ghi nhanh thay vì bộ nhớ chậm.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Phép đơn giản</div><div class="lz-t">đồng đều &amp; nhanh</div><div class="lz-d">dễ pipeline</div></div>
  <div class="lz-step"><div class="lz-k">Load/store</div><div class="lz-t">bộ nhớ chỉ qua 2 phép</div><div class="lz-d">phần còn lại làm trong thanh ghi</div></div>
  <div class="lz-step"><div class="lz-k">Kết quả</div><div class="lz-t">thông lượng cao</div><div class="lz-d">điện năng thấp mỗi phép</div></div>
</div>
<div class="callout ok">Chiếc điện thoại trong túi bạn chạy chip RISC (ARM) — sự đơn giản của nó nghĩa là điện năng thấp, nghĩa là pin lâu. CPU x86 hiện đại là CISC bên ngoài nhưng dịch lệnh thành micro-op kiểu RISC bên trong, hoà trộn cả hai thế giới.</div>
</div>
`,
        },
        {
          title: 'Chapter 13 Quiz|||Quiz chương 13',
          slug: 'cea201-quiz-ch13',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: RISC vs CISC, load/store, ARM.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'RISC instructions are typically…|||Lệnh RISC thường…', options: ['few, simple and fixed-length|||ít, đơn giản và độ dài cố định', 'many, complex and variable-length|||nhiều, phức tạp và độ dài thay đổi', 'stored on disk|||lưu trên đĩa', 'written by the user|||do người dùng viết'], correctIndex: 0, points: 1 },
              { question: 'In a RISC (load/store) architecture, memory is accessed by…|||Trong kiến trúc RISC (load/store), bộ nhớ được truy cập bởi…', options: ['every instruction|||mọi lệnh', 'only LOAD and STORE instructions|||chỉ lệnh LOAD và STORE', 'no instructions|||không lệnh nào', 'the cache alone|||chỉ cache'], correctIndex: 1, points: 1 },
              { question: 'Why do simple RISC instructions pipeline well?|||Vì sao lệnh RISC đơn giản pipeline tốt?', options: ['they are uniform and regular, so the pipeline rarely stalls|||chúng đồng đều và đều đặn, nên pipeline hiếm khi kẹt', 'they are longer|||chúng dài hơn', 'they avoid registers|||chúng tránh thanh ghi', 'they need no clock|||chúng không cần clock'], correctIndex: 0, points: 1 },
              { question: 'Which is a RISC architecture found in most smartphones?|||Kiến trúc RISC nào có trong hầu hết điện thoại?', options: ['x86', 'ARM', 'VAX', 'System/360'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 14 — ILP & SUPERSCALAR ══════════════════ */
    {
      title: 'Chapter 14 — ILP & Superscalar|||Chương 14 — ILP & Superscalar',
      description: 'Thực thi nhiều lệnh cùng lúc bằng song song mức lệnh.',
      lessons: [
        {
          title: '14.1 — Instruction-level parallelism & superscalar|||14.1 — Song song mức lệnh & superscalar',
          slug: 'cea201-14-1-ilp-superscalar',
          type: 'VIDEO',
          description: 'Làm nhiều lệnh mỗi chu kỳ bằng nhiều đơn vị thực thi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>Doing more than one instruction at once</h2>
<p class="lead">Pipelining finishes about one instruction per cycle. Can we do better? <strong>Superscalar</strong> CPUs go further (CLO9): they have <em>multiple</em> execution units and issue several instructions in the same cycle — exploiting <strong>instruction-level parallelism (ILP)</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Scalar</div><div class="lz-t">1 instr / cycle</div><div class="lz-d">a single pipeline</div></div>
  <div class="lz-step"><div class="lz-k">Superscalar</div><div class="lz-t">2–6 instr / cycle</div><div class="lz-d">multiple pipelines side by side</div></div>
</div>
<p>The key insight: within a program, many nearby instructions are <em>independent</em> — they do not depend on each other&#39;s results, so they can run simultaneously in different execution units.</p>
<h3>Techniques that expose more parallelism</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Out-of-order execution</div><div class="lz-ld">Run instructions as soon as their inputs are ready, not strictly in program order — then commit results in order. Keeps execution units busy.</div></div>
  <div class="lz-layer"><div class="lz-lt">Register renaming</div><div class="lz-ld">Removes false dependencies caused by reusing register names, unlocking more parallelism.</div></div>
  <div class="lz-layer"><div class="lz-lt">Branch prediction &amp; speculation</div><div class="lz-ld">Guess the outcome of a branch and run ahead speculatively, so the pipelines never sit idle waiting.</div></div>
</div>
<div class="callout ok">This is where single-core performance hit its practical ceiling. There is only so much independent work in one instruction stream, and finding it costs enormous, power-hungry hardware. That wall is exactly why the industry pivoted to putting many cores on a chip — the next chapter.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Làm hơn một lệnh cùng lúc</h2>
<p class="lead">Pipeline hoàn tất khoảng một lệnh mỗi chu kỳ. Có thể tốt hơn không? CPU <strong>superscalar</strong> đi xa hơn (CLO9): chúng có <em>nhiều</em> đơn vị thực thi và phát nhiều lệnh trong cùng một chu kỳ — tận dụng <strong>song song mức lệnh (ILP)</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Scalar</div><div class="lz-t">1 lệnh / chu kỳ</div><div class="lz-d">một pipeline đơn</div></div>
  <div class="lz-step"><div class="lz-k">Superscalar</div><div class="lz-t">2–6 lệnh / chu kỳ</div><div class="lz-d">nhiều pipeline song song</div></div>
</div>
<p>Ý tưởng then chốt: trong một chương trình, nhiều lệnh gần nhau <em>độc lập</em> — chúng không phụ thuộc kết quả của nhau, nên có thể chạy đồng thời ở các đơn vị thực thi khác nhau.</p>
<h3>Kỹ thuật khai thác thêm song song</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Thực thi không theo thứ tự (out-of-order)</div><div class="lz-ld">Chạy lệnh ngay khi đầu vào sẵn sàng, không nhất thiết theo thứ tự chương trình — rồi commit kết quả theo thứ tự. Giữ các đơn vị thực thi luôn bận.</div></div>
  <div class="lz-layer"><div class="lz-lt">Đổi tên thanh ghi (register renaming)</div><div class="lz-ld">Loại các phụ thuộc giả do dùng lại tên thanh ghi, mở khoá thêm song song.</div></div>
  <div class="lz-layer"><div class="lz-lt">Dự đoán nhảy &amp; suy đoán (speculation)</div><div class="lz-ld">Đoán kết quả một lệnh nhảy và chạy trước theo suy đoán, để các pipeline không ngồi không chờ.</div></div>
</div>
<div class="callout ok">Đây là nơi hiệu năng đơn nhân chạm trần thực tế. Chỉ có bấy nhiêu việc độc lập trong một luồng lệnh, và tìm ra nó tốn phần cứng khổng lồ, ngốn điện. Bức tường đó chính là lý do ngành xoay sang đặt nhiều nhân trên một chip — chương kế.</div>
</div>
`,
        },
        {
          title: 'Chapter 14 Quiz|||Quiz chương 14',
          slug: 'cea201-quiz-ch14',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: ILP, superscalar, out-of-order, speculation.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'A superscalar CPU can…|||Một CPU superscalar có thể…', options: ['issue several instructions in the same cycle|||phát nhiều lệnh trong cùng một chu kỳ', 'only run one instruction ever|||chỉ chạy một lệnh duy nhất', 'not use a pipeline|||không dùng pipeline', 'run without a clock|||chạy không cần clock'], correctIndex: 0, points: 1 },
              { question: 'Instruction-level parallelism relies on the fact that…|||Song song mức lệnh dựa trên việc…', options: ['all instructions depend on each other|||mọi lệnh phụ thuộc nhau', 'many nearby instructions are independent|||nhiều lệnh gần nhau độc lập', 'the CPU has one core|||CPU có một nhân', 'memory is slow|||bộ nhớ chậm'], correctIndex: 1, points: 1 },
              { question: 'Out-of-order execution runs instructions…|||Thực thi không theo thứ tự chạy lệnh…', options: ['strictly in program order|||đúng theo thứ tự chương trình', 'as soon as their inputs are ready|||ngay khi đầu vào sẵn sàng', 'backwards|||ngược lại', 'never|||không bao giờ'], correctIndex: 1, points: 1 },
              { question: 'Single-core ILP hit a ceiling, pushing the industry toward…|||ILP đơn nhân chạm trần, đẩy ngành tới…', options: ['slower clocks|||clock chậm hơn', 'multicore CPUs|||CPU đa nhân', 'removing cache|||bỏ cache', 'CISC only|||chỉ CISC'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 15 — XỬ LÝ SONG SONG & ĐA NHÂN ══════════════════ */
    {
      title: 'Chapter 15 — Parallel Processing & Multicore|||Chương 15 — Xử lý song song & Đa nhân',
      description: 'Nhiều nhân, SMP, nhất quán cache và GPU.',
      lessons: [
        {
          title: '15.1 — Multicore, SMP & cache coherence|||15.1 — Đa nhân, SMP & nhất quán cache',
          slug: 'cea201-15-1-multicore',
          type: 'VIDEO',
          description: 'Vì sao CPU có nhiều nhân và bài toán giữ cache nhất quán.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>When one core is not enough</h2>
<p class="lead">Because clock speed and single-core ILP hit physical limits, the industry made the great pivot (CLO9): instead of one faster core, put <strong>several cores</strong> on one chip and run work in parallel.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">SMP — Symmetric Multiprocessing</div><div class="lz-ld">Multiple identical cores share main memory equally, coordinated by the OS. This is your multicore laptop.</div></div>
  <div class="lz-layer"><div class="lz-lt">Multicore</div><div class="lz-ld">Several cores on a single chip, often sharing an L3 cache. More cores = more parallel throughput, within power limits.</div></div>
  <div class="lz-layer"><div class="lz-lt">GPUs (GPGPU)</div><div class="lz-ld">Thousands of tiny cores optimized for doing the same operation on masses of data — graphics, and now AI training.</div></div>
</div>
<h3>The cache coherence problem</h3>
<p>Each core has its own cache. If two cores cache the same memory location and one changes it, the other&#39;s copy is now stale. <strong>Cache coherence</strong> protocols (like MESI) keep all caches consistent, tracking which core has the current value and invalidating stale copies.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Core A writes X</div><div class="lz-t">its cache updated</div><div class="lz-d">core B still has old X</div></div>
  <div class="lz-step"><div class="lz-k">Coherence protocol</div><div class="lz-t">invalidates B&#39;s copy</div><div class="lz-d">forces a fresh fetch</div></div>
  <div class="lz-step"><div class="lz-k">Result</div><div class="lz-t">all cores agree</div><div class="lz-d">correctness preserved</div></div>
</div>
<div class="callout ok">Remember Amdahl&#39;s law from Chapter 2: adding cores only helps the parts of a program that can run in parallel. This is why writing correct, efficient parallel software is hard and valuable — the hardware gives you cores, but your algorithm must expose the parallelism.</div>
<div class="note-ct">Course wrap-up: you have travelled from architecture vs organization, through performance, the memory hierarchy, I/O and the OS interface, down to digital logic, up through instruction sets, the pipelined processor, RISC, superscalar ILP, and finally multicore. You now understand the machine beneath every line of code you will ever write.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>Khi một nhân là không đủ</h2>
<p class="lead">Vì tốc độ clock và ILP đơn nhân chạm giới hạn vật lý, ngành thực hiện cú xoay lớn (CLO9): thay vì một nhân nhanh hơn, đặt <strong>nhiều nhân</strong> trên một chip và chạy công việc song song.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">SMP — Đa xử lý đối xứng</div><div class="lz-ld">Nhiều nhân giống hệt chia sẻ bộ nhớ chính bình đẳng, do OS điều phối. Đây là laptop đa nhân của bạn.</div></div>
  <div class="lz-layer"><div class="lz-lt">Đa nhân (multicore)</div><div class="lz-ld">Nhiều nhân trên một chip, thường chia sẻ cache L3. Nhiều nhân hơn = thông lượng song song hơn, trong giới hạn điện năng.</div></div>
  <div class="lz-layer"><div class="lz-lt">GPU (GPGPU)</div><div class="lz-ld">Hàng nghìn nhân tí hon tối ưu cho làm cùng một phép trên khối dữ liệu lớn — đồ hoạ, và nay là huấn luyện AI.</div></div>
</div>
<h3>Bài toán nhất quán cache</h3>
<p>Mỗi nhân có cache riêng. Nếu hai nhân cache cùng một vị trí bộ nhớ và một nhân đổi nó, bản sao của nhân kia giờ đã cũ. Các giao thức <strong>nhất quán cache (cache coherence)</strong> (như MESI) giữ mọi cache đồng bộ, theo dõi nhân nào có giá trị hiện tại và vô hiệu hoá bản sao cũ.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nhân A ghi X</div><div class="lz-t">cache của nó cập nhật</div><div class="lz-d">nhân B vẫn giữ X cũ</div></div>
  <div class="lz-step"><div class="lz-k">Giao thức nhất quán</div><div class="lz-t">vô hiệu bản của B</div><div class="lz-d">buộc nạp lại mới</div></div>
  <div class="lz-step"><div class="lz-k">Kết quả</div><div class="lz-t">mọi nhân thống nhất</div><div class="lz-d">giữ đúng đắn</div></div>
</div>
<div class="callout ok">Nhớ định luật Amdahl ở Chương 2: thêm nhân chỉ giúp phần chương trình chạy song song được. Đây là lý do viết phần mềm song song đúng và hiệu quả vừa khó vừa giá trị — phần cứng cho bạn các nhân, nhưng thuật toán của bạn phải bộc lộ được song song.</div>
<div class="note-ct">Tổng kết môn: bạn đã đi từ kiến trúc vs tổ chức, qua hiệu năng, phân cấp bộ nhớ, I/O và giao diện OS, xuống logic số, lên qua tập lệnh, bộ xử lý pipeline, RISC, ILP superscalar, và cuối cùng là đa nhân. Giờ bạn hiểu cỗ máy bên dưới mọi dòng code bạn sẽ viết.</div>
</div>
`,
        },
        {
          title: 'Chapter 15 Quiz|||Quiz chương 15',
          slug: 'cea201-quiz-ch15',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: đa nhân, SMP, GPU, nhất quán cache.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The industry moved to multicore mainly because…|||Ngành chuyển sang đa nhân chủ yếu vì…', options: ['single-core clock speed and ILP hit physical limits|||tốc độ clock và ILP đơn nhân chạm giới hạn vật lý', 'cores are cheaper than cache|||nhân rẻ hơn cache', 'RAM got slower|||RAM chậm đi', 'users demanded it|||người dùng đòi'], correctIndex: 0, points: 1 },
              { question: 'In SMP, the multiple cores…|||Trong SMP, nhiều nhân…', options: ['share main memory equally|||chia sẻ bộ nhớ chính bình đẳng', 'each have separate main memory|||mỗi cái có bộ nhớ chính riêng', 'never communicate|||không bao giờ giao tiếp', 'run different operating systems|||chạy các hệ điều hành khác nhau'], correctIndex: 0, points: 1 },
              { question: 'The cache coherence problem arises because…|||Bài toán nhất quán cache nảy sinh vì…', options: ['caches are too small|||cache quá nhỏ', 'each core has its own cache that can hold stale copies|||mỗi nhân có cache riêng có thể giữ bản sao cũ', 'cores share one cache only|||các nhân chỉ dùng chung một cache', 'there is no main memory|||không có bộ nhớ chính'], correctIndex: 1, points: 1 },
              { question: 'GPUs are optimized for…|||GPU được tối ưu cho…', options: ['running one complex thread|||chạy một luồng phức tạp', 'the same operation on masses of data in parallel|||cùng một phép trên khối dữ liệu lớn song song', 'storing files|||lưu tệp', 'network routing|||định tuyến mạng'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 1 — HỢP NGỮ MARIE ══════════════════ */
    {
      title: 'Advanced 1 — Hands-on assembly with MARIE|||Nâng cao 1 — Thực hành hợp ngữ với MARIE',
      description: 'Ngoài giáo trình — CLO10: viết và chạy một chương trình hợp ngữ thật.',
      lessons: [
        {
          title: 'N1.1 — Write & run a MARIE program|||N1.1 — Viết & chạy một chương trình MARIE',
          slug: 'cea201-n1-1-marie',
          type: 'VIDEO',
          description: 'Từ LOAD/ADD/STORE tới thấy chu trình lệnh chạy từng bước.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 1 · Lesson N1.1</span>
<h2>Seeing the CPU run — MARIE assembly</h2>
<p class="lead">MARIE is a tiny teaching computer whose whole instruction set fits on one page. Writing a program in it makes every abstract idea from this course concrete: registers, the instruction cycle, addressing, opcodes (CLO10).</p>
<h3>A first program — add two numbers</h3>
<pre><span class="tok-comment">/ Add X and Y, store the sum in Z</span>
<span class="tok-function">Load</span> X      <span class="tok-comment">/ AC = value at X</span>
<span class="tok-function">Add</span>  Y      <span class="tok-comment">/ AC = AC + value at Y</span>
<span class="tok-function">Store</span> Z     <span class="tok-comment">/ Z = AC</span>
<span class="tok-function">Halt</span>
X, <span class="tok-function">DEC</span> 5     <span class="tok-comment">/ a data word holding 5</span>
Y, <span class="tok-function">DEC</span> 7
Z, <span class="tok-function">DEC</span> 0</pre>
<div class="out"><b>After running:</b> Z holds 12. Single-step it and watch AC (accumulator) and PC change each cycle.</div>
<h3>What you actually observe</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">PC</div><div class="lz-t">advances each fetch</div><div class="lz-d">the instruction cycle, live</div></div>
  <div class="lz-step"><div class="lz-k">AC</div><div class="lz-t">holds the running result</div><div class="lz-d">the accumulator model</div></div>
  <div class="lz-step"><div class="lz-k">Memory</div><div class="lz-t">X, Y, Z change</div><div class="lz-d">Load/Store in action</div></div>
</div>
<p>MARIE uses <strong>1-address</strong> instructions with an implied accumulator (Chapter 10) and <strong>direct addressing</strong> (Chapter 11). Running it, you literally watch the fetch–decode–execute cycle (Chapter 12) advance one step at a time.</p>
<div class="callout ok">This single exercise ties Chapters 10, 11 and 12 together and satisfies CLO10 (use a simulator). If you only do one hands-on activity in CEA201, do this — abstract concepts become obvious once you watch the accumulator fill up.</div>
<a class="link-card exphub" href="/exp-hub/cea201-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">Open MARIE &amp; try this program</span><span class="lc-sub">Web-based MARIE simulator link + quick-start on the CEA201 tools guide.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 1 · Bài N1.1</span>
<h2>Thấy CPU chạy — hợp ngữ MARIE</h2>
<p class="lead">MARIE là một máy tính dạy học tí hon mà cả tập lệnh vừa một trang giấy. Viết một chương trình trong nó làm mọi ý tưởng trừu tượng của môn này trở nên cụ thể: thanh ghi, chu trình lệnh, addressing, opcode (CLO10).</p>
<h3>Chương trình đầu tiên — cộng hai số</h3>
<pre><span class="tok-comment">/ Cộng X và Y, lưu tổng vào Z</span>
<span class="tok-function">Load</span> X      <span class="tok-comment">/ AC = giá trị tại X</span>
<span class="tok-function">Add</span>  Y      <span class="tok-comment">/ AC = AC + giá trị tại Y</span>
<span class="tok-function">Store</span> Z     <span class="tok-comment">/ Z = AC</span>
<span class="tok-function">Halt</span>
X, <span class="tok-function">DEC</span> 5     <span class="tok-comment">/ một ô dữ liệu chứa 5</span>
Y, <span class="tok-function">DEC</span> 7
Z, <span class="tok-function">DEC</span> 0</pre>
<div class="out"><b>Sau khi chạy:</b> Z chứa 12. Chạy từng bước và xem AC (thanh ghi tích luỹ) và PC đổi mỗi chu kỳ.</div>
<h3>Bạn thực sự quan sát được gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">PC</div><div class="lz-t">tiến mỗi lần nạp</div><div class="lz-d">chu trình lệnh, trực tiếp</div></div>
  <div class="lz-step"><div class="lz-k">AC</div><div class="lz-t">giữ kết quả đang chạy</div><div class="lz-d">mô hình tích luỹ</div></div>
  <div class="lz-step"><div class="lz-k">Bộ nhớ</div><div class="lz-t">X, Y, Z thay đổi</div><div class="lz-d">Load/Store trong hành động</div></div>
</div>
<p>MARIE dùng lệnh <strong>1 địa chỉ</strong> với thanh ghi tích luỹ ngầm (Chương 10) và <strong>direct addressing</strong> (Chương 11). Chạy nó, bạn đúng nghĩa xem chu trình nạp–giải mã–thực thi (Chương 12) tiến từng bước.</p>
<div class="callout ok">Bài tập đơn lẻ này buộc Chương 10, 11 và 12 lại với nhau và thoả CLO10 (dùng simulator). Nếu bạn chỉ làm một hoạt động thực hành trong CEA201, hãy làm cái này — khái niệm trừu tượng trở nên hiển nhiên khi bạn xem thanh ghi tích luỹ đầy dần.</div>
<a class="link-card exphub" href="/exp-hub/cea201-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-organization-and-architecture%2Flearn&reflabel=CEA201%20%E2%80%94%20Computer%20Organization%20and%20Architecture" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">Mở MARIE &amp; thử chương trình này</span><span class="lc-sub">Link MARIE simulator trên web + hướng dẫn nhanh ở guide công cụ CEA201.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 2 — CPU HIỆN ĐẠI ══════════════════ */
    {
      title: 'Advanced 2 — Inside a modern CPU|||Nâng cao 2 — Bên trong một CPU hiện đại',
      description: 'Ngoài giáo trình: dự đoán nhánh, thực thi suy đoán và out-of-order kết hợp thế nào.',
      lessons: [
        {
          title: 'N2.1 — Branch prediction & speculation|||N2.1 — Dự đoán nhánh & suy đoán',
          slug: 'cea201-n2-1-branch-prediction',
          type: 'VIDEO',
          description: 'Cách CPU đoán tương lai để giữ pipeline luôn đầy.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 2 · Lesson N2.1</span>
<h2>How modern CPUs stay busy — prediction &amp; speculation</h2>
<p class="lead">A deep pipeline (Chapter 12) has a problem: when it hits a branch (an if or a loop), it does not yet know which way execution goes — but it must keep fetching to stay full. The solution is to <strong>guess</strong>, run ahead, and undo if wrong.</p>
<h3>Branch prediction</h3>
<p>A <strong>branch predictor</strong> guesses whether a branch will be taken, using the history of past outcomes. Loops, for example, are taken almost every time, so predicting "taken" is right on nearly every iteration. Modern predictors are astonishingly accurate — over 95%.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Predict</div><div class="lz-t">taken / not taken</div><div class="lz-d">from branch history</div></div>
  <div class="lz-step"><div class="lz-k">Speculate</div><div class="lz-t">run the guessed path</div><div class="lz-d">keep pipelines full</div></div>
  <div class="lz-step"><div class="lz-k">Verify</div><div class="lz-t">right? commit · wrong? flush</div><div class="lz-d">discard speculative work</div></div>
</div>
<h3>It all works together</h3>
<p>A modern core combines everything from this course at once: <strong>superscalar</strong> width (several instructions/cycle), <strong>out-of-order</strong> execution (run when ready), <strong>register renaming</strong> (remove false dependencies), and <strong>speculation</strong> (guess past branches). Together they extract far more parallelism from one instruction stream than a simple pipeline ever could.</p>
<div class="note-ct">A mispredicted branch is expensive — the whole speculative pipeline is thrown away. This is why unpredictable branches (data-dependent conditions in a hot loop) can quietly halve performance, and why compilers and programmers sometimes restructure code to be branch-friendly.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 2 · Bài N2.1</span>
<h2>CPU hiện đại luôn bận thế nào — dự đoán &amp; suy đoán</h2>
<p class="lead">Một pipeline sâu (Chương 12) có một vấn đề: khi gặp một lệnh nhảy (if hoặc loop), nó chưa biết thực thi đi hướng nào — nhưng phải tiếp tục nạp để giữ ống đầy. Giải pháp là <strong>đoán</strong>, chạy trước, và hoàn tác nếu sai.</p>
<h3>Dự đoán nhánh</h3>
<p>Một <strong>bộ dự đoán nhánh (branch predictor)</strong> đoán một lệnh nhảy có được thực hiện không, dựa vào lịch sử các kết quả trước. Ví dụ vòng lặp gần như luôn nhảy, nên đoán "nhảy" đúng gần như mọi lần lặp. Bộ dự đoán hiện đại chính xác đáng kinh ngạc — trên 95%.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Đoán</div><div class="lz-t">nhảy / không nhảy</div><div class="lz-d">từ lịch sử nhánh</div></div>
  <div class="lz-step"><div class="lz-k">Suy đoán</div><div class="lz-t">chạy đường đã đoán</div><div class="lz-d">giữ pipeline đầy</div></div>
  <div class="lz-step"><div class="lz-k">Kiểm</div><div class="lz-t">đúng? commit · sai? xả</div><div class="lz-d">bỏ công việc suy đoán</div></div>
</div>
<h3>Tất cả hoạt động cùng nhau</h3>
<p>Một nhân hiện đại kết hợp mọi thứ của môn này cùng lúc: bề rộng <strong>superscalar</strong> (vài lệnh/chu kỳ), thực thi <strong>out-of-order</strong> (chạy khi sẵn sàng), <strong>đổi tên thanh ghi</strong> (bỏ phụ thuộc giả), và <strong>suy đoán</strong> (đoán qua nhánh). Cùng nhau chúng rút được nhiều song song từ một luồng lệnh hơn nhiều so với pipeline đơn giản.</p>
<div class="note-ct">Một dự đoán nhánh sai rất tốn — cả pipeline suy đoán bị vứt đi. Đây là lý do các nhánh khó đoán (điều kiện phụ thuộc dữ liệu trong một vòng lặp nóng) có thể âm thầm làm giảm nửa hiệu năng, và vì sao trình biên dịch và lập trình viên đôi khi tái cấu trúc code cho thân thiện nhánh.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 3 — BẢO MẬT CPU (CAPSTONE) ══════════════════ */
    {
      title: 'Advanced 3 — When speed becomes a security hole|||Nâng cao 3 — Khi tốc độ thành lỗ hổng bảo mật',
      description: 'Ngoài giáo trình — bài tổng kết: Spectre/Meltdown và cái giá của tối ưu.',
      lessons: [
        {
          title: 'N3.1 — Spectre, Meltdown & the cost of optimization|||N3.1 — Spectre, Meltdown & cái giá của tối ưu',
          slug: 'cea201-n3-1-spectre-meltdown',
          type: 'VIDEO',
          description: 'Khi dự đoán nhánh và cache vô tình rò rỉ bí mật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 3 · Lesson N3.1</span>
<h2>The dark side of going fast</h2>
<p class="lead">Every performance trick in this course — caches, speculation, out-of-order execution — was designed for speed, assuming they were invisible to software. In 2018, <strong>Spectre</strong> and <strong>Meltdown</strong> shattered that assumption: attackers found that these hidden optimizations leak secrets. A perfect capstone tying the whole course together.</p>
<h3>The idea, simplified</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Speculate</div><div class="lz-t">CPU runs ahead of a branch</div><div class="lz-d">Ch 14 &amp; Adv 2</div></div>
  <div class="lz-step"><div class="lz-k">Touch secret</div><div class="lz-t">speculatively reads data it should not</div><div class="lz-d">result later discarded…</div></div>
  <div class="lz-step"><div class="lz-k">Leak via cache</div><div class="lz-t">but it left a trace in the cache</div><div class="lz-d">Ch 4 timing reveals it</div></div>
</div>
<p>The speculative work is thrown away for <em>correctness</em> — but it already changed the <strong>cache</strong> state. By carefully timing later memory accesses (a cache hit is faster than a miss, Chapter 4), an attacker can deduce the secret value the CPU briefly touched. The architecture stayed "correct"; the organization leaked.</p>
<div class="callout warn">This is the deepest lesson of CEA201: <strong>abstractions leak</strong>. The neat separation of architecture (what) and organization (how) from Chapter 1 turned out to be imperfect — the hidden "how" (speculation + cache timing) became observable, and therefore a security vulnerability affecting nearly every CPU on Earth.</div>
<h3>Why it matters to you</h3>
<p>Fixes required microcode updates, OS changes, and sometimes disabling optimizations — costing real performance. It reshaped how CPUs are designed and reviewed. Understanding it requires <em>everything</em> in this course: pipelining, speculation, caches, and the architecture/organization boundary.</p>
<div class="note-ct">Congratulations on finishing CEA201. You started asking "what happens in the hardware when my code runs?" — now you can trace a program from a high-level line, through the instruction set, into the pipelined superscalar core, across the cache hierarchy, and even understand how a timing side-channel can betray a secret. That is the machine, understood.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 3 · Bài N3.1</span>
<h2>Mặt tối của việc chạy nhanh</h2>
<p class="lead">Mọi thủ thuật hiệu năng trong môn này — cache, suy đoán, thực thi out-of-order — được thiết kế cho tốc độ, giả định chúng vô hình với phần mềm. Năm 2018, <strong>Spectre</strong> và <strong>Meltdown</strong> đập tan giả định đó: kẻ tấn công phát hiện các tối ưu ẩn này rò rỉ bí mật. Một bài tổng kết hoàn hảo buộc cả môn lại với nhau.</p>
<h3>Ý tưởng, đơn giản hoá</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Suy đoán</div><div class="lz-t">CPU chạy trước một nhánh</div><div class="lz-d">Ch 14 &amp; Nâng cao 2</div></div>
  <div class="lz-step"><div class="lz-k">Chạm bí mật</div><div class="lz-t">đọc suy đoán dữ liệu không được phép</div><div class="lz-d">kết quả sau bị bỏ…</div></div>
  <div class="lz-step"><div class="lz-k">Rò qua cache</div><div class="lz-t">nhưng để lại dấu vết trong cache</div><div class="lz-d">Ch 4: đo thời gian lộ ra</div></div>
</div>
<p>Công việc suy đoán bị vứt để giữ <em>đúng đắn</em> — nhưng nó đã đổi trạng thái <strong>cache</strong>. Bằng cách đo cẩn thận thời gian các truy cập bộ nhớ sau (cache hit nhanh hơn miss, Chương 4), kẻ tấn công suy ra được giá trị bí mật mà CPU vừa chạm thoáng qua. Kiến trúc vẫn "đúng"; tổ chức thì rò rỉ.</p>
<div class="callout warn">Đây là bài học sâu nhất của CEA201: <strong>trừu tượng bị rò (abstractions leak)</strong>. Sự tách bạch gọn gàng giữa kiến trúc (cái gì) và tổ chức (làm sao) ở Chương 1 hoá ra không hoàn hảo — cái "làm sao" ẩn (suy đoán + đo thời gian cache) trở nên quan sát được, và do đó thành một lỗ hổng bảo mật ảnh hưởng gần như mọi CPU trên Trái Đất.</div>
<h3>Vì sao điều này quan trọng với bạn</h3>
<p>Các bản vá cần cập nhật microcode, thay đổi OS, và đôi khi tắt bớt tối ưu — trả giá bằng hiệu năng thật. Nó định hình lại cách CPU được thiết kế và rà soát. Hiểu nó cần <em>mọi thứ</em> trong môn này: pipeline, suy đoán, cache, và ranh giới kiến trúc/tổ chức.</p>
<div class="note-ct">Chúc mừng bạn hoàn thành CEA201. Bạn bắt đầu với câu hỏi "điều gì xảy ra trong phần cứng khi code của tôi chạy?" — giờ bạn có thể lần một chương trình từ một dòng bậc cao, qua tập lệnh, vào nhân superscalar pipeline, xuyên qua phân cấp cache, và thậm chí hiểu một kênh phụ thời gian có thể phản bội một bí mật ra sao. Đó là cỗ máy, đã được thấu hiểu.</div>
</div>
`,
        },
      ],
    },
  ],
};
