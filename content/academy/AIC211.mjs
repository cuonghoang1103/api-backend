/**
 * AIC211 — AI for Cyber Security (Trí tuệ nhân tạo cho An toàn thông tin).
 * Ngành An toàn thông tin, Kỳ 4, khung chương trình FPTU. Song ngữ VI+EN.
 * Giáo trình tham khảo: Chio/Freeman "Machine Learning and Security";
 * Sumeet Dua "Data Mining and Machine Learning in Cybersecurity";
 * Halder/Ozdemir "Hands-On Machine Learning for Cybersecurity"; NIST AI RMF.
 * Định hướng PHÒNG THỦ / GIÁO DỤC — không hướng dẫn tấn công thực chiến.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; escape &->&amp; và <->&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('aic211-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền tảng (Chio/Freeman, Sumeet Dua, Halder/Ozdemir), NIST AI RMF, bộ dữ liệu công khai, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">AIC211 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>AI for Cyber Security</strong> — how machine learning helps defenders detect malware, intrusions, phishing and fraud, and how to run those models safely. Official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal, defence-oriented resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for AIC211 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Machine Learning and Security</em> — Clarence Chio &amp; David Freeman (O'Reilly)</li>
<li><em>Data Mining and Machine Learning in Cybersecurity</em> — Sumeet Dua &amp; Xian Du</li>
<li><em>Hands-On Machine Learning for Cybersecurity</em> — Soma Halder &amp; Sinan Ozdemir</li>
</ul>
<h3>🌐 Standards &amp; free documentation</h3>
<ul>
<li><a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">NIST AI Risk Management Framework (AI RMF)</a></li>
<li><a href="https://atlas.mitre.org/" target="_blank" rel="noopener">MITRE ATLAS — adversarial threats to AI systems</a></li>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn User Guide</a></li>
</ul>
<h3>🗄️ Public datasets (for learning)</h3>
<ul>
<li><a href="https://www.unb.ca/cic/datasets/" target="_blank" rel="noopener">CIC-IDS / NSL-KDD — intrusion detection datasets</a></li>
<li><a href="https://archive.ics.uci.edu/dataset/94/spambase" target="_blank" rel="noopener">UCI Spambase — spam email features</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://scikit-learn.org/" target="_blank" rel="noopener">scikit-learn</a> — classic ML in Python</li>
<li><a href="https://pandas.pydata.org/" target="_blank" rel="noopener">pandas</a> — data wrangling for logs &amp; netflow</li>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter</a> — notebooks for experiments</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — where AI meets security, the ML pipeline, precision vs recall.</li>
<li><strong>Data</strong> — turn raw logs &amp; netflow into features a model can learn from.</li>
<li><strong>Detection</strong> — malware, intrusion/anomaly, phishing, fraud/UEBA.</li>
<li><strong>Trustworthy ops</strong> — adversarial ML defence, explainability (XAI), MLSecOps and NIST AI RMF.</li>
</ol></div>`,
    `<span class="eyebrow">AIC211 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>AI cho An toàn thông tin</strong> — học máy giúp người phòng thủ phát hiện mã độc, xâm nhập, phishing và gian lận thế nào, và vận hành các mô hình đó an toàn ra sao. Slide &amp; giáo trình FPTU chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, thiên về phòng thủ.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của AIC211 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Machine Learning and Security</em> — Clarence Chio &amp; David Freeman (O'Reilly)</li>
<li><em>Data Mining and Machine Learning in Cybersecurity</em> — Sumeet Dua &amp; Xian Du</li>
<li><em>Hands-On Machine Learning for Cybersecurity</em> — Soma Halder &amp; Sinan Ozdemir</li>
</ul>
<h3>🌐 Tiêu chuẩn &amp; tài liệu miễn phí</h3>
<ul>
<li><a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">Khung Quản trị Rủi ro AI của NIST (AI RMF)</a></li>
<li><a href="https://atlas.mitre.org/" target="_blank" rel="noopener">MITRE ATLAS — mối đe doạ đối kháng nhắm vào hệ AI</a></li>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">Hướng dẫn sử dụng scikit-learn</a></li>
</ul>
<h3>🗄️ Bộ dữ liệu công khai (để học)</h3>
<ul>
<li><a href="https://www.unb.ca/cic/datasets/" target="_blank" rel="noopener">CIC-IDS / NSL-KDD — dữ liệu phát hiện xâm nhập</a></li>
<li><a href="https://archive.ics.uci.edu/dataset/94/spambase" target="_blank" rel="noopener">UCI Spambase — đặc trưng thư rác</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://scikit-learn.org/" target="_blank" rel="noopener">scikit-learn</a> — học máy cổ điển bằng Python</li>
<li><a href="https://pandas.pydata.org/" target="_blank" rel="noopener">pandas</a> — xử lý log &amp; netflow</li>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter</a> — notebook để thử nghiệm</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — nơi AI gặp an ninh, quy trình ML, precision và recall.</li>
<li><strong>Dữ liệu</strong> — biến log &amp; netflow thô thành đặc trưng cho mô hình.</li>
<li><strong>Phát hiện</strong> — mã độc, xâm nhập/bất thường, phishing, gian lận/UEBA.</li>
<li><strong>Vận hành đáng tin</strong> — phòng thủ adversarial ML, giải thích được (XAI), MLSecOps và NIST AI RMF.</li>
</ol></div>`,
  ]]);

const intro = doc('aic211-0-1-overview', 'Course overview: AI for cyber security|||Tổng quan: AI cho an toàn thông tin',
  'AI/ML làm gì cho phòng thủ mạng; ba kiểu học (giám sát/không giám sát/tăng cường); vì sao dữ liệu an ninh khó; lộ trình 8 chương và định hướng phòng thủ + đạo đức.',
  [[
    `<span class="eyebrow">AIC211 · Lesson 0.1 · Overview</span>
<h2>AI for Cyber Security</h2>
<p class="lead">This course shows how <strong>machine learning helps defenders</strong> — spotting malware, intrusions, phishing and fraud faster and at a scale humans cannot match. The stance is strictly <strong>defensive and educational</strong>: we study attacks only to build better defences, never to run them.</p>
<h3>Why AI in security?</h3>
<p>A modern network emits millions of log lines a day. Rules catch known threats but miss new variants; humans cannot read every line. ML learns <em>patterns</em> from data, so it can flag the unusual and generalise to threats it has not seen verbatim.</p>
<h3>Three kinds of learning</h3>
<ul>
<li><strong>Supervised</strong> — learn from labelled examples (malware vs benign) to classify new samples.</li>
<li><strong>Unsupervised</strong> — find structure with no labels; the backbone of <em>anomaly detection</em>.</li>
<li><strong>Reinforcement</strong> — learn by trial and reward; used in some adaptive defence research.</li>
</ul>
<h3>Roadmap</h3>
<p>Foundations &amp; ML pipeline → security data &amp; features → malware detection → intrusion &amp; anomaly detection → spam/phishing &amp; NLP → fraud &amp; UEBA → adversarial ML (defence) → ethics, XAI &amp; MLSecOps. Bilingual, with Python (scikit-learn/pandas) examples and quizzes.</p>`,
    `<span class="eyebrow">AIC211 · Bài 0.1 · Tổng quan</span>
<h2>AI cho An toàn thông tin</h2>
<p class="lead">Môn này cho thấy <strong>học máy giúp người phòng thủ</strong> thế nào — phát hiện mã độc, xâm nhập, phishing và gian lận nhanh hơn và ở quy mô con người không kham nổi. Lập trường luôn là <strong>phòng thủ và giáo dục</strong>: ta nghiên cứu tấn công chỉ để dựng phòng thủ tốt hơn, không bao giờ để thực hiện.</p>
<h3>Vì sao dùng AI trong an ninh?</h3>
<p>Một mạng hiện đại sinh hàng triệu dòng log mỗi ngày. Luật (rule) bắt được mối đe doạ đã biết nhưng bỏ lọt biến thể mới; con người không thể đọc hết. ML học <em>khuôn mẫu</em> từ dữ liệu, nên có thể đánh dấu cái bất thường và tổng quát hoá sang mối đe doạ chưa từng thấy nguyên văn.</p>
<h3>Ba kiểu học</h3>
<ul>
<li><strong>Có giám sát</strong> — học từ ví dụ đã gán nhãn (mã độc vs lành) để phân loại mẫu mới.</li>
<li><strong>Không giám sát</strong> — tìm cấu trúc khi không có nhãn; xương sống của <em>phát hiện bất thường</em>.</li>
<li><strong>Tăng cường</strong> — học bằng thử và thưởng; dùng trong một số nghiên cứu phòng thủ thích nghi.</li>
</ul>
<h3>Lộ trình</h3>
<p>Nền tảng &amp; quy trình ML → dữ liệu &amp; đặc trưng an ninh → phát hiện mã độc → phát hiện xâm nhập &amp; bất thường → thư rác/phishing &amp; NLP → gian lận &amp; UEBA → adversarial ML (phòng thủ) → đạo đức, XAI &amp; MLSecOps. Song ngữ, có ví dụ Python (scikit-learn/pandas) và quiz.</p>`,
  ]]);

const c1 = doc('aic211-1-1-intersection', '1.1 — AI &amp; cybersecurity intersection; ML overview|||1.1 — Giao thoa AI &amp; an ninh mạng; tổng quan ML',
  'Phòng thủ theo luật vs học máy; quy trình ML (thu thập → đặc trưng → huấn luyện → đánh giá → triển khai); đánh giá lệch lớp: precision, recall, F1, ma trận nhầm lẫn.',
  [[
    `<span class="eyebrow">AIC211 · Chapter 1 · Lesson 1.1</span>
<h2>AI &amp; cybersecurity intersection; ML overview</h2>
<h3>Rules vs learning</h3>
<p>Signature/rule engines match known patterns exactly — fast and explainable, but blind to novelty. ML complements them: it <em>generalises</em>, catching variants a signature would miss, at the cost of some false positives.</p>
<h3>The ML pipeline</h3>
<ul>
<li><strong>Collect</strong> — logs, netflow, files, emails.</li>
<li><strong>Feature engineering</strong> — turn raw data into numeric features.</li>
<li><strong>Train</strong> — fit a model on labelled or unlabelled data.</li>
<li><strong>Evaluate</strong> — measure on held-out data.</li>
<li><strong>Deploy &amp; monitor</strong> — score live traffic, watch for drift.</li>
</ul>
<h3>Evaluating on imbalanced data</h3>
<p>Attacks are rare, so <strong>accuracy lies</strong>: a model that says "benign" for everything can be 99.9% accurate and useless. Use <strong>precision</strong> (of the alerts raised, how many were real), <strong>recall</strong> (of the real attacks, how many were caught) and <strong>F1</strong> (their balance).</p>
<pre><code>from sklearn.metrics import classification_report, confusion_matrix

y_pred = model.predict(X_test)
print(confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred, digits=3))
# precision = TP / (TP + FP)   -&gt; alert quality
# recall    = TP / (TP + FN)   -&gt; coverage of attacks
</code></pre>
<div class="callout"><span class="badge">Key idea</span> In security, missing an attack (false negative) and drowning analysts in false alarms (false positives) both hurt — pick the metric that matches your risk, not accuracy.</div>`,
    `<span class="eyebrow">AIC211 · Chương 1 · Bài 1.1</span>
<h2>Giao thoa AI &amp; an ninh mạng; tổng quan ML</h2>
<h3>Luật vs học máy</h3>
<p>Bộ máy chữ ký/luật khớp khuôn mẫu đã biết một cách chính xác — nhanh và dễ giải thích, nhưng mù trước cái mới. ML bổ trợ: nó <em>tổng quát hoá</em>, bắt được biến thể mà chữ ký bỏ lọt, đổi lại một ít cảnh báo sai.</p>
<h3>Quy trình ML</h3>
<ul>
<li><strong>Thu thập</strong> — log, netflow, tệp, email.</li>
<li><strong>Kỹ thuật đặc trưng</strong> — biến dữ liệu thô thành đặc trưng số.</li>
<li><strong>Huấn luyện</strong> — khớp mô hình trên dữ liệu có/không nhãn.</li>
<li><strong>Đánh giá</strong> — đo trên dữ liệu giữ riêng.</li>
<li><strong>Triển khai &amp; giám sát</strong> — chấm lưu lượng thật, canh trôi dạt (drift).</li>
</ul>
<h3>Đánh giá trên dữ liệu lệch lớp</h3>
<p>Tấn công hiếm, nên <strong>accuracy đánh lừa</strong>: mô hình cứ nói "lành" cho mọi thứ vẫn có thể đạt 99,9% mà vô dụng. Hãy dùng <strong>precision</strong> (trong các cảnh báo, bao nhiêu là thật), <strong>recall</strong> (trong các tấn công thật, bao nhiêu bị bắt) và <strong>F1</strong> (điểm cân bằng của hai cái).</p>
<pre><code>from sklearn.metrics import classification_report, confusion_matrix

y_pred = model.predict(X_test)
print(confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred, digits=3))
# precision = TP / (TP + FP)   -&gt; chất lượng cảnh báo
# recall    = TP / (TP + FN)   -&gt; độ phủ tấn công
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Trong an ninh, bỏ lọt tấn công (âm tính giả) và làm analyst ngập cảnh báo sai (dương tính giả) đều hại — chọn thước đo khớp với rủi ro của bạn, đừng chọn accuracy.</div>`,
  ]]);

const c1q = quiz('aic211-quiz-1', 'Quiz 1 — AI & security, ML basics|||Quiz 1 — AI & an ninh, ML cơ bản', [
  { id: 'q1', question: 'Vì sao "accuracy" thường đánh lừa khi phát hiện tấn công?', options: ['Vì tấn công rất hiếm nên đoán "lành" hết vẫn accuracy cao', 'Vì accuracy khó tính', 'Vì accuracy chỉ dùng cho ảnh', 'Vì accuracy luôn bằng recall'], correctIndex: 0, explanation: 'Dữ liệu lệch lớp: lớp tấn công rất nhỏ nên mô hình đoán toàn "lành" vẫn có accuracy rất cao mà không bắt được gì.' },
  { id: 'q2', question: 'Recall đo điều gì?', options: ['Trong các cảnh báo, bao nhiêu là thật', 'Trong các tấn công thật, bao nhiêu bị bắt', 'Tốc độ huấn luyện', 'Số đặc trưng dùng'], correctIndex: 1, explanation: 'Recall = TP/(TP+FN) — độ phủ: trong tổng số tấn công thật, mô hình bắt được bao nhiêu.' },
  { id: 'q3', question: 'Ưu điểm của học máy so với bộ luật/chữ ký thuần là?', options: ['Luôn không có cảnh báo sai', 'Tổng quát hoá, bắt được biến thể chưa thấy nguyên văn', 'Không cần dữ liệu', 'Chạy chậm hơn nên an toàn hơn'], correctIndex: 1, explanation: 'ML học khuôn mẫu nên tổng quát hoá sang biến thể mới; luật chỉ khớp cái đã biết chính xác.' },
]);

const c2 = doc('aic211-2-1-data-features', '2.1 — Security data preparation &amp; features (logs, netflow)|||2.1 — Chuẩn bị dữ liệu an ninh &amp; đặc trưng (logs, netflow)',
  'Nguồn dữ liệu an ninh (log, netflow, PCAP, sự kiện endpoint); làm sạch & phân tích cú pháp; đặc trưng số/danh mục; chuẩn hoá & mã hoá one-hot; đặc trưng theo cửa sổ thời gian.',
  [[
    `<span class="eyebrow">AIC211 · Chapter 2 · Lesson 2.1</span>
<h2>Security data preparation &amp; features</h2>
<p class="lead">Models learn from <strong>features</strong>, not raw logs. Most of the real work in security ML is turning messy text into clean numeric columns.</p>
<h3>Common sources</h3>
<ul>
<li><strong>System/app logs</strong> — auth, web, DNS.</li>
<li><strong>NetFlow</strong> — per-connection summaries (src/dst IP, ports, bytes, duration).</li>
<li><strong>Endpoint events</strong> — process, file, registry activity.</li>
</ul>
<h3>From raw to features</h3>
<ul>
<li><strong>Parse</strong> — split lines into fields.</li>
<li><strong>Numeric features</strong> — bytes sent, duration, packet count.</li>
<li><strong>Categorical</strong> — protocol, port → one-hot encode.</li>
<li><strong>Scale</strong> — standardise so no feature dominates by its units.</li>
<li><strong>Windowed features</strong> — count events per source per minute (bursts betray scans/brute-force).</li>
</ul>
<pre><code>import pandas as pd
from sklearn.preprocessing import StandardScaler

flows = pd.read_csv("netflow.csv")
flows["bytes_per_sec"] = flows["bytes"] / (flows["duration"] + 1e-6)
X = pd.get_dummies(flows[["proto", "bytes", "duration", "bytes_per_sec"]])
X_scaled = StandardScaler().fit_transform(X)
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Good features beat fancy models. A ratio like bytes-per-second or connections-per-host often separates attack from normal better than a deeper network on raw fields.</div>`,
    `<span class="eyebrow">AIC211 · Chương 2 · Bài 2.1</span>
<h2>Chuẩn bị dữ liệu an ninh &amp; đặc trưng</h2>
<p class="lead">Mô hình học từ <strong>đặc trưng</strong>, không phải log thô. Phần lớn công sức thực sự của ML an ninh là biến văn bản lộn xộn thành cột số sạch.</p>
<h3>Nguồn dữ liệu thường gặp</h3>
<ul>
<li><strong>Log hệ thống/ứng dụng</strong> — xác thực, web, DNS.</li>
<li><strong>NetFlow</strong> — tóm tắt từng kết nối (IP nguồn/đích, cổng, số byte, thời lượng).</li>
<li><strong>Sự kiện endpoint</strong> — hoạt động tiến trình, tệp, registry.</li>
</ul>
<h3>Từ thô sang đặc trưng</h3>
<ul>
<li><strong>Phân tích cú pháp</strong> — tách dòng thành trường.</li>
<li><strong>Đặc trưng số</strong> — số byte gửi, thời lượng, số gói.</li>
<li><strong>Danh mục</strong> — giao thức, cổng → mã hoá one-hot.</li>
<li><strong>Chuẩn hoá</strong> — để không đặc trưng nào áp đảo chỉ vì đơn vị.</li>
<li><strong>Đặc trưng theo cửa sổ</strong> — đếm sự kiện mỗi nguồn mỗi phút (bùng nổ tố cáo quét cổng/dò mật khẩu).</li>
</ul>
<pre><code>import pandas as pd
from sklearn.preprocessing import StandardScaler

flows = pd.read_csv("netflow.csv")
flows["bytes_per_sec"] = flows["bytes"] / (flows["duration"] + 1e-6)
X = pd.get_dummies(flows[["proto", "bytes", "duration", "bytes_per_sec"]])
X_scaled = StandardScaler().fit_transform(X)
</code></pre>
<div class="callout"><span class="badge">Kinh nghiệm</span> Đặc trưng tốt thắng mô hình cầu kỳ. Một tỉ lệ như byte-mỗi-giây hay kết-nối-mỗi-máy thường tách tấn công khỏi bình thường tốt hơn cả một mạng sâu chạy trên trường thô.</div>`,
  ]]);

const c2q = quiz('aic211-quiz-2', 'Quiz 2 — Security data & features|||Quiz 2 — Dữ liệu & đặc trưng an ninh', [
  { id: 'q1', question: 'NetFlow chủ yếu cung cấp thông tin gì?', options: ['Nội dung đầy đủ mọi gói tin', 'Tóm tắt theo từng kết nối (IP, cổng, số byte, thời lượng)', 'Mã nguồn phần mềm', 'Ảnh chụp màn hình'], correctIndex: 1, explanation: 'NetFlow tóm tắt siêu dữ liệu từng luồng kết nối, không giữ toàn bộ payload như PCAP.' },
  { id: 'q2', question: 'Vì sao cần chuẩn hoá (scale) đặc trưng số?', options: ['Để xoá dữ liệu thiếu', 'Để không đặc trưng nào áp đảo chỉ vì đơn vị/độ lớn', 'Để tăng số dòng dữ liệu', 'Để mã hoá văn bản'], correctIndex: 1, explanation: 'Chuẩn hoá đưa các đặc trưng về cùng thang, tránh trường có giá trị lớn (vd byte) lấn át trường nhỏ.' },
  { id: 'q3', question: 'Đặc trưng theo cửa sổ thời gian (vd đếm sự kiện/nguồn/phút) giúp phát hiện?', options: ['Màu sắc giao diện', 'Hành vi bùng nổ như quét cổng hay dò mật khẩu', 'Phiên bản hệ điều hành', 'Kích thước màn hình'], correctIndex: 1, explanation: 'Nhiều tấn công lộ ra ở tần suất: số kết nối/lần thử dồn dập trong thời gian ngắn.' },
]);

const c3 = doc('aic211-3-1-malware-detection', '3.1 — Malware detection with ML|||3.1 — Phát hiện phần mềm độc hại bằng ML',
  'Đặc trưng tĩnh vs động; đặc trưng PE header/byte n-gram; phân loại mã độc bằng Random Forest; đóng gói (packing) & né tránh; vì sao cần cập nhật dữ liệu.',
  [[
    `<span class="eyebrow">AIC211 · Chapter 3 · Lesson 3.1</span>
<h2>Malware detection with ML</h2>
<p class="lead">Signatures catch known malware; ML aims at the <em>unknown</em> by learning what malicious files have in common. Studied here for defence — classifying samples in a sandbox, never authoring them.</p>
<h3>Static vs dynamic features</h3>
<ul>
<li><strong>Static</strong> — read from the file without running it: PE header fields, imported APIs, section entropy, byte n-grams, printable strings.</li>
<li><strong>Dynamic</strong> — observed by running the file in a sandbox: API calls, files/registry touched, network contacted.</li>
</ul>
<h3>A defensive classifier</h3>
<pre><code>from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# X: numeric features (entropy, num_imports, header flags...)
# y: 1 = malware, 0 = benign  (labels from a trusted feed)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, stratify=y)
clf = RandomForestClassifier(n_estimators=300, class_weight="balanced")
clf.fit(Xtr, ytr)
print(sorted(zip(clf.feature_importances_, feature_names), reverse=True)[:5])
</code></pre>
<h3>Why it degrades</h3>
<p><strong>Packing/obfuscation</strong> hides static structure; malware families evolve. Models must be retrained on fresh, well-labelled samples, and high entropy alone is not proof of malice (installers pack too).</p>
<div class="callout"><span class="badge">Feature importance</span> Random Forests expose which features drive a decision — useful for analysts to sanity-check that the model learned real signals, not dataset artifacts.</div>`,
    `<span class="eyebrow">AIC211 · Chương 3 · Bài 3.1</span>
<h2>Phát hiện phần mềm độc hại bằng ML</h2>
<p class="lead">Chữ ký bắt mã độc đã biết; ML nhắm tới cái <em>chưa biết</em> bằng cách học điểm chung của các tệp độc hại. Học ở đây để phòng thủ — phân loại mẫu trong sandbox, không bao giờ tự viết ra chúng.</p>
<h3>Đặc trưng tĩnh vs động</h3>
<ul>
<li><strong>Tĩnh</strong> — đọc từ tệp mà không chạy: trường PE header, API được import, entropy của section, byte n-gram, chuỗi in được.</li>
<li><strong>Động</strong> — quan sát khi chạy tệp trong sandbox: lời gọi API, tệp/registry bị đụng, mạng bị liên hệ.</li>
</ul>
<h3>Một bộ phân loại phòng thủ</h3>
<pre><code>from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# X: đặc trưng số (entropy, num_imports, cờ header...)
# y: 1 = mã độc, 0 = lành  (nhãn từ nguồn đáng tin)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, stratify=y)
clf = RandomForestClassifier(n_estimators=300, class_weight="balanced")
clf.fit(Xtr, ytr)
print(sorted(zip(clf.feature_importances_, feature_names), reverse=True)[:5])
</code></pre>
<h3>Vì sao mô hình xuống cấp</h3>
<p><strong>Đóng gói/làm rối (packing/obfuscation)</strong> giấu cấu trúc tĩnh; các họ mã độc tiến hoá. Phải huấn luyện lại trên mẫu mới, gán nhãn tốt; và entropy cao một mình không phải bằng chứng độc hại (trình cài đặt cũng nén).</p>
<div class="callout"><span class="badge">Độ quan trọng đặc trưng</span> Random Forest cho biết đặc trưng nào chi phối quyết định — giúp analyst kiểm tra mô hình đã học tín hiệu thật chứ không phải nhiễu của tập dữ liệu.</div>`,
  ]]);

const c3q = quiz('aic211-quiz-3', 'Quiz 3 — Malware detection|||Quiz 3 — Phát hiện mã độc', [
  { id: 'q1', question: 'Đặc trưng "tĩnh" của một tệp nghĩa là?', options: ['Chỉ có được khi chạy tệp trong sandbox', 'Đọc trực tiếp từ tệp mà không cần chạy (header, chuỗi, entropy)', 'Do người dùng nhập tay', 'Là ảnh chụp màn hình'], correctIndex: 1, explanation: 'Đặc trưng tĩnh trích từ tệp mà không thực thi; đặc trưng động cần chạy tệp trong môi trường cách ly.' },
  { id: 'q2', question: 'Entropy cao của một tệp một mình có đủ kết luận là mã độc không?', options: ['Có, luôn luôn', 'Không, trình cài đặt/nén hợp pháp cũng có entropy cao', 'Chỉ đúng với PDF', 'Chỉ đúng vào ban đêm'], correctIndex: 1, explanation: 'Packing/nén làm entropy cao nhưng phần mềm hợp pháp cũng nén; cần kết hợp nhiều đặc trưng.' },
  { id: 'q3', question: 'Vì sao mô hình phát hiện mã độc cần huấn luyện lại định kỳ?', options: ['Vì Python hết hạn', 'Vì họ mã độc tiến hoá và kỹ thuật né tránh thay đổi', 'Vì ổ cứng đầy', 'Vì màu biểu đồ cũ'], correctIndex: 1, explanation: 'Mã độc biến đổi liên tục (packing, biến thể mới) nên mô hình cũ mất hiệu lực nếu không cập nhật dữ liệu.' },
]);

const c4 = doc('aic211-4-1-intrusion-anomaly', '4.1 — Intrusion detection &amp; anomaly detection|||4.1 — Phát hiện xâm nhập &amp; bất thường',
  'IDS theo chữ ký vs theo bất thường; học "bình thường" rồi báo lệch; Isolation Forest & One-Class SVM; ngưỡng điểm bất thường; đánh đổi cảnh báo sai.',
  [[
    `<span class="eyebrow">AIC211 · Chapter 4 · Lesson 4.1</span>
<h2>Intrusion &amp; anomaly detection</h2>
<h3>Two flavours of IDS</h3>
<ul>
<li><strong>Signature-based</strong> — matches known attack patterns; precise but blind to new attacks.</li>
<li><strong>Anomaly-based</strong> — learns a profile of <em>normal</em> and flags deviations; can catch novel attacks, but noisier.</li>
</ul>
<h3>Learn normal, flag the rest</h3>
<p>When attacks are rare or unlabelled, train <strong>only on normal traffic</strong> and score how far each new event sits from that profile. <strong>Isolation Forest</strong> isolates outliers with random splits; <strong>One-Class SVM</strong> draws a boundary around normal.</p>
<pre><code>from sklearn.ensemble import IsolationForest

# fit on mostly-normal traffic; contamination = expected outlier rate
iso = IsolationForest(contamination=0.02, random_state=0)
iso.fit(X_train_normal)
scores = iso.decision_function(X_live)   # lower = more anomalous
alerts = X_live[iso.predict(X_live) == -1]  # -1 flags an outlier
</code></pre>
<h3>The threshold trade-off</h3>
<p>A stricter threshold raises recall (catches more) but floods analysts; a looser one is quieter but misses attacks. Tune it to the team's alert budget, and pair anomalies with context (asset value, time of day).</p>
<div class="callout"><span class="badge">Watch drift</span> "Normal" changes — a new app, a holiday traffic pattern. Retrain and re-baseline, or benign change looks like attack.</div>`,
    `<span class="eyebrow">AIC211 · Chương 4 · Bài 4.1</span>
<h2>Phát hiện xâm nhập &amp; bất thường</h2>
<h3>Hai kiểu IDS</h3>
<ul>
<li><strong>Theo chữ ký</strong> — khớp khuôn mẫu tấn công đã biết; chính xác nhưng mù trước tấn công mới.</li>
<li><strong>Theo bất thường</strong> — học hồ sơ <em>bình thường</em> rồi báo cái lệch; bắt được tấn công mới nhưng ồn hơn.</li>
</ul>
<h3>Học bình thường, báo phần còn lại</h3>
<p>Khi tấn công hiếm hoặc không có nhãn, hãy huấn luyện <strong>chỉ trên lưu lượng bình thường</strong> và chấm mỗi sự kiện mới lệch bao xa khỏi hồ sơ đó. <strong>Isolation Forest</strong> cô lập điểm ngoại lai bằng các lát cắt ngẫu nhiên; <strong>One-Class SVM</strong> vẽ ranh giới quanh phần bình thường.</p>
<pre><code>from sklearn.ensemble import IsolationForest

# khớp trên lưu lượng phần lớn bình thường; contamination = tỉ lệ ngoại lai kỳ vọng
iso = IsolationForest(contamination=0.02, random_state=0)
iso.fit(X_train_normal)
scores = iso.decision_function(X_live)   # càng thấp càng bất thường
alerts = X_live[iso.predict(X_live) == -1]  # -1 đánh dấu ngoại lai
</code></pre>
<h3>Đánh đổi ở ngưỡng</h3>
<p>Ngưỡng chặt hơn tăng recall (bắt nhiều hơn) nhưng làm ngập analyst; ngưỡng lỏng hơn thì yên tĩnh nhưng bỏ lọt. Chỉnh theo "ngân sách cảnh báo" của đội, và ghép bất thường với ngữ cảnh (giá trị tài sản, thời điểm trong ngày).</p>
<div class="callout"><span class="badge">Canh trôi dạt</span> "Bình thường" thay đổi — ứng dụng mới, lưu lượng ngày lễ. Phải huấn luyện lại và lập lại chuẩn, không thì thay đổi lành trông như tấn công.</div>`,
  ]]);

const c4q = quiz('aic211-quiz-4', 'Quiz 4 — Intrusion & anomaly|||Quiz 4 — Xâm nhập & bất thường', [
  { id: 'q1', question: 'IDS theo bất thường (anomaly-based) hoạt động dựa trên?', options: ['Danh sách chữ ký tấn công đã biết', 'Học hồ sơ "bình thường" rồi báo cái lệch khỏi nó', 'Chặn mọi kết nối', 'Mật khẩu người dùng'], correctIndex: 1, explanation: 'Anomaly-based dựng mô hình cho hành vi bình thường và đánh dấu những gì lệch đáng kể, nên có thể bắt tấn công chưa từng biết.' },
  { id: 'q2', question: 'Isolation Forest thường được huấn luyện chủ yếu trên dữ liệu?', options: ['Toàn tấn công', 'Phần lớn là bình thường, để nhận ra ngoại lai', 'Ảnh khuôn mặt', 'Mã nguồn'], correctIndex: 1, explanation: 'Ta học phân bố bình thường; điểm khó cô lập/khác biệt được coi là ngoại lai (khả nghi).' },
  { id: 'q3', question: 'Hạ ngưỡng để bắt nhiều bất thường hơn thường kéo theo?', options: ['Ít cảnh báo sai hơn', 'Nhiều cảnh báo sai hơn, làm ngập analyst', 'Mô hình chạy nhanh hơn', 'Không ảnh hưởng gì'], correctIndex: 1, explanation: 'Ngưỡng nhạy hơn tăng recall nhưng cũng tăng dương tính giả — phải cân với ngân sách cảnh báo của đội.' },
]);

const c5 = doc('aic211-5-1-spam-phishing-nlp', '5.1 — Spam/phishing filtering &amp; NLP|||5.1 — Lọc thư rác/phishing &amp; NLP',
  'Biểu diễn văn bản (bag-of-words, TF-IDF); Naive Bayes lọc thư rác; đặc trưng phishing (URL, tên miền, tiêu đề); vì sao cần đặc trưng ngoài nội dung chữ.',
  [[
    `<span class="eyebrow">AIC211 · Chapter 5 · Lesson 5.1</span>
<h2>Spam / phishing filtering &amp; NLP</h2>
<p class="lead">Email and messages are text, so this is where <strong>Natural Language Processing</strong> meets security. Spam filtering is the classic success story of ML in defence.</p>
<h3>Turning text into numbers</h3>
<ul>
<li><strong>Bag-of-words</strong> — count each word.</li>
<li><strong>TF-IDF</strong> — weight words by how distinctive they are, damping common ones.</li>
</ul>
<h3>A spam classifier</h3>
<pre><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

model = make_pipeline(TfidfVectorizer(stop_words="english"), MultinomialNB())
model.fit(train_emails, train_labels)   # labels: spam / ham
pred = model.predict(["Your account is locked, verify now"])
</code></pre>
<h3>Phishing needs more than words</h3>
<p>Attackers copy legitimate wording, so add <strong>non-text features</strong>: mismatched display name vs sender domain, look-alike domains, URL with an IP host, link text differing from its href, urgency cues, recently-registered domains. Combining NLP with these header/URL signals beats text alone.</p>
<div class="callout"><span class="badge">Defensive framing</span> We build filters and teach users to spot lures — we do not craft phishing. The goal is protection and awareness.</div>`,
    `<span class="eyebrow">AIC211 · Chương 5 · Bài 5.1</span>
<h2>Lọc thư rác / phishing &amp; NLP</h2>
<p class="lead">Email và tin nhắn là văn bản, nên đây là nơi <strong>Xử lý ngôn ngữ tự nhiên (NLP)</strong> gặp an ninh. Lọc thư rác là câu chuyện thành công kinh điển của ML trong phòng thủ.</p>
<h3>Biến văn bản thành số</h3>
<ul>
<li><strong>Bag-of-words</strong> — đếm mỗi từ.</li>
<li><strong>TF-IDF</strong> — cân từ theo mức đặc trưng của nó, giảm trọng số từ phổ biến.</li>
</ul>
<h3>Một bộ phân loại thư rác</h3>
<pre><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

model = make_pipeline(TfidfVectorizer(stop_words="english"), MultinomialNB())
model.fit(train_emails, train_labels)   # nhãn: spam / ham (lành)
pred = model.predict(["Your account is locked, verify now"])
</code></pre>
<h3>Phishing cần hơn cả câu chữ</h3>
<p>Kẻ tấn công sao chép ngôn từ hợp lệ, nên hãy thêm <strong>đặc trưng ngoài nội dung</strong>: tên hiển thị lệch tên miền người gửi, tên miền nhái, URL có host là địa chỉ IP, chữ liên kết khác với href, dấu hiệu hối thúc, tên miền mới đăng ký. Kết hợp NLP với các tín hiệu header/URL này thắng hơn dùng chữ đơn thuần.</p>
<div class="callout"><span class="badge">Khung phòng thủ</span> Ta xây bộ lọc và dạy người dùng nhận diện mồi nhử — ta không soạn phishing. Mục tiêu là bảo vệ và nâng nhận thức.</div>`,
  ]]);

const c5q = quiz('aic211-quiz-5', 'Quiz 5 — Spam/phishing & NLP|||Quiz 5 — Thư rác/phishing & NLP', [
  { id: 'q1', question: 'TF-IDF khác bag-of-words ở chỗ?', options: ['Không đếm từ', 'Cân trọng số từ theo mức đặc trưng, giảm từ quá phổ biến', 'Chỉ dùng cho ảnh', 'Yêu cầu GPU'], correctIndex: 1, explanation: 'TF-IDF hạ trọng số các từ xuất hiện khắp nơi và nâng từ hiếm/đặc trưng, giúp phân biệt tài liệu tốt hơn.' },
  { id: 'q2', question: 'Vì sao lọc phishing cần đặc trưng ngoài nội dung chữ?', options: ['Vì chữ luôn vô nghĩa', 'Vì kẻ tấn công sao chép ngôn từ hợp lệ; tín hiệu URL/tên miền/header khó giả hơn', 'Vì email không có chữ', 'Vì để chạy nhanh hơn'], correctIndex: 1, explanation: 'Nội dung có thể bắt chước email thật; các dấu hiệu như tên miền nhái, URL dạng IP, tên hiển thị lệch domain bổ sung bằng chứng.' },
  { id: 'q3', question: 'Thuật toán kinh điển hay dùng để lọc thư rác dạng văn bản là?', options: ['Isolation Forest', 'Naive Bayes', 'K-Means trên ảnh', 'Chỉ dùng biểu thức chính quy'], correctIndex: 1, explanation: 'Multinomial Naive Bayes trên đặc trưng từ (BoW/TF-IDF) là chuẩn mực lâu đời và hiệu quả cho lọc thư rác.' },
]);

const c6 = doc('aic211-6-1-fraud-ueba', '6.1 — Fraud detection &amp; user behaviour analytics (UEBA)|||6.1 — Phát hiện gian lận &amp; phân tích hành vi người dùng (UEBA)',
  'Gian lận là bài toán cực lệch lớp; đặc trưng giao dịch & hành vi; đường cơ sở mỗi người dùng (UEBA); xử lý mất cân bằng (class_weight, PR-AUC); tài khoản bị chiếm.',
  [[
    `<span class="eyebrow">AIC211 · Chapter 6 · Lesson 6.1</span>
<h2>Fraud detection &amp; UEBA</h2>
<p class="lead">Fraud is a <strong>needle-in-a-haystack</strong> problem — a tiny fraction of events are malicious. The same tools spot account takeover and insider misuse.</p>
<h3>Transaction &amp; behaviour features</h3>
<ul>
<li>Amount, time, location, device, velocity (transactions per hour).</li>
<li>Deviation from the user's own history — a $5,000 purchase abroad at 3am from a new device.</li>
</ul>
<h3>UEBA: a baseline per user</h3>
<p><strong>User and Entity Behaviour Analytics</strong> learns what is normal <em>for each account</em>, not just globally. A login time or data-download volume that is fine for one user is a red flag for another. Sudden divergence from an account's own baseline can signal <em>takeover</em> or insider abuse.</p>
<h3>Handling extreme imbalance</h3>
<pre><code>from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score

clf = LogisticRegression(class_weight="balanced", max_iter=1000)
clf.fit(X_train, y_train)                 # y: 1 = fraud (rare), 0 = legit
proba = clf.predict_proba(X_test)[:, 1]
print("PR-AUC:", average_precision_score(y_test, proba))  # better than accuracy here
</code></pre>
<div class="callout"><span class="badge">Metric that matters</span> With 0.1% fraud, use precision-recall AUC and cost-aware thresholds — blocking a real customer and letting fraud through carry very different costs.</div>`,
    `<span class="eyebrow">AIC211 · Chương 6 · Bài 6.1</span>
<h2>Phát hiện gian lận &amp; UEBA</h2>
<p class="lead">Gian lận là bài toán <strong>mò kim đáy bể</strong> — chỉ một phần cực nhỏ sự kiện là xấu. Cùng bộ công cụ này phát hiện chiếm tài khoản và lạm dụng nội bộ.</p>
<h3>Đặc trưng giao dịch &amp; hành vi</h3>
<ul>
<li>Số tiền, thời gian, vị trí, thiết bị, tốc độ (số giao dịch mỗi giờ).</li>
<li>Lệch khỏi lịch sử của chính người dùng — một giao dịch 5.000$ ở nước ngoài lúc 3 giờ sáng từ thiết bị mới.</li>
</ul>
<h3>UEBA: đường cơ sở cho từng người</h3>
<p><strong>Phân tích hành vi người dùng và thực thể</strong> học cái gì là bình thường <em>với từng tài khoản</em>, không chỉ toàn cục. Giờ đăng nhập hay lượng dữ liệu tải xuống bình thường với người này lại là cờ đỏ với người khác. Lệch đột ngột khỏi đường cơ sở của chính tài khoản có thể báo hiệu <em>bị chiếm</em> hoặc lạm dụng nội bộ.</p>
<h3>Xử lý mất cân bằng cực độ</h3>
<pre><code>from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score

clf = LogisticRegression(class_weight="balanced", max_iter=1000)
clf.fit(X_train, y_train)                 # y: 1 = gian lận (hiếm), 0 = hợp lệ
proba = clf.predict_proba(X_test)[:, 1]
print("PR-AUC:", average_precision_score(y_test, proba))  # tốt hơn accuracy ở đây
</code></pre>
<div class="callout"><span class="badge">Thước đo quan trọng</span> Với 0,1% gian lận, hãy dùng PR-AUC và ngưỡng tính theo chi phí — chặn nhầm khách thật và bỏ lọt gian lận có chi phí rất khác nhau.</div>`,
  ]]);

const c6q = quiz('aic211-quiz-6', 'Quiz 6 — Fraud & UEBA|||Quiz 6 — Gian lận & UEBA', [
  { id: 'q1', question: 'Ý tưởng cốt lõi của UEBA là?', options: ['Chặn mọi đăng nhập ban đêm', 'Học đường cơ sở hành vi cho TỪNG tài khoản rồi báo lệch', 'Chỉ dùng một ngưỡng chung cho mọi người', 'Xoá log cũ'], correctIndex: 1, explanation: 'UEBA dựng baseline riêng cho từng người/thực thể; lệch khỏi baseline của chính họ mới là tín hiệu, vì "bình thường" khác nhau giữa các tài khoản.' },
  { id: 'q2', question: 'Với dữ liệu chỉ 0,1% là gian lận, thước đo nào phù hợp hơn accuracy?', options: ['Tốc độ CPU', 'PR-AUC (precision-recall) và ngưỡng theo chi phí', 'Dung lượng ổ đĩa', 'Số dòng code'], correctIndex: 1, explanation: 'Lệch lớp cực độ khiến accuracy vô nghĩa; PR-AUC tập trung vào lớp hiếm và phản ánh chất lượng cảnh báo tốt hơn.' },
  { id: 'q3', question: 'Tham số class_weight="balanced" giúp gì khi dữ liệu mất cân bằng?', options: ['Xoá lớp thiểu số', 'Tăng trọng số cho lớp hiếm để mô hình không phớt lờ nó', 'Làm mô hình chạy nhanh gấp đôi', 'Chuyển bài toán thành hồi quy'], correctIndex: 1, explanation: 'Nó tăng phạt khi sai ở lớp hiếm, buộc mô hình chú ý tới gian lận thay vì tối ưu cho lớp đa số.' },
]);

const c7 = doc('aic211-7-1-adversarial-ml', '7.1 — Adversarial ML &amp; attacks on models (defence)|||7.1 — Adversarial ML &amp; tấn công vào mô hình (phòng thủ)',
  'Mối đe doạ với chính mô hình: né tránh (evasion), đầu độc dữ liệu (poisoning), trích xuất/đảo ngược; MITRE ATLAS; hướng phòng thủ: kiểm thử đối kháng, vệ sinh dữ liệu, giám sát.',
  [[
    `<span class="eyebrow">AIC211 · Chapter 7 · Lesson 7.1</span>
<h2>Adversarial ML — attacks on models, and defences</h2>
<p class="lead">A security model is itself an attack surface. We study these threats to <strong>harden defences</strong> — this chapter is conceptual and defensive, with no exploit recipes.</p>
<h3>Threats to the model</h3>
<ul>
<li><strong>Evasion</strong> — crafting inputs that flip a prediction at test time (e.g. tweaking a malware file so a classifier calls it benign).</li>
<li><strong>Poisoning</strong> — corrupting the training data so the model learns the wrong thing.</li>
<li><strong>Model extraction / inversion</strong> — stealing a model or recovering sensitive training data by querying it.</li>
</ul>
<p>MITRE <strong>ATLAS</strong> catalogues these tactics against AI systems, mirroring ATT&amp;CK for defenders.</p>
<h3>Defences</h3>
<ul>
<li><strong>Adversarial testing</strong> — probe your own model for weak spots before attackers do.</li>
<li><strong>Data hygiene</strong> — vet and provenance-check training data; guard the label pipeline against poisoning.</li>
<li><strong>Robustness</strong> — adversarial training, input validation, ensembles.</li>
<li><strong>Monitoring &amp; rate limits</strong> — detect query patterns that hint at extraction.</li>
</ul>
<pre><code>Defensive mindset (pseudocode):
  for each model release:
      run_adversarial_test_suite(model)   # measure robustness
      check_training_data_provenance()    # guard against poisoning
      set_query_rate_limits(api)          # slow extraction
      monitor_input_distribution()        # detect drift / probing
</code></pre>
<div class="callout"><span class="badge">Assume attackers adapt</span> A deployed model invites attacks against itself. Treat robustness as a requirement, not an afterthought.</div>`,
    `<span class="eyebrow">AIC211 · Chương 7 · Bài 7.1</span>
<h2>Adversarial ML — tấn công vào mô hình, và cách phòng thủ</h2>
<p class="lead">Một mô hình an ninh tự nó là bề mặt tấn công. Ta nghiên cứu các mối đe doạ này để <strong>gia cố phòng thủ</strong> — chương này mang tính khái niệm và phòng thủ, không có công thức khai thác.</p>
<h3>Mối đe doạ nhắm vào mô hình</h3>
<ul>
<li><strong>Né tránh (evasion)</strong> — tạo đầu vào làm lật dự đoán lúc suy luận (vd chỉnh một tệp mã độc để bộ phân loại gọi nó là lành).</li>
<li><strong>Đầu độc (poisoning)</strong> — làm hỏng dữ liệu huấn luyện để mô hình học sai.</li>
<li><strong>Trích xuất / đảo ngược mô hình</strong> — đánh cắp mô hình hoặc khôi phục dữ liệu huấn luyện nhạy cảm bằng cách truy vấn nó.</li>
</ul>
<p>MITRE <strong>ATLAS</strong> lập danh mục các chiến thuật này nhằm vào hệ AI, tương tự ATT&amp;CK cho người phòng thủ.</p>
<h3>Phòng thủ</h3>
<ul>
<li><strong>Kiểm thử đối kháng</strong> — tự dò điểm yếu của mô hình trước khi kẻ tấn công làm.</li>
<li><strong>Vệ sinh dữ liệu</strong> — thẩm định và truy nguồn dữ liệu huấn luyện; bảo vệ đường gán nhãn khỏi bị đầu độc.</li>
<li><strong>Độ bền vững</strong> — huấn luyện đối kháng, kiểm tra đầu vào, dùng ensemble.</li>
<li><strong>Giám sát &amp; giới hạn tần suất</strong> — phát hiện mẫu truy vấn gợi ý trích xuất mô hình.</li>
</ul>
<pre><code>Tư duy phòng thủ (mã giả):
  for each model release:
      run_adversarial_test_suite(model)   # đo độ bền
      check_training_data_provenance()    # chống đầu độc
      set_query_rate_limits(api)          # làm chậm trích xuất
      monitor_input_distribution()        # phát hiện trôi dạt / dò xét
</code></pre>
<div class="callout"><span class="badge">Giả định kẻ tấn công thích nghi</span> Một mô hình đã triển khai mời gọi tấn công nhắm vào chính nó. Hãy coi độ bền vững là yêu cầu, không phải thứ nghĩ sau.</div>`,
  ]]);

const c7q = quiz('aic211-quiz-7', 'Quiz 7 — Adversarial ML|||Quiz 7 — Adversarial ML', [
  { id: 'q1', question: 'Tấn công "poisoning" (đầu độc) nhắm vào giai đoạn nào của mô hình?', options: ['Lúc suy luận/dự đoán', 'Lúc huấn luyện — làm hỏng dữ liệu học', 'Lúc cài đặt thư viện', 'Lúc vẽ biểu đồ'], correctIndex: 1, explanation: 'Poisoning tác động vào dữ liệu huấn luyện để mô hình học sai; evasion mới là tấn công lúc suy luận.' },
  { id: 'q2', question: 'Tấn công "evasion" (né tránh) là?', options: ['Chỉnh đầu vào lúc suy luận để lật dự đoán của mô hình', 'Xoá toàn bộ mô hình', 'Tăng tốc huấn luyện', 'Đổi màu giao diện'], correctIndex: 0, explanation: 'Evasion tạo đầu vào khéo léo tại thời điểm test khiến mô hình phân loại sai, vd làm mã độc bị gọi là lành.' },
  { id: 'q3', question: 'Biện pháp phòng thủ nào giúp chống trích xuất mô hình (model extraction) qua API?', options: ['Bỏ hết log', 'Giới hạn tần suất truy vấn và giám sát phân bố đầu vào', 'Công khai trọng số mô hình', 'Tắt xác thực'], correctIndex: 1, explanation: 'Rate limit và theo dõi mẫu truy vấn bất thường làm khó việc dò/sao chép mô hình qua nhiều lần gọi.' },
]);

const c8 = doc('aic211-8-1-xai-mlsecops-ethics', '8.1 — Ethics, explainability (XAI) &amp; operating security ML (MLSecOps)|||8.1 — Đạo đức, giải thích được (XAI) &amp; vận hành ML an ninh (MLSecOps)',
  'NIST AI RMF (Govern/Map/Measure/Manage); XAI (feature importance, SHAP) vì analyst cần lý do; MLSecOps: giám sát trôi dạt, huấn luyện lại, human-in-the-loop; thiên lệch & quyền riêng tư.',
  [[
    `<span class="eyebrow">AIC211 · Chapter 8 · Lesson 8.1</span>
<h2>Ethics, XAI &amp; MLSecOps</h2>
<h3>Governing risk: NIST AI RMF</h3>
<p>The NIST <strong>AI Risk Management Framework</strong> organises trustworthy AI into four functions: <strong>Govern, Map, Measure, Manage</strong> — set policy, understand context, quantify risk, and act on it continuously.</p>
<h3>Explainability (XAI)</h3>
<p>A SOC analyst cannot act on "the model says bad." Explanations — <strong>feature importance</strong>, <strong>SHAP</strong> values — show <em>why</em> an alert fired, enabling triage, building trust, and exposing when a model learned a spurious shortcut.</p>
<pre><code>import shap
explainer = shap.TreeExplainer(clf)
shap_values = explainer.shap_values(X_alert)
# per-alert: which features pushed the score toward "malicious"
</code></pre>
<h3>MLSecOps — running models safely</h3>
<ul>
<li><strong>Monitor drift</strong> — data and concept change; a stale model quietly rots.</li>
<li><strong>Retrain &amp; version</strong> — refresh on new, vetted data; keep models reproducible.</li>
<li><strong>Human-in-the-loop</strong> — high-impact actions (blocking, disabling accounts) need a human check.</li>
</ul>
<h3>Ethics</h3>
<p>Watch for <strong>bias</strong> (a model that flags one group unfairly), <strong>privacy</strong> (logs contain personal data — minimise and protect it), and <strong>accountability</strong> (who owns a wrong automated block?). Defence must not become surveillance overreach.</p>
<div class="callout"><span class="badge">Course close</span> Effective security ML is measurable, explainable, monitored, and governed — technically sharp <em>and</em> responsible.</div>`,
    `<span class="eyebrow">AIC211 · Chương 8 · Bài 8.1</span>
<h2>Đạo đức, XAI &amp; MLSecOps</h2>
<h3>Quản trị rủi ro: NIST AI RMF</h3>
<p><strong>Khung Quản trị Rủi ro AI</strong> của NIST sắp xếp AI đáng tin thành bốn chức năng: <strong>Govern, Map, Measure, Manage</strong> — đặt chính sách, hiểu ngữ cảnh, định lượng rủi ro, và hành động liên tục.</p>
<h3>Giải thích được (XAI)</h3>
<p>Một analyst SOC không thể hành động chỉ vì "mô hình bảo xấu." Lời giải thích — <strong>độ quan trọng đặc trưng</strong>, giá trị <strong>SHAP</strong> — cho thấy <em>vì sao</em> cảnh báo nổ, giúp phân loại, tạo niềm tin, và lộ ra khi mô hình học phải lối tắt giả tạo.</p>
<pre><code>import shap
explainer = shap.TreeExplainer(clf)
shap_values = explainer.shap_values(X_alert)
# theo từng cảnh báo: đặc trưng nào đẩy điểm về phía "độc hại"
</code></pre>
<h3>MLSecOps — vận hành mô hình an toàn</h3>
<ul>
<li><strong>Giám sát trôi dạt</strong> — dữ liệu và khái niệm thay đổi; mô hình cũ âm thầm mục ruỗng.</li>
<li><strong>Huấn luyện lại &amp; đánh phiên bản</strong> — làm mới trên dữ liệu mới đã thẩm định; giữ mô hình tái lập được.</li>
<li><strong>Human-in-the-loop</strong> — hành động tác động lớn (chặn, khoá tài khoản) cần con người kiểm.</li>
</ul>
<h3>Đạo đức</h3>
<p>Cảnh giác với <strong>thiên lệch</strong> (mô hình gắn cờ bất công một nhóm), <strong>quyền riêng tư</strong> (log chứa dữ liệu cá nhân — thu tối thiểu và bảo vệ), và <strong>trách nhiệm giải trình</strong> (ai chịu trách nhiệm khi tự động chặn nhầm?). Phòng thủ không được biến thành giám sát quá đà.</p>
<div class="callout"><span class="badge">Khép môn học</span> ML an ninh hiệu quả là thứ đo được, giải thích được, giám sát được và có quản trị — vừa sắc bén kỹ thuật <em>vừa</em> có trách nhiệm.</div>`,
  ]]);

const c8q = quiz('aic211-quiz-8', 'Quiz 8 — Ethics, XAI & MLSecOps|||Quiz 8 — Đạo đức, XAI & MLSecOps', [
  { id: 'q1', question: 'Bốn chức năng của NIST AI RMF là?', options: ['Start, Stop, Pause, Resume', 'Govern, Map, Measure, Manage', 'Train, Test, Deploy, Delete', 'Read, Write, Update, Erase'], correctIndex: 1, explanation: 'NIST AI RMF tổ chức quản trị AI đáng tin thành Govern, Map, Measure, Manage.' },
  { id: 'q2', question: 'Vì sao XAI (giải thích được) quan trọng với analyst an ninh?', options: ['Để mô hình chạy nhanh hơn', 'Để biết VÌ SAO một cảnh báo nổ, giúp phân loại và tin tưởng', 'Để giảm dung lượng dữ liệu', 'Để thay thế hoàn toàn con người'], correctIndex: 1, explanation: 'Analyst cần lý do đằng sau cảnh báo (feature importance, SHAP) để hành động, xây niềm tin và phát hiện mô hình học sai tín hiệu.' },
  { id: 'q3', question: 'Trong MLSecOps, vì sao cần "human-in-the-loop" cho hành động tác động lớn?', options: ['Vì máy tính không tính được', 'Vì chặn/khoá nhầm gây hại lớn, cần con người kiểm trước khi thực thi', 'Vì để chạy chậm lại', 'Vì luật cấm tự động hoàn toàn mọi thứ'], correctIndex: 1, explanation: 'Hành động như chặn kết nối hay khoá tài khoản có hậu quả nặng nếu sai, nên cần một bước kiểm của con người.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'AIC211',
    slug: 'aic211-ai-for-cyber-security',
    title: 'AI for Cyber Security',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/AIC211.webp',
    shortDescription: 'How ML helps defenders — ML pipeline & metrics, security data (logs, netflow), malware, intrusion/anomaly detection, spam/phishing & NLP, fraud & UEBA, adversarial ML defence, XAI & MLSecOps. Defensive, bilingual, Python examples & quizzes.|||Học máy giúp người phòng thủ — quy trình ML & thước đo, dữ liệu an ninh (log, netflow), mã độc, xâm nhập/bất thường, thư rác/phishing & NLP, gian lận & UEBA, phòng thủ adversarial ML, XAI & MLSecOps. Song ngữ, có ví dụ Python & quiz.',
    description: 'Môn <strong>AIC211 — AI for Cyber Security</strong> (ngành An toàn thông tin, kỳ 4) cho thấy <strong>học máy giúp người phòng thủ</strong> thế nào. Từ <strong>nền tảng &amp; quy trình ML</strong> (precision/recall, dữ liệu lệch lớp) → <strong>chuẩn bị dữ liệu &amp; đặc trưng</strong> (log, netflow) → <strong>phát hiện mã độc</strong> → <strong>xâm nhập &amp; bất thường</strong> → <strong>thư rác/phishing &amp; NLP</strong> → <strong>gian lận &amp; UEBA</strong> → <strong>adversarial ML (phòng thủ)</strong> → <strong>đạo đức, XAI &amp; MLSecOps</strong>. Bám giáo trình (Chio/Freeman, Sumeet Dua, Halder/Ozdemir, NIST AI RMF), song ngữ, có ví dụ Python (scikit-learn/pandas) và quiz mỗi chương. Định hướng phòng thủ, không hướng dẫn tấn công thực chiến.',
    whatYouLearn: 'Quy trình ML & đánh giá lệch lớp (precision/recall/F1); biến log & netflow thành đặc trưng (one-hot, chuẩn hoá, cửa sổ thời gian); phát hiện mã độc (đặc trưng tĩnh/động, Random Forest); phát hiện xâm nhập & bất thường (Isolation Forest, One-Class SVM); lọc thư rác/phishing (TF-IDF, Naive Bayes, đặc trưng URL); gian lận & UEBA (PR-AUC, baseline người dùng); adversarial ML (evasion/poisoning/extraction) & phòng thủ; XAI (SHAP), MLSecOps và NIST AI RMF.',
    requirements: 'Kiến thức Python cơ bản và nền tảng an toàn thông tin nhập môn. Nên biết pandas/scikit-learn (có thể học song song). Xem điều kiện tiên quyết ngành An toàn thông tin trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách nền tảng, NIST AI RMF, bộ dữ liệu, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'AI cho phòng thủ, ba kiểu học, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Giao thoa AI & an ninh|||Chapter 1 — AI & security intersection', description: 'Luật vs ML, quy trình ML, precision/recall.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Dữ liệu & đặc trưng|||Chapter 2 — Data & features', description: 'Log, netflow, one-hot, chuẩn hoá, cửa sổ thời gian.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phát hiện mã độc|||Chapter 3 — Malware detection', description: 'Đặc trưng tĩnh/động, Random Forest, packing.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Xâm nhập & bất thường|||Chapter 4 — Intrusion & anomaly', description: 'IDS, Isolation Forest, One-Class SVM, ngưỡng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thư rác/phishing & NLP|||Chapter 5 — Spam/phishing & NLP', description: 'TF-IDF, Naive Bayes, đặc trưng URL/tên miền.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Gian lận & UEBA|||Chapter 6 — Fraud & UEBA', description: 'Lệch lớp, PR-AUC, baseline người dùng.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Adversarial ML|||Chapter 7 — Adversarial ML', description: 'Evasion/poisoning/extraction & phòng thủ, ATLAS.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đạo đức, XAI & MLSecOps|||Chapter 8 — Ethics, XAI & MLSecOps', description: 'NIST AI RMF, SHAP, giám sát drift, human-in-the-loop.', lessons: [c8, c8q] },
  ],
};
