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
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Discrete distributions</div><div class="lz-nsub">Binomial · Poisson · mean &amp; variance</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Continuous distributions</div><div class="lz-nsub">Normal · z-scores · z-table</div></div></div>
  <div class="lz-stage">Statistics</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Descriptive statistics</div><div class="lz-nsub">All summary measures</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Sampling &amp; the CLT</div><div class="lz-nsub">Standard error · normality of x̄</div></div></div>
  <div class="lz-stage">Inference</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Confidence intervals</div><div class="lz-nsub">z, t, proportion, sample size</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Hypothesis testing</div><div class="lz-nsub">z-test · t-test · p-value</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Regression &amp; correlation</div><div class="lz-nsub">r · slope · R² · prediction</div></div></div>
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
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Phân phối rời rạc</div><div class="lz-nsub">Nhị thức · Poisson · kỳ vọng &amp; phương sai</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Phân phối liên tục</div><div class="lz-nsub">Chuẩn · điểm z · bảng z</div></div></div>
  <div class="lz-stage">Thống kê</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Thống kê mô tả</div><div class="lz-nsub">Mọi đại lượng tóm tắt</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Phân phối mẫu &amp; CLT</div><div class="lz-nsub">Sai số chuẩn · x̄ chuẩn</div></div></div>
  <div class="lz-stage">Suy diễn</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Khoảng tin cậy</div><div class="lz-nsub">z, t, tỷ lệ, cỡ mẫu</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm định giả thuyết</div><div class="lz-nsub">z-test · t-test · p-value</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Hồi quy &amp; tương quan</div><div class="lz-nsub">r · hệ số góc · R² · dự đoán</div></div></div>
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

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Two other continuous distributions worth knowing.</b> The <b>uniform</b> spreads probability evenly over [a, b] with mean (a+b)/2 — a fair random number. The <b>exponential</b> models waiting time between random events, with P(X &gt; t) = e^(−λt), and pairs naturally with the Poisson (if events per hour are Poisson(λ), the gap between them is exponential). The normal is your default, but recognising which distribution fits a situation is half of applied statistics.</div>
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

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hai phân phối liên tục khác đáng biết.</b> Phân phối <b>đều</b> rải xác suất đều trên [a, b] với trung bình (a+b)/2 — một số ngẫu nhiên công bằng. Phân phối <b>mũ</b> mô hình thời gian chờ giữa các biến cố ngẫu nhiên, với P(X &gt; t) = e^(−λt), và đi cặp tự nhiên với Poisson (nếu số biến cố mỗi giờ là Poisson(λ), khoảng cách giữa chúng là phân phối mũ). Chuẩn là mặc định, nhưng nhận ra phân phối nào hợp tình huống là một nửa của thống kê ứng dụng.</div>
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

    /* ══════════════════ CHƯƠNG 9 — HỒI QUY & TƯƠNG QUAN ══════════════════ */
    {
      title: 'Chapter 9 — Regression & correlation|||Chương 9 — Hồi quy & tương quan',
      description: 'Bộ công thức đầy đủ: hệ số tương quan r, đường hồi quy (hệ số góc & tung độ gốc), R² và dự đoán.',
      lessons: [
        {
          title: '9.1 — Correlation r, the regression line & R²|||9.1 — Tương quan r, đường hồi quy & R²',
          slug: 'mas291-hoi-quy',
          type: 'VIDEO',
          description: 'Công thức r, hệ số góc b₁, tung độ gốc b₀, R², cách dự đoán; kèm ví dụ và bẫy nhân quả.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
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
<span class="eyebrow">Chương 9 · Bài 9.1</span>
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
          title: 'Quiz 5 — Regression & applications|||Quiz 5 — Hồi quy & ứng dụng',
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
    /* END-SECTIONS-MARKER */
  ],
};
