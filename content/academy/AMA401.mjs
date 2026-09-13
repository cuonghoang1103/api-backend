/**
 * AMA401 — Advanced Methods for Data Analysis (Phương pháp phân tích dữ liệu
 * nâng cao). Ngành Khoa học Máy tính FPTU, kỳ 7. Sách chuẩn: Hastie/Tibshirani/
 * Friedman "The Elements of Statistical Learning" (ESL); James et al "An
 * Introduction to Statistical Learning" (ISLR); Gelman "Bayesian Data Analysis"
 * (BDA); scikit-learn/statsmodels. Song ngữ + công thức + code Python + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ama401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách chuẩn (ESL, ISLR, BDA), tài liệu scikit-learn/statsmodels, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">AMA401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>advanced data analysis</strong> — from the bias-variance tradeoff to regularized regression, resampling, unsupervised learning, time series, Bayesian inference and modern tree ensembles — in one place. The official slides live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for AMA401 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://hastie.su.domains/ElemStatLearn/" target="_blank" rel="noopener"><em>The Elements of Statistical Learning</em> — Hastie, Tibshirani &amp; Friedman (free PDF)</a></li>
<li><a href="https://www.statlearning.com/" target="_blank" rel="noopener"><em>An Introduction to Statistical Learning</em> (ISLR) — James, Witten, Hastie &amp; Tibshirani (free PDF)</a></li>
<li><a href="http://www.stat.columbia.edu/~gelman/book/" target="_blank" rel="noopener"><em>Bayesian Data Analysis</em> — Gelman et al (free PDF)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn User Guide</a> — regression, classification, resampling, clustering</li>
<li><a href="https://www.statsmodels.org/stable/index.html" target="_blank" rel="noopener">statsmodels</a> — GLM, time series (ARIMA), statistical tests</li>
<li><a href="https://www.pymc.io/welcome.html" target="_blank" rel="noopener">PyMC</a> — Bayesian modelling &amp; MCMC in Python</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — statistics &amp; machine learning, clearly explained</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — the geometry behind linear algebra &amp; probability</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://scikit-learn.org/" target="_blank" rel="noopener">scikit-learn</a> — the core estimator/pipeline library</li>
<li><a href="https://xgboost.readthedocs.io/" target="_blank" rel="noopener">XGBoost</a> — gradient boosting at scale</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — run Python notebooks in the browser, GPU included</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — revise probability, linear regression and the bias-variance tradeoff; read ISLR chapters 2 to 4.</li>
<li><strong>Practice</strong> — fit regularized regression and classifiers in scikit-learn, and validate them with cross-validation.</li>
<li><strong>Go deeper</strong> — unsupervised learning (PCA, clustering), time series (ARIMA) and Bayesian inference with PyMC.</li>
<li><strong>Job-ready</strong> — build tuned tree ensembles (Random Forest, XGBoost), read feature importance, and report honest, resampled metrics.</li>
</ol></div>`,
    `<span class="eyebrow">AMA401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>phân tích dữ liệu nâng cao</strong> — từ bias-variance tradeoff đến hồi quy chính quy hoá, resampling, học không giám sát, chuỗi thời gian, suy diễn Bayes và cây ensemble hiện đại — gom về một chỗ. Slide chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của AMA401 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://hastie.su.domains/ElemStatLearn/" target="_blank" rel="noopener"><em>The Elements of Statistical Learning</em> — Hastie, Tibshirani &amp; Friedman (PDF miễn phí)</a></li>
<li><a href="https://www.statlearning.com/" target="_blank" rel="noopener"><em>An Introduction to Statistical Learning</em> (ISLR) — James, Witten, Hastie &amp; Tibshirani (PDF miễn phí)</a></li>
<li><a href="http://www.stat.columbia.edu/~gelman/book/" target="_blank" rel="noopener"><em>Bayesian Data Analysis</em> — Gelman và cộng sự (PDF miễn phí)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn User Guide</a> — hồi quy, phân loại, resampling, clustering</li>
<li><a href="https://www.statsmodels.org/stable/index.html" target="_blank" rel="noopener">statsmodels</a> — GLM, chuỗi thời gian (ARIMA), kiểm định thống kê</li>
<li><a href="https://www.pymc.io/welcome.html" target="_blank" rel="noopener">PyMC</a> — mô hình Bayes &amp; MCMC trong Python</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — thống kê &amp; máy học giảng rõ ràng</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — hình học sau đại số tuyến tính &amp; xác suất</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://scikit-learn.org/" target="_blank" rel="noopener">scikit-learn</a> — thư viện estimator/pipeline lõi</li>
<li><a href="https://xgboost.readthedocs.io/" target="_blank" rel="noopener">XGBoost</a> — gradient boosting quy mô lớn</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — chạy notebook Python trên trình duyệt, có sẵn GPU</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — ôn xác suất, hồi quy tuyến tính và bias-variance tradeoff; đọc ISLR chương 2 đến 4.</li>
<li><strong>Luyện tập</strong> — khớp hồi quy chính quy hoá và các bộ phân loại trong scikit-learn, kiểm định bằng cross-validation.</li>
<li><strong>Đào sâu</strong> — học không giám sát (PCA, clustering), chuỗi thời gian (ARIMA) và suy diễn Bayes với PyMC.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng cây ensemble đã tinh chỉnh (Random Forest, XGBoost), đọc feature importance, và báo cáo chỉ số trung thực qua resampling.</li>
</ol></div>`,
  ]]);

const intro = doc('ama401-0-1-overview', 'Course overview: Advanced methods for data analysis|||Tổng quan: Phương pháp phân tích dữ liệu nâng cao',
  'Môn học làm gì; vị trí sau thống kê/DS cơ bản; ba trục lớn (giám sát, không giám sát, Bayes); lộ trình 8 chương với công cụ scikit-learn/statsmodels.',
  [[
    `<span class="eyebrow">AMA401 · Lesson 0.1 · Overview</span>
<h2>Advanced Methods for Data Analysis</h2>
<p class="lead">This course sits <strong>after</strong> introductory statistics and data science. You already know means, variances and a straight-line fit; here you learn the methods a working data scientist actually reaches for — and, just as important, <strong>how to tell whether a model is any good</strong>.</p>
<h3>Three big themes</h3>
<ul>
<li><strong>Supervised learning</strong> — predict a target from features: advanced regression (Ridge, Lasso, GLM) and classification (logistic, LDA/QDA).</li>
<li><strong>Honest evaluation</strong> — resampling (cross-validation, the bootstrap) so your reported accuracy is not a lucky split.</li>
<li><strong>Structure &amp; uncertainty</strong> — unsupervised learning (PCA, clustering), time series (ARIMA), and the Bayesian view where every unknown carries a distribution.</li>
</ul>
<h3>The one idea that unifies it all</h3>
<p>Every method trades <strong>bias against variance</strong>. A too-simple model underfits (high bias); a too-flexible one memorises noise (high variance). The whole toolkit — regularization, resampling, ensembles — exists to place you at the sweet spot.</p>
<h3>Roadmap</h3>
<p>Advanced review &amp; model selection → regression → classification → resampling → unsupervised learning → time series → Bayesian statistics → tree models &amp; ensembles. Bilingual, with formulas, runnable Python (scikit-learn, statsmodels), and a quiz per chapter.</p>`,
    `<span class="eyebrow">AMA401 · Bài 0.1 · Tổng quan</span>
<h2>Phương pháp phân tích dữ liệu nâng cao</h2>
<p class="lead">Môn này nằm <strong>sau</strong> thống kê và khoa học dữ liệu cơ bản. Bạn đã biết trung bình, phương sai và một đường khớp thẳng; ở đây bạn học những phương pháp một nhà khoa học dữ liệu thực sự dùng — và quan trọng không kém, <strong>làm sao biết một mô hình có tốt hay không</strong>.</p>
<h3>Ba chủ đề lớn</h3>
<ul>
<li><strong>Học có giám sát</strong> — dự đoán mục tiêu từ đặc trưng: hồi quy nâng cao (Ridge, Lasso, GLM) và phân loại (logistic, LDA/QDA).</li>
<li><strong>Đánh giá trung thực</strong> — resampling (cross-validation, bootstrap) để độ chính xác báo cáo không phải là một lần chia may mắn.</li>
<li><strong>Cấu trúc &amp; độ bất định</strong> — học không giám sát (PCA, clustering), chuỗi thời gian (ARIMA), và góc nhìn Bayes nơi mọi ẩn số đều mang một phân phối.</li>
</ul>
<h3>Một ý tưởng xuyên suốt</h3>
<p>Mọi phương pháp đều đánh đổi <strong>bias với variance</strong>. Mô hình quá đơn giản thì underfit (bias cao); quá linh hoạt thì nhớ luôn cả nhiễu (variance cao). Cả bộ công cụ — chính quy hoá, resampling, ensemble — tồn tại để đưa bạn tới điểm cân bằng.</p>
<h3>Lộ trình</h3>
<p>Ôn nâng cao &amp; chọn mô hình → hồi quy → phân loại → resampling → học không giám sát → chuỗi thời gian → thống kê Bayes → mô hình cây &amp; ensemble. Song ngữ, có công thức, code Python chạy được (scikit-learn, statsmodels), và một quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('ama401-1-1-foundations-bias-variance', '1.1 — Foundations, bias-variance & model selection|||1.1 — Nền tảng, bias-variance & chọn mô hình',
  'Ôn nền học có giám sát; phân rã bias-variance của sai số kỳ vọng; overfit/underfit; chọn mô hình bằng train/validation/test và tiêu chí AIC/BIC.',
  [[
    `<span class="eyebrow">AMA401 · Chapter 1 · Lesson 1.1</span>
<h2>Foundations, bias-variance &amp; model selection</h2>
<h3>The learning setup</h3>
<p>We observe pairs (x, y) and seek a function f that predicts y from x while <strong>generalising</strong> to unseen data. Fitting the training data well is easy; generalising is the hard part.</p>
<h3>The bias-variance decomposition</h3>
<p>For squared-error loss, the expected test error at a point splits into three pieces:</p>
<pre><code>E[(y - f_hat(x))^2] = Bias(f_hat)^2 + Var(f_hat) + sigma^2
  Bias^2 : error from a too-simple model (underfitting)
  Var    : sensitivity to the particular training set (overfitting)
  sigma^2: irreducible noise you can never remove
</code></pre>
<p>Increasing model flexibility lowers bias but raises variance. Test error is U-shaped in complexity — the goal is the bottom of the U.</p>
<h3>Choosing a model</h3>
<ul>
<li><strong>Hold-out split</strong> — train / validation / test, so the number you report is measured on data the model never saw.</li>
<li><strong>Information criteria</strong> — <code>AIC = 2k - 2·logL</code> and <code>BIC = k·ln(n) - 2·logL</code> reward fit but penalise the parameter count k; lower is better.</li>
</ul>
<pre><code>from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
# fit on X_train only; report the score on X_test
</code></pre>
<div class="callout"><span class="badge">Key idea</span> A model that scores perfectly on training data and poorly on test data is not a good model — it has memorised, not learned.</div>`,
    `<span class="eyebrow">AMA401 · Chương 1 · Bài 1.1</span>
<h2>Nền tảng, bias-variance &amp; chọn mô hình</h2>
<h3>Bài toán học</h3>
<p>Ta quan sát các cặp (x, y) và tìm hàm f dự đoán y từ x sao cho <strong>tổng quát hoá</strong> được cho dữ liệu chưa thấy. Khớp tốt dữ liệu huấn luyện thì dễ; tổng quát hoá mới là phần khó.</p>
<h3>Phân rã bias-variance</h3>
<p>Với hàm mất mát bình phương sai số, sai số kiểm tra kỳ vọng tại một điểm tách thành ba phần:</p>
<pre><code>E[(y - f_hat(x))^2] = Bias(f_hat)^2 + Var(f_hat) + sigma^2
  Bias^2 : sai số do mô hình quá đơn giản (underfitting)
  Var    : độ nhạy với tập huấn luyện cụ thể (overfitting)
  sigma^2: nhiễu không thể loại bỏ
</code></pre>
<p>Tăng độ linh hoạt của mô hình làm giảm bias nhưng tăng variance. Sai số kiểm tra có dạng chữ U theo độ phức tạp — mục tiêu là đáy chữ U.</p>
<h3>Chọn mô hình</h3>
<ul>
<li><strong>Chia hold-out</strong> — train / validation / test, để con số bạn báo cáo được đo trên dữ liệu mô hình chưa từng thấy.</li>
<li><strong>Tiêu chí thông tin</strong> — <code>AIC = 2k - 2·logL</code> và <code>BIC = k·ln(n) - 2·logL</code> thưởng cho độ khớp nhưng phạt số tham số k; nhỏ hơn là tốt hơn.</li>
</ul>
<pre><code>from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
# chỉ khớp trên X_train; báo cáo điểm trên X_test
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Một mô hình đạt điểm hoàn hảo trên dữ liệu huấn luyện nhưng kém trên dữ liệu kiểm tra không phải mô hình tốt — nó đã học thuộc, chứ không phải học hiểu.</div>`,
  ]]);

const c1q = quiz('ama401-quiz-1', 'Quiz 1 — Bias-variance & model selection|||Quiz 1 — Bias-variance & chọn mô hình', [
  { id: 'q1', question: 'Khi tăng độ linh hoạt (phức tạp) của mô hình, điều gì thường xảy ra?|||As model flexibility increases, what typically happens?', options: ['Bias tăng, variance giảm', 'Bias giảm, variance tăng', 'Cả bias và variance đều giảm', 'Cả hai đều không đổi'], correctIndex: 1, explanation: 'Mô hình linh hoạt hơn khớp dữ liệu sát hơn (bias giảm) nhưng nhạy hơn với tập huấn luyện (variance tăng).' },
  { id: 'q2', question: 'Thành phần sigma^2 trong phân rã bias-variance là gì?|||What is the sigma^2 term in the bias-variance decomposition?', options: ['Nhiễu không thể loại bỏ', 'Sai số do mô hình quá đơn giản', 'Số tham số của mô hình', 'Kích thước tập kiểm tra'], correctIndex: 0, explanation: 'sigma^2 là nhiễu vốn có của dữ liệu, không mô hình nào loại bỏ được.' },
  { id: 'q3', question: 'Vì sao phải đo điểm trên tập test tách riêng thay vì tập train?|||Why report the score on a held-out test set instead of the training set?', options: ['Vì tập train luôn nhỏ hơn', 'Để đo khả năng tổng quát hoá, tránh báo cáo do học thuộc', 'Vì AIC yêu cầu vậy', 'Để tăng tốc huấn luyện'], correctIndex: 1, explanation: 'Điểm trên dữ liệu chưa thấy mới phản ánh tổng quát hoá; điểm train có thể cao do overfit.' },
]);

const c2 = doc('ama401-2-1-advanced-regression', '2.1 — Advanced regression: regularization & GLM|||2.1 — Hồi quy nâng cao: chính quy hoá & GLM',
  'Hồi quy đa biến và phi tuyến; chính quy hoá Ridge (L2) và Lasso (L1) chống overfit và chọn biến; mô hình tuyến tính tổng quát (GLM) cho đầu ra không liên tục.',
  [[
    `<span class="eyebrow">AMA401 · Chapter 2 · Lesson 2.1</span>
<h2>Advanced regression: regularization &amp; GLM</h2>
<h3>Beyond a single straight line</h3>
<p><strong>Multiple regression</strong> uses many predictors; <strong>nonlinear</strong> terms (polynomials, splines) bend the fit. But more terms means more variance — enter regularization.</p>
<h3>Ridge and Lasso</h3>
<p>Both add a penalty on the coefficient sizes to the least-squares loss:</p>
<pre><code>Ridge (L2): minimise  RSS + alpha * sum(beta_j^2)
Lasso (L1): minimise  RSS + alpha * sum(|beta_j|)
  alpha = 0      -> ordinary least squares
  alpha larger   -> coefficients shrink toward 0
  Lasso can set some beta_j exactly 0 -> feature selection
</code></pre>
<p>Ridge shrinks all coefficients smoothly; Lasso zeroes out weak ones, giving a sparse, interpretable model.</p>
<h3>Generalized linear models (GLM)</h3>
<p>When the target is not continuous, a <strong>GLM</strong> keeps a linear predictor but passes it through a <em>link function</em>: logistic for a probability, Poisson (log link) for counts. It generalises linear regression to the exponential family.</p>
<pre><code>from sklearn.linear_model import Ridge, Lasso

ridge = Ridge(alpha=1.0).fit(X_train, y_train)
lasso = Lasso(alpha=0.1).fit(X_train, y_train)
print((lasso.coef_ != 0).sum(), "features kept by Lasso")
</code></pre>
<div class="callout"><span class="badge">Standardize first</span> Regularization penalises coefficient size, so scale features to comparable ranges before fitting, or large-unit features get unfairly penalised.</div>`,
    `<span class="eyebrow">AMA401 · Chương 2 · Bài 2.1</span>
<h2>Hồi quy nâng cao: chính quy hoá &amp; GLM</h2>
<h3>Vượt qua một đường thẳng đơn</h3>
<p><strong>Hồi quy đa biến</strong> dùng nhiều biến dự báo; các số hạng <strong>phi tuyến</strong> (đa thức, spline) uốn cong đường khớp. Nhưng nhiều số hạng nghĩa là variance cao hơn — chính quy hoá xuất hiện để giải quyết.</p>
<h3>Ridge và Lasso</h3>
<p>Cả hai thêm một phạt lên độ lớn hệ số vào hàm mất mát bình phương tối thiểu:</p>
<pre><code>Ridge (L2): tối thiểu  RSS + alpha * sum(beta_j^2)
Lasso (L1): tối thiểu  RSS + alpha * sum(|beta_j|)
  alpha = 0     -> bình phương tối thiểu thông thường
  alpha lớn hơn -> hệ số co về gần 0
  Lasso đưa vài beta_j về đúng 0 -> chọn biến
</code></pre>
<p>Ridge co mọi hệ số một cách mượt; Lasso đưa các hệ số yếu về 0, cho mô hình thưa và dễ diễn giải.</p>
<h3>Mô hình tuyến tính tổng quát (GLM)</h3>
<p>Khi mục tiêu không liên tục, một <strong>GLM</strong> giữ bộ dự báo tuyến tính nhưng truyền nó qua một <em>hàm liên kết</em>: logistic cho xác suất, Poisson (liên kết log) cho số đếm. Nó tổng quát hoá hồi quy tuyến tính sang họ mũ.</p>
<pre><code>from sklearn.linear_model import Ridge, Lasso

ridge = Ridge(alpha=1.0).fit(X_train, y_train)
lasso = Lasso(alpha=0.1).fit(X_train, y_train)
print((lasso.coef_ != 0).sum(), "dac trung Lasso giu lai")
</code></pre>
<div class="callout"><span class="badge">Chuẩn hoá trước</span> Chính quy hoá phạt độ lớn hệ số, nên hãy đưa các đặc trưng về khoảng giá trị tương đương trước khi khớp, nếu không đặc trưng có đơn vị lớn sẽ bị phạt oan.</div>`,
  ]]);

const c2q = quiz('ama401-quiz-2', 'Quiz 2 — Regularization & GLM|||Quiz 2 — Chính quy hoá & GLM', [
  { id: 'q1', question: 'Điểm khác biệt then chốt của Lasso (L1) so với Ridge (L2) là gì?|||What is the key difference of Lasso (L1) versus Ridge (L2)?', options: ['Lasso có thể đưa hệ số về đúng 0, chọn biến', 'Lasso luôn cho sai số nhỏ hơn', 'Lasso không cần chuẩn hoá đặc trưng', 'Lasso chỉ dùng cho phân loại'], correctIndex: 0, explanation: 'Phạt L1 tạo nghiệm thưa: một số hệ số bằng đúng 0, tức chọn biến; L2 chỉ co mượt.' },
  { id: 'q2', question: 'Khi alpha (hệ số chính quy hoá) tiến về 0, mô hình Ridge/Lasso trở về?|||As alpha approaches 0, Ridge/Lasso reduces to what?', options: ['Hằng số dự đoán trung bình', 'Bình phương tối thiểu thông thường', 'Một mô hình rỗng không hệ số', 'Hồi quy Poisson'], correctIndex: 1, explanation: 'alpha = 0 tắt phạt, mô hình trở lại OLS thông thường.' },
  { id: 'q3', question: 'GLM mở rộng hồi quy tuyến tính bằng cách nào cho đầu ra không liên tục?|||How does a GLM extend linear regression for non-continuous outputs?', options: ['Bỏ hoàn toàn phần tuyến tính', 'Truyền bộ dự báo tuyến tính qua một hàm liên kết', 'Tăng số vòng huấn luyện', 'Dùng cây quyết định'], correctIndex: 1, explanation: 'GLM giữ dự báo tuyến tính rồi qua hàm liên kết (logit, log...) khớp với họ mũ.' },
]);

const c3 = doc('ama401-3-1-advanced-classification', '3.1 — Advanced classification & evaluation|||3.1 — Phân loại nâng cao & đánh giá',
  'Hồi quy logistic (xác suất qua hàm sigmoid); phân tích biệt thức tuyến tính/bậc hai (LDA/QDA); đánh giá nâng cao: ma trận nhầm lẫn, precision/recall, ROC-AUC.',
  [[
    `<span class="eyebrow">AMA401 · Chapter 3 · Lesson 3.1</span>
<h2>Advanced classification &amp; evaluation</h2>
<h3>Logistic regression</h3>
<p>To predict a <em>class</em>, logistic regression models the probability with the sigmoid of a linear score:</p>
<pre><code>p(y=1 | x) = 1 / (1 + exp(-(b0 + b1*x1 + ... + bk*xk)))
  output is a probability in (0, 1)
  decide class 1 when p &gt;= 0.5 (threshold is tunable)
</code></pre>
<h3>LDA and QDA</h3>
<p><strong>Linear Discriminant Analysis (LDA)</strong> models each class as a Gaussian with a <em>shared</em> covariance, giving linear boundaries. <strong>QDA</strong> lets each class have its own covariance, giving curved boundaries — more flexible, more variance.</p>
<h3>Evaluate beyond accuracy</h3>
<p>On imbalanced data accuracy lies. Use the confusion matrix and its ratios:</p>
<pre><code>Precision = TP / (TP + FP)   # of predicted positives, how many are right
Recall    = TP / (TP + FN)   # of actual positives, how many are caught
F1        = 2 * P * R / (P + R)
ROC-AUC   : ranking quality across all thresholds (0.5 = random, 1.0 = perfect)
</code></pre>
<pre><code>from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score

clf = LogisticRegression(max_iter=1000).fit(X_train, y_train)
proba = clf.predict_proba(X_test)[:, 1]
print(roc_auc_score(y_test, proba))
</code></pre>
<div class="callout"><span class="badge">Pick the right metric</span> A fraud model that flags nothing can be 99% accurate. Recall and ROC-AUC tell the honest story on rare classes.</div>`,
    `<span class="eyebrow">AMA401 · Chương 3 · Bài 3.1</span>
<h2>Phân loại nâng cao &amp; đánh giá</h2>
<h3>Hồi quy logistic</h3>
<p>Để dự đoán một <em>lớp</em>, hồi quy logistic mô hình xác suất bằng sigmoid của một điểm tuyến tính:</p>
<pre><code>p(y=1 | x) = 1 / (1 + exp(-(b0 + b1*x1 + ... + bk*xk)))
  đầu ra là xác suất trong (0, 1)
  chọn lớp 1 khi p &gt;= 0.5 (ngưỡng chỉnh được)
</code></pre>
<h3>LDA và QDA</h3>
<p><strong>Phân tích biệt thức tuyến tính (LDA)</strong> mô hình mỗi lớp là một Gaussian với hiệp phương sai <em>dùng chung</em>, cho biên tuyến tính. <strong>QDA</strong> cho mỗi lớp có hiệp phương sai riêng, cho biên cong — linh hoạt hơn, variance cao hơn.</p>
<h3>Đánh giá vượt qua accuracy</h3>
<p>Với dữ liệu mất cân bằng, accuracy nói dối. Hãy dùng ma trận nhầm lẫn và các tỉ số của nó:</p>
<pre><code>Precision = TP / (TP + FP)   # trong số dự đoán dương, bao nhiêu đúng
Recall    = TP / (TP + FN)   # trong số dương thật, bắt được bao nhiêu
F1        = 2 * P * R / (P + R)
ROC-AUC   : chất lượng xếp hạng qua mọi ngưỡng (0.5 = ngẫu nhiên, 1.0 = hoàn hảo)
</code></pre>
<pre><code>from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score

clf = LogisticRegression(max_iter=1000).fit(X_train, y_train)
proba = clf.predict_proba(X_test)[:, 1]
print(roc_auc_score(y_test, proba))
</code></pre>
<div class="callout"><span class="badge">Chọn đúng chỉ số</span> Một mô hình gian lận không gắn cờ gì cả vẫn có thể đạt 99% accuracy. Recall và ROC-AUC mới kể câu chuyện trung thực với lớp hiếm.</div>`,
  ]]);

const c3q = quiz('ama401-quiz-3', 'Quiz 3 — Classification & evaluation|||Quiz 3 — Phân loại & đánh giá', [
  { id: 'q1', question: 'Hồi quy logistic dùng hàm nào để biến điểm tuyến tính thành xác suất?|||Which function turns the linear score into a probability in logistic regression?', options: ['Hàm sigmoid (logistic)', 'Hàm bậc hai', 'Hàm ReLU', 'Hàm bậc thang cứng'], correctIndex: 0, explanation: 'Sigmoid 1/(1+exp(-z)) ép điểm về khoảng (0, 1) làm xác suất.' },
  { id: 'q2', question: 'Khác biệt giữa LDA và QDA là gì?|||What distinguishes LDA from QDA?', options: ['LDA dùng cây, QDA dùng tuyến tính', 'LDA giả định hiệp phương sai dùng chung (biên tuyến tính); QDA cho mỗi lớp hiệp phương sai riêng (biên cong)', 'QDA chỉ cho hai lớp', 'LDA không cần dữ liệu huấn luyện'], correctIndex: 1, explanation: 'LDA chung covariance nên biên thẳng; QDA riêng covariance nên biên cong, linh hoạt hơn.' },
  { id: 'q3', question: 'Với dữ liệu mất cân bằng, vì sao accuracy dễ gây hiểu lầm?|||On imbalanced data, why can accuracy be misleading?', options: ['Vì accuracy luôn bằng 0', 'Vì đoán toàn lớp đa số vẫn cho accuracy cao dù bỏ sót lớp hiếm', 'Vì accuracy không tính được', 'Vì ROC-AUC luôn thấp hơn'], correctIndex: 1, explanation: 'Lớp hiếm ít điểm, đoán toàn lớp đa số vẫn accuracy cao; cần recall/ROC-AUC.' },
]);

const c4 = doc('ama401-4-1-resampling', '4.1 — Resampling: cross-validation & the bootstrap|||4.1 — Resampling: cross-validation & bootstrap',
  'Vì một lần chia không đủ tin; k-fold cross-validation cho ước lượng sai số ổn định; bootstrap lấy mẫu có hoàn lại để ước lượng độ bất định của thống kê.',
  [[
    `<span class="eyebrow">AMA401 · Chapter 4 · Lesson 4.1</span>
<h2>Resampling: cross-validation &amp; the bootstrap</h2>
<h3>Why one split is not enough</h3>
<p>A single train/test split gives one noisy number that depends on <em>which</em> rows landed in the test set. Resampling reuses the data many times to get a stable estimate — and an error bar.</p>
<h3>k-fold cross-validation</h3>
<pre><code>Split data into k equal folds. For i in 1..k:
    train on the other k-1 folds, test on fold i
Report the mean (and std) of the k scores.
  k = 5 or 10 is standard
  larger k -> less bias, more compute
</code></pre>
<p>Every row is used for both training and testing, so the estimate uses all the data without ever testing on what it trained on.</p>
<h3>The bootstrap</h3>
<p>To measure the <strong>uncertainty</strong> of a statistic (a mean, a coefficient), resample the data <em>with replacement</em> B times, recompute the statistic each time, and read the spread of the B values.</p>
<pre><code>from sklearn.model_selection import cross_val_score

scores = cross_val_score(clf, X, y, cv=5, scoring="accuracy")
print(scores.mean(), "+/-", scores.std())
</code></pre>
<div class="callout"><span class="badge">Report the spread</span> A cross-validated score of 0.86 +/- 0.01 means far more than a single 0.86 — the +/- is your evidence the result is not a fluke.</div>`,
    `<span class="eyebrow">AMA401 · Chương 4 · Bài 4.1</span>
<h2>Resampling: cross-validation &amp; bootstrap</h2>
<h3>Vì sao một lần chia là chưa đủ</h3>
<p>Một lần chia train/test cho một con số nhiễu, phụ thuộc vào <em>những</em> dòng nào rơi vào tập test. Resampling dùng lại dữ liệu nhiều lần để có ước lượng ổn định — kèm một thanh sai số.</p>
<h3>k-fold cross-validation</h3>
<pre><code>Chia dữ liệu thành k phần bằng nhau. Với i trong 1..k:
    huấn luyện trên k-1 phần còn lại, kiểm tra trên phần i
Báo cáo trung bình (và độ lệch chuẩn) của k điểm.
  k = 5 hoặc 10 là chuẩn
  k lớn hơn -> ít bias hơn, tốn tính toán hơn
</code></pre>
<p>Mọi dòng đều được dùng cho cả huấn luyện và kiểm tra, nên ước lượng dùng hết dữ liệu mà không bao giờ kiểm tra trên chính thứ nó đã học.</p>
<h3>Bootstrap</h3>
<p>Để đo <strong>độ bất định</strong> của một thống kê (trung bình, một hệ số), lấy mẫu lại dữ liệu <em>có hoàn lại</em> B lần, tính lại thống kê mỗi lần, rồi đọc độ trải của B giá trị.</p>
<pre><code>from sklearn.model_selection import cross_val_score

scores = cross_val_score(clf, X, y, cv=5, scoring="accuracy")
print(scores.mean(), "+/-", scores.std())
</code></pre>
<div class="callout"><span class="badge">Báo cáo độ trải</span> Điểm cross-validation 0.86 +/- 0.01 nói được nhiều hơn hẳn một con số 0.86 đơn lẻ — dấu +/- là bằng chứng kết quả không phải may rủi.</div>`,
  ]]);

const c4q = quiz('ama401-quiz-4', 'Quiz 4 — Resampling|||Quiz 4 — Resampling', [
  { id: 'q1', question: 'Trong k-fold cross-validation, mỗi dòng dữ liệu được dùng như thế nào?|||In k-fold cross-validation, how is each data row used?', options: ['Chỉ để huấn luyện', 'Chỉ để kiểm tra', 'Vừa để huấn luyện (ở k-1 fold) vừa để kiểm tra (ở 1 fold)', 'Bị loại ngẫu nhiên'], correctIndex: 2, explanation: 'Mỗi fold lần lượt làm tập test một lần và làm tập train ở các vòng còn lại.' },
  { id: 'q2', question: 'Bootstrap lấy mẫu lại theo cách nào?|||How does the bootstrap resample the data?', options: ['Không hoàn lại', 'Có hoàn lại (with replacement)', 'Chỉ lấy đúng một nửa', 'Sắp xếp lại theo thứ tự'], correctIndex: 1, explanation: 'Bootstrap lấy mẫu CÓ hoàn lại nên một dòng có thể xuất hiện nhiều lần trong một mẫu.' },
  { id: 'q3', question: 'Lợi ích chính của resampling so với một lần chia train/test là gì?|||What is the main benefit of resampling over a single train/test split?', options: ['Huấn luyện nhanh hơn', 'Ước lượng sai số ổn định hơn, kèm độ bất định', 'Không cần dữ liệu kiểm tra', 'Luôn tăng accuracy'], correctIndex: 1, explanation: 'Lặp lại nhiều lần cho ước lượng ổn định và một thanh sai số, thay vì một con số nhiễu.' },
]);

const c5 = doc('ama401-5-1-unsupervised', '5.1 — Unsupervised learning: PCA, clustering & embeddings|||5.1 — Học không giám sát: PCA, clustering & giảm chiều',
  'Không có nhãn, tìm cấu trúc; PCA giảm chiều tuyến tính giữ phương sai; clustering (k-means, phân cấp); giảm chiều phi tuyến t-SNE/UMAP để trực quan hoá.',
  [[
    `<span class="eyebrow">AMA401 · Chapter 5 · Lesson 5.1</span>
<h2>Unsupervised learning: PCA, clustering &amp; embeddings</h2>
<h3>Learning without labels</h3>
<p>Here there is no y — we look for <strong>structure</strong>: directions of variation, natural groups, a low-dimensional view of high-dimensional data.</p>
<h3>Principal Component Analysis (PCA)</h3>
<p>PCA finds new orthogonal axes (principal components) ordered by how much <strong>variance</strong> they capture. Keeping the first few gives a faithful, lower-dimensional representation.</p>
<pre><code>Steps: standardize -> covariance matrix -> eigen-decomposition
  PC1 = direction of maximum variance
  PC2 = next, orthogonal to PC1, ...
  keep enough PCs to explain, say, 95% of variance
</code></pre>
<h3>Clustering</h3>
<ul>
<li><strong>k-means</strong> — partition into k groups by minimising within-cluster distance to centroids; pick k with the elbow or silhouette score.</li>
<li><strong>Hierarchical</strong> — build a tree (dendrogram) of nested clusters, no k fixed in advance.</li>
</ul>
<h3>Nonlinear embeddings</h3>
<p><strong>t-SNE</strong> and <strong>UMAP</strong> map high-dimensional data to 2D for <em>visualisation</em>, preserving local neighbourhoods. They are for seeing structure, not for feeding downstream models.</p>
<pre><code>from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

Z = PCA(n_components=2).fit_transform(X)
labels = KMeans(n_clusters=3, n_init=10).fit_predict(Z)
</code></pre>
<div class="callout"><span class="badge">Standardize before PCA</span> PCA follows variance, so an unscaled large-unit feature dominates the components. Standardize first.</div>`,
    `<span class="eyebrow">AMA401 · Chương 5 · Bài 5.1</span>
<h2>Học không giám sát: PCA, clustering &amp; giảm chiều</h2>
<h3>Học không có nhãn</h3>
<p>Ở đây không có y — ta tìm <strong>cấu trúc</strong>: các hướng biến thiên, các nhóm tự nhiên, một góc nhìn ít chiều của dữ liệu nhiều chiều.</p>
<h3>Phân tích thành phần chính (PCA)</h3>
<p>PCA tìm các trục trực giao mới (thành phần chính) sắp theo lượng <strong>phương sai</strong> chúng giữ được. Giữ vài thành phần đầu cho một biểu diễn trung thực, ít chiều hơn.</p>
<pre><code>Các bước: chuẩn hoá -> ma trận hiệp phương sai -> phân tích trị riêng
  PC1 = hướng phương sai lớn nhất
  PC2 = kế tiếp, trực giao với PC1, ...
  giữ đủ số PC để giải thích, ví dụ, 95% phương sai
</code></pre>
<h3>Clustering</h3>
<ul>
<li><strong>k-means</strong> — chia thành k nhóm bằng cách tối thiểu khoảng cách trong cụm tới tâm; chọn k bằng khuỷu tay (elbow) hoặc silhouette.</li>
<li><strong>Phân cấp</strong> — dựng một cây (dendrogram) các cụm lồng nhau, không cố định k trước.</li>
</ul>
<h3>Giảm chiều phi tuyến</h3>
<p><strong>t-SNE</strong> và <strong>UMAP</strong> ánh xạ dữ liệu nhiều chiều xuống 2D để <em>trực quan hoá</em>, giữ lân cận cục bộ. Chúng để nhìn cấu trúc, không phải để nạp vào mô hình phía sau.</p>
<pre><code>from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

Z = PCA(n_components=2).fit_transform(X)
labels = KMeans(n_clusters=3, n_init=10).fit_predict(Z)
</code></pre>
<div class="callout"><span class="badge">Chuẩn hoá trước PCA</span> PCA đi theo phương sai, nên một đặc trưng đơn vị lớn chưa chuẩn hoá sẽ lấn át các thành phần. Hãy chuẩn hoá trước.</div>`,
  ]]);

const c5q = quiz('ama401-quiz-5', 'Quiz 5 — Unsupervised learning|||Quiz 5 — Học không giám sát', [
  { id: 'q1', question: 'PCA sắp xếp các thành phần chính theo tiêu chí nào?|||PCA orders its principal components by what?', options: ['Theo lượng phương sai chúng giữ được', 'Theo thứ tự bảng chữ cái của đặc trưng', 'Theo số nhãn của lớp', 'Ngẫu nhiên'], correctIndex: 0, explanation: 'PC1 giữ phương sai lớn nhất, PC2 kế tiếp và trực giao, giảm dần.' },
  { id: 'q2', question: 'k-means chọn số cụm k thường dựa vào?|||k-means typically picks the number of clusters k using what?', options: ['Luôn cố định k = 2', 'Phương pháp elbow hoặc silhouette score', 'Số đặc trưng của dữ liệu', 'Giá trị của ROC-AUC'], correctIndex: 1, explanation: 'Elbow (sai số trong cụm) và silhouette giúp chọn k hợp lý.' },
  { id: 'q3', question: 't-SNE và UMAP chủ yếu dùng để làm gì?|||What are t-SNE and UMAP mainly used for?', options: ['Dự đoán nhãn lớp', 'Trực quan hoá dữ liệu nhiều chiều xuống 2D giữ lân cận cục bộ', 'Chính quy hoá hồi quy', 'Tính ROC-AUC'], correctIndex: 1, explanation: 'Chúng là kỹ thuật giảm chiều phi tuyến để nhìn cấu trúc, không phải bộ dự đoán.' },
]);

const c6 = doc('ama401-6-1-time-series', '6.1 — Time series: decomposition, ARIMA & forecasting|||6.1 — Chuỗi thời gian: phân rã, ARIMA & dự báo',
  'Dữ liệu có thứ tự thời gian; phân rã xu hướng/mùa vụ/phần dư; tính dừng và sai phân; mô hình ARIMA(p,d,q); dự báo và kiểm định theo thời gian.',
  [[
    `<span class="eyebrow">AMA401 · Chapter 6 · Lesson 6.1</span>
<h2>Time series: decomposition, ARIMA &amp; forecasting</h2>
<h3>Order matters</h3>
<p>In a time series each observation depends on the past, so rows are <em>not</em> independent. That breaks ordinary cross-validation and demands its own toolkit.</p>
<h3>Decomposition</h3>
<p>A series is often split into three parts:</p>
<pre><code>y_t = Trend_t + Seasonality_t + Residual_t   (additive)
  Trend       : long-run direction
  Seasonality : repeating cycle (weekly, yearly)
  Residual    : what is left, ideally noise
</code></pre>
<h3>Stationarity and ARIMA</h3>
<p>Many methods assume a <strong>stationary</strong> series (constant mean and variance). Differencing removes trend to reach it. <strong>ARIMA(p, d, q)</strong> combines three ideas:</p>
<pre><code>AR(p) : regress on p past values (autoregression)
I(d)  : difference d times to make it stationary
MA(q) : regress on q past forecast errors
</code></pre>
<pre><code>from statsmodels.tsa.arima.model import ARIMA

model = ARIMA(y, order=(1, 1, 1)).fit()
forecast = model.forecast(steps=12)
</code></pre>
<div class="callout"><span class="badge">Never shuffle time</span> Split by time (train on the past, test on the future) and forecast forward — a random split would let the model peek at the future.</div>`,
    `<span class="eyebrow">AMA401 · Chương 6 · Bài 6.1</span>
<h2>Chuỗi thời gian: phân rã, ARIMA &amp; dự báo</h2>
<h3>Thứ tự có ý nghĩa</h3>
<p>Trong chuỗi thời gian mỗi quan sát phụ thuộc quá khứ, nên các dòng <em>không</em> độc lập. Điều đó phá vỡ cross-validation thông thường và đòi hỏi bộ công cụ riêng.</p>
<h3>Phân rã</h3>
<p>Một chuỗi thường tách thành ba phần:</p>
<pre><code>y_t = Trend_t + Seasonality_t + Residual_t   (cộng tính)
  Trend       : hướng đi dài hạn
  Seasonality : chu kỳ lặp lại (tuần, năm)
  Residual    : phần còn lại, lý tưởng là nhiễu
</code></pre>
<h3>Tính dừng và ARIMA</h3>
<p>Nhiều phương pháp giả định chuỗi <strong>dừng</strong> (trung bình và phương sai không đổi). Sai phân loại bỏ xu hướng để đạt điều đó. <strong>ARIMA(p, d, q)</strong> kết hợp ba ý:</p>
<pre><code>AR(p) : hồi quy trên p giá trị quá khứ (tự hồi quy)
I(d)  : sai phân d lần để chuỗi trở nên dừng
MA(q) : hồi quy trên q sai số dự báo quá khứ
</code></pre>
<pre><code>from statsmodels.tsa.arima.model import ARIMA

model = ARIMA(y, order=(1, 1, 1)).fit()
forecast = model.forecast(steps=12)
</code></pre>
<div class="callout"><span class="badge">Không xáo trộn thời gian</span> Hãy chia theo thời gian (huấn luyện trên quá khứ, kiểm tra trên tương lai) và dự báo tiến về phía trước — chia ngẫu nhiên sẽ để mô hình nhìn trộm tương lai.</div>`,
  ]]);

const c6q = quiz('ama401-quiz-6', 'Quiz 6 — Time series & ARIMA|||Quiz 6 — Chuỗi thời gian & ARIMA', [
  { id: 'q1', question: 'Chữ "I" trong ARIMA(p, d, q) ứng với thao tác nào?|||What does the "I" in ARIMA(p, d, q) stand for?', options: ['Nội suy (interpolation)', 'Sai phân d lần để đạt tính dừng (integrated/differencing)', 'Chỉ số mùa vụ', 'Khởi tạo trọng số'], correctIndex: 1, explanation: 'I = integrated: sai phân d lần để chuỗi trở nên dừng.' },
  { id: 'q2', question: 'Vì sao KHÔNG dùng chia ngẫu nhiên (shuffle) cho chuỗi thời gian?|||Why should you not use a random shuffle split for a time series?', options: ['Vì làm chậm huấn luyện', 'Vì các quan sát phụ thuộc quá khứ; chia ngẫu nhiên để mô hình nhìn trộm tương lai', 'Vì ARIMA cấm', 'Vì mất tính mùa vụ'], correctIndex: 1, explanation: 'Dòng không độc lập theo thời gian; phải huấn luyện trên quá khứ, kiểm tra tương lai.' },
  { id: 'q3', question: 'Phân rã cộng tính tách một chuỗi thành ba thành phần nào?|||An additive decomposition splits a series into which three parts?', options: ['Xu hướng, mùa vụ, phần dư', 'Bias, variance, nhiễu', 'Precision, recall, F1', 'AR, I, MA của cùng một biến'], correctIndex: 0, explanation: 'y_t = Trend + Seasonality + Residual.' },
]);

const c7 = doc('ama401-7-1-bayesian', '7.1 — Bayesian statistics: prior, posterior & MCMC|||7.1 — Thống kê Bayes: prior, posterior & MCMC',
  'Góc nhìn Bayes: tham số là ngẫu nhiên; định lý Bayes cập nhật prior thành posterior qua dữ liệu; khi hậu nghiệm không giải được, lấy mẫu bằng MCMC.',
  [[
    `<span class="eyebrow">AMA401 · Chapter 7 · Lesson 7.1</span>
<h2>Bayesian statistics: prior, posterior &amp; MCMC</h2>
<h3>A different view of a parameter</h3>
<p>The frequentist treats a parameter as a fixed unknown. The <strong>Bayesian</strong> treats it as a random quantity with a distribution, and updates that distribution as data arrive.</p>
<h3>Bayes theorem</h3>
<pre><code>posterior  proportional to  likelihood * prior
  p(theta | data) = p(data | theta) * p(theta) / p(data)
  prior     : belief before seeing data
  likelihood: how well theta explains the data
  posterior : updated belief after the data
</code></pre>
<p>The posterior is the whole answer — not a single estimate but a full distribution, from which you read a mean and a <strong>credible interval</strong>.</p>
<h3>When you cannot solve it: MCMC</h3>
<p>For real models the posterior has no closed form. <strong>Markov Chain Monte Carlo (MCMC)</strong> draws correlated samples that, in the long run, come from the posterior — so you approximate it by sampling instead of integrating.</p>
<pre><code>import pymc as pm

with pm.Model():
    mu = pm.Normal("mu", 0, 10)      # prior
    pm.Normal("y", mu, 1, observed=data)   # likelihood
    trace = pm.sample(1000)          # MCMC posterior samples
</code></pre>
<div class="callout"><span class="badge">Priors are explicit</span> Bayesian analysis makes your assumptions visible as a prior — a strength, not a weakness, especially when data are scarce.</div>`,
    `<span class="eyebrow">AMA401 · Chương 7 · Bài 7.1</span>
<h2>Thống kê Bayes: prior, posterior &amp; MCMC</h2>
<h3>Một cách nhìn khác về tham số</h3>
<p>Trường phái tần suất xem tham số là một ẩn số cố định. Trường phái <strong>Bayes</strong> xem nó là một đại lượng ngẫu nhiên có phân phối, và cập nhật phân phối đó khi dữ liệu đến.</p>
<h3>Định lý Bayes</h3>
<pre><code>posterior  tỉ lệ với  likelihood * prior
  p(theta | data) = p(data | theta) * p(theta) / p(data)
  prior     : niềm tin trước khi thấy dữ liệu
  likelihood: theta giải thích dữ liệu tốt tới đâu
  posterior : niềm tin đã cập nhật sau dữ liệu
</code></pre>
<p>Hậu nghiệm chính là toàn bộ câu trả lời — không phải một ước lượng đơn mà là cả một phân phối, từ đó bạn đọc ra trung bình và một <strong>khoảng tin cậy (credible interval)</strong>.</p>
<h3>Khi không giải được: MCMC</h3>
<p>Với mô hình thật, hậu nghiệm không có dạng đóng. <strong>Markov Chain Monte Carlo (MCMC)</strong> rút các mẫu tương quan mà về lâu dài đến từ hậu nghiệm — nên bạn xấp xỉ nó bằng cách lấy mẫu thay vì tích phân.</p>
<pre><code>import pymc as pm

with pm.Model():
    mu = pm.Normal("mu", 0, 10)      # prior
    pm.Normal("y", mu, 1, observed=data)   # likelihood
    trace = pm.sample(1000)          # mau hau nghiem MCMC
</code></pre>
<div class="callout"><span class="badge">Prior là tường minh</span> Phân tích Bayes phơi bày giả định của bạn dưới dạng một prior — đây là điểm mạnh, không phải điểm yếu, nhất là khi dữ liệu khan hiếm.</div>`,
  ]]);

const c7q = quiz('ama401-quiz-7', 'Quiz 7 — Bayesian statistics|||Quiz 7 — Thống kê Bayes', [
  { id: 'q1', question: 'Theo định lý Bayes, posterior tỉ lệ với tích của gì?|||By Bayes theorem, the posterior is proportional to the product of what?', options: ['Likelihood và prior', 'Bias và variance', 'Precision và recall', 'Train và test'], correctIndex: 0, explanation: 'posterior tỉ lệ với likelihood * prior; mẫu số p(data) chỉ để chuẩn hoá.' },
  { id: 'q2', question: 'MCMC dùng để làm gì trong suy diễn Bayes?|||What is MCMC used for in Bayesian inference?', options: ['Chuẩn hoá đặc trưng', 'Lấy mẫu xấp xỉ hậu nghiệm khi nó không có dạng đóng', 'Chia dữ liệu train/test', 'Giảm chiều dữ liệu'], correctIndex: 1, explanation: 'Khi hậu nghiệm không giải được, MCMC rút mẫu từ nó để xấp xỉ thay cho tích phân.' },
  { id: 'q3', question: 'Trong góc nhìn Bayes, một tham số được xem là?|||In the Bayesian view, a parameter is treated as what?', options: ['Một hằng số đã biết', 'Một đại lượng ngẫu nhiên có phân phối, cập nhật theo dữ liệu', 'Một nhãn lớp', 'Một fold trong cross-validation'], correctIndex: 1, explanation: 'Bayes coi tham số là ngẫu nhiên, có prior rồi thành posterior sau dữ liệu.' },
]);

const c8 = doc('ama401-8-1-trees-ensembles', '8.1 — Tree models & advanced ensembles|||8.1 — Mô hình cây & ensemble nâng cao',
  'Cây quyết định và điểm yếu variance cao; Random Forest (bagging + ngẫu nhiên hoá) giảm variance; Gradient Boosting/XGBoost dựng cây tuần tự sửa lỗi; feature importance và ứng dụng.',
  [[
    `<span class="eyebrow">AMA401 · Chapter 8 · Lesson 8.1</span>
<h2>Tree models &amp; advanced ensembles</h2>
<h3>From one tree to many</h3>
<p>A single <strong>decision tree</strong> splits the feature space into regions. It is easy to read but high-variance: a small data change gives a very different tree. Ensembles fix this by combining many trees.</p>
<h3>Random Forest (bagging)</h3>
<p>Train many trees, each on a <em>bootstrap</em> sample and on a random subset of features at each split, then average (or vote). Averaging <strong>de-correlated</strong> trees cuts variance without raising bias much.</p>
<pre><code>from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=300, max_features="sqrt")
rf.fit(X_train, y_train)
importances = rf.feature_importances_   # which features drive predictions
</code></pre>
<h3>Gradient Boosting and XGBoost</h3>
<p>Boosting builds trees <strong>sequentially</strong>: each new tree fits the <em>residual errors</em> of the ensemble so far. <strong>XGBoost</strong> is a fast, regularized implementation that dominates tabular competitions.</p>
<pre><code>Bagging  : parallel trees, average -> lowers variance
Boosting : sequential trees, fix residuals -> lowers bias
  boosting is powerful but can overfit -> tune learning_rate,
  n_estimators and max_depth, and validate with cross-validation
</code></pre>
<div class="callout"><span class="badge">Read the importances</span> Feature importance shows which inputs the model relies on — a sanity check and a story you can tell a stakeholder.</div>`,
    `<span class="eyebrow">AMA401 · Chương 8 · Bài 8.1</span>
<h2>Mô hình cây &amp; ensemble nâng cao</h2>
<h3>Từ một cây tới nhiều cây</h3>
<p>Một <strong>cây quyết định</strong> đơn chia không gian đặc trưng thành các vùng. Nó dễ đọc nhưng variance cao: một thay đổi nhỏ trong dữ liệu cho một cây rất khác. Ensemble sửa điều này bằng cách kết hợp nhiều cây.</p>
<h3>Random Forest (bagging)</h3>
<p>Huấn luyện nhiều cây, mỗi cây trên một mẫu <em>bootstrap</em> và trên một tập con ngẫu nhiên các đặc trưng ở mỗi lần chia, rồi lấy trung bình (hoặc bỏ phiếu). Trung bình hoá các cây đã <strong>khử tương quan</strong> cắt giảm variance mà không tăng bias nhiều.</p>
<pre><code>from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=300, max_features="sqrt")
rf.fit(X_train, y_train)
importances = rf.feature_importances_   # dac trung nao dan dat du doan
</code></pre>
<h3>Gradient Boosting và XGBoost</h3>
<p>Boosting dựng cây <strong>tuần tự</strong>: mỗi cây mới khớp <em>phần sai số còn lại</em> của ensemble hiện có. <strong>XGBoost</strong> là bản hiện thực nhanh, có chính quy hoá, thống trị các cuộc thi dữ liệu bảng.</p>
<pre><code>Bagging  : cây song song, trung bình -> giảm variance
Boosting : cây tuần tự, sửa phần dư -> giảm bias
  boosting mạnh nhưng dễ overfit -> tinh chỉnh learning_rate,
  n_estimators và max_depth, kiểm định bằng cross-validation
</code></pre>
<div class="callout"><span class="badge">Đọc feature importance</span> Feature importance cho thấy mô hình dựa vào đầu vào nào — vừa là phép kiểm hợp lý, vừa là câu chuyện bạn kể được cho người ra quyết định.</div>`,
  ]]);

const c8q = quiz('ama401-quiz-8', 'Quiz 8 — Trees & ensembles|||Quiz 8 — Cây & ensemble', [
  { id: 'q1', question: 'Điểm yếu chính của một cây quyết định đơn là gì?|||What is the main weakness of a single decision tree?', options: ['Bias rất cao, luôn underfit', 'Variance cao: thay đổi nhỏ trong dữ liệu cho cây rất khác', 'Không thể diễn giải', 'Chỉ chạy trên dữ liệu số'], correctIndex: 1, explanation: 'Cây đơn nhạy với dữ liệu (variance cao); ensemble giúp giảm điều này.' },
  { id: 'q2', question: 'Random Forest giảm variance chủ yếu bằng cách nào?|||How does a Random Forest mainly reduce variance?', options: ['Dựng một cây thật sâu', 'Trung bình nhiều cây đã khử tương quan (bootstrap + đặc trưng ngẫu nhiên)', 'Tăng learning rate', 'Bỏ bớt dữ liệu huấn luyện'], correctIndex: 1, explanation: 'Bagging trung bình các cây khử tương quan nên variance giảm mà bias không tăng nhiều.' },
  { id: 'q3', question: 'Khác biệt cốt lõi giữa boosting và bagging là gì?|||What is the core difference between boosting and bagging?', options: ['Boosting dựng cây tuần tự sửa phần dư; bagging dựng cây song song rồi trung bình', 'Bagging dùng một cây, boosting dùng nhiều cây', 'Boosting không dùng cây', 'Không có khác biệt'], correctIndex: 0, explanation: 'Bagging song song giảm variance; boosting tuần tự sửa lỗi để giảm bias.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'AMA401',
    slug: 'ama401-advanced-methods-for-data-analysis',
    title: 'Advanced Methods for Data Analysis',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/AMA401.webp',
    shortDescription: 'Advanced data analysis: bias-variance, regularized regression (Ridge/Lasso/GLM), classification (LDA/QDA), resampling (CV/bootstrap), PCA & clustering, time series (ARIMA), Bayesian inference & ensembles (Random Forest, XGBoost).|||Phân tích dữ liệu nâng cao: bias-variance, hồi quy chính quy hoá (Ridge/Lasso/GLM), phân loại (LDA/QDA), resampling (CV/bootstrap), PCA & clustering, chuỗi thời gian (ARIMA), suy diễn Bayes & ensemble (Random Forest, XGBoost).',
    description: 'Môn <strong>AMA401 — Advanced Methods for Data Analysis</strong> (kỳ 7, ngành Khoa học Máy tính) dạy những phương pháp phân tích dữ liệu một nhà khoa học dữ liệu thực sự dùng, đặt sau thống kê &amp; DS cơ bản. Từ <strong>bias-variance &amp; chọn mô hình</strong> → <strong>hồi quy nâng cao</strong> (Ridge/Lasso/GLM) → <strong>phân loại</strong> (logistic, LDA/QDA) → <strong>resampling</strong> (cross-validation, bootstrap) → <strong>học không giám sát</strong> (PCA, clustering, t-SNE/UMAP) → <strong>chuỗi thời gian</strong> (ARIMA) → <strong>thống kê Bayes</strong> (MCMC) → <strong>cây &amp; ensemble</strong> (Random Forest, Gradient Boosting/XGBoost). Bám sách chuẩn (ESL, ISLR, BDA), song ngữ, có công thức, code Python (scikit-learn/statsmodels) và quiz mỗi chương.',
    whatYouLearn: 'Bias-variance tradeoff, chọn mô hình (AIC/BIC, hold-out); hồi quy chính quy hoá Ridge/Lasso và GLM; phân loại logistic, LDA/QDA và đánh giá bằng precision/recall/ROC-AUC; cross-validation và bootstrap; PCA, clustering (k-means, phân cấp) và giảm chiều t-SNE/UMAP; phân rã và mô hình ARIMA cho chuỗi thời gian; suy diễn Bayes với prior/posterior và MCMC; Random Forest, Gradient Boosting/XGBoost và feature importance — thực hành bằng scikit-learn và statsmodels.',
    requirements: 'Đã học thống kê/xác suất và nhập môn khoa học dữ liệu (hồi quy tuyến tính cơ bản). Biết Python và numpy/pandas; nên dùng scikit-learn, statsmodels (chạy trên Google Colab là đủ).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách chuẩn (ESL, ISLR, BDA), scikit-learn/statsmodels, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Phạm vi môn, ba trục lớn, bias-variance, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Nền tảng & bias-variance|||Chapter 1 — Foundations & bias-variance', description: 'Bias-variance, overfit/underfit, chọn mô hình.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hồi quy nâng cao|||Chapter 2 — Advanced regression', description: 'Ridge/Lasso, chính quy hoá, GLM.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phân loại nâng cao|||Chapter 3 — Advanced classification', description: 'Logistic, LDA/QDA, ROC-AUC.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Resampling|||Chapter 4 — Resampling', description: 'Cross-validation, bootstrap, đánh giá tin cậy.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Học không giám sát|||Chapter 5 — Unsupervised learning', description: 'PCA, clustering, t-SNE/UMAP.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chuỗi thời gian|||Chapter 6 — Time series', description: 'Phân rã, ARIMA, dự báo.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thống kê Bayes|||Chapter 7 — Bayesian statistics', description: 'Prior/posterior, định lý Bayes, MCMC.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Cây & ensemble|||Chapter 8 — Trees & ensembles', description: 'Random Forest, Gradient Boosting/XGBoost, feature importance.', lessons: [c8, c8q] },
  ],
};
