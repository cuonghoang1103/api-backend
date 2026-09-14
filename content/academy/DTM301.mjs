/**
 * DTM301 — Data Mining and Predictive Analytics. Khối Quản trị Kinh doanh
 * (BBA), FPTU, Kỳ 4. Giáo trình tham khảo: Han/Kamber/Pei "Data Mining:
 * Concepts and Techniques"; Provost & Fawcett "Data Science for Business";
 * Witten "Data Mining" (WEKA); Shmueli "Data Mining for Business Analytics".
 * Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dtm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo (Han/Kamber/Pei, Provost & Fawcett, Witten, Shmueli), công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">DTM301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Data Mining and Predictive Analytics</strong> — the CRISP-DM process, preprocessing, classification, regression, clustering, association rules, model evaluation and business applications — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are the reference books cited throughout this course plus free tools.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DTM301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (cited in this course)</h3>
<ul>
<li>Han, Kamber &amp; Pei — <em>Data Mining: Concepts and Techniques</em> — the classic reference on classification, clustering and association rule mining.</li>
<li>Provost &amp; Fawcett — <em>Data Science for Business</em> — how mining techniques translate into business decisions (churn, targeting, value).</li>
<li>Witten, Frank &amp; Hall — <em>Data Mining: Practical Machine Learning Tools and Techniques</em> — companion to the <strong>WEKA</strong> toolkit.</li>
<li>Shmueli, Bruce &amp; Patel — <em>Data Mining for Business Analytics</em> — business-analytics framing with worked spreadsheet/R examples.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.cs.waikato.ac.nz/ml/weka/" target="_blank" rel="noopener">WEKA (University of Waikato)</a> — free GUI data mining workbench used with the Witten textbook.</li>
<li><a href="https://scikit-learn.org/stable/" target="_blank" rel="noopener">scikit-learn documentation</a> — Python reference for every algorithm in this course.</li>
<li><a href="https://archive.ics.uci.edu/" target="_blank" rel="noopener">UCI Machine Learning Repository</a> — free datasets for practice (churn, retail baskets, credit).</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — decision trees, kNN, clustering, evaluation metrics explained visually.</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — geometric intuition behind the linear algebra/statistics used in mining.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.cs.waikato.ac.nz/ml/weka/" target="_blank" rel="noopener">WEKA</a> — point-and-click mining on the classic textbook datasets.</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — free Python/pandas/scikit-learn notebooks, no local setup.</li>
<li><a href="https://orangedatamining.com/" target="_blank" rel="noopener">Orange Data Mining</a> — visual, drag-and-drop workflow builder good for business analytics students.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — CRISP-DM steps, data quality &amp; preprocessing, the difference between classification and clustering.</li>
<li><strong>Practice</strong> — run decision tree, kNN and k-means on a small dataset in WEKA or scikit-learn; read the confusion matrix.</li>
<li><strong>Go deeper</strong> — association rules on a basket dataset, regression forecasting, cross-validation and overfitting.</li>
<li><strong>Job-ready</strong> — frame a real business problem (churn, segmentation, sales forecast) as a mining task and defend the ethics of the data used.</li>
</ol></div>`,
    `<span class="eyebrow">DTM301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Khai phá dữ liệu và Phân tích dự báo</strong> — quy trình CRISP-DM, tiền xử lý, phân lớp, hồi quy, phân cụm, luật kết hợp, đánh giá mô hình và ứng dụng kinh doanh — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là các sách được trích dẫn trong môn cùng công cụ miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DTM301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (được trích dẫn trong môn)</h3>
<ul>
<li>Han, Kamber &amp; Pei — <em>Data Mining: Concepts and Techniques</em> — tài liệu kinh điển về phân lớp, phân cụm và luật kết hợp.</li>
<li>Provost &amp; Fawcett — <em>Data Science for Business</em> — cách kỹ thuật khai phá chuyển thành quyết định kinh doanh (churn, nhắm mục tiêu, giá trị khách hàng).</li>
<li>Witten, Frank &amp; Hall — <em>Data Mining: Practical Machine Learning Tools and Techniques</em> — sách đi kèm bộ công cụ <strong>WEKA</strong>.</li>
<li>Shmueli, Bruce &amp; Patel — <em>Data Mining for Business Analytics</em> — góc nhìn phân tích kinh doanh, ví dụ minh hoạ bằng bảng tính/R.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.cs.waikato.ac.nz/ml/weka/" target="_blank" rel="noopener">WEKA (Đại học Waikato)</a> — bộ công cụ khai phá dữ liệu miễn phí, dùng kèm sách Witten.</li>
<li><a href="https://scikit-learn.org/stable/" target="_blank" rel="noopener">Tài liệu scikit-learn</a> — tham khảo Python cho mọi giải thuật trong môn.</li>
<li><a href="https://archive.ics.uci.edu/" target="_blank" rel="noopener">UCI Machine Learning Repository</a> — dữ liệu miễn phí để luyện tập (churn, giỏ hàng bán lẻ, tín dụng).</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — cây quyết định, kNN, phân cụm, chỉ số đánh giá giải thích trực quan.</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — trực giác hình học của đại số/thống kê dùng trong khai phá dữ liệu.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.cs.waikato.ac.nz/ml/weka/" target="_blank" rel="noopener">WEKA</a> — khai phá bằng chuột trên các bộ dữ liệu kinh điển của sách.</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — notebook Python/pandas/scikit-learn miễn phí, không cần cài đặt.</li>
<li><a href="https://orangedatamining.com/" target="_blank" rel="noopener">Orange Data Mining</a> — dựng quy trình kéo-thả trực quan, hợp với sinh viên phân tích kinh doanh.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — các bước CRISP-DM, chất lượng &amp; tiền xử lý dữ liệu, phân biệt phân lớp và phân cụm.</li>
<li><strong>Luyện tập</strong> — chạy cây quyết định, kNN và k-means trên một bộ dữ liệu nhỏ bằng WEKA hoặc scikit-learn; đọc ma trận nhầm lẫn.</li>
<li><strong>Đào sâu</strong> — luật kết hợp trên dữ liệu giỏ hàng, hồi quy dự báo, kiểm định chéo và overfitting.</li>
<li><strong>Sẵn sàng đi làm</strong> — đóng khung một bài toán kinh doanh thật (churn, phân khúc, dự báo bán hàng) thành bài toán khai phá và bảo vệ được tính đạo đức của dữ liệu dùng.</li>
</ol></div>`,
  ]]);

const intro = doc('dtm301-0-1-overview', 'Course overview: Data Mining and Predictive Analytics|||Tổng quan: Khai phá dữ liệu và Phân tích dự báo',
  'Data mining là gì, vì sao doanh nghiệp cần; lộ trình môn: quy trình CRISP-DM → tiền xử lý → phân lớp/hồi quy/phân cụm/luật kết hợp → đánh giá mô hình → ứng dụng kinh doanh & đạo đức.',
  [[
    `<span class="eyebrow">DTM301 · Lesson 0.1 · Overview</span>
<h2>Data Mining and Predictive Analytics</h2>
<p class="lead">This course teaches you to turn <strong>raw business data</strong> — transactions, customer records, sales history — into <strong>decisions</strong>: who is likely to churn, which customers look alike, which products sell together, what next quarter's demand will be. It bridges statistics, algorithms and business judgment.</p>
<h3>What is data mining?</h3>
<p><strong>Data mining</strong> is the process of discovering useful patterns and building predictive models from large datasets — patterns too subtle or too voluminous for a human to spot by eye. <strong>Predictive analytics</strong> is the applied side: using those patterns to estimate an unknown outcome (will this customer buy, default, or leave?).</p>
<h3>Roadmap</h3>
<p>The <strong>CRISP-DM</strong> process (Ch.1) frames every project → <strong>data preprocessing</strong> (Ch.2, the step that eats most of a real project's time) → the core algorithm families: <strong>classification</strong> (Ch.3), <strong>regression &amp; forecasting</strong> (Ch.4), <strong>clustering</strong> (Ch.5), <strong>association rules</strong> (Ch.6) → how to tell if a model is actually good, <strong>evaluation &amp; overfitting</strong> (Ch.7) → and finally, putting it to work: <strong>business applications &amp; data ethics</strong> (Ch.8).</p>
<div class="callout"><span class="badge">Why BBA students need this</span> You won't necessarily code the algorithm from scratch on the job — but you will brief the data team, judge whether a churn model is trustworthy, and decide whether a "predictive" claim is real or marketing. This course gives you that literacy.</div>`,
    `<span class="eyebrow">DTM301 · Bài 0.1 · Tổng quan</span>
<h2>Khai phá dữ liệu và Phân tích dự báo</h2>
<p class="lead">Môn này dạy bạn biến <strong>dữ liệu thô của doanh nghiệp</strong> — giao dịch, hồ sơ khách hàng, lịch sử bán hàng — thành <strong>quyết định</strong>: khách nào sắp rời bỏ (churn), khách nào giống nhau, sản phẩm nào thường mua cùng nhau, nhu cầu quý tới sẽ ra sao. Môn bắc cầu giữa thống kê, giải thuật và óc kinh doanh.</p>
<h3>Data mining là gì?</h3>
<p><strong>Khai phá dữ liệu (data mining)</strong> là quá trình tìm ra các quy luật hữu ích và dựng mô hình dự báo từ tập dữ liệu lớn — những quy luật quá nhỏ hoặc quá nhiều để con người nhìn bằng mắt mà thấy được. <strong>Phân tích dự báo (predictive analytics)</strong> là phần ứng dụng: dùng các quy luật đó để ước lượng một kết quả chưa biết (khách này có mua, có vỡ nợ, hay sẽ rời bỏ?).</p>
<h3>Lộ trình</h3>
<p>Quy trình <strong>CRISP-DM</strong> (Chương 1) làm khung cho mọi dự án → <strong>tiền xử lý dữ liệu</strong> (Chương 2, bước chiếm nhiều thời gian nhất của một dự án thật) → các nhóm giải thuật cốt lõi: <strong>phân lớp</strong> (Chương 3), <strong>hồi quy &amp; dự báo</strong> (Chương 4), <strong>phân cụm</strong> (Chương 5), <strong>luật kết hợp</strong> (Chương 6) → làm sao biết một mô hình có tốt thật, <strong>đánh giá mô hình &amp; overfitting</strong> (Chương 7) → và cuối cùng, đưa vào thực tế: <strong>ứng dụng kinh doanh &amp; đạo đức dữ liệu</strong> (Chương 8).</p>
<div class="callout"><span class="badge">Vì sao sinh viên QTKD cần môn này</span> Đi làm bạn không nhất thiết tự viết giải thuật từ đầu — nhưng bạn sẽ đặt bài cho team dữ liệu, đánh giá một mô hình churn có đáng tin không, và phân biệt một tuyên bố "dự báo được" là thật hay chỉ là marketing. Môn này cho bạn năng lực đó.</div>`,
  ]]);

const c1 = doc('dtm301-1-1-overview-crispdm', '1.1 — Data mining overview & the CRISP-DM process|||1.1 — Tổng quan data mining & quy trình CRISP-DM',
  'Data mining trong bức tranh KDD; 6 giai đoạn CRISP-DM (Business Understanding → Data Understanding → Data Preparation → Modeling → Evaluation → Deployment); vòng lặp, không phải đường thẳng.',
  [[
    `<span class="eyebrow">DTM301 · Chapter 1 · Lesson 1.1</span>
<h2>Data mining overview &amp; the CRISP-DM process</h2>
<h3>KDD vs. data mining</h3>
<p><strong>KDD (Knowledge Discovery in Databases)</strong> is the whole pipeline — from raw data to actionable knowledge. <strong>Data mining</strong> is the modeling step inside that pipeline: applying algorithms (classification, clustering, association rules, regression) to extract patterns. Han/Kamber/Pei frame data mining this way: it is one stage of KDD, not the entire process.</p>
<h3>CRISP-DM — the industry-standard process</h3>
<p><strong>CRISP-DM (Cross-Industry Standard Process for Data Mining)</strong> breaks a project into six phases:</p>
<ol>
<li><strong>Business Understanding</strong> — what business question are we answering? (e.g. "reduce customer churn by 10%")</li>
<li><strong>Data Understanding</strong> — what data exists, how much, how clean, does it even cover the question?</li>
<li><strong>Data Preparation</strong> — clean, transform, select features (usually 60-80% of project time — see Chapter 2).</li>
<li><strong>Modeling</strong> — apply mining techniques (classification, clustering, regression, association rules).</li>
<li><strong>Evaluation</strong> — does the model actually answer the business question, not just score well on a metric?</li>
<li><strong>Deployment</strong> — put the model to work: a dashboard, a scoring pipeline, a decision rule.</li>
</ol>
<pre><code>CRISP-DM is a LOOP, not a line:
 Business Understanding -&gt;&gt; Data Understanding -&gt;&gt; Data Preparation
        ^                                                |
        |                                                v
   Deployment  &lt;&lt;-  Evaluation  &lt;&lt;-  Modeling
(arrows go back whenever a phase reveals the previous one was wrong)
</code></pre>
<div class="callout"><span class="badge">Common mistake</span> Jumping straight to Modeling before Business Understanding produces a technically correct model that answers the wrong question — the single most common reason real mining projects fail.</div>`,
    `<span class="eyebrow">DTM301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan data mining &amp; quy trình CRISP-DM</h2>
<h3>KDD và data mining</h3>
<p><strong>KDD (Knowledge Discovery in Databases — Khai phá tri thức trong CSDL)</strong> là toàn bộ chuỗi xử lý — từ dữ liệu thô tới tri thức có thể hành động. <strong>Data mining</strong> là bước dựng mô hình bên trong chuỗi đó: áp giải thuật (phân lớp, phân cụm, luật kết hợp, hồi quy) để rút ra quy luật. Han/Kamber/Pei mô tả data mining theo cách này: nó là MỘT giai đoạn của KDD, không phải toàn bộ quá trình.</p>
<h3>CRISP-DM — quy trình chuẩn công nghiệp</h3>
<p><strong>CRISP-DM (Cross-Industry Standard Process for Data Mining)</strong> chia một dự án thành sáu giai đoạn:</p>
<ol>
<li><strong>Hiểu bài toán kinh doanh (Business Understanding)</strong> — đang trả lời câu hỏi kinh doanh nào? (vd "giảm 10% khách rời bỏ")</li>
<li><strong>Hiểu dữ liệu (Data Understanding)</strong> — có dữ liệu gì, nhiều bao nhiêu, sạch tới đâu, có phủ được câu hỏi không?</li>
<li><strong>Chuẩn bị dữ liệu (Data Preparation)</strong> — làm sạch, biến đổi, chọn đặc trưng (thường chiếm 60-80% thời gian dự án — xem Chương 2).</li>
<li><strong>Dựng mô hình (Modeling)</strong> — áp kỹ thuật khai phá (phân lớp, phân cụm, hồi quy, luật kết hợp).</li>
<li><strong>Đánh giá (Evaluation)</strong> — mô hình có thực sự trả lời được câu hỏi kinh doanh, không chỉ đạt điểm số cao?</li>
<li><strong>Triển khai (Deployment)</strong> — đưa mô hình vào vận hành: một dashboard, một pipeline chấm điểm, một quy tắc quyết định.</li>
</ol>
<pre><code>CRISP-DM là một VÒNG LẶP, không phải đường thẳng:
 Hiểu kinh doanh -&gt;&gt; Hiểu dữ liệu -&gt;&gt; Chuẩn bị dữ liệu
      ^                                        |
      |                                        v
 Triển khai  &lt;&lt;-  Đánh giá  &lt;&lt;-  Dựng mô hình
(mũi tên quay lại mỗi khi một giai đoạn cho thấy giai đoạn trước đã sai)
</code></pre>
<div class="callout"><span class="badge">Lỗi thường gặp</span> Nhảy thẳng vào Dựng mô hình mà bỏ qua Hiểu kinh doanh cho ra một mô hình đúng về kỹ thuật nhưng trả lời sai câu hỏi — lý do phổ biến nhất khiến dự án khai phá dữ liệu thật thất bại.</div>`,
  ]]);

const c1q = quiz('dtm301-quiz-1', 'Quiz 1 — Overview & CRISP-DM|||Quiz 1 — Tổng quan & CRISP-DM', [
  { id: 'q1', question: 'Trong CRISP-DM, giai đoạn nào thường chiếm nhiều thời gian nhất của một dự án thật?', options: ['Business Understanding', 'Data Preparation', 'Deployment', 'Evaluation'], correctIndex: 1, explanation: 'Chuẩn bị/làm sạch dữ liệu thường chiếm 60-80% thời gian dự án khai phá dữ liệu.' },
  { id: 'q2', question: 'Data mining quan hệ với KDD như thế nào?', options: ['Data mining là toàn bộ KDD', 'Data mining là một giai đoạn (dựng mô hình) trong KDD', 'KDD chỉ dùng cho dữ liệu văn bản', 'Hai khái niệm không liên quan'], correctIndex: 1, explanation: 'KDD là toàn chuỗi từ dữ liệu thô tới tri thức; data mining là bước áp giải thuật rút quy luật bên trong đó.' },
  { id: 'q3', question: 'Vì sao CRISP-DM được vẽ như một VÒNG LẶP chứ không phải đường thẳng?', options: ['Vì phải chạy đúng 6 lần', 'Vì một giai đoạn sau có thể cho thấy cần quay lại sửa giai đoạn trước', 'Vì dữ liệu luôn bị mất', 'Vì mô hình luôn phải huấn luyện lại mỗi ngày'], correctIndex: 1, explanation: 'Ví dụ: Evaluation phát hiện mô hình không trả lời đúng câu hỏi kinh doanh → quay lại Business Understanding.' },
]);

const c2 = doc('dtm301-2-1-preprocessing', '2.1 — Data preprocessing & cleaning|||2.1 — Tiền xử lý & làm sạch dữ liệu',
  'Vì sao "garbage in, garbage out"; xử lý missing values, ngoại lai (outliers), trùng lặp; chuẩn hoá (normalization), rời rạc hoá; chọn/tạo đặc trưng (feature selection & engineering).',
  [[
    `<span class="eyebrow">DTM301 · Chapter 2 · Lesson 2.1</span>
<h2>Data preprocessing &amp; cleaning</h2>
<h3>Garbage in, garbage out</h3>
<p>Real-world data is <strong>incomplete</strong> (missing values), <strong>noisy</strong> (errors, outliers) and <strong>inconsistent</strong> (different formats, duplicate records). No algorithm — however clever — produces a trustworthy model from dirty data. This is why Han/Kamber/Pei devote an entire chapter to preprocessing before any mining technique.</p>
<h3>Core preprocessing tasks</h3>
<ul>
<li><strong>Missing values</strong> — delete the record, delete the attribute, or <strong>impute</strong> (fill with mean/median/mode, or a model-based estimate).</li>
<li><strong>Outliers &amp; noise</strong> — values far outside the normal range (e.g. an age of 200). Detect with simple rules (z-score, IQR) or domain knowledge; decide to remove, cap, or investigate (an outlier can also be the fraud case you're looking for).</li>
<li><strong>Duplicates &amp; inconsistency</strong> — the same customer entered twice with different spellings; dates in two formats. Must be reconciled before analysis.</li>
<li><strong>Normalization</strong> — rescale numeric attributes (e.g. min-max to [0,1], or z-score) so one attribute with a huge range (income) doesn't dominate a distance-based algorithm (kNN, k-means) over another (age).</li>
<li><strong>Discretization</strong> — turning a continuous attribute into bins (age → "young/middle/senior") when a technique needs categorical input.</li>
<li><strong>Feature selection &amp; engineering</strong> — drop irrelevant/redundant attributes; create new, more predictive ones (e.g. "days since last purchase" from raw transaction dates).</li>
</ul>
<pre><code>Min-max normalization:
 x' = (x - min) / (max - min)
 Example: income 32,000,000 VND, range [10M, 200M]
 x' = (32M - 10M) / (200M - 10M) = 22/190 = 0.116
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Spend real time here. A simple model on clean, well-chosen features usually beats a sophisticated model fed raw, messy data.</div>`,
    `<span class="eyebrow">DTM301 · Chương 2 · Bài 2.1</span>
<h2>Tiền xử lý &amp; làm sạch dữ liệu</h2>
<h3>"Rác vào, rác ra"</h3>
<p>Dữ liệu thực tế thường <strong>thiếu sót</strong> (giá trị khuyết), <strong>nhiễu</strong> (lỗi, giá trị ngoại lai) và <strong>không nhất quán</strong> (nhiều định dạng, bản ghi trùng lặp). Không giải thuật nào — dù thông minh tới đâu — cho ra mô hình đáng tin từ dữ liệu bẩn. Đây là lý do Han/Kamber/Pei dành cả một chương riêng cho tiền xử lý trước bất kỳ kỹ thuật khai phá nào.</p>
<h3>Các việc tiền xử lý cốt lõi</h3>
<ul>
<li><strong>Giá trị khuyết (missing values)</strong> — xoá bản ghi, xoá thuộc tính, hoặc <strong>điền (impute)</strong> (trung bình/trung vị/mode, hoặc ước lượng bằng mô hình).</li>
<li><strong>Ngoại lai &amp; nhiễu (outliers &amp; noise)</strong> — giá trị vượt xa khoảng bình thường (vd tuổi 200). Phát hiện bằng quy tắc đơn giản (z-score, IQR) hoặc kiến thức ngành; quyết định xoá, giới hạn lại, hoặc điều tra thêm (một ngoại lai đôi khi lại chính là ca gian lận đang tìm).</li>
<li><strong>Trùng lặp &amp; không nhất quán</strong> — cùng một khách hàng nhập hai lần với cách viết khác nhau; ngày tháng theo hai định dạng. Phải hợp nhất trước khi phân tích.</li>
<li><strong>Chuẩn hoá (normalization)</strong> — co giãn lại thuộc tính số (vd min-max về [0,1], hoặc z-score) để một thuộc tính có khoảng giá trị rất lớn (thu nhập) không lấn át thuộc tính khác (tuổi) trong giải thuật dựa trên khoảng cách (kNN, k-means).</li>
<li><strong>Rời rạc hoá (discretization)</strong> — biến thuộc tính liên tục thành các khoảng (tuổi → "trẻ/trung niên/cao tuổi") khi kỹ thuật cần đầu vào dạng phân loại.</li>
<li><strong>Chọn &amp; tạo đặc trưng (feature selection &amp; engineering)</strong> — bỏ thuộc tính không liên quan/thừa; tạo thuộc tính mới có tính dự báo cao hơn (vd "số ngày từ lần mua gần nhất" từ ngày giao dịch thô).</li>
</ul>
<pre><code>Chuẩn hoá min-max:
 x' = (x - min) / (max - min)
 Ví dụ: thu nhập 32.000.000 VND, khoảng [10 triệu, 200 triệu]
 x' = (32M - 10M) / (200M - 10M) = 22/190 = 0,116
</code></pre>
<div class="callout"><span class="badge">Quy tắc kinh nghiệm</span> Hãy dành thời gian thật cho bước này. Một mô hình đơn giản trên dữ liệu sạch, đặc trưng chọn tốt thường thắng một mô hình phức tạp nhưng ăn dữ liệu thô, lộn xộn.</div>`,
  ]]);

const c2q = quiz('dtm301-quiz-2', 'Quiz 2 — Preprocessing & cleaning|||Quiz 2 — Tiền xử lý & làm sạch', [
  { id: 'q1', question: 'Vì sao cần chuẩn hoá (normalization) trước khi dùng giải thuật dựa trên khoảng cách như kNN hay k-means?', options: ['Để dữ liệu trông đẹp hơn', 'Để thuộc tính có khoảng giá trị lớn không lấn át thuộc tính khác khi tính khoảng cách', 'Để xoá hết giá trị khuyết', 'Vì luật của FLM yêu cầu'], correctIndex: 1, explanation: 'Không chuẩn hoá, một thuộc tính có khoảng giá trị lớn (vd thu nhập) sẽ chi phối khoảng cách tính toán.' },
  { id: 'q2', question: 'Một khách hàng có tuổi ghi là 200 trong dữ liệu — đây là ví dụ của?', options: ['Dữ liệu chuẩn hoá', 'Ngoại lai/nhiễu (outlier)', 'Luật kết hợp', 'Phân cụm'], correctIndex: 1, explanation: 'Giá trị vượt xa khoảng hợp lý là dấu hiệu của nhiễu/ngoại lai, cần kiểm tra trước khi phân tích.' },
  { id: 'q3', question: 'Vì sao trong nhiều dự án data mining thực tế, bước tiền xử lý lại chiếm phần lớn thời gian?', options: ['Vì máy chạy chậm', 'Vì dữ liệu thật thường thiếu sót, nhiễu, không nhất quán và cần làm sạch kỹ trước khi mô hình đáng tin', 'Vì luôn phải viết lại giải thuật', 'Vì phải học thêm ngôn ngữ mới'], correctIndex: 1, explanation: '"Garbage in, garbage out" — mô hình chỉ đáng tin khi dữ liệu đầu vào đã được làm sạch, chuẩn hoá, chọn đặc trưng phù hợp.' },
]);

const c3 = doc('dtm301-3-1-classification', '3.1 — Classification: decision tree, kNN, Naive Bayes|||3.1 — Phân lớp: cây quyết định, kNN, Naive Bayes',
  'Phân lớp là dự báo nhãn rời rạc từ dữ liệu có nhãn (supervised); cây quyết định (entropy/information gain), k-Nearest Neighbors, Naive Bayes (định lý Bayes, giả định độc lập).',
  [[
    `<span class="eyebrow">DTM301 · Chapter 3 · Lesson 3.1</span>
<h2>Classification: decision tree, kNN, Naive Bayes</h2>
<h3>What is classification?</h3>
<p><strong>Classification</strong> is a <em>supervised</em> mining task: given historical records with a known, discrete <strong>label</strong> (e.g. "churn / no-churn", "approve / reject"), learn a model that predicts the label for new, unlabeled records.</p>
<h3>Decision tree</h3>
<p>A <strong>decision tree</strong> splits data recursively on the attribute that best separates the classes, using a purity measure such as <strong>entropy</strong> and <strong>information gain</strong> (higher gain = better split). Readable "if-then" rules make it a favorite for explaining decisions to business stakeholders.</p>
<pre><code>Entropy of a set S with classes yes/no:
 Entropy(S) = -p(yes)·log2 p(yes) - p(no)·log2 p(no)
 Information Gain(S, A) = Entropy(S) - Sum_v [ |S_v|/|S| · Entropy(S_v) ]
 (pick the attribute A with the highest gain to split on)
</code></pre>
<h3>k-Nearest Neighbors (kNN)</h3>
<p><strong>kNN</strong> classifies a new record by finding its <strong>k</strong> closest records (by distance, e.g. Euclidean) in the training data and taking a majority vote of their labels. No explicit model is trained — the "model" is the stored data itself (lazy learning). Sensitive to the scale of attributes — this is exactly why Chapter 2's normalization matters.</p>
<h3>Naive Bayes</h3>
<p><strong>Naive Bayes</strong> applies <strong>Bayes' theorem</strong>, assuming attributes are conditionally independent given the class (the "naive" assumption) — a simplification that works surprisingly well in practice, especially for text/spam classification.</p>
<pre><code>Bayes' theorem:
 P(class | evidence) = P(evidence | class) · P(class) / P(evidence)
 Naive assumption: P(evidence | class) = Product of P(each attribute | class)
</code></pre>
<div class="callout"><span class="badge">Choosing one</span> Decision tree — need an explainable rule for stakeholders. kNN — small dataset, no time to train, decision boundary is irregular. Naive Bayes — many features, fast, works well for text.</div>`,
    `<span class="eyebrow">DTM301 · Chương 3 · Bài 3.1</span>
<h2>Phân lớp: cây quyết định, kNN, Naive Bayes</h2>
<h3>Phân lớp là gì?</h3>
<p><strong>Phân lớp (classification)</strong> là bài toán khai phá <em>có giám sát (supervised)</em>: cho các bản ghi lịch sử với <strong>nhãn</strong> rời rạc đã biết (vd "rời bỏ/không rời bỏ", "duyệt/từ chối"), học một mô hình để dự báo nhãn cho bản ghi mới chưa có nhãn.</p>
<h3>Cây quyết định (decision tree)</h3>
<p><strong>Cây quyết định</strong> chia dữ liệu đệ quy theo thuộc tính tách các lớp tốt nhất, dùng độ đo độ "tinh khiết" như <strong>entropy</strong> và <strong>information gain</strong> (gain cao hơn = tách tốt hơn). Kết quả là các quy tắc "nếu-thì" dễ đọc, được ưa dùng để giải thích quyết định cho người làm kinh doanh.</p>
<pre><code>Entropy của tập S với hai lớp yes/no:
 Entropy(S) = -p(yes)·log2 p(yes) - p(no)·log2 p(no)
 Information Gain(S, A) = Entropy(S) - Tổng_v [ |S_v|/|S| · Entropy(S_v) ]
 (chọn thuộc tính A có gain cao nhất để tách)
</code></pre>
<h3>k-Nearest Neighbors (kNN)</h3>
<p><strong>kNN</strong> phân lớp một bản ghi mới bằng cách tìm <strong>k</strong> bản ghi gần nhất (theo khoảng cách, vd Euclidean) trong dữ liệu huấn luyện và biểu quyết theo số đông nhãn của chúng. Không huấn luyện mô hình rõ ràng — "mô hình" chính là dữ liệu được lưu lại (lazy learning). Nhạy với thang đo thuộc tính — chính là lý do chuẩn hoá ở Chương 2 quan trọng.</p>
<h3>Naive Bayes</h3>
<p><strong>Naive Bayes</strong> áp <strong>định lý Bayes</strong>, giả định các thuộc tính độc lập có điều kiện với nhau khi biết lớp (giả định "ngây thơ" — naive) — một sự đơn giản hoá nhưng hoạt động tốt bất ngờ trong thực tế, đặc biệt cho phân loại văn bản/spam.</p>
<pre><code>Định lý Bayes:
 P(lớp | bằng chứng) = P(bằng chứng | lớp) · P(lớp) / P(bằng chứng)
 Giả định ngây thơ: P(bằng chứng | lớp) = Tích của P(mỗi thuộc tính | lớp)
</code></pre>
<div class="callout"><span class="badge">Chọn giải thuật nào</span> Cây quyết định — cần quy tắc dễ giải thích cho người làm kinh doanh. kNN — dữ liệu nhỏ, không có thời gian huấn luyện, biên quyết định gấp khúc. Naive Bayes — nhiều đặc trưng, cần nhanh, hợp với văn bản.</div>`,
  ]]);

const c3q = quiz('dtm301-quiz-3', 'Quiz 3 — Classification|||Quiz 3 — Phân lớp', [
  { id: 'q1', question: 'Cây quyết định chọn thuộc tính để tách một nút dựa trên điều gì?', options: ['Thứ tự cột trong bảng dữ liệu', 'Information gain (dựa trên entropy) cao nhất', 'Tên thuộc tính ngắn nhất', 'Giá trị trung bình của thuộc tính'], correctIndex: 1, explanation: 'Thuộc tính có information gain cao nhất tách các lớp tốt nhất, được chọn để chia nút.' },
  { id: 'q2', question: 'kNN phân lớp một bản ghi mới bằng cách nào?', options: ['Học một hàm số tổng quát rồi bỏ dữ liệu gốc', 'Tìm k bản ghi gần nhất trong dữ liệu huấn luyện và biểu quyết theo nhãn số đông', 'Tính entropy của toàn bộ tập dữ liệu', 'Giả định các thuộc tính độc lập với nhau'], correctIndex: 1, explanation: 'kNN là "lazy learning" — không huấn luyện mô hình rõ ràng, chỉ tra k láng giềng gần nhất mỗi khi cần dự báo.' },
  { id: 'q3', question: 'Naive Bayes được gọi là "naive" (ngây thơ) vì sao?', options: ['Vì nó chỉ dùng được cho dữ liệu số', 'Vì nó giả định các thuộc tính độc lập với nhau khi biết lớp', 'Vì nó không cần dữ liệu huấn luyện', 'Vì nó luôn cho kết quả sai'], correctIndex: 1, explanation: 'Giả định độc lập có điều kiện giữa các thuộc tính là sự đơn giản hoá "ngây thơ" nhưng hiệu quả trong thực tế.' },
]);

const c4 = doc('dtm301-4-1-regression-forecasting', '4.1 — Regression & forecasting|||4.1 — Hồi quy & dự báo',
  'Hồi quy dự báo giá trị số liên tục (khác phân lớp dự báo nhãn rời rạc); hồi quy tuyến tính đơn/đa biến, hệ số, R²; dự báo chuỗi thời gian (xu hướng, mùa vụ) trong kinh doanh.',
  [[
    `<span class="eyebrow">DTM301 · Chapter 4 · Lesson 4.1</span>
<h2>Regression &amp; forecasting</h2>
<h3>Regression vs. classification</h3>
<p>Where classification predicts a discrete label, <strong>regression</strong> predicts a <strong>continuous numeric value</strong> — next month's revenue, a house price, a customer's lifetime value. Both are supervised: both learn from historical records where the true outcome is already known.</p>
<h3>Linear regression</h3>
<p><strong>Linear regression</strong> fits a straight-line (or hyperplane, with several predictors) relationship between input attributes and the numeric target, estimated by minimizing the sum of squared errors.</p>
<pre><code>Simple linear regression:
 y = b0 + b1·x + error
 b1 (slope)      = how much y changes per unit of x
 b0 (intercept)  = predicted y when x = 0
 Example: Sales = 20 + 3·(Ads spend, in millions VND)
 Ads spend = 10M -&gt; predicted Sales = 20 + 3·10 = 50 (million VND)
</code></pre>
<p><strong>Multiple regression</strong> extends this to several predictors at once (ads spend, price, season). <strong>R² (coefficient of determination)</strong> tells you how much of the target's variation the model explains — R² = 0.80 means 80% of the variation in sales is explained by the model's inputs.</p>
<h3>Forecasting business time series</h3>
<p>Sales, demand and revenue are usually <strong>time series</strong> — regression over time, with two recurring patterns to account for: <strong>trend</strong> (long-run rise/fall) and <strong>seasonality</strong> (a repeating pattern, e.g. a spike every Tet holiday). A naive model that ignores seasonality will systematically mis-forecast every peak season.</p>
<div class="callout"><span class="badge">Business framing</span> "Predict whether a customer churns" is classification. "Predict how much a customer will spend next month" is regression. Many real projects need both.</div>`,
    `<span class="eyebrow">DTM301 · Chương 4 · Bài 4.1</span>
<h2>Hồi quy &amp; dự báo</h2>
<h3>Hồi quy khác phân lớp ở đâu</h3>
<p>Phân lớp dự báo một nhãn rời rạc, còn <strong>hồi quy</strong> dự báo một <strong>giá trị số liên tục</strong> — doanh thu tháng tới, giá một căn nhà, giá trị vòng đời của một khách hàng. Cả hai đều có giám sát: cả hai đều học từ bản ghi lịch sử mà kết quả thật đã biết.</p>
<h3>Hồi quy tuyến tính</h3>
<p><strong>Hồi quy tuyến tính</strong> khớp một quan hệ dạng đường thẳng (hoặc siêu phẳng, khi có nhiều biến dự báo) giữa các thuộc tính đầu vào và biến mục tiêu dạng số, ước lượng bằng cách tối thiểu hoá tổng bình phương sai số.</p>
<pre><code>Hồi quy tuyến tính đơn giản:
 y = b0 + b1·x + sai số
 b1 (độ dốc)   = y thay đổi bao nhiêu khi x tăng 1 đơn vị
 b0 (hệ số chặn) = y dự báo khi x = 0
 Ví dụ: Doanh số = 20 + 3·(Chi phí quảng cáo, triệu VND)
 Chi phí = 10 triệu -&gt; Doanh số dự báo = 20 + 3·10 = 50 (triệu VND)
</code></pre>
<p><strong>Hồi quy đa biến</strong> mở rộng ra nhiều biến dự báo cùng lúc (chi phí quảng cáo, giá, mùa vụ). <strong>R² (hệ số xác định)</strong> cho biết mô hình giải thích được bao nhiêu phần biến động của biến mục tiêu — R² = 0,80 nghĩa là 80% biến động doanh số được giải thích bởi các đầu vào của mô hình.</p>
<h3>Dự báo chuỗi thời gian trong kinh doanh</h3>
<p>Doanh số, nhu cầu, doanh thu thường là <strong>chuỗi thời gian</strong> — hồi quy theo thời gian, với hai quy luật lặp lại cần tính tới: <strong>xu hướng (trend)</strong> (tăng/giảm dài hạn) và <strong>mùa vụ (seasonality)</strong> (một mô hình lặp lại, vd tăng vọt mỗi mùa Tết). Một mô hình ngây thơ bỏ qua mùa vụ sẽ dự báo sai một cách có hệ thống ở mọi mùa cao điểm.</p>
<div class="callout"><span class="badge">Đóng khung kinh doanh</span> "Dự báo khách hàng có rời bỏ hay không" là phân lớp. "Dự báo khách hàng sẽ chi bao nhiêu tháng tới" là hồi quy. Nhiều dự án thật cần cả hai.</div>`,
  ]]);

const c4q = quiz('dtm301-quiz-4', 'Quiz 4 — Regression & forecasting|||Quiz 4 — Hồi quy & dự báo', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa hồi quy và phân lớp là gì?', options: ['Hồi quy không cần dữ liệu lịch sử', 'Hồi quy dự báo giá trị số liên tục, phân lớp dự báo nhãn rời rạc', 'Phân lớp chỉ dùng cho dữ liệu văn bản', 'Không có khác biệt, hai tên gọi cho cùng một việc'], correctIndex: 1, explanation: 'Cả hai đều có giám sát nhưng khác kiểu đầu ra: số liên tục (hồi quy) vs nhãn rời rạc (phân lớp).' },
  { id: 'q2', question: 'Trong hồi quy tuyến tính y = b0 + b1·x, hệ số b1 biểu thị điều gì?', options: ['Giá trị y khi x = 0', 'Mức thay đổi của y khi x tăng thêm 1 đơn vị', 'Sai số của mô hình', 'Số lượng quan sát trong dữ liệu'], correctIndex: 1, explanation: 'b1 là độ dốc — lượng y thay đổi tương ứng với mỗi đơn vị tăng của x.' },
  { id: 'q3', question: 'Vì sao một mô hình dự báo doanh số bỏ qua "mùa vụ" (seasonality) thường sai có hệ thống?', options: ['Vì doanh số không bao giờ đổi theo thời gian', 'Vì nó không tính tới các mô hình lặp lại theo mùa (vd cao điểm dịp Tết)', 'Vì R² luôn bằng 1', 'Vì hồi quy tuyến tính không dùng được cho chuỗi thời gian'], correctIndex: 1, explanation: 'Bỏ qua mùa vụ khiến mô hình dự báo thấp ở mùa cao điểm và cao ở mùa thấp điểm một cách lặp lại.' },
]);

const c5 = doc('dtm301-5-1-clustering', '5.1 — Clustering: k-means & hierarchical|||5.1 — Phân cụm: k-means & phân cụm phân tầng',
  'Phân cụm là học không giám sát (unsupervised) — không có nhãn trước; k-means (chọn k, gán, cập nhật tâm cụm, lặp); phân cụm phân tầng (dendrogram); ứng dụng phân khúc khách hàng.',
  [[
    `<span class="eyebrow">DTM301 · Chapter 5 · Lesson 5.1</span>
<h2>Clustering: k-means &amp; hierarchical</h2>
<h3>Unsupervised — no labels given</h3>
<p><strong>Clustering</strong> is <em>unsupervised</em>: unlike classification, there is no known label to learn from. The goal is to group records so that items <strong>within a cluster are similar</strong>, and items in <strong>different clusters are dissimilar</strong> — discovering structure, not predicting a known answer.</p>
<h3>k-means</h3>
<p><strong>k-means</strong> is the workhorse clustering algorithm:</p>
<ol>
<li>Choose <strong>k</strong> (the number of clusters) in advance.</li>
<li>Randomly place k initial cluster centers (<strong>centroids</strong>).</li>
<li><strong>Assign</strong> each point to its nearest centroid.</li>
<li><strong>Update</strong> each centroid to the mean of the points assigned to it.</li>
<li>Repeat steps 3-4 until assignments stop changing.</li>
</ol>
<pre><code>k-means, distance to a centroid (Euclidean, 2 attributes):
 d(point, centroid) = sqrt( (x1-x2)^2 + (y1-y2)^2 )
 Assign each point to the centroid with the SMALLEST distance.
</code></pre>
<p>Choosing k is itself a decision — the <strong>elbow method</strong> plots within-cluster variance against k and looks for the point where adding another cluster stops helping much.</p>
<h3>Hierarchical clustering</h3>
<p><strong>Hierarchical clustering</strong> does not require choosing k up front. It builds a tree of clusters (a <strong>dendrogram</strong>) — bottom-up (agglomerative): start with every point as its own cluster, repeatedly merge the two closest clusters, until everything is one cluster. Cutting the dendrogram at a chosen height gives any number of clusters you like, after the fact.</p>
<div class="callout"><span class="badge">Business use</span> Customer segmentation is the classic business application of clustering — grouping customers by spending pattern, frequency and recency (RFM) without knowing beforehand what the "right" segments are.</div>`,
    `<span class="eyebrow">DTM301 · Chương 5 · Bài 5.1</span>
<h2>Phân cụm: k-means &amp; phân cụm phân tầng</h2>
<h3>Không giám sát — không có nhãn cho trước</h3>
<p><strong>Phân cụm (clustering)</strong> là học <em>không giám sát</em>: khác phân lớp, không có nhãn đã biết để học theo. Mục tiêu là nhóm các bản ghi sao cho các phần tử <strong>trong một cụm giống nhau</strong>, và các phần tử ở <strong>các cụm khác nhau khác nhau</strong> — phát hiện cấu trúc, không phải dự báo một đáp số đã biết.</p>
<h3>k-means</h3>
<p><strong>k-means</strong> là giải thuật phân cụm chủ lực:</p>
<ol>
<li>Chọn trước <strong>k</strong> (số cụm).</li>
<li>Đặt ngẫu nhiên k tâm cụm ban đầu (<strong>centroid</strong>).</li>
<li><strong>Gán</strong> mỗi điểm vào tâm cụm gần nó nhất.</li>
<li><strong>Cập nhật</strong> mỗi tâm cụm thành trung bình của các điểm được gán vào nó.</li>
<li>Lặp lại bước 3-4 cho đến khi việc gán không còn thay đổi.</li>
</ol>
<pre><code>k-means, khoảng cách tới tâm cụm (Euclidean, 2 thuộc tính):
 d(điểm, tâm cụm) = sqrt( (x1-x2)^2 + (y1-y2)^2 )
 Gán mỗi điểm vào tâm cụm có khoảng cách NHỎ NHẤT.
</code></pre>
<p>Chọn k cũng là một quyết định — <strong>phương pháp elbow (khuỷu tay)</strong> vẽ biến động trong cụm theo k và tìm điểm mà thêm cụm không còn giúp cải thiện nhiều.</p>
<h3>Phân cụm phân tầng (hierarchical)</h3>
<p><strong>Phân cụm phân tầng</strong> không cần chọn k trước. Nó dựng một cây các cụm (<strong>dendrogram</strong>) — kiểu gộp dần từ dưới lên (agglomerative): bắt đầu mỗi điểm là một cụm riêng, lặp lại việc gộp hai cụm gần nhau nhất, cho tới khi tất cả thành một cụm. Cắt dendrogram ở một độ cao chọn sau cho ra bao nhiêu cụm tuỳ ý, quyết định sau khi đã thấy cấu trúc.</p>
<div class="callout"><span class="badge">Ứng dụng kinh doanh</span> Phân khúc khách hàng là ứng dụng kinh doanh kinh điển của phân cụm — nhóm khách theo hành vi chi tiêu, tần suất và độ gần đây mua hàng (RFM) mà không cần biết trước "phân khúc đúng" là gì.</div>`,
  ]]);

const c5q = quiz('dtm301-quiz-5', 'Quiz 5 — Clustering|||Quiz 5 — Phân cụm', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi giữa phân cụm và phân lớp là gì?', options: ['Phân cụm cần nhãn, phân lớp không cần', 'Phân cụm là không giám sát (không có nhãn cho trước), phân lớp là có giám sát', 'Phân cụm chỉ dùng cho dữ liệu số nguyên', 'Không có khác biệt'], correctIndex: 1, explanation: 'Phân cụm phát hiện cấu trúc từ dữ liệu chưa có nhãn; phân lớp học từ dữ liệu đã có nhãn đúng.' },
  { id: 'q2', question: 'Trong k-means, bước "cập nhật" làm gì?', options: ['Xoá các điểm ngoại lai', 'Đặt lại mỗi tâm cụm thành trung bình của các điểm hiện gán vào nó', 'Tăng số cụm k lên 1', 'Sắp xếp lại dữ liệu theo thứ tự bảng chữ cái'], correctIndex: 1, explanation: 'Sau khi gán điểm vào tâm gần nhất, mỗi tâm được tính lại làm trung bình của các điểm thuộc cụm đó.' },
  { id: 'q3', question: 'Ưu điểm của phân cụm phân tầng (hierarchical) so với k-means là gì?', options: ['Chạy nhanh hơn trên dữ liệu rất lớn', 'Không cần chọn số cụm k trước — có thể cắt dendrogram ở nhiều mức khác nhau sau khi đã dựng cây', 'Luôn cho kết quả giống phân lớp', 'Không cần tính khoảng cách giữa các điểm'], correctIndex: 1, explanation: 'Dendrogram cho phép chọn số cụm SAU khi đã thấy cấu trúc phân tầng, không phải cố định trước như k-means.' },
]);

const c6 = doc('dtm301-6-1-association-rules', '6.1 — Association rules & market basket analysis|||6.1 — Luật kết hợp & phân tích giỏ hàng',
  'Luật kết hợp dạng "nếu mua A thì mua B"; support, confidence, lift; thuật toán Apriori; ứng dụng market basket, cross-sell, xếp kệ hàng.',
  [[
    `<span class="eyebrow">DTM301 · Chapter 6 · Lesson 6.1</span>
<h2>Association rules &amp; market basket analysis</h2>
<h3>What is an association rule?</h3>
<p>An <strong>association rule</strong> has the form <code>A -&gt; B</code>: "customers who buy item(s) A tend to also buy item(s) B" — mined from transaction data (each transaction = one shopping basket). This is <strong>market basket analysis</strong>: the technique behind "customers who bought this also bought...".</p>
<h3>Three measures</h3>
<pre><code>For a rule A -&gt; B, over N transactions:
 Support(A-&gt;B)    = count(transactions containing A AND B) / N
                    "how common is this pattern overall?"
 Confidence(A-&gt;B) = count(A and B) / count(A)
                    "given A was bought, how often was B also bought?"
 Lift(A-&gt;B)       = Confidence(A-&gt;B) / Support(B)
                    "is B bought MORE with A than by chance?" (lift &gt; 1 = yes)
</code></pre>
<p>A rule with high confidence but <strong>lift ≈ 1</strong> is misleading — B might just be a popular item bought by everyone regardless of A. Lift is what separates a real cross-sell insight from noise.</p>
<h3>The Apriori algorithm</h3>
<p>Checking every possible item combination is computationally explosive. <strong>Apriori</strong> exploits one key property — <em>any subset of a frequent itemset must also be frequent</em> — to prune the search: it finds frequent single items first, then frequent pairs from those, then frequent triples from those pairs, discarding anything below a minimum support threshold at each step.</p>
<div class="callout"><span class="badge">Business use</span> Store layout (put related items near each other, or apart to force a longer walk past other products), bundle promotions, and "frequently bought together" recommendations all come from association rules.</div>`,
    `<span class="eyebrow">DTM301 · Chương 6 · Bài 6.1</span>
<h2>Luật kết hợp &amp; phân tích giỏ hàng</h2>
<h3>Luật kết hợp là gì?</h3>
<p>Một <strong>luật kết hợp</strong> có dạng <code>A -&gt; B</code>: "khách mua món A thì cũng thường mua món B" — khai phá từ dữ liệu giao dịch (mỗi giao dịch = một giỏ hàng). Đây là <strong>phân tích giỏ hàng (market basket analysis)</strong>: kỹ thuật đứng sau "khách mua món này cũng thường mua...".</p>
<h3>Ba chỉ số đo</h3>
<pre><code>Với luật A -&gt; B, trên N giao dịch:
 Support(A-&gt;B)    = số giao dịch chứa cả A và B / N
                    "mẫu này phổ biến tới đâu, nói chung?"
 Confidence(A-&gt;B) = số giao dịch chứa A và B / số giao dịch chứa A
                    "biết đã mua A, bao nhiêu phần trăm cũng mua B?"
 Lift(A-&gt;B)       = Confidence(A-&gt;B) / Support(B)
                    "B được mua NHIỀU HƠN khi có A, so với ngẫu nhiên?" (lift &gt; 1 = đúng)
</code></pre>
<p>Một luật có confidence cao nhưng <strong>lift ≈ 1</strong> là gây hiểu lầm — B có thể chỉ là món phổ biến ai cũng mua, bất kể có A hay không. Lift là thứ phân biệt một insight bán chéo (cross-sell) thật với nhiễu.</p>
<h3>Thuật toán Apriori</h3>
<p>Kiểm tra mọi tổ hợp mặt hàng có thể là bùng nổ về tính toán. <strong>Apriori</strong> khai thác một tính chất cốt lõi — <em>mọi tập con của một itemset thường xuyên cũng phải là thường xuyên</em> — để cắt nhánh tìm kiếm: nó tìm các món đơn lẻ thường xuyên trước, rồi các cặp thường xuyên từ đó, rồi các bộ ba từ các cặp đó, loại bỏ bất kỳ tổ hợp nào dưới ngưỡng support tối thiểu ở mỗi bước.</p>
<div class="callout"><span class="badge">Ứng dụng kinh doanh</span> Cách xếp kệ hàng (đặt các món liên quan gần nhau, hoặc xa nhau để buộc khách đi qua các sản phẩm khác), khuyến mãi theo combo, và gợi ý "thường mua cùng nhau" đều xuất phát từ luật kết hợp.</div>`,
  ]]);

const c6q = quiz('dtm301-quiz-6', 'Quiz 6 — Association rules|||Quiz 6 — Luật kết hợp', [
  { id: 'q1', question: 'Confidence(A -&gt; B) đo điều gì?', options: ['Tỉ lệ giao dịch chứa A và B trên tổng số giao dịch', 'Trong các giao dịch có mua A, bao nhiêu phần trăm cũng mua B', 'Số lượng mặt hàng B bán được trong ngày', 'Giá trung bình của mặt hàng A'], correctIndex: 1, explanation: 'Confidence = P(B|A) — điều kiện: đã biết A xuất hiện, xác suất B cũng xuất hiện.' },
  { id: 'q2', question: 'Một luật A -&gt; B có confidence cao nhưng lift ≈ 1 nghĩa là gì?', options: ['Luật này chắc chắn đúng và có giá trị kinh doanh cao', 'B có thể chỉ là món phổ biến, được mua nhiều dù có A hay không — luật không phản ánh liên kết thật', 'Support(A) bằng 0', 'Cần tăng số giao dịch lên gấp đôi'], correctIndex: 1, explanation: 'Lift so sánh confidence với mức phổ biến nền của B; lift ≈ 1 nghĩa là A không thực sự làm tăng khả năng mua B.' },
  { id: 'q3', question: 'Apriori dùng tính chất nào để tránh phải kiểm tra mọi tổ hợp mặt hàng?', options: ['Mọi tập con của một itemset thường xuyên cũng phải thường xuyên', 'Mọi mặt hàng đều có support bằng nhau', 'Chỉ cần xét đúng 2 mặt hàng mỗi lần', 'Dữ liệu giao dịch luôn được sắp xếp theo giá'], correctIndex: 0, explanation: 'Tính chất này cho phép cắt nhánh: nếu một tập con không thường xuyên, tập cha chứa nó cũng không thể thường xuyên.' },
]);

const c7 = doc('dtm301-7-1-model-evaluation', '7.1 — Model evaluation & overfitting|||7.1 — Đánh giá mô hình & overfitting',
  'Chia dữ liệu train/test, k-fold cross-validation; ma trận nhầm lẫn, accuracy/precision/recall; overfitting vs underfitting; vì sao độ chính xác trên tập huấn luyện có thể đánh lừa.',
  [[
    `<span class="eyebrow">DTM301 · Chapter 7 · Lesson 7.1</span>
<h2>Model evaluation &amp; overfitting</h2>
<h3>Never trust accuracy on the training data</h3>
<p>A model can memorize its training data perfectly and still be useless on new data — this is <strong>overfitting</strong>: the model learned the noise, not the pattern. The opposite failure, <strong>underfitting</strong>, is a model too simple to capture the real pattern at all. The only honest test is performance on data the model has never seen.</p>
<h3>Train/test split &amp; cross-validation</h3>
<p>Standard practice: split data into a <strong>training set</strong> (build the model) and a <strong>test set</strong> (evaluate it, untouched during training). <strong>k-fold cross-validation</strong> repeats this k times over different splits and averages the result — a more robust estimate than a single split, especially with limited data.</p>
<h3>The confusion matrix</h3>
<pre><code>                 Predicted: Churn   Predicted: No churn
Actual: Churn      TP (true pos)      FN (false neg)
Actual: No churn    FP (false pos)     TN (true neg)

Accuracy  = (TP+TN) / (TP+TN+FP+FN)      "overall, how often right?"
Precision = TP / (TP+FP)                  "of predicted churners, how many really churn?"
Recall    = TP / (TP+FN)                  "of real churners, how many did we catch?"
</code></pre>
<p><strong>Accuracy alone can lie</strong>: if only 2% of customers actually churn, a model that predicts "never churns" is 98% accurate — and completely useless. This is why precision and recall (and their balance) matter for imbalanced business problems like churn or fraud.</p>
<div class="callout"><span class="badge">Practical rule</span> Always report performance on held-out test data, never on the training set — and for rare-event problems (churn, fraud, default), look at precision/recall, not just accuracy.</div>`,
    `<span class="eyebrow">DTM301 · Chương 7 · Bài 7.1</span>
<h2>Đánh giá mô hình &amp; overfitting</h2>
<h3>Đừng bao giờ tin độ chính xác trên dữ liệu huấn luyện</h3>
<p>Một mô hình có thể ghi nhớ hoàn hảo dữ liệu huấn luyện mà vẫn vô dụng trên dữ liệu mới — đây là <strong>overfitting (quá khớp)</strong>: mô hình học cả nhiễu, không phải quy luật thật. Lỗi ngược lại, <strong>underfitting (chưa khớp)</strong>, là mô hình quá đơn giản để nắm được quy luật thật. Bài kiểm tra trung thực duy nhất là hiệu năng trên dữ liệu mà mô hình chưa từng thấy.</p>
<h3>Chia train/test & kiểm định chéo</h3>
<p>Thực hành chuẩn: chia dữ liệu thành <strong>tập huấn luyện</strong> (dựng mô hình) và <strong>tập kiểm tra</strong> (đánh giá, không đụng tới trong lúc huấn luyện). <strong>Kiểm định chéo k-fold</strong> lặp lại việc này k lần trên các cách chia khác nhau rồi lấy trung bình — ước lượng bền vững hơn một lần chia đơn, đặc biệt khi dữ liệu hạn chế.</p>
<h3>Ma trận nhầm lẫn (confusion matrix)</h3>
<pre><code>                 Dự báo: Rời bỏ    Dự báo: Không rời bỏ
Thật: Rời bỏ        TP (đúng dương)    FN (âm giả)
Thật: Không rời bỏ  FP (dương giả)     TN (đúng âm)

Accuracy  = (TP+TN) / (TP+TN+FP+FN)      "nói chung, đúng bao nhiêu phần trăm?"
Precision = TP / (TP+FP)                  "trong số dự báo rời bỏ, bao nhiêu thật sự rời bỏ?"
Recall    = TP / (TP+FN)                  "trong số khách thật sự rời bỏ, bắt được bao nhiêu?"
</code></pre>
<p><strong>Chỉ nhìn accuracy có thể đánh lừa</strong>: nếu chỉ 2% khách thật sự rời bỏ, một mô hình luôn dự báo "không rời bỏ" đạt accuracy 98% — và hoàn toàn vô dụng. Đây là lý do precision và recall (và sự cân bằng giữa chúng) quan trọng với các bài toán kinh doanh mất cân bằng như churn hay gian lận.</p>
<div class="callout"><span class="badge">Quy tắc thực hành</span> Luôn báo cáo hiệu năng trên tập kiểm tra chưa từng dùng để huấn luyện, không bao giờ trên tập huấn luyện — và với bài toán sự kiện hiếm (churn, gian lận, vỡ nợ), nhìn precision/recall, không chỉ accuracy.</div>`,
  ]]);

const c7q = quiz('dtm301-quiz-7', 'Quiz 7 — Model evaluation & overfitting|||Quiz 7 — Đánh giá mô hình & overfitting', [
  { id: 'q1', question: 'Overfitting là gì?', options: ['Mô hình quá đơn giản, không học được quy luật', 'Mô hình học cả nhiễu trong dữ liệu huấn luyện, hoạt động kém trên dữ liệu mới', 'Mô hình chạy quá chậm', 'Mô hình không có tham số nào'], correctIndex: 1, explanation: 'Overfitting: mô hình "nhớ" dữ liệu huấn luyện (kể cả nhiễu) thay vì học quy luật tổng quát.' },
  { id: 'q2', question: 'Nếu chỉ 2% khách hàng thực sự rời bỏ (churn), một mô hình luôn dự báo "không rời bỏ" đạt accuracy 98% — điều này cho thấy gì?', options: ['Mô hình này rất tốt và nên dùng ngay', 'Accuracy có thể đánh lừa với dữ liệu mất cân bằng; cần xem thêm precision/recall', 'Recall của mô hình này chắc chắn cao', 'Cần tăng số cụm k lên'], correctIndex: 1, explanation: 'Với sự kiện hiếm, accuracy cao không có nghĩa mô hình hữu ích — cần precision/recall để đánh giá đúng.' },
  { id: 'q3', question: 'Vì sao phải đánh giá mô hình trên tập kiểm tra (test set) tách riêng, không dùng lại tập huấn luyện?', options: ['Vì tập huấn luyện luôn bị mất dữ liệu', 'Vì hiệu năng trên tập huấn luyện không phản ánh khả năng tổng quát hoá trên dữ liệu mới, dễ bị overfitting đánh lừa', 'Vì luật của trường bắt buộc', 'Vì tập kiểm tra luôn lớn hơn tập huấn luyện'], correctIndex: 1, explanation: 'Chỉ hiệu năng trên dữ liệu chưa từng dùng để huấn luyện mới là bài kiểm tra trung thực về khả năng tổng quát hoá.' },
]);

const c8 = doc('dtm301-8-1-business-applications', '8.1 — Business applications & data ethics|||8.1 — Ứng dụng kinh doanh & đạo đức dữ liệu',
  'Ứng dụng thực tế: dự báo churn (phân lớp), phân khúc khách hàng (phân cụm), dự báo bán hàng (hồi quy/chuỗi thời gian); đạo đức dữ liệu: quyền riêng tư, thiên lệch (bias), minh bạch, tuân thủ.',
  [[
    `<span class="eyebrow">DTM301 · Chapter 8 · Lesson 8.1</span>
<h2>Business applications &amp; data ethics</h2>
<h3>Putting the techniques to work</h3>
<ul>
<li><strong>Churn prediction</strong> — classification (Ch.3): label past customers as churned/retained, learn which attributes (usage drop, complaints, contract type) predict churn, score current customers, target the highest-risk group with retention offers.</li>
<li><strong>Customer segmentation</strong> — clustering (Ch.5): group customers by behavior (RFM: recency, frequency, monetary value) without predefined labels, then design a different marketing message per segment (loyal high-value, at-risk, price-sensitive, one-time buyer).</li>
<li><strong>Sales forecasting</strong> — regression/time series (Ch.4): predict next period's demand accounting for trend and seasonality, to plan inventory and staffing.</li>
<li><strong>Market basket / cross-sell</strong> — association rules (Ch.6): recommend bundles, plan store layout, personalize promotions.</li>
</ul>
<p>Every one of these still needs Chapter 2's discipline (clean data) and Chapter 7's discipline (test on unseen data, watch for overfitting) — the algorithm is never the whole story.</p>
<h3>Data ethics — the part a manager cannot outsource to the data team</h3>
<ul>
<li><strong>Privacy</strong> — customer data used for mining must respect consent and data-protection law; "we had the data" is not the same as "we had the right to use it this way."</li>
<li><strong>Bias &amp; fairness</strong> — a model trained on historically biased decisions (e.g. who got approved for credit) will reproduce and amplify that bias unless explicitly checked. "The model just found a pattern in the data" is not a defense if the pattern is discriminatory.</li>
<li><strong>Transparency</strong> — a customer denied a loan or a discount by a model has a legitimate interest in a reason; unexplainable "black box" models create real business and legal risk.</li>
<li><strong>Purpose limitation</strong> — data collected for one purpose (fraud detection) being silently reused for another (marketing profiling) erodes trust even where it is technically legal.</li>
</ul>
<div class="callout"><span class="badge">Manager's checklist</span> Before deploying any predictive model: (1) does it answer the actual business question (CRISP-DM's first phase)? (2) was it evaluated on unseen data? (3) could it be biased against a protected group? (4) can we explain its decisions to the people affected by them?</div>`,
    `<span class="eyebrow">DTM301 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng kinh doanh &amp; đạo đức dữ liệu</h2>
<h3>Đưa kỹ thuật vào thực tế</h3>
<ul>
<li><strong>Dự báo churn</strong> — phân lớp (Ch.3): gán nhãn khách hàng cũ là rời bỏ/giữ lại, học thuộc tính nào (sụt giảm sử dụng, khiếu nại, loại hợp đồng) dự báo được churn, chấm điểm khách hiện tại, nhắm ưu đãi giữ chân vào nhóm rủi ro cao nhất.</li>
<li><strong>Phân khúc khách hàng</strong> — phân cụm (Ch.5): nhóm khách theo hành vi (RFM: độ gần đây, tần suất, giá trị chi tiêu) mà không có nhãn định trước, rồi thiết kế thông điệp marketing khác nhau cho mỗi phân khúc (trung thành giá trị cao, có rủi ro rời bỏ, nhạy giá, mua một lần).</li>
<li><strong>Dự báo bán hàng</strong> — hồi quy/chuỗi thời gian (Ch.4): dự báo nhu cầu kỳ tới có tính tới xu hướng và mùa vụ, để lập kế hoạch tồn kho và nhân sự.</li>
<li><strong>Giỏ hàng / bán chéo</strong> — luật kết hợp (Ch.6): gợi ý combo, lập kệ hàng, cá nhân hoá khuyến mãi.</li>
</ul>
<p>Mỗi ứng dụng trên vẫn cần kỷ luật của Chương 2 (dữ liệu sạch) và Chương 7 (kiểm tra trên dữ liệu chưa thấy, cảnh giác overfitting) — giải thuật không bao giờ là toàn bộ câu chuyện.</p>
<h3>Đạo đức dữ liệu — phần mà người quản lý không thể giao hết cho team dữ liệu</h3>
<ul>
<li><strong>Quyền riêng tư</strong> — dữ liệu khách hàng dùng để khai phá phải tuân theo sự đồng ý và luật bảo vệ dữ liệu; "chúng ta có dữ liệu" không đồng nghĩa "chúng ta có quyền dùng theo cách này."</li>
<li><strong>Thiên lệch &amp; công bằng (bias)</strong> — một mô hình huấn luyện trên các quyết định lịch sử thiên lệch (vd ai được duyệt tín dụng trước đây) sẽ tái tạo và khuếch đại thiên lệch đó nếu không được kiểm tra rõ ràng. "Mô hình chỉ tìm ra quy luật trong dữ liệu" không phải lời bào chữa nếu quy luật đó mang tính phân biệt.</li>
<li><strong>Minh bạch</strong> — một khách hàng bị từ chối vay hoặc giảm giá bởi mô hình có quyền lợi hợp pháp được biết lý do; mô hình "hộp đen" không giải thích được tạo ra rủi ro kinh doanh và pháp lý thật.</li>
<li><strong>Hạn chế mục đích sử dụng</strong> — dữ liệu thu thập cho một mục đích (chống gian lận) bị lặng lẽ dùng lại cho mục đích khác (lập hồ sơ marketing) làm xói mòn niềm tin, dù có thể vẫn hợp pháp về mặt kỹ thuật.</li>
</ul>
<div class="callout"><span class="badge">Danh sách kiểm cho người quản lý</span> Trước khi triển khai bất kỳ mô hình dự báo nào: (1) nó có trả lời đúng câu hỏi kinh doanh thật không (giai đoạn đầu của CRISP-DM)? (2) nó đã được đánh giá trên dữ liệu chưa từng thấy chưa? (3) nó có thể thiên lệch với một nhóm được bảo vệ không? (4) chúng ta có giải thích được quyết định của nó cho người bị ảnh hưởng không?</div>`,
  ]]);

const c8q = quiz('dtm301-quiz-8', 'Quiz 8 — Business applications & ethics|||Quiz 8 — Ứng dụng kinh doanh & đạo đức', [
  { id: 'q1', question: 'Dự báo khách hàng churn (rời bỏ) là ứng dụng của kỹ thuật khai phá nào?', options: ['Phân cụm', 'Phân lớp (classification)', 'Luật kết hợp', 'Không cần kỹ thuật nào, chỉ cần cảm quan'], correctIndex: 1, explanation: 'Churn/không churn là nhãn rời rạc đã biết trong lịch sử — đây là bài toán phân lớp có giám sát.' },
  { id: 'q2', question: 'Vì sao "mô hình chỉ tìm ra quy luật có sẵn trong dữ liệu" KHÔNG phải lời bào chữa hợp lý khi mô hình mang tính phân biệt?', options: ['Vì mô hình luôn đúng 100%', 'Vì nếu dữ liệu lịch sử phản ánh thiên lệch (bias) có sẵn, mô hình sẽ tái tạo và khuếch đại thiên lệch đó', 'Vì luật kết hợp không liên quan tới con người', 'Vì phân cụm không cần dữ liệu lịch sử'], correctIndex: 1, explanation: 'Một mô hình học từ quyết định lịch sử thiên lệch sẽ học lại chính thiên lệch đó, dù về kỹ thuật nó "chỉ tìm quy luật."' },
  { id: 'q3', question: 'Phân khúc khách hàng theo RFM (recency, frequency, monetary) trước khi thiết kế thông điệp marketing riêng cho từng nhóm là ứng dụng của kỹ thuật nào?', options: ['Hồi quy tuyến tính', 'Phân cụm (clustering)', 'Cây quyết định', 'Naive Bayes'], correctIndex: 1, explanation: 'Không có nhãn phân khúc định trước — phân cụm nhóm khách hàng theo độ giống nhau trong hành vi mua sắm.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'DTM301',
    slug: 'dtm301-data-mining-and-predictive-analytics',
    title: 'Data Mining and Predictive Analytics',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DTM301.webp',
    shortDescription: 'Turn business data into decisions — the CRISP-DM process, data cleaning, classification (decision tree, kNN, Naive Bayes), regression/forecasting, clustering, association rules, model evaluation, churn/segmentation & data ethics.|||Biến dữ liệu kinh doanh thành quyết định — quy trình CRISP-DM, làm sạch dữ liệu, phân lớp (cây quyết định, kNN, Naive Bayes), hồi quy/dự báo, phân cụm, luật kết hợp, đánh giá mô hình, churn/phân khúc & đạo đức dữ liệu.',
    description: 'Môn <strong>DTM301 — Data Mining and Predictive Analytics</strong> (khối Quản trị Kinh doanh, kỳ 4) dạy cách biến <strong>dữ liệu doanh nghiệp</strong> thành <strong>quyết định</strong>. Từ <strong>quy trình CRISP-DM</strong> và <strong>tiền xử lý dữ liệu</strong> → các kỹ thuật cốt lõi: <strong>phân lớp</strong> (cây quyết định, kNN, Naive Bayes), <strong>hồi quy &amp; dự báo</strong>, <strong>phân cụm</strong> (k-means, phân tầng), <strong>luật kết hợp</strong> (market basket) → <strong>đánh giá mô hình &amp; overfitting</strong> → <strong>ứng dụng kinh doanh</strong> (dự báo churn, phân khúc khách hàng, dự báo bán hàng) và <strong>đạo đức dữ liệu</strong>. Bám giáo trình FLM và các sách kinh điển (Han/Kamber/Pei, Provost &amp; Fawcett, Witten, Shmueli), song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Quy trình CRISP-DM (6 giai đoạn); tiền xử lý & làm sạch dữ liệu (missing values, outliers, chuẩn hoá, feature engineering); phân lớp (decision tree/entropy/information gain, kNN, Naive Bayes/định lý Bayes); hồi quy tuyến tính & R², dự báo chuỗi thời gian (trend/seasonality); phân cụm k-means & hierarchical/dendrogram; luật kết hợp (support/confidence/lift, Apriori); đánh giá mô hình (train/test, cross-validation, ma trận nhầm lẫn, precision/recall) & overfitting; ứng dụng churn, phân khúc khách hàng, dự báo bán hàng; đạo đức dữ liệu (privacy, bias, minh bạch).',
    requirements: 'Thống kê cơ bản (trung bình, phương sai, xác suất) và một môn nền quản trị kinh doanh/hệ thống thông tin. Không cần biết lập trình trước, nhưng nên làm quen WEKA hoặc Python/pandas để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách tham khảo, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Data mining là gì, vì sao doanh nghiệp cần, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & CRISP-DM|||Chapter 1 — Overview & CRISP-DM', description: 'KDD, 6 giai đoạn CRISP-DM, vòng lặp.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tiền xử lý dữ liệu|||Chapter 2 — Data preprocessing', description: 'Missing values, outliers, chuẩn hoá, feature engineering.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phân lớp|||Chapter 3 — Classification', description: 'Decision tree, kNN, Naive Bayes.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Hồi quy & dự báo|||Chapter 4 — Regression & forecasting', description: 'Hồi quy tuyến tính, R², dự báo chuỗi thời gian.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân cụm|||Chapter 5 — Clustering', description: 'k-means, phân cụm phân tầng, phân khúc khách hàng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Luật kết hợp|||Chapter 6 — Association rules', description: 'Support/confidence/lift, Apriori, market basket.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đánh giá mô hình|||Chapter 7 — Model evaluation', description: 'Train/test, cross-validation, ma trận nhầm lẫn, overfitting.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng kinh doanh & đạo đức|||Chapter 8 — Business applications & ethics', description: 'Churn, phân khúc khách hàng, dự báo bán hàng, đạo đức dữ liệu.', lessons: [c8, c8q] },
  ],
};
