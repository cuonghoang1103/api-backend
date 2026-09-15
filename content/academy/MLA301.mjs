/**
 * MLA301 — Machine Learning and Responsible AI for Business Applications.
 * Giáo trình (trích dẫn, không upload PDF): Géron "Hands-On Machine Learning";
 * O'Neil "Weapons of Math Destruction"; Google Responsible AI Practices; EU AI
 * Act; NIST AI RMF. ⚠️ Có MCL201 (ML cơ bản) rồi — môn NÀY nhấn AI CÓ TRÁCH
 * NHIỆM (bias, fairness, XAI, privacy, governance) + ứng dụng kinh doanh nâng
 * cao, không lặp lại lý thuyết thuật toán cơ bản của MCL201.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mla301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí (EU AI Act, NIST AI RMF, Google Responsible AI), YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">MLA301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything for Machine Learning and Responsible AI for Business Applications — bias, fairness, explainability, privacy and AI governance — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MLA301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/" target="_blank" rel="noopener"><em>Hands-On Machine Learning</em> — Aurélien Géron</a> — the applied ML pipeline this course reviews quickly before going deeper into responsibility.</li>
<li><a href="https://weaponsofmathdestructionbook.com/" target="_blank" rel="noopener"><em>Weapons of Math Destruction</em> — Cathy O'Neil</a> — real cases of biased, opaque algorithms harming people at scale.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://ai.google/responsibility/responsible-ai-practices/" target="_blank" rel="noopener">Google Responsible AI Practices</a></li>
<li><a href="https://artificialintelligenceact.eu/" target="_blank" rel="noopener">EU AI Act — full text &amp; explainer</a> — risk-tiered legal framework.</li>
<li><a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">NIST AI Risk Management Framework (AI RMF)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@GoogleAI" target="_blank" rel="noopener">Google AI</a> — responsible AI case studies &amp; tooling.</li>
<li><a href="https://www.youtube.com/@stanfordonline" target="_blank" rel="noopener">Stanford Online</a> — HAI (Human-Centered AI) lectures on fairness &amp; policy.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://shap.readthedocs.io/" target="_blank" rel="noopener">SHAP</a> — model explainability library used in Chapter 5.</li>
<li><a href="https://github.com/marcotcr/lime" target="_blank" rel="noopener">LIME</a> — local interpretable model-agnostic explanations.</li>
<li><a href="https://fairlearn.org/" target="_blank" rel="noopener">Fairlearn</a> — fairness metrics &amp; bias mitigation for scikit-learn models.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — if the applied ML pipeline (train/test, features, metrics) is new to you, review <strong>MCL201</strong> first; MLA301 assumes it and moves straight to responsibility.</li>
<li><strong>Core</strong> — bias sources → fairness metrics → explainability (SHAP/LIME) → privacy &amp; compliance.</li>
<li><strong>Go deeper</strong> — AI governance frameworks (EU AI Act, NIST AI RMF), accountability, model cards.</li>
<li><strong>Job-ready</strong> — run a fairness/explainability audit on a real business model (credit, hiring, marketing) end to end.</li>
</ol></div>`,
    `<span class="eyebrow">MLA301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho môn Học máy và AI có trách nhiệm cho ứng dụng kinh doanh — thiên lệch, công bằng, khả năng giải thích, quyền riêng tư và quản trị AI — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MLA301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/" target="_blank" rel="noopener"><em>Hands-On Machine Learning</em> — Aurélien Géron</a> — quy trình ML ứng dụng môn này ôn nhanh trước khi đi sâu vào trách nhiệm.</li>
<li><a href="https://weaponsofmathdestructionbook.com/" target="_blank" rel="noopener"><em>Weapons of Math Destruction</em> — Cathy O'Neil</a> — các vụ thật về thuật toán thiên lệch, mờ đục gây hại quy mô lớn.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://ai.google/responsibility/responsible-ai-practices/" target="_blank" rel="noopener">Google Responsible AI Practices</a></li>
<li><a href="https://artificialintelligenceact.eu/" target="_blank" rel="noopener">EU AI Act — toàn văn &amp; giải thích</a> — khung pháp lý phân theo mức rủi ro.</li>
<li><a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">NIST AI Risk Management Framework (AI RMF)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GoogleAI" target="_blank" rel="noopener">Google AI</a> — tình huống AI có trách nhiệm &amp; công cụ thực tế.</li>
<li><a href="https://www.youtube.com/@stanfordonline" target="_blank" rel="noopener">Stanford Online</a> — bài giảng HAI (Human-Centered AI) về công bằng &amp; chính sách.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://shap.readthedocs.io/" target="_blank" rel="noopener">SHAP</a> — thư viện giải thích mô hình dùng ở Chương 5.</li>
<li><a href="https://github.com/marcotcr/lime" target="_blank" rel="noopener">LIME</a> — giải thích cục bộ, không phụ thuộc loại mô hình.</li>
<li><a href="https://fairlearn.org/" target="_blank" rel="noopener">Fairlearn</a> — chỉ số công bằng &amp; giảm thiên lệch cho mô hình scikit-learn.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — nếu quy trình ML ứng dụng (train/test, đặc trưng, chỉ số) còn mới, ôn <strong>MCL201</strong> trước; MLA301 giả định đã biết và đi thẳng vào trách nhiệm.</li>
<li><strong>Lõi</strong> — nguồn thiên lệch → chỉ số công bằng → giải thích được (SHAP/LIME) → quyền riêng tư &amp; tuân thủ.</li>
<li><strong>Đào sâu</strong> — khung quản trị AI (EU AI Act, NIST AI RMF), trách nhiệm giải trình, model card.</li>
<li><strong>Sẵn sàng đi làm</strong> — tự chạy một cuộc kiểm tra công bằng/giải thích trên một mô hình kinh doanh thật (tín dụng, tuyển dụng, marketing) từ đầu đến cuối.</li>
</ol></div>`,
  ]]);

const intro = doc('mla301-0-1-overview', 'Course overview: ML & Responsible AI for business|||Tổng quan: Học máy & AI có trách nhiệm cho kinh doanh',
  'Vì sao ML trong kinh doanh cần "có trách nhiệm"; khác biệt với MCL201; lộ trình 8 chương: bias → fairness → XAI → privacy → governance → ứng dụng thực tế.',
  [[
    `<span class="eyebrow">MLA301 · Lesson 0.1 · Overview</span>
<h2>Machine Learning &amp; Responsible AI for Business Applications</h2>
<p class="lead">Businesses now use ML to decide who gets a loan, who gets interviewed, whose transaction is flagged as fraud, and what price a customer sees. Those decisions affect real people — so this course is not about building another classifier; it's about making sure the classifier <strong>you already know how to build</strong> is <strong>fair, explainable, private, and legally defensible</strong>.</p>
<h3>Not a repeat of MCL201</h3>
<p>MCL201 taught the algorithms (regression, trees, clustering, evaluation metrics). MLA301 <strong>assumes that</strong> and adds the layer businesses actually get sued, fined or embarrassed over: biased training data, unfair outcomes across groups, black-box decisions nobody can explain to a regulator, mishandled personal data, and missing governance.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Ch.1–2</strong> — ML in business + a fast MLOps review (business lens, not algorithm theory).</li>
<li><strong>Ch.3–4</strong> — where bias comes from, and how to measure fairness.</li>
<li><strong>Ch.5</strong> — explainability: SHAP/LIME to open the black box.</li>
<li><strong>Ch.6–7</strong> — privacy/compliance, then legal frameworks (EU AI Act, NIST AI RMF) and accountability.</li>
<li><strong>Ch.8</strong> — putting it all together on real business case studies.</li>
</ul>
<div class="callout"><span class="badge">The core question</span> For every model in this course, ask: <em>who could this hurt, how would we know, and can we explain the decision to the person it affects?</em></div>`,
    `<span class="eyebrow">MLA301 · Bài 0.1 · Tổng quan</span>
<h2>Học máy &amp; AI có trách nhiệm cho ứng dụng kinh doanh</h2>
<p class="lead">Doanh nghiệp giờ dùng ML để quyết định ai được vay, ai được gọi phỏng vấn, giao dịch nào bị gắn cờ gian lận, khách hàng nào thấy mức giá nào. Những quyết định đó ảnh hưởng đến người thật — nên môn này không dạy dựng thêm một bộ phân loại; nó đảm bảo bộ phân loại <strong>bạn đã biết dựng</strong> là <strong>công bằng, giải thích được, riêng tư, và đứng vững về pháp lý</strong>.</p>
<h3>Không lặp lại MCL201</h3>
<p>MCL201 dạy thuật toán (hồi quy, cây quyết định, phân cụm, chỉ số đánh giá). MLA301 <strong>giả định đã biết</strong> và thêm lớp mà doanh nghiệp thật sự bị kiện, bị phạt hoặc bị bẽ mặt vì: dữ liệu huấn luyện thiên lệch, kết quả bất công giữa các nhóm, quyết định hộp đen không ai giải thích được cho cơ quan quản lý, dữ liệu cá nhân bị xử lý sai, và thiếu quản trị.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Ch.1–2</strong> — ML trong kinh doanh + ôn nhanh MLOps (góc nhìn kinh doanh, không lặp lý thuyết thuật toán).</li>
<li><strong>Ch.3–4</strong> — thiên lệch từ đâu ra, và đo công bằng bằng chỉ số nào.</li>
<li><strong>Ch.5</strong> — giải thích được: SHAP/LIME để mở hộp đen.</li>
<li><strong>Ch.6–7</strong> — quyền riêng tư/tuân thủ, rồi khung pháp lý (EU AI Act, NIST AI RMF) và trách nhiệm giải trình.</li>
<li><strong>Ch.8</strong> — ghép tất cả lại qua tình huống kinh doanh thực tế.</li>
</ul>
<div class="callout"><span class="badge">Câu hỏi cốt lõi</span> Với mọi mô hình trong môn này, hãy hỏi: <em>mô hình này có thể hại ai, làm sao biết được, và có giải thích được quyết định cho người bị ảnh hưởng không?</em></div>`,
  ]]);

const c1 = doc('mla301-1-1-ml-in-business', '1.1 — ML in business & why responsible AI|||1.1 — ML trong kinh doanh & vì sao cần AI có trách nhiệm',
  'Ứng dụng ML phổ biến trong kinh doanh (tín dụng, tuyển dụng, gian lận, marketing); rủi ro khi ML thiếu kiểm soát; ví dụ thật (COMPAS, tuyển dụng Amazon).',
  [[
    `<span class="eyebrow">MLA301 · Chapter 1 · Lesson 1.1</span>
<h2>ML in business &amp; why responsible AI</h2>
<h3>Where ML already decides things</h3>
<ul>
<li><strong>Credit scoring</strong> — who gets a loan and at what interest rate.</li>
<li><strong>Hiring</strong> — resume screening, interview scheduling, candidate ranking.</li>
<li><strong>Fraud detection</strong> — which transactions get blocked or flagged.</li>
<li><strong>Marketing &amp; pricing</strong> — who sees which ad, discount, or price.</li>
</ul>
<h3>What goes wrong without responsibility</h3>
<p>A model that is accurate <em>on average</em> can still be systematically unfair to a subgroup, illegal to use, or impossible to defend when challenged. Two well-documented cases:</p>
<ul>
<li><strong>COMPAS</strong> (criminal risk scoring, US) — investigated for scoring Black defendants as higher-risk than white defendants with similar records.</li>
<li><strong>Amazon's hiring tool</strong> — trained on historical resumes dominated by men, learned to downgrade resumes containing "women's" (e.g. "women's chess club"); the project was scrapped.</li>
</ul>
<p>Both models were technically "accurate" on their training objective. The failure was in <strong>what they optimized for</strong>, not in the code.</p>
<h3>Responsible AI, defined for this course</h3>
<p>Building ML systems whose decisions are <strong>fair</strong> across groups, <strong>explainable</strong> to the people they affect, <strong>private</strong> with personal data, and <strong>governed</strong> by clear accountability — throughout the model's life, not just at launch.</p>
<div class="callout"><span class="badge">Book reference</span> Cathy O'Neil's <em>Weapons of Math Destruction</em> catalogs many more of these cases — required background reading for this course (see 📚 Materials).</div>`,
    `<span class="eyebrow">MLA301 · Chương 1 · Bài 1.1</span>
<h2>ML trong kinh doanh &amp; vì sao cần AI có trách nhiệm</h2>
<h3>Những nơi ML đã đang ra quyết định</h3>
<ul>
<li><strong>Chấm điểm tín dụng</strong> — ai được vay và với lãi suất nào.</li>
<li><strong>Tuyển dụng</strong> — lọc CV, xếp lịch phỏng vấn, xếp hạng ứng viên.</li>
<li><strong>Phát hiện gian lận</strong> — giao dịch nào bị chặn hoặc gắn cờ.</li>
<li><strong>Marketing &amp; giá</strong> — ai thấy quảng cáo, giảm giá, hay mức giá nào.</li>
</ul>
<h3>Điều gì hỏng khi thiếu trách nhiệm</h3>
<p>Một mô hình chính xác <em>trung bình</em> vẫn có thể bất công một cách hệ thống với một nhóm nhỏ, vi phạm pháp luật, hoặc không thể giải trình khi bị chất vấn. Hai vụ đã được ghi chép kỹ:</p>
<ul>
<li><strong>COMPAS</strong> (chấm điểm rủi ro tái phạm, Mỹ) — bị điều tra vì chấm bị cáo da đen rủi ro cao hơn bị cáo da trắng có hồ sơ tương đương.</li>
<li><strong>Công cụ tuyển dụng của Amazon</strong> — huấn luyện trên CV lịch sử chủ yếu của nam, học cách hạ điểm CV chứa từ "women's" (vd "women's chess club"); dự án bị dừng.</li>
</ul>
<p>Cả hai mô hình đều "chính xác" về mặt kỹ thuật với mục tiêu huấn luyện. Lỗi nằm ở <strong>cái mà mô hình được tối ưu cho</strong>, không nằm ở đoạn mã.</p>
<h3>AI có trách nhiệm, định nghĩa cho môn này</h3>
<p>Dựng hệ thống ML có quyết định <strong>công bằng</strong> giữa các nhóm, <strong>giải thích được</strong> cho người bị ảnh hưởng, <strong>riêng tư</strong> với dữ liệu cá nhân, và được <strong>quản trị</strong> với trách nhiệm rõ ràng — suốt vòng đời mô hình, không chỉ lúc ra mắt.</p>
<div class="callout"><span class="badge">Tham khảo sách</span> <em>Weapons of Math Destruction</em> của Cathy O'Neil liệt kê nhiều vụ tương tự — tài liệu nền bắt buộc của môn này (xem 📚 Tài liệu).</div>`,
  ]]);

const c1q = quiz('mla301-quiz-1', 'Quiz 1 — ML in business|||Quiz 1 — ML trong kinh doanh', [
  { id: 'q1', question: 'Vấn đề chính của công cụ tuyển dụng Amazon là gì?', options: ['Chạy quá chậm', 'Học thiên lệch từ CV lịch sử chủ yếu của nam, hạ điểm CV có từ liên quan "women\'s"', 'Không đọc được file PDF', 'Chi phí vận hành quá cao'], correctIndex: 1, explanation: 'Dữ liệu huấn luyện lịch sử mất cân bằng khiến mô hình học một mẫu thiên lệch, dù về kỹ thuật vẫn "chính xác" với mục tiêu huấn luyện.' },
  { id: 'q2', question: 'Vì sao một mô hình "chính xác trung bình" vẫn có thể là vấn đề?', options: ['Vì độ chính xác trung bình luôn sai', 'Vì nó có thể bất công một cách hệ thống với một nhóm nhỏ dù đúng phần lớn', 'Vì mô hình chính xác luôn chậm', 'Vì độ chính xác không thể đo được'], correctIndex: 1, explanation: 'Độ chính xác tổng thể có thể che giấu sai lệch tập trung vào một nhóm cụ thể — đây chính là lý do cần đo công bằng riêng, không chỉ đo accuracy.' },
  { id: 'q3', question: 'Theo định nghĩa của môn học, "AI có trách nhiệm" áp dụng khi nào?', options: ['Chỉ lúc mô hình mới ra mắt', 'Chỉ khi bị kiện', 'Suốt vòng đời mô hình, từ dữ liệu đến vận hành', 'Chỉ ở bước viết báo cáo cuối kỳ'], correctIndex: 2, explanation: 'Công bằng, giải thích được, riêng tư và quản trị phải được duy trì liên tục — dữ liệu, hành vi mô hình và rủi ro pháp lý đều có thể thay đổi theo thời gian.' },
]);

const c2 = doc('mla301-2-1-mlops-review', '2.1 — Applied ML pipeline review & business MLOps|||2.1 — Ôn quy trình ML ứng dụng & MLOps kinh doanh',
  'Ôn nhanh quy trình ML (dữ liệu→huấn luyện→đánh giá) theo Géron; MLOps trong kinh doanh: giám sát, phát hiện trôi dạt (drift), tái huấn luyện, các bên liên quan.',
  [[
    `<span class="eyebrow">MLA301 · Chapter 2 · Lesson 2.1</span>
<h2>Applied ML pipeline review &amp; business MLOps</h2>
<h3>Fast review (Géron's pipeline, one paragraph)</h3>
<p>Collect data → clean &amp; engineer features → split train/validation/test → train a model → evaluate with the right metric (accuracy, precision/recall, AUC) → deploy. If any of this is unfamiliar, stop and review <strong>MCL201</strong> first — this course builds on it, not re-teaches it.</p>
<h3>What changes in a business setting</h3>
<p>A notebook that scores well on a test set is not a business system. Business MLOps adds:</p>
<ul>
<li><strong>Monitoring</strong> — is live performance still matching test-set performance?</li>
<li><strong>Drift detection</strong> — has the input data distribution shifted (e.g. new customer segment, seasonal spending)? A model trained on last year's data can quietly degrade.</li>
<li><strong>Model registry &amp; versioning</strong> — which exact model version made which decision — needed for audits.</li>
<li><strong>Retraining cadence</strong> — scheduled or trigger-based, with the SAME fairness/explainability checks re-run every time (Chapters 3–5), not just once at launch.</li>
<li><strong>Stakeholders beyond data science</strong> — compliance, legal, and the business owner must sign off, not just the model's accuracy.</li>
</ul>
<pre><code>Business ML lifecycle (loop, not one-shot):
 data -> train -> evaluate -> [fairness + explainability check] -> deploy
   ^                                                                  |
   +------------------ monitor for drift / unfair outcomes <----------+
</code></pre>
<div class="callout"><span class="badge">Key shift</span> In MCL201, "done" meant a good test-set score. In business, "done" means the model keeps behaving acceptably <strong>after</strong> deployment — that loop is what the rest of this course checks.</div>`,
    `<span class="eyebrow">MLA301 · Chương 2 · Bài 2.1</span>
<h2>Ôn quy trình ML ứng dụng &amp; MLOps kinh doanh</h2>
<h3>Ôn nhanh (quy trình theo Géron, một đoạn)</h3>
<p>Thu thập dữ liệu → làm sạch &amp; kỹ thuật đặc trưng → chia train/validation/test → huấn luyện mô hình → đánh giá bằng chỉ số phù hợp (accuracy, precision/recall, AUC) → triển khai. Nếu phần này còn lạ, hãy dừng lại ôn <strong>MCL201</strong> trước — môn này xây trên nền đó, không dạy lại.</p>
<h3>Điều gì khác khi vào môi trường kinh doanh</h3>
<p>Một notebook đạt điểm tốt trên test set chưa phải một hệ thống kinh doanh. MLOps kinh doanh thêm vào:</p>
<ul>
<li><strong>Giám sát</strong> — hiệu năng thật có còn khớp hiệu năng trên test set không?</li>
<li><strong>Phát hiện trôi dạt (drift)</strong> — phân phối dữ liệu đầu vào có đổi không (vd phân khúc khách hàng mới, chi tiêu theo mùa)? Mô hình huấn luyện trên dữ liệu năm trước có thể xuống cấp âm thầm.</li>
<li><strong>Sổ đăng ký mô hình &amp; phiên bản</strong> — biết chính xác phiên bản nào ra quyết định nào — cần cho kiểm toán.</li>
<li><strong>Chu kỳ tái huấn luyện</strong> — theo lịch hoặc theo ngưỡng, và phải chạy lại ĐÚNG các kiểm tra công bằng/giải thích (Chương 3–5) mỗi lần, không chỉ một lần lúc ra mắt.</li>
<li><strong>Bên liên quan ngoài data science</strong> — tuân thủ, pháp lý và chủ sở hữu nghiệp vụ phải ký duyệt, không chỉ dựa vào độ chính xác của mô hình.</li>
</ul>
<pre><code>Vòng đời ML kinh doanh (lặp, không phải một lần):
 dữ liệu -> huấn luyện -> đánh giá -> [kiểm công bằng + giải thích] -> triển khai
    ^                                                                     |
    +------------- giám sát trôi dạt / kết quả bất công <------------------+
</code></pre>
<div class="callout"><span class="badge">Thay đổi chính</span> Ở MCL201, "xong" nghĩa là điểm test set tốt. Trong kinh doanh, "xong" nghĩa là mô hình vẫn hành xử chấp nhận được <strong>sau khi</strong> triển khai — vòng lặp đó là thứ phần còn lại của môn này sẽ kiểm tra.</div>`,
  ]]);

const c2q = quiz('mla301-quiz-2', 'Quiz 2 — MLOps in business|||Quiz 2 — MLOps kinh doanh', [
  { id: 'q1', question: 'Vì sao MLOps kinh doanh cần "phát hiện trôi dạt" (drift detection)?', options: ['Để tăng tốc huấn luyện', 'Vì phân phối dữ liệu thật có thể đổi theo thời gian, làm mô hình xuống cấp âm thầm', 'Để giảm dung lượng lưu trữ', 'Vì test set luôn sai'], correctIndex: 1, explanation: 'Mô hình huấn luyện trên dữ liệu quá khứ có thể không còn khớp dữ liệu hiện tại (khách hàng mới, thay đổi theo mùa...), nên cần giám sát liên tục.' },
  { id: 'q2', question: 'Khi tái huấn luyện mô hình, điều gì PHẢI được chạy lại?', options: ['Chỉ cần đo lại accuracy', 'Các kiểm tra công bằng và giải thích, không chỉ một lần lúc ra mắt', 'Không cần kiểm gì thêm nếu code không đổi', 'Chỉ cần thông báo cho khách hàng'], correctIndex: 1, explanation: 'Dữ liệu mới có thể mang thiên lệch mới; công bằng/giải thích phải được kiểm lại mỗi vòng tái huấn luyện, không phải việc làm một lần.' },
  { id: 'q3', question: 'Sự khác biệt chính giữa "xong" ở MCL201 và "xong" trong MLOps kinh doanh là gì?', options: ['Không khác gì cả', 'MCL201: điểm test set tốt; kinh doanh: mô hình còn hành xử đúng SAU triển khai, liên tục', 'Kinh doanh không cần đánh giá mô hình', 'MCL201 không dùng test set'], correctIndex: 1, explanation: 'Kinh doanh cần một vòng lặp giám sát-tái huấn luyện liên tục, vì môi trường thật thay đổi sau khi mô hình đã triển khai.' },
]);

const c3 = doc('mla301-3-1-bias', '3.1 — Data & algorithmic bias|||3.1 — Thiên lệch dữ liệu & thuật toán',
  'Nguồn thiên lệch: lịch sử, mẫu lấy, đo lường, nhãn; biến đại diện (proxy) cho thuộc tính nhạy cảm; vòng lặp phản hồi (feedback loop) khuếch đại thiên lệch.',
  [[
    `<span class="eyebrow">MLA301 · Chapter 3 · Lesson 3.1</span>
<h2>Data &amp; algorithmic bias</h2>
<h3>Where bias comes from</h3>
<ul>
<li><strong>Historical bias</strong> — the world the data was collected from was already unequal (e.g. past hiring favored one group), so the "ground truth" itself encodes the inequality.</li>
<li><strong>Sampling bias</strong> — some groups are under-represented in the training data (e.g. a facial-recognition dataset with few dark-skinned faces).</li>
<li><strong>Measurement bias</strong> — the proxy used to measure something differs in quality across groups (e.g. "arrests" as a proxy for "crime" reflects policing patterns, not just criminal behavior).</li>
<li><strong>Label bias</strong> — human labelers bring their own subjective judgment into the "correct answer" the model learns from.</li>
</ul>
<h3>Proxy variables — bias hiding in plain sight</h3>
<p>Even when a sensitive attribute (race, gender) is <strong>removed</strong> from the data, a correlated field can act as a <strong>proxy</strong> — postal code correlating with race, first name correlating with gender, browsing history correlating with income. Removing the column doesn't remove the signal.</p>
<h3>Feedback loops</h3>
<p>A biased model's outputs can become tomorrow's training data. If a predictive-policing model sends more patrols to a neighborhood, that neighborhood generates more recorded arrests, which "confirms" the model was right — a self-reinforcing loop that amplifies the original bias.</p>
<pre><code>Bias amplification loop:
 biased prediction -> biased action (more patrols/less credit)
   -> biased outcome data -> retrain on that data -> MORE biased prediction
</code></pre>
<div class="callout"><span class="badge">Practical rule</span> Before trusting a model, ask what real-world process generated its labels — the model is only as fair as the process it learned from.</div>`,
    `<span class="eyebrow">MLA301 · Chương 3 · Bài 3.1</span>
<h2>Thiên lệch dữ liệu &amp; thuật toán</h2>
<h3>Thiên lệch từ đâu ra</h3>
<ul>
<li><strong>Thiên lệch lịch sử</strong> — thế giới nơi dữ liệu được thu thập đã sẵn bất bình đẳng (vd tuyển dụng trước đây ưu ái một nhóm), nên "nhãn đúng" tự nó đã mang bất bình đẳng.</li>
<li><strong>Thiên lệch mẫu lấy</strong> — một số nhóm bị thiếu đại diện trong dữ liệu huấn luyện (vd bộ dữ liệu nhận diện khuôn mặt có ít khuôn mặt da tối).</li>
<li><strong>Thiên lệch đo lường</strong> — biến đại diện dùng để đo một thứ có chất lượng khác nhau giữa các nhóm (vd "số vụ bị bắt" làm đại diện cho "tội phạm" phản ánh cách tuần tra, không chỉ hành vi phạm tội).</li>
<li><strong>Thiên lệch nhãn</strong> — người gán nhãn mang phán đoán chủ quan riêng vào "câu trả lời đúng" mà mô hình học theo.</li>
</ul>
<h3>Biến đại diện (proxy) — thiên lệch ẩn ngay trước mắt</h3>
<p>Ngay cả khi thuộc tính nhạy cảm (chủng tộc, giới) đã bị <strong>bỏ</strong> khỏi dữ liệu, một trường tương quan vẫn có thể làm <strong>đại diện</strong> — mã bưu điện tương quan với chủng tộc, tên tương quan với giới, lịch sử duyệt web tương quan với thu nhập. Xoá cột không xoá được tín hiệu.</p>
<h3>Vòng lặp phản hồi</h3>
<p>Đầu ra của một mô hình thiên lệch có thể trở thành dữ liệu huấn luyện của ngày mai. Nếu một mô hình dự đoán tuần tra gửi thêm cảnh sát đến một khu vực, khu vực đó sinh ra nhiều vụ bắt được ghi nhận hơn, việc này "xác nhận" mô hình đã đúng — một vòng lặp tự củng cố khuếch đại thiên lệch ban đầu.</p>
<pre><code>Vòng khuếch đại thiên lệch:
 dự đoán thiên lệch -> hành động thiên lệch (tuần tra nhiều hơn/ít tín dụng hơn)
   -> dữ liệu kết quả thiên lệch -> tái huấn luyện trên đó -> dự đoán CÀNG thiên lệch
</code></pre>
<div class="callout"><span class="badge">Quy tắc thực tế</span> Trước khi tin một mô hình, hỏi quy trình thực tế nào đã sinh ra nhãn của nó — mô hình chỉ công bằng bằng đúng quy trình mà nó học theo.</div>`,
  ]]);

const c3q = quiz('mla301-quiz-3', 'Quiz 3 — Bias|||Quiz 3 — Thiên lệch', [
  { id: 'q1', question: 'Vì sao xoá cột "chủng tộc"/"giới tính" khỏi dữ liệu không đủ để loại bỏ thiên lệch?', options: ['Vì mô hình luôn cần đủ cột để chạy', 'Vì các trường khác (mã bưu điện, tên...) có thể là biến đại diện (proxy) tương quan với thuộc tính đó', 'Vì xoá cột làm mô hình chậm hơn', 'Vì dữ liệu sẽ bị thiếu giá trị'], correctIndex: 1, explanation: 'Biến đại diện mang tín hiệu tương quan với thuộc tính nhạy cảm dù thuộc tính đó không còn trong dữ liệu.' },
  { id: 'q2', question: 'Vòng lặp phản hồi (feedback loop) làm thiên lệch tệ hơn như thế nào?', options: ['Nó không liên quan đến thiên lệch', 'Đầu ra thiên lệch tạo ra hành động, hành động tạo ra dữ liệu mới cũng thiên lệch, rồi mô hình tái huấn luyện trên dữ liệu đó', 'Nó chỉ làm mô hình chạy nhanh hơn', 'Nó chỉ xảy ra khi dùng deep learning'], correctIndex: 1, explanation: 'Dự đoán thiên lệch dẫn tới hành động thiên lệch, sinh dữ liệu mới cũng thiên lệch — một vòng tự củng cố qua các lần tái huấn luyện.' },
  { id: 'q3', question: '"Thiên lệch đo lường" (measurement bias) trong ví dụ "số vụ bị bắt" làm đại diện cho "tội phạm" nghĩa là gì?', options: ['Số liệu luôn chính xác tuyệt đối', 'Số vụ bị bắt phản ánh CÁCH tuần tra, không chỉ hành vi phạm tội thật', 'Không có gì để lo ngại', 'Đây là lỗi kỹ thuật của cảm biến'], correctIndex: 1, explanation: 'Biến đại diện có chất lượng khác nhau giữa các nhóm — nơi bị tuần tra nhiều hơn sẽ có nhiều vụ bắt được ghi nhận hơn, không nhất thiết vì tội phạm nhiều hơn.' },
]);

const c4 = doc('mla301-4-1-fairness', '4.1 — Fairness & fairness metrics|||4.1 — Công bằng & các chỉ số đo lường',
  'Ngang bằng nhân khẩu (demographic parity), cơ hội ngang bằng (equal opportunity), tỉ lệ dự đoán ngang bằng (equalized odds), predictive parity; đánh đổi công bằng-chính xác.',
  [[
    `<span class="eyebrow">MLA301 · Chapter 4 · Lesson 4.1</span>
<h2>Fairness &amp; fairness metrics</h2>
<h3>Four common metrics</h3>
<ul>
<li><strong>Demographic parity</strong> — the positive-outcome rate (e.g. loan approved) is the same across groups, regardless of true qualification.</li>
<li><strong>Equal opportunity</strong> — among people who <em>truly qualify</em> (true positives), the approval rate is the same across groups (equal true-positive rate).</li>
<li><strong>Equalized odds</strong> — both the true-positive rate AND the false-positive rate are equal across groups — a stricter version of equal opportunity.</li>
<li><strong>Predictive parity</strong> — among people the model <em>approved</em>, the same fraction actually qualifies across groups (equal precision).</li>
</ul>
<h3>You (usually) can't satisfy all of them at once</h3>
<p>When base rates differ between groups (e.g. group A and group B have different real qualification rates), it's mathematically proven you generally cannot satisfy demographic parity, equalized odds, AND predictive parity simultaneously — the <strong>impossibility result</strong>. The team must pick which fairness definition matches the business/legal context.</p>
<pre><code>Toy check for demographic parity (business pseudocode):
approval_rate_A = approved_A / total_A
approval_rate_B = approved_B / total_B
gap = abs(approval_rate_A - approval_rate_B)
# gap close to 0 -> demographic parity holds
</code></pre>
<h3>Fairness vs. accuracy</h3>
<p>Enforcing a fairness constraint can lower raw accuracy — that's not a bug, it's the intended trade-off. The business decision is <em>how much</em> accuracy to trade for <em>how much</em> fairness, made explicitly and documented, not left as an accident of the data.</p>
<div class="callout"><span class="badge">Tool</span> <strong>Fairlearn</strong> computes these metrics and offers mitigation techniques (reweighting, threshold adjustment per group) directly on scikit-learn models.</div>`,
    `<span class="eyebrow">MLA301 · Chương 4 · Bài 4.1</span>
<h2>Công bằng &amp; các chỉ số đo lường</h2>
<h3>Bốn chỉ số thường dùng</h3>
<ul>
<li><strong>Ngang bằng nhân khẩu (demographic parity)</strong> — tỉ lệ kết quả tích cực (vd được duyệt vay) bằng nhau giữa các nhóm, không phân biệt đủ điều kiện thật hay không.</li>
<li><strong>Cơ hội ngang bằng (equal opportunity)</strong> — trong số người <em>thật sự đủ điều kiện</em> (true positive), tỉ lệ được duyệt bằng nhau giữa các nhóm (tỉ lệ true-positive bằng nhau).</li>
<li><strong>Tỉ lệ dự đoán ngang bằng (equalized odds)</strong> — CẢ tỉ lệ true-positive VÀ tỉ lệ false-positive bằng nhau giữa các nhóm — chặt hơn equal opportunity.</li>
<li><strong>Predictive parity</strong> — trong số người mô hình <em>duyệt</em>, tỉ lệ thật sự đủ điều kiện bằng nhau giữa các nhóm (precision bằng nhau).</li>
</ul>
<h3>Thường KHÔNG thoả được tất cả cùng lúc</h3>
<p>Khi tỉ lệ nền (base rate) khác nhau giữa các nhóm (vd nhóm A và nhóm B có tỉ lệ đủ điều kiện thật khác nhau), đã được chứng minh toán học rằng nói chung không thể thoả cả demographic parity, equalized odds, VÀ predictive parity đồng thời — <strong>kết quả bất khả</strong> (impossibility result). Nhóm phải chọn định nghĩa công bằng nào khớp với ngữ cảnh kinh doanh/pháp lý.</p>
<pre><code>Kiểm demographic parity đơn giản (giả mã kinh doanh):
tile_duyet_A = so_duyet_A / tong_A
tile_duyet_B = so_duyet_B / tong_B
chenh_lech = abs(tile_duyet_A - tile_duyet_B)
# chenh_lech gần 0 -> đạt demographic parity
</code></pre>
<h3>Công bằng vs. độ chính xác</h3>
<p>Áp ràng buộc công bằng có thể làm giảm độ chính xác thô — đó không phải lỗi, mà là đánh đổi có chủ đích. Quyết định kinh doanh là <em>đánh đổi bao nhiêu</em> độ chính xác để lấy <em>bao nhiêu</em> công bằng, được nêu rõ và ghi lại, không phải để mặc cho dữ liệu quyết định ngẫu nhiên.</p>
<div class="callout"><span class="badge">Công cụ</span> <strong>Fairlearn</strong> tính các chỉ số này và cung cấp kỹ thuật giảm thiên lệch (cân lại trọng số, chỉnh ngưỡng theo nhóm) trực tiếp trên mô hình scikit-learn.</div>`,
  ]]);

const c4q = quiz('mla301-quiz-4', 'Quiz 4 — Fairness metrics|||Quiz 4 — Chỉ số công bằng', [
  { id: 'q1', question: '"Demographic parity" yêu cầu điều gì?', options: ['Độ chính xác bằng nhau giữa các nhóm', 'Tỉ lệ kết quả tích cực (vd duyệt vay) bằng nhau giữa các nhóm', 'Dữ liệu huấn luyện có cùng kích thước', 'Mô hình phải là cây quyết định'], correctIndex: 1, explanation: 'Demographic parity chỉ nhìn vào tỉ lệ kết quả tích cực giữa các nhóm, không quan tâm ai thật sự đủ điều kiện.' },
  { id: 'q2', question: '"Kết quả bất khả" (impossibility result) trong công bằng ML nói gì?', options: ['Không thể đo được công bằng', 'Khi tỉ lệ nền khác nhau giữa nhóm, thường không thể thoả nhiều định nghĩa công bằng cùng lúc', 'Mô hình ML không bao giờ công bằng', 'Chỉ áp dụng cho deep learning'], correctIndex: 1, explanation: 'Khi base rate khác nhau giữa các nhóm, về mặt toán học thường không thể đồng thời thoả demographic parity, equalized odds và predictive parity.' },
  { id: 'q3', question: 'Khi áp ràng buộc công bằng làm giảm độ chính xác thô, điều đó có nghĩa là gì?', options: ['Mô hình bị lỗi kỹ thuật', 'Đây là đánh đổi có chủ đích, cần được quyết định và ghi lại rõ ràng', 'Phải huỷ bỏ ràng buộc công bằng ngay', 'Dữ liệu bị hỏng'], correctIndex: 1, explanation: 'Đánh đổi công bằng-chính xác là chuyện bình thường và cần được nhóm kinh doanh/pháp lý quyết định rõ ràng, không phải để ngẫu nhiên xảy ra.' },
]);

const c5 = doc('mla301-5-1-explainability', '5.1 — Explainability (XAI): SHAP & LIME|||5.1 — Giải thích được (XAI): SHAP & LIME',
  'Giải thích toàn cục vs cục bộ; mô hình diễn giải được sẵn vs hộp đen; SHAP (giá trị Shapley), LIME (mô hình cục bộ đơn giản); model card.',
  [[
    `<span class="eyebrow">MLA301 · Chapter 5 · Lesson 5.1</span>
<h2>Explainability (XAI): SHAP &amp; LIME</h2>
<h3>Global vs. local explanations</h3>
<ul>
<li><strong>Global</strong> — which features matter most <em>overall</em> for the model (e.g. "income" is the strongest driver of loan approval across all applicants).</li>
<li><strong>Local</strong> — why did the model make <em>this specific</em> decision for <em>this specific</em> customer? This is what a rejected applicant actually wants answered.</li>
</ul>
<h3>Interpretable models vs. black boxes</h3>
<p>A linear regression or a shallow decision tree is <strong>naturally</strong> explainable — you can read the coefficients or the tree path. A gradient-boosted ensemble or a neural network is a <strong>black box</strong> — it can be more accurate but nobody can eyeball why it made a decision. XAI tools exist to explain the black box without giving up its accuracy.</p>
<h3>SHAP — how much did each feature push the decision?</h3>
<p>SHAP (SHapley Additive exPlanations) is grounded in game theory: it splits credit for a prediction fairly among the input features, so each feature gets a signed "contribution" — how many points it pushed the prediction up or down from the baseline.</p>
<pre><code>import shap
explainer = shap.Explainer(model)
shap_values = explainer(X_test[:1])   # explain ONE customer's decision
shap.plots.waterfall(shap_values[0])  # each feature's push, +/-, to the final score
</code></pre>
<h3>LIME — approximate locally with a simple model</h3>
<p>LIME (Local Interpretable Model-agnostic Explanations) perturbs the input slightly around one data point and fits a simple, interpretable model (e.g. linear) to mimic the black box <em>just in that neighborhood</em> — giving a local explanation for any model type.</p>
<div class="callout"><span class="badge">Business use</span> A model card should state, for each key decision type, how a customer can get a plain-language explanation of their specific outcome — a growing legal requirement, not just good practice (see Chapter 7).</div>`,
    `<span class="eyebrow">MLA301 · Chương 5 · Bài 5.1</span>
<h2>Giải thích được (XAI): SHAP &amp; LIME</h2>
<h3>Giải thích toàn cục vs. cục bộ</h3>
<ul>
<li><strong>Toàn cục</strong> — đặc trưng nào quan trọng nhất <em>nói chung</em> với mô hình (vd "thu nhập" là yếu tố mạnh nhất quyết định duyệt vay với mọi người nộp hồ sơ).</li>
<li><strong>Cục bộ</strong> — vì sao mô hình ra <em>quyết định cụ thể này</em> cho <em>khách hàng cụ thể này</em>? Đây mới là điều một người bị từ chối thật sự muốn biết.</li>
</ul>
<h3>Mô hình diễn giải được sẵn vs. hộp đen</h3>
<p>Hồi quy tuyến tính hay cây quyết định nông thì <strong>tự nhiên</strong> giải thích được — đọc trực tiếp hệ số hoặc đường đi trên cây. Một ensemble gradient boosting hay mạng nơ-ron là <strong>hộp đen</strong> — có thể chính xác hơn nhưng không ai nhìn ra ngay vì sao nó ra quyết định. Công cụ XAI ra đời để giải thích hộp đen mà không phải hy sinh độ chính xác.</p>
<h3>SHAP — mỗi đặc trưng đẩy quyết định bao nhiêu?</h3>
<p>SHAP (SHapley Additive exPlanations) dựa trên lý thuyết trò chơi: nó chia công bằng "công trạng" của một dự đoán cho các đặc trưng đầu vào, mỗi đặc trưng nhận một "đóng góp" có dấu — đẩy dự đoán lên hay xuống bao nhiêu so với mức nền.</p>
<pre><code>import shap
explainer = shap.Explainer(model)
shap_values = explainer(X_test[:1])   # giải thích quyết định của MỘT khách hàng
shap.plots.waterfall(shap_values[0])  # mỗi đặc trưng đẩy +/- bao nhiêu tới điểm cuối
</code></pre>
<h3>LIME — xấp xỉ cục bộ bằng mô hình đơn giản</h3>
<p>LIME (Local Interpretable Model-agnostic Explanations) nhiễu nhẹ dữ liệu đầu vào quanh một điểm dữ liệu và khớp một mô hình đơn giản, diễn giải được (vd tuyến tính) để bắt chước hộp đen <em>chỉ trong vùng lân cận đó</em> — cho ra giải thích cục bộ với bất kỳ loại mô hình nào.</p>
<div class="callout"><span class="badge">Ứng dụng kinh doanh</span> Một model card nên nêu rõ, với mỗi loại quyết định quan trọng, khách hàng có thể nhận giải thích bằng lời thường về kết quả của riêng họ ra sao — đây là yêu cầu pháp lý ngày càng phổ biến, không chỉ là thực hành tốt (xem Chương 7).</div>`,
  ]]);

const c5q = quiz('mla301-quiz-5', 'Quiz 5 — Explainability|||Quiz 5 — Giải thích được', [
  { id: 'q1', question: 'Sự khác biệt giữa giải thích "toàn cục" và "cục bộ" là gì?', options: ['Không có gì khác biệt', 'Toàn cục: đặc trưng nào quan trọng nói chung; cục bộ: vì sao ra quyết định cho MỘT trường hợp cụ thể', 'Toàn cục chỉ dùng cho ảnh, cục bộ chỉ dùng cho văn bản', 'Cục bộ luôn chính xác hơn toàn cục'], correctIndex: 1, explanation: 'Giải thích toàn cục nhìn hành vi chung của mô hình; giải thích cục bộ trả lời vì sao một quyết định cụ thể được đưa ra.' },
  { id: 'q2', question: 'SHAP dựa trên nền tảng nào để chia công trạng cho các đặc trưng?', options: ['Lý thuyết trò chơi (giá trị Shapley)', 'Thống kê Bayes', 'Mạng nơ-ron tích chập', 'Phân tích cú pháp ngôn ngữ'], correctIndex: 0, explanation: 'SHAP dùng giá trị Shapley từ lý thuyết trò chơi để chia đóng góp công bằng cho mỗi đặc trưng.' },
  { id: 'q3', question: 'LIME giải thích một dự đoán bằng cách nào?', options: ['Đọc trực tiếp trọng số của mạng nơ-ron', 'Nhiễu nhẹ dữ liệu quanh một điểm và khớp một mô hình đơn giản chỉ trong vùng lân cận đó', 'Xoá ngẫu nhiên các cột dữ liệu', 'Chạy lại toàn bộ quy trình huấn luyện'], correctIndex: 1, explanation: 'LIME xấp xỉ hành vi hộp đen bằng một mô hình đơn giản, diễn giải được, chỉ đúng trong vùng lân cận của điểm cần giải thích.' },
]);

const c6 = doc('mla301-6-1-privacy', '6.1 — Privacy, data security & compliance|||6.1 — Quyền riêng tư, bảo mật dữ liệu & tuân thủ',
  'Dữ liệu cá nhân (PII), ẩn danh/giả danh, differential privacy, tối thiểu hoá dữ liệu, sự đồng ý; GDPR và Nghị định 13/2023 Việt Nam.',
  [[
    `<span class="eyebrow">MLA301 · Chapter 6 · Lesson 6.1</span>
<h2>Privacy, data security &amp; compliance</h2>
<h3>Personally identifiable information (PII)</h3>
<p>Any field that can identify a person, alone or combined with others: name, national ID, phone, email, exact address, and — easy to miss — combinations like (birth date + postal code + gender) that can re-identify someone even without a name.</p>
<h3>Anonymization vs. pseudonymization</h3>
<ul>
<li><strong>Pseudonymization</strong> — replace an identifier with a token (customer_id) but keep a mapping somewhere; still counts as personal data because it's reversible.</li>
<li><strong>Anonymization</strong> — remove/aggregate data so no one can be re-identified, even with other data sources; much stronger, but often reduces model usefulness.</li>
</ul>
<h3>Differential privacy</h3>
<p>A mathematical guarantee: add carefully calibrated noise so that a model's output (or a released statistic) barely changes whether or not any single individual's record was included — meaning no one can be singled out from the result, even by someone with extra outside data.</p>
<h3>Data minimization &amp; consent</h3>
<p>Collect and retain only the data actually needed for the stated purpose; explain that purpose to the user and get real, specific consent — not a bundled catch-all.</p>
<h3>Two legal frameworks to know</h3>
<ul>
<li><strong>GDPR</strong> (EU) — the reference standard: consent, right to access/delete, breach notification, and rules for automated decision-making.</li>
<li><strong>Nghị định 13/2023/NĐ-CP</strong> (Vietnam) — the domestic personal data protection decree; applies to any business processing Vietnamese users' personal data, ML systems included.</li>
</ul>
<div class="callout"><span class="badge">Practical link to Ch.3–5</span> Privacy and fairness pull in different directions: removing a sensitive field for privacy can also remove the ability to <em>measure</em> fairness for that group — a real trade-off teams must document.</div>`,
    `<span class="eyebrow">MLA301 · Chương 6 · Bài 6.1</span>
<h2>Quyền riêng tư, bảo mật dữ liệu &amp; tuân thủ</h2>
<h3>Dữ liệu cá nhân (PII)</h3>
<p>Bất kỳ trường nào có thể nhận diện một người, đơn lẻ hoặc kết hợp: họ tên, số CCCD, số điện thoại, email, địa chỉ chính xác, và — dễ bị bỏ sót — tổ hợp như (ngày sinh + mã bưu điện + giới tính) có thể nhận diện lại một người dù không có tên.</p>
<h3>Ẩn danh vs. giả danh</h3>
<ul>
<li><strong>Giả danh (pseudonymization)</strong> — thay định danh bằng một mã (customer_id) nhưng vẫn giữ bảng ánh xạ ở đâu đó; vẫn tính là dữ liệu cá nhân vì có thể khôi phục lại.</li>
<li><strong>Ẩn danh (anonymization)</strong> — xoá/gộp dữ liệu đến mức không ai nhận diện lại được, dù kết hợp với nguồn khác; mạnh hơn hẳn, nhưng thường giảm giá trị sử dụng của mô hình.</li>
</ul>
<h3>Differential privacy</h3>
<p>Một bảo đảm toán học: thêm nhiễu được tính toán cẩn thận sao cho đầu ra của mô hình (hoặc một số liệu được công bố) hầu như không đổi dù bản ghi của một cá nhân bất kỳ có được đưa vào hay không — nghĩa là không ai bị chỉ điểm từ kết quả, ngay cả khi có thêm dữ liệu ngoài.</p>
<h3>Tối thiểu hoá dữ liệu &amp; sự đồng ý</h3>
<p>Chỉ thu thập và lưu giữ dữ liệu thật sự cần cho mục đích đã nêu; giải thích mục đích đó cho người dùng và xin sự đồng ý thật, cụ thể — không phải một điều khoản gộp chung mập mờ.</p>
<h3>Hai khung pháp lý cần biết</h3>
<ul>
<li><strong>GDPR</strong> (EU) — chuẩn tham chiếu: sự đồng ý, quyền truy cập/xoá, thông báo vi phạm, và quy tắc cho quyết định tự động hoá.</li>
<li><strong>Nghị định 13/2023/NĐ-CP</strong> (Việt Nam) — nghị định bảo vệ dữ liệu cá nhân trong nước; áp dụng cho bất kỳ doanh nghiệp nào xử lý dữ liệu cá nhân người dùng Việt Nam, gồm cả hệ thống ML.</li>
</ul>
<div class="callout"><span class="badge">Liên kết thực tế với Ch.3–5</span> Quyền riêng tư và công bằng đôi khi kéo về hai hướng khác nhau: xoá một trường nhạy cảm để bảo vệ riêng tư cũng có thể xoá luôn khả năng <em>đo</em> công bằng cho nhóm đó — một đánh đổi thật cần được ghi lại rõ ràng.</div>`,
  ]]);

const c6q = quiz('mla301-quiz-6', 'Quiz 6 — Privacy & compliance|||Quiz 6 — Quyền riêng tư & tuân thủ', [
  { id: 'q1', question: 'Vì sao "giả danh" (pseudonymization) vẫn được tính là dữ liệu cá nhân?', options: ['Vì nó không dùng mã hoá', 'Vì bảng ánh xạ vẫn tồn tại nên có thể khôi phục lại danh tính', 'Vì nó luôn công khai', 'Vì nó không liên quan đến PII'], correctIndex: 1, explanation: 'Giả danh chỉ thay định danh bằng mã, nhưng còn giữ ánh xạ để đảo ngược — khác với ẩn danh thật sự không thể khôi phục.' },
  { id: 'q2', question: 'Differential privacy đảm bảo điều gì?', options: ['Mô hình luôn chính xác 100%', 'Kết quả hầu như không đổi dù có hay không dữ liệu của một cá nhân cụ thể, nhờ nhiễu được tính toán', 'Dữ liệu được mã hoá bằng RSA', 'Không cần xin sự đồng ý của người dùng'], correctIndex: 1, explanation: 'Nhiễu calib giúp không ai bị nhận diện riêng lẻ từ kết quả công bố, ngay cả khi có thêm dữ liệu ngoài.' },
  { id: 'q3', question: 'Nghị định 13/2023/NĐ-CP liên quan đến điều gì?', options: ['Quy định thuế doanh nghiệp', 'Bảo vệ dữ liệu cá nhân tại Việt Nam, áp dụng cho hệ thống ML xử lý dữ liệu người dùng Việt Nam', 'Tiêu chuẩn an toàn điện', 'Luật sở hữu trí tuệ'], correctIndex: 1, explanation: 'Đây là nghị định bảo vệ dữ liệu cá nhân trong nước, tương tự vai trò của GDPR ở EU, áp dụng cho cả hệ thống ML.' },
]);

const c7 = doc('mla301-7-1-governance', '7.1 — AI governance, legal frameworks & accountability|||7.1 — Quản trị AI, khung pháp lý & trách nhiệm giải trình',
  'EU AI Act (phân theo mức rủi ro), NIST AI RMF (Govern/Map/Measure/Manage), vai trò trách nhiệm, model card & tài liệu hoá.',
  [[
    `<span class="eyebrow">MLA301 · Chapter 7 · Lesson 7.1</span>
<h2>AI governance, legal frameworks &amp; accountability</h2>
<h3>EU AI Act — risk-tiered regulation</h3>
<ul>
<li><strong>Unacceptable risk</strong> — banned outright (e.g. social scoring of citizens, certain manipulative systems).</li>
<li><strong>High risk</strong> — allowed but heavily regulated: credit scoring, hiring, and many systems this course discusses fall here. Requires risk management, data governance, human oversight, and documentation before deployment.</li>
<li><strong>Limited risk</strong> — transparency obligations (e.g. disclose that a user is talking to a chatbot).</li>
<li><strong>Minimal risk</strong> — most other AI systems; no specific legal obligations.</li>
</ul>
<h3>NIST AI RMF — four functions, one loop</h3>
<pre><code>GOVERN  -> set policies, roles, and accountability for AI risk
MAP     -> understand context: who is affected, what could go wrong
MEASURE -> quantify risk (this is where Ch.3-6 metrics plug in: bias, fairness, privacy)
MANAGE  -> act on the measurements: mitigate, monitor, or stop deployment
   ^_____________________________________________________________________|
   (the loop repeats through the model's whole lifecycle, not once at launch)
</code></pre>
<h3>Who is accountable</h3>
<p>Responsibility is shared, not just "the data scientist's fault": the <strong>business owner</strong> who requested the model, the <strong>data science team</strong> that built it, <strong>compliance/legal</strong> that must sign off for high-risk use cases, and <strong>leadership</strong> that approves the risk trade-offs.</p>
<h3>Model cards — the paper trail</h3>
<p>A model card documents: intended use, training data source, known limitations, fairness metrics measured (Ch.4), explainability method available to end users (Ch.5), and the risk tier under EU AI Act / NIST AI RMF. It's the artifact a regulator or auditor asks for first.</p>
<div class="callout"><span class="badge">Why this matters</span> Governance is what turns Chapters 3–6 from "things we checked once" into "things a business can prove it checks, continuously, and who is responsible when it doesn't."</div>`,
    `<span class="eyebrow">MLA301 · Chương 7 · Bài 7.1</span>
<h2>Quản trị AI, khung pháp lý &amp; trách nhiệm giải trình</h2>
<h3>EU AI Act — quy định phân theo mức rủi ro</h3>
<ul>
<li><strong>Rủi ro không thể chấp nhận</strong> — bị cấm hoàn toàn (vd chấm điểm xã hội công dân, một số hệ thống thao túng).</li>
<li><strong>Rủi ro cao</strong> — được phép nhưng quản lý chặt: chấm điểm tín dụng, tuyển dụng, và nhiều hệ thống môn này thảo luận rơi vào đây. Yêu cầu quản lý rủi ro, quản trị dữ liệu, giám sát của con người, và tài liệu hoá trước khi triển khai.</li>
<li><strong>Rủi ro hạn chế</strong> — nghĩa vụ minh bạch (vd phải công bố người dùng đang nói chuyện với chatbot).</li>
<li><strong>Rủi ro tối thiểu</strong> — phần lớn hệ thống AI còn lại; không có nghĩa vụ pháp lý cụ thể.</li>
</ul>
<h3>NIST AI RMF — bốn chức năng, một vòng lặp</h3>
<pre><code>GOVERN  -> đặt chính sách, vai trò và trách nhiệm cho rủi ro AI
MAP     -> hiểu ngữ cảnh: ai bị ảnh hưởng, điều gì có thể sai
MEASURE -> đo lượng rủi ro (đây là chỗ chỉ số Ch.3-6 gắn vào: thiên lệch, công bằng, riêng tư)
MANAGE  -> hành động dựa trên số đo: giảm thiểu, giám sát, hoặc dừng triển khai
   ^________________________________________________________________________|
   (vòng lặp lặp lại suốt vòng đời mô hình, không chỉ một lần lúc ra mắt)
</code></pre>
<h3>Ai chịu trách nhiệm</h3>
<p>Trách nhiệm được chia sẻ, không chỉ "lỗi của data scientist": <strong>chủ sở hữu nghiệp vụ</strong> yêu cầu mô hình, <strong>nhóm data science</strong> dựng nó, <strong>tuân thủ/pháp lý</strong> phải ký duyệt cho trường hợp rủi ro cao, và <strong>ban lãnh đạo</strong> chấp thuận các đánh đổi rủi ro.</p>
<h3>Model card — hồ sơ giấy tờ</h3>
<p>Một model card ghi lại: mục đích sử dụng, nguồn dữ liệu huấn luyện, hạn chế đã biết, chỉ số công bằng đã đo (Ch.4), phương pháp giải thích có sẵn cho người dùng cuối (Ch.5), và mức rủi ro theo EU AI Act / NIST AI RMF. Đây là hồ sơ mà cơ quan quản lý hoặc kiểm toán viên sẽ hỏi đầu tiên.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Quản trị là thứ biến Chương 3–6 từ "những thứ đã kiểm một lần" thành "những thứ doanh nghiệp có thể CHỨNG MINH đang kiểm liên tục, và ai chịu trách nhiệm khi không làm vậy."</div>`,
  ]]);

const c7q = quiz('mla301-quiz-7', 'Quiz 7 — AI governance|||Quiz 7 — Quản trị AI', [
  { id: 'q1', question: 'Theo EU AI Act, hệ thống chấm điểm tín dụng thường rơi vào mức rủi ro nào?', options: ['Rủi ro không thể chấp nhận (bị cấm)', 'Rủi ro cao — được phép nhưng quản lý chặt', 'Rủi ro hạn chế', 'Rủi ro tối thiểu, không cần quan tâm'], correctIndex: 1, explanation: 'Chấm điểm tín dụng và tuyển dụng thường được xếp vào nhóm rủi ro cao, đòi hỏi quản lý rủi ro và tài liệu hoá trước triển khai.' },
  { id: 'q2', question: 'Chức năng "MEASURE" trong NIST AI RMF liên quan trực tiếp đến nội dung chương nào của môn này?', options: ['Chỉ liên quan đến MLOps (Ch.2)', 'Các chỉ số thiên lệch, công bằng, riêng tư đã học ở Ch.3-6', 'Không liên quan đến chương nào', 'Chỉ liên quan đến quy trình tuyển dụng'], correctIndex: 1, explanation: 'MEASURE là bước đo lượng rủi ro — đúng là chỗ các chỉ số bias/fairness/privacy của Ch.3-6 được áp dụng.' },
  { id: 'q3', question: 'Model card dùng để làm gì?', options: ['Tăng tốc huấn luyện mô hình', 'Ghi lại mục đích, dữ liệu, hạn chế, chỉ số công bằng/giải thích và mức rủi ro của mô hình — hồ sơ cho kiểm toán/quản lý', 'Thay thế hoàn toàn việc kiểm tra fairness', 'Chỉ dùng nội bộ, không ai bên ngoài xem'], correctIndex: 1, explanation: 'Model card là tài liệu trách nhiệm giải trình mà cơ quan quản lý hoặc kiểm toán viên sẽ yêu cầu trước tiên.' },
]);

const c8 = doc('mla301-8-1-case-studies', '8.1 — Responsible AI in business practice & case studies|||8.1 — Ứng dụng AI có trách nhiệm trong kinh doanh & tình huống thực tế',
  'Danh sách kiểm tra từ đầu đến cuối; ba tình huống (duyệt vay, tuyển dụng, chatbot); kiểm thử đối kháng (red-teaming) & xử lý sự cố.',
  [[
    `<span class="eyebrow">MLA301 · Chapter 8 · Lesson 8.1</span>
<h2>Responsible AI in business practice &amp; case studies</h2>
<h3>End-to-end checklist</h3>
<pre><code>1. Data:      known sources of bias documented (Ch.3)?
2. Fairness:  which metric fits this use case, and is the gap acceptable (Ch.4)?
3. Explain:   can we produce a plain-language reason for any single decision (Ch.5)?
4. Privacy:   is PII minimized, anonymized where possible, consent obtained (Ch.6)?
5. Governance: risk tier identified, model card written, sign-off obtained (Ch.7)?
6. Monitoring: drift + fairness re-checked on a schedule, not just at launch (Ch.2)?
</code></pre>
<h3>Case study — loan approval</h3>
<p>A bank's model shows high accuracy but a 15-point approval-rate gap between two regions. Applying Ch.4's demographic-parity check surfaces it; Ch.5's SHAP explanation shows "region" is acting as a proxy for income level correlated with historical branch access — a Ch.3 proxy-bias problem, fixable by re-weighting or adding a direct income feature instead.</p>
<h3>Case study — hiring tool</h3>
<p>A resume screener trained on 10 years of hires (mostly one gender in technical roles) will reproduce that pattern (Ch.3 historical bias) unless the training set is rebalanced or a fairness constraint (Ch.4) is applied before deployment — this is literally the Amazon case from Chapter 1, prevented in advance.</p>
<h3>Case study — customer-service chatbot</h3>
<p>Even a "low-risk-looking" chatbot must disclose it's a bot (EU AI Act limited-risk transparency, Ch.7) and must not store more personal data from the conversation than needed for the support ticket (Ch.6 data minimization).</p>
<h3>Red-teaming &amp; incident response</h3>
<p>Before launch, deliberately try to break the model's fairness/privacy guarantees (adversarial testing) rather than waiting for a customer or journalist to find the gap. Have a documented response plan for when a bias or leak IS found in production — who is notified, how fast, and what gets rolled back.</p>
<div class="callout"><span class="badge">Course takeaway</span> Every case above starts as a Chapter-1 business use case and ends up needing Chapters 3–7 — that pipeline, run every time, IS what "responsible AI for business" means in practice.</div>`,
    `<span class="eyebrow">MLA301 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng AI có trách nhiệm trong kinh doanh &amp; tình huống thực tế</h2>
<h3>Danh sách kiểm tra từ đầu đến cuối</h3>
<pre><code>1. Dữ liệu:    các nguồn thiên lệch đã biết được ghi lại chưa (Ch.3)?
2. Công bằng:  chỉ số nào hợp ngữ cảnh này, chênh lệch có chấp nhận được không (Ch.4)?
3. Giải thích: có tạo được lý do bằng lời thường cho từng quyết định cụ thể không (Ch.5)?
4. Riêng tư:   PII đã tối thiểu hoá, ẩn danh khi có thể, đã xin đồng ý chưa (Ch.6)?
5. Quản trị:   đã xác định mức rủi ro, viết model card, có ký duyệt chưa (Ch.7)?
6. Giám sát:   trôi dạt + công bằng có được kiểm lại theo lịch, không chỉ lúc ra mắt (Ch.2)?
</code></pre>
<h3>Tình huống — duyệt vay</h3>
<p>Mô hình của một ngân hàng có độ chính xác cao nhưng chênh lệch tỉ lệ duyệt 15 điểm giữa hai vùng. Kiểm demographic parity ở Ch.4 phát hiện ra; giải thích SHAP ở Ch.5 cho thấy "vùng" đang là biến đại diện cho mức thu nhập tương quan với khả năng tiếp cận chi nhánh trong lịch sử — một vấn đề thiên lệch đại diện ở Ch.3, có thể sửa bằng cân lại trọng số hoặc thêm trực tiếp đặc trưng thu nhập.</p>
<h3>Tình huống — công cụ tuyển dụng</h3>
<p>Một bộ lọc CV huấn luyện trên 10 năm dữ liệu tuyển dụng (chủ yếu một giới trong vai trò kỹ thuật) sẽ lặp lại mẫu đó (thiên lệch lịch sử ở Ch.3) trừ khi tập huấn luyện được cân bằng lại hoặc áp ràng buộc công bằng (Ch.4) trước khi triển khai — đây chính là vụ Amazon ở Chương 1, được ngăn chặn trước.</p>
<h3>Tình huống — chatbot chăm sóc khách hàng</h3>
<p>Ngay cả một chatbot "trông có vẻ rủi ro thấp" cũng phải công bố nó là bot (nghĩa vụ minh bạch rủi ro hạn chế của EU AI Act, Ch.7) và không được lưu nhiều dữ liệu cá nhân từ cuộc trò chuyện hơn mức cần cho phiếu hỗ trợ (tối thiểu hoá dữ liệu ở Ch.6).</p>
<h3>Kiểm thử đối kháng & xử lý sự cố</h3>
<p>Trước khi ra mắt, cố ý tìm cách phá vỡ đảm bảo công bằng/riêng tư của mô hình (kiểm thử đối kháng) thay vì chờ khách hàng hay nhà báo phát hiện lỗ hổng. Có kế hoạch xử lý sự cố được ghi lại rõ cho trường hợp phát hiện thiên lệch hoặc rò rỉ trên production — ai được báo, nhanh thế nào, và cái gì bị rollback.</p>
<div class="callout"><span class="badge">Điều rút ra của môn</span> Mọi tình huống trên đều bắt đầu như một ứng dụng kinh doanh ở Chương 1 và kết thúc cần đến Chương 3–7 — quy trình đó, chạy mỗi lần, CHÍNH LÀ ý nghĩa thực tế của "AI có trách nhiệm cho kinh doanh".</div>`,
  ]]);

const c8q = quiz('mla301-quiz-8', 'Quiz 8 — Case studies|||Quiz 8 — Tình huống thực tế', [
  { id: 'q1', question: 'Trong tình huống duyệt vay, "vùng" hoạt động như thế nào trong mô hình?', options: ['Không ảnh hưởng gì đến kết quả', 'Là biến đại diện (proxy) cho mức thu nhập, gây chênh lệch tỉ lệ duyệt giữa các vùng', 'Là một lỗi nhập liệu cần xoá ngay', 'Là chỉ số đo độ chính xác của mô hình'], correctIndex: 1, explanation: '"Vùng" tương quan với thu nhập lịch sử, khiến mô hình vô tình thiên lệch theo vùng — một ví dụ về thiên lệch biến đại diện từ Ch.3.' },
  { id: 'q2', question: 'Vì sao nên "kiểm thử đối kháng" (red-teaming) trước khi ra mắt mô hình?', options: ['Để tăng tốc huấn luyện', 'Để tự phát hiện lỗ hổng công bằng/riêng tư trước khi khách hàng hoặc nhà báo phát hiện', 'Vì luật bắt buộc phải làm ở mọi trường hợp', 'Để giảm chi phí lưu trữ dữ liệu'], correctIndex: 1, explanation: 'Chủ động tìm lỗ hổng trước khi ra mắt giúp doanh nghiệp sửa trước khi gây hại thật hoặc bị phát hiện công khai.' },
  { id: 'q3', question: 'Theo bài học tổng kết của môn, "AI có trách nhiệm cho kinh doanh" trong thực tế nghĩa là gì?', options: ['Chỉ cần đạt độ chính xác cao nhất có thể', 'Chạy đều đặn quy trình kiểm bias, fairness, giải thích, riêng tư và quản trị cho mỗi ứng dụng kinh doanh', 'Chỉ áp dụng cho mô hình dùng deep learning', 'Là việc riêng của phòng pháp lý, không liên quan đến data science'], correctIndex: 1, explanation: 'Mọi tình huống kinh doanh ở Ch.1 đều cần được chạy qua quy trình kiểm ở Ch.3-7 một cách liên tục — đó là bản chất thực tế của AI có trách nhiệm.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'MLA301',
    slug: 'mla301-machine-learning-and-responsible-ai-for-business-applications',
    title: 'Machine Learning and Responsible AI for Business Applications',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MLA301.webp',
    shortDescription: 'Responsible AI for business ML: quick MLOps review, algorithmic bias, fairness metrics, explainability (SHAP/LIME), privacy & compliance, AI governance (EU AI Act, NIST AI RMF), real case studies. Builds on MCL201.|||AI có trách nhiệm cho ML kinh doanh: ôn nhanh MLOps, thiên lệch dữ liệu/thuật toán, chỉ số công bằng, khả năng giải thích (SHAP/LIME), quyền riêng tư & tuân thủ, quản trị AI (EU AI Act, NIST AI RMF), tình huống thực tế. Xây trên nền MCL201.',
    description: 'Môn <strong>MLA301 — Machine Learning and Responsible AI for Business Applications</strong> (kỳ 5) nhấn vào <strong>AI có trách nhiệm</strong> cho ứng dụng kinh doanh, xây trên nền MCL201 (ML cơ bản). Từ <strong>ML trong kinh doanh</strong> &amp; MLOps → <strong>thiên lệch dữ liệu/thuật toán</strong> → <strong>công bằng &amp; chỉ số</strong> → <strong>giải thích được</strong> (SHAP/LIME) → <strong>quyền riêng tư &amp; tuân thủ</strong> → <strong>quản trị AI</strong> (EU AI Act, NIST AI RMF) → <strong>tình huống thực tế</strong>. Bám giáo trình FLM, song ngữ, có ví dụ mã Python và quiz mỗi chương.',
    whatYouLearn: 'ML trong kinh doanh & rủi ro khi thiếu trách nhiệm; ôn MLOps (giám sát, trôi dạt, tái huấn luyện); nguồn thiên lệch (lịch sử, mẫu, đo lường, nhãn) & biến đại diện; chỉ số công bằng (demographic parity, equal opportunity, equalized odds, predictive parity); giải thích được với SHAP/LIME; PII, ẩn danh, differential privacy, GDPR & Nghị định 13/2023; EU AI Act, NIST AI RMF & model card; danh sách kiểm tra & tình huống kinh doanh thực tế.',
    requirements: 'Đã học ML cơ bản (khuyến nghị MCL201): quy trình huấn luyện/đánh giá mô hình, các thuật toán phổ biến. Biết Python cơ bản để đọc ví dụ SHAP.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao cần AI có trách nhiệm; khác biệt với MCL201; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — ML trong kinh doanh & vì sao cần trách nhiệm|||Chapter 1 — ML in business & why responsible AI', description: 'Ứng dụng kinh doanh, rủi ro thật (COMPAS, Amazon).', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quy trình ML ứng dụng & MLOps kinh doanh|||Chapter 2 — Applied ML pipeline & business MLOps', description: 'Ôn nhanh pipeline; giám sát, drift, tái huấn luyện.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thiên lệch dữ liệu & thuật toán|||Chapter 3 — Data & algorithmic bias', description: 'Nguồn thiên lệch, biến đại diện, vòng lặp phản hồi.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Công bằng & chỉ số đo lường|||Chapter 4 — Fairness & fairness metrics', description: 'Demographic parity, equal opportunity, equalized odds, predictive parity.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Giải thích được (XAI)|||Chapter 5 — Explainability (XAI)', description: 'Toàn cục vs cục bộ, SHAP, LIME.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quyền riêng tư, bảo mật & tuân thủ|||Chapter 6 — Privacy, security & compliance', description: 'PII, ẩn danh, differential privacy, GDPR, Nghị định 13/2023.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quản trị AI & khung pháp lý|||Chapter 7 — AI governance & legal frameworks', description: 'EU AI Act, NIST AI RMF, trách nhiệm giải trình, model card.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng thực tế & tình huống kinh doanh|||Chapter 8 — Business applications & case studies', description: 'Danh sách kiểm tra, tình huống thực tế, red-teaming.', lessons: [c8, c8q] },
  ],
};
