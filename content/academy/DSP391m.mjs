/**
 * DSP391m — Data Science - Capstone Project (Đồ án tốt nghiệp Khoa học dữ liệu).
 * Ngành Hệ thống thông tin, FPTU, Kỳ 8. ĐÂY LÀ ĐỒ ÁN CAPSTONE — khung theo
 * quy trình dự án khoa học dữ liệu end-to-end (CRISP-DM mở rộng), KHÔNG phải
 * 8 chương lý thuyết. 8 chương = 8 GIAI ĐOẠN dự án. Song ngữ VI+EN.
 * Nguồn tham khảo: McKinney "Python for Data Analysis", Géron "Hands-On ML",
 * CRISP-DM, Kaggle. GIỮ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG nested backtick/${;
 * HTML "&"→&amp;, "<"→&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức giai đoạn.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dsp391m-0-0-tai-lieu', '📚 Materials & references|||📚 Tài liệu tham khảo',
  'Trung tâm tài liệu đồ án: giáo trình FLM, sách kinh điển (McKinney, Géron), CRISP-DM, Kaggle, công cụ, lộ trình đồ án.',
  [[
    `<span class="eyebrow">DSP391m · Materials</span>
<h2>Capstone materials &amp; resource hub</h2>
<p class="lead">Everything you need to run a full <strong>data science capstone</strong> end-to-end — from framing a business problem to defending your final report. The official brief, rubric and slides live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Course brief &amp; rubric</h3>
<p>The official FPTU capstone guideline, deliverable list and grading rubric for DSP391m are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://wesmckinney.com/book/" target="_blank" rel="noopener"><em>Python for Data Analysis</em> — Wes McKinney (free online)</a></li>
<li><a href="https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/" target="_blank" rel="noopener"><em>Hands-On Machine Learning</em> — Aurélien Géron</a></li>
</ul>
<h3>🌐 Process &amp; free documentation</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Cross-industry_standard_process_for_data_mining" target="_blank" rel="noopener">CRISP-DM — the standard data-mining process</a></li>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn User Guide</a></li>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">pandas documentation</a></li>
</ul>
<h3>▶️ Learn &amp; practice</h3>
<ul>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a> — hands-on micro-courses &amp; datasets</li>
<li><a href="https://www.youtube.com/@StatQuest" target="_blank" rel="noopener">StatQuest</a> — statistics &amp; ML explained clearly</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter Notebook / JupyterLab</a> — exploratory analysis</li>
<li><a href="https://streamlit.io/" target="_blank" rel="noopener">Streamlit</a> — turn a model into a dashboard fast</li>
<li><a href="https://mlflow.org/" target="_blank" rel="noopener">MLflow</a> — experiment tracking &amp; model registry</li>
</ul>
<div class="callout"><span class="badge">Capstone path</span>
<ol>
<li><strong>Frame</strong> — pin the business question, success metric and scope before touching data.</li>
<li><strong>Build</strong> — collect &amp; clean data, engineer features, train and compare models.</li>
<li><strong>Prove</strong> — evaluate honestly, deploy a demo, and track experiments.</li>
<li><strong>Tell</strong> — write the report, visualise the story, address data ethics, and defend.</li>
</ol></div>`,
    `<span class="eyebrow">DSP391m · Tài liệu</span>
<h2>Trung tâm tài liệu đồ án</h2>
<p class="lead">Mọi thứ để chạy một <strong>đồ án tốt nghiệp khoa học dữ liệu</strong> end-to-end — từ xác định bài toán kinh doanh đến bảo vệ báo cáo cuối. Đề bài, rubric và slide chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Đề bài &amp; rubric</h3>
<p>Hướng dẫn đồ án FPTU, danh mục sản phẩm nộp (deliverable) và rubric chấm điểm của DSP391m có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://wesmckinney.com/book/" target="_blank" rel="noopener"><em>Python for Data Analysis</em> — Wes McKinney (đọc miễn phí online)</a></li>
<li><a href="https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/" target="_blank" rel="noopener"><em>Hands-On Machine Learning</em> — Aurélien Géron</a></li>
</ul>
<h3>🌐 Quy trình &amp; tài liệu miễn phí</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Cross-industry_standard_process_for_data_mining" target="_blank" rel="noopener">CRISP-DM — quy trình khai phá dữ liệu chuẩn</a></li>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">Cẩm nang scikit-learn</a></li>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">Tài liệu pandas</a></li>
</ul>
<h3>▶️ Học &amp; luyện</h3>
<ul>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a> — khoá học ngắn thực hành &amp; bộ dữ liệu</li>
<li><a href="https://www.youtube.com/@StatQuest" target="_blank" rel="noopener">StatQuest</a> — thống kê &amp; ML giảng rõ ràng</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter Notebook / JupyterLab</a> — phân tích khám phá</li>
<li><a href="https://streamlit.io/" target="_blank" rel="noopener">Streamlit</a> — biến mô hình thành dashboard nhanh</li>
<li><a href="https://mlflow.org/" target="_blank" rel="noopener">MLflow</a> — theo dõi thí nghiệm &amp; kho mô hình</li>
</ul>
<div class="callout"><span class="badge">Lộ trình đồ án</span>
<ol>
<li><strong>Xác định</strong> — chốt câu hỏi kinh doanh, thước đo thành công và phạm vi trước khi động vào dữ liệu.</li>
<li><strong>Xây dựng</strong> — thu thập &amp; làm sạch dữ liệu, tạo đặc trưng, huấn luyện và so sánh mô hình.</li>
<li><strong>Chứng minh</strong> — đánh giá trung thực, triển khai bản demo, và theo dõi thí nghiệm.</li>
<li><strong>Kể chuyện</strong> — viết báo cáo, trực quan hoá câu chuyện, bàn đạo đức dữ liệu, và bảo vệ.</li>
</ol></div>`,
  ]]);

const intro = doc('dsp391m-0-1-overview', 'Capstone overview & deliverables|||Tổng quan đồ án & sản phẩm nộp',
  'Capstone là gì; sản phẩm nộp (đề xuất, notebook, mô hình, demo, báo cáo, bảo vệ); rubric chấm; lộ trình 8 giai đoạn CRISP-DM.',
  [[
    `<span class="eyebrow">DSP391m · Lesson 0.1 · Overview</span>
<h2>Data Science Capstone Project</h2>
<p class="lead">A <strong>capstone</strong> is not a new topic to memorise — it is where you <strong>prove</strong> that you can carry a real, messy problem all the way from a vague business question to a working, defended solution. You work individually or in a small team on one dataset and one goal, and you own every stage.</p>
<h3>What you actually deliver</h3>
<ul>
<li><strong>Project proposal</strong> — the business problem, objective, success metric and scope.</li>
<li><strong>Analysis notebook(s)</strong> — reproducible EDA, cleaning and modeling code.</li>
<li><strong>Trained model</strong> — with an honest evaluation and comparison.</li>
<li><strong>Deployment / demo</strong> — a dashboard or API so a non-coder can use it.</li>
<li><strong>Final report + defense</strong> — the story, the results, the limitations and ethics.</li>
</ul>
<h3>How you are graded (rubric themes)</h3>
<pre><code>Problem framing &amp; business value   -- is the question worth answering?
Data &amp; method rigour              -- clean data, sound choices, no leakage
Modeling &amp; evaluation             -- right metric, honest comparison
Communication &amp; deployment        -- clear story, usable artifact
Reproducibility &amp; ethics          -- can it be re-run? is it fair &amp; safe?
</code></pre>
<h3>The roadmap — 8 project phases</h3>
<p>This course follows the <strong>CRISP-DM</strong> lifecycle, expanded to eight stages: (1) frame the problem → (2) collect &amp; understand data → (3) clean &amp; preprocess → (4) explore &amp; visualise → (5) model → (6) evaluate &amp; tune → (7) deploy → (8) report, defend &amp; act ethically. Each stage is one bilingual document plus a short quiz.</p>
<div class="callout"><span class="badge">The golden rule</span> Spend real time on framing and data — a brilliant model on the wrong question, or on leaky data, scores zero. Most capstone failures happen in stages 1–3, not stage 5.</div>`,
    `<span class="eyebrow">DSP391m · Bài 0.1 · Tổng quan</span>
<h2>Đồ án tốt nghiệp Khoa học dữ liệu</h2>
<p class="lead">Một <strong>đồ án capstone</strong> không phải chủ đề mới để học thuộc — đây là nơi bạn <strong>chứng minh</strong> khả năng đưa một bài toán thật, lộn xộn, đi trọn đường từ câu hỏi kinh doanh mơ hồ đến một giải pháp chạy được và bảo vệ được. Bạn làm cá nhân hoặc nhóm nhỏ trên một bộ dữ liệu và một mục tiêu, và tự chịu trách nhiệm mọi giai đoạn.</p>
<h3>Bạn thực sự phải nộp gì</h3>
<ul>
<li><strong>Đề xuất đồ án</strong> — bài toán kinh doanh, mục tiêu, thước đo thành công và phạm vi.</li>
<li><strong>Notebook phân tích</strong> — mã EDA, làm sạch và mô hình hoá tái lập được.</li>
<li><strong>Mô hình đã huấn luyện</strong> — kèm đánh giá và so sánh trung thực.</li>
<li><strong>Triển khai / demo</strong> — dashboard hoặc API để người không biết code cũng dùng được.</li>
<li><strong>Báo cáo cuối + bảo vệ</strong> — câu chuyện, kết quả, giới hạn và đạo đức.</li>
</ul>
<h3>Chấm điểm thế nào (chủ đề rubric)</h3>
<pre><code>Xác định bài toán &amp; giá trị    -- câu hỏi có đáng trả lời không?
Chặt chẽ về dữ liệu &amp; phương pháp -- dữ liệu sạch, lựa chọn hợp lý, không rò rỉ
Mô hình &amp; đánh giá             -- đúng thước đo, so sánh trung thực
Truyền đạt &amp; triển khai         -- câu chuyện rõ, sản phẩm dùng được
Tái lập &amp; đạo đức             -- chạy lại được không? có công bằng &amp; an toàn?
</code></pre>
<h3>Lộ trình — 8 giai đoạn dự án</h3>
<p>Môn này theo vòng đời <strong>CRISP-DM</strong>, mở rộng thành tám giai đoạn: (1) xác định bài toán → (2) thu thập &amp; hiểu dữ liệu → (3) làm sạch &amp; tiền xử lý → (4) khám phá &amp; trực quan hoá → (5) mô hình → (6) đánh giá &amp; tinh chỉnh → (7) triển khai → (8) báo cáo, bảo vệ &amp; đạo đức. Mỗi giai đoạn là một tài liệu song ngữ kèm một quiz ngắn.</p>
<div class="callout"><span class="badge">Nguyên tắc vàng</span> Dành thời gian thật cho xác định bài toán và dữ liệu — một mô hình xuất sắc trên câu hỏi sai, hoặc trên dữ liệu rò rỉ, thì điểm bằng không. Đa số đồ án hỏng ở giai đoạn 1–3, không phải giai đoạn 5.</div>`,
  ]]);

const c1 = doc('dsp391m-1-1-problem', 'Phase 1 — Problem & business objective|||Giai đoạn 1 — Bài toán & mục tiêu kinh doanh',
  'Business understanding (CRISP-DM): biến câu hỏi kinh doanh thành bài toán data science; loại bài toán; success metric; scope & giả định.',
  [[
    `<span class="eyebrow">DSP391m · Phase 1 · Business Understanding</span>
<h2>Frame the problem &amp; the business objective</h2>
<p>The first CRISP-DM phase is <strong>Business Understanding</strong>, and it is the one students skip the most. Before any data, answer: <em>who</em> has a problem, <em>what</em> decision will change, and <em>how</em> we will know if we succeeded.</p>
<h3>From business question to data science task</h3>
<p>Translate a fuzzy ask into a precise task type:</p>
<pre><code>"Which customers will leave?"      -&gt; classification (churn: yes/no)
"How much will we sell next month?" -&gt; regression (a number)
"Group our customers"               -&gt; clustering (unsupervised)
"What should we recommend?"         -&gt; recommendation / ranking
</code></pre>
<h3>Define a success metric BEFORE modeling</h3>
<p>Pick the metric that matches the business cost. For imbalanced churn, <strong>accuracy lies</strong> — a model that predicts "nobody churns" can be 95% accurate and useless. Prefer <strong>recall / F1 / AUC</strong>, and tie it to money where you can (e.g. "catch 80% of churners so retention can act").</p>
<h3>Scope, assumptions &amp; SMART goals</h3>
<ul>
<li>Write a <strong>SMART</strong> objective: Specific, Measurable, Achievable, Relevant, Time-bound.</li>
<li>List <strong>assumptions</strong> and what is <strong>out of scope</strong> — this protects you at defense.</li>
<li>Name the <strong>stakeholder</strong> and the decision your output feeds.</li>
</ul>
<div class="callout"><span class="badge">Deliverable</span> A one-page project proposal: problem statement, task type, target variable, success metric, data sources, scope and assumptions.</div>`,
    `<span class="eyebrow">DSP391m · Giai đoạn 1 · Hiểu bài toán</span>
<h2>Xác định bài toán &amp; mục tiêu kinh doanh</h2>
<p>Giai đoạn CRISP-DM đầu tiên là <strong>Business Understanding</strong> (hiểu bài toán kinh doanh), và đây là bước sinh viên bỏ qua nhiều nhất. Trước khi có dữ liệu, hãy trả lời: <em>ai</em> đang có vấn đề, <em>quyết định</em> gì sẽ thay đổi, và <em>làm sao</em> biết mình thành công.</p>
<h3>Từ câu hỏi kinh doanh thành bài toán data science</h3>
<p>Dịch một yêu cầu mơ hồ thành đúng loại bài toán:</p>
<pre><code>"Khách nào sẽ rời bỏ?"       -&gt; phân loại (churn: có/không)
"Tháng sau bán được bao nhiêu?" -&gt; hồi quy (một con số)
"Nhóm khách hàng lại"           -&gt; phân cụm (không giám sát)
"Nên gợi ý gì?"                 -&gt; gợi ý / xếp hạng
</code></pre>
<h3>Định thước đo thành công TRƯỚC khi mô hình hoá</h3>
<p>Chọn thước đo khớp với chi phí kinh doanh. Với churn mất cân bằng, <strong>accuracy nói dối</strong> — mô hình đoán "không ai rời bỏ" có thể đạt 95% mà vô dụng. Ưu tiên <strong>recall / F1 / AUC</strong>, và gắn với tiền khi có thể (vd "bắt được 80% khách sắp rời để bộ phận giữ chân kịp hành động").</p>
<h3>Phạm vi, giả định &amp; mục tiêu SMART</h3>
<ul>
<li>Viết mục tiêu <strong>SMART</strong>: Cụ thể, Đo được, Khả thi, Liên quan, Có hạn thời gian.</li>
<li>Liệt kê <strong>giả định</strong> và những gì <strong>ngoài phạm vi</strong> — điều này bảo vệ bạn khi bảo vệ đồ án.</li>
<li>Nêu tên <strong>bên liên quan (stakeholder)</strong> và quyết định mà kết quả của bạn phục vụ.</li>
</ul>
<div class="callout"><span class="badge">Sản phẩm nộp</span> Bản đề xuất một trang: phát biểu bài toán, loại bài toán, biến mục tiêu, thước đo thành công, nguồn dữ liệu, phạm vi và giả định.</div>`,
  ]]);

const c1q = quiz('dsp391m-quiz-1', 'Quiz 1 — Problem framing|||Quiz 1 — Xác định bài toán', [
  { id: 'q1', question: 'Giai đoạn CRISP-DM đầu tiên là gì?', options: ['Modeling', 'Business Understanding (hiểu bài toán kinh doanh)', 'Deployment', 'Data Cleaning'], correctIndex: 1, explanation: 'CRISP-DM bắt đầu bằng Business Understanding: hiểu vấn đề và mục tiêu trước khi động vào dữ liệu.' },
  { id: 'q2', question: 'Bài toán "khách hàng nào sẽ rời bỏ (churn)?" thuộc loại nào?', options: ['Hồi quy (regression)', 'Phân loại (classification)', 'Phân cụm (clustering)', 'Giảm chiều'], correctIndex: 1, explanation: 'Dự đoán có/không (rời bỏ hay không) là bài toán phân loại.' },
  { id: 'q3', question: 'Vì sao accuracy có thể gây hiểu lầm với dữ liệu churn mất cân bằng?', options: ['Vì accuracy luôn thấp', 'Vì mô hình đoán "không ai rời bỏ" vẫn có accuracy cao nhưng vô dụng', 'Vì accuracy chỉ dùng cho hồi quy', 'Vì accuracy cần dữ liệu ảnh'], correctIndex: 1, explanation: 'Khi lớp thiểu số hiếm, đoán toàn lớp đa số cho accuracy cao mà không bắt được ca cần bắt; nên dùng recall/F1/AUC.' },
]);

const c2 = doc('dsp391m-2-1-data', 'Phase 2 — Data collection & understanding|||Giai đoạn 2 — Thu thập & hiểu dữ liệu',
  'Data understanding (CRISP-DM): nguồn dữ liệu (API, CSV, SQL, scraping), data dictionary, kiểm chất lượng ban đầu, quyền & rò rỉ dữ liệu.',
  [[
    `<span class="eyebrow">DSP391m · Phase 2 · Data Understanding</span>
<h2>Collect &amp; understand the data</h2>
<p>Now you gather the raw material and get to know it — before cleaning anything. In CRISP-DM this is <strong>Data Understanding</strong>: describe, explore and verify data quality.</p>
<h3>Where data comes from</h3>
<ul>
<li><strong>Files</strong> — CSV, Excel, JSON, Parquet (Kaggle, open data portals).</li>
<li><strong>Databases</strong> — SQL queries against a warehouse.</li>
<li><strong>APIs</strong> — pull JSON from a service (respect rate limits &amp; terms).</li>
<li><strong>Web scraping</strong> — only when permitted by robots.txt and terms.</li>
</ul>
<h3>First look with pandas</h3>
<pre><code>import pandas as pd
df = pd.read_csv("customers.csv")

df.shape          # rows, columns
df.info()         # dtypes &amp; non-null counts
df.describe()     # numeric summary
df.head()         # eyeball real rows
df.isna().mean()  # fraction missing per column
</code></pre>
<h3>Build a data dictionary</h3>
<p>Document every column: name, meaning, unit, type, allowed range, source. This one artifact saves you at defense and prevents you from trusting a column you misread.</p>
<div class="callout"><span class="badge">Watch out: leakage</span> A column that only exists <em>after</em> the outcome (e.g. "cancellation_date" when predicting churn) will inflate your score and fail in production. Flag and drop leaky features here, not after modeling.</div>`,
    `<span class="eyebrow">DSP391m · Giai đoạn 2 · Hiểu dữ liệu</span>
<h2>Thu thập &amp; hiểu dữ liệu</h2>
<p>Giờ bạn gom nguyên liệu thô và làm quen với nó — trước khi làm sạch bất cứ thứ gì. Trong CRISP-DM đây là <strong>Data Understanding</strong>: mô tả, khám phá và kiểm chất lượng dữ liệu.</p>
<h3>Dữ liệu đến từ đâu</h3>
<ul>
<li><strong>Tệp</strong> — CSV, Excel, JSON, Parquet (Kaggle, cổng dữ liệu mở).</li>
<li><strong>Cơ sở dữ liệu</strong> — truy vấn SQL trên kho dữ liệu.</li>
<li><strong>API</strong> — kéo JSON từ dịch vụ (tôn trọng giới hạn tần suất &amp; điều khoản).</li>
<li><strong>Cào web (scraping)</strong> — chỉ khi robots.txt và điều khoản cho phép.</li>
</ul>
<h3>Nhìn lần đầu bằng pandas</h3>
<pre><code>import pandas as pd
df = pd.read_csv("customers.csv")

df.shape          # số dòng, số cột
df.info()         # kiểu dữ liệu &amp; số ô không rỗng
df.describe()     # tóm tắt số học
df.head()         # xem tận mắt vài dòng thật
df.isna().mean()  # tỉ lệ thiếu mỗi cột
</code></pre>
<h3>Lập từ điển dữ liệu (data dictionary)</h3>
<p>Ghi rõ mọi cột: tên, ý nghĩa, đơn vị, kiểu, khoảng giá trị hợp lệ, nguồn. Chỉ một tài liệu này thôi cũng cứu bạn khi bảo vệ và tránh việc tin vào một cột mà bạn hiểu sai.</p>
<div class="callout"><span class="badge">Cẩn thận: rò rỉ dữ liệu (leakage)</span> Một cột chỉ tồn tại <em>sau</em> khi kết quả xảy ra (vd "ngày huỷ hợp đồng" khi dự đoán churn) sẽ thổi phồng điểm và hỏng khi lên production. Phát hiện và bỏ đặc trưng rò rỉ ngay tại đây, không phải sau khi mô hình hoá.</div>`,
  ]]);

const c2q = quiz('dsp391m-quiz-2', 'Quiz 2 — Data collection|||Quiz 2 — Thu thập dữ liệu', [
  { id: 'q1', question: 'Trong pandas, lệnh nào cho biết tỉ lệ giá trị thiếu ở mỗi cột?', options: ['df.shape', 'df.isna().mean()', 'df.head()', 'df.sort_values()'], correctIndex: 1, explanation: 'df.isna() cho ma trận True/False chỗ thiếu; .mean() theo cột ra tỉ lệ thiếu.' },
  { id: 'q2', question: 'Data dictionary (từ điển dữ liệu) là gì?', options: ['Một mô hình học máy', 'Tài liệu mô tả từng cột: ý nghĩa, đơn vị, kiểu, nguồn', 'Một biểu đồ phân phối', 'Một API lấy dữ liệu'], correctIndex: 1, explanation: 'Data dictionary ghi rõ ý nghĩa và thuộc tính từng cột, giúp hiểu đúng dữ liệu.' },
  { id: 'q3', question: 'Data leakage (rò rỉ dữ liệu) điển hình là gì?', options: ['Dữ liệu bị mất khi lưu', 'Dùng đặc trưng chỉ có SAU khi kết quả xảy ra để dự đoán kết quả đó', 'Dữ liệu quá lớn không tải nổi', 'Thiếu quyền truy cập API'], correctIndex: 1, explanation: 'Đặc trưng biết được kết quả (như ngày huỷ khi dự đoán churn) làm điểm ảo cao nhưng vô dụng thực tế.' },
]);

const c3 = doc('dsp391m-3-1-clean', 'Phase 3 — Cleaning & feature engineering|||Giai đoạn 3 — Làm sạch & tạo đặc trưng',
  'Data preparation (CRISP-DM): xử lý thiếu, ngoại lệ, trùng lặp; mã hoá categorical; scaling; feature engineering; tách train/test đúng cách.',
  [[
    `<span class="eyebrow">DSP391m · Phase 3 · Data Preparation</span>
<h2>Clean &amp; preprocess the data</h2>
<p>This is where the real time goes — data scientists spend most of a project here. In CRISP-DM this is <strong>Data Preparation</strong>: turn messy raw data into a tidy table a model can learn from.</p>
<h3>The cleaning checklist</h3>
<ul>
<li><strong>Missing values</strong> — drop, or impute (mean/median/mode, or a model). Never blindly fill.</li>
<li><strong>Duplicates</strong> — <code>df.drop_duplicates()</code>.</li>
<li><strong>Outliers</strong> — inspect with IQR / z-score; decide keep, cap, or remove with a reason.</li>
<li><strong>Types &amp; units</strong> — parse dates, fix "1,000" strings, normalise categories.</li>
</ul>
<h3>Encode &amp; scale</h3>
<pre><code>from sklearn.preprocessing import StandardScaler, OneHotEncoder

# categorical -&gt; numbers
pd.get_dummies(df, columns=["city", "plan"])

# numeric features on the same scale (needed for many models)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)   # FIT on train only
X_test_scaled = scaler.transform(X_test)   # then transform test
</code></pre>
<h3>Feature engineering</h3>
<p>Create features that carry signal: ratios, date parts (day-of-week, month), aggregations (avg spend per user), text length. Good features often beat a fancier model.</p>
<div class="callout"><span class="badge">Split first, fit later</span> Do the <strong>train/test split before</strong> fitting scalers or imputers, and fit them on the training set only. Fitting on all the data leaks test information and inflates your score.</div>`,
    `<span class="eyebrow">DSP391m · Giai đoạn 3 · Chuẩn bị dữ liệu</span>
<h2>Làm sạch &amp; tiền xử lý dữ liệu</h2>
<p>Đây là nơi tốn thời gian thật — nhà khoa học dữ liệu dành phần lớn dự án ở đây. Trong CRISP-DM đây là <strong>Data Preparation</strong>: biến dữ liệu thô lộn xộn thành một bảng gọn gàng để mô hình học được.</p>
<h3>Danh mục làm sạch</h3>
<ul>
<li><strong>Giá trị thiếu</strong> — bỏ, hoặc điền (mean/median/mode, hoặc bằng mô hình). Đừng điền bừa.</li>
<li><strong>Trùng lặp</strong> — <code>df.drop_duplicates()</code>.</li>
<li><strong>Ngoại lệ (outlier)</strong> — soi bằng IQR / z-score; quyết định giữ, chặn (cap), hay bỏ kèm lý do.</li>
<li><strong>Kiểu &amp; đơn vị</strong> — phân tích ngày, sửa chuỗi "1,000", chuẩn hoá danh mục.</li>
</ul>
<h3>Mã hoá &amp; chuẩn hoá thang</h3>
<pre><code>from sklearn.preprocessing import StandardScaler, OneHotEncoder

# categorical -&gt; số
pd.get_dummies(df, columns=["city", "plan"])

# đưa đặc trưng số về cùng thang (nhiều mô hình cần)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)   # CHỈ fit trên train
X_test_scaled = scaler.transform(X_test)   # rồi transform test
</code></pre>
<h3>Tạo đặc trưng (feature engineering)</h3>
<p>Tạo đặc trưng mang tín hiệu: tỉ số, thành phần ngày (thứ trong tuần, tháng), tổng hợp (chi tiêu trung bình mỗi người), độ dài văn bản. Đặc trưng tốt thường thắng cả một mô hình phức tạp hơn.</p>
<div class="callout"><span class="badge">Tách trước, fit sau</span> Hãy <strong>tách train/test TRƯỚC</strong> khi fit scaler hay bộ điền thiếu, và chỉ fit trên tập train. Fit trên toàn bộ dữ liệu làm rò rỉ thông tin test và thổi phồng điểm.</div>`,
  ]]);

const c3q = quiz('dsp391m-quiz-3', 'Quiz 3 — Cleaning & features|||Quiz 3 — Làm sạch & đặc trưng', [
  { id: 'q1', question: 'Vì sao phải tách train/test TRƯỚC khi fit scaler/imputer?', options: ['Để chạy nhanh hơn', 'Để tránh rò rỉ thông tin của tập test vào quá trình huấn luyện', 'Vì scaler không dùng được trên train', 'Để giảm dung lượng file'], correctIndex: 1, explanation: 'Fit trên toàn bộ dữ liệu (gồm test) làm mô hình "thấy trước" test → điểm ảo cao; chỉ fit trên train.' },
  { id: 'q2', question: 'Cách xử lý giá trị thiếu bằng cách điền giá trị thay thế gọi là?', options: ['Encoding', 'Imputation (điền khuyết)', 'Scaling', 'Sampling'], correctIndex: 1, explanation: 'Imputation là điền giá trị thiếu bằng mean/median/mode hoặc mô hình.' },
  { id: 'q3', question: 'pd.get_dummies() dùng để làm gì?', options: ['Chuẩn hoá số về cùng thang', 'Mã hoá biến phân loại (categorical) thành các cột số 0/1', 'Xoá dòng trùng', 'Vẽ biểu đồ'], correctIndex: 1, explanation: 'get_dummies thực hiện one-hot encoding: biến mỗi giá trị hạng mục thành một cột 0/1.' },
]);

const c4 = doc('dsp391m-4-1-eda', 'Phase 4 — Exploratory analysis & visualisation|||Giai đoạn 4 — Phân tích khám phá & trực quan hoá',
  'EDA: phân phối, tương quan, phát hiện mẫu & giả thuyết; chọn đúng biểu đồ; tránh biểu đồ đánh lừa; kể chuyện bằng dữ liệu.',
  [[
    `<span class="eyebrow">DSP391m · Phase 4 · EDA</span>
<h2>Explore &amp; visualise</h2>
<p><strong>Exploratory Data Analysis (EDA)</strong> is how you build intuition and form hypotheses before modeling. You look at distributions, relationships and anomalies — and you let the data suggest which features matter.</p>
<h3>What to look at</h3>
<ul>
<li><strong>Univariate</strong> — histogram / box plot per variable (shape, spread, outliers).</li>
<li><strong>Bivariate</strong> — scatter, grouped bars; how does the target vary with each feature?</li>
<li><strong>Correlation</strong> — a heatmap of numeric features; spot redundancy and strong drivers.</li>
</ul>
<h3>Pick the chart for the question</h3>
<pre><code>Distribution of one number      -&gt; histogram / box plot
Compare a number across groups   -&gt; bar chart / box plot by group
Relationship between two numbers -&gt; scatter plot
Trend over time                  -&gt; line chart
Correlation among many numbers   -&gt; heatmap
</code></pre>
<h3>Honest visuals</h3>
<p>Charts persuade — so they must not mislead. Start bar-chart axes at zero, label units, avoid 3-D pie charts, and never cherry-pick a range that hides the trend. Correlation is not causation; say so.</p>
<div class="callout"><span class="badge">Deliverable</span> An EDA notebook with a short written finding under each key chart — "customers on the monthly plan churn 3x more than annual" — not just a wall of plots.</div>`,
    `<span class="eyebrow">DSP391m · Giai đoạn 4 · EDA</span>
<h2>Khám phá &amp; trực quan hoá</h2>
<p><strong>Phân tích khám phá dữ liệu (EDA)</strong> là cách bạn xây trực giác và hình thành giả thuyết trước khi mô hình hoá. Bạn nhìn phân phối, quan hệ và bất thường — và để dữ liệu gợi ý đặc trưng nào quan trọng.</p>
<h3>Nhìn cái gì</h3>
<ul>
<li><strong>Một biến (univariate)</strong> — histogram / box plot mỗi biến (hình dạng, độ trải, ngoại lệ).</li>
<li><strong>Hai biến (bivariate)</strong> — scatter, cột nhóm; mục tiêu thay đổi thế nào theo từng đặc trưng?</li>
<li><strong>Tương quan</strong> — heatmap các biến số; phát hiện dư thừa và yếu tố tác động mạnh.</li>
</ul>
<h3>Chọn biểu đồ theo câu hỏi</h3>
<pre><code>Phân phối một biến số        -&gt; histogram / box plot
So sánh một số qua các nhóm    -&gt; biểu đồ cột / box plot theo nhóm
Quan hệ giữa hai biến số       -&gt; scatter plot
Xu hướng theo thời gian        -&gt; biểu đồ đường
Tương quan giữa nhiều biến số  -&gt; heatmap
</code></pre>
<h3>Trực quan trung thực</h3>
<p>Biểu đồ có sức thuyết phục — nên không được đánh lừa. Trục biểu đồ cột bắt đầu từ 0, ghi đơn vị, tránh biểu đồ tròn 3-D, và đừng chọn khoảng dữ liệu che giấu xu hướng. Tương quan không phải nhân quả; hãy nói rõ điều đó.</p>
<div class="callout"><span class="badge">Sản phẩm nộp</span> Một notebook EDA kèm một nhận xét ngắn dưới mỗi biểu đồ quan trọng — "khách gói tháng rời bỏ gấp 3 lần khách gói năm" — chứ không phải một bức tường toàn biểu đồ.</div>`,
  ]]);

const c4q = quiz('dsp391m-quiz-4', 'Quiz 4 — EDA & visualisation|||Quiz 4 — EDA & trực quan', [
  { id: 'q1', question: 'EDA (phân tích khám phá dữ liệu) chủ yếu nhằm mục đích gì?', options: ['Triển khai mô hình lên server', 'Xây trực giác, phát hiện mẫu và hình thành giả thuyết trước khi mô hình hoá', 'Viết báo cáo cuối', 'Thu thập dữ liệu từ API'], correctIndex: 1, explanation: 'EDA giúp hiểu phân phối, quan hệ và bất thường để định hướng đặc trưng và mô hình.' },
  { id: 'q2', question: 'Muốn xem quan hệ giữa HAI biến số liên tục, biểu đồ nào phù hợp nhất?', options: ['Biểu đồ tròn', 'Scatter plot (biểu đồ phân tán)', 'Biểu đồ cột chồng', 'Bảng tần suất'], correctIndex: 1, explanation: 'Scatter plot cho thấy quan hệ/tương quan giữa hai biến số liên tục.' },
  { id: 'q3', question: 'Phát biểu nào ĐÚNG về trực quan hoá trung thực?', options: ['Trục biểu đồ cột nên bắt đầu từ 0 và ghi rõ đơn vị', 'Tương quan cao chứng minh quan hệ nhân quả', 'Biểu đồ tròn 3-D dễ đọc hơn', 'Nên chọn khoảng dữ liệu làm nổi kết luận mong muốn'], correctIndex: 0, explanation: 'Trục từ 0 và ghi đơn vị tránh gây hiểu lầm; tương quan ≠ nhân quả; không cắt xén dữ liệu.' },
]);

const c5 = doc('dsp391m-5-1-model', 'Phase 5 — Modeling & training|||Giai đoạn 5 — Xây dựng & huấn luyện mô hình',
  'Modeling (CRISP-DM): chọn thuật toán theo bài toán, baseline trước, train/validation, cross-validation, tránh overfit/underfit.',
  [[
    `<span class="eyebrow">DSP391m · Phase 5 · Modeling</span>
<h2>Build &amp; train the model</h2>
<p>Only now do you train models. In CRISP-DM this is <strong>Modeling</strong>. Start simple, get a working pipeline end-to-end, then improve.</p>
<h3>Start with a baseline</h3>
<p>Always fit a dumb baseline first — predict the majority class, or the mean. Every fancy model must beat it, or it is not worth the complexity.</p>
<h3>Match the algorithm to the task</h3>
<pre><code>Classification -&gt; Logistic Regression, Random Forest, Gradient Boosting
Regression     -&gt; Linear Regression, Random Forest, XGBoost
Clustering     -&gt; K-Means, DBSCAN
</code></pre>
<pre><code>from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2,
                                          stratify=y, random_state=42)
model = RandomForestClassifier(random_state=42)
scores = cross_val_score(model, X_tr, y_tr, cv=5, scoring="f1")
model.fit(X_tr, y_tr)
</code></pre>
<h3>Overfitting vs underfitting</h3>
<ul>
<li><strong>Overfit</strong> — great on train, poor on test; the model memorised noise. Fix: more data, simpler model, regularisation.</li>
<li><strong>Underfit</strong> — poor on both; the model is too simple. Fix: better features, a stronger model.</li>
<li><strong>Cross-validation</strong> gives a more reliable estimate than a single split.</li>
</ul>
<div class="callout"><span class="badge">Reproducibility</span> Set <code>random_state</code> everywhere and record library versions, so your reported numbers can be re-run at defense.</div>`,
    `<span class="eyebrow">DSP391m · Giai đoạn 5 · Mô hình hoá</span>
<h2>Xây dựng &amp; huấn luyện mô hình</h2>
<p>Đến giờ mới huấn luyện mô hình. Trong CRISP-DM đây là <strong>Modeling</strong>. Bắt đầu đơn giản, cho chạy thông toàn pipeline end-to-end, rồi mới cải thiện.</p>
<h3>Bắt đầu bằng baseline</h3>
<p>Luôn fit một baseline ngờ nghệch trước — đoán lớp đa số, hoặc đoán giá trị trung bình. Mọi mô hình phức tạp phải vượt được nó, nếu không thì độ phức tạp là vô ích.</p>
<h3>Khớp thuật toán với bài toán</h3>
<pre><code>Phân loại  -&gt; Logistic Regression, Random Forest, Gradient Boosting
Hồi quy    -&gt; Linear Regression, Random Forest, XGBoost
Phân cụm   -&gt; K-Means, DBSCAN
</code></pre>
<pre><code>from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2,
                                          stratify=y, random_state=42)
model = RandomForestClassifier(random_state=42)
scores = cross_val_score(model, X_tr, y_tr, cv=5, scoring="f1")
model.fit(X_tr, y_tr)
</code></pre>
<h3>Overfit và underfit</h3>
<ul>
<li><strong>Overfit (quá khớp)</strong> — tốt trên train, tệ trên test; mô hình học thuộc cả nhiễu. Sửa: thêm dữ liệu, mô hình đơn giản hơn, regularisation.</li>
<li><strong>Underfit (chưa khớp)</strong> — tệ cả hai; mô hình quá đơn giản. Sửa: đặc trưng tốt hơn, mô hình mạnh hơn.</li>
<li><strong>Cross-validation</strong> cho ước lượng đáng tin hơn một lần chia đơn lẻ.</li>
</ul>
<div class="callout"><span class="badge">Tái lập</span> Đặt <code>random_state</code> ở mọi nơi và ghi lại phiên bản thư viện, để các con số bạn báo cáo chạy lại được khi bảo vệ.</div>`,
  ]]);

const c5q = quiz('dsp391m-quiz-5', 'Quiz 5 — Modeling|||Quiz 5 — Mô hình hoá', [
  { id: 'q1', question: 'Vì sao nên xây một mô hình baseline (cơ sở) trước?', options: ['Vì nó luôn chính xác nhất', 'Để có mốc so sánh — mô hình phức tạp phải vượt được baseline mới đáng dùng', 'Vì baseline không cần dữ liệu', 'Để triển khai nhanh hơn'], correctIndex: 1, explanation: 'Baseline (đoán lớp đa số/giá trị trung bình) đặt mốc tối thiểu; mô hình phức tạp phải vượt nó.' },
  { id: 'q2', question: 'Mô hình tốt trên tập train nhưng tệ trên tập test là hiện tượng gì?', options: ['Underfitting', 'Overfitting (quá khớp)', 'Data leakage', 'Imputation'], correctIndex: 1, explanation: 'Overfitting: mô hình học thuộc cả nhiễu của train nên không tổng quát ra dữ liệu mới.' },
  { id: 'q3', question: 'Cross-validation (kiểm định chéo) đem lại lợi ích gì?', options: ['Loại bỏ mọi giá trị thiếu', 'Ước lượng hiệu năng đáng tin hơn so với một lần chia train/test đơn lẻ', 'Tăng tốc độ triển khai', 'Tự động vẽ biểu đồ'], correctIndex: 1, explanation: 'CV chia dữ liệu nhiều lần và lấy trung bình, giảm may rủi của một lần chia duy nhất.' },
]);

const c6 = doc('dsp391m-6-1-eval', 'Phase 6 — Evaluation, tuning & comparison|||Giai đoạn 6 — Đánh giá, tinh chỉnh & so sánh',
  'Evaluation (CRISP-DM): metric phân loại/hồi quy, confusion matrix, ROC/AUC; hyperparameter tuning (grid/random); so sánh & chọn mô hình cuối.',
  [[
    `<span class="eyebrow">DSP391m · Phase 6 · Evaluation</span>
<h2>Evaluate, tune &amp; compare</h2>
<p>In CRISP-DM <strong>Evaluation</strong> asks: does the model actually meet the business objective from Phase 1? Judge it on the <strong>held-out test set</strong>, with the metric you chose up front.</p>
<h3>Metrics that match the task</h3>
<pre><code>Classification: accuracy, precision, recall, F1, ROC-AUC
                confusion matrix (TP / FP / FN / TN)
Regression:     MAE, RMSE, R2
</code></pre>
<p><strong>Precision</strong> = of those we flagged, how many were right. <strong>Recall</strong> = of the real positives, how many we caught. The business decides which matters more (fraud → recall; spam → precision).</p>
<h3>Tune hyperparameters</h3>
<pre><code>from sklearn.model_selection import GridSearchCV
grid = {"n_estimators": [100, 300], "max_depth": [None, 10, 20]}
search = GridSearchCV(model, grid, cv=5, scoring="f1")
search.fit(X_tr, y_tr)
search.best_params_    # tune on train/validation, NOT on the test set
</code></pre>
<h3>Compare fairly</h3>
<p>Put every candidate in one table — same split, same metric — and pick the winner by score <em>and</em> by simplicity, speed and interpretability. Touch the test set <strong>once</strong>, at the very end.</p>
<div class="callout"><span class="badge">Trap</span> Tuning against the test set, or reporting the best of many runs, is a form of leakage. Use a separate validation set (or CV) for tuning; keep the test set sealed.</div>`,
    `<span class="eyebrow">DSP391m · Giai đoạn 6 · Đánh giá</span>
<h2>Đánh giá, tinh chỉnh &amp; so sánh</h2>
<p>Trong CRISP-DM, <strong>Evaluation</strong> đặt câu hỏi: mô hình có thực sự đạt mục tiêu kinh doanh từ Giai đoạn 1 không? Đánh giá trên <strong>tập test giữ riêng</strong>, bằng thước đo bạn đã chọn từ đầu.</p>
<h3>Thước đo khớp với bài toán</h3>
<pre><code>Phân loại: accuracy, precision, recall, F1, ROC-AUC
           confusion matrix (TP / FP / FN / TN)
Hồi quy:   MAE, RMSE, R2
</code></pre>
<p><strong>Precision</strong> = trong số ta gắn cờ, bao nhiêu đúng. <strong>Recall</strong> = trong số ca dương thật, ta bắt được bao nhiêu. Bài toán kinh doanh quyết định cái nào quan trọng hơn (gian lận → recall; spam → precision).</p>
<h3>Tinh chỉnh siêu tham số</h3>
<pre><code>from sklearn.model_selection import GridSearchCV
grid = {"n_estimators": [100, 300], "max_depth": [None, 10, 20]}
search = GridSearchCV(model, grid, cv=5, scoring="f1")
search.fit(X_tr, y_tr)
search.best_params_    # tinh chỉnh trên train/validation, KHÔNG trên test
</code></pre>
<h3>So sánh công bằng</h3>
<p>Đặt mọi ứng viên vào một bảng — cùng cách chia, cùng thước đo — và chọn quán quân theo điểm <em>và</em> theo độ đơn giản, tốc độ, khả năng diễn giải. Chỉ động vào tập test <strong>một lần duy nhất</strong>, ở cuối cùng.</p>
<div class="callout"><span class="badge">Bẫy</span> Tinh chỉnh dựa trên tập test, hoặc báo cáo kết quả tốt nhất trong nhiều lần chạy, cũng là một dạng rò rỉ. Dùng tập validation riêng (hoặc CV) để tinh chỉnh; giữ tập test niêm phong.</div>`,
  ]]);

const c6q = quiz('dsp391m-quiz-6', 'Quiz 6 — Evaluation & tuning|||Quiz 6 — Đánh giá & tinh chỉnh', [
  { id: 'q1', question: 'Recall (độ nhạy) đo lường điều gì?', options: ['Trong số ca ta gắn cờ dương, bao nhiêu đúng', 'Trong số ca dương thật, mô hình bắt được bao nhiêu', 'Sai số bình phương trung bình', 'Tỉ lệ dữ liệu thiếu'], correctIndex: 1, explanation: 'Recall = TP / (TP + FN): trong toàn bộ ca dương thật, mô hình phát hiện được bao nhiêu.' },
  { id: 'q2', question: 'Nên tinh chỉnh siêu tham số (hyperparameter tuning) dựa trên tập nào?', options: ['Tập test', 'Tập train/validation (hoặc cross-validation)', 'Toàn bộ dữ liệu gồm cả test', 'Dữ liệu production'], correctIndex: 1, explanation: 'Tinh chỉnh trên train/validation; tập test phải giữ niêm phong, chỉ dùng một lần ở cuối.' },
  { id: 'q3', question: 'Thước đo nào phù hợp cho bài toán HỒI QUY?', options: ['F1-score', 'ROC-AUC', 'RMSE (sai số căn bậc hai trung bình bình phương)', 'Confusion matrix'], correctIndex: 2, explanation: 'MAE, RMSE, R2 dùng cho hồi quy; F1/AUC/confusion matrix dùng cho phân loại.' },
]);

const c7 = doc('dsp391m-7-1-deploy', 'Phase 7 — Deployment, MLOps & dashboard|||Giai đoạn 7 — Triển khai, MLOps & dashboard',
  'Deployment (CRISP-DM): lưu mô hình, phục vụ qua API/dashboard (Streamlit/FastAPI), theo dõi thí nghiệm & phiên bản, giám sát drift.',
  [[
    `<span class="eyebrow">DSP391m · Phase 7 · Deployment</span>
<h2>Deploy the model &amp; build a dashboard</h2>
<p>A model in a notebook helps no one. CRISP-DM's final phase is <strong>Deployment</strong>: package the model so a real user can get a prediction. For a capstone, a small demo is enough — but do it properly.</p>
<h3>Save &amp; serve</h3>
<pre><code>import joblib
joblib.dump(model, "model.pkl")       # persist the trained model

# serve it — a Streamlit app or a FastAPI endpoint
loaded = joblib.load("model.pkl")
pred = loaded.predict(new_data)
</code></pre>
<ul>
<li><strong>Streamlit</strong> — fastest way to a clickable dashboard for a demo.</li>
<li><strong>FastAPI / Flask</strong> — a <code>/predict</code> REST endpoint other apps can call.</li>
<li><strong>Docker</strong> — package app + dependencies so it runs the same anywhere.</li>
</ul>
<h3>A taste of MLOps</h3>
<ul>
<li><strong>Experiment tracking</strong> — log params, metrics and artifacts (MLflow) so results are reproducible.</li>
<li><strong>Versioning</strong> — version the data and the model, not just the code.</li>
<li><strong>Monitoring</strong> — watch for <strong>data drift</strong>: inputs in production drift away from training data and accuracy silently rots. Plan a retraining trigger.</li>
</ul>
<div class="callout"><span class="badge">Reproducible env</span> Pin dependencies (<code>requirements.txt</code>) and preprocess inputs with the <em>same</em> pipeline you fit in training — a mismatch between train and serve preprocessing is a classic production bug.</div>`,
    `<span class="eyebrow">DSP391m · Giai đoạn 7 · Triển khai</span>
<h2>Triển khai mô hình &amp; dựng dashboard</h2>
<p>Một mô hình nằm trong notebook chẳng giúp được ai. Giai đoạn cuối của CRISP-DM là <strong>Deployment</strong>: đóng gói mô hình để người dùng thật lấy được dự đoán. Với đồ án, một bản demo nhỏ là đủ — nhưng làm cho đàng hoàng.</p>
<h3>Lưu &amp; phục vụ</h3>
<pre><code>import joblib
joblib.dump(model, "model.pkl")       # lưu mô hình đã huấn luyện

# phục vụ nó — app Streamlit hoặc endpoint FastAPI
loaded = joblib.load("model.pkl")
pred = loaded.predict(new_data)
</code></pre>
<ul>
<li><strong>Streamlit</strong> — cách nhanh nhất để có dashboard bấm được cho demo.</li>
<li><strong>FastAPI / Flask</strong> — một endpoint REST <code>/predict</code> để app khác gọi.</li>
<li><strong>Docker</strong> — đóng gói app + phụ thuộc để chạy y hệt ở mọi nơi.</li>
</ul>
<h3>Nếm thử MLOps</h3>
<ul>
<li><strong>Theo dõi thí nghiệm</strong> — ghi tham số, thước đo và artifact (MLflow) để kết quả tái lập được.</li>
<li><strong>Quản lý phiên bản</strong> — version cả dữ liệu và mô hình, không chỉ mã nguồn.</li>
<li><strong>Giám sát</strong> — canh <strong>trôi dữ liệu (data drift)</strong>: đầu vào ở production dần lệch khỏi dữ liệu huấn luyện và độ chính xác âm thầm suy giảm. Hãy lên kế hoạch kích hoạt huấn luyện lại.</li>
</ul>
<div class="callout"><span class="badge">Môi trường tái lập</span> Ghim phụ thuộc (<code>requirements.txt</code>) và tiền xử lý đầu vào bằng <em>đúng</em> pipeline đã fit khi huấn luyện — lệch tiền xử lý giữa train và serve là lỗi production kinh điển.</div>`,
  ]]);

const c7q = quiz('dsp391m-quiz-7', 'Quiz 7 — Deployment & MLOps|||Quiz 7 — Triển khai & MLOps', [
  { id: 'q1', question: 'Công cụ nào phù hợp nhất để dựng nhanh một dashboard bấm được cho demo mô hình?', options: ['pandas', 'Streamlit', 'NumPy', 'Matplotlib'], correctIndex: 1, explanation: 'Streamlit biến script Python thành app web tương tác rất nhanh, hợp cho demo đồ án.' },
  { id: 'q2', question: 'Data drift (trôi dữ liệu) trong production là gì?', options: ['Dữ liệu bị mất khi lưu', 'Phân bố đầu vào ở production dần lệch khỏi dữ liệu huấn luyện, làm độ chính xác giảm', 'Mô hình chạy quá chậm', 'Thiếu thư viện phụ thuộc'], correctIndex: 1, explanation: 'Khi dữ liệu thực tế thay đổi so với lúc train, mô hình mất chính xác dần → cần giám sát và huấn luyện lại.' },
  { id: 'q3', question: 'Vì sao phải dùng CÙNG pipeline tiền xử lý khi train và khi phục vụ (serve)?', options: ['Để tiết kiệm bộ nhớ', 'Vì lệch tiền xử lý giữa train và serve khiến mô hình nhận đầu vào khác định dạng và cho kết quả sai', 'Để tăng tốc GridSearch', 'Vì joblib bắt buộc'], correctIndex: 1, explanation: 'Nếu serve xử lý đầu vào khác lúc train, mô hình nhận dữ liệu sai định dạng/thang → dự đoán sai, một lỗi production kinh điển.' },
]);

const c8 = doc('dsp391m-8-1-report', 'Phase 8 — Report, storytelling, defense & ethics|||Giai đoạn 8 — Báo cáo, kể chuyện, bảo vệ & đạo đức',
  'Truyền đạt kết quả: cấu trúc báo cáo, data storytelling cho stakeholder; bảo vệ đồ án; đạo đức dữ liệu (bias, quyền riêng tư, minh bạch).',
  [[
    `<span class="eyebrow">DSP391m · Phase 8 · Communicate</span>
<h2>Report, storytelling, defense &amp; ethics</h2>
<p>The best analysis is worthless if no one understands or trusts it. This final stage is about <strong>communication</strong> — and about doing the whole thing responsibly.</p>
<h3>Structure the report</h3>
<pre><code>1. Problem &amp; objective      -- what &amp; why (from Phase 1)
2. Data &amp; method            -- sources, cleaning, features
3. Results                   -- metrics vs the success criterion
4. Insights &amp; recommendation -- what should the business DO?
5. Limitations &amp; ethics     -- what could go wrong, and fairness
</code></pre>
<h3>Tell a story, not a dump</h3>
<p>Lead with the finding, not the method. A stakeholder wants <em>"we can catch 80% of churners a month ahead, worth ~X in saved revenue"</em> — the confusion matrix goes in an appendix. Every chart earns its place with one clear takeaway.</p>
<h3>Defend it</h3>
<p>Expect questions on your choices: why this metric, why this model, how you avoided leakage, what the limitations are. Knowing your <strong>limitations</strong> and stating them plainly builds more trust than pretending the model is perfect.</p>
<h3>Data ethics — not optional</h3>
<ul>
<li><strong>Bias &amp; fairness</strong> — does the model treat groups unequally? Check performance per subgroup.</li>
<li><strong>Privacy</strong> — anonymise personal data; only use data you are allowed to.</li>
<li><strong>Transparency</strong> — be able to explain a prediction; document assumptions and risks.</li>
</ul>
<div class="callout"><span class="badge">Deliverable</span> A final report + slide deck + live demo. Rehearse the defense; time it; prepare answers to "what if the data is biased?" and "how would this fail in production?"</div>`,
    `<span class="eyebrow">DSP391m · Giai đoạn 8 · Truyền đạt</span>
<h2>Báo cáo, kể chuyện, bảo vệ &amp; đạo đức</h2>
<p>Phân tích hay đến mấy cũng vô giá trị nếu không ai hiểu hoặc tin. Giai đoạn cuối này nói về <strong>truyền đạt</strong> — và làm mọi thứ một cách có trách nhiệm.</p>
<h3>Cấu trúc báo cáo</h3>
<pre><code>1. Bài toán &amp; mục tiêu      -- cái gì &amp; vì sao (từ Giai đoạn 1)
2. Dữ liệu &amp; phương pháp    -- nguồn, làm sạch, đặc trưng
3. Kết quả                   -- thước đo so với tiêu chí thành công
4. Nhận định &amp; khuyến nghị  -- doanh nghiệp nên LÀM gì?
5. Giới hạn &amp; đạo đức       -- điều gì có thể sai, và tính công bằng
</code></pre>
<h3>Kể một câu chuyện, đừng đổ số liệu</h3>
<p>Mở đầu bằng phát hiện, không phải phương pháp. Stakeholder muốn nghe <em>"ta có thể bắt 80% khách sắp rời trước một tháng, tương đương ~X doanh thu giữ lại được"</em> — còn confusion matrix để ở phụ lục. Mỗi biểu đồ phải xứng đáng với một thông điệp rõ ràng.</p>
<h3>Bảo vệ đồ án</h3>
<p>Hãy lường trước câu hỏi về lựa chọn của bạn: vì sao thước đo này, vì sao mô hình này, làm sao tránh rò rỉ, giới hạn là gì. Biết rõ <strong>giới hạn</strong> và nói thẳng chúng tạo được nhiều niềm tin hơn là giả vờ mô hình hoàn hảo.</p>
<h3>Đạo đức dữ liệu — không phải tuỳ chọn</h3>
<ul>
<li><strong>Thiên lệch &amp; công bằng</strong> — mô hình có đối xử bất bình đẳng giữa các nhóm không? Kiểm hiệu năng theo từng nhóm nhỏ.</li>
<li><strong>Quyền riêng tư</strong> — ẩn danh dữ liệu cá nhân; chỉ dùng dữ liệu được phép.</li>
<li><strong>Minh bạch</strong> — giải thích được một dự đoán; ghi rõ giả định và rủi ro.</li>
</ul>
<div class="callout"><span class="badge">Sản phẩm nộp</span> Báo cáo cuối + bộ slide + demo trực tiếp. Tập bảo vệ; canh giờ; chuẩn bị trả lời "nếu dữ liệu thiên lệch thì sao?" và "mô hình này sẽ hỏng thế nào ở production?"</div>`,
  ]]);

const c8q = quiz('dsp391m-quiz-8', 'Quiz 8 — Report & ethics|||Quiz 8 — Báo cáo & đạo đức', [
  { id: 'q1', question: 'Data storytelling tốt cho stakeholder nên bắt đầu bằng gì?', options: ['Confusion matrix chi tiết', 'Phát hiện/khuyến nghị chính và giá trị kinh doanh', 'Mã nguồn tiền xử lý', 'Danh sách siêu tham số'], correctIndex: 1, explanation: 'Dẫn dắt bằng phát hiện và giá trị kinh doanh; chi tiết kỹ thuật để ở phụ lục.' },
  { id: 'q2', question: 'Vì sao nên nêu rõ GIỚI HẠN của mô hình khi bảo vệ?', options: ['Để giấu lỗi', 'Vì nói thẳng giới hạn tạo niềm tin hơn là giả vờ mô hình hoàn hảo', 'Vì rubric cấm nói kết quả tốt', 'Để kéo dài thời gian trình bày'], correctIndex: 1, explanation: 'Hiểu và trình bày trung thực giới hạn cho thấy tư duy phản biện và xây dựng niềm tin của hội đồng.' },
  { id: 'q3', question: 'Kiểm "công bằng (fairness)" trong đạo đức dữ liệu nghĩa là gì?', options: ['Kiểm xem mô hình chạy nhanh không', 'Kiểm xem mô hình có đối xử bất bình đẳng/hiệu năng khác nhau giữa các nhóm không', 'Kiểm dung lượng file mô hình', 'Kiểm số dòng dữ liệu'], correctIndex: 1, explanation: 'Fairness xét mô hình có thiên lệch với nhóm nào không, thường bằng cách so hiệu năng theo từng nhóm nhỏ.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'DSP391m',
    slug: 'dsp391m-data-science-capstone-project',
    title: 'Data Science - Capstone Project',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DSP391m.webp',
    shortDescription: 'End-to-end data science capstone: a real problem through CRISP-DM — framing, data & EDA, cleaning, modeling, evaluation, deployment & the final report. Bilingual, Python examples & quizzes.|||Đồ án tốt nghiệp KHDL end-to-end: một bài toán thật qua CRISP-DM — xác định, dữ liệu & EDA, làm sạch, mô hình, đánh giá, triển khai & báo cáo. Song ngữ, ví dụ Python & quiz.',
    description: 'Môn <strong>DSP391m — Data Science - Capstone Project</strong> (Đồ án tốt nghiệp Khoa học dữ liệu, kỳ 8, ngành Hệ thống thông tin) là nơi bạn <strong>chứng minh</strong> khả năng đưa một bài toán thật đi trọn <strong>quy trình dự án khoa học dữ liệu end-to-end</strong> theo <strong>CRISP-DM</strong>. Khung gồm 8 giai đoạn: <strong>xác định bài toán &amp; mục tiêu kinh doanh</strong> → <strong>thu thập &amp; hiểu dữ liệu</strong> → <strong>làm sạch &amp; tạo đặc trưng</strong> → <strong>phân tích khám phá (EDA) &amp; trực quan hoá</strong> → <strong>xây dựng &amp; huấn luyện mô hình</strong> → <strong>đánh giá, tinh chỉnh &amp; so sánh</strong> → <strong>triển khai (MLOps) &amp; dashboard</strong> → <strong>báo cáo, kể chuyện, bảo vệ &amp; đạo đức dữ liệu</strong>. Song ngữ, có ví dụ Python và quiz mỗi giai đoạn. Tham khảo: McKinney, Géron, CRISP-DM, Kaggle.',
    whatYouLearn: 'Xác định bài toán & thước đo thành công (SMART); thu thập dữ liệu (CSV/SQL/API), data dictionary, phát hiện rò rỉ; làm sạch, mã hoá, scaling, feature engineering, tách train/test đúng cách; EDA & chọn biểu đồ; baseline, chọn thuật toán, cross-validation, overfit/underfit; metric (precision/recall/F1/AUC, MAE/RMSE/R2), confusion matrix, tinh chỉnh siêu tham số; triển khai bằng Streamlit/FastAPI, joblib, MLOps (tracking, versioning, data drift); báo cáo, data storytelling, bảo vệ đồ án và đạo đức dữ liệu (bias, quyền riêng tư, minh bạch).',
    requirements: 'Đã học các môn nền về Python, thống kê, cơ sở dữ liệu và học máy (xem điều kiện tiên quyết của ngành Hệ thống thông tin trên FLM). Nên cài Python + Jupyter, pandas, scikit-learn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Đề bài & rubric trên FLM, sách (McKinney, Géron), CRISP-DM, Kaggle, công cụ, lộ trình đồ án.', lessons: [taiLieu] },
    { title: 'Giới thiệu đồ án|||Capstone introduction', description: 'Capstone là gì, sản phẩm nộp, rubric, lộ trình 8 giai đoạn CRISP-DM.', lessons: [intro] },
    { title: 'Giai đoạn 1 — Bài toán & mục tiêu|||Phase 1 — Problem & objective', description: 'Business understanding, loại bài toán, success metric, scope.', lessons: [c1, c1q] },
    { title: 'Giai đoạn 2 — Thu thập & hiểu dữ liệu|||Phase 2 — Data collection', description: 'Nguồn dữ liệu, data dictionary, kiểm chất lượng, rò rỉ.', lessons: [c2, c2q] },
    { title: 'Giai đoạn 3 — Làm sạch & đặc trưng|||Phase 3 — Cleaning & features', description: 'Xử lý thiếu/ngoại lệ, mã hoá, scaling, feature engineering, split.', lessons: [c3, c3q] },
    { title: 'Giai đoạn 4 — EDA & trực quan hoá|||Phase 4 — EDA & visualisation', description: 'Phân phối, tương quan, chọn biểu đồ, trực quan trung thực.', lessons: [c4, c4q] },
    { title: 'Giai đoạn 5 — Mô hình hoá|||Phase 5 — Modeling', description: 'Baseline, chọn thuật toán, cross-validation, overfit/underfit.', lessons: [c5, c5q] },
    { title: 'Giai đoạn 6 — Đánh giá & tinh chỉnh|||Phase 6 — Evaluation & tuning', description: 'Metric, confusion matrix, ROC/AUC, tuning, so sánh mô hình.', lessons: [c6, c6q] },
    { title: 'Giai đoạn 7 — Triển khai & MLOps|||Phase 7 — Deployment & MLOps', description: 'Lưu/phục vụ mô hình, Streamlit/FastAPI, tracking, data drift.', lessons: [c7, c7q] },
    { title: 'Giai đoạn 8 — Báo cáo & đạo đức|||Phase 8 — Report & ethics', description: 'Cấu trúc báo cáo, storytelling, bảo vệ, đạo đức dữ liệu.', lessons: [c8, c8q] },
  ],
};
