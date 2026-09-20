/**
 * DX_GRA_ELE — Graduation Elective - Digital Transformation (Học phần tự chọn
 * tốt nghiệp — Chuyển đổi số). ⚠️ HỌC PHẦN TỰ CHỌN: không nội dung cố định.
 * Khung hướng dẫn sinh viên CHỌN & tự học một chủ đề CĐS nâng cao + mini-project.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dx-gra-ele-0-0-tai-lieu', '📚 Materials & references|||📚 Tài liệu tham khảo',
  'Trung tâm tài liệu: sách nền tảng CĐS, báo cáo tư vấn (McKinsey/Gartner), khoá học miễn phí (Coursera/edX), YouTube, công cụ, quy định FPTU.',
  [[
    `<span class="eyebrow">DX_GRA_ELE · Materials</span>
<h2>Materials &amp; resource hub</h2>
<p class="lead">This is a <strong>graduation elective</strong> — there is no fixed syllabus. You <strong>choose one advanced digital-transformation topic</strong>, self-study it against the resources below, and deliver a mini-project. The official course rules &amp; deliverables live on <strong>FLM</strong>; the links here are free and legal.</p>
<h3>📘 Foundational books</h3>
<ul>
<li><a href="https://www.hbs.edu/faculty/Pages/item.aspx?num=45364" target="_blank" rel="noopener"><em>Leading Digital</em> — Westerman, Bonnet &amp; McAfee (MIT/HBR)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Digital_transformation" target="_blank" rel="noopener">Digital transformation — overview &amp; concepts</a></li>
</ul>
<h3>🌐 Reports &amp; official reading</h3>
<ul>
<li><a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights" target="_blank" rel="noopener">McKinsey Digital — insights</a></li>
<li><a href="https://www.gartner.com/en/information-technology/insights/digitalization" target="_blank" rel="noopener">Gartner — digitalization insights</a></li>
<li><a href="https://sloanreview.mit.edu/big-ideas/digital-leadership/" target="_blank" rel="noopener">MIT Sloan Management Review — digital leadership</a></li>
</ul>
<h3>🎓 Free courses</h3>
<ul>
<li><a href="https://www.coursera.org/search?query=digital%20transformation" target="_blank" rel="noopener">Coursera — Digital Transformation</a></li>
<li><a href="https://www.edx.org/search?q=digital%20transformation" target="_blank" rel="noopener">edX — Digital Transformation</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@McKinsey" target="_blank" rel="noopener">McKinsey &amp; Company</a> — strategy &amp; digital</li>
<li><a href="https://www.youtube.com/@Gartner_inc" target="_blank" rel="noopener">Gartner</a> — technology trends</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.notion.so/" target="_blank" rel="noopener">Notion</a> — learning contract, notes &amp; report drafts</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — journey maps, canvases, service blueprints</li>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — prototypes for the mini-project</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Scope</strong> — pick ONE topic aligned to your career direction (Ch. 1–2).</li>
<li><strong>Frame</strong> — choose a method &amp; write a learning contract (Ch. 3–4).</li>
<li><strong>Go deep</strong> — research the topic, then build a mini-project (Ch. 5–6).</li>
<li><strong>Deliver</strong> — write a business case and defend it (Ch. 7–8).</li>
</ol></div>`,
    `<span class="eyebrow">DX_GRA_ELE · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Đây là một <strong>học phần tự chọn tốt nghiệp</strong> — không có giáo trình cố định. Bạn <strong>chọn một chủ đề chuyển đổi số nâng cao</strong>, tự học theo các nguồn dưới đây, và nộp một mini-project. Quy định &amp; sản phẩm bắt buộc của môn nằm trên <strong>FLM</strong>; các liên kết ở đây miễn phí và hợp pháp.</p>
<h3>📘 Sách nền tảng</h3>
<ul>
<li><a href="https://www.hbs.edu/faculty/Pages/item.aspx?num=45364" target="_blank" rel="noopener"><em>Leading Digital</em> — Westerman, Bonnet &amp; McAfee (MIT/HBR)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Digital_transformation" target="_blank" rel="noopener">Chuyển đổi số — tổng quan &amp; khái niệm</a></li>
</ul>
<h3>🌐 Báo cáo &amp; tài liệu chính thức</h3>
<ul>
<li><a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights" target="_blank" rel="noopener">McKinsey Digital — báo cáo &amp; phân tích</a></li>
<li><a href="https://www.gartner.com/en/information-technology/insights/digitalization" target="_blank" rel="noopener">Gartner — phân tích số hoá</a></li>
<li><a href="https://sloanreview.mit.edu/big-ideas/digital-leadership/" target="_blank" rel="noopener">MIT Sloan Management Review — lãnh đạo số</a></li>
</ul>
<h3>🎓 Khoá học miễn phí</h3>
<ul>
<li><a href="https://www.coursera.org/search?query=digital%20transformation" target="_blank" rel="noopener">Coursera — Chuyển đổi số</a></li>
<li><a href="https://www.edx.org/search?q=digital%20transformation" target="_blank" rel="noopener">edX — Chuyển đổi số</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@McKinsey" target="_blank" rel="noopener">McKinsey &amp; Company</a> — chiến lược &amp; số</li>
<li><a href="https://www.youtube.com/@Gartner_inc" target="_blank" rel="noopener">Gartner</a> — xu hướng công nghệ</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.notion.so/" target="_blank" rel="noopener">Notion</a> — learning contract, ghi chú &amp; bản nháp báo cáo</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — bản đồ hành trình, canvas, service blueprint</li>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — prototype cho mini-project</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Khoanh vùng</strong> — chọn MỘT chủ đề bám định hướng nghề (Ch. 1–2).</li>
<li><strong>Đóng khung</strong> — chọn phương pháp &amp; viết learning contract (Ch. 3–4).</li>
<li><strong>Đào sâu</strong> — nghiên cứu chủ đề, rồi làm mini-project (Ch. 5–6).</li>
<li><strong>Bàn giao</strong> — viết business case và phản biện (Ch. 7–8).</li>
</ol></div>`,
  ]]);

const intro = doc('dx-gra-ele-0-1-overview', 'Course introduction: a graduation elective|||Giới thiệu môn: một học phần tự chọn tốt nghiệp',
  'Học phần tự chọn tốt nghiệp là gì; cách chọn chủ đề; sản phẩm bắt buộc (learning contract, báo cáo, mini-project, thuyết trình); rubric chấm.',
  [[
    `<span class="eyebrow">DX_GRA_ELE · Lesson 0.1 · Overview</span>
<h2>A graduation elective — you drive it</h2>
<p class="lead">Unlike a normal course, a <strong>Graduation Elective</strong> has <em>no fixed content</em>. Its purpose is to prove you can <strong>learn an advanced topic on your own</strong> and apply it — exactly what your first job will demand. Here the field is <strong>Digital Transformation (DX)</strong>: using digital technology and data to change how an organization operates and delivers value.</p>
<h3>What you actually do</h3>
<ol>
<li><strong>Choose</strong> one advanced DX topic aligned to your career direction.</li>
<li><strong>Contract</strong> your own learning goals and schedule (a learning contract).</li>
<li><strong>Research</strong> the topic deeply from credible sources.</li>
<li><strong>Build</strong> a mini-project: propose or prototype a DX initiative.</li>
<li><strong>Defend</strong> it in a report + presentation.</li>
</ol>
<h3>Deliverables &amp; rubric</h3>
<pre><code>Deliverable            Weight   What is graded
---------------------  -------  ----------------------------------
Learning contract       10%     clear scope, goals, measurable plan
Topic research report   30%     depth, credible sources, synthesis
Mini-project            30%     relevance, feasibility, execution
Business case           15%     value, cost, risk, ROI reasoning
Presentation + Q&amp;A     15%     clarity, evidence, handling defense
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Narrow beats broad. One well-scoped topic done deeply scores far higher than five topics skimmed. Check the exact weights on <strong>FLM</strong> — they govern, this table is a guide.</div>`,
    `<span class="eyebrow">DX_GRA_ELE · Bài 0.1 · Tổng quan</span>
<h2>Học phần tự chọn — bạn cầm lái</h2>
<p class="lead">Khác với môn thường, <strong>học phần tự chọn tốt nghiệp</strong> <em>không có nội dung cố định</em>. Mục đích là chứng minh bạn có thể <strong>tự học một chủ đề nâng cao</strong> và ứng dụng — đúng thứ công việc đầu tiên đòi hỏi. Ở đây lĩnh vực là <strong>Chuyển đổi số (CĐS)</strong>: dùng công nghệ số và dữ liệu để thay đổi cách một tổ chức vận hành và tạo giá trị.</p>
<h3>Bạn thực sự làm gì</h3>
<ol>
<li><strong>Chọn</strong> một chủ đề CĐS nâng cao bám định hướng nghề.</li>
<li><strong>Cam kết</strong> mục tiêu học và lịch trình của riêng bạn (learning contract).</li>
<li><strong>Nghiên cứu</strong> chủ đề thật sâu từ nguồn đáng tin.</li>
<li><strong>Làm</strong> mini-project: đề xuất hoặc dựng prototype một sáng kiến CĐS.</li>
<li><strong>Phản biện</strong> qua báo cáo + thuyết trình.</li>
</ol>
<h3>Sản phẩm &amp; rubric</h3>
<pre><code>Sản phẩm               Trọng số  Chấm điều gì
---------------------  --------  ----------------------------------
Learning contract        10%     phạm vi rõ, mục tiêu, kế hoạch đo được
Báo cáo nghiên cứu       30%     độ sâu, nguồn tin cậy, tổng hợp
Mini-project             30%     liên quan, khả thi, thực thi
Business case            15%     giá trị, chi phí, rủi ro, lập luận ROI
Thuyết trình + Q&amp;A     15%     rõ ràng, bằng chứng, phản biện
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> Hẹp thắng rộng. Một chủ đề khoanh gọn làm sâu ăn điểm cao hơn nhiều so với năm chủ đề lướt qua. Xem trọng số chính xác trên <strong>FLM</strong> — nó mới có hiệu lực, bảng này chỉ để tham khảo.</div>`,
  ]]);

const c1 = doc('dx-gra-ele-1-1-choosing', '1.1 — What an elective is & how to choose|||1.1 — Học phần tự chọn là gì & cách chọn',
  'Bản chất học phần tự chọn; chọn chủ đề theo định hướng nghề; tiêu chí chọn (đam mê, nhu cầu thị trường, khả thi, có dữ liệu/công cụ).',
  [[
    `<span class="eyebrow">DX_GRA_ELE · Chapter 1 · Lesson 1.1</span>
<h2>What an elective is &amp; how to choose a topic</h2>
<p>An elective trusts you to <strong>set your own direction</strong>. The single most common failure is a topic that is too broad ("AI in business") or has no data/tools you can actually access. Choose against four filters.</p>
<h3>Four filters for a good topic</h3>
<ul>
<li><strong>Career fit</strong> — does it move you toward the role you want (data analyst, product, consulting)?</li>
<li><strong>Market demand</strong> — are companies hiring for or investing in it now?</li>
<li><strong>Feasibility</strong> — can you finish a mini-project in the time given, alone?</li>
<li><strong>Access</strong> — do you have data, a tool, or a real case to work on?</li>
</ul>
<pre><code>Topic-selection worksheet (score each 1-5, keep the highest total)
---------------------------------------------------------------
Candidate topic         Career  Demand  Feasible  Access  Total
----------------------  ------  ------  --------  ------  -----
Data-driven analytics     5       5        4        4      18
Applied AI (chatbot)      4       5        3        3      15
RPA for a real process    4       4        5        4      17
IoT smart-campus          3       3        2        2      10
</code></pre>
<div class="callout"><span class="badge">Advice</span> Pick the topic with the highest total, not the flashiest. "RPA for one real process" you can finish beats "IoT smart-campus" you cannot.</div>`,
    `<span class="eyebrow">DX_GRA_ELE · Chương 1 · Bài 1.1</span>
<h2>Học phần tự chọn là gì &amp; cách chọn chủ đề</h2>
<p>Học phần tự chọn tin bạn <strong>tự đặt hướng đi</strong>. Thất bại phổ biến nhất là chủ đề quá rộng ("AI trong kinh doanh") hoặc không có dữ liệu/công cụ để chạm tới thật. Hãy chọn qua bốn bộ lọc.</p>
<h3>Bốn bộ lọc cho một chủ đề tốt</h3>
<ul>
<li><strong>Hợp nghề</strong> — nó đưa bạn tới vai trò mong muốn không (phân tích dữ liệu, product, tư vấn)?</li>
<li><strong>Nhu cầu thị trường</strong> — doanh nghiệp có đang tuyển/đầu tư vào nó không?</li>
<li><strong>Khả thi</strong> — bạn có làm xong mini-project trong thời gian cho phép, một mình, không?</li>
<li><strong>Tiếp cận được</strong> — bạn có dữ liệu, công cụ, hay một tình huống thật để làm không?</li>
</ul>
<pre><code>Bảng chọn chủ đề (cho điểm 1-5, giữ tổng cao nhất)
---------------------------------------------------------------
Chủ đề ứng viên         Nghề    Cầu     Khả thi   Tiếp cận Tổng
----------------------  ------  ------  --------  ------  -----
Phân tích dữ liệu         5       5        4        4      18
AI ứng dụng (chatbot)     4       5        3        3      15
RPA cho quy trình thật    4       4        5        4      17
IoT smart-campus          3       3        2        2      10
</code></pre>
<div class="callout"><span class="badge">Lời khuyên</span> Chọn chủ đề tổng điểm cao nhất, không phải cái hào nhoáng nhất. "RPA cho một quy trình thật" mà bạn làm xong thắng "IoT smart-campus" mà bạn không làm nổi.</div>`,
  ]]);

const c1q = quiz('dx-gra-ele-quiz-1', 'Quiz 1 — Choosing a topic|||Quiz 1 — Chọn chủ đề', [
  { id: 'q1', question: 'Đặc điểm cốt lõi của học phần tự chọn tốt nghiệp là gì?', options: ['Có giáo trình cố định như môn thường', 'Không nội dung cố định — sinh viên tự chọn & tự học một chủ đề', 'Chỉ thi trắc nghiệm cuối kỳ', 'Giảng viên dạy toàn bộ nội dung'], correctIndex: 1, explanation: 'Học phần tự chọn không có nội dung cố định; sinh viên tự chọn chủ đề và tự học, có sản phẩm/mini-project.' },
  { id: 'q2', question: 'Lỗi phổ biến nhất khi chọn chủ đề là?', options: ['Chọn chủ đề quá hẹp', 'Chọn chủ đề quá rộng hoặc không có dữ liệu/công cụ tiếp cận', 'Chọn chủ đề bám định hướng nghề', 'Chọn chủ đề khả thi'], correctIndex: 1, explanation: 'Chủ đề quá rộng hoặc thiếu dữ liệu/công cụ để làm thật là nguyên nhân thất bại phổ biến nhất.' },
  { id: 'q3', question: 'Khi hai chủ đề cạnh tranh, nên ưu tiên tiêu chí nào để quyết định?', options: ['Chủ đề nghe hào nhoáng nhất', 'Chủ đề có tổng điểm cao nhất trên bốn bộ lọc (nghề/cầu/khả thi/tiếp cận)', 'Chủ đề nhiều người làm nhất', 'Chủ đề khó nhất để gây ấn tượng'], correctIndex: 1, explanation: 'Chọn theo tổng điểm bốn bộ lọc — một chủ đề khả thi làm xong hơn một chủ đề hào nhoáng không hoàn thành được.' },
]);

const c2 = doc('dx-gra-ele-2-1-topic-map', '2.1 — Map of advanced DX topics|||2.1 — Bản đồ chủ đề CĐS nâng cao',
  'Bản đồ 8 nhóm chủ đề: chiến lược CĐS, data-driven & analytics, cloud & nền tảng số, AI ứng dụng, RPA, IoT, quản trị thay đổi số, fintech/e-gov.',
  [[
    `<span class="eyebrow">DX_GRA_ELE · Chapter 2 · Lesson 2.1</span>
<h2>The map of advanced DX topics</h2>
<p>Digital transformation is a field, not a single subject. Use this map to see the landscape, then pick <strong>one</strong> lane to go deep in.</p>
<pre><code>Topic area              What it is                          Career lane
----------------------  ----------------------------------  ------------------
DX strategy             align digital moves to business     strategy / consulting
Data-driven &amp; analytics use data + BI to decide            data analyst / BI
Cloud &amp; platforms      run &amp; scale on cloud services      cloud / DevOps
Applied AI              AI in real business workflows       AI / ML product
Process automation RPA  bots automate repetitive tasks      automation / ops
IoT                     connected devices &amp; sensor data    IoT / embedded
Digital change mgmt     make people adopt the change        change / PM
Fintech / e-government  digital finance &amp; public services  fintech / govtech
</code></pre>
<h3>How to read the map</h3>
<ul>
<li><strong>Business-leaning</strong> topics (strategy, change management, fintech) reward reading + a strong business case.</li>
<li><strong>Tech-leaning</strong> topics (analytics, cloud, AI, RPA, IoT) reward a working prototype.</li>
<li>Every good project ties a <strong>technology</strong> to a <strong>business outcome</strong> — never one without the other.</li>
</ul>
<div class="callout"><span class="badge">Focus</span> This chapter is a survey so you can choose. From Chapter 5 on, everything you do is about the ONE topic you picked here.</div>`,
    `<span class="eyebrow">DX_GRA_ELE · Chương 2 · Bài 2.1</span>
<h2>Bản đồ chủ đề CĐS nâng cao</h2>
<p>Chuyển đổi số là một lĩnh vực, không phải một môn đơn lẻ. Dùng bản đồ này để thấy toàn cảnh, rồi chọn <strong>một</strong> làn để đi sâu.</p>
<pre><code>Nhóm chủ đề             Là gì                               Làn nghề
----------------------  ----------------------------------  ------------------
Chiến lược CĐS          gắn bước đi số với kinh doanh        chiến lược / tư vấn
Dữ liệu &amp; phân tích    dùng dữ liệu + BI để ra quyết định  data analyst / BI
Cloud &amp; nền tảng số    chạy &amp; mở rộng trên dịch vụ cloud  cloud / DevOps
AI ứng dụng             AI trong quy trình kinh doanh thật  AI / ML product
Tự động hoá RPA         bot tự làm việc lặp đi lặp lại       automation / vận hành
IoT                     thiết bị kết nối &amp; dữ liệu cảm biến IoT / nhúng
Quản trị thay đổi số    làm người dùng chấp nhận thay đổi   change / PM
Fintech / e-gov         tài chính số &amp; dịch vụ công         fintech / govtech
</code></pre>
<h3>Cách đọc bản đồ</h3>
<ul>
<li>Chủ đề <strong>thiên kinh doanh</strong> (chiến lược, quản trị thay đổi, fintech) ăn điểm bằng đọc nhiều + business case mạnh.</li>
<li>Chủ đề <strong>thiên công nghệ</strong> (phân tích, cloud, AI, RPA, IoT) ăn điểm bằng prototype chạy được.</li>
<li>Mọi dự án tốt đều gắn một <strong>công nghệ</strong> với một <strong>kết quả kinh doanh</strong> — không bao giờ chỉ có một vế.</li>
</ul>
<div class="callout"><span class="badge">Trọng tâm</span> Chương này là bản khảo sát để bạn chọn. Từ Chương 5 trở đi, mọi thứ bạn làm đều xoay quanh MỘT chủ đề đã chọn ở đây.</div>`,
  ]]);

const c2q = quiz('dx-gra-ele-quiz-2', 'Quiz 2 — Topic map|||Quiz 2 — Bản đồ chủ đề', [
  { id: 'q1', question: 'RPA (Robotic Process Automation) trong chuyển đổi số là gì?', options: ['Robot vật lý lắp ráp trong nhà máy', 'Bot phần mềm tự động hoá các tác vụ lặp đi lặp lại', 'Một loại cơ sở dữ liệu', 'Chiến lược marketing số'], correctIndex: 1, explanation: 'RPA dùng bot phần mềm để tự động hoá các tác vụ số lặp lại, quy tắc rõ ràng — thuộc làn tự động hoá/vận hành.' },
  { id: 'q2', question: 'Một dự án chuyển đổi số tốt luôn gắn công nghệ với điều gì?', options: ['Chỉ với công nghệ mới hơn', 'Một kết quả kinh doanh cụ thể', 'Số lượng dòng code', 'Thương hiệu phần cứng đắt tiền'], correctIndex: 1, explanation: 'Dự án CĐS tốt luôn nối một công nghệ với một kết quả kinh doanh — không có vế nào đứng một mình.' },
  { id: 'q3', question: 'Chủ đề thiên công nghệ (analytics, AI, RPA, IoT) thường ăn điểm cao nhất nhờ?', options: ['Chỉ đọc thật nhiều tài liệu', 'Một prototype/sản phẩm chạy được', 'Trình bày dài nhất', 'Chọn chủ đề rộng nhất'], correctIndex: 1, explanation: 'Chủ đề thiên công nghệ ăn điểm bằng prototype chạy được; chủ đề thiên kinh doanh ăn điểm bằng business case mạnh.' },
]);

const c3 = doc('dx-gra-ele-3-1-frameworks', '3.1 — Frameworks & methods|||3.1 — Khung & phương pháp',
  'Digital maturity model (đo mức trưởng thành số), Agile (làm lặp/tăng dần), Design Thinking (đồng cảm → định nghĩa → ý tưởng → prototype → test).',
  [[
    `<span class="eyebrow">DX_GRA_ELE · Chapter 3 · Lesson 3.1</span>
<h2>Frameworks &amp; methods</h2>
<p>A framework gives your work a backbone graders recognize. Learn three and pick the ones that fit your topic.</p>
<h3>Digital maturity model</h3>
<p>Rates where an organization sits on its digital journey, so you can plan the next step instead of guessing.</p>
<pre><code>Level  Name        Signal
-----  ----------  --------------------------------------
  1    Beginner    manual, paper, siloed data
  2    Emerging    some tools, no integration
  3    Connected   integrated systems, shared data
  4    Data-driven decisions from analytics, automated flows
  5    Digital-first digital is the default operating model
</code></pre>
<h3>Agile</h3>
<p><strong>Iterative &amp; incremental</strong>: deliver a small working slice, get feedback, improve. Perfect for a mini-project — ship something small, then grow it, rather than planning everything up front.</p>
<h3>Design Thinking</h3>
<pre><code>Empathize -> Define -> Ideate -> Prototype -> Test  (then loop)
</code></pre>
<p>Start from a real user's pain, not from the technology. It keeps your DX initiative solving a problem someone actually has.</p>
<div class="callout"><span class="badge">Match method to topic</span> Maturity model → strategy topics. Design Thinking → user-facing initiatives. Agile → how you run the build itself.</div>`,
    `<span class="eyebrow">DX_GRA_ELE · Chương 3 · Bài 3.1</span>
<h2>Khung &amp; phương pháp</h2>
<p>Một khung cho công việc của bạn có xương sống mà người chấm nhận ra. Học ba khung và chọn cái hợp chủ đề.</p>
<h3>Mô hình trưởng thành số (digital maturity)</h3>
<p>Đánh giá tổ chức đang ở đâu trên hành trình số, để bạn hoạch định bước kế tiếp thay vì đoán.</p>
<pre><code>Mức   Tên          Dấu hiệu
-----  ----------  --------------------------------------
  1    Sơ khai      thủ công, giấy tờ, dữ liệu rời rạc
  2    Mới nổi      có vài công cụ, chưa tích hợp
  3    Kết nối      hệ thống tích hợp, dữ liệu dùng chung
  4    Dựa dữ liệu  quyết định từ phân tích, luồng tự động
  5    Số ưu tiên   số là mô hình vận hành mặc định
</code></pre>
<h3>Agile</h3>
<p><strong>Lặp &amp; tăng dần</strong>: giao một lát chạy được nhỏ, lấy phản hồi, cải thiện. Rất hợp mini-project — ship thứ nhỏ rồi lớn dần, thay vì lên kế hoạch tất cả từ đầu.</p>
<h3>Design Thinking</h3>
<pre><code>Đồng cảm -> Định nghĩa -> Ý tưởng -> Prototype -> Kiểm thử  (rồi lặp)
</code></pre>
<p>Bắt đầu từ nỗi đau của người dùng thật, không phải từ công nghệ. Nó giữ cho sáng kiến CĐS của bạn giải một vấn đề có thật.</p>
<div class="callout"><span class="badge">Khớp phương pháp với chủ đề</span> Maturity model → chủ đề chiến lược. Design Thinking → sáng kiến hướng người dùng. Agile → cách bạn chạy phần dựng.</div>`,
  ]]);

const c3q = quiz('dx-gra-ele-quiz-3', 'Quiz 3 — Frameworks|||Quiz 3 — Khung & phương pháp', [
  { id: 'q1', question: 'Digital maturity model dùng để làm gì?', options: ['Đo tốc độ internet', 'Đánh giá tổ chức đang ở mức nào trên hành trình số để hoạch định bước kế tiếp', 'Tính lương nhân viên IT', 'Chọn ngôn ngữ lập trình'], correctIndex: 1, explanation: 'Mô hình trưởng thành số xếp hạng vị trí của tổ chức trên hành trình số, giúp lập kế hoạch bước tiếp theo.' },
  { id: 'q2', question: 'Đặc trưng cốt lõi của Agile là gì?', options: ['Lên kế hoạch toàn bộ từ đầu rồi không đổi', 'Làm lặp & tăng dần — giao lát nhỏ, lấy phản hồi, cải thiện', 'Chỉ làm tài liệu, không code', 'Chỉ một người quyết mọi thứ'], correctIndex: 1, explanation: 'Agile là lặp và tăng dần: giao một lát chạy được nhỏ, lấy phản hồi rồi cải thiện.' },
  { id: 'q3', question: 'Thứ tự đúng của Design Thinking là?', options: ['Prototype → Test → Empathize → Define → Ideate', 'Empathize → Define → Ideate → Prototype → Test', 'Ideate → Empathize → Test → Define → Prototype', 'Define → Test → Ideate → Empathize → Prototype'], correctIndex: 1, explanation: 'Design Thinking: Đồng cảm → Định nghĩa → Ý tưởng → Prototype → Kiểm thử, rồi lặp lại.' },
]);

const c4 = doc('dx-gra-ele-4-1-learning-contract', '4.1 — Self-study & the learning contract|||4.1 — Tự học & learning contract',
  'Kỹ năng tự học có kỷ luật; learning contract (mục tiêu, phạm vi, cột mốc, tiêu chí đạt); lịch tuần; nhật ký học tập.',
  [[
    `<span class="eyebrow">DX_GRA_ELE · Chapter 4 · Lesson 4.1</span>
<h2>Self-study &amp; the learning contract</h2>
<p>The elective is graded partly on <em>how</em> you learn. A <strong>learning contract</strong> is a short document where you commit — to yourself and your examiner — to specific goals, a scope, and a schedule. It turns "I'll study DX" into a plan you can be held to.</p>
<h3>What a learning contract contains</h3>
<pre><code>Section        Example entry
-------------  --------------------------------------------
Topic          RPA for the student-records office
Why            cut a 2-hour manual task; fits my ops career
Learning goals understand RPA tools; model one process
Scope (in)     one process: enrolment-confirmation emails
Scope (out)    no payments, no cross-department bots
Milestones     wk2 research, wk4 prototype, wk6 report
Success        bot runs the process end-to-end on demo data
</code></pre>
<h3>A weekly cadence that works</h3>
<ul>
<li><strong>Read</strong> 2–3 credible sources and note the key idea of each.</li>
<li><strong>Do</strong> one small hands-on step every week (a tutorial, a chart, a prototype slice).</li>
<li><strong>Log</strong> what you learned and what blocked you — this becomes your report's raw material.</li>
</ul>
<div class="callout"><span class="badge">Discipline beats motivation</span> A fixed weekly slot and a visible milestone list carry you when motivation dips. The log is not busywork — it is 30% of your report already written.</div>`,
    `<span class="eyebrow">DX_GRA_ELE · Chương 4 · Bài 4.1</span>
<h2>Tự học &amp; learning contract</h2>
<p>Học phần tự chọn chấm một phần vào <em>cách</em> bạn học. <strong>Learning contract</strong> là một văn bản ngắn bạn cam kết — với chính mình và người chấm — về mục tiêu cụ thể, phạm vi và lịch trình. Nó biến "tôi sẽ học CĐS" thành một kế hoạch bạn phải chịu trách nhiệm.</p>
<h3>Learning contract gồm những gì</h3>
<pre><code>Mục            Ví dụ
-------------  --------------------------------------------
Chủ đề         RPA cho phòng quản lý hồ sơ sinh viên
Vì sao         cắt tác vụ thủ công 2 giờ; hợp nghề vận hành
Mục tiêu học   hiểu công cụ RPA; mô hình hoá một quy trình
Phạm vi (trong) một quy trình: email xác nhận nhập học
Phạm vi (ngoài) không thanh toán, không bot liên phòng
Cột mốc        tuần2 nghiên cứu, tuần4 prototype, tuần6 báo cáo
Tiêu chí đạt   bot chạy trọn quy trình trên dữ liệu demo
</code></pre>
<h3>Nhịp tuần hiệu quả</h3>
<ul>
<li><strong>Đọc</strong> 2–3 nguồn đáng tin và ghi ý chính của mỗi nguồn.</li>
<li><strong>Làm</strong> một bước thực hành nhỏ mỗi tuần (một tutorial, một biểu đồ, một lát prototype).</li>
<li><strong>Ghi nhật ký</strong> những gì học được và điều gì cản trở — đây là nguyên liệu cho báo cáo.</li>
</ul>
<div class="callout"><span class="badge">Kỷ luật thắng cảm hứng</span> Một khung giờ cố định mỗi tuần và danh sách cột mốc nhìn thấy được sẽ đỡ bạn khi cảm hứng cạn. Nhật ký không phải việc vô ích — nó là 30% báo cáo đã viết sẵn.</div>`,
  ]]);

const c4q = quiz('dx-gra-ele-quiz-4', 'Quiz 4 — Learning contract|||Quiz 4 — Learning contract', [
  { id: 'q1', question: 'Learning contract chủ yếu để làm gì?', options: ['Ký hợp đồng lao động với công ty', 'Cam kết mục tiêu, phạm vi và lịch trình tự học cụ thể, đo được', 'Đăng ký bản quyền phần mềm', 'Thay cho báo cáo cuối kỳ'], correctIndex: 1, explanation: 'Learning contract là văn bản cam kết mục tiêu, phạm vi và lịch trình tự học — biến ý định mơ hồ thành kế hoạch đo được.' },
  { id: 'q2', question: 'Vì sao learning contract cần ghi rõ cả "phạm vi ngoài" (scope out)?', options: ['Để báo cáo dài hơn', 'Để chặn phình phạm vi và giữ dự án khả thi trong thời gian cho phép', 'Vì trường bắt buộc mọi mục', 'Để gây ấn tượng với người chấm'], correctIndex: 1, explanation: 'Ghi rõ phần loại trừ giúp chặn scope creep, giữ mini-project đủ nhỏ để hoàn thành đúng hạn.' },
  { id: 'q3', question: 'Nhật ký học tập hằng tuần có giá trị gì với báo cáo cuối?', options: ['Không liên quan gì đến báo cáo', 'Là nguyên liệu thô — phần lớn nội dung báo cáo đã được viết sẵn qua nhật ký', 'Chỉ để nộp cho vui', 'Thay thế hoàn toàn mini-project'], correctIndex: 1, explanation: 'Nhật ký ghi lại điều học được và trở ngại chính là nguyên liệu thô cho báo cáo — coi như đã viết sẵn phần lớn nội dung.' },
]);

const c5 = doc('dx-gra-ele-5-1-deep-research', '5.1 — Deep research on your topic|||5.1 — Nghiên cứu chuyên sâu chủ đề',
  'Câu hỏi nghiên cứu; nguồn tin cậy vs quảng cáo; đọc case study; tổng hợp (không chép); trích dẫn; khoảng trống để dự án lấp.',
  [[
    `<span class="eyebrow">DX_GRA_ELE · Chapter 5 · Lesson 5.1</span>
<h2>Deep research on your chosen topic</h2>
<p>From here on it is one topic only. Research means turning scattered reading into a <strong>synthesis</strong> — your own structured understanding — not a pile of quotes.</p>
<h3>Start with a research question</h3>
<p>Frame one sharp question, e.g. <em>"How can RPA cut manual work in a university admissions office, and what does it cost to run?"</em> Everything you read either answers it or is out of scope.</p>
<h3>Judge your sources</h3>
<pre><code>Trust more                     Trust less / verify
-----------------------------  ------------------------------
peer-reviewed &amp; MIT/HBR       vendor blog selling a product
McKinsey/Gartner reports       anonymous listicles
real case studies with numbers "10x" claims with no method
official docs of the tool      forum opinion, undated posts
</code></pre>
<h3>Synthesize, don't copy</h3>
<ul>
<li>Group findings by <strong>theme</strong>, not by source.</li>
<li>For each theme write <em>your</em> one-line takeaway, then cite who said it.</li>
<li>End by naming the <strong>gap</strong> your mini-project will fill — that is the bridge to Chapter 6.</li>
</ul>
<div class="callout"><span class="badge">Cite as you go</span> Keep a running reference list with links. Reconstructing citations at the end wastes hours and invites plagiarism flags.</div>`,
    `<span class="eyebrow">DX_GRA_ELE · Chương 5 · Bài 5.1</span>
<h2>Nghiên cứu chuyên sâu chủ đề đã chọn</h2>
<p>Từ đây chỉ còn một chủ đề. Nghiên cứu nghĩa là biến những gì đọc rải rác thành một <strong>bản tổng hợp</strong> — hiểu biết có cấu trúc của riêng bạn — không phải một đống trích dẫn.</p>
<h3>Bắt đầu bằng câu hỏi nghiên cứu</h3>
<p>Đặt một câu hỏi sắc, ví dụ <em>"RPA cắt được bao nhiêu việc thủ công ở phòng tuyển sinh, và chi phí vận hành ra sao?"</em> Mọi thứ bạn đọc hoặc trả lời nó hoặc nằm ngoài phạm vi.</p>
<h3>Đánh giá nguồn</h3>
<pre><code>Tin hơn                        Tin ít / phải kiểm chứng
-----------------------------  ------------------------------
bình duyệt &amp; MIT/HBR          blog nhà bán đang bán sản phẩm
báo cáo McKinsey/Gartner       listicle vô danh
case study thật có số liệu     tuyên bố "10x" không có phương pháp
tài liệu chính thức của công cụ ý kiến diễn đàn, bài không ghi ngày
</code></pre>
<h3>Tổng hợp, đừng chép</h3>
<ul>
<li>Gom phát hiện theo <strong>chủ đề</strong>, không theo nguồn.</li>
<li>Với mỗi chủ đề viết ý rút ra <em>của bạn</em> một dòng, rồi trích dẫn ai nói.</li>
<li>Kết bằng việc nêu <strong>khoảng trống</strong> mà mini-project sẽ lấp — đó là cầu nối sang Chương 6.</li>
</ul>
<div class="callout"><span class="badge">Trích dẫn khi đọc</span> Giữ danh sách nguồn kèm link ngay lúc đọc. Dựng lại trích dẫn vào phút chót tốn hàng giờ và dễ bị gắn cờ đạo văn.</div>`,
  ]]);

const c5q = quiz('dx-gra-ele-quiz-5', 'Quiz 5 — Deep research|||Quiz 5 — Nghiên cứu sâu', [
  { id: 'q1', question: 'Nghiên cứu chuyên sâu tốt tạo ra điều gì?', options: ['Một đống trích dẫn chép nguyên văn', 'Một bản tổng hợp có cấu trúc — hiểu biết của riêng bạn, gom theo chủ đề', 'Bản dịch của một bài báo duy nhất', 'Danh sách link không phân tích'], correctIndex: 1, explanation: 'Nghiên cứu là tổng hợp: gom phát hiện theo chủ đề và rút ra ý riêng, không phải xếp trích dẫn.' },
  { id: 'q2', question: 'Nguồn nào NÊN tin cậy hơn khi nghiên cứu CĐS?', options: ['Blog của nhà bán đang bán sản phẩm', 'Case study thật có số liệu và báo cáo McKinsey/Gartner', 'Listicle vô danh không ghi ngày', 'Ý kiến diễn đàn không dẫn nguồn'], correctIndex: 1, explanation: 'Case study có số liệu, tài liệu bình duyệt và báo cáo tư vấn uy tín đáng tin hơn blog quảng cáo hay listicle vô danh.' },
  { id: 'q3', question: 'Phần nghiên cứu nên kết thúc bằng việc nêu điều gì để nối sang mini-project?', options: ['Lời cảm ơn', 'Khoảng trống (gap) mà mini-project sẽ lấp', 'Toàn bộ danh sách trích dẫn', 'Một câu hỏi mới không liên quan'], correctIndex: 1, explanation: 'Nêu khoảng trống mà dự án sẽ lấp chính là cầu nối từ nghiên cứu sang mini-project.' },
]);

const c6 = doc('dx-gra-ele-6-1-mini-project', '6.1 — The mini-project|||6.1 — Mini-project',
  'Đề xuất/triển khai một sáng kiến CĐS; phạm vi vừa sức; MVP; dữ liệu demo; đo kết quả (trước/sau); bằng chứng chạy được.',
  [[
    `<span class="eyebrow">DX_GRA_ELE · Chapter 6 · Lesson 6.1</span>
<h2>The mini-project</h2>
<p>The mini-project is where your topic stops being reading and becomes <strong>something you did</strong>. It does not have to be production-grade — it has to be real, scoped, and demonstrable.</p>
<h3>Two valid shapes</h3>
<ul>
<li><strong>Propose</strong> — a concrete DX initiative for a real (or realistic) organization: as-is → to-be, plan, and expected impact.</li>
<li><strong>Prototype</strong> — a small working artifact: an analytics dashboard, an RPA bot on demo data, a chatbot, an IoT sensor demo.</li>
</ul>
<h3>Scope it like an MVP</h3>
<pre><code>Do this                        Not this
-----------------------------  ------------------------------
one process / one dataset      the whole department
demo data, clearly labeled     wait for real production data
one measurable outcome         "improve everything"
runs end-to-end on demo        half-built, nothing runs
</code></pre>
<h3>Measure before &amp; after</h3>
<p>Pick one metric your initiative should move — time saved, error rate, cost, hours — and record it <strong>before</strong> and <strong>after</strong>. A number, even on demo data, is worth more than a page of adjectives.</p>
<div class="callout"><span class="badge">Evidence</span> Capture proof it runs: screenshots, a short screen recording, the dataset, the before/after number. Graders reward "it works and here is the proof" over "it would work."</div>`,
    `<span class="eyebrow">DX_GRA_ELE · Chương 6 · Bài 6.1</span>
<h2>Mini-project</h2>
<p>Mini-project là chỗ chủ đề thôi là việc đọc và trở thành <strong>thứ bạn đã làm</strong>. Không cần đạt chuẩn production — cần thật, khoanh gọn, và trình diễn được.</p>
<h3>Hai dạng hợp lệ</h3>
<ul>
<li><strong>Đề xuất</strong> — một sáng kiến CĐS cụ thể cho một tổ chức thật (hoặc sát thực): hiện trạng → tương lai, kế hoạch, tác động kỳ vọng.</li>
<li><strong>Prototype</strong> — một sản phẩm nhỏ chạy được: dashboard phân tích, bot RPA trên dữ liệu demo, chatbot, demo cảm biến IoT.</li>
</ul>
<h3>Khoanh phạm vi như một MVP</h3>
<pre><code>Làm thế này                    Đừng thế này
-----------------------------  ------------------------------
một quy trình / một tập dữ liệu cả phòng ban
dữ liệu demo, ghi nhãn rõ       chờ dữ liệu production thật
một kết quả đo được             "cải thiện mọi thứ"
chạy trọn vẹn trên demo         dựng dở, không chạy gì
</code></pre>
<h3>Đo trước &amp; sau</h3>
<p>Chọn một chỉ số mà sáng kiến của bạn phải làm dịch chuyển — thời gian tiết kiệm, tỉ lệ lỗi, chi phí, số giờ — và ghi lại <strong>trước</strong> và <strong>sau</strong>. Một con số, dù trên dữ liệu demo, đáng giá hơn cả trang tính từ.</p>
<div class="callout"><span class="badge">Bằng chứng</span> Ghi lại chứng cứ nó chạy: ảnh chụp màn hình, một video ngắn, tập dữ liệu, con số trước/sau. Người chấm thưởng cho "nó chạy và đây là bằng chứng" hơn "nó sẽ chạy được".</div>`,
  ]]);

const c6q = quiz('dx-gra-ele-quiz-6', 'Quiz 6 — Mini-project|||Quiz 6 — Mini-project', [
  { id: 'q1', question: 'Mini-project nên được khoanh phạm vi theo nguyên tắc nào?', options: ['Làm cả phòng ban cùng lúc', 'Như một MVP: một quy trình/tập dữ liệu, một kết quả đo được, chạy trọn trên demo', 'Chờ có dữ liệu production thật mới bắt đầu', 'Càng rộng càng ăn điểm'], correctIndex: 1, explanation: 'Khoanh như MVP: một quy trình hoặc một tập dữ liệu, một kết quả đo được, và chạy trọn vẹn trên dữ liệu demo.' },
  { id: 'q2', question: 'Vì sao nên đo một chỉ số trước và sau khi áp dụng sáng kiến?', options: ['Để báo cáo dài hơn', 'Vì một con số chứng minh tác động thuyết phục hơn nhiều so với mô tả bằng tính từ', 'Vì trường bắt buộc đúng 10 chỉ số', 'Để tránh phải làm prototype'], correctIndex: 1, explanation: 'Con số trước/sau (thời gian, lỗi, chi phí) chứng minh tác động cụ thể, mạnh hơn hẳn mô tả định tính.' },
  { id: 'q3', question: 'Người chấm đánh giá cao điều gì nhất ở mini-project?', options: ['"Nó sẽ chạy được nếu có thời gian"', 'Bằng chứng nó thật sự chạy: ảnh/video/dữ liệu/số liệu trước-sau', 'Số lượng công nghệ mới nhắc tới', 'Slide đẹp nhưng không có demo'], correctIndex: 1, explanation: 'Bằng chứng chạy được thật (demo, ảnh, số liệu) được thưởng cao hơn lời hứa "nó sẽ chạy".' },
]);

const c7 = doc('dx-gra-ele-7-1-report-business-case', '7.1 — Report & business case|||7.1 — Báo cáo & business case',
  'Cấu trúc báo cáo; business case (vấn đề, giải pháp, chi phí, lợi ích, rủi ro, ROI); viết cho người ra quyết định; trích dẫn đúng.',
  [[
    `<span class="eyebrow">DX_GRA_ELE · Chapter 7 · Lesson 7.1</span>
<h2>Writing the report &amp; the business case</h2>
<p>The report tells the story of your learning and project; the <strong>business case</strong> argues that the initiative is worth doing. Both are written for a busy decision-maker, not a reader with unlimited time.</p>
<h3>Report structure</h3>
<pre><code>1. Executive summary   the whole thing in half a page
2. Topic &amp; question    what you studied and why
3. Research synthesis  what the field knows (cited)
4. The initiative      as-is -> to-be, your mini-project
5. Business case       cost, benefit, risk, ROI
6. Reflection          what you learned, what is next
7. References          every source, with links
</code></pre>
<h3>The business case in one table</h3>
<pre><code>Element    Question it answers
---------  ------------------------------------
Problem    what is wrong today, and what it costs
Solution   the DX initiative, briefly
Cost       tools, time, people to build &amp; run
Benefit    money/time saved or value created
Risk       what could go wrong + mitigation
ROI        is benefit &gt; cost, and by when
</code></pre>
<div class="callout"><span class="badge">Write for the decider</span> Put the answer first (executive summary), then the evidence. A decision-maker who reads only the first page should still know your recommendation and why.</div>`,
    `<span class="eyebrow">DX_GRA_ELE · Chương 7 · Bài 7.1</span>
<h2>Viết báo cáo &amp; business case</h2>
<p>Báo cáo kể câu chuyện quá trình học và dự án của bạn; <strong>business case</strong> lập luận rằng sáng kiến đáng làm. Cả hai viết cho một người ra quyết định bận rộn, không phải người đọc có thời gian vô hạn.</p>
<h3>Cấu trúc báo cáo</h3>
<pre><code>1. Tóm tắt điều hành    toàn bộ gói trong nửa trang
2. Chủ đề &amp; câu hỏi     bạn học gì và vì sao
3. Tổng hợp nghiên cứu  lĩnh vực biết gì (có trích dẫn)
4. Sáng kiến            hiện trạng -> tương lai, mini-project
5. Business case        chi phí, lợi ích, rủi ro, ROI
6. Suy ngẫm             học được gì, bước tiếp theo
7. Tài liệu tham khảo   mọi nguồn, kèm link
</code></pre>
<h3>Business case trong một bảng</h3>
<pre><code>Yếu tố     Câu hỏi nó trả lời
---------  ------------------------------------
Vấn đề     hôm nay sai ở đâu, tốn kém thế nào
Giải pháp  sáng kiến CĐS, ngắn gọn
Chi phí    công cụ, thời gian, người để dựng &amp; chạy
Lợi ích    tiền/thời gian tiết kiệm hoặc giá trị tạo ra
Rủi ro     điều gì có thể hỏng + cách giảm thiểu
ROI        lợi ích có &gt; chi phí không, và khi nào
</code></pre>
<div class="callout"><span class="badge">Viết cho người quyết</span> Đặt câu trả lời lên đầu (tóm tắt điều hành), rồi mới đến bằng chứng. Người ra quyết định chỉ đọc trang đầu vẫn phải biết bạn khuyến nghị gì và vì sao.</div>`,
  ]]);

const c7q = quiz('dx-gra-ele-quiz-7', 'Quiz 7 — Report & business case|||Quiz 7 — Báo cáo & business case', [
  { id: 'q1', question: 'Business case chủ yếu nhằm mục đích gì?', options: ['Liệt kê mọi công nghệ đã học', 'Lập luận rằng sáng kiến đáng làm — cân giữa lợi ích, chi phí, rủi ro và ROI', 'Thay thế phần nghiên cứu', 'Trình bày sơ đồ kỹ thuật chi tiết'], correctIndex: 1, explanation: 'Business case lập luận sáng kiến đáng đầu tư bằng cách cân lợi ích, chi phí, rủi ro và ROI cho người ra quyết định.' },
  { id: 'q2', question: 'Vì sao báo cáo nên bắt đầu bằng tóm tắt điều hành (executive summary)?', options: ['Để cho đủ số trang', 'Vì người ra quyết định bận — đọc trang đầu vẫn phải nắm được khuyến nghị và lý do', 'Vì đó là phần dễ viết nhất', 'Để giấu kết luận xuống cuối'], correctIndex: 1, explanation: 'Viết cho người quyết định bận: đặt câu trả lời/khuyến nghị lên đầu để chỉ đọc trang đầu vẫn hiểu được.' },
  { id: 'q3', question: 'Yếu tố "ROI" trong business case trả lời câu hỏi nào?', options: ['Công cụ nào đẹp nhất', 'Lợi ích có lớn hơn chi phí không, và đến khi nào', 'Ai là người viết báo cáo', 'Sáng kiến dùng bao nhiêu dòng code'], correctIndex: 1, explanation: 'ROI xét lợi ích có vượt chi phí không và hoàn vốn khi nào — trọng tâm để thuyết phục đầu tư.' },
]);

const c8 = doc('dx-gra-ele-8-1-defense-career', '8.1 — Presentation, defense & career path|||8.1 — Trình bày, phản biện & định hướng nghề',
  'Kể chuyện qua slide; demo sống; trả lời phản biện; nối chủ đề tới nghề nghiệp và chứng chỉ (Coursera/edX, chứng chỉ nhà cung cấp).',
  [[
    `<span class="eyebrow">DX_GRA_ELE · Chapter 8 · Lesson 8.1</span>
<h2>Presentation, defense &amp; where it leads</h2>
<p>The final step is convincing people. A presentation is not your report read aloud — it is a <strong>story</strong> with a demo, delivered in minutes.</p>
<h3>A tight presentation arc</h3>
<pre><code>1. Hook        the problem, in one human sentence
2. Topic       what you chose and why it matters
3. Insight     the one thing your research revealed
4. Demo        show the mini-project actually running
5. Impact      the before/after number + business case
6. Ask         recommendation &amp; next step
</code></pre>
<h3>Handling the defense</h3>
<ul>
<li>Expect "why this and not X?", "what did it cost?", "does it scale?"</li>
<li>Answer with <strong>evidence</strong> from your work; if you don't know, say what you'd measure to find out.</li>
<li>Defending honestly beats bluffing — examiners test how you reason, not just what you built.</li>
</ul>
<h3>Turn it into a career</h3>
<p>This elective is a portfolio piece. Extend it with a recognized credential in your lane: <a href="https://www.coursera.org/search?query=digital%20transformation" target="_blank" rel="noopener">Coursera</a> / <a href="https://www.edx.org/search?q=digital%20transformation" target="_blank" rel="noopener">edX</a> specializations, or vendor certificates (cloud, analytics, RPA). Name the next certificate in your reflection.</p>
<div class="callout"><span class="badge">The real deliverable</span> The grade fades; the skill of learning something advanced on your own, doing it, and defending it is what employers actually buy.</div>`,
    `<span class="eyebrow">DX_GRA_ELE · Chương 8 · Bài 8.1</span>
<h2>Trình bày, phản biện &amp; nó dẫn tới đâu</h2>
<p>Bước cuối là thuyết phục người khác. Thuyết trình không phải đọc lại báo cáo — nó là một <strong>câu chuyện</strong> kèm demo, gói trong vài phút.</p>
<h3>Mạch trình bày gọn</h3>
<pre><code>1. Mồi         vấn đề, trong một câu đời thường
2. Chủ đề      bạn chọn gì và vì sao nó quan trọng
3. Phát hiện   một điều nghiên cứu của bạn hé lộ
4. Demo        cho thấy mini-project chạy thật
5. Tác động    con số trước/sau + business case
6. Đề nghị     khuyến nghị &amp; bước tiếp theo
</code></pre>
<h3>Xử lý phản biện</h3>
<ul>
<li>Chờ sẵn "vì sao cái này mà không phải X?", "tốn bao nhiêu?", "có mở rộng được không?"</li>
<li>Trả lời bằng <strong>bằng chứng</strong> từ chính công việc; nếu chưa biết, nói bạn sẽ đo gì để tìm ra.</li>
<li>Phản biện trung thực thắng nói lấp liếm — người chấm kiểm cách bạn lập luận, không chỉ thứ bạn dựng.</li>
</ul>
<h3>Biến nó thành nghề</h3>
<p>Học phần này là một sản phẩm hồ sơ. Nối dài bằng một chứng chỉ được công nhận trong làn của bạn: chuyên đề <a href="https://www.coursera.org/search?query=digital%20transformation" target="_blank" rel="noopener">Coursera</a> / <a href="https://www.edx.org/search?q=digital%20transformation" target="_blank" rel="noopener">edX</a>, hoặc chứng chỉ nhà cung cấp (cloud, analytics, RPA). Nêu chứng chỉ kế tiếp trong phần suy ngẫm.</p>
<div class="callout"><span class="badge">Sản phẩm thật sự</span> Điểm số rồi phai; kỹ năng tự học một thứ nâng cao, làm ra nó, và bảo vệ được nó mới là thứ nhà tuyển dụng thật sự trả tiền.</div>`,
  ]]);

const c8q = quiz('dx-gra-ele-quiz-8', 'Quiz 8 — Defense & career|||Quiz 8 — Phản biện & nghề nghiệp', [
  { id: 'q1', question: 'Một bài thuyết trình tốt khác báo cáo ở điểm nào?', options: ['Đọc nguyên văn báo cáo cho chính xác', 'Là một câu chuyện kèm demo, gói trong vài phút, đặt vấn đề lên trước', 'Càng nhiều slide chữ càng tốt', 'Bỏ hẳn phần demo cho nhanh'], correctIndex: 1, explanation: 'Thuyết trình là một câu chuyện có demo, ngắn gọn — không phải đọc lại báo cáo.' },
  { id: 'q2', question: 'Khi bị phản biện một câu bạn chưa biết chắc, cách xử lý tốt nhất là?', options: ['Bịa một con số cho qua', 'Nói thật là chưa biết và nêu bạn sẽ đo/kiểm gì để tìm ra', 'Im lặng bỏ qua câu hỏi', 'Đổ lỗi cho thiếu thời gian'], correctIndex: 1, explanation: 'Người chấm kiểm cách bạn lập luận; trung thực và nêu cách kiểm chứng thắng việc nói lấp liếm.' },
  { id: 'q3', question: 'Cách hợp lý để biến học phần này thành lợi thế nghề nghiệp là?', options: ['Quên nó ngay sau khi có điểm', 'Nối dài bằng chứng chỉ được công nhận trong làn nghề (Coursera/edX, chứng chỉ cloud/analytics/RPA)', 'Không nhắc tới nó trong CV', 'Chỉ giữ điểm số, bỏ sản phẩm'], correctIndex: 1, explanation: 'Học phần là sản phẩm hồ sơ; nối dài bằng chứng chỉ được công nhận biến nó thành lợi thế nghề nghiệp thật.' },
]);

export default {
  semester: { code: 'FPTU_Hola9', name: 'Kỳ 9', ordinal: 11 },
  course: {
    courseCode: 'DX_GRA_ELE',
    slug: 'dx-gra-ele-graduation-elective-digital-transformation',
    title: 'Graduation Elective - Digital Transformation',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DX_GRA_ELE.webp',
    shortDescription: 'A graduation elective: pick & self-study one advanced digital-transformation topic (DX strategy, data & analytics, cloud, AI, RPA, IoT, change, fintech/e-gov), then run a mini-project. Bilingual, with learning contract, rubric & quizzes.|||Học phần tự chọn tốt nghiệp: chọn & tự học một chủ đề chuyển đổi số nâng cao (chiến lược, dữ liệu, cloud, AI, RPA, IoT, quản trị thay đổi, fintech/e-gov), rồi làm mini-project. Song ngữ, có learning contract, rubric & quiz.',
    description: 'Môn <strong>DX_GRA_ELE — Graduation Elective - Digital Transformation</strong> (Học phần tự chọn tốt nghiệp — Chuyển đổi số) là một <strong>học phần tự chọn</strong>: không có nội dung cố định. Khung này hướng dẫn bạn <strong>chọn và tự học một chủ đề chuyển đổi số nâng cao</strong> rồi làm một mini-project. Lộ trình: <strong>học phần tự chọn là gì &amp; cách chọn chủ đề</strong> → <strong>bản đồ chủ đề CĐS nâng cao</strong> (chiến lược, data-driven &amp; analytics, cloud, AI ứng dụng, RPA, IoT, quản trị thay đổi, fintech/e-gov) → <strong>khung &amp; phương pháp</strong> (maturity model, Agile, Design Thinking) → <strong>learning contract</strong> → <strong>nghiên cứu chuyên sâu</strong> → <strong>mini-project</strong> → <strong>báo cáo &amp; business case</strong> → <strong>trình bày, phản biện &amp; định hướng nghề</strong>. Song ngữ, có quiz mỗi chương. Tham khảo: <em>Leading Digital</em> (Westerman), MIT/HBR, McKinsey/Gartner, Coursera/edX và quy định FPTU trên FLM.',
    whatYouLearn: 'Hiểu bản chất học phần tự chọn tốt nghiệp và cách chọn chủ đề theo định hướng nghề; đọc bản đồ chủ đề CĐS nâng cao (chiến lược, analytics, cloud, AI, RPA, IoT, quản trị thay đổi, fintech/e-gov); áp dụng khung (digital maturity model, Agile, Design Thinking); viết learning contract; nghiên cứu chuyên sâu và tổng hợp có trích dẫn; thiết kế và triển khai mini-project (đo trước/sau); viết báo cáo &amp; business case (chi phí, lợi ích, rủi ro, ROI); trình bày, phản biện và nối tới chứng chỉ nghề.',
    requirements: 'Đã hoàn thành phần lớn khung ngành Chuyển đổi số (kỳ cuối). Nên có nền về kinh doanh số, dữ liệu và một công cụ để làm prototype. Xem điều kiện tiên quyết chính thức trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách, báo cáo tư vấn, khoá học miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Học phần tự chọn, cách chọn, deliverable, rubric.', lessons: [intro] },
    { title: 'Chương 1 — Chọn chủ đề|||Chapter 1 — Choosing a topic', description: 'Học phần tự chọn là gì, bốn bộ lọc chọn chủ đề.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Bản đồ chủ đề|||Chapter 2 — Topic map', description: 'Tám nhóm chủ đề CĐS nâng cao & làn nghề.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Khung & phương pháp|||Chapter 3 — Frameworks', description: 'Maturity model, Agile, Design Thinking.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Learning contract|||Chapter 4 — Learning contract', description: 'Tự học có kỷ luật, cam kết mục tiêu & lịch trình.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nghiên cứu sâu|||Chapter 5 — Deep research', description: 'Câu hỏi nghiên cứu, đánh giá nguồn, tổng hợp.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mini-project|||Chapter 6 — Mini-project', description: 'Đề xuất/prototype sáng kiến CĐS, đo trước/sau.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Báo cáo & business case|||Chapter 7 — Report & business case', description: 'Cấu trúc báo cáo, chi phí/lợi ích/rủi ro/ROI.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Phản biện & nghề nghiệp|||Chapter 8 — Defense & career', description: 'Thuyết trình, phản biện, chứng chỉ & định hướng nghề.', lessons: [c8, c8q] },
  ],
};
