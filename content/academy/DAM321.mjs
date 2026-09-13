/**
 * DAM321 — Data Mining II (Khai phá dữ liệu II, nâng cao). Ngành Khoa học Máy tính FPTU.
 * NỐI TIẾP DAM311 (Data Mining I). Khung chất lượng, song ngữ VI+EN, 8 chương + tài liệu + giới thiệu.
 * Giáo trình chuẩn: Han, Kamber &amp; Pei "Data Mining: Concepts and Techniques";
 * Aggarwal "Data Mining: The Textbook"; Tan, Steinbach &amp; Kumar "Introduction to Data Mining".
 * Code: Python + scikit-learn + XGBoost.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ lồng; & -> &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dam321-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu nâng cao: Han, Aggarwal, Tan, scikit-learn, XGBoost, Kaggle, YouTube, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">DAM321 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead"><strong>Data Mining II</strong> continues <strong>DAM311</strong>: from the KDD basics into the advanced predictive engine room — feature engineering, ensembles &amp; boosting, SVM, neural networks, text &amp; graph mining, and production. The official FPTU slides live on <strong>FLM</strong>; below are free, legal, runnable Python resources.</p>
<h3>📘 Textbooks (the standards)</h3>
<ul>
<li><a href="https://hanj.cs.illinois.edu/bk3/" target="_blank" rel="noopener">Han, Kamber &amp; Pei — <em>Data Mining: Concepts and Techniques</em></a> (concepts &amp; algorithms).</li>
<li><a href="https://www.charuaggarwal.net/Data-Mining.htm" target="_blank" rel="noopener">Aggarwal — <em>Data Mining: The Textbook</em></a> (rigorous, advanced coverage).</li>
<li><a href="https://www-users.cse.umn.edu/~kumar001/dmbook/index.php" target="_blank" rel="noopener">Tan, Steinbach &amp; Kumar — <em>Introduction to Data Mining</em></a> (clear, example-driven).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn User Guide</a> — the toolkit used throughout.</li>
<li><a href="https://xgboost.readthedocs.io/" target="_blank" rel="noopener">XGBoost documentation</a> — the gradient-boosting workhorse (Chapter 3).</li>
</ul>
<h3>🎓 Interactive practice</h3>
<ul>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a> — feature engineering, intermediate ML, model explainability.</li>
<li><a href="https://archive.ics.uci.edu/" target="_blank" rel="noopener">UCI Machine Learning Repository</a> — classic datasets to mine.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — boosting, SVM and neural nets explained clearly.</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — the maths behind neural networks.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Prepare</strong> — recap the KDD pipeline, then engineer &amp; select features that actually help.</li>
<li><strong>Ensemble</strong> — trees, Random Forest, bagging, then boosting (AdaBoost, Gradient Boosting, XGBoost).</li>
<li><strong>Model</strong> — SVM &amp; kernels, and a first neural network (MLP, backpropagation).</li>
<li><strong>Apply</strong> — mine sequences &amp; text, graphs &amp; recommenders, then ship on big data with ethics in mind.</li>
</ol></div>`,
    `<span class="eyebrow">DAM321 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead"><strong>Khai phá dữ liệu II</strong> nối tiếp <strong>DAM311</strong>: từ nền KDD bước vào phòng máy dự đoán nâng cao — feature engineering, ensemble &amp; boosting, SVM, mạng nơ-ron, khai phá văn bản &amp; đồ thị, và triển khai. Slide chính thức FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, chạy được bằng Python.</p>
<h3>📘 Giáo trình (các cuốn chuẩn)</h3>
<ul>
<li><a href="https://hanj.cs.illinois.edu/bk3/" target="_blank" rel="noopener">Han, Kamber &amp; Pei — <em>Data Mining: Concepts and Techniques</em></a> (khái niệm &amp; thuật toán).</li>
<li><a href="https://www.charuaggarwal.net/Data-Mining.htm" target="_blank" rel="noopener">Aggarwal — <em>Data Mining: The Textbook</em></a> (chặt chẽ, mức nâng cao).</li>
<li><a href="https://www-users.cse.umn.edu/~kumar001/dmbook/index.php" target="_blank" rel="noopener">Tan, Steinbach &amp; Kumar — <em>Introduction to Data Mining</em></a> (dễ đọc, nhiều ví dụ).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn User Guide</a> — bộ công cụ dùng xuyên suốt môn.</li>
<li><a href="https://xgboost.readthedocs.io/" target="_blank" rel="noopener">XGBoost documentation</a> — công cụ gradient boosting chủ lực (Chương 3).</li>
</ul>
<h3>🎓 Luyện tập tương tác</h3>
<ul>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a> — feature engineering, ML trung cấp, giải thích mô hình.</li>
<li><a href="https://archive.ics.uci.edu/" target="_blank" rel="noopener">UCI Machine Learning Repository</a> — kho dữ liệu kinh điển để khai phá.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — giảng boosting, SVM và mạng nơ-ron rõ ràng.</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — toán học đằng sau mạng nơ-ron.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Chuẩn bị</strong> — ôn quy trình KDD, rồi tạo &amp; chọn đặc trưng thực sự có ích.</li>
<li><strong>Ensemble</strong> — cây, Random Forest, bagging, rồi boosting (AdaBoost, Gradient Boosting, XGBoost).</li>
<li><strong>Mô hình hoá</strong> — SVM &amp; kernel, và mạng nơ-ron đầu tiên (MLP, lan truyền ngược).</li>
<li><strong>Ứng dụng</strong> — khai phá chuỗi &amp; văn bản, đồ thị &amp; khuyến nghị, rồi triển khai trên dữ liệu lớn kèm đạo đức.</li>
</ol></div>`,
  ]]);

const intro = doc('dam321-0-1-overview', 'Course overview: from DAM311 to advanced mining|||Tổng quan: từ DAM311 tới khai phá nâng cao',
  'Nhắc nền DAM311; DAM321 đi sâu vào feature engineering, ensemble/boosting, SVM, mạng nơ-ron, text/graph, triển khai; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">DAM321 · Lesson 0.1 · Overview</span>
<h2>From Data Mining I to advanced mining</h2>
<p class="lead"><strong>DAM311</strong> built the foundation — the <strong>KDD process</strong>, preprocessing, association rules, the first classifiers (tree, Naive Bayes, kNN), honest evaluation, and clustering. <strong>DAM321</strong> assumes all of that and pushes into the methods that win real predictive problems.</p>
<h3>What is new here</h3>
<ul>
<li><strong>Better features</strong> — engineer and select the inputs, not just the model.</li>
<li><strong>Ensembles &amp; boosting</strong> — Random Forest, AdaBoost, Gradient Boosting, XGBoost.</li>
<li><strong>Powerful learners</strong> — Support Vector Machines with kernels, and neural networks.</li>
<li><strong>New data shapes</strong> — sequences, text, graphs, and recommendation.</li>
<li><strong>Production</strong> — big data, streaming, MLOps and ethics.</li>
</ul>
<h3>The mindset</h3>
<pre><code>DAM311: can I mine this data at all?
DAM321: which model wins, why, and can I ship it responsibly?</code></pre>
<h3>Roadmap</h3>
<p>Pipeline &amp; feature engineering → trees &amp; Random Forest → boosting &amp; XGBoost → SVM &amp; kernels → neural networks → sequence &amp; text mining → graphs &amp; recommenders → big data, streaming &amp; ethics. Bilingual, with runnable Python + scikit-learn and a quiz per chapter.</p>`,
    `<span class="eyebrow">DAM321 · Bài 0.1 · Tổng quan</span>
<h2>Từ Khai phá dữ liệu I tới khai phá nâng cao</h2>
<p class="lead"><strong>DAM311</strong> đã dựng nền — <strong>quy trình KDD</strong>, tiền xử lý, luật kết hợp, các bộ phân lớp đầu tiên (cây, Naive Bayes, kNN), đánh giá trung thực và phân cụm. <strong>DAM321</strong> mặc định bạn đã nắm hết và tiến vào các phương pháp thắng bài toán dự đoán thật.</p>
<h3>Điểm mới ở môn này</h3>
<ul>
<li><strong>Đặc trưng tốt hơn</strong> — tạo và chọn đầu vào, không chỉ chọn mô hình.</li>
<li><strong>Ensemble &amp; boosting</strong> — Random Forest, AdaBoost, Gradient Boosting, XGBoost.</li>
<li><strong>Bộ học mạnh</strong> — máy vector hỗ trợ (SVM) với kernel, và mạng nơ-ron.</li>
<li><strong>Dạng dữ liệu mới</strong> — chuỗi, văn bản, đồ thị và khuyến nghị.</li>
<li><strong>Triển khai</strong> — dữ liệu lớn, streaming, MLOps và đạo đức.</li>
</ul>
<h3>Tư duy</h3>
<pre><code>DAM311: dữ liệu này có khai phá được không?
DAM321: mô hình nào thắng, vì sao, và triển khai có trách nhiệm được không?</code></pre>
<h3>Lộ trình</h3>
<p>Pipeline &amp; feature engineering → cây &amp; Random Forest → boosting &amp; XGBoost → SVM &amp; kernel → mạng nơ-ron → khai phá chuỗi &amp; văn bản → đồ thị &amp; khuyến nghị → dữ liệu lớn, streaming &amp; đạo đức. Song ngữ, có Python + scikit-learn chạy được và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('dam321-1-1-pipeline', '1.1 — Advanced pipeline & feature engineering|||1.1 — Pipeline nâng cao & feature engineering',
  'Ôn KDD; feature engineering (tạo đặc trưng, mã hoá, tương tác); feature selection (filter/wrapper/embedded); scikit-learn Pipeline.',
  [[
    `<span class="eyebrow">DAM321 · Chapter 1 · Lesson 1.1</span>
<h2>Advanced pipeline &amp; feature engineering</h2>
<h3>KDD, recapped</h3>
<p>Select → preprocess → transform → <strong>mine</strong> → evaluate. In DAM321 the transform step grows a whole discipline of its own: <strong>feature engineering</strong>. The right features beat a fancier model almost every time.</p>
<h3>Feature engineering</h3>
<ul>
<li><strong>Create</strong> — ratios, date parts, aggregates, text length, domain formulas.</li>
<li><strong>Encode</strong> — one-hot for nominal, ordinal for ordered, target encoding for high cardinality.</li>
<li><strong>Interact</strong> — products or bins of two features that matter together.</li>
</ul>
<h3>Feature selection</h3>
<ul>
<li><strong>Filter</strong> — score each feature alone (chi-square, mutual information); fast, model-free.</li>
<li><strong>Wrapper</strong> — search subsets with a model in the loop (recursive feature elimination); accurate but costly.</li>
<li><strong>Embedded</strong> — selection built into training (L1 / Lasso, tree importances).</li>
</ul>
<pre><code class="language-python">from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import SelectKBest, mutual_info_classif
from sklearn.ensemble import RandomForestClassifier

pipe = Pipeline([
    ("scale", StandardScaler()),
    ("select", SelectKBest(mutual_info_classif, k=10)),
    ("model", RandomForestClassifier(n_estimators=200, random_state=42)),
])
pipe.fit(X_tr, y_tr)
print("test accuracy:", pipe.score(X_te, y_te))</code></pre>
<div class="callout"><span class="badge">Fit inside the pipeline</span> Put scaling and selection INSIDE the Pipeline so they are re-fit on each cross-validation fold. Selecting features on the full data before splitting leaks the target and inflates scores.</div>`,
    `<span class="eyebrow">DAM321 · Chương 1 · Bài 1.1</span>
<h2>Pipeline nâng cao &amp; feature engineering</h2>
<h3>Ôn lại KDD</h3>
<p>Chọn → tiền xử lý → biến đổi → <strong>khai phá</strong> → đánh giá. Ở DAM321 bước biến đổi trở thành một ngành riêng: <strong>feature engineering</strong>. Đặc trưng đúng gần như luôn thắng một mô hình cầu kỳ hơn.</p>
<h3>Feature engineering (tạo đặc trưng)</h3>
<ul>
<li><strong>Tạo mới</strong> — tỉ số, thành phần ngày tháng, giá trị gộp, độ dài văn bản, công thức lĩnh vực.</li>
<li><strong>Mã hoá</strong> — one-hot cho biến định danh, ordinal cho biến có thứ tự, target encoding cho biến nhiều mức.</li>
<li><strong>Tương tác</strong> — tích hoặc chia khoảng của hai đặc trưng có ý nghĩa khi đi cùng nhau.</li>
</ul>
<h3>Feature selection (chọn đặc trưng)</h3>
<ul>
<li><strong>Filter</strong> — chấm từng đặc trưng riêng (chi-square, thông tin tương hỗ); nhanh, không cần mô hình.</li>
<li><strong>Wrapper</strong> — tìm tập con với mô hình trong vòng lặp (loại đặc trưng đệ quy); chính xác nhưng tốn.</li>
<li><strong>Embedded</strong> — chọn ngay trong lúc huấn luyện (L1 / Lasso, độ quan trọng của cây).</li>
</ul>
<pre><code class="language-python">from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import SelectKBest, mutual_info_classif
from sklearn.ensemble import RandomForestClassifier

pipe = Pipeline([
    ("scale", StandardScaler()),
    ("select", SelectKBest(mutual_info_classif, k=10)),
    ("model", RandomForestClassifier(n_estimators=200, random_state=42)),
])
pipe.fit(X_tr, y_tr)
print("test accuracy:", pipe.score(X_te, y_te))</code></pre>
<div class="callout"><span class="badge">Fit trong pipeline</span> Đặt chuẩn hoá và chọn đặc trưng BÊN TRONG Pipeline để chúng được fit lại trên mỗi fold kiểm chứng chéo. Chọn đặc trưng trên toàn dữ liệu trước khi chia sẽ rò rỉ nhãn và thổi phồng điểm.</div>`,
  ]]);

const c1q = quiz('dam321-quiz-1', 'Quiz 1 — Pipeline & feature engineering|||Quiz 1 — Pipeline & feature engineering', [
  { id: 'q1', question: 'Phương pháp chọn đặc trưng nào tích hợp NGAY trong lúc huấn luyện?|||Which feature-selection family is built INTO training?', options: ['Filter', 'Wrapper', 'Embedded (L1/Lasso)|||Embedded (L1/Lasso)', 'Không có|||None'], correctIndex: 2, explanation: 'Embedded: chọn đặc trưng diễn ra trong lúc học, ví dụ L1/Lasso hay độ quan trọng của cây.' },
  { id: 'q2', question: 'Vì sao đặt chọn đặc trưng BÊN TRONG Pipeline?|||Why put feature selection INSIDE the Pipeline?', options: ['Cho code ngắn|||Shorter code', 'Để fit lại trên mỗi fold, tránh rò rỉ nhãn|||To re-fit per fold and avoid target leakage', 'Để chạy chậm hơn|||To run slower', 'Không có lý do|||No reason'], correctIndex: 1, explanation: 'Chọn đặc trưng trên toàn dữ liệu trước khi chia sẽ rò rỉ thông tin nhãn và thổi phồng đánh giá.' },
  { id: 'q3', question: 'Mã hoá nào phù hợp biến định danh có ÍT mức?|||Which encoding suits a nominal feature with FEW levels?', options: ['One-hot', 'Chuẩn hoá Z-score|||Z-score', 'Lấy log|||Log transform', 'PCA'], correctIndex: 0, explanation: 'One-hot tạo cột nhị phân cho từng mức — hợp với biến định danh ít mức.' },
]);

const c2 = doc('dam321-2-1-trees-forest', '2.1 — Decision trees & ensembles|||2.1 — Cây quyết định & ensemble',
  'Cây quyết định sâu (impurity, tỉa, quá khớp); bagging (bootstrap + vote); Random Forest (feature subsampling); code scikit-learn.',
  [[
    `<span class="eyebrow">DAM321 · Chapter 2 · Lesson 2.1</span>
<h2>Decision trees &amp; ensembles</h2>
<h3>The tree, in depth</h3>
<p>A tree splits on the feature that most reduces <strong>impurity</strong> (Gini or entropy). Left unpruned it grows until each leaf is pure — memorizing noise. Control it with <code>max_depth</code>, <code>min_samples_leaf</code>, or post-pruning. A single tree is readable but <strong>high variance</strong>: small data changes flip its structure.</p>
<h3>Bagging</h3>
<p><strong>Bagging</strong> (bootstrap aggregating) trains many trees on random samples drawn <em>with replacement</em>, then averages or votes. Averaging independent, high-variance models cancels their errors — variance drops, bias stays.</p>
<h3>Random Forest</h3>
<p><strong>Random Forest</strong> is bagging plus one twist: at each split it considers only a <em>random subset of features</em>. That decorrelates the trees so their errors overlap less, and it gives a free <strong>feature importance</strong> ranking.</p>
<pre><code class="language-python">from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import BaggingClassifier, RandomForestClassifier

tree = DecisionTreeClassifier(max_depth=4).fit(X_tr, y_tr)
print("tree :", tree.score(X_te, y_te))

bag = BaggingClassifier(DecisionTreeClassifier(), n_estimators=200,
                        random_state=42).fit(X_tr, y_tr)
print("bag  :", bag.score(X_te, y_te))

rf = RandomForestClassifier(n_estimators=300, max_features="sqrt",
                            random_state=42).fit(X_tr, y_tr)
print("forest:", rf.score(X_te, y_te))
print("top feature:", X.columns[rf.feature_importances_.argmax()])</code></pre>
<div class="callout"><span class="badge">Why the forest wins</span> One tree overfits; a forest of decorrelated trees averages that variance away. More trees never hurt accuracy — they only cost time.</div>`,
    `<span class="eyebrow">DAM321 · Chương 2 · Bài 2.1</span>
<h2>Cây quyết định &amp; ensemble</h2>
<h3>Cây quyết định, đào sâu</h3>
<p>Cây tách theo đặc trưng làm giảm <strong>độ vẩn (impurity)</strong> nhiều nhất (Gini hoặc entropy). Không tỉa thì nó lớn tới khi mỗi lá thuần — học thuộc cả nhiễu. Kiểm soát bằng <code>max_depth</code>, <code>min_samples_leaf</code> hoặc tỉa sau. Một cây dễ đọc nhưng <strong>variance cao</strong>: dữ liệu đổi chút là cấu trúc lật.</p>
<h3>Bagging</h3>
<p><strong>Bagging</strong> (bootstrap aggregating) huấn luyện nhiều cây trên mẫu rút <em>có hoàn lại</em>, rồi lấy trung bình hoặc biểu quyết. Trung bình các mô hình variance cao và độc lập triệt tiêu sai số của nhau — variance giảm, bias giữ nguyên.</p>
<h3>Random Forest</h3>
<p><strong>Random Forest</strong> là bagging cộng một mẹo: mỗi lần tách chỉ xét một <em>tập con ngẫu nhiên của đặc trưng</em>. Nhờ đó các cây bớt tương quan, sai số ít trùng nhau, và cho sẵn một bảng <strong>độ quan trọng đặc trưng</strong>.</p>
<pre><code class="language-python">from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import BaggingClassifier, RandomForestClassifier

tree = DecisionTreeClassifier(max_depth=4).fit(X_tr, y_tr)
print("tree :", tree.score(X_te, y_te))

bag = BaggingClassifier(DecisionTreeClassifier(), n_estimators=200,
                        random_state=42).fit(X_tr, y_tr)
print("bag  :", bag.score(X_te, y_te))

rf = RandomForestClassifier(n_estimators=300, max_features="sqrt",
                            random_state=42).fit(X_tr, y_tr)
print("forest:", rf.score(X_te, y_te))
print("top feature:", X.columns[rf.feature_importances_.argmax()])</code></pre>
<div class="callout"><span class="badge">Vì sao rừng thắng</span> Một cây quá khớp; một rừng cây ít tương quan trung bình bớt variance đó đi. Thêm cây không hại accuracy — chỉ tốn thời gian.</div>`,
  ]]);

const c2q = quiz('dam321-quiz-2', 'Quiz 2 — Trees & ensembles|||Quiz 2 — Cây & ensemble', [
  { id: 'q1', question: 'Bagging làm giảm chủ yếu thành phần lỗi nào?|||Bagging mainly reduces which error component?', options: ['Bias', 'Variance', 'Nhiễu không thể giảm|||Irreducible noise', 'Support'], correctIndex: 1, explanation: 'Trung bình nhiều mô hình variance cao và độc lập làm giảm variance, bias gần như giữ nguyên.' },
  { id: 'q2', question: 'Điểm khác biệt CỐT LÕI của Random Forest so với bagging cây là?|||The KEY difference of Random Forest vs. bagged trees is?', options: ['Chỉ xét tập con đặc trưng ngẫu nhiên mỗi lần tách|||Random feature subset at each split', 'Dùng một cây duy nhất|||Uses a single tree', 'Bỏ bootstrap|||Drops bootstrapping', 'Không biểu quyết|||No voting'], correctIndex: 0, explanation: 'Random Forest lấy mẫu con đặc trưng ở mỗi split để giảm tương quan giữa các cây.' },
  { id: 'q3', question: 'Cây quyết định đơn không tỉa thường bị?|||A single unpruned decision tree tends to?', options: ['Thiếu khớp|||Underfit', 'Quá khớp, variance cao|||Overfit, high variance', 'Bỏ qua nhiễu|||Ignore noise', 'Luôn thắng rừng|||Always beat a forest'], correctIndex: 1, explanation: 'Cây mọc tới lá thuần sẽ học thuộc nhiễu — quá khớp, variance cao.' },
]);

const c3 = doc('dam321-3-1-boosting', '3.1 — Boosting: AdaBoost, Gradient Boosting, XGBoost|||3.1 — Boosting: AdaBoost, Gradient Boosting, XGBoost',
  'Boosting tuần tự sửa lỗi; AdaBoost (trọng số mẫu); Gradient Boosting (khớp gradient/residual); XGBoost (regularized, nhanh); code.',
  [[
    `<span class="eyebrow">DAM321 · Chapter 3 · Lesson 3.1</span>
<h2>Boosting: AdaBoost, Gradient Boosting, XGBoost</h2>
<p class="lead">Bagging builds trees in <em>parallel</em>; <strong>boosting</strong> builds them in <em>sequence</em>, each new model fixing what the last got wrong. It lowers bias and often reaches the top accuracy on tabular data.</p>
<h3>AdaBoost</h3>
<p><strong>AdaBoost</strong> re-weights the training rows: after each weak tree, misclassified rows get heavier so the next tree focuses on them. The final prediction is a weighted vote of all the weak learners.</p>
<h3>Gradient Boosting</h3>
<p><strong>Gradient Boosting</strong> is more general: each new tree fits the <em>negative gradient</em> of the loss — for squared error that is simply the <strong>residuals</strong> (what is still wrong). Trees are added with a small <em>learning rate</em> so the ensemble improves slowly and stably.</p>
<h3>XGBoost</h3>
<p><strong>XGBoost</strong> is gradient boosting engineered for speed and generalization: <em>L1/L2 regularization</em>, second-order gradients, column subsampling, and built-in handling of missing values.</p>
<pre><code class="language-python">from sklearn.ensemble import AdaBoostClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier

ada = AdaBoostClassifier(n_estimators=200, random_state=42).fit(X_tr, y_tr)
gbc = GradientBoostingClassifier(learning_rate=0.1, n_estimators=200,
                                 max_depth=3).fit(X_tr, y_tr)
xgb = XGBClassifier(n_estimators=300, learning_rate=0.1, max_depth=4,
                    subsample=0.8, reg_lambda=1.0).fit(X_tr, y_tr)

for name, m in [("ada", ada), ("gbc", gbc), ("xgb", xgb)]:
    print(name, m.score(X_te, y_te))</code></pre>
<div class="callout"><span class="badge">Boost slowly</span> A small learning rate with many trees beats a large rate with few. Watch a validation score and stop early — boosting CAN overfit if you keep adding trees past the sweet spot.</div>`,
    `<span class="eyebrow">DAM321 · Chương 3 · Bài 3.1</span>
<h2>Boosting: AdaBoost, Gradient Boosting, XGBoost</h2>
<p class="lead">Bagging dựng cây <em>song song</em>; <strong>boosting</strong> dựng <em>tuần tự</em>, mỗi mô hình mới sửa chỗ mô hình trước sai. Nó giảm bias và thường đạt accuracy hàng đầu trên dữ liệu bảng.</p>
<h3>AdaBoost</h3>
<p><strong>AdaBoost</strong> đánh lại trọng số cho các dòng: sau mỗi cây yếu, dòng bị phân sai nặng hơn để cây sau tập trung vào chúng. Dự đoán cuối là biểu quyết có trọng số của tất cả bộ học yếu.</p>
<h3>Gradient Boosting</h3>
<p><strong>Gradient Boosting</strong> tổng quát hơn: mỗi cây mới khớp <em>gradient âm</em> của hàm mất — với sai số bình phương thì đó chính là <strong>phần dư (residual)</strong> (những gì còn sai). Cây được thêm với <em>learning rate</em> nhỏ để ensemble tiến chậm mà ổn định.</p>
<h3>XGBoost</h3>
<p><strong>XGBoost</strong> là gradient boosting được tối ưu cho tốc độ và khả năng khái quát: <em>chính quy hoá L1/L2</em>, gradient bậc hai, lấy mẫu con theo cột, và tự xử lý giá trị thiếu.</p>
<pre><code class="language-python">from sklearn.ensemble import AdaBoostClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier

ada = AdaBoostClassifier(n_estimators=200, random_state=42).fit(X_tr, y_tr)
gbc = GradientBoostingClassifier(learning_rate=0.1, n_estimators=200,
                                 max_depth=3).fit(X_tr, y_tr)
xgb = XGBClassifier(n_estimators=300, learning_rate=0.1, max_depth=4,
                    subsample=0.8, reg_lambda=1.0).fit(X_tr, y_tr)

for name, m in [("ada", ada), ("gbc", gbc), ("xgb", xgb)]:
    print(name, m.score(X_te, y_te))</code></pre>
<div class="callout"><span class="badge">Boost chậm thôi</span> Learning rate nhỏ với nhiều cây thắng learning rate lớn với ít cây. Theo dõi điểm kiểm chứng và dừng sớm — boosting CÓ THỂ quá khớp nếu cứ thêm cây quá điểm tối ưu.</div>`,
  ]]);

const c3q = quiz('dam321-quiz-3', 'Quiz 3 — Boosting|||Quiz 3 — Boosting', [
  { id: 'q1', question: 'Khác biệt cơ bản giữa boosting và bagging là?|||The core difference between boosting and bagging is?', options: ['Boosting dựng cây tuần tự, mỗi cây sửa lỗi cây trước|||Boosting builds trees sequentially, each fixing the last', 'Boosting bỏ cây quyết định|||Boosting drops decision trees', 'Bagging tuần tự còn boosting song song|||Bagging is sequential, boosting parallel', 'Cả hai giống hệt nhau|||They are identical'], correctIndex: 0, explanation: 'Bagging song song và độc lập; boosting tuần tự, mỗi mô hình tập trung vào lỗi còn lại.' },
  { id: 'q2', question: 'Trong Gradient Boosting (sai số bình phương), cây mới khớp cái gì?|||In Gradient Boosting (squared error), each new tree fits?', options: ['Nhãn gốc|||The original labels', 'Phần dư / gradient âm của hàm mất|||The residuals / negative gradient', 'Trọng số mẫu|||Sample weights', 'Số cụm|||Cluster count'], correctIndex: 1, explanation: 'Mỗi cây khớp gradient âm của loss; với squared error đó là phần dư còn lại.' },
  { id: 'q3', question: 'XGBoost thêm gì so với gradient boosting cơ bản?|||XGBoost adds what over plain gradient boosting?', options: ['Chính quy hoá L1/L2 và tối ưu tốc độ|||L1/L2 regularization and speed optimizations', 'Bỏ hoàn toàn cây|||No trees at all', 'Chỉ chạy trên ảnh|||Only runs on images', 'Không cần dữ liệu|||Needs no data'], correctIndex: 0, explanation: 'XGBoost bổ sung chính quy hoá, gradient bậc hai, lấy mẫu cột và xử lý giá trị thiếu, chạy rất nhanh.' },
]);

const c4 = doc('dam321-4-1-svm', '4.1 — SVM & kernel methods|||4.1 — SVM & phương pháp kernel',
  'SVM tìm siêu phẳng lề cực đại; support vectors; soft margin (C); kernel trick (RBF, poly) cho dữ liệu phi tuyến; code scikit-learn.',
  [[
    `<span class="eyebrow">DAM321 · Chapter 4 · Lesson 4.1</span>
<h2>SVM &amp; kernel methods</h2>
<h3>Maximum-margin idea</h3>
<p>A <strong>Support Vector Machine</strong> draws the decision boundary that leaves the <em>widest gap</em> between classes. Only the closest points — the <strong>support vectors</strong> — define that boundary; the rest do not matter. A wide margin generalizes better.</p>
<h3>Soft margin</h3>
<p>Real data overlaps, so SVM allows some violations, controlled by <strong>C</strong>: small C = wider margin, more tolerance (more bias); large C = fewer errors, narrower margin (more variance).</p>
<h3>The kernel trick</h3>
<p>When classes are not linearly separable, a <strong>kernel</strong> maps them into a higher-dimensional space where they are — <em>without</em> computing that space explicitly. The <strong>RBF</strong> kernel handles smooth curved boundaries; <strong>polynomial</strong> fits interaction-shaped ones.</p>
<pre><code class="language-python">from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

lin = make_pipeline(StandardScaler(), SVC(kernel="linear", C=1.0))
rbf = make_pipeline(StandardScaler(), SVC(kernel="rbf", C=10, gamma="scale"))

lin.fit(X_tr, y_tr); rbf.fit(X_tr, y_tr)
print("linear:", lin.score(X_te, y_te))
print("rbf   :", rbf.score(X_te, y_te))</code></pre>
<div class="callout"><span class="badge">Always scale for SVM</span> SVM measures distances to the margin, so standardize features first. And tune C and gamma together with cross-validation — they trade off bias and variance.</div>`,
    `<span class="eyebrow">DAM321 · Chương 4 · Bài 4.1</span>
<h2>SVM &amp; phương pháp kernel</h2>
<h3>Ý tưởng lề cực đại</h3>
<p><strong>Máy vector hỗ trợ (SVM)</strong> vẽ ranh giới quyết định chừa <em>khe rộng nhất</em> giữa các lớp. Chỉ những điểm gần nhất — các <strong>vector hỗ trợ</strong> — định nghĩa ranh giới đó; phần còn lại không ảnh hưởng. Lề rộng thì khái quát tốt hơn.</p>
<h3>Lề mềm (soft margin)</h3>
<p>Dữ liệu thật chồng lấn, nên SVM cho phép vi phạm ít, điều khiển bằng <strong>C</strong>: C nhỏ = lề rộng, dung thứ nhiều (bias cao); C lớn = ít lỗi, lề hẹp (variance cao).</p>
<h3>Mẹo kernel (kernel trick)</h3>
<p>Khi các lớp không tách tuyến tính, một <strong>kernel</strong> ánh xạ chúng lên không gian nhiều chiều hơn nơi chúng tách được — mà <em>không</em> tính tường minh không gian đó. Kernel <strong>RBF</strong> xử lý ranh giới cong mượt; <strong>đa thức (polynomial)</strong> hợp ranh giới dạng tương tác.</p>
<pre><code class="language-python">from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

lin = make_pipeline(StandardScaler(), SVC(kernel="linear", C=1.0))
rbf = make_pipeline(StandardScaler(), SVC(kernel="rbf", C=10, gamma="scale"))

lin.fit(X_tr, y_tr); rbf.fit(X_tr, y_tr)
print("linear:", lin.score(X_te, y_te))
print("rbf   :", rbf.score(X_te, y_te))</code></pre>
<div class="callout"><span class="badge">Luôn chuẩn hoá cho SVM</span> SVM đo khoảng cách tới lề, nên hãy chuẩn hoá đặc trưng trước. Và dò C cùng gamma bằng kiểm chứng chéo — chúng đánh đổi bias và variance.</div>`,
  ]]);

const c4q = quiz('dam321-quiz-4', 'Quiz 4 — SVM & kernels|||Quiz 4 — SVM & kernel', [
  { id: 'q1', question: 'Điểm nào định nghĩa ranh giới của SVM?|||Which points define the SVM boundary?', options: ['Mọi điểm dữ liệu|||Every data point', 'Các vector hỗ trợ (điểm gần lề nhất)|||The support vectors (points nearest the margin)', 'Chỉ tâm cụm|||Only cluster centroids', 'Các điểm ngoại lai xa nhất|||The farthest outliers'], correctIndex: 1, explanation: 'Chỉ các support vector gần lề nhất quyết định siêu phẳng; điểm khác không ảnh hưởng.' },
  { id: 'q2', question: 'Tham số C nhỏ trong SVM nghĩa là?|||A small C in SVM means?', options: ['Lề rộng, dung thứ nhiều, bias cao hơn|||Wider margin, more tolerance, more bias', 'Lề hẹp, không lỗi|||Narrow margin, zero errors', 'Không dùng kernel|||No kernel', 'Bỏ chuẩn hoá|||No scaling'], correctIndex: 0, explanation: 'C nhỏ cho lề rộng và cho phép nhiều vi phạm hơn → bias cao, variance thấp.' },
  { id: 'q3', question: 'Mẹo kernel cho phép SVM làm gì?|||The kernel trick lets an SVM?', options: ['Tách phi tuyến mà không tính tường minh không gian mới|||Separate non-linearly without explicitly computing the new space', 'Chạy không cần dữ liệu|||Run without data', 'Bỏ qua support vectors|||Ignore support vectors', 'Chỉ phân cụm|||Only cluster'], correctIndex: 0, explanation: 'Kernel tính tích vô hướng ở không gian cao chiều ngầm, giúp tách phi tuyến mà không dựng không gian đó.' },
]);

const c5 = doc('dam321-5-1-neural-nets', '5.1 — Neural networks & deep learning intro|||5.1 — Mạng nơ-ron & học sâu nhập môn',
  'Nơ-ron nhân tạo, MLP nhiều lớp, hàm kích hoạt phi tuyến, lan truyền ngược (backpropagation) tổng quan, gradient descent; code MLP.',
  [[
    `<span class="eyebrow">DAM321 · Chapter 5 · Lesson 5.1</span>
<h2>Neural networks &amp; deep learning intro</h2>
<h3>The artificial neuron</h3>
<p>A neuron computes a weighted sum of its inputs plus a bias, then passes it through a non-linear <strong>activation</strong> (ReLU, sigmoid, tanh). Stack neurons into layers and you get a <strong>multi-layer perceptron (MLP)</strong>: input → one or more hidden layers → output.</p>
<h3>Why non-linearity matters</h3>
<p>Without an activation function, stacked layers collapse into a single linear map. The non-linearity is what lets a network learn curved, complex decision boundaries no linear model can.</p>
<h3>How it learns: backpropagation</h3>
<p>Training is <strong>gradient descent</strong>: a forward pass makes a prediction, a loss measures the error, then <strong>backpropagation</strong> uses the chain rule to send that error backward and compute each weight gradient. Weights step opposite the gradient; repeat over many epochs.</p>
<pre><code class="language-python">from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

mlp = make_pipeline(
    StandardScaler(),
    MLPClassifier(hidden_layer_sizes=(64, 32), activation="relu",
                  max_iter=300, random_state=42),
)
mlp.fit(X_tr, y_tr)
print("MLP accuracy:", mlp.score(X_te, y_te))</code></pre>
<div class="callout"><span class="badge">Neural nets are hungry</span> They need scaled inputs, enough data, and tuning (layers, width, learning rate). On small tabular data a boosted-tree model often still wins — reach for deep learning when data is large or unstructured (images, text, audio).</div>`,
    `<span class="eyebrow">DAM321 · Chương 5 · Bài 5.1</span>
<h2>Mạng nơ-ron &amp; học sâu nhập môn</h2>
<h3>Nơ-ron nhân tạo</h3>
<p>Một nơ-ron tính tổng có trọng số của đầu vào cộng một bias, rồi cho qua một <strong>hàm kích hoạt</strong> phi tuyến (ReLU, sigmoid, tanh). Xếp nơ-ron thành lớp ta có <strong>perceptron nhiều lớp (MLP)</strong>: đầu vào → một hoặc nhiều lớp ẩn → đầu ra.</p>
<h3>Vì sao cần phi tuyến</h3>
<p>Không có hàm kích hoạt, các lớp chồng lên nhau co lại thành một ánh xạ tuyến tính duy nhất. Chính phi tuyến giúp mạng học được ranh giới cong, phức tạp mà mô hình tuyến tính không làm được.</p>
<h3>Học thế nào: lan truyền ngược</h3>
<p>Huấn luyện là <strong>gradient descent</strong>: lượt tiến (forward) đưa ra dự đoán, hàm mất đo sai số, rồi <strong>lan truyền ngược (backpropagation)</strong> dùng quy tắc chuỗi để đẩy sai số ngược lại và tính gradient từng trọng số. Trọng số bước ngược hướng gradient; lặp qua nhiều epoch.</p>
<pre><code class="language-python">from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

mlp = make_pipeline(
    StandardScaler(),
    MLPClassifier(hidden_layer_sizes=(64, 32), activation="relu",
                  max_iter=300, random_state=42),
)
mlp.fit(X_tr, y_tr)
print("MLP accuracy:", mlp.score(X_te, y_te))</code></pre>
<div class="callout"><span class="badge">Mạng nơ-ron rất "đói"</span> Chúng cần đầu vào đã chuẩn hoá, đủ dữ liệu và tinh chỉnh (số lớp, độ rộng, learning rate). Trên dữ liệu bảng nhỏ, mô hình cây boosting thường vẫn thắng — dùng học sâu khi dữ liệu lớn hoặc phi cấu trúc (ảnh, văn bản, âm thanh).</div>`,
  ]]);

const c5q = quiz('dam321-quiz-5', 'Quiz 5 — Neural networks|||Quiz 5 — Mạng nơ-ron', [
  { id: 'q1', question: 'Nếu bỏ hàm kích hoạt phi tuyến, MLP nhiều lớp trở thành?|||Without a non-linear activation, a deep MLP becomes?', options: ['Một ánh xạ tuyến tính duy nhất|||A single linear map', 'Một cây quyết định|||A decision tree', 'Một bộ phân cụm|||A clustering model', 'Mạnh hơn nhiều|||Much more powerful'], correctIndex: 0, explanation: 'Chồng các lớp tuyến tính vẫn là tuyến tính; phi tuyến mới tạo ra sức mạnh của mạng.' },
  { id: 'q2', question: 'Backpropagation làm gì?|||Backpropagation does what?', options: ['Đẩy sai số ngược lại để tính gradient từng trọng số|||Sends error backward to compute each weight gradient', 'Chọn số cụm|||Chooses cluster count', 'Chuẩn hoá dữ liệu|||Standardizes data', 'Tính support và lift|||Computes support and lift'], correctIndex: 0, explanation: 'Lan truyền ngược dùng quy tắc chuỗi tính gradient các trọng số để gradient descent cập nhật.' },
  { id: 'q3', question: 'Khi nào học sâu thường ĐÁNG dùng hơn cây boosting?|||When is deep learning usually worth it over boosted trees?', options: ['Dữ liệu bảng nhỏ|||Small tabular data', 'Dữ liệu lớn hoặc phi cấu trúc (ảnh, văn bản)|||Large or unstructured data (images, text)', 'Khi không có dữ liệu|||When there is no data', 'Khi cần mô hình dễ đọc nhất|||When maximum interpretability is needed'], correctIndex: 1, explanation: 'Học sâu tỏa sáng trên dữ liệu lớn/phi cấu trúc; dữ liệu bảng nhỏ thì boosting thường vẫn thắng.' },
]);

const c6 = doc('dam321-6-1-sequence-text', '6.1 — Sequence & text mining|||6.1 — Khai phá chuỗi & văn bản',
  'Khai phá mẫu chuỗi (sequential pattern, GSP/PrefixSpan); text mining; TF-IDF nâng cao (n-gram, sublinear); phân lớp văn bản; code.',
  [[
    `<span class="eyebrow">DAM321 · Chapter 6 · Lesson 6.1</span>
<h2>Sequence &amp; text mining</h2>
<h3>Sequential pattern mining</h3>
<p>Association rules ignore order; <strong>sequential patterns</strong> keep it. Given ordered events per customer, we mine frequent <em>ordered</em> subsequences — "bought a phone, then a case, then earbuds". Algorithms like <strong>GSP</strong> and <strong>PrefixSpan</strong> extend Apriori-style support counting to sequences.</p>
<h3>Text mining &amp; TF-IDF</h3>
<p>Text becomes numbers with <strong>TF-IDF</strong>: a term is weighted up when it is frequent in a document (TF) but rare across the corpus (IDF), so common words fade and distinctive ones stand out.</p>
<h3>Going further</h3>
<ul>
<li><strong>N-grams</strong> — pairs/triples of words capture short phrases ("not good").</li>
<li><strong>Sublinear TF</strong> — dampen very frequent terms with a log.</li>
<li><strong>Cosine similarity</strong> on TF-IDF vectors measures document closeness (search, clustering).</li>
</ul>
<pre><code class="language-python">from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

clf = make_pipeline(
    TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, min_df=3,
                    stop_words="english"),
    LogisticRegression(max_iter=1000),
)
clf.fit(train_texts, train_labels)
print("text accuracy:", clf.score(test_texts, test_labels))</code></pre>
<div class="callout"><span class="badge">Order is information</span> Flatten a sequence into a bag of items and you throw away "what came after what". Choose sequence mining when the ORDER of events is the signal you care about.</div>`,
    `<span class="eyebrow">DAM321 · Chương 6 · Bài 6.1</span>
<h2>Khai phá chuỗi &amp; văn bản</h2>
<h3>Khai phá mẫu chuỗi</h3>
<p>Luật kết hợp bỏ qua thứ tự; <strong>mẫu chuỗi (sequential pattern)</strong> giữ lại nó. Với các sự kiện có thứ tự theo từng khách, ta khai phá các chuỗi con <em>có thứ tự</em> thường gặp — "mua điện thoại, rồi ốp lưng, rồi tai nghe". Các thuật toán như <strong>GSP</strong> và <strong>PrefixSpan</strong> mở rộng lối đếm support kiểu Apriori sang chuỗi.</p>
<h3>Khai phá văn bản &amp; TF-IDF</h3>
<p>Văn bản thành số nhờ <strong>TF-IDF</strong>: một từ được đánh nặng khi nó xuất hiện nhiều trong một tài liệu (TF) nhưng hiếm trong toàn kho (IDF), nên từ phổ biến mờ đi còn từ đặc trưng nổi lên.</p>
<h3>Đi xa hơn</h3>
<ul>
<li><strong>N-gram</strong> — cặp/bộ ba từ bắt được cụm ngắn ("not good").</li>
<li><strong>Sublinear TF</strong> — hãm bớt từ quá dày bằng log.</li>
<li><strong>Độ tương tự cosine</strong> trên vector TF-IDF đo độ gần tài liệu (tìm kiếm, phân cụm).</li>
</ul>
<pre><code class="language-python">from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

clf = make_pipeline(
    TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, min_df=3,
                    stop_words="english"),
    LogisticRegression(max_iter=1000),
)
clf.fit(train_texts, train_labels)
print("text accuracy:", clf.score(test_texts, test_labels))</code></pre>
<div class="callout"><span class="badge">Thứ tự là thông tin</span> Ép một chuỗi thành túi mục là vứt đi "cái gì đến sau cái gì". Chọn khai phá chuỗi khi THỨ TỰ sự kiện chính là tín hiệu bạn cần.</div>`,
  ]]);

const c6q = quiz('dam321-quiz-6', 'Quiz 6 — Sequence & text|||Quiz 6 — Chuỗi & văn bản', [
  { id: 'q1', question: 'Khai phá mẫu chuỗi khác luật kết hợp ở chỗ?|||Sequential pattern mining differs from association rules by?', options: ['Giữ lại THỨ TỰ của các sự kiện|||Keeping the ORDER of events', 'Bỏ qua thứ tự|||Ignoring order', 'Chỉ chạy trên số|||Only running on numbers', 'Không cần support|||Needing no support'], correctIndex: 0, explanation: 'Mẫu chuỗi khai phá chuỗi con CÓ thứ tự; luật kết hợp coi giỏ hàng không thứ tự.' },
  { id: 'q2', question: 'Trong TF-IDF, một từ được đánh nặng khi?|||In TF-IDF, a term is weighted up when?', options: ['Nhiều trong một tài liệu nhưng hiếm trong toàn kho|||Frequent in a document but rare across the corpus', 'Xuất hiện ở mọi tài liệu|||It appears in every document', 'Chỉ xuất hiện một lần toàn kho|||It appears once in the whole corpus', 'Là stop word|||It is a stop word'], correctIndex: 0, explanation: 'TF cao và IDF cao (hiếm toàn kho) → từ đặc trưng được đánh trọng số lớn.' },
  { id: 'q3', question: 'Dùng ngram_range=(1, 2) trong TfidfVectorizer để?|||Setting ngram_range=(1, 2) in TfidfVectorizer does what?', options: ['Thêm cặp từ liền kề (bigram) ngoài từ đơn|||Add adjacent word pairs (bigrams) besides single words', 'Bỏ mọi từ|||Drop all words', 'Chuẩn hoá số|||Standardize numbers', 'Giảm còn một từ|||Keep only one word'], correctIndex: 0, explanation: 'ngram_range=(1, 2) lấy cả unigram và bigram, bắt được cụm ngắn như "not good".' },
]);

const c7 = doc('dam321-7-1-graph-recsys', '7.1 — Graph mining & recommender systems|||7.1 — Khai phá đồ thị & hệ khuyến nghị',
  'Khai phá đồ thị (node/edge, đo trung tâm, PageRank, cộng đồng); hệ khuyến nghị; lọc cộng tác (user-based/item-based); code.',
  [[
    `<span class="eyebrow">DAM321 · Chapter 7 · Lesson 7.1</span>
<h2>Graph mining &amp; recommender systems</h2>
<h3>Mining graphs</h3>
<p>Many data are <strong>networks</strong>: users and friendships, pages and links, products co-purchased. A graph is <em>nodes</em> joined by <em>edges</em>. We mine them with <strong>centrality</strong> (who is important — degree, betweenness, <strong>PageRank</strong>), <strong>community detection</strong> (natural clusters), and <strong>link prediction</strong> (which edge appears next).</p>
<h3>Recommender systems</h3>
<ul>
<li><strong>Content-based</strong> — recommend items similar to what a user liked, using item features.</li>
<li><strong>Collaborative filtering</strong> — use the crowd: "users like you also liked...", from the user-item rating matrix alone.</li>
</ul>
<h3>Collaborative filtering</h3>
<p><strong>User-based</strong> finds people with similar taste and borrows their ratings; <strong>item-based</strong> recommends items similar to ones you rated highly. Both rest on a similarity (often cosine) over the sparse rating matrix.</p>
<pre><code class="language-python">import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# rows = users, columns = items, values = ratings (0 = unseen)
sim = cosine_similarity(ratings)          # user-user similarity
scores = sim.dot(ratings) / (np.abs(sim).sum(axis=1, keepdims=True) + 1e-9)
scores[ratings &gt; 0] = -np.inf            # do not re-recommend seen items
top = np.argsort(-scores, axis=1)[:, :5]  # top-5 items per user
print(top[0])</code></pre>
<div class="callout"><span class="badge">Cold start</span> Collaborative filtering has no signal for a brand-new user or item — no ratings yet. Fall back to content features or popularity until enough interactions accumulate.</div>`,
    `<span class="eyebrow">DAM321 · Chương 7 · Bài 7.1</span>
<h2>Khai phá đồ thị &amp; hệ khuyến nghị</h2>
<h3>Khai phá đồ thị</h3>
<p>Nhiều dữ liệu là <strong>mạng lưới</strong>: người dùng và kết bạn, trang và liên kết, sản phẩm mua cùng nhau. Đồ thị gồm <em>nút (node)</em> nối bằng <em>cạnh (edge)</em>. Ta khai phá bằng <strong>độ trung tâm</strong> (ai quan trọng — bậc, trung gian, <strong>PageRank</strong>), <strong>phát hiện cộng đồng</strong> (cụm tự nhiên), và <strong>dự đoán liên kết</strong> (cạnh nào xuất hiện tiếp).</p>
<h3>Hệ khuyến nghị</h3>
<ul>
<li><strong>Theo nội dung (content-based)</strong> — gợi ý mục giống thứ người dùng đã thích, dựa trên đặc trưng mục.</li>
<li><strong>Lọc cộng tác (collaborative filtering)</strong> — dùng đám đông: "người giống bạn cũng thích...", chỉ từ ma trận đánh giá người-mục.</li>
</ul>
<h3>Lọc cộng tác</h3>
<p><strong>Theo người dùng (user-based)</strong> tìm người có gu tương tự và mượn đánh giá của họ; <strong>theo mục (item-based)</strong> gợi ý mục giống thứ bạn chấm cao. Cả hai dựa trên độ tương tự (thường là cosine) trên ma trận đánh giá thưa.</p>
<pre><code class="language-python">import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# dòng = người dùng, cột = mục, giá trị = đánh giá (0 = chưa xem)
sim = cosine_similarity(ratings)          # tương tự người-người
scores = sim.dot(ratings) / (np.abs(sim).sum(axis=1, keepdims=True) + 1e-9)
scores[ratings &gt; 0] = -np.inf            # không gợi lại mục đã xem
top = np.argsort(-scores, axis=1)[:, :5]  # top-5 mục mỗi người
print(top[0])</code></pre>
<div class="callout"><span class="badge">Khởi động nguội (cold start)</span> Lọc cộng tác không có tín hiệu cho người dùng hoặc mục hoàn toàn mới — chưa có đánh giá nào. Hãy lùi về đặc trưng nội dung hoặc độ phổ biến cho tới khi đủ tương tác.</div>`,
  ]]);

const c7q = quiz('dam321-quiz-7', 'Quiz 7 — Graphs & recommenders|||Quiz 7 — Đồ thị & khuyến nghị', [
  { id: 'q1', question: 'PageRank là một độ đo gì trên đồ thị?|||PageRank is a measure of what on a graph?', options: ['Độ trung tâm / tầm quan trọng của nút|||Centrality / importance of a node', 'Số cụm|||Number of clusters', 'Độ dài cạnh|||Edge length', 'Giá trị thiếu|||Missing values'], correctIndex: 0, explanation: 'PageRank chấm tầm quan trọng của nút theo cấu trúc liên kết — một dạng độ trung tâm.' },
  { id: 'q2', question: 'Lọc cộng tác dựa chủ yếu vào?|||Collaborative filtering relies mainly on?', options: ['Đặc trưng nội dung của mục|||Item content features', 'Ma trận đánh giá người-mục (hành vi đám đông)|||The user-item rating matrix (crowd behavior)', 'Chỉ tuổi người dùng|||Only user age', 'Màu giao diện|||UI color'], correctIndex: 1, explanation: 'Lọc cộng tác dùng chính ma trận đánh giá: người gu giống nhau gợi ý cho nhau.' },
  { id: 'q3', question: 'Vấn đề "cold start" là?|||The "cold start" problem is?', options: ['Máy chủ khởi động chậm|||A slow server boot', 'Người dùng/mục mới chưa có đánh giá nên không có tín hiệu|||A new user/item has no ratings, so no signal', 'Dữ liệu quá lớn|||Data too large', 'Cosine bằng 0|||Cosine equals zero'], correctIndex: 1, explanation: 'Không có tương tác thì lọc cộng tác không suy được gì; phải lùi về nội dung/độ phổ biến.' },
]);

const c8 = doc('dam321-8-1-bigdata-deploy', '8.1 — Big data, streaming, MLOps & ethics|||8.1 — Dữ liệu lớn, streaming, MLOps & đạo đức',
  'Khai phá dữ liệu lớn (MapReduce/Spark); học trên luồng (streaming, incremental); MLOps tổng quan (triển khai, giám sát, drift); đạo đức.',
  [[
    `<span class="eyebrow">DAM321 · Chapter 8 · Lesson 8.1</span>
<h2>Big data, streaming, MLOps &amp; ethics</h2>
<h3>Mining at scale</h3>
<p>When data will not fit on one machine, mining goes <strong>distributed</strong>: <strong>MapReduce</strong> and engines like <strong>Apache Spark (MLlib)</strong> split the work across a cluster. The algorithms are the same; the plumbing changes.</p>
<h3>Streaming &amp; incremental learning</h3>
<p>A <strong>data stream</strong> never ends and cannot be stored whole. Models learn <em>online</em>, one mini-batch at a time, with bounded memory. In scikit-learn that is <code>partial_fit</code>.</p>
<h3>MLOps in one breath</h3>
<p>Shipping a model is not the end: <strong>deploy</strong> it behind an API, <strong>monitor</strong> its live accuracy, watch for <strong>data drift</strong> (inputs shift away from training), and <strong>retrain</strong> on a schedule. Version data, code and models so any result is reproducible.</p>
<h3>Ethics, still</h3>
<ul>
<li><strong>Privacy</strong> — consent, anonymization, a lawful basis.</li>
<li><strong>Fairness</strong> — audit outcomes across groups; scale amplifies bias.</li>
<li><strong>Accountability</strong> — a person affected by an automated decision deserves an explanation.</li>
</ul>
<pre><code class="language-python">import numpy as np
from sklearn.linear_model import SGDClassifier

model = SGDClassifier(loss="log_loss")
classes = np.array([0, 1])
for X_batch, y_batch in stream_batches():     # arrives over time
    model.partial_fit(X_batch, y_batch, classes=classes)
print("learned online, bounded memory")</code></pre>
<div class="callout"><span class="badge">The model decays</span> A deployed model silently rots as the world drifts from its training data. "Ship and forget" is the real failure mode — monitoring and retraining are part of the job, not extras.</div>`,
    `<span class="eyebrow">DAM321 · Chương 8 · Bài 8.1</span>
<h2>Dữ liệu lớn, streaming, MLOps &amp; đạo đức</h2>
<h3>Khai phá ở quy mô lớn</h3>
<p>Khi dữ liệu không vừa một máy, khai phá chuyển sang <strong>phân tán</strong>: <strong>MapReduce</strong> và các engine như <strong>Apache Spark (MLlib)</strong> chia việc ra cả cụm máy. Thuật toán vẫn thế; phần đường ống thay đổi.</p>
<h3>Học trên luồng &amp; tăng dần</h3>
<p>Một <strong>luồng dữ liệu</strong> không bao giờ kết thúc và không thể lưu trọn. Mô hình học <em>trực tuyến (online)</em>, từng mini-batch, với bộ nhớ giới hạn. Trong scikit-learn đó là <code>partial_fit</code>.</p>
<h3>MLOps gói gọn</h3>
<p>Đưa mô hình ra chưa phải là hết: <strong>triển khai</strong> sau một API, <strong>giám sát</strong> accuracy khi chạy thật, canh <strong>trôi dữ liệu (data drift)</strong> (đầu vào lệch dần khỏi lúc huấn luyện), và <strong>huấn luyện lại</strong> theo lịch. Đánh phiên bản dữ liệu, mã và mô hình để mọi kết quả tái lập được.</p>
<h3>Đạo đức, vẫn thế</h3>
<ul>
<li><strong>Quyền riêng tư</strong> — đồng thuận, ẩn danh, cơ sở pháp lý.</li>
<li><strong>Công bằng</strong> — soi kết quả theo từng nhóm; quy mô khuếch đại thiên lệch.</li>
<li><strong>Trách nhiệm giải trình</strong> — người bị một quyết định tự động tác động xứng đáng được giải thích.</li>
</ul>
<pre><code class="language-python">import numpy as np
from sklearn.linear_model import SGDClassifier

model = SGDClassifier(loss="log_loss")
classes = np.array([0, 1])
for X_batch, y_batch in stream_batches():     # đến dần theo thời gian
    model.partial_fit(X_batch, y_batch, classes=classes)
print("da hoc online, bo nho gioi han")</code></pre>
<div class="callout"><span class="badge">Mô hình cũng mục</span> Một mô hình đã triển khai âm thầm mục đi khi thế giới trôi khỏi dữ liệu huấn luyện. "Ship rồi quên" mới là kiểu hỏng thật — giám sát và huấn luyện lại là một phần của công việc, không phải chuyện thêm.</div>`,
  ]]);

const c8q = quiz('dam321-quiz-8', 'Quiz 8 — Big data & MLOps|||Quiz 8 — Dữ liệu lớn & MLOps', [
  { id: 'q1', question: 'Học trên luồng dữ liệu (streaming) đòi hỏi mô hình?|||Learning on a data stream requires a model that?', options: ['Nạp toàn bộ dữ liệu vào RAM|||Loads all data into RAM', 'Học tăng dần từng mini-batch, bộ nhớ giới hạn|||Learns incrementally per mini-batch, bounded memory', 'Chỉ chạy một lần|||Runs exactly once', 'Không cần nhãn|||Needs no labels'], correctIndex: 1, explanation: 'Luồng vô tận nên phải học online (partial_fit), từng batch, với bộ nhớ hữu hạn.' },
  { id: 'q2', question: '"Data drift" trong MLOps nghĩa là?|||"Data drift" in MLOps means?', options: ['Đĩa cứng bị lỗi|||A disk failure', 'Phân bố đầu vào lệch dần khỏi dữ liệu huấn luyện|||Input distribution shifts away from training data', 'Mô hình chạy nhanh hơn|||The model runs faster', 'Thiếu giá trị|||Missing values'], correctIndex: 1, explanation: 'Drift là khi dữ liệu thật lệch dần khỏi lúc train, khiến mô hình mục dần — phải giám sát và train lại.' },
  { id: 'q3', question: 'Vì sao quy mô lớn khiến đạo đức QUAN TRỌNG hơn?|||Why does scale make ethics MORE important?', options: ['Vì code chạy chậm|||Because code runs slower', 'Vì quy mô khuếch đại thiên lệch tới rất nhiều người|||Because scale amplifies bias across many people', 'Vì dữ liệu tự sạch|||Because data cleans itself', 'Vì không cần đồng thuận|||Because consent is unnecessary'], correctIndex: 1, explanation: 'Một mô hình thiên lệch chạy ở quy mô lớn tái tạo bất công cho rất nhiều người — phải audit công bằng.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'DAM321',
    slug: 'dam321-data-mining-ii',
    title: 'Data mining II',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DAM321.webp',
    shortDescription: 'Advanced data mining in Python — feature engineering, ensembles (Random Forest, boosting, XGBoost), SVM & kernels, neural networks, text & sequence mining, recommender systems, big data & ethics. Continues DAM311.|||Khai phá dữ liệu nâng cao bằng Python — feature engineering, ensemble (Random Forest, boosting, XGBoost), SVM & kernel, mạng nơ-ron, khai phá văn bản & chuỗi, hệ khuyến nghị, dữ liệu lớn & đạo đức. Nối tiếp DAM311.',
    description: 'Môn <strong>DAM321 — Data Mining II (Khai phá dữ liệu II, nâng cao)</strong> thuộc ngành Khoa học Máy tính, kỳ 5, <strong>nối tiếp DAM311</strong>. Từ <strong>pipeline &amp; feature engineering</strong> → <strong>cây quyết định &amp; ensemble</strong> (Random Forest, bagging) → <strong>boosting</strong> (AdaBoost, Gradient Boosting, XGBoost) → <strong>SVM &amp; kernel</strong> → <strong>mạng nơ-ron &amp; học sâu nhập môn</strong> → <strong>khai phá chuỗi &amp; văn bản</strong> (TF-IDF nâng cao) → <strong>khai phá đồ thị &amp; hệ khuyến nghị</strong> (lọc cộng tác) → <strong>dữ liệu lớn, streaming, MLOps &amp; đạo đức</strong>. Bám giáo trình chuẩn Han, Aggarwal và Tan, song ngữ, có code Python + scikit-learn + XGBoost chạy được và quiz mỗi chương.',
    whatYouLearn: 'Feature engineering và feature selection (filter/wrapper/embedded); cây quyết định sâu, bagging và Random Forest; boosting (AdaBoost, Gradient Boosting, XGBoost); SVM với lề cực đại và kernel trick (RBF, poly); mạng nơ-ron MLP và lan truyền ngược; khai phá mẫu chuỗi và văn bản với TF-IDF nâng cao; khai phá đồ thị (PageRank, cộng đồng) và hệ khuyến nghị (lọc cộng tác); dữ liệu lớn, học trên luồng, MLOps (triển khai, drift, retrain) và đạo đức. Thực hành bằng Python + scikit-learn + XGBoost.',
    requirements: 'Đã học DAM311 (Data Mining I) hoặc nắm quy trình KDD, tiền xử lý và phân lớp cơ bản. Biết Python và toán/thống kê phổ thông. Nên cài Python với pandas, scikit-learn, xgboost và matplotlib (hoặc dùng Google Colab).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Han, Aggarwal & Tan, scikit-learn, XGBoost, Kaggle, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp DAM311; điểm mới của khai phá nâng cao; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Pipeline & feature engineering|||Chapter 1 — Pipeline & feature engineering', description: 'Ôn KDD, tạo & chọn đặc trưng, scikit-learn Pipeline.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cây & ensemble|||Chapter 2 — Trees & ensembles', description: 'Cây quyết định sâu, bagging, Random Forest (có code).', lessons: [c2, c2q] },
    { title: 'Chương 3 — Boosting|||Chapter 3 — Boosting', description: 'AdaBoost, Gradient Boosting, XGBoost (có code).', lessons: [c3, c3q] },
    { title: 'Chương 4 — SVM & kernel|||Chapter 4 — SVM & kernels', description: 'Lề cực đại, support vectors, kernel trick (có code).', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mạng nơ-ron|||Chapter 5 — Neural networks', description: 'MLP, hàm kích hoạt, lan truyền ngược (có code).', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chuỗi & văn bản|||Chapter 6 — Sequence & text', description: 'Mẫu chuỗi, text mining, TF-IDF nâng cao (có code).', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đồ thị & khuyến nghị|||Chapter 7 — Graphs & recommenders', description: 'Khai phá đồ thị, lọc cộng tác, khuyến nghị (có code).', lessons: [c7, c7q] },
    { title: 'Chương 8 — Dữ liệu lớn & MLOps|||Chapter 8 — Big data & MLOps', description: 'Big data, streaming, MLOps, đạo đức (có code).', lessons: [c8, c8q] },
  ],
};
