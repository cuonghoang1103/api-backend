/**
 * IS_GRA_ELE — Graduation Elective - Information System (Học phần tự chọn tốt
 * nghiệp — Hệ thống thông tin). Ngành HTTT, FPTU, Kỳ 9.
 *
 * ⚠️ ĐÂY LÀ HỌC PHẦN TỰ CHỌN tốt nghiệp — KHÔNG có nội dung lý thuyết cố định.
 * Khung này hướng dẫn sinh viên CHỌN & TỰ HỌC một chủ đề nâng cao của ngành
 * HTTT + làm mini-project áp dụng, rồi báo cáo/trình bày. 8 "chương" là khung
 * quy trình học tự chọn, không phải 8 khối lý thuyết cứng.
 * Nguồn: Coursera/edX, tài liệu ngành, quy định học phần tự chọn FPTU (FLM).
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; escape < -> &lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('is-gra-ele-0-0-tai-lieu', '📚 Materials &amp; references|||📚 Tài liệu &amp; nguồn học liệu',
  'Trung tâm tài liệu: quy định học phần tự chọn (FLM), nền tảng khoá học mở (Coursera/edX), tài liệu ngành ERP/BI/Cloud/Security, YouTube, công cụ.',
  [[
    `<span class="eyebrow">IS_GRA_ELE · Materials</span>
<h2>Materials &amp; resource hub</h2>
<p class="lead">This is a <strong>graduation elective</strong> — there is no fixed syllabus. Instead of chapters to memorize, you <strong>choose one advanced Information Systems topic</strong>, self-study it, and build an applied mini-project. This hub is your launch pad for finding quality, legal, mostly-free learning materials.</p>
<h3>📘 Course rules &amp; curriculum</h3>
<p>The official rules for graduation electives (credits, deliverables, assessment) and the IS program map are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>🌐 Open course platforms</h3>
<ul>
<li><a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera</a> — university &amp; industry specializations (audit for free)</li>
<li><a href="https://www.edx.org/" target="_blank" rel="noopener">edX</a> — MIT/Harvard/industry courses</li>
<li><a href="https://learn.microsoft.com/" target="_blank" rel="noopener">Microsoft Learn</a> — Azure, Power BI, cloud (free)</li>
<li><a href="https://cloud.google.com/learn/training" target="_blank" rel="noopener">Google Cloud Skills</a> · <a href="https://aws.amazon.com/training/" target="_blank" rel="noopener">AWS Training</a></li>
</ul>
<h3>📗 Domain references</h3>
<ul>
<li><a href="https://learning.sap.com/" target="_blank" rel="noopener">SAP Learning</a> — ERP fundamentals</li>
<li><a href="https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/" target="_blank" rel="noopener">Kimball Group</a> — data warehouse &amp; BI</li>
<li><a href="https://owasp.org/" target="_blank" rel="noopener">OWASP</a> — information security</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GuyInACube" target="_blank" rel="noopener">Guy in a Cube</a> — Power BI &amp; analytics</li>
<li><a href="https://www.youtube.com/@TechWorldwithNana" target="_blank" rel="noopener">TechWorld with Nana</a> — DevOps &amp; cloud</li>
</ul>
<div class="callout"><span class="badge">How to use this course</span> Read the intro, walk the topic map, pick ONE topic that fits your career direction, write a learning contract, then run the study → mini-project → report → present loop. Each chapter is a step in that loop, not a lecture.</div>`,
    `<span class="eyebrow">IS_GRA_ELE · Tài liệu</span>
<h2>Trung tâm tài liệu &amp; nguồn học</h2>
<p class="lead">Đây là <strong>học phần tự chọn tốt nghiệp</strong> — KHÔNG có giáo trình cố định. Thay vì học thuộc các chương, bạn <strong>chọn một chủ đề Hệ thống thông tin nâng cao</strong>, tự học nó, và làm một mini-project áp dụng. Trang này là bệ phóng để tìm học liệu chất lượng, hợp pháp, phần lớn miễn phí.</p>
<h3>📘 Quy định &amp; khung chương trình</h3>
<p>Quy định học phần tự chọn (số tín chỉ, sản phẩm phải nộp, cách chấm) và khung ngành HTTT nằm trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🌐 Nền tảng khoá học mở</h3>
<ul>
<li><a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera</a> — chuyên ngành từ đại học &amp; doanh nghiệp (học audit miễn phí)</li>
<li><a href="https://www.edx.org/" target="_blank" rel="noopener">edX</a> — khoá của MIT/Harvard/doanh nghiệp</li>
<li><a href="https://learn.microsoft.com/" target="_blank" rel="noopener">Microsoft Learn</a> — Azure, Power BI, cloud (miễn phí)</li>
<li><a href="https://cloud.google.com/learn/training" target="_blank" rel="noopener">Google Cloud Skills</a> · <a href="https://aws.amazon.com/training/" target="_blank" rel="noopener">AWS Training</a></li>
</ul>
<h3>📗 Tài liệu chuyên ngành</h3>
<ul>
<li><a href="https://learning.sap.com/" target="_blank" rel="noopener">SAP Learning</a> — nền tảng ERP</li>
<li><a href="https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/" target="_blank" rel="noopener">Kimball Group</a> — kho dữ liệu &amp; BI</li>
<li><a href="https://owasp.org/" target="_blank" rel="noopener">OWASP</a> — an ninh thông tin</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GuyInACube" target="_blank" rel="noopener">Guy in a Cube</a> — Power BI &amp; phân tích dữ liệu</li>
<li><a href="https://www.youtube.com/@TechWorldwithNana" target="_blank" rel="noopener">TechWorld with Nana</a> — DevOps &amp; cloud</li>
</ul>
<div class="callout"><span class="badge">Dùng môn này thế nào</span> Đọc phần giới thiệu, xem bản đồ chủ đề, chọn MỘT chủ đề hợp định hướng nghề, viết learning contract, rồi chạy vòng học → mini-project → báo cáo → trình bày. Mỗi chương là một bước trong vòng đó, không phải một bài giảng.</div>`,
  ]]);

const intro = doc('is-gra-ele-0-1-overview', 'Course introduction: what a graduation elective is|||Giới thiệu môn: học phần tự chọn tốt nghiệp là gì',
  'Học phần tự chọn tốt nghiệp: mục tiêu, cách chọn chủ đề, sản phẩm phải nộp (deliverable), rubric chấm, và vòng học 8 bước.',
  [[
    `<span class="eyebrow">IS_GRA_ELE · Introduction</span>
<h2>What is a graduation elective?</h2>
<p class="lead">A <strong>graduation elective (học phần tự chọn tốt nghiệp)</strong> is a capstone-style course near the end of the Information Systems program. It has <strong>no fixed content</strong>: the goal is to prove you can <strong>learn an advanced topic independently</strong> and apply it — exactly the skill you will need for the rest of your career.</p>
<h3>What you actually do</h3>
<ol>
<li><strong>Choose</strong> one advanced IS topic that fits your career direction.</li>
<li><strong>Contract</strong> — write a learning contract (goals, scope, schedule).</li>
<li><strong>Study</strong> the topic deeply from quality sources.</li>
<li><strong>Build</strong> an applied mini-project.</li>
<li><strong>Report</strong> and present your results.</li>
</ol>
<h3>Deliverables</h3>
<pre><code>1. Learning contract      (goals + scope + weekly plan)
2. Study log / notes      (evidence you actually studied)
3. Mini-project artifact  (code / dashboard / model / config)
4. Written report         (problem, method, result, reflection)
5. Presentation + defense (slides + Q&amp;A)</code></pre>
<h3>How it is graded (typical rubric)</h3>
<pre><code>Topic choice &amp; scope .......... 10%
Depth of self-study ........... 20%
Mini-project (works, applied) . 35%
Report (clarity, honesty) ..... 20%
Presentation &amp; defense ........ 15%</code></pre>
<div class="callout"><span class="badge">Key idea</span> You are NOT graded on picking the hardest topic. You are graded on <strong>a clear scope, honest study, and a working applied result</strong>. A small topic done well beats a huge topic left half-finished.</div>`,
    `<span class="eyebrow">IS_GRA_ELE · Giới thiệu</span>
<h2>Học phần tự chọn tốt nghiệp là gì?</h2>
<p class="lead">Một <strong>học phần tự chọn tốt nghiệp</strong> là môn kiểu đồ án cuối, nằm gần cuối chương trình ngành Hệ thống thông tin. Nó <strong>không có nội dung cố định</strong>: mục tiêu là chứng minh bạn có thể <strong>tự học một chủ đề nâng cao</strong> và áp dụng nó — đúng kỹ năng bạn cần cho cả sự nghiệp về sau.</p>
<h3>Bạn thực sự làm gì</h3>
<ol>
<li><strong>Chọn</strong> một chủ đề HTTT nâng cao hợp định hướng nghề.</li>
<li><strong>Cam kết</strong> — viết learning contract (mục tiêu, phạm vi, lịch học).</li>
<li><strong>Học</strong> chủ đề đó thật sâu từ nguồn chất lượng.</li>
<li><strong>Làm</strong> một mini-project áp dụng.</li>
<li><strong>Báo cáo</strong> và trình bày kết quả.</li>
</ol>
<h3>Sản phẩm phải nộp (deliverable)</h3>
<pre><code>1. Learning contract      (mục tiêu + phạm vi + kế hoạch tuần)
2. Nhật ký/ghi chú học    (bằng chứng đã thực sự học)
3. Sản phẩm mini-project  (mã / dashboard / mô hình / cấu hình)
4. Báo cáo viết           (vấn đề, phương pháp, kết quả, phản tư)
5. Trình bày + phản biện  (slide + hỏi đáp)</code></pre>
<h3>Cách chấm (rubric điển hình)</h3>
<pre><code>Chọn chủ đề &amp; phạm vi ......... 10%
Chiều sâu tự học .............. 20%
Mini-project (chạy, áp dụng) .. 35%
Báo cáo (rõ ràng, trung thực) . 20%
Trình bày &amp; phản biện ......... 15%</code></pre>
<div class="callout"><span class="badge">Ý cốt lõi</span> Bạn KHÔNG được chấm điểm vì chọn chủ đề khó nhất. Bạn được chấm vì <strong>phạm vi rõ, học trung thực, và có kết quả áp dụng chạy được</strong>. Một chủ đề nhỏ làm tốt hơn hẳn một chủ đề khổng lồ bỏ dở.</div>`,
  ]]);

const c1 = doc('is-gra-ele-1-1-choosing', '1.1 — What an elective is &amp; how to choose your topic|||1.1 — Học phần tự chọn &amp; cách chọn chủ đề',
  'Học phần tự chọn khác môn bắt buộc thế nào; ba tiêu chí chọn chủ đề (định hướng nghề, khả thi, có nguồn học); tránh chủ đề quá rộng.',
  [[
    `<span class="eyebrow">IS_GRA_ELE · Chapter 1 · Lesson 1.1</span>
<h2>Choosing a topic that fits your direction</h2>
<h3>Elective vs. required course</h3>
<p>A required course hands you the syllabus; a graduation <strong>elective hands you the responsibility</strong>. Freedom is the point — but freedom without a filter leads to a topic that is too broad, has no learning resources, or has nothing to do with the job you want.</p>
<h3>Three filters for a good topic</h3>
<ul>
<li><strong>Career fit</strong> — does it move you toward a role you actually want (data analyst, ERP consultant, cloud engineer, security)?</li>
<li><strong>Feasibility</strong> — can you get a working result in the time you have, with the machine and tools you own?</li>
<li><strong>Resources</strong> — are there quality courses, docs and datasets you can legally access?</li>
</ul>
<pre><code>Topic scoping test (answer all 4):
 1. In one sentence, what will I be able to DO after?
 2. What is the smallest project that proves it?
 3. Which 3 sources will I learn from?
 4. Can I finish the project in the weeks I have?  (yes/no)
If any answer is fuzzy -> narrow the topic.</code></pre>
<div class="callout"><span class="badge">Common mistake</span> "I will learn Cloud" is not a topic — it is a field. "I will deploy a small web API to Azure App Service with a managed database and CI/CD" is a topic: scoped, testable, finishable.</div>`,
    `<span class="eyebrow">IS_GRA_ELE · Chương 1 · Bài 1.1</span>
<h2>Chọn chủ đề hợp định hướng của bạn</h2>
<h3>Tự chọn khác môn bắt buộc</h3>
<p>Môn bắt buộc giao sẵn giáo trình; học phần <strong>tự chọn giao cho bạn trách nhiệm</strong>. Tự do chính là điểm mấu chốt — nhưng tự do mà không có bộ lọc sẽ dẫn tới chủ đề quá rộng, không có học liệu, hoặc chẳng liên quan gì tới công việc bạn muốn.</p>
<h3>Ba bộ lọc cho một chủ đề tốt</h3>
<ul>
<li><strong>Hợp nghề</strong> — nó có đưa bạn tới gần vai trò bạn thực sự muốn không (chuyên viên phân tích dữ liệu, tư vấn ERP, kỹ sư cloud, an ninh)?</li>
<li><strong>Khả thi</strong> — bạn có ra được kết quả chạy được trong thời gian có, với máy và công cụ đang có không?</li>
<li><strong>Học liệu</strong> — có khoá học, tài liệu và dữ liệu chất lượng, truy cập hợp pháp không?</li>
</ul>
<pre><code>Bài kiểm phạm vi chủ đề (trả lời cả 4):
 1. Một câu: sau khi học xong tôi LÀM được gì?
 2. Dự án nhỏ nhất nào chứng minh được điều đó?
 3. Tôi sẽ học từ 3 nguồn nào?
 4. Tôi làm xong dự án trong số tuần đang có chứ?  (có/không)
Câu nào còn mơ hồ -> thu hẹp chủ đề.</code></pre>
<div class="callout"><span class="badge">Lỗi thường gặp</span> "Tôi sẽ học Cloud" không phải chủ đề — đó là một lĩnh vực. "Tôi sẽ triển khai một web API nhỏ lên Azure App Service kèm database quản lý và CI/CD" mới là chủ đề: có phạm vi, kiểm được, làm xong được.</div>`,
  ]]);

const c1q = quiz('is-gra-ele-quiz-1', 'Quiz 1 — Choosing a topic|||Quiz 1 — Chọn chủ đề', [
  { id: 'q1', question: 'Điểm khác biệt lớn nhất của học phần tự chọn tốt nghiệp so với môn bắt buộc là?', options: ['Không phải nộp gì', 'Sinh viên tự chọn chủ đề và tự chịu trách nhiệm định hướng', 'Không được chấm điểm', 'Chỉ học lý thuyết'], correctIndex: 1, explanation: 'Tự chọn trao quyền và trách nhiệm chọn/định hướng chủ đề cho sinh viên, không có giáo trình cố định.' },
  { id: 'q2', question: 'Đâu KHÔNG phải một trong ba bộ lọc chọn chủ đề tốt?', options: ['Hợp định hướng nghề', 'Khả thi trong thời gian có', 'Có nguồn học liệu chất lượng', 'Là chủ đề khó nhất có thể'], correctIndex: 3, explanation: 'Ba bộ lọc là hợp nghề, khả thi, có học liệu. Chọn chủ đề khó nhất không phải tiêu chí — phạm vi rõ và làm xong mới quan trọng.' },
  { id: 'q3', question: 'Vì sao "Tôi sẽ học Cloud" là một chủ đề tồi?', options: ['Cloud không quan trọng', 'Nó là cả một lĩnh vực, quá rộng, không kiểm/không làm xong được', 'Không có tài liệu', 'Không hợp ngành HTTT'], correctIndex: 1, explanation: 'Đó là một lĩnh vực chứ không phải chủ đề có phạm vi; cần thu hẹp thành mục tiêu cụ thể, kiểm được, làm xong được.' },
]);

const c2 = doc('is-gra-ele-2-1-topic-map', '2.1 — Map of advanced IS topics|||2.1 — Bản đồ các chủ đề HTTT nâng cao',
  'Tổng quan các nhánh nâng cao của HTTT: ERP/SAP, BI &amp; Data Warehouse, Business Analytics, Cloud, DevOps, an ninh HTTT — dùng để chọn.',
  [[
    `<span class="eyebrow">IS_GRA_ELE · Chapter 2 · Lesson 2.1</span>
<h2>The landscape of advanced IS topics</h2>
<p class="lead">Information Systems sits between <strong>business and technology</strong>. Here are the main advanced branches you can pick from — each with what it is and a typical mini-project.</p>
<pre><code>Topic            What it is                         Example mini-project
---------------  --------------------------------  ---------------------------
ERP / SAP        Integrated business software      Model an order-to-cash flow
                 (finance, inventory, sales)        in an ERP sandbox
BI &amp; Data WH     Turn raw data into a warehouse    Build a star-schema + a
                 for reporting                      dashboard over sample sales
Business         Statistics + ML to support        Predict churn / forecast
Analytics        decisions                          demand on a public dataset
Cloud            Run systems on Azure/AWS/GCP      Deploy an app + DB + CI/CD
DevOps           Automate build-test-deploy        Docker + pipeline for a repo
InfoSec          Protect systems &amp; data           Threat-model + fix an app
                                                    against OWASP Top 10</code></pre>
<h3>How to read the map</h3>
<ul>
<li><strong>Closer to business</strong> — ERP, BI, Analytics (great for analyst / consultant roles).</li>
<li><strong>Closer to engineering</strong> — Cloud, DevOps, InfoSec (great for engineer roles).</li>
</ul>
<div class="callout"><span class="badge">Pick one lane</span> You do not need to master the whole map — you pick ONE cell, and go deep. The map exists so your choice is informed, not random.</div>`,
    `<span class="eyebrow">IS_GRA_ELE · Chương 2 · Bài 2.1</span>
<h2>Toàn cảnh các chủ đề HTTT nâng cao</h2>
<p class="lead">Hệ thống thông tin nằm giữa <strong>kinh doanh và công nghệ</strong>. Dưới đây là các nhánh nâng cao chính bạn có thể chọn — kèm mô tả và một mini-project điển hình.</p>
<pre><code>Chủ đề           Là gì                             Ví dụ mini-project
---------------  --------------------------------  ---------------------------
ERP / SAP        Phần mềm doanh nghiệp tích hợp     Mô hình luồng order-to-cash
                 (tài chính, kho, bán hàng)         trong một sandbox ERP
BI &amp; Kho DL      Biến dữ liệu thô thành kho        Dựng star-schema + một
                 dữ liệu để báo cáo                 dashboard trên dữ liệu bán
Business         Thống kê + ML để hỗ trợ           Dự đoán rời bỏ / dự báo
Analytics        ra quyết định                      cầu trên tập dữ liệu công
Cloud            Chạy hệ thống trên Azure/AWS/GCP  Triển khai app + DB + CI/CD
DevOps           Tự động build-test-deploy         Docker + pipeline cho 1 repo
An ninh HTTT     Bảo vệ hệ thống &amp; dữ liệu        Threat-model + vá app theo
                                                    OWASP Top 10</code></pre>
<h3>Đọc bản đồ thế nào</h3>
<ul>
<li><strong>Gần kinh doanh</strong> — ERP, BI, Analytics (hợp vai trò phân tích / tư vấn).</li>
<li><strong>Gần kỹ thuật</strong> — Cloud, DevOps, An ninh (hợp vai trò kỹ sư).</li>
</ul>
<div class="callout"><span class="badge">Chọn một làn</span> Bạn không cần thạo cả bản đồ — bạn chọn MỘT ô, và đào sâu. Bản đồ tồn tại để lựa chọn của bạn có căn cứ, không ngẫu nhiên.</div>`,
  ]]);

const c2q = quiz('is-gra-ele-quiz-2', 'Quiz 2 — Topic map|||Quiz 2 — Bản đồ chủ đề', [
  { id: 'q1', question: 'ERP (như SAP) chủ yếu nói về điều gì?', options: ['Phần mềm doanh nghiệp tích hợp (tài chính, kho, bán hàng)', 'Mô phỏng mạch điện', 'Thiết kế giao diện web', 'Nén ảnh'], correctIndex: 0, explanation: 'ERP là phần mềm tích hợp các quy trình nghiệp vụ doanh nghiệp trong một hệ thống.' },
  { id: 'q2', question: 'Nhánh nào gần với kỹ thuật (engineering) hơn là kinh doanh?', options: ['ERP', 'BI & Data Warehouse', 'Cloud / DevOps / An ninh', 'Business Analytics'], correctIndex: 2, explanation: 'Cloud, DevOps và an ninh nghiêng về kỹ thuật; ERP, BI, Analytics gần nghiệp vụ hơn.' },
  { id: 'q3', question: 'Một mini-project điển hình cho chủ đề BI & Data Warehouse là?', options: ['Vá lỗ hổng OWASP', 'Dựng star-schema + dashboard trên dữ liệu bán hàng', 'Viết pipeline CI/CD', 'Huấn luyện mô hình dự đoán rời bỏ'], correctIndex: 1, explanation: 'BI/DW xoay quanh mô hình hoá dữ liệu (star-schema) và báo cáo/dashboard.' },
]);

const c3 = doc('is-gra-ele-3-1-self-study', '3.1 — Effective self-study &amp; judging sources|||3.1 — Tự học hiệu quả &amp; đánh giá nguồn',
  'Kỹ thuật tự học (active recall, spaced, học theo dự án); tiêu chí đánh giá độ tin cậy của nguồn học liệu; tránh nguồn lỗi thời/lệch.',
  [[
    `<span class="eyebrow">IS_GRA_ELE · Chapter 3 · Lesson 3.1</span>
<h2>How to self-study well</h2>
<h3>Study techniques that actually work</h3>
<ul>
<li><strong>Learn by doing</strong> — follow a course while building your project in parallel; theory sticks when applied.</li>
<li><strong>Active recall</strong> — close the tab and re-explain the idea in your own words before moving on.</li>
<li><strong>Spaced repetition</strong> — revisit hard concepts across days, not in one marathon.</li>
<li><strong>Feynman check</strong> — if you cannot explain it simply, you do not understand it yet.</li>
</ul>
<h3>Judging a source before you trust it</h3>
<pre><code>Check     Ask
--------  ------------------------------------------
Authority Who wrote it? Vendor docs, university, or
          a random blog? Do they build the thing?
Currency  How old is it? Cloud/DevOps rot in ~2 yrs.
Bias      Is it selling something? Marketing != docs.
Evidence  Are claims backed by code, data, citations?
Fit       Is it at my level, in scope for my topic?</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Prefer <strong>official docs and reputable courses</strong> as your spine; use blogs and videos to unstick yourself, not as the primary source. Always cross-check a surprising claim against a second source.</div>`,
    `<span class="eyebrow">IS_GRA_ELE · Chương 3 · Bài 3.1</span>
<h2>Tự học sao cho hiệu quả</h2>
<h3>Kỹ thuật học thực sự có tác dụng</h3>
<ul>
<li><strong>Học bằng cách làm</strong> — theo một khoá học đồng thời dựng dự án song song; lý thuyết bám lại khi được áp dụng.</li>
<li><strong>Active recall</strong> — đóng tab lại và tự giải thích ý tưởng bằng lời của mình trước khi đi tiếp.</li>
<li><strong>Ôn ngắt quãng (spaced)</strong> — quay lại các khái niệm khó qua nhiều ngày, đừng dồn một buổi.</li>
<li><strong>Kiểm Feynman</strong> — nếu chưa giải thích được đơn giản thì bạn chưa thực sự hiểu.</li>
</ul>
<h3>Đánh giá một nguồn trước khi tin</h3>
<pre><code>Kiểm      Hỏi
--------  ------------------------------------------
Uy tín    Ai viết? Tài liệu hãng, đại học, hay một
          blog vô danh? Họ có thực sự làm thứ đó?
Cập nhật  Cũ bao lâu? Cloud/DevOps lỗi thời ~2 năm.
Thiên vị  Có đang bán hàng không? Quảng cáo != tài liệu.
Bằng chứng Khẳng định có mã, dữ liệu, trích dẫn không?
Phù hợp   Đúng trình độ, đúng phạm vi chủ đề của tôi?</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> Lấy <strong>tài liệu chính thức và khoá học uy tín</strong> làm xương sống; dùng blog và video để gỡ bí, không dùng làm nguồn chính. Gặp khẳng định lạ thì luôn đối chiếu với một nguồn thứ hai.</div>`,
  ]]);

const c3q = quiz('is-gra-ele-quiz-3', 'Quiz 3 — Self-study|||Quiz 3 — Tự học', [
  { id: 'q1', question: 'Kỹ thuật "active recall" nghĩa là?', options: ['Đọc lại nhiều lần', 'Đóng tài liệu và tự giải thích lại bằng lời của mình', 'Xem video tua nhanh', 'Chép lại nguyên văn'], correctIndex: 1, explanation: 'Active recall là chủ động gợi lại và tự diễn đạt kiến thức, hiệu quả hơn đọc thụ động.' },
  { id: 'q2', question: 'Khi đánh giá độ tin cậy của một nguồn, yếu tố "Currency" (cập nhật) đặc biệt quan trọng với?', options: ['Toán thuần', 'Lịch sử', 'Cloud/DevOps (lỗi thời nhanh ~2 năm)', 'Ngữ pháp'], correctIndex: 2, explanation: 'Công nghệ cloud/DevOps thay đổi nhanh, tài liệu cũ dễ sai; cần kiểm ngày cập nhật.' },
  { id: 'q3', question: 'Nên dùng nguồn nào làm "xương sống" khi tự học một chủ đề kỹ thuật?', options: ['Bình luận mạng xã hội', 'Tài liệu chính thức &amp; khoá học uy tín', 'Một blog vô danh', 'Quảng cáo của hãng'], correctIndex: 1, explanation: 'Tài liệu chính thức và khoá học uy tín làm nền; blog/video chỉ để gỡ bí và cần đối chiếu.' },
]);

const c4 = doc('is-gra-ele-4-1-learning-contract', '4.1 — Study plan &amp; the learning contract|||4.1 — Kế hoạch học &amp; learning contract',
  'Learning contract: mục tiêu SMART, phạm vi, cột mốc theo tuần, tiêu chí "xong"; biến chủ đề thành lịch học cụ thể.',
  [[
    `<span class="eyebrow">IS_GRA_ELE · Chapter 4 · Lesson 4.1</span>
<h2>Turn your topic into a plan</h2>
<p class="lead">A <strong>learning contract</strong> is a short agreement you make with yourself (and your instructor): what you will learn, how far, by when, and how you will prove it. It is the single most useful anti-procrastination tool in a self-directed course.</p>
<h3>SMART goals</h3>
<p>Write goals that are <strong>Specific, Measurable, Achievable, Relevant, Time-bound</strong>. "Understand BI" fails; "Build a 3-dimension star schema and one Power BI dashboard by week 5" passes.</p>
<pre><code>LEARNING CONTRACT (template)
Topic:        _______________________________
Career fit:   why this topic, for which role
Goal (SMART): after this I will be able to ____
Scope IN:     what I WILL cover
Scope OUT:    what I will NOT cover (just as important)
Sources:      1) ____  2) ____  3) ____
Deliverable:  the mini-project artifact
Definition of done:
              [ ] project runs / produces the result
              [ ] report written
              [ ] can demo + answer questions
Weekly plan:  W1 ...  W2 ...  W3 ...  W4 ...  W5 ...</code></pre>
<div class="callout"><span class="badge">Scope OUT matters</span> Beginners forget to write what they will NOT do. Explicitly excluding things is how you keep a graduation elective from swallowing your whole semester.</div>`,
    `<span class="eyebrow">IS_GRA_ELE · Chương 4 · Bài 4.1</span>
<h2>Biến chủ đề thành kế hoạch</h2>
<p class="lead">Một <strong>learning contract</strong> là bản cam kết ngắn bạn ký với chính mình (và giảng viên): sẽ học gì, sâu tới đâu, đến khi nào, và chứng minh bằng cách nào. Đây là công cụ chống trì hoãn hữu ích nhất trong một môn tự định hướng.</p>
<h3>Mục tiêu SMART</h3>
<p>Viết mục tiêu <strong>Cụ thể, Đo được, Khả thi, Liên quan, Có mốc thời gian</strong>. "Hiểu BI" thì trượt; "Dựng một star schema 3 chiều và một dashboard Power BI trước tuần 5" thì đạt.</p>
<pre><code>LEARNING CONTRACT (mẫu)
Chủ đề:       _______________________________
Hợp nghề:     vì sao chủ đề này, cho vai trò nào
Mục tiêu SMART: sau môn này tôi sẽ làm được ____
Phạm vi TRONG: điều tôi SẼ làm
Phạm vi NGOÀI: điều tôi SẼ KHÔNG làm (quan trọng ngang)
Nguồn học:    1) ____  2) ____  3) ____
Sản phẩm:     sản phẩm mini-project
Tiêu chí "xong":
              [ ] dự án chạy / ra được kết quả
              [ ] báo cáo đã viết
              [ ] demo được + trả lời được câu hỏi
Kế hoạch tuần: T1 ...  T2 ...  T3 ...  T4 ...  T5 ...</code></pre>
<div class="callout"><span class="badge">Phạm vi NGOÀI rất quan trọng</span> Người mới hay quên ghi điều mình SẼ KHÔNG làm. Loại trừ rõ ràng chính là cách giữ cho học phần tự chọn không nuốt trọn cả kỳ của bạn.</div>`,
  ]]);

const c4q = quiz('is-gra-ele-quiz-4', 'Quiz 4 — Learning contract|||Quiz 4 — Learning contract', [
  { id: 'q1', question: 'Mục tiêu nào là SMART?', options: ['Hiểu về Cloud', 'Giỏi phân tích dữ liệu', 'Dựng một star schema 3 chiều và một dashboard trước tuần 5', 'Học nhiều thứ về DevOps'], correctIndex: 2, explanation: 'Mục tiêu SMART cần cụ thể, đo được và có mốc thời gian — như câu C.' },
  { id: 'q2', question: 'Vì sao "Phạm vi NGOÀI" (điều SẼ KHÔNG làm) lại quan trọng?', options: ['Để nộp cho đủ giấy tờ', 'Để giữ chủ đề không phình ra vô hạn và làm xong đúng hạn', 'Không quan trọng', 'Để chủ đề khó hơn'], correctIndex: 1, explanation: 'Loại trừ rõ ràng giúp kiểm soát phạm vi, tránh chủ đề nở ra nuốt cả kỳ.' },
  { id: 'q3', question: 'Learning contract KHÔNG bao gồm phần nào sau đây?', options: ['Mục tiêu SMART', 'Kế hoạch theo tuần', 'Tiêu chí "xong"', 'Điểm số của bạn bè cùng lớp'], correctIndex: 3, explanation: 'Learning contract gồm mục tiêu, phạm vi, nguồn, sản phẩm, tiêu chí xong và kế hoạch tuần — không phải điểm người khác.' },
]);

const c5 = doc('is-gra-ele-5-1-deep-research', '5.1 — Deep research on your chosen topic|||5.1 — Nghiên cứu chuyên sâu chủ đề đã chọn',
  'Từ tổng quan xuống chiều sâu: đọc tài liệu gốc, làm lab/hands-on, ghi study log, tổng hợp và phát hiện khoảng trống kiến thức.',
  [[
    `<span class="eyebrow">IS_GRA_ELE · Chapter 5 · Lesson 5.1</span>
<h2>Going deep, not wide</h2>
<p class="lead">With a plan in hand, this is where most of your hours go: <strong>studying the topic deeply enough to build something real</strong>. Depth means you can explain the <em>why</em>, not just copy the <em>how</em>.</p>
<h3>A depth loop</h3>
<ol>
<li><strong>Survey</strong> — one good overview to see the whole shape.</li>
<li><strong>Drill</strong> — pick the sub-concepts your project needs and study those hard.</li>
<li><strong>Hands-on</strong> — do the labs / tutorials with your own hands, not just watch.</li>
<li><strong>Log</strong> — keep a study log: date, what you learned, what confused you.</li>
<li><strong>Synthesize</strong> — write a short summary in your own words; list open questions.</li>
</ol>
<pre><code>STUDY LOG (one row per session)
Date   | Source          | Learned                | Still unclear
------ | --------------- | ---------------------- | -------------
09-01  | MS Learn: DW    | fact vs dimension      | slowly-changing dims
09-03  | Kimball ch.2    | star vs snowflake      | when to snowflake
09-05  | hands-on lab    | built first fact table | naming conventions</code></pre>
<div class="callout"><span class="badge">The gap is the gold</span> The "still unclear" column is not a weakness — it is your research agenda. Closing those gaps one by one is exactly what deep study looks like, and it makes your report honest.</div>`,
    `<span class="eyebrow">IS_GRA_ELE · Chương 5 · Bài 5.1</span>
<h2>Đào sâu, không dàn rộng</h2>
<p class="lead">Có kế hoạch trong tay, đây là nơi phần lớn thời gian của bạn đổ vào: <strong>học chủ đề đủ sâu để làm ra được thứ thật</strong>. Sâu nghĩa là bạn giải thích được <em>vì sao</em>, không chỉ chép lại <em>cách làm</em>.</p>
<h3>Vòng lặp đào sâu</h3>
<ol>
<li><strong>Khảo sát</strong> — một tổng quan tốt để thấy toàn bộ hình dạng.</li>
<li><strong>Khoan sâu</strong> — chọn các khái niệm con mà dự án cần và học thật kỹ.</li>
<li><strong>Thực hành</strong> — tự tay làm lab / tutorial, không chỉ xem.</li>
<li><strong>Ghi nhật ký</strong> — study log: ngày, học được gì, chỗ nào còn rối.</li>
<li><strong>Tổng hợp</strong> — viết tóm tắt ngắn bằng lời của mình; liệt kê câu hỏi mở.</li>
</ol>
<pre><code>STUDY LOG (mỗi buổi một dòng)
Ngày   | Nguồn           | Học được               | Còn chưa rõ
------ | --------------- | ---------------------- | -------------
09-01  | MS Learn: DW    | fact vs dimension      | chiều biến đổi chậm
09-03  | Kimball ch.2    | star vs snowflake      | khi nào snowflake
09-05  | lab thực hành   | dựng fact table đầu    | quy ước đặt tên</code></pre>
<div class="callout"><span class="badge">Khoảng trống là vàng</span> Cột "còn chưa rõ" không phải điểm yếu — nó là chương trình nghiên cứu của bạn. Lấp từng khoảng trống đúng là hình hài của việc học sâu, và nó làm báo cáo của bạn trung thực.</div>`,
  ]]);

const c5q = quiz('is-gra-ele-quiz-5', 'Quiz 5 — Deep research|||Quiz 5 — Nghiên cứu sâu', [
  { id: 'q1', question: 'Học "sâu" một chủ đề nghĩa là gì?', options: ['Xem thật nhiều video', 'Giải thích được vì sao, không chỉ chép lại cách làm', 'Đọc lướt nhiều chủ đề', 'Học thuộc lòng tài liệu'], correctIndex: 1, explanation: 'Chiều sâu thể hiện ở việc hiểu nguyên nhân/nguyên lý, không chỉ sao chép thao tác.' },
  { id: 'q2', question: 'Cột "còn chưa rõ" trong study log dùng để làm gì?', options: ['Để bỏ trống', 'Làm chương trình nghiên cứu tiếp theo — lấp dần từng khoảng trống', 'Để tính điểm', 'Không có tác dụng'], correctIndex: 1, explanation: 'Ghi lại chỗ chưa hiểu giúp định hướng học tiếp và làm báo cáo trung thực.' },
  { id: 'q3', question: 'Trong vòng lặp đào sâu, "hands-on" nhấn mạnh điều gì?', options: ['Chỉ xem người khác làm', 'Tự tay làm lab/tutorial', 'Đọc thật nhanh', 'Bỏ qua thực hành'], correctIndex: 1, explanation: 'Thực hành bằng chính tay mình giúp kiến thức bám lại và lộ ra chỗ chưa hiểu.' },
]);

const c6 = doc('is-gra-ele-6-1-mini-project', '6.1 — Designing &amp; building the applied mini-project|||6.1 — Thiết kế &amp; làm mini-project áp dụng',
  'Từ mục tiêu tới sản phẩm: chọn phạm vi MVP, kiến trúc đơn giản, mốc tăng dần, kiểm thử, và giữ bằng chứng "chạy được".',
  [[
    `<span class="eyebrow">IS_GRA_ELE · Chapter 6 · Lesson 6.1</span>
<h2>Build something that actually runs</h2>
<p class="lead">The mini-project is where a graduation elective earns its grade. It does not have to be big — it has to <strong>work and clearly apply what you studied</strong>.</p>
<h3>From goal to MVP</h3>
<ul>
<li><strong>MVP first</strong> — define the smallest version that proves the idea, and build that end-to-end before adding anything.</li>
<li><strong>Simple architecture</strong> — the boring, well-documented path beats a clever one you cannot finish or explain.</li>
<li><strong>Increments</strong> — ship a working slice each week; never save integration for the last night.</li>
<li><strong>Test &amp; evidence</strong> — capture screenshots, sample output, and how to reproduce it.</li>
</ul>
<pre><code>Mini-project checklist
[ ] MVP scope written (one paragraph)
[ ] Runs on a clean machine from a README
[ ] Uses the concept from my study (not generic CRUD)
[ ] Has sample input + expected output
[ ] Limitations honestly listed
[ ] Source/config in version control (git)</code></pre>
<div class="callout"><span class="badge">Applied, not academic</span> A dashboard on real-ish data, a deployed API, a working pipeline, a threat-model with fixes — these show application. A slide deck describing a technology you never touched does not.</div>`,
    `<span class="eyebrow">IS_GRA_ELE · Chương 6 · Bài 6.1</span>
<h2>Làm ra thứ thực sự chạy được</h2>
<p class="lead">Mini-project là nơi học phần tự chọn kiếm điểm. Nó không cần to — nó cần <strong>chạy được và áp dụng rõ ràng điều bạn đã học</strong>.</p>
<h3>Từ mục tiêu tới MVP</h3>
<ul>
<li><strong>MVP trước</strong> — xác định phiên bản nhỏ nhất chứng minh được ý tưởng, và làm nó xuyên suốt trước khi thêm gì.</li>
<li><strong>Kiến trúc đơn giản</strong> — con đường "buồn tẻ" nhưng tài liệu đầy đủ hơn hẳn con đường thông minh mà bạn không làm xong hay giải thích được.</li>
<li><strong>Tăng dần</strong> — mỗi tuần ra một lát chạy được; đừng để việc tích hợp tới đêm cuối.</li>
<li><strong>Kiểm thử &amp; bằng chứng</strong> — chụp màn hình, giữ output mẫu, và cách tái lập.</li>
</ul>
<pre><code>Checklist mini-project
[ ] Đã viết phạm vi MVP (một đoạn)
[ ] Chạy được trên máy sạch theo README
[ ] Dùng đúng khái niệm đã học (không phải CRUD chung chung)
[ ] Có input mẫu + output kỳ vọng
[ ] Liệt kê giới hạn một cách trung thực
[ ] Mã/cấu hình nằm trong quản lý phiên bản (git)</code></pre>
<div class="callout"><span class="badge">Áp dụng, không hàn lâm suông</span> Một dashboard trên dữ liệu gần thật, một API đã triển khai, một pipeline chạy được, một threat-model kèm bản vá — đó là áp dụng. Một bộ slide mô tả công nghệ bạn chưa từng đụng thì không.</div>`,
  ]]);

const c6q = quiz('is-gra-ele-quiz-6', 'Quiz 6 — Mini-project|||Quiz 6 — Mini-project', [
  { id: 'q1', question: 'Chiến lược "MVP first" nghĩa là?', options: ['Làm tính năng phức tạp nhất trước', 'Làm phiên bản nhỏ nhất chứng minh ý tưởng, chạy xuyên suốt trước', 'Không cần chạy được', 'Chỉ viết slide'], correctIndex: 1, explanation: 'MVP first: xây phiên bản tối thiểu chạy end-to-end rồi mới mở rộng.' },
  { id: 'q2', question: 'Vì sao nên chọn kiến trúc đơn giản cho mini-project?', options: ['Vì nó luôn nhanh hơn', 'Vì con đường rõ ràng, làm xong và giải thích được quan trọng hơn sự "thông minh"', 'Vì giảng viên yêu cầu', 'Vì không có lựa chọn khác'], correctIndex: 1, explanation: 'Trong thời gian giới hạn, thứ làm xong và giải thích được thắng thứ phức tạp bỏ dở.' },
  { id: 'q3', question: 'Đâu là dấu hiệu của một mini-project "áp dụng" tốt?', options: ['Slide mô tả công nghệ chưa từng đụng', 'Dashboard/API/pipeline chạy được với input mẫu và output kỳ vọng', 'Bài văn dài', 'Danh sách thuật ngữ'], correctIndex: 1, explanation: 'Sản phẩm chạy được, dùng đúng khái niệm đã học, có input/output rõ mới là áp dụng thực sự.' },
]);

const c7 = doc('is-gra-ele-7-1-report', '7.1 — Writing the report &amp; documenting results|||7.1 — Viết báo cáo &amp; tài liệu hoá kết quả',
  'Cấu trúc báo cáo (vấn đề–phương pháp–kết quả–phản tư); trích dẫn nguồn đúng; tài liệu hoá để người khác tái lập; trung thực về giới hạn.',
  [[
    `<span class="eyebrow">IS_GRA_ELE · Chapter 7 · Lesson 7.1</span>
<h2>Write it down so it counts</h2>
<p class="lead">Unwritten work is invisible work. A clear report turns your weeks of study and a running project into something an examiner can understand, trust, and grade.</p>
<h3>A report structure that works</h3>
<pre><code>1. Introduction  - the topic, why you chose it, your goal
2. Background     - the key concepts you studied (in your words)
3. Method         - what you built and how; the tools used
4. Results        - what works, with evidence (screens, output)
5. Discussion     - limitations, what surprised you
6. Reflection     - what you learned; next steps / career link
7. References     - every source, cited properly</code></pre>
<h3>Cite honestly</h3>
<ul>
<li>Every idea, figure, or snippet that is not yours gets a <strong>citation</strong>.</li>
<li>State <strong>limitations</strong> plainly — examiners trust honest reports and probe evasive ones.</li>
<li><strong>Reproducibility</strong> — a reader should be able to re-run your project from your write-up.</li>
</ul>
<div class="callout"><span class="badge">Plagiarism warning</span> Copying text or code without citation is academic misconduct and can fail the course. Quoting and citing a source is not just allowed — it is exactly what scholarship looks like.</div>`,
    `<span class="eyebrow">IS_GRA_ELE · Chương 7 · Bài 7.1</span>
<h2>Viết ra thì nó mới được tính</h2>
<p class="lead">Việc không viết ra là việc vô hình. Một báo cáo rõ ràng biến nhiều tuần học và một dự án chạy được thành thứ mà người chấm hiểu được, tin được, và chấm được.</p>
<h3>Cấu trúc báo cáo hiệu quả</h3>
<pre><code>1. Mở đầu     - chủ đề, vì sao chọn, mục tiêu của bạn
2. Nền tảng   - các khái niệm cốt lõi đã học (bằng lời của bạn)
3. Phương pháp - bạn làm gì và làm thế nào; công cụ dùng
4. Kết quả    - cái gì chạy, kèm bằng chứng (màn hình, output)
5. Bàn luận   - giới hạn, điều gì bất ngờ
6. Phản tư    - học được gì; bước tiếp / liên hệ nghề
7. Tài liệu   - mọi nguồn, trích dẫn đúng cách</code></pre>
<h3>Trích dẫn trung thực</h3>
<ul>
<li>Mọi ý tưởng, hình, hay đoạn mã không phải của bạn đều phải có <strong>trích dẫn</strong>.</li>
<li>Nêu <strong>giới hạn</strong> thẳng thắn — người chấm tin báo cáo trung thực và soi báo cáo né tránh.</li>
<li><strong>Khả năng tái lập</strong> — người đọc phải chạy lại được dự án của bạn từ bản viết.</li>
</ul>
<div class="callout"><span class="badge">Cảnh báo đạo văn</span> Chép chữ hoặc mã mà không trích dẫn là gian lận học thuật, có thể trượt môn. Trích dẫn nguồn không chỉ được phép — đó chính là hình hài của học thuật đàng hoàng.</div>`,
  ]]);

const c7q = quiz('is-gra-ele-quiz-7', 'Quiz 7 — Report|||Quiz 7 — Báo cáo', [
  { id: 'q1', question: 'Phần nào của báo cáo trình bày "cái gì chạy" kèm bằng chứng?', options: ['Mở đầu', 'Nền tảng', 'Kết quả', 'Tài liệu tham khảo'], correctIndex: 2, explanation: 'Phần Kết quả nêu những gì hoạt động, kèm màn hình/output làm bằng chứng.' },
  { id: 'q2', question: 'Vì sao nên nêu giới hạn của dự án một cách thẳng thắn?', options: ['Để bị trừ điểm', 'Người chấm tin báo cáo trung thực và soi kỹ báo cáo né tránh', 'Vì bắt buộc phải dài', 'Không cần thiết'], correctIndex: 1, explanation: 'Trung thực về giới hạn tạo độ tin cậy; né tránh làm người chấm nghi ngờ.' },
  { id: 'q3', question: 'Chép đoạn mã của người khác vào báo cáo mà không trích dẫn là?', options: ['Được phép nếu ngắn', 'Gian lận học thuật, có thể trượt môn', 'Chuyện bình thường', 'Bắt buộc phải làm'], correctIndex: 1, explanation: 'Sao chép không trích dẫn là đạo văn — phải luôn ghi nguồn.' },
]);

const c8 = doc('is-gra-ele-8-1-present-defend', '8.1 — Presenting, defending &amp; the career link|||8.1 — Trình bày, phản biện &amp; liên hệ nghề',
  'Trình bày kết quả (kể chuyện, demo), trả lời phản biện, và biến chủ đề đã học thành lợi thế nghề nghiệp/chứng chỉ (portfolio, certificate).',
  [[
    `<span class="eyebrow">IS_GRA_ELE · Chapter 8 · Lesson 8.1</span>
<h2>Present, defend, and carry it forward</h2>
<h3>Presenting well</h3>
<ul>
<li><strong>Tell a story</strong> — problem, what you did, what you found. Not a wall of bullet points.</li>
<li><strong>Show, do not tell</strong> — a short live (or recorded) demo beats ten slides.</li>
<li><strong>Time it</strong> — rehearse to fit the slot; cut anything that is not the core message.</li>
</ul>
<h3>Defending your work</h3>
<p>Expect questions like <em>"Why this approach?"</em>, <em>"What are the limitations?"</em>, <em>"What would you do with more time?"</em>. Honest, specific answers — including "I did not have time for X" — earn more trust than bluffing.</p>
<h3>Turn it into a career asset</h3>
<pre><code>Study output      ->  Career asset
----------------      -----------------------------
mini-project      ->  portfolio piece / GitHub repo
report            ->  writing sample, talking points
the topic         ->  a certification path:
                       BI/Analytics -> PL-300 (Power BI)
                       Cloud        -> AZ-900 / AWS CCP
                       ERP          -> SAP fundamentals
                       Security     -> Security+ basics</code></pre>
<div class="callout"><span class="badge">The real payoff</span> The grade fades; the skill and the portfolio piece stay. Frame your elective around the role you want next, and you graduate with proof — not just a transcript line.</div>`,
    `<span class="eyebrow">IS_GRA_ELE · Chương 8 · Bài 8.1</span>
<h2>Trình bày, phản biện, và mang nó đi tiếp</h2>
<h3>Trình bày cho tốt</h3>
<ul>
<li><strong>Kể một câu chuyện</strong> — vấn đề, bạn làm gì, tìm ra gì. Đừng là một bức tường gạch đầu dòng.</li>
<li><strong>Cho xem, đừng chỉ nói</strong> — một demo ngắn (trực tiếp hoặc quay sẵn) hơn mười slide.</li>
<li><strong>Canh giờ</strong> — tập cho vừa thời lượng; cắt mọi thứ không phải thông điệp chính.</li>
</ul>
<h3>Phản biện bảo vệ</h3>
<p>Hãy chuẩn bị các câu như <em>"Vì sao chọn cách này?"</em>, <em>"Giới hạn là gì?"</em>, <em>"Có thêm thời gian thì làm gì?"</em>. Câu trả lời trung thực, cụ thể — kể cả "tôi chưa kịp làm X" — được tin hơn là nói vống.</p>
<h3>Biến nó thành lợi thế nghề</h3>
<pre><code>Kết quả học        ->  Tài sản nghề nghiệp
----------------       -----------------------------
mini-project       ->  sản phẩm portfolio / repo GitHub
báo cáo            ->  mẫu viết, ý để nói phỏng vấn
chủ đề đã học      ->  một lộ trình chứng chỉ:
                        BI/Analytics -> PL-300 (Power BI)
                        Cloud        -> AZ-900 / AWS CCP
                        ERP          -> nền tảng SAP
                        An ninh      -> Security+ cơ bản</code></pre>
<div class="callout"><span class="badge">Phần thưởng thật</span> Điểm số phai đi; kỹ năng và sản phẩm portfolio ở lại. Định hình học phần tự chọn quanh vai trò bạn muốn tới, và bạn tốt nghiệp với bằng chứng — không chỉ một dòng bảng điểm.</div>`,
  ]]);

const c8q = quiz('is-gra-ele-quiz-8', 'Quiz 8 — Present &amp; career|||Quiz 8 — Trình bày &amp; nghề', [
  { id: 'q1', question: 'Cách trình bày kết quả hiệu quả nhất là?', options: ['Đọc nguyên slide đầy gạch đầu dòng', 'Kể một câu chuyện và cho xem demo ngắn', 'Nói càng dài càng tốt', 'Không cần chuẩn bị'], correctIndex: 1, explanation: 'Kể chuyện (vấn đề–làm gì–tìm ra gì) kèm demo ngắn thuyết phục hơn tường gạch đầu dòng.' },
  { id: 'q2', question: 'Khi bị hỏi phản biện về giới hạn dự án, nên?', options: ['Nói vống lên cho hoành tráng', 'Trả lời trung thực, cụ thể (kể cả "chưa kịp làm X")', 'Im lặng', 'Đổ lỗi cho công cụ'], correctIndex: 1, explanation: 'Trả lời trung thực, cụ thể tạo tin tưởng hơn là nói vống.' },
  { id: 'q3', question: 'Nếu chủ đề tự chọn của bạn là BI/Analytics, chứng chỉ liên quan gợi ý là?', options: ['AZ-900', 'PL-300 (Power BI)', 'Security+', 'Nền tảng SAP'], correctIndex: 1, explanation: 'PL-300 (Power BI Data Analyst) khớp với hướng BI/Analytics; các chứng chỉ khác hợp hướng khác.' },
]);

export default {
  semester: { code: 'FPTU_Hola9', name: 'Kỳ 9', ordinal: 11 },
  course: {
    courseCode: 'IS_GRA_ELE',
    slug: 'is-gra-ele-graduation-elective-information-system',
    title: 'Graduation Elective - Information System',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IS_GRA_ELE.webp',
    shortDescription: 'Graduation elective for Information Systems: pick one advanced IS topic, self-study it with a learning contract, build an applied mini-project, then present. Bilingual, with method, rubric & quizzes.|||Học phần tự chọn tốt nghiệp ngành HTTT: chọn một chủ đề nâng cao, tự học theo learning contract, làm mini-project áp dụng rồi trình bày. Song ngữ, kèm phương pháp, rubric & quiz.',
    description: 'Môn <strong>IS_GRA_ELE — Graduation Elective - Information System</strong> (kỳ 9, ngành Hệ thống thông tin) là <strong>học phần tự chọn tốt nghiệp</strong> — không có nội dung lý thuyết cố định. Khung này hướng dẫn bạn <strong>chọn &amp; tự học một chủ đề HTTT nâng cao</strong> (ERP/SAP, BI &amp; Data Warehouse, Business Analytics, Cloud, DevOps, an ninh HTTT) rồi làm <strong>mini-project áp dụng</strong> và báo cáo. Đi qua 8 bước: hiểu học phần tự chọn &amp; chọn chủ đề → bản đồ chủ đề → phương pháp tự học &amp; đánh giá nguồn → learning contract → nghiên cứu sâu → làm mini-project → viết báo cáo → trình bày &amp; liên hệ nghề. Song ngữ, có checklist, rubric và quiz mỗi chương.',
    whatYouLearn: 'Phân biệt học phần tự chọn với môn bắt buộc; ba bộ lọc chọn chủ đề (hợp nghề, khả thi, có học liệu); bản đồ chủ đề HTTT nâng cao (ERP, BI/DW, Analytics, Cloud, DevOps, InfoSec); kỹ thuật tự học (active recall, spaced, học theo dự án) &amp; đánh giá độ tin cậy nguồn; viết learning contract với mục tiêu SMART; đào sâu qua study log; thiết kế mini-project MVP áp dụng; viết báo cáo (vấn đề–phương pháp–kết quả–phản tư) &amp; trích dẫn trung thực; trình bày, phản biện và liên hệ chứng chỉ/định hướng nghề.',
    requirements: 'Đã học phần lớn khung ngành Hệ thống thông tin (gần tốt nghiệp). Xem quy định học phần tự chọn &amp; điều kiện tiên quyết trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu &amp; nguồn học|||📚 Materials &amp; references', description: 'Quy định FLM, Coursera/edX, tài liệu ERP/BI/Cloud/Security, YouTube, công cụ.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Học phần tự chọn là gì, deliverable, rubric, vòng học 8 bước.', lessons: [intro] },
    { title: 'Chương 1 — Chọn chủ đề|||Chapter 1 — Choosing a topic', description: 'Tự chọn vs bắt buộc; ba bộ lọc; thu hẹp phạm vi.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Bản đồ chủ đề|||Chapter 2 — Topic map', description: 'ERP, BI/DW, Analytics, Cloud, DevOps, InfoSec.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phương pháp tự học|||Chapter 3 — Self-study', description: 'Active recall, spaced, học theo dự án; đánh giá nguồn.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Learning contract|||Chapter 4 — Learning contract', description: 'Mục tiêu SMART, phạm vi, kế hoạch tuần, tiêu chí xong.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nghiên cứu sâu|||Chapter 5 — Deep research', description: 'Vòng đào sâu, study log, khoảng trống kiến thức.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mini-project|||Chapter 6 — Mini-project', description: 'MVP, kiến trúc đơn giản, tăng dần, kiểm thử.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Viết báo cáo|||Chapter 7 — Report', description: 'Cấu trúc báo cáo, trích dẫn, tái lập, trung thực.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Trình bày &amp; nghề|||Chapter 8 — Present &amp; career', description: 'Kể chuyện + demo, phản biện, portfolio &amp; chứng chỉ.', lessons: [c8, c8q] },
  ],
};
