/**
 * BDI302c — Big Data (Dữ liệu lớn). Giáo trình FLM (sylID 12550): nguồn chính là
 * bộ MOOC "Big Data Specialization" của UC San Diego (Coursera). Công cụ: Hadoop,
 * Spark/PySpark, Cloudera VM, KNIME, MongoDB. 6 CLO, 5 module (bám 5 MOOC).
 * Mức KHUNG: đủ module/bài outline + quiz + tài liệu; đào sâu sau.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; & → &amp;; content .join('\n').
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

// ─────────────────────────────────────────────────────────────────────────────
// Tài liệu tham khảo
// ─────────────────────────────────────────────────────────────────────────────
const taiLieu = doc('bdi302c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: bộ MOOC UCSD Big Data (Coursera), tài liệu chính thức Hadoop & Spark, sách Tom White, công cụ (Cloudera VM, PySpark, KNIME, MongoDB), lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">BDI302c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Big Data</strong> — the 5V's, Hadoop &amp; HDFS, MapReduce, data modeling &amp; NoSQL, Apache Spark, machine learning at scale and graph analytics — in one place. The official FLM slides follow UC San Diego's <strong>Big Data Specialization</strong> on Coursera; below are the free, legal primary sources.</p>
<h3>🎓 Primary MOOC (the syllabus follows this)</h3>
<ul>
<li><a href="https://www.coursera.org/specializations/big-data" target="_blank" rel="noopener">UC San Diego — Big Data Specialization (Coursera)</a> — 5 courses that map 1:1 to the 5 modules below.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://hadoop.apache.org/docs/stable/" target="_blank" rel="noopener">Apache Hadoop documentation (HDFS &amp; MapReduce)</a></li>
<li><a href="https://spark.apache.org/docs/latest/" target="_blank" rel="noopener">Apache Spark documentation (RDD, DataFrame, MLlib, GraphX)</a></li>
<li><a href="https://www.mongodb.com/docs/manual/" target="_blank" rel="noopener">MongoDB Manual (document NoSQL)</a></li>
</ul>
<h3>📗 Reference book</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/hadoop-the-definitive/9781491901687/" target="_blank" rel="noopener"><em>Hadoop: The Definitive Guide</em> — Tom White (O'Reilly)</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.cloudera.com/downloads/quickstart_vms.html" target="_blank" rel="noopener">Cloudera QuickStart VM</a> — a ready-made Hadoop cluster in a virtual machine.</li>
<li><a href="https://spark.apache.org/docs/latest/api/python/" target="_blank" rel="noopener">PySpark (Python API for Spark)</a> — write Spark jobs in Python.</li>
<li><a href="https://www.knime.com/" target="_blank" rel="noopener">KNIME Analytics Platform</a> — visual, no-code machine-learning pipelines.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what Big Data is, the 5V's, why one machine isn't enough (scale out), HDFS &amp; MapReduce.</li>
<li><strong>Store &amp; model</strong> — data models, NoSQL vs relational, how to design a big-data management system.</li>
<li><strong>Process &amp; analyze</strong> — Apache Spark, integrate data from MongoDB, then machine learning (KNIME / Spark MLlib) and graph analytics.</li>
<li><strong>Exam-ready</strong> — finish the 5 MOOC courses (unlocks the exam + 1 bonus point), then revise the 75 multiple-choice topics.</li>
</ol></div>`,
    `<span class="eyebrow">BDI302c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Dữ liệu lớn (Big Data)</strong> — 5 chữ V, Hadoop &amp; HDFS, MapReduce, mô hình hoá &amp; NoSQL, Apache Spark, học máy ở quy mô lớn và phân tích đồ thị — gom về một chỗ. Slide chính thức trên FLM bám theo bộ <strong>Big Data Specialization</strong> của UC San Diego trên Coursera; bên dưới là các nguồn gốc miễn phí, hợp pháp.</p>
<h3>🎓 Bộ MOOC gốc (giáo trình bám theo bộ này)</h3>
<ul>
<li><a href="https://www.coursera.org/specializations/big-data" target="_blank" rel="noopener">UC San Diego — Big Data Specialization (Coursera)</a> — 5 khoá ứng 1:1 với 5 module bên dưới.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://hadoop.apache.org/docs/stable/" target="_blank" rel="noopener">Tài liệu Apache Hadoop (HDFS &amp; MapReduce)</a></li>
<li><a href="https://spark.apache.org/docs/latest/" target="_blank" rel="noopener">Tài liệu Apache Spark (RDD, DataFrame, MLlib, GraphX)</a></li>
<li><a href="https://www.mongodb.com/docs/manual/" target="_blank" rel="noopener">MongoDB Manual (NoSQL dạng tài liệu)</a></li>
</ul>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/hadoop-the-definitive/9781491901687/" target="_blank" rel="noopener"><em>Hadoop: The Definitive Guide</em> — Tom White (O'Reilly)</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.cloudera.com/downloads/quickstart_vms.html" target="_blank" rel="noopener">Cloudera QuickStart VM</a> — một cụm Hadoop dựng sẵn trong máy ảo.</li>
<li><a href="https://spark.apache.org/docs/latest/api/python/" target="_blank" rel="noopener">PySpark (API Python cho Spark)</a> — viết job Spark bằng Python.</li>
<li><a href="https://www.knime.com/" target="_blank" rel="noopener">KNIME Analytics Platform</a> — dựng pipeline học máy trực quan, không cần code.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — Big Data là gì, 5 chữ V, vì sao một máy là không đủ (mở rộng theo chiều ngang), HDFS &amp; MapReduce.</li>
<li><strong>Lưu &amp; mô hình hoá</strong> — mô hình dữ liệu, NoSQL so với quan hệ, thiết kế hệ thống quản lý dữ liệu lớn.</li>
<li><strong>Xử lý &amp; phân tích</strong> — Apache Spark, tích hợp dữ liệu từ MongoDB, rồi học máy (KNIME / Spark MLlib) và phân tích đồ thị.</li>
<li><strong>Sẵn sàng thi</strong> — hoàn thành 5 khoá MOOC (mở quyền thi + 1 điểm thưởng), rồi ôn 75 chủ đề trắc nghiệm.</li>
</ol></div>`,
  ]]);

// ─────────────────────────────────────────────────────────────────────────────
// Giới thiệu môn học
// ─────────────────────────────────────────────────────────────────────────────
const intro = doc('bdi302c-0-1-overview', 'Course overview: what is Big Data|||Tổng quan: Big Data là gì',
  'Big Data là gì; đặc trưng 5V (Volume/Velocity/Variety/Veracity/Value); 6 CLO; công cụ Hadoop & Spark; cơ cấu điểm (thi cuối 100% - 75 câu trắc nghiệm, hoàn thành MOOC để đủ điều kiện thi + 1 điểm thưởng).',
  [[
    `<span class="eyebrow">BDI302c · Lesson 0.1 · Overview</span>
<h2>What is Big Data?</h2>
<p class="lead"><strong>Big Data</strong> is data too large, too fast, or too varied for a single machine and traditional tools to store and process. The answer is to <strong>scale out</strong> — spread the data and the computation across a cluster of ordinary machines, with frameworks like <strong>Hadoop</strong> and <strong>Spark</strong> hiding the coordination.</p>
<h3>The 5 V's</h3>
<ul>
<li><strong>Volume</strong> — the sheer amount of data (terabytes → petabytes).</li>
<li><strong>Velocity</strong> — how fast data arrives and must be processed (batch vs streaming).</li>
<li><strong>Variety</strong> — structured tables, semi-structured JSON/logs, unstructured text/images.</li>
<li><strong>Veracity</strong> — how trustworthy / clean the data is (noise, gaps, bias).</li>
<li><strong>Value</strong> — the insight you actually extract — the reason for all the effort.</li>
</ul>
<h3>Course learning outcomes (6 CLOs)</h3>
<ol>
<li><strong>CLO1</strong> — explain Big Data concepts, the 5V's and Hadoop (HDFS, MapReduce).</li>
<li><strong>CLO2</strong> — model big data.</li>
<li><strong>CLO3</strong> — use big-data management systems (DBMS &amp; NoSQL).</li>
<li><strong>CLO4</strong> — integrate and process big data with Apache Spark.</li>
<li><strong>CLO5</strong> — apply machine learning to big data.</li>
<li><strong>CLO6</strong> — perform graph analytics on big data.</li>
</ol>
<h3>Grading &amp; tools</h3>
<p>Assessment is a <strong>Final Exam = 100%</strong> (75 multiple-choice questions). You must <strong>complete the MOOC courses</strong> to be eligible to sit the exam, and completion earns a <strong>1-point bonus</strong>. Core tools: <strong>Hadoop</strong> (storage + batch) and <strong>Spark</strong> (fast in-memory processing).</p>`,
    `<span class="eyebrow">BDI302c · Bài 0.1 · Tổng quan</span>
<h2>Big Data là gì?</h2>
<p class="lead"><strong>Dữ liệu lớn (Big Data)</strong> là dữ liệu quá lớn, quá nhanh, hoặc quá đa dạng để một máy đơn và công cụ truyền thống lưu và xử lý nổi. Lời giải là <strong>mở rộng theo chiều ngang</strong> — trải dữ liệu và phép tính trên một cụm nhiều máy thường, với các nền tảng như <strong>Hadoop</strong> và <strong>Spark</strong> lo phần điều phối.</p>
<h3>5 chữ V</h3>
<ul>
<li><strong>Volume (khối lượng)</strong> — lượng dữ liệu khổng lồ (terabyte → petabyte).</li>
<li><strong>Velocity (vận tốc)</strong> — dữ liệu đến và cần xử lý nhanh cỡ nào (theo lô hay theo luồng).</li>
<li><strong>Variety (đa dạng)</strong> — bảng có cấu trúc, JSON/log bán cấu trúc, văn bản/ảnh không cấu trúc.</li>
<li><strong>Veracity (độ tin cậy)</strong> — dữ liệu sạch/đáng tin tới đâu (nhiễu, thiếu, thiên lệch).</li>
<li><strong>Value (giá trị)</strong> — tri thức bạn thực sự rút ra — lý do của mọi công sức.</li>
</ul>
<h3>Chuẩn đầu ra môn học (6 CLO)</h3>
<ol>
<li><strong>CLO1</strong> — giải thích khái niệm Big Data, 5 chữ V và Hadoop (HDFS, MapReduce).</li>
<li><strong>CLO2</strong> — mô hình hoá dữ liệu lớn.</li>
<li><strong>CLO3</strong> — dùng hệ quản trị dữ liệu lớn (DBMS &amp; NoSQL).</li>
<li><strong>CLO4</strong> — tích hợp và xử lý dữ liệu lớn bằng Apache Spark.</li>
<li><strong>CLO5</strong> — áp dụng học máy cho dữ liệu lớn.</li>
<li><strong>CLO6</strong> — phân tích đồ thị trên dữ liệu lớn.</li>
</ol>
<h3>Cơ cấu điểm &amp; công cụ</h3>
<p>Đánh giá là một <strong>bài thi cuối kỳ = 100%</strong> (75 câu trắc nghiệm). Bạn phải <strong>hoàn thành các khoá MOOC</strong> để đủ điều kiện dự thi, và hoàn thành được cộng <strong>1 điểm thưởng</strong>. Công cụ lõi: <strong>Hadoop</strong> (lưu trữ + xử lý lô) và <strong>Spark</strong> (xử lý nhanh trong bộ nhớ).</p>`,
  ]]);

// ─────────────────────────────────────────────────────────────────────────────
// Module 1 — Introduction to Big Data (CLO1)
// ─────────────────────────────────────────────────────────────────────────────
const m1 = doc('bdi302c-1-1-hadoop-hdfs-mapreduce', '1.1 — Why Big Data, scalability & Hadoop|||1.1 — Vì sao Big Data, khả năng mở rộng & Hadoop',
  'Big Data why & where; 5V & scalability (scale up vs scale out); nền tảng hệ thống & lập trình; bắt đầu với Hadoop — HDFS (lưu phân tán, khối, sao chép) và MapReduce (map → shuffle → reduce).',
  [[
    `<span class="eyebrow">BDI302c · Module 1 · Lesson 1.1</span>
<h2>Why Big Data, scalability &amp; Hadoop</h2>
<h3>Scale up vs scale out</h3>
<p>When data outgrows one server you can <strong>scale up</strong> (buy a bigger machine — hits a ceiling and gets expensive) or <strong>scale out</strong> (add many commodity machines). Big Data platforms choose scale-out: store the data across the cluster and <em>move the computation to the data</em> instead of the data to the computation.</p>
<h3>HDFS — the distributed file system</h3>
<ul>
<li>A big file is split into fixed-size <strong>blocks</strong> (e.g. 128 MB) spread across many <strong>DataNodes</strong>.</li>
<li>The <strong>NameNode</strong> keeps the metadata (which blocks live where).</li>
<li>Each block is <strong>replicated</strong> (default 3×) so a dead disk loses no data.</li>
</ul>
<h3>MapReduce — the batch programming model</h3>
<p>A job is expressed as two functions the framework runs in parallel: <strong>map</strong> (emit key/value pairs from each record), then <strong>shuffle</strong> (group by key), then <strong>reduce</strong> (aggregate each group).</p>
<pre><code class="language-python"># Classic word count, expressed as map + reduce (pseudocode)
def map(document):
    for word in document.split():
        emit(word, 1)          # (key, value)

def reduce(word, counts):
    emit(word, sum(counts))    # total occurrences of each word
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Hadoop = <strong>HDFS</strong> (store data across the cluster, fault-tolerant) + <strong>MapReduce</strong> (process it in parallel where it lives). Later modules replace MapReduce with the faster Spark, but the storage idea stays.</div>`,
    `<span class="eyebrow">BDI302c · Module 1 · Bài 1.1</span>
<h2>Vì sao Big Data, khả năng mở rộng &amp; Hadoop</h2>
<h3>Mở rộng dọc và mở rộng ngang</h3>
<p>Khi dữ liệu vượt sức một máy chủ, bạn có thể <strong>mở rộng dọc (scale up)</strong> (mua máy mạnh hơn — sớm chạm trần và đắt) hoặc <strong>mở rộng ngang (scale out)</strong> (thêm nhiều máy thường). Nền tảng Big Data chọn mở rộng ngang: lưu dữ liệu trải khắp cụm và <em>đưa phép tính tới dữ liệu</em> thay vì đưa dữ liệu tới phép tính.</p>
<h3>HDFS — hệ thống tệp phân tán</h3>
<ul>
<li>Một tệp lớn được chia thành các <strong>khối (block)</strong> kích thước cố định (vd 128 MB) trải trên nhiều <strong>DataNode</strong>.</li>
<li><strong>NameNode</strong> giữ siêu dữ liệu (khối nào nằm ở đâu).</li>
<li>Mỗi khối được <strong>sao chép (replicate)</strong> (mặc định 3 bản) để một ổ đĩa hỏng không mất dữ liệu.</li>
</ul>
<h3>MapReduce — mô hình lập trình xử lý lô</h3>
<p>Một job diễn đạt bằng hai hàm mà nền tảng chạy song song: <strong>map</strong> (phát cặp khoá/giá trị từ mỗi bản ghi), rồi <strong>shuffle</strong> (gom theo khoá), rồi <strong>reduce</strong> (tổng hợp từng nhóm).</p>
<pre><code class="language-python"># Đếm từ kinh điển, viết dạng map + reduce (mã giả)
def map(document):
    for word in document.split():
        emit(word, 1)          # (khoa, gia_tri)

def reduce(word, counts):
    emit(word, sum(counts))    # tong so lan xuat hien moi tu
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Hadoop = <strong>HDFS</strong> (lưu dữ liệu khắp cụm, chịu lỗi) + <strong>MapReduce</strong> (xử lý song song ngay nơi dữ liệu nằm). Các module sau thay MapReduce bằng Spark nhanh hơn, nhưng ý tưởng lưu trữ vẫn giữ.</div>`,
  ]]);

const m1q = quiz('bdi302c-quiz-1', 'Quiz 1 — Intro & Hadoop|||Quiz 1 — Giới thiệu & Hadoop', [
  { id: 'q1', question: 'Which set names the 5V\'s of Big Data?|||Bộ nào là 5 chữ V của Big Data?', options: ['Volume, Velocity, Variety, Veracity, Value', 'Volume, Version, Variety, Vector, Value', 'Velocity, Volume, Virtual, Value, View', 'Variety, Volume, Vertex, Vector, Veracity'], correctIndex: 0, explanation: 'Volume, Velocity, Variety, Veracity, Value.' },
  { id: 'q2', question: 'In HDFS, what keeps the metadata (which block lives on which node)?|||Trong HDFS, thành phần nào giữ siêu dữ liệu (khối nào ở node nào)?', options: ['DataNode', 'NameNode', 'Reducer', 'Mapper'], correctIndex: 1, explanation: 'NameNode giữ metadata; DataNode lưu khối dữ liệu thật.' },
  { id: 'q3', question: 'The correct order of a MapReduce job is?|||Thứ tự đúng của một job MapReduce là?', options: ['reduce → shuffle → map', 'map → shuffle → reduce', 'shuffle → map → reduce', 'map → reduce → shuffle'], correctIndex: 1, explanation: 'map (phát key/value) → shuffle (gom theo key) → reduce (tổng hợp).' },
]);

// ─────────────────────────────────────────────────────────────────────────────
// Module 2 — Big Data Modeling & Management Systems (CLO2, CLO3)
// ─────────────────────────────────────────────────────────────────────────────
const m2 = doc('bdi302c-2-1-modeling-nosql', '2.1 — Data modeling & management systems|||2.1 — Mô hình hoá & hệ quản trị dữ liệu',
  'Mô hình hoá dữ liệu lớn (structured/semi/unstructured); hệ quản trị: relational DBMS so với NoSQL (key-value, document, column, graph); khi nào chọn cái nào; thiết kế hệ thống quản lý dữ liệu lớn.',
  [[
    `<span class="eyebrow">BDI302c · Module 2 · Lesson 2.1</span>
<h2>Data modeling &amp; management systems</h2>
<h3>Modeling the data</h3>
<p>Before you store data you decide its <strong>model</strong> — the shape and the rules. Big Data spans three shapes: <strong>structured</strong> (rows &amp; columns), <strong>semi-structured</strong> (JSON, XML, logs — fields but no fixed schema) and <strong>unstructured</strong> (text, images, audio).</p>
<h3>Relational vs NoSQL</h3>
<p>A <strong>relational DBMS</strong> enforces a fixed schema and gives you SQL joins and strong consistency — great for structured data, harder to scale out. <strong>NoSQL</strong> trades some of that for horizontal scale and flexible schemas. Four families:</p>
<ul>
<li><strong>Key-value</strong> (Redis) — a giant hash map; fastest lookups by key.</li>
<li><strong>Document</strong> (MongoDB) — JSON documents; flexible fields per record.</li>
<li><strong>Column-family</strong> (Cassandra, HBase) — wide, sparse tables at massive scale.</li>
<li><strong>Graph</strong> (Neo4j) — nodes &amp; relationships; for connected data (Module 5).</li>
</ul>
<pre><code class="language-sql">-- Relational: a fixed schema, then query with SQL
CREATE TABLE sensor_reading (
  sensor_id INT,
  ts        TIMESTAMP,
  temp_c    DECIMAL(5,2)
);
SELECT sensor_id, AVG(temp_c) AS avg_temp
FROM sensor_reading
GROUP BY sensor_id;
</code></pre>
<div class="callout"><span class="badge">Choose by need</span> Pick the store by access pattern: SQL for structured &amp; joins; document NoSQL for flexible, semi-structured records at scale; graph when the <em>relationships</em> are the point.</div>`,
    `<span class="eyebrow">BDI302c · Module 2 · Bài 2.1</span>
<h2>Mô hình hoá &amp; hệ quản trị dữ liệu</h2>
<h3>Mô hình hoá dữ liệu</h3>
<p>Trước khi lưu, bạn quyết định <strong>mô hình</strong> của dữ liệu — hình dạng và luật. Big Data trải ba hình dạng: <strong>có cấu trúc</strong> (hàng &amp; cột), <strong>bán cấu trúc</strong> (JSON, XML, log — có trường nhưng không cố định lược đồ) và <strong>không cấu trúc</strong> (văn bản, ảnh, âm thanh).</p>
<h3>Quan hệ so với NoSQL</h3>
<p>Một <strong>DBMS quan hệ</strong> áp lược đồ cố định và cho bạn phép JOIN của SQL cùng tính nhất quán mạnh — hợp dữ liệu có cấu trúc, nhưng khó mở rộng ngang. <strong>NoSQL</strong> đánh đổi một phần điều đó lấy khả năng mở rộng ngang và lược đồ linh hoạt. Bốn họ:</p>
<ul>
<li><strong>Key-value</strong> (Redis) — một bảng băm khổng lồ; tra theo khoá nhanh nhất.</li>
<li><strong>Document</strong> (MongoDB) — tài liệu JSON; mỗi bản ghi có trường linh hoạt.</li>
<li><strong>Column-family</strong> (Cassandra, HBase) — bảng rộng, thưa, quy mô cực lớn.</li>
<li><strong>Graph</strong> (Neo4j) — nút &amp; quan hệ; cho dữ liệu liên kết (Module 5).</li>
</ul>
<pre><code class="language-sql">-- Quan he: l:l. luoc do co dinh, roi truy van bang SQL
CREATE TABLE sensor_reading (
  sensor_id INT,
  ts        TIMESTAMP,
  temp_c    DECIMAL(5,2)
);
SELECT sensor_id, AVG(temp_c) AS avg_temp
FROM sensor_reading
GROUP BY sensor_id;
</code></pre>
<div class="callout"><span class="badge">Chọn theo nhu cầu</span> Chọn kho theo kiểu truy cập: SQL cho dữ liệu có cấu trúc &amp; JOIN; NoSQL dạng document cho bản ghi bán cấu trúc, linh hoạt, quy mô lớn; graph khi chính <em>quan hệ</em> mới là điều quan trọng.</div>`,
  ]]);

const m2q = quiz('bdi302c-quiz-2', 'Quiz 2 — Modeling & NoSQL|||Quiz 2 — Mô hình hoá & NoSQL', [
  { id: 'q1', question: 'JSON, XML and log files are best described as?|||JSON, XML và tệp log được mô tả đúng nhất là?', options: ['Structured|||Có cấu trúc', 'Semi-structured|||Bán cấu trúc', 'Unstructured|||Không cấu trúc', 'Binary|||Nhị phân'], correctIndex: 1, explanation: 'Có trường nhưng không cố định lược đồ → bán cấu trúc.' },
  { id: 'q2', question: 'Which NoSQL family does MongoDB belong to?|||MongoDB thuộc họ NoSQL nào?', options: ['Key-value', 'Document', 'Column-family', 'Graph'], correctIndex: 1, explanation: 'MongoDB lưu tài liệu JSON → cơ sở dữ liệu dạng document.' },
  { id: 'q3', question: 'A key strength of relational DBMS over most NoSQL stores is?|||Điểm mạnh của DBMS quan hệ so với phần lớn kho NoSQL là?', options: ['Schema-less flexibility|||Không cần lược đồ', 'SQL joins & strong consistency|||JOIN của SQL & nhất quán mạnh', 'Easier horizontal scale-out|||Dễ mở rộng ngang hơn', 'Storing images natively|||Lưu ảnh gốc'], correctIndex: 1, explanation: 'Quan hệ mạnh về JOIN và nhất quán; NoSQL mạnh về mở rộng ngang.' },
]);

// ─────────────────────────────────────────────────────────────────────────────
// Module 3 — Big Data Integration & Processing (CLO3, CLO4)
// ─────────────────────────────────────────────────────────────────────────────
const m3 = doc('bdi302c-3-1-spark-integration', '3.1 — Integration & processing with Apache Spark|||3.1 — Tích hợp & xử lý với Apache Spark',
  'Truy xuất & tích hợp dữ liệu lớn; Apache Spark (RDD, DataFrame, xử lý trong bộ nhớ nhanh hơn MapReduce); đọc dữ liệu từ MongoDB vào Spark; biến đổi (transformation) & hành động (action) trong PySpark.',
  [[
    `<span class="eyebrow">BDI302c · Module 3 · Lesson 3.1</span>
<h2>Integration &amp; processing with Apache Spark</h2>
<h3>Retrieve, integrate, process</h3>
<p>Real pipelines pull data from many sources (files, databases, streams), <strong>integrate</strong> them into one view, then <strong>process</strong> at scale. <strong>Apache Spark</strong> is the engine of choice: it keeps working data <em>in memory</em>, so iterative jobs run far faster than disk-bound MapReduce.</p>
<h3>Spark's abstractions</h3>
<ul>
<li><strong>RDD</strong> — a distributed, fault-tolerant collection (the low-level core).</li>
<li><strong>DataFrame</strong> — a distributed table with named columns; the everyday API.</li>
<li><strong>Transformations</strong> (filter, select, groupBy) are <em>lazy</em>; <strong>actions</strong> (count, collect, show) trigger the real computation.</li>
</ul>
<pre><code class="language-python">from pyspark.sql import SparkSession, functions as F

spark = SparkSession.builder.appName("readings").getOrCreate()

# Integrate: read a DataFrame from MongoDB
df = (spark.read.format("mongo")
      .option("uri", "mongodb://localhost/iot.readings")
      .load())

# Process: average temperature per sensor
result = (df.filter(F.col("temp_c").isNotNull())
            .groupBy("sensor_id")
            .agg(F.avg("temp_c").alias("avg_temp")))

result.show()   # action -> runs the job
</code></pre>
<div class="callout"><span class="badge">Why Spark won</span> Same distributed idea as MapReduce, but in-memory + a rich DataFrame API. One engine covers integration, batch, SQL, streaming, ML (Module 4) and graphs (Module 5).</div>`,
    `<span class="eyebrow">BDI302c · Module 3 · Bài 3.1</span>
<h2>Tích hợp &amp; xử lý với Apache Spark</h2>
<h3>Truy xuất, tích hợp, xử lý</h3>
<p>Pipeline thực tế kéo dữ liệu từ nhiều nguồn (tệp, cơ sở dữ liệu, luồng), <strong>tích hợp</strong> chúng thành một góc nhìn, rồi <strong>xử lý</strong> ở quy mô lớn. <strong>Apache Spark</strong> là engine được chọn: nó giữ dữ liệu đang làm <em>trong bộ nhớ</em>, nên job lặp chạy nhanh hơn hẳn MapReduce vốn phải ghi đọc đĩa.</p>
<h3>Các trừu tượng của Spark</h3>
<ul>
<li><strong>RDD</strong> — tập hợp phân tán, chịu lỗi (lõi mức thấp).</li>
<li><strong>DataFrame</strong> — bảng phân tán có tên cột; API dùng hằng ngày.</li>
<li><strong>Transformation</strong> (filter, select, groupBy) là <em>lười (lazy)</em>; <strong>action</strong> (count, collect, show) mới kích hoạt tính toán thật.</li>
</ul>
<pre><code class="language-python">from pyspark.sql import SparkSession, functions as F

spark = SparkSession.builder.appName("readings").getOrCreate()

# Tich hop: doc DataFrame tu MongoDB
df = (spark.read.format("mongo")
      .option("uri", "mongodb://localhost/iot.readings")
      .load())

# Xu ly: nhiet do trung binh moi cam bien
result = (df.filter(F.col("temp_c").isNotNull())
            .groupBy("sensor_id")
            .agg(F.avg("temp_c").alias("avg_temp")))

result.show()   # action -> chay job
</code></pre>
<div class="callout"><span class="badge">Vì sao Spark thắng</span> Cùng ý tưởng phân tán như MapReduce, nhưng chạy trong bộ nhớ + API DataFrame giàu tính năng. Một engine lo cả tích hợp, xử lý lô, SQL, luồng, ML (Module 4) và đồ thị (Module 5).</div>`,
  ]]);

const m3q = quiz('bdi302c-quiz-3', 'Quiz 3 — Spark & processing|||Quiz 3 — Spark & xử lý', [
  { id: 'q1', question: 'Why is Spark typically faster than classic MapReduce?|||Vì sao Spark thường nhanh hơn MapReduce cổ điển?', options: ['It skips fault tolerance|||Nó bỏ chịu lỗi', 'It keeps working data in memory|||Nó giữ dữ liệu trong bộ nhớ', 'It runs on a single machine|||Nó chạy trên một máy', 'It avoids the network|||Nó tránh dùng mạng'], correctIndex: 1, explanation: 'Spark xử lý trong bộ nhớ nên job lặp nhanh hơn MapReduce ghi đọc đĩa.' },
  { id: 'q2', question: 'In Spark, which is an ACTION (not a transformation)?|||Trong Spark, cái nào là ACTION (không phải transformation)?', options: ['filter', 'select', 'groupBy', 'show / count'], correctIndex: 3, explanation: 'show/count/collect là action, kích hoạt tính toán; filter/select/groupBy là transformation lười.' },
  { id: 'q3', question: 'The everyday Spark API for a distributed table with named columns is?|||API Spark dùng hằng ngày cho bảng phân tán có tên cột là?', options: ['RDD', 'DataFrame', 'NameNode', 'Reducer'], correctIndex: 1, explanation: 'DataFrame là bảng phân tán có tên cột; RDD là lõi mức thấp hơn.' },
]);

// ─────────────────────────────────────────────────────────────────────────────
// Module 4 — Machine Learning with Big Data (CLO5)
// ─────────────────────────────────────────────────────────────────────────────
const m4 = doc('bdi302c-4-1-ml-big-data', '4.1 — Machine learning with big data|||4.1 — Học máy với dữ liệu lớn',
  'Khám phá & chuẩn bị dữ liệu (làm sạch, đặc trưng); phân loại (classification); đánh giá mô hình (train/test, độ chính xác); hồi quy, phân cụm (clustering), luật kết hợp (association); công cụ KNIME & Spark MLlib.',
  [[
    `<span class="eyebrow">BDI302c · Module 4 · Lesson 4.1</span>
<h2>Machine learning with big data</h2>
<h3>Explore &amp; prepare first</h3>
<p>Most ML effort is <strong>data preparation</strong>: explore the data, handle missing values, remove outliers, and build <strong>features</strong>. Garbage in, garbage out — a clean feature table matters more than a fancy algorithm.</p>
<h3>The main learning tasks</h3>
<ul>
<li><strong>Classification</strong> — predict a category (spam / not-spam).</li>
<li><strong>Regression</strong> — predict a number (tomorrow's temperature).</li>
<li><strong>Clustering</strong> — group similar records with no labels (customer segments, e.g. k-means).</li>
<li><strong>Association</strong> — find items that co-occur ("bought together").</li>
</ul>
<h3>Evaluate honestly</h3>
<p>Split data into <strong>train</strong> and <strong>test</strong>; fit on train, measure on the unseen test set (accuracy, precision/recall). Tools: <strong>KNIME</strong> for visual no-code pipelines, <strong>Spark MLlib</strong> to train at cluster scale.</p>
<pre><code class="language-python">from pyspark.ml.classification import LogisticRegression

train, test = df.randomSplit([0.8, 0.2], seed=42)

model = LogisticRegression(featuresCol="features", labelCol="label").fit(train)

preds = model.transform(test)   # evaluate on the unseen 20%
preds.select("label", "prediction").show(5)
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Always score a model on data it never saw during training — good training accuracy alone proves nothing.</div>`,
    `<span class="eyebrow">BDI302c · Module 4 · Bài 4.1</span>
<h2>Học máy với dữ liệu lớn</h2>
<h3>Khám phá &amp; chuẩn bị trước</h3>
<p>Phần lớn công sức ML nằm ở <strong>chuẩn bị dữ liệu</strong>: khám phá dữ liệu, xử lý giá trị thiếu, loại ngoại lai, và tạo <strong>đặc trưng (feature)</strong>. Rác vào thì rác ra — một bảng đặc trưng sạch quan trọng hơn một thuật toán hoa mỹ.</p>
<h3>Các bài toán học chính</h3>
<ul>
<li><strong>Phân loại (classification)</strong> — dự đoán một nhãn/lớp (spam / không spam).</li>
<li><strong>Hồi quy (regression)</strong> — dự đoán một con số (nhiệt độ ngày mai).</li>
<li><strong>Phân cụm (clustering)</strong> — gom bản ghi giống nhau khi không có nhãn (phân khúc khách hàng, vd k-means).</li>
<li><strong>Luật kết hợp (association)</strong> — tìm các mục hay đi cùng nhau ("mua chung").</li>
</ul>
<h3>Đánh giá trung thực</h3>
<p>Chia dữ liệu thành <strong>train</strong> và <strong>test</strong>; huấn luyện trên train, đo trên tập test chưa thấy (độ chính xác, precision/recall). Công cụ: <strong>KNIME</strong> cho pipeline trực quan không code, <strong>Spark MLlib</strong> để huấn luyện ở quy mô cụm.</p>
<pre><code class="language-python">from pyspark.ml.classification import LogisticRegression

train, test = df.randomSplit([0.8, 0.2], seed=42)

model = LogisticRegression(featuresCol="features", labelCol="label").fit(train)

preds = model.transform(test)   # danh gia tren 20% chua thay
preds.select("label", "prediction").show(5)
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> Luôn chấm mô hình trên dữ liệu nó chưa từng thấy khi huấn luyện — độ chính xác trên train cao không chứng minh điều gì.</div>`,
  ]]);

const m4q = quiz('bdi302c-quiz-4', 'Quiz 4 — ML with big data|||Quiz 4 — Học máy dữ liệu lớn', [
  { id: 'q1', question: 'Grouping records with NO labels into similar groups is?|||Gom các bản ghi KHÔNG có nhãn thành nhóm giống nhau là?', options: ['Classification|||Phân loại', 'Regression|||Hồi quy', 'Clustering|||Phân cụm', 'Association|||Luật kết hợp'], correctIndex: 2, explanation: 'Không nhãn, gom theo độ tương tự → clustering (vd k-means).' },
  { id: 'q2', question: 'Why split data into train and test sets?|||Vì sao chia dữ liệu thành tập train và test?', options: ['To train faster|||Để huấn luyện nhanh hơn', 'To measure the model on unseen data|||Để đo mô hình trên dữ liệu chưa thấy', 'To save disk space|||Để tiết kiệm đĩa', 'To remove missing values|||Để loại giá trị thiếu'], correctIndex: 1, explanation: 'Đo trên tập test chưa thấy mới phản ánh khả năng tổng quát hoá.' },
  { id: 'q3', question: 'Predicting a numeric value such as tomorrow\'s temperature is?|||Dự đoán một giá trị số như nhiệt độ ngày mai là?', options: ['Classification|||Phân loại', 'Regression|||Hồi quy', 'Clustering|||Phân cụm', 'Association|||Luật kết hợp'], correctIndex: 1, explanation: 'Đầu ra là số liên tục → hồi quy (regression).' },
]);

// ─────────────────────────────────────────────────────────────────────────────
// Module 5 — Graph Analytics for Big Data (CLO6)
// ─────────────────────────────────────────────────────────────────────────────
const m5 = doc('bdi302c-5-1-graph-analytics', '5.1 — Graph analytics for big data|||5.1 — Phân tích đồ thị cho dữ liệu lớn',
  'Giới thiệu đồ thị (nút/cạnh, có hướng/vô hướng); graph analytics (đường đi ngắn nhất, PageRank, phát hiện cộng đồng); kỹ thuật phân tích; nền tảng tính toán đồ thị (GraphX, Giraph, Neo4j).',
  [[
    `<span class="eyebrow">BDI302c · Module 5 · Lesson 5.1</span>
<h2>Graph analytics for big data</h2>
<h3>What is a graph?</h3>
<p>A <strong>graph</strong> models <em>connections</em>: <strong>nodes</strong> (vertices — people, pages, products) joined by <strong>edges</strong> (relationships — friend, links-to, bought-with). Edges can be <strong>directed</strong> (follows) or <strong>undirected</strong> (friends), and carry weights. Social networks, the web and recommendation systems are all graphs.</p>
<h3>What graph analytics computes</h3>
<ul>
<li><strong>Shortest path</strong> — fewest hops between two nodes.</li>
<li><strong>PageRank</strong> — importance of a node from who links to it.</li>
<li><strong>Community detection</strong> — clusters of tightly connected nodes.</li>
<li><strong>Centrality</strong> — which nodes are hubs / bridges.</li>
</ul>
<h3>Platforms</h3>
<p>At scale you use a graph engine: <strong>Spark GraphX</strong> (graphs on top of Spark), <strong>Apache Giraph</strong> (Pregel-style, vertex-centric), or the <strong>Neo4j</strong> graph database with its Cypher query language.</p>
<pre><code class="language-sql">// Neo4j Cypher: friends-of-friends of Alice she isn't yet connected to
MATCH (a:Person {name:'Alice'})-[:FRIEND]->()-[:FRIEND]->(fof)
WHERE NOT (a)-[:FRIEND]->(fof) AND a &lt;&gt; fof
RETURN DISTINCT fof.name;
</code></pre>
<div class="callout"><span class="badge">When to reach for a graph</span> When the <em>relationships</em> are the analysis — recommendations, fraud rings, influence, routing — a graph model beats joining flat tables over and over.</div>`,
    `<span class="eyebrow">BDI302c · Module 5 · Bài 5.1</span>
<h2>Phân tích đồ thị cho dữ liệu lớn</h2>
<h3>Đồ thị là gì?</h3>
<p>Một <strong>đồ thị (graph)</strong> mô hình hoá <em>các mối nối</em>: <strong>nút (node/đỉnh)</strong> (người, trang, sản phẩm) nối bằng <strong>cạnh (edge)</strong> (quan hệ — bạn bè, liên kết tới, mua chung). Cạnh có thể <strong>có hướng</strong> (theo dõi) hoặc <strong>vô hướng</strong> (bạn bè), và mang trọng số. Mạng xã hội, web và hệ gợi ý đều là đồ thị.</p>
<h3>Graph analytics tính gì</h3>
<ul>
<li><strong>Đường đi ngắn nhất</strong> — ít bước nhất giữa hai nút.</li>
<li><strong>PageRank</strong> — độ quan trọng của một nút dựa trên ai trỏ tới nó.</li>
<li><strong>Phát hiện cộng đồng</strong> — cụm các nút nối chặt với nhau.</li>
<li><strong>Trung tâm (centrality)</strong> — nút nào là đầu mối / cầu nối.</li>
</ul>
<h3>Nền tảng</h3>
<p>Ở quy mô lớn dùng engine đồ thị: <strong>Spark GraphX</strong> (đồ thị trên nền Spark), <strong>Apache Giraph</strong> (kiểu Pregel, lấy đỉnh làm trung tâm), hoặc cơ sở dữ liệu đồ thị <strong>Neo4j</strong> với ngôn ngữ truy vấn Cypher.</p>
<pre><code class="language-sql">// Neo4j Cypher: ban-cua-ban cua Alice ma co ay chua ket noi
MATCH (a:Person {name:'Alice'})-[:FRIEND]->()-[:FRIEND]->(fof)
WHERE NOT (a)-[:FRIEND]->(fof) AND a &lt;&gt; fof
RETURN DISTINCT fof.name;
</code></pre>
<div class="callout"><span class="badge">Khi nào chọn đồ thị</span> Khi chính <em>quan hệ</em> là thứ cần phân tích — gợi ý, vòng gian lận, ảnh hưởng, định tuyến — mô hình đồ thị vượt xa việc JOIN các bảng phẳng lặp đi lặp lại.</div>`,
  ]]);

const m5q = quiz('bdi302c-quiz-5', 'Quiz 5 — Graph analytics|||Quiz 5 — Phân tích đồ thị', [
  { id: 'q1', question: 'In a graph, edges represent?|||Trong đồ thị, cạnh (edge) biểu diễn?', options: ['The entities themselves|||Chính các thực thể', 'Relationships between nodes|||Quan hệ giữa các nút', 'Storage blocks|||Khối lưu trữ', 'Table columns|||Cột của bảng'], correctIndex: 1, explanation: 'Nút = thực thể, cạnh = quan hệ nối chúng.' },
  { id: 'q2', question: 'PageRank measures?|||PageRank đo cái gì?', options: ['Shortest path length|||Độ dài đường đi ngắn nhất', 'A node\'s importance from links to it|||Độ quan trọng của nút dựa trên liên kết tới nó', 'The number of blocks|||Số khối', 'Model accuracy|||Độ chính xác mô hình'], correctIndex: 1, explanation: 'PageRank xếp hạng nút theo cấu trúc liên kết trỏ tới nó.' },
  { id: 'q3', question: 'Which is a platform for graph computation at scale?|||Cái nào là nền tảng tính toán đồ thị ở quy mô lớn?', options: ['HDFS', 'Spark GraphX / Giraph / Neo4j', 'KNIME only|||Chỉ KNIME', 'MapReduce shuffle'], correctIndex: 1, explanation: 'GraphX, Giraph và Neo4j là các engine/CSDL đồ thị.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'BDI302c',
    slug: 'bdi302c-big-data',
    title: 'Big Data',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BDI302c.webp',
    shortDescription: 'Big Data end to end — the 5V\'s, Hadoop (HDFS & MapReduce), data modeling & NoSQL, Apache Spark (PySpark), machine learning at scale (KNIME / Spark MLlib) and graph analytics (GraphX, Neo4j). Bilingual, following UC San Diego\'s Big Data Specialization.|||Dữ liệu lớn từ đầu đến cuối — 5 chữ V, Hadoop (HDFS & MapReduce), mô hình hoá & NoSQL, Apache Spark (PySpark), học máy quy mô lớn (KNIME / Spark MLlib) và phân tích đồ thị (GraphX, Neo4j). Song ngữ, bám bộ MOOC Big Data của UC San Diego.',
    description: 'Môn <strong>BDI302c — Big Data (Dữ liệu lớn)</strong> (kỳ 5) dạy cách lưu, quản lý, xử lý và phân tích dữ liệu ở quy mô vượt sức một máy đơn. Bám bộ MOOC <strong>Big Data Specialization của UC San Diego</strong>: từ <strong>khái niệm &amp; 5 chữ V, Hadoop (HDFS, MapReduce)</strong> → <strong>mô hình hoá &amp; hệ quản trị (NoSQL)</strong> → <strong>tích hợp &amp; xử lý bằng Apache Spark</strong> → <strong>học máy trên dữ liệu lớn</strong> → <strong>phân tích đồ thị</strong>. Công cụ: Hadoop, Spark/PySpark, Cloudera VM, KNIME, MongoDB, Neo4j. Song ngữ, có code PySpark/SQL minh hoạ và quiz mỗi module.',
    whatYouLearn: 'Big Data &amp; 5V (Volume/Velocity/Variety/Veracity/Value); scale up vs scale out; HDFS (block, replication, NameNode/DataNode) &amp; MapReduce (map→shuffle→reduce); mô hình dữ liệu structured/semi/unstructured; NoSQL (key-value, document, column, graph) so với DBMS quan hệ; Apache Spark (RDD, DataFrame, transformation/action) &amp; đọc dữ liệu MongoDB bằng PySpark; học máy (classification, regression, clustering, association) với train/test, KNIME &amp; Spark MLlib; phân tích đồ thị (shortest path, PageRank, community) trên GraphX/Giraph/Neo4j.',
    requirements: 'Biết lập trình cơ bản (nên có Python) và cơ sở dữ liệu/SQL nhập môn. Nên cài Cloudera QuickStart VM (Hadoop + Spark) hoặc dùng PySpark cục bộ; KNIME để thực hành học máy trực quan.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'MOOC UCSD, tài liệu Hadoop & Spark, sách Tom White, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Big Data, 5V, 6 CLO, cơ cấu điểm, Hadoop & Spark.', lessons: [intro] },
    { title: 'Module 1 — Introduction to Big Data|||Module 1 — Giới thiệu Big Data', description: '5V, scalability, HDFS & MapReduce, Hadoop.', lessons: [m1, m1q] },
    { title: 'Module 2 — Modeling & Management Systems|||Module 2 — Mô hình hoá & hệ quản trị', description: 'Mô hình dữ liệu, DBMS so với NoSQL, thiết kế hệ thống.', lessons: [m2, m2q] },
    { title: 'Module 3 — Integration & Processing|||Module 3 — Tích hợp & xử lý', description: 'Apache Spark, PySpark, MongoDB + Spark.', lessons: [m3, m3q] },
    { title: 'Module 4 — Machine Learning with Big Data|||Module 4 — Học máy với Big Data', description: 'Chuẩn bị dữ liệu, classification/regression/clustering/association, KNIME & MLlib.', lessons: [m4, m4q] },
    { title: 'Module 5 — Graph Analytics|||Module 5 — Phân tích đồ thị', description: 'Đồ thị, PageRank, cộng đồng, GraphX/Giraph/Neo4j.', lessons: [m5, m5q] },
  ],
};
