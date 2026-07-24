/**
 * MAS291 — Statistics and Probability (Xác suất thống kê). Kỳ 4.
 * Bám syllabus FPTU (sylID 13136, 9 CLO) + giáo trình Montgomery & Runger
 * "Applied Statistics and Probability for Engineers" + Triola. Tiên quyết: MAE101/MAC101.
 * Song ngữ EN/VN (.ml-en/.ml-vi). Công thức Unicode + bảng; luyện Python/Excel.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/MAS291.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'MAS291',
    slug: 'statistics-and-probability',
    title: 'Statistics and Probability',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The mathematics of uncertainty and data: probability, random variables and their distributions, descriptive statistics, and statistical inference — estimation, hypothesis testing and regression — applied to engineering problems with Excel and Python.|||Toán học của sự bất định và dữ liệu: xác suất, biến ngẫu nhiên và phân phối, thống kê mô tả, và suy diễn thống kê — ước lượng, kiểm định giả thuyết, hồi quy — áp dụng vào bài toán kỹ thuật với Excel và Python.',
    description: 'Môn xác suất và thống kê cho kỹ thuật: nguyên lý xác suất, các phân phối xác suất thường gặp (rời rạc & liên tục), thống kê mô tả, và suy diễn thống kê — ước lượng tham số, khoảng tin cậy, kiểm định giả thuyết, hồi quy & tương quan. Học nhận diện mô hình thống kê và giải bằng phần mềm (Excel/DDXL, Python). Tiên quyết: MAE101 hoặc MAC101.',
    whatYouLearn: 'Vai trò của thống kê; xác suất (không gian mẫu, biến cố, quy tắc, xác suất có điều kiện, Bayes); biến ngẫu nhiên rời rạc & phân phối (nhị thức, Poisson) với kỳ vọng/phương sai; biến ngẫu nhiên liên tục (chuẩn, đều, mũ); thống kê mô tả (tóm tắt số & biểu đồ); phân phối mẫu & Định lý giới hạn trung tâm; khoảng tin cậy; kiểm định giả thuyết; hồi quy tuyến tính đơn; và dùng Excel/Python để giải.',
    requirements: 'Tiên quyết: đạt MAE101 hoặc MAC101 (vững giải tích: đạo hàm, tích phân). Cần Microsoft Excel (khuyên có add-on DDXL) hoặc Python (numpy/scipy/pandas).',
    documentsNote: 'Giáo trình chính: Montgomery D.C. & Runger G.C. — Applied Statistics and Probability for Engineers (Wiley). Kèm: Triola — Elementary Statistics Using Excel; slide FU. Công cụ: Excel + DDXL add-on, hoặc Python. Luyện tính toán: track Code Lab Python. Kèm file syllabus gốc MAS291.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, điều kiện qua môn, chuẩn đầu ra và công cụ.',
      lessons: [
        {
          title: '0.1 — About MAS291 & the course map|||0.1 — Giới thiệu MAS291 & bản đồ môn học',
          slug: 'mas291-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Vì sao thống kê quan trọng với kỹ sư, và toàn cảnh lộ trình từ xác suất tới suy diễn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About MAS291 — Statistics and Probability</h2>
<p class="lead">Data never speaks for itself — it needs statistics to be understood. MAS291 gives you the two connected tools every engineer and data professional needs: <strong>probability</strong> (the maths of uncertainty) and <strong>statistics</strong> (turning data into reliable conclusions).</p>
<p>You will move from "what is the chance of…" up to "the data proves…", learning to estimate, test hypotheses and model relationships — the foundation of data science, quality control and every experiment.</p>
<h3>Course map</h3>
<div class="lz-map">
  <div class="lz-stage">Probability</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Role of statistics &amp; data</div><div class="lz-nsub">Populations · samples · variables</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Probability</div><div class="lz-nsub">Events · rules · conditional · Bayes</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Discrete distributions</div><div class="lz-nsub">Binomial · Poisson · mean &amp; variance</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Continuous distributions</div><div class="lz-nsub">Normal · uniform · exponential</div></div></div>
  <div class="lz-stage">Statistics</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Descriptive statistics</div><div class="lz-nsub">Summaries · charts</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Sampling &amp; the CLT</div><div class="lz-nsub">Why the normal shows up everywhere</div></div></div>
  <div class="lz-stage">Inference</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Confidence intervals</div><div class="lz-nsub">Estimating with a margin of error</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Hypothesis testing</div><div class="lz-nsub">Proving a claim from data</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Regression &amp; correlation</div><div class="lz-nsub">Modelling relationships</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Statistics in Python/Excel · toward data science</div><div class="lz-nsub">Real tools, real datasets</div></div></div>
</div>
<div class="callout ok">Statistics clicks when you compute with real numbers. Every chapter links to a worked formula and a way to check it in Excel or Python — do the calculations, don't just read them.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-256" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Compute statistics in Python</span><span class="lc-sub">Data structures &amp; collections — the base for numpy/pandas.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu MAS291 — Xác suất thống kê</h2>
<p class="lead">Dữ liệu không bao giờ tự nói — nó cần thống kê để được hiểu. MAS291 cho bạn hai công cụ nối liền mà mọi kỹ sư và người làm dữ liệu cần: <strong>xác suất</strong> (toán của sự bất định) và <strong>thống kê</strong> (biến dữ liệu thành kết luận đáng tin).</p>
<p>Bạn sẽ đi từ "khả năng xảy ra là…" lên tới "dữ liệu chứng minh…", học ước lượng, kiểm định giả thuyết và mô hình hóa quan hệ — nền tảng của khoa học dữ liệu, kiểm soát chất lượng và mọi thí nghiệm.</p>
<h3>Bản đồ môn học</h3>
<div class="lz-map">
  <div class="lz-stage">Xác suất</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Vai trò thống kê &amp; dữ liệu</div><div class="lz-nsub">Tổng thể · mẫu · biến</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Xác suất</div><div class="lz-nsub">Biến cố · quy tắc · có điều kiện · Bayes</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Phân phối rời rạc</div><div class="lz-nsub">Nhị thức · Poisson · kỳ vọng &amp; phương sai</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Phân phối liên tục</div><div class="lz-nsub">Chuẩn · đều · mũ</div></div></div>
  <div class="lz-stage">Thống kê</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Thống kê mô tả</div><div class="lz-nsub">Tóm tắt · biểu đồ</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Phân phối mẫu &amp; CLT</div><div class="lz-nsub">Vì sao phân phối chuẩn ở khắp nơi</div></div></div>
  <div class="lz-stage">Suy diễn</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Khoảng tin cậy</div><div class="lz-nsub">Ước lượng kèm sai số</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm định giả thuyết</div><div class="lz-nsub">Chứng minh một khẳng định từ dữ liệu</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Hồi quy &amp; tương quan</div><div class="lz-nsub">Mô hình hóa quan hệ</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Thống kê trong Python/Excel · hướng khoa học dữ liệu</div><div class="lz-nsub">Công cụ thật, dữ liệu thật</div></div></div>
</div>
<div class="callout ok">Thống kê "thấm" khi bạn tính với số thật. Mỗi chương link tới một công thức có lời giải và cách kiểm bằng Excel/Python — hãy tính, đừng chỉ đọc.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-256" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Tính thống kê bằng Python</span><span class="lc-sub">Cấu trúc dữ liệu — nền cho numpy/pandas.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'mas291-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết, điểm sàn và các cột điểm (3 progress test + 2 assignment + project + final).',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">From the official MAS291 syllabus. The grade is spread across many components, so consistent work through the term matters more than one big exam.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class + final + self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">MAE101 or MAC101</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of sessions</span></div>
</div>
<h3>Grade structure</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th></tr></thead>
  <tbody>
    <tr><td>3 Progress Tests</td><td>30%</td></tr>
    <tr><td>2 Assignments</td><td>20%</td></tr>
    <tr><td>1 Computer Project</td><td>15%</td></tr>
    <tr><td>Final Examination</td><td>35%</td></tr>
  </tbody>
</table>
<div class="callout warn">Completion rule: every on-going component must be &gt; 0 and the Final Result ≥ 5. Do not skip a progress test or assignment — a zero in one component can block you even with a good final.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Từ syllabus chính thức MAS291. Điểm trải trên nhiều cột, nên làm đều suốt kỳ quan trọng hơn một kỳ thi lớn.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h lớp + thi + tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">MAE101 hoặc MAC101</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% buổi</span></div>
</div>
<h3>Cấu trúc điểm</h3>
<table>
  <thead><tr><th>Cột điểm</th><th>Trọng số</th></tr></thead>
  <tbody>
    <tr><td>3 Progress Test</td><td>30%</td></tr>
    <tr><td>2 Assignment</td><td>20%</td></tr>
    <tr><td>1 Computer Project</td><td>15%</td></tr>
    <tr><td>Thi cuối kỳ</td><td>35%</td></tr>
  </tbody>
</table>
<div class="callout warn">Luật hoàn thành: mọi cột on-going phải &gt; 0 và Kết quả cuối ≥ 5. Đừng bỏ một progress test hay assignment nào — một điểm 0 ở một cột có thể chặn bạn dù thi cuối tốt.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — VAI TRÒ THỐNG KÊ ══════════════════ */
    {
      title: 'Chapter 1 — The role of statistics & data|||Chương 1 — Vai trò của thống kê & dữ liệu',
      description: 'Tổng thể vs mẫu, các loại biến, và hai nhánh thống kê mô tả vs suy diễn.',
      lessons: [
        {
          title: '1.1 — Populations, samples & variables|||1.1 — Tổng thể, mẫu & biến',
          slug: 'mas291-tong-the-mau',
          type: 'VIDEO',
          description: 'Khái niệm nền: tổng thể/mẫu, tham số/thống kê, biến định tính/định lượng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The foundations — populations, samples &amp; variables</h2>
<p class="lead">Statistics starts with a simple idea: we rarely measure everyone, so we take a <strong>sample</strong> and use it to say something about the whole <strong>population</strong>. Getting these words right prevents most beginner mistakes.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Population</b> — the entire group we care about (all FPT students). A number describing it is a <em>parameter</em> (μ, σ).</div>
  <div class="lz-layer"><b>Sample</b> — the subset we actually measure. A number describing it is a <em>statistic</em> (x̄, s).</div>
  <div class="lz-layer"><b>Descriptive statistics</b> — summarising the data we have (Chapters 5).</div>
  <div class="lz-layer"><b>Inferential statistics</b> — drawing conclusions about the population from the sample (Chapters 6–9).</div>
</div>
<table>
  <thead><tr><th>Variable type</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Qualitative (categorical)</td><td>gender, colour, pass/fail</td></tr>
    <tr><td>Quantitative discrete</td><td>number of defects (counts)</td></tr>
    <tr><td>Quantitative continuous</td><td>height, time, temperature</td></tr>
  </tbody>
</table>
<div class="note-ct">The goal of the whole course: use a sample statistic (x̄) to estimate or test a population parameter (μ) — and know how confident to be.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Nền tảng — tổng thể, mẫu &amp; biến</h2>
<p class="lead">Thống kê bắt đầu từ một ý đơn giản: ta hiếm khi đo được tất cả, nên lấy một <strong>mẫu</strong> và dùng nó để nói điều gì đó về cả <strong>tổng thể</strong>. Dùng đúng các từ này tránh được hầu hết lỗi người mới.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Tổng thể</b> — toàn bộ nhóm ta quan tâm (mọi sinh viên FPT). Con số mô tả nó là <em>tham số</em> (μ, σ).</div>
  <div class="lz-layer"><b>Mẫu</b> — tập con ta thực sự đo. Con số mô tả nó là <em>thống kê</em> (x̄, s).</div>
  <div class="lz-layer"><b>Thống kê mô tả</b> — tóm tắt dữ liệu ta có (Chương 5).</div>
  <div class="lz-layer"><b>Thống kê suy diễn</b> — rút kết luận về tổng thể từ mẫu (Chương 6–9).</div>
</div>
<table>
  <thead><tr><th>Loại biến</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Định tính (phân loại)</td><td>giới tính, màu, đạt/trượt</td></tr>
    <tr><td>Định lượng rời rạc</td><td>số lỗi (đếm)</td></tr>
    <tr><td>Định lượng liên tục</td><td>chiều cao, thời gian, nhiệt độ</td></tr>
  </tbody>
</table>
<div class="note-ct">Mục tiêu cả môn: dùng thống kê mẫu (x̄) để ước lượng hoặc kiểm định tham số tổng thể (μ) — và biết tin tưởng đến mức nào.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — XÁC SUẤT ══════════════════ */
    {
      title: 'Chapter 2 — Probability|||Chương 2 — Xác suất',
      description: 'Không gian mẫu, biến cố, quy tắc cộng/nhân, xác suất có điều kiện và định lý Bayes.',
      lessons: [
        {
          title: '2.1 — Sample spaces, events & rules|||2.1 — Không gian mẫu, biến cố & quy tắc',
          slug: 'mas291-xac-suat-co-ban',
          type: 'VIDEO',
          description: 'Định nghĩa xác suất, quy tắc cộng, biến cố xung khắc & độc lập, quy tắc nhân.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Probability — measuring uncertainty</h2>
<p class="lead">Probability assigns a number between 0 and 1 to how likely an event is. The <strong>sample space</strong> S is the set of all outcomes; an <strong>event</strong> is a subset of S. For equally likely outcomes, P(A) = (favourable) / (total).</p>
<div class="out"><b>Die roll:</b> S = {1,2,3,4,5,6}. Event "even" = {2,4,6}. P(even) = 3/6 = 0.5.</div>
<table>
  <thead><tr><th>Rule</th><th>Formula</th></tr></thead>
  <tbody>
    <tr><td>Complement</td><td>P(A′) = 1 − P(A)</td></tr>
    <tr><td>Addition</td><td>P(A∪B) = P(A) + P(B) − P(A∩B)</td></tr>
    <tr><td>Mutually exclusive</td><td>P(A∩B) = 0 → P(A∪B) = P(A)+P(B)</td></tr>
    <tr><td>Multiplication (independent)</td><td>P(A∩B) = P(A)·P(B)</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>A card is drawn from 52.</b> P(King or Heart)?<br>
P(King) = 4/52, P(Heart) = 13/52, P(King ∩ Heart) = 1/52 (the King of Hearts).<br>
P(King ∪ Heart) = 4/52 + 13/52 − 1/52 = 16/52 = <b>4/13 ≈ 0.308</b>.<br>
We subtract the overlap once so the King of Hearts is not double-counted.</div>
<div class="note-ct">Two events are <b>independent</b> if one happening does not change the other's probability. Do not confuse independent (can happen together) with mutually exclusive (cannot).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Counting with combinations.</b> When outcomes are equally likely but numerous, you count with permutations (order matters, nPr) and combinations (order doesn't, nCr = n!/[r!(n−r)!]). E.g. the chance of a specific 6-number lottery ticket is 1 / C(45,6). This combinatorics underlies the binomial distribution in Chapter 3.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Xác suất — đo sự bất định</h2>
<p class="lead">Xác suất gán một số giữa 0 và 1 cho khả năng một biến cố xảy ra. <strong>Không gian mẫu</strong> S là tập mọi kết quả; một <strong>biến cố</strong> là tập con của S. Với kết quả đồng khả năng, P(A) = (thuận lợi) / (tổng).</p>
<div class="out"><b>Gieo xúc xắc:</b> S = {1,2,3,4,5,6}. Biến cố "chẵn" = {2,4,6}. P(chẵn) = 3/6 = 0.5.</div>
<table>
  <thead><tr><th>Quy tắc</th><th>Công thức</th></tr></thead>
  <tbody>
    <tr><td>Biến cố đối</td><td>P(A′) = 1 − P(A)</td></tr>
    <tr><td>Cộng</td><td>P(A∪B) = P(A) + P(B) − P(A∩B)</td></tr>
    <tr><td>Xung khắc</td><td>P(A∩B) = 0 → P(A∪B) = P(A)+P(B)</td></tr>
    <tr><td>Nhân (độc lập)</td><td>P(A∩B) = P(A)·P(B)</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Rút một lá từ 52 lá.</b> P(K hoặc Cơ)?<br>
P(K) = 4/52, P(Cơ) = 13/52, P(K ∩ Cơ) = 1/52 (lá K Cơ).<br>
P(K ∪ Cơ) = 4/52 + 13/52 − 1/52 = 16/52 = <b>4/13 ≈ 0.308</b>.<br>
Ta trừ phần giao một lần để lá K Cơ không bị đếm hai lần.</div>
<div class="note-ct">Hai biến cố <b>độc lập</b> nếu cái này xảy ra không đổi xác suất cái kia. Đừng nhầm độc lập (có thể cùng xảy ra) với xung khắc (không thể).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đếm bằng tổ hợp.</b> Khi các kết quả đồng khả năng nhưng nhiều, ta đếm bằng chỉnh hợp (thứ tự quan trọng, nPr) và tổ hợp (thứ tự không quan trọng, nCr = n!/[r!(n−r)!]). Vd khả năng trúng một vé xổ số 6 số cụ thể là 1 / C(45,6). Tổ hợp này là nền của phân phối nhị thức ở Chương 3.</div>
</div>
`,
        },
        {
          title: '2.2 — Conditional probability & Bayes|||2.2 — Xác suất có điều kiện & Bayes',
          slug: 'mas291-bayes',
          type: 'VIDEO',
          description: 'P(A|B), quy tắc nhân tổng quát, và định lý Bayes — cập nhật niềm tin theo bằng chứng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Conditional probability &amp; Bayes' theorem</h2>
<p class="lead"><strong>Conditional probability</strong> P(A|B) is the chance of A <em>given</em> that B happened. It is how new information updates a probability — and the basis of everything from medical tests to spam filters.</p>
<div class="out">P(A|B) = P(A∩B) / P(B). General multiplication: P(A∩B) = P(B)·P(A|B).</div>
<h3>Bayes' theorem</h3>
<div class="out">P(A|B) = [ P(B|A)·P(A) ] / P(B)</div>
<p>Bayes flips a conditional you know into one you want. Classic example: a disease test that is 99% accurate can still leave you more likely healthy than sick if the disease is rare — because the base rate P(disease) matters.</p>
<div class="pitfall"><b>Trap:</b> a "99% accurate" test does not mean a positive result means 99% chance of disease. You must weigh it against how common the disease is (the prior). This "base-rate fallacy" is a favourite exam and interview question.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Xác suất có điều kiện &amp; định lý Bayes</h2>
<p class="lead"><strong>Xác suất có điều kiện</strong> P(A|B) là khả năng A <em>khi biết</em> B đã xảy ra. Đó là cách thông tin mới cập nhật một xác suất — và nền của mọi thứ từ xét nghiệm y khoa tới lọc spam.</p>
<div class="out">P(A|B) = P(A∩B) / P(B). Nhân tổng quát: P(A∩B) = P(B)·P(A|B).</div>
<h3>Định lý Bayes</h3>
<div class="out">P(A|B) = [ P(B|A)·P(A) ] / P(B)</div>
<p>Bayes lật một xác suất có điều kiện bạn biết thành cái bạn muốn. Ví dụ kinh điển: một xét nghiệm bệnh chính xác 99% vẫn có thể cho bạn khả năng khỏe cao hơn bệnh nếu bệnh hiếm — vì tỷ lệ nền P(bệnh) mới quan trọng.</p>
<div class="pitfall"><b>Bẫy:</b> một xét nghiệm "chính xác 99%" KHÔNG nghĩa là kết quả dương tính = 99% khả năng mắc bệnh. Phải cân với việc bệnh phổ biến đến đâu (tiên nghiệm). "Ngụy biện tỷ lệ nền" này là câu hỏi thi và phỏng vấn ưa thích.</div>
</div>
`,
        },
        {
          title: 'Quiz 1 — Probability|||Quiz 1 — Xác suất',
          slug: 'mas291-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra xác suất cơ bản, có điều kiện và Bayes.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'For a fair die, P(rolling an even number) is…|||Với xúc xắc cân đối, P(ra số chẵn) là…', options: ['1/6', '1/2', '1/3', '2/3'], correctIndex: 1, points: 1 },
              { question: 'Two events are independent when…|||Hai biến cố độc lập khi…', options: ['they cannot happen together|||chúng không thể cùng xảy ra', 'one happening does not change the other\'s probability|||cái này xảy ra không đổi xác suất cái kia', 'they are equal|||chúng bằng nhau', 'P(A)=0'], correctIndex: 1, points: 1 },
              { question: 'The addition rule P(A∪B) equals…|||Quy tắc cộng P(A∪B) bằng…', options: ['P(A)·P(B)', 'P(A) + P(B) − P(A∩B)', 'P(A) − P(B)', 'P(A|B)'], correctIndex: 1, points: 1 },
              { question: 'Bayes\' theorem is used to…|||Định lý Bayes dùng để…', options: ['add probabilities|||cộng xác suất', 'reverse a conditional probability using the prior|||đảo một xác suất có điều kiện dùng tiên nghiệm', 'count outcomes|||đếm kết quả', 'find the mean|||tìm trung bình'], correctIndex: 1, points: 1 },
              { question: 'Mutually exclusive events have P(A∩B) =|||Biến cố xung khắc có P(A∩B) =', options: ['1', '0', 'P(A)·P(B)', '0.5'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — PHÂN PHỐI RỜI RẠC ══════════════════ */
    {
      title: 'Chapter 3 — Discrete distributions|||Chương 3 — Phân phối rời rạc',
      description: 'Biến ngẫu nhiên rời rạc, kỳ vọng & phương sai, phân phối nhị thức và Poisson.',
      lessons: [
        {
          title: '3.1 — Discrete random variables, binomial & Poisson|||3.1 — Biến ngẫu nhiên rời rạc, nhị thức & Poisson',
          slug: 'mas291-phan-phoi-roi-rac',
          type: 'VIDEO',
          description: 'Hàm khối xác suất, E(X)=Σx·P(x), Var(X); phân phối nhị thức (n phép thử) và Poisson (đếm hiếm).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Discrete random variables &amp; their distributions</h2>
<p class="lead">A <strong>random variable</strong> assigns a number to each outcome. A discrete one takes countable values, described by a probability mass function P(X=x). Two summarise its centre and spread:</p>
<div class="out"><b>Mean (expected value):</b> μ = E(X) = Σ x·P(x) · <b>Variance:</b> σ² = Σ (x−μ)²·P(x)</div>
<table>
  <thead><tr><th>Distribution</th><th>Models</th><th>Mean</th></tr></thead>
  <tbody>
    <tr><td>Binomial B(n,p)</td><td>successes in n independent trials</td><td>np</td></tr>
    <tr><td>Poisson (λ)</td><td>count of rare events in an interval</td><td>λ</td></tr>
  </tbody>
</table>
<div class="out"><b>Binomial:</b> P(X=k) = C(n,k) pᵏ (1−p)ⁿ⁻ᵏ. E.g. 10 coin flips, P(exactly 6 heads).<br><b>Poisson:</b> P(X=k) = e⁻λ λᵏ / k!. E.g. calls per hour at a call centre.</div>
<div class="note-ct">Use binomial when you have a fixed number of yes/no trials; use Poisson for counts of events over time or space when they are rare and independent.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Poisson is the limit of the binomial.</b> When n is large and p is small (many trials, rare success), the binomial B(n,p) is very well approximated by a Poisson with λ = np. This is why "rare events among many opportunities" — typos per page, defects per batch — are Poisson: they are secretly binomials with huge n. Knowing this connection lets you switch to the easier formula and explains where the Poisson comes from.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Compute distributions in Python</span><span class="lc-sub">Loops &amp; functions — build a binomial by hand.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Biến ngẫu nhiên rời rạc &amp; phân phối</h2>
<p class="lead">Một <strong>biến ngẫu nhiên</strong> gán một số cho mỗi kết quả. Biến rời rạc nhận giá trị đếm được, mô tả bởi hàm khối xác suất P(X=x). Hai đại lượng tóm tắt tâm và độ phân tán:</p>
<div class="out"><b>Kỳ vọng:</b> μ = E(X) = Σ x·P(x) · <b>Phương sai:</b> σ² = Σ (x−μ)²·P(x)</div>
<table>
  <thead><tr><th>Phân phối</th><th>Mô hình</th><th>Kỳ vọng</th></tr></thead>
  <tbody>
    <tr><td>Nhị thức B(n,p)</td><td>số thành công trong n phép thử độc lập</td><td>np</td></tr>
    <tr><td>Poisson (λ)</td><td>đếm biến cố hiếm trong một khoảng</td><td>λ</td></tr>
  </tbody>
</table>
<div class="out"><b>Nhị thức:</b> P(X=k) = C(n,k) pᵏ (1−p)ⁿ⁻ᵏ. Vd 10 lần tung xu, P(đúng 6 mặt ngửa).<br><b>Poisson:</b> P(X=k) = e⁻λ λᵏ / k!. Vd số cuộc gọi mỗi giờ ở tổng đài.</div>
<div class="note-ct">Dùng nhị thức khi có số phép thử có/không cố định; dùng Poisson cho đếm biến cố theo thời gian/không gian khi chúng hiếm và độc lập.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Poisson là giới hạn của nhị thức.</b> Khi n lớn và p nhỏ (nhiều phép thử, thành công hiếm), nhị thức B(n,p) được xấp xỉ rất tốt bởi Poisson với λ = np. Đây là lý do "biến cố hiếm giữa nhiều cơ hội" — lỗi chính tả mỗi trang, lỗi sản phẩm mỗi lô — đều là Poisson: chúng thực chất là nhị thức với n rất lớn. Biết mối liên hệ này cho phép bạn chuyển sang công thức dễ hơn và giải thích Poisson từ đâu ra.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Tính phân phối bằng Python</span><span class="lc-sub">Vòng lặp &amp; hàm — tự dựng phân phối nhị thức.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — PHÂN PHỐI LIÊN TỤC ══════════════════ */
    {
      title: 'Chapter 4 — Continuous distributions|||Chương 4 — Phân phối liên tục',
      description: 'Biến ngẫu nhiên liên tục, hàm mật độ, và phân phối chuẩn (Gauss) — chuẩn hóa với điểm z.',
      lessons: [
        {
          title: '4.1 — The normal distribution & z-scores|||4.1 — Phân phối chuẩn & điểm z',
          slug: 'mas291-phan-phoi-chuan',
          type: 'VIDEO',
          description: 'Đường cong hình chuông, quy tắc 68-95-99.7, và chuẩn hóa z = (x−μ)/σ để tra bảng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>The normal distribution — the bell curve</h2>
<p class="lead">The <strong>normal (Gaussian)</strong> distribution is the most important in statistics. Heights, measurement errors, and (crucially) sample means all follow it. It is symmetric about the mean μ, with spread set by σ.</p>
<div class="out"><b>The 68–95–99.7 rule:</b> about 68% of values lie within 1σ of μ, 95% within 2σ, 99.7% within 3σ.</div>
<h3>Standardising with z-scores</h3>
<p>Any normal can be converted to the <em>standard</em> normal (μ=0, σ=1) with a z-score, so one table works for all:</p>
<div class="out">z = (x − μ) / σ</div>
<p>A z of +2 means "2 standard deviations above the mean". Look z up in the standard normal table (or NORM.DIST in Excel) to get the probability.</p>
<div class="pitfall"><b>Trap:</b> continuous distributions give probability over an <em>interval</em>, not at a point — P(X = exactly 5) = 0. Always compute P(a ≤ X ≤ b) as an area under the curve.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Other continuous distributions you will meet.</b> The normal is not the only one. The <b>uniform</b> spreads probability evenly over an interval (a fair random number). The <b>exponential</b> models waiting times between random events (time until the next call) and pairs naturally with the Poisson. Recognising which distribution fits a situation is half of applied statistics — the normal is your default, but not your only tool.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Phân phối chuẩn — đường cong hình chuông</h2>
<p class="lead">Phân phối <strong>chuẩn (Gauss)</strong> là quan trọng nhất trong thống kê. Chiều cao, sai số đo, và (then chốt) trung bình mẫu đều tuân theo nó. Nó đối xứng quanh trung bình μ, độ phân tán đặt bởi σ.</p>
<div class="out"><b>Quy tắc 68–95–99.7:</b> khoảng 68% giá trị nằm trong 1σ quanh μ, 95% trong 2σ, 99.7% trong 3σ.</div>
<h3>Chuẩn hóa bằng điểm z</h3>
<p>Mọi phân phối chuẩn có thể đổi sang chuẩn <em>tắc</em> (μ=0, σ=1) bằng điểm z, để một bảng dùng cho tất cả:</p>
<div class="out">z = (x − μ) / σ</div>
<p>Điểm z bằng +2 nghĩa là "2 độ lệch chuẩn trên trung bình". Tra z trong bảng phân phối chuẩn tắc (hoặc NORM.DIST trong Excel) để lấy xác suất.</p>
<div class="pitfall"><b>Bẫy:</b> phân phối liên tục cho xác suất trên một <em>khoảng</em>, không phải tại một điểm — P(X = đúng 5) = 0. Luôn tính P(a ≤ X ≤ b) như diện tích dưới đường cong.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Các phân phối liên tục khác bạn sẽ gặp.</b> Chuẩn không phải duy nhất. Phân phối <b>đều (uniform)</b> rải xác suất đều trên một khoảng (một số ngẫu nhiên công bằng). Phân phối <b>mũ (exponential)</b> mô hình thời gian chờ giữa các biến cố ngẫu nhiên (thời gian tới cuộc gọi kế tiếp) và đi cặp tự nhiên với Poisson. Nhận ra phân phối nào hợp tình huống là một nửa của thống kê ứng dụng — chuẩn là mặc định, nhưng không phải công cụ duy nhất.</div>
</div>
`,
        },
        {
          title: 'Quiz 2 — Distributions|||Quiz 2 — Phân phối',
          slug: 'mas291-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra phân phối rời rạc và liên tục.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The expected value of a discrete X is…|||Kỳ vọng của biến rời rạc X là…', options: ['Σ P(x)', 'Σ x·P(x)', 'the largest x|||x lớn nhất', 'n·p always|||luôn là n·p'], correctIndex: 1, points: 1 },
              { question: 'The binomial distribution models…|||Phân phối nhị thức mô hình…', options: ['rare event counts|||đếm biến cố hiếm', 'successes in n independent yes/no trials|||số thành công trong n phép thử có/không độc lập', 'continuous measurements|||đo lường liên tục', 'sample means|||trung bình mẫu'], correctIndex: 1, points: 1 },
              { question: 'Under the normal distribution, about 95% of values lie within…|||Với phân phối chuẩn, khoảng 95% giá trị nằm trong…', options: ['1σ of the mean|||1σ quanh trung bình', '2σ of the mean|||2σ quanh trung bình', '3σ of the mean|||3σ quanh trung bình', 'the whole range|||toàn khoảng'], correctIndex: 1, points: 1 },
              { question: 'A z-score is computed as…|||Điểm z được tính bằng…', options: ['(x − μ) / σ', 'x · σ', 'μ / σ', 'x + μ'], correctIndex: 0, points: 1 },
              { question: 'For a continuous variable, P(X = exactly one value) is…|||Với biến liên tục, P(X = đúng một giá trị) là…', options: ['1', '0', '0.5', 'undefined|||không xác định'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — THỐNG KÊ MÔ TẢ ══════════════════ */
    {
      title: 'Chapter 5 — Descriptive statistics|||Chương 5 — Thống kê mô tả',
      description: 'Tóm tắt dữ liệu bằng số (trung bình, trung vị, độ lệch chuẩn) và bằng biểu đồ — đọc được "hình dạng" của dữ liệu.',
      lessons: [
        {
          title: '5.1 — Numerical summaries: centre & spread|||5.1 — Tóm tắt bằng số: tâm & độ phân tán',
          slug: 'mas291-thong-ke-mo-ta',
          type: 'VIDEO',
          description: 'Trung bình/trung vị/mode; phương sai & độ lệch chuẩn; tứ phân vị & IQR — hiểu bản chất, không chỉ công thức.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Describing data with numbers</h2>
<p class="lead">Before any inference, you must <em>understand the data in front of you</em>. Two questions summarise almost any dataset: where is its <strong>centre</strong>, and how <strong>spread out</strong> is it? Everything in this lesson answers one of those two.</p>

<h3>Measures of centre</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Mean</b> x̄ = (Σxᵢ)/n — the balance point. Sensitive to outliers: one huge value drags it.</div>
  <div class="lz-layer"><b>Median</b> — the middle value when sorted. Robust: outliers barely move it. Better for skewed data (incomes, house prices).</div>
  <div class="lz-layer"><b>Mode</b> — the most frequent value. The only centre that works for categorical data.</div>
</div>

<h3>Measures of spread</h3>
<p>Two datasets can share the same mean yet look completely different — {49,50,51} and {0,50,100} both average 50. Spread captures that difference.</p>
<div class="out"><b>Variance</b> s² = Σ(xᵢ − x̄)² / (n−1) · <b>Standard deviation</b> s = √s² (same units as the data)</div>
<p>Why divide by <b>n−1</b>, not n? Because we use the sample's own mean x̄ to measure spread, which slightly under-estimates the true spread; dividing by n−1 corrects that bias. (This is <em>Bessel's correction</em>.)</p>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Data:</b> 2, 4, 4, 6, 9<br>
1) Mean: x̄ = (2+4+4+6+9)/5 = 25/5 = <b>5</b><br>
2) Deviations: −3, −1, −1, 1, 4 → squared: 9, 1, 1, 1, 16 → sum = 28<br>
3) Variance: s² = 28/(5−1) = 28/4 = <b>7</b><br>
4) Std dev: s = √7 ≈ <b>2.65</b><br>
5) Median (sorted 2,4,4,6,9): middle = <b>4</b>; Mode = <b>4</b></div>

<h3>Quartiles &amp; the IQR</h3>
<p>Split sorted data into four parts: Q1 (25%), Q2 (median), Q3 (75%). The <strong>interquartile range</strong> IQR = Q3 − Q1 holds the middle 50% and drives the box plot.</p>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phát hiện điểm ngoại lai (outlier) bằng quy tắc 1.5·IQR.</b> A value is a suspected outlier if it is below Q1 − 1.5·IQR or above Q3 + 1.5·IQR. This is how box plots flag odd points, and how you should sanity-check any real dataset before trusting its mean. <em>Not in the FPT slides but essential for real analysis and your computer project.</em></div>

<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-256" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Compute mean/median/std in Python</span><span class="lc-sub">Data structures &amp; collections module.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Mô tả dữ liệu bằng số</h2>
<p class="lead">Trước mọi suy diễn, bạn phải <em>hiểu dữ liệu trước mắt</em>. Hai câu hỏi tóm tắt gần như mọi bộ dữ liệu: <strong>tâm</strong> của nó ở đâu, và nó <strong>phân tán</strong> ra sao? Mọi thứ trong bài này trả lời một trong hai câu đó.</p>

<h3>Các đại lượng đo tâm</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Trung bình</b> x̄ = (Σxᵢ)/n — điểm cân bằng. Nhạy với ngoại lai: một giá trị cực lớn kéo lệch nó.</div>
  <div class="lz-layer"><b>Trung vị</b> — giá trị ở giữa khi sắp xếp. Bền: ngoại lai gần như không làm nó nhúc nhích. Tốt hơn cho dữ liệu lệch (thu nhập, giá nhà).</div>
  <div class="lz-layer"><b>Mode (yếu vị)</b> — giá trị xuất hiện nhiều nhất. Đại lượng tâm duy nhất dùng được cho dữ liệu phân loại.</div>
</div>

<h3>Các đại lượng đo độ phân tán</h3>
<p>Hai bộ dữ liệu có thể cùng trung bình mà trông hoàn toàn khác — {49,50,51} và {0,50,100} đều trung bình 50. Độ phân tán nắm bắt khác biệt đó.</p>
<div class="out"><b>Phương sai</b> s² = Σ(xᵢ − x̄)² / (n−1) · <b>Độ lệch chuẩn</b> s = √s² (cùng đơn vị với dữ liệu)</div>
<p>Vì sao chia cho <b>n−1</b>, không phải n? Vì ta dùng chính trung bình mẫu x̄ để đo phân tán, điều này hơi ước lượng thiếu độ phân tán thật; chia cho n−1 sửa độ lệch đó. (Đây là <em>hiệu chỉnh Bessel</em>.)</p>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Dữ liệu:</b> 2, 4, 4, 6, 9<br>
1) Trung bình: x̄ = (2+4+4+6+9)/5 = 25/5 = <b>5</b><br>
2) Độ lệch: −3, −1, −1, 1, 4 → bình phương: 9, 1, 1, 1, 16 → tổng = 28<br>
3) Phương sai: s² = 28/(5−1) = 28/4 = <b>7</b><br>
4) Độ lệch chuẩn: s = √7 ≈ <b>2.65</b><br>
5) Trung vị (sắp 2,4,4,6,9): giữa = <b>4</b>; Mode = <b>4</b></div>

<h3>Tứ phân vị &amp; IQR</h3>
<p>Chia dữ liệu đã sắp thành bốn phần: Q1 (25%), Q2 (trung vị), Q3 (75%). <strong>Khoảng tứ phân vị</strong> IQR = Q3 − Q1 chứa 50% ở giữa và là cơ sở của biểu đồ hộp (box plot).</p>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phát hiện điểm ngoại lai bằng quy tắc 1.5·IQR.</b> Một giá trị bị nghi là ngoại lai nếu nhỏ hơn Q1 − 1.5·IQR hoặc lớn hơn Q3 + 1.5·IQR. Đây là cách box plot đánh dấu điểm bất thường, và là cách bạn nên kiểm tra tỉnh táo mọi dữ liệu thật trước khi tin vào trung bình của nó. <em>Không có trong slide FPT nhưng thiết yếu cho phân tích thật và computer project của bạn.</em></div>

<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-256" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Tính trung bình/trung vị/độ lệch chuẩn bằng Python</span><span class="lc-sub">Module cấu trúc dữ liệu &amp; collections.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — PHÂN PHỐI MẪU & CLT ══════════════════ */
    {
      title: 'Chapter 6 — Sampling distributions & the CLT|||Chương 6 — Phân phối mẫu & Định lý giới hạn trung tâm',
      description: 'Vì sao trung bình mẫu lại có phân phối chuẩn — chìa khóa mở toàn bộ phần suy diễn.',
      lessons: [
        {
          title: '6.1 — The sampling distribution & Central Limit Theorem|||6.1 — Phân phối mẫu & Định lý giới hạn trung tâm',
          slug: 'mas291-clt',
          type: 'VIDEO',
          description: 'Trung bình mẫu x̄ là biến ngẫu nhiên; CLT nói x̄ ~ chuẩn với sai số chuẩn σ/√n — nền của ước lượng & kiểm định.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>The idea that makes inference possible</h2>
<p class="lead">Here is the pivot of the whole course. Take a sample, compute its mean x̄. Take another sample, get a slightly different x̄. So <strong>x̄ itself is a random variable</strong> — it has its own distribution, called the <em>sampling distribution of the mean</em>. Understanding its shape is what lets us reason from a single sample back to the population.</p>

<h3>Two facts about the sampling distribution of x̄</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Its centre</b> equals the population mean: E(x̄) = μ. On average, the sample mean is right.</div>
  <div class="lz-layer"><b>Its spread</b> shrinks as the sample grows: the <em>standard error</em> is σ/√n. Bigger samples → more reliable means.</div>
</div>

<h3>The Central Limit Theorem (CLT)</h3>
<p>The CLT is one of the most remarkable results in mathematics: <strong>no matter what shape the population has</strong> (skewed, bimodal, anything), the sampling distribution of x̄ becomes approximately <strong>normal</strong> as n grows (a common rule of thumb: n ≥ 30).</p>
<div class="out">x̄ ≈ Normal( μ, σ/√n )  &nbsp;— for large n, regardless of the population's shape.</div>
<p>This is <em>why</em> the normal distribution is everywhere and why the whole inference toolkit (Chapters 7–8) works with a single formula.</p>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Given:</b> a population with μ = 100, σ = 15. We take samples of n = 25.<br>
Standard error of x̄: σ/√n = 15/√25 = 15/5 = <b>3</b><br>
So x̄ ~ Normal(100, 3). P(x̄ &gt; 106)?<br>
z = (106 − 100)/3 = 2.0 → P(z &gt; 2.0) ≈ <b>0.0228</b> (about 2.3%).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao σ/√n chứ không phải σ/n?</b> The variance of a sum of n independent variables adds up (Var(ΣX) = nσ²); dividing the sum by n to average shrinks variance by n², giving Var(x̄) = σ²/n, so the standard deviation is σ/√n. This "√n law" is why halving your error requires <em>four times</em> the data — a crucial fact when planning experiments and sample sizes. <em>The intuition behind the formula, deeper than the slides go.</em></div>

<div class="pitfall"><b>Trap:</b> the CLT is about the distribution of the <em>mean</em> x̄, not the individual data. A skewed population stays skewed; it is the <em>averages</em> that turn normal.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Ý tưởng khiến suy diễn trở nên khả thi</h2>
<p class="lead">Đây là bản lề của cả môn học. Lấy một mẫu, tính trung bình x̄. Lấy mẫu khác, được x̄ hơi khác. Vậy <strong>bản thân x̄ là một biến ngẫu nhiên</strong> — nó có phân phối riêng, gọi là <em>phân phối mẫu của trung bình</em>. Hiểu hình dạng của nó là điều cho phép ta lập luận từ một mẫu duy nhất ngược về tổng thể.</p>

<h3>Hai sự thật về phân phối mẫu của x̄</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Tâm của nó</b> bằng trung bình tổng thể: E(x̄) = μ. Trung bình thì mẫu cho kết quả đúng.</div>
  <div class="lz-layer"><b>Độ phân tán</b> co lại khi mẫu lớn hơn: <em>sai số chuẩn</em> là σ/√n. Mẫu lớn hơn → trung bình đáng tin hơn.</div>
</div>

<h3>Định lý giới hạn trung tâm (CLT)</h3>
<p>CLT là một trong những kết quả đáng kinh ngạc nhất của toán học: <strong>bất kể tổng thể có hình dạng gì</strong> (lệch, hai đỉnh, bất kỳ), phân phối mẫu của x̄ trở nên gần <strong>chuẩn</strong> khi n lớn (quy tắc kinh nghiệm phổ biến: n ≥ 30).</p>
<div class="out">x̄ ≈ Chuẩn( μ, σ/√n )  &nbsp;— với n lớn, bất kể hình dạng tổng thể.</div>
<p>Đây là <em>lý do</em> phân phối chuẩn ở khắp nơi và vì sao toàn bộ bộ công cụ suy diễn (Chương 7–8) chạy với một công thức duy nhất.</p>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Cho:</b> tổng thể có μ = 100, σ = 15. Ta lấy mẫu n = 25.<br>
Sai số chuẩn của x̄: σ/√n = 15/√25 = 15/5 = <b>3</b><br>
Vậy x̄ ~ Chuẩn(100, 3). P(x̄ &gt; 106)?<br>
z = (106 − 100)/3 = 2.0 → P(z &gt; 2.0) ≈ <b>0.0228</b> (khoảng 2.3%).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao là σ/√n chứ không phải σ/n?</b> Phương sai của tổng n biến độc lập cộng dồn (Var(ΣX) = nσ²); chia tổng cho n để lấy trung bình làm phương sai co lại n² lần, cho Var(x̄) = σ²/n, nên độ lệch chuẩn là σ/√n. "Luật √n" này là lý do muốn giảm một nửa sai số phải cần <em>gấp bốn</em> lượng dữ liệu — một sự thật then chốt khi thiết kế thí nghiệm và cỡ mẫu. <em>Trực giác đằng sau công thức, sâu hơn slide.</em></div>

<div class="pitfall"><b>Bẫy:</b> CLT nói về phân phối của <em>trung bình</em> x̄, không phải từng dữ liệu. Tổng thể lệch vẫn lệch; chính các <em>trung bình</em> mới trở nên chuẩn.</div>
</div>
`,
        },
        {
          title: 'Quiz 3 — Descriptive stats & sampling|||Quiz 3 — Thống kê mô tả & phân phối mẫu',
          slug: 'mas291-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra tóm tắt số, độ phân tán, và CLT — có câu suy luận.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'For skewed data with big outliers (e.g. incomes), the best measure of centre is…|||Với dữ liệu lệch có ngoại lai lớn (vd thu nhập), đại lượng đo tâm tốt nhất là…', options: ['the mean|||trung bình', 'the median|||trung vị', 'the mode|||mode', 'the range|||khoảng biến thiên'], correctIndex: 1, points: 1 },
              { question: 'Sample variance divides by n−1 (not n) in order to…|||Phương sai mẫu chia cho n−1 (không phải n) để…', options: ['make it larger|||làm nó lớn hơn', 'correct the bias from using the sample mean|||sửa độ lệch do dùng trung bình mẫu', 'match the median|||khớp trung vị', 'simplify the formula|||đơn giản công thức'], correctIndex: 1, points: 1 },
              { question: 'The standard error of the sample mean is…|||Sai số chuẩn của trung bình mẫu là…', options: ['σ', 'σ/√n', 'σ/n', 'σ·n'], correctIndex: 1, points: 1 },
              { question: 'The Central Limit Theorem says that, as n grows, the distribution of x̄ becomes…|||CLT nói rằng, khi n lớn, phân phối của x̄ trở nên…', options: ['skewed|||lệch', 'approximately normal regardless of the population shape|||gần chuẩn bất kể hình dạng tổng thể', 'uniform|||đều', 'identical to the population|||giống hệt tổng thể'], correctIndex: 1, points: 1 },
              { question: 'To halve the standard error, you must multiply the sample size by…|||Để giảm một nửa sai số chuẩn, phải nhân cỡ mẫu lên…', options: ['2', '4', '½', '√2'], correctIndex: 1, points: 1 },
              { question: 'A value beyond Q3 + 1.5·IQR is flagged as…|||Một giá trị vượt Q3 + 1.5·IQR bị đánh dấu là…', options: ['the median|||trung vị', 'a suspected outlier|||nghi ngờ ngoại lai', 'the mean|||trung bình', 'normal|||bình thường'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 7 — KHOẢNG TIN CẬY ══════════════════ */
    {
      title: 'Chapter 7 — Confidence intervals|||Chương 7 — Khoảng tin cậy',
      description: 'Ước lượng tham số tổng thể kèm biên sai số — và hiểu ĐÚNG "95% tin cậy" nghĩa là gì.',
      lessons: [
        {
          title: '7.1 — Estimating a mean with a margin of error|||7.1 — Ước lượng trung bình kèm biên sai số',
          slug: 'mas291-khoang-tin-cay',
          type: 'VIDEO',
          description: 'Ước lượng điểm vs khoảng; công thức x̄ ± z·(σ/√n); ý nghĩa thật của mức tin cậy; khi nào dùng phân phối t.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>From a sample to an interval you can trust</h2>
<p class="lead">A single number like x̄ = 100 is a <em>point estimate</em> — almost certainly not exactly right. A <strong>confidence interval</strong> is honest: it gives a range, plus how confident we are that the true μ lies inside it. This is the payoff of the CLT.</p>

<h3>The formula (mean, σ known)</h3>
<div class="out">CI = x̄ ± z<sub>α/2</sub> · (σ/√n)  &nbsp;— the part after ± is the <b>margin of error</b>.</div>
<p>The <b>critical value</b> z depends on the confidence level: 90% → 1.645, 95% → 1.96, 99% → 2.576. Higher confidence → wider interval (you trade precision for certainty).</p>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Given:</b> n = 36, x̄ = 50, σ = 6. Build a 95% CI for μ.<br>
Standard error: σ/√n = 6/6 = 1<br>
Margin of error: 1.96 × 1 = 1.96<br>
CI: 50 ± 1.96 = <b>(48.04, 51.96)</b><br>
Interpretation: we are 95% confident the true population mean μ lies between 48.04 and 51.96.</div>

<div class="pitfall"><b>The interpretation trap (examiners love this):</b> "95% confident" does NOT mean "95% probability μ is in this interval". μ is fixed. It means: <em>if we repeated the sampling many times, 95% of the intervals we built would contain μ.</em> Say it this way in the exam.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khi không biết σ — dùng phân phối t (Student's t).</b> In practice you almost never know the population σ, so you estimate it with the sample s. That extra uncertainty means the normal is too narrow; you use the <strong>t-distribution</strong> with (n−1) degrees of freedom instead of z. For large n, t ≈ z, but for small samples t is noticeably wider. Formula: x̄ ± t<sub>α/2, n−1</sub>·(s/√n). <em>The FPT slides focus on the z-case; this t-case is what real data actually needs — know both.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Từ một mẫu tới một khoảng đáng tin</h2>
<p class="lead">Một con số như x̄ = 100 là <em>ước lượng điểm</em> — gần như chắc chắn không đúng y hệt. <strong>Khoảng tin cậy</strong> thì trung thực: nó cho một khoảng, cộng mức tin cậy rằng μ thật nằm trong đó. Đây là thành quả của CLT.</p>

<h3>Công thức (trung bình, biết σ)</h3>
<div class="out">CI = x̄ ± z<sub>α/2</sub> · (σ/√n)  &nbsp;— phần sau dấu ± là <b>biên sai số</b>.</div>
<p><b>Giá trị tới hạn</b> z phụ thuộc mức tin cậy: 90% → 1.645, 95% → 1.96, 99% → 2.576. Tin cậy cao hơn → khoảng rộng hơn (đánh đổi độ chính xác lấy độ chắc chắn).</p>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Cho:</b> n = 36, x̄ = 50, σ = 6. Lập CI 95% cho μ.<br>
Sai số chuẩn: σ/√n = 6/6 = 1<br>
Biên sai số: 1.96 × 1 = 1.96<br>
CI: 50 ± 1.96 = <b>(48.04, 51.96)</b><br>
Diễn giải: ta tin cậy 95% rằng trung bình tổng thể μ nằm giữa 48.04 và 51.96.</div>

<div class="pitfall"><b>Bẫy diễn giải (người chấm rất thích):</b> "tin cậy 95%" KHÔNG nghĩa là "xác suất 95% μ nằm trong khoảng này". μ là cố định. Nó nghĩa là: <em>nếu lặp lại việc lấy mẫu nhiều lần, 95% các khoảng ta lập sẽ chứa μ.</em> Hãy diễn đạt đúng như vậy khi thi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khi không biết σ — dùng phân phối t (Student).</b> Thực tế bạn gần như không bao giờ biết σ tổng thể, nên phải ước lượng bằng s của mẫu. Độ bất định thêm đó khiến phân phối chuẩn quá hẹp; bạn dùng <strong>phân phối t</strong> với (n−1) bậc tự do thay cho z. Với n lớn, t ≈ z, nhưng với mẫu nhỏ t rộng hơn rõ rệt. Công thức: x̄ ± t<sub>α/2, n−1</sub>·(s/√n). <em>Slide FPT tập trung vào trường hợp z; trường hợp t này mới là thứ dữ liệu thật cần — biết cả hai.</em></div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — KIỂM ĐỊNH GIẢ THUYẾT ══════════════════ */
    {
      title: 'Chapter 8 — Hypothesis testing|||Chương 8 — Kiểm định giả thuyết',
      description: 'Quy trình chứng minh một khẳng định từ dữ liệu: H0/H1, thống kê kiểm định, p-value, và sai lầm loại I/II.',
      lessons: [
        {
          title: '8.1 — The logic of a hypothesis test|||8.1 — Logic của một bài kiểm định',
          slug: 'mas291-kiem-dinh-gia-thuyet',
          type: 'VIDEO',
          description: 'Giả thuyết H0 vs H1, mức ý nghĩa α, thống kê z/t, p-value và quy tắc quyết định; sai lầm loại I & II.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Proving a claim with data</h2>
<p class="lead">A hypothesis test answers: "could this result be just chance, or is it real?" It works like a courtroom — we <em>assume innocence</em> (the null hypothesis) and only reject it if the evidence is strong enough.</p>

<h3>The five steps (memorise this recipe)</h3>
<div class="lz-flow">
  <div class="lz-step">1 · State H₀ (no effect) &amp; H₁ (the claim)</div>
  <div class="lz-step">2 · Choose α (usually 0.05)</div>
  <div class="lz-step">3 · Compute the test statistic (z or t)</div>
  <div class="lz-step">4 · Find the p-value</div>
  <div class="lz-step">5 · Decide: p &lt; α → reject H₀</div>
</div>
<div class="out"><b>Test statistic (mean, σ known):</b> z = (x̄ − μ₀) / (σ/√n) — how many standard errors the sample mean is from the claimed μ₀.</div>
<p>The <strong>p-value</strong> is the probability of seeing data this extreme <em>if H₀ were true</em>. Small p (below α) = the data would be very surprising under H₀, so we reject H₀.</p>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Claim:</b> a machine fills bottles to μ₀ = 500ml. Sample n = 25, x̄ = 496, σ = 10. Test at α = 0.05 (two-tailed).<br>
z = (496 − 500) / (10/√25) = −4 / 2 = <b>−2.0</b><br>
Critical values ±1.96. Since |−2.0| &gt; 1.96 → <b>reject H₀</b>. p-value ≈ 0.0455 &lt; 0.05.<br>
Conclusion: there is significant evidence the machine is not filling to 500ml.</div>

<div class="pitfall"><b>Trap:</b> "fail to reject H₀" is NOT "H₀ is proven true" — only "not enough evidence against it". And statistical significance ≠ practical importance: with a huge n, a tiny, meaningless difference can be "significant".</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Sai lầm loại I & II và "sức mạnh" của kiểm định.</b> Two ways to be wrong: <b>Type I error</b> (α) = rejecting a true H₀ (a false alarm); <b>Type II error</b> (β) = failing to reject a false H₀ (a miss). <b>Power</b> = 1 − β = the chance of correctly detecting a real effect. Lowering α (fewer false alarms) raises β (more misses) — a fundamental trade-off. More data raises power without that cost. <em>The slides mention α; understanding β and power is what separates a real analyst — and it is a common viva question.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Chứng minh một khẳng định bằng dữ liệu</h2>
<p class="lead">Kiểm định giả thuyết trả lời: "kết quả này có thể chỉ do ngẫu nhiên, hay là thật?" Nó hoạt động như một phiên tòa — ta <em>giả định vô tội</em> (giả thuyết không) và chỉ bác bỏ nó nếu bằng chứng đủ mạnh.</p>

<h3>Năm bước (thuộc lòng công thức này)</h3>
<div class="lz-flow">
  <div class="lz-step">1 · Nêu H₀ (không hiệu ứng) &amp; H₁ (khẳng định)</div>
  <div class="lz-step">2 · Chọn α (thường 0.05)</div>
  <div class="lz-step">3 · Tính thống kê kiểm định (z hoặc t)</div>
  <div class="lz-step">4 · Tìm p-value</div>
  <div class="lz-step">5 · Quyết định: p &lt; α → bác bỏ H₀</div>
</div>
<div class="out"><b>Thống kê kiểm định (trung bình, biết σ):</b> z = (x̄ − μ₀) / (σ/√n) — trung bình mẫu cách μ₀ được khẳng định bao nhiêu sai số chuẩn.</div>
<p><strong>p-value</strong> là xác suất thấy dữ liệu cực đoan như thế này <em>nếu H₀ đúng</em>. p nhỏ (dưới α) = dữ liệu sẽ rất bất ngờ dưới H₀, nên ta bác bỏ H₀.</p>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Khẳng định:</b> một máy rót chai tới μ₀ = 500ml. Mẫu n = 25, x̄ = 496, σ = 10. Kiểm định ở α = 0.05 (hai phía).<br>
z = (496 − 500) / (10/√25) = −4 / 2 = <b>−2.0</b><br>
Giá trị tới hạn ±1.96. Vì |−2.0| &gt; 1.96 → <b>bác bỏ H₀</b>. p-value ≈ 0.0455 &lt; 0.05.<br>
Kết luận: có bằng chứng ý nghĩa rằng máy không rót đúng 500ml.</div>

<div class="pitfall"><b>Bẫy:</b> "không bác bỏ được H₀" KHÔNG phải "H₀ được chứng minh đúng" — chỉ là "chưa đủ bằng chứng chống lại nó". Và ý nghĩa thống kê ≠ ý nghĩa thực tế: với n rất lớn, một khác biệt nhỏ vô nghĩa vẫn có thể "ý nghĩa".</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Sai lầm loại I & II và "sức mạnh" của kiểm định.</b> Hai cách sai: <b>Sai lầm loại I</b> (α) = bác bỏ H₀ đúng (báo động giả); <b>Sai lầm loại II</b> (β) = không bác bỏ H₀ sai (bỏ sót). <b>Sức mạnh (power)</b> = 1 − β = khả năng phát hiện đúng một hiệu ứng thật. Giảm α (ít báo động giả) làm tăng β (nhiều bỏ sót) — một đánh đổi cơ bản. Nhiều dữ liệu hơn tăng power mà không phải trả cái giá đó. <em>Slide có nhắc α; hiểu β và power mới là thứ tách một nhà phân tích thật — và là câu vấn đáp phổ biến.</em></div>
</div>
`,
        },
        {
          title: 'Quiz 4 — Confidence intervals & hypothesis testing|||Quiz 4 — Khoảng tin cậy & kiểm định',
          slug: 'mas291-quiz-4',
          type: 'QUIZ',
          description: 'Kiểm tra ước lượng khoảng và kiểm định giả thuyết — gồm câu diễn giải & sai lầm loại I/II.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'A wider confidence interval results from…|||Một khoảng tin cậy rộng hơn đến từ…', options: ['a larger sample|||mẫu lớn hơn', 'a higher confidence level (e.g. 99% vs 95%)|||mức tin cậy cao hơn (vd 99% vs 95%)', 'a smaller σ|||σ nhỏ hơn', 'a point estimate|||ước lượng điểm'], correctIndex: 1, points: 1 },
              { question: '"95% confident" correctly means…|||"Tin cậy 95%" đúng nghĩa là…', options: ['there is 95% probability μ is in this one interval|||xác suất 95% μ nằm trong khoảng này', 'if we repeated sampling, 95% of such intervals would contain μ|||nếu lặp lấy mẫu, 95% các khoảng như vậy sẽ chứa μ', 'the sample is 95% of the population|||mẫu là 95% tổng thể', 'the error is 5%|||sai số là 5%'], correctIndex: 1, points: 1 },
              { question: 'When σ is unknown and estimated by s, you should use…|||Khi không biết σ và ước lượng bằng s, nên dùng…', options: ['the z-distribution|||phân phối z', 'the t-distribution with n−1 degrees of freedom|||phân phối t với n−1 bậc tự do', 'the binomial|||nhị thức', 'no distribution|||không phân phối nào'], correctIndex: 1, points: 1 },
              { question: 'A small p-value (p < α) means…|||p-value nhỏ (p < α) nghĩa là…', options: ['H₀ is definitely true|||H₀ chắc chắn đúng', 'the data would be very surprising if H₀ were true, so reject H₀|||dữ liệu sẽ rất bất ngờ nếu H₀ đúng, nên bác bỏ H₀', 'accept H₀|||chấp nhận H₀', 'the sample is too small|||mẫu quá nhỏ'], correctIndex: 1, points: 1 },
              { question: 'A Type I error is…|||Sai lầm loại I là…', options: ['failing to reject a false H₀|||không bác bỏ H₀ sai', 'rejecting a true H₀ (false alarm)|||bác bỏ H₀ đúng (báo động giả)', 'a calculation mistake|||lỗi tính toán', 'using the wrong mean|||dùng sai trung bình'], correctIndex: 1, points: 1 },
              { question: 'Statistical significance with a huge sample can still be…|||Ý nghĩa thống kê với mẫu rất lớn vẫn có thể…', options: ['practically meaningless|||vô nghĩa về thực tế', 'always important|||luôn quan trọng', 'impossible|||bất khả thi', 'a Type I error by definition|||theo định nghĩa là sai lầm loại I'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 9 — HỒI QUY & TƯƠNG QUAN ══════════════════ */
    {
      title: 'Chapter 9 — Regression & correlation|||Chương 9 — Hồi quy & tương quan',
      description: 'Đo và mô hình hóa quan hệ giữa hai biến: hệ số tương quan r và đường hồi quy tuyến tính.',
      lessons: [
        {
          title: '9.1 — Correlation & the linear regression line|||9.1 — Tương quan & đường hồi quy tuyến tính',
          slug: 'mas291-hoi-quy',
          type: 'VIDEO',
          description: 'Hệ số tương quan r (hướng & độ mạnh), đường bình phương tối thiểu ŷ = b₀ + b₁x, và R² — kèm bẫy "tương quan ≠ nhân quả".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Modelling the relationship between two variables</h2>
<p class="lead">Does study time relate to exam score? Regression turns that question into a line you can predict from. First we <em>measure</em> the relationship (correlation), then we <em>model</em> it (regression).</p>

<h3>Correlation coefficient r</h3>
<p>r ranges from −1 to +1 and captures the <strong>direction</strong> and <strong>strength</strong> of a linear relationship:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>r near +1</b> — strong positive: as x rises, y rises.</div>
  <div class="lz-layer"><b>r near −1</b> — strong negative: as x rises, y falls.</div>
  <div class="lz-layer"><b>r near 0</b> — no <em>linear</em> relationship (there could still be a curved one).</div>
</div>

<h3>The least-squares regression line</h3>
<div class="out">ŷ = b₀ + b₁x &nbsp;— where b₁ = slope, b₀ = intercept, chosen to minimise the total squared vertical distance from the points to the line.</div>
<p><b>R²</b> (= r² for simple regression) is the fraction of the variation in y explained by x. R² = 0.81 means "81% of the variation in y is explained by the model".</p>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Fitted line:</b> ŷ = 30 + 5x, where x = hours studied, y = exam score, with r = 0.9.<br>
Predict a student who studies x = 6 hours: ŷ = 30 + 5(6) = <b>60</b>.<br>
Slope interpretation: each extra hour of study is associated with +5 points.<br>
R² = 0.9² = 0.81 → 81% of score variation is explained by study time.</div>

<div class="pitfall"><b>The most important warning in all of statistics: correlation ≠ causation.</b> Ice-cream sales and drowning rates correlate strongly — because both rise in summer, not because ice cream causes drowning. A high r never proves x <em>causes</em> y.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kiểm tra phần dư (residuals) — mô hình có phù hợp không?</b> A regression line can be drawn through <em>any</em> data, even data that is not linear. Before trusting it, plot the <strong>residuals</strong> (actual − predicted). Good fit → residuals scattered randomly around 0. A pattern (a curve, a funnel shape) means the linear model is wrong for this data. This diagnostic step is what real analysts do and what your computer project should include. <em>Beyond the slides, but the difference between a plausible model and a fooled one.</em></div>

<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-550" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Fit regression in Python</span><span class="lc-sub">Data integration &amp; analysis with real datasets.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Mô hình hóa quan hệ giữa hai biến</h2>
<p class="lead">Thời gian học có liên quan điểm thi không? Hồi quy biến câu hỏi đó thành một đường thẳng để dự đoán. Trước tiên ta <em>đo</em> quan hệ (tương quan), rồi <em>mô hình hóa</em> nó (hồi quy).</p>

<h3>Hệ số tương quan r</h3>
<p>r nằm từ −1 tới +1, nắm bắt <strong>hướng</strong> và <strong>độ mạnh</strong> của quan hệ tuyến tính:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>r gần +1</b> — dương mạnh: x tăng, y tăng.</div>
  <div class="lz-layer"><b>r gần −1</b> — âm mạnh: x tăng, y giảm.</div>
  <div class="lz-layer"><b>r gần 0</b> — không có quan hệ <em>tuyến tính</em> (vẫn có thể có quan hệ cong).</div>
</div>

<h3>Đường hồi quy bình phương tối thiểu</h3>
<div class="out">ŷ = b₀ + b₁x &nbsp;— với b₁ = hệ số góc, b₀ = tung độ gốc, chọn sao cho tổng bình phương khoảng cách dọc từ các điểm tới đường là nhỏ nhất.</div>
<p><b>R²</b> (= r² với hồi quy đơn) là tỷ lệ biến thiên của y được x giải thích. R² = 0.81 nghĩa là "81% biến thiên của y được mô hình giải thích".</p>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Đường khớp:</b> ŷ = 30 + 5x, với x = số giờ học, y = điểm thi, r = 0.9.<br>
Dự đoán sinh viên học x = 6 giờ: ŷ = 30 + 5(6) = <b>60</b>.<br>
Diễn giải hệ số góc: mỗi giờ học thêm gắn với +5 điểm.<br>
R² = 0.9² = 0.81 → 81% biến thiên điểm được giải thích bởi thời gian học.</div>

<div class="pitfall"><b>Cảnh báo quan trọng nhất trong cả thống kê: tương quan ≠ nhân quả.</b> Doanh số kem và tỷ lệ đuối nước tương quan mạnh — vì cả hai đều tăng vào mùa hè, không phải vì kem gây đuối nước. r cao không bao giờ chứng minh x <em>gây ra</em> y.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kiểm tra phần dư (residuals) — mô hình có phù hợp không?</b> Một đường hồi quy có thể vẽ qua <em>bất kỳ</em> dữ liệu nào, kể cả dữ liệu không tuyến tính. Trước khi tin nó, hãy vẽ <strong>phần dư</strong> (thực tế − dự đoán). Khớp tốt → phần dư rải ngẫu nhiên quanh 0. Một mẫu hình (đường cong, hình phễu) nghĩa là mô hình tuyến tính sai với dữ liệu này. Bước chẩn đoán này là điều nhà phân tích thật làm và computer project của bạn nên có. <em>Ngoài slide, nhưng là khác biệt giữa một mô hình hợp lý và một mô hình bị đánh lừa.</em></div>

<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-550" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Khớp hồi quy bằng Python</span><span class="lc-sub">Tích hợp & phân tích dữ liệu với dữ liệu thật.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ NÂNG CAO ══════════════════ */
    {
      title: 'Advanced — Beyond the syllabus|||Nâng cao — Ngoài giáo trình',
      description: 'Toàn bộ chương này là học thêm ngoài giáo trình: dùng phần mềm thống kê thật và tư duy hướng khoa học dữ liệu.',
      lessons: [
        {
          title: 'A.1 — Statistics in Excel & Python (the computer project)|||A.1 — Thống kê trong Excel & Python (computer project)',
          slug: 'mas291-phan-mem-thong-ke',
          type: 'VIDEO',
          description: 'Dùng Excel/DDXL và Python (numpy/scipy/pandas) làm mọi thứ đã học — chuẩn bị cho computer project 15%.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson A.1</span>
<h2><span class="badge">★ Beyond the syllabus</span> Doing real statistics with software</h2>
<p class="lead">The syllabus requires a <strong>computer project (15%)</strong> and use of at least one statistical tool. This whole section is the practical, beyond-the-textbook skill that makes you employable: letting the computer do the arithmetic so you can focus on the thinking.</p>
<a class="link-card exphub" href="/exp-hub/mas291-cong-cu-thong-ke?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Set up Python &amp; Excel for statistics</span><span class="lc-sub">Install guide + Excel↔Python function map — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<h3>Excel + DDXL (the FPT default)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Descriptive:</b> <span class="badge">=AVERAGE()</span>, <span class="badge">=MEDIAN()</span>, <span class="badge">=STDEV.S()</span>, and Data → Data Analysis → Descriptive Statistics.</div>
  <div class="lz-layer"><b>Distributions:</b> <span class="badge">=NORM.DIST()</span>, <span class="badge">=BINOM.DIST()</span>, <span class="badge">=POISSON.DIST()</span>.</div>
  <div class="lz-layer"><b>Inference:</b> <span class="badge">=CONFIDENCE.NORM()</span>, <span class="badge">=T.TEST()</span>, and the Regression tool for the line + R².</div>
</div>

<h3>Python (the modern data-science path)</h3>
<pre><span class="tok-keyword">import</span> numpy <span class="tok-keyword">as</span> np
<span class="tok-keyword">from</span> scipy <span class="tok-keyword">import</span> stats

data = [2, 4, 4, 6, 9]
np.<span class="tok-function">mean</span>(data)          <span class="tok-comment"># 5.0</span>
np.<span class="tok-function">std</span>(data, ddof=1)   <span class="tok-comment"># 2.65 (ddof=1 → the n-1 sample std)</span>
stats.<span class="tok-function">ttest_1samp</span>(data, 5)  <span class="tok-comment"># one-sample t-test vs μ₀=5</span></pre>
<div class="note-ct">For your computer project: import a real dataset, describe it (centre, spread, a chart), check for outliers (1.5·IQR), run one inference (a CI or a test), and — if fitting a line — plot the residuals. That structure earns full marks and mirrors real analysis.</div>

<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-550" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Data integration & analysis in Python</span><span class="lc-sub">Load, clean and analyse real datasets.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.1</span>
<h2><span class="badge">★ Ngoài giáo trình</span> Làm thống kê thật bằng phần mềm</h2>
<p class="lead">Syllabus yêu cầu một <strong>computer project (15%)</strong> và dùng ít nhất một công cụ thống kê. Cả phần này là kỹ năng thực hành, ngoài giáo trình, làm bạn dễ xin việc: để máy tính lo phần số học để bạn tập trung vào tư duy.</p>
<a class="link-card exphub" href="/exp-hub/mas291-cong-cu-thong-ke?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài Python &amp; Excel cho thống kê</span><span class="lc-sub">Hướng dẫn cài + bảng ánh xạ hàm Excel↔Python — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>

<h3>Excel + DDXL (mặc định của FPT)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Mô tả:</b> <span class="badge">=AVERAGE()</span>, <span class="badge">=MEDIAN()</span>, <span class="badge">=STDEV.S()</span>, và Data → Data Analysis → Descriptive Statistics.</div>
  <div class="lz-layer"><b>Phân phối:</b> <span class="badge">=NORM.DIST()</span>, <span class="badge">=BINOM.DIST()</span>, <span class="badge">=POISSON.DIST()</span>.</div>
  <div class="lz-layer"><b>Suy diễn:</b> <span class="badge">=CONFIDENCE.NORM()</span>, <span class="badge">=T.TEST()</span>, và công cụ Regression cho đường + R².</div>
</div>

<h3>Python (con đường khoa học dữ liệu hiện đại)</h3>
<pre><span class="tok-keyword">import</span> numpy <span class="tok-keyword">as</span> np
<span class="tok-keyword">from</span> scipy <span class="tok-keyword">import</span> stats

data = [2, 4, 4, 6, 9]
np.<span class="tok-function">mean</span>(data)          <span class="tok-comment"># 5.0</span>
np.<span class="tok-function">std</span>(data, ddof=1)   <span class="tok-comment"># 2.65 (ddof=1 → độ lệch chuẩn mẫu n-1)</span>
stats.<span class="tok-function">ttest_1samp</span>(data, 5)  <span class="tok-comment"># kiểm định t một mẫu vs μ₀=5</span></pre>
<div class="note-ct">Cho computer project: nạp một dữ liệu thật, mô tả nó (tâm, phân tán, một biểu đồ), kiểm ngoại lai (1.5·IQR), chạy một suy diễn (một CI hoặc một kiểm định), và — nếu khớp đường — vẽ phần dư. Cấu trúc đó ăn điểm tối đa và phản ánh phân tích thật.</div>

<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-550" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Tích hợp & phân tích dữ liệu bằng Python</span><span class="lc-sub">Nạp, làm sạch và phân tích dữ liệu thật.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 5 — Regression & applications|||Quiz 5 — Hồi quy & ứng dụng',
          slug: 'mas291-quiz-5',
          type: 'QUIZ',
          description: 'Kiểm tra tương quan, hồi quy và diễn giải — gồm bẫy nhân quả.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A correlation coefficient r = −0.95 indicates…|||Hệ số tương quan r = −0.95 cho biết…', options: ['a weak relationship|||quan hệ yếu', 'a strong negative linear relationship|||quan hệ tuyến tính âm mạnh', 'no relationship|||không quan hệ', 'causation|||nhân quả'], correctIndex: 1, points: 1 },
              { question: 'In ŷ = 30 + 5x, the slope 5 means…|||Trong ŷ = 30 + 5x, hệ số góc 5 nghĩa là…', options: ['y is always 5|||y luôn bằng 5', 'each +1 in x is associated with +5 in ŷ|||mỗi +1 của x gắn với +5 của ŷ', 'x is 5 times y|||x gấp 5 lần y', 'the intercept is 5|||tung độ gốc là 5'], correctIndex: 1, points: 1 },
              { question: 'R² = 0.81 means…|||R² = 0.81 nghĩa là…', options: ['81% of the y-variation is explained by the model|||81% biến thiên của y được mô hình giải thích', 'the slope is 0.81|||hệ số góc là 0.81', 'r = 0.81', '81% of points lie on the line|||81% điểm nằm trên đường'], correctIndex: 0, points: 1 },
              { question: 'A strong correlation between two variables proves…|||Tương quan mạnh giữa hai biến chứng minh…', options: ['that one causes the other|||cái này gây ra cái kia', 'only that they move together linearly — not causation|||chỉ rằng chúng biến thiên cùng nhau tuyến tính — không phải nhân quả', 'nothing at all|||không gì cả', 'the mean|||trung bình'], correctIndex: 1, points: 1 },
              { question: 'Before trusting a fitted line, a good analyst plots the… (beyond-syllabus)|||Trước khi tin một đường khớp, nhà phân tích tốt vẽ… (ngoài giáo trình)', options: ['the mean|||trung bình', 'the residuals to check the fit|||phần dư để kiểm độ khớp', 'the median|||trung vị', 'a pie chart|||biểu đồ tròn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* END-SECTIONS-MARKER */
  ],
};
