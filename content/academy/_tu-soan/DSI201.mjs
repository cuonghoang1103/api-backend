// Khoá TỰ SOẠN cho DSI201 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Khung bám quy trình khoa học dữ liệu của giáo trình chuẩn: McKinney "Python for Data Analysis" (3e, O'Reilly 2022),
// VanderPlas "Python Data Science Handbook" (2e, O'Reilly 2022), James–Witten–Hastie–Tibshirani–Taylor
// "An Introduction to Statistical Learning with Applications in Python" (Springer 2023) và Géron "Hands-On Machine Learning" (3e).
// Mọi đoạn code chạy thật (Python 3.14 · numpy 2.5 · pandas 3.1 · scikit-learn 1.9 · matplotlib 3.11), seed cố định,
// dữ liệu tự tổng hợp hoặc có sẵn trong scikit-learn; output dán nguyên văn. Mọi link ngoài đã mở thử ngày 09/11/2026.
// Ví dụ KHÁC ABA201c (quảng cáo/churn/khán giả): ở đây dùng giao đồ ăn, giá căn hộ, cảm biến, bộ dữ liệu sklearn.
// ⚠️ File này KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn) và không backtick lồng.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
// Đáp án đúng được xoay vị trí theo một số cố định suy từ câu hỏi (tất định), để đáp án không dồn về một cột.
const Q = (id, question, options, correctIndex, explanation) => {
  const k = [...question].reduce((a, ch) => a + ch.charCodeAt(0), 0) % options.length;
  const opts = options.map((_, i) => options[(i + k) % options.length]);
  return { id, question, options: opts, correctIndex: (correctIndex - k + options.length) % options.length, points: 1, explanation };
};
const QZ = (ch, title, description, questions) => ({
  title, slug: 'dsi201-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});


// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = L('dsi201-ts-0-1',
  '0.1 — Welcome to DSI201: the data science workflow from question to decision|||0.1 — Giới thiệu DSI201: quy trình khoa học dữ liệu từ câu hỏi tới quyết định',
  'DSI201 học gì, dùng vào đâu (đi làm, đồ án), 8 chuẩn đầu ra tự soạn, nối với IPY111/PSI221/MAA102, cảnh báo: trường chưa công bố syllabus trên FLM.',
  `<span class="eyebrow">DSI201 · Section 0 · Lesson 0.1</span>
<h2>Welcome to Data Science</h2>
<p class="lead">Data science is the craft of turning a vague question (“why are our deliveries late?”, “what price should this apartment list at?”) into data, then into evidence, a model or a decision that someone can act on — and doing it in a way another person can check and repeat.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the DSI201 syllabus on FLM</strong> (we searched the course code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following the workflow taught by standard textbooks (McKinney <em>Python for Data Analysis</em>, VanderPlas <em>Python Data Science Handbook</em>, James et al. <em>An Introduction to Statistical Learning with Python</em>, Géron <em>Hands-On Machine Learning</em>). <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline given in class. The older lessons of this course on cuongthai.com stay available after this section.</p></div>
<h3>What will you actually do?</h3>
<p>The course follows one workflow from end to end, one chapter per step:</p>
<ol>
<li><strong>Frame the problem</strong> (Ch. 1): what decision, what target, what metric, what baseline.</li>
<li><strong>Acquire data</strong> (Ch. 2) from files, web APIs and SQL databases.</li>
<li><strong>Clean and tidy it</strong> with pandas (Ch. 3).</li>
<li><strong>Explore and visualise</strong> it (Ch. 4).</li>
<li><strong>Engineer features</strong> (Ch. 5).</li>
<li><strong>Train and validate models properly</strong> — train/validation/test, cross-validation, leakage (Ch. 6).</li>
<li><strong>Use the main model families</strong>: linear and logistic regression, decision trees, random forests and gradient boosting (Ch. 7).</li>
<li><strong>Measure</strong> with the right metric (Ch. 8).</li>
<li><strong>Find structure without labels</strong>: clustering and PCA (Ch. 9).</li>
<li><strong>Interpret</strong> models (Ch. 10), make the work <strong>reproducible</strong> (Ch. 11), <strong>communicate</strong> it and finish a <strong>capstone mini-project</strong> (Ch. 12).</li>
</ol>
<h3>Why it matters for work and for your projects</h3>
<ul>
<li><strong>Internships and junior jobs</strong> (data analyst, data scientist, ML engineer, backend developer who “also does data”) test exactly this workflow: load a messy file, clean it, explore, build a baseline, evaluate honestly, explain.</li>
<li><strong>Capstone and graduation projects</strong> almost always contain a “smart” feature — a recommendation, a forecast, a classifier. Most failed project demos fail at framing, leakage or evaluation, not at the algorithm.</li>
<li><strong>Every software product logs data.</strong> Being the developer who can answer “did the new feature help?” with a clean analysis is a real advantage.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<p>After this course you should be able to:</p>
<ol>
<li>Frame a business or research question as a data science task with a clear target, unit of analysis, success metric and baseline.</li>
<li>Acquire data from CSV/JSON files, a paginated JSON API and a SQL database into pandas, recording where it came from.</li>
<li>Clean data (types, missing values, duplicates, strings, dates, outliers) and reshape it into tidy form.</li>
<li>Explore data with summaries, group comparisons, correlations and well-chosen charts, and recognise traps such as Simpson's paradox.</li>
<li>Build features and scikit-learn pipelines, and evaluate models with train/validation/test splits and cross-validation without leakage.</li>
<li>Fit, tune and compare linear, logistic, tree-based and ensemble models, and choose metrics that match the decision.</li>
<li>Apply k-means, hierarchical clustering, DBSCAN and PCA, and interpret models with coefficients, permutation importance and partial dependence.</li>
<li>Deliver a reproducible project (environment, seeds, git) and communicate results with uncertainty to a non-technical audience.</li>
</ol>
<h3>Related courses at FPTU</h3>
<p>DSI201 sits in <strong>semester 5</strong>. It reuses three earlier mathematics courses, and we point back to them instead of re-teaching: <strong>IPY111</strong> (probability: random variables, expectation, the normal distribution), <strong>PSI221</strong> (statistical inference: confidence intervals, tests, linear regression with standard errors, the bootstrap) and <strong>MAA102</strong> (linear algebra: vectors, matrices, eigenvectors and SVD — the engine of PCA in Chapter 9). You also need basic Python (variables, functions, lists, dictionaries, loops). Later machine-learning and AI courses in your curriculum build directly on Chapters 6–9 (check the exact codes in your programme).</p>
<h3>How to study this course</h3>
<ul>
<li>Every lesson has objectives, a lecture with runnable code, common mistakes, a 📌 summary, 🔗 further learning and 🧪 practice with answers; each chapter ends with a quiz.</li>
<li>Every code block was actually run; the grey box below it is the real output. Data are either bundled with scikit-learn or synthesised with a fixed random seed, so <strong>you get the same numbers</strong>. Run the code, then change something and predict the result before you run it again.</li>
<li>Keep one notebook per chapter and a “lab book” of decisions (why you dropped a column, why you chose a metric). Chapter 11 shows how to make that notebook reproducible.</li>
</ul>`,
  `<span class="eyebrow">DSI201 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Khoa học dữ liệu</h2>
<p class="lead">Khoa học dữ liệu là nghề biến một câu hỏi mơ hồ (“vì sao đơn giao hàng hay trễ?”, “căn hộ này nên rao giá bao nhiêu?”) thành dữ liệu, rồi thành bằng chứng, mô hình hoặc quyết định mà người khác hành động được — và làm theo cách người khác kiểm lại và lặp lại được.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của DSI201 trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám quy trình mà các giáo trình chuẩn dạy (McKinney <em>Python for Data Analysis</em>, VanderPlas <em>Python Data Science Handbook</em>, James và cộng sự <em>An Introduction to Statistical Learning with Python</em>, Géron <em>Hands-On Machine Learning</em>). <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp. Các bài cũ của môn trên cuongthai.com vẫn giữ nguyên sau mục này.</p></div>
<h3>Bạn sẽ thực sự làm gì?</h3>
<p>Môn học đi trọn một quy trình từ đầu đến cuối, mỗi chương một bước:</p>
<ol>
<li><strong>Đặt bài toán</strong> (Ch. 1): quyết định gì, biến mục tiêu nào, chỉ số nào, mốc so sánh (baseline) nào.</li>
<li><strong>Thu thập dữ liệu</strong> (Ch. 2) từ tệp, API web và cơ sở dữ liệu SQL.</li>
<li><strong>Làm sạch và đưa về dạng tidy</strong> bằng pandas (Ch. 3).</li>
<li><strong>Khám phá và trực quan hoá</strong> (Ch. 4).</li>
<li><strong>Xây dựng đặc trưng</strong> (feature engineering, Ch. 5).</li>
<li><strong>Huấn luyện và kiểm định mô hình đúng cách</strong> — train/validation/test, kiểm định chéo, rò rỉ dữ liệu (Ch. 6).</li>
<li><strong>Dùng các họ mô hình chính</strong>: hồi quy tuyến tính và logistic, cây quyết định, rừng ngẫu nhiên và gradient boosting (Ch. 7).</li>
<li><strong>Đo lường</strong> bằng đúng chỉ số (Ch. 8).</li>
<li><strong>Tìm cấu trúc khi không có nhãn</strong>: phân cụm và PCA (Ch. 9).</li>
<li><strong>Diễn giải</strong> mô hình (Ch. 10), làm cho công việc <strong>tái lập được</strong> (Ch. 11), <strong>trình bày</strong> kết quả và hoàn thành <strong>dự án cuối khoá thu nhỏ</strong> (Ch. 12).</li>
</ol>
<h3>Vì sao quan trọng cho đi làm và đồ án</h3>
<ul>
<li><strong>Thực tập và việc làm junior</strong> (data analyst, data scientist, ML engineer, lập trình viên backend “kiêm luôn dữ liệu”) kiểm tra đúng quy trình này: nạp một tệp lộn xộn, làm sạch, khám phá, dựng baseline, đánh giá trung thực, giải thích.</li>
<li><strong>Đồ án và khoá luận tốt nghiệp</strong> gần như luôn có một tính năng “thông minh” — gợi ý, dự báo, phân loại. Phần lớn buổi demo hỏng là hỏng ở khâu đặt bài toán, rò rỉ dữ liệu hay đánh giá, không phải ở thuật toán.</li>
<li><strong>Mọi sản phẩm phần mềm đều ghi log dữ liệu.</strong> Là người trả lời được “tính năng mới có giúp gì không?” bằng một phân tích sạch sẽ là lợi thế thật.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong môn, bạn cần làm được:</p>
<ol>
<li>Đặt một câu hỏi kinh doanh hay nghiên cứu thành bài toán khoa học dữ liệu với biến mục tiêu, đơn vị phân tích, chỉ số thành công và baseline rõ ràng.</li>
<li>Thu thập dữ liệu từ tệp CSV/JSON, một API JSON có phân trang và một cơ sở dữ liệu SQL vào pandas, có ghi lại nguồn gốc.</li>
<li>Làm sạch dữ liệu (kiểu dữ liệu, giá trị thiếu, bản ghi trùng, chuỗi, ngày tháng, ngoại lai) và tổ chức lại về dạng tidy.</li>
<li>Khám phá dữ liệu bằng thống kê tóm tắt, so sánh nhóm, tương quan và biểu đồ chọn đúng loại; nhận ra các bẫy như nghịch lý Simpson.</li>
<li>Xây đặc trưng và pipeline scikit-learn; đánh giá mô hình bằng chia train/validation/test và kiểm định chéo mà không rò rỉ dữ liệu.</li>
<li>Khớp, tinh chỉnh và so sánh mô hình tuyến tính, logistic, dựa trên cây và mô hình tổ hợp; chọn chỉ số khớp với quyết định cần đưa ra.</li>
<li>Áp dụng k-means, phân cụm phân cấp, DBSCAN và PCA; diễn giải mô hình bằng hệ số, permutation importance và partial dependence.</li>
<li>Bàn giao một dự án tái lập được (môi trường, seed, git) và trình bày kết quả kèm độ bất định cho người không chuyên.</li>
</ol>
<h3>Môn liên quan trong khung FPTU</h3>
<p>DSI201 nằm ở <strong>kỳ 5</strong>. Môn dùng lại ba môn toán trước đó, và ta chỉ về đó thay vì giảng lại: <strong>IPY111</strong> (xác suất: biến ngẫu nhiên, kỳ vọng, phân phối chuẩn), <strong>PSI221</strong> (suy luận thống kê: khoảng tin cậy, kiểm định, hồi quy tuyến tính có sai số chuẩn, bootstrap) và <strong>MAA102</strong> (đại số tuyến tính: vectơ, ma trận, vectơ riêng và SVD — động cơ của PCA ở Chương 9). Bạn cũng cần Python cơ bản (biến, hàm, list, dict, vòng lặp). Các môn học máy và AI sau này trong khung chương trình xây trực tiếp trên Chương 6–9 (xem mã môn cụ thể trong chương trình ngành của bạn).</p>
<h3>Học môn này thế nào cho hiệu quả</h3>
<ul>
<li>Mỗi bài có mục tiêu, bài giảng kèm code chạy được, lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm và 🧪 tự luyện có đáp án; cuối mỗi chương có quiz.</li>
<li>Mọi khối code đều đã chạy thật; hộp xám bên dưới là output thật. Dữ liệu hoặc có sẵn trong scikit-learn, hoặc được tổng hợp với seed cố định, nên <strong>bạn sẽ ra đúng các con số đó</strong>. Chạy code, rồi đổi một chỗ và đoán kết quả trước khi chạy lại.</li>
<li>Mỗi chương giữ một notebook và một “sổ thí nghiệm” ghi các quyết định (vì sao bỏ một cột, vì sao chọn chỉ số này). Chương 11 chỉ cách làm cho notebook đó tái lập được.</li>
</ul>`);

const m02 = L('dsi201-ts-0-2',
  '0.2 — Textbooks, open courses & tools (verified)|||0.2 — Giáo trình, khoá học mở & công cụ (đã kiểm)',
  'Bốn giáo trình chuẩn kèm ISBN đã kiểm (McKinney 3e, VanderPlas 2e, ISLP 2023, Géron 3e), bản đọc miễn phí, Google ML Crash Course, Kaggle Learn, MIT 6.0002, tài liệu pandas/scikit-learn, cài đặt môi trường.',
  `<span class="eyebrow">DSI201 · Section 0 · Lesson 0.2</span>
<h2>Textbooks, open courses &amp; tools</h2>
<p class="lead">You do not need to buy anything: three of the four main books below have a legal free online version from the authors, and every lesson links to free material that matches it.</p>
<h3>📘 Main textbooks</h3>
<ol>
<li><strong>Wes McKinney — <em>Python for Data Analysis: Data Wrangling with pandas, NumPy, and Jupyter</em>, 3rd edition.</strong> O'Reilly Media, 2022. ISBN 978-1-098-10403-0. <a href="https://wesmckinney.com/book/" target="_blank" rel="noopener">Free online edition by the author</a>. Written by the creator of pandas; our reference for Chapters 2–4 (loading, cleaning, reshaping, grouping).</li>
<li><strong>Jake VanderPlas — <em>Python Data Science Handbook: Essential Tools for Working with Data</em>, 2nd edition.</strong> O'Reilly Media, 2022 (print dated 2023). ISBN 978-1-098-12122-8. <a href="https://jakevdp.github.io/PythonDataScienceHandbook/" target="_blank" rel="noopener">Free online version (1st-edition notebooks)</a>. NumPy, pandas, Matplotlib and a very clear tour of scikit-learn (Chapters 4–9 of this course).</li>
<li><strong>Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani, Jonathan Taylor — <em>An Introduction to Statistical Learning with Applications in Python</em> (ISLP).</strong> Springer (Springer Texts in Statistics), 2023, 1st edition of the Python version. ISBN 978-3-031-38746-3. <a href="https://www.statlearning.com/" target="_blank" rel="noopener">Book site with free PDF</a>. The theory behind Chapters 6–10: resampling, linear and logistic regression, trees and ensembles, unsupervised learning.</li>
<li><strong>Aurélien Géron — <em>Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow</em>, 3rd edition.</strong> O'Reilly Media, 2022. ISBN 978-1-098-12597-4. <a href="https://github.com/ageron/handson-ml3" target="_blank" rel="noopener">Official notebooks (free)</a>. Its Chapter 2 “end-to-end project” is the model for our capstone.</li>
</ol>
<h3>🎓 Open courses &amp; references</h3>
<ul>
<li><a href="https://developers.google.com/machine-learning/crash-course" target="_blank" rel="noopener">Google — Machine Learning Crash Course</a>: short modules on framing, data, generalisation, classification metrics and fairness.</li>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a>: free hands-on micro-courses (pandas, data cleaning, data visualisation, intro and intermediate ML, feature engineering).</li>
<li><a href="https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016/" target="_blank" rel="noopener">MIT OCW 6.0002 — Introduction to Computational Thinking and Data Science</a>: lectures and problem sets on simulation, clustering, classification and statistical pitfalls.</li>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn User Guide</a> and <a href="https://pandas.pydata.org/docs/user_guide/index.html" target="_blank" rel="noopener">pandas User Guide</a>: the official documentation — every model and method we use is explained there with examples.</li>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer (YouTube)</a>: short, clear videos on cross-validation, trees, random forests, boosting, ROC curves and PCA.</li>
</ul>
<h3>🛠️ Setting up your environment</h3>
<p>Install Python 3, then in a terminal create an isolated environment for the course (Chapter 11 explains why):</p>
<pre><code class="language-bash">python3 -m venv dsi201-env
source dsi201-env/bin/activate        # Windows: dsi201-env\\Scripts\\activate
pip install numpy pandas scikit-learn matplotlib jupyter
jupyter notebook</code></pre>
<p>No installation possible? Use <a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> in the browser — numpy, pandas, scikit-learn and matplotlib are pre-installed. The outputs in this course were produced with Python 3.14, numpy 2.5, pandas 3.1, scikit-learn 1.9 and matplotlib 3.11. Older versions print slightly different formats (for example how pandas shows text columns) but the same numbers.</p>
<div class="meo"><p><strong>Study plan.</strong> For each lesson: read here → run the code and change one thing → read one linked section (McKinney, VanderPlas or ISLP) → do the 🧪 practice → take the chapter quiz. Budget about 6–8 hours per chapter, and start the capstone dataset (Chapter 12) early.</p></div>`,
  `<span class="eyebrow">DSI201 · Mục 0 · Bài 0.2</span>
<h2>Giáo trình, khoá học mở &amp; công cụ</h2>
<p class="lead">Bạn không cần mua sách: ba trong bốn giáo trình chính dưới đây có bản đọc miễn phí hợp pháp do chính tác giả công bố, và mỗi bài đều dẫn tới tài liệu miễn phí tương ứng.</p>
<h3>📘 Giáo trình chính</h3>
<ol>
<li><strong>Wes McKinney — <em>Python for Data Analysis: Data Wrangling with pandas, NumPy, and Jupyter</em>, tái bản lần 3.</strong> O'Reilly Media, 2022. ISBN 978-1-098-10403-0. <a href="https://wesmckinney.com/book/" target="_blank" rel="noopener">Bản đọc miễn phí của tác giả</a>. Do chính người tạo ra pandas viết; tài liệu tham chiếu cho Chương 2–4 (nạp, làm sạch, tổ chức lại, gom nhóm dữ liệu).</li>
<li><strong>Jake VanderPlas — <em>Python Data Science Handbook: Essential Tools for Working with Data</em>, tái bản lần 2.</strong> O'Reilly Media, 2022 (bản in ghi 2023). ISBN 978-1-098-12122-8. <a href="https://jakevdp.github.io/PythonDataScienceHandbook/" target="_blank" rel="noopener">Bản đọc miễn phí (notebook của lần xuất bản 1)</a>. NumPy, pandas, Matplotlib và phần giới thiệu scikit-learn rất dễ hiểu (Chương 4–9 của môn).</li>
<li><strong>Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani, Jonathan Taylor — <em>An Introduction to Statistical Learning with Applications in Python</em> (ISLP).</strong> Springer (bộ Springer Texts in Statistics), 2023, lần xuất bản đầu của bản Python. ISBN 978-3-031-38746-3. <a href="https://www.statlearning.com/" target="_blank" rel="noopener">Trang sách có PDF miễn phí</a>. Nền lý thuyết cho Chương 6–10: lấy mẫu lại, hồi quy tuyến tính và logistic, cây và mô hình tổ hợp, học không giám sát.</li>
<li><strong>Aurélien Géron — <em>Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow</em>, tái bản lần 3.</strong> O'Reilly Media, 2022. ISBN 978-1-098-12597-4. <a href="https://github.com/ageron/handson-ml3" target="_blank" rel="noopener">Notebook chính thức (miễn phí)</a>. Chương 2 “dự án đầu-cuối” của sách là khuôn cho dự án cuối khoá của ta.</li>
</ol>
<h3>🎓 Khoá học mở &amp; tài liệu tham chiếu</h3>
<ul>
<li><a href="https://developers.google.com/machine-learning/crash-course" target="_blank" rel="noopener">Google — Machine Learning Crash Course</a>: các module ngắn về đặt bài toán, dữ liệu, khả năng tổng quát hoá, chỉ số phân loại và công bằng.</li>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a>: khoá thực hành ngắn miễn phí (pandas, làm sạch dữ liệu, trực quan hoá, ML nhập môn và trung cấp, feature engineering).</li>
<li><a href="https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016/" target="_blank" rel="noopener">MIT OCW 6.0002 — Introduction to Computational Thinking and Data Science</a>: bài giảng và bài tập về mô phỏng, phân cụm, phân loại và các bẫy thống kê.</li>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn User Guide</a> và <a href="https://pandas.pydata.org/docs/user_guide/index.html" target="_blank" rel="noopener">pandas User Guide</a>: tài liệu chính thức — mọi mô hình và phương thức trong môn đều được giải thích ở đó kèm ví dụ.</li>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer (YouTube)</a>: video ngắn, rõ về kiểm định chéo, cây quyết định, rừng ngẫu nhiên, boosting, đường ROC và PCA.</li>
</ul>
<h3>🛠️ Cài đặt môi trường</h3>
<p>Cài Python 3, rồi mở terminal tạo một môi trường riêng cho môn (Chương 11 giải thích vì sao):</p>
<pre><code class="language-bash">python3 -m venv dsi201-env
source dsi201-env/bin/activate        # Windows: dsi201-env\\Scripts\\activate
pip install numpy pandas scikit-learn matplotlib jupyter
jupyter notebook</code></pre>
<p>Không cài được? Dùng <a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> trên trình duyệt — numpy, pandas, scikit-learn và matplotlib có sẵn. Output trong môn được tạo bằng Python 3.14, numpy 2.5, pandas 3.1, scikit-learn 1.9 và matplotlib 3.11. Phiên bản cũ hơn có thể in khác định dạng một chút (ví dụ cách pandas hiển thị cột chữ) nhưng cùng con số.</p>
<div class="meo"><p><strong>Kế hoạch học.</strong> Với mỗi bài: đọc ở đây → chạy code và đổi một chỗ → đọc một mục được dẫn (McKinney, VanderPlas hoặc ISLP) → làm 🧪 tự luyện → làm quiz chương. Dành khoảng 6–8 giờ mỗi chương, và bắt đầu xem bộ dữ liệu dự án cuối khoá (Chương 12) từ sớm.</p></div>`);

const s0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu DSI201, chuẩn đầu ra tự soạn, cảnh báo trường chưa công bố syllabus trên FLM, giáo trình chuẩn kèm ISBN, khoá học mở và cách cài môi trường.',
  lessons: [m01, m02],
};


// ───────────────────────────── Chương 1 — Đặt bài toán ─────────────────────────────
const c11 = L('dsi201-ts-1-1',
  '1.1 — What data science is: the workflow from question to decision|||1.1 — Khoa học dữ liệu là gì: quy trình từ câu hỏi tới quyết định',
  'Định nghĩa khoa học dữ liệu, quy trình CRISP-DM sáu pha, phân biệt phân tích mô tả/dự đoán/nhân quả, cả quy trình thu nhỏ trong 15 dòng code (diabetes: baseline vs hồi quy tuyến tính).',
  `<span class="eyebrow">DSI201 · Chapter 1 · Lesson 1.1</span>
<h2>What data science is: the workflow from question to decision</h2>
<p class="lead">Data science is not “running a model”. It is a loop of steps — question, data, cleaning, exploration, modelling, evaluation, communication — and most of the value (and most of the mistakes) live in the steps around the model.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe the six phases of the CRISP-DM process and why it is a loop, not a line.</li><li>Tell apart descriptive, predictive and causal questions.</li><li>Run a complete miniature workflow and read its result against a baseline.</li></ul>
<h3>📖 Lecture</h3>
<p>The most widely used description of the workflow is <strong>CRISP-DM</strong> (Cross-Industry Standard Process for Data Mining; conceived in 1996, first published as a step-by-step guide in 1999). It has six phases: <strong>business understanding</strong> (what decision are we supporting?), <strong>data understanding</strong> (what data exist, how good are they?), <strong>data preparation</strong> (cleaning, joining, features), <strong>modelling</strong>, <strong>evaluation</strong> (does the model meet the business goal, not just a metric?) and <strong>deployment</strong> (a report, a dashboard or a model inside a product). Arrows go backwards too: exploration often shows the question was wrong, evaluation sends you back for more data. In practice, preparation usually takes the largest share of the time.</p>
<p>It helps to name the <strong>kind of question</strong> before touching data:</p>
<ul>
<li><strong>Descriptive</strong> — what happened? “Average delivery time per district last month.” Tools: grouping, summaries, charts (Chapters 3–4).</li>
<li><strong>Predictive</strong> — what will happen for this new case? “Will this order be late?” Tools: supervised learning (Chapters 6–8). A prediction does not need to explain why.</li>
<li><strong>Causal</strong> — what happens if we change something? “If we add five drivers, how much faster?” This needs experiments (A/B tests) or careful causal methods; a predictive model alone cannot answer it. Mixing up predictive and causal questions is the classic beginner error.</li>
</ul>
<p>Here is the whole loop in miniature on the diabetes data bundled with scikit-learn (442 patients, ten measurements, a score of disease progression one year later). Do not worry about the details yet; notice the <em>shape</em> of the work: acquire, split, baseline, model, evaluate.</p>
<pre><code class="language-python"># The whole data science workflow in miniature (details come later in the course)
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error

# 1. Acquire: 442 patients, 10 baseline measurements, target = disease progression after 1 year
X, y = load_diabetes(return_X_y=True, as_frame=True)
print("shape:", X.shape, "| target range:", y.min(), "to", y.max())

# 2. Split: keep a test set aside that we never look at while building the model
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=0)

# 3. Baseline: always predict the training mean
base = DummyRegressor(strategy="mean").fit(X_tr, y_tr)
# 4. Model: a linear regression on all 10 features
model = LinearRegression().fit(X_tr, y_tr)

# 5. Evaluate on the untouched test set
print("baseline MAE:", round(mean_absolute_error(y_te, base.predict(X_te)), 1))
print("linear   MAE:", round(mean_absolute_error(y_te, model.predict(X_te)), 1))</code></pre>
<div class="out">shape: (442, 10) | target range: 25.0 to 346.0
baseline MAE: 58.3
linear   MAE: 45.1</div>
<p>How to read it: the <strong>baseline</strong> (predict the average for everybody) is off by 58.3 points on average; the linear model is off by 45.1. The model is useful — about 23% less error than knowing nothing — but far from perfect. Always report a model next to a baseline: “MAE 45” means nothing on its own.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Starting with an algorithm (“let's use a random forest”) before the question and the decision are clear.</li><li>Reporting a metric without a baseline, so nobody can tell whether the model helps.</li><li>Answering a causal question (“what if we…”) with a predictive model trained on observational data.</li><li>Looking at the test set while building the model — the test score then stops being honest (Chapter 6).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Data science = question → data → preparation → modelling → evaluation → deployment, repeated.</li><li>CRISP-DM is the standard name for this loop; preparation usually dominates the time.</li><li>Name the question type: descriptive, predictive or causal.</li><li>Every result is judged against a simple baseline on data the model has not seen.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Cross-industry_standard_process_for_data_mining" target="_blank" rel="noopener">Wikipedia — Cross-industry standard process for data mining (CRISP-DM)</a></li><li><a href="https://github.com/ageron/handson-ml3/blob/main/02_end_to_end_machine_learning_project.ipynb" target="_blank" rel="noopener">Géron — End-to-end machine learning project (notebook)</a></li><li><a href="https://scikit-learn.org/stable/datasets/toy_dataset.html" target="_blank" rel="noopener">scikit-learn — Toy datasets (diabetes, breast cancer, wine…)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Classify each question as descriptive, predictive or causal: (a) “Which district had the most late orders in October?” (b) “Will this customer cancel next week?” (c) “Does free shipping increase basket size?”</li><li>In the code, change <code>test_size=0.25</code> to <code>0.5</code>. Do both MAEs change? Why might a smaller training set hurt the linear model more than the baseline?</li><li>Name two reasons the arrow from “evaluation” might point back to “business understanding”.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (a) descriptive, (b) predictive, (c) causal — it needs an experiment. 2) Yes, both change because the test rows change; the baseline only estimates one number (the mean), the linear model estimates eleven, so it suffers more from less training data. 3) The model meets the metric but would not change any decision; or the metric chosen does not reflect the real cost (for example missing a late order costs much more than a false alarm).</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 1 · Bài 1.1</span>
<h2>Khoa học dữ liệu là gì: quy trình từ câu hỏi tới quyết định</h2>
<p class="lead">Khoa học dữ liệu không phải là “chạy một mô hình”. Đó là một vòng lặp các bước — câu hỏi, dữ liệu, làm sạch, khám phá, mô hình hoá, đánh giá, trình bày — và phần lớn giá trị (cũng như phần lớn sai lầm) nằm ở các bước bao quanh mô hình.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả sáu pha của quy trình CRISP-DM và vì sao nó là vòng lặp chứ không phải đường thẳng.</li><li>Phân biệt câu hỏi mô tả, dự đoán và nhân quả.</li><li>Chạy trọn một quy trình thu nhỏ và đọc kết quả so với baseline.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cách mô tả quy trình được dùng rộng rãi nhất là <strong>CRISP-DM</strong> (Cross-Industry Standard Process for Data Mining; hình thành năm 1996, công bố thành hướng dẫn từng bước năm 1999). Nó có sáu pha: <strong>hiểu nghiệp vụ</strong> (ta đang hỗ trợ quyết định gì?), <strong>hiểu dữ liệu</strong> (có dữ liệu gì, chất lượng ra sao?), <strong>chuẩn bị dữ liệu</strong> (làm sạch, ghép bảng, tạo đặc trưng), <strong>mô hình hoá</strong>, <strong>đánh giá</strong> (mô hình có đạt mục tiêu nghiệp vụ không, chứ không chỉ một con số?) và <strong>triển khai</strong> (một báo cáo, một dashboard hay một mô hình chạy trong sản phẩm). Mũi tên cũng đi ngược: khám phá thường cho thấy câu hỏi sai, đánh giá đẩy bạn quay lại lấy thêm dữ liệu. Trong thực tế, khâu chuẩn bị thường chiếm phần thời gian lớn nhất.</p>
<p>Nên gọi tên <strong>loại câu hỏi</strong> trước khi chạm vào dữ liệu:</p>
<ul>
<li><strong>Mô tả</strong> — chuyện gì đã xảy ra? “Thời gian giao trung bình theo quận tháng trước.” Công cụ: gom nhóm, thống kê tóm tắt, biểu đồ (Chương 3–4).</li>
<li><strong>Dự đoán</strong> — chuyện gì sẽ xảy ra với trường hợp mới này? “Đơn này có trễ không?” Công cụ: học có giám sát (Chương 6–8). Dự đoán không cần giải thích vì sao.</li>
<li><strong>Nhân quả</strong> — nếu ta thay đổi điều gì thì sao? “Thêm năm tài xế thì nhanh hơn bao nhiêu?” Cần thử nghiệm (A/B test) hoặc phương pháp nhân quả cẩn thận; một mô hình dự đoán một mình không trả lời được. Lẫn câu hỏi dự đoán với câu hỏi nhân quả là lỗi kinh điển của người mới.</li>
</ul>
<p>Dưới đây là cả vòng lặp thu nhỏ trên bộ dữ liệu diabetes có sẵn trong scikit-learn (442 bệnh nhân, mười chỉ số đo, một điểm số tiến triển bệnh sau một năm). Chưa cần hiểu chi tiết; hãy để ý <em>hình dạng</em> công việc: thu thập, chia dữ liệu, baseline, mô hình, đánh giá.</p>
<pre><code class="language-python"># The whole data science workflow in miniature (details come later in the course)
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error

# 1. Acquire: 442 patients, 10 baseline measurements, target = disease progression after 1 year
X, y = load_diabetes(return_X_y=True, as_frame=True)
print("shape:", X.shape, "| target range:", y.min(), "to", y.max())

# 2. Split: keep a test set aside that we never look at while building the model
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=0)

# 3. Baseline: always predict the training mean
base = DummyRegressor(strategy="mean").fit(X_tr, y_tr)
# 4. Model: a linear regression on all 10 features
model = LinearRegression().fit(X_tr, y_tr)

# 5. Evaluate on the untouched test set
print("baseline MAE:", round(mean_absolute_error(y_te, base.predict(X_te)), 1))
print("linear   MAE:", round(mean_absolute_error(y_te, model.predict(X_te)), 1))</code></pre>
<div class="out">shape: (442, 10) | target range: 25.0 to 346.0
baseline MAE: 58.3
linear   MAE: 45.1</div>
<p>Cách đọc: <strong>baseline</strong> (đoán giá trị trung bình cho mọi người) sai trung bình 58,3 điểm; mô hình tuyến tính sai 45,1. Mô hình có ích — giảm khoảng 23% sai số so với không biết gì — nhưng còn xa mới hoàn hảo. Luôn báo cáo mô hình cạnh baseline: “MAE 45” đứng một mình chẳng nói lên điều gì.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Bắt đầu bằng thuật toán (“dùng random forest đi”) trước khi câu hỏi và quyết định rõ ràng.</li><li>Báo cáo chỉ số mà không có baseline, nên không ai biết mô hình có giúp gì không.</li><li>Trả lời câu hỏi nhân quả (“nếu ta…”) bằng mô hình dự đoán học từ dữ liệu quan sát.</li><li>Nhìn vào tập test trong lúc xây mô hình — điểm test khi đó không còn trung thực (Chương 6).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Khoa học dữ liệu = câu hỏi → dữ liệu → chuẩn bị → mô hình hoá → đánh giá → triển khai, lặp lại.</li><li>CRISP-DM là tên chuẩn của vòng lặp này; khâu chuẩn bị thường chiếm nhiều thời gian nhất.</li><li>Gọi tên loại câu hỏi: mô tả, dự đoán hay nhân quả.</li><li>Mọi kết quả được chấm so với một baseline đơn giản, trên dữ liệu mô hình chưa thấy.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Cross-industry_standard_process_for_data_mining" target="_blank" rel="noopener">Wikipedia — Quy trình CRISP-DM</a></li><li><a href="https://github.com/ageron/handson-ml3/blob/main/02_end_to_end_machine_learning_project.ipynb" target="_blank" rel="noopener">Géron — Dự án học máy đầu-cuối (notebook)</a></li><li><a href="https://scikit-learn.org/stable/datasets/toy_dataset.html" target="_blank" rel="noopener">scikit-learn — Các bộ dữ liệu nhỏ có sẵn (diabetes, breast cancer, wine…)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Xếp loại mỗi câu hỏi là mô tả, dự đoán hay nhân quả: (a) “Quận nào nhiều đơn trễ nhất tháng 10?” (b) “Khách này có huỷ trong tuần tới không?” (c) “Miễn phí vận chuyển có làm giỏ hàng lớn hơn không?”</li><li>Trong code, đổi <code>test_size=0.25</code> thành <code>0.5</code>. Cả hai MAE có đổi không? Vì sao tập huấn luyện nhỏ hơn có thể làm hại mô hình tuyến tính nhiều hơn baseline?</li><li>Nêu hai lý do khiến mũi tên từ “đánh giá” có thể quay về “hiểu nghiệp vụ”.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (a) mô tả, (b) dự đoán, (c) nhân quả — cần thử nghiệm. 2) Có, cả hai đổi vì các dòng test đổi; baseline chỉ ước lượng một số (trung bình), mô hình tuyến tính ước lượng mười một số, nên nó chịu thiệt nhiều hơn khi ít dữ liệu huấn luyện. 3) Mô hình đạt chỉ số nhưng không làm thay đổi quyết định nào; hoặc chỉ số đã chọn không phản ánh chi phí thật (vd bỏ sót một đơn trễ tốn hơn nhiều so với một cảnh báo nhầm).</p></div>`);

const c12 = L('dsi201-ts-1-2',
  '1.2 — Framing a problem: target, unit of analysis, metric and baseline|||1.2 — Đặt bài toán: biến mục tiêu, đơn vị phân tích, chỉ số và baseline',
  'Năm câu hỏi đặt bài toán; định nghĩa nhãn “đơn trễ” từ log thô; tỉ lệ nền 12,6% và nghịch lý độ chính xác 87,4% của mô hình “luôn đúng giờ”; thời điểm dự đoán.',
  `<span class="eyebrow">DSI201 · Chapter 1 · Lesson 1.2</span>
<h2>Framing a problem: target, unit of analysis, metric and baseline</h2>
<p class="lead">A well-framed problem is half solved. A badly framed one produces a beautiful model that answers a question nobody asked.</p>
<h3>🎯 Objectives</h3>
<ul><li>Answer the five framing questions for a real scenario.</li><li>Turn raw logs into a precisely defined target (label).</li><li>Compute a base rate and see why accuracy can be misleading.</li></ul>
<h3>📖 Lecture</h3>
<p>Scenario: a food-delivery start-up in Hà Nội says “customers complain about late orders; use data to help”. Before any code, write down answers to five questions:</p>
<ol>
<li><strong>Decision.</strong> What will someone do differently with the result? Here: send a proactive apology voucher to orders likely to be late, and add drivers in late-prone hours.</li>
<li><strong>Unit of analysis.</strong> One row = one what? One order (not one customer, not one day). Getting this wrong silently changes every statistic.</li>
<li><strong>Target.</strong> A precise, measurable definition. “Late” could mean after the promised time, or more than 5 minutes after it, or a complaint was filed. Each gives a different model. We choose: <em>late = actual delivery minutes &gt; promised minutes + 5</em>.</li>
<li><strong>Prediction time.</strong> When must the prediction be made, and what is known then? To warn the customer, we must predict <em>when the order is placed</em> — so the actual delivery time and the driver's route are not available as inputs. This single sentence prevents most leakage (Lesson 6.3).</li>
<li><strong>Metric and baseline.</strong> How do we score success, and what does “no model” score?</li>
</ol>
<pre><code class="language-python">import numpy as np
import pandas as pd

# Raw order log of a food-delivery app: what we HAVE is timestamps, not a label
rng = np.random.default_rng(12)
n = 2000
placed = pd.Timestamp("2026-10-01 10:00") + pd.to_timedelta(rng.integers(0, 30 * 24 * 60, n), unit="min")
promised = rng.choice([30, 40, 45], size=n)                      # minutes promised to the customer
actual = np.round(rng.gamma(shape=9, scale=3.4, size=n))          # real delivery minutes
orders = pd.DataFrame({"placed_at": placed, "promised_min": promised, "actual_min": actual})

# Framing decision: the target is "late = delivered more than 5 minutes after the promise"
orders["late"] = (orders["actual_min"] &gt; orders["promised_min"] + 5).astype(int)
print(orders.head(3))
print("base rate of late orders:", round(orders["late"].mean(), 3))

# A useless "model" that always says on-time already scores this accuracy:
print("accuracy of always predicting 'on time':", round(1 - orders["late"].mean(), 3))</code></pre>
<div class="out">            placed_at  promised_min  actual_min  late
0 2026-10-19 19:08:00            40        32.0     0
1 2026-10-08 22:35:00            45        18.0     0
2 2026-10-30 14:32:00            45        28.0     0
base rate of late orders: 0.126
accuracy of always predicting 'on time': 0.874</div>
<p>Only 12.6% of orders are late — the <strong>base rate</strong>. A “model” that always answers “on time” reaches 87.4% accuracy while catching zero late orders. That is why, for rare events, we judge models by recall, precision or cost (Chapter 8), and why the baseline must be stated: 90% accuracy here would be only a little better than doing nothing.</p>
<div class="formula"><span class="lbl">Framing card (fill before coding)</span>Decision · Unit of analysis · Target definition · Prediction time &amp; available inputs · Metric · Baseline · Success threshold</div>
<p>Good targets are <strong>measurable</strong>, <strong>available in the history</strong> (you need labelled examples), <strong>close to the decision</strong> and <strong>not a proxy that can mislead</strong>. A classic warning: predicting “number of complaints” instead of “lateness” would teach the model which customers complain, not which orders are late.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>A vague target (“customer satisfaction”) that cannot be computed from the data.</li><li>Using inputs that only exist after the prediction moment (actual route, final delivery time).</li><li>Changing the unit of analysis mid-project (orders in one table, customers in another) without noticing duplicated rows.</li><li>Quoting accuracy for a rare event without the base rate.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Five framing questions: decision, unit, target, prediction time, metric + baseline.</li><li>Define the label with an exact rule and write it down.</li><li>The base rate tells you what “doing nothing” already achieves.</li><li>Inputs must be known at prediction time.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/problem-framing" target="_blank" rel="noopener">Google — Introduction to Machine Learning Problem Framing</a></li><li><a href="https://scikit-learn.org/stable/modules/model_evaluation.html" target="_blank" rel="noopener">scikit-learn — Metrics and scoring (includes dummy baselines)</a></li><li><a href="https://wesmckinney.com/book/pandas-basics" target="_blank" rel="noopener">McKinney — Getting Started with pandas</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write the framing card for: “A bookstore wants to know which titles to reorder next week.”</li><li>In the code, redefine late as <code>actual_min &gt; promised_min</code> (no 5-minute grace). Will the base rate go up or down? Check by running it.</li><li>A model for apartment prices uses “final sale price per m² of the same building this month” as an input. What is wrong if we predict at listing time?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Decision: how many copies of each title to reorder; unit: one title-week; target: copies sold next week; prediction time: Sunday night with sales up to that day; metric: mean absolute error in copies (or stock-out cost); baseline: “sell the same as last week”. 2) Up — fewer orders fall inside the stricter on-time window (on this data it rises from 0.126 to 0.216). 3) That price is only known after sales close this month; at listing time it is leakage from the future.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 1 · Bài 1.2</span>
<h2>Đặt bài toán: biến mục tiêu, đơn vị phân tích, chỉ số và baseline</h2>
<p class="lead">Bài toán đặt đúng là đã giải được một nửa. Bài toán đặt sai cho ra một mô hình đẹp trả lời câu hỏi chẳng ai hỏi.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Trả lời năm câu hỏi đặt bài toán cho một tình huống thật.</li><li>Biến log thô thành biến mục tiêu (nhãn) được định nghĩa chính xác.</li><li>Tính tỉ lệ nền và thấy vì sao độ chính xác (accuracy) có thể đánh lừa.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Tình huống: một start-up giao đồ ăn ở Hà Nội nói “khách phàn nàn đơn trễ; hãy dùng dữ liệu để giúp”. Trước khi viết code, ghi ra câu trả lời cho năm câu hỏi:</p>
<ol>
<li><strong>Quyết định.</strong> Ai sẽ làm gì khác đi nhờ kết quả? Ở đây: gửi voucher xin lỗi chủ động cho đơn có khả năng trễ, và tăng tài xế vào khung giờ hay trễ.</li>
<li><strong>Đơn vị phân tích.</strong> Một dòng = một cái gì? Một đơn hàng (không phải một khách, không phải một ngày). Sai chỗ này sẽ âm thầm làm sai mọi thống kê.</li>
<li><strong>Biến mục tiêu.</strong> Một định nghĩa chính xác, đo được. “Trễ” có thể là sau giờ hứa, hoặc quá giờ hứa hơn 5 phút, hoặc khách đã khiếu nại. Mỗi cách cho một mô hình khác. Ta chọn: <em>trễ = số phút giao thực tế &gt; số phút đã hứa + 5</em>.</li>
<li><strong>Thời điểm dự đoán.</strong> Phải dự đoán lúc nào, và lúc đó biết những gì? Muốn báo trước cho khách thì phải dự đoán <em>ngay khi đơn được đặt</em> — nên thời gian giao thực tế và lộ trình tài xế không được dùng làm đầu vào. Một câu này chặn được phần lớn rò rỉ dữ liệu (Bài 6.3).</li>
<li><strong>Chỉ số và baseline.</strong> Chấm thành công bằng gì, và “không có mô hình” được bao nhiêu điểm?</li>
</ol>
<pre><code class="language-python">import numpy as np
import pandas as pd

# Raw order log of a food-delivery app: what we HAVE is timestamps, not a label
rng = np.random.default_rng(12)
n = 2000
placed = pd.Timestamp("2026-10-01 10:00") + pd.to_timedelta(rng.integers(0, 30 * 24 * 60, n), unit="min")
promised = rng.choice([30, 40, 45], size=n)                      # minutes promised to the customer
actual = np.round(rng.gamma(shape=9, scale=3.4, size=n))          # real delivery minutes
orders = pd.DataFrame({"placed_at": placed, "promised_min": promised, "actual_min": actual})

# Framing decision: the target is "late = delivered more than 5 minutes after the promise"
orders["late"] = (orders["actual_min"] &gt; orders["promised_min"] + 5).astype(int)
print(orders.head(3))
print("base rate of late orders:", round(orders["late"].mean(), 3))

# A useless "model" that always says on-time already scores this accuracy:
print("accuracy of always predicting 'on time':", round(1 - orders["late"].mean(), 3))</code></pre>
<div class="out">            placed_at  promised_min  actual_min  late
0 2026-10-19 19:08:00            40        32.0     0
1 2026-10-08 22:35:00            45        18.0     0
2 2026-10-30 14:32:00            45        28.0     0
base rate of late orders: 0.126
accuracy of always predicting 'on time': 0.874</div>
<p>Chỉ 12,6% đơn bị trễ — đó là <strong>tỉ lệ nền</strong> (base rate). Một “mô hình” luôn trả lời “đúng giờ” đạt độ chính xác 87,4% mà không bắt được đơn trễ nào. Vì vậy với sự kiện hiếm, ta chấm mô hình bằng recall, precision hoặc chi phí (Chương 8), và phải nêu baseline: độ chính xác 90% ở đây chỉ tốt hơn “không làm gì” một chút.</p>
<div class="formula"><span class="lbl">Thẻ đặt bài toán (điền trước khi code)</span>Quyết định · Đơn vị phân tích · Định nghĩa mục tiêu · Thời điểm dự đoán &amp; đầu vào có sẵn · Chỉ số · Baseline · Ngưỡng thành công</div>
<p>Biến mục tiêu tốt thì <strong>đo được</strong>, <strong>có trong dữ liệu lịch sử</strong> (cần ví dụ có nhãn), <strong>gần với quyết định</strong> và <strong>không phải một đại lượng thay thế dễ gây hiểu lầm</strong>. Cảnh báo kinh điển: dự đoán “số khiếu nại” thay vì “độ trễ” sẽ dạy mô hình khách nào hay phàn nàn, chứ không phải đơn nào trễ.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Mục tiêu mơ hồ (“sự hài lòng của khách”) không tính được từ dữ liệu.</li><li>Dùng đầu vào chỉ tồn tại sau thời điểm dự đoán (lộ trình thực tế, giờ giao cuối cùng).</li><li>Đổi đơn vị phân tích giữa chừng (đơn ở bảng này, khách ở bảng kia) mà không để ý dòng bị nhân bản.</li><li>Báo độ chính xác cho sự kiện hiếm mà không kèm tỉ lệ nền.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Năm câu hỏi đặt bài toán: quyết định, đơn vị, mục tiêu, thời điểm dự đoán, chỉ số + baseline.</li><li>Định nghĩa nhãn bằng một quy tắc chính xác và ghi lại.</li><li>Tỉ lệ nền cho biết “không làm gì” đã đạt được bao nhiêu.</li><li>Đầu vào phải có sẵn tại thời điểm dự đoán.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/problem-framing" target="_blank" rel="noopener">Google — Nhập môn đặt bài toán học máy (Problem Framing)</a></li><li><a href="https://scikit-learn.org/stable/modules/model_evaluation.html" target="_blank" rel="noopener">scikit-learn — Chỉ số và chấm điểm (có baseline dummy)</a></li><li><a href="https://wesmckinney.com/book/pandas-basics" target="_blank" rel="noopener">McKinney — Làm quen với pandas</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết thẻ đặt bài toán cho: “Một nhà sách muốn biết tuần sau nên nhập thêm đầu sách nào.”</li><li>Trong code, định nghĩa lại trễ là <code>actual_min &gt; promised_min</code> (không có 5 phút ân hạn). Tỉ lệ nền tăng hay giảm? Chạy để kiểm.</li><li>Một mô hình giá căn hộ dùng đầu vào “giá bán cuối cùng mỗi m² của cùng toà nhà trong tháng này”. Sai ở đâu nếu ta dự đoán lúc đăng tin?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Quyết định: nhập thêm bao nhiêu bản mỗi đầu sách; đơn vị: một đầu sách-tuần; mục tiêu: số bản bán tuần sau; thời điểm dự đoán: tối Chủ nhật với doanh số tới hôm đó; chỉ số: sai số tuyệt đối trung bình theo số bản (hoặc chi phí hết hàng); baseline: “bán bằng tuần trước”. 2) Tăng — ít đơn lọt vào khoảng đúng giờ chặt hơn (trên dữ liệu này tăng từ 0,126 lên 0,216). 3) Giá đó chỉ biết sau khi các giao dịch tháng này chốt; lúc đăng tin thì đó là rò rỉ từ tương lai.</p></div>`);

const c13 = L('dsi201-ts-1-3',
  '1.3 — From question to plan: costs of errors, feasibility and responsible data use|||1.3 — Từ câu hỏi tới kế hoạch: chi phí sai lầm, tính khả thi và dùng dữ liệu có trách nhiệm',
  'Đổi chất lượng mô hình thành tiền: so ba chính sách (không làm gì, cảnh báo tất cả, dùng mô hình); kiểm tra khả thi; quyền riêng tư, thiên lệch, đại lượng thay thế; kế hoạch dự án một trang.',
  `<span class="eyebrow">DSI201 · Chapter 1 · Lesson 1.3</span>
<h2>From question to plan: costs of errors, feasibility and responsible data use</h2>
<p class="lead">A model is only worth building if acting on its output beats the simple alternatives. That comparison needs the cost of each kind of error — and a check that the data may be used at all.</p>
<h3>🎯 Objectives</h3>
<ul><li>Translate precision and recall into expected cost and compare policies.</li><li>Run a feasibility check before modelling.</li><li>Spot privacy, bias and proxy problems at the framing stage.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>1. Errors have prices.</strong> In the delivery case (Lesson 1.2), a late order without warning costs the company a 50k VND voucher. A proactive apology costs 10k and, according to an earlier pilot (an <em>assumption</em> we must state), halves the cost of a late order to 25k. Two errors are possible: a <strong>false alarm</strong> (we warn, the order is on time: we lose 10k) and a <strong>miss</strong> (no warning, the order is late: we lose 50k). With <strong>recall</strong> = share of late orders we catch and <strong>precision</strong> = share of warnings that were truly late (defined fully in Chapter 8), we can compute the expected cost of every policy for 10,000 orders and a 12% late rate:</p>
<pre><code class="language-python"># Turning model quality into money: expected cost of three policies for late orders.
# A late order costs 50k VND in vouchers; a proactive "sorry + 10k voucher" message costs 10k
# and (assumption from a past pilot) halves the voucher cost if the order really is late.
n_orders = 10_000
late_rate = 0.12

def expected_cost(recall, precision):
    late = n_orders * late_rate
    caught = late * recall                       # late orders we warned about
    flagged = caught / precision if precision &gt; 0 else 0
    missed = late - caught
    return flagged * 10 + caught * 25 + missed * 50   # thousand VND

policies = {
    "do nothing":            (0.0, 0.0),
    "warn everybody":        (1.0, late_rate),
    "model (P=0.45, R=0.60)": (0.60, 0.45),
}
for name, (r, p) in policies.items():
    print(f"{name:24s} cost = {expected_cost(r, p):&gt;9,.0f} thousand VND")</code></pre>
<div class="out">do nothing               cost =    60,000 thousand VND
warn everybody           cost =   130,000 thousand VND
model (P=0.45, R=0.60)   cost =    58,000 thousand VND</div>
<p>Read it carefully. “Warn everybody” is the <em>worst</em> policy: 10,000 vouchers cost more than the lateness itself. A model with precision 0.45 and recall 0.60 saves only 2,000 thousand VND (about 3%) against doing nothing. That is a sobering, valuable result: before spending weeks on the model, the team learns that it must reach higher precision, or that the voucher should be cheaper, to be worth it. This simple spreadsheet-style calculation is often the most useful “model” of the whole project.</p>
<p><strong>2. Feasibility check.</strong> Ask before modelling: Do we have labelled history (at least hundreds of examples of each outcome)? Are the inputs available at prediction time and in production, with the same definitions? Can the result be delivered in time to act (a warning after the food arrives is useless)? Who maintains it?</p>
<p><strong>3. Responsible data use.</strong> Personal data (names, phone numbers, exact addresses, locations) should be collected only for a clear purpose, minimised, and protected; Vietnam has specific personal-data protection rules, so check your organisation's policy before using such data. Watch for <strong>bias</strong>: if historical late orders were concentrated in poorer districts because fewer drivers were assigned there, a model may learn to treat those customers worse. Watch for <strong>proxies</strong>: a target like “complaints” measures who complains, not who suffered. Writing a short “datasheet” for the dataset (source, collection, consent, known gaps) is now standard practice.</p>
<div class="formula"><span class="lbl">One-page project plan</span>Framing card (Lesson 1.2) · Cost of each error · Policies to beat · Data sources &amp; owners · Feasibility risks · Ethics/privacy notes · Timeline &amp; deliverable</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Assuming any model beats doing nothing — compute the cost first.</li><li>Hiding assumptions (“the apology halves the cost”) inside the numbers instead of stating them.</li><li>Collecting every column “just in case”, including personal data you do not need.</li><li>Treating a biased historical decision as ground truth.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Compare policies by expected cost: false alarms × their cost + misses × their cost.</li><li>Always include “do nothing” and “act on everybody” as baselines.</li><li>Check labels, inputs at prediction time, delivery timing and ownership before modelling.</li><li>Minimise personal data, look for bias and proxies, and document the dataset.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/guides/rules-of-ml" target="_blank" rel="noopener">Google — Rules of Machine Learning (Martin Zinkevich)</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/fairness" target="_blank" rel="noopener">Google ML Crash Course — Fairness</a></li><li><a href="https://arxiv.org/abs/1803.09010" target="_blank" rel="noopener">Gebru et al. — Datasheets for Datasets (arXiv)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Using the cost formula in the code, what is the cost of a model with precision 0.60 and recall 0.60? Does it beat doing nothing by more?</li><li>If the voucher for a late order were 100k instead of 50k (apology still halves it), would “warn everybody” still be the worst policy? Reason before computing.</li><li>Give one input to the delivery model that could introduce unfair treatment, and how to check for it.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Caught = 720, flagged = 720/0.6 = 1,200; cost = 1,200·10 + 720·25 + 480·50 = 12,000 + 18,000 + 24,000 = 54,000 — saves 6,000 instead of 2,000. 2) Doing nothing becomes 1,200·100 = 120,000; warning everybody becomes 100,000 + 1,200·50 = 160,000 — still worst, but the gap shrinks; a good model gains more. 3) Customer district or a “neighbourhood income” field: compare error rates and warning rates per district (Lesson 10.3).</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 1 · Bài 1.3</span>
<h2>Từ câu hỏi tới kế hoạch: chi phí sai lầm, tính khả thi và dùng dữ liệu có trách nhiệm</h2>
<p class="lead">Một mô hình chỉ đáng xây nếu hành động theo output của nó tốt hơn các phương án đơn giản. Muốn so sánh thì cần biết giá của từng loại sai lầm — và kiểm tra xem dữ liệu có được phép dùng hay không.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đổi precision và recall thành chi phí kỳ vọng và so sánh các chính sách.</li><li>Kiểm tra tính khả thi trước khi mô hình hoá.</li><li>Phát hiện vấn đề quyền riêng tư, thiên lệch và đại lượng thay thế ngay từ khâu đặt bài toán.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>1. Sai lầm có giá.</strong> Trong tình huống giao hàng (Bài 1.2), một đơn trễ không được báo trước làm công ty mất voucher 50 nghìn đồng. Một lời xin lỗi chủ động tốn 10 nghìn và, theo một đợt thử trước đó (một <em>giả định</em> phải nói rõ), giảm chi phí đơn trễ còn 25 nghìn. Có hai loại sai: <strong>báo nhầm</strong> (cảnh báo nhưng đơn đúng giờ: mất 10 nghìn) và <strong>bỏ sót</strong> (không cảnh báo, đơn trễ: mất 50 nghìn). Với <strong>recall</strong> = phần đơn trễ ta bắt được và <strong>precision</strong> = phần cảnh báo thật sự trễ (định nghĩa đầy đủ ở Chương 8), ta tính được chi phí kỳ vọng của mọi chính sách cho 10.000 đơn với tỉ lệ trễ 12%:</p>
<pre><code class="language-python"># Turning model quality into money: expected cost of three policies for late orders.
# A late order costs 50k VND in vouchers; a proactive "sorry + 10k voucher" message costs 10k
# and (assumption from a past pilot) halves the voucher cost if the order really is late.
n_orders = 10_000
late_rate = 0.12

def expected_cost(recall, precision):
    late = n_orders * late_rate
    caught = late * recall                       # late orders we warned about
    flagged = caught / precision if precision &gt; 0 else 0
    missed = late - caught
    return flagged * 10 + caught * 25 + missed * 50   # thousand VND

policies = {
    "do nothing":            (0.0, 0.0),
    "warn everybody":        (1.0, late_rate),
    "model (P=0.45, R=0.60)": (0.60, 0.45),
}
for name, (r, p) in policies.items():
    print(f"{name:24s} cost = {expected_cost(r, p):&gt;9,.0f} thousand VND")</code></pre>
<div class="out">do nothing               cost =    60,000 thousand VND
warn everybody           cost =   130,000 thousand VND
model (P=0.45, R=0.60)   cost =    58,000 thousand VND</div>
<p>Đọc kỹ. “Cảnh báo tất cả” là chính sách <em>tệ nhất</em>: 10.000 voucher tốn hơn cả chuyện trễ. Một mô hình precision 0,45, recall 0,60 chỉ tiết kiệm 2.000 nghìn đồng (khoảng 3%) so với không làm gì. Đây là kết quả tỉnh táo và quý giá: trước khi tốn hàng tuần xây mô hình, nhóm biết rằng mô hình phải đạt precision cao hơn, hoặc voucher phải rẻ hơn, thì mới đáng làm. Phép tính kiểu bảng tính này thường là “mô hình” hữu ích nhất của cả dự án.</p>
<p><strong>2. Kiểm tra khả thi.</strong> Hỏi trước khi mô hình hoá: Có lịch sử có nhãn không (ít nhất vài trăm ví dụ cho mỗi kết cục)? Đầu vào có sẵn tại thời điểm dự đoán và trong môi trường chạy thật, với cùng định nghĩa không? Kết quả có đến kịp để hành động không (cảnh báo sau khi đồ ăn đã tới thì vô dụng)? Ai bảo trì?</p>
<p><strong>3. Dùng dữ liệu có trách nhiệm.</strong> Dữ liệu cá nhân (tên, số điện thoại, địa chỉ chính xác, vị trí) chỉ nên thu cho mục đích rõ ràng, ở mức tối thiểu, và được bảo vệ; Việt Nam có quy định riêng về bảo vệ dữ liệu cá nhân, nên kiểm chính sách của tổ chức trước khi dùng loại dữ liệu này. Cẩn thận <strong>thiên lệch</strong>: nếu đơn trễ trong quá khứ dồn ở các quận nghèo hơn vì ở đó được phân ít tài xế, mô hình có thể học cách đối xử tệ hơn với khách ở đó. Cẩn thận <strong>đại lượng thay thế</strong>: mục tiêu như “khiếu nại” đo ai hay phàn nàn, không đo ai bị thiệt. Viết một “datasheet” ngắn cho bộ dữ liệu (nguồn, cách thu, sự đồng ý, chỗ thiếu đã biết) nay là thông lệ chuẩn.</p>
<div class="formula"><span class="lbl">Kế hoạch dự án một trang</span>Thẻ đặt bài toán (Bài 1.2) · Giá của từng loại sai · Các chính sách cần thắng · Nguồn dữ liệu &amp; người phụ trách · Rủi ro khả thi · Ghi chú đạo đức/riêng tư · Mốc thời gian &amp; sản phẩm bàn giao</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Mặc định mô hình nào cũng hơn không làm gì — hãy tính chi phí trước.</li><li>Giấu giả định (“lời xin lỗi giảm một nửa chi phí”) trong con số thay vì nói rõ.</li><li>Thu mọi cột “để phòng”, kể cả dữ liệu cá nhân không cần.</li><li>Coi một quyết định lịch sử có thiên lệch là sự thật nền.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>So chính sách bằng chi phí kỳ vọng: số báo nhầm × giá + số bỏ sót × giá.</li><li>Luôn đưa “không làm gì” và “áp dụng cho tất cả” vào làm baseline.</li><li>Kiểm nhãn, đầu vào tại thời điểm dự đoán, thời gian giao kết quả và người phụ trách trước khi mô hình hoá.</li><li>Tối thiểu hoá dữ liệu cá nhân, tìm thiên lệch và đại lượng thay thế, ghi tài liệu cho bộ dữ liệu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/guides/rules-of-ml" target="_blank" rel="noopener">Google — Rules of Machine Learning (Martin Zinkevich)</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/fairness" target="_blank" rel="noopener">Google ML Crash Course — Công bằng (Fairness)</a></li><li><a href="https://arxiv.org/abs/1803.09010" target="_blank" rel="noopener">Gebru và cộng sự — Datasheets for Datasets (arXiv)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Dùng công thức chi phí trong code, mô hình precision 0,60 và recall 0,60 tốn bao nhiêu? Có thắng “không làm gì” nhiều hơn không?</li><li>Nếu voucher cho đơn trễ là 100 nghìn thay vì 50 nghìn (xin lỗi vẫn giảm một nửa), “cảnh báo tất cả” có còn tệ nhất không? Lập luận trước khi tính.</li><li>Nêu một đầu vào của mô hình giao hàng có thể gây đối xử không công bằng, và cách kiểm tra.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Bắt được = 720, cảnh báo = 720/0,6 = 1.200; chi phí = 1.200·10 + 720·25 + 480·50 = 12.000 + 18.000 + 24.000 = 54.000 — tiết kiệm 6.000 thay vì 2.000. 2) Không làm gì thành 1.200·100 = 120.000; cảnh báo tất cả thành 100.000 + 1.200·50 = 160.000 — vẫn tệ nhất nhưng khoảng cách hẹp lại; mô hình tốt được lợi nhiều hơn. 3) Quận của khách hoặc trường “thu nhập khu vực”: so tỉ lệ sai và tỉ lệ cảnh báo theo từng quận (Bài 10.3).</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: Framing data science problems|||Quiz — Chương 1: Đặt bài toán khoa học dữ liệu',
  'Quiz 8 câu: CRISP-DM, loại câu hỏi, đơn vị phân tích, nhãn, thời điểm dự đoán, tỉ lệ nền, chi phí sai lầm, đạo đức dữ liệu.', [
  Q('q1', 'Which CRISP-DM phase asks “what decision are we supporting?”|||Pha nào của CRISP-DM hỏi “ta đang hỗ trợ quyết định gì?”',
    ['Business understanding|||Hiểu nghiệp vụ', 'Data preparation|||Chuẩn bị dữ liệu', 'Modelling|||Mô hình hoá', 'Deployment|||Triển khai'], 0,
    'Business understanding comes first and defines the decision and success criteria.|||Hiểu nghiệp vụ đi đầu và xác định quyết định cùng tiêu chí thành công.'),
  Q('q2', '“Does free shipping increase basket size?” is what kind of question?|||“Miễn phí vận chuyển có làm giỏ hàng lớn hơn không?” là loại câu hỏi gì?',
    ['Causal|||Nhân quả', 'Descriptive|||Mô tả', 'Predictive|||Dự đoán', 'Unsupervised|||Không giám sát'], 0,
    'It asks about the effect of an intervention, which needs an experiment or causal method.|||Nó hỏi về tác động của một can thiệp, cần thử nghiệm hoặc phương pháp nhân quả.'),
  Q('q3', 'In the delivery project, the unit of analysis is…|||Trong dự án giao hàng, đơn vị phân tích là…',
    ['one order|||một đơn hàng', 'one customer|||một khách hàng', 'one driver|||một tài xế', 'one day|||một ngày'], 0,
    'Each row is one order, because the prediction is made per order.|||Mỗi dòng là một đơn, vì dự đoán được đưa ra cho từng đơn.'),
  Q('q4', 'Late orders are 12.6% of all orders. What accuracy does “always on time” get?|||Đơn trễ chiếm 12,6%. “Luôn đúng giờ” đạt độ chính xác bao nhiêu?',
    ['87.4%|||87,4%', '12.6%|||12,6%', '50%|||50%', '100%|||100%'], 0,
    'It is right on every on-time order: 1 − 0.126 = 0.874.|||Nó đúng với mọi đơn đúng giờ: 1 − 0,126 = 0,874.'),
  Q('q5', 'Predicting lateness when an order is placed, which input is NOT allowed?|||Dự đoán trễ ngay khi đơn được đặt, đầu vào nào KHÔNG được dùng?',
    ['Actual delivery minutes|||Số phút giao thực tế', 'Hour of the day|||Giờ trong ngày', 'Restaurant district|||Quận của nhà hàng', 'Promised minutes|||Số phút đã hứa'], 0,
    'Actual delivery time is only known afterwards — using it is leakage.|||Thời gian giao thực tế chỉ biết sau đó — dùng nó là rò rỉ dữ liệu.'),
  Q('q6', 'Why compare a model with “do nothing” and “act on everybody”?|||Vì sao so mô hình với “không làm gì” và “áp dụng cho tất cả”?',
    ['A model is only worth using if it beats simple policies in cost|||Mô hình chỉ đáng dùng nếu thắng các chính sách đơn giản về chi phí', 'Because scikit-learn requires it|||Vì scikit-learn bắt buộc', 'To increase accuracy|||Để tăng độ chính xác', 'To avoid cross-validation|||Để khỏi kiểm định chéo'], 0,
    'In the lesson, warning everybody cost more than doing nothing, and the model saved only 3%.|||Trong bài, cảnh báo tất cả tốn hơn không làm gì, và mô hình chỉ tiết kiệm 3%.'),
  Q('q7', 'Using “number of complaints” as the target for lateness is risky because…|||Dùng “số khiếu nại” làm mục tiêu cho độ trễ là rủi ro vì…',
    ['it is a proxy that measures who complains|||nó là đại lượng thay thế, đo ai hay phàn nàn', 'it is not numeric|||nó không phải số', 'it has no missing values|||nó không có giá trị thiếu', 'it is too precise|||nó quá chính xác'], 0,
    'Proxies can encode behaviour or bias rather than the outcome we care about.|||Đại lượng thay thế có thể mã hoá hành vi hoặc thiên lệch thay vì kết cục ta quan tâm.'),
  Q('q8', 'Which is good practice for personal data in a project?|||Đâu là thực hành tốt với dữ liệu cá nhân trong dự án?',
    ['Collect only what the purpose needs and document it|||Chỉ thu những gì mục đích cần và ghi tài liệu', 'Collect everything in case it helps later|||Thu tất cả phòng khi sau này cần', 'Share it in public notebooks|||Chia sẻ trong notebook công khai', 'Remove it only after deployment|||Chỉ xoá sau khi triển khai'], 0,
    'Data minimisation and documentation (datasheets) are standard responsible practice.|||Tối thiểu hoá dữ liệu và ghi tài liệu (datasheet) là thực hành có trách nhiệm chuẩn.'),
]);

const ch1 = {
  title: 'Chapter 1 — Framing data science problems|||Chương 1 — Đặt bài toán khoa học dữ liệu',
  description: 'Quy trình CRISP-DM, loại câu hỏi mô tả/dự đoán/nhân quả, thẻ đặt bài toán (quyết định, đơn vị, mục tiêu, thời điểm dự đoán, chỉ số, baseline), chi phí sai lầm và dùng dữ liệu có trách nhiệm.',
  lessons: [c11, c12, c13, q1],
};


// ───────────────────────────── Chương 2 — Thu thập dữ liệu ─────────────────────────────
const c21 = L('dsi201-ts-2-1',
  '2.1 — Reading files: CSV, JSON and friends without silent errors|||2.1 — Đọc tệp: CSV, JSON và các định dạng khác mà không sai âm thầm',
  'read_csv với dấu phân cách “;”, dấu thập phân “,”, ngày dd/mm/yyyy, giá trị thiếu “N/A”, mã hoá UTF-8; JSON Lines; Excel, Parquet; kiểm tra sau khi đọc.',
  `<span class="eyebrow">DSI201 · Chapter 2 · Lesson 2.1</span>
<h2>Reading files: CSV, JSON and friends without silent errors</h2>
<p class="lead">The first bug of most projects happens on line one: the file is read “successfully” but wrongly — one giant column, numbers stored as text, dates swapped day/month. pandas will not complain; you must check.</p>
<h3>🎯 Objectives</h3>
<ul><li>Use the key <code>read_csv</code> options: separator, decimal mark, missing-value markers, dates, encoding.</li><li>Read and write JSON Lines.</li><li>Know when to use Excel and Parquet, and how to verify any file you load.</li></ul>
<h3>📖 Lecture</h3>
<p>A CSV (“comma-separated values”) file is just text, and there is no single standard. Spreadsheets set to Vietnamese or many European locales export with a <strong>semicolon</strong> separator and a <strong>decimal comma</strong> (125,5 instead of 125.5), and write dates as <strong>day/month/year</strong>. Missing values may appear as an empty field, “N/A”, “-” or “null”. The example below reads such a file twice: once naively, once correctly.</p>
<pre><code class="language-python">import pandas as pd

# A CSV exported from a Vietnamese spreadsheet: ";" separator, decimal comma, dd/mm/yyyy dates
raw = """ma_don;quan;ngay_dat;tong_tien;phi_ship
D001;Cầu Giấy;03/10/2026;125,5;15
D002;Đống Đa;03/10/2026;89,0;N/A
D003;Hoàn Kiếm;04/10/2026;240,75;20
D004;Cầu Giấy;05/10/2026;;15
"""
with open("orders_vn.csv", "w", encoding="utf-8") as f:
    f.write(raw)

naive = pd.read_csv("orders_vn.csv")                  # default: sep="," -&gt; one wrong column
print("naive shape:", naive.shape)

df = pd.read_csv(
    "orders_vn.csv", sep=";", decimal=",", encoding="utf-8",
    na_values=["N/A"], parse_dates=["ngay_dat"], dayfirst=True,
)
print(df)
print(df.dtypes)

# JSON Lines: one JSON object per line, common for logs and API dumps
df.to_json("orders.jsonl", orient="records", lines=True, date_format="iso", force_ascii=False)
back = pd.read_json("orders.jsonl", lines=True)
print("round trip rows:", len(back), "| first line:", open("orders.jsonl", encoding="utf-8").readline().strip())</code></pre>
<div class="out">naive shape: (4, 1)
  ma_don       quan   ngay_dat  tong_tien  phi_ship
0   D001   Cầu Giấy 2026-10-03     125.50      15.0
1   D002    Đống Đa 2026-10-03      89.00       NaN
2   D003  Hoàn Kiếm 2026-10-04     240.75      20.0
3   D004   Cầu Giấy 2026-10-05        NaN      15.0
ma_don                  str
quan                    str
ngay_dat     datetime64[us]
tong_tien           float64
phi_ship            float64
dtype: object
round trip rows: 4 | first line: {"ma_don":"D001","quan":"Cầu Giấy","ngay_dat":"2026-10-03T00:00:00.000","tong_tien":125.5,"phi_ship":15.0}</div>
<p>Line by line: the naive read produced shape <code>(4, 1)</code> — every row squeezed into one text column, a sure sign of the wrong separator. The correct call fixes five things at once: <code>sep=";"</code>, <code>decimal=","</code>, <code>na_values=["N/A"]</code> so “N/A” becomes a real missing value (NaN), <code>parse_dates</code> with <code>dayfirst=True</code> so 03/10/2026 means 3 October, not 10 March, and an explicit <code>encoding="utf-8"</code> so Vietnamese diacritics survive. The dtypes confirm it: money columns are <code>float64</code>, the date is <code>datetime64</code>. (pandas 3 shows text columns as <code>str</code>; older versions show <code>object</code>.)</p>
<p><strong>JSON Lines</strong> (one JSON object per line, <code>.jsonl</code>) is the usual format for logs and API dumps because you can append to it and stream it line by line. <code>force_ascii=False</code> keeps “Cầu Giấy” readable instead of <code>\\u1ea7</code> escapes.</p>
<p><strong>Other formats.</strong> Excel: <code>pd.read_excel("file.xlsx", sheet_name="Sheet1")</code> needs the <code>openpyxl</code> package; watch for merged header cells and totals rows at the bottom. <strong>Parquet</strong> (<code>pd.read_parquet</code>, needs <code>pyarrow</code>) is a compressed, column-oriented binary format that stores dtypes, so dates stay dates — the best choice for saving cleaned intermediate data in a project. For very large CSVs, read only the columns you need (<code>usecols=</code>) or in pieces (<code>chunksize=</code>).</p>
<div class="formula"><span class="lbl">Checklist after every load</span>df.shape · df.dtypes · df.head() and df.tail() · df.isna().sum() · min/max of key numeric and date columns</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Not looking at the shape — one column means a wrong separator.</li><li>Numbers read as text because of a decimal comma or a thousands separator (<code>thousands="."</code> fixes 1.250.000).</li><li>Ambiguous dates read month-first: 03/10 becomes 10 March.</li><li>Garbled Vietnamese (mojibake) from a wrong encoding; Windows exports may be <code>"utf-8-sig"</code> or <code>"cp1258"</code>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>CSV has no single standard: set <code>sep</code>, <code>decimal</code>, <code>na_values</code>, <code>parse_dates</code>/<code>dayfirst</code>, <code>encoding</code>.</li><li>JSON Lines is ideal for logs; Parquet for saving cleaned data with types.</li><li>Always verify shape, dtypes, head/tail and missing counts right after loading.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://pandas.pydata.org/docs/user_guide/io.html" target="_blank" rel="noopener">pandas User Guide — IO tools (text, CSV, JSON, Excel, Parquet)</a></li><li><a href="https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html" target="_blank" rel="noopener">pandas — read_csv reference</a></li><li><a href="https://wesmckinney.com/book/accessing-data" target="_blank" rel="noopener">McKinney — Chapter 6: Data Loading, Storage, and File Formats</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A file contains the price “1.250.000” (Vietnamese thousands dots). Which <code>read_csv</code> argument makes it the number 1250000?</li><li>After loading, <code>df["ngay_dat"].max()</code> shows 2026-12-10 although every order is from October. What probably happened?</li><li>Why is Parquet better than CSV for saving a cleaned DataFrame you will reload tomorrow?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <code>thousands="."</code> (and, if decimals use a comma, <code>decimal=","</code>). 2) The dates were parsed month-first: “12/10/2026” (12 October) became 10 December. Use <code>dayfirst=True</code> or an explicit <code>format="%d/%m/%Y"</code>. 3) Parquet stores dtypes (dates, categories, integers with missing values), is compressed and faster, so no re-parsing mistakes.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 2 · Bài 2.1</span>
<h2>Đọc tệp: CSV, JSON và các định dạng khác mà không sai âm thầm</h2>
<p class="lead">Lỗi đầu tiên của đa số dự án xảy ra ngay dòng một: tệp được đọc “thành công” nhưng sai — một cột khổng lồ, số bị lưu thành chữ, ngày bị đảo ngày/tháng. pandas sẽ không báo lỗi; bạn phải tự kiểm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng các tham số chính của <code>read_csv</code>: dấu phân cách, dấu thập phân, ký hiệu giá trị thiếu, ngày tháng, mã hoá.</li><li>Đọc và ghi JSON Lines.</li><li>Biết khi nào dùng Excel và Parquet, và cách kiểm tra mọi tệp vừa nạp.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Tệp CSV (“comma-separated values”) chỉ là văn bản, và không có một chuẩn duy nhất. Bảng tính đặt ngôn ngữ tiếng Việt hoặc nhiều vùng châu Âu xuất ra với dấu phân cách <strong>chấm phẩy</strong> và <strong>dấu phẩy thập phân</strong> (125,5 thay vì 125.5), và ghi ngày theo <strong>ngày/tháng/năm</strong>. Giá trị thiếu có thể là ô trống, “N/A”, “-” hay “null”. Ví dụ dưới đây đọc một tệp như vậy hai lần: một lần ngây thơ, một lần đúng.</p>
<pre><code class="language-python">import pandas as pd

# A CSV exported from a Vietnamese spreadsheet: ";" separator, decimal comma, dd/mm/yyyy dates
raw = """ma_don;quan;ngay_dat;tong_tien;phi_ship
D001;Cầu Giấy;03/10/2026;125,5;15
D002;Đống Đa;03/10/2026;89,0;N/A
D003;Hoàn Kiếm;04/10/2026;240,75;20
D004;Cầu Giấy;05/10/2026;;15
"""
with open("orders_vn.csv", "w", encoding="utf-8") as f:
    f.write(raw)

naive = pd.read_csv("orders_vn.csv")                  # default: sep="," -&gt; one wrong column
print("naive shape:", naive.shape)

df = pd.read_csv(
    "orders_vn.csv", sep=";", decimal=",", encoding="utf-8",
    na_values=["N/A"], parse_dates=["ngay_dat"], dayfirst=True,
)
print(df)
print(df.dtypes)

# JSON Lines: one JSON object per line, common for logs and API dumps
df.to_json("orders.jsonl", orient="records", lines=True, date_format="iso", force_ascii=False)
back = pd.read_json("orders.jsonl", lines=True)
print("round trip rows:", len(back), "| first line:", open("orders.jsonl", encoding="utf-8").readline().strip())</code></pre>
<div class="out">naive shape: (4, 1)
  ma_don       quan   ngay_dat  tong_tien  phi_ship
0   D001   Cầu Giấy 2026-10-03     125.50      15.0
1   D002    Đống Đa 2026-10-03      89.00       NaN
2   D003  Hoàn Kiếm 2026-10-04     240.75      20.0
3   D004   Cầu Giấy 2026-10-05        NaN      15.0
ma_don                  str
quan                    str
ngay_dat     datetime64[us]
tong_tien           float64
phi_ship            float64
dtype: object
round trip rows: 4 | first line: {"ma_don":"D001","quan":"Cầu Giấy","ngay_dat":"2026-10-03T00:00:00.000","tong_tien":125.5,"phi_ship":15.0}</div>
<p>Từng dòng: lần đọc ngây thơ cho shape <code>(4, 1)</code> — mọi dòng bị ép vào một cột chữ, dấu hiệu chắc chắn của sai dấu phân cách. Lệnh đúng sửa năm chỗ cùng lúc: <code>sep=";"</code>, <code>decimal=","</code>, <code>na_values=["N/A"]</code> để “N/A” thành giá trị thiếu thật (NaN), <code>parse_dates</code> với <code>dayfirst=True</code> để 03/10/2026 là ngày 3 tháng 10 chứ không phải 10 tháng 3, và <code>encoding="utf-8"</code> rõ ràng để dấu tiếng Việt còn nguyên. Các dtype xác nhận: cột tiền là <code>float64</code>, cột ngày là <code>datetime64</code>. (pandas 3 hiển thị cột chữ là <code>str</code>; bản cũ hiển thị <code>object</code>.)</p>
<p><strong>JSON Lines</strong> (mỗi dòng một đối tượng JSON, đuôi <code>.jsonl</code>) là định dạng thường dùng cho log và dữ liệu xuất từ API vì có thể ghi nối và đọc dần từng dòng. <code>force_ascii=False</code> giữ “Cầu Giấy” đọc được thay vì chuỗi thoát <code>\\u1ea7</code>.</p>
<p><strong>Định dạng khác.</strong> Excel: <code>pd.read_excel("file.xlsx", sheet_name="Sheet1")</code> cần gói <code>openpyxl</code>; cẩn thận ô tiêu đề bị gộp và dòng tổng ở cuối. <strong>Parquet</strong> (<code>pd.read_parquet</code>, cần <code>pyarrow</code>) là định dạng nhị phân nén, lưu theo cột, giữ dtype nên ngày vẫn là ngày — lựa chọn tốt nhất để lưu dữ liệu đã làm sạch giữa các bước. Với CSV rất lớn, chỉ đọc cột cần (<code>usecols=</code>) hoặc đọc từng phần (<code>chunksize=</code>).</p>
<div class="formula"><span class="lbl">Danh sách kiểm sau mỗi lần nạp</span>df.shape · df.dtypes · df.head() và df.tail() · df.isna().sum() · min/max của các cột số và cột ngày quan trọng</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Không nhìn shape — chỉ một cột nghĩa là sai dấu phân cách.</li><li>Số bị đọc thành chữ do dấu phẩy thập phân hoặc dấu phân cách hàng nghìn (<code>thousands="."</code> sửa 1.250.000).</li><li>Ngày mơ hồ bị đọc theo tháng trước: 03/10 thành 10 tháng 3.</li><li>Tiếng Việt bị lỗi phông (mojibake) do sai mã hoá; tệp xuất từ Windows có thể là <code>"utf-8-sig"</code> hoặc <code>"cp1258"</code>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>CSV không có chuẩn duy nhất: đặt <code>sep</code>, <code>decimal</code>, <code>na_values</code>, <code>parse_dates</code>/<code>dayfirst</code>, <code>encoding</code>.</li><li>JSON Lines hợp cho log; Parquet hợp để lưu dữ liệu sạch kèm kiểu.</li><li>Luôn kiểm shape, dtype, head/tail và số giá trị thiếu ngay sau khi nạp.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://pandas.pydata.org/docs/user_guide/io.html" target="_blank" rel="noopener">pandas User Guide — Công cụ IO (văn bản, CSV, JSON, Excel, Parquet)</a></li><li><a href="https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html" target="_blank" rel="noopener">pandas — tài liệu read_csv</a></li><li><a href="https://wesmckinney.com/book/accessing-data" target="_blank" rel="noopener">McKinney — Chương 6: Nạp, lưu trữ dữ liệu và định dạng tệp</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một tệp có giá “1.250.000” (dấu chấm hàng nghìn kiểu Việt). Tham số <code>read_csv</code> nào biến nó thành số 1250000?</li><li>Sau khi nạp, <code>df["ngay_dat"].max()</code> ra 2026-12-10 dù mọi đơn đều thuộc tháng 10. Có lẽ đã xảy ra chuyện gì?</li><li>Vì sao Parquet tốt hơn CSV để lưu một DataFrame đã làm sạch mà mai bạn sẽ nạp lại?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <code>thousands="."</code> (và nếu số lẻ dùng dấu phẩy thì thêm <code>decimal=","</code>). 2) Ngày bị đọc theo tháng trước: “12/10/2026” (12 tháng 10) thành 10 tháng 12. Dùng <code>dayfirst=True</code> hoặc <code>format="%d/%m/%Y"</code> rõ ràng. 3) Parquet lưu dtype (ngày, category, số nguyên có giá trị thiếu), nén và nhanh hơn, nên không có lỗi đọc lại.</p></div>`);

const c22 = L('dsi201-ts-2-2',
  '2.2 — Web APIs: JSON, pagination and flattening nested data|||2.2 — API web: JSON, phân trang và làm phẳng dữ liệu lồng nhau',
  'API REST trả JSON; dựng một API nhỏ chạy cục bộ rồi viết client đi theo phân trang, json_normalize dữ liệu lồng; khoá API, giới hạn tần suất, thử lại, lưu bản thô.',
  `<span class="eyebrow">DSI201 · Chapter 2 · Lesson 2.2</span>
<h2>Web APIs: JSON, pagination and flattening nested data</h2>
<p class="lead">Much useful data — weather, exchange rates, public transport, your own company's services — is not in files but behind a web API that answers HTTP requests with JSON.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain requests, status codes, query parameters and JSON responses.</li><li>Write a client loop that follows pagination until the last page.</li><li>Flatten nested JSON into a table with <code>pd.json_normalize</code>, and collect data politely and safely.</li></ul>
<h3>📖 Lecture</h3>
<p>A REST API is a set of URLs. You send an HTTP <code>GET</code> request such as <code>https://api.example.com/restaurants?page=2</code>; the server answers with a <strong>status code</strong> (200 OK, 401 unauthorised, 404 not found, 429 too many requests, 5xx server error) and a body, usually JSON — nested dictionaries and lists. APIs rarely return everything at once: they <strong>paginate</strong>, giving one page plus a pointer to the next page (a page number, a cursor or a “next” URL).</p>
<p>To keep the example runnable offline and reproducible, the code first starts a tiny API server on your own machine (the standard-library <code>http.server</code>), then acts as a client exactly as it would against a real service. In real projects you would usually use the <code>requests</code> package (<code>requests.get(url, params=..., timeout=10)</code>); here the standard-library <code>urllib.request</code> does the same job.</p>
<pre><code class="language-python">import json, threading, urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import pandas as pd

# --- A tiny local API that serves restaurants page by page (stands in for a real web API) ---
RESTAURANTS = [{"id": i, "name": f"Quan {i}", "rating": round(3.5 + (i % 4) * 0.4, 1),
                "location": {"district": ["Ba Dinh", "Dong Da", "Cau Giay"][i % 3], "lat": 21.0 + i / 1000}}
               for i in range(1, 8)]

class Api(BaseHTTPRequestHandler):
    def do_GET(self):
        q = parse_qs(urlparse(self.path).query)
        page, size = int(q.get("page", [1])[0]), 3
        items = RESTAURANTS[(page - 1) * size: page * size]
        body = {"page": page, "next": page + 1 if page * size &lt; len(RESTAURANTS) else None, "items": items}
        data = json.dumps(body).encode()
        self.send_response(200); self.send_header("Content-Type", "application/json"); self.end_headers()
        self.wfile.write(data)
    def log_message(self, *args):
        pass

server = HTTPServer(("127.0.0.1", 0), Api)
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_port}/restaurants"

# --- Client side: follow pagination until "next" is None ---
rows, page = [], 1
while page is not None:
    with urllib.request.urlopen(f"{base}?page={page}", timeout=5) as resp:
        payload = json.load(resp)
    print("page", payload["page"], "-&gt;", len(payload["items"]), "items")
    rows.extend(payload["items"])
    page = payload["next"]
server.shutdown()

# Nested JSON -&gt; flat table: location.district becomes its own column
df = pd.json_normalize(rows)
print(df.columns.tolist())
print(df.groupby("location.district")["rating"].agg(["count", "mean"]))</code></pre>
<div class="out">page 1 -&gt; 3 items
page 2 -&gt; 3 items
page 3 -&gt; 1 items
['id', 'name', 'rating', 'location.district', 'location.lat']
                   count      mean
location.district                 
Ba Dinh                2  4.500000
Cau Giay               2  4.100000
Dong Da                3  4.033333</div>
<p>The client loop is the reusable part: request a page, keep its items, read <code>next</code>, stop when it is <code>None</code>. Seven restaurants arrived in three pages (3 + 3 + 1). Each item had a nested <code>location</code> object; <code>json_normalize</code> turned it into dotted columns <code>location.district</code> and <code>location.lat</code>, after which ordinary pandas grouping works.</p>
<p><strong>Collecting responsibly.</strong></p>
<ul>
<li><strong>Keys:</strong> most APIs need a key. Put it in an environment variable or a <code>.env</code> file that is <em>not</em> committed to git, never in the notebook (Chapter 11).</li>
<li><strong>Rate limits:</strong> respect the documented limit; on 429 or 5xx wait and retry with growing pauses (exponential back-off), and always set a <code>timeout</code>.</li>
<li><strong>Save the raw responses</strong> (for example as JSON Lines with the download time) before transforming them. If the API changes or goes down, your analysis can still be re-run.</li>
<li><strong>Terms of use:</strong> read them. Scraping websites that forbid it, or collecting personal data without a legal basis, is not acceptable just because it is technically possible.</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reading only the first page and believing it is the whole dataset.</li><li>No timeout — the notebook hangs forever when the server does not answer.</li><li>Ignoring the status code and parsing an error page as data.</li><li>Hard-coding the API key in shared code.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>APIs answer HTTP requests with status codes and JSON bodies.</li><li>Loop over pages until there is no next page; check the status of every response.</li><li><code>pd.json_normalize</code> flattens nested JSON into columns.</li><li>Use timeouts, back-off, secret keys outside code, and keep raw responses.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://requests.readthedocs.io/en/latest/user/quickstart/" target="_blank" rel="noopener">Requests — Quickstart (GET, params, JSON, timeouts)</a></li><li><a href="https://pandas.pydata.org/docs/reference/api/pandas.json_normalize.html" target="_blank" rel="noopener">pandas — json_normalize reference</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status" target="_blank" rel="noopener">MDN — HTTP response status codes</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Change the page size in the server from 3 to 2. How many pages will the client request, and how many items arrive in the last page?</li><li>Write the pseudo-code for a retry with exponential back-off: at most 4 attempts, waiting 1, 2, 4 seconds.</li><li>An item looks like <code>{"id": 1, "menu": [{"dish": "pho"}, {"dish": "bun"}]}</code>. What does <code>pd.json_normalize(items, record_path="menu", meta=["id"])</code> produce?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Seven items in pages of 2: four pages (2 + 2 + 2 + 1); the last page has 1 item. 2) <code>for attempt in range(4): r = get(url, timeout=10); if r.status == 200: break; sleep(2 ** attempt)</code> — and raise an error if all attempts fail. 3) One row per dish with columns <code>dish</code> and <code>id</code>: (pho, 1) and (bun, 1).</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 2 · Bài 2.2</span>
<h2>API web: JSON, phân trang và làm phẳng dữ liệu lồng nhau</h2>
<p class="lead">Rất nhiều dữ liệu hữu ích — thời tiết, tỉ giá, giao thông công cộng, dịch vụ của chính công ty bạn — không nằm trong tệp mà nằm sau một API web trả lời yêu cầu HTTP bằng JSON.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích yêu cầu HTTP, mã trạng thái, tham số truy vấn và phản hồi JSON.</li><li>Viết vòng lặp client đi theo phân trang tới trang cuối.</li><li>Làm phẳng JSON lồng nhau thành bảng bằng <code>pd.json_normalize</code>, và thu thập dữ liệu lịch sự, an toàn.</li></ul>
<h3>📖 Bài giảng</h3>
<p>API REST là một tập URL. Bạn gửi yêu cầu HTTP <code>GET</code> như <code>https://api.example.com/restaurants?page=2</code>; server trả về <strong>mã trạng thái</strong> (200 OK, 401 chưa xác thực, 404 không tìm thấy, 429 quá nhiều yêu cầu, 5xx lỗi server) và phần thân, thường là JSON — các dict và list lồng nhau. API hiếm khi trả hết một lần: chúng <strong>phân trang</strong>, đưa một trang kèm con trỏ tới trang sau (số trang, cursor hoặc URL “next”).</p>
<p>Để ví dụ chạy được không cần mạng và cho cùng kết quả, đoạn code trước hết dựng một server API nhỏ ngay trên máy bạn (<code>http.server</code> của thư viện chuẩn), rồi đóng vai client y như khi gọi một dịch vụ thật. Trong dự án thật bạn thường dùng gói <code>requests</code> (<code>requests.get(url, params=..., timeout=10)</code>); ở đây <code>urllib.request</code> của thư viện chuẩn làm cùng việc.</p>
<pre><code class="language-python">import json, threading, urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import pandas as pd

# --- A tiny local API that serves restaurants page by page (stands in for a real web API) ---
RESTAURANTS = [{"id": i, "name": f"Quan {i}", "rating": round(3.5 + (i % 4) * 0.4, 1),
                "location": {"district": ["Ba Dinh", "Dong Da", "Cau Giay"][i % 3], "lat": 21.0 + i / 1000}}
               for i in range(1, 8)]

class Api(BaseHTTPRequestHandler):
    def do_GET(self):
        q = parse_qs(urlparse(self.path).query)
        page, size = int(q.get("page", [1])[0]), 3
        items = RESTAURANTS[(page - 1) * size: page * size]
        body = {"page": page, "next": page + 1 if page * size &lt; len(RESTAURANTS) else None, "items": items}
        data = json.dumps(body).encode()
        self.send_response(200); self.send_header("Content-Type", "application/json"); self.end_headers()
        self.wfile.write(data)
    def log_message(self, *args):
        pass

server = HTTPServer(("127.0.0.1", 0), Api)
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_port}/restaurants"

# --- Client side: follow pagination until "next" is None ---
rows, page = [], 1
while page is not None:
    with urllib.request.urlopen(f"{base}?page={page}", timeout=5) as resp:
        payload = json.load(resp)
    print("page", payload["page"], "-&gt;", len(payload["items"]), "items")
    rows.extend(payload["items"])
    page = payload["next"]
server.shutdown()

# Nested JSON -&gt; flat table: location.district becomes its own column
df = pd.json_normalize(rows)
print(df.columns.tolist())
print(df.groupby("location.district")["rating"].agg(["count", "mean"]))</code></pre>
<div class="out">page 1 -&gt; 3 items
page 2 -&gt; 3 items
page 3 -&gt; 1 items
['id', 'name', 'rating', 'location.district', 'location.lat']
                   count      mean
location.district                 
Ba Dinh                2  4.500000
Cau Giay               2  4.100000
Dong Da                3  4.033333</div>
<p>Vòng lặp client là phần dùng lại được: gọi một trang, giữ các item, đọc <code>next</code>, dừng khi nó là <code>None</code>. Bảy nhà hàng về trong ba trang (3 + 3 + 1). Mỗi item có đối tượng lồng <code>location</code>; <code>json_normalize</code> biến nó thành các cột có dấu chấm <code>location.district</code> và <code>location.lat</code>, sau đó gom nhóm pandas bình thường.</p>
<p><strong>Thu thập có trách nhiệm.</strong></p>
<ul>
<li><strong>Khoá:</strong> đa số API cần khoá. Để khoá trong biến môi trường hoặc tệp <code>.env</code> <em>không</em> commit lên git, không bao giờ để trong notebook (Chương 11).</li>
<li><strong>Giới hạn tần suất:</strong> tôn trọng giới hạn được công bố; gặp 429 hay 5xx thì chờ rồi thử lại với khoảng nghỉ tăng dần (exponential back-off), và luôn đặt <code>timeout</code>.</li>
<li><strong>Lưu phản hồi thô</strong> (vd dạng JSON Lines kèm thời điểm tải) trước khi biến đổi. Nếu API đổi hay sập, phân tích của bạn vẫn chạy lại được.</li>
<li><strong>Điều khoản sử dụng:</strong> hãy đọc. Cào web khi trang cấm, hay thu dữ liệu cá nhân không có cơ sở pháp lý, không thể chấp nhận chỉ vì về kỹ thuật làm được.</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ đọc trang đầu rồi tưởng đó là toàn bộ dữ liệu.</li><li>Không đặt timeout — notebook treo mãi khi server không trả lời.</li><li>Bỏ qua mã trạng thái và phân tích một trang lỗi như thể dữ liệu.</li><li>Ghi cứng khoá API trong code chia sẻ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>API trả lời yêu cầu HTTP bằng mã trạng thái và thân JSON.</li><li>Lặp qua các trang tới khi không còn trang sau; kiểm mã trạng thái mọi phản hồi.</li><li><code>pd.json_normalize</code> làm phẳng JSON lồng thành các cột.</li><li>Dùng timeout, back-off, giữ khoá bí mật ngoài code, và lưu phản hồi thô.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://requests.readthedocs.io/en/latest/user/quickstart/" target="_blank" rel="noopener">Requests — Quickstart (GET, params, JSON, timeout)</a></li><li><a href="https://pandas.pydata.org/docs/reference/api/pandas.json_normalize.html" target="_blank" rel="noopener">pandas — tài liệu json_normalize</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status" target="_blank" rel="noopener">MDN — Mã trạng thái phản hồi HTTP</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đổi kích thước trang trên server từ 3 thành 2. Client sẽ gọi bao nhiêu trang, trang cuối có bao nhiêu item?</li><li>Viết giả mã thử lại với back-off luỹ thừa: tối đa 4 lần, chờ 1, 2, 4 giây.</li><li>Một item có dạng <code>{"id": 1, "menu": [{"dish": "pho"}, {"dish": "bun"}]}</code>. <code>pd.json_normalize(items, record_path="menu", meta=["id"])</code> cho ra gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Bảy item, mỗi trang 2: bốn trang (2 + 2 + 2 + 1); trang cuối có 1 item. 2) <code>for attempt in range(4): r = get(url, timeout=10); if r.status == 200: break; sleep(2 ** attempt)</code> — và báo lỗi nếu mọi lần đều hỏng. 3) Mỗi món một dòng với cột <code>dish</code> và <code>id</code>: (pho, 1) và (bun, 1).</p></div>`);

const c23 = L('dsi201-ts-2-3',
  '2.3 — SQL databases: let the database join and aggregate|||2.3 — Cơ sở dữ liệu SQL: để CSDL làm việc ghép bảng và tổng hợp',
  'sqlite3 + pandas.read_sql_query: JOIN, WHERE, GROUP BY trong CSDL, kéo về kết quả nhỏ; truy vấn tham số chống SQL injection; ghi DataFrame thành bảng; kết nối CSDL thật.',
  `<span class="eyebrow">DSI201 · Chapter 2 · Lesson 2.3</span>
<h2>SQL databases: let the database join and aggregate</h2>
<p class="lead">In companies, most data live in relational databases (PostgreSQL, MySQL, SQL Server). A data scientist writes SQL to pull exactly the rows and columns needed, then continues in pandas.</p>
<h3>🎯 Objectives</h3>
<ul><li>Run SQL from Python and get a DataFrame back with <code>pd.read_sql_query</code>.</li><li>Decide what to do in SQL (filter, join, aggregate) and what to do in pandas.</li><li>Use parameterised queries to avoid SQL injection, and write results back as tables.</li></ul>
<h3>📖 Lecture</h3>
<p>A relational database stores <strong>tables</strong> linked by keys: here <code>drivers(driver_id, name, vehicle)</code> and <code>deliveries(order_id, driver_id, district, minutes)</code>. The SQL you met in your database course (DBI202 at FPTU) is the language to ask questions across them. Python's standard library includes <strong>SQLite</strong>, a full SQL engine in a single file (or in memory), which is perfect for learning and for small projects; the same pandas call works with PostgreSQL or MySQL through a connection created by SQLAlchemy.</p>
<pre><code class="language-python">import sqlite3
import pandas as pd

con = sqlite3.connect(":memory:")            # a real SQL database, kept in memory
con.executescript("""
CREATE TABLE drivers(driver_id INTEGER PRIMARY KEY, name TEXT, vehicle TEXT);
CREATE TABLE deliveries(order_id INTEGER PRIMARY KEY, driver_id INTEGER, district TEXT, minutes REAL);
INSERT INTO drivers VALUES (1,'An','motorbike'),(2,'Binh','motorbike'),(3,'Chi','bicycle');
INSERT INTO deliveries VALUES
 (101,1,'Ba Dinh',28),(102,1,'Dong Da',35),(103,2,'Ba Dinh',22),
 (104,3,'Ba Dinh',41),(105,3,'Cau Giay',47),(106,2,'Cau Giay',30),(107,1,'Cau Giay',33);
""")

# Let the database do the join and the aggregation; pull back only the small result
sql = """
SELECT d.vehicle, COUNT(*) AS n_orders, ROUND(AVG(x.minutes), 1) AS avg_minutes
FROM deliveries x JOIN drivers d ON d.driver_id = x.driver_id
WHERE x.district = ?
GROUP BY d.vehicle
ORDER BY avg_minutes
"""
print(pd.read_sql_query(sql, con, params=("Ba Dinh",)))

# Parameters (?) instead of string formatting: safe against SQL injection
evil = "Ba Dinh' OR '1'='1"
print("rows with evil input:", len(pd.read_sql_query("SELECT * FROM deliveries WHERE district = ?", con, params=(evil,))))

# Write a pandas result back as a new table
summary = pd.read_sql_query("SELECT district, AVG(minutes) AS avg_min FROM deliveries GROUP BY district", con)
summary.to_sql("district_summary", con, index=False)
print(con.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall())</code></pre>
<div class="out">     vehicle  n_orders  avg_minutes
0  motorbike         2         25.0
1    bicycle         1         41.0
rows with evil input: 0
[('drivers',), ('deliveries',), ('district_summary',)]</div>
<p>What happened: the query joined the two tables on <code>driver_id</code>, kept only Ba Dinh orders, grouped by vehicle type and averaged — all inside the database. Only two summary rows travelled to Python: motorbikes averaged 25.0 minutes over 2 orders, the bicycle 41.0 minutes over 1 order. (With 1–2 orders per group, these numbers are anecdotes, not evidence — Chapter 4 talks about group sizes.)</p>
<div class="formula"><span class="lbl">Rule of thumb</span>Filter rows, select columns, join and aggregate in SQL (the database is fast and the data may not fit in memory) → do exploration, reshaping, plots and modelling in pandas.</div>
<p><strong>Parameters, not string formatting.</strong> Never build SQL by gluing user input into a string (<code>"... WHERE district = '" + text + "'"</code>). A malicious value like <code>Ba Dinh' OR '1'='1</code> would change the query's meaning and return every row — the classic <strong>SQL injection</strong> attack. With a placeholder (<code>?</code> in SQLite, <code>%s</code> or <code>:name</code> in other drivers) the value is sent separately and treated as plain text: the evil input matched 0 rows.</p>
<p><strong>Writing back.</strong> <code>df.to_sql("district_summary", con)</code> stores a DataFrame as a new table so that dashboards or colleagues can query your result. For a real server you would write, for example, <code>engine = sqlalchemy.create_engine("postgresql+psycopg://user@host/db")</code> and pass <code>engine</code> instead of <code>con</code>, with the password read from an environment variable.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li><code>SELECT *</code> on a table with millions of rows, then filtering in pandas — slow and memory-hungry.</li><li>Joins that multiply rows: joining orders to a table with several rows per driver duplicates orders; check counts before and after.</li><li>String-formatted SQL with user input (injection risk).</li><li>Forgetting that SQL <code>NULL</code> becomes <code>NaN</code>/<code>None</code> in pandas and is excluded by <code>AVG</code>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li><code>pd.read_sql_query(sql, con, params=...)</code> returns a DataFrame from any SQL database.</li><li>Push filtering, joins and aggregation into SQL; analyse the small result in pandas.</li><li>Always use parameter placeholders for values.</li><li><code>to_sql</code> writes results back as a table.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://docs.python.org/3/library/sqlite3.html" target="_blank" rel="noopener">Python docs — sqlite3 (including placeholders)</a></li><li><a href="https://pandas.pydata.org/docs/reference/api/pandas.read_sql_query.html" target="_blank" rel="noopener">pandas — read_sql_query reference</a></li><li><a href="https://sqlbolt.com/" target="_blank" rel="noopener">SQLBolt — interactive SQL lessons</a></li><li><a href="https://owasp.org/www-community/attacks/SQL_Injection" target="_blank" rel="noopener">OWASP — SQL Injection</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write a query that returns, for each driver name, the number of deliveries and the longest delivery, ordered by number of deliveries descending.</li><li>Why does the query in the lesson return only motorbike and bicycle, not a row for every vehicle type?</li><li>A colleague writes <code>pd.read_sql_query(f"SELECT * FROM users WHERE email = '{email}'", con)</code>. Rewrite it safely.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <code>SELECT d.name, COUNT(*) AS n, MAX(x.minutes) AS longest FROM deliveries x JOIN drivers d ON d.driver_id = x.driver_id GROUP BY d.name ORDER BY n DESC;</code> (An has 3 deliveries.) 2) The WHERE clause keeps only Ba Dinh deliveries, and only those two vehicle types delivered there; GROUP BY creates groups only for values present in the filtered rows. 3) <code>pd.read_sql_query("SELECT * FROM users WHERE email = ?", con, params=(email,))</code>.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 2 · Bài 2.3</span>
<h2>Cơ sở dữ liệu SQL: để CSDL làm việc ghép bảng và tổng hợp</h2>
<p class="lead">Ở doanh nghiệp, phần lớn dữ liệu nằm trong cơ sở dữ liệu quan hệ (PostgreSQL, MySQL, SQL Server). Người làm khoa học dữ liệu viết SQL để lấy đúng dòng và cột cần, rồi làm tiếp bằng pandas.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chạy SQL từ Python và nhận về DataFrame bằng <code>pd.read_sql_query</code>.</li><li>Quyết định việc nào làm bằng SQL (lọc, ghép, tổng hợp) và việc nào làm bằng pandas.</li><li>Dùng truy vấn tham số để tránh SQL injection, và ghi kết quả trở lại thành bảng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cơ sở dữ liệu quan hệ lưu các <strong>bảng</strong> nối với nhau bằng khoá: ở đây là <code>drivers(driver_id, name, vehicle)</code> và <code>deliveries(order_id, driver_id, district, minutes)</code>. SQL bạn học ở môn cơ sở dữ liệu (DBI202 ở FPTU) là ngôn ngữ để đặt câu hỏi xuyên qua các bảng. Thư viện chuẩn Python có sẵn <strong>SQLite</strong>, một bộ máy SQL đầy đủ nằm trong một tệp (hoặc trong bộ nhớ), rất hợp để học và cho dự án nhỏ; cùng lệnh pandas đó chạy được với PostgreSQL hay MySQL qua kết nối tạo bằng SQLAlchemy.</p>
<pre><code class="language-python">import sqlite3
import pandas as pd

con = sqlite3.connect(":memory:")            # a real SQL database, kept in memory
con.executescript("""
CREATE TABLE drivers(driver_id INTEGER PRIMARY KEY, name TEXT, vehicle TEXT);
CREATE TABLE deliveries(order_id INTEGER PRIMARY KEY, driver_id INTEGER, district TEXT, minutes REAL);
INSERT INTO drivers VALUES (1,'An','motorbike'),(2,'Binh','motorbike'),(3,'Chi','bicycle');
INSERT INTO deliveries VALUES
 (101,1,'Ba Dinh',28),(102,1,'Dong Da',35),(103,2,'Ba Dinh',22),
 (104,3,'Ba Dinh',41),(105,3,'Cau Giay',47),(106,2,'Cau Giay',30),(107,1,'Cau Giay',33);
""")

# Let the database do the join and the aggregation; pull back only the small result
sql = """
SELECT d.vehicle, COUNT(*) AS n_orders, ROUND(AVG(x.minutes), 1) AS avg_minutes
FROM deliveries x JOIN drivers d ON d.driver_id = x.driver_id
WHERE x.district = ?
GROUP BY d.vehicle
ORDER BY avg_minutes
"""
print(pd.read_sql_query(sql, con, params=("Ba Dinh",)))

# Parameters (?) instead of string formatting: safe against SQL injection
evil = "Ba Dinh' OR '1'='1"
print("rows with evil input:", len(pd.read_sql_query("SELECT * FROM deliveries WHERE district = ?", con, params=(evil,))))

# Write a pandas result back as a new table
summary = pd.read_sql_query("SELECT district, AVG(minutes) AS avg_min FROM deliveries GROUP BY district", con)
summary.to_sql("district_summary", con, index=False)
print(con.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall())</code></pre>
<div class="out">     vehicle  n_orders  avg_minutes
0  motorbike         2         25.0
1    bicycle         1         41.0
rows with evil input: 0
[('drivers',), ('deliveries',), ('district_summary',)]</div>
<p>Chuyện gì đã xảy ra: truy vấn ghép hai bảng theo <code>driver_id</code>, chỉ giữ đơn ở Ba Đình, gom theo loại xe và lấy trung bình — tất cả bên trong CSDL. Chỉ hai dòng tóm tắt đi về Python: xe máy trung bình 25,0 phút qua 2 đơn, xe đạp 41,0 phút qua 1 đơn. (Với 1–2 đơn mỗi nhóm, các con số này chỉ là giai thoại, chưa phải bằng chứng — Chương 4 bàn về cỡ nhóm.)</p>
<div class="formula"><span class="lbl">Quy tắc kinh nghiệm</span>Lọc dòng, chọn cột, ghép bảng và tổng hợp bằng SQL (CSDL nhanh và dữ liệu có thể không vừa bộ nhớ) → khám phá, tổ chức lại, vẽ biểu đồ và mô hình hoá bằng pandas.</div>
<p><strong>Dùng tham số, không ghép chuỗi.</strong> Không bao giờ dựng SQL bằng cách dán dữ liệu người dùng vào chuỗi (<code>"... WHERE district = '" + text + "'"</code>). Một giá trị độc như <code>Ba Dinh' OR '1'='1</code> sẽ đổi nghĩa truy vấn và trả về mọi dòng — kiểu tấn công <strong>SQL injection</strong> kinh điển. Với chỗ giữ chỗ (<code>?</code> trong SQLite, <code>%s</code> hoặc <code>:ten</code> ở driver khác), giá trị được gửi riêng và được coi là chữ thuần: đầu vào độc khớp 0 dòng.</p>
<p><strong>Ghi ngược lại.</strong> <code>df.to_sql("district_summary", con)</code> lưu DataFrame thành bảng mới để dashboard hay đồng nghiệp truy vấn kết quả của bạn. Với server thật, bạn viết chẳng hạn <code>engine = sqlalchemy.create_engine("postgresql+psycopg://user@host/db")</code> rồi truyền <code>engine</code> thay cho <code>con</code>, mật khẩu đọc từ biến môi trường.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li><code>SELECT *</code> trên bảng hàng triệu dòng rồi mới lọc bằng pandas — chậm và tốn bộ nhớ.</li><li>Phép ghép nhân bản dòng: ghép đơn với bảng có nhiều dòng cho mỗi tài xế sẽ lặp đơn; kiểm số dòng trước và sau.</li><li>SQL ghép chuỗi với dữ liệu người dùng (nguy cơ injection).</li><li>Quên rằng <code>NULL</code> của SQL thành <code>NaN</code>/<code>None</code> trong pandas và bị <code>AVG</code> bỏ qua.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li><code>pd.read_sql_query(sql, con, params=...)</code> trả về DataFrame từ mọi CSDL SQL.</li><li>Đẩy lọc, ghép và tổng hợp vào SQL; phân tích kết quả nhỏ bằng pandas.</li><li>Luôn dùng chỗ giữ chỗ tham số cho giá trị.</li><li><code>to_sql</code> ghi kết quả trở lại thành bảng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://docs.python.org/3/library/sqlite3.html" target="_blank" rel="noopener">Tài liệu Python — sqlite3 (có phần placeholder)</a></li><li><a href="https://pandas.pydata.org/docs/reference/api/pandas.read_sql_query.html" target="_blank" rel="noopener">pandas — tài liệu read_sql_query</a></li><li><a href="https://sqlbolt.com/" target="_blank" rel="noopener">SQLBolt — bài học SQL tương tác</a></li><li><a href="https://owasp.org/www-community/attacks/SQL_Injection" target="_blank" rel="noopener">OWASP — SQL Injection</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết truy vấn trả về, cho mỗi tên tài xế, số chuyến giao và chuyến lâu nhất, sắp theo số chuyến giảm dần.</li><li>Vì sao truy vấn trong bài chỉ trả về xe máy và xe đạp, không có dòng cho mọi loại xe?</li><li>Một bạn viết <code>pd.read_sql_query(f"SELECT * FROM users WHERE email = '{email}'", con)</code>. Viết lại cho an toàn.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <code>SELECT d.name, COUNT(*) AS n, MAX(x.minutes) AS longest FROM deliveries x JOIN drivers d ON d.driver_id = x.driver_id GROUP BY d.name ORDER BY n DESC;</code> (An có 3 chuyến.) 2) Mệnh đề WHERE chỉ giữ chuyến ở Ba Đình, và chỉ hai loại xe đó giao ở đây; GROUP BY chỉ tạo nhóm cho giá trị có mặt trong các dòng đã lọc. 3) <code>pd.read_sql_query("SELECT * FROM users WHERE email = ?", con, params=(email,))</code>.</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: Acquiring data|||Quiz — Chương 2: Thu thập dữ liệu',
  'Quiz 8 câu: tham số read_csv, JSON Lines, Parquet, mã trạng thái HTTP, phân trang, json_normalize, SQL trong CSDL vs pandas, SQL injection.', [
  Q('q1', 'read_csv returns shape (1000, 1) for a file with 6 fields per line. Most likely cause?|||read_csv trả shape (1000, 1) cho tệp có 6 trường mỗi dòng. Nguyên nhân khả dĩ nhất?',
    ['Wrong separator|||Sai dấu phân cách', 'Wrong encoding|||Sai mã hoá', 'Too many rows|||Quá nhiều dòng', 'Missing values|||Có giá trị thiếu'], 0,
    'All fields stayed in one column because the separator (often “;”) was not set.|||Mọi trường dính vào một cột vì chưa đặt dấu phân cách (thường là “;”).'),
  Q('q2', 'Which argument makes 03/10/2026 mean 3 October?|||Tham số nào làm 03/10/2026 nghĩa là 3 tháng 10?',
    ['dayfirst=True|||dayfirst=True', 'decimal=","|||decimal=","', 'na_values=["N/A"]|||na_values=["N/A"]', 'usecols=[0]|||usecols=[0]'], 0,
    'dayfirst=True parses day/month/year.|||dayfirst=True đọc theo ngày/tháng/năm.'),
  Q('q3', 'Why save cleaned data as Parquet rather than CSV?|||Vì sao lưu dữ liệu sạch dạng Parquet thay vì CSV?',
    ['It keeps column types and is compressed|||Giữ kiểu dữ liệu của cột và được nén', 'It is human-readable text|||Là văn bản người đọc được', 'Excel requires it|||Excel bắt buộc', 'It removes missing values|||Nó xoá giá trị thiếu'], 0,
    'Parquet is a typed, compressed, columnar binary format.|||Parquet là định dạng nhị phân theo cột, có kiểu, được nén.'),
  Q('q4', 'An API answers HTTP 429. What should the client do?|||API trả HTTP 429. Client nên làm gì?',
    ['Wait and retry with back-off|||Chờ rồi thử lại với back-off', 'Parse the body as data|||Phân tích thân như dữ liệu', 'Retry immediately in a tight loop|||Thử lại ngay liên tục', 'Delete the API key|||Xoá khoá API'], 0,
    '429 means too many requests: slow down and retry later.|||429 nghĩa là quá nhiều yêu cầu: giảm tốc và thử lại sau.'),
  Q('q5', 'In the lesson, how did the client know it had reached the last page?|||Trong bài, client biết đã tới trang cuối nhờ đâu?',
    ['The field next was None|||Trường next bằng None', 'Status 404|||Mã 404', 'The page had 3 items|||Trang có 3 item', 'A timeout occurred|||Bị timeout'], 0,
    'The loop stops when the server says there is no next page.|||Vòng lặp dừng khi server báo không còn trang sau.'),
  Q('q6', 'What does pd.json_normalize do with {"location": {"district": "Ba Dinh"}}?|||pd.json_normalize làm gì với {"location": {"district": "Ba Dinh"}}?',
    ['Creates a column location.district|||Tạo cột location.district', 'Drops the nested object|||Bỏ đối tượng lồng', 'Raises an error|||Báo lỗi', 'Stores a dict in one cell only|||Chỉ lưu dict trong một ô'], 0,
    'Nested keys become dotted column names.|||Khoá lồng thành tên cột có dấu chấm.'),
  Q('q7', 'For a 50-million-row orders table, where should the join and GROUP BY run?|||Với bảng đơn 50 triệu dòng, phép ghép và GROUP BY nên chạy ở đâu?',
    ['In the database, returning a small result|||Trong CSDL, trả về kết quả nhỏ', 'In pandas after SELECT *|||Trong pandas sau SELECT *', 'In Excel|||Trong Excel', 'In a for-loop in Python|||Trong vòng for của Python'], 0,
    'Databases are built for this and avoid moving huge data into memory.|||CSDL được xây cho việc này và tránh kéo dữ liệu khổng lồ vào bộ nhớ.'),
  Q('q8', 'Which query is safe from SQL injection?|||Truy vấn nào an toàn trước SQL injection?',
    ['read_sql_query("... WHERE id = ?", con, params=(x,))|||read_sql_query("... WHERE id = ?", con, params=(x,))', 'read_sql_query("... WHERE id = " + x, con)|||read_sql_query("... WHERE id = " + x, con)', 'read_sql_query(f"... WHERE id = {x}", con)|||read_sql_query(f"... WHERE id = {x}", con)', 'read_sql_query("... WHERE id = %s" % x, con)|||read_sql_query("... WHERE id = %s" % x, con)'], 0,
    'Placeholders send the value separately; string building lets input change the query.|||Chỗ giữ chỗ gửi giá trị riêng; ghép chuỗi cho phép đầu vào đổi nghĩa truy vấn.'),
]);

const ch2 = {
  title: 'Chapter 2 — Acquiring data: files, APIs and SQL|||Chương 2 — Thu thập dữ liệu: tệp, API và SQL',
  description: 'Đọc CSV/JSON/Excel/Parquet không sai âm thầm, gọi API JSON có phân trang và làm phẳng dữ liệu lồng, truy vấn SQL từ pandas an toàn (tham số, chống injection).',
  lessons: [c21, c22, c23, q2],
};


// ───────────────────────────── Chương 3 — Làm sạch & tidy ─────────────────────────────
const c31 = L('dsi201-ts-3-1',
  '3.1 — Tidy data: one variable per column, one observation per row|||3.1 — Dữ liệu tidy: mỗi biến một cột, mỗi quan sát một dòng',
  'Ba nguyên tắc tidy data của Wickham; melt bảng rộng thành bảng dài, tách cột chứa hai biến bằng str.split, pivot_table dựng lại bảng rộng; khi nào dùng dạng rộng.',
  `<span class="eyebrow">DSI201 · Chapter 3 · Lesson 3.1</span>
<h2>Tidy data: one variable per column, one observation per row</h2>
<p class="lead">Data arrive in whatever shape was convenient for the person who made them — usually a report for human eyes. Analysis tools want one standard shape. Converting between them is called reshaping, and the standard shape is called <strong>tidy</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the three rules of tidy data and recognise common violations.</li><li>Reshape wide tables to long with <code>melt</code> and back with <code>pivot_table</code>.</li><li>Split a column that holds two variables.</li></ul>
<h3>📖 Lecture</h3>
<p>Hadley Wickham's paper <em>Tidy Data</em> (Journal of Statistical Software, 2014) gave the rules a name:</p>
<div class="formula"><span class="lbl">Tidy data</span>1. Each variable forms a column.  2. Each observation forms a row.  3. Each type of observational unit forms a table.</div>
<p>The most common violations are: <strong>column headers are values</strong> (one column per month or per year), <strong>several variables in one column</strong> (“S1_motorbike” mixes store and vehicle), <strong>variables stored in rows</strong>, and <strong>one table holding two kinds of unit</strong> (orders and customer details repeated on every order). Below, a manager's report has months as headers and two variables glued in one column.</p>
<pre><code class="language-python">import pandas as pd

# "Wide" report as managers like it: one column per month (the month is hidden in the headers)
wide = pd.DataFrame({
    "store_vehicle": ["S1_motorbike", "S1_bicycle", "S2_motorbike"],
    "2026-08": [410, 95, 388],
    "2026-09": [432, 101, 401],
    "2026-10": [455, 87, 420],
})
print(wide, "\\n")

# 1) melt: month headers become values of a "month" column -&gt; one row per observation
long = wide.melt(id_vars="store_vehicle", var_name="month", value_name="orders")
# 2) one column held two variables: split it
long[["store", "vehicle"]] = long["store_vehicle"].str.split("_", expand=True)
long = long.drop(columns="store_vehicle")[["store", "vehicle", "month", "orders"]]
print(long.head(4), "\\n")
print("tidy shape:", long.shape)

# Tidy data makes questions one-liners
print(long.groupby("vehicle")["orders"].sum(), "\\n")
# ...and any wide view can be rebuilt on demand
print(long.pivot_table(index="store", columns="month", values="orders", aggfunc="sum"))</code></pre>
<div class="out">  store_vehicle  2026-08  2026-09  2026-10
0  S1_motorbike      410      432      455
1    S1_bicycle       95      101       87
2  S2_motorbike      388      401      420 

  store    vehicle    month  orders
0    S1  motorbike  2026-08     410
1    S1    bicycle  2026-08      95
2    S2  motorbike  2026-08     388
3    S1  motorbike  2026-09     432 

tidy shape: (9, 4)
vehicle
bicycle       283
motorbike    2506
Name: orders, dtype: int64 

month  2026-08  2026-09  2026-10
store                           
S1         505      533      542
S2         388      401      420</div>
<p>Step by step: <code>melt</code> kept <code>store_vehicle</code> as an identifier and turned the three month headers into values of a new <code>month</code> column, with the numbers in <code>orders</code> — 3 rows × 3 months = 9 observations, shape (9, 4) after the split. <code>str.split("_", expand=True)</code> separated store and vehicle into two real columns. Now any question is one line: total orders per vehicle (bicycle 283, motorbike 2,506), per month, per store. When a human needs the report again, <code>pivot_table</code> rebuilds a wide view — here stores × months, summing both vehicles of S1 (505, 533, 542).</p>
<p><strong>Why tidy?</strong> pandas grouping, seaborn/matplotlib plotting by category, and scikit-learn (one row = one sample, one column = one feature) all assume it. Tidy is not always the final shape: a model's feature matrix is often wide on purpose (one column per feature), and reports are wide for reading. The point is to <em>know</em> which shape you have and to convert deliberately.</p>
<p><strong>The opposite direction.</strong> <code>pivot</code> (no aggregation; fails if an index/column pair repeats) and <code>pivot_table</code> (aggregates duplicates with <code>aggfunc</code>) go from long to wide. <code>stack</code>/<code>unstack</code> do the same with index levels.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Computing “growth” by subtracting month columns by hand instead of reshaping and grouping.</li><li>Using <code>pivot</code> when duplicates exist (“Index contains duplicate entries”) — use <code>pivot_table</code> with an explicit <code>aggfunc</code>.</li><li>Leaving the month as text such as “2026-08” when you need date arithmetic — convert with <code>pd.to_datetime</code> or <code>pd.Period</code>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Tidy = variables in columns, observations in rows, one unit per table.</li><li><code>melt</code>: wide → long; <code>pivot_table</code>: long → wide (with aggregation).</li><li><code>str.split(..., expand=True)</code> separates combined variables.</li><li>Analyse in tidy form, present in whatever form readers need.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.jstatsoft.org/article/view/v059i10" target="_blank" rel="noopener">Wickham (2014) — Tidy Data, Journal of Statistical Software</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/reshaping.html" target="_blank" rel="noopener">pandas User Guide — Reshaping and pivot tables</a></li><li><a href="https://wesmckinney.com/book/data-wrangling" target="_blank" rel="noopener">McKinney — Chapter 8: Data Wrangling: Join, Combine, and Reshape</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A table has columns <code>student, math_2025, math_2026, english_2025, english_2026</code>. Which tidy columns should it become?</li><li>Using the lesson's <code>long</code> table, write one line that gives total orders per month.</li><li>Why does <code>long.pivot(index="store", columns="month", values="orders")</code> fail while <code>pivot_table</code> works?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <code>student, subject, year, score</code> — melt the four columns, then split “math_2025” into subject and year. 2) <code>long.groupby("month")["orders"].sum()</code> (893, 934, 962). 3) Store S1 has two rows per month (motorbike and bicycle), so pivot does not know which single value to place; pivot_table sums them.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 3 · Bài 3.1</span>
<h2>Dữ liệu tidy: mỗi biến một cột, mỗi quan sát một dòng</h2>
<p class="lead">Dữ liệu đến với hình dạng nào tiện cho người tạo ra nó — thường là báo cáo để người đọc. Công cụ phân tích lại muốn một hình dạng chuẩn. Chuyển qua lại gọi là tổ chức lại (reshape), và hình dạng chuẩn gọi là <strong>tidy</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu ba nguyên tắc của dữ liệu tidy và nhận ra các vi phạm thường gặp.</li><li>Đổi bảng rộng sang dài bằng <code>melt</code> và ngược lại bằng <code>pivot_table</code>.</li><li>Tách một cột đang chứa hai biến.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Bài báo <em>Tidy Data</em> của Hadley Wickham (Journal of Statistical Software, 2014) đặt tên cho các nguyên tắc:</p>
<div class="formula"><span class="lbl">Dữ liệu tidy</span>1. Mỗi biến là một cột.  2. Mỗi quan sát là một dòng.  3. Mỗi loại đơn vị quan sát là một bảng.</div>
<p>Các vi phạm hay gặp nhất: <strong>tiêu đề cột là giá trị</strong> (mỗi tháng hay mỗi năm một cột), <strong>nhiều biến trong một cột</strong> (“S1_motorbike” trộn cửa hàng và loại xe), <strong>biến nằm theo dòng</strong>, và <strong>một bảng chứa hai loại đơn vị</strong> (đơn hàng và thông tin khách lặp lại trên mỗi đơn). Dưới đây, báo cáo của quản lý có tháng làm tiêu đề và hai biến dính trong một cột.</p>
<pre><code class="language-python">import pandas as pd

# "Wide" report as managers like it: one column per month (the month is hidden in the headers)
wide = pd.DataFrame({
    "store_vehicle": ["S1_motorbike", "S1_bicycle", "S2_motorbike"],
    "2026-08": [410, 95, 388],
    "2026-09": [432, 101, 401],
    "2026-10": [455, 87, 420],
})
print(wide, "\\n")

# 1) melt: month headers become values of a "month" column -&gt; one row per observation
long = wide.melt(id_vars="store_vehicle", var_name="month", value_name="orders")
# 2) one column held two variables: split it
long[["store", "vehicle"]] = long["store_vehicle"].str.split("_", expand=True)
long = long.drop(columns="store_vehicle")[["store", "vehicle", "month", "orders"]]
print(long.head(4), "\\n")
print("tidy shape:", long.shape)

# Tidy data makes questions one-liners
print(long.groupby("vehicle")["orders"].sum(), "\\n")
# ...and any wide view can be rebuilt on demand
print(long.pivot_table(index="store", columns="month", values="orders", aggfunc="sum"))</code></pre>
<div class="out">  store_vehicle  2026-08  2026-09  2026-10
0  S1_motorbike      410      432      455
1    S1_bicycle       95      101       87
2  S2_motorbike      388      401      420 

  store    vehicle    month  orders
0    S1  motorbike  2026-08     410
1    S1    bicycle  2026-08      95
2    S2  motorbike  2026-08     388
3    S1  motorbike  2026-09     432 

tidy shape: (9, 4)
vehicle
bicycle       283
motorbike    2506
Name: orders, dtype: int64 

month  2026-08  2026-09  2026-10
store                           
S1         505      533      542
S2         388      401      420</div>
<p>Từng bước: <code>melt</code> giữ <code>store_vehicle</code> làm định danh và biến ba tiêu đề tháng thành giá trị của cột mới <code>month</code>, số liệu nằm ở <code>orders</code> — 3 dòng × 3 tháng = 9 quan sát, shape (9, 4) sau khi tách. <code>str.split("_", expand=True)</code> tách cửa hàng và loại xe thành hai cột thật. Giờ mọi câu hỏi chỉ một dòng: tổng đơn theo loại xe (xe đạp 283, xe máy 2.506), theo tháng, theo cửa hàng. Khi người đọc cần lại báo cáo, <code>pivot_table</code> dựng lại dạng rộng — ở đây cửa hàng × tháng, cộng cả hai loại xe của S1 (505, 533, 542).</p>
<p><strong>Vì sao cần tidy?</strong> Gom nhóm của pandas, vẽ theo nhóm của seaborn/matplotlib, và scikit-learn (một dòng = một mẫu, một cột = một đặc trưng) đều giả định dạng này. Tidy không phải lúc nào cũng là hình dạng cuối: ma trận đặc trưng của mô hình thường cố ý ở dạng rộng (mỗi đặc trưng một cột), còn báo cáo thì rộng cho dễ đọc. Điều quan trọng là <em>biết</em> mình đang có dạng nào và chuyển đổi có chủ đích.</p>
<p><strong>Chiều ngược lại.</strong> <code>pivot</code> (không tổng hợp; lỗi nếu một cặp chỉ mục/cột bị lặp) và <code>pivot_table</code> (tổng hợp phần lặp bằng <code>aggfunc</code>) đi từ dài sang rộng. <code>stack</code>/<code>unstack</code> làm việc tương tự với các tầng chỉ mục.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tính “tăng trưởng” bằng cách trừ tay các cột tháng thay vì tổ chức lại rồi gom nhóm.</li><li>Dùng <code>pivot</code> khi có bản lặp (“Index contains duplicate entries”) — hãy dùng <code>pivot_table</code> với <code>aggfunc</code> rõ ràng.</li><li>Để tháng ở dạng chữ như “2026-08” khi cần tính toán ngày tháng — đổi bằng <code>pd.to_datetime</code> hoặc <code>pd.Period</code>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tidy = biến theo cột, quan sát theo dòng, mỗi bảng một loại đơn vị.</li><li><code>melt</code>: rộng → dài; <code>pivot_table</code>: dài → rộng (có tổng hợp).</li><li><code>str.split(..., expand=True)</code> tách các biến bị ghép.</li><li>Phân tích ở dạng tidy, trình bày ở dạng người đọc cần.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.jstatsoft.org/article/view/v059i10" target="_blank" rel="noopener">Wickham (2014) — Tidy Data, Journal of Statistical Software</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/reshaping.html" target="_blank" rel="noopener">pandas User Guide — Tổ chức lại dữ liệu và bảng pivot</a></li><li><a href="https://wesmckinney.com/book/data-wrangling" target="_blank" rel="noopener">McKinney — Chương 8: Ghép, kết hợp và tổ chức lại dữ liệu</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một bảng có các cột <code>student, math_2025, math_2026, english_2025, english_2026</code>. Nó nên thành các cột tidy nào?</li><li>Với bảng <code>long</code> trong bài, viết một dòng cho tổng đơn theo tháng.</li><li>Vì sao <code>long.pivot(index="store", columns="month", values="orders")</code> lỗi còn <code>pivot_table</code> chạy được?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <code>student, subject, year, score</code> — melt bốn cột, rồi tách “math_2025” thành môn và năm. 2) <code>long.groupby("month")["orders"].sum()</code> (893, 934, 962). 3) Cửa hàng S1 có hai dòng mỗi tháng (xe máy và xe đạp), nên pivot không biết đặt giá trị nào; pivot_table cộng chúng lại.</p></div>`);

const c32 = L('dsi201-ts-3-2',
  '3.2 — Types, duplicates and missing values|||3.2 — Kiểu dữ liệu, bản ghi trùng và giá trị thiếu',
  'Xoá bản ghi trùng, đổi chữ thành số bằng to_numeric(errors="coerce"), đo giá trị thiếu, ba cơ chế thiếu (MCAR/MAR/MNAR), điền trung vị và cột chỉ báo thiếu, vì sao điền làm co phương sai.',
  `<span class="eyebrow">DSI201 · Chapter 3 · Lesson 3.2</span>
<h2>Types, duplicates and missing values</h2>
<p class="lead">Cleaning is not cosmetic. Every choice — drop a row, fill a value, convert a type — changes the numbers you will report. Make each choice deliberately and write it down.</p>
<h3>🎯 Objectives</h3>
<ul><li>Find and remove duplicate records.</li><li>Convert messy text to numbers safely.</li><li>Measure missing data, reason about why it is missing, and impute with care (keeping an indicator).</li></ul>
<h3>📖 Lecture</h3>
<p>The toy order export below contains every classic problem: order 3 exported twice, prices stored as text (with a thousands comma and the word “unknown”), missing ratings and a missing district.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd

df = pd.DataFrame({
    "order_id": [1, 2, 3, 3, 4, 5, 6, 7],
    "price_k":  ["120", "85", "240", "240", "unknown", "1,050", "95", None],
    "rating":   [5, np.nan, 4, 4, 3, np.nan, np.nan, 5],
    "district": ["Ba Dinh", "Dong Da", "Cau Giay", "Cau Giay", "Ba Dinh", "Dong Da", "Ba Dinh", None],
})
print("dtypes before:", dict(df.dtypes.astype(str)))

# 1) exact duplicate rows (order 3 was exported twice)
print("duplicated rows:", df.duplicated().sum())
df = df.drop_duplicates()

# 2) text -&gt; numbers: strip thousands commas, unparseable values become NaN instead of crashing
df["price_k"] = pd.to_numeric(df["price_k"].str.replace(",", "", regex=False), errors="coerce")
print("price after to_numeric:", df["price_k"].tolist())

# 3) measure missingness before deciding anything
print(df.isna().sum().to_dict())

# 4) keep the information that a value was missing, then impute
df["rating_missing"] = df["rating"].isna().astype(int)
before_std = df["rating"].std()
df["rating_filled"] = df["rating"].fillna(df["rating"].median())
print(f"rating std before={before_std:.3f} after median fill={df['rating_filled'].std():.3f}")
df["district"] = df["district"].fillna("Unknown")
print(df)</code></pre>
<div class="out">dtypes before: {'order_id': 'int64', 'price_k': 'str', 'rating': 'float64', 'district': 'str'}
duplicated rows: 1
price after to_numeric: [120.0, 85.0, 240.0, nan, 1050.0, 95.0, nan]
{'order_id': 0, 'price_k': 2, 'rating': 3, 'district': 1}
rating std before=0.957 after median fill=0.690
   order_id  price_k  rating  district  rating_missing  rating_filled
0         1    120.0     5.0   Ba Dinh               0            5.0
1         2     85.0     NaN   Dong Da               1            4.5
2         3    240.0     4.0  Cau Giay               0            4.0
4         4      NaN     3.0   Ba Dinh               0            3.0
5         5   1050.0     NaN   Dong Da               1            4.5
6         6     95.0     NaN   Ba Dinh               1            4.5
7         7      NaN     5.0   Unknown               0            5.0</div>
<p><strong>1. Duplicates.</strong> <code>df.duplicated()</code> flags rows identical to an earlier row; one was found and removed. In real data, duplicates are often <em>partial</em> (same order ID, different timestamp): decide which column defines identity and use <code>drop_duplicates(subset=["order_id"], keep="last")</code>.</p>
<p><strong>2. Types.</strong> <code>price_k</code> was text (<code>str</code>), so <code>mean()</code> would fail or give nonsense. We removed the thousands comma and used <code>pd.to_numeric(..., errors="coerce")</code>: valid strings become numbers, invalid ones (“unknown”) become NaN instead of crashing the script. Always count how many values were coerced — a sudden jump means the format changed.</p>
<p><strong>3. Why is it missing?</strong> Statisticians distinguish three mechanisms. <strong>MCAR</strong> (missing completely at random): a sensor glitch unrelated to anything — dropping rows loses data but does not bias. <strong>MAR</strong> (missing at random given other columns): ratings are missing more often for night orders — fill using those columns. <strong>MNAR</strong> (missing not at random): unhappy customers skip the rating — the missingness itself carries information, and any simple fill is biased. You usually cannot prove which one holds, so think about the process that created the data.</p>
<p><strong>4. Imputation.</strong> Options: drop rows (fine if few and MCAR), fill with the median (robust to outliers) or the most frequent category, fill from a group (median per district), or use a model-based imputer (Chapter 5). Two warnings visible in the output: (a) filling 3 of 7 ratings with the median shrank the standard deviation from 0.957 to 0.690 — imputed data look more certain than they are; (b) we added <code>rating_missing</code>, an indicator column, so a model can still learn whether “no rating” predicts something. For text columns, an explicit “Unknown” category is more honest than the most common value.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Calling <code>dropna()</code> on the whole table and silently losing half the rows — count first.</li><li>Filling with the mean computed on all data before the train/test split (leakage — Lesson 6.3; pipelines fix it in Lesson 5.3).</li><li>Treating 0 or −1 as “missing” codes without converting them to NaN.</li><li>Forgetting that the fill reduces variance and hides MNAR patterns.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Remove exact duplicates; define identity for partial duplicates.</li><li><code>pd.to_numeric(errors="coerce")</code> converts text safely; count what failed.</li><li>Ask why values are missing (MCAR, MAR, MNAR) before choosing a fix.</li><li>Prefer median/“Unknown” fills plus a missing-indicator column; document every choice.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://pandas.pydata.org/docs/user_guide/missing_data.html" target="_blank" rel="noopener">pandas User Guide — Working with missing data</a></li><li><a href="https://wesmckinney.com/book/data-cleaning" target="_blank" rel="noopener">McKinney — Chapter 7: Data Cleaning and Preparation</a></li><li><a href="https://www.kaggle.com/learn/data-cleaning" target="_blank" rel="noopener">Kaggle Learn — Data Cleaning</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Hospital data: “blood test result” is missing mostly for patients the doctor judged healthy. Which mechanism is this, and why is median-filling risky?</li><li>Write code that fills missing ratings with the median rating of the same district.</li><li>After <code>to_numeric(errors="coerce")</code>, 40% of a price column is NaN, but before conversion only 2% was empty. What should you do?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Missing depends on an unobserved judgement about health — effectively MNAR (or MAR if the judgement is recorded). Filling with the median of tested (sicker) patients would make healthy patients look sick; an indicator column keeps the signal. 2) <code>df["rating"] = df["rating"].fillna(df.groupby("district")["rating"].transform("median"))</code>. 3) Stop and look at the failing strings (<code>df.loc[new.isna() &amp; old.notna(), "price"].unique()</code>) — probably a new format such as “1.250.000 đ”; fix the parsing rule instead of accepting NaN.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 3 · Bài 3.2</span>
<h2>Kiểu dữ liệu, bản ghi trùng và giá trị thiếu</h2>
<p class="lead">Làm sạch không phải trang điểm. Mỗi lựa chọn — bỏ một dòng, điền một giá trị, đổi một kiểu — đều làm đổi con số bạn sẽ báo cáo. Hãy chọn có chủ đích và ghi lại.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tìm và xoá bản ghi trùng.</li><li>Đổi chữ lộn xộn thành số một cách an toàn.</li><li>Đo dữ liệu thiếu, suy luận vì sao thiếu, và điền cẩn thận (giữ cột chỉ báo).</li></ul>
<h3>📖 Bài giảng</h3>
<p>Bảng đơn hàng nhỏ dưới đây chứa đủ mọi vấn đề kinh điển: đơn 3 bị xuất hai lần, giá lưu dạng chữ (có dấu phẩy hàng nghìn và chữ “unknown”), đánh giá bị thiếu và một quận bị thiếu.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd

df = pd.DataFrame({
    "order_id": [1, 2, 3, 3, 4, 5, 6, 7],
    "price_k":  ["120", "85", "240", "240", "unknown", "1,050", "95", None],
    "rating":   [5, np.nan, 4, 4, 3, np.nan, np.nan, 5],
    "district": ["Ba Dinh", "Dong Da", "Cau Giay", "Cau Giay", "Ba Dinh", "Dong Da", "Ba Dinh", None],
})
print("dtypes before:", dict(df.dtypes.astype(str)))

# 1) exact duplicate rows (order 3 was exported twice)
print("duplicated rows:", df.duplicated().sum())
df = df.drop_duplicates()

# 2) text -&gt; numbers: strip thousands commas, unparseable values become NaN instead of crashing
df["price_k"] = pd.to_numeric(df["price_k"].str.replace(",", "", regex=False), errors="coerce")
print("price after to_numeric:", df["price_k"].tolist())

# 3) measure missingness before deciding anything
print(df.isna().sum().to_dict())

# 4) keep the information that a value was missing, then impute
df["rating_missing"] = df["rating"].isna().astype(int)
before_std = df["rating"].std()
df["rating_filled"] = df["rating"].fillna(df["rating"].median())
print(f"rating std before={before_std:.3f} after median fill={df['rating_filled'].std():.3f}")
df["district"] = df["district"].fillna("Unknown")
print(df)</code></pre>
<div class="out">dtypes before: {'order_id': 'int64', 'price_k': 'str', 'rating': 'float64', 'district': 'str'}
duplicated rows: 1
price after to_numeric: [120.0, 85.0, 240.0, nan, 1050.0, 95.0, nan]
{'order_id': 0, 'price_k': 2, 'rating': 3, 'district': 1}
rating std before=0.957 after median fill=0.690
   order_id  price_k  rating  district  rating_missing  rating_filled
0         1    120.0     5.0   Ba Dinh               0            5.0
1         2     85.0     NaN   Dong Da               1            4.5
2         3    240.0     4.0  Cau Giay               0            4.0
4         4      NaN     3.0   Ba Dinh               0            3.0
5         5   1050.0     NaN   Dong Da               1            4.5
6         6     95.0     NaN   Ba Dinh               1            4.5
7         7      NaN     5.0   Unknown               0            5.0</div>
<p><strong>1. Bản ghi trùng.</strong> <code>df.duplicated()</code> đánh dấu dòng giống hệt một dòng trước đó; tìm thấy một dòng và đã xoá. Trong dữ liệu thật, bản trùng thường là <em>trùng một phần</em> (cùng mã đơn, khác thời điểm): hãy quyết định cột nào xác định danh tính và dùng <code>drop_duplicates(subset=["order_id"], keep="last")</code>.</p>
<p><strong>2. Kiểu dữ liệu.</strong> <code>price_k</code> là chữ (<code>str</code>), nên <code>mean()</code> sẽ lỗi hoặc ra vô nghĩa. Ta bỏ dấu phẩy hàng nghìn và dùng <code>pd.to_numeric(..., errors="coerce")</code>: chuỗi hợp lệ thành số, chuỗi không hợp lệ (“unknown”) thành NaN thay vì làm sập script. Luôn đếm bao nhiêu giá trị bị ép thành NaN — số này nhảy vọt nghĩa là định dạng đã đổi.</p>
<p><strong>3. Vì sao thiếu?</strong> Người làm thống kê phân biệt ba cơ chế. <strong>MCAR</strong> (thiếu hoàn toàn ngẫu nhiên): cảm biến trục trặc không liên quan gì — bỏ dòng thì mất dữ liệu nhưng không gây chệch. <strong>MAR</strong> (thiếu ngẫu nhiên khi biết các cột khác): đơn ban đêm hay thiếu đánh giá hơn — điền dựa vào các cột đó. <strong>MNAR</strong> (thiếu không ngẫu nhiên): khách không vui thì bỏ qua đánh giá — chính việc thiếu mang thông tin, và mọi cách điền đơn giản đều chệch. Thường bạn không chứng minh được cơ chế nào đúng, nên hãy nghĩ về quá trình sinh ra dữ liệu.</p>
<p><strong>4. Điền giá trị (imputation).</strong> Các lựa chọn: bỏ dòng (ổn nếu ít và MCAR), điền trung vị (bền với ngoại lai) hoặc nhóm phổ biến nhất, điền theo nhóm (trung vị theo quận), hoặc dùng bộ điền dựa trên mô hình (Chương 5). Hai cảnh báo thấy ngay trong output: (a) điền 3 trên 7 đánh giá bằng trung vị làm độ lệch chuẩn co từ 0,957 xuống 0,690 — dữ liệu đã điền trông chắc chắn hơn thực tế; (b) ta thêm <code>rating_missing</code>, một cột chỉ báo, để mô hình vẫn học được việc “không đánh giá” có dự báo điều gì không. Với cột chữ, một nhóm “Unknown” rõ ràng trung thực hơn điền giá trị phổ biến nhất.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Gọi <code>dropna()</code> trên cả bảng và âm thầm mất nửa số dòng — hãy đếm trước.</li><li>Điền bằng trung bình tính trên toàn bộ dữ liệu trước khi chia train/test (rò rỉ — Bài 6.3; pipeline giải quyết ở Bài 5.3).</li><li>Coi 0 hay −1 là mã “thiếu” mà không đổi sang NaN.</li><li>Quên rằng việc điền làm giảm phương sai và che mất mẫu hình MNAR.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Xoá bản trùng hoàn toàn; xác định danh tính cho bản trùng một phần.</li><li><code>pd.to_numeric(errors="coerce")</code> đổi chữ thành số an toàn; đếm phần bị lỗi.</li><li>Hỏi vì sao thiếu (MCAR, MAR, MNAR) trước khi chọn cách sửa.</li><li>Ưu tiên điền trung vị/“Unknown” kèm cột chỉ báo thiếu; ghi lại mọi lựa chọn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://pandas.pydata.org/docs/user_guide/missing_data.html" target="_blank" rel="noopener">pandas User Guide — Làm việc với dữ liệu thiếu</a></li><li><a href="https://wesmckinney.com/book/data-cleaning" target="_blank" rel="noopener">McKinney — Chương 7: Làm sạch và chuẩn bị dữ liệu</a></li><li><a href="https://www.kaggle.com/learn/data-cleaning" target="_blank" rel="noopener">Kaggle Learn — Data Cleaning</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Dữ liệu bệnh viện: “kết quả xét nghiệm máu” thiếu chủ yếu ở bệnh nhân bác sĩ đánh giá là khoẻ. Đây là cơ chế nào, và vì sao điền trung vị là rủi ro?</li><li>Viết code điền đánh giá thiếu bằng trung vị đánh giá của cùng quận.</li><li>Sau <code>to_numeric(errors="coerce")</code>, 40% cột giá thành NaN, trong khi trước khi đổi chỉ 2% để trống. Bạn nên làm gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Việc thiếu phụ thuộc một nhận định về sức khoẻ không được ghi — thực chất là MNAR (hoặc MAR nếu nhận định có được ghi). Điền trung vị của nhóm đã xét nghiệm (ốm hơn) sẽ làm người khoẻ trông như ốm; cột chỉ báo giữ được tín hiệu. 2) <code>df["rating"] = df["rating"].fillna(df.groupby("district")["rating"].transform("median"))</code>. 3) Dừng lại xem các chuỗi bị lỗi (<code>df.loc[new.isna() &amp; old.notna(), "price"].unique()</code>) — có lẽ một định dạng mới như “1.250.000 đ”; sửa quy tắc đọc thay vì chấp nhận NaN.</p></div>`);

const c33 = L('dsi201-ts-3-3',
  '3.3 — Strings, dates, outliers and safe merges|||3.3 — Chuỗi, ngày tháng, ngoại lai và ghép bảng an toàn',
  'Chuẩn hoá chuỗi (strip, gộp khoảng trắng, title), to_datetime có format và tách giờ/thứ, rào IQR so với luật nghiệp vụ, merge với validate và indicator để thấy dòng không khớp.',
  `<span class="eyebrow">DSI201 · Chapter 3 · Lesson 3.3</span>
<h2>Strings, dates, outliers and safe merges</h2>
<p class="lead">Four everyday cleaning jobs: make category labels consistent, turn date strings into real dates, decide what to do with extreme values, and join tables without losing or duplicating rows.</p>
<h3>🎯 Objectives</h3>
<ul><li>Normalise inconsistent text categories with the <code>.str</code> methods.</li><li>Parse dates with an explicit format and derive hour and weekday.</li><li>Separate impossible values from genuine extremes, and validate merges.</li></ul>
<h3>📖 Lecture</h3>
<pre><code class="language-python">import pandas as pd

orders = pd.DataFrame({
    "order_id": range(1, 9),
    "district": [" Cau Giay", "CAU GIAY", "cau giay ", "Dong Da", "dong  da", "Ba Dinh", "Ba Dinh", "Hoan Kiem"],
    "placed": ["2026-10-03 11:42", "2026-10-03 19:05", "2026-10-04 12:10", "2026-10-04 20:30",
               "2026-10-05 07:55", "2026-10-05 12:01", "2026-10-06 18:45", "2026-10-06 21:15"],
    "minutes": [31, 44, 28, 900, 36, -3, 39, 33],
})

# Strings: trim, collapse inner spaces, consistent case
orders["district"] = (orders["district"].str.strip()
                      .str.replace(r"\\s+", " ", regex=True).str.title())
print(orders["district"].value_counts().to_dict())

# Dates: parse with an explicit format, then derive parts
orders["placed"] = pd.to_datetime(orders["placed"], format="%Y-%m-%d %H:%M")
orders["hour"] = orders["placed"].dt.hour
orders["weekday"] = orders["placed"].dt.day_name()

# Outliers: rule of thumb (IQR fences) + domain rules (minutes must be in 1..240)
q1, q3 = orders["minutes"].quantile([0.25, 0.75])
lo, hi = q1 - 1.5 * (q3 - q1), q3 + 1.5 * (q3 - q1)
print(f"IQR fences: {lo:.1f} .. {hi:.1f}")
bad = ~orders["minutes"].between(1, 240)
print("impossible values:\\n", orders.loc[bad, ["order_id", "minutes"]])
orders.loc[bad, "minutes"] = pd.NA

# Merge with a lookup table; validate the relationship and look at what did not match
zones = pd.DataFrame({"district": ["Cau Giay", "Dong Da", "Ba Dinh"], "zone": ["West", "Centre", "Centre"]})
m = orders.merge(zones, on="district", how="left", validate="many_to_one", indicator=True)
print(m["_merge"].value_counts().to_dict())
print(m.loc[m["_merge"] == "left_only", ["order_id", "district"]])</code></pre>
<div class="out">{'Cau Giay': 3, 'Dong Da': 2, 'Ba Dinh': 2, 'Hoan Kiem': 1}
IQR fences: 15.2 .. 55.2
impossible values:
    order_id  minutes
3         4      900
5         6       -3
{'both': 7, 'left_only': 1, 'right_only': 0}
   order_id   district
7         8  Hoan Kiem</div>
<p><strong>Strings.</strong> Before cleaning, “ Cau Giay”, “CAU GIAY” and “cau giay ” would be three different districts and every group statistic would be split three ways. <code>str.strip()</code> removes outer spaces, a regular expression collapses repeated inner spaces, and <code>str.title()</code> unifies case — the counts become Cau Giay 3, Dong Da 2, Ba Dinh 2, Hoan Kiem 1. For Vietnamese with diacritics, also normalise Unicode (<code>unicodedata.normalize("NFC", s)</code>): the same letter can be stored as one code point or as a base letter plus a combining mark, and they look identical but do not compare equal.</p>
<p><strong>Dates.</strong> <code>pd.to_datetime(..., format="%Y-%m-%d %H:%M")</code> is faster and safer than guessing: a value that does not match raises an error instead of being silently misread. The <code>.dt</code> accessor then gives <code>hour</code>, <code>day_name()</code>, <code>month</code>, and differences between datetimes give durations — the raw material for features in Chapter 5. Store times in one time zone (for Vietnam, UTC+7) and say so.</p>
<p><strong>Outliers: impossible vs. unusual.</strong> The rule of thumb marks values outside Q1 − 1.5·IQR and Q3 + 1.5·IQR (here 15.2 to 55.2 minutes) as outliers. Use it to <em>find</em> candidates, not to delete automatically. Ask the domain: a delivery of 900 minutes or −3 minutes is <strong>impossible</strong> — a data error — so we set it to missing. A real 70-minute delivery in a rainstorm is <strong>unusual but true</strong>; deleting it would make the model blind to exactly the cases the business cares about. Options for true extremes: keep them, cap them (winsorise) for a fragile model, or use robust methods (median, MAE, tree models).</p>
<p><strong>Merges.</strong> <code>merge</code> is where rows silently disappear (inner join drops non-matches) or multiply (duplicate keys on the right). Two arguments protect you: <code>validate="many_to_one"</code> raises an error if the lookup table has duplicate keys, and <code>indicator=True</code> adds a <code>_merge</code> column showing which rows matched. Here 7 orders matched and 1 (Hoan Kiem) was <code>left_only</code> — the zone table was incomplete. Without the indicator you would only see a NaN zone and might never ask why.</p>
<div class="formula"><span class="lbl">Merge checklist</span>rows before = rows after (for a left lookup join) · validate= the expected relationship · indicator=True → inspect left_only / right_only</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Deleting every IQR outlier, including real events.</li><li>Grouping before normalising labels, so one category appears several times.</li><li>Inner joins that drop unmatched rows without anyone noticing.</li><li>Mixing time zones (server in UTC, app in local time) when computing durations.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Normalise text: strip, collapse spaces, unify case, normalise Unicode.</li><li>Parse dates with an explicit format; derive parts with <code>.dt</code>.</li><li>IQR finds candidates; domain rules decide impossible vs. real extremes.</li><li>Merge with <code>validate</code> and <code>indicator</code>; compare row counts.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://pandas.pydata.org/docs/user_guide/text.html" target="_blank" rel="noopener">pandas User Guide — Working with text data</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/merging.html" target="_blank" rel="noopener">pandas User Guide — Merge, join, concatenate and compare</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/timeseries.html" target="_blank" rel="noopener">pandas User Guide — Time series / date functionality</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute the IQR fences for minutes 20, 22, 25, 27, 30, 31, 33, 95 (use pandas' default quantiles). Is 95 an outlier? Should you delete it?</li><li>A left merge of 10,000 orders with a driver table returns 10,450 rows. What happened and how do you detect it in advance?</li><li>Write one line that computes delivery duration in minutes from two datetime columns <code>placed</code> and <code>delivered</code>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Q1 = 24.25, Q3 = 31.5, IQR = 7.25, fences 13.375 and 42.375 — so 95 is flagged. Do not delete automatically: check whether it is a data error or a real long delivery. 2) The driver table has duplicate driver IDs, so some orders matched twice; <code>validate="many_to_one"</code> raises an error before this happens. 3) <code>(df["delivered"] - df["placed"]).dt.total_seconds() / 60</code>.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 3 · Bài 3.3</span>
<h2>Chuỗi, ngày tháng, ngoại lai và ghép bảng an toàn</h2>
<p class="lead">Bốn việc làm sạch hằng ngày: thống nhất nhãn nhóm, biến chuỗi ngày thành ngày thật, quyết định làm gì với giá trị cực đoan, và ghép bảng mà không mất hay nhân bản dòng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chuẩn hoá nhãn chữ không nhất quán bằng các phương thức <code>.str</code>.</li><li>Đọc ngày với định dạng rõ ràng và tách giờ, thứ trong tuần.</li><li>Tách giá trị bất khả khỏi giá trị cực đoan thật, và kiểm tra phép ghép bảng.</li></ul>
<h3>📖 Bài giảng</h3>
<pre><code class="language-python">import pandas as pd

orders = pd.DataFrame({
    "order_id": range(1, 9),
    "district": [" Cau Giay", "CAU GIAY", "cau giay ", "Dong Da", "dong  da", "Ba Dinh", "Ba Dinh", "Hoan Kiem"],
    "placed": ["2026-10-03 11:42", "2026-10-03 19:05", "2026-10-04 12:10", "2026-10-04 20:30",
               "2026-10-05 07:55", "2026-10-05 12:01", "2026-10-06 18:45", "2026-10-06 21:15"],
    "minutes": [31, 44, 28, 900, 36, -3, 39, 33],
})

# Strings: trim, collapse inner spaces, consistent case
orders["district"] = (orders["district"].str.strip()
                      .str.replace(r"\\s+", " ", regex=True).str.title())
print(orders["district"].value_counts().to_dict())

# Dates: parse with an explicit format, then derive parts
orders["placed"] = pd.to_datetime(orders["placed"], format="%Y-%m-%d %H:%M")
orders["hour"] = orders["placed"].dt.hour
orders["weekday"] = orders["placed"].dt.day_name()

# Outliers: rule of thumb (IQR fences) + domain rules (minutes must be in 1..240)
q1, q3 = orders["minutes"].quantile([0.25, 0.75])
lo, hi = q1 - 1.5 * (q3 - q1), q3 + 1.5 * (q3 - q1)
print(f"IQR fences: {lo:.1f} .. {hi:.1f}")
bad = ~orders["minutes"].between(1, 240)
print("impossible values:\\n", orders.loc[bad, ["order_id", "minutes"]])
orders.loc[bad, "minutes"] = pd.NA

# Merge with a lookup table; validate the relationship and look at what did not match
zones = pd.DataFrame({"district": ["Cau Giay", "Dong Da", "Ba Dinh"], "zone": ["West", "Centre", "Centre"]})
m = orders.merge(zones, on="district", how="left", validate="many_to_one", indicator=True)
print(m["_merge"].value_counts().to_dict())
print(m.loc[m["_merge"] == "left_only", ["order_id", "district"]])</code></pre>
<div class="out">{'Cau Giay': 3, 'Dong Da': 2, 'Ba Dinh': 2, 'Hoan Kiem': 1}
IQR fences: 15.2 .. 55.2
impossible values:
    order_id  minutes
3         4      900
5         6       -3
{'both': 7, 'left_only': 1, 'right_only': 0}
   order_id   district
7         8  Hoan Kiem</div>
<p><strong>Chuỗi.</strong> Trước khi làm sạch, “ Cau Giay”, “CAU GIAY” và “cau giay ” là ba quận khác nhau và mọi thống kê theo nhóm sẽ bị chia ba. <code>str.strip()</code> bỏ khoảng trắng hai đầu, một biểu thức chính quy gộp các khoảng trắng lặp bên trong, và <code>str.title()</code> thống nhất chữ hoa — số đếm thành Cau Giay 3, Dong Da 2, Ba Dinh 2, Hoan Kiem 1. Với tiếng Việt có dấu, hãy chuẩn hoá cả Unicode (<code>unicodedata.normalize("NFC", s)</code>): cùng một chữ có thể lưu thành một mã hoặc thành chữ gốc cộng dấu kết hợp, trông giống hệt nhưng so sánh không bằng nhau.</p>
<p><strong>Ngày tháng.</strong> <code>pd.to_datetime(..., format="%Y-%m-%d %H:%M")</code> nhanh và an toàn hơn đoán: giá trị không khớp sẽ báo lỗi thay vì bị đọc sai âm thầm. Accessor <code>.dt</code> sau đó cho <code>hour</code>, <code>day_name()</code>, <code>month</code>, và hiệu hai thời điểm cho khoảng thời gian — nguyên liệu cho đặc trưng ở Chương 5. Lưu thời gian theo một múi giờ (với Việt Nam là UTC+7) và nói rõ.</p>
<p><strong>Ngoại lai: bất khả hay bất thường.</strong> Quy tắc kinh nghiệm đánh dấu giá trị ngoài Q1 − 1,5·IQR và Q3 + 1,5·IQR (ở đây 15,2 tới 55,2 phút) là ngoại lai. Dùng nó để <em>tìm</em> ứng viên, không để tự động xoá. Hỏi nghiệp vụ: chuyến giao 900 phút hay −3 phút là <strong>bất khả</strong> — lỗi dữ liệu — nên ta đặt thành thiếu. Một chuyến 70 phút thật dưới mưa bão là <strong>bất thường nhưng có thật</strong>; xoá nó làm mô hình mù đúng những trường hợp doanh nghiệp quan tâm. Lựa chọn cho cực trị thật: giữ, chặn trần (winsorise) cho mô hình nhạy cảm, hoặc dùng phương pháp bền (trung vị, MAE, mô hình cây).</p>
<p><strong>Ghép bảng.</strong> <code>merge</code> là nơi dòng âm thầm biến mất (inner join bỏ dòng không khớp) hoặc nhân lên (khoá lặp ở bảng phải). Hai tham số bảo vệ bạn: <code>validate="many_to_one"</code> báo lỗi nếu bảng tra cứu có khoá lặp, và <code>indicator=True</code> thêm cột <code>_merge</code> cho biết dòng nào khớp. Ở đây 7 đơn khớp và 1 đơn (Hoan Kiem) là <code>left_only</code> — bảng khu vực chưa đủ. Không có indicator, bạn chỉ thấy khu vực NaN và có thể không bao giờ hỏi vì sao.</p>
<div class="formula"><span class="lbl">Danh sách kiểm khi ghép</span>số dòng trước = số dòng sau (với left join tra cứu) · validate= đúng quan hệ mong đợi · indicator=True → xem left_only / right_only</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Xoá mọi ngoại lai theo IQR, kể cả sự kiện thật.</li><li>Gom nhóm trước khi chuẩn hoá nhãn, nên một nhóm xuất hiện nhiều lần.</li><li>Inner join bỏ dòng không khớp mà không ai để ý.</li><li>Trộn múi giờ (server UTC, ứng dụng giờ địa phương) khi tính khoảng thời gian.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chuẩn hoá chữ: bỏ khoảng trắng, gộp khoảng trắng, thống nhất hoa thường, chuẩn hoá Unicode.</li><li>Đọc ngày với định dạng rõ ràng; tách thành phần bằng <code>.dt</code>.</li><li>IQR tìm ứng viên; luật nghiệp vụ quyết định bất khả hay cực trị thật.</li><li>Ghép bảng với <code>validate</code> và <code>indicator</code>; so số dòng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://pandas.pydata.org/docs/user_guide/text.html" target="_blank" rel="noopener">pandas User Guide — Làm việc với dữ liệu chữ</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/merging.html" target="_blank" rel="noopener">pandas User Guide — Merge, join, concatenate và compare</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/timeseries.html" target="_blank" rel="noopener">pandas User Guide — Chuỗi thời gian / ngày tháng</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính rào IQR cho số phút 20, 22, 25, 27, 30, 31, 33, 95 (dùng phân vị mặc định của pandas). 95 có phải ngoại lai không? Có nên xoá không?</li><li>Left merge 10.000 đơn với bảng tài xế cho ra 10.450 dòng. Chuyện gì xảy ra và phát hiện trước bằng cách nào?</li><li>Viết một dòng tính thời gian giao theo phút từ hai cột datetime <code>placed</code> và <code>delivered</code>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Q1 = 24,25, Q3 = 31,5, IQR = 7,25, rào 13,375 và 42,375 — nên 95 bị đánh dấu. Đừng tự động xoá: kiểm xem đó là lỗi dữ liệu hay một chuyến giao dài thật. 2) Bảng tài xế có mã tài xế lặp, nên vài đơn khớp hai lần; <code>validate="many_to_one"</code> báo lỗi trước khi chuyện này xảy ra. 3) <code>(df["delivered"] - df["placed"]).dt.total_seconds() / 60</code>.</p></div>`);

const q3 = QZ(3, 'Quiz — Chapter 3: Cleaning and tidy data|||Quiz — Chương 3: Làm sạch và dữ liệu tidy',
  'Quiz 8 câu: nguyên tắc tidy, melt/pivot_table, bản trùng, to_numeric coerce, MCAR/MAR/MNAR, cột chỉ báo thiếu, ngoại lai IQR, merge validate/indicator.', [
  Q('q1', 'A table has one column per year (2024, 2025, 2026). Which tidy rule does it break?|||Một bảng có mỗi năm một cột (2024, 2025, 2026). Nó vi phạm nguyên tắc tidy nào?',
    ['Column headers are values, not variables|||Tiêu đề cột là giá trị, không phải biến', 'Each table holds one unit|||Mỗi bảng một loại đơn vị', 'Rows are observations|||Dòng là quan sát', 'None, it is tidy|||Không vi phạm, nó đã tidy'], 0,
    'Year is a variable and should be one column; melt fixes it.|||Năm là một biến và nên là một cột; melt sửa được.'),
  Q('q2', 'Which pandas function turns that wide table into long form?|||Hàm pandas nào đổi bảng rộng đó sang dạng dài?',
    ['melt|||melt', 'pivot|||pivot', 'merge|||merge', 'dropna|||dropna'], 0,
    'melt moves column headers into a variable column.|||melt chuyển tiêu đề cột thành một cột biến.'),
  Q('q3', 'What does pd.to_numeric(s, errors="coerce") do with "unknown"?|||pd.to_numeric(s, errors="coerce") làm gì với "unknown"?',
    ['Turns it into NaN|||Biến nó thành NaN', 'Raises an error|||Báo lỗi', 'Turns it into 0|||Biến nó thành 0', 'Keeps it as text|||Giữ nguyên dạng chữ'], 0,
    'Coerce converts invalid values to missing so you can count and inspect them.|||Coerce đổi giá trị không hợp lệ thành thiếu để bạn đếm và xem lại.'),
  Q('q4', 'Unhappy customers tend to skip the rating. This missingness is…|||Khách không vui hay bỏ qua đánh giá. Kiểu thiếu này là…',
    ['MNAR|||MNAR', 'MCAR|||MCAR', 'Not missing|||Không thiếu', 'A duplicate|||Bản ghi trùng'], 0,
    'Missingness depends on the unobserved value itself (satisfaction).|||Việc thiếu phụ thuộc chính giá trị không quan sát được (mức hài lòng).'),
  Q('q5', 'Why add a column like rating_missing before imputing?|||Vì sao thêm cột như rating_missing trước khi điền?',
    ['So the model can still learn from the fact that a value was missing|||Để mô hình vẫn học được từ việc giá trị bị thiếu', 'To make the table wider for fun|||Để bảng rộng hơn cho vui', 'Because pandas requires it|||Vì pandas bắt buộc', 'To delete the rows later|||Để xoá dòng sau'], 0,
    'Missingness can be informative, especially under MNAR.|||Việc thiếu có thể mang thông tin, nhất là khi MNAR.'),
  Q('q6', 'Filling 40% of a column with its median will usually make its standard deviation…|||Điền 40% một cột bằng trung vị thường làm độ lệch chuẩn của nó…',
    ['smaller|||nhỏ hơn', 'larger|||lớn hơn', 'unchanged|||không đổi', 'negative|||âm'], 0,
    'Many identical filled values pull the spread down (0.957 → 0.690 in the lesson).|||Nhiều giá trị điền giống nhau kéo độ phân tán xuống (0,957 → 0,690 trong bài).'),
  Q('q7', 'A delivery of −3 minutes is found. The best action is to…|||Phát hiện một chuyến giao −3 phút. Cách xử lý tốt nhất là…',
    ['treat it as a data error (set to missing) and investigate|||coi là lỗi dữ liệu (đặt thành thiếu) và điều tra', 'keep it as a real extreme|||giữ như một cực trị thật', 'replace it with 900|||thay bằng 900', 'delete the whole column|||xoá cả cột'], 0,
    'It is impossible by domain rules, unlike a rare but real long delivery.|||Theo luật nghiệp vụ nó bất khả, khác một chuyến giao dài hiếm nhưng có thật.'),
  Q('q8', 'What does merge(..., validate="many_to_one") protect against?|||merge(..., validate="many_to_one") bảo vệ khỏi điều gì?',
    ['Duplicate keys in the right table multiplying rows|||Khoá lặp ở bảng phải làm nhân bản dòng', 'Missing values in the left table|||Giá trị thiếu ở bảng trái', 'Wrong column order|||Sai thứ tự cột', 'Slow performance|||Chạy chậm'], 0,
    'It raises an error if the lookup side is not unique.|||Nó báo lỗi nếu phía tra cứu không duy nhất.'),
]);

const ch3 = {
  title: 'Chapter 3 — Cleaning and tidy data with pandas|||Chương 3 — Làm sạch và dữ liệu tidy với pandas',
  description: 'Dữ liệu tidy và tổ chức lại (melt, pivot_table), kiểu dữ liệu, bản trùng, giá trị thiếu (MCAR/MAR/MNAR, điền và cột chỉ báo), chuẩn hoá chuỗi, ngày tháng, ngoại lai, ghép bảng an toàn.',
  lessons: [c31, c32, c33, q3],
};


// ───────────────────────────── Chương 4 — EDA & trực quan hoá ─────────────────────────────
const c41 = L('dsi201-ts-4-1',
  '4.1 — Exploring one variable: centre, spread, shape and counts|||4.1 — Khám phá một biến: tâm, độ phân tán, hình dạng và tần số',
  'EDA một biến trên dữ liệu rao bán căn hộ Hà Nội (tổng hợp): describe, trung bình vs trung vị, độ lệch chuẩn, độ xiên 0,85, value_counts tỉ lệ, histogram dạng chữ; câu hỏi cần hỏi sau mỗi bảng.',
  `<span class="eyebrow">DSI201 · Chapter 4 · Lesson 4.1</span>
<h2>Exploring one variable: centre, spread, shape and counts</h2>
<p class="lead">Exploratory data analysis (EDA) is a conversation with the data: you ask, the data answer with a number or a chart, and the answer suggests the next question. It starts with one variable at a time.</p>
<h3>🎯 Objectives</h3>
<ul><li>Summarise a numeric variable by centre, spread and shape; a categorical one by counts and shares.</li><li>Choose mean or median according to skewness.</li><li>Read a histogram and turn summaries into questions.</li></ul>
<h3>📖 Lecture</h3>
<p>Our dataset for Chapters 4–5: 600 synthetic apartment listings in Hà Nội (district, area, bedrooms, building age, floor, price in billion VND). It is generated with a fixed seed so you can reproduce every number; the generator mimics common patterns (central districts cost more per m², older buildings less) but is <em>not</em> real market data.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd

def make_apartments(n=600, seed=4):
    """Synthetic Hà Nội apartment listings (prices in billion VND)."""
    rng = np.random.default_rng(seed)
    base = {"Tay Ho": 75, "Cau Giay": 65, "Dong Da": 60, "Long Bien": 48, "Ha Dong": 40}  # million VND / m2
    district = rng.choice(list(base), size=n, p=[0.12, 0.25, 0.2, 0.18, 0.25])
    area = np.clip(rng.gamma(9, 8.5, n), 30, 200).round()
    bedrooms = np.clip((area / 35).round() + rng.integers(-1, 2, n), 1, 5).astype(int)
    age = rng.integers(0, 31, n)
    floor = rng.integers(1, 36, n)
    ppm2 = np.array([base[d] for d in district]) * (1 - 0.008 * age) + 0.15 * floor + rng.normal(0, 6, n)
    price = (area * ppm2 / 1000).round(2)
    return pd.DataFrame({"district": district, "area_m2": area, "bedrooms": bedrooms,
                         "age_years": age, "floor": floor, "price_bn": price})

apt = make_apartments()
print(apt.shape)
print(apt.describe().round(2).T[["mean", "50%", "std", "min", "max"]])
print("skewness of price:", round(apt["price_bn"].skew(), 2))
print("share of listings by district:")
print(apt["district"].value_counts(normalize=True).round(3).to_dict())

# A text histogram: bin counts tell the shape of a distribution
counts, edges = np.histogram(apt["price_bn"], bins=8)
for c, a, b in zip(counts, edges[:-1], edges[1:]):
    print(f"{a:5.1f}-{b:5.1f} bn | {'#' * (c // 5)} {c}")</code></pre>
<div class="out">(600, 6)
            mean    50%    std    min     max
area_m2    76.15  72.50  25.11  30.00  193.00
bedrooms    2.21   2.00   1.00   1.00    5.00
age_years  14.67  14.00   9.13   0.00   30.00
floor      18.62  19.00  10.05   1.00   35.00
price_bn    3.88   3.69   1.57   0.91    9.65
skewness of price: 0.85
share of listings by district:
{'Ha Dong': 0.287, 'Cau Giay': 0.222, 'Dong Da': 0.2, 'Long Bien': 0.183, 'Tay Ho': 0.108}
  0.9-  2.0 bn | ########### 58
  2.0-  3.1 bn | ############################## 150
  3.1-  4.2 bn | ################################## 170
  4.2-  5.3 bn | ######################## 121
  5.3-  6.4 bn | ########## 51
  6.4-  7.5 bn | ###### 33
  7.5-  8.6 bn | ## 11
  8.6-  9.7 bn | # 6</div>
<p><strong>Centre.</strong> The mean price is 3.88 bn and the median 3.69 bn. The mean is pulled up by a few expensive listings (max 9.65 bn); the median, the middle value, is not. When the two differ noticeably, report the median as “typical” and say the distribution is skewed. (You met expectation and variance in IPY111; here they are estimated from data.)</p>
<p><strong>Spread.</strong> The standard deviation (1.57 bn) is the typical distance from the mean; the <strong>interquartile range</strong> (Q3 − Q1, the middle 50%) is the robust alternative. Always look at min and max for impossible values (an area of 0, a price of 0.001).</p>
<p><strong>Shape.</strong> The skewness of 0.85 and the text histogram agree: most listings sit between 2 and 5.3 bn, with a long right tail. Many money-like variables (prices, incomes, order values) look like this, which is why we will often model the <em>logarithm</em> of price (Lesson 5.2). Other shapes to recognise: symmetric bell, two peaks (bimodal — often two populations mixed together, e.g. studios and family flats), spikes at round numbers (people type 3.5 or 4.0), and a pile-up at a limit (values capped by a form).</p>
<p><strong>Categories.</strong> <code>value_counts(normalize=True)</code> shows shares: Ha Dong 28.7%, Tay Ho only 10.8%. Small groups produce noisy statistics — keep their size next to any group average you report.</p>
<div class="formula"><span class="lbl">One-variable checklist</span>numeric: count, missing, min/max, mean vs median, std and IQR, skew, histogram · categorical: number of levels, counts and shares, rare levels, spelling variants</div>
<p><strong>Turning numbers into questions.</strong> Why is Tay Ho rare in the data — fewer apartments, or did the scraper miss a site? Is the 30 m² minimum real or a filter? Are bins with round prices over-represented? Write such questions in your notebook; EDA is finished when the important ones are answered, not when every chart is drawn.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reporting the mean of a skewed variable as “typical”.</li><li>Trusting <code>describe()</code> without checking that dtypes are right (text columns are skipped silently).</li><li>Choosing a histogram bin count that hides a second peak — try several.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Describe numeric variables by centre, spread, shape; categorical ones by counts and shares.</li><li>Skewed data: prefer median and IQR; consider a log scale.</li><li>Histograms reveal skew, multiple peaks, spikes and caps.</li><li>Every summary should produce a question or a decision.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://jakevdp.github.io/PythonDataScienceHandbook/03.08-aggregation-and-grouping.html" target="_blank" rel="noopener">VanderPlas — Aggregation and Grouping</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/2-introduction" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — Chapter 2: Descriptive Statistics</a></li><li><a href="https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html" target="_blank" rel="noopener">pandas — DataFrame.describe reference</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Order values: mean 410k VND, median 180k VND. Sketch the shape and say which number to call “typical”.</li><li>Write code for the share of listings with 3 or more bedrooms.</li><li>A histogram of “age_years” shows a big spike at 0. Give two possible explanations.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Strongly right-skewed (a few huge orders); the median 180k is typical. 2) <code>(apt["bedrooms"] &gt;= 3).mean()</code>. 3) Many brand-new projects really are being sold, or missing ages were stored as 0 — check against the build year column or the source.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 4 · Bài 4.1</span>
<h2>Khám phá một biến: tâm, độ phân tán, hình dạng và tần số</h2>
<p class="lead">Phân tích khám phá dữ liệu (EDA) là một cuộc trò chuyện với dữ liệu: bạn hỏi, dữ liệu trả lời bằng một con số hay một biểu đồ, và câu trả lời gợi ra câu hỏi tiếp theo. Nó bắt đầu từ từng biến một.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tóm tắt biến số theo tâm, độ phân tán và hình dạng; biến phân loại theo số đếm và tỉ lệ.</li><li>Chọn trung bình hay trung vị theo độ xiên.</li><li>Đọc histogram và biến các con số tóm tắt thành câu hỏi.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Bộ dữ liệu cho Chương 4–5: 600 tin rao bán căn hộ ở Hà Nội được tổng hợp (quận, diện tích, số phòng ngủ, tuổi toà nhà, tầng, giá theo tỉ đồng). Nó được sinh với seed cố định để bạn tái tạo mọi con số; bộ sinh mô phỏng các mẫu hình thường gặp (quận trung tâm đắt hơn mỗi m², toà nhà cũ rẻ hơn) nhưng <em>không</em> phải dữ liệu thị trường thật.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd

def make_apartments(n=600, seed=4):
    """Synthetic Hà Nội apartment listings (prices in billion VND)."""
    rng = np.random.default_rng(seed)
    base = {"Tay Ho": 75, "Cau Giay": 65, "Dong Da": 60, "Long Bien": 48, "Ha Dong": 40}  # million VND / m2
    district = rng.choice(list(base), size=n, p=[0.12, 0.25, 0.2, 0.18, 0.25])
    area = np.clip(rng.gamma(9, 8.5, n), 30, 200).round()
    bedrooms = np.clip((area / 35).round() + rng.integers(-1, 2, n), 1, 5).astype(int)
    age = rng.integers(0, 31, n)
    floor = rng.integers(1, 36, n)
    ppm2 = np.array([base[d] for d in district]) * (1 - 0.008 * age) + 0.15 * floor + rng.normal(0, 6, n)
    price = (area * ppm2 / 1000).round(2)
    return pd.DataFrame({"district": district, "area_m2": area, "bedrooms": bedrooms,
                         "age_years": age, "floor": floor, "price_bn": price})

apt = make_apartments()
print(apt.shape)
print(apt.describe().round(2).T[["mean", "50%", "std", "min", "max"]])
print("skewness of price:", round(apt["price_bn"].skew(), 2))
print("share of listings by district:")
print(apt["district"].value_counts(normalize=True).round(3).to_dict())

# A text histogram: bin counts tell the shape of a distribution
counts, edges = np.histogram(apt["price_bn"], bins=8)
for c, a, b in zip(counts, edges[:-1], edges[1:]):
    print(f"{a:5.1f}-{b:5.1f} bn | {'#' * (c // 5)} {c}")</code></pre>
<div class="out">(600, 6)
            mean    50%    std    min     max
area_m2    76.15  72.50  25.11  30.00  193.00
bedrooms    2.21   2.00   1.00   1.00    5.00
age_years  14.67  14.00   9.13   0.00   30.00
floor      18.62  19.00  10.05   1.00   35.00
price_bn    3.88   3.69   1.57   0.91    9.65
skewness of price: 0.85
share of listings by district:
{'Ha Dong': 0.287, 'Cau Giay': 0.222, 'Dong Da': 0.2, 'Long Bien': 0.183, 'Tay Ho': 0.108}
  0.9-  2.0 bn | ########### 58
  2.0-  3.1 bn | ############################## 150
  3.1-  4.2 bn | ################################## 170
  4.2-  5.3 bn | ######################## 121
  5.3-  6.4 bn | ########## 51
  6.4-  7.5 bn | ###### 33
  7.5-  8.6 bn | ## 11
  8.6-  9.7 bn | # 6</div>
<p><strong>Tâm.</strong> Giá trung bình 3,88 tỉ, trung vị 3,69 tỉ. Trung bình bị vài căn đắt kéo lên (max 9,65 tỉ); trung vị, giá trị đứng giữa, thì không. Khi hai số chênh đáng kể, hãy báo trung vị là mức “điển hình” và nói phân phối bị xiên. (Kỳ vọng và phương sai bạn đã học ở IPY111; ở đây chúng được ước lượng từ dữ liệu.)</p>
<p><strong>Độ phân tán.</strong> Độ lệch chuẩn (1,57 tỉ) là khoảng cách điển hình tới trung bình; <strong>khoảng tứ phân vị</strong> (Q3 − Q1, 50% ở giữa) là lựa chọn bền vững hơn. Luôn nhìn min và max để tìm giá trị vô lý (diện tích 0, giá 0,001).</p>
<p><strong>Hình dạng.</strong> Độ xiên 0,85 và histogram dạng chữ khớp nhau: phần lớn tin nằm trong 2–5,3 tỉ, kèm một đuôi dài bên phải. Nhiều biến kiểu tiền (giá, thu nhập, giá trị đơn) trông như vậy, vì thế ta thường mô hình hoá <em>logarit</em> của giá (Bài 5.2). Các hình dạng khác cần nhận ra: chuông đối xứng, hai đỉnh (bimodal — thường là hai quần thể trộn lẫn, vd căn studio và căn gia đình), gai ở số tròn (người ta gõ 3,5 hay 4,0), và dồn đống ở một giới hạn (giá trị bị form chặn trần).</p>
<p><strong>Biến phân loại.</strong> <code>value_counts(normalize=True)</code> cho tỉ lệ: Hà Đông 28,7%, Tây Hồ chỉ 10,8%. Nhóm nhỏ cho thống kê nhiễu — luôn ghi cỡ nhóm cạnh mọi trung bình theo nhóm bạn báo cáo.</p>
<div class="formula"><span class="lbl">Danh sách kiểm một biến</span>biến số: số lượng, thiếu, min/max, trung bình vs trung vị, độ lệch chuẩn và IQR, độ xiên, histogram · biến phân loại: số mức, số đếm và tỉ lệ, mức hiếm, biến thể chính tả</div>
<p><strong>Biến con số thành câu hỏi.</strong> Vì sao Tây Hồ ít trong dữ liệu — ít căn hộ hơn, hay công cụ thu thập bỏ sót một trang? Mức tối thiểu 30 m² là thật hay do bộ lọc? Các khoảng giá tròn có bị dư thừa không? Ghi các câu hỏi đó vào notebook; EDA xong khi các câu quan trọng được trả lời, không phải khi đã vẽ mọi biểu đồ.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Báo trung bình của biến bị xiên như mức “điển hình”.</li><li>Tin <code>describe()</code> mà không kiểm dtype (cột chữ bị bỏ qua âm thầm).</li><li>Chọn số khoảng (bin) của histogram che mất đỉnh thứ hai — hãy thử vài số khác nhau.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mô tả biến số theo tâm, độ phân tán, hình dạng; biến phân loại theo số đếm và tỉ lệ.</li><li>Dữ liệu xiên: ưu tiên trung vị và IQR; cân nhắc thang log.</li><li>Histogram lộ ra độ xiên, nhiều đỉnh, gai và trần.</li><li>Mỗi con số tóm tắt nên sinh ra một câu hỏi hoặc một quyết định.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://jakevdp.github.io/PythonDataScienceHandbook/03.08-aggregation-and-grouping.html" target="_blank" rel="noopener">VanderPlas — Tổng hợp và gom nhóm</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/2-introduction" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — Chương 2: Thống kê mô tả</a></li><li><a href="https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html" target="_blank" rel="noopener">pandas — tài liệu DataFrame.describe</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Giá trị đơn hàng: trung bình 410 nghìn, trung vị 180 nghìn. Phác hình dạng và nói số nào nên gọi là “điển hình”.</li><li>Viết code tính tỉ lệ tin có từ 3 phòng ngủ trở lên.</li><li>Histogram của “age_years” có một gai lớn tại 0. Nêu hai cách giải thích.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Xiên phải mạnh (vài đơn rất lớn); trung vị 180 nghìn là điển hình. 2) <code>(apt["bedrooms"] &gt;= 3).mean()</code>. 3) Nhiều dự án mới thật sự đang mở bán, hoặc tuổi bị thiếu đã được lưu thành 0 — đối chiếu với cột năm xây dựng hoặc nguồn dữ liệu.</p></div>`);

const c42 = L('dsi201-ts-4-2',
  '4.2 — Relationships: group comparisons, correlation and Simpson’s paradox|||4.2 — Quan hệ giữa các biến: so sánh nhóm, tương quan và nghịch lý Simpson',
  'groupby().agg với cỡ nhóm, giá/m² theo quận, tương quan Pearson và Spearman, nghịch lý Simpson: xe đạp “nhanh hơn” tổng thể nhưng chậm hơn trong từng cự ly.',
  `<span class="eyebrow">DSI201 · Chapter 4 · Lesson 4.2</span>
<h2>Relationships: group comparisons, correlation and Simpson’s paradox</h2>
<p class="lead">Most interesting questions are about two or more variables: does price depend on district? on age? Group summaries and correlations answer quickly — and can mislead just as quickly.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compare groups with <code>groupby().agg()</code>, always showing group size.</li><li>Use Pearson and Spearman correlation and know their limits.</li><li>Recognise a confounder and Simpson's paradox.</li></ul>
<h3>📖 Lecture</h3>
<pre><code class="language-python">import numpy as np
import pandas as pd

# Part A: group comparisons on apartment listings (same generator as Lesson 4.1)
def make_apartments(n=600, seed=4):
    """Synthetic Hà Nội apartment listings (prices in billion VND)."""
    rng = np.random.default_rng(seed)
    base = {"Tay Ho": 75, "Cau Giay": 65, "Dong Da": 60, "Long Bien": 48, "Ha Dong": 40}  # million VND / m2
    district = rng.choice(list(base), size=n, p=[0.12, 0.25, 0.2, 0.18, 0.25])
    area = np.clip(rng.gamma(9, 8.5, n), 30, 200).round()
    bedrooms = np.clip((area / 35).round() + rng.integers(-1, 2, n), 1, 5).astype(int)
    age = rng.integers(0, 31, n)
    floor = rng.integers(1, 36, n)
    ppm2 = np.array([base[d] for d in district]) * (1 - 0.008 * age) + 0.15 * floor + rng.normal(0, 6, n)
    price = (area * ppm2 / 1000).round(2)
    return pd.DataFrame({"district": district, "area_m2": area, "bedrooms": bedrooms,
                         "age_years": age, "floor": floor, "price_bn": price})

apt = make_apartments()
apt["ppm2_mil"] = (apt["price_bn"] * 1000 / apt["area_m2"]).round(1)   # million VND per m2
summary = apt.groupby("district").agg(n=("price_bn", "size"),
                                      median_price=("price_bn", "median"),
                                      median_ppm2=("ppm2_mil", "median")).sort_values("median_ppm2", ascending=False)
print(summary)
print(apt[["area_m2", "bedrooms", "age_years", "floor", "price_bn"]].corr(method="pearson")["price_bn"].round(2).to_dict())
print("Spearman age vs ppm2:", round(apt["age_years"].corr(apt["ppm2_mil"], method="spearman"), 2))

# Part B: Simpson's paradox in delivery data
rng = np.random.default_rng(42)
rows = []
for vehicle, n_short, n_long, base in [("bicycle", 450, 50, 4), ("motorbike", 150, 350, 0)]:
    for dist, n in [("short", n_short), ("long", n_long)]:
        mean = (22 if dist == "short" else 45) + base
        rows.append(pd.DataFrame({"vehicle": vehicle, "distance": dist, "minutes": rng.normal(mean, 4, n)}))
d = pd.concat(rows, ignore_index=True)
print("\\noverall mean minutes:", d.groupby("vehicle")["minutes"].mean().round(1).to_dict())
print(d.pivot_table(index="distance", columns="vehicle", values="minutes", aggfunc="mean").round(1))</code></pre>
<div class="out">             n  median_price  median_ppm2
district                                 
Tay Ho      65         5.070        67.80
Cau Giay   133         4.300        58.90
Dong Da    120         3.770        55.75
Long Bien  110         3.495        45.35
Ha Dong    172         2.850        38.05
{'area_m2': 0.78, 'bedrooms': 0.47, 'age_years': -0.24, 'floor': 0.03, 'price_bn': 1.0}
Spearman age vs ppm2: -0.33

overall mean minutes: {'bicycle': 28.2, 'motorbike': 37.9}
vehicle   bicycle  motorbike
distance                    
long         49.1       44.9
short        25.9       21.6</div>
<p><strong>Group comparison (Part A).</strong> Named aggregation (<code>n=("price_bn", "size")</code>) gives a readable table: Tay Ho has the highest median price per m² (67.8 million VND) but only 65 listings; Ha Dong the lowest (38.05) with 172. Comparing <em>price per m²</em> rather than price removes the effect of size, a first taste of feature engineering. Report medians with group sizes; for small groups, add an interval (the bootstrap from PSI221 works well).</p>
<p><strong>Correlation.</strong> Pearson's r measures <em>linear</em> association between −1 and 1: area–price 0.78 (strong), bedrooms 0.47 (bedrooms follow area), age −0.24, floor 0.03 (almost nothing). Spearman's ρ correlates <em>ranks</em>, so it captures any monotonic trend and resists outliers; age vs price per m² gives −0.33. Three limits to remember: r ≈ 0 does not mean “no relationship” (a U-shape gives r ≈ 0); one outlier can create or destroy r; and correlation is not causation.</p>
<p><strong>Simpson's paradox (Part B).</strong> Overall, bicycle deliveries average 28.2 minutes and motorbikes 37.9 — bicycles look 10 minutes faster. But split by distance, motorbikes are faster in <em>both</em> groups (21.6 vs 25.9 short, 44.9 vs 49.1 long). The reversal happens because distance is a <strong>confounder</strong>: bicycles mostly get short trips (450 of 500), motorbikes mostly long ones (350 of 500). The overall average compares trip mixes, not vehicles. Whenever a group comparison will drive a decision, ask “what else differs between these groups?” and compare within strata of that variable.</p>
<div class="formula"><span class="lbl">Pearson correlation</span>r = ∑(x<sub>i</sub> − x̄)(y<sub>i</sub> − ȳ) / √(∑(x<sub>i</sub> − x̄)<sup>2</sup> · ∑(y<sub>i</sub> − ȳ)<sup>2</sup>)      Spearman ρ = Pearson r computed on ranks</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Ranking groups by averages computed on 3 or 4 rows.</li><li>Concluding “no relationship” from r ≈ 0 without a scatter plot.</li><li>Comparing raw totals between groups of different composition (Simpson).</li><li>Reading a correlation matrix with 50 variables and believing every 0.2 is real — with many pairs, some are large by chance (PSI221, multiple testing).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li><code>groupby().agg()</code> with named outputs; always include counts.</li><li>Pearson: linear; Spearman: monotonic and robust.</li><li>Look for confounders; stratify before concluding.</li><li>Correlation describes, it does not prove cause.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://pandas.pydata.org/docs/user_guide/groupby.html" target="_blank" rel="noopener">pandas User Guide — Group by: split-apply-combine</a></li><li><a href="https://plato.stanford.edu/entries/paradox-simpson/" target="_blank" rel="noopener">Stanford Encyclopedia of Philosophy — Simpson’s Paradox</a></li><li><a href="https://wesmckinney.com/book/data-aggregation" target="_blank" rel="noopener">McKinney — Chapter 10: Data Aggregation and Group Operations</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Add a column for the 25th and 75th percentile of price per m² to the district table (hint: <code>("ppm2_mil", lambda s: s.quantile(0.25))</code>).</li><li>x = −3, −2, −1, 0, 1, 2, 3 and y = x<sup>2</sup>. What is Pearson's r? What does that teach?</li><li>University A admits a higher share of all applicants than B, yet B admits a higher share in every faculty. Explain how.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <code>apt.groupby("district").agg(q25=("ppm2_mil", lambda s: s.quantile(0.25)), q75=("ppm2_mil", lambda s: s.quantile(0.75)))</code>. 2) r = 0 exactly (the positive and negative halves cancel) although y is a perfect function of x — always plot. 3) Applicants to A mostly apply to easy faculties, applicants to B to hard ones; faculty is the confounder, as in Simpson's paradox.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 4 · Bài 4.2</span>
<h2>Quan hệ giữa các biến: so sánh nhóm, tương quan và nghịch lý Simpson</h2>
<p class="lead">Phần lớn câu hỏi thú vị là về hai biến trở lên: giá có phụ thuộc quận không? tuổi toà nhà? Thống kê theo nhóm và tương quan trả lời nhanh — và cũng đánh lừa nhanh không kém.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>So sánh các nhóm bằng <code>groupby().agg()</code>, luôn kèm cỡ nhóm.</li><li>Dùng tương quan Pearson và Spearman, biết giới hạn của chúng.</li><li>Nhận ra biến gây nhiễu và nghịch lý Simpson.</li></ul>
<h3>📖 Bài giảng</h3>
<pre><code class="language-python">import numpy as np
import pandas as pd

# Part A: group comparisons on apartment listings (same generator as Lesson 4.1)
def make_apartments(n=600, seed=4):
    """Synthetic Hà Nội apartment listings (prices in billion VND)."""
    rng = np.random.default_rng(seed)
    base = {"Tay Ho": 75, "Cau Giay": 65, "Dong Da": 60, "Long Bien": 48, "Ha Dong": 40}  # million VND / m2
    district = rng.choice(list(base), size=n, p=[0.12, 0.25, 0.2, 0.18, 0.25])
    area = np.clip(rng.gamma(9, 8.5, n), 30, 200).round()
    bedrooms = np.clip((area / 35).round() + rng.integers(-1, 2, n), 1, 5).astype(int)
    age = rng.integers(0, 31, n)
    floor = rng.integers(1, 36, n)
    ppm2 = np.array([base[d] for d in district]) * (1 - 0.008 * age) + 0.15 * floor + rng.normal(0, 6, n)
    price = (area * ppm2 / 1000).round(2)
    return pd.DataFrame({"district": district, "area_m2": area, "bedrooms": bedrooms,
                         "age_years": age, "floor": floor, "price_bn": price})

apt = make_apartments()
apt["ppm2_mil"] = (apt["price_bn"] * 1000 / apt["area_m2"]).round(1)   # million VND per m2
summary = apt.groupby("district").agg(n=("price_bn", "size"),
                                      median_price=("price_bn", "median"),
                                      median_ppm2=("ppm2_mil", "median")).sort_values("median_ppm2", ascending=False)
print(summary)
print(apt[["area_m2", "bedrooms", "age_years", "floor", "price_bn"]].corr(method="pearson")["price_bn"].round(2).to_dict())
print("Spearman age vs ppm2:", round(apt["age_years"].corr(apt["ppm2_mil"], method="spearman"), 2))

# Part B: Simpson's paradox in delivery data
rng = np.random.default_rng(42)
rows = []
for vehicle, n_short, n_long, base in [("bicycle", 450, 50, 4), ("motorbike", 150, 350, 0)]:
    for dist, n in [("short", n_short), ("long", n_long)]:
        mean = (22 if dist == "short" else 45) + base
        rows.append(pd.DataFrame({"vehicle": vehicle, "distance": dist, "minutes": rng.normal(mean, 4, n)}))
d = pd.concat(rows, ignore_index=True)
print("\\noverall mean minutes:", d.groupby("vehicle")["minutes"].mean().round(1).to_dict())
print(d.pivot_table(index="distance", columns="vehicle", values="minutes", aggfunc="mean").round(1))</code></pre>
<div class="out">             n  median_price  median_ppm2
district                                 
Tay Ho      65         5.070        67.80
Cau Giay   133         4.300        58.90
Dong Da    120         3.770        55.75
Long Bien  110         3.495        45.35
Ha Dong    172         2.850        38.05
{'area_m2': 0.78, 'bedrooms': 0.47, 'age_years': -0.24, 'floor': 0.03, 'price_bn': 1.0}
Spearman age vs ppm2: -0.33

overall mean minutes: {'bicycle': 28.2, 'motorbike': 37.9}
vehicle   bicycle  motorbike
distance                    
long         49.1       44.9
short        25.9       21.6</div>
<p><strong>So sánh nhóm (Phần A).</strong> Tổng hợp có đặt tên (<code>n=("price_bn", "size")</code>) cho bảng dễ đọc: Tây Hồ có trung vị giá/m² cao nhất (67,8 triệu đồng) nhưng chỉ 65 tin; Hà Đông thấp nhất (38,05) với 172 tin. So <em>giá mỗi m²</em> thay vì giá giúp loại bỏ ảnh hưởng của diện tích, bước đầu tiên của feature engineering. Báo trung vị kèm cỡ nhóm; với nhóm nhỏ, thêm khoảng tin cậy (bootstrap ở PSI221 dùng rất tốt).</p>
<p><strong>Tương quan.</strong> Hệ số Pearson r đo liên hệ <em>tuyến tính</em> trong khoảng −1 tới 1: diện tích–giá 0,78 (mạnh), phòng ngủ 0,47 (phòng ngủ đi theo diện tích), tuổi −0,24, tầng 0,03 (gần như không). Spearman ρ tính tương quan trên <em>thứ hạng</em>, nên bắt được mọi xu hướng đơn điệu và bền với ngoại lai; tuổi với giá/m² cho −0,33. Ba giới hạn cần nhớ: r ≈ 0 không có nghĩa “không liên quan” (hình chữ U cho r ≈ 0); một ngoại lai có thể tạo ra hoặc xoá đi r; và tương quan không phải nhân quả.</p>
<p><strong>Nghịch lý Simpson (Phần B).</strong> Tính chung, chuyến xe đạp trung bình 28,2 phút còn xe máy 37,9 — xe đạp trông nhanh hơn 10 phút. Nhưng tách theo cự ly, xe máy nhanh hơn ở <em>cả hai</em> nhóm (21,6 so với 25,9 khi gần, 44,9 so với 49,1 khi xa). Sự đảo chiều xảy ra vì cự ly là <strong>biến gây nhiễu</strong> (confounder): xe đạp chủ yếu nhận chuyến gần (450 trên 500), xe máy chủ yếu chuyến xa (350 trên 500). Trung bình chung đang so cơ cấu chuyến, không so phương tiện. Mỗi khi một phép so sánh nhóm dẫn tới quyết định, hãy hỏi “còn gì khác nhau giữa các nhóm này?” và so trong từng tầng của biến đó.</p>
<div class="formula"><span class="lbl">Tương quan Pearson</span>r = ∑(x<sub>i</sub> − x̄)(y<sub>i</sub> − ȳ) / √(∑(x<sub>i</sub> − x̄)<sup>2</sup> · ∑(y<sub>i</sub> − ȳ)<sup>2</sup>)      Spearman ρ = Pearson r tính trên thứ hạng</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Xếp hạng các nhóm theo trung bình tính trên 3–4 dòng.</li><li>Kết luận “không liên quan” từ r ≈ 0 mà không vẽ biểu đồ phân tán.</li><li>So tổng thô giữa các nhóm có cơ cấu khác nhau (Simpson).</li><li>Đọc ma trận tương quan 50 biến và tin mọi giá trị 0,2 là thật — với nhiều cặp, vài cặp lớn do ngẫu nhiên (PSI221, kiểm định bội).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li><code>groupby().agg()</code> với tên đầu ra; luôn kèm số đếm.</li><li>Pearson: tuyến tính; Spearman: đơn điệu và bền vững.</li><li>Tìm biến gây nhiễu; phân tầng trước khi kết luận.</li><li>Tương quan mô tả, không chứng minh nguyên nhân.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://pandas.pydata.org/docs/user_guide/groupby.html" target="_blank" rel="noopener">pandas User Guide — Group by: chia-áp dụng-kết hợp</a></li><li><a href="https://plato.stanford.edu/entries/paradox-simpson/" target="_blank" rel="noopener">Stanford Encyclopedia of Philosophy — Nghịch lý Simpson</a></li><li><a href="https://wesmckinney.com/book/data-aggregation" target="_blank" rel="noopener">McKinney — Chương 10: Tổng hợp dữ liệu và thao tác theo nhóm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Thêm cột phân vị 25 và 75 của giá/m² vào bảng theo quận (gợi ý: <code>("ppm2_mil", lambda s: s.quantile(0.25))</code>).</li><li>x = −3, −2, −1, 0, 1, 2, 3 và y = x<sup>2</sup>. Pearson r bằng bao nhiêu? Điều đó dạy ta gì?</li><li>Trường A nhận tỉ lệ hồ sơ chung cao hơn trường B, nhưng B nhận tỉ lệ cao hơn ở mọi khoa. Giải thích vì sao có thể như vậy.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <code>apt.groupby("district").agg(q25=("ppm2_mil", lambda s: s.quantile(0.25)), q75=("ppm2_mil", lambda s: s.quantile(0.75)))</code>. 2) r = 0 tuyệt đối (nửa dương và nửa âm triệt tiêu) dù y là hàm hoàn hảo của x — luôn vẽ hình. 3) Thí sinh vào A chủ yếu nộp khoa dễ, thí sinh vào B nộp khoa khó; khoa là biến gây nhiễu, đúng như nghịch lý Simpson.</p></div>`);

const c43 = L('dsi201-ts-4-3',
  '4.3 — Visualisation with matplotlib: choosing and building honest charts|||4.3 — Trực quan hoá với matplotlib: chọn và dựng biểu đồ trung thực',
  'Giao diện hướng đối tượng fig/ax, lưới 2×2 (histogram, boxplot theo nhóm, scatter, cột ngang đã sắp), chọn loại biểu đồ theo câu hỏi, quy tắc trung thực (trục từ 0 cho cột, đơn vị, sắp thứ tự).',
  `<span class="eyebrow">DSI201 · Chapter 4 · Lesson 4.3</span>
<h2>Visualisation with matplotlib: choosing and building honest charts</h2>
<p class="lead">A good chart answers one question at a glance. Exploration needs many quick charts for yourself; communication needs a few careful charts for others (Lesson 12.1).</p>
<h3>🎯 Objectives</h3>
<ul><li>Use matplotlib's object-oriented interface (<code>fig, ax</code>) to build multi-panel figures.</li><li>Choose the chart type from the question being asked.</li><li>Apply rules that keep charts honest and readable.</li></ul>
<h3>📖 Lecture</h3>
<p>matplotlib has two styles. The quick <code>plt.plot(...)</code> style draws on a hidden “current” axes; the <strong>object-oriented</strong> style creates a figure and named axes, then calls methods on each axes. Use the second for anything with more than one panel — it is explicit and easy to adjust. (seaborn and pandas' <code>.plot()</code> are convenient layers on top of matplotlib.)</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

def make_apartments(n=600, seed=4):
    """Synthetic Hà Nội apartment listings (prices in billion VND)."""
    rng = np.random.default_rng(seed)
    base = {"Tay Ho": 75, "Cau Giay": 65, "Dong Da": 60, "Long Bien": 48, "Ha Dong": 40}  # million VND / m2
    district = rng.choice(list(base), size=n, p=[0.12, 0.25, 0.2, 0.18, 0.25])
    area = np.clip(rng.gamma(9, 8.5, n), 30, 200).round()
    bedrooms = np.clip((area / 35).round() + rng.integers(-1, 2, n), 1, 5).astype(int)
    age = rng.integers(0, 31, n)
    floor = rng.integers(1, 36, n)
    ppm2 = np.array([base[d] for d in district]) * (1 - 0.008 * age) + 0.15 * floor + rng.normal(0, 6, n)
    price = (area * ppm2 / 1000).round(2)
    return pd.DataFrame({"district": district, "area_m2": area, "bedrooms": bedrooms,
                         "age_years": age, "floor": floor, "price_bn": price})

apt = make_apartments()
apt["ppm2_mil"] = apt["price_bn"] * 1000 / apt["area_m2"]
order = apt.groupby("district")["ppm2_mil"].median().sort_values().index

fig, axes = plt.subplots(2, 2, figsize=(11, 8), constrained_layout=True)
ax = axes[0, 0]
ax.hist(apt["price_bn"], bins=30, color="tab:blue")
ax.set(title="Price distribution (right-skewed)", xlabel="Price (billion VND)", ylabel="Listings")

ax = axes[0, 1]
ax.boxplot([apt.loc[apt["district"] == d, "ppm2_mil"] for d in order], tick_labels=list(order))
ax.set(title="Price per m2 by district", ylabel="Million VND / m2")

ax = axes[1, 0]
ax.scatter(apt["area_m2"], apt["price_bn"], s=8, alpha=0.4)
ax.set(title="Area vs price", xlabel="Area (m2)", ylabel="Price (billion VND)")

ax = axes[1, 1]
med = apt.groupby("district")["ppm2_mil"].median().loc[order]
ax.barh(med.index, med.values, color="tab:gray")
ax.set(title="Median price per m2 (sorted)", xlabel="Million VND / m2")

fig.savefig("eda_apartments.png", dpi=120)
print("saved eda_apartments.png with panels:", [a.get_title() for a in axes.ravel()])
print("median ppm2 by district:", med.round(1).to_dict())</code></pre>
<div class="out">saved eda_apartments.png with panels: ['Price distribution (right-skewed)', 'Price per m2 by district', 'Area vs price', 'Median price per m2 (sorted)']
median ppm2 by district: {'Ha Dong': 38.1, 'Long Bien': 45.4, 'Dong Da': 55.8, 'Cau Giay': 58.9, 'Tay Ho': 67.8}</div>
<p>The figure answers four questions at once. <strong>How is price distributed?</strong> → histogram (one numeric variable). <strong>How does price per m² differ by district, including spread?</strong> → box plots, one per group, ordered by median. <strong>How do two numeric variables relate?</strong> → scatter plot; with many points use small markers and transparency (<code>alpha</code>) to show density. <strong>Which group is highest?</strong> → horizontal bars sorted by value — horizontal so long labels stay readable. The printed medians (Ha Dong 38.1 → Tay Ho 67.8) are what the bar chart shows; keep the numbers for your text.</p>
<div class="formula"><span class="lbl">Question → chart</span>distribution: histogram, box plot · comparison across groups: sorted bars, box/strip plots · relationship: scatter (+ trend line) · change over time: line chart · composition: stacked bars (avoid pies with many slices)</div>
<p><strong>Honesty and clarity rules.</strong></p>
<ul>
<li>Bar charts start at zero — bar length encodes value, so a cut axis exaggerates differences. Line and scatter charts may zoom.</li>
<li>Label axes with units (“Million VND / m2”) and give the title the <em>finding</em> when presenting (“Tay Ho costs 1.8× Ha Dong per m²”).</li>
<li>Sort categories by value unless they have a natural order (months, ratings).</li>
<li>Use colour to highlight, not decorate; keep it readable for colour-blind viewers and in greyscale.</li>
<li>Show the data's uncertainty when comparing small groups (error bars, all points).</li>
</ul>
<p>In a notebook, charts appear inline; in scripts, <code>fig.savefig("name.png", dpi=120)</code> writes a file you can put in a report. Set the size once (<code>figsize</code>) and use <code>constrained_layout=True</code> to avoid overlapping labels.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Bar charts with a y-axis starting at 50% to make a 2-point difference look huge.</li><li>Unsorted categories, rainbow colours and 3D effects that hide the comparison.</li><li>Scatter plots of 100,000 opaque points that look like a solid blob — use alpha, smaller markers or a hexbin plot.</li><li>Dual y-axes that let you suggest any relationship you want.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Use <code>fig, axes = plt.subplots(...)</code> and call methods on each <code>ax</code>.</li><li>Pick the chart from the question: distribution, comparison, relationship, trend, composition.</li><li>Bars start at zero; label units; sort categories; highlight with colour sparingly.</li><li>Save figures with <code>savefig</code> for reports.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://matplotlib.org/stable/users/explain/quick_start.html" target="_blank" rel="noopener">matplotlib — Quick start guide</a></li><li><a href="https://jakevdp.github.io/PythonDataScienceHandbook/04.00-introduction-to-matplotlib.html" target="_blank" rel="noopener">VanderPlas — Visualization with Matplotlib</a></li><li><a href="https://clauswilke.com/dataviz/" target="_blank" rel="noopener">Claus O. Wilke — Fundamentals of Data Visualization (free online)</a></li><li><a href="https://www.kaggle.com/learn/data-visualization" target="_blank" rel="noopener">Kaggle Learn — Data Visualization</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Which chart for: (a) daily orders over October, (b) share of orders by payment method (3 methods), (c) delivery time vs distance for 5,000 orders?</li><li>Add a fifth figure: a histogram of <code>np.log(apt["price_bn"])</code>. What happens to the shape?</li><li>A slide shows bars for two teams at 92% and 95% with a y-axis from 90% to 96%. What is the problem and the fix?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (a) line chart, (b) sorted bar chart (or a simple 3-slice pie at most), (c) scatter with alpha or hexbin, plus a smoothed trend. 2) The log histogram is much more symmetric — the right tail is compressed; this motivates modelling log price (Lesson 5.2). 3) The cut axis makes 95% look 2.5 times taller than 92%; start bars at 0, or use a dot plot that may zoom and state the 3-point difference.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 4 · Bài 4.3</span>
<h2>Trực quan hoá với matplotlib: chọn và dựng biểu đồ trung thực</h2>
<p class="lead">Một biểu đồ tốt trả lời một câu hỏi chỉ trong một cái nhìn. Khám phá cần nhiều biểu đồ nhanh cho chính mình; trình bày cần ít biểu đồ được chăm chút cho người khác (Bài 12.1).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng giao diện hướng đối tượng của matplotlib (<code>fig, ax</code>) để dựng hình nhiều ô.</li><li>Chọn loại biểu đồ theo câu hỏi đang hỏi.</li><li>Áp dụng các quy tắc giữ biểu đồ trung thực và dễ đọc.</li></ul>
<h3>📖 Bài giảng</h3>
<p>matplotlib có hai kiểu viết. Kiểu nhanh <code>plt.plot(...)</code> vẽ lên một trục “hiện hành” ẩn; kiểu <strong>hướng đối tượng</strong> tạo một figure và các trục có tên, rồi gọi phương thức trên từng trục. Dùng kiểu thứ hai cho mọi hình có nhiều hơn một ô — rõ ràng và dễ chỉnh. (seaborn và <code>.plot()</code> của pandas là các lớp tiện lợi xây trên matplotlib.)</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

def make_apartments(n=600, seed=4):
    """Synthetic Hà Nội apartment listings (prices in billion VND)."""
    rng = np.random.default_rng(seed)
    base = {"Tay Ho": 75, "Cau Giay": 65, "Dong Da": 60, "Long Bien": 48, "Ha Dong": 40}  # million VND / m2
    district = rng.choice(list(base), size=n, p=[0.12, 0.25, 0.2, 0.18, 0.25])
    area = np.clip(rng.gamma(9, 8.5, n), 30, 200).round()
    bedrooms = np.clip((area / 35).round() + rng.integers(-1, 2, n), 1, 5).astype(int)
    age = rng.integers(0, 31, n)
    floor = rng.integers(1, 36, n)
    ppm2 = np.array([base[d] for d in district]) * (1 - 0.008 * age) + 0.15 * floor + rng.normal(0, 6, n)
    price = (area * ppm2 / 1000).round(2)
    return pd.DataFrame({"district": district, "area_m2": area, "bedrooms": bedrooms,
                         "age_years": age, "floor": floor, "price_bn": price})

apt = make_apartments()
apt["ppm2_mil"] = apt["price_bn"] * 1000 / apt["area_m2"]
order = apt.groupby("district")["ppm2_mil"].median().sort_values().index

fig, axes = plt.subplots(2, 2, figsize=(11, 8), constrained_layout=True)
ax = axes[0, 0]
ax.hist(apt["price_bn"], bins=30, color="tab:blue")
ax.set(title="Price distribution (right-skewed)", xlabel="Price (billion VND)", ylabel="Listings")

ax = axes[0, 1]
ax.boxplot([apt.loc[apt["district"] == d, "ppm2_mil"] for d in order], tick_labels=list(order))
ax.set(title="Price per m2 by district", ylabel="Million VND / m2")

ax = axes[1, 0]
ax.scatter(apt["area_m2"], apt["price_bn"], s=8, alpha=0.4)
ax.set(title="Area vs price", xlabel="Area (m2)", ylabel="Price (billion VND)")

ax = axes[1, 1]
med = apt.groupby("district")["ppm2_mil"].median().loc[order]
ax.barh(med.index, med.values, color="tab:gray")
ax.set(title="Median price per m2 (sorted)", xlabel="Million VND / m2")

fig.savefig("eda_apartments.png", dpi=120)
print("saved eda_apartments.png with panels:", [a.get_title() for a in axes.ravel()])
print("median ppm2 by district:", med.round(1).to_dict())</code></pre>
<div class="out">saved eda_apartments.png with panels: ['Price distribution (right-skewed)', 'Price per m2 by district', 'Area vs price', 'Median price per m2 (sorted)']
median ppm2 by district: {'Ha Dong': 38.1, 'Long Bien': 45.4, 'Dong Da': 55.8, 'Cau Giay': 58.9, 'Tay Ho': 67.8}</div>
<p>Hình trả lời bốn câu hỏi cùng lúc. <strong>Giá phân phối thế nào?</strong> → histogram (một biến số). <strong>Giá/m² khác nhau theo quận ra sao, kể cả độ phân tán?</strong> → box plot, mỗi nhóm một hộp, sắp theo trung vị. <strong>Hai biến số liên hệ thế nào?</strong> → biểu đồ phân tán; nhiều điểm thì dùng điểm nhỏ và độ trong suốt (<code>alpha</code>) để thấy mật độ. <strong>Nhóm nào cao nhất?</strong> → cột ngang sắp theo giá trị — nằm ngang để nhãn dài vẫn đọc được. Các trung vị in ra (Hà Đông 38,1 → Tây Hồ 67,8) chính là thứ biểu đồ cột thể hiện; giữ các con số cho phần chữ của bạn.</p>
<div class="formula"><span class="lbl">Câu hỏi → biểu đồ</span>phân phối: histogram, box plot · so sánh giữa các nhóm: cột đã sắp, box/strip plot · quan hệ: phân tán (+ đường xu hướng) · thay đổi theo thời gian: đường · cơ cấu: cột chồng (tránh bánh tròn nhiều lát)</div>
<p><strong>Quy tắc trung thực và rõ ràng.</strong></p>
<ul>
<li>Biểu đồ cột bắt đầu từ 0 — độ dài cột mã hoá giá trị, nên cắt trục sẽ phóng đại chênh lệch. Biểu đồ đường và phân tán được phép phóng to.</li>
<li>Ghi nhãn trục kèm đơn vị (“Triệu đồng / m2”) và đặt tiêu đề là <em>phát hiện</em> khi trình bày (“Tây Hồ đắt gấp 1,8 lần Hà Đông mỗi m²”).</li>
<li>Sắp các nhóm theo giá trị trừ khi chúng có thứ tự tự nhiên (tháng, mức đánh giá).</li>
<li>Dùng màu để làm nổi bật, không để trang trí; đảm bảo người mù màu và bản in đen trắng vẫn đọc được.</li>
<li>Thể hiện độ bất định khi so các nhóm nhỏ (thanh sai số, vẽ mọi điểm).</li>
</ul>
<p>Trong notebook, biểu đồ hiện ngay; trong script, <code>fig.savefig("ten.png", dpi=120)</code> ghi ra tệp để đưa vào báo cáo. Đặt kích thước một lần (<code>figsize</code>) và dùng <code>constrained_layout=True</code> để nhãn không chồng nhau.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Biểu đồ cột có trục y bắt đầu ở 50% để chênh lệch 2 điểm trông khổng lồ.</li><li>Nhóm không sắp xếp, màu cầu vồng và hiệu ứng 3D che mất phép so sánh.</li><li>Biểu đồ phân tán 100.000 điểm đặc trông như một khối — dùng alpha, điểm nhỏ hơn hoặc hexbin.</li><li>Hai trục y cho phép gợi ý bất kỳ mối quan hệ nào bạn muốn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Dùng <code>fig, axes = plt.subplots(...)</code> và gọi phương thức trên từng <code>ax</code>.</li><li>Chọn biểu đồ theo câu hỏi: phân phối, so sánh, quan hệ, xu hướng, cơ cấu.</li><li>Cột bắt đầu từ 0; ghi đơn vị; sắp nhóm; dùng màu tiết chế để làm nổi bật.</li><li>Lưu hình bằng <code>savefig</code> cho báo cáo.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://matplotlib.org/stable/users/explain/quick_start.html" target="_blank" rel="noopener">matplotlib — Hướng dẫn nhanh</a></li><li><a href="https://jakevdp.github.io/PythonDataScienceHandbook/04.00-introduction-to-matplotlib.html" target="_blank" rel="noopener">VanderPlas — Trực quan hoá với Matplotlib</a></li><li><a href="https://clauswilke.com/dataviz/" target="_blank" rel="noopener">Claus O. Wilke — Fundamentals of Data Visualization (đọc miễn phí)</a></li><li><a href="https://www.kaggle.com/learn/data-visualization" target="_blank" rel="noopener">Kaggle Learn — Data Visualization</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Biểu đồ nào cho: (a) số đơn mỗi ngày trong tháng 10, (b) tỉ lệ đơn theo phương thức thanh toán (3 phương thức), (c) thời gian giao theo quãng đường của 5.000 đơn?</li><li>Thêm hình thứ năm: histogram của <code>np.log(apt["price_bn"])</code>. Hình dạng thay đổi thế nào?</li><li>Một slide có cột của hai nhóm 92% và 95% với trục y từ 90% tới 96%. Vấn đề là gì và sửa thế nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (a) biểu đồ đường, (b) cột đã sắp (hoặc nhiều nhất là bánh tròn 3 lát đơn giản), (c) phân tán có alpha hoặc hexbin, kèm đường xu hướng làm trơn. 2) Histogram log đối xứng hơn nhiều — đuôi phải bị nén lại; đây là lý do mô hình hoá log giá (Bài 5.2). 3) Trục bị cắt làm 95% trông cao gấp 2,5 lần 92%; cho cột bắt đầu từ 0, hoặc dùng biểu đồ chấm được phép phóng to và ghi rõ chênh 3 điểm.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Exploratory data analysis and visualisation|||Quiz — Chương 4: Phân tích khám phá và trực quan hoá',
  'Quiz 8 câu: trung bình vs trung vị, IQR, độ xiên, cỡ nhóm, Pearson vs Spearman, nghịch lý Simpson, chọn biểu đồ, trục của biểu đồ cột.', [
  Q('q1', 'Prices have mean 3.88 bn and median 3.69 bn with a long right tail. Which is “typical”?|||Giá có trung bình 3,88 tỉ, trung vị 3,69 tỉ, đuôi phải dài. Số nào “điển hình”?',
    ['The median|||Trung vị', 'The mean|||Trung bình', 'The maximum|||Giá trị lớn nhất', 'The standard deviation|||Độ lệch chuẩn'], 0,
    'The median is not pulled by the expensive tail.|||Trung vị không bị đuôi giá cao kéo lệch.'),
  Q('q2', 'Which spread measure is robust to outliers?|||Thước đo độ phân tán nào bền với ngoại lai?',
    ['Interquartile range|||Khoảng tứ phân vị', 'Standard deviation|||Độ lệch chuẩn', 'Range (max − min)|||Biên độ (max − min)', 'Variance|||Phương sai'], 0,
    'The IQR uses only the middle 50% of the data.|||IQR chỉ dùng 50% dữ liệu ở giữa.'),
  Q('q3', 'A histogram has two clear peaks. A likely explanation is…|||Histogram có hai đỉnh rõ. Giải thích khả dĩ là…',
    ['two different populations mixed together|||hai quần thể khác nhau bị trộn lẫn', 'the data are normally distributed|||dữ liệu phân phối chuẩn', 'there are no outliers|||không có ngoại lai', 'the mean equals the median|||trung bình bằng trung vị'], 0,
    'Bimodal shapes often mean a hidden grouping variable (e.g. studios vs family flats).|||Hình hai đỉnh thường báo có biến nhóm ẩn (vd studio và căn gia đình).'),
  Q('q4', 'Why report group sizes next to group medians?|||Vì sao ghi cỡ nhóm cạnh trung vị của nhóm?',
    ['Small groups give noisy statistics|||Nhóm nhỏ cho thống kê nhiễu', 'pandas needs it|||pandas cần', 'It makes medians larger|||Nó làm trung vị lớn hơn', 'It removes confounding|||Nó loại bỏ biến gây nhiễu'], 0,
    'A median from 4 rows is far less reliable than from 400.|||Trung vị từ 4 dòng kém tin cậy hơn nhiều so với từ 400 dòng.'),
  Q('q5', 'y = x² on x = −3…3 gives Pearson r = 0. This shows that…|||y = x² trên x = −3…3 cho Pearson r = 0. Điều này cho thấy…',
    ['r measures only linear association|||r chỉ đo liên hệ tuyến tính', 'x and y are unrelated|||x và y không liên quan', 'Spearman would give 1|||Spearman sẽ cho 1', 'the data contain an error|||dữ liệu có lỗi'], 0,
    'A perfect U-shaped relationship can have zero linear correlation.|||Quan hệ hình chữ U hoàn hảo vẫn có thể có tương quan tuyến tính bằng 0.'),
  Q('q6', 'Bicycles look faster overall but slower at every distance. Distance is a…|||Xe đạp trông nhanh hơn tổng thể nhưng chậm hơn ở mọi cự ly. Cự ly là…',
    ['confounder|||biến gây nhiễu', 'target|||biến mục tiêu', 'duplicate|||bản ghi trùng', 'outlier|||ngoại lai'], 0,
    'Distance affects both vehicle assignment and delivery time — Simpson’s paradox.|||Cự ly ảnh hưởng cả việc phân xe lẫn thời gian giao — nghịch lý Simpson.'),
  Q('q7', 'Best chart for the relationship between area and price of 600 apartments?|||Biểu đồ tốt nhất cho quan hệ giữa diện tích và giá của 600 căn hộ?',
    ['Scatter plot|||Biểu đồ phân tán', 'Pie chart|||Biểu đồ bánh tròn', 'Stacked bars|||Cột chồng', 'Line chart over index|||Biểu đồ đường theo chỉ số dòng'], 0,
    'Two numeric variables → scatter plot.|||Hai biến số → biểu đồ phân tán.'),
  Q('q8', 'Why must a bar chart’s value axis start at zero?|||Vì sao trục giá trị của biểu đồ cột phải bắt đầu từ 0?',
    ['Bar length encodes the value, so a cut axis exaggerates differences|||Độ dài cột mã hoá giá trị, nên cắt trục phóng đại chênh lệch', 'matplotlib cannot draw otherwise|||matplotlib không vẽ khác được', 'It looks more colourful|||Trông nhiều màu hơn', 'To save space|||Để tiết kiệm chỗ'], 0,
    'Readers compare bar lengths; a truncated axis distorts the ratio.|||Người đọc so độ dài cột; trục bị cắt làm sai lệch tỉ lệ.'),
]);

const ch4 = {
  title: 'Chapter 4 — Exploratory data analysis and visualisation|||Chương 4 — Phân tích khám phá dữ liệu và trực quan hoá',
  description: 'EDA một biến (tâm, phân tán, hình dạng), quan hệ giữa các biến (groupby, Pearson/Spearman, nghịch lý Simpson), trực quan hoá với matplotlib và quy tắc biểu đồ trung thực.',
  lessons: [c41, c42, c43, q4],
};


// ───────────────────────────── Chương 5 — Feature engineering ─────────────────────────────
const c51 = L('dsi201-ts-5-1',
  '5.1 — Encoding categories and scaling numbers|||5.1 — Mã hoá biến phân loại và chuẩn hoá biến số',
  'Mô hình chỉ hiểu số: one-hot cho biến danh nghĩa (handle_unknown="ignore"), mã hoá thứ tự cho biến có thứ bậc, StandardScaler học trung bình/độ lệch chuẩn trên tập train; mô hình nào cần chuẩn hoá.',
  `<span class="eyebrow">DSI201 · Chapter 5 · Lesson 5.1</span>
<h2>Encoding categories and scaling numbers</h2>
<p class="lead">Models do arithmetic. Text categories must become numbers, and numbers on very different scales (area in m², floor 1–35, price in billions) sometimes need to be put on a common scale. How you do this changes what the model can learn.</p>
<h3>🎯 Objectives</h3>
<ul><li>One-hot encode nominal categories and handle categories unseen in training.</li><li>Encode ordered categories with an explicit order.</li><li>Standardise numeric features using statistics learned on training data only.</li></ul>
<h3>📖 Lecture</h3>
<pre><code class="language-python">import pandas as pd
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler

train = pd.DataFrame({
    "district": ["Cau Giay", "Ha Dong", "Tay Ho", "Ha Dong"],
    "furnishing": ["basic", "full", "none", "basic"],
    "area_m2": [70, 95, 120, 55],
})
new = pd.DataFrame({"district": ["Hoang Mai"], "furnishing": ["full"], "area_m2": [80]})

# Nominal category (no order) -&gt; one-hot; unseen categories become all zeros instead of an error
ohe = OneHotEncoder(handle_unknown="ignore", sparse_output=False).fit(train[["district"]])
print(ohe.get_feature_names_out().tolist())
print("train rows:\\n", ohe.transform(train[["district"]]))
print("unseen 'Hoang Mai':", ohe.transform(new[["district"]]))

# Ordered category -&gt; integers that respect the order we specify
ord_enc = OrdinalEncoder(categories=[["none", "basic", "full"]]).fit(train[["furnishing"]])
print("furnishing codes:", ord_enc.transform(train[["furnishing"]]).ravel().tolist())

# Scaling: learn mean and std on TRAIN only, then apply the same numbers to new data
sc = StandardScaler().fit(train[["area_m2"]])
print("learned mean/std:", round(sc.mean_[0], 2), round(sc.scale_[0], 2))
print("train scaled:", sc.transform(train[["area_m2"]]).ravel().round(2).tolist())
print("new 80 m2 scaled:", sc.transform(new[["area_m2"]]).ravel().round(2).tolist())</code></pre>
<div class="out">['district_Cau Giay', 'district_Ha Dong', 'district_Tay Ho']
train rows:
 [[1. 0. 0.]
 [0. 1. 0.]
 [0. 0. 1.]
 [0. 1. 0.]]
unseen 'Hoang Mai': [[0. 0. 0.]]
furnishing codes: [1.0, 2.0, 0.0, 1.0]
learned mean/std: 85.0 24.75
train scaled: [-0.61, 0.4, 1.41, -1.21]
new 80 m2 scaled: [-0.2]</div>
<p><strong>Nominal categories → one-hot.</strong> A district has no order: Cau Giay is not “less than” Tay Ho. Coding them 1, 2, 3 would tell a linear model that Tay Ho is three times Cau Giay. <strong>One-hot encoding</strong> creates one 0/1 column per category instead. The encoder is <em>fitted</em> on the training data — it remembers the three districts it saw. When a new listing arrives from Hoang Mai, <code>handle_unknown="ignore"</code> encodes it as all zeros (the model then treats it like an “average” district) rather than crashing in production. For categories with hundreds of levels (street names, product IDs), one-hot becomes huge: group rare levels into “Other” (<code>min_frequency=</code>), or use target encoding carefully (it leaks if done outside cross-validation).</p>
<p><strong>Ordered categories → ordinal codes.</strong> Furnishing “none” &lt; “basic” &lt; “full” does have an order, so integers 0, 1, 2 are reasonable — but you must give the order explicitly; by default the encoder sorts alphabetically, which would put “basic” before “full” before “none”.</p>
<p><strong>Scaling.</strong> <code>StandardScaler</code> turns each value into z = (x − mean) / std. It learned mean 85.0 and std 24.75 from the four training areas; a new 80 m² listing becomes −0.2 using <em>those same numbers</em>. Never refit the scaler on test or production data — the transformation must be identical. Which models care?</p>
<ul>
<li><strong>Need scaling:</strong> k-nearest neighbours, k-means, PCA, SVMs, neural networks, and regularised linear/logistic regression (the penalty treats all coefficients alike, so units matter).</li>
<li><strong>Do not care:</strong> decision trees, random forests and gradient boosting split on thresholds, so monotone rescaling changes nothing.</li>
</ul>
<div class="formula"><span class="lbl">Standardisation</span>z = (x − μ<sub>train</sub>) / σ<sub>train</sub>      Min–max: x′ = (x − min<sub>train</sub>) / (max<sub>train</sub> − min<sub>train</sub>)</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Label-encoding nominal categories (1, 2, 3) for a linear model.</li><li>Fitting the scaler on all data before splitting — test statistics leak into training (Lesson 6.3).</li><li>Using <code>pd.get_dummies</code> separately on train and test, which produces different columns when a category is missing from one of them.</li><li>Letting OrdinalEncoder sort categories alphabetically.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Nominal → one-hot with <code>handle_unknown="ignore"</code>; ordinal → explicit order.</li><li>Encoders and scalers are fitted on training data and reused unchanged.</li><li>Distance- and penalty-based models need scaling; tree models do not.</li><li>Group rare categories to keep one-hot manageable.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/preprocessing.html" target="_blank" rel="noopener">scikit-learn — Preprocessing data (scalers, encoders)</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/categorical-data" target="_blank" rel="noopener">Google ML Crash Course — Working with categorical data</a></li><li><a href="https://www.kaggle.com/learn/feature-engineering" target="_blank" rel="noopener">Kaggle Learn — Feature Engineering</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Training areas are 50, 70, 90 (population std = 16.33). What is the standardised value of a 110 m² listing?</li><li>Which encoding for: (a) payment method (cash, card, e-wallet), (b) customer rating 1–5 stars, (c) restaurant ID with 8,000 values?</li><li>Why does a random forest give the same predictions whether or not you standardise the area?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Mean 70, so z = (110 − 70)/16.33 ≈ 2.45. 2) (a) one-hot, (b) keep as an ordered number 1–5 (ordinal), (c) not one-hot — group rare IDs, use aggregated features (restaurant's average past delivery time, computed on training data only) or target encoding inside cross-validation. 3) Trees split on thresholds such as “area &lt; 85”; standardising moves the threshold to the equivalent z value but produces the same partitions of the data.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 5 · Bài 5.1</span>
<h2>Mã hoá biến phân loại và chuẩn hoá biến số</h2>
<p class="lead">Mô hình làm phép tính. Nhóm dạng chữ phải thành số, và các số có thang đo rất khác nhau (diện tích theo m², tầng 1–35, giá theo tỉ) đôi khi phải đưa về cùng thang. Cách làm việc này quyết định mô hình học được gì.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mã hoá one-hot biến danh nghĩa và xử lý nhóm chưa từng gặp khi huấn luyện.</li><li>Mã hoá biến có thứ bậc với thứ tự được nêu rõ.</li><li>Chuẩn hoá biến số bằng thống kê học trên dữ liệu huấn luyện mà thôi.</li></ul>
<h3>📖 Bài giảng</h3>
<pre><code class="language-python">import pandas as pd
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler

train = pd.DataFrame({
    "district": ["Cau Giay", "Ha Dong", "Tay Ho", "Ha Dong"],
    "furnishing": ["basic", "full", "none", "basic"],
    "area_m2": [70, 95, 120, 55],
})
new = pd.DataFrame({"district": ["Hoang Mai"], "furnishing": ["full"], "area_m2": [80]})

# Nominal category (no order) -&gt; one-hot; unseen categories become all zeros instead of an error
ohe = OneHotEncoder(handle_unknown="ignore", sparse_output=False).fit(train[["district"]])
print(ohe.get_feature_names_out().tolist())
print("train rows:\\n", ohe.transform(train[["district"]]))
print("unseen 'Hoang Mai':", ohe.transform(new[["district"]]))

# Ordered category -&gt; integers that respect the order we specify
ord_enc = OrdinalEncoder(categories=[["none", "basic", "full"]]).fit(train[["furnishing"]])
print("furnishing codes:", ord_enc.transform(train[["furnishing"]]).ravel().tolist())

# Scaling: learn mean and std on TRAIN only, then apply the same numbers to new data
sc = StandardScaler().fit(train[["area_m2"]])
print("learned mean/std:", round(sc.mean_[0], 2), round(sc.scale_[0], 2))
print("train scaled:", sc.transform(train[["area_m2"]]).ravel().round(2).tolist())
print("new 80 m2 scaled:", sc.transform(new[["area_m2"]]).ravel().round(2).tolist())</code></pre>
<div class="out">['district_Cau Giay', 'district_Ha Dong', 'district_Tay Ho']
train rows:
 [[1. 0. 0.]
 [0. 1. 0.]
 [0. 0. 1.]
 [0. 1. 0.]]
unseen 'Hoang Mai': [[0. 0. 0.]]
furnishing codes: [1.0, 2.0, 0.0, 1.0]
learned mean/std: 85.0 24.75
train scaled: [-0.61, 0.4, 1.41, -1.21]
new 80 m2 scaled: [-0.2]</div>
<p><strong>Biến danh nghĩa → one-hot.</strong> Quận không có thứ tự: Cầu Giấy không “nhỏ hơn” Tây Hồ. Mã hoá thành 1, 2, 3 sẽ bảo mô hình tuyến tính rằng Tây Hồ gấp ba Cầu Giấy. <strong>One-hot</strong> tạo mỗi nhóm một cột 0/1 thay vào đó. Bộ mã hoá được <em>fit</em> trên dữ liệu huấn luyện — nó nhớ ba quận đã gặp. Khi có tin mới ở Hoàng Mai, <code>handle_unknown="ignore"</code> mã hoá thành toàn số 0 (mô hình coi như một quận “trung bình”) thay vì sập khi chạy thật. Với biến có hàng trăm mức (tên đường, mã sản phẩm), one-hot phình to: gộp mức hiếm vào “Other” (<code>min_frequency=</code>), hoặc dùng target encoding thật cẩn thận (rò rỉ nếu làm ngoài kiểm định chéo).</p>
<p><strong>Biến có thứ bậc → mã thứ tự.</strong> Nội thất “none” &lt; “basic” &lt; “full” có thứ tự, nên số nguyên 0, 1, 2 là hợp lý — nhưng phải khai báo thứ tự rõ ràng; mặc định bộ mã hoá sắp theo bảng chữ cái, sẽ đặt “basic” trước “full” trước “none”.</p>
<p><strong>Chuẩn hoá.</strong> <code>StandardScaler</code> biến mỗi giá trị thành z = (x − trung bình) / độ lệch chuẩn. Nó học trung bình 85,0 và độ lệch chuẩn 24,75 từ bốn diện tích huấn luyện; tin mới 80 m² thành −0,2 bằng <em>chính các con số đó</em>. Không bao giờ fit lại scaler trên dữ liệu test hay dữ liệu chạy thật — phép biến đổi phải giống hệt. Mô hình nào quan tâm?</p>
<ul>
<li><strong>Cần chuẩn hoá:</strong> k láng giềng gần nhất, k-means, PCA, SVM, mạng nơ-ron, và hồi quy tuyến tính/logistic có chính quy hoá (phạt mọi hệ số như nhau, nên đơn vị quan trọng).</li>
<li><strong>Không quan tâm:</strong> cây quyết định, rừng ngẫu nhiên và gradient boosting chia theo ngưỡng, nên đổi thang đơn điệu không thay đổi gì.</li>
</ul>
<div class="formula"><span class="lbl">Chuẩn hoá</span>z = (x − μ<sub>train</sub>) / σ<sub>train</sub>      Min–max: x′ = (x − min<sub>train</sub>) / (max<sub>train</sub> − min<sub>train</sub>)</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Mã hoá nhãn (1, 2, 3) cho biến danh nghĩa khi dùng mô hình tuyến tính.</li><li>Fit scaler trên toàn bộ dữ liệu trước khi chia — thống kê của tập test rò vào huấn luyện (Bài 6.3).</li><li>Dùng <code>pd.get_dummies</code> riêng cho train và test, sinh ra bộ cột khác nhau khi một nhóm vắng mặt ở một bên.</li><li>Để OrdinalEncoder sắp nhóm theo bảng chữ cái.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Danh nghĩa → one-hot với <code>handle_unknown="ignore"</code>; thứ bậc → thứ tự rõ ràng.</li><li>Bộ mã hoá và scaler được fit trên dữ liệu huấn luyện và dùng lại nguyên vẹn.</li><li>Mô hình dựa trên khoảng cách và phạt hệ số cần chuẩn hoá; mô hình cây thì không.</li><li>Gộp nhóm hiếm để one-hot không phình to.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/preprocessing.html" target="_blank" rel="noopener">scikit-learn — Tiền xử lý dữ liệu (scaler, encoder)</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/categorical-data" target="_blank" rel="noopener">Google ML Crash Course — Làm việc với dữ liệu phân loại</a></li><li><a href="https://www.kaggle.com/learn/feature-engineering" target="_blank" rel="noopener">Kaggle Learn — Feature Engineering</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Diện tích huấn luyện là 50, 70, 90 (độ lệch chuẩn tổng thể = 16,33). Giá trị chuẩn hoá của căn 110 m² là bao nhiêu?</li><li>Mã hoá nào cho: (a) phương thức thanh toán (tiền mặt, thẻ, ví điện tử), (b) đánh giá 1–5 sao, (c) mã nhà hàng có 8.000 giá trị?</li><li>Vì sao rừng ngẫu nhiên cho cùng dự đoán dù có chuẩn hoá diện tích hay không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Trung bình 70, nên z = (110 − 70)/16,33 ≈ 2,45. 2) (a) one-hot, (b) giữ dạng số có thứ tự 1–5, (c) không one-hot — gộp mã hiếm, dùng đặc trưng tổng hợp (thời gian giao trung bình trước đây của nhà hàng, chỉ tính trên dữ liệu huấn luyện) hoặc target encoding bên trong kiểm định chéo. 3) Cây chia theo ngưỡng như “diện tích &lt; 85”; chuẩn hoá chỉ dời ngưỡng sang giá trị z tương ứng nhưng tạo ra cùng cách chia dữ liệu.</p></div>`);

const c52 = L('dsi201-ts-5-2',
  '5.2 — Creating features: domain knowledge, logs and interactions|||5.2 — Tạo đặc trưng: hiểu biết nghiệp vụ, log và tương tác',
  'Đặc trưng từ hiểu biết nghiệp vụ: ngày giờ, tỉ lệ, nhóm hoá, tương tác; thế giới nhân tính → log; thí nghiệm ba phiên bản đặc trưng cho giá căn hộ: MAE 0,770 → 0,427 → 0,361 tỉ.',
  `<span class="eyebrow">DSI201 · Chapter 5 · Lesson 5.2</span>
<h2>Creating features: domain knowledge, logs and interactions</h2>
<p class="lead">A simple model with good features usually beats a complex model with raw columns. Feature engineering is where your understanding of the problem enters the model.</p>
<h3>🎯 Objectives</h3>
<ul><li>Build common feature types: date parts, ratios, bins, aggregates, interactions.</li><li>Use a log transform when effects are multiplicative.</li><li>Measure whether a feature helps on held-out data.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>A toolbox of feature types.</strong></p>
<ul>
<li><strong>Date and time parts:</strong> hour, weekday, month, “is weekend”, “minutes since lunch peak”, holidays (Tết!). Delivery times depend on rush hours, not on the raw timestamp.</li>
<li><strong>Ratios and differences:</strong> price per m², area per bedroom, “promised minus typical time”. Ratios remove a size effect and are often what experts look at.</li>
<li><strong>Aggregates over history:</strong> a restaurant's median past preparation time, a customer's number of past orders — computed only from data before the prediction time.</li>
<li><strong>Bins:</strong> age groups or distance bands, when the effect is step-like or you need robustness to outliers.</li>
<li><strong>Interactions:</strong> the effect of rain may be larger at rush hour; a product <code>rain × rush_hour</code> lets a linear model express that.</li>
<li><strong>Transforms:</strong> log for right-skewed, multiplicative quantities; square root for counts.</li>
</ul>
<p><strong>Why logs?</strong> In our apartment generator — and in real markets — price ≈ area × price per m², and price per m² depends on district and age. That is a <em>product</em>. Taking logs turns it into a sum: log(price) = log(area) + log(price per m²), which a linear model fits naturally. Modelling log(price) also means errors are roughly proportional (10% off on a cheap or an expensive flat) rather than absolute. scikit-learn's <code>TransformedTargetRegressor</code> fits on log(price) and converts predictions back with exp, so the metric is still in billions of VND. The experiment below adds features step by step and measures each version on the same held-out 25% of listings:</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.compose import TransformedTargetRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

def make_apartments(n=600, seed=4):
    """Synthetic Hà Nội apartment listings (prices in billion VND)."""
    rng = np.random.default_rng(seed)
    base = {"Tay Ho": 75, "Cau Giay": 65, "Dong Da": 60, "Long Bien": 48, "Ha Dong": 40}  # million VND / m2
    district = rng.choice(list(base), size=n, p=[0.12, 0.25, 0.2, 0.18, 0.25])
    area = np.clip(rng.gamma(9, 8.5, n), 30, 200).round()
    bedrooms = np.clip((area / 35).round() + rng.integers(-1, 2, n), 1, 5).astype(int)
    age = rng.integers(0, 31, n)
    floor = rng.integers(1, 36, n)
    ppm2 = np.array([base[d] for d in district]) * (1 - 0.008 * age) + 0.15 * floor + rng.normal(0, 6, n)
    price = (area * ppm2 / 1000).round(2)
    return pd.DataFrame({"district": district, "area_m2": area, "bedrooms": bedrooms,
                         "age_years": age, "floor": floor, "price_bn": price})

apt = make_apartments()
train, test = train_test_split(apt, test_size=0.25, random_state=1)

def design(df, version):
    X = df[["area_m2", "bedrooms", "age_years", "floor"]].copy()
    if version &gt;= 2:                                   # district as one-hot columns
        X = X.join(pd.get_dummies(df["district"], prefix="d", dtype=float))
    if version &gt;= 3:                                   # multiplicative world -&gt; log of area
        X["log_area"] = np.log(df["area_m2"])
        X = X.drop(columns="area_m2")
    return X

for version, label in [(1, "raw numeric"), (2, "+ district one-hot"), (3, "+ log area, log target")]:
    Xtr, Xte = design(train, version), design(test, version)
    Xte = Xte.reindex(columns=Xtr.columns, fill_value=0.0)   # same columns in the same order
    model = LinearRegression()
    if version == 3:                                   # fit on log(price), predict back in billions
        model = TransformedTargetRegressor(regressor=model, func=np.log, inverse_func=np.exp)
    model.fit(Xtr, train["price_bn"])
    mae = mean_absolute_error(test["price_bn"], model.predict(Xte))
    print(f"{label:24s} features={Xtr.shape[1]:2d}  test MAE = {mae:.3f} bn VND")</code></pre>
<div class="out">raw numeric              features= 4  test MAE = 0.770 bn VND
+ district one-hot       features= 9  test MAE = 0.427 bn VND
+ log area, log target   features= 9  test MAE = 0.361 bn VND</div>
<p>Raw numeric columns give a test MAE of 0.770 bn VND. Adding the district (one-hot) almost halves the error to 0.427 — location is the main price driver that the raw columns missed. Switching to log area with a log target brings it to 0.361 bn, 53% below where we started, with the same simple linear model. Each step was motivated by EDA (Chapter 4: district medians, skewed price) — that is the normal workflow: explore → hypothesis → feature → measure.</p>
<p><strong>Discipline.</strong> Judge features on validation data, not training fit (a feature can only lower training error). Keep a log of what you tried, including failures. And check that every feature is available at prediction time — a “days on market” feature is useless at the moment of listing.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Aggregates computed over the whole dataset, including future rows or the row itself (leakage).</li><li>Taking log of zero or negative values — use <code>log1p</code> or shift, and say so.</li><li>Adding hundreds of automatic features and keeping those that look good on the test set.</li><li>Forgetting to transform predictions back when the target was logged.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Good features encode domain knowledge: time parts, ratios, history aggregates, interactions.</li><li>Multiplicative relationships → log transform (features and/or target).</li><li>Add one idea at a time and measure on held-out data.</li><li>Every feature must exist at prediction time.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/numerical-data" target="_blank" rel="noopener">Google ML Crash Course — Working with numerical data</a></li><li><a href="https://scikit-learn.org/stable/auto_examples/compose/plot_transformed_target.html" target="_blank" rel="noopener">scikit-learn example — Effect of transforming the target in regression</a></li><li><a href="https://www.statlearning.com/" target="_blank" rel="noopener">ISLP — Chapter 3 (qualitative predictors, interactions, non-linear transforms)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Propose four features for predicting food preparation time at a restaurant, saying when each is known.</li><li>A log-target model predicts log(price) = 1.30. What price in billions does it predict?</li><li>In version 3 we dropped <code>area_m2</code> after adding <code>log_area</code>. Would keeping both be wrong? What could it add?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Number of items in the order (at order time), hour and weekday (at order time), restaurant's median prep time over the past 4 weeks (computed before the order), number of open orders at the restaurant right now (live, at order time). 2) e<sup>1.30</sup> ≈ 3.67 bn VND. 3) Not wrong — the model could use both to bend the curve, but the two are highly correlated, which makes coefficients unstable and harder to interpret (Lesson 10.1); test whether it improves validation error.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 5 · Bài 5.2</span>
<h2>Tạo đặc trưng: hiểu biết nghiệp vụ, log và tương tác</h2>
<p class="lead">Mô hình đơn giản với đặc trưng tốt thường thắng mô hình phức tạp với cột thô. Feature engineering là nơi hiểu biết của bạn về bài toán đi vào mô hình.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dựng các loại đặc trưng thường gặp: thành phần ngày giờ, tỉ lệ, nhóm hoá, tổng hợp, tương tác.</li><li>Dùng biến đổi log khi tác động mang tính nhân.</li><li>Đo xem một đặc trưng có giúp ích trên dữ liệu giữ lại hay không.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Hộp công cụ các loại đặc trưng.</strong></p>
<ul>
<li><strong>Thành phần ngày giờ:</strong> giờ, thứ, tháng, “cuối tuần”, “số phút kể từ cao điểm trưa”, ngày lễ (Tết!). Thời gian giao phụ thuộc giờ cao điểm, không phụ thuộc mốc thời gian thô.</li>
<li><strong>Tỉ lệ và hiệu:</strong> giá mỗi m², diện tích mỗi phòng ngủ, “thời gian hứa trừ thời gian điển hình”. Tỉ lệ khử ảnh hưởng của kích thước và thường là thứ chuyên gia nhìn vào.</li>
<li><strong>Tổng hợp từ lịch sử:</strong> trung vị thời gian chuẩn bị trước đây của nhà hàng, số đơn trước đây của khách — chỉ tính từ dữ liệu trước thời điểm dự đoán.</li>
<li><strong>Nhóm hoá (bin):</strong> nhóm tuổi hay dải quãng đường, khi tác động có dạng bậc thang hoặc cần bền với ngoại lai.</li>
<li><strong>Tương tác:</strong> tác động của mưa có thể lớn hơn vào giờ cao điểm; tích <code>rain × rush_hour</code> cho phép mô hình tuyến tính diễn tả điều đó.</li>
<li><strong>Biến đổi:</strong> log cho đại lượng xiên phải, mang tính nhân; căn bậc hai cho số đếm.</li>
</ul>
<p><strong>Vì sao dùng log?</strong> Trong bộ sinh dữ liệu căn hộ — và trên thị trường thật — giá ≈ diện tích × giá mỗi m², và giá mỗi m² phụ thuộc quận và tuổi. Đó là một <em>tích</em>. Lấy log biến nó thành tổng: log(giá) = log(diện tích) + log(giá/m²), thứ mà mô hình tuyến tính khớp tự nhiên. Mô hình hoá log(giá) cũng có nghĩa sai số xấp xỉ theo tỉ lệ (lệch 10% với căn rẻ hay căn đắt) thay vì tuyệt đối. <code>TransformedTargetRegressor</code> của scikit-learn fit trên log(giá) và đổi dự đoán ngược lại bằng exp, nên chỉ số vẫn tính theo tỉ đồng. Thí nghiệm dưới đây thêm đặc trưng từng bước và đo mỗi phiên bản trên cùng 25% tin rao được giữ lại:</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.compose import TransformedTargetRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

def make_apartments(n=600, seed=4):
    """Synthetic Hà Nội apartment listings (prices in billion VND)."""
    rng = np.random.default_rng(seed)
    base = {"Tay Ho": 75, "Cau Giay": 65, "Dong Da": 60, "Long Bien": 48, "Ha Dong": 40}  # million VND / m2
    district = rng.choice(list(base), size=n, p=[0.12, 0.25, 0.2, 0.18, 0.25])
    area = np.clip(rng.gamma(9, 8.5, n), 30, 200).round()
    bedrooms = np.clip((area / 35).round() + rng.integers(-1, 2, n), 1, 5).astype(int)
    age = rng.integers(0, 31, n)
    floor = rng.integers(1, 36, n)
    ppm2 = np.array([base[d] for d in district]) * (1 - 0.008 * age) + 0.15 * floor + rng.normal(0, 6, n)
    price = (area * ppm2 / 1000).round(2)
    return pd.DataFrame({"district": district, "area_m2": area, "bedrooms": bedrooms,
                         "age_years": age, "floor": floor, "price_bn": price})

apt = make_apartments()
train, test = train_test_split(apt, test_size=0.25, random_state=1)

def design(df, version):
    X = df[["area_m2", "bedrooms", "age_years", "floor"]].copy()
    if version &gt;= 2:                                   # district as one-hot columns
        X = X.join(pd.get_dummies(df["district"], prefix="d", dtype=float))
    if version &gt;= 3:                                   # multiplicative world -&gt; log of area
        X["log_area"] = np.log(df["area_m2"])
        X = X.drop(columns="area_m2")
    return X

for version, label in [(1, "raw numeric"), (2, "+ district one-hot"), (3, "+ log area, log target")]:
    Xtr, Xte = design(train, version), design(test, version)
    Xte = Xte.reindex(columns=Xtr.columns, fill_value=0.0)   # same columns in the same order
    model = LinearRegression()
    if version == 3:                                   # fit on log(price), predict back in billions
        model = TransformedTargetRegressor(regressor=model, func=np.log, inverse_func=np.exp)
    model.fit(Xtr, train["price_bn"])
    mae = mean_absolute_error(test["price_bn"], model.predict(Xte))
    print(f"{label:24s} features={Xtr.shape[1]:2d}  test MAE = {mae:.3f} bn VND")</code></pre>
<div class="out">raw numeric              features= 4  test MAE = 0.770 bn VND
+ district one-hot       features= 9  test MAE = 0.427 bn VND
+ log area, log target   features= 9  test MAE = 0.361 bn VND</div>
<p>Cột số thô cho MAE test 0,770 tỉ. Thêm quận (one-hot) gần như giảm nửa sai số còn 0,427 — vị trí là động lực giá chính mà các cột thô bỏ sót. Chuyển sang log diện tích với mục tiêu log đưa xuống 0,361 tỉ, thấp hơn điểm xuất phát 53%, vẫn với cùng một mô hình tuyến tính đơn giản. Mỗi bước đều xuất phát từ EDA (Chương 4: trung vị theo quận, giá bị xiên) — đó là quy trình bình thường: khám phá → giả thuyết → đặc trưng → đo.</p>
<p><strong>Kỷ luật.</strong> Đánh giá đặc trưng trên dữ liệu kiểm định, không trên độ khớp huấn luyện (thêm đặc trưng chỉ có thể làm giảm sai số huấn luyện). Ghi lại những gì đã thử, kể cả thất bại. Và kiểm mọi đặc trưng có sẵn tại thời điểm dự đoán — đặc trưng “số ngày đã rao” vô dụng lúc vừa đăng tin.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tổng hợp tính trên toàn bộ dữ liệu, gồm cả dòng tương lai hay chính dòng đó (rò rỉ).</li><li>Lấy log của số 0 hoặc số âm — dùng <code>log1p</code> hoặc dịch giá trị, và nói rõ.</li><li>Thêm hàng trăm đặc trưng tự động rồi giữ những cái trông đẹp trên tập test.</li><li>Quên đổi ngược dự đoán khi mục tiêu đã lấy log.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đặc trưng tốt mã hoá hiểu biết nghiệp vụ: thành phần thời gian, tỉ lệ, tổng hợp lịch sử, tương tác.</li><li>Quan hệ nhân → biến đổi log (đặc trưng và/hoặc mục tiêu).</li><li>Thêm từng ý một và đo trên dữ liệu giữ lại.</li><li>Mọi đặc trưng phải tồn tại tại thời điểm dự đoán.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/numerical-data" target="_blank" rel="noopener">Google ML Crash Course — Làm việc với dữ liệu số</a></li><li><a href="https://scikit-learn.org/stable/auto_examples/compose/plot_transformed_target.html" target="_blank" rel="noopener">Ví dụ scikit-learn — Tác động của biến đổi mục tiêu trong hồi quy</a></li><li><a href="https://www.statlearning.com/" target="_blank" rel="noopener">ISLP — Chương 3 (biến định tính, tương tác, biến đổi phi tuyến)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đề xuất bốn đặc trưng để dự đoán thời gian chuẩn bị món ở một nhà hàng, nói rõ khi nào mỗi cái được biết.</li><li>Mô hình mục tiêu log dự đoán log(giá) = 1,30. Nó dự đoán giá bao nhiêu tỉ?</li><li>Ở phiên bản 3 ta bỏ <code>area_m2</code> sau khi thêm <code>log_area</code>. Giữ cả hai có sai không? Nó có thể thêm được gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Số món trong đơn (lúc đặt), giờ và thứ (lúc đặt), trung vị thời gian chuẩn bị của nhà hàng trong 4 tuần qua (tính trước khi có đơn), số đơn đang mở ở nhà hàng lúc này (trực tiếp, lúc đặt). 2) e<sup>1,30</sup> ≈ 3,67 tỉ đồng. 3) Không sai — mô hình có thể dùng cả hai để uốn đường cong, nhưng hai biến tương quan rất cao, làm hệ số kém ổn định và khó diễn giải (Bài 10.1); hãy kiểm xem sai số kiểm định có giảm không.</p></div>`);

const c53 = L('dsi201-ts-5-3',
  '5.3 — Pipelines and ColumnTransformer: preprocessing you cannot leak|||5.3 — Pipeline và ColumnTransformer: tiền xử lý không thể rò rỉ',
  'Gói điền thiếu + log + chuẩn hoá + one-hot + Ridge với mục tiêu log vào một Pipeline; kiểm định chéo 5 phần MAE 0,416; get_feature_names_out; dự đoán thẳng từ một dòng thô có quận lạ và tuổi thiếu.',
  `<span class="eyebrow">DSI201 · Chapter 5 · Lesson 5.3</span>
<h2>Pipelines and ColumnTransformer: preprocessing you cannot leak</h2>
<p class="lead">Lessons 5.1–5.2 used several separate steps, each with its own <code>fit</code>. In a real project that becomes a tangle that is easy to get wrong. A scikit-learn <strong>Pipeline</strong> packs every step and the model into one object with a single <code>fit</code> and <code>predict</code>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply different preprocessing to different columns with <code>ColumnTransformer</code>.</li><li>Chain preprocessing and a model in a <code>Pipeline</code> and cross-validate it.</li><li>Predict directly from raw rows, including missing and unseen values.</li></ul>
<h3>📖 Lecture</h3>
<p>We add realistic holes to the apartment data (8% of ages and 5% of districts missing) and build one object that does everything:</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer, TransformedTargetRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler, FunctionTransformer

def make_apartments(n=600, seed=4):
    """Synthetic Hà Nội apartment listings (prices in billion VND)."""
    rng = np.random.default_rng(seed)
    base = {"Tay Ho": 75, "Cau Giay": 65, "Dong Da": 60, "Long Bien": 48, "Ha Dong": 40}  # million VND / m2
    district = rng.choice(list(base), size=n, p=[0.12, 0.25, 0.2, 0.18, 0.25])
    area = np.clip(rng.gamma(9, 8.5, n), 30, 200).round()
    bedrooms = np.clip((area / 35).round() + rng.integers(-1, 2, n), 1, 5).astype(int)
    age = rng.integers(0, 31, n)
    floor = rng.integers(1, 36, n)
    ppm2 = np.array([base[d] for d in district]) * (1 - 0.008 * age) + 0.15 * floor + rng.normal(0, 6, n)
    price = (area * ppm2 / 1000).round(2)
    return pd.DataFrame({"district": district, "area_m2": area, "bedrooms": bedrooms,
                         "age_years": age, "floor": floor, "price_bn": price})

apt = make_apartments()
rng = np.random.default_rng(0)
apt.loc[rng.random(len(apt)) &lt; 0.08, "age_years"] = np.nan      # real data have holes
apt.loc[rng.random(len(apt)) &lt; 0.05, "district"] = np.nan
X, y = apt.drop(columns="price_bn"), apt["price_bn"]

preprocess = ColumnTransformer([
    ("area", make_pipeline(FunctionTransformer(np.log, feature_names_out="one-to-one"), StandardScaler()),
     ["area_m2"]),
    ("num", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()),
     ["bedrooms", "age_years", "floor"]),
    ("cat", make_pipeline(SimpleImputer(strategy="most_frequent"), OneHotEncoder(handle_unknown="ignore")),
     ["district"]),
])
model = Pipeline([
    ("prep", preprocess),
    ("reg", TransformedTargetRegressor(regressor=Ridge(alpha=1.0), func=np.log, inverse_func=np.exp)),
])

# Every fold re-fits imputer, scaler and encoder on its own training part -&gt; no leakage
scores = -cross_val_score(model, X, y, cv=5, scoring="neg_mean_absolute_error")
print("5-fold MAE:", scores.round(3).tolist(), "mean =", round(scores.mean(), 3))

model.fit(X, y)
print(model.named_steps["prep"].get_feature_names_out().tolist())
new = pd.DataFrame([{"district": "Hoang Mai", "area_m2": 68, "bedrooms": 2, "age_years": np.nan, "floor": 12}])
print("prediction for a raw new listing:", model.predict(new).round(2))</code></pre>
<div class="out">5-fold MAE: [0.417, 0.405, 0.384, 0.411, 0.463] mean = 0.416
['area__area_m2', 'num__bedrooms', 'num__age_years', 'num__floor', 'cat__district_Cau Giay', 'cat__district_Dong Da', 'cat__district_Ha Dong', 'cat__district_Long Bien', 'cat__district_Tay Ho']
prediction for a raw new listing: [3.52]</div>
<p><strong>How it is built.</strong> <code>ColumnTransformer</code> takes a list of <em>(name, transformer, columns)</em>: area gets log + scaling; bedrooms, age and floor get median imputation + scaling; district gets most-frequent imputation + one-hot. <code>make_pipeline</code> chains steps inside each branch. The outer <code>Pipeline</code> then feeds the transformed matrix to a Ridge regression (a linear model with a small penalty, Lesson 7.1) wrapped in a log-target regressor.</p>
<p><strong>Why it prevents leakage.</strong> <code>cross_val_score</code> clones the whole pipeline for each of the 5 folds and fits it on the training part only: the median age, the scaler's mean and std and the list of districts are all learned without seeing the validation part. If you had imputed and scaled the full dataset first, every fold would have peeked at its own validation data. The mean 5-fold MAE is 0.416 bn VND, a little worse than the 0.361 of Lesson 5.2 — the data now have missing values, and a 5-fold average over all 600 rows is a different (more reliable) estimate than one 150-row test split. Both effects are normal; compare models only under the same protocol.</p>
<p><strong>Why it helps in production.</strong> After <code>model.fit(X, y)</code>, the fitted pipeline can be saved as one file (Lesson 11.2). A raw new listing — district “Hoang Mai” never seen, age missing — goes straight into <code>predict</code> and gets 3.52 bn VND: the age is imputed with the training median and the unknown district is encoded as zeros. <code>get_feature_names_out()</code> lists the final 9 columns, so you can always trace a coefficient back to its source.</p>
<div class="formula"><span class="lbl">Pattern to reuse</span>preprocess = ColumnTransformer([(name, steps, columns), …]) → model = Pipeline([("prep", preprocess), ("est", estimator)]) → cross_val_score(model, X_raw, y) → model.fit(X_raw, y) → model.predict(new_raw_rows)</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Running <code>fit_transform</code> on all data “to save time” and only then cross-validating.</li><li>Forgetting a column: by default ColumnTransformer <em>drops</em> columns not listed (<code>remainder="drop"</code>).</li><li>Different preprocessing code in the notebook and in the production app — ship the fitted pipeline instead.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li><code>ColumnTransformer</code> routes columns to their own preprocessing.</li><li><code>Pipeline</code> chains preprocessing and model; fit and predict once.</li><li>Cross-validating the pipeline refits preprocessing per fold → no leakage.</li><li>The fitted pipeline accepts raw rows, handles missing and unseen values.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/compose.html" target="_blank" rel="noopener">scikit-learn — Pipelines and composite estimators</a></li><li><a href="https://scikit-learn.org/stable/auto_examples/compose/plot_column_transformer_mixed_types.html" target="_blank" rel="noopener">scikit-learn example — Column Transformer with Mixed Types</a></li><li><a href="https://scikit-learn.org/stable/modules/impute.html" target="_blank" rel="noopener">scikit-learn — Imputation of missing values</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Add a missing-indicator for age: which argument of <code>SimpleImputer</code> does this?</li><li>What happens if you call <code>model.predict(new)</code> where <code>new</code> lacks the <code>floor</code> column?</li><li>Replace Ridge with <code>RandomForestRegressor</code>. Which preprocessing steps become unnecessary, and which are still needed?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <code>SimpleImputer(strategy="median", add_indicator=True)</code> appends a 0/1 column for rows that were missing. 2) An error: the ColumnTransformer needs every column it was fitted with. 3) Scaling and the log of area are unnecessary for trees; imputation (in older versions — recent scikit-learn trees can handle NaN) and encoding the text district are still needed.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 5 · Bài 5.3</span>
<h2>Pipeline và ColumnTransformer: tiền xử lý không thể rò rỉ</h2>
<p class="lead">Bài 5.1–5.2 dùng nhiều bước rời, mỗi bước một lần <code>fit</code>. Trong dự án thật, chuyện đó thành một mớ rối rất dễ sai. <strong>Pipeline</strong> của scikit-learn gói mọi bước và mô hình vào một đối tượng với một lần <code>fit</code> và <code>predict</code> duy nhất.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng tiền xử lý khác nhau cho các cột khác nhau bằng <code>ColumnTransformer</code>.</li><li>Nối tiền xử lý với mô hình trong một <code>Pipeline</code> và kiểm định chéo nó.</li><li>Dự đoán thẳng từ dòng thô, kể cả giá trị thiếu và giá trị chưa từng gặp.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Ta thêm các lỗ hổng thực tế vào dữ liệu căn hộ (thiếu 8% tuổi và 5% quận) và dựng một đối tượng làm tất cả:</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer, TransformedTargetRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler, FunctionTransformer

def make_apartments(n=600, seed=4):
    """Synthetic Hà Nội apartment listings (prices in billion VND)."""
    rng = np.random.default_rng(seed)
    base = {"Tay Ho": 75, "Cau Giay": 65, "Dong Da": 60, "Long Bien": 48, "Ha Dong": 40}  # million VND / m2
    district = rng.choice(list(base), size=n, p=[0.12, 0.25, 0.2, 0.18, 0.25])
    area = np.clip(rng.gamma(9, 8.5, n), 30, 200).round()
    bedrooms = np.clip((area / 35).round() + rng.integers(-1, 2, n), 1, 5).astype(int)
    age = rng.integers(0, 31, n)
    floor = rng.integers(1, 36, n)
    ppm2 = np.array([base[d] for d in district]) * (1 - 0.008 * age) + 0.15 * floor + rng.normal(0, 6, n)
    price = (area * ppm2 / 1000).round(2)
    return pd.DataFrame({"district": district, "area_m2": area, "bedrooms": bedrooms,
                         "age_years": age, "floor": floor, "price_bn": price})

apt = make_apartments()
rng = np.random.default_rng(0)
apt.loc[rng.random(len(apt)) &lt; 0.08, "age_years"] = np.nan      # real data have holes
apt.loc[rng.random(len(apt)) &lt; 0.05, "district"] = np.nan
X, y = apt.drop(columns="price_bn"), apt["price_bn"]

preprocess = ColumnTransformer([
    ("area", make_pipeline(FunctionTransformer(np.log, feature_names_out="one-to-one"), StandardScaler()),
     ["area_m2"]),
    ("num", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()),
     ["bedrooms", "age_years", "floor"]),
    ("cat", make_pipeline(SimpleImputer(strategy="most_frequent"), OneHotEncoder(handle_unknown="ignore")),
     ["district"]),
])
model = Pipeline([
    ("prep", preprocess),
    ("reg", TransformedTargetRegressor(regressor=Ridge(alpha=1.0), func=np.log, inverse_func=np.exp)),
])

# Every fold re-fits imputer, scaler and encoder on its own training part -&gt; no leakage
scores = -cross_val_score(model, X, y, cv=5, scoring="neg_mean_absolute_error")
print("5-fold MAE:", scores.round(3).tolist(), "mean =", round(scores.mean(), 3))

model.fit(X, y)
print(model.named_steps["prep"].get_feature_names_out().tolist())
new = pd.DataFrame([{"district": "Hoang Mai", "area_m2": 68, "bedrooms": 2, "age_years": np.nan, "floor": 12}])
print("prediction for a raw new listing:", model.predict(new).round(2))</code></pre>
<div class="out">5-fold MAE: [0.417, 0.405, 0.384, 0.411, 0.463] mean = 0.416
['area__area_m2', 'num__bedrooms', 'num__age_years', 'num__floor', 'cat__district_Cau Giay', 'cat__district_Dong Da', 'cat__district_Ha Dong', 'cat__district_Long Bien', 'cat__district_Tay Ho']
prediction for a raw new listing: [3.52]</div>
<p><strong>Cách dựng.</strong> <code>ColumnTransformer</code> nhận danh sách <em>(tên, bộ biến đổi, các cột)</em>: diện tích được log + chuẩn hoá; phòng ngủ, tuổi và tầng được điền trung vị + chuẩn hoá; quận được điền nhóm phổ biến nhất + one-hot. <code>make_pipeline</code> nối các bước trong từng nhánh. <code>Pipeline</code> bên ngoài đưa ma trận đã biến đổi vào hồi quy Ridge (mô hình tuyến tính có phạt nhỏ, Bài 7.1) được bọc trong bộ hồi quy mục tiêu log.</p>
<p><strong>Vì sao chặn được rò rỉ.</strong> <code>cross_val_score</code> nhân bản cả pipeline cho mỗi phần trong 5 phần và fit nó chỉ trên phần huấn luyện: trung vị tuổi, trung bình và độ lệch chuẩn của scaler, danh sách quận đều được học mà không nhìn phần kiểm định. Nếu bạn đã điền và chuẩn hoá toàn bộ dữ liệu trước, mỗi phần đã nhìn trộm dữ liệu kiểm định của chính nó. MAE trung bình 5 phần là 0,416 tỉ, kém hơn một chút so với 0,361 ở Bài 5.2 — dữ liệu giờ có giá trị thiếu, và trung bình 5 phần trên cả 600 dòng là một ước lượng khác (đáng tin hơn) so với một lần tách 150 dòng test. Cả hai hiệu ứng đều bình thường; chỉ so mô hình dưới cùng một quy trình.</p>
<p><strong>Vì sao hữu ích khi chạy thật.</strong> Sau <code>model.fit(X, y)</code>, pipeline đã fit có thể lưu thành một tệp (Bài 11.2). Một tin rao thô mới — quận “Hoang Mai” chưa từng gặp, tuổi bị thiếu — đi thẳng vào <code>predict</code> và nhận 3,52 tỉ: tuổi được điền bằng trung vị huấn luyện, quận lạ được mã hoá thành toàn số 0. <code>get_feature_names_out()</code> liệt kê 9 cột cuối cùng, nên bạn luôn truy được một hệ số về nguồn gốc của nó.</p>
<div class="formula"><span class="lbl">Khuôn mẫu dùng lại</span>preprocess = ColumnTransformer([(tên, các bước, các cột), …]) → model = Pipeline([("prep", preprocess), ("est", mô hình)]) → cross_val_score(model, X_thô, y) → model.fit(X_thô, y) → model.predict(dòng_thô_mới)</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chạy <code>fit_transform</code> trên toàn bộ dữ liệu “cho nhanh” rồi mới kiểm định chéo.</li><li>Quên một cột: mặc định ColumnTransformer <em>bỏ</em> các cột không liệt kê (<code>remainder="drop"</code>).</li><li>Code tiền xử lý trong notebook khác với trong ứng dụng chạy thật — hãy giao pipeline đã fit thay vào đó.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li><code>ColumnTransformer</code> đưa mỗi nhóm cột tới tiền xử lý riêng.</li><li><code>Pipeline</code> nối tiền xử lý và mô hình; fit và predict một lần.</li><li>Kiểm định chéo cả pipeline sẽ fit lại tiền xử lý cho từng phần → không rò rỉ.</li><li>Pipeline đã fit nhận dòng thô, tự xử lý giá trị thiếu và chưa gặp.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/compose.html" target="_blank" rel="noopener">scikit-learn — Pipeline và estimator tổng hợp</a></li><li><a href="https://scikit-learn.org/stable/auto_examples/compose/plot_column_transformer_mixed_types.html" target="_blank" rel="noopener">Ví dụ scikit-learn — Column Transformer với dữ liệu nhiều kiểu</a></li><li><a href="https://scikit-learn.org/stable/modules/impute.html" target="_blank" rel="noopener">scikit-learn — Điền giá trị thiếu</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Thêm cột chỉ báo thiếu cho tuổi: tham số nào của <code>SimpleImputer</code> làm việc này?</li><li>Chuyện gì xảy ra nếu gọi <code>model.predict(new)</code> mà <code>new</code> thiếu cột <code>floor</code>?</li><li>Thay Ridge bằng <code>RandomForestRegressor</code>. Bước tiền xử lý nào trở nên thừa, bước nào vẫn cần?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <code>SimpleImputer(strategy="median", add_indicator=True)</code> thêm một cột 0/1 cho các dòng bị thiếu. 2) Báo lỗi: ColumnTransformer cần mọi cột mà nó đã được fit. 3) Chuẩn hoá và log diện tích là thừa với cây; điền giá trị thiếu (ở bản cũ — cây trong scikit-learn bản mới xử lý được NaN) và mã hoá quận dạng chữ vẫn cần.</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Feature engineering|||Quiz — Chương 5: Xây dựng đặc trưng',
  'Quiz 8 câu: one-hot vs mã thứ tự, handle_unknown, chuẩn hoá theo train, mô hình nào cần chuẩn hoá, log cho quan hệ nhân, đặc trưng có sẵn lúc dự đoán, Pipeline/ColumnTransformer.', [
  Q('q1', 'Which encoding suits “district” for a linear model?|||Mã hoá nào hợp với “quận” cho mô hình tuyến tính?',
    ['One-hot|||One-hot', 'Integers 1, 2, 3 in alphabetical order|||Số 1, 2, 3 theo bảng chữ cái', 'Standard scaling|||Chuẩn hoá', 'Drop the column|||Bỏ cột'], 0,
    'District is nominal; one-hot avoids inventing an order.|||Quận là biến danh nghĩa; one-hot tránh bịa ra thứ tự.'),
  Q('q2', 'What does handle_unknown="ignore" do for an unseen category at prediction time?|||handle_unknown="ignore" làm gì với nhóm chưa gặp lúc dự đoán?',
    ['Encodes it as all zeros|||Mã hoá thành toàn số 0', 'Raises an error|||Báo lỗi', 'Adds a new column|||Thêm cột mới', 'Deletes the row|||Xoá dòng'], 0,
    'The row gets zeros in every one-hot column instead of crashing.|||Dòng nhận số 0 ở mọi cột one-hot thay vì làm sập.'),
  Q('q3', 'Where must StandardScaler learn its mean and std?|||StandardScaler phải học trung bình và độ lệch chuẩn ở đâu?',
    ['On the training data only|||Chỉ trên dữ liệu huấn luyện', 'On the test data|||Trên dữ liệu test', 'On train + test together|||Trên cả train lẫn test', 'On each new row separately|||Trên từng dòng mới riêng lẻ'], 0,
    'Statistics from test data would leak; the same transformation must be reused.|||Thống kê từ test sẽ rò rỉ; phải dùng lại cùng phép biến đổi.'),
  Q('q4', 'Which model does NOT need feature scaling?|||Mô hình nào KHÔNG cần chuẩn hoá đặc trưng?',
    ['Random forest|||Rừng ngẫu nhiên', 'k-nearest neighbours|||k láng giềng gần nhất', 'k-means|||k-means', 'Ridge regression|||Hồi quy Ridge'], 0,
    'Trees split on thresholds, unaffected by monotone rescaling.|||Cây chia theo ngưỡng, không bị ảnh hưởng bởi đổi thang đơn điệu.'),
  Q('q5', 'Price ≈ area × price-per-m². Which transform makes this linear?|||Giá ≈ diện tích × giá/m². Biến đổi nào làm nó tuyến tính?',
    ['Logarithm|||Logarit', 'Square|||Bình phương', 'One-hot|||One-hot', 'Min–max scaling|||Chuẩn hoá min–max'], 0,
    'log turns products into sums.|||log biến tích thành tổng.'),
  Q('q6', 'Which feature is NOT allowed when predicting a listing’s price at listing time?|||Đặc trưng nào KHÔNG được dùng khi dự đoán giá lúc đăng tin?',
    ['Days the listing stayed on the market|||Số ngày tin đã rao', 'Area|||Diện tích', 'District|||Quận', 'Building age|||Tuổi toà nhà'], 0,
    'Days on market is only known later.|||Số ngày rao chỉ biết sau này.'),
  Q('q7', 'Main benefit of cross-validating a whole Pipeline?|||Lợi ích chính của kiểm định chéo cả Pipeline?',
    ['Preprocessing is refitted inside each fold, preventing leakage|||Tiền xử lý được fit lại trong từng phần, tránh rò rỉ', 'It always increases accuracy|||Luôn tăng độ chính xác', 'It removes the need for a test set|||Bỏ được tập test', 'It makes training faster|||Huấn luyện nhanh hơn'], 0,
    'Imputers, scalers and encoders learn only from each fold’s training part.|||Bộ điền, scaler và encoder chỉ học từ phần huấn luyện của từng phần.'),
  Q('q8', 'By default, what does ColumnTransformer do with columns you did not list?|||Mặc định ColumnTransformer làm gì với cột bạn không liệt kê?',
    ['Drops them|||Bỏ chúng', 'Passes them through unchanged|||Giữ nguyên', 'Scales them|||Chuẩn hoá chúng', 'Raises an error|||Báo lỗi'], 0,
    'remainder="drop" is the default; set remainder="passthrough" to keep them.|||remainder="drop" là mặc định; đặt remainder="passthrough" để giữ.'),
]);

const ch5 = {
  title: 'Chapter 5 — Feature engineering and pipelines|||Chương 5 — Xây dựng đặc trưng và pipeline',
  description: 'Mã hoá one-hot/thứ tự, chuẩn hoá theo tập train, tạo đặc trưng từ hiểu biết nghiệp vụ (thời gian, tỉ lệ, tổng hợp, tương tác, log), Pipeline + ColumnTransformer chống rò rỉ.',
  lessons: [c51, c52, c53, q5],
};


// ───────────────────────────── Chương 6 — Quy trình học có giám sát ─────────────────────────────
const c61 = L('dsi201-ts-6-1',
  '6.1 — Train, validation and test sets; baselines and overfitting|||6.1 — Tập train, validation và test; baseline và quá khớp',
  'Vì sao cần ba tập; chia 60/20/20 có phân tầng (stratify); baseline lớp đa số 0,623; chọn k của kNN trên tập validation; quá khớp (train 1,000 nhưng không hơn); chạm tập test đúng một lần.',
  `<span class="eyebrow">DSI201 · Chapter 6 · Lesson 6.1</span>
<h2>Train, validation and test sets; baselines and overfitting</h2>
<p class="lead">A model is useful only if it works on data it has never seen. Everything in this chapter is about estimating that future performance honestly.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the separate roles of the training, validation and test sets.</li><li>Split data with stratification and compare against a baseline.</li><li>Recognise overfitting and underfitting from train vs. validation scores.</li></ul>
<h3>📖 Lecture</h3>
<p>Supervised learning learns a function from examples with known answers (labels). Three sets play three roles:</p>
<ul>
<li><strong>Training set</strong> — the model learns its parameters here.</li>
<li><strong>Validation set</strong> — you compare models and choose settings (hyper-parameters such as k, tree depth, features). Because you make choices on it, its score becomes slightly optimistic.</li>
<li><strong>Test set</strong> — locked away until the very end and used <em>once</em>, to report the expected performance of the final, chosen model.</li>
</ul>
<p>We use the breast-cancer dataset bundled with scikit-learn (569 tumours described by 30 measurements from images; label benign or malignant) and the k-nearest-neighbours classifier, which labels a new case by a majority vote of its k most similar training cases.</p>
<pre><code class="language-python">from sklearn.datasets import load_breast_cancer
from sklearn.dummy import DummyClassifier
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True)      # 569 tumours, 30 features, 1 = benign
print("class shares:", (y == 0).mean().round(3), (y == 1).mean().round(3))

# 60% train / 20% validation / 20% test, keeping the class shares in every part
X_tmp, X_test, y_tmp, y_test = train_test_split(X, y, test_size=0.20, stratify=y, random_state=0)
X_train, X_val, y_train, y_val = train_test_split(X_tmp, y_tmp, test_size=0.25, stratify=y_tmp, random_state=0)
print("sizes:", len(X_train), len(X_val), len(X_test))

base = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
print("baseline val accuracy:", round(base.score(X_val, y_val), 3))

# Use the VALIDATION set to choose the number of neighbours k
for k in [1, 5, 15, 51]:
    m = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=k)).fit(X_train, y_train)
    print(f"k={k:2d}  train acc={m.score(X_train, y_train):.3f}  val acc={m.score(X_val, y_val):.3f}")

# Refit the chosen model on train+validation, then touch the TEST set exactly once
final = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=15)).fit(X_tmp, y_tmp)
print("final test accuracy (k=15):", round(final.score(X_test, y_test), 3))</code></pre>
<div class="out">class shares: 0.373 0.627
sizes: 341 114 114
baseline val accuracy: 0.623
k= 1  train acc=1.000  val acc=0.982
k= 5  train acc=0.985  val acc=0.974
k=15  train acc=0.956  val acc=0.982
k=51  train acc=0.927  val acc=0.965
final test accuracy (k=15): 0.956</div>
<p><strong>Reading the output.</strong> <code>stratify=y</code> kept the 37/63 class mix in every part. The majority-class baseline already gets 0.623 — any model must clearly beat that. With k = 1 the model reaches perfect training accuracy: each training point is its own nearest neighbour, so it simply memorises. That perfect 1.000 is not evidence of quality; only the validation score is. k = 1 and k = 15 tie on validation (0.982); we prefer k = 15, the smoother model whose training and validation scores are close, because it is less sensitive to individual noisy cases. k = 51 is too smooth (both scores drop) — <strong>underfitting</strong>. After choosing, we refit on train + validation and evaluate once on the test set: 0.956. That lower number is the honest estimate; the validation scores were slightly optimistic because we picked the winner on them.</p>
<div class="formula"><span class="lbl">Diagnosis from two scores</span>train high, validation much lower → overfitting (too complex / too little data) · both low and close → underfitting (too simple / weak features) · both high and close → good fit</div>
<p><strong>Splitting rules.</strong> Use <code>stratify</code> for classification, especially with rare classes. Split by <strong>time</strong> when the model will predict the future (train on January–August, validate on September, test on October), and by <strong>group</strong> when rows from the same customer or patient must not appear on both sides. A random split in those cases leaks information (Lesson 6.3).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reporting the training score, or the best validation score after trying 50 models, as the expected performance.</li><li>Looking at the test set repeatedly and adjusting the model — it silently becomes a validation set.</li><li>Random splits for time-ordered data or for data with repeated individuals.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Train to learn, validate to choose, test once to report.</li><li>Always compare with a baseline (majority class or mean).</li><li>A large train–validation gap means overfitting; both low means underfitting.</li><li>Stratify classes; split by time or group when the use case demands it.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets" target="_blank" rel="noopener">Google ML Crash Course — Dividing the original dataset</a></li><li><a href="https://scikit-learn.org/stable/modules/cross_validation.html" target="_blank" rel="noopener">scikit-learn — Cross-validation: evaluating estimator performance</a></li><li><a href="https://scikit-learn.org/stable/modules/neighbors.html" target="_blank" rel="noopener">scikit-learn — Nearest neighbors</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Train accuracy 0.99, validation 0.71. Diagnose and suggest two remedies.</li><li>You predict next month's sales per store from 3 years of monthly data. How should you split?</li><li>Why did we refit on train + validation before testing, and why is that allowed?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Overfitting. Remedies: a simpler model or stronger regularisation (larger k, shallower trees, larger penalty), more data, fewer noisy features. 2) By time: e.g. train on the first 30 months, validate on the next 3, test on the last 3; never let future months into training. 3) More data usually gives a slightly better model; it is allowed because all choices were already fixed, and the test set is still untouched.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 6 · Bài 6.1</span>
<h2>Tập train, validation và test; baseline và quá khớp</h2>
<p class="lead">Mô hình chỉ có ích nếu nó chạy tốt trên dữ liệu chưa từng thấy. Toàn bộ chương này là về việc ước lượng trung thực hiệu năng tương lai đó.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích vai trò riêng của tập huấn luyện, kiểm định (validation) và kiểm tra (test).</li><li>Chia dữ liệu có phân tầng và so với baseline.</li><li>Nhận ra quá khớp (overfitting) và chưa khớp (underfitting) từ điểm train so với validation.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Học có giám sát học một hàm từ các ví dụ đã biết đáp án (nhãn). Ba tập đóng ba vai:</p>
<ul>
<li><strong>Tập huấn luyện</strong> — mô hình học tham số ở đây.</li>
<li><strong>Tập kiểm định (validation)</strong> — bạn so sánh mô hình và chọn thiết lập (siêu tham số như k, độ sâu cây, đặc trưng). Vì bạn ra quyết định trên nó, điểm của nó hơi lạc quan.</li>
<li><strong>Tập kiểm tra (test)</strong> — khoá kín tới cuối cùng và dùng <em>một lần</em>, để báo hiệu năng kỳ vọng của mô hình cuối cùng đã chọn.</li>
</ul>
<p>Ta dùng bộ dữ liệu ung thư vú có sẵn trong scikit-learn (569 khối u mô tả bằng 30 số đo từ ảnh; nhãn lành tính hay ác tính) và bộ phân loại k láng giềng gần nhất, gán nhãn cho ca mới bằng biểu quyết đa số của k ca huấn luyện giống nó nhất.</p>
<pre><code class="language-python">from sklearn.datasets import load_breast_cancer
from sklearn.dummy import DummyClassifier
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True)      # 569 tumours, 30 features, 1 = benign
print("class shares:", (y == 0).mean().round(3), (y == 1).mean().round(3))

# 60% train / 20% validation / 20% test, keeping the class shares in every part
X_tmp, X_test, y_tmp, y_test = train_test_split(X, y, test_size=0.20, stratify=y, random_state=0)
X_train, X_val, y_train, y_val = train_test_split(X_tmp, y_tmp, test_size=0.25, stratify=y_tmp, random_state=0)
print("sizes:", len(X_train), len(X_val), len(X_test))

base = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
print("baseline val accuracy:", round(base.score(X_val, y_val), 3))

# Use the VALIDATION set to choose the number of neighbours k
for k in [1, 5, 15, 51]:
    m = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=k)).fit(X_train, y_train)
    print(f"k={k:2d}  train acc={m.score(X_train, y_train):.3f}  val acc={m.score(X_val, y_val):.3f}")

# Refit the chosen model on train+validation, then touch the TEST set exactly once
final = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=15)).fit(X_tmp, y_tmp)
print("final test accuracy (k=15):", round(final.score(X_test, y_test), 3))</code></pre>
<div class="out">class shares: 0.373 0.627
sizes: 341 114 114
baseline val accuracy: 0.623
k= 1  train acc=1.000  val acc=0.982
k= 5  train acc=0.985  val acc=0.974
k=15  train acc=0.956  val acc=0.982
k=51  train acc=0.927  val acc=0.965
final test accuracy (k=15): 0.956</div>
<p><strong>Đọc output.</strong> <code>stratify=y</code> giữ cơ cấu lớp 37/63 ở mọi phần. Baseline lớp đa số đã đạt 0,623 — mô hình nào cũng phải vượt rõ con số đó. Với k = 1 mô hình đạt độ chính xác huấn luyện tuyệt đối: mỗi điểm huấn luyện là láng giềng gần nhất của chính nó, nên nó chỉ học thuộc. Con số 1,000 đó không chứng minh chất lượng; chỉ điểm validation mới nói lên điều đó. k = 1 và k = 15 hoà nhau trên validation (0,982); ta chọn k = 15, mô hình mượt hơn có điểm train và validation sát nhau, vì nó ít nhạy với từng ca nhiễu. k = 51 quá mượt (cả hai điểm cùng giảm) — <strong>chưa khớp</strong>. Sau khi chọn, ta fit lại trên train + validation và đánh giá một lần trên test: 0,956. Con số thấp hơn đó là ước lượng trung thực; điểm validation hơi lạc quan vì ta đã chọn người thắng dựa trên chúng.</p>
<div class="formula"><span class="lbl">Chẩn đoán từ hai điểm số</span>train cao, validation thấp hơn nhiều → quá khớp (quá phức tạp / quá ít dữ liệu) · cả hai thấp và sát nhau → chưa khớp (quá đơn giản / đặc trưng yếu) · cả hai cao và sát nhau → khớp tốt</div>
<p><strong>Quy tắc chia.</strong> Dùng <code>stratify</code> cho bài toán phân loại, nhất là khi có lớp hiếm. Chia theo <strong>thời gian</strong> khi mô hình sẽ dự đoán tương lai (train tháng 1–8, validation tháng 9, test tháng 10), và theo <strong>nhóm</strong> khi các dòng của cùng một khách hay bệnh nhân không được nằm ở cả hai phía. Chia ngẫu nhiên trong những trường hợp đó làm rò rỉ thông tin (Bài 6.3).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Báo điểm huấn luyện, hoặc điểm validation tốt nhất sau khi thử 50 mô hình, như hiệu năng kỳ vọng.</li><li>Nhìn tập test nhiều lần rồi chỉnh mô hình — nó âm thầm biến thành tập validation.</li><li>Chia ngẫu nhiên với dữ liệu có thứ tự thời gian hoặc có cá nhân lặp lại.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Train để học, validation để chọn, test một lần để báo cáo.</li><li>Luôn so với baseline (lớp đa số hoặc trung bình).</li><li>Khoảng cách train–validation lớn là quá khớp; cả hai thấp là chưa khớp.</li><li>Phân tầng theo lớp; chia theo thời gian hay nhóm khi bài toán đòi hỏi.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets" target="_blank" rel="noopener">Google ML Crash Course — Chia bộ dữ liệu gốc</a></li><li><a href="https://scikit-learn.org/stable/modules/cross_validation.html" target="_blank" rel="noopener">scikit-learn — Kiểm định chéo: đánh giá hiệu năng mô hình</a></li><li><a href="https://scikit-learn.org/stable/modules/neighbors.html" target="_blank" rel="noopener">scikit-learn — Láng giềng gần nhất</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Độ chính xác train 0,99, validation 0,71. Chẩn đoán và đề xuất hai cách khắc phục.</li><li>Bạn dự đoán doanh số tháng tới của mỗi cửa hàng từ 3 năm dữ liệu theo tháng. Nên chia thế nào?</li><li>Vì sao ta fit lại trên train + validation trước khi test, và vì sao làm vậy được phép?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Quá khớp. Khắc phục: mô hình đơn giản hơn hoặc chính quy hoá mạnh hơn (k lớn hơn, cây nông hơn, phạt lớn hơn), thêm dữ liệu, bớt đặc trưng nhiễu. 2) Theo thời gian: vd train 30 tháng đầu, validation 3 tháng tiếp, test 3 tháng cuối; không bao giờ để tháng tương lai lọt vào huấn luyện. 3) Nhiều dữ liệu hơn thường cho mô hình tốt hơn một chút; được phép vì mọi lựa chọn đã cố định, và tập test vẫn chưa bị chạm.</p></div>`);

const c62 = L('dsi201-ts-6-2',
  '6.2 — Cross-validation and hyper-parameter tuning|||6.2 — Kiểm định chéo và tinh chỉnh siêu tham số',
  'Một lần chia cho R² dao động 0,34–0,50; k-fold cho trung bình 0,42 ± 0,05; GridSearchCV chọn k = 10 cho kNN hồi quy bằng CV trên phần train, test MAE 45,1; nested CV, TimeSeriesSplit, GroupKFold.',
  `<span class="eyebrow">DSI201 · Chapter 6 · Lesson 6.2</span>
<h2>Cross-validation and hyper-parameter tuning</h2>
<p class="lead">With small and medium datasets, one validation split is a noisy judge. Cross-validation reuses the data so that every row is used for validation exactly once — and gives you an error bar for free.</p>
<h3>🎯 Objectives</h3>
<ul><li>See how much a single split's score varies.</li><li>Run k-fold cross-validation and report mean ± standard deviation.</li><li>Tune hyper-parameters with <code>GridSearchCV</code> and keep a clean test set.</li></ul>
<h3>📖 Lecture</h3>
<pre><code class="language-python">import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.model_selection import GridSearchCV, KFold, cross_val_score, train_test_split
from sklearn.neighbors import KNeighborsRegressor
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_diabetes(return_X_y=True)

# 1) One split is a noisy estimate: the same model, 10 different random test sets
scores = []
for seed in range(10):
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=seed)
    scores.append(Ridge(alpha=1.0).fit(Xtr, ytr).score(Xte, yte))     # R^2 on the test split
print("R2 over 10 single splits:", np.round(scores, 2), "range", round(min(scores), 2), "to", round(max(scores), 2))

# 2) K-fold cross-validation averages over 5 validation folds
cv = KFold(n_splits=5, shuffle=True, random_state=0)
cvs = cross_val_score(Ridge(alpha=1.0), X, y, cv=cv, scoring="r2")
print("5-fold R2:", cvs.round(3), "mean =", round(cvs.mean(), 3), "sd =", round(cvs.std(), 3))

# 3) Tune a hyper-parameter with cross-validation on the training part only
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
pipe = make_pipeline(StandardScaler(), KNeighborsRegressor())
grid = GridSearchCV(pipe, {"kneighborsregressor__n_neighbors": [3, 5, 10, 20, 40]},
                    cv=cv, scoring="neg_mean_absolute_error")
grid.fit(Xtr, ytr)
for k, s in zip(grid.cv_results_["param_kneighborsregressor__n_neighbors"], grid.cv_results_["mean_test_score"]):
    print(f"k={k:2d}  CV MAE={-s:.1f}")
print("best:", grid.best_params_, "| test MAE of refitted best model:",
      round(-grid.score(Xte, yte), 1))</code></pre>
<div class="out">R2 over 10 single splits: [0.34 0.39 0.41 0.36 0.41 0.43 0.43 0.4  0.46 0.5 ] range 0.34 to 0.5
5-fold R2: [0.341 0.41  0.447 0.407 0.497] mean = 0.42 sd = 0.051
k= 3  CV MAE=52.3
k= 5  CV MAE=49.5
k=10  CV MAE=48.0
k=20  CV MAE=48.1
k=40  CV MAE=49.3
best: {'kneighborsregressor__n_neighbors': 10} | test MAE of refitted best model: 45.1</div>
<p><strong>1. One split is noisy.</strong> The same Ridge model on the diabetes data scored R² anywhere from 0.34 to 0.50 depending only on which 20% landed in the test set. If you compared two models on one split, the “winner” might simply have been lucky.</p>
<p><strong>2. K-fold cross-validation.</strong> Split the data into K folds (here 5). Train on 4, validate on the fifth; rotate until each fold has been the validation fold once; average. The output gives 0.42 with a standard deviation of 0.05 across folds — report both. Larger K uses more data for training each time (less pessimistic) but costs K fits; K = 5 or 10 is standard. <code>shuffle=True</code> with a fixed <code>random_state</code> makes it reproducible.</p>
<div class="formula"><span class="lbl">K-fold estimate</span>CV score = (1/K) ∑<sub>k=1..K</sub> score(model trained without fold k, evaluated on fold k)</div>
<p><strong>3. Tuning.</strong> A <strong>hyper-parameter</strong> is a setting you choose rather than the model learning it (k in kNN, depth of a tree, the penalty α in Ridge). <code>GridSearchCV</code> tries each value with cross-validation <em>on the training part</em>, picks the best mean score, and refits the best pipeline on the whole training part. Here k = 10 had the lowest CV MAE (48.0; k = 20 was almost identical at 48.1). The held-out test MAE of the refitted model is 45.1 — the honest number to report. Note the grid's step names: <code>kneighborsregressor__n_neighbors</code> is “step name, two underscores, parameter”.</p>
<p><strong>Variants for special data.</strong> <code>StratifiedKFold</code> (default for classifiers) keeps class shares; <code>TimeSeriesSplit</code> always validates on later periods than it trains on; <code>GroupKFold</code> keeps all rows of one customer in the same fold. To estimate the performance of the <em>whole tuning procedure</em> without a separate test set, use <strong>nested cross-validation</strong>: an outer CV loop around GridSearchCV. For large grids, <code>RandomizedSearchCV</code> samples settings instead of trying them all.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reporting <code>grid.best_score_</code> as the final performance — it is the maximum of many noisy scores, so it is optimistic.</li><li>Tuning on the test set (“I tried k on the test data and kept the best”).</li><li>Treating a 0.005 difference as meaningful when the fold standard deviation is 0.05.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Single-split scores vary a lot; K-fold CV averages over K validation folds.</li><li>Report mean ± standard deviation across folds.</li><li><code>GridSearchCV</code> tunes with CV on training data and refits the winner; evaluate it once on the test set.</li><li>Use stratified, time-series or group splitting to match the data.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/grid_search.html" target="_blank" rel="noopener">scikit-learn — Tuning the hyper-parameters of an estimator</a></li><li><a href="https://scikit-learn.org/stable/auto_examples/model_selection/plot_nested_cross_validation_iris.html" target="_blank" rel="noopener">scikit-learn example — Nested versus non-nested cross-validation</a></li><li><a href="https://www.youtube.com/watch?v=fSytzGwwBVw" target="_blank" rel="noopener">StatQuest — Machine Learning Fundamentals: Cross Validation</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Model A: CV accuracy 0.871 ± 0.030; model B: 0.866 ± 0.028. Which would you choose, and why?</li><li>How many model fits does <code>GridSearchCV</code> with 5 values and 5 folds perform, including the final refit?</li><li>Why is <code>TimeSeriesSplit</code> needed for forecasting daily orders?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) The difference (0.005) is far smaller than the fold spread; they are effectively tied — choose the simpler, faster or more interpretable one. 2) 5 × 5 = 25 fits plus 1 refit = 26. 3) A random K-fold would train on future days and validate on past days, which is impossible in production and gives an optimistic score; TimeSeriesSplit always validates on later days.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 6 · Bài 6.2</span>
<h2>Kiểm định chéo và tinh chỉnh siêu tham số</h2>
<p class="lead">Với bộ dữ liệu nhỏ và vừa, một lần chia validation là một trọng tài nhiễu. Kiểm định chéo dùng lại dữ liệu để mỗi dòng được dùng làm validation đúng một lần — và cho bạn thanh sai số miễn phí.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Thấy điểm của một lần chia dao động nhiều thế nào.</li><li>Chạy kiểm định chéo k phần và báo trung bình ± độ lệch chuẩn.</li><li>Tinh chỉnh siêu tham số bằng <code>GridSearchCV</code> và giữ tập test sạch.</li></ul>
<h3>📖 Bài giảng</h3>
<pre><code class="language-python">import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.model_selection import GridSearchCV, KFold, cross_val_score, train_test_split
from sklearn.neighbors import KNeighborsRegressor
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_diabetes(return_X_y=True)

# 1) One split is a noisy estimate: the same model, 10 different random test sets
scores = []
for seed in range(10):
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=seed)
    scores.append(Ridge(alpha=1.0).fit(Xtr, ytr).score(Xte, yte))     # R^2 on the test split
print("R2 over 10 single splits:", np.round(scores, 2), "range", round(min(scores), 2), "to", round(max(scores), 2))

# 2) K-fold cross-validation averages over 5 validation folds
cv = KFold(n_splits=5, shuffle=True, random_state=0)
cvs = cross_val_score(Ridge(alpha=1.0), X, y, cv=cv, scoring="r2")
print("5-fold R2:", cvs.round(3), "mean =", round(cvs.mean(), 3), "sd =", round(cvs.std(), 3))

# 3) Tune a hyper-parameter with cross-validation on the training part only
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
pipe = make_pipeline(StandardScaler(), KNeighborsRegressor())
grid = GridSearchCV(pipe, {"kneighborsregressor__n_neighbors": [3, 5, 10, 20, 40]},
                    cv=cv, scoring="neg_mean_absolute_error")
grid.fit(Xtr, ytr)
for k, s in zip(grid.cv_results_["param_kneighborsregressor__n_neighbors"], grid.cv_results_["mean_test_score"]):
    print(f"k={k:2d}  CV MAE={-s:.1f}")
print("best:", grid.best_params_, "| test MAE of refitted best model:",
      round(-grid.score(Xte, yte), 1))</code></pre>
<div class="out">R2 over 10 single splits: [0.34 0.39 0.41 0.36 0.41 0.43 0.43 0.4  0.46 0.5 ] range 0.34 to 0.5
5-fold R2: [0.341 0.41  0.447 0.407 0.497] mean = 0.42 sd = 0.051
k= 3  CV MAE=52.3
k= 5  CV MAE=49.5
k=10  CV MAE=48.0
k=20  CV MAE=48.1
k=40  CV MAE=49.3
best: {'kneighborsregressor__n_neighbors': 10} | test MAE of refitted best model: 45.1</div>
<p><strong>1. Một lần chia là nhiễu.</strong> Cùng một mô hình Ridge trên dữ liệu diabetes cho R² từ 0,34 tới 0,50, chỉ tuỳ 20% nào rơi vào tập test. Nếu so hai mô hình trên một lần chia, “người thắng” có thể chỉ gặp may.</p>
<p><strong>2. Kiểm định chéo K phần.</strong> Chia dữ liệu thành K phần (ở đây 5). Huấn luyện trên 4, kiểm định trên phần thứ năm; xoay vòng tới khi mỗi phần đã làm validation một lần; lấy trung bình. Output cho 0,42 với độ lệch chuẩn 0,05 giữa các phần — báo cả hai. K lớn hơn dùng nhiều dữ liệu hơn để huấn luyện mỗi lần (bớt bi quan) nhưng tốn K lần fit; K = 5 hoặc 10 là chuẩn. <code>shuffle=True</code> với <code>random_state</code> cố định giúp tái lập được.</p>
<div class="formula"><span class="lbl">Ước lượng K phần</span>Điểm CV = (1/K) ∑<sub>k=1..K</sub> điểm(mô hình huấn luyện không có phần k, đánh giá trên phần k)</div>
<p><strong>3. Tinh chỉnh.</strong> <strong>Siêu tham số</strong> là thiết lập do bạn chọn chứ mô hình không tự học (k trong kNN, độ sâu cây, mức phạt α của Ridge). <code>GridSearchCV</code> thử từng giá trị bằng kiểm định chéo <em>trên phần huấn luyện</em>, chọn trung bình tốt nhất, rồi fit lại pipeline tốt nhất trên toàn phần huấn luyện. Ở đây k = 10 có CV MAE thấp nhất (48,0; k = 20 gần như bằng, 48,1). MAE trên test giữ lại của mô hình fit lại là 45,1 — con số trung thực để báo cáo. Để ý tên trong lưới: <code>kneighborsregressor__n_neighbors</code> là “tên bước, hai dấu gạch dưới, tên tham số”.</p>
<p><strong>Biến thể cho dữ liệu đặc biệt.</strong> <code>StratifiedKFold</code> (mặc định cho bộ phân loại) giữ tỉ lệ lớp; <code>TimeSeriesSplit</code> luôn kiểm định trên giai đoạn sau giai đoạn huấn luyện; <code>GroupKFold</code> giữ mọi dòng của một khách trong cùng một phần. Muốn ước lượng hiệu năng của <em>cả quy trình tinh chỉnh</em> mà không có tập test riêng, dùng <strong>kiểm định chéo lồng nhau</strong> (nested CV): một vòng CV bên ngoài bao quanh GridSearchCV. Với lưới lớn, <code>RandomizedSearchCV</code> lấy mẫu thiết lập thay vì thử tất cả.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Báo <code>grid.best_score_</code> làm hiệu năng cuối cùng — nó là giá trị lớn nhất của nhiều điểm nhiễu, nên lạc quan.</li><li>Tinh chỉnh trên tập test (“tôi thử k trên dữ liệu test và giữ cái tốt nhất”).</li><li>Coi chênh lệch 0,005 là có ý nghĩa khi độ lệch chuẩn giữa các phần là 0,05.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Điểm một lần chia dao động nhiều; CV K phần lấy trung bình qua K phần kiểm định.</li><li>Báo trung bình ± độ lệch chuẩn giữa các phần.</li><li><code>GridSearchCV</code> tinh chỉnh bằng CV trên dữ liệu huấn luyện và fit lại người thắng; đánh giá nó một lần trên test.</li><li>Dùng cách chia phân tầng, chuỗi thời gian hay theo nhóm cho hợp dữ liệu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/grid_search.html" target="_blank" rel="noopener">scikit-learn — Tinh chỉnh siêu tham số của estimator</a></li><li><a href="https://scikit-learn.org/stable/auto_examples/model_selection/plot_nested_cross_validation_iris.html" target="_blank" rel="noopener">Ví dụ scikit-learn — Kiểm định chéo lồng nhau và không lồng nhau</a></li><li><a href="https://www.youtube.com/watch?v=fSytzGwwBVw" target="_blank" rel="noopener">StatQuest — Machine Learning Fundamentals: Cross Validation</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Mô hình A: độ chính xác CV 0,871 ± 0,030; mô hình B: 0,866 ± 0,028. Bạn chọn cái nào, vì sao?</li><li><code>GridSearchCV</code> với 5 giá trị và 5 phần thực hiện bao nhiêu lần fit, tính cả lần fit lại cuối?</li><li>Vì sao cần <code>TimeSeriesSplit</code> để dự báo số đơn mỗi ngày?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Chênh lệch (0,005) nhỏ hơn nhiều so với độ phân tán giữa các phần; coi như hoà — chọn cái đơn giản, nhanh hoặc dễ diễn giải hơn. 2) 5 × 5 = 25 lần fit cộng 1 lần fit lại = 26. 3) K phần ngẫu nhiên sẽ huấn luyện trên ngày tương lai và kiểm định trên ngày quá khứ, điều bất khả khi chạy thật và cho điểm lạc quan; TimeSeriesSplit luôn kiểm định trên các ngày sau.</p></div>`);

const c63 = L('dsi201-ts-6-3',
  '6.3 — Data leakage: why too-good results are usually wrong|||6.3 — Rò rỉ dữ liệu: vì sao kết quả quá đẹp thường là sai',
  'Ba loại rò rỉ: tiền xử lý/chọn đặc trưng ngoài CV (dữ liệu nhiễu thuần cho 0,85 thay vì 0,48), rò rỉ mục tiêu (cột voucher_sent cho 0,971), rò rỉ thời gian/nhóm; danh sách kiểm phát hiện.',
  `<span class="eyebrow">DSI201 · Chapter 6 · Lesson 6.3</span>
<h2>Data leakage: why too-good results are usually wrong</h2>
<p class="lead"><strong>Leakage</strong> happens when information that will not be available at prediction time sneaks into training or evaluation. The model looks brilliant in the notebook and fails in production. It is the most common serious error in student and industry projects alike.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise preprocessing leakage, target leakage and time/group leakage.</li><li>Reproduce a leak on pure noise and fix it with a pipeline.</li><li>Apply a checklist that catches leaks before the demo.</li></ul>
<h3>📖 Lecture</h3>
<pre><code class="language-python">import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline

# Pure noise: 100 samples, 5,000 random features, random labels -&gt; honest accuracy must be ~0.5
rng = np.random.default_rng(0)
X = rng.normal(size=(100, 5000))
y = rng.integers(0, 2, size=100)

# WRONG: choose the 20 "best" features using ALL rows, then cross-validate
X_sel = SelectKBest(f_classif, k=20).fit_transform(X, y)
wrong = cross_val_score(LogisticRegression(max_iter=1000), X_sel, y, cv=5).mean()

# RIGHT: feature selection is a step INSIDE the pipeline, refitted on each training fold
pipe = make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression(max_iter=1000))
right = cross_val_score(pipe, X, y, cv=5).mean()
print(f"selection outside CV: {wrong:.2f}   selection inside CV: {right:.2f}")

# Target leakage: a column that is created AFTER the outcome
late = rng.random(1000) &lt; 0.15
voucher_sent = np.where(late, rng.random(1000) &lt; 0.95, rng.random(1000) &lt; 0.02)  # vouchers go to late orders
hour = rng.integers(8, 23, 1000)
Xl = np.column_stack([hour, voucher_sent])
acc = cross_val_score(LogisticRegression(), Xl, late, cv=5).mean()
acc_h = cross_val_score(LogisticRegression(), hour.reshape(-1, 1), late, cv=5).mean()
print(f"with voucher_sent: {acc:.3f}   hour only: {acc_h:.3f}   (base rate on-time = {1 - late.mean():.3f})")</code></pre>
<div class="out">selection outside CV: 0.85   selection inside CV: 0.48
with voucher_sent: 0.971   hour only: 0.827   (base rate on-time = 0.827)</div>
<p><strong>Leak 1 — preprocessing outside cross-validation.</strong> The data are pure noise: 5,000 random features and random labels, so no model can truly beat 50%. Selecting the 20 features most correlated with the label <em>using all 100 rows</em>, and only then cross-validating, gives 0.85 “accuracy”. Among 5,000 random columns some correlate with the labels by chance — including the labels of the rows later used for validation. When the selection is a step inside the pipeline, each fold selects using its training rows only, and the honest result appears: 0.48, i.e. chance. The same leak, smaller, happens with scaling, imputation, target encoding, oversampling or PCA fitted before the split. Rule: <em>anything that learns from data goes inside the pipeline</em> (Lesson 5.3).</p>
<p><strong>Leak 2 — target leakage.</strong> A column that is a consequence of the outcome. Our voucher is sent <em>because</em> the order was late, so <code>voucher_sent</code> “predicts” lateness with 0.971 accuracy. At order time the voucher does not exist yet. Without it, the hour of day alone gets 0.827 — exactly the base rate, meaning hour carries no signal in this simulated data. Real examples: “refund amount” to predict complaints, “discharge diagnosis” to predict admission, “account closed date” to predict churn.</p>
<p><strong>Leak 3 — time and group leakage.</strong> Random splits of time-ordered data let the model learn from the future (yesterday's price predicts today's suspiciously well when tomorrow's is in training). Rows of the same patient, customer or photo-session on both sides of the split let the model recognise the individual instead of learning the pattern. Use <code>TimeSeriesSplit</code> or <code>GroupKFold</code> (Lesson 6.2).</p>
<div class="formula"><span class="lbl">Leakage checklist</span>For every feature: when is it known, and by whom? · Is all fitting (impute, scale, select, encode, resample) inside the pipeline? · Does the split respect time and groups? · Is the score suspiciously high? Which single feature explains most of it?</div>
<p>A very high score, or one feature with enormous importance (Lesson 10.1), is a reason to investigate before celebrating.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>“I normalised the dataset first to make things easier.”</li><li>Using IDs or timestamps that encode the label (e.g. late orders were assigned a special ID range).</li><li>Oversampling the minority class before splitting, so copies of the same row land in train and validation.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Leakage = information unavailable at prediction time used in training or evaluation.</li><li>Fit every data-dependent step inside the cross-validated pipeline.</li><li>Remove features created after the outcome.</li><li>Split by time and by group when the use case requires it; distrust results that look too good.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/common_pitfalls.html" target="_blank" rel="noopener">scikit-learn — Common pitfalls and recommended practices (data leakage)</a></li><li><a href="https://www.kaggle.com/code/alexisbcook/data-leakage" target="_blank" rel="noopener">Kaggle Learn — Data Leakage (Intermediate Machine Learning)</a></li><li><a href="https://developers.google.com/machine-learning/guides/rules-of-ml" target="_blank" rel="noopener">Google — Rules of Machine Learning (training–serving skew)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Which features leak when predicting, at application time, whether a loan will default: (a) applicant income, (b) number of late payments on this loan, (c) loan amount, (d) collections agency assigned?</li><li>A colleague's model of hospital readmission has AUC 0.99. List three questions you would ask.</li><li>In the noise experiment, what accuracy would you expect if <code>k=20</code> became <code>k=5000</code> (all features) with selection outside CV? Why?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (b) and (d) leak — they happen after the loan starts; (a) and (c) are known at application. 2) Which feature drives the score? Was the split by patient and by time? Were any steps (scaling, selection, imputation) fitted on all data? 3) About 0.5: selecting all features selects nothing based on the labels, so there is no leak — the leak came from choosing features using the labels.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 6 · Bài 6.3</span>
<h2>Rò rỉ dữ liệu: vì sao kết quả quá đẹp thường là sai</h2>
<p class="lead"><strong>Rò rỉ dữ liệu</strong> (leakage) xảy ra khi thông tin không có sẵn tại thời điểm dự đoán lọt vào huấn luyện hay đánh giá. Mô hình trông xuất sắc trong notebook và thất bại khi chạy thật. Đây là lỗi nghiêm trọng phổ biến nhất ở cả đồ án sinh viên lẫn dự án doanh nghiệp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra rò rỉ do tiền xử lý, rò rỉ mục tiêu và rò rỉ thời gian/nhóm.</li><li>Tái hiện một vụ rò rỉ trên dữ liệu nhiễu thuần và sửa bằng pipeline.</li><li>Áp dụng danh sách kiểm bắt rò rỉ trước buổi demo.</li></ul>
<h3>📖 Bài giảng</h3>
<pre><code class="language-python">import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline

# Pure noise: 100 samples, 5,000 random features, random labels -&gt; honest accuracy must be ~0.5
rng = np.random.default_rng(0)
X = rng.normal(size=(100, 5000))
y = rng.integers(0, 2, size=100)

# WRONG: choose the 20 "best" features using ALL rows, then cross-validate
X_sel = SelectKBest(f_classif, k=20).fit_transform(X, y)
wrong = cross_val_score(LogisticRegression(max_iter=1000), X_sel, y, cv=5).mean()

# RIGHT: feature selection is a step INSIDE the pipeline, refitted on each training fold
pipe = make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression(max_iter=1000))
right = cross_val_score(pipe, X, y, cv=5).mean()
print(f"selection outside CV: {wrong:.2f}   selection inside CV: {right:.2f}")

# Target leakage: a column that is created AFTER the outcome
late = rng.random(1000) &lt; 0.15
voucher_sent = np.where(late, rng.random(1000) &lt; 0.95, rng.random(1000) &lt; 0.02)  # vouchers go to late orders
hour = rng.integers(8, 23, 1000)
Xl = np.column_stack([hour, voucher_sent])
acc = cross_val_score(LogisticRegression(), Xl, late, cv=5).mean()
acc_h = cross_val_score(LogisticRegression(), hour.reshape(-1, 1), late, cv=5).mean()
print(f"with voucher_sent: {acc:.3f}   hour only: {acc_h:.3f}   (base rate on-time = {1 - late.mean():.3f})")</code></pre>
<div class="out">selection outside CV: 0.85   selection inside CV: 0.48
with voucher_sent: 0.971   hour only: 0.827   (base rate on-time = 0.827)</div>
<p><strong>Rò rỉ 1 — tiền xử lý nằm ngoài kiểm định chéo.</strong> Dữ liệu là nhiễu thuần: 5.000 đặc trưng ngẫu nhiên và nhãn ngẫu nhiên, nên không mô hình nào thật sự vượt được 50%. Chọn 20 đặc trưng tương quan với nhãn nhất <em>bằng cả 100 dòng</em>, rồi mới kiểm định chéo, cho ra “độ chính xác” 0,85. Trong 5.000 cột ngẫu nhiên, vài cột tương quan với nhãn do tình cờ — kể cả nhãn của các dòng về sau dùng làm validation. Khi việc chọn là một bước bên trong pipeline, mỗi phần chỉ chọn bằng dòng huấn luyện của nó, và kết quả trung thực hiện ra: 0,48, tức là ngẫu nhiên. Cùng kiểu rò rỉ đó, nhỏ hơn, xảy ra với chuẩn hoá, điền thiếu, target encoding, oversampling hay PCA được fit trước khi chia. Quy tắc: <em>mọi thứ học từ dữ liệu đều nằm trong pipeline</em> (Bài 5.3).</p>
<p><strong>Rò rỉ 2 — rò rỉ mục tiêu.</strong> Một cột là hệ quả của kết cục. Voucher của ta được gửi <em>vì</em> đơn đã trễ, nên <code>voucher_sent</code> “dự đoán” trễ với độ chính xác 0,971. Lúc đặt đơn, voucher chưa tồn tại. Không có nó, chỉ giờ trong ngày đạt 0,827 — đúng bằng tỉ lệ nền, nghĩa là giờ không mang tín hiệu gì trong dữ liệu mô phỏng này. Ví dụ thật: “số tiền hoàn” để dự đoán khiếu nại, “chẩn đoán lúc ra viện” để dự đoán nhập viện, “ngày đóng tài khoản” để dự đoán rời bỏ.</p>
<p><strong>Rò rỉ 3 — rò rỉ thời gian và nhóm.</strong> Chia ngẫu nhiên dữ liệu có thứ tự thời gian cho phép mô hình học từ tương lai (giá hôm qua dự đoán hôm nay tốt đáng ngờ khi giá ngày mai nằm trong tập huấn luyện). Các dòng của cùng bệnh nhân, khách hàng hay buổi chụp ảnh nằm ở cả hai phía cho phép mô hình nhận ra cá nhân thay vì học quy luật. Dùng <code>TimeSeriesSplit</code> hoặc <code>GroupKFold</code> (Bài 6.2).</p>
<div class="formula"><span class="lbl">Danh sách kiểm rò rỉ</span>Với mỗi đặc trưng: biết khi nào, ai biết? · Mọi bước fit (điền, chuẩn hoá, chọn, mã hoá, lấy mẫu lại) đã nằm trong pipeline chưa? · Cách chia có tôn trọng thời gian và nhóm không? · Điểm có cao đáng ngờ không? Đặc trưng nào giải thích phần lớn điểm số?</div>
<p>Điểm rất cao, hoặc một đặc trưng có độ quan trọng khổng lồ (Bài 10.1), là lý do để điều tra trước khi ăn mừng.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>“Em chuẩn hoá cả bộ dữ liệu trước cho tiện.”</li><li>Dùng ID hay mốc thời gian mã hoá luôn nhãn (vd đơn trễ được gán dải ID riêng).</li><li>Oversampling lớp thiểu số trước khi chia, nên bản sao của cùng một dòng nằm ở cả train và validation.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Rò rỉ = dùng thông tin không có lúc dự đoán trong huấn luyện hay đánh giá.</li><li>Fit mọi bước phụ thuộc dữ liệu bên trong pipeline được kiểm định chéo.</li><li>Loại bỏ đặc trưng sinh ra sau kết cục.</li><li>Chia theo thời gian và theo nhóm khi bài toán đòi hỏi; nghi ngờ kết quả đẹp quá mức.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/common_pitfalls.html" target="_blank" rel="noopener">scikit-learn — Các bẫy thường gặp và thực hành khuyến nghị (rò rỉ dữ liệu)</a></li><li><a href="https://www.kaggle.com/code/alexisbcook/data-leakage" target="_blank" rel="noopener">Kaggle Learn — Data Leakage (Intermediate Machine Learning)</a></li><li><a href="https://developers.google.com/machine-learning/guides/rules-of-ml" target="_blank" rel="noopener">Google — Rules of Machine Learning (lệch giữa huấn luyện và phục vụ)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đặc trưng nào rò rỉ khi dự đoán, lúc nộp hồ sơ, khoản vay có vỡ nợ không: (a) thu nhập người vay, (b) số lần trả chậm của khoản vay này, (c) số tiền vay, (d) công ty thu hồi nợ được giao?</li><li>Mô hình tái nhập viện của một đồng nghiệp có AUC 0,99. Nêu ba câu bạn sẽ hỏi.</li><li>Trong thí nghiệm nhiễu, nếu <code>k=20</code> thành <code>k=5000</code> (mọi đặc trưng) với việc chọn ngoài CV, bạn đoán độ chính xác bao nhiêu? Vì sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (b) và (d) rò rỉ — chúng xảy ra sau khi khoản vay bắt đầu; (a) và (c) biết lúc nộp hồ sơ. 2) Đặc trưng nào tạo ra điểm số? Có chia theo bệnh nhân và theo thời gian không? Có bước nào (chuẩn hoá, chọn đặc trưng, điền thiếu) fit trên toàn bộ dữ liệu không? 3) Khoảng 0,5: chọn mọi đặc trưng nghĩa là không chọn gì dựa trên nhãn, nên không rò rỉ — rò rỉ đến từ việc chọn đặc trưng bằng nhãn.</p></div>`);

const q6 = QZ(6, 'Quiz — Chapter 6: The supervised learning workflow|||Quiz — Chương 6: Quy trình học có giám sát',
  'Quiz 8 câu: vai trò ba tập, stratify, chẩn đoán quá khớp, K-fold, GridSearchCV và best_score_, chia theo thời gian, rò rỉ do tiền xử lý, rò rỉ mục tiêu.', [
  Q('q1', 'Which set is used exactly once, at the end, to report performance?|||Tập nào được dùng đúng một lần, ở cuối, để báo hiệu năng?',
    ['Test set|||Tập test', 'Training set|||Tập huấn luyện', 'Validation set|||Tập validation', 'All of them|||Tất cả'], 0,
    'The test set must stay untouched by every choice.|||Tập test phải không bị chạm bởi mọi lựa chọn.'),
  Q('q2', 'Train accuracy 1.000, validation 0.80. This suggests…|||Độ chính xác train 1,000, validation 0,80. Điều này gợi ý…',
    ['overfitting|||quá khớp', 'underfitting|||chưa khớp', 'leakage into validation|||rò rỉ vào validation', 'a perfect model|||mô hình hoàn hảo'], 0,
    'A large train–validation gap is the signature of overfitting.|||Khoảng cách lớn giữa train và validation là dấu hiệu quá khớp.'),
  Q('q3', 'What does stratify=y do in train_test_split?|||stratify=y làm gì trong train_test_split?',
    ['Keeps class proportions equal in each part|||Giữ tỉ lệ lớp như nhau ở mỗi phần', 'Sorts rows by y|||Sắp dòng theo y', 'Removes the minority class|||Bỏ lớp thiểu số', 'Scales the features|||Chuẩn hoá đặc trưng'], 0,
    'Important when classes are imbalanced.|||Quan trọng khi các lớp mất cân bằng.'),
  Q('q4', 'In 5-fold CV, how many times is each row used for validation?|||Trong CV 5 phần, mỗi dòng được dùng làm validation mấy lần?',
    ['Once|||Một lần', 'Five times|||Năm lần', 'Never|||Không lần nào', 'Four times|||Bốn lần'], 0,
    'Each fold is the validation fold exactly once.|||Mỗi phần làm phần kiểm định đúng một lần.'),
  Q('q5', 'Why is grid.best_score_ an optimistic estimate?|||Vì sao grid.best_score_ là ước lượng lạc quan?',
    ['It is the maximum over many noisy CV scores|||Nó là giá trị lớn nhất trong nhiều điểm CV nhiễu', 'It uses the test set|||Nó dùng tập test', 'It ignores the folds|||Nó bỏ qua các phần', 'It is computed on training predictions|||Nó tính trên dự đoán huấn luyện'], 0,
    'Selecting the best of many scores favours lucky ones; evaluate on a held-out test set.|||Chọn điểm tốt nhất trong nhiều điểm sẽ ưu ái điểm may mắn; hãy đánh giá trên test giữ lại.'),
  Q('q6', 'For forecasting next week’s orders, which splitter fits?|||Để dự báo số đơn tuần tới, nên dùng cách chia nào?',
    ['TimeSeriesSplit|||TimeSeriesSplit', 'Shuffled KFold|||KFold có xáo trộn', 'StratifiedKFold|||StratifiedKFold', 'Leave-one-out on shuffled rows|||Leave-one-out trên dòng xáo trộn'], 0,
    'Validation must always come after training in time.|||Kiểm định luôn phải đứng sau huấn luyện về thời gian.'),
  Q('q7', 'Selecting features on all rows before CV on pure noise gave 0.85. This is…|||Chọn đặc trưng trên mọi dòng trước khi CV với dữ liệu nhiễu cho 0,85. Đây là…',
    ['leakage from preprocessing outside CV|||rò rỉ do tiền xử lý ngoài CV', 'a real signal|||tín hiệu thật', 'underfitting|||chưa khớp', 'target encoding done right|||target encoding làm đúng'], 0,
    'Inside a pipeline the honest score was 0.48.|||Trong pipeline điểm trung thực là 0,48.'),
  Q('q8', '“voucher_sent” predicts lateness almost perfectly. Why must it be removed?|||“voucher_sent” dự đoán trễ gần như hoàn hảo. Vì sao phải loại bỏ?',
    ['It is created after the outcome (target leakage)|||Nó sinh ra sau kết cục (rò rỉ mục tiêu)', 'It is categorical|||Nó là biến phân loại', 'It has missing values|||Nó có giá trị thiếu', 'It is too weak|||Nó quá yếu'], 0,
    'At prediction time the voucher does not yet exist.|||Lúc dự đoán, voucher chưa tồn tại.'),
]);

const ch6 = {
  title: 'Chapter 6 — The supervised learning workflow|||Chương 6 — Quy trình học có giám sát',
  description: 'Train/validation/test, baseline, quá khớp và chưa khớp; kiểm định chéo K phần, GridSearchCV, nested CV, chia theo thời gian/nhóm; ba loại rò rỉ dữ liệu và danh sách kiểm.',
  lessons: [c61, c62, c63, q6],
};


// ───────────────────────────── Chương 7 — Các họ mô hình ─────────────────────────────
const c71 = L('dsi201-ts-7-1',
  '7.1 — Linear regression and regularisation (Ridge, Lasso)|||7.1 — Hồi quy tuyến tính và chính quy hoá (Ridge, Lasso)',
  'Hồi quy tuyến tính là cực tiểu tổng bình phương sai số; hệ số trên đặc trưng đã chuẩn hoá; đa cộng tuyến làm hệ số s1/s2 nhảy; Ridge co hệ số, Lasso đưa 5 hệ số về 0; chọn α bằng CV.',
  `<span class="eyebrow">DSI201 · Chapter 7 · Lesson 7.1</span>
<h2>Linear regression and regularisation (Ridge, Lasso)</h2>
<p class="lead">Linear regression is the first model to try for a numeric target: fast, stable, interpretable, and a strong baseline. Regularisation makes it robust when features are many or correlated.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the linear model and its least-squares fit.</li><li>Explain how Ridge and Lasso penalties change the coefficients.</li><li>Compare them with cross-validation on standardised features.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Linear model and its loss</span>ŷ = β<sub>0</sub> + β<sub>1</sub>x<sub>1</sub> + … + β<sub>p</sub>x<sub>p</sub><br>OLS: minimise ∑(y<sub>i</sub> − ŷ<sub>i</sub>)<sup>2</sup>    Ridge: + α∑β<sub>j</sub><sup>2</sup>    Lasso: (1/2n)∑(y<sub>i</sub> − ŷ<sub>i</sub>)<sup>2</sup> + α∑|β<sub>j</sub>|</div>
<p>Ordinary least squares (OLS) chooses the β that make the sum of squared errors smallest; in matrix form β̂ = (XᵀX)<sup>−1</sup>Xᵀy, a direct use of the linear algebra of MAA102. In PSI221 you added standard errors and tests to these coefficients; here we focus on <em>prediction</em>. Each coefficient means: “the change in the predicted target for a one-unit increase in that feature, <em>holding the other features fixed</em>.”</p>
<p><strong>The problem with OLS.</strong> When features are strongly correlated (multicollinearity) or numerous compared with rows, XᵀX is nearly singular and the coefficients swing wildly to cancel each other out. The fix is a <strong>penalty</strong> on coefficient size: <strong>Ridge</strong> (L2) shrinks all coefficients smoothly toward zero; <strong>Lasso</strong> (L1) can set some exactly to zero, performing feature selection. α controls the strength (α = 0 gives OLS). Because the penalty treats all coefficients alike, features must be on the same scale — so we standardise inside a pipeline.</p>
<pre><code class="language-python">import pandas as pd
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Lasso, LinearRegression, Ridge
from sklearn.model_selection import KFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_diabetes(return_X_y=True, as_frame=True)
cv = KFold(5, shuffle=True, random_state=0)
models = {"OLS": LinearRegression(), "Ridge a=10": Ridge(alpha=10), "Lasso a=5": Lasso(alpha=5)}

coefs = {}
for name, est in models.items():
    pipe = make_pipeline(StandardScaler(), est)          # same units -&gt; comparable, fair penalty
    r2 = cross_val_score(pipe, X, y, cv=cv, scoring="r2").mean()
    pipe.fit(X, y)
    coefs[name] = pipe[-1].coef_
    print(f"{name:11s} CV R2 = {r2:.3f}   intercept = {pipe[-1].intercept_:.1f}")

table = pd.DataFrame(coefs, index=X.columns).round(1)
print(table)
print("Lasso set", int((table["Lasso a=5"] == 0).sum()), "coefficients exactly to zero")</code></pre>
<div class="out">OLS         CV R2 = 0.489   intercept = 152.1
Ridge a=10  CV R2 = 0.489   intercept = 152.1
Lasso a=5   CV R2 = 0.472   intercept = 152.1
      OLS  Ridge a=10  Lasso a=5
age  -0.5        -0.3        0.0
sex -11.4       -10.9       -2.2
bmi  24.7        24.6       24.2
bp   15.4        15.1       10.3
s1  -37.7       -11.3       -0.0
s2   22.7         1.8       -0.0
s3    4.8        -6.6       -7.0
s4    8.4         5.6        0.0
s5   35.7        25.3       21.2
s6    3.2         3.5        0.0
Lasso set 5 coefficients exactly to zero</div>
<p><strong>Reading it.</strong> The diabetes features s1–s6 are blood measurements, and s1 (total cholesterol) and s2 (LDL) are highly correlated. OLS gives them large opposite coefficients (−37.7 and +22.7) that largely cancel; Ridge pulls them to −11.3 and 1.8 with the <em>same</em> cross-validated R² (0.489) — a more believable model at no cost. Lasso with α = 5 sets five coefficients exactly to zero and keeps bmi, bp, s3 and s5 (and a small sex effect) for only a small loss (0.472). With standardised features, coefficient sizes are comparable: one standard deviation of BMI adds about 24 points of predicted progression. (Even so, coefficients describe associations in this model, not causes.)</p>
<p><strong>Choosing α.</strong> Treat it as a hyper-parameter: <code>RidgeCV(alphas=...)</code> and <code>LassoCV()</code> pick it by cross-validation, or put it in a GridSearchCV (Lesson 6.2). <strong>ElasticNet</strong> mixes both penalties.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Applying Ridge/Lasso to unscaled features — the penalty then depends on units.</li><li>Reading OLS coefficients of correlated features as separate effects.</li><li>Assuming linearity without checking residuals — plot residuals vs predictions; curves mean missing transforms or interactions (Lesson 5.2).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>OLS minimises squared errors; coefficients are effects holding others fixed.</li><li>Correlated features make OLS coefficients unstable.</li><li>Ridge shrinks, Lasso shrinks and selects; scale features first; tune α with CV.</li><li>Regularisation often keeps accuracy while giving simpler, steadier models.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/linear_model.html" target="_blank" rel="noopener">scikit-learn — Linear models (OLS, Ridge, Lasso, ElasticNet)</a></li><li><a href="https://www.statlearning.com/" target="_blank" rel="noopener">ISLP — Chapter 3 (linear regression) and Chapter 6 (shrinkage methods)</a></li><li><a href="https://www.youtube.com/watch?v=Q81RR3yKn30" target="_blank" rel="noopener">StatQuest — Regularization Part 1: Ridge Regression</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A model predicts price = 0.2 + 0.045·area (bn VND, m²). Interpret 0.045 and predict an 80 m² flat.</li><li>What happens to Lasso's coefficients as α grows very large? And Ridge's?</li><li>Why might Lasso pick s1 in one CV fold and s2 in another?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Each extra m² adds 0.045 bn (45 million VND) to the predicted price; 0.2 + 0.045·80 = 3.8 bn. 2) Lasso: more and more coefficients become exactly 0 until all are 0 (prediction = mean). Ridge: all shrink toward 0 but none become exactly 0. 3) They carry almost the same information; Lasso tends to keep one of a correlated group, and small data changes decide which.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 7 · Bài 7.1</span>
<h2>Hồi quy tuyến tính và chính quy hoá (Ridge, Lasso)</h2>
<p class="lead">Hồi quy tuyến tính là mô hình đầu tiên nên thử cho mục tiêu dạng số: nhanh, ổn định, dễ diễn giải, và là một baseline mạnh. Chính quy hoá làm nó vững vàng khi đặc trưng nhiều hoặc tương quan với nhau.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu mô hình tuyến tính và cách khớp bình phương tối thiểu.</li><li>Giải thích phạt Ridge và Lasso thay đổi hệ số ra sao.</li><li>So sánh chúng bằng kiểm định chéo trên đặc trưng đã chuẩn hoá.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Mô hình tuyến tính và hàm mất mát</span>ŷ = β<sub>0</sub> + β<sub>1</sub>x<sub>1</sub> + … + β<sub>p</sub>x<sub>p</sub><br>OLS: cực tiểu ∑(y<sub>i</sub> − ŷ<sub>i</sub>)<sup>2</sup>    Ridge: + α∑β<sub>j</sub><sup>2</sup>    Lasso: (1/2n)∑(y<sub>i</sub> − ŷ<sub>i</sub>)<sup>2</sup> + α∑|β<sub>j</sub>|</div>
<p>Bình phương tối thiểu (OLS) chọn β làm tổng bình phương sai số nhỏ nhất; dạng ma trận β̂ = (XᵀX)<sup>−1</sup>Xᵀy, ứng dụng trực tiếp đại số tuyến tính của MAA102. Ở PSI221 bạn đã thêm sai số chuẩn và kiểm định cho các hệ số này; ở đây ta tập trung vào <em>dự đoán</em>. Mỗi hệ số có nghĩa: “mức thay đổi của giá trị dự đoán khi đặc trưng đó tăng một đơn vị, <em>giữ nguyên các đặc trưng khác</em>.”</p>
<p><strong>Vấn đề của OLS.</strong> Khi các đặc trưng tương quan mạnh (đa cộng tuyến) hoặc nhiều so với số dòng, XᵀX gần suy biến và hệ số dao động dữ dội để triệt tiêu lẫn nhau. Cách sửa là <strong>phạt</strong> độ lớn hệ số: <strong>Ridge</strong> (L2) co mọi hệ số về 0 một cách trơn tru; <strong>Lasso</strong> (L1) có thể đưa vài hệ số về đúng 0, tức là tự chọn đặc trưng. α điều khiển độ mạnh (α = 0 là OLS). Vì phạt coi mọi hệ số như nhau, các đặc trưng phải cùng thang đo — nên ta chuẩn hoá bên trong pipeline.</p>
<pre><code class="language-python">import pandas as pd
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Lasso, LinearRegression, Ridge
from sklearn.model_selection import KFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_diabetes(return_X_y=True, as_frame=True)
cv = KFold(5, shuffle=True, random_state=0)
models = {"OLS": LinearRegression(), "Ridge a=10": Ridge(alpha=10), "Lasso a=5": Lasso(alpha=5)}

coefs = {}
for name, est in models.items():
    pipe = make_pipeline(StandardScaler(), est)          # same units -&gt; comparable, fair penalty
    r2 = cross_val_score(pipe, X, y, cv=cv, scoring="r2").mean()
    pipe.fit(X, y)
    coefs[name] = pipe[-1].coef_
    print(f"{name:11s} CV R2 = {r2:.3f}   intercept = {pipe[-1].intercept_:.1f}")

table = pd.DataFrame(coefs, index=X.columns).round(1)
print(table)
print("Lasso set", int((table["Lasso a=5"] == 0).sum()), "coefficients exactly to zero")</code></pre>
<div class="out">OLS         CV R2 = 0.489   intercept = 152.1
Ridge a=10  CV R2 = 0.489   intercept = 152.1
Lasso a=5   CV R2 = 0.472   intercept = 152.1
      OLS  Ridge a=10  Lasso a=5
age  -0.5        -0.3        0.0
sex -11.4       -10.9       -2.2
bmi  24.7        24.6       24.2
bp   15.4        15.1       10.3
s1  -37.7       -11.3       -0.0
s2   22.7         1.8       -0.0
s3    4.8        -6.6       -7.0
s4    8.4         5.6        0.0
s5   35.7        25.3       21.2
s6    3.2         3.5        0.0
Lasso set 5 coefficients exactly to zero</div>
<p><strong>Đọc kết quả.</strong> Các đặc trưng s1–s6 của diabetes là chỉ số máu, và s1 (cholesterol toàn phần) với s2 (LDL) tương quan rất cao. OLS cho chúng hệ số lớn ngược dấu (−37,7 và +22,7) phần lớn triệt tiêu nhau; Ridge kéo về −11,3 và 1,8 với <em>cùng</em> R² kiểm định chéo (0,489) — một mô hình đáng tin hơn mà không mất gì. Lasso với α = 5 đưa năm hệ số về đúng 0 và giữ bmi, bp, s3, s5 (và một tác động nhỏ của sex) chỉ với chút thiệt hại (0,472). Với đặc trưng đã chuẩn hoá, độ lớn hệ số so sánh được: một độ lệch chuẩn BMI làm tăng khoảng 24 điểm tiến triển dự đoán. (Dù vậy, hệ số mô tả liên hệ trong mô hình này, không phải nguyên nhân.)</p>
<p><strong>Chọn α.</strong> Coi nó là siêu tham số: <code>RidgeCV(alphas=...)</code> và <code>LassoCV()</code> chọn bằng kiểm định chéo, hoặc đưa vào GridSearchCV (Bài 6.2). <strong>ElasticNet</strong> trộn cả hai kiểu phạt.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Áp Ridge/Lasso cho đặc trưng chưa chuẩn hoá — khi đó phạt phụ thuộc đơn vị đo.</li><li>Đọc hệ số OLS của các đặc trưng tương quan như những tác động riêng rẽ.</li><li>Mặc định tuyến tính mà không kiểm phần dư — vẽ phần dư theo dự đoán; thấy đường cong nghĩa là thiếu biến đổi hoặc tương tác (Bài 5.2).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>OLS cực tiểu bình phương sai số; hệ số là tác động khi giữ các biến khác cố định.</li><li>Đặc trưng tương quan làm hệ số OLS kém ổn định.</li><li>Ridge co hệ số, Lasso co và chọn; chuẩn hoá trước; chỉnh α bằng CV.</li><li>Chính quy hoá thường giữ được độ chính xác mà cho mô hình đơn giản, ổn định hơn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/linear_model.html" target="_blank" rel="noopener">scikit-learn — Mô hình tuyến tính (OLS, Ridge, Lasso, ElasticNet)</a></li><li><a href="https://www.statlearning.com/" target="_blank" rel="noopener">ISLP — Chương 3 (hồi quy tuyến tính) và Chương 6 (phương pháp co hệ số)</a></li><li><a href="https://www.youtube.com/watch?v=Q81RR3yKn30" target="_blank" rel="noopener">StatQuest — Regularization Part 1: Ridge Regression</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Mô hình dự đoán giá = 0,2 + 0,045·diện tích (tỉ đồng, m²). Diễn giải 0,045 và dự đoán căn 80 m².</li><li>Hệ số Lasso thay đổi thế nào khi α rất lớn? Còn Ridge?</li><li>Vì sao Lasso có thể giữ s1 ở phần CV này và s2 ở phần khác?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Mỗi m² thêm làm giá dự đoán tăng 0,045 tỉ (45 triệu đồng); 0,2 + 0,045·80 = 3,8 tỉ. 2) Lasso: ngày càng nhiều hệ số thành đúng 0 cho tới khi tất cả bằng 0 (dự đoán = trung bình). Ridge: mọi hệ số co về 0 nhưng không cái nào đúng bằng 0. 3) Chúng mang gần như cùng thông tin; Lasso thường giữ một biến trong nhóm tương quan, và thay đổi nhỏ của dữ liệu quyết định giữ biến nào.</p></div>`);

const c72 = L('dsi201-ts-7-2',
  '7.2 — Logistic regression: probabilities for classification|||7.2 — Hồi quy logistic: xác suất cho bài toán phân loại',
  'Hàm sigmoid, log-odds tuyến tính, huấn luyện bằng hợp lý cực đại (log-loss); breast cancer: CV 0,976, test 0,965; predict_proba; hệ số theo log-odds và tỉ số odds trên mỗi độ lệch chuẩn; C và phạt L2.',
  `<span class="eyebrow">DSI201 · Chapter 7 · Lesson 7.2</span>
<h2>Logistic regression: probabilities for classification</h2>
<p class="lead">Despite its name, logistic regression is a classifier. It is the linear model of classification: it outputs a probability, it is fast and well understood, and it is the baseline every fancier classifier must beat.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain how a linear score becomes a probability via the sigmoid function.</li><li>Fit, evaluate and use <code>predict_proba</code> in a scaled pipeline.</li><li>Interpret coefficients as changes in log-odds and odds.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Logistic model</span>z = β<sub>0</sub> + β<sub>1</sub>x<sub>1</sub> + … + β<sub>p</sub>x<sub>p</sub>  (the log-odds)      P(y = 1 | x) = σ(z) = 1 / (1 + e<sup>−z</sup>)      odds = P/(1 − P) = e<sup>z</sup></div>
<p>The linear score z can be any number; the sigmoid squashes it into (0, 1). z = 0 gives 0.5; z = 2 gives 0.88; z = −2 gives 0.12. Training finds the β that maximise the likelihood of the observed labels — the maximum-likelihood idea of PSI221 — which is the same as minimising the <strong>log-loss</strong> (cross-entropy) −∑[y log p + (1 − y) log(1 − p)]. scikit-learn adds an L2 penalty by default; its strength is set by <code>C</code> = 1/α (smaller C, stronger penalty).</p>
<p>We recode the breast-cancer data so that 1 = malignant, the class we want to detect.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

data = load_breast_cancer(as_frame=True)
X, y = data.data, 1 - data.target            # recode: 1 = malignant (the class we want to detect)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=1)

clf = make_pipeline(StandardScaler(), LogisticRegression(C=1.0, max_iter=1000))
print("5-fold CV accuracy:", cross_val_score(clf, X_tr, y_tr, cv=5).mean().round(3))
clf.fit(X_tr, y_tr)
print("test accuracy:", round(clf.score(X_te, y_te), 3))

# Probabilities, not just labels
p = clf.predict_proba(X_te.iloc[:5])[:, 1]
print("P(malignant) for 5 test tumours:", p.round(3), "-&gt; labels", (p &gt;= 0.5).astype(int))

# Coefficients are in log-odds per 1 standard deviation of each feature
coef = pd.Series(clf[-1].coef_[0], index=X.columns)
top = coef.reindex(coef.abs().sort_values(ascending=False).index)[:4]
print(pd.DataFrame({"log_odds": top.round(2), "odds_x": np.exp(top).round(2)}))</code></pre>
<div class="out">5-fold CV accuracy: 0.976
test accuracy: 0.965
P(malignant) for 5 test tumours: [0.002 0.004 1.    0.001 0.   ] -&gt; labels [0 0 1 0 0]
                   log_odds  odds_x
radius error           1.11    3.05
worst symmetry         1.09    2.97
worst texture          1.05    2.87
compactness error     -1.02    0.36</div>
<p><strong>Accuracy.</strong> Cross-validated accuracy on the training part is 0.976 and the held-out test accuracy 0.965 — far above the 0.63 majority baseline (Lesson 6.1). Chapter 8 explains why accuracy is not enough for a medical screen.</p>
<p><strong>Probabilities.</strong> <code>predict_proba</code> gives P(malignant) for each case; <code>predict</code> simply applies the threshold 0.5. Probabilities are what decisions need: a hospital might send everything above 0.1 for a biopsy (Lesson 8.3). Logistic regression's probabilities are usually reasonably calibrated, unlike some other models.</p>
<p><strong>Coefficients.</strong> With standardised features, a coefficient is the change in log-odds for a one-standard-deviation increase in that feature, holding the others fixed. <code>radius error</code> has 1.11: one SD more multiplies the odds of malignancy by e<sup>1.11</sup> ≈ 3.05. A negative coefficient (compactness error, −1.02) multiplies the odds by 0.36 — but, as in Lesson 7.1, the 30 features here are strongly correlated (radius, perimeter and area measure nearly the same thing), so individual coefficients should not be read as independent effects.</p>
<p><strong>Several classes.</strong> For three or more classes scikit-learn fits a multinomial (softmax) version automatically; each class gets its own coefficient vector.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting to scale features, so the default penalty and the solver behave poorly (convergence warnings).</li><li>Reading coefficients as changes in probability — they are changes in log-odds; the probability change depends on where you start.</li><li>Using the 0.5 threshold by default when errors have different costs.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Logistic regression = linear score → sigmoid → probability.</li><li>Trained by maximum likelihood (minimising log-loss) with an L2 penalty controlled by C.</li><li>Use <code>predict_proba</code> and choose a threshold for the decision.</li><li>Coefficient β ⇒ odds multiplied by e<sup>β</sup> per unit (per SD when standardised).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/logistic-regression" target="_blank" rel="noopener">Google ML Crash Course — Logistic regression</a></li><li><a href="https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression" target="_blank" rel="noopener">scikit-learn — Logistic regression</a></li><li><a href="https://www.youtube.com/watch?v=yIYKR4sgzI8" target="_blank" rel="noopener">StatQuest — Logistic Regression</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A model has z = −1.5 + 0.8·x. Compute P(y = 1) for x = 0 and for x = 4.</li><li>A coefficient is −0.69 for a 0/1 feature “has_promo”. How does a promotion change the odds?</li><li>What would you expect to happen to the coefficients if you set <code>C=0.01</code>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x = 0: z = −1.5, P = 1/(1 + e<sup>1.5</sup>) ≈ 0.18. x = 4: z = 1.7, P ≈ 0.85. 2) e<sup>−0.69</sup> ≈ 0.50: the odds are halved. 3) A much stronger penalty: all coefficients shrink toward 0 and probabilities move toward the base rate; accuracy may drop (underfitting).</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 7 · Bài 7.2</span>
<h2>Hồi quy logistic: xác suất cho bài toán phân loại</h2>
<p class="lead">Dù tên là hồi quy, hồi quy logistic là bộ phân loại. Nó là mô hình tuyến tính của bài toán phân loại: cho ra xác suất, nhanh, dễ hiểu, và là baseline mà mọi bộ phân loại cầu kỳ hơn phải vượt qua.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích điểm tuyến tính trở thành xác suất qua hàm sigmoid thế nào.</li><li>Fit, đánh giá và dùng <code>predict_proba</code> trong pipeline có chuẩn hoá.</li><li>Diễn giải hệ số như thay đổi của log-odds và odds.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Mô hình logistic</span>z = β<sub>0</sub> + β<sub>1</sub>x<sub>1</sub> + … + β<sub>p</sub>x<sub>p</sub>  (log-odds)      P(y = 1 | x) = σ(z) = 1 / (1 + e<sup>−z</sup>)      odds = P/(1 − P) = e<sup>z</sup></div>
<p>Điểm tuyến tính z có thể là bất kỳ số nào; sigmoid ép nó vào (0, 1). z = 0 cho 0,5; z = 2 cho 0,88; z = −2 cho 0,12. Huấn luyện tìm β làm cực đại hợp lý của các nhãn quan sát — ý tưởng hợp lý cực đại của PSI221 — tương đương cực tiểu <strong>log-loss</strong> (cross-entropy) −∑[y log p + (1 − y) log(1 − p)]. scikit-learn mặc định thêm phạt L2; độ mạnh đặt bằng <code>C</code> = 1/α (C nhỏ hơn, phạt mạnh hơn).</p>
<p>Ta mã hoá lại dữ liệu ung thư vú để 1 = ác tính, lớp ta muốn phát hiện.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

data = load_breast_cancer(as_frame=True)
X, y = data.data, 1 - data.target            # recode: 1 = malignant (the class we want to detect)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=1)

clf = make_pipeline(StandardScaler(), LogisticRegression(C=1.0, max_iter=1000))
print("5-fold CV accuracy:", cross_val_score(clf, X_tr, y_tr, cv=5).mean().round(3))
clf.fit(X_tr, y_tr)
print("test accuracy:", round(clf.score(X_te, y_te), 3))

# Probabilities, not just labels
p = clf.predict_proba(X_te.iloc[:5])[:, 1]
print("P(malignant) for 5 test tumours:", p.round(3), "-&gt; labels", (p &gt;= 0.5).astype(int))

# Coefficients are in log-odds per 1 standard deviation of each feature
coef = pd.Series(clf[-1].coef_[0], index=X.columns)
top = coef.reindex(coef.abs().sort_values(ascending=False).index)[:4]
print(pd.DataFrame({"log_odds": top.round(2), "odds_x": np.exp(top).round(2)}))</code></pre>
<div class="out">5-fold CV accuracy: 0.976
test accuracy: 0.965
P(malignant) for 5 test tumours: [0.002 0.004 1.    0.001 0.   ] -&gt; labels [0 0 1 0 0]
                   log_odds  odds_x
radius error           1.11    3.05
worst symmetry         1.09    2.97
worst texture          1.05    2.87
compactness error     -1.02    0.36</div>
<p><strong>Độ chính xác.</strong> Độ chính xác kiểm định chéo trên phần train là 0,976 và trên test giữ lại là 0,965 — vượt xa baseline lớp đa số 0,63 (Bài 6.1). Chương 8 giải thích vì sao độ chính xác chưa đủ cho một xét nghiệm sàng lọc y tế.</p>
<p><strong>Xác suất.</strong> <code>predict_proba</code> cho P(ác tính) của từng ca; <code>predict</code> chỉ áp ngưỡng 0,5. Xác suất mới là thứ quyết định cần: bệnh viện có thể gửi mọi ca trên 0,1 đi sinh thiết (Bài 8.3). Xác suất của hồi quy logistic thường được hiệu chỉnh khá tốt, khác với vài mô hình khác.</p>
<p><strong>Hệ số.</strong> Với đặc trưng đã chuẩn hoá, hệ số là thay đổi của log-odds khi đặc trưng tăng một độ lệch chuẩn, giữ các đặc trưng khác cố định. <code>radius error</code> có 1,11: tăng một SD nhân odds ác tính lên e<sup>1,11</sup> ≈ 3,05 lần. Hệ số âm (compactness error, −1,02) nhân odds với 0,36 — nhưng, như ở Bài 7.1, 30 đặc trưng ở đây tương quan rất mạnh (bán kính, chu vi và diện tích đo gần như cùng một thứ), nên không nên đọc từng hệ số như tác động độc lập.</p>
<p><strong>Nhiều lớp.</strong> Với ba lớp trở lên, scikit-learn tự fit phiên bản đa thức (softmax); mỗi lớp có vectơ hệ số riêng.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên chuẩn hoá đặc trưng, nên phạt mặc định và bộ giải chạy kém (cảnh báo không hội tụ).</li><li>Đọc hệ số như thay đổi xác suất — chúng là thay đổi log-odds; thay đổi xác suất tuỳ điểm xuất phát.</li><li>Dùng ngưỡng 0,5 mặc định khi các loại sai có chi phí khác nhau.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hồi quy logistic = điểm tuyến tính → sigmoid → xác suất.</li><li>Huấn luyện bằng hợp lý cực đại (cực tiểu log-loss) với phạt L2 điều khiển bởi C.</li><li>Dùng <code>predict_proba</code> và tự chọn ngưỡng cho quyết định.</li><li>Hệ số β ⇒ odds nhân với e<sup>β</sup> mỗi đơn vị (mỗi SD khi đã chuẩn hoá).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/logistic-regression" target="_blank" rel="noopener">Google ML Crash Course — Hồi quy logistic</a></li><li><a href="https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression" target="_blank" rel="noopener">scikit-learn — Hồi quy logistic</a></li><li><a href="https://www.youtube.com/watch?v=yIYKR4sgzI8" target="_blank" rel="noopener">StatQuest — Logistic Regression</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Mô hình có z = −1,5 + 0,8·x. Tính P(y = 1) khi x = 0 và x = 4.</li><li>Hệ số của đặc trưng 0/1 “has_promo” là −0,69. Khuyến mãi làm odds thay đổi thế nào?</li><li>Bạn đoán hệ số sẽ ra sao nếu đặt <code>C=0.01</code>?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x = 0: z = −1,5, P = 1/(1 + e<sup>1,5</sup>) ≈ 0,18. x = 4: z = 1,7, P ≈ 0,85. 2) e<sup>−0,69</sup> ≈ 0,50: odds giảm một nửa. 3) Phạt mạnh hơn nhiều: mọi hệ số co về 0 và xác suất dồn về tỉ lệ nền; độ chính xác có thể giảm (chưa khớp).</p></div>`);

const c73 = L('dsi201-ts-7-3',
  '7.3 — Decision trees: if-then rules learned from data|||7.3 — Cây quyết định: luật nếu-thì học từ dữ liệu',
  'Cây hồi quy cho thời gian giao: chia đệ quy giảm phương sai, export_text đọc luật, độ sâu 1 → không giới hạn (train MAE 0,46 nhưng CV 4,81), siêu tham số max_depth/min_samples_leaf, ưu nhược điểm.',
  `<span class="eyebrow">DSI201 · Chapter 7 · Lesson 7.3</span>
<h2>Decision trees: if-then rules learned from data</h2>
<p class="lead">A decision tree asks a sequence of yes/no questions — “distance ≤ 4.2 km? raining?” — and predicts from the answer at the end. It handles non-linear effects and interactions automatically and can be read by a non-specialist. Alone it overfits easily; it is also the building block of the strongest tabular models (Lesson 7.4).</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain how a tree chooses splits (impurity reduction) and predicts.</li><li>Read a fitted tree's rules.</li><li>Control overfitting with depth and leaf-size limits.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>How it grows.</strong> Start with all training rows in one node. Try every feature and every threshold; choose the split that makes the two child groups most homogeneous — for regression, the largest drop in squared error (variance); for classification, the largest drop in <strong>Gini impurity</strong> or entropy. Repeat inside each child until a stopping rule (maximum depth, minimum rows per leaf) is reached. A leaf predicts the mean of its rows (regression) or the majority class and class shares (classification). This greedy, recursive procedure is fast and needs no feature scaling.</p>
<div class="formula"><span class="lbl">Split criteria</span>Regression: minimise n<sub>L</sub>·Var(L) + n<sub>R</sub>·Var(R)      Gini of a node = 1 − ∑<sub>k</sub> p<sub>k</sub><sup>2</sup> (0 = pure)</div>
<p>Data: 3,000 simulated deliveries where minutes depend on distance, rain, rush hour (11–12h and 18–19h) and an interaction (rain at rush hour on long trips is much worse), plus noise with standard deviation 4 minutes.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeRegressor, export_text

# Delivery minutes that follow if-then structure (rush hour, rain, distance) plus noise
rng = np.random.default_rng(73)
n = 3000
df = pd.DataFrame({
    "hour": rng.integers(8, 23, n),
    "distance_km": rng.gamma(2.0, 1.6, n).round(1),
    "raining": rng.integers(0, 2, n),
    "items": rng.integers(1, 8, n),
})
rush = df["hour"].isin([11, 12, 18, 19]).astype(int)
df["minutes"] = (18 + 3 * df["distance_km"] + 10 * rush + 6 * df["raining"]
                 + 12 * rush * df["raining"] * (df["distance_km"] &gt; 4) + rng.normal(0, 4, n)).round(1)
X, y = df.drop(columns="minutes"), df["minutes"]

for depth in [1, 2, 4, 6, 10, None]:
    tree = DecisionTreeRegressor(max_depth=depth, random_state=0)
    cv = -cross_val_score(tree, X, y, cv=5, scoring="neg_mean_absolute_error").mean()
    tree.fit(X, y)
    train = np.abs(tree.predict(X) - y).mean()
    print(f"max_depth={str(depth):4s} leaves={tree.get_n_leaves():4d}  train MAE={train:5.2f}  CV MAE={cv:5.2f}")

small = DecisionTreeRegressor(max_depth=2, random_state=0).fit(X, y)
print(export_text(small, feature_names=list(X.columns), decimals=1))</code></pre>
<div class="out">max_depth=1    leaves=   2  train MAE= 6.83  CV MAE= 6.86
max_depth=2    leaves=   4  train MAE= 6.13  CV MAE= 6.18
max_depth=4    leaves=  16  train MAE= 5.31  CV MAE= 5.49
max_depth=6    leaves=  63  train MAE= 4.01  CV MAE= 4.34
max_depth=10   leaves= 687  train MAE= 2.27  CV MAE= 4.12
max_depth=None leaves=2683  train MAE= 0.46  CV MAE= 4.81
|--- distance_km &lt;= 4.2
|   |--- raining &lt;= 0.5
|   |   |--- value: [26.8]
|   |--- raining &gt;  0.5
|   |   |--- value: [33.4]
|--- distance_km &gt;  4.2
|   |--- distance_km &lt;= 7.2
|   |   |--- value: [41.7]
|   |--- distance_km &gt;  7.2
|   |   |--- value: [53.4]</div>
<p><strong>The depth sweep is the whole lesson.</strong> Depth 1–2 underfit (CV MAE above 6 minutes). As depth grows, training error keeps falling, but cross-validated error bottoms out (4.12 at depth 10 among the depths tried) and then rises: the unlimited tree has 2,683 leaves — almost one per row — a training MAE of 0.46 minutes and a CV MAE of 4.81. It memorised the noise. Note the floor: with noise of SD 4, even a perfect model has an MAE around 3.2, so no tree should look much better than that.</p>
<p><strong>Reading the small tree.</strong> The depth-2 tree is a readable rulebook: short trips without rain take about 26.8 minutes, short trips in rain 33.4, trips of 4.2–7.2 km 41.7, longer ones 53.4. Rush hour does not appear yet: hour is a number and the rush windows are two separate intervals, so a tree needs several splits on <code>hour</code> to isolate them. Adding an engineered <code>is_rush</code> feature (Lesson 5.2) would let a shallow tree use it immediately — features still matter for trees.</p>
<p><strong>Controls.</strong> <code>max_depth</code>, <code>min_samples_leaf</code> (e.g. 20 rows per leaf), <code>max_leaf_nodes</code>, and cost-complexity pruning (<code>ccp_alpha</code>). Tune them with cross-validation.</p>
<p><strong>Strengths:</strong> interpretable, captures interactions and thresholds, no scaling, handles mixed feature types. <strong>Weaknesses:</strong> high variance (a small data change can produce a different tree), piecewise-constant predictions, and poor extrapolation beyond the training range.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Leaving the default unlimited depth and trusting the training score.</li><li>Explaining a deep tree's rules as if they were stable knowledge — refit on another sample and they change.</li><li>Expecting a tree to predict values larger than any seen in training.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Trees split recursively to reduce variance (regression) or Gini/entropy (classification).</li><li>Shallow trees are readable rulebooks; deep trees memorise.</li><li>Limit depth and leaf size, tuned by cross-validation.</li><li>No scaling needed, but good features still help.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/tree.html" target="_blank" rel="noopener">scikit-learn — Decision Trees</a></li><li><a href="https://www.youtube.com/watch?v=_L39rN6gz7Y" target="_blank" rel="noopener">StatQuest — Decision and Classification Trees, Clearly Explained</a></li><li><a href="https://www.statlearning.com/" target="_blank" rel="noopener">ISLP — Chapter 8: Tree-Based Methods</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A node has 60 late and 40 on-time orders. Compute its Gini impurity. What is it for a node with 100 late orders?</li><li>Using the depth-2 rules, predict the minutes for a 6 km trip in the rain at 19:00. Why is this prediction probably too low?</li><li>Which two hyper-parameters would you tune first to stop the unlimited tree from overfitting?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1 − (0.6<sup>2</sup> + 0.4<sup>2</sup>) = 1 − 0.52 = 0.48; a pure node has Gini 0. 2) The rule for 4.2–7.2 km gives 41.7 minutes; it ignores rain, rush hour and their interaction (a depth-2 tree has no room for them), so it underestimates this worst-case trip. 3) <code>max_depth</code> and <code>min_samples_leaf</code> (or <code>ccp_alpha</code>).</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 7 · Bài 7.3</span>
<h2>Cây quyết định: luật nếu-thì học từ dữ liệu</h2>
<p class="lead">Cây quyết định hỏi một chuỗi câu có/không — “quãng đường ≤ 4,2 km? trời mưa?” — rồi dự đoán theo câu trả lời ở cuối. Nó tự xử lý tác động phi tuyến và tương tác, và người không chuyên cũng đọc được. Đứng một mình nó dễ quá khớp; nó cũng là viên gạch của các mô hình mạnh nhất cho dữ liệu bảng (Bài 7.4).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích cây chọn điểm chia (giảm độ hỗn tạp) và dự đoán thế nào.</li><li>Đọc các luật của một cây đã fit.</li><li>Kiểm soát quá khớp bằng giới hạn độ sâu và cỡ lá.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Cây lớn lên thế nào.</strong> Bắt đầu với mọi dòng huấn luyện trong một nút. Thử mọi đặc trưng và mọi ngưỡng; chọn cách chia làm hai nhóm con đồng nhất nhất — với hồi quy là giảm bình phương sai số (phương sai) nhiều nhất; với phân loại là giảm <strong>độ hỗn tạp Gini</strong> hay entropy nhiều nhất. Lặp lại trong từng nút con tới khi gặp quy tắc dừng (độ sâu tối đa, số dòng tối thiểu mỗi lá). Một lá dự đoán trung bình các dòng của nó (hồi quy) hoặc lớp đa số và tỉ lệ các lớp (phân loại). Thủ tục tham lam, đệ quy này nhanh và không cần chuẩn hoá đặc trưng.</p>
<div class="formula"><span class="lbl">Tiêu chí chia</span>Hồi quy: cực tiểu n<sub>L</sub>·Var(L) + n<sub>R</sub>·Var(R)      Gini của một nút = 1 − ∑<sub>k</sub> p<sub>k</sub><sup>2</sup> (0 = thuần nhất)</div>
<p>Dữ liệu: 3.000 chuyến giao mô phỏng, số phút phụ thuộc quãng đường, mưa, giờ cao điểm (11–12h và 18–19h) và một tương tác (mưa vào giờ cao điểm với chuyến xa thì tệ hơn nhiều), cộng nhiễu có độ lệch chuẩn 4 phút.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeRegressor, export_text

# Delivery minutes that follow if-then structure (rush hour, rain, distance) plus noise
rng = np.random.default_rng(73)
n = 3000
df = pd.DataFrame({
    "hour": rng.integers(8, 23, n),
    "distance_km": rng.gamma(2.0, 1.6, n).round(1),
    "raining": rng.integers(0, 2, n),
    "items": rng.integers(1, 8, n),
})
rush = df["hour"].isin([11, 12, 18, 19]).astype(int)
df["minutes"] = (18 + 3 * df["distance_km"] + 10 * rush + 6 * df["raining"]
                 + 12 * rush * df["raining"] * (df["distance_km"] &gt; 4) + rng.normal(0, 4, n)).round(1)
X, y = df.drop(columns="minutes"), df["minutes"]

for depth in [1, 2, 4, 6, 10, None]:
    tree = DecisionTreeRegressor(max_depth=depth, random_state=0)
    cv = -cross_val_score(tree, X, y, cv=5, scoring="neg_mean_absolute_error").mean()
    tree.fit(X, y)
    train = np.abs(tree.predict(X) - y).mean()
    print(f"max_depth={str(depth):4s} leaves={tree.get_n_leaves():4d}  train MAE={train:5.2f}  CV MAE={cv:5.2f}")

small = DecisionTreeRegressor(max_depth=2, random_state=0).fit(X, y)
print(export_text(small, feature_names=list(X.columns), decimals=1))</code></pre>
<div class="out">max_depth=1    leaves=   2  train MAE= 6.83  CV MAE= 6.86
max_depth=2    leaves=   4  train MAE= 6.13  CV MAE= 6.18
max_depth=4    leaves=  16  train MAE= 5.31  CV MAE= 5.49
max_depth=6    leaves=  63  train MAE= 4.01  CV MAE= 4.34
max_depth=10   leaves= 687  train MAE= 2.27  CV MAE= 4.12
max_depth=None leaves=2683  train MAE= 0.46  CV MAE= 4.81
|--- distance_km &lt;= 4.2
|   |--- raining &lt;= 0.5
|   |   |--- value: [26.8]
|   |--- raining &gt;  0.5
|   |   |--- value: [33.4]
|--- distance_km &gt;  4.2
|   |--- distance_km &lt;= 7.2
|   |   |--- value: [41.7]
|   |--- distance_km &gt;  7.2
|   |   |--- value: [53.4]</div>
<p><strong>Bảng quét độ sâu chính là cả bài học.</strong> Độ sâu 1–2 chưa khớp (CV MAE trên 6 phút). Khi độ sâu tăng, sai số huấn luyện tiếp tục giảm, nhưng sai số kiểm định chéo chạm đáy (4,12 ở độ sâu 10 trong các độ sâu đã thử) rồi tăng lại: cây không giới hạn có 2.683 lá — gần như mỗi dòng một lá — MAE huấn luyện 0,46 phút và CV MAE 4,81. Nó đã học thuộc nhiễu. Để ý mức sàn: với nhiễu có SD 4, ngay cả mô hình hoàn hảo cũng có MAE khoảng 3,2, nên không cây nào được phép trông tốt hơn nhiều so với mức đó.</p>
<p><strong>Đọc cây nhỏ.</strong> Cây độ sâu 2 là một cuốn luật dễ đọc: chuyến ngắn không mưa mất khoảng 26,8 phút, chuyến ngắn trời mưa 33,4, chuyến 4,2–7,2 km 41,7, chuyến xa hơn 53,4. Giờ cao điểm chưa xuất hiện: giờ là số và các khung cao điểm là hai khoảng tách rời, nên cây cần nhiều lần chia trên <code>hour</code> mới cô lập được. Thêm đặc trưng tự tạo <code>is_rush</code> (Bài 5.2) sẽ giúp cây nông dùng được ngay — đặc trưng vẫn quan trọng với cây.</p>
<p><strong>Các nút điều chỉnh.</strong> <code>max_depth</code>, <code>min_samples_leaf</code> (vd 20 dòng mỗi lá), <code>max_leaf_nodes</code>, và cắt tỉa theo độ phức tạp (<code>ccp_alpha</code>). Chỉnh chúng bằng kiểm định chéo.</p>
<p><strong>Điểm mạnh:</strong> dễ diễn giải, bắt được tương tác và ngưỡng, không cần chuẩn hoá, xử lý đặc trưng nhiều kiểu. <strong>Điểm yếu:</strong> phương sai cao (dữ liệu đổi chút có thể ra cây khác), dự đoán dạng bậc thang, và ngoại suy kém ngoài khoảng dữ liệu huấn luyện.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Để độ sâu mặc định không giới hạn và tin điểm huấn luyện.</li><li>Giải thích luật của một cây sâu như thể là tri thức ổn định — fit lại trên mẫu khác là chúng đổi.</li><li>Mong cây dự đoán giá trị lớn hơn mọi giá trị đã thấy khi huấn luyện.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cây chia đệ quy để giảm phương sai (hồi quy) hoặc Gini/entropy (phân loại).</li><li>Cây nông là cuốn luật dễ đọc; cây sâu học thuộc.</li><li>Giới hạn độ sâu và cỡ lá, chỉnh bằng kiểm định chéo.</li><li>Không cần chuẩn hoá, nhưng đặc trưng tốt vẫn giúp ích.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/tree.html" target="_blank" rel="noopener">scikit-learn — Cây quyết định</a></li><li><a href="https://www.youtube.com/watch?v=_L39rN6gz7Y" target="_blank" rel="noopener">StatQuest — Decision and Classification Trees, Clearly Explained</a></li><li><a href="https://www.statlearning.com/" target="_blank" rel="noopener">ISLP — Chương 8: Các phương pháp dựa trên cây</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một nút có 60 đơn trễ và 40 đơn đúng giờ. Tính độ hỗn tạp Gini. Với nút có 100 đơn trễ thì sao?</li><li>Dùng luật độ sâu 2, dự đoán số phút cho chuyến 6 km trời mưa lúc 19:00. Vì sao dự đoán này có lẽ quá thấp?</li><li>Bạn sẽ chỉnh hai siêu tham số nào trước để cây không giới hạn thôi quá khớp?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1 − (0,6<sup>2</sup> + 0,4<sup>2</sup>) = 1 − 0,52 = 0,48; nút thuần nhất có Gini 0. 2) Luật cho 4,2–7,2 km cho 41,7 phút; nó bỏ qua mưa, giờ cao điểm và tương tác của chúng (cây độ sâu 2 không còn chỗ cho chúng), nên đánh giá thấp chuyến tệ nhất này. 3) <code>max_depth</code> và <code>min_samples_leaf</code> (hoặc <code>ccp_alpha</code>).</p></div>`);

const c74 = L('dsi201-ts-7-4',
  '7.4 — Random forests and gradient boosting: ensembles of trees (intuition)|||7.4 — Rừng ngẫu nhiên và gradient boosting: tổ hợp cây (trực giác)',
  'Bagging + chọn ngẫu nhiên đặc trưng = rừng ngẫu nhiên (giảm phương sai); boosting = cây nhỏ nối tiếp sửa phần dư (giảm chệch, tốc độ học); Friedman #1: tuyến tính 2,58 · một cây 2,97 · rừng 1,98 · HistGB 1,48.',
  `<span class="eyebrow">DSI201 · Chapter 7 · Lesson 7.4</span>
<h2>Random forests and gradient boosting: ensembles of trees (intuition)</h2>
<p class="lead">One tree is unstable; many trees combined are not. The two ways of combining them — averaging independent trees (random forests) and adding small trees that correct each other (gradient boosting) — are the default high-accuracy models for tabular data.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain bagging and random feature selection in random forests.</li><li>Explain the idea of boosting: sequential trees fitting the remaining errors.</li><li>Compare ensembles with linear models and single trees by cross-validation.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Random forest = bagging + random features.</strong> Draw a bootstrap sample of the rows (sampling with replacement — the bootstrap of PSI221), grow a deep tree on it, and repeat hundreds of times. At every split, each tree may only consider a random subset of the features, so the trees do not all copy the strongest feature and become different from each other. The forest averages their predictions (or takes a vote). Each tree has low bias but high variance; averaging many partly independent trees cancels much of the variance. Rows left out of a tree's bootstrap sample (“out-of-bag”) give a free validation estimate.</p>
<div class="formula"><span class="lbl">Two ensemble ideas</span>Random forest: ŷ = (1/B) ∑<sub>b=1..B</sub> tree<sub>b</sub>(x), trees grown independently on bootstrap samples → reduces variance<br>Boosting: F<sub>m</sub>(x) = F<sub>m−1</sub>(x) + η · tree<sub>m</sub>(x), each small tree fitted to the current errors → reduces bias</div>
<p><strong>Gradient boosting = small trees in sequence.</strong> Start with a constant prediction (the mean). Compute the residuals (what is still wrong). Fit a <em>small</em> tree to the residuals, add a fraction η (the learning rate, e.g. 0.1) of its prediction, and repeat. Each tree fixes part of what the previous ones missed. (“Gradient” because, for other losses, the residual is replaced by the gradient of the loss — the same gradient-descent idea used to train neural networks.) Too many rounds will eventually overfit, so the number of trees is tuned or chosen by early stopping. Popular implementations: scikit-learn's <code>HistGradientBoosting</code>, XGBoost, LightGBM, CatBoost.</p>
<p>Test bed: Friedman's benchmark function — a sine of an interaction, a quadratic term, two linear terms and five useless noise features.</p>
<pre><code class="language-python">from sklearn.datasets import make_friedman1
from sklearn.ensemble import HistGradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import KFold, cross_val_score
from sklearn.tree import DecisionTreeRegressor

# Friedman #1: y = 10 sin(pi x1 x2) + 20 (x3 - 0.5)^2 + 10 x4 + 5 x5 + noise; x6..x10 are useless
X, y = make_friedman1(n_samples=1000, n_features=10, noise=1.0, random_state=0)
cv = KFold(5, shuffle=True, random_state=0)
models = {
    "linear regression": LinearRegression(),
    "single tree (depth 6)": DecisionTreeRegressor(max_depth=6, random_state=0),
    "random forest (300 trees)": RandomForestRegressor(n_estimators=300, random_state=0, n_jobs=-1),
    "gradient boosting (hist)": HistGradientBoostingRegressor(random_state=0),
}
for name, m in models.items():
    rmse = -cross_val_score(m, X, y, cv=cv, scoring="neg_root_mean_squared_error").mean()
    print(f"{name:26s} CV RMSE = {rmse:.2f}")

# More trees never hurt a random forest; they just stop helping
for n in [1, 10, 50, 300]:
    rf = RandomForestRegressor(n_estimators=n, random_state=0, n_jobs=-1)
    print(f"forest with {n:3d} trees: CV RMSE = {-cross_val_score(rf, X, y, cv=cv, scoring='neg_root_mean_squared_error').mean():.2f}")</code></pre>
<div class="out">linear regression          CV RMSE = 2.58
single tree (depth 6)      CV RMSE = 2.97
random forest (300 trees)  CV RMSE = 1.98
gradient boosting (hist)   CV RMSE = 1.48
forest with   1 trees: CV RMSE = 3.27
forest with  10 trees: CV RMSE = 2.18
forest with  50 trees: CV RMSE = 2.02
forest with 300 trees: CV RMSE = 1.98</div>
<p><strong>Results.</strong> The linear model (RMSE 2.58) cannot represent the sine and the square. A single depth-6 tree is worse still (2.97) — its predictions are coarse steps. The forest averages 300 trees to reach 1.98; gradient boosting, which builds the smooth structure step by step, reaches 1.48 with default settings. The second loop shows the forest's behaviour: one tree 3.27, ten trees 2.18, then diminishing returns (2.02 → 1.98). More trees never hurt a forest — they only cost time.</p>
<p><strong>Practical guidance.</strong> Start with a linear/logistic baseline; then try a random forest (robust, few settings) and gradient boosting (usually the most accurate, but tune learning rate, number of trees and tree size). The gain must justify the loss of simplicity: if boosting beats the linear model by 1%, the linear model may be the better product. For interpreting ensembles, see Chapter 10.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Comparing a tuned boosting model with an untuned baseline, then claiming a big win.</li><li>Raising the boosting learning rate to train faster and getting a model that overfits.</li><li>Believing ensembles cannot overfit or leak — leakage (Lesson 6.3) fools every model.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Random forest: many deep trees on bootstrap samples with random feature subsets, averaged → lower variance.</li><li>Gradient boosting: small trees added sequentially to fit residuals, scaled by a learning rate → lower bias.</li><li>Both handle non-linearity and interactions; boosting is often the most accurate on tables.</li><li>Always compare against simple baselines under the same cross-validation.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/ensemble.html" target="_blank" rel="noopener">scikit-learn — Ensembles: gradient boosting, random forests, bagging</a></li><li><a href="https://developers.google.com/machine-learning/decision-forests" target="_blank" rel="noopener">Google — Decision Forests course</a></li><li><a href="https://www.youtube.com/watch?v=J4Wdy0Wc_xQ" target="_blank" rel="noopener">StatQuest — Random Forests Part 1</a></li><li><a href="https://www.youtube.com/watch?v=3CC4N4z3GJc" target="_blank" rel="noopener">StatQuest — Gradient Boost Part 1: Regression Main Ideas</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Why does averaging 300 trees reduce error only if the trees are not all identical? Which two mechanisms make them different?</li><li>Initial prediction 30 minutes; the true value is 42; the first tree predicts a residual of 10; learning rate 0.1. What is the prediction after one round?</li><li>Your boosting model scores 1.48 and the random forest 1.98 on CV RMSE, but the business needs predictions for 50 million rows per hour on cheap hardware. What else would you measure?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Averaging identical predictions changes nothing; variance falls only when errors are partly independent. Bootstrap samples of the rows and random subsets of features at each split make the trees differ. 2) 30 + 0.1·10 = 31 minutes — boosting moves slowly toward the target over many rounds. 3) Prediction latency and memory, training time, ease of maintenance and monitoring; a slightly less accurate but much cheaper model may be the right choice.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 7 · Bài 7.4</span>
<h2>Rừng ngẫu nhiên và gradient boosting: tổ hợp cây (trực giác)</h2>
<p class="lead">Một cây thì bất ổn; nhiều cây kết hợp lại thì không. Hai cách kết hợp — lấy trung bình các cây độc lập (rừng ngẫu nhiên) và cộng dồn các cây nhỏ sửa lỗi cho nhau (gradient boosting) — là các mô hình độ chính xác cao mặc định cho dữ liệu bảng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích bagging và chọn ngẫu nhiên đặc trưng trong rừng ngẫu nhiên.</li><li>Giải thích ý tưởng boosting: các cây nối tiếp khớp phần sai số còn lại.</li><li>So sánh mô hình tổ hợp với mô hình tuyến tính và một cây đơn bằng kiểm định chéo.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Rừng ngẫu nhiên = bagging + đặc trưng ngẫu nhiên.</strong> Rút một mẫu bootstrap các dòng (lấy mẫu có hoàn lại — bootstrap của PSI221), trồng một cây sâu trên đó, và lặp lại hàng trăm lần. Ở mỗi lần chia, mỗi cây chỉ được xét một tập con ngẫu nhiên các đặc trưng, nên các cây không cùng chép đặc trưng mạnh nhất và trở nên khác nhau. Rừng lấy trung bình dự đoán (hoặc biểu quyết). Mỗi cây có chệch thấp nhưng phương sai cao; trung bình nhiều cây độc lập một phần triệt tiêu phần lớn phương sai. Các dòng không nằm trong mẫu bootstrap của một cây (“out-of-bag”) cho một ước lượng kiểm định miễn phí.</p>
<div class="formula"><span class="lbl">Hai ý tưởng tổ hợp</span>Rừng ngẫu nhiên: ŷ = (1/B) ∑<sub>b=1..B</sub> cây<sub>b</sub>(x), các cây trồng độc lập trên mẫu bootstrap → giảm phương sai<br>Boosting: F<sub>m</sub>(x) = F<sub>m−1</sub>(x) + η · cây<sub>m</sub>(x), mỗi cây nhỏ khớp sai số hiện tại → giảm chệch</div>
<p><strong>Gradient boosting = các cây nhỏ nối tiếp.</strong> Bắt đầu bằng dự đoán hằng (trung bình). Tính phần dư (phần còn sai). Fit một cây <em>nhỏ</em> vào phần dư, cộng thêm một phần η (tốc độ học, vd 0,1) của dự đoán của nó, và lặp lại. Mỗi cây sửa một phần những gì các cây trước bỏ sót. (“Gradient” vì với các hàm mất mát khác, phần dư được thay bằng gradient của hàm mất mát — cùng ý tưởng hạ gradient dùng để huấn luyện mạng nơ-ron.) Quá nhiều vòng cuối cùng sẽ quá khớp, nên số cây được chỉnh hoặc chọn bằng dừng sớm. Các bản cài đặt phổ biến: <code>HistGradientBoosting</code> của scikit-learn, XGBoost, LightGBM, CatBoost.</p>
<p>Bài thử: hàm chuẩn của Friedman — một hàm sin của tương tác, một số hạng bậc hai, hai số hạng tuyến tính và năm đặc trưng nhiễu vô dụng.</p>
<pre><code class="language-python">from sklearn.datasets import make_friedman1
from sklearn.ensemble import HistGradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import KFold, cross_val_score
from sklearn.tree import DecisionTreeRegressor

# Friedman #1: y = 10 sin(pi x1 x2) + 20 (x3 - 0.5)^2 + 10 x4 + 5 x5 + noise; x6..x10 are useless
X, y = make_friedman1(n_samples=1000, n_features=10, noise=1.0, random_state=0)
cv = KFold(5, shuffle=True, random_state=0)
models = {
    "linear regression": LinearRegression(),
    "single tree (depth 6)": DecisionTreeRegressor(max_depth=6, random_state=0),
    "random forest (300 trees)": RandomForestRegressor(n_estimators=300, random_state=0, n_jobs=-1),
    "gradient boosting (hist)": HistGradientBoostingRegressor(random_state=0),
}
for name, m in models.items():
    rmse = -cross_val_score(m, X, y, cv=cv, scoring="neg_root_mean_squared_error").mean()
    print(f"{name:26s} CV RMSE = {rmse:.2f}")

# More trees never hurt a random forest; they just stop helping
for n in [1, 10, 50, 300]:
    rf = RandomForestRegressor(n_estimators=n, random_state=0, n_jobs=-1)
    print(f"forest with {n:3d} trees: CV RMSE = {-cross_val_score(rf, X, y, cv=cv, scoring='neg_root_mean_squared_error').mean():.2f}")</code></pre>
<div class="out">linear regression          CV RMSE = 2.58
single tree (depth 6)      CV RMSE = 2.97
random forest (300 trees)  CV RMSE = 1.98
gradient boosting (hist)   CV RMSE = 1.48
forest with   1 trees: CV RMSE = 3.27
forest with  10 trees: CV RMSE = 2.18
forest with  50 trees: CV RMSE = 2.02
forest with 300 trees: CV RMSE = 1.98</div>
<p><strong>Kết quả.</strong> Mô hình tuyến tính (RMSE 2,58) không biểu diễn được hàm sin và bình phương. Một cây độ sâu 6 còn tệ hơn (2,97) — dự đoán của nó là các bậc thang thô. Rừng lấy trung bình 300 cây để đạt 1,98; gradient boosting, dựng cấu trúc trơn từng bước, đạt 1,48 với thiết lập mặc định. Vòng lặp thứ hai cho thấy hành vi của rừng: một cây 3,27, mười cây 2,18, sau đó lợi ích giảm dần (2,02 → 1,98). Thêm cây không bao giờ làm rừng tệ đi — chỉ tốn thời gian.</p>
<p><strong>Hướng dẫn thực hành.</strong> Bắt đầu bằng baseline tuyến tính/logistic; rồi thử rừng ngẫu nhiên (vững, ít thiết lập) và gradient boosting (thường chính xác nhất, nhưng phải chỉnh tốc độ học, số cây và cỡ cây). Phần lợi phải đáng với phần mất đi về sự đơn giản: nếu boosting chỉ hơn mô hình tuyến tính 1%, mô hình tuyến tính có thể là sản phẩm tốt hơn. Về diễn giải mô hình tổ hợp, xem Chương 10.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>So một mô hình boosting đã chỉnh với baseline chưa chỉnh, rồi tuyên bố thắng lớn.</li><li>Tăng tốc độ học của boosting để huấn luyện nhanh và nhận về mô hình quá khớp.</li><li>Tin rằng mô hình tổ hợp không thể quá khớp hay rò rỉ — rò rỉ (Bài 6.3) đánh lừa mọi mô hình.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Rừng ngẫu nhiên: nhiều cây sâu trên mẫu bootstrap với tập con đặc trưng ngẫu nhiên, lấy trung bình → giảm phương sai.</li><li>Gradient boosting: cây nhỏ cộng dồn nối tiếp để khớp phần dư, nhân tốc độ học → giảm chệch.</li><li>Cả hai xử lý phi tuyến và tương tác; boosting thường chính xác nhất trên dữ liệu bảng.</li><li>Luôn so với baseline đơn giản dưới cùng một kiểm định chéo.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/ensemble.html" target="_blank" rel="noopener">scikit-learn — Mô hình tổ hợp: gradient boosting, rừng ngẫu nhiên, bagging</a></li><li><a href="https://developers.google.com/machine-learning/decision-forests" target="_blank" rel="noopener">Google — Khoá Decision Forests</a></li><li><a href="https://www.youtube.com/watch?v=J4Wdy0Wc_xQ" target="_blank" rel="noopener">StatQuest — Random Forests Part 1</a></li><li><a href="https://www.youtube.com/watch?v=3CC4N4z3GJc" target="_blank" rel="noopener">StatQuest — Gradient Boost Part 1: Regression Main Ideas</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Vì sao lấy trung bình 300 cây chỉ giảm sai số khi các cây không giống hệt nhau? Hai cơ chế nào làm chúng khác nhau?</li><li>Dự đoán ban đầu 30 phút; giá trị thật 42; cây đầu tiên dự đoán phần dư 10; tốc độ học 0,1. Dự đoán sau một vòng là bao nhiêu?</li><li>Mô hình boosting được CV RMSE 1,48 và rừng 1,98, nhưng doanh nghiệp cần dự đoán 50 triệu dòng mỗi giờ trên phần cứng rẻ. Bạn sẽ đo thêm gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Lấy trung bình các dự đoán giống hệt nhau không thay đổi gì; phương sai chỉ giảm khi sai số độc lập một phần. Mẫu bootstrap các dòng và tập con đặc trưng ngẫu nhiên ở mỗi lần chia làm các cây khác nhau. 2) 30 + 0,1·10 = 31 phút — boosting tiến chậm về đích qua nhiều vòng. 3) Độ trễ dự đoán và bộ nhớ, thời gian huấn luyện, độ dễ bảo trì và giám sát; một mô hình kém chính xác hơn chút nhưng rẻ hơn nhiều có thể là lựa chọn đúng.</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: Regression and classification models|||Quiz — Chương 7: Mô hình hồi quy và phân loại',
  'Quiz 9 câu: OLS, Ridge vs Lasso, chuẩn hoá trước khi phạt, sigmoid và odds, C trong LogisticRegression, Gini, quá khớp của cây, rừng ngẫu nhiên, gradient boosting.', [
  Q('q1', 'Which penalty can set coefficients exactly to zero?|||Kiểu phạt nào có thể đưa hệ số về đúng 0?',
    ['Lasso (L1)|||Lasso (L1)', 'Ridge (L2)|||Ridge (L2)', 'No penalty (OLS)|||Không phạt (OLS)', 'Standard scaling|||Chuẩn hoá'], 0,
    'The L1 penalty produces sparse solutions — automatic feature selection.|||Phạt L1 cho nghiệm thưa — tự chọn đặc trưng.'),
  Q('q2', 'Why standardise features before Ridge or Lasso?|||Vì sao chuẩn hoá đặc trưng trước Ridge hay Lasso?',
    ['The penalty treats all coefficients alike, so units must be comparable|||Phạt coi mọi hệ số như nhau, nên đơn vị phải tương đương', 'To make predictions positive|||Để dự đoán dương', 'Because OLS fails otherwise|||Vì OLS sẽ lỗi', 'To remove outliers|||Để bỏ ngoại lai'], 0,
    'Without scaling, a feature measured in small units would be penalised more.|||Không chuẩn hoá, đặc trưng đo bằng đơn vị nhỏ sẽ bị phạt nhiều hơn.'),
  Q('q3', 'A logistic model gives z = 0 for a case. What is P(y = 1)?|||Mô hình logistic cho z = 0 với một ca. P(y = 1) bằng bao nhiêu?',
    ['0.5|||0,5', '0|||0', '1|||1', '0.88|||0,88'], 0,
    'σ(0) = 1/(1 + e⁰) = 0.5.|||σ(0) = 1/(1 + e⁰) = 0,5.'),
  Q('q4', 'A logistic coefficient of 1.11 (per SD) means the odds are multiplied by about…|||Hệ số logistic 1,11 (mỗi SD) nghĩa là odds nhân với khoảng…',
    ['3.05|||3,05', '1.11|||1,11', '0.33|||0,33', '11.1|||11,1'], 0,
    'e^1.11 ≈ 3.05.|||e^1,11 ≈ 3,05.'),
  Q('q5', 'In scikit-learn’s LogisticRegression, a smaller C means…|||Trong LogisticRegression của scikit-learn, C nhỏ hơn nghĩa là…',
    ['a stronger penalty|||phạt mạnh hơn', 'a weaker penalty|||phạt yếu hơn', 'more classes|||nhiều lớp hơn', 'a higher threshold|||ngưỡng cao hơn'], 0,
    'C is the inverse of the regularisation strength.|||C là nghịch đảo của độ mạnh chính quy hoá.'),
  Q('q6', 'Gini impurity of a node with 50% / 50% classes?|||Độ hỗn tạp Gini của nút có hai lớp 50% / 50%?',
    ['0.5|||0,5', '0|||0', '1|||1', '0.25|||0,25'], 0,
    '1 − (0.25 + 0.25) = 0.5, the maximum for two classes.|||1 − (0,25 + 0,25) = 0,5, mức tối đa với hai lớp.'),
  Q('q7', 'An unlimited-depth tree has train MAE 0.46 and CV MAE 4.81. This is…|||Cây không giới hạn độ sâu có MAE train 0,46 và CV 4,81. Đây là…',
    ['overfitting|||quá khớp', 'underfitting|||chưa khớp', 'a perfect fit|||khớp hoàn hảo', 'leakage|||rò rỉ'], 0,
    'It memorised the training noise.|||Nó đã học thuộc nhiễu huấn luyện.'),
  Q('q8', 'What makes the trees of a random forest different from each other?|||Điều gì làm các cây trong rừng ngẫu nhiên khác nhau?',
    ['Bootstrap samples and random feature subsets at each split|||Mẫu bootstrap và tập con đặc trưng ngẫu nhiên ở mỗi lần chia', 'Different learning rates|||Tốc độ học khác nhau', 'Fitting residuals of the previous tree|||Khớp phần dư của cây trước', 'Different loss functions|||Hàm mất mát khác nhau'], 0,
    'Diversity lets averaging cancel variance.|||Sự đa dạng giúp phép trung bình triệt tiêu phương sai.'),
  Q('q9', 'In gradient boosting, each new tree is fitted to…|||Trong gradient boosting, mỗi cây mới được fit vào…',
    ['the current residuals (errors)|||phần dư (sai số) hiện tại', 'a bootstrap sample of the target|||mẫu bootstrap của mục tiêu', 'the test set|||tập test', 'a random target|||mục tiêu ngẫu nhiên'], 0,
    'Sequential correction of remaining errors, scaled by the learning rate.|||Sửa dần sai số còn lại, nhân với tốc độ học.'),
]);

const ch7 = {
  title: 'Chapter 7 — Regression and classification models|||Chương 7 — Mô hình hồi quy và phân loại',
  description: 'Hồi quy tuyến tính và chính quy hoá Ridge/Lasso, hồi quy logistic và xác suất, cây quyết định, rừng ngẫu nhiên và gradient boosting ở mức trực giác — so sánh bằng kiểm định chéo.',
  lessons: [c71, c72, c73, c74, q7],
};


// ───────────────────────────── Chương 8 — Chỉ số đánh giá ─────────────────────────────
const c81 = L('dsi201-ts-8-1',
  '8.1 — Regression metrics: MAE, RMSE, R² and MAPE|||8.1 — Chỉ số hồi quy: MAE, RMSE, R² và MAPE',
  'Hai mô hình cùng MAE 3,00 nhưng RMSE 3,00 vs 9,49 và R² 0,915 vs 0,149; MAPE ưu ái mô hình B; baseline trung bình có R² = 0; chọn chỉ số theo chi phí sai số.',
  `<span class="eyebrow">DSI201 · Chapter 8 · Lesson 8.1</span>
<h2>Regression metrics: MAE, RMSE, R² and MAPE</h2>
<p class="lead">A metric is a statement of what “wrong” costs. Different metrics rank the same models differently, so choose the one that matches the decision — before you see the results.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute and interpret MAE, RMSE, R² and MAPE.</li><li>See how one large error affects each metric.</li><li>Pick a metric from the business cost of errors.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Regression metrics (e<sub>i</sub> = y<sub>i</sub> − ŷ<sub>i</sub>)</span>MAE = (1/n)∑|e<sub>i</sub>|      RMSE = √((1/n)∑e<sub>i</sub><sup>2</sup>)      R<sup>2</sup> = 1 − ∑e<sub>i</sub><sup>2</sup> / ∑(y<sub>i</sub> − ȳ)<sup>2</sup>      MAPE = (100%/n)∑|e<sub>i</sub>/y<sub>i</sub>|</div>
<ul>
<li><strong>MAE</strong> — average absolute error, in the target's units (“off by 3 minutes on average”). Every minute counts the same; robust to a few large misses.</li>
<li><strong>RMSE</strong> — squares errors before averaging, so large errors dominate. Same units as the target. RMSE ≥ MAE always; a big gap signals some large misses.</li>
<li><strong>R²</strong> — share of the variance explained compared with predicting the mean. 1 is perfect, 0 equals the mean baseline, negative is worse than the mean. Unit-free, so handy for comparing problems, but it says nothing about whether the errors are acceptable in practice.</li>
<li><strong>MAPE</strong> — average percentage error. Intuitive for managers, but undefined when y = 0, explodes for small y, and punishes over-prediction more than under-prediction.</li>
</ul>
<pre><code class="language-python">import numpy as np
from sklearn.metrics import (mean_absolute_error, mean_absolute_percentage_error,
                             mean_squared_error, r2_score)

y_true = np.array([25, 30, 32, 40, 45, 50, 28, 35, 60, 38], dtype=float)   # delivery minutes
model_a = y_true + np.array([3, -3, 3, -3, 3, -3, 3, -3, 3, -3])             # always 3 min off
model_b = y_true + np.array([0, 0, 0, 0, 0, 0, 0, 0, 30, 0])                 # perfect except one big miss

def report(name, pred):
    mae = mean_absolute_error(y_true, pred)
    rmse = np.sqrt(mean_squared_error(y_true, pred))
    print(f"{name}: MAE={mae:.2f}  RMSE={rmse:.2f}  R2={r2_score(y_true, pred):.3f}  "
          f"MAPE={100 * mean_absolute_percentage_error(y_true, pred):.1f}%")

report("model A (small errors everywhere)", model_a)
report("model B (one 30-minute miss)     ", model_b)
report("baseline (predict the mean)       ", np.full_like(y_true, y_true.mean()))</code></pre>
<div class="out">model A (small errors everywhere): MAE=3.00  RMSE=3.00  R2=0.915  MAPE=8.4%
model B (one 30-minute miss)     : MAE=3.00  RMSE=9.49  R2=0.149  MAPE=5.0%
baseline (predict the mean)       : MAE=8.36  RMSE=10.29  R2=0.000  MAPE=22.6%</div>
<p><strong>The same MAE, two very different models.</strong> Model A is 3 minutes off on every order; model B is perfect on nine orders and 30 minutes off on one. Both have MAE 3.00. RMSE separates them (3.00 vs 9.49) because squaring magnifies the single disaster, and R² drops from 0.915 to 0.149. MAPE prefers B (5.0% vs 8.4%) because its one miss happened on the largest value (60 minutes), where the percentage is smallest. The mean baseline has R² = 0 by definition and an MAE of 8.36 — both models beat it on MAE.</p>
<p><strong>Which one to use?</strong> Ask what an error costs. If a customer is equally annoyed by each minute of lateness, MAE matches the cost. If one 30-minute disaster loses the customer while small errors are tolerated, RMSE (or a custom cost) matches better. For inventory, under- and over-prediction cost differently — consider an asymmetric (quantile) loss. Report the main metric with the baseline and, ideally, an interval from cross-validation or the bootstrap (Lesson 12.1). Also look at the errors themselves: a residual plot or errors by group often teaches more than a single number.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reporting R² alone — “R² = 0.9” can still mean errors far too large for the use case.</li><li>Comparing RMSE across targets with different units or scales.</li><li>Using MAPE when the target can be zero or near zero (sales of slow items).</li><li>Choosing the metric after seeing which one makes your model look best.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>MAE: typical error, robust; RMSE: penalises big misses; R²: variance explained vs. the mean; MAPE: percentage, fragile near zero.</li><li>Equal MAE can hide very different error patterns.</li><li>Pick the metric from the cost of errors, before modelling.</li><li>Always show the baseline next to the model.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics" target="_blank" rel="noopener">scikit-learn — Regression metrics</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/linear-regression/loss" target="_blank" rel="noopener">Google ML Crash Course — Linear regression: loss (MAE vs MSE)</a></li><li><a href="https://en.wikipedia.org/wiki/Mean_absolute_percentage_error" target="_blank" rel="noopener">Wikipedia — Mean absolute percentage error (and its problems near zero)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Errors are 2, −2, 2, −2, 10. Compute MAE and RMSE.</li><li>A model has R² = −0.2 on the test set. What does that mean, and what would you check first?</li><li>A bakery forecasts daily croissant sales; unsold croissants cost 5k each, missed sales cost 15k each. Is MAE the right metric?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) MAE = 18/5 = 3.6; RMSE = √((4·4 + 100)/5) = √23.2 ≈ 4.82. 2) It is worse than always predicting the test mean — check for a bug, leakage in reverse (wrong column order), a distribution shift between train and test, or a severely overfitted model. 3) Not exactly: errors are asymmetric (under-forecasting costs 3× more), so use a cost-weighted or quantile loss that pushes forecasts upward.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 8 · Bài 8.1</span>
<h2>Chỉ số hồi quy: MAE, RMSE, R² và MAPE</h2>
<p class="lead">Một chỉ số là lời phát biểu về giá của cái “sai”. Các chỉ số khác nhau xếp hạng cùng các mô hình theo cách khác nhau, nên hãy chọn chỉ số khớp với quyết định — trước khi thấy kết quả.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính và diễn giải MAE, RMSE, R² và MAPE.</li><li>Thấy một sai số lớn ảnh hưởng tới từng chỉ số thế nào.</li><li>Chọn chỉ số từ chi phí nghiệp vụ của sai số.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Chỉ số hồi quy (e<sub>i</sub> = y<sub>i</sub> − ŷ<sub>i</sub>)</span>MAE = (1/n)∑|e<sub>i</sub>|      RMSE = √((1/n)∑e<sub>i</sub><sup>2</sup>)      R<sup>2</sup> = 1 − ∑e<sub>i</sub><sup>2</sup> / ∑(y<sub>i</sub> − ȳ)<sup>2</sup>      MAPE = (100%/n)∑|e<sub>i</sub>/y<sub>i</sub>|</div>
<ul>
<li><strong>MAE</strong> — sai số tuyệt đối trung bình, theo đơn vị của mục tiêu (“lệch trung bình 3 phút”). Mỗi phút tính như nhau; bền với vài lần trật lớn.</li>
<li><strong>RMSE</strong> — bình phương sai số trước khi lấy trung bình, nên sai số lớn chiếm ưu thế. Cùng đơn vị với mục tiêu. Luôn có RMSE ≥ MAE; chênh lớn báo hiệu có vài lần trật lớn.</li>
<li><strong>R²</strong> — phần phương sai được giải thích so với việc đoán trung bình. 1 là hoàn hảo, 0 bằng baseline trung bình, âm là tệ hơn trung bình. Không đơn vị, nên tiện để so các bài toán, nhưng không nói gì về việc sai số có chấp nhận được trong thực tế không.</li>
<li><strong>MAPE</strong> — sai số phần trăm trung bình. Dễ hiểu với quản lý, nhưng không xác định khi y = 0, bùng nổ khi y nhỏ, và phạt dự đoán cao hơn nặng hơn dự đoán thấp.</li>
</ul>
<pre><code class="language-python">import numpy as np
from sklearn.metrics import (mean_absolute_error, mean_absolute_percentage_error,
                             mean_squared_error, r2_score)

y_true = np.array([25, 30, 32, 40, 45, 50, 28, 35, 60, 38], dtype=float)   # delivery minutes
model_a = y_true + np.array([3, -3, 3, -3, 3, -3, 3, -3, 3, -3])             # always 3 min off
model_b = y_true + np.array([0, 0, 0, 0, 0, 0, 0, 0, 30, 0])                 # perfect except one big miss

def report(name, pred):
    mae = mean_absolute_error(y_true, pred)
    rmse = np.sqrt(mean_squared_error(y_true, pred))
    print(f"{name}: MAE={mae:.2f}  RMSE={rmse:.2f}  R2={r2_score(y_true, pred):.3f}  "
          f"MAPE={100 * mean_absolute_percentage_error(y_true, pred):.1f}%")

report("model A (small errors everywhere)", model_a)
report("model B (one 30-minute miss)     ", model_b)
report("baseline (predict the mean)       ", np.full_like(y_true, y_true.mean()))</code></pre>
<div class="out">model A (small errors everywhere): MAE=3.00  RMSE=3.00  R2=0.915  MAPE=8.4%
model B (one 30-minute miss)     : MAE=3.00  RMSE=9.49  R2=0.149  MAPE=5.0%
baseline (predict the mean)       : MAE=8.36  RMSE=10.29  R2=0.000  MAPE=22.6%</div>
<p><strong>Cùng MAE, hai mô hình rất khác nhau.</strong> Mô hình A lệch 3 phút ở mọi đơn; mô hình B đúng hoàn toàn ở chín đơn và lệch 30 phút ở một đơn. Cả hai có MAE 3,00. RMSE tách chúng ra (3,00 so với 9,49) vì bình phương phóng đại thảm hoạ duy nhất, và R² tụt từ 0,915 xuống 0,149. MAPE lại thích B (5,0% so với 8,4%) vì lần trật duy nhất rơi vào giá trị lớn nhất (60 phút), nơi phần trăm nhỏ nhất. Baseline trung bình có R² = 0 theo định nghĩa và MAE 8,36 — cả hai mô hình đều thắng nó về MAE.</p>
<p><strong>Dùng chỉ số nào?</strong> Hỏi giá của một lần sai. Nếu khách bực như nhau với mỗi phút trễ, MAE khớp với chi phí. Nếu một thảm hoạ 30 phút làm mất khách còn sai số nhỏ thì chấp nhận được, RMSE (hoặc một chi phí tự định nghĩa) khớp hơn. Với tồn kho, dự đoán thiếu và thừa có giá khác nhau — cân nhắc hàm mất mát bất đối xứng (quantile). Báo chỉ số chính kèm baseline và, nếu được, một khoảng từ kiểm định chéo hoặc bootstrap (Bài 12.1). Hãy nhìn cả chính các sai số: biểu đồ phần dư hay sai số theo nhóm thường dạy nhiều hơn một con số đơn lẻ.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ báo R² — “R² = 0,9” vẫn có thể nghĩa là sai số quá lớn so với nhu cầu sử dụng.</li><li>So RMSE giữa các mục tiêu có đơn vị hay thang đo khác nhau.</li><li>Dùng MAPE khi mục tiêu có thể bằng 0 hoặc gần 0 (doanh số mặt hàng bán chậm).</li><li>Chọn chỉ số sau khi thấy chỉ số nào làm mô hình mình đẹp nhất.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>MAE: sai số điển hình, bền; RMSE: phạt lần trật lớn; R²: phương sai giải thích được so với trung bình; MAPE: phần trăm, dễ vỡ gần 0.</li><li>MAE bằng nhau có thể che giấu mẫu hình sai số rất khác nhau.</li><li>Chọn chỉ số từ chi phí sai số, trước khi mô hình hoá.</li><li>Luôn đặt baseline cạnh mô hình.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics" target="_blank" rel="noopener">scikit-learn — Chỉ số hồi quy</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/linear-regression/loss" target="_blank" rel="noopener">Google ML Crash Course — Hồi quy tuyến tính: hàm mất mát (MAE và MSE)</a></li><li><a href="https://en.wikipedia.org/wiki/Mean_absolute_percentage_error" target="_blank" rel="noopener">Wikipedia — Mean absolute percentage error (và vấn đề khi gần 0)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Sai số là 2, −2, 2, −2, 10. Tính MAE và RMSE.</li><li>Một mô hình có R² = −0,2 trên tập test. Nghĩa là gì, và bạn kiểm gì đầu tiên?</li><li>Một tiệm bánh dự báo số bánh sừng bò bán mỗi ngày; bánh ế tốn 5 nghìn mỗi cái, bán hụt tốn 15 nghìn mỗi cái. MAE có phải chỉ số đúng không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) MAE = 18/5 = 3,6; RMSE = √((4·4 + 100)/5) = √23,2 ≈ 4,82. 2) Nó tệ hơn việc luôn đoán trung bình của tập test — kiểm lỗi code, thứ tự cột bị đảo, dịch chuyển phân phối giữa train và test, hoặc mô hình quá khớp nặng. 3) Không hẳn: sai số bất đối xứng (dự báo thiếu tốn gấp 3), nên dùng hàm mất mát có trọng số chi phí hoặc quantile để đẩy dự báo lên cao hơn.</p></div>`);

const c82 = L('dsi201-ts-8-2',
  '8.2 — Classification metrics: confusion matrix, precision, recall, F1|||8.2 — Chỉ số phân loại: ma trận nhầm lẫn, precision, recall, F1',
  'Lớp dương 5%: “luôn âm” có độ chính xác 0,945 nhưng recall 0; hồi quy logistic: accuracy 0,962, precision 0,812, recall 0,394, F1 0,531; đọc ma trận nhầm lẫn và classification_report, macro vs weighted.',
  `<span class="eyebrow">DSI201 · Chapter 8 · Lesson 8.2</span>
<h2>Classification metrics: confusion matrix, precision, recall, F1</h2>
<p class="lead">For classification, accuracy is the metric everybody quotes and the one that most often misleads — especially when the interesting class is rare.</p>
<h3>🎯 Objectives</h3>
<ul><li>Build and read a confusion matrix.</li><li>Compute precision, recall, specificity and F1, and say which errors each one counts.</li><li>Explain the accuracy paradox for imbalanced data.</li></ul>
<h3>📖 Lecture</h3>
<p>Call the class we want to detect “positive” (fraud, failure, malignant, late). Every prediction falls in one of four cells:</p>
<div class="formula"><span class="lbl">Confusion matrix and derived metrics</span>TP = positive predicted positive · FN = positive missed · FP = negative flagged (false alarm) · TN = negative correctly cleared<br>Accuracy = (TP + TN)/n    Precision = TP/(TP + FP)    Recall (sensitivity) = TP/(TP + FN)    Specificity = TN/(TN + FP)    F1 = 2·P·R/(P + R)</div>
<p><strong>Precision</strong> answers “when the model raises an alarm, how often is it right?” — it matters when acting on an alarm is expensive (a manual investigation, blocking a card). <strong>Recall</strong> answers “of all the real positives, how many did we catch?” — it matters when a miss is expensive (a cancer, a machine failure). <strong>F1</strong> is their harmonic mean, a single number that is high only when both are high.</p>
<p>The data below mimic a rare-event problem: 5% positives.</p>
<pre><code class="language-python">from sklearn.datasets import make_classification
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, classification_report, confusion_matrix,
                             f1_score, precision_score, recall_score)
from sklearn.model_selection import train_test_split

# 5% positives, like fraudulent transactions or failing machines
X, y = make_classification(n_samples=6000, n_features=12, n_informative=5, weights=[0.95, 0.05],
                           class_sep=0.9, random_state=8)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, stratify=y, random_state=0)

for name, clf in [("always negative", DummyClassifier(strategy="most_frequent")),
                  ("logistic regression", LogisticRegression(max_iter=1000))]:
    pred = clf.fit(X_tr, y_tr).predict(X_te)
    print(f"{name}: accuracy={accuracy_score(y_te, pred):.3f} precision={precision_score(y_te, pred, zero_division=0):.3f} "
          f"recall={recall_score(y_te, pred):.3f} F1={f1_score(y_te, pred):.3f}")

print(confusion_matrix(y_te, pred))          # rows = truth (0, 1), columns = prediction (0, 1)
print(classification_report(y_te, pred, digits=3))</code></pre>
<div class="out">always negative: accuracy=0.945 precision=0.000 recall=0.000 F1=0.000
logistic regression: accuracy=0.962 precision=0.812 recall=0.394 F1=0.531
[[1692    9]
 [  60   39]]
              precision    recall  f1-score   support

           0      0.966     0.995     0.980      1701
           1      0.812     0.394     0.531        99

    accuracy                          0.962      1800
   macro avg      0.889     0.694     0.755      1800
weighted avg      0.957     0.962     0.955      1800</div>
<p><strong>The accuracy paradox.</strong> Predicting “negative” for everyone scores 0.945 accuracy and catches nothing (recall 0). The logistic model scores 0.962 — only 1.7 points better — yet it is a completely different tool: it catches 39 of the 99 positives (recall 0.394), and 39 of its 48 alarms are real (precision 0.812).</p>
<p><strong>Reading the matrix.</strong> In scikit-learn, rows are the truth and columns the prediction: 1,692 TN, 9 FP (first row); 60 FN, 39 TP (second row). The 60 missed positives are the headline problem; whether that is acceptable depends on costs (Lesson 8.3). The report also lists metrics for class 0 and two averages: <strong>macro</strong> (plain mean over classes, treating the rare class as equally important — 0.755 F1) and <strong>weighted</strong> (by class size, dominated by the majority — 0.955). For imbalanced problems, look at the positive class row and the macro average.</p>
<p><strong>Several classes.</strong> The matrix becomes K × K; precision and recall are computed per class, then averaged (macro, weighted or micro).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reporting accuracy for a rare-event problem without the base rate.</li><li>Confusing precision and recall — say them in words: “of the alarms…” vs “of the real cases…”.</li><li>Reading a confusion matrix with rows and columns swapped (some tools put the prediction on rows).</li><li>Quoting weighted-average F1 for an imbalanced problem — it mostly reflects the easy majority class.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>The confusion matrix (TP, FP, FN, TN) is the source of all classification metrics.</li><li>Precision = quality of alarms; recall = coverage of real positives; F1 balances them.</li><li>Accuracy is misleading with rare classes; always show the base rate.</li><li>Use per-class and macro-averaged metrics for imbalanced data.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall" target="_blank" rel="noopener">Google ML Crash Course — Accuracy, recall, precision and related metrics</a></li><li><a href="https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics" target="_blank" rel="noopener">scikit-learn — Classification metrics</a></li><li><a href="https://www.youtube.com/watch?v=Kdsp6soqA7o" target="_blank" rel="noopener">StatQuest — The Confusion Matrix</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>TP = 40, FP = 10, FN = 20, TN = 930. Compute accuracy, precision, recall and F1.</li><li>For a spam filter that moves mail to a spam folder, which matters more, precision or recall? And for an airport bag scanner?</li><li>Why can F1 be low even when accuracy is 0.96?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Accuracy = 970/1000 = 0.97; precision = 40/50 = 0.80; recall = 40/60 ≈ 0.667; F1 = 2·0.8·0.667/(1.467) ≈ 0.727. 2) Spam filter: precision — a real e-mail hidden in spam is costly; airport scanner: recall — missing a dangerous item is unacceptable, false alarms only cost a manual check. 3) Accuracy is dominated by the many easy negatives; F1 looks only at the rare positive class, where the model may miss many cases.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 8 · Bài 8.2</span>
<h2>Chỉ số phân loại: ma trận nhầm lẫn, precision, recall, F1</h2>
<p class="lead">Với bài toán phân loại, độ chính xác (accuracy) là chỉ số ai cũng trích dẫn và cũng là chỉ số hay đánh lừa nhất — nhất là khi lớp đáng quan tâm hiếm gặp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Lập và đọc ma trận nhầm lẫn.</li><li>Tính precision, recall, specificity và F1, và nói mỗi chỉ số đếm loại sai nào.</li><li>Giải thích nghịch lý độ chính xác với dữ liệu mất cân bằng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Gọi lớp ta muốn phát hiện là “dương” (gian lận, hỏng hóc, ác tính, trễ). Mỗi dự đoán rơi vào một trong bốn ô:</p>
<div class="formula"><span class="lbl">Ma trận nhầm lẫn và các chỉ số suy ra</span>TP = dương đoán dương · FN = dương bị bỏ sót · FP = âm bị báo động nhầm · TN = âm được loại đúng<br>Accuracy = (TP + TN)/n    Precision = TP/(TP + FP)    Recall (độ nhạy) = TP/(TP + FN)    Specificity = TN/(TN + FP)    F1 = 2·P·R/(P + R)</div>
<p><strong>Precision</strong> trả lời “khi mô hình báo động, nó đúng bao nhiêu phần?” — quan trọng khi hành động theo báo động tốn kém (điều tra thủ công, khoá thẻ). <strong>Recall</strong> trả lời “trong mọi ca dương thật, ta bắt được bao nhiêu?” — quan trọng khi bỏ sót tốn kém (ung thư, máy hỏng). <strong>F1</strong> là trung bình điều hoà của hai chỉ số, một con số chỉ cao khi cả hai cùng cao.</p>
<p>Dữ liệu dưới đây mô phỏng bài toán sự kiện hiếm: 5% dương.</p>
<pre><code class="language-python">from sklearn.datasets import make_classification
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, classification_report, confusion_matrix,
                             f1_score, precision_score, recall_score)
from sklearn.model_selection import train_test_split

# 5% positives, like fraudulent transactions or failing machines
X, y = make_classification(n_samples=6000, n_features=12, n_informative=5, weights=[0.95, 0.05],
                           class_sep=0.9, random_state=8)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, stratify=y, random_state=0)

for name, clf in [("always negative", DummyClassifier(strategy="most_frequent")),
                  ("logistic regression", LogisticRegression(max_iter=1000))]:
    pred = clf.fit(X_tr, y_tr).predict(X_te)
    print(f"{name}: accuracy={accuracy_score(y_te, pred):.3f} precision={precision_score(y_te, pred, zero_division=0):.3f} "
          f"recall={recall_score(y_te, pred):.3f} F1={f1_score(y_te, pred):.3f}")

print(confusion_matrix(y_te, pred))          # rows = truth (0, 1), columns = prediction (0, 1)
print(classification_report(y_te, pred, digits=3))</code></pre>
<div class="out">always negative: accuracy=0.945 precision=0.000 recall=0.000 F1=0.000
logistic regression: accuracy=0.962 precision=0.812 recall=0.394 F1=0.531
[[1692    9]
 [  60   39]]
              precision    recall  f1-score   support

           0      0.966     0.995     0.980      1701
           1      0.812     0.394     0.531        99

    accuracy                          0.962      1800
   macro avg      0.889     0.694     0.755      1800
weighted avg      0.957     0.962     0.955      1800</div>
<p><strong>Nghịch lý độ chính xác.</strong> Đoán “âm” cho mọi người đạt độ chính xác 0,945 mà không bắt được gì (recall 0). Mô hình logistic đạt 0,962 — chỉ hơn 1,7 điểm — nhưng là công cụ hoàn toàn khác: nó bắt được 39 trên 99 ca dương (recall 0,394), và 39 trên 48 lần báo động là thật (precision 0,812).</p>
<p><strong>Đọc ma trận.</strong> Trong scikit-learn, dòng là sự thật và cột là dự đoán: 1.692 TN, 9 FP (dòng đầu); 60 FN, 39 TP (dòng hai). 60 ca dương bị bỏ sót là vấn đề chính; có chấp nhận được không tuỳ chi phí (Bài 8.3). Báo cáo cũng liệt kê chỉ số cho lớp 0 và hai kiểu trung bình: <strong>macro</strong> (trung bình đơn giản qua các lớp, coi lớp hiếm quan trọng ngang nhau — F1 0,755) và <strong>weighted</strong> (theo cỡ lớp, bị lớp đa số chi phối — 0,955). Với bài toán mất cân bằng, hãy nhìn dòng của lớp dương và trung bình macro.</p>
<p><strong>Nhiều lớp.</strong> Ma trận thành K × K; precision và recall tính cho từng lớp, rồi lấy trung bình (macro, weighted hoặc micro).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Báo độ chính xác cho bài toán sự kiện hiếm mà không kèm tỉ lệ nền.</li><li>Lẫn precision với recall — hãy nói bằng lời: “trong các báo động…” và “trong các ca thật…”.</li><li>Đọc ma trận nhầm lẫn bị đảo dòng và cột (vài công cụ đặt dự đoán theo dòng).</li><li>Trích F1 trung bình weighted cho bài toán mất cân bằng — nó chủ yếu phản ánh lớp đa số dễ đoán.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ma trận nhầm lẫn (TP, FP, FN, TN) là nguồn của mọi chỉ số phân loại.</li><li>Precision = chất lượng báo động; recall = độ phủ ca dương thật; F1 cân bằng hai cái.</li><li>Độ chính xác đánh lừa khi lớp hiếm; luôn nêu tỉ lệ nền.</li><li>Dùng chỉ số theo lớp và trung bình macro cho dữ liệu mất cân bằng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall" target="_blank" rel="noopener">Google ML Crash Course — Accuracy, recall, precision và các chỉ số liên quan</a></li><li><a href="https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics" target="_blank" rel="noopener">scikit-learn — Chỉ số phân loại</a></li><li><a href="https://www.youtube.com/watch?v=Kdsp6soqA7o" target="_blank" rel="noopener">StatQuest — The Confusion Matrix</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>TP = 40, FP = 10, FN = 20, TN = 930. Tính accuracy, precision, recall và F1.</li><li>Với bộ lọc thư rác chuyển thư vào thư mục spam, precision hay recall quan trọng hơn? Còn máy soi hành lý ở sân bay?</li><li>Vì sao F1 có thể thấp dù độ chính xác là 0,96?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Accuracy = 970/1000 = 0,97; precision = 40/50 = 0,80; recall = 40/60 ≈ 0,667; F1 = 2·0,8·0,667/(1,467) ≈ 0,727. 2) Bộ lọc thư rác: precision — một email thật bị giấu vào spam là tốn kém; máy soi sân bay: recall — bỏ sót vật nguy hiểm là không chấp nhận được, báo nhầm chỉ tốn một lần kiểm tay. 3) Độ chính xác bị chi phối bởi rất nhiều ca âm dễ đoán; F1 chỉ nhìn lớp dương hiếm, nơi mô hình có thể bỏ sót nhiều ca.</p></div>`);

const c83 = L('dsi201-ts-8-3',
  '8.3 — Thresholds, ROC and PR curves, and choosing by cost|||8.3 — Ngưỡng, đường ROC và PR, và chọn theo chi phí',
  'Một mô hình xác suất cho nhiều bộ phân loại theo ngưỡng; ROC AUC 0,864 vs PR AUC 0,569 khi lớp dương 5,5%; quét ngưỡng với chi phí 50/10 → ngưỡng 0,3 rẻ nhất; Brier score và hiệu chỉnh xác suất.',
  `<span class="eyebrow">DSI201 · Chapter 8 · Lesson 8.3</span>
<h2>Thresholds, ROC and PR curves, and choosing by cost</h2>
<p class="lead">A model that outputs probabilities is not one classifier but a whole family — one per threshold. Threshold-free metrics judge the family; the cost of errors picks the member you deploy.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain how moving the threshold trades precision against recall.</li><li>Interpret ROC AUC and average precision (PR AUC), and know when each is informative.</li><li>Choose a threshold by expected cost and check probability calibration.</li></ul>
<h3>📖 Lecture</h3>
<p>Lesson 8.2 used the default threshold 0.5. Lower it and the model flags more cases: recall rises, precision falls. The <strong>ROC curve</strong> plots the true-positive rate (recall) against the false-positive rate (1 − specificity) for every threshold; the area under it, <strong>ROC AUC</strong>, equals the probability that a randomly chosen positive gets a higher score than a randomly chosen negative (0.5 = random ranking, 1 = perfect). The <strong>precision–recall curve</strong> plots precision against recall; its summary, <strong>average precision</strong> (PR AUC), has a baseline equal to the positive rate rather than 0.5.</p>
<pre><code class="language-python">import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, brier_score_loss, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=6000, n_features=12, n_informative=5, weights=[0.95, 0.05],
                           class_sep=0.9, random_state=8)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, stratify=y, random_state=0)
p = LogisticRegression(max_iter=1000).fit(X_tr, y_tr).predict_proba(X_te)[:, 1]

print("ROC AUC =", round(roc_auc_score(y_te, p), 3), "| average precision (PR AUC) =",
      round(average_precision_score(y_te, p), 3), "| positive rate =", round(y_te.mean(), 3))
print("Brier score =", round(brier_score_loss(y_te, p), 4))

# A missed positive costs 50, a false alarm costs 10 (same prices as Lesson 1.3)
print("thr   TP  FP  FN  precision recall  cost")
for t in [0.5, 0.3, 0.2, 0.1, 0.05]:
    tn, fp, fn, tp = confusion_matrix(y_te, (p &gt;= t).astype(int)).ravel()
    print(f"{t:4.2f} {tp:4d} {fp:3d} {fn:3d}   {tp / max(tp + fp, 1):.3f}    {tp / (tp + fn):.3f}  {50 * fn + 10 * fp:5d}")</code></pre>
<div class="out">ROC AUC = 0.864 | average precision (PR AUC) = 0.569 | positive rate = 0.055
Brier score = 0.034
thr   TP  FP  FN  precision recall  cost
0.50   39   9  60   0.812    0.394   3090
0.30   51  39  48   0.567    0.515   2790
0.20   56  72  43   0.438    0.566   2870
0.10   69 177  30   0.280    0.697   3270
0.05   75 353  24   0.175    0.758   4730</div>
<p><strong>Two AUCs, two stories.</strong> ROC AUC 0.864 sounds good. PR AUC 0.569 is more sober — but compare it with its own baseline, the positive rate 0.055: the model is ten times better than random at ranking positives, yet any threshold that catches most positives will raise many false alarms. With rare positives, ROC curves look flattering because the false-positive <em>rate</em> stays small even when false positives outnumber true ones; prefer PR curves and report both.</p>
<p><strong>Choosing the threshold by cost.</strong> Using the prices of Lesson 1.3 (a miss costs 50, a false alarm 10), the table shows the trade-off on 1,800 test cases. At 0.5 the model misses 60 positives (cost 3,090). At 0.3 it catches 12 more at the price of 30 extra false alarms, and the total cost falls to 2,790 — the cheapest of the thresholds tried. Lower still, false alarms grow faster than misses shrink, and cost rises again (4,730 at 0.05). The optimum depends only on the cost ratio, which is a <em>business</em> decision. In a real project, pick the threshold on validation data or with cross-validation (scikit-learn's <code>TunedThresholdClassifierCV</code> does this), then confirm it once on the test set — we used the test set here only to keep the example short.</p>
<div class="formula"><span class="lbl">Cost-based threshold</span>Expected cost(t) = c<sub>FN</sub>·FN(t) + c<sub>FP</sub>·FP(t)  → choose t with the lowest cost on validation data. For perfectly calibrated probabilities the optimum is t* = c<sub>FP</sub> / (c<sub>FP</sub> + c<sub>FN</sub>) = 10/60 ≈ 0.17.</div>
<p><strong>Calibration.</strong> If the model says 0.2 for 100 cases, about 20 should be positive. The <strong>Brier score</strong> (mean squared error of the probabilities, 0.034 here; lower is better) and a reliability diagram (<code>CalibrationDisplay</code>) check this. Logistic regression is usually well calibrated; boosted trees and SVMs often need <code>CalibratedClassifierCV</code>. Calibration matters whenever probabilities are used directly — expected cost, pricing, ranking for limited capacity.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Comparing models by ROC AUC alone on very imbalanced data.</li><li>Keeping the 0.5 threshold when error costs are unequal.</li><li>Tuning the threshold on the test set, then reporting test performance as unbiased.</li><li>Treating uncalibrated scores as probabilities in cost calculations.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>The threshold trades recall for precision; ROC and PR curves show all thresholds.</li><li>ROC AUC = ranking quality; PR AUC is more informative for rare positives (baseline = positive rate).</li><li>Choose the operating threshold by expected cost on validation data.</li><li>Check calibration (Brier score, reliability plot) before using probabilities directly.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc" target="_blank" rel="noopener">Google ML Crash Course — ROC and AUC</a></li><li><a href="https://scikit-learn.org/stable/modules/classification_threshold.html" target="_blank" rel="noopener">scikit-learn — Tuning the decision threshold for class prediction</a></li><li><a href="https://scikit-learn.org/stable/modules/calibration.html" target="_blank" rel="noopener">scikit-learn — Probability calibration</a></li><li><a href="https://www.youtube.com/watch?v=4jRBRDbJemM" target="_blank" rel="noopener">StatQuest — ROC and AUC, Clearly Explained</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>If a miss cost 100 and a false alarm 10, would the best threshold in the table move up or down? Compute the cost at 0.3 and 0.1.</li><li>A model has ROC AUC 0.50. What does that mean about its ranking?</li><li>Two models: A has PR AUC 0.57, B 0.52, and the positive rate is 0.055. Is B useless?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Down — misses become relatively more expensive. At 0.3: 100·48 + 10·39 = 5,190; at 0.1: 100·30 + 10·177 = 4,770, now cheaper than 0.3 (at 0.05: 2,400 + 3,530 = 5,930). 2) It ranks positives above negatives no better than chance. 3) No — both are about ten times the 0.055 baseline; A is better at ranking, but check whether the difference is larger than the variation across folds.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 8 · Bài 8.3</span>
<h2>Ngưỡng, đường ROC và PR, và chọn theo chi phí</h2>
<p class="lead">Một mô hình cho ra xác suất không phải là một bộ phân loại mà là cả một họ — mỗi ngưỡng một bộ. Các chỉ số không phụ thuộc ngưỡng chấm cả họ; chi phí sai lầm chọn ra thành viên được triển khai.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích dời ngưỡng đánh đổi precision với recall thế nào.</li><li>Diễn giải ROC AUC và average precision (PR AUC), biết khi nào mỗi cái có nhiều thông tin.</li><li>Chọn ngưỡng theo chi phí kỳ vọng và kiểm tra độ hiệu chỉnh của xác suất.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Bài 8.2 dùng ngưỡng mặc định 0,5. Hạ ngưỡng thì mô hình báo nhiều ca hơn: recall tăng, precision giảm. <strong>Đường ROC</strong> vẽ tỉ lệ dương thật (recall) theo tỉ lệ dương giả (1 − specificity) cho mọi ngưỡng; diện tích dưới đường, <strong>ROC AUC</strong>, bằng xác suất một ca dương chọn ngẫu nhiên có điểm cao hơn một ca âm chọn ngẫu nhiên (0,5 = xếp hạng ngẫu nhiên, 1 = hoàn hảo). <strong>Đường precision–recall</strong> vẽ precision theo recall; con số tóm tắt của nó, <strong>average precision</strong> (PR AUC), có baseline bằng tỉ lệ dương chứ không phải 0,5.</p>
<pre><code class="language-python">import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, brier_score_loss, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=6000, n_features=12, n_informative=5, weights=[0.95, 0.05],
                           class_sep=0.9, random_state=8)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, stratify=y, random_state=0)
p = LogisticRegression(max_iter=1000).fit(X_tr, y_tr).predict_proba(X_te)[:, 1]

print("ROC AUC =", round(roc_auc_score(y_te, p), 3), "| average precision (PR AUC) =",
      round(average_precision_score(y_te, p), 3), "| positive rate =", round(y_te.mean(), 3))
print("Brier score =", round(brier_score_loss(y_te, p), 4))

# A missed positive costs 50, a false alarm costs 10 (same prices as Lesson 1.3)
print("thr   TP  FP  FN  precision recall  cost")
for t in [0.5, 0.3, 0.2, 0.1, 0.05]:
    tn, fp, fn, tp = confusion_matrix(y_te, (p &gt;= t).astype(int)).ravel()
    print(f"{t:4.2f} {tp:4d} {fp:3d} {fn:3d}   {tp / max(tp + fp, 1):.3f}    {tp / (tp + fn):.3f}  {50 * fn + 10 * fp:5d}")</code></pre>
<div class="out">ROC AUC = 0.864 | average precision (PR AUC) = 0.569 | positive rate = 0.055
Brier score = 0.034
thr   TP  FP  FN  precision recall  cost
0.50   39   9  60   0.812    0.394   3090
0.30   51  39  48   0.567    0.515   2790
0.20   56  72  43   0.438    0.566   2870
0.10   69 177  30   0.280    0.697   3270
0.05   75 353  24   0.175    0.758   4730</div>
<p><strong>Hai AUC, hai câu chuyện.</strong> ROC AUC 0,864 nghe ổn. PR AUC 0,569 tỉnh táo hơn — nhưng hãy so với baseline của chính nó, tỉ lệ dương 0,055: mô hình xếp hạng ca dương tốt gấp mười lần ngẫu nhiên, nhưng ngưỡng nào bắt được phần lớn ca dương cũng sẽ kéo theo nhiều báo động nhầm. Với lớp dương hiếm, đường ROC trông đẹp vì <em>tỉ lệ</em> dương giả vẫn nhỏ ngay cả khi số dương giả nhiều hơn số dương thật; hãy ưu tiên đường PR và báo cả hai.</p>
<p><strong>Chọn ngưỡng theo chi phí.</strong> Dùng giá ở Bài 1.3 (bỏ sót tốn 50, báo nhầm tốn 10), bảng cho thấy sự đánh đổi trên 1.800 ca test. Ở 0,5 mô hình bỏ sót 60 ca dương (chi phí 3.090). Ở 0,3 nó bắt thêm 12 ca với giá thêm 30 báo động nhầm, và tổng chi phí giảm còn 2.790 — rẻ nhất trong các ngưỡng đã thử. Hạ nữa thì báo nhầm tăng nhanh hơn bỏ sót giảm, và chi phí tăng lại (4.730 ở 0,05). Điểm tối ưu chỉ phụ thuộc tỉ lệ chi phí, đó là quyết định <em>nghiệp vụ</em>. Trong dự án thật, hãy chọn ngưỡng trên dữ liệu validation hoặc bằng kiểm định chéo (<code>TunedThresholdClassifierCV</code> của scikit-learn làm việc này), rồi xác nhận một lần trên tập test — ở đây ta dùng tập test chỉ để ví dụ ngắn gọn.</p>
<div class="formula"><span class="lbl">Ngưỡng theo chi phí</span>Chi phí kỳ vọng(t) = c<sub>FN</sub>·FN(t) + c<sub>FP</sub>·FP(t)  → chọn t có chi phí thấp nhất trên dữ liệu validation. Với xác suất được hiệu chỉnh hoàn hảo, ngưỡng tối ưu là t* = c<sub>FP</sub> / (c<sub>FP</sub> + c<sub>FN</sub>) = 10/60 ≈ 0,17.</div>
<p><strong>Hiệu chỉnh xác suất (calibration).</strong> Nếu mô hình nói 0,2 cho 100 ca, khoảng 20 ca phải là dương. <strong>Brier score</strong> (sai số bình phương trung bình của xác suất, ở đây 0,034; càng thấp càng tốt) và biểu đồ độ tin cậy (<code>CalibrationDisplay</code>) kiểm tra điều này. Hồi quy logistic thường được hiệu chỉnh tốt; cây boosting và SVM hay cần <code>CalibratedClassifierCV</code>. Hiệu chỉnh quan trọng mỗi khi xác suất được dùng trực tiếp — chi phí kỳ vọng, định giá, xếp hạng khi năng lực xử lý có hạn.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>So mô hình chỉ bằng ROC AUC trên dữ liệu rất mất cân bằng.</li><li>Giữ ngưỡng 0,5 khi chi phí các loại sai khác nhau.</li><li>Chỉnh ngưỡng trên tập test rồi báo hiệu năng test như thể không chệch.</li><li>Coi điểm số chưa hiệu chỉnh là xác suất trong phép tính chi phí.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ngưỡng đánh đổi recall lấy precision; đường ROC và PR thể hiện mọi ngưỡng.</li><li>ROC AUC = chất lượng xếp hạng; PR AUC nhiều thông tin hơn khi lớp dương hiếm (baseline = tỉ lệ dương).</li><li>Chọn ngưỡng vận hành theo chi phí kỳ vọng trên dữ liệu validation.</li><li>Kiểm hiệu chỉnh (Brier score, biểu đồ độ tin cậy) trước khi dùng xác suất trực tiếp.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc" target="_blank" rel="noopener">Google ML Crash Course — ROC và AUC</a></li><li><a href="https://scikit-learn.org/stable/modules/classification_threshold.html" target="_blank" rel="noopener">scikit-learn — Chỉnh ngưỡng quyết định cho dự đoán lớp</a></li><li><a href="https://scikit-learn.org/stable/modules/calibration.html" target="_blank" rel="noopener">scikit-learn — Hiệu chỉnh xác suất</a></li><li><a href="https://www.youtube.com/watch?v=4jRBRDbJemM" target="_blank" rel="noopener">StatQuest — ROC and AUC, Clearly Explained</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Nếu bỏ sót tốn 100 và báo nhầm tốn 10, ngưỡng tốt nhất trong bảng dời lên hay xuống? Tính chi phí ở 0,3 và 0,1.</li><li>Một mô hình có ROC AUC 0,50. Điều đó nói gì về cách nó xếp hạng?</li><li>Hai mô hình: A có PR AUC 0,57, B có 0,52, tỉ lệ dương là 0,055. B có vô dụng không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Xuống — bỏ sót trở nên đắt hơn tương đối. Ở 0,3: 100·48 + 10·39 = 5.190; ở 0,1: 100·30 + 10·177 = 4.770, giờ rẻ hơn 0,3 (ở 0,05: 2.400 + 3.530 = 5.930). 2) Nó xếp ca dương trên ca âm không hơn gì ngẫu nhiên. 3) Không — cả hai đều gấp khoảng mười lần baseline 0,055; A xếp hạng tốt hơn, nhưng hãy kiểm chênh lệch có lớn hơn dao động giữa các phần CV không.</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Evaluation metrics|||Quiz — Chương 8: Chỉ số đánh giá',
  'Quiz 8 câu: MAE vs RMSE, R² âm, MAPE, nghịch lý độ chính xác, precision vs recall, đọc ma trận nhầm lẫn, PR AUC với lớp hiếm, ngưỡng theo chi phí.', [
  Q('q1', 'Two models have the same MAE, but model B has a much larger RMSE. This means…|||Hai mô hình cùng MAE, nhưng mô hình B có RMSE lớn hơn nhiều. Điều này nghĩa là…',
    ['B makes a few large errors|||B có vài sai số lớn', 'B is always better|||B luôn tốt hơn', 'B has no errors|||B không có sai số', 'A has negative R²|||A có R² âm'], 0,
    'Squaring magnifies large errors, so RMSE ≫ MAE signals big misses.|||Bình phương phóng đại sai số lớn, nên RMSE ≫ MAE báo hiệu lần trật lớn.'),
  Q('q2', 'A test R² of −0.2 means the model is…|||R² test bằng −0,2 nghĩa là mô hình…',
    ['worse than predicting the mean|||tệ hơn đoán trung bình', 'explaining 20% of the variance|||giải thích 20% phương sai', 'perfect|||hoàn hảo', 'impossible to compute|||không tính được'], 0,
    'R² compares squared error with that of the mean baseline.|||R² so bình phương sai số với baseline trung bình.'),
  Q('q3', 'Why is MAPE dangerous for products that often sell 0 units?|||Vì sao MAPE nguy hiểm với mặt hàng thường bán 0 sản phẩm?',
    ['It divides by the true value, which can be zero|||Nó chia cho giá trị thật, có thể bằng 0', 'It ignores large errors|||Nó bỏ qua sai số lớn', 'It is in the wrong units|||Nó sai đơn vị', 'It cannot be negative|||Nó không thể âm'], 0,
    'Percentage errors are undefined or explode near zero.|||Sai số phần trăm không xác định hoặc bùng nổ gần 0.'),
  Q('q4', 'With 5% positives, “always negative” has accuracy…|||Với 5% ca dương, “luôn âm” có độ chính xác…',
    ['about 0.95 with recall 0|||khoảng 0,95 với recall 0', 'about 0.05|||khoảng 0,05', '0.5|||0,5', '1.0|||1,0'], 0,
    'The accuracy paradox: high accuracy, useless detector.|||Nghịch lý độ chính xác: chính xác cao, bộ phát hiện vô dụng.'),
  Q('q5', '“Of all alarms raised, how many were real?” is…|||“Trong mọi báo động, bao nhiêu là thật?” là…',
    ['precision|||precision', 'recall|||recall', 'specificity|||specificity', 'accuracy|||accuracy'], 0,
    'Precision = TP / (TP + FP).|||Precision = TP / (TP + FP).'),
  Q('q6', 'In scikit-learn’s confusion_matrix for labels (0, 1), the bottom-left cell is…|||Trong confusion_matrix của scikit-learn với nhãn (0, 1), ô dưới-trái là…',
    ['false negatives|||âm giả (bỏ sót)', 'false positives|||dương giả (báo nhầm)', 'true positives|||dương thật', 'true negatives|||âm thật'], 0,
    'Rows = truth, columns = prediction: row 1 (positive), column 0 (predicted negative).|||Dòng = sự thật, cột = dự đoán: dòng 1 (dương), cột 0 (đoán âm).'),
  Q('q7', 'For very rare positives, which summary is usually more informative?|||Khi ca dương rất hiếm, con số tóm tắt nào thường nhiều thông tin hơn?',
    ['PR AUC (average precision)|||PR AUC (average precision)', 'ROC AUC|||ROC AUC', 'Accuracy|||Accuracy', 'R²|||R²'], 0,
    'Its baseline is the positive rate, and it reflects false alarms among alarms.|||Baseline của nó là tỉ lệ dương, và nó phản ánh báo nhầm trong các báo động.'),
  Q('q8', 'A miss costs 50 and a false alarm 10. Compared with 0.5, the cost-optimal threshold is usually…|||Bỏ sót tốn 50, báo nhầm tốn 10. So với 0,5, ngưỡng tối ưu chi phí thường…',
    ['lower|||thấp hơn', 'higher|||cao hơn', 'exactly 0.5|||đúng 0,5', 'undefined|||không xác định'], 0,
    'Misses are expensive, so flag more cases; for calibrated scores t* ≈ 10/60.|||Bỏ sót đắt nên báo nhiều ca hơn; với xác suất đã hiệu chỉnh t* ≈ 10/60.'),
]);

const ch8 = {
  title: 'Chapter 8 — Evaluation metrics|||Chương 8 — Chỉ số đánh giá mô hình',
  description: 'Chỉ số hồi quy (MAE, RMSE, R², MAPE), ma trận nhầm lẫn và precision/recall/F1, nghịch lý độ chính xác, ROC/PR AUC, chọn ngưỡng theo chi phí, hiệu chỉnh xác suất.',
  lessons: [c81, c82, c83, q8],
};


// ───────────────────────────── Chương 9 — Học không giám sát ─────────────────────────────
const c91 = L('dsi201-ts-9-1',
  '9.1 — Clustering with k-means: finding groups without labels|||9.1 — Phân cụm bằng k-means: tìm nhóm khi không có nhãn',
  'Thuật toán k-means (gán – cập nhật tâm), hàm mục tiêu inertia, vì sao phải chuẩn hoá (wine: ARI 0,371 → 0,897), n_init, mô tả cụm bằng đơn vị gốc để chuyên gia đặt tên.',
  `<span class="eyebrow">DSI201 · Chapter 9 · Lesson 9.1</span>
<h2>Clustering with k-means: finding groups without labels</h2>
<p class="lead">In unsupervised learning there is no target to predict. The goal is to discover structure — groups of similar rows (clustering) or a few directions that summarise many columns (PCA, Lesson 9.3).</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe the k-means algorithm and what it minimises.</li><li>Show why features must be scaled before clustering.</li><li>Profile clusters so that people can interpret and use them.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>The algorithm.</strong> Choose k. Place k centres (smartly spread out — “k-means++”). Then repeat two steps until nothing changes: (1) <em>assign</em> each point to its nearest centre; (2) <em>update</em> each centre to the mean of its points. Each step can only decrease the objective, the <strong>inertia</strong> (within-cluster sum of squared distances), so the algorithm converges — but possibly to a local minimum, which is why scikit-learn restarts it several times (<code>n_init</code>) and keeps the best run.</p>
<div class="formula"><span class="lbl">k-means objective</span>minimise inertia = ∑<sub>j=1..k</sub> ∑<sub>x ∈ C<sub>j</sub></sub> ‖x − μ<sub>j</sub>‖<sup>2</sup>      μ<sub>j</sub> = mean of the points in cluster C<sub>j</sub></div>
<p>Data: 178 Italian wines with 13 chemical measurements (bundled with scikit-learn). The wines come from three cultivars; we hide that label while clustering and use it afterwards only to check whether the clusters found something real — a luxury you rarely have in practice.</p>
<pre><code class="language-python">import pandas as pd
from sklearn.cluster import KMeans
from sklearn.datasets import load_wine
from sklearn.metrics import adjusted_rand_score
from sklearn.preprocessing import StandardScaler

wine = load_wine(as_frame=True)
X = wine.data                     # 178 wines, 13 chemical measurements; we IGNORE the labels while clustering
print(X[["alcohol", "malic_acid", "magnesium", "proline"]].describe().loc[["mean", "std"]].round(2))

# Without scaling, proline (values in the hundreds) dominates every distance
raw = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
Xs = StandardScaler().fit_transform(X)
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(Xs)

# Only to CHECK the result, compare with the cultivar labels we kept aside
print("agreement with cultivars (ARI): raw =", round(adjusted_rand_score(wine.target, raw.labels_), 3),
      "| scaled =", round(adjusted_rand_score(wine.target, km.labels_), 3))

# Describe each cluster in the original units -&gt; this is what you hand to a domain expert
profile = X.assign(cluster=km.labels_).groupby("cluster")[["alcohol", "flavanoids", "color_intensity", "proline"]].mean()
print(profile.round(2).assign(n=pd.Series(km.labels_).value_counts().sort_index()))</code></pre>
<div class="out">      alcohol  malic_acid  magnesium  proline
mean    13.00        2.34      99.74   746.89
std      0.81        1.12      14.28   314.91
agreement with cultivars (ARI): raw = 0.371 | scaled = 0.897
         alcohol  flavanoids  color_intensity  proline   n
cluster                                                   
0          12.25        2.05             2.97   510.17  65
1          13.13        0.82             7.23   619.06  51
2          13.68        3.00             5.45  1100.23  62</div>
<p><strong>Scaling is not optional.</strong> Proline has a standard deviation of 315, alcohol 0.81. Euclidean distance on raw values is essentially “difference in proline”, so the raw clustering agrees poorly with the cultivars (adjusted Rand index 0.371; 1 = identical partition, 0 = chance). After standardising every feature, the same algorithm recovers the cultivars almost perfectly (ARI 0.897) — without ever seeing them. Distance-based methods (k-means, kNN, DBSCAN, PCA) need comparable units.</p>
<p><strong>Profiling.</strong> A cluster number means nothing to a business. Describe each cluster by the means (or medians) of key features in their <em>original units</em>, plus its size: cluster 2 (62 wines) is high in alcohol, flavanoids and proline; cluster 1 (51) has low flavanoids and the deepest colour; cluster 0 (65) is lighter in alcohol and colour. A domain expert can now name them, and you can check whether the groups are useful for a decision (different marketing, different quality control).</p>
<p><strong>Assumptions.</strong> k-means looks for compact, roughly round clusters of similar size, and every point must belong to some cluster. Outliers pull centres; elongated or nested shapes break it (Lesson 9.2). Clusters are a <em>description</em> of this dataset, not a law of nature — rerun with another seed or subsample and check that they are stable.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Clustering unscaled features.</li><li>Using one-hot categories with k-means without thinking about what “distance” means for them.</li><li>Presenting clusters as facts without checking stability or usefulness.</li><li>Choosing k because the output “looks nice” (Lesson 9.2 gives tools).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>k-means alternates assign-to-nearest-centre and recompute-centres, minimising inertia.</li><li>Standardise features; use several initialisations.</li><li>Profile clusters in original units with their sizes.</li><li>Clusters are descriptions to be validated, not truths.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/clustering.html" target="_blank" rel="noopener">scikit-learn — Clustering</a></li><li><a href="https://jakevdp.github.io/PythonDataScienceHandbook/05.11-k-means.html" target="_blank" rel="noopener">VanderPlas — In Depth: k-Means Clustering</a></li><li><a href="https://www.youtube.com/watch?v=4b5d3muPQmA" target="_blank" rel="noopener">StatQuest — K-means clustering</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Points 1, 2, 3, 10, 11, 12 on a line, k = 2, starting centres 1 and 2. Run k-means by hand until it stops.</li><li>Why can inertia never increase during one assign + update cycle?</li><li>Your clusters change completely when you drop 10% of the rows at random. What does that tell you?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Assign: {1} to 1, {2, 3, 10, 11, 12} to 2. Update: centres 1 and 7.6. Assign: {1, 2, 3} to 1 (3 is closer to 1 than to 7.6), {10, 11, 12} to 7.6. Update: centres 2 and 11. Assign: unchanged → stop. Clusters {1, 2, 3} and {10, 11, 12}. 2) Assigning each point to its nearest centre cannot increase its distance; moving a centre to the mean minimises the sum of squared distances to its points. 3) The clusters are not stable structure — maybe there are no real clusters, k is wrong, or scaling/features are poorly chosen.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 9 · Bài 9.1</span>
<h2>Phân cụm bằng k-means: tìm nhóm khi không có nhãn</h2>
<p class="lead">Trong học không giám sát không có mục tiêu để dự đoán. Mục đích là khám phá cấu trúc — các nhóm dòng giống nhau (phân cụm) hoặc vài hướng tóm tắt nhiều cột (PCA, Bài 9.3).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả thuật toán k-means và đại lượng nó cực tiểu.</li><li>Chỉ ra vì sao phải chuẩn hoá đặc trưng trước khi phân cụm.</li><li>Mô tả các cụm để con người diễn giải và sử dụng được.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Thuật toán.</strong> Chọn k. Đặt k tâm (rải ra một cách thông minh — “k-means++”). Rồi lặp hai bước tới khi không đổi: (1) <em>gán</em> mỗi điểm cho tâm gần nhất; (2) <em>cập nhật</em> mỗi tâm thành trung bình các điểm của nó. Mỗi bước chỉ có thể làm giảm hàm mục tiêu, <strong>inertia</strong> (tổng bình phương khoảng cách trong cụm), nên thuật toán hội tụ — nhưng có thể vào cực tiểu địa phương, vì thế scikit-learn chạy lại nhiều lần (<code>n_init</code>) và giữ lần tốt nhất.</p>
<div class="formula"><span class="lbl">Hàm mục tiêu k-means</span>cực tiểu inertia = ∑<sub>j=1..k</sub> ∑<sub>x ∈ C<sub>j</sub></sub> ‖x − μ<sub>j</sub>‖<sup>2</sup>      μ<sub>j</sub> = trung bình các điểm trong cụm C<sub>j</sub></div>
<p>Dữ liệu: 178 loại rượu vang Ý với 13 chỉ số hoá học (có sẵn trong scikit-learn). Rượu thuộc ba giống nho; ta giấu nhãn đó khi phân cụm và chỉ dùng sau đó để kiểm xem các cụm có tìm ra điều gì thật không — một sự xa xỉ hiếm khi có ngoài thực tế.</p>
<pre><code class="language-python">import pandas as pd
from sklearn.cluster import KMeans
from sklearn.datasets import load_wine
from sklearn.metrics import adjusted_rand_score
from sklearn.preprocessing import StandardScaler

wine = load_wine(as_frame=True)
X = wine.data                     # 178 wines, 13 chemical measurements; we IGNORE the labels while clustering
print(X[["alcohol", "malic_acid", "magnesium", "proline"]].describe().loc[["mean", "std"]].round(2))

# Without scaling, proline (values in the hundreds) dominates every distance
raw = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
Xs = StandardScaler().fit_transform(X)
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(Xs)

# Only to CHECK the result, compare with the cultivar labels we kept aside
print("agreement with cultivars (ARI): raw =", round(adjusted_rand_score(wine.target, raw.labels_), 3),
      "| scaled =", round(adjusted_rand_score(wine.target, km.labels_), 3))

# Describe each cluster in the original units -&gt; this is what you hand to a domain expert
profile = X.assign(cluster=km.labels_).groupby("cluster")[["alcohol", "flavanoids", "color_intensity", "proline"]].mean()
print(profile.round(2).assign(n=pd.Series(km.labels_).value_counts().sort_index()))</code></pre>
<div class="out">      alcohol  malic_acid  magnesium  proline
mean    13.00        2.34      99.74   746.89
std      0.81        1.12      14.28   314.91
agreement with cultivars (ARI): raw = 0.371 | scaled = 0.897
         alcohol  flavanoids  color_intensity  proline   n
cluster                                                   
0          12.25        2.05             2.97   510.17  65
1          13.13        0.82             7.23   619.06  51
2          13.68        3.00             5.45  1100.23  62</div>
<p><strong>Chuẩn hoá không phải tuỳ chọn.</strong> Proline có độ lệch chuẩn 315, alcohol 0,81. Khoảng cách Euclid trên giá trị thô về cơ bản là “chênh lệch proline”, nên phân cụm thô khớp kém với giống nho (chỉ số Rand hiệu chỉnh ARI 0,371; 1 = phân hoạch trùng khớp, 0 = ngẫu nhiên). Sau khi chuẩn hoá mọi đặc trưng, cùng thuật toán tìm lại giống nho gần như hoàn hảo (ARI 0,897) — mà chưa hề nhìn thấy chúng. Các phương pháp dựa trên khoảng cách (k-means, kNN, DBSCAN, PCA) cần đơn vị tương đương.</p>
<p><strong>Mô tả cụm.</strong> Số hiệu cụm chẳng có nghĩa gì với doanh nghiệp. Hãy mô tả mỗi cụm bằng trung bình (hoặc trung vị) các đặc trưng chính theo <em>đơn vị gốc</em>, kèm cỡ cụm: cụm 2 (62 loại) cao về alcohol, flavanoids và proline; cụm 1 (51) ít flavanoids và màu đậm nhất; cụm 0 (65) nhẹ hơn về alcohol và màu. Giờ chuyên gia có thể đặt tên cho chúng, và bạn kiểm xem các nhóm có hữu ích cho một quyết định không (tiếp thị khác nhau, kiểm soát chất lượng khác nhau).</p>
<p><strong>Giả định.</strong> k-means tìm các cụm gọn, gần tròn, cỡ tương tự nhau, và mọi điểm đều phải thuộc một cụm nào đó. Ngoại lai kéo lệch tâm; hình dạng dài hay lồng nhau làm nó hỏng (Bài 9.2). Cụm là <em>mô tả</em> của bộ dữ liệu này, không phải định luật tự nhiên — chạy lại với seed khác hay mẫu con khác và kiểm xem chúng có ổn định không.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Phân cụm trên đặc trưng chưa chuẩn hoá.</li><li>Dùng biến one-hot với k-means mà không nghĩ “khoảng cách” nghĩa là gì với chúng.</li><li>Trình bày cụm như sự thật mà không kiểm tính ổn định hay tính hữu ích.</li><li>Chọn k vì output “trông đẹp” (Bài 9.2 cho công cụ).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>k-means luân phiên gán-về-tâm-gần-nhất và tính-lại-tâm, cực tiểu inertia.</li><li>Chuẩn hoá đặc trưng; dùng nhiều lần khởi tạo.</li><li>Mô tả cụm theo đơn vị gốc kèm cỡ cụm.</li><li>Cụm là mô tả cần được kiểm chứng, không phải chân lý.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/clustering.html" target="_blank" rel="noopener">scikit-learn — Phân cụm</a></li><li><a href="https://jakevdp.github.io/PythonDataScienceHandbook/05.11-k-means.html" target="_blank" rel="noopener">VanderPlas — Tìm hiểu sâu: phân cụm k-Means</a></li><li><a href="https://www.youtube.com/watch?v=4b5d3muPQmA" target="_blank" rel="noopener">StatQuest — K-means clustering</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Các điểm 1, 2, 3, 10, 11, 12 trên một đường thẳng, k = 2, tâm ban đầu 1 và 2. Chạy k-means bằng tay tới khi dừng.</li><li>Vì sao inertia không bao giờ tăng trong một vòng gán + cập nhật?</li><li>Các cụm thay đổi hoàn toàn khi bạn bỏ ngẫu nhiên 10% số dòng. Điều đó cho bạn biết gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Gán: {1} về 1, {2, 3, 10, 11, 12} về 2. Cập nhật: tâm 1 và 7,6. Gán: {1, 2, 3} về 1 (3 gần 1 hơn 7,6), {10, 11, 12} về 7,6. Cập nhật: tâm 2 và 11. Gán: không đổi → dừng. Các cụm {1, 2, 3} và {10, 11, 12}. 2) Gán mỗi điểm về tâm gần nhất không thể làm tăng khoảng cách của nó; dời tâm về trung bình cực tiểu tổng bình phương khoảng cách tới các điểm của nó. 3) Các cụm không phải cấu trúc ổn định — có thể không có cụm thật, k sai, hoặc chuẩn hoá/đặc trưng chọn chưa tốt.</p></div>`);

const c92 = L('dsi201-ts-9-2',
  '9.2 — Choosing k and beyond k-means: silhouette, hierarchical clustering, DBSCAN|||9.2 — Chọn k và vượt ra ngoài k-means: silhouette, phân cụm phân cấp, DBSCAN',
  'Inertia luôn giảm theo k (khuỷu tay), silhouette cao nhất ở k = 3 (0,285); hai nửa vầng trăng: k-means ARI 0,274, phân cấp single-link và DBSCAN ARI 1,000; điểm nhiễu; chọn thuật toán theo hình dạng cụm.',
  `<span class="eyebrow">DSI201 · Chapter 9 · Lesson 9.2</span>
<h2>Choosing k and beyond k-means: silhouette, hierarchical clustering, DBSCAN</h2>
<p class="lead">k-means needs you to choose k and assumes round clusters. This lesson gives tools to choose k and two algorithms that make different assumptions.</p>
<h3>🎯 Objectives</h3>
<ul><li>Use the elbow of inertia and the silhouette score to choose k.</li><li>Explain hierarchical (agglomerative) clustering and DBSCAN.</li><li>Match the algorithm to the expected shape of the clusters.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Inertia and the elbow.</strong> Inertia always decreases as k grows (with k = n it is 0), so you cannot simply minimise it. Look for an “elbow” where adding clusters stops helping much. <strong>Silhouette</strong> is better behaved: for each point, a = mean distance to its own cluster, b = mean distance to the nearest other cluster, s = (b − a)/max(a, b). s near 1 means well placed, near 0 on a border, negative probably in the wrong cluster. The average silhouette can be compared across k.</p>
<pre><code class="language-python">from sklearn.cluster import DBSCAN, AgglomerativeClustering, KMeans
from sklearn.datasets import load_wine, make_moons
from sklearn.metrics import adjusted_rand_score, silhouette_score
from sklearn.preprocessing import StandardScaler

Xs = StandardScaler().fit_transform(load_wine().data)
print(" k   inertia  silhouette")
for k in range(2, 7):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(Xs)
    print(f"{k:2d}  {km.inertia_:8.1f}   {silhouette_score(Xs, km.labels_):.3f}")

# Shapes k-means cannot see: two interleaving half-moons
X, y = make_moons(n_samples=400, noise=0.06, random_state=0)
models = {
    "k-means (k=2)": KMeans(n_clusters=2, n_init=10, random_state=0),
    "agglomerative (single link)": AgglomerativeClustering(n_clusters=2, linkage="single"),
    "DBSCAN (eps=0.2)": DBSCAN(eps=0.2, min_samples=5),
}
for name, m in models.items():
    labels = m.fit_predict(X)
    n_clusters = len(set(labels) - {-1})
    print(f"{name:28s} clusters={n_clusters}  noise points={(labels == -1).sum():3d}  ARI={adjusted_rand_score(y, labels):.3f}")</code></pre>
<div class="out"> k   inertia  silhouette
 2    1659.0   0.268
 3    1277.9   0.285
 4    1180.7   0.246
 5    1110.4   0.203
 6    1044.5   0.196
k-means (k=2)                clusters=2  noise points=  0  ARI=0.274
agglomerative (single link)  clusters=2  noise points=  0  ARI=1.000
DBSCAN (eps=0.2)             clusters=2  noise points=  0  ARI=1.000</div>
<p><strong>Choosing k for the wines.</strong> Inertia falls steeply from k = 2 to 3 (1,659 → 1,278) and then slowly — an elbow at 3. The silhouette peaks at k = 3 (0.285) too. Both agree with what we know (three cultivars), but note that 0.285 is modest: the groups overlap. In practice combine these numbers with usefulness: three segments that a team can act on beat seven that it cannot.</p>
<p><strong>Hierarchical (agglomerative) clustering</strong> starts with every point as its own cluster and repeatedly merges the two closest clusters, producing a tree (dendrogram) that you can cut at any level — you see all values of k at once. The <em>linkage</em> defines “closest”: <em>single</em> (closest pair of points — follows chains and curved shapes), <em>complete</em> (farthest pair), <em>average</em>, or <em>Ward</em> (merge that increases inertia least — similar to k-means).</p>
<p><strong>DBSCAN</strong> defines clusters as dense regions: a point with at least <code>min_samples</code> neighbours within radius <code>eps</code> is a core point; clusters grow by connecting core points; points in sparse regions are labelled noise (−1). It finds the number of clusters itself and handles any shape, but needs <code>eps</code> chosen for the data's scale and struggles when clusters have very different densities.</p>
<p><strong>The half-moons test.</strong> Two interleaving crescents: k-means cuts them with a straight line (ARI 0.274) because it assumes round blobs. Single-linkage agglomerative clustering and DBSCAN follow the curved dense shapes and recover both moons exactly (ARI 1.000), DBSCAN with zero noise points at this <code>eps</code>.</p>
<div class="formula"><span class="lbl">Silhouette of one point</span>s = (b − a) / max(a, b)   a = mean distance to own cluster, b = mean distance to nearest other cluster;  −1 ≤ s ≤ 1</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Choosing k by minimum inertia (always the largest k).</li><li>Using DBSCAN on unscaled features, so <code>eps</code> means different things per column.</li><li>Expecting k-means to find elongated or nested groups.</li><li>Forgetting that hierarchical clustering on n points needs about n<sup>2</sup> memory — fine for thousands, not for millions.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Choose k with the elbow and the silhouette, then check usefulness.</li><li>Agglomerative clustering builds a merge tree; linkage controls cluster shape.</li><li>DBSCAN finds dense regions of any shape and marks noise; tune <code>eps</code>.</li><li>Pick the algorithm by the cluster shapes you expect.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html" target="_blank" rel="noopener">scikit-learn example — Selecting the number of clusters with silhouette analysis</a></li><li><a href="https://scikit-learn.org/stable/auto_examples/cluster/plot_cluster_comparison.html" target="_blank" rel="noopener">scikit-learn example — Comparing clustering algorithms on toy datasets</a></li><li><a href="https://www.youtube.com/watch?v=RDZUdRSDOok" target="_blank" rel="noopener">StatQuest — Clustering with DBSCAN, Clearly Explained</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A point has a = 2 and b = 5. Compute its silhouette. What if a = 5 and b = 2?</li><li>GPS points of delivery drop-offs in a city: you want “hot spots” of any shape and to ignore isolated drop-offs. Which algorithm?</li><li>Why does single linkage succeed on the moons while Ward linkage would behave like k-means?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (5 − 2)/5 = 0.6 (well placed); (2 − 5)/5 = −0.6 (probably in the wrong cluster). 2) DBSCAN — finds dense regions of arbitrary shape and labels isolated points as noise (with an <code>eps</code> in metres, using a suitable distance for coordinates). 3) Single linkage merges by the closest pair of points, so it can follow a chain of neighbours along a curve; Ward merges to keep clusters compact (minimum increase in inertia), favouring round groups.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 9 · Bài 9.2</span>
<h2>Chọn k và vượt ra ngoài k-means: silhouette, phân cụm phân cấp, DBSCAN</h2>
<p class="lead">k-means bắt bạn chọn k và giả định cụm tròn. Bài này cho công cụ chọn k và hai thuật toán có giả định khác.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng khuỷu tay của inertia và điểm silhouette để chọn k.</li><li>Giải thích phân cụm phân cấp (agglomerative) và DBSCAN.</li><li>Chọn thuật toán khớp với hình dạng cụm mong đợi.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Inertia và khuỷu tay.</strong> Inertia luôn giảm khi k tăng (k = n thì bằng 0), nên không thể chỉ cực tiểu nó. Hãy tìm “khuỷu tay” nơi thêm cụm không còn giúp nhiều. <strong>Silhouette</strong> ổn hơn: với mỗi điểm, a = khoảng cách trung bình tới cụm của nó, b = khoảng cách trung bình tới cụm khác gần nhất, s = (b − a)/max(a, b). s gần 1 là đặt đúng chỗ, gần 0 là nằm trên biên, âm là có lẽ sai cụm. Silhouette trung bình có thể so giữa các k.</p>
<pre><code class="language-python">from sklearn.cluster import DBSCAN, AgglomerativeClustering, KMeans
from sklearn.datasets import load_wine, make_moons
from sklearn.metrics import adjusted_rand_score, silhouette_score
from sklearn.preprocessing import StandardScaler

Xs = StandardScaler().fit_transform(load_wine().data)
print(" k   inertia  silhouette")
for k in range(2, 7):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(Xs)
    print(f"{k:2d}  {km.inertia_:8.1f}   {silhouette_score(Xs, km.labels_):.3f}")

# Shapes k-means cannot see: two interleaving half-moons
X, y = make_moons(n_samples=400, noise=0.06, random_state=0)
models = {
    "k-means (k=2)": KMeans(n_clusters=2, n_init=10, random_state=0),
    "agglomerative (single link)": AgglomerativeClustering(n_clusters=2, linkage="single"),
    "DBSCAN (eps=0.2)": DBSCAN(eps=0.2, min_samples=5),
}
for name, m in models.items():
    labels = m.fit_predict(X)
    n_clusters = len(set(labels) - {-1})
    print(f"{name:28s} clusters={n_clusters}  noise points={(labels == -1).sum():3d}  ARI={adjusted_rand_score(y, labels):.3f}")</code></pre>
<div class="out"> k   inertia  silhouette
 2    1659.0   0.268
 3    1277.9   0.285
 4    1180.7   0.246
 5    1110.4   0.203
 6    1044.5   0.196
k-means (k=2)                clusters=2  noise points=  0  ARI=0.274
agglomerative (single link)  clusters=2  noise points=  0  ARI=1.000
DBSCAN (eps=0.2)             clusters=2  noise points=  0  ARI=1.000</div>
<p><strong>Chọn k cho rượu vang.</strong> Inertia giảm mạnh từ k = 2 sang 3 (1.659 → 1.278) rồi giảm chậm — khuỷu tay ở 3. Silhouette cũng đạt đỉnh ở k = 3 (0,285). Cả hai khớp với điều ta biết (ba giống nho), nhưng để ý 0,285 là khiêm tốn: các nhóm chồng lấn nhau. Thực tế hãy kết hợp các con số này với tính hữu ích: ba phân khúc mà nhóm hành động được tốt hơn bảy phân khúc không làm gì được.</p>
<p><strong>Phân cụm phân cấp (agglomerative)</strong> bắt đầu với mỗi điểm là một cụm và liên tục gộp hai cụm gần nhau nhất, tạo ra một cây (dendrogram) có thể cắt ở bất kỳ mức nào — bạn thấy mọi giá trị k cùng lúc. <em>Linkage</em> định nghĩa “gần nhất”: <em>single</em> (cặp điểm gần nhất — đi theo chuỗi và hình cong), <em>complete</em> (cặp xa nhất), <em>average</em>, hoặc <em>Ward</em> (phép gộp làm inertia tăng ít nhất — giống k-means).</p>
<p><strong>DBSCAN</strong> định nghĩa cụm là vùng dày đặc: một điểm có ít nhất <code>min_samples</code> láng giềng trong bán kính <code>eps</code> là điểm lõi; cụm lớn lên bằng cách nối các điểm lõi; điểm ở vùng thưa được gắn nhãn nhiễu (−1). Nó tự tìm số cụm và xử lý mọi hình dạng, nhưng cần chọn <code>eps</code> hợp thang đo dữ liệu và gặp khó khi các cụm có mật độ rất khác nhau.</p>
<p><strong>Bài thử hai nửa vầng trăng.</strong> Hai hình lưỡi liềm lồng vào nhau: k-means cắt chúng bằng một đường thẳng (ARI 0,274) vì nó giả định đốm tròn. Phân cụm phân cấp single-linkage và DBSCAN đi theo các hình cong dày đặc và tìm lại chính xác cả hai vầng trăng (ARI 1,000), DBSCAN không có điểm nhiễu nào ở <code>eps</code> này.</p>
<div class="formula"><span class="lbl">Silhouette của một điểm</span>s = (b − a) / max(a, b)   a = khoảng cách trung bình tới cụm của nó, b = khoảng cách trung bình tới cụm khác gần nhất;  −1 ≤ s ≤ 1</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn k theo inertia nhỏ nhất (luôn là k lớn nhất).</li><li>Dùng DBSCAN trên đặc trưng chưa chuẩn hoá, nên <code>eps</code> mang nghĩa khác nhau ở mỗi cột.</li><li>Mong k-means tìm được nhóm dài hay lồng nhau.</li><li>Quên rằng phân cụm phân cấp trên n điểm cần bộ nhớ cỡ n<sup>2</sup> — ổn với vài nghìn, không ổn với hàng triệu.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chọn k bằng khuỷu tay và silhouette, rồi kiểm tính hữu ích.</li><li>Phân cụm phân cấp dựng cây gộp; linkage điều khiển hình dạng cụm.</li><li>DBSCAN tìm vùng dày đặc với mọi hình dạng và đánh dấu nhiễu; chỉnh <code>eps</code>.</li><li>Chọn thuật toán theo hình dạng cụm bạn mong đợi.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html" target="_blank" rel="noopener">Ví dụ scikit-learn — Chọn số cụm bằng phân tích silhouette</a></li><li><a href="https://scikit-learn.org/stable/auto_examples/cluster/plot_cluster_comparison.html" target="_blank" rel="noopener">Ví dụ scikit-learn — So sánh các thuật toán phân cụm trên dữ liệu mẫu</a></li><li><a href="https://www.youtube.com/watch?v=RDZUdRSDOok" target="_blank" rel="noopener">StatQuest — Clustering with DBSCAN, Clearly Explained</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một điểm có a = 2 và b = 5. Tính silhouette. Nếu a = 5 và b = 2 thì sao?</li><li>Toạ độ GPS các điểm giao hàng trong thành phố: bạn muốn tìm “điểm nóng” với mọi hình dạng và bỏ qua các điểm giao lẻ loi. Dùng thuật toán nào?</li><li>Vì sao single linkage thành công với hai vầng trăng còn Ward linkage sẽ hành xử giống k-means?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (5 − 2)/5 = 0,6 (đặt đúng chỗ); (2 − 5)/5 = −0,6 (có lẽ sai cụm). 2) DBSCAN — tìm vùng dày đặc hình dạng bất kỳ và gắn nhãn nhiễu cho điểm lẻ loi (với <code>eps</code> tính bằng mét, dùng khoảng cách phù hợp cho toạ độ). 3) Single linkage gộp theo cặp điểm gần nhất, nên có thể đi theo chuỗi láng giềng dọc đường cong; Ward gộp sao cho cụm gọn (inertia tăng ít nhất), ưu tiên nhóm tròn.</p></div>`);

const c93 = L('dsi201-ts-9-3',
  '9.3 — PCA: summarising many correlated features with a few components|||9.3 — PCA: tóm tắt nhiều đặc trưng tương quan bằng vài thành phần',
  'PCA là SVD của ma trận đã căn giữa (MAA102); wine: PC1 36,2%, 5 thành phần 80,2%; loadings (flavanoids, phenols); giống nho tách nhau trên PC1–PC2; chữ số 64 pixel → 21 thành phần giữ 90% phương sai.',
  `<span class="eyebrow">DSI201 · Chapter 9 · Lesson 9.3</span>
<h2>PCA: summarising many correlated features with a few components</h2>
<p class="lead">When many columns move together, a few combined directions carry most of the information. Principal component analysis (PCA) finds those directions — for visualisation, compression, noise reduction and as a preprocessing step.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain principal components as directions of maximum variance, computed by SVD/eigen-decomposition.</li><li>Read explained-variance ratios and loadings.</li><li>Use PCA for 2-D views and for compression, and know its limits.</li></ul>
<h3>📖 Lecture</h3>
<p>Centre and standardise the data matrix X (n rows × p features). The first principal component is the unit vector w<sub>1</sub> along which the projected data Xw<sub>1</sub> has the largest variance; the second is the direction of largest remaining variance orthogonal to the first, and so on. In the language of MAA102, the components are the <strong>eigenvectors of the covariance matrix</strong> XᵀX/(n − 1), their eigenvalues are the variances along them, and in practice they are computed from the <strong>singular value decomposition</strong> X = UΣVᵀ: the rows of Vᵀ are the components, and σ<sub>j</sub><sup>2</sup>/(n − 1) are the variances.</p>
<div class="formula"><span class="lbl">PCA in one line</span>X<sub>centred</sub> = U Σ Vᵀ   →   components = rows of Vᵀ,   scores Z = X<sub>centred</sub>V,   explained variance ratio<sub>j</sub> = σ<sub>j</sub><sup>2</sup> / ∑<sub>i</sub>σ<sub>i</sub><sup>2</sup></div>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.datasets import load_digits, load_wine
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

wine = load_wine(as_frame=True)
Xs = StandardScaler().fit_transform(wine.data)
pca = PCA().fit(Xs)
print("explained variance ratio:", pca.explained_variance_ratio_[:5].round(3))
print("cumulative:", pca.explained_variance_ratio_.cumsum()[:5].round(3))

# Loadings: how each original feature contributes to PC1 and PC2
load = pd.DataFrame(pca.components_[:2].T, index=wine.data.columns, columns=["PC1", "PC2"])
print(load.reindex(load["PC1"].abs().sort_values(ascending=False).index).head(5).round(2))

# PCA is the SVD of the centred data matrix (MAA102): same directions, up to sign
U, S, Vt = np.linalg.svd(Xs - Xs.mean(axis=0), full_matrices=False)
print("same first direction as SVD:", np.allclose(np.abs(Vt[0]), np.abs(pca.components_[0])))

# 2-D view: the three cultivars separate well on PC1-PC2 (labels used only to describe)
Z = PCA(n_components=2).fit_transform(Xs)
print(pd.DataFrame(Z, columns=["PC1", "PC2"]).assign(cultivar=wine.target).groupby("cultivar").mean().round(2))

# Compression: 8x8 digit images (64 pixels) -&gt; how many components keep 90% of the variance?
digits = load_digits().data
p = PCA(n_components=0.90).fit(digits)
print("digits: 64 pixels -&gt;", p.n_components_, "components for 90% of variance")</code></pre>
<div class="out">explained variance ratio: [0.362 0.192 0.111 0.071 0.066]
cumulative: [0.362 0.554 0.665 0.736 0.802]
                               PC1   PC2
flavanoids                    0.42 -0.00
total_phenols                 0.39  0.07
od280/od315_of_diluted_wines  0.38 -0.16
proanthocyanins               0.31  0.04
nonflavanoid_phenols         -0.30  0.03
same first direction as SVD: True
           PC1   PC2
cultivar            
0         2.28  0.97
1        -0.04 -1.64
2        -2.75  1.24
digits: 64 pixels -&gt; 21 components for 90% of variance</div>
<p><strong>Explained variance.</strong> On the 13 standardised wine features, PC1 alone captures 36.2% of the variance, PC1 + PC2 55.4%, and five components 80.2%. A common rule is to keep enough components for 80–95% of the variance, or to look for an elbow in the ratios.</p>
<p><strong>Loadings tell you what a component means.</strong> PC1 loads positively on flavanoids (0.42), total phenols (0.39), OD280 (0.38) and proanthocyanins, and negatively on non-flavanoid phenols: it is roughly a “phenolic richness” axis. Signs are arbitrary — the SVD check confirms the same direction up to sign.</p>
<p><strong>A 2-D map.</strong> Projected onto PC1–PC2, the three cultivars sit in different places (mean PC1 2.28, −0.04, −2.75), which is why k-means found them in Lesson 9.1. PCA plots are the standard first look at high-dimensional data.</p>
<p><strong>Compression.</strong> The 8×8 handwritten-digit images have 64 pixel features, but 21 components keep 90% of the variance — a threefold reduction. Fewer, uncorrelated inputs can speed up and stabilise models such as kNN or linear regression (inside a pipeline, so PCA is fitted on training folds only — Lesson 6.3).</p>
<p><strong>Limits.</strong> PCA is linear and unsupervised: it keeps directions of large variance, which are not necessarily the ones that predict your target. Components mix all original features, so models built on them are harder to explain. Always standardise first unless all features share a unit. For non-linear 2-D maps, t-SNE and UMAP exist, but their distances are not to be read literally.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Running PCA on unscaled data — the feature with the largest unit becomes PC1.</li><li>Fitting PCA on all data before cross-validation (leakage).</li><li>Interpreting the sign of a component or reading PCs as real-world variables without looking at loadings.</li><li>Assuming low-variance components are useless for prediction.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Principal components are orthogonal directions of maximum variance = right singular vectors of the centred data.</li><li>Explained-variance ratios guide how many components to keep.</li><li>Loadings give each component its meaning.</li><li>Use PCA for visualisation, compression and preprocessing — scaled, and inside pipelines.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/decomposition.html" target="_blank" rel="noopener">scikit-learn — Decomposing signals in components (PCA)</a></li><li><a href="https://jakevdp.github.io/PythonDataScienceHandbook/05.09-principal-component-analysis.html" target="_blank" rel="noopener">VanderPlas — In Depth: Principal Component Analysis</a></li><li><a href="https://www.youtube.com/watch?v=FgakZw6K1QQ" target="_blank" rel="noopener">StatQuest — Principal Component Analysis (PCA), Step-by-Step</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Singular values of a centred dataset are 6, 3, 2, 1. What share of variance do the first two components explain?</li><li>Height in cm and height in inches are both columns of a dataset. What will PCA do with them?</li><li>Write a pipeline that standardises, keeps 95% of the variance with PCA, and fits logistic regression.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Variances ∝ σ<sup>2</sup>: 36, 9, 4, 1 (total 50). First two: 45/50 = 90%. 2) They are perfectly correlated, so they collapse into one component; the other direction has zero variance. 3) <code>make_pipeline(StandardScaler(), PCA(n_components=0.95), LogisticRegression(max_iter=1000))</code>.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 9 · Bài 9.3</span>
<h2>PCA: tóm tắt nhiều đặc trưng tương quan bằng vài thành phần</h2>
<p class="lead">Khi nhiều cột cùng biến thiên với nhau, vài hướng tổ hợp mang phần lớn thông tin. Phân tích thành phần chính (PCA) tìm các hướng đó — để trực quan hoá, nén, giảm nhiễu và làm bước tiền xử lý.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích thành phần chính là hướng có phương sai lớn nhất, tính bằng SVD/phân tích trị riêng.</li><li>Đọc tỉ lệ phương sai giải thích và hệ số tải (loadings).</li><li>Dùng PCA cho hình 2 chiều và để nén, và biết giới hạn của nó.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Căn giữa và chuẩn hoá ma trận dữ liệu X (n dòng × p đặc trưng). Thành phần chính thứ nhất là vectơ đơn vị w<sub>1</sub> mà dữ liệu chiếu Xw<sub>1</sub> có phương sai lớn nhất; thành phần thứ hai là hướng có phương sai còn lại lớn nhất trực giao với hướng thứ nhất, và cứ thế. Theo ngôn ngữ MAA102, các thành phần là <strong>vectơ riêng của ma trận hiệp phương sai</strong> XᵀX/(n − 1), trị riêng là phương sai dọc theo chúng, và thực tế được tính từ <strong>phân tích giá trị kỳ dị (SVD)</strong> X = UΣVᵀ: các dòng của Vᵀ là các thành phần, và σ<sub>j</sub><sup>2</sup>/(n − 1) là các phương sai.</p>
<div class="formula"><span class="lbl">PCA trong một dòng</span>X<sub>căn giữa</sub> = U Σ Vᵀ   →   thành phần = các dòng của Vᵀ,   điểm số Z = X<sub>căn giữa</sub>V,   tỉ lệ phương sai giải thích<sub>j</sub> = σ<sub>j</sub><sup>2</sup> / ∑<sub>i</sub>σ<sub>i</sub><sup>2</sup></div>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.datasets import load_digits, load_wine
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

wine = load_wine(as_frame=True)
Xs = StandardScaler().fit_transform(wine.data)
pca = PCA().fit(Xs)
print("explained variance ratio:", pca.explained_variance_ratio_[:5].round(3))
print("cumulative:", pca.explained_variance_ratio_.cumsum()[:5].round(3))

# Loadings: how each original feature contributes to PC1 and PC2
load = pd.DataFrame(pca.components_[:2].T, index=wine.data.columns, columns=["PC1", "PC2"])
print(load.reindex(load["PC1"].abs().sort_values(ascending=False).index).head(5).round(2))

# PCA is the SVD of the centred data matrix (MAA102): same directions, up to sign
U, S, Vt = np.linalg.svd(Xs - Xs.mean(axis=0), full_matrices=False)
print("same first direction as SVD:", np.allclose(np.abs(Vt[0]), np.abs(pca.components_[0])))

# 2-D view: the three cultivars separate well on PC1-PC2 (labels used only to describe)
Z = PCA(n_components=2).fit_transform(Xs)
print(pd.DataFrame(Z, columns=["PC1", "PC2"]).assign(cultivar=wine.target).groupby("cultivar").mean().round(2))

# Compression: 8x8 digit images (64 pixels) -&gt; how many components keep 90% of the variance?
digits = load_digits().data
p = PCA(n_components=0.90).fit(digits)
print("digits: 64 pixels -&gt;", p.n_components_, "components for 90% of variance")</code></pre>
<div class="out">explained variance ratio: [0.362 0.192 0.111 0.071 0.066]
cumulative: [0.362 0.554 0.665 0.736 0.802]
                               PC1   PC2
flavanoids                    0.42 -0.00
total_phenols                 0.39  0.07
od280/od315_of_diluted_wines  0.38 -0.16
proanthocyanins               0.31  0.04
nonflavanoid_phenols         -0.30  0.03
same first direction as SVD: True
           PC1   PC2
cultivar            
0         2.28  0.97
1        -0.04 -1.64
2        -2.75  1.24
digits: 64 pixels -&gt; 21 components for 90% of variance</div>
<p><strong>Phương sai giải thích.</strong> Trên 13 đặc trưng rượu vang đã chuẩn hoá, riêng PC1 giữ 36,2% phương sai, PC1 + PC2 giữ 55,4%, và năm thành phần giữ 80,2%. Quy tắc thường dùng là giữ đủ thành phần cho 80–95% phương sai, hoặc tìm khuỷu tay trong các tỉ lệ.</p>
<p><strong>Loadings cho biết thành phần nghĩa là gì.</strong> PC1 tải dương lên flavanoids (0,42), total phenols (0,39), OD280 (0,38) và proanthocyanins, và tải âm lên non-flavanoid phenols: đại khái là trục “độ giàu phenol”. Dấu là tuỳ ý — phép kiểm SVD xác nhận cùng một hướng, sai khác dấu.</p>
<p><strong>Bản đồ 2 chiều.</strong> Chiếu lên PC1–PC2, ba giống nho nằm ở các vị trí khác nhau (PC1 trung bình 2,28; −0,04; −2,75), đó là lý do k-means tìm ra chúng ở Bài 9.1. Biểu đồ PCA là cái nhìn đầu tiên tiêu chuẩn với dữ liệu nhiều chiều.</p>
<p><strong>Nén dữ liệu.</strong> Ảnh chữ số viết tay 8×8 có 64 đặc trưng pixel, nhưng 21 thành phần giữ 90% phương sai — giảm ba lần. Đầu vào ít hơn và không tương quan có thể làm nhanh và ổn định các mô hình như kNN hay hồi quy tuyến tính (đặt trong pipeline, để PCA chỉ fit trên phần huấn luyện — Bài 6.3).</p>
<p><strong>Giới hạn.</strong> PCA tuyến tính và không giám sát: nó giữ các hướng có phương sai lớn, không nhất thiết là hướng dự đoán được mục tiêu của bạn. Thành phần trộn mọi đặc trưng gốc, nên mô hình xây trên chúng khó giải thích hơn. Luôn chuẩn hoá trước trừ khi mọi đặc trưng cùng đơn vị. Với bản đồ 2 chiều phi tuyến có t-SNE và UMAP, nhưng không được đọc khoảng cách của chúng theo nghĩa đen.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chạy PCA trên dữ liệu chưa chuẩn hoá — đặc trưng có đơn vị lớn nhất thành PC1.</li><li>Fit PCA trên toàn bộ dữ liệu trước khi kiểm định chéo (rò rỉ).</li><li>Diễn giải dấu của thành phần hay đọc PC như biến thực tế mà không xem loadings.</li><li>Mặc định thành phần có phương sai nhỏ là vô dụng cho dự đoán.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Thành phần chính là các hướng trực giao có phương sai lớn nhất = vectơ kỳ dị phải của dữ liệu đã căn giữa.</li><li>Tỉ lệ phương sai giải thích gợi ý giữ bao nhiêu thành phần.</li><li>Loadings cho mỗi thành phần ý nghĩa của nó.</li><li>Dùng PCA để trực quan hoá, nén và tiền xử lý — có chuẩn hoá và đặt trong pipeline.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/decomposition.html" target="_blank" rel="noopener">scikit-learn — Phân tách tín hiệu thành các thành phần (PCA)</a></li><li><a href="https://jakevdp.github.io/PythonDataScienceHandbook/05.09-principal-component-analysis.html" target="_blank" rel="noopener">VanderPlas — Tìm hiểu sâu: Phân tích thành phần chính</a></li><li><a href="https://www.youtube.com/watch?v=FgakZw6K1QQ" target="_blank" rel="noopener">StatQuest — Principal Component Analysis (PCA), Step-by-Step</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Các giá trị kỳ dị của một bộ dữ liệu đã căn giữa là 6, 3, 2, 1. Hai thành phần đầu giải thích bao nhiêu phần phương sai?</li><li>Chiều cao theo cm và chiều cao theo inch đều là cột của một bộ dữ liệu. PCA sẽ làm gì với chúng?</li><li>Viết pipeline chuẩn hoá, giữ 95% phương sai bằng PCA, và fit hồi quy logistic.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Phương sai ∝ σ<sup>2</sup>: 36, 9, 4, 1 (tổng 50). Hai thành phần đầu: 45/50 = 90%. 2) Chúng tương quan hoàn hảo, nên dồn về một thành phần; hướng còn lại có phương sai bằng 0. 3) <code>make_pipeline(StandardScaler(), PCA(n_components=0.95), LogisticRegression(max_iter=1000))</code>.</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: Unsupervised learning|||Quiz — Chương 9: Học không giám sát',
  'Quiz 8 câu: hai bước k-means, chuẩn hoá trước khi phân cụm, inertia và khuỷu tay, silhouette, DBSCAN và điểm nhiễu, linkage, PCA và SVD, đọc phương sai giải thích.', [
  Q('q1', 'The two alternating steps of k-means are…|||Hai bước luân phiên của k-means là…',
    ['assign points to nearest centre; move centres to cluster means|||gán điểm về tâm gần nhất; dời tâm về trung bình cụm', 'split nodes; prune leaves|||chia nút; tỉa lá', 'fit residuals; add trees|||khớp phần dư; thêm cây', 'merge closest clusters; cut the tree|||gộp cụm gần nhất; cắt cây'], 0,
    'Assignment and update both reduce inertia.|||Cả bước gán lẫn cập nhật đều giảm inertia.'),
  Q('q2', 'On the wine data, why did clustering raw features agree poorly with the cultivars?|||Với dữ liệu rượu vang, vì sao phân cụm đặc trưng thô khớp kém với giống nho?',
    ['Proline’s large scale dominated the distances|||Thang đo lớn của proline lấn át khoảng cách', 'k was too large|||k quá lớn', 'k-means needs labels|||k-means cần nhãn', 'There were missing values|||Có giá trị thiếu'], 0,
    'After standardising, ARI rose from 0.371 to 0.897.|||Sau khi chuẩn hoá, ARI tăng từ 0,371 lên 0,897.'),
  Q('q3', 'Why can’t you choose k by minimising inertia?|||Vì sao không thể chọn k bằng cách cực tiểu inertia?',
    ['Inertia always decreases as k grows|||Inertia luôn giảm khi k tăng', 'Inertia is always zero|||Inertia luôn bằng 0', 'Inertia increases with k|||Inertia tăng theo k', 'Inertia needs labels|||Inertia cần nhãn'], 0,
    'With k = n it reaches zero; look for an elbow or use silhouette.|||Khi k = n nó bằng 0; hãy tìm khuỷu tay hoặc dùng silhouette.'),
  Q('q4', 'A point has silhouette −0.4. It is probably…|||Một điểm có silhouette −0,4. Có lẽ nó…',
    ['assigned to the wrong cluster|||bị gán sai cụm', 'perfectly placed|||được đặt hoàn hảo', 'a cluster centre|||là tâm cụm', 'a duplicate|||là bản ghi trùng'], 0,
    'Negative s means it is closer on average to another cluster.|||s âm nghĩa là trung bình nó gần một cụm khác hơn.'),
  Q('q5', 'Which algorithm labels points in sparse regions as noise (−1)?|||Thuật toán nào gắn nhãn nhiễu (−1) cho điểm ở vùng thưa?',
    ['DBSCAN|||DBSCAN', 'k-means|||k-means', 'PCA|||PCA', 'Ward agglomerative clustering|||Phân cụm phân cấp Ward'], 0,
    'DBSCAN clusters dense regions and leaves the rest as noise.|||DBSCAN gom vùng dày đặc và để phần còn lại là nhiễu.'),
  Q('q6', 'Which linkage followed the curved half-moons correctly?|||Linkage nào đi theo đúng hai nửa vầng trăng cong?',
    ['Single linkage|||Single linkage', 'Ward linkage|||Ward linkage', 'k-means|||k-means', 'Complete linkage only on raw data|||Chỉ complete linkage trên dữ liệu thô'], 0,
    'Single linkage chains nearest neighbours along a shape.|||Single linkage nối các láng giềng gần nhất dọc theo hình dạng.'),
  Q('q7', 'Principal components are…|||Các thành phần chính là…',
    ['orthogonal directions of maximum variance (right singular vectors of centred data)|||các hướng trực giao có phương sai lớn nhất (vectơ kỳ dị phải của dữ liệu đã căn giữa)', 'the original features ranked by importance|||các đặc trưng gốc xếp theo độ quan trọng', 'cluster centres|||tâm các cụm', 'random projections|||phép chiếu ngẫu nhiên'], 0,
    'PCA = SVD of the centred (and usually standardised) data matrix.|||PCA = SVD của ma trận dữ liệu đã căn giữa (và thường đã chuẩn hoá).'),
  Q('q8', 'Explained variance ratios are 0.36, 0.19, 0.11, … What share do the first two explain?|||Tỉ lệ phương sai giải thích là 0,36; 0,19; 0,11; … Hai thành phần đầu giải thích bao nhiêu?',
    ['0.55|||0,55', '0.36|||0,36', '0.19|||0,19', '0.66|||0,66'], 0,
    '0.36 + 0.19 = 0.55.|||0,36 + 0,19 = 0,55.'),
]);

const ch9 = {
  title: 'Chapter 9 — Unsupervised learning: clustering and PCA|||Chương 9 — Học không giám sát: phân cụm và PCA',
  description: 'k-means và chuẩn hoá, mô tả cụm; chọn k bằng khuỷu tay và silhouette; phân cụm phân cấp và DBSCAN; PCA qua SVD (MAA102), loadings, trực quan hoá và nén dữ liệu.',
  lessons: [c91, c92, c93, q9],
};


// ───────────────────────────── Chương 10 — Diễn giải mô hình ─────────────────────────────
const c101 = L('dsi201-ts-10-1',
  '10.1 — Which features matter? Coefficients, impurity and permutation importance|||10.1 — Đặc trưng nào quan trọng? Hệ số, impurity và permutation importance',
  'Ba cách đo độ quan trọng; impurity importance thiên vị cột nhiều giá trị (order_code vô nghĩa 0,047 ≈ items) còn permutation trên test ≈ 0; đọc độ lệch chuẩn; đặc trưng tương quan chia nhau độ quan trọng.',
  `<span class="eyebrow">DSI201 · Chapter 10 · Lesson 10.1</span>
<h2>Which features matter? Coefficients, impurity and permutation importance</h2>
<p class="lead">Stakeholders always ask “what drives the prediction?”. There are several ways to answer, and they do not always agree. Knowing their biases protects you from confident nonsense.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compare standardised coefficients, impurity-based importance and permutation importance.</li><li>Show the bias of impurity importance toward high-cardinality features.</li><li>Read importance with its uncertainty and with correlated features in mind.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>1. Coefficients</strong> (linear and logistic models, Lessons 7.1–7.2): comparable only when features are standardised, and misleading when features are correlated. <strong>2. Impurity-based importance</strong> (<code>feature_importances_</code> of tree models): the total reduction in impurity contributed by splits on each feature, measured on the <em>training</em> data. Cheap, but biased toward features with many distinct values, which offer many split points to overfit. <strong>3. Permutation importance</strong>: shuffle one column in held-out data, breaking its link with the target, and measure how much the score gets worse. Model-agnostic and measured on unseen data — the recommended default.</p>
<div class="formula"><span class="lbl">Permutation importance of feature j</span>importance<sub>j</sub> = score(model, X<sub>test</sub>) − mean over repeats of score(model, X<sub>test</sub> with column j shuffled)   (here: the increase in MAE, in minutes)</div>
<p>Data: 4,000 simulated deliveries whose true structure we know — minutes rise 3 per km, +10 at rush hour, +6 in rain, +0.8 per item, and rain is 5 minutes worse in Long Bien. We add a meaningless <code>order_code</code> (a random number up to 100,000) to see which method is fooled.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split

def make_deliveries(n=4000, seed=10):
    """Simulated delivery minutes with a known structure (so we can check explanations)."""
    rng = np.random.default_rng(seed)
    df = pd.DataFrame({
        "distance_km": rng.gamma(2.0, 1.6, n).round(1),
        "hour": rng.integers(8, 23, n),
        "raining": rng.integers(0, 2, n),
        "items": rng.integers(1, 8, n),
        "district": rng.choice(["Ba Dinh", "Cau Giay", "Ha Dong", "Long Bien"], n, p=[0.3, 0.3, 0.3, 0.1]),
    })
    rush = df["hour"].isin([11, 12, 18, 19]).astype(int)
    df["minutes"] = (18 + 3 * df["distance_km"] + 10 * rush + 6 * df["raining"] + 0.8 * df["items"]
                     + 5 * (df["district"] == "Long Bien") * df["raining"]
                     + rng.normal(0, 4, n)).round(1)
    return df

df = make_deliveries()
df["order_code"] = np.random.default_rng(1).integers(0, 100_000, len(df))   # meaningless ID-like number
X = pd.get_dummies(df.drop(columns="minutes"), columns=["district"], dtype=float)
y = df["minutes"]
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)

rf = RandomForestRegressor(n_estimators=300, min_samples_leaf=3, random_state=0, n_jobs=-1).fit(X_tr, y_tr)
print("test R2:", round(rf.score(X_te, y_te), 3))

imp = pd.DataFrame({"impurity (train)": rf.feature_importances_}, index=X.columns)
perm = permutation_importance(rf, X_te, y_te, n_repeats=10, random_state=0, scoring="neg_mean_absolute_error")
imp["permutation (test, MAE +)"] = perm.importances_mean
imp["perm sd"] = perm.importances_std
print(imp.sort_values("permutation (test, MAE +)", ascending=False).round(3))</code></pre>
<div class="out">test R2: 0.768
                    impurity (train)  permutation (test, MAE +)  perm sd
distance_km                    0.570                      4.315    0.163
hour                           0.192                      2.234    0.047
raining                        0.114                      1.548    0.113
items                          0.049                      0.402    0.052
district_Long Bien             0.010                      0.062    0.016
district_Cau Giay              0.007                     -0.002    0.009
order_code                     0.047                     -0.003    0.017
district_Ha Dong               0.005                     -0.003    0.004
district_Ba Dinh               0.005                     -0.009    0.004</div>
<p><strong>Reading it.</strong> Permutation importance on the test set ranks the real drivers sensibly: shuffling distance makes the MAE 4.3 minutes worse, hour 2.2, rain 1.5, items 0.4, the Long Bien flag a little (0.06); the meaningless <code>order_code</code> scores −0.003 ± 0.017, i.e. zero. Impurity importance, measured on training data, gives <code>order_code</code> 0.047 — about as much as <code>items</code> (0.049), a real effect. The forest used the random code to split noise in the training data; impurity importance rewards that, permutation on new data does not. Always report the spread across repeats (the “perm sd” column): differences smaller than a couple of standard deviations are not meaningful.</p>
<p><strong>Correlated features share credit.</strong> If two features carry the same information (area and number of bedrooms), shuffling one barely hurts because the other still carries it — both look less important than they are. Group correlated features and permute them together, or drop one and see what changes.</p>
<p><strong>What importance is not.</strong> It describes how this model uses features to predict, not what causes the outcome. A high importance for “district” does not mean that moving a restaurant will speed it up.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Presenting <code>feature_importances_</code> of a random forest as the truth, including for ID-like columns.</li><li>Computing permutation importance on the training set, where an overfitted model “needs” every feature.</li><li>Ignoring the variance across repeats.</li><li>Concluding that a feature is useless because a correlated twin absorbed its importance.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Coefficients need standardisation and uncorrelated features to be read as importances.</li><li>Impurity importance is training-based and biased to high-cardinality features.</li><li>Permutation importance on held-out data is model-agnostic; report its spread.</li><li>Importance is predictive, not causal; correlated features share it.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/permutation_importance.html" target="_blank" rel="noopener">scikit-learn — Permutation feature importance</a></li><li><a href="https://scikit-learn.org/stable/auto_examples/inspection/plot_permutation_importance.html" target="_blank" rel="noopener">scikit-learn example — Permutation importance vs random forest feature importance (MDI)</a></li><li><a href="https://christophm.github.io/interpretable-ml-book/" target="_blank" rel="noopener">Christoph Molnar — Interpretable Machine Learning (free online book)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Baseline test MAE is 3.0; after shuffling “hour” 10 times the MAEs average 5.2. What is the permutation importance of hour?</li><li>Why can permutation importance be slightly negative?</li><li>A churn model's top impurity feature is “customer_id”. What do you conclude and do?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 5.2 − 3.0 = 2.2 minutes of extra MAE. 2) By chance a shuffle can make predictions marginally better on a finite test set when the feature is useless; values near zero (within the spread) mean “no importance”. 3) The model is splitting on an identifier (high cardinality, possibly leakage if IDs were assigned in time order); remove it, check permutation importance on test data and investigate how IDs are generated.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 10 · Bài 10.1</span>
<h2>Đặc trưng nào quan trọng? Hệ số, impurity và permutation importance</h2>
<p class="lead">Người dùng kết quả luôn hỏi “cái gì quyết định dự đoán?”. Có vài cách trả lời, và chúng không phải lúc nào cũng khớp nhau. Biết thiên lệch của từng cách giúp bạn tránh những điều vô nghĩa nói với giọng tự tin.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>So sánh hệ số đã chuẩn hoá, độ quan trọng dựa trên impurity và permutation importance.</li><li>Chỉ ra thiên lệch của impurity importance về phía đặc trưng có nhiều giá trị khác nhau.</li><li>Đọc độ quan trọng kèm độ bất định và nhớ tới các đặc trưng tương quan.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>1. Hệ số</strong> (mô hình tuyến tính và logistic, Bài 7.1–7.2): chỉ so được khi đặc trưng đã chuẩn hoá, và gây hiểu lầm khi đặc trưng tương quan. <strong>2. Độ quan trọng dựa trên impurity</strong> (<code>feature_importances_</code> của mô hình cây): tổng mức giảm độ hỗn tạp mà các lần chia trên mỗi đặc trưng đóng góp, đo trên dữ liệu <em>huấn luyện</em>. Rẻ, nhưng thiên vị đặc trưng có nhiều giá trị khác nhau, vốn cho nhiều điểm chia để quá khớp. <strong>3. Permutation importance</strong>: xáo trộn một cột trong dữ liệu giữ lại, cắt đứt liên hệ của nó với mục tiêu, và đo điểm số tệ đi bao nhiêu. Không phụ thuộc mô hình và đo trên dữ liệu chưa thấy — lựa chọn mặc định được khuyên dùng.</p>
<div class="formula"><span class="lbl">Permutation importance của đặc trưng j</span>độ quan trọng<sub>j</sub> = điểm(mô hình, X<sub>test</sub>) − trung bình qua các lần lặp của điểm(mô hình, X<sub>test</sub> với cột j bị xáo)   (ở đây: mức tăng MAE, tính bằng phút)</div>
<p>Dữ liệu: 4.000 chuyến giao mô phỏng mà ta biết cấu trúc thật — số phút tăng 3 mỗi km, +10 giờ cao điểm, +6 khi mưa, +0,8 mỗi món, và mưa ở Long Biên tệ hơn 5 phút. Ta thêm một <code>order_code</code> vô nghĩa (số ngẫu nhiên tới 100.000) để xem cách nào bị lừa.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split

def make_deliveries(n=4000, seed=10):
    """Simulated delivery minutes with a known structure (so we can check explanations)."""
    rng = np.random.default_rng(seed)
    df = pd.DataFrame({
        "distance_km": rng.gamma(2.0, 1.6, n).round(1),
        "hour": rng.integers(8, 23, n),
        "raining": rng.integers(0, 2, n),
        "items": rng.integers(1, 8, n),
        "district": rng.choice(["Ba Dinh", "Cau Giay", "Ha Dong", "Long Bien"], n, p=[0.3, 0.3, 0.3, 0.1]),
    })
    rush = df["hour"].isin([11, 12, 18, 19]).astype(int)
    df["minutes"] = (18 + 3 * df["distance_km"] + 10 * rush + 6 * df["raining"] + 0.8 * df["items"]
                     + 5 * (df["district"] == "Long Bien") * df["raining"]
                     + rng.normal(0, 4, n)).round(1)
    return df

df = make_deliveries()
df["order_code"] = np.random.default_rng(1).integers(0, 100_000, len(df))   # meaningless ID-like number
X = pd.get_dummies(df.drop(columns="minutes"), columns=["district"], dtype=float)
y = df["minutes"]
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)

rf = RandomForestRegressor(n_estimators=300, min_samples_leaf=3, random_state=0, n_jobs=-1).fit(X_tr, y_tr)
print("test R2:", round(rf.score(X_te, y_te), 3))

imp = pd.DataFrame({"impurity (train)": rf.feature_importances_}, index=X.columns)
perm = permutation_importance(rf, X_te, y_te, n_repeats=10, random_state=0, scoring="neg_mean_absolute_error")
imp["permutation (test, MAE +)"] = perm.importances_mean
imp["perm sd"] = perm.importances_std
print(imp.sort_values("permutation (test, MAE +)", ascending=False).round(3))</code></pre>
<div class="out">test R2: 0.768
                    impurity (train)  permutation (test, MAE +)  perm sd
distance_km                    0.570                      4.315    0.163
hour                           0.192                      2.234    0.047
raining                        0.114                      1.548    0.113
items                          0.049                      0.402    0.052
district_Long Bien             0.010                      0.062    0.016
district_Cau Giay              0.007                     -0.002    0.009
order_code                     0.047                     -0.003    0.017
district_Ha Dong               0.005                     -0.003    0.004
district_Ba Dinh               0.005                     -0.009    0.004</div>
<p><strong>Đọc kết quả.</strong> Permutation importance trên tập test xếp hạng các động lực thật hợp lý: xáo quãng đường làm MAE tệ đi 4,3 phút, giờ 2,2, mưa 1,5, số món 0,4, cờ Long Biên một chút (0,06); <code>order_code</code> vô nghĩa được −0,003 ± 0,017, tức là bằng 0. Impurity importance, đo trên dữ liệu huấn luyện, cho <code>order_code</code> 0,047 — gần bằng <code>items</code> (0,049), một tác động thật. Rừng đã dùng mã ngẫu nhiên để chia nhiễu trong dữ liệu huấn luyện; impurity importance thưởng cho điều đó, permutation trên dữ liệu mới thì không. Luôn báo độ phân tán qua các lần lặp (cột “perm sd”): chênh lệch nhỏ hơn vài độ lệch chuẩn là không có ý nghĩa.</p>
<p><strong>Đặc trưng tương quan chia nhau công trạng.</strong> Nếu hai đặc trưng mang cùng thông tin (diện tích và số phòng ngủ), xáo một cái gần như không hại vì cái kia vẫn mang thông tin — cả hai trông kém quan trọng hơn thực tế. Gộp các đặc trưng tương quan và xáo chúng cùng nhau, hoặc bỏ một cái rồi xem điều gì thay đổi.</p>
<p><strong>Độ quan trọng không phải là gì.</strong> Nó mô tả mô hình này dùng đặc trưng để dự đoán thế nào, không phải cái gì gây ra kết cục. Độ quan trọng cao của “quận” không có nghĩa là dời nhà hàng sẽ làm nó nhanh hơn.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Trình bày <code>feature_importances_</code> của rừng ngẫu nhiên như sự thật, kể cả cho các cột kiểu ID.</li><li>Tính permutation importance trên tập huấn luyện, nơi mô hình quá khớp “cần” mọi đặc trưng.</li><li>Bỏ qua phương sai qua các lần lặp.</li><li>Kết luận một đặc trưng vô dụng vì một “bản sao” tương quan đã hút hết độ quan trọng của nó.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hệ số cần chuẩn hoá và đặc trưng không tương quan mới đọc được như độ quan trọng.</li><li>Impurity importance dựa trên dữ liệu huấn luyện và thiên vị đặc trưng nhiều giá trị.</li><li>Permutation importance trên dữ liệu giữ lại không phụ thuộc mô hình; báo kèm độ phân tán.</li><li>Độ quan trọng mang nghĩa dự đoán, không phải nhân quả; đặc trưng tương quan chia nhau.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/permutation_importance.html" target="_blank" rel="noopener">scikit-learn — Permutation feature importance</a></li><li><a href="https://scikit-learn.org/stable/auto_examples/inspection/plot_permutation_importance.html" target="_blank" rel="noopener">Ví dụ scikit-learn — Permutation importance so với độ quan trọng của rừng ngẫu nhiên (MDI)</a></li><li><a href="https://christophm.github.io/interpretable-ml-book/" target="_blank" rel="noopener">Christoph Molnar — Interpretable Machine Learning (sách đọc miễn phí)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>MAE test gốc là 3,0; sau 10 lần xáo “hour”, MAE trung bình là 5,2. Permutation importance của hour là bao nhiêu?</li><li>Vì sao permutation importance có thể hơi âm?</li><li>Đặc trưng impurity cao nhất của một mô hình rời bỏ là “customer_id”. Bạn kết luận gì và làm gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 5,2 − 3,0 = 2,2 phút MAE tăng thêm. 2) Do tình cờ, một lần xáo có thể làm dự đoán tốt hơn chút xíu trên tập test hữu hạn khi đặc trưng vô dụng; giá trị gần 0 (trong khoảng phân tán) nghĩa là “không quan trọng”. 3) Mô hình đang chia trên một mã định danh (nhiều giá trị, có thể rò rỉ nếu ID được cấp theo thứ tự thời gian); bỏ nó, kiểm permutation importance trên dữ liệu test và điều tra cách sinh ID.</p></div>`);

const c102 = L('dsi201-ts-10-2',
  '10.2 — How does a feature change the prediction? Partial dependence and ICE|||10.2 — Đặc trưng làm dự đoán thay đổi thế nào? Partial dependence và ICE',
  'Partial dependence = dự đoán trung bình khi gán một giá trị cho mọi dòng; giờ cao điểm +10 phút, quãng đường ≈ +2,9 phút/km khớp với cấu trúc thật; đường ICE từng đơn lộ tương tác; giới hạn khi đặc trưng tương quan.',
  `<span class="eyebrow">DSI201 · Chapter 10 · Lesson 10.2</span>
<h2>How does a feature change the prediction? Partial dependence and ICE</h2>
<p class="lead">Importance says <em>how much</em> a feature matters. Partial dependence shows <em>how</em>: up or down, linear or with thresholds, at which values. It turns a black-box ensemble into curves a manager can read.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute partial dependence (PD) and individual conditional expectation (ICE).</li><li>Read PD curves and check them against domain knowledge.</li><li>Know when PD misleads (correlated features, interactions).</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Partial dependence</strong> of feature x<sub>j</sub> at value v: take every row of the data, overwrite x<sub>j</sub> with v, predict, and average. Repeat for a grid of values. The curve shows how the model's average prediction moves with x<sub>j</sub>, with the other features kept at their observed values. <strong>ICE</strong> curves do the same per row without averaging — one curve per order — and reveal whether the effect differs between rows (an interaction).</p>
<div class="formula"><span class="lbl">Partial dependence</span>PD<sub>j</sub>(v) = (1/n) ∑<sub>i=1..n</sub> f̂(x<sub>i</sub> with x<sub>ij</sub> := v)      ICE<sub>i</sub>(v) = f̂(x<sub>i</sub> with x<sub>ij</sub> := v)</div>
<p>We fit a gradient-boosting model to the simulated deliveries of Lesson 10.1, where we know the truth: +10 minutes at rush hour (11–12h and 18–19h), +3 minutes per km, +6 in rain (+11 in Long Bien).</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.inspection import partial_dependence

def make_deliveries(n=4000, seed=10):
    """Simulated delivery minutes with a known structure (so we can check explanations)."""
    rng = np.random.default_rng(seed)
    df = pd.DataFrame({
        "distance_km": rng.gamma(2.0, 1.6, n).round(1),
        "hour": rng.integers(8, 23, n),
        "raining": rng.integers(0, 2, n),
        "items": rng.integers(1, 8, n),
        "district": rng.choice(["Ba Dinh", "Cau Giay", "Ha Dong", "Long Bien"], n, p=[0.3, 0.3, 0.3, 0.1]),
    })
    rush = df["hour"].isin([11, 12, 18, 19]).astype(int)
    df["minutes"] = (18 + 3 * df["distance_km"] + 10 * rush + 6 * df["raining"] + 0.8 * df["items"]
                     + 5 * (df["district"] == "Long Bien") * df["raining"]
                     + rng.normal(0, 4, n)).round(1)
    return df

df = make_deliveries()
X = pd.get_dummies(df.drop(columns="minutes"), columns=["district"], dtype=float).astype(float)
model = HistGradientBoostingRegressor(random_state=0).fit(X, df["minutes"])

# Partial dependence: average prediction when we SET a feature to each grid value for every row
pd_hour = partial_dependence(model, X, ["hour"], kind="average", grid_resolution=15, method="brute")
for h, v in zip(pd_hour["grid_values"][0], pd_hour["average"][0]):
    print(f"hour {int(h):2d}: {v:5.1f} min  {'#' * int((v - 25) * 2)}")

pd_dist = partial_dependence(model, X, ["distance_km"], kind="average",
                             custom_values={"distance_km": np.array([1, 2, 4, 6, 8, 10])}, method="brute")
print("distance km :", pd_dist["grid_values"][0].tolist())
print("avg minutes :", pd_dist["average"][0].round(1).tolist())

# ICE: one curve per order; here 3 orders, raining vs not
ice = partial_dependence(model, X.iloc[:3], ["raining"], kind="individual")
print("ICE raining 0 -&gt; 1 for 3 orders:", ice["individual"][0].round(1).tolist())</code></pre>
<div class="out">hour  8:  34.3 min  ##################
hour  9:  34.0 min  #################
hour 10:  34.2 min  ##################
hour 11:  44.0 min  ######################################
hour 12:  43.8 min  #####################################
hour 13:  34.2 min  ##################
hour 14:  33.8 min  #################
hour 15:  33.7 min  #################
hour 16:  34.1 min  ##################
hour 17:  34.5 min  ##################
hour 18:  43.8 min  #####################################
hour 19:  43.5 min  ####################################
hour 20:  34.0 min  ##################
hour 21:  33.8 min  #################
hour 22:  33.7 min  #################
distance km : [1, 2, 4, 6, 8, 10]
avg minutes : [30.7, 33.2, 38.8, 45.7, 51.3, 56.6]
ICE raining 0 -&gt; 1 for 3 orders: [[25.5, 30.6], [22.5, 30.3], [27.3, 33.0]]</div>
<p><strong>Checking the model against reality.</strong> The hour curve is flat around 34 minutes except four spikes near 44 at 11, 12, 18 and 19 h — the model discovered the rush windows on its own, with the right size (+10). The distance curve rises from 30.7 to 56.6 minutes between 1 and 10 km, about 2.9 minutes per km, close to the true 3. The ICE values for rain show +5.1, +7.8 and +5.7 minutes for three particular orders: not identical, because the boosted model also learned that rain hurts more in Long Bien and picked up some noise. When PD and ICE agree with domain knowledge, trust grows; when they do not (price falling with area, say), you may have found a data problem or a leak.</p>
<p>In notebooks, <code>PartialDependenceDisplay.from_estimator(model, X, ["hour", "distance_km"], kind="both")</code> draws PD and ICE curves directly. (We used <code>method="brute"</code> so the numbers are real average predictions; for gradient boosting the faster default “recursion” method returns curves centred on zero.)</p>
<p><strong>Limits.</strong> PD sets a feature to values that may be unrealistic for some rows — 10 km with 1 item is fine, but “area 30 m² with 5 bedrooms” would be impossible; with strongly correlated features PD averages over impossible combinations (accumulated local effects, ALE, is an alternative). An average curve can hide opposite effects in subgroups — that is what ICE is for. And as always, PD describes the model, not causation.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reading a PD curve as “if we change x, y will change this much” — that is a causal claim.</li><li>Ignoring the data density: the curve at 10 km rests on few orders; show a rug or histogram.</li><li>Trusting PD for one of two strongly correlated features.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>PD = average prediction as one feature is set to each grid value; ICE = one curve per row.</li><li>Use them to check that the model learned sensible shapes (thresholds, slopes, peaks).</li><li>ICE curves that differ reveal interactions.</li><li>Beware correlated features, sparse regions and causal readings.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/partial_dependence.html" target="_blank" rel="noopener">scikit-learn — Partial Dependence and Individual Conditional Expectation plots</a></li><li><a href="https://christophm.github.io/interpretable-ml-book/pdp.html" target="_blank" rel="noopener">Molnar — Partial Dependence Plot (PDP)</a></li><li><a href="https://scikit-learn.org/stable/auto_examples/inspection/plot_linear_model_coefficient_interpretation.html" target="_blank" rel="noopener">scikit-learn example — Common pitfalls in the interpretation of coefficients of linear models</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>From the output, estimate the extra minutes the model predicts at 18:00 compared with 16:00.</li><li>For a linear model without interactions, what do all ICE curves of one feature look like?</li><li>A PD curve of apartment price against floor is flat. Name two different explanations.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 43.8 − 34.1 ≈ 9.7 minutes. 2) Parallel straight lines with the same slope (the coefficient), shifted by the other features. 3) The floor truly has little effect (as in our generator, where it adds only 0.15 million per m² per floor), or effects cancel across subgroups (positive in new buildings, negative in old ones without lifts) — check ICE curves and subgroup PD.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 10 · Bài 10.2</span>
<h2>Đặc trưng làm dự đoán thay đổi thế nào? Partial dependence và ICE</h2>
<p class="lead">Độ quan trọng cho biết đặc trưng quan trọng <em>bao nhiêu</em>. Partial dependence cho thấy <em>như thế nào</em>: lên hay xuống, tuyến tính hay có ngưỡng, ở giá trị nào. Nó biến một mô hình tổ hợp “hộp đen” thành những đường cong mà quản lý đọc được.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính partial dependence (PD) và individual conditional expectation (ICE).</li><li>Đọc đường PD và đối chiếu với hiểu biết nghiệp vụ.</li><li>Biết khi nào PD đánh lừa (đặc trưng tương quan, tương tác).</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Partial dependence</strong> của đặc trưng x<sub>j</sub> tại giá trị v: lấy mọi dòng dữ liệu, ghi đè x<sub>j</sub> bằng v, dự đoán, rồi lấy trung bình. Lặp lại cho một lưới giá trị. Đường cong cho thấy dự đoán trung bình của mô hình thay đổi theo x<sub>j</sub> ra sao, với các đặc trưng khác giữ ở giá trị quan sát. Đường <strong>ICE</strong> làm điều tương tự cho từng dòng mà không lấy trung bình — mỗi đơn một đường — và cho thấy tác động có khác nhau giữa các dòng không (một tương tác).</p>
<div class="formula"><span class="lbl">Partial dependence</span>PD<sub>j</sub>(v) = (1/n) ∑<sub>i=1..n</sub> f̂(x<sub>i</sub> với x<sub>ij</sub> := v)      ICE<sub>i</sub>(v) = f̂(x<sub>i</sub> với x<sub>ij</sub> := v)</div>
<p>Ta fit một mô hình gradient boosting cho các chuyến giao mô phỏng ở Bài 10.1, nơi ta biết sự thật: +10 phút giờ cao điểm (11–12h và 18–19h), +3 phút mỗi km, +6 khi mưa (+11 ở Long Biên).</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.inspection import partial_dependence

def make_deliveries(n=4000, seed=10):
    """Simulated delivery minutes with a known structure (so we can check explanations)."""
    rng = np.random.default_rng(seed)
    df = pd.DataFrame({
        "distance_km": rng.gamma(2.0, 1.6, n).round(1),
        "hour": rng.integers(8, 23, n),
        "raining": rng.integers(0, 2, n),
        "items": rng.integers(1, 8, n),
        "district": rng.choice(["Ba Dinh", "Cau Giay", "Ha Dong", "Long Bien"], n, p=[0.3, 0.3, 0.3, 0.1]),
    })
    rush = df["hour"].isin([11, 12, 18, 19]).astype(int)
    df["minutes"] = (18 + 3 * df["distance_km"] + 10 * rush + 6 * df["raining"] + 0.8 * df["items"]
                     + 5 * (df["district"] == "Long Bien") * df["raining"]
                     + rng.normal(0, 4, n)).round(1)
    return df

df = make_deliveries()
X = pd.get_dummies(df.drop(columns="minutes"), columns=["district"], dtype=float).astype(float)
model = HistGradientBoostingRegressor(random_state=0).fit(X, df["minutes"])

# Partial dependence: average prediction when we SET a feature to each grid value for every row
pd_hour = partial_dependence(model, X, ["hour"], kind="average", grid_resolution=15, method="brute")
for h, v in zip(pd_hour["grid_values"][0], pd_hour["average"][0]):
    print(f"hour {int(h):2d}: {v:5.1f} min  {'#' * int((v - 25) * 2)}")

pd_dist = partial_dependence(model, X, ["distance_km"], kind="average",
                             custom_values={"distance_km": np.array([1, 2, 4, 6, 8, 10])}, method="brute")
print("distance km :", pd_dist["grid_values"][0].tolist())
print("avg minutes :", pd_dist["average"][0].round(1).tolist())

# ICE: one curve per order; here 3 orders, raining vs not
ice = partial_dependence(model, X.iloc[:3], ["raining"], kind="individual")
print("ICE raining 0 -&gt; 1 for 3 orders:", ice["individual"][0].round(1).tolist())</code></pre>
<div class="out">hour  8:  34.3 min  ##################
hour  9:  34.0 min  #################
hour 10:  34.2 min  ##################
hour 11:  44.0 min  ######################################
hour 12:  43.8 min  #####################################
hour 13:  34.2 min  ##################
hour 14:  33.8 min  #################
hour 15:  33.7 min  #################
hour 16:  34.1 min  ##################
hour 17:  34.5 min  ##################
hour 18:  43.8 min  #####################################
hour 19:  43.5 min  ####################################
hour 20:  34.0 min  ##################
hour 21:  33.8 min  #################
hour 22:  33.7 min  #################
distance km : [1, 2, 4, 6, 8, 10]
avg minutes : [30.7, 33.2, 38.8, 45.7, 51.3, 56.6]
ICE raining 0 -&gt; 1 for 3 orders: [[25.5, 30.6], [22.5, 30.3], [27.3, 33.0]]</div>
<p><strong>Đối chiếu mô hình với thực tế.</strong> Đường theo giờ phẳng quanh 34 phút trừ bốn gai gần 44 ở 11, 12, 18 và 19 giờ — mô hình tự phát hiện các khung cao điểm, với đúng độ lớn (+10). Đường theo quãng đường tăng từ 30,7 lên 56,6 phút trong khoảng 1 tới 10 km, khoảng 2,9 phút mỗi km, sát với 3 thật. Giá trị ICE cho mưa là +5,1, +7,8 và +5,7 phút với ba đơn cụ thể: không giống nhau, vì mô hình boosting cũng học được rằng mưa ở Long Biên tệ hơn và bắt cả chút nhiễu. Khi PD và ICE khớp với hiểu biết nghiệp vụ, niềm tin tăng lên; khi không khớp (giá giảm khi diện tích tăng chẳng hạn), có thể bạn vừa tìm ra lỗi dữ liệu hay rò rỉ.</p>
<p>Trong notebook, <code>PartialDependenceDisplay.from_estimator(model, X, ["hour", "distance_km"], kind="both")</code> vẽ trực tiếp đường PD và ICE. (Ta dùng <code>method="brute"</code> để các con số là dự đoán trung bình thật; với gradient boosting, phương pháp mặc định nhanh hơn “recursion” trả về đường cong đã căn giữa quanh 0.)</p>
<p><strong>Giới hạn.</strong> PD gán cho đặc trưng những giá trị có thể phi thực tế với vài dòng — 10 km với 1 món thì ổn, nhưng “diện tích 30 m² với 5 phòng ngủ” là bất khả; với đặc trưng tương quan mạnh, PD lấy trung bình trên các tổ hợp bất khả (accumulated local effects, ALE, là một lựa chọn thay thế). Một đường trung bình có thể che giấu tác động ngược chiều ở các nhóm con — đó là việc của ICE. Và như mọi khi, PD mô tả mô hình, không phải nhân quả.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đọc đường PD là “nếu ta đổi x, y sẽ đổi ngần này” — đó là khẳng định nhân quả.</li><li>Bỏ qua mật độ dữ liệu: đường ở 10 km dựa trên ít đơn; hãy vẽ kèm rug hay histogram.</li><li>Tin PD cho một trong hai đặc trưng tương quan mạnh.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>PD = dự đoán trung bình khi gán một đặc trưng bằng từng giá trị trên lưới; ICE = mỗi dòng một đường.</li><li>Dùng chúng để kiểm mô hình học được hình dạng hợp lý (ngưỡng, độ dốc, đỉnh).</li><li>Các đường ICE khác nhau tiết lộ tương tác.</li><li>Cẩn thận với đặc trưng tương quan, vùng thưa dữ liệu và cách đọc nhân quả.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/partial_dependence.html" target="_blank" rel="noopener">scikit-learn — Biểu đồ Partial Dependence và Individual Conditional Expectation</a></li><li><a href="https://christophm.github.io/interpretable-ml-book/pdp.html" target="_blank" rel="noopener">Molnar — Partial Dependence Plot (PDP)</a></li><li><a href="https://scikit-learn.org/stable/auto_examples/inspection/plot_linear_model_coefficient_interpretation.html" target="_blank" rel="noopener">Ví dụ scikit-learn — Các bẫy khi diễn giải hệ số mô hình tuyến tính</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Từ output, ước lượng số phút mô hình dự đoán thêm lúc 18:00 so với 16:00.</li><li>Với mô hình tuyến tính không có tương tác, mọi đường ICE của một đặc trưng trông thế nào?</li><li>Đường PD của giá căn hộ theo tầng phẳng. Nêu hai cách giải thích khác nhau.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 43,8 − 34,1 ≈ 9,7 phút. 2) Các đường thẳng song song cùng độ dốc (chính là hệ số), dịch lên xuống theo các đặc trưng khác. 3) Tầng thật sự ít tác động (như trong bộ sinh của ta, mỗi tầng chỉ thêm 0,15 triệu mỗi m²), hoặc tác động triệt tiêu giữa các nhóm con (dương ở toà mới, âm ở toà cũ không thang máy) — kiểm đường ICE và PD theo nhóm con.</p></div>`);

const c103 = L('dsi201-ts-10-3',
  '10.3 — Error analysis by subgroup and the limits of explanation|||10.3 — Phân tích sai số theo nhóm con và giới hạn của việc giải thích',
  'MAE theo quận × mưa: mô hình tuyến tính sai lệch −4,47 phút với Long Biên khi mưa (MAE 6,70) dù MAE chung 5,01; boosting học được tương tác (MAE 3,52); nhóm nhỏ, công bằng, giải thích ≠ nhân quả, model card.',
  `<span class="eyebrow">DSI201 · Chapter 10 · Lesson 10.3</span>
<h2>Error analysis by subgroup and the limits of explanation</h2>
<p class="lead">An average error can look fine while the model fails badly for one group of users. Slicing errors by subgroup is the most practical interpretation tool you have — and it is where fairness problems show up.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute error and bias by subgroup and spot systematic failures.</li><li>Relate subgroup failures to missing features or too little data.</li><li>State clearly what interpretation methods can and cannot tell you.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Error analysis</strong> means looking at <em>where</em> the model is wrong: by district, time, customer type, device, price range. Two numbers per group are enough to start: the <strong>MAE</strong> (how wrong) and the <strong>mean bias</strong> = mean(prediction − truth) (wrong in which direction). A model with zero overall bias can systematically under-predict one group and over-predict another.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.model_selection import train_test_split

def make_deliveries(n=4000, seed=10):
    """Simulated delivery minutes with a known structure (so we can check explanations)."""
    rng = np.random.default_rng(seed)
    df = pd.DataFrame({
        "distance_km": rng.gamma(2.0, 1.6, n).round(1),
        "hour": rng.integers(8, 23, n),
        "raining": rng.integers(0, 2, n),
        "items": rng.integers(1, 8, n),
        "district": rng.choice(["Ba Dinh", "Cau Giay", "Ha Dong", "Long Bien"], n, p=[0.3, 0.3, 0.3, 0.1]),
    })
    rush = df["hour"].isin([11, 12, 18, 19]).astype(int)
    df["minutes"] = (18 + 3 * df["distance_km"] + 10 * rush + 6 * df["raining"] + 0.8 * df["items"]
                     + 5 * (df["district"] == "Long Bien") * df["raining"]
                     + rng.normal(0, 4, n)).round(1)
    return df

df = make_deliveries()
X = pd.get_dummies(df.drop(columns="minutes"), columns=["district"], dtype=float)
X_tr, X_te, y_tr, y_te, d_tr, d_te = train_test_split(X, df["minutes"], df[["district", "raining"]],
                                                       test_size=0.3, random_state=0)
for name, m in [("linear", LinearRegression()), ("boosting", HistGradientBoostingRegressor(random_state=0))]:
    err = pd.DataFrame({"abs_err": np.abs(m.fit(X_tr, y_tr).predict(X_te) - y_te),
                        "bias": m.predict(X_te) - y_te}).join(d_te)
    print(f"\\n{name}: overall MAE = {err['abs_err'].mean():.2f}")
    print(err.groupby(["district", "raining"]).agg(n=("abs_err", "size"), MAE=("abs_err", "mean"),
                                                   mean_bias=("bias", "mean")).round(2).unstack("raining"))</code></pre>
<div class="out">
linear: overall MAE = 5.01
             n        MAE       mean_bias      
raining      0    1     0     1         0     1
district                                       
Ba Dinh    182  174  5.05  4.95     -0.06  0.00
Cau Giay   182  165  4.93  4.78     -0.47  0.42
Ha Dong    189  183  5.01  4.91     -0.24  0.36
Long Bien   63   62  4.56  6.70      1.35 -4.47

boosting: overall MAE = 3.52
             n        MAE       mean_bias      
raining      0    1     0     1         0     1
district                                       
Ba Dinh    182  174  3.16  3.53     -0.13 -0.05
Cau Giay   182  165  3.55  3.53     -0.28  0.38
Ha Dong    189  183  3.47  3.86      0.33 -0.15
Long Bien   63   62  3.13  4.01     -0.46 -0.19</div>
<p><strong>What the slices reveal.</strong> The linear model's overall MAE is 5.01 minutes, and most cells sit near 5 with bias close to 0. But <strong>Long Bien in the rain</strong> stands out: MAE 6.70 and a mean bias of −4.47 — the model promises deliveries about 4.5 minutes too early there, and over-predicts Long Bien in dry weather (+1.35). The reason is structural: the true world has an interaction (rain hurts more in Long Bien), and a linear model with only main effects cannot express it, so it splits the difference. Long Bien is also the smallest group (10% of orders), so a careless average hides it. The boosting model learns the interaction: overall MAE 3.52 and the Long Bien rain bias shrinks to −0.19.</p>
<p><strong>From analysis to action.</strong> When a slice fails, ask: is there a missing feature or interaction? Too few examples (collect more, or reweight)? Different data quality in that group? A label problem? Fix, re-evaluate on the same slices, and keep the slice table in your report.</p>
<p><strong>Fairness.</strong> If slices are defined by people (region, gender, age), unequal errors become unequal treatment: customers in one district always get over-optimistic delivery promises, applicants of one group are refused more often by mistake. Common checks compare error rates, false-positive and false-negative rates, or selection rates across groups. Removing the sensitive column is not enough — other features (district, school) can act as proxies. Libraries such as Fairlearn compute these metrics; deciding which notion of fairness applies is a human and legal decision, not a technical default.</p>
<p><strong>Limits of explanation.</strong> Importances, PD curves and slice tables describe the model and the data it saw. They do not prove causes, they can be unstable when features are correlated, and they say nothing about data the model has not seen (new districts, new seasons). Document the model's intended use, data, metrics by subgroup and known limits in a short <strong>model card</strong>.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reporting only the overall metric.</li><li>Looking only at MAE per group and missing systematic bias in one direction.</li><li>Over-reading slices with a handful of rows — show n next to every number.</li><li>Believing that dropping a sensitive attribute guarantees fairness.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Slice errors by meaningful subgroups; report n, MAE and mean bias.</li><li>Systematic subgroup errors point to missing features, interactions or scarce data.</li><li>Subgroup analysis is the basis of fairness checks; proxies can reintroduce removed attributes.</li><li>Explanations describe the model, not causes; write a model card with known limits.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://fairlearn.org/" target="_blank" rel="noopener">Fairlearn — open-source toolkit for assessing and improving fairness</a></li><li><a href="https://arxiv.org/abs/1810.03993" target="_blank" rel="noopener">Mitchell et al. — Model Cards for Model Reporting (arXiv)</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/fairness" target="_blank" rel="noopener">Google ML Crash Course — Fairness</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write pandas code that gives n, MAE and mean bias by <code>hour</code> from a DataFrame with columns <code>hour</code>, <code>pred</code>, <code>true</code>.</li><li>Without the boosting model, how could you fix the linear model's Long Bien rain problem?</li><li>A loan model has equal accuracy for two regions but a much higher false-negative rate (good applicants refused) in one. Is it fair? What would you report?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <code>df.assign(err=df.pred - df.true).groupby("hour").agg(n=("err", "size"), MAE=("err", lambda e: e.abs().mean()), bias=("err", "mean"))</code>. 2) Add an interaction feature <code>raining × is_Long_Bien</code> (Lesson 5.2); the linear model can then add the extra minutes only for that cell. 3) Equal accuracy hides unequal harm; report false-negative and false-positive rates per region with group sizes and discuss with the business and legal team which fairness criterion applies.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 10 · Bài 10.3</span>
<h2>Phân tích sai số theo nhóm con và giới hạn của việc giải thích</h2>
<p class="lead">Sai số trung bình có thể trông ổn trong khi mô hình thất bại nặng với một nhóm người dùng. Chia sai số theo nhóm con là công cụ diễn giải thực dụng nhất bạn có — và cũng là nơi vấn đề công bằng lộ ra.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính sai số và độ lệch (bias) theo nhóm con, phát hiện thất bại có hệ thống.</li><li>Liên hệ thất bại của nhóm con với đặc trưng còn thiếu hoặc quá ít dữ liệu.</li><li>Nói rõ các phương pháp diễn giải cho biết gì và không cho biết gì.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Phân tích sai số</strong> nghĩa là xem mô hình sai <em>ở đâu</em>: theo quận, thời gian, loại khách, thiết bị, khoảng giá. Mỗi nhóm hai con số là đủ để bắt đầu: <strong>MAE</strong> (sai bao nhiêu) và <strong>độ lệch trung bình</strong> = trung bình(dự đoán − thực tế) (sai về phía nào). Một mô hình có độ lệch chung bằng 0 vẫn có thể đoán thấp có hệ thống ở nhóm này và đoán cao ở nhóm kia.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.model_selection import train_test_split

def make_deliveries(n=4000, seed=10):
    """Simulated delivery minutes with a known structure (so we can check explanations)."""
    rng = np.random.default_rng(seed)
    df = pd.DataFrame({
        "distance_km": rng.gamma(2.0, 1.6, n).round(1),
        "hour": rng.integers(8, 23, n),
        "raining": rng.integers(0, 2, n),
        "items": rng.integers(1, 8, n),
        "district": rng.choice(["Ba Dinh", "Cau Giay", "Ha Dong", "Long Bien"], n, p=[0.3, 0.3, 0.3, 0.1]),
    })
    rush = df["hour"].isin([11, 12, 18, 19]).astype(int)
    df["minutes"] = (18 + 3 * df["distance_km"] + 10 * rush + 6 * df["raining"] + 0.8 * df["items"]
                     + 5 * (df["district"] == "Long Bien") * df["raining"]
                     + rng.normal(0, 4, n)).round(1)
    return df

df = make_deliveries()
X = pd.get_dummies(df.drop(columns="minutes"), columns=["district"], dtype=float)
X_tr, X_te, y_tr, y_te, d_tr, d_te = train_test_split(X, df["minutes"], df[["district", "raining"]],
                                                       test_size=0.3, random_state=0)
for name, m in [("linear", LinearRegression()), ("boosting", HistGradientBoostingRegressor(random_state=0))]:
    err = pd.DataFrame({"abs_err": np.abs(m.fit(X_tr, y_tr).predict(X_te) - y_te),
                        "bias": m.predict(X_te) - y_te}).join(d_te)
    print(f"\\n{name}: overall MAE = {err['abs_err'].mean():.2f}")
    print(err.groupby(["district", "raining"]).agg(n=("abs_err", "size"), MAE=("abs_err", "mean"),
                                                   mean_bias=("bias", "mean")).round(2).unstack("raining"))</code></pre>
<div class="out">
linear: overall MAE = 5.01
             n        MAE       mean_bias      
raining      0    1     0     1         0     1
district                                       
Ba Dinh    182  174  5.05  4.95     -0.06  0.00
Cau Giay   182  165  4.93  4.78     -0.47  0.42
Ha Dong    189  183  5.01  4.91     -0.24  0.36
Long Bien   63   62  4.56  6.70      1.35 -4.47

boosting: overall MAE = 3.52
             n        MAE       mean_bias      
raining      0    1     0     1         0     1
district                                       
Ba Dinh    182  174  3.16  3.53     -0.13 -0.05
Cau Giay   182  165  3.55  3.53     -0.28  0.38
Ha Dong    189  183  3.47  3.86      0.33 -0.15
Long Bien   63   62  3.13  4.01     -0.46 -0.19</div>
<p><strong>Các lát cắt tiết lộ gì.</strong> MAE chung của mô hình tuyến tính là 5,01 phút, và phần lớn các ô quanh 5 với độ lệch gần 0. Nhưng <strong>Long Biên khi mưa</strong> nổi bật: MAE 6,70 và độ lệch trung bình −4,47 — mô hình hứa giao sớm hơn thực tế khoảng 4,5 phút ở đó, và đoán dư cho Long Biên khi trời khô (+1,35). Lý do mang tính cấu trúc: thế giới thật có một tương tác (mưa ở Long Biên tệ hơn), và mô hình tuyến tính chỉ có tác động chính không biểu diễn được nó, nên chia đôi phần chênh. Long Biên cũng là nhóm nhỏ nhất (10% số đơn), nên một phép trung bình cẩu thả che mất nó. Mô hình boosting học được tương tác: MAE chung 3,52 và độ lệch của Long Biên khi mưa co lại còn −0,19.</p>
<p><strong>Từ phân tích tới hành động.</strong> Khi một lát cắt thất bại, hãy hỏi: thiếu đặc trưng hay tương tác? Quá ít ví dụ (thu thêm, hoặc đánh trọng số lại)? Chất lượng dữ liệu nhóm đó khác? Nhãn có vấn đề? Sửa, đánh giá lại trên cùng các lát cắt, và giữ bảng lát cắt trong báo cáo.</p>
<p><strong>Công bằng.</strong> Nếu lát cắt được định nghĩa theo con người (vùng, giới, tuổi), sai số không đều trở thành đối xử không đều: khách ở một quận luôn nhận lời hứa giao hàng quá lạc quan, người nộp hồ sơ thuộc một nhóm bị từ chối nhầm nhiều hơn. Các kiểm tra thường gặp so tỉ lệ sai, tỉ lệ dương giả và âm giả, hoặc tỉ lệ được chọn giữa các nhóm. Bỏ cột nhạy cảm là chưa đủ — đặc trưng khác (quận, trường) có thể đóng vai đại lượng thay thế. Thư viện như Fairlearn tính các chỉ số này; quyết định khái niệm công bằng nào áp dụng là quyết định của con người và pháp lý, không phải một mặc định kỹ thuật.</p>
<p><strong>Giới hạn của việc giải thích.</strong> Độ quan trọng, đường PD và bảng lát cắt mô tả mô hình và dữ liệu nó đã thấy. Chúng không chứng minh nguyên nhân, có thể bất ổn khi đặc trưng tương quan, và không nói gì về dữ liệu mô hình chưa thấy (quận mới, mùa mới). Ghi mục đích sử dụng, dữ liệu, chỉ số theo nhóm con và các giới hạn đã biết của mô hình trong một <strong>model card</strong> ngắn.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ báo chỉ số tổng thể.</li><li>Chỉ nhìn MAE theo nhóm mà bỏ lỡ độ lệch có hệ thống về một phía.</li><li>Đọc quá nhiều vào lát cắt chỉ có vài dòng — ghi n cạnh mọi con số.</li><li>Tin rằng bỏ thuộc tính nhạy cảm là bảo đảm công bằng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chia sai số theo nhóm con có ý nghĩa; báo n, MAE và độ lệch trung bình.</li><li>Sai số có hệ thống ở nhóm con chỉ ra đặc trưng thiếu, tương tác hoặc dữ liệu khan hiếm.</li><li>Phân tích nhóm con là nền của kiểm tra công bằng; đại lượng thay thế có thể đưa thuộc tính đã bỏ quay lại.</li><li>Giải thích mô tả mô hình, không phải nguyên nhân; viết model card với các giới hạn đã biết.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://fairlearn.org/" target="_blank" rel="noopener">Fairlearn — bộ công cụ mã nguồn mở đánh giá và cải thiện công bằng</a></li><li><a href="https://arxiv.org/abs/1810.03993" target="_blank" rel="noopener">Mitchell và cộng sự — Model Cards for Model Reporting (arXiv)</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/fairness" target="_blank" rel="noopener">Google ML Crash Course — Công bằng</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết code pandas cho n, MAE và độ lệch trung bình theo <code>hour</code> từ DataFrame có cột <code>hour</code>, <code>pred</code>, <code>true</code>.</li><li>Không dùng boosting, bạn sửa vấn đề Long Biên khi mưa của mô hình tuyến tính thế nào?</li><li>Một mô hình cho vay có độ chính xác như nhau ở hai vùng nhưng tỉ lệ âm giả (người tốt bị từ chối) cao hơn nhiều ở một vùng. Có công bằng không? Bạn sẽ báo cáo gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <code>df.assign(err=df.pred - df.true).groupby("hour").agg(n=("err", "size"), MAE=("err", lambda e: e.abs().mean()), bias=("err", "mean"))</code>. 2) Thêm đặc trưng tương tác <code>raining × is_Long_Bien</code> (Bài 5.2); khi đó mô hình tuyến tính có thể cộng thêm số phút chỉ cho ô đó. 3) Độ chính xác bằng nhau che giấu thiệt hại không đều; báo tỉ lệ âm giả và dương giả theo vùng kèm cỡ nhóm và thảo luận với bộ phận nghiệp vụ, pháp lý xem tiêu chí công bằng nào áp dụng.</p></div>`);

const q10 = QZ(10, 'Quiz — Chapter 10: Model interpretation|||Quiz — Chương 10: Diễn giải mô hình',
  'Quiz 8 câu: thiên lệch của impurity importance, permutation importance trên test, đặc trưng tương quan, partial dependence, ICE, phân tích sai số theo nhóm, độ lệch trung bình, giải thích ≠ nhân quả.', [
  Q('q1', 'A random ID column gets notable impurity importance in a random forest. Why?|||Một cột ID ngẫu nhiên có impurity importance đáng kể trong rừng ngẫu nhiên. Vì sao?',
    ['Impurity importance is computed on training data and favours many-valued features|||Impurity importance tính trên dữ liệu huấn luyện và ưu ái đặc trưng nhiều giá trị', 'The ID is truly predictive|||ID thực sự có sức dự đoán', 'Permutation importance is broken|||Permutation importance bị lỗi', 'Trees cannot split on numbers|||Cây không chia được trên số'], 0,
    'The forest used it to split training noise; on test data its permutation importance was ≈ 0.|||Rừng dùng nó để chia nhiễu huấn luyện; trên test permutation importance của nó ≈ 0.'),
  Q('q2', 'Permutation importance should be computed on…|||Permutation importance nên tính trên…',
    ['held-out (validation/test) data|||dữ liệu giữ lại (validation/test)', 'the training data|||dữ liệu huấn luyện', 'random noise|||nhiễu ngẫu nhiên', 'the labels only|||chỉ trên nhãn'], 0,
    'It should measure reliance useful for new data, not memorisation.|||Nó cần đo sự phụ thuộc hữu ích cho dữ liệu mới, không phải học thuộc.'),
  Q('q3', 'Two strongly correlated features each show low permutation importance. A likely reason is…|||Hai đặc trưng tương quan mạnh đều có permutation importance thấp. Lý do khả dĩ là…',
    ['each can replace the other when shuffled|||cái này thay được cái kia khi bị xáo', 'both are useless|||cả hai vô dụng', 'the model is linear|||mô hình tuyến tính', 'the test set is too large|||tập test quá lớn'], 0,
    'Permute them together to measure their joint importance.|||Hãy xáo chúng cùng nhau để đo độ quan trọng chung.'),
  Q('q4', 'Partial dependence at value v is computed by…|||Partial dependence tại giá trị v được tính bằng cách…',
    ['setting the feature to v for every row and averaging predictions|||gán đặc trưng bằng v cho mọi dòng rồi lấy trung bình dự đoán', 'filtering rows where the feature equals v|||lọc các dòng có đặc trưng bằng v', 'refitting the model without the feature|||fit lại mô hình không có đặc trưng đó', 'shuffling the feature|||xáo trộn đặc trưng'], 0,
    'It is an average over the data distribution of the other features.|||Nó là trung bình theo phân phối của các đặc trưng còn lại.'),
  Q('q5', 'ICE curves that are not parallel suggest…|||Các đường ICE không song song gợi ý…',
    ['an interaction with other features|||có tương tác với đặc trưng khác', 'a linear model|||mô hình tuyến tính', 'no effect at all|||không có tác động gì', 'a data leak for sure|||chắc chắn rò rỉ'], 0,
    'The feature’s effect differs between rows.|||Tác động của đặc trưng khác nhau giữa các dòng.'),
  Q('q6', 'Overall MAE 5.0 but MAE 6.7 with bias −4.5 for one district in rain. The model…|||MAE chung 5,0 nhưng một quận khi mưa có MAE 6,7 và độ lệch −4,5. Mô hình…',
    ['systematically under-predicts that subgroup|||đoán thấp có hệ thống cho nhóm con đó', 'is perfect for that subgroup|||hoàn hảo cho nhóm đó', 'over-predicts that subgroup|||đoán cao cho nhóm đó', 'has no bias anywhere|||không lệch ở đâu cả'], 0,
    'Negative mean(prediction − truth) = predictions too low.|||Trung bình(dự đoán − thực tế) âm = dự đoán quá thấp.'),
  Q('q7', 'Removing the “gender” column from a loan model guarantees fairness.|||Bỏ cột “giới tính” khỏi mô hình cho vay là bảo đảm công bằng.',
    ['False — other features can act as proxies|||Sai — đặc trưng khác có thể đóng vai đại lượng thay thế', 'True|||Đúng', 'True if accuracy stays the same|||Đúng nếu độ chính xác không đổi', 'True for tree models only|||Đúng chỉ với mô hình cây'], 0,
    'Check error rates by group instead of assuming.|||Hãy kiểm tỉ lệ sai theo nhóm thay vì mặc định.'),
  Q('q8', 'A partial dependence curve shows predictions rise with distance. This proves…|||Đường partial dependence cho thấy dự đoán tăng theo quãng đường. Điều này chứng minh…',
    ['only how the model uses distance, not a causal effect|||chỉ cách mô hình dùng quãng đường, không phải tác động nhân quả', 'that distance causes delays|||quãng đường gây ra chậm trễ', 'that the model is unbiased|||mô hình không thiên lệch', 'that there is no leakage|||không có rò rỉ'], 0,
    'Interpretation methods describe the model; causal claims need experiments or causal analysis.|||Phương pháp diễn giải mô tả mô hình; khẳng định nhân quả cần thử nghiệm hoặc phân tích nhân quả.'),
]);

const ch10 = {
  title: 'Chapter 10 — Model interpretation|||Chương 10 — Diễn giải mô hình',
  description: 'Độ quan trọng đặc trưng (hệ số, impurity, permutation), partial dependence và ICE, phân tích sai số theo nhóm con, công bằng, model card và giới hạn của việc giải thích.',
  lessons: [c101, c102, c103, q10],
};


// ───────────────────────────── Chương 11 — Tái lập ─────────────────────────────
const c111 = L('dsi201-ts-11-1',
  '11.1 — Reproducible notebooks: hidden state, seeds and project structure|||11.1 — Notebook tái lập được: trạng thái ẩn, seed và cấu trúc dự án',
  'Ba nguồn không tái lập: trạng thái ẩn của notebook, ngẫu nhiên không seed, dữ liệu/môi trường đổi; “Restart & Run All”; random_state và default_rng; điểm CV rừng dao động 0,406–0,431 theo seed; cấu trúc thư mục chuẩn.',
  `<span class="eyebrow">DSI201 · Chapter 11 · Lesson 11.1</span>
<h2>Reproducible notebooks: hidden state, seeds and project structure</h2>
<p class="lead">A result nobody can reproduce — including you, next month — is not a result. Reproducibility is mostly a set of habits that cost minutes and save days.</p>
<h3>🎯 Objectives</h3>
<ul><li>Name the main sources of irreproducibility in data projects.</li><li>Control randomness with seeds in NumPy and scikit-learn.</li><li>Organise a project so that someone else can run it from scratch.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Source 1 — hidden notebook state.</strong> Jupyter lets you run cells in any order, re-run one cell ten times, delete a cell whose variable still lives in memory. The notebook on screen then no longer describes the computation that produced its outputs. The cure is simple: before you share or trust a result, choose <strong>Kernel → Restart &amp; Run All</strong>. If it fails or the numbers change, you had hidden state. Keep notebooks linear (top to bottom), and move reusable code into <code>.py</code> files that the notebook imports.</p>
<p><strong>Source 2 — randomness.</strong> Splits, cross-validation shuffles, bootstrap samples, random forests and k-means initialisations all use random numbers.</p>
<pre><code class="language-python">import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import cross_val_score, train_test_split

X, y = load_diabetes(return_X_y=True)

# 1) Unseeded randomness: two "runs" of the same code give different splits and scores
a = train_test_split(X, y, test_size=0.2)[3]
b = train_test_split(X, y, test_size=0.2)[3]
print("unseeded splits identical?", np.array_equal(a, b))

# 2) Seeded: identical every time, on every machine with the same library versions
a = train_test_split(X, y, test_size=0.2, random_state=42)[3]
b = train_test_split(X, y, test_size=0.2, random_state=42)[3]
print("seeded splits identical?  ", np.array_equal(a, b))

# 3) Models have their own randomness too
def cv_score(seed):
    rf = RandomForestRegressor(n_estimators=50, random_state=seed)
    return cross_val_score(rf, X, y, cv=5, scoring="r2").mean()

print("forest seed 0 twice:", round(float(cv_score(0)), 4), round(float(cv_score(0)), 4))
print("forest seeds 0..4  :", [round(float(cv_score(s)), 3) for s in range(5)])

# 4) One Generator object, created once from one seed, feeds all your own random draws
rng = np.random.default_rng(2026)
print("bootstrap sample of row ids:", rng.choice(len(y), size=5, replace=True))</code></pre>
<div class="out">unseeded splits identical? False
seeded splits identical?   True
forest seed 0 twice: 0.4314 0.4314
forest seeds 0..4  : [0.431, 0.419, 0.406, 0.416, 0.413]
bootstrap sample of row ids: [376  79  11 282 161]</div>
<p>Without a seed, two runs of the same line produced different test sets. With <code>random_state=42</code> they are identical. A random forest with a fixed seed gives exactly the same CV score twice (0.4314), but the five seeds 0–4 give scores from 0.406 to 0.431. That spread is real uncertainty: if model B beats model A by 0.01 with one seed, the “win” may vanish with another. Fix seeds to make runs <em>repeatable</em>; vary seeds to check that conclusions are <em>robust</em>. For your own random draws, create one <code>np.random.default_rng(seed)</code> at the top and pass it around, instead of calling the legacy global <code>np.random.seed</code>.</p>
<p><strong>Source 3 — changing data and environments.</strong> A CSV overwritten by a newer export, a database table updated overnight, a library upgrade that changes a default: each changes your numbers silently. Lessons 11.2–11.3 deal with environments, data fingerprints and version control.</p>
<div class="formula"><span class="lbl">A simple project layout</span>README.md (what, how to run) · requirements.txt · data/raw/ (never edited by hand) · data/processed/ (produced by code) · notebooks/ (numbered: 01-eda.ipynb…) · src/ (reusable functions) · models/ · reports/ (figures, final summary)</div>
<p>Raw data are read-only: every cleaning step is code (Chapter 3), so anyone can regenerate <code>processed/</code> from <code>raw/</code>. Number notebooks in execution order. Put paths and parameters (seed, test size) in one place at the top.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Results that depend on running cells in a particular non-linear order.</li><li>Editing raw data by hand in Excel “just once”.</li><li>Seeding once and reporting the best of many seeds as if it were typical.</li><li>Absolute paths like <code>C:/Users/me/Desktop/final_final2.csv</code>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Always “Restart &amp; Run All” before trusting a notebook.</li><li>Set <code>random_state</code> / <code>default_rng(seed)</code>; check robustness across several seeds.</li><li>Raw data read-only; all transformations in code.</li><li>Use a standard folder structure with a README that says how to run everything.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://arxiv.org/abs/1810.08055" target="_blank" rel="noopener">Rule et al. — Ten Simple Rules for Reproducible Research in Jupyter Notebooks (arXiv)</a></li><li><a href="https://scikit-learn.org/stable/common_pitfalls.html#controlling-randomness" target="_blank" rel="noopener">scikit-learn — Controlling randomness</a></li><li><a href="https://numpy.org/doc/stable/reference/random/generator.html" target="_blank" rel="noopener">NumPy — Random Generator</a></li><li><a href="https://cookiecutter-data-science.drivendata.org/" target="_blank" rel="noopener">Cookiecutter Data Science — a standard project structure</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Your notebook shows test MAE 3.1, but after “Restart &amp; Run All” it shows 3.6. Give two possible causes.</li><li>Why is it misleading to try 20 seeds and report the best one?</li><li>Where in the project layout would you put: (a) the downloaded API responses, (b) a function that computes features, (c) the final chart for the report?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Cells were run out of order (e.g. the model was fitted on data before a filtering cell was changed), or an unseeded random step produced a different split/model. 2) The best of 20 is selected on noise — like reporting <code>best_score_</code> (Lesson 6.2); report the mean and spread across seeds. 3) (a) <code>data/raw/</code>, (b) <code>src/features.py</code>, (c) <code>reports/figures/</code>.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 11 · Bài 11.1</span>
<h2>Notebook tái lập được: trạng thái ẩn, seed và cấu trúc dự án</h2>
<p class="lead">Một kết quả không ai tái tạo được — kể cả chính bạn tháng sau — thì không phải là kết quả. Tính tái lập chủ yếu là một bộ thói quen tốn vài phút mà tiết kiệm vài ngày.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Gọi tên các nguồn chính gây mất tính tái lập trong dự án dữ liệu.</li><li>Kiểm soát ngẫu nhiên bằng seed trong NumPy và scikit-learn.</li><li>Tổ chức dự án để người khác chạy lại được từ đầu.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Nguồn 1 — trạng thái ẩn của notebook.</strong> Jupyter cho chạy ô theo thứ tự bất kỳ, chạy lại một ô mười lần, xoá một ô mà biến của nó vẫn nằm trong bộ nhớ. Khi đó notebook trên màn hình không còn mô tả phép tính đã sinh ra output. Cách chữa đơn giản: trước khi chia sẻ hay tin một kết quả, chọn <strong>Kernel → Restart &amp; Run All</strong>. Nếu lỗi hoặc con số đổi, bạn đã có trạng thái ẩn. Giữ notebook tuyến tính (trên xuống dưới), và chuyển code dùng lại vào tệp <code>.py</code> để notebook import.</p>
<p><strong>Nguồn 2 — ngẫu nhiên.</strong> Phép chia dữ liệu, xáo trộn trong kiểm định chéo, mẫu bootstrap, rừng ngẫu nhiên và khởi tạo k-means đều dùng số ngẫu nhiên.</p>
<pre><code class="language-python">import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import cross_val_score, train_test_split

X, y = load_diabetes(return_X_y=True)

# 1) Unseeded randomness: two "runs" of the same code give different splits and scores
a = train_test_split(X, y, test_size=0.2)[3]
b = train_test_split(X, y, test_size=0.2)[3]
print("unseeded splits identical?", np.array_equal(a, b))

# 2) Seeded: identical every time, on every machine with the same library versions
a = train_test_split(X, y, test_size=0.2, random_state=42)[3]
b = train_test_split(X, y, test_size=0.2, random_state=42)[3]
print("seeded splits identical?  ", np.array_equal(a, b))

# 3) Models have their own randomness too
def cv_score(seed):
    rf = RandomForestRegressor(n_estimators=50, random_state=seed)
    return cross_val_score(rf, X, y, cv=5, scoring="r2").mean()

print("forest seed 0 twice:", round(float(cv_score(0)), 4), round(float(cv_score(0)), 4))
print("forest seeds 0..4  :", [round(float(cv_score(s)), 3) for s in range(5)])

# 4) One Generator object, created once from one seed, feeds all your own random draws
rng = np.random.default_rng(2026)
print("bootstrap sample of row ids:", rng.choice(len(y), size=5, replace=True))</code></pre>
<div class="out">unseeded splits identical? False
seeded splits identical?   True
forest seed 0 twice: 0.4314 0.4314
forest seeds 0..4  : [0.431, 0.419, 0.406, 0.416, 0.413]
bootstrap sample of row ids: [376  79  11 282 161]</div>
<p>Không seed, hai lần chạy cùng một dòng cho hai tập test khác nhau. Với <code>random_state=42</code> chúng giống hệt. Rừng ngẫu nhiên với seed cố định cho đúng cùng điểm CV hai lần (0,4314), nhưng năm seed 0–4 cho điểm từ 0,406 tới 0,431. Độ phân tán đó là bất định thật: nếu mô hình B thắng A 0,01 với một seed, “chiến thắng” có thể biến mất với seed khác. Cố định seed để các lần chạy <em>lặp lại được</em>; thay đổi seed để kiểm kết luận <em>vững vàng</em>. Với các phép rút ngẫu nhiên của riêng bạn, tạo một <code>np.random.default_rng(seed)</code> ở đầu rồi truyền đi, thay vì gọi <code>np.random.seed</code> toàn cục kiểu cũ.</p>
<p><strong>Nguồn 3 — dữ liệu và môi trường thay đổi.</strong> Một tệp CSV bị ghi đè bởi bản xuất mới hơn, một bảng CSDL được cập nhật trong đêm, một lần nâng cấp thư viện đổi giá trị mặc định: mỗi thứ âm thầm làm đổi con số của bạn. Bài 11.2–11.3 xử lý môi trường, dấu vân tay dữ liệu và quản lý phiên bản.</p>
<div class="formula"><span class="lbl">Bố cục dự án đơn giản</span>README.md (là gì, chạy thế nào) · requirements.txt · data/raw/ (không bao giờ sửa tay) · data/processed/ (do code sinh ra) · notebooks/ (đánh số: 01-eda.ipynb…) · src/ (hàm dùng lại) · models/ · reports/ (hình, bản tóm tắt cuối)</div>
<p>Dữ liệu thô chỉ đọc: mọi bước làm sạch là code (Chương 3), nên ai cũng tái tạo được <code>processed/</code> từ <code>raw/</code>. Đánh số notebook theo thứ tự chạy. Đặt đường dẫn và tham số (seed, tỉ lệ test) ở một chỗ trên đầu.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kết quả phụ thuộc việc chạy ô theo một thứ tự không tuyến tính nào đó.</li><li>Sửa tay dữ liệu thô bằng Excel “chỉ một lần thôi”.</li><li>Đặt seed một lần rồi báo kết quả tốt nhất trong nhiều seed như thể nó điển hình.</li><li>Đường dẫn tuyệt đối kiểu <code>C:/Users/me/Desktop/final_final2.csv</code>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Luôn “Restart &amp; Run All” trước khi tin một notebook.</li><li>Đặt <code>random_state</code> / <code>default_rng(seed)</code>; kiểm độ vững qua nhiều seed.</li><li>Dữ liệu thô chỉ đọc; mọi biến đổi bằng code.</li><li>Dùng cấu trúc thư mục chuẩn với README nói cách chạy mọi thứ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://arxiv.org/abs/1810.08055" target="_blank" rel="noopener">Rule và cộng sự — Ten Simple Rules for Reproducible Research in Jupyter Notebooks (arXiv)</a></li><li><a href="https://scikit-learn.org/stable/common_pitfalls.html#controlling-randomness" target="_blank" rel="noopener">scikit-learn — Kiểm soát tính ngẫu nhiên</a></li><li><a href="https://numpy.org/doc/stable/reference/random/generator.html" target="_blank" rel="noopener">NumPy — Random Generator</a></li><li><a href="https://cookiecutter-data-science.drivendata.org/" target="_blank" rel="noopener">Cookiecutter Data Science — một cấu trúc dự án chuẩn</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Notebook của bạn hiện MAE test 3,1, nhưng sau “Restart &amp; Run All” thì hiện 3,6. Nêu hai nguyên nhân có thể.</li><li>Vì sao thử 20 seed rồi báo seed tốt nhất là gây hiểu lầm?</li><li>Trong bố cục dự án, bạn đặt ở đâu: (a) phản hồi API đã tải, (b) hàm tính đặc trưng, (c) biểu đồ cuối cùng cho báo cáo?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Các ô bị chạy sai thứ tự (vd mô hình được fit trên dữ liệu trước khi một ô lọc bị sửa), hoặc một bước ngẫu nhiên không seed cho ra phép chia/mô hình khác. 2) Cái tốt nhất trong 20 được chọn dựa trên nhiễu — giống báo <code>best_score_</code> (Bài 6.2); hãy báo trung bình và độ phân tán qua các seed. 3) (a) <code>data/raw/</code>, (b) <code>src/features.py</code>, (c) <code>reports/figures/</code>.</p></div>`);

const c112 = L('dsi201-ts-11-2',
  '11.2 — Environments, pinned versions and saving models with metadata|||11.2 — Môi trường, phiên bản cố định và lưu mô hình kèm metadata',
  'Môi trường ảo (venv/conda), requirements.txt ghim phiên bản, ghi phiên bản Python và thư viện, dấu vân tay dữ liệu SHA-256, lưu pipeline bằng joblib kèm tệp metadata JSON, nạp lại cho dự đoán giống hệt; cảnh báo bảo mật của pickle.',
  `<span class="eyebrow">DSI201 · Chapter 11 · Lesson 11.2</span>
<h2>Environments, pinned versions and saving models with metadata</h2>
<p class="lead">“It works on my machine” usually means “my machine has different library versions”. Isolated environments and pinned versions make code run the same everywhere; saving the model with its metadata makes the result traceable.</p>
<h3>🎯 Objectives</h3>
<ul><li>Create an isolated environment and pin package versions.</li><li>Fingerprint the training data.</li><li>Save and reload a fitted pipeline together with the information needed to trust it.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Isolated environments.</strong> Installing everything into one global Python mixes the requirements of all your projects; upgrading pandas for one project can break another. A <strong>virtual environment</strong> is a private folder of packages per project: <code>python3 -m venv .venv</code>, then <code>source .venv/bin/activate</code> (Windows: <code>.venv\\Scripts\\activate</code>), then <code>pip install ...</code>. Conda environments do the same and also manage non-Python libraries. Colab is convenient, but its versions change over time — record them.</p>
<p><strong>Pinning.</strong> <code>pandas</code> in requirements.txt means “any version”; <code>pandas==3.1.1</code> means exactly this one. Pin versions for anything whose results you report; <code>pip install -r requirements.txt</code> recreates the environment. (Tools such as pip-tools, Poetry or uv also generate lock files with every indirect dependency.) Defaults do change between versions — for example how pandas displays text columns changed in pandas 3 — so a version list is part of the result.</p>
<pre><code class="language-python">import hashlib, json, platform
from importlib.metadata import version

import joblib
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

# 1) Record the exact environment (this is what goes into requirements.txt)
pkgs = ["numpy", "pandas", "scikit-learn", "matplotlib", "joblib"]
req = "\\n".join(f"{p}=={version(p)}" for p in pkgs)
open("requirements.txt", "w").write(req + "\\n")
print("python", platform.python_version())
print(req)

# 2) Fingerprint the data you trained on
X, y = load_diabetes(return_X_y=True)
data_hash = hashlib.sha256(np.ascontiguousarray(X).tobytes() + y.tobytes()).hexdigest()[:16]

# 3) Save the fitted pipeline together with metadata
model = make_pipeline(StandardScaler(), Ridge(alpha=1.0)).fit(X, y)
joblib.dump(model, "model.joblib")
meta = {"model": "StandardScaler + Ridge(alpha=1.0)", "data_sha256_16": data_hash,
        "n_rows": int(len(y)), "sklearn": version("scikit-learn"), "train_r2": round(model.score(X, y), 4)}
json.dump(meta, open("model_meta.json", "w"), indent=2)
print(json.dumps(meta))

# 4) Reload and check that predictions are identical
again = joblib.load("model.joblib")
print("reloaded predictions identical?", np.array_equal(model.predict(X[:5]), again.predict(X[:5])))</code></pre>
<div class="out">python 3.14.6
numpy==2.5.4
pandas==3.1.1
scikit-learn==1.9.1
matplotlib==3.11.2
joblib==1.6.0
{"model": "StandardScaler + Ridge(alpha=1.0)", "data_sha256_16": "84ec38030d0ff6df", "n_rows": 442, "sklearn": "1.9.1", "train_r2": 0.5176}
reloaded predictions identical? True</div>
<p><strong>What the code did.</strong> (1) It wrote a requirements.txt with the exact versions in use and printed the Python version. (2) It computed a SHA-256 fingerprint of the training data — if anyone changes a single value, the hash changes, so you can prove which data a model saw. For files, hash the file bytes. (3) It saved the fitted pipeline with <code>joblib.dump</code> and wrote a small JSON file with the model description, data hash, row count, scikit-learn version and training score. (4) It reloaded the model and confirmed identical predictions.</p>
<div class="formula"><span class="lbl">Minimum metadata for a saved model</span>what (pipeline + hyper-parameters) · trained on (data source, date range, hash, rows) · with (Python + library versions, git commit) · how good (validation/test metrics, by subgroup) · for (intended use and known limits)</div>
<p><strong>Security and compatibility.</strong> joblib/pickle files can execute code when loaded: <strong>never load a model file from an untrusted source</strong>. A pickled model generally needs the same scikit-learn version to load safely; for long-term or cross-language deployment, formats such as ONNX or skops exist. For Docker-based deployment (as in many FPTU projects), the same requirements file goes into the image.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li><code>pip freeze</code> from a global environment with 300 unrelated packages.</li><li>Saving only the model, not the preprocessing — ship the whole pipeline (Lesson 5.3).</li><li>Loading pickles shared in group chats or downloaded from the internet.</li><li>No record of which data version trained the deployed model.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>One virtual environment per project; pin versions in requirements.txt.</li><li>Fingerprint data with a hash; record versions next to results.</li><li>Save the whole fitted pipeline plus a metadata file; verify predictions after reload.</li><li>Only load model files you trust.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://docs.python.org/3/library/venv.html" target="_blank" rel="noopener">Python docs — venv: creation of virtual environments</a></li><li><a href="https://pip.pypa.io/en/stable/user_guide/" target="_blank" rel="noopener">pip User Guide — requirements files</a></li><li><a href="https://scikit-learn.org/stable/model_persistence.html" target="_blank" rel="noopener">scikit-learn — Model persistence (joblib, pickle, skops, ONNX)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A teammate gets an import error with your notebook. List the three files/commands you would send them.</li><li>Why is a hash better than “the file name and the date” for identifying training data?</li><li>Your saved model was trained with scikit-learn 1.9; production has 1.6. What can happen and what should you do?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) requirements.txt (pinned), the command <code>python3 -m venv .venv &amp;&amp; source .venv/bin/activate &amp;&amp; pip install -r requirements.txt</code>, and the README describing how to run the notebook (plus the data source). 2) Files get overwritten under the same name; a hash changes whenever the content changes, so it identifies the exact data. 3) Loading may fail or behave differently (warnings about version mismatch); align versions (rebuild the environment from requirements) or retrain in the production version.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 11 · Bài 11.2</span>
<h2>Môi trường, phiên bản cố định và lưu mô hình kèm metadata</h2>
<p class="lead">“Máy em chạy được mà” thường nghĩa là “máy em có phiên bản thư viện khác”. Môi trường tách biệt và phiên bản cố định giúp code chạy như nhau ở mọi nơi; lưu mô hình kèm metadata giúp truy vết được kết quả.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tạo môi trường tách biệt và ghim phiên bản gói.</li><li>Lấy dấu vân tay dữ liệu huấn luyện.</li><li>Lưu và nạp lại một pipeline đã fit cùng thông tin cần thiết để tin nó.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Môi trường tách biệt.</strong> Cài mọi thứ vào một Python toàn cục sẽ trộn yêu cầu của mọi dự án; nâng cấp pandas cho dự án này có thể làm hỏng dự án kia. <strong>Môi trường ảo</strong> là một thư mục gói riêng cho mỗi dự án: <code>python3 -m venv .venv</code>, rồi <code>source .venv/bin/activate</code> (Windows: <code>.venv\\Scripts\\activate</code>), rồi <code>pip install ...</code>. Môi trường conda làm việc tương tự và quản lý cả thư viện không phải Python. Colab tiện, nhưng phiên bản của nó thay đổi theo thời gian — hãy ghi lại.</p>
<p><strong>Ghim phiên bản.</strong> <code>pandas</code> trong requirements.txt nghĩa là “phiên bản nào cũng được”; <code>pandas==3.1.1</code> nghĩa là đúng bản này. Ghim phiên bản cho mọi thứ mà bạn báo cáo kết quả; <code>pip install -r requirements.txt</code> dựng lại môi trường. (Các công cụ như pip-tools, Poetry hay uv còn sinh tệp khoá với mọi phụ thuộc gián tiếp.) Giá trị mặc định có đổi giữa các phiên bản — ví dụ cách pandas hiển thị cột chữ đã đổi ở pandas 3 — nên danh sách phiên bản là một phần của kết quả.</p>
<pre><code class="language-python">import hashlib, json, platform
from importlib.metadata import version

import joblib
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

# 1) Record the exact environment (this is what goes into requirements.txt)
pkgs = ["numpy", "pandas", "scikit-learn", "matplotlib", "joblib"]
req = "\\n".join(f"{p}=={version(p)}" for p in pkgs)
open("requirements.txt", "w").write(req + "\\n")
print("python", platform.python_version())
print(req)

# 2) Fingerprint the data you trained on
X, y = load_diabetes(return_X_y=True)
data_hash = hashlib.sha256(np.ascontiguousarray(X).tobytes() + y.tobytes()).hexdigest()[:16]

# 3) Save the fitted pipeline together with metadata
model = make_pipeline(StandardScaler(), Ridge(alpha=1.0)).fit(X, y)
joblib.dump(model, "model.joblib")
meta = {"model": "StandardScaler + Ridge(alpha=1.0)", "data_sha256_16": data_hash,
        "n_rows": int(len(y)), "sklearn": version("scikit-learn"), "train_r2": round(model.score(X, y), 4)}
json.dump(meta, open("model_meta.json", "w"), indent=2)
print(json.dumps(meta))

# 4) Reload and check that predictions are identical
again = joblib.load("model.joblib")
print("reloaded predictions identical?", np.array_equal(model.predict(X[:5]), again.predict(X[:5])))</code></pre>
<div class="out">python 3.14.6
numpy==2.5.4
pandas==3.1.1
scikit-learn==1.9.1
matplotlib==3.11.2
joblib==1.6.0
{"model": "StandardScaler + Ridge(alpha=1.0)", "data_sha256_16": "84ec38030d0ff6df", "n_rows": 442, "sklearn": "1.9.1", "train_r2": 0.5176}
reloaded predictions identical? True</div>
<p><strong>Code đã làm gì.</strong> (1) Ghi requirements.txt với đúng phiên bản đang dùng và in phiên bản Python. (2) Tính dấu vân tay SHA-256 của dữ liệu huấn luyện — ai đổi dù chỉ một giá trị thì mã băm đổi, nên bạn chứng minh được mô hình đã thấy dữ liệu nào. Với tệp, hãy băm các byte của tệp. (3) Lưu pipeline đã fit bằng <code>joblib.dump</code> và ghi một tệp JSON nhỏ gồm mô tả mô hình, mã băm dữ liệu, số dòng, phiên bản scikit-learn và điểm huấn luyện. (4) Nạp lại mô hình và xác nhận dự đoán giống hệt.</p>
<div class="formula"><span class="lbl">Metadata tối thiểu cho một mô hình đã lưu</span>cái gì (pipeline + siêu tham số) · học trên gì (nguồn dữ liệu, khoảng thời gian, mã băm, số dòng) · bằng gì (phiên bản Python + thư viện, commit git) · tốt thế nào (chỉ số validation/test, theo nhóm con) · để làm gì (mục đích sử dụng và giới hạn đã biết)</div>
<p><strong>Bảo mật và tương thích.</strong> Tệp joblib/pickle có thể chạy code khi được nạp: <strong>không bao giờ nạp tệp mô hình từ nguồn không tin cậy</strong>. Mô hình pickle thường cần cùng phiên bản scikit-learn để nạp an toàn; để triển khai lâu dài hay đa ngôn ngữ có các định dạng như ONNX hoặc skops. Với triển khai bằng Docker (như nhiều đồ án ở FPTU), cùng tệp requirements đó được đưa vào image.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li><code>pip freeze</code> từ môi trường toàn cục với 300 gói không liên quan.</li><li>Chỉ lưu mô hình, không lưu tiền xử lý — hãy giao cả pipeline (Bài 5.3).</li><li>Nạp tệp pickle được chia sẻ trong nhóm chat hay tải từ internet.</li><li>Không ghi lại phiên bản dữ liệu nào đã huấn luyện mô hình đang chạy.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mỗi dự án một môi trường ảo; ghim phiên bản trong requirements.txt.</li><li>Lấy dấu vân tay dữ liệu bằng mã băm; ghi phiên bản cạnh kết quả.</li><li>Lưu cả pipeline đã fit kèm tệp metadata; kiểm dự đoán sau khi nạp lại.</li><li>Chỉ nạp tệp mô hình bạn tin cậy.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://docs.python.org/3/library/venv.html" target="_blank" rel="noopener">Tài liệu Python — venv: tạo môi trường ảo</a></li><li><a href="https://pip.pypa.io/en/stable/user_guide/" target="_blank" rel="noopener">pip User Guide — tệp requirements</a></li><li><a href="https://scikit-learn.org/stable/model_persistence.html" target="_blank" rel="noopener">scikit-learn — Lưu mô hình (joblib, pickle, skops, ONNX)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Bạn cùng nhóm gặp lỗi import khi chạy notebook của bạn. Liệt kê ba tệp/lệnh bạn gửi cho họ.</li><li>Vì sao mã băm tốt hơn “tên tệp và ngày” để xác định dữ liệu huấn luyện?</li><li>Mô hình đã lưu được huấn luyện bằng scikit-learn 1.9; môi trường chạy thật có 1.6. Điều gì có thể xảy ra và nên làm gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) requirements.txt (đã ghim), lệnh <code>python3 -m venv .venv &amp;&amp; source .venv/bin/activate &amp;&amp; pip install -r requirements.txt</code>, và README mô tả cách chạy notebook (kèm nguồn dữ liệu). 2) Tệp bị ghi đè dưới cùng tên; mã băm đổi mỗi khi nội dung đổi, nên nó xác định đúng dữ liệu. 3) Nạp có thể lỗi hoặc hành xử khác (cảnh báo lệch phiên bản); đồng bộ phiên bản (dựng lại môi trường từ requirements) hoặc huấn luyện lại trên phiên bản đang chạy thật.</p></div>`);

const c113 = L('dsi201-ts-11-3',
  '11.3 — Version control with git for data projects|||11.3 — Quản lý phiên bản bằng git cho dự án dữ liệu',
  'Chạy git thật: init, .gitignore cho data/raw, models, .env; git status cho thấy dữ liệu và bí mật bị bỏ qua; commit nhỏ có thông điệp ghi kết quả; notebook và diff; dữ liệu lớn → DVC/lưu trữ ngoài; nhánh và pull request.',
  `<span class="eyebrow">DSI201 · Chapter 11 · Lesson 11.3</span>
<h2>Version control with git for data projects</h2>
<p class="lead">git records every change to your code, lets you return to the exact version that produced a result, and lets a team work in parallel. Data projects need a few extra rules: what <em>not</em> to commit matters as much as what to commit.</p>
<h3>🎯 Objectives</h3>
<ul><li>Initialise a repository and ignore data, models and secrets.</li><li>Write small commits with informative messages that link code to results.</li><li>Know how to handle notebooks and large data in version control.</li></ul>
<h3>📖 Lecture</h3>
<p>The script below runs real git commands in a temporary folder (with a fixed author and date so the commit ids are reproducible). It creates a small project containing code, a raw data file and a <code>.env</code> file holding a fake API key.</p>
<pre><code class="language-python">import os, subprocess, tempfile, textwrap

# Run real git commands in a throw-away folder (fixed author/date -&gt; reproducible commit ids)
env = dict(os.environ, GIT_AUTHOR_NAME="Student", GIT_AUTHOR_EMAIL="student@example.com",
           GIT_COMMITTER_NAME="Student", GIT_COMMITTER_EMAIL="student@example.com",
           GIT_AUTHOR_DATE="2026-11-01T10:00:00+07:00", GIT_COMMITTER_DATE="2026-11-01T10:00:00+07:00")
repo = tempfile.mkdtemp()
def sh(cmd):
    out = subprocess.run(cmd, shell=True, cwd=repo, env=env, capture_output=True, text=True)
    print("$ " + cmd + ("\\n" + out.stdout.rstrip() if out.stdout.strip() else ""))

def write(path, text):
    os.makedirs(os.path.join(repo, os.path.dirname(path)), exist_ok=True)
    open(os.path.join(repo, path), "w").write(textwrap.dedent(text))

write(".gitignore", """\\
    data/raw/
    models/
    .env
    __pycache__/
    .ipynb_checkpoints/
    """)
write("README.md", "# Delivery-time project\\nRun: pip install -r requirements.txt &amp;&amp; python src/train.py\\n")
write("requirements.txt", "pandas==3.1.1\\nscikit-learn==1.9.1\\n")
write("src/train.py", "print('training...')\\n")
write("data/raw/orders.csv", "order_id,minutes\\n1,31\\n")      # large/private raw data: NOT committed
write(".env", "API_KEY=secret-do-not-commit\\n")              # secrets: NOT committed

sh("git init -q -b main")
sh("git add .")
sh("git status --short")
sh("git commit -q -m 'Set up project: structure, requirements, training script'")
write("src/train.py", "print('training with log target')\\n")
sh("git commit -q -am 'Use log target (val MAE 0.43 -&gt; 0.36)'")
sh("git log --oneline")</code></pre>
<div class="out">$ git init -q -b main
$ git add .
$ git status --short
A  .gitignore
A  README.md
A  requirements.txt
A  src/train.py
$ git commit -q -m 'Set up project: structure, requirements, training script'
$ git commit -q -am 'Use log target (val MAE 0.43 -&gt; 0.36)'
$ git log --oneline
07e48ce Use log target (val MAE 0.43 -&gt; 0.36)
0fd7f5f Set up project: structure, requirements, training script</div>
<p><strong>What to commit.</strong> <code>git status --short</code> after <code>git add .</code> lists only four files: .gitignore, README.md, requirements.txt and src/train.py. The raw CSV and the <code>.env</code> secret were never staged, because <code>.gitignore</code> excludes <code>data/raw/</code>, <code>models/</code> and <code>.env</code>. Commit code, configuration, requirements, small documentation and small derived tables; do <strong>not</strong> commit large or personal data, trained model binaries, secrets (API keys, database passwords) or notebook checkpoint folders. A secret pushed once to a public repository must be treated as leaked — revoke it — even if you delete it later, because it stays in the history.</p>
<p><strong>Commits as a lab book.</strong> Each commit is one logical step with a message that says <em>what</em> and <em>why</em>, and for modelling changes the effect: “Use log target (val MAE 0.43 → 0.36)”. <code>git log --oneline</code> then reads like a history of decisions, and <code>git checkout &lt;commit&gt;</code> returns you to the code that produced any reported number. Record the commit id in your model metadata (Lesson 11.2).</p>
<p><strong>Notebooks.</strong> .ipynb files are JSON with outputs and execution counts, so diffs are noisy. Clear outputs before committing (or use tools such as nbstripout or jupytext, which pairs a notebook with a plain .py file), and keep important logic in <code>src/</code>.</p>
<p><strong>Large data.</strong> git is built for text code, not gigabytes. Keep raw data in a database, cloud storage or a shared drive, and commit a small script or README that downloads it plus its hash. Data Version Control (DVC) and git LFS add data versioning on top of git.</p>
<p><strong>Team work.</strong> Work on a branch (<code>git switch -c feature/log-target</code>), push, open a pull request, let a teammate review the code <em>and</em> the evaluation, then merge. On GitHub, a short CI check that runs the tests or a smoke version of the pipeline catches broken commits early.</p>
<div class="formula"><span class="lbl">Starter .gitignore for data science</span>data/raw/ · data/processed/ (if large) · models/ · .env · *.joblib · __pycache__/ · .ipynb_checkpoints/ · .venv/</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Committing <code>.env</code> or a notebook cell containing an API key.</li><li>One giant commit at the end of the project (“final version”).</li><li>Committing a 500 MB CSV, which makes every clone slow forever.</li><li>Not knowing which commit produced the numbers in the report.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Version code, configuration and requirements; ignore data, models, secrets and checkpoints.</li><li>Small commits with messages that state the change and its measured effect.</li><li>Strip notebook outputs or pair notebooks with scripts; keep logic in <code>src/</code>.</li><li>Large data go to external storage or DVC, referenced by hash.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener">Pro Git book (free online)</a></li><li><a href="https://git-scm.com/docs/gitignore" target="_blank" rel="noopener">git documentation — gitignore</a></li><li><a href="https://doc.dvc.org/" target="_blank" rel="noopener">DVC — Data Version Control documentation</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write a .gitignore line that ignores every <code>.parquet</code> file anywhere in the project.</li><li>You realise you committed <code>.env</code> with a real key yesterday and pushed it. What are the first two actions?</li><li>Rewrite this commit message to be useful: “update”.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <code>*.parquet</code>. 2) Revoke/rotate the key immediately at the provider; then remove the file, add it to .gitignore and commit (history rewriting tools exist, but the key must be considered compromised regardless). 3) For example: “Add district one-hot features to price model (CV MAE 0.77 → 0.43 bn)”.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 11 · Bài 11.3</span>
<h2>Quản lý phiên bản bằng git cho dự án dữ liệu</h2>
<p class="lead">git ghi lại mọi thay đổi của code, cho bạn quay về đúng phiên bản đã sinh ra một kết quả, và cho cả nhóm làm song song. Dự án dữ liệu cần thêm vài quy tắc: cái gì <em>không</em> commit quan trọng ngang cái gì commit.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Khởi tạo kho và bỏ qua dữ liệu, mô hình và bí mật.</li><li>Viết commit nhỏ với thông điệp rõ ràng nối code với kết quả.</li><li>Biết xử lý notebook và dữ liệu lớn trong quản lý phiên bản.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Script dưới đây chạy lệnh git thật trong một thư mục tạm (với tác giả và thời điểm cố định để mã commit tái lập được). Nó tạo một dự án nhỏ gồm code, một tệp dữ liệu thô và một tệp <code>.env</code> chứa khoá API giả.</p>
<pre><code class="language-python">import os, subprocess, tempfile, textwrap

# Run real git commands in a throw-away folder (fixed author/date -&gt; reproducible commit ids)
env = dict(os.environ, GIT_AUTHOR_NAME="Student", GIT_AUTHOR_EMAIL="student@example.com",
           GIT_COMMITTER_NAME="Student", GIT_COMMITTER_EMAIL="student@example.com",
           GIT_AUTHOR_DATE="2026-11-01T10:00:00+07:00", GIT_COMMITTER_DATE="2026-11-01T10:00:00+07:00")
repo = tempfile.mkdtemp()
def sh(cmd):
    out = subprocess.run(cmd, shell=True, cwd=repo, env=env, capture_output=True, text=True)
    print("$ " + cmd + ("\\n" + out.stdout.rstrip() if out.stdout.strip() else ""))

def write(path, text):
    os.makedirs(os.path.join(repo, os.path.dirname(path)), exist_ok=True)
    open(os.path.join(repo, path), "w").write(textwrap.dedent(text))

write(".gitignore", """\\
    data/raw/
    models/
    .env
    __pycache__/
    .ipynb_checkpoints/
    """)
write("README.md", "# Delivery-time project\\nRun: pip install -r requirements.txt &amp;&amp; python src/train.py\\n")
write("requirements.txt", "pandas==3.1.1\\nscikit-learn==1.9.1\\n")
write("src/train.py", "print('training...')\\n")
write("data/raw/orders.csv", "order_id,minutes\\n1,31\\n")      # large/private raw data: NOT committed
write(".env", "API_KEY=secret-do-not-commit\\n")              # secrets: NOT committed

sh("git init -q -b main")
sh("git add .")
sh("git status --short")
sh("git commit -q -m 'Set up project: structure, requirements, training script'")
write("src/train.py", "print('training with log target')\\n")
sh("git commit -q -am 'Use log target (val MAE 0.43 -&gt; 0.36)'")
sh("git log --oneline")</code></pre>
<div class="out">$ git init -q -b main
$ git add .
$ git status --short
A  .gitignore
A  README.md
A  requirements.txt
A  src/train.py
$ git commit -q -m 'Set up project: structure, requirements, training script'
$ git commit -q -am 'Use log target (val MAE 0.43 -&gt; 0.36)'
$ git log --oneline
07e48ce Use log target (val MAE 0.43 -&gt; 0.36)
0fd7f5f Set up project: structure, requirements, training script</div>
<p><strong>Commit những gì.</strong> <code>git status --short</code> sau <code>git add .</code> chỉ liệt kê bốn tệp: .gitignore, README.md, requirements.txt và src/train.py. Tệp CSV thô và bí mật <code>.env</code> không bao giờ được đưa vào, vì <code>.gitignore</code> loại <code>data/raw/</code>, <code>models/</code> và <code>.env</code>. Hãy commit code, cấu hình, requirements, tài liệu nhỏ và bảng dẫn xuất nhỏ; <strong>không</strong> commit dữ liệu lớn hay dữ liệu cá nhân, tệp mô hình đã huấn luyện, bí mật (khoá API, mật khẩu CSDL) hay thư mục checkpoint của notebook. Một bí mật đã đẩy lên kho công khai dù chỉ một lần phải coi như đã lộ — thu hồi nó — kể cả khi bạn xoá sau đó, vì nó vẫn nằm trong lịch sử.</p>
<p><strong>Commit như sổ thí nghiệm.</strong> Mỗi commit là một bước logic với thông điệp nói <em>cái gì</em> và <em>vì sao</em>, và với thay đổi mô hình thì ghi cả tác động: “Use log target (val MAE 0.43 → 0.36)”. <code>git log --oneline</code> khi đó đọc như lịch sử các quyết định, và <code>git checkout &lt;commit&gt;</code> đưa bạn về đúng code đã sinh ra bất kỳ con số nào đã báo cáo. Ghi mã commit vào metadata của mô hình (Bài 11.2).</p>
<p><strong>Notebook.</strong> Tệp .ipynb là JSON có kèm output và số thứ tự chạy, nên diff rất nhiễu. Xoá output trước khi commit (hoặc dùng công cụ như nbstripout hay jupytext, ghép notebook với một tệp .py thuần), và giữ logic quan trọng trong <code>src/</code>.</p>
<p><strong>Dữ liệu lớn.</strong> git được xây cho code dạng chữ, không phải hàng gigabyte. Giữ dữ liệu thô trong CSDL, kho lưu trữ đám mây hay ổ chung, và commit một script nhỏ hoặc README để tải nó kèm mã băm. Data Version Control (DVC) và git LFS bổ sung quản lý phiên bản dữ liệu trên nền git.</p>
<p><strong>Làm việc nhóm.</strong> Làm trên một nhánh (<code>git switch -c feature/log-target</code>), đẩy lên, mở pull request, để bạn cùng nhóm review code <em>và</em> phần đánh giá, rồi merge. Trên GitHub, một kiểm tra CI ngắn chạy test hoặc phiên bản thu nhỏ của pipeline sẽ bắt sớm các commit hỏng.</p>
<div class="formula"><span class="lbl">.gitignore khởi đầu cho khoa học dữ liệu</span>data/raw/ · data/processed/ (nếu lớn) · models/ · .env · *.joblib · __pycache__/ · .ipynb_checkpoints/ · .venv/</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Commit <code>.env</code> hoặc một ô notebook chứa khoá API.</li><li>Một commit khổng lồ ở cuối dự án (“final version”).</li><li>Commit tệp CSV 500 MB, làm mọi lần clone chậm mãi mãi.</li><li>Không biết commit nào đã sinh ra các con số trong báo cáo.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Quản lý phiên bản code, cấu hình và requirements; bỏ qua dữ liệu, mô hình, bí mật và checkpoint.</li><li>Commit nhỏ với thông điệp nêu thay đổi và tác động đo được.</li><li>Xoá output notebook hoặc ghép notebook với script; giữ logic trong <code>src/</code>.</li><li>Dữ liệu lớn để ở kho ngoài hoặc DVC, tham chiếu bằng mã băm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener">Sách Pro Git (đọc miễn phí)</a></li><li><a href="https://git-scm.com/docs/gitignore" target="_blank" rel="noopener">Tài liệu git — gitignore</a></li><li><a href="https://doc.dvc.org/" target="_blank" rel="noopener">DVC — tài liệu Data Version Control</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết một dòng .gitignore bỏ qua mọi tệp <code>.parquet</code> ở bất kỳ đâu trong dự án.</li><li>Bạn nhận ra hôm qua đã commit <code>.env</code> có khoá thật và đã đẩy lên. Hai việc đầu tiên cần làm là gì?</li><li>Viết lại thông điệp commit này cho hữu ích: “update”.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <code>*.parquet</code>. 2) Thu hồi/đổi khoá ngay ở nhà cung cấp; rồi xoá tệp, thêm vào .gitignore và commit (có công cụ viết lại lịch sử, nhưng dù sao khoá cũng phải coi là đã lộ). 3) Ví dụ: “Add district one-hot features to price model (CV MAE 0.77 → 0.43 bn)”.</p></div>`);

const q11 = QZ(11, 'Quiz — Chapter 11: Reproducibility|||Quiz — Chương 11: Tính tái lập',
  'Quiz 8 câu: Restart & Run All, seed và random_state, kiểm độ vững qua nhiều seed, dữ liệu thô chỉ đọc, môi trường ảo và ghim phiên bản, mã băm dữ liệu, an toàn pickle, .gitignore và bí mật.', [
  Q('q1', 'What is the quickest check for hidden state in a notebook?|||Cách kiểm nhanh nhất trạng thái ẩn trong notebook là gì?',
    ['Restart the kernel and run all cells top to bottom|||Khởi động lại kernel và chạy mọi ô từ trên xuống', 'Save the notebook twice|||Lưu notebook hai lần', 'Rename the file|||Đổi tên tệp', 'Increase the font size|||Tăng cỡ chữ'], 0,
    'If results change or errors appear, the notebook depended on hidden state.|||Nếu kết quả đổi hay báo lỗi, notebook đã phụ thuộc trạng thái ẩn.'),
  Q('q2', 'Why set random_state in train_test_split and models?|||Vì sao đặt random_state trong train_test_split và mô hình?',
    ['To make runs repeatable|||Để các lần chạy lặp lại được', 'To make models more accurate|||Để mô hình chính xác hơn', 'To avoid needing a test set|||Để khỏi cần tập test', 'To speed up training|||Để huấn luyện nhanh hơn'], 0,
    'Same seed + same versions → same splits and models.|||Cùng seed + cùng phiên bản → cùng phép chia và mô hình.'),
  Q('q3', 'Model B beats A by 0.01 with seed 0; across seeds scores vary by 0.025. You should…|||Mô hình B thắng A 0,01 với seed 0; qua các seed điểm dao động 0,025. Bạn nên…',
    ['compare them over several seeds/folds before concluding|||so chúng qua nhiều seed/phần trước khi kết luận', 'declare B the winner|||tuyên bố B thắng', 'choose the seed where B wins most|||chọn seed mà B thắng nhiều nhất', 'remove the seed|||bỏ seed'], 0,
    'A difference smaller than seed-to-seed variation is not reliable.|||Chênh lệch nhỏ hơn dao động giữa các seed là không đáng tin.'),
  Q('q4', 'Which practice keeps cleaning reproducible?|||Thực hành nào giữ cho việc làm sạch tái lập được?',
    ['Raw data are read-only and every change is code|||Dữ liệu thô chỉ đọc và mọi thay đổi là code', 'Fix errors by hand in Excel|||Sửa lỗi bằng tay trong Excel', 'Overwrite the raw file after cleaning|||Ghi đè tệp thô sau khi làm sạch', 'Keep cleaning steps in your head|||Nhớ các bước làm sạch trong đầu'], 0,
    'Anyone can then regenerate processed data from raw data.|||Khi đó ai cũng tái tạo được dữ liệu đã xử lý từ dữ liệu thô.'),
  Q('q5', 'What does pandas==3.1.1 in requirements.txt do?|||pandas==3.1.1 trong requirements.txt làm gì?',
    ['Pins that exact version|||Ghim đúng phiên bản đó', 'Installs the newest pandas|||Cài pandas mới nhất', 'Uninstalls pandas|||Gỡ pandas', 'Nothing|||Không làm gì'], 0,
    'Pinned versions make environments reproducible.|||Phiên bản được ghim làm môi trường tái lập được.'),
  Q('q6', 'Why store a SHA-256 hash of the training data with the model?|||Vì sao lưu mã băm SHA-256 của dữ liệu huấn luyện kèm mô hình?',
    ['It identifies the exact data content the model saw|||Nó xác định đúng nội dung dữ liệu mô hình đã thấy', 'It encrypts the data|||Nó mã hoá dữ liệu', 'It compresses the model|||Nó nén mô hình', 'It improves accuracy|||Nó tăng độ chính xác'], 0,
    'Any change in the data changes the hash.|||Mọi thay đổi trong dữ liệu đều làm đổi mã băm.'),
  Q('q7', 'A classmate sends you model.joblib from an unknown website. You should…|||Một bạn gửi model.joblib tải từ một trang web lạ. Bạn nên…',
    ['not load it — pickle files can run code|||không nạp — tệp pickle có thể chạy code', 'load it in your main environment|||nạp trong môi trường chính', 'rename it to .csv|||đổi tên thành .csv', 'upload it to production|||đưa lên môi trường chạy thật'], 0,
    'Only load model files from trusted sources.|||Chỉ nạp tệp mô hình từ nguồn tin cậy.'),
  Q('q8', 'Which files belong in .gitignore for a data project?|||Tệp nào nên nằm trong .gitignore của dự án dữ liệu?',
    ['data/raw/, models/, .env|||data/raw/, models/, .env', 'src/, README.md|||src/, README.md', 'requirements.txt|||requirements.txt', '.gitignore itself|||chính .gitignore'], 0,
    'Large/private data, model binaries and secrets stay out of git.|||Dữ liệu lớn/riêng tư, tệp mô hình và bí mật không đưa vào git.'),
]);

const ch11 = {
  title: 'Chapter 11 — Reproducibility: notebooks, environments and git|||Chương 11 — Tính tái lập: notebook, môi trường và git',
  description: 'Trạng thái ẩn của notebook, seed, cấu trúc dự án; môi trường ảo, ghim phiên bản, mã băm dữ liệu, lưu pipeline kèm metadata; git cho dự án dữ liệu (.gitignore, commit, notebook, dữ liệu lớn).',
  lessons: [c111, c112, c113, q11],
};


// ───────────────────────────── Chương 12 — Trình bày kết quả & dự án cuối khoá ─────────────────────────────
const c121 = L('dsi201-ts-12-1',
  '12.1 — Communicating results: answer first, uncertainty always|||12.1 — Trình bày kết quả: câu trả lời trước, luôn kèm độ bất định',
  'Cấu trúc báo cáo kiểu kim tự tháp (kết luận → bằng chứng → chi tiết), dịch chỉ số sang ngôn ngữ nghiệp vụ, khoảng tin cậy bootstrap cho MAE và mức giảm sai số (23,4%, KTC 12,3–33,7%), nói rõ giới hạn.',
  `<span class="eyebrow">DSI201 · Chapter 12 · Lesson 12.1</span>
<h2>Communicating results: answer first, uncertainty always</h2>
<p class="lead">The value of an analysis is realised only when someone understands it and acts on it. Most decision makers will read one page and one chart. Write for them.</p>
<h3>🎯 Objectives</h3>
<ul><li>Structure a report or presentation with the answer first.</li><li>Translate metrics into business terms and attach uncertainty to them.</li><li>State limitations and next steps honestly.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Answer first (pyramid structure).</strong> Start with the conclusion and the recommended action, then the two or three pieces of evidence that support it, then the details for those who want them. “We can promise delivery times within ±5 minutes for about 78% of orders, versus far fewer today; we recommend piloting the model in two districts” beats a chronological story of everything you tried. Titles of slides and charts should state findings, not topics (“Rush hour adds about 10 minutes”, not “Hour analysis”).</p>
<p><strong>Translate metrics.</strong> “MAE 3.25” means little to an operations manager; “on average our promise is off by about 3 minutes, and 4 out of 5 orders are within 5 minutes” means a lot. Compare with the status quo or the baseline, in money or time when possible (Lesson 1.3).</p>
<p><strong>Always attach uncertainty.</strong> A test set is one sample; its metric would differ on another. The <strong>bootstrap</strong> (PSI221) estimates that variation: resample the test rows with replacement thousands of times and recompute the metric. Here, for the diabetes model of Lesson 1.1:</p>
<pre><code class="language-python">import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split

X, y = load_diabetes(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=0)
err_model = np.abs(Ridge(alpha=0.1).fit(X_tr, y_tr).predict(X_te) - y_te)
err_base = np.abs(DummyRegressor().fit(X_tr, y_tr).predict(X_te) - y_te)

# Bootstrap the TEST SET: resample its rows with replacement, recompute the metrics many times
rng = np.random.default_rng(0)
n, B = len(y_te), 5000
idx = rng.integers(0, n, size=(B, n))
mae_m, mae_b = err_model[idx].mean(axis=1), err_base[idx].mean(axis=1)
gain = 1 - mae_m / mae_b

def ci(a):
    return np.percentile(a, [2.5, 97.5]).round(3)

print(f"test rows: {n}")
print(f"model MAE    {err_model.mean():6.1f}   95% CI {ci(mae_m)}")
print(f"baseline MAE {err_base.mean():6.1f}   95% CI {ci(mae_b)}")
print(f"error reduction vs baseline {1 - err_model.mean() / err_base.mean():.1%}   95% CI {ci(gain)}")</code></pre>
<div class="out">test rows: 111
model MAE      44.6   95% CI [38.545 51.004]
baseline MAE   58.3   95% CI [51.149 66.034]
error reduction vs baseline 23.4%   95% CI [0.123 0.337]</div>
<p>The model's MAE is 44.6 (95% interval 38.5–51.0) and it reduces error by 23.4% compared with the baseline — but the interval for that reduction runs from 12.3% to 33.7%, because the test set has only 111 patients. That is the honest message: “clearly better than the baseline, by somewhere between about one eighth and one third”. Bootstrapping the <em>difference</em> (or ratio) on the same resampled rows is more precise than comparing two separate intervals, because both errors move together. Cross-validation spreads (Lesson 6.2) give similar information.</p>
<div class="formula"><span class="lbl">One-page result summary</span>1. Answer + recommendation · 2. Key evidence (one chart, numbers with intervals, vs baseline) · 3. How it works (one paragraph, no jargon) · 4. Limitations and risks (data period, subgroups, assumptions) · 5. Next steps and decision needed</div>
<p><strong>Limitations are part of the result.</strong> State the data period, groups where the model is weaker (Lesson 10.3), assumptions (costs, no causal claims), and what would change the conclusion. Credibility comes from showing that you looked for the weaknesses yourself. Finally, make it reproducible (Chapter 11): the numbers in the report should come from a committed notebook, not from a copy-paste of yesterday's run.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Presenting the analysis process in order instead of the answer.</li><li>Reporting point estimates with false precision (“MAE = 44.5832”).</li><li>Hiding weak subgroups or failed attempts that the audience will meet later anyway.</li><li>Charts with topic titles and no takeaway.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Lead with the answer and the action; support with a few pieces of evidence.</li><li>Translate metrics into the audience's units and compare with the status quo.</li><li>Give intervals (bootstrap or CV spread), not just point estimates.</li><li>State limitations, assumptions and next steps.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://clauswilke.com/dataviz/telling-a-story.html" target="_blank" rel="noopener">Wilke — Telling a story and making a point</a></li><li><a href="https://clauswilke.com/dataviz/visualizing-uncertainty.html" target="_blank" rel="noopener">Wilke — Visualizing uncertainty</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html" target="_blank" rel="noopener">SciPy — scipy.stats.bootstrap</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Rewrite as a finding-first sentence: “We trained three models and evaluated them with 5-fold CV. The ridge model had an MAE of 3.28.”</li><li>Why can the 95% intervals of model and baseline MAE overlap even though the model is reliably better?</li><li>List three limitations you would state for the delivery-time model.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) “Our model predicts delivery time to within about 3 minutes on average — less than half the error of today's single standard estimate; we recommend a pilot.” 2) Both errors are computed on the same test rows and rise and fall together; the uncertainty of the difference is much smaller than that of each MAE, so bootstrap the difference directly. 3) Trained on two months only (no Tết or rainy-season peaks); weaker or biased for some district-weather combinations with few orders; assumes the same driver supply — it predicts, it does not tell you the effect of adding drivers.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 12 · Bài 12.1</span>
<h2>Trình bày kết quả: câu trả lời trước, luôn kèm độ bất định</h2>
<p class="lead">Giá trị của một phân tích chỉ thành hiện thực khi ai đó hiểu và hành động theo nó. Phần lớn người ra quyết định sẽ đọc một trang và một biểu đồ. Hãy viết cho họ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Cấu trúc báo cáo hay bài thuyết trình với câu trả lời đặt lên đầu.</li><li>Dịch chỉ số sang ngôn ngữ nghiệp vụ và gắn độ bất định cho chúng.</li><li>Nêu giới hạn và bước tiếp theo một cách trung thực.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Câu trả lời trước (cấu trúc kim tự tháp).</strong> Bắt đầu bằng kết luận và hành động đề xuất, rồi hai ba bằng chứng hỗ trợ, rồi chi tiết cho ai muốn xem. “Ta có thể hứa thời gian giao trong khoảng ±5 phút cho khoảng 78% số đơn, nhiều hơn hẳn hiện nay; đề xuất chạy thử mô hình ở hai quận” tốt hơn một câu chuyện theo trình tự mọi thứ bạn đã thử. Tiêu đề slide và biểu đồ nên nêu phát hiện chứ không nêu chủ đề (“Giờ cao điểm thêm khoảng 10 phút”, không phải “Phân tích theo giờ”).</p>
<p><strong>Dịch chỉ số.</strong> “MAE 3,25” chẳng nói nhiều với quản lý vận hành; “trung bình lời hứa của ta lệch khoảng 3 phút, và 4 trên 5 đơn nằm trong 5 phút” thì nói rất nhiều. So với hiện trạng hoặc baseline, bằng tiền hay thời gian khi có thể (Bài 1.3).</p>
<p><strong>Luôn kèm độ bất định.</strong> Tập test là một mẫu; chỉ số của nó sẽ khác trên mẫu khác. <strong>Bootstrap</strong> (PSI221) ước lượng sự dao động đó: lấy mẫu lại các dòng test có hoàn lại hàng nghìn lần và tính lại chỉ số. Ở đây, cho mô hình diabetes của Bài 1.1:</p>
<pre><code class="language-python">import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split

X, y = load_diabetes(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=0)
err_model = np.abs(Ridge(alpha=0.1).fit(X_tr, y_tr).predict(X_te) - y_te)
err_base = np.abs(DummyRegressor().fit(X_tr, y_tr).predict(X_te) - y_te)

# Bootstrap the TEST SET: resample its rows with replacement, recompute the metrics many times
rng = np.random.default_rng(0)
n, B = len(y_te), 5000
idx = rng.integers(0, n, size=(B, n))
mae_m, mae_b = err_model[idx].mean(axis=1), err_base[idx].mean(axis=1)
gain = 1 - mae_m / mae_b

def ci(a):
    return np.percentile(a, [2.5, 97.5]).round(3)

print(f"test rows: {n}")
print(f"model MAE    {err_model.mean():6.1f}   95% CI {ci(mae_m)}")
print(f"baseline MAE {err_base.mean():6.1f}   95% CI {ci(mae_b)}")
print(f"error reduction vs baseline {1 - err_model.mean() / err_base.mean():.1%}   95% CI {ci(gain)}")</code></pre>
<div class="out">test rows: 111
model MAE      44.6   95% CI [38.545 51.004]
baseline MAE   58.3   95% CI [51.149 66.034]
error reduction vs baseline 23.4%   95% CI [0.123 0.337]</div>
<p>MAE của mô hình là 44,6 (khoảng 95%: 38,5–51,0) và nó giảm sai số 23,4% so với baseline — nhưng khoảng cho mức giảm đó trải từ 12,3% tới 33,7%, vì tập test chỉ có 111 bệnh nhân. Đó là thông điệp trung thực: “tốt hơn baseline rõ ràng, khoảng từ một phần tám tới một phần ba”. Bootstrap <em>hiệu</em> (hay tỉ số) trên cùng các dòng lấy mẫu lại chính xác hơn so sánh hai khoảng riêng rẽ, vì hai sai số cùng biến động. Độ phân tán của kiểm định chéo (Bài 6.2) cho thông tin tương tự.</p>
<div class="formula"><span class="lbl">Tóm tắt kết quả một trang</span>1. Câu trả lời + đề xuất · 2. Bằng chứng chính (một biểu đồ, con số kèm khoảng, so với baseline) · 3. Cách hoạt động (một đoạn, không thuật ngữ) · 4. Giới hạn và rủi ro (giai đoạn dữ liệu, nhóm con, giả định) · 5. Bước tiếp theo và quyết định cần đưa ra</div>
<p><strong>Giới hạn là một phần của kết quả.</strong> Nêu giai đoạn dữ liệu, các nhóm mà mô hình yếu hơn (Bài 10.3), các giả định (chi phí, không khẳng định nhân quả), và điều gì sẽ làm thay đổi kết luận. Sự tin cậy đến từ việc cho thấy chính bạn đã đi tìm điểm yếu. Cuối cùng, làm cho nó tái lập được (Chương 11): con số trong báo cáo phải đến từ một notebook đã commit, không phải bản sao chép từ lần chạy hôm qua.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Trình bày quá trình phân tích theo thứ tự thay vì câu trả lời.</li><li>Báo ước lượng điểm với độ chính xác giả tạo (“MAE = 44,5832”).</li><li>Giấu nhóm con yếu hay các lần thử thất bại mà người nghe sớm muộn cũng gặp.</li><li>Biểu đồ có tiêu đề chủ đề mà không có thông điệp.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mở đầu bằng câu trả lời và hành động; hỗ trợ bằng vài bằng chứng.</li><li>Dịch chỉ số sang đơn vị của người nghe và so với hiện trạng.</li><li>Đưa khoảng (bootstrap hoặc độ phân tán CV), không chỉ ước lượng điểm.</li><li>Nêu giới hạn, giả định và bước tiếp theo.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://clauswilke.com/dataviz/telling-a-story.html" target="_blank" rel="noopener">Wilke — Kể một câu chuyện và nêu một luận điểm</a></li><li><a href="https://clauswilke.com/dataviz/visualizing-uncertainty.html" target="_blank" rel="noopener">Wilke — Trực quan hoá độ bất định</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html" target="_blank" rel="noopener">SciPy — scipy.stats.bootstrap</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết lại thành câu nêu phát hiện trước: “Chúng em huấn luyện ba mô hình và đánh giá bằng CV 5 phần. Mô hình ridge có MAE 3,28.”</li><li>Vì sao khoảng 95% của MAE mô hình và MAE baseline có thể chồng nhau dù mô hình tốt hơn một cách đáng tin?</li><li>Liệt kê ba giới hạn bạn sẽ nêu cho mô hình thời gian giao hàng.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) “Mô hình dự đoán thời gian giao lệch trung bình khoảng 3 phút — chưa bằng nửa sai số của một con số ước lượng chung như hiện nay; đề xuất chạy thử.” 2) Hai sai số được tính trên cùng các dòng test và lên xuống cùng nhau; độ bất định của hiệu nhỏ hơn nhiều so với của từng MAE, nên hãy bootstrap trực tiếp hiệu. 3) Chỉ huấn luyện trên hai tháng (chưa có Tết hay cao điểm mùa mưa); yếu hơn hoặc lệch ở vài tổ hợp quận–thời tiết ít đơn; giả định nguồn tài xế không đổi — nó dự đoán, không cho biết tác động của việc thêm tài xế.</p></div>`);

const c122 = L('dsi201-ts-12-2',
  '12.2 — Capstone mini-project, part 1: frame, clean and explore delivery data|||12.2 — Dự án cuối khoá thu nhỏ, phần 1: đặt bài toán, làm sạch và khám phá dữ liệu giao hàng',
  'Đề dự án: dự đoán số phút giao lúc đặt đơn; thẻ đặt bài toán; tệp thô 5.040 dòng có bản trùng, quận viết lộn xộn, thời tiết thiếu, phút bất khả; làm sạch bằng code; EDA chỉ ra giờ cao điểm, mưa, Long Biên khi mưa.',
  `<span class="eyebrow">DSI201 · Chapter 12 · Lesson 12.2</span>
<h2>Capstone mini-project, part 1: frame, clean and explore delivery data</h2>
<p class="lead">The capstone puts the whole course into one small, complete project. Part 1 (this lesson) covers framing, cleaning and exploration; part 2 covers modelling, evaluation and the report. Follow along, then repeat the process on your own dataset.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the framing card for a realistic prediction task.</li><li>Clean a messy raw export entirely in code, logging every decision.</li><li>Use exploration to decide which features to build.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>The brief.</strong> A delivery app in Hà Nội currently shows every customer the same estimate. Management wants a personalised estimate shown when the order is placed. <strong>Framing card</strong> (Lesson 1.2): decision — the minutes shown in the app; unit — one order; target — actual delivery minutes; prediction time — when the order is placed (so only order time, district, distance, number of items and current weather are allowed); metric — MAE in minutes plus the share of orders within ±5 minutes; baseline — one average for everybody; success — clearly beat the baseline in every district.</p>
<p><strong>The data.</strong> A raw export of two months of orders (October–November 2026), simulated with a fixed seed so everyone gets the same numbers. It has realistic problems: duplicated rows, dates as day/month/year strings, districts typed in different cases with stray spaces, weather written as “rain”, “Rain ” or “RAIN” and sometimes missing, missing distances and a few impossible delivery times.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd

# ---------- The raw export you receive (simulated, fixed seed) ----------
rng = np.random.default_rng(2026)
n = 5000
t0 = pd.Timestamp("2026-10-01 08:00")
placed = t0 + pd.to_timedelta(rng.integers(0, 61, n), unit="D") + pd.to_timedelta(rng.integers(0, 14 * 60, n), unit="min")
district = rng.choice(["Ba Dinh", "Cau Giay", "Dong Da", "Ha Dong", "Long Bien"], n, p=[0.22, 0.24, 0.22, 0.2, 0.12])
dist = np.round(rng.gamma(2.2, 1.5, n), 1)
items = rng.integers(1, 9, n)
rain = rng.random(n) &lt; 0.3
rush = placed.hour.isin([11, 12, 18, 19])
weekend = placed.day_of_week &gt;= 5
extra = pd.Series(district).map({"Ba Dinh": 0, "Cau Giay": 1, "Dong Da": 2, "Ha Dong": 3, "Long Bien": 4}).to_numpy()
minutes = (15 + 3.2 * dist + 9 * rush + 7 * rain + 0.7 * items + 4 * weekend + extra
           + 6 * rain * (district == "Long Bien") + rng.normal(0, 4, n)).round()
raw = pd.DataFrame({
    "order_id": np.arange(100001, 100001 + n),
    "placed_at": placed.strftime("%d/%m/%Y %H:%M"),
    "district": [d.upper() if r &lt; 0.1 else (" " + d.lower() if r &lt; 0.2 else d) for d, r in zip(district, rng.random(n))],
    "distance_km": np.where(rng.random(n) &lt; 0.03, np.nan, dist),
    "items": items,
    "weather": np.where(rain, rng.choice(["rain", "Rain ", "RAIN"], n), rng.choice(["dry", "Dry", None], n, p=[0.6, 0.3, 0.1])),
    "minutes": minutes,
})
bad = rng.choice(n, 12, replace=False)
raw.loc[bad, "minutes"] = rng.choice([0, -5, 999], 12)                       # data-entry errors
raw = pd.concat([raw, raw.sample(40, random_state=1)], ignore_index=True)       # duplicated exports
raw.to_csv("orders_raw.csv", index=False)
print("raw:", raw.shape)

# ---------- Cleaning (every step is code, every decision printed) ----------
df = pd.read_csv("orders_raw.csv")
df = df.drop_duplicates(subset="order_id")
df["placed_at"] = pd.to_datetime(df["placed_at"], format="%d/%m/%Y %H:%M")
df["district"] = df["district"].str.strip().str.title()
w = df["weather"].str.strip().str.lower()
df["raining"] = (w == "rain").astype(int)
df["weather_missing"] = w.isna().astype(int)
bad_target = ~df["minutes"].between(5, 180)
df = df.loc[~bad_target]
print("duplicates removed:", 40, "| impossible minutes removed:", int(bad_target.sum()))
print("districts:", sorted(df["district"].unique()))
print("missing distance:", int(df["distance_km"].isna().sum()), "| missing weather:", int(df["weather_missing"].sum()))
df.drop(columns="weather").to_csv("orders_clean.csv", index=False)

# ---------- Quick EDA to guide features ----------
df["hour"] = df["placed_at"].dt.hour
print("\\nmedian minutes by hour:", df.groupby("hour")["minutes"].median().astype(int).to_dict())
print(df.groupby(["district", "raining"])["minutes"].median().unstack().rename(columns={0: "dry", 1: "rain"}))
print("corr(distance, minutes) =", round(df["distance_km"].corr(df["minutes"]), 2))</code></pre>
<div class="out">raw: (5040, 7)
duplicates removed: 40 | impossible minutes removed: 12
districts: ['Ba Dinh', 'Cau Giay', 'Dong Da', 'Ha Dong', 'Long Bien']
missing distance: 156 | missing weather: 342

median minutes by hour: {8: 33, 9: 33, 10: 33, 11: 43, 12: 42, 13: 33, 14: 32, 15: 34, 16: 32, 17: 33, 18: 42, 19: 42, 20: 32, 21: 33}
raining     dry  rain
district             
Ba Dinh    31.0  37.0
Cau Giay   32.0  40.0
Dong Da    33.5  40.0
Ha Dong    35.0  41.0
Long Bien  36.0  48.0
corr(distance, minutes) = 0.7</div>
<p><strong>Cleaning log.</strong> 5,040 raw rows → 40 duplicated exports removed by <code>order_id</code> → dates parsed with an explicit format → district labels normalised (5 clean values) → weather turned into a 0/1 <code>raining</code> flag plus a <code>weather_missing</code> indicator (342 rows), because missing weather may itself be informative (Lesson 3.2) → 12 impossible delivery times (0, −5 or 999 minutes) removed as data errors rather than kept as outliers, since a target that is wrong cannot be learned from (Lesson 3.3) → 156 missing distances kept for the model's imputer, so that the median is learned inside cross-validation (Lesson 5.3). The cleaned table is written to <code>orders_clean.csv</code>; the raw file is never edited.</p>
<p><strong>What exploration tells us.</strong> Median minutes jump from about 33 to 42–43 at 11–12 h and 18–19 h: rush hour is a step, not a smooth trend in “hour”, so we will build an <code>is_rush</code> feature (Lesson 5.2). Rain adds 6–8 minutes in most districts but about 12 in Long Bien — an interaction worth its own feature (Lesson 10.3). Distance is strongly correlated with minutes (r = 0.70), the main driver. Each of these observations becomes a feature hypothesis to test in part 2.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Fixing data by hand in a spreadsheet — the cleaning cannot be reproduced on next month's export.</li><li>Imputing missing distances with a median computed on all data before the split (leakage).</li><li>Silently dropping rows with missing weather and losing 7% of the data.</li><li>Looking at the last weeks (the future test period) while exploring — keep EDA to the training period in a strict project.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Start every project with a framing card: decision, unit, target, prediction time, metric, baseline, success.</li><li>Clean in code; print a log of what each step changed.</li><li>Distinguish data errors (remove/fix) from real extremes (keep).</li><li>Turn EDA observations into explicit feature hypotheses.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://github.com/ageron/handson-ml3/blob/main/02_end_to_end_machine_learning_project.ipynb" target="_blank" rel="noopener">Géron — End-to-end machine learning project (the model for this capstone)</a></li><li><a href="https://www.kaggle.com/learn/intermediate-machine-learning" target="_blank" rel="noopener">Kaggle Learn — Intermediate Machine Learning (missing values, categorical variables, pipelines, leakage)</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/10min.html" target="_blank" rel="noopener">pandas — 10 minutes to pandas</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Add a check to the cleaning code that fails loudly if any district outside the five expected values appears in a future export.</li><li>Why do we keep rows with missing distance instead of dropping them?</li><li>Propose one more feature from the EDA and say whether it is available at prediction time.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <code>unknown = set(df["district"]) - {"Ba Dinh", "Cau Giay", "Dong Da", "Ha Dong", "Long Bien"}; assert not unknown, f"new districts: {unknown}"</code>. 2) They are about 3% of orders and the other columns are valid; the model's imputer (fitted per fold) fills them, so we keep the information and avoid bias if missingness is related to something. 3) Weekend (from the order date — available), or the number of orders placed in the previous 30 minutes in the same district (available only if the system computes it live at order time).</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 12 · Bài 12.2</span>
<h2>Dự án cuối khoá thu nhỏ, phần 1: đặt bài toán, làm sạch và khám phá dữ liệu giao hàng</h2>
<p class="lead">Dự án cuối khoá gom cả môn học vào một dự án nhỏ, trọn vẹn. Phần 1 (bài này) gồm đặt bài toán, làm sạch và khám phá; phần 2 gồm mô hình hoá, đánh giá và báo cáo. Làm theo, rồi lặp lại quy trình trên bộ dữ liệu của riêng bạn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết thẻ đặt bài toán cho một nhiệm vụ dự đoán thực tế.</li><li>Làm sạch một tệp xuất thô lộn xộn hoàn toàn bằng code, ghi lại mọi quyết định.</li><li>Dùng khám phá dữ liệu để quyết định nên xây đặc trưng nào.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Đề bài.</strong> Một ứng dụng giao hàng ở Hà Nội hiện cho mọi khách cùng một con số ước lượng. Ban quản lý muốn một ước lượng riêng cho từng đơn, hiện ra ngay khi đặt. <strong>Thẻ đặt bài toán</strong> (Bài 1.2): quyết định — số phút hiện trong ứng dụng; đơn vị — một đơn hàng; mục tiêu — số phút giao thực tế; thời điểm dự đoán — lúc đặt đơn (nên chỉ được dùng giờ đặt, quận, quãng đường, số món và thời tiết hiện tại); chỉ số — MAE theo phút cộng tỉ lệ đơn nằm trong ±5 phút; baseline — một con số trung bình cho mọi người; thành công — vượt rõ baseline ở mọi quận.</p>
<p><strong>Dữ liệu.</strong> Một tệp xuất thô hai tháng đơn hàng (tháng 10–11/2026), mô phỏng với seed cố định để ai cũng ra cùng con số. Nó có các vấn đề thực tế: dòng bị lặp, ngày dạng chuỗi ngày/tháng/năm, quận gõ hoa thường lẫn lộn kèm khoảng trắng thừa, thời tiết ghi “rain”, “Rain ” hay “RAIN” và đôi khi thiếu, quãng đường bị thiếu và vài thời gian giao bất khả.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd

# ---------- The raw export you receive (simulated, fixed seed) ----------
rng = np.random.default_rng(2026)
n = 5000
t0 = pd.Timestamp("2026-10-01 08:00")
placed = t0 + pd.to_timedelta(rng.integers(0, 61, n), unit="D") + pd.to_timedelta(rng.integers(0, 14 * 60, n), unit="min")
district = rng.choice(["Ba Dinh", "Cau Giay", "Dong Da", "Ha Dong", "Long Bien"], n, p=[0.22, 0.24, 0.22, 0.2, 0.12])
dist = np.round(rng.gamma(2.2, 1.5, n), 1)
items = rng.integers(1, 9, n)
rain = rng.random(n) &lt; 0.3
rush = placed.hour.isin([11, 12, 18, 19])
weekend = placed.day_of_week &gt;= 5
extra = pd.Series(district).map({"Ba Dinh": 0, "Cau Giay": 1, "Dong Da": 2, "Ha Dong": 3, "Long Bien": 4}).to_numpy()
minutes = (15 + 3.2 * dist + 9 * rush + 7 * rain + 0.7 * items + 4 * weekend + extra
           + 6 * rain * (district == "Long Bien") + rng.normal(0, 4, n)).round()
raw = pd.DataFrame({
    "order_id": np.arange(100001, 100001 + n),
    "placed_at": placed.strftime("%d/%m/%Y %H:%M"),
    "district": [d.upper() if r &lt; 0.1 else (" " + d.lower() if r &lt; 0.2 else d) for d, r in zip(district, rng.random(n))],
    "distance_km": np.where(rng.random(n) &lt; 0.03, np.nan, dist),
    "items": items,
    "weather": np.where(rain, rng.choice(["rain", "Rain ", "RAIN"], n), rng.choice(["dry", "Dry", None], n, p=[0.6, 0.3, 0.1])),
    "minutes": minutes,
})
bad = rng.choice(n, 12, replace=False)
raw.loc[bad, "minutes"] = rng.choice([0, -5, 999], 12)                       # data-entry errors
raw = pd.concat([raw, raw.sample(40, random_state=1)], ignore_index=True)       # duplicated exports
raw.to_csv("orders_raw.csv", index=False)
print("raw:", raw.shape)

# ---------- Cleaning (every step is code, every decision printed) ----------
df = pd.read_csv("orders_raw.csv")
df = df.drop_duplicates(subset="order_id")
df["placed_at"] = pd.to_datetime(df["placed_at"], format="%d/%m/%Y %H:%M")
df["district"] = df["district"].str.strip().str.title()
w = df["weather"].str.strip().str.lower()
df["raining"] = (w == "rain").astype(int)
df["weather_missing"] = w.isna().astype(int)
bad_target = ~df["minutes"].between(5, 180)
df = df.loc[~bad_target]
print("duplicates removed:", 40, "| impossible minutes removed:", int(bad_target.sum()))
print("districts:", sorted(df["district"].unique()))
print("missing distance:", int(df["distance_km"].isna().sum()), "| missing weather:", int(df["weather_missing"].sum()))
df.drop(columns="weather").to_csv("orders_clean.csv", index=False)

# ---------- Quick EDA to guide features ----------
df["hour"] = df["placed_at"].dt.hour
print("\\nmedian minutes by hour:", df.groupby("hour")["minutes"].median().astype(int).to_dict())
print(df.groupby(["district", "raining"])["minutes"].median().unstack().rename(columns={0: "dry", 1: "rain"}))
print("corr(distance, minutes) =", round(df["distance_km"].corr(df["minutes"]), 2))</code></pre>
<div class="out">raw: (5040, 7)
duplicates removed: 40 | impossible minutes removed: 12
districts: ['Ba Dinh', 'Cau Giay', 'Dong Da', 'Ha Dong', 'Long Bien']
missing distance: 156 | missing weather: 342

median minutes by hour: {8: 33, 9: 33, 10: 33, 11: 43, 12: 42, 13: 33, 14: 32, 15: 34, 16: 32, 17: 33, 18: 42, 19: 42, 20: 32, 21: 33}
raining     dry  rain
district             
Ba Dinh    31.0  37.0
Cau Giay   32.0  40.0
Dong Da    33.5  40.0
Ha Dong    35.0  41.0
Long Bien  36.0  48.0
corr(distance, minutes) = 0.7</div>
<p><strong>Nhật ký làm sạch.</strong> 5.040 dòng thô → bỏ 40 dòng xuất lặp theo <code>order_id</code> → đọc ngày với định dạng rõ ràng → chuẩn hoá nhãn quận (5 giá trị sạch) → đổi thời tiết thành cờ 0/1 <code>raining</code> kèm chỉ báo <code>weather_missing</code> (342 dòng), vì việc thiếu thời tiết tự nó có thể mang thông tin (Bài 3.2) → bỏ 12 thời gian giao bất khả (0, −5 hay 999 phút) như lỗi dữ liệu thay vì giữ như ngoại lai, vì mục tiêu sai thì không học được (Bài 3.3) → giữ 156 quãng đường bị thiếu cho bộ điền của mô hình, để trung vị được học bên trong kiểm định chéo (Bài 5.3). Bảng đã làm sạch được ghi ra <code>orders_clean.csv</code>; tệp thô không bao giờ bị sửa.</p>
<p><strong>Khám phá cho ta biết gì.</strong> Trung vị số phút nhảy từ khoảng 33 lên 42–43 lúc 11–12 giờ và 18–19 giờ: giờ cao điểm là một bậc thang, không phải xu hướng trơn theo “giờ”, nên ta sẽ xây đặc trưng <code>is_rush</code> (Bài 5.2). Mưa thêm 6–8 phút ở đa số quận nhưng khoảng 12 phút ở Long Biên — một tương tác đáng có đặc trưng riêng (Bài 10.3). Quãng đường tương quan mạnh với số phút (r = 0,70), là động lực chính. Mỗi quan sát này thành một giả thuyết đặc trưng để kiểm ở phần 2.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Sửa dữ liệu bằng tay trong bảng tính — việc làm sạch không lặp lại được với tệp xuất tháng sau.</li><li>Điền quãng đường thiếu bằng trung vị tính trên toàn bộ dữ liệu trước khi chia (rò rỉ).</li><li>Âm thầm bỏ các dòng thiếu thời tiết và mất 7% dữ liệu.</li><li>Nhìn vào các tuần cuối (giai đoạn test tương lai) khi khám phá — trong một dự án nghiêm ngặt, hãy giới hạn EDA trong giai đoạn huấn luyện.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bắt đầu mọi dự án bằng thẻ đặt bài toán: quyết định, đơn vị, mục tiêu, thời điểm dự đoán, chỉ số, baseline, thành công.</li><li>Làm sạch bằng code; in nhật ký mỗi bước đã thay đổi gì.</li><li>Phân biệt lỗi dữ liệu (bỏ/sửa) với cực trị thật (giữ).</li><li>Biến các quan sát EDA thành giả thuyết đặc trưng rõ ràng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://github.com/ageron/handson-ml3/blob/main/02_end_to_end_machine_learning_project.ipynb" target="_blank" rel="noopener">Géron — Dự án học máy đầu-cuối (khuôn cho dự án cuối khoá này)</a></li><li><a href="https://www.kaggle.com/learn/intermediate-machine-learning" target="_blank" rel="noopener">Kaggle Learn — Intermediate Machine Learning (giá trị thiếu, biến phân loại, pipeline, rò rỉ)</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/10min.html" target="_blank" rel="noopener">pandas — 10 phút làm quen pandas</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Thêm vào code làm sạch một phép kiểm báo lỗi rõ ràng nếu tệp xuất tương lai xuất hiện quận nào ngoài năm giá trị mong đợi.</li><li>Vì sao ta giữ các dòng thiếu quãng đường thay vì bỏ đi?</li><li>Đề xuất thêm một đặc trưng từ EDA và nói nó có sẵn tại thời điểm dự đoán không.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <code>unknown = set(df["district"]) - {"Ba Dinh", "Cau Giay", "Dong Da", "Ha Dong", "Long Bien"}; assert not unknown, f"new districts: {unknown}"</code>. 2) Chúng chỉ khoảng 3% số đơn và các cột khác vẫn hợp lệ; bộ điền của mô hình (fit theo từng phần) sẽ điền, nên ta giữ được thông tin và tránh chệch nếu việc thiếu liên quan tới điều gì đó. 3) Cuối tuần (từ ngày đặt — có sẵn), hoặc số đơn đặt trong 30 phút trước ở cùng quận (chỉ có sẵn nếu hệ thống tính trực tiếp lúc đặt đơn).</p></div>`);

const c123 = L('dsi201-ts-12-3',
  '12.3 — Capstone mini-project, part 2: model, evaluate, interpret and report|||12.3 — Dự án cuối khoá thu nhỏ, phần 2: mô hình, đánh giá, diễn giải và báo cáo',
  'Chia theo thời gian, TimeSeriesSplit; baseline 8,27 · ridge 3,28 · boosting 3,60 phút CV MAE; test ridge 3,25 phút, 78,2% đơn trong ±5 phút; permutation importance; lát cắt quận × mưa; bản báo cáo một trang và đề bài dự án của bạn.',
  `<span class="eyebrow">DSI201 · Chapter 12 · Lesson 12.3</span>
<h2>Capstone mini-project, part 2: model, evaluate, interpret and report</h2>
<p class="lead">With clean data and feature hypotheses from part 1, we now build pipelines, compare them honestly over time, test once, look inside the model and write the one-page result.</p>
<h3>🎯 Objectives</h3>
<ul><li>Split by time and compare baseline, linear and boosting pipelines with time-series cross-validation.</li><li>Evaluate the chosen model once on the future test period and analyse its errors.</li><li>Write a one-page summary — and plan your own capstone.</li></ul>
<h3>📖 Lecture</h3>
<p>Because the model will predict future orders, we split by time: train on orders before 19 November, test on the last 12 days. Inside the training period we compare models with <code>TimeSeriesSplit</code>, which always validates on later orders (Lesson 6.2). Features follow part 1: distance, items, hour, an <code>is_rush</code> flag, weekend, rain, weather-missing, a <code>rain × Long Bien</code> interaction, and the district one-hot — all known at order time.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyRegressor
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.inspection import permutation_importance
from sklearn.linear_model import Ridge
from sklearn.model_selection import TimeSeriesSplit, cross_val_score
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

df = pd.read_csv("orders_clean.csv", parse_dates=["placed_at"]).sort_values("placed_at")
# Features known when the order is placed
df["hour"] = df["placed_at"].dt.hour
df["is_rush"] = df["hour"].isin([11, 12, 18, 19]).astype(int)
df["is_weekend"] = (df["placed_at"].dt.day_of_week &gt;= 5).astype(int)
df["rain_long_bien"] = df["raining"] * (df["district"] == "Long Bien")
features = ["distance_km", "items", "hour", "is_rush", "is_weekend", "raining", "weather_missing",
            "rain_long_bien", "district"]

# Time-based split: train on October + most of November, test on the last 12 days
cut = pd.Timestamp("2026-11-19")
train, test = df[df["placed_at"] &lt; cut], df[df["placed_at"] &gt;= cut]
X_tr, y_tr, X_te, y_te = train[features], train["minutes"], test[features], test["minutes"]
print("train", len(train), "rows | test", len(test), "rows")

num = ["distance_km", "items", "hour", "is_rush", "is_weekend", "raining", "weather_missing", "rain_long_bien"]
prep = ColumnTransformer([("num", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()), num),
                          ("cat", OneHotEncoder(handle_unknown="ignore"), ["district"])])
models = {
    "baseline (mean)": DummyRegressor(),
    "ridge": Pipeline([("prep", prep), ("m", Ridge(alpha=1.0))]),
    "gradient boosting": Pipeline([("prep", prep), ("m", HistGradientBoostingRegressor(random_state=0))]),
}
cv = TimeSeriesSplit(n_splits=5)
for name, m in models.items():
    s = -cross_val_score(m, X_tr, y_tr, cv=cv, scoring="neg_mean_absolute_error")
    print(f"{name:18s} CV MAE = {s.mean():5.2f} +/- {s.std():.2f}")

# Choose ridge (simpler; see lesson), evaluate ONCE on the test period
final = models["ridge"].fit(X_tr, y_tr)
pred = final.predict(X_te)
err = np.abs(pred - y_te.to_numpy())
print(f"\\nTEST MAE ridge = {err.mean():.2f} min | baseline = {np.abs(y_tr.mean() - y_te).mean():.2f} min")
print("share of orders within 5 minutes:", round((err &lt;= 5).mean(), 3))

pi = permutation_importance(final, X_te, y_te, n_repeats=10, random_state=0, scoring="neg_mean_absolute_error")
print(pd.Series(pi.importances_mean, index=features).sort_values(ascending=False).round(2).head(5).to_dict())
slices = test.assign(abs_err=err, bias=pred - y_te).groupby(["district", "raining"]).agg(
    n=("abs_err", "size"), MAE=("abs_err", "mean"), bias=("bias", "mean")).round(2)
print(slices.loc[["Long Bien", "Ba Dinh"]])</code></pre>
<div class="out">train 4009 rows | test 979 rows
baseline (mean)    CV MAE =  8.27 +/- 0.29
ridge              CV MAE =  3.28 +/- 0.07
gradient boosting  CV MAE =  3.60 +/- 0.14

TEST MAE ridge = 3.25 min | baseline = 8.08 min
share of orders within 5 minutes: 0.782
{'distance_km': 4.93, 'is_rush': 2.42, 'raining': 1.77, 'is_weekend': 0.58, 'items': 0.41}
                     n   MAE  bias
district  raining                 
Long Bien 0        103  3.13  0.41
          1         39  3.26  0.23
Ba Dinh   0        156  3.02 -0.17
          1         67  3.46 -1.50</div>
<p><strong>Model choice.</strong> The baseline is off by 8.27 minutes in cross-validation. Ridge regression with the engineered features reaches 3.28 ± 0.07; gradient boosting reaches 3.60 ± 0.14 — <em>worse</em> than the linear model here. Because we encoded the important structure (rush step, rain interaction) as features, the true relationship became almost linear, and the simpler model wins: cheaper, steadier and easier to explain. (Noise of SD 4 minutes in the simulated data means about 3.2 minutes is the best any model could do.) We pick ridge <em>before</em> looking at the test period.</p>
<p><strong>One honest test.</strong> On the last 12 days, ridge has MAE 3.25 minutes versus 8.08 for the baseline, and 78.2% of orders fall within ±5 minutes — consistent with cross-validation, so no sign of leakage or drift. Permutation importance ranks distance (4.93 extra minutes of MAE when shuffled), rush hour (2.42) and rain (1.77) at the top — matching the EDA. The slice table shows small errors everywhere, but one item for the report: Ba Dinh in the rain has a mean bias of −1.50 minutes (n = 67), i.e. promises slightly too early; worth monitoring and re-checking with more data.</p>
<div class="callout"><p><b>One-page result (example).</b> <em>Answer:</em> a simple model can personalise delivery estimates: average error about 3¼ minutes versus 8 for today's single estimate; 78% of orders within ±5 minutes. <em>Evidence:</em> time-based test on 979 orders from the last 12 days; consistent with cross-validation over the earlier period. <em>Drivers:</em> distance, rush hours (11–12h, 18–19h), rain (stronger in Long Bien). <em>Limits:</em> two months of data, no Tết or flood periods; slight under-estimation for some district-rain combinations; predictive, not causal. <em>Next:</em> two-district pilot with weekly monitoring of error by district and weather; retrain monthly.</p></div>
<p><strong>Your capstone.</strong> Pick a public dataset you care about (Kaggle, a government open-data portal, or data you collect through an API), and deliver: (1) a framing card; (2) a reproducible repository — README, requirements, numbered notebooks, cleaning in code, raw data untouched; (3) EDA with 3–5 finding-titled charts; (4) at least a baseline, a linear model and a tree ensemble in pipelines, compared with appropriate cross-validation; (5) one final test, error analysis by subgroup and permutation importance; (6) the one-page summary with intervals and limitations. A small dataset done carefully beats a big one done carelessly.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Choosing the model after looking at test results.</li><li>Random K-fold on time-ordered data.</li><li>Assuming the most complex model must be best — always keep the simple contenders.</li><li>A report full of process and code, with the answer on page 9.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Time-ordered problems: time-based split and <code>TimeSeriesSplit</code>.</li><li>Good features can make a simple model the winner.</li><li>Choose by validation, test once, then interpret and slice the errors.</li><li>Deliver a reproducible repository and a one-page, answer-first summary.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html" target="_blank" rel="noopener">scikit-learn — TimeSeriesSplit</a></li><li><a href="https://developers.google.com/machine-learning/guides/rules-of-ml" target="_blank" rel="noopener">Google — Rules of Machine Learning (launching and monitoring)</a></li><li><a href="https://cookiecutter-data-science.drivendata.org/" target="_blank" rel="noopener">Cookiecutter Data Science — project template for your capstone</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Remove <code>is_rush</code> and <code>rain_long_bien</code> from the feature list and re-run. Which model suffers more, ridge or boosting? Explain.</li><li>Why did we report both MAE and “share within ±5 minutes”?</li><li>Write the framing card for your own capstone dataset.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Ridge suffers much more (CV MAE 3.28 → 4.70, while boosting only moves 3.60 → 3.62): without the rush flag it can only fit a straight line in hour, which cannot represent two separate peaks, and without the interaction it misses Long Bien's extra rain delay; boosting can still learn the hour peaks and interactions from raw columns through splits. 2) MAE is the technical metric; the share within ±5 minutes is how customers experience the promise and is easier for managers to act on. 3) Your own answer — check that every input is available at prediction time and that the baseline is stated.</p></div>`,
  `<span class="eyebrow">DSI201 · Chương 12 · Bài 12.3</span>
<h2>Dự án cuối khoá thu nhỏ, phần 2: mô hình, đánh giá, diễn giải và báo cáo</h2>
<p class="lead">Với dữ liệu sạch và các giả thuyết đặc trưng từ phần 1, giờ ta dựng pipeline, so sánh trung thực theo thời gian, kiểm tra một lần, nhìn vào bên trong mô hình và viết bản kết quả một trang.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chia theo thời gian và so baseline, pipeline tuyến tính và boosting bằng kiểm định chéo chuỗi thời gian.</li><li>Đánh giá mô hình đã chọn một lần trên giai đoạn test tương lai và phân tích sai số.</li><li>Viết bản tóm tắt một trang — và lên kế hoạch dự án cuối khoá của riêng bạn.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Vì mô hình sẽ dự đoán các đơn tương lai, ta chia theo thời gian: huấn luyện trên đơn trước ngày 19/11, test trên 12 ngày cuối. Trong giai đoạn huấn luyện, ta so các mô hình bằng <code>TimeSeriesSplit</code>, luôn kiểm định trên các đơn sau (Bài 6.2). Đặc trưng theo phần 1: quãng đường, số món, giờ, cờ <code>is_rush</code>, cuối tuần, mưa, thiếu thời tiết, tương tác <code>mưa × Long Biên</code>, và one-hot quận — tất cả đều biết lúc đặt đơn.</p>
<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyRegressor
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.inspection import permutation_importance
from sklearn.linear_model import Ridge
from sklearn.model_selection import TimeSeriesSplit, cross_val_score
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

df = pd.read_csv("orders_clean.csv", parse_dates=["placed_at"]).sort_values("placed_at")
# Features known when the order is placed
df["hour"] = df["placed_at"].dt.hour
df["is_rush"] = df["hour"].isin([11, 12, 18, 19]).astype(int)
df["is_weekend"] = (df["placed_at"].dt.day_of_week &gt;= 5).astype(int)
df["rain_long_bien"] = df["raining"] * (df["district"] == "Long Bien")
features = ["distance_km", "items", "hour", "is_rush", "is_weekend", "raining", "weather_missing",
            "rain_long_bien", "district"]

# Time-based split: train on October + most of November, test on the last 12 days
cut = pd.Timestamp("2026-11-19")
train, test = df[df["placed_at"] &lt; cut], df[df["placed_at"] &gt;= cut]
X_tr, y_tr, X_te, y_te = train[features], train["minutes"], test[features], test["minutes"]
print("train", len(train), "rows | test", len(test), "rows")

num = ["distance_km", "items", "hour", "is_rush", "is_weekend", "raining", "weather_missing", "rain_long_bien"]
prep = ColumnTransformer([("num", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()), num),
                          ("cat", OneHotEncoder(handle_unknown="ignore"), ["district"])])
models = {
    "baseline (mean)": DummyRegressor(),
    "ridge": Pipeline([("prep", prep), ("m", Ridge(alpha=1.0))]),
    "gradient boosting": Pipeline([("prep", prep), ("m", HistGradientBoostingRegressor(random_state=0))]),
}
cv = TimeSeriesSplit(n_splits=5)
for name, m in models.items():
    s = -cross_val_score(m, X_tr, y_tr, cv=cv, scoring="neg_mean_absolute_error")
    print(f"{name:18s} CV MAE = {s.mean():5.2f} +/- {s.std():.2f}")

# Choose ridge (simpler; see lesson), evaluate ONCE on the test period
final = models["ridge"].fit(X_tr, y_tr)
pred = final.predict(X_te)
err = np.abs(pred - y_te.to_numpy())
print(f"\\nTEST MAE ridge = {err.mean():.2f} min | baseline = {np.abs(y_tr.mean() - y_te).mean():.2f} min")
print("share of orders within 5 minutes:", round((err &lt;= 5).mean(), 3))

pi = permutation_importance(final, X_te, y_te, n_repeats=10, random_state=0, scoring="neg_mean_absolute_error")
print(pd.Series(pi.importances_mean, index=features).sort_values(ascending=False).round(2).head(5).to_dict())
slices = test.assign(abs_err=err, bias=pred - y_te).groupby(["district", "raining"]).agg(
    n=("abs_err", "size"), MAE=("abs_err", "mean"), bias=("bias", "mean")).round(2)
print(slices.loc[["Long Bien", "Ba Dinh"]])</code></pre>
<div class="out">train 4009 rows | test 979 rows
baseline (mean)    CV MAE =  8.27 +/- 0.29
ridge              CV MAE =  3.28 +/- 0.07
gradient boosting  CV MAE =  3.60 +/- 0.14

TEST MAE ridge = 3.25 min | baseline = 8.08 min
share of orders within 5 minutes: 0.782
{'distance_km': 4.93, 'is_rush': 2.42, 'raining': 1.77, 'is_weekend': 0.58, 'items': 0.41}
                     n   MAE  bias
district  raining                 
Long Bien 0        103  3.13  0.41
          1         39  3.26  0.23
Ba Dinh   0        156  3.02 -0.17
          1         67  3.46 -1.50</div>
<p><strong>Chọn mô hình.</strong> Baseline lệch 8,27 phút trong kiểm định chéo. Hồi quy ridge với các đặc trưng tự xây đạt 3,28 ± 0,07; gradient boosting đạt 3,60 ± 0,14 — <em>tệ hơn</em> mô hình tuyến tính ở đây. Vì ta đã mã hoá cấu trúc quan trọng (bậc giờ cao điểm, tương tác mưa) thành đặc trưng, quan hệ thật gần như trở thành tuyến tính, và mô hình đơn giản thắng: rẻ hơn, ổn định hơn và dễ giải thích hơn. (Nhiễu có SD 4 phút trong dữ liệu mô phỏng nghĩa là khoảng 3,2 phút là mức tốt nhất mọi mô hình có thể đạt.) Ta chọn ridge <em>trước khi</em> nhìn giai đoạn test.</p>
<p><strong>Một lần kiểm tra trung thực.</strong> Trên 12 ngày cuối, ridge có MAE 3,25 phút so với 8,08 của baseline, và 78,2% số đơn nằm trong ±5 phút — khớp với kiểm định chéo, nên không có dấu hiệu rò rỉ hay trôi dạt dữ liệu. Permutation importance xếp quãng đường (MAE tăng 4,93 phút khi bị xáo), giờ cao điểm (2,42) và mưa (1,77) lên đầu — khớp với EDA. Bảng lát cắt cho thấy sai số nhỏ ở mọi nơi, nhưng có một điểm cho báo cáo: Ba Đình khi mưa có độ lệch trung bình −1,50 phút (n = 67), tức là hứa hơi sớm; nên theo dõi và kiểm lại khi có thêm dữ liệu.</p>
<div class="callout"><p><b>Kết quả một trang (ví dụ).</b> <em>Câu trả lời:</em> một mô hình đơn giản có thể cá nhân hoá ước lượng thời gian giao: sai số trung bình khoảng 3¼ phút so với 8 phút của con số ước lượng chung hiện nay; 78% số đơn nằm trong ±5 phút. <em>Bằng chứng:</em> kiểm tra theo thời gian trên 979 đơn của 12 ngày cuối; khớp với kiểm định chéo trên giai đoạn trước đó. <em>Động lực:</em> quãng đường, giờ cao điểm (11–12h, 18–19h), mưa (mạnh hơn ở Long Biên). <em>Giới hạn:</em> hai tháng dữ liệu, chưa có Tết hay mùa ngập; đánh giá thấp nhẹ ở vài tổ hợp quận–mưa; mang tính dự đoán, không nhân quả. <em>Tiếp theo:</em> chạy thử ở hai quận, theo dõi hằng tuần sai số theo quận và thời tiết; huấn luyện lại hằng tháng.</p></div>
<p><strong>Dự án cuối khoá của bạn.</strong> Chọn một bộ dữ liệu công khai bạn quan tâm (Kaggle, cổng dữ liệu mở của chính phủ, hoặc dữ liệu bạn thu qua API), và nộp: (1) thẻ đặt bài toán; (2) một kho mã tái lập được — README, requirements, notebook đánh số, làm sạch bằng code, dữ liệu thô nguyên vẹn; (3) EDA với 3–5 biểu đồ có tiêu đề nêu phát hiện; (4) ít nhất một baseline, một mô hình tuyến tính và một mô hình tổ hợp cây trong pipeline, so sánh bằng kiểm định chéo phù hợp; (5) một lần test cuối, phân tích sai số theo nhóm con và permutation importance; (6) bản tóm tắt một trang có khoảng tin cậy và giới hạn. Một bộ dữ liệu nhỏ làm cẩn thận thắng một bộ lớn làm cẩu thả.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn mô hình sau khi nhìn kết quả test.</li><li>K-fold ngẫu nhiên trên dữ liệu có thứ tự thời gian.</li><li>Mặc định mô hình phức tạp nhất phải tốt nhất — luôn giữ các ứng viên đơn giản.</li><li>Báo cáo đầy quá trình và code, câu trả lời nằm ở trang 9.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bài toán có thứ tự thời gian: chia theo thời gian và dùng <code>TimeSeriesSplit</code>.</li><li>Đặc trưng tốt có thể khiến mô hình đơn giản chiến thắng.</li><li>Chọn bằng validation, test một lần, rồi diễn giải và chia lát sai số.</li><li>Bàn giao một kho mã tái lập được và bản tóm tắt một trang, câu trả lời đặt trước.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html" target="_blank" rel="noopener">scikit-learn — TimeSeriesSplit</a></li><li><a href="https://developers.google.com/machine-learning/guides/rules-of-ml" target="_blank" rel="noopener">Google — Rules of Machine Learning (triển khai và giám sát)</a></li><li><a href="https://cookiecutter-data-science.drivendata.org/" target="_blank" rel="noopener">Cookiecutter Data Science — khuôn dự án cho bài cuối khoá</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Bỏ <code>is_rush</code> và <code>rain_long_bien</code> khỏi danh sách đặc trưng rồi chạy lại. Mô hình nào chịu thiệt hơn, ridge hay boosting? Giải thích.</li><li>Vì sao ta báo cả MAE lẫn “tỉ lệ trong ±5 phút”?</li><li>Viết thẻ đặt bài toán cho bộ dữ liệu dự án cuối khoá của bạn.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Ridge chịu thiệt nhiều hơn hẳn (CV MAE 3,28 → 4,70, còn boosting chỉ 3,60 → 3,62): không có cờ cao điểm, nó chỉ khớp được một đường thẳng theo giờ, không biểu diễn được hai đỉnh tách rời, và không có tương tác thì bỏ sót phần chậm thêm khi mưa ở Long Biên; boosting vẫn học được các đỉnh theo giờ và tương tác từ cột thô nhờ các lần chia. 2) MAE là chỉ số kỹ thuật; tỉ lệ trong ±5 phút là cách khách hàng cảm nhận lời hứa và giúp quản lý dễ hành động hơn. 3) Câu trả lời của riêng bạn — kiểm mọi đầu vào có sẵn tại thời điểm dự đoán và baseline đã được nêu rõ.</p></div>`);

const q12 = QZ(12, 'Quiz — Chapter 12: Communicating results and the capstone|||Quiz — Chương 12: Trình bày kết quả và dự án cuối khoá',
  'Quiz 8 câu: cấu trúc câu trả lời trước, dịch chỉ số, khoảng bootstrap, bootstrap hiệu, nhật ký làm sạch, chia theo thời gian, vì sao ridge thắng boosting, nội dung bản tóm tắt một trang.', [
  Q('q1', 'What should the first sentence of a results report contain?|||Câu đầu tiên của báo cáo kết quả nên chứa gì?',
    ['The answer and the recommended action|||Câu trả lời và hành động đề xuất', 'The history of the project|||Lịch sử dự án', 'The list of libraries used|||Danh sách thư viện đã dùng', 'The raw data description|||Mô tả dữ liệu thô'], 0,
    'Answer first; evidence and details follow.|||Câu trả lời trước; bằng chứng và chi tiết theo sau.'),
  Q('q2', 'Which phrasing best translates “MAE = 3.25 minutes” for an operations manager?|||Cách nói nào dịch tốt nhất “MAE = 3,25 phút” cho quản lý vận hành?',
    ['On average the estimate is about 3 minutes off; 4 in 5 orders are within 5 minutes|||Trung bình ước lượng lệch khoảng 3 phút; 4 trên 5 đơn nằm trong 5 phút', 'The model has low loss|||Mô hình có hàm mất mát thấp', 'R² is high|||R² cao', 'The RMSE is close to the MAE|||RMSE gần MAE'], 0,
    'Use the audience’s units and experience.|||Dùng đơn vị và trải nghiệm của người nghe.'),
  Q('q3', 'How does the bootstrap estimate uncertainty of a test MAE?|||Bootstrap ước lượng độ bất định của MAE test thế nào?',
    ['Resample test rows with replacement many times and recompute MAE|||Lấy mẫu lại các dòng test có hoàn lại nhiều lần và tính lại MAE', 'Train on the test set|||Huấn luyện trên tập test', 'Average predictions of many models|||Lấy trung bình dự đoán của nhiều mô hình', 'Shuffle the target|||Xáo trộn mục tiêu'], 0,
    'The spread of the recomputed metric gives an interval.|||Độ phân tán của chỉ số tính lại cho ra một khoảng.'),
  Q('q4', 'Why bootstrap the difference between model and baseline errors directly?|||Vì sao nên bootstrap trực tiếp hiệu sai số giữa mô hình và baseline?',
    ['Both errors move together on the same rows, so the difference is more precise|||Hai sai số cùng biến động trên cùng các dòng, nên hiệu chính xác hơn', 'It is faster|||Nó nhanh hơn', 'It removes the baseline|||Nó bỏ baseline', 'It increases the sample size|||Nó tăng cỡ mẫu'], 0,
    'Overlapping separate intervals can hide a reliable difference.|||Hai khoảng riêng chồng nhau có thể che giấu một khác biệt đáng tin.'),
  Q('q5', 'In the capstone, why were rows with minutes = 999 removed but long real deliveries kept?|||Trong dự án, vì sao bỏ dòng có 999 phút nhưng giữ các chuyến giao dài thật?',
    ['999 is a data error; a long real delivery is a true extreme|||999 là lỗi dữ liệu; chuyến dài thật là cực trị có thật', 'Long deliveries are rare|||Chuyến dài hiếm', 'The model cannot handle large numbers|||Mô hình không xử lý được số lớn', 'To raise the R²|||Để tăng R²'], 0,
    'Errors are fixed or removed; genuine extremes are information.|||Lỗi thì sửa hoặc bỏ; cực trị thật là thông tin.'),
  Q('q6', 'Why was the capstone split by date rather than randomly?|||Vì sao dự án chia theo ngày thay vì ngẫu nhiên?',
    ['The model will predict future orders, so testing must be on a later period|||Mô hình sẽ dự đoán đơn tương lai, nên phải test trên giai đoạn sau', 'Random splits are slower|||Chia ngẫu nhiên chậm hơn', 'Dates cannot be shuffled|||Ngày không xáo được', 'To get a larger test set|||Để có tập test lớn hơn'], 0,
    'Time-based evaluation mimics deployment and avoids leakage from the future.|||Đánh giá theo thời gian mô phỏng lúc triển khai và tránh rò rỉ từ tương lai.'),
  Q('q7', 'Ridge (3.28) beat gradient boosting (3.60) in the capstone mainly because…|||Trong dự án, ridge (3,28) thắng gradient boosting (3,60) chủ yếu vì…',
    ['engineered features made the relationship nearly linear|||đặc trưng tự xây làm quan hệ gần như tuyến tính', 'boosting is always worse|||boosting luôn tệ hơn', 'ridge used the test set|||ridge dùng tập test', 'boosting cannot use categories|||boosting không dùng được biến phân loại'], 0,
    'is_rush and the rain × Long Bien interaction encoded the non-linear structure.|||is_rush và tương tác mưa × Long Biên đã mã hoá cấu trúc phi tuyến.'),
  Q('q8', 'Which item does NOT belong in a one-page result summary?|||Mục nào KHÔNG thuộc bản tóm tắt kết quả một trang?',
    ['Every hyper-parameter tried in chronological order|||Mọi siêu tham số đã thử theo thứ tự thời gian', 'The answer and recommendation|||Câu trả lời và đề xuất', 'Limitations and risks|||Giới hạn và rủi ro', 'Key evidence with intervals|||Bằng chứng chính kèm khoảng'], 0,
    'Process details go to an appendix or the repository.|||Chi tiết quá trình đưa vào phụ lục hoặc kho mã.'),
]);

const ch12 = {
  title: 'Chapter 12 — Communicating results and capstone mini-project|||Chương 12 — Trình bày kết quả và dự án cuối khoá thu nhỏ',
  description: 'Báo cáo kiểu câu trả lời trước, dịch chỉ số, khoảng bootstrap; dự án giao hàng trọn vẹn: đặt bài toán, làm sạch, EDA, pipeline, TimeSeriesSplit, test một lần, diễn giải, tóm tắt một trang; đề bài dự án riêng.',
  lessons: [c121, c122, c123, q12],
};


export default [s0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11, ch12];
