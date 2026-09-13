/**
 * DSI201 — Data Science (Khoa học dữ liệu). Ngành Khoa học Máy tính FPTU, Kỳ 3.
 * Khung chất lượng, song ngữ: quy trình DS/CRISP-DM → Python (numpy/pandas) →
 * thu thập & làm sạch → EDA → trực quan hoá → thống kê → nhập môn học máy
 * (scikit-learn) → đánh giá mô hình & đạo đức. Có khối code Python (pre-code).
 * Sách chuẩn: McKinney "Python for Data Analysis", VanderPlas "Python Data
 * Science Handbook", James et al "Introduction to Statistical Learning".
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ Không backtick lồng/${ trong
 * HTML; "&"→&amp; trong content; tránh nháy đơn (dùng "do not").
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dsi201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế (kèm link), tài liệu chính thức miễn phí, Kaggle Learn, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">DSI201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Data Science</strong> with Python — the DS process, numpy &amp; pandas, cleaning, EDA, visualization, statistics and intro machine learning — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DSI201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://wesmckinney.com/book/" target="_blank" rel="noopener">Wes McKinney — <em>Python for Data Analysis</em> (free online)</a></li>
<li><a href="https://jakevdp.github.io/PythonDataScienceHandbook/" target="_blank" rel="noopener">Jake VanderPlas — <em>Python Data Science Handbook</em> (free online)</a></li>
<li><a href="https://www.statlearning.com/" target="_blank" rel="noopener">James, Witten, Hastie &amp; Tibshirani — <em>Introduction to Statistical Learning</em> (free PDF)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">pandas documentation</a> · <a href="https://numpy.org/doc/stable/" target="_blank" rel="noopener">NumPy documentation</a></li>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn user guide</a></li>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn — hands-on micro-courses</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@StatQuest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — statistics &amp; ML explained simply</li>
<li><a href="https://www.youtube.com/@coreyms" target="_blank" rel="noopener">Corey Schafer</a> — pandas &amp; Python tutorials</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter Notebook</a> — interactive notebooks for analysis</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — free notebooks in the browser (no setup)</li>
<li><a href="https://www.anaconda.com/download" target="_blank" rel="noopener">Anaconda</a> — Python + data science packages bundled</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the DS process (CRISP-DM), numpy arrays and pandas DataFrames, reading/writing data.</li>
<li><strong>Practice</strong> — clean a messy dataset, then explore it (groupby, correlation) and plot it on Kaggle or Colab.</li>
<li><strong>Go deeper</strong> — statistics (distributions, hypothesis tests, regression) and intro machine learning with scikit-learn.</li>
<li><strong>Job-ready</strong> — evaluate models honestly (metrics, overfitting) and respect ethics, bias and privacy.</li>
</ol></div>`,
    `<span class="eyebrow">DSI201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Khoa học dữ liệu</strong> bằng Python — quy trình DS, numpy &amp; pandas, làm sạch, EDA, trực quan hoá, thống kê và nhập môn học máy — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DSI201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://wesmckinney.com/book/" target="_blank" rel="noopener">Wes McKinney — <em>Python for Data Analysis</em> (đọc miễn phí)</a></li>
<li><a href="https://jakevdp.github.io/PythonDataScienceHandbook/" target="_blank" rel="noopener">Jake VanderPlas — <em>Python Data Science Handbook</em> (đọc miễn phí)</a></li>
<li><a href="https://www.statlearning.com/" target="_blank" rel="noopener">James, Witten, Hastie &amp; Tibshirani — <em>Introduction to Statistical Learning</em> (PDF miễn phí)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">Tài liệu pandas</a> · <a href="https://numpy.org/doc/stable/" target="_blank" rel="noopener">Tài liệu NumPy</a></li>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">Hướng dẫn scikit-learn</a></li>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn — khoá thực hành ngắn</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@StatQuest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — thống kê &amp; ML giảng dễ hiểu</li>
<li><a href="https://www.youtube.com/@coreyms" target="_blank" rel="noopener">Corey Schafer</a> — hướng dẫn pandas &amp; Python</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter Notebook</a> — sổ tay tương tác để phân tích</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — notebook miễn phí trên trình duyệt (không cài đặt)</li>
<li><a href="https://www.anaconda.com/download" target="_blank" rel="noopener">Anaconda</a> — gói sẵn Python + thư viện khoa học dữ liệu</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — quy trình DS (CRISP-DM), mảng numpy và DataFrame pandas, đọc/ghi dữ liệu.</li>
<li><strong>Luyện tập</strong> — làm sạch một bộ dữ liệu lộn xộn, rồi khám phá (groupby, tương quan) và vẽ biểu đồ trên Kaggle hoặc Colab.</li>
<li><strong>Đào sâu</strong> — thống kê (phân phối, kiểm định giả thuyết, hồi quy) và nhập môn học máy với scikit-learn.</li>
<li><strong>Sẵn sàng đi làm</strong> — đánh giá mô hình trung thực (metrics, overfitting) và tôn trọng đạo đức, thiên lệch, quyền riêng tư.</li>
</ol></div>`,
  ]]);

const intro = doc('dsi201-0-1-overview', 'Course overview: Data Science|||Tổng quan: Khoa học dữ liệu',
  'Khoa học dữ liệu làm gì; dữ liệu → hiểu biết → quyết định; lộ trình 8 chương: quy trình DS → Python → làm sạch → EDA → trực quan → thống kê → học máy → đánh giá & đạo đức.',
  [[
    `<span class="eyebrow">DSI201 · Lesson 0.1 · Overview</span>
<h2>What is Data Science?</h2>
<p class="lead"><strong>Data Science</strong> turns raw data into <strong>insight</strong> and better <strong>decisions</strong>. It blends three skills: <strong>programming</strong> (Python), <strong>statistics</strong> (asking sound questions of data), and <strong>domain knowledge</strong> (knowing what matters).</p>
<h3>The value chain</h3>
<p><strong>Data → Cleaning → Analysis → Visualization → Model → Decision.</strong> Every chapter of this course is one link in that chain.</p>
<h3>Why Python?</h3>
<p>Python is the lingua franca of data science: <code>numpy</code> for fast arrays, <code>pandas</code> for tables, <code>matplotlib</code>/<code>seaborn</code> for charts, and <code>scikit-learn</code> for machine learning — all free and open source.</p>
<h3>Roadmap</h3>
<p>DS process (CRISP-DM) → Python for DS (numpy &amp; pandas) → collecting &amp; cleaning data → exploratory analysis (EDA) → visualization → statistics → intro machine learning → model evaluation &amp; ethics. Bilingual, with runnable Python and a quiz per chapter.</p>`,
    `<span class="eyebrow">DSI201 · Bài 0.1 · Tổng quan</span>
<h2>Khoa học dữ liệu là gì?</h2>
<p class="lead"><strong>Khoa học dữ liệu</strong> biến dữ liệu thô thành <strong>hiểu biết</strong> và <strong>quyết định</strong> tốt hơn. Nó pha trộn ba kỹ năng: <strong>lập trình</strong> (Python), <strong>thống kê</strong> (đặt câu hỏi đúng cho dữ liệu), và <strong>kiến thức lĩnh vực</strong> (biết điều gì quan trọng).</p>
<h3>Chuỗi giá trị</h3>
<p><strong>Dữ liệu → Làm sạch → Phân tích → Trực quan hoá → Mô hình → Quyết định.</strong> Mỗi chương của môn này là một mắt xích trong chuỗi đó.</p>
<h3>Vì sao dùng Python?</h3>
<p>Python là ngôn ngữ chung của khoa học dữ liệu: <code>numpy</code> cho mảng nhanh, <code>pandas</code> cho bảng, <code>matplotlib</code>/<code>seaborn</code> cho biểu đồ, và <code>scikit-learn</code> cho học máy — tất cả đều miễn phí và mã nguồn mở.</p>
<h3>Lộ trình</h3>
<p>Quy trình DS (CRISP-DM) → Python cho DS (numpy &amp; pandas) → thu thập &amp; làm sạch dữ liệu → phân tích khám phá (EDA) → trực quan hoá → thống kê → nhập môn học máy → đánh giá mô hình &amp; đạo đức. Song ngữ, có code Python chạy được và quiz mỗi chương.</p>`,
  ]]);

/* ── Chương 1 — Data Science là gì ─────────────────────────────────────── */
const c1 = doc('dsi201-1-1-ds-process', '1.1 — What is Data Science (the process)|||1.1 — Data Science là gì (quy trình)',
  'Quy trình DS/CRISP-DM (6 bước), vai trò data scientist, phân biệt data science vs analytics vs machine learning.',
  [[
    `<span class="eyebrow">DSI201 · Chapter 1 · Lesson 1.1</span>
<h2>What is Data Science — the process</h2>
<h3>CRISP-DM — six repeatable steps</h3>
<ol>
<li><strong>Business understanding</strong> — what question are we answering?</li>
<li><strong>Data understanding</strong> — what data do we have, and is it trustworthy?</li>
<li><strong>Data preparation</strong> — clean and shape it (often 80% of the work).</li>
<li><strong>Modeling</strong> — fit a statistical or ML model.</li>
<li><strong>Evaluation</strong> — does it actually answer the question?</li>
<li><strong>Deployment</strong> — put results in front of decision-makers.</li>
</ol>
<h3>Three overlapping terms</h3>
<ul>
<li><strong>Data analytics</strong> — describe what happened (reports, dashboards).</li>
<li><strong>Data science</strong> — the whole pipeline, incl. prediction &amp; experiments.</li>
<li><strong>Machine learning</strong> — algorithms that learn patterns to predict.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Data science is a <strong>loop</strong>, not a line — evaluation often sends you back to cleaning or to a better question.</div>`,
    `<span class="eyebrow">DSI201 · Chương 1 · Bài 1.1</span>
<h2>Data Science là gì — quy trình</h2>
<h3>CRISP-DM — sáu bước lặp lại</h3>
<ol>
<li><strong>Hiểu bài toán</strong> — ta đang trả lời câu hỏi gì?</li>
<li><strong>Hiểu dữ liệu</strong> — có dữ liệu gì, có đáng tin không?</li>
<li><strong>Chuẩn bị dữ liệu</strong> — làm sạch và nắn hình (thường chiếm 80% công sức).</li>
<li><strong>Lập mô hình</strong> — khớp một mô hình thống kê hoặc ML.</li>
<li><strong>Đánh giá</strong> — nó có thật sự trả lời câu hỏi không?</li>
<li><strong>Triển khai</strong> — đưa kết quả tới người ra quyết định.</li>
</ol>
<h3>Ba thuật ngữ chồng lấn</h3>
<ul>
<li><strong>Phân tích dữ liệu (analytics)</strong> — mô tả điều đã xảy ra (báo cáo, dashboard).</li>
<li><strong>Khoa học dữ liệu</strong> — toàn bộ pipeline, gồm cả dự đoán &amp; thử nghiệm.</li>
<li><strong>Học máy</strong> — thuật toán học quy luật để dự đoán.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Khoa học dữ liệu là một <strong>vòng lặp</strong>, không phải đường thẳng — đánh giá thường đẩy ta quay lại làm sạch hoặc đặt câu hỏi tốt hơn.</div>`,
  ]]);

const c1q = quiz('dsi201-quiz-1', 'Quiz 1 — DS process|||Quiz 1 — Quy trình DS', [
  { id: 'q1', question: 'CRISP-DM bắt đầu bằng bước nào?', options: ['Modeling (lập mô hình)', 'Business understanding (hiểu bài toán)', 'Deployment (triển khai)', 'Evaluation (đánh giá)'], correctIndex: 1, explanation: 'Luôn bắt đầu từ câu hỏi kinh doanh cần trả lời.' },
  { id: 'q2', question: 'Bước nào thường chiếm nhiều công sức nhất (khoảng 80%)?', options: ['Modeling', 'Data preparation (làm sạch & chuẩn bị)', 'Deployment', 'Business understanding'], correctIndex: 1, explanation: 'Chuẩn bị/làm sạch dữ liệu thường tốn nhiều thời gian nhất.' },
  { id: 'q3', question: 'Điểm khác biệt của "machine learning" so với "analytics"?', options: ['Chỉ vẽ dashboard', 'Thuật toán học quy luật để DỰ ĐOÁN', 'Chỉ đọc/ghi file', 'Không dùng dữ liệu'], correctIndex: 1, explanation: 'ML học từ dữ liệu để dự đoán; analytics mô tả điều đã xảy ra.' },
]);

/* ── Chương 2 — Python cho DS ──────────────────────────────────────────── */
const c2 = doc('dsi201-2-1-python-numpy-pandas', '2.1 — Python for DS (numpy & pandas)|||2.1 — Python cho DS (numpy & pandas)',
  'Mảng numpy (vector hoá), DataFrame pandas (bảng có nhãn), đọc/ghi dữ liệu (CSV) — khối code Python mẫu.',
  [[
    `<span class="eyebrow">DSI201 · Chapter 2 · Lesson 2.1</span>
<h2>Python for Data Science</h2>
<h3>NumPy — fast numeric arrays</h3>
<p>A NumPy <code>ndarray</code> stores numbers in a compact block and applies operations to the whole array at once (<strong>vectorization</strong>) — far faster than Python loops.</p>
<pre><code>import numpy as np

a = np.array([1, 2, 3, 4])
print(a * 2)        # [2 4 6 8]  -- element-wise, no loop
print(a.mean())     # 2.5
print(a[a &gt; 2])     # [3 4]      -- boolean mask
</code></pre>
<h3>pandas — labeled tables</h3>
<p>A <code>DataFrame</code> is a table with named columns; a <code>Series</code> is one column.</p>
<pre><code>import pandas as pd

df = pd.read_csv("students.csv")   # read data in
print(df.head())                   # first 5 rows
print(df.shape)                    # (rows, cols)
print(df["score"].mean())          # average of one column
df.to_csv("clean.csv", index=False)  # write data out
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Prefer vectorized numpy/pandas operations over Python <code>for</code> loops — shorter, and often 10–100× faster.</div>`,
    `<span class="eyebrow">DSI201 · Chương 2 · Bài 2.1</span>
<h2>Python cho Khoa học dữ liệu</h2>
<h3>NumPy — mảng số nhanh</h3>
<p>Một <code>ndarray</code> của NumPy lưu các số trong một khối gọn và áp phép toán lên cả mảng cùng lúc (<strong>vector hoá</strong>) — nhanh hơn nhiều vòng lặp Python.</p>
<pre><code>import numpy as np

a = np.array([1, 2, 3, 4])
print(a * 2)        # [2 4 6 8]  -- theo từng phần tử, không cần vòng lặp
print(a.mean())     # 2.5
print(a[a &gt; 2])     # [3 4]      -- mặt nạ boolean
</code></pre>
<h3>pandas — bảng có nhãn</h3>
<p>Một <code>DataFrame</code> là bảng có cột đặt tên; một <code>Series</code> là một cột.</p>
<pre><code>import pandas as pd

df = pd.read_csv("students.csv")   # đọc dữ liệu vào
print(df.head())                   # 5 dòng đầu
print(df.shape)                    # (số dòng, số cột)
print(df["score"].mean())          # trung bình một cột
df.to_csv("clean.csv", index=False)  # ghi dữ liệu ra
</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Ưu tiên phép toán vector hoá của numpy/pandas hơn vòng lặp <code>for</code> — ngắn hơn, và thường nhanh gấp 10–100 lần.</div>`,
  ]]);

const c2q = quiz('dsi201-quiz-2', 'Quiz 2 — Python for DS|||Quiz 2 — Python cho DS', [
  { id: 'q1', question: 'Cấu trúc dữ liệu bảng có cột đặt tên trong pandas là?', options: ['ndarray', 'DataFrame', 'list', 'dict'], correctIndex: 1, explanation: 'DataFrame là bảng 2 chiều có nhãn cột; Series là một cột.' },
  { id: 'q2', question: 'Áp phép toán lên cả mảng cùng lúc thay vì vòng lặp gọi là?', options: ['Recursion (đệ quy)', 'Vectorization (vector hoá)', 'Serialization', 'Normalization'], correctIndex: 1, explanation: 'Vector hoá của numpy nhanh hơn vòng lặp Python nhiều.' },
  { id: 'q3', question: 'Lệnh nào đọc một file CSV vào DataFrame?', options: ['pd.open_csv()', 'pd.read_csv()', 'pd.load_csv()', 'pd.csv()'], correctIndex: 1, explanation: 'pd.read_csv("file.csv") đọc dữ liệu; df.to_csv() ghi ra.' },
]);

/* ── Chương 3 — Thu thập & làm sạch ────────────────────────────────────── */
const c3 = doc('dsi201-3-1-cleaning', '3.1 — Collecting & cleaning data|||3.1 — Thu thập & làm sạch dữ liệu',
  'Giá trị thiếu (missing), giá trị ngoại lai (outlier), biến đổi (transformation) — khối code pandas mẫu.',
  [[
    `<span class="eyebrow">DSI201 · Chapter 3 · Lesson 3.1</span>
<h2>Collecting &amp; cleaning data</h2>
<p class="lead">Real data is messy — missing cells, wrong types, duplicates, outliers. Cleaning is where a data scientist spends most time, and it decides whether the analysis is trustworthy.</p>
<h3>Missing values</h3>
<pre><code>df.isna().sum()               # count missing per column
df = df.dropna(subset=["age"])  # drop rows missing age
df["income"] = df["income"].fillna(df["income"].median())  # impute
</code></pre>
<h3>Outliers &amp; transformation</h3>
<pre><code>df = df.drop_duplicates()
df["age"] = df["age"].astype(int)          # fix dtype
q1, q3 = df["price"].quantile([0.25, 0.75])
iqr = q3 - q1
mask = df["price"].between(q1 - 1.5*iqr, q3 + 1.5*iqr)
df = df[mask]                               # keep non-outliers (IQR rule)
</code></pre>
<div class="callout"><span class="badge">Watch out</span> Dropping vs. imputing missing values changes your results — decide on purpose, and write down what you did.</div>`,
    `<span class="eyebrow">DSI201 · Chương 3 · Bài 3.1</span>
<h2>Thu thập &amp; làm sạch dữ liệu</h2>
<p class="lead">Dữ liệu thật thì lộn xộn — ô trống, sai kiểu, trùng lặp, ngoại lai. Làm sạch là nơi data scientist tốn nhiều thời gian nhất, và nó quyết định phân tích có đáng tin hay không.</p>
<h3>Giá trị thiếu</h3>
<pre><code>df.isna().sum()               # đếm ô thiếu mỗi cột
df = df.dropna(subset=["age"])  # bỏ dòng thiếu tuổi
df["income"] = df["income"].fillna(df["income"].median())  # điền bằng trung vị
</code></pre>
<h3>Ngoại lai &amp; biến đổi</h3>
<pre><code>df = df.drop_duplicates()
df["age"] = df["age"].astype(int)          # sửa kiểu dữ liệu
q1, q3 = df["price"].quantile([0.25, 0.75])
iqr = q3 - q1
mask = df["price"].between(q1 - 1.5*iqr, q3 + 1.5*iqr)
df = df[mask]                               # giữ phần không ngoại lai (quy tắc IQR)
</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> Bỏ dòng hay điền giá trị thiếu sẽ làm kết quả khác nhau — hãy chọn có chủ đích, và ghi lại việc mình đã làm.</div>`,
  ]]);

const c3q = quiz('dsi201-quiz-3', 'Quiz 3 — Cleaning|||Quiz 3 — Làm sạch', [
  { id: 'q1', question: 'Lệnh nào đếm số giá trị thiếu mỗi cột?', options: ['df.count()', 'df.isna().sum()', 'df.dropna()', 'df.shape'], correctIndex: 1, explanation: 'isna() trả True/False cho ô thiếu; .sum() cộng theo cột.' },
  { id: 'q2', question: '"Điền" (impute) giá trị thiếu bằng trung vị dùng lệnh?', options: ['fillna(median)', 'dropna()', 'drop_duplicates()', 'astype(int)'], correctIndex: 0, explanation: 'fillna() điền giá trị thay cho ô thiếu; median ít bị ngoại lai kéo lệch.' },
  { id: 'q3', question: 'Quy tắc IQR (1.5×IQR) dùng để phát hiện?', options: ['Giá trị trùng lặp', 'Giá trị ngoại lai (outlier)', 'Sai kiểu dữ liệu', 'Cột thiếu tên'], correctIndex: 1, explanation: 'Điểm nằm ngoài [Q1-1.5·IQR, Q3+1.5·IQR] bị coi là ngoại lai.' },
]);

/* ── Chương 4 — EDA ────────────────────────────────────────────────────── */
const c4 = doc('dsi201-4-1-eda', '4.1 — Exploratory Data Analysis (EDA)|||4.1 — Phân tích khám phá (EDA)',
  'Thống kê mô tả (describe), groupby (nhóm & tổng hợp), tương quan (correlation) — khối code pandas mẫu.',
  [[
    `<span class="eyebrow">DSI201 · Chapter 4 · Lesson 4.1</span>
<h2>Exploratory Data Analysis (EDA)</h2>
<p class="lead">Before modeling, <strong>look</strong> at the data: summarize it, group it, and check how variables move together. EDA finds surprises and shapes the questions worth asking.</p>
<h3>Describe &amp; group</h3>
<pre><code>df.describe()                 # count, mean, std, min, quartiles, max
df["gender"].value_counts()   # frequency of each category

# average score per class, sorted
df.groupby("class")["score"].mean().sort_values(ascending=False)
</code></pre>
<h3>Correlation</h3>
<pre><code>df[["hours", "score"]].corr()   # -1..+1; near +1 = move together
</code></pre>
<div class="callout"><span class="badge">Remember</span> Correlation is <strong>not</strong> causation — two things moving together do not prove one causes the other.</div>`,
    `<span class="eyebrow">DSI201 · Chương 4 · Bài 4.1</span>
<h2>Phân tích khám phá (EDA)</h2>
<p class="lead">Trước khi lập mô hình, hãy <strong>nhìn</strong> vào dữ liệu: tóm tắt, nhóm lại, và xem các biến biến thiên cùng nhau ra sao. EDA phát hiện bất ngờ và định hình câu hỏi đáng hỏi.</p>
<h3>Tóm tắt &amp; nhóm</h3>
<pre><code>df.describe()                 # đếm, trung bình, độ lệch chuẩn, min, tứ phân vị, max
df["gender"].value_counts()   # tần suất mỗi nhóm

# điểm trung bình mỗi lớp, sắp giảm dần
df.groupby("class")["score"].mean().sort_values(ascending=False)
</code></pre>
<h3>Tương quan</h3>
<pre><code>df[["hours", "score"]].corr()   # -1..+1; gần +1 = biến thiên cùng chiều
</code></pre>
<div class="callout"><span class="badge">Nhớ</span> Tương quan <strong>không</strong> phải nhân quả — hai thứ biến thiên cùng nhau không chứng minh cái này gây ra cái kia.</div>`,
  ]]);

const c4q = quiz('dsi201-quiz-4', 'Quiz 4 — EDA|||Quiz 4 — EDA', [
  { id: 'q1', question: 'Lệnh nào cho count, mean, std, min/max và tứ phân vị của cột số?', options: ['df.info()', 'df.describe()', 'df.head()', 'df.corr()'], correctIndex: 1, explanation: 'describe() trả thống kê mô tả cho các cột số.' },
  { id: 'q2', question: 'Để tính điểm trung bình theo từng lớp, ta dùng?', options: ['df.sort_values()', 'df.groupby("class")["score"].mean()', 'df.value_counts()', 'df.dropna()'], correctIndex: 1, explanation: 'groupby nhóm theo cột rồi áp hàm tổng hợp (mean) lên mỗi nhóm.' },
  { id: 'q3', question: 'Hệ số tương quan gần +1 nghĩa là?', options: ['Hai biến biến thiên cùng chiều mạnh', 'Cái này gây ra cái kia', 'Hai biến độc lập', 'Dữ liệu bị thiếu'], correctIndex: 0, explanation: 'Tương quan chỉ đo mức biến thiên cùng nhau, KHÔNG suy ra nhân quả.' },
]);

/* ── Chương 5 — Trực quan hoá ──────────────────────────────────────────── */
const c5 = doc('dsi201-5-1-visualization', '5.1 — Data visualization|||5.1 — Trực quan hoá dữ liệu',
  'matplotlib/seaborn, chọn đúng biểu đồ (hist/bar/scatter/box), kể chuyện bằng dữ liệu (storytelling) — code mẫu.',
  [[
    `<span class="eyebrow">DSI201 · Chapter 5 · Lesson 5.1</span>
<h2>Data visualization</h2>
<h3>Pick the right chart</h3>
<ul>
<li><strong>Histogram</strong> — distribution of ONE numeric variable.</li>
<li><strong>Bar chart</strong> — compare a value across categories.</li>
<li><strong>Scatter plot</strong> — relationship between TWO numeric variables.</li>
<li><strong>Box plot</strong> — spread &amp; outliers, often across groups.</li>
</ul>
<pre><code>import matplotlib.pyplot as plt
import seaborn as sns

sns.histplot(df["score"])          # distribution
sns.scatterplot(data=df, x="hours", y="score")   # relationship
sns.boxplot(data=df, x="class", y="score")       # spread per group
plt.title("Score vs study hours")
plt.show()
</code></pre>
<div class="callout"><span class="badge">Storytelling</span> A good chart has ONE clear message: a title that states the finding, honest axes (start at zero for bars), and no clutter.</div>`,
    `<span class="eyebrow">DSI201 · Chương 5 · Bài 5.1</span>
<h2>Trực quan hoá dữ liệu</h2>
<h3>Chọn đúng biểu đồ</h3>
<ul>
<li><strong>Histogram</strong> — phân phối của MỘT biến số.</li>
<li><strong>Biểu đồ cột (bar)</strong> — so sánh một giá trị giữa các nhóm.</li>
<li><strong>Biểu đồ tán xạ (scatter)</strong> — quan hệ giữa HAI biến số.</li>
<li><strong>Biểu đồ hộp (box)</strong> — độ trải &amp; ngoại lai, thường theo nhóm.</li>
</ul>
<pre><code>import matplotlib.pyplot as plt
import seaborn as sns

sns.histplot(df["score"])          # phân phối
sns.scatterplot(data=df, x="hours", y="score")   # quan hệ
sns.boxplot(data=df, x="class", y="score")       # độ trải theo nhóm
plt.title("Score vs study hours")
plt.show()
</code></pre>
<div class="callout"><span class="badge">Kể chuyện</span> Một biểu đồ tốt có MỘT thông điệp rõ: tiêu đề nói ra kết luận, trục trung thực (cột nên bắt đầu từ 0), và không rối mắt.</div>`,
  ]]);

const c5q = quiz('dsi201-quiz-5', 'Quiz 5 — Visualization|||Quiz 5 — Trực quan hoá', [
  { id: 'q1', question: 'Biểu đồ nào phù hợp để xem phân phối của MỘT biến số?', options: ['Scatter plot', 'Histogram', 'Pie chart', 'Line của hai biến'], correctIndex: 1, explanation: 'Histogram chia biến số thành các khoảng và đếm tần suất.' },
  { id: 'q2', question: 'Xem QUAN HỆ giữa HAI biến số, ta dùng?', options: ['Bar chart', 'Scatter plot (tán xạ)', 'Histogram', 'Box plot của một cột'], correctIndex: 1, explanation: 'Scatter plot đặt mỗi quan sát là một điểm (x, y).' },
  { id: 'q3', question: 'Thực hành trực quan trung thực nào là ĐÚNG?', options: ['Cắt trục y của bar để phóng đại khác biệt', 'Cột bắt đầu từ 0 và tiêu đề nêu rõ kết luận', 'Dùng càng nhiều màu càng tốt', 'Bỏ nhãn trục cho gọn'], correctIndex: 1, explanation: 'Trục trung thực và một thông điệp rõ ràng giúp không đánh lừa người xem.' },
]);

/* ── Chương 6 — Thống kê cho DS ────────────────────────────────────────── */
const c6 = doc('dsi201-6-1-statistics', '6.1 — Statistics for Data Science|||6.1 — Thống kê cho Data Science',
  'Phân phối (chuẩn), kiểm định giả thuyết (p-value, t-test), tổng quan hồi quy (regression) — code mẫu scipy/sklearn.',
  [[
    `<span class="eyebrow">DSI201 · Chapter 6 · Lesson 6.1</span>
<h2>Statistics for Data Science</h2>
<h3>Distributions</h3>
<p>A <strong>distribution</strong> describes how values are spread. The <strong>normal (bell) curve</strong> appears everywhere; it is summarized by its <strong>mean</strong> (center) and <strong>standard deviation</strong> (spread).</p>
<h3>Hypothesis testing</h3>
<p>We ask: is an observed difference <strong>real</strong>, or just chance? A <strong>test</strong> gives a <strong>p-value</strong> — the probability of seeing this result if there were no real effect. Small p (e.g. &lt; 0.05) = evidence against the "no effect" hypothesis.</p>
<pre><code>from scipy import stats

group_a = df[df["group"] == "A"]["score"]
group_b = df[df["group"] == "B"]["score"]
t, p = stats.ttest_ind(group_a, group_b)
print(p)     # p &lt; 0.05 -&gt; difference is unlikely to be pure chance
</code></pre>
<h3>Regression (overview)</h3>
<p><strong>Linear regression</strong> fits a line <code>y = a·x + b</code> to model how <code>x</code> drives <code>y</code> — the bridge from statistics into machine learning.</p>
<div class="callout"><span class="badge">Careful</span> A small p-value means "probably not chance" — it does NOT mean the effect is large or important.</div>`,
    `<span class="eyebrow">DSI201 · Chương 6 · Bài 6.1</span>
<h2>Thống kê cho Data Science</h2>
<h3>Phân phối</h3>
<p>Một <strong>phân phối</strong> mô tả các giá trị trải ra thế nào. <strong>Phân phối chuẩn (hình chuông)</strong> xuất hiện khắp nơi; nó được tóm tắt bởi <strong>trung bình</strong> (tâm) và <strong>độ lệch chuẩn</strong> (độ trải).</p>
<h3>Kiểm định giả thuyết</h3>
<p>Ta hỏi: khác biệt quan sát được là <strong>thật</strong>, hay chỉ do ngẫu nhiên? Một <strong>phép kiểm</strong> cho ra <strong>p-value</strong> — xác suất thấy kết quả này nếu KHÔNG có hiệu ứng thật. p nhỏ (vd &lt; 0.05) = bằng chứng chống lại giả thuyết "không có hiệu ứng".</p>
<pre><code>from scipy import stats

group_a = df[df["group"] == "A"]["score"]
group_b = df[df["group"] == "B"]["score"]
t, p = stats.ttest_ind(group_a, group_b)
print(p)     # p &lt; 0.05 -&gt; khác biệt khó có thể chỉ do ngẫu nhiên
</code></pre>
<h3>Hồi quy (tổng quan)</h3>
<p><strong>Hồi quy tuyến tính</strong> khớp một đường <code>y = a·x + b</code> để mô hình hoá cách <code>x</code> tác động lên <code>y</code> — cây cầu từ thống kê sang học máy.</p>
<div class="callout"><span class="badge">Cẩn thận</span> p-value nhỏ nghĩa là "khó do ngẫu nhiên" — nó KHÔNG nói hiệu ứng lớn hay quan trọng.</div>`,
  ]]);

const c6q = quiz('dsi201-quiz-6', 'Quiz 6 — Statistics|||Quiz 6 — Thống kê', [
  { id: 'q1', question: 'Phân phối chuẩn (bell curve) được tóm tắt bởi?', options: ['Chỉ giá trị lớn nhất', 'Trung bình và độ lệch chuẩn', 'Số dòng dữ liệu', 'Tên cột'], correctIndex: 1, explanation: 'Mean cho tâm, standard deviation cho độ trải của phân phối chuẩn.' },
  { id: 'q2', question: 'p-value nhỏ (< 0.05) trong kiểm định giả thuyết nghĩa là?', options: ['Hiệu ứng rất lớn', 'Kết quả khó xảy ra nếu không có hiệu ứng thật', 'Dữ liệu bị thiếu', 'Hai biến độc lập hoàn toàn'], correctIndex: 1, explanation: 'p là xác suất thấy kết quả này khi giả thuyết "không hiệu ứng" đúng; p nhỏ là bằng chứng chống lại nó.' },
  { id: 'q3', question: 'Hồi quy tuyến tính mô hình hoá quan hệ dưới dạng?', options: ['y = a·x + b (một đường thẳng)', 'Bảng tần suất', 'Danh sách nhóm', 'Ma trận tương quan'], correctIndex: 0, explanation: 'Hồi quy tuyến tính khớp đường thẳng để dự đoán y từ x.' },
]);

/* ── Chương 7 — Học máy nhập môn ───────────────────────────────────────── */
const c7 = doc('dsi201-7-1-ml-intro', '7.1 — Intro to Machine Learning|||7.1 — Học máy nhập môn',
  'Supervised vs unsupervised, chia train/test, hồi quy/phân loại/clustering với scikit-learn — khối code mẫu.',
  [[
    `<span class="eyebrow">DSI201 · Chapter 7 · Lesson 7.1</span>
<h2>Intro to Machine Learning</h2>
<h3>Two families</h3>
<ul>
<li><strong>Supervised</strong> — learn from labeled examples. <em>Regression</em> predicts a number; <em>classification</em> predicts a category.</li>
<li><strong>Unsupervised</strong> — find structure with no labels, e.g. <em>clustering</em> groups similar rows.</li>
</ul>
<h3>Train / test split</h3>
<p>Fit the model on a <strong>training set</strong>, then measure it on unseen <strong>test data</strong> — so you know it generalizes, not just memorizes.</p>
<pre><code>from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

X = df[["hours", "attendance"]]
y = df["passed"]                 # 0 / 1  -&gt; classification
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

model = LogisticRegression()
model.fit(X_train, y_train)      # learn from training data
pred = model.predict(X_test)     # predict on unseen data
</code></pre>
<div class="callout"><span class="badge">Golden rule</span> NEVER evaluate on data the model trained on — always hold out a test set.</div>`,
    `<span class="eyebrow">DSI201 · Chương 7 · Bài 7.1</span>
<h2>Học máy nhập môn</h2>
<h3>Hai họ</h3>
<ul>
<li><strong>Có giám sát (supervised)</strong> — học từ ví dụ có nhãn. <em>Hồi quy</em> dự đoán một con số; <em>phân loại</em> dự đoán một nhóm.</li>
<li><strong>Không giám sát (unsupervised)</strong> — tìm cấu trúc khi không có nhãn, vd <em>clustering</em> gom các dòng giống nhau.</li>
</ul>
<h3>Chia train / test</h3>
<p>Khớp mô hình trên <strong>tập huấn luyện</strong>, rồi đo trên <strong>dữ liệu kiểm tra</strong> chưa từng thấy — để biết nó tổng quát hoá, chứ không phải học vẹt.</p>
<pre><code>from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

X = df[["hours", "attendance"]]
y = df["passed"]                 # 0 / 1  -&gt; bài toán phân loại
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

model = LogisticRegression()
model.fit(X_train, y_train)      # học từ dữ liệu huấn luyện
pred = model.predict(X_test)     # dự đoán trên dữ liệu chưa thấy
</code></pre>
<div class="callout"><span class="badge">Quy tắc vàng</span> KHÔNG BAO GIỜ đánh giá trên dữ liệu mô hình đã học — luôn giữ riêng một tập kiểm tra.</div>`,
  ]]);

const c7q = quiz('dsi201-quiz-7', 'Quiz 7 — ML intro|||Quiz 7 — Học máy nhập môn', [
  { id: 'q1', question: 'Bài toán dự đoán một NHÓM (vd đậu/rớt) thuộc loại?', options: ['Regression (hồi quy)', 'Classification (phân loại)', 'Clustering', 'Data cleaning'], correctIndex: 1, explanation: 'Dự đoán nhãn rời rạc là phân loại; dự đoán số là hồi quy.' },
  { id: 'q2', question: 'Clustering (gom cụm) là học?', options: ['Có giám sát', 'Không giám sát (không nhãn)', 'Tăng cường', 'Không phải học máy'], correctIndex: 1, explanation: 'Clustering tìm nhóm tự nhiên khi dữ liệu KHÔNG có nhãn.' },
  { id: 'q3', question: 'Vì sao phải chia train/test?', options: ['Để chạy nhanh hơn', 'Để đo khả năng tổng quát trên dữ liệu chưa thấy', 'Để có nhiều dữ liệu hơn', 'Để xoá giá trị thiếu'], correctIndex: 1, explanation: 'Đo trên test set cho biết mô hình tổng quát hoá, không học vẹt.' },
]);

/* ── Chương 8 — Đánh giá mô hình & đạo đức ─────────────────────────────── */
const c8 = doc('dsi201-8-1-evaluation-ethics', '8.1 — Model evaluation & ethics|||8.1 — Đánh giá mô hình & đạo đức',
  'Metrics (accuracy/precision/recall, RMSE), overfitting, thiên lệch (bias), quyền riêng tư — khối code sklearn mẫu.',
  [[
    `<span class="eyebrow">DSI201 · Chapter 8 · Lesson 8.1</span>
<h2>Model evaluation &amp; ethics</h2>
<h3>Metrics — classification</h3>
<ul>
<li><strong>Accuracy</strong> — fraction correct (misleading on imbalanced data).</li>
<li><strong>Precision</strong> — of those predicted positive, how many really are.</li>
<li><strong>Recall</strong> — of the real positives, how many we caught.</li>
</ul>
<h3>Metrics — regression</h3>
<p><strong>RMSE</strong> (root mean squared error) — average size of the prediction error, in the same units as <code>y</code>.</p>
<pre><code>from sklearn.metrics import accuracy_score, precision_score, recall_score
print(accuracy_score(y_test, pred))
print(precision_score(y_test, pred))
print(recall_score(y_test, pred))
</code></pre>
<h3>Overfitting</h3>
<p>A model that is great on training data but poor on test data has <strong>overfit</strong> — it memorized noise. Simpler models and more data help.</p>
<h3>Ethics</h3>
<p><strong>Bias</strong> — a model trained on skewed data can be unfair to groups. <strong>Privacy</strong> — handle personal data lawfully and minimally. Always ask who could be harmed.</p>
<div class="callout"><span class="badge">Takeaway</span> A model is only as fair and useful as the data and metric behind it — evaluate honestly, and consider the humans affected.</div>`,
    `<span class="eyebrow">DSI201 · Chương 8 · Bài 8.1</span>
<h2>Đánh giá mô hình &amp; đạo đức</h2>
<h3>Metrics — phân loại</h3>
<ul>
<li><strong>Accuracy (độ chính xác)</strong> — tỉ lệ đoán đúng (dễ đánh lừa khi dữ liệu mất cân bằng).</li>
<li><strong>Precision</strong> — trong số dự đoán là dương, bao nhiêu thật sự dương.</li>
<li><strong>Recall</strong> — trong số dương thật, ta bắt được bao nhiêu.</li>
</ul>
<h3>Metrics — hồi quy</h3>
<p><strong>RMSE</strong> (căn trung bình bình phương sai số) — độ lớn trung bình của sai số dự đoán, cùng đơn vị với <code>y</code>.</p>
<pre><code>from sklearn.metrics import accuracy_score, precision_score, recall_score
print(accuracy_score(y_test, pred))
print(precision_score(y_test, pred))
print(recall_score(y_test, pred))
</code></pre>
<h3>Overfitting (học vẹt)</h3>
<p>Mô hình giỏi trên dữ liệu huấn luyện nhưng kém trên dữ liệu kiểm tra là bị <strong>overfit</strong> — nó thuộc lòng nhiễu. Mô hình đơn giản hơn và nhiều dữ liệu hơn sẽ giúp ích.</p>
<h3>Đạo đức</h3>
<p><strong>Thiên lệch (bias)</strong> — mô hình học từ dữ liệu lệch có thể bất công với một số nhóm. <strong>Quyền riêng tư</strong> — xử lý dữ liệu cá nhân hợp pháp và tối thiểu. Luôn hỏi ai có thể bị tổn hại.</p>
<div class="callout"><span class="badge">Điều đọng lại</span> Mô hình chỉ công bằng và hữu ích ngang với dữ liệu và metric đứng sau nó — hãy đánh giá trung thực, và nghĩ tới con người bị ảnh hưởng.</div>`,
  ]]);

const c8q = quiz('dsi201-quiz-8', 'Quiz 8 — Evaluation & ethics|||Quiz 8 — Đánh giá & đạo đức', [
  { id: 'q1', question: 'Vì sao "accuracy" có thể đánh lừa?', options: ['Nó luôn bằng 0', 'Trên dữ liệu mất cân bằng, đoán hết theo nhóm đông vẫn cao', 'Nó chỉ dùng cho hồi quy', 'Nó cần p-value'], correctIndex: 1, explanation: 'Với lớp hiếm, mô hình đoán toàn lớp đa số vẫn cho accuracy cao mà vô dụng — cần precision/recall.' },
  { id: 'q2', question: 'Mô hình giỏi trên train nhưng kém trên test bị gọi là?', options: ['Underfitting', 'Overfitting (học vẹt)', 'Clustering', 'Vector hoá'], correctIndex: 1, explanation: 'Overfitting: mô hình thuộc lòng nhiễu, không tổng quát hoá được.' },
  { id: 'q3', question: 'Rủi ro đạo đức nào là THẬT trong Data Science?', options: ['Dữ liệu lệch gây mô hình thiên lệch, bất công với một số nhóm', 'Code chạy nhanh quá', 'Dùng pandas thay vòng lặp', 'Vẽ biểu đồ nhiều màu'], correctIndex: 0, explanation: 'Bias trong dữ liệu và vi phạm quyền riêng tư là rủi ro đạo đức cốt lõi cần lường trước.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'DSI201',
    slug: 'dsi201-data-science',
    title: 'Data Science',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DSI201.webp',
    shortDescription: 'Data Science with Python — the DS process (CRISP-DM), numpy & pandas, data cleaning, EDA, visualization, statistics, intro machine learning with scikit-learn, model evaluation & ethics. Bilingual, with Python code & quizzes.|||Khoa học dữ liệu bằng Python — quy trình DS (CRISP-DM), numpy & pandas, làm sạch dữ liệu, EDA, trực quan hoá, thống kê, nhập môn ML với scikit-learn, đánh giá mô hình & đạo đức. Song ngữ, có code Python & quiz.',
    description: 'Môn <strong>DSI201 — Data Science</strong> (kỳ 3, ngành Khoa học Máy tính) dạy <strong>khoa học dữ liệu từ đầu tới cuối bằng Python</strong>. Từ <strong>quy trình DS</strong> (CRISP-DM) → <strong>Python cho DS</strong> (numpy &amp; pandas, đọc/ghi dữ liệu) → <strong>thu thập &amp; làm sạch</strong> (missing, outlier) → <strong>phân tích khám phá (EDA)</strong> (describe, groupby, tương quan) → <strong>trực quan hoá</strong> (matplotlib/seaborn) → <strong>thống kê</strong> (phân phối, kiểm định, hồi quy) → <strong>học máy nhập môn</strong> (scikit-learn) → <strong>đánh giá mô hình &amp; đạo đức</strong>. Song ngữ, có khối code Python và quiz mỗi chương.',
    whatYouLearn: 'Quy trình DS/CRISP-DM; numpy (mảng, vector hoá) & pandas (DataFrame, đọc/ghi CSV); làm sạch dữ liệu (missing, impute, outlier IQR); EDA (describe, groupby, correlation); trực quan hoá (histogram/bar/scatter/box, storytelling); thống kê (phân phối chuẩn, p-value & t-test, hồi quy tuyến tính); học máy (supervised/unsupervised, train/test, hồi quy/phân loại/clustering với scikit-learn); đánh giá (accuracy/precision/recall, RMSE, overfitting) & đạo đức (bias, quyền riêng tư).',
    requirements: 'Biết lập trình Python cơ bản (biến, vòng lặp, hàm) và toán phổ thông. Nên dùng Jupyter Notebook hoặc Google Colab (không cần cài đặt).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, tài liệu chính thức, Kaggle Learn, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Khoa học dữ liệu là gì, chuỗi giá trị dữ liệu, vì sao Python.', lessons: [intro] },
    { title: 'Chương 1 — Data Science là gì|||Chapter 1 — What is Data Science', description: 'Quy trình DS/CRISP-DM, vai trò, DS vs analytics vs ML.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Python cho DS|||Chapter 2 — Python for DS', description: 'numpy array, pandas DataFrame, đọc/ghi dữ liệu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thu thập & làm sạch|||Chapter 3 — Collecting & cleaning', description: 'Missing, outlier, transformation.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phân tích khám phá (EDA)|||Chapter 4 — EDA', description: 'Thống kê mô tả, groupby, tương quan.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Trực quan hoá|||Chapter 5 — Visualization', description: 'matplotlib/seaborn, chọn biểu đồ, storytelling.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thống kê cho DS|||Chapter 6 — Statistics', description: 'Phân phối, kiểm định giả thuyết, hồi quy tổng quan.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Học máy nhập môn|||Chapter 7 — Intro to ML', description: 'Supervised/unsupervised, train/test, scikit-learn.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đánh giá & đạo đức|||Chapter 8 — Evaluation & ethics', description: 'Metrics, overfitting, bias, quyền riêng tư.', lessons: [c8, c8q] },
  ],
};
