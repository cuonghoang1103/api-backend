/**
 * MAS291 — Statistics and Probability (Xác suất thống kê). Kỳ 4.
 * Bám syllabus FPTU (sylID 13136, 9 CLO) + Montgomery & Runger. Tiên quyết: MAE101/MAC101.
 * Song ngữ EN/VN. CHUẨN SÂU: mỗi bài có BỘ CÔNG THỨC ĐẦY ĐỦ (.formula) + giải nghĩa ký hiệu
 * + cách dùng + nhiều ví dụ giải từng bước + ★ ngoài giáo trình. Công thức Unicode.
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
    shortDescription: 'The mathematics of uncertainty and data — taught in full: every formula you need, what each symbol means, when to use it, and step-by-step worked examples. Probability, distributions, descriptive statistics, and inference (estimation, testing, regression).|||Toán học của sự bất định và dữ liệu — dạy đầy đủ: mọi công thức bạn cần, ý nghĩa từng ký hiệu, khi nào dùng, và ví dụ giải từng bước. Xác suất, phân phối, thống kê mô tả, và suy diễn (ước lượng, kiểm định, hồi quy).',
    description: 'Môn xác suất và thống kê cho kỹ thuật: nguyên lý xác suất, các phân phối (rời rạc & liên tục), thống kê mô tả, và suy diễn thống kê — ước lượng, khoảng tin cậy, kiểm định giả thuyết, hồi quy & tương quan. Mỗi bài trình bày ĐẦY ĐỦ công thức, giải nghĩa từng ký hiệu, cách áp dụng, và ví dụ giải chi tiết. Thực hành bằng Excel/Python. Tiên quyết: MAE101 hoặc MAC101.',
    whatYouLearn: 'Toàn bộ công thức xác suất (cổ điển, cộng, có điều kiện, nhân, Bayes, tổ hợp); kỳ vọng & phương sai; phân phối nhị thức, Poisson, chuẩn (kèm chuẩn hóa z); thống kê mô tả đầy đủ (trung bình, trung vị, mode, phương sai, độ lệch chuẩn, tứ phân vị, IQR, hệ số biến thiên); phân phối mẫu & CLT; khoảng tin cậy (z & t, tỷ lệ, cỡ mẫu); kiểm định giả thuyết (z-test, t-test, p-value); hồi quy tuyến tính (r, hệ số góc, R²) — mỗi công thức kèm cách dùng và ví dụ.',
    requirements: 'Tiên quyết: đạt MAE101 hoặc MAC101 (vững giải tích: đạo hàm, tích phân, tổng Σ). Cần Microsoft Excel (khuyên có add-on DDXL) hoặc Python (numpy/scipy/pandas).',
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
<p>This course is formula-heavy by design — but every formula here comes with the meaning of each symbol, when to use it, and a fully worked example. You will move from "what is the chance of…" up to "the data proves…".</p>
<h3>Course map</h3>
<div class="lz-map">
  <div class="lz-stage">Probability</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Role of statistics &amp; data</div><div class="lz-nsub">Populations · samples · variables</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Probability</div><div class="lz-nsub">Rules · conditional · Bayes · counting</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Discrete distributions</div><div class="lz-nsub">Binomial · Poisson · hypergeometric · geometric</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Continuous distributions</div><div class="lz-nsub">Normal · PDF/CDF · uniform · exponential · approximation</div></div></div>
  <div class="lz-stage">Statistics</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Descriptive statistics</div><div class="lz-nsub">All summary measures</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Sampling &amp; the CLT</div><div class="lz-nsub">SE · x̄ · proportions · differences</div></div></div>
  <div class="lz-stage">Inference</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Confidence intervals</div><div class="lz-nsub">z, t, proportion, sample size, one-sided</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Hypothesis testing</div><div class="lz-nsub">z-test · t-test · p-value</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Two-sample inference</div><div class="lz-nsub">Two means · two proportions · paired t</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Regression &amp; correlation</div><div class="lz-nsub">r · slope · R² · ANOVA · tests on β</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Statistics in Python/Excel</div><div class="lz-nsub">The computer project</div></div></div>
</div>
<div class="callout ok">Statistics is learned by computing. Every lesson lists the complete formula set, explains each symbol, and works a full example — then check it in Excel or Python.</div>
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
<p>Môn này nhiều công thức là chủ ý — nhưng mỗi công thức ở đây đều kèm ý nghĩa từng ký hiệu, khi nào dùng, và một ví dụ giải đầy đủ. Bạn sẽ đi từ "khả năng xảy ra là…" lên tới "dữ liệu chứng minh…".</p>
<h3>Bản đồ môn học</h3>
<div class="lz-map">
  <div class="lz-stage">Xác suất</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Vai trò thống kê &amp; dữ liệu</div><div class="lz-nsub">Tổng thể · mẫu · biến</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Xác suất</div><div class="lz-nsub">Quy tắc · có điều kiện · Bayes · tổ hợp</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Phân phối rời rạc</div><div class="lz-nsub">Nhị thức · Poisson · siêu bội · hình học</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Phân phối liên tục</div><div class="lz-nsub">Chuẩn · PDF/CDF · đều · mũ · xấp xỉ</div></div></div>
  <div class="lz-stage">Thống kê</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Thống kê mô tả</div><div class="lz-nsub">Mọi đại lượng tóm tắt</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Phân phối mẫu &amp; CLT</div><div class="lz-nsub">SE · x̄ · tỷ lệ · hiệu</div></div></div>
  <div class="lz-stage">Suy diễn</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Khoảng tin cậy</div><div class="lz-nsub">z, t, tỷ lệ, cỡ mẫu, một phía</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm định giả thuyết</div><div class="lz-nsub">z-test · t-test · p-value</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Suy luận hai mẫu</div><div class="lz-nsub">Hai trung bình · hai tỷ lệ · mẫu cặp</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Hồi quy &amp; tương quan</div><div class="lz-nsub">r · hệ số góc · R² · ANOVA · kiểm định β</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Thống kê trong Python/Excel</div><div class="lz-nsub">Computer project</div></div></div>
</div>
<div class="callout ok">Thống kê học bằng cách tính. Mỗi bài liệt kê BỘ CÔNG THỨC ĐẦY ĐỦ, giải nghĩa từng ký hiệu, và giải một ví dụ trọn vẹn — rồi kiểm bằng Excel hoặc Python.</div>
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
<div class="note-ct">You are allowed a formula sheet and calculator in most assessments — but you must know <em>which</em> formula applies and <em>how</em> to use it. That judgment is exactly what this course drills.</div>
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
<div class="note-ct">Hầu hết bài kiểm cho phép mang bảng công thức và máy tính — nhưng bạn phải biết công thức <em>nào</em> áp dụng và <em>cách</em> dùng nó. Đúng phán đoán đó là điều môn này rèn.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — VAI TRÒ THỐNG KÊ ══════════════════ */
    {
      title: 'Chapter 1 — The role of statistics & data|||Chương 1 — Vai trò của thống kê & dữ liệu',
      description: 'Tổng thể vs mẫu, các loại biến, hai nhánh thống kê, và ký hiệu tổng Σ.',
      lessons: [
        {
          title: '1.1 — Populations, samples, variables & Σ notation|||1.1 — Tổng thể, mẫu, biến & ký hiệu Σ',
          slug: 'mas291-tong-the-mau',
          type: 'VIDEO',
          description: 'Tổng thể/mẫu, tham số/thống kê, loại biến, và ký hiệu tổng Σ dùng suốt môn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The foundations — populations, samples &amp; variables</h2>
<p class="lead">Statistics starts with a simple idea: we rarely measure everyone, so we take a <strong>sample</strong> and use it to say something about the whole <strong>population</strong>. Getting these words and symbols right prevents most beginner mistakes.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Population</b> — the entire group we care about. A number describing it is a <em>parameter</em>: mean <b>μ</b> (mu), standard deviation <b>σ</b> (sigma), proportion <b>p</b>.</div>
  <div class="lz-layer"><b>Sample</b> — the subset we actually measure. A number describing it is a <em>statistic</em>: mean <b>x̄</b> (x-bar), standard deviation <b>s</b>, proportion <b>p̂</b> (p-hat).</div>
  <div class="lz-layer"><b>Descriptive statistics</b> — summarising the data we have (Chapter 5).</div>
  <div class="lz-layer"><b>Inferential statistics</b> — drawing conclusions about the population from the sample (Chapters 6–9).</div>
</div>
<h3>The Σ (summation) notation — read it fluently</h3>
<p>Every formula in this course uses Σ, the Greek capital sigma, meaning "add them all up". You must read it fluently:</p>
<div class="formula"><span class="lbl">Summation</span>Σ xᵢ  (i = 1 → n)  =  x₁ + x₂ + x₃ + … + xₙ</div>
<div class="out"><b>How to use it — worked example.</b> Data: 3, 5, 8.<br>
• Σ xᵢ = 3 + 5 + 8 = <b>16</b><br>
• Σ xᵢ² = 3² + 5² + 8² = 9 + 25 + 64 = <b>98</b>  (square each, then add)<br>
• (Σ xᵢ)² = 16² = <b>256</b>  (add first, then square)<br>
Note Σ xᵢ² ≠ (Σ xᵢ)² — this difference matters in the variance formula.</div>
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
<p class="lead">Thống kê bắt đầu từ một ý đơn giản: ta hiếm khi đo được tất cả, nên lấy một <strong>mẫu</strong> và dùng nó để nói điều gì đó về cả <strong>tổng thể</strong>. Dùng đúng các từ và ký hiệu này tránh được hầu hết lỗi người mới.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Tổng thể</b> — toàn bộ nhóm ta quan tâm. Con số mô tả nó là <em>tham số</em>: trung bình <b>μ</b> (muy), độ lệch chuẩn <b>σ</b> (xích-ma), tỷ lệ <b>p</b>.</div>
  <div class="lz-layer"><b>Mẫu</b> — tập con ta thực sự đo. Con số mô tả nó là <em>thống kê</em>: trung bình <b>x̄</b> (x-ngang), độ lệch chuẩn <b>s</b>, tỷ lệ <b>p̂</b> (p-mũ).</div>
  <div class="lz-layer"><b>Thống kê mô tả</b> — tóm tắt dữ liệu ta có (Chương 5).</div>
  <div class="lz-layer"><b>Thống kê suy diễn</b> — rút kết luận về tổng thể từ mẫu (Chương 6–9).</div>
</div>
<h3>Ký hiệu tổng Σ — đọc cho trôi chảy</h3>
<p>Mọi công thức trong môn đều dùng Σ, chữ xích-ma hoa Hy Lạp, nghĩa là "cộng tất cả lại". Bạn phải đọc nó trôi chảy:</p>
<div class="formula"><span class="lbl">Tổng</span>Σ xᵢ  (i = 1 → n)  =  x₁ + x₂ + x₃ + … + xₙ</div>
<div class="out"><b>Cách dùng — ví dụ giải.</b> Dữ liệu: 3, 5, 8.<br>
• Σ xᵢ = 3 + 5 + 8 = <b>16</b><br>
• Σ xᵢ² = 3² + 5² + 8² = 9 + 25 + 64 = <b>98</b>  (bình phương từng số, rồi cộng)<br>
• (Σ xᵢ)² = 16² = <b>256</b>  (cộng trước, rồi bình phương)<br>
Lưu ý Σ xᵢ² ≠ (Σ xᵢ)² — khác biệt này quan trọng trong công thức phương sai.</div>
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
      description: 'Bộ công thức xác suất đầy đủ: cổ điển, quy tắc cộng/nhân, có điều kiện, độc lập, Bayes và tổ hợp.',
      lessons: [
        {
          title: '2.1 — All the probability rules (with how to use each)|||2.1 — Toàn bộ quy tắc xác suất (kèm cách dùng)',
          slug: 'mas291-xac-suat-co-ban',
          type: 'VIDEO',
          description: 'Xác suất cổ điển, biến cố đối, cộng, có điều kiện, nhân, độc lập — công thức đầy đủ + cách chọn + ví dụ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Probability — the complete rule set</h2>
<p class="lead">Probability assigns a number between 0 and 1 to how likely an event is. Here is <strong>every rule you need</strong>, each with the symbols explained and when to reach for it.</p>

<h3>The full formula set</h3>
<div class="formula"><span class="lbl">Classical probability</span>P(A) = (number of favourable outcomes) / (total number of outcomes) = n(A) / n(S)</div>
<div class="formula"><span class="lbl">Complement</span>P(A′) = 1 − P(A)</div>
<div class="formula"><span class="lbl">Addition rule (general)</span>P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</div>
<div class="formula"><span class="lbl">Conditional probability</span>P(A | B) = P(A ∩ B) / P(B),  with P(B) &gt; 0</div>
<div class="formula"><span class="lbl">Multiplication rule (general)</span>P(A ∩ B) = P(B) · P(A | B) = P(A) · P(B | A)</div>
<div class="formula"><span class="lbl">If A, B independent</span>P(A ∩ B) = P(A) · P(B)   and   P(A | B) = P(A)</div>

<h3>What the symbols mean</h3>
<table>
  <thead><tr><th>Symbol</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>S</td><td>sample space — the set of all possible outcomes</td></tr>
    <tr><td>A ∪ B</td><td>"A or B" (union) — at least one happens</td></tr>
    <tr><td>A ∩ B</td><td>"A and B" (intersection) — both happen</td></tr>
    <tr><td>A′</td><td>complement — "not A"</td></tr>
    <tr><td>P(A|B)</td><td>probability of A given that B has happened</td></tr>
  </tbody>
</table>

<h3>How to choose the right rule</h3>
<div class="lz-stack">
  <div class="lz-layer">Question says <b>"or"</b> → addition rule. If the events cannot both happen (mutually exclusive, A ∩ B = ∅), the −P(A∩B) term is 0.</div>
  <div class="lz-layer">Question says <b>"and" / "both"</b> → multiplication rule. If independent, just multiply.</div>
  <div class="lz-layer">Question says <b>"given / if / among those who…"</b> → conditional probability.</div>
  <div class="lz-layer">Question says <b>"not / at least one"</b> → complement is usually the shortcut.</div>
</div>

<h3>Ví dụ có lời giải · Worked examples</h3>
<div class="out"><b>Example 1 (addition).</b> Draw one card from 52. P(King or Heart)?<br>
P(King) = 4/52, P(Heart) = 13/52, P(King ∩ Heart) = 1/52 (the King of Hearts).<br>
P(King ∪ Heart) = 4/52 + 13/52 − 1/52 = 16/52 = <b>4/13 ≈ 0.308</b>. Subtract the overlap once so it is not double-counted.</div>
<div class="out"><b>Example 2 (independent "and").</b> A fair coin and a fair die. P(Heads AND a 6)?<br>
Independent → P = P(H)·P(6) = (1/2)·(1/6) = <b>1/12 ≈ 0.083</b>.</div>
<div class="out"><b>Example 3 (complement, "at least one").</b> Roll a die 3 times. P(at least one 6)?<br>
Easier via complement: P(no 6 in one roll) = 5/6.<br>
P(no 6 in 3 rolls) = (5/6)³ = 125/216.<br>
P(at least one 6) = 1 − 125/216 = <b>91/216 ≈ 0.421</b>.</div>
<div class="out"><b>Example 4 (conditional).</b> In a class, 60% pass Math (M), 40% pass both Math and English (M∩E). Among those who passed Math, what fraction passed English?<br>
P(E | M) = P(E ∩ M) / P(M) = 0.40 / 0.60 = <b>0.667</b> (about two-thirds).</div>

<div class="pitfall"><b>Trap:</b> do not confuse <b>independent</b> (can happen together, one does not affect the other) with <b>mutually exclusive</b> (cannot happen together, A ∩ B = 0). They are opposites, not synonyms.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Counting with permutations &amp; combinations.</b> When outcomes are equally likely but numerous, you count them with:</p>
<div class="formula"><span class="lbl">Permutation (order matters)</span>ₙPᵣ = n! / (n − r)!</div>
<div class="formula"><span class="lbl">Combination (order does not matter)</span>ₙCᵣ = n! / [ r! (n − r)! ]</div>
E.g. the chance of one specific 6-number lottery ticket is 1 / C(45,6). This combinatorics is the engine of the binomial distribution in Chapter 3.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Xác suất — bộ quy tắc đầy đủ</h2>
<p class="lead">Xác suất gán một số giữa 0 và 1 cho khả năng một biến cố xảy ra. Đây là <strong>mọi quy tắc bạn cần</strong>, mỗi cái kèm giải nghĩa ký hiệu và khi nào dùng.</p>

<h3>Bộ công thức đầy đủ</h3>
<div class="formula"><span class="lbl">Xác suất cổ điển</span>P(A) = (số kết quả thuận lợi) / (tổng số kết quả) = n(A) / n(S)</div>
<div class="formula"><span class="lbl">Biến cố đối</span>P(A′) = 1 − P(A)</div>
<div class="formula"><span class="lbl">Quy tắc cộng (tổng quát)</span>P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</div>
<div class="formula"><span class="lbl">Xác suất có điều kiện</span>P(A | B) = P(A ∩ B) / P(B),  với P(B) &gt; 0</div>
<div class="formula"><span class="lbl">Quy tắc nhân (tổng quát)</span>P(A ∩ B) = P(B) · P(A | B) = P(A) · P(B | A)</div>
<div class="formula"><span class="lbl">Nếu A, B độc lập</span>P(A ∩ B) = P(A) · P(B)   và   P(A | B) = P(A)</div>

<h3>Ý nghĩa các ký hiệu</h3>
<table>
  <thead><tr><th>Ký hiệu</th><th>Ý nghĩa</th></tr></thead>
  <tbody>
    <tr><td>S</td><td>không gian mẫu — tập tất cả kết quả có thể</td></tr>
    <tr><td>A ∪ B</td><td>"A hoặc B" (hợp) — ít nhất một xảy ra</td></tr>
    <tr><td>A ∩ B</td><td>"A và B" (giao) — cả hai xảy ra</td></tr>
    <tr><td>A′</td><td>biến cố đối — "không A"</td></tr>
    <tr><td>P(A|B)</td><td>xác suất A khi biết B đã xảy ra</td></tr>
  </tbody>
</table>

<h3>Cách chọn đúng quy tắc</h3>
<div class="lz-stack">
  <div class="lz-layer">Đề nói <b>"hoặc"</b> → quy tắc cộng. Nếu hai biến cố không thể cùng xảy ra (xung khắc, A ∩ B = ∅), số hạng −P(A∩B) bằng 0.</div>
  <div class="lz-layer">Đề nói <b>"và / cả hai"</b> → quy tắc nhân. Nếu độc lập, chỉ việc nhân.</div>
  <div class="lz-layer">Đề nói <b>"biết / nếu / trong số những người…"</b> → xác suất có điều kiện.</div>
  <div class="lz-layer">Đề nói <b>"không / ít nhất một"</b> → biến cố đối thường là đường tắt.</div>
</div>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Ví dụ 1 (cộng).</b> Rút một lá từ 52. P(K hoặc Cơ)?<br>
P(K) = 4/52, P(Cơ) = 13/52, P(K ∩ Cơ) = 1/52 (lá K Cơ).<br>
P(K ∪ Cơ) = 4/52 + 13/52 − 1/52 = 16/52 = <b>4/13 ≈ 0.308</b>. Trừ phần giao một lần để không đếm hai lần.</div>
<div class="out"><b>Ví dụ 2 ("và" độc lập).</b> Một đồng xu và một xúc xắc cân đối. P(mặt ngửa VÀ ra 6)?<br>
Độc lập → P = P(N)·P(6) = (1/2)·(1/6) = <b>1/12 ≈ 0.083</b>.</div>
<div class="out"><b>Ví dụ 3 (biến cố đối, "ít nhất một").</b> Gieo xúc xắc 3 lần. P(ít nhất một lần ra 6)?<br>
Dễ hơn qua biến cố đối: P(không ra 6 trong một lần) = 5/6.<br>
P(không ra 6 cả 3 lần) = (5/6)³ = 125/216.<br>
P(ít nhất một lần 6) = 1 − 125/216 = <b>91/216 ≈ 0.421</b>.</div>
<div class="out"><b>Ví dụ 4 (có điều kiện).</b> Một lớp: 60% đậu Toán (M), 40% đậu cả Toán và Anh (M∩E). Trong số đậu Toán, bao nhiêu phần đậu Anh?<br>
P(E | M) = P(E ∩ M) / P(M) = 0.40 / 0.60 = <b>0.667</b> (khoảng hai phần ba).</div>

<div class="pitfall"><b>Bẫy:</b> đừng nhầm <b>độc lập</b> (có thể cùng xảy ra, cái này không ảnh hưởng cái kia) với <b>xung khắc</b> (không thể cùng xảy ra, A ∩ B = 0). Chúng đối lập, không đồng nghĩa.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đếm bằng chỉnh hợp &amp; tổ hợp.</b> Khi các kết quả đồng khả năng nhưng nhiều, ta đếm bằng:</p>
<div class="formula"><span class="lbl">Chỉnh hợp (thứ tự quan trọng)</span>ₙPᵣ = n! / (n − r)!</div>
<div class="formula"><span class="lbl">Tổ hợp (thứ tự không quan trọng)</span>ₙCᵣ = n! / [ r! (n − r)! ]</div>
Vd khả năng trúng một vé xổ số 6 số cụ thể là 1 / C(45,6). Tổ hợp này là động cơ của phân phối nhị thức ở Chương 3.</div>
</div>
`,
        },
        {
          title: '2.2 — Conditional probability, total probability & Bayes|||2.2 — Xác suất có điều kiện, xác suất toàn phần & Bayes',
          slug: 'mas291-bayes',
          type: 'VIDEO',
          description: 'Công thức xác suất toàn phần và định lý Bayes đầy đủ, cách dùng, và ví dụ xét nghiệm y khoa giải từng bước.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Total probability &amp; Bayes' theorem</h2>
<p class="lead">These two formulas let you reason backwards — from "the test is positive" to "the probability I am actually sick". They are the most powerful, and most misunderstood, tools in the chapter.</p>

<h3>The formulas</h3>
<div class="formula"><span class="lbl">Law of total probability</span>P(B) = P(B | A₁)·P(A₁) + P(B | A₂)·P(A₂) + … + P(B | Aₖ)·P(Aₖ)</div>
<div class="formula"><span class="lbl">Bayes' theorem</span>P(A | B) = [ P(B | A) · P(A) ] / P(B)</div>
<p>where A₁…Aₖ partition the sample space (exactly one must occur). Total probability builds the denominator P(B); Bayes then flips a known conditional into the one you want.</p>

<h3>How to use Bayes — a fixed procedure</h3>
<div class="lz-flow">
  <div class="lz-step">1 · Write the prior P(A) &amp; the reverse conditional P(B|A)</div>
  <div class="lz-step">2 · Build P(B) with the law of total probability</div>
  <div class="lz-step">3 · Plug into Bayes to get P(A|B)</div>
</div>

<h3>Ví dụ có lời giải · The medical-test example (do this by hand)</h3>
<div class="out"><b>Setup:</b> A disease affects 1% of people: P(D) = 0.01, so P(D′) = 0.99. A test is 99% accurate: P(+|D) = 0.99 (true positive), and P(+|D′) = 0.05 (5% false positive). You test positive. What is P(D | +)?<br><br>
<b>Step 2 — total probability of a positive:</b><br>
P(+) = P(+|D)·P(D) + P(+|D′)·P(D′) = 0.99·0.01 + 0.05·0.99 = 0.0099 + 0.0495 = 0.0594<br><br>
<b>Step 3 — Bayes:</b><br>
P(D | +) = [ 0.99 · 0.01 ] / 0.0594 = 0.0099 / 0.0594 ≈ <b>0.167</b><br><br>
So even after a positive on a "99% accurate" test, you are only about <b>16.7%</b> likely to have the disease — because the disease is rare, most positives are false alarms.</div>

<div class="pitfall"><b>The base-rate fallacy (a favourite exam trap):</b> a "99% accurate" test does NOT mean a positive gives 99% chance of disease. You must weigh it against how common the disease is (the prior P(D)). Ignoring the base rate is the single most common mistake with Bayes.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Bayesian thinking runs the modern world.</b> The same P(cause | evidence) update powers spam filters (P(spam | words)), medical diagnosis, and machine-learning classifiers. Every time you see new evidence and revise a belief, you are doing Bayes. Recognising this pattern turns a dry formula into a way of thinking you will reuse far beyond this exam.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Xác suất toàn phần &amp; định lý Bayes</h2>
<p class="lead">Hai công thức này cho phép bạn suy luận ngược — từ "xét nghiệm dương tính" tới "xác suất tôi thực sự mắc bệnh". Chúng là công cụ mạnh nhất, và bị hiểu nhầm nhiều nhất, trong chương.</p>

<h3>Các công thức</h3>
<div class="formula"><span class="lbl">Công thức xác suất toàn phần</span>P(B) = P(B | A₁)·P(A₁) + P(B | A₂)·P(A₂) + … + P(B | Aₖ)·P(Aₖ)</div>
<div class="formula"><span class="lbl">Định lý Bayes</span>P(A | B) = [ P(B | A) · P(A) ] / P(B)</div>
<p>với A₁…Aₖ chia (phân hoạch) không gian mẫu (đúng một cái phải xảy ra). Xác suất toàn phần dựng mẫu số P(B); Bayes sau đó lật một xác suất có điều kiện đã biết thành cái bạn muốn.</p>

<h3>Cách dùng Bayes — quy trình cố định</h3>
<div class="lz-flow">
  <div class="lz-step">1 · Viết tiên nghiệm P(A) &amp; điều kiện ngược P(B|A)</div>
  <div class="lz-step">2 · Dựng P(B) bằng công thức xác suất toàn phần</div>
  <div class="lz-step">3 · Thay vào Bayes để được P(A|B)</div>
</div>

<h3>Ví dụ có lời giải · Bài xét nghiệm y khoa (tự làm bằng tay)</h3>
<div class="out"><b>Đề:</b> Một bệnh ảnh hưởng 1% dân số: P(D) = 0.01, nên P(D′) = 0.99. Xét nghiệm chính xác 99%: P(+|D) = 0.99 (dương thật), và P(+|D′) = 0.05 (5% dương giả). Bạn xét nghiệm dương tính. Tính P(D | +)?<br><br>
<b>Bước 2 — xác suất toàn phần của một kết quả dương:</b><br>
P(+) = P(+|D)·P(D) + P(+|D′)·P(D′) = 0.99·0.01 + 0.05·0.99 = 0.0099 + 0.0495 = 0.0594<br><br>
<b>Bước 3 — Bayes:</b><br>
P(D | +) = [ 0.99 · 0.01 ] / 0.0594 = 0.0099 / 0.0594 ≈ <b>0.167</b><br><br>
Vậy dù dương tính trên một xét nghiệm "chính xác 99%", bạn chỉ khoảng <b>16.7%</b> khả năng mắc bệnh — vì bệnh hiếm, hầu hết kết quả dương là báo động giả.</div>

<div class="pitfall"><b>Ngụy biện tỷ lệ nền (bẫy thi ưa thích):</b> "chính xác 99%" KHÔNG nghĩa là dương tính cho 99% khả năng mắc bệnh. Phải cân với việc bệnh phổ biến đến đâu (tiên nghiệm P(D)). Bỏ qua tỷ lệ nền là lỗi phổ biến nhất với Bayes.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tư duy Bayes vận hành thế giới hiện đại.</b> Chính phép cập nhật P(nguyên nhân | bằng chứng) này chạy bộ lọc spam (P(spam | các từ)), chẩn đoán y khoa, và các bộ phân loại học máy. Mỗi lần bạn thấy bằng chứng mới và điều chỉnh niềm tin, bạn đang làm Bayes. Nhận ra mẫu này biến một công thức khô khan thành một cách tư duy bạn tái dùng vượt xa kỳ thi.</div>
</div>
`,
        },
        {
          title: 'Quiz 1 — Probability|||Quiz 1 — Xác suất',
          slug: 'mas291-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra quy tắc xác suất, có điều kiện, Bayes và cách chọn công thức.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'For a fair die, P(rolling an even number) is…|||Với xúc xắc cân đối, P(ra số chẵn) là…', options: ['1/6', '1/2', '1/3', '2/3'], correctIndex: 1, points: 1 },
              { question: 'The general addition rule P(A∪B) equals…|||Quy tắc cộng tổng quát P(A∪B) bằng…', options: ['P(A)·P(B)', 'P(A) + P(B) − P(A∩B)', 'P(A) − P(B)', 'P(A|B)'], correctIndex: 1, points: 1 },
              { question: 'For "at least one" problems, the quickest tool is usually…|||Với bài "ít nhất một", công cụ nhanh nhất thường là…', options: ['the multiplication rule|||quy tắc nhân', 'the complement, 1 − P(none)|||biến cố đối, 1 − P(không cái nào)', 'Bayes', 'conditional probability|||xác suất có điều kiện'], correctIndex: 1, points: 1 },
              { question: 'P(A|B) is defined as…|||P(A|B) được định nghĩa là…', options: ['P(A)·P(B)', 'P(A∩B) / P(B)', 'P(A) + P(B)', 'P(B) / P(A)'], correctIndex: 1, points: 1 },
              { question: 'After a positive on a 99%-accurate test for a rare (1%) disease, the chance of being sick is only ~17% because…|||Sau dương tính trên xét nghiệm chính xác 99% cho bệnh hiếm (1%), khả năng mắc chỉ ~17% vì…', options: ['the test is broken|||xét nghiệm hỏng', 'the low base rate makes most positives false alarms|||tỷ lệ nền thấp khiến hầu hết dương tính là báo động giả', 'Bayes is wrong|||Bayes sai', 'the sample is small|||mẫu nhỏ'], correctIndex: 1, points: 1 },
              { question: 'Independent and mutually exclusive events are…|||Biến cố độc lập và xung khắc là…', options: ['the same thing|||cùng một thứ', 'opposite ideas (independent can co-occur; exclusive cannot)|||ý đối lập (độc lập có thể cùng xảy ra; xung khắc không)', 'both impossible|||đều bất khả', 'only for dice|||chỉ cho xúc xắc'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — PHÂN PHỐI RỜI RẠC ══════════════════ */
    {
      title: 'Chapter 3 — Discrete distributions|||Chương 3 — Phân phối rời rạc',
      description: 'Bộ công thức đầy đủ: kỳ vọng & phương sai, phân phối nhị thức và Poisson — kèm cách dùng và ví dụ.',
      lessons: [
        {
          title: '3.1 — Mean, variance, binomial & Poisson (full formulas)|||3.1 — Kỳ vọng, phương sai, nhị thức & Poisson (công thức đầy đủ)',
          slug: 'mas291-phan-phoi-roi-rac',
          type: 'VIDEO',
          description: 'Công thức đầy đủ cho E(X), Var(X), phân phối nhị thức và Poisson; khi nào dùng cái nào; ví dụ giải chi tiết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Discrete random variables — the complete toolkit</h2>
<p class="lead">A <strong>random variable</strong> assigns a number to each outcome; a discrete one takes countable values with a probability mass function P(X = x). Here is every formula for this chapter.</p>

<h3>Mean &amp; variance of any discrete distribution</h3>
<div class="formula"><span class="lbl">Expected value (mean)</span>μ = E(X) = Σ x · P(x)</div>
<div class="formula"><span class="lbl">Variance</span>σ² = Var(X) = Σ (x − μ)² · P(x) = E(X²) − μ²</div>
<div class="formula"><span class="lbl">Standard deviation</span>σ = √(σ²)</div>
<p>The second form of the variance, <b>E(X²) − μ²</b>, is usually faster to compute by hand.</p>

<h3>The binomial distribution — B(n, p)</h3>
<p>Use it for the number of "successes" in <b>n</b> fixed, independent yes/no trials, each with success probability <b>p</b>.</p>
<div class="formula"><span class="lbl">Binomial probability</span>P(X = k) = ₙCₖ · pᵏ · (1 − p)ⁿ⁻ᵏ</div>
<div class="formula"><span class="lbl">Binomial mean &amp; variance</span>μ = n·p       σ² = n·p·(1 − p)</div>

<h3>The Poisson distribution — P(λ)</h3>
<p>Use it for the count of rare, independent events in a fixed interval of time or space, with average rate <b>λ</b> (lambda).</p>
<div class="formula"><span class="lbl">Poisson probability</span>P(X = k) = ( e⁻λ · λᵏ ) / k!</div>
<div class="formula"><span class="lbl">Poisson mean &amp; variance</span>μ = λ       σ² = λ   (mean = variance)</div>

<h3>Which to use?</h3>
<table>
  <thead><tr><th>Clue in the problem</th><th>Distribution</th></tr></thead>
  <tbody>
    <tr><td>"n trials", "out of 10", fixed count, success/fail</td><td>Binomial B(n,p)</td></tr>
    <tr><td>"per hour/page/km", rare events, average rate λ</td><td>Poisson P(λ)</td></tr>
  </tbody>
</table>

<h3>Ví dụ có lời giải · Worked examples</h3>
<div class="out"><b>Example 1 (binomial).</b> A machine makes 5% defective parts. In a box of n = 10, P(exactly 2 defective)? Here p = 0.05, k = 2.<br>
P(X=2) = C(10,2) · 0.05² · 0.95⁸ = 45 · 0.0025 · 0.6634 ≈ <b>0.0746</b>.<br>
Mean defects: μ = n·p = 10 · 0.05 = <b>0.5</b>; σ² = 10·0.05·0.95 = 0.475.</div>
<div class="out"><b>Example 2 (Poisson).</b> A call centre gets λ = 3 calls per minute on average. P(exactly 5 calls in a minute)?<br>
P(X=5) = e⁻³ · 3⁵ / 5! = 0.0498 · 243 / 120 ≈ <b>0.1008</b>.</div>
<div class="out"><b>Example 3 (mean of a general discrete).</b> X = payout of a game: P(0)=0.5, P(10)=0.4, P(50)=0.1.<br>
E(X) = 0·0.5 + 10·0.4 + 50·0.1 = 0 + 4 + 5 = <b>9</b>. If a ticket costs 8, the game favours the player on average.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Poisson is the limit of the binomial.</b> When n is large and p is small (many trials, rare success), B(n, p) ≈ Poisson with λ = n·p. This is why "rare events among many opportunities" — typos per page, defects per batch — are Poisson: they are secretly binomials with huge n. It also lets you swap to the easier Poisson formula when computing C(n,k) with big n would be painful.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Compute distributions in Python</span><span class="lc-sub">Loops &amp; functions — build a binomial by hand.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Biến ngẫu nhiên rời rạc — bộ công cụ đầy đủ</h2>
<p class="lead">Một <strong>biến ngẫu nhiên</strong> gán một số cho mỗi kết quả; biến rời rạc nhận giá trị đếm được với hàm khối xác suất P(X = x). Đây là mọi công thức cho chương này.</p>

<h3>Kỳ vọng &amp; phương sai của mọi phân phối rời rạc</h3>
<div class="formula"><span class="lbl">Kỳ vọng (trung bình)</span>μ = E(X) = Σ x · P(x)</div>
<div class="formula"><span class="lbl">Phương sai</span>σ² = Var(X) = Σ (x − μ)² · P(x) = E(X²) − μ²</div>
<div class="formula"><span class="lbl">Độ lệch chuẩn</span>σ = √(σ²)</div>
<p>Dạng thứ hai của phương sai, <b>E(X²) − μ²</b>, thường tính tay nhanh hơn.</p>

<h3>Phân phối nhị thức — B(n, p)</h3>
<p>Dùng cho số "thành công" trong <b>n</b> phép thử có/không cố định, độc lập, mỗi phép thử có xác suất thành công <b>p</b>.</p>
<div class="formula"><span class="lbl">Xác suất nhị thức</span>P(X = k) = ₙCₖ · pᵏ · (1 − p)ⁿ⁻ᵏ</div>
<div class="formula"><span class="lbl">Kỳ vọng &amp; phương sai nhị thức</span>μ = n·p       σ² = n·p·(1 − p)</div>

<h3>Phân phối Poisson — P(λ)</h3>
<p>Dùng cho số đếm biến cố hiếm, độc lập trong một khoảng thời gian/không gian cố định, với tốc độ trung bình <b>λ</b> (lam-đa).</p>
<div class="formula"><span class="lbl">Xác suất Poisson</span>P(X = k) = ( e⁻λ · λᵏ ) / k!</div>
<div class="formula"><span class="lbl">Kỳ vọng &amp; phương sai Poisson</span>μ = λ       σ² = λ   (kỳ vọng = phương sai)</div>

<h3>Dùng cái nào?</h3>
<table>
  <thead><tr><th>Manh mối trong đề</th><th>Phân phối</th></tr></thead>
  <tbody>
    <tr><td>"n phép thử", "trong 10", số đếm cố định, thành/bại</td><td>Nhị thức B(n,p)</td></tr>
    <tr><td>"mỗi giờ/trang/km", biến cố hiếm, tốc độ trung bình λ</td><td>Poisson P(λ)</td></tr>
  </tbody>
</table>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Ví dụ 1 (nhị thức).</b> Một máy tạo 5% sản phẩm lỗi. Trong một hộp n = 10, P(đúng 2 lỗi)? Ở đây p = 0.05, k = 2.<br>
P(X=2) = C(10,2) · 0.05² · 0.95⁸ = 45 · 0.0025 · 0.6634 ≈ <b>0.0746</b>.<br>
Số lỗi trung bình: μ = n·p = 10 · 0.05 = <b>0.5</b>; σ² = 10·0.05·0.95 = 0.475.</div>
<div class="out"><b>Ví dụ 2 (Poisson).</b> Một tổng đài nhận trung bình λ = 3 cuộc gọi/phút. P(đúng 5 cuộc trong một phút)?<br>
P(X=5) = e⁻³ · 3⁵ / 5! = 0.0498 · 243 / 120 ≈ <b>0.1008</b>.</div>
<div class="out"><b>Ví dụ 3 (kỳ vọng của một phân phối rời rạc chung).</b> X = tiền thưởng một trò chơi: P(0)=0.5, P(10)=0.4, P(50)=0.1.<br>
E(X) = 0·0.5 + 10·0.4 + 50·0.1 = 0 + 4 + 5 = <b>9</b>. Nếu một vé giá 8, trung bình trò chơi có lợi cho người chơi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Poisson là giới hạn của nhị thức.</b> Khi n lớn và p nhỏ (nhiều phép thử, thành công hiếm), B(n, p) ≈ Poisson với λ = n·p. Đây là lý do "biến cố hiếm giữa nhiều cơ hội" — lỗi chính tả mỗi trang, lỗi mỗi lô — đều là Poisson: chúng thực chất là nhị thức với n rất lớn. Nó cũng cho phép chuyển sang công thức Poisson dễ hơn khi tính C(n,k) với n lớn quá khổ.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Tính phân phối bằng Python</span><span class="lc-sub">Vòng lặp &amp; hàm — tự dựng phân phối nhị thức.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — The other discrete distributions (hypergeometric, geometric, negative binomial)|||3.2 — Các phân phối rời rạc còn lại (siêu bội, hình học, nhị thức âm)',
          slug: 'mas291-phan-phoi-roi-rac-khac',
          type: 'VIDEO',
          description: 'Đều rời rạc, siêu bội (rút KHÔNG hoàn lại), hình học (chờ lần thành công đầu), nhị thức âm — kèm bảng chọn phân phối.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Four more discrete distributions</h2>
<p class="lead">Lesson 3.1 covered the binomial and the Poisson — the two you meet most. The exam also expects four others. Each one exists because it answers a question the binomial cannot.</p>

<h3>1. Discrete uniform — every value equally likely</h3>
<div class="formula"><span class="lbl">Discrete uniform on a, a+1, …, b</span>P(X = k) = 1/n where n = b − a + 1<br>E(X) = (a + b)/2     V(X) = [(b − a + 1)² − 1]/12</div>
<div class="out"><b>Example.</b> A fair die: values 1…6, so n = 6, P(X = k) = 1/6.<br>
E(X) = (1 + 6)/2 = <b>3.5</b> · V(X) = (6² − 1)/12 = 35/12 ≈ <b>2.917</b>.</div>

<h3>2. Hypergeometric — drawing WITHOUT replacement</h3>
<div class="formula"><span class="lbl">Hypergeometric: N items, K successes, draw n</span>P(X = k) = C(K, k) · C(N − K, n − k) / C(N, n)<br>E(X) = n·K/N     V(X) = n·(K/N)·(1 − K/N)·(N − n)/(N − 1)</div>
<div class="out"><b>Example.</b> A box has N = 20 parts, K = 5 defective. Draw n = 4 without replacement. P(exactly 2 defective)?<br>
P(X = 2) = C(5,2)·C(15,2) / C(20,4) = (10 × 105) / 4845 = 1050/4845 ≈ <b>0.2167</b>.<br>
E(X) = 4 × 5/20 = <b>1</b> defective on average.</div>
<div class="note-ct">The hypergeometric is the binomial's "without replacement" twin. If you drew <em>with</em> replacement, each draw would stay p = K/N and it would be binomial. Because you do not put the item back, the probability shifts after each draw — hence the C(...)·C(...)/C(...) counting form. The extra factor (N−n)/(N−1) in the variance is called the <b>finite population correction</b>; when N is huge compared with n it approaches 1 and the hypergeometric ≈ binomial.</div>

<h3>3. Geometric — how many trials until the FIRST success</h3>
<div class="formula"><span class="lbl">Geometric with success probability p</span>P(X = k) = (1 − p)^(k−1) · p     for k = 1, 2, 3, …<br>E(X) = 1/p     V(X) = (1 − p)/p²</div>
<div class="out"><b>Example.</b> A machine produces a defect with p = 0.1. What is the probability the first defect is the 4th item?<br>
P(X = 4) = (0.9)³ × 0.1 = 0.729 × 0.1 = <b>0.0729</b>.<br>
On average you wait E(X) = 1/0.1 = <b>10</b> items for the first defect.</div>

<h3>4. Negative binomial — how many trials until the r-th success</h3>
<div class="formula"><span class="lbl">Negative binomial: waiting for r successes</span>P(X = k) = C(k − 1, r − 1) · p^r · (1 − p)^(k−r)     for k = r, r+1, …<br>E(X) = r/p     V(X) = r(1 − p)/p²</div>
<div class="out"><b>Example.</b> p = 0.1. Probability that the 3rd defect occurs on the 10th item?<br>
P(X = 10) = C(9, 2) · (0.1)³ · (0.9)⁷ = 36 × 0.001 × 0.4783 ≈ <b>0.0172</b>.<br>
Note the geometric is just the negative binomial with r = 1 — same family.</div>

<h3>How to tell which distribution a question wants</h3>
<table>
  <thead><tr><th>The question sounds like…</th><th>Distribution</th><th>Fixed quantity</th></tr></thead>
  <tbody>
    <tr><td>"in n trials, how many successes"</td><td>Binomial</td><td>n fixed, count X</td></tr>
    <tr><td>"events per hour/page/km", rare</td><td>Poisson</td><td>rate λ</td></tr>
    <tr><td>"drawn from a box, <b>not replaced</b>"</td><td>Hypergeometric</td><td>finite N, no replacement</td></tr>
    <tr><td>"until the <b>first</b> success"</td><td>Geometric</td><td>count trials, r = 1</td></tr>
    <tr><td>"until the <b>r-th</b> success"</td><td>Negative binomial</td><td>count trials, r fixed</td></tr>
    <tr><td>"all outcomes equally likely"</td><td>Discrete uniform</td><td>n equal values</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>The decisive question is: what is fixed and what is counted?</b> Binomial fixes the number of <em>trials</em> and counts <em>successes</em>. Geometric and negative binomial fix the number of <em>successes</em> and count <em>trials</em>. That single swap is the most common exam trap — read whether n or r is given before you pick a formula.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why "negative" binomial?</b> The name comes from writing its probabilities using binomial coefficients with a negative upper index, C(−r, k). You will never need that algebra here, but the label makes sense once you know the geometric (r = 1) is its simplest case — and that both are "inverse" views of the binomial: instead of fixing trials and asking about successes, they fix successes and ask about trials.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Simulate these distributions in Python</span><span class="lc-sub">Loops &amp; functions — check the formulas by experiment.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Bốn phân phối rời rạc nữa</h2>
<p class="lead">Bài 3.1 đã học nhị thức và Poisson — hai phân phối gặp nhiều nhất. Đề thi còn đòi bốn phân phối khác. Mỗi cái tồn tại vì nó trả lời một câu hỏi mà nhị thức không trả lời được.</p>

<h3>1. Đều rời rạc — mọi giá trị khả năng như nhau</h3>
<div class="formula"><span class="lbl">Đều rời rạc trên a, a+1, …, b</span>P(X = k) = 1/n với n = b − a + 1<br>E(X) = (a + b)/2     V(X) = [(b − a + 1)² − 1]/12</div>
<div class="out"><b>Ví dụ.</b> Con xúc xắc cân đối: giá trị 1…6, nên n = 6, P(X = k) = 1/6.<br>
E(X) = (1 + 6)/2 = <b>3.5</b> · V(X) = (6² − 1)/12 = 35/12 ≈ <b>2.917</b>.</div>

<h3>2. Siêu bội — rút KHÔNG hoàn lại</h3>
<div class="formula"><span class="lbl">Siêu bội: N phần tử, K "thành công", rút n</span>P(X = k) = C(K, k) · C(N − K, n − k) / C(N, n)<br>E(X) = n·K/N     V(X) = n·(K/N)·(1 − K/N)·(N − n)/(N − 1)</div>
<div class="out"><b>Ví dụ.</b> Một hộp có N = 20 chi tiết, trong đó K = 5 phế phẩm. Rút n = 4 cái không hoàn lại. Xác suất đúng 2 phế phẩm?<br>
P(X = 2) = C(5,2)·C(15,2) / C(20,4) = (10 × 105) / 4845 = 1050/4845 ≈ <b>0.2167</b>.<br>
E(X) = 4 × 5/20 = <b>1</b> phế phẩm trung bình.</div>
<div class="note-ct">Siêu bội là người anh em "không hoàn lại" của nhị thức. Nếu bạn rút <em>có</em> hoàn lại thì mỗi lần rút vẫn giữ p = K/N và đó là nhị thức. Vì không bỏ vật trở lại nên xác suất đổi sau mỗi lần rút — do đó mới có dạng đếm C(...)·C(...)/C(...). Thừa số thêm (N−n)/(N−1) trong phương sai gọi là <b>hiệu chỉnh tổng thể hữu hạn</b>; khi N rất lớn so với n thì nó tiến về 1 và siêu bội ≈ nhị thức.</div>

<h3>3. Hình học — bao nhiêu phép thử tới lần thành công ĐẦU TIÊN</h3>
<div class="formula"><span class="lbl">Hình học với xác suất thành công p</span>P(X = k) = (1 − p)^(k−1) · p     với k = 1, 2, 3, …<br>E(X) = 1/p     V(X) = (1 − p)/p²</div>
<div class="out"><b>Ví dụ.</b> Một máy tạo ra phế phẩm với p = 0.1. Xác suất phế phẩm đầu tiên là sản phẩm thứ 4?<br>
P(X = 4) = (0.9)³ × 0.1 = 0.729 × 0.1 = <b>0.0729</b>.<br>
Trung bình bạn phải chờ E(X) = 1/0.1 = <b>10</b> sản phẩm mới gặp phế phẩm đầu tiên.</div>

<h3>4. Nhị thức âm — bao nhiêu phép thử tới lần thành công thứ r</h3>
<div class="formula"><span class="lbl">Nhị thức âm: chờ đủ r lần thành công</span>P(X = k) = C(k − 1, r − 1) · p^r · (1 − p)^(k−r)     với k = r, r+1, …<br>E(X) = r/p     V(X) = r(1 − p)/p²</div>
<div class="out"><b>Ví dụ.</b> p = 0.1. Xác suất phế phẩm thứ 3 rơi vào sản phẩm thứ 10?<br>
P(X = 10) = C(9, 2) · (0.1)³ · (0.9)⁷ = 36 × 0.001 × 0.4783 ≈ <b>0.0172</b>.<br>
Lưu ý phân phối hình học chính là nhị thức âm với r = 1 — cùng một họ.</div>

<h3>Cách nhận ra đề đang hỏi phân phối nào</h3>
<table>
  <thead><tr><th>Đề nghe giống…</th><th>Phân phối</th><th>Đại lượng bị cố định</th></tr></thead>
  <tbody>
    <tr><td>"trong n phép thử, bao nhiêu lần thành công"</td><td>Nhị thức</td><td>n cố định, đếm X</td></tr>
    <tr><td>"số biến cố mỗi giờ/trang/km", hiếm</td><td>Poisson</td><td>tốc độ λ</td></tr>
    <tr><td>"rút từ hộp, <b>không hoàn lại</b>"</td><td>Siêu bội</td><td>N hữu hạn, không hoàn lại</td></tr>
    <tr><td>"cho tới lần thành công <b>đầu tiên</b>"</td><td>Hình học</td><td>đếm phép thử, r = 1</td></tr>
    <tr><td>"cho tới lần thành công <b>thứ r</b>"</td><td>Nhị thức âm</td><td>đếm phép thử, r cố định</td></tr>
    <tr><td>"mọi kết quả khả năng như nhau"</td><td>Đều rời rạc</td><td>n giá trị bằng nhau</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Câu hỏi quyết định là: cái gì bị cố định và cái gì được đếm?</b> Nhị thức cố định số <em>phép thử</em> và đếm số <em>thành công</em>. Hình học và nhị thức âm cố định số <em>thành công</em> và đếm số <em>phép thử</em>. Đúng một chỗ hoán đổi đó là bẫy thi phổ biến nhất — hãy đọc xem đề cho n hay cho r trước khi chọn công thức.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao gọi là nhị thức "âm"?</b> Tên này đến từ việc viết xác suất của nó bằng hệ số nhị thức với chỉ số trên âm, C(−r, k). Bạn sẽ không bao giờ cần đến phần đại số đó ở đây, nhưng cái tên trở nên có lý khi bạn biết phân phối hình học (r = 1) là trường hợp đơn giản nhất của nó — và cả hai đều là góc nhìn "đảo ngược" của nhị thức: thay vì cố định phép thử rồi hỏi về thành công, chúng cố định thành công rồi hỏi về phép thử.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Mô phỏng các phân phối này bằng Python</span><span class="lc-sub">Vòng lặp &amp; hàm — kiểm chứng công thức bằng thực nghiệm.</span></span>
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
      description: 'Phân phối chuẩn đầy đủ: chuẩn hóa z, cách tra bảng z, và tính xác suất trên một khoảng.',
      lessons: [
        {
          title: '4.1 — The normal distribution & z-scores (full method)|||4.1 — Phân phối chuẩn & điểm z (phương pháp đầy đủ)',
          slug: 'mas291-phan-phoi-chuan',
          type: 'VIDEO',
          description: 'Công thức z, quy tắc 68-95-99.7, cách tra bảng z và tính P(a≤X≤b) từng bước.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>The normal distribution — the complete method</h2>
<p class="lead">The <strong>normal (Gaussian)</strong> distribution is the most important in statistics. It is symmetric about the mean μ, its spread set by σ. To find any probability, you convert to a <strong>z-score</strong> and use the standard normal table.</p>

<h3>The formulas</h3>
<div class="formula"><span class="lbl">Standardise to a z-score</span>z = (x − μ) / σ</div>
<div class="formula"><span class="lbl">The 68–95–99.7 rule</span>P(μ−σ &lt; X &lt; μ+σ) ≈ 0.68   ·   ±2σ ≈ 0.95   ·   ±3σ ≈ 0.997</div>
<p><b>z</b> tells you how many standard deviations x is above (+) or below (−) the mean. The standard normal Z has μ = 0, σ = 1, so one table works for every normal.</p>

<h3>How to compute a probability — the procedure</h3>
<div class="lz-flow">
  <div class="lz-step">1 · Convert the boundary x to z = (x − μ)/σ</div>
  <div class="lz-step">2 · Look up Φ(z) = P(Z &lt; z) in the z-table</div>
  <div class="lz-step">3 · Combine: P(a&lt;X&lt;b) = Φ(z_b) − Φ(z_a); P(X&gt;x) = 1 − Φ(z)</div>
</div>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Setup:</b> IQ ~ Normal(μ = 100, σ = 15).<br><br>
<b>(a) P(X &lt; 130)?</b> z = (130 − 100)/15 = 2.0 → Φ(2.0) = <b>0.9772</b>. So 97.72% score below 130.<br><br>
<b>(b) P(X &gt; 115)?</b> z = (115 − 100)/15 = 1.0 → P = 1 − Φ(1.0) = 1 − 0.8413 = <b>0.1587</b>.<br><br>
<b>(c) P(85 &lt; X &lt; 115)?</b> z ranges −1 to +1 → Φ(1) − Φ(−1) = 0.8413 − 0.1587 = <b>0.6826</b> (the 68% rule).</div>

<div class="pitfall"><b>Trap:</b> a continuous distribution gives probability over an <em>interval</em>, not at a point — P(X = exactly 100) = 0. Always compute an area P(a ≤ X ≤ b). Also watch the sign of z: a value below the mean gives a negative z.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why the normal turns up everywhere.</b> Heights, measurement errors, exam scores and sample means all end up bell-shaped, and that is not a coincidence: whenever a quantity is the <em>sum of many small independent effects</em>, its distribution drifts towards the normal no matter what the individual effects look like. That result is the Central Limit Theorem (Chapter 6), and it is the reason the normal deserves a whole lesson of its own while other distributions get a paragraph. The uniform, exponential and the general PDF/CDF machinery are covered next, in Lesson 4.2.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Phân phối chuẩn — phương pháp đầy đủ</h2>
<p class="lead">Phân phối <strong>chuẩn (Gauss)</strong> là quan trọng nhất trong thống kê. Nó đối xứng quanh trung bình μ, độ phân tán đặt bởi σ. Để tìm mọi xác suất, bạn đổi sang <strong>điểm z</strong> và dùng bảng phân phối chuẩn tắc.</p>

<h3>Các công thức</h3>
<div class="formula"><span class="lbl">Chuẩn hóa về điểm z</span>z = (x − μ) / σ</div>
<div class="formula"><span class="lbl">Quy tắc 68–95–99.7</span>P(μ−σ &lt; X &lt; μ+σ) ≈ 0.68   ·   ±2σ ≈ 0.95   ·   ±3σ ≈ 0.997</div>
<p><b>z</b> cho biết x cách trung bình bao nhiêu độ lệch chuẩn về phía trên (+) hoặc dưới (−). Chuẩn tắc Z có μ = 0, σ = 1, nên một bảng dùng cho mọi phân phối chuẩn.</p>

<h3>Cách tính một xác suất — quy trình</h3>
<div class="lz-flow">
  <div class="lz-step">1 · Đổi biên x thành z = (x − μ)/σ</div>
  <div class="lz-step">2 · Tra Φ(z) = P(Z &lt; z) trong bảng z</div>
  <div class="lz-step">3 · Ghép: P(a&lt;X&lt;b) = Φ(z_b) − Φ(z_a); P(X&gt;x) = 1 − Φ(z)</div>
</div>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Đề:</b> IQ ~ Chuẩn(μ = 100, σ = 15).<br><br>
<b>(a) P(X &lt; 130)?</b> z = (130 − 100)/15 = 2.0 → Φ(2.0) = <b>0.9772</b>. Vậy 97.72% có điểm dưới 130.<br><br>
<b>(b) P(X &gt; 115)?</b> z = (115 − 100)/15 = 1.0 → P = 1 − Φ(1.0) = 1 − 0.8413 = <b>0.1587</b>.<br><br>
<b>(c) P(85 &lt; X &lt; 115)?</b> z chạy −1 tới +1 → Φ(1) − Φ(−1) = 0.8413 − 0.1587 = <b>0.6826</b> (quy tắc 68%).</div>

<div class="pitfall"><b>Bẫy:</b> phân phối liên tục cho xác suất trên một <em>khoảng</em>, không phải tại một điểm — P(X = đúng 100) = 0. Luôn tính diện tích P(a ≤ X ≤ b). Cũng chú ý dấu của z: giá trị dưới trung bình cho z âm.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao phân phối chuẩn xuất hiện ở khắp nơi.</b> Chiều cao, sai số đo, điểm thi và trung bình mẫu đều có dạng hình chuông, và đó không phải ngẫu nhiên: hễ một đại lượng là <em>tổng của nhiều tác động nhỏ độc lập</em>, phân phối của nó sẽ trôi dần về phân phối chuẩn bất kể từng tác động riêng lẻ có dạng gì. Kết quả đó chính là Định lý giới hạn trung tâm (Chương 6), và là lý do phân phối chuẩn xứng đáng có hẳn một bài riêng trong khi các phân phối khác chỉ được một đoạn. Phân phối đều, phân phối mũ và bộ máy PDF/CDF tổng quát sẽ học ngay sau đây, ở Bài 4.2.</div>
</div>
`,
        },
        {
          title: '4.2 — PDF, CDF, the continuous uniform & the exponential|||4.2 — PDF, CDF, phân phối đều liên tục & phân phối mũ',
          slug: 'mas291-pdf-cdf-deu-mu',
          type: 'VIDEO',
          description: 'Bộ máy chung của mọi biến liên tục (f(x), F(x), E(X), V(X) bằng tích phân) rồi áp dụng cho phân phối đều và phân phối mũ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>The general machinery — and two more distributions</h2>
<p class="lead">Lesson 4.1 gave you the normal by table lookup. This lesson shows where those probabilities come from: for a continuous variable, probability is <strong>area under a curve</strong>, computed by integration.</p>

<h3>1. The probability density function (PDF)</h3>
<div class="formula"><span class="lbl">Requirements for a valid PDF</span>f(x) ≥ 0 for all x     and     ∫<sub>−∞</sub><sup>+∞</sup> f(x) dx = 1</div>
<div class="formula"><span class="lbl">Probability over an interval</span>P(a ≤ X ≤ b) = ∫<sub>a</sub><sup>b</sup> f(x) dx</div>
<div class="note-ct">f(x) is a <em>density</em>, not a probability — it can exceed 1. Only the area is a probability. This is why P(X = c) = 0 for any single point c: an interval of zero width has zero area. A direct consequence: for continuous variables &lt; and ≤ give the same answer, so P(a &lt; X &lt; b) = P(a ≤ X ≤ b).</div>

<h3>2. The cumulative distribution function (CDF)</h3>
<div class="formula"><span class="lbl">CDF and its use</span>F(x) = P(X ≤ x) = ∫<sub>−∞</sub><sup>x</sup> f(t) dt<br>P(a ≤ X ≤ b) = F(b) − F(a)     and     f(x) = F′(x)</div>
<div class="out"><b>Worked example.</b> f(x) = 2x on [0, 1], 0 elsewhere. (Check: ∫₀¹ 2x dx = x²|₀¹ = 1 ✓ valid.)<br>
CDF: F(x) = ∫₀ˣ 2t dt = <b>x²</b> on [0,1].<br>
P(0.2 ≤ X ≤ 0.5) = F(0.5) − F(0.2) = 0.25 − 0.04 = <b>0.21</b>.</div>

<h3>3. Mean and variance by integration</h3>
<div class="formula"><span class="lbl">Continuous E(X) and V(X)</span>E(X) = ∫ x · f(x) dx<br>V(X) = ∫ (x − μ)² · f(x) dx = E(X²) − [E(X)]²</div>
<div class="out"><b>Same example</b> f(x) = 2x on [0,1]:<br>
E(X) = ∫₀¹ x·2x dx = ∫₀¹ 2x² dx = 2/3 ≈ <b>0.667</b><br>
E(X²) = ∫₀¹ x²·2x dx = ∫₀¹ 2x³ dx = 1/2 → V(X) = 1/2 − (2/3)² = 1/2 − 4/9 = <b>1/18 ≈ 0.0556</b>.</div>
<div class="note-ct">Compare with the discrete case from Chapter 3: E(X) = Σ x·P(X = x) becomes E(X) = ∫ x·f(x) dx. The shortcut V(X) = E(X²) − [E(X)]² works identically in both worlds — it is usually far less work than the definition.</div>

<h3>4. The continuous uniform distribution</h3>
<div class="formula"><span class="lbl">Uniform on [a, b]</span>f(x) = 1/(b − a) on [a, b]     F(x) = (x − a)/(b − a)<br>μ = (a + b)/2     σ² = (b − a)²/12</div>
<div class="out"><b>Example.</b> A bus arrives uniformly between 10:00 and 10:30, so X ~ U(0, 30) minutes.<br>
P(waiting more than 20 min) = (30 − 20)/30 = <b>1/3</b>.<br>
μ = (0 + 30)/2 = <b>15</b> min · σ² = 30²/12 = <b>75</b> → σ ≈ 8.66 min.</div>

<h3>5. The exponential distribution — waiting time</h3>
<div class="formula"><span class="lbl">Exponential with rate λ</span>f(x) = λ·e^(−λx) for x ≥ 0     F(x) = 1 − e^(−λx)     P(X &gt; t) = e^(−λt)<br>E(X) = 1/λ     V(X) = 1/λ²</div>
<div class="out"><b>Example.</b> Calls arrive at λ = 3 per hour. What is the probability of waiting more than 30 minutes (0.5 h) for the next call?<br>
P(X &gt; 0.5) = e^(−3 × 0.5) = e^(−1.5) ≈ <b>0.2231</b>.<br>
Mean waiting time E(X) = 1/3 hour = <b>20 minutes</b>.</div>
<div class="note-ct"><b>The Poisson–exponential pair.</b> If the <em>number</em> of events per unit time is Poisson(λ), then the <em>gap</em> between consecutive events is Exponential(λ). Same process, two viewpoints: Poisson counts, exponential measures the wait. That is why the two λ are the same number.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The exponential is memoryless:</b> P(X &gt; s + t | X &gt; s) = P(X &gt; t). If a bus has not come for 10 minutes, the distribution of your remaining wait is exactly the same as when you arrived — the process has no memory of how long you have waited. It is the only continuous distribution with this property, which is why it models "random failures with a constant rate" so well and why it is the wrong model for things that wear out (those need the Weibull).</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Integrate &amp; simulate in Python</span><span class="lc-sub">Check these PDFs and CDFs numerically.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Bộ máy tổng quát — và hai phân phối nữa</h2>
<p class="lead">Bài 4.1 cho bạn phân phối chuẩn qua tra bảng. Bài này chỉ ra các xác suất đó đến từ đâu: với biến liên tục, xác suất là <strong>diện tích dưới đường cong</strong>, tính bằng tích phân.</p>

<h3>1. Hàm mật độ xác suất (PDF)</h3>
<div class="formula"><span class="lbl">Điều kiện để f là PDF hợp lệ</span>f(x) ≥ 0 với mọi x     và     ∫<sub>−∞</sub><sup>+∞</sup> f(x) dx = 1</div>
<div class="formula"><span class="lbl">Xác suất trên một khoảng</span>P(a ≤ X ≤ b) = ∫<sub>a</sub><sup>b</sup> f(x) dx</div>
<div class="note-ct">f(x) là <em>mật độ</em>, không phải xác suất — nó có thể lớn hơn 1. Chỉ diện tích mới là xác suất. Đó là lý do P(X = c) = 0 với mọi điểm c: một khoảng có bề rộng bằng 0 thì diện tích bằng 0. Hệ quả trực tiếp: với biến liên tục, &lt; và ≤ cho cùng kết quả, nên P(a &lt; X &lt; b) = P(a ≤ X ≤ b).</div>

<h3>2. Hàm phân phối tích lũy (CDF)</h3>
<div class="formula"><span class="lbl">CDF và cách dùng</span>F(x) = P(X ≤ x) = ∫<sub>−∞</sub><sup>x</sup> f(t) dt<br>P(a ≤ X ≤ b) = F(b) − F(a)     và     f(x) = F′(x)</div>
<div class="out"><b>Ví dụ có lời giải.</b> f(x) = 2x trên [0, 1], bằng 0 ở nơi khác. (Kiểm: ∫₀¹ 2x dx = x²|₀¹ = 1 ✓ hợp lệ.)<br>
CDF: F(x) = ∫₀ˣ 2t dt = <b>x²</b> trên [0,1].<br>
P(0.2 ≤ X ≤ 0.5) = F(0.5) − F(0.2) = 0.25 − 0.04 = <b>0.21</b>.</div>

<h3>3. Kỳ vọng và phương sai bằng tích phân</h3>
<div class="formula"><span class="lbl">E(X) và V(X) liên tục</span>E(X) = ∫ x · f(x) dx<br>V(X) = ∫ (x − μ)² · f(x) dx = E(X²) − [E(X)]²</div>
<div class="out"><b>Vẫn ví dụ đó</b> f(x) = 2x trên [0,1]:<br>
E(X) = ∫₀¹ x·2x dx = ∫₀¹ 2x² dx = 2/3 ≈ <b>0.667</b><br>
E(X²) = ∫₀¹ x²·2x dx = ∫₀¹ 2x³ dx = 1/2 → V(X) = 1/2 − (2/3)² = 1/2 − 4/9 = <b>1/18 ≈ 0.0556</b>.</div>
<div class="note-ct">So với trường hợp rời rạc ở Chương 3: E(X) = Σ x·P(X = x) trở thành E(X) = ∫ x·f(x) dx. Mẹo V(X) = E(X²) − [E(X)]² dùng được y hệt ở cả hai thế giới — và thường ít việc hơn nhiều so với dùng định nghĩa.</div>

<h3>4. Phân phối đều liên tục</h3>
<div class="formula"><span class="lbl">Đều trên [a, b]</span>f(x) = 1/(b − a) trên [a, b]     F(x) = (x − a)/(b − a)<br>μ = (a + b)/2     σ² = (b − a)²/12</div>
<div class="out"><b>Ví dụ.</b> Một chuyến xe buýt đến ngẫu nhiên đều trong khoảng 10:00–10:30, nên X ~ U(0, 30) phút.<br>
P(chờ hơn 20 phút) = (30 − 20)/30 = <b>1/3</b>.<br>
μ = (0 + 30)/2 = <b>15</b> phút · σ² = 30²/12 = <b>75</b> → σ ≈ 8.66 phút.</div>

<h3>5. Phân phối mũ — thời gian chờ</h3>
<div class="formula"><span class="lbl">Phân phối mũ với tốc độ λ</span>f(x) = λ·e^(−λx) với x ≥ 0     F(x) = 1 − e^(−λx)     P(X &gt; t) = e^(−λt)<br>E(X) = 1/λ     V(X) = 1/λ²</div>
<div class="out"><b>Ví dụ.</b> Cuộc gọi đến với λ = 3 cuộc mỗi giờ. Xác suất phải chờ hơn 30 phút (0.5 giờ) cho cuộc gọi tiếp theo?<br>
P(X &gt; 0.5) = e^(−3 × 0.5) = e^(−1.5) ≈ <b>0.2231</b>.<br>
Thời gian chờ trung bình E(X) = 1/3 giờ = <b>20 phút</b>.</div>
<div class="note-ct"><b>Cặp đôi Poisson–mũ.</b> Nếu <em>số lượng</em> biến cố trong một đơn vị thời gian tuân theo Poisson(λ), thì <em>khoảng cách</em> giữa hai biến cố liên tiếp tuân theo phân phối mũ(λ). Cùng một quá trình, hai góc nhìn: Poisson đếm, phân phối mũ đo thời gian chờ. Đó là lý do hai chữ λ là cùng một số.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phân phối mũ không có trí nhớ:</b> P(X &gt; s + t | X &gt; s) = P(X &gt; t). Nếu xe buýt đã không đến suốt 10 phút, phân phối của thời gian chờ còn lại vẫn y hệt lúc bạn mới tới — quá trình không nhớ bạn đã chờ bao lâu. Đây là phân phối liên tục DUY NHẤT có tính chất này, nên nó mô hình rất tốt "hỏng hóc ngẫu nhiên với tốc độ không đổi", và cũng vì thế nó là mô hình SAI cho những thứ bị hao mòn theo thời gian (những thứ đó cần phân phối Weibull).</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Tích phân &amp; mô phỏng bằng Python</span><span class="lc-sub">Kiểm chứng các PDF và CDF này bằng số.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '4.3 — Normal approximation & the continuity correction|||4.3 — Xấp xỉ chuẩn & hiệu chỉnh liên tục',
          slug: 'mas291-xap-xi-chuan',
          type: 'VIDEO',
          description: 'Khi nào thay nhị thức/Poisson bằng phân phối chuẩn, điều kiện np>5 & n(1−p)>5, và hiệu chỉnh ±0.5.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Using the normal to replace a discrete distribution</h2>
<p class="lead">Computing P(X ≤ 40) for B(100, 0.5) means summing 41 binomial terms. Instead, you can approximate the discrete distribution with a normal one — a standard exam technique with two rules you must respect.</p>

<h3>1. Binomial → Normal</h3>
<div class="formula"><span class="lbl">Condition and parameters</span>Valid when <b>np &gt; 5</b> AND <b>n(1 − p) &gt; 5</b><br>Then B(n, p) ≈ N( μ = np , σ² = np(1 − p) )</div>

<h3>2. Poisson → Normal</h3>
<div class="formula"><span class="lbl">Condition and parameters</span>Valid when <b>λ &gt; 5</b><br>Then Poisson(λ) ≈ N( μ = λ , σ² = λ )</div>

<h3>3. The continuity correction — ±0.5</h3>
<p>A binomial variable takes whole numbers; a normal one takes any real value. To bridge that gap, expand each whole number into an interval of width 1 by shifting the boundary by <b>0.5</b>.</p>
<table>
  <thead><tr><th>Discrete question</th><th>Normal version</th></tr></thead>
  <tbody>
    <tr><td>P(X = k)</td><td>P(k − 0.5 &lt; X &lt; k + 0.5)</td></tr>
    <tr><td>P(X ≤ k)</td><td>P(X &lt; k + 0.5)</td></tr>
    <tr><td>P(X &lt; k)</td><td>P(X &lt; k − 0.5)</td></tr>
    <tr><td>P(X ≥ k)</td><td>P(X &gt; k − 0.5)</td></tr>
    <tr><td>P(X &gt; k)</td><td>P(X &gt; k + 0.5)</td></tr>
  </tbody>
</table>
<div class="note-ct">The logic: "X ≤ 40" includes the whole block for 40, which stretches to 40.5 on a continuous scale — so the boundary moves <em>outward</em>. "X &lt; 40" excludes 40 entirely, so the boundary moves <em>inward</em> to 39.5. Ask yourself whether k itself is included; if yes push the boundary away from k, if no pull it towards k.</div>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Problem.</b> X ~ B(100, 0.5). Estimate P(X ≤ 45).<br>
<b>Step 1 — check the condition.</b> np = 50 &gt; 5 and n(1−p) = 50 &gt; 5 ✓ approximation allowed.<br>
<b>Step 2 — parameters.</b> μ = np = 50, σ² = np(1−p) = 25, so σ = 5.<br>
<b>Step 3 — continuity correction.</b> P(X ≤ 45) → P(X &lt; 45.5).<br>
<b>Step 4 — standardise.</b> z = (45.5 − 50)/5 = −0.9.<br>
<b>Step 5 — table.</b> Φ(−0.9) = <b>0.1841</b>.<br>
(The exact binomial value is 0.1841 — the approximation is excellent here.)</div>

<div class="out"><b>Second example (Poisson).</b> Defects arrive at λ = 16 per batch. Estimate P(X ≥ 20).<br>
λ = 16 &gt; 5 ✓ · μ = 16, σ = √16 = 4 · correction: P(X ≥ 20) → P(X &gt; 19.5)<br>
z = (19.5 − 16)/4 = 0.875 → P = 1 − Φ(0.875) ≈ 1 − 0.8092 = <b>0.1908</b>.</div>

<div class="pitfall"><b>Two marks lost most often here:</b> (1) forgetting the ±0.5 entirely — you will get a plausible but wrong answer, and the grader can see it immediately; (2) shifting it the wrong way. Write down whether the boundary value k is <em>included</em> before you touch the calculator. Note also that σ² = np(1−p), so you must take a <b>square root</b> before dividing — using the variance instead of the standard deviation is the other classic slip.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> The normal approximation is really the Central Limit Theorem in disguise: a binomial count is the <em>sum</em> of n independent Bernoulli trials, and the CLT (Chapter 6) says sums of many independent pieces tend to a normal. The conditions np &gt; 5 and n(1−p) &gt; 5 are just a practical way of saying "n is big enough and p is not so extreme that the distribution is still lop-sided". With modern software you would simply compute the exact binomial — but the approximation remains on the exam because it shows you understand why the normal is everywhere.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Compare exact vs approximate</span><span class="lc-sub">Compute both in Python and see the error shrink.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Dùng phân phối chuẩn để thay một phân phối rời rạc</h2>
<p class="lead">Tính P(X ≤ 40) cho B(100, 0.5) nghĩa là cộng 41 số hạng nhị thức. Thay vào đó, bạn có thể xấp xỉ phân phối rời rạc bằng phân phối chuẩn — một kỹ thuật thi chuẩn mực với hai quy tắc bắt buộc tôn trọng.</p>

<h3>1. Nhị thức → Chuẩn</h3>
<div class="formula"><span class="lbl">Điều kiện và tham số</span>Hợp lệ khi <b>np &gt; 5</b> VÀ <b>n(1 − p) &gt; 5</b><br>Khi đó B(n, p) ≈ N( μ = np , σ² = np(1 − p) )</div>

<h3>2. Poisson → Chuẩn</h3>
<div class="formula"><span class="lbl">Điều kiện và tham số</span>Hợp lệ khi <b>λ &gt; 5</b><br>Khi đó Poisson(λ) ≈ N( μ = λ , σ² = λ )</div>

<h3>3. Hiệu chỉnh liên tục — ±0.5</h3>
<p>Biến nhị thức nhận giá trị nguyên; biến chuẩn nhận mọi số thực. Để nối khoảng cách đó, hãy mở rộng mỗi số nguyên thành một khoảng rộng 1 bằng cách dịch biên đi <b>0.5</b>.</p>
<table>
  <thead><tr><th>Câu hỏi rời rạc</th><th>Phiên bản chuẩn</th></tr></thead>
  <tbody>
    <tr><td>P(X = k)</td><td>P(k − 0.5 &lt; X &lt; k + 0.5)</td></tr>
    <tr><td>P(X ≤ k)</td><td>P(X &lt; k + 0.5)</td></tr>
    <tr><td>P(X &lt; k)</td><td>P(X &lt; k − 0.5)</td></tr>
    <tr><td>P(X ≥ k)</td><td>P(X &gt; k − 0.5)</td></tr>
    <tr><td>P(X &gt; k)</td><td>P(X &gt; k + 0.5)</td></tr>
  </tbody>
</table>
<div class="note-ct">Logic ở đây: "X ≤ 40" bao gồm trọn khối của số 40, mà khối đó kéo tới 40.5 trên thang liên tục — nên biên dịch ra <em>phía ngoài</em>. "X &lt; 40" loại hẳn số 40, nên biên dịch vào <em>phía trong</em> thành 39.5. Hãy tự hỏi bản thân số k có được tính vào không; nếu có thì đẩy biên ra xa k, nếu không thì kéo biên về phía k.</div>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Đề.</b> X ~ B(100, 0.5). Ước lượng P(X ≤ 45).<br>
<b>Bước 1 — kiểm điều kiện.</b> np = 50 &gt; 5 và n(1−p) = 50 &gt; 5 ✓ được phép xấp xỉ.<br>
<b>Bước 2 — tham số.</b> μ = np = 50, σ² = np(1−p) = 25, nên σ = 5.<br>
<b>Bước 3 — hiệu chỉnh liên tục.</b> P(X ≤ 45) → P(X &lt; 45.5).<br>
<b>Bước 4 — chuẩn hóa.</b> z = (45.5 − 50)/5 = −0.9.<br>
<b>Bước 5 — tra bảng.</b> Φ(−0.9) = <b>0.1841</b>.<br>
(Giá trị nhị thức chính xác là 0.1841 — xấp xỉ ở đây rất tốt.)</div>

<div class="out"><b>Ví dụ thứ hai (Poisson).</b> Lỗi xuất hiện với λ = 16 mỗi lô. Ước lượng P(X ≥ 20).<br>
λ = 16 &gt; 5 ✓ · μ = 16, σ = √16 = 4 · hiệu chỉnh: P(X ≥ 20) → P(X &gt; 19.5)<br>
z = (19.5 − 16)/4 = 0.875 → P = 1 − Φ(0.875) ≈ 1 − 0.8092 = <b>0.1908</b>.</div>

<div class="pitfall"><b>Hai chỗ mất điểm nhiều nhất:</b> (1) quên hẳn ±0.5 — bạn sẽ ra một đáp án nghe hợp lý nhưng sai, và người chấm nhìn ra ngay; (2) dịch biên nhầm hướng. Hãy viết ra xem giá trị biên k có <em>được tính vào</em> hay không TRƯỚC khi chạm máy tính. Cũng lưu ý σ² = np(1−p), nên bạn phải <b>lấy căn bậc hai</b> trước khi chia — dùng nhầm phương sai thay cho độ lệch chuẩn là lỗi kinh điển còn lại.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Xấp xỉ chuẩn thực chất là Định lý giới hạn trung tâm trá hình: một biến đếm nhị thức là <em>tổng</em> của n phép thử Bernoulli độc lập, và CLT (Chương 6) nói rằng tổng của nhiều mảnh độc lập sẽ tiến về phân phối chuẩn. Điều kiện np &gt; 5 và n(1−p) &gt; 5 chỉ là cách nói thực dụng rằng "n đủ lớn và p không quá lệch tới mức phân phối vẫn còn méo một bên". Với phần mềm hiện đại bạn chỉ việc tính nhị thức chính xác — nhưng phép xấp xỉ vẫn nằm trong đề thi vì nó cho thấy bạn hiểu vì sao phân phối chuẩn ở khắp nơi.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">So sánh chính xác vs xấp xỉ</span><span class="lc-sub">Tính cả hai bằng Python và xem sai số nhỏ dần.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 2 — Distributions|||Quiz 2 — Phân phối',
          slug: 'mas291-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra kỳ vọng/phương sai, nhị thức, Poisson và phân phối chuẩn.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The expected value of a discrete X is…|||Kỳ vọng của biến rời rạc X là…', options: ['Σ P(x)', 'Σ x·P(x)', 'the largest x|||x lớn nhất', 'n·p always|||luôn là n·p'], correctIndex: 1, points: 1 },
              { question: 'The binomial mean and variance are…|||Kỳ vọng và phương sai nhị thức là…', options: ['μ=λ, σ²=λ', 'μ=np, σ²=np(1−p)', 'μ=p, σ²=n', 'μ=n, σ²=p'], correctIndex: 1, points: 1 },
              { question: 'For the Poisson distribution, the mean and variance are…|||Với phân phối Poisson, kỳ vọng và phương sai…', options: ['both equal to λ|||đều bằng λ', 'μ=λ, σ²=λ² ', 'μ=np, σ²=λ', 'unrelated|||không liên quan'], correctIndex: 0, points: 1 },
              { question: 'A z-score is computed as…|||Điểm z được tính bằng…', options: ['(x − μ) / σ', 'x · σ', 'μ / σ', 'x + μ'], correctIndex: 0, points: 1 },
              { question: 'For X~Normal(100,15), P(X<130) uses z=2.0, giving…|||Với X~Chuẩn(100,15), P(X<130) dùng z=2.0, cho…', options: ['0.5000', '0.9772', '0.0228', '0.6826'], correctIndex: 1, points: 1 },
              { question: 'Which pair of clues points to a Poisson model?|||Cặp manh mối nào chỉ tới mô hình Poisson?', options: ['"out of 10 trials", success/fail|||"trong 10 phép thử", thành/bại', 'rare events with an average rate per interval|||biến cố hiếm với tốc độ trung bình mỗi khoảng', 'a symmetric bell curve|||đường cong chuông đối xứng', 'a fixed range [a,b]|||một khoảng cố định [a,b]'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — THỐNG KÊ MÔ TẢ ══════════════════ */
    {
      title: 'Chapter 5 — Descriptive statistics|||Chương 5 — Thống kê mô tả',
      description: 'Bộ công thức đầy đủ: trung bình, trung vị, mode, khoảng biến thiên, phương sai, độ lệch chuẩn, tứ phân vị, IQR, CV.',
      lessons: [
        {
          title: '5.1 — Every summary measure (centre, spread, position)|||5.1 — Mọi đại lượng tóm tắt (tâm, phân tán, vị trí)',
          slug: 'mas291-thong-ke-mo-ta',
          type: 'VIDEO',
          description: 'Toàn bộ công thức thống kê mô tả với cách tính từng bước và một ví dụ chạy suốt.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Describing data — the complete formula set</h2>
<p class="lead">Before any inference, you summarise the data with three families of numbers: where its <strong>centre</strong> is, how <strong>spread out</strong> it is, and the <strong>position</strong> of values. Here they all are.</p>

<h3>Measures of centre</h3>
<div class="formula"><span class="lbl">Sample mean</span>x̄ = ( Σ xᵢ ) / n</div>
<p><b>Median</b> = the middle value when sorted (average of the two middle values if n is even). <b>Mode</b> = the most frequent value.</p>

<h3>Measures of spread</h3>
<div class="formula"><span class="lbl">Range</span>Range = max − min</div>
<div class="formula"><span class="lbl">Sample variance</span>s² = Σ (xᵢ − x̄)² / (n − 1)</div>
<div class="formula"><span class="lbl">Sample standard deviation</span>s = √(s²)   (same units as the data)</div>
<div class="formula"><span class="lbl">Coefficient of variation</span>CV = (s / x̄) · 100%</div>
<p>We divide the variance by <b>n − 1</b> (not n) — <em>Bessel's correction</em> — because using the sample's own mean x̄ slightly under-estimates the true spread. CV is unitless, so it compares variability across different scales.</p>

<h3>Measures of position</h3>
<p><b>Q1</b> (25th percentile), <b>Q2</b> = median (50th), <b>Q3</b> (75th). The middle 50% of the data sits between Q1 and Q3.</p>
<div class="formula"><span class="lbl">Interquartile range</span>IQR = Q3 − Q1</div>

<h3>Ví dụ có lời giải · One dataset, all measures</h3>
<div class="out"><b>Data (sorted):</b> 2, 4, 4, 6, 9  (n = 5)<br>
• Mean: x̄ = (2+4+4+6+9)/5 = 25/5 = <b>5</b><br>
• Median: middle value = <b>4</b> · Mode = <b>4</b><br>
• Range = 9 − 2 = <b>7</b><br>
• Deviations from mean: −3,−1,−1,1,4 → squared: 9,1,1,1,16 → Σ = 28<br>
• Variance: s² = 28 / (5−1) = 28/4 = <b>7</b> · Std dev: s = √7 ≈ <b>2.65</b><br>
• CV = (2.65 / 5)·100% ≈ <b>53%</b></div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Detecting outliers with the 1.5·IQR rule.</b> A value is a suspected outlier if it lies below <b>Q1 − 1.5·IQR</b> or above <b>Q3 + 1.5·IQR</b>. This is exactly how a box plot flags odd points, and how you should sanity-check any real dataset before trusting its mean (one wild value can drag x̄ badly, while the median resists). Include this check in your computer project.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-256" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Compute all these in Python</span><span class="lc-sub">Data structures &amp; collections module.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Mô tả dữ liệu — bộ công thức đầy đủ</h2>
<p class="lead">Trước mọi suy diễn, bạn tóm tắt dữ liệu bằng ba nhóm số: <strong>tâm</strong> ở đâu, <strong>phân tán</strong> ra sao, và <strong>vị trí</strong> của các giá trị. Đây là tất cả.</p>

<h3>Đại lượng đo tâm</h3>
<div class="formula"><span class="lbl">Trung bình mẫu</span>x̄ = ( Σ xᵢ ) / n</div>
<p><b>Trung vị</b> = giá trị ở giữa khi sắp xếp (trung bình hai giá trị giữa nếu n chẵn). <b>Mode</b> = giá trị xuất hiện nhiều nhất.</p>

<h3>Đại lượng đo phân tán</h3>
<div class="formula"><span class="lbl">Khoảng biến thiên</span>Range = max − min</div>
<div class="formula"><span class="lbl">Phương sai mẫu</span>s² = Σ (xᵢ − x̄)² / (n − 1)</div>
<div class="formula"><span class="lbl">Độ lệch chuẩn mẫu</span>s = √(s²)   (cùng đơn vị với dữ liệu)</div>
<div class="formula"><span class="lbl">Hệ số biến thiên</span>CV = (s / x̄) · 100%</div>
<p>Ta chia phương sai cho <b>n − 1</b> (không phải n) — <em>hiệu chỉnh Bessel</em> — vì dùng chính trung bình mẫu x̄ ước lượng hơi thiếu độ phân tán thật. CV không có đơn vị, nên so được độ biến thiên giữa các thang khác nhau.</p>

<h3>Đại lượng đo vị trí</h3>
<p><b>Q1</b> (phân vị 25), <b>Q2</b> = trung vị (50), <b>Q3</b> (75). 50% giữa của dữ liệu nằm giữa Q1 và Q3.</p>
<div class="formula"><span class="lbl">Khoảng tứ phân vị</span>IQR = Q3 − Q1</div>

<h3>Ví dụ có lời giải · Một bộ dữ liệu, mọi đại lượng</h3>
<div class="out"><b>Dữ liệu (đã sắp):</b> 2, 4, 4, 6, 9  (n = 5)<br>
• Trung bình: x̄ = (2+4+4+6+9)/5 = 25/5 = <b>5</b><br>
• Trung vị: giá trị giữa = <b>4</b> · Mode = <b>4</b><br>
• Range = 9 − 2 = <b>7</b><br>
• Độ lệch khỏi trung bình: −3,−1,−1,1,4 → bình phương: 9,1,1,1,16 → Σ = 28<br>
• Phương sai: s² = 28 / (5−1) = 28/4 = <b>7</b> · Độ lệch chuẩn: s = √7 ≈ <b>2.65</b><br>
• CV = (2.65 / 5)·100% ≈ <b>53%</b></div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phát hiện ngoại lai bằng quy tắc 1.5·IQR.</b> Một giá trị bị nghi ngoại lai nếu nằm dưới <b>Q1 − 1.5·IQR</b> hoặc trên <b>Q3 + 1.5·IQR</b>. Đây đúng là cách box plot đánh dấu điểm bất thường, và cách bạn nên kiểm tra tỉnh táo mọi dữ liệu thật trước khi tin trung bình (một giá trị hoang có thể kéo lệch x̄, còn trung vị thì chống lại). Đưa bước kiểm này vào computer project.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-256" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Tính hết bằng Python</span><span class="lc-sub">Module cấu trúc dữ liệu &amp; collections.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '5.2 — Charts & the z/t lookup tables|||5.2 — Biểu đồ mô tả & bảng tra z/t',
          slug: 'mas291-bieu-do-bang-tra',
          type: 'VIDEO',
          description: 'Stem-and-leaf, bảng tần suất, histogram, box plot — dựng bằng tay; kèm cách tra bảng z và bảng t.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Drawing the data, and reading the two tables you need all semester</h2>
<p class="lead">Lesson 5.1 computed the numbers. Here you draw them — and learn to read the z and t tables, which every later chapter depends on and which the exam expects you to use without a calculator.</p>

<h3>The data set for all four charts</h3>
<div class="diagram">Exam marks of 20 students:
52 57 58 61 63 65 65 67 68 70 71 72 74 75 77 78 82 85 88 93</div>

<h3>1 · Stem-and-leaf — keeps every original value</h3>
<pre>Stem | Leaf              Count
  5  | 2 7 8               3
  6  | 1 3 5 5 7 8         6
  7  | 0 1 2 4 5 7 8       7
  8  | 2 5 8               3
  9  | 3                   1
Key: 6 | 3 means 63</pre>
<div class="out"><b>What it shows at a glance:</b> the shape is roughly symmetric with the bulk in the 60s and 70s. Unlike a histogram, <em>no information is lost</em> — you can read every original mark back off the diagram, which is why it is the tool for small data sets (n ≤ 50).</div>

<h3>2 · Frequency distribution → histogram</h3>
<div class="out"><b>Building the table.</b> Range = 93 − 52 = 41. Sturges' rule suggests k ≈ 1 + 3.322 log₁₀(20) ≈ 5.3 → take <b>5 classes</b>, width = 41/5 = 8.2 → round up to <b>10</b>, starting at 50.<br>
<table><thead><tr><th>Class</th><th>Tally</th><th>Frequency f</th><th>Relative f</th><th>Cumulative f</th></tr></thead><tbody>
<tr><td>50 – 59</td><td>|||</td><td>3</td><td>0.15</td><td>3</td></tr>
<tr><td>60 – 69</td><td>||||||</td><td>6</td><td>0.30</td><td>9</td></tr>
<tr><td>70 – 79</td><td>|||||||</td><td>7</td><td>0.35</td><td>16</td></tr>
<tr><td>80 – 89</td><td>|||</td><td>3</td><td>0.15</td><td>19</td></tr>
<tr><td>90 – 99</td><td>|</td><td>1</td><td>0.05</td><td>20</td></tr>
</tbody></table>
<b>Checks the marker looks for:</b> Σf = 20 = n ✓ · Σ relative f = 1.00 ✓ · the last cumulative frequency = n ✓. Classes must not overlap and must cover every value.<br>
<b>The histogram</b> plots these frequencies as adjacent bars with no gaps (the gaps belong to a bar chart, which is for <em>categorical</em> data — a distinction worth one mark).</div>

<h3>3 · Box plot — the five-number summary</h3>
<div class="out"><b>Compute the five numbers.</b> n = 20, data already sorted.<br>
Min = <b>52</b> · Max = <b>93</b><br>
Q2 (median) = average of the 10th and 11th values = (70 + 71)/2 = <b>70.5</b><br>
Q1 = median of the lower 10 = (63 + 65)/2 = <b>64</b> · Q3 = median of the upper 10 = (77 + 78)/2 = <b>77.5</b><br>
<b>IQR = Q3 − Q1 = 77.5 − 64 = 13.5</b><br>
<b>Outlier fences:</b> lower = Q1 − 1.5 × IQR = 64 − 20.25 = 43.75 · upper = Q3 + 1.5 × IQR = 77.5 + 20.25 = <b>97.75</b><br>
No value falls outside [43.75, 97.75] → <b>no outliers</b>; the whiskers therefore reach the true min and max.<br>
<div class="diagram">   52        64    70.5   77.5           93
    ├─────────┤▓▓▓▓▓|▓▓▓▓▓▓├──────────────┤
   min       Q1    Q2      Q3            max</div>
<b>Reading skew from the box:</b> the median sits slightly left of the box centre and the right whisker is longer → mild right skew, consistent with mean (70.6) &gt; median (70.5).</div>

<h3>4 · Reading the z table</h3>
<div class="out"><b>Φ(z) = P(Z ≤ z), cumulative from −∞.</b> Row = z to one decimal, column = the second decimal.<br>
<table><thead><tr><th>z</th><th>0.00</th><th>0.02</th><th>0.05</th><th>0.06</th></tr></thead><tbody>
<tr><td>1.2</td><td>0.8849</td><td>0.8888</td><td>0.8944</td><td>0.8962</td></tr>
<tr><td>1.5</td><td>0.9332</td><td>0.9357</td><td>0.9394</td><td>0.9406</td></tr>
<tr><td>1.9</td><td>0.9713</td><td>0.9726</td><td>0.9744</td><td>0.9750</td></tr>
</tbody></table>
<b>Φ(1.96) = 0.9750</b> → that is where the famous 1.96 comes from: it leaves 0.025 in each tail.<br>
<b>Negative z:</b> the table usually stops at 0, so use symmetry: Φ(−1.50) = 1 − Φ(1.50) = 1 − 0.9332 = <b>0.0668</b>.<br>
<b>Backwards (find z from a probability):</b> for a 95% CI you need the z with 0.9750 below it → read the body of the table for 0.9750 → z = 1.96.<br>
<b>The four values worth memorising:</b> 90% → 1.645 · 95% → 1.96 · 98% → 2.326 · 99% → 2.576.</div>

<h3>5 · Reading the t table</h3>
<div class="out"><b>The t table is indexed by degrees of freedom and by tail area α, not by the body.</b><br>
<table><thead><tr><th>df</th><th>t<sub>0.10</sub></th><th>t<sub>0.05</sub></th><th>t<sub>0.025</sub></th><th>t<sub>0.01</sub></th><th>t<sub>0.005</sub></th></tr></thead><tbody>
<tr><td>4</td><td>1.533</td><td>2.132</td><td>2.776</td><td>3.747</td><td>4.604</td></tr>
<tr><td>10</td><td>1.372</td><td>1.812</td><td>2.228</td><td>2.764</td><td>3.169</td></tr>
<tr><td>15</td><td>1.341</td><td>1.753</td><td>2.131</td><td>2.602</td><td>2.947</td></tr>
<tr><td>20</td><td>1.325</td><td>1.725</td><td>2.086</td><td>2.528</td><td>2.845</td></tr>
<tr><td>24</td><td>1.318</td><td>1.711</td><td>2.064</td><td>2.492</td><td>2.797</td></tr>
<tr><td>30</td><td>1.310</td><td>1.697</td><td>2.042</td><td>2.457</td><td>2.750</td></tr>
<tr><td>∞</td><td>1.282</td><td><b>1.645</b></td><td><b>1.960</b></td><td>2.326</td><td><b>2.576</b></td></tr>
</tbody></table>
<b>Two-sided 95% CI with df = 15</b> → each tail is 0.025 → column t<sub>0.025</sub> → <b>2.131</b>.<br>
<b>One-sided test at α = 0.05 with df = 20</b> → column t<sub>0.05</sub> → <b>1.725</b>. Using 2.086 there is the classic error: that column is for a two-sided test.<br>
<b>Notice the last row:</b> at df = ∞ the t values are exactly the z values. The t distribution <em>is</em> the normal, widened to pay for estimating σ — and the penalty vanishes as n grows, which is why n ≥ 30 lets you use z.<br>
<b>Bounding a p-value:</b> with df = 24 and t₀ = 2.50, scan the row — 2.492 &lt; 2.50 &lt; 2.797 → one tail is between 0.005 and 0.01 → two-sided p is between 0.01 and 0.02 (question 1 of PT3).</div>

<div class="pitfall"><b>Deciding the number of classes is not free choice.</b> Too few classes (2–3) hides the shape; too many (15 for n = 20) leaves most bars empty and equally hides it. Sturges' rule k ≈ 1 + 3.322 log₁₀ n gives a defensible number, and stating the rule earns the mark even if your k differs by one.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The box plot's 1.5 × IQR is a convention, not a theorem.</b> John Tukey chose 1.5 because for normal data it flags about 0.7% of observations — rare enough to be interesting, common enough to be useful. On a skewed distribution such as income it flags far more, which is why software offers 3 × IQR ("far out") and why a flagged point means "look at this", never "delete this". Removing points because a formula flagged them is one of the most common ways real analyses go wrong. <em>Beyond syllabus because the course gives the rule as fixed, while its interpretation is a judgement call you have to defend.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Vẽ dữ liệu ra, và đọc hai cái bảng dùng suốt cả kỳ</h2>
<p class="lead">Bài 5.1 đã tính ra các con số. Ở đây ta vẽ chúng — và học cách tra bảng z cùng bảng t, thứ mà mọi chương sau đều dựa vào và đề thi mong bạn dùng được mà không cần máy tính.</p>

<h3>Bộ dữ liệu dùng cho cả bốn loại biểu đồ</h3>
<div class="diagram">Điểm thi của 20 sinh viên:
52 57 58 61 63 65 65 67 68 70 71 72 74 75 77 78 82 85 88 93</div>

<h3>1 · Biểu đồ thân–lá — giữ nguyên mọi giá trị gốc</h3>
<pre>Thân | Lá                 Đếm
  5  | 2 7 8               3
  6  | 1 3 5 5 7 8         6
  7  | 0 1 2 4 5 7 8       7
  8  | 2 5 8               3
  9  | 3                   1
Chú giải: 6 | 3 nghĩa là 63</pre>
<div class="out"><b>Nhìn phát thấy ngay:</b> hình dạng khá đối xứng với phần lớn dữ liệu ở khoảng 60 và 70. Khác histogram, <em>không mất thông tin nào</em> — bạn đọc ngược lại được từng điểm gốc từ biểu đồ, và vì thế đây là công cụ cho bộ dữ liệu nhỏ (n ≤ 50).</div>

<h3>2 · Bảng phân bố tần suất → histogram</h3>
<div class="out"><b>Dựng bảng.</b> Khoảng biến thiên = 93 − 52 = 41. Quy tắc Sturges gợi ý k ≈ 1 + 3,322 log₁₀(20) ≈ 5,3 → lấy <b>5 lớp</b>, độ rộng = 41/5 = 8,2 → làm tròn lên <b>10</b>, bắt đầu từ 50.<br>
<table><thead><tr><th>Lớp</th><th>Vạch đếm</th><th>Tần số f</th><th>Tần suất</th><th>Tần số tích luỹ</th></tr></thead><tbody>
<tr><td>50 – 59</td><td>|||</td><td>3</td><td>0,15</td><td>3</td></tr>
<tr><td>60 – 69</td><td>||||||</td><td>6</td><td>0,30</td><td>9</td></tr>
<tr><td>70 – 79</td><td>|||||||</td><td>7</td><td>0,35</td><td>16</td></tr>
<tr><td>80 – 89</td><td>|||</td><td>3</td><td>0,15</td><td>19</td></tr>
<tr><td>90 – 99</td><td>|</td><td>1</td><td>0,05</td><td>20</td></tr>
</tbody></table>
<b>Những phép kiểm người chấm tìm:</b> Σf = 20 = n ✓ · Σ tần suất = 1,00 ✓ · tần số tích luỹ cuối = n ✓. Các lớp không được chồng nhau và phải phủ hết mọi giá trị.<br>
<b>Histogram</b> vẽ các tần số này thành những cột liền nhau không có khe hở (khe hở là của biểu đồ cột, vốn dành cho dữ liệu <em>định tính</em> — phân biệt này đáng một điểm).</div>

<h3>3 · Biểu đồ hộp — tóm tắt năm số</h3>
<div class="out"><b>Tính năm con số.</b> n = 20, dữ liệu đã sắp.<br>
Min = <b>52</b> · Max = <b>93</b><br>
Q2 (trung vị) = trung bình giá trị thứ 10 và 11 = (70 + 71)/2 = <b>70,5</b><br>
Q1 = trung vị của 10 giá trị dưới = (63 + 65)/2 = <b>64</b> · Q3 = trung vị của 10 giá trị trên = (77 + 78)/2 = <b>77,5</b><br>
<b>IQR = Q3 − Q1 = 77,5 − 64 = 13,5</b><br>
<b>Ngưỡng ngoại lai:</b> dưới = Q1 − 1,5 × IQR = 64 − 20,25 = 43,75 · trên = Q3 + 1,5 × IQR = 77,5 + 20,25 = <b>97,75</b><br>
Không giá trị nào nằm ngoài [43,75; 97,75] → <b>không có ngoại lai</b>; do đó hai râu vươn tới đúng min và max.<br>
<div class="diagram">   52        64    70,5   77,5           93
    ├─────────┤▓▓▓▓▓|▓▓▓▓▓▓├──────────────┤
   min       Q1    Q2      Q3            max</div>
<b>Đọc độ lệch từ cái hộp:</b> trung vị hơi lệch trái so với tâm hộp và râu phải dài hơn → lệch phải nhẹ, khớp với trung bình (70,6) &gt; trung vị (70,5).</div>

<h3>4 · Cách tra bảng z</h3>
<div class="out"><b>Φ(z) = P(Z ≤ z), tích luỹ từ −∞.</b> Hàng = z tới một chữ số thập phân, cột = chữ số thập phân thứ hai.<br>
<table><thead><tr><th>z</th><th>0,00</th><th>0,02</th><th>0,05</th><th>0,06</th></tr></thead><tbody>
<tr><td>1,2</td><td>0,8849</td><td>0,8888</td><td>0,8944</td><td>0,8962</td></tr>
<tr><td>1,5</td><td>0,9332</td><td>0,9357</td><td>0,9394</td><td>0,9406</td></tr>
<tr><td>1,9</td><td>0,9713</td><td>0,9726</td><td>0,9744</td><td>0,9750</td></tr>
</tbody></table>
<b>Φ(1,96) = 0,9750</b> → đó là nguồn gốc của con số 1,96 nổi tiếng: nó chừa 0,025 ở mỗi đuôi.<br>
<b>Với z âm:</b> bảng thường chỉ có từ 0 trở lên, nên dùng tính đối xứng: Φ(−1,50) = 1 − Φ(1,50) = 1 − 0,9332 = <b>0,0668</b>.<br>
<b>Tra ngược (từ xác suất tìm z):</b> muốn khoảng tin cậy 95% thì cần z có 0,9750 nằm dưới → dò trong thân bảng lấy 0,9750 → z = 1,96.<br>
<b>Bốn giá trị đáng thuộc:</b> 90% → 1,645 · 95% → 1,96 · 98% → 2,326 · 99% → 2,576.</div>

<h3>5 · Cách tra bảng t</h3>
<div class="out"><b>Bảng t đánh chỉ số theo bậc tự do và theo diện tích đuôi α, không tra trong thân bảng.</b><br>
<table><thead><tr><th>df</th><th>t<sub>0,10</sub></th><th>t<sub>0,05</sub></th><th>t<sub>0,025</sub></th><th>t<sub>0,01</sub></th><th>t<sub>0,005</sub></th></tr></thead><tbody>
<tr><td>4</td><td>1,533</td><td>2,132</td><td>2,776</td><td>3,747</td><td>4,604</td></tr>
<tr><td>10</td><td>1,372</td><td>1,812</td><td>2,228</td><td>2,764</td><td>3,169</td></tr>
<tr><td>15</td><td>1,341</td><td>1,753</td><td>2,131</td><td>2,602</td><td>2,947</td></tr>
<tr><td>20</td><td>1,325</td><td>1,725</td><td>2,086</td><td>2,528</td><td>2,845</td></tr>
<tr><td>24</td><td>1,318</td><td>1,711</td><td>2,064</td><td>2,492</td><td>2,797</td></tr>
<tr><td>30</td><td>1,310</td><td>1,697</td><td>2,042</td><td>2,457</td><td>2,750</td></tr>
<tr><td>∞</td><td>1,282</td><td><b>1,645</b></td><td><b>1,960</b></td><td>2,326</td><td><b>2,576</b></td></tr>
</tbody></table>
<b>Khoảng tin cậy 95% hai phía với df = 15</b> → mỗi đuôi 0,025 → cột t<sub>0,025</sub> → <b>2,131</b>.<br>
<b>Kiểm định một phía ở α = 0,05 với df = 20</b> → cột t<sub>0,05</sub> → <b>1,725</b>. Lấy 2,086 ở đây là lỗi kinh điển: cột đó dành cho kiểm định hai phía.<br>
<b>Để ý dòng cuối:</b> ở df = ∞, các giá trị t đúng bằng giá trị z. Phân phối t <em>chính là</em> phân phối chuẩn được nới rộng ra để trả giá cho việc phải ước lượng σ — và phần phạt đó tan biến khi n lớn, đó là lý do n ≥ 30 thì dùng z được.<br>
<b>Chặn giá trị p:</b> với df = 24 và t₀ = 2,50, dò dọc hàng — 2,492 &lt; 2,50 &lt; 2,797 → một đuôi nằm giữa 0,005 và 0,01 → p hai phía nằm giữa 0,01 và 0,02 (đúng câu 1 của PT3).</div>

<div class="pitfall"><b>Chọn số lớp không phải muốn bao nhiêu cũng được.</b> Quá ít lớp (2–3) giấu mất hình dạng; quá nhiều (15 lớp cho n = 20) làm hầu hết cột rỗng và cũng giấu mất hình dạng y như vậy. Quy tắc Sturges k ≈ 1 + 3,322 log₁₀ n cho một con số biện minh được, và nêu ra quy tắc là ăn điểm dù k của bạn lệch một đơn vị.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hệ số 1,5 × IQR của biểu đồ hộp là quy ước, không phải định lý.</b> John Tukey chọn 1,5 vì với dữ liệu chuẩn nó gắn cờ khoảng 0,7% số quan sát — đủ hiếm để đáng chú ý, đủ thường để có ích. Trên phân phối lệch như thu nhập thì nó gắn cờ nhiều hơn hẳn, vì thế phần mềm có thêm mức 3 × IQR ("rất xa") và vì thế một điểm bị gắn cờ nghĩa là "hãy xem lại điểm này", không bao giờ nghĩa là "hãy xoá nó đi". Xoá dữ liệu chỉ vì một công thức gắn cờ là một trong những cách phổ biến nhất khiến các phân tích thật đi sai. <em>Ngoài giáo trình vì môn học đưa quy tắc như một hằng số, còn cách diễn giải nó là một phán đoán bạn phải bảo vệ được.</em></div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — PHÂN PHỐI MẪU & CLT ══════════════════ */
    {
      title: 'Chapter 6 — Sampling distributions & the CLT|||Chương 6 — Phân phối mẫu & Định lý giới hạn trung tâm',
      description: 'Sai số chuẩn, Định lý giới hạn trung tâm, và công thức z cho trung bình mẫu — nền của suy diễn.',
      lessons: [
        {
          title: '6.1 — Standard error, the CLT & z for x̄|||6.1 — Sai số chuẩn, CLT & z cho x̄',
          slug: 'mas291-clt',
          type: 'VIDEO',
          description: 'Công thức E(x̄), sai số chuẩn σ/√n, CLT, và z cho trung bình mẫu; ví dụ giải chi tiết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>The idea that makes inference possible</h2>
<p class="lead">Take a sample, compute x̄. Take another, get a slightly different x̄. So <strong>x̄ itself is a random variable</strong> with its own distribution — and its shape is what lets us reason from one sample back to the population.</p>

<h3>The formulas</h3>
<div class="formula"><span class="lbl">Mean of the sample mean</span>E(x̄) = μ   (x̄ is unbiased)</div>
<div class="formula"><span class="lbl">Standard error of the mean</span>SE = σ / √n</div>
<div class="formula"><span class="lbl">Standardise a sample mean</span>z = (x̄ − μ) / (σ / √n)</div>
<p>The <b>standard error</b> is the standard deviation of x̄. It shrinks as n grows — bigger samples give more reliable means.</p>

<h3>The Central Limit Theorem (CLT)</h3>
<div class="formula"><span class="lbl">For large n (rule of thumb n ≥ 30)</span>x̄ ≈ Normal( μ, σ/√n )   — regardless of the population's shape</div>
<p>This is remarkable: even if the population is skewed or weird, the distribution of <em>sample means</em> becomes normal. This is <em>why</em> the normal appears everywhere and why the whole inference toolkit (Chapters 7–8) works with one formula.</p>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Setup:</b> a population with μ = 100, σ = 15. Take samples of n = 25.<br>
Standard error: SE = σ/√n = 15/√25 = 15/5 = <b>3</b>. So x̄ ~ Normal(100, 3).<br><br>
<b>P(x̄ &gt; 106)?</b> z = (106 − 100)/3 = 2.0 → P = 1 − Φ(2.0) = 1 − 0.9772 = <b>0.0228</b> (about 2.3%).<br>
Compare: a single value P(X &gt; 106) with σ=15 would give z = 0.4, P ≈ 0.34 — the mean of 25 is far more tightly clustered.</div>

<div class="pitfall"><b>Trap:</b> the CLT is about the distribution of the <em>mean</em> x̄, not the individual data. A skewed population stays skewed; it is the <em>averages</em> that turn normal. Also use σ/√n (the SE), not σ, when standardising a mean.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why σ/√n — and the "√n law".</b> Variances of independent variables add: Var(ΣX) = n·σ². Averaging (dividing the sum by n) shrinks variance by n², giving Var(x̄) = σ²/n, so SD(x̄) = σ/√n. The practical consequence: to <em>halve</em> your error you need <em>four times</em> the data. This √n law governs how big a sample you must collect — a crucial fact when planning experiments and budgets.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Ý tưởng khiến suy diễn trở nên khả thi</h2>
<p class="lead">Lấy một mẫu, tính x̄. Lấy mẫu khác, được x̄ hơi khác. Vậy <strong>bản thân x̄ là một biến ngẫu nhiên</strong> với phân phối riêng — và hình dạng của nó cho phép ta lập luận từ một mẫu ngược về tổng thể.</p>

<h3>Các công thức</h3>
<div class="formula"><span class="lbl">Kỳ vọng của trung bình mẫu</span>E(x̄) = μ   (x̄ không chệch)</div>
<div class="formula"><span class="lbl">Sai số chuẩn của trung bình</span>SE = σ / √n</div>
<div class="formula"><span class="lbl">Chuẩn hóa một trung bình mẫu</span>z = (x̄ − μ) / (σ / √n)</div>
<p><b>Sai số chuẩn</b> là độ lệch chuẩn của x̄. Nó co lại khi n lớn — mẫu lớn cho trung bình đáng tin hơn.</p>

<h3>Định lý giới hạn trung tâm (CLT)</h3>
<div class="formula"><span class="lbl">Với n lớn (quy tắc n ≥ 30)</span>x̄ ≈ Chuẩn( μ, σ/√n )   — bất kể hình dạng tổng thể</div>
<p>Điều này đáng kinh ngạc: dù tổng thể lệch hay kỳ lạ, phân phối của <em>trung bình mẫu</em> trở nên chuẩn. Đây là <em>lý do</em> phân phối chuẩn ở khắp nơi và vì sao toàn bộ bộ công cụ suy diễn (Chương 7–8) chạy với một công thức.</p>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Đề:</b> một tổng thể có μ = 100, σ = 15. Lấy mẫu n = 25.<br>
Sai số chuẩn: SE = σ/√n = 15/√25 = 15/5 = <b>3</b>. Vậy x̄ ~ Chuẩn(100, 3).<br><br>
<b>P(x̄ &gt; 106)?</b> z = (106 − 100)/3 = 2.0 → P = 1 − Φ(2.0) = 1 − 0.9772 = <b>0.0228</b> (khoảng 2.3%).<br>
So sánh: một giá trị đơn P(X &gt; 106) với σ=15 cho z = 0.4, P ≈ 0.34 — trung bình của 25 quan sát bám sát hơn nhiều.</div>

<div class="pitfall"><b>Bẫy:</b> CLT nói về phân phối của <em>trung bình</em> x̄, không phải từng dữ liệu. Tổng thể lệch vẫn lệch; chính các <em>trung bình</em> mới trở nên chuẩn. Cũng dùng σ/√n (sai số chuẩn), không phải σ, khi chuẩn hóa một trung bình.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao σ/√n — và "luật √n".</b> Phương sai của các biến độc lập cộng dồn: Var(ΣX) = n·σ². Lấy trung bình (chia tổng cho n) làm phương sai co lại n², cho Var(x̄) = σ²/n, nên SD(x̄) = σ/√n. Hệ quả thực tế: muốn <em>giảm một nửa</em> sai số cần <em>gấp bốn</em> lượng dữ liệu. Luật √n này chi phối cỡ mẫu bạn phải thu — một sự thật then chốt khi thiết kế thí nghiệm và ngân sách.</div>
</div>
`,
        },
        {
          title: '6.2 — Sampling distributions of proportions & differences|||6.2 — Phân phối mẫu của tỷ lệ & của hiệu',
          slug: 'mas291-phan-phoi-mau-ty-le-hieu',
          type: 'VIDEO',
          description: 'Phân phối mẫu của p̂, của x̄₁−x̄₂ và của p̂₁−p̂₂ — nền tảng bắt buộc trước khi làm khoảng tin cậy và kiểm định hai mẫu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Three more sampling distributions</h2>
<p class="lead">Lesson 6.1 gave you the sampling distribution of the mean x̄. Three others follow the same logic and are needed for every two-sample method later: the sample proportion, the difference of two means, and the difference of two proportions.</p>

<h3>1. Sampling distribution of a proportion p̂</h3>
<div class="formula"><span class="lbl">Distribution of the sample proportion</span>p̂ ~ N( p , p(1 − p)/n )     approximately<br>SE(p̂) = √( p(1 − p)/n )     z = (p̂ − p) / SE</div>
<div class="note-ct"><b>Condition:</b> the normal shape is safe only when <b>np ≥ 5 AND n(1 − p) ≥ 5</b> — both, not either. With p very close to 0 or 1 the distribution stays skewed until n is large, which is exactly what the two conditions detect.</div>
<div class="out"><b>Example.</b> 40% of a population support a policy (p = 0.4). In a sample of n = 100, what is P(p̂ &gt; 0.5)?<br>
Check: np = 40 ≥ 5 ✓, n(1−p) = 60 ≥ 5 ✓<br>
SE = √(0.4 × 0.6/100) = √0.0024 = 0.04899<br>
z = (0.5 − 0.4)/0.04899 = 2.04 → P = 1 − Φ(2.04) ≈ <b>0.0207</b>.</div>

<h3>2. Sampling distribution of a difference of means x̄₁ − x̄₂</h3>
<div class="formula"><span class="lbl">Two independent samples</span>x̄₁ − x̄₂ ~ N( μ₁ − μ₂ , σ₁²/n₁ + σ₂²/n₂ )<br>SE = √( σ₁²/n₁ + σ₂²/n₂ )</div>
<div class="pitfall"><b>Variances ADD, even for a difference.</b> It feels wrong the first time: you subtract the means but you <em>add</em> the variances. The reason is that both samples bring their own random error, and two sources of noise can only make the difference more variable — never less. Never write σ₁²/n₁ − σ₂²/n₂.</div>

<h3>3. Sampling distribution of a difference of proportions p̂₁ − p̂₂</h3>
<div class="formula"><span class="lbl">Two independent samples</span>p̂₁ − p̂₂ ~ N( p₁ − p₂ , p₁(1−p₁)/n₁ + p₂(1−p₂)/n₂ )<br>SE = √( p₁(1−p₁)/n₁ + p₂(1−p₂)/n₂ )</div>
<div class="out"><b>Example.</b> p₁ = 0.5 with n₁ = 100, p₂ = 0.4 with n₂ = 150. SE of the difference?<br>
SE = √(0.5×0.5/100 + 0.4×0.6/150) = √(0.0025 + 0.0016) = √0.0041 ≈ <b>0.064</b>.</div>

<h3>4. Point estimation — which statistic estimates which parameter</h3>
<table>
  <thead><tr><th>Population parameter</th><th>Point estimator</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>μ (mean)</td><td>x̄</td><td>unbiased: E(x̄) = μ</td></tr>
    <tr><td>σ² (variance)</td><td>s²</td><td>unbiased <b>only</b> when dividing by n − 1</td></tr>
    <tr><td>p (proportion)</td><td>p̂ = x/n</td><td>unbiased: E(p̂) = p</td></tr>
    <tr><td>μ₁ − μ₂</td><td>x̄₁ − x̄₂</td><td>unbiased</td></tr>
    <tr><td>p₁ − p₂</td><td>p̂₁ − p̂₂</td><td>unbiased</td></tr>
  </tbody>
</table>
<div class="note-ct">"Unbiased" means the estimator is right <em>on average</em> over many samples — it does not mean any single sample is correct. This is exactly why dividing by n − 1 in s² matters: dividing by n would make s² systematically too small, and the bias would never wash out no matter how many samples you took.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> Every formula on this page has the same shape: <b>estimate ± (nothing yet) with SE = √(variance/n)</b>. That common shape is why the next three chapters feel repetitive — a confidence interval is "estimate ± critical value × SE", and a test statistic is "(estimate − hypothesised value)/SE". Learn to identify the estimate and its SE, and every method in Chapters 7, 8 and the two-sample chapter reduces to filling in one template.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Simulate sampling distributions</span><span class="lc-sub">Draw many samples and watch the shape appear.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Ba phân phối mẫu nữa</h2>
<p class="lead">Bài 6.1 đã cho bạn phân phối mẫu của trung bình x̄. Ba phân phối sau theo cùng logic đó và là thứ bắt buộc cho mọi phương pháp hai mẫu về sau: tỷ lệ mẫu, hiệu hai trung bình, và hiệu hai tỷ lệ.</p>

<h3>1. Phân phối mẫu của tỷ lệ p̂</h3>
<div class="formula"><span class="lbl">Phân phối của tỷ lệ mẫu</span>p̂ ~ N( p , p(1 − p)/n )     xấp xỉ<br>SE(p̂) = √( p(1 − p)/n )     z = (p̂ − p) / SE</div>
<div class="note-ct"><b>Điều kiện:</b> dạng chuẩn chỉ an toàn khi <b>np ≥ 5 VÀ n(1 − p) ≥ 5</b> — cả hai, không phải một trong hai. Với p rất gần 0 hoặc 1, phân phối vẫn còn lệch cho tới khi n đủ lớn, và đó chính là thứ hai điều kiện này phát hiện.</div>
<div class="out"><b>Ví dụ.</b> 40% dân số ủng hộ một chính sách (p = 0.4). Trong mẫu n = 100, tính P(p̂ &gt; 0.5)?<br>
Kiểm: np = 40 ≥ 5 ✓, n(1−p) = 60 ≥ 5 ✓<br>
SE = √(0.4 × 0.6/100) = √0.0024 = 0.04899<br>
z = (0.5 − 0.4)/0.04899 = 2.04 → P = 1 − Φ(2.04) ≈ <b>0.0207</b>.</div>

<h3>2. Phân phối mẫu của hiệu hai trung bình x̄₁ − x̄₂</h3>
<div class="formula"><span class="lbl">Hai mẫu độc lập</span>x̄₁ − x̄₂ ~ N( μ₁ − μ₂ , σ₁²/n₁ + σ₂²/n₂ )<br>SE = √( σ₁²/n₁ + σ₂²/n₂ )</div>
<div class="pitfall"><b>Phương sai thì CỘNG, ngay cả khi lấy hiệu.</b> Lần đầu nhìn thấy sẽ thấy sai sai: bạn trừ các trung bình nhưng lại <em>cộng</em> các phương sai. Lý do là cả hai mẫu đều mang sai số ngẫu nhiên của riêng nó, và hai nguồn nhiễu chỉ có thể làm hiệu số biến động nhiều hơn — không bao giờ ít đi. Đừng bao giờ viết σ₁²/n₁ − σ₂²/n₂.</div>

<h3>3. Phân phối mẫu của hiệu hai tỷ lệ p̂₁ − p̂₂</h3>
<div class="formula"><span class="lbl">Hai mẫu độc lập</span>p̂₁ − p̂₂ ~ N( p₁ − p₂ , p₁(1−p₁)/n₁ + p₂(1−p₂)/n₂ )<br>SE = √( p₁(1−p₁)/n₁ + p₂(1−p₂)/n₂ )</div>
<div class="out"><b>Ví dụ.</b> p₁ = 0.5 với n₁ = 100, p₂ = 0.4 với n₂ = 150. Tính SE của hiệu?<br>
SE = √(0.5×0.5/100 + 0.4×0.6/150) = √(0.0025 + 0.0016) = √0.0041 ≈ <b>0.064</b>.</div>

<h3>4. Ước lượng điểm — thống kê nào ước lượng tham số nào</h3>
<table>
  <thead><tr><th>Tham số tổng thể</th><th>Ước lượng điểm</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>μ (trung bình)</td><td>x̄</td><td>không chệch: E(x̄) = μ</td></tr>
    <tr><td>σ² (phương sai)</td><td>s²</td><td>không chệch <b>chỉ khi</b> chia cho n − 1</td></tr>
    <tr><td>p (tỷ lệ)</td><td>p̂ = x/n</td><td>không chệch: E(p̂) = p</td></tr>
    <tr><td>μ₁ − μ₂</td><td>x̄₁ − x̄₂</td><td>không chệch</td></tr>
    <tr><td>p₁ − p₂</td><td>p̂₁ − p̂₂</td><td>không chệch</td></tr>
  </tbody>
</table>
<div class="note-ct">"Không chệch" nghĩa là ước lượng đúng <em>trung bình qua nhiều mẫu</em> — nó không có nghĩa là một mẫu đơn lẻ sẽ đúng. Đây chính là lý do việc chia cho n − 1 trong s² lại quan trọng: chia cho n sẽ làm s² nhỏ đi một cách hệ thống, và độ chệch đó không bao giờ mất đi dù bạn lấy bao nhiêu mẫu.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Mọi công thức trên trang này đều có cùng một hình dạng: <b>ước lượng, với SE = √(phương sai/n)</b>. Chính hình dạng chung đó khiến ba chương tiếp theo có cảm giác lặp lại — một khoảng tin cậy là "ước lượng ± giá trị tới hạn × SE", còn một thống kê kiểm định là "(ước lượng − giá trị giả thuyết)/SE". Hãy học cách nhận ra đâu là ước lượng và đâu là SE của nó, thì mọi phương pháp ở Chương 7, 8 và chương hai mẫu đều rút gọn thành việc điền vào một khuôn duy nhất.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Mô phỏng phân phối mẫu</span><span class="lc-sub">Lấy nhiều mẫu và xem hình dạng hiện ra.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 3 — Descriptive stats & sampling|||Quiz 3 — Thống kê mô tả & phân phối mẫu',
          slug: 'mas291-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra tóm tắt số, độ phân tán, sai số chuẩn và CLT.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'For skewed data with big outliers (e.g. incomes), the best measure of centre is…|||Với dữ liệu lệch có ngoại lai lớn (vd thu nhập), đại lượng đo tâm tốt nhất là…', options: ['the mean|||trung bình', 'the median|||trung vị', 'the mode|||mode', 'the range|||khoảng biến thiên'], correctIndex: 1, points: 1 },
              { question: 'Sample variance divides by n−1 (not n) in order to…|||Phương sai mẫu chia cho n−1 (không phải n) để…', options: ['make it larger|||làm nó lớn hơn', 'correct the bias from using the sample mean|||sửa độ lệch do dùng trung bình mẫu', 'match the median|||khớp trung vị', 'simplify the formula|||đơn giản công thức'], correctIndex: 1, points: 1 },
              { question: 'The standard error of the sample mean is…|||Sai số chuẩn của trung bình mẫu là…', options: ['σ', 'σ/√n', 'σ/n', 'σ·n'], correctIndex: 1, points: 1 },
              { question: 'The Central Limit Theorem says that, as n grows, the distribution of x̄ becomes…|||CLT nói rằng, khi n lớn, phân phối của x̄ trở nên…', options: ['skewed|||lệch', 'approximately normal regardless of the population shape|||gần chuẩn bất kể hình dạng tổng thể', 'uniform|||đều', 'identical to the population|||giống hệt tổng thể'], correctIndex: 1, points: 1 },
              { question: 'To halve the standard error, you must multiply the sample size by…|||Để giảm một nửa sai số chuẩn, phải nhân cỡ mẫu lên…', options: ['2', '4', '½', '√2'], correctIndex: 1, points: 1 },
              { question: 'The coefficient of variation CV = (s/x̄)·100% is useful because it…|||Hệ số biến thiên CV = (s/x̄)·100% hữu ích vì nó…', options: ['has the same units as the data|||cùng đơn vị với dữ liệu', 'is unitless, so it compares variability across different scales|||không đơn vị, nên so được biến thiên giữa các thang khác nhau', 'is always < 1|||luôn < 1', 'equals the mean|||bằng trung bình'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 7 — KHOẢNG TIN CẬY ══════════════════ */
    {
      title: 'Chapter 7 — Confidence intervals|||Chương 7 — Khoảng tin cậy',
      description: 'Bộ công thức đầy đủ: CI cho trung bình (z & t), CI cho tỷ lệ, biên sai số, và cỡ mẫu.',
      lessons: [
        {
          title: '7.1 — Estimating with a margin of error (all cases)|||7.1 — Ước lượng kèm biên sai số (đủ các trường hợp)',
          slug: 'mas291-khoang-tin-cay',
          type: 'VIDEO',
          description: 'Công thức CI cho trung bình (biết/không biết σ), CI cho tỷ lệ, giá trị tới hạn, và cỡ mẫu — kèm ví dụ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>From a sample to an interval you can trust</h2>
<p class="lead">A single x̄ is a <em>point estimate</em> — almost never exactly right. A <strong>confidence interval</strong> gives a range plus how confident we are the true parameter lies inside. Here is every case you will meet.</p>

<h3>The formulas</h3>
<div class="formula"><span class="lbl">CI for a mean — σ known</span>x̄ ± z<sub>α/2</sub> · (σ / √n)</div>
<div class="formula"><span class="lbl">CI for a mean — σ unknown</span>x̄ ± t<sub>α/2, n−1</sub> · (s / √n)</div>
<div class="formula"><span class="lbl">CI for a proportion</span>p̂ ± z<sub>α/2</sub> · √( p̂(1 − p̂) / n )</div>
<div class="formula"><span class="lbl">Margin of error &amp; sample size for a mean</span>E = z<sub>α/2</sub> · (σ/√n)     ⟹     n = ( z<sub>α/2</sub> · σ / E )²</div>
<p>The part after ± is the <b>margin of error</b>. Common critical values <b>z<sub>α/2</sub></b>: 90% → 1.645, 95% → 1.96, 99% → 2.576.</p>

<h3>How to choose the right one</h3>
<div class="lz-stack">
  <div class="lz-layer">Estimating a <b>mean</b>, population σ <b>given</b> → use the <b>z</b> formula.</div>
  <div class="lz-layer">Estimating a <b>mean</b>, only the sample s known (the real-life case) → use the <b>t</b> formula with n−1 degrees of freedom.</div>
  <div class="lz-layer">Estimating a <b>proportion / percentage</b> → use the proportion formula with p̂.</div>
  <div class="lz-layer">Asked "how large a sample for margin E?" → rearrange to the <b>n = (z·σ/E)²</b> formula (round up).</div>
</div>

<h3>Ví dụ có lời giải · Worked examples</h3>
<div class="out"><b>Example 1 (mean, σ known).</b> n = 36, x̄ = 50, σ = 6. Build a 95% CI for μ.<br>
SE = 6/√36 = 1 · Margin = 1.96 × 1 = 1.96 → CI = 50 ± 1.96 = <b>(48.04, 51.96)</b>.<br>
Interpretation: we are 95% confident μ lies between 48.04 and 51.96.</div>
<div class="out"><b>Example 2 (proportion).</b> In a poll of n = 400, 240 support a policy: p̂ = 240/400 = 0.60. 95% CI?<br>
SE = √(0.6·0.4/400) = √0.0006 = 0.0245 · Margin = 1.96 × 0.0245 ≈ 0.048 → CI = 0.60 ± 0.048 = <b>(0.552, 0.648)</b>, i.e. 55.2%–64.8%.</div>
<div class="out"><b>Example 3 (sample size).</b> How big a sample to estimate μ within E = 1, with σ = 6, 95% confidence?<br>
n = (1.96 · 6 / 1)² = (11.76)² = 138.3 → round up to <b>n = 139</b>.</div>

<div class="pitfall"><b>The interpretation trap:</b> "95% confident" does NOT mean "95% probability μ is in this interval". μ is fixed. It means: <em>if we repeated the sampling many times, 95% of the intervals we build would contain μ.</em> Also: higher confidence → wider interval (you trade precision for certainty).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why the t-distribution, really.</b> When you estimate σ with s, you add uncertainty, so the normal is too narrow — the <b>t-distribution</b> is slightly wider, controlled by the degrees of freedom (n−1). For small samples t is noticeably fatter-tailed; as n grows, t → z. Using z when you should use t gives intervals that are too optimistic (too narrow) — a subtle but real error the slides gloss over.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Từ một mẫu tới một khoảng đáng tin</h2>
<p class="lead">Một x̄ đơn là <em>ước lượng điểm</em> — gần như không bao giờ đúng y hệt. <strong>Khoảng tin cậy</strong> cho một khoảng cộng mức tin cậy rằng tham số thật nằm trong đó. Đây là mọi trường hợp bạn sẽ gặp.</p>

<h3>Các công thức</h3>
<div class="formula"><span class="lbl">CI cho trung bình — biết σ</span>x̄ ± z<sub>α/2</sub> · (σ / √n)</div>
<div class="formula"><span class="lbl">CI cho trung bình — không biết σ</span>x̄ ± t<sub>α/2, n−1</sub> · (s / √n)</div>
<div class="formula"><span class="lbl">CI cho tỷ lệ</span>p̂ ± z<sub>α/2</sub> · √( p̂(1 − p̂) / n )</div>
<div class="formula"><span class="lbl">Biên sai số &amp; cỡ mẫu cho trung bình</span>E = z<sub>α/2</sub> · (σ/√n)     ⟹     n = ( z<sub>α/2</sub> · σ / E )²</div>
<p>Phần sau dấu ± là <b>biên sai số</b>. Giá trị tới hạn <b>z<sub>α/2</sub></b> thường gặp: 90% → 1.645, 95% → 1.96, 99% → 2.576.</p>

<h3>Cách chọn đúng công thức</h3>
<div class="lz-stack">
  <div class="lz-layer">Ước lượng một <b>trung bình</b>, <b>biết</b> σ tổng thể → dùng công thức <b>z</b>.</div>
  <div class="lz-layer">Ước lượng một <b>trung bình</b>, chỉ biết s của mẫu (trường hợp thực tế) → dùng công thức <b>t</b> với n−1 bậc tự do.</div>
  <div class="lz-layer">Ước lượng một <b>tỷ lệ / phần trăm</b> → dùng công thức tỷ lệ với p̂.</div>
  <div class="lz-layer">Hỏi "cần cỡ mẫu bao nhiêu cho biên E?" → sắp lại thành công thức <b>n = (z·σ/E)²</b> (làm tròn lên).</div>
</div>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Ví dụ 1 (trung bình, biết σ).</b> n = 36, x̄ = 50, σ = 6. Lập CI 95% cho μ.<br>
SE = 6/√36 = 1 · Biên = 1.96 × 1 = 1.96 → CI = 50 ± 1.96 = <b>(48.04, 51.96)</b>.<br>
Diễn giải: ta tin cậy 95% rằng μ nằm giữa 48.04 và 51.96.</div>
<div class="out"><b>Ví dụ 2 (tỷ lệ).</b> Khảo sát n = 400, có 240 người ủng hộ: p̂ = 240/400 = 0.60. CI 95%?<br>
SE = √(0.6·0.4/400) = √0.0006 = 0.0245 · Biên = 1.96 × 0.0245 ≈ 0.048 → CI = 0.60 ± 0.048 = <b>(0.552, 0.648)</b>, tức 55.2%–64.8%.</div>
<div class="out"><b>Ví dụ 3 (cỡ mẫu).</b> Cần cỡ mẫu bao nhiêu để ước lượng μ trong biên E = 1, với σ = 6, tin cậy 95%?<br>
n = (1.96 · 6 / 1)² = (11.76)² = 138.3 → làm tròn lên <b>n = 139</b>.</div>

<div class="pitfall"><b>Bẫy diễn giải:</b> "tin cậy 95%" KHÔNG nghĩa là "xác suất 95% μ nằm trong khoảng này". μ cố định. Nó nghĩa là: <em>nếu lặp lấy mẫu nhiều lần, 95% các khoảng ta lập sẽ chứa μ.</em> Ngoài ra: tin cậy cao hơn → khoảng rộng hơn (đánh đổi độ chính xác lấy độ chắc chắn).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao dùng phân phối t, thực chất.</b> Khi ước lượng σ bằng s, bạn thêm độ bất định, nên phân phối chuẩn quá hẹp — <b>phân phối t</b> rộng hơn một chút, điều khiển bởi bậc tự do (n−1). Với mẫu nhỏ t có đuôi dày hơn rõ rệt; khi n lớn, t → z. Dùng z khi lẽ ra phải dùng t cho khoảng quá lạc quan (quá hẹp) — một lỗi tinh vi nhưng có thật mà slide lướt qua.</div>
</div>
`,
        },
        {
          title: '7.2 — One-sided confidence bounds|||7.2 — Khoảng tin cậy một phía',
          slug: 'mas291-khoang-tin-cay-mot-phia',
          type: 'VIDEO',
          description: 'Khi chỉ quan tâm một chiều: cận dưới / cận trên, dùng z_α thay vì z_{α/2} — và vì sao khoảng một phía chặt hơn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>When you only care about one direction</h2>
<p class="lead">Lesson 7.1 built two-sided intervals: "μ is between L and U". But many real questions only look one way — a supplier cares that strength is <em>at least</em> some value; a buyer cares that impurity is <em>at most</em> some value. For those, use a one-sided bound.</p>

<h3>The two forms</h3>
<div class="formula"><span class="lbl">Lower confidence bound (σ known)</span>μ ≥ x̄ − z<sub>α</sub> · (σ/√n)<br><small>"we are (1−α) confident μ is at least this"</small></div>
<div class="formula"><span class="lbl">Upper confidence bound (σ known)</span>μ ≤ x̄ + z<sub>α</sub> · (σ/√n)<br><small>"we are (1−α) confident μ is at most this"</small></div>
<div class="note-ct">If σ is unknown and the population is normal, replace z<sub>α</sub> with t<sub>α, n−1</sub> — exactly the same substitution rule as in Lesson 7.1.</div>

<h3>The one change that matters: z<sub>α</sub>, not z<sub>α/2</sub></h3>
<table>
  <thead><tr><th>Confidence</th><th>Two-sided z<sub>α/2</sub></th><th>One-sided z<sub>α</sub></th></tr></thead>
  <tbody>
    <tr><td>90%</td><td>1.645</td><td>1.282</td></tr>
    <tr><td>95%</td><td>1.960</td><td>1.645</td></tr>
    <tr><td>99%</td><td>2.576</td><td>2.326</td></tr>
  </tbody>
</table>
<div class="note-ct">A two-sided interval splits the risk α into two tails of α/2 each; a one-sided bound puts the entire α in one tail. Since all the risk sits on one side, the critical value is smaller — so a one-sided bound is <b>tighter</b> at the same confidence level. Notice that the one-sided 95% value (1.645) equals the two-sided 90% value: same tail area, 5% in one tail.</div>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Problem.</b> n = 25, x̄ = 120 MPa, σ = 10 MPa. Find a 95% lower confidence bound for mean strength.<br>
SE = 10/√25 = 2 · one-sided z<sub>0.05</sub> = 1.645<br>
μ ≥ 120 − 1.645 × 2 = 120 − 3.29 = <b>116.71 MPa</b><br>
Conclusion: we are 95% confident the true mean strength is at least 116.71 MPa.<br><br>
<b>Compare</b> with the two-sided 95% interval: 120 ± 1.96 × 2 = (116.08, 123.92). The lower end 116.08 is <em>lower</em> (weaker claim) than the one-sided bound 116.71 — proof that concentrating the risk on one side buys you a sharper statement in that direction.</div>

<div class="pitfall"><b>Trap:</b> using z<sub>α/2</sub> in a one-sided problem (or vice versa). Read the question for direction words — "at least", "minimum", "no less than" → lower bound; "at most", "maximum", "does not exceed" → upper bound; "between", "within" → two-sided. Also note a one-sided bound is a single number, not a pair: writing it as an interval (116.71, 123.29) is wrong — the correct statement is μ ≥ 116.71 with no upper limit.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> One-sided bounds and one-sided hypothesis tests are the same idea seen twice. A 95% lower bound of 116.71 tells you immediately that H₀: μ = 115 against H₁: μ &gt; 115 would be <em>rejected</em> at α = 0.05 (since 115 falls below the bound), while H₀: μ = 118 would not. This duality — a confidence bound is the set of hypothesised values you would fail to reject — is the cleanest way to connect Chapter 7 with Chapter 8.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Compute bounds in Python</span><span class="lc-sub">One-sided vs two-sided, side by side.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Khi bạn chỉ quan tâm một chiều</h2>
<p class="lead">Bài 7.1 dựng khoảng hai phía: "μ nằm giữa L và U". Nhưng nhiều câu hỏi thực tế chỉ nhìn một hướng — nhà cung cấp quan tâm độ bền <em>ít nhất</em> bằng bao nhiêu; người mua quan tâm tạp chất <em>nhiều nhất</em> là bao nhiêu. Với những trường hợp đó, dùng cận một phía.</p>

<h3>Hai dạng</h3>
<div class="formula"><span class="lbl">Cận dưới tin cậy (biết σ)</span>μ ≥ x̄ − z<sub>α</sub> · (σ/√n)<br><small>"ta tin cậy (1−α) rằng μ ít nhất bằng giá trị này"</small></div>
<div class="formula"><span class="lbl">Cận trên tin cậy (biết σ)</span>μ ≤ x̄ + z<sub>α</sub> · (σ/√n)<br><small>"ta tin cậy (1−α) rằng μ nhiều nhất bằng giá trị này"</small></div>
<div class="note-ct">Nếu chưa biết σ và tổng thể phân phối chuẩn, thay z<sub>α</sub> bằng t<sub>α, n−1</sub> — đúng cùng quy tắc thay thế như ở bài 7.1.</div>

<h3>Thay đổi duy nhất đáng kể: z<sub>α</sub>, không phải z<sub>α/2</sub></h3>
<table>
  <thead><tr><th>Độ tin cậy</th><th>Hai phía z<sub>α/2</sub></th><th>Một phía z<sub>α</sub></th></tr></thead>
  <tbody>
    <tr><td>90%</td><td>1.645</td><td>1.282</td></tr>
    <tr><td>95%</td><td>1.960</td><td>1.645</td></tr>
    <tr><td>99%</td><td>2.576</td><td>2.326</td></tr>
  </tbody>
</table>
<div class="note-ct">Khoảng hai phía chia rủi ro α thành hai đuôi, mỗi đuôi α/2; cận một phía dồn toàn bộ α vào một đuôi. Vì mọi rủi ro nằm về một bên nên giá trị tới hạn nhỏ hơn — do đó cận một phía <b>chặt hơn</b> ở cùng mức tin cậy. Để ý giá trị một phía 95% (1.645) bằng đúng giá trị hai phía 90%: cùng diện tích đuôi, 5% ở một đuôi.</div>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Đề.</b> n = 25, x̄ = 120 MPa, σ = 10 MPa. Tìm cận dưới tin cậy 95% cho độ bền trung bình.<br>
SE = 10/√25 = 2 · z một phía z<sub>0.05</sub> = 1.645<br>
μ ≥ 120 − 1.645 × 2 = 120 − 3.29 = <b>116.71 MPa</b><br>
Kết luận: ta tin cậy 95% rằng độ bền trung bình thật ít nhất là 116.71 MPa.<br><br>
<b>So sánh</b> với khoảng hai phía 95%: 120 ± 1.96 × 2 = (116.08, 123.92). Đầu dưới 116.08 <em>thấp hơn</em> (khẳng định yếu hơn) so với cận một phía 116.71 — chứng tỏ việc dồn rủi ro về một bên mua cho bạn một phát biểu sắc hơn theo hướng đó.</div>

<div class="pitfall"><b>Bẫy:</b> dùng z<sub>α/2</sub> cho bài toán một phía (hoặc ngược lại). Hãy đọc đề tìm từ chỉ hướng — "ít nhất", "tối thiểu", "không dưới" → cận dưới; "nhiều nhất", "tối đa", "không vượt quá" → cận trên; "nằm trong khoảng", "trong vòng" → hai phía. Cũng lưu ý cận một phía là MỘT số, không phải một cặp: viết nó thành khoảng (116.71, 123.29) là sai — phát biểu đúng là μ ≥ 116.71 và không có giới hạn trên.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Cận một phía và kiểm định giả thuyết một phía là cùng một ý tưởng nhìn hai lần. Cận dưới 95% bằng 116.71 cho bạn biết ngay rằng H₀: μ = 115 đối với H₁: μ &gt; 115 sẽ <em>bị bác bỏ</em> ở mức α = 0.05 (vì 115 nằm dưới cận), còn H₀: μ = 118 thì không. Tính đối ngẫu này — một cận tin cậy chính là tập các giá trị giả thuyết mà bạn sẽ không bác bỏ — là cách gọn gàng nhất để nối Chương 7 với Chương 8.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Tính các cận bằng Python</span><span class="lc-sub">Một phía vs hai phía, đặt cạnh nhau.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — KIỂM ĐỊNH GIẢ THUYẾT ══════════════════ */
    {
      title: 'Chapter 8 — Hypothesis testing|||Chương 8 — Kiểm định giả thuyết',
      description: 'Quy trình 5 bước đầy đủ, công thức thống kê kiểm định (z & t), quy tắc quyết định, p-value, và sai lầm loại I/II.',
      lessons: [
        {
          title: '8.1 — The full hypothesis-test procedure|||8.1 — Quy trình kiểm định đầy đủ',
          slug: 'mas291-kiem-dinh-gia-thuyet',
          type: 'VIDEO',
          description: 'H0/H1, α, thống kê z & t, quy tắc quyết định (critical value & p-value), ví dụ giải chi tiết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Proving a claim with data</h2>
<p class="lead">A hypothesis test answers: "could this result be just chance, or is it real?" Like a courtroom, we <em>assume innocence</em> (H₀) and reject it only if the evidence is strong enough.</p>

<h3>The five steps (memorise this recipe)</h3>
<div class="lz-flow">
  <div class="lz-step">1 · State H₀ (=, no effect) &amp; H₁ (the claim: ≠, &gt;, or &lt;)</div>
  <div class="lz-step">2 · Choose α (usually 0.05)</div>
  <div class="lz-step">3 · Compute the test statistic (z or t)</div>
  <div class="lz-step">4 · Find the p-value (or compare to the critical value)</div>
  <div class="lz-step">5 · Decide: p &lt; α → reject H₀</div>
</div>

<h3>The test statistics</h3>
<div class="formula"><span class="lbl">z-test for a mean (σ known)</span>z = (x̄ − μ₀) / (σ / √n)</div>
<div class="formula"><span class="lbl">t-test for a mean (σ unknown)</span>t = (x̄ − μ₀) / (s / √n),  df = n − 1</div>
<div class="formula"><span class="lbl">z-test for a proportion</span>z = (p̂ − p₀) / √( p₀(1 − p₀) / n )</div>
<p>The test statistic measures how many standard errors the sample result is from the value claimed in H₀. The <b>p-value</b> is the probability of a result this extreme <em>if H₀ were true</em>: small p (below α) means the data would be surprising under H₀, so we reject it.</p>

<h3>Decision rules (two-tailed at α = 0.05)</h3>
<table>
  <thead><tr><th>Test type</th><th>Reject H₀ if…</th></tr></thead>
  <tbody>
    <tr><td>Two-tailed (H₁: ≠)</td><td>|z| &gt; 1.96, or p &lt; α</td></tr>
    <tr><td>Right-tailed (H₁: &gt;)</td><td>z &gt; 1.645</td></tr>
    <tr><td>Left-tailed (H₁: &lt;)</td><td>z &lt; −1.645</td></tr>
  </tbody>
</table>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Claim:</b> a machine fills bottles to μ₀ = 500ml. Sample n = 25, x̄ = 496, σ = 10. Test at α = 0.05 (two-tailed).<br>
<b>Step 1:</b> H₀: μ = 500 · H₁: μ ≠ 500.<br>
<b>Step 3:</b> z = (496 − 500) / (10/√25) = −4 / 2 = <b>−2.0</b>.<br>
<b>Step 4–5:</b> |−2.0| = 2.0 &gt; 1.96 → <b>reject H₀</b>. p-value ≈ 0.0455 &lt; 0.05.<br>
Conclusion: there is significant evidence the machine is not filling to 500ml.</div>

<div class="pitfall"><b>Trap:</b> "fail to reject H₀" is NOT "H₀ is proven true" — only "not enough evidence against it". And statistical significance ≠ practical importance: with a huge n, a tiny meaningless difference can be "significant".</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Type I &amp; II errors and power.</b> Two ways to be wrong: <b>Type I</b> (probability α) = rejecting a true H₀ (a false alarm); <b>Type II</b> (probability β) = failing to reject a false H₀ (a miss). <b>Power</b> = 1 − β = the chance of correctly detecting a real effect. Lowering α (fewer false alarms) raises β (more misses) — a fundamental trade-off; only more data raises power without that cost. Understanding β and power is what separates a real analyst, and it is a common viva question.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Chứng minh một khẳng định bằng dữ liệu</h2>
<p class="lead">Kiểm định giả thuyết trả lời: "kết quả này có thể chỉ do ngẫu nhiên, hay là thật?" Như một phiên tòa, ta <em>giả định vô tội</em> (H₀) và chỉ bác bỏ nếu bằng chứng đủ mạnh.</p>

<h3>Năm bước (thuộc lòng công thức này)</h3>
<div class="lz-flow">
  <div class="lz-step">1 · Nêu H₀ (=, không hiệu ứng) &amp; H₁ (khẳng định: ≠, &gt;, hoặc &lt;)</div>
  <div class="lz-step">2 · Chọn α (thường 0.05)</div>
  <div class="lz-step">3 · Tính thống kê kiểm định (z hoặc t)</div>
  <div class="lz-step">4 · Tìm p-value (hoặc so với giá trị tới hạn)</div>
  <div class="lz-step">5 · Quyết định: p &lt; α → bác bỏ H₀</div>
</div>

<h3>Các thống kê kiểm định</h3>
<div class="formula"><span class="lbl">z-test cho trung bình (biết σ)</span>z = (x̄ − μ₀) / (σ / √n)</div>
<div class="formula"><span class="lbl">t-test cho trung bình (không biết σ)</span>t = (x̄ − μ₀) / (s / √n),  df = n − 1</div>
<div class="formula"><span class="lbl">z-test cho tỷ lệ</span>z = (p̂ − p₀) / √( p₀(1 − p₀) / n )</div>
<p>Thống kê kiểm định đo kết quả mẫu cách giá trị H₀ khẳng định bao nhiêu sai số chuẩn. <b>p-value</b> là xác suất một kết quả cực đoan như thế này <em>nếu H₀ đúng</em>: p nhỏ (dưới α) nghĩa là dữ liệu sẽ bất ngờ dưới H₀, nên ta bác bỏ nó.</p>

<h3>Quy tắc quyết định (hai phía ở α = 0.05)</h3>
<table>
  <thead><tr><th>Loại kiểm định</th><th>Bác bỏ H₀ nếu…</th></tr></thead>
  <tbody>
    <tr><td>Hai phía (H₁: ≠)</td><td>|z| &gt; 1.96, hoặc p &lt; α</td></tr>
    <tr><td>Phải (H₁: &gt;)</td><td>z &gt; 1.645</td></tr>
    <tr><td>Trái (H₁: &lt;)</td><td>z &lt; −1.645</td></tr>
  </tbody>
</table>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Khẳng định:</b> một máy rót chai tới μ₀ = 500ml. Mẫu n = 25, x̄ = 496, σ = 10. Kiểm định ở α = 0.05 (hai phía).<br>
<b>Bước 1:</b> H₀: μ = 500 · H₁: μ ≠ 500.<br>
<b>Bước 3:</b> z = (496 − 500) / (10/√25) = −4 / 2 = <b>−2.0</b>.<br>
<b>Bước 4–5:</b> |−2.0| = 2.0 &gt; 1.96 → <b>bác bỏ H₀</b>. p-value ≈ 0.0455 &lt; 0.05.<br>
Kết luận: có bằng chứng ý nghĩa rằng máy không rót đúng 500ml.</div>

<div class="pitfall"><b>Bẫy:</b> "không bác bỏ được H₀" KHÔNG phải "H₀ được chứng minh đúng" — chỉ là "chưa đủ bằng chứng chống lại nó". Và ý nghĩa thống kê ≠ ý nghĩa thực tế: với n rất lớn, một khác biệt nhỏ vô nghĩa vẫn có thể "ý nghĩa".</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Sai lầm loại I & II và sức mạnh.</b> Hai cách sai: <b>Loại I</b> (xác suất α) = bác bỏ H₀ đúng (báo động giả); <b>Loại II</b> (xác suất β) = không bác bỏ H₀ sai (bỏ sót). <b>Sức mạnh (power)</b> = 1 − β = khả năng phát hiện đúng một hiệu ứng thật. Giảm α (ít báo động giả) làm tăng β (nhiều bỏ sót) — một đánh đổi cơ bản; chỉ có thêm dữ liệu mới tăng power mà không phải trả giá đó. Hiểu β và power tách một nhà phân tích thật, và là câu vấn đáp phổ biến.</div>
</div>
`,
        },
        {
          title: 'Quiz 4 — Confidence intervals & hypothesis testing|||Quiz 4 — Khoảng tin cậy & kiểm định',
          slug: 'mas291-quiz-4',
          type: 'QUIZ',
          description: 'Kiểm tra chọn công thức CI, tính thống kê kiểm định, diễn giải và sai lầm loại I/II.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'When estimating a mean and only the sample s is known, the correct CI uses…|||Khi ước lượng trung bình mà chỉ biết s của mẫu, CI đúng dùng…', options: ['the z-distribution|||phân phối z', 'the t-distribution with n−1 df|||phân phối t với n−1 bậc tự do', 'the binomial|||nhị thức', 'the proportion formula|||công thức tỷ lệ'], correctIndex: 1, points: 1 },
              { question: 'The sample size to estimate μ within margin E is n =…|||Cỡ mẫu để ước lượng μ trong biên E là n =…', options: ['(z·σ/E)²', 'z·σ·E', 'E/(z·σ)', 'z²·E·σ'], correctIndex: 0, points: 1 },
              { question: '"95% confident" correctly means…|||"Tin cậy 95%" đúng nghĩa là…', options: ['95% probability μ is in this one interval|||xác suất 95% μ nằm trong khoảng này', 'if we repeated sampling, 95% of such intervals would contain μ|||nếu lặp lấy mẫu, 95% các khoảng như vậy sẽ chứa μ', 'the sample is 95% of the population|||mẫu là 95% tổng thể', 'the error is 5%|||sai số là 5%'], correctIndex: 1, points: 1 },
              { question: 'The z-test statistic for a mean (σ known) is…|||Thống kê z-test cho trung bình (biết σ) là…', options: ['(x̄ − μ₀)/(σ/√n)', 'x̄ − μ₀', '(x̄ − μ₀)·n', 'σ/√n'], correctIndex: 0, points: 1 },
              { question: 'A small p-value (p < α) means…|||p-value nhỏ (p < α) nghĩa là…', options: ['H₀ is definitely true|||H₀ chắc chắn đúng', 'the data would be very surprising if H₀ were true, so reject H₀|||dữ liệu sẽ rất bất ngờ nếu H₀ đúng, nên bác bỏ H₀', 'accept H₀|||chấp nhận H₀', 'the sample is too small|||mẫu quá nhỏ'], correctIndex: 1, points: 1 },
              { question: 'A Type I error is…|||Sai lầm loại I là…', options: ['failing to reject a false H₀|||không bác bỏ H₀ sai', 'rejecting a true H₀ (false alarm)|||bác bỏ H₀ đúng (báo động giả)', 'a calculation mistake|||lỗi tính toán', 'using the wrong mean|||dùng sai trung bình'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 9 — SUY LUẬN HAI MẪU ══════════════════ */
    {
      title: 'Chapter 9 — Inference for two samples|||Chương 9 — Suy luận hai mẫu',
      description: 'So sánh hai tổng thể: hiệu hai trung bình (3 trường hợp), hiệu hai tỷ lệ, và mẫu cặp — phần lớn nhất của PT3.',
      lessons: [
        {
          title: '9.1 — Difference of two means: which of the three cases|||9.1 — Hiệu hai trung bình: rơi vào trường hợp nào trong ba',
          slug: 'mas291-hai-trung-binh',
          type: 'VIDEO',
          description: 'Biết σ → z; chưa biết nhưng σ₁=σ₂ → t với phương sai gộp; σ₁≠σ₂ → Welch. Kèm CI và cách đọc "khoảng có chứa 0".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Comparing two population means</h2>
<p class="lead">Everything you did in Chapters 7 and 8 for one mean now happens for the <em>difference</em> μ₁ − μ₂. The template is unchanged — estimate ± critical × SE — only the SE changes, and it changes in three ways depending on what you know about the variances.</p>

<h3>Case 1 — both σ₁ and σ₂ known → use z</h3>
<div class="formula"><span class="lbl">CI for μ₁ − μ₂ (σ known)</span>(x̄₁ − x̄₂) ± z<sub>α/2</sub> · √( σ₁²/n₁ + σ₂²/n₂ )</div>

<h3>Case 2 — σ unknown but assumed equal → pooled t</h3>
<div class="formula"><span class="lbl">Pooled variance</span>s<sub>p</sub>² = [ (n₁ − 1)·s₁² + (n₂ − 1)·s₂² ] / (n₁ + n₂ − 2)</div>
<div class="formula"><span class="lbl">CI for μ₁ − μ₂ (pooled)</span>(x̄₁ − x̄₂) ± t<sub>α/2, n₁+n₂−2</sub> · s<sub>p</sub> · √( 1/n₁ + 1/n₂ )<br>df = n₁ + n₂ − 2</div>
<div class="note-ct">The pooled variance is a <b>weighted average</b> of the two sample variances, weighted by degrees of freedom (n−1 each). It only makes sense if the two populations really do have similar spread — a common rule of thumb is that the larger s should not exceed twice the smaller.</div>

<h3>Case 3 — σ unknown and clearly unequal → Welch</h3>
<div class="formula"><span class="lbl">Welch (unequal variances)</span>SE = √( s₁²/n₁ + s₂²/n₂ )<br>(x̄₁ − x̄₂) ± t<sub>α/2, df</sub> · SE, with df from the Welch–Satterthwaite formula</div>
<div class="note-ct">Welch does not pool: each sample keeps its own variance. The degrees of freedom come out as a messy non-integer number, which exams usually give you or round down — you are not expected to compute the Welch–Satterthwaite expression by hand.</div>

<h3>The decision table</h3>
<table>
  <thead><tr><th>What you are given</th><th>Use</th><th>df</th></tr></thead>
  <tbody>
    <tr><td>σ₁, σ₂ known</td><td>z</td><td>—</td></tr>
    <tr><td>s₁, s₂ only; variances assumed equal</td><td>pooled t</td><td>n₁ + n₂ − 2</td></tr>
    <tr><td>s₁, s₂ only; variances clearly unequal</td><td>Welch t</td><td>given / Welch formula</td></tr>
  </tbody>
</table>

<h3>Hypothesis test on the difference</h3>
<div class="formula"><span class="lbl">Test statistic</span>t (or z) = [ (x̄₁ − x̄₂) − Δ₀ ] / SE<br>usually Δ₀ = 0, testing H₀: μ₁ = μ₂</div>

<h3>Ví dụ có lời giải · Worked example (pooled)</h3>
<div class="out"><b>Problem.</b> Method A: n₁ = 10, x̄₁ = 85, s₁ = 4. Method B: n₂ = 12, x̄₂ = 81, s₂ = 5. Assume equal variances. Build a 95% CI for μ₁ − μ₂ and test H₀: μ₁ = μ₂ at α = 0.05.<br><br>
<b>Step 1 — pooled variance.</b> s<sub>p</sub>² = [9×16 + 11×25]/(10+12−2) = (144 + 275)/20 = 419/20 = 20.95 → s<sub>p</sub> = 4.577<br>
<b>Step 2 — SE.</b> SE = 4.577 × √(1/10 + 1/12) = 4.577 × √0.18333 = 4.577 × 0.4282 = 1.960<br>
<b>Step 3 — critical value.</b> df = 20, t<sub>0.025,20</sub> = 2.086<br>
<b>Step 4 — CI.</b> (85 − 81) ± 2.086 × 1.960 = 4 ± 4.088 = <b>(−0.088, 8.088)</b><br>
<b>Step 5 — test.</b> t = (4 − 0)/1.960 = 2.041. Since |2.041| &lt; 2.086, <b>do not reject H₀</b>.<br>
Both routes agree — as they must, because the interval contains 0.</div>

<div class="callout"><span class="badge">★ Reading the interval</span> <b>Does the interval contain 0?</b><br>
· <b>Contains 0</b> → the difference could plausibly be zero → you cannot claim the means differ (fail to reject H₀).<br>
· <b>Does not contain 0</b> → zero is not a plausible value → the means differ significantly (reject H₀).<br>
This is the fastest sanity check in the whole chapter, and it is exactly equivalent to the two-sided test at the matching α.</div>
<div class="pitfall"><b>Traps:</b> (1) subtracting variances instead of adding — SE always adds the two variance terms; (2) using df = n₁ + n₂ instead of n₁ + n₂ − 2 for the pooled case; (3) forgetting to take the square root of s<sub>p</sub>² before multiplying; (4) mixing up which sample is "1" — decide the order at the start and keep it, because the sign of the difference (and hence the interpretation) depends on it.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Run a two-sample t-test</span><span class="lc-sub">Compare pooled vs Welch in Python.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>So sánh trung bình của hai tổng thể</h2>
<p class="lead">Mọi thứ bạn đã làm ở Chương 7 và 8 cho một trung bình giờ diễn ra cho <em>hiệu</em> μ₁ − μ₂. Khuôn mẫu không đổi — ước lượng ± tới hạn × SE — chỉ có SE thay đổi, và nó thay đổi theo ba cách tuỳ vào bạn biết gì về phương sai.</p>

<h3>Trường hợp 1 — biết cả σ₁ và σ₂ → dùng z</h3>
<div class="formula"><span class="lbl">CI cho μ₁ − μ₂ (biết σ)</span>(x̄₁ − x̄₂) ± z<sub>α/2</sub> · √( σ₁²/n₁ + σ₂²/n₂ )</div>

<h3>Trường hợp 2 — chưa biết σ nhưng giả định bằng nhau → t với phương sai gộp</h3>
<div class="formula"><span class="lbl">Phương sai gộp</span>s<sub>p</sub>² = [ (n₁ − 1)·s₁² + (n₂ − 1)·s₂² ] / (n₁ + n₂ − 2)</div>
<div class="formula"><span class="lbl">CI cho μ₁ − μ₂ (gộp)</span>(x̄₁ − x̄₂) ± t<sub>α/2, n₁+n₂−2</sub> · s<sub>p</sub> · √( 1/n₁ + 1/n₂ )<br>df = n₁ + n₂ − 2</div>
<div class="note-ct">Phương sai gộp là <b>trung bình có trọng số</b> của hai phương sai mẫu, trọng số là bậc tự do (mỗi cái n−1). Nó chỉ có nghĩa khi hai tổng thể thực sự có độ phân tán tương đương — quy tắc ngón tay cái thường dùng là s lớn hơn không nên vượt quá hai lần s nhỏ hơn.</div>

<h3>Trường hợp 3 — chưa biết σ và rõ ràng khác nhau → Welch</h3>
<div class="formula"><span class="lbl">Welch (phương sai không bằng nhau)</span>SE = √( s₁²/n₁ + s₂²/n₂ )<br>(x̄₁ − x̄₂) ± t<sub>α/2, df</sub> · SE, với df từ công thức Welch–Satterthwaite</div>
<div class="note-ct">Welch không gộp: mỗi mẫu giữ phương sai riêng của nó. Bậc tự do ra một số lẻ không nguyên, mà đề thi thường cho sẵn hoặc làm tròn xuống — bạn không được kỳ vọng tính biểu thức Welch–Satterthwaite bằng tay.</div>

<h3>Bảng quyết định</h3>
<table>
  <thead><tr><th>Đề cho bạn cái gì</th><th>Dùng</th><th>df</th></tr></thead>
  <tbody>
    <tr><td>Biết σ₁, σ₂</td><td>z</td><td>—</td></tr>
    <tr><td>Chỉ có s₁, s₂; giả định phương sai bằng nhau</td><td>t gộp</td><td>n₁ + n₂ − 2</td></tr>
    <tr><td>Chỉ có s₁, s₂; phương sai rõ ràng khác nhau</td><td>t Welch</td><td>cho sẵn / công thức Welch</td></tr>
  </tbody>
</table>

<h3>Kiểm định giả thuyết trên hiệu</h3>
<div class="formula"><span class="lbl">Thống kê kiểm định</span>t (hoặc z) = [ (x̄₁ − x̄₂) − Δ₀ ] / SE<br>thường Δ₀ = 0, tức kiểm định H₀: μ₁ = μ₂</div>

<h3>Ví dụ có lời giải (dùng phương sai gộp)</h3>
<div class="out"><b>Đề.</b> Phương pháp A: n₁ = 10, x̄₁ = 85, s₁ = 4. Phương pháp B: n₂ = 12, x̄₂ = 81, s₂ = 5. Giả định phương sai bằng nhau. Lập CI 95% cho μ₁ − μ₂ và kiểm định H₀: μ₁ = μ₂ ở α = 0.05.<br><br>
<b>Bước 1 — phương sai gộp.</b> s<sub>p</sub>² = [9×16 + 11×25]/(10+12−2) = (144 + 275)/20 = 419/20 = 20.95 → s<sub>p</sub> = 4.577<br>
<b>Bước 2 — SE.</b> SE = 4.577 × √(1/10 + 1/12) = 4.577 × √0.18333 = 4.577 × 0.4282 = 1.960<br>
<b>Bước 3 — giá trị tới hạn.</b> df = 20, t<sub>0.025,20</sub> = 2.086<br>
<b>Bước 4 — CI.</b> (85 − 81) ± 2.086 × 1.960 = 4 ± 4.088 = <b>(−0.088, 8.088)</b><br>
<b>Bước 5 — kiểm định.</b> t = (4 − 0)/1.960 = 2.041. Vì |2.041| &lt; 2.086, <b>không bác bỏ H₀</b>.<br>
Hai con đường cho cùng kết luận — tất yếu phải vậy, vì khoảng có chứa 0.</div>

<div class="callout"><span class="badge">★ Cách đọc khoảng</span> <b>Khoảng có chứa 0 không?</b><br>
· <b>Có chứa 0</b> → hiệu số hoàn toàn có thể bằng không → bạn không thể khẳng định hai trung bình khác nhau (không bác bỏ H₀).<br>
· <b>Không chứa 0</b> → 0 không phải giá trị hợp lý → hai trung bình khác nhau có ý nghĩa thống kê (bác bỏ H₀).<br>
Đây là phép kiểm tra nhanh hữu ích nhất cả chương, và nó tương đương chính xác với kiểm định hai phía ở cùng mức α.</div>
<div class="pitfall"><b>Các bẫy:</b> (1) trừ phương sai thay vì cộng — SE luôn CỘNG hai số hạng phương sai; (2) dùng df = n₁ + n₂ thay vì n₁ + n₂ − 2 cho trường hợp gộp; (3) quên lấy căn bậc hai của s<sub>p</sub>² trước khi nhân; (4) lẫn lộn mẫu nào là "1" — hãy quyết thứ tự ngay từ đầu và giữ nguyên, vì dấu của hiệu (và do đó cách diễn giải) phụ thuộc vào nó.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Chạy kiểm định t hai mẫu</span><span class="lc-sub">So sánh gộp vs Welch bằng Python.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '9.2 — Difference of two proportions|||9.2 — Hiệu hai tỷ lệ',
          slug: 'mas291-hai-ty-le',
          type: 'VIDEO',
          description: 'CI cho p₁−p₂ dùng SE riêng, còn kiểm định dùng tỷ lệ GỘP p̂ — điểm khác biệt hay bị nhầm nhất.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Comparing two proportions</h2>
<p class="lead">Same template again — but this topic has one genuine subtlety: the standard error you use for the <em>confidence interval</em> is not the one you use for the <em>test</em>.</p>

<h3>Confidence interval — separate standard errors</h3>
<div class="formula"><span class="lbl">CI for p₁ − p₂</span>(p̂₁ − p̂₂) ± z<sub>α/2</sub> · √( p̂₁(1−p̂₁)/n₁ + p̂₂(1−p̂₂)/n₂ )</div>

<h3>Hypothesis test — POOLED proportion</h3>
<div class="formula"><span class="lbl">Pooled proportion</span>p̂ = (x₁ + x₂) / (n₁ + n₂)     <small>total successes over total trials</small></div>
<div class="formula"><span class="lbl">Test statistic for H₀: p₁ = p₂</span>z = (p̂₁ − p̂₂) / √( p̂(1 − p̂) · (1/n₁ + 1/n₂) )</div>
<div class="note-ct"><b>Why the difference?</b> Under H₀ the two proportions are <em>assumed equal</em>, so the best estimate of that single common value is all the successes pooled together. A confidence interval makes no such assumption — it lets each sample speak for itself. This mirrors Lesson 8.1, where the test for one proportion also uses p₀ from H₀ in the denominator rather than p̂.</div>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Problem.</b> Machine 1: 30 defects out of n₁ = 200. Machine 2: 20 defects out of n₂ = 250. Test H₀: p₁ = p₂ at α = 0.05, and build a 95% CI.<br><br>
p̂₁ = 30/200 = 0.15 · p̂₂ = 20/250 = 0.08 · difference = 0.07<br><br>
<b>Test (pooled).</b> p̂ = (30 + 20)/(200 + 250) = 50/450 = 0.1111<br>
SE<sub>test</sub> = √(0.1111 × 0.8889 × (1/200 + 1/250)) = √(0.09877 × 0.009) = √0.000889 = 0.02982<br>
z = 0.07/0.02982 = <b>2.35</b> → |2.35| &gt; 1.96 → <b>reject H₀</b>: the defect rates differ.<br><br>
<b>CI (separate SEs).</b> SE<sub>CI</sub> = √(0.15×0.85/200 + 0.08×0.92/250) = √(0.0006375 + 0.0002944) = √0.0009319 = 0.03053<br>
CI = 0.07 ± 1.96 × 0.03053 = 0.07 ± 0.0598 = <b>(0.0102, 0.1298)</b><br>
The interval excludes 0, agreeing with the rejection above.</div>
<div class="note-ct">Notice the two standard errors are close (0.0298 vs 0.0305) but not identical — that is normal. They can occasionally disagree at the boundary of significance, and when they do, the pooled test is the one that answers the hypothesis question.</div>
<div class="pitfall"><b>Conditions first.</b> Both samples need np̂ ≥ 5 and n(1 − p̂) ≥ 5. Here: 30, 170, 20, 230 — all ≥ 5 ✓. If a count were tiny (say 2 defects out of 200), the normal approximation collapses and none of these formulas apply.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> The pooled-vs-separate distinction is a small instance of a big principle: <b>a hypothesis test computes everything assuming H₀ is true</b>, because it asks "how surprising is this data <em>if</em> H₀ holds?". A confidence interval asks a different question — "what values are plausible given the data?" — so it never assumes H₀. Once you see that, you stop memorising which SE goes where and simply derive it from what the method is trying to do.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Two-proportion test in Python</span><span class="lc-sub">Pooled vs separate SE, computed side by side.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>So sánh hai tỷ lệ</h2>
<p class="lead">Vẫn khuôn mẫu đó — nhưng chủ đề này có một điểm tinh tế thật sự: sai số chuẩn bạn dùng cho <em>khoảng tin cậy</em> không phải cái bạn dùng cho <em>kiểm định</em>.</p>

<h3>Khoảng tin cậy — sai số chuẩn riêng biệt</h3>
<div class="formula"><span class="lbl">CI cho p₁ − p₂</span>(p̂₁ − p̂₂) ± z<sub>α/2</sub> · √( p̂₁(1−p̂₁)/n₁ + p̂₂(1−p̂₂)/n₂ )</div>

<h3>Kiểm định giả thuyết — tỷ lệ GỘP</h3>
<div class="formula"><span class="lbl">Tỷ lệ gộp</span>p̂ = (x₁ + x₂) / (n₁ + n₂)     <small>tổng số thành công chia tổng số phép thử</small></div>
<div class="formula"><span class="lbl">Thống kê kiểm định cho H₀: p₁ = p₂</span>z = (p̂₁ − p̂₂) / √( p̂(1 − p̂) · (1/n₁ + 1/n₂) )</div>
<div class="note-ct"><b>Vì sao lại khác nhau?</b> Dưới H₀, hai tỷ lệ được <em>giả định bằng nhau</em>, nên ước lượng tốt nhất cho giá trị chung duy nhất đó là gộp toàn bộ số thành công lại. Khoảng tin cậy không đưa ra giả định nào như vậy — nó để mỗi mẫu tự lên tiếng. Điều này soi chiếu đúng bài 8.1, nơi kiểm định cho một tỷ lệ cũng dùng p₀ từ H₀ ở mẫu số chứ không dùng p̂.</div>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Đề.</b> Máy 1: 30 phế phẩm trên n₁ = 200. Máy 2: 20 phế phẩm trên n₂ = 250. Kiểm định H₀: p₁ = p₂ ở α = 0.05, và lập CI 95%.<br><br>
p̂₁ = 30/200 = 0.15 · p̂₂ = 20/250 = 0.08 · hiệu = 0.07<br><br>
<b>Kiểm định (gộp).</b> p̂ = (30 + 20)/(200 + 250) = 50/450 = 0.1111<br>
SE<sub>kiểm định</sub> = √(0.1111 × 0.8889 × (1/200 + 1/250)) = √(0.09877 × 0.009) = √0.000889 = 0.02982<br>
z = 0.07/0.02982 = <b>2.35</b> → |2.35| &gt; 1.96 → <b>bác bỏ H₀</b>: tỷ lệ phế phẩm khác nhau.<br><br>
<b>CI (SE riêng).</b> SE<sub>CI</sub> = √(0.15×0.85/200 + 0.08×0.92/250) = √(0.0006375 + 0.0002944) = √0.0009319 = 0.03053<br>
CI = 0.07 ± 1.96 × 0.03053 = 0.07 ± 0.0598 = <b>(0.0102, 0.1298)</b><br>
Khoảng không chứa 0, khớp với kết luận bác bỏ ở trên.</div>
<div class="note-ct">Để ý hai sai số chuẩn gần nhau (0.0298 vs 0.0305) nhưng không giống hệt — đó là bình thường. Thỉnh thoảng chúng có thể cho kết luận lệch nhau ngay ranh giới ý nghĩa, và khi đó kiểm định dùng tỷ lệ gộp mới là cái trả lời câu hỏi giả thuyết.</div>
<div class="pitfall"><b>Kiểm điều kiện trước.</b> Cả hai mẫu đều cần np̂ ≥ 5 và n(1 − p̂) ≥ 5. Ở đây: 30, 170, 20, 230 — đều ≥ 5 ✓. Nếu một số đếm quá nhỏ (chẳng hạn 2 phế phẩm trên 200), xấp xỉ chuẩn sụp đổ và không công thức nào ở trên còn dùng được.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Sự phân biệt gộp-vs-riêng là một ví dụ nhỏ của một nguyên tắc lớn: <b>kiểm định giả thuyết tính mọi thứ với giả định H₀ đúng</b>, bởi nó hỏi "dữ liệu này bất ngờ đến mức nào <em>nếu</em> H₀ đúng?". Khoảng tin cậy hỏi câu khác — "những giá trị nào là hợp lý với dữ liệu này?" — nên nó không bao giờ giả định H₀. Khi đã thấy điều đó, bạn thôi phải học thuộc SE nào dùng ở đâu mà chỉ cần suy ra từ mục đích của phương pháp.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Kiểm định hai tỷ lệ bằng Python</span><span class="lc-sub">SE gộp vs riêng, tính cạnh nhau.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '9.3 — Paired samples (the paired t-test)|||9.3 — Mẫu cặp (kiểm định t theo cặp)',
          slug: 'mas291-mau-cap',
          type: 'VIDEO',
          description: 'Khi hai mẫu ghép cặp tự nhiên (trước/sau, cùng một đối tượng): lập cột hiệu d rồi quay về bài toán MỘT mẫu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>When the two samples are not independent</h2>
<p class="lead">Lesson 9.1 assumed two <em>separate</em> groups. But often the same subject is measured twice — before and after a treatment, left hand and right hand, two methods on the same specimen. Those measurements are paired, and treating them as independent throws away the design.</p>

<h3>The method: reduce two samples to one</h3>
<div class="formula"><span class="lbl">Step 1 — build the difference column</span>d<sub>i</sub> = x₁ᵢ − x₂ᵢ     for each pair i</div>
<div class="formula"><span class="lbl">Step 2 — one-sample t on the d values</span>t = ( d̄ − Δ₀ ) / ( s<sub>d</sub>/√n )     df = n − 1<br><small>n = number of PAIRS, not total measurements</small></div>
<div class="formula"><span class="lbl">Confidence interval for the mean difference</span>d̄ ± t<sub>α/2, n−1</sub> · ( s<sub>d</sub>/√n )</div>
<div class="note-ct">Once the d column exists, everything is Chapter 7 and 8 material applied to a single sample. There is no pooled variance, no Welch, no n₁ + n₂ − 2 — just n − 1 where n counts pairs.</div>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Problem.</b> Five workers are timed before and after training. Did training reduce the time? α = 0.05.<br><br>
<table>
  <thead><tr><th>Worker</th><th>Before</th><th>After</th><th>d = Before − After</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>22</td><td>19</td><td>3</td></tr>
    <tr><td>2</td><td>25</td><td>22</td><td>3</td></tr>
    <tr><td>3</td><td>20</td><td>18</td><td>2</td></tr>
    <tr><td>4</td><td>28</td><td>23</td><td>5</td></tr>
    <tr><td>5</td><td>24</td><td>22</td><td>2</td></tr>
  </tbody>
</table>
<b>Step 1.</b> d values: 3, 3, 2, 5, 2 → d̄ = 15/5 = <b>3</b><br>
<b>Step 2.</b> deviations: 0, 0, −1, 2, −1 → squares: 0, 0, 1, 4, 1 → Σ = 6<br>
s<sub>d</sub>² = 6/(5−1) = 1.5 → s<sub>d</sub> = 1.2247<br>
<b>Step 3.</b> SE = 1.2247/√5 = 0.5477<br>
<b>Step 4.</b> t = (3 − 0)/0.5477 = <b>5.477</b>, df = 4<br>
<b>Step 5.</b> t<sub>0.05, 4</sub> = 2.132 (one-sided, since we ask "reduced"). 5.477 &gt; 2.132 → <b>reject H₀</b>: training significantly reduced the time.<br><br>
95% CI for the mean reduction: 3 ± 2.776 × 0.5477 = 3 ± 1.52 = <b>(1.48, 4.52)</b> — does not contain 0, same conclusion.</div>

<h3>Paired or independent? Read the design</h3>
<table>
  <thead><tr><th>Clue in the question</th><th>Method</th></tr></thead>
  <tbody>
    <tr><td>"before and after", "the same subjects/specimens"</td><td>Paired t</td></tr>
    <tr><td>Data arrives in a table with two columns of equal length, matched row by row</td><td>Paired t</td></tr>
    <tr><td>"two independent groups", different people in each group</td><td>Two-sample (9.1)</td></tr>
    <tr><td>n₁ ≠ n₂</td><td>Must be independent — pairing is impossible</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>The costly mistake</b> is running the independent two-sample test on paired data. It is not just stylistically wrong: it usually <em>fails to detect a real effect</em>. In the example above, the two groups overlap heavily (means 23.8 vs 20.8 with spreads around 3), and an independent test would not reach significance — yet every single worker improved. Pairing removes the person-to-person variation and lets the consistent improvement show through.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why pairing is more powerful.</b> Each worker carries their own baseline speed — worker 4 is simply slower than worker 3 in both columns. In an independent test that between-person spread sits in the denominator as noise. Subtracting within each pair cancels the baseline entirely, so s<sub>d</sub> measures only the treatment effect's variability. That is why a good experimental design (pairing, blocking, matching) can be worth more than collecting a larger sample.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Paired t-test in Python</span><span class="lc-sub">Compare paired vs independent on the same data.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Khi hai mẫu không độc lập</h2>
<p class="lead">Bài 9.1 giả định hai nhóm <em>tách biệt</em>. Nhưng thường cùng một đối tượng được đo hai lần — trước và sau khi can thiệp, tay trái và tay phải, hai phương pháp trên cùng một mẫu vật. Những phép đo đó ghép thành cặp, và coi chúng như độc lập là vứt bỏ chính thiết kế thí nghiệm.</p>

<h3>Phương pháp: rút hai mẫu về một mẫu</h3>
<div class="formula"><span class="lbl">Bước 1 — lập cột hiệu</span>d<sub>i</sub> = x₁ᵢ − x₂ᵢ     cho từng cặp i</div>
<div class="formula"><span class="lbl">Bước 2 — kiểm định t một mẫu trên các giá trị d</span>t = ( d̄ − Δ₀ ) / ( s<sub>d</sub>/√n )     df = n − 1<br><small>n = số CẶP, không phải tổng số phép đo</small></div>
<div class="formula"><span class="lbl">Khoảng tin cậy cho hiệu trung bình</span>d̄ ± t<sub>α/2, n−1</sub> · ( s<sub>d</sub>/√n )</div>
<div class="note-ct">Khi cột d đã có, mọi thứ trở thành kiến thức Chương 7 và 8 áp dụng cho một mẫu duy nhất. Không có phương sai gộp, không Welch, không n₁ + n₂ − 2 — chỉ có n − 1 với n đếm số cặp.</div>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Đề.</b> Năm công nhân được bấm giờ trước và sau khi tập huấn. Tập huấn có làm giảm thời gian không? α = 0.05.<br><br>
<table>
  <thead><tr><th>Công nhân</th><th>Trước</th><th>Sau</th><th>d = Trước − Sau</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>22</td><td>19</td><td>3</td></tr>
    <tr><td>2</td><td>25</td><td>22</td><td>3</td></tr>
    <tr><td>3</td><td>20</td><td>18</td><td>2</td></tr>
    <tr><td>4</td><td>28</td><td>23</td><td>5</td></tr>
    <tr><td>5</td><td>24</td><td>22</td><td>2</td></tr>
  </tbody>
</table>
<b>Bước 1.</b> Các giá trị d: 3, 3, 2, 5, 2 → d̄ = 15/5 = <b>3</b><br>
<b>Bước 2.</b> độ lệch: 0, 0, −1, 2, −1 → bình phương: 0, 0, 1, 4, 1 → Σ = 6<br>
s<sub>d</sub>² = 6/(5−1) = 1.5 → s<sub>d</sub> = 1.2247<br>
<b>Bước 3.</b> SE = 1.2247/√5 = 0.5477<br>
<b>Bước 4.</b> t = (3 − 0)/0.5477 = <b>5.477</b>, df = 4<br>
<b>Bước 5.</b> t<sub>0.05, 4</sub> = 2.132 (một phía, vì đề hỏi "có giảm không"). 5.477 &gt; 2.132 → <b>bác bỏ H₀</b>: tập huấn giảm thời gian có ý nghĩa thống kê.<br><br>
CI 95% cho mức giảm trung bình: 3 ± 2.776 × 0.5477 = 3 ± 1.52 = <b>(1.48, 4.52)</b> — không chứa 0, cùng kết luận.</div>

<h3>Mẫu cặp hay độc lập? Đọc thiết kế</h3>
<table>
  <thead><tr><th>Dấu hiệu trong đề</th><th>Phương pháp</th></tr></thead>
  <tbody>
    <tr><td>"trước và sau", "cùng những đối tượng/mẫu vật"</td><td>t theo cặp</td></tr>
    <tr><td>Dữ liệu cho dưới dạng bảng hai cột dài bằng nhau, khớp từng dòng</td><td>t theo cặp</td></tr>
    <tr><td>"hai nhóm độc lập", người khác nhau ở mỗi nhóm</td><td>Hai mẫu (bài 9.1)</td></tr>
    <tr><td>n₁ ≠ n₂</td><td>Bắt buộc là độc lập — không thể ghép cặp</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Sai lầm đắt giá</b> là chạy kiểm định hai mẫu độc lập trên dữ liệu ghép cặp. Nó không chỉ sai về hình thức: nó thường <em>không phát hiện ra hiệu ứng có thật</em>. Trong ví dụ trên, hai nhóm chồng lấn nhiều (trung bình 23.8 vs 20.8 với độ phân tán khoảng 3), và kiểm định độc lập sẽ không đạt mức ý nghĩa — dù từng công nhân một đều cải thiện. Ghép cặp loại bỏ biến thiên giữa người với người và để mức cải thiện nhất quán lộ ra.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao ghép cặp mạnh hơn.</b> Mỗi công nhân mang theo tốc độ nền của riêng mình — công nhân 4 đơn giản là chậm hơn công nhân 3 ở cả hai cột. Trong kiểm định độc lập, độ phân tán giữa người đó nằm ở mẫu số như nhiễu. Việc trừ trong từng cặp triệt tiêu hoàn toàn mức nền, nên s<sub>d</sub> chỉ còn đo độ biến động của chính hiệu ứng can thiệp. Đó là lý do một thiết kế thí nghiệm tốt (ghép cặp, chia khối, so khớp) có thể đáng giá hơn cả việc đi thu thập mẫu lớn hơn.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-255" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Kiểm định t theo cặp bằng Python</span><span class="lc-sub">So sánh cặp vs độc lập trên cùng bộ dữ liệu.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 5 — Two-sample inference|||Quiz 5 — Suy luận hai mẫu',
          slug: 'mas291-quiz-hai-mau',
          type: 'QUIZ',
          description: 'Kiểm tra chọn đúng trường hợp (z/gộp/Welch), phương sai gộp, tỷ lệ gộp, và nhận diện mẫu cặp.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'For the SE of x̄₁ − x̄₂, the two variance terms are…|||Với SE của x̄₁ − x̄₂, hai số hạng phương sai được…', options: ['subtracted|||trừ nhau', 'added|||cộng lại', 'multiplied|||nhân nhau', 'averaged|||lấy trung bình'], correctIndex: 1, points: 1 },
              { question: 'Degrees of freedom for the pooled two-sample t are…|||Bậc tự do của t hai mẫu dùng phương sai gộp là…', options: ['n₁ + n₂', 'n₁ + n₂ − 1', 'n₁ + n₂ − 2', 'n − 1'], correctIndex: 2, points: 1 },
              { question: 'Welch t is used when…|||t Welch được dùng khi…', options: ['variances are assumed equal|||giả định phương sai bằng nhau', 'variances are clearly unequal|||phương sai rõ ràng khác nhau', 'σ is known|||đã biết σ', 'samples are paired|||mẫu ghép cặp'], correctIndex: 1, points: 1 },
              { question: 'A 95% CI for μ₁ − μ₂ is (−0.5, 3.2). At α = 0.05 you…|||CI 95% cho μ₁ − μ₂ là (−0.5, 3.2). Ở α = 0.05 bạn…', options: ['reject H₀: μ₁ = μ₂|||bác bỏ H₀: μ₁ = μ₂', 'do not reject H₀ (interval contains 0)|||không bác bỏ H₀ (khoảng chứa 0)', 'cannot decide|||không thể kết luận', 'must use a bigger sample|||phải lấy mẫu lớn hơn'], correctIndex: 1, points: 1 },
              { question: 'In a TEST for p₁ = p₂, the standard error uses…|||Trong KIỂM ĐỊNH p₁ = p₂, sai số chuẩn dùng…', options: ['separate p̂₁ and p̂₂|||p̂₁ và p̂₂ riêng biệt', 'the pooled p̂ = (x₁+x₂)/(n₁+n₂)|||tỷ lệ gộp p̂ = (x₁+x₂)/(n₁+n₂)', 'p₀ = 0.5 always|||luôn dùng p₀ = 0.5', 'the larger of the two|||cái lớn hơn trong hai'], correctIndex: 1, points: 1 },
              { question: 'In a CONFIDENCE INTERVAL for p₁ − p₂, the standard error uses…|||Trong KHOẢNG TIN CẬY cho p₁ − p₂, sai số chuẩn dùng…', options: ['the pooled p̂|||tỷ lệ gộp p̂', 'separate p̂₁ and p̂₂|||p̂₁ và p̂₂ riêng biệt', 'p₀ from H₀|||p₀ từ H₀', 'σ₁ and σ₂'], correctIndex: 1, points: 1 },
              { question: 'Data measured "before and after" on the same people needs…|||Dữ liệu đo "trước và sau" trên cùng những người cần dùng…', options: ['independent two-sample t|||t hai mẫu độc lập', 'paired t|||t theo cặp', 'z for proportions|||z cho tỷ lệ', 'chi-square|||khi bình phương'], correctIndex: 1, points: 1 },
              { question: 'In a paired t-test with 8 pairs, df equals…|||Trong kiểm định t theo cặp với 8 cặp, df bằng…', options: ['16', '14', '8', '7'], correctIndex: 3, points: 1 },
              { question: 'If n₁ = 10 and n₂ = 13, the data…|||Nếu n₁ = 10 và n₂ = 13, dữ liệu…', options: ['can be paired|||có thể ghép cặp', 'cannot be paired — must be independent|||không thể ghép cặp — bắt buộc độc lập', 'needs pooling|||cần gộp phương sai', 'is invalid|||không hợp lệ'], correctIndex: 1, points: 1 },
              { question: 'Pooled variance s_p² is a weighted average weighted by…|||Phương sai gộp s_p² là trung bình có trọng số, trọng số theo…', options: ['sample means|||trung bình mẫu', 'degrees of freedom (n−1)|||bậc tự do (n−1)', 'sample sizes n|||cỡ mẫu n', 'the confidence level|||mức tin cậy'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 10 — HỒI QUY & TƯƠNG QUAN ══════════════════ */
    {
      title: 'Chapter 10 — Regression & correlation|||Chương 10 — Hồi quy & tương quan',
      description: 'Bộ công thức đầy đủ: hệ số tương quan r, đường hồi quy (hệ số góc & tung độ gốc), R² và dự đoán.',
      lessons: [
        {
          title: '10.1 — Correlation r, the regression line & R²|||10.1 — Tương quan r, đường hồi quy & R²',
          slug: 'mas291-hoi-quy',
          type: 'VIDEO',
          description: 'Công thức r, hệ số góc b₁, tung độ gốc b₀, R², cách dự đoán; kèm ví dụ và bẫy nhân quả.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Modelling the relationship between two variables</h2>
<p class="lead">Does study time relate to exam score? First we <em>measure</em> the relationship (correlation r), then we <em>model</em> it as a line you can predict from.</p>

<h3>The formulas</h3>
<div class="formula"><span class="lbl">Correlation coefficient</span>r = Σ(xᵢ − x̄)(yᵢ − ȳ) / √[ Σ(xᵢ − x̄)² · Σ(yᵢ − ȳ)² ]</div>
<div class="formula"><span class="lbl">Regression line</span>ŷ = b₀ + b₁x</div>
<div class="formula"><span class="lbl">Slope &amp; intercept</span>b₁ = Σ(xᵢ − x̄)(yᵢ − ȳ) / Σ(xᵢ − x̄)²        b₀ = ȳ − b₁·x̄</div>
<div class="formula"><span class="lbl">Coefficient of determination</span>R² = r²   (fraction of y-variation explained by x)</div>
<p><b>r</b> ranges from −1 to +1: near +1 = strong positive, near −1 = strong negative, near 0 = no linear relationship. The line is chosen by <em>least squares</em> (minimising the total squared vertical distance from points to line).</p>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Fitted model:</b> ŷ = 30 + 5x, where x = hours studied, y = exam score, with r = 0.9.<br>
• <b>Predict</b> a student who studies x = 6 hours: ŷ = 30 + 5(6) = <b>60</b>.<br>
• <b>Slope</b> b₁ = 5: each extra hour of study is associated with +5 points.<br>
• <b>Intercept</b> b₀ = 30: predicted score with zero study.<br>
• <b>R²</b> = 0.9² = 0.81 → 81% of the variation in scores is explained by study time; the remaining 19% is other factors.</div>

<div class="pitfall"><b>The most important warning in statistics: correlation ≠ causation.</b> Ice-cream sales and drowning rates correlate strongly — because both rise in summer, not because ice cream causes drowning. A high r never proves x <em>causes</em> y. Also avoid predicting far outside the data range (extrapolation).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Check the residuals — is the model even appropriate?</b> A regression line can be drawn through <em>any</em> data, even non-linear data. Before trusting it, plot the <strong>residuals</strong> (actual − predicted, i.e. yᵢ − ŷᵢ). A good fit → residuals scattered randomly around 0. A pattern (a curve, a funnel widening) means the linear model is wrong for this data. This diagnostic is what real analysts do — include a residual plot in your computer project.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-550" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Fit regression in Python</span><span class="lc-sub">Data integration &amp; analysis with real datasets.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Mô hình hóa quan hệ giữa hai biến</h2>
<p class="lead">Thời gian học có liên quan điểm thi không? Trước tiên ta <em>đo</em> quan hệ (tương quan r), rồi <em>mô hình hóa</em> nó thành một đường thẳng để dự đoán.</p>

<h3>Các công thức</h3>
<div class="formula"><span class="lbl">Hệ số tương quan</span>r = Σ(xᵢ − x̄)(yᵢ − ȳ) / √[ Σ(xᵢ − x̄)² · Σ(yᵢ − ȳ)² ]</div>
<div class="formula"><span class="lbl">Đường hồi quy</span>ŷ = b₀ + b₁x</div>
<div class="formula"><span class="lbl">Hệ số góc &amp; tung độ gốc</span>b₁ = Σ(xᵢ − x̄)(yᵢ − ȳ) / Σ(xᵢ − x̄)²        b₀ = ȳ − b₁·x̄</div>
<div class="formula"><span class="lbl">Hệ số xác định</span>R² = r²   (tỷ lệ biến thiên của y được x giải thích)</div>
<p><b>r</b> nằm từ −1 tới +1: gần +1 = dương mạnh, gần −1 = âm mạnh, gần 0 = không có quan hệ tuyến tính. Đường được chọn bằng <em>bình phương tối thiểu</em> (nhỏ nhất tổng bình phương khoảng cách dọc từ điểm tới đường).</p>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Mô hình khớp:</b> ŷ = 30 + 5x, với x = số giờ học, y = điểm thi, r = 0.9.<br>
• <b>Dự đoán</b> sinh viên học x = 6 giờ: ŷ = 30 + 5(6) = <b>60</b>.<br>
• <b>Hệ số góc</b> b₁ = 5: mỗi giờ học thêm gắn với +5 điểm.<br>
• <b>Tung độ gốc</b> b₀ = 30: điểm dự đoán khi học 0 giờ.<br>
• <b>R²</b> = 0.9² = 0.81 → 81% biến thiên điểm được giải thích bởi thời gian học; 19% còn lại là yếu tố khác.</div>

<div class="pitfall"><b>Cảnh báo quan trọng nhất trong thống kê: tương quan ≠ nhân quả.</b> Doanh số kem và tỷ lệ đuối nước tương quan mạnh — vì cả hai đều tăng vào mùa hè, không phải vì kem gây đuối nước. r cao không bao giờ chứng minh x <em>gây ra</em> y. Cũng tránh dự đoán xa ngoài khoảng dữ liệu (ngoại suy).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kiểm tra phần dư — mô hình có phù hợp không?</b> Một đường hồi quy có thể vẽ qua <em>bất kỳ</em> dữ liệu nào, kể cả phi tuyến. Trước khi tin nó, vẽ <strong>phần dư</strong> (thực tế − dự đoán, tức yᵢ − ŷᵢ). Khớp tốt → phần dư rải ngẫu nhiên quanh 0. Một mẫu hình (đường cong, hình phễu loe ra) nghĩa là mô hình tuyến tính sai với dữ liệu này. Chẩn đoán này là điều nhà phân tích thật làm — đưa một đồ thị phần dư vào computer project.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-550" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Khớp hồi quy bằng Python</span><span class="lc-sub">Tích hợp & phân tích dữ liệu với dữ liệu thật.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '10.2 — Inference on the regression model (ANOVA, t-tests on β)|||10.2 — Suy luận trên mô hình hồi quy (ANOVA, kiểm định t trên β)',
          slug: 'mas291-suy-luan-hoi-quy',
          type: 'VIDEO',
          description: 'Phân rã SST = SSR + SSE, sai số chuẩn của hệ số, CI và kiểm định t cho β₀/β₁, và kiểm định hệ số tương quan ρ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Is the regression line actually real?</h2>
<p class="lead">Lesson 10.1 fitted a line and measured fit with R². But a line can always be fitted, even to noise. This lesson asks the inference question: <strong>is the slope significantly different from zero</strong>, and how much of the variation does the model genuinely explain?</p>

<h3>1. The variance decomposition (regression ANOVA)</h3>
<div class="formula"><span class="lbl">Total = Explained + Unexplained</span>SST = SSR + SSE<br>SST = Σ(yᵢ − ȳ)² = S<sub>yy</sub>     SSR = β̂₁ · S<sub>xy</sub>     SSE = Σ(yᵢ − ŷᵢ)² = Σeᵢ²</div>
<table>
  <thead><tr><th>Term</th><th>Name</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>SST</td><td>Total sum of squares</td><td>All the variation in y</td></tr>
    <tr><td>SSR</td><td>Regression sum of squares</td><td>The part the line explains</td></tr>
    <tr><td>SSE</td><td>Error (residual) sum of squares</td><td>The part left over</td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">R² from the decomposition</span>R² = SSR/SST = 1 − SSE/SST</div>
<div class="note-ct">This shows exactly what R² has been all along: the <em>fraction of total variation explained by the model</em>. R² = 0.85 means the line accounts for 85% of the ups and downs in y, and 15% remains unexplained.</div>

<h3>2. Residual variance — the s of the regression</h3>
<div class="formula"><span class="lbl">Estimating the error variance</span>s² = SSE / (n − 2)     s = √(SSE/(n − 2))</div>
<div class="pitfall"><b>Divide by n − 2, not n − 1.</b> You estimated <em>two</em> parameters from the data (β̂₀ and β̂₁), so two degrees of freedom are consumed. Every t-test and CI in this lesson uses <b>df = n − 2</b>.</div>

<h3>3. Standard errors of the coefficients</h3>
<div class="formula"><span class="lbl">SE of the slope and intercept</span>s<sub>β̂₁</sub> = s / √S<sub>xx</sub><br>s<sub>β̂₀</sub> = s · √( 1/n + x̄²/S<sub>xx</sub> )</div>
<div class="note-ct">Look at s<sub>β̂₁</sub>: the larger S<sub>xx</sub> (the more spread out your x values), the smaller the standard error. Spreading your predictor over a wide range gives a more precisely estimated slope — a genuinely useful piece of experimental-design advice hiding inside a formula.</div>

<h3>4. Confidence intervals and tests on the coefficients</h3>
<div class="formula"><span class="lbl">CI for the slope</span>β̂₁ ± t<sub>α/2, n−2</sub> · s<sub>β̂₁</sub></div>
<div class="formula"><span class="lbl">Test H₀: β₁ = 0 (is there a linear relationship?)</span>t = ( β̂₁ − 0 ) / s<sub>β̂₁</sub>     df = n − 2<br>reject if |t| &gt; t<sub>α/2, n−2</sub></div>
<div class="formula"><span class="lbl">Same for the intercept</span>β̂₀ ± t<sub>α/2, n−2</sub> · s<sub>β̂₀</sub>     ·     t = (β̂₀ − β₀,₀)/s<sub>β̂₀</sub></div>
<div class="note-ct">The test on β₁ is the important one: <b>H₀: β₁ = 0 says "x tells you nothing about y"</b>. Rejecting it means the linear relationship is real, not an artefact of the sample. The test on β₀ (does the line pass through the origin?) matters far less and is often meaningless when x = 0 is outside the data range.</div>

<h3>5. Testing the correlation coefficient</h3>
<div class="formula"><span class="lbl">Test H₀: ρ = 0</span>t = r·√(n − 2) / √(1 − r²)     df = n − 2</div>
<div class="callout"><span class="badge">★ A neat identity</span> This t is <b>numerically identical</b> to the t from testing H₀: β₁ = 0. That is not a coincidence — in simple linear regression, "the slope is non-zero" and "the correlation is non-zero" are literally the same statement. If an exam asks you to test both, you may compute one and cite the equality.</div>

<h3>Ví dụ có lời giải · Worked example</h3>
<div class="out"><b>Problem.</b> n = 12 points give S<sub>xx</sub> = 100, S<sub>xy</sub> = 60, S<sub>yy</sub> = 50. Test whether the slope is significant at α = 0.05.<br><br>
<b>Step 1 — slope.</b> β̂₁ = S<sub>xy</sub>/S<sub>xx</sub> = 60/100 = <b>0.6</b><br>
<b>Step 2 — sums of squares.</b> SSR = β̂₁ · S<sub>xy</sub> = 0.6 × 60 = 36 · SST = S<sub>yy</sub> = 50 · SSE = 50 − 36 = <b>14</b><br>
<b>Step 3 — R².</b> R² = 36/50 = <b>0.72</b> (the line explains 72% of the variation)<br>
<b>Step 4 — residual s.</b> s² = 14/(12 − 2) = 1.4 → s = 1.1832<br>
<b>Step 5 — SE of slope.</b> s<sub>β̂₁</sub> = 1.1832/√100 = 0.11832<br>
<b>Step 6 — test.</b> t = 0.6/0.11832 = <b>5.07</b>, df = 10, t<sub>0.025,10</sub> = 2.228<br>
5.07 &gt; 2.228 → <b>reject H₀</b>: the slope is significantly different from zero.<br><br>
<b>95% CI for β₁:</b> 0.6 ± 2.228 × 0.11832 = 0.6 ± 0.264 = <b>(0.336, 0.864)</b> — excludes 0, same conclusion.<br>
<b>Check via correlation:</b> r = S<sub>xy</sub>/√(S<sub>xx</sub>·S<sub>yy</sub>) = 60/√5000 = 0.8485, and t = 0.8485×√10/√(1−0.72) = 2.683/0.5292 = <b>5.07</b> ✓ identical.</div>

<div class="pitfall"><b>Traps:</b> (1) using df = n − 1 instead of n − 2; (2) confusing SSR (explained) with SSE (error) — SSR uses the slope, SSE is what is left; (3) concluding causation from a significant slope — a real linear association still says nothing about what causes what; (4) extrapolating the line beyond the observed x range, where the model has no evidence at all.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-550" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Read a regression output table</span><span class="lc-sub">Every number above appears in statsmodels output.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Đường hồi quy đó có thật không?</h2>
<p class="lead">Bài 10.1 đã khớp một đường thẳng và đo độ khớp bằng R². Nhưng đường thẳng thì lúc nào cũng khớp được, kể cả với nhiễu. Bài này đặt câu hỏi suy luận: <strong>hệ số góc có khác 0 một cách có ý nghĩa không</strong>, và mô hình thực sự giải thích được bao nhiêu phần biến thiên?</p>

<h3>1. Phân rã phương sai (ANOVA hồi quy)</h3>
<div class="formula"><span class="lbl">Tổng = Giải thích được + Không giải thích được</span>SST = SSR + SSE<br>SST = Σ(yᵢ − ȳ)² = S<sub>yy</sub>     SSR = β̂₁ · S<sub>xy</sub>     SSE = Σ(yᵢ − ŷᵢ)² = Σeᵢ²</div>
<table>
  <thead><tr><th>Ký hiệu</th><th>Tên</th><th>Ý nghĩa</th></tr></thead>
  <tbody>
    <tr><td>SST</td><td>Tổng bình phương toàn phần</td><td>Toàn bộ biến thiên của y</td></tr>
    <tr><td>SSR</td><td>Tổng bình phương hồi quy</td><td>Phần đường thẳng giải thích được</td></tr>
    <tr><td>SSE</td><td>Tổng bình phương sai số (phần dư)</td><td>Phần còn sót lại</td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">R² từ phép phân rã</span>R² = SSR/SST = 1 − SSE/SST</div>
<div class="note-ct">Điều này cho thấy chính xác R² là gì từ đầu tới giờ: <em>tỷ lệ biến thiên toàn phần được mô hình giải thích</em>. R² = 0.85 nghĩa là đường thẳng giải thích được 85% các dao động của y, và 15% còn lại chưa giải thích được.</div>

<h3>2. Phương sai phần dư — chữ s của hồi quy</h3>
<div class="formula"><span class="lbl">Ước lượng phương sai sai số</span>s² = SSE / (n − 2)     s = √(SSE/(n − 2))</div>
<div class="pitfall"><b>Chia cho n − 2, không phải n − 1.</b> Bạn đã ước lượng <em>hai</em> tham số từ dữ liệu (β̂₀ và β̂₁), nên hai bậc tự do bị tiêu tốn. Mọi kiểm định t và CI trong bài này đều dùng <b>df = n − 2</b>.</div>

<h3>3. Sai số chuẩn của các hệ số</h3>
<div class="formula"><span class="lbl">SE của hệ số góc và hệ số chặn</span>s<sub>β̂₁</sub> = s / √S<sub>xx</sub><br>s<sub>β̂₀</sub> = s · √( 1/n + x̄²/S<sub>xx</sub> )</div>
<div class="note-ct">Hãy nhìn s<sub>β̂₁</sub>: S<sub>xx</sub> càng lớn (các giá trị x càng trải rộng) thì sai số chuẩn càng nhỏ. Trải biến độc lập trên một khoảng rộng cho ước lượng hệ số góc chính xác hơn — một lời khuyên thiết kế thí nghiệm thực sự hữu ích đang ẩn trong một công thức.</div>

<h3>4. Khoảng tin cậy và kiểm định trên các hệ số</h3>
<div class="formula"><span class="lbl">CI cho hệ số góc</span>β̂₁ ± t<sub>α/2, n−2</sub> · s<sub>β̂₁</sub></div>
<div class="formula"><span class="lbl">Kiểm định H₀: β₁ = 0 (có quan hệ tuyến tính không?)</span>t = ( β̂₁ − 0 ) / s<sub>β̂₁</sub>     df = n − 2<br>bác bỏ nếu |t| &gt; t<sub>α/2, n−2</sub></div>
<div class="formula"><span class="lbl">Tương tự cho hệ số chặn</span>β̂₀ ± t<sub>α/2, n−2</sub> · s<sub>β̂₀</sub>     ·     t = (β̂₀ − β₀,₀)/s<sub>β̂₀</sub></div>
<div class="note-ct">Kiểm định trên β₁ mới là cái quan trọng: <b>H₀: β₁ = 0 nói rằng "x không cho biết gì về y"</b>. Bác bỏ nó nghĩa là quan hệ tuyến tính là có thật, không phải sản phẩm ngẫu nhiên của mẫu. Kiểm định trên β₀ (đường thẳng có đi qua gốc toạ độ không?) ít quan trọng hơn nhiều và thường vô nghĩa khi x = 0 nằm ngoài phạm vi dữ liệu.</div>

<h3>5. Kiểm định hệ số tương quan</h3>
<div class="formula"><span class="lbl">Kiểm định H₀: ρ = 0</span>t = r·√(n − 2) / √(1 − r²)     df = n − 2</div>
<div class="callout"><span class="badge">★ Một đẳng thức đẹp</span> Giá trị t này <b>bằng đúng</b> giá trị t khi kiểm định H₀: β₁ = 0. Đó không phải trùng hợp — trong hồi quy tuyến tính đơn, "hệ số góc khác 0" và "hệ số tương quan khác 0" theo nghĩa đen là cùng một phát biểu. Nếu đề yêu cầu kiểm định cả hai, bạn có thể tính một cái rồi viện dẫn đẳng thức này.</div>

<h3>Ví dụ có lời giải</h3>
<div class="out"><b>Đề.</b> n = 12 điểm cho S<sub>xx</sub> = 100, S<sub>xy</sub> = 60, S<sub>yy</sub> = 50. Kiểm định xem hệ số góc có ý nghĩa ở α = 0.05 không.<br><br>
<b>Bước 1 — hệ số góc.</b> β̂₁ = S<sub>xy</sub>/S<sub>xx</sub> = 60/100 = <b>0.6</b><br>
<b>Bước 2 — các tổng bình phương.</b> SSR = β̂₁ · S<sub>xy</sub> = 0.6 × 60 = 36 · SST = S<sub>yy</sub> = 50 · SSE = 50 − 36 = <b>14</b><br>
<b>Bước 3 — R².</b> R² = 36/50 = <b>0.72</b> (đường thẳng giải thích 72% biến thiên)<br>
<b>Bước 4 — s phần dư.</b> s² = 14/(12 − 2) = 1.4 → s = 1.1832<br>
<b>Bước 5 — SE hệ số góc.</b> s<sub>β̂₁</sub> = 1.1832/√100 = 0.11832<br>
<b>Bước 6 — kiểm định.</b> t = 0.6/0.11832 = <b>5.07</b>, df = 10, t<sub>0.025,10</sub> = 2.228<br>
5.07 &gt; 2.228 → <b>bác bỏ H₀</b>: hệ số góc khác 0 có ý nghĩa thống kê.<br><br>
<b>CI 95% cho β₁:</b> 0.6 ± 2.228 × 0.11832 = 0.6 ± 0.264 = <b>(0.336, 0.864)</b> — không chứa 0, cùng kết luận.<br>
<b>Kiểm chứng qua tương quan:</b> r = S<sub>xy</sub>/√(S<sub>xx</sub>·S<sub>yy</sub>) = 60/√5000 = 0.8485, và t = 0.8485×√10/√(1−0.72) = 2.683/0.5292 = <b>5.07</b> ✓ giống hệt.</div>

<div class="pitfall"><b>Các bẫy:</b> (1) dùng df = n − 1 thay vì n − 2; (2) lẫn SSR (giải thích được) với SSE (sai số) — SSR dùng hệ số góc, SSE là phần còn lại; (3) kết luận nhân quả từ một hệ số góc có ý nghĩa — một liên hệ tuyến tính có thật vẫn không nói gì về cái gì gây ra cái gì; (4) ngoại suy đường thẳng ra ngoài phạm vi x đã quan sát, nơi mô hình hoàn toàn không có bằng chứng nào.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability#module-550" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Đọc bảng kết quả hồi quy</span><span class="lc-sub">Mọi con số ở trên đều xuất hiện trong output của statsmodels.</span></span>
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
      description: 'Toàn bộ chương này là học thêm: dùng phần mềm thống kê thật (Excel/Python) và tư duy hướng khoa học dữ liệu.',
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
<p class="lead">The syllabus requires a <strong>computer project (15%)</strong> and at least one statistical tool. This whole section is the practical skill that makes you employable: let the computer do the arithmetic so you focus on the thinking.</p>
<a class="link-card exphub" href="/exp-hub/mas291-cong-cu-thong-ke?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Set up Python &amp; Excel for statistics</span><span class="lc-sub">Install guide + Excel↔Python function map — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<h3>The function map — every formula you learned, in software</h3>
<table>
  <thead><tr><th>Task</th><th>Excel</th><th>Python (scipy/numpy)</th></tr></thead>
  <tbody>
    <tr><td>Mean / std dev</td><td>AVERAGE / STDEV.S</td><td>np.mean / np.std(ddof=1)</td></tr>
    <tr><td>P(Z &lt; z)</td><td>NORM.S.DIST</td><td>stats.norm.cdf</td></tr>
    <tr><td>Binomial P(X=k)</td><td>BINOM.DIST</td><td>stats.binom.pmf</td></tr>
    <tr><td>Poisson P(X=k)</td><td>POISSON.DIST</td><td>stats.poisson.pmf</td></tr>
    <tr><td>Confidence interval</td><td>CONFIDENCE.NORM</td><td>stats.t.interval</td></tr>
    <tr><td>One-sample t-test</td><td>T.TEST</td><td>stats.ttest_1samp</td></tr>
    <tr><td>Regression (r, slope, R²)</td><td>Regression tool</td><td>stats.linregress</td></tr>
  </tbody>
</table>
<pre><span class="tok-keyword">import</span> numpy <span class="tok-keyword">as</span> np
<span class="tok-keyword">from</span> scipy <span class="tok-keyword">import</span> stats
data = [2, 4, 4, 6, 9]
np.<span class="tok-function">mean</span>(data)          <span class="tok-comment"># 5.0</span>
np.<span class="tok-function">std</span>(data, ddof=1)   <span class="tok-comment"># 2.65 (ddof=1 → the n-1 sample std)</span>
stats.<span class="tok-function">ttest_1samp</span>(data, 5)  <span class="tok-comment"># one-sample t-test vs μ₀=5</span></pre>
<div class="note-ct">Computer project recipe: import a real dataset → describe it (mean, std, a chart) → check outliers (1.5·IQR) → run one inference (a CI or a test) → if fitting a line, plot the residuals. That structure earns full marks and mirrors real analysis.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.1</span>
<h2><span class="badge">★ Ngoài giáo trình</span> Làm thống kê thật bằng phần mềm</h2>
<p class="lead">Syllabus yêu cầu một <strong>computer project (15%)</strong> và ít nhất một công cụ thống kê. Cả phần này là kỹ năng thực hành làm bạn dễ xin việc: để máy tính lo số học để bạn tập trung vào tư duy.</p>
<a class="link-card exphub" href="/exp-hub/mas291-cong-cu-thong-ke?ref=%2Fcourses%2Fstatistics-and-probability%2Flearn&reflabel=MAS291%20%E2%80%94%20Statistics%20and%20Probability" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài Python &amp; Excel cho thống kê</span><span class="lc-sub">Hướng dẫn cài + bảng ánh xạ hàm Excel↔Python — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<h3>Bảng ánh xạ hàm — mọi công thức đã học, trong phần mềm</h3>
<table>
  <thead><tr><th>Việc</th><th>Excel</th><th>Python (scipy/numpy)</th></tr></thead>
  <tbody>
    <tr><td>Trung bình / độ lệch chuẩn</td><td>AVERAGE / STDEV.S</td><td>np.mean / np.std(ddof=1)</td></tr>
    <tr><td>P(Z &lt; z)</td><td>NORM.S.DIST</td><td>stats.norm.cdf</td></tr>
    <tr><td>Nhị thức P(X=k)</td><td>BINOM.DIST</td><td>stats.binom.pmf</td></tr>
    <tr><td>Poisson P(X=k)</td><td>POISSON.DIST</td><td>stats.poisson.pmf</td></tr>
    <tr><td>Khoảng tin cậy</td><td>CONFIDENCE.NORM</td><td>stats.t.interval</td></tr>
    <tr><td>Kiểm định t một mẫu</td><td>T.TEST</td><td>stats.ttest_1samp</td></tr>
    <tr><td>Hồi quy (r, hệ số góc, R²)</td><td>Công cụ Regression</td><td>stats.linregress</td></tr>
  </tbody>
</table>
<pre><span class="tok-keyword">import</span> numpy <span class="tok-keyword">as</span> np
<span class="tok-keyword">from</span> scipy <span class="tok-keyword">import</span> stats
data = [2, 4, 4, 6, 9]
np.<span class="tok-function">mean</span>(data)          <span class="tok-comment"># 5.0</span>
np.<span class="tok-function">std</span>(data, ddof=1)   <span class="tok-comment"># 2.65 (ddof=1 → độ lệch chuẩn mẫu n-1)</span>
stats.<span class="tok-function">ttest_1samp</span>(data, 5)  <span class="tok-comment"># kiểm định t một mẫu vs μ₀=5</span></pre>
<div class="note-ct">Công thức computer project: nạp một dữ liệu thật → mô tả (trung bình, độ lệch, một biểu đồ) → kiểm ngoại lai (1.5·IQR) → chạy một suy diễn (một CI hoặc một kiểm định) → nếu khớp đường, vẽ phần dư. Cấu trúc đó ăn điểm tối đa và phản ánh phân tích thật.</div>
</div>
`,
        },
        {
          title: 'Quiz 6 — Regression & applications|||Quiz 6 — Hồi quy & ứng dụng',
          slug: 'mas291-quiz-5',
          type: 'QUIZ',
          description: 'Kiểm tra tương quan, hồi quy, R², diễn giải và bẫy nhân quả.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A correlation coefficient r = −0.95 indicates…|||Hệ số tương quan r = −0.95 cho biết…', options: ['a weak relationship|||quan hệ yếu', 'a strong negative linear relationship|||quan hệ tuyến tính âm mạnh', 'no relationship|||không quan hệ', 'causation|||nhân quả'], correctIndex: 1, points: 1 },
              { question: 'In ŷ = 30 + 5x, the slope 5 means…|||Trong ŷ = 30 + 5x, hệ số góc 5 nghĩa là…', options: ['y is always 5|||y luôn bằng 5', 'each +1 in x is associated with +5 in ŷ|||mỗi +1 của x gắn với +5 của ŷ', 'x is 5 times y|||x gấp 5 lần y', 'the intercept is 5|||tung độ gốc là 5'], correctIndex: 1, points: 1 },
              { question: 'R² = 0.81 means…|||R² = 0.81 nghĩa là…', options: ['81% of the y-variation is explained by the model|||81% biến thiên của y được mô hình giải thích', 'the slope is 0.81|||hệ số góc là 0.81', 'r = 0.81', '81% of points lie on the line|||81% điểm nằm trên đường'], correctIndex: 0, points: 1 },
              { question: 'The intercept b₀ in ŷ = b₀ + b₁x is computed as…|||Tung độ gốc b₀ trong ŷ = b₀ + b₁x được tính bằng…', options: ['ȳ − b₁·x̄', 'x̄ − b₁·ȳ', 'r · s', 'Σx / n'], correctIndex: 0, points: 1 },
              { question: 'A strong correlation between two variables proves…|||Tương quan mạnh giữa hai biến chứng minh…', options: ['that one causes the other|||cái này gây ra cái kia', 'only that they move together linearly — not causation|||chỉ rằng chúng biến thiên cùng nhau tuyến tính — không phải nhân quả', 'nothing at all|||không gì cả', 'the mean|||trung bình'], correctIndex: 1, points: 1 },
              { question: 'Before trusting a fitted line, a good analyst plots the… (beyond-syllabus)|||Trước khi tin một đường khớp, nhà phân tích tốt vẽ… (ngoài giáo trình)', options: ['the mean|||trung bình', 'the residuals (actual − predicted) to check the fit|||phần dư (thực tế − dự đoán) để kiểm độ khớp', 'the median|||trung vị', 'a pie chart|||biểu đồ tròn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ TỰ KIỂM TRA — LUYỆN ĐỀ PT ══════════════════ */
    {
      title: 'Self-test — worked PT papers|||Tự kiểm tra — luyện đề PT có lời giải',
      description: 'Ba bộ đề theo đúng ba kỳ Progress Test, mọi câu giải hết số, không bỏ trống bước nào.',
      lessons: [
        {
          title: 'PT1 — Probability & random variables (5 solved)|||PT1 — Xác suất & biến ngẫu nhiên (5 câu có lời giải)',
          slug: 'mas291-pt1-luyen-de',
          type: 'VIDEO',
          description: 'Năm câu bao trọn chương 1–3: xác suất có điều kiện, Bayes, nhị thức, Poisson, kỳ vọng & phương sai.',
          content: `
<div class="ml-en">
<span class="eyebrow">Self-test · PT1</span>
<h2>Five questions covering chapters 1–3</h2>
<p class="lead">Do them on paper first. If a question takes more than 8 minutes, stop and read only the step you got stuck on — what costs marks in the exam room is almost always picking the wrong formula at step 1, not arithmetic at step 4.</p>

<h3>Question 1 — sampling without replacement</h3>
<div class="out"><b>A box holds 4 red and 6 blue balls. Two balls are drawn one after another without replacement. Find P(both the same colour).</b><br>
<b>Solution.</b> Two disjoint cases, so add them. The denominator drops because there is no replacement:<br>
P(2 red) = (4/10) × (3/9) = 12/90 · P(2 blue) = (6/10) × (5/9) = 30/90<br>
<b>P(same colour) = (12 + 30)/90 = 42/90 = 7/15 ≈ 0.4667</b><br>
<b>The trap:</b> writing (4/10) × (3/10) — that is <em>with</em> replacement. Read the wording twice.</div>

<h3>Question 2 — the binomial distribution</h3>
<div class="out"><b>X ~ B(n = 10, p = 0.3). Find P(X = 3), E(X) and Var(X).</b><br>
P(X = 3) = C(10,3) × 0.3³ × 0.7⁷ = 120 × 0.027 × 0.0823543 ≈ <b>0.2668</b><br>
E(X) = np = 10 × 0.3 = <b>3</b> · Var(X) = np(1−p) = 10 × 0.3 × 0.7 = <b>2.1</b> · σ = √2.1 ≈ 1.449<br>
<b>Sanity check:</b> the mode of a binomial sits next to np = 3, so P(X = 3) being the largest single probability is consistent. If you ever get P(X = k) &gt; 0.5 here, it is wrong — the mass is spread over 11 values.</div>

<h3>Question 3 — the normal distribution</h3>
<div class="out"><b>Student heights X ~ N(μ = 170, σ = 6) cm. Find P(164 &lt; X &lt; 179).</b><br>
Standardise both ends: z₁ = (164 − 170)/6 = −1.00 · z₂ = (179 − 170)/6 = +1.50<br>
P = Φ(1.50) − Φ(−1.00) = 0.9332 − 0.1587 = <b>0.7745 ≈ 77.45%</b><br>
<b>Always subtract, never add:</b> the Φ table gives cumulative probability from −∞, so Φ(1.50) already contains the part below 164 that you do not want.</div>

<h3>Question 4 — Bayes' theorem</h3>
<div class="out"><b>A factory has two machines: A makes 60% of the output with a 2% defect rate, B makes 40% with a 5% defect rate. An item is found defective. What is the probability it came from B?</b><br>
<b>Step 1 — total probability:</b> P(D) = P(A)P(D|A) + P(B)P(D|B) = 0.6 × 0.02 + 0.4 × 0.05 = 0.012 + 0.020 = <b>0.032</b><br>
<b>Step 2 — Bayes:</b> P(B|D) = P(B)P(D|B) / P(D) = 0.020 / 0.032 = <b>0.625</b><br>
<b>Interpretation:</b> B produces only 40% of the items but 62.5% of the defects — the posterior swings toward B precisely because its defect rate is higher. Check: P(A|D) = 0.012/0.032 = 0.375, and 0.625 + 0.375 = 1 ✓.</div>

<h3>Question 5 — Poisson, and a discrete expectation</h3>
<div class="out"><b>(a) Calls arrive at a switchboard at λ = 3 per minute. Find P(exactly 5 calls in one minute) and P(at least 1 call).</b><br>
P(X = 5) = e⁻³ × 3⁵ / 5! = 0.049787 × 243 / 120 ≈ <b>0.1008</b><br>
P(X ≥ 1) = 1 − P(X = 0) = 1 − e⁻³ = 1 − 0.049787 = <b>0.9502</b><br>
<b>The pattern to remember:</b> "at least one" is always 1 minus "none" — computing P(1) + P(2) + … is the slow, error-prone route.<br>
<b>(b) X takes values 0, 1, 2, 3 with probabilities 0.1, 0.3, 0.4, 0.2. Find E(X) and Var(X).</b><br>
E(X) = 0(0.1) + 1(0.3) + 2(0.4) + 3(0.2) = 0 + 0.3 + 0.8 + 0.6 = <b>1.7</b><br>
E(X²) = 0 + 1(0.3) + 4(0.4) + 9(0.2) = 0.3 + 1.6 + 1.8 = 3.7<br>
Var(X) = E(X²) − [E(X)]² = 3.7 − 1.7² = 3.7 − 2.89 = <b>0.81</b> · σ = 0.9<br>
<b>Check:</b> the probabilities sum to 1 ✓ and E(X) = 1.7 lies between 0 and 3 ✓. Never compute Var as E(X²) − E(X) — squaring the mean is the step everyone forgets.</div>

<div class="pitfall"><b>The single most common PT1 error: mixing up "and" with "or".</b> "Both defective" multiplies (and, intersection); "at least one defective" is 1 − P(none) (or, union). Underline those words in the question before you write anything.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Sanity-check every answer with a bound.</b> A probability must lie in [0, 1]; a variance can never be negative; E(X) must lie between the smallest and largest possible value of X; and for a binomial, E(X) = np must be near the most likely outcome. Spending five seconds on these checks catches most arithmetic slips — and in a computer-graded exam, an answer of 1.4 for a probability scores exactly the same as leaving it blank. <em>Beyond syllabus because nobody teaches checking, yet it is the highest-return habit in a timed statistics paper.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Tự kiểm tra · PT1</span>
<h2>Năm câu bao trọn chương 1–3</h2>
<p class="lead">Hãy làm trên giấy trước. Nếu một câu quá 8 phút thì dừng lại, chỉ đọc đúng bước bạn bị tắc — thứ làm mất điểm trong phòng thi gần như luôn là chọn sai công thức ở bước 1, chứ không phải tính sai ở bước 4.</p>

<h3>Câu 1 — lấy mẫu không hoàn lại</h3>
<div class="out"><b>Một hộp có 4 bóng đỏ và 6 bóng xanh. Bốc lần lượt 2 bóng không hoàn lại. Tính xác suất hai bóng cùng màu.</b><br>
<b>Lời giải.</b> Hai trường hợp rời nhau nên cộng lại. Mẫu số giảm dần vì không hoàn lại:<br>
P(2 đỏ) = (4/10) × (3/9) = 12/90 · P(2 xanh) = (6/10) × (5/9) = 30/90<br>
<b>P(cùng màu) = (12 + 30)/90 = 42/90 = 7/15 ≈ 0,4667</b><br>
<b>Bẫy:</b> viết (4/10) × (3/10) — đó là trường hợp <em>có</em> hoàn lại. Hãy đọc đề hai lần.</div>

<h3>Câu 2 — phân phối nhị thức</h3>
<div class="out"><b>X ~ B(n = 10, p = 0,3). Tính P(X = 3), E(X) và Var(X).</b><br>
P(X = 3) = C(10,3) × 0,3³ × 0,7⁷ = 120 × 0,027 × 0,0823543 ≈ <b>0,2668</b><br>
E(X) = np = 10 × 0,3 = <b>3</b> · Var(X) = np(1−p) = 10 × 0,3 × 0,7 = <b>2,1</b> · σ = √2,1 ≈ 1,449<br>
<b>Kiểm nhanh:</b> mốt của phân phối nhị thức nằm cạnh np = 3, nên P(X = 3) là xác suất đơn lớn nhất là hợp lý. Nếu ra P(X = k) &gt; 0,5 ở đây thì chắc chắn sai — khối xác suất trải trên 11 giá trị.</div>

<h3>Câu 3 — phân phối chuẩn</h3>
<div class="out"><b>Chiều cao sinh viên X ~ N(μ = 170, σ = 6) cm. Tính P(164 &lt; X &lt; 179).</b><br>
Chuẩn hoá hai đầu: z₁ = (164 − 170)/6 = −1,00 · z₂ = (179 − 170)/6 = +1,50<br>
P = Φ(1,50) − Φ(−1,00) = 0,9332 − 0,1587 = <b>0,7745 ≈ 77,45%</b><br>
<b>Luôn TRỪ, đừng cộng:</b> bảng Φ cho xác suất tích luỹ từ −∞, nên Φ(1,50) đã bao gồm cả phần dưới 164 mà ta không muốn lấy.</div>

<h3>Câu 4 — định lý Bayes</h3>
<div class="out"><b>Một nhà máy có hai máy: A làm 60% sản lượng với tỉ lệ lỗi 2%, B làm 40% với tỉ lệ lỗi 5%. Lấy ra một sản phẩm thấy bị lỗi. Xác suất nó do máy B làm là bao nhiêu?</b><br>
<b>Bước 1 — xác suất toàn phần:</b> P(D) = P(A)P(D|A) + P(B)P(D|B) = 0,6 × 0,02 + 0,4 × 0,05 = 0,012 + 0,020 = <b>0,032</b><br>
<b>Bước 2 — Bayes:</b> P(B|D) = P(B)P(D|B) / P(D) = 0,020 / 0,032 = <b>0,625</b><br>
<b>Diễn giải:</b> B chỉ làm 40% sản phẩm nhưng gánh 62,5% số hàng lỗi — hậu nghiệm nghiêng về B đúng vì tỉ lệ lỗi của nó cao hơn. Kiểm: P(A|D) = 0,012/0,032 = 0,375, và 0,625 + 0,375 = 1 ✓.</div>

<h3>Câu 5 — Poisson và kỳ vọng rời rạc</h3>
<div class="out"><b>(a) Cuộc gọi tới tổng đài với λ = 3 cuộc mỗi phút. Tính P(đúng 5 cuộc trong một phút) và P(ít nhất 1 cuộc).</b><br>
P(X = 5) = e⁻³ × 3⁵ / 5! = 0,049787 × 243 / 120 ≈ <b>0,1008</b><br>
P(X ≥ 1) = 1 − P(X = 0) = 1 − e⁻³ = 1 − 0,049787 = <b>0,9502</b><br>
<b>Khuôn cần nhớ:</b> "ít nhất một" luôn bằng 1 trừ "không có cái nào" — cộng P(1) + P(2) + … vừa chậm vừa dễ sai.<br>
<b>(b) X nhận giá trị 0, 1, 2, 3 với xác suất 0,1; 0,3; 0,4; 0,2. Tính E(X) và Var(X).</b><br>
E(X) = 0(0,1) + 1(0,3) + 2(0,4) + 3(0,2) = 0 + 0,3 + 0,8 + 0,6 = <b>1,7</b><br>
E(X²) = 0 + 1(0,3) + 4(0,4) + 9(0,2) = 0,3 + 1,6 + 1,8 = 3,7<br>
Var(X) = E(X²) − [E(X)]² = 3,7 − 1,7² = 3,7 − 2,89 = <b>0,81</b> · σ = 0,9<br>
<b>Kiểm:</b> tổng xác suất bằng 1 ✓ và E(X) = 1,7 nằm giữa 0 và 3 ✓. Đừng bao giờ tính Var bằng E(X²) − E(X) — bình phương giá trị trung bình là bước ai cũng quên.</div>

<div class="pitfall"><b>Lỗi PT1 phổ biến nhất: lẫn lộn "và" với "hoặc".</b> "Cả hai đều lỗi" thì NHÂN (và, giao); "có ít nhất một cái lỗi" thì lấy 1 − P(không có cái nào) (hoặc, hợp). Hãy gạch chân những từ đó trong đề trước khi viết bất cứ thứ gì.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kiểm mọi đáp án bằng một cận.</b> Xác suất phải nằm trong [0; 1]; phương sai không bao giờ âm; E(X) phải nằm giữa giá trị nhỏ nhất và lớn nhất của X; và với nhị thức, E(X) = np phải nằm cạnh kết cục dễ xảy ra nhất. Bỏ ra năm giây cho các phép kiểm này bắt được hầu hết lỗi tính toán — mà trong bài thi chấm máy, một đáp án xác suất bằng 1,4 được đúng bằng số điểm của việc bỏ trống. <em>Ngoài giáo trình vì không ai dạy cách kiểm lại, nhưng đó là thói quen sinh lợi cao nhất trong một bài thi thống kê có giới hạn thời gian.</em></div>
</div>
`,
        },
        {
          title: 'PT2 — Descriptive stats, sampling & CI (5 solved)|||PT2 — Thống kê mô tả, phân phối mẫu & khoảng tin cậy (5 câu có lời giải)',
          slug: 'mas291-pt2-luyen-de',
          type: 'VIDEO',
          description: 'Năm câu bao chương 4, 6, 7: tóm tắt số liệu, CLT, khoảng tin cậy, cỡ mẫu, xấp xỉ chuẩn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Self-test · PT2</span>
<h2>Five questions covering chapters 4, 6 and 7</h2>

<h3>Question 1 — every summary measure at once</h3>
<div class="out"><b>Sample: 12, 15, 15, 18, 20. Find the mean, median, mode, sample variance and standard deviation.</b><br>
x̄ = (12 + 15 + 15 + 18 + 20)/5 = 80/5 = <b>16</b><br>
Median: data already sorted, n = 5 is odd → the 3rd value = <b>15</b>. Mode = <b>15</b> (appears twice).<br>
Σ(xᵢ − x̄)² = (−4)² + (−1)² + (−1)² + 2² + 4² = 16 + 1 + 1 + 4 + 16 = 38<br>
s² = 38/(5 − 1) = <b>9.5</b> · s = √9.5 ≈ <b>3.082</b><br>
<b>Two checks:</b> the deviations must sum to zero — (−4) + (−1) + (−1) + 2 + 4 = 0 ✓ — and the denominator is n − 1 = 4, not 5. Here mean 16 &gt; median 15, a sign of slight right skew.</div>

<h3>Question 2 — confidence interval when σ is known</h3>
<div class="out"><b>n = 36, x̄ = 21.5, σ = 3 (known). Build a 95% CI for μ.</b><br>
σ known → use <b>z</b>, not t: σ<sub>x̄</sub> = 3/√36 = 3/6 = 0.5<br>
E = z<sub>0.025</sub> × σ<sub>x̄</sub> = 1.96 × 0.5 = <b>0.98</b><br>
CI = 21.5 ± 0.98 = <b>[20.52, 22.48]</b><br>
<b>Reading it correctly:</b> "95% confident that μ lies in this interval" — <em>not</em> "95% of the data lies here" and <em>not</em> "P(μ ∈ interval) = 0.95". μ is a fixed number; it is the interval that is random.</div>

<h3>Question 3 — required sample size</h3>
<div class="out"><b>With σ = 4 and 95% confidence, what minimum sample size keeps the margin of error at most 1?</b><br>
E = z<sub>α/2</sub> σ/√n ≤ 1 → n ≥ (z<sub>α/2</sub> σ / E)² = (1.96 × 4 / 1)² = 7.84² = 61.47<br>
<b>n = 62.</b><br>
<b>This is the only place in the whole course where you round UP</b>, even for a tiny fraction: n = 61 gives E &gt; 1, which fails the requirement. Note also that n depends on E <em>squared</em> — halving the margin of error costs four times the sample.</div>

<h3>Question 4 — CI when σ is unknown, and a proportion</h3>
<div class="out"><b>(a) n = 16, x̄ = 50, s = 4. Build a 95% CI for μ.</b><br>
σ unknown and n &lt; 30 → use <b>t</b> with df = n − 1 = 15 → t<sub>0.025,15</sub> = 2.131<br>
E = 2.131 × 4/√16 = 2.131 × 1 = 2.131 → CI = <b>[47.87, 52.13]</b><br>
Compare with using z = 1.96 by mistake: [48.04, 51.96] — too narrow, because t is always wider than z to pay for not knowing σ.<br>
<b>(b) In a survey of 400 people, 240 said yes. Build a 95% CI for the population proportion.</b><br>
p̂ = 240/400 = 0.6 · SE = √(p̂(1−p̂)/n) = √(0.6 × 0.4 / 400) = √0.0006 = 0.0245<br>
E = 1.96 × 0.0245 = 0.048 → CI = <b>[0.552, 0.648]</b>, i.e. 55.2% to 64.8%.<br>
<b>Check the condition:</b> np̂ = 240 ≥ 5 and n(1−p̂) = 160 ≥ 5 ✓ so the normal approximation is valid.</div>

<h3>Question 5 — the Central Limit Theorem</h3>
<div class="out"><b>A population has μ = 100 and σ = 15. A sample of n = 25 is drawn. Find P(x̄ &gt; 106).</b><br>
By the CLT, x̄ ~ N(μ, σ/√n) → σ<sub>x̄</sub> = 15/√25 = <b>3</b><br>
z = (106 − 100)/3 = <b>2.00</b> → P(x̄ &gt; 106) = 1 − Φ(2.00) = 1 − 0.9772 = <b>0.0228</b><br>
<b>The distinction the exam tests:</b> P(<em>one individual</em> X &gt; 106) would use σ = 15 → z = 0.40 → 0.3446, fifteen times larger. Sample means cluster far more tightly than individuals — that is the whole content of the CLT, and reading "x̄" versus "X" in the question is where the mark is won.</div>

<div class="pitfall"><b>z or t? Answer with the flowchart, not by feel.</b> σ known → z (any n). σ unknown and n ≥ 30 → z is acceptable. σ unknown and n &lt; 30 → <b>t with df = n − 1</b>. For proportions always z. Write the flowchart in the margin before you compute anything.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Where the 1.96 comes from — and why 95% is arbitrary.</b> 1.96 is simply the z value cutting 2.5% into each tail of the standard normal; 90% gives 1.645 and 99% gives 2.576. The choice of 95% is a convention from Fisher in the 1920s, not a mathematical result. Modern practice increasingly reports the interval itself rather than a yes/no verdict at 95%, precisely because the threshold carries no special meaning — a point the ASA made formally in its 2016 statement on p-values. <em>Beyond syllabus because the course treats 95% as given, while knowing it is a convention is what stops you over-interpreting a result that just missed it.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Tự kiểm tra · PT2</span>
<h2>Năm câu bao chương 4, 6 và 7</h2>

<h3>Câu 1 — tất cả đại lượng tóm tắt trong một câu</h3>
<div class="out"><b>Mẫu: 12, 15, 15, 18, 20. Tính trung bình, trung vị, mốt, phương sai mẫu và độ lệch chuẩn.</b><br>
x̄ = (12 + 15 + 15 + 18 + 20)/5 = 80/5 = <b>16</b><br>
Trung vị: dữ liệu đã sắp, n = 5 lẻ → lấy giá trị thứ 3 = <b>15</b>. Mốt = <b>15</b> (xuất hiện 2 lần).<br>
Σ(xᵢ − x̄)² = (−4)² + (−1)² + (−1)² + 2² + 4² = 16 + 1 + 1 + 4 + 16 = 38<br>
s² = 38/(5 − 1) = <b>9,5</b> · s = √9,5 ≈ <b>3,082</b><br>
<b>Hai phép kiểm:</b> tổng các độ lệch phải bằng 0 — (−4) + (−1) + (−1) + 2 + 4 = 0 ✓ — và mẫu số là n − 1 = 4, không phải 5. Ở đây trung bình 16 &gt; trung vị 15, dấu hiệu lệch phải nhẹ.</div>

<h3>Câu 2 — khoảng tin cậy khi ĐÃ BIẾT σ</h3>
<div class="out"><b>n = 36, x̄ = 21,5, σ = 3 (đã biết). Lập khoảng tin cậy 95% cho μ.</b><br>
Biết σ → dùng <b>z</b>, không dùng t: σ<sub>x̄</sub> = 3/√36 = 3/6 = 0,5<br>
E = z<sub>0,025</sub> × σ<sub>x̄</sub> = 1,96 × 0,5 = <b>0,98</b><br>
KTC = 21,5 ± 0,98 = <b>[20,52; 22,48]</b><br>
<b>Đọc cho đúng:</b> "tin cậy 95% rằng μ nằm trong khoảng này" — <em>không phải</em> "95% dữ liệu nằm ở đây" và <em>không phải</em> "P(μ ∈ khoảng) = 0,95". μ là một con số cố định; chính cái khoảng mới là ngẫu nhiên.</div>

<h3>Câu 3 — cỡ mẫu cần thiết</h3>
<div class="out"><b>Với σ = 4 và độ tin cậy 95%, cần cỡ mẫu tối thiểu bao nhiêu để biên sai số không vượt quá 1?</b><br>
E = z<sub>α/2</sub> σ/√n ≤ 1 → n ≥ (z<sub>α/2</sub> σ / E)² = (1,96 × 4 / 1)² = 7,84² = 61,47<br>
<b>n = 62.</b><br>
<b>Đây là chỗ DUY NHẤT trong cả môn mà bạn làm tròn LÊN</b>, kể cả khi phần thập phân rất nhỏ: n = 61 cho E &gt; 1, tức không đạt yêu cầu. Cũng để ý n phụ thuộc E theo <em>bình phương</em> — muốn biên sai số nhỏ đi một nửa thì cần mẫu gấp bốn lần.</div>

<h3>Câu 4 — khoảng tin cậy khi CHƯA BIẾT σ, và cho tỉ lệ</h3>
<div class="out"><b>(a) n = 16, x̄ = 50, s = 4. Lập khoảng tin cậy 95% cho μ.</b><br>
Chưa biết σ và n &lt; 30 → dùng <b>t</b> với df = n − 1 = 15 → t<sub>0,025;15</sub> = 2,131<br>
E = 2,131 × 4/√16 = 2,131 × 1 = 2,131 → KTC = <b>[47,87; 52,13]</b><br>
So với việc dùng nhầm z = 1,96: [48,04; 51,96] — hẹp quá, vì t luôn rộng hơn z để trả giá cho việc không biết σ.<br>
<b>(b) Khảo sát 400 người, 240 người trả lời có. Lập khoảng tin cậy 95% cho tỉ lệ tổng thể.</b><br>
p̂ = 240/400 = 0,6 · SE = √(p̂(1−p̂)/n) = √(0,6 × 0,4 / 400) = √0,0006 = 0,0245<br>
E = 1,96 × 0,0245 = 0,048 → KTC = <b>[0,552; 0,648]</b>, tức từ 55,2% tới 64,8%.<br>
<b>Kiểm điều kiện:</b> np̂ = 240 ≥ 5 và n(1−p̂) = 160 ≥ 5 ✓ nên xấp xỉ chuẩn dùng được.</div>

<h3>Câu 5 — Định lý giới hạn trung tâm</h3>
<div class="out"><b>Một tổng thể có μ = 100 và σ = 15. Lấy mẫu n = 25. Tính P(x̄ &gt; 106).</b><br>
Theo CLT, x̄ ~ N(μ, σ/√n) → σ<sub>x̄</sub> = 15/√25 = <b>3</b><br>
z = (106 − 100)/3 = <b>2,00</b> → P(x̄ &gt; 106) = 1 − Φ(2,00) = 1 − 0,9772 = <b>0,0228</b><br>
<b>Điểm phân biệt mà đề thi nhắm vào:</b> P(<em>một cá thể</em> X &gt; 106) sẽ dùng σ = 15 → z = 0,40 → 0,3446, lớn gấp mười lăm lần. Trung bình mẫu co cụm chặt hơn cá thể rất nhiều — đó là toàn bộ nội dung của CLT, và việc đọc kỹ "x̄" hay "X" trong đề chính là chỗ ăn điểm.</div>

<div class="pitfall"><b>Dùng z hay t? Trả lời bằng sơ đồ, đừng theo cảm tính.</b> Biết σ → z (mọi n). Không biết σ và n ≥ 30 → z chấp nhận được. Không biết σ và n &lt; 30 → <b>t với df = n − 1</b>. Với tỉ lệ thì luôn dùng z. Hãy viết sơ đồ đó ra lề giấy trước khi tính bất cứ thứ gì.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Con số 1,96 từ đâu ra — và vì sao mức 95% là quy ước.</b> 1,96 đơn giản là giá trị z cắt 2,5% ở mỗi đuôi của phân phối chuẩn chuẩn tắc; mức 90% cho 1,645 còn 99% cho 2,576. Việc chọn 95% là quy ước có từ Fisher những năm 1920, không phải một kết quả toán học. Thực hành hiện đại ngày càng báo cáo chính cái khoảng thay vì một phán quyết có/không ở mức 95%, đúng vì cái ngưỡng ấy chẳng mang ý nghĩa đặc biệt nào — điều mà Hội Thống kê Hoa Kỳ đã nói chính thức trong tuyên bố năm 2016 về giá trị p. <em>Ngoài giáo trình vì môn học coi 95% là cho sẵn, còn biết nó là quy ước mới giúp bạn không diễn giải quá lời một kết quả vừa chớm trượt ngưỡng.</em></div>
</div>
`,
        },
        {
          title: 'PT3 — Testing, two samples & regression (5 solved)|||PT3 — Kiểm định, hai mẫu & hồi quy (5 câu có lời giải)',
          slug: 'mas291-pt3-luyen-de',
          type: 'VIDEO',
          description: 'Năm câu bao chương 8–11: kiểm định t, giá trị p, hai trung bình, mẫu cặp, hồi quy tuyến tính.',
          content: `
<div class="ml-en">
<span class="eyebrow">Self-test · PT3</span>
<h2>Five questions covering chapters 8–11</h2>

<h3>Question 1 — a one-sample t test, with the p-value</h3>
<div class="out"><b>Test H₀: μ = 100 against H₁: μ ≠ 100, with n = 25, x̄ = 103.5, s = 7, α = 0.05. Conclude, and bound the p-value.</b><br>
σ unknown → t with df = n − 1 = 24:<br>
t₀ = (x̄ − μ₀)/(s/√n) = (103.5 − 100)/(7/√25) = 3.5/1.4 = <b>2.50</b><br>
Critical value t<sub>0.025,24</sub> = 2.064. Since |2.50| &gt; 2.064 → <b>reject H₀</b>.<br>
<b>p-value:</b> on row df = 24, t<sub>0.01</sub> = 2.492 and t<sub>0.005</sub> = 2.797. Because 2.492 &lt; 2.50 &lt; 2.797, the two-sided p lies between 2(0.005) = 0.01 and 2(0.01) = 0.02 → <b>0.01 &lt; p &lt; 0.02</b> (exactly ≈ 0.0198).<br>
<b>Note how close it is:</b> t₀ = 2.50 only just clears 2.064. Reject at α = 0.05, but at α = 0.01 the critical value is 2.797 and you would <em>fail to reject</em> — the same data, the opposite verdict. That is why reporting p is more informative than reporting the verdict.</div>

<h3>Question 2 — difference of two means</h3>
<div class="out"><b>Method A: n₁ = 12, x̄₁ = 85, s₁ = 4. Method B: n₂ = 10, x̄₂ = 81, s₂ = 5. Assume equal variances, α = 0.05, test H₁: μ₁ ≠ μ₂.</b><br>
<b>Step 1 — pooled variance:</b> s²<sub>p</sub> = [(n₁−1)s₁² + (n₂−1)s₂²]/(n₁+n₂−2) = [11(16) + 9(25)]/20 = (176 + 225)/20 = 401/20 = <b>20.05</b> → s<sub>p</sub> = 4.478<br>
<b>Step 2 — the statistic:</b> t₀ = (85 − 81)/(4.478 × √(1/12 + 1/10)) = 4/(4.478 × √0.1833) = 4/(4.478 × 0.4282) = 4/1.917 = <b>2.087</b><br>
<b>Step 3 — decide:</b> df = 12 + 10 − 2 = 20 → t<sub>0.025,20</sub> = 2.086. Since 2.087 &gt; 2.086 → <b>reject H₀ — but only just</b>. With data this marginal, the honest report is "significant at 5%, p ≈ 0.0499", not "method A is better".</div>

<h3>Question 3 — paired samples</h3>
<div class="out"><b>Five students, score before and after a course: (65,70), (70,74), (58,60), (80,85), (72,75). Test at α = 0.05 whether the course helped.</b><br>
<b>The key decision:</b> the two measurements come from the <em>same</em> student → this is <b>paired</b>, so work with the differences, not with two independent samples.<br>
d = 5, 4, 2, 5, 3 → d̄ = 19/5 = <b>3.8</b><br>
Σ(dᵢ − d̄)² = (1.2)² + (0.2)² + (−1.8)² + (1.2)² + (−0.8)² = 1.44 + 0.04 + 3.24 + 1.44 + 0.64 = 6.8 → s²<sub>d</sub> = 6.8/4 = 1.7 → s<sub>d</sub> = <b>1.304</b><br>
t₀ = d̄/(s<sub>d</sub>/√n) = 3.8/(1.304/√5) = 3.8/0.583 = <b>6.52</b>, df = 4<br>
One-sided critical value t<sub>0.05,4</sub> = 2.132 → 6.52 ≫ 2.132 → <b>reject H₀: the course did improve scores</b>.<br>
<b>Why pairing matters:</b> treating these as two independent samples would put the between-student variation (58 to 80) into the error term and almost certainly hide the effect. Pairing removes it — the same design idea as a before/after medical trial.</div>

<h3>Question 4 — difference of two proportions</h3>
<div class="out"><b>Sample 1: 45 successes out of 150. Sample 2: 30 out of 120. Test H₁: p₁ ≠ p₂ at α = 0.05.</b><br>
p̂₁ = 0.30 · p̂₂ = 0.25 · pooled p̂ = (45 + 30)/(150 + 120) = 75/270 = <b>0.2778</b><br>
SE = √[p̂(1−p̂)(1/n₁ + 1/n₂)] = √[0.2778 × 0.7222 × (1/150 + 1/120)] = √[0.2006 × 0.015] = √0.003009 = <b>0.05485</b><br>
z₀ = (0.30 − 0.25)/0.05485 = <b>0.911</b><br>
|0.911| &lt; 1.96 → <b>fail to reject H₀</b>: no evidence the proportions differ (p ≈ 0.362).<br>
<b>Vocabulary that costs marks:</b> write "fail to reject H₀", never "accept H₀". Absence of evidence is not evidence of equality — with n this small the test simply cannot see a 5-point difference.</div>

<h3>Question 5 — simple linear regression</h3>
<div class="out"><b>n = 5 points: x = 1,2,3,4,5 and y = 2,4,5,4,5. Find the regression line, r and R².</b><br>
x̄ = 3, ȳ = 4 · S<sub>xx</sub> = Σ(x−x̄)² = 4 + 1 + 0 + 1 + 4 = <b>10</b><br>
S<sub>xy</sub> = Σ(x−x̄)(y−ȳ) = (−2)(−2) + (−1)(0) + 0(1) + 1(0) + 2(1) = 4 + 0 + 0 + 0 + 2 = <b>6</b><br>
S<sub>yy</sub> = Σ(y−ȳ)² = 4 + 0 + 1 + 0 + 1 = <b>6</b><br>
<b>β̂₁ = S<sub>xy</sub>/S<sub>xx</sub> = 6/10 = 0.6</b> · <b>β̂₀ = ȳ − β̂₁x̄ = 4 − 0.6(3) = 2.2</b> → <b>ŷ = 2.2 + 0.6x</b><br>
r = S<sub>xy</sub>/√(S<sub>xx</sub>S<sub>yy</sub>) = 6/√60 = 6/7.746 = <b>0.7746</b> → <b>R² = 0.60</b><br>
<b>Interpretation, in the words the marker wants:</b> each extra unit of x is associated with a 0.6 increase in y, and 60% of the variation in y is explained by the model. Not "x causes y" — regression measures association, and the remaining 40% is everything the model does not include.<br>
<b>Prediction:</b> at x = 6, ŷ = 2.2 + 3.6 = 5.8 — but x = 6 is outside the observed range 1–5, so this is <em>extrapolation</em> and the exam expects you to say so.</div>

<div class="pitfall"><b>State the conclusion in context, not in symbols.</b> "Reject H₀" alone loses marks; the full answer is "reject H₀ at α = 0.05; there is sufficient evidence that the mean differs from 100". Every marking scheme in this course awards a separate point for that sentence.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A significant result is not necessarily a large one.</b> With n = 10,000, a difference of 0.2 points can be "highly significant" (p &lt; 0.001) and completely useless in practice. That is why modern reporting pairs the p-value with an <em>effect size</em> (Cohen's d = (x̄₁ − x̄₂)/s<sub>p</sub>) and a confidence interval, which show <em>how big</em> the difference is rather than only whether it is non-zero. In the example of question 2, d = 4/4.478 = 0.89 — a large effect, which is why it reached significance despite only 22 observations. <em>Beyond syllabus because MAS291 tests only the mechanics of hypothesis testing, while every field that uses statistics has moved to reporting effect sizes alongside them.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Tự kiểm tra · PT3</span>
<h2>Năm câu bao chương 8–11</h2>

<h3>Câu 1 — kiểm định t một mẫu, kèm giá trị p</h3>
<div class="out"><b>Kiểm định H₀: μ = 100 với H₁: μ ≠ 100, biết n = 25, x̄ = 103,5, s = 7, α = 0,05. Kết luận và chặn giá trị p.</b><br>
Chưa biết σ → dùng t với df = n − 1 = 24:<br>
t₀ = (x̄ − μ₀)/(s/√n) = (103,5 − 100)/(7/√25) = 3,5/1,4 = <b>2,50</b><br>
Giá trị tới hạn t<sub>0,025;24</sub> = 2,064. Vì |2,50| &gt; 2,064 → <b>bác bỏ H₀</b>.<br>
<b>Giá trị p:</b> trên dòng df = 24 có t<sub>0,01</sub> = 2,492 và t<sub>0,005</sub> = 2,797. Vì 2,492 &lt; 2,50 &lt; 2,797, giá trị p hai phía nằm giữa 2(0,005) = 0,01 và 2(0,01) = 0,02 → <b>0,01 &lt; p &lt; 0,02</b> (chính xác ≈ 0,0198).<br>
<b>Để ý mức độ sát nút:</b> t₀ = 2,50 chỉ vừa vượt 2,064. Bác bỏ ở α = 0,05, nhưng ở α = 0,01 thì giá trị tới hạn là 2,797 và bạn sẽ <em>không bác bỏ được</em> — cùng dữ liệu, ngược phán quyết. Vì thế báo cáo giá trị p cung cấp nhiều thông tin hơn là chỉ báo phán quyết.</div>

<h3>Câu 2 — hiệu hai trung bình</h3>
<div class="out"><b>Phương pháp A: n₁ = 12, x̄₁ = 85, s₁ = 4. Phương pháp B: n₂ = 10, x̄₂ = 81, s₂ = 5. Giả sử hai phương sai bằng nhau, α = 0,05, kiểm định H₁: μ₁ ≠ μ₂.</b><br>
<b>Bước 1 — phương sai gộp:</b> s²<sub>p</sub> = [(n₁−1)s₁² + (n₂−1)s₂²]/(n₁+n₂−2) = [11(16) + 9(25)]/20 = (176 + 225)/20 = 401/20 = <b>20,05</b> → s<sub>p</sub> = 4,478<br>
<b>Bước 2 — thống kê kiểm định:</b> t₀ = (85 − 81)/(4,478 × √(1/12 + 1/10)) = 4/(4,478 × √0,1833) = 4/(4,478 × 0,4282) = 4/1,917 = <b>2,087</b><br>
<b>Bước 3 — quyết định:</b> df = 12 + 10 − 2 = 20 → t<sub>0,025;20</sub> = 2,086. Vì 2,087 &gt; 2,086 → <b>bác bỏ H₀ — nhưng chỉ vừa đúng sát nút</b>. Với dữ liệu sát sạt như vậy, báo cáo trung thực là "có ý nghĩa ở mức 5%, p ≈ 0,0499", chứ không phải "phương pháp A tốt hơn".</div>

<h3>Câu 3 — mẫu cặp</h3>
<div class="out"><b>Năm sinh viên, điểm trước và sau khoá học: (65,70), (70,74), (58,60), (80,85), (72,75). Kiểm định ở α = 0,05 xem khoá học có giúp ích không.</b><br>
<b>Quyết định then chốt:</b> hai lần đo trên <em>cùng</em> một sinh viên → đây là <b>mẫu cặp</b>, nên làm việc với hiệu số chứ không coi là hai mẫu độc lập.<br>
d = 5, 4, 2, 5, 3 → d̄ = 19/5 = <b>3,8</b><br>
Σ(dᵢ − d̄)² = (1,2)² + (0,2)² + (−1,8)² + (1,2)² + (−0,8)² = 1,44 + 0,04 + 3,24 + 1,44 + 0,64 = 6,8 → s²<sub>d</sub> = 6,8/4 = 1,7 → s<sub>d</sub> = <b>1,304</b><br>
t₀ = d̄/(s<sub>d</sub>/√n) = 3,8/(1,304/√5) = 3,8/0,583 = <b>6,52</b>, df = 4<br>
Giá trị tới hạn một phía t<sub>0,05;4</sub> = 2,132 → 6,52 ≫ 2,132 → <b>bác bỏ H₀: khoá học có làm điểm tăng</b>.<br>
<b>Vì sao ghép cặp lại quan trọng:</b> coi đây là hai mẫu độc lập sẽ đẩy phần dao động giữa các sinh viên (từ 58 tới 80) vào sai số và gần như chắc chắn che mất hiệu ứng. Ghép cặp khử phần đó đi — cùng ý tưởng thiết kế như một thử nghiệm y khoa trước/sau.</div>

<h3>Câu 4 — hiệu hai tỉ lệ</h3>
<div class="out"><b>Mẫu 1: 45 thành công trên 150. Mẫu 2: 30 trên 120. Kiểm định H₁: p₁ ≠ p₂ ở α = 0,05.</b><br>
p̂₁ = 0,30 · p̂₂ = 0,25 · tỉ lệ gộp p̂ = (45 + 30)/(150 + 120) = 75/270 = <b>0,2778</b><br>
SE = √[p̂(1−p̂)(1/n₁ + 1/n₂)] = √[0,2778 × 0,7222 × (1/150 + 1/120)] = √[0,2006 × 0,015] = √0,003009 = <b>0,05485</b><br>
z₀ = (0,30 − 0,25)/0,05485 = <b>0,911</b><br>
|0,911| &lt; 1,96 → <b>không bác bỏ được H₀</b>: chưa có bằng chứng hai tỉ lệ khác nhau (p ≈ 0,362).<br>
<b>Cách dùng từ ăn điểm:</b> phải viết "không bác bỏ được H₀", đừng bao giờ viết "chấp nhận H₀". Không có bằng chứng không phải là bằng chứng của sự bằng nhau — với cỡ mẫu nhỏ như vậy, phép kiểm đơn giản là không đủ nhạy để thấy chênh lệch 5 điểm phần trăm.</div>

<h3>Câu 5 — hồi quy tuyến tính đơn</h3>
<div class="out"><b>n = 5 điểm: x = 1,2,3,4,5 và y = 2,4,5,4,5. Tìm đường hồi quy, r và R².</b><br>
x̄ = 3, ȳ = 4 · S<sub>xx</sub> = Σ(x−x̄)² = 4 + 1 + 0 + 1 + 4 = <b>10</b><br>
S<sub>xy</sub> = Σ(x−x̄)(y−ȳ) = (−2)(−2) + (−1)(0) + 0(1) + 1(0) + 2(1) = 4 + 0 + 0 + 0 + 2 = <b>6</b><br>
S<sub>yy</sub> = Σ(y−ȳ)² = 4 + 0 + 1 + 0 + 1 = <b>6</b><br>
<b>β̂₁ = S<sub>xy</sub>/S<sub>xx</sub> = 6/10 = 0,6</b> · <b>β̂₀ = ȳ − β̂₁x̄ = 4 − 0,6(3) = 2,2</b> → <b>ŷ = 2,2 + 0,6x</b><br>
r = S<sub>xy</sub>/√(S<sub>xx</sub>S<sub>yy</sub>) = 6/√60 = 6/7,746 = <b>0,7746</b> → <b>R² = 0,60</b><br>
<b>Diễn giải đúng ý người chấm:</b> mỗi đơn vị tăng của x gắn với mức tăng 0,6 của y, và 60% biến thiên của y được mô hình giải thích. Không nói "x gây ra y" — hồi quy đo sự liên hệ, và 40% còn lại là mọi thứ mô hình chưa đưa vào.<br>
<b>Dự đoán:</b> tại x = 6, ŷ = 2,2 + 3,6 = 5,8 — nhưng x = 6 nằm ngoài khoảng quan sát 1–5, nên đây là <em>ngoại suy</em> và đề thi mong bạn nói rõ điều đó.</div>

<div class="pitfall"><b>Phải phát biểu kết luận theo ngữ cảnh, không phải bằng ký hiệu.</b> Chỉ viết "bác bỏ H₀" là mất điểm; đáp án đủ là "bác bỏ H₀ ở mức α = 0,05; có đủ bằng chứng cho thấy trung bình khác 100". Mọi thang chấm của môn này đều cho một điểm riêng cho câu văn đó.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Có ý nghĩa thống kê không đồng nghĩa với lớn.</b> Với n = 10.000, một chênh lệch 0,2 điểm có thể "rất có ý nghĩa" (p &lt; 0,001) mà hoàn toàn vô dụng trong thực tế. Vì thế cách báo cáo hiện đại đi kèm giá trị p với một <em>độ lớn hiệu ứng</em> (Cohen's d = (x̄₁ − x̄₂)/s<sub>p</sub>) và một khoảng tin cậy, để cho thấy chênh lệch <em>lớn cỡ nào</em> chứ không chỉ có khác 0 hay không. Ở câu 2 phía trên, d = 4/4,478 = 0,89 — hiệu ứng lớn, và đó là lý do nó đạt mức ý nghĩa dù chỉ có 22 quan sát. <em>Ngoài giáo trình vì MAS291 chỉ kiểm phần cơ học của kiểm định giả thuyết, trong khi mọi ngành có dùng thống kê đều đã chuyển sang báo cáo kèm độ lớn hiệu ứng.</em></div>
</div>
`,
        },
      ],
    },

    /* END-SECTIONS-MARKER */
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ FE (trắc nghiệm, máy chấm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "mas291-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "For a fair die, P(rolling an even number) is…|||Với xúc xắc cân đối, P(ra số chẵn) là…",
                "options": [
                  "1/6",
                  "1/2",
                  "1/3",
                  "2/3"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "The general addition rule P(A∪B) equals…|||Quy tắc cộng tổng quát P(A∪B) bằng…",
                "options": [
                  "P(A)·P(B)",
                  "P(A) + P(B) − P(A∩B)",
                  "P(A) − P(B)",
                  "P(A|B)"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "For \"at least one\" problems, the quickest tool is usually…|||Với bài \"ít nhất một\", công cụ nhanh nhất thường là…",
                "options": [
                  "the multiplication rule|||quy tắc nhân",
                  "the complement, 1 − P(none)|||biến cố đối, 1 − P(không cái nào)",
                  "Bayes",
                  "conditional probability|||xác suất có điều kiện"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "P(A|B) is defined as…|||P(A|B) được định nghĩa là…",
                "options": [
                  "P(A)·P(B)",
                  "P(A∩B) / P(B)",
                  "P(A) + P(B)",
                  "P(B) / P(A)"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "After a positive on a 99%-accurate test for a rare (1%) disease, the chance of being sick is only ~17% because…|||Sau dương tính trên xét nghiệm chính xác 99% cho bệnh hiếm (1%), khả năng mắc chỉ ~17% vì…",
                "options": [
                  "the test is broken|||xét nghiệm hỏng",
                  "the low base rate makes most positives false alarms|||tỷ lệ nền thấp khiến hầu hết dương tính là báo động giả",
                  "Bayes is wrong|||Bayes sai",
                  "the sample is small|||mẫu nhỏ"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "Independent and mutually exclusive events are…|||Biến cố độc lập và xung khắc là…",
                "options": [
                  "the same thing|||cùng một thứ",
                  "opposite ideas (independent can co-occur; exclusive cannot)|||ý đối lập (độc lập có thể cùng xảy ra; xung khắc không)",
                  "both impossible|||đều bất khả",
                  "only for dice|||chỉ cho xúc xắc"
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
