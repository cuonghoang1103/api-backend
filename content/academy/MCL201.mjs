/**
 * MCL201 — Machine Learning (Học máy). Khối Quản trị Kinh doanh (BBA), FPTU,
 * kỳ 3. ⚠️ Môn cho sinh viên KINH DOANH: nhấn ứng dụng & trực giác, ít toán
 * nặng, ví dụ marketing/tài chính/khách hàng. Giáo trình tham khảo (trích
 * dẫn, không upload PDF): "Data Science for Business" (Provost & Fawcett),
 * Géron "Hands-On Machine Learning", Google ML Crash Course. Song ngữ.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mcl201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (FLM), sách tham khảo, tài liệu chính thức miễn phí, YouTube, công cụ thực hành không cần cài đặt, lộ trình tự học.',
  [[
    `<span class="eyebrow">MCL201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Machine Learning for business in one place — what it is, how it is used in marketing/finance/customer analytics, and how to read a model's output without needing to code it yourself. The official slides live on <strong>FLM</strong>; below are free, legal resources this course draws on.</p>
<h3>📘 Course syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MCL201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/data-science-for/9781449374273/" target="_blank" rel="noopener"><em>Data Science for Business</em> — Provost &amp; Fawcett</a> — the business-first classic: how firms actually use data mining and ML to make money.</li>
<li><a href="https://github.com/ageron/handson-ml3" target="_blank" rel="noopener"><em>Hands-On Machine Learning</em> — Aurélien Géron (author's free companion notebooks)</a> — the standard practical scikit-learn/deep-learning reference.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://developers.google.com/machine-learning/crash-course" target="_blank" rel="noopener">Google Machine Learning Crash Course</a> — free, guided, with interactive exercises.</li>
<li><a href="https://scikit-learn.org/stable/" target="_blank" rel="noopener">scikit-learn documentation</a> — the library behind almost every code example in this course.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — the clearest plain-language explanations of regression, trees, and model evaluation.</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown — Neural networks</a> — visual intuition for how deep learning works, no heavy math required.</li>
</ul>
<h3>🛠️ Tools (no installation needed)</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — run the Python examples in this course in your browser, free.</li>
<li><a href="https://www.kaggle.com/" target="_blank" rel="noopener">Kaggle</a> — real business-style datasets (sales, churn, credit) to practice on.</li>
<li><a href="https://teachablemachine.withgoogle.com/" target="_blank" rel="noopener">Google Teachable Machine</a> — train a simple classifier with no code at all, to build intuition first.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — what ML is, the workflow, regression vs. classification vs. clustering.</li>
<li><strong>Practice</strong> — run the Python snippets in Colab on a small Kaggle dataset (e.g. a churn or sales dataset).</li>
<li><strong>Go deeper</strong> — model evaluation, overfitting, decision trees &amp; random forests.</li>
<li><strong>Business-ready</strong> — connect each technique to a real decision: pricing, retention, credit, segmentation — and know its limits and ethics.</li>
</ol></div>`,
    `<span class="eyebrow">MCL201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Machine Learning ứng dụng trong kinh doanh gom về một chỗ — ML là gì, dùng thế nào trong marketing/tài chính/phân tích khách hàng, và cách đọc kết quả mô hình mà không cần tự code. Slide chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp môn này tham khảo.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MCL201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/data-science-for/9781449374273/" target="_blank" rel="noopener"><em>Data Science for Business</em> — Provost &amp; Fawcett</a> — sách kinh điển nhìn từ góc kinh doanh: doanh nghiệp dùng data mining &amp; ML để kiếm tiền thế nào.</li>
<li><a href="https://github.com/ageron/handson-ml3" target="_blank" rel="noopener"><em>Hands-On Machine Learning</em> — Aurélien Géron (notebook miễn phí của tác giả)</a> — tài liệu thực hành chuẩn về scikit-learn &amp; deep learning.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://developers.google.com/machine-learning/crash-course" target="_blank" rel="noopener">Google Machine Learning Crash Course</a> — miễn phí, có hướng dẫn từng bước và bài tập tương tác.</li>
<li><a href="https://scikit-learn.org/stable/" target="_blank" rel="noopener">Tài liệu scikit-learn</a> — thư viện đứng sau hầu hết ví dụ code trong môn này.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — giải thích rõ ràng nhất về hồi quy, cây quyết định, đánh giá mô hình.</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown — Neural networks</a> — trực giác hình ảnh về deep learning, không cần toán nặng.</li>
</ul>
<h3>🛠️ Công cụ (không cần cài đặt)</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — chạy các ví dụ Python của môn ngay trên trình duyệt, miễn phí.</li>
<li><a href="https://www.kaggle.com/" target="_blank" rel="noopener">Kaggle</a> — dữ liệu kiểu doanh nghiệp thật (doanh số, churn, tín dụng) để luyện tập.</li>
<li><a href="https://teachablemachine.withgoogle.com/" target="_blank" rel="noopener">Google Teachable Machine</a> — huấn luyện một bộ phân loại đơn giản không cần code, để có trực giác trước.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — ML là gì, quy trình ML, phân biệt hồi quy/phân lớp/phân cụm.</li>
<li><strong>Luyện tập</strong> — chạy các đoạn Python trong Colab trên một bộ dữ liệu Kaggle nhỏ (churn hoặc doanh số).</li>
<li><strong>Đào sâu</strong> — đánh giá mô hình, overfitting, cây quyết định &amp; random forest.</li>
<li><strong>Sẵn sàng đi làm</strong> — gắn từng kỹ thuật vào một quyết định thật: định giá, giữ khách, tín dụng, phân khúc — và biết giới hạn cùng đạo đức của nó.</li>
</ol></div>`,
  ]]);

const intro = doc('mcl201-0-1-overview', 'Course overview: Machine Learning for business|||Tổng quan: Machine Learning cho kinh doanh',
  'ML là gì (máy học quy luật từ dữ liệu, không lập trình quy tắc thủ công); ba nhóm bài toán chính; ứng dụng trong marketing, tài chính, vận hành, nhân sự.',
  [[
    `<span class="eyebrow">MCL201 · Lesson 0.1 · Overview</span>
<h2>Machine Learning for Business</h2>
<p class="lead">This course is not about becoming a data scientist — it is about becoming a manager who can <strong>ask the right questions of a model, read its output correctly, and know when to trust it</strong>. We use real business scenarios: forecasting sales, predicting which customers will leave, segmenting a customer base, and scoring credit risk.</p>
<h3>What "machine learning" actually means</h3>
<p>Traditional software: a human writes explicit rules ("if a customer has not bought in 90 days, flag them as at-risk"). <strong>Machine learning</strong> flips this: you give the computer many past examples (data), and it <em>learns the rule itself</em> — usually a rule far more accurate and far harder for a human to write by hand.</p>
<h3>Three families of problems</h3>
<ul>
<li><strong>Regression</strong> — predict a number (next month's revenue, a fair price).</li>
<li><strong>Classification</strong> — predict a category (will this customer churn: yes/no; is this transaction fraud: yes/no).</li>
<li><strong>Clustering</strong> — find hidden groups with no pre-set labels (which customer segments naturally exist in our data).</li>
</ul>
<h3>Where businesses actually use it</h3>
<ul>
<li><strong>Marketing</strong> — customer segmentation, personalized offers, churn prediction.</li>
<li><strong>Finance</strong> — credit scoring, fraud detection, demand/price forecasting.</li>
<li><strong>Operations</strong> — inventory and demand forecasting, quality control.</li>
<li><strong>HR</strong> — predicting employee attrition, resume screening (with real ethical risk — see Chapter 8).</li>
</ul>
<h3>Roadmap</h3>
<p>What ML is &amp; where it fits (Ch.1) → the ML workflow &amp; preparing data (Ch.2) → regression (Ch.3) → classification (Ch.4) → clustering / customer segmentation (Ch.5) → how to know a model is actually good, and the trap of overfitting (Ch.6) → decision trees, random forests &amp; ensembles — the workhorses of real business ML (Ch.7) → a light intro to AI/deep learning, data ethics, and how a model actually gets deployed at a company (Ch.8).</p>`,
    `<span class="eyebrow">MCL201 · Bài 0.1 · Tổng quan</span>
<h2>Machine Learning cho kinh doanh</h2>
<p class="lead">Môn này không nhằm biến bạn thành một data scientist — mà nhằm biến bạn thành người quản lý biết <strong>đặt đúng câu hỏi cho một mô hình, đọc đúng kết quả nó trả ra, và biết khi nào nên tin nó</strong>. Ta dùng các tình huống kinh doanh thật: dự báo doanh số, dự đoán khách hàng nào sẽ rời bỏ, phân khúc tập khách hàng, và tính điểm tín dụng.</p>
<h3>"Machine learning" nghĩa là gì</h3>
<p>Phần mềm truyền thống: con người viết quy tắc rõ ràng ("nếu khách không mua gì trong 90 ngày, gắn cờ có nguy cơ rời bỏ"). <strong>Machine learning</strong> đảo ngược cách làm: bạn đưa máy nhiều ví dụ trong quá khứ (dữ liệu), và nó <em>tự học ra quy tắc</em> — thường chính xác hơn nhiều và khó để con người viết tay.</p>
<h3>Ba nhóm bài toán</h3>
<ul>
<li><strong>Hồi quy (regression)</strong> — dự đoán một con số (doanh thu tháng tới, mức giá hợp lý).</li>
<li><strong>Phân lớp (classification)</strong> — dự đoán một nhóm (khách này có rời bỏ không: có/không; giao dịch này có phải lừa đảo không: có/không).</li>
<li><strong>Phân cụm (clustering)</strong> — tìm các nhóm ẩn mà không có nhãn định trước (khách hàng của ta tự nhiên chia thành những phân khúc nào).</li>
</ul>
<h3>Doanh nghiệp thực sự dùng ML ở đâu</h3>
<ul>
<li><strong>Marketing</strong> — phân khúc khách hàng, ưu đãi cá nhân hoá, dự đoán churn.</li>
<li><strong>Tài chính</strong> — tính điểm tín dụng, phát hiện gian lận, dự báo nhu cầu/giá.</li>
<li><strong>Vận hành</strong> — dự báo nhu cầu &amp; tồn kho, kiểm soát chất lượng.</li>
<li><strong>Nhân sự</strong> — dự đoán nghỉ việc, lọc CV (kèm rủi ro đạo đức thật — xem Chương 8).</li>
</ul>
<h3>Lộ trình</h3>
<p>ML là gì &amp; nằm ở đâu (Ch.1) → quy trình ML &amp; chuẩn bị dữ liệu (Ch.2) → hồi quy (Ch.3) → phân lớp (Ch.4) → phân cụm / phân khúc khách hàng (Ch.5) → làm sao biết một mô hình thực sự tốt, và cái bẫy overfitting (Ch.6) → cây quyết định, random forest &amp; ensemble — công cụ chủ lực của ML kinh doanh thật (Ch.7) → nhập môn nhẹ AI/deep learning, đạo đức dữ liệu, và cách một mô hình thực sự được triển khai ở doanh nghiệp (Ch.8).</p>`,
  ]]);

const c1 = doc('mcl201-1-1-what-is-ml', '1.1 — What is machine learning & business applications|||1.1 — Machine learning là gì & ứng dụng kinh doanh',
  'ML học quy luật từ dữ liệu; ba nhóm bài toán (hồi quy/phân lớp/phân cụm); vòng đời từ dữ liệu → mô hình → quyết định kinh doanh; khi nào ML đáng dùng.',
  [[
    `<span class="eyebrow">MCL201 · Chapter 1 · Lesson 1.1</span>
<h2>What is machine learning &amp; business applications</h2>
<h3>Rules vs. learning</h3>
<p>A traditional rule ("discount customers who spent over 10,000,000 VND last year") is written by a human and stays fixed. A <strong>machine learning model</strong> is trained on thousands of past customers and their outcomes, and it discovers patterns a human analyst would likely miss — combinations of age, spending, visit frequency, and product mix that actually predict loyalty.</p>
<h3>From data to a business decision</h3>
<pre><code>Historical data  -&gt;  Train a model  -&gt;  Model makes predictions
(past customers,      (it finds the         on NEW customers
 with known outcome)   pattern)             -&gt;  business decision
                                                 (who to target,
                                                  what price, etc.)
</code></pre>
<h3>Three problem types, one business question each</h3>
<ul>
<li><strong>Regression</strong> — "How much will this customer spend next quarter?"</li>
<li><strong>Classification</strong> — "Will this loan applicant default: yes or no?"</li>
<li><strong>Clustering</strong> — "What natural groups exist inside our customer base?"</li>
</ul>
<h3>When ML is (and is not) worth it</h3>
<p>ML pays off when you have <strong>enough historical data</strong>, the pattern is <strong>too complex for a simple rule</strong>, and the decision repeats often enough that a small accuracy gain adds up (e.g. millions of transactions). It is usually overkill for a one-off decision, or when you have almost no data to learn from.</p>
<div class="callout"><span class="badge">Business takeaway</span> ML does not replace business judgment — it replaces guessing with a pattern learned from your own company's history. The manager's job is choosing the right question and the right data, not writing the algorithm.</div>`,
    `<span class="eyebrow">MCL201 · Chương 1 · Bài 1.1</span>
<h2>Machine learning là gì & ứng dụng kinh doanh</h2>
<h3>Quy tắc thủ công vs. học từ dữ liệu</h3>
<p>Một quy tắc truyền thống ("giảm giá cho khách chi trên 10.000.000 VNĐ năm ngoái") do con người viết ra và giữ cố định. Một <strong>mô hình machine learning</strong> được huấn luyện trên hàng nghìn khách hàng quá khứ cùng kết quả đã biết, và nó phát hiện ra những khuôn mẫu mà một chuyên viên phân tích khó nhìn thấy — sự kết hợp giữa tuổi, mức chi tiêu, tần suất ghé mua và nhóm sản phẩm thực sự dự báo được sự trung thành.</p>
<h3>Từ dữ liệu tới quyết định kinh doanh</h3>
<pre><code>Dữ liệu lịch sử  -&gt;  Huấn luyện mô hình  -&gt;  Mô hình dự đoán
(khách hàng cũ,        (mô hình tìm ra          trên khách hàng MỚI
 đã biết kết quả)       khuôn mẫu)              -&gt;  quyết định kinh doanh
                                                     (nhắm ai, giá nào...)
</code></pre>
<h3>Ba nhóm bài toán, mỗi nhóm gắn với một câu hỏi kinh doanh</h3>
<ul>
<li><strong>Hồi quy (regression)</strong> — "Khách này sẽ chi bao nhiêu quý tới?"</li>
<li><strong>Phân lớp (classification)</strong> — "Người vay này có vỡ nợ không: có hay không?"</li>
<li><strong>Phân cụm (clustering)</strong> — "Tập khách hàng của ta tự nhiên chia thành nhóm nào?"</li>
</ul>
<h3>Khi nào ML đáng dùng (và khi nào không)</h3>
<p>ML đáng dùng khi bạn có <strong>đủ dữ liệu lịch sử</strong>, khuôn mẫu <strong>quá phức tạp để viết thành quy tắc đơn giản</strong>, và quyết định lặp lại đủ nhiều để một chút chính xác hơn cộng dồn thành giá trị lớn (ví dụ hàng triệu giao dịch). ML thường thừa thãi cho một quyết định chỉ xảy ra một lần, hoặc khi gần như không có dữ liệu để học.</p>
<div class="callout"><span class="badge">Bài học kinh doanh</span> ML không thay thế phán đoán kinh doanh — nó thay việc đoán mò bằng một khuôn mẫu học được từ chính lịch sử của công ty. Việc của người quản lý là chọn đúng câu hỏi và đúng dữ liệu, không phải viết thuật toán.</div>`,
  ]]);

const c1q = quiz('mcl201-quiz-1', 'Quiz 1 — What is ML|||Quiz 1 — ML là gì', [
  { id: 'q1', question: 'Machine learning khác quy tắc thủ công (rule-based) truyền thống ở điểm nào?', options: ['ML luôn chạy nhanh hơn', 'ML tự học khuôn mẫu từ dữ liệu quá khứ thay vì con người viết quy tắc cố định', 'ML không cần dữ liệu', 'ML chỉ dùng được trong công nghệ'], correctIndex: 1, explanation: 'ML học quy luật từ dữ liệu lịch sử, thay cho việc con người viết quy tắc cố định.' },
  { id: 'q2', question: 'Bài toán "khách hàng này sẽ chi bao nhiêu tiền quý tới" thuộc nhóm nào?', options: ['Phân lớp (classification)', 'Phân cụm (clustering)', 'Hồi quy (regression)', 'Không thuộc ML'], correctIndex: 2, explanation: 'Dự đoán một con số (số tiền) là bài toán hồi quy.' },
  { id: 'q3', question: 'ML thường ĐÁNG dùng nhất khi nào?', options: ['Khi quyết định chỉ xảy ra một lần duy nhất', 'Khi có đủ dữ liệu lịch sử và quyết định lặp lại nhiều lần', 'Khi không có dữ liệu nào', 'Khi quy tắc đơn giản đã đủ chính xác'], correctIndex: 1, explanation: 'ML cần dữ liệu để học và trả giá trị lớn nhất khi quyết định lặp lại thường xuyên.' },
]);

const c2 = doc('mcl201-2-1-workflow-data-prep', '2.1 — The ML workflow & data preparation|||2.1 — Quy trình ML & chuẩn bị dữ liệu',
  'Vòng đời dự án ML: xác định bài toán → thu thập & làm sạch dữ liệu → chia train/test → huấn luyện → đánh giá → triển khai; vì sao "rác vào, rác ra".',
  [[
    `<span class="eyebrow">MCL201 · Chapter 2 · Lesson 2.1</span>
<h2>The ML workflow &amp; data preparation</h2>
<h3>The project lifecycle</h3>
<pre><code>1. Define the business question  ("predict which customers will churn")
2. Collect &amp; clean the data      (past customer records)
3. Split: training set / test set
4. Train the model on the training set
5. Evaluate it on the test set (data it has NEVER seen)
6. Deploy &amp; monitor it in production
</code></pre>
<h3>Garbage in, garbage out</h3>
<p>A model can only be as good as the data it learns from. Common real-world problems: <strong>missing values</strong> (a customer's income field is blank), <strong>inconsistent formats</strong> (dates as "01/02/2026" vs "2026-02-01"), and <strong>duplicate or outdated records</strong>. Most real ML projects spend far more time cleaning data than tuning the model itself.</p>
<h3>Why split the data</h3>
<p>If you test a model on the same data it was trained on, it looks perfect but tells you nothing — it may have simply memorized the answers. Splitting into a <strong>training set</strong> (learn from) and a <strong>test set</strong> (never seen during training) is how you honestly check whether the model generalizes to new customers.</p>
<pre><code>from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)   # 80% train, 20% test
</code></pre>
<div class="callout"><span class="badge">Business takeaway</span> Before asking "which algorithm should we use", ask "do we actually have clean, relevant data about the thing we want to predict". Data quality decides the ceiling; the algorithm only decides how close you get to it.</div>`,
    `<span class="eyebrow">MCL201 · Chương 2 · Bài 2.1</span>
<h2>Quy trình ML & chuẩn bị dữ liệu</h2>
<h3>Vòng đời một dự án ML</h3>
<pre><code>1. Xác định câu hỏi kinh doanh   ("dự đoán khách hàng nào sẽ rời bỏ")
2. Thu thập &amp; làm sạch dữ liệu   (hồ sơ khách hàng cũ)
3. Chia: tập huấn luyện / tập kiểm tra
4. Huấn luyện mô hình trên tập huấn luyện
5. Đánh giá trên tập kiểm tra (dữ liệu mô hình CHƯA từng thấy)
6. Triển khai &amp; theo dõi trong thực tế
</code></pre>
<h3>Rác vào, rác ra</h3>
<p>Mô hình chỉ tốt bằng dữ liệu nó học từ. Các vấn đề thường gặp thật: <strong>thiếu giá trị</strong> (ô thu nhập của khách để trống), <strong>định dạng không đồng nhất</strong> (ngày ghi "01/02/2026" so với "2026-02-01"), và <strong>bản ghi trùng lặp hoặc lỗi thời</strong>. Hầu hết dự án ML thật dành nhiều thời gian làm sạch dữ liệu hơn là tinh chỉnh mô hình.</p>
<h3>Vì sao phải chia dữ liệu</h3>
<p>Nếu kiểm tra mô hình trên đúng dữ liệu nó đã học, kết quả sẽ trông hoàn hảo nhưng không nói lên điều gì — mô hình có thể chỉ đang "học vẹt" đáp án. Chia thành <strong>tập huấn luyện</strong> (để học) và <strong>tập kiểm tra</strong> (chưa từng thấy khi huấn luyện) là cách kiểm tra trung thực xem mô hình có tổng quát hoá được cho khách hàng mới hay không.</p>
<pre><code>from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)   # 80% huan luyen, 20% kiem tra
</code></pre>
<div class="callout"><span class="badge">Bài học kinh doanh</span> Trước khi hỏi "nên dùng thuật toán nào", hãy hỏi "ta có thực sự có dữ liệu sạch và liên quan tới điều cần dự đoán không". Chất lượng dữ liệu quyết định trần cao nhất; thuật toán chỉ quyết định bạn tới gần trần đó bao nhiêu.</div>`,
  ]]);

const c2q = quiz('mcl201-quiz-2', 'Quiz 2 — Workflow & data prep|||Quiz 2 — Quy trình & chuẩn bị dữ liệu', [
  { id: 'q1', question: 'Vì sao phải chia dữ liệu thành tập huấn luyện và tập kiểm tra?', options: ['Để mô hình chạy nhanh hơn', 'Để kiểm tra trung thực mô hình có dự đoán tốt trên dữ liệu MỚI không', 'Vì luật bắt buộc', 'Để tiết kiệm dung lượng lưu trữ'], correctIndex: 1, explanation: 'Tập kiểm tra là dữ liệu mô hình chưa từng thấy, dùng để đánh giá khả năng tổng quát hoá thật.' },
  { id: 'q2', question: '"Rác vào, rác ra" trong ML nghĩa là gì?', options: ['Mô hình phức tạp luôn tốt hơn', 'Chất lượng dữ liệu đầu vào quyết định trần chất lượng của mô hình', 'Cần vứt bỏ dữ liệu cũ', 'Thuật toán quan trọng hơn dữ liệu'], correctIndex: 1, explanation: 'Dữ liệu thiếu/sai/không đồng nhất khiến mô hình học sai, bất kể thuật toán tốt thế nào.' },
  { id: 'q3', question: 'Bước nào trong quy trình ML thường tốn nhiều thời gian nhất trong thực tế?', options: ['Chọn tên biến cho mô hình', 'Thu thập & làm sạch dữ liệu', 'In kết quả ra màn hình', 'Đặt lại máy tính'], correctIndex: 1, explanation: 'Làm sạch dữ liệu (thiếu, trùng, sai định dạng) thường chiếm phần lớn thời gian dự án ML thật.' },
]);

const c3 = doc('mcl201-3-1-regression', '3.1 — Supervised learning: regression|||3.1 — Học có giám sát: hồi quy',
  'Hồi quy dự đoán một con số liên tục: dự báo doanh số, định giá; hồi quy tuyến tính đơn giản; đọc hệ số như câu chuyện kinh doanh; sai số dự báo.',
  [[
    `<span class="eyebrow">MCL201 · Chapter 3 · Lesson 3.1</span>
<h2>Supervised learning: regression</h2>
<h3>The idea: draw the best line through the data</h3>
<p><strong>Regression</strong> predicts a continuous number. Give a model past examples of (marketing spend, price, season) paired with the actual sales that resulted, and it learns a formula connecting the inputs to the number you want to predict.</p>
<pre><code>from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_train, y_train)     # X: marketing spend, price ; y: sales
model.predict([[5000, 199000]]) # forecast sales for a new plan
</code></pre>
<h3>Reading the coefficients like a business story</h3>
<p>A linear regression is not a black box — each input gets a coefficient you can read directly: "every extra 1,000,000 VND of marketing spend is associated with +X units of sales, holding price constant." This is why regression is often preferred in business over more accurate but opaque models — <strong>you can explain the "why" to a manager or a regulator</strong>.</p>
<h3>How wrong is the forecast, really</h3>
<p>No forecast is perfect. We measure the average distance between predicted and actual sales — a smaller error means a more reliable forecast, but a business must also decide how much error is acceptable for the decision at hand (e.g. inventory planning tolerates more error than a legal price commitment).</p>
<div class="callout"><span class="badge">Business use cases</span> Sales forecasting, dynamic pricing, revenue prediction, demand forecasting for inventory — anywhere the answer you need is a number.</div>`,
    `<span class="eyebrow">MCL201 · Chương 3 · Bài 3.1</span>
<h2>Học có giám sát: hồi quy</h2>
<h3>Ý tưởng: vẽ đường phù hợp nhất qua dữ liệu</h3>
<p><strong>Hồi quy (regression)</strong> dự đoán một con số liên tục. Đưa cho mô hình các ví dụ quá khứ (chi phí marketing, giá bán, mùa vụ) đi kèm doanh số thực tế đã xảy ra, mô hình sẽ học ra một công thức nối các đầu vào với con số cần dự đoán.</p>
<pre><code>from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_train, y_train)     # X: chi phi marketing, gia ; y: doanh so
model.predict([[5000, 199000]]) # du bao doanh so cho ke hoach moi
</code></pre>
<h3>Đọc hệ số như một câu chuyện kinh doanh</h3>
<p>Hồi quy tuyến tính không phải hộp đen — mỗi đầu vào có một hệ số đọc được trực tiếp: "mỗi 1.000.000 VNĐ chi thêm cho marketing gắn với +X đơn vị doanh số, nếu giữ giá cố định." Đây là lý do hồi quy thường được ưa chuộng trong kinh doanh hơn các mô hình chính xác hơn nhưng khó giải thích — <strong>bạn có thể giải thích "tại sao" cho quản lý hoặc cơ quan quản lý</strong>.</p>
<h3>Dự báo sai bao nhiêu, thực sự</h3>
<p>Không dự báo nào hoàn hảo. Ta đo khoảng cách trung bình giữa doanh số dự đoán và thực tế — sai số nhỏ hơn nghĩa là dự báo đáng tin hơn, nhưng doanh nghiệp cũng phải quyết định mức sai số nào chấp nhận được cho quyết định cụ thể (ví dụ lập kế hoạch tồn kho chịu sai số cao hơn một cam kết giá pháp lý).</p>
<div class="callout"><span class="badge">Ứng dụng kinh doanh</span> Dự báo doanh số, định giá động, dự đoán doanh thu, dự báo nhu cầu cho tồn kho — bất cứ đâu câu trả lời cần là một con số.</div>`,
  ]]);

const c3q = quiz('mcl201-quiz-3', 'Quiz 3 — Regression|||Quiz 3 — Hồi quy', [
  { id: 'q1', question: 'Hồi quy (regression) dùng để dự đoán loại kết quả nào?', options: ['Một nhóm/nhãn (có/không)', 'Một con số liên tục (doanh số, giá)', 'Các nhóm ẩn trong dữ liệu', 'Không dự đoán gì cả'], correctIndex: 1, explanation: 'Hồi quy trả về một con số liên tục, ví dụ doanh số hoặc giá dự báo.' },
  { id: 'q2', question: 'Vì sao hồi quy tuyến tính thường được ưa chuộng trong kinh doanh?', options: ['Vì nó luôn chính xác nhất', 'Vì hệ số của nó đọc được và giải thích được cho quản lý', 'Vì nó không cần dữ liệu', 'Vì nó chạy trên điện thoại'], correctIndex: 1, explanation: 'Hệ số hồi quy cho biết mỗi đầu vào ảnh hưởng bao nhiêu tới kết quả, dễ giải thích.' },
  { id: 'q3', question: 'Vì sao cần quan tâm tới sai số dự báo (forecast error)?', options: ['Sai số không quan trọng nếu mô hình phức tạp', 'Sai số cho biết mức độ tin cậy được của dự báo cho quyết định kinh doanh', 'Sai số chỉ xuất hiện khi code lỗi', 'Sai số luôn bằng 0 với dữ liệu đủ lớn'], correctIndex: 1, explanation: 'Đo sai số giúp doanh nghiệp biết dự báo đáng tin tới đâu và có nên dùng cho quyết định cụ thể.' },
]);

const c4 = doc('mcl201-4-1-classification', '4.1 — Supervised learning: classification|||4.1 — Học có giám sát: phân lớp',
  'Phân lớp dự đoán một nhãn/nhóm: churn, tín dụng, gian lận; xác suất thay vì chỉ đúng/sai; đánh đổi giữa bỏ lỡ khách rời bỏ và làm phiền khách trung thành.',
  [[
    `<span class="eyebrow">MCL201 · Chapter 4 · Lesson 4.1</span>
<h2>Supervised learning: classification</h2>
<h3>The idea: sort things into categories</h3>
<p><strong>Classification</strong> predicts a category rather than a number: will this customer churn (yes/no)? Should this loan applicant be approved (yes/no)? Is this transaction fraudulent (yes/no)?</p>
<pre><code>from sklearn.linear_model import LogisticRegression
clf = LogisticRegression()
clf.fit(X_train, y_train)          # y: 1 = churned, 0 = stayed
clf.predict_proba(X_new)[:, 1]     # probability each customer churns
</code></pre>
<h3>Probabilities, not just a verdict</h3>
<p>Most business uses do not want just "churn: yes/no" — they want a <strong>probability</strong> ("this customer has a 78% chance of churning"), because that lets you rank customers and target the highest-risk ones first with a limited retention budget.</p>
<h3>The real trade-off: two kinds of mistakes</h3>
<p>A classifier can be wrong in two different ways, and businesses rarely weigh them equally:</p>
<ul>
<li><strong>Missing a customer who will actually churn</strong> — you lose them with no attempt to retain them.</li>
<li><strong>Flagging a loyal customer as "at risk"</strong> — you spend a retention offer on someone who was never leaving.</li>
</ul>
<p>Which mistake is worse depends entirely on the business context (a fraud model that misses fraud is far costlier than one with occasional false alarms) — this is a business decision, not a technical one.</p>
<div class="callout"><span class="badge">Business use cases</span> Churn prediction, credit approval, fraud detection, spam filtering, targeted marketing (will this customer respond to an offer?).</div>`,
    `<span class="eyebrow">MCL201 · Chương 4 · Bài 4.1</span>
<h2>Học có giám sát: phân lớp</h2>
<h3>Ý tưởng: xếp mọi thứ vào các nhóm</h3>
<p><strong>Phân lớp (classification)</strong> dự đoán một nhóm/nhãn thay vì một con số: khách này có rời bỏ không (có/không)? Người vay này có nên được duyệt không (có/không)? Giao dịch này có phải gian lận không (có/không)?</p>
<pre><code>from sklearn.linear_model import LogisticRegression
clf = LogisticRegression()
clf.fit(X_train, y_train)          # y: 1 = da roi bo, 0 = con lai
clf.predict_proba(X_new)[:, 1]     # xac suat moi khach hang roi bo
</code></pre>
<h3>Xác suất, không chỉ là một phán quyết</h3>
<p>Hầu hết ứng dụng kinh doanh không chỉ muốn "churn: có/không" — họ muốn một <strong>xác suất</strong> ("khách này có 78% khả năng rời bỏ"), vì điều đó cho phép xếp hạng khách hàng và ưu tiên nhóm rủi ro cao nhất khi ngân sách giữ khách có hạn.</p>
<h3>Đánh đổi thật: hai kiểu sai lầm</h3>
<p>Một mô hình phân lớp có thể sai theo hai cách khác nhau, và doanh nghiệp hiếm khi coi hai loại sai này ngang nhau:</p>
<ul>
<li><strong>Bỏ lỡ một khách hàng thực sự sẽ rời bỏ</strong> — mất khách mà không kịp nỗ lực giữ lại.</li>
<li><strong>Gắn cờ "có nguy cơ" cho một khách hàng trung thành</strong> — tốn một ưu đãi giữ khách cho người chưa bao giờ định rời đi.</li>
</ul>
<p>Sai lầm nào tệ hơn hoàn toàn phụ thuộc vào bối cảnh kinh doanh (một mô hình gian lận bỏ lỡ gian lận thật thì tốn kém hơn nhiều so với việc báo động giả thỉnh thoảng) — đây là quyết định kinh doanh, không phải quyết định kỹ thuật.</p>
<div class="callout"><span class="badge">Ứng dụng kinh doanh</span> Dự đoán churn, duyệt tín dụng, phát hiện gian lận, lọc spam, marketing nhắm mục tiêu (khách này có phản hồi ưu đãi không?).</div>`,
  ]]);

const c4q = quiz('mcl201-quiz-4', 'Quiz 4 — Classification|||Quiz 4 — Phân lớp', [
  { id: 'q1', question: 'Phân lớp (classification) dùng để dự đoán loại kết quả nào?', options: ['Một con số liên tục', 'Một nhóm/nhãn (ví dụ churn: có/không)', 'Một tập dữ liệu mới', 'Một biểu đồ'], correctIndex: 1, explanation: 'Phân lớp trả về một nhãn rời rạc, ví dụ có/không rời bỏ.' },
  { id: 'q2', question: 'Vì sao ứng dụng kinh doanh thường muốn xác suất thay vì chỉ nhãn có/không?', options: ['Vì xác suất luôn chính xác 100%', 'Vì xác suất cho phép xếp hạng và ưu tiên khách hàng rủi ro cao nhất', 'Vì mô hình không tính được nhãn', 'Vì luật yêu cầu xác suất'], correctIndex: 1, explanation: 'Xác suất giúp xếp hạng để phân bổ nguồn lực (vd ngân sách giữ khách) hiệu quả hơn.' },
  { id: 'q3', question: 'Việc "bỏ lỡ một khách hàng thực sự sẽ rời bỏ" so với "báo động giả cho khách trung thành" — điều nào đúng?', options: ['Hai sai lầm này luôn có chi phí bằng nhau ở mọi doanh nghiệp', 'Sai lầm nào tệ hơn phụ thuộc vào bối cảnh kinh doanh cụ thể', 'Chỉ có một loại sai lầm tồn tại trong phân lớp', 'Mô hình phân lớp không bao giờ sai'], correctIndex: 1, explanation: 'Đây là một đánh đổi kinh doanh: chi phí của mỗi loại sai lầm khác nhau theo từng ngữ cảnh.' },
]);

const c5 = doc('mcl201-5-1-clustering', '5.1 — Unsupervised learning: customer segmentation|||5.1 — Học không giám sát: phân cụm khách hàng',
  'Phân cụm tìm nhóm ẩn không cần nhãn có sẵn; ví dụ RFM (Recency/Frequency/Monetary); K-means; đặt tên & hành động theo từng phân khúc.',
  [[
    `<span class="eyebrow">MCL201 · Chapter 5 · Lesson 5.1</span>
<h2>Unsupervised learning: customer segmentation</h2>
<h3>No labels, just structure</h3>
<p>Regression and classification both need a known outcome to learn from (past sales, past churn). <strong>Clustering</strong> is different: there is no "right answer" given in advance. The algorithm simply groups customers who look similar to each other, and it is up to you to interpret what each group means.</p>
<h3>A classic business recipe: RFM</h3>
<p>A common way to describe a customer numerically before clustering: <strong>Recency</strong> (how long since their last purchase), <strong>Frequency</strong> (how often they buy), <strong>Monetary</strong> (how much they spend). Feed these three numbers per customer into a clustering algorithm.</p>
<pre><code>from sklearn.cluster import KMeans
km = KMeans(n_clusters=4, random_state=42)
km.fit(X)          # X: [recency, frequency, monetary] per customer
km.labels_         # each customer's segment: 0, 1, 2 or 3
</code></pre>
<h3>From clusters to action</h3>
<p>K-means will happily return four numbered groups — the real work is naming them from their averages and deciding what to do: e.g. Group 0 = "loyal high-spenders" (reward with VIP perks), Group 2 = "big spenders gone quiet" (win-back campaign), Group 3 = "one-time low-value buyers" (low-cost automated emails, not a personal sales call).</p>
<div class="callout"><span class="badge">Business takeaway</span> Clustering does not tell you what to do — it tells you that hidden groups exist. Turning a cluster number into a marketing action is the manager's job, not the algorithm's.</div>`,
    `<span class="eyebrow">MCL201 · Chương 5 · Bài 5.1</span>
<h2>Học không giám sát: phân cụm khách hàng</h2>
<h3>Không có nhãn, chỉ có cấu trúc</h3>
<p>Cả hồi quy và phân lớp đều cần một kết quả đã biết để học (doanh số cũ, churn cũ). <strong>Phân cụm (clustering)</strong> khác: không có "đáp án đúng" cho trước. Thuật toán chỉ nhóm những khách hàng trông giống nhau lại với nhau, và việc diễn giải ý nghĩa từng nhóm là của bạn.</p>
<h3>Công thức kinh điển trong kinh doanh: RFM</h3>
<p>Một cách phổ biến để mô tả khách hàng bằng số trước khi phân cụm: <strong>Recency</strong> (bao lâu từ lần mua gần nhất), <strong>Frequency</strong> (mua thường xuyên thế nào), <strong>Monetary</strong> (chi tiêu bao nhiêu). Đưa ba con số này của mỗi khách vào thuật toán phân cụm.</p>
<pre><code>from sklearn.cluster import KMeans
km = KMeans(n_clusters=4, random_state=42)
km.fit(X)          # X: [recency, frequency, monetary] cua moi khach
km.labels_         # phan khuc cua moi khach: 0, 1, 2 hoac 3
</code></pre>
<h3>Từ phân cụm tới hành động</h3>
<p>K-means sẵn lòng trả về bốn nhóm được đánh số — việc thật sự là đặt tên chúng từ giá trị trung bình và quyết định hành động: ví dụ Nhóm 0 = "khách trung thành chi nhiều" (thưởng đặc quyền VIP), Nhóm 2 = "khách chi nhiều nhưng đã im ắng" (chiến dịch kéo lại), Nhóm 3 = "khách mua một lần, giá trị thấp" (email tự động chi phí thấp, không cần gọi điện chăm sóc).</p>
<div class="callout"><span class="badge">Bài học kinh doanh</span> Phân cụm không nói cho bạn biết phải làm gì — nó chỉ nói rằng có những nhóm ẩn tồn tại. Biến một số hiệu phân cụm thành hành động marketing là việc của người quản lý, không phải của thuật toán.</div>`,
  ]]);

const c5q = quiz('mcl201-quiz-5', 'Quiz 5 — Clustering|||Quiz 5 — Phân cụm', [
  { id: 'q1', question: 'Khác biệt chính giữa phân cụm và phân lớp là gì?', options: ['Phân cụm cần nhãn có sẵn, phân lớp thì không', 'Phân cụm KHÔNG cần nhãn có sẵn, nó tự tìm nhóm; phân lớp cần nhãn đã biết để học', 'Hai kỹ thuật hoàn toàn giống nhau', 'Phân cụm chỉ dùng được cho số nguyên'], correctIndex: 1, explanation: 'Phân cụm là học không giám sát — không có đáp án đúng cho trước, khác với phân lớp.' },
  { id: 'q2', question: 'RFM trong phân khúc khách hàng gồm ba yếu tố nào?', options: ['Doanh thu, Chi phí, Lợi nhuận', 'Recency, Frequency, Monetary (gần đây/tần suất/chi tiêu)', 'Tuổi, Giới tính, Vùng miền', 'Giá, Số lượng, Kho hàng'], correctIndex: 1, explanation: 'RFM = Recency (gần đây), Frequency (tần suất), Monetary (chi tiêu).' },
  { id: 'q3', question: 'Sau khi K-means trả ra 4 nhóm khách hàng, bước tiếp theo quan trọng nhất là gì?', options: ['Dừng lại, không cần làm gì thêm', 'Diễn giải ý nghĩa từng nhóm và quyết định hành động marketing phù hợp', 'Xoá bớt các nhóm nhỏ', 'Chạy lại mô hình cho tới khi ra đúng 2 nhóm'], correctIndex: 1, explanation: 'Thuật toán chỉ tìm nhóm; đặt tên và biến chúng thành hành động là việc của con người.' },
]);

const c6 = doc('mcl201-6-1-evaluation-overfitting', '6.1 — Model evaluation & overfitting|||6.1 — Đánh giá mô hình & overfitting',
  'Accuracy có thể lừa với dữ liệu mất cân bằng; ma trận nhầm lẫn; overfitting = học vẹt dữ liệu huấn luyện, tệ trên dữ liệu mới; cách phát hiện & giảm.',
  [[
    `<span class="eyebrow">MCL201 · Chapter 6 · Lesson 6.1</span>
<h2>Model evaluation &amp; overfitting</h2>
<h3>Accuracy can lie to you</h3>
<p>Imagine only 2% of transactions are fraudulent. A model that always predicts "not fraud" is <strong>98% accurate</strong> — and completely useless. This is why, for imbalanced business problems (churn, fraud, default), a single accuracy number is dangerous; you also need to check how many of the actual fraud cases were actually caught.</p>
<pre><code>from sklearn.metrics import confusion_matrix
confusion_matrix(y_test, y_pred)
# rows: actual (fraud / not fraud)
# columns: predicted (fraud / not fraud)
# reveals BOTH kinds of mistakes from Chapter 4 at once
</code></pre>
<h3>Overfitting: memorizing instead of learning</h3>
<p>A model that is 99% accurate on the data it trained on but only 60% accurate on new data has not learned a real pattern — it has <strong>memorized</strong> the training examples, including their noise and quirks. This is the single most common way an ML project fails quietly: it looks great in the report and performs badly once deployed.</p>
<pre><code>Training accuracy: 99%   -- looks amazing
Test accuracy:      61%   -- the real, honest number
=&gt; large gap = overfitting; the model will disappoint in production
</code></pre>
<h3>What reduces overfitting</h3>
<p>More (and more representative) training data, a simpler model when the problem does not need a complex one, and always judging a model by its <strong>test-set</strong> performance — never its training-set performance.</p>
<div class="callout"><span class="badge">Business takeaway</span> Never approve a model based on a single "accuracy: 99%" slide. Ask: accuracy on what data, and does it catch the cases that actually cost the business money?</div>`,
    `<span class="eyebrow">MCL201 · Chương 6 · Bài 6.1</span>
<h2>Đánh giá mô hình & overfitting</h2>
<h3>Độ chính xác (accuracy) có thể lừa bạn</h3>
<p>Giả sử chỉ 2% giao dịch là gian lận. Một mô hình luôn dự đoán "không gian lận" đạt <strong>98% chính xác</strong> — và hoàn toàn vô dụng. Đây là lý do với các bài toán kinh doanh mất cân bằng (churn, gian lận, vỡ nợ), một con số accuracy duy nhất rất nguy hiểm; bạn cần kiểm tra thêm bao nhiêu trường hợp gian lận thật đã thực sự bị bắt được.</p>
<pre><code>from sklearn.metrics import confusion_matrix
confusion_matrix(y_test, y_pred)
# hang: thuc te (gian lan / khong gian lan)
# cot: du doan (gian lan / khong gian lan)
# lo ra CA HAI kieu sai lam o Chuong 4 cung mot luc
</code></pre>
<h3>Overfitting: học vẹt thay vì học thật</h3>
<p>Một mô hình đạt 99% chính xác trên dữ liệu nó đã huấn luyện nhưng chỉ 60% trên dữ liệu mới chưa học được khuôn mẫu thật — nó đã <strong>học vẹt</strong> các ví dụ huấn luyện, gồm cả nhiễu và đặc điểm riêng lẻ của chúng. Đây là cách một dự án ML thất bại âm thầm phổ biến nhất: trông rất đẹp trong báo cáo nhưng chạy kém khi triển khai thật.</p>
<pre><code>Do chinh xac tren tap huan luyen: 99%   -- nhin rat dep
Do chinh xac tren tap kiem tra:    61%   -- con so thuc, trung thuc
=&gt; chenh lech lon = overfitting; mo hinh se lam that vong khi trien khai
</code></pre>
<h3>Điều gì làm giảm overfitting</h3>
<p>Nhiều dữ liệu huấn luyện hơn (và đại diện hơn), một mô hình đơn giản hơn khi bài toán không cần độ phức tạp cao, và luôn đánh giá mô hình bằng hiệu năng trên <strong>tập kiểm tra</strong> — không bao giờ dựa vào tập huấn luyện.</p>
<div class="callout"><span class="badge">Bài học kinh doanh</span> Không bao giờ phê duyệt một mô hình chỉ vì một slide "accuracy: 99%". Hãy hỏi: chính xác trên dữ liệu nào, và mô hình có bắt được đúng những trường hợp thực sự gây tốn tiền cho doanh nghiệp không?</div>`,
  ]]);

const c6q = quiz('mcl201-quiz-6', 'Quiz 6 — Evaluation & overfitting|||Quiz 6 — Đánh giá & overfitting', [
  { id: 'q1', question: 'Vì sao accuracy 98% có thể vô nghĩa với bài toán phát hiện gian lận (chỉ 2% giao dịch là gian lận)?', options: ['Vì 98% luôn là con số thấp', 'Vì một mô hình luôn đoán "không gian lận" cũng đạt 98% accuracy mà vô dụng', 'Vì accuracy không thể tính được cho bài toán mất cân bằng', 'Vì gian lận không thể dự đoán bằng ML'], correctIndex: 1, explanation: 'Với dữ liệu mất cân bằng, accuracy cao có thể chỉ phản ánh việc đoán theo nhóm đa số.' },
  { id: 'q2', question: 'Overfitting là gì?', options: ['Mô hình chạy quá chậm', 'Mô hình học vẹt dữ liệu huấn luyện, đạt kết quả tốt trên đó nhưng kém trên dữ liệu mới', 'Mô hình không học được gì cả', 'Mô hình có quá ít dữ liệu để chạy'], correctIndex: 1, explanation: 'Overfitting: khoảng cách lớn giữa hiệu năng trên tập huấn luyện và tập kiểm tra.' },
  { id: 'q3', question: 'Nên đánh giá một mô hình dựa trên hiệu năng ở đâu để biết nó có dùng được thật không?', options: ['Trên tập huấn luyện (training set)', 'Trên tập kiểm tra (test set) — dữ liệu mô hình chưa từng thấy', 'Trên báo cáo của nhóm phát triển', 'Không cần đánh giá nếu accuracy huấn luyện cao'], correctIndex: 1, explanation: 'Hiệu năng trên tập kiểm tra mới phản ánh trung thực khả năng dự đoán dữ liệu mới.' },
]);

const c7 = doc('mcl201-7-1-trees-forests-ensembles', '7.1 — Decision trees, random forest & ensembles|||7.1 — Cây quyết định, random forest & ensemble',
  'Cây quyết định = chuỗi câu hỏi có/không dễ đọc; random forest = nhiều cây kết hợp, chính xác hơn; feature importance = yếu tố nào ảnh hưởng nhất.',
  [[
    `<span class="eyebrow">MCL201 · Chapter 7 · Lesson 7.1</span>
<h2>Decision trees, random forest &amp; ensembles</h2>
<h3>A decision tree: a flowchart you already understand</h3>
<p>A <strong>decision tree</strong> is a sequence of yes/no questions, exactly like a manager's own mental checklist: "Has the customer bought in the last 60 days? If no -&gt; has their spending dropped over 50%? If yes -&gt; high churn risk." Its biggest strength in business is that <strong>you can print it and read it out loud</strong> — no statistics background needed.</p>
<pre><code>Has bought in last 60 days?
  |-- Yes -&gt; Low churn risk
  |-- No  -&gt; Spending dropped &gt; 50%?
              |-- Yes -&gt; High churn risk
              |-- No  -&gt; Medium churn risk
</code></pre>
<h3>The catch: a single tree overfits easily</h3>
<p>One tree tends to memorize quirks of its training data (Chapter 6's overfitting problem). The fix, and the real workhorse of business ML today, is a <strong>random forest</strong>: train hundreds of slightly different trees, each on a random slice of the data, and average their votes.</p>
<pre><code>from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators=200, max_depth=5)
rf.fit(X_train, y_train)
rf.feature_importances_    # which factors matter most to the prediction
</code></pre>
<h3>Feature importance: a business-readable output</h3>
<p>A random forest loses the simple flowchart, but it gives you back <strong>feature importance</strong> — a ranked list of which inputs actually drive the prediction (e.g. "recency of last purchase" matters 3× more than "customer age" for churn). This is one of the most business-useful outputs in all of ML.</p>
<div class="callout"><span class="badge">Business takeaway</span> Random forests are the default "good enough, hard to break" choice for many real business classification and regression problems — a strong balance of accuracy and interpretability via feature importance.</div>`,
    `<span class="eyebrow">MCL201 · Chương 7 · Bài 7.1</span>
<h2>Cây quyết định, random forest & ensemble</h2>
<h3>Cây quyết định: một sơ đồ bạn đã hiểu sẵn</h3>
<p>Một <strong>cây quyết định (decision tree)</strong> là một chuỗi câu hỏi có/không, giống hệt danh sách kiểm tra trong đầu của một người quản lý: "Khách có mua trong 60 ngày qua không? Nếu không -&gt; chi tiêu có giảm hơn 50% không? Nếu có -&gt; nguy cơ churn cao." Điểm mạnh lớn nhất của nó trong kinh doanh là <strong>bạn có thể in ra và đọc thành lời</strong> — không cần kiến thức thống kê.</p>
<pre><code>Da mua trong 60 ngay qua?
  |-- Co  -&gt; Nguy co churn thap
  |-- Khong -&gt; Chi tieu giam &gt; 50%?
              |-- Co  -&gt; Nguy co churn cao
              |-- Khong -&gt; Nguy co churn trung binh
</code></pre>
<h3>Vấn đề: một cây đơn dễ bị overfitting</h3>
<p>Một cây đơn có xu hướng học vẹt các đặc điểm riêng của dữ liệu huấn luyện (vấn đề overfitting ở Chương 6). Cách giải quyết, cũng là công cụ chủ lực thật của ML kinh doanh hiện nay, là <strong>random forest</strong>: huấn luyện hàng trăm cây hơi khác nhau, mỗi cây trên một lát cắt ngẫu nhiên của dữ liệu, rồi lấy trung bình phiếu bầu của chúng.</p>
<pre><code>from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators=200, max_depth=5)
rf.fit(X_train, y_train)
rf.feature_importances_    # yeu to nao anh huong nhat toi du doan
</code></pre>
<h3>Feature importance: kết quả đọc được cho người kinh doanh</h3>
<p>Random forest mất đi sơ đồ đơn giản, nhưng đổi lại cho bạn <strong>feature importance</strong> — danh sách xếp hạng đầu vào nào thực sự dẫn dắt dự đoán (ví dụ "thời gian từ lần mua gần nhất" quan trọng gấp 3 lần "tuổi khách hàng" đối với churn). Đây là một trong những kết quả có giá trị kinh doanh nhất của cả ML.</p>
<div class="callout"><span class="badge">Bài học kinh doanh</span> Random forest là lựa chọn mặc định "đủ tốt, khó hỏng" cho nhiều bài toán phân lớp và hồi quy kinh doanh thật — cân bằng mạnh giữa độ chính xác và khả năng giải thích qua feature importance.</div>`,
  ]]);

const c7q = quiz('mcl201-quiz-7', 'Quiz 7 — Trees & ensembles|||Quiz 7 — Cây & ensemble', [
  { id: 'q1', question: 'Ưu điểm lớn nhất của một cây quyết định (decision tree) đơn trong kinh doanh là gì?', options: ['Luôn chính xác nhất trong mọi trường hợp', 'Dễ đọc và giải thích như một sơ đồ câu hỏi có/không', 'Không cần dữ liệu để huấn luyện', 'Không bao giờ bị overfitting'], correctIndex: 1, explanation: 'Cây quyết định trực quan, giống danh sách kiểm tra, dễ trình bày cho người không chuyên kỹ thuật.' },
  { id: 'q2', question: 'Random forest giải quyết vấn đề gì của một cây quyết định đơn?', options: ['Làm cây chạy nhanh hơn', 'Giảm overfitting bằng cách kết hợp nhiều cây khác nhau và lấy trung bình', 'Làm mô hình dễ đọc hơn một cây đơn', 'Loại bỏ hoàn toàn nhu cầu dữ liệu'], correctIndex: 1, explanation: 'Random forest huấn luyện nhiều cây trên các lát cắt dữ liệu khác nhau rồi kết hợp, giảm học vẹt.' },
  { id: 'q3', question: '"Feature importance" từ một random forest cho doanh nghiệp biết điều gì?', options: ['Mô hình chạy trên máy nào', 'Yếu tố đầu vào nào ảnh hưởng nhiều nhất tới kết quả dự đoán', 'Số lượng cây đã huấn luyện', 'Thời gian huấn luyện mô hình'], correctIndex: 1, explanation: 'Feature importance xếp hạng các yếu tố đầu vào theo mức độ ảnh hưởng tới dự đoán.' },
]);

const c8 = doc('mcl201-8-1-ai-ethics-deployment', '8.1 — Intro to AI/deep learning, data ethics & business deployment|||8.1 — Nhập môn AI/deep learning, đạo đức dữ liệu & triển khai kinh doanh',
  'Deep learning là gì (mạng nơ-ron nhiều tầng, học đặc trưng); thiên vị (bias) và quyền riêng tư dữ liệu; đưa mô hình từ notebook vào vận hành & giám sát.',
  [[
    `<span class="eyebrow">MCL201 · Chapter 8 · Lesson 8.1</span>
<h2>Intro to AI/deep learning, data ethics &amp; business deployment</h2>
<h3>Deep learning in one idea</h3>
<p>Everything so far learns from features you chose by hand (spending, recency, price). <strong>Deep learning</strong> uses a "neural network" — many layers of simple mathematical units stacked together — that can learn its own features directly from raw data like images, text, or audio. This is why it powers image recognition, chatbots, and recommendation feeds, at the cost of being far less explainable than a decision tree.</p>
<h3>Bias: a model can learn a company's bad habits</h3>
<p>A model trained on a company's past hiring decisions will learn to repeat that company's <em>past</em> pattern — including any past discrimination in who got hired, even if no one intended it. Amazon famously scrapped an internal resume-screening model in 2018 for exactly this reason: it had learned to downgrade resumes containing the word "women's" because past hiring data skewed male. <strong>The model was not malicious — it was accurate at reproducing history, which was the problem.</strong></p>
<h3>Data privacy</h3>
<p>Customer data used to train a model (purchase history, browsing behavior) is personal data — its collection, storage and use is bound by privacy law and customer trust, not just by what is technically possible.</p>
<h3>From a notebook to a running business system</h3>
<pre><code>A model in a notebook  -&gt;  A model plugged into
that "works" once           a live system that:
                             - runs on NEW data every day
                             - gets monitored for accuracy drop
                             - gets retrained when the business changes
</code></pre>
<p>A model is never "done" — customer behavior shifts, and a model trained on last year's data can quietly degrade. Deployment means ongoing monitoring, not a one-time delivery.</p>
<div class="callout"><span class="badge">Business takeaway</span> The manager's real responsibility with ML is not building the model — it is asking whether the training data reflects a past worth repeating, whether customer data is used with consent, and who keeps watching the model after launch.</div>`,
    `<span class="eyebrow">MCL201 · Chương 8 · Bài 8.1</span>
<h2>Nhập môn AI/deep learning, đạo đức dữ liệu & triển khai kinh doanh</h2>
<h3>Deep learning trong một ý tưởng</h3>
<p>Mọi thứ học từ trước tới nay đều dựa trên đặc trưng (feature) do con người chọn tay (chi tiêu, thời gian gần đây, giá). <strong>Deep learning</strong> dùng một "mạng nơ-ron" — nhiều tầng đơn vị toán học đơn giản xếp chồng lên nhau — có thể tự học ra đặc trưng của chính nó trực tiếp từ dữ liệu thô như ảnh, văn bản, âm thanh. Đây là lý do nó vận hành nhận diện ảnh, chatbot, và bảng gợi ý nội dung — đánh đổi lại là khó giải thích hơn nhiều so với một cây quyết định.</p>
<h3>Thiên vị (bias): mô hình có thể học lại thói xấu của công ty</h3>
<p>Một mô hình huấn luyện trên các quyết định tuyển dụng cũ của công ty sẽ học cách lặp lại đúng khuôn mẫu <em>trong quá khứ</em> đó — kể cả nếu quá khứ đó từng có phân biệt trong tuyển dụng, dù không ai cố ý. Amazon từng phải bỏ hẳn một mô hình lọc CV nội bộ năm 2018 vì đúng lý do này: mô hình học cách hạ điểm CV có chứa từ "women's" vì dữ liệu tuyển dụng cũ nghiêng về nam giới. <strong>Mô hình không hề ác ý — nó chỉ chính xác trong việc lặp lại lịch sử, và đó chính là vấn đề.</strong></p>
<h3>Quyền riêng tư dữ liệu</h3>
<p>Dữ liệu khách hàng dùng để huấn luyện mô hình (lịch sử mua hàng, hành vi duyệt web) là dữ liệu cá nhân — việc thu thập, lưu trữ và sử dụng nó bị ràng buộc bởi luật riêng tư và niềm tin của khách hàng, không chỉ bởi những gì kỹ thuật cho phép làm.</p>
<h3>Từ một notebook tới một hệ thống kinh doanh đang chạy</h3>
<pre><code>Mo hinh trong notebook  -&gt;  Mo hinh duoc gan vao
"chay dung" mot lan          he thong dang chay:
                              - chay tren du lieu MOI moi ngay
                              - duoc theo doi khi do chinh xac giam
                              - duoc huan luyen lai khi kinh doanh thay doi
</code></pre>
<p>Một mô hình không bao giờ "xong" — hành vi khách hàng thay đổi, và một mô hình huấn luyện trên dữ liệu năm ngoái có thể âm thầm xuống chất lượng. Triển khai nghĩa là giám sát liên tục, không phải giao hàng một lần.</p>
<div class="callout"><span class="badge">Bài học kinh doanh</span> Trách nhiệm thật của người quản lý với ML không phải là xây mô hình — mà là hỏi liệu dữ liệu huấn luyện có phản ánh một quá khứ đáng lặp lại không, dữ liệu khách hàng có được dùng đúng sự đồng thuận không, và ai sẽ tiếp tục theo dõi mô hình sau khi ra mắt.</div>`,
  ]]);

const c8q = quiz('mcl201-quiz-8', 'Quiz 8 — AI/deep learning & ethics|||Quiz 8 — AI/deep learning & đạo đức', [
  { id: 'q1', question: 'Deep learning khác các mô hình ở Chương 3-7 chủ yếu ở điểm nào?', options: ['Deep learning không cần dữ liệu', 'Deep learning tự học đặc trưng trực tiếp từ dữ liệu thô (ảnh, văn bản) thay vì dùng đặc trưng chọn tay', 'Deep learning luôn dễ giải thích hơn cây quyết định', 'Deep learning chỉ dùng được cho hồi quy'], correctIndex: 1, explanation: 'Mạng nơ-ron nhiều tầng có thể tự học đặc trưng từ dữ liệu thô, khác với mô hình dùng đặc trưng do người chọn.' },
  { id: 'q2', question: 'Vụ mô hình lọc CV của Amazon (2018) bị bỏ vì lý do gì?', options: ['Mô hình chạy quá chậm', 'Mô hình học lại thiên vị giới tính từ dữ liệu tuyển dụng cũ, hạ điểm CV có từ "women\'s"', 'Mô hình không dự đoán được gì cả', 'Mô hình tốn quá nhiều chi phí điện toán'], correctIndex: 1, explanation: 'Mô hình học đúng khuôn mẫu thiên vị trong dữ liệu lịch sử, dù không ai cố ý tạo ra nó.' },
  { id: 'q3', question: 'Vì sao "triển khai" một mô hình ML không phải là việc làm một lần rồi xong?', options: ['Vì mô hình tự sửa lỗi mãi mãi sau khi triển khai', 'Vì hành vi khách hàng thay đổi theo thời gian, cần theo dõi & huấn luyện lại mô hình', 'Vì luật cấm dùng một mô hình quá 1 ngày', 'Vì mô hình sẽ tự xoá sau khi chạy'], correctIndex: 1, explanation: 'Dữ liệu thực tế thay đổi liên tục, nên cần giám sát độ chính xác và huấn luyện lại khi cần.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'MCL201',
    slug: 'mcl201-machine-learning',
    title: 'Machine learning',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MCL201.webp',
    shortDescription: 'ML for business: what it is, the ML workflow, regression & classification (sales, churn, credit), customer segmentation, evaluation/overfitting, decision trees/random forests, AI & ethics intro. Bilingual, business examples.|||Học máy cho kinh doanh: ML là gì, quy trình ML, hồi quy & phân lớp (doanh số, churn, tín dụng), phân cụm khách hàng, đánh giá mô hình/overfitting, cây quyết định/random forest, nhập môn AI & đạo đức. Song ngữ, ví dụ kinh doanh.',
    description: 'Môn <strong>MCL201 — Machine Learning</strong> (kỳ 3, khối Quản trị Kinh doanh) giúp sinh viên kinh doanh hiểu và dùng được machine learning <strong>không cần trở thành kỹ thuật viên</strong>. Từ <strong>ML là gì &amp; ứng dụng kinh doanh</strong> → <strong>quy trình ML &amp; chuẩn bị dữ liệu</strong> → <strong>hồi quy</strong> (dự báo doanh số/giá) → <strong>phân lớp</strong> (churn, tín dụng) → <strong>phân cụm khách hàng</strong> → <strong>đánh giá mô hình &amp; overfitting</strong> → <strong>cây quyết định, random forest &amp; ensemble</strong> → <strong>nhập môn AI/deep learning, đạo đức dữ liệu &amp; triển khai</strong>. Bám tinh thần giáo trình "Data Science for Business" (Provost &amp; Fawcett), "Hands-On Machine Learning" (Géron) và Google ML Crash Course; song ngữ, ví dụ marketing/tài chính/khách hàng, ví dụ code Python/scikit-learn đơn giản, quiz mỗi chương.',
    whatYouLearn: 'ML là gì & khi nào đáng dùng; ba nhóm bài toán (hồi quy/phân lớp/phân cụm); quy trình ML & chuẩn bị dữ liệu (train/test split); hồi quy tuyến tính (dự báo doanh số/giá); phân lớp & xác suất (churn, tín dụng, gian lận); phân cụm khách hàng (RFM, K-means); đánh giá mô hình (confusion matrix) & overfitting; cây quyết định, random forest & feature importance; nhập môn deep learning; thiên vị (bias), đạo đức & quyền riêng tư dữ liệu; đưa mô hình vào vận hành thật.',
    requirements: 'Không cần biết lập trình hay toán cao cấp — chỉ cần tư duy logic cơ bản. Có thể chạy các ví dụ Python trong bài học miễn phí trên Google Colab (không cần cài đặt).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'ML là gì, ba nhóm bài toán, ứng dụng kinh doanh.', lessons: [intro] },
    { title: 'Chương 1 — ML là gì & ứng dụng kinh doanh|||Chapter 1 — What is ML & business applications', description: 'Quy tắc vs. học từ dữ liệu, khi nào ML đáng dùng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quy trình ML & chuẩn bị dữ liệu|||Chapter 2 — ML workflow & data preparation', description: 'Vòng đời dự án ML, train/test split, rác vào rác ra.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hồi quy|||Chapter 3 — Regression', description: 'Dự báo doanh số/giá, đọc hệ số, sai số dự báo.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phân lớp|||Chapter 4 — Classification', description: 'Churn, tín dụng, gian lận, xác suất & đánh đổi sai lầm.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân cụm khách hàng|||Chapter 5 — Customer segmentation', description: 'Clustering, RFM, K-means, từ nhóm tới hành động.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đánh giá mô hình & overfitting|||Chapter 6 — Model evaluation & overfitting', description: 'Confusion matrix, học vẹt vs. học thật.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Cây quyết định & random forest|||Chapter 7 — Decision trees & random forest', description: 'Cây quyết định, ensemble, feature importance.', lessons: [c7, c7q] },
    { title: 'Chương 8 — AI/deep learning & đạo đức|||Chapter 8 — AI/deep learning & ethics', description: 'Deep learning, bias, quyền riêng tư, triển khai thật.', lessons: [c8, c8q] },
  ],
};
