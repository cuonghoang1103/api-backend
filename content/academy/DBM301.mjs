/**
 * DBM301 — Data Mining (Khai phá dữ liệu). Giáo trình FLM (Syllabus ID 11081),
 * theo sách Han & Kamber. Không có slide gốc → soạn từ syllabus + kiến thức,
 * song ngữ, có ví dụ thuật toán (Apriori, decision tree, k-means) & BÀI TẬP.
 * Giữ NGUYÊN slug. ⚠️ code mẫu: KHÔNG backtick/${ }.
 */

const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({
  title, slug, type: 'DOCUMENT', description: desc,
  content: pairs.map(([en, vi]) => bi(en, vi)).join('\n'),
});
const quiz = (slug, title, questions) => ({
  title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.',
  quiz: { timeLimitSeconds: 480, questions },
});

const intro = doc('dbm301-0-1-overview', 'Course overview: Data Mining|||Tổng quan môn: Khai phá dữ liệu',
  'Mục tiêu, 9 CLO (khái niệm; biết dữ liệu; tiền xử lý; Weka; data warehouse & OLAP; data cube; frequent patterns & association; classification; clustering), lộ trình, và đánh giá.',
  [[
    `<span class="eyebrow">DBM301 · Lesson 0.1 · Overview</span>
<h2>Data Mining</h2>
<p class="lead">Data mining discovers <strong>useful patterns from large data</strong>: associations ("people who buy X buy Y"), classifications (spam vs not), clusters (customer segments) and anomalies. This course follows the classic pipeline — understand &amp; preprocess data, warehouse/OLAP, then the core tasks: <strong>association rules, classification, clustering</strong> — with the <strong>Weka</strong> tool for hands-on mining.</p>
<h3>CLOs (grouped)</h3>
<ul>
<li>Main concepts of data mining; knowing &amp; describing your data (CLO1–2)</li>
<li>Data preprocessing; the Weka tool (CLO3–4)</li>
<li>Data warehouse &amp; OLAP; data cube technology (CLO5–6)</li>
<li>Frequent patterns, association rules &amp; correlation (CLO7)</li>
<li>Classification; clustering (CLO8–9)</li>
</ul>
<h3>Data mining vs the KDD process</h3>
<p>Data mining is one step of <strong>Knowledge Discovery in Databases (KDD)</strong>: selection → preprocessing → transformation → <em>mining</em> → evaluation &amp; presentation. Most real effort is in preprocessing; the "mining" algorithms only work well on clean, well-prepared data.</p>`,
    `<span class="eyebrow">DBM301 · Bài 0.1 · Tổng quan</span>
<h2>Khai phá dữ liệu (Data Mining)</h2>
<p class="lead">Khai phá dữ liệu tìm <strong>mẫu hữu ích từ dữ liệu lớn</strong>: liên kết ("ai mua X thì mua Y"), phân loại (spam hay không), cụm (phân khúc khách), và bất thường. Môn này theo pipeline kinh điển — hiểu &amp; tiền xử lý dữ liệu, warehouse/OLAP, rồi các tác vụ lõi: <strong>association rules, classification, clustering</strong> — với công cụ <strong>Weka</strong> để thực hành.</p>
<h3>CLO (nhóm lại)</h3>
<ul>
<li>Khái niệm chính; biết &amp; mô tả dữ liệu (CLO1–2)</li>
<li>Tiền xử lý dữ liệu; công cụ Weka (CLO3–4)</li>
<li>Data warehouse &amp; OLAP; data cube (CLO5–6)</li>
<li>Frequent patterns, association rules &amp; correlation (CLO7)</li>
<li>Classification; clustering (CLO8–9)</li>
</ul>
<h3>Data mining vs quy trình KDD</h3>
<p>Data mining là một bước của <strong>Knowledge Discovery in Databases (KDD)</strong>: chọn → tiền xử lý → biến đổi → <em>khai phá</em> → đánh giá &amp; trình bày. Phần lớn công sức thật nằm ở tiền xử lý; các thuật toán "mining" chỉ chạy tốt trên dữ liệu sạch, chuẩn bị kỹ.</p>`,
  ]]);

/* Ch1-2: Concepts & Know your data */
const c1 = doc('dbm301-1-1-data', '1.1 — Concepts & knowing your data|||1.1 — Khái niệm & biết dữ liệu',
  'Kiểu thuộc tính (nominal/ordinal/numeric), thống kê mô tả (mean/median/variance), đo tương đồng/khoảng cách (Euclid, cosine, Jaccard), và trực quan hoá cơ bản.',
  [[
    `<span class="eyebrow">DBM301 · Chapter 1–2 · Lesson 1.1</span>
<h2>Concepts &amp; knowing your data</h2>
<h3>Attribute types</h3>
<ul>
<li><strong>Nominal</strong> — categories, no order (color, city).</li>
<li><strong>Ordinal</strong> — ordered categories (small &lt; medium &lt; large).</li>
<li><strong>Numeric</strong> — interval (temperature) or ratio (weight, has true zero).</li>
</ul>
<p>The attribute type decides which statistics and distances are meaningful.</p>
<h3>Describing data</h3>
<p><strong>Central tendency</strong> (mean, median, mode) and <strong>dispersion</strong> (variance, standard deviation, range, IQR). The median and IQR resist outliers; the mean and variance don't.</p>
<h3>Similarity &amp; distance</h3>
<ul>
<li><strong>Euclidean</strong> — straight-line distance between numeric vectors.</li>
<li><strong>Cosine</strong> — angle between vectors (text/documents).</li>
<li><strong>Jaccard</strong> — overlap of sets (market baskets).</li>
</ul>
<p>Distance/similarity is the engine of clustering and nearest-neighbour classification — choose the measure that fits the attribute types.</p>`,
    `<span class="eyebrow">DBM301 · Chương 1–2 · Bài 1.1</span>
<h2>Khái niệm &amp; biết dữ liệu</h2>
<h3>Kiểu thuộc tính</h3>
<ul>
<li><strong>Nominal</strong> — hạng mục, không thứ tự (màu, thành phố).</li>
<li><strong>Ordinal</strong> — hạng mục có thứ tự (nhỏ &lt; vừa &lt; lớn).</li>
<li><strong>Numeric</strong> — interval (nhiệt độ) hoặc ratio (cân nặng, có 0 thật).</li>
</ul>
<p>Kiểu thuộc tính quyết định thống kê và khoảng cách nào có nghĩa.</p>
<h3>Mô tả dữ liệu</h3>
<p><strong>Xu hướng trung tâm</strong> (mean, median, mode) và <strong>độ phân tán</strong> (variance, độ lệch chuẩn, range, IQR). Median và IQR kháng outlier; mean và variance thì không.</p>
<h3>Tương đồng &amp; khoảng cách</h3>
<ul>
<li><strong>Euclid</strong> — khoảng cách đường thẳng giữa vector số.</li>
<li><strong>Cosine</strong> — góc giữa vector (văn bản/tài liệu).</li>
<li><strong>Jaccard</strong> — độ chồng lấn của tập (giỏ hàng).</li>
</ul>
<p>Khoảng cách/tương đồng là động cơ của clustering và phân loại nearest-neighbour — chọn độ đo hợp kiểu thuộc tính.</p>`,
  ]]);

const c1q = quiz('dbm301-quiz-1', 'Quiz 1 — Data & concepts|||Quiz 1 — Dữ liệu & khái niệm', [
  { id: 'q1', question: 'Thuộc tính "small < medium < large" thuộc kiểu?', options: ['Nominal', 'Ordinal', 'Ratio', 'Interval'], correctIndex: 1, explanation: 'Có thứ tự nhưng không đo khoảng cách → ordinal.' },
  { id: 'q2', question: 'Thống kê nào KHÁNG outlier?', options: ['Mean', 'Median/IQR', 'Variance', 'Range'], correctIndex: 1, explanation: 'Median và IQR bền với outlier; mean/variance/range thì không.' },
  { id: 'q3', question: 'Độ đo nào hợp so tài liệu văn bản?', options: ['Euclid', 'Cosine', 'Jaccard trên số', 'Manhattan'], correctIndex: 1, explanation: 'Cosine đo góc giữa vector — phổ biến cho văn bản (TF-IDF).' },
]);

/* Ch3: Preprocessing */
const c3 = doc('dbm301-3-1-preprocessing', '3.1 — Data preprocessing|||3.1 — Tiền xử lý dữ liệu',
  'Làm sạch (thiếu, nhiễu), tích hợp, biến đổi (chuẩn hoá min-max & z-score), rời rạc hoá, và giảm chiều (chọn thuộc tính, PCA); vì sao tiền xử lý quyết định chất lượng.',
  [[
    `<span class="eyebrow">DBM301 · Chapter 3 · Lesson 3.1</span>
<h2>Data preprocessing</h2>
<p class="lead">"Garbage in, garbage out." Preprocessing is where most data-mining effort goes — and it decides result quality more than the algorithm choice.</p>
<h3>The four tasks</h3>
<ul>
<li><strong>Cleaning</strong> — fill/ignore <strong>missing values</strong>, smooth <strong>noise</strong> (binning, regression), remove duplicates.</li>
<li><strong>Integration</strong> — merge sources, resolve schema/entity conflicts, drop redundant attributes (correlation check).</li>
<li><strong>Transformation</strong> — <strong>normalization</strong> so scales don't dominate distances:
<pre><code class="language-text">min-max:  x' = (x − min) / (max − min)          → [0, 1]
z-score:  x' = (x − mean) / std                  → mean 0, std 1</code></pre></li>
<li><strong>Reduction</strong> — fewer rows (sampling) or columns (attribute selection, <strong>PCA</strong>), and <strong>discretization</strong> (numeric → bins).</li>
</ul>
<p><strong>Why normalize:</strong> without it, an attribute measured in thousands (salary) swamps one measured in units (age) in any distance-based method.</p>`,
    `<span class="eyebrow">DBM301 · Chương 3 · Bài 3.1</span>
<h2>Tiền xử lý dữ liệu</h2>
<p class="lead">"Rác vào, rác ra." Tiền xử lý là nơi tốn phần lớn công sức data mining — và quyết định chất lượng kết quả hơn cả việc chọn thuật toán.</p>
<h3>Bốn tác vụ</h3>
<ul>
<li><strong>Làm sạch</strong> — điền/bỏ <strong>giá trị thiếu</strong>, làm mượt <strong>nhiễu</strong> (binning, regression), bỏ trùng.</li>
<li><strong>Tích hợp</strong> — gộp nguồn, giải xung đột schema/thực thể, bỏ thuộc tính dư (kiểm tương quan).</li>
<li><strong>Biến đổi</strong> — <strong>chuẩn hoá</strong> để thang không lấn khoảng cách:
<pre><code class="language-text">min-max:  x' = (x − min) / (max − min)          → [0, 1]
z-score:  x' = (x − mean) / std                  → mean 0, std 1</code></pre></li>
<li><strong>Giảm</strong> — ít hàng (lấy mẫu) hoặc ít cột (chọn thuộc tính, <strong>PCA</strong>), và <strong>rời rạc hoá</strong> (số → bin).</li>
</ul>
<p><strong>Vì sao chuẩn hoá:</strong> không có nó, thuộc tính đo bằng nghìn (lương) lấn át thuộc tính đo bằng đơn vị (tuổi) trong mọi phương pháp dựa khoảng cách.</p>`,
  ]]);

const c3e = doc('dbm301-3-2-exercise', 'Exercise 1 — normalize & fill missing|||Bài tập 1 — chuẩn hoá & điền thiếu',
  'Bài tập: cho cột tuổi có giá trị thiếu, điền bằng median rồi chuẩn hoá min-max & z-score; kèm lời giải.',
  [[
    `<span class="eyebrow">DBM301 · Chapter 3 · Exercise</span>
<h2>Exercise 1 — clean and normalize a column</h2>
<div class="callout"><span class="badge">Đề</span> Ages = [20, 22, NaN, 25, 40, 22]. (1) fill the missing value with the median; (2) give min-max and z-score normalized values.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">Ages = [20, 22, ?, 25, 40, 22]
median of known = median(20,22,22,25,40) = 22   → fill ? = 22
Ages = [20, 22, 22, 25, 40, 22]

min=20, max=40  → min-max x' = (x−20)/20
  [0.00, 0.10, 0.10, 0.25, 1.00, 0.10]

mean = 151/6 ≈ 25.17,  std ≈ 7.03
z-score x' = (x − 25.17)/7.03
  [−0.74, −0.45, −0.45, −0.02, 2.11, −0.45]</code></pre>
<p><strong>Why:</strong> the median (22) is a robust fill that ignores the outlier 40; min-max maps to [0,1] while z-score centres at 0 — the outlier 40 stands out clearly as z ≈ 2.1, which is exactly how normalization also helps you spot anomalies.</p>`,
    `<span class="eyebrow">DBM301 · Chương 3 · Bài tập</span>
<h2>Bài tập 1 — làm sạch & chuẩn hoá một cột</h2>
<div class="callout"><span class="badge">Đề</span> Tuổi = [20, 22, NaN, 25, 40, 22]. (1) điền giá trị thiếu bằng median; (2) cho giá trị chuẩn hoá min-max và z-score.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">Tuổi = [20, 22, ?, 25, 40, 22]
median các giá trị biết = median(20,22,22,25,40) = 22   → điền ? = 22
Tuổi = [20, 22, 22, 25, 40, 22]

min=20, max=40  → min-max x' = (x−20)/20
  [0.00, 0.10, 0.10, 0.25, 1.00, 0.10]

mean = 151/6 ≈ 25.17,  std ≈ 7.03
z-score x' = (x − 25.17)/7.03
  [−0.74, −0.45, −0.45, −0.02, 2.11, −0.45]</code></pre>
<p><strong>Vì sao:</strong> median (22) là cách điền bền, bỏ qua outlier 40; min-max ánh xạ về [0,1] còn z-score căn giữa 0 — outlier 40 nổi rõ ở z ≈ 2.1, đúng cách chuẩn hoá cũng giúp phát hiện bất thường.</p>`,
  ]]);

const c3q = quiz('dbm301-quiz-3', 'Quiz 3 — Preprocessing|||Quiz 3 — Tiền xử lý', [
  { id: 'q1', question: 'Min-max chuẩn hoá về khoảng?', options: ['[−1, 1]', '[0, 1]', 'mean 0 std 1', 'không đổi'], correctIndex: 1, explanation: 'x\'=(x−min)/(max−min) → [0,1]; z-score mới cho mean 0 std 1.' },
  { id: 'q2', question: 'Vì sao chuẩn hoá trước phương pháp dựa khoảng cách?', options: ['Cho nhanh', 'Để thuộc tính thang lớn không lấn thuộc tính thang nhỏ', 'Bắt buộc', 'Để giảm hàng'], correctIndex: 1, explanation: 'Không chuẩn hoá, cột thang lớn (lương) chi phối khoảng cách.' },
  { id: 'q3', question: 'PCA thuộc nhóm tác vụ nào?', options: ['Làm sạch', 'Giảm chiều (reduction)', 'Tích hợp', 'Trực quan hoá'], correctIndex: 1, explanation: 'PCA giảm số chiều (cột) — data reduction.' },
]);

/* Ch4-5: Data Warehouse & OLAP */
const c4 = doc('dbm301-4-1-warehouse-olap', '4.1 — Data warehouse, OLAP & the data cube|||4.1 — Data warehouse, OLAP & data cube',
  'OLTP vs OLAP, kho dữ liệu (subject-oriented, integrated, time-variant, non-volatile), mô hình star/snowflake, data cube & các phép OLAP (roll-up, drill-down, slice, dice).',
  [[
    `<span class="eyebrow">DBM301 · Chapter 4–5 · Lesson 4.1</span>
<h2>Data warehouse, OLAP &amp; the data cube</h2>
<p class="lead">A <strong>data warehouse</strong> is a subject-oriented, integrated, time-variant, non-volatile store built for <strong>analysis</strong>, separate from the transactional (OLTP) database.</p>
<h3>OLTP vs OLAP</h3>
<table><thead><tr><th></th><th>OLTP</th><th>OLAP</th></tr></thead><tbody>
<tr><td>Purpose</td><td>run the business (transactions)</td><td>analyze the business</td></tr>
<tr><td>Queries</td><td>short read/write</td><td>complex aggregations</td></tr>
<tr><td>Schema</td><td>normalized</td><td>star/snowflake</td></tr>
</tbody></table>
<h3>Star schema &amp; the data cube</h3>
<p>A <strong>fact table</strong> (measures like Sales) links to several <strong>dimension tables</strong> (Time, Product, Location) — a <strong>star schema</strong>. The <strong>data cube</strong> pre-aggregates measures across dimensions so analysts can slice it fast. <strong>OLAP operations:</strong> <strong>roll-up</strong> (aggregate to a coarser level, e.g. day→month), <strong>drill-down</strong> (the reverse), <strong>slice</strong> (fix one dimension), <strong>dice</strong> (sub-cube), <strong>pivot</strong> (rotate).</p>`,
    `<span class="eyebrow">DBM301 · Chương 4–5 · Bài 4.1</span>
<h2>Data warehouse, OLAP &amp; data cube</h2>
<p class="lead">Một <strong>data warehouse</strong> là kho hướng chủ đề, tích hợp, biến thiên theo thời gian, bất biến, dựng cho <strong>phân tích</strong>, tách khỏi database giao dịch (OLTP).</p>
<h3>OLTP vs OLAP</h3>
<table><thead><tr><th></th><th>OLTP</th><th>OLAP</th></tr></thead><tbody>
<tr><td>Mục đích</td><td>vận hành nghiệp vụ (giao dịch)</td><td>phân tích nghiệp vụ</td></tr>
<tr><td>Truy vấn</td><td>đọc/ghi ngắn</td><td>tổng hợp phức tạp</td></tr>
<tr><td>Schema</td><td>chuẩn hoá</td><td>star/snowflake</td></tr>
</tbody></table>
<h3>Star schema &amp; data cube</h3>
<p>Một <strong>fact table</strong> (số đo như Sales) nối tới nhiều <strong>dimension table</strong> (Time, Product, Location) — một <strong>star schema</strong>. <strong>Data cube</strong> tổng hợp trước các số đo qua các chiều để nhà phân tích cắt nhanh. <strong>Phép OLAP:</strong> <strong>roll-up</strong> (gộp lên mức thô hơn, vd ngày→tháng), <strong>drill-down</strong> (ngược lại), <strong>slice</strong> (cố định một chiều), <strong>dice</strong> (sub-cube), <strong>pivot</strong> (xoay).</p>`,
  ]]);

const c4q = quiz('dbm301-quiz-4', 'Quiz 4 — Warehouse & OLAP|||Quiz 4 — Warehouse & OLAP', [
  { id: 'q1', question: 'OLAP phục vụ mục đích chính?', options: ['Chạy giao dịch', 'Phân tích (tổng hợp phức tạp)', 'Lưu log', 'Xác thực'], correctIndex: 1, explanation: 'OLAP cho phân tích/tổng hợp; OLTP cho giao dịch.' },
  { id: 'q2', question: 'Phép OLAP gộp từ ngày lên tháng gọi là?', options: ['Drill-down', 'Roll-up', 'Slice', 'Pivot'], correctIndex: 1, explanation: 'Roll-up gộp lên mức thô hơn; drill-down thì ngược lại.' },
  { id: 'q3', question: 'Trong star schema, bảng chứa số đo (Sales) gọi là?', options: ['Dimension table', 'Fact table', 'Bridge table', 'Lookup'], correctIndex: 1, explanation: 'Fact table giữ measure, nối tới các dimension table.' },
]);

/* Ch6-7: Frequent patterns & association */
const c6 = doc('dbm301-6-1-association', '6.1 — Frequent patterns & association rules (Apriori)|||6.1 — Frequent patterns & association rule (Apriori)',
  'Support, confidence, lift; thuật toán Apriori (sinh ứng viên + tỉa theo tính đóng downward), sinh luật từ itemset thường xuyên; ví dụ market-basket.',
  [[
    `<span class="eyebrow">DBM301 · Chapter 6–7 · Lesson 6.1</span>
<h2>Frequent patterns &amp; association rules</h2>
<p class="lead">Market-basket analysis finds rules like <em>{bread, butter} ⇒ {milk}</em>. Three measures rank rules:</p>
<ul>
<li><strong>Support</strong>(X) = fraction of transactions containing X — how common.</li>
<li><strong>Confidence</strong>(X⇒Y) = support(X∪Y) / support(X) — how reliable.</li>
<li><strong>Lift</strong>(X⇒Y) = confidence / support(Y) — &gt; 1 means X and Y co-occur more than by chance.</li>
</ul>
<h3>The Apriori algorithm</h3>
<p>Apriori finds frequent itemsets using the <strong>downward-closure</strong> property: <em>every subset of a frequent itemset is also frequent</em> — so if {A,B} is infrequent, no superset can be frequent. It iterates: count 1-itemsets → keep those ≥ min-support → generate 2-itemset candidates from survivors → count → prune → … This pruning is what makes mining tractable.</p>
<pre><code class="language-text">min_support = 2 transactions
L1 (frequent 1-itemsets): {A}, {B}, {C}
C2 candidates: {A,B}, {A,C}, {B,C}   → count → keep {A,C}, {B,C}
C3 from L2: {A,B,C} needs {A,B} frequent — it isn't → pruned
Rules from {A,C}: A⇒C, C⇒A (keep those with confidence ≥ threshold)</code></pre>`,
    `<span class="eyebrow">DBM301 · Chương 6–7 · Bài 6.1</span>
<h2>Frequent patterns &amp; association rule</h2>
<p class="lead">Phân tích giỏ hàng tìm luật kiểu <em>{bánh mì, bơ} ⇒ {sữa}</em>. Ba độ đo xếp hạng luật:</p>
<ul>
<li><strong>Support</strong>(X) = tỉ lệ giao dịch chứa X — mức phổ biến.</li>
<li><strong>Confidence</strong>(X⇒Y) = support(X∪Y) / support(X) — độ tin cậy.</li>
<li><strong>Lift</strong>(X⇒Y) = confidence / support(Y) — &gt; 1 nghĩa X và Y đi cùng nhau nhiều hơn ngẫu nhiên.</li>
</ul>
<h3>Thuật toán Apriori</h3>
<p>Apriori tìm itemset thường xuyên nhờ tính <strong>đóng xuống dưới (downward-closure)</strong>: <em>mọi tập con của một itemset thường xuyên cũng thường xuyên</em> — nên nếu {A,B} không thường xuyên thì không siêu tập nào thường xuyên. Nó lặp: đếm 1-itemset → giữ cái ≥ min-support → sinh ứng viên 2-itemset từ cái sống sót → đếm → tỉa → … Việc tỉa này làm khai phá khả thi.</p>
<pre><code class="language-text">min_support = 2 giao dịch
L1 (1-itemset thường xuyên): {A}, {B}, {C}
C2 ứng viên: {A,B}, {A,C}, {B,C}   → đếm → giữ {A,C}, {B,C}
C3 từ L2: {A,B,C} cần {A,B} thường xuyên — không → tỉa
Luật từ {A,C}: A⇒C, C⇒A (giữ cái có confidence ≥ ngưỡng)</code></pre>`,
  ]]);

const c6e = doc('dbm301-6-2-exercise', 'Exercise 2 — support, confidence, lift|||Bài tập 2 — support, confidence, lift',
  'Bài tập: cho 5 giao dịch, tính support của {Milk,Bread}, confidence và lift của luật Milk⇒Bread; kèm lời giải.',
  [[
    `<span class="eyebrow">DBM301 · Chapter 6–7 · Exercise</span>
<h2>Exercise 2 — compute support, confidence, lift</h2>
<div class="callout"><span class="badge">Đề</span> 5 transactions: T1{Milk,Bread}, T2{Milk,Bread,Butter}, T3{Milk}, T4{Bread,Butter}, T5{Milk,Bread}. Compute support{Milk,Bread}, confidence(Milk⇒Bread), and lift(Milk⇒Bread).</div>
<h3>Worked solution</h3>
<pre><code class="language-text">count(Milk)=4 (T1,2,3,5)   support(Milk)=4/5=0.8
count(Bread)=4 (T1,2,4,5)  support(Bread)=4/5=0.8
count(Milk,Bread)=3 (T1,2,5)  support{Milk,Bread}=3/5=0.6

confidence(Milk⇒Bread) = support(Milk,Bread)/support(Milk) = 0.6/0.8 = 0.75
lift(Milk⇒Bread) = confidence/support(Bread) = 0.75/0.8 = 0.9375</code></pre>
<p><strong>Interpretation:</strong> 75% of Milk buyers also buy Bread — decent confidence. But lift ≈ 0.94 &lt; 1 means Milk and Bread are <em>slightly less</em> likely together than independence would predict, so the rule isn't a strong positive association despite its high confidence. <strong>Always check lift, not just confidence.</strong></p>`,
    `<span class="eyebrow">DBM301 · Chương 6–7 · Bài tập</span>
<h2>Bài tập 2 — tính support, confidence, lift</h2>
<div class="callout"><span class="badge">Đề</span> 5 giao dịch: T1{Milk,Bread}, T2{Milk,Bread,Butter}, T3{Milk}, T4{Bread,Butter}, T5{Milk,Bread}. Tính support{Milk,Bread}, confidence(Milk⇒Bread), và lift(Milk⇒Bread).</div>
<h3>Lời giải</h3>
<pre><code class="language-text">count(Milk)=4 (T1,2,3,5)   support(Milk)=4/5=0.8
count(Bread)=4 (T1,2,4,5)  support(Bread)=4/5=0.8
count(Milk,Bread)=3 (T1,2,5)  support{Milk,Bread}=3/5=0.6

confidence(Milk⇒Bread) = support(Milk,Bread)/support(Milk) = 0.6/0.8 = 0.75
lift(Milk⇒Bread) = confidence/support(Bread) = 0.75/0.8 = 0.9375</code></pre>
<p><strong>Diễn giải:</strong> 75% người mua Milk cũng mua Bread — confidence khá. Nhưng lift ≈ 0.94 &lt; 1 nghĩa Milk và Bread đi cùng nhau <em>hơi ít hơn</em> so với độc lập, nên luật không phải liên kết dương mạnh dù confidence cao. <strong>Luôn kiểm lift, đừng chỉ nhìn confidence.</strong></p>`,
  ]]);

const c6q = quiz('dbm301-quiz-6', 'Quiz 6 — Association rules|||Quiz 6 — Association rules', [
  { id: 'q1', question: 'confidence(X⇒Y) tính bằng?', options: ['support(Y)/support(X)', 'support(X∪Y)/support(X)', 'support(X)·support(Y)', 'support(X∪Y)'], correctIndex: 1, explanation: 'confidence = support(X∪Y)/support(X).' },
  { id: 'q2', question: 'Tính chất Apriori dựa vào?', options: ['Mọi siêu tập của tập thường xuyên là thường xuyên', 'Mọi tập con của tập thường xuyên là thường xuyên (downward closure)', 'Ngẫu nhiên', 'Lift > 1'], correctIndex: 1, explanation: 'Downward-closure: tập con của itemset thường xuyên cũng thường xuyên → tỉa ứng viên.' },
  { id: 'q3', question: 'Lift < 1 nghĩa là?', options: ['Liên kết dương mạnh', 'X,Y đi cùng ít hơn ngẫu nhiên (không phải liên kết dương)', 'Luật chắc chắn', 'Support cao'], correctIndex: 1, explanation: 'Lift<1: đồng xuất hiện thấp hơn kỳ vọng độc lập.' },
]);

/* Ch8-9: Classification */
const c8 = doc('dbm301-8-1-classification', '8.1 — Classification (decision tree, Naive Bayes)|||8.1 — Phân loại (decision tree, Naive Bayes)',
  'Học có giám sát để dự đoán nhãn; decision tree (information gain/entropy), Naive Bayes; đánh giá (train/test, confusion matrix, accuracy/precision/recall) & overfitting.',
  [[
    `<span class="eyebrow">DBM301 · Chapter 8–9 · Lesson 8.1</span>
<h2>Classification</h2>
<p class="lead">Classification learns a model from <strong>labeled</strong> data to predict the class of new records (spam/ham, will-churn/won't).</p>
<h3>Decision tree</h3>
<p>A tree splits on the attribute that best separates classes, chosen by <strong>information gain</strong> (reduction in <strong>entropy</strong>). Entropy of a set with class proportions pᵢ is <code>−Σ pᵢ·log₂(pᵢ)</code> (0 = pure, 1 = 50/50 for two classes). Trees are easy to read but overfit if grown fully — <strong>prune</strong> them.</p>
<h3>Naive Bayes</h3>
<p>Applies Bayes' theorem assuming features are conditionally independent given the class: <code>P(class | features) ∝ P(class)·Π P(featureᵢ | class)</code>. Simple, fast, strong on text.</p>
<h3>Evaluation</h3>
<p>Never test on training data. Use a held-out <strong>test set</strong> and a <strong>confusion matrix</strong>: <strong>accuracy</strong> = correct/total; <strong>precision</strong> = TP/(TP+FP); <strong>recall</strong> = TP/(TP+FN). On imbalanced data, accuracy misleads — look at precision/recall/F1.</p>`,
    `<span class="eyebrow">DBM301 · Chương 8–9 · Bài 8.1</span>
<h2>Phân loại (Classification)</h2>
<p class="lead">Phân loại học một mô hình từ dữ liệu <strong>có nhãn</strong> để dự đoán lớp của bản ghi mới (spam/ham, rời bỏ/không).</p>
<h3>Decision tree</h3>
<p>Cây tách theo thuộc tính phân tách lớp tốt nhất, chọn bằng <strong>information gain</strong> (giảm <strong>entropy</strong>). Entropy của tập với tỉ lệ lớp pᵢ là <code>−Σ pᵢ·log₂(pᵢ)</code> (0 = thuần, 1 = 50/50 cho hai lớp). Cây dễ đọc nhưng overfit nếu mọc hết — <strong>tỉa (prune)</strong>.</p>
<h3>Naive Bayes</h3>
<p>Áp định lý Bayes giả định đặc trưng độc lập có điều kiện khi biết lớp: <code>P(lớp | đặc trưng) ∝ P(lớp)·Π P(đặc trưngᵢ | lớp)</code>. Đơn giản, nhanh, mạnh với văn bản.</p>
<h3>Đánh giá</h3>
<p>Đừng bao giờ test trên dữ liệu train. Dùng <strong>test set</strong> tách riêng và một <strong>confusion matrix</strong>: <strong>accuracy</strong> = đúng/tổng; <strong>precision</strong> = TP/(TP+FP); <strong>recall</strong> = TP/(TP+FN). Với dữ liệu mất cân bằng, accuracy đánh lừa — nhìn precision/recall/F1.</p>`,
  ]]);

const c8q = quiz('dbm301-quiz-8', 'Quiz 8 — Classification|||Quiz 8 — Phân loại', [
  { id: 'q1', question: 'Decision tree chọn thuộc tính tách theo?', options: ['Ngẫu nhiên', 'Information gain (giảm entropy)', 'Support', 'Khoảng cách Euclid'], correctIndex: 1, explanation: 'Chọn thuộc tính có information gain lớn nhất (giảm entropy nhiều nhất).' },
  { id: 'q2', question: 'Trên dữ liệu MẤT CÂN BẰNG, nên nhìn metric nào?', options: ['Chỉ accuracy', 'Precision/Recall/F1', 'Support', 'Lift'], correctIndex: 1, explanation: 'Accuracy đánh lừa khi lớp lệch; precision/recall/F1 phản ánh đúng hơn.' },
  { id: 'q3', question: 'Naive Bayes giả định gì về đặc trưng?', options: ['Phụ thuộc mạnh', 'Độc lập có điều kiện khi biết lớp', 'Cùng phân bố chuẩn', 'Không giả định gì'], correctIndex: 1, explanation: 'Giả định độc lập có điều kiện — "naive" là ở đây.' },
]);

/* Ch10-11: Clustering */
const c10 = doc('dbm301-10-1-clustering', '10.1 — Clustering (k-means, hierarchical)|||10.1 — Phân cụm (k-means, hierarchical)',
  'Học không giám sát tìm nhóm; k-means (thuật toán, chọn k bằng elbow), phân cụm phân cấp (agglomerative, dendrogram), và đánh giá cụm; Weka cho thực hành.',
  [[
    `<span class="eyebrow">DBM301 · Chapter 10–11 · Lesson 10.1</span>
<h2>Clustering</h2>
<p class="lead">Clustering is <strong>unsupervised</strong>: group records so intra-cluster similarity is high and inter-cluster low — no labels needed. Uses: customer segmentation, image compression, anomaly detection.</p>
<h3>k-means</h3>
<pre><code class="language-text">1. choose k; initialize k centroids
2. assign each point to its nearest centroid (Euclidean)
3. recompute each centroid as the mean of its assigned points
4. repeat 2–3 until assignments stop changing</code></pre>
<p>k-means is fast but needs k in advance and finds spherical clusters. Pick k with the <strong>elbow method</strong> (plot within-cluster sum of squares vs k; the "elbow" is a good k). Sensitive to initialization → use k-means++ / multiple restarts.</p>
<h3>Hierarchical (agglomerative)</h3>
<p>Start with each point as its own cluster and repeatedly merge the two closest clusters, producing a <strong>dendrogram</strong> you cut at the desired number of clusters. No need to pre-set k, but O(n²) — slower on big data. <strong>Weka</strong> lets you run both on ARFF datasets and visualize the result.</p>`,
    `<span class="eyebrow">DBM301 · Chương 10–11 · Bài 10.1</span>
<h2>Phân cụm (Clustering)</h2>
<p class="lead">Phân cụm là <strong>không giám sát</strong>: gom bản ghi sao cho tương đồng trong cụm cao và giữa cụm thấp — không cần nhãn. Ứng dụng: phân khúc khách, nén ảnh, phát hiện bất thường.</p>
<h3>k-means</h3>
<pre><code class="language-text">1. chọn k; khởi tạo k centroid
2. gán mỗi điểm về centroid gần nhất (Euclid)
3. tính lại mỗi centroid = trung bình các điểm được gán
4. lặp 2–3 đến khi gán không đổi</code></pre>
<p>k-means nhanh nhưng cần biết k trước và tìm cụm dạng cầu. Chọn k bằng <strong>elbow method</strong> (vẽ tổng bình phương trong cụm theo k; "khuỷu" là k tốt). Nhạy với khởi tạo → dùng k-means++ / khởi tạo lại nhiều lần.</p>
<h3>Phân cấp (agglomerative)</h3>
<p>Bắt đầu mỗi điểm là một cụm rồi liên tục gộp hai cụm gần nhất, tạo một <strong>dendrogram</strong> mà bạn cắt ở số cụm mong muốn. Không cần đặt k trước, nhưng O(n²) — chậm trên dữ liệu lớn. <strong>Weka</strong> cho chạy cả hai trên tập ARFF và trực quan hoá kết quả.</p>`,
  ]]);

const c10q = quiz('dbm301-quiz-10', 'Quiz 10 — Clustering|||Quiz 10 — Phân cụm', [
  { id: 'q1', question: 'k-means thuộc loại học nào?', options: ['Có giám sát', 'Không giám sát', 'Tăng cường', 'Bán giám sát'], correctIndex: 1, explanation: 'Clustering không cần nhãn → unsupervised.' },
  { id: 'q2', question: 'Chọn số cụm k trong k-means thường dùng?', options: ['Confusion matrix', 'Elbow method', 'Lift', 'Entropy'], correctIndex: 1, explanation: 'Elbow: vẽ WCSS theo k, chọn ở khuỷu.' },
  { id: 'q3', question: 'Phân cụm phân cấp tạo ra?', options: ['Confusion matrix', 'Dendrogram (cắt để lấy số cụm)', 'Decision tree', 'Data cube'], correctIndex: 1, explanation: 'Agglomerative tạo dendrogram; cắt ở mức để lấy k cụm.' },
]);

const taiLieu = doc('dbm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">DBM301 · Resource hub</span>
<h2>📚 Course materials &amp; references</h2>
<p class="lead">Everything you need to study Data Mining beyond this course: the official FLM syllabus &amp; slides, reference books, free official docs, YouTube channels, tools, and a 4-step self-study roadmap. Every link is real and free to open.</p>
<h3>📘 Official syllabus &amp; slides</h3>
<div class="callout"><span class="badge">FLM</span> Log in to <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a> with your FPTU account — the full syllabus and lecture slides for DBM301 are there.</div>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.sciencedirect.com/book/9780123814791/data-mining-concepts-and-techniques" target="_blank" rel="noopener">Data Mining: Concepts and Techniques</a> — Jiawei Han, Micheline Kamber &amp; Jian Pei (Morgan Kaufmann) — the classic KDD text.</li>
<li><a href="https://www-users.cse.umn.edu/~kumar001/dmbook/index.php" target="_blank" rel="noopener">Introduction to Data Mining</a> — Tan, Steinbach, Karpatne &amp; Kumar — companion slides free online.</li>
</ul>
<h3>🌐 Free official documentation</h3>
<ul>
<li><a href="https://scikit-learn.org/stable/" target="_blank" rel="noopener">scikit-learn — user guide &amp; API</a> (classification, clustering, preprocessing).</li>
<li><a href="https://ml.cms.waikato.ac.nz/weka/" target="_blank" rel="noopener">Weka</a> — the data-mining workbench &amp; docs.</li>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">pandas documentation</a> — data wrangling.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — decision trees, Naive Bayes, clustering explained clearly.</li>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp</a> — full-length data-mining / ML courses.</li>
<li><a href="https://www.youtube.com/@sentdex" target="_blank" rel="noopener">sentdex</a> — hands-on Python data analysis.</li>
<li><a href="https://www.youtube.com/@dataschool" target="_blank" rel="noopener">Data School</a> — pandas &amp; scikit-learn workflows.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://ml.cms.waikato.ac.nz/weka/" target="_blank" rel="noopener">Weka</a> — GUI mining without code (Apriori, J48, k-means).</li>
<li><a href="https://orangedatamining.com/" target="_blank" rel="noopener">Orange</a> — visual data-mining workflows.</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — free notebooks for scikit-learn / pandas.</li>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code</a> — editor with the Python extension.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — nail data types, preprocessing, association rules, classification and clustering in this course; do every quiz.</li>
<li><strong>Small projects</strong> — run Apriori and a decision tree on a real dataset (UCI / Kaggle) in Weka, then reproduce it in scikit-learn.</li>
<li><strong>Go deeper</strong> — read Han &amp; Kamber chapters against your data; compare k-means vs hierarchical clustering and evaluate with proper metrics.</li>
<li><strong>Job-ready</strong> — build one end-to-end mining project (clean → mine → evaluate → visualize) and publish it as a portfolio notebook.</li>
</ol>`,
    `<span class="eyebrow">DBM301 · Trung tâm tài liệu</span>
<h2>📚 Tài liệu tham khảo môn học</h2>
<p class="lead">Mọi thứ để học Data Mining vượt ra ngoài môn này: giáo trình &amp; slide chính thức trên FLM, sách tham khảo, tài liệu chính thức miễn phí, kênh YouTube, công cụ, và lộ trình tự học 4 bước. Mọi link đều thật và mở được miễn phí.</p>
<h3>📘 Giáo trình &amp; slide chính thức</h3>
<div class="callout"><span class="badge">FLM</span> Đăng nhập <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a> bằng tài khoản FPTU — có giáo trình và slide đầy đủ cho DBM301.</div>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.sciencedirect.com/book/9780123814791/data-mining-concepts-and-techniques" target="_blank" rel="noopener">Data Mining: Concepts and Techniques</a> — Jiawei Han, Micheline Kamber &amp; Jian Pei (Morgan Kaufmann) — sách kinh điển về KDD.</li>
<li><a href="https://www-users.cse.umn.edu/~kumar001/dmbook/index.php" target="_blank" rel="noopener">Introduction to Data Mining</a> — Tan, Steinbach, Karpatne &amp; Kumar — slide đi kèm miễn phí.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://scikit-learn.org/stable/" target="_blank" rel="noopener">scikit-learn — user guide &amp; API</a> (phân loại, phân cụm, tiền xử lý).</li>
<li><a href="https://ml.cms.waikato.ac.nz/weka/" target="_blank" rel="noopener">Weka</a> — bộ công cụ data mining &amp; tài liệu.</li>
<li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener">Tài liệu pandas</a> — xử lý dữ liệu.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer</a> — decision tree, Naive Bayes, phân cụm giải thích rõ ràng.</li>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp</a> — khoá data mining / ML dài đầy đủ.</li>
<li><a href="https://www.youtube.com/@sentdex" target="_blank" rel="noopener">sentdex</a> — phân tích dữ liệu Python thực chiến.</li>
<li><a href="https://www.youtube.com/@dataschool" target="_blank" rel="noopener">Data School</a> — quy trình pandas &amp; scikit-learn.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://ml.cms.waikato.ac.nz/weka/" target="_blank" rel="noopener">Weka</a> — khai phá bằng giao diện, không cần code (Apriori, J48, k-means).</li>
<li><a href="https://orangedatamining.com/" target="_blank" rel="noopener">Orange</a> — luồng data mining trực quan.</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — notebook miễn phí cho scikit-learn / pandas.</li>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code</a> — trình soạn thảo kèm extension Python.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — nắm chắc kiểu dữ liệu, tiền xử lý, luật kết hợp, phân loại và phân cụm trong môn này; làm hết mọi quiz.</li>
<li><strong>Project nhỏ</strong> — chạy Apriori và một decision tree trên tập dữ liệu thật (UCI / Kaggle) bằng Weka, rồi tái hiện bằng scikit-learn.</li>
<li><strong>Đào sâu</strong> — đọc các chương Han &amp; Kamber song song với dữ liệu của bạn; so k-means với hierarchical clustering và đánh giá bằng metric đúng.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng một project khai phá end-to-end (làm sạch → khai phá → đánh giá → trực quan hoá) và công bố dưới dạng notebook portfolio.</li>
</ol>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'DBM301',
    slug: 'dbm301-data-mining',
    title: 'Data Mining',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DBM301.webp',
    shortDescription: 'Discover patterns in large data — preprocessing, data warehouse/OLAP, association rules (Apriori), classification & clustering, with Weka. Bilingual, with worked exercises.|||Khám phá mẫu trong dữ liệu lớn — tiền xử lý, data warehouse/OLAP, association rule (Apriori), classification & clustering, với Weka. Song ngữ, có bài tập giải sẵn.',
    description: 'Môn <strong>DBM301 — Khai phá dữ liệu (Data Mining)</strong> (ngành SE/AI combo, kỳ 7), theo sách Han &amp; Kamber. Đi từ hiểu &amp; tiền xử lý dữ liệu → data warehouse/OLAP &amp; data cube → các tác vụ lõi: <strong>association rules (Apriori), classification (decision tree/Naive Bayes), clustering (k-means/hierarchical)</strong> — với công cụ <strong>Weka</strong>. Bám giáo trình FLM (9 CLO), song ngữ, có ví dụ thuật toán tính tay và bài tập kèm lời giải.',
    whatYouLearn: 'Khái niệm data mining & KDD; kiểu thuộc tính, thống kê, độ đo khoảng cách; tiền xử lý (làm sạch, chuẩn hoá min-max/z-score, giảm chiều); data warehouse, OLAP & data cube; association rules (support/confidence/lift, Apriori); classification (decision tree/entropy, Naive Bayes, đánh giá precision/recall); clustering (k-means, hierarchical); công cụ Weka.',
    requirements: 'Nên biết thống kê cơ bản và SQL (DBI202). Cài Weka (miễn phí) để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Data mining là gì, KDD, 9 CLO, lộ trình.', lessons: [intro] },
    { title: 'Chương 1–2 — Dữ liệu & khái niệm|||Chapter 1–2 — Data & concepts', description: 'Kiểu thuộc tính, thống kê, khoảng cách.', lessons: [c1, c1q] },
    { title: 'Chương 3 — Tiền xử lý|||Chapter 3 — Preprocessing', description: 'Làm sạch, chuẩn hoá, giảm chiều.', lessons: [c3, c3e, c3q] },
    { title: 'Chương 4–5 — Warehouse & OLAP|||Chapter 4–5 — Warehouse & OLAP', description: 'OLTP vs OLAP, star schema, data cube.', lessons: [c4, c4q] },
    { title: 'Chương 6–7 — Association rules|||Chapter 6–7 — Association rules', description: 'Support/confidence/lift, Apriori.', lessons: [c6, c6e, c6q] },
    { title: 'Chương 8–9 — Phân loại|||Chapter 8–9 — Classification', description: 'Decision tree, Naive Bayes, đánh giá.', lessons: [c8, c8q] },
    { title: 'Chương 10–11 — Phân cụm|||Chapter 10–11 — Clustering', description: 'k-means, hierarchical, Weka.', lessons: [c10, c10q] },
  ],
};
