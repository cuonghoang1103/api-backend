/**
 * AIL303m — Machine Learning (Học máy). Ngành AI của FPTU.
 * Khung chất lượng bám giáo trình FLM (sylID 10736): nguồn CHÍNH = IBM
 * "Introduction to Machine Learning" Specialization (Coursera); công cụ
 * JupyterLab/jupyterlite; Python + scikit-learn. 10 CLO, 4 module + mini
 * capstone. Song ngữ, có công thức + code scikit-learn minh hoạ + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

/* ─────────────────────────── Tài liệu tham khảo ─────────────────────────── */
const taiLieu = doc('ail303m-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: nguồn chính IBM ML (Coursera), scikit-learn, Hands-On ML (Géron), Kaggle Learn; công cụ JupyterLab/Colab/pandas/numpy/scikit-learn; lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">AIL303m · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Machine Learning</strong> — from data (EDA, feature engineering) through supervised regression &amp; classification to unsupervised learning and an end-to-end mini capstone — in one place. The official FPTU slides live on <strong>FLM</strong>; below are the free, legal resources this course is built on.</p>
<h3>📘 Primary source</h3>
<ul>
<li><a href="https://www.coursera.org/specializations/ibm-intro-machine-learning" target="_blank" rel="noopener">IBM — <em>Introduction to Machine Learning</em> Specialization (Coursera)</a> — the main reference; audit for free.</li>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — official FPTU giáo trình &amp; lecture slides; sign in with your FPTU account.</li>
</ul>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://github.com/ageron/handson-ml3" target="_blank" rel="noopener"><em>Hands-On Machine Learning</em> — Aurélien Géron (notebooks on GitHub)</a></li>
<li><a href="https://www.statlearning.com/" target="_blank" rel="noopener"><em>An Introduction to Statistical Learning</em> (ISLP) — free PDF</a></li>
</ul>
<h3>🌐 Official documentation</h3>
<ul>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn — User Guide &amp; API</a></li>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">pandas documentation</a> &amp; <a href="https://numpy.org/doc/stable/" target="_blank" rel="noopener">NumPy documentation</a></li>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn — free hands-on micro-courses</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://jupyter.org/try-jupyter/lab/" target="_blank" rel="noopener">JupyterLab / JupyterLite</a> — run notebooks in the browser (course tool)</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — free notebooks with GPU</li>
<li><a href="https://scikit-learn.org/" target="_blank" rel="noopener">scikit-learn</a> · <a href="https://pandas.pydata.org/" target="_blank" rel="noopener">pandas</a> · <a href="https://numpy.org/" target="_blank" rel="noopener">NumPy</a> · <a href="https://matplotlib.org/" target="_blank" rel="noopener">Matplotlib</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — Python + pandas/numpy; the ML workflow; loading &amp; cleaning data; EDA.</li>
<li><strong>Supervised learning</strong> — train/test split &amp; cross-validation; linear &amp; polynomial regression, regularization; classification (logistic, KNN, SVM, trees, ensembles) with the right metrics.</li>
<li><strong>Unsupervised learning</strong> — K-Means &amp; other clustering; dimensionality reduction (PCA).</li>
<li><strong>Capstone</strong> — run a full project end-to-end on a real dataset and write it up.</li>
</ol></div>`,
    `<span class="eyebrow">AIL303m · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Học máy</strong> — từ dữ liệu (EDA, feature engineering) qua học có giám sát (hồi quy &amp; phân loại) đến học không giám sát và một mini capstone đầu-cuối — gom về một chỗ. Slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp mà môn này dựa trên.</p>
<h3>📘 Nguồn chính</h3>
<ul>
<li><a href="https://www.coursera.org/specializations/ibm-intro-machine-learning" target="_blank" rel="noopener">IBM — <em>Introduction to Machine Learning</em> Specialization (Coursera)</a> — nguồn tham khảo chính; học miễn phí ở chế độ audit.</li>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — giáo trình &amp; slide bài giảng chính thức của FPTU; đăng nhập bằng tài khoản FPTU.</li>
</ul>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://github.com/ageron/handson-ml3" target="_blank" rel="noopener"><em>Hands-On Machine Learning</em> — Aurélien Géron (notebook trên GitHub)</a></li>
<li><a href="https://www.statlearning.com/" target="_blank" rel="noopener"><em>An Introduction to Statistical Learning</em> (ISLP) — PDF miễn phí</a></li>
</ul>
<h3>🌐 Tài liệu chính thức</h3>
<ul>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn — User Guide &amp; API</a></li>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">Tài liệu pandas</a> &amp; <a href="https://numpy.org/doc/stable/" target="_blank" rel="noopener">Tài liệu NumPy</a></li>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn — micro-course thực hành miễn phí</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://jupyter.org/try-jupyter/lab/" target="_blank" rel="noopener">JupyterLab / JupyterLite</a> — chạy notebook ngay trên trình duyệt (công cụ của môn)</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — notebook miễn phí, có GPU</li>
<li><a href="https://scikit-learn.org/" target="_blank" rel="noopener">scikit-learn</a> · <a href="https://pandas.pydata.org/" target="_blank" rel="noopener">pandas</a> · <a href="https://numpy.org/" target="_blank" rel="noopener">NumPy</a> · <a href="https://matplotlib.org/" target="_blank" rel="noopener">Matplotlib</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — Python + pandas/numpy; quy trình ML; nạp &amp; làm sạch dữ liệu; EDA.</li>
<li><strong>Học có giám sát</strong> — train/test split &amp; cross-validation; hồi quy tuyến tính &amp; đa thức, regularization; phân loại (logistic, KNN, SVM, cây, ensemble) với đúng độ đo.</li>
<li><strong>Học không giám sát</strong> — K-Means &amp; các thuật toán gom cụm; giảm chiều (PCA).</li>
<li><strong>Capstone</strong> — chạy một dự án đầu-cuối trên dữ liệu thật và viết báo cáo.</li>
</ol></div>`,
  ]]);

/* ─────────────────────────── Giới thiệu môn học ─────────────────────────── */
const intro = doc('ail303m-0-1-overview', 'Course overview: what is Machine Learning?|||Tổng quan: Học máy là gì?',
  'ML là gì (học từ dữ liệu, không lập trình luật tay); 3 loại (giám sát / không giám sát / tăng cường); quy trình ML đầu-cuối; 10 CLO; cơ cấu điểm; tiên quyết MAS291/MAI391/PFP191.',
  [[
    `<span class="eyebrow">AIL303m · Lesson 0.1 · Overview</span>
<h2>What is Machine Learning?</h2>
<p class="lead"><strong>Machine Learning (ML)</strong> is the science of building programs that <strong>learn patterns from data</strong> instead of being told every rule by hand. Given examples, an ML model fits a function that generalizes to <em>new, unseen</em> data.</p>
<h3>Three kinds of learning</h3>
<ul>
<li><strong>Supervised</strong> — learn from labeled examples (input → known output). Two tasks: <strong>regression</strong> (predict a number) and <strong>classification</strong> (predict a category).</li>
<li><strong>Unsupervised</strong> — find structure in unlabeled data: <strong>clustering</strong> (group similar points) and <strong>dimensionality reduction</strong> (compress features).</li>
<li><strong>Reinforcement</strong> — an agent learns by trial and reward (out of scope here, mentioned for context).</li>
</ul>
<h3>The end-to-end ML workflow</h3>
<pre><code>Get data -> Clean / wrangle -> EDA + feature engineering
         -> Split (train / test) -> Train model -> Evaluate
         -> Tune (cross-validation) -> Deploy / report
</code></pre>
<p>This course walks that whole loop in Python with <strong>scikit-learn</strong>, run in <strong>JupyterLab</strong>.</p>
<h3>10 course learning outcomes (CLO)</h3>
<p>CLO1 acquire &amp; clean data · CLO2 EDA · CLO3 feature engineering &amp; inferential statistics · CLO4 apply supervised models · CLO5 regression · CLO6 classification &amp; metrics · CLO7 apply unsupervised models · CLO8 clustering · CLO9 dimensionality reduction · CLO10 run an end-to-end ML project.</p>
<h3>Grading</h3>
<pre><code>Lab 1            10%
Lab 2            10%
Mini Capstone    30%
Progress test    20%  (4 tests x 5%)
Final exam       30%  (50 multiple-choice)
</code></pre>
<div class="callout"><span class="badge">Prerequisites</span> MAS291 (probability &amp; statistics), MAI391 (linear algebra &amp; calculus) and PFP191 (Python programming). ML sits on top of statistics, linear algebra and coding.</div>`,
    `<span class="eyebrow">AIL303m · Bài 0.1 · Tổng quan</span>
<h2>Học máy là gì?</h2>
<p class="lead"><strong>Học máy (Machine Learning — ML)</strong> là ngành xây các chương trình <strong>học quy luật từ dữ liệu</strong> thay vì được lập trình từng luật bằng tay. Từ các ví dụ, một mô hình ML khớp một hàm số rồi <em>tổng quát hoá</em> cho dữ liệu mới chưa từng thấy.</p>
<h3>Ba loại học</h3>
<ul>
<li><strong>Có giám sát</strong> — học từ ví dụ có nhãn (đầu vào → đầu ra đã biết). Hai bài toán: <strong>hồi quy</strong> (dự đoán một con số) và <strong>phân loại</strong> (dự đoán một nhãn).</li>
<li><strong>Không giám sát</strong> — tìm cấu trúc trong dữ liệu không nhãn: <strong>gom cụm</strong> (nhóm điểm giống nhau) và <strong>giảm chiều</strong> (nén đặc trưng).</li>
<li><strong>Tăng cường</strong> — tác nhân học qua thử &amp; thưởng (ngoài phạm vi môn, nêu cho đủ ngữ cảnh).</li>
</ul>
<h3>Quy trình ML đầu-cuối</h3>
<pre><code>Lấy dữ liệu -> Làm sạch / wrangling -> EDA + feature engineering
            -> Chia (train / test) -> Huấn luyện -> Đánh giá
            -> Tinh chỉnh (cross-validation) -> Triển khai / báo cáo
</code></pre>
<p>Môn này đi hết vòng lặp đó bằng Python với <strong>scikit-learn</strong>, chạy trên <strong>JupyterLab</strong>.</p>
<h3>10 chuẩn đầu ra (CLO)</h3>
<p>CLO1 thu thập &amp; làm sạch dữ liệu · CLO2 EDA · CLO3 feature engineering &amp; thống kê suy diễn · CLO4 áp dụng mô hình có giám sát · CLO5 hồi quy · CLO6 phân loại &amp; độ đo · CLO7 áp dụng mô hình không giám sát · CLO8 gom cụm · CLO9 giảm chiều · CLO10 chạy một dự án ML đầu-cuối.</p>
<h3>Cơ cấu điểm</h3>
<pre><code>Lab 1            10%
Lab 2            10%
Mini Capstone    30%
Progress test    20%  (4 bài x 5%)
Thi cuối kỳ      30%  (50 câu trắc nghiệm)
</code></pre>
<div class="callout"><span class="badge">Tiên quyết</span> MAS291 (xác suất &amp; thống kê), MAI391 (đại số tuyến tính &amp; giải tích) và PFP191 (lập trình Python). ML đứng trên nền thống kê, đại số tuyến tính và code.</div>`,
  ]]);

/* ═══════════════ Module 1 — EDA cho Machine Learning (CLO1-3) ═══════════════ */
const m1a = doc('ail303m-1-1-data-to-eda', '1.1 — From raw data to EDA|||1.1 — Từ dữ liệu thô đến EDA',
  'Lịch sử & ứng dụng AI/ML; lấy dữ liệu (SQL/NoSQL/API/Cloud); làm sạch (thiếu, trùng, ngoại lai); phân tích khám phá (EDA) bằng pandas/matplotlib.',
  [[
    `<span class="eyebrow">AIL303m · Module 1 · Lesson 1.1</span>
<h2>From raw data to EDA</h2>
<h3>AI &amp; ML in context</h3>
<p>AI moved from rule-based expert systems to <strong>data-driven learning</strong>. Today ML powers recommendations, fraud detection, medical imaging, spam filtering and forecasting. In every case the model is only as good as the <strong>data</strong> — which is why the first module is all about data.</p>
<h3>Getting data</h3>
<ul>
<li><strong>SQL databases</strong> — structured tables (read with <code>pd.read_sql</code>).</li>
<li><strong>NoSQL</strong> — documents / key-value (e.g. MongoDB) for semi-structured data.</li>
<li><strong>APIs</strong> — pull JSON over HTTP (<code>requests</code>).</li>
<li><strong>Cloud &amp; files</strong> — CSV/Parquet on S3, data warehouses.</li>
</ul>
<h3>Cleaning (data wrangling)</h3>
<p>Real data is messy: <strong>missing values</strong> (drop or impute), <strong>duplicates</strong>, <strong>outliers</strong>, wrong types and inconsistent labels. Cleaning happens <em>before</em> any modeling.</p>
<h3>Exploratory Data Analysis (EDA)</h3>
<p>EDA = look before you model: distributions (histograms), relationships (scatter, correlation), and summary statistics. It reveals skew, outliers and which features matter.</p>
<pre><code class="language-python">import pandas as pd

df = pd.read_csv("housing.csv")
print(df.shape)                 # rows, columns
print(df.info())                # dtypes + non-null counts
print(df.describe())            # summary statistics

df = df.drop_duplicates()
df["total_bedrooms"] = df["total_bedrooms"].fillna(df["total_bedrooms"].median())
print(df.isna().sum())          # confirm no missing left

df.hist(bins=50, figsize=(12, 8))   # EDA: distributions
print(df.corr(numeric_only=True)["median_house_value"].sort_values())
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Teams spend most of an ML project on getting, cleaning and understanding data — not on the model. Good EDA is what makes the model choice obvious later.</div>`,
    `<span class="eyebrow">AIL303m · Module 1 · Bài 1.1</span>
<h2>Từ dữ liệu thô đến EDA</h2>
<h3>AI &amp; ML trong bối cảnh</h3>
<p>AI đã chuyển từ hệ chuyên gia dựa-luật sang <strong>học từ dữ liệu</strong>. Ngày nay ML chạy hệ gợi ý, phát hiện gian lận, ảnh y khoa, lọc spam và dự báo. Mọi trường hợp, mô hình chỉ tốt bằng <strong>dữ liệu</strong> — nên module đầu tiên nói hết về dữ liệu.</p>
<h3>Lấy dữ liệu</h3>
<ul>
<li><strong>CSDL SQL</strong> — bảng có cấu trúc (đọc bằng <code>pd.read_sql</code>).</li>
<li><strong>NoSQL</strong> — document / key-value (vd MongoDB) cho dữ liệu bán cấu trúc.</li>
<li><strong>API</strong> — kéo JSON qua HTTP (<code>requests</code>).</li>
<li><strong>Cloud &amp; file</strong> — CSV/Parquet trên S3, kho dữ liệu.</li>
</ul>
<h3>Làm sạch (data wrangling)</h3>
<p>Dữ liệu thật luôn lộn xộn: <strong>giá trị thiếu</strong> (bỏ hoặc điền — impute), <strong>bản trùng</strong>, <strong>ngoại lai (outlier)</strong>, sai kiểu và nhãn không nhất quán. Làm sạch xảy ra <em>trước</em> mọi việc mô hình hoá.</p>
<h3>Phân tích khám phá (EDA)</h3>
<p>EDA = nhìn trước khi mô hình hoá: phân phối (histogram), quan hệ (scatter, tương quan) và thống kê tóm tắt. Nó lộ ra độ lệch, outlier và đặc trưng nào quan trọng.</p>
<pre><code class="language-python">import pandas as pd

df = pd.read_csv("housing.csv")
print(df.shape)                 # số dòng, số cột
print(df.info())                # kiểu dữ liệu + số ô không rỗng
print(df.describe())            # thống kê tóm tắt

df = df.drop_duplicates()
df["total_bedrooms"] = df["total_bedrooms"].fillna(df["total_bedrooms"].median())
print(df.isna().sum())          # xác nhận không còn thiếu

df.hist(bins=50, figsize=(12, 8))   # EDA: phân phối
print(df.corr(numeric_only=True)["median_house_value"].sort_values())
</code></pre>
<div class="callout"><span class="badge">Kinh nghiệm</span> Đội ML tốn phần lớn thời gian dự án vào lấy, làm sạch và hiểu dữ liệu — không phải mô hình. EDA tốt khiến việc chọn mô hình sau này trở nên hiển nhiên.</div>`,
  ]]);

const m1b = doc('ail303m-1-2-features-and-stats', '1.2 — Feature engineering & inferential statistics|||1.2 — Feature engineering & thống kê suy diễn',
  'Biến đổi biến (scaling, log, one-hot, tạo đặc trưng); thống kê suy diễn: tổng thể vs mẫu, khoảng tin cậy; kiểm định giả thuyết (H0/H1, p-value).',
  [[
    `<span class="eyebrow">AIL303m · Module 1 · Lesson 1.2</span>
<h2>Feature engineering &amp; inferential statistics</h2>
<h3>Feature engineering</h3>
<p>Models learn from <strong>features</strong> — so shaping good features often beats a fancier algorithm.</p>
<ul>
<li><strong>Scaling</strong> — standardize (<code>z = (x − μ) / σ</code>) or min-max, so no feature dominates by unit.</li>
<li><strong>Transforms</strong> — log/box-cox to tame skew.</li>
<li><strong>Encoding</strong> — one-hot for categorical variables.</li>
<li><strong>Derived features</strong> — e.g. rooms_per_household = total_rooms / households.</li>
</ul>
<h3>Inferential statistics</h3>
<p>We rarely see the whole <strong>population</strong>, only a <strong>sample</strong>. Inferential statistics quantifies how confident we can be about the population from that sample — via <strong>confidence intervals</strong> and <strong>hypothesis tests</strong>.</p>
<h3>Hypothesis testing</h3>
<ul>
<li><strong>H0 (null)</strong> — "no effect / no difference".</li>
<li><strong>H1 (alternative)</strong> — the effect we suspect.</li>
<li><strong>p-value</strong> — probability of seeing data this extreme <em>if H0 were true</em>. If <code>p &lt; α</code> (usually 0.05) we reject H0.</li>
</ul>
<pre><code class="language-python">import numpy as np
from scipy import stats
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# scaling
X = np.array([[10.0], [20.0], [30.0]])
X_scaled = StandardScaler().fit_transform(X)   # mean 0, std 1

# two-sample t-test: do groups A and B differ?
a = [5.1, 4.9, 5.3, 5.0]
b = [6.1, 5.9, 6.2, 6.0]
t, p = stats.ttest_ind(a, b)
print("p-value =", round(p, 4))                # p < 0.05 -> reject H0
</code></pre>
<div class="callout"><span class="badge">Careful</span> A small p-value means "unlikely under H0", NOT "the effect is large or important". Always report effect size alongside significance.</div>`,
    `<span class="eyebrow">AIL303m · Module 1 · Bài 1.2</span>
<h2>Feature engineering &amp; thống kê suy diễn</h2>
<h3>Feature engineering</h3>
<p>Mô hình học từ <strong>đặc trưng (feature)</strong> — nên nặn đặc trưng tốt thường thắng một thuật toán "xịn" hơn.</p>
<ul>
<li><strong>Scaling</strong> — chuẩn hoá (<code>z = (x − μ) / σ</code>) hoặc min-max, để không đặc trưng nào lấn vì đơn vị.</li>
<li><strong>Biến đổi</strong> — log/box-cox để giảm lệch (skew).</li>
<li><strong>Mã hoá</strong> — one-hot cho biến phân loại.</li>
<li><strong>Đặc trưng dẫn xuất</strong> — vd rooms_per_household = total_rooms / households.</li>
</ul>
<h3>Thống kê suy diễn</h3>
<p>Ta hiếm khi thấy cả <strong>tổng thể (population)</strong>, chỉ thấy một <strong>mẫu (sample)</strong>. Thống kê suy diễn định lượng độ tin cậy khi kết luận về tổng thể từ mẫu đó — qua <strong>khoảng tin cậy</strong> và <strong>kiểm định giả thuyết</strong>.</p>
<h3>Kiểm định giả thuyết</h3>
<ul>
<li><strong>H0 (giả thuyết gốc)</strong> — "không có hiệu ứng / không khác biệt".</li>
<li><strong>H1 (đối thuyết)</strong> — hiệu ứng ta nghi ngờ.</li>
<li><strong>p-value</strong> — xác suất thấy dữ liệu cực đoan tới vậy <em>nếu H0 đúng</em>. Nếu <code>p &lt; α</code> (thường 0.05) thì bác bỏ H0.</li>
</ul>
<pre><code class="language-python">import numpy as np
from scipy import stats
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# scaling
X = np.array([[10.0], [20.0], [30.0]])
X_scaled = StandardScaler().fit_transform(X)   # trung bình 0, độ lệch chuẩn 1

# t-test hai mẫu: nhóm A và B có khác nhau không?
a = [5.1, 4.9, 5.3, 5.0]
b = [6.1, 5.9, 6.2, 6.0]
t, p = stats.ttest_ind(a, b)
print("p-value =", round(p, 4))                # p < 0.05 -> bác bỏ H0
</code></pre>
<div class="callout"><span class="badge">Cẩn thận</span> p-value nhỏ nghĩa "khó xảy ra dưới H0", KHÔNG phải "hiệu ứng lớn hay quan trọng". Luôn báo cả độ lớn hiệu ứng bên cạnh mức ý nghĩa.</div>`,
  ]]);

const m1q = quiz('ail303m-quiz-1', 'Quiz 1 — EDA & data|||Quiz 1 — EDA & dữ liệu', [
  { id: 'q1', question: 'EDA (Exploratory Data Analysis) dùng để?', options: ['Huấn luyện mô hình cuối', 'Nhìn & hiểu dữ liệu trước khi mô hình hoá (phân phối, tương quan, outlier)', 'Triển khai lên production', 'Chấm điểm phân loại'], correctIndex: 1, explanation: 'EDA khám phá phân phối/quan hệ/thống kê tóm tắt trước khi mô hình hoá.' },
  { id: 'q2', question: 'StandardScaler biến đổi đặc trưng thành?', options: ['Khoảng [0,1]', 'Trung bình 0, độ lệch chuẩn 1 (z = (x−μ)/σ)', 'One-hot', 'Log'], correctIndex: 1, explanation: 'Chuẩn hoá z-score: trung bình 0, độ lệch chuẩn 1.' },
  { id: 'q3', question: 'Trong kiểm định giả thuyết, p < 0.05 thường dẫn đến?', options: ['Chấp nhận H0', 'Bác bỏ H0 (giả thuyết gốc)', 'Bỏ dữ liệu', 'Tăng số đặc trưng'], correctIndex: 1, explanation: 'p nhỏ hơn mức ý nghĩa α → bác bỏ H0.' },
]);

/* ══════════ Module 2 — Học có giám sát: Hồi quy (CLO4-5) ══════════ */
const m2a = doc('ail303m-2-1-regression', '2.1 — Supervised learning & linear regression|||2.1 — Học có giám sát & hồi quy tuyến tính',
  'Supervised learning; train/test split & cross-validation; hồi quy tuyến tính (đường thẳng khớp bình phương nhỏ nhất, MSE/R²); hồi quy đa thức.',
  [[
    `<span class="eyebrow">AIL303m · Module 2 · Lesson 2.1</span>
<h2>Supervised learning &amp; linear regression</h2>
<h3>The supervised setup</h3>
<p>Given features <code>X</code> and known targets <code>y</code>, learn a function <code>f</code> so <code>f(X) ≈ y</code>, and — crucially — that generalizes to new data. When <code>y</code> is a <strong>number</strong>, the task is <strong>regression</strong>.</p>
<h3>Train / test split &amp; cross-validation</h3>
<p>Never judge a model on the data it trained on. <strong>Hold out</strong> a test set; for reliable estimates use <strong>k-fold cross-validation</strong> (train on k−1 folds, validate on the last, rotate).</p>
<h3>Linear regression</h3>
<p>Fit a line <code>ŷ = w·x + b</code> that minimizes <strong>mean squared error</strong> <code>MSE = (1/n) Σ (yᵢ − ŷᵢ)²</code>. Quality is often read via <strong>R²</strong> (1 = perfect, 0 = no better than the mean).</p>
<h3>Polynomial regression</h3>
<p>When the relationship curves, add polynomial features (x², x³ …) and fit a linear model on them — same maths, richer shape. Too high a degree <strong>overfits</strong>.</p>
<pre><code class="language-python">from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression().fit(X_tr, y_tr)
pred = model.predict(X_te)
print("MSE =", mean_squared_error(y_te, pred))
print("R2  =", r2_score(y_te, pred))

# 5-fold cross-validation
scores = cross_val_score(model, X, y, cv=5, scoring="r2")
print("CV R2 =", scores.mean())
</code></pre>
<div class="callout"><span class="badge">Bias–variance</span> Too simple a model underfits (high bias); too complex overfits (high variance). Cross-validation is how you find the sweet spot.</div>`,
    `<span class="eyebrow">AIL303m · Module 2 · Bài 2.1</span>
<h2>Học có giám sát &amp; hồi quy tuyến tính</h2>
<h3>Bối cảnh có giám sát</h3>
<p>Cho đặc trưng <code>X</code> và mục tiêu đã biết <code>y</code>, học một hàm <code>f</code> sao cho <code>f(X) ≈ y</code>, và — quan trọng nhất — tổng quát hoá cho dữ liệu mới. Khi <code>y</code> là một <strong>con số</strong>, bài toán là <strong>hồi quy</strong>.</p>
<h3>Train/test split &amp; cross-validation</h3>
<p>Đừng bao giờ chấm mô hình trên chính dữ liệu nó học. <strong>Giữ riêng</strong> một tập test; để ước lượng đáng tin, dùng <strong>k-fold cross-validation</strong> (học trên k−1 phần, kiểm trên phần còn lại, xoay vòng).</p>
<h3>Hồi quy tuyến tính</h3>
<p>Khớp một đường <code>ŷ = w·x + b</code> tối thiểu hoá <strong>sai số bình phương trung bình</strong> <code>MSE = (1/n) Σ (yᵢ − ŷᵢ)²</code>. Chất lượng thường đọc qua <strong>R²</strong> (1 = hoàn hảo, 0 = không hơn giá trị trung bình).</p>
<h3>Hồi quy đa thức</h3>
<p>Khi quan hệ cong, thêm đặc trưng đa thức (x², x³ …) rồi khớp mô hình tuyến tính trên chúng — cùng công thức, hình dạng phong phú hơn. Bậc quá cao thì <strong>overfit</strong>.</p>
<pre><code class="language-python">from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression().fit(X_tr, y_tr)
pred = model.predict(X_te)
print("MSE =", mean_squared_error(y_te, pred))
print("R2  =", r2_score(y_te, pred))

# cross-validation 5 phần
scores = cross_val_score(model, X, y, cv=5, scoring="r2")
print("CV R2 =", scores.mean())
</code></pre>
<div class="callout"><span class="badge">Bias–variance</span> Mô hình quá đơn giản thì underfit (bias cao); quá phức tạp thì overfit (variance cao). Cross-validation là cách tìm điểm cân bằng.</div>`,
  ]]);

const m2b = doc('ail303m-2-2-regularization', '2.2 — Regularization: Ridge, Lasso, Elastic Net|||2.2 — Regularization: Ridge, Lasso, Elastic Net',
  'Chống overfit bằng phạt độ lớn hệ số: Ridge (L2), Lasso (L1, chọn đặc trưng), Elastic Net (kết hợp); vai trò của tham số λ (alpha).',
  [[
    `<span class="eyebrow">AIL303m · Module 2 · Lesson 2.2</span>
<h2>Regularization</h2>
<p class="lead"><strong>Regularization</strong> fights overfitting by penalizing large coefficients — the model must justify every bit of complexity. It adds a penalty term to the loss.</p>
<ul>
<li><strong>Ridge (L2)</strong> — penalty <code>λ Σ wⱼ²</code>. Shrinks coefficients smoothly toward (but not to) zero. Great when many features are correlated.</li>
<li><strong>Lasso (L1)</strong> — penalty <code>λ Σ |wⱼ|</code>. Drives some coefficients <em>exactly to zero</em> → automatic <strong>feature selection</strong>.</li>
<li><strong>Elastic Net</strong> — mixes L1 + L2, getting Lasso's sparsity and Ridge's stability.</li>
</ul>
<p>The strength <code>λ</code> (called <code>alpha</code> in scikit-learn) is a <strong>hyperparameter</strong>: larger = simpler model. Tune it with cross-validation.</p>
<pre><code class="language-python">from sklearn.linear_model import Ridge, Lasso, ElasticNet
from sklearn.model_selection import cross_val_score

for name, m in [("ridge", Ridge(alpha=1.0)),
                ("lasso", Lasso(alpha=0.1)),
                ("elastic", ElasticNet(alpha=0.1, l1_ratio=0.5))]:
    score = cross_val_score(m, X, y, cv=5, scoring="r2").mean()
    print(name, "CV R2 =", round(score, 3))

lasso = Lasso(alpha=0.1).fit(X, y)
print("features kept:", (lasso.coef_ != 0).sum())   # Lasso zeroes some out
</code></pre>
<div class="callout"><span class="badge">Scale first</span> Regularization penalizes coefficient size, so features MUST be scaled first — otherwise a feature's unit, not its usefulness, decides the penalty.</div>`,
    `<span class="eyebrow">AIL303m · Module 2 · Bài 2.2</span>
<h2>Regularization (điều chuẩn)</h2>
<p class="lead"><strong>Regularization</strong> chống overfit bằng cách phạt hệ số lớn — mô hình phải "biện minh" cho mỗi phần phức tạp. Nó thêm một số hạng phạt vào hàm mất mát.</p>
<ul>
<li><strong>Ridge (L2)</strong> — phạt <code>λ Σ wⱼ²</code>. Co hệ số mượt về gần (nhưng không tới) 0. Tốt khi nhiều đặc trưng tương quan.</li>
<li><strong>Lasso (L1)</strong> — phạt <code>λ Σ |wⱼ|</code>. Đẩy một số hệ số <em>về đúng 0</em> → tự động <strong>chọn đặc trưng</strong>.</li>
<li><strong>Elastic Net</strong> — trộn L1 + L2, có độ thưa của Lasso và độ ổn định của Ridge.</li>
</ul>
<p>Cường độ <code>λ</code> (gọi là <code>alpha</code> trong scikit-learn) là một <strong>siêu tham số</strong>: càng lớn = mô hình càng đơn giản. Tinh chỉnh bằng cross-validation.</p>
<pre><code class="language-python">from sklearn.linear_model import Ridge, Lasso, ElasticNet
from sklearn.model_selection import cross_val_score

for name, m in [("ridge", Ridge(alpha=1.0)),
                ("lasso", Lasso(alpha=0.1)),
                ("elastic", ElasticNet(alpha=0.1, l1_ratio=0.5))]:
    score = cross_val_score(m, X, y, cv=5, scoring="r2").mean()
    print(name, "CV R2 =", round(score, 3))

lasso = Lasso(alpha=0.1).fit(X, y)
print("so dac trung giu lai:", (lasso.coef_ != 0).sum())   # Lasso đưa vài hệ số về 0
</code></pre>
<div class="callout"><span class="badge">Scale trước</span> Regularization phạt độ lớn hệ số, nên đặc trưng PHẢI được scale trước — nếu không thì đơn vị của đặc trưng, chứ không phải độ hữu ích, quyết định mức phạt.</div>`,
  ]]);

const m2q = quiz('ail303m-quiz-2', 'Quiz 2 — Regression|||Quiz 2 — Hồi quy', [
  { id: 'q1', question: 'Hồi quy tuyến tính tối thiểu hoá đại lượng nào?', options: ['Accuracy', 'MSE — sai số bình phương trung bình', 'Số cụm', 'Entropy'], correctIndex: 1, explanation: 'Linear regression khớp đường tối thiểu MSE = (1/n)Σ(y−ŷ)².' },
  { id: 'q2', question: 'Regularization nào đẩy một số hệ số về ĐÚNG 0 (chọn đặc trưng)?', options: ['Ridge (L2)', 'Lasso (L1)', 'Không cái nào', 'Polynomial'], correctIndex: 1, explanation: 'L1 (Lasso) tạo nghiệm thưa → chọn đặc trưng tự động.' },
  { id: 'q3', question: 'Tại sao dùng cross-validation thay vì chấm trên tập train?', options: ['Nhanh hơn', 'Để ước lượng khả năng tổng quát hoá, tránh overfit', 'Để tăng số đặc trưng', 'Để bỏ outlier'], correctIndex: 1, explanation: 'CV ước lượng hiệu năng trên dữ liệu chưa thấy, lộ overfit.' },
]);

/* ══════════ Module 3 — Học có giám sát: Phân loại (CLO4-6) ══════════ */
const m3a = doc('ail303m-3-1-classification', '3.1 — Classification & metrics|||3.1 — Phân loại & độ đo',
  'Logistic regression; độ đo phân loại (accuracy/precision/recall/F1, ma trận nhầm lẫn, ROC-AUC); KNN; SVM & kernel; decision tree.',
  [[
    `<span class="eyebrow">AIL303m · Module 3 · Lesson 3.1</span>
<h2>Classification &amp; metrics</h2>
<h3>When y is a category</h3>
<p>Classification predicts a <strong>label</strong> (spam/not, disease/healthy). <strong>Logistic regression</strong> outputs a probability via the sigmoid <code>σ(z) = 1 / (1 + e^(−z))</code>, then thresholds it.</p>
<h3>Metrics — accuracy is not enough</h3>
<ul>
<li><strong>Accuracy</strong> — fraction correct. Misleading on imbalanced data.</li>
<li><strong>Precision</strong> = TP / (TP + FP) — of predicted positives, how many are right.</li>
<li><strong>Recall</strong> = TP / (TP + FN) — of real positives, how many we caught.</li>
<li><strong>F1</strong> — harmonic mean of precision &amp; recall.</li>
<li><strong>ROC-AUC</strong> — ranking quality across all thresholds.</li>
</ul>
<h3>More classifiers</h3>
<ul>
<li><strong>KNN</strong> — label by majority vote of the k nearest points.</li>
<li><strong>SVM</strong> — find the maximum-margin boundary; <strong>kernels</strong> (RBF, poly) handle non-linear data.</li>
<li><strong>Decision tree</strong> — split features by questions; readable but prone to overfit.</li>
</ul>
<pre><code class="language-python">from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

clf = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)
pred = clf.predict(X_te)
proba = clf.predict_proba(X_te)[:, 1]

print(confusion_matrix(y_te, pred))
print(classification_report(y_te, pred))      # precision / recall / F1
print("ROC-AUC =", roc_auc_score(y_te, proba))
</code></pre>
<div class="callout"><span class="badge">Pick the metric first</span> On a rare-disease test, recall (don't miss sick patients) usually matters more than raw accuracy. Choose the metric BEFORE training.</div>`,
    `<span class="eyebrow">AIL303m · Module 3 · Bài 3.1</span>
<h2>Phân loại &amp; độ đo</h2>
<h3>Khi y là một nhãn</h3>
<p>Phân loại dự đoán một <strong>nhãn</strong> (spam/không, bệnh/khoẻ). <strong>Logistic regression</strong> trả xác suất qua hàm sigmoid <code>σ(z) = 1 / (1 + e^(−z))</code>, rồi đặt ngưỡng.</p>
<h3>Độ đo — accuracy là chưa đủ</h3>
<ul>
<li><strong>Accuracy</strong> — tỉ lệ đúng. Dễ đánh lừa khi dữ liệu mất cân bằng.</li>
<li><strong>Precision</strong> = TP / (TP + FP) — trong các dự đoán dương, bao nhiêu đúng.</li>
<li><strong>Recall</strong> = TP / (TP + FN) — trong các ca dương thật, bắt được bao nhiêu.</li>
<li><strong>F1</strong> — trung bình điều hoà của precision &amp; recall.</li>
<li><strong>ROC-AUC</strong> — chất lượng xếp hạng trên mọi ngưỡng.</li>
</ul>
<h3>Thêm bộ phân loại</h3>
<ul>
<li><strong>KNN</strong> — gán nhãn theo đa số của k điểm gần nhất.</li>
<li><strong>SVM</strong> — tìm biên có lề lớn nhất; <strong>kernel</strong> (RBF, poly) xử lý dữ liệu phi tuyến.</li>
<li><strong>Cây quyết định</strong> — chia đặc trưng bằng câu hỏi; dễ đọc nhưng dễ overfit.</li>
</ul>
<pre><code class="language-python">from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

clf = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)
pred = clf.predict(X_te)
proba = clf.predict_proba(X_te)[:, 1]

print(confusion_matrix(y_te, pred))
print(classification_report(y_te, pred))      # precision / recall / F1
print("ROC-AUC =", roc_auc_score(y_te, proba))
</code></pre>
<div class="callout"><span class="badge">Chọn độ đo trước</span> Với xét nghiệm bệnh hiếm, recall (không bỏ sót người bệnh) thường quan trọng hơn accuracy thô. Chọn độ đo TRƯỚC khi huấn luyện.</div>`,
  ]]);

const m3b = doc('ail303m-3-2-ensembles-imbalance', '3.2 — Ensembles & imbalanced classes|||3.2 — Ensemble & lớp mất cân bằng',
  'Ensemble: bagging & random forest, boosting, stacking; vì sao "nhiều cây yếu" thắng một cây; xử lý lớp mất cân bằng (over/under-sampling, SMOTE, class_weight).',
  [[
    `<span class="eyebrow">AIL303m · Module 3 · Lesson 3.2</span>
<h2>Ensembles &amp; imbalanced classes</h2>
<h3>Ensembles — many weak learners beat one</h3>
<ul>
<li><strong>Bagging / Random Forest</strong> — train many trees on bootstrap samples &amp; random feature subsets, then average/vote. Cuts variance, robust.</li>
<li><strong>Boosting</strong> (AdaBoost, Gradient Boosting, XGBoost) — trees added in sequence, each fixing the previous one's errors. Often top accuracy.</li>
<li><strong>Stacking</strong> — a meta-model learns to combine several different base models.</li>
</ul>
<h3>Imbalanced classes</h3>
<p>If 99% of samples are "negative", a model that always predicts negative is 99% accurate and useless. Fixes:</p>
<ul>
<li><strong>Oversampling</strong> the minority (duplicate, or <strong>SMOTE</strong> to synthesize).</li>
<li><strong>Undersampling</strong> the majority.</li>
<li><strong>class_weight="balanced"</strong> — make the model pay more for minority errors.</li>
<li>And judge with precision/recall/F1, never accuracy alone.</li>
</ul>
<pre><code class="language-python">from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score

# class_weight handles imbalance without resampling
rf = RandomForestClassifier(n_estimators=300, class_weight="balanced",
                            random_state=42).fit(X_tr, y_tr)
pred = rf.predict(X_te)
print("F1 =", f1_score(y_te, pred))

# feature importance from the forest
for name, imp in sorted(zip(feature_names, rf.feature_importances_),
                        key=lambda t: -t[1])[:5]:
    print(name, round(imp, 3))
</code></pre>
<div class="callout"><span class="badge">Resample only the training set</span> Apply SMOTE / undersampling AFTER the train/test split, on the training fold only — otherwise synthetic points leak into the test set and inflate the score.</div>`,
    `<span class="eyebrow">AIL303m · Module 3 · Bài 3.2</span>
<h2>Ensemble &amp; lớp mất cân bằng</h2>
<h3>Ensemble — nhiều mô hình yếu thắng một</h3>
<ul>
<li><strong>Bagging / Random Forest</strong> — huấn luyện nhiều cây trên mẫu bootstrap &amp; tập đặc trưng ngẫu nhiên, rồi lấy trung bình/biểu quyết. Giảm variance, bền.</li>
<li><strong>Boosting</strong> (AdaBoost, Gradient Boosting, XGBoost) — cây thêm tuần tự, cây sau sửa lỗi cây trước. Thường cho accuracy hàng đầu.</li>
<li><strong>Stacking</strong> — một meta-model học cách kết hợp nhiều mô hình cơ sở khác nhau.</li>
</ul>
<h3>Lớp mất cân bằng</h3>
<p>Nếu 99% mẫu là "âm", một mô hình luôn đoán âm sẽ đúng 99% mà vô dụng. Cách chữa:</p>
<ul>
<li><strong>Oversampling</strong> lớp thiểu số (nhân bản, hoặc <strong>SMOTE</strong> để sinh mẫu).</li>
<li><strong>Undersampling</strong> lớp đa số.</li>
<li><strong>class_weight="balanced"</strong> — bắt mô hình trả giá nhiều hơn cho lỗi ở lớp thiểu số.</li>
<li>Và chấm bằng precision/recall/F1, đừng bao giờ chỉ accuracy.</li>
</ul>
<pre><code class="language-python">from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score

# class_weight xử lý mất cân bằng mà không cần resample
rf = RandomForestClassifier(n_estimators=300, class_weight="balanced",
                            random_state=42).fit(X_tr, y_tr)
pred = rf.predict(X_te)
print("F1 =", f1_score(y_te, pred))

# độ quan trọng đặc trưng từ rừng
for name, imp in sorted(zip(feature_names, rf.feature_importances_),
                        key=lambda t: -t[1])[:5]:
    print(name, round(imp, 3))
</code></pre>
<div class="callout"><span class="badge">Chỉ resample tập train</span> Áp SMOTE / undersampling SAU khi chia train/test, chỉ trên phần train — nếu không, điểm giả rò sang tập test và thổi phồng điểm số.</div>`,
  ]]);

const m3q = quiz('ail303m-quiz-3', 'Quiz 3 — Classification|||Quiz 3 — Phân loại', [
  { id: 'q1', question: 'Với dữ liệu MẤT CÂN BẰNG nặng, độ đo nào KHÔNG nên tin một mình?', options: ['Precision', 'Recall', 'Accuracy', 'F1'], correctIndex: 2, explanation: 'Accuracy cao giả tạo khi luôn đoán lớp đa số; dùng precision/recall/F1.' },
  { id: 'q2', question: 'Random Forest là dạng ensemble nào?', options: ['Boosting tuần tự', 'Bagging (nhiều cây trên mẫu bootstrap, biểu quyết)', 'Stacking', 'Một cây duy nhất'], correctIndex: 1, explanation: 'Random Forest = bagging cây quyết định + chọn ngẫu nhiên đặc trưng.' },
  { id: 'q3', question: 'Recall = TP/(TP+FN) trả lời câu hỏi?', options: ['Trong ca dương thật, bắt được bao nhiêu', 'Trong dự đoán dương, bao nhiêu đúng', 'Tổng thể đúng bao nhiêu', 'Số cụm tối ưu'], correctIndex: 0, explanation: 'Recall = tỉ lệ ca dương thật được mô hình phát hiện.' },
]);

/* ══════════ Module 4 — Học không giám sát (CLO7-9) ══════════ */
const m4a = doc('ail303m-4-1-clustering', '4.1 — Unsupervised learning & clustering|||4.1 — Học không giám sát & gom cụm',
  'Học không giám sát; K-Means (chọn k bằng elbow/silhouette); các thuật toán khác (hierarchical, DBSCAN, mean-shift) và khi nào dùng cái nào.',
  [[
    `<span class="eyebrow">AIL303m · Module 4 · Lesson 4.1</span>
<h2>Unsupervised learning &amp; clustering</h2>
<h3>No labels — find structure</h3>
<p>Unsupervised learning works on data with <strong>no target</strong>. <strong>Clustering</strong> groups similar samples: customer segments, image compression, anomaly grouping.</p>
<h3>K-Means</h3>
<p>Pick <code>k</code> clusters; repeat: assign each point to its nearest centroid, then move each centroid to its members' mean. It minimizes within-cluster variance (inertia).</p>
<p>Choosing <code>k</code>: the <strong>elbow method</strong> (inertia vs k) and the <strong>silhouette score</strong> (how well-separated clusters are).</p>
<h3>Other clustering algorithms</h3>
<ul>
<li><strong>Hierarchical</strong> — build a tree (dendrogram); no need to fix k up front.</li>
<li><strong>DBSCAN</strong> — density-based; finds arbitrary shapes and labels outliers as noise; you don't set k.</li>
<li><strong>Mean-shift</strong> — shifts points toward density peaks; discovers the number of clusters itself.</li>
</ul>
<pre><code class="language-python">from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

km = KMeans(n_clusters=3, n_init=10, random_state=42).fit(X_scaled)
labels = km.labels_
print("inertia =", km.inertia_)
print("silhouette =", silhouette_score(X_scaled, labels))

# elbow: inertia across candidate k
for k in range(2, 7):
    print(k, KMeans(n_clusters=k, n_init=10, random_state=42).fit(X_scaled).inertia_)
</code></pre>
<div class="callout"><span class="badge">Scale first, again</span> Clustering uses distances, so unscaled features let big-unit columns dominate. Standardize before K-Means.</div>`,
    `<span class="eyebrow">AIL303m · Module 4 · Bài 4.1</span>
<h2>Học không giám sát &amp; gom cụm</h2>
<h3>Không nhãn — tìm cấu trúc</h3>
<p>Học không giám sát làm việc với dữ liệu <strong>không có mục tiêu</strong>. <strong>Gom cụm</strong> nhóm các mẫu giống nhau: phân khúc khách hàng, nén ảnh, gộp bất thường.</p>
<h3>K-Means</h3>
<p>Chọn <code>k</code> cụm; lặp: gán mỗi điểm về tâm (centroid) gần nhất, rồi dời mỗi tâm về trung bình các thành viên. Nó tối thiểu phương sai trong cụm (inertia).</p>
<p>Chọn <code>k</code>: <strong>phương pháp khuỷu tay (elbow)</strong> (inertia theo k) và <strong>silhouette score</strong> (cụm tách nhau tốt tới đâu).</p>
<h3>Các thuật toán gom cụm khác</h3>
<ul>
<li><strong>Phân cấp (hierarchical)</strong> — dựng cây (dendrogram); không cần cố định k trước.</li>
<li><strong>DBSCAN</strong> — dựa mật độ; tìm cụm hình dạng tuỳ ý và gán outlier là nhiễu; không đặt k.</li>
<li><strong>Mean-shift</strong> — dịch điểm về đỉnh mật độ; tự tìm ra số cụm.</li>
</ul>
<pre><code class="language-python">from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

km = KMeans(n_clusters=3, n_init=10, random_state=42).fit(X_scaled)
labels = km.labels_
print("inertia =", km.inertia_)
print("silhouette =", silhouette_score(X_scaled, labels))

# elbow: inertia theo các k ứng viên
for k in range(2, 7):
    print(k, KMeans(n_clusters=k, n_init=10, random_state=42).fit(X_scaled).inertia_)
</code></pre>
<div class="callout"><span class="badge">Lại phải scale trước</span> Gom cụm dùng khoảng cách, nên đặc trưng chưa scale khiến cột đơn-vị-lớn lấn át. Chuẩn hoá trước K-Means.</div>`,
  ]]);

const m4b = doc('ail303m-4-2-dimensionality', '4.2 — Curse of dimensionality & PCA|||4.2 — Lời nguyền chiều & PCA',
  'Curse of dimensionality; giảm chiều bằng PCA (thành phần chính, phương sai giải thích); matrix factorization; khi nào giảm chiều.',
  [[
    `<span class="eyebrow">AIL303m · Module 4 · Lesson 4.2</span>
<h2>The curse of dimensionality &amp; PCA</h2>
<h3>Why too many features hurt</h3>
<p>As dimensions grow, points spread out, distances become meaningless, and models need exponentially more data — the <strong>curse of dimensionality</strong>. Fewer, better features means faster training, less overfitting, and plots you can actually see.</p>
<h3>PCA — Principal Component Analysis</h3>
<p>PCA finds new axes (<strong>principal components</strong>) — orthogonal directions of maximum variance — and keeps the top few. Each component is a linear combination of the original features; the first captures the most variance, and so on.</p>
<p>Read <strong>explained variance ratio</strong> to decide how many components to keep (e.g. enough for 95% of variance).</p>
<h3>Matrix factorization</h3>
<p>Related idea: factor a big matrix into smaller ones (SVD, NMF). Powering topic models and <strong>recommender systems</strong> (users × items → latent factors).</p>
<pre><code class="language-python">from sklearn.decomposition import PCA

pca = PCA(n_components=0.95)          # keep components for 95% variance
X_reduced = pca.fit_transform(X_scaled)
print("kept", pca.n_components_, "of", X_scaled.shape[1], "features")
print("explained variance:", pca.explained_variance_ratio_.round(3))

pca2 = PCA(n_components=2).fit_transform(X_scaled)   # for plotting
</code></pre>
<div class="callout"><span class="badge">Not always</span> PCA components are combinations of features, so you lose interpretability. Reduce dimensions to fight the curse or to visualize — not by reflex on every dataset.</div>`,
    `<span class="eyebrow">AIL303m · Module 4 · Bài 4.2</span>
<h2>Lời nguyền chiều &amp; PCA</h2>
<h3>Vì sao quá nhiều đặc trưng lại hại</h3>
<p>Chiều tăng thì điểm trải xa nhau, khoảng cách mất ý nghĩa, và mô hình cần dữ liệu nhiều theo cấp số mũ — <strong>lời nguyền chiều (curse of dimensionality)</strong>. Ít đặc trưng nhưng tốt hơn nghĩa là huấn luyện nhanh hơn, ít overfit hơn, và biểu đồ nhìn được.</p>
<h3>PCA — Phân tích thành phần chính</h3>
<p>PCA tìm các trục mới (<strong>thành phần chính</strong>) — hướng trực giao có phương sai lớn nhất — rồi giữ vài trục đầu. Mỗi thành phần là tổ hợp tuyến tính của đặc trưng gốc; thành phần đầu giữ nhiều phương sai nhất, rồi giảm dần.</p>
<p>Đọc <strong>tỉ lệ phương sai giải thích</strong> để quyết giữ bao nhiêu thành phần (vd đủ 95% phương sai).</p>
<h3>Matrix factorization</h3>
<p>Ý tưởng liên quan: phân rã một ma trận lớn thành các ma trận nhỏ (SVD, NMF). Nền của mô hình chủ đề và <strong>hệ gợi ý</strong> (người dùng × sản phẩm → nhân tố ẩn).</p>
<pre><code class="language-python">from sklearn.decomposition import PCA

pca = PCA(n_components=0.95)          # giữ đủ thành phần cho 95% phương sai
X_reduced = pca.fit_transform(X_scaled)
print("giu", pca.n_components_, "trong", X_scaled.shape[1], "dac trung")
print("phuong sai giai thich:", pca.explained_variance_ratio_.round(3))

pca2 = PCA(n_components=2).fit_transform(X_scaled)   # để vẽ biểu đồ
</code></pre>
<div class="callout"><span class="badge">Không phải lúc nào cũng dùng</span> Thành phần PCA là tổ hợp của đặc trưng, nên bạn mất khả năng diễn giải. Giảm chiều để chống lời nguyền hoặc để trực quan hoá — đừng làm theo phản xạ trên mọi bộ dữ liệu.</div>`,
  ]]);

const m4q = quiz('ail303m-quiz-4', 'Quiz 4 — Unsupervised|||Quiz 4 — Không giám sát', [
  { id: 'q1', question: 'K-Means cần cái gì được đặt trước?', options: ['Nhãn của từng điểm', 'Số cụm k', 'Ma trận nhầm lẫn', 'p-value'], correctIndex: 1, explanation: 'K-Means cần k; chọn bằng elbow/silhouette. DBSCAN thì không cần k.' },
  { id: 'q2', question: 'PCA dùng để?', options: ['Tăng số chiều', 'Giảm chiều bằng cách giữ hướng có phương sai lớn nhất', 'Gán nhãn', 'Cân bằng lớp'], correctIndex: 1, explanation: 'PCA chiếu dữ liệu lên các thành phần chính có phương sai lớn nhất.' },
  { id: 'q3', question: 'Thuật toán gom cụm nào dựa mật độ, tự gán outlier là nhiễu, không cần đặt k?', options: ['K-Means', 'DBSCAN', 'Hồi quy tuyến tính', 'PCA'], correctIndex: 1, explanation: 'DBSCAN gom cụm theo mật độ, tìm hình dạng tuỳ ý, đánh dấu nhiễu.' },
]);

/* ══════════ Module 5 — Mini Capstone (CLO10) ══════════ */
const m5a = doc('ail303m-5-1-capstone', '5.1 — Mini Capstone: end-to-end ML project|||5.1 — Mini Capstone: dự án ML đầu-cuối',
  'Quy trình dự án ML đầu-cuối: xác định bài toán → thu thập → wrangling → EDA → mô hình & tinh chỉnh → đánh giá → báo cáo; checklist & cạm bẫy rò rỉ dữ liệu.',
  [[
    `<span class="eyebrow">AIL303m · Module 5 · Lesson 5.1</span>
<h2>Mini Capstone: an end-to-end ML project</h2>
<p class="lead">The capstone ties everything together: take a real dataset from raw to a written, reproducible result.</p>
<h3>The pipeline</h3>
<pre><code>1. Frame the problem   -> regression or classification? which metric?
2. Get the data        -> load, understand its size &amp; columns
3. Wrangle             -> missing values, duplicates, types, outliers
4. EDA                 -> distributions, correlations, target relationship
5. Feature engineering -> scale, encode, derive features
6. Split               -> train / test (stratify for classification)
7. Model               -> baseline first, then stronger models
8. Tune                -> cross-validation + hyperparameter search
9. Evaluate            -> the chosen metric on the untouched test set
10. Report             -> findings, plots, limitations, next steps
</code></pre>
<h3>Do it inside a Pipeline</h3>
<p>Wrap preprocessing + model in one <code>Pipeline</code> so the exact same steps apply to train and test — and tune it all with <code>GridSearchCV</code>.</p>
<pre><code class="language-python">from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV

pipe = Pipeline([
    ("scale", StandardScaler()),
    ("clf", RandomForestClassifier(random_state=42)),
])
grid = GridSearchCV(pipe, {"clf__n_estimators": [100, 300],
                           "clf__max_depth": [None, 10]},
                    cv=5, scoring="f1")
grid.fit(X_tr, y_tr)
print("best params:", grid.best_params_)
print("test F1 =", grid.score(X_te, y_te))     # untouched test set
</code></pre>
<div class="callout"><span class="badge">Avoid data leakage</span> Fit scalers, imputers and encoders on the TRAIN fold only (a Pipeline does this for you). Fitting them on all data before splitting leaks test information and gives falsely high scores.</div>`,
    `<span class="eyebrow">AIL303m · Module 5 · Bài 5.1</span>
<h2>Mini Capstone: dự án ML đầu-cuối</h2>
<p class="lead">Capstone gắn mọi thứ lại: lấy một bộ dữ liệu thật, đi từ dữ liệu thô tới một kết quả có viết báo cáo, tái lập được.</p>
<h3>Đường ống (pipeline)</h3>
<pre><code>1. Xác định bài toán  -> hồi quy hay phân loại? độ đo nào?
2. Lấy dữ liệu        -> nạp, hiểu kích thước &amp; các cột
3. Wrangling          -> giá trị thiếu, trùng, kiểu, outlier
4. EDA                -> phân phối, tương quan, quan hệ với mục tiêu
5. Feature engineering-> scale, encode, tạo đặc trưng
6. Chia               -> train / test (stratify khi phân loại)
7. Mô hình            -> baseline trước, rồi mô hình mạnh hơn
8. Tinh chỉnh         -> cross-validation + tìm siêu tham số
9. Đánh giá           -> độ đo đã chọn trên tập test chưa đụng
10. Báo cáo           -> phát hiện, biểu đồ, hạn chế, bước tiếp
</code></pre>
<h3>Làm trong một Pipeline</h3>
<p>Bọc tiền xử lý + mô hình trong một <code>Pipeline</code> để đúng các bước đó áp cho cả train lẫn test — và tinh chỉnh tất cả bằng <code>GridSearchCV</code>.</p>
<pre><code class="language-python">from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV

pipe = Pipeline([
    ("scale", StandardScaler()),
    ("clf", RandomForestClassifier(random_state=42)),
])
grid = GridSearchCV(pipe, {"clf__n_estimators": [100, 300],
                           "clf__max_depth": [None, 10]},
                    cv=5, scoring="f1")
grid.fit(X_tr, y_tr)
print("tham so tot nhat:", grid.best_params_)
print("test F1 =", grid.score(X_te, y_te))     # tập test chưa đụng
</code></pre>
<div class="callout"><span class="badge">Tránh rò rỉ dữ liệu</span> Fit scaler, imputer và encoder CHỈ trên phần train (Pipeline lo giúp bạn). Fit chúng trên toàn dữ liệu trước khi chia sẽ rò thông tin test và cho điểm cao giả tạo.</div>`,
  ]]);

const m5q = quiz('ail303m-quiz-5', 'Quiz 5 — Capstone|||Quiz 5 — Capstone', [
  { id: 'q1', question: 'Bước ĐẦU TIÊN đúng của một dự án ML đầu-cuối là?', options: ['Chọn Random Forest', 'Xác định bài toán & độ đo (regression/classification?)', 'Vẽ ROC', 'Triển khai'], correctIndex: 1, explanation: 'Frame the problem trước: kiểu bài toán và độ đo quyết định mọi bước sau.' },
  { id: 'q2', question: 'Vì sao bọc tiền xử lý + mô hình trong một Pipeline?', options: ['Chạy nhanh hơn', 'Đảm bảo đúng các bước áp cho train & test, tránh rò rỉ dữ liệu', 'Bỏ cross-validation', 'Tăng số đặc trưng'], correctIndex: 1, explanation: 'Pipeline fit tiền xử lý chỉ trên train, chống data leakage.' },
  { id: 'q3', question: 'Điểm cuối cùng của mô hình nên đo trên?', options: ['Tập train', 'Tập test chưa đụng tới trong lúc tinh chỉnh', 'Toàn bộ dữ liệu', 'Tập validation đã dùng chọn tham số'], correctIndex: 1, explanation: 'Chấm trên test set giữ riêng để ước lượng khả năng tổng quát hoá thật.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'AIL303m',
    slug: 'ail303m-machine-learning',
    title: 'Machine Learning',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/AIL303m.webp',
    shortDescription: 'Machine Learning in Python (scikit-learn): data & EDA, feature engineering, supervised regression (Ridge/Lasso) & classification (logistic, KNN, SVM, ensembles, metrics), unsupervised learning (K-Means, PCA), and an end-to-end mini capstone. Bilingual.|||Học máy bằng Python (scikit-learn): dữ liệu & EDA, feature engineering, hồi quy (Ridge/Lasso) & phân loại (logistic, KNN, SVM, ensemble, độ đo), học không giám sát (K-Means, PCA), và mini capstone đầu-cuối. Song ngữ, có code & quiz.',
    description: 'Môn <strong>AIL303m — Machine Learning (Học máy)</strong> thuộc ngành AI, kỳ 3. Bám nguồn chính <strong>IBM "Introduction to Machine Learning" (Coursera)</strong>, học bằng Python + <strong>scikit-learn</strong> trên JupyterLab. Đi hết vòng lặp ML: <strong>dữ liệu &amp; EDA</strong> (lấy, làm sạch, feature engineering, thống kê suy diễn) → <strong>học có giám sát</strong> (hồi quy tuyến tính/đa thức &amp; regularization; phân loại logistic/KNN/SVM/cây/ensemble với đúng độ đo &amp; xử lý lớp mất cân bằng) → <strong>học không giám sát</strong> (K-Means &amp; các thuật toán gom cụm; giảm chiều PCA) → <strong>mini capstone</strong> đầu-cuối. Song ngữ, có công thức, code minh hoạ và quiz mỗi module. Tiên quyết: MAS291, MAI391, PFP191.',
    whatYouLearn: 'Quy trình ML đầu-cuối; lấy dữ liệu (SQL/NoSQL/API/Cloud) &amp; làm sạch; EDA bằng pandas/matplotlib; feature engineering (scaling, encoding, transforms) &amp; thống kê suy diễn (kiểm định giả thuyết, p-value); train/test split &amp; cross-validation; hồi quy tuyến tính/đa thức, Ridge/Lasso/Elastic Net; phân loại logistic, KNN, SVM (+kernel), decision tree; ensemble (bagging, random forest, boosting, stacking); độ đo accuracy/precision/recall/F1/ROC-AUC &amp; xử lý lớp mất cân bằng; K-Means, hierarchical, DBSCAN; giảm chiều PCA &amp; matrix factorization; chạy một dự án ML đầu-cuối trong Pipeline, tránh rò rỉ dữ liệu.',
    requirements: 'MAS291 (xác suất &amp; thống kê), MAI391 (đại số tuyến tính &amp; giải tích) và PFP191 (lập trình Python). Biết Python cơ bản; cài scikit-learn/pandas/numpy hoặc dùng Google Colab / JupyterLite.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Nguồn IBM ML (Coursera), scikit-learn, sách, Kaggle; công cụ JupyterLab/Colab; lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'ML là gì, 3 loại học, quy trình, 10 CLO, cơ cấu điểm, tiên quyết.', lessons: [intro] },
    { title: 'Module 1 — EDA cho Machine Learning|||Module 1 — EDA for Machine Learning', description: 'Lấy & làm sạch dữ liệu, EDA, feature engineering, thống kê suy diễn.', lessons: [m1a, m1b, m1q] },
    { title: 'Module 2 — Học có giám sát: Hồi quy|||Module 2 — Supervised learning: Regression', description: 'Train/test & CV, linear/polynomial regression, Ridge/Lasso/Elastic Net.', lessons: [m2a, m2b, m2q] },
    { title: 'Module 3 — Học có giám sát: Phân loại|||Module 3 — Supervised learning: Classification', description: 'Logistic, KNN, SVM, cây, ensemble, độ đo, lớp mất cân bằng.', lessons: [m3a, m3b, m3q] },
    { title: 'Module 4 — Học không giám sát|||Module 4 — Unsupervised learning', description: 'K-Means & clustering, curse of dimensionality, PCA.', lessons: [m4a, m4b, m4q] },
    { title: 'Module 5 — Mini Capstone|||Module 5 — Mini Capstone', description: 'Dự án ML đầu-cuối trong Pipeline, tránh rò rỉ dữ liệu.', lessons: [m5a, m5q] },
  ],
};
