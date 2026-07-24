/**
 * Exp Hub guide for MAS291 — statistics tools: Python (numpy/scipy/pandas) + Excel/DDXL.
 * Academy MAS291 links "Công cụ" cards to /exp-hub/mas291-cong-cu-thong-ke.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'mas291-cong-cu-thong-ke',
    title: 'MAS291 — Công cụ thống kê: Python + Excel/DDXL',
    kind: 'NOTE',
    language: 'python',
    status: 'PUBLISHED',
    description: 'Cài Python (numpy/scipy/pandas) và bật add-on phân tích trong Excel để làm computer project MAS291 — kèm link tải chính chủ.',
    referenceUrl: 'https://www.python.org/downloads/',
    codeBlocks: [
      {
        name: 'Cài thư viện thống kê Python',
        language: 'bash',
        code: `pip install numpy scipy pandas matplotlib`,
      },
      {
        name: 'Kiểm tra nhanh',
        language: 'python',
        code: `import numpy as np
from scipy import stats
data = [2, 4, 4, 6, 9]
print(np.mean(data), np.std(data, ddof=1))   # 5.0 2.6457...
print(stats.norm.cdf(2))                      # 0.9772 (P(Z<2))`,
      },
    ],
    noteContent: `
<span class="eyebrow">Công cụ học · MAS291</span>
<h2>Công cụ thống kê cho MAS291</h2>
<p class="lead">Syllabus yêu cầu dùng ít nhất một công cụ thống kê (Excel/DDXL) và có một <strong>computer project (15%)</strong>. Bạn nên biết cả hai: <strong>Excel</strong> (nhanh, trực quan, chuẩn FPT) và <strong>Python</strong> (con đường khoa học dữ liệu hiện đại).</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">A</div><div class="lz-t">Excel + DDXL</div><div class="lz-d">chuẩn FPT, trực quan</div></div>
  <div class="lz-step"><div class="lz-k">B</div><div class="lz-t">Python</div><div class="lz-d">numpy/scipy/pandas</div></div>
</div>

<h3>🅐 Excel + Analysis ToolPak / DDXL</h3>
<p>Excel có sẵn công cụ thống kê — chỉ cần bật add-on. File → Options → Add-ins → Manage: Excel Add-ins → Go → tick <b>Analysis ToolPak</b>. Sau đó có Data → Data Analysis (Descriptive Statistics, Regression, t-Test…). DDXL là add-on bổ sung theo giáo trình Triola.</p>
<a class="link-card dl" href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Microsoft Excel</span><span class="lc-sub">microsoft.com · SV FPT thường có license Office</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🅑 Python cho thống kê</h3>
<p>Cài Python rồi cài 4 thư viện (xem khối lệnh ở trên). Khuyên dùng qua Anaconda (đã kèm sẵn numpy/scipy/pandas/Jupyter) nếu bạn mới bắt đầu.</p>
<a class="link-card dl" href="https://www.python.org/downloads/" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Python (chính chủ)</span><span class="lc-sub">python.org · rồi: pip install numpy scipy pandas matplotlib</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<a class="link-card dl" href="https://www.anaconda.com/download" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Anaconda (gói sẵn, dễ cho người mới)</span><span class="lc-sub">anaconda.com · kèm numpy/scipy/pandas/Jupyter</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>Bảng ánh xạ hàm — Excel ↔ Python</h3>
<table>
  <thead><tr><th>Việc</th><th>Excel</th><th>Python (scipy/numpy)</th></tr></thead>
  <tbody>
    <tr><td>Trung bình / độ lệch chuẩn</td><td>AVERAGE / STDEV.S</td><td>np.mean / np.std(ddof=1)</td></tr>
    <tr><td>P(Z &lt; z) chuẩn tắc</td><td>NORM.S.DIST</td><td>stats.norm.cdf</td></tr>
    <tr><td>Phân phối nhị thức</td><td>BINOM.DIST</td><td>stats.binom.pmf</td></tr>
    <tr><td>Kiểm định t một mẫu</td><td>T.TEST</td><td>stats.ttest_1samp</td></tr>
    <tr><td>Hồi quy tuyến tính</td><td>Regression (ToolPak)</td><td>stats.linregress</td></tr>
  </tbody>
</table>
<div class="note-ct">Cho computer project: nạp một dữ liệu thật, mô tả (tâm/phân tán/biểu đồ), kiểm ngoại lai (1.5·IQR), chạy một suy diễn (CI hoặc kiểm định), và nếu khớp đường thì vẽ phần dư. Xem bài Nâng cao A.1 trong khóa học để có mẫu code đầy đủ.</div>
`,
  },
};
