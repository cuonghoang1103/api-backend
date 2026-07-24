/**
 * MAD101 — Discrete Mathematics (Toán rời rạc). Kỳ 2.
 * Bám giáo trình Kenneth Rosen "Discrete Mathematics and Its Applications"
 * + chương nâng cao. Song ngữ EN/VN realtime (khối .ml-en / .ml-vi, tiêu đề EN|||VI).
 * Công thức dùng ký hiệu Unicode + khối .out ví dụ; sơ đồ .lz-map/.lz-flow/.lz-stack.
 * Luyện thuật toán/đồ thị → CodeLab + /algorithms; công cụ → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/MAD101.mjs --apply
 */
export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'MAD101',
    slug: 'discrete-mathematics',
    title: 'Discrete Mathematics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The math of computer science: logic & proofs, sets & functions, algorithm complexity, number theory, induction & recursion, counting, and graphs & trees — the reasoning toolkit behind every algorithm.|||Toán học của khoa học máy tính: logic & chứng minh, tập hợp & hàm, độ phức tạp thuật toán, số học, quy nạp & đệ quy, đếm, và đồ thị & cây — bộ công cụ suy luận đằng sau mọi thuật toán.',
    description: 'Môn toán nền tảng cho tư duy thuật toán, dựa trên giáo trình Rosen. Học logic mệnh đề & vị từ, tập hợp & hàm, độ phức tạp (Big-O), số học & đồng dư, quy nạp & đệ quy, tổ hợp & đếm, đồ thị & cây. Là nền cho CSD201, DBI202 và mọi môn thuật toán.',
    whatYouLearn: 'Biến đổi biểu thức logic & suy luận; thao tác trên tập hợp, hàm, dãy; đánh giá độ phức tạp thuật toán (Big-O); số học mô-đun & đồng dư; chứng minh bằng quy nạp; định nghĩa đệ quy & hệ thức truy hồi; giải bài toán đếm & tổ hợp; phân tích đồ thị, tìm đường đi ngắn nhất; cấu trúc cây & cây khung nhỏ nhất.',
    requirements: 'Không có môn tiên quyết. Cần nền toán phổ thông và tư duy logic tốt. Có một Programming Assignment nên biết lập trình cơ bản là lợi thế.',
    documentsNote: 'Giáo trình: Discrete Mathematics and Its Applications — Kenneth H. Rosen. Công cụ: bộ tạo bảng chân trị, WolframAlpha, Python (networkx cho đồ thị). Kèm file syllabus gốc MAD101.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, học ra sao, điều kiện qua môn, lộ trình và công cụ.',
      lessons: [
        {
          title: '0.1 — About MAD101 & the course map|||0.1 — Giới thiệu MAD101 & bản đồ môn học',
          slug: 'mad101-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Toán rời rạc là gì, vì sao dân IT phải học, và bản đồ 8 lĩnh vực.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About MAD101 — Discrete Mathematics</h2>
<p class="lead">MAE101 covered <em>continuous</em> math (calculus, smooth curves). MAD101 covers <strong>discrete</strong> math — the mathematics of <em>separate, countable</em> objects: true/false values, whole numbers, finite sets, graphs. This is the native mathematics of computers, because a computer is fundamentally a discrete, logical machine.</p>
<p>Why it matters: <strong>every algorithm rests on discrete math.</strong> Logic underlies conditions and circuits; counting underlies probability and efficiency; graph theory underlies networks, maps and social media; induction underlies recursion and proofs of correctness. This is the reasoning course that makes you a real computer scientist, not just a coder.</p>
<h3>Course map — 8 core areas</h3>
<div class="lz-map">
  <div class="lz-stage">Reasoning &amp; structure</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Logic &amp; Proofs</div><div class="lz-nsub">Propositions · truth tables · quantifiers</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Sets, Functions &amp; Sequences</div><div class="lz-nsub">The building blocks</div></div></div>
  <div class="lz-stage">Algorithms &amp; numbers</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Complexity (Big-O)</div><div class="lz-nsub">How fast does an algorithm grow?</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Number Theory</div><div class="lz-nsub">Division · modular arithmetic · crypto</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Induction &amp; Recursion</div><div class="lz-nsub">Prove &amp; define step by step</div></div></div>
  <div class="lz-stage">Counting &amp; connections</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Counting &amp; Combinatorics</div><div class="lz-nsub">Permutations · combinations · recurrences</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Graphs</div><div class="lz-nsub">Networks · shortest paths (Dijkstra)</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Trees</div><div class="lz-nsub">Hierarchies · spanning trees</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Discrete math in code · why it powers CS</div><div class="lz-nsub">From theory to real algorithms</div></div></div>
</div>
<p>MAD101 is the mathematical prerequisite for <span class="badge">CSD201</span> (Data Structures &amp; Algorithms), <span class="badge">DBI202</span> (databases use set theory &amp; logic), and any algorithms or AI work. It pairs naturally with the Algorithm Visualizer here.</p>
<div class="callout ok">Discrete math is learned by <strong>doing proofs and solving problems</strong>, not memorizing. For every rule, work through an example by hand. The chapter quizzes test whether you can apply the ideas, which is exactly what the exams check.</div>
<a class="link-card exphub" href="/exp-hub/mad101-cong-cu-hoc-tap?ref=%2Fcourses%2Fdiscrete-mathematics%2Flearn&reflabel=MAD101%20%E2%80%94%20Discrete%20Mathematics" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Tools for MAD101 — truth tables, WolframAlpha, graphs</span><span class="lc-sub">Free tools to check logic, arithmetic and graph work — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu MAD101 — Toán rời rạc</h2>
<p class="lead">MAE101 phủ toán <em>liên tục</em> (giải tích, đường cong trơn). MAD101 phủ toán <strong>rời rạc</strong> — toán học của các đối tượng <em>tách biệt, đếm được</em>: giá trị đúng/sai, số nguyên, tập hữu hạn, đồ thị. Đây là toán học "bản địa" của máy tính, vì máy tính về cơ bản là một cỗ máy rời rạc, logic.</p>
<p>Vì sao quan trọng: <strong>mọi thuật toán đều dựa trên toán rời rạc.</strong> Logic là nền của điều kiện và mạch; đếm là nền của xác suất và hiệu năng; lý thuyết đồ thị là nền của mạng, bản đồ và mạng xã hội; quy nạp là nền của đệ quy và chứng minh đúng đắn. Đây là môn suy luận biến bạn thành nhà khoa học máy tính thật, không chỉ người code.</p>
<h3>Bản đồ môn học — 8 lĩnh vực cốt lõi</h3>
<div class="lz-map">
  <div class="lz-stage">Suy luận &amp; cấu trúc</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Logic &amp; Chứng minh</div><div class="lz-nsub">Mệnh đề · bảng chân trị · lượng từ</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Tập hợp, Hàm &amp; Dãy</div><div class="lz-nsub">Các viên gạch nền</div></div></div>
  <div class="lz-stage">Thuật toán &amp; số</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Độ phức tạp (Big-O)</div><div class="lz-nsub">Thuật toán tăng nhanh thế nào?</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Số học (Number Theory)</div><div class="lz-nsub">Chia hết · số học mô-đun · mã hoá</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Quy nạp &amp; Đệ quy</div><div class="lz-nsub">Chứng minh &amp; định nghĩa từng bước</div></div></div>
  <div class="lz-stage">Đếm &amp; kết nối</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Đếm &amp; Tổ hợp</div><div class="lz-nsub">Chỉnh hợp · tổ hợp · hệ thức truy hồi</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Đồ thị (Graphs)</div><div class="lz-nsub">Mạng lưới · đường đi ngắn nhất (Dijkstra)</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Cây (Trees)</div><div class="lz-nsub">Phân cấp · cây khung</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Toán rời rạc trong code · vì sao nó vận hành CS</div><div class="lz-nsub">Từ lý thuyết tới thuật toán thật</div></div></div>
</div>
<p>MAD101 là tiên quyết toán cho <span class="badge">CSD201</span> (Cấu trúc dữ liệu &amp; Giải thuật), <span class="badge">DBI202</span> (CSDL dùng lý thuyết tập hợp &amp; logic), và mọi việc thuật toán hay AI. Nó đi cặp tự nhiên với Algorithm Visualizer ở đây.</p>
<div class="callout ok">Toán rời rạc học bằng <strong>làm chứng minh và giải bài</strong>, không phải học thuộc. Với mỗi quy tắc, làm một ví dụ bằng tay. Quiz các chương kiểm bạn áp dụng được ý tưởng — đúng thứ mà bài thi kiểm.</div>
<a class="link-card exphub" href="/exp-hub/mad101-cong-cu-hoc-tap?ref=%2Fcourses%2Fdiscrete-mathematics%2Flearn&reflabel=MAD101%20%E2%80%94%20Discrete%20Mathematics" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Công cụ cho MAD101 — bảng chân trị, WolframAlpha, đồ thị</span><span class="lc-sub">Công cụ miễn phí để kiểm logic, số học và đồ thị — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'mad101-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết, điểm sàn qua môn và trọng số từng cột điểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">From the official MAD101 syllabus. On-going work (progress tests + assignments) is 60% — steady practice wins.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class + 1h exam + 104h self-study</small></span></div>
  <div class="kv"><span class="k">Sessions</span><span class="v">60 sessions</span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of sessions</span></div>
</div>
<h3>Grade structure</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Progress Test</td><td>30%</td><td>3 quizzes (30 min each): PT1 logic/sets/counting, PT2 complexity/number theory/induction, PT3 graphs/trees</td></tr>
    <tr><td>Assignments / Exercises</td><td>20%</td><td>2 problem-set assignments</td></tr>
    <tr><td>Programming Assignment</td><td>10%</td><td>Implement an algorithm (complexity/number theory/graph/tree)</td></tr>
    <tr><td>Final Exam</td><td>40%</td><td>60 minutes — must score ≥ 4 to pass</td></tr>
  </tbody>
</table>
<div class="callout warn">Two gates: weighted average ≥ 5.0 AND the final exam ≥ 4.0. Discrete math is cumulative and proof-based — you cannot memorize your way through. Do every exercise and the small programming assignment; they teach exactly what the final tests.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Từ syllabus chính thức MAD101. Điểm quá trình (progress test + assignment) là 60% — luyện đều là thắng.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h học + 1h thi + 104h tự học</small></span></div>
  <div class="kv"><span class="k">Số buổi</span><span class="v">60 buổi</span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% số buổi</span></div>
</div>
<h3>Cấu trúc điểm</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Progress Test</td><td>30%</td><td>3 quiz (30 phút/bài): PT1 logic/tập hợp/đếm, PT2 độ phức tạp/số học/quy nạp, PT3 đồ thị/cây</td></tr>
    <tr><td>Bài tập / Assignment</td><td>20%</td><td>2 assignment bộ bài</td></tr>
    <tr><td>Programming Assignment</td><td>10%</td><td>Cài đặt một thuật toán (độ phức tạp/số học/đồ thị/cây)</td></tr>
    <tr><td>Thi cuối kỳ</td><td>40%</td><td>60 phút — phải đạt ≥ 4 mới qua môn</td></tr>
  </tbody>
</table>
<div class="callout warn">Hai cửa: trung bình có trọng số ≥ 5.0 VÀ thi cuối ≥ 4.0. Toán rời rạc tích luỹ và dựa trên chứng minh — không thể học thuộc mà qua. Làm mọi bài tập và bài programming nhỏ; chúng dạy đúng thứ bài thi cuối kiểm.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning outcomes (8 CLOs)|||0.3 — Chuẩn đầu ra (8 CLO)',
          slug: 'mad101-chuan-dau-ra',
          type: 'VIDEO',
          description: '8 kỹ năng nhà trường cam kết bạn làm được — checklist ôn thi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The 8 Course Learning Outcomes (CLOs)</h2>
<p class="lead">Each CLO is a concrete skill you demonstrate by solving problems. They map onto the chapters and are your revision checklist.</p>
<table>
  <thead><tr><th>#</th><th>You will be able to…</th><th>Covered in</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Manipulate logical expressions &amp; use logic for inference</td><td>Chapter 1</td></tr>
    <tr><td>CLO2</td><td>Perform operations on sets, functions and sequences</td><td>Chapter 2</td></tr>
    <tr><td>CLO3</td><td>Analyse algorithms and determine their complexity</td><td>Chapter 3</td></tr>
    <tr><td>CLO4</td><td>Apply modular arithmetic &amp; analyse integer algorithms</td><td>Chapter 4</td></tr>
    <tr><td>CLO5</td><td>Use induction and recursive definitions to prove/define</td><td>Chapter 5</td></tr>
    <tr><td>CLO6</td><td>Solve counting problems</td><td>Chapter 6</td></tr>
    <tr><td>CLO7</td><td>Analyse graphs &amp; find shortest paths in weighted graphs</td><td>Chapter 7</td></tr>
    <tr><td>CLO8</td><td>Analyse trees &amp; describe algorithms using trees</td><td>Chapter 8</td></tr>
  </tbody>
</table>
<div class="note-ct">Notice how many CLOs connect to algorithms (complexity, graphs, trees, counting). MAD101 is the theory; CSD201 is where you code it. Learning it well now makes the algorithms courses far easier.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>8 Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">Mỗi CLO là một kỹ năng cụ thể bạn thể hiện bằng cách giải bài. Chúng khớp với các chương và là checklist ôn tập của bạn.</p>
<table>
  <thead><tr><th>#</th><th>Bạn sẽ làm được…</th><th>Học ở</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Biến đổi biểu thức logic &amp; dùng logic để suy luận</td><td>Chương 1</td></tr>
    <tr><td>CLO2</td><td>Thao tác trên tập hợp, hàm và dãy</td><td>Chương 2</td></tr>
    <tr><td>CLO3</td><td>Phân tích thuật toán và xác định độ phức tạp</td><td>Chương 3</td></tr>
    <tr><td>CLO4</td><td>Áp dụng số học mô-đun &amp; phân tích thuật toán trên số nguyên</td><td>Chương 4</td></tr>
    <tr><td>CLO5</td><td>Dùng quy nạp và định nghĩa đệ quy để chứng minh/định nghĩa</td><td>Chương 5</td></tr>
    <tr><td>CLO6</td><td>Giải bài toán đếm</td><td>Chương 6</td></tr>
    <tr><td>CLO7</td><td>Phân tích đồ thị &amp; tìm đường đi ngắn nhất trong đồ thị có trọng số</td><td>Chương 7</td></tr>
    <tr><td>CLO8</td><td>Phân tích cây &amp; mô tả thuật toán dùng cây</td><td>Chương 8</td></tr>
  </tbody>
</table>
<div class="note-ct">Để ý nhiều CLO nối với thuật toán (độ phức tạp, đồ thị, cây, đếm). MAD101 là lý thuyết; CSD201 là nơi bạn code nó. Học tốt bây giờ làm các môn thuật toán dễ hơn nhiều.</div>
</div>
`,
        },
        {
          title: '0.4 — Materials, tools & how to study|||0.4 — Tài liệu, công cụ & cách học',
          slug: 'mad101-tai-lieu',
          type: 'VIDEO',
          description: 'Giáo trình Rosen, công cụ kiểm tra và cách học toán chứng minh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials, tools &amp; how to study</h2>
<h3>Textbook</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Discrete Mathematics and Its Applications — Kenneth H. Rosen</div><div class="lz-ld">The world standard for this course. Every chapter here follows Rosen. It is packed with worked examples and exercises — the exercises are where the learning happens.</div></div>
</div>
<h3>Tools to check your work</h3>
<ul>
  <li>A <strong>truth-table generator</strong> to verify logical equivalences.</li>
  <li><strong>WolframAlpha</strong> for modular arithmetic, combinations and quick checks.</li>
  <li><strong>Python</strong> (with networkx) or a graph drawer for the graph/tree chapters and the programming assignment.</li>
</ul>
<h3>How to study a proof-based course</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Read</div><div class="lz-t">the definition</div><div class="lz-d">precisely — words matter</div></div>
  <div class="lz-step"><div class="lz-k">Work</div><div class="lz-t">an example</div><div class="lz-d">by hand, fully</div></div>
  <div class="lz-step"><div class="lz-k">Prove</div><div class="lz-t">try it yourself</div><div class="lz-d">then check</div></div>
  <div class="lz-step"><div class="lz-k">Connect</div><div class="lz-t">to algorithms</div><div class="lz-d">why does a coder care?</div></div>
</div>
<div class="callout ok">Discrete math rewards precision. A proof is either valid or not; a definition means exactly what it says. Slow down, be exact, and always ask "why is this true?" rather than "what is the formula?" That habit is the real skill.</div>
<a class="link-card exphub" href="/exp-hub/mad101-cong-cu-hoc-tap?ref=%2Fcourses%2Fdiscrete-mathematics%2Flearn&reflabel=MAD101%20%E2%80%94%20Discrete%20Mathematics" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Truth tables, WolframAlpha &amp; graph tools</span><span class="lc-sub">Set-up links to check your MAD101 work.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu, công cụ &amp; cách học</h2>
<h3>Giáo trình</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Discrete Mathematics and Its Applications — Kenneth H. Rosen</div><div class="lz-ld">Chuẩn thế giới cho môn này. Mọi chương ở đây bám Rosen. Đầy ví dụ có lời giải và bài tập — bài tập là nơi việc học diễn ra.</div></div>
</div>
<h3>Công cụ để kiểm bài</h3>
<ul>
  <li>Một <strong>bộ tạo bảng chân trị</strong> để kiểm các tương đương logic.</li>
  <li><strong>WolframAlpha</strong> cho số học mô-đun, tổ hợp và kiểm nhanh.</li>
  <li><strong>Python</strong> (với networkx) hoặc công cụ vẽ đồ thị cho chương đồ thị/cây và bài programming.</li>
</ul>
<h3>Cách học một môn dựa trên chứng minh</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Đọc</div><div class="lz-t">định nghĩa</div><div class="lz-d">chính xác — từ ngữ quan trọng</div></div>
  <div class="lz-step"><div class="lz-k">Làm</div><div class="lz-t">một ví dụ</div><div class="lz-d">bằng tay, đầy đủ</div></div>
  <div class="lz-step"><div class="lz-k">Chứng minh</div><div class="lz-t">tự thử</div><div class="lz-d">rồi kiểm</div></div>
  <div class="lz-step"><div class="lz-k">Nối</div><div class="lz-t">với thuật toán</div><div class="lz-d">vì sao người code quan tâm?</div></div>
</div>
<div class="callout ok">Toán rời rạc thưởng cho sự chính xác. Một chứng minh hoặc đúng hoặc không; một định nghĩa nghĩa đúng điều nó nói. Chậm lại, chính xác, và luôn hỏi "vì sao điều này đúng?" thay vì "công thức là gì?" Thói quen đó mới là kỹ năng thật.</div>
<a class="link-card exphub" href="/exp-hub/mad101-cong-cu-hoc-tap?ref=%2Fcourses%2Fdiscrete-mathematics%2Flearn&reflabel=MAD101%20%E2%80%94%20Discrete%20Mathematics" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Bảng chân trị, WolframAlpha &amp; công cụ đồ thị</span><span class="lc-sub">Link cài đặt để kiểm bài MAD101 của bạn.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — LOGIC & CHỨNG MINH ══════════════════ */
    {
      title: 'Chapter 1 — Logic & Proofs|||Chương 1 — Logic & Chứng minh',
      description: 'Mệnh đề, phép nối logic, bảng chân trị, tương đương và lượng từ.',
      lessons: [
        {
          title: '1.1 — Propositional logic|||1.1 — Logic mệnh đề',
          slug: 'mad101-1-1-logic-menh-de',
          type: 'VIDEO',
          description: 'Mệnh đề, các phép nối AND/OR/NOT/kéo theo và bảng chân trị.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The language of truth</h2>
<p class="lead">A <strong>proposition</strong> is a statement that is either true or false — never both (CLO1). "2 + 2 = 4" is a proposition (true); "x + 1 = 5" is not (it depends on x). Logic combines propositions with <strong>connectives</strong>.</p>
<table>
  <thead><tr><th>Connective</th><th>Symbol</th><th>Meaning</th><th>True when</th></tr></thead>
  <tbody>
    <tr><td>Negation (NOT)</td><td>¬p</td><td>not p</td><td>p is false</td></tr>
    <tr><td>Conjunction (AND)</td><td>p ∧ q</td><td>p and q</td><td>both true</td></tr>
    <tr><td>Disjunction (OR)</td><td>p ∨ q</td><td>p or q</td><td>at least one true</td></tr>
    <tr><td>Implication</td><td>p → q</td><td>if p then q</td><td>false only when p true, q false</td></tr>
    <tr><td>Biconditional</td><td>p ↔ q</td><td>p if and only if q</td><td>p and q have the same value</td></tr>
  </tbody>
</table>
<h3>Truth tables</h3>
<p>A <strong>truth table</strong> lists every combination of inputs and the result — the definitive way to evaluate a compound proposition.</p>
<div class="out"><b>p → q</b> (implication)<br>p=T, q=T → T<br>p=T, q=F → <b>F</b>  ← the only false case<br>p=F, q=T → T<br>p=F, q=F → T</div>
<div class="pitfall">The implication p → q trips everyone up: it is <strong>only false when p is true but q is false</strong>. "If it rains, I bring an umbrella" is not broken on a sunny day (p false) — the promise only fails if it rains and you have no umbrella.</div>
<div class="note-ct">This is the exact logic behind if-statements and boolean expressions in every programming language — and behind the digital logic gates of CEA201. Propositional logic is where hardware and software meet.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Ngôn ngữ của chân lý</h2>
<p class="lead">Một <strong>mệnh đề (proposition)</strong> là một khẳng định hoặc đúng hoặc sai — không bao giờ cả hai (CLO1). "2 + 2 = 4" là mệnh đề (đúng); "x + 1 = 5" thì không (phụ thuộc x). Logic kết hợp các mệnh đề bằng <strong>phép nối (connective)</strong>.</p>
<table>
  <thead><tr><th>Phép nối</th><th>Ký hiệu</th><th>Ý nghĩa</th><th>Đúng khi</th></tr></thead>
  <tbody>
    <tr><td>Phủ định (NOT)</td><td>¬p</td><td>không p</td><td>p sai</td></tr>
    <tr><td>Hội (AND)</td><td>p ∧ q</td><td>p và q</td><td>cả hai đúng</td></tr>
    <tr><td>Tuyển (OR)</td><td>p ∨ q</td><td>p hoặc q</td><td>ít nhất một đúng</td></tr>
    <tr><td>Kéo theo</td><td>p → q</td><td>nếu p thì q</td><td>sai chỉ khi p đúng, q sai</td></tr>
    <tr><td>Tương đương</td><td>p ↔ q</td><td>p khi và chỉ khi q</td><td>p và q cùng giá trị</td></tr>
  </tbody>
</table>
<h3>Bảng chân trị</h3>
<p>Một <strong>bảng chân trị (truth table)</strong> liệt kê mọi tổ hợp đầu vào và kết quả — cách dứt khoát để tính một mệnh đề phức hợp.</p>
<div class="out"><b>p → q</b> (kéo theo)<br>p=T, q=T → T<br>p=T, q=F → <b>F</b>  ← trường hợp sai duy nhất<br>p=F, q=T → T<br>p=F, q=F → T</div>
<div class="pitfall">Phép kéo theo p → q làm ai cũng vấp: nó <strong>chỉ sai khi p đúng nhưng q sai</strong>. "Nếu trời mưa, tôi mang ô" không bị vi phạm vào ngày nắng (p sai) — lời hứa chỉ hỏng nếu trời mưa mà bạn không có ô.</div>
<div class="note-ct">Đây đúng là logic đằng sau câu if và biểu thức boolean trong mọi ngôn ngữ lập trình — và đằng sau các cổng logic số của CEA201. Logic mệnh đề là nơi phần cứng và phần mềm gặp nhau.</div>
</div>
`,
        },
        {
          title: '1.2 — Equivalences & predicate logic|||1.2 — Tương đương & logic vị từ',
          slug: 'mad101-1-2-tuong-duong-vi-tu',
          type: 'VIDEO',
          description: 'Tương đương logic, De Morgan và lượng từ ∀ ∃.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Logical equivalence</h2>
<p class="lead">Two propositions are <strong>logically equivalent</strong> (≡) if they have the same truth table. Equivalences let you simplify complex logical expressions (CLO1) — the same idea as simplifying Boolean circuits in CEA201.</p>
<div class="out"><b>De Morgan&#39;s laws:</b><br>¬(p ∧ q) ≡ (¬p ∨ ¬q)<br>¬(p ∨ q) ≡ (¬p ∧ ¬q)</div>
<p>Other key ones: p → q ≡ ¬p ∨ q (rewrite implication), double negation ¬(¬p) ≡ p, and the distributive laws.</p>
<h3>Predicate logic &amp; quantifiers</h3>
<p>Propositional logic cannot express "every student passes." <strong>Predicate logic</strong> adds variables and <strong>quantifiers</strong>:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Universal ∀x P(x)</div><div class="lz-ld">"for ALL x, P(x) is true." True only if P holds for every x.</div></div>
  <div class="lz-layer"><div class="lz-lt">Existential ∃x P(x)</div><div class="lz-ld">"there EXISTS an x with P(x)." True if at least one x works.</div></div>
</div>
<div class="out"><b>Negating quantifiers (De Morgan for quantifiers):</b><br>¬∀x P(x) ≡ ∃x ¬P(x)  <small>("not all pass" = "someone fails")</small><br>¬∃x P(x) ≡ ∀x ¬P(x)</div>
<div class="callout ok">Quantifiers are everywhere in computer science: database queries ("find all users where…"), loop conditions ("for every element…"), and program specifications ("there exists an index such that…"). Predicate logic is how we state precisely what a program must do.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Tương đương logic</h2>
<p class="lead">Hai mệnh đề <strong>tương đương logic</strong> (≡) nếu chúng có cùng bảng chân trị. Tương đương cho bạn rút gọn các biểu thức logic phức tạp (CLO1) — cùng ý tưởng rút gọn mạch Boole ở CEA201.</p>
<div class="out"><b>Luật De Morgan:</b><br>¬(p ∧ q) ≡ (¬p ∨ ¬q)<br>¬(p ∨ q) ≡ (¬p ∧ ¬q)</div>
<p>Vài cái quan trọng khác: p → q ≡ ¬p ∨ q (viết lại kéo theo), phủ định kép ¬(¬p) ≡ p, và các luật phân phối.</p>
<h3>Logic vị từ &amp; lượng từ</h3>
<p>Logic mệnh đề không diễn đạt được "mọi sinh viên đều đậu." <strong>Logic vị từ (predicate logic)</strong> thêm biến và <strong>lượng từ (quantifier)</strong>:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Với mọi ∀x P(x)</div><div class="lz-ld">"với MỌI x, P(x) đúng." Đúng chỉ khi P đúng với mọi x.</div></div>
  <div class="lz-layer"><div class="lz-lt">Tồn tại ∃x P(x)</div><div class="lz-ld">"TỒN TẠI một x với P(x)." Đúng nếu ít nhất một x thoả.</div></div>
</div>
<div class="out"><b>Phủ định lượng từ (De Morgan cho lượng từ):</b><br>¬∀x P(x) ≡ ∃x ¬P(x)  <small>("không phải ai cũng đậu" = "có người rớt")</small><br>¬∃x P(x) ≡ ∀x ¬P(x)</div>
<div class="callout ok">Lượng từ có ở khắp khoa học máy tính: truy vấn CSDL ("tìm mọi user mà…"), điều kiện vòng lặp ("với mọi phần tử…"), và đặc tả chương trình ("tồn tại một chỉ số sao cho…"). Logic vị từ là cách ta phát biểu chính xác chương trình phải làm gì.</div>
</div>
`,
        },
        {
          title: 'Chapter 1 Quiz|||Quiz chương 1',
          slug: 'mad101-quiz-ch1',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: mệnh đề, phép nối, kéo theo, De Morgan, lượng từ.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The implication p → q is FALSE only when…|||Kéo theo p → q SAI chỉ khi…', options: ['p and q are both true|||p và q đều đúng', 'p is true and q is false|||p đúng và q sai', 'p is false|||p sai', 'both are false|||cả hai sai'], correctIndex: 1, points: 1 },
              { question: 'p ∧ q (conjunction) is true when…|||p ∧ q (hội) đúng khi…', options: ['at least one is true|||ít nhất một đúng', 'both p and q are true|||cả p và q đều đúng', 'both are false|||cả hai sai', 'p implies q|||p kéo theo q'], correctIndex: 1, points: 1 },
              { question: 'By De Morgan, ¬(p ∧ q) is equivalent to…|||Theo De Morgan, ¬(p ∧ q) tương đương với…', options: ['¬p ∧ ¬q', '¬p ∨ ¬q', 'p ∨ q', 'p → q'], correctIndex: 1, points: 1 },
              { question: 'The quantifier ∀x P(x) means…|||Lượng từ ∀x P(x) nghĩa là…', options: ['there exists an x with P(x)|||tồn tại một x với P(x)', 'for all x, P(x) is true|||với mọi x, P(x) đúng', 'no x satisfies P|||không x nào thoả P', 'exactly one x satisfies P|||đúng một x thoả P'], correctIndex: 1, points: 1 },
              { question: '¬∀x P(x) is equivalent to…|||¬∀x P(x) tương đương với…', options: ['∀x ¬P(x)', '∃x ¬P(x)', '∀x P(x)', '∃x P(x)'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — TẬP HỢP, HÀM & DÃY ══════════════════ */
    {
      title: 'Chapter 2 — Sets, Functions & Sequences|||Chương 2 — Tập hợp, Hàm & Dãy',
      description: 'Tập hợp và phép toán, hàm và tính chất, dãy và tổng.',
      lessons: [
        {
          title: '2.1 — Sets & set operations|||2.1 — Tập hợp & phép toán tập hợp',
          slug: 'mad101-2-1-tap-hop',
          type: 'VIDEO',
          description: 'Phần tử, tập con, hợp, giao, hiệu, phần bù và lực lượng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Sets — collections of distinct objects</h2>
<p class="lead">A <strong>set</strong> is an unordered collection of distinct elements (CLO2). We write x ∈ A ("x is in A"). Sets are the foundation of all mathematics and of relational databases.</p>
<table>
  <thead><tr><th>Operation</th><th>Symbol</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>Union</td><td>A ∪ B</td><td>elements in A OR B</td></tr>
    <tr><td>Intersection</td><td>A ∩ B</td><td>elements in A AND B</td></tr>
    <tr><td>Difference</td><td>A − B</td><td>in A but not B</td></tr>
    <tr><td>Complement</td><td>Ā</td><td>everything not in A</td></tr>
    <tr><td>Subset</td><td>A ⊆ B</td><td>every element of A is in B</td></tr>
  </tbody>
</table>
<div class="out"><b>Example:</b>  A = {1, 2, 3},  B = {2, 3, 4}<br>A ∪ B = {1, 2, 3, 4}   ·   A ∩ B = {2, 3}   ·   A − B = {1}</div>
<p>The <strong>cardinality</strong> |A| is the number of elements. The <strong>empty set</strong> ∅ has none. The <strong>power set</strong> P(A) is the set of all subsets — and |P(A)| = 2<sup>|A|</sup>.</p>
<div class="note-ct">Notice set operations mirror the logic connectives: union ≈ OR, intersection ≈ AND, complement ≈ NOT. That is no accident — a set is defined by a predicate ("the set of x where P(x)"), so set algebra and logic algebra are two views of the same thing. SQL queries are set operations in disguise.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Tập hợp — bộ sưu tập các đối tượng phân biệt</h2>
<p class="lead">Một <strong>tập hợp (set)</strong> là một bộ sưu tập không thứ tự các phần tử phân biệt (CLO2). Ta viết x ∈ A ("x thuộc A"). Tập hợp là nền của mọi toán học và của cơ sở dữ liệu quan hệ.</p>
<table>
  <thead><tr><th>Phép toán</th><th>Ký hiệu</th><th>Ý nghĩa</th></tr></thead>
  <tbody>
    <tr><td>Hợp</td><td>A ∪ B</td><td>phần tử trong A HOẶC B</td></tr>
    <tr><td>Giao</td><td>A ∩ B</td><td>phần tử trong A VÀ B</td></tr>
    <tr><td>Hiệu</td><td>A − B</td><td>trong A nhưng không trong B</td></tr>
    <tr><td>Phần bù</td><td>Ā</td><td>mọi thứ không trong A</td></tr>
    <tr><td>Tập con</td><td>A ⊆ B</td><td>mọi phần tử của A đều trong B</td></tr>
  </tbody>
</table>
<div class="out"><b>Ví dụ:</b>  A = {1, 2, 3},  B = {2, 3, 4}<br>A ∪ B = {1, 2, 3, 4}   ·   A ∩ B = {2, 3}   ·   A − B = {1}</div>
<p><strong>Lực lượng (cardinality)</strong> |A| là số phần tử. <strong>Tập rỗng</strong> ∅ không có phần tử. <strong>Tập luỹ thừa</strong> P(A) là tập mọi tập con — và |P(A)| = 2<sup>|A|</sup>.</p>
<div class="note-ct">Để ý các phép tập hợp phản chiếu các phép nối logic: hợp ≈ OR, giao ≈ AND, phần bù ≈ NOT. Không phải ngẫu nhiên — một tập được định nghĩa bởi một vị từ ("tập các x mà P(x)"), nên đại số tập hợp và đại số logic là hai góc nhìn của cùng một thứ. Truy vấn SQL là phép tập hợp trá hình.</div>
</div>
`,
        },
        {
          title: '2.2 — Functions & sequences|||2.2 — Hàm & dãy',
          slug: 'mad101-2-2-ham-day',
          type: 'VIDEO',
          description: 'Hàm và tính chất (đơn ánh/toàn ánh/song ánh), dãy và tổng Σ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Functions — mappings between sets</h2>
<p class="lead">A <strong>function</strong> f: A → B assigns each element of A (the domain) exactly one element of B (CLO2). Three properties classify functions:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Injective (one-to-one)</div><div class="lz-ld">Different inputs give different outputs — no two x map to the same y.</div></div>
  <div class="lz-layer"><div class="lz-lt">Surjective (onto)</div><div class="lz-ld">Every element of B is hit by some x.</div></div>
  <div class="lz-layer"><div class="lz-lt">Bijective</div><div class="lz-ld">Both — a perfect one-to-one pairing. Only bijections have an inverse.</div></div>
</div>
<h3>Sequences &amp; summations</h3>
<p>A <strong>sequence</strong> is an ordered list indexed by integers, like a<sub>n</sub> = 2n giving 2, 4, 6, 8, … A <strong>summation</strong> adds terms:</p>
<div class="out">Σ<sub>i=1</sub><sup>n</sup> i  =  1 + 2 + … + n  =  n(n+1)/2<br><small>Example: Σ<sub>i=1</sub><sup>100</sup> i = 100·101/2 = 5050</small></div>
<p>Geometric sequences (each term times a ratio r) and their sums appear constantly in algorithm analysis — e.g. the total work in a divide-and-conquer algorithm.</p>
<div class="note-ct">Functions model everything in CS: a hash function maps keys to slots, an encryption function must be bijective (so it can be reversed), and a program itself is a function from input to output. Summations quantify how much work a loop does — the bridge to Chapter 3&#39;s complexity.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Hàm — ánh xạ giữa các tập</h2>
<p class="lead">Một <strong>hàm (function)</strong> f: A → B gán mỗi phần tử của A (miền xác định) đúng một phần tử của B (CLO2). Ba tính chất phân loại hàm:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Đơn ánh (injective / one-to-one)</div><div class="lz-ld">Đầu vào khác nhau cho đầu ra khác nhau — không hai x nào ánh xạ về cùng một y.</div></div>
  <div class="lz-layer"><div class="lz-lt">Toàn ánh (surjective / onto)</div><div class="lz-ld">Mọi phần tử của B đều được một x nào đó ánh tới.</div></div>
  <div class="lz-layer"><div class="lz-lt">Song ánh (bijective)</div><div class="lz-ld">Cả hai — một ghép cặp một-một hoàn hảo. Chỉ song ánh mới có hàm ngược.</div></div>
</div>
<h3>Dãy &amp; tổng</h3>
<p>Một <strong>dãy (sequence)</strong> là một danh sách có thứ tự đánh chỉ số bằng số nguyên, như a<sub>n</sub> = 2n cho 2, 4, 6, 8, … Một <strong>tổng (summation)</strong> cộng các số hạng:</p>
<div class="out">Σ<sub>i=1</sub><sup>n</sup> i  =  1 + 2 + … + n  =  n(n+1)/2<br><small>Ví dụ: Σ<sub>i=1</sub><sup>100</sup> i = 100·101/2 = 5050</small></div>
<p>Dãy hình học (mỗi số hạng nhân một tỉ số r) và tổng của chúng xuất hiện liên tục trong phân tích thuật toán — ví dụ tổng công việc trong một thuật toán chia để trị.</p>
<div class="note-ct">Hàm mô hình mọi thứ trong CS: một hàm băm ánh xạ khoá tới ô, một hàm mã hoá phải song ánh (để đảo ngược được), và bản thân một chương trình là một hàm từ đầu vào tới đầu ra. Tổng lượng hoá vòng lặp làm bao nhiêu việc — cầu nối tới độ phức tạp ở Chương 3.</div>
</div>
`,
        },
        {
          title: 'Chapter 2 Quiz|||Quiz chương 2',
          slug: 'mad101-quiz-ch2',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: phép tập hợp, lực lượng, hàm, tổng.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'For A = {1,2,3}, B = {2,3,4}, A ∩ B is…|||Với A = {1,2,3}, B = {2,3,4}, A ∩ B là…', options: ['{1,2,3,4}', '{2,3}', '{1}', '{4}'], correctIndex: 1, points: 1 },
              { question: 'The power set of a set with 3 elements has how many subsets?|||Tập luỹ thừa của một tập 3 phần tử có bao nhiêu tập con?', options: ['3', '6', '8', '9'], correctIndex: 2, points: 1 },
              { question: 'A function where different inputs always give different outputs is…|||Một hàm mà đầu vào khác luôn cho đầu ra khác là…', options: ['surjective|||toàn ánh', 'injective (one-to-one)|||đơn ánh (một-một)', 'constant|||hằng', 'not a function|||không phải hàm'], correctIndex: 1, points: 1 },
              { question: 'Which type of function has an inverse?|||Loại hàm nào có hàm ngược?', options: ['injective only|||chỉ đơn ánh', 'surjective only|||chỉ toàn ánh', 'bijective|||song ánh', 'any function|||hàm bất kỳ'], correctIndex: 2, points: 1 },
              { question: 'Σ(i=1 to n) i equals…|||Σ(i=1 tới n) i bằng…', options: ['n²', 'n(n+1)/2', '2n', 'n+1'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 1 ══════════════════ */
    {
      title: 'Progress Test 1 (Logic & Sets — CLO1–2)|||Progress Test 1 (Logic & Tập hợp — CLO1–2)',
      description: 'Ôn: logic mệnh đề/vị từ, tập hợp, hàm & dãy.',
      lessons: [
        {
          title: 'Progress Test 1 — review|||Progress Test 1 — ôn tổng hợp',
          slug: 'mad101-progress-test-1',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 1–2.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A proposition is a statement that is…|||Một mệnh đề là một khẳng định…', options: ['always true|||luôn đúng', 'either true or false (not both)|||hoặc đúng hoặc sai (không cả hai)', 'a question|||một câu hỏi', 'about variables|||về biến'], correctIndex: 1, points: 1 },
              { question: 'p → q is logically equivalent to…|||p → q tương đương logic với…', options: ['p ∧ q', '¬p ∨ q', 'p ∨ q', '¬p ∧ q'], correctIndex: 1, points: 1 },
              { question: '"Not all students passed" is written as…|||"Không phải mọi sinh viên đều đậu" viết là…', options: ['∀x ¬P(x)', '∃x ¬P(x)', '∀x P(x)', '¬∃x P(x)'], correctIndex: 1, points: 1 },
              { question: 'A ∪ B contains elements that are in…|||A ∪ B chứa các phần tử ở…', options: ['both A and B|||cả A và B', 'A or B (or both)|||A hoặc B (hoặc cả hai)', 'A but not B|||A nhưng không B', 'neither|||không tập nào'], correctIndex: 1, points: 1 },
              { question: 'A bijective function is both…|||Một hàm song ánh vừa…', options: ['constant and linear|||hằng và tuyến tính', 'injective and surjective|||đơn ánh và toàn ánh', 'even and odd|||chẵn và lẻ', 'finite and infinite|||hữu hạn và vô hạn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — ĐỘ PHỨC TẠP (BIG-O) ══════════════════ */
    {
      title: 'Chapter 3 — Algorithm Complexity (Big-O)|||Chương 3 — Độ phức tạp thuật toán (Big-O)',
      description: 'Đánh giá tốc độ tăng của thuật toán bằng ký hiệu Big-O.',
      lessons: [
        {
          title: '3.1 — The growth of functions & Big-O|||3.1 — Sự tăng của hàm & Big-O',
          slug: 'mad101-3-1-big-o',
          type: 'VIDEO',
          description: 'Đo độ phức tạp thuật toán độc lập với máy tính.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Measuring an algorithm without a stopwatch</h2>
<p class="lead">How fast is an algorithm? Not in seconds (that depends on the machine) but in how its work <strong>grows</strong> with input size n (CLO3). <strong>Big-O notation</strong> captures this growth rate — the single most important idea for comparing algorithms.</p>
<p>Big-O gives an <em>upper bound</em>: f(n) is O(g(n)) if, for large n, f grows no faster than a constant times g. We keep only the dominant term and drop constants: 3n² + 5n + 2 is O(n²).</p>
<table>
  <thead><tr><th>Big-O</th><th>Name</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>O(1)</td><td>Constant</td><td>array access by index</td></tr>
    <tr><td>O(log n)</td><td>Logarithmic</td><td>binary search</td></tr>
    <tr><td>O(n)</td><td>Linear</td><td>a single loop over n items</td></tr>
    <tr><td>O(n log n)</td><td>Linearithmic</td><td>merge sort, quicksort</td></tr>
    <tr><td>O(n²)</td><td>Quadratic</td><td>nested loops, bubble sort</td></tr>
    <tr><td>O(2ⁿ)</td><td>Exponential</td><td>brute-force subsets — infeasible</td></tr>
  </tbody>
</table>
<h3>How to find the Big-O of code</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Count</div><div class="lz-t">loops</div><div class="lz-d">one loop over n → O(n)</div></div>
  <div class="lz-step"><div class="lz-k">Nest</div><div class="lz-t">loop in loop</div><div class="lz-d">→ multiply: O(n²)</div></div>
  <div class="lz-step"><div class="lz-k">Halve</div><div class="lz-t">divide problem</div><div class="lz-d">→ O(log n)</div></div>
</div>
<div class="callout ok">Big-O is why algorithm choice matters more than hardware. An O(n log n) sort finishes a million items in moments; an O(n²) sort on the same data does a trillion operations. This is the exact idea you met in CSI104&#39;s advanced lesson — here you learn to derive it formally.</div>
<a class="link-card codelab" href="/algorithms?ref=%2Fcourses%2Fdiscrete-mathematics%2Flearn&reflabel=MAD101%20%E2%80%94%20Discrete%20Mathematics" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Watch complexity in action</span><span class="lc-sub">Compare O(n) vs O(n log n) vs O(n²) sorts on the Algorithm Visualizer.</span></span>
  <span class="lc-cta">VISUALIZE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Đo một thuật toán mà không cần đồng hồ bấm giờ</h2>
<p class="lead">Một thuật toán nhanh thế nào? Không phải bằng giây (tuỳ máy) mà bằng cách công việc của nó <strong>tăng</strong> theo kích thước đầu vào n (CLO3). <strong>Ký hiệu Big-O</strong> nắm bắt tốc độ tăng này — ý tưởng quan trọng nhất để so sánh thuật toán.</p>
<p>Big-O cho một <em>chặn trên</em>: f(n) là O(g(n)) nếu, với n lớn, f tăng không nhanh hơn một hằng số nhân g. Ta chỉ giữ số hạng trội nhất và bỏ hằng số: 3n² + 5n + 2 là O(n²).</p>
<table>
  <thead><tr><th>Big-O</th><th>Tên</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>O(1)</td><td>Hằng số</td><td>truy cập mảng theo chỉ số</td></tr>
    <tr><td>O(log n)</td><td>Logarit</td><td>tìm nhị phân</td></tr>
    <tr><td>O(n)</td><td>Tuyến tính</td><td>một vòng lặp qua n phần tử</td></tr>
    <tr><td>O(n log n)</td><td>Tuyến-logarit</td><td>merge sort, quicksort</td></tr>
    <tr><td>O(n²)</td><td>Bậc hai</td><td>vòng lồng, bubble sort</td></tr>
    <tr><td>O(2ⁿ)</td><td>Luỹ thừa</td><td>vét cạn tập con — bất khả thi</td></tr>
  </tbody>
</table>
<h3>Cách tìm Big-O của code</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Đếm</div><div class="lz-t">vòng lặp</div><div class="lz-d">một vòng qua n → O(n)</div></div>
  <div class="lz-step"><div class="lz-k">Lồng</div><div class="lz-t">vòng trong vòng</div><div class="lz-d">→ nhân: O(n²)</div></div>
  <div class="lz-step"><div class="lz-k">Cắt đôi</div><div class="lz-t">chia bài toán</div><div class="lz-d">→ O(log n)</div></div>
</div>
<div class="callout ok">Big-O là lý do chọn thuật toán quan trọng hơn phần cứng. Một sort O(n log n) xong một triệu phần tử trong khoảnh khắc; một sort O(n²) trên cùng dữ liệu làm một nghìn tỷ phép. Đây đúng ý tưởng bạn gặp ở bài nâng cao CSI104 — ở đây bạn học suy ra nó một cách hình thức.</div>
<a class="link-card codelab" href="/algorithms?ref=%2Fcourses%2Fdiscrete-mathematics%2Flearn&reflabel=MAD101%20%E2%80%94%20Discrete%20Mathematics" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Xem độ phức tạp chạy động</span><span class="lc-sub">So sánh sort O(n) vs O(n log n) vs O(n²) trên Algorithm Visualizer.</span></span>
  <span class="lc-cta">TRỰC QUAN →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 3 Quiz|||Quiz chương 3',
          slug: 'mad101-quiz-ch3',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: Big-O, tốc độ tăng, độ phức tạp code.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Big-O notation measures…|||Ký hiệu Big-O đo…', options: ['exact seconds|||số giây chính xác', 'how an algorithm\'s work grows with input size|||công việc của thuật toán tăng thế nào theo kích thước đầu vào', 'memory only|||chỉ bộ nhớ', 'the number of lines of code|||số dòng code'], correctIndex: 1, points: 1 },
              { question: '3n² + 5n + 2 is O(…)|||3n² + 5n + 2 là O(…)', options: ['O(n)', 'O(n²)', 'O(n³)', 'O(1)'], correctIndex: 1, points: 1 },
              { question: 'Two nested loops over n items give complexity…|||Hai vòng lặp lồng qua n phần tử cho độ phức tạp…', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctIndex: 2, points: 1 },
              { question: 'Binary search has complexity…|||Tìm nhị phân có độ phức tạp…', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(2ⁿ)'], correctIndex: 1, points: 1 },
              { question: 'Which growth rate is best (fastest) for large n?|||Tốc độ tăng nào tốt nhất (nhanh nhất) với n lớn?', options: ['O(2ⁿ)', 'O(n²)', 'O(n)', 'O(log n)'], correctIndex: 3, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — SỐ HỌC ══════════════════ */
    {
      title: 'Chapter 4 — Number Theory|||Chương 4 — Số học',
      description: 'Chia hết, số học mô-đun, ước chung lớn nhất và ứng dụng mã hoá.',
      lessons: [
        {
          title: '4.1 — Division & modular arithmetic|||4.1 — Chia hết & số học mô-đun',
          slug: 'mad101-4-1-so-hoc-mo-dun',
          type: 'VIDEO',
          description: 'Chia hết, phép mod, đồng dư, GCD và vì sao mã hoá cần chúng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>The math of whole numbers</h2>
<p class="lead"><strong>Number theory</strong> (CLO4) studies integers — divisibility, primes, and especially <strong>modular arithmetic</strong>, the "clock arithmetic" that powers cryptography, hashing and error detection.</p>
<h3>Division &amp; the mod operator</h3>
<p>For integers, a = qd + r where 0 ≤ r &lt; d. The remainder r is <code>a mod d</code>. On a 12-hour clock, 15 mod 12 = 3 — numbers "wrap around."</p>
<div class="out"><b>17 mod 5 = 2</b>  (since 17 = 3·5 + 2)<br><b>Congruence:</b>  a ≡ b (mod m) means m divides (a − b)<br>17 ≡ 2 (mod 5), and 22 ≡ 2 (mod 5)</div>
<h3>GCD — greatest common divisor</h3>
<p>The <strong>GCD</strong> of two integers is the largest number dividing both. The <strong>Euclidean algorithm</strong> finds it fast by repeated remainders:</p>
<div class="out"><b>gcd(48, 18):</b>  48 mod 18 = 12 → gcd(18, 12); 18 mod 12 = 6 → gcd(12, 6); 12 mod 6 = 0 → <b>gcd = 6</b></div>
<h3>Why cryptography needs this</h3>
<p>Modular arithmetic is the backbone of <strong>encryption</strong>. RSA (the padlock in your browser, CEA201/CSI104) works because certain modular operations are easy one way but practically impossible to reverse without a secret key. Prime numbers and mod are the whole game.</p>
<div class="note-ct">The mod operator is everywhere in code: hash tables use <code>key mod tableSize</code> to pick a slot; a checksum uses mod to detect errors; a circular buffer wraps with mod. This "small" chapter quietly powers security and data structures alike.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Toán học của số nguyên</h2>
<p class="lead"><strong>Số học (number theory)</strong> (CLO4) nghiên cứu số nguyên — tính chia hết, số nguyên tố, và đặc biệt là <strong>số học mô-đun (modular arithmetic)</strong>, "số học đồng hồ" vận hành mã hoá, băm và phát hiện lỗi.</p>
<h3>Chia hết &amp; phép mod</h3>
<p>Với số nguyên, a = qd + r với 0 ≤ r &lt; d. Số dư r là <code>a mod d</code>. Trên đồng hồ 12 giờ, 15 mod 12 = 3 — các số "quay vòng."</p>
<div class="out"><b>17 mod 5 = 2</b>  (vì 17 = 3·5 + 2)<br><b>Đồng dư:</b>  a ≡ b (mod m) nghĩa là m chia hết (a − b)<br>17 ≡ 2 (mod 5), và 22 ≡ 2 (mod 5)</div>
<h3>GCD — ước chung lớn nhất</h3>
<p><strong>GCD</strong> của hai số nguyên là số lớn nhất chia hết cả hai. <strong>Thuật toán Euclid</strong> tìm nó nhanh bằng số dư liên tiếp:</p>
<div class="out"><b>gcd(48, 18):</b>  48 mod 18 = 12 → gcd(18, 12); 18 mod 12 = 6 → gcd(12, 6); 12 mod 6 = 0 → <b>gcd = 6</b></div>
<h3>Vì sao mã hoá cần điều này</h3>
<p>Số học mô-đun là xương sống của <strong>mã hoá</strong>. RSA (ổ khoá trong trình duyệt bạn, CEA201/CSI104) chạy được vì vài phép mô-đun dễ theo một chiều nhưng gần như bất khả đảo ngược nếu không có khoá bí mật. Số nguyên tố và mod là toàn bộ trò chơi.</p>
<div class="note-ct">Phép mod có khắp nơi trong code: bảng băm dùng <code>key mod tableSize</code> để chọn ô; một checksum dùng mod để phát hiện lỗi; một circular buffer quay vòng bằng mod. Chương "nhỏ" này âm thầm vận hành cả bảo mật lẫn cấu trúc dữ liệu.</div>
</div>
`,
        },
        {
          title: 'Chapter 4 Quiz|||Quiz chương 4',
          slug: 'mad101-quiz-ch4',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: mod, đồng dư, GCD, Euclid, ứng dụng.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: '17 mod 5 equals…|||17 mod 5 bằng…', options: ['2', '3', '0', '5'], correctIndex: 0, points: 1 },
              { question: 'a ≡ b (mod m) means…|||a ≡ b (mod m) nghĩa là…', options: ['a equals b|||a bằng b', 'm divides (a − b)|||m chia hết (a − b)', 'a divides m|||a chia hết m', 'a > b'], correctIndex: 1, points: 1 },
              { question: 'The Euclidean algorithm computes…|||Thuật toán Euclid tính…', options: ['the sum of two numbers|||tổng hai số', 'the GCD of two integers|||GCD của hai số nguyên', 'a factorial|||một giai thừa', 'a prime|||một số nguyên tố'], correctIndex: 1, points: 1 },
              { question: 'gcd(48, 18) equals…|||gcd(48, 18) bằng…', options: ['12', '6', '3', '18'], correctIndex: 1, points: 1 },
              { question: 'Modular arithmetic is essential to…|||Số học mô-đun thiết yếu cho…', options: ['graph coloring|||tô màu đồ thị', 'cryptography and hashing|||mã hoá và băm', 'calculus|||giải tích', 'sorting|||sắp xếp'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — QUY NẠP & ĐỆ QUY ══════════════════ */
    {
      title: 'Chapter 5 — Induction & Recursion|||Chương 5 — Quy nạp & Đệ quy',
      description: 'Chứng minh bằng quy nạp toán học và định nghĩa đệ quy.',
      lessons: [
        {
          title: '5.1 — Mathematical induction & recursion|||5.1 — Quy nạp toán học & đệ quy',
          slug: 'mad101-5-1-quy-nap',
          type: 'VIDEO',
          description: 'Chứng minh một mệnh đề đúng với mọi n, và định nghĩa đệ quy.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Proving something true for ALL n</h2>
<p class="lead">How do you prove a statement holds for every natural number — infinitely many cases? <strong>Mathematical induction</strong> (CLO5) does it in two steps, like knocking over an infinite line of dominoes.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Base case</div><div class="lz-t">prove P(1)</div><div class="lz-d">the first domino falls</div></div>
  <div class="lz-step"><div class="lz-k">Inductive step</div><div class="lz-t">P(k) → P(k+1)</div><div class="lz-d">each domino knocks the next</div></div>
  <div class="lz-step"><div class="lz-k">Conclusion</div><div class="lz-t">P(n) for all n</div><div class="lz-d">all dominoes fall</div></div>
</div>
<div class="out"><b>Prove:</b>  1 + 2 + … + n = n(n+1)/2<br><b>Base (n=1):</b>  1 = 1·2/2 = 1 ✓<br><b>Step:</b> assume true for k. Then for k+1:<br>(1+…+k) + (k+1) = k(k+1)/2 + (k+1) = (k+1)(k+2)/2 ✓</b></div>
<h3>Recursive definitions</h3>
<p>A <strong>recursive definition</strong> defines something in terms of smaller versions of itself, with a base case to stop. The factorial:</p>
<div class="out">n! = 1 if n = 0  (base case)<br>n! = n · (n−1)! if n &gt; 0  (recursive case)</div>
<p>Induction and recursion are two sides of one coin: recursion <em>builds</em> objects from smaller ones; induction <em>proves</em> things about them. This is the mathematical foundation of every recursive function you write.</p>
<div class="callout ok">Recursion in code (a function calling itself) will feel natural once you see it as a recursive definition. And to prove a recursive function is correct, you use induction. MAD101 gives you the theory that makes recursion trustworthy — vital for CSD201.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Chứng minh một điều đúng với MỌI n</h2>
<p class="lead">Làm sao chứng minh một mệnh đề đúng với mọi số tự nhiên — vô số trường hợp? <strong>Quy nạp toán học (mathematical induction)</strong> (CLO5) làm điều đó trong hai bước, như xô đổ một hàng domino vô hạn.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Cơ sở</div><div class="lz-t">chứng minh P(1)</div><div class="lz-d">quân domino đầu đổ</div></div>
  <div class="lz-step"><div class="lz-k">Bước quy nạp</div><div class="lz-t">P(k) → P(k+1)</div><div class="lz-d">mỗi quân đổ quân kế</div></div>
  <div class="lz-step"><div class="lz-k">Kết luận</div><div class="lz-t">P(n) với mọi n</div><div class="lz-d">mọi quân domino đổ</div></div>
</div>
<div class="out"><b>Chứng minh:</b>  1 + 2 + … + n = n(n+1)/2<br><b>Cơ sở (n=1):</b>  1 = 1·2/2 = 1 ✓<br><b>Bước:</b> giả sử đúng với k. Khi đó với k+1:<br>(1+…+k) + (k+1) = k(k+1)/2 + (k+1) = (k+1)(k+2)/2 ✓</b></div>
<h3>Định nghĩa đệ quy</h3>
<p>Một <strong>định nghĩa đệ quy</strong> định nghĩa một thứ qua các phiên bản nhỏ hơn của chính nó, với một trường hợp cơ sở để dừng. Giai thừa:</p>
<div class="out">n! = 1 nếu n = 0  (trường hợp cơ sở)<br>n! = n · (n−1)! nếu n &gt; 0  (trường hợp đệ quy)</div>
<p>Quy nạp và đệ quy là hai mặt của một đồng xu: đệ quy <em>xây</em> đối tượng từ cái nhỏ hơn; quy nạp <em>chứng minh</em> điều về chúng. Đây là nền toán học của mọi hàm đệ quy bạn viết.</p>
<div class="callout ok">Đệ quy trong code (một hàm gọi chính nó) sẽ thấy tự nhiên khi bạn nhìn nó như một định nghĩa đệ quy. Và để chứng minh một hàm đệ quy đúng, bạn dùng quy nạp. MAD101 cho bạn lý thuyết làm đệ quy đáng tin — thiết yếu cho CSD201.</div>
</div>
`,
        },
        {
          title: 'Chapter 5 Quiz|||Quiz chương 5',
          slug: 'mad101-quiz-ch5',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: quy nạp (cơ sở/bước), định nghĩa đệ quy.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Mathematical induction has which two steps?|||Quy nạp toán học có hai bước nào?', options: ['guess and check|||đoán và kiểm', 'base case and inductive step|||cơ sở và bước quy nạp', 'divide and conquer|||chia và trị', 'sort and search|||sắp xếp và tìm'], correctIndex: 1, points: 1 },
              { question: 'The inductive step proves…|||Bước quy nạp chứng minh…', options: ['P(1)', 'if P(k) then P(k+1)|||nếu P(k) thì P(k+1)', 'P is false|||P sai', 'P(n) for one n|||P(n) cho một n'], correctIndex: 1, points: 1 },
              { question: 'A recursive definition must include a…|||Một định nghĩa đệ quy phải có một…', options: ['loop|||vòng lặp', 'base case to stop|||trường hợp cơ sở để dừng', 'graph|||đồ thị', 'quantifier|||lượng từ'], correctIndex: 1, points: 1 },
              { question: 'The factorial n! = n·(n−1)! is an example of a…|||Giai thừa n! = n·(n−1)! là ví dụ của một…', options: ['proposition|||mệnh đề', 'recursive definition|||định nghĩa đệ quy', 'set|||tập hợp', 'graph|||đồ thị'], correctIndex: 1, points: 1 },
              { question: 'Induction and recursion relate how?|||Quy nạp và đệ quy liên hệ thế nào?', options: ['they are opposites|||chúng đối lập', 'recursion builds, induction proves — two sides of one idea|||đệ quy xây, quy nạp chứng minh — hai mặt một ý tưởng', 'they are unrelated|||không liên quan', 'both are sorting methods|||đều là phương pháp sắp xếp'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 2 ══════════════════ */
    {
      title: 'Progress Test 2 (Complexity, Number Theory, Induction — CLO3–5)|||Progress Test 2 (Độ phức tạp, Số học, Quy nạp — CLO3–5)',
      description: 'Ôn: Big-O, số học mô-đun, quy nạp & đệ quy.',
      lessons: [
        {
          title: 'Progress Test 2 — review|||Progress Test 2 — ôn tổng hợp',
          slug: 'mad101-progress-test-2',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 3–5.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A single loop over n items is…|||Một vòng lặp qua n phần tử là…', options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], correctIndex: 1, points: 1 },
              { question: 'Merge sort has complexity…|||Merge sort có độ phức tạp…', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], correctIndex: 1, points: 1 },
              { question: '22 mod 5 equals…|||22 mod 5 bằng…', options: ['2', '4', '0', '5'], correctIndex: 0, points: 1 },
              { question: 'The base case of induction proves the statement for…|||Trường hợp cơ sở của quy nạp chứng minh mệnh đề cho…', options: ['all n at once|||mọi n cùng lúc', 'the first value (e.g. n=1)|||giá trị đầu tiên (vd n=1)', 'no values|||không giá trị nào', 'the last value|||giá trị cuối'], correctIndex: 1, points: 1 },
              { question: 'To prove a recursive function correct, you typically use…|||Để chứng minh một hàm đệ quy đúng, bạn thường dùng…', options: ['a truth table|||một bảng chân trị', 'mathematical induction|||quy nạp toán học', 'a graph|||một đồ thị', 'modular arithmetic|||số học mô-đun'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 6 — ĐẾM & TỔ HỢP ══════════════════ */
    {
      title: 'Chapter 6 — Counting & Combinatorics|||Chương 6 — Đếm & Tổ hợp',
      description: 'Nguyên lý đếm, chỉnh hợp, tổ hợp và hệ thức truy hồi.',
      lessons: [
        {
          title: '6.1 — Counting principles & combinatorics|||6.1 — Nguyên lý đếm & tổ hợp',
          slug: 'mad101-6-1-dem-to-hop',
          type: 'VIDEO',
          description: 'Quy tắc nhân/cộng, chỉnh hợp P(n,k) và tổ hợp C(n,k).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>How many ways?</h2>
<p class="lead"><strong>Counting</strong> (CLO6) answers "how many ways can this happen?" — the foundation of probability and of measuring how many cases an algorithm faces. Two basic rules start everything.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Product rule — sequential choices</div><div class="lz-ld">If step 1 has m options and step 2 has n, together there are m·n. A 4-digit PIN: 10 × 10 × 10 × 10 = 10,000.</div></div>
  <div class="lz-layer"><div class="lz-lt">Sum rule — alternative choices</div><div class="lz-ld">If you pick one from group A (m) OR one from group B (n), there are m + n.</div></div>
</div>
<h3>Permutations vs combinations</h3>
<table>
  <thead><tr><th></th><th>Permutation P(n,k)</th><th>Combination C(n,k)</th></tr></thead>
  <tbody>
    <tr><td>Order</td><td>matters</td><td>does not matter</td></tr>
    <tr><td>Formula</td><td>n! / (n−k)!</td><td>n! / (k!(n−k)!)</td></tr>
    <tr><td>Example</td><td>ranking 3 of 5 runners</td><td>choosing a 3-person team from 5</td></tr>
  </tbody>
</table>
<div class="out"><b>Example:</b> From 5 people, choose a committee of 3.<br>C(5,3) = 5! / (3!·2!) = 120 / (6·2) = <b>10 ways</b></div>
<p>Combinations count subsets (order irrelevant); permutations count ordered arrangements. Getting this distinction right is the heart of every counting problem.</p>
<div class="note-ct">Counting appears throughout CS: the number of possible passwords (security), the number of comparisons an algorithm makes (complexity), the number of states a system can be in (testing). Some counting problems also lead to <strong>recurrence relations</strong> — like the Fibonacci sequence, which links back to recursion in Chapter 5.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Có bao nhiêu cách?</h2>
<p class="lead"><strong>Đếm (counting)</strong> (CLO6) trả lời "có bao nhiêu cách điều này xảy ra?" — nền của xác suất và của việc đo một thuật toán đối mặt bao nhiêu trường hợp. Hai quy tắc cơ bản khởi đầu mọi thứ.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Quy tắc nhân — lựa chọn tuần tự</div><div class="lz-ld">Nếu bước 1 có m cách và bước 2 có n, cùng nhau có m·n. Một PIN 4 chữ số: 10 × 10 × 10 × 10 = 10.000.</div></div>
  <div class="lz-layer"><div class="lz-lt">Quy tắc cộng — lựa chọn thay thế</div><div class="lz-ld">Nếu bạn chọn một từ nhóm A (m) HOẶC một từ nhóm B (n), có m + n cách.</div></div>
</div>
<h3>Chỉnh hợp vs tổ hợp</h3>
<table>
  <thead><tr><th></th><th>Chỉnh hợp P(n,k)</th><th>Tổ hợp C(n,k)</th></tr></thead>
  <tbody>
    <tr><td>Thứ tự</td><td>quan trọng</td><td>không quan trọng</td></tr>
    <tr><td>Công thức</td><td>n! / (n−k)!</td><td>n! / (k!(n−k)!)</td></tr>
    <tr><td>Ví dụ</td><td>xếp hạng 3 trong 5 người chạy</td><td>chọn đội 3 người từ 5</td></tr>
  </tbody>
</table>
<div class="out"><b>Ví dụ:</b> Từ 5 người, chọn một ban 3 người.<br>C(5,3) = 5! / (3!·2!) = 120 / (6·2) = <b>10 cách</b></div>
<p>Tổ hợp đếm tập con (không quan tâm thứ tự); chỉnh hợp đếm sắp xếp có thứ tự. Phân biệt đúng điều này là trái tim của mọi bài toán đếm.</p>
<div class="note-ct">Đếm xuất hiện khắp CS: số mật khẩu khả dĩ (bảo mật), số lần so sánh một thuật toán làm (độ phức tạp), số trạng thái một hệ thống có thể ở (kiểm thử). Vài bài toán đếm còn dẫn tới <strong>hệ thức truy hồi (recurrence relation)</strong> — như dãy Fibonacci, nối lại với đệ quy ở Chương 5.</div>
</div>
`,
        },
        {
          title: 'Chapter 6 Quiz|||Quiz chương 6',
          slug: 'mad101-quiz-ch6',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: quy tắc nhân/cộng, chỉnh hợp vs tổ hợp.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'How many 4-digit PINs are possible (digits 0-9)?|||Có bao nhiêu PIN 4 chữ số (chữ số 0-9)?', options: ['40', '1000', '10,000', '24'], correctIndex: 2, points: 1 },
              { question: 'When order MATTERS, you use…|||Khi thứ tự QUAN TRỌNG, bạn dùng…', options: ['combinations|||tổ hợp', 'permutations|||chỉnh hợp', 'the sum rule|||quy tắc cộng', 'a graph|||một đồ thị'], correctIndex: 1, points: 1 },
              { question: 'C(n,k) counts…|||C(n,k) đếm…', options: ['ordered arrangements|||các sắp xếp có thứ tự', 'subsets where order does not matter|||các tập con mà thứ tự không quan trọng', 'permutations|||chỉnh hợp', 'primes|||số nguyên tố'], correctIndex: 1, points: 1 },
              { question: 'C(5,3) equals…|||C(5,3) bằng…', options: ['10', '60', '120', '15'], correctIndex: 0, points: 1 },
              { question: 'The product rule applies to choices that are…|||Quy tắc nhân áp dụng cho các lựa chọn…', options: ['alternatives (OR)|||thay thế (HOẶC)', 'sequential (AND, one after another)|||tuần tự (VÀ, cái này sau cái kia)', 'always equal|||luôn bằng nhau', 'impossible|||bất khả'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 7 — ĐỒ THỊ ══════════════════ */
    {
      title: 'Chapter 7 — Graphs|||Chương 7 — Đồ thị',
      description: 'Mô hình đồ thị, thuật ngữ, đường đi và tìm đường ngắn nhất (Dijkstra).',
      lessons: [
        {
          title: '7.1 — Graphs & shortest paths|||7.1 — Đồ thị & đường đi ngắn nhất',
          slug: 'mad101-7-1-do-thi',
          type: 'VIDEO',
          description: 'Đỉnh, cạnh, bậc, đường đi và thuật toán Dijkstra.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Modeling connections</h2>
<p class="lead">A <strong>graph</strong> (CLO7) is a set of <strong>vertices</strong> (nodes) connected by <strong>edges</strong>. It models any network: cities and roads, people and friendships, web pages and links, computers and cables. Graph theory is one of the most applied areas of discrete math.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Vertex &amp; edge</div><div class="lz-ld">A vertex is a point; an edge connects two vertices. The <strong>degree</strong> of a vertex is how many edges touch it.</div></div>
  <div class="lz-layer"><div class="lz-lt">Directed vs undirected</div><div class="lz-ld">Edges may have a direction (one-way streets, Twitter follows) or not (Facebook friends).</div></div>
  <div class="lz-layer"><div class="lz-lt">Weighted graph</div><div class="lz-ld">Edges carry a number (distance, cost, time) — needed for shortest-path problems.</div></div>
</div>
<h3>Shortest path — Dijkstra&#39;s algorithm</h3>
<p>Finding the cheapest route between two vertices in a weighted graph is the classic problem behind GPS navigation and network routing. <strong>Dijkstra&#39;s algorithm</strong> solves it greedily: always expand the nearest unvisited vertex, updating the best-known distances as it goes.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Start</div><div class="lz-t">distance 0 to source</div><div class="lz-d">∞ to all others</div></div>
  <div class="lz-step"><div class="lz-k">Expand</div><div class="lz-t">nearest unvisited</div><div class="lz-d">relax its neighbors</div></div>
  <div class="lz-step"><div class="lz-k">Repeat</div><div class="lz-t">until target reached</div><div class="lz-d">shortest path found</div></div>
</div>
<div class="callout ok">Every time Google Maps finds your route, a Dijkstra-style algorithm runs on a weighted graph of roads. Learning it here means you understand the math behind navigation, network routing and even social-network analysis.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdiscrete-mathematics%2Flearn&reflabel=MAD101%20%E2%80%94%20Discrete%20Mathematics#module-508" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Code graph algorithms</span><span class="lc-sub">The "Graph Algorithms" module — implement Dijkstra &amp; more.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Mô hình các kết nối</h2>
<p class="lead">Một <strong>đồ thị (graph)</strong> (CLO7) là một tập <strong>đỉnh (vertex)</strong> nối bằng <strong>cạnh (edge)</strong>. Nó mô hình mọi mạng lưới: thành phố và đường, người và tình bạn, trang web và liên kết, máy tính và dây cáp. Lý thuyết đồ thị là một trong những lĩnh vực toán rời rạc được ứng dụng nhiều nhất.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Đỉnh &amp; cạnh</div><div class="lz-ld">Một đỉnh là một điểm; một cạnh nối hai đỉnh. <strong>Bậc (degree)</strong> của một đỉnh là số cạnh chạm vào nó.</div></div>
  <div class="lz-layer"><div class="lz-lt">Có hướng vs vô hướng</div><div class="lz-ld">Cạnh có thể có hướng (đường một chiều, follow Twitter) hoặc không (bạn bè Facebook).</div></div>
  <div class="lz-layer"><div class="lz-lt">Đồ thị có trọng số</div><div class="lz-ld">Cạnh mang một con số (khoảng cách, chi phí, thời gian) — cần cho bài toán đường đi ngắn nhất.</div></div>
</div>
<h3>Đường đi ngắn nhất — thuật toán Dijkstra</h3>
<p>Tìm tuyến rẻ nhất giữa hai đỉnh trong đồ thị có trọng số là bài toán kinh điển đằng sau định vị GPS và định tuyến mạng. <strong>Thuật toán Dijkstra</strong> giải nó theo kiểu tham lam: luôn mở rộng đỉnh chưa thăm gần nhất, cập nhật các khoảng cách tốt nhất đã biết khi đi.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Bắt đầu</div><div class="lz-t">khoảng cách 0 tới nguồn</div><div class="lz-d">∞ tới mọi đỉnh khác</div></div>
  <div class="lz-step"><div class="lz-k">Mở rộng</div><div class="lz-t">đỉnh chưa thăm gần nhất</div><div class="lz-d">nới lỏng (relax) hàng xóm</div></div>
  <div class="lz-step"><div class="lz-k">Lặp</div><div class="lz-t">tới khi đạt đích</div><div class="lz-d">tìm được đường ngắn nhất</div></div>
</div>
<div class="callout ok">Mỗi khi Google Maps tìm tuyến của bạn, một thuật toán kiểu Dijkstra chạy trên đồ thị có trọng số của các con đường. Học nó ở đây nghĩa là bạn hiểu toán học đằng sau định vị, định tuyến mạng và cả phân tích mạng xã hội.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdiscrete-mathematics%2Flearn&reflabel=MAD101%20%E2%80%94%20Discrete%20Mathematics#module-508" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Code thuật toán đồ thị</span><span class="lc-sub">Module "Graph Algorithms" — cài đặt Dijkstra &amp; hơn nữa.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 7 Quiz|||Quiz chương 7',
          slug: 'mad101-quiz-ch7',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: đỉnh/cạnh/bậc, có hướng, trọng số, Dijkstra.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'A graph consists of…|||Một đồ thị gồm…', options: ['rows and columns|||hàng và cột', 'vertices connected by edges|||các đỉnh nối bằng cạnh', 'only numbers|||chỉ các số', 'propositions|||các mệnh đề'], correctIndex: 1, points: 1 },
              { question: 'The degree of a vertex is…|||Bậc của một đỉnh là…', options: ['its weight|||trọng số của nó', 'the number of edges touching it|||số cạnh chạm vào nó', 'its distance to the source|||khoảng cách tới nguồn', 'its label|||nhãn của nó'], correctIndex: 1, points: 1 },
              { question: 'A weighted graph is needed for…|||Đồ thị có trọng số cần cho…', options: ['coloring|||tô màu', 'shortest-path problems|||bài toán đường đi ngắn nhất', 'counting vertices|||đếm đỉnh', 'truth tables|||bảng chân trị'], correctIndex: 1, points: 1 },
              { question: "Dijkstra's algorithm finds…|||Thuật toán Dijkstra tìm…", options: ['a spanning tree|||một cây khung', 'the shortest path in a weighted graph|||đường đi ngắn nhất trong đồ thị có trọng số', 'all prime numbers|||mọi số nguyên tố', 'the degree of a vertex|||bậc của một đỉnh'], correctIndex: 1, points: 1 },
              { question: 'Google Maps routing is an application of…|||Định tuyến Google Maps là ứng dụng của…', options: ['set theory|||lý thuyết tập hợp', 'shortest-path graph algorithms|||thuật toán đường đi ngắn nhất trên đồ thị', 'truth tables|||bảng chân trị', 'induction|||quy nạp'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 8 — CÂY ══════════════════ */
    {
      title: 'Chapter 8 — Trees|||Chương 8 — Cây',
      description: 'Cây, tính chất, cây khung và cây khung nhỏ nhất (MST).',
      lessons: [
        {
          title: '8.1 — Trees & spanning trees|||8.1 — Cây & cây khung',
          slug: 'mad101-8-1-cay',
          type: 'VIDEO',
          description: 'Cây là đồ thị không chu trình, và cây khung nhỏ nhất.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Trees — the most useful special graph</h2>
<p class="lead">A <strong>tree</strong> (CLO8) is a connected graph with <strong>no cycles</strong>. This simple constraint gives trees powerful properties and makes them the backbone of file systems, databases (B-trees), parsers, and search algorithms.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Key property</div><div class="lz-ld">A tree with n vertices has exactly n − 1 edges, and there is exactly ONE path between any two vertices.</div></div>
  <div class="lz-layer"><div class="lz-lt">Rooted tree terms</div><div class="lz-ld">Root (top), parent/child, leaf (no children), height (longest root-to-leaf path).</div></div>
  <div class="lz-layer"><div class="lz-lt">Binary tree</div><div class="lz-ld">Each node has at most two children — the basis of binary search trees and heaps.</div></div>
</div>
<h3>Spanning trees &amp; MST</h3>
<p>A <strong>spanning tree</strong> of a connected graph is a tree that includes every vertex using a subset of the edges. A <strong>minimum spanning tree (MST)</strong> is the spanning tree with the smallest total edge weight — the cheapest way to connect everything.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Problem</div><div class="lz-t">connect all cities</div><div class="lz-d">with minimum total cable</div></div>
  <div class="lz-step"><div class="lz-k">Solve</div><div class="lz-t">Kruskal / Prim</div><div class="lz-d">greedy MST algorithms</div></div>
  <div class="lz-step"><div class="lz-k">Result</div><div class="lz-t">cheapest network</div><div class="lz-d">no redundant links</div></div>
</div>
<div class="callout ok">MSTs solve real design problems: laying the least cable to connect a city, the least pipe for a water network, clustering data. Kruskal&#39;s and Prim&#39;s algorithms are elegant greedy solutions you will implement in CSD201.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdiscrete-mathematics%2Flearn&reflabel=MAD101%20%E2%80%94%20Discrete%20Mathematics#module-506" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Code trees &amp; BSTs</span><span class="lc-sub">The "Trees &amp; Binary Search Trees" module on CodeLab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Cây — đồ thị đặc biệt hữu ích nhất</h2>
<p class="lead">Một <strong>cây (tree)</strong> (CLO8) là một đồ thị liên thông <strong>không có chu trình</strong>. Ràng buộc đơn giản này cho cây các tính chất mạnh mẽ và làm chúng thành xương sống của hệ thống tệp, cơ sở dữ liệu (B-tree), trình phân tích cú pháp, và thuật toán tìm kiếm.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Tính chất then chốt</div><div class="lz-ld">Một cây n đỉnh có đúng n − 1 cạnh, và có đúng MỘT đường đi giữa hai đỉnh bất kỳ.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thuật ngữ cây có gốc</div><div class="lz-ld">Gốc (trên cùng), cha/con, lá (không con), chiều cao (đường gốc-tới-lá dài nhất).</div></div>
  <div class="lz-layer"><div class="lz-lt">Cây nhị phân</div><div class="lz-ld">Mỗi nút có tối đa hai con — nền của cây tìm kiếm nhị phân và heap.</div></div>
</div>
<h3>Cây khung &amp; MST</h3>
<p>Một <strong>cây khung (spanning tree)</strong> của một đồ thị liên thông là một cây bao mọi đỉnh dùng một tập con các cạnh. Một <strong>cây khung nhỏ nhất (MST)</strong> là cây khung có tổng trọng số cạnh nhỏ nhất — cách rẻ nhất để nối mọi thứ.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Bài toán</div><div class="lz-t">nối mọi thành phố</div><div class="lz-d">với tổng cáp nhỏ nhất</div></div>
  <div class="lz-step"><div class="lz-k">Giải</div><div class="lz-t">Kruskal / Prim</div><div class="lz-d">thuật toán MST tham lam</div></div>
  <div class="lz-step"><div class="lz-k">Kết quả</div><div class="lz-t">mạng rẻ nhất</div><div class="lz-d">không liên kết dư thừa</div></div>
</div>
<div class="callout ok">MST giải các bài toán thiết kế thật: đặt ít cáp nhất để nối một thành phố, ít ống nhất cho mạng nước, gom cụm dữ liệu. Thuật toán Kruskal và Prim là các lời giải tham lam thanh lịch bạn sẽ cài đặt ở CSD201.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdiscrete-mathematics%2Flearn&reflabel=MAD101%20%E2%80%94%20Discrete%20Mathematics#module-506" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Code cây &amp; BST</span><span class="lc-sub">Module "Trees &amp; Binary Search Trees" trên CodeLab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 8 Quiz|||Quiz chương 8',
          slug: 'mad101-quiz-ch8',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: cây, n−1 cạnh, cây nhị phân, cây khung nhỏ nhất.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'A tree is a connected graph with…|||Một cây là một đồ thị liên thông…', options: ['many cycles|||nhiều chu trình', 'no cycles|||không có chu trình', 'no edges|||không có cạnh', 'weighted edges only|||chỉ cạnh có trọng số'], correctIndex: 1, points: 1 },
              { question: 'A tree with n vertices has exactly… edges.|||Một cây n đỉnh có đúng… cạnh.', options: ['n', 'n − 1', 'n + 1', '2n'], correctIndex: 1, points: 1 },
              { question: 'Between any two vertices in a tree there is…|||Giữa hai đỉnh bất kỳ trong một cây có…', options: ['no path|||không đường đi', 'exactly one path|||đúng một đường đi', 'many cycles|||nhiều chu trình', 'always two paths|||luôn hai đường đi'], correctIndex: 1, points: 1 },
              { question: 'A minimum spanning tree (MST) is the spanning tree with…|||Cây khung nhỏ nhất (MST) là cây khung có…', options: ['the most edges|||nhiều cạnh nhất', 'the smallest total edge weight|||tổng trọng số cạnh nhỏ nhất', 'the largest total weight|||tổng trọng số lớn nhất', 'no leaves|||không có lá'], correctIndex: 1, points: 1 },
              { question: 'Which algorithms find an MST?|||Thuật toán nào tìm một MST?', options: ['Dijkstra and BFS|||Dijkstra và BFS', 'Kruskal and Prim|||Kruskal và Prim', 'Euclid and Fibonacci|||Euclid và Fibonacci', 'quicksort and mergesort|||quicksort và mergesort'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 3 ══════════════════ */
    {
      title: 'Progress Test 3 (Counting, Graphs & Trees — CLO6–8)|||Progress Test 3 (Đếm, Đồ thị & Cây — CLO6–8)',
      description: 'Ôn: đếm & tổ hợp, đồ thị & đường đi ngắn nhất, cây & MST.',
      lessons: [
        {
          title: 'Progress Test 3 — review|||Progress Test 3 — ôn tổng hợp',
          slug: 'mad101-progress-test-3',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 6–8.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Choosing a 3-person team from 5 people (order irrelevant) uses…|||Chọn đội 3 người từ 5 người (không quan tâm thứ tự) dùng…', options: ['permutations|||chỉnh hợp', 'combinations|||tổ hợp', 'the sum rule|||quy tắc cộng', 'a graph|||một đồ thị'], correctIndex: 1, points: 1 },
              { question: 'The degree of a vertex counts its…|||Bậc của một đỉnh đếm…', options: ['weight|||trọng số', 'edges|||các cạnh', 'children|||các con', 'labels|||các nhãn'], correctIndex: 1, points: 1 },
              { question: "Dijkstra's algorithm solves the… problem.|||Thuật toán Dijkstra giải bài toán…", options: ['minimum spanning tree|||cây khung nhỏ nhất', 'shortest path|||đường đi ngắn nhất', 'counting|||đếm', 'sorting|||sắp xếp'], correctIndex: 1, points: 1 },
              { question: 'A tree with 10 vertices has how many edges?|||Một cây 10 đỉnh có bao nhiêu cạnh?', options: ['10', '9', '11', '20'], correctIndex: 1, points: 1 },
              { question: 'To connect all cities with minimum total cable, find a…|||Để nối mọi thành phố với tổng cáp nhỏ nhất, tìm một…', options: ['shortest path|||đường đi ngắn nhất', 'minimum spanning tree|||cây khung nhỏ nhất', 'truth table|||bảng chân trị', 'permutation|||chỉnh hợp'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 1 — TOÁN RỜI RẠC TRONG CODE (CAPSTONE) ══════════════════ */
    {
      title: 'Advanced 1 — Discrete math in real code|||Nâng cao 1 — Toán rời rạc trong code thật',
      description: 'Ngoài giáo trình — bài tổng kết: mỗi chương vận hành một phần của khoa học máy tính.',
      lessons: [
        {
          title: 'N1.1 — Where each topic shows up in CS|||N1.1 — Mỗi chủ đề xuất hiện ở đâu trong CS',
          slug: 'mad101-n1-1-ung-dung',
          type: 'VIDEO',
          description: 'Logic, tập hợp, đồ thị và đếm chính là bộ máy của phần mềm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 1 · Lesson N1.1</span>
<h2>MAD101 is not abstract — it runs everything</h2>
<p class="lead">Discrete math can feel like puzzles disconnected from coding. This capstone shows that every chapter is the direct foundation of something you build.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Logic → conditions, circuits, verification</div><div class="lz-ld">Every <code>if</code> and boolean expression is propositional logic; program correctness proofs use predicate logic (Ch 1).</div></div>
  <div class="lz-layer"><div class="lz-lt">Sets &amp; functions → databases &amp; hashing</div><div class="lz-ld">SQL is set operations; a hash function maps keys to slots; encryption functions must be bijective (Ch 2, 4).</div></div>
  <div class="lz-layer"><div class="lz-lt">Big-O → choosing algorithms</div><div class="lz-ld">Every performance decision — which sort, which data structure — is a complexity comparison (Ch 3).</div></div>
  <div class="lz-layer"><div class="lz-lt">Number theory → security</div><div class="lz-ld">RSA, hashing and error-detecting codes all rest on modular arithmetic (Ch 4).</div></div>
  <div class="lz-layer"><div class="lz-lt">Induction &amp; recursion → recursive code</div><div class="lz-ld">Every recursive function is a recursive definition; proving it correct uses induction (Ch 5).</div></div>
  <div class="lz-layer"><div class="lz-lt">Counting → probability &amp; testing</div><div class="lz-ld">Password strength, algorithm case-counts, and the number of states to test (Ch 6).</div></div>
  <div class="lz-layer"><div class="lz-lt">Graphs &amp; trees → networks, maps, file systems</div><div class="lz-ld">GPS routing, social networks, the DOM, B-trees in databases (Ch 7, 8).</div></div>
</div>
<div class="callout ok">This is why MAD101 sits early in the degree: it is the shared language of everything that follows. CSD201 codes these algorithms, DBI202 queries these sets, NWC203c routes these graphs. Master the reasoning here and every later course feels like applying something you already understand.</div>
<div class="note-ct">Congratulations on completing MAD101. You now have the reasoning toolkit of a computer scientist: you can state ideas precisely with logic, structure data with sets and functions, measure algorithms with Big-O, prove correctness with induction, count possibilities, and model connections with graphs and trees. This is the mathematics that makes computing a science.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 1 · Bài N1.1</span>
<h2>MAD101 không trừu tượng — nó vận hành mọi thứ</h2>
<p class="lead">Toán rời rạc có thể thấy như các câu đố tách rời việc code. Bài tổng kết này cho thấy mỗi chương là nền trực tiếp của một thứ bạn xây.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Logic → điều kiện, mạch, kiểm chứng</div><div class="lz-ld">Mọi <code>if</code> và biểu thức boolean là logic mệnh đề; chứng minh chương trình đúng dùng logic vị từ (Ch 1).</div></div>
  <div class="lz-layer"><div class="lz-lt">Tập hợp &amp; hàm → CSDL &amp; băm</div><div class="lz-ld">SQL là phép tập hợp; một hàm băm ánh xạ khoá tới ô; hàm mã hoá phải song ánh (Ch 2, 4).</div></div>
  <div class="lz-layer"><div class="lz-lt">Big-O → chọn thuật toán</div><div class="lz-ld">Mọi quyết định hiệu năng — sort nào, cấu trúc dữ liệu nào — là một so sánh độ phức tạp (Ch 3).</div></div>
  <div class="lz-layer"><div class="lz-lt">Số học → bảo mật</div><div class="lz-ld">RSA, băm và mã phát hiện lỗi đều dựa trên số học mô-đun (Ch 4).</div></div>
  <div class="lz-layer"><div class="lz-lt">Quy nạp &amp; đệ quy → code đệ quy</div><div class="lz-ld">Mọi hàm đệ quy là một định nghĩa đệ quy; chứng minh nó đúng dùng quy nạp (Ch 5).</div></div>
  <div class="lz-layer"><div class="lz-lt">Đếm → xác suất &amp; kiểm thử</div><div class="lz-ld">Độ mạnh mật khẩu, số trường hợp thuật toán, và số trạng thái cần kiểm thử (Ch 6).</div></div>
  <div class="lz-layer"><div class="lz-lt">Đồ thị &amp; cây → mạng, bản đồ, hệ thống tệp</div><div class="lz-ld">Định tuyến GPS, mạng xã hội, DOM, B-tree trong CSDL (Ch 7, 8).</div></div>
</div>
<div class="callout ok">Đây là lý do MAD101 nằm sớm trong chương trình: nó là ngôn ngữ chung của mọi thứ theo sau. CSD201 code các thuật toán này, DBI202 truy vấn các tập này, NWC203c định tuyến các đồ thị này. Nắm vững suy luận ở đây và mọi môn sau thấy như đang áp dụng thứ bạn đã hiểu.</div>
<div class="note-ct">Chúc mừng bạn hoàn thành MAD101. Giờ bạn có bộ công cụ suy luận của một nhà khoa học máy tính: phát biểu ý tưởng chính xác bằng logic, cấu trúc dữ liệu bằng tập hợp và hàm, đo thuật toán bằng Big-O, chứng minh đúng đắn bằng quy nạp, đếm khả năng, và mô hình kết nối bằng đồ thị và cây. Đây là toán học biến tính toán thành một khoa học.</div>
</div>
`,
        },
      ],
    },
  ],
};
