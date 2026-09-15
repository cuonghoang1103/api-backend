/**
 * SMG301 — Sales Management. Giáo trình tham khảo (trích dẫn, KHÔNG upload PDF):
 * "Sales Management: Analysis and Decision Making" (Ingram/LaForge); "Management
 * of a Sales Force" (Spiro/Rich/Stanton). Môn này quản trị ĐỘI NGŨ bán hàng
 * (tuyển dụng, đào tạo, động lực, đãi ngộ, dự báo, lãnh thổ) — KHÁC SAL301
 * (Professional Selling, kỹ năng bán cá nhân). Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('smg301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (Ingram/LaForge; Spiro/Rich/Stanton), tài liệu chính thức miễn phí, YouTube, công cụ CRM, lộ trình tự học.',
  [[
    `<span class="eyebrow">SMG301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Sales Management</strong> — managing a sales TEAM, not personal selling skills (that's SAL301) — in one place. The full official slides live on <strong>FLM</strong>; below are the reference textbooks and free, legal resources.</p>
<h3>📘 Reference textbooks</h3>
<ul>
<li><em>Sales Management: Analysis and Decision Making</em> — Ingram, LaForge, Avila, Schwepker, Williams</li>
<li><em>Management of a Sales Force</em> — Spiro, Rich, Stanton</li>
</ul>
<p>Slide bài giảng chính thức của SMG301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://www.hubspot.com/sales" target="_blank" rel="noopener">HubSpot Sales Resources</a> — sales management guides, templates, forecasting tools</li>
<li><a href="https://www.salesforce.com/resources/articles/sales-management/" target="_blank" rel="noopener">Salesforce — Sales Management Guides</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@SalesforceNews" target="_blank" rel="noopener">Salesforce</a> — CRM &amp; sales team management content</li>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot</a> — sales leadership &amp; process content</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.salesforce.com/" target="_blank" rel="noopener">Salesforce CRM</a> — pipeline, forecasting, territory &amp; quota management</li>
<li><a href="https://www.hubspot.com/products/crm" target="_blank" rel="noopener">HubSpot CRM</a> — free CRM with sales reporting</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — sales manager's role, planning &amp; forecasting, org &amp; territory design.</li>
<li><strong>People systems</strong> — recruiting, selection, training, motivation, compensation.</li>
<li><strong>Running the team</strong> — leadership, supervision, sales culture.</li>
<li><strong>Job-ready</strong> — evaluating performance, sales analysis, CRM &amp; sales technology.</li>
</ol></div>`,
    `<span class="eyebrow">SMG301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quản trị Bán hàng</strong> — quản trị ĐỘI NGŨ bán hàng, không phải kỹ năng bán cá nhân (đó là SAL301) — gom về một chỗ. Slide chính thức nằm trên <strong>FLM</strong>; bên dưới là giáo trình tham khảo và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình tham khảo</h3>
<ul>
<li><em>Sales Management: Analysis and Decision Making</em> — Ingram, LaForge, Avila, Schwepker, Williams</li>
<li><em>Management of a Sales Force</em> — Spiro, Rich, Stanton</li>
</ul>
<p>Slide bài giảng chính thức của SMG301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.hubspot.com/sales" target="_blank" rel="noopener">HubSpot Sales Resources</a> — hướng dẫn quản trị bán hàng, mẫu biểu, công cụ dự báo</li>
<li><a href="https://www.salesforce.com/resources/articles/sales-management/" target="_blank" rel="noopener">Salesforce — Hướng dẫn Quản trị Bán hàng</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@SalesforceNews" target="_blank" rel="noopener">Salesforce</a> — nội dung CRM &amp; quản trị đội bán</li>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot</a> — nội dung lãnh đạo &amp; quy trình bán hàng</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.salesforce.com/" target="_blank" rel="noopener">Salesforce CRM</a> — pipeline, dự báo, quản lý lãnh thổ &amp; định mức</li>
<li><a href="https://www.hubspot.com/products/crm" target="_blank" rel="noopener">HubSpot CRM</a> — CRM miễn phí kèm báo cáo bán hàng</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — vai trò giám đốc bán hàng, hoạch định &amp; dự báo, tổ chức &amp; lãnh thổ.</li>
<li><strong>Hệ thống con người</strong> — tuyển dụng, lựa chọn, đào tạo, động lực, đãi ngộ.</li>
<li><strong>Vận hành đội bán</strong> — lãnh đạo, giám sát, văn hoá đội bán.</li>
<li><strong>Sẵn sàng đi làm</strong> — đánh giá hiệu suất, phân tích doanh số, CRM &amp; công nghệ bán hàng.</li>
</ol></div>`,
  ]]);

const intro = doc('smg301-0-1-overview', 'Course overview: Sales Management — managing the SALES TEAM|||Tổng quan: Quản trị Bán hàng — quản trị ĐỘI NGŨ bán hàng',
  'Quản trị bán hàng khác kỹ năng bán cá nhân (SAL301) thế nào; vai trò chiến lược của giám đốc bán hàng; lộ trình 8 chương: hoạch định → tổ chức → con người → vận hành → đánh giá.',
  [[
    `<span class="eyebrow">SMG301 · Lesson 0.1 · Overview</span>
<h2>Sales Management</h2>
<p class="lead">This course is about <strong>managing a SALES TEAM</strong> — not about how one salesperson sells (that's <strong>SAL301 — Professional Selling</strong>). A sales manager never touches most of the individual deals; their job is to build and run the <em>system</em> that makes many salespeople productive: planning what to sell and how much, organizing who sells to whom, hiring and training the right people, motivating and paying them, leading and supervising day to day, and evaluating whether it's working.</p>
<h3>Selling vs. managing a sales force</h3>
<table><tr><th>Professional selling (SAL301)</th><th>Sales management (SMG301)</th></tr>
<tr><td>One salesperson, one customer</td><td>A whole sales <em>team</em> across many customers</td></tr>
<tr><td>Prospecting, presenting, closing, handling objections</td><td>Forecasting, territory design, hiring, training, pay plans, coaching, CRM</td></tr>
<tr><td>Skill of the individual</td><td>Design of the system the individuals work inside</td></tr>
</table>
<h3>The sales manager's core functions</h3>
<ul>
<li><strong>Plan</strong> — set sales goals, forecast demand, build the sales budget.</li>
<li><strong>Organize</strong> — design the sales organization structure and sales territories.</li>
<li><strong>Staff</strong> — recruit, select, and onboard salespeople.</li>
<li><strong>Develop</strong> — train the team; build skills over time.</li>
<li><strong>Motivate &amp; compensate</strong> — design pay plans, incentives, contests.</li>
<li><strong>Lead &amp; supervise</strong> — coach, direct, and manage day-to-day performance and culture.</li>
<li><strong>Evaluate</strong> — measure performance, analyze sales data, use CRM &amp; sales technology.</li>
</ul>
<h3>Roadmap</h3>
<p>Ch.1 role of the sales manager → Ch.2 planning &amp; forecasting → Ch.3 organization &amp; territory design → Ch.4 recruiting &amp; selection → Ch.5 training &amp; development → Ch.6 motivation &amp; compensation → Ch.7 leadership, supervision &amp; culture → Ch.8 performance evaluation, sales analysis &amp; CRM/technology.</p>`,
    `<span class="eyebrow">SMG301 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị Bán hàng</h2>
<p class="lead">Môn này nói về <strong>quản trị ĐỘI NGŨ bán hàng</strong> — không nói về cách một nhân viên bán hàng cá nhân bán được hàng (đó là <strong>SAL301 — Professional Selling</strong>). Giám đốc bán hàng hầu như không trực tiếp chốt từng đơn; việc của họ là dựng và vận hành <em>hệ thống</em> giúp nhiều nhân viên bán hàng cùng làm việc hiệu quả: hoạch định bán gì &amp; bao nhiêu, tổ chức ai bán cho ai, tuyển &amp; đào tạo đúng người, tạo động lực &amp; trả lương, lãnh đạo &amp; giám sát hằng ngày, và đánh giá xem có hiệu quả không.</p>
<h3>Bán hàng cá nhân vs. quản trị đội bán</h3>
<table><tr><th>Bán hàng chuyên nghiệp (SAL301)</th><th>Quản trị bán hàng (SMG301)</th></tr>
<tr><td>Một nhân viên, một khách hàng</td><td>Cả một <em>đội</em> bán qua nhiều khách hàng</td></tr>
<tr><td>Tìm khách, trình bày, chốt, xử lý phản đối</td><td>Dự báo, thiết kế lãnh thổ, tuyển dụng, đào tạo, chính sách lương, huấn luyện, CRM</td></tr>
<tr><td>Kỹ năng của cá nhân</td><td>Thiết kế hệ thống mà các cá nhân làm việc trong đó</td></tr>
</table>
<h3>Các chức năng cốt lõi của giám đốc bán hàng</h3>
<ul>
<li><strong>Hoạch định</strong> — đặt mục tiêu doanh số, dự báo nhu cầu, xây ngân sách bán hàng.</li>
<li><strong>Tổ chức</strong> — thiết kế cơ cấu tổ chức lực lượng bán và lãnh thổ bán hàng.</li>
<li><strong>Nhân sự</strong> — tuyển dụng, lựa chọn, và hội nhập nhân viên bán hàng.</li>
<li><strong>Phát triển</strong> — đào tạo đội ngũ; xây kỹ năng theo thời gian.</li>
<li><strong>Tạo động lực &amp; đãi ngộ</strong> — thiết kế chính sách lương, khuyến khích, thi đua.</li>
<li><strong>Lãnh đạo &amp; giám sát</strong> — huấn luyện, chỉ đạo, quản lý hiệu suất &amp; văn hoá hằng ngày.</li>
<li><strong>Đánh giá</strong> — đo hiệu suất, phân tích dữ liệu bán hàng, dùng CRM &amp; công nghệ bán hàng.</li>
</ul>
<h3>Lộ trình</h3>
<p>Chương 1 vai trò giám đốc bán hàng → Chương 2 hoạch định &amp; dự báo → Chương 3 tổ chức &amp; lãnh thổ → Chương 4 tuyển dụng &amp; lựa chọn → Chương 5 đào tạo &amp; phát triển → Chương 6 động lực &amp; đãi ngộ → Chương 7 lãnh đạo, giám sát &amp; văn hoá → Chương 8 đánh giá hiệu suất, phân tích doanh số &amp; CRM/công nghệ.</p>`,
  ]]);

const c1 = doc('smg301-1-1-role', '1.1 — Overview of sales management & the sales manager\'s role|||1.1 — Tổng quan quản trị bán hàng & vai trò giám đốc bán hàng',
  'Quản trị bán hàng là quản trị lực lượng bán (không phải kỹ năng bán cá nhân); vị trí giám đốc bán hàng nối chiến lược công ty — marketing — bán hàng; các cấp quản trị bán hàng.',
  [[
    `<span class="eyebrow">SMG301 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of sales management &amp; the sales manager's role</h2>
<h3>What is sales management?</h3>
<p><strong>Sales management</strong> is the process of planning, organizing, staffing, training, leading, and evaluating the personal-selling activities of a firm — i.e. managing a group of salespeople, not being one. It sits at the intersection of <strong>corporate strategy</strong> (what business are we in), <strong>marketing strategy</strong> (which markets, what value proposition), and <strong>sales strategy</strong> (how the sales force executes that in the field).</p>
<h3>Levels of sales management</h3>
<ul>
<li><strong>Top sales management (VP of Sales)</strong> — sets overall sales strategy, links to corporate/marketing strategy.</li>
<li><strong>Field sales management (regional / district sales manager)</strong> — implements strategy, manages territories and first-line managers.</li>
<li><strong>First-line sales management (sales supervisor)</strong> — directly supervises salespeople day to day.</li>
</ul>
<h3>The sales manager's job is NOT selling</h3>
<p>A common mistake is promoting the best salesperson into management and expecting them to just "sell harder, but for the team." A sales manager's real output is the <em>team's</em> results — achieved through the functions covered in this course: forecasting, territory design, hiring, training, motivating/paying, leading, and evaluating. Someone great at closing deals may be poor at these if never trained for them.</p>
<pre><code>Strategy chain:
 Corporate strategy  (what businesses/markets to compete in)
        |
 Marketing strategy  (segmentation, targeting, positioning, 4Ps)
        |
 Sales strategy      (how the sales force executes: who sells what, to whom, how)
        |
 Sales management     (plan -> organize -> staff -> train -> motivate -> lead -> evaluate)
</code></pre>
<div class="callout"><span class="badge">Key distinction</span> SAL301 teaches how ONE person sells to ONE customer. SMG301 teaches how to build and run the SYSTEM behind many salespeople — that system is what a sales manager is actually responsible for.</div>`,
    `<span class="eyebrow">SMG301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan quản trị bán hàng &amp; vai trò giám đốc bán hàng</h2>
<h3>Quản trị bán hàng là gì?</h3>
<p><strong>Quản trị bán hàng</strong> là quá trình hoạch định, tổ chức, tuyển dụng, đào tạo, lãnh đạo và đánh giá hoạt động bán hàng cá nhân của một doanh nghiệp — nghĩa là quản trị một NHÓM nhân viên bán hàng, không phải tự mình đi bán. Nó nằm ở giao điểm của <strong>chiến lược công ty</strong> (kinh doanh trong ngành nào), <strong>chiến lược marketing</strong> (thị trường nào, giá trị đề xuất gì) và <strong>chiến lược bán hàng</strong> (lực lượng bán thực thi điều đó ngoài thị trường thế nào).</p>
<h3>Các cấp quản trị bán hàng</h3>
<ul>
<li><strong>Quản trị bán hàng cấp cao (Giám đốc Kinh doanh/VP Sales)</strong> — đặt chiến lược bán hàng tổng thể, gắn với chiến lược công ty/marketing.</li>
<li><strong>Quản trị bán hàng khu vực (giám đốc vùng/khu vực)</strong> — triển khai chiến lược, quản lý lãnh thổ và giám sát viên tuyến đầu.</li>
<li><strong>Quản trị bán hàng tuyến đầu (giám sát bán hàng)</strong> — giám sát trực tiếp nhân viên bán hàng hằng ngày.</li>
</ul>
<h3>Việc của giám đốc bán hàng KHÔNG PHẢI là đi bán</h3>
<p>Một sai lầm phổ biến là đề bạt nhân viên bán hàng giỏi nhất lên làm quản lý và kỳ vọng họ "bán hăng hơn, nhưng cho cả đội." Đầu ra thật của giám đốc bán hàng là kết quả của <em>cả đội</em> — đạt được qua các chức năng trong môn này: dự báo, thiết kế lãnh thổ, tuyển dụng, đào tạo, tạo động lực/trả lương, lãnh đạo, và đánh giá. Người rất giỏi chốt đơn có thể yếu ở những việc này nếu chưa từng được đào tạo.</p>
<pre><code>Chuỗi chiến lược:
 Chiến lược công ty   (cạnh tranh trong ngành/thị trường nào)
        |
 Chiến lược marketing (phân khúc, mục tiêu, định vị, 4P)
        |
 Chiến lược bán hàng  (lực lượng bán thực thi: ai bán gì, cho ai, cách nào)
        |
 Quản trị bán hàng    (hoạch định -> tổ chức -> tuyển -> đào tạo -> động lực -> lãnh đạo -> đánh giá)
</code></pre>
<div class="callout"><span class="badge">Phân biệt chính</span> SAL301 dạy cách MỘT người bán cho MỘT khách hàng. SMG301 dạy cách dựng và vận hành HỆ THỐNG phía sau nhiều nhân viên bán hàng — hệ thống đó mới là điều giám đốc bán hàng thật sự chịu trách nhiệm.</div>`,
  ]]);

const c1q = quiz('smg301-quiz-1', 'Quiz 1 — Role of the sales manager|||Quiz 1 — Vai trò giám đốc bán hàng', [
  { id: 'q1', question: 'Quản trị bán hàng khác kỹ năng bán cá nhân (SAL301) ở điểm nào?', options: ['Không có gì khác', 'Quản trị bán hàng lo hệ thống cho cả ĐỘI NGŨ, không phải kỹ năng của một cá nhân', 'Quản trị bán hàng chỉ dạy cách chốt đơn nhanh hơn', 'SAL301 mới quản lý cả đội'], correctIndex: 1, explanation: 'SMG301 = hoạch định, tổ chức, tuyển dụng, đào tạo, động lực, lãnh đạo, đánh giá cho cả lực lượng bán.' },
  { id: 'q2', question: 'Sai lầm phổ biến khi đề bạt quản lý bán hàng là gì?', options: ['Chọn người giỏi phân tích số liệu', 'Đề bạt người bán giỏi nhất và kỳ vọng họ "bán hăng hơn cho cả đội" mà không đào tạo kỹ năng quản trị', 'Chọn người mới vào công ty', 'Không có sai lầm nào'], correctIndex: 1, explanation: 'Kỹ năng chốt đơn cá nhân không tự động thành kỹ năng quản trị đội bán.' },
  { id: 'q3', question: 'Chuỗi chiến lược đúng thứ tự là?', options: ['Chiến lược bán hàng → chiến lược công ty → chiến lược marketing', 'Chiến lược công ty → chiến lược marketing → chiến lược bán hàng', 'Chiến lược marketing → chiến lược bán hàng → chiến lược công ty', 'Cả ba độc lập, không liên quan'], correctIndex: 1, explanation: 'Chiến lược công ty định hướng marketing, marketing định hướng cách lực lượng bán thực thi.' },
]);

const c2 = doc('smg301-2-1-forecasting', '2.1 — Sales planning & forecasting|||2.1 — Hoạch định & dự báo doanh số',
  'Dự báo định tính (ý kiến chuyên gia, tổng hợp lực lượng bán, Delphi) và định lượng (chuỗi thời gian, hồi quy); từ dự báo ra định mức (quota) và ngân sách bán hàng.',
  [[
    `<span class="eyebrow">SMG301 · Chapter 2 · Lesson 2.1</span>
<h2>Sales planning &amp; forecasting</h2>
<h3>Why forecast?</h3>
<p>A <strong>sales forecast</strong> — an estimate of sales for a future period — drives almost every other sales management decision: how big a sales force to have, how to set territories and quotas, how much to budget, how much inventory/production to plan. A wrong forecast cascades into every downstream decision.</p>
<h3>Qualitative forecasting methods</h3>
<ul>
<li><strong>Jury of executive opinion</strong> — pool the judgment of senior managers.</li>
<li><strong>Sales force composite</strong> — aggregate estimates from salespeople who know their own accounts/territories best.</li>
<li><strong>Delphi technique</strong> — anonymous, iterative rounds of expert estimates until they converge.</li>
</ul>
<h3>Quantitative forecasting methods</h3>
<ul>
<li><strong>Time-series / moving average</strong> — project future sales from the trend in past sales data.</li>
<li><strong>Regression analysis</strong> — model sales as a function of drivers (e.g. ad spend, GDP, number of salespeople).</li>
</ul>
<h3>From forecast to quota and budget</h3>
<p>The total forecast is broken down into a <strong>sales quota</strong> per territory/salesperson (a performance target) and rolled into the <strong>sales budget</strong> (planned expenses: salaries, travel, samples, promotion) needed to hit that forecast.</p>
<pre><code>Forecast (company total) -> split by territory/product
  -> Quota per salesperson  (the target they're measured against)
  -> Sales budget           (expense plan to support hitting the forecast)
</code></pre>
<div class="callout"><span class="badge">No single method is enough</span> Good sales managers <em>combine</em> qualitative judgment (sales force composite) with quantitative trend data — each catches errors the other method misses.</div>`,
    `<span class="eyebrow">SMG301 · Chương 2 · Bài 2.1</span>
<h2>Hoạch định &amp; dự báo doanh số</h2>
<h3>Vì sao phải dự báo?</h3>
<p><strong>Dự báo doanh số</strong> — ước tính doanh số cho một kỳ tương lai — chi phối hầu hết các quyết định quản trị bán hàng khác: quy mô lực lượng bán cần bao nhiêu, đặt lãnh thổ &amp; định mức thế nào, ngân sách bao nhiêu, kế hoạch tồn kho/sản xuất ra sao. Dự báo sai sẽ kéo theo sai lệch ở mọi quyết định phía sau.</p>
<h3>Phương pháp dự báo định tính</h3>
<ul>
<li><strong>Ý kiến ban điều hành</strong> — tổng hợp phán đoán của các quản lý cấp cao.</li>
<li><strong>Tổng hợp lực lượng bán</strong> — cộng ước tính từ chính nhân viên bán hàng, người hiểu khách hàng/lãnh thổ của họ nhất.</li>
<li><strong>Kỹ thuật Delphi</strong> — nhiều vòng ước tính ẩn danh của chuyên gia cho tới khi các con số hội tụ.</li>
</ul>
<h3>Phương pháp dự báo định lượng</h3>
<ul>
<li><strong>Chuỗi thời gian / trung bình động</strong> — chiếu xu hướng doanh số quá khứ ra tương lai.</li>
<li><strong>Phân tích hồi quy</strong> — mô hình hoá doanh số theo các yếu tố tác động (vd chi phí quảng cáo, GDP, số nhân viên bán hàng).</li>
</ul>
<h3>Từ dự báo ra định mức và ngân sách</h3>
<p>Tổng dự báo được chia nhỏ thành <strong>định mức (quota)</strong> cho từng lãnh thổ/nhân viên (mục tiêu để đánh giá), và dựng thành <strong>ngân sách bán hàng</strong> (chi phí dự kiến: lương, công tác, hàng mẫu, khuyến mãi) cần để đạt dự báo đó.</p>
<pre><code>Dự báo (tổng công ty) -> chia theo lãnh thổ/sản phẩm
  -> Định mức từng nhân viên  (mục tiêu để đo hiệu suất)
  -> Ngân sách bán hàng       (kế hoạch chi phí để hỗ trợ đạt dự báo)
</code></pre>
<div class="callout"><span class="badge">Không có phương pháp nào là đủ</span> Giám đốc bán hàng giỏi <em>kết hợp</em> phán đoán định tính (tổng hợp lực lượng bán) với dữ liệu xu hướng định lượng — mỗi phương pháp bắt được lỗi mà phương pháp kia bỏ sót.</div>`,
  ]]);

const c2q = quiz('smg301-quiz-2', 'Quiz 2 — Planning & forecasting|||Quiz 2 — Hoạch định & dự báo', [
  { id: 'q1', question: 'Phương pháp dự báo nào dùng ước tính ẨN DANH nhiều vòng của chuyên gia đến khi hội tụ?', options: ['Tổng hợp lực lượng bán', 'Kỹ thuật Delphi', 'Hồi quy', 'Trung bình động'], correctIndex: 1, explanation: 'Delphi: các vòng ước tính ẩn danh, lặp lại tới khi hội tụ.' },
  { id: 'q2', question: 'Định mức (quota) của một nhân viên bán hàng được rút ra từ đâu?', options: ['Ý muốn cá nhân của nhân viên', 'Tổng dự báo doanh số, chia theo lãnh thổ/nhân viên', 'Ngân sách quảng cáo năm trước', 'Số giờ làm việc'], correctIndex: 1, explanation: 'Dự báo tổng → chia nhỏ → thành định mức từng lãnh thổ/nhân viên.' },
  { id: 'q3', question: 'Vì sao nên kết hợp cả phương pháp định tính và định lượng khi dự báo?', options: ['Vì luật yêu cầu', 'Vì mỗi phương pháp bắt được lỗi mà phương pháp kia bỏ sót', 'Vì định lượng luôn sai', 'Vì định tính không cần dữ liệu'], correctIndex: 1, explanation: 'Phán đoán con người và dữ liệu xu hướng bổ sung cho nhau, giảm rủi ro dự báo lệch.' },
]);

const c3 = doc('smg301-3-1-org-territory', '3.1 — Sales organization design & territory alignment|||3.1 — Thiết kế tổ chức lực lượng bán & phân chia lãnh thổ',
  'Cơ cấu tổ chức lực lượng bán (theo địa lý, sản phẩm, khách hàng, chức năng, khách hàng lớn); quy trình thiết kế lãnh thổ theo tải công việc (workload method).',
  [[
    `<span class="eyebrow">SMG301 · Chapter 3 · Lesson 3.1</span>
<h2>Sales organization design &amp; territory alignment</h2>
<h3>Sales organization structures</h3>
<ul>
<li><strong>Geographic</strong> — each salesperson owns a region; simple, low travel cost, but weak on product/customer specialization.</li>
<li><strong>Product-based</strong> — salespeople specialize by product line; good for technical/complex products, but customers may see multiple reps.</li>
<li><strong>Customer/market-based</strong> — salespeople specialize by customer type or industry; matches buyer needs closely.</li>
<li><strong>Function-based</strong> — split by activity, e.g. new-account hunters vs. existing-account farmers.</li>
<li><strong>Key account management (KAM)</strong> — a dedicated structure for the firm's largest, most strategic customers.</li>
</ul>
<h3>Designing sales territories: the workload method</h3>
<p>A <strong>sales territory</strong> is a set of customers/prospects assigned to one salesperson. Poorly designed territories cause overwork in some, idle capacity in others, and unfair pay differences. The <strong>workload method</strong> designs territories so each salesperson has a roughly equal amount of work:</p>
<pre><code>Workload method (simplified):
1. Classify accounts (e.g. A/B/C by sales potential)
2. Decide call frequency needed per class (A: 12x/yr, B: 6x/yr, C: 2x/yr)
3. Total calls needed = sum(accounts in class x calls/yr)
4. Calls one rep can make per year = (workdays x calls/day)
5. Number of territories/reps needed = total calls needed / calls per rep
</code></pre>
<div class="callout"><span class="badge">Trade-off</span> Equal territories in <em>potential</em> (sales opportunity) are more useful than equal territories in geographic size — a small dense city territory can outsell a huge rural one.</div>`,
    `<span class="eyebrow">SMG301 · Chương 3 · Bài 3.1</span>
<h2>Thiết kế tổ chức lực lượng bán &amp; phân chia lãnh thổ</h2>
<h3>Các cơ cấu tổ chức lực lượng bán</h3>
<ul>
<li><strong>Theo địa lý</strong> — mỗi nhân viên phụ trách một vùng; đơn giản, chi phí di chuyển thấp, nhưng yếu về chuyên môn hoá theo sản phẩm/khách hàng.</li>
<li><strong>Theo sản phẩm</strong> — nhân viên chuyên biệt theo dòng sản phẩm; phù hợp sản phẩm kỹ thuật/phức tạp, nhưng một khách hàng có thể gặp nhiều nhân viên khác nhau.</li>
<li><strong>Theo khách hàng/thị trường</strong> — nhân viên chuyên biệt theo loại khách hàng hoặc ngành; sát nhu cầu người mua.</li>
<li><strong>Theo chức năng</strong> — chia theo hoạt động, vd người "săn" khách mới vs. người "chăm" khách hiện có.</li>
<li><strong>Quản trị khách hàng lớn (KAM)</strong> — cơ cấu riêng cho các khách hàng lớn, chiến lược nhất của công ty.</li>
</ul>
<h3>Thiết kế lãnh thổ bán hàng: phương pháp tải công việc</h3>
<p>Một <strong>lãnh thổ bán hàng</strong> là tập khách hàng/khách hàng tiềm năng giao cho một nhân viên. Lãnh thổ thiết kế kém gây quá tải ở người này, rảnh rỗi ở người khác, và chênh lệch thu nhập bất công. <strong>Phương pháp tải công việc (workload method)</strong> thiết kế lãnh thổ sao cho mỗi nhân viên có lượng công việc tương đương:</p>
<pre><code>Phương pháp tải công việc (rút gọn):
1. Phân loại khách hàng (vd A/B/C theo tiềm năng doanh số)
2. Xác định số lần thăm cần thiết mỗi loại (A: 12 lần/năm, B: 6, C: 2)
3. Tổng số lần thăm cần = tổng(số khách mỗi loại x số lần/năm)
4. Số lần một nhân viên thăm được mỗi năm = (ngày làm việc x số lần/ngày)
5. Số lãnh thổ/nhân viên cần = tổng số lần thăm cần / số lần một nhân viên thăm được
</code></pre>
<div class="callout"><span class="badge">Đánh đổi</span> Lãnh thổ đồng đều về <em>tiềm năng</em> (cơ hội bán) hữu ích hơn đồng đều về diện tích địa lý — một lãnh thổ đô thị nhỏ nhưng đông đúc có thể bán được nhiều hơn một lãnh thổ nông thôn rộng lớn.</div>`,
  ]]);

const c3q = quiz('smg301-quiz-3', 'Quiz 3 — Sales org & territory design|||Quiz 3 — Tổ chức & lãnh thổ bán hàng', [
  { id: 'q1', question: 'Cơ cấu tổ chức lực lượng bán nào phù hợp nhất cho sản phẩm kỹ thuật, phức tạp?', options: ['Theo địa lý', 'Theo sản phẩm', 'Theo mùa vụ', 'Không cần cơ cấu'], correctIndex: 1, explanation: 'Chuyên môn hoá theo sản phẩm giúp nhân viên nắm sâu sản phẩm kỹ thuật.' },
  { id: 'q2', question: 'Phương pháp tải công việc (workload method) dùng để làm gì?', options: ['Tính lương nhân viên', 'Thiết kế lãnh thổ sao cho lượng công việc mỗi nhân viên tương đương', 'Chọn ứng viên tuyển dụng', 'Đánh giá quảng cáo'], correctIndex: 1, explanation: 'Dựa vào phân loại khách hàng và tần suất thăm cần thiết để chia lãnh thổ công bằng.' },
  { id: 'q3', question: 'Vì sao lãnh thổ nên đồng đều về TIỀM NĂNG doanh số hơn là diện tích địa lý?', options: ['Vì diện tích không đo được', 'Vì một vùng nhỏ nhưng đông khách hàng tiềm năng có thể bán được nhiều hơn vùng rộng nhưng ít khách', 'Vì luật quy định', 'Vì khách hàng thích vùng rộng'], correctIndex: 1, explanation: 'Tiềm năng doanh số phản ánh đúng cơ hội thực tế hơn diện tích.' },
]);

const c4 = doc('smg301-4-1-recruit-select', '4.1 — Recruiting & selecting salespeople|||4.1 — Tuyển dụng & lựa chọn nhân viên bán hàng',
  'Phân tích công việc & bản mô tả công việc bán hàng; nguồn tuyển dụng; quy trình lựa chọn (hồ sơ, phỏng vấn, trắc nghiệm); realistic job preview để giảm nghỉ việc sớm.',
  [[
    `<span class="eyebrow">SMG301 · Chapter 4 · Lesson 4.1</span>
<h2>Recruiting &amp; selecting salespeople</h2>
<h3>Job analysis &amp; job description</h3>
<p>Before recruiting, a sales manager needs a <strong>job analysis</strong> (what does this sales job actually require day to day?) turned into a <strong>job description</strong> (duties, territory, reporting line) and a <strong>job qualification</strong> (skills, traits, experience needed). Skipping this step means recruiting against a vague, personal idea of "a good salesperson" instead of the actual job.</p>
<h3>Recruiting sources</h3>
<ul>
<li><strong>Internal</strong> — promote from other departments (e.g. customer service) who already know the product/company.</li>
<li><strong>External</strong> — job boards, university recruiting, referrals from current salespeople, recruiting agencies.</li>
</ul>
<h3>Selection process</h3>
<pre><code>Typical selection funnel:
 Application/resume screen -> Initial interview -> Tests
   (aptitude, personality, skills)
 -> In-depth interview(s) -> Reference/background check -> Job offer
</code></pre>
<h3>Realistic job preview (RJP)</h3>
<p>Many new salespeople quit within months because the job (rejection, travel, quota pressure) wasn't what they expected. A <strong>realistic job preview</strong> — being honest about the hard parts during recruiting/interviewing, e.g. a day shadowing a current rep — reduces early turnover by setting correct expectations before the offer, not after.</p>
<div class="callout"><span class="badge">Selection errors cost more than they look</span> A bad hire costs recruiting time, training investment, a wasted territory, and lost customer relationships when they leave — selection quality matters more in sales than in most jobs.</div>`,
    `<span class="eyebrow">SMG301 · Chương 4 · Bài 4.1</span>
<h2>Tuyển dụng &amp; lựa chọn nhân viên bán hàng</h2>
<h3>Phân tích công việc &amp; bản mô tả công việc</h3>
<p>Trước khi tuyển dụng, giám đốc bán hàng cần một <strong>phân tích công việc</strong> (công việc bán hàng này thật ra cần làm gì hằng ngày?) chuyển thành <strong>bản mô tả công việc</strong> (nhiệm vụ, lãnh thổ, báo cáo cho ai) và <strong>tiêu chuẩn ứng viên</strong> (kỹ năng, tính cách, kinh nghiệm cần). Bỏ qua bước này nghĩa là tuyển theo ý niệm mơ hồ, cá nhân về "nhân viên bán hàng giỏi" thay vì công việc thực tế.</p>
<h3>Nguồn tuyển dụng</h3>
<ul>
<li><strong>Nội bộ</strong> — đề bạt từ phòng khác (vd chăm sóc khách hàng) đã hiểu sản phẩm/công ty.</li>
<li><strong>Bên ngoài</strong> — trang tuyển dụng, tuyển tại trường đại học, giới thiệu từ nhân viên hiện tại, công ty tuyển dụng.</li>
</ul>
<h3>Quy trình lựa chọn</h3>
<pre><code>Kênh lựa chọn điển hình:
 Sàng hồ sơ/CV -> Phỏng vấn sơ bộ -> Trắc nghiệm
   (năng lực, tính cách, kỹ năng)
 -> Phỏng vấn sâu -> Kiểm tra tham chiếu/lý lịch -> Đề nghị tuyển dụng
</code></pre>
<h3>Realistic job preview (RJP) — trải nghiệm thật của công việc</h3>
<p>Nhiều nhân viên bán hàng mới nghỉ việc trong vài tháng vì công việc (bị từ chối, phải di chuyển, áp lực định mức) không như họ tưởng. <strong>Realistic job preview</strong> — thành thật về phần khó khi tuyển dụng/phỏng vấn, vd cho ứng viên đi theo một nhân viên hiện tại một ngày — giảm nghỉ việc sớm bằng cách đặt đúng kỳ vọng TRƯỚC khi nhận việc, không phải sau.</p>
<div class="callout"><span class="badge">Sai lầm tuyển dụng đắt hơn nhìn bề ngoài</span> Một lượt tuyển sai tốn thời gian tuyển dụng, đầu tư đào tạo, lãnh thổ bị lãng phí, và mất quan hệ khách hàng khi họ nghỉ — chất lượng lựa chọn quan trọng hơn hầu hết ngành nghề khác.</div>`,
  ]]);

const c4q = quiz('smg301-quiz-4', 'Quiz 4 — Recruiting & selection|||Quiz 4 — Tuyển dụng & lựa chọn', [
  { id: 'q1', question: 'Bước nào cần làm TRƯỚC khi viết bản mô tả công việc bán hàng?', options: ['Ký hợp đồng lao động', 'Phân tích công việc — xác định công việc thực tế cần làm gì', 'Trả lương', 'Đào tạo sản phẩm'], correctIndex: 1, explanation: 'Phân tích công việc là nền để viết mô tả công việc và tiêu chuẩn ứng viên đúng.' },
  { id: 'q2', question: 'Realistic job preview (RJP) giúp giảm điều gì?', options: ['Giảm lương phải trả', 'Giảm nghỉ việc sớm nhờ đặt đúng kỳ vọng trước khi nhận việc', 'Giảm số lượng ứng viên nộp hồ sơ', 'Giảm thời gian phỏng vấn'], correctIndex: 1, explanation: 'RJP cho ứng viên thấy phần khó của công việc TRƯỚC khi nhận offer, giảm sốc kỳ vọng.' },
  { id: 'q3', question: 'Vì sao tuyển sai nhân viên bán hàng đặc biệt đắt?', options: ['Vì lương nhân viên bán hàng luôn cao nhất công ty', 'Vì tốn chi phí tuyển + đào tạo, lãng phí lãnh thổ, và mất quan hệ khách hàng khi họ nghỉ', 'Vì luật lao động phạt nặng', 'Vì không thể sa thải nhân viên bán hàng'], correctIndex: 1, explanation: 'Chi phí ẩn của tuyển sai vượt xa chi phí tuyển dụng ban đầu.' },
]);

const c5 = doc('smg301-5-1-training', '5.1 — Training & developing the sales force|||5.1 — Đào tạo & phát triển đội ngũ bán',
  'Phân tích nhu cầu đào tạo; nội dung đào tạo (sản phẩm, công ty, khách hàng/thị trường, kỹ năng bán, quản lý thời gian/lãnh thổ); phương pháp đào tạo & hội nhập.',
  [[
    `<span class="eyebrow">SMG301 · Chapter 5 · Lesson 5.1</span>
<h2>Training &amp; developing the sales force</h2>
<h3>Training needs analysis</h3>
<p>Before designing a training program, identify the gap between <strong>required</strong> knowledge/skills and what the sales force <strong>currently has</strong> — via performance data, manager observation, and salesperson self-assessment. Training without a needs analysis wastes time on things the team already knows.</p>
<h3>What sales training typically covers</h3>
<ul>
<li><strong>Company knowledge</strong> — history, policies, systems (CRM, ordering).</li>
<li><strong>Product knowledge</strong> — features, benefits, how it compares to competitors.</li>
<li><strong>Market/customer knowledge</strong> — industry trends, buyer needs, competitor moves.</li>
<li><strong>Selling skills</strong> — the individual techniques taught in depth in SAL301 (prospecting, presenting, closing) — sales management decides <em>when/how much</em> of this each rep gets, not the technique itself.</li>
<li><strong>Time &amp; territory management</strong> — prioritizing accounts, routing, call planning.</li>
</ul>
<h3>Training methods</h3>
<pre><code>On-the-job training  (shadowing, field coaching)
Classroom training   (lectures, case studies)
Role-play / simulation
E-learning / self-paced modules
</code></pre>
<h3>Onboarding new hires</h3>
<p>The first weeks set the tone: structured onboarding (company knowledge → product → shadowing → supervised first calls) produces faster time-to-productivity than "sink or swim."</p>
<div class="callout"><span class="badge">Training is a system, not an event</span> One-time onboarding isn't enough — ongoing training (new products, refreshers) keeps a sales force current as the market changes.</div>`,
    `<span class="eyebrow">SMG301 · Chương 5 · Bài 5.1</span>
<h2>Đào tạo &amp; phát triển đội ngũ bán</h2>
<h3>Phân tích nhu cầu đào tạo</h3>
<p>Trước khi thiết kế chương trình đào tạo, xác định khoảng cách giữa kiến thức/kỹ năng <strong>cần có</strong> và những gì đội ngũ bán hàng <strong>đang có</strong> — qua dữ liệu hiệu suất, quan sát của quản lý, và tự đánh giá của nhân viên. Đào tạo mà không phân tích nhu cầu sẽ lãng phí thời gian vào những thứ đội ngũ đã biết.</p>
<h3>Nội dung đào tạo bán hàng điển hình</h3>
<ul>
<li><strong>Kiến thức công ty</strong> — lịch sử, chính sách, hệ thống (CRM, đặt hàng).</li>
<li><strong>Kiến thức sản phẩm</strong> — tính năng, lợi ích, so sánh với đối thủ.</li>
<li><strong>Kiến thức thị trường/khách hàng</strong> — xu hướng ngành, nhu cầu người mua, động thái đối thủ.</li>
<li><strong>Kỹ năng bán hàng</strong> — kỹ thuật cá nhân được dạy sâu ở SAL301 (tìm khách, trình bày, chốt đơn) — quản trị bán hàng quyết định <em>khi nào/bao nhiêu</em> mỗi nhân viên được đào tạo, không phải kỹ thuật bản thân.</li>
<li><strong>Quản lý thời gian &amp; lãnh thổ</strong> — ưu tiên khách hàng, lộ trình di chuyển, kế hoạch thăm khách.</li>
</ul>
<h3>Phương pháp đào tạo</h3>
<pre><code>Đào tạo tại chỗ (shadowing, huấn luyện thực địa)
Đào tạo lớp học (giảng bài, tình huống)
Nhập vai / mô phỏng
E-learning / học theo tiến độ riêng
</code></pre>
<h3>Hội nhập nhân viên mới</h3>
<p>Vài tuần đầu định hình mọi thứ: hội nhập có cấu trúc (kiến thức công ty → sản phẩm → theo sát → thăm khách có giám sát) giúp nhân viên đạt năng suất nhanh hơn so với "tự bơi."</p>
<div class="callout"><span class="badge">Đào tạo là một hệ thống, không phải một sự kiện</span> Hội nhập một lần là không đủ — đào tạo liên tục (sản phẩm mới, ôn tập) giúp đội ngũ bán luôn cập nhật theo thị trường.</div>`,
  ]]);

const c5q = quiz('smg301-quiz-5', 'Quiz 5 — Training & development|||Quiz 5 — Đào tạo & phát triển', [
  { id: 'q1', question: 'Vì sao cần phân tích nhu cầu đào tạo TRƯỚC khi thiết kế chương trình?', options: ['Để tốn nhiều tiền hơn', 'Để tránh dạy lại thứ đội ngũ đã biết, tập trung đúng khoảng cách còn thiếu', 'Vì luật yêu cầu', 'Để giảm số buổi đào tạo xuống 0'], correctIndex: 1, explanation: 'Phân tích nhu cầu xác định đúng khoảng cách giữa yêu cầu và năng lực hiện có.' },
  { id: 'q2', question: 'Trong đào tạo bán hàng, "kỹ năng bán hàng" (kỹ thuật chốt đơn, xử lý phản đối) được dạy SÂU ở đâu?', options: ['SMG301', 'SAL301', 'Không môn nào dạy', 'Chỉ học qua kinh nghiệm'], correctIndex: 1, explanation: 'SMG301 quyết định khi nào/bao nhiêu đào tạo kỹ năng bán, nhưng kỹ thuật bản thân là nội dung của SAL301.' },
  { id: 'q3', question: 'Vì sao đào tạo nên là một hệ thống LIÊN TỤC, không chỉ hội nhập một lần?', options: ['Vì nhân viên quên nhanh', 'Vì sản phẩm và thị trường thay đổi, cần đào tạo cập nhật liên tục', 'Vì luật yêu cầu đào tạo hằng tháng', 'Không cần, hội nhập một lần là đủ mãi mãi'], correctIndex: 1, explanation: 'Thị trường/sản phẩm thay đổi nên cần đào tạo bổ sung, không chỉ một lần lúc mới vào.' },
]);

const c6 = doc('smg301-6-1-motivation-pay', '6.1 — Motivating & compensating the sales force|||6.1 — Tạo động lực & đãi ngộ đội ngũ bán',
  'Lý thuyết động lực áp dụng cho nhân viên bán hàng (nhu cầu, kỳ vọng); các loại chính sách lương (lương cố định, hoa hồng, kết hợp); thi đua bán hàng & phần thưởng phi tài chính.',
  [[
    `<span class="eyebrow">SMG301 · Chapter 6 · Lesson 6.1</span>
<h2>Motivating &amp; compensating the sales force</h2>
<h3>Why motivation matters more in sales</h3>
<p>Salespeople work with less direct supervision than most jobs — often out in the field, alone with the customer. Sales management can't watch every call, so it has to design <strong>systems</strong> (pay, recognition, goals) that keep people motivated without constant oversight.</p>
<h3>Motivation theories applied to sales</h3>
<ul>
<li><strong>Needs-based (e.g. Maslow)</strong> — pay satisfies basic/security needs; recognition and advancement satisfy esteem needs.</li>
<li><strong>Expectancy theory</strong> — a salesperson is motivated when effort → performance is believable, performance → reward is believable, and the reward is valued. A broken link anywhere (e.g. "I could sell more but the territory has no potential") kills motivation.</li>
</ul>
<h3>Compensation plan types</h3>
<pre><code>Straight salary   -> fixed income; low risk, but weak incentive to sell more
Straight commission -> pay tied 100% to sales; strong incentive, high income risk
Combination plan  -> base salary + commission/bonus; the most common in practice,
                      balances income security with performance incentive
</code></pre>
<h3>Non-financial motivators</h3>
<ul>
<li><strong>Sales contests</strong> — short-term incentive drives for a specific goal (e.g. push a new product).</li>
<li><strong>Recognition programs</strong> — top-performer awards, public recognition, career advancement.</li>
</ul>
<div class="callout"><span class="badge">Pay plan shapes behavior</span> A pure commission plan can push reps to chase easy short-term sales over long-term customer relationships — the compensation design itself is a management lever, not just an expense.</div>`,
    `<span class="eyebrow">SMG301 · Chương 6 · Bài 6.1</span>
<h2>Tạo động lực &amp; đãi ngộ đội ngũ bán</h2>
<h3>Vì sao động lực quan trọng hơn trong bán hàng</h3>
<p>Nhân viên bán hàng làm việc với ít giám sát trực tiếp hơn hầu hết công việc khác — thường ở ngoài thị trường, một mình với khách hàng. Giám đốc bán hàng không thể theo sát từng cuộc gặp, nên phải thiết kế <strong>hệ thống</strong> (lương, khen thưởng, mục tiêu) giữ động lực mà không cần giám sát liên tục.</p>
<h3>Lý thuyết động lực áp dụng cho bán hàng</h3>
<ul>
<li><strong>Theo nhu cầu (vd Maslow)</strong> — lương thoả nhu cầu cơ bản/an toàn; sự công nhận và thăng tiến thoả nhu cầu được tôn trọng.</li>
<li><strong>Lý thuyết kỳ vọng (expectancy theory)</strong> — nhân viên bán hàng có động lực khi tin nỗ lực → hiệu suất là khả thi, hiệu suất → phần thưởng là khả thi, và phần thưởng đó có giá trị với họ. Đứt một mắt xích nào (vd "tôi có thể bán nhiều hơn nhưng lãnh thổ không có tiềm năng") sẽ giết động lực.</li>
</ul>
<h3>Các loại chính sách lương</h3>
<pre><code>Lương cố định       -> thu nhập ổn định; rủi ro thấp, nhưng khuyến khích bán thêm yếu
Hoa hồng thuần       -> lương gắn 100% vào doanh số; động lực mạnh, rủi ro thu nhập cao
Kết hợp (base + hoa hồng/thưởng) -> phổ biến nhất trong thực tế,
                      cân bằng an toàn thu nhập với động lực hiệu suất
</code></pre>
<h3>Động lực phi tài chính</h3>
<ul>
<li><strong>Thi đua bán hàng</strong> — chiến dịch khuyến khích ngắn hạn cho mục tiêu cụ thể (vd đẩy sản phẩm mới).</li>
<li><strong>Chương trình công nhận</strong> — giải thưởng cho người xuất sắc, công nhận công khai, thăng tiến sự nghiệp.</li>
</ul>
<div class="callout"><span class="badge">Chính sách lương định hình hành vi</span> Chính sách hoa hồng thuần có thể khiến nhân viên chạy theo đơn dễ ngắn hạn thay vì quan hệ khách hàng dài hạn — thiết kế chính sách lương chính là một công cụ quản trị, không chỉ là một khoản chi phí.</div>`,
  ]]);

const c6q = quiz('smg301-quiz-6', 'Quiz 6 — Motivation & compensation|||Quiz 6 — Động lực & đãi ngộ', [
  { id: 'q1', question: 'Theo lý thuyết kỳ vọng (expectancy theory), điều gì giết động lực nhân viên bán hàng?', options: ['Lương quá cao', 'Một mắt xích nỗ lực→hiệu suất→phần thưởng bị đứt (vd tin nỗ lực không dẫn tới kết quả)', 'Có quá nhiều khách hàng', 'Được khen thưởng công khai'], correctIndex: 1, explanation: 'Chỉ cần một mắt xích trong chuỗi nỗ lực-hiệu suất-phần thưởng không đáng tin là mất động lực.' },
  { id: 'q2', question: 'Chính sách lương nào PHỔ BIẾN NHẤT trong thực tế quản trị bán hàng?', options: ['Lương cố định thuần', 'Hoa hồng thuần', 'Kết hợp lương cố định + hoa hồng/thưởng', 'Không trả lương, chỉ thưởng cổ phần'], correctIndex: 2, explanation: 'Kết hợp cân bằng an toàn thu nhập và động lực hiệu suất, nên phổ biến nhất.' },
  { id: 'q3', question: 'Rủi ro của chính sách hoa hồng THUẦN (100% theo doanh số) là gì?', options: ['Nhân viên không có động lực bán', 'Nhân viên có thể chạy theo đơn dễ ngắn hạn, bỏ qua quan hệ khách hàng dài hạn', 'Công ty phải trả lương cố định cao', 'Không có rủi ro nào'], correctIndex: 1, explanation: 'Hoa hồng thuần tạo áp lực ngắn hạn có thể đánh đổi lợi ích dài hạn.' },
]);

const c7 = doc('smg301-7-1-leadership', '7.1 — Leadership, supervision & sales culture|||7.1 — Lãnh đạo, giám sát & văn hoá đội bán',
  'Phong cách lãnh đạo phù hợp với quản trị bán hàng; huấn luyện (coaching) & giám sát (báo cáo cuộc gọi, đi cùng thực địa); xây văn hoá đội bán có đạo đức, quản lý nghỉ việc & xung đột.',
  [[
    `<span class="eyebrow">SMG301 · Chapter 7 · Lesson 7.1</span>
<h2>Leadership, supervision &amp; sales culture</h2>
<h3>Leadership styles for sales managers</h3>
<p>Because salespeople work independently in the field, an overly directive, command-and-control style tends to backfire — it can't scale to watching every call. Effective sales leaders lean toward <strong>coaching leadership</strong>: setting clear expectations, then developing each rep's own judgment through regular feedback, rather than micromanaging every decision.</p>
<h3>Coaching vs. supervising</h3>
<ul>
<li><strong>Coaching</strong> — ongoing, developmental feedback aimed at building the salesperson's own skill (e.g. debriefing a call: what worked, what to try differently).</li>
<li><strong>Supervision tools</strong> — call reports (what accounts were visited, outcome), field visits/ride-alongs (manager observes a real call directly), CRM activity logs.</li>
</ul>
<h3>Building an ethical sales culture</h3>
<p>A sales manager sets the tone for what's acceptable: overly aggressive quotas or looking away from questionable practices (overselling, misleading claims) can produce short-term numbers but long-term reputational and legal damage. Ethical culture is built through what leaders <em>reward and tolerate</em>, not just written policy.</p>
<h3>Managing turnover &amp; conflict</h3>
<pre><code>Sources of sales-force turnover:
 Poor territory/quota design -> unfair opportunity
 Weak onboarding/training    -> early failure, discouragement
 Compensation mismatch       -> pay doesn't match effort/results
 Poor supervisor relationship -> low trust, low engagement
</code></pre>
<div class="callout"><span class="badge">Culture is a management output</span> A high-turnover, low-trust sales team is usually a symptom of management design choices (territories, pay, training, leadership style) — not just "bad hires."</div>`,
    `<span class="eyebrow">SMG301 · Chương 7 · Bài 7.1</span>
<h2>Lãnh đạo, giám sát &amp; văn hoá đội bán</h2>
<h3>Phong cách lãnh đạo cho giám đốc bán hàng</h3>
<p>Vì nhân viên bán hàng làm việc độc lập ngoài thị trường, phong cách chỉ huy — kiểm soát chặt thường phản tác dụng — không thể mở rộng để theo sát từng cuộc gặp. Lãnh đạo bán hàng hiệu quả thường nghiêng về <strong>lãnh đạo kiểu huấn luyện (coaching)</strong>: đặt kỳ vọng rõ ràng, rồi phát triển khả năng phán đoán riêng của từng nhân viên qua phản hồi thường xuyên, thay vì can thiệp vi mô từng quyết định.</p>
<h3>Huấn luyện (coaching) vs. giám sát</h3>
<ul>
<li><strong>Huấn luyện</strong> — phản hồi phát triển liên tục nhằm xây kỹ năng riêng của nhân viên (vd rút kinh nghiệm sau một cuộc gặp: điều gì hiệu quả, nên thử gì khác).</li>
<li><strong>Công cụ giám sát</strong> — báo cáo cuộc gọi (thăm khách nào, kết quả gì), đi cùng thực địa (quản lý quan sát trực tiếp một cuộc gặp thật), nhật ký hoạt động trên CRM.</li>
</ul>
<h3>Xây văn hoá đội bán có đạo đức</h3>
<p>Giám đốc bán hàng định hình điều gì được chấp nhận: định mức quá sức hoặc làm ngơ trước hành vi đáng ngờ (bán quá đà, cam kết sai sự thật) có thể ra số đẹp ngắn hạn nhưng gây tổn hại danh tiếng &amp; pháp lý dài hạn. Văn hoá đạo đức được xây từ những gì lãnh đạo <em>khen thưởng và cho phép</em>, không chỉ từ chính sách viết trên giấy.</p>
<h3>Quản lý nghỉ việc &amp; xung đột</h3>
<pre><code>Nguồn gây nghỉ việc trong lực lượng bán:
 Thiết kế lãnh thổ/định mức kém -> cơ hội không công bằng
 Hội nhập/đào tạo yếu           -> thất bại sớm, chán nản
 Đãi ngộ không khớp             -> lương không tương xứng nỗ lực/kết quả
 Quan hệ với quản lý kém        -> ít tin tưởng, ít gắn bó
</code></pre>
<div class="callout"><span class="badge">Văn hoá là đầu ra của quản trị</span> Một đội bán nghỉ việc nhiều, ít tin tưởng thường là hậu quả của các lựa chọn thiết kế quản trị (lãnh thổ, lương, đào tạo, phong cách lãnh đạo) — không chỉ là "tuyển sai người."</div>`,
  ]]);

const c7q = quiz('smg301-quiz-7', 'Quiz 7 — Leadership & sales culture|||Quiz 7 — Lãnh đạo & văn hoá đội bán', [
  { id: 'q1', question: 'Vì sao phong cách chỉ huy — kiểm soát chặt thường KHÔNG hiệu quả cho quản trị bán hàng?', options: ['Vì nhân viên bán hàng không cần lãnh đạo', 'Vì nhân viên làm việc độc lập ngoài thị trường, quản lý không thể theo sát từng cuộc gặp', 'Vì luật cấm', 'Vì tốn tiền hơn'], correctIndex: 1, explanation: 'Không thể giám sát trực tiếp mọi lúc nên cần phong cách huấn luyện/phát triển thay vì kiểm soát vi mô.' },
  { id: 'q2', question: 'Công cụ nào giúp quản lý QUAN SÁT TRỰC TIẾP một cuộc gặp bán hàng thật?', options: ['Báo cáo cuộc gọi', 'Đi cùng thực địa (field visit/ride-along)', 'Bảng lương', 'Hồ sơ tuyển dụng'], correctIndex: 1, explanation: 'Đi cùng thực địa cho phép quản lý quan sát trực tiếp, không qua báo cáo gián tiếp.' },
  { id: 'q3', question: 'Nghỉ việc cao trong đội bán thường là hậu quả của điều gì?', options: ['Chỉ do tuyển sai người, không liên quan quản trị', 'Các lựa chọn thiết kế quản trị: lãnh thổ, đãi ngộ, đào tạo, phong cách lãnh đạo', 'Thời tiết xấu', 'Khách hàng khó tính'], correctIndex: 1, explanation: 'Văn hoá và tỷ lệ nghỉ việc phần lớn là kết quả của các quyết định quản trị, không chỉ chất lượng tuyển dụng.' },
]);

const c8 = doc('smg301-8-1-evaluation-crm', '8.1 — Performance evaluation, sales analysis & CRM/sales technology|||8.1 — Đánh giá hiệu suất, phân tích doanh số & CRM/công nghệ bán hàng',
  'Tiêu chí đánh giá theo hành vi vs. theo kết quả; phân tích doanh số theo lãnh thổ/sản phẩm/khách hàng; phân tích chi phí bán hàng; vai trò của CRM & công nghệ bán hàng.',
  [[
    `<span class="eyebrow">SMG301 · Chapter 8 · Lesson 8.1</span>
<h2>Performance evaluation, sales analysis &amp; CRM/sales technology</h2>
<h3>Behavior-based vs. outcome-based evaluation</h3>
<ul>
<li><strong>Outcome-based</strong> — evaluate on results only (sales vs. quota, revenue, market share). Simple, but tells you nothing about <em>why</em> results happened, and ignores factors outside the rep's control (territory potential, economy).</li>
<li><strong>Behavior-based</strong> — evaluate on activities and effort the manager can influence (number of calls, quality of sales presentations, account planning, customer satisfaction). Gives more coaching insight, but is harder to measure objectively.</li>
</ul>
<p>Most sales organizations use a <strong>combination</strong>: outcome metrics for compensation/ranking, behavior metrics for coaching and development.</p>
<h3>Sales analysis</h3>
<pre><code>Sales analysis breaks total sales down by:
 Territory  -> which regions are under/over performing?
 Product    -> which lines drive revenue vs. which underperform?
 Customer   -> which accounts/segments generate the most value?
 Time period -> trend over months/quarters
</code></pre>
<h3>Cost &amp; profitability analysis</h3>
<p>Sales volume alone can be misleading — a <strong>cost analysis</strong> allocates selling expenses (travel, samples, support) to territories/customers to find which ones are actually <em>profitable</em>, not just high-revenue.</p>
<h3>CRM &amp; sales technology</h3>
<p>A <strong>CRM (Customer Relationship Management)</strong> system centralizes customer/account data, call history, and pipeline stages — it's the operational backbone for planning (Ch.2), territory tracking (Ch.3), supervision (Ch.7) and this chapter's analysis, all in one system.</p>
<div class="callout"><span class="badge">Full circle</span> Evaluation and analysis close the sales-management loop: what's measured here feeds back into next period's forecast (Ch.2), territory redesign (Ch.3), training needs (Ch.5) and compensation adjustments (Ch.6).</div>`,
    `<span class="eyebrow">SMG301 · Chương 8 · Bài 8.1</span>
<h2>Đánh giá hiệu suất, phân tích doanh số &amp; CRM/công nghệ bán hàng</h2>
<h3>Đánh giá theo hành vi vs. theo kết quả</h3>
<ul>
<li><strong>Theo kết quả</strong> — chỉ đánh giá kết quả (doanh số so với định mức, doanh thu, thị phần). Đơn giản, nhưng không cho biết <em>vì sao</em> có kết quả đó, và bỏ qua yếu tố ngoài tầm kiểm soát của nhân viên (tiềm năng lãnh thổ, kinh tế).</li>
<li><strong>Theo hành vi</strong> — đánh giá hoạt động và nỗ lực mà quản lý có thể tác động (số lần thăm khách, chất lượng trình bày bán hàng, kế hoạch khách hàng, độ hài lòng khách hàng). Cho nhiều gợi ý huấn luyện hơn, nhưng khó đo khách quan hơn.</li>
</ul>
<p>Hầu hết tổ chức bán hàng dùng <strong>kết hợp</strong>: chỉ số kết quả cho lương/xếp hạng, chỉ số hành vi cho huấn luyện &amp; phát triển.</p>
<h3>Phân tích doanh số</h3>
<pre><code>Phân tích doanh số chia tổng doanh số theo:
 Lãnh thổ    -> vùng nào đang dưới/vượt hiệu suất?
 Sản phẩm    -> dòng nào tạo doanh thu, dòng nào yếu?
 Khách hàng  -> khách hàng/phân khúc nào tạo giá trị nhiều nhất?
 Kỳ thời gian -> xu hướng theo tháng/quý
</code></pre>
<h3>Phân tích chi phí &amp; lợi nhuận</h3>
<p>Chỉ nhìn doanh số có thể gây hiểu sai — <strong>phân tích chi phí</strong> phân bổ chi phí bán hàng (công tác, hàng mẫu, hỗ trợ) vào lãnh thổ/khách hàng để tìm ra nơi nào thật sự <em>có lãi</em>, không chỉ doanh thu cao.</p>
<h3>CRM &amp; công nghệ bán hàng</h3>
<p>Hệ thống <strong>CRM (Quản trị Quan hệ Khách hàng)</strong> tập trung dữ liệu khách hàng/tài khoản, lịch sử liên hệ, và các giai đoạn trong pipeline — đây là xương sống vận hành cho hoạch định (Chương 2), theo dõi lãnh thổ (Chương 3), giám sát (Chương 7) và phân tích ở chương này, tất cả trong một hệ thống.</p>
<div class="callout"><span class="badge">Khép vòng tròn</span> Đánh giá &amp; phân tích khép lại chu trình quản trị bán hàng: những gì đo được ở đây phản hồi lại vào dự báo kỳ sau (Chương 2), thiết kế lại lãnh thổ (Chương 3), nhu cầu đào tạo (Chương 5) và điều chỉnh đãi ngộ (Chương 6).</div>`,
  ]]);

const c8q = quiz('smg301-quiz-8', 'Quiz 8 — Evaluation, sales analysis & CRM|||Quiz 8 — Đánh giá & CRM', [
  { id: 'q1', question: 'Đánh giá "theo kết quả" (outcome-based) có nhược điểm gì?', options: ['Quá phức tạp để đo', 'Không cho biết vì sao có kết quả đó, bỏ qua yếu tố ngoài tầm kiểm soát nhân viên', 'Không thể dùng để tính lương', 'Chỉ áp dụng được cho quản lý'], correctIndex: 1, explanation: 'Kết quả không tách được nguyên nhân do nỗ lực hay do yếu tố bên ngoài (tiềm năng lãnh thổ, kinh tế).' },
  { id: 'q2', question: 'Vì sao cần phân tích CHI PHÍ bên cạnh phân tích doanh số?', options: ['Vì doanh số cao luôn đồng nghĩa có lãi', 'Vì doanh thu cao chưa chắc có lãi — cần phân bổ chi phí để biết lãnh thổ/khách hàng nào thật sự sinh lãi', 'Vì luật kế toán yêu cầu', 'Vì chi phí không liên quan tới lãnh thổ'], correctIndex: 1, explanation: 'Doanh số cao có thể đi kèm chi phí cao hơn lợi nhuận thực tế mang lại.' },
  { id: 'q3', question: 'CRM đóng vai trò gì trong quản trị bán hàng?', options: ['Chỉ để gửi email marketing', 'Xương sống dữ liệu cho hoạch định, theo dõi lãnh thổ, giám sát và phân tích, tất cả trong một hệ thống', 'Thay thế hoàn toàn nhân viên bán hàng', 'Chỉ dùng cho kế toán'], correctIndex: 1, explanation: 'CRM tập trung dữ liệu khách hàng, lịch sử, pipeline — hỗ trợ mọi chức năng quản trị bán hàng.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'SMG301',
    slug: 'smg301-sales-management',
    title: 'Sales Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SMG301.webp',
    shortDescription: 'Managing a SALES TEAM (not individual selling — see SAL301): sales manager\'s role, planning & forecasting, org & territory design, recruiting, training, motivation & pay, leadership, performance & CRM.|||Quản trị ĐỘI NGŨ bán hàng (không phải kỹ năng bán cá nhân — xem SAL301): vai trò giám đốc bán hàng, hoạch định & dự báo, tổ chức & lãnh thổ, tuyển dụng, đào tạo, động lực & đãi ngộ, lãnh đạo, hiệu suất & CRM.',
    description: 'Môn <strong>SMG301 — Sales Management</strong> (kỳ 4) dạy cách <strong>quản trị ĐỘI NGŨ bán hàng</strong> — khác SAL301 (kỹ năng bán cá nhân). Từ <strong>vai trò giám đốc bán hàng</strong> → <strong>hoạch định &amp; dự báo doanh số</strong> → <strong>thiết kế tổ chức &amp; lãnh thổ</strong> → <strong>tuyển dụng &amp; lựa chọn</strong> → <strong>đào tạo &amp; phát triển</strong> → <strong>động lực &amp; đãi ngộ</strong> → <strong>lãnh đạo, giám sát &amp; văn hoá</strong> → <strong>đánh giá hiệu suất, phân tích doanh số &amp; CRM</strong>. Bám giáo trình Ingram/LaForge và Spiro/Rich/Stanton, song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Vai trò &amp; chức năng của giám đốc bán hàng; dự báo doanh số (định tính & định lượng), định mức & ngân sách; thiết kế cơ cấu tổ chức lực lượng bán & lãnh thổ (workload method); tuyển dụng & lựa chọn (phân tích công việc, RJP); đào tạo & hội nhập; động lực (expectancy theory) & chính sách lương (lương/hoa hồng/kết hợp); lãnh đạo kiểu coaching, giám sát & văn hoá đội bán; đánh giá hiệu suất, phân tích doanh số/chi phí & CRM.',
    requirements: 'Không yêu cầu tiên quyết đặc biệt; nên đã học hoặc học song song SAL301 (Professional Selling) để nắm khía cạnh kỹ năng bán cá nhân bổ trợ cho môn này.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Ingram/LaForge & Spiro/Rich/Stanton, tài liệu chính thức, YouTube, công cụ CRM, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Quản trị bán hàng khác SAL301 thế nào; vai trò giám đốc bán hàng; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & vai trò giám đốc bán hàng|||Chapter 1 — Overview & the sales manager\'s role', description: 'Quản trị đội bán vs. bán hàng cá nhân; các cấp quản trị.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hoạch định & dự báo doanh số|||Chapter 2 — Planning & forecasting', description: 'Dự báo định tính/định lượng, định mức, ngân sách.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tổ chức lực lượng bán & lãnh thổ|||Chapter 3 — Sales org & territory design', description: 'Cơ cấu tổ chức, phương pháp tải công việc.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tuyển dụng & lựa chọn|||Chapter 4 — Recruiting & selection', description: 'Phân tích công việc, nguồn tuyển, quy trình lựa chọn, RJP.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đào tạo & phát triển|||Chapter 5 — Training & development', description: 'Nhu cầu đào tạo, nội dung, phương pháp, hội nhập.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Động lực & đãi ngộ|||Chapter 6 — Motivation & compensation', description: 'Expectancy theory, chính sách lương, thi đua.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Lãnh đạo, giám sát & văn hoá|||Chapter 7 — Leadership, supervision & culture', description: 'Coaching, giám sát, văn hoá đạo đức, nghỉ việc.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đánh giá hiệu suất & CRM|||Chapter 8 — Performance evaluation & CRM', description: 'Đánh giá hành vi/kết quả, phân tích doanh số/chi phí, CRM.', lessons: [c8, c8q] },
  ],
};
