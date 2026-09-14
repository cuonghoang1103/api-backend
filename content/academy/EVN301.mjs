/**
 * EVN301 — Event Management (Quản trị Sự kiện chiến lược, Kỳ 7, khối BBA).
 * Giáo trình FLM (trích dẫn, không upload PDF): Bowdin et al. "Events
 * Management" (EMBOK); Getz "Event Studies" (portfolio, legacy); Goldblatt
 * "Special Events" (thiết kế trải nghiệm, ngũ quan); Van der Wagen "Event
 * Management" (quản trị dự án, tài chính). Cấp CHIẾN LƯỢC/nâng cao — khác
 * môn nhập môn EEM201 và lập kế hoạch EEP201. Song ngữ + khung mô hình + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('evn301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền tảng (Bowdin/Getz/Goldblatt/Van der Wagen), tổ chức ngành & chuẩn ISO 20121, nền tảng công nghệ sự kiện, lộ trình tự học.',
  [[
    `<span class="eyebrow">EVN301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Curated resources for <strong>strategic event management</strong> — stakeholder &amp; project management, experience design, finance, marketing, quality/ROI, sustainability and industry trends. The official FPTU slides &amp; giáo trình live on <strong>FLM</strong>; below are references established across the field.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for EVN301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core reference books</h3>
<ul>
<li><em>Events Management</em> — Bowdin, Allen, Harris, Jago &amp; McDonnell (Routledge). The standard strategic textbook: EMBOK domains, stakeholders, marketing, finance, legacy.</li>
<li><em>Event Studies: Theory, Research and Policy for Planned Events</em> — Donald Getz. Event typology, portfolio approach, impacts and legacy.</li>
<li><em>Special Events: Creating and Sustaining a New World for Celebration</em> — Joe Goldblatt. Experience design, the five senses, event branding.</li>
<li><em>Event Management: An Integrated and Practical Approach</em> — Lynn Van der Wagen. Project management, financial planning, service quality.</li>
</ul>
<h3>🌐 Industry bodies &amp; standards</h3>
<ul>
<li><a href="https://www.pcma.org" target="_blank" rel="noopener">PCMA — Professional Convention Management Association</a></li>
<li><a href="https://www.mpi.org" target="_blank" rel="noopener">MPI — Meeting Professionals International</a></li>
<li><a href="https://www.ufi.org" target="_blank" rel="noopener">UFI — the Global Association of the Exhibition Industry</a></li>
<li><a href="https://www.iso.org" target="_blank" rel="noopener">ISO</a> — sustainable event management standard <strong>ISO 20121</strong></li>
</ul>
<h3>🛠️ Event technology platforms (for reference)</h3>
<ul>
<li><a href="https://www.eventbrite.com" target="_blank" rel="noopener">Eventbrite</a> — ticketing &amp; registration</li>
<li><a href="https://www.cvent.com" target="_blank" rel="noopener">Cvent</a> — enterprise event management platform</li>
<li><a href="https://www.bizzabo.com" target="_blank" rel="noopener">Bizzabo</a> — hybrid/virtual event platform</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Strategic core</strong> — EMBOK domains, stakeholder mapping, aligning event objectives to organizational strategy.</li>
<li><strong>Delivery discipline</strong> — project management (WBS, RACI), financial modelling, quality &amp; risk.</li>
<li><strong>Value creation</strong> — experience design, branding, ROI/ROO, legacy and sustainability.</li>
<li><strong>Forward-looking</strong> — digital/hybrid formats, data-driven personalization, leading an event organization.</li>
</ol></div>`,
    `<span class="eyebrow">EVN301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Nguồn tham khảo cho <strong>quản trị sự kiện chiến lược</strong> — phân tích bên liên quan &amp; quản trị dự án, thiết kế trải nghiệm, tài chính, marketing, chất lượng/ROI, bền vững và xu hướng ngành. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các nguồn đã được kiểm chứng trong ngành.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của EVN301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><em>Events Management</em> — Bowdin, Allen, Harris, Jago &amp; McDonnell (Routledge). Giáo trình chiến lược chuẩn: các miền EMBOK, bên liên quan, marketing, tài chính, di sản.</li>
<li><em>Event Studies: Theory, Research and Policy for Planned Events</em> — Donald Getz. Phân loại sự kiện, tư duy danh mục (portfolio), tác động và di sản.</li>
<li><em>Special Events: Creating and Sustaining a New World for Celebration</em> — Joe Goldblatt. Thiết kế trải nghiệm, ngũ quan, xây dựng thương hiệu sự kiện.</li>
<li><em>Event Management: An Integrated and Practical Approach</em> — Lynn Van der Wagen. Quản trị dự án, hoạch định tài chính, chất lượng dịch vụ.</li>
</ul>
<h3>🌐 Tổ chức ngành &amp; chuẩn</h3>
<ul>
<li><a href="https://www.pcma.org" target="_blank" rel="noopener">PCMA — Professional Convention Management Association</a></li>
<li><a href="https://www.mpi.org" target="_blank" rel="noopener">MPI — Meeting Professionals International</a></li>
<li><a href="https://www.ufi.org" target="_blank" rel="noopener">UFI — Hiệp hội Toàn cầu ngành Triển lãm</a></li>
<li><a href="https://www.iso.org" target="_blank" rel="noopener">ISO</a> — chuẩn quản trị sự kiện bền vững <strong>ISO 20121</strong></li>
</ul>
<h3>🛠️ Nền tảng công nghệ sự kiện (tham khảo)</h3>
<ul>
<li><a href="https://www.eventbrite.com" target="_blank" rel="noopener">Eventbrite</a> — bán vé &amp; đăng ký</li>
<li><a href="https://www.cvent.com" target="_blank" rel="noopener">Cvent</a> — nền tảng quản trị sự kiện doanh nghiệp</li>
<li><a href="https://www.bizzabo.com" target="_blank" rel="noopener">Bizzabo</a> — nền tảng sự kiện hybrid/trực tuyến</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Lõi chiến lược</strong> — các miền EMBOK, phân tích bên liên quan, gắn mục tiêu sự kiện với chiến lược tổ chức.</li>
<li><strong>Kỷ luật triển khai</strong> — quản trị dự án (WBS, RACI), mô hình tài chính, chất lượng &amp; rủi ro.</li>
<li><strong>Tạo giá trị</strong> — thiết kế trải nghiệm, thương hiệu, ROI/ROO, di sản và bền vững.</li>
<li><strong>Hướng tới tương lai</strong> — hình thức số/hybrid, cá nhân hoá theo dữ liệu, lãnh đạo tổ chức sự kiện.</li>
</ol></div>`,
  ]]);

const intro = doc('evn301-0-1-overview', 'Course overview: Strategic Event Management|||Tổng quan: Quản trị Sự kiện Chiến lược',
  'Vì sao EVN301 là môn chiến lược/nâng cao, khác EEM201 (nhập môn) và EEP201 (lập kế hoạch); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">EVN301 · Lesson 0.1 · Overview</span>
<h2>Strategic Event Management</h2>
<p class="lead">EVN301 sits at the <strong>strategic, advanced</strong> tier of the event curriculum — distinct from an introductory course (concepts &amp; types of events) or a planning course (logistics &amp; execution checklists). Here an event is treated as a <strong>strategic instrument</strong> of the organization: something a CEO, marketing director or nonprofit board asks for BECAUSE it advances a business objective, not merely because "we always do a launch party."</p>
<h3>What "strategic" means in this course</h3>
<ul>
<li><strong>Purpose before format</strong> — start from the organization's objective (brand equity, revenue, stakeholder relationships, culture change), then choose the event format that serves it.</li>
<li><strong>Portfolio thinking</strong> — organizations rarely run one event; they run a <strong>portfolio</strong> (Getz) that must be balanced for risk, cost and strategic fit.</li>
<li><strong>Whole-lifecycle accountability</strong> — from stakeholder analysis and financial modelling through experience design, delivery, and post-event measurement of ROI/ROO and legacy.</li>
</ul>
<h3>Roadmap of the 8 chapters</h3>
<pre><code>1. Strategic role of events in the organization (EMBOK)
2. Stakeholder analysis &amp; event project management
3. Event experience design
4. Financial management &amp; revenue models
5. Strategic marketing &amp; event branding
6. Quality, service &amp; impact measurement (ROI/ROO, legacy)
7. Sustainable events &amp; social responsibility
8. Industry trends, digital/hybrid events &amp; leadership</code></pre>
<div class="callout"><span class="badge">Not EEM201 / EEP201</span> EEM201 (introductory) teaches WHAT events are and their types; EEP201 (planning) teaches HOW to plan and execute one event's logistics. EVN301 teaches how an organization <strong>governs, resources and evaluates</strong> events as a recurring strategic function.</div>`,
    `<span class="eyebrow">EVN301 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị Sự kiện Chiến lược</h2>
<p class="lead">EVN301 ở tầng <strong>chiến lược, nâng cao</strong> của chuỗi môn sự kiện — khác môn nhập môn (khái niệm &amp; loại hình sự kiện) hay môn lập kế hoạch (hậu cần &amp; checklist thực thi). Ở đây sự kiện được xem là <strong>công cụ chiến lược</strong> của tổ chức — thứ mà CEO, giám đốc marketing hay hội đồng tổ chức phi lợi nhuận yêu cầu VÌ nó đẩy một mục tiêu kinh doanh, không chỉ vì "năm nào cũng làm tiệc ra mắt".</p>
<h3>"Chiến lược" nghĩa là gì trong môn này</h3>
<ul>
<li><strong>Mục đích trước hình thức</strong> — bắt đầu từ mục tiêu tổ chức (giá trị thương hiệu, doanh thu, quan hệ bên liên quan, thay đổi văn hoá), rồi chọn hình thức sự kiện phù hợp.</li>
<li><strong>Tư duy danh mục (portfolio)</strong> — tổ chức hiếm khi chỉ chạy một sự kiện; họ vận hành một <strong>danh mục</strong> (Getz) cần cân bằng rủi ro, chi phí và mức phù hợp chiến lược.</li>
<li><strong>Chịu trách nhiệm toàn vòng đời</strong> — từ phân tích bên liên quan, mô hình tài chính, tới thiết kế trải nghiệm, triển khai, và đo ROI/ROO cùng di sản sau sự kiện.</li>
</ul>
<h3>Lộ trình 8 chương</h3>
<pre><code>1. Vai trò chiến lược của sự kiện trong tổ chức (EMBOK)
2. Phân tích bên liên quan &amp; quản trị dự án sự kiện
3. Thiết kế trải nghiệm sự kiện
4. Quản lý tài chính &amp; mô hình doanh thu
5. Marketing chiến lược &amp; xây dựng thương hiệu sự kiện
6. Chất lượng, dịch vụ &amp; đo tác động (ROI/ROO, di sản)
7. Sự kiện bền vững &amp; trách nhiệm xã hội
8. Xu hướng ngành, sự kiện số/hybrid &amp; lãnh đạo</code></pre>
<div class="callout"><span class="badge">Không phải EEM201 / EEP201</span> EEM201 (nhập môn) dạy sự kiện LÀ GÌ và các loại hình; EEP201 (lập kế hoạch) dạy CÁCH lập kế hoạch &amp; vận hành hậu cần một sự kiện. EVN301 dạy cách tổ chức <strong>quản trị, cấp nguồn lực và đánh giá</strong> sự kiện như một chức năng chiến lược lặp lại.</div>`,
  ]]);

const c1 = doc('evn301-1-1-strategic-role', '1.1 — Strategic role of events in the organization|||1.1 — Vai trò chiến lược của sự kiện trong tổ chức',
  'EMBOK 5 miền (Hành chính, Thiết kế, Marketing, Vận hành, Rủi ro) + Quản trị bên liên quan xuyên suốt; tư duy danh mục sự kiện của Getz.',
  [[
    `<span class="eyebrow">EVN301 · Chapter 1 · Lesson 1.1</span>
<h2>Strategic role of events in the organization</h2>
<h3>From operational task to strategic function</h3>
<p>An organization matures through three stages in how it treats events: (1) <strong>ad hoc</strong> — events happen when someone asks; (2) <strong>operational</strong> — a dedicated team executes events well but does not set objectives; (3) <strong>strategic</strong> — events are planned backward from organizational goals and reviewed against them, the same way a marketing campaign or a product launch would be.</p>
<h3>The EMBOK framework</h3>
<p>The <strong>Event Management Body of Knowledge (EMBOK)</strong>, adopted by Bowdin et al., organizes the discipline into five core domains that a strategic event manager must govern simultaneously:</p>
<pre><code>Administration  -&gt; budgets, staffing, contracts, reporting lines
Design          -&gt; program, experience, content, theming
Marketing       -&gt; positioning, promotion, sales, sponsorship
Operations      -&gt; logistics, site, technology, participant services
Risk            -&gt; legal, safety, financial, health, environmental
(cross-cutting) Stakeholder Management</code></pre>
<h3>Why an event manager needs a seat at the strategy table</h3>
<ul>
<li>Events are visible, time-boxed, and expensive — a poor strategic fit is hard to hide and hard to walk back once budgets are committed.</li>
<li>Objectives set the success measure BEFORE design starts — "raise brand awareness among Gen Z" and "close enterprise deals" call for very different formats, venues and guest lists.</li>
<li>A <strong>balanced scorecard</strong> for events ties each event's KPIs (attendance, leads, media value, satisfaction) back to a strategic pillar (growth, brand, retention, culture).</li>
</ul>
<div class="callout"><span class="badge">Getz's portfolio view</span> Most organizations run several events a year. Getz frames this as an <strong>event portfolio</strong> — like a financial portfolio, it should be diversified and periodically pruned: keep events that earn their strategic keep, retire or redesign the ones that don't.</div>`,
    `<span class="eyebrow">EVN301 · Chương 1 · Bài 1.1</span>
<h2>Vai trò chiến lược của sự kiện trong tổ chức</h2>
<h3>Từ việc vận hành đến chức năng chiến lược</h3>
<p>Một tổ chức trưởng thành qua ba giai đoạn trong cách nhìn về sự kiện: (1) <strong>tự phát</strong> — sự kiện xảy ra khi ai đó yêu cầu; (2) <strong>vận hành</strong> — có đội chuyên trách thực thi tốt nhưng không đặt mục tiêu; (3) <strong>chiến lược</strong> — sự kiện được lập ngược từ mục tiêu tổ chức và được rà soát dựa trên mục tiêu đó, giống một chiến dịch marketing hay một lần ra mắt sản phẩm.</p>
<h3>Khung EMBOK</h3>
<p><strong>EMBOK (Event Management Body of Knowledge)</strong>, được Bowdin và cộng sự sử dụng, chia lĩnh vực thành năm miền cốt lõi mà nhà quản trị sự kiện chiến lược phải điều hành đồng thời:</p>
<pre><code>Hành chính (Administration) -&gt; ngân sách, nhân sự, hợp đồng, tuyến báo cáo
Thiết kế (Design)           -&gt; chương trình, trải nghiệm, nội dung, chủ đề
Marketing                   -&gt; định vị, truyền thông, bán hàng, tài trợ
Vận hành (Operations)       -&gt; hậu cần, địa điểm, công nghệ, dịch vụ khách
Rủi ro (Risk)                -&gt; pháp lý, an toàn, tài chính, y tế, môi trường
(xuyên suốt) Quản trị bên liên quan (Stakeholder Management)</code></pre>
<h3>Vì sao nhà quản trị sự kiện cần một ghế trên bàn chiến lược</h3>
<ul>
<li>Sự kiện dễ thấy, có giới hạn thời gian và tốn kém — một sự kiện lệch chiến lược rất khó che và khó rút lại khi ngân sách đã cam kết.</li>
<li>Mục tiêu đặt ra thước đo thành công TRƯỚC khi thiết kế bắt đầu — "tăng nhận diện thương hiệu với Gen Z" và "chốt hợp đồng doanh nghiệp" cần hình thức, địa điểm và danh sách khách rất khác nhau.</li>
<li><strong>Bảng cân bằng điểm (balanced scorecard)</strong> cho sự kiện gắn KPI của từng sự kiện (số khách, lead, giá trị truyền thông, sự hài lòng) về một trụ chiến lược (tăng trưởng, thương hiệu, giữ chân, văn hoá).</li>
</ul>
<div class="callout"><span class="badge">Tư duy danh mục của Getz</span> Hầu hết tổ chức chạy nhiều sự kiện mỗi năm. Getz gọi đây là một <strong>danh mục sự kiện (event portfolio)</strong> — giống danh mục tài chính, nó cần được đa dạng hoá và rà soát định kỳ: giữ những sự kiện đáng công chiến lược, loại bỏ hoặc thiết kế lại những cái không đáng.</div>`,
  ]]);

const c1q = quiz('evn301-quiz-1', 'Quiz 1 — Strategic role|||Quiz 1 — Vai trò chiến lược', [
  { id: 'q1', question: 'EMBOK gồm mấy miền kiến thức cốt lõi (cộng yếu tố xuyên suốt)?', options: ['3', '5', '7', '10'], correctIndex: 1, explanation: 'EMBOK có 5 miền: Hành chính, Thiết kế, Marketing, Vận hành, Rủi ro — cộng yếu tố xuyên suốt là Quản trị bên liên quan.' },
  { id: 'q2', question: 'Khác biệt chính giữa quản lý sự kiện "vận hành" và "chiến lược" là gì?', options: ['Vận hành luôn tốn tiền hơn', 'Chiến lược đặt mục tiêu tổ chức TRƯỚC khi thiết kế sự kiện, vận hành chỉ thực thi tốt', 'Chiến lược không cần đo lường kết quả', 'Vận hành không cần quan tâm rủi ro'], correctIndex: 1, explanation: 'Giai đoạn chiến lược lập ngược từ mục tiêu tổ chức và rà soát dựa trên mục tiêu đó; vận hành chỉ thực thi.' },
  { id: 'q3', question: 'Theo Getz, tổ chức nên nhìn nhiều sự kiện trong năm như thế nào?', options: ['Từng sự kiện độc lập, không liên quan nhau', 'Một danh mục (portfolio) cần đa dạng hoá và rà soát định kỳ', 'Chỉ nên giữ đúng một sự kiện lớn nhất', 'Không cần đánh giá sự kiện nào'], correctIndex: 1, explanation: 'Getz dùng khái niệm "event portfolio" — cân bằng rủi ro, chi phí, mức phù hợp chiến lược, rà soát định kỳ.' },
]);

const c2 = doc('evn301-2-1-stakeholders-pm', '2.1 — Stakeholder analysis & event project management|||2.1 — Phân tích bên liên quan & quản trị dự án sự kiện',
  'Ma trận quyền lực/quan tâm (Mendelow); WBS, đường tới hạn (critical path), ma trận RACI cho dự án sự kiện.',
  [[
    `<span class="eyebrow">EVN301 · Chapter 2 · Lesson 2.1</span>
<h2>Stakeholder analysis &amp; event project management</h2>
<h3>Mapping stakeholders: power vs interest</h3>
<p>Every strategic event serves — and is watched by — a web of stakeholders: sponsors, attendees, venue, suppliers, local authorities, media, internal executives. The <strong>Mendelow power/interest matrix</strong> sorts them into four groups that demand different treatment:</p>
<pre><code>              Low interest        High interest
High power    Keep satisfied      Manage closely
Low power     Monitor             Keep informed</code></pre>
<p>A sponsor with high power and high interest gets a dedicated account manager and pre-approval on key decisions; a local resident with low power but potentially high interest (noise, road closure) still needs to be kept informed to avoid reputational risk.</p>
<h3>Running the event as a project</h3>
<ul>
<li><strong>Work Breakdown Structure (WBS)</strong> — decompose the event into deliverables (venue, program, marketing, F&amp;B, technology) down to assignable tasks.</li>
<li><strong>Critical path</strong> — the longest sequence of dependent tasks; delaying any task on it delays the whole event (e.g. venue contract -&gt; permit -&gt; build -&gt; rehearsal -&gt; doors open).</li>
<li><strong>RACI matrix</strong> — for each deliverable, name who is <strong>R</strong>esponsible, <strong>A</strong>ccountable, <strong>C</strong>onsulted, <strong>I</strong>nformed — the single biggest fix for "I thought someone else owned that."</li>
</ul>
<div class="callout"><span class="badge">Strategic, not just logistical</span> This is not checklist-level planning: the strategic layer decides WHICH stakeholders get a seat in governance, HOW MUCH schedule risk the organization will tolerate on the critical path, and WHO is accountable when trade-offs must be made under budget or time pressure.</div>`,
    `<span class="eyebrow">EVN301 · Chương 2 · Bài 2.1</span>
<h2>Phân tích bên liên quan &amp; quản trị dự án sự kiện</h2>
<h3>Sơ đồ hoá bên liên quan: quyền lực và mức quan tâm</h3>
<p>Mọi sự kiện chiến lược đều phục vụ — và bị theo dõi bởi — một mạng lưới bên liên quan: nhà tài trợ, khách tham dự, địa điểm, nhà cung cấp, chính quyền địa phương, báo chí, ban lãnh đạo nội bộ. <strong>Ma trận quyền lực/quan tâm (Mendelow)</strong> chia họ thành bốn nhóm cần cách xử lý khác nhau:</p>
<pre><code>                Ít quan tâm         Rất quan tâm
Quyền lực cao   Giữ hài lòng        Quản lý sát sao
Quyền lực thấp  Theo dõi            Thông báo đầy đủ</code></pre>
<p>Một nhà tài trợ quyền lực cao, quan tâm cao được cấp một quản lý tài khoản riêng và quyền duyệt trước các quyết định then chốt; một cư dân địa phương quyền lực thấp nhưng có thể rất quan tâm (tiếng ồn, cấm đường) vẫn cần được thông báo đầy đủ để tránh rủi ro danh tiếng.</p>
<h3>Vận hành sự kiện như một dự án</h3>
<ul>
<li><strong>Cấu trúc phân rã công việc (WBS)</strong> — chia sự kiện thành các sản phẩm bàn giao (địa điểm, chương trình, marketing, ẩm thực, công nghệ) xuống tới từng đầu việc có thể giao.</li>
<li><strong>Đường tới hạn (critical path)</strong> — chuỗi công việc phụ thuộc dài nhất; trễ bất kỳ việc nào trên đường này làm trễ cả sự kiện (vd hợp đồng địa điểm -&gt; xin phép -&gt; dựng -&gt; tổng duyệt -&gt; mở cửa).</li>
<li><strong>Ma trận RACI</strong> — với mỗi sản phẩm bàn giao, ghi rõ ai <strong>R</strong>ealize thực thi (Responsible), <strong>A</strong>ccountable chịu trách nhiệm cuối, <strong>C</strong>onsulted được hỏi ý kiến, <strong>I</strong>nformed được thông báo — cách chữa lớn nhất cho lỗi "tôi tưởng người khác phụ trách phần đó."</li>
</ul>
<div class="callout"><span class="badge">Chiến lược, không chỉ hậu cần</span> Đây không phải lập kế hoạch mức checklist: tầng chiến lược quyết định bên liên quan NÀO được ngồi vào bàn quản trị, tổ chức chịu được BAO NHIÊU rủi ro tiến độ trên đường tới hạn, và AI chịu trách nhiệm khi phải đánh đổi dưới áp lực ngân sách hoặc thời gian.</div>`,
  ]]);

const c2q = quiz('evn301-quiz-2', 'Quiz 2 — Stakeholders & PM|||Quiz 2 — Bên liên quan & quản trị dự án', [
  { id: 'q1', question: 'Ma trận Mendelow phân nhóm bên liên quan theo hai trục nào?', options: ['Chi phí và thời gian', 'Quyền lực (power) và mức quan tâm (interest)', 'Tuổi và giới tính', 'Địa lý và ngôn ngữ'], correctIndex: 1, explanation: 'Mendelow dùng hai trục quyền lực và mức quan tâm để chia bốn nhóm bên liên quan.' },
  { id: 'q2', question: 'Nhóm "quyền lực cao, quan tâm cao" nên được xử lý ra sao?', options: ['Bỏ qua', 'Chỉ theo dõi (monitor)', 'Quản lý sát sao (manage closely)', 'Chỉ cần thông báo'], correctIndex: 2, explanation: 'Nhóm quyền lực cao và quan tâm cao cần được quản lý sát sao, tham gia sâu vào quyết định.' },
  { id: 'q3', question: 'Ma trận RACI giúp giải quyết vấn đề phổ biến nào trong dự án sự kiện?', options: ['Thiếu ngân sách', 'Không rõ ai chịu trách nhiệm cho từng phần việc', 'Sai địa điểm tổ chức', 'Quá nhiều nhà tài trợ'], correctIndex: 1, explanation: 'RACI ghi rõ Responsible/Accountable/Consulted/Informed cho từng đầu việc, tránh chồng lấn hoặc bỏ trống trách nhiệm.' },
]);

const c3 = doc('evn301-3-1-experience-design', '3.1 — Event experience design|||3.1 — Thiết kế trải nghiệm sự kiện',
  'Kinh tế trải nghiệm (Pine & Gilmore); hành trình khách (pre-event → post-event); thiết kế ngũ quan của Goldblatt; chủ đề, kể chuyện, cá nhân hoá.',
  [[
    `<span class="eyebrow">EVN301 · Chapter 3 · Lesson 3.1</span>
<h2>Event experience design</h2>
<h3>The experience economy</h3>
<p>Pine &amp; Gilmore's <strong>experience economy</strong> argues that once commodities, goods and services are commoditized, organizations differentiate through staged <strong>experiences</strong> that engage guests personally and memorably. An event is, by nature, an experience-economy product — its value lives in the guest's memory, not in a physical object they take home.</p>
<h3>Designing the guest journey</h3>
<pre><code>Pre-event      -&gt; invitation, expectation-setting, anticipation
Arrival        -&gt; first impression (registration, welcome, wayfinding)
Core program   -&gt; peak emotional/content moments, pacing, surprise
Departure      -&gt; closing moment, takeaway, thank-you
Post-event     -&gt; follow-up, content reuse, community continuation</code></pre>
<p>Goldblatt frames design around the <strong>five senses</strong> — sight (staging, lighting, colour), sound (music, acoustics, MC), smell (catering, venue), taste (F&amp;B), touch (materials, seating, temperature) — because emotional memory is multisensory, not just visual.</p>
<h3>Theming, storytelling &amp; personalization</h3>
<ul>
<li><strong>Theming</strong> ties every touchpoint (visuals, script, F&amp;B, music) to one coherent narrative, so the event reads as designed, not assembled.</li>
<li><strong>Co-creation</strong> — letting attendees shape sessions, polls or content — raises perceived ownership and satisfaction.</li>
<li><strong>Personalization</strong> — data-driven agendas, badges, seating — turns a mass event into something that feels individually designed.</li>
</ul>
<div class="callout"><span class="badge">Design serves strategy</span> Experience design choices must trace back to Chapter 1's objectives: a lead-generation conference designs the journey around networking peaks; a brand-launch gala designs it around one unforgettable reveal moment.</div>`,
    `<span class="eyebrow">EVN301 · Chương 3 · Bài 3.1</span>
<h2>Thiết kế trải nghiệm sự kiện</h2>
<h3>Kinh tế trải nghiệm</h3>
<p><strong>Kinh tế trải nghiệm</strong> của Pine &amp; Gilmore cho rằng khi hàng hoá và dịch vụ đã bị "hàng hoá hoá", tổ chức tạo khác biệt bằng những <strong>trải nghiệm</strong> được dàn dựng, chạm đến khách theo cách cá nhân và đáng nhớ. Sự kiện, theo bản chất, là một sản phẩm của kinh tế trải nghiệm — giá trị của nó nằm trong ký ức của khách, không nằm ở một vật thể họ mang về.</p>
<h3>Thiết kế hành trình khách</h3>
<pre><code>Trước sự kiện  -&gt; thư mời, đặt kỳ vọng, tạo sự chờ đợi
Đến nơi        -&gt; ấn tượng đầu tiên (đăng ký, chào đón, chỉ dẫn đường)
Chương trình chính -&gt; điểm cao trào cảm xúc/nội dung, nhịp độ, bất ngờ
Ra về          -&gt; khoảnh khắc kết, quà lưu niệm, lời tri ân
Sau sự kiện    -&gt; theo dõi, tái sử dụng nội dung, duy trì cộng đồng</code></pre>
<p>Goldblatt xây khung thiết kế theo <strong>ngũ quan</strong> — thị giác (dàn dựng, ánh sáng, màu sắc), thính giác (âm nhạc, âm học, MC), khứu giác (ẩm thực, địa điểm), vị giác (thức ăn/đồ uống), xúc giác (vật liệu, ghế ngồi, nhiệt độ) — vì ký ức cảm xúc mang tính đa giác quan, không chỉ thị giác.</p>
<h3>Chủ đề, kể chuyện &amp; cá nhân hoá</h3>
<ul>
<li><strong>Chủ đề (theming)</strong> gắn mọi điểm chạm (hình ảnh, lời dẫn, ẩm thực, âm nhạc) vào một mạch truyện thống nhất, để sự kiện đọc như được thiết kế, không phải lắp ghép.</li>
<li><strong>Cùng kiến tạo (co-creation)</strong> — để khách định hình một phần phiên, bình chọn hoặc nội dung — tăng cảm giác sở hữu và sự hài lòng.</li>
<li><strong>Cá nhân hoá</strong> — lịch trình, thẻ tên, sơ đồ ngồi theo dữ liệu — biến một sự kiện đại chúng thành thứ cảm giác được thiết kế riêng cho từng người.</li>
</ul>
<div class="callout"><span class="badge">Thiết kế phục vụ chiến lược</span> Lựa chọn thiết kế trải nghiệm phải bám về mục tiêu ở Chương 1: một hội nghị tạo lead thiết kế hành trình quanh các điểm cao trào kết nối; một gala ra mắt thương hiệu thiết kế quanh một khoảnh khắc tiết lộ khó quên.</div>`,
  ]]);

const c3q = quiz('evn301-quiz-3', 'Quiz 3 — Experience design|||Quiz 3 — Thiết kế trải nghiệm', [
  { id: 'q1', question: 'Theo kinh tế trải nghiệm (Pine & Gilmore), giá trị của sự kiện nằm ở đâu?', options: ['Vật phẩm mang về', 'Trải nghiệm và cảm xúc đọng lại trong tâm trí khách', 'Giá vé rẻ', 'Số lượng gian hàng'], correctIndex: 1, explanation: 'Kinh tế trải nghiệm nhấn mạnh giá trị nằm ở ký ức và cảm xúc, không phải vật thể hữu hình.' },
  { id: 'q2', question: 'Goldblatt gợi ý thiết kế sự kiện dựa trên yếu tố nào để tạo ký ức cảm xúc?', options: ['Chỉ hình ảnh (thị giác)', 'Cả năm giác quan (ngũ quan)', 'Chỉ âm thanh', 'Chỉ giá cả'], correctIndex: 1, explanation: 'Goldblatt dùng khung ngũ quan — thị, thính, khứu, vị, xúc giác — vì ký ức cảm xúc là đa giác quan.' },
  { id: 'q3', question: '"Co-creation" trong thiết kế trải nghiệm nghĩa là gì?', options: ['Ban tổ chức quyết định 100%, khách chỉ xem', 'Để khách tham gia định hình một phần nội dung/trải nghiệm', 'Không cần lên kế hoạch trước', 'Chỉ áp dụng cho sự kiện online'], correctIndex: 1, explanation: 'Co-creation cho khách tham gia định hình phiên/nội dung, nâng cảm giác sở hữu và sự hài lòng.' },
]);

const c4 = doc('evn301-4-1-finance-revenue', '4.1 — Financial management & revenue models|||4.1 — Quản lý tài chính & mô hình doanh thu sự kiện',
  'Chi phí cố định/biến đổi, điểm hoà vốn; mô hình doanh thu (vé, tài trợ, gian hàng, ẩm thực, bản quyền); định giá & hoạt hoá tài trợ; dự phòng.',
  [[
    `<span class="eyebrow">EVN301 · Chapter 4 · Lesson 4.1</span>
<h2>Financial management &amp; revenue models</h2>
<h3>Budgeting: fixed vs variable costs</h3>
<p>Strategic financial planning starts with separating <strong>fixed costs</strong> (venue rental, core staff, base production — incurred regardless of attendance) from <strong>variable costs</strong> (catering per head, badges, gifts — scale with attendance). This split drives the <strong>break-even</strong> calculation:</p>
<pre><code>Break-even attendees = Fixed costs / (Ticket price - Variable cost per attendee)

Example: Fixed = 200,000,000 VND, Ticket = 500,000 VND, Variable/head = 150,000 VND
Break-even = 200,000,000 / (500,000 - 150,000) = 572 attendees</code></pre>
<h3>Revenue models beyond ticketing</h3>
<ul>
<li><strong>Ticketing/registration</strong> — tiered pricing (early bird, standard, VIP) to shape cash flow and demand.</li>
<li><strong>Sponsorship</strong> — sold in tiers (title, presenting, supporting) with clearly valued deliverables (logo placement, stage time, booth size, data access) — not a flat "thank you" fee.</li>
<li><strong>Exhibition/booth sales</strong> — space rental to exhibitors, common at trade shows and conferences.</li>
<li><strong>F&amp;B and merchandising</strong> — on-site sales beyond the ticket price.</li>
<li><strong>Licensing/media rights</strong> — for events with broadcast or content value.</li>
</ul>
<h3>Sponsorship valuation &amp; activation</h3>
<p>A strategic sponsorship proposal quantifies value for the sponsor (estimated reach, media value, lead volume) instead of only listing benefits, and reserves budget for <strong>activation</strong> — the on-site experience that makes the sponsor's presence feel earned, not just paid for.</p>
<div class="callout"><span class="badge">Contingency</span> Van der Wagen recommends a contingency line (commonly 5-15% of the budget) for a strategic event, sized to the event's risk profile — a first-time format or an outdoor event warrants a higher reserve than a recurring indoor conference.</div>`,
    `<span class="eyebrow">EVN301 · Chương 4 · Bài 4.1</span>
<h2>Quản lý tài chính &amp; mô hình doanh thu sự kiện</h2>
<h3>Lập ngân sách: chi phí cố định và chi phí biến đổi</h3>
<p>Hoạch định tài chính chiến lược bắt đầu bằng tách <strong>chi phí cố định</strong> (thuê địa điểm, nhân sự lõi, sản xuất nền — phát sinh dù có bao nhiêu khách) khỏi <strong>chi phí biến đổi</strong> (ẩm thực theo đầu người, thẻ tên, quà — tăng theo số khách). Cách tách này dẫn tới tính <strong>điểm hoà vốn</strong>:</p>
<pre><code>Số khách hoà vốn = Chi phí cố định / (Giá vé - Chi phí biến đổi/khách)

Ví dụ: Cố định = 200.000.000 VND, Vé = 500.000 VND, Biến đổi/khách = 150.000 VND
Hoà vốn = 200.000.000 / (500.000 - 150.000) = 572 khách</code></pre>
<h3>Mô hình doanh thu ngoài bán vé</h3>
<ul>
<li><strong>Bán vé/đăng ký</strong> — giá theo cấp (early bird, chuẩn, VIP) để định hình dòng tiền và cầu.</li>
<li><strong>Tài trợ</strong> — bán theo hạng (title, presenting, supporting) với quyền lợi được định giá rõ (vị trí logo, thời lượng trên sân khấu, kích thước gian hàng, quyền truy cập dữ liệu) — không phải một mức phí "cảm ơn" cào bằng.</li>
<li><strong>Bán gian hàng triển lãm</strong> — thuê không gian cho đơn vị trưng bày, phổ biến ở hội chợ thương mại và hội nghị.</li>
<li><strong>Ẩm thực và hàng lưu niệm</strong> — bán tại chỗ, ngoài giá vé.</li>
<li><strong>Bản quyền/quyền truyền thông</strong> — cho sự kiện có giá trị phát sóng hoặc nội dung.</li>
</ul>
<h3>Định giá &amp; hoạt hoá tài trợ</h3>
<p>Một đề xuất tài trợ chiến lược định lượng giá trị cho nhà tài trợ (độ phủ ước tính, giá trị truyền thông, số lượng lead) thay vì chỉ liệt kê quyền lợi, và dành ngân sách cho <strong>hoạt hoá (activation)</strong> — trải nghiệm tại chỗ khiến sự hiện diện của nhà tài trợ cảm giác xứng đáng, không chỉ là trả tiền.</p>
<div class="callout"><span class="badge">Dự phòng</span> Van der Wagen khuyến nghị một khoản dự phòng (thường 5-15% ngân sách) cho sự kiện chiến lược, tuỳ theo mức rủi ro của sự kiện — một hình thức lần đầu tổ chức hoặc sự kiện ngoài trời cần khoản dự phòng cao hơn một hội nghị trong nhà lặp lại hằng năm.</div>`,
  ]]);

const c4q = quiz('evn301-quiz-4', 'Quiz 4 — Finance & revenue|||Quiz 4 — Tài chính & doanh thu', [
  { id: 'q1', question: 'Công thức tính số khách cần bán để hoà vốn là gì?', options: ['Chi phí cố định / (Giá vé − Chi phí biến đổi/khách)', 'Chi phí biến đổi × số khách', 'Giá vé / Chi phí cố định', 'Doanh thu − Chi phí'], correctIndex: 0, explanation: 'Số khách hoà vốn = Chi phí cố định chia cho (Giá vé trừ Chi phí biến đổi trên mỗi khách).' },
  { id: 'q2', question: 'Một đề xuất tài trợ chiến lược nên làm gì thay vì chỉ liệt kê quyền lợi?', options: ['Chỉ ghi lời cảm ơn', 'Định lượng giá trị cho nhà tài trợ (độ phủ, giá trị truyền thông, số lead)', 'Giảm giá tối đa cho mọi nhà tài trợ', 'Bỏ qua khoản hoạt hoá (activation)'], correctIndex: 1, explanation: 'Đề xuất chiến lược định lượng giá trị cụ thể và dành ngân sách cho hoạt hoá tài trợ.' },
  { id: 'q3', question: 'Chi phí nào KHÔNG đổi theo số lượng khách tham dự?', options: ['Chi phí biến đổi', 'Chi phí cố định (thuê địa điểm, nhân sự lõi)', 'Quà tặng theo đầu người', 'Suất ăn theo đầu người'], correctIndex: 1, explanation: 'Chi phí cố định phát sinh dù số khách là bao nhiêu; chi phí biến đổi mới tăng theo số khách.' },
]);

const c5 = doc('evn301-5-1-marketing-branding', '5.1 — Strategic marketing & event branding|||5.1 — Marketing chiến lược & xây dựng thương hiệu sự kiện',
  'Marketing mix dịch vụ 7Ps cho sự kiện; thương hiệu mở rộng vs co-brand; funnel marketing số cho sự kiện; định vị.',
  [[
    `<span class="eyebrow">EVN301 · Chapter 5 · Lesson 5.1</span>
<h2>Strategic marketing &amp; event branding</h2>
<h3>The extended marketing mix for events (services 7Ps)</h3>
<p>Because an event is a service — intangible, perishable, produced and consumed at once — event marketing extends the classic 4Ps with three more:</p>
<pre><code>Product, Price, Place, Promotion    (classic 4Ps)
+ People             -&gt; staff, speakers, MC quality shape the experience
+ Process            -&gt; registration, entry, flow - friction kills perceived value
+ Physical evidence  -&gt; venue, signage, staging - the only "product" guests see before attending</code></pre>
<h3>Event branding: extension vs co-brand</h3>
<ul>
<li><strong>Brand extension</strong> — the event carries the parent organization's identity directly (e.g. an annual company conference under the corporate brand).</li>
<li><strong>Co-branding</strong> — the event has its own identity that partners with the parent brand and sponsor brands, useful when the event must appeal beyond the parent's existing audience.</li>
<li>Either way, consistency across pre-event marketing, on-site branding and post-event content builds long-term equity in the event property itself — turning a one-off into a recognizable annual fixture.</li>
</ul>
<h3>Digital funnel for event marketing</h3>
<p>Awareness (social ads, PR) -&gt; Consideration (content, speaker announcements, early-bird) -&gt; Registration (landing page, email sequences) -&gt; Engagement (event app, community) -&gt; Advocacy (post-event content, testimonials feeding next year's awareness stage).</p>
<div class="callout"><span class="badge">Positioning</span> In a crowded event calendar, a strategic marketer must answer: why THIS event, why NOW, why from US — the same positioning discipline as any product launch.</div>`,
    `<span class="eyebrow">EVN301 · Chương 5 · Bài 5.1</span>
<h2>Marketing chiến lược &amp; xây dựng thương hiệu sự kiện</h2>
<h3>Marketing mix mở rộng cho sự kiện (7Ps dịch vụ)</h3>
<p>Vì sự kiện là một dịch vụ — vô hình, không lưu trữ được, được tạo ra và tiêu thụ cùng lúc — marketing sự kiện mở rộng 4P cổ điển thêm ba yếu tố:</p>
<pre><code>Product, Price, Place, Promotion       (4P cổ điển)
+ People (con người)      -&gt; chất lượng nhân sự, diễn giả, MC định hình trải nghiệm
+ Process (quy trình)     -&gt; đăng ký, vào cửa, luồng di chuyển - trải nghiệm trục trặc làm mất giá trị cảm nhận
+ Physical evidence (bằng chứng vật lý) -&gt; địa điểm, bảng hiệu, dàn dựng - "sản phẩm" duy nhất khách thấy trước khi tham dự</code></pre>
<h3>Thương hiệu sự kiện: mở rộng hay co-brand</h3>
<ul>
<li><strong>Mở rộng thương hiệu</strong> — sự kiện mang trực tiếp bản sắc của tổ chức mẹ (vd hội nghị công ty hằng năm dưới thương hiệu doanh nghiệp).</li>
<li><strong>Co-branding</strong> — sự kiện có bản sắc riêng, kết hợp với thương hiệu công ty mẹ và thương hiệu nhà tài trợ, hữu ích khi sự kiện cần thu hút ngoài tập khách hàng sẵn có của công ty mẹ.</li>
<li>Dù theo cách nào, sự nhất quán giữa marketing trước sự kiện, thương hiệu tại chỗ và nội dung sau sự kiện xây dựng giá trị lâu dài cho chính "tài sản sự kiện" — biến một lần thành một dấu ấn thường niên được nhận diện.</li>
</ul>
<h3>Funnel marketing số cho sự kiện</h3>
<p>Nhận diện (quảng cáo mạng xã hội, PR) -&gt; Xem xét (nội dung, công bố diễn giả, early-bird) -&gt; Đăng ký (landing page, chuỗi email) -&gt; Gắn kết (app sự kiện, cộng đồng) -&gt; Ủng hộ (nội dung sau sự kiện, đánh giá nuôi lại giai đoạn nhận diện cho năm sau).</p>
<div class="callout"><span class="badge">Định vị</span> Trong một lịch sự kiện chật chội, người làm marketing chiến lược phải trả lời: vì sao sự kiện NÀY, vì sao BÂY GIỜ, vì sao từ CHÚNG TA — kỷ luật định vị giống bất kỳ lần ra mắt sản phẩm nào.</div>`,
  ]]);

const c5q = quiz('evn301-quiz-5', 'Quiz 5 — Marketing & branding|||Quiz 5 — Marketing & thương hiệu', [
  { id: 'q1', question: 'So với 4Ps cổ điển, marketing sự kiện (dịch vụ) thêm 3 chữ P nào?', options: ['Product, Price, Place', 'People, Process, Physical evidence', 'Profit, Planning, Performance', 'Package, Publicity, Positioning'], correctIndex: 1, explanation: 'Marketing dịch vụ mở rộng 4P với People (con người), Process (quy trình), Physical evidence (bằng chứng vật lý).' },
  { id: 'q2', question: '"Co-branding" trong sự kiện nghĩa là gì?', options: ['Sự kiện mang thẳng thương hiệu công ty mẹ', 'Sự kiện có bản sắc riêng, kết hợp với thương hiệu công ty mẹ và nhà tài trợ', 'Không cần thương hiệu nào', 'Chỉ dùng logo nhà tài trợ, bỏ logo tổ chức'], correctIndex: 1, explanation: 'Co-branding tạo bản sắc riêng cho sự kiện, kết hợp cùng thương hiệu công ty mẹ/nhà tài trợ.' },
  { id: 'q3', question: 'Bước nào trong "funnel" marketing sự kiện diễn ra SAU khi khách đã đăng ký?', options: ['Nhận diện (awareness)', 'Xem xét (consideration)', 'Gắn kết (engagement) qua app/cộng đồng sự kiện', 'Quảng cáo mạng xã hội đầu tiên'], correctIndex: 2, explanation: 'Thứ tự funnel: nhận diện -> xem xét -> đăng ký -> gắn kết -> ủng hộ. Gắn kết diễn ra sau đăng ký.' },
]);

const c6 = doc('evn301-6-1-quality-roi-legacy', '6.1 — Quality management, service & impact measurement|||6.1 — Quản lý chất lượng, dịch vụ & đo lường tác động',
  'SERVQUAL đo chất lượng dịch vụ sự kiện; ROI vs ROO (Return on Objectives); khái niệm di sản (legacy) của Getz.',
  [[
    `<span class="eyebrow">EVN301 · Chapter 6 · Lesson 6.1</span>
<h2>Quality management, service &amp; impact measurement</h2>
<h3>Measuring service quality: SERVQUAL</h3>
<p>Adapted from services marketing, <strong>SERVQUAL</strong> measures the gap between what guests expect and what they experience across five dimensions: <strong>Tangibles</strong> (venue, materials), <strong>Reliability</strong> (schedule kept, promises delivered), <strong>Responsiveness</strong> (staff speed to help), <strong>Assurance</strong> (staff competence, trust) and <strong>Empathy</strong> (personal attention to guest needs).</p>
<h3>ROI vs ROO</h3>
<pre><code>ROI (Return on Investment) = (Financial return - Cost) / Cost
   -&gt; works when the objective IS financial (sales, sponsorship revenue)

ROO (Return on Objectives) = achievement against the ORIGINAL objective
   -&gt; works when the objective is non-financial: brand awareness lift,
      employee engagement score, media reach, community goodwill</code></pre>
<p>Forcing a brand-awareness event into a pure ROI number produces a misleading (often meaningless) figure. Getz and Goldblatt both argue objectives set in Chapter 1 should define which metric — ROI, ROO, or both — is the right lens.</p>
<h3>Legacy: beyond the closing night</h3>
<p>For large or recurring events, <strong>legacy</strong> is the lasting effect after the event ends — infrastructure, skills transferred to local staff, community goodwill, or reputational capital (Getz's concept, most visible in mega-events like the Olympics but scalable down to a corporate summit that leaves behind a trained local team or a lasting industry network).</p>
<div class="callout"><span class="badge">KPI set</span> A strategic measurement plan combines hard numbers (attendance, revenue, cost-per-lead) with perception metrics (NPS, satisfaction survey) and legacy indicators (skills built, relationships formed, media value) — never just one.</div>`,
    `<span class="eyebrow">EVN301 · Chương 6 · Bài 6.1</span>
<h2>Quản lý chất lượng, dịch vụ &amp; đo lường tác động</h2>
<h3>Đo chất lượng dịch vụ: SERVQUAL</h3>
<p>Chuyển thể từ marketing dịch vụ, <strong>SERVQUAL</strong> đo khoảng cách giữa điều khách kỳ vọng và điều khách thực sự trải nghiệm qua năm chiều: <strong>Hữu hình</strong> (địa điểm, vật liệu), <strong>Tin cậy</strong> (giữ đúng lịch, giao đúng lời hứa), <strong>Đáp ứng</strong> (nhân viên hỗ trợ nhanh), <strong>Đảm bảo</strong> (năng lực và sự tin tưởng vào nhân viên) và <strong>Đồng cảm</strong> (chăm sóc nhu cầu cá nhân của khách).</p>
<h3>ROI so với ROO</h3>
<pre><code>ROI (Lợi tức đầu tư) = (Lợi ích tài chính - Chi phí) / Chi phí
   -&gt; phù hợp khi mục tiêu LÀ tài chính (bán hàng, doanh thu tài trợ)

ROO (Lợi tức so với mục tiêu) = mức đạt được so với MỤC TIÊU BAN ĐẦU
   -&gt; phù hợp khi mục tiêu phi tài chính: tăng nhận diện thương hiệu,
      chỉ số gắn kết nhân viên, độ phủ truyền thông, thiện cảm cộng đồng</code></pre>
<p>Ép một sự kiện xây nhận diện thương hiệu vào một con số ROI thuần tuý tạo ra kết quả gây hiểu lầm (thường vô nghĩa). Getz và Goldblatt đều cho rằng mục tiêu đặt ra ở Chương 1 phải quyết định thước đo — ROI, ROO, hay cả hai — là lăng kính đúng.</p>
<h3>Di sản: vượt xa đêm bế mạc</h3>
<p>Với sự kiện lớn hoặc lặp lại, <strong>di sản (legacy)</strong> là tác động còn lại sau khi sự kiện kết thúc — cơ sở vật chất, kỹ năng chuyển giao cho nhân sự địa phương, thiện cảm cộng đồng, hoặc vốn danh tiếng (khái niệm của Getz, rõ nhất ở các sự kiện siêu lớn như Olympic nhưng vẫn áp dụng được cho một hội nghị doanh nghiệp để lại một đội ngũ địa phương được đào tạo hoặc một mạng lưới ngành bền vững).</p>
<div class="callout"><span class="badge">Bộ KPI</span> Một kế hoạch đo lường chiến lược kết hợp số liệu cứng (số khách, doanh thu, chi phí trên mỗi lead) với chỉ số cảm nhận (NPS, khảo sát hài lòng) và chỉ số di sản (kỹ năng xây dựng, quan hệ hình thành, giá trị truyền thông) — không bao giờ chỉ dùng một loại.</div>`,
  ]]);

const c6q = quiz('evn301-quiz-6', 'Quiz 6 — Quality, ROI & legacy|||Quiz 6 — Chất lượng, ROI & di sản', [
  { id: 'q1', question: 'SERVQUAL đo khoảng cách giữa điều gì?', options: ['Chi phí và doanh thu', 'Kỳ vọng của khách và trải nghiệm thực tế nhận được', 'Số vé bán và số vé phát hành', 'Thời gian lên kế hoạch và thời gian thi công'], correctIndex: 1, explanation: 'SERVQUAL đo khoảng cách kỳ vọng - trải nghiệm thực tế qua 5 chiều: hữu hình, tin cậy, đáp ứng, đảm bảo, đồng cảm.' },
  { id: 'q2', question: 'ROO (Return on Objectives) phù hợp nhất khi mục tiêu sự kiện là gì?', options: ['Mục tiêu tài chính thuần túy', 'Mục tiêu phi tài chính như nâng nhận diện thương hiệu, gắn kết nhân viên', 'Chỉ có 1 loại mục tiêu duy nhất là doanh thu', 'Không cần đo lường gì cả'], correctIndex: 1, explanation: 'ROO đo mức đạt được so với mục tiêu ban đầu, phù hợp cho mục tiêu phi tài chính.' },
  { id: 'q3', question: '"Di sản" (legacy) của sự kiện theo Getz là gì?', options: ['Chỉ là lợi nhuận ngay trong ngày sự kiện', 'Tác động còn lại sau khi sự kiện kết thúc (kỹ năng, quan hệ, cơ sở vật chất, uy tín)', 'Số lượng nhân viên tham gia tổ chức', 'Giá vé bán ra'], correctIndex: 1, explanation: 'Di sản là tác động lâu dài sau sự kiện — kỹ năng, quan hệ, cơ sở vật chất, vốn danh tiếng.' },
]);

const c7 = doc('evn301-7-1-sustainability-csr', '7.1 — Sustainable events & social responsibility|||7.1 — Sự kiện bền vững & trách nhiệm xã hội',
  'Triple bottom line (People/Planet/Profit); chuẩn ISO 20121; đòn bẩy thực tiễn: địa điểm, mua sắm, khả năng tiếp cận & hoà nhập.',
  [[
    `<span class="eyebrow">EVN301 · Chapter 7 · Lesson 7.1</span>
<h2>Sustainable events &amp; social responsibility</h2>
<h3>The triple bottom line</h3>
<p>A strategic event manager plans against three bottom lines at once, not just the financial one:</p>
<pre><code>People   -&gt; accessibility, inclusion, fair labour for staff/vendors, community impact
Planet   -&gt; carbon footprint (travel, energy), waste (single-use materials), local sourcing
Profit   -&gt; the event still has to be financially viable (Chapter 4)</code></pre>
<h3>ISO 20121: the sustainable event management standard</h3>
<p><strong>ISO 20121</strong> gives event organizations a management-system framework (plan-do-check-act) for embedding sustainability into every stage — procurement, venue selection, waste management, stakeholder communication — rather than treating it as a one-off "green" gesture (e.g. reusable badges for one edition only).</p>
<h3>Practical levers</h3>
<ul>
<li><strong>Venue &amp; logistics</strong> — venues with public-transport access, energy-efficient buildings, digital instead of printed materials.</li>
<li><strong>Procurement</strong> — local and seasonal F&amp;B, reusable or recyclable signage, vetted labour practices for contractors.</li>
<li><strong>Accessibility &amp; inclusion</strong> — wheelchair access, sign-language interpretation, dietary accommodation, inclusive program content — a social-sustainability requirement, not a nice-to-have.</li>
</ul>
<div class="callout"><span class="badge">CSR as brand strategy</span> A well-executed sustainability program is not just a cost or a compliance box — done credibly (with real numbers, not just a slogan), it strengthens brand trust and can itself become part of the event's story, feeding back into Chapter 5's marketing.</div>`,
    `<span class="eyebrow">EVN301 · Chương 7 · Bài 7.1</span>
<h2>Sự kiện bền vững &amp; trách nhiệm xã hội</h2>
<h3>Triple bottom line — ba trụ cột kết quả</h3>
<p>Nhà quản trị sự kiện chiến lược lập kế hoạch dựa trên ba trụ cột kết quả cùng lúc, không chỉ trụ cột tài chính:</p>
<pre><code>Con người (People)   -&gt; khả năng tiếp cận, hoà nhập, lao động công bằng cho nhân sự/nhà cung cấp, tác động cộng đồng
Môi trường (Planet)  -&gt; dấu chân carbon (di chuyển, năng lượng), rác thải (vật liệu dùng một lần), mua sắm địa phương
Lợi nhuận (Profit)   -&gt; sự kiện vẫn phải khả thi về tài chính (Chương 4)</code></pre>
<h3>ISO 20121: chuẩn quản trị sự kiện bền vững</h3>
<p><strong>ISO 20121</strong> cấp cho tổ chức sự kiện một khung hệ thống quản lý (lập kế hoạch - thực hiện - kiểm tra - hành động) để gắn tính bền vững vào mọi giai đoạn — mua sắm, chọn địa điểm, quản lý rác thải, truyền thông với bên liên quan — thay vì xem nó như một cử chỉ "xanh" đơn lẻ (vd chỉ dùng thẻ tên tái sử dụng cho một lần duy nhất).</p>
<h3>Đòn bẩy thực tiễn</h3>
<ul>
<li><strong>Địa điểm &amp; hậu cần</strong> — địa điểm gần giao thông công cộng, công trình tiết kiệm năng lượng, tài liệu số thay in ấn.</li>
<li><strong>Mua sắm</strong> — ẩm thực địa phương và theo mùa, bảng hiệu tái sử dụng hoặc tái chế được, thẩm định thực hành lao động của nhà thầu.</li>
<li><strong>Khả năng tiếp cận &amp; hoà nhập</strong> — lối cho xe lăn, phiên dịch ngôn ngữ ký hiệu, hỗ trợ chế độ ăn, nội dung chương trình hoà nhập — một yêu cầu về bền vững xã hội, không phải điều "có thì tốt".</li>
</ul>
<div class="callout"><span class="badge">CSR như chiến lược thương hiệu</span> Một chương trình bền vững thực hiện tốt không chỉ là chi phí hay ô cần tick cho tuân thủ — làm đáng tin (có số liệu thật, không chỉ slogan), nó củng cố niềm tin thương hiệu và có thể trở thành một phần câu chuyện của sự kiện, nuôi lại cho marketing ở Chương 5.</div>`,
  ]]);

const c7q = quiz('evn301-quiz-7', 'Quiz 7 — Sustainability & CSR|||Quiz 7 — Bền vững & trách nhiệm xã hội', [
  { id: 'q1', question: '"Triple bottom line" trong sự kiện bền vững gồm 3 trụ cột nào?', options: ['Nhân sự, Công nghệ, Doanh thu', 'Con người (People), Môi trường (Planet), Lợi nhuận (Profit)', 'Giá vé, Địa điểm, Thời gian', 'Marketing, Vận hành, Rủi ro'], correctIndex: 1, explanation: 'Triple bottom line gồm ba trụ cột: People, Planet, Profit.' },
  { id: 'q2', question: 'ISO 20121 là gì?', options: ['Tiêu chuẩn về an toàn thực phẩm', 'Tiêu chuẩn hệ thống quản lý sự kiện bền vững (plan-do-check-act)', 'Tiêu chuẩn về âm thanh sân khấu', 'Giấy phép tổ chức sự kiện ngoài trời'], correctIndex: 1, explanation: 'ISO 20121 là chuẩn quản trị sự kiện bền vững theo mô hình plan-do-check-act.' },
  { id: 'q3', question: 'Khả năng tiếp cận (accessibility) và hoà nhập (inclusion) thuộc trụ cột nào của bền vững sự kiện?', options: ['Planet (môi trường)', 'Profit (lợi nhuận)', 'People (con người/xã hội)', 'Không thuộc trụ cột nào'], correctIndex: 2, explanation: 'Accessibility và inclusion là yêu cầu bền vững xã hội, thuộc trụ cột People.' },
]);

const c8 = doc('evn301-8-1-trends-digital-leadership', '8.1 — Industry trends, digital/hybrid events & leadership|||8.1 — Xu hướng ngành, sự kiện số/hybrid & lãnh đạo tổ chức sự kiện',
  'Trực tiếp/trực tuyến/hybrid; ngăn xếp công nghệ sự kiện; xu hướng trải nghiệm sâu, cá nhân hoá AI, bền vững; xây đội ngũ & văn hoá lãnh đạo.',
  [[
    `<span class="eyebrow">EVN301 · Chapter 8 · Lesson 8.1</span>
<h2>Industry trends, digital/hybrid events &amp; leadership</h2>
<h3>From physical to hybrid</h3>
<p>Digital transformation reshaped the event portfolio into three formats an organization must choose between (or combine) per objective:</p>
<pre><code>In-person -&gt; strongest for networking density &amp; premium experience
Virtual   -&gt; lowest cost per attendee, widest geographic reach, weakest engagement depth
Hybrid    -&gt; combines both, but DOUBLES the design &amp; budget complexity
             (two audiences, two experiences, one coherent program)</code></pre>
<h3>The event technology stack</h3>
<p>A strategic event manager now oversees a stack: registration &amp; CRM integration, event apps, virtual/streaming platforms, on-site tech (badge scanning, wayfinding), and post-event data analytics feeding the next cycle's stakeholder and marketing decisions (Chapters 2 and 5).</p>
<h3>Current trends worth tracking</h3>
<ul>
<li><strong>Experiential &amp; immersive formats</strong> — deeper sensory design (Chapter 3) as a differentiator against "another conference."</li>
<li><strong>AI-driven personalization</strong> — matched networking, tailored agendas, automated content summaries.</li>
<li><strong>Sustainability as baseline expectation</strong> — sponsors and attendees increasingly ask, not just accept (Chapter 7).</li>
</ul>
<h3>Leading an event organization</h3>
<p>Beyond running one event, a senior event manager builds a <strong>team and culture</strong> that can repeat success: cross-training across EMBOK domains, clear career paths (coordinator -&gt; manager -&gt; director), and a decision-making culture that treats each event as a strategic bet to be reviewed, not a one-off fire to put out.</p>
<div class="callout"><span class="badge">Closing the loop</span> Chapter 8 closes the course where Chapter 1 opened it: an event organization that plans strategically, measures honestly (Chapter 6), and adapts its format and team as the industry evolves is the one that turns single events into a durable competitive advantage.</div>`,
    `<span class="eyebrow">EVN301 · Chương 8 · Bài 8.1</span>
<h2>Xu hướng ngành, sự kiện số/hybrid &amp; lãnh đạo tổ chức sự kiện</h2>
<h3>Từ trực tiếp đến hybrid</h3>
<p>Chuyển đổi số định hình lại danh mục sự kiện thành ba hình thức mà tổ chức phải chọn (hoặc kết hợp) theo mục tiêu:</p>
<pre><code>Trực tiếp -&gt; mạnh nhất về mật độ kết nối &amp; trải nghiệm cao cấp
Trực tuyến -&gt; chi phí trên mỗi khách thấp nhất, độ phủ địa lý rộng nhất, độ gắn kết yếu nhất
Hybrid     -&gt; kết hợp cả hai, nhưng NHÂN ĐÔI độ phức tạp thiết kế &amp; ngân sách
              (hai tập khách, hai trải nghiệm, một chương trình thống nhất)</code></pre>
<h3>Ngăn xếp công nghệ sự kiện</h3>
<p>Nhà quản trị sự kiện chiến lược nay giám sát một "ngăn xếp": đăng ký &amp; tích hợp CRM, app sự kiện, nền tảng trực tuyến/streaming, công nghệ tại chỗ (quét thẻ, chỉ dẫn đường), và phân tích dữ liệu sau sự kiện nuôi lại quyết định bên liên quan và marketing cho vòng kế tiếp (Chương 2 và 5).</p>
<h3>Xu hướng hiện tại cần theo dõi</h3>
<ul>
<li><strong>Hình thức trải nghiệm &amp; đắm chìm</strong> — thiết kế giác quan sâu hơn (Chương 3) như một điểm khác biệt so với "một hội nghị khác."</li>
<li><strong>Cá nhân hoá bằng AI</strong> — ghép nối kết nối phù hợp, lịch trình theo riêng từng người, tóm tắt nội dung tự động.</li>
<li><strong>Bền vững thành kỳ vọng nền</strong> — nhà tài trợ và khách ngày càng chủ động hỏi, không chỉ chấp nhận (Chương 7).</li>
</ul>
<h3>Lãnh đạo một tổ chức sự kiện</h3>
<p>Vượt xa việc chạy một sự kiện, nhà quản trị sự kiện cấp cao xây dựng <strong>đội ngũ và văn hoá</strong> có thể lặp lại thành công: đào tạo chéo qua các miền EMBOK, lộ trình nghề nghiệp rõ ràng (điều phối viên -&gt; quản lý -&gt; giám đốc), và một văn hoá ra quyết định coi mỗi sự kiện là một cược chiến lược cần được rà soát, không phải một đám cháy cần dập một lần.</p>
<div class="callout"><span class="badge">Khép vòng</span> Chương 8 khép lại môn học ở đúng nơi Chương 1 mở ra: một tổ chức sự kiện lập kế hoạch chiến lược, đo lường trung thực (Chương 6), và điều chỉnh hình thức cùng đội ngũ khi ngành thay đổi là tổ chức biến những sự kiện đơn lẻ thành lợi thế cạnh tranh bền vững.</div>`,
  ]]);

const c8q = quiz('evn301-quiz-8', 'Quiz 8 — Trends, digital & leadership|||Quiz 8 — Xu hướng, số hoá & lãnh đạo', [
  { id: 'q1', question: 'So với sự kiện trực tiếp và trực tuyến, sự kiện hybrid có đặc điểm gì?', options: ['Luôn rẻ hơn cả hai', 'Kết hợp cả hai nhưng làm TĂNG độ phức tạp thiết kế & ngân sách', 'Không cần công nghệ gì thêm', 'Chỉ phù hợp sự kiện quy mô nhỏ'], correctIndex: 1, explanation: 'Hybrid kết hợp trực tiếp và trực tuyến nhưng nhân đôi độ phức tạp: hai tập khách, hai trải nghiệm.' },
  { id: 'q2', question: 'Cá nhân hoá bằng AI trong sự kiện (ví dụ ghép nối networking, lịch trình riêng) thuộc xu hướng nào?', options: ['Xu hướng bền vững', 'Xu hướng cá nhân hoá dựa trên dữ liệu/AI', 'Xu hướng cắt giảm nhân sự', 'Xu hướng giảm giá vé'], correctIndex: 1, explanation: 'Đây là xu hướng cá nhân hoá dựa trên dữ liệu và AI cho trải nghiệm sự kiện.' },
  { id: 'q3', question: 'Theo Chương 8, điều gì giúp tổ chức biến sự kiện đơn lẻ thành lợi thế cạnh tranh bền vững?', options: ['Chỉ cần một sự kiện thật hoành tráng một lần', 'Xây dựng đội ngũ, lộ trình nghề nghiệp rõ và văn hoá đánh giá chiến lược mỗi sự kiện', 'Không cần đo lường gì sau sự kiện', 'Luôn ưu tiên chi phí thấp nhất bất kể chất lượng'], correctIndex: 1, explanation: 'Đội ngũ, lộ trình nghề nghiệp và văn hoá đánh giá chiến lược mỗi sự kiện là yếu tố lãnh đạo bền vững.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'EVN301',
    slug: 'evn301-event-management',
    title: 'Event Management',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EVN301.webp',
    shortDescription: 'Strategic event management for BBA — EMBOK, stakeholder & project management, experience design, finance & revenue models, marketing & branding, quality/ROI/legacy, ISO 20121 sustainability, digital/hybrid trends & leadership.|||Quản trị sự kiện chiến lược khối QTKD — EMBOK, bên liên quan & quản trị dự án, thiết kế trải nghiệm, tài chính & doanh thu, marketing & thương hiệu, chất lượng/ROI/di sản, bền vững ISO 20121, xu hướng số/hybrid & lãnh đạo.',
    description: 'Môn <strong>EVN301 — Event Management</strong> (kỳ 7, khối Quản trị Kinh doanh) ở cấp <strong>chiến lược/nâng cao</strong> — khác môn nhập môn EEM201 và môn lập kế hoạch EEP201. Từ <strong>vai trò chiến lược của sự kiện</strong> (khung EMBOK, tư duy danh mục Getz) → <strong>phân tích bên liên quan &amp; quản trị dự án</strong> (Mendelow, WBS, RACI) → <strong>thiết kế trải nghiệm</strong> (kinh tế trải nghiệm, ngũ quan Goldblatt) → <strong>tài chính &amp; doanh thu</strong> (điểm hoà vốn, tài trợ) → <strong>marketing &amp; thương hiệu</strong> (7Ps, co-brand) → <strong>chất lượng, ROI/ROO &amp; di sản</strong> (SERVQUAL) → <strong>bền vững</strong> (ISO 20121, triple bottom line) → <strong>xu hướng số/hybrid &amp; lãnh đạo</strong>. Bám giáo trình Bowdin/Getz/Goldblatt/Van der Wagen, song ngữ, có khung mô hình và quiz mỗi chương.',
    whatYouLearn: 'Khung EMBOK (5 miền + quản trị bên liên quan); tư duy danh mục sự kiện (Getz); ma trận quyền lực/quan tâm Mendelow; WBS, đường tới hạn, RACI; kinh tế trải nghiệm & thiết kế ngũ quan (Goldblatt); chi phí cố định/biến đổi, điểm hoà vốn, mô hình doanh thu & định giá tài trợ; marketing mix 7Ps, thương hiệu mở rộng vs co-brand; SERVQUAL; ROI vs ROO; khái niệm di sản (legacy); triple bottom line & ISO 20121; sự kiện trực tiếp/trực tuyến/hybrid; xu hướng cá nhân hoá AI; xây dựng đội ngũ & lãnh đạo tổ chức sự kiện.',
    requirements: 'Đã học qua kiến thức nhập môn sự kiện (khái niệm, loại hình — vd EEM201) và/hoặc lập kế hoạch sự kiện (vd EEP201). Có kiến thức nền về quản trị kinh doanh, marketing và tài chính cơ bản của khối BBA.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách nền tảng, tổ chức ngành & chuẩn ISO 20121, nền tảng công nghệ, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao EVN301 là môn chiến lược, khác EEM201/EEP201; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Vai trò chiến lược|||Chapter 1 — Strategic role', description: 'EMBOK 5 miền, tư duy danh mục sự kiện.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Bên liên quan & quản trị dự án|||Chapter 2 — Stakeholders & PM', description: 'Mendelow, WBS, đường tới hạn, RACI.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thiết kế trải nghiệm|||Chapter 3 — Experience design', description: 'Kinh tế trải nghiệm, hành trình khách, ngũ quan.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tài chính & doanh thu|||Chapter 4 — Finance & revenue', description: 'Điểm hoà vốn, mô hình doanh thu, tài trợ.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Marketing & thương hiệu|||Chapter 5 — Marketing & branding', description: '7Ps, thương hiệu mở rộng vs co-brand, funnel số.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chất lượng, ROI & di sản|||Chapter 6 — Quality, ROI & legacy', description: 'SERVQUAL, ROI vs ROO, di sản sự kiện.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bền vững & trách nhiệm xã hội|||Chapter 7 — Sustainability & CSR', description: 'Triple bottom line, ISO 20121, hoà nhập.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xu hướng & lãnh đạo|||Chapter 8 — Trends & leadership', description: 'Hybrid, công nghệ sự kiện, cá nhân hoá AI, lãnh đạo.', lessons: [c8, c8q] },
  ],
};
