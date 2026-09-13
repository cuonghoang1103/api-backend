/**
 * AIS201 — Artificial Intelligence for Cybersecurity (Trí tuệ nhân tạo cho An
 * ninh mạng). Ngành Khoa học Máy tính FPTU, Kỳ 4. Full khung 8 chương, song
 * ngữ VI+EN, có khối code Python/scikit-learn minh hoạ + quiz mỗi chương.
 * Nguồn chuẩn: Chio & Freeman "Machine Learning and Security" (O'Reilly),
 * Sikos "AI in Cybersecurity", MITRE ATT&CK, scikit-learn.
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. ⚠️ KHÔNG backtick/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ais201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền tảng, tài liệu chính thức miễn phí, MITRE ATT&CK, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">AIS201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>AI for Cybersecurity</strong> in one place — from turning security data into features to detecting anomalies, malware, phishing and attacks, and defending the models themselves. The official slides &amp; giáo trình live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for AIS201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/machine-learning-and/9781491979891/" target="_blank" rel="noopener"><em>Machine Learning and Security</em> — Chio &amp; Freeman (O'Reilly)</a></li>
<li><a href="https://link.springer.com/book/10.1007/978-3-319-98842-9" target="_blank" rel="noopener"><em>AI in Cybersecurity</em> — Leslie F. Sikos (ed.)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://attack.mitre.org/" target="_blank" rel="noopener">MITRE ATT&amp;CK — adversary tactics &amp; techniques</a></li>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn User Guide</a></li>
<li><a href="https://www.cisa.gov/topics/cyber-threats-and-advisories" target="_blank" rel="noopener">CISA — cyber threats &amp; advisories</a></li>
</ul>
<h3>▶️ Datasets &amp; practice</h3>
<ul>
<li><a href="https://www.unb.ca/cic/datasets/nsl.html" target="_blank" rel="noopener">NSL-KDD — intrusion detection dataset</a></li>
<li><a href="https://www.unb.ca/cic/datasets/ids-2017.html" target="_blank" rel="noopener">CIC-IDS2017 — labelled network traffic</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — why AI helps security, the threat landscape, and how logs &amp; traffic become features.</li>
<li><strong>Detection core</strong> — anomaly detection (IDS), malware classification, phishing &amp; spam with NLP.</li>
<li><strong>Attack detection</strong> — network intrusion, DDoS and botnets on flow features.</li>
<li><strong>Defend the model</strong> — adversarial ML (poisoning, evasion), SOC/SIEM operations, explainability &amp; ethics.</li>
</ol></div>`,
    `<span class="eyebrow">AIS201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>AI cho An ninh mạng</strong> gom về một chỗ — từ biến dữ liệu an ninh thành đặc trưng đến phát hiện bất thường, mã độc, lừa đảo và tấn công, rồi bảo vệ chính mô hình. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của AIS201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/machine-learning-and/9781491979891/" target="_blank" rel="noopener"><em>Machine Learning and Security</em> — Chio &amp; Freeman (O'Reilly)</a></li>
<li><a href="https://link.springer.com/book/10.1007/978-3-319-98842-9" target="_blank" rel="noopener"><em>AI in Cybersecurity</em> — Leslie F. Sikos (ed.)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://attack.mitre.org/" target="_blank" rel="noopener">MITRE ATT&amp;CK — chiến thuật &amp; kỹ thuật của kẻ tấn công</a></li>
<li><a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener">scikit-learn User Guide</a></li>
<li><a href="https://www.cisa.gov/topics/cyber-threats-and-advisories" target="_blank" rel="noopener">CISA — cảnh báo &amp; mối đe doạ mạng</a></li>
</ul>
<h3>▶️ Bộ dữ liệu &amp; luyện tập</h3>
<ul>
<li><a href="https://www.unb.ca/cic/datasets/nsl.html" target="_blank" rel="noopener">NSL-KDD — bộ dữ liệu phát hiện xâm nhập</a></li>
<li><a href="https://www.unb.ca/cic/datasets/ids-2017.html" target="_blank" rel="noopener">CIC-IDS2017 — lưu lượng mạng đã gán nhãn</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — vì sao AI giúp an ninh, bối cảnh mối đe doạ, và cách log &amp; lưu lượng thành đặc trưng.</li>
<li><strong>Lõi phát hiện</strong> — phát hiện bất thường (IDS), phân loại mã độc, lừa đảo &amp; thư rác bằng NLP.</li>
<li><strong>Phát hiện tấn công</strong> — xâm nhập mạng, DDoS và botnet trên đặc trưng luồng.</li>
<li><strong>Bảo vệ mô hình</strong> — tấn công đối kháng (đầu độc, né tránh), vận hành SOC/SIEM, giải thích được &amp; đạo đức.</li>
</ol></div>`,
  ]]);

const intro = doc('ais201-0-1-overview', 'Course overview: AI for Cybersecurity|||Tổng quan: AI cho An ninh mạng',
  'AI/ML làm gì trong an ninh mạng; vòng đời một hệ phát hiện (dữ liệu → đặc trưng → mô hình → cảnh báo); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">AIS201 · Lesson 0.1 · Overview</span>
<h2>AI for Cybersecurity</h2>
<p class="lead">This course shows how <strong>machine learning defends computer systems</strong> — spotting patterns in floods of logs and traffic that no human team could read in time. You will build detectors for anomalies, malware, phishing and network attacks, and learn to defend the models themselves against attackers.</p>
<h3>The detection lifecycle</h3>
<ul>
<li><strong>Data</strong> — logs, network flows, files, emails.</li>
<li><strong>Features</strong> — turn raw events into numeric vectors a model can learn from.</li>
<li><strong>Model</strong> — train a classifier or anomaly detector on those features.</li>
<li><strong>Alert</strong> — score new events, raise alerts, and feed a SOC analyst.</li>
</ul>
<h3>Why AI, and the catch</h3>
<p>Attacks evolve faster than hand-written rules. ML generalises to <em>unseen</em> variants — but it also brings <strong>false positives</strong>, needs clean labelled data, and can itself be attacked. Every chapter balances the power against these limits.</p>
<pre><code># The whole course in one skeleton (scikit-learn)
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=200)
model.fit(X_train, y_train)          # learn benign vs malicious
alerts = model.predict(X_new)        # score fresh events
</code></pre>
<div class="callout"><span class="badge">Roadmap</span> Threat landscape and security data &amp; features → anomaly detection (IDS) → malware → phishing &amp; spam (NLP) → attack detection (DDoS, botnets) → adversarial ML → SOC/SIEM operations, explainability &amp; ethics.</div>`,
    `<span class="eyebrow">AIS201 · Bài 0.1 · Tổng quan</span>
<h2>AI cho An ninh mạng</h2>
<p class="lead">Môn này cho thấy <strong>máy học bảo vệ hệ thống máy tính thế nào</strong> — nhận ra khuôn mẫu trong biển log và lưu lượng mà không đội người nào đọc kịp. Bạn sẽ dựng bộ phát hiện bất thường, mã độc, lừa đảo và tấn công mạng, rồi học cách bảo vệ chính các mô hình trước kẻ tấn công.</p>
<h3>Vòng đời một hệ phát hiện</h3>
<ul>
<li><strong>Dữ liệu</strong> — log, luồng mạng, tệp tin, email.</li>
<li><strong>Đặc trưng</strong> — biến sự kiện thô thành vector số để mô hình học.</li>
<li><strong>Mô hình</strong> — huấn luyện bộ phân loại hoặc bộ phát hiện bất thường trên đặc trưng đó.</li>
<li><strong>Cảnh báo</strong> — chấm điểm sự kiện mới, phát cảnh báo, đưa cho chuyên viên SOC.</li>
</ul>
<h3>Vì sao dùng AI, và cái giá</h3>
<p>Tấn công tiến hoá nhanh hơn luật viết tay. ML khái quát được cho biến thể <em>chưa từng thấy</em> — nhưng cũng đem theo <strong>dương tính giả</strong>, cần dữ liệu gán nhãn sạch, và bản thân nó có thể bị tấn công. Mỗi chương cân sức mạnh với các giới hạn này.</p>
<pre><code># Cả môn học trong một khung xương (scikit-learn)
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=200)
model.fit(X_train, y_train)          # học lành tính vs độc hại
alerts = model.predict(X_new)        # chấm điểm sự kiện mới
</code></pre>
<div class="callout"><span class="badge">Lộ trình</span> Bối cảnh đe doạ và dữ liệu &amp; đặc trưng → phát hiện bất thường (IDS) → mã độc → lừa đảo &amp; thư rác (NLP) → phát hiện tấn công (DDoS, botnet) → tấn công đối kháng → vận hành SOC/SIEM, giải thích được &amp; đạo đức.</div>`,
  ]]);

const c1 = doc('ais201-1-1-ai-in-security', '1.1 — AI in cybersecurity|||1.1 — AI trong an ninh mạng',
  'Vì sao dùng AI cho security; cơ hội & thách thức; bối cảnh mối đe doạ (threat landscape) và MITRE ATT&CK.',
  [[
    `<span class="eyebrow">AIS201 · Chapter 1 · Lesson 1.1</span>
<h2>AI in cybersecurity</h2>
<h3>Why AI for security</h3>
<p>Modern defenders drown in telemetry: millions of log lines, network flows and alerts per day. <strong>Rule-based</strong> tools catch only what someone already described; they miss novel attacks and drift out of date. <strong>Machine learning</strong> learns the shape of normal and of known-bad from data, then generalises to variants it has never seen.</p>
<h3>Opportunities &amp; challenges</h3>
<ul>
<li><strong>Opportunity</strong> — scale (score millions of events), speed, and catching <em>unknown</em> threats via anomaly detection.</li>
<li><strong>Challenge</strong> — false positives that exhaust analysts, the need for clean labelled data, class imbalance (attacks are rare), and models that attackers can fool.</li>
</ul>
<h3>The threat landscape &amp; MITRE ATT&amp;CK</h3>
<p><strong>MITRE ATT&amp;CK</strong> is a shared catalogue of adversary <em>tactics</em> (the goal — e.g. Initial Access, Exfiltration) and <em>techniques</em> (the how). Mapping detections to ATT&amp;CK tells you which attacker behaviours you can and cannot see.</p>
<pre><code># A tiny ATT&amp;CK-style mapping of detectors to tactics
coverage = {
    "Initial Access":  "phishing classifier",
    "Execution":       "malware classifier",
    "Command &amp; Control": "botnet flow detector",
    "Exfiltration":    "traffic anomaly detector",
}
for tactic, detector in coverage.items():
    print(tactic, "->", detector)
</code></pre>
<div class="callout"><span class="badge">Key idea</span> AI does not replace rules — it adds a layer that generalises. The art is combining both while keeping false positives low enough for a human SOC to act on.</div>`,
    `<span class="eyebrow">AIS201 · Chương 1 · Bài 1.1</span>
<h2>AI trong an ninh mạng</h2>
<h3>Vì sao dùng AI cho security</h3>
<p>Người phòng thủ hiện đại chìm trong dữ liệu đo: hàng triệu dòng log, luồng mạng và cảnh báo mỗi ngày. Công cụ <strong>dựa trên luật</strong> chỉ bắt được thứ ai đó đã mô tả; chúng bỏ lỡ tấn công mới và lỗi thời dần. <strong>Máy học</strong> học hình dạng của bình thường và của cái-xấu-đã-biết từ dữ liệu, rồi khái quát cho biến thể chưa từng thấy.</p>
<h3>Cơ hội &amp; thách thức</h3>
<ul>
<li><strong>Cơ hội</strong> — quy mô (chấm hàng triệu sự kiện), tốc độ, và bắt được mối đe doạ <em>chưa biết</em> nhờ phát hiện bất thường.</li>
<li><strong>Thách thức</strong> — dương tính giả làm kiệt sức chuyên viên, cần dữ liệu gán nhãn sạch, mất cân bằng lớp (tấn công hiếm), và mô hình có thể bị lừa.</li>
</ul>
<h3>Bối cảnh đe doạ &amp; MITRE ATT&amp;CK</h3>
<p><strong>MITRE ATT&amp;CK</strong> là danh mục chung về <em>chiến thuật</em> của kẻ tấn công (mục tiêu — vd Truy cập ban đầu, Rút dữ liệu) và <em>kỹ thuật</em> (cách làm). Ánh xạ phép phát hiện vào ATT&amp;CK cho biết bạn thấy và không thấy được hành vi tấn công nào.</p>
<pre><code># Ánh xạ kiểu ATT&amp;CK: bộ phát hiện ứng với chiến thuật
coverage = {
    "Initial Access":  "bo phan loai lua dao",
    "Execution":       "bo phan loai ma doc",
    "Command &amp; Control": "bo phat hien botnet",
    "Exfiltration":    "bo phat hien bat thuong luu luong",
}
for tactic, detector in coverage.items():
    print(tactic, "->", detector)
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> AI không thay luật — nó thêm một lớp biết khái quát. Nghệ thuật là kết hợp cả hai mà giữ dương tính giả đủ thấp để SOC người còn hành động được.</div>`,
  ]]);

const c1q = quiz('ais201-quiz-1', 'Quiz 1 — AI in security|||Quiz 1 — AI trong an ninh', [
  { id: 'q1', question: 'Advantage of ML over rule-based tools?|||Ưu điểm của ML so với công cụ dựa trên luật?', options: ['Never has false positives|||Không bao giờ có dương tính giả', 'Generalises to unseen attack variants|||Khái quát cho biến thể tấn công chưa từng thấy', 'Needs no data|||Không cần dữ liệu', 'Cannot be attacked|||Không thể bị tấn công'], correctIndex: 1, explanation: 'ML học hình dạng dữ liệu nên bắt được biến thể mới; luật chỉ bắt thứ đã mô tả sẵn.' },
  { id: 'q2', question: 'MITRE ATT&CK catalogues what?|||MITRE ATT&CK là danh mục về gì?', options: ['Only malware hashes|||Chỉ mã băm mã độc', 'Adversary tactics and techniques|||Chiến thuật và kỹ thuật của kẻ tấn công', 'CPU benchmarks|||Điểm chuẩn CPU', 'Firewall prices|||Giá tường lửa'], correctIndex: 1, explanation: 'ATT&CK mô tả tactics (mục tiêu) và techniques (cách làm) của kẻ tấn công.' },
  { id: 'q3', question: 'A core challenge of ML in security is?|||Thách thức cốt lõi của ML trong an ninh là?', options: ['Too few log lines|||Quá ít dòng log', 'False positives and class imbalance|||Dương tính giả và mất cân bằng lớp', 'No maths involved|||Không dính toán học', 'Attacks are too common|||Tấn công quá phổ biến'], correctIndex: 1, explanation: 'Tấn công hiếm (mất cân bằng) và dương tính giả làm kiệt sức chuyên viên là hai thách thức lớn.' },
]);

const c2 = doc('ais201-2-1-data-features', '2.1 — Security data & features|||2.1 — Dữ liệu an ninh & đặc trưng',
  'Nguồn dữ liệu (log hệ thống, network traffic, tệp, email); feature engineering cho security; chuẩn hoá & mã hoá đặc trưng.',
  [[
    `<span class="eyebrow">AIS201 · Chapter 2 · Lesson 2.1</span>
<h2>Security data &amp; features</h2>
<h3>Where the data comes from</h3>
<ul>
<li><strong>Logs</strong> — authentication, web server, OS and application events.</li>
<li><strong>Network traffic</strong> — packets and aggregated <em>flows</em> (source, destination, ports, bytes, duration).</li>
<li><strong>Files &amp; emails</strong> — for malware and phishing detection.</li>
</ul>
<h3>Feature engineering</h3>
<p>A model reads numbers, not raw text. <strong>Feature engineering</strong> turns an event into a vector: counts, rates, ratios, and encodings of categorical fields. Good features are the single biggest lever on accuracy — far more than the choice of algorithm.</p>
<pre><code>import pandas as pd
from sklearn.preprocessing import StandardScaler

# One row per network flow
df = pd.DataFrame({
    "duration": [0.2, 12.5, 0.1],
    "src_bytes": [40, 60000, 20],
    "dst_bytes": [80, 200, 0],
})
df["bytes_ratio"] = df["src_bytes"] / (df["dst_bytes"] + 1)
X = StandardScaler().fit_transform(df)   # zero mean, unit variance
print(X.shape)
</code></pre>
<h3>Scaling &amp; encoding</h3>
<p>Numeric features are <strong>standardised</strong> so no single large column dominates; categorical fields (protocol, service) are <strong>one-hot encoded</strong> into 0/1 columns.</p>
<div class="callout"><span class="badge">Garbage in, garbage out</span> The detector is only as good as its features. Time spent on clean, meaningful features beats time spent tuning the model.</div>`,
    `<span class="eyebrow">AIS201 · Chương 2 · Bài 2.1</span>
<h2>Dữ liệu an ninh &amp; đặc trưng</h2>
<h3>Dữ liệu đến từ đâu</h3>
<ul>
<li><strong>Log</strong> — sự kiện xác thực, web server, hệ điều hành và ứng dụng.</li>
<li><strong>Lưu lượng mạng</strong> — gói tin và <em>luồng</em> gộp (nguồn, đích, cổng, số byte, thời lượng).</li>
<li><strong>Tệp &amp; email</strong> — cho phát hiện mã độc và lừa đảo.</li>
</ul>
<h3>Feature engineering</h3>
<p>Mô hình đọc số, không đọc chữ thô. <strong>Feature engineering</strong> biến một sự kiện thành vector: số đếm, tần suất, tỉ lệ và mã hoá các trường phân loại. Đặc trưng tốt là đòn bẩy lớn nhất cho độ chính xác — hơn cả việc chọn thuật toán.</p>
<pre><code>import pandas as pd
from sklearn.preprocessing import StandardScaler

# Mot dong moi luong mang
df = pd.DataFrame({
    "duration": [0.2, 12.5, 0.1],
    "src_bytes": [40, 60000, 20],
    "dst_bytes": [80, 200, 0],
})
df["bytes_ratio"] = df["src_bytes"] / (df["dst_bytes"] + 1)
X = StandardScaler().fit_transform(df)   # trung binh 0, phuong sai 1
print(X.shape)
</code></pre>
<h3>Chuẩn hoá &amp; mã hoá</h3>
<p>Đặc trưng số được <strong>chuẩn hoá</strong> để không cột lớn nào lấn át; trường phân loại (giao thức, dịch vụ) được <strong>one-hot</strong> thành các cột 0/1.</p>
<div class="callout"><span class="badge">Rác vào, rác ra</span> Bộ phát hiện chỉ tốt bằng đặc trưng của nó. Thời gian cho đặc trưng sạch, có nghĩa hơn hẳn thời gian tinh chỉnh mô hình.</div>`,
  ]]);

const c2q = quiz('ais201-quiz-2', 'Quiz 2 — Data & features|||Quiz 2 — Dữ liệu & đặc trưng', [
  { id: 'q1', question: 'A network flow typically records?|||Một luồng mạng thường ghi lại?', options: ['Only the payload text|||Chỉ nội dung văn bản', 'Source, destination, ports, bytes, duration|||Nguồn, đích, cổng, số byte, thời lượng', 'The user password|||Mật khẩu người dùng', 'CPU temperature|||Nhiệt độ CPU'], correctIndex: 1, explanation: 'Flow gộp thông tin luồng: nguồn/đích, cổng, byte, thời lượng — nền cho đặc trưng.' },
  { id: 'q2', question: 'Why standardise numeric features?|||Vì sao chuẩn hoá đặc trưng số?', options: ['To delete outliers|||Để xoá điểm ngoại lệ', 'So no single large-valued column dominates|||Để không cột giá trị lớn nào lấn át', 'To make data categorical|||Để biến dữ liệu thành phân loại', 'It is never needed|||Không bao giờ cần'], correctIndex: 1, explanation: 'Chuẩn hoá đưa các cột về cùng thang (trung bình 0, phương sai 1) nên không cột nào áp đảo.' },
  { id: 'q3', question: 'Categorical fields like protocol are usually?|||Trường phân loại như giao thức thường được?', options: ['One-hot encoded into 0/1 columns|||One-hot thành các cột 0/1', 'Left as raw strings|||Để nguyên chuỗi thô', 'Deleted|||Xoá đi', 'Squared|||Bình phương'], correctIndex: 0, explanation: 'One-hot biến mỗi giá trị phân loại thành một cột 0/1 để mô hình học được.' },
]);

const c3 = doc('ais201-3-1-anomaly-detection', '3.1 — Anomaly detection & IDS|||3.1 — Phát hiện bất thường & IDS',
  'Học không giám sát; phát hiện bất thường (Isolation Forest); hệ phát hiện xâm nhập IDS dựa trên độ lệch khỏi bình thường.',
  [[
    `<span class="eyebrow">AIS201 · Chapter 3 · Lesson 3.1</span>
<h2>Anomaly detection &amp; IDS</h2>
<h3>Learning normal without labels</h3>
<p>Attacks are rare and often <em>unknown</em>, so labelled examples are scarce. <strong>Anomaly detection</strong> learns the shape of <em>normal</em> behaviour from unlabelled data, then flags whatever deviates. This is the heart of an <strong>anomaly-based IDS</strong> (Intrusion Detection System).</p>
<h3>Isolation Forest</h3>
<p><strong>Isolation Forest</strong> isolates points with random splits; anomalies are easier to isolate (fewer splits), so they score as outliers. It is fast, unsupervised, and scales well.</p>
<pre><code>from sklearn.ensemble import IsolationForest

# X = normal-ish traffic features (mostly benign)
detector = IsolationForest(contamination=0.02, random_state=0)
detector.fit(X_train)

pred = detector.predict(X_new)   # -1 = anomaly, 1 = normal
anomalies = (pred == -1).sum()
print("flagged:", anomalies)
</code></pre>
<h3>Signature vs anomaly IDS</h3>
<ul>
<li><strong>Signature-based</strong> — matches known attack patterns; precise but blind to novel attacks.</li>
<li><strong>Anomaly-based</strong> — flags deviation from normal; catches the unknown, but more false positives.</li>
</ul>
<div class="callout"><span class="badge">Trade-off</span> Anomaly detection is your only hope against truly new attacks — but a noisy baseline of normal means alert fatigue. Tune <em>contamination</em> to your tolerance.</div>`,
    `<span class="eyebrow">AIS201 · Chương 3 · Bài 3.1</span>
<h2>Phát hiện bất thường &amp; IDS</h2>
<h3>Học bình thường mà không cần nhãn</h3>
<p>Tấn công hiếm và thường <em>chưa biết</em>, nên ví dụ có nhãn khan hiếm. <strong>Phát hiện bất thường</strong> học hình dạng hành vi <em>bình thường</em> từ dữ liệu không nhãn, rồi đánh dấu thứ nào lệch đi. Đây là trái tim của <strong>IDS dựa trên bất thường</strong> (Hệ phát hiện xâm nhập).</p>
<h3>Isolation Forest</h3>
<p><strong>Isolation Forest</strong> cô lập điểm bằng phép chia ngẫu nhiên; điểm bất thường dễ cô lập hơn (ít lần chia), nên bị chấm là ngoại lệ. Nó nhanh, không giám sát, và mở rộng tốt.</p>
<pre><code>from sklearn.ensemble import IsolationForest

# X = dac trung luu luong (phan lon lanh tinh)
detector = IsolationForest(contamination=0.02, random_state=0)
detector.fit(X_train)

pred = detector.predict(X_new)   # -1 = bat thuong, 1 = binh thuong
anomalies = (pred == -1).sum()
print("danh dau:", anomalies)
</code></pre>
<h3>IDS chữ ký vs bất thường</h3>
<ul>
<li><strong>Dựa trên chữ ký</strong> — khớp khuôn mẫu tấn công đã biết; chính xác nhưng mù trước tấn công mới.</li>
<li><strong>Dựa trên bất thường</strong> — đánh dấu độ lệch khỏi bình thường; bắt được cái chưa biết, nhưng nhiều dương tính giả hơn.</li>
</ul>
<div class="callout"><span class="badge">Đánh đổi</span> Phát hiện bất thường là hy vọng duy nhất trước tấn công thực sự mới — nhưng nền bình thường nhiễu nghĩa là mệt mỏi vì cảnh báo. Tinh chỉnh <em>contamination</em> theo mức chịu đựng của bạn.</div>`,
  ]]);

const c3q = quiz('ais201-quiz-3', 'Quiz 3 — Anomaly & IDS|||Quiz 3 — Bất thường & IDS', [
  { id: 'q1', question: 'Why use unsupervised anomaly detection in security?|||Vì sao dùng phát hiện bất thường không giám sát trong an ninh?', options: ['Labels for attacks are abundant|||Nhãn tấn công dồi dào', 'Attacks are rare/unknown, so labels are scarce|||Tấn công hiếm/chưa biết nên nhãn khan hiếm', 'It needs no data|||Không cần dữ liệu', 'It only works on images|||Chỉ chạy trên ảnh'], correctIndex: 1, explanation: 'Vì tấn công hiếm và thường chưa biết, ta học bình thường rồi đánh dấu độ lệch.' },
  { id: 'q2', question: 'In Isolation Forest, an anomaly is?|||Trong Isolation Forest, điểm bất thường là?', options: ['Harder to isolate|||Khó cô lập hơn', 'Easier to isolate (fewer splits)|||Dễ cô lập hơn (ít lần chia)', 'Always labelled|||Luôn có nhãn', 'Ignored|||Bị bỏ qua'], correctIndex: 1, explanation: 'Điểm bất thường tách ra với ít lần chia hơn nên bị chấm là ngoại lệ.' },
  { id: 'q3', question: 'A signature-based IDS is weak against?|||IDS dựa trên chữ ký yếu trước?', options: ['Known attacks|||Tấn công đã biết', 'Novel/unknown attacks|||Tấn công mới/chưa biết', 'Slow networks|||Mạng chậm', 'Large logs|||Log lớn'], correctIndex: 1, explanation: 'Chữ ký chỉ khớp mẫu đã biết nên mù trước tấn công mới; bất thường bổ khuyết chỗ đó.' },
]);

const c4 = doc('ais201-4-1-malware-classification', '4.1 — Malware classification|||4.1 — Phân loại mã độc',
  'Đặc trưng ML cho mã độc; phân tích tĩnh (static) vs động (dynamic); phân loại benign/malware bằng Random Forest.',
  [[
    `<span class="eyebrow">AIS201 · Chapter 4 · Lesson 4.1</span>
<h2>Malware classification</h2>
<h3>Static vs dynamic analysis</h3>
<ul>
<li><strong>Static analysis</strong> — inspect the file <em>without running it</em>: byte n-grams, imported API calls, PE header fields, printable strings. Fast and safe, but packers/obfuscation hide intent.</li>
<li><strong>Dynamic analysis</strong> — run the file in a <strong>sandbox</strong> and record behaviour: files touched, registry keys, network calls. Sees real intent, but slower and evadable by sandbox-aware malware.</li>
</ul>
<h3>Features &amp; a classifier</h3>
<p>Both approaches yield features you can feed a supervised classifier. <strong>Random Forest</strong> and gradient boosting are strong, robust baselines for malware detection.</p>
<pre><code>from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# X = static features (imported APIs, section sizes, entropy...)
# y = 0 benign, 1 malware
clf = RandomForestClassifier(n_estimators=300, random_state=0)
clf.fit(X_train, y_train)

print(classification_report(y_test, clf.predict(X_test)))
</code></pre>
<div class="callout"><span class="badge">Best of both</span> Production pipelines combine static features (cheap, at scale) with dynamic behaviour (deep, for suspicious files) — and retrain often, because malware families mutate constantly.</div>`,
    `<span class="eyebrow">AIS201 · Chương 4 · Bài 4.1</span>
<h2>Phân loại mã độc</h2>
<h3>Phân tích tĩnh vs động</h3>
<ul>
<li><strong>Phân tích tĩnh</strong> — soi tệp <em>mà không chạy</em>: n-gram byte, lời gọi API nhập, trường header PE, chuỗi in được. Nhanh và an toàn, nhưng đóng gói/làm rối che giấu ý đồ.</li>
<li><strong>Phân tích động</strong> — chạy tệp trong <strong>sandbox</strong> và ghi hành vi: tệp bị đụng, khoá registry, lời gọi mạng. Thấy ý đồ thật, nhưng chậm hơn và bị mã độc nhận biết sandbox né tránh.</li>
</ul>
<h3>Đặc trưng &amp; bộ phân loại</h3>
<p>Cả hai hướng cho ra đặc trưng để đưa vào bộ phân loại có giám sát. <strong>Random Forest</strong> và gradient boosting là baseline mạnh, bền cho phát hiện mã độc.</p>
<pre><code>from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# X = dac trung tinh (API nhap, kich thuoc section, entropy...)
# y = 0 lanh tinh, 1 ma doc
clf = RandomForestClassifier(n_estimators=300, random_state=0)
clf.fit(X_train, y_train)

print(classification_report(y_test, clf.predict(X_test)))
</code></pre>
<div class="callout"><span class="badge">Kết hợp cả hai</span> Pipeline thực tế ghép đặc trưng tĩnh (rẻ, quy mô lớn) với hành vi động (sâu, cho tệp khả nghi) — và huấn luyện lại thường xuyên, vì họ mã độc biến đổi liên tục.</div>`,
  ]]);

const c4q = quiz('ais201-quiz-4', 'Quiz 4 — Malware|||Quiz 4 — Mã độc', [
  { id: 'q1', question: 'Static analysis of malware means?|||Phân tích tĩnh mã độc nghĩa là?', options: ['Running it in a sandbox|||Chạy trong sandbox', 'Inspecting the file without running it|||Soi tệp mà không chạy', 'Deleting the file|||Xoá tệp', 'Encrypting the file|||Mã hoá tệp'], correctIndex: 1, explanation: 'Tĩnh: soi byte, API nhập, header, chuỗi — không thực thi tệp.' },
  { id: 'q2', question: 'A weakness of dynamic (sandbox) analysis?|||Điểm yếu của phân tích động (sandbox)?', options: ['Cannot see behaviour|||Không thấy hành vi', 'Sandbox-aware malware can evade it|||Mã độc nhận biết sandbox có thể né', 'Never runs code|||Không bao giờ chạy mã', 'Has no features|||Không có đặc trưng'], correctIndex: 1, explanation: 'Mã độc phát hiện đang trong sandbox có thể ngủ yên để né phân tích động.' },
  { id: 'q3', question: 'A strong baseline classifier for malware features?|||Bộ phân loại baseline mạnh cho đặc trưng mã độc?', options: ['Random Forest|||Random Forest', 'Bubble sort|||Sắp xếp nổi bọt', 'A firewall rule|||Một luật tường lửa', 'Linear regression on labels|||Hồi quy tuyến tính trên nhãn'], correctIndex: 0, explanation: 'Random Forest / gradient boosting là baseline mạnh, bền cho phân loại mã độc.' },
]);

const c5 = doc('ais201-5-1-phishing-spam', '5.1 — Phishing & spam detection|||5.1 — Phát hiện lừa đảo & thư rác',
  'NLP cho security; đặc trưng văn bản (TF-IDF); phát hiện phishing/spam bằng bộ phân loại tuyến tính; dấu hiệu URL đáng ngờ.',
  [[
    `<span class="eyebrow">AIS201 · Chapter 5 · Lesson 5.1</span>
<h2>Phishing &amp; spam detection</h2>
<h3>NLP for security</h3>
<p>Phishing and spam are <em>text</em> problems. <strong>Natural Language Processing (NLP)</strong> turns an email or message into features a model can score. The classic representation is <strong>TF-IDF</strong> — weighting words by how telling they are, down-weighting words common to every message.</p>
<h3>A text classifier</h3>
<pre><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

model = make_pipeline(
    TfidfVectorizer(ngram_range=(1, 2), min_df=2),
    LogisticRegression(max_iter=1000),
)
model.fit(emails_train, labels_train)   # 0 ham, 1 phishing/spam
print(model.predict(["verify your account now at http://bit.ly/x"]))
</code></pre>
<h3>Beyond words</h3>
<ul>
<li><strong>URL features</strong> — look-alike domains, raw IPs, URL shorteners, many redirects.</li>
<li><strong>Header features</strong> — mismatched From/Reply-To, failed SPF/DKIM.</li>
<li><strong>Urgency cues</strong> — pressure language (act now, verify, suspended).</li>
</ul>
<div class="callout"><span class="badge">Signal beats vocabulary</span> Attackers reword endlessly, so lexical features drift. Combining text with URL and header signals makes a phishing detector far harder to evade.</div>`,
    `<span class="eyebrow">AIS201 · Chương 5 · Bài 5.1</span>
<h2>Phát hiện lừa đảo &amp; thư rác</h2>
<h3>NLP cho security</h3>
<p>Lừa đảo và thư rác là bài toán <em>văn bản</em>. <strong>Xử lý ngôn ngữ tự nhiên (NLP)</strong> biến một email hay tin nhắn thành đặc trưng để mô hình chấm điểm. Biểu diễn kinh điển là <strong>TF-IDF</strong> — cân từ theo mức chỉ báo của nó, hạ trọng số những từ chung cho mọi tin.</p>
<h3>Bộ phân loại văn bản</h3>
<pre><code>from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

model = make_pipeline(
    TfidfVectorizer(ngram_range=(1, 2), min_df=2),
    LogisticRegression(max_iter=1000),
)
model.fit(emails_train, labels_train)   # 0 ham, 1 phishing/spam
print(model.predict(["verify your account now at http://bit.ly/x"]))
</code></pre>
<h3>Vượt ra ngoài từ ngữ</h3>
<ul>
<li><strong>Đặc trưng URL</strong> — tên miền nhái, IP thô, rút gọn URL, nhiều chuyển hướng.</li>
<li><strong>Đặc trưng header</strong> — From/Reply-To lệch nhau, SPF/DKIM thất bại.</li>
<li><strong>Dấu hiệu hối thúc</strong> — ngôn ngữ gây áp lực (làm ngay, xác minh, bị khoá).</li>
</ul>
<div class="callout"><span class="badge">Tín hiệu thắng từ vựng</span> Kẻ tấn công đổi câu chữ vô tận nên đặc trưng từ vựng trôi dạt. Ghép văn bản với tín hiệu URL và header làm bộ phát hiện lừa đảo khó né hơn nhiều.</div>`,
  ]]);

const c5q = quiz('ais201-quiz-5', 'Quiz 5 — Phishing & spam|||Quiz 5 — Lừa đảo & thư rác', [
  { id: 'q1', question: 'TF-IDF is used to?|||TF-IDF được dùng để?', options: ['Encrypt emails|||Mã hoá email', 'Weight words by how telling they are|||Cân từ theo mức chỉ báo của nó', 'Block all URLs|||Chặn mọi URL', 'Measure CPU load|||Đo tải CPU'], correctIndex: 1, explanation: 'TF-IDF nâng từ có tính phân biệt, hạ từ chung cho mọi tin — nền biểu diễn văn bản.' },
  { id: 'q2', question: 'A suspicious URL signal for phishing?|||Dấu hiệu URL khả nghi của lừa đảo?', options: ['A well-known bank domain over HTTPS|||Tên miền ngân hàng nổi tiếng qua HTTPS', 'Look-alike domain or raw IP with a shortener|||Tên miền nhái hoặc IP thô kèm rút gọn', 'A .edu domain|||Tên miền .edu', 'No link at all|||Không có liên kết'], correctIndex: 1, explanation: 'Tên miền nhái, IP thô, URL rút gọn/nhiều chuyển hướng là dấu hiệu phishing.' },
  { id: 'q3', question: 'Why add URL/header features to a text model?|||Vì sao thêm đặc trưng URL/header vào mô hình văn bản?', options: ['To slow it down|||Để làm chậm', 'Attackers reword text, so lexical features drift|||Kẻ tấn công đổi câu chữ nên đặc trưng từ vựng trôi dạt', 'Text is never useful|||Văn bản vô dụng', 'To remove NLP entirely|||Để bỏ hẳn NLP'], correctIndex: 1, explanation: 'Từ ngữ dễ đổi; URL/header/SPF-DKIM là tín hiệu bền hơn, khó né hơn.' },
]);

const c6 = doc('ais201-6-1-attack-detection', '6.1 — AI for attack detection|||6.1 — AI cho phát hiện tấn công',
  'Phát hiện xâm nhập mạng trên đặc trưng luồng; nhận diện DDoS (bùng dòng bất thường) và botnet (C2 định kỳ) bằng bộ phân loại.',
  [[
    `<span class="eyebrow">AIS201 · Chapter 6 · Lesson 6.1</span>
<h2>AI for attack detection</h2>
<h3>Network intrusion detection</h3>
<p>Beyond single anomalies, ML classifies whole <strong>network flows</strong> as benign or one of several attack classes. Datasets like <strong>NSL-KDD</strong> and <strong>CIC-IDS2017</strong> provide labelled flows to train and evaluate such models.</p>
<h3>DDoS &amp; botnets</h3>
<ul>
<li><strong>DDoS</strong> — a flood of traffic from many sources. Tell-tale features: a sudden spike in packets/sec, many tiny flows, one target, low variety of packet sizes.</li>
<li><strong>Botnet</strong> — infected hosts phone home to <strong>Command &amp; Control (C2)</strong> on a regular <em>beacon</em>. The signal is periodicity — very regular inter-arrival times to the same endpoint.</li>
</ul>
<pre><code>from sklearn.ensemble import GradientBoostingClassifier

# X = flow features (packets/sec, mean size, duration, dst entropy...)
# y = benign / dos / botnet / probe ...
clf = GradientBoostingClassifier()
clf.fit(X_train, y_train)

proba = clf.predict_proba(X_new).max(axis=1)   # confidence per flow
print("high-confidence attacks:", (proba > 0.9).sum())
</code></pre>
<div class="callout"><span class="badge">Behaviour, not payload</span> Much attack traffic is encrypted, so you cannot read the payload. Flow-level behaviour — timing, volume, fan-out — still betrays DDoS and botnet C2.</div>`,
    `<span class="eyebrow">AIS201 · Chương 6 · Bài 6.1</span>
<h2>AI cho phát hiện tấn công</h2>
<h3>Phát hiện xâm nhập mạng</h3>
<p>Vượt trên bất thường đơn lẻ, ML phân loại cả <strong>luồng mạng</strong> thành lành tính hay một trong nhiều lớp tấn công. Các bộ dữ liệu như <strong>NSL-KDD</strong> và <strong>CIC-IDS2017</strong> cung cấp luồng có nhãn để huấn luyện và đánh giá.</p>
<h3>DDoS &amp; botnet</h3>
<ul>
<li><strong>DDoS</strong> — lũ lưu lượng từ nhiều nguồn. Dấu hiệu: gói/giây tăng vọt đột ngột, nhiều luồng tí hon, một mục tiêu, kích thước gói ít đa dạng.</li>
<li><strong>Botnet</strong> — máy nhiễm gọi về <strong>Command &amp; Control (C2)</strong> theo <em>nhịp beacon</em> đều đặn. Tín hiệu là tính chu kỳ — thời gian giữa các lần đến rất đều tới cùng một điểm.</li>
</ul>
<pre><code>from sklearn.ensemble import GradientBoostingClassifier

# X = dac trung luong (goi/giay, kich thuoc TB, thoi luong, entropy dich...)
# y = benign / dos / botnet / probe ...
clf = GradientBoostingClassifier()
clf.fit(X_train, y_train)

proba = clf.predict_proba(X_new).max(axis=1)   # do tin cay moi luong
print("tan cong tin cay cao:", (proba > 0.9).sum())
</code></pre>
<div class="callout"><span class="badge">Hành vi, không phải nội dung</span> Nhiều lưu lượng tấn công đã mã hoá nên không đọc được nội dung. Hành vi ở mức luồng — thời gian, khối lượng, số nhánh — vẫn tố cáo DDoS và C2 botnet.</div>`,
  ]]);

const c6q = quiz('ais201-quiz-6', 'Quiz 6 — Attack detection|||Quiz 6 — Phát hiện tấn công', [
  { id: 'q1', question: 'A tell-tale feature of a DDoS attack?|||Dấu hiệu đặc trưng của tấn công DDoS?', options: ['A single slow connection|||Một kết nối chậm đơn lẻ', 'Sudden spike in packets/sec to one target|||Gói/giây tăng vọt tới một mục tiêu', 'Encrypted email|||Email mã hoá', 'A signed PDF|||Một PDF có chữ ký'], correctIndex: 1, explanation: 'DDoS là lũ lưu lượng: gói/giây tăng vọt, nhiều nguồn, một đích.' },
  { id: 'q2', question: 'The key signal of botnet C2 beaconing is?|||Tín hiệu then chốt của beacon C2 botnet là?', options: ['Random large downloads|||Tải lớn ngẫu nhiên', 'Regular periodic connections to one endpoint|||Kết nối định kỳ đều tới một điểm', 'No connections at all|||Không kết nối gì', 'High CPU only|||Chỉ CPU cao'], correctIndex: 1, explanation: 'Máy nhiễm gọi về C2 theo nhịp đều — tính chu kỳ là dấu hiệu chính.' },
  { id: 'q3', question: 'Why does flow-level detection still work on encrypted traffic?|||Vì sao phát hiện mức luồng vẫn chạy trên lưu lượng mã hoá?', options: ['It decrypts the payload|||Nó giải mã nội dung', 'Timing, volume and fan-out still betray behaviour|||Thời gian, khối lượng, số nhánh vẫn tố cáo hành vi', 'Encryption is rare|||Mã hoá hiếm gặp', 'It reads passwords|||Nó đọc mật khẩu'], correctIndex: 1, explanation: 'Không cần đọc payload: đặc trưng luồng (timing/volume/fan-out) đủ tố cáo hành vi.' },
]);

const c7 = doc('ais201-7-1-adversarial-ml', '7.1 — Adversarial ML & robust AI|||7.1 — Tấn công đối kháng & AI an toàn',
  'Kẻ tấn công đánh vào chính mô hình: đầu độc dữ liệu (poisoning), né tránh (evasion), trích xuất; hướng tăng độ bền (robustness).',
  [[
    `<span class="eyebrow">AIS201 · Chapter 7 · Lesson 7.1</span>
<h2>Adversarial ML &amp; robust AI</h2>
<h3>The model is also a target</h3>
<p>A security model is a high-value target. <strong>Adversarial machine learning</strong> studies how attackers manipulate it:</p>
<ul>
<li><strong>Poisoning</strong> — corrupt the <em>training</em> data so the model learns a blind spot or a backdoor.</li>
<li><strong>Evasion</strong> — perturb a malicious input at <em>test</em> time just enough to be misclassified as benign (e.g. padding a malware file, rewording a phishing email).</li>
<li><strong>Model extraction / inversion</strong> — query the model to steal it or leak its training data.</li>
</ul>
<h3>An evasion sketch</h3>
<pre><code>import numpy as np

# Nudge a malicious sample toward the benign side of the boundary
x = X_malicious[0].copy()
for _ in range(50):
    if clf.predict([x])[0] == 0:   # now scored benign -> evaded
        break
    x = x - 0.05 * clf.coef_[0]    # step against the decision weights

print("evaded:", clf.predict([x])[0] == 0)
</code></pre>
<h3>Toward robustness</h3>
<p>Defences include <strong>adversarial training</strong> (train on perturbed examples), input sanitisation, ensemble diversity, rate-limiting queries, and validating training data provenance. No defence is perfect — assume the adversary adapts.</p>
<div class="callout"><span class="badge">Assume an adaptive attacker</span> Accuracy on clean data is not security. A model that scores 99% but flips under a tiny perturbation is not robust — evaluate under attack, not just on the test set.</div>`,
    `<span class="eyebrow">AIS201 · Chương 7 · Bài 7.1</span>
<h2>Tấn công đối kháng &amp; AI an toàn</h2>
<h3>Mô hình cũng là mục tiêu</h3>
<p>Một mô hình an ninh là mục tiêu giá trị cao. <strong>Học máy đối kháng</strong> nghiên cứu cách kẻ tấn công thao túng nó:</p>
<ul>
<li><strong>Đầu độc (poisoning)</strong> — làm bẩn dữ liệu <em>huấn luyện</em> để mô hình học một điểm mù hoặc cửa hậu.</li>
<li><strong>Né tránh (evasion)</strong> — chỉnh đầu vào độc hại lúc <em>kiểm thử</em> vừa đủ để bị phân loại nhầm thành lành tính (vd chèn thêm vào tệp mã độc, đổi câu chữ email lừa đảo).</li>
<li><strong>Trích xuất / đảo ngược mô hình</strong> — truy vấn mô hình để đánh cắp nó hoặc rò rỉ dữ liệu huấn luyện.</li>
</ul>
<h3>Phác thảo một cuộc né tránh</h3>
<pre><code>import numpy as np

# Day mau doc dan ve phia lanh tinh cua ranh gioi
x = X_malicious[0].copy()
for _ in range(50):
    if clf.predict([x])[0] == 0:   # gio bi cham lanh tinh -> ne thanh cong
        break
    x = x - 0.05 * clf.coef_[0]    # buoc nguoc lai trong so quyet dinh

print("ne thanh cong:", clf.predict([x])[0] == 0)
</code></pre>
<h3>Hướng tới độ bền</h3>
<p>Phòng thủ gồm <strong>huấn luyện đối kháng</strong> (học trên ví dụ bị nhiễu), làm sạch đầu vào, đa dạng ensemble, giới hạn tần suất truy vấn, và kiểm nguồn gốc dữ liệu huấn luyện. Không phòng thủ nào hoàn hảo — hãy giả định kẻ địch thích nghi.</p>
<div class="callout"><span class="badge">Giả định kẻ tấn công thích nghi</span> Chính xác trên dữ liệu sạch không phải là an toàn. Mô hình đạt 99% nhưng lật ngược trước một nhiễu nhỏ thì không bền — hãy đánh giá dưới tấn công, không chỉ trên tập kiểm thử.</div>`,
  ]]);

const c7q = quiz('ais201-quiz-7', 'Quiz 7 — Adversarial ML|||Quiz 7 — Đối kháng', [
  { id: 'q1', question: 'Data poisoning attacks target?|||Tấn công đầu độc dữ liệu nhắm vào?', options: ['The test set only|||Chỉ tập kiểm thử', 'The training data|||Dữ liệu huấn luyện', 'The GPU driver|||Trình điều khiển GPU', 'The firewall|||Tường lửa'], correctIndex: 1, explanation: 'Poisoning làm bẩn dữ liệu huấn luyện để cấy điểm mù hoặc cửa hậu.' },
  { id: 'q2', question: 'An evasion attack happens at?|||Tấn công né tránh xảy ra lúc?', options: ['Training time|||Lúc huấn luyện', 'Test/inference time on a crafted input|||Lúc suy luận, trên đầu vào được chế', 'Compile time|||Lúc biên dịch', 'Never|||Không bao giờ'], correctIndex: 1, explanation: 'Evasion chỉnh đầu vào lúc kiểm thử để vượt qua mô hình đã huấn luyện.' },
  { id: 'q3', question: 'A defence against adversarial examples?|||Một cách phòng thủ trước ví dụ đối kháng?', options: ['Ignore the attacker|||Bỏ qua kẻ tấn công', 'Adversarial training on perturbed examples|||Huấn luyện đối kháng trên ví dụ bị nhiễu', 'Raise the learning rate|||Tăng tốc độ học', 'Delete the test set|||Xoá tập kiểm thử'], correctIndex: 1, explanation: 'Huấn luyện đối kháng (kèm làm sạch đầu vào, giới hạn truy vấn...) tăng độ bền.' },
]);

const c8 = doc('ais201-8-1-operations-ethics', '8.1 — Operations & ethics|||8.1 — Vận hành & đạo đức',
  'AI trong SOC/SIEM; chi phí dương tính giả (precision/recall, FPR); giải thích được (explainability); đạo đức, thiên lệch & quyền riêng tư.',
  [[
    `<span class="eyebrow">AIS201 · Chapter 8 · Lesson 8.1</span>
<h2>Operations &amp; ethics</h2>
<h3>AI in the SOC / SIEM</h3>
<p>A <strong>Security Operations Centre (SOC)</strong> runs on a <strong>SIEM</strong> that aggregates logs and raises alerts. ML helps by scoring and <em>prioritising</em> alerts — but analysts are the scarce resource, so a model that floods them with noise is worse than none.</p>
<h3>The cost of false positives</h3>
<p>Because attacks are rare, <strong>accuracy is misleading</strong>. Judge a detector by <strong>precision</strong> (of the alerts raised, how many are real) and <strong>recall</strong> (of the real attacks, how many we caught), and watch the <strong>false positive rate</strong>.</p>
<pre><code>from sklearn.metrics import precision_recall_fscore_support

p, r, f1, _ = precision_recall_fscore_support(
    y_true, y_pred, average="binary")
print("precision", round(p, 3), "recall", round(r, 3), "f1", round(f1, 3))
</code></pre>
<h3>Explainability, ethics &amp; privacy</h3>
<ul>
<li><strong>Explainability</strong> — an analyst must know <em>why</em> an alert fired (feature importances, SHAP) to trust and triage it.</li>
<li><strong>Bias</strong> — training data skew can unfairly flag certain users or regions.</li>
<li><strong>Privacy</strong> — security telemetry is sensitive; minimise, anonymise, and respect law and consent.</li>
</ul>
<div class="callout"><span class="badge">Human in the loop</span> AI triages; humans decide. The goal is a detector precise and explainable enough that a SOC trusts its alerts and acts fast — responsibly.</div>`,
    `<span class="eyebrow">AIS201 · Chương 8 · Bài 8.1</span>
<h2>Vận hành &amp; đạo đức</h2>
<h3>AI trong SOC / SIEM</h3>
<p>Một <strong>Trung tâm Vận hành An ninh (SOC)</strong> chạy trên <strong>SIEM</strong> — nơi gộp log và phát cảnh báo. ML giúp chấm điểm và <em>xếp ưu tiên</em> cảnh báo — nhưng chuyên viên mới là tài nguyên khan hiếm, nên mô hình dội nhiễu vào họ còn tệ hơn không có.</p>
<h3>Cái giá của dương tính giả</h3>
<p>Vì tấn công hiếm, <strong>độ chính xác (accuracy) gây hiểu lầm</strong>. Hãy đánh giá bằng <strong>precision</strong> (trong các cảnh báo phát ra, bao nhiêu là thật) và <strong>recall</strong> (trong các tấn công thật, bắt được bao nhiêu), và theo dõi <strong>tỉ lệ dương tính giả</strong>.</p>
<pre><code>from sklearn.metrics import precision_recall_fscore_support

p, r, f1, _ = precision_recall_fscore_support(
    y_true, y_pred, average="binary")
print("precision", round(p, 3), "recall", round(r, 3), "f1", round(f1, 3))
</code></pre>
<h3>Giải thích được, đạo đức &amp; quyền riêng tư</h3>
<ul>
<li><strong>Giải thích được</strong> — chuyên viên phải biết <em>vì sao</em> cảnh báo bật (feature importances, SHAP) mới tin và phân loại được.</li>
<li><strong>Thiên lệch</strong> — dữ liệu huấn luyện lệch có thể gán oan cho nhóm người dùng hoặc vùng nào đó.</li>
<li><strong>Quyền riêng tư</strong> — dữ liệu đo an ninh nhạy cảm; hãy tối thiểu hoá, ẩn danh, và tôn trọng luật cùng sự đồng thuận.</li>
</ul>
<div class="callout"><span class="badge">Con người trong vòng lặp</span> AI phân loại; con người quyết định. Mục tiêu là bộ phát hiện đủ chính xác và giải thích được để SOC tin cảnh báo và hành động nhanh — một cách có trách nhiệm.</div>`,
  ]]);

const c8q = quiz('ais201-quiz-8', 'Quiz 8 — Operations & ethics|||Quiz 8 — Vận hành & đạo đức', [
  { id: 'q1', question: 'Why is accuracy misleading in intrusion detection?|||Vì sao accuracy gây hiểu lầm trong phát hiện xâm nhập?', options: ['Attacks are very common|||Tấn công rất phổ biến', 'Attacks are rare, so a trivial model looks accurate|||Tấn công hiếm nên mô hình tầm thường vẫn có vẻ chính xác', 'It ignores benign traffic|||Nó bỏ qua lưu lượng lành', 'It measures speed|||Nó đo tốc độ'], correctIndex: 1, explanation: 'Với lớp mất cân bằng, đoán tất cả là lành vẫn cho accuracy cao — hãy dùng precision/recall.' },
  { id: 'q2', question: 'Precision of a detector measures?|||Precision của bộ phát hiện đo?', options: ['Of the alerts raised, how many are real|||Trong các cảnh báo phát ra, bao nhiêu là thật', 'Total number of logs|||Tổng số log', 'The CPU usage|||Mức dùng CPU', 'How fast it trains|||Huấn luyện nhanh cỡ nào'], correctIndex: 0, explanation: 'Precision = tỉ lệ cảnh báo đúng trên tổng cảnh báo; recall = tỉ lệ tấn công thật bị bắt.' },
  { id: 'q3', question: 'Why does explainability matter in a SOC?|||Vì sao giải thích được lại quan trọng trong SOC?', options: ['It speeds up the GPU|||Nó tăng tốc GPU', 'Analysts must know why an alert fired to trust and triage it|||Chuyên viên phải biết vì sao cảnh báo bật mới tin và phân loại', 'It removes all false positives|||Nó xoá mọi dương tính giả', 'It is only for marketing|||Chỉ để tiếp thị'], correctIndex: 1, explanation: 'Không giải thích được thì chuyên viên không tin cảnh báo; feature importances/SHAP giúp triage.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'AIS201',
    slug: 'ais201-artificial-intelligence-for-cybersecurity',
    title: 'Artificial Intelligence for Cybersecurity',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/AIS201.webp',
    shortDescription: 'AI & ML for defense — threat landscape, logs & traffic as features, anomaly detection & IDS, malware & phishing/spam (NLP), DDoS/botnet detection, adversarial ML, SOC/SIEM & ethics. Python/scikit-learn, bilingual, quizzes.|||AI & ML cho phòng thủ — bối cảnh đe doạ, log & lưu lượng thành đặc trưng, phát hiện bất thường & IDS, mã độc & lừa đảo/thư rác (NLP), phát hiện DDoS/botnet, tấn công đối kháng, SOC/SIEM & đạo đức. Python/scikit-learn, song ngữ.',
    description: 'Môn <strong>AIS201 — Artificial Intelligence for Cybersecurity</strong> (ngành Khoa học Máy tính, kỳ 4) dạy cách dùng <strong>máy học bảo vệ hệ thống</strong>. Từ <strong>bối cảnh mối đe doạ &amp; MITRE ATT&amp;CK</strong> → <strong>dữ liệu an ninh &amp; đặc trưng</strong> (log, lưu lượng) → <strong>phát hiện bất thường (IDS)</strong> → <strong>phân loại mã độc</strong> → <strong>lừa đảo &amp; thư rác (NLP)</strong> → <strong>phát hiện tấn công (DDoS, botnet)</strong> → <strong>tấn công đối kháng</strong> → <strong>vận hành SOC/SIEM, giải thích được &amp; đạo đức</strong>. Song ngữ, có khối code Python/scikit-learn và quiz mỗi chương.',
    whatYouLearn: 'Vì sao dùng AI cho security & threat landscape (MITRE ATT&CK); biến log/traffic thành đặc trưng, chuẩn hoá & one-hot; phát hiện bất thường (Isolation Forest) & IDS; phân loại mã độc (tĩnh/động, Random Forest); phishing/spam bằng NLP (TF-IDF + Logistic Regression); phát hiện DDoS/botnet trên đặc trưng luồng; tấn công đối kháng (poisoning, evasion) & tăng độ bền; SOC/SIEM, precision/recall & dương tính giả, giải thích được, đạo đức & quyền riêng tư.',
    requirements: 'Python cơ bản và làm quen máy học (biết thế nào là huấn luyện/kiểm thử) sẽ giúp ích. Nên cài Python + scikit-learn/pandas, hoặc dùng Google Colab. Kiến thức mạng máy tính cơ bản là một lợi thế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, MITRE ATT&CK, scikit-learn, bộ dữ liệu, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'AI/ML cho an ninh, vòng đời hệ phát hiện.', lessons: [intro] },
    { title: 'Chương 1 — AI trong an ninh mạng|||Chapter 1 — AI in cybersecurity', description: 'Vì sao AI, cơ hội & thách thức, threat landscape.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Dữ liệu & đặc trưng|||Chapter 2 — Data & features', description: 'Log, traffic, feature engineering, chuẩn hoá.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phát hiện bất thường & IDS|||Chapter 3 — Anomaly detection & IDS', description: 'Không giám sát, Isolation Forest, IDS.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phân loại mã độc|||Chapter 4 — Malware classification', description: 'Tĩnh/động, đặc trưng, Random Forest.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Lừa đảo & thư rác|||Chapter 5 — Phishing & spam', description: 'NLP, TF-IDF, tín hiệu URL/header.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Phát hiện tấn công|||Chapter 6 — Attack detection', description: 'Xâm nhập mạng, DDoS, botnet C2.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tấn công đối kháng|||Chapter 7 — Adversarial ML', description: 'Poisoning, evasion, robustness.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Vận hành & đạo đức|||Chapter 8 — Operations & ethics', description: 'SOC/SIEM, precision/recall, giải thích, đạo đức.', lessons: [c8, c8q] },
  ],
};
