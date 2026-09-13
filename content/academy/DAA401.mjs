/**
 * DAA401 — Design and Secure AI System (Thiết kế và Bảo mật hệ thống AI).
 * Ngành Khoa học Máy tính FPTU, Kỳ 8. Khung 8 chương, song ngữ VI+EN.
 * Nguồn chuẩn: NIST AI RMF; MITRE ATLAS; OWASP Top 10 for LLM/ML;
 * Google SAIF; "Adversarial Machine Learning" (Joseph et al).
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('daa401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), khung chuẩn (NIST AI RMF, MITRE ATLAS, OWASP, SAIF), sách, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">DAA401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn how to <strong>design and secure AI systems</strong> — threat modeling, adversarial and data attacks, LLM/GenAI security, defenses, privacy and governance — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, authoritative references.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DAA401 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>🌐 Authoritative frameworks (free)</h3>
<ul>
<li><a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">NIST AI Risk Management Framework (AI RMF 1.0)</a></li>
<li><a href="https://atlas.mitre.org/" target="_blank" rel="noopener">MITRE ATLAS — adversarial threat landscape for AI systems</a></li>
<li><a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/" target="_blank" rel="noopener">OWASP Top 10 for LLM Applications</a></li>
<li><a href="https://owasp.org/www-project-machine-learning-security-top-10/" target="_blank" rel="noopener">OWASP Machine Learning Security Top 10</a></li>
<li><a href="https://saif.google/" target="_blank" rel="noopener">Google Secure AI Framework (SAIF)</a></li>
</ul>
<h3>📗 Reference book</h3>
<ul>
<li><em>Adversarial Machine Learning</em> — Joseph, Nelson, Rubinstein &amp; Tygar (Cambridge University Press).</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://adversarial-robustness-toolbox.readthedocs.io/" target="_blank" rel="noopener">Adversarial Robustness Toolbox (ART)</a> — attacks &amp; defenses library</li>
<li><a href="https://github.com/cleverhans-lab/cleverhans" target="_blank" rel="noopener">CleverHans</a> — adversarial example benchmarks</li>
<li><a href="https://github.com/tensorflow/privacy" target="_blank" rel="noopener">TensorFlow Privacy</a> — differential-privacy training</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the AI system lifecycle, secure-by-design, and the AI threat landscape.</li>
<li><strong>Model the threat</strong> — map assets and attack surface with MITRE ATLAS before building.</li>
<li><strong>Attack &amp; defend</strong> — reproduce adversarial, poisoning and LLM attacks, then apply defenses.</li>
<li><strong>Govern</strong> — privacy-preserving ML plus NIST AI RMF governance, fairness and explainability.</li>
</ol></div>`,
    `<span class="eyebrow">DAA401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học cách <strong>thiết kế và bảo mật hệ thống AI</strong> — mô hình đe doạ, tấn công đối kháng và dữ liệu, bảo mật LLM/GenAI, phòng thủ, quyền riêng tư và quản trị — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn uy tín, miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DAA401 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🌐 Khung chuẩn uy tín (miễn phí)</h3>
<ul>
<li><a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">NIST AI Risk Management Framework (AI RMF 1.0)</a></li>
<li><a href="https://atlas.mitre.org/" target="_blank" rel="noopener">MITRE ATLAS — bản đồ đe doạ đối kháng cho hệ thống AI</a></li>
<li><a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/" target="_blank" rel="noopener">OWASP Top 10 cho ứng dụng LLM</a></li>
<li><a href="https://owasp.org/www-project-machine-learning-security-top-10/" target="_blank" rel="noopener">OWASP Machine Learning Security Top 10</a></li>
<li><a href="https://saif.google/" target="_blank" rel="noopener">Google Secure AI Framework (SAIF)</a></li>
</ul>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Adversarial Machine Learning</em> — Joseph, Nelson, Rubinstein &amp; Tygar (Cambridge University Press).</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://adversarial-robustness-toolbox.readthedocs.io/" target="_blank" rel="noopener">Adversarial Robustness Toolbox (ART)</a> — thư viện tấn công &amp; phòng thủ</li>
<li><a href="https://github.com/cleverhans-lab/cleverhans" target="_blank" rel="noopener">CleverHans</a> — benchmark ví dụ đối kháng</li>
<li><a href="https://github.com/tensorflow/privacy" target="_blank" rel="noopener">TensorFlow Privacy</a> — huấn luyện có riêng tư vi phân</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — vòng đời hệ thống AI, secure-by-design, và bức tranh đe doạ AI.</li>
<li><strong>Mô hình hoá đe doạ</strong> — vẽ tài sản &amp; bề mặt tấn công bằng MITRE ATLAS trước khi dựng.</li>
<li><strong>Tấn công &amp; phòng thủ</strong> — dựng lại tấn công đối kháng, đầu độc và LLM, rồi áp phòng thủ.</li>
<li><strong>Quản trị</strong> — ML bảo toàn riêng tư cộng quản trị NIST AI RMF, công bằng và giải thích được.</li>
</ol></div>`,
  ]]);

const intro = doc('daa401-0-1-overview', 'Course overview: Design & secure AI systems|||Tổng quan: Thiết kế & bảo mật hệ thống AI',
  'AI làm mở rộng bề mặt tấn công thế nào; vì sao bảo mật AI khác bảo mật phần mềm; lộ trình 8 chương: thiết kế an toàn → mô hình đe doạ → tấn công → phòng thủ → riêng tư → quản trị.',
  [[
    `<span class="eyebrow">DAA401 · Lesson 0.1 · Overview</span>
<h2>Design &amp; secure AI systems</h2>
<p class="lead">This course teaches you to build AI systems that are <strong>secure by design</strong> and to defend them against attacks unique to machine learning. A model is not just code — it is <strong>learned behavior shaped by data</strong>, so it can be attacked through its training data, its inputs, its parameters, and its outputs.</p>
<h3>Why AI security is different</h3>
<ul>
<li><strong>New attack surface</strong> — the training data, the model weights, the inference API and the prompt are all things an attacker can poison, steal or manipulate.</li>
<li><strong>Probabilistic behavior</strong> — the model can be wrong on purpose (an adversarial input) without any bug in the code.</li>
<li><strong>Data is the crown jewel</strong> — models can leak the private data they were trained on.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Secure AI design &amp; lifecycle → AI threat modeling (MITRE ATLAS) → adversarial attacks → data &amp; model attacks (poisoning, stealing, inversion) → LLM/GenAI security (OWASP LLM Top 10) → defenses &amp; robustness → privacy-preserving ML → governance &amp; responsible AI (NIST AI RMF).</p>
<div class="callout"><span class="badge">Frameworks you will use</span> NIST AI RMF for governance, MITRE ATLAS for threat modeling, OWASP Top 10 for LLM/ML risks, and Google SAIF for secure-by-design practice.</div>`,
    `<span class="eyebrow">DAA401 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế &amp; bảo mật hệ thống AI</h2>
<p class="lead">Môn này dạy bạn dựng hệ thống AI <strong>an toàn ngay từ thiết kế</strong> và phòng thủ trước các tấn công riêng của học máy. Một mô hình không chỉ là mã — nó là <strong>hành vi học được từ dữ liệu</strong>, nên có thể bị tấn công qua dữ liệu huấn luyện, đầu vào, tham số và đầu ra của nó.</p>
<h3>Vì sao bảo mật AI khác biệt</h3>
<ul>
<li><strong>Bề mặt tấn công mới</strong> — dữ liệu huấn luyện, trọng số mô hình, API suy luận và prompt đều là thứ kẻ tấn công có thể đầu độc, trộm hoặc thao túng.</li>
<li><strong>Hành vi xác suất</strong> — mô hình có thể sai một cách cố ý (đầu vào đối kháng) mà mã không hề có lỗi.</li>
<li><strong>Dữ liệu là báu vật</strong> — mô hình có thể rò rỉ dữ liệu riêng tư mà nó được huấn luyện trên đó.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Thiết kế AI an toàn &amp; vòng đời → mô hình đe doạ AI (MITRE ATLAS) → tấn công đối kháng → tấn công dữ liệu &amp; mô hình (đầu độc, trộm, đảo ngược) → bảo mật LLM/GenAI (OWASP LLM Top 10) → phòng thủ &amp; robustness → ML bảo toàn riêng tư → quản trị &amp; AI có trách nhiệm (NIST AI RMF).</p>
<div class="callout"><span class="badge">Khung sẽ dùng</span> NIST AI RMF để quản trị, MITRE ATLAS để mô hình đe doạ, OWASP Top 10 cho rủi ro LLM/ML, và Google SAIF cho thực hành secure-by-design.</div>`,
  ]]);

const c1 = doc('daa401-1-1-secure-design', '1.1 — Designing secure AI systems|||1.1 — Thiết kế hệ thống AI an toàn',
  'Vòng đời hệ thống AI (dữ liệu → huấn luyện → triển khai → suy luận → giám sát); nguyên tắc secure-by-design; bức tranh đe doạ AI; khung Google SAIF.',
  [[
    `<span class="eyebrow">DAA401 · Chapter 1 · Lesson 1.1</span>
<h2>Designing secure AI systems</h2>
<h3>The AI system lifecycle</h3>
<p>Security must cover every stage, because a weakness at any stage compromises the whole:</p>
<pre><code>Data collection -> Data prep -> Training -> Evaluation
   -> Deployment -> Inference (serving) -> Monitoring / retraining
</code></pre>
<h3>Secure-by-design principles</h3>
<ul>
<li><strong>Least privilege</strong> — the serving API, the training pipeline and the data store each get only the access they need.</li>
<li><strong>Defense in depth</strong> — do not rely on one control; layer input validation, rate limits, monitoring and model hardening.</li>
<li><strong>Provenance &amp; integrity</strong> — track where data and pretrained weights came from; sign and verify artifacts.</li>
<li><strong>Fail safe</strong> — on low-confidence or anomalous input, refuse or escalate rather than answering blindly.</li>
</ul>
<h3>The AI threat landscape</h3>
<p>Google <strong>SAIF</strong> groups AI risks into data risks, model risks, and application risks, and maps controls to each. The lesson: treat the model, its data and its serving stack as one system to protect, not just the app around it.</p>
<div class="callout"><span class="badge">Key idea</span> You cannot bolt security onto a trained model afterwards. Threats must be considered at design time, across the whole lifecycle.</div>`,
    `<span class="eyebrow">DAA401 · Chương 1 · Bài 1.1</span>
<h2>Thiết kế hệ thống AI an toàn</h2>
<h3>Vòng đời hệ thống AI</h3>
<p>Bảo mật phải phủ mọi giai đoạn, vì một điểm yếu ở bất kỳ giai đoạn nào cũng phá cả hệ thống:</p>
<pre><code>Thu thập dữ liệu -> Chuẩn bị dữ liệu -> Huấn luyện -> Đánh giá
   -> Triển khai -> Suy luận (phục vụ) -> Giám sát / huấn luyện lại
</code></pre>
<h3>Nguyên tắc secure-by-design</h3>
<ul>
<li><strong>Đặc quyền tối thiểu</strong> — API phục vụ, pipeline huấn luyện và kho dữ liệu mỗi thứ chỉ được cấp quyền vừa đủ.</li>
<li><strong>Phòng thủ nhiều lớp</strong> — không dựa vào một chốt; xếp lớp kiểm đầu vào, giới hạn tần suất, giám sát và làm cứng mô hình.</li>
<li><strong>Nguồn gốc &amp; toàn vẹn</strong> — theo dõi dữ liệu và trọng số tiền huấn luyện từ đâu tới; ký và xác minh artifact.</li>
<li><strong>Hỏng an toàn</strong> — với đầu vào độ tin thấp hoặc bất thường, hãy từ chối hoặc chuyển tiếp thay vì trả lời mù.</li>
</ul>
<h3>Bức tranh đe doạ AI</h3>
<p>Google <strong>SAIF</strong> nhóm rủi ro AI thành rủi ro dữ liệu, rủi ro mô hình và rủi ro ứng dụng, và ánh xạ chốt kiểm cho từng nhóm. Bài học: coi mô hình, dữ liệu và tầng phục vụ của nó là MỘT hệ thống cần bảo vệ, không chỉ ứng dụng bao quanh.</p>
<div class="callout"><span class="badge">Ý chính</span> Không thể gắn bảo mật vào một mô hình đã huấn luyện xong. Đe doạ phải được cân nhắc ngay lúc thiết kế, xuyên suốt vòng đời.</div>`,
  ]]);

const c1q = quiz('daa401-quiz-1', 'Quiz 1 — Secure AI design|||Quiz 1 — Thiết kế AI an toàn', [
  { id: 'q1', question: 'Vì sao bảo mật phải phủ toàn bộ vòng đời hệ thống AI?', options: ['Chỉ đầu vào mới nguy hiểm', 'Điểm yếu ở bất kỳ giai đoạn nào cũng phá cả hệ thống', 'Chỉ cần bảo vệ ứng dụng bao quanh', 'Mô hình đã huấn luyện thì không thể tấn công'], correctIndex: 1, explanation: 'Dữ liệu, huấn luyện, triển khai, suy luận đều là bề mặt tấn công — bảo mật phải phủ hết.' },
  { id: 'q2', question: 'Nguyên tắc "phòng thủ nhiều lớp" (defense in depth) nghĩa là?', options: ['Dựa vào một chốt kiểm duy nhất', 'Xếp nhiều lớp kiểm soát chồng lên nhau', 'Chỉ mã hoá dữ liệu', 'Tắt giám sát để tăng tốc'], correctIndex: 1, explanation: 'Không dựa vào một control; xếp lớp kiểm đầu vào, giới hạn tần suất, giám sát, làm cứng mô hình.' },
  { id: 'q3', question: 'Google SAIF nhóm rủi ro AI thành các nhóm nào?', options: ['Chỉ rủi ro mạng', 'Dữ liệu, mô hình, ứng dụng', 'Chỉ rủi ro phần cứng', 'Chỉ rủi ro con người'], correctIndex: 1, explanation: 'SAIF chia rủi ro dữ liệu, mô hình và ứng dụng, và ánh xạ chốt kiểm cho từng nhóm.' },
]);

const c2 = doc('daa401-2-1-threat-modeling', '2.1 — AI threat modeling|||2.1 — Mô hình đe doạ AI',
  'Mô hình hoá đe doạ cho AI; MITRE ATLAS (chiến thuật/kỹ thuật đối kháng); liệt kê tài sản (dữ liệu, trọng số, API) và bề mặt tấn công.',
  [[
    `<span class="eyebrow">DAA401 · Chapter 2 · Lesson 2.1</span>
<h2>AI threat modeling</h2>
<h3>What is threat modeling?</h3>
<p>Threat modeling asks four questions: <strong>What are we building? What can go wrong? What do we do about it? Did we do a good enough job?</strong> For AI you extend the "assets" to include the training data, the model weights, and the inference endpoint.</p>
<h3>MITRE ATLAS</h3>
<p><strong>ATLAS</strong> (Adversarial Threat Landscape for AI Systems) is an ATT&amp;CK-style knowledge base of real-world tactics and techniques used against ML systems — from <em>reconnaissance</em> and <em>ML model access</em> to <em>poisoning</em>, <em>evasion</em> and <em>model exfiltration</em>. Use it as a checklist of what adversaries actually do.</p>
<h3>Assets &amp; attack surface</h3>
<ul>
<li><strong>Data</strong> — training sets, labels, feature stores (target of poisoning &amp; theft).</li>
<li><strong>Model</strong> — architecture &amp; weights (target of stealing, inversion, backdoors).</li>
<li><strong>Serving</strong> — the inference API and prompts (target of evasion, prompt injection, abuse).</li>
</ul>
<pre><code>For each asset:
  actor  -> who attacks it (insider, API user, supply chain)
  entry  -> how they reach it (data feed, API, model hub)
  impact -> what breaks (integrity, confidentiality, availability)
</code></pre>
<div class="callout"><span class="badge">Practice</span> Draw a data-flow diagram, mark trust boundaries, then walk each ATLAS technique against every asset that crosses a boundary.</div>`,
    `<span class="eyebrow">DAA401 · Chương 2 · Bài 2.1</span>
<h2>Mô hình đe doạ AI</h2>
<h3>Mô hình hoá đe doạ là gì?</h3>
<p>Nó đặt bốn câu hỏi: <strong>Ta đang dựng gì? Cái gì có thể sai? Làm gì với nó? Làm đã đủ tốt chưa?</strong> Với AI, ta mở rộng "tài sản" để gồm cả dữ liệu huấn luyện, trọng số mô hình và endpoint suy luận.</p>
<h3>MITRE ATLAS</h3>
<p><strong>ATLAS</strong> (Adversarial Threat Landscape for AI Systems) là kho tri thức kiểu ATT&amp;CK về chiến thuật và kỹ thuật thực tế nhắm vào hệ thống ML — từ <em>trinh sát</em> và <em>tiếp cận mô hình</em> tới <em>đầu độc</em>, <em>né tránh</em> và <em>rút trộm mô hình</em>. Dùng nó như danh mục kiểm những gì kẻ địch thật sự làm.</p>
<h3>Tài sản &amp; bề mặt tấn công</h3>
<ul>
<li><strong>Dữ liệu</strong> — tập huấn luyện, nhãn, kho đặc trưng (mục tiêu của đầu độc &amp; trộm).</li>
<li><strong>Mô hình</strong> — kiến trúc &amp; trọng số (mục tiêu của trộm, đảo ngược, cửa hậu).</li>
<li><strong>Phục vụ</strong> — API suy luận và prompt (mục tiêu của né tránh, prompt injection, lạm dụng).</li>
</ul>
<pre><code>Với mỗi tài sản:
  tác nhân -> ai tấn công (nội bộ, người dùng API, chuỗi cung ứng)
  lối vào  -> tiếp cận bằng cách nào (luồng dữ liệu, API, model hub)
  hậu quả  -> hỏng cái gì (toàn vẹn, bảo mật, sẵn sàng)
</code></pre>
<div class="callout"><span class="badge">Thực hành</span> Vẽ sơ đồ luồng dữ liệu, đánh dấu ranh giới tin cậy, rồi rà từng kỹ thuật ATLAS trên mọi tài sản băng qua ranh giới.</div>`,
  ]]);

const c2q = quiz('daa401-quiz-2', 'Quiz 2 — Threat modeling|||Quiz 2 — Mô hình đe doạ', [
  { id: 'q1', question: 'MITRE ATLAS là gì?', options: ['Một mô hình ngôn ngữ lớn', 'Kho tri thức chiến thuật/kỹ thuật đối kháng nhắm vào hệ thống ML', 'Một thư viện huấn luyện', 'Một chuẩn mã hoá'], correctIndex: 1, explanation: 'ATLAS liệt kê chiến thuật và kỹ thuật thực tế nhắm vào ML, theo phong cách ATT&CK.' },
  { id: 'q2', question: 'Trong mô hình đe doạ AI, đâu KHÔNG phải là tài sản cần bảo vệ?', options: ['Dữ liệu huấn luyện', 'Trọng số mô hình', 'Endpoint suy luận', 'Màu giao diện đăng nhập'], correctIndex: 3, explanation: 'Tài sản AI gồm dữ liệu, mô hình và tầng phục vụ; màu giao diện không phải bề mặt tấn công AI.' },
  { id: 'q3', question: 'Bước đầu tiên hợp lý khi mô hình hoá đe doạ là?', options: ['Xoá dữ liệu cũ', 'Vẽ sơ đồ luồng dữ liệu và đánh dấu ranh giới tin cậy', 'Tăng learning rate', 'Public trọng số mô hình'], correctIndex: 1, explanation: 'Vẽ data-flow, đánh dấu trust boundary, rồi rà từng kỹ thuật ATLAS qua mỗi tài sản.' },
]);

const c3 = doc('daa401-3-1-adversarial', '3.1 — Adversarial attacks|||3.1 — Tấn công đối kháng',
  'Ví dụ đối kháng (adversarial examples); tấn công né tránh (evasion) lúc suy luận; nhiễu loạn (perturbation) nhỏ mắt người không thấy; hộp trắng vs hộp đen.',
  [[
    `<span class="eyebrow">DAA401 · Chapter 3 · Lesson 3.1</span>
<h2>Adversarial attacks</h2>
<h3>Adversarial examples</h3>
<p>An <strong>adversarial example</strong> is an input with a tiny, carefully crafted <strong>perturbation</strong> that a human cannot notice but that flips the model's prediction — e.g. adding pixel-level noise so a "panda" is confidently classified as a "gibbon". The classic FGSM attack nudges the input in the direction of the loss gradient:</p>
<pre><code>x_adv = x + epsilon * sign( gradient of loss w.r.t. x )
   epsilon small  -> imperceptible change, wrong prediction
</code></pre>
<h3>Evasion (attack at inference time)</h3>
<p>Evasion happens <em>after</em> the model is deployed: the attacker only manipulates the input to get a wrong answer, without touching training. It maps to the ATLAS "evasion" technique.</p>
<h3>Threat models</h3>
<ul>
<li><strong>White-box</strong> — attacker knows the model &amp; gradients (strongest attack, e.g. FGSM, PGD).</li>
<li><strong>Black-box</strong> — attacker only queries the API; uses transferability or query-based estimation.</li>
</ul>
<div class="callout"><span class="badge">Defense preview</span> Adversarial training (Chapter 6) trains on these crafted inputs so the model learns to resist them; input validation and detectors add layers.</div>`,
    `<span class="eyebrow">DAA401 · Chương 3 · Bài 3.1</span>
<h2>Tấn công đối kháng</h2>
<h3>Ví dụ đối kháng</h3>
<p>Một <strong>ví dụ đối kháng</strong> là đầu vào có một <strong>nhiễu loạn</strong> nhỏ, được chế cẩn thận, mắt người không nhận ra nhưng đủ lật dự đoán của mô hình — vd thêm nhiễu mức điểm ảnh để "gấu trúc" bị phân loại chắc chắn là "vượn". Tấn công FGSM kinh điển đẩy đầu vào theo hướng gradient của hàm mất mát:</p>
<pre><code>x_adv = x + epsilon * sign( gradient mất mát theo x )
   epsilon nhỏ  -> thay đổi không thấy được, dự đoán sai
</code></pre>
<h3>Né tránh (tấn công lúc suy luận)</h3>
<p>Né tránh xảy ra <em>sau</em> khi mô hình đã triển khai: kẻ tấn công chỉ chỉnh đầu vào để ra kết quả sai, không đụng huấn luyện. Nó ứng với kỹ thuật "evasion" trong ATLAS.</p>
<h3>Mô hình đe doạ</h3>
<ul>
<li><strong>Hộp trắng</strong> — kẻ tấn công biết mô hình &amp; gradient (tấn công mạnh nhất, vd FGSM, PGD).</li>
<li><strong>Hộp đen</strong> — chỉ truy vấn API; dùng tính lan truyền (transferability) hoặc ước lượng qua truy vấn.</li>
</ul>
<div class="callout"><span class="badge">Xem trước phòng thủ</span> Huấn luyện đối kháng (Chương 6) huấn luyện trên chính các đầu vào này để mô hình học cách kháng lại; kiểm đầu vào và bộ phát hiện thêm lớp.</div>`,
  ]]);

const c3q = quiz('daa401-quiz-3', 'Quiz 3 — Adversarial attacks|||Quiz 3 — Tấn công đối kháng', [
  { id: 'q1', question: 'Ví dụ đối kháng (adversarial example) là?', options: ['Đầu vào có nhiễu loạn nhỏ khiến mô hình dự đoán sai', 'Dữ liệu huấn luyện sạch', 'Một lỗi biên dịch', 'Một loại tối ưu hoá'], correctIndex: 0, explanation: 'Nhiễu nhỏ mắt người không thấy nhưng lật dự đoán của mô hình.' },
  { id: 'q2', question: 'Tấn công "né tránh" (evasion) xảy ra ở giai đoạn nào?', options: ['Lúc thu thập dữ liệu', 'Lúc suy luận, sau khi mô hình đã triển khai', 'Lúc chọn kiến trúc', 'Lúc gán nhãn'], correctIndex: 1, explanation: 'Evasion chỉ chỉnh đầu vào lúc suy luận để ra kết quả sai, không đụng huấn luyện.' },
  { id: 'q3', question: 'Khác biệt giữa tấn công hộp trắng và hộp đen là?', options: ['Hộp trắng chỉ truy vấn API', 'Hộp trắng biết mô hình & gradient; hộp đen chỉ truy vấn được', 'Không có khác biệt', 'Hộp đen luôn mạnh hơn'], correctIndex: 1, explanation: 'White-box biết nội bộ mô hình; black-box chỉ dựa vào truy vấn và tính lan truyền.' },
]);

const c4 = doc('daa401-4-1-data-model-attacks', '4.1 — Data & model attacks|||4.1 — Tấn công dữ liệu & mô hình',
  'Đầu độc dữ liệu (poisoning) & cửa hậu (backdoor); trộm mô hình (model stealing); đảo ngược mô hình (inversion); suy luận thành viên (membership inference).',
  [[
    `<span class="eyebrow">DAA401 · Chapter 4 · Lesson 4.1</span>
<h2>Data &amp; model attacks</h2>
<h3>Attacks on the training data</h3>
<ul>
<li><strong>Data poisoning</strong> — the attacker injects malicious samples into the training set to degrade accuracy or bias the model.</li>
<li><strong>Backdoor (trojan)</strong> — a targeted poison: the model behaves normally except when it sees a secret <em>trigger</em>, then it outputs the attacker's chosen label. E.g. a small sticker makes a stop sign read as "speed limit".</li>
</ul>
<h3>Attacks on the model itself</h3>
<ul>
<li><strong>Model stealing / extraction</strong> — an attacker queries the API many times and trains a clone that mimics it, stealing the intellectual property.</li>
<li><strong>Model inversion</strong> — reconstructs representative training inputs (e.g. a recognizable face) from model outputs.</li>
<li><strong>Membership inference</strong> — decides whether a specific record was in the training set — a direct privacy breach (was <em>my</em> data used?).</li>
</ul>
<pre><code>Poison  -> corrupts the model during TRAINING
Steal   -> copies the model via the INFERENCE API
Invert  -> leaks the DATA the model memorized
</code></pre>
<div class="callout"><span class="badge">Defense preview</span> Data provenance &amp; sanitization, anomaly detection in training data, query rate-limiting and output perturbation, plus differential privacy (Chapter 7).</div>`,
    `<span class="eyebrow">DAA401 · Chương 4 · Bài 4.1</span>
<h2>Tấn công dữ liệu &amp; mô hình</h2>
<h3>Tấn công vào dữ liệu huấn luyện</h3>
<ul>
<li><strong>Đầu độc dữ liệu</strong> — kẻ tấn công tiêm mẫu độc vào tập huấn luyện để hạ độ chính xác hoặc làm lệch mô hình.</li>
<li><strong>Cửa hậu (backdoor/trojan)</strong> — một dạng đầu độc có chủ đích: mô hình hoạt động bình thường, trừ khi thấy một <em>kích hoạt</em> bí mật thì trả về nhãn mà kẻ tấn công chọn. Vd một miếng dán nhỏ khiến biển "STOP" bị đọc thành "giới hạn tốc độ".</li>
</ul>
<h3>Tấn công vào chính mô hình</h3>
<ul>
<li><strong>Trộm mô hình (extraction)</strong> — truy vấn API nhiều lần rồi huấn luyện một bản sao bắt chước, trộm tài sản trí tuệ.</li>
<li><strong>Đảo ngược mô hình (inversion)</strong> — dựng lại đầu vào huấn luyện tiêu biểu (vd một khuôn mặt nhận ra được) từ đầu ra của mô hình.</li>
<li><strong>Suy luận thành viên (membership inference)</strong> — xác định một bản ghi cụ thể có nằm trong tập huấn luyện hay không — vi phạm riêng tư trực tiếp (dữ liệu của <em>tôi</em> có bị dùng không?).</li>
</ul>
<pre><code>Đầu độc -> làm hỏng mô hình lúc HUẤN LUYỆN
Trộm    -> sao chép mô hình qua API SUY LUẬN
Đảo ngược -> rò rỉ DỮ LIỆU mà mô hình đã ghi nhớ
</code></pre>
<div class="callout"><span class="badge">Xem trước phòng thủ</span> Nguồn gốc &amp; làm sạch dữ liệu, phát hiện bất thường trong dữ liệu huấn luyện, giới hạn tần suất truy vấn và nhiễu hoá đầu ra, cộng riêng tư vi phân (Chương 7).</div>`,
  ]]);

const c4q = quiz('daa401-quiz-4', 'Quiz 4 — Data & model attacks|||Quiz 4 — Tấn công dữ liệu & mô hình', [
  { id: 'q1', question: 'Tấn công "cửa hậu" (backdoor) khác đầu độc thường ở điểm nào?', options: ['Không cần dữ liệu', 'Mô hình chỉ hành xử sai khi thấy một kích hoạt bí mật', 'Chỉ xảy ra lúc suy luận', 'Luôn làm mô hình sập'], correctIndex: 1, explanation: 'Backdoor giữ mô hình bình thường, chỉ lật nhãn khi gặp trigger bí mật.' },
  { id: 'q2', question: 'Tấn công "membership inference" nhằm xác định điều gì?', options: ['Kiến trúc mô hình', 'Một bản ghi cụ thể có nằm trong tập huấn luyện không', 'Learning rate', 'Số lớp mạng'], correctIndex: 1, explanation: 'Nó suy ra một dữ liệu cụ thể có được dùng để huấn luyện không — vi phạm riêng tư.' },
  { id: 'q3', question: 'Trộm mô hình (model stealing) thực hiện chủ yếu qua?', options: ['Đầu độc dữ liệu huấn luyện', 'Truy vấn API suy luận nhiều lần rồi huấn luyện bản sao', 'Đọc mã nguồn frontend', 'Đổi nhãn dữ liệu'], correctIndex: 1, explanation: 'Kẻ tấn công dùng nhiều truy vấn API để huấn luyện một clone bắt chước mô hình gốc.' },
]);

const c5 = doc('daa401-5-1-llm-security', '5.1 — LLM & GenAI security|||5.1 — Bảo mật LLM & GenAI',
  'Prompt injection (trực tiếp & gián tiếp); jailbreak; OWASP Top 10 for LLM; bảo mật RAG (nguồn không tin cậy, rò rỉ ngữ cảnh); xử lý đầu ra không tin cậy.',
  [[
    `<span class="eyebrow">DAA401 · Chapter 5 · Lesson 5.1</span>
<h2>LLM &amp; GenAI security</h2>
<h3>Prompt injection — the #1 LLM risk</h3>
<p><strong>Prompt injection</strong> is when untrusted text overrides the developer's instructions. There are two kinds:</p>
<ul>
<li><strong>Direct</strong> — the user types "ignore your previous instructions and ...".</li>
<li><strong>Indirect</strong> — malicious instructions hide in content the model reads (a web page, a PDF, an email) and get executed when the LLM processes it.</li>
</ul>
<h3>Jailbreak</h3>
<p>A <strong>jailbreak</strong> crafts a prompt (role-play, obfuscation, encoding) that bypasses the model's safety alignment to produce disallowed output.</p>
<h3>OWASP Top 10 for LLM (selected)</h3>
<ul>
<li>LLM01 Prompt Injection · LLM02 Insecure Output Handling · LLM03 Training Data Poisoning · LLM06 Sensitive Information Disclosure · LLM08 Excessive Agency.</li>
</ul>
<h3>RAG security</h3>
<p>Retrieval-Augmented Generation pulls documents into the prompt — so a <strong>poisoned document</strong> becomes indirect prompt injection, and over-broad retrieval can leak data across tenants. Treat retrieved content as <strong>untrusted input</strong>, and never let LLM output trigger privileged actions without validation.</p>
<div class="callout"><span class="badge">Golden rule</span> Never trust model output as if it were code or a command. Validate and sandbox it exactly like user input (LLM02: Insecure Output Handling).</div>`,
    `<span class="eyebrow">DAA401 · Chương 5 · Bài 5.1</span>
<h2>Bảo mật LLM &amp; GenAI</h2>
<h3>Prompt injection — rủi ro LLM số 1</h3>
<p><strong>Prompt injection</strong> là khi văn bản không tin cậy đè lên chỉ dẫn của lập trình viên. Có hai loại:</p>
<ul>
<li><strong>Trực tiếp</strong> — người dùng gõ "bỏ qua chỉ dẫn trước đó và ...".</li>
<li><strong>Gián tiếp</strong> — chỉ dẫn độc giấu trong nội dung mà mô hình đọc (một trang web, một PDF, một email) và bị thực thi khi LLM xử lý.</li>
</ul>
<h3>Jailbreak</h3>
<p>Một <strong>jailbreak</strong> chế prompt (đóng vai, làm rối, mã hoá) để vượt qua căn chỉnh an toàn của mô hình, buộc nó sinh nội dung bị cấm.</p>
<h3>OWASP Top 10 cho LLM (chọn lọc)</h3>
<ul>
<li>LLM01 Prompt Injection · LLM02 Xử lý đầu ra không an toàn · LLM03 Đầu độc dữ liệu huấn luyện · LLM06 Rò rỉ thông tin nhạy cảm · LLM08 Quyền hạn quá mức.</li>
</ul>
<h3>Bảo mật RAG</h3>
<p>RAG kéo tài liệu vào prompt — nên một <strong>tài liệu bị đầu độc</strong> trở thành prompt injection gián tiếp, và truy hồi quá rộng có thể rò rỉ dữ liệu giữa các tenant. Hãy coi nội dung truy hồi là <strong>đầu vào không tin cậy</strong>, và đừng bao giờ để đầu ra LLM kích hoạt hành động đặc quyền mà không kiểm tra.</p>
<div class="callout"><span class="badge">Quy tắc vàng</span> Đừng bao giờ tin đầu ra của mô hình như thể nó là mã hay lệnh. Kiểm và cô lập nó y như đầu vào của người dùng (LLM02: Insecure Output Handling).</div>`,
  ]]);

const c5q = quiz('daa401-quiz-5', 'Quiz 5 — LLM & GenAI security|||Quiz 5 — Bảo mật LLM & GenAI', [
  { id: 'q1', question: 'Prompt injection GIÁN TIẾP xảy ra thế nào?', options: ['Người dùng gõ thẳng lệnh vào ô chat', 'Chỉ dẫn độc giấu trong nội dung mô hình đọc (web/PDF/email)', 'Đầu độc trọng số mô hình', 'Trộm API key'], correctIndex: 1, explanation: 'Gián tiếp: lệnh độc nằm trong dữ liệu LLM xử lý, bị thực thi khi model đọc nó.' },
  { id: 'q2', question: 'Rủi ro LLM đứng đầu bảng OWASP Top 10 for LLM là?', options: ['Prompt Injection (LLM01)', 'Đổi màu giao diện', 'Nén mô hình', 'Tăng nhiệt độ sinh'], correctIndex: 0, explanation: 'LLM01 Prompt Injection là rủi ro hàng đầu của ứng dụng LLM.' },
  { id: 'q3', question: 'Trong RAG, nội dung tài liệu truy hồi nên được coi là?', options: ['Luôn tin cậy tuyệt đối', 'Đầu vào KHÔNG tin cậy, cần kiểm như input người dùng', 'Mã nguồn hệ thống', 'Cấu hình bảo mật'], correctIndex: 1, explanation: 'Tài liệu bị đầu độc thành injection gián tiếp; coi nội dung truy hồi là untrusted.' },
]);

const c6 = doc('daa401-6-1-defenses-robustness', '6.1 — Defenses & robustness|||6.1 — Phòng thủ & robustness',
  'Huấn luyện đối kháng (adversarial training); kiểm & làm sạch đầu vào (input validation/sanitization); robustness & chứng nhận; giám sát/phát hiện; phòng thủ nhiều lớp.',
  [[
    `<span class="eyebrow">DAA401 · Chapter 6 · Lesson 6.1</span>
<h2>Defenses &amp; robustness</h2>
<h3>Adversarial training</h3>
<p>The strongest general defense: generate adversarial examples during training and include them, so the model learns a smoother, more <strong>robust</strong> decision boundary. It costs more compute and can lower clean accuracy slightly — a security/accuracy trade-off.</p>
<h3>Input validation &amp; sanitization</h3>
<ul>
<li><strong>Range &amp; schema checks</strong> — reject inputs outside expected shape/range.</li>
<li><strong>Preprocessing defenses</strong> — feature squeezing, denoising, or randomized smoothing can wash out small perturbations.</li>
<li><strong>For LLMs</strong> — strip/segregate untrusted content, constrain output format, and keep the model away from privileged actions.</li>
</ul>
<h3>Robustness &amp; certification</h3>
<p><strong>Robustness</strong> means the output does not change under bounded perturbations. Certified defenses (e.g. randomized smoothing) give a provable radius within which the prediction is guaranteed stable.</p>
<h3>Detect &amp; monitor</h3>
<p>Add adversarial-input detectors, log confidence distributions, and alert on distribution shift — no single defense is complete, so layer them (defense in depth).</p>
<div class="callout"><span class="badge">Trade-off</span> There is no free lunch: robustness often costs accuracy and compute. Pick the level that matches the threat model from Chapter 2.</div>`,
    `<span class="eyebrow">DAA401 · Chương 6 · Bài 6.1</span>
<h2>Phòng thủ &amp; robustness</h2>
<h3>Huấn luyện đối kháng</h3>
<p>Phòng thủ tổng quát mạnh nhất: sinh ví dụ đối kháng ngay trong lúc huấn luyện và đưa chúng vào, để mô hình học một biên quyết định trơn hơn, <strong>vững</strong> hơn. Nó tốn thêm tính toán và có thể giảm nhẹ độ chính xác trên dữ liệu sạch — một đánh đổi bảo mật/chính xác.</p>
<h3>Kiểm &amp; làm sạch đầu vào</h3>
<ul>
<li><strong>Kiểm phạm vi &amp; lược đồ</strong> — từ chối đầu vào lệch hình dạng/phạm vi mong đợi.</li>
<li><strong>Phòng thủ tiền xử lý</strong> — feature squeezing, khử nhiễu, hoặc làm mượt ngẫu nhiên có thể xoá đi nhiễu nhỏ.</li>
<li><strong>Với LLM</strong> — tách/loại nội dung không tin cậy, ràng buộc định dạng đầu ra, và giữ mô hình tránh xa hành động đặc quyền.</li>
</ul>
<h3>Robustness &amp; chứng nhận</h3>
<p><strong>Robustness</strong> nghĩa là đầu ra không đổi dưới nhiễu loạn có giới hạn. Phòng thủ có chứng nhận (vd randomized smoothing) cho một bán kính chứng minh được, trong đó dự đoán được bảo đảm ổn định.</p>
<h3>Phát hiện &amp; giám sát</h3>
<p>Thêm bộ phát hiện đầu vào đối kháng, ghi phân bố độ tin, và cảnh báo khi phân bố dữ liệu dịch chuyển — không phòng thủ đơn lẻ nào là đủ, hãy xếp lớp (phòng thủ nhiều lớp).</p>
<div class="callout"><span class="badge">Đánh đổi</span> Không có bữa trưa miễn phí: robustness thường tốn độ chính xác và tính toán. Chọn mức khớp với mô hình đe doạ ở Chương 2.</div>`,
  ]]);

const c6q = quiz('daa401-quiz-6', 'Quiz 6 — Defenses & robustness|||Quiz 6 — Phòng thủ & robustness', [
  { id: 'q1', question: 'Huấn luyện đối kháng (adversarial training) hoạt động thế nào?', options: ['Xoá dữ liệu độc sau khi huấn luyện', 'Đưa ví dụ đối kháng vào lúc huấn luyện để mô hình học kháng lại', 'Chỉ tăng số epoch', 'Public trọng số mô hình'], correctIndex: 1, explanation: 'Sinh adversarial example trong huấn luyện để mô hình có biên quyết định vững hơn.' },
  { id: 'q2', question: '"Robustness" của mô hình nghĩa là?', options: ['Mô hình chạy nhanh hơn', 'Đầu ra không đổi dưới nhiễu loạn có giới hạn', 'Mô hình nhỏ hơn', 'Không cần dữ liệu'], correctIndex: 1, explanation: 'Robustness: dự đoán ổn định khi đầu vào bị nhiễu trong giới hạn cho phép.' },
  { id: 'q3', question: 'Vì sao nên xếp nhiều lớp phòng thủ thay vì một?', options: ['Để tốn nhiều tài nguyên hơn', 'Vì không phòng thủ đơn lẻ nào là đủ (defense in depth)', 'Để mô hình chậm lại', 'Vì luật bắt buộc'], correctIndex: 1, explanation: 'Mỗi lớp có điểm yếu; xếp lớp giảm rủi ro một lớp bị vượt qua.' },
]);

const c7 = doc('daa401-7-1-privacy', '7.1 — Privacy & data protection|||7.1 — Quyền riêng tư & bảo vệ dữ liệu',
  'ML bảo toàn riêng tư (privacy-preserving ML); riêng tư vi phân (differential privacy); học liên kết (federated learning); ẩn danh & tối thiểu hoá dữ liệu.',
  [[
    `<span class="eyebrow">DAA401 · Chapter 7 · Lesson 7.1</span>
<h2>Privacy &amp; data protection</h2>
<h3>Why privacy is a security concern</h3>
<p>Models can <strong>memorize and leak</strong> their training data (see inversion &amp; membership inference in Chapter 4). Privacy-preserving ML protects individuals whose data trained the model, and helps meet regulations.</p>
<h3>Differential privacy (DP)</h3>
<p><strong>Differential privacy</strong> adds calibrated noise so that the presence or absence of any single record barely changes the output — bounded by a privacy budget <em>epsilon</em> (smaller = more private). DP-SGD applies this during training.</p>
<pre><code>Smaller epsilon -> more noise -> stronger privacy, lower accuracy
Larger  epsilon -> less noise -> weaker privacy, higher accuracy
</code></pre>
<h3>Federated learning (FL)</h3>
<p><strong>Federated learning</strong> trains across many devices without moving the raw data: each device computes an update locally and only the <em>updates</em> (not the data) are aggregated. Combine with DP and secure aggregation, because raw gradients can still leak information.</p>
<h3>Data minimization &amp; anonymization</h3>
<p>Collect only what you need, anonymize/pseudonymize, and set retention limits. Note that naive anonymization can be re-identified — DP gives a stronger, quantifiable guarantee.</p>
<div class="callout"><span class="badge">Key idea</span> Privacy is a spectrum with a measurable cost: the epsilon budget trades accuracy for a provable privacy guarantee.</div>`,
    `<span class="eyebrow">DAA401 · Chương 7 · Bài 7.1</span>
<h2>Quyền riêng tư &amp; bảo vệ dữ liệu</h2>
<h3>Vì sao riêng tư là vấn đề bảo mật</h3>
<p>Mô hình có thể <strong>ghi nhớ và rò rỉ</strong> dữ liệu huấn luyện (xem đảo ngược &amp; suy luận thành viên ở Chương 4). ML bảo toàn riêng tư bảo vệ các cá nhân có dữ liệu đã huấn luyện mô hình, và giúp tuân thủ quy định.</p>
<h3>Riêng tư vi phân (DP)</h3>
<p><strong>Riêng tư vi phân</strong> thêm nhiễu được hiệu chỉnh sao cho việc có hay không một bản ghi đơn lẻ gần như không đổi đầu ra — bị chặn bởi ngân sách riêng tư <em>epsilon</em> (nhỏ hơn = riêng tư hơn). DP-SGD áp dụng điều này trong huấn luyện.</p>
<pre><code>epsilon nhỏ -> nhiều nhiễu -> riêng tư mạnh, chính xác thấp
epsilon lớn -> ít nhiễu   -> riêng tư yếu, chính xác cao
</code></pre>
<h3>Học liên kết (FL)</h3>
<p><strong>Học liên kết</strong> huấn luyện trên nhiều thiết bị mà không di chuyển dữ liệu gốc: mỗi thiết bị tính bản cập nhật cục bộ và chỉ <em>bản cập nhật</em> (không phải dữ liệu) được gộp lại. Kết hợp với DP và gộp an toàn (secure aggregation), vì gradient thô vẫn có thể rò rỉ thông tin.</p>
<h3>Tối thiểu hoá &amp; ẩn danh dữ liệu</h3>
<p>Chỉ thu thứ bạn cần, ẩn danh/giả danh, và đặt hạn lưu trữ. Lưu ý ẩn danh ngây thơ vẫn có thể bị tái định danh — DP cho một bảo đảm mạnh hơn, đo lường được.</p>
<div class="callout"><span class="badge">Ý chính</span> Riêng tư là một dải liên tục có chi phí đo được: ngân sách epsilon đánh đổi độ chính xác lấy một bảo đảm riêng tư chứng minh được.</div>`,
  ]]);

const c7q = quiz('daa401-quiz-7', 'Quiz 7 — Privacy|||Quiz 7 — Quyền riêng tư', [
  { id: 'q1', question: 'Riêng tư vi phân (differential privacy) đạt được bằng cách?', options: ['Xoá toàn bộ dữ liệu', 'Thêm nhiễu hiệu chỉnh để một bản ghi đơn lẻ gần như không đổi đầu ra', 'Mã hoá đường truyền', 'Tăng kích thước mô hình'], correctIndex: 1, explanation: 'DP thêm nhiễu theo ngân sách epsilon để che ảnh hưởng của từng bản ghi.' },
  { id: 'q2', question: 'Trong học liên kết (federated learning), thứ được gộp lại là?', options: ['Dữ liệu thô của mỗi thiết bị', 'Chỉ các bản cập nhật mô hình (không phải dữ liệu)', 'Khoá API', 'Toàn bộ ổ đĩa thiết bị'], correctIndex: 1, explanation: 'FL giữ dữ liệu tại thiết bị; chỉ update được gửi về và gộp.' },
  { id: 'q3', question: 'Với epsilon NHỎ trong DP thì?', options: ['Ít nhiễu, riêng tư yếu', 'Nhiều nhiễu, riêng tư mạnh nhưng chính xác thấp hơn', 'Không ảnh hưởng gì', 'Mô hình nhanh hơn'], correctIndex: 1, explanation: 'epsilon nhỏ = nhiều nhiễu = riêng tư mạnh, đánh đổi độ chính xác.' },
]);

const c8 = doc('daa401-8-1-governance', '8.1 — Governance & responsible AI|||8.1 — Quản trị & AI có trách nhiệm',
  'Quản trị AI theo NIST AI RMF (Govern/Map/Measure/Manage); thiên lệch & công bằng (bias/fairness); giải thích được (explainability); tuân thủ & đạo đức.',
  [[
    `<span class="eyebrow">DAA401 · Chapter 8 · Lesson 8.1</span>
<h2>Governance &amp; responsible AI</h2>
<h3>NIST AI Risk Management Framework</h3>
<p>The <strong>NIST AI RMF</strong> organizes AI risk work into four functions:</p>
<ul>
<li><strong>Govern</strong> — a culture and policies for managing AI risk across the org.</li>
<li><strong>Map</strong> — establish context and identify risks for each use case.</li>
<li><strong>Measure</strong> — analyze and track risks with metrics (accuracy, bias, robustness).</li>
<li><strong>Manage</strong> — prioritize and act on risks, and monitor over time.</li>
</ul>
<p>It targets trustworthy AI: valid &amp; reliable, safe, secure &amp; resilient, accountable &amp; transparent, explainable, privacy-enhanced, and fair.</p>
<h3>Bias &amp; fairness</h3>
<p>Bias enters through data or design and can cause discriminatory outcomes. Measure with group fairness metrics, and mitigate at the data, training, or output stage.</p>
<h3>Explainability</h3>
<p><strong>Explainability</strong> (e.g. SHAP, LIME) helps humans understand and audit a prediction — essential for high-stakes decisions and for detecting attacks.</p>
<h3>Compliance &amp; ethics</h3>
<p>Map controls to regulations (e.g. GDPR, the EU AI Act) and keep humans accountable — governance ties the whole course together: design, threats, attacks, defenses and privacy under one risk-managed umbrella.</p>
<div class="callout"><span class="badge">Big picture</span> Security, privacy and fairness are not separate checkboxes — NIST AI RMF manages them together as "trustworthy AI".</div>`,
    `<span class="eyebrow">DAA401 · Chương 8 · Bài 8.1</span>
<h2>Quản trị &amp; AI có trách nhiệm</h2>
<h3>Khung Quản trị Rủi ro AI của NIST (AI RMF)</h3>
<p><strong>NIST AI RMF</strong> tổ chức việc quản trị rủi ro AI thành bốn chức năng:</p>
<ul>
<li><strong>Govern (Quản trị)</strong> — văn hoá và chính sách quản lý rủi ro AI toàn tổ chức.</li>
<li><strong>Map (Ánh xạ)</strong> — thiết lập bối cảnh và nhận diện rủi ro cho từng ca sử dụng.</li>
<li><strong>Measure (Đo lường)</strong> — phân tích và theo dõi rủi ro bằng chỉ số (chính xác, thiên lệch, robustness).</li>
<li><strong>Manage (Quản lý)</strong> — ưu tiên và xử lý rủi ro, giám sát theo thời gian.</li>
</ul>
<p>Nó nhắm tới AI đáng tin: hợp lệ &amp; tin cậy, an toàn, bảo mật &amp; bền bỉ, có trách nhiệm giải trình &amp; minh bạch, giải thích được, tăng cường riêng tư, và công bằng.</p>
<h3>Thiên lệch &amp; công bằng</h3>
<p>Thiên lệch len vào qua dữ liệu hoặc thiết kế và có thể gây kết quả phân biệt. Đo bằng các chỉ số công bằng theo nhóm, và giảm thiểu ở khâu dữ liệu, huấn luyện hoặc đầu ra.</p>
<h3>Giải thích được</h3>
<p><strong>Giải thích được</strong> (vd SHAP, LIME) giúp con người hiểu và kiểm toán một dự đoán — thiết yếu cho quyết định rủi ro cao và để phát hiện tấn công.</p>
<h3>Tuân thủ &amp; đạo đức</h3>
<p>Ánh xạ chốt kiểm sang quy định (vd GDPR, EU AI Act) và giữ con người chịu trách nhiệm — quản trị buộc cả môn lại: thiết kế, đe doạ, tấn công, phòng thủ và riêng tư dưới một mái quản lý rủi ro.</p>
<div class="callout"><span class="badge">Toàn cảnh</span> Bảo mật, riêng tư và công bằng không phải các ô tick riêng lẻ — NIST AI RMF quản lý chúng cùng nhau như "AI đáng tin".</div>`,
  ]]);

const c8q = quiz('daa401-quiz-8', 'Quiz 8 — Governance|||Quiz 8 — Quản trị', [
  { id: 'q1', question: 'Bốn chức năng của NIST AI RMF là?', options: ['Build, Test, Ship, Sell', 'Govern, Map, Measure, Manage', 'Plan, Do, Check, Act', 'Scan, Patch, Deploy, Log'], correctIndex: 1, explanation: 'NIST AI RMF gồm Govern, Map, Measure, Manage.' },
  { id: 'q2', question: 'Công cụ như SHAP/LIME phục vụ mục tiêu nào?', options: ['Tăng tốc huấn luyện', 'Giải thích được (explainability) — hiểu và kiểm toán dự đoán', 'Nén mô hình', 'Mã hoá dữ liệu'], correctIndex: 1, explanation: 'SHAP/LIME giúp con người hiểu vì sao mô hình ra một dự đoán.' },
  { id: 'q3', question: 'Thiên lệch (bias) trong mô hình chủ yếu len vào từ đâu?', options: ['Chỉ từ phần cứng', 'Từ dữ liệu hoặc thiết kế, gây kết quả phân biệt', 'Từ tốc độ mạng', 'Từ màu giao diện'], correctIndex: 1, explanation: 'Bias vào qua dữ liệu/thiết kế; đo bằng chỉ số công bằng và giảm thiểu ở nhiều khâu.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'DAA401',
    slug: 'daa401-design-and-secure-ai-system',
    title: 'Design and Secure AI System',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DAA401.webp',
    shortDescription: 'Design & secure AI systems — threat modeling (MITRE ATLAS), adversarial attacks, data poisoning & model theft, LLM/GenAI security (OWASP, prompt injection), defenses, privacy & governance (NIST AI RMF, SAIF). Bilingual, with quizzes.|||Thiết kế & bảo mật hệ thống AI — mô hình đe doạ (ATLAS), tấn công đối kháng, đầu độc dữ liệu & trộm mô hình, bảo mật LLM/GenAI (OWASP, prompt injection), phòng thủ, riêng tư & quản trị (NIST AI RMF). Song ngữ, có quiz.',
    description: 'Môn <strong>DAA401 — Design and Secure AI System</strong> (ngành Khoa học Máy tính, kỳ 8) dạy cách <strong>thiết kế và bảo mật hệ thống AI</strong>. Từ <strong>thiết kế an toàn &amp; vòng đời</strong> (secure-by-design, Google SAIF) → <strong>mô hình đe doạ</strong> (MITRE ATLAS) → <strong>tấn công đối kháng</strong> (adversarial, evasion) → <strong>tấn công dữ liệu &amp; mô hình</strong> (poisoning, backdoor, stealing, inversion, membership inference) → <strong>bảo mật LLM/GenAI</strong> (prompt injection, OWASP LLM Top 10, RAG) → <strong>phòng thủ &amp; robustness</strong> → <strong>quyền riêng tư</strong> (differential privacy, federated learning) → <strong>quản trị &amp; AI có trách nhiệm</strong> (NIST AI RMF). Bám khung chuẩn quốc tế, song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Vòng đời AI an toàn &amp; secure-by-design; mô hình hoá đe doạ với MITRE ATLAS; ví dụ đối kháng &amp; né tránh (FGSM/PGD, hộp trắng/đen); đầu độc dữ liệu, backdoor, trộm/đảo ngược mô hình, suy luận thành viên; prompt injection, jailbreak, OWASP LLM Top 10, bảo mật RAG; huấn luyện đối kháng, kiểm đầu vào, robustness; riêng tư vi phân &amp; học liên kết; quản trị NIST AI RMF, công bằng, giải thích được, tuân thủ.',
    requirements: 'Kiến thức học máy cơ bản (huấn luyện/suy luận, mạng nơ-ron) và an toàn thông tin nền tảng. Nên biết Python để chạy thử các công cụ tấn công/phòng thủ (ART, CleverHans).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, khung chuẩn (NIST AI RMF, ATLAS, OWASP, SAIF), sách, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao bảo mật AI khác biệt; bề mặt tấn công; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Thiết kế AI an toàn|||Chapter 1 — Secure AI design', description: 'Vòng đời AI, secure-by-design, SAIF, bức tranh đe doạ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mô hình đe doạ AI|||Chapter 2 — AI threat modeling', description: 'MITRE ATLAS, tài sản & bề mặt tấn công.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tấn công đối kháng|||Chapter 3 — Adversarial attacks', description: 'Adversarial examples, evasion, perturbation, hộp trắng/đen.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tấn công dữ liệu & mô hình|||Chapter 4 — Data & model attacks', description: 'Poisoning, backdoor, model stealing, inversion, membership inference.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Bảo mật LLM & GenAI|||Chapter 5 — LLM & GenAI security', description: 'Prompt injection, jailbreak, OWASP LLM Top 10, RAG.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Phòng thủ & robustness|||Chapter 6 — Defenses & robustness', description: 'Adversarial training, kiểm đầu vào, robustness, giám sát.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quyền riêng tư & dữ liệu|||Chapter 7 — Privacy & data', description: 'Privacy-preserving ML, differential privacy, federated learning.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quản trị & AI có trách nhiệm|||Chapter 8 — Governance & responsible AI', description: 'NIST AI RMF, bias/fairness, explainability, tuân thủ, đạo đức.', lessons: [c8, c8q] },
  ],
};
