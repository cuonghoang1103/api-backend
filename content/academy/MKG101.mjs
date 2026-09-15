/**
 * MKG101 — Management and Marketing Principles. Giáo trình FLM (syl): kết hợp
 * quản trị nhập môn (Robbins "Management", Koontz "Essentials of Management")
 * + marketing nhập môn (Kotler "Principles of Marketing"). Song ngữ + ví dụ.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mkg101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">MKG101 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Management and Marketing Principles — the manager's four functions plus the marketing mind-set — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MKG101 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Management</em> — Stephen P. Robbins &amp; Mary Coulter</li>
<li><em>Principles of Marketing</em> — Philip Kotler &amp; Gary Armstrong</li>
<li><em>Essentials of Management</em> — Harold Koontz &amp; Heinz Weihrich</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://open.lib.umn.edu/principlesmanagement/" target="_blank" rel="noopener">Principles of Management — open textbook (Univ. of Minnesota Libraries)</a></li>
<li><a href="https://courses.lumenlearning.com/wm-principlesofmarketing/" target="_blank" rel="noopener">Lumen Learning — Principles of Marketing (open course)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@MarketingLagoon" target="_blank" rel="noopener">Marketing 91 / Marketing Lagoon</a> — marketing concepts explained</li>
<li><a href="https://www.youtube.com/@HBR" target="_blank" rel="noopener">Harvard Business Review</a> — management &amp; leadership case talks</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — dựng bảng SWOT, sơ đồ tổ chức, moodboard thương hiệu</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — bảng trắng cộng tác cho hoạch định &amp; brainstorm</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — bốn chức năng quản trị (POLC), vai trò nhà quản trị, khái niệm marketing cốt lõi.</li>
<li><strong>Practice</strong> — phân tích một doanh nghiệp thật qua lăng kính SWOT + 4P.</li>
<li><strong>Go deeper</strong> — STP, hành vi người tiêu dùng, thương hiệu &amp; marketing số.</li>
<li><strong>Job-ready</strong> — viết một bản kế hoạch marketing ngắn cho một sản phẩm cụ thể.</li>
</ol></div>`,
    `<span class="eyebrow">MKG101 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Nguyên lý Quản trị và Marketing — bốn chức năng của nhà quản trị và tư duy marketing — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MKG101 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Management</em> — Stephen P. Robbins &amp; Mary Coulter</li>
<li><em>Principles of Marketing</em> — Philip Kotler &amp; Gary Armstrong</li>
<li><em>Essentials of Management</em> — Harold Koontz &amp; Heinz Weihrich</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://open.lib.umn.edu/principlesmanagement/" target="_blank" rel="noopener">Principles of Management — sách mở (Thư viện Đại học Minnesota)</a></li>
<li><a href="https://courses.lumenlearning.com/wm-principlesofmarketing/" target="_blank" rel="noopener">Lumen Learning — Principles of Marketing (khoá học mở)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MarketingLagoon" target="_blank" rel="noopener">Marketing 91 / Marketing Lagoon</a> — giải thích khái niệm marketing</li>
<li><a href="https://www.youtube.com/@HBR" target="_blank" rel="noopener">Harvard Business Review</a> — case study quản trị &amp; lãnh đạo</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — dựng bảng SWOT, sơ đồ tổ chức, moodboard thương hiệu</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — bảng trắng cộng tác cho hoạch định &amp; brainstorm</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — bốn chức năng quản trị (POLC), vai trò nhà quản trị, khái niệm marketing cốt lõi.</li>
<li><strong>Luyện tập</strong> — phân tích một doanh nghiệp thật qua lăng kính SWOT + 4P.</li>
<li><strong>Đào sâu</strong> — STP, hành vi người tiêu dùng, thương hiệu &amp; marketing số.</li>
<li><strong>Sẵn sàng đi làm</strong> — viết một bản kế hoạch marketing ngắn cho một sản phẩm cụ thể.</li>
</ol></div>`,
  ]]);

const intro = doc('mkg101-0-1-overview', 'Course overview: Management and Marketing Principles|||Tổng quan: Nguyên lý Quản trị và Marketing',
  'Quản trị là gì, vai trò nhà quản trị; marketing là gì, tư duy hướng khách hàng; lộ trình 8 chương kết hợp hai mảng.',
  [[
    `<span class="eyebrow">MKG101 · Lesson 0.1 · Overview</span>
<h2>Management and Marketing Principles</h2>
<p class="lead">This course blends two foundations every business student needs: <strong>management</strong> — how organizations plan, organize, lead and control work — and <strong>marketing</strong> — how organizations create and deliver value to customers profitably.</p>
<h3>What is management?</h3>
<p><strong>Management</strong> is the process of coordinating people and resources to achieve organizational goals <em>efficiently</em> (minimum waste) and <em>effectively</em> (goals actually met). A manager's job is commonly split into four functions: <strong>Plan, Organize, Lead, Control (POLC)</strong>.</p>
<h3>What is marketing?</h3>
<p><strong>Marketing</strong> is not just advertising — it is the process of understanding customer needs and delivering value that satisfies them while building profitable customer relationships. It starts with the customer, not the product.</p>
<h3>Roadmap</h3>
<p>Ch.1–4 build the <strong>management</strong> half: overview &amp; managerial roles → planning &amp; decision making → organizing &amp; leading → controlling. Ch.5–8 build the <strong>marketing</strong> half: marketing overview &amp; customer orientation → environment &amp; consumer behavior → marketing mix (4P/7P) &amp; STP → branding, digital marketing &amp; tying it back to management.</p>`,
    `<span class="eyebrow">MKG101 · Bài 0.1 · Tổng quan</span>
<h2>Nguyên lý Quản trị và Marketing</h2>
<p class="lead">Môn này gộp hai nền tảng mà sinh viên kinh doanh nào cũng cần: <strong>quản trị</strong> — cách tổ chức hoạch định, tổ chức, lãnh đạo và kiểm soát công việc — và <strong>marketing</strong> — cách tổ chức tạo ra và trao giá trị cho khách hàng một cách có lợi nhuận.</p>
<h3>Quản trị là gì?</h3>
<p><strong>Quản trị</strong> là quá trình điều phối con người và nguồn lực để đạt mục tiêu tổ chức một cách <em>hiệu suất</em> (ít lãng phí) và <em>hiệu quả</em> (đạt được mục tiêu). Công việc của nhà quản trị thường chia thành bốn chức năng: <strong>Hoạch định, Tổ chức, Lãnh đạo, Kiểm soát (POLC)</strong>.</p>
<h3>Marketing là gì?</h3>
<p><strong>Marketing</strong> không chỉ là quảng cáo — đó là quá trình hiểu nhu cầu khách hàng và trao giá trị thoả mãn nhu cầu đó, đồng thời xây dựng quan hệ khách hàng có lợi nhuận. Nó bắt đầu từ khách hàng, không phải từ sản phẩm.</p>
<h3>Lộ trình</h3>
<p>Chương 1–4 dựng nửa <strong>quản trị</strong>: tổng quan &amp; vai trò nhà quản trị → hoạch định &amp; ra quyết định → tổ chức &amp; lãnh đạo → kiểm soát. Chương 5–8 dựng nửa <strong>marketing</strong>: tổng quan marketing &amp; định hướng khách hàng → môi trường &amp; hành vi người tiêu dùng → marketing mix (4P/7P) &amp; STP → thương hiệu, marketing số &amp; nối lại với quản trị.</p>`,
  ]]);

const c1 = doc('mkg101-1-1-management-overview', '1.1 — Management overview & the manager’s role|||1.1 — Tổng quan quản trị & vai trò nhà quản trị',
  'Định nghĩa quản trị, hiệu suất/hiệu quả, bốn chức năng POLC, ba cấp quản trị, vai trò theo Mintzberg (giao tiếp, quyết định, thông tin).',
  [[
    `<span class="eyebrow">MKG101 · Chapter 1 · Lesson 1.1</span>
<h2>Management overview &amp; the manager's role</h2>
<h3>Efficiency vs. effectiveness</h3>
<ul>
<li><strong>Efficiency</strong> — getting the most output from the least input ("doing things right").</li>
<li><strong>Effectiveness</strong> — completing activities so goals are attained ("doing the right things").</li>
</ul>
<p>A good manager needs both: a factory that makes zero defects (efficient) but the wrong product nobody buys (ineffective) still fails.</p>
<h3>The four functions — POLC</h3>
<pre><code>Plan     -> set goals, choose strategies, define action steps
Organize -> design structure, assign tasks, allocate resources
Lead     -> motivate, communicate, resolve conflict, guide people
Control  -> monitor performance, compare to goals, correct deviations
</code></pre>
<h3>Three levels of management</h3>
<ul>
<li><strong>Top managers</strong> (CEO, VP) — set overall direction and long-term strategy.</li>
<li><strong>Middle managers</strong> (department/regional heads) — translate strategy into tactics.</li>
<li><strong>First-line managers</strong> (supervisors, team leads) — direct the day-to-day work of non-managerial employees.</li>
</ul>
<h3>Mintzberg's managerial roles</h3>
<p>Henry Mintzberg grouped what managers actually do into three sets: <strong>interpersonal</strong> (figurehead, leader, liaison), <strong>informational</strong> (monitor, disseminator, spokesperson) and <strong>decisional</strong> (entrepreneur, negotiator, resource allocator, crisis handler).</p>
<div class="callout"><span class="badge">Exam tip</span> "Efficient but not effective" and "effective but not efficient" are classic exam traps — always ask both: right things? done right?</div>`,
    `<span class="eyebrow">MKG101 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan quản trị &amp; vai trò nhà quản trị</h2>
<h3>Hiệu suất và hiệu quả</h3>
<ul>
<li><strong>Hiệu suất (efficiency)</strong> — thu được nhiều đầu ra nhất từ ít đầu vào nhất ("làm đúng cách").</li>
<li><strong>Hiệu quả (effectiveness)</strong> — hoàn thành công việc để đạt mục tiêu ("làm đúng việc").</li>
</ul>
<p>Nhà quản trị tốt cần cả hai: một nhà máy làm ra sản phẩm không lỗi (hiệu suất) nhưng sai sản phẩm không ai mua (không hiệu quả) vẫn thất bại.</p>
<h3>Bốn chức năng — POLC</h3>
<pre><code>Hoạch định  -> đặt mục tiêu, chọn chiến lược, định bước hành động
Tổ chức     -> thiết kế cấu trúc, giao việc, phân bổ nguồn lực
Lãnh đạo    -> tạo động lực, giao tiếp, giải quyết xung đột, dẫn dắt người
Kiểm soát   -> theo dõi hiệu suất, so với mục tiêu, sửa sai lệch
</code></pre>
<h3>Ba cấp quản trị</h3>
<ul>
<li><strong>Cấp cao</strong> (CEO, phó tổng) — định hướng tổng thể và chiến lược dài hạn.</li>
<li><strong>Cấp trung</strong> (trưởng phòng/khu vực) — chuyển chiến lược thành chiến thuật.</li>
<li><strong>Cấp cơ sở</strong> (giám sát, trưởng nhóm) — chỉ đạo công việc hàng ngày của nhân viên không quản trị.</li>
</ul>
<h3>Vai trò nhà quản trị theo Mintzberg</h3>
<p>Henry Mintzberg gom việc nhà quản trị thực sự làm thành ba nhóm: <strong>quan hệ con người</strong> (đại diện, người lãnh đạo, người liên lạc), <strong>thông tin</strong> (giám sát, truyền tin, phát ngôn) và <strong>quyết định</strong> (khởi xướng, thương lượng, phân bổ nguồn lực, xử lý khủng hoảng).</p>
<div class="callout"><span class="badge">Mẹo thi</span> "Hiệu suất mà không hiệu quả" và "hiệu quả mà không hiệu suất" là bẫy thi kinh điển — luôn hỏi cả hai: đúng việc chưa? làm đúng cách chưa?</div>`,
  ]]);

const c1q = quiz('mkg101-quiz-1', 'Quiz 1 — Management overview|||Quiz 1 — Tổng quan quản trị', [
  { id: 'q1', question: 'Bốn chức năng quản trị (POLC) là gì?', options: ['Hoạch định, Tổ chức, Lãnh đạo, Kiểm soát', 'Sản xuất, Tài chính, Nhân sự, Bán hàng', 'Lập kế hoạch, Thực thi, Đánh giá, Thưởng', 'Tuyển dụng, Đào tạo, Trả lương, Sa thải'], correctIndex: 0, explanation: 'POLC = Plan, Organize, Lead, Control.' },
  { id: 'q2', question: 'Một nhà quản trị "hiệu suất nhưng không hiệu quả" nghĩa là?', options: ['Đạt mục tiêu nhưng tốn nhiều nguồn lực', 'Dùng ít nguồn lực nhưng không đạt mục tiêu đúng', 'Vừa tốn nguồn lực vừa không đạt mục tiêu', 'Đạt mục tiêu và tốn ít nguồn lực'], correctIndex: 1, explanation: 'Hiệu suất = tối ưu đầu vào; hiệu quả = đạt đúng mục tiêu. Có cái này không có cái kia là bẫy kinh điển.' },
  { id: 'q3', question: 'Nhà quản trị cấp nào trực tiếp chỉ đạo nhân viên không quản trị hàng ngày?', options: ['Cấp cao', 'Cấp trung', 'Cấp cơ sở (first-line)', 'Hội đồng quản trị'], correctIndex: 2, explanation: 'First-line managers giám sát công việc vận hành trực tiếp mỗi ngày.' },
]);

const c2 = doc('mkg101-2-1-planning-decision', '2.1 — Planning & decision making|||2.1 — Hoạch định & ra quyết định',
  'Sứ mệnh & mục tiêu, hoạch định chiến lược/tác nghiệp, phân tích SWOT, quy trình ra quyết định hợp lý.',
  [[
    `<span class="eyebrow">MKG101 · Chapter 2 · Lesson 2.1</span>
<h2>Planning &amp; decision making</h2>
<h3>Mission, vision, goals</h3>
<ul>
<li><strong>Mission</strong> — why the organization exists, today.</li>
<li><strong>Vision</strong> — what it aspires to become, long-term.</li>
<li><strong>Goals/objectives</strong> — specific, measurable targets that operationalize the mission (often written SMART: Specific, Measurable, Achievable, Relevant, Time-bound).</li>
</ul>
<h3>Levels of planning</h3>
<pre><code>Strategic plan  -> top level, long-term (3-5+ yrs), broad direction
Tactical plan   -> middle level, medium-term, department goals
Operational plan-> first-line level, short-term, day-to-day tasks
</code></pre>
<h3>SWOT analysis</h3>
<p>A tool to feed strategic planning: <strong>Strengths</strong> and <strong>Weaknesses</strong> are internal to the firm; <strong>Opportunities</strong> and <strong>Threats</strong> come from the external environment. Strategy aims to match strengths to opportunities while defending against threats and weaknesses.</p>
<h3>Rational decision-making process</h3>
<pre><code>1. Identify the problem
2. Identify decision criteria
3. Weigh the criteria
4. Generate alternatives
5. Analyze alternatives
6. Select the best alternative
7. Implement
8. Evaluate decision effectiveness
</code></pre>
<div class="callout"><span class="badge">Reality check</span> Managers rarely follow all 8 steps perfectly — bounded rationality means they often "satisfice" (pick a good-enough option) rather than truly optimize.</div>`,
    `<span class="eyebrow">MKG101 · Chương 2 · Bài 2.1</span>
<h2>Hoạch định &amp; ra quyết định</h2>
<h3>Sứ mệnh, tầm nhìn, mục tiêu</h3>
<ul>
<li><strong>Sứ mệnh (mission)</strong> — vì sao tổ chức tồn tại, ở hiện tại.</li>
<li><strong>Tầm nhìn (vision)</strong> — tổ chức muốn trở thành gì, về dài hạn.</li>
<li><strong>Mục tiêu (goals)</strong> — chỉ tiêu cụ thể, đo được, cụ thể hoá sứ mệnh (thường viết theo SMART: Cụ thể, Đo được, Khả thi, Liên quan, Có hạn thời gian).</li>
</ul>
<h3>Các cấp hoạch định</h3>
<pre><code>Kế hoạch chiến lược  -> cấp cao, dài hạn (3-5+ năm), định hướng rộng
Kế hoạch chiến thuật -> cấp trung, trung hạn, mục tiêu phòng ban
Kế hoạch tác nghiệp  -> cấp cơ sở, ngắn hạn, việc hàng ngày
</code></pre>
<h3>Phân tích SWOT</h3>
<p>Công cụ nuôi dữ liệu cho hoạch định chiến lược: <strong>Điểm mạnh (S)</strong> và <strong>Điểm yếu (W)</strong> thuộc nội bộ doanh nghiệp; <strong>Cơ hội (O)</strong> và <strong>Thách thức (T)</strong> đến từ môi trường bên ngoài. Chiến lược nhằm khớp điểm mạnh với cơ hội, đồng thời phòng vệ trước thách thức và điểm yếu.</p>
<h3>Quy trình ra quyết định hợp lý</h3>
<pre><code>1. Xác định vấn đề
2. Xác định tiêu chí quyết định
3. Đánh trọng số tiêu chí
4. Tạo các phương án
5. Phân tích phương án
6. Chọn phương án tốt nhất
7. Triển khai
8. Đánh giá hiệu quả quyết định
</code></pre>
<div class="callout"><span class="badge">Thực tế</span> Nhà quản trị hiếm khi theo đủ 8 bước hoàn hảo — "hợp lý có giới hạn" (bounded rationality) khiến họ thường "chọn đủ tốt" (satisfice) thay vì tối ưu tuyệt đối.</div>`,
  ]]);

const c2q = quiz('mkg101-quiz-2', 'Quiz 2 — Planning & decision|||Quiz 2 — Hoạch định & ra quyết định', [
  { id: 'q1', question: 'Trong SWOT, Điểm mạnh và Điểm yếu thuộc về đâu?', options: ['Môi trường bên ngoài', 'Nội bộ doanh nghiệp', 'Đối thủ cạnh tranh', 'Khách hàng'], correctIndex: 1, explanation: 'S (Strengths) và W (Weaknesses) là yếu tố NỘI BỘ; O và T là bên ngoài.' },
  { id: 'q2', question: 'Kế hoạch chiến lược thường do cấp nào xây dựng và có khung thời gian nào?', options: ['Cấp cơ sở, ngắn hạn', 'Cấp trung, trung hạn', 'Cấp cao, dài hạn', 'Không cấp nào, do khách hàng quyết'], correctIndex: 2, explanation: 'Kế hoạch chiến lược do cấp cao đặt, cho khung thời gian dài (3-5+ năm).' },
  { id: 'q3', question: '"Bounded rationality" (hợp lý có giới hạn) dẫn nhà quản trị tới hành vi nào?', options: ['Luôn tối ưu tuyệt đối', 'Bỏ qua ra quyết định', '"Satisfice" — chọn phương án đủ tốt', 'Chỉ quyết định theo cảm tính'], correctIndex: 2, explanation: 'Do giới hạn thời gian/thông tin, người ra quyết định thường chọn phương án "đủ tốt" thay vì tối ưu tuyệt đối.' },
]);

const c3 = doc('mkg101-3-1-organizing-leading', '3.1 — Organizing & leading|||3.1 — Tổ chức & lãnh đạo',
  'Cấu trúc tổ chức (chuyên môn hoá, cơ cấu chỉ huy, tầm kiểm soát, tập trung/phân quyền), phong cách lãnh đạo, động viên nhân viên.',
  [[
    `<span class="eyebrow">MKG101 · Chapter 3 · Lesson 3.1</span>
<h2>Organizing &amp; leading</h2>
<h3>Elements of organizational structure</h3>
<ul>
<li><strong>Work specialization</strong> — dividing tasks into separate jobs for efficiency.</li>
<li><strong>Chain of command</strong> — the line of authority from top to bottom; who reports to whom.</li>
<li><strong>Span of control</strong> — how many subordinates one manager can effectively supervise.</li>
<li><strong>Centralization vs. decentralization</strong> — where decision authority sits: concentrated at the top, or pushed down to lower levels.</li>
</ul>
<h3>Common structures</h3>
<pre><code>Functional   -> grouped by expertise (marketing, finance, operations)
Divisional   -> grouped by product/region/customer segment
Matrix       -> employees report to both a functional AND a project manager
</code></pre>
<h3>Leadership vs. management</h3>
<p><strong>Management</strong> is about planning and coordinating resources; <strong>leadership</strong> is about influencing and inspiring people toward a vision. A good manager is not automatically a good leader, and vice versa — the two skill sets overlap but are not identical.</p>
<h3>Motivation basics</h3>
<p>Two classic lenses: <strong>Maslow's hierarchy of needs</strong> (physiological → safety → social → esteem → self-actualization — lower needs must be reasonably met before higher ones motivate) and <strong>Herzberg's two-factor theory</strong> (hygiene factors like pay/conditions prevent dissatisfaction but don't motivate; motivators like recognition/growth actually drive engagement).</p>
<div class="callout"><span class="badge">Exam tip</span> "Wide span of control" pairs with fewer management layers (flatter, cheaper); "narrow span" pairs with more layers (tighter supervision, costlier).</div>`,
    `<span class="eyebrow">MKG101 · Chương 3 · Bài 3.1</span>
<h2>Tổ chức &amp; lãnh đạo</h2>
<h3>Các yếu tố của cấu trúc tổ chức</h3>
<ul>
<li><strong>Chuyên môn hoá công việc</strong> — chia nhiệm vụ thành các việc riêng để tăng hiệu suất.</li>
<li><strong>Cơ cấu chỉ huy (chain of command)</strong> — đường quyền hạn từ trên xuống dưới; ai báo cáo cho ai.</li>
<li><strong>Tầm kiểm soát (span of control)</strong> — một nhà quản trị giám sát hiệu quả được bao nhiêu cấp dưới.</li>
<li><strong>Tập trung hoá vs. phân quyền</strong> — quyền quyết định nằm ở đâu: tập trung ở cấp cao, hay đẩy xuống cấp thấp hơn.</li>
</ul>
<h3>Các cấu trúc phổ biến</h3>
<pre><code>Theo chức năng -> nhóm theo chuyên môn (marketing, tài chính, vận hành)
Theo bộ phận   -> nhóm theo sản phẩm/khu vực/phân khúc khách hàng
Ma trận        -> nhân viên báo cáo CẢ quản lý chức năng VÀ quản lý dự án
</code></pre>
<h3>Lãnh đạo khác quản trị</h3>
<p><strong>Quản trị</strong> là hoạch định và điều phối nguồn lực; <strong>lãnh đạo</strong> là gây ảnh hưởng và truyền cảm hứng cho con người hướng tới một tầm nhìn. Một nhà quản trị tốt không tự động là một người lãnh đạo tốt, và ngược lại — hai bộ kỹ năng này giao nhau nhưng không đồng nhất.</p>
<h3>Cơ bản về động viên</h3>
<p>Hai lăng kính kinh điển: <strong>Thang nhu cầu Maslow</strong> (sinh lý → an toàn → xã hội → được tôn trọng → tự thể hiện — nhu cầu thấp phải được đáp ứng tương đối trước khi nhu cầu cao động viên được) và <strong>Lý thuyết hai yếu tố Herzberg</strong> (yếu tố duy trì như lương/điều kiện làm việc chỉ ngăn bất mãn, không tạo động lực; yếu tố động viên như được công nhận/phát triển mới thực sự thúc đẩy gắn kết).</p>
<div class="callout"><span class="badge">Mẹo thi</span> "Tầm kiểm soát rộng" đi cùng ít tầng quản lý (phẳng hơn, rẻ hơn); "tầm kiểm soát hẹp" đi cùng nhiều tầng (giám sát chặt hơn, tốn hơn).</div>`,
  ]]);

const c3q = quiz('mkg101-quiz-3', 'Quiz 3 — Organizing & leading|||Quiz 3 — Tổ chức & lãnh đạo', [
  { id: 'q1', question: '"Tầm kiểm soát" (span of control) là gì?', options: ['Số phòng ban trong công ty', 'Số cấp dưới một nhà quản trị giám sát hiệu quả', 'Số mục tiêu chiến lược', 'Số sản phẩm công ty bán'], correctIndex: 1, explanation: 'Span of control = số cấp dưới trực tiếp một quản lý có thể giám sát hiệu quả.' },
  { id: 'q2', question: 'Cấu trúc nào khiến nhân viên báo cáo cho cả quản lý chức năng và quản lý dự án?', options: ['Cấu trúc chức năng', 'Cấu trúc theo bộ phận', 'Cấu trúc ma trận', 'Cấu trúc phẳng'], correctIndex: 2, explanation: 'Cấu trúc ma trận (matrix) tạo hai tuyến báo cáo song song.' },
  { id: 'q3', question: 'Theo Herzberg, yếu tố nào KHÔNG tạo động lực mà chỉ ngăn bất mãn?', options: ['Yếu tố động viên (motivators)', 'Yếu tố duy trì (hygiene factors)', 'Tầm nhìn', 'Chuyên môn hoá'], correctIndex: 1, explanation: 'Hygiene factors (lương, điều kiện làm việc) ngăn bất mãn nhưng không tự tạo động lực.' },
]);

const c4 = doc('mkg101-4-1-controlling', '4.1 — Controlling & modern management|||4.1 — Kiểm soát & quản trị hiện đại',
  'Quy trình kiểm soát 3 bước, loại kiểm soát theo thời điểm, KPI/balanced scorecard, xu hướng quản trị hiện đại (linh hoạt, dữ liệu, làm việc từ xa).',
  [[
    `<span class="eyebrow">MKG101 · Chapter 4 · Lesson 4.1</span>
<h2>Controlling &amp; modern management</h2>
<h3>The control process</h3>
<pre><code>1. Measure actual performance
2. Compare against a standard/goal
3. Take corrective action (if deviation is significant)
</code></pre>
<h3>Types of control by timing</h3>
<ul>
<li><strong>Feedforward control</strong> — before the activity happens (e.g. inspecting raw materials before production).</li>
<li><strong>Concurrent control</strong> — while the activity is happening (e.g. a supervisor watching a live production line).</li>
<li><strong>Feedback control</strong> — after the activity is done (e.g. reviewing quarterly sales results).</li>
</ul>
<h3>Measuring performance: KPIs &amp; the balanced scorecard</h3>
<p><strong>Key Performance Indicators (KPIs)</strong> are quantifiable measures tied to goals (e.g. defect rate, customer satisfaction score, revenue growth). The <strong>balanced scorecard</strong> forces managers to track performance from four angles at once, not just money: <em>financial</em>, <em>customer</em>, <em>internal processes</em>, and <em>learning &amp; growth</em>.</p>
<h3>Modern management trends</h3>
<p>Contemporary management adds: <strong>agility</strong> (fast, iterative planning instead of rigid annual plans), <strong>data-driven decisions</strong> (analytics over gut feel alone), and <strong>hybrid/remote work</strong> (control shifts from watching hours worked to measuring outcomes).</p>
<div class="callout"><span class="badge">Ties the loop</span> Control feeds back into Planning — a deviation found in Ch.4 is exactly what triggers a new decision in Ch.2's rational process. POLC is a cycle, not four separate boxes.</div>`,
    `<span class="eyebrow">MKG101 · Chương 4 · Bài 4.1</span>
<h2>Kiểm soát &amp; quản trị hiện đại</h2>
<h3>Quy trình kiểm soát</h3>
<pre><code>1. Đo hiệu suất thực tế
2. So sánh với chuẩn/mục tiêu
3. Có hành động sửa sai (nếu độ lệch đáng kể)
</code></pre>
<h3>Các loại kiểm soát theo thời điểm</h3>
<ul>
<li><strong>Kiểm soát dự phòng (feedforward)</strong> — trước khi hoạt động xảy ra (vd kiểm nguyên liệu trước khi sản xuất).</li>
<li><strong>Kiểm soát đồng thời (concurrent)</strong> — trong khi hoạt động diễn ra (vd giám sát quan sát dây chuyền trực tiếp).</li>
<li><strong>Kiểm soát phản hồi (feedback)</strong> — sau khi hoạt động kết thúc (vd rà soát kết quả bán hàng theo quý).</li>
</ul>
<h3>Đo hiệu suất: KPI &amp; bảng điểm cân bằng</h3>
<p><strong>Chỉ số hiệu suất chính (KPI)</strong> là thước đo định lượng gắn với mục tiêu (vd tỉ lệ lỗi, điểm hài lòng khách hàng, tăng trưởng doanh thu). <strong>Bảng điểm cân bằng (balanced scorecard)</strong> buộc nhà quản trị theo dõi hiệu suất từ bốn góc cùng lúc, không chỉ tiền: <em>tài chính</em>, <em>khách hàng</em>, <em>quy trình nội bộ</em>, và <em>học tập &amp; phát triển</em>.</p>
<h3>Xu hướng quản trị hiện đại</h3>
<p>Quản trị hiện đại thêm vào: <strong>linh hoạt (agility)</strong> (hoạch định lặp lại nhanh thay vì kế hoạch năm cứng nhắc), <strong>quyết định dựa trên dữ liệu</strong> (phân tích thay vì chỉ dựa cảm tính), và <strong>làm việc từ xa/kết hợp</strong> (kiểm soát chuyển từ theo dõi giờ làm sang đo kết quả).</p>
<div class="callout"><span class="badge">Khép vòng</span> Kiểm soát nạp ngược lại Hoạch định — độ lệch phát hiện ở Chương 4 chính là thứ kích hoạt một quyết định mới trong quy trình hợp lý ở Chương 2. POLC là một VÒNG lặp, không phải bốn ô rời rạc.</div>`,
  ]]);

const c4q = quiz('mkg101-quiz-4', 'Quiz 4 — Controlling|||Quiz 4 — Kiểm soát', [
  { id: 'q1', question: 'Kiểm soát diễn ra TRONG LÚC hoạt động đang xảy ra gọi là?', options: ['Feedforward', 'Concurrent', 'Feedback', 'Không có loại nào'], correctIndex: 1, explanation: 'Concurrent control giám sát trực tiếp trong lúc hoạt động diễn ra.' },
  { id: 'q2', question: 'Balanced scorecard theo dõi hiệu suất từ mấy góc?', options: ['2', '3', '4', '5'], correctIndex: 2, explanation: 'Tài chính, khách hàng, quy trình nội bộ, học tập & phát triển.' },
  { id: 'q3', question: 'Ba bước của quy trình kiểm soát, theo đúng thứ tự?', options: ['So sánh → Đo → Sửa', 'Đo → So sánh → Sửa (nếu cần)', 'Sửa → Đo → So sánh', 'Đo → Sửa → So sánh'], correctIndex: 1, explanation: 'Đo hiệu suất thực tế → so với chuẩn → hành động sửa sai nếu lệch đáng kể.' },
]);

const c5 = doc('mkg101-5-1-marketing-overview', '5.1 — Marketing overview & customer orientation|||5.1 — Tổng quan marketing & tư duy định hướng khách hàng',
  'Định nghĩa marketing hiện đại, nhu cầu/mong muốn/yêu cầu, giá trị & sự hài lòng, 5 quan điểm quản trị marketing (production đến societal/marketing concept).',
  [[
    `<span class="eyebrow">MKG101 · Chapter 5 · Lesson 5.1</span>
<h2>Marketing overview &amp; customer orientation</h2>
<h3>What marketing really is</h3>
<p>Kotler's core definition: marketing is <strong>"engaging customers and managing profitable customer relationships"</strong> — the goal is to attract new customers by promising superior value, and to keep current customers by delivering satisfaction.</p>
<h3>Needs, wants, demands</h3>
<ul>
<li><strong>Needs</strong> — basic human requirements (food, safety, belonging).</li>
<li><strong>Wants</strong> — needs shaped by culture and personality into specific objects (hungry → wants a bánh mì, not just "food").</li>
<li><strong>Demands</strong> — wants backed by buying power.</li>
</ul>
<h3>Customer value &amp; satisfaction</h3>
<p><strong>Customer value</strong> is the customer's evaluation of the difference between all the benefits and all the costs of a market offering, compared to alternatives. <strong>Satisfaction</strong> depends on a product's perceived performance relative to the buyer's expectations.</p>
<h3>Five management orientations</h3>
<pre><code>Production concept -> "make it cheap, they'll buy it" (supply-focused)
Product concept     -> "build a better product" (quality-focused)
Selling concept      -> "sell hard, push volume" (aggressive selling)
Marketing concept    -> "understand needs, deliver better than rivals" (customer-focused)
Societal concept      -> marketing concept + long-run consumer & societal well-being
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> The <strong>marketing concept</strong> (customer-first) is the modern standard being tested most; the other four are its historical predecessors — know why each one falls short.</div>`,
    `<span class="eyebrow">MKG101 · Chương 5 · Bài 5.1</span>
<h2>Tổng quan marketing &amp; tư duy định hướng khách hàng</h2>
<h3>Marketing thực chất là gì</h3>
<p>Định nghĩa cốt lõi của Kotler: marketing là <strong>"thu hút khách hàng và quản trị quan hệ khách hàng có lợi nhuận"</strong> — mục tiêu là thu hút khách hàng mới bằng lời hứa giá trị vượt trội, và giữ khách hàng hiện tại bằng cách trao sự hài lòng.</p>
<h3>Nhu cầu, mong muốn, yêu cầu</h3>
<ul>
<li><strong>Nhu cầu (needs)</strong> — yêu cầu cơ bản của con người (ăn, an toàn, thuộc về).</li>
<li><strong>Mong muốn (wants)</strong> — nhu cầu được văn hoá và cá tính định hình thành đối tượng cụ thể (đói → muốn bánh mì, không chỉ "thức ăn").</li>
<li><strong>Yêu cầu (demands)</strong> — mong muốn có khả năng chi trả đi kèm.</li>
</ul>
<h3>Giá trị & sự hài lòng của khách hàng</h3>
<p><strong>Giá trị khách hàng (customer value)</strong> là đánh giá của khách hàng về khoảng cách giữa toàn bộ lợi ích và toàn bộ chi phí của một sản phẩm/dịch vụ, so với các lựa chọn khác. <strong>Sự hài lòng (satisfaction)</strong> phụ thuộc vào hiệu năng cảm nhận của sản phẩm so với kỳ vọng của người mua.</p>
<h3>Năm quan điểm quản trị marketing</h3>
<pre><code>Quan điểm sản xuất -> "làm rẻ, khách sẽ mua" (tập trung cung)
Quan điểm sản phẩm  -> "làm sản phẩm tốt hơn" (tập trung chất lượng)
Quan điểm bán hàng   -> "bán mạnh, đẩy số lượng" (bán quyết liệt)
Quan điểm marketing  -> "hiểu nhu cầu, trao giá trị tốt hơn đối thủ" (tập trung khách hàng)
Quan điểm xã hội      -> quan điểm marketing + lợi ích lâu dài của người tiêu dùng & xã hội
</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> <strong>Quan điểm marketing</strong> (lấy khách hàng làm trung tâm) là chuẩn hiện đại được hỏi nhiều nhất; bốn quan điểm còn lại là các tiền lệ lịch sử — cần biết vì sao mỗi cái đều có hạn chế.</div>`,
  ]]);

const c5q = quiz('mkg101-quiz-5', 'Quiz 5 — Marketing overview|||Quiz 5 — Tổng quan marketing', [
  { id: 'q1', question: 'Theo Kotler, marketing là gì?', options: ['Chỉ là quảng cáo và bán hàng', 'Thu hút khách hàng và quản trị quan hệ khách hàng có lợi nhuận', 'Sản xuất hàng hoá giá rẻ', 'Chỉ là nghiên cứu thị trường'], correctIndex: 1, explanation: 'Định nghĩa cốt lõi của Kotler nhấn vào thu hút + giữ khách hàng có lợi nhuận, không chỉ bán/quảng cáo.' },
  { id: 'q2', question: '"Mong muốn" (wants) khác "nhu cầu" (needs) ở điểm nào?', options: ['Wants là nhu cầu được văn hoá/cá tính định hình cụ thể', 'Wants luôn có khả năng chi trả', 'Wants là nhu cầu cơ bản của con người', 'Không có khác biệt'], correctIndex: 0, explanation: 'Needs là cơ bản (đói); wants là hình thức cụ thể do văn hoá/cá tính định hình (muốn bánh mì).' },
  { id: 'q3', question: 'Quan điểm nào lấy khách hàng làm trung tâm và là chuẩn hiện đại?', options: ['Quan điểm sản xuất', 'Quan điểm bán hàng', 'Quan điểm marketing', 'Quan điểm sản phẩm'], correctIndex: 2, explanation: 'Marketing concept: hiểu nhu cầu khách hàng và trao giá trị tốt hơn đối thủ.' },
]);

const c6 = doc('mkg101-6-1-environment-consumer', '6.1 — Marketing environment & consumer behavior|||6.1 — Môi trường marketing & hành vi người tiêu dùng',
  'Môi trường vi mô/vĩ mô (PESTEL), quy trình quyết định mua của người tiêu dùng, yếu tố ảnh hưởng (văn hoá, xã hội, cá nhân, tâm lý).',
  [[
    `<span class="eyebrow">MKG101 · Chapter 6 · Lesson 6.1</span>
<h2>Marketing environment &amp; consumer behavior</h2>
<h3>Micro vs. macro environment</h3>
<ul>
<li><strong>Micro-environment</strong> — forces close to the company: the company itself, suppliers, marketing intermediaries, customers, competitors, and publics.</li>
<li><strong>Macro-environment</strong> — larger societal forces, often remembered as <strong>PESTEL</strong>: Political, Economic, Social, Technological, Environmental, Legal.</li>
</ul>
<h3>The consumer buying decision process</h3>
<pre><code>1. Need recognition   -> a problem/need is triggered
2. Information search  -> gather info on options
3. Evaluation of alternatives -> compare against criteria
4. Purchase decision    -> choose (and buy) an option
5. Post-purchase behavior -> satisfaction or "buyer's remorse"
</code></pre>
<h3>What shapes consumer behavior</h3>
<ul>
<li><strong>Cultural factors</strong> — culture, subculture, social class.</li>
<li><strong>Social factors</strong> — reference groups, family, roles &amp; status.</li>
<li><strong>Personal factors</strong> — age, occupation, lifestyle, economic situation.</li>
<li><strong>Psychological factors</strong> — motivation, perception, learning, beliefs &amp; attitudes.</li>
</ul>
<div class="callout"><span class="badge">Exam tip</span> PESTEL is macro (uncontrollable by the firm); the 5 forces around the company (suppliers, intermediaries, competitors, publics, customers) are micro — questions often ask you to sort a factor into the right bucket.</div>`,
    `<span class="eyebrow">MKG101 · Chương 6 · Bài 6.1</span>
<h2>Môi trường marketing &amp; hành vi người tiêu dùng</h2>
<h3>Môi trường vi mô và vĩ mô</h3>
<ul>
<li><strong>Môi trường vi mô</strong> — các lực gần doanh nghiệp: chính công ty, nhà cung cấp, trung gian marketing, khách hàng, đối thủ cạnh tranh, và công chúng.</li>
<li><strong>Môi trường vĩ mô</strong> — các lực xã hội rộng hơn, thường nhớ theo <strong>PESTEL</strong>: Chính trị, Kinh tế, Xã hội, Công nghệ, Môi trường, Pháp lý.</li>
</ul>
<h3>Quy trình quyết định mua của người tiêu dùng</h3>
<pre><code>1. Nhận biết nhu cầu    -> một vấn đề/nhu cầu được kích hoạt
2. Tìm kiếm thông tin     -> thu thập thông tin về lựa chọn
3. Đánh giá các lựa chọn  -> so sánh theo tiêu chí
4. Quyết định mua          -> chọn (và mua) một lựa chọn
5. Hành vi sau mua          -> hài lòng hoặc "hối hận sau mua"
</code></pre>
<h3>Yếu tố hình thành hành vi người tiêu dùng</h3>
<ul>
<li><strong>Yếu tố văn hoá</strong> — văn hoá, tiểu văn hoá, tầng lớp xã hội.</li>
<li><strong>Yếu tố xã hội</strong> — nhóm tham khảo, gia đình, vai trò &amp; địa vị.</li>
<li><strong>Yếu tố cá nhân</strong> — tuổi, nghề nghiệp, phong cách sống, tình trạng kinh tế.</li>
<li><strong>Yếu tố tâm lý</strong> — động cơ, nhận thức, học hỏi, niềm tin &amp; thái độ.</li>
</ul>
<div class="callout"><span class="badge">Mẹo thi</span> PESTEL thuộc vĩ mô (doanh nghiệp không kiểm soát được); 5 lực quanh công ty (nhà cung cấp, trung gian, đối thủ, công chúng, khách hàng) thuộc vi mô — đề thi thường hỏi phân loại một yếu tố vào đúng nhóm.</div>`,
  ]]);

const c6q = quiz('mkg101-quiz-6', 'Quiz 6 — Environment & consumer|||Quiz 6 — Môi trường & người tiêu dùng', [
  { id: 'q1', question: 'PESTEL thuộc loại môi trường nào?', options: ['Vi mô', 'Vĩ mô', 'Nội bộ doanh nghiệp', 'Chỉ về công nghệ'], correctIndex: 1, explanation: 'PESTEL (Chính trị, Kinh tế, Xã hội, Công nghệ, Môi trường, Pháp lý) là các lực vĩ mô, doanh nghiệp không kiểm soát được.' },
  { id: 'q2', question: 'Bước ĐẦU TIÊN trong quy trình quyết định mua của người tiêu dùng là?', options: ['Đánh giá các lựa chọn', 'Quyết định mua', 'Nhận biết nhu cầu', 'Hành vi sau mua'], correctIndex: 2, explanation: 'Quy trình bắt đầu khi một nhu cầu/vấn đề được kích hoạt (need recognition).' },
  { id: 'q3', question: 'Động cơ, nhận thức, học hỏi, niềm tin & thái độ thuộc nhóm yếu tố nào?', options: ['Văn hoá', 'Xã hội', 'Cá nhân', 'Tâm lý'], correctIndex: 3, explanation: 'Đây là các yếu tố tâm lý (psychological factors) ảnh hưởng hành vi mua.' },
]);

const c7 = doc('mkg101-7-1-mix-stp', '7.1 — Marketing mix (4P/7P) & STP|||7.1 — Marketing mix (4P/7P) & STP',
  '4P (Product, Price, Place, Promotion), mở rộng 7P cho dịch vụ (People, Process, Physical evidence), STP (Segmentation, Targeting, Positioning).',
  [[
    `<span class="eyebrow">MKG101 · Chapter 7 · Lesson 7.1</span>
<h2>Marketing mix (4P/7P) &amp; STP</h2>
<h3>The 4Ps — the classic marketing mix</h3>
<pre><code>Product   -> what you offer: features, quality, brand, packaging
Price     -> what customers pay: list price, discounts, payment terms
Place     -> how it reaches customers: channels, coverage, logistics
Promotion -> how you communicate value: advertising, sales promo, PR, personal selling
</code></pre>
<h3>Extending to 7P for services</h3>
<p>Services add three Ps because they're intangible and delivered by people: <strong>People</strong> (staff quality/training), <strong>Process</strong> (the steps of service delivery), <strong>Physical evidence</strong> (tangible cues — store design, uniforms, receipts — that signal quality).</p>
<h3>STP — Segmentation, Targeting, Positioning</h3>
<pre><code>Segmentation -> divide the market into groups with similar needs
                (demographic, geographic, psychographic, behavioral)
Targeting    -> choose which segment(s) to serve
Positioning  -> design the offer & image to occupy a distinct place
                in the target customer's mind, vs. competitors
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> STP always comes BEFORE the marketing mix in the process — you segment and target a market, THEN design the 4P/7P mix for that chosen segment. Getting the order backward is a common exam mistake.</div>`,
    `<span class="eyebrow">MKG101 · Chương 7 · Bài 7.1</span>
<h2>Marketing mix (4P/7P) &amp; STP</h2>
<h3>4P — marketing mix kinh điển</h3>
<pre><code>Product (Sản phẩm)  -> bạn cung cấp gì: tính năng, chất lượng, thương hiệu, bao bì
Price (Giá)          -> khách hàng trả gì: giá bán, khuyến mãi, điều kiện thanh toán
Place (Phân phối)    -> hàng đến khách hàng thế nào: kênh, độ phủ, logistics
Promotion (Xúc tiến) -> truyền thông giá trị thế nào: quảng cáo, khuyến mãi, PR, bán hàng cá nhân
</code></pre>
<h3>Mở rộng thành 7P cho dịch vụ</h3>
<p>Dịch vụ thêm ba P vì vô hình và được trao bởi con người: <strong>People (Con người)</strong> (chất lượng/đào tạo nhân viên), <strong>Process (Quy trình)</strong> (các bước trao dịch vụ), <strong>Physical evidence (Bằng chứng hữu hình)</strong> (dấu hiệu vật lý — thiết kế cửa hàng, đồng phục, hoá đơn — báo hiệu chất lượng).</p>
<h3>STP — Phân khúc, Chọn thị trường mục tiêu, Định vị</h3>
<pre><code>Segmentation (Phân khúc) -> chia thị trường thành nhóm nhu cầu tương tự
                             (địa lý, dân số, tâm lý, hành vi)
Targeting (Chọn mục tiêu) -> chọn phân khúc nào để phục vụ
Positioning (Định vị)      -> thiết kế sản phẩm & hình ảnh để chiếm
                             một vị trí riêng trong tâm trí khách hàng, so đối thủ
</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> STP luôn đến TRƯỚC marketing mix trong quy trình — phân khúc và chọn mục tiêu thị trường TRƯỚC, RỒI mới thiết kế 4P/7P cho phân khúc đã chọn. Đảo ngược thứ tự là lỗi thi phổ biến.</div>`,
  ]]);

const c7q = quiz('mkg101-quiz-7', 'Quiz 7 — Mix & STP|||Quiz 7 — Marketing mix & STP', [
  { id: 'q1', question: 'Ba P thêm vào khi mở rộng 4P thành 7P cho dịch vụ là gì?', options: ['Product, Price, Place', 'People, Process, Physical evidence', 'Promotion, Positioning, Perception', 'Place, Process, Promotion'], correctIndex: 1, explanation: '7P = 4P + People, Process, Physical evidence — vì dịch vụ vô hình, do con người trao.' },
  { id: 'q2', question: 'Trong STP, bước nào diễn ra ĐẦU TIÊN?', options: ['Targeting', 'Positioning', 'Segmentation', 'Promotion'], correctIndex: 2, explanation: 'Thứ tự đúng: Segmentation (phân khúc) → Targeting (chọn mục tiêu) → Positioning (định vị).' },
  { id: 'q3', question: 'STP nên diễn ra khi nào so với việc thiết kế marketing mix (4P/7P)?', options: ['Sau khi thiết kế 4P/7P', 'Trước khi thiết kế 4P/7P', 'Cùng lúc, không có thứ tự', 'Không liên quan tới 4P/7P'], correctIndex: 1, explanation: 'STP xác định phân khúc & vị trí mục tiêu TRƯỚC, sau đó mới thiết kế 4P/7P phù hợp cho phân khúc đó.' },
]);

const c8 = doc('mkg101-8-1-branding-digital-integration', '8.1 — Branding, digital marketing & tying it to management|||8.1 — Thương hiệu, marketing số & tích hợp quản trị-marketing',
  'Giá trị thương hiệu (brand equity), tài sản thương hiệu, marketing số (SEO/social/content), vì sao marketing cần POLC để thực thi.',
  [[
    `<span class="eyebrow">MKG101 · Chapter 8 · Lesson 8.1</span>
<h2>Branding, digital marketing &amp; tying it to management</h2>
<h3>What is a brand?</h3>
<p>A <strong>brand</strong> is a name, term, design, or symbol that identifies a maker's product and differentiates it from competitors. <strong>Brand equity</strong> is the value a brand adds — strong brands (e.g. Apple, Vinamilk) can charge premium prices and enjoy stronger customer loyalty purely from the name.</p>
<h3>Building brand equity</h3>
<pre><code>Brand awareness    -> can customers recognize/recall the brand?
Perceived quality   -> do customers believe it performs well?
Brand associations  -> what images/feelings does it evoke?
Brand loyalty        -> will customers keep choosing it, and pay more for it?
</code></pre>
<h3>Digital marketing essentials</h3>
<ul>
<li><strong>SEO/SEM</strong> — being found in search results (organic and paid).</li>
<li><strong>Social media marketing</strong> — engaging communities on platforms customers already use.</li>
<li><strong>Content marketing</strong> — attracting customers with useful/entertaining content rather than direct selling.</li>
<li><strong>Data &amp; personalization</strong> — using customer data to tailor messages at scale.</li>
</ul>
<h3>Closing the loop: management makes marketing happen</h3>
<p>A brilliant marketing plan still needs POLC to execute: <strong>plan</strong> the campaign and budget, <strong>organize</strong> the team and agencies, <strong>lead</strong> creative and cross-functional collaboration, and <strong>control</strong> results against KPIs (reach, conversion, ROI) — feeding learnings back into the next planning cycle. Management and marketing are two disciplines, one execution loop.</p>
<div class="callout"><span class="badge">Big picture</span> This course's real takeaway: a good product idea (marketing) dies without disciplined execution (management) — and disciplined execution without customer insight (marketing) builds the wrong thing efficiently.</div>`,
    `<span class="eyebrow">MKG101 · Chương 8 · Bài 8.1</span>
<h2>Thương hiệu, marketing số &amp; tích hợp quản trị-marketing</h2>
<h3>Thương hiệu là gì?</h3>
<p>Một <strong>thương hiệu (brand)</strong> là tên, thuật ngữ, thiết kế, hoặc biểu tượng nhận diện sản phẩm của một nhà sản xuất và phân biệt nó với đối thủ. <strong>Giá trị thương hiệu (brand equity)</strong> là giá trị mà thương hiệu cộng thêm — thương hiệu mạnh (vd Apple, Vinamilk) có thể bán giá cao hơn và có lòng trung thành khách hàng mạnh hơn chỉ từ cái tên.</p>
<h3>Xây dựng giá trị thương hiệu</h3>
<pre><code>Nhận biết thương hiệu -> khách hàng nhận ra/nhớ được thương hiệu không?
Chất lượng cảm nhận    -> khách hàng có tin nó hoạt động tốt không?
Liên tưởng thương hiệu  -> nó gợi lên hình ảnh/cảm xúc gì?
Trung thành thương hiệu  -> khách hàng có tiếp tục chọn nó, trả giá cao hơn không?
</code></pre>
<h3>Cốt lõi marketing số</h3>
<ul>
<li><strong>SEO/SEM</strong> — được tìm thấy trong kết quả tìm kiếm (tự nhiên và có trả tiền).</li>
<li><strong>Marketing trên mạng xã hội</strong> — tương tác với cộng đồng trên nền tảng khách hàng đã dùng.</li>
<li><strong>Marketing nội dung</strong> — thu hút khách hàng bằng nội dung có ích/giải trí thay vì bán trực tiếp.</li>
<li><strong>Dữ liệu &amp; cá nhân hoá</strong> — dùng dữ liệu khách hàng để tuỳ biến thông điệp ở quy mô lớn.</li>
</ul>
<h3>Khép vòng: quản trị làm marketing thành hiện thực</h3>
<p>Một kế hoạch marketing xuất sắc vẫn cần POLC để thực thi: <strong>hoạch định</strong> chiến dịch và ngân sách, <strong>tổ chức</strong> đội ngũ và agency, <strong>lãnh đạo</strong> hợp tác sáng tạo và liên phòng ban, và <strong>kiểm soát</strong> kết quả theo KPI (độ tiếp cận, chuyển đổi, ROI) — nạp lại bài học vào chu kỳ hoạch định kế tiếp. Quản trị và marketing là hai môn học, một vòng thực thi.</p>
<div class="callout"><span class="badge">Bức tranh lớn</span> Bài học thật của môn này: một ý tưởng sản phẩm tốt (marketing) chết nếu không có thực thi kỷ luật (quản trị) — và thực thi kỷ luật mà thiếu hiểu biết khách hàng (marketing) sẽ xây đúng cách nhưng sai thứ.</div>`,
  ]]);

const c8q = quiz('mkg101-quiz-8', 'Quiz 8 — Branding & digital|||Quiz 8 — Thương hiệu & marketing số', [
  { id: 'q1', question: '"Brand equity" (giá trị thương hiệu) thể hiện qua điều gì?', options: ['Chỉ số giá cổ phiếu công ty', 'Giá trị cộng thêm mà thương hiệu tạo ra (giá cao hơn, lòng trung thành)', 'Số lượng nhà máy sản xuất', 'Chỉ là logo công ty'], correctIndex: 1, explanation: 'Brand equity là giá trị thương hiệu mang lại — cho phép giá cao hơn và lòng trung thành mạnh hơn.' },
  { id: 'q2', question: 'Marketing nội dung (content marketing) khác bán hàng trực tiếp thế nào?', options: ['Nó bán hàng quyết liệt hơn', 'Nó thu hút khách hàng bằng nội dung có ích/giải trí, không bán trực tiếp', 'Nó chỉ dùng cho B2B', 'Không có khác biệt'], correctIndex: 1, explanation: 'Content marketing thu hút bằng giá trị nội dung, thay vì thông điệp bán hàng trực tiếp.' },
  { id: 'q3', question: 'Chức năng quản trị nào giúp so kết quả chiến dịch marketing với KPI đã đặt?', options: ['Hoạch định (Plan)', 'Tổ chức (Organize)', 'Lãnh đạo (Lead)', 'Kiểm soát (Control)'], correctIndex: 3, explanation: 'Kiểm soát đo kết quả thực tế (reach, conversion, ROI) so với mục tiêu KPI đã đặt.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'MKG101',
    slug: 'mkg101-management-and-marketing-principles',
    title: 'Management and Marketing Principles',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MKG101.webp',
    shortDescription: 'Manager’s four functions (Plan-Organize-Lead-Control) plus marketing fundamentals: customer orientation, environment & consumer behavior, 4P/7P mix, STP, branding & digital marketing. Bilingual, examples & quizzes.|||Bốn chức năng nhà quản trị (Hoạch định-Tổ chức-Lãnh đạo-Kiểm soát) cùng nền tảng marketing: định hướng khách hàng, môi trường & hành vi tiêu dùng, marketing mix 4P/7P, STP, thương hiệu & marketing số. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>MKG101 — Management and Marketing Principles</strong> (kỳ 1) kết hợp hai nền tảng của khối Quản trị Kinh doanh. Từ <strong>quản trị</strong>: tổng quan &amp; vai trò nhà quản trị → hoạch định &amp; ra quyết định (SWOT) → tổ chức &amp; lãnh đạo → kiểm soát (KPI, balanced scorecard). Sang <strong>marketing</strong>: tư duy định hướng khách hàng → môi trường (PESTEL) &amp; hành vi người tiêu dùng → marketing mix (4P/7P) &amp; STP → thương hiệu &amp; marketing số. Bám giáo trình FLM (Robbins, Kotler, Koontz), song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Bốn chức năng POLC & vai trò Mintzberg; SWOT & quy trình ra quyết định hợp lý; cấu trúc tổ chức (span of control, matrix) & động viên (Maslow/Herzberg); quy trình & loại kiểm soát, KPI/balanced scorecard; định nghĩa marketing & 5 quan điểm quản trị marketing; môi trường vi mô/vĩ mô (PESTEL) & quy trình quyết định mua; marketing mix 4P/7P & STP; brand equity & marketing số.',
    requirements: 'Không yêu cầu kiến thức nền — môn nhập môn kỳ 1 khối Quản trị Kinh doanh (BBA).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Quản trị là gì, marketing là gì, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan quản trị & vai trò nhà quản trị|||Chapter 1 — Management overview & roles', description: 'POLC, ba cấp quản trị, vai trò Mintzberg.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hoạch định & ra quyết định|||Chapter 2 — Planning & decision making', description: 'Sứ mệnh/mục tiêu, SWOT, quy trình ra quyết định.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tổ chức & lãnh đạo|||Chapter 3 — Organizing & leading', description: 'Cấu trúc tổ chức, lãnh đạo vs quản trị, động viên.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Kiểm soát & quản trị hiện đại|||Chapter 4 — Controlling & modern management', description: 'Quy trình kiểm soát, KPI, xu hướng hiện đại.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tổng quan marketing & định hướng khách hàng|||Chapter 5 — Marketing overview & customer orientation', description: 'Định nghĩa marketing, 5 quan điểm quản trị marketing.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Môi trường marketing & hành vi tiêu dùng|||Chapter 6 — Environment & consumer behavior', description: 'PESTEL, quy trình quyết định mua.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Marketing mix (4P/7P) & STP|||Chapter 7 — Marketing mix & STP', description: '4P/7P, phân khúc-mục tiêu-định vị.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Thương hiệu, marketing số & tích hợp|||Chapter 8 — Branding, digital & integration', description: 'Brand equity, marketing số, nối lại quản trị-marketing.', lessons: [c8, c8q] },
  ],
};
