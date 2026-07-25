/**
 * MAE101 — Mathematics for Engineering (Toán cho ngành kỹ thuật). Kỳ 1.
 * Bám giáo trình Stewart "Essential Calculus" (single-variable) + Nicholson
 * "Linear Algebra with Applications" + chương nâng cao (Maxima/Python).
 * Song ngữ EN/VN realtime (khối .ml-en / .ml-vi, tiêu đề EN|||VI).
 * Công thức dùng ký hiệu Unicode + khối .out ví dụ; sơ đồ .lz-map/.lz-flow/.lz-stack.
 * Công cụ (Maxima, GeoGebra, Desmos) → Exp Hub; linear-transformation-with-python → CodeLab.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/MAE101.mjs --apply
 */
export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'MAE101',
    slug: 'mathematics-for-engineering',
    title: 'Mathematics for Engineering',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The two pillars of engineering math: single-variable calculus (limits, derivatives, integrals) and linear algebra (systems, matrices, vectors, transformations) — the toolkit behind machine learning, graphics and every quantitative field.|||Hai trụ cột toán kỹ thuật: giải tích một biến (giới hạn, đạo hàm, tích phân) và đại số tuyến tính (hệ phương trình, ma trận, vector, biến đổi) — bộ công cụ đằng sau machine learning, đồ hoạ và mọi ngành định lượng.',
    description: 'Môn toán nền tảng cho ngành kỹ thuật. Nửa đầu là giải tích một biến (giới hạn, đạo hàm, tích phân và ứng dụng); nửa sau là đại số tuyến tính (hệ phương trình, ma trận, định thức, không gian vector, biến đổi tuyến tính). Có thực hành bằng Maxima/Python.',
    whatYouLearn: 'Tính giới hạn, đạo hàm, tích phân hàm một biến & ứng dụng; giải hệ phương trình tuyến tính (Gauss, Cramer, ma trận nghịch đảo); tính định thức & nghịch đảo; biến đổi tuyến tính trong R² và R³; tìm cơ sở & số chiều của không gian vector.',
    requirements: 'Không có môn tiên quyết. Cần kiến thức toán phổ thông vững (hàm số, lượng giác cơ bản). Nên dùng công cụ tính toán như Maxima hoặc GeoGebra để kiểm kết quả.',
    documentsNote: 'Giáo trình: Essential Calculus (James Stewart) · Calculus for Engineers (Donald Trim) · Linear Algebra with Applications (W. Keith Nicholson). Công cụ: Maxima (maxima.sourceforge.net), GeoGebra, Desmos. Kèm file syllabus gốc MAE101.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, học ra sao, điều kiện qua môn, lộ trình và công cụ.',
      lessons: [
        {
          title: '0.1 — About MAE101 & the course map|||0.1 — Giới thiệu MAE101 & bản đồ môn học',
          slug: 'mae101-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Hai nửa của môn — giải tích và đại số tuyến tính — và vì sao chúng quan trọng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About MAE101 — Mathematics for Engineering</h2>
<p class="lead">MAE101 is the mathematical foundation of your whole degree. It teaches the two languages that describe change and structure: <strong>calculus</strong> (how things change) and <strong>linear algebra</strong> (how to handle many quantities at once). Far from abstract, this is the exact math behind machine learning, computer graphics, physics engines, economics and data science.</p>
<p>The course has two clear halves. The first is <strong>single-variable calculus</strong> — limits, derivatives and integrals. The second is <strong>linear algebra</strong> — solving systems of equations, matrices, determinants, vectors and transformations. Each half builds a toolkit you will use for years.</p>
<h3>Course map — from calculus to linear algebra</h3>
<div class="lz-map">
  <div class="lz-stage">Part I · Calculus (change)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Limits</div><div class="lz-nsub">The idea underneath all calculus</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Derivatives</div><div class="lz-nsub">Instantaneous rate of change · slopes</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Applications of Derivatives</div><div class="lz-nsub">Graph shape · optimization</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Integrals</div><div class="lz-nsub">Area under a curve · accumulation</div></div></div>
  <div class="lz-stage">Part II · Linear Algebra (structure)</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Linear Systems</div><div class="lz-nsub">Gaussian elimination · echelon form</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Matrices</div><div class="lz-nsub">Operations &amp; transformations</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Determinants &amp; Inverse</div><div class="lz-nsub">Cramer&#39;s rule · diagonalization</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Vectors &amp; Linear Transformations</div><div class="lz-nsub">In R² and R³</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Vector Spaces</div><div class="lz-nsub">Subspaces · basis · dimension</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Compute with Maxima/Python · why this math powers ML &amp; graphics</div><div class="lz-nsub">Hands-on &amp; real-world connections</div></div></div>
</div>
<div class="callout ok">Math is not a spectator sport. Reading a solved example feels easy, but you only learn by <strong>working problems yourself</strong>. Cover the solution, try it, then check. Every chapter here has a quiz — use it to test that you can actually <em>do</em> the math, not just recognize it.</div>
<a class="link-card exphub" href="/exp-hub/mae101-cong-cu-hoc-tap?ref=%2Fcourses%2Fmathematics-for-engineering%2Flearn&reflabel=MAE101%20%E2%80%94%20Mathematics%20for%20Engineering" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Tools for MAE101 — Maxima, GeoGebra, Desmos</span><span class="lc-sub">Free calculators to check your work &amp; visualize — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu MAE101 — Toán cho ngành kỹ thuật</h2>
<p class="lead">MAE101 là nền tảng toán học của cả tấm bằng của bạn. Nó dạy hai ngôn ngữ mô tả sự thay đổi và cấu trúc: <strong>giải tích (calculus)</strong> (sự vật thay đổi ra sao) và <strong>đại số tuyến tính (linear algebra)</strong> (xử lý nhiều đại lượng cùng lúc thế nào). Không hề trừu tượng, đây đúng là toán đằng sau machine learning, đồ hoạ máy tính, engine vật lý, kinh tế và khoa học dữ liệu.</p>
<p>Môn có hai nửa rõ ràng. Nửa đầu là <strong>giải tích một biến</strong> — giới hạn, đạo hàm và tích phân. Nửa sau là <strong>đại số tuyến tính</strong> — giải hệ phương trình, ma trận, định thức, vector và biến đổi. Mỗi nửa xây một bộ công cụ bạn sẽ dùng nhiều năm.</p>
<h3>Bản đồ môn học — từ giải tích tới đại số tuyến tính</h3>
<div class="lz-map">
  <div class="lz-stage">Phần I · Giải tích (sự thay đổi)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Giới hạn (Limits)</div><div class="lz-nsub">Ý tưởng nền của cả giải tích</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Đạo hàm (Derivatives)</div><div class="lz-nsub">Tốc độ thay đổi tức thời · độ dốc</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Ứng dụng đạo hàm</div><div class="lz-nsub">Hình dạng đồ thị · tối ưu</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Tích phân (Integrals)</div><div class="lz-nsub">Diện tích dưới đường cong · tích luỹ</div></div></div>
  <div class="lz-stage">Phần II · Đại số tuyến tính (cấu trúc)</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Hệ phương trình tuyến tính</div><div class="lz-nsub">Khử Gauss · dạng bậc thang</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Ma trận (Matrices)</div><div class="lz-nsub">Phép toán &amp; biến đổi</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Định thức &amp; Nghịch đảo</div><div class="lz-nsub">Quy tắc Cramer · chéo hoá</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Vector &amp; Biến đổi tuyến tính</div><div class="lz-nsub">Trong R² và R³</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Không gian vector</div><div class="lz-nsub">Không gian con · cơ sở · số chiều</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Tính bằng Maxima/Python · vì sao toán này vận hành ML &amp; đồ hoạ</div><div class="lz-nsub">Thực hành &amp; kết nối thực tế</div></div></div>
</div>
<div class="callout ok">Toán không phải môn thể thao để xem. Đọc một ví dụ đã giải thấy dễ, nhưng bạn chỉ học được khi <strong>tự làm bài</strong>. Che lời giải, tự thử, rồi kiểm. Mỗi chương ở đây có một quiz — dùng nó để kiểm bạn thực sự <em>làm được</em> toán, không chỉ nhận ra nó.</div>
<a class="link-card exphub" href="/exp-hub/mae101-cong-cu-hoc-tap?ref=%2Fcourses%2Fmathematics-for-engineering%2Flearn&reflabel=MAE101%20%E2%80%94%20Mathematics%20for%20Engineering" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Công cụ cho MAE101 — Maxima, GeoGebra, Desmos</span><span class="lc-sub">Máy tính miễn phí để kiểm kết quả &amp; trực quan hoá — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'mae101-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết, điểm sàn qua môn và trọng số từng cột điểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">Straight from the official MAE101 syllabus. Like most FPT math courses, steady practice through the term (60% on-going) matters as much as the final.</p>
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
    <tr><td>Assignments / Exercises</td><td>30%</td><td>On-going, 3 parts — practice problem sets</td></tr>
    <tr><td>Progress Test</td><td>30%</td><td>3 tests: PT1 (calculus), PT2 (matrices), PT3 (vector spaces)</td></tr>
    <tr><td>Final Exam</td><td>40%</td><td>60 minutes — must score ≥ 4 to pass the course</td></tr>
  </tbody>
</table>
<div class="callout warn">Two gates: weighted average ≥ 5.0 AND the final exam alone ≥ 4.0. Math builds cumulatively — if you fall behind on limits, derivatives will feel impossible. Do the exercises every week; you cannot cram calculus the night before.</div>
<div class="note-ct">The three progress tests match the course structure exactly: PT1 covers Part I calculus (Chapters 1–4), PT2 covers matrices (Chapters 5–7), PT3 covers vector spaces (Chapters 8–9). Treat each as a checkpoint and revise that block before it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Lấy thẳng từ syllabus chính thức MAE101. Như hầu hết môn toán FPT, luyện tập đều tay suốt kỳ (60% quá trình) quan trọng ngang bài thi cuối.</p>
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
    <tr><td>Bài tập / Assignment</td><td>30%</td><td>Thường xuyên, 3 phần — bộ bài luyện tập</td></tr>
    <tr><td>Progress Test</td><td>30%</td><td>3 bài: PT1 (giải tích), PT2 (ma trận), PT3 (không gian vector)</td></tr>
    <tr><td>Thi cuối kỳ</td><td>40%</td><td>60 phút — phải đạt ≥ 4 mới qua môn</td></tr>
  </tbody>
</table>
<div class="callout warn">Hai cửa: trung bình có trọng số ≥ 5.0 VÀ riêng bài thi cuối ≥ 4.0. Toán xây tích luỹ — nếu bạn hụt phần giới hạn, đạo hàm sẽ thấy bất khả thi. Làm bài tập mỗi tuần; không thể "cày" giải tích đêm trước thi.</div>
<div class="note-ct">Ba progress test khớp đúng cấu trúc môn: PT1 phủ Phần I giải tích (Chương 1–4), PT2 phủ ma trận (Chương 5–7), PT3 phủ không gian vector (Chương 8–9). Coi mỗi bài là một cột mốc và ôn khối đó trước khi thi.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning outcomes (9 CLOs)|||0.3 — Chuẩn đầu ra (9 CLO)',
          slug: 'mae101-chuan-dau-ra',
          type: 'VIDEO',
          description: '9 kỹ năng toán nhà trường cam kết bạn làm được — checklist ôn thi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The 9 Course Learning Outcomes (CLOs)</h2>
<p class="lead">Each CLO is a concrete math skill — something you can <em>do</em>, not just know. They map onto the chapters and are your exam checklist.</p>
<table>
  <thead><tr><th>#</th><th>You will be able to…</th><th>Covered in</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Describe properties of a function and find its limit</td><td>Chapter 1</td></tr>
    <tr><td>CLO2</td><td>Calculate derivatives of a function</td><td>Chapter 2</td></tr>
    <tr><td>CLO3</td><td>Use derivatives to analyse functions &amp; solve applications</td><td>Chapter 3</td></tr>
    <tr><td>CLO4</td><td>Calculate integrals and find area under a graph</td><td>Chapter 4</td></tr>
    <tr><td>CLO5</td><td>Solve a linear system by Gaussian elimination</td><td>Chapter 5</td></tr>
    <tr><td>CLO6</td><td>Perform matrix operations &amp; matrix transformations</td><td>Chapter 6</td></tr>
    <tr><td>CLO7</td><td>Find determinant, inverse &amp; diagonalization of a matrix</td><td>Chapter 7</td></tr>
    <tr><td>CLO8</td><td>Manipulate vectors &amp; linear transformations in R³</td><td>Chapter 8</td></tr>
    <tr><td>CLO9</td><td>Find the dimension and bases of a subspace</td><td>Chapter 9</td></tr>
  </tbody>
</table>
<div class="note-ct">Every one of these is a skill you demonstrate by solving a problem. The best revision is not re-reading notes but working past exam questions until each CLO feels automatic.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>9 Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">Mỗi CLO là một kỹ năng toán cụ thể — thứ bạn có thể <em>làm được</em>, không chỉ biết. Chúng khớp với các chương và là checklist ôn thi của bạn.</p>
<table>
  <thead><tr><th>#</th><th>Bạn sẽ làm được…</th><th>Học ở</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Mô tả tính chất của hàm số và tìm giới hạn của nó</td><td>Chương 1</td></tr>
    <tr><td>CLO2</td><td>Tính đạo hàm của một hàm số</td><td>Chương 2</td></tr>
    <tr><td>CLO3</td><td>Dùng đạo hàm để phân tích hàm &amp; giải ứng dụng</td><td>Chương 3</td></tr>
    <tr><td>CLO4</td><td>Tính tích phân và tìm diện tích dưới đồ thị</td><td>Chương 4</td></tr>
    <tr><td>CLO5</td><td>Giải hệ tuyến tính bằng khử Gauss</td><td>Chương 5</td></tr>
    <tr><td>CLO6</td><td>Thực hiện phép toán ma trận &amp; biến đổi ma trận</td><td>Chương 6</td></tr>
    <tr><td>CLO7</td><td>Tìm định thức, nghịch đảo &amp; chéo hoá ma trận</td><td>Chương 7</td></tr>
    <tr><td>CLO8</td><td>Thao tác vector &amp; biến đổi tuyến tính trong R³</td><td>Chương 8</td></tr>
    <tr><td>CLO9</td><td>Tìm số chiều và cơ sở của một không gian con</td><td>Chương 9</td></tr>
  </tbody>
</table>
<div class="note-ct">Mỗi cái là một kỹ năng bạn thể hiện bằng cách giải một bài. Ôn tập tốt nhất không phải đọc lại vở mà là làm đề thi cũ tới khi mỗi CLO thành phản xạ.</div>
</div>
`,
        },
        {
          title: '0.4 — Materials, tools & how to study|||0.4 — Tài liệu, công cụ & cách học',
          slug: 'mae101-tai-lieu',
          type: 'VIDEO',
          description: 'Giáo trình Stewart/Nicholson, Maxima/GeoGebra và cách học toán hiệu quả.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials, tools &amp; how to study math</h2>
<h3>Textbooks</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Essential Calculus — James Stewart</div><div class="lz-ld">The standard for Part I (limits, derivatives, integrals). Clear, with thousands of practice problems — the exercises are the point.</div></div>
  <div class="lz-layer"><div class="lz-lt">Linear Algebra with Applications — W. Keith Nicholson</div><div class="lz-ld">The reference for Part II (systems, matrices, vector spaces).</div></div>
  <div class="lz-layer"><div class="lz-lt">Calculus for Engineers — Donald Trim</div><div class="lz-ld">Engineering-flavored examples and applications.</div></div>
</div>
<h3>Free computational tools</h3>
<ul>
  <li><strong>Maxima</strong> — a computer algebra system: compute limits, derivatives, integrals and matrix operations exactly, to check your hand-work.</li>
  <li><strong>Desmos</strong> — an instant graphing calculator: see a function&#39;s shape, slope and area visually.</li>
  <li><strong>GeoGebra</strong> — graphing plus vectors and transformations — great for the linear-algebra half.</li>
</ul>
<h3>How to study math effectively</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Understand</div><div class="lz-t">the idea</div><div class="lz-d">what does this concept mean?</div></div>
  <div class="lz-step"><div class="lz-k">Work</div><div class="lz-t">problems by hand</div><div class="lz-d">the only way it sticks</div></div>
  <div class="lz-step"><div class="lz-k">Check</div><div class="lz-t">with a tool</div><div class="lz-d">Maxima/Desmos confirm</div></div>
  <div class="lz-step"><div class="lz-k">Repeat</div><div class="lz-t">spaced practice</div><div class="lz-d">before each progress test</div></div>
</div>
<div class="callout ok">The single biggest mistake in math is passive study — watching solutions without doing them. Use computational tools to <em>check</em> your answers, never to <em>replace</em> the practice. The exam tests whether you can do it by hand.</div>
<a class="link-card exphub" href="/exp-hub/mae101-cong-cu-hoc-tap?ref=%2Fcourses%2Fmathematics-for-engineering%2Flearn&reflabel=MAE101%20%E2%80%94%20Mathematics%20for%20Engineering" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Set up Maxima, GeoGebra &amp; Desmos</span><span class="lc-sub">Links and quick-start to check your calculus &amp; matrix work.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu, công cụ &amp; cách học toán</h2>
<h3>Giáo trình</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Essential Calculus — James Stewart</div><div class="lz-ld">Chuẩn cho Phần I (giới hạn, đạo hàm, tích phân). Rõ ràng, hàng nghìn bài luyện — bài tập mới là điểm mấu chốt.</div></div>
  <div class="lz-layer"><div class="lz-lt">Linear Algebra with Applications — W. Keith Nicholson</div><div class="lz-ld">Tham khảo cho Phần II (hệ phương trình, ma trận, không gian vector).</div></div>
  <div class="lz-layer"><div class="lz-lt">Calculus for Engineers — Donald Trim</div><div class="lz-ld">Ví dụ và ứng dụng thiên về kỹ thuật.</div></div>
</div>
<h3>Công cụ tính toán miễn phí</h3>
<ul>
  <li><strong>Maxima</strong> — hệ đại số máy tính: tính giới hạn, đạo hàm, tích phân và phép ma trận chính xác, để kiểm bài làm tay.</li>
  <li><strong>Desmos</strong> — máy tính vẽ đồ thị tức thì: thấy hình dạng, độ dốc và diện tích của hàm một cách trực quan.</li>
  <li><strong>GeoGebra</strong> — vẽ đồ thị cộng vector và biến đổi — tuyệt cho nửa đại số tuyến tính.</li>
</ul>
<h3>Cách học toán hiệu quả</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Hiểu</div><div class="lz-t">ý tưởng</div><div class="lz-d">khái niệm này nghĩa là gì?</div></div>
  <div class="lz-step"><div class="lz-k">Làm</div><div class="lz-t">bài bằng tay</div><div class="lz-d">cách duy nhất để nhớ</div></div>
  <div class="lz-step"><div class="lz-k">Kiểm</div><div class="lz-t">bằng công cụ</div><div class="lz-d">Maxima/Desmos xác nhận</div></div>
  <div class="lz-step"><div class="lz-k">Lặp</div><div class="lz-t">luyện giãn cách</div><div class="lz-d">trước mỗi progress test</div></div>
</div>
<div class="callout ok">Sai lầm lớn nhất khi học toán là học thụ động — xem lời giải mà không tự làm. Dùng công cụ tính để <em>kiểm</em> đáp án, không bao giờ để <em>thay</em> việc luyện. Bài thi kiểm bạn làm được bằng tay hay không.</div>
<a class="link-card exphub" href="/exp-hub/mae101-cong-cu-hoc-tap?ref=%2Fcourses%2Fmathematics-for-engineering%2Flearn&reflabel=MAE101%20%E2%80%94%20Mathematics%20for%20Engineering" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Cài Maxima, GeoGebra &amp; Desmos</span><span class="lc-sub">Link và hướng dẫn nhanh để kiểm bài giải tích &amp; ma trận.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — GIỚI HẠN ══════════════════ */
    {
      title: 'Chapter 1 — Limits|||Chương 1 — Giới hạn',
      description: 'Ý tưởng giới hạn, giới hạn một phía, và cách tính giới hạn.',
      lessons: [
        {
          title: '1.1 — What is a limit?|||1.1 — Giới hạn là gì?',
          slug: 'mae101-1-1-gioi-han',
          type: 'VIDEO',
          description: 'Trực giác về giới hạn, giới hạn một phía và khi nào giới hạn không tồn tại.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The idea underneath all of calculus</h2>
<p class="lead">A <strong>limit</strong> asks: as x gets closer and closer to some value a, what value does f(x) approach? (CLO1) It is not about what happens <em>at</em> a — it is about the trend as you get near. This single idea makes derivatives and integrals possible.</p>
<div class="out"><b>Notation:</b>  lim<sub>x→a</sub> f(x) = L  — "as x approaches a, f(x) approaches L"</div>
<p>Example: as x approaches 2, x² approaches 4. We write lim<sub>x→2</sub> x² = 4. Simple — but limits get interesting when you cannot just plug in.</p>
<h3>One-sided limits</h3>
<p>You can approach a from the <strong>left</strong> (x→a⁻) or the <strong>right</strong> (x→a⁺). The two-sided limit exists only if both sides agree.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Left</div><div class="lz-t">lim<sub>x→a⁻</sub></div><div class="lz-d">approach from below</div></div>
  <div class="lz-step"><div class="lz-k">Right</div><div class="lz-t">lim<sub>x→a⁺</sub></div><div class="lz-d">approach from above</div></div>
  <div class="lz-step"><div class="lz-k">Both equal?</div><div class="lz-t">limit exists</div><div class="lz-d">otherwise it does not</div></div>
</div>
<h3>When a limit fails to exist</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Jump</div><div class="lz-ld">Left and right limits differ (a step function at the step).</div></div>
  <div class="lz-layer"><div class="lz-lt">Infinite</div><div class="lz-ld">f(x) grows without bound, like 1/x² as x→0.</div></div>
  <div class="lz-layer"><div class="lz-lt">Oscillation</div><div class="lz-ld">f(x) wiggles forever without settling, like sin(1/x) as x→0.</div></div>
</div>
<h3>Formulas · Limit laws</h3>
<div class="formula"><span class="lbl">Limit laws (if lim f and lim g exist)</span>lim (f ± g) = lim f ± lim g    lim (f·g) = lim f · lim g<br>lim (f/g) = lim f / lim g  (lim g ≠ 0)    lim (c·f) = c · lim f<br>lim [f(x)]ⁿ = [lim f(x)]ⁿ</div>
<div class="formula"><span class="lbl">Two special limits worth memorising</span>lim<sub>x→0</sub> (sin x)/x = 1    lim<sub>x→∞</sub> (1 + 1/x)ˣ = e</div>
<h3>Ví dụ có lời giải · Worked examples</h3>
<div class="out"><b>Example 1 — one-sided disagreement.</b> Let f(x) = x/|x|. As x→0⁺, f = +1; as x→0⁻, f = −1. Left ≠ right → lim<sub>x→0</sub> f(x) <b>does not exist</b>.</div>
<div class="out"><b>Example 2 — a removable hole.</b> g(x) = (x²−1)/(x−1) is undefined at x=1, yet lim<sub>x→1</sub> g(x) = lim (x+1) = <b>2</b>. The limit ignores the hole — that is the whole point.</div>
<div class="pitfall"><b>Trap:</b> a limit is about the trend <em>near</em> a, NOT the value <em>at</em> a. f(a) may be undefined, or defined but different from the limit — the limit still exists as long as both sides approach the same value.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The precise ε–δ definition.</b> "f(x) approaches L" is made rigorous like this: for every tolerance ε &gt; 0 there is a δ &gt; 0 such that 0 &lt; |x − a| &lt; δ guarantees |f(x) − L| &lt; ε. Every intuitive limit rule is a theorem proved from this single definition — the foundation the slides gloss over but that makes calculus airtight.</div>
<div class="note-ct">Continuity is defined by limits: a function is continuous at a if lim<sub>x→a</sub> f(x) = f(a) — no jumps, holes or blow-ups. You can "draw it without lifting your pen." Continuity matters because the nice theorems of calculus assume it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Ý tưởng nền của cả giải tích</h2>
<p class="lead">Một <strong>giới hạn</strong> hỏi: khi x tiến ngày càng gần một giá trị a, thì f(x) tiến tới giá trị nào? (CLO1) Nó không nói về điều xảy ra <em>tại</em> a — mà về xu hướng khi bạn tới gần. Chính ý tưởng này làm cho đạo hàm và tích phân khả thi.</p>
<div class="out"><b>Ký hiệu:</b>  lim<sub>x→a</sub> f(x) = L  — "khi x tiến tới a, f(x) tiến tới L"</div>
<p>Ví dụ: khi x tiến tới 2, x² tiến tới 4. Ta viết lim<sub>x→2</sub> x² = 4. Đơn giản — nhưng giới hạn trở nên thú vị khi không thể chỉ thay số vào.</p>
<h3>Giới hạn một phía</h3>
<p>Bạn có thể tiến tới a từ <strong>bên trái</strong> (x→a⁻) hoặc <strong>bên phải</strong> (x→a⁺). Giới hạn hai phía tồn tại chỉ khi cả hai phía bằng nhau.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Trái</div><div class="lz-t">lim<sub>x→a⁻</sub></div><div class="lz-d">tiến từ dưới</div></div>
  <div class="lz-step"><div class="lz-k">Phải</div><div class="lz-t">lim<sub>x→a⁺</sub></div><div class="lz-d">tiến từ trên</div></div>
  <div class="lz-step"><div class="lz-k">Bằng nhau?</div><div class="lz-t">giới hạn tồn tại</div><div class="lz-d">nếu không thì không</div></div>
</div>
<h3>Khi nào giới hạn không tồn tại</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Nhảy (jump)</div><div class="lz-ld">Giới hạn trái và phải khác nhau (hàm bậc thang tại chỗ nhảy).</div></div>
  <div class="lz-layer"><div class="lz-lt">Vô hạn</div><div class="lz-ld">f(x) tăng không bị chặn, như 1/x² khi x→0.</div></div>
  <div class="lz-layer"><div class="lz-lt">Dao động</div><div class="lz-ld">f(x) lắc mãi không ổn định, như sin(1/x) khi x→0.</div></div>
</div>
<h3>Công thức · Luật giới hạn</h3>
<div class="formula"><span class="lbl">Luật giới hạn (nếu lim f và lim g tồn tại)</span>lim (f ± g) = lim f ± lim g    lim (f·g) = lim f · lim g<br>lim (f/g) = lim f / lim g  (lim g ≠ 0)    lim (c·f) = c · lim f<br>lim [f(x)]ⁿ = [lim f(x)]ⁿ</div>
<div class="formula"><span class="lbl">Hai giới hạn đặc biệt cần nhớ</span>lim<sub>x→0</sub> (sin x)/x = 1    lim<sub>x→∞</sub> (1 + 1/x)ˣ = e</div>
<h3>Ví dụ có lời giải · Giải từng bước</h3>
<div class="out"><b>Ví dụ 1 — hai phía không khớp.</b> Cho f(x) = x/|x|. Khi x→0⁺, f = +1; khi x→0⁻, f = −1. Trái ≠ phải → lim<sub>x→0</sub> f(x) <b>không tồn tại</b>.</div>
<div class="out"><b>Ví dụ 2 — lỗ khử được.</b> g(x) = (x²−1)/(x−1) không xác định tại x=1, nhưng lim<sub>x→1</sub> g(x) = lim (x+1) = <b>2</b>. Giới hạn bỏ qua cái lỗ — đó chính là ý nghĩa của nó.</div>
<div class="pitfall"><b>Bẫy:</b> giới hạn nói về xu hướng <em>gần</em> a, KHÔNG phải giá trị <em>tại</em> a. f(a) có thể không xác định, hoặc xác định nhưng khác giới hạn — giới hạn vẫn tồn tại miễn hai phía tiến về cùng một giá trị.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Định nghĩa ε–δ chính xác.</b> "f(x) tiến tới L" được làm chặt chẽ thế này: với mọi sai số ε &gt; 0 tồn tại δ &gt; 0 sao cho 0 &lt; |x − a| &lt; δ bảo đảm |f(x) − L| &lt; ε. Mọi quy tắc giới hạn trực giác đều là một định lý chứng minh từ định nghĩa duy nhất này — nền tảng mà slide bỏ qua nhưng làm cho giải tích trở nên chặt chẽ.</div>
<div class="note-ct">Tính liên tục được định nghĩa bằng giới hạn: một hàm liên tục tại a nếu lim<sub>x→a</sub> f(x) = f(a) — không nhảy, thủng hay bùng nổ. Bạn "vẽ được nó mà không nhấc bút." Liên tục quan trọng vì các định lý đẹp của giải tích đều giả định nó.</div>
</div>
`,
        },
        {
          title: '1.2 — Computing limits|||1.2 — Cách tính giới hạn',
          slug: 'mae101-1-2-tinh-gioi-han',
          type: 'VIDEO',
          description: 'Luật giới hạn, khử dạng 0/0 bằng phân tích, và giới hạn ở vô cực.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>How to actually compute a limit</h2>
<p class="lead">Most limits are found by three moves: substitute, and if that gives an indeterminate form, simplify first — then substitute.</p>
<h3>Step 1 — try direct substitution</h3>
<p>For continuous functions, just plug in: lim<sub>x→3</sub> (2x + 1) = 2(3) + 1 = 7. The <strong>limit laws</strong> guarantee this: the limit of a sum/product/quotient is the sum/product/quotient of the limits (as long as you do not divide by zero).</p>
<h3>Step 2 — the indeterminate form 0/0</h3>
<p>If substitution gives 0/0, the answer is not "undefined" — you must simplify first, usually by factoring.</p>
<div class="out"><b>Compute</b>  lim<sub>x→2</sub> (x² − 4)/(x − 2)<br>Substituting gives 0/0. Factor: x² − 4 = (x − 2)(x + 2).<br>= lim<sub>x→2</sub> (x + 2) = <b>4</b></div>
<h3>Step 3 — limits at infinity</h3>
<p>As x → ∞, keep only the dominant term. For rational functions, compare the highest powers:</p>
<div class="out"><b>lim<sub>x→∞</sub></b> (3x² + 1)/(x² − 5) = 3  <small>(divide top &amp; bottom by x²; the leading coefficients decide)</small></div>
<h3>Formulas · Indeterminate forms &amp; the degree rule</h3>
<div class="formula"><span class="lbl">Indeterminate forms (must simplify first)</span>0/0    ∞/∞    ∞ − ∞    0·∞    1<sup>∞</sup>    0⁰    ∞⁰</div>
<div class="formula"><span class="lbl">Rational function as x→∞ — compare degrees</span>deg(top) &lt; deg(bottom) → 0    deg(top) = deg(bottom) → ratio of leading coefficients<br>deg(top) &gt; deg(bottom) → ±∞</div>
<h3>Ví dụ có lời giải · Worked examples</h3>
<div class="out"><b>Example — rationalise a root.</b> lim<sub>x→0</sub> (√(x+1) − 1)/x gives 0/0. Multiply by the conjugate (√(x+1)+1):<br>= lim<sub>x→0</sub> (x+1−1)/[x(√(x+1)+1)] = lim<sub>x→0</sub> 1/(√(x+1)+1) = <b>1/2</b>.</div>
<div class="out"><b>Example — degree comparison.</b> lim<sub>x→∞</sub> (2x + 5)/(x² − 1): top degree 1 &lt; bottom degree 2 → <b>0</b>. And lim<sub>x→∞</sub> x³/(x² + 1) → <b>∞</b> (top wins).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>L'Hôpital's rule.</b> For a 0/0 or ∞/∞ form, the limit equals the limit of the derivatives: lim f/g = lim f′/g′. E.g. lim<sub>x→0</sub> (sin x)/x = lim (cos x)/1 = 1 instantly. It is a powerful shortcut built from Part I's derivatives — only valid on those indeterminate forms.</div>
<div class="callout ok">Golden rule: if direct substitution gives a real number, that IS the limit. If it gives 0/0, don&#39;t panic — factor, cancel, or rationalize, then substitute again. Limits at infinity are governed by the highest-power terms.</div>
<a class="link-card exphub" href="/exp-hub/mae101-cong-cu-hoc-tap?ref=%2Fcourses%2Fmathematics-for-engineering%2Flearn&reflabel=MAE101%20%E2%80%94%20Mathematics%20for%20Engineering" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Check limits in Maxima / Desmos</span><span class="lc-sub">Type limit(...) or graph the function — setup on the tools guide.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Cách thực sự tính một giới hạn</h2>
<p class="lead">Hầu hết giới hạn được tìm bằng ba nước: thay số, và nếu ra dạng vô định thì rút gọn trước — rồi thay số.</p>
<h3>Bước 1 — thử thay số trực tiếp</h3>
<p>Với hàm liên tục, cứ thay vào: lim<sub>x→3</sub> (2x + 1) = 2(3) + 1 = 7. Các <strong>luật giới hạn</strong> đảm bảo điều này: giới hạn của tổng/tích/thương là tổng/tích/thương các giới hạn (miễn là không chia cho 0).</p>
<h3>Bước 2 — dạng vô định 0/0</h3>
<p>Nếu thay số ra 0/0, đáp án không phải "không xác định" — bạn phải rút gọn trước, thường bằng phân tích thành nhân tử.</p>
<div class="out"><b>Tính</b>  lim<sub>x→2</sub> (x² − 4)/(x − 2)<br>Thay số ra 0/0. Phân tích: x² − 4 = (x − 2)(x + 2).<br>= lim<sub>x→2</sub> (x + 2) = <b>4</b></div>
<h3>Bước 3 — giới hạn ở vô cực</h3>
<p>Khi x → ∞, chỉ giữ số hạng bậc cao nhất. Với hàm hữu tỉ, so sánh các bậc cao nhất:</p>
<div class="out"><b>lim<sub>x→∞</sub></b> (3x² + 1)/(x² − 5) = 3  <small>(chia tử &amp; mẫu cho x²; hệ số dẫn đầu quyết định)</small></div>
<h3>Công thức · Dạng vô định &amp; quy tắc bậc</h3>
<div class="formula"><span class="lbl">Các dạng vô định (phải rút gọn trước)</span>0/0    ∞/∞    ∞ − ∞    0·∞    1<sup>∞</sup>    0⁰    ∞⁰</div>
<div class="formula"><span class="lbl">Hàm hữu tỉ khi x→∞ — so sánh bậc</span>bậc(tử) &lt; bậc(mẫu) → 0    bậc(tử) = bậc(mẫu) → tỉ số hệ số dẫn đầu<br>bậc(tử) &gt; bậc(mẫu) → ±∞</div>
<h3>Ví dụ có lời giải · Giải từng bước</h3>
<div class="out"><b>Ví dụ — nhân liên hợp.</b> lim<sub>x→0</sub> (√(x+1) − 1)/x ra 0/0. Nhân với liên hợp (√(x+1)+1):<br>= lim<sub>x→0</sub> (x+1−1)/[x(√(x+1)+1)] = lim<sub>x→0</sub> 1/(√(x+1)+1) = <b>1/2</b>.</div>
<div class="out"><b>Ví dụ — so sánh bậc.</b> lim<sub>x→∞</sub> (2x + 5)/(x² − 1): bậc tử 1 &lt; bậc mẫu 2 → <b>0</b>. Và lim<sub>x→∞</sub> x³/(x² + 1) → <b>∞</b> (tử thắng).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Quy tắc L'Hôpital.</b> Với dạng 0/0 hoặc ∞/∞, giới hạn bằng giới hạn của các đạo hàm: lim f/g = lim f′/g′. Vd lim<sub>x→0</sub> (sin x)/x = lim (cos x)/1 = 1 ngay lập tức. Đây là lối tắt mạnh dựng từ đạo hàm ở Phần I — chỉ hợp lệ trên các dạng vô định đó.</div>
<div class="callout ok">Quy tắc vàng: nếu thay số trực tiếp ra một số thực, đó CHÍNH LÀ giới hạn. Nếu ra 0/0, đừng hoảng — phân tích, rút gọn, hoặc nhân liên hợp, rồi thay số lại. Giới hạn ở vô cực do các số hạng bậc cao nhất chi phối.</div>
<a class="link-card exphub" href="/exp-hub/mae101-cong-cu-hoc-tap?ref=%2Fcourses%2Fmathematics-for-engineering%2Flearn&reflabel=MAE101%20%E2%80%94%20Mathematics%20for%20Engineering" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Kiểm giới hạn trong Maxima / Desmos</span><span class="lc-sub">Gõ limit(...) hoặc vẽ đồ thị hàm — cài đặt ở guide công cụ.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 1 Quiz|||Quiz chương 1',
          slug: 'mae101-quiz-ch1',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: giới hạn, một phía, dạng 0/0, giới hạn vô cực.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A two-sided limit at x=a exists only if…|||Giới hạn hai phía tại x=a tồn tại chỉ khi…', options: ['f(a) is defined|||f(a) xác định', 'the left and right limits are equal|||giới hạn trái và phải bằng nhau', 'f is a polynomial|||f là đa thức', 'a = 0'], correctIndex: 1, points: 1 },
              { question: 'lim(x→2) x² equals…|||lim(x→2) x² bằng…', options: ['2', '4', '8', 'does not exist|||không tồn tại'], correctIndex: 1, points: 1 },
              { question: 'lim(x→2) (x²−4)/(x−2) equals…|||lim(x→2) (x²−4)/(x−2) bằng…', options: ['0', 'undefined|||không xác định', '4', '2'], correctIndex: 2, points: 1 },
              { question: 'When direct substitution gives 0/0, you should…|||Khi thay số trực tiếp ra 0/0, bạn nên…', options: ['conclude the limit does not exist|||kết luận giới hạn không tồn tại', 'simplify (e.g. factor) then substitute again|||rút gọn (vd phân tích) rồi thay lại', 'answer 1|||trả lời 1', 'answer 0|||trả lời 0'], correctIndex: 1, points: 1 },
              { question: 'lim(x→∞) (3x²+1)/(x²−5) equals…|||lim(x→∞) (3x²+1)/(x²−5) bằng…', options: ['0', '3', '∞', '1'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — ĐẠO HÀM ══════════════════ */
    {
      title: 'Chapter 2 — Derivatives|||Chương 2 — Đạo hàm',
      description: 'Đạo hàm là tốc độ thay đổi tức thời và các quy tắc tính đạo hàm.',
      lessons: [
        {
          title: '2.1 — The derivative as a rate of change|||2.1 — Đạo hàm là tốc độ thay đổi',
          slug: 'mae101-2-1-dao-ham',
          type: 'VIDEO',
          description: 'Định nghĩa đạo hàm bằng giới hạn và ý nghĩa độ dốc tiếp tuyến.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>What is a derivative?</h2>
<p class="lead">The <strong>derivative</strong> f′(x) measures how fast f is changing at a point — the <em>instantaneous rate of change</em> (CLO2). Geometrically, it is the <strong>slope of the tangent line</strong> to the curve at that point.</p>
<div class="out"><b>Definition:</b>  f′(x) = lim<sub>h→0</sub> [ f(x + h) − f(x) ] / h</div>
<p>The fraction [f(x+h) − f(x)] / h is the slope between two nearby points (average rate of change). Letting h → 0 shrinks the gap to a single point — giving the <em>instantaneous</em> rate.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Two points</div><div class="lz-t">average slope</div><div class="lz-d">rise over run</div></div>
  <div class="lz-step"><div class="lz-k">h → 0</div><div class="lz-t">points merge</div><div class="lz-d">the limit</div></div>
  <div class="lz-step"><div class="lz-k">Result</div><div class="lz-t">tangent slope</div><div class="lz-d">instantaneous rate f′(x)</div></div>
</div>
<h3>Real meaning</h3>
<p>If f(t) is position, f′(t) is velocity. If f(x) is cost, f′(x) is marginal cost. The derivative turns "how much" into "how fast it changes" — the core question of engineering and science.</p>
<div class="out"><b>From the definition:</b>  for f(x) = x²,<br>f′(x) = lim<sub>h→0</sub> [(x+h)² − x²]/h = lim<sub>h→0</sub> (2x + h) = <b>2x</b></div>
<h3>Formulas · Notation &amp; the definition</h3>
<div class="formula"><span class="lbl">Three notations for the same thing</span>f′(x) = y′ = dy/dx = df/dx    <span class="lbl">Definition</span>f′(x) = lim<sub>h→0</sub> [f(x+h) − f(x)] / h</div>
<div class="formula"><span class="lbl">Alternative form (limit at a point a)</span>f′(a) = lim<sub>x→a</sub> [f(x) − f(a)] / (x − a)</div>
<h3>Ví dụ có lời giải · Worked examples (from the definition)</h3>
<div class="out"><b>Example 1 — f(x) = x³.</b> f′(x) = lim<sub>h→0</sub> [(x+h)³ − x³]/h = lim<sub>h→0</sub> [3x²h + 3xh² + h³]/h = lim<sub>h→0</sub> (3x² + 3xh + h²) = <b>3x²</b>.</div>
<div class="out"><b>Example 2 — f(x) = √x.</b> f′(x) = lim<sub>h→0</sub> [√(x+h) − √x]/h. Multiply by the conjugate → lim<sub>h→0</sub> 1/(√(x+h)+√x) = <b>1/(2√x)</b>.</div>
<div class="pitfall"><b>Trap:</b> the average rate of change (a slope between two points) is not the same as the derivative (the instantaneous rate at one point). The derivative is the <em>limit</em> of the average rate as the two points merge.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Differentiable ⟹ continuous, but not the reverse.</b> If f′(a) exists, f must be continuous at a. The converse fails: f(x) = |x| is continuous at 0 but has a sharp corner there, so f′(0) does not exist (left slope −1 ≠ right slope +1). Smoothness is strictly stronger than continuity — a distinction the intro slides rarely make explicit.</div>
<div class="note-ct">A function is <em>differentiable</em> at a point if this limit exists. It fails at sharp corners, jumps, and vertical tangents — where there is no single well-defined slope.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Đạo hàm là gì?</h2>
<p class="lead"><strong>Đạo hàm</strong> f′(x) đo f thay đổi nhanh thế nào tại một điểm — <em>tốc độ thay đổi tức thời</em> (CLO2). Về mặt hình học, nó là <strong>độ dốc của tiếp tuyến</strong> với đường cong tại điểm đó.</p>
<div class="out"><b>Định nghĩa:</b>  f′(x) = lim<sub>h→0</sub> [ f(x + h) − f(x) ] / h</div>
<p>Phân số [f(x+h) − f(x)] / h là độ dốc giữa hai điểm gần nhau (tốc độ thay đổi trung bình). Cho h → 0 thu khoảng cách về một điểm — cho tốc độ <em>tức thời</em>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Hai điểm</div><div class="lz-t">độ dốc trung bình</div><div class="lz-d">tăng chia cho chạy</div></div>
  <div class="lz-step"><div class="lz-k">h → 0</div><div class="lz-t">hai điểm nhập một</div><div class="lz-d">giới hạn</div></div>
  <div class="lz-step"><div class="lz-k">Kết quả</div><div class="lz-t">độ dốc tiếp tuyến</div><div class="lz-d">tốc độ tức thời f′(x)</div></div>
</div>
<h3>Ý nghĩa thực</h3>
<p>Nếu f(t) là vị trí, f′(t) là vận tốc. Nếu f(x) là chi phí, f′(x) là chi phí biên. Đạo hàm biến "bao nhiêu" thành "thay đổi nhanh ra sao" — câu hỏi cốt lõi của kỹ thuật và khoa học.</p>
<div class="out"><b>Từ định nghĩa:</b>  với f(x) = x²,<br>f′(x) = lim<sub>h→0</sub> [(x+h)² − x²]/h = lim<sub>h→0</sub> (2x + h) = <b>2x</b></div>
<h3>Công thức · Ký hiệu &amp; định nghĩa</h3>
<div class="formula"><span class="lbl">Ba ký hiệu cho cùng một thứ</span>f′(x) = y′ = dy/dx = df/dx    <span class="lbl">Định nghĩa</span>f′(x) = lim<sub>h→0</sub> [f(x+h) − f(x)] / h</div>
<div class="formula"><span class="lbl">Dạng khác (giới hạn tại điểm a)</span>f′(a) = lim<sub>x→a</sub> [f(x) − f(a)] / (x − a)</div>
<h3>Ví dụ có lời giải · Giải từng bước (từ định nghĩa)</h3>
<div class="out"><b>Ví dụ 1 — f(x) = x³.</b> f′(x) = lim<sub>h→0</sub> [(x+h)³ − x³]/h = lim<sub>h→0</sub> [3x²h + 3xh² + h³]/h = lim<sub>h→0</sub> (3x² + 3xh + h²) = <b>3x²</b>.</div>
<div class="out"><b>Ví dụ 2 — f(x) = √x.</b> f′(x) = lim<sub>h→0</sub> [√(x+h) − √x]/h. Nhân với liên hợp → lim<sub>h→0</sub> 1/(√(x+h)+√x) = <b>1/(2√x)</b>.</div>
<div class="pitfall"><b>Bẫy:</b> tốc độ thay đổi trung bình (độ dốc giữa hai điểm) khác với đạo hàm (tốc độ tức thời tại một điểm). Đạo hàm là <em>giới hạn</em> của tốc độ trung bình khi hai điểm nhập lại.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khả vi ⟹ liên tục, nhưng không ngược lại.</b> Nếu f′(a) tồn tại thì f phải liên tục tại a. Chiều ngược sai: f(x) = |x| liên tục tại 0 nhưng có góc nhọn ở đó, nên f′(0) không tồn tại (độ dốc trái −1 ≠ độ dốc phải +1). Tính trơn mạnh hơn hẳn tính liên tục — điều mà slide nhập môn ít khi nói rõ.</div>
<div class="note-ct">Một hàm <em>khả vi</em> tại một điểm nếu giới hạn này tồn tại. Nó thất bại tại góc nhọn, chỗ nhảy, và tiếp tuyến thẳng đứng — nơi không có một độ dốc xác định duy nhất.</div>
</div>
`,
        },
        {
          title: '2.2 — Differentiation rules|||2.2 — Các quy tắc đạo hàm',
          slug: 'mae101-2-2-quy-tac-dao-ham',
          type: 'VIDEO',
          description: 'Quy tắc luỹ thừa, tích, thương, dây chuyền và đạo hàm lượng giác.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Rules that make differentiation fast</h2>
<p class="lead">You rarely use the limit definition in practice — a handful of <strong>rules</strong> let you differentiate almost anything quickly. Memorize these; they are the workhorses of Part I.</p>
<table>
  <thead><tr><th>Rule</th><th>Formula</th></tr></thead>
  <tbody>
    <tr><td>Power</td><td>d/dx (xⁿ) = n·xⁿ⁻¹</td></tr>
    <tr><td>Constant multiple</td><td>d/dx (c·f) = c·f′</td></tr>
    <tr><td>Sum</td><td>(f + g)′ = f′ + g′</td></tr>
    <tr><td>Product</td><td>(f·g)′ = f′g + fg′</td></tr>
    <tr><td>Quotient</td><td>(f/g)′ = (f′g − fg′) / g²</td></tr>
    <tr><td>Chain</td><td>d/dx f(g(x)) = f′(g(x))·g′(x)</td></tr>
  </tbody>
</table>
<h3>Common derivatives — memorise these</h3>
<div class="formula"><span class="lbl">Elementary derivatives</span>d/dx (xⁿ) = n·xⁿ⁻¹    d/dx (sin x) = cos x    d/dx (cos x) = −sin x<br>d/dx (tan x) = 1/cos²x = sec²x    d/dx (eˣ) = eˣ    d/dx (aˣ) = aˣ·ln a<br>d/dx (ln x) = 1/x    d/dx (√x) = 1/(2√x)</div>

<h3>How to choose the right rule</h3>
<div class="lz-stack">
  <div class="lz-layer">A single power/term → <b>power rule</b>. A sum → differentiate term by term.</div>
  <div class="lz-layer">Two things <b>multiplied</b> → <b>product rule</b>. One thing <b>divided</b> by another → <b>quotient rule</b>.</div>
  <div class="lz-layer">A <b>function inside a function</b> (composite) → <b>chain rule</b> — the most common and most-missed.</div>
</div>

<h3>Ví dụ có lời giải · Worked examples (step by step)</h3>
<div class="out"><b>Example 1 — power + sum.</b> f(x) = 3x⁴ − 5x² + 7.<br>
f′(x) = 3·4x³ − 5·2x + 0 = <b>12x³ − 10x</b>. (Constant 7 → 0.)</div>
<div class="out"><b>Example 2 — product rule.</b> f(x) = x²·sin x. Let u = x² (u′ = 2x), v = sin x (v′ = cos x).<br>
f′ = u′v + uv′ = 2x·sin x + x²·cos x = <b>2x sin x + x² cos x</b>.</div>
<div class="out"><b>Example 3 — quotient rule.</b> f(x) = (x + 1)/(x − 1). u = x+1 (u′=1), v = x−1 (v′=1).<br>
f′ = (u′v − uv′)/v² = [1·(x−1) − (x+1)·1]/(x−1)² = (x−1−x−1)/(x−1)² = <b>−2/(x−1)²</b>.</div>
<div class="out"><b>Example 4 — chain rule.</b> f(x) = (3x² + 1)⁵. Outer ( )⁵ → 5( )⁴; inner derivative 6x.<br>
f′(x) = 5(3x² + 1)⁴ · 6x = <b>30x(3x² + 1)⁴</b>.</div>

<div class="pitfall"><b>Trap:</b> the product rule is NOT (f·g)′ = f′·g′ — that is wrong. You must keep both cross-terms: f′g + fg′. Same for the quotient: mind the minus sign and the g² denominator.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Logarithmic differentiation — for nasty products/powers.</b> To differentiate something like y = xˣ or a big product, take ln of both sides first: ln y = x·ln x, then differentiate implicitly: y′/y = ln x + 1, so y′ = xˣ(ln x + 1). This trick turns products into sums and powers into products (via log laws), making otherwise-impossible derivatives routine — a tool the basic slides skip but every engineer uses.</div>
<div class="note-ct">Higher derivatives just repeat the process: f″(x) is the derivative of f′(x). The second derivative measures how the rate itself is changing (acceleration, concavity) — you will use it in Chapter 3.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Các quy tắc giúp tính đạo hàm nhanh</h2>
<p class="lead">Bạn hiếm khi dùng định nghĩa giới hạn trong thực tế — một nhúm <strong>quy tắc</strong> cho bạn tính đạo hàm gần như mọi thứ thật nhanh. Học thuộc chúng; đây là những "con ngựa thồ" của Phần I.</p>
<table>
  <thead><tr><th>Quy tắc</th><th>Công thức</th></tr></thead>
  <tbody>
    <tr><td>Luỹ thừa</td><td>d/dx (xⁿ) = n·xⁿ⁻¹</td></tr>
    <tr><td>Nhân hằng số</td><td>d/dx (c·f) = c·f′</td></tr>
    <tr><td>Tổng</td><td>(f + g)′ = f′ + g′</td></tr>
    <tr><td>Tích</td><td>(f·g)′ = f′g + fg′</td></tr>
    <tr><td>Thương</td><td>(f/g)′ = (f′g − fg′) / g²</td></tr>
    <tr><td>Dây chuyền (chain)</td><td>d/dx f(g(x)) = f′(g(x))·g′(x)</td></tr>
  </tbody>
</table>
<h3>Các đạo hàm cần nhớ — học thuộc</h3>
<div class="formula"><span class="lbl">Đạo hàm cơ bản</span>d/dx (xⁿ) = n·xⁿ⁻¹    d/dx (sin x) = cos x    d/dx (cos x) = −sin x<br>d/dx (tan x) = 1/cos²x = sec²x    d/dx (eˣ) = eˣ    d/dx (aˣ) = aˣ·ln a<br>d/dx (ln x) = 1/x    d/dx (√x) = 1/(2√x)</div>

<h3>Cách chọn đúng quy tắc</h3>
<div class="lz-stack">
  <div class="lz-layer">Một luỹ thừa/hạng tử đơn → <b>quy tắc luỹ thừa</b>. Một tổng → lấy đạo hàm từng hạng tử.</div>
  <div class="lz-layer">Hai thứ <b>nhân</b> nhau → <b>quy tắc tích</b>. Một thứ <b>chia</b> cho thứ khác → <b>quy tắc thương</b>.</div>
  <div class="lz-layer">Một <b>hàm trong hàm</b> (hợp) → <b>quy tắc dây chuyền</b> — phổ biến nhất và hay bị bỏ sót nhất.</div>
</div>

<h3>Ví dụ có lời giải · Giải từng bước</h3>
<div class="out"><b>Ví dụ 1 — luỹ thừa + tổng.</b> f(x) = 3x⁴ − 5x² + 7.<br>
f′(x) = 3·4x³ − 5·2x + 0 = <b>12x³ − 10x</b>. (Hằng số 7 → 0.)</div>
<div class="out"><b>Ví dụ 2 — quy tắc tích.</b> f(x) = x²·sin x. Đặt u = x² (u′ = 2x), v = sin x (v′ = cos x).<br>
f′ = u′v + uv′ = 2x·sin x + x²·cos x = <b>2x sin x + x² cos x</b>.</div>
<div class="out"><b>Ví dụ 3 — quy tắc thương.</b> f(x) = (x + 1)/(x − 1). u = x+1 (u′=1), v = x−1 (v′=1).<br>
f′ = (u′v − uv′)/v² = [1·(x−1) − (x+1)·1]/(x−1)² = (x−1−x−1)/(x−1)² = <b>−2/(x−1)²</b>.</div>
<div class="out"><b>Ví dụ 4 — quy tắc dây chuyền.</b> f(x) = (3x² + 1)⁵. Ngoài ( )⁵ → 5( )⁴; đạo hàm phần trong 6x.<br>
f′(x) = 5(3x² + 1)⁴ · 6x = <b>30x(3x² + 1)⁴</b>.</div>

<div class="pitfall"><b>Bẫy:</b> quy tắc tích KHÔNG phải (f·g)′ = f′·g′ — đó là sai. Phải giữ cả hai số hạng chéo: f′g + fg′. Tương tự với thương: chú ý dấu trừ và mẫu g².</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đạo hàm logarit — cho tích/luỹ thừa hóc búa.</b> Để lấy đạo hàm thứ như y = xˣ hay một tích lớn, lấy ln hai vế trước: ln y = x·ln x, rồi lấy đạo hàm ẩn: y′/y = ln x + 1, nên y′ = xˣ(ln x + 1). Mẹo này biến tích thành tổng và luỹ thừa thành tích (qua luật log), làm những đạo hàm tưởng bất khả thi thành thường ngày — công cụ slide cơ bản bỏ qua nhưng mọi kỹ sư đều dùng.</div>
<div class="note-ct">Đạo hàm cấp cao chỉ lặp lại quá trình: f″(x) là đạo hàm của f′(x). Đạo hàm cấp hai đo chính tốc độ đang thay đổi ra sao (gia tốc, độ lồi/lõm) — bạn sẽ dùng nó ở Chương 3.</div>
</div>
`,
        },
        {
          title: 'Chapter 2 Quiz|||Quiz chương 2',
          slug: 'mae101-quiz-ch2',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: định nghĩa đạo hàm, quy tắc luỹ thừa/tích/dây chuyền.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The derivative f′(x) geometrically represents…|||Về mặt hình học, đạo hàm f′(x) biểu diễn…', options: ['the area under the curve|||diện tích dưới đường cong', 'the slope of the tangent line|||độ dốc của tiếp tuyến', 'the y-intercept|||giao điểm trục y', 'the limit at infinity|||giới hạn ở vô cực'], correctIndex: 1, points: 1 },
              { question: 'By the power rule, d/dx (x⁵) = …|||Theo quy tắc luỹ thừa, d/dx (x⁵) = …', options: ['5x⁴', 'x⁴', '5x⁶', '4x⁵'], correctIndex: 0, points: 1 },
              { question: 'd/dx (sin x) = …|||d/dx (sin x) = …', options: ['−sin x', 'cos x', '−cos x', 'sin x'], correctIndex: 1, points: 1 },
              { question: 'Using the chain rule, d/dx (3x²+1)⁵ = …|||Dùng quy tắc dây chuyền, d/dx (3x²+1)⁵ = …', options: ['5(3x²+1)⁴', '30x(3x²+1)⁴', '(3x²+1)⁴', '6x(3x²+1)⁵'], correctIndex: 1, points: 1 },
              { question: 'The product rule (f·g)′ equals…|||Quy tắc tích (f·g)′ bằng…', options: ['f′·g′', 'f′g + fg′', 'f′g − fg′', 'f′/g′'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — ỨNG DỤNG ĐẠO HÀM ══════════════════ */
    {
      title: 'Chapter 3 — Applications of Derivatives|||Chương 3 — Ứng dụng đạo hàm',
      description: 'Dùng đạo hàm để phân tích đồ thị và giải bài toán tối ưu.',
      lessons: [
        {
          title: '3.1 — Analyzing a function|||3.1 — Phân tích một hàm số',
          slug: 'mae101-3-1-phan-tich-ham',
          type: 'VIDEO',
          description: 'Tăng/giảm, cực trị và độ lồi/lõm từ f′ và f″.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Reading a graph from its derivatives</h2>
<p class="lead">The derivative tells you the shape of a function without plotting a single point (CLO3). The first derivative reveals where it rises and falls; the second reveals how it curves.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">f′(x) &gt; 0 → increasing</div><div class="lz-ld">the function is going up.</div></div>
  <div class="lz-layer"><div class="lz-lt">f′(x) &lt; 0 → decreasing</div><div class="lz-ld">the function is going down.</div></div>
  <div class="lz-layer"><div class="lz-lt">f′(x) = 0 → critical point</div><div class="lz-ld">a possible peak (maximum) or valley (minimum).</div></div>
</div>
<h3>Finding maxima and minima</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Solve f′(x) = 0</div><div class="lz-d">find critical points</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Test the sign of f′</div><div class="lz-d">+ to − = max · − to + = min</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">or use f″</div><div class="lz-d">f″&gt;0 = min · f″&lt;0 = max</div></div>
</div>
<h3>Concavity — the second derivative</h3>
<p>f″(x) &gt; 0 means the curve is <strong>concave up</strong> (like a cup ∪); f″(x) &lt; 0 means <strong>concave down</strong> (like a cap ∩). Where concavity switches is an <strong>inflection point</strong>.</p>
<div class="out"><b>Example:</b>  f(x) = x² has f′(x) = 2x = 0 at x = 0, and f″(x) = 2 &gt; 0 → x = 0 is a <b>minimum</b>. The parabola&#39;s vertex, confirmed by calculus.</div>
<h3>Formulas · The two tests</h3>
<div class="formula"><span class="lbl">First-derivative test (at a critical point c where f′(c)=0)</span>f′ changes + → − at c ⟹ local MAX    f′ changes − → + at c ⟹ local MIN    no sign change ⟹ neither</div>
<div class="formula"><span class="lbl">Second-derivative test</span>f′(c)=0 and f″(c) &gt; 0 ⟹ MIN    f′(c)=0 and f″(c) &lt; 0 ⟹ MAX    f″(c)=0 ⟹ inconclusive</div>
<h3>Ví dụ có lời giải · Worked example (full analysis)</h3>
<div class="out"><b>Analyse f(x) = x³ − 3x.</b><br>
1) f′(x) = 3x² − 3 = 0 → x = −1, x = +1 (critical points).<br>
2) f″(x) = 6x. f″(−1) = −6 &lt; 0 → x=−1 is a <b>local MAX</b>, f(−1)=2. f″(1)=6 &gt; 0 → x=1 is a <b>local MIN</b>, f(1)=−2.<br>
3) f″=0 at x=0 → <b>inflection point</b> (0,0); concave down for x&lt;0, concave up for x&gt;0.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>When the second-derivative test fails.</b> If f″(c)=0 the test says nothing — fall back to the first-derivative (sign) test. Example: f(x)=x⁴ has f′(0)=f″(0)=0, yet x=0 is clearly a minimum (confirmed by the sign of f′). Knowing which test to trust is part of the craft.</div>
<div class="note-ct">This is the calculus toolkit for sketching any curve: find where it rises/falls (f′), where it peaks/dips (f′ = 0), and how it bends (f″). No memorized graph shapes needed.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Đọc đồ thị từ các đạo hàm của nó</h2>
<p class="lead">Đạo hàm cho bạn biết hình dạng của một hàm mà không cần vẽ một điểm nào (CLO3). Đạo hàm cấp một tiết lộ chỗ tăng và giảm; cấp hai tiết lộ nó cong ra sao.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">f′(x) &gt; 0 → đồng biến (tăng)</div><div class="lz-ld">hàm đang đi lên.</div></div>
  <div class="lz-layer"><div class="lz-lt">f′(x) &lt; 0 → nghịch biến (giảm)</div><div class="lz-ld">hàm đang đi xuống.</div></div>
  <div class="lz-layer"><div class="lz-lt">f′(x) = 0 → điểm tới hạn</div><div class="lz-ld">một đỉnh (cực đại) hoặc đáy (cực tiểu) khả dĩ.</div></div>
</div>
<h3>Tìm cực đại và cực tiểu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Giải f′(x) = 0</div><div class="lz-d">tìm điểm tới hạn</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Xét dấu f′</div><div class="lz-d">+ sang − = cực đại · − sang + = cực tiểu</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">hoặc dùng f″</div><div class="lz-d">f″&gt;0 = cực tiểu · f″&lt;0 = cực đại</div></div>
</div>
<h3>Độ lồi/lõm — đạo hàm cấp hai</h3>
<p>f″(x) &gt; 0 nghĩa là đường cong <strong>lõm lên (concave up)</strong> (như cái cốc ∪); f″(x) &lt; 0 nghĩa là <strong>lồi lên / lõm xuống (concave down)</strong> (như cái nắp ∩). Chỗ độ lồi/lõm đổi chiều là <strong>điểm uốn (inflection point)</strong>.</p>
<div class="out"><b>Ví dụ:</b>  f(x) = x² có f′(x) = 2x = 0 tại x = 0, và f″(x) = 2 &gt; 0 → x = 0 là <b>cực tiểu</b>. Đỉnh của parabol, được giải tích xác nhận.</div>
<h3>Công thức · Hai bài kiểm tra</h3>
<div class="formula"><span class="lbl">Kiểm tra đạo hàm cấp 1 (tại điểm tới hạn c với f′(c)=0)</span>f′ đổi + → − tại c ⟹ CỰC ĐẠI địa phương    f′ đổi − → + tại c ⟹ CỰC TIỂU    không đổi dấu ⟹ không phải cực trị</div>
<div class="formula"><span class="lbl">Kiểm tra đạo hàm cấp 2</span>f′(c)=0 và f″(c) &gt; 0 ⟹ CỰC TIỂU    f′(c)=0 và f″(c) &lt; 0 ⟹ CỰC ĐẠI    f″(c)=0 ⟹ không kết luận được</div>
<h3>Ví dụ có lời giải · Giải từng bước (phân tích đầy đủ)</h3>
<div class="out"><b>Phân tích f(x) = x³ − 3x.</b><br>
1) f′(x) = 3x² − 3 = 0 → x = −1, x = +1 (điểm tới hạn).<br>
2) f″(x) = 6x. f″(−1) = −6 &lt; 0 → x=−1 là <b>CỰC ĐẠI</b>, f(−1)=2. f″(1)=6 &gt; 0 → x=1 là <b>CỰC TIỂU</b>, f(1)=−2.<br>
3) f″=0 tại x=0 → <b>điểm uốn</b> (0,0); lõm xuống khi x&lt;0, lõm lên khi x&gt;0.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khi kiểm tra đạo hàm cấp 2 thất bại.</b> Nếu f″(c)=0 thì bài kiểm tra không nói gì — quay về kiểm tra dấu của đạo hàm cấp 1. Ví dụ: f(x)=x⁴ có f′(0)=f″(0)=0, nhưng x=0 rõ ràng là cực tiểu (xác nhận bằng dấu của f′). Biết tin bài kiểm tra nào là một phần của tay nghề.</div>
<div class="note-ct">Đây là bộ công cụ giải tích để phác thảo mọi đường cong: tìm chỗ tăng/giảm (f′), chỗ đỉnh/đáy (f′ = 0), và cách nó uốn (f″). Không cần học thuộc hình dạng đồ thị nào.</div>
</div>
`,
        },
        {
          title: '3.2 — Optimization & limits at infinity|||3.2 — Bài toán tối ưu & giới hạn vô cực',
          slug: 'mae101-3-2-toi-uu',
          type: 'VIDEO',
          description: 'Tìm giá trị lớn nhất/nhỏ nhất trong bài toán thực và tiệm cận.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Optimization — the most useful application</h2>
<p class="lead">"What is the maximum profit? The minimum material? The best angle?" These are <strong>optimization</strong> problems, and calculus solves them by finding where the derivative is zero.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Model</div><div class="lz-t">write the quantity</div><div class="lz-d">as a function of one variable</div></div>
  <div class="lz-step"><div class="lz-k">Differentiate</div><div class="lz-t">set f′ = 0</div><div class="lz-d">find critical points</div></div>
  <div class="lz-step"><div class="lz-k">Test</div><div class="lz-t">max or min?</div><div class="lz-d">check f″ or endpoints</div></div>
</div>
<div class="out"><b>Classic:</b> Of all rectangles with perimeter 20, which has the largest area?<br>Area A = x(10 − x) = 10x − x².  A′ = 10 − 2x = 0 → x = 5.<br>A″ = −2 &lt; 0 → maximum. The best rectangle is a <b>5 × 5 square</b>, area 25.</div>
<h3>Limits at infinity → asymptotes</h3>
<p>As covered in Chapter 1, lim<sub>x→∞</sub> f(x) describes the function&#39;s long-run behavior. If it approaches a constant L, the line y = L is a <strong>horizontal asymptote</strong> — the graph flattens toward it. This shapes the far ends of your curve sketch.</p>
<h3>Formulas · Optimization recipe</h3>
<div class="formula"><span class="lbl">Closed-interval method — max/min of f on [a, b]</span>1) find critical points (f′=0) inside (a,b)    2) evaluate f at those points AND at a, b    3) largest value = max, smallest = min</div>
<h3>Ví dụ có lời giải · Worked examples</h3>
<div class="out"><b>Example 1 — pen against a wall.</b> 100 m of fence makes three sides of a rectangle (a wall is the fourth). Let width x, length 100 − 2x. Area A = x(100 − 2x) = 100x − 2x².<br>A′ = 100 − 4x = 0 → x = 25. A″ = −4 &lt; 0 → maximum. Best pen: 25 × 50, area <b>1250 m²</b>.</div>
<div class="out"><b>Example 2 — closed interval.</b> Max/min of f(x) = x³ − 3x on [0, 2]. Critical point in (0,2): x=1. Evaluate f(0)=0, f(1)=−2, f(2)=2 → <b>max = 2 at x=2</b> (an endpoint), <b>min = −2 at x=1</b>.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The Extreme Value Theorem.</b> A function continuous on a closed interval [a,b] is guaranteed to attain both a maximum and a minimum on it. That is why the closed-interval method always works — and why you must check the endpoints, not just where f′=0 (Example 2's maximum was at an endpoint, not a critical point).</div>
<div class="callout ok">Optimization is where calculus earns its keep in engineering and economics: minimize cost, maximize strength, optimize a design. The recipe is always the same — model it, differentiate, set to zero, and verify it is the extremum you want.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Bài toán tối ưu — ứng dụng hữu ích nhất</h2>
<p class="lead">"Lợi nhuận lớn nhất là bao nhiêu? Vật liệu ít nhất? Góc tốt nhất?" Đây là các bài toán <strong>tối ưu</strong>, và giải tích giải chúng bằng cách tìm chỗ đạo hàm bằng 0.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Mô hình</div><div class="lz-t">viết đại lượng</div><div class="lz-d">thành hàm một biến</div></div>
  <div class="lz-step"><div class="lz-k">Đạo hàm</div><div class="lz-t">đặt f′ = 0</div><div class="lz-d">tìm điểm tới hạn</div></div>
  <div class="lz-step"><div class="lz-k">Kiểm</div><div class="lz-t">cực đại hay cực tiểu?</div><div class="lz-d">xét f″ hoặc điểm đầu mút</div></div>
</div>
<div class="out"><b>Kinh điển:</b> Trong mọi hình chữ nhật chu vi 20, cái nào có diện tích lớn nhất?<br>Diện tích A = x(10 − x) = 10x − x².  A′ = 10 − 2x = 0 → x = 5.<br>A″ = −2 &lt; 0 → cực đại. Hình chữ nhật tốt nhất là <b>hình vuông 5 × 5</b>, diện tích 25.</div>
<h3>Giới hạn ở vô cực → tiệm cận</h3>
<p>Như đã học ở Chương 1, lim<sub>x→∞</sub> f(x) mô tả hành vi dài hạn của hàm. Nếu nó tiến tới một hằng số L, đường y = L là một <strong>tiệm cận ngang (horizontal asymptote)</strong> — đồ thị dẹt dần về phía nó. Điều này định hình hai đầu xa của phác thảo đường cong.</p>
<h3>Công thức · Quy trình tối ưu</h3>
<div class="formula"><span class="lbl">Phương pháp khoảng đóng — tìm max/min của f trên [a, b]</span>1) tìm điểm tới hạn (f′=0) trong (a,b)    2) tính f tại các điểm đó VÀ tại a, b    3) giá trị lớn nhất = max, nhỏ nhất = min</div>
<h3>Ví dụ có lời giải · Giải từng bước</h3>
<div class="out"><b>Ví dụ 1 — chuồng dựa vào tường.</b> 100 m hàng rào làm ba cạnh của hình chữ nhật (tường là cạnh thứ tư). Gọi chiều rộng x, chiều dài 100 − 2x. Diện tích A = x(100 − 2x) = 100x − 2x².<br>A′ = 100 − 4x = 0 → x = 25. A″ = −4 &lt; 0 → cực đại. Chuồng tốt nhất: 25 × 50, diện tích <b>1250 m²</b>.</div>
<div class="out"><b>Ví dụ 2 — khoảng đóng.</b> Tìm max/min của f(x) = x³ − 3x trên [0, 2]. Điểm tới hạn trong (0,2): x=1. Tính f(0)=0, f(1)=−2, f(2)=2 → <b>max = 2 tại x=2</b> (điểm đầu mút), <b>min = −2 tại x=1</b>.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Định lý giá trị cực trị (Extreme Value Theorem).</b> Một hàm liên tục trên khoảng đóng [a,b] chắc chắn đạt cả giá trị lớn nhất lẫn nhỏ nhất trên nó. Đó là lý do phương pháp khoảng đóng luôn đúng — và vì sao bạn phải kiểm điểm đầu mút, không chỉ chỗ f′=0 (cực đại ở Ví dụ 2 nằm ở đầu mút, không phải điểm tới hạn).</div>
<div class="callout ok">Tối ưu là nơi giải tích chứng tỏ giá trị trong kỹ thuật và kinh tế: tối thiểu chi phí, tối đa độ bền, tối ưu thiết kế. Công thức luôn như nhau — mô hình hoá, lấy đạo hàm, đặt bằng 0, và xác nhận đó là cực trị bạn muốn.</div>
</div>
`,
        },
        {
          title: 'Chapter 3 Quiz|||Quiz chương 3',
          slug: 'mae101-quiz-ch3',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: tăng/giảm, cực trị, độ lồi/lõm, tối ưu.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'If f′(x) > 0 on an interval, the function is…|||Nếu f′(x) > 0 trên một khoảng, hàm số…', options: ['decreasing|||nghịch biến (giảm)', 'increasing|||đồng biến (tăng)', 'constant|||hằng', 'undefined|||không xác định'], correctIndex: 1, points: 1 },
              { question: 'A critical point occurs where…|||Điểm tới hạn xảy ra ở chỗ…', options: ['f(x) = 0', 'f′(x) = 0 (or is undefined)|||f′(x) = 0 (hoặc không xác định)', 'f″(x) = 2', 'x = 0'], correctIndex: 1, points: 1 },
              { question: 'If f′(a) = 0 and f″(a) > 0, then x = a is a…|||Nếu f′(a) = 0 và f″(a) > 0, thì x = a là…', options: ['maximum|||cực đại', 'minimum|||cực tiểu', 'inflection point|||điểm uốn', 'asymptote|||tiệm cận'], correctIndex: 1, points: 1 },
              { question: 'f″(x) < 0 means the curve is…|||f″(x) < 0 nghĩa là đường cong…', options: ['concave up (∪)|||lõm lên (∪)', 'concave down (∩)|||lõm xuống (∩)', 'a straight line|||một đường thẳng', 'increasing|||tăng'], correctIndex: 1, points: 1 },
              { question: 'Of all rectangles with perimeter 20, the maximum area is a…|||Trong mọi hình chữ nhật chu vi 20, diện tích lớn nhất là…', options: ['long thin rectangle|||hình chữ nhật dài mảnh', '5 × 5 square (area 25)|||hình vuông 5 × 5 (diện tích 25)', '2 × 8 rectangle|||hình chữ nhật 2 × 8', 'there is no maximum|||không có cực đại'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — TÍCH PHÂN ══════════════════ */
    {
      title: 'Chapter 4 — Integrals|||Chương 4 — Tích phân',
      description: 'Tích phân xác định, định lý cơ bản và các kỹ thuật tính tích phân.',
      lessons: [
        {
          title: '4.1 — The definite integral & the Fundamental Theorem|||4.1 — Tích phân xác định & định lý cơ bản',
          slug: 'mae101-4-1-tich-phan',
          type: 'VIDEO',
          description: 'Diện tích dưới đường cong, tổng Riemann và định lý nối đạo hàm với tích phân.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Integration — adding up infinitely many pieces</h2>
<p class="lead">Where the derivative breaks change into instants, the <strong>integral</strong> adds up quantities over an interval (CLO4). Its classic meaning is the <strong>area under a curve</strong>.</p>
<h3>Riemann sums → the definite integral</h3>
<p>To find the area under f from x = a to x = b, slice it into thin rectangles, add their areas, then let the width shrink to zero. That limit is the <strong>definite integral</strong>:</p>
<div class="out">∫<sub>a</sub><sup>b</sup> f(x) dx  =  the exact area under f between a and b</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Slice</div><div class="lz-t">thin rectangles</div><div class="lz-d">approximate the area</div></div>
  <div class="lz-step"><div class="lz-k">Sum</div><div class="lz-t">add them (Riemann sum)</div><div class="lz-d">rough total</div></div>
  <div class="lz-step"><div class="lz-k">Limit</div><div class="lz-t">width → 0</div><div class="lz-d">exact area = the integral</div></div>
</div>
<h3>The Fundamental Theorem of Calculus</h3>
<p>The great surprise: integration and differentiation are <strong>inverse operations</strong>. To compute a definite integral, find an <em>antiderivative</em> F (a function whose derivative is f), then:</p>
<div class="formula"><span class="lbl">Fundamental Theorem of Calculus</span>∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a),  where F′(x) = f(x)</div>

<h3>Basic antiderivatives — the integral table</h3>
<p>Each is a derivative rule run backwards. The <b>+ C</b> appears on indefinite integrals because any constant vanishes when differentiated.</p>
<div class="formula"><span class="lbl">Standard integrals</span>∫ xⁿ dx = xⁿ⁺¹/(n+1) + C  (n ≠ −1)    ∫ (1/x) dx = ln|x| + C<br>∫ eˣ dx = eˣ + C    ∫ sin x dx = −cos x + C    ∫ cos x dx = sin x + C<br>∫ sec²x dx = tan x + C    ∫ k dx = kx + C</div>

<h3>Ví dụ có lời giải · Worked examples</h3>
<div class="out"><b>Example 1.</b> ∫<sub>0</sub><sup>2</sup> x² dx = [x³/3]<sub>0</sub><sup>2</sup> = 8/3 − 0 = <b>8/3</b>.</div>
<div class="out"><b>Example 2 — a polynomial.</b> ∫<sub>1</sub><sup>3</sup> (2x + 3) dx = [x² + 3x]<sub>1</sub><sup>3</sup> = (9+9) − (1+3) = 18 − 4 = <b>14</b>.</div>
<div class="out"><b>Example 3 — trig.</b> ∫<sub>0</sub><sup>π</sup> sin x dx = [−cos x]<sub>0</sub><sup>π</sup> = −cos π − (−cos 0) = 1 + 1 = <b>2</b>.</div>

<div class="pitfall"><b>Trap:</b> the power rule ∫xⁿ = xⁿ⁺¹/(n+1) fails at n = −1 (division by zero). For ∫(1/x) the answer is ln|x|, not x⁰/0. And never forget <b>+ C</b> on an indefinite integral.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Integration by substitution (reverse chain rule).</b> When an integrand contains a function and its derivative, substitute u = inner function. E.g. ∫ 2x·(x²+1)⁵ dx: let u = x²+1, du = 2x dx → ∫ u⁵ du = u⁶/6 + C = (x²+1)⁶/6 + C. Substitution is the single most useful integration technique — it undoes the chain rule, just as the chain rule was the most-used derivative rule.</div>
<div class="callout ok">The Fundamental Theorem is one of the deepest results in mathematics: it links the two halves of calculus. Finding area (integration) becomes running differentiation backwards. That is why knowing your derivative rules makes integration possible.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Tích phân — cộng vô số mảnh nhỏ</h2>
<p class="lead">Trong khi đạo hàm chẻ sự thay đổi thành các khoảnh khắc, <strong>tích phân</strong> cộng dồn các đại lượng trên một khoảng (CLO4). Ý nghĩa kinh điển của nó là <strong>diện tích dưới đường cong</strong>.</p>
<h3>Tổng Riemann → tích phân xác định</h3>
<p>Để tìm diện tích dưới f từ x = a tới x = b, cắt nó thành các hình chữ nhật mỏng, cộng diện tích chúng, rồi cho bề rộng thu về 0. Giới hạn đó là <strong>tích phân xác định</strong>:</p>
<div class="out">∫<sub>a</sub><sup>b</sup> f(x) dx  =  diện tích chính xác dưới f giữa a và b</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Cắt</div><div class="lz-t">hình chữ nhật mỏng</div><div class="lz-d">xấp xỉ diện tích</div></div>
  <div class="lz-step"><div class="lz-k">Cộng</div><div class="lz-t">cộng chúng (tổng Riemann)</div><div class="lz-d">tổng thô</div></div>
  <div class="lz-step"><div class="lz-k">Giới hạn</div><div class="lz-t">bề rộng → 0</div><div class="lz-d">diện tích chính xác = tích phân</div></div>
</div>
<h3>Định lý cơ bản của giải tích</h3>
<p>Bất ngờ lớn: tích phân và đạo hàm là <strong>hai phép ngược nhau</strong>. Để tính một tích phân xác định, tìm một <em>nguyên hàm</em> F (một hàm mà đạo hàm là f), rồi:</p>
<div class="formula"><span class="lbl">Định lý cơ bản của giải tích</span>∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a),  với F′(x) = f(x)</div>

<h3>Nguyên hàm cơ bản — bảng tích phân</h3>
<p>Mỗi cái là một quy tắc đạo hàm chạy ngược. <b>+ C</b> xuất hiện ở tích phân bất định vì mọi hằng số biến mất khi lấy đạo hàm.</p>
<div class="formula"><span class="lbl">Tích phân chuẩn</span>∫ xⁿ dx = xⁿ⁺¹/(n+1) + C  (n ≠ −1)    ∫ (1/x) dx = ln|x| + C<br>∫ eˣ dx = eˣ + C    ∫ sin x dx = −cos x + C    ∫ cos x dx = sin x + C<br>∫ sec²x dx = tan x + C    ∫ k dx = kx + C</div>

<h3>Ví dụ có lời giải · Giải từng bước</h3>
<div class="out"><b>Ví dụ 1.</b> ∫<sub>0</sub><sup>2</sup> x² dx = [x³/3]<sub>0</sub><sup>2</sup> = 8/3 − 0 = <b>8/3</b>.</div>
<div class="out"><b>Ví dụ 2 — đa thức.</b> ∫<sub>1</sub><sup>3</sup> (2x + 3) dx = [x² + 3x]<sub>1</sub><sup>3</sup> = (9+9) − (1+3) = 18 − 4 = <b>14</b>.</div>
<div class="out"><b>Ví dụ 3 — lượng giác.</b> ∫<sub>0</sub><sup>π</sup> sin x dx = [−cos x]<sub>0</sub><sup>π</sup> = −cos π − (−cos 0) = 1 + 1 = <b>2</b>.</div>

<div class="pitfall"><b>Bẫy:</b> quy tắc luỹ thừa ∫xⁿ = xⁿ⁺¹/(n+1) thất bại tại n = −1 (chia cho 0). Với ∫(1/x) đáp án là ln|x|, không phải x⁰/0. Và đừng bao giờ quên <b>+ C</b> ở tích phân bất định.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tích phân đổi biến (chain rule ngược).</b> Khi biểu thức dưới dấu tích phân chứa một hàm và đạo hàm của nó, đặt u = hàm bên trong. Vd ∫ 2x·(x²+1)⁵ dx: đặt u = x²+1, du = 2x dx → ∫ u⁵ du = u⁶/6 + C = (x²+1)⁶/6 + C. Đổi biến là kỹ thuật tích phân hữu dụng nhất — nó "gỡ" quy tắc dây chuyền, đúng như dây chuyền là quy tắc đạo hàm dùng nhiều nhất.</div>
<div class="callout ok">Định lý cơ bản là một trong những kết quả sâu nhất của toán học: nó nối hai nửa của giải tích. Tìm diện tích (tích phân) trở thành chạy ngược phép đạo hàm. Đó là lý do nắm vững quy tắc đạo hàm làm cho tích phân khả thi.</div>
</div>
`,
        },
        {
          title: '4.2 — Integration techniques|||4.2 — Các kỹ thuật tính tích phân',
          slug: 'mae101-4-2-ky-thuat-tich-phan',
          type: 'VIDEO',
          description: 'Đổi biến (substitution) và tích phân từng phần (by parts).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Two essential integration techniques</h2>
<p class="lead">Not every integral yields to a basic antiderivative. Two techniques handle most of what you will meet — and both are just differentiation rules run in reverse.</p>
<h3>Substitution — reversing the chain rule</h3>
<p>When you see a function and its derivative together, substitute u for the inner function to simplify.</p>
<div class="out"><b>Compute</b>  ∫ 2x·(x² + 1)³ dx<br>Let u = x² + 1, so du = 2x dx.<br>= ∫ u³ du = u⁴/4 + C = <b>(x² + 1)⁴/4 + C</b></div>
<h3>Integration by parts — reversing the product rule</h3>
<div class="out"><b>Formula:</b>  ∫ u dv = uv − ∫ v du</div>
<p>Use it for products like x·eˣ or x·ln x, where one factor gets simpler when differentiated.</p>
<div class="out"><b>Compute</b>  ∫ x·eˣ dx<br>Let u = x (→ du = dx), dv = eˣ dx (→ v = eˣ).<br>= x·eˣ − ∫ eˣ dx = <b>x·eˣ − eˣ + C</b></div>
<h3>Formulas · The two techniques</h3>
<div class="formula"><span class="lbl">Substitution</span>∫ f(g(x))·g′(x) dx = ∫ f(u) du,  u = g(x)    <span class="lbl">By parts</span>∫ u dv = uv − ∫ v du</div>
<div class="formula"><span class="lbl">LIATE — pick u by this priority</span>L (log) → I (inverse trig) → A (algebraic / polynomial) → T (trig) → E (exponential)</div>
<h3>Ví dụ có lời giải · More worked examples</h3>
<div class="out"><b>Example 3 — a by-parts trick.</b> ∫ ln x dx. Take u = ln x (du = 1/x dx), dv = dx (v = x).<br>= x ln x − ∫ x·(1/x) dx = x ln x − ∫ 1 dx = <b>x ln x − x + C</b>.</div>
<div class="out"><b>Example 4 — definite substitution (change the limits).</b> ∫<sub>0</sub><sup>1</sup> 2x(x²+1)³ dx. Let u = x²+1: when x=0, u=1; when x=1, u=2.<br>= ∫<sub>1</sub><sup>2</sup> u³ du = [u⁴/4]<sub>1</sub><sup>2</sup> = 16/4 − 1/4 = <b>15/4</b>.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Change the limits, don't back-substitute.</b> For a definite integral by substitution, convert the bounds to u (as in Example 4) rather than solving back in x — it is faster and avoids sign mistakes. This bookkeeping habit is what separates a clean exam solution from a messy one.</div>
<div class="callout ok">Choosing well is the skill: for substitution, look for "an inner function whose derivative is also present"; for by parts, pick u to be the factor that <em>simplifies</em> when differentiated (often the polynomial or logarithm). Practice builds the instinct.</div>
<div class="note-ct">This completes Part I. You can now find limits, differentiate to analyse change, and integrate to accumulate — the three pillars of single-variable calculus, and the exact tools Progress Test 1 checks.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Hai kỹ thuật tích phân thiết yếu</h2>
<p class="lead">Không phải tích phân nào cũng ra nguyên hàm cơ bản. Hai kỹ thuật xử lý hầu hết những gì bạn gặp — và cả hai chỉ là các quy tắc đạo hàm chạy ngược.</p>
<h3>Đổi biến (substitution) — đảo ngược quy tắc dây chuyền</h3>
<p>Khi thấy một hàm và đạo hàm của nó đi cùng nhau, đặt u cho hàm trong để rút gọn.</p>
<div class="out"><b>Tính</b>  ∫ 2x·(x² + 1)³ dx<br>Đặt u = x² + 1, nên du = 2x dx.<br>= ∫ u³ du = u⁴/4 + C = <b>(x² + 1)⁴/4 + C</b></div>
<h3>Tích phân từng phần — đảo ngược quy tắc tích</h3>
<div class="out"><b>Công thức:</b>  ∫ u dv = uv − ∫ v du</div>
<p>Dùng nó cho các tích như x·eˣ hoặc x·ln x, khi một thừa số trở nên đơn giản hơn lúc lấy đạo hàm.</p>
<div class="out"><b>Tính</b>  ∫ x·eˣ dx<br>Đặt u = x (→ du = dx), dv = eˣ dx (→ v = eˣ).<br>= x·eˣ − ∫ eˣ dx = <b>x·eˣ − eˣ + C</b></div>
<h3>Công thức · Hai kỹ thuật</h3>
<div class="formula"><span class="lbl">Đổi biến</span>∫ f(g(x))·g′(x) dx = ∫ f(u) du,  u = g(x)    <span class="lbl">Từng phần</span>∫ u dv = uv − ∫ v du</div>
<div class="formula"><span class="lbl">LIATE — chọn u theo thứ tự ưu tiên</span>L (log) → I (lượng giác ngược) → A (đại số / đa thức) → T (lượng giác) → E (mũ)</div>
<h3>Ví dụ có lời giải · Thêm ví dụ giải</h3>
<div class="out"><b>Ví dụ 3 — mẹo từng phần.</b> ∫ ln x dx. Đặt u = ln x (du = 1/x dx), dv = dx (v = x).<br>= x ln x − ∫ x·(1/x) dx = x ln x − ∫ 1 dx = <b>x ln x − x + C</b>.</div>
<div class="out"><b>Ví dụ 4 — đổi biến tích phân xác định (đổi cận).</b> ∫<sub>0</sub><sup>1</sup> 2x(x²+1)³ dx. Đặt u = x²+1: khi x=0, u=1; khi x=1, u=2.<br>= ∫<sub>1</sub><sup>2</sup> u³ du = [u⁴/4]<sub>1</sub><sup>2</sup> = 16/4 − 1/4 = <b>15/4</b>.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đổi cận, đừng thay ngược.</b> Với tích phân xác định bằng đổi biến, hãy đổi luôn cận sang u (như Ví dụ 4) thay vì giải ngược lại theo x — nhanh hơn và tránh sai dấu. Thói quen "ghi sổ" này phân biệt một lời giải sạch với một lời giải rối trong phòng thi.</div>
<div class="callout ok">Chọn khéo là kỹ năng: với đổi biến, tìm "một hàm trong mà đạo hàm của nó cũng có mặt"; với từng phần, chọn u là thừa số <em>đơn giản đi</em> khi lấy đạo hàm (thường là đa thức hoặc logarit). Luyện tập tạo bản năng.</div>
<div class="note-ct">Đây là hết Phần I. Giờ bạn có thể tìm giới hạn, lấy đạo hàm để phân tích sự thay đổi, và tích phân để tích luỹ — ba trụ cột của giải tích một biến, và đúng các công cụ mà Progress Test 1 kiểm.</div>
</div>
`,
        },
        {
          title: 'Chapter 4 Quiz|||Quiz chương 4',
          slug: 'mae101-quiz-ch4',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: tích phân xác định, FTC, đổi biến, từng phần.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The definite integral ∫ₐᵇ f(x) dx represents…|||Tích phân xác định ∫ₐᵇ f(x) dx biểu diễn…', options: ['the slope at b|||độ dốc tại b', 'the area under f between a and b|||diện tích dưới f giữa a và b', 'the derivative of f|||đạo hàm của f', 'the limit of f|||giới hạn của f'], correctIndex: 1, points: 1 },
              { question: 'The Fundamental Theorem says ∫ₐᵇ f dx = …|||Định lý cơ bản nói ∫ₐᵇ f dx = …', options: ['f(b) − f(a)', 'F(b) − F(a), where F′ = f|||F(b) − F(a), với F′ = f', 'f′(b) − f′(a)', '0'], correctIndex: 1, points: 1 },
              { question: '∫₀² x² dx equals…|||∫₀² x² dx bằng…', options: ['4', '8/3', '2', '8'], correctIndex: 1, points: 1 },
              { question: 'Integration by substitution reverses which differentiation rule?|||Tích phân đổi biến đảo ngược quy tắc đạo hàm nào?', options: ['the product rule|||quy tắc tích', 'the chain rule|||quy tắc dây chuyền', 'the quotient rule|||quy tắc thương', 'the power rule|||quy tắc luỹ thừa'], correctIndex: 1, points: 1 },
              { question: 'The integration by parts formula is…|||Công thức tích phân từng phần là…', options: ['∫ u dv = uv − ∫ v du', '∫ u dv = uv + ∫ v du', '∫ u dv = u/v', '∫ u dv = u·v·du'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 1 ══════════════════ */
    {
      title: 'Progress Test 1 (Calculus — CLO1–4)|||Progress Test 1 (Giải tích — CLO1–4)',
      description: 'Ôn Phần I: giới hạn, đạo hàm, ứng dụng đạo hàm, tích phân.',
      lessons: [
        {
          title: 'Progress Test 1 — Calculus review|||Progress Test 1 — Ôn giải tích',
          slug: 'mae101-progress-test-1',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 1–4.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'lim(x→3) (x²−9)/(x−3) equals…|||lim(x→3) (x²−9)/(x−3) bằng…', options: ['0', '6', '3', 'undefined|||không xác định'], correctIndex: 1, points: 1 },
              { question: 'The derivative measures…|||Đạo hàm đo…', options: ['area|||diện tích', 'instantaneous rate of change (tangent slope)|||tốc độ thay đổi tức thời (độ dốc tiếp tuyến)', 'the average of the function|||trung bình của hàm', 'the limit at infinity|||giới hạn ở vô cực'], correctIndex: 1, points: 1 },
              { question: 'd/dx (x³ + 2x) = …|||d/dx (x³ + 2x) = …', options: ['3x² + 2', 'x² + 2', '3x + 2', '3x²'], correctIndex: 0, points: 1 },
              { question: 'At a local minimum of a smooth function, f′ equals…|||Tại một cực tiểu địa phương của hàm trơn, f′ bằng…', options: ['a large positive number|||một số dương lớn', '0', 'infinity|||vô cực', '−1'], correctIndex: 1, points: 1 },
              { question: '∫ 2x dx = …|||∫ 2x dx = …', options: ['x² + C', '2 + C', 'x + C', '2x² + C'], correctIndex: 0, points: 1 },
              { question: 'Differentiation and integration are…|||Đạo hàm và tích phân là…', options: ['unrelated|||không liên quan', 'inverse operations (Fundamental Theorem)|||hai phép ngược nhau (Định lý cơ bản)', 'the same operation|||cùng một phép', 'both about limits at infinity|||đều về giới hạn ở vô cực'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — HỆ PHƯƠNG TRÌNH TUYẾN TÍNH ══════════════════ */
    {
      title: 'Chapter 5 — Linear Systems|||Chương 5 — Hệ phương trình tuyến tính',
      description: 'Giải hệ phương trình bằng khử Gauss và dạng bậc thang.',
      lessons: [
        {
          title: '5.1 — Gaussian elimination|||5.1 — Khử Gauss',
          slug: 'mae101-5-1-khu-gauss',
          type: 'VIDEO',
          description: 'Ma trận bổ sung, phép biến đổi hàng và dạng bậc thang rút gọn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Solving many equations at once</h2>
<p class="lead">Part II begins with a practical problem: solve a system of linear equations (CLO5). The systematic method is <strong>Gaussian elimination</strong>, which mechanizes the algebra using a matrix.</p>
<h3>The augmented matrix</h3>
<p>Write the system&#39;s coefficients as a matrix, with the constants in an extra column:</p>
<div class="out"><b>System:</b>  x + 2y = 5 ,  3x − y = 1<br><b>Augmented matrix:</b>
<pre>[ 1   2 | 5 ]
[ 3  −1 | 1 ]</pre></div>
<h3>Row operations → echelon form</h3>
<p>Three legal moves let you simplify without changing the solution:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Swap two rows</div><div class="lz-ld">reorder equations.</div></div>
  <div class="lz-layer"><div class="lz-lt">Multiply a row by a nonzero constant</div><div class="lz-ld">scale an equation.</div></div>
  <div class="lz-layer"><div class="lz-lt">Add a multiple of one row to another</div><div class="lz-ld">eliminate a variable.</div></div>
</div>
<p>The goal is <strong>row echelon form</strong> (a staircase of leading 1s with zeros below), or <strong>reduced row echelon form (RREF)</strong> (zeros above and below each leading 1 too). From RREF you can read the solution directly.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Set up</div><div class="lz-t">augmented matrix</div><div class="lz-d">coefficients + constants</div></div>
  <div class="lz-step"><div class="lz-k">Eliminate</div><div class="lz-t">row operations</div><div class="lz-d">make zeros below the diagonal</div></div>
  <div class="lz-step"><div class="lz-k">Read off</div><div class="lz-t">back-substitute</div><div class="lz-d">the solution appears</div></div>
</div>
<h3>Formulas · Row operations &amp; solution count</h3>
<div class="formula"><span class="lbl">The three elementary row operations</span>Rᵢ ↔ Rⱼ (swap)    Rᵢ → k·Rᵢ, k ≠ 0 (scale)    Rᵢ → Rᵢ + k·Rⱼ (combine)</div>
<div class="formula"><span class="lbl">How many solutions? (read from echelon form)</span>every variable has a pivot → 1 unique solution    a free (pivot-less) variable → ∞ solutions    a row [0 … 0 | c], c ≠ 0 → NO solution</div>
<h3>Ví dụ có lời giải · Worked example (solve it fully)</h3>
<div class="out"><b>Solve</b> x + 2y = 5,  3x − y = 1.<br>
Augmented [1 2 | 5 ; 3 −1 | 1]. Do R2 → R2 − 3R1: [0 −7 | −14].<br>
−7y = −14 → y = 2. Back-substitute: x + 2(2) = 5 → x = 1. Solution: <b>(x, y) = (1, 2)</b>.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Rank decides everything (Rouché–Capelli).</b> The <em>rank</em> is the number of pivots. A system Ax = b is consistent iff rank(A) = rank([A|b]); it has a unique solution iff that rank also equals the number of unknowns, otherwise infinitely many. In numerical software, elimination is packaged as <b>LU decomposition</b> (A = L·U) so a factored matrix solves many right-hand sides fast — the industrial version of what you just did by hand.</div>
<div class="note-ct">A system can have one solution, infinitely many (a free variable), or none (a contradiction row like [0 0 | 5]). Echelon form makes which case you are in obvious. This one algorithm underlies almost everything in linear algebra.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Giải nhiều phương trình cùng lúc</h2>
<p class="lead">Phần II mở đầu bằng một bài toán thực tế: giải một hệ phương trình tuyến tính (CLO5). Phương pháp hệ thống là <strong>khử Gauss (Gaussian elimination)</strong>, cơ giới hoá phần đại số bằng một ma trận.</p>
<h3>Ma trận bổ sung</h3>
<p>Viết các hệ số của hệ thành một ma trận, với các hằng số ở một cột thêm:</p>
<div class="out"><b>Hệ:</b>  x + 2y = 5 ,  3x − y = 1<br><b>Ma trận bổ sung:</b>
<pre>[ 1   2 | 5 ]
[ 3  −1 | 1 ]</pre></div>
<h3>Phép biến đổi hàng → dạng bậc thang</h3>
<p>Ba nước đi hợp lệ cho phép rút gọn mà không đổi nghiệm:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Đổi chỗ hai hàng</div><div class="lz-ld">sắp xếp lại các phương trình.</div></div>
  <div class="lz-layer"><div class="lz-lt">Nhân một hàng với hằng số khác 0</div><div class="lz-ld">co giãn một phương trình.</div></div>
  <div class="lz-layer"><div class="lz-lt">Cộng bội của hàng này vào hàng khác</div><div class="lz-ld">khử một biến.</div></div>
</div>
<p>Mục tiêu là <strong>dạng bậc thang hàng (echelon)</strong> (một cầu thang các số 1 dẫn đầu với số 0 bên dưới), hoặc <strong>dạng bậc thang hàng rút gọn (RREF)</strong> (số 0 cả trên lẫn dưới mỗi số 1 dẫn đầu). Từ RREF bạn đọc nghiệm trực tiếp.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Lập</div><div class="lz-t">ma trận bổ sung</div><div class="lz-d">hệ số + hằng số</div></div>
  <div class="lz-step"><div class="lz-k">Khử</div><div class="lz-t">biến đổi hàng</div><div class="lz-d">tạo số 0 dưới đường chéo</div></div>
  <div class="lz-step"><div class="lz-k">Đọc</div><div class="lz-t">thế ngược</div><div class="lz-d">nghiệm hiện ra</div></div>
</div>
<h3>Công thức · Phép biến đổi hàng &amp; số nghiệm</h3>
<div class="formula"><span class="lbl">Ba phép biến đổi hàng sơ cấp</span>Rᵢ ↔ Rⱼ (đổi chỗ)    Rᵢ → k·Rᵢ, k ≠ 0 (co giãn)    Rᵢ → Rᵢ + k·Rⱼ (cộng bội)</div>
<div class="formula"><span class="lbl">Bao nhiêu nghiệm? (đọc từ dạng bậc thang)</span>mọi biến đều có trụ (pivot) → 1 nghiệm duy nhất    có biến tự do (không trụ) → ∞ nghiệm    một hàng [0 … 0 | c], c ≠ 0 → VÔ nghiệm</div>
<h3>Ví dụ có lời giải · Giải trọn vẹn</h3>
<div class="out"><b>Giải</b> x + 2y = 5,  3x − y = 1.<br>
Ma trận bổ sung [1 2 | 5 ; 3 −1 | 1]. Làm R2 → R2 − 3R1: [0 −7 | −14].<br>
−7y = −14 → y = 2. Thế ngược: x + 2(2) = 5 → x = 1. Nghiệm: <b>(x, y) = (1, 2)</b>.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hạng (rank) quyết định tất cả (Rouché–Capelli).</b> <em>Hạng</em> là số trụ (pivot). Hệ Ax = b có nghiệm khi và chỉ khi rank(A) = rank([A|b]); có nghiệm duy nhất khi hạng đó cũng bằng số ẩn, ngược lại vô số nghiệm. Trong phần mềm số, phép khử được đóng gói thành <b>phân rã LU</b> (A = L·U) để một ma trận đã phân rã giải nhanh nhiều vế phải — phiên bản công nghiệp của điều bạn vừa làm bằng tay.</div>
<div class="note-ct">Một hệ có thể có một nghiệm, vô số nghiệm (một biến tự do), hoặc vô nghiệm (một hàng mâu thuẫn như [0 0 | 5]). Dạng bậc thang làm rõ bạn đang ở trường hợp nào. Một thuật toán này là nền cho gần như mọi thứ trong đại số tuyến tính.</div>
</div>
`,
        },
        {
          title: 'Chapter 5 Quiz|||Quiz chương 5',
          slug: 'mae101-quiz-ch5',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: ma trận bổ sung, phép biến đổi hàng, số nghiệm.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Gaussian elimination is used to…|||Khử Gauss được dùng để…', options: ['differentiate a function|||lấy đạo hàm một hàm', 'solve a system of linear equations|||giải một hệ phương trình tuyến tính', 'find an integral|||tìm một tích phân', 'compute a limit|||tính một giới hạn'], correctIndex: 1, points: 1 },
              { question: 'Which is NOT a valid row operation?|||Cái nào KHÔNG phải phép biến đổi hàng hợp lệ?', options: ['swap two rows|||đổi chỗ hai hàng', 'multiply a row by a nonzero constant|||nhân một hàng với hằng số khác 0', 'multiply a row by 0|||nhân một hàng với 0', 'add a multiple of one row to another|||cộng bội của hàng này vào hàng khác'], correctIndex: 2, points: 1 },
              { question: 'A row like [0 0 | 5] in echelon form means…|||Một hàng như [0 0 | 5] ở dạng bậc thang nghĩa là…', options: ['one unique solution|||một nghiệm duy nhất', 'infinitely many solutions|||vô số nghiệm', 'no solution (contradiction)|||vô nghiệm (mâu thuẫn)', 'the system is solved|||hệ đã giải xong'], correctIndex: 2, points: 1 },
              { question: 'In an augmented matrix, the extra column holds…|||Trong ma trận bổ sung, cột thêm chứa…', options: ['the variables|||các biến', 'the constants on the right side|||các hằng số ở vế phải', 'the determinant|||định thức', 'the inverse|||ma trận nghịch đảo'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 6 — MA TRẬN ══════════════════ */
    {
      title: 'Chapter 6 — Matrices|||Chương 6 — Ma trận',
      description: 'Phép cộng, nhân vô hướng, nhân ma trận, chuyển vị và biến đổi.',
      lessons: [
        {
          title: '6.1 — Matrix operations|||6.1 — Các phép toán ma trận',
          slug: 'mae101-6-1-phep-ma-tran',
          type: 'VIDEO',
          description: 'Cộng, nhân vô hướng, nhân hai ma trận và chuyển vị.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Working with matrices</h2>
<p class="lead">A <strong>matrix</strong> is a rectangular array of numbers. Beyond solving systems, matrices are objects you can add, scale and multiply (CLO6) — an algebra of their own that powers graphics and machine learning.</p>
<h3>Addition &amp; scalar multiplication — entry by entry</h3>
<div class="out"><pre>[1 2]   [5 6]   [ 6  8]
[3 4] + [7 8] = [10 12]</pre>
2 · [1 2; 3 4] = [2 4; 6 8]  <small>(multiply every entry)</small></div>
<p>Addition requires matrices of the <strong>same size</strong>.</p>
<h3>Matrix multiplication — row times column</h3>
<p>This is the surprising one: entry (i, j) of the product is the <em>dot product</em> of row i of the first matrix with column j of the second. It works only when the inner dimensions match (m×n times n×p → m×p).</p>
<div class="out"><b>Example:</b>
<pre>[1 2] [5 6]   [1·5+2·7  1·6+2·8]   [19 22]
[3 4]·[7 8] = [3·5+4·7  3·6+4·8] = [43 50]</pre></div>
<div class="pitfall">Matrix multiplication is NOT commutative: A·B ≠ B·A in general. Order matters. And you can only multiply when the "inner" dimensions agree — an m×n can multiply an n×p, giving m×p.</div>
<h3>Transpose</h3>
<p>The <strong>transpose</strong> Aᵀ flips a matrix over its diagonal — rows become columns. [1 2; 3 4]ᵀ = [1 3; 2 4].</p>
<h3>Formulas · Properties you can rely on</h3>
<div class="formula"><span class="lbl">Matrix algebra rules</span>A + B = B + A    (AB)C = A(BC)    A(B + C) = AB + AC<br>AI = IA = A    (AB)ᵀ = BᵀAᵀ    <b>AB ≠ BA in general</b></div>
<h3>Ví dụ có lời giải · Worked examples</h3>
<div class="out"><b>Example 1 — non-square product (2×3 times 3×2 → 2×2).</b>
<pre>[1 0 2]   [1 0]   [1·1+0·0+2·1   1·0+0·1+2·1]   [3 2]
[0 1 3] · [0 1] = [0·1+1·0+3·1   0·0+1·1+3·1] = [3 4]
          [1 1]</pre></div>
<div class="out"><b>Example 2 — order matters (AB ≠ BA).</b> A = [1 1; 0 1], B = [1 0; 1 1].<br>
AB = [2 1; 1 1], but BA = [1 1; 1 2]. Different — matrix multiplication is not commutative.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Multiplication is expensive.</b> Multiplying two n×n matrices the schoolbook way costs O(n³) scalar multiplications. Strassen's algorithm (1969) does it in about O(n^2.807) by cleverly reusing partial products — the first hint that "obvious" is not "optimal." This is why GPU/BLAS libraries exist: they make the O(n³) work fast enough to train neural networks.</div>
<div class="note-ct">Matrix multiplication looks strange until you learn what it represents: <em>composing transformations</em> (next idea). Applying transformation B then A is the single matrix A·B — which is exactly why the order and the row-times-column rule are what they are.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Làm việc với ma trận</h2>
<p class="lead">Một <strong>ma trận</strong> là một mảng số hình chữ nhật. Ngoài giải hệ, ma trận là các đối tượng bạn có thể cộng, co giãn và nhân (CLO6) — một đại số riêng vận hành đồ hoạ và machine learning.</p>
<h3>Cộng &amp; nhân vô hướng — từng phần tử</h3>
<div class="out"><pre>[1 2]   [5 6]   [ 6  8]
[3 4] + [7 8] = [10 12]</pre>
2 · [1 2; 3 4] = [2 4; 6 8]  <small>(nhân mọi phần tử)</small></div>
<p>Phép cộng đòi hai ma trận <strong>cùng kích thước</strong>.</p>
<h3>Nhân ma trận — hàng nhân cột</h3>
<p>Đây là phép bất ngờ: phần tử (i, j) của tích là <em>tích vô hướng</em> của hàng i ma trận đầu với cột j ma trận sau. Nó chỉ chạy khi các chiều "trong" khớp (m×n nhân n×p → m×p).</p>
<div class="out"><b>Ví dụ:</b>
<pre>[1 2] [5 6]   [1·5+2·7  1·6+2·8]   [19 22]
[3 4]·[7 8] = [3·5+4·7  3·6+4·8] = [43 50]</pre></div>
<div class="pitfall">Nhân ma trận KHÔNG giao hoán: A·B ≠ B·A nói chung. Thứ tự quan trọng. Và bạn chỉ nhân được khi các chiều "trong" khớp — một m×n nhân được n×p, cho m×p.</div>
<h3>Chuyển vị (transpose)</h3>
<p><strong>Chuyển vị</strong> Aᵀ lật ma trận qua đường chéo — hàng thành cột. [1 2; 3 4]ᵀ = [1 3; 2 4].</p>
<h3>Công thức · Các tính chất tin dùng được</h3>
<div class="formula"><span class="lbl">Quy tắc đại số ma trận</span>A + B = B + A    (AB)C = A(BC)    A(B + C) = AB + AC<br>AI = IA = A    (AB)ᵀ = BᵀAᵀ    <b>AB ≠ BA nói chung</b></div>
<h3>Ví dụ có lời giải · Giải từng bước</h3>
<div class="out"><b>Ví dụ 1 — tích không vuông (2×3 nhân 3×2 → 2×2).</b>
<pre>[1 0 2]   [1 0]   [1·1+0·0+2·1   1·0+0·1+2·1]   [3 2]
[0 1 3] · [0 1] = [0·1+1·0+3·1   0·0+1·1+3·1] = [3 4]
          [1 1]</pre></div>
<div class="out"><b>Ví dụ 2 — thứ tự quan trọng (AB ≠ BA).</b> A = [1 1; 0 1], B = [1 0; 1 1].<br>
AB = [2 1; 1 1], nhưng BA = [1 1; 1 2]. Khác nhau — nhân ma trận không giao hoán.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phép nhân rất tốn kém.</b> Nhân hai ma trận n×n theo cách sách giáo khoa tốn O(n³) phép nhân vô hướng. Thuật toán Strassen (1969) làm trong khoảng O(n^2.807) bằng cách tái sử dụng khéo các tích con — gợi ý đầu tiên rằng "hiển nhiên" chưa chắc "tối ưu." Đây là lý do các thư viện GPU/BLAS tồn tại: chúng làm khối lượng O(n³) đủ nhanh để huấn luyện mạng nơ-ron.</div>
<div class="note-ct">Nhân ma trận trông lạ tới khi bạn học nó biểu diễn gì: <em>hợp thành các biến đổi</em> (ý kế tiếp). Áp biến đổi B rồi A là ma trận duy nhất A·B — đó chính là lý do thứ tự và quy tắc hàng-nhân-cột là như vậy.</div>
</div>
`,
        },
        {
          title: 'Chapter 6 Quiz|||Quiz chương 6',
          slug: 'mae101-quiz-ch6',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: cộng, nhân vô hướng, nhân ma trận, chuyển vị.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'To ADD two matrices, they must have…|||Để CỘNG hai ma trận, chúng phải có…', options: ['the same size|||cùng kích thước', 'the same determinant|||cùng định thức', 'inverse matrices|||ma trận nghịch đảo', 'square shape only|||chỉ hình vuông'], correctIndex: 0, points: 1 },
              { question: 'Matrix multiplication A·B is…|||Nhân ma trận A·B…', options: ['always equal to B·A|||luôn bằng B·A', 'not commutative in general (A·B ≠ B·A)|||nói chung không giao hoán (A·B ≠ B·A)', 'done entry by entry|||làm từng phần tử', 'only for 2×2 matrices|||chỉ cho ma trận 2×2'], correctIndex: 1, points: 1 },
              { question: 'You can multiply an m×n matrix by an n×p matrix, giving a…|||Bạn nhân được ma trận m×n với ma trận n×p, cho một ma trận…', options: ['m×p matrix|||m×p', 'n×n matrix|||n×n', 'p×m matrix|||p×m', 'you cannot multiply them|||không nhân được'], correctIndex: 0, points: 1 },
              { question: 'The transpose of [1 2; 3 4] is…|||Chuyển vị của [1 2; 3 4] là…', options: ['[1 2; 3 4]', '[1 3; 2 4]', '[4 3; 2 1]', '[2 1; 4 3]'], correctIndex: 1, points: 1 },
              { question: 'The (i,j) entry of a matrix product is the…|||Phần tử (i,j) của tích ma trận là…', options: ['sum of row i and column j|||tổng hàng i và cột j', 'dot product of row i and column j|||tích vô hướng hàng i và cột j', 'product of the determinants|||tích các định thức', 'larger of the two entries|||phần tử lớn hơn trong hai'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 7 — ĐỊNH THỨC & NGHỊCH ĐẢO ══════════════════ */
    {
      title: 'Chapter 7 — Determinants & Inverse|||Chương 7 — Định thức & Nghịch đảo',
      description: 'Định thức, ma trận nghịch đảo, quy tắc Cramer và chéo hoá.',
      lessons: [
        {
          title: '7.1 — Determinant & inverse|||7.1 — Định thức & nghịch đảo',
          slug: 'mae101-7-1-dinh-thuc-nghich-dao',
          type: 'VIDEO',
          description: 'Tính định thức, khi nào ma trận khả nghịch, và quy tắc Cramer.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>The determinant — one number that says a lot</h2>
<p class="lead">The <strong>determinant</strong> det(A) is a single number computed from a square matrix (CLO7). It answers a crucial question: is the matrix <em>invertible</em>? And geometrically, it is the area/volume scaling factor of the transformation.</p>
<div class="out"><b>2×2 determinant:</b>  det[a b; c d] = ad − bc<br>Example: det[1 2; 3 4] = 1·4 − 2·3 = −2</div>
<p>For 3×3 and larger, expand along a row using <strong>cofactors</strong> (each entry times the determinant of the smaller matrix left when you delete its row and column, with alternating signs).</p>
<h3>The key fact: det = 0 means no inverse</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">det(A) ≠ 0</div><div class="lz-t">invertible</div><div class="lz-d">unique solution exists</div></div>
  <div class="lz-step"><div class="lz-k">det(A) = 0</div><div class="lz-t">singular</div><div class="lz-d">no inverse; 0 or ∞ solutions</div></div>
</div>
<h3>The inverse &amp; Cramer&#39;s rule</h3>
<p>The <strong>inverse</strong> A⁻¹ satisfies A·A⁻¹ = I (the identity matrix). For a 2×2:</p>
<div class="out">A⁻¹ = (1/det A) · [d −b; −c a]  <small>(only if det A ≠ 0)</small></div>
<p><strong>Cramer&#39;s rule</strong> solves a system using ratios of determinants — elegant for small systems, and a direct payoff of the determinant.</p>
<h3>Formulas · Determinant &amp; inverse</h3>
<div class="formula"><span class="lbl">Determinants</span>det[a b; c d] = ad − bc    <span class="lbl">3×3 cofactor expansion</span>det = a(ei − fh) − b(di − fg) + c(dh − eg)  for [a b c; d e f; g h i]</div>
<div class="formula"><span class="lbl">2×2 inverse (if det ≠ 0)</span>[a b; c d]⁻¹ = (1/(ad − bc)) · [d −b; −c a]    <span class="lbl">Cramer (2×2)</span>x = det(Aₓ)/det(A),  y = det(Aᵧ)/det(A)</div>
<h3>Ví dụ có lời giải · Worked examples</h3>
<div class="out"><b>Example 1 — a 3×3 determinant.</b> det[2 0 1; 1 3 2; 1 0 1] = 2(3·1 − 2·0) − 0(…) + 1(1·0 − 3·1) = 2·3 + 1·(−3) = <b>3</b>.</div>
<div class="out"><b>Example 2 — Cramer's rule.</b> Solve x + 2y = 5, 3x − y = 1. A = [1 2; 3 −1], det A = −7.<br>
x = det[5 2; 1 −1]/(−7) = (−5−2)/(−7) = <b>1</b>.  y = det[1 5; 3 1]/(−7) = (1−15)/(−7) = <b>2</b>. (Matches Lesson 5.1.)</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Determinant identities that save work.</b> det(AB) = det(A)·det(B); det(Aᵀ) = det(A); swapping two rows flips the sign; adding a multiple of one row to another leaves det unchanged. These let you compute a big determinant by reducing to triangular form (then det = product of the diagonal) — far faster than cofactor expansion for large matrices.</div>
<div class="note-ct">The determinant ties the whole chapter together: it decides invertibility, powers Cramer&#39;s rule, and measures how a transformation scales space. A zero determinant means the transformation squashes space into a lower dimension — information is lost, so it cannot be undone (no inverse).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Định thức — một con số nói lên nhiều điều</h2>
<p class="lead"><strong>Định thức</strong> det(A) là một con số duy nhất tính từ ma trận vuông (CLO7). Nó trả lời một câu hỏi then chốt: ma trận có <em>khả nghịch</em> không? Và về hình học, nó là hệ số co giãn diện tích/thể tích của phép biến đổi.</p>
<div class="out"><b>Định thức 2×2:</b>  det[a b; c d] = ad − bc<br>Ví dụ: det[1 2; 3 4] = 1·4 − 2·3 = −2</div>
<p>Với 3×3 trở lên, khai triển theo một hàng bằng <strong>phần bù đại số (cofactor)</strong> (mỗi phần tử nhân định thức của ma trận nhỏ còn lại khi xoá hàng và cột của nó, với dấu xen kẽ).</p>
<h3>Sự thật then chốt: det = 0 nghĩa là không có nghịch đảo</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">det(A) ≠ 0</div><div class="lz-t">khả nghịch</div><div class="lz-d">tồn tại nghiệm duy nhất</div></div>
  <div class="lz-step"><div class="lz-k">det(A) = 0</div><div class="lz-t">suy biến</div><div class="lz-d">không nghịch đảo; 0 hoặc ∞ nghiệm</div></div>
</div>
<h3>Nghịch đảo &amp; quy tắc Cramer</h3>
<p><strong>Nghịch đảo</strong> A⁻¹ thoả A·A⁻¹ = I (ma trận đơn vị). Với 2×2:</p>
<div class="out">A⁻¹ = (1/det A) · [d −b; −c a]  <small>(chỉ khi det A ≠ 0)</small></div>
<p><strong>Quy tắc Cramer</strong> giải một hệ bằng tỉ số các định thức — thanh lịch cho hệ nhỏ, và là ứng dụng trực tiếp của định thức.</p>
<h3>Công thức · Định thức &amp; nghịch đảo</h3>
<div class="formula"><span class="lbl">Định thức</span>det[a b; c d] = ad − bc    <span class="lbl">Khai triển cofactor 3×3</span>det = a(ei − fh) − b(di − fg) + c(dh − eg)  với [a b c; d e f; g h i]</div>
<div class="formula"><span class="lbl">Nghịch đảo 2×2 (nếu det ≠ 0)</span>[a b; c d]⁻¹ = (1/(ad − bc)) · [d −b; −c a]    <span class="lbl">Cramer (2×2)</span>x = det(Aₓ)/det(A),  y = det(Aᵧ)/det(A)</div>
<h3>Ví dụ có lời giải · Giải từng bước</h3>
<div class="out"><b>Ví dụ 1 — định thức 3×3.</b> det[2 0 1; 1 3 2; 1 0 1] = 2(3·1 − 2·0) − 0(…) + 1(1·0 − 3·1) = 2·3 + 1·(−3) = <b>3</b>.</div>
<div class="out"><b>Ví dụ 2 — quy tắc Cramer.</b> Giải x + 2y = 5, 3x − y = 1. A = [1 2; 3 −1], det A = −7.<br>
x = det[5 2; 1 −1]/(−7) = (−5−2)/(−7) = <b>1</b>.  y = det[1 5; 3 1]/(−7) = (1−15)/(−7) = <b>2</b>. (Khớp Bài 5.1.)</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Các đẳng thức định thức giúp đỡ tay.</b> det(AB) = det(A)·det(B); det(Aᵀ) = det(A); đổi chỗ hai hàng làm đổi dấu; cộng bội một hàng vào hàng khác giữ nguyên det. Nhờ đó bạn tính một định thức lớn bằng cách đưa về dạng tam giác (khi đó det = tích đường chéo) — nhanh hơn nhiều so với khai triển cofactor cho ma trận lớn.</div>
<div class="note-ct">Định thức buộc cả chương lại: nó quyết định tính khả nghịch, vận hành quy tắc Cramer, và đo cách một biến đổi co giãn không gian. Định thức bằng 0 nghĩa là biến đổi ép không gian xuống chiều thấp hơn — thông tin bị mất, nên không hoàn tác được (không có nghịch đảo).</div>
</div>
`,
        },
        {
          title: '7.2 — Diagonalization & eigenvalues|||7.2 — Chéo hoá & giá trị riêng',
          slug: 'mae101-7-2-cheo-hoa',
          type: 'VIDEO',
          description: 'Vector riêng, giá trị riêng và ý tưởng chéo hoá ma trận.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Eigenvalues — the special directions of a matrix</h2>
<p class="lead">A matrix usually rotates and stretches vectors. But some special vectors only get <strong>scaled</strong>, not turned. These are <strong>eigenvectors</strong>, and the scaling factor is the <strong>eigenvalue</strong> λ (CLO7).</p>
<div class="out"><b>Definition:</b>  A·v = λ·v  <small>(the matrix A acts on v just by scaling it by λ)</small></div>
<p>Find eigenvalues by solving the <strong>characteristic equation</strong> det(A − λI) = 0. Each eigenvalue λ then has its eigenvectors, found by solving (A − λI)v = 0.</p>
<h3>Diagonalization</h3>
<p>If a matrix has enough independent eigenvectors, it can be written as A = P·D·P⁻¹, where D is a <strong>diagonal</strong> matrix of the eigenvalues. Diagonal matrices are trivially easy to work with — raising them to powers, for instance, just powers the diagonal entries.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Find λ</div><div class="lz-t">det(A − λI) = 0</div><div class="lz-d">the eigenvalues</div></div>
  <div class="lz-step"><div class="lz-k">Find v</div><div class="lz-t">(A − λI)v = 0</div><div class="lz-d">the eigenvectors</div></div>
  <div class="lz-step"><div class="lz-k">Assemble</div><div class="lz-t">A = P·D·P⁻¹</div><div class="lz-d">diagonalized</div></div>
</div>
<h3>Formulas · Eigen-toolkit</h3>
<div class="formula"><span class="lbl">Characteristic equation</span>det(A − λI) = 0    <span class="lbl">Eigenvector for each λ</span>(A − λI)v = 0</div>
<div class="formula"><span class="lbl">Fast checks (2×2)</span>λ₁ + λ₂ = trace(A) = a + d    λ₁ · λ₂ = det(A)</div>
<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Find the eigenvalues and eigenvectors of A = [2 1; 1 2].</b><br>
det(A − λI) = det[2−λ 1; 1 2−λ] = (2−λ)² − 1 = 0 → 2−λ = ±1 → <b>λ = 3 or λ = 1</b>.<br>
λ=3: (A−3I)v = [−1 1; 1 −1]v = 0 → v = (1, 1). λ=1: [1 1; 1 1]v = 0 → v = (1, −1).<br>
Check: trace = 4 = 3+1 ✓, det = 3 = 3·1 ✓.</div>
<div class="pitfall"><b>Trap:</b> an eigenvector is never the zero vector (v = 0 solves A·v = λ·v trivially for any λ and tells you nothing). And a real matrix can have complex eigenvalues — a pure rotation, for instance, has no real eigenvectors.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The Spectral Theorem.</b> If A is symmetric (A = Aᵀ), its eigenvalues are all real and its eigenvectors can be chosen orthogonal — so A = Q·D·Qᵀ with Q orthogonal. This is exactly what powers Principal Component Analysis (PCA): the covariance matrix is symmetric, and its orthogonal eigenvectors are the "principal directions" of the data.</div>
<div class="callout ok">Eigenvalues are everywhere: Google&#39;s PageRank, principal component analysis in machine learning, vibration analysis in engineering, and quantum mechanics all rest on them. They reveal the "natural axes" along which a transformation acts simply.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Giá trị riêng — các hướng đặc biệt của ma trận</h2>
<p class="lead">Một ma trận thường xoay và kéo giãn vector. Nhưng vài vector đặc biệt chỉ bị <strong>co giãn</strong>, không bị xoay. Đó là <strong>vector riêng (eigenvector)</strong>, và hệ số co giãn là <strong>giá trị riêng (eigenvalue)</strong> λ (CLO7).</p>
<div class="out"><b>Định nghĩa:</b>  A·v = λ·v  <small>(ma trận A tác động lên v chỉ bằng cách co giãn nó λ lần)</small></div>
<p>Tìm giá trị riêng bằng cách giải <strong>phương trình đặc trưng</strong> det(A − λI) = 0. Mỗi giá trị riêng λ rồi có các vector riêng, tìm bằng cách giải (A − λI)v = 0.</p>
<h3>Chéo hoá (diagonalization)</h3>
<p>Nếu một ma trận có đủ vector riêng độc lập, nó viết được thành A = P·D·P⁻¹, với D là ma trận <strong>đường chéo</strong> gồm các giá trị riêng. Ma trận đường chéo cực dễ làm việc — ví dụ nâng lên luỹ thừa chỉ là nâng các phần tử trên đường chéo.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Tìm λ</div><div class="lz-t">det(A − λI) = 0</div><div class="lz-d">các giá trị riêng</div></div>
  <div class="lz-step"><div class="lz-k">Tìm v</div><div class="lz-t">(A − λI)v = 0</div><div class="lz-d">các vector riêng</div></div>
  <div class="lz-step"><div class="lz-k">Ghép</div><div class="lz-t">A = P·D·P⁻¹</div><div class="lz-d">đã chéo hoá</div></div>
</div>
<h3>Công thức · Bộ công cụ giá trị riêng</h3>
<div class="formula"><span class="lbl">Phương trình đặc trưng</span>det(A − λI) = 0    <span class="lbl">Vector riêng cho mỗi λ</span>(A − λI)v = 0</div>
<div class="formula"><span class="lbl">Kiểm nhanh (2×2)</span>λ₁ + λ₂ = trace(A) = a + d    λ₁ · λ₂ = det(A)</div>
<h3>Ví dụ có lời giải · Giải từng bước</h3>
<div class="out"><b>Tìm giá trị riêng và vector riêng của A = [2 1; 1 2].</b><br>
det(A − λI) = det[2−λ 1; 1 2−λ] = (2−λ)² − 1 = 0 → 2−λ = ±1 → <b>λ = 3 hoặc λ = 1</b>.<br>
λ=3: (A−3I)v = [−1 1; 1 −1]v = 0 → v = (1, 1). λ=1: [1 1; 1 1]v = 0 → v = (1, −1).<br>
Kiểm: trace = 4 = 3+1 ✓, det = 3 = 3·1 ✓.</div>
<div class="pitfall"><b>Bẫy:</b> vector riêng không bao giờ là vector không (v = 0 thoả A·v = λ·v tầm thường với mọi λ và không cho biết gì). Và một ma trận thực có thể có giá trị riêng phức — ví dụ một phép xoay thuần không có vector riêng thực.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Định lý phổ (Spectral Theorem).</b> Nếu A đối xứng (A = Aᵀ), mọi giá trị riêng của nó đều thực và các vector riêng chọn được trực giao — nên A = Q·D·Qᵀ với Q trực giao. Đây chính là thứ vận hành Phân tích thành phần chính (PCA): ma trận hiệp phương sai đối xứng, và các vector riêng trực giao của nó là các "hướng chính" của dữ liệu.</div>
<div class="callout ok">Giá trị riêng ở khắp nơi: PageRank của Google, phân tích thành phần chính (PCA) trong machine learning, phân tích dao động trong kỹ thuật, và cơ học lượng tử đều dựa vào chúng. Chúng tiết lộ các "trục tự nhiên" mà dọc theo đó một biến đổi tác động một cách đơn giản.</div>
</div>
`,
        },
        {
          title: 'Chapter 7 Quiz|||Quiz chương 7',
          slug: 'mae101-quiz-ch7',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: định thức, khả nghịch, Cramer, giá trị riêng.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The determinant of [1 2; 3 4] is…|||Định thức của [1 2; 3 4] là…', options: ['−2', '2', '10', '−10'], correctIndex: 0, points: 1 },
              { question: 'A square matrix is invertible if and only if its determinant is…|||Một ma trận vuông khả nghịch khi và chỉ khi định thức của nó…', options: ['equal to 0|||bằng 0', 'not equal to 0|||khác 0', 'positive|||dương', 'equal to 1|||bằng 1'], correctIndex: 1, points: 1 },
              { question: 'Cramer\'s rule solves a linear system using…|||Quy tắc Cramer giải một hệ tuyến tính bằng…', options: ['derivatives|||đạo hàm', 'ratios of determinants|||tỉ số các định thức', 'integration|||tích phân', 'the transpose|||chuyển vị'], correctIndex: 1, points: 1 },
              { question: 'An eigenvector v of A satisfies…|||Một vector riêng v của A thoả…', options: ['A·v = 0', 'A·v = λ·v', 'A·v = v + λ', 'det(v) = 0'], correctIndex: 1, points: 1 },
              { question: 'Eigenvalues are found by solving…|||Giá trị riêng được tìm bằng cách giải…', options: ['det(A − λI) = 0', 'A·v = 0', 'Aᵀ = A', 'det(A) = 1'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 2 ══════════════════ */
    {
      title: 'Progress Test 2 (Matrices — CLO5–7)|||Progress Test 2 (Ma trận — CLO5–7)',
      description: 'Ôn: hệ phương trình, phép ma trận, định thức & nghịch đảo.',
      lessons: [
        {
          title: 'Progress Test 2 — Matrices review|||Progress Test 2 — Ôn ma trận',
          slug: 'mae101-progress-test-2',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 5–7.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'The systematic method to solve a linear system is…|||Phương pháp hệ thống để giải hệ tuyến tính là…', options: ['integration|||tích phân', 'Gaussian elimination|||khử Gauss', 'the chain rule|||quy tắc dây chuyền', 'diagonalization only|||chỉ chéo hoá'], correctIndex: 1, points: 1 },
              { question: 'Matrix multiplication is generally…|||Nhân ma trận nói chung…', options: ['commutative|||giao hoán', 'not commutative|||không giao hoán', 'impossible|||bất khả', 'the same as addition|||giống phép cộng'], correctIndex: 1, points: 1 },
              { question: 'det[2 0; 0 3] = …|||det[2 0; 0 3] = …', options: ['5', '6', '0', '1'], correctIndex: 1, points: 1 },
              { question: 'If det(A) = 0, then A…|||Nếu det(A) = 0, thì A…', options: ['has an inverse|||có nghịch đảo', 'has no inverse (is singular)|||không có nghịch đảo (suy biến)', 'is the identity|||là ma trận đơn vị', 'is diagonal|||là đường chéo'], correctIndex: 1, points: 1 },
              { question: 'A·A⁻¹ equals…|||A·A⁻¹ bằng…', options: ['0', 'the identity matrix I|||ma trận đơn vị I', 'A', 'the determinant|||định thức'], correctIndex: 1, points: 1 },
              { question: 'The eigenvalue equation is…|||Phương trình giá trị riêng là…', options: ['A·v = λ·v', 'A + v = λ', 'det(A) = λ', 'Aᵀ = λ'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 8 — VECTOR & BIẾN ĐỔI TUYẾN TÍNH ══════════════════ */
    {
      title: 'Chapter 8 — Vectors & Linear Transformations|||Chương 8 — Vector & Biến đổi tuyến tính',
      description: 'Vector trong R² và R³, các phép vector, và biến đổi tuyến tính.',
      lessons: [
        {
          title: '8.1 — Vectors in R² and R³|||8.1 — Vector trong R² và R³',
          slug: 'mae101-8-1-vector',
          type: 'VIDEO',
          description: 'Phép cộng, nhân vô hướng, tích vô hướng và độ dài vector.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Vectors — quantities with direction</h2>
<p class="lead">A <strong>vector</strong> is a list of numbers with both magnitude and direction (CLO8) — an arrow in space. In R² it has 2 components, in R³ it has 3. Vectors model position, velocity, force, and rows/columns of data.</p>
<h3>Core operations</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Addition — component-wise</div><div class="lz-ld">(1, 2) + (3, 4) = (4, 6). Geometrically, place them head-to-tail.</div></div>
  <div class="lz-layer"><div class="lz-lt">Scalar multiplication</div><div class="lz-ld">3·(1, 2) = (3, 6). Stretches or shrinks the arrow.</div></div>
  <div class="lz-layer"><div class="lz-lt">Dot product</div><div class="lz-ld">(1, 2)·(3, 4) = 1·3 + 2·4 = 11. A single number measuring how aligned two vectors are.</div></div>
</div>
<h3>Magnitude &amp; the dot product&#39;s meaning</h3>
<div class="out"><b>Magnitude (length):</b>  |v| = √(v₁² + v₂² + …)  — e.g. |(3, 4)| = √(9+16) = 5</div>
<p>The dot product connects to the <strong>angle</strong> between vectors: a·b = |a||b|cos θ. So a dot product of 0 means the vectors are <strong>perpendicular (orthogonal)</strong> — a fact used constantly in graphics and physics.</p>
<h3>Formulas · Vector operations</h3>
<div class="formula"><span class="lbl">Dot product &amp; length</span>a·b = a₁b₁ + a₂b₂ + a₃b₃    |a| = √(a·a)    <span class="lbl">Angle</span>cos θ = (a·b)/(|a||b|)</div>
<div class="formula"><span class="lbl">Unit vector</span>â = a / |a|    <span class="lbl">Cross product (R³)</span>a × b = (a₂b₃ − a₃b₂,  a₃b₁ − a₁b₃,  a₁b₂ − a₂b₁)</div>
<h3>Ví dụ có lời giải · Worked examples</h3>
<div class="out"><b>Example 1 — angle between vectors.</b> a = (1, 0), b = (1, 1). cos θ = (1·1+0·1)/(1·√2) = 1/√2 → <b>θ = 45°</b>.</div>
<div class="out"><b>Example 2 — cross product (a normal vector).</b> (1,0,0) × (0,1,0) = (0·0−0·1, 0·0−1·0, 1·1−0·0) = <b>(0, 0, 1)</b> — perpendicular to both, as expected.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Projection — the workhorse of graphics &amp; ML.</b> The projection of a onto b is proj_b(a) = ((a·b)/(b·b))·b — the "shadow" of a along b's direction. It underlies least-squares fitting, lighting in 3D engines, and Gram–Schmidt orthogonalization. The dot product you just learned is the one operation all of these are built on.</div>
<div class="note-ct">Vectors are the bridge from numbers to geometry. A point on screen, the direction a character faces, an RGB color, or a data sample are all vectors — which is why linear algebra runs computer graphics, games and machine learning.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Vector — đại lượng có hướng</h2>
<p class="lead">Một <strong>vector</strong> là một danh sách số có cả độ lớn và hướng (CLO8) — một mũi tên trong không gian. Trong R² nó có 2 thành phần, trong R³ có 3. Vector mô hình vị trí, vận tốc, lực, và các hàng/cột dữ liệu.</p>
<h3>Các phép cốt lõi</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Cộng — theo thành phần</div><div class="lz-ld">(1, 2) + (3, 4) = (4, 6). Về hình học, đặt đầu-nối-đuôi.</div></div>
  <div class="lz-layer"><div class="lz-lt">Nhân vô hướng</div><div class="lz-ld">3·(1, 2) = (3, 6). Kéo giãn hoặc co mũi tên.</div></div>
  <div class="lz-layer"><div class="lz-lt">Tích vô hướng (dot product)</div><div class="lz-ld">(1, 2)·(3, 4) = 1·3 + 2·4 = 11. Một con số đo hai vector cùng hướng đến đâu.</div></div>
</div>
<h3>Độ lớn &amp; ý nghĩa tích vô hướng</h3>
<div class="out"><b>Độ lớn (độ dài):</b>  |v| = √(v₁² + v₂² + …)  — vd |(3, 4)| = √(9+16) = 5</div>
<p>Tích vô hướng liên hệ với <strong>góc</strong> giữa hai vector: a·b = |a||b|cos θ. Nên tích vô hướng bằng 0 nghĩa là hai vector <strong>vuông góc (trực giao)</strong> — một sự thật dùng liên tục trong đồ hoạ và vật lý.</p>
<h3>Công thức · Các phép vector</h3>
<div class="formula"><span class="lbl">Tích vô hướng &amp; độ dài</span>a·b = a₁b₁ + a₂b₂ + a₃b₃    |a| = √(a·a)    <span class="lbl">Góc</span>cos θ = (a·b)/(|a||b|)</div>
<div class="formula"><span class="lbl">Vector đơn vị</span>â = a / |a|    <span class="lbl">Tích có hướng (R³)</span>a × b = (a₂b₃ − a₃b₂,  a₃b₁ − a₁b₃,  a₁b₂ − a₂b₁)</div>
<h3>Ví dụ có lời giải · Giải từng bước</h3>
<div class="out"><b>Ví dụ 1 — góc giữa hai vector.</b> a = (1, 0), b = (1, 1). cos θ = (1·1+0·1)/(1·√2) = 1/√2 → <b>θ = 45°</b>.</div>
<div class="out"><b>Ví dụ 2 — tích có hướng (vector pháp tuyến).</b> (1,0,0) × (0,1,0) = (0·0−0·1, 0·0−1·0, 1·1−0·0) = <b>(0, 0, 1)</b> — vuông góc với cả hai, đúng như mong đợi.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phép chiếu — con ngựa thồ của đồ hoạ &amp; ML.</b> Chiếu của a lên b là proj_b(a) = ((a·b)/(b·b))·b — "cái bóng" của a dọc theo hướng b. Nó là nền của khớp bình phương tối thiểu, chiếu sáng trong engine 3D, và trực giao hoá Gram–Schmidt. Tích vô hướng bạn vừa học là phép duy nhất mà tất cả những thứ này dựng trên.</div>
<div class="note-ct">Vector là cầu nối từ số tới hình học. Một điểm trên màn hình, hướng nhân vật quay mặt, một màu RGB, hay một mẫu dữ liệu đều là vector — đó là lý do đại số tuyến tính vận hành đồ hoạ máy tính, game và machine learning.</div>
</div>
`,
        },
        {
          title: '8.2 — Linear transformations|||8.2 — Biến đổi tuyến tính',
          slug: 'mae101-8-2-bien-doi-tuyen-tinh',
          type: 'VIDEO',
          description: 'Ma trận như một phép biến đổi: xoay, co giãn, phản chiếu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>A matrix is a transformation</h2>
<p class="lead">Here is the big idea that unifies the whole second half: multiplying a vector by a matrix <strong>transforms</strong> it — rotating, scaling, reflecting or shearing space (CLO8). A <strong>linear transformation</strong> is exactly what a matrix does.</p>
<div class="out"><b>Apply matrix A to vector v:</b>  A·v = new vector<br>[0 −1; 1 0]·(1, 0) = (0, 1)  <small>— this matrix rotates 90° counter-clockwise</small></div>
<h3>Common 2D transformations</h3>
<table>
  <thead><tr><th>Matrix</th><th>Effect</th></tr></thead>
  <tbody>
    <tr><td>[k 0; 0 k]</td><td>Scale by factor k</td></tr>
    <tr><td>[−1 0; 0 1]</td><td>Reflect across the y-axis</td></tr>
    <tr><td>[cos θ −sin θ; sin θ cos θ]</td><td>Rotate by angle θ</td></tr>
  </tbody>
</table>
<p>"Linear" means the transformation preserves straight lines and the origin: T(a + b) = T(a) + T(b) and T(k·v) = k·T(v). Composing transformations is just multiplying their matrices — which is <em>why</em> matrix multiplication is defined the way it is (Chapter 6).</p>
<h3>Formulas · Building &amp; combining transformations</h3>
<div class="formula"><span class="lbl">Columns are images of the basis</span>A = [ T(e₁) | T(e₂) ]  — column j is where the unit vector eⱼ lands<br><span class="lbl">Composition</span>"do B, then A" = the single matrix A·B  (right-to-left)</div>
<h3>Ví dụ có lời giải · Worked examples</h3>
<div class="out"><b>Example 1 — apply a rotation.</b> Rotate (2, 0) by 90° with R = [0 −1; 1 0]: R·(2,0) = (0·2 + (−1)·0, 1·2 + 0·0) = <b>(0, 2)</b>. The point swings up onto the y-axis.</div>
<div class="out"><b>Example 2 — compose scale then rotate.</b> Scale by 2 (S = [2 0; 0 2]) then rotate 90° (R above). Combined = R·S = [0 −2; 2 0]. Apply to (1, 0): <b>(0, 2)</b> — scaled to length 2 and turned 90°.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Homogeneous coordinates — how translation sneaks in.</b> A pure matrix can rotate and scale but cannot <em>translate</em> (move the origin), because T(0) = 0 always. Graphics engines fix this by adding a dimension: a 2D point (x, y) becomes (x, y, 1), and a 3×3 matrix can then encode translation too. Every game and GPU pipeline uses this trick — the reason "model-view-projection" matrices are 4×4.</div>
<div class="callout ok">Every time a game rotates a model, a photo app scales an image, or a neural network layer transforms data, it multiplies vectors by a matrix. This chapter is the mathematical heart of computer graphics and deep learning.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fmathematics-for-engineering%2Flearn&reflabel=MAE101%20%E2%80%94%20Mathematics%20for%20Engineering#module-256" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Do linear transformations in Python</span><span class="lc-sub">Represent vectors &amp; matrices in code (NumPy-style) — the Python "Data Structures" module.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Một ma trận là một phép biến đổi</h2>
<p class="lead">Đây là ý tưởng lớn thống nhất cả nửa sau: nhân một vector với một ma trận sẽ <strong>biến đổi</strong> nó — xoay, co giãn, phản chiếu hoặc trượt (shear) không gian (CLO8). Một <strong>biến đổi tuyến tính</strong> đúng là điều mà một ma trận làm.</p>
<div class="out"><b>Áp ma trận A lên vector v:</b>  A·v = vector mới<br>[0 −1; 1 0]·(1, 0) = (0, 1)  <small>— ma trận này xoay 90° ngược chiều kim đồng hồ</small></div>
<h3>Các biến đổi 2D thường gặp</h3>
<table>
  <thead><tr><th>Ma trận</th><th>Tác dụng</th></tr></thead>
  <tbody>
    <tr><td>[k 0; 0 k]</td><td>Co giãn hệ số k</td></tr>
    <tr><td>[−1 0; 0 1]</td><td>Phản chiếu qua trục y</td></tr>
    <tr><td>[cos θ −sin θ; sin θ cos θ]</td><td>Xoay góc θ</td></tr>
  </tbody>
</table>
<p>"Tuyến tính" nghĩa là biến đổi giữ nguyên đường thẳng và gốc toạ độ: T(a + b) = T(a) + T(b) và T(k·v) = k·T(v). Hợp thành các biến đổi chính là nhân các ma trận của chúng — đó là <em>lý do</em> nhân ma trận được định nghĩa như vậy (Chương 6).</p>
<h3>Công thức · Dựng &amp; kết hợp biến đổi</h3>
<div class="formula"><span class="lbl">Các cột là ảnh của cơ sở</span>A = [ T(e₁) | T(e₂) ]  — cột j là nơi vector đơn vị eⱼ rơi tới<br><span class="lbl">Hợp thành</span>"làm B, rồi A" = ma trận duy nhất A·B  (phải sang trái)</div>
<h3>Ví dụ có lời giải · Giải từng bước</h3>
<div class="out"><b>Ví dụ 1 — áp một phép xoay.</b> Xoay (2, 0) đi 90° với R = [0 −1; 1 0]: R·(2,0) = (0·2 + (−1)·0, 1·2 + 0·0) = <b>(0, 2)</b>. Điểm đu lên trục y.</div>
<div class="out"><b>Ví dụ 2 — hợp co giãn rồi xoay.</b> Co giãn 2 lần (S = [2 0; 0 2]) rồi xoay 90° (R ở trên). Kết hợp = R·S = [0 −2; 2 0]. Áp lên (1, 0): <b>(0, 2)</b> — được kéo dài tới độ dài 2 và xoay 90°.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Toạ độ thuần nhất (homogeneous) — cách phép tịnh tiến len vào.</b> Một ma trận thuần có thể xoay và co giãn nhưng không thể <em>tịnh tiến</em> (dời gốc), vì T(0) = 0 luôn đúng. Engine đồ hoạ khắc phục bằng cách thêm một chiều: điểm 2D (x, y) thành (x, y, 1), và một ma trận 3×3 khi đó mã hoá được cả tịnh tiến. Mọi game và pipeline GPU dùng mẹo này — lý do các ma trận "model-view-projection" là 4×4.</div>
<div class="callout ok">Mỗi khi một game xoay một mô hình, một app ảnh co giãn tấm hình, hay một tầng mạng nơ-ron biến đổi dữ liệu, nó nhân vector với một ma trận. Chương này là trái tim toán học của đồ hoạ máy tính và deep learning.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fmathematics-for-engineering%2Flearn&reflabel=MAE101%20%E2%80%94%20Mathematics%20for%20Engineering#module-256" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Làm biến đổi tuyến tính bằng Python</span><span class="lc-sub">Biểu diễn vector &amp; ma trận trong code (kiểu NumPy) — module Python "Data Structures".</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 8 Quiz|||Quiz chương 8',
          slug: 'mae101-quiz-ch8',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: phép vector, tích vô hướng, biến đổi tuyến tính.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: '(1, 2) + (3, 4) equals…|||(1, 2) + (3, 4) bằng…', options: ['(4, 6)', '(3, 8)', '(2, 2)', '11'], correctIndex: 0, points: 1 },
              { question: 'The dot product (1, 2)·(3, 4) equals…|||Tích vô hướng (1, 2)·(3, 4) bằng…', options: ['(3, 8)', '11', '(4, 6)', '7'], correctIndex: 1, points: 1 },
              { question: 'The magnitude |(3, 4)| equals…|||Độ lớn |(3, 4)| bằng…', options: ['7', '5', '12', '25'], correctIndex: 1, points: 1 },
              { question: 'A dot product of 0 means the two vectors are…|||Tích vô hướng bằng 0 nghĩa là hai vector…', options: ['parallel|||song song', 'perpendicular (orthogonal)|||vuông góc (trực giao)', 'equal|||bằng nhau', 'zero vectors|||vector không'], correctIndex: 1, points: 1 },
              { question: 'Multiplying a vector by a matrix performs a…|||Nhân một vector với một ma trận thực hiện một…', options: ['limit|||giới hạn', 'linear transformation (rotate/scale/reflect)|||biến đổi tuyến tính (xoay/co giãn/phản chiếu)', 'derivative|||đạo hàm', 'integral|||tích phân'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 9 — KHÔNG GIAN VECTOR ══════════════════ */
    {
      title: 'Chapter 9 — Vector Spaces: Basis & Dimension|||Chương 9 — Không gian vector: Cơ sở & Số chiều',
      description: 'Không gian con, độc lập tuyến tính, cơ sở và số chiều.',
      lessons: [
        {
          title: '9.1 — Subspaces, basis & dimension|||9.1 — Không gian con, cơ sở & số chiều',
          slug: 'mae101-9-1-co-so-so-chieu',
          type: 'VIDEO',
          description: 'Span, độc lập tuyến tính, và bộ vector cơ sở tối thiểu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>The structure of vector spaces</h2>
<p class="lead">The final ideas of the course make vectors abstract and powerful (CLO9). A <strong>vector space</strong> is any set of vectors you can add and scale and stay inside. A <strong>subspace</strong> is a smaller space living inside a bigger one (like a line or plane through the origin in R³).</p>
<h3>Span &amp; linear independence</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Span</div><div class="lz-ld">All the vectors you can reach by adding and scaling a given set. Two independent vectors in R³ span a plane.</div></div>
  <div class="lz-layer"><div class="lz-lt">Linear independence</div><div class="lz-ld">A set is independent if none of them can be built from the others. No vector is "redundant."</div></div>
</div>
<h3>Basis &amp; dimension</h3>
<p>A <strong>basis</strong> is a set of vectors that is both <em>independent</em> AND <em>spans</em> the whole space — the minimum set of building blocks. The number of vectors in a basis is the <strong>dimension</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Spans?</div><div class="lz-t">reaches everything</div><div class="lz-d">enough vectors</div></div>
  <div class="lz-step"><div class="lz-k">Independent?</div><div class="lz-t">none redundant</div><div class="lz-d">not too many</div></div>
  <div class="lz-step"><div class="lz-k">Basis</div><div class="lz-t">just right</div><div class="lz-d">count = dimension</div></div>
</div>
<div class="out"><b>Example:</b>  (1, 0) and (0, 1) form a basis of R² — independent and spanning. So dim(R²) = 2. Any plane through the origin has dimension 2; a line has dimension 1.</div>
<h3>Formulas · Independence &amp; dimension</h3>
<div class="formula"><span class="lbl">Independence test (n vectors in Rⁿ)</span>put them as columns of a matrix A → independent ⟺ det(A) ≠ 0 ⟺ rank = n</div>
<div class="formula"><span class="lbl">Dimension facts</span>dim(Rⁿ) = n    a basis of an n-dim space has exactly n vectors    any n independent vectors in Rⁿ form a basis</div>
<h3>Ví dụ có lời giải · Worked examples</h3>
<div class="out"><b>Example 1 — dependent.</b> (1, 2) and (2, 4): det[1 2; 2 4] = 4 − 4 = 0 → <b>dependent</b> (the second is 2× the first; they span only a line).</div>
<div class="out"><b>Example 2 — independent basis.</b> (1, 0) and (1, 1): det[1 1; 0 1] = 1 ≠ 0 → <b>independent</b>, and being 2 independent vectors in R² they form a <b>basis</b>.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The Rank–Nullity Theorem.</b> For a matrix A with n columns: rank(A) + nullity(A) = n, where rank = dim of the column space (independent output directions) and nullity = dim of the null space (solutions of Ax = 0). It is the accounting identity behind every "how many free variables?" question in Chapter 5 — the deep link between solving systems and the structure of vector spaces.</div>
<div class="note-ct">Dimension is the count of "independent directions" in a space. This is why R² is a plane (2 directions) and R³ is space (3 directions). Course complete: you now command both calculus (change) and linear algebra (structure) — the two mathematical languages of engineering.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Cấu trúc của không gian vector</h2>
<p class="lead">Các ý tưởng cuối của môn làm vector trở nên trừu tượng và mạnh mẽ (CLO9). Một <strong>không gian vector</strong> là bất kỳ tập vector nào bạn có thể cộng và co giãn mà vẫn ở trong đó. Một <strong>không gian con (subspace)</strong> là một không gian nhỏ hơn nằm trong một cái lớn hơn (như một đường thẳng hay mặt phẳng qua gốc trong R³).</p>
<h3>Span &amp; độc lập tuyến tính</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Span (bao tuyến tính)</div><div class="lz-ld">Tất cả vector bạn tới được bằng cách cộng và co giãn một tập cho trước. Hai vector độc lập trong R³ span một mặt phẳng.</div></div>
  <div class="lz-layer"><div class="lz-lt">Độc lập tuyến tính</div><div class="lz-ld">Một tập độc lập nếu không vector nào xây được từ các vector kia. Không vector nào "thừa."</div></div>
</div>
<h3>Cơ sở &amp; số chiều</h3>
<p>Một <strong>cơ sở (basis)</strong> là một tập vector vừa <em>độc lập</em> VỪA <em>span</em> cả không gian — tập viên gạch tối thiểu. Số vector trong một cơ sở là <strong>số chiều (dimension)</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Span?</div><div class="lz-t">tới được mọi thứ</div><div class="lz-d">đủ vector</div></div>
  <div class="lz-step"><div class="lz-k">Độc lập?</div><div class="lz-t">không cái nào thừa</div><div class="lz-d">không quá nhiều</div></div>
  <div class="lz-step"><div class="lz-k">Cơ sở</div><div class="lz-t">vừa đủ</div><div class="lz-d">số lượng = số chiều</div></div>
</div>
<div class="out"><b>Ví dụ:</b>  (1, 0) và (0, 1) tạo thành một cơ sở của R² — độc lập và span. Nên dim(R²) = 2. Mọi mặt phẳng qua gốc có số chiều 2; một đường thẳng có số chiều 1.</div>
<h3>Công thức · Độc lập &amp; số chiều</h3>
<div class="formula"><span class="lbl">Kiểm độc lập (n vector trong Rⁿ)</span>xếp chúng làm các cột của ma trận A → độc lập ⟺ det(A) ≠ 0 ⟺ hạng = n</div>
<div class="formula"><span class="lbl">Sự thật về số chiều</span>dim(Rⁿ) = n    một cơ sở của không gian n chiều có đúng n vector    n vector độc lập bất kỳ trong Rⁿ tạo thành một cơ sở</div>
<h3>Ví dụ có lời giải · Giải từng bước</h3>
<div class="out"><b>Ví dụ 1 — phụ thuộc.</b> (1, 2) và (2, 4): det[1 2; 2 4] = 4 − 4 = 0 → <b>phụ thuộc</b> (cái thứ hai bằng 2× cái đầu; chúng chỉ span một đường thẳng).</div>
<div class="out"><b>Ví dụ 2 — cơ sở độc lập.</b> (1, 0) và (1, 1): det[1 1; 0 1] = 1 ≠ 0 → <b>độc lập</b>, và là 2 vector độc lập trong R² nên chúng tạo thành một <b>cơ sở</b>.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Định lý Hạng–Số khuyết (Rank–Nullity).</b> Với ma trận A có n cột: rank(A) + nullity(A) = n, trong đó rank = số chiều không gian cột (số hướng đầu ra độc lập) và nullity = số chiều không gian nghiệm (nghiệm của Ax = 0). Đây là đẳng thức "kế toán" đứng sau mọi câu hỏi "bao nhiêu biến tự do?" ở Chương 5 — mối liên hệ sâu giữa giải hệ và cấu trúc của không gian vector.</div>
<div class="note-ct">Số chiều là số "hướng độc lập" trong một không gian. Đó là lý do R² là mặt phẳng (2 hướng) và R³ là không gian (3 hướng). Hoàn thành môn: giờ bạn nắm cả giải tích (sự thay đổi) lẫn đại số tuyến tính (cấu trúc) — hai ngôn ngữ toán học của kỹ thuật.</div>
</div>
`,
        },
        {
          title: 'Chapter 9 Quiz|||Quiz chương 9',
          slug: 'mae101-quiz-ch9',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: không gian con, span, độc lập, cơ sở, số chiều.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The span of a set of vectors is…|||Span của một tập vector là…', options: ['their sum only|||chỉ tổng của chúng', 'all vectors reachable by adding and scaling them|||mọi vector tới được bằng cách cộng và co giãn chúng', 'their determinant|||định thức của chúng', 'a single vector|||một vector duy nhất'], correctIndex: 1, points: 1 },
              { question: 'A set of vectors is linearly independent if…|||Một tập vector độc lập tuyến tính nếu…', options: ['they are all equal|||chúng đều bằng nhau', 'none can be built from the others|||không cái nào xây được từ các cái kia', 'they span R³|||chúng span R³', 'they are perpendicular|||chúng vuông góc'], correctIndex: 1, points: 1 },
              { question: 'A basis must be…|||Một cơ sở phải…', options: ['independent AND span the space|||độc lập VÀ span không gian', 'as large as possible|||càng lớn càng tốt', 'a single vector|||một vector duy nhất', 'dependent|||phụ thuộc'], correctIndex: 0, points: 1 },
              { question: 'The dimension of a space is…|||Số chiều của một không gian là…', options: ['the largest vector in it|||vector lớn nhất trong nó', 'the number of vectors in a basis|||số vector trong một cơ sở', 'its determinant|||định thức của nó', 'always 3|||luôn là 3'], correctIndex: 1, points: 1 },
              { question: 'dim(R²) equals…|||dim(R²) bằng…', options: ['1', '2', '3', '4'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 3 ══════════════════ */
    {
      title: 'Progress Test 3 (Vector Spaces — CLO8–9)|||Progress Test 3 (Không gian vector — CLO8–9)',
      description: 'Ôn: vector, biến đổi tuyến tính, cơ sở & số chiều.',
      lessons: [
        {
          title: 'Progress Test 3 — Vector spaces review|||Progress Test 3 — Ôn không gian vector',
          slug: 'mae101-progress-test-3',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 8–9.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Scalar multiplication 3·(1, 2) equals…|||Nhân vô hướng 3·(1, 2) bằng…', options: ['(3, 6)', '(4, 5)', '(1, 6)', '6'], correctIndex: 0, points: 1 },
              { question: 'Two vectors are orthogonal (perpendicular) when their dot product is…|||Hai vector trực giao (vuông góc) khi tích vô hướng của chúng…', options: ['1', '0', 'negative|||âm', 'maximum|||lớn nhất'], correctIndex: 1, points: 1 },
              { question: 'The matrix [cos θ −sin θ; sin θ cos θ] performs a…|||Ma trận [cos θ −sin θ; sin θ cos θ] thực hiện một phép…', options: ['reflection|||phản chiếu', 'rotation|||xoay', 'scaling only|||chỉ co giãn', 'projection|||chiếu'], correctIndex: 1, points: 1 },
              { question: 'A basis of a space is a set that is independent and…|||Một cơ sở của không gian là một tập độc lập và…', options: ['spans the space|||span không gian', 'has determinant 1|||có định thức 1', 'is orthogonal|||trực giao', 'has one element|||có một phần tử'], correctIndex: 0, points: 1 },
              { question: 'A plane through the origin in R³ has dimension…|||Một mặt phẳng qua gốc trong R³ có số chiều…', options: ['1', '2', '3', '0'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 1 — TÍNH BẰNG MAXIMA/PYTHON ══════════════════ */
    {
      title: 'Advanced 1 — Computing with Maxima & Python|||Nâng cao 1 — Tính bằng Maxima & Python',
      description: 'Ngoài giáo trình: dùng công cụ để tính và kiểm giải tích/ma trận.',
      lessons: [
        {
          title: 'N1.1 — Let the computer do the algebra|||N1.1 — Để máy tính lo phần đại số',
          slug: 'mae101-n1-1-maxima-python',
          type: 'VIDEO',
          description: 'Tính giới hạn, đạo hàm, tích phân và ma trận bằng Maxima và Python.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 1 · Lesson N1.1</span>
<h2>Compute &amp; check with software</h2>
<p class="lead">You must be able to do the math by hand for the exam — but computational tools let you <strong>check</strong> your answers instantly and explore harder problems. This connects to the FPT "Linear transformation with Python" project.</p>
<h3>Maxima — a computer algebra system</h3>
<pre><span class="tok-comment">/* Maxima computes calculus symbolically */</span>
limit((x^2-4)/(x-2), x, 2);   <span class="tok-comment">/* → 4 */</span>
diff(sin(x)*x, x);            <span class="tok-comment">/* derivative → sin(x)+x*cos(x) */</span>
integrate(x^2, x, 0, 2);     <span class="tok-comment">/* → 8/3 */</span>
determinant(matrix([1,2],[3,4]));  <span class="tok-comment">/* → -2 */</span></pre>
<h3>Python (NumPy) — matrices &amp; transformations</h3>
<pre><span class="tok-keyword">import</span> numpy <span class="tok-keyword">as</span> np
A = np.array([[0, -1], [1, 0]])   <span class="tok-comment"># 90° rotation</span>
v = np.array([1, 0])
<span class="tok-function">print</span>(A @ v)                       <span class="tok-comment"># → [0 1]</span>
<span class="tok-function">print</span>(np.linalg.det(A))           <span class="tok-comment"># → 1.0</span>
<span class="tok-function">print</span>(np.linalg.eig(A))           <span class="tok-comment"># eigenvalues &amp; eigenvectors</span></pre>
<div class="callout ok">These are the same tools working data scientists and engineers use every day — NumPy is the foundation of essentially all Python machine learning. Doing MAE101&#39;s matrix work in NumPy is a direct preview of your future toolkit.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fmathematics-for-engineering%2Flearn&reflabel=MAE101%20%E2%80%94%20Mathematics%20for%20Engineering#module-254" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice Python for the math</span><span class="lc-sub">Start with "Python Basics" then build up to matrix code on CodeLab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 1 · Bài N1.1</span>
<h2>Tính &amp; kiểm bằng phần mềm</h2>
<p class="lead">Bạn phải làm được toán bằng tay cho bài thi — nhưng công cụ tính cho phép <strong>kiểm</strong> đáp án tức thì và khám phá bài khó hơn. Điều này nối với dự án FPT "Linear transformation with Python".</p>
<h3>Maxima — hệ đại số máy tính</h3>
<pre><span class="tok-comment">/* Maxima tính giải tích ký hiệu */</span>
limit((x^2-4)/(x-2), x, 2);   <span class="tok-comment">/* → 4 */</span>
diff(sin(x)*x, x);            <span class="tok-comment">/* đạo hàm → sin(x)+x*cos(x) */</span>
integrate(x^2, x, 0, 2);     <span class="tok-comment">/* → 8/3 */</span>
determinant(matrix([1,2],[3,4]));  <span class="tok-comment">/* → -2 */</span></pre>
<h3>Python (NumPy) — ma trận &amp; biến đổi</h3>
<pre><span class="tok-keyword">import</span> numpy <span class="tok-keyword">as</span> np
A = np.array([[0, -1], [1, 0]])   <span class="tok-comment"># xoay 90°</span>
v = np.array([1, 0])
<span class="tok-function">print</span>(A @ v)                       <span class="tok-comment"># → [0 1]</span>
<span class="tok-function">print</span>(np.linalg.det(A))           <span class="tok-comment"># → 1.0</span>
<span class="tok-function">print</span>(np.linalg.eig(A))           <span class="tok-comment"># giá trị riêng &amp; vector riêng</span></pre>
<div class="callout ok">Đây đúng là các công cụ mà nhà khoa học dữ liệu và kỹ sư dùng hằng ngày — NumPy là nền của gần như mọi machine learning bằng Python. Làm phần ma trận của MAE101 bằng NumPy là bản xem trước trực tiếp của bộ công cụ tương lai của bạn.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fmathematics-for-engineering%2Flearn&reflabel=MAE101%20%E2%80%94%20Mathematics%20for%20Engineering#module-254" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện Python cho phần toán</span><span class="lc-sub">Bắt đầu với "Python Basics" rồi xây lên code ma trận trên CodeLab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 2 — TOÁN NÀY DÙNG ĐỂ LÀM GÌ (CAPSTONE) ══════════════════ */
    {
      title: 'Advanced 2 — Why this math powers ML & graphics|||Nâng cao 2 — Vì sao toán này vận hành ML & đồ hoạ',
      description: 'Ngoài giáo trình — bài tổng kết: giải tích & đại số tuyến tính trong đời thực.',
      lessons: [
        {
          title: 'N2.1 — From MAE101 to machine learning|||N2.1 — Từ MAE101 tới machine learning',
          slug: 'mae101-n2-1-ung-dung',
          type: 'VIDEO',
          description: 'Đạo hàm, ma trận và vector chính là bộ máy của AI và đồ hoạ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 2 · Lesson N2.1</span>
<h2>The math you just learned runs the modern world</h2>
<p class="lead">MAE101 can feel abstract while you are in it. This capstone shows that its two halves — calculus and linear algebra — are the literal engine of machine learning, computer graphics and data science.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Derivatives → training AI (gradient descent)</div><div class="lz-ld">A neural network learns by computing the derivative of its error and stepping "downhill" to reduce it. That is calculus (Chapter 2–3) running billions of times.</div></div>
  <div class="lz-layer"><div class="lz-lt">Matrices → the layers of a neural network</div><div class="lz-ld">Each layer multiplies its input vector by a matrix (Chapters 6, 8). Training = finding the right matrix entries.</div></div>
  <div class="lz-layer"><div class="lz-lt">Vectors → representing everything</div><div class="lz-ld">Words, images, users and products all become vectors so a machine can compute with them (Chapter 8).</div></div>
  <div class="lz-layer"><div class="lz-lt">Eigenvalues → PCA, PageRank, recommendations</div><div class="lz-ld">Data compression and Google&#39;s search ranking are eigenvalue problems (Chapter 7).</div></div>
  <div class="lz-layer"><div class="lz-lt">Integrals → probability &amp; areas</div><div class="lz-ld">Probabilities are areas under curves — integration (Chapter 4) underlies all of statistics.</div></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Represent</div><div class="lz-t">data → vectors</div><div class="lz-d">Ch 8</div></div>
  <div class="lz-step"><div class="lz-k">Transform</div><div class="lz-t">vectors → matrices</div><div class="lz-d">Ch 6, 8</div></div>
  <div class="lz-step"><div class="lz-k">Optimize</div><div class="lz-t">derivatives → learning</div><div class="lz-d">Ch 2, 3</div></div>
</div>
<div class="callout ok">This is why FPT puts MAE101 in semester 1: it is not a hurdle, it is the foundation. Every AI course, graphics engine and data-science role you might pursue is built directly on the limits, derivatives, integrals, matrices and vectors you learned here.</div>
<div class="note-ct">Congratulations on completing MAE101 — and Semester 1&#39;s mathematics. You now speak the two languages of quantitative engineering: calculus for how things change, and linear algebra for structure and transformation. Keep the tools sharp; you will reach for them again and again.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 2 · Bài N2.1</span>
<h2>Toán bạn vừa học vận hành thế giới hiện đại</h2>
<p class="lead">MAE101 có thể thấy trừu tượng khi đang học. Bài tổng kết này cho thấy hai nửa của nó — giải tích và đại số tuyến tính — là động cơ đúng nghĩa của machine learning, đồ hoạ máy tính và khoa học dữ liệu.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Đạo hàm → huấn luyện AI (gradient descent)</div><div class="lz-ld">Một mạng nơ-ron học bằng cách tính đạo hàm của lỗi và bước "xuống dốc" để giảm nó. Đó là giải tích (Chương 2–3) chạy hàng tỷ lần.</div></div>
  <div class="lz-layer"><div class="lz-lt">Ma trận → các tầng của mạng nơ-ron</div><div class="lz-ld">Mỗi tầng nhân vector đầu vào với một ma trận (Chương 6, 8). Huấn luyện = tìm đúng các phần tử ma trận.</div></div>
  <div class="lz-layer"><div class="lz-lt">Vector → biểu diễn mọi thứ</div><div class="lz-ld">Từ ngữ, ảnh, người dùng và sản phẩm đều thành vector để máy tính toán với chúng (Chương 8).</div></div>
  <div class="lz-layer"><div class="lz-lt">Giá trị riêng → PCA, PageRank, gợi ý</div><div class="lz-ld">Nén dữ liệu và xếp hạng tìm kiếm của Google là các bài toán giá trị riêng (Chương 7).</div></div>
  <div class="lz-layer"><div class="lz-lt">Tích phân → xác suất &amp; diện tích</div><div class="lz-ld">Xác suất là diện tích dưới đường cong — tích phân (Chương 4) là nền của cả thống kê.</div></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Biểu diễn</div><div class="lz-t">dữ liệu → vector</div><div class="lz-d">Ch 8</div></div>
  <div class="lz-step"><div class="lz-k">Biến đổi</div><div class="lz-t">vector → ma trận</div><div class="lz-d">Ch 6, 8</div></div>
  <div class="lz-step"><div class="lz-k">Tối ưu</div><div class="lz-t">đạo hàm → học</div><div class="lz-d">Ch 2, 3</div></div>
</div>
<div class="callout ok">Đây là lý do FPT đặt MAE101 ở kỳ 1: nó không phải một chướng ngại, mà là nền tảng. Mọi môn AI, engine đồ hoạ và vị trí khoa học dữ liệu bạn có thể theo đuổi đều xây trực tiếp trên giới hạn, đạo hàm, tích phân, ma trận và vector bạn học ở đây.</div>
<div class="note-ct">Chúc mừng bạn hoàn thành MAE101 — và phần toán của Kỳ 1. Giờ bạn nói được hai ngôn ngữ của kỹ thuật định lượng: giải tích cho cách sự vật thay đổi, và đại số tuyến tính cho cấu trúc và biến đổi. Giữ các công cụ sắc bén; bạn sẽ dùng lại chúng nhiều lần nữa.</div>
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
          "slug": "mae101-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "A two-sided limit at x=a exists only if…|||Giới hạn hai phía tại x=a tồn tại chỉ khi…",
                "options": [
                  "f(a) is defined|||f(a) xác định",
                  "the left and right limits are equal|||giới hạn trái và phải bằng nhau",
                  "f is a polynomial|||f là đa thức",
                  "a = 0"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "lim(x→2) x² equals…|||lim(x→2) x² bằng…",
                "options": [
                  "2",
                  "4",
                  "8",
                  "does not exist|||không tồn tại"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "lim(x→2) (x²−4)/(x−2) equals…|||lim(x→2) (x²−4)/(x−2) bằng…",
                "options": [
                  "0",
                  "undefined|||không xác định",
                  "4",
                  "2"
                ],
                "correctIndex": 2
              },
              {
                "id": "q4",
                "points": 1,
                "question": "When direct substitution gives 0/0, you should…|||Khi thay số trực tiếp ra 0/0, bạn nên…",
                "options": [
                  "conclude the limit does not exist|||kết luận giới hạn không tồn tại",
                  "simplify (e.g. factor) then substitute again|||rút gọn (vd phân tích) rồi thay lại",
                  "answer 1|||trả lời 1",
                  "answer 0|||trả lời 0"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "lim(x→∞) (3x²+1)/(x²−5) equals…|||lim(x→∞) (3x²+1)/(x²−5) bằng…",
                "options": [
                  "0",
                  "3",
                  "∞",
                  "1"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "The derivative f′(x) geometrically represents…|||Về mặt hình học, đạo hàm f′(x) biểu diễn…",
                "options": [
                  "the area under the curve|||diện tích dưới đường cong",
                  "the slope of the tangent line|||độ dốc của tiếp tuyến",
                  "the y-intercept|||giao điểm trục y",
                  "the limit at infinity|||giới hạn ở vô cực"
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
