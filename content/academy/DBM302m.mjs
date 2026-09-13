/**
 * DBM302m — Data Mining (Khai phá dữ liệu). Giáo trình FLM (sylID 11218).
 * Nguồn chính: Coursera "Data Mining" Specialization (UIUC — Jiawei Han) +
 * sách "Data Mining: Concepts and Techniques" (Han, Kamber, Pei). Công cụ:
 * Jupyter Notebook, RStudio, pandas, scikit-learn. 4 CLO / 4 chương.
 * KHUNG chất lượng (đủ chương/bài/quiz/tài liệu, chưa đào sâu). Song ngữ.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

// ── Tài liệu tham khảo ───────────────────────────────────────────────────────
const taiLieu = doc('dbm302m-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: Coursera Data Mining Specialization (UIUC), sách Han/Kamber/Pei, scikit-learn docs; công cụ Jupyter/RStudio/pandas; lộ trình 4 bước.',
  [[
    `<span class="eyebrow">DBM302m · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Data Mining</strong> — the pipeline, visualization, pattern discovery and cluster analysis — in one place. The official FPTU slides live on <strong>FLM</strong>; below are free, high-quality resources.</p>
<h3>📘 Primary course &amp; textbook</h3>
<ul>
<li><a href="https://www.coursera.org/specializations/data-mining" target="_blank" rel="noopener">Coursera — <em>Data Mining Specialization</em> (University of Illinois, Jiawei Han)</a> — the syllabus source</li>
<li><em>Data Mining: Concepts and Techniques</em> — Han, Kamber &amp; Pei (Morgan Kaufmann)</li>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — official FPTU slides, sign in with your FPTU account</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://scikit-learn.org/stable/" target="_blank" rel="noopener">scikit-learn documentation</a> — clustering, preprocessing, metrics</li>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">pandas documentation</a> — data loading &amp; wrangling</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter Notebook</a> — interactive Python for mining</li>
<li><a href="https://posit.co/download/rstudio-desktop/" target="_blank" rel="noopener">RStudio</a> — R environment for statistics &amp; mining</li>
<li>Python libraries: <strong>pandas</strong>, <strong>scikit-learn</strong>, <strong>mlxtend</strong> (Apriori/FP-Growth), <strong>matplotlib</strong>/<strong>seaborn</strong></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the KDD pipeline, data objects &amp; attributes, similarity/distance, preprocessing.</li>
<li><strong>Explore</strong> — visualize numeric &amp; categorical data, build a simple dashboard.</li>
<li><strong>Patterns</strong> — frequent itemsets, association rules, Apriori &amp; FP-Growth, rule evaluation.</li>
<li><strong>Cluster</strong> — K-Means, hierarchical, DBSCAN; validate with internal/external measures.</li>
</ol></div>`,
    `<span class="eyebrow">DBM302m · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Khai phá dữ liệu</strong> — pipeline, trực quan hoá, khám phá mẫu và phân cụm — gom về một chỗ. Slide chính thức FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, chất lượng.</p>
<h3>📘 Khoá &amp; giáo trình chính</h3>
<ul>
<li><a href="https://www.coursera.org/specializations/data-mining" target="_blank" rel="noopener">Coursera — <em>Data Mining Specialization</em> (Đại học Illinois, Jiawei Han)</a> — nguồn của giáo trình</li>
<li><em>Data Mining: Concepts and Techniques</em> — Han, Kamber &amp; Pei (Morgan Kaufmann)</li>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — slide chính thức FPTU, đăng nhập bằng tài khoản FPTU</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://scikit-learn.org/stable/" target="_blank" rel="noopener">Tài liệu scikit-learn</a> — phân cụm, tiền xử lý, độ đo</li>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">Tài liệu pandas</a> — nạp &amp; xử lý dữ liệu</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter Notebook</a> — Python tương tác để khai phá</li>
<li><a href="https://posit.co/download/rstudio-desktop/" target="_blank" rel="noopener">RStudio</a> — môi trường R cho thống kê &amp; khai phá</li>
<li>Thư viện Python: <strong>pandas</strong>, <strong>scikit-learn</strong>, <strong>mlxtend</strong> (Apriori/FP-Growth), <strong>matplotlib</strong>/<strong>seaborn</strong></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — pipeline KDD, đối tượng &amp; thuộc tính dữ liệu, độ tương tự/khoảng cách, tiền xử lý.</li>
<li><strong>Khám phá</strong> — trực quan dữ liệu số &amp; phi số, dựng một dashboard đơn giản.</li>
<li><strong>Mẫu</strong> — tập phổ biến, luật kết hợp, Apriori &amp; FP-Growth, đánh giá luật.</li>
<li><strong>Phân cụm</strong> — K-Means, phân cấp, DBSCAN; kiểm định bằng độ đo trong/ngoài.</li>
</ol></div>`,
  ]]);

// ── Giới thiệu môn học ───────────────────────────────────────────────────────
const intro = doc('dbm302m-0-1-overview', 'Course overview: Data Mining|||Tổng quan môn học: Khai phá dữ liệu',
  'Data mining là gì &amp; pipeline KDD; 4 CLO; cơ cấu điểm (Lab2 15% · Lab3 20% · Lab4 20% · Progress test 15% · Final 30% 50 MC).',
  [[
    `<span class="eyebrow">DBM302m · Lesson 0.1 · Overview</span>
<h2>What is data mining?</h2>
<p class="lead"><strong>Data mining</strong> extracts interesting, non-trivial, previously unknown and useful patterns from large data. It is the analysis step of <strong>KDD</strong> (Knowledge Discovery in Databases) and blends databases, statistics and machine learning.</p>
<h3>The four course outcomes (CLOs)</h3>
<ul>
<li><strong>CLO1</strong> — apply the data mining pipeline: understand, preprocess and warehouse data.</li>
<li><strong>CLO2</strong> — visualize numeric and non-numeric data; build dashboards.</li>
<li><strong>CLO3</strong> — discover patterns: frequent itemsets, association, sequential and spatiotemporal patterns.</li>
<li><strong>CLO4</strong> — perform cluster analysis and validate the clusters.</li>
</ul>
<h3>Grading</h3>
<pre><code>Lab 2 ............ 15%
Lab 3 ............ 20%
Lab 4 ............ 20%
Progress test .... 15%
Final exam ....... 30%   (50 multiple-choice questions)</code></pre>
<p>Labs are done in <strong>Jupyter Notebook</strong> (Python) or <strong>RStudio</strong> — you write and run the mining code yourself.</p>`,
    `<span class="eyebrow">DBM302m · Bài 0.1 · Tổng quan</span>
<h2>Khai phá dữ liệu là gì?</h2>
<p class="lead"><strong>Khai phá dữ liệu</strong> rút ra các mẫu thú vị, không tầm thường, chưa biết trước và hữu ích từ dữ liệu lớn. Đây là bước phân tích của <strong>KDD</strong> (Khám phá tri thức trong CSDL), kết hợp CSDL, thống kê và học máy.</p>
<h3>Bốn chuẩn đầu ra (CLO)</h3>
<ul>
<li><strong>CLO1</strong> — áp dụng pipeline khai phá: hiểu, tiền xử lý và kho hoá dữ liệu.</li>
<li><strong>CLO2</strong> — trực quan hoá dữ liệu số và phi số; dựng dashboard.</li>
<li><strong>CLO3</strong> — khám phá mẫu: tập phổ biến, luật kết hợp, mẫu tuần tự và không-thời gian.</li>
<li><strong>CLO4</strong> — phân tích cụm và kiểm định cụm.</li>
</ul>
<h3>Cơ cấu điểm</h3>
<pre><code>Lab 2 ............ 15%
Lab 3 ............ 20%
Lab 4 ............ 20%
Progress test .... 15%
Thi cuối kỳ ...... 30%   (50 câu trắc nghiệm)</code></pre>
<p>Các lab làm trên <strong>Jupyter Notebook</strong> (Python) hoặc <strong>RStudio</strong> — bạn tự viết và chạy mã khai phá.</p>`,
  ]]);

// ── Chương 1 — Data Mining Pipeline (CLO1) ───────────────────────────────────
const c1a = doc('dbm302m-1-1-pipeline-understanding', '1.1 — Pipeline & data understanding|||1.1 — Pipeline & hiểu dữ liệu',
  'Pipeline KDD; đối tượng &amp; thuộc tính (nominal/binary/ordinal/numeric); thống kê mô tả; độ tương tự/khoảng cách (Euclid, Manhattan, cosine, Jaccard).',
  [[
    `<span class="eyebrow">DBM302m · Chapter 1 · Lesson 1.1</span>
<h2>The pipeline &amp; understanding your data</h2>
<h3>The KDD pipeline</h3>
<pre><code>Selection -&gt; Cleaning &amp; integration -&gt; Transformation
  -&gt; Mining (patterns / models) -&gt; Evaluation -&gt; Knowledge</code></pre>
<h3>Data objects &amp; attributes</h3>
<ul>
<li><strong>Object</strong> — a row / record / sample (e.g. a customer).</li>
<li><strong>Attribute</strong> — a column / feature. Types: <em>nominal</em> (categories), <em>binary</em>, <em>ordinal</em> (ranked), <em>numeric</em> (interval / ratio).</li>
</ul>
<h3>Descriptive statistics</h3>
<p>Summarize before you mine: <strong>central tendency</strong> (mean, median, mode) and <strong>dispersion</strong> (range, variance, standard deviation, quartiles/IQR).</p>
<h3>Similarity &amp; dissimilarity</h3>
<p>Most algorithms need a distance. Numeric objects: <strong>Euclidean</strong> or <strong>Manhattan</strong>. Text/sets: <strong>cosine</strong> similarity or <strong>Jaccard</strong>.</p>
<pre><code class="language-python">import numpy as np
from scipy.spatial.distance import euclidean, cosine
a, b = np.array([1, 2, 3]), np.array([2, 0, 3])
print(euclidean(a, b))      # numeric distance
print(1 - cosine(a, b))     # cosine similarity in [0, 1]</code></pre>
<div class="callout"><span class="badge">Garbage in, garbage out</span> Time spent understanding data pays back many times over — most mining failures are data problems, not algorithm problems.</div>`,
    `<span class="eyebrow">DBM302m · Chương 1 · Bài 1.1</span>
<h2>Pipeline &amp; hiểu dữ liệu của bạn</h2>
<h3>Pipeline KDD</h3>
<pre><code>Chọn lọc -&gt; Làm sạch &amp; tích hợp -&gt; Biến đổi
  -&gt; Khai phá (mẫu / mô hình) -&gt; Đánh giá -&gt; Tri thức</code></pre>
<h3>Đối tượng &amp; thuộc tính dữ liệu</h3>
<ul>
<li><strong>Đối tượng</strong> — một hàng / bản ghi / mẫu (vd một khách hàng).</li>
<li><strong>Thuộc tính</strong> — một cột / đặc trưng. Loại: <em>định danh</em> (nominal), <em>nhị phân</em>, <em>thứ bậc</em> (ordinal), <em>số</em> (interval / ratio).</li>
</ul>
<h3>Thống kê mô tả</h3>
<p>Tóm tắt trước khi khai phá: <strong>xu hướng trung tâm</strong> (mean, median, mode) và <strong>độ phân tán</strong> (khoảng biến thiên, phương sai, độ lệch chuẩn, tứ phân vị/IQR).</p>
<h3>Độ tương tự &amp; khác biệt</h3>
<p>Phần lớn thuật toán cần một khoảng cách. Dữ liệu số: <strong>Euclid</strong> hoặc <strong>Manhattan</strong>. Văn bản/tập hợp: <strong>cosine</strong> hoặc <strong>Jaccard</strong>.</p>
<pre><code class="language-python">import numpy as np
from scipy.spatial.distance import euclidean, cosine
a, b = np.array([1, 2, 3]), np.array([2, 0, 3])
print(euclidean(a, b))      # khoang cach so
print(1 - cosine(a, b))     # do tuong tu cosine trong [0, 1]</code></pre>
<div class="callout"><span class="badge">Rác vào, rác ra</span> Thời gian hiểu dữ liệu được đền lại nhiều lần — phần lớn thất bại khi khai phá là do dữ liệu, không phải do thuật toán.</div>`,
  ]]);

const c1b = doc('dbm302m-1-2-preprocess-warehouse', '1.2 — Preprocessing & data warehousing|||1.2 — Tiền xử lý & kho dữ liệu',
  'Tiền xử lý: cleaning, integration, transformation, reduction. Kho dữ liệu: data cube, OLAP (roll-up/drill-down/slice/dice), kiến trúc kho.',
  [[
    `<span class="eyebrow">DBM302m · Chapter 1 · Lesson 1.2</span>
<h2>Preprocessing &amp; data warehousing</h2>
<h3>Four preprocessing tasks</h3>
<ul>
<li><strong>Cleaning</strong> — fill missing values, smooth noise, remove outliers, fix inconsistencies.</li>
<li><strong>Integration</strong> — merge multiple sources; resolve schema/entity conflicts and redundancy.</li>
<li><strong>Transformation</strong> — normalization (min-max, z-score), aggregation, discretization, encoding.</li>
<li><strong>Reduction</strong> — dimensionality reduction (PCA, feature selection), numerosity reduction, sampling.</li>
</ul>
<pre><code class="language-python">import pandas as pd
from sklearn.preprocessing import StandardScaler
df = pd.read_csv("sales.csv")
df = df.fillna(df.mean(numeric_only=True))         # cleaning
df[["amount"]] = StandardScaler().fit_transform(df[["amount"]])  # z-score</code></pre>
<h3>Data warehousing</h3>
<p>A <strong>data warehouse</strong> is a subject-oriented, integrated, time-variant, non-volatile store built for analysis. A <strong>data cube</strong> models data over multiple <em>dimensions</em> (time, product, region) with <em>measures</em> (sales).</p>
<p><strong>OLAP</strong> operations: <em>roll-up</em> (aggregate up), <em>drill-down</em> (detail down), <em>slice</em> (fix one dimension), <em>dice</em> (sub-cube).</p>
<div class="callout"><span class="badge">Warehouse vs. database</span> An OLTP database is tuned for many small transactions; a warehouse (OLAP) is tuned for few, huge analytical queries over history.</div>`,
    `<span class="eyebrow">DBM302m · Chương 1 · Bài 1.2</span>
<h2>Tiền xử lý &amp; kho dữ liệu</h2>
<h3>Bốn tác vụ tiền xử lý</h3>
<ul>
<li><strong>Làm sạch (cleaning)</strong> — điền giá trị thiếu, làm mượt nhiễu, loại ngoại lai, sửa mâu thuẫn.</li>
<li><strong>Tích hợp (integration)</strong> — gộp nhiều nguồn; xử lý xung đột schema/thực thể và dư thừa.</li>
<li><strong>Biến đổi (transformation)</strong> — chuẩn hoá (min-max, z-score), tổng hợp, rời rạc hoá, mã hoá.</li>
<li><strong>Rút gọn (reduction)</strong> — giảm chiều (PCA, chọn đặc trưng), giảm số lượng, lấy mẫu.</li>
</ul>
<pre><code class="language-python">import pandas as pd
from sklearn.preprocessing import StandardScaler
df = pd.read_csv("sales.csv")
df = df.fillna(df.mean(numeric_only=True))         # lam sach
df[["amount"]] = StandardScaler().fit_transform(df[["amount"]])  # z-score</code></pre>
<h3>Kho dữ liệu (data warehousing)</h3>
<p><strong>Kho dữ liệu</strong> là kho hướng chủ đề, tích hợp, biến thiên theo thời gian, không mất — dựng cho phân tích. <strong>Data cube</strong> mô hình dữ liệu theo nhiều <em>chiều</em> (thời gian, sản phẩm, vùng) với các <em>độ đo</em> (doanh số).</p>
<p>Thao tác <strong>OLAP</strong>: <em>roll-up</em> (tổng hợp lên), <em>drill-down</em> (chi tiết xuống), <em>slice</em> (cố định một chiều), <em>dice</em> (khối con).</p>
<div class="callout"><span class="badge">Kho vs. CSDL</span> CSDL OLTP tối ưu cho nhiều giao dịch nhỏ; kho (OLAP) tối ưu cho ít truy vấn phân tích khổng lồ trên lịch sử.</div>`,
  ]]);

const c1q = quiz('dbm302m-quiz-1', 'Quiz 1 — Pipeline|||Quiz 1 — Pipeline', [
  { id: 'q1', question: 'Thuộc tính "xếp hạng sao 1–5" thuộc loại nào?', options: ['Nominal (định danh)', 'Ordinal (thứ bậc)', 'Ratio (tỉ lệ)', 'Binary (nhị phân)'], correctIndex: 1, explanation: 'Có thứ tự nhưng khoảng cách giữa các mức không đều → ordinal.' },
  { id: 'q2', question: 'Chuẩn hoá z-score và điền giá trị thiếu thuộc bước nào của pipeline?', options: ['Khai phá mẫu', 'Trực quan hoá', 'Tiền xử lý (transformation/cleaning)', 'Đánh giá'], correctIndex: 2, explanation: 'Cleaning + transformation đều nằm ở tiền xử lý.' },
  { id: 'q3', question: 'Thao tác OLAP đi từ tổng hợp năm xuống chi tiết theo tháng gọi là?', options: ['Roll-up', 'Drill-down', 'Slice', 'Dice'], correctIndex: 1, explanation: 'Drill-down = đi xuống mức chi tiết hơn của một chiều.' },
]);

// ── Chương 2 — Data Visualization (CLO2) ─────────────────────────────────────
const c2a = doc('dbm302m-2-1-visualization', '2.1 — Data visualization|||2.1 — Trực quan hoá dữ liệu',
  'Vì sao trực quan hoá; dữ liệu số (histogram, boxplot, scatter); dữ liệu phi số (bar/pie, heatmap tần suất); dashboard.',
  [[
    `<span class="eyebrow">DBM302m · Chapter 2 · Lesson 2.1</span>
<h2>Seeing the data</h2>
<p class="lead"><strong>Visualization</strong> turns numbers into shapes the eye can judge — spotting distributions, outliers, correlations and clusters far faster than tables can.</p>
<h3>Numeric data</h3>
<ul>
<li><strong>Histogram</strong> — the distribution of one numeric variable (shape, skew, modes).</li>
<li><strong>Boxplot</strong> — median, quartiles and outliers; great for comparing groups.</li>
<li><strong>Scatter plot</strong> — the relationship between two numeric variables (correlation, clusters).</li>
</ul>
<pre><code class="language-python">import matplotlib.pyplot as plt
import pandas as pd
df = pd.read_csv("iris.csv")
df["petal_length"].hist(bins=20)                 # histogram
df.boxplot(column="petal_length", by="species") # boxplot per group
df.plot.scatter(x="petal_length", y="petal_width")
plt.show()</code></pre>
<h3>Non-numeric data</h3>
<p>Categorical: <strong>bar chart</strong> (counts per category), <strong>pie</strong> (proportions), <strong>heatmap</strong> of a contingency table (co-occurrence of two categories).</p>
<h3>Dashboards</h3>
<p>A <strong>dashboard</strong> combines several linked charts into one screen so a decision-maker reads the whole story at a glance (tools: Tableau, Power BI, or Python <strong>plotly/dash</strong>).</p>`,
    `<span class="eyebrow">DBM302m · Chương 2 · Bài 2.1</span>
<h2>Nhìn thấy dữ liệu</h2>
<p class="lead"><strong>Trực quan hoá</strong> biến con số thành hình mà mắt phán đoán được — nhận ra phân bố, ngoại lai, tương quan và cụm nhanh hơn nhiều so với bảng.</p>
<h3>Dữ liệu số</h3>
<ul>
<li><strong>Histogram</strong> — phân bố của một biến số (hình dạng, độ lệch, số đỉnh).</li>
<li><strong>Boxplot</strong> — trung vị, tứ phân vị và ngoại lai; tốt để so sánh nhóm.</li>
<li><strong>Scatter</strong> — quan hệ giữa hai biến số (tương quan, cụm).</li>
</ul>
<pre><code class="language-python">import matplotlib.pyplot as plt
import pandas as pd
df = pd.read_csv("iris.csv")
df["petal_length"].hist(bins=20)                 # histogram
df.boxplot(column="petal_length", by="species") # boxplot theo nhom
df.plot.scatter(x="petal_length", y="petal_width")
plt.show()</code></pre>
<h3>Dữ liệu phi số</h3>
<p>Phân loại: <strong>bar chart</strong> (đếm theo nhóm), <strong>pie</strong> (tỉ lệ), <strong>heatmap</strong> của bảng chéo (đồng xuất hiện của hai biến phân loại).</p>
<h3>Dashboard</h3>
<p>Một <strong>dashboard</strong> ghép nhiều biểu đồ liên kết vào một màn hình để người ra quyết định đọc toàn cảnh trong nháy mắt (công cụ: Tableau, Power BI, hoặc Python <strong>plotly/dash</strong>).</p>`,
  ]]);

const c2q = quiz('dbm302m-quiz-2', 'Quiz 2 — Visualization|||Quiz 2 — Trực quan hoá', [
  { id: 'q1', question: 'Biểu đồ nào tốt nhất để thấy phân bố của MỘT biến số và độ lệch của nó?', options: ['Scatter plot', 'Histogram', 'Pie chart', 'Bảng chéo'], correctIndex: 1, explanation: 'Histogram thể hiện phân bố, hình dạng và độ lệch của một biến số.' },
  { id: 'q2', question: 'Muốn thấy quan hệ/tương quan giữa HAI biến số, dùng?', options: ['Boxplot', 'Bar chart', 'Scatter plot', 'Histogram'], correctIndex: 2, explanation: 'Scatter plot vẽ cặp giá trị để thấy tương quan và cụm.' },
  { id: 'q3', question: 'Boxplot KHÔNG hiển thị trực tiếp thứ nào sau đây?', options: ['Trung vị', 'Tứ phân vị', 'Ngoại lai (outlier)', 'Hệ số tương quan Pearson'], correctIndex: 3, explanation: 'Boxplot cho median/quartile/outlier, không cho hệ số tương quan.' },
]);

// ── Chương 3 — Pattern Discovery (CLO3) ──────────────────────────────────────
const c3a = doc('dbm302m-3-1-frequent-association', '3.1 — Frequent patterns & association rules|||3.1 — Mẫu phổ biến & luật kết hợp',
  'Support/confidence; Apriori (nguyên lý anti-monotone); FP-Growth; closed/max patterns; đánh giá luật (lift, χ², null-invariance).',
  [[
    `<span class="eyebrow">DBM302m · Chapter 3 · Lesson 3.1</span>
<h2>Frequent patterns &amp; association rules</h2>
<h3>The basics</h3>
<p>A <strong>frequent itemset</strong> appears in at least <em>min_support</em> of transactions. An <strong>association rule</strong> A ⇒ B has:</p>
<ul>
<li><strong>support</strong> = P(A ∪ B) — how often A and B occur together.</li>
<li><strong>confidence</strong> = P(B | A) — how often B follows A.</li>
</ul>
<h3>Apriori</h3>
<p><strong>Apriori</strong> uses the <em>anti-monotone</em> principle: if an itemset is infrequent, every superset is too — so it prunes aggressively, generating candidates level by level.</p>
<h3>FP-Growth</h3>
<p><strong>FP-Growth</strong> avoids candidate generation: it compresses data into an <strong>FP-tree</strong> and mines it recursively — usually much faster on large, dense data.</p>
<pre><code class="language-python">from mlxtend.frequent_patterns import apriori, association_rules
freq = apriori(basket_df, min_support=0.02, use_colnames=True)
rules = association_rules(freq, metric="confidence", min_threshold=0.5)
print(rules[["antecedents", "consequents", "support", "confidence", "lift"]])</code></pre>
<h3>Compact &amp; evaluated patterns</h3>
<ul>
<li><strong>Closed</strong> pattern — no superset has the same support; <strong>max</strong> pattern — no frequent superset at all.</li>
<li><strong>Evaluation</strong> beyond confidence: <strong>lift</strong> (&gt;1 = positively correlated), <strong>χ²</strong>, and <strong>null-invariant</strong> measures (e.g. Kulczynski) that ignore the huge count of transactions containing neither item.</li>
</ul>`,
    `<span class="eyebrow">DBM302m · Chương 3 · Bài 3.1</span>
<h2>Mẫu phổ biến &amp; luật kết hợp</h2>
<h3>Khái niệm cơ bản</h3>
<p>Một <strong>tập phổ biến</strong> xuất hiện trong ít nhất <em>min_support</em> giao dịch. Luật kết hợp A ⇒ B có:</p>
<ul>
<li><strong>support</strong> = P(A ∪ B) — A và B cùng xuất hiện thường xuyên ra sao.</li>
<li><strong>confidence</strong> = P(B | A) — B đi theo A thường xuyên ra sao.</li>
</ul>
<h3>Apriori</h3>
<p><strong>Apriori</strong> dùng nguyên lý <em>anti-monotone</em>: nếu một tập không phổ biến thì mọi tập cha cũng vậy — nên cắt tỉa mạnh, sinh ứng viên theo từng mức.</p>
<h3>FP-Growth</h3>
<p><strong>FP-Growth</strong> tránh sinh ứng viên: nén dữ liệu vào một <strong>FP-tree</strong> rồi khai phá đệ quy — thường nhanh hơn nhiều trên dữ liệu lớn, dày.</p>
<pre><code class="language-python">from mlxtend.frequent_patterns import apriori, association_rules
freq = apriori(basket_df, min_support=0.02, use_colnames=True)
rules = association_rules(freq, metric="confidence", min_threshold=0.5)
print(rules[["antecedents", "consequents", "support", "confidence", "lift"]])</code></pre>
<h3>Mẫu cô đọng &amp; đánh giá</h3>
<ul>
<li>Mẫu <strong>closed</strong> — không tập cha nào cùng support; mẫu <strong>max</strong> — không có tập cha phổ biến nào.</li>
<li><strong>Đánh giá</strong> ngoài confidence: <strong>lift</strong> (&gt;1 = tương quan dương), <strong>χ²</strong>, và độ đo <strong>null-invariant</strong> (vd Kulczynski) bỏ qua lượng khổng lồ giao dịch không chứa cả hai item.</li>
</ul>`,
  ]]);

const c3b = doc('dbm302m-3-2-advanced-patterns', '3.2 — Sequential & advanced patterns|||3.2 — Mẫu tuần tự & nâng cao',
  'Mining đa mức/đa chiều/định lượng; mẫu tuần tự (GSP, SPADE, PrefixSpan); mẫu không-thời gian; phrase mining.',
  [[
    `<span class="eyebrow">DBM302m · Chapter 3 · Lesson 3.2</span>
<h2>Beyond the market basket</h2>
<h3>Richer rules</h3>
<ul>
<li><strong>Multilevel</strong> — rules at a concept hierarchy (bread ⇒ milk, then wheat-bread ⇒ skim-milk).</li>
<li><strong>Multidimensional</strong> — rules across several attributes (age, income ⇒ buys).</li>
<li><strong>Quantitative</strong> — rules on numeric ranges (age in [30,40] ⇒ ...).</li>
</ul>
<h3>Sequential patterns</h3>
<p>When <em>order in time</em> matters (web clicks, purchases over months), we mine <strong>sequential patterns</strong>. Key algorithms:</p>
<ul>
<li><strong>GSP</strong> — Apriori-style, level-wise over sequences.</li>
<li><strong>SPADE</strong> — vertical id-list format, joins to count support.</li>
<li><strong>PrefixSpan</strong> — pattern-growth by projecting the database on prefixes (no candidate generation).</li>
</ul>
<h3>Spatiotemporal &amp; phrase patterns</h3>
<p><strong>Spatiotemporal</strong> patterns mine events over space and time (movement, hotspots). <strong>Phrase mining</strong> finds meaningful multi-word phrases in text corpora — the pattern idea carried into natural language.</p>
<div class="callout"><span class="badge">Same idea, new domain</span> Frequent-pattern thinking generalizes: itemsets → sequences → trajectories → phrases. The support/prune machinery follows.</div>`,
    `<span class="eyebrow">DBM302m · Chương 3 · Bài 3.2</span>
<h2>Vượt khỏi giỏ hàng</h2>
<h3>Luật phong phú hơn</h3>
<ul>
<li><strong>Đa mức</strong> — luật theo cây khái niệm (bánh mì ⇒ sữa, rồi bánh mì đen ⇒ sữa gầy).</li>
<li><strong>Đa chiều</strong> — luật trên nhiều thuộc tính (tuổi, thu nhập ⇒ mua).</li>
<li><strong>Định lượng</strong> — luật trên khoảng số (tuổi trong [30,40] ⇒ ...).</li>
</ul>
<h3>Mẫu tuần tự</h3>
<p>Khi <em>thứ tự theo thời gian</em> quan trọng (lượt click web, mua sắm qua các tháng), ta khai phá <strong>mẫu tuần tự</strong>. Thuật toán chính:</p>
<ul>
<li><strong>GSP</strong> — kiểu Apriori, theo mức trên chuỗi.</li>
<li><strong>SPADE</strong> — định dạng id-list dọc, join để đếm support.</li>
<li><strong>PrefixSpan</strong> — tăng trưởng mẫu bằng chiếu CSDL theo tiền tố (không sinh ứng viên).</li>
</ul>
<h3>Mẫu không-thời gian &amp; cụm từ</h3>
<p><strong>Không-thời gian</strong> khai phá sự kiện theo không gian và thời gian (di chuyển, điểm nóng). <strong>Phrase mining</strong> tìm cụm nhiều từ có nghĩa trong kho văn bản — ý tưởng mẫu mang vào ngôn ngữ tự nhiên.</p>
<div class="callout"><span class="badge">Cùng ý tưởng, miền mới</span> Tư duy mẫu phổ biến khái quát được: tập item → chuỗi → quỹ đạo → cụm từ. Cơ chế support/cắt tỉa đi theo.</div>`,
  ]]);

const c3q = quiz('dbm302m-quiz-3', 'Quiz 3 — Pattern discovery|||Quiz 3 — Khám phá mẫu', [
  { id: 'q1', question: 'Confidence của luật A ⇒ B được định nghĩa là?', options: ['P(A ∪ B)', 'P(B | A)', 'P(A) × P(B)', 'P(A | B)'], correctIndex: 1, explanation: 'Confidence = P(B|A) = support(A∪B)/support(A).' },
  { id: 'q2', question: 'Nguyên lý anti-monotone (Apriori) nói gì?', options: ['Tập cha của tập phổ biến luôn phổ biến', 'Nếu một tập không phổ biến thì mọi tập cha cũng không phổ biến', 'Lift luôn lớn hơn 1', 'FP-tree không cần sinh ứng viên'], correctIndex: 1, explanation: 'Không phổ biến thì mọi superset đều không phổ biến → cắt tỉa.' },
  { id: 'q3', question: 'Thuật toán nào khai phá MẪU TUẦN TỰ bằng cách chiếu CSDL theo tiền tố?', options: ['FP-Growth', 'Apriori', 'PrefixSpan', 'K-Means'], correctIndex: 2, explanation: 'PrefixSpan = pattern-growth cho sequential patterns, chiếu theo prefix.' },
]);

// ── Chương 4 — Cluster Analysis (CLO4) ───────────────────────────────────────
const c4a = doc('dbm302m-4-1-similarity-partitioning', '4.1 — Similarity & partitioning clustering|||4.1 — Độ tương tự & phân cụm phân hoạch',
  'Giới thiệu &amp; thách thức phân cụm; độ đo (Minkowski, cosine, tương quan); phân hoạch (K-Means, K-Medoids/PAM, K-Modes, Kernel K-Means).',
  [[
    `<span class="eyebrow">DBM302m · Chapter 4 · Lesson 4.1</span>
<h2>Cluster analysis: similarity &amp; partitioning</h2>
<p class="lead"><strong>Clustering</strong> is unsupervised: group objects so that within-group similarity is high and between-group similarity is low — with no labels given.</p>
<h3>Challenges</h3>
<p>Choosing k, scalability, arbitrary shapes, high dimensionality, mixed attribute types, and sensitivity to noise/outliers.</p>
<h3>Similarity measures</h3>
<ul>
<li><strong>Minkowski</strong> — generalizes Manhattan (p=1) and Euclidean (p=2).</li>
<li><strong>Cosine</strong> — angle between vectors; good for text/high-dimensional sparse data.</li>
<li><strong>Correlation</strong> — similarity of shape/trend rather than magnitude.</li>
</ul>
<h3>Partitioning methods</h3>
<ul>
<li><strong>K-Means</strong> — k centroids; assign to nearest, recompute means, repeat. Fast, but assumes spherical clusters and is sensitive to outliers.</li>
<li><strong>K-Medoids (PAM)</strong> — uses actual objects (medoids) as centers; more robust to outliers.</li>
<li><strong>K-Modes</strong> — for categorical data (mode instead of mean).</li>
<li><strong>Kernel K-Means</strong> — maps data to a higher space to separate non-spherical clusters.</li>
</ul>
<pre><code class="language-python">from sklearn.cluster import KMeans
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
print(km.labels_)        # cluster of each object
print(km.inertia_)       # within-cluster sum of squares (lower is tighter)</code></pre>`,
    `<span class="eyebrow">DBM302m · Chương 4 · Bài 4.1</span>
<h2>Phân tích cụm: độ tương tự &amp; phân hoạch</h2>
<p class="lead"><strong>Phân cụm</strong> là học không giám sát: nhóm đối tượng sao cho tương tự trong nhóm cao và giữa nhóm thấp — không có nhãn cho trước.</p>
<h3>Thách thức</h3>
<p>Chọn k, khả năng mở rộng, hình dạng tuỳ ý, số chiều cao, thuộc tính hỗn hợp, và nhạy với nhiễu/ngoại lai.</p>
<h3>Độ đo tương tự</h3>
<ul>
<li><strong>Minkowski</strong> — khái quát Manhattan (p=1) và Euclid (p=2).</li>
<li><strong>Cosine</strong> — góc giữa hai vector; hợp với văn bản/dữ liệu thưa nhiều chiều.</li>
<li><strong>Tương quan</strong> — giống nhau về hình dạng/xu hướng hơn là độ lớn.</li>
</ul>
<h3>Phương pháp phân hoạch</h3>
<ul>
<li><strong>K-Means</strong> — k tâm; gán về tâm gần nhất, tính lại trung bình, lặp. Nhanh, nhưng giả định cụm cầu và nhạy ngoại lai.</li>
<li><strong>K-Medoids (PAM)</strong> — dùng đối tượng thật (medoid) làm tâm; bền hơn với ngoại lai.</li>
<li><strong>K-Modes</strong> — cho dữ liệu phân loại (mode thay cho mean).</li>
<li><strong>Kernel K-Means</strong> — ánh xạ lên không gian cao hơn để tách cụm phi cầu.</li>
</ul>
<pre><code class="language-python">from sklearn.cluster import KMeans
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
print(km.labels_)        # cum cua tung doi tuong
print(km.inertia_)       # tong binh phuong trong cum (cang nho cang chat)</code></pre>`,
  ]]);

const c4b = doc('dbm302m-4-2-hierarchical-density-validation', '4.2 — Hierarchical, density & validation|||4.2 — Phân cấp, mật độ & kiểm định',
  'Phân cấp (agglomerative/divisive, BIRCH, CURE, CHAMELEON); mật độ/lưới (DBSCAN, OPTICS, STING, CLIQUE); kiểm định (internal/external).',
  [[
    `<span class="eyebrow">DBM302m · Chapter 4 · Lesson 4.2</span>
<h2>Hierarchical, density-based clustering &amp; validation</h2>
<h3>Hierarchical methods</h3>
<ul>
<li><strong>Agglomerative</strong> — bottom-up: start with singletons, merge the closest (single/complete/average linkage) into a <em>dendrogram</em>.</li>
<li><strong>Divisive</strong> — top-down: split one big cluster repeatedly.</li>
<li><strong>BIRCH</strong> (CF-tree, scalable), <strong>CURE</strong> (representative points, non-spherical), <strong>CHAMELEON</strong> (dynamic modeling of interconnectivity).</li>
</ul>
<h3>Density &amp; grid-based</h3>
<ul>
<li><strong>DBSCAN</strong> — clusters = dense regions (eps, minPts); finds arbitrary shapes and marks noise. No k needed.</li>
<li><strong>OPTICS</strong> — orders points to reveal clusters at varying densities.</li>
<li><strong>STING</strong>, <strong>CLIQUE</strong> — grid-based; CLIQUE also finds subspace clusters in high dimensions.</li>
</ul>
<pre><code class="language-python">from sklearn.cluster import DBSCAN
db = DBSCAN(eps=0.5, min_samples=5).fit(X)
labels = db.labels_          # -1 marks noise / outliers
n_clusters = len(set(labels)) - (1 if -1 in labels else 0)</code></pre>
<h3>Validation</h3>
<ul>
<li><strong>Internal</strong> (no labels) — Silhouette, Davies-Bouldin, within/between scatter.</li>
<li><strong>External</strong> (labels known) — Rand Index / ARI, purity, normalized mutual information.</li>
</ul>
<div class="callout"><span class="badge">Pick by shape</span> Spherical, known k → K-Means. Arbitrary shapes + noise → DBSCAN. Want a hierarchy / dendrogram → agglomerative.</div>`,
    `<span class="eyebrow">DBM302m · Chương 4 · Bài 4.2</span>
<h2>Phân cấp, phân cụm mật độ &amp; kiểm định</h2>
<h3>Phương pháp phân cấp</h3>
<ul>
<li><strong>Agglomerative</strong> — dưới lên: bắt từ điểm đơn, gộp cặp gần nhất (single/complete/average linkage) thành một <em>dendrogram</em>.</li>
<li><strong>Divisive</strong> — trên xuống: tách một cụm lớn liên tục.</li>
<li><strong>BIRCH</strong> (CF-tree, mở rộng tốt), <strong>CURE</strong> (điểm đại diện, phi cầu), <strong>CHAMELEON</strong> (mô hình động độ liên kết).</li>
</ul>
<h3>Mật độ &amp; lưới</h3>
<ul>
<li><strong>DBSCAN</strong> — cụm = vùng dày đặc (eps, minPts); tìm hình dạng tuỳ ý và đánh dấu nhiễu. Không cần k.</li>
<li><strong>OPTICS</strong> — sắp thứ tự điểm để lộ cụm ở nhiều mật độ khác nhau.</li>
<li><strong>STING</strong>, <strong>CLIQUE</strong> — dựa trên lưới; CLIQUE còn tìm cụm không gian con ở nhiều chiều.</li>
</ul>
<pre><code class="language-python">from sklearn.cluster import DBSCAN
db = DBSCAN(eps=0.5, min_samples=5).fit(X)
labels = db.labels_          # -1 danh dau nhieu / ngoai lai
n_clusters = len(set(labels)) - (1 if -1 in labels else 0)</code></pre>
<h3>Kiểm định</h3>
<ul>
<li><strong>Trong (internal)</strong> (không nhãn) — Silhouette, Davies-Bouldin, phân tán trong/giữa cụm.</li>
<li><strong>Ngoài (external)</strong> (có nhãn) — Rand Index / ARI, purity, thông tin tương hỗ chuẩn hoá.</li>
</ul>
<div class="callout"><span class="badge">Chọn theo hình dạng</span> Cụm cầu, biết k → K-Means. Hình tuỳ ý + nhiễu → DBSCAN. Cần cây phân cấp / dendrogram → agglomerative.</div>`,
  ]]);

const c4q = quiz('dbm302m-quiz-4', 'Quiz 4 — Cluster analysis|||Quiz 4 — Phân cụm', [
  { id: 'q1', question: 'Ưu điểm chính của DBSCAN so với K-Means là?', options: ['Luôn nhanh hơn', 'Tìm được cụm hình dạng tuỳ ý và tự đánh dấu nhiễu, không cần chọn k', 'Luôn cho ít cụm hơn', 'Chỉ chạy với dữ liệu phân loại'], correctIndex: 1, explanation: 'DBSCAN dựa mật độ: hình tuỳ ý, phát hiện nhiễu, không cần k.' },
  { id: 'q2', question: 'K-Medoids (PAM) bền với ngoại lai hơn K-Means vì?', options: ['Dùng đối tượng thật làm tâm thay vì trung bình', 'Không cần khoảng cách', 'Luôn tạo cụm cầu', 'Dùng cây CF'], correctIndex: 0, explanation: 'Medoid là một điểm dữ liệu thật, ít bị kéo lệch bởi ngoại lai như mean.' },
  { id: 'q3', question: 'Độ đo nào là kiểm định NGOÀI (external) — cần biết nhãn thật?', options: ['Silhouette', 'Davies-Bouldin', 'Adjusted Rand Index (ARI)', 'Inertia (WCSS)'], correctIndex: 2, explanation: 'ARI so cụm với nhãn thật → external; Silhouette/DB/inertia là internal.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'DBM302m',
    slug: 'dbm302m-data-mining',
    title: 'Data Mining',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DBM302m.webp',
    shortDescription: 'Khám phá mẫu & tri thức từ dữ liệu: pipeline KDD, tiền xử lý, kho dữ liệu (OLAP), trực quan hoá, khám phá mẫu (Apriori, FP-Growth, mẫu tuần tự) & phân cụm (K-Means, DBSCAN). Thực hành Jupyter/scikit-learn. Song ngữ, có code & quiz.|||Discover patterns & knowledge from data: the KDD pipeline, preprocessing, data warehousing (OLAP), visualization, pattern discovery (Apriori, FP-Growth) & cluster analysis (K-Means, DBSCAN). Bilingual, with code & quizzes.',
    description: 'Môn <strong>DBM302m — Data Mining (Khai phá dữ liệu)</strong> thuộc khung chương trình ngành IT FPTU, kỳ 7. Bám giáo trình FLM (nguồn chính: Coursera <em>Data Mining Specialization</em> — UIUC, Jiawei Han và sách Han/Kamber/Pei). Bốn chương: <strong>(1) Data Mining Pipeline</strong> — pipeline KDD, hiểu dữ liệu, tiền xử lý, kho dữ liệu &amp; OLAP; <strong>(2) Data Visualization</strong> — trực quan dữ liệu số &amp; phi số, dashboard; <strong>(3) Pattern Discovery</strong> — tập phổ biến, luật kết hợp, Apriori/FP-Growth, mẫu tuần tự; <strong>(4) Cluster Analysis</strong> — K-Means, phân cấp, DBSCAN, kiểm định cụm. Song ngữ, thực hành bằng Jupyter/pandas/scikit-learn, quiz mỗi chương.',
    whatYouLearn: 'Pipeline KDD; đối tượng &amp; thuộc tính; thống kê mô tả &amp; độ tương tự (Euclid/cosine/Jaccard); tiền xử lý (cleaning/integration/transformation/reduction); kho dữ liệu, data cube &amp; OLAP; trực quan hoá (histogram/boxplot/scatter, dashboard); tập phổ biến &amp; luật kết hợp (support/confidence, Apriori, FP-Growth, closed/max, lift/χ²/null-invariance); mẫu tuần tự (GSP/SPADE/PrefixSpan) &amp; không-thời gian; phân cụm (K-Means/K-Medoids/K-Modes, phân cấp/BIRCH/CURE, DBSCAN/OPTICS/STING/CLIQUE) &amp; kiểm định internal/external; thực hành với Jupyter, pandas, scikit-learn.',
    requirements: 'Cơ bản về CSDL, thống kê nhập môn và lập trình Python (hoặc R). Nên cài Jupyter Notebook hoặc RStudio, kèm pandas &amp; scikit-learn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Coursera Data Mining, sách Han/Kamber/Pei, scikit-learn/pandas, Jupyter/RStudio, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Data mining là gì, pipeline KDD, 4 CLO, cơ cấu điểm.', lessons: [intro] },
    { title: 'Chương 1 — Data Mining Pipeline|||Chapter 1 — Data Mining Pipeline', description: 'Pipeline KDD, hiểu dữ liệu, tiền xử lý, kho dữ liệu & OLAP.', lessons: [c1a, c1b, c1q] },
    { title: 'Chương 2 — Data Visualization|||Chapter 2 — Data Visualization', description: 'Trực quan dữ liệu số & phi số, dashboard.', lessons: [c2a, c2q] },
    { title: 'Chương 3 — Pattern Discovery|||Chapter 3 — Pattern Discovery', description: 'Tập phổ biến, luật kết hợp, Apriori/FP-Growth, mẫu tuần tự.', lessons: [c3a, c3b, c3q] },
    { title: 'Chương 4 — Cluster Analysis|||Chapter 4 — Cluster Analysis', description: 'K-Means, phân cấp, DBSCAN, kiểm định cụm.', lessons: [c4a, c4b, c4q] },
  ],
};
