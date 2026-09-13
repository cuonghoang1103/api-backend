/**
 * MMK101 — Management and Marketing (Quản trị & Marketing căn bản). Môn nhập môn
 * Kỳ 1, khối Công nghệ Truyền thông FPTU: gộp quản trị căn bản (POLC, vai trò
 * nhà quản trị, môi trường & tổ chức) + marketing căn bản (giá trị, STP, 4P/7P,
 * thương hiệu, marketing số). Sách chuẩn: Kotler & Armstrong "Principles of
 * Marketing", Robbins & Coulter "Management", Kotler & Keller "Marketing
 * Management". Song ngữ + mô hình + ví dụ doanh nghiệp thật + quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n;
 * "&"→&amp; chỉ trong HTML content.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mmk101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế (Kotler, Robbins), khoá học miễn phí, HBR, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">MMK101 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Management &amp; Marketing</strong> — from the four functions of management to the marketing mix and digital marketing — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are the international standard books and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MMK101 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Standard reference books</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/principles-of-marketing/P200000006165" target="_blank" rel="noopener"><em>Principles of Marketing</em> — Kotler &amp; Armstrong</a> (the core marketing text)</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/management/P200000005914" target="_blank" rel="noopener"><em>Management</em> — Robbins &amp; Coulter</a> (the core management text)</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/marketing-management/P200000006148" target="_blank" rel="noopener"><em>Marketing Management</em> — Kotler &amp; Keller</a> (deeper, strategy-level)</li>
</ul>
<h3>🌐 Free courses &amp; documentation</h3>
<ul>
<li><a href="https://www.coursera.org/browse/business/marketing" target="_blank" rel="noopener">Coursera — Marketing &amp; Management courses</a> (audit for free)</li>
<li><a href="https://hbr.org/topic/marketing" target="_blank" rel="noopener">Harvard Business Review — Marketing &amp; Strategy</a></li>
<li><a href="https://openstax.org/details/books/principles-management" target="_blank" rel="noopener">OpenStax — Principles of Management (free)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@HarvardBusinessReview" target="_blank" rel="noopener">Harvard Business Review</a> — management &amp; strategy explained</li>
<li><a href="https://www.youtube.com/@marketing" target="_blank" rel="noopener">Marketing 91 / marketing explainers</a> — core concepts &amp; cases</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.google.com/analytics/" target="_blank" rel="noopener">Google Analytics</a> — measure digital marketing</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — read demand &amp; market interest</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — build campaign &amp; brand assets</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the four functions of management (POLC), and the marketing process (understand → design → deliver → capture value).</li>
<li><strong>Practice</strong> — pick one real brand and map its STP and 4P/7P; explain why each choice fits its customers.</li>
<li><strong>Go deeper</strong> — consumer behaviour, brand equity, customer lifetime value and CRM.</li>
<li><strong>Job-ready</strong> — run a small digital &amp; social campaign, measure it with analytics, and act ethically (CSR).</li>
</ol></div>`,
    `<span class="eyebrow">MMK101 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quản trị &amp; Marketing</strong> — từ bốn chức năng quản trị đến marketing mix và marketing số — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách chuẩn quốc tế và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MMK101 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách chuẩn tham khảo</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/principles-of-marketing/P200000006165" target="_blank" rel="noopener"><em>Principles of Marketing</em> — Kotler &amp; Armstrong</a> (sách marketing lõi)</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/management/P200000005914" target="_blank" rel="noopener"><em>Management</em> — Robbins &amp; Coulter</a> (sách quản trị lõi)</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/marketing-management/P200000006148" target="_blank" rel="noopener"><em>Marketing Management</em> — Kotler &amp; Keller</a> (sâu hơn, cấp chiến lược)</li>
</ul>
<h3>🌐 Khoá học &amp; tài liệu miễn phí</h3>
<ul>
<li><a href="https://www.coursera.org/browse/business/marketing" target="_blank" rel="noopener">Coursera — khoá Marketing &amp; Quản trị</a> (học thử miễn phí)</li>
<li><a href="https://hbr.org/topic/marketing" target="_blank" rel="noopener">Harvard Business Review — Marketing &amp; Chiến lược</a></li>
<li><a href="https://openstax.org/details/books/principles-management" target="_blank" rel="noopener">OpenStax — Principles of Management (miễn phí)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@HarvardBusinessReview" target="_blank" rel="noopener">Harvard Business Review</a> — quản trị &amp; chiến lược giảng rõ</li>
<li><a href="https://www.youtube.com/@marketing" target="_blank" rel="noopener">Marketing 91 / kênh giảng marketing</a> — khái niệm lõi &amp; tình huống</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.google.com/analytics/" target="_blank" rel="noopener">Google Analytics</a> — đo lường marketing số</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — đọc nhu cầu &amp; mối quan tâm thị trường</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — dựng ấn phẩm chiến dịch &amp; thương hiệu</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — bốn chức năng quản trị (POLC), và quy trình marketing (thấu hiểu → thiết kế → trao → thu giá trị).</li>
<li><strong>Luyện tập</strong> — chọn một thương hiệu thật, vẽ STP và 4P/7P của nó; giải thích vì sao mỗi lựa chọn hợp với khách hàng.</li>
<li><strong>Đào sâu</strong> — hành vi người tiêu dùng, giá trị thương hiệu, giá trị vòng đời khách hàng và CRM.</li>
<li><strong>Sẵn sàng đi làm</strong> — chạy một chiến dịch số &amp; mạng xã hội nhỏ, đo bằng analytics, và làm có đạo đức (CSR).</li>
</ol></div>`,
  ]]);

const intro = doc('mmk101-0-1-overview', 'Course overview: Management & Marketing|||Tổng quan: Quản trị & Marketing',
  'Quản trị và marketing là gì và vì sao đi cùng nhau; bức tranh lớn (POLC → tạo & trao giá trị cho khách hàng); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">MMK101 · Lesson 0.1 · Overview</span>
<h2>Management &amp; Marketing</h2>
<p class="lead">This introductory course pairs the two disciplines every organization runs on. <strong>Management</strong> is getting things done efficiently and effectively through and with people; <strong>marketing</strong> is creating value for customers and capturing value in return. One runs the organization, the other keeps it pointed at the customer.</p>
<h3>Why the two belong together</h3>
<p>A great product badly organized never ships; a well-run company with no customers goes bankrupt. Managers <strong>plan, organize, lead and control</strong> resources; marketers make sure those resources build something people actually want and will pay for. This course gives you the shared vocabulary of both.</p>
<h3>Roadmap — 8 chapters</h3>
<ul>
<li><strong>Ch1–3 · Management</strong> — the four functions (POLC), the manager's roles &amp; skills, and the organization within its environment.</li>
<li><strong>Ch4–6 · Marketing basics</strong> — what marketing is, customers &amp; STP, and the marketing mix (4P/7P).</li>
<li><strong>Ch7–8 · Value &amp; the modern era</strong> — brands &amp; customer value, then digital, social and responsible marketing.</li>
</ul>
<div class="callout"><span class="badge">One sentence to remember</span> Management creates the capability; marketing points it at a customer and turns it into value — for the customer and for the firm.</div>`,
    `<span class="eyebrow">MMK101 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị &amp; Marketing</h2>
<p class="lead">Môn nhập môn này ghép hai lĩnh vực mà mọi tổ chức đều vận hành theo. <strong>Quản trị</strong> là hoàn thành công việc một cách hiệu quả và hữu hiệu thông qua và cùng con người; <strong>marketing</strong> là tạo giá trị cho khách hàng và thu lại giá trị. Một cái vận hành tổ chức, một cái giữ tổ chức luôn hướng về khách hàng.</p>
<h3>Vì sao hai thứ đi cùng nhau</h3>
<p>Sản phẩm tốt mà tổ chức kém thì không bao giờ ra được thị trường; công ty vận hành trơn tru mà không có khách hàng thì phá sản. Nhà quản trị <strong>hoạch định, tổ chức, lãnh đạo và kiểm soát</strong> nguồn lực; người làm marketing bảo đảm những nguồn lực đó dựng nên thứ người ta thực sự muốn và sẵn lòng trả tiền. Môn này cho bạn vốn từ chung của cả hai.</p>
<h3>Lộ trình — 8 chương</h3>
<ul>
<li><strong>Ch1–3 · Quản trị</strong> — bốn chức năng (POLC), vai trò &amp; kỹ năng nhà quản trị, và tổ chức trong môi trường của nó.</li>
<li><strong>Ch4–6 · Marketing căn bản</strong> — marketing là gì, khách hàng &amp; STP, và marketing mix (4P/7P).</li>
<li><strong>Ch7–8 · Giá trị &amp; thời hiện đại</strong> — thương hiệu &amp; giá trị khách hàng, rồi marketing số, mạng xã hội và có trách nhiệm.</li>
</ul>
<div class="callout"><span class="badge">Một câu để nhớ</span> Quản trị tạo ra năng lực; marketing hướng năng lực đó tới khách hàng và biến nó thành giá trị — cho khách hàng và cho doanh nghiệp.</div>`,
  ]]);

const c1 = doc('mmk101-1-1-what-is-management', '1.1 — What is management? The POLC functions|||1.1 — Quản trị là gì? Bốn chức năng POLC',
  'Khái niệm quản trị (hiệu quả vs hữu hiệu), bốn chức năng POLC (hoạch định-tổ chức-lãnh đạo-kiểm soát), ba cấp quản trị.',
  [[
    `<span class="eyebrow">MMK101 · Chapter 1 · Lesson 1.1</span>
<h2>What is management?</h2>
<p><strong>Management</strong> is coordinating and overseeing the work of others so that activities are completed <em>efficiently</em> (doing things right — low waste of resources) and <em>effectively</em> (doing the right things — reaching goals). Good managers pursue both: high goal attainment with low resource waste.</p>
<h3>The four functions — POLC</h3>
<ul>
<li><strong>Planning</strong> — define goals, set strategy, develop plans to coordinate work.</li>
<li><strong>Organizing</strong> — decide what tasks are done, who does them, how they're grouped and who reports to whom.</li>
<li><strong>Leading</strong> — motivate, direct and communicate with people to get the work done.</li>
<li><strong>Controlling</strong> — monitor performance, compare it to goals and correct the deviations.</li>
</ul>
<h3>Levels of management</h3>
<pre><code>Top managers      -> set direction & strategy (CEO, VP)
Middle managers   -> translate strategy into plans (department heads)
First-line managers -> supervise daily work (team leads, supervisors)
</code></pre>
<div class="callout"><span class="badge">Real example</span> When <strong>Starbucks</strong> plans a new market entry (planning), sets up regional teams (organizing), trains and motivates baristas around its service culture (leading), and tracks store sales and customer satisfaction (controlling) — that is POLC running end to end.</div>`,
    `<span class="eyebrow">MMK101 · Chương 1 · Bài 1.1</span>
<h2>Quản trị là gì?</h2>
<p><strong>Quản trị</strong> là điều phối và giám sát công việc của người khác sao cho các hoạt động hoàn thành một cách <em>hiệu quả</em> (làm đúng cách — ít lãng phí nguồn lực) và <em>hữu hiệu</em> (làm đúng việc — đạt mục tiêu). Nhà quản trị giỏi theo đuổi cả hai: đạt mục tiêu cao với lãng phí nguồn lực thấp.</p>
<h3>Bốn chức năng — POLC</h3>
<ul>
<li><strong>Hoạch định (Planning)</strong> — đặt mục tiêu, định chiến lược, xây kế hoạch điều phối công việc.</li>
<li><strong>Tổ chức (Organizing)</strong> — quyết định làm việc gì, ai làm, gom nhóm ra sao và ai báo cáo cho ai.</li>
<li><strong>Lãnh đạo (Leading)</strong> — tạo động lực, dẫn dắt và giao tiếp với con người để hoàn thành công việc.</li>
<li><strong>Kiểm soát (Controlling)</strong> — theo dõi kết quả, so với mục tiêu và điều chỉnh sai lệch.</li>
</ul>
<h3>Các cấp quản trị</h3>
<pre><code>Cấp cao       -> định hướng & chiến lược (CEO, phó tổng)
Cấp trung     -> chuyển chiến lược thành kế hoạch (trưởng phòng)
Cấp cơ sở     -> giám sát công việc hằng ngày (tổ trưởng, giám sát)
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Khi <strong>Starbucks</strong> hoạch định vào một thị trường mới (planning), lập các đội theo vùng (organizing), đào tạo và truyền động lực cho nhân viên quanh văn hoá phục vụ (leading), và theo dõi doanh số cửa hàng cùng sự hài lòng khách (controlling) — đó là POLC chạy trọn vòng.</div>`,
  ]]);

const c1q = quiz('mmk101-quiz-1', 'Quiz 1 — What is management?|||Quiz 1 — Quản trị là gì?', [
  { id: 'q1', question: 'Bốn chức năng của quản trị (POLC) là?', options: ['Sản xuất, bán hàng, kế toán, nhân sự', 'Hoạch định, tổ chức, lãnh đạo, kiểm soát', 'Mua, bán, lưu kho, giao', 'Nghiên cứu, thiết kế, thử, phát hành'], correctIndex: 1, explanation: 'POLC = Planning, Organizing, Leading, Controlling.' },
  { id: 'q2', question: '"Hữu hiệu" (effectiveness) trong quản trị nghĩa là?', options: ['Ít lãng phí nguồn lực', 'Làm đúng việc — đạt mục tiêu', 'Làm nhanh nhất có thể', 'Chi phí thấp nhất'], correctIndex: 1, explanation: 'Effective = đạt mục tiêu (làm đúng việc); efficient = ít lãng phí (làm đúng cách).' },
  { id: 'q3', question: 'Cấp quản trị nào giám sát công việc hằng ngày của nhân viên?', options: ['Nhà quản trị cấp cao', 'Nhà quản trị cấp trung', 'Nhà quản trị cấp cơ sở (first-line)', 'Hội đồng quản trị'], correctIndex: 2, explanation: 'First-line managers (tổ trưởng, giám sát) quản lý công việc hằng ngày.' },
]);

const c2 = doc('mmk101-2-1-managers-skills', '2.1 — Managers, roles & skills|||2.1 — Nhà quản trị, vai trò & kỹ năng',
  'Vai trò nhà quản trị (Mintzberg: liên nhân, thông tin, quyết định), ba kỹ năng (Katz: kỹ thuật/con người/tư duy), quy trình ra quyết định.',
  [[
    `<span class="eyebrow">MMK101 · Chapter 2 · Lesson 2.1</span>
<h2>Managers: roles &amp; skills</h2>
<h3>Mintzberg's managerial roles</h3>
<p>Henry Mintzberg found managers actually play <strong>10 roles</strong> in three groups:</p>
<ul>
<li><strong>Interpersonal</strong> — figurehead, leader, liaison (dealing with people).</li>
<li><strong>Informational</strong> — monitor, disseminator, spokesperson (handling information).</li>
<li><strong>Decisional</strong> — entrepreneur, disturbance handler, resource allocator, negotiator (making choices).</li>
</ul>
<h3>Katz's three skills</h3>
<ul>
<li><strong>Technical</strong> — job-specific knowledge; matters most for first-line managers.</li>
<li><strong>Human</strong> — working well with people; matters at every level.</li>
<li><strong>Conceptual</strong> — seeing the whole system &amp; the big picture; matters most for top managers.</li>
</ul>
<h3>The decision-making process</h3>
<pre><code>1 Identify the problem   4 Analyze alternatives
2 Set decision criteria  5 Choose an alternative
3 Develop alternatives   6 Implement -> evaluate
</code></pre>
<div class="callout"><span class="badge">Real example</span> A <strong>Grab</strong> operations manager uses <em>human</em> skill to keep driver-partners motivated, <em>technical</em> skill to read the dispatch data, and <em>conceptual</em> skill to see how a pricing change ripples across riders, drivers and the city.</div>`,
    `<span class="eyebrow">MMK101 · Chương 2 · Bài 2.1</span>
<h2>Nhà quản trị: vai trò &amp; kỹ năng</h2>
<h3>Vai trò nhà quản trị (Mintzberg)</h3>
<p>Henry Mintzberg thấy nhà quản trị thực ra đóng <strong>10 vai trò</strong> trong ba nhóm:</p>
<ul>
<li><strong>Liên nhân (interpersonal)</strong> — đại diện, lãnh đạo, liên lạc (làm việc với con người).</li>
<li><strong>Thông tin (informational)</strong> — thu thập, phổ biến, phát ngôn (xử lý thông tin).</li>
<li><strong>Quyết định (decisional)</strong> — khởi xướng, xử lý xáo trộn, phân bổ nguồn lực, đàm phán (đưa lựa chọn).</li>
</ul>
<h3>Ba kỹ năng (Katz)</h3>
<ul>
<li><strong>Kỹ thuật (technical)</strong> — kiến thức chuyên môn; quan trọng nhất với cấp cơ sở.</li>
<li><strong>Con người (human)</strong> — làm việc tốt với người khác; quan trọng ở mọi cấp.</li>
<li><strong>Tư duy (conceptual)</strong> — nhìn cả hệ thống &amp; bức tranh lớn; quan trọng nhất với cấp cao.</li>
</ul>
<h3>Quy trình ra quyết định</h3>
<pre><code>1 Nhận diện vấn đề     4 Phân tích phương án
2 Đặt tiêu chí         5 Chọn phương án
3 Xây các phương án    6 Thực thi -> đánh giá
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Một quản lý vận hành ở <strong>Grab</strong> dùng kỹ năng <em>con người</em> để giữ động lực cho tài xế, kỹ năng <em>kỹ thuật</em> để đọc dữ liệu điều phối, và kỹ năng <em>tư duy</em> để thấy một thay đổi giá lan ra sao tới khách, tài xế và cả thành phố.</div>`,
  ]]);

const c2q = quiz('mmk101-quiz-2', 'Quiz 2 — Managers, roles & skills|||Quiz 2 — Vai trò & kỹ năng', [
  { id: 'q1', question: 'Theo Katz, kỹ năng nào quan trọng nhất với nhà quản trị cấp cao?', options: ['Kỹ năng kỹ thuật', 'Kỹ năng tư duy (conceptual)', 'Kỹ năng đánh máy', 'Kỹ năng kế toán'], correctIndex: 1, explanation: 'Cấp càng cao càng cần kỹ năng tư duy (nhìn bức tranh lớn); kỹ thuật quan trọng nhất ở cấp cơ sở.' },
  { id: 'q2', question: 'Vai trò "phát ngôn" (spokesperson) thuộc nhóm vai trò nào của Mintzberg?', options: ['Liên nhân', 'Thông tin', 'Quyết định', 'Tài chính'], correctIndex: 1, explanation: 'Spokesperson thuộc nhóm vai trò thông tin (informational).' },
  { id: 'q3', question: 'Bước ĐẦU TIÊN trong quy trình ra quyết định là?', options: ['Chọn phương án', 'Thực thi', 'Nhận diện vấn đề', 'Đánh giá kết quả'], correctIndex: 2, explanation: 'Bắt đầu bằng nhận diện đúng vấn đề, rồi mới đặt tiêu chí và tìm phương án.' },
]);

const c3 = doc('mmk101-3-1-environment-organization', '3.1 — Environment, structure & culture|||3.1 — Môi trường, cơ cấu & văn hoá',
  'Môi trường vĩ mô (PESTEL) và vi mô, cơ cấu tổ chức (chức năng/bộ phận/ma trận), văn hoá tổ chức.',
  [[
    `<span class="eyebrow">MMK101 · Chapter 3 · Lesson 3.1</span>
<h2>The organization &amp; its environment</h2>
<h3>Macro-environment — PESTEL</h3>
<p>Broad forces no single firm controls, scanned with <strong>PESTEL</strong>:</p>
<ul>
<li><strong>P</strong>olitical · <strong>E</strong>conomic · <strong>S</strong>ocial · <strong>T</strong>echnological · <strong>E</strong>nvironmental · <strong>L</strong>egal.</li>
</ul>
<h3>Micro-environment</h3>
<p>Close forces the firm interacts with directly: <strong>customers, competitors, suppliers, distributors</strong> and other stakeholders.</p>
<h3>Organizational structure</h3>
<ul>
<li><strong>Functional</strong> — group by specialty (marketing, finance, IT).</li>
<li><strong>Divisional</strong> — group by product, market or region.</li>
<li><strong>Matrix</strong> — people report to both a function and a project.</li>
</ul>
<h3>Organizational culture</h3>
<p>The shared values, norms and "how we do things here" that shape behaviour. A strong, clear culture aligns people faster than any rulebook.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Netflix</strong> famously runs a "freedom &amp; responsibility" culture — high trust, few rules — while scanning a fierce PESTEL environment (streaming rights, data laws, new rivals) that reshapes its strategy every year.</div>`,
    `<span class="eyebrow">MMK101 · Chương 3 · Bài 3.1</span>
<h2>Tổ chức &amp; môi trường của nó</h2>
<h3>Môi trường vĩ mô — PESTEL</h3>
<p>Những lực lớn không doanh nghiệp đơn lẻ nào kiểm soát, quét bằng <strong>PESTEL</strong>:</p>
<ul>
<li><strong>P</strong>olitical (chính trị) · <strong>E</strong>conomic (kinh tế) · <strong>S</strong>ocial (xã hội) · <strong>T</strong>echnological (công nghệ) · <strong>E</strong>nvironmental (môi trường) · <strong>L</strong>egal (pháp lý).</li>
</ul>
<h3>Môi trường vi mô</h3>
<p>Những lực gần mà doanh nghiệp tương tác trực tiếp: <strong>khách hàng, đối thủ, nhà cung cấp, nhà phân phối</strong> và các bên liên quan khác.</p>
<h3>Cơ cấu tổ chức</h3>
<ul>
<li><strong>Chức năng (functional)</strong> — gom theo chuyên môn (marketing, tài chính, IT).</li>
<li><strong>Bộ phận (divisional)</strong> — gom theo sản phẩm, thị trường hoặc vùng.</li>
<li><strong>Ma trận (matrix)</strong> — nhân sự báo cáo cho cả một chức năng lẫn một dự án.</li>
</ul>
<h3>Văn hoá tổ chức</h3>
<p>Hệ giá trị, chuẩn mực chung và "cách chúng ta làm ở đây" định hình hành vi. Một văn hoá mạnh, rõ ràng gắn kết con người nhanh hơn mọi cuốn nội quy.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Netflix</strong> nổi tiếng với văn hoá "tự do &amp; trách nhiệm" — tin tưởng cao, ít quy tắc — trong khi quét một môi trường PESTEL khốc liệt (bản quyền phát trực tuyến, luật dữ liệu, đối thủ mới) làm chiến lược của họ đổi mỗi năm.</div>`,
  ]]);

const c3q = quiz('mmk101-quiz-3', 'Quiz 3 — Environment & organization|||Quiz 3 — Môi trường & tổ chức', [
  { id: 'q1', question: 'PESTEL là công cụ để phân tích?', options: ['Môi trường vĩ mô', 'Báo cáo tài chính', 'Cơ cấu lương', 'Quy trình sản xuất'], correctIndex: 0, explanation: 'PESTEL = Political, Economic, Social, Technological, Environmental, Legal — quét môi trường vĩ mô.' },
  { id: 'q2', question: 'Yếu tố nào KHÔNG thuộc môi trường vi mô?', options: ['Khách hàng', 'Đối thủ cạnh tranh', 'Nhà cung cấp', 'Luật pháp quốc gia'], correctIndex: 3, explanation: 'Luật pháp là yếu tố vĩ mô (chữ L trong PESTEL); vi mô gồm khách, đối thủ, nhà cung cấp, phân phối.' },
  { id: 'q3', question: 'Cơ cấu tổ chức mà nhân sự báo cáo cho cả một chức năng LẪN một dự án gọi là?', options: ['Cơ cấu chức năng', 'Cơ cấu bộ phận', 'Cơ cấu ma trận', 'Cơ cấu phẳng'], correctIndex: 2, explanation: 'Ma trận (matrix) = hai tuyến báo cáo song song (chức năng + dự án).' },
]);

const c4 = doc('mmk101-4-1-what-is-marketing', '4.1 — What is marketing? Value & the process|||4.1 — Marketing là gì? Giá trị & quy trình',
  'Khái niệm marketing, nhu cầu-mong muốn-cầu, giá trị & trao đổi, quy trình marketing 5 bước, định hướng marketing.',
  [[
    `<span class="eyebrow">MMK101 · Chapter 4 · Lesson 4.1</span>
<h2>What is marketing?</h2>
<p>Kotler: <strong>marketing is managing profitable customer relationships</strong> — creating value <em>for</em> customers and capturing value <em>from</em> them in return. It is far more than selling or advertising; those are just the tip.</p>
<h3>Needs, wants, demands</h3>
<ul>
<li><strong>Need</strong> — a basic requirement (hunger).</li>
<li><strong>Want</strong> — a need shaped by culture &amp; personality (a bowl of phở).</li>
<li><strong>Demand</strong> — a want backed by buying power.</li>
</ul>
<h3>Value &amp; exchange</h3>
<p><strong>Customer value</strong> = benefits − costs. Marketing works through <strong>exchange</strong>: giving up something to obtain something you value more.</p>
<h3>The marketing process (5 steps)</h3>
<pre><code>1 Understand the market & customer needs
2 Design a customer-driven strategy (STP)
3 Build an integrated marketing program (4P)
4 Build profitable relationships (CRM)
5 Capture value -> profit & customer equity
</code></pre>
<div class="callout"><span class="badge">Real example</span> <strong>Apple</strong> rarely competes on raw specs; it sells a <em>value proposition</em> — design, ecosystem, status — so customers happily pay a premium. That is marketing creating and capturing value, not just selling phones.</div>`,
    `<span class="eyebrow">MMK101 · Chương 4 · Bài 4.1</span>
<h2>Marketing là gì?</h2>
<p>Kotler: <strong>marketing là quản trị các mối quan hệ khách hàng có lợi</strong> — tạo giá trị <em>cho</em> khách hàng và thu lại giá trị <em>từ</em> họ. Nó rộng hơn nhiều so với bán hàng hay quảng cáo; hai thứ đó chỉ là phần nổi.</p>
<h3>Nhu cầu, mong muốn, cầu</h3>
<ul>
<li><strong>Nhu cầu (need)</strong> — đòi hỏi cơ bản (đói).</li>
<li><strong>Mong muốn (want)</strong> — nhu cầu được văn hoá &amp; cá tính định hình (một tô phở).</li>
<li><strong>Cầu (demand)</strong> — mong muốn có sức mua đứng sau.</li>
</ul>
<h3>Giá trị &amp; trao đổi</h3>
<p><strong>Giá trị khách hàng</strong> = lợi ích − chi phí. Marketing vận hành qua <strong>trao đổi</strong>: từ bỏ thứ gì đó để nhận thứ mình coi trọng hơn.</p>
<h3>Quy trình marketing (5 bước)</h3>
<pre><code>1 Thấu hiểu thị trường & nhu cầu khách
2 Thiết kế chiến lược lấy khách làm trọng (STP)
3 Xây chương trình marketing tích hợp (4P)
4 Xây quan hệ khách hàng có lợi (CRM)
5 Thu giá trị -> lợi nhuận & tài sản khách hàng
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Apple</strong> hiếm khi cạnh tranh bằng thông số thô; họ bán một <em>đề xuất giá trị</em> — thiết kế, hệ sinh thái, đẳng cấp — để khách vui lòng trả giá cao. Đó là marketing tạo và thu giá trị, không chỉ bán điện thoại.</div>`,
  ]]);

const c4q = quiz('mmk101-quiz-4', 'Quiz 4 — What is marketing?|||Quiz 4 — Marketing là gì?', [
  { id: 'q1', question: 'Một "mong muốn" (want) có sức mua đứng sau trở thành?', options: ['Nhu cầu (need)', 'Cầu (demand)', 'Trao đổi', 'Giá trị'], correctIndex: 1, explanation: 'Want + sức mua = demand (cầu).' },
  { id: 'q2', question: 'Giá trị khách hàng (customer value) được hiểu là?', options: ['Giá bán của sản phẩm', 'Lợi ích trừ chi phí', 'Chi phí sản xuất', 'Số lượng bán ra'], correctIndex: 1, explanation: 'Customer value = tổng lợi ích − tổng chi phí khách phải bỏ ra.' },
  { id: 'q3', question: 'Bước ĐẦU TIÊN của quy trình marketing 5 bước là?', options: ['Xây chương trình 4P', 'Thu lợi nhuận', 'Thấu hiểu thị trường & nhu cầu khách hàng', 'Thiết kế STP'], correctIndex: 2, explanation: 'Bắt đầu bằng thấu hiểu thị trường và nhu cầu; giá trị chỉ tạo được khi hiểu khách.' },
]);

const c5 = doc('mmk101-5-1-customer-behavior-stp', '5.1 — Customer behaviour & STP|||5.1 — Hành vi khách hàng & STP',
  'Phân tích thị trường, hành vi mua của người tiêu dùng (5 bước), và chiến lược STP: phân khúc-chọn thị trường mục tiêu-định vị.',
  [[
    `<span class="eyebrow">MMK101 · Chapter 5 · Lesson 5.1</span>
<h2>Understanding customers &amp; STP</h2>
<h3>Consumer buying process</h3>
<pre><code>Need recognition -> Information search ->
Evaluation of alternatives -> Purchase -> Post-purchase behaviour
</code></pre>
<p>Buying is shaped by cultural, social, personal and psychological factors — marketers study these to predict and influence choices.</p>
<h3>STP — the heart of strategy</h3>
<ul>
<li><strong>Segmentation</strong> — split the market into groups with similar needs (by demographics, geography, behaviour, psychographics).</li>
<li><strong>Targeting</strong> — choose which segment(s) to serve, based on size, growth and fit.</li>
<li><strong>Positioning</strong> — design a clear, distinctive place in the target's mind vs competitors (the value proposition).</li>
</ul>
<div class="callout"><span class="badge">Real example</span> <strong>Coca-Cola</strong> segments by occasion and lifestyle, targets health-conscious drinkers with <em>Coke Zero</em>, and positions it as "the taste of Coke, zero sugar" — one company, several positions for several segments.</div>`,
    `<span class="eyebrow">MMK101 · Chương 5 · Bài 5.1</span>
<h2>Thấu hiểu khách hàng &amp; STP</h2>
<h3>Quy trình mua của người tiêu dùng</h3>
<pre><code>Nhận biết nhu cầu -> Tìm kiếm thông tin ->
Đánh giá phương án -> Mua -> Hành vi sau mua
</code></pre>
<p>Hành vi mua chịu ảnh hưởng bởi yếu tố văn hoá, xã hội, cá nhân và tâm lý — người làm marketing nghiên cứu chúng để dự đoán và tác động lựa chọn.</p>
<h3>STP — trái tim của chiến lược</h3>
<ul>
<li><strong>Phân khúc (Segmentation)</strong> — chia thị trường thành nhóm có nhu cầu giống nhau (theo nhân khẩu, địa lý, hành vi, tâm lý).</li>
<li><strong>Chọn mục tiêu (Targeting)</strong> — chọn (các) phân khúc để phục vụ, dựa trên quy mô, tăng trưởng và độ phù hợp.</li>
<li><strong>Định vị (Positioning)</strong> — dựng một vị trí rõ ràng, khác biệt trong tâm trí khách so với đối thủ (đề xuất giá trị).</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Coca-Cola</strong> phân khúc theo dịp và lối sống, nhắm người quan tâm sức khoẻ bằng <em>Coke Zero</em>, và định vị nó là "vị Coca-Cola, không đường" — một công ty, nhiều định vị cho nhiều phân khúc.</div>`,
  ]]);

const c5q = quiz('mmk101-quiz-5', 'Quiz 5 — Customer behaviour & STP|||Quiz 5 — Hành vi & STP', [
  { id: 'q1', question: 'STP trong marketing là viết tắt của?', options: ['Sản phẩm, Giá, Phân phối', 'Segmentation, Targeting, Positioning', 'Strategy, Tactics, Plan', 'Sale, Trade, Promotion'], correctIndex: 1, explanation: 'STP = Phân khúc, Chọn thị trường mục tiêu, Định vị.' },
  { id: 'q2', question: '"Định vị" (positioning) nghĩa là?', options: ['Đặt kho hàng ở đâu', 'Dựng vị trí khác biệt trong tâm trí khách so với đối thủ', 'Chọn giá bán', 'Xếp hàng lên kệ'], correctIndex: 1, explanation: 'Positioning = tạo hình ảnh/giá trị khác biệt trong tâm trí khách hàng mục tiêu.' },
  { id: 'q3', question: 'Bước cuối trong quy trình mua của người tiêu dùng là?', options: ['Nhận biết nhu cầu', 'Tìm kiếm thông tin', 'Hành vi sau mua', 'Đánh giá phương án'], correctIndex: 2, explanation: 'Sau khi mua là hành vi sau mua (hài lòng/không) — quyết định mua lại và truyền miệng.' },
]);

const c6 = doc('mmk101-6-1-marketing-mix', '6.1 — The marketing mix: 4P & 7P|||6.1 — Marketing mix: 4P & 7P',
  'Bốn P (Product, Price, Place, Promotion) và mở rộng 7P cho dịch vụ (People, Process, Physical evidence).',
  [[
    `<span class="eyebrow">MMK101 · Chapter 6 · Lesson 6.1</span>
<h2>The marketing mix — 4P &amp; 7P</h2>
<p>The <strong>marketing mix</strong> is the set of controllable tools a firm blends to deliver its positioning to the target market.</p>
<h3>The 4P (products)</h3>
<ul>
<li><strong>Product</strong> — the goods/service, features, quality, brand.</li>
<li><strong>Price</strong> — list price, discounts, terms; signals value.</li>
<li><strong>Place</strong> — channels &amp; distribution that make it available.</li>
<li><strong>Promotion</strong> — advertising, PR, sales, digital — how you communicate.</li>
</ul>
<h3>The extra 3P (services → 7P)</h3>
<ul>
<li><strong>People</strong> — staff who deliver the service.</li>
<li><strong>Process</strong> — the steps of delivery (booking, queueing, support).</li>
<li><strong>Physical evidence</strong> — tangible cues (store design, packaging, app UI).</li>
</ul>
<div class="callout"><span class="badge">Real example</span> <strong>Starbucks</strong> lives on 7P: premium <em>product</em>, premium <em>price</em>, ubiquitous <em>place</em>, its <em>people</em> (baristas), a smooth ordering <em>process</em> (the app), and <em>physical evidence</em> — the unmistakable store ambience.</div>`,
    `<span class="eyebrow">MMK101 · Chương 6 · Bài 6.1</span>
<h2>Marketing mix — 4P &amp; 7P</h2>
<p><strong>Marketing mix</strong> là bộ công cụ kiểm soát được mà doanh nghiệp phối hợp để đưa định vị của mình tới thị trường mục tiêu.</p>
<h3>4P (sản phẩm hàng hoá)</h3>
<ul>
<li><strong>Product (Sản phẩm)</strong> — hàng hoá/dịch vụ, tính năng, chất lượng, thương hiệu.</li>
<li><strong>Price (Giá)</strong> — giá niêm yết, chiết khấu, điều khoản; báo hiệu giá trị.</li>
<li><strong>Place (Phân phối)</strong> — kênh &amp; phân phối để sản phẩm sẵn có.</li>
<li><strong>Promotion (Xúc tiến)</strong> — quảng cáo, PR, bán hàng, số — cách bạn truyền thông.</li>
</ul>
<h3>3P mở rộng (dịch vụ → 7P)</h3>
<ul>
<li><strong>People (Con người)</strong> — nhân sự trao dịch vụ.</li>
<li><strong>Process (Quy trình)</strong> — các bước trao dịch vụ (đặt chỗ, xếp hàng, hỗ trợ).</li>
<li><strong>Physical evidence (Bằng chứng hữu hình)</strong> — dấu hiệu hữu hình (thiết kế cửa hàng, bao bì, giao diện app).</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Starbucks</strong> sống nhờ 7P: <em>product</em> cao cấp, <em>price</em> cao cấp, <em>place</em> phủ khắp, <em>people</em> (nhân viên pha chế), <em>process</em> đặt hàng mượt (app), và <em>physical evidence</em> — không gian cửa hàng đặc trưng.</div>`,
  ]]);

const c6q = quiz('mmk101-quiz-6', 'Quiz 6 — The marketing mix|||Quiz 6 — Marketing mix', [
  { id: 'q1', question: 'Bốn P của marketing mix là?', options: ['People, Process, Price, Place', 'Product, Price, Place, Promotion', 'Plan, Product, Profit, Price', 'Product, People, Physical, Process'], correctIndex: 1, explanation: '4P kinh điển: Product, Price, Place, Promotion.' },
  { id: 'q2', question: 'Ba P mở rộng cho DỊCH VỤ (7P) là?', options: ['Price, Place, Profit', 'People, Process, Physical evidence', 'Plan, Product, Promotion', 'Public, Partner, Process'], correctIndex: 1, explanation: '7P thêm People, Process, Physical evidence cho ngành dịch vụ.' },
  { id: 'q3', question: 'Yếu tố "Place" trong 4P nói về?', options: ['Giá bán', 'Kênh & phân phối để sản phẩm sẵn có', 'Quảng cáo', 'Tính năng sản phẩm'], correctIndex: 1, explanation: 'Place = kênh phân phối, đưa sản phẩm tới đúng nơi khách mua được.' },
]);

const c7 = doc('mmk101-7-1-brand-customer-value', '7.1 — Brands, customer value & CRM|||7.1 — Thương hiệu, giá trị khách hàng & CRM',
  'Thương hiệu & tài sản thương hiệu, giá trị vòng đời khách hàng (CLV), CRM và lòng trung thành.',
  [[
    `<span class="eyebrow">MMK101 · Chapter 7 · Lesson 7.1</span>
<h2>Brands &amp; customer value</h2>
<h3>Brand &amp; brand equity</h3>
<p>A <strong>brand</strong> is a name, symbol and set of associations that identify a product and set it apart. <strong>Brand equity</strong> is the added value a strong brand gives — awareness, perceived quality, loyalty — letting the firm charge more and be chosen faster.</p>
<h3>Customer lifetime value (CLV)</h3>
<p><strong>CLV</strong> is the total profit a customer brings over the whole relationship — not one sale. It shifts the goal from "win a transaction" to "keep a customer", because keeping is far cheaper than acquiring.</p>
<h3>CRM &amp; loyalty</h3>
<p><strong>Customer Relationship Management</strong> builds long-term, profitable relationships by delivering value and satisfaction. Loyal customers buy more, cost less to serve, and recommend you — turning satisfaction into <em>customer equity</em>.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Amazon Prime</strong> is a CRM machine: the membership raises switching cost, lifts purchase frequency and pushes CLV up — loyalty engineered, not hoped for.</div>`,
    `<span class="eyebrow">MMK101 · Chương 7 · Bài 7.1</span>
<h2>Thương hiệu &amp; giá trị khách hàng</h2>
<h3>Thương hiệu &amp; tài sản thương hiệu</h3>
<p>Một <strong>thương hiệu</strong> là tên, biểu tượng và tập liên tưởng nhận diện sản phẩm và làm nó khác biệt. <strong>Tài sản thương hiệu (brand equity)</strong> là giá trị cộng thêm mà một thương hiệu mạnh mang lại — nhận biết, chất lượng cảm nhận, lòng trung thành — cho phép doanh nghiệp bán giá cao hơn và được chọn nhanh hơn.</p>
<h3>Giá trị vòng đời khách hàng (CLV)</h3>
<p><strong>CLV</strong> là tổng lợi nhuận một khách mang lại suốt cả mối quan hệ — không phải một lần bán. Nó dời mục tiêu từ "thắng một giao dịch" sang "giữ một khách hàng", vì giữ rẻ hơn nhiều so với giành mới.</p>
<h3>CRM &amp; lòng trung thành</h3>
<p><strong>Quản trị quan hệ khách hàng (CRM)</strong> dựng mối quan hệ lâu dài, có lợi bằng cách trao giá trị và sự hài lòng. Khách trung thành mua nhiều hơn, tốn ít chi phí phục vụ hơn và giới thiệu bạn — biến hài lòng thành <em>tài sản khách hàng</em>.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Amazon Prime</strong> là một cỗ máy CRM: gói thành viên nâng chi phí chuyển đổi, tăng tần suất mua và đẩy CLV lên — lòng trung thành được thiết kế, không phải trông chờ.</div>`,
  ]]);

const c7q = quiz('mmk101-quiz-7', 'Quiz 7 — Brand & customer value|||Quiz 7 — Thương hiệu & giá trị KH', [
  { id: 'q1', question: '"Tài sản thương hiệu" (brand equity) là?', options: ['Số tiền in logo', 'Giá trị cộng thêm mà một thương hiệu mạnh mang lại', 'Chi phí quảng cáo', 'Số cửa hàng'], correctIndex: 1, explanation: 'Brand equity = giá trị cộng thêm (nhận biết, chất lượng cảm nhận, trung thành) của thương hiệu.' },
  { id: 'q2', question: 'CLV (Customer Lifetime Value) đo?', options: ['Lợi nhuận một lần bán', 'Tổng lợi nhuận từ khách suốt cả mối quan hệ', 'Giá sản phẩm', 'Chi phí thu hút khách mới'], correctIndex: 1, explanation: 'CLV = tổng giá trị/lợi nhuận một khách mang lại trong toàn bộ vòng đời quan hệ.' },
  { id: 'q3', question: 'Mục tiêu chính của CRM là?', options: ['Bán một lần cho nhiều người', 'Xây quan hệ khách hàng lâu dài, có lợi', 'Giảm giá liên tục', 'Mở rộng nhà máy'], correctIndex: 1, explanation: 'CRM hướng tới quan hệ lâu dài & lòng trung thành, tăng CLV thay vì chỉ một giao dịch.' },
]);

const c8 = doc('mmk101-8-1-digital-modern-marketing', '8.1 — Digital, social & responsible marketing|||8.1 — Marketing số, mạng xã hội & trách nhiệm',
  'Marketing số (SEO, nội dung, quảng cáo trực tuyến), mạng xã hội & influencer, xu hướng, và đạo đức & trách nhiệm xã hội (CSR).',
  [[
    `<span class="eyebrow">MMK101 · Chapter 8 · Lesson 8.1</span>
<h2>Digital, social &amp; responsible marketing</h2>
<h3>Digital marketing</h3>
<p>Reaching and engaging customers through online channels — <strong>search (SEO/SEA), content, email, online ads</strong> — all measurable in real time with analytics, so campaigns can be optimized as they run.</p>
<h3>Social &amp; influencer</h3>
<p>Social platforms turn marketing into a two-way conversation; <strong>influencers</strong> and user-generated content spread reach and trust. Communities, not just audiences.</p>
<h3>Trends</h3>
<ul>
<li><strong>Personalization</strong> &amp; AI-driven recommendations.</li>
<li><strong>Content &amp; short video</strong> as the dominant format.</li>
<li><strong>Data &amp; privacy</strong> — power and responsibility together.</li>
</ul>
<h3>Ethics &amp; CSR</h3>
<p>Marketing must be honest and socially responsible: no deceptive claims, respect for privacy, and <strong>Corporate Social Responsibility</strong> — creating value for society, not only shareholders.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Nike</strong> blends purpose-driven campaigns with data-rich digital &amp; social marketing — but the same reach makes ethics unavoidable: a misleading or tone-deaf message travels just as fast.</div>`,
    `<span class="eyebrow">MMK101 · Chương 8 · Bài 8.1</span>
<h2>Marketing số, mạng xã hội &amp; trách nhiệm</h2>
<h3>Marketing số</h3>
<p>Tiếp cận và tương tác với khách qua kênh trực tuyến — <strong>tìm kiếm (SEO/SEA), nội dung, email, quảng cáo online</strong> — tất cả đo được theo thời gian thực bằng analytics, nên chiến dịch có thể tối ưu ngay khi chạy.</p>
<h3>Mạng xã hội &amp; influencer</h3>
<p>Nền tảng xã hội biến marketing thành hội thoại hai chiều; <strong>influencer</strong> và nội dung do người dùng tạo lan toả độ phủ và niềm tin. Là cộng đồng, không chỉ là khán giả.</p>
<h3>Xu hướng</h3>
<ul>
<li><strong>Cá nhân hoá</strong> &amp; gợi ý bằng AI.</li>
<li><strong>Nội dung &amp; video ngắn</strong> thành định dạng chủ đạo.</li>
<li><strong>Dữ liệu &amp; quyền riêng tư</strong> — quyền lực đi kèm trách nhiệm.</li>
</ul>
<h3>Đạo đức &amp; CSR</h3>
<p>Marketing phải trung thực và có trách nhiệm xã hội: không tuyên bố gian dối, tôn trọng quyền riêng tư, và <strong>trách nhiệm xã hội của doanh nghiệp (CSR)</strong> — tạo giá trị cho xã hội, không chỉ cho cổ đông.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Nike</strong> kết hợp chiến dịch mang thông điệp với marketing số &amp; mạng xã hội giàu dữ liệu — nhưng chính độ phủ ấy khiến đạo đức thành bắt buộc: một thông điệp sai lệch hay vô cảm lan cũng nhanh y như vậy.</div>`,
  ]]);

const c8q = quiz('mmk101-quiz-8', 'Quiz 8 — Digital & responsible marketing|||Quiz 8 — Marketing số & trách nhiệm', [
  { id: 'q1', question: 'Ưu điểm nổi bật của marketing số so với truyền thống là?', options: ['Không tốn chi phí', 'Đo lường được theo thời gian thực để tối ưu', 'Không cần nội dung', 'Chỉ dùng cho công ty lớn'], correctIndex: 1, explanation: 'Kênh số đo được real-time bằng analytics, nên chiến dịch tối ưu ngay khi chạy.' },
  { id: 'q2', question: 'CSR (Corporate Social Responsibility) nghĩa là?', options: ['Chỉ tối đa lợi nhuận cổ đông', 'Doanh nghiệp tạo giá trị cho xã hội, có trách nhiệm', 'Giảm giá cho khách VIP', 'Một loại quảng cáo trả tiền'], correctIndex: 1, explanation: 'CSR = trách nhiệm xã hội của doanh nghiệp — tạo giá trị cho xã hội, làm ăn có đạo đức.' },
  { id: 'q3', question: 'Marketing qua mạng xã hội khác quảng cáo truyền thống chủ yếu vì nó?', options: ['Chỉ một chiều', 'Là hội thoại hai chiều với cộng đồng', 'Không đo được', 'Cấm influencer'], correctIndex: 1, explanation: 'Mạng xã hội biến marketing thành hội thoại hai chiều, dựng cộng đồng và niềm tin.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'MMK101',
    slug: 'mmk101-management-and-marketing',
    title: 'Management and Marketing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MMK101.webp',
    shortDescription: 'Intro to management & marketing — POLC functions, manager roles & skills, environment & organization, then marketing: value, STP, the 4P/7P mix, brands & customer value, digital & responsible marketing. Bilingual, real examples & quizzes.|||Nhập môn quản trị & marketing — bốn chức năng POLC, vai trò & kỹ năng nhà quản trị, môi trường & tổ chức, rồi marketing: giá trị, STP, mix 4P/7P, thương hiệu & giá trị khách hàng, marketing số & trách nhiệm. Song ngữ, ví dụ thật & quiz.',
    description: 'Môn <strong>MMK101 — Management and Marketing</strong> (Kỳ 1, khối Công nghệ Truyền thông) là môn nhập môn gộp <strong>quản trị căn bản</strong> và <strong>marketing căn bản</strong>. Từ <strong>bốn chức năng quản trị</strong> (hoạch định &amp; tổ chức &amp; lãnh đạo &amp; kiểm soát), <strong>vai trò &amp; kỹ năng nhà quản trị</strong> (Mintzberg, Katz) và <strong>môi trường &amp; tổ chức</strong> (PESTEL, cơ cấu, văn hoá) → sang <strong>marketing</strong>: giá trị &amp; quy trình, <strong>hành vi khách hàng &amp; STP</strong>, <strong>marketing mix 4P/7P</strong>, <strong>thương hiệu &amp; CLV/CRM</strong>, và <strong>marketing số &amp; trách nhiệm xã hội</strong>. Bám sách chuẩn Kotler &amp; Armstrong, Robbins &amp; Coulter, Kotler &amp; Keller; song ngữ, có mô hình, ví dụ doanh nghiệp thật và quiz mỗi chương.',
    whatYouLearn: 'Quản trị & bốn chức năng POLC; ba cấp quản trị; vai trò Mintzberg & ba kỹ năng Katz; quy trình ra quyết định; PESTEL & môi trường vi mô; cơ cấu tổ chức & văn hoá; marketing là gì (nhu cầu-mong muốn-cầu, giá trị, quy trình 5 bước); hành vi mua & STP (phân khúc-mục tiêu-định vị); marketing mix 4P/7P; thương hiệu & brand equity; CLV, CRM & lòng trung thành; marketing số, mạng xã hội, xu hướng & CSR.',
    requirements: 'Không cần kiến thức nền chuyên ngành. Chỉ cần đọc hiểu tiếng Anh cơ bản (thuật ngữ song ngữ) và quan tâm tới cách doanh nghiệp vận hành & tiếp cận khách hàng.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Kotler, Robbins), khoá miễn phí, HBR, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Quản trị & marketing là gì và vì sao đi cùng nhau.', lessons: [intro] },
    { title: 'Chương 1 — Quản trị là gì|||Chapter 1 — What is management', description: 'Khái niệm quản trị, bốn chức năng POLC, cấp quản trị.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nhà quản trị & kỹ năng|||Chapter 2 — Managers & skills', description: 'Vai trò Mintzberg, kỹ năng Katz, ra quyết định.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Môi trường & tổ chức|||Chapter 3 — Environment & organization', description: 'PESTEL, môi trường vi mô, cơ cấu, văn hoá.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Marketing là gì|||Chapter 4 — What is marketing', description: 'Nhu cầu-mong muốn-cầu, giá trị, quy trình marketing.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Hành vi khách hàng & STP|||Chapter 5 — Customer behaviour & STP', description: 'Hành vi mua, phân khúc-mục tiêu-định vị.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Marketing mix 4P/7P|||Chapter 6 — The marketing mix', description: 'Product, Price, Place, Promotion + People, Process, Physical.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thương hiệu & giá trị khách hàng|||Chapter 7 — Brand & customer value', description: 'Brand equity, CLV, CRM, lòng trung thành.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Marketing số & trách nhiệm|||Chapter 8 — Digital & responsible marketing', description: 'Digital, mạng xã hội, xu hướng, đạo đức & CSR.', lessons: [c8, c8q] },
  ],
};
