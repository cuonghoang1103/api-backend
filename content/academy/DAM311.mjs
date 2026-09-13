/**
 * DAM311 — Data Mining I (Khai phá dữ liệu I). Ngành Khoa học Máy tính FPTU.
 * Khung chất lượng, song ngữ VI+EN, 8 chương + tài liệu + giới thiệu.
 * Giáo trình chuẩn: Han, Kamber &amp; Pei "Data Mining: Concepts and Techniques";
 * Tan, Steinbach &amp; Kumar "Introduction to Data Mining". Code: Python + scikit-learn.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ lồng; & -> &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dam311-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình chuẩn (Han, Tan), scikit-learn, Kaggle Learn, YouTube, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">DAM311 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Data Mining</strong> — the KDD process, preprocessing, association rules, classification, evaluation and clustering — in one place. The official FPTU slides live on <strong>FLM</strong>; below are free, legal resources, all runnable in Python.</p>
<h3>📘 Textbooks (the two standards)</h3>
<ul>
<li><a href="https://hanj.cs.illinois.edu/bk3/" target="_blank" rel="noopener">Han, Kamber &amp; Pei — <em>Data Mining: Concepts and Techniques</em></a> (the reference for concepts &amp; algorithms).</li>
<li><a href="https://www-users.cse.umn.edu/~kumar001/dmbook/index.php" target="_blank" rel="noopener">Tan, Steinbach &amp; Kumar — <em>Introduction to Data Mining</em></a> (clear, example-driven).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn User Guide</a> — the toolkit used all through this course.</li>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">pandas documentation</a> — load, clean and reshape tabular data.</li>
</ul>
<h3>🎓 Interactive practice</h3>
<ul>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a> — short hands-on courses (pandas, intro to ML, feature engineering).</li>
<li><a href="https://archive.ics.uci.edu/" target="_blank" rel="noopener">UCI Machine Learning Repository</a> — classic datasets to mine.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — algorithms explained clearly.</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — the maths behind the methods.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — what data mining is, the KDD process, and how to clean &amp; prepare data.</li>
<li><strong>Patterns</strong> — explore &amp; visualize data, then mine association rules.</li>
<li><strong>Predict</strong> — build classifiers, evaluate them honestly, and cluster unlabeled data.</li>
<li><strong>Apply</strong> — ensembles, anomaly detection, and the ethics of mining real data.</li>
</ol></div>`,
    `<span class="eyebrow">DAM311 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Khai phá dữ liệu</strong> — quy trình KDD, tiền xử lý, luật kết hợp, phân lớp, đánh giá và phân cụm — gom về một chỗ. Slide chính thức FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, chạy được bằng Python.</p>
<h3>📘 Giáo trình (hai cuốn chuẩn)</h3>
<ul>
<li><a href="https://hanj.cs.illinois.edu/bk3/" target="_blank" rel="noopener">Han, Kamber &amp; Pei — <em>Data Mining: Concepts and Techniques</em></a> (chuẩn về khái niệm &amp; thuật toán).</li>
<li><a href="https://www-users.cse.umn.edu/~kumar001/dmbook/index.php" target="_blank" rel="noopener">Tan, Steinbach &amp; Kumar — <em>Introduction to Data Mining</em></a> (dễ đọc, nhiều ví dụ).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn User Guide</a> — bộ công cụ dùng xuyên suốt môn.</li>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">pandas documentation</a> — nạp, làm sạch và biến đổi dữ liệu bảng.</li>
</ul>
<h3>🎓 Luyện tập tương tác</h3>
<ul>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a> — khoá ngắn thực hành (pandas, nhập môn ML, feature engineering).</li>
<li><a href="https://archive.ics.uci.edu/" target="_blank" rel="noopener">UCI Machine Learning Repository</a> — kho dữ liệu kinh điển để khai phá.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — giảng thuật toán rõ ràng.</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — toán học đằng sau phương pháp.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — khai phá dữ liệu là gì, quy trình KDD, làm sạch &amp; chuẩn bị dữ liệu.</li>
<li><strong>Mẫu hình</strong> — khám phá &amp; trực quan dữ liệu, rồi khai phá luật kết hợp.</li>
<li><strong>Dự đoán</strong> — dựng bộ phân lớp, đánh giá trung thực, và phân cụm dữ liệu không nhãn.</li>
<li><strong>Ứng dụng</strong> — ensemble, phát hiện bất thường, và đạo đức khi khai phá dữ liệu thật.</li>
</ol></div>`,
  ]]);

const intro = doc('dam311-0-1-overview', 'Course overview: what is data mining|||Tổng quan: khai phá dữ liệu là gì',
  'Khai phá dữ liệu làm gì; dữ liệu -> tri thức; quy trình KDD; các nhiệm vụ (mô tả, dự đoán); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">DAM311 · Lesson 0.1 · Overview</span>
<h2>What is data mining?</h2>
<p class="lead"><strong>Data mining</strong> is the process of discovering useful patterns, rules and models from large amounts of data — turning raw records into <strong>knowledge</strong> you can act on. It sits at the crossroads of databases, statistics and machine learning.</p>
<h3>Two families of tasks</h3>
<ul>
<li><strong>Descriptive</strong> — summarize what is in the data: clustering, association rules, anomaly detection.</li>
<li><strong>Predictive</strong> — infer unknown values: classification (a label) and regression (a number).</li>
</ul>
<h3>The KDD process</h3>
<pre><code>Data -&gt; Cleaning -&gt; Integration -&gt; Selection -&gt; Transformation
     -&gt; Data Mining -&gt; Evaluation -&gt; Knowledge</code></pre>
<p>Data mining is <em>one</em> step inside the wider <strong>KDD (Knowledge Discovery in Databases)</strong> pipeline — and most of the real effort is the preparation before it.</p>
<h3>Roadmap</h3>
<p>What data mining is &amp; KDD → preprocessing → exploration &amp; distance → association rules → classification → evaluation → clustering → advanced topics &amp; ethics. Bilingual, with runnable Python + scikit-learn and a quiz per chapter.</p>`,
    `<span class="eyebrow">DAM311 · Bài 0.1 · Tổng quan</span>
<h2>Khai phá dữ liệu là gì?</h2>
<p class="lead"><strong>Khai phá dữ liệu (data mining)</strong> là quá trình tìm ra mẫu hình, luật và mô hình hữu ích từ lượng lớn dữ liệu — biến bản ghi thô thành <strong>tri thức</strong> dùng được. Nó nằm ở giao điểm của cơ sở dữ liệu, thống kê và học máy.</p>
<h3>Hai nhóm nhiệm vụ</h3>
<ul>
<li><strong>Mô tả (descriptive)</strong> — tóm tắt những gì có trong dữ liệu: phân cụm, luật kết hợp, phát hiện bất thường.</li>
<li><strong>Dự đoán (predictive)</strong> — suy ra giá trị chưa biết: phân lớp (một nhãn) và hồi quy (một số).</li>
</ul>
<h3>Quy trình KDD</h3>
<pre><code>Dữ liệu -&gt; Làm sạch -&gt; Tích hợp -&gt; Chọn lọc -&gt; Biến đổi
        -&gt; Khai phá -&gt; Đánh giá -&gt; Tri thức</code></pre>
<p>Khai phá dữ liệu chỉ là <em>một</em> bước trong đường ống lớn hơn <strong>KDD (Knowledge Discovery in Databases)</strong> — và phần lớn công sức thật nằm ở khâu chuẩn bị trước đó.</p>
<h3>Lộ trình</h3>
<p>Data mining &amp; KDD → tiền xử lý → khám phá &amp; khoảng cách → luật kết hợp → phân lớp → đánh giá → phân cụm → chủ đề nâng cao &amp; đạo đức. Song ngữ, có Python + scikit-learn chạy được và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('dam311-1-1-what-is', '1.1 — Data mining & the KDD process|||1.1 — Khai phá dữ liệu & quy trình KDD',
  'Data mining, quy trình KDD 7 bước, các loại nhiệm vụ (mô tả/dự đoán), ứng dụng thực tế.',
  [[
    `<span class="eyebrow">DAM311 · Chapter 1 · Lesson 1.1</span>
<h2>Data mining &amp; the KDD process</h2>
<h3>Why mine data?</h3>
<p>Organizations store far more data than any human can read. Data mining finds the <strong>non-obvious, valid, useful</strong> patterns hidden inside — "customers who buy X also buy Y", "this transaction looks fraudulent", "these users form three natural groups".</p>
<h3>Task types</h3>
<ul>
<li><strong>Classification</strong> — assign a record to a known class (spam / not spam).</li>
<li><strong>Regression</strong> — predict a numeric value (house price).</li>
<li><strong>Clustering</strong> — group similar records with no labels.</li>
<li><strong>Association</strong> — find items that co-occur (market-basket analysis).</li>
<li><strong>Anomaly detection</strong> — flag records that do not fit the pattern.</li>
</ul>
<h3>Applications</h3>
<p>Recommendation, fraud detection, churn prediction, medical diagnosis, search ranking, and demand forecasting all rest on these five tasks.</p>
<pre><code>KDD in one line:
  select -&gt; preprocess -&gt; transform -&gt; MINE -&gt; interpret / evaluate</code></pre>
<div class="callout"><span class="badge">Key idea</span> Mining is only as good as the data feeding it. "Garbage in, garbage out" is why the next two chapters are about preparation, not algorithms.</div>`,
    `<span class="eyebrow">DAM311 · Chương 1 · Bài 1.1</span>
<h2>Khai phá dữ liệu &amp; quy trình KDD</h2>
<h3>Vì sao phải khai phá dữ liệu?</h3>
<p>Tổ chức lưu nhiều dữ liệu hơn bất kỳ ai đọc nổi. Khai phá dữ liệu tìm ra các mẫu hình <strong>không hiển nhiên, hợp lệ, hữu ích</strong> ẩn bên trong — "khách mua X cũng mua Y", "giao dịch này có vẻ gian lận", "nhóm người dùng này chia thành ba cụm tự nhiên".</p>
<h3>Các loại nhiệm vụ</h3>
<ul>
<li><strong>Phân lớp</strong> — gán bản ghi vào lớp đã biết (spam / không spam).</li>
<li><strong>Hồi quy</strong> — dự đoán một giá trị số (giá nhà).</li>
<li><strong>Phân cụm</strong> — gom bản ghi giống nhau khi không có nhãn.</li>
<li><strong>Luật kết hợp</strong> — tìm các mục cùng xuất hiện (phân tích giỏ hàng).</li>
<li><strong>Phát hiện bất thường</strong> — đánh dấu bản ghi không khớp mẫu.</li>
</ul>
<h3>Ứng dụng</h3>
<p>Gợi ý, phát hiện gian lận, dự đoán rời bỏ, chẩn đoán y khoa, xếp hạng tìm kiếm, dự báo nhu cầu — tất cả dựa trên năm nhiệm vụ này.</p>
<pre><code>KDD gói gọn:
  chọn -&gt; tiền xử lý -&gt; biến đổi -&gt; KHAI PHÁ -&gt; diễn giải / đánh giá</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Khai phá chỉ tốt bằng dữ liệu nuôi nó. "Rác vào thì rác ra" là lý do hai chương sau nói về chuẩn bị, không phải thuật toán.</div>`,
  ]]);

const c1q = quiz('dam311-quiz-1', 'Quiz 1 — Data mining & KDD|||Quiz 1 — Khai phá dữ liệu & KDD', [
  { id: 'q1', question: 'Trong quy trình KDD, "data mining" là?|||In the KDD process, "data mining" is?', options: ['Toàn bộ quy trình|||The whole process', 'Một bước tìm mẫu, nằm sau tiền xử lý|||One pattern-finding step, after preprocessing', 'Chỉ việc làm sạch dữ liệu|||Only data cleaning', 'Việc lưu trữ dữ liệu|||Storing the data'], correctIndex: 1, explanation: 'KDD là đường ống lớn; khai phá là một bước ở giữa, sau khi dữ liệu đã được chuẩn bị.' },
  { id: 'q2', question: 'Nhiệm vụ gom bản ghi giống nhau khi KHÔNG có nhãn là?|||The task of grouping similar records with NO labels is?', options: ['Phân lớp|||Classification', 'Hồi quy|||Regression', 'Phân cụm|||Clustering', 'Luật kết hợp|||Association'], correctIndex: 2, explanation: 'Phân cụm (clustering) là học không giám sát: không có nhãn cho trước.' },
  { id: 'q3', question: '"Khách mua X cũng mua Y" là kết quả của nhiệm vụ nào?|||"Buyers of X also buy Y" comes from which task?', options: ['Phát hiện bất thường|||Anomaly detection', 'Luật kết hợp|||Association rules', 'Hồi quy|||Regression', 'Phân lớp|||Classification'], correctIndex: 1, explanation: 'Đây là phân tích giỏ hàng — bài toán kinh điển của luật kết hợp.' },
]);

const c2 = doc('dam311-2-1-preprocessing', '2.1 — Data preprocessing|||2.1 — Tiền xử lý dữ liệu',
  'Data cleaning (thiếu/nhiễu), integration, transformation (chuẩn hoá, mã hoá), reduction (chọn đặc trưng, PCA).',
  [[
    `<span class="eyebrow">DAM311 · Chapter 2 · Lesson 2.1</span>
<h2>Data preprocessing</h2>
<p class="lead">Real data is dirty: missing values, typos, duplicates, inconsistent units. Preprocessing usually takes most of a mining project.</p>
<h3>The four jobs</h3>
<ul>
<li><strong>Cleaning</strong> — fill or drop missing values, smooth noise, remove duplicates.</li>
<li><strong>Integration</strong> — merge data from several sources; resolve conflicts and redundancy.</li>
<li><strong>Transformation</strong> — normalize / standardize numbers, encode categories, create new features.</li>
<li><strong>Reduction</strong> — fewer rows (sampling) or fewer columns (feature selection, PCA) without losing signal.</li>
</ul>
<h3>Two common transforms</h3>
<p><strong>Min-max</strong> rescales to the range 0 to 1. <strong>Z-score</strong> (standardization) centers on the mean with unit variance — required by distance-based methods like kNN and k-means.</p>
<pre><code class="language-python">import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer

df = pd.read_csv("data.csv")

# 1) fill missing numeric values with the column mean
imp = SimpleImputer(strategy="mean")
df[["age", "income"]] = imp.fit_transform(df[["age", "income"]])

# 2) standardize so every feature has mean 0, variance 1
scaler = StandardScaler()
X = scaler.fit_transform(df[["age", "income"]])
print(X[:3])</code></pre>
<div class="callout"><span class="badge">Watch out</span> Fit the scaler on the TRAINING data only, then apply it to the test data. Fitting on everything leaks information and inflates your scores.</div>`,
    `<span class="eyebrow">DAM311 · Chương 2 · Bài 2.1</span>
<h2>Tiền xử lý dữ liệu</h2>
<p class="lead">Dữ liệu thật thì bẩn: giá trị thiếu, gõ sai, trùng lặp, đơn vị không nhất quán. Tiền xử lý thường chiếm phần lớn một dự án khai phá.</p>
<h3>Bốn công việc</h3>
<ul>
<li><strong>Làm sạch (cleaning)</strong> — điền hoặc bỏ giá trị thiếu, làm mượt nhiễu, xoá trùng.</li>
<li><strong>Tích hợp (integration)</strong> — gộp dữ liệu từ nhiều nguồn; xử lý xung đột và dư thừa.</li>
<li><strong>Biến đổi (transformation)</strong> — chuẩn hoá số, mã hoá biến hạng mục, tạo đặc trưng mới.</li>
<li><strong>Thu giảm (reduction)</strong> — bớt dòng (lấy mẫu) hoặc bớt cột (chọn đặc trưng, PCA) mà không mất tín hiệu.</li>
</ul>
<h3>Hai phép biến đổi hay dùng</h3>
<p><strong>Min-max</strong> đưa về đoạn 0 tới 1. <strong>Z-score</strong> (chuẩn hoá) căn giữa quanh trung bình với phương sai đơn vị — bắt buộc cho các phương pháp dựa trên khoảng cách như kNN và k-means.</p>
<pre><code class="language-python">import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer

df = pd.read_csv("data.csv")

# 1) điền giá trị số bị thiếu bằng trung bình cột
imp = SimpleImputer(strategy="mean")
df[["age", "income"]] = imp.fit_transform(df[["age", "income"]])

# 2) chuẩn hoá để mỗi đặc trưng có trung bình 0, phương sai 1
scaler = StandardScaler()
X = scaler.fit_transform(df[["age", "income"]])
print(X[:3])</code></pre>
<div class="callout"><span class="badge">Cẩn thận</span> Chỉ fit bộ scaler trên dữ liệu HUẤN LUYỆN, rồi áp lên dữ liệu kiểm thử. Fit trên toàn bộ sẽ rò rỉ thông tin và thổi phồng điểm số.</div>`,
  ]]);

const c2q = quiz('dam311-quiz-2', 'Quiz 2 — Preprocessing|||Quiz 2 — Tiền xử lý', [
  { id: 'q1', question: 'Chuẩn hoá Z-score biến mỗi đặc trưng thành?|||Z-score standardization makes each feature have?', options: ['Đoạn 0 tới 1|||Range 0 to 1', 'Trung bình 0, phương sai 1|||Mean 0, variance 1', 'Toàn số nguyên|||All integers', 'Tổng bằng 100|||Sum equal to 100'], correctIndex: 1, explanation: 'Z-score = (x − mean) / std → trung bình 0, phương sai 1.' },
  { id: 'q2', question: 'PCA thuộc bước tiền xử lý nào?|||PCA belongs to which preprocessing job?', options: ['Làm sạch|||Cleaning', 'Tích hợp|||Integration', 'Thu giảm (reduction)|||Reduction', 'Lấy mẫu dòng|||Row sampling'], correctIndex: 2, explanation: 'PCA giảm số chiều (cột) mà giữ phần lớn phương sai — thu giảm dữ liệu.' },
  { id: 'q3', question: 'Vì sao chỉ nên fit scaler trên tập train?|||Why fit the scaler on the train set only?', options: ['Cho nhanh hơn|||To run faster', 'Tránh rò rỉ thông tin test|||To avoid leaking test information', 'Vì test không có số|||Because test has no numbers', 'Không có lý do|||No reason'], correctIndex: 1, explanation: 'Fit trên cả test làm rò rỉ dữ liệu và thổi phồng đánh giá.' },
]);

const c3 = doc('dam311-3-1-eda-distance', '3.1 — Exploration, visualization & distance|||3.1 — Khám phá, trực quan & khoảng cách',
  'EDA, thống kê mô tả (mean/median/std, phân vị), trực quan (histogram, boxplot, scatter), đo tương tự/khoảng cách.',
  [[
    `<span class="eyebrow">DAM311 · Chapter 3 · Lesson 3.1</span>
<h2>Exploration, visualization &amp; distance</h2>
<h3>Exploratory Data Analysis (EDA)</h3>
<p>Before any algorithm, <strong>look at the data</strong>. Descriptive statistics — mean, median, standard deviation, min/max, and the quartiles — summarize each column; plots reveal shape and outliers.</p>
<ul>
<li><strong>Histogram</strong> — the distribution of one numeric column.</li>
<li><strong>Box plot</strong> — median, spread and outliers at a glance.</li>
<li><strong>Scatter plot</strong> — the relationship between two columns.</li>
</ul>
<h3>Similarity &amp; distance measures</h3>
<p>Clustering and kNN need a way to say how "close" two records are:</p>
<ul>
<li><strong>Euclidean</strong> — straight-line distance; the default for continuous features.</li>
<li><strong>Manhattan</strong> — sum of absolute differences; robust on grid-like data.</li>
<li><strong>Cosine</strong> — angle between vectors; ignores magnitude (great for text).</li>
</ul>
<pre><code class="language-python">import pandas as pd
from scipy.spatial import distance

df = pd.read_csv("iris.csv")
print(df.describe())          # count, mean, std, min, quartiles, max

a = [5.1, 3.5, 1.4, 0.2]
b = [6.2, 3.4, 5.4, 2.3]
print("euclidean:", distance.euclidean(a, b))
print("cosine   :", distance.cosine(a, b))</code></pre>
<div class="callout"><span class="badge">Scale first</span> Distances are dominated by large-range features. Standardize BEFORE measuring, or one column silently decides every neighbor.</div>`,
    `<span class="eyebrow">DAM311 · Chương 3 · Bài 3.1</span>
<h2>Khám phá, trực quan &amp; khoảng cách</h2>
<h3>Phân tích khám phá (EDA)</h3>
<p>Trước mọi thuật toán, hãy <strong>nhìn vào dữ liệu</strong>. Thống kê mô tả — trung bình, trung vị, độ lệch chuẩn, min/max và các tứ phân vị — tóm tắt từng cột; biểu đồ cho thấy hình dạng và điểm ngoại lai.</p>
<ul>
<li><strong>Histogram</strong> — phân bố của một cột số.</li>
<li><strong>Box plot</strong> — trung vị, độ trải và ngoại lai trong một cái nhìn.</li>
<li><strong>Scatter plot</strong> — quan hệ giữa hai cột.</li>
</ul>
<h3>Đo tương tự &amp; khoảng cách</h3>
<p>Phân cụm và kNN cần cách nói hai bản ghi "gần" nhau đến đâu:</p>
<ul>
<li><strong>Euclid</strong> — khoảng cách đường thẳng; mặc định cho đặc trưng liên tục.</li>
<li><strong>Manhattan</strong> — tổng trị tuyệt đối chênh lệch; bền với dữ liệu dạng lưới.</li>
<li><strong>Cosine</strong> — góc giữa hai vector; bỏ qua độ lớn (tốt cho văn bản).</li>
</ul>
<pre><code class="language-python">import pandas as pd
from scipy.spatial import distance

df = pd.read_csv("iris.csv")
print(df.describe())          # count, mean, std, min, tứ phân vị, max

a = [5.1, 3.5, 1.4, 0.2]
b = [6.2, 3.4, 5.4, 2.3]
print("euclid:", distance.euclidean(a, b))
print("cosine:", distance.cosine(a, b))</code></pre>
<div class="callout"><span class="badge">Chuẩn hoá trước</span> Khoảng cách bị chi phối bởi đặc trưng có khoảng giá trị lớn. Chuẩn hoá TRƯỚC khi đo, nếu không một cột âm thầm quyết định mọi láng giềng.</div>`,
  ]]);

const c3q = quiz('dam311-quiz-3', 'Quiz 3 — EDA & distance|||Quiz 3 — EDA & khoảng cách', [
  { id: 'q1', question: 'Độ đo bỏ qua độ lớn, chỉ xét góc giữa hai vector là?|||The measure that ignores magnitude and uses the angle is?', options: ['Euclidean', 'Manhattan', 'Cosine', 'Z-score'], correctIndex: 2, explanation: 'Cosine đo góc giữa vector, phù hợp dữ liệu văn bản (TF-IDF).' },
  { id: 'q2', question: 'Biểu đồ nào thể hiện trung vị, độ trải và ngoại lai gọn nhất?|||Which plot best shows median, spread and outliers?', options: ['Histogram', 'Box plot', 'Scatter plot', 'Bảng số|||A table'], correctIndex: 1, explanation: 'Box plot hiển thị tứ phân vị và điểm ngoại lai trong một hình.' },
  { id: 'q3', question: 'Vì sao chuẩn hoá TRƯỚC khi tính khoảng cách?|||Why standardize BEFORE computing distances?', options: ['Cho đẹp|||For looks', 'Để cột giá trị lớn không lấn át|||So a large-range column does not dominate', 'Để có số âm|||To get negatives', 'Không cần thiết|||It is unnecessary'], correctIndex: 1, explanation: 'Không chuẩn hoá thì đặc trưng khoảng giá trị lớn chi phối toàn bộ khoảng cách.' },
]);

const c4 = doc('dam311-4-1-association', '4.1 — Association rules|||4.1 — Luật kết hợp',
  'Association rule, support/confidence/lift, thuật toán Apriori (loại tỉa) và FP-Growth (cây FP).',
  [[
    `<span class="eyebrow">DAM311 · Chapter 4 · Lesson 4.1</span>
<h2>Association rules</h2>
<p class="lead">Market-basket analysis asks: which items appear together? A rule looks like <strong>{bread, butter} =&gt; {milk}</strong>.</p>
<h3>Three metrics</h3>
<ul>
<li><strong>Support</strong> — how often the itemset appears: support(X) = count(X) / N.</li>
<li><strong>Confidence</strong> — how often the rule holds: conf(X =&gt; Y) = support(X and Y) / support(X).</li>
<li><strong>Lift</strong> — confidence vs. chance: lift &gt; 1 means X and Y really are associated; lift = 1 means independent.</li>
</ul>
<h3>Apriori</h3>
<p>Apriori uses one clever idea — the <strong>anti-monotone</strong> property: if an itemset is infrequent, every superset is infrequent too. So it grows itemsets level by level and prunes anything below <em>min support</em>, avoiding an exponential blow-up.</p>
<h3>FP-Growth</h3>
<p><strong>FP-Growth</strong> compresses the data into an <strong>FP-tree</strong> and mines it recursively, with no candidate generation — far faster on large, dense datasets.</p>
<pre><code class="language-python">from mlxtend.frequent_patterns import apriori, association_rules

# one-hot basket table: rows = transactions, columns = items (True / False)
freq = apriori(basket, min_support=0.02, use_colnames=True)
rules = association_rules(freq, metric="lift", min_threshold=1.0)
print(rules[["antecedents", "consequents", "support", "confidence", "lift"]])</code></pre>
<div class="callout"><span class="badge">Read lift, not just confidence</span> High confidence can be an illusion when the consequent is popular anyway. Lift above 1 confirms a real association.</div>`,
    `<span class="eyebrow">DAM311 · Chương 4 · Bài 4.1</span>
<h2>Luật kết hợp</h2>
<p class="lead">Phân tích giỏ hàng hỏi: những mục nào cùng xuất hiện? Một luật có dạng <strong>{bánh mì, bơ} =&gt; {sữa}</strong>.</p>
<h3>Ba độ đo</h3>
<ul>
<li><strong>Support (độ hỗ trợ)</strong> — tần suất tập mục xuất hiện: support(X) = đếm(X) / N.</li>
<li><strong>Confidence (độ tin cậy)</strong> — luật đúng bao nhiêu lần: conf(X =&gt; Y) = support(X và Y) / support(X).</li>
<li><strong>Lift (độ nâng)</strong> — tin cậy so với ngẫu nhiên: lift &gt; 1 nghĩa là X và Y thực sự liên quan; lift = 1 là độc lập.</li>
</ul>
<h3>Apriori</h3>
<p>Apriori dùng một ý tưởng khéo — tính chất <strong>phản đơn điệu</strong>: nếu một tập mục hiếm thì mọi tập cha cũng hiếm. Nhờ đó nó phát triển tập mục theo từng cấp và tỉa bỏ mọi thứ dưới <em>min support</em>, tránh bùng nổ tổ hợp.</p>
<h3>FP-Growth</h3>
<p><strong>FP-Growth</strong> nén dữ liệu thành <strong>cây FP</strong> rồi khai phá đệ quy, không sinh ứng viên — nhanh hơn nhiều trên tập lớn, dày.</p>
<pre><code class="language-python">from mlxtend.frequent_patterns import apriori, association_rules

# bảng giỏ one-hot: dòng = giao dịch, cột = mục (True / False)
freq = apriori(basket, min_support=0.02, use_colnames=True)
rules = association_rules(freq, metric="lift", min_threshold=1.0)
print(rules[["antecedents", "consequents", "support", "confidence", "lift"]])</code></pre>
<div class="callout"><span class="badge">Đọc lift, đừng chỉ confidence</span> Confidence cao có thể là ảo khi vế phải vốn đã phổ biến. Lift trên 1 mới xác nhận liên hệ thật.</div>`,
  ]]);

const c4q = quiz('dam311-quiz-4', 'Quiz 4 — Association rules|||Quiz 4 — Luật kết hợp', [
  { id: 'q1', question: 'Tính chất giúp Apriori tỉa nhánh là?|||The property that lets Apriori prune is?', options: ['Nếu tập cha hiếm thì tập con hiếm|||Superset infrequent implies subset infrequent', 'Nếu tập mục hiếm thì mọi tập cha cũng hiếm|||If an itemset is infrequent, every superset is too', 'Mọi tập đều thường xuyên|||All itemsets are frequent', 'Không có tính chất nào|||No property'], correctIndex: 1, explanation: 'Tính phản đơn điệu: tập con hiếm ⇒ tập cha hiếm, nên cắt sớm được.' },
  { id: 'q2', question: 'Lift = 1 nghĩa là?|||Lift = 1 means?', options: ['X và Y liên quan mạnh|||X and Y strongly associated', 'X và Y độc lập|||X and Y independent', 'Luật sai|||The rule is wrong', 'Support bằng 0|||Support is zero'], correctIndex: 1, explanation: 'Lift = 1 nghĩa X và Y xuất hiện cùng nhau đúng bằng mức ngẫu nhiên — độc lập.' },
  { id: 'q3', question: 'FP-Growth khác Apriori ở chỗ?|||FP-Growth differs from Apriori by?', options: ['Không sinh ứng viên, dùng cây FP|||No candidate generation, uses an FP-tree', 'Chậm hơn nhiều|||Being much slower', 'Không cần dữ liệu|||Needing no data', 'Chỉ chạy trên văn bản|||Only running on text'], correctIndex: 0, explanation: 'FP-Growth nén thành cây FP và khai phá đệ quy, bỏ khâu sinh ứng viên.' },
]);

const c5 = doc('dam311-5-1-classification', '5.1 — Classification: tree, Naive Bayes, kNN|||5.1 — Phân lớp: cây, Naive Bayes, kNN',
  'Phân lớp có giám sát; cây quyết định (entropy/gini), Naive Bayes (Bayes + độc lập), kNN (láng giềng gần); code scikit-learn.',
  [[
    `<span class="eyebrow">DAM311 · Chapter 5 · Lesson 5.1</span>
<h2>Classification: tree, Naive Bayes, kNN</h2>
<p class="lead"><strong>Classification</strong> is supervised: learn from labeled examples, then predict the label of new records.</p>
<h3>Three workhorse algorithms</h3>
<ul>
<li><strong>Decision tree</strong> — split the data on the feature that best separates the classes (by <em>information gain</em> / entropy or the <em>Gini</em> index). Readable, but prone to overfitting.</li>
<li><strong>Naive Bayes</strong> — apply Bayes theorem assuming features are independent. Fast, strong on text (spam filtering).</li>
<li><strong>k-Nearest Neighbors (kNN)</strong> — label a point by majority vote of its k closest neighbors. No training, but slow at predict time and scale-sensitive.</li>
</ul>
<pre><code class="language-python">from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42)

models = {
    "tree": DecisionTreeClassifier(max_depth=4),
    "bayes": GaussianNB(),
    "knn": KNeighborsClassifier(n_neighbors=5),
}
for name, m in models.items():
    m.fit(X_tr, y_tr)
    print(name, "accuracy:", m.score(X_te, y_te))</code></pre>
<div class="callout"><span class="badge">kNN needs scaling</span> Because kNN measures distance, standardize features first — otherwise a wide-range column dominates every vote.</div>`,
    `<span class="eyebrow">DAM311 · Chương 5 · Bài 5.1</span>
<h2>Phân lớp: cây, Naive Bayes, kNN</h2>
<p class="lead"><strong>Phân lớp</strong> là học có giám sát: học từ ví dụ đã gán nhãn, rồi dự đoán nhãn cho bản ghi mới.</p>
<h3>Ba thuật toán chủ lực</h3>
<ul>
<li><strong>Cây quyết định</strong> — tách dữ liệu theo đặc trưng phân tách lớp tốt nhất (bằng <em>độ lợi thông tin</em> / entropy hoặc chỉ số <em>Gini</em>). Dễ đọc, nhưng dễ quá khớp.</li>
<li><strong>Naive Bayes</strong> — áp định lý Bayes với giả định các đặc trưng độc lập. Nhanh, mạnh với văn bản (lọc spam).</li>
<li><strong>k láng giềng gần (kNN)</strong> — gán nhãn theo biểu quyết đa số của k điểm gần nhất. Không huấn luyện, nhưng chậm lúc dự đoán và nhạy với thang đo.</li>
</ul>
<pre><code class="language-python">from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42)

models = {
    "tree": DecisionTreeClassifier(max_depth=4),
    "bayes": GaussianNB(),
    "knn": KNeighborsClassifier(n_neighbors=5),
}
for name, m in models.items():
    m.fit(X_tr, y_tr)
    print(name, "accuracy:", m.score(X_te, y_te))</code></pre>
<div class="callout"><span class="badge">kNN cần chuẩn hoá</span> Vì kNN đo khoảng cách, hãy chuẩn hoá đặc trưng trước — nếu không một cột khoảng giá trị lớn sẽ lấn át mọi phiếu bầu.</div>`,
  ]]);

const c5q = quiz('dam311-quiz-5', 'Quiz 5 — Classification|||Quiz 5 — Phân lớp', [
  { id: 'q1', question: 'Cây quyết định chọn điểm tách dựa trên?|||A decision tree splits based on?', options: ['Khoảng cách cosine|||Cosine distance', 'Độ lợi thông tin / Gini|||Information gain / Gini', 'Support và lift|||Support and lift', 'Số cụm|||Number of clusters'], correctIndex: 1, explanation: 'Cây chọn đặc trưng tách lớp tốt nhất theo entropy/độ lợi thông tin hoặc Gini.' },
  { id: 'q2', question: 'Giả định cốt lõi của Naive Bayes là?|||The core assumption of Naive Bayes is?', options: ['Các đặc trưng độc lập|||Features are independent', 'Dữ liệu đã chuẩn hoá|||Data is standardized', 'Có đúng 2 lớp|||Exactly two classes', 'Không có giá trị thiếu|||No missing values'], correctIndex: 0, explanation: 'Naive Bayes giả định các đặc trưng độc lập có điều kiện với nhãn — đơn giản mà hiệu quả.' },
  { id: 'q3', question: 'kNN nhạy cảm với điều gì nếu quên tiền xử lý?|||kNN is sensitive to what if you skip preprocessing?', options: ['Thứ tự cột|||Column order', 'Thang đo đặc trưng|||Feature scale', 'Tên tệp|||File name', 'Màu biểu đồ|||Chart color'], correctIndex: 1, explanation: 'kNN dựa trên khoảng cách nên phải chuẩn hoá thang đo, không thì một cột lấn át.' },
]);

const c6 = doc('dam311-6-1-evaluation', '6.1 — Evaluating classifiers|||6.1 — Đánh giá phân lớp',
  'Confusion matrix, accuracy/precision/recall/F1, đường ROC/AUC, cross-validation, overfitting và cách chống.',
  [[
    `<span class="eyebrow">DAM311 · Chapter 6 · Lesson 6.1</span>
<h2>Evaluating classifiers</h2>
<h3>The confusion matrix</h3>
<p>Every prediction is a True/False Positive/Negative. From those four counts come the metrics that matter:</p>
<ul>
<li><strong>Accuracy</strong> = correct / total — misleading on imbalanced data.</li>
<li><strong>Precision</strong> = TP / (TP + FP) — of those we flagged, how many were right.</li>
<li><strong>Recall</strong> = TP / (TP + FN) — of the real positives, how many we caught.</li>
<li><strong>F1</strong> = the harmonic mean of precision and recall — one balanced number.</li>
</ul>
<h3>ROC / AUC and cross-validation</h3>
<p>The <strong>ROC curve</strong> plots true-positive vs. false-positive rate as the threshold moves; <strong>AUC</strong> (area under it) rates the model from 0.5 (random) to 1.0 (perfect). <strong>k-fold cross-validation</strong> rotates the test fold k times for a stable estimate instead of one lucky split.</p>
<h3>Overfitting</h3>
<p>An overfit model memorizes noise: high train accuracy, low test accuracy. Fight it with more data, simpler models, regularization, pruning, and honest validation.</p>
<pre><code class="language-python">from sklearn.model_selection import cross_val_score
from sklearn.metrics import classification_report, roc_auc_score

scores = cross_val_score(model, X, y, cv=5, scoring="f1")
print("cv f1:", scores.mean())

model.fit(X_tr, y_tr)
pred = model.predict(X_te)
print(classification_report(y_te, pred))
print("AUC:", roc_auc_score(y_te, model.predict_proba(X_te)[:, 1]))</code></pre>
<div class="callout"><span class="badge">Accuracy lies</span> On 99% negative data, "always negative" scores 99%. Report precision, recall and F1 — never accuracy alone.</div>`,
    `<span class="eyebrow">DAM311 · Chương 6 · Bài 6.1</span>
<h2>Đánh giá phân lớp</h2>
<h3>Ma trận nhầm lẫn</h3>
<p>Mỗi dự đoán là một True/False Positive/Negative. Từ bốn con số đó ra các độ đo quan trọng:</p>
<ul>
<li><strong>Accuracy (độ chính xác)</strong> = đúng / tổng — dễ đánh lừa trên dữ liệu mất cân bằng.</li>
<li><strong>Precision</strong> = TP / (TP + FP) — trong những cái ta báo dương, bao nhiêu đúng.</li>
<li><strong>Recall</strong> = TP / (TP + FN) — trong các dương thật, ta bắt được bao nhiêu.</li>
<li><strong>F1</strong> = trung bình điều hoà của precision và recall — một con số cân bằng.</li>
</ul>
<h3>ROC / AUC và kiểm chứng chéo</h3>
<p><strong>Đường ROC</strong> vẽ tỉ lệ dương-thật theo dương-giả khi ngưỡng thay đổi; <strong>AUC</strong> (diện tích dưới đường) chấm mô hình từ 0.5 (ngẫu nhiên) tới 1.0 (hoàn hảo). <strong>Kiểm chứng chéo k-fold</strong> xoay tập test k lần cho ước lượng ổn định thay vì một lần chia may rủi.</p>
<h3>Quá khớp (overfitting)</h3>
<p>Mô hình quá khớp học thuộc cả nhiễu: train cao, test thấp. Chống bằng thêm dữ liệu, mô hình đơn giản hơn, chính quy hoá, tỉa cây, và kiểm chứng trung thực.</p>
<pre><code class="language-python">from sklearn.model_selection import cross_val_score
from sklearn.metrics import classification_report, roc_auc_score

scores = cross_val_score(model, X, y, cv=5, scoring="f1")
print("cv f1:", scores.mean())

model.fit(X_tr, y_tr)
pred = model.predict(X_te)
print(classification_report(y_te, pred))
print("AUC:", roc_auc_score(y_te, model.predict_proba(X_te)[:, 1]))</code></pre>
<div class="callout"><span class="badge">Accuracy nói dối</span> Trên dữ liệu 99% âm, "luôn đoán âm" đạt 99%. Hãy báo precision, recall và F1 — đừng bao giờ chỉ accuracy.</div>`,
  ]]);

const c6q = quiz('dam311-quiz-6', 'Quiz 6 — Evaluation|||Quiz 6 — Đánh giá', [
  { id: 'q1', question: 'Recall đo điều gì?|||Recall measures?', options: ['Trong cái báo dương, bao nhiêu đúng|||Of flagged positives, how many correct', 'Trong dương thật, bắt được bao nhiêu|||Of real positives, how many caught', 'Tổng số dự đoán đúng|||Total correct predictions', 'Diện tích dưới ROC|||Area under ROC'], correctIndex: 1, explanation: 'Recall = TP/(TP+FN): tỉ lệ dương thật được mô hình phát hiện.' },
  { id: 'q2', question: 'Vì sao dùng k-fold cross-validation?|||Why use k-fold cross-validation?', options: ['Để train nhanh hơn|||To train faster', 'Ước lượng ổn định, không phụ thuộc một lần chia|||A stable estimate, not one lucky split', 'Để bỏ tập test|||To skip the test set', 'Để tăng số đặc trưng|||To add features'], correctIndex: 1, explanation: 'Xoay tập test k lần cho ước lượng ít may rủi hơn một lần chia đơn.' },
  { id: 'q3', question: 'Dấu hiệu overfitting là?|||A sign of overfitting is?', options: ['Train thấp, test thấp|||Low train, low test', 'Train cao, test thấp|||High train, low test', 'Train thấp, test cao|||Low train, high test', 'AUC bằng 1 trên test|||AUC = 1 on test'], correctIndex: 1, explanation: 'Quá khớp: học thuộc nhiễu → train cao nhưng test tụt.' },
]);

const c7 = doc('dam311-7-1-clustering', '7.1 — Clustering: k-means, hierarchical, DBSCAN|||7.1 — Phân cụm: k-means, phân cấp, DBSCAN',
  'Phân cụm không giám sát; k-means (centroid, chọn k qua elbow/silhouette), phân cấp (dendrogram), DBSCAN (mật độ); code scikit-learn.',
  [[
    `<span class="eyebrow">DAM311 · Chapter 7 · Lesson 7.1</span>
<h2>Clustering: k-means, hierarchical, DBSCAN</h2>
<p class="lead"><strong>Clustering</strong> is unsupervised: group similar records with no labels, so the groups themselves are the discovery.</p>
<h3>Three approaches</h3>
<ul>
<li><strong>k-means</strong> — pick k centroids, assign each point to the nearest, recompute centroids, repeat. Fast; you must choose k and it assumes round, similar-sized clusters.</li>
<li><strong>Hierarchical</strong> — merge (or split) clusters step by step into a <em>dendrogram</em>; cut it at the height you want. No k up front.</li>
<li><strong>DBSCAN</strong> — grow clusters by density; points in sparse regions become <em>noise</em>. Finds arbitrary shapes and outliers, needs no k.</li>
</ul>
<h3>Choosing k</h3>
<p>The <strong>elbow method</strong> plots within-cluster error vs. k and looks for the bend; the <strong>silhouette score</strong> rates how tight and separated the clusters are.</p>
<pre><code class="language-python">from sklearn.cluster import KMeans, DBSCAN
from sklearn.metrics import silhouette_score

km = KMeans(n_clusters=3, n_init=10, random_state=42).fit(X)
print("k-means silhouette:", silhouette_score(X, km.labels_))

db = DBSCAN(eps=0.5, min_samples=5).fit(X)
print("DBSCAN clusters:", len(set(db.labels_)) - (1 if -1 in db.labels_ else 0))</code></pre>
<div class="callout"><span class="badge">No single right answer</span> Clustering is exploratory — different algorithms and parameters give different, all-valid groupings. Validate with a silhouette score and with domain sense.</div>`,
    `<span class="eyebrow">DAM311 · Chương 7 · Bài 7.1</span>
<h2>Phân cụm: k-means, phân cấp, DBSCAN</h2>
<p class="lead"><strong>Phân cụm</strong> là học không giám sát: gom bản ghi giống nhau khi không có nhãn, nên chính các nhóm là phát hiện.</p>
<h3>Ba hướng tiếp cận</h3>
<ul>
<li><strong>k-means</strong> — chọn k tâm cụm, gán mỗi điểm về tâm gần nhất, tính lại tâm, lặp. Nhanh; phải chọn k và giả định cụm tròn, cỡ tương đương.</li>
<li><strong>Phân cấp (hierarchical)</strong> — gộp (hoặc tách) cụm từng bước thành <em>dendrogram</em>; cắt ở độ cao mong muốn. Không cần k trước.</li>
<li><strong>DBSCAN</strong> — nở cụm theo mật độ; điểm ở vùng thưa thành <em>nhiễu</em>. Tìm được hình dạng bất kỳ và ngoại lai, không cần k.</li>
</ul>
<h3>Chọn k</h3>
<p><strong>Phương pháp khuỷu tay (elbow)</strong> vẽ sai số trong cụm theo k và tìm chỗ gãy; <strong>điểm silhouette</strong> chấm mức chặt và tách của các cụm.</p>
<pre><code class="language-python">from sklearn.cluster import KMeans, DBSCAN
from sklearn.metrics import silhouette_score

km = KMeans(n_clusters=3, n_init=10, random_state=42).fit(X)
print("k-means silhouette:", silhouette_score(X, km.labels_))

db = DBSCAN(eps=0.5, min_samples=5).fit(X)
print("DBSCAN clusters:", len(set(db.labels_)) - (1 if -1 in db.labels_ else 0))</code></pre>
<div class="callout"><span class="badge">Không có đáp án duy nhất</span> Phân cụm là khám phá — thuật toán và tham số khác nhau cho nhóm khác nhau, đều hợp lệ. Kiểm bằng điểm silhouette và bằng hiểu biết lĩnh vực.</div>`,
  ]]);

const c7q = quiz('dam311-quiz-7', 'Quiz 7 — Clustering|||Quiz 7 — Phân cụm', [
  { id: 'q1', question: 'Thuật toán phân cụm KHÔNG cần chọn k trước và tìm được ngoại lai là?|||The clustering method needing no preset k and finding outliers is?', options: ['k-means', 'DBSCAN', 'Naive Bayes', 'Apriori'], correctIndex: 1, explanation: 'DBSCAN nở cụm theo mật độ, đánh dấu điểm thưa là nhiễu, không cần k.' },
  { id: 'q2', question: 'Phương pháp khuỷu tay (elbow) dùng để?|||The elbow method is used to?', options: ['Chọn số cụm k|||Choose the number of clusters k', 'Chuẩn hoá dữ liệu|||Standardize data', 'Tính lift|||Compute lift', 'Chọn độ đo khoảng cách|||Pick a distance measure'], correctIndex: 0, explanation: 'Elbow vẽ sai số trong cụm theo k và tìm chỗ gãy để chọn k.' },
  { id: 'q3', question: 'Giả định của k-means về hình dạng cụm là?|||k-means assumes clusters are?', options: ['Bất kỳ hình dạng nào|||Any shape', 'Tròn và cỡ tương đương|||Round and similar-sized', 'Luôn có nhiễu|||Always noisy', 'Chỉ một cụm|||A single cluster'], correctIndex: 1, explanation: 'k-means dựa trên khoảng cách tới tâm nên hợp với cụm tròn, cỡ đều.' },
]);

const c8 = doc('dam311-8-1-advanced', '8.1 — Advanced topics & ethics|||8.1 — Nâng cao & đạo đức',
  'Ensemble (bagging/boosting/random forest), phát hiện bất thường, đạo đức khai phá dữ liệu (riêng tư, thiên lệch), ứng dụng thực tế.',
  [[
    `<span class="eyebrow">DAM311 · Chapter 8 · Lesson 8.1</span>
<h2>Advanced topics &amp; ethics</h2>
<h3>Ensemble methods</h3>
<p>Combine many models to beat any single one:</p>
<ul>
<li><strong>Bagging / Random Forest</strong> — many trees on bootstrap samples, then vote. Lowers variance, very robust.</li>
<li><strong>Boosting</strong> (AdaBoost, Gradient Boosting) — trees added in sequence, each fixing the last errors. Often top accuracy.</li>
</ul>
<h3>Anomaly detection</h3>
<p>Spot the rare record that does not fit — fraud, intrusion, defects. Methods: statistical thresholds, distance / density (DBSCAN noise, Local Outlier Factor), and <strong>Isolation Forest</strong>.</p>
<h3>Ethics of data mining</h3>
<ul>
<li><strong>Privacy</strong> — mining personal data needs consent, anonymization, and a lawful basis.</li>
<li><strong>Bias &amp; fairness</strong> — a model trained on biased history repeats that bias; audit outcomes across groups.</li>
<li><strong>Transparency</strong> — people affected by a decision deserve an explanation of it.</li>
</ul>
<pre><code class="language-python">from sklearn.ensemble import RandomForestClassifier, IsolationForest

rf = RandomForestClassifier(n_estimators=300, random_state=42).fit(X_tr, y_tr)
print("forest accuracy:", rf.score(X_te, y_te))

iso = IsolationForest(contamination=0.02, random_state=42).fit(X)
outliers = (iso.predict(X) == -1).sum()
print("anomalies flagged:", outliers)</code></pre>
<div class="callout"><span class="badge">Just because you can</span> A model can be accurate and still be unjust. Legality, consent and fairness are part of the job, not an afterthought.</div>`,
    `<span class="eyebrow">DAM311 · Chương 8 · Bài 8.1</span>
<h2>Nâng cao &amp; đạo đức</h2>
<h3>Phương pháp ensemble</h3>
<p>Kết hợp nhiều mô hình để thắng bất kỳ mô hình đơn lẻ nào:</p>
<ul>
<li><strong>Bagging / Random Forest</strong> — nhiều cây trên mẫu bootstrap rồi biểu quyết. Giảm variance, rất bền.</li>
<li><strong>Boosting</strong> (AdaBoost, Gradient Boosting) — cây thêm tuần tự, cây sau sửa lỗi cây trước. Thường cho accuracy hàng đầu.</li>
</ul>
<h3>Phát hiện bất thường</h3>
<p>Tìm bản ghi hiếm không khớp — gian lận, xâm nhập, lỗi sản phẩm. Phương pháp: ngưỡng thống kê, khoảng cách / mật độ (nhiễu DBSCAN, Local Outlier Factor), và <strong>Isolation Forest</strong>.</p>
<h3>Đạo đức khai phá dữ liệu</h3>
<ul>
<li><strong>Quyền riêng tư</strong> — khai phá dữ liệu cá nhân cần đồng thuận, ẩn danh và cơ sở pháp lý.</li>
<li><strong>Thiên lệch &amp; công bằng</strong> — mô hình học từ lịch sử thiên lệch sẽ lặp lại thiên lệch đó; hãy soi kết quả theo từng nhóm.</li>
<li><strong>Minh bạch</strong> — người bị một quyết định tác động xứng đáng được giải thích về nó.</li>
</ul>
<pre><code class="language-python">from sklearn.ensemble import RandomForestClassifier, IsolationForest

rf = RandomForestClassifier(n_estimators=300, random_state=42).fit(X_tr, y_tr)
print("forest accuracy:", rf.score(X_te, y_te))

iso = IsolationForest(contamination=0.02, random_state=42).fit(X)
outliers = (iso.predict(X) == -1).sum()
print("anomalies flagged:", outliers)</code></pre>
<div class="callout"><span class="badge">Làm được không có nghĩa nên làm</span> Một mô hình có thể chính xác mà vẫn bất công. Tính hợp pháp, đồng thuận và công bằng là một phần của công việc, không phải chuyện phụ.</div>`,
  ]]);

const c8q = quiz('dam311-quiz-8', 'Quiz 8 — Advanced & ethics|||Quiz 8 — Nâng cao & đạo đức', [
  { id: 'q1', question: 'Random Forest cải thiện cây đơn nhờ?|||Random Forest improves a single tree by?', options: ['Dùng một cây rất sâu|||Using one very deep tree', 'Nhiều cây trên mẫu bootstrap rồi biểu quyết|||Many trees on bootstrap samples, then voting', 'Bỏ tiền xử lý|||Skipping preprocessing', 'Tăng số lớp|||Adding classes'], correctIndex: 1, explanation: 'Bagging: nhiều cây trên mẫu bootstrap, biểu quyết → giảm variance, bền hơn.' },
  { id: 'q2', question: 'Isolation Forest chủ yếu dùng cho?|||Isolation Forest is mainly for?', options: ['Phân cụm|||Clustering', 'Phát hiện bất thường|||Anomaly detection', 'Luật kết hợp|||Association rules', 'Chuẩn hoá|||Standardization'], correctIndex: 1, explanation: 'Isolation Forest cô lập điểm hiếm nhanh, phù hợp phát hiện bất thường/gian lận.' },
  { id: 'q3', question: 'Rủi ro đạo đức khi mô hình học từ dữ liệu lịch sử thiên lệch là?|||The ethical risk of training on biased history is?', options: ['Chạy chậm hơn|||It runs slower', 'Mô hình lặp lại và khuếch đại thiên lệch|||The model repeats and amplifies the bias', 'Mất giá trị thiếu|||It loses missing values', 'Tăng support|||It raises support'], correctIndex: 1, explanation: 'Mô hình học từ lịch sử thiên lệch sẽ tái tạo bất công đó — phải soi công bằng theo nhóm.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'DAM311',
    slug: 'dam311-data-mining-i',
    title: 'Data mining I',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DAM311.webp',
    shortDescription: 'Data mining in Python — the KDD process, preprocessing, EDA, association rules (Apriori, FP-Growth), classification (tree, Naive Bayes, kNN), evaluation (ROC, cross-validation), clustering (k-means, DBSCAN) & ethics.|||Khai phá dữ liệu bằng Python — quy trình KDD, tiền xử lý, EDA, luật kết hợp (Apriori, FP-Growth), phân lớp (cây, Naive Bayes, kNN), đánh giá (ROC, kiểm chứng chéo), phân cụm (k-means, DBSCAN) & đạo đức.',
    description: 'Môn <strong>DAM311 — Data Mining I (Khai phá dữ liệu I)</strong> thuộc ngành Khoa học Máy tính, kỳ 4. Từ <strong>khai phá dữ liệu là gì &amp; quy trình KDD</strong> → <strong>tiền xử lý</strong> (làm sạch, tích hợp, biến đổi, thu giảm) → <strong>khám phá &amp; đo khoảng cách</strong> → <strong>luật kết hợp</strong> (Apriori, FP-Growth) → <strong>phân lớp</strong> (cây quyết định, Naive Bayes, kNN) → <strong>đánh giá</strong> (ma trận nhầm lẫn, ROC, kiểm chứng chéo) → <strong>phân cụm</strong> (k-means, DBSCAN) → <strong>nâng cao &amp; đạo đức</strong> (ensemble, phát hiện bất thường). Bám giáo trình chuẩn Han và Tan, song ngữ, có code Python + scikit-learn chạy được và quiz mỗi chương.',
    whatYouLearn: 'Quy trình KDD và các loại nhiệm vụ; tiền xử lý (điền thiếu, chuẩn hoá Z-score, PCA); EDA và độ đo Euclid/Manhattan/Cosine; luật kết hợp (support/confidence/lift, Apriori, FP-Growth); phân lớp (cây quyết định, Naive Bayes, kNN); đánh giá (accuracy/precision/recall/F1, ROC/AUC, cross-validation, chống overfitting); phân cụm (k-means, phân cấp, DBSCAN, chọn k); ensemble (random forest, boosting); phát hiện bất thường; đạo đức và ứng dụng thực tế. Thực hành bằng Python + scikit-learn.',
    requirements: 'Biết lập trình Python cơ bản và toán/thống kê phổ thông (trung bình, xác suất). Nên cài Python với pandas, scikit-learn và matplotlib (hoặc dùng Google Colab).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Han & Tan, scikit-learn, Kaggle Learn, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Khai phá dữ liệu, dữ liệu tới tri thức, quy trình KDD.', lessons: [intro] },
    { title: 'Chương 1 — Data mining & KDD|||Chapter 1 — Data mining & KDD', description: 'Data mining là gì, quy trình KDD, loại nhiệm vụ, ứng dụng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tiền xử lý|||Chapter 2 — Preprocessing', description: 'Làm sạch, tích hợp, biến đổi, thu giảm.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Khám phá & khoảng cách|||Chapter 3 — Exploration & distance', description: 'EDA, thống kê mô tả, đo tương tự/khoảng cách.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Luật kết hợp|||Chapter 4 — Association rules', description: 'Support/confidence/lift, Apriori, FP-Growth.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân lớp|||Chapter 5 — Classification', description: 'Cây quyết định, Naive Bayes, kNN (có code).', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đánh giá phân lớp|||Chapter 6 — Evaluation', description: 'Confusion matrix, precision/recall/F1, ROC, cross-validation.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phân cụm|||Chapter 7 — Clustering', description: 'k-means, phân cấp, DBSCAN (có code).', lessons: [c7, c7q] },
    { title: 'Chương 8 — Nâng cao & đạo đức|||Chapter 8 — Advanced & ethics', description: 'Ensemble, phát hiện bất thường, đạo đức, ứng dụng.', lessons: [c8, c8q] },
  ],
};
