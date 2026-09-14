/**
 * EVP201 — Event Planning (Lập kế hoạch Sự kiện). Khối Quản trị Kinh doanh
 * (BBA), Kỳ 1 — NHẬP MÔN, tập trung nền tảng cơ bản (khác EEP201 Entertainment
 * Planning thiên giải trí). Giáo trình trích dẫn: Judy Allen "Event
 * Planning"; Shone/Parry "Successful Event Management"; "The Complete Guide
 * to Successful Event Planning". Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('evp201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (Judy Allen, Shone/Parry), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">EVP201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn the basics of <strong>event planning</strong> — types of events, objectives, budgeting, venue, timeline, guests/vendors, day-of coordination and post-event evaluation — in one place.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Judy Allen — <em>Event Planning: The Ultimate Guide</em></li>
<li>Anton Shone &amp; Bryn Parry — <em>Successful Event Management: A Practical Handbook</em></li>
<li><em>The Complete Guide to Successful Event Planning</em></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.eventbrite.com/blog/event-planning-guide-ds00/" target="_blank" rel="noopener">Eventbrite — Event planning guide</a></li>
<li><a href="https://www.cvent.com/en/event-planning" target="_blank" rel="noopener">Cvent — Event planning resources</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@EventManagerBlog" target="_blank" rel="noopener">Event Manager Blog</a> — event planning tips &amp; trends</li>
<li><a href="https://www.youtube.com/@BizBash" target="_blank" rel="noopener">BizBash</a> — event production &amp; design ideas</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — mood boards, invitations, run-of-show sheets</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> / <a href="https://asana.com/" target="_blank" rel="noopener">Asana</a> — timeline &amp; task checklist tracking</li>
<li><a href="https://sheets.google.com/" target="_blank" rel="noopener">Google Sheets</a> — budget tracker, guest list, vendor list</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what an event is, event types, objectives &amp; audience.</li>
<li><strong>Planning tools</strong> — budget, venue &amp; timing, timeline/checklist.</li>
<li><strong>Execution</strong> — guests, program, vendors, day-of coordination.</li>
<li><strong>Wrap-up</strong> — post-event evaluation and the professional skills planners need.</li>
</ol></div>`,
    `<span class="eyebrow">EVP201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học nền tảng <strong>lập kế hoạch sự kiện</strong> — loại hình sự kiện, mục tiêu, ngân sách, địa điểm, timeline, khách/nhà cung cấp, điều phối ngày sự kiện và đánh giá sau sự kiện — gom về một chỗ.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Judy Allen — <em>Event Planning: The Ultimate Guide</em></li>
<li>Anton Shone &amp; Bryn Parry — <em>Successful Event Management: A Practical Handbook</em></li>
<li><em>The Complete Guide to Successful Event Planning</em></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.eventbrite.com/blog/event-planning-guide-ds00/" target="_blank" rel="noopener">Eventbrite — Hướng dẫn lập kế hoạch sự kiện</a></li>
<li><a href="https://www.cvent.com/en/event-planning" target="_blank" rel="noopener">Cvent — Tài nguyên lập kế hoạch sự kiện</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@EventManagerBlog" target="_blank" rel="noopener">Event Manager Blog</a> — mẹo &amp; xu hướng lập kế hoạch sự kiện</li>
<li><a href="https://www.youtube.com/@BizBash" target="_blank" rel="noopener">BizBash</a> — ý tưởng sản xuất &amp; thiết kế sự kiện</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — mood board, thiệp mời, bảng run-of-show</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> / <a href="https://asana.com/" target="_blank" rel="noopener">Asana</a> — theo dõi timeline &amp; checklist công việc</li>
<li><a href="https://sheets.google.com/" target="_blank" rel="noopener">Google Sheets</a> — bảng ngân sách, danh sách khách, danh sách nhà cung cấp</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — sự kiện là gì, các loại hình, mục tiêu &amp; đối tượng.</li>
<li><strong>Công cụ lập kế hoạch</strong> — ngân sách, địa điểm &amp; thời gian, timeline/checklist.</li>
<li><strong>Triển khai</strong> — khách mời, chương trình, nhà cung cấp, điều phối ngày sự kiện.</li>
<li><strong>Kết thúc</strong> — đánh giá sau sự kiện và các kỹ năng nghề nghiệp người lập kế hoạch cần có.</li>
</ol></div>`,
  ]]);

const intro = doc('evp201-0-1-overview', 'Course overview: Event Planning|||Tổng quan: Lập kế hoạch Sự kiện',
  'Sự kiện là gì; vai trò event planner; lộ trình môn: loại hình sự kiện → mục tiêu/đối tượng → ngân sách → địa điểm/thời gian → timeline → khách/nhà cung cấp → ngày sự kiện → đánh giá.',
  [[
    `<span class="eyebrow">EVP201 · Lesson 0.1 · Overview</span>
<h2>Event Planning — introduction</h2>
<p class="lead">This is an <strong>introductory</strong> course: it gives you the basic toolkit to plan a simple event from idea to wrap-up — corporate meetings, workshops, weddings, parties, fundraisers, conferences. It focuses on <strong>fundamentals</strong>, not entertainment/show production (that is a separate advanced course).</p>
<h3>What is "event planning"?</h3>
<p>Event planning is the process of <strong>organizing all elements of an event</strong> — objectives, budget, venue, timing, program, vendors, guests — so that on the day, everything happens on time, within budget, and achieves the event's purpose. An <strong>event planner</strong> is the person who coordinates all of this.</p>
<h3>Roadmap (8 chapters)</h3>
<ol>
<li>What is an event &amp; event types</li>
<li>Objectives, audience &amp; concept</li>
<li>Basic budgeting</li>
<li>Venue &amp; timing selection</li>
<li>Timeline &amp; task checklist</li>
<li>Guests, program &amp; vendors</li>
<li>Event day: basic coordination</li>
<li>Post-event evaluation &amp; professional skills</li>
</ol>
<div class="callout"><span class="badge">Core idea</span> Every good event starts with a clear <strong>WHY</strong> (objective) before the <strong>WHAT</strong> (venue, food, decor). Planning without a clear objective is the #1 rookie mistake.</div>`,
    `<span class="eyebrow">EVP201 · Bài 0.1 · Tổng quan</span>
<h2>Lập kế hoạch Sự kiện — nhập môn</h2>
<p class="lead">Đây là môn <strong>nhập môn</strong>: cung cấp bộ công cụ cơ bản để lập kế hoạch một sự kiện đơn giản từ ý tưởng đến kết thúc — họp/hội thảo công ty, workshop, đám cưới, tiệc, gây quỹ, hội nghị. Môn tập trung vào <strong>nền tảng</strong>, không đi sâu vào sản xuất giải trí/show diễn (đó là môn nâng cao riêng).</p>
<h3>"Lập kế hoạch sự kiện" là gì?</h3>
<p>Lập kế hoạch sự kiện là quá trình <strong>tổ chức toàn bộ thành phần của một sự kiện</strong> — mục tiêu, ngân sách, địa điểm, thời gian, chương trình, nhà cung cấp, khách mời — để đến ngày diễn ra, mọi thứ đúng giờ, đúng ngân sách và đạt được mục đích của sự kiện. <strong>Event planner</strong> là người điều phối toàn bộ việc này.</p>
<h3>Lộ trình (8 chương)</h3>
<ol>
<li>Sự kiện là gì &amp; các loại hình sự kiện</li>
<li>Xác định mục tiêu, đối tượng &amp; concept</li>
<li>Lập ngân sách cơ bản</li>
<li>Chọn địa điểm &amp; thời gian</li>
<li>Timeline &amp; danh sách công việc</li>
<li>Mời khách, chương trình &amp; nhà cung cấp</li>
<li>Ngày sự kiện: điều phối cơ bản</li>
<li>Đánh giá sau sự kiện &amp; kỹ năng nghề nghiệp</li>
</ol>
<div class="callout"><span class="badge">Ý chính</span> Sự kiện tốt luôn bắt đầu từ <strong>TẠI SAO</strong> (mục tiêu) rõ ràng trước khi tới <strong>CÁI GÌ</strong> (địa điểm, đồ ăn, decor). Lập kế hoạch không có mục tiêu rõ là lỗi tay mơ số 1.</div>`,
  ]]);

const c1 = doc('evp201-1-1-event-types', '1.1 — What is an event & event types|||1.1 — Sự kiện là gì & các loại hình sự kiện',
  'Định nghĩa sự kiện; phân loại: doanh nghiệp, xã hội/cá nhân, gây quỹ, hội nghị/triển lãm, nghi lễ; đặc điểm mỗi loại.',
  [[
    `<span class="eyebrow">EVP201 · Chapter 1 · Lesson 1.1</span>
<h2>What is an event &amp; event types</h2>
<h3>Definition</h3>
<p>An <strong>event</strong> is a planned gathering of people, at a specific time and place, for a specific purpose — celebrating, informing, networking, selling, fundraising or bonding. Judy Allen groups events by <em>who they serve</em> and <em>why they happen</em>.</p>
<h3>Main categories</h3>
<ul>
<li><strong>Corporate events</strong> — meetings, product launches, conferences, training, team building, company anniversaries. Goal: business results (sales, brand, morale).</li>
<li><strong>Social / personal events</strong> — weddings, birthdays, anniversaries, reunions. Goal: celebrating relationships and milestones.</li>
<li><strong>Fundraising / charity events</strong> — galas, charity runs, auctions. Goal: raising money and awareness for a cause.</li>
<li><strong>Conferences / exhibitions (MICE)</strong> — trade shows, seminars, expos. Goal: knowledge-sharing, networking, business deals.</li>
<li><strong>Ceremonies</strong> — graduations, award nights, openings/groundbreakings. Goal: marking an official milestone.</li>
</ul>
<pre><code>Quick classifier:
 Who pays?      company / individual / donors
 Who attends?   employees & clients / friends & family / public
 Success looks like?  ROI & leads / happy guests / money raised
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> The event <strong>type</strong> already hints at budget size, formality, guest list and venue style — always name the type before planning anything else.</div>`,
    `<span class="eyebrow">EVP201 · Chương 1 · Bài 1.1</span>
<h2>Sự kiện là gì &amp; các loại hình sự kiện</h2>
<h3>Định nghĩa</h3>
<p>Một <strong>sự kiện</strong> là buổi tập hợp người được lập kế hoạch, ở thời điểm và địa điểm cụ thể, cho một mục đích cụ thể — ăn mừng, thông tin, kết nối, bán hàng, gây quỹ hoặc gắn kết. Judy Allen phân loại sự kiện theo <em>phục vụ cho ai</em> và <em>vì sao diễn ra</em>.</p>
<h3>Các nhóm chính</h3>
<ul>
<li><strong>Sự kiện doanh nghiệp</strong> — họp, ra mắt sản phẩm, hội nghị, đào tạo, team building, kỷ niệm công ty. Mục tiêu: kết quả kinh doanh (doanh số, thương hiệu, tinh thần nhân viên).</li>
<li><strong>Sự kiện xã hội / cá nhân</strong> — đám cưới, sinh nhật, kỷ niệm, họp lớp. Mục tiêu: ăn mừng quan hệ và cột mốc.</li>
<li><strong>Sự kiện gây quỹ / thiện nguyện</strong> — gala, chạy bộ gây quỹ, đấu giá. Mục tiêu: gây quỹ và nâng nhận thức cho một mục đích.</li>
<li><strong>Hội nghị / triển lãm (MICE)</strong> — hội chợ thương mại, hội thảo, expo. Mục tiêu: chia sẻ kiến thức, kết nối, giao dịch kinh doanh.</li>
<li><strong>Nghi lễ</strong> — lễ tốt nghiệp, lễ trao giải, khai trương/động thổ. Mục tiêu: đánh dấu một cột mốc chính thức.</li>
</ul>
<pre><code>Phân loại nhanh:
 Ai trả tiền?     công ty / cá nhân / nhà tài trợ
 Ai tham dự?      nhân viên & khách hàng / bạn bè & gia đình / công chúng
 Thành công là?   ROI & khách hàng tiềm năng / khách vui / tiền gây quỹ được
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> <strong>Loại hình</strong> sự kiện đã gợi ý quy mô ngân sách, mức độ trang trọng, danh sách khách và phong cách địa điểm — luôn gọi tên loại hình trước khi lập bất cứ kế hoạch nào khác.</div>`,
  ]]);

const c1q = quiz('evp201-quiz-1', 'Quiz 1 — Event types|||Quiz 1 — Loại hình sự kiện', [
  { id: 'q1', question: 'Sự kiện gồm những yếu tố cốt lõi nào theo định nghĩa?', options: ['Chỉ cần đông người', 'Người tham dự, thời gian, địa điểm và mục đích cụ thể', 'Chỉ cần có ngân sách lớn', 'Chỉ dành cho doanh nghiệp'], correctIndex: 1, explanation: 'Sự kiện là buổi tập hợp có kế hoạch, ở thời gian/địa điểm cụ thể, cho một mục đích cụ thể.' },
  { id: 'q2', question: 'Gala từ thiện đấu giá gây quỹ thuộc loại hình nào?', options: ['Sự kiện doanh nghiệp', 'Sự kiện gây quỹ/thiện nguyện', 'Nghi lễ', 'Hội nghị/triển lãm'], correctIndex: 1, explanation: 'Mục tiêu là gây quỹ và nâng nhận thức cho một mục đích — đúng nhóm gây quỹ/thiện nguyện.' },
  { id: 'q3', question: 'Vì sao nên xác định loại hình sự kiện TRƯỚC khi lập kế hoạch chi tiết?', options: ['Vì luật yêu cầu vậy', 'Vì nó gợi ý sẵn quy mô ngân sách, mức trang trọng, khách mời và địa điểm', 'Vì không liên quan gì đến các bước sau', 'Vì chỉ cần biết ngày diễn ra'], correctIndex: 1, explanation: 'Loại hình đã định hướng nhiều quyết định tiếp theo, giúp lập kế hoạch nhất quán.' },
]);

const c2 = doc('evp201-2-1-objectives-audience-concept', '2.1 — Objectives, audience & concept|||2.1 — Xác định mục tiêu, đối tượng & concept',
  'Mục tiêu SMART; phân tích đối tượng tham dự; xây dựng concept/theme phù hợp mục tiêu và ngân sách.',
  [[
    `<span class="eyebrow">EVP201 · Chapter 2 · Lesson 2.1</span>
<h2>Objectives, audience &amp; concept</h2>
<h3>Step 1 — Objectives (the WHY)</h3>
<p>Before anything else, write down what the event must <strong>achieve</strong>. Use <strong>SMART</strong> objectives: Specific, Measurable, Achievable, Relevant, Time-bound.</p>
<pre><code>Weak objective:  "Have a successful product launch"
SMART objective: "Generate 200 qualified leads and 20 press
                   mentions within 2 weeks of the launch event"
</code></pre>
<h3>Step 2 — Audience (the WHO)</h3>
<p>Identify: who is invited, how many, their expectations, demographics, and any special needs (dietary, accessibility, language). The audience shapes the venue, program length, food, and tone.</p>
<h3>Step 3 — Concept / theme (the WHAT + FEEL)</h3>
<p>The <strong>concept</strong> is the unifying idea — a theme, color palette, tone (formal/casual) — that ties decor, program and communications together. A good concept always <em>serves</em> the objective and audience, not the other way around.</p>
<div class="callout"><span class="badge">Order matters</span> Objectives → audience → concept. Picking a "cool theme" first and forcing the objective to fit it is a common planning mistake.</div>`,
    `<span class="eyebrow">EVP201 · Chương 2 · Bài 2.1</span>
<h2>Mục tiêu, đối tượng &amp; concept</h2>
<h3>Bước 1 — Mục tiêu (TẠI SAO)</h3>
<p>Trước mọi thứ khác, hãy viết ra sự kiện phải <strong>đạt được điều gì</strong>. Dùng mục tiêu <strong>SMART</strong>: Cụ thể (Specific), Đo được (Measurable), Khả thi (Achievable), Liên quan (Relevant), Có hạn thời gian (Time-bound).</p>
<pre><code>Mục tiêu yếu:  "Ra mắt sản phẩm thành công"
Mục tiêu SMART: "Thu về 200 khách hàng tiềm năng đạt chuẩn và
                  20 lượt báo chí đưa tin trong 2 tuần sau sự kiện"
</code></pre>
<h3>Bước 2 — Đối tượng (AI)</h3>
<p>Xác định: ai được mời, bao nhiêu người, kỳ vọng của họ, đặc điểm nhân khẩu học, và nhu cầu đặc biệt (ăn kiêng, khả năng tiếp cận, ngôn ngữ). Đối tượng quyết định địa điểm, độ dài chương trình, đồ ăn và tông giọng.</p>
<h3>Bước 3 — Concept / chủ đề (CÁI GÌ + CẢM XÚC)</h3>
<p><strong>Concept</strong> là ý tưởng thống nhất — chủ đề, bảng màu, tông (trang trọng/thân mật) — kết nối decor, chương trình và truyền thông lại với nhau. Concept tốt luôn <em>phục vụ</em> mục tiêu và đối tượng, không phải ngược lại.</p>
<div class="callout"><span class="badge">Thứ tự quan trọng</span> Mục tiêu → đối tượng → concept. Chọn "chủ đề hay" trước rồi ép mục tiêu theo nó là lỗi lập kế hoạch phổ biến.</div>`,
  ]]);

const c2q = quiz('evp201-quiz-2', 'Quiz 2 — Objectives, audience & concept|||Quiz 2 — Mục tiêu, đối tượng & concept', [
  { id: 'q1', question: 'Mục tiêu SMART cần đảm bảo yếu tố nào?', options: ['Chỉ cần cụ thể', 'Cụ thể, đo được, khả thi, liên quan, có hạn thời gian', 'Chỉ cần đo được', 'Chỉ cần có hạn thời gian'], correctIndex: 1, explanation: 'SMART = Specific, Measurable, Achievable, Relevant, Time-bound.' },
  { id: 'q2', question: 'Đối tượng tham dự ảnh hưởng trực tiếp đến quyết định nào?', options: ['Chỉ ảnh hưởng đến logo sự kiện', 'Địa điểm, độ dài chương trình, đồ ăn và tông giọng', 'Không ảnh hưởng gì đến kế hoạch', 'Chỉ ảnh hưởng đến ngày tổ chức'], correctIndex: 1, explanation: 'Đặc điểm và kỳ vọng của khách mời định hình nhiều quyết định thực thi.' },
  { id: 'q3', question: 'Thứ tự đúng khi lập kế hoạch theo bài học là gì?', options: ['Concept → mục tiêu → đối tượng', 'Mục tiêu → đối tượng → concept', 'Đối tượng → concept → mục tiêu', 'Không có thứ tự cố định'], correctIndex: 1, explanation: 'Xác định TẠI SAO (mục tiêu) và AI (đối tượng) trước khi chọn concept để concept phục vụ đúng mục đích.' },
]);

const c3 = doc('evp201-3-1-basic-budgeting', '3.1 — Basic budgeting|||3.1 — Lập ngân sách cơ bản',
  'Các nhóm chi phí chính; chi phí cố định vs biến đổi; dự phòng 10–15%; so sánh dự trù vs thực tế.',
  [[
    `<span class="eyebrow">EVP201 · Chapter 3 · Lesson 3.1</span>
<h2>Basic budgeting</h2>
<h3>Main cost categories</h3>
<ul>
<li><strong>Venue</strong> — rental, utilities, cleaning, insurance.</li>
<li><strong>Food &amp; beverage (F&amp;B)</strong> — catering, drinks, service staff.</li>
<li><strong>Decor &amp; production</strong> — flowers, signage, sound/lighting, stage.</li>
<li><strong>Entertainment / program</strong> — speakers, MC, performers.</li>
<li><strong>Marketing &amp; invitations</strong> — printing, digital ads, RSVP tools.</li>
<li><strong>Staffing &amp; logistics</strong> — transport, security, registration staff.</li>
<li><strong>Contingency</strong> — unplanned costs.</li>
</ul>
<h3>Fixed vs variable costs</h3>
<p><strong>Fixed costs</strong> stay the same regardless of guest count (venue rental, MC fee). <strong>Variable costs</strong> scale with the number of guests (meals, favors, seats). Estimating per-guest cost helps you re-forecast quickly if the guest count changes.</p>
<pre><code>Simple budget worksheet:
 Category        Estimated   Actual   Difference
 Venue             10,000,000   ?         ?
 F&amp;B (x150 guests)  22,500,000   ?         ?
 Decor              5,000,000   ?         ?
 Contingency (10%)   3,750,000   ?         ?
 TOTAL              41,250,000   ?         ?
</code></pre>
<div class="callout"><span class="badge">Golden rule</span> Always add a <strong>contingency of 10–15%</strong> of the total budget — venues change fees, vendors quote extra, weather forces last-minute rentals.</div>`,
    `<span class="eyebrow">EVP201 · Chương 3 · Bài 3.1</span>
<h2>Lập ngân sách cơ bản</h2>
<h3>Các nhóm chi phí chính</h3>
<ul>
<li><strong>Địa điểm</strong> — thuê chỗ, điện nước, dọn dẹp, bảo hiểm.</li>
<li><strong>Ăn uống (F&amp;B)</strong> — catering, đồ uống, nhân viên phục vụ.</li>
<li><strong>Trang trí &amp; sản xuất</strong> — hoa, biển hiệu, âm thanh/ánh sáng, sân khấu.</li>
<li><strong>Giải trí / chương trình</strong> — diễn giả, MC, người trình diễn.</li>
<li><strong>Truyền thông &amp; thiệp mời</strong> — in ấn, quảng cáo số, công cụ RSVP.</li>
<li><strong>Nhân sự &amp; hậu cần</strong> — di chuyển, an ninh, nhân viên đón khách.</li>
<li><strong>Dự phòng</strong> — chi phí phát sinh không lường trước.</li>
</ul>
<h3>Chi phí cố định vs biến đổi</h3>
<p><strong>Chi phí cố định</strong> không đổi bất kể số khách (thuê địa điểm, phí MC). <strong>Chi phí biến đổi</strong> tăng theo số khách (bữa ăn, quà tặng, ghế ngồi). Ước tính chi phí trên đầu khách giúp dự trù lại nhanh khi số khách thay đổi.</p>
<pre><code>Bảng ngân sách đơn giản:
 Mục              Dự trù       Thực tế   Chênh lệch
 Địa điểm          10,000,000    ?          ?
 F&amp;B (x150 khách)   22,500,000    ?          ?
 Trang trí          5,000,000    ?          ?
 Dự phòng (10%)      3,750,000    ?          ?
 TỔNG               41,250,000    ?          ?
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc vàng</span> Luôn thêm <strong>dự phòng 10–15%</strong> tổng ngân sách — địa điểm đổi phí, nhà cung cấp báo giá thêm, thời tiết buộc thuê gấp phút cuối.</div>`,
  ]]);

const c3q = quiz('evp201-quiz-3', 'Quiz 3 — Basic budgeting|||Quiz 3 — Ngân sách cơ bản', [
  { id: 'q1', question: 'Chi phí nào KHÔNG đổi bất kể số lượng khách tham dự?', options: ['Chi phí cố định (vd thuê địa điểm)', 'Chi phí biến đổi (vd bữa ăn)', 'Cả hai đều đổi theo số khách', 'Không loại nào cố định'], correctIndex: 0, explanation: 'Chi phí cố định không đổi theo số khách; chi phí biến đổi tăng theo số khách.' },
  { id: 'q2', question: 'Vì sao cần thêm khoản dự phòng vào ngân sách sự kiện?', options: ['Để ngân sách trông lớn hơn', 'Để xử lý chi phí phát sinh ngoài dự trù', 'Vì quy định bắt buộc', 'Không cần thiết nếu lập kế hoạch kỹ'], correctIndex: 1, explanation: 'Dự phòng 10–15% giúp xử lý các phát sinh như phí thêm từ địa điểm/nhà cung cấp.' },
  { id: 'q3', question: 'Ước tính chi phí trên đầu khách hữu ích nhất khi nào?', options: ['Khi số khách không đổi', 'Khi cần dự trù lại nhanh nếu số khách thay đổi', 'Chỉ dùng cho chi phí cố định', 'Không có tác dụng thực tế'], correctIndex: 1, explanation: 'Chi phí biến đổi theo đầu khách giúp tái dự trù nhanh khi số lượng khách thay đổi.' },
]);

const c4 = doc('evp201-4-1-venue-timing', '4.1 — Venue & timing selection|||4.1 — Chọn địa điểm & thời gian',
  'Tiêu chí chọn địa điểm (sức chứa, vị trí, layout, chi phí); khảo sát địa điểm; yếu tố thời gian (mùa, ngày trong tuần, sự kiện cạnh tranh).',
  [[
    `<span class="eyebrow">EVP201 · Chapter 4 · Lesson 4.1</span>
<h2>Venue &amp; timing selection</h2>
<h3>Venue selection criteria</h3>
<ul>
<li><strong>Capacity &amp; layout</strong> — does it comfortably fit the guest count and the program (stage, seating, stalls)?</li>
<li><strong>Location &amp; accessibility</strong> — easy to reach, parking, accessible for guests with disabilities.</li>
<li><strong>Facilities</strong> — sound/lighting equipment, kitchen, restrooms, Wi-Fi, backup power.</li>
<li><strong>Cost &amp; included services</strong> — rental fee, what's included (tables, chairs, AV) vs. extra charges.</li>
<li><strong>Availability &amp; policies</strong> — is the date free? Restrictions on catering, decor, noise, end time?</li>
</ul>
<h3>Site visit checklist</h3>
<pre><code>[ ] Walk the full space at the planned time of day
[ ] Check electrical outlets & Wi-Fi signal
[ ] Confirm capacity vs. fire-safety limit
[ ] Check parking / drop-off for guests & vendors
[ ] Ask about backup plan for outdoor events (rain)
[ ] Get quote in writing, incl. taxes & service charge
</code></pre>
<h3>Timing considerations</h3>
<p>Choosing when matters as much as where: season/weather, day of week (weekday vs. weekend), competing events on the same date, and enough <strong>lead time</strong> to book vendors and send invitations (weeks to months, depending on event size).</p>
<div class="callout"><span class="badge">Rule of thumb</span> Visit the venue in person before signing anything — photos online rarely show the real layout, lighting, or noise level.</div>`,
    `<span class="eyebrow">EVP201 · Chương 4 · Bài 4.1</span>
<h2>Chọn địa điểm &amp; thời gian</h2>
<h3>Tiêu chí chọn địa điểm</h3>
<ul>
<li><strong>Sức chứa &amp; layout</strong> — có đủ chỗ cho số khách và chương trình (sân khấu, ghế ngồi, gian hàng) không?</li>
<li><strong>Vị trí &amp; khả năng tiếp cận</strong> — dễ đến, có bãi đỗ xe, thuận tiện cho khách khuyết tật.</li>
<li><strong>Cơ sở vật chất</strong> — thiết bị âm thanh/ánh sáng, bếp, nhà vệ sinh, Wi-Fi, nguồn điện dự phòng.</li>
<li><strong>Chi phí &amp; dịch vụ kèm theo</strong> — phí thuê, gồm những gì (bàn, ghế, AV) so với phụ phí thêm.</li>
<li><strong>Tình trạng trống &amp; quy định</strong> — ngày đó còn trống không? Có hạn chế về catering, trang trí, tiếng ồn, giờ kết thúc không?</li>
</ul>
<h3>Checklist khảo sát địa điểm</h3>
<pre><code>[ ] Đi khảo sát toàn bộ không gian vào đúng thời điểm dự kiến
[ ] Kiểm tra ổ điện & tín hiệu Wi-Fi
[ ] Xác nhận sức chứa so với giới hạn an toàn cháy nổ
[ ] Kiểm tra bãi đỗ / điểm đón trả cho khách & nhà cung cấp
[ ] Hỏi phương án dự phòng cho sự kiện ngoài trời (mưa)
[ ] Lấy báo giá bằng văn bản, gồm thuế & phí dịch vụ
</code></pre>
<h3>Yếu tố thời gian</h3>
<p>Chọn thời điểm quan trọng không kém chọn nơi: mùa/thời tiết, ngày trong tuần (ngày thường vs cuối tuần), sự kiện khác cùng ngày, và đủ <strong>thời gian chuẩn bị</strong> để đặt nhà cung cấp và gửi thiệp mời (vài tuần đến vài tháng, tùy quy mô).</p>
<div class="callout"><span class="badge">Kinh nghiệm</span> Luôn khảo sát địa điểm trực tiếp trước khi ký hợp đồng — ảnh online hiếm khi cho thấy đúng layout, ánh sáng hoặc mức ồn thực tế.</div>`,
  ]]);

const c4q = quiz('evp201-quiz-4', 'Quiz 4 — Venue & timing|||Quiz 4 — Địa điểm & thời gian', [
  { id: 'q1', question: 'Vì sao nên khảo sát địa điểm trực tiếp trước khi ký hợp đồng?', options: ['Vì bắt buộc theo luật', 'Vì ảnh online hiếm khi cho thấy đúng layout, ánh sáng, mức ồn thực tế', 'Vì không cần xem giá', 'Vì không liên quan đến chất lượng sự kiện'], correctIndex: 1, explanation: 'Khảo sát trực tiếp giúp phát hiện vấn đề mà hình ảnh không thể hiện được.' },
  { id: 'q2', question: 'Yếu tố nào KHÔNG thuộc tiêu chí chọn địa điểm?', options: ['Sức chứa & layout', 'Vị trí & khả năng tiếp cận', 'Cỡ font chữ trên thiệp mời', 'Chi phí & dịch vụ kèm theo'], correctIndex: 2, explanation: 'Cỡ font trên thiệp mời không phải tiêu chí chọn địa điểm; đây thuộc phần thiết kế truyền thông.' },
  { id: 'q3', question: 'Yếu tố thời gian nào ảnh hưởng đến việc chọn ngày tổ chức sự kiện?', options: ['Chỉ cần chọn ngày bất kỳ', 'Mùa/thời tiết, ngày trong tuần, sự kiện cạnh tranh và thời gian chuẩn bị', 'Chỉ cần tránh ngày lễ', 'Không có yếu tố nào quan trọng'], correctIndex: 1, explanation: 'Cần cân nhắc mùa, ngày trong tuần, sự kiện cạnh tranh cùng ngày và đủ lead time chuẩn bị.' },
]);

const c5 = doc('evp201-5-1-timeline-checklist', '5.1 — Timeline & task checklist|||5.1 — Timeline & danh sách công việc',
  'Xây timeline tổng ngược từ ngày sự kiện; phân rã công việc; ai làm gì, khi nào; mẫu checklist theo mốc thời gian.',
  [[
    `<span class="eyebrow">EVP201 · Chapter 5 · Lesson 5.1</span>
<h2>Timeline &amp; task checklist</h2>
<h3>Build the master timeline backward</h3>
<p>Start from the <strong>event date</strong> and work backward: what must be done 3 months before, 1 month before, 1 week before, and on the day itself? This "reverse timeline" prevents last-minute surprises.</p>
<pre><code>Sample master timeline (simple event):
 3 months before : Set objective, budget, book venue
 2 months before : Book vendors (catering, AV, decor)
 1 month before  : Send invitations, confirm program
 2 weeks before  : Confirm RSVPs, finalize headcount
 1 week before   : Confirm vendors, print materials, brief team
 1 day before    : Site setup check, rehearsal if needed
 Event day       : Setup -> event -> teardown
 1 week after    : Pay vendors, send thank-yous, evaluate
</code></pre>
<h3>Task checklist &amp; ownership</h3>
<p>Break each timeline item into a task with an <strong>owner</strong> and a <strong>deadline</strong>. A simple table (task / owner / due date / status) keeps everyone accountable and makes it obvious what is late.</p>
<pre><code>Task                  Owner        Due          Status
Book venue             Planner      T-90 days    Done
Confirm catering menu  Planner      T-30 days    In progress
Print name badges      Assistant    T-7 days     Not started
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Most event-day failures trace back to a task that had no clear owner or no deadline — the checklist is the planner's main defense.</div>`,
    `<span class="eyebrow">EVP201 · Chương 5 · Bài 5.1</span>
<h2>Timeline &amp; danh sách công việc</h2>
<h3>Xây timeline tổng ngược từ ngày sự kiện</h3>
<p>Bắt đầu từ <strong>ngày diễn ra sự kiện</strong> rồi lùi dần: 3 tháng trước, 1 tháng trước, 1 tuần trước cần làm gì? Timeline "ngược" này giúp tránh những bất ngờ vào phút cuối.</p>
<pre><code>Timeline tổng mẫu (sự kiện đơn giản):
 3 tháng trước : Chốt mục tiêu, ngân sách, đặt địa điểm
 2 tháng trước : Đặt nhà cung cấp (catering, AV, trang trí)
 1 tháng trước : Gửi thiệp mời, chốt chương trình
 2 tuần trước  : Xác nhận RSVP, chốt số lượng khách
 1 tuần trước  : Xác nhận nhà cung cấp, in ấn, briefing đội ngũ
 1 ngày trước  : Kiểm tra chuẩn bị mặt bằng, chạy thử nếu cần
 Ngày sự kiện  : Setup -> diễn ra -> dọn dẹp
 1 tuần sau    : Thanh toán nhà cung cấp, gửi lời cảm ơn, đánh giá
</code></pre>
<h3>Danh sách công việc &amp; người chịu trách nhiệm</h3>
<p>Chia mỗi mục trong timeline thành một công việc có <strong>người chịu trách nhiệm</strong> và <strong>hạn hoàn thành</strong>. Một bảng đơn giản (công việc / người làm / hạn / trạng thái) giúp mọi người có trách nhiệm rõ và dễ thấy việc nào trễ.</p>
<pre><code>Công việc              Người làm    Hạn          Trạng thái
Đặt địa điểm            Planner      T-90 ngày    Xong
Chốt menu catering      Planner      T-30 ngày    Đang làm
In thẻ tên              Trợ lý       T-7 ngày     Chưa bắt đầu
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Hầu hết sự cố ngày sự kiện bắt nguồn từ một công việc không có người chịu trách nhiệm rõ hoặc không có hạn — checklist là lớp phòng thủ chính của planner.</div>`,
  ]]);

const c5q = quiz('evp201-quiz-5', 'Quiz 5 — Timeline & checklist|||Quiz 5 — Timeline & checklist', [
  { id: 'q1', question: 'Cách xây timeline tổng cho sự kiện được khuyến nghị là?', options: ['Bắt đầu từ hôm nay, tiến dần đến ngày sự kiện', 'Bắt đầu từ ngày sự kiện, lùi dần về hiện tại', 'Không cần lập timeline nếu sự kiện nhỏ', 'Chỉ cần lập timeline cho ngày diễn ra'], correctIndex: 1, explanation: 'Timeline "ngược" (bắt đầu từ ngày sự kiện, lùi về hiện tại) giúp thấy rõ các mốc cần hoàn thành trước.' },
  { id: 'q2', question: 'Một mục trong checklist công việc cần có tối thiểu những gì?', options: ['Chỉ cần tên công việc', 'Người chịu trách nhiệm và hạn hoàn thành', 'Chỉ cần ngân sách', 'Chỉ cần trạng thái xong/chưa xong'], correctIndex: 1, explanation: 'Mỗi công việc cần có owner rõ và deadline để dễ theo dõi và quy trách nhiệm.' },
  { id: 'q3', question: 'Theo bài học, nguyên nhân phổ biến nhất của sự cố ngày sự kiện là gì?', options: ['Ngân sách quá cao', 'Công việc không có người chịu trách nhiệm hoặc không có hạn rõ', 'Chọn sai màu trang trí', 'Chọn địa điểm quá đẹp'], correctIndex: 1, explanation: 'Thiếu owner hoặc deadline rõ ràng là nguyên nhân phổ biến khiến việc bị trễ hoặc bỏ sót.' },
]);

const c6 = doc('evp201-6-1-guests-program-vendors', '6.1 — Guests, program & vendors|||6.1 — Mời khách, chương trình & nhà cung cấp',
  'Quản lý danh sách khách & RSVP; thiết kế chương trình/run-of-show; chọn & quản lý nhà cung cấp, hợp đồng cơ bản.',
  [[
    `<span class="eyebrow">EVP201 · Chapter 6 · Lesson 6.1</span>
<h2>Guests, program &amp; vendors</h2>
<h3>Guest list &amp; RSVP</h3>
<p>Build a guest list with contact info and any special needs (diet, accessibility). Send invitations with a clear <strong>RSVP deadline</strong> — ideally 2–3 weeks before the event — and track responses in a simple spreadsheet (invited / confirmed / declined / no response).</p>
<h3>Program design (run of show)</h3>
<p>The <strong>run of show</strong> is a minute-by-minute schedule of the event itself — who does what, when, and for how long. It keeps the MC, speakers and staff synchronized.</p>
<pre><code>Run of show (sample):
 18:00 - 18:30  Guest arrival & registration
 18:30 - 18:40  Opening remarks (MC)
 18:40 - 19:00  Keynote speaker
 19:00 - 20:00  Dinner service
 20:00 - 20:15  Award / highlight moment
 20:15 - 21:00  Networking & closing
</code></pre>
<h3>Vendor selection &amp; basic contracts</h3>
<p>Common vendors: catering, AV/sound, decor/florist, photography, transport. For each vendor, compare at least <strong>2–3 quotes</strong>, and always get a written agreement covering: scope of service, price &amp; payment schedule, cancellation policy, and delivery/setup time.</p>
<div class="callout"><span class="badge">Tip</span> Keep a single "vendor contact sheet" (name, phone, arrival time, what they deliver) — this is the first thing you hand to your on-site team.</div>`,
    `<span class="eyebrow">EVP201 · Chương 6 · Bài 6.1</span>
<h2>Mời khách, chương trình &amp; nhà cung cấp</h2>
<h3>Danh sách khách &amp; RSVP</h3>
<p>Lập danh sách khách kèm thông tin liên hệ và nhu cầu đặc biệt (ăn kiêng, khả năng tiếp cận). Gửi thiệp mời với <strong>hạn RSVP</strong> rõ ràng — lý tưởng 2–3 tuần trước sự kiện — và theo dõi phản hồi bằng một bảng đơn giản (đã mời / đã xác nhận / từ chối / chưa phản hồi).</p>
<h3>Thiết kế chương trình (run of show)</h3>
<p><strong>Run of show</strong> là lịch trình chi tiết theo từng phút của sự kiện — ai làm gì, khi nào, trong bao lâu. Nó giúp MC, diễn giả và nhân sự luôn đồng bộ.</p>
<pre><code>Run of show (mẫu):
 18:00 - 18:30  Khách đến & đăng ký
 18:30 - 18:40  Phát biểu khai mạc (MC)
 18:40 - 19:00  Diễn giả chính
 19:00 - 20:00  Phục vụ bữa tối
 20:00 - 20:15  Trao giải / khoảnh khắc nổi bật
 20:15 - 21:00  Kết nối & bế mạc
</code></pre>
<h3>Chọn nhà cung cấp &amp; hợp đồng cơ bản</h3>
<p>Nhà cung cấp phổ biến: catering, âm thanh/AV, trang trí/hoa, chụp hình, xe đưa đón. Với mỗi nhà cung cấp, so sánh ít nhất <strong>2–3 báo giá</strong>, và luôn có hợp đồng bằng văn bản gồm: phạm vi dịch vụ, giá &amp; lịch thanh toán, chính sách hủy, thời gian giao/lắp đặt.</p>
<div class="callout"><span class="badge">Mẹo</span> Giữ một "bảng liên hệ nhà cung cấp" duy nhất (tên, số điện thoại, giờ đến, sẽ giao gì) — đây là thứ đầu tiên đưa cho đội ngũ tại chỗ.</div>`,
  ]]);

const c6q = quiz('evp201-quiz-6', 'Quiz 6 — Guests, program & vendors|||Quiz 6 — Khách, chương trình & nhà cung cấp', [
  { id: 'q1', question: 'Hạn RSVP nên được đặt khi nào là hợp lý?', options: ['Ngay trước ngày sự kiện 1 ngày', 'Khoảng 2–3 tuần trước sự kiện', 'Không cần đặt hạn', 'Sau khi sự kiện đã diễn ra'], correctIndex: 1, explanation: 'Hạn RSVP 2–3 tuần trước giúp có đủ thời gian chốt số lượng khách và chuẩn bị.' },
  { id: 'q2', question: 'Run of show dùng để làm gì?', options: ['Ghi lại ngân sách sự kiện', 'Lịch trình chi tiết theo phút, ai làm gì và khi nào trong sự kiện', 'Danh sách nhà cung cấp', 'Danh sách khách mời'], correctIndex: 1, explanation: 'Run of show là lịch trình chi tiết giúp đồng bộ MC, diễn giả và nhân sự.' },
  { id: 'q3', question: 'Khi chọn nhà cung cấp, nên làm gì trước khi ký hợp đồng?', options: ['Ký ngay với nhà cung cấp đầu tiên tìm được', 'So sánh ít nhất 2–3 báo giá và có hợp đồng bằng văn bản', 'Không cần hợp đồng nếu quen biết', 'Chỉ cần thỏa thuận miệng'], correctIndex: 1, explanation: 'So sánh nhiều báo giá và có hợp đồng rõ ràng giúp tránh rủi ro và tranh chấp.' },
]);

const c7 = doc('evp201-7-1-event-day-coordination', '7.1 — Event day: basic coordination|||7.1 — Ngày sự kiện: điều phối cơ bản',
  'Vai trò đội ngũ ngày sự kiện; setup/teardown; đón khách & check-in; xử lý sự cố cơ bản; kênh liên lạc.',
  [[
    `<span class="eyebrow">EVP201 · Chapter 7 · Lesson 7.1</span>
<h2>Event day: basic coordination</h2>
<h3>On-site team roles</h3>
<ul>
<li><strong>Lead planner / coordinator</strong> — oversees the whole event, makes final calls.</li>
<li><strong>Registration / check-in staff</strong> — welcomes guests, checks names off the list, hands out badges/gifts.</li>
<li><strong>Vendor liaison</strong> — the single point of contact for each vendor (catering, AV) on the day.</li>
<li><strong>Runner / floater</strong> — handles unplanned tasks (missing item, urgent fix).</li>
</ul>
<h3>Setup, teardown &amp; timing buffer</h3>
<p>Arrive early enough to <strong>setup</strong> (decor, AV test, seating) well before guests arrive, and plan enough time after for <strong>teardown</strong> (packing decor, returning rentals, cleaning). Always keep a small time buffer for delays.</p>
<h3>Basic troubleshooting &amp; communication</h3>
<pre><code>Common day-of issues -> quick response:
 Guest arrives without RSVP  -> have a small buffer of seats/meals
 Speaker running late        -> MC adjusts program order live
 AV/mic issue                -> backup mic & tech on standby
 Weather issue (outdoor)     -> indoor backup plan ready
</code></pre>
<p>Use one shared <strong>communication channel</strong> (group chat or walkie-talkie) so the whole team hears updates at the same time — avoid relying on one-on-one calls during the event.</p>
<div class="callout"><span class="badge">Golden rule</span> Guests should never see the problem — small issues get solved quietly backstage while the program keeps flowing on schedule.</div>`,
    `<span class="eyebrow">EVP201 · Chương 7 · Bài 7.1</span>
<h2>Ngày sự kiện: điều phối cơ bản</h2>
<h3>Vai trò đội ngũ tại chỗ</h3>
<ul>
<li><strong>Trưởng nhóm điều phối (lead planner)</strong> — giám sát toàn bộ sự kiện, quyết định cuối cùng.</li>
<li><strong>Nhân viên đón khách / check-in</strong> — chào khách, dò tên trong danh sách, phát thẻ/quà.</li>
<li><strong>Đầu mối nhà cung cấp</strong> — người liên hệ duy nhất cho mỗi nhà cung cấp (catering, AV) trong ngày.</li>
<li><strong>Người hỗ trợ linh hoạt (runner)</strong> — xử lý việc phát sinh (thiếu vật dụng, sửa gấp).</li>
</ul>
<h3>Setup, dọn dẹp &amp; khoảng đệm thời gian</h3>
<p>Đến đủ sớm để <strong>setup</strong> (trang trí, kiểm tra AV, xếp ghế) hoàn tất trước khi khách đến, và tính đủ thời gian sau đó để <strong>dọn dẹp</strong> (đóng gói trang trí, trả đồ thuê, vệ sinh). Luôn giữ một khoảng đệm thời gian nhỏ cho các trễ hẹn.</p>
<h3>Xử lý sự cố cơ bản &amp; liên lạc</h3>
<pre><code>Sự cố thường gặp -> phản ứng nhanh:
 Khách đến không RSVP     -> giữ dư một ít ghế/phần ăn
 Diễn giả trễ giờ         -> MC điều chỉnh thứ tự chương trình ngay
 Sự cố AV/mic             -> có mic & kỹ thuật dự phòng sẵn
 Sự cố thời tiết (ngoài trời) -> có phương án trong nhà dự phòng
</code></pre>
<p>Dùng một <strong>kênh liên lạc</strong> chung (group chat hoặc bộ đàm) để cả đội nhận cập nhật cùng lúc — tránh chỉ gọi riêng lẻ từng người trong lúc sự kiện diễn ra.</p>
<div class="callout"><span class="badge">Nguyên tắc vàng</span> Khách không nên nhìn thấy sự cố — vấn đề nhỏ được xử lý lặng lẽ ở phía sau trong khi chương trình vẫn trôi đúng lịch.</div>`,
  ]]);

const c7q = quiz('evp201-quiz-7', 'Quiz 7 — Event day coordination|||Quiz 7 — Điều phối ngày sự kiện', [
  { id: 'q1', question: 'Vai trò nào là đầu mối liên hệ duy nhất cho mỗi nhà cung cấp trong ngày sự kiện?', options: ['Lead planner', 'Vendor liaison', 'Nhân viên check-in', 'Runner'], correctIndex: 1, explanation: 'Vendor liaison là người liên hệ riêng cho từng nhà cung cấp để tránh nhầm lẫn thông tin.' },
  { id: 'q2', question: 'Vì sao nên dùng một kênh liên lạc chung (group chat/bộ đàm) trong ngày sự kiện?', options: ['Để trông chuyên nghiệp hơn', 'Để cả đội nhận cập nhật cùng lúc, tránh gọi riêng lẻ gây chậm', 'Vì bắt buộc theo hợp đồng địa điểm', 'Không có lý do cụ thể'], correctIndex: 1, explanation: 'Kênh chung giúp thông tin đến toàn đội đồng thời, phản ứng sự cố nhanh hơn.' },
  { id: 'q3', question: 'Nguyên tắc xử lý sự cố ngày sự kiện theo bài học là gì?', options: ['Dừng chương trình để thông báo sự cố cho khách', 'Xử lý lặng lẽ phía sau, giữ chương trình trôi đúng lịch', 'Bỏ qua sự cố nếu không quá nghiêm trọng', 'Chỉ lead planner mới được biết sự cố'], correctIndex: 1, explanation: 'Khách không nên thấy sự cố; đội ngũ xử lý âm thầm để chương trình vẫn suôn sẻ.' },
]);

const c8 = doc('evp201-8-1-post-event-evaluation-skills', '8.1 — Post-event evaluation & professional skills|||8.1 — Đánh giá sau sự kiện & kỹ năng nghề nghiệp',
  'Đánh giá sau sự kiện (khảo sát, KPI so mục tiêu, họp debrief); đóng sổ tài chính/vendor; kỹ năng cốt lõi của event planner.',
  [[
    `<span class="eyebrow">EVP201 · Chapter 8 · Lesson 8.1</span>
<h2>Post-event evaluation &amp; professional skills</h2>
<h3>Post-event evaluation</h3>
<ul>
<li><strong>Guest feedback</strong> — a short survey (satisfaction, what worked, what didn't).</li>
<li><strong>Objective vs. results</strong> — compare the SMART objective set in Chapter 2 against actual numbers (leads, funds raised, attendance).</li>
<li><strong>Debrief meeting</strong> — the team reviews what went well and what to fix next time, while memories are fresh.</li>
<li><strong>Financial close-out</strong> — reconcile the final budget (estimated vs. actual), pay remaining vendor invoices, send thank-you notes to guests, sponsors and vendors.</li>
</ul>
<pre><code>Simple evaluation report:
 Objective (planned)  : 200 leads
 Result (actual)      : 235 leads  -> objective MET
 Budget (planned)     : 41,250,000
 Budget (actual)      : 43,000,000 -> over by ~4%
 Top 3 lessons learned: ...
</code></pre>
<h3>Core professional skills of an event planner</h3>
<ul>
<li><strong>Organization</strong> — juggling many moving parts (budget, timeline, vendors) without dropping anything.</li>
<li><strong>Communication &amp; negotiation</strong> — clear briefs to vendors/staff, negotiating prices and contracts.</li>
<li><strong>Problem-solving under pressure</strong> — staying calm and adaptive when plans change on the day.</li>
<li><strong>Professional ethics</strong> — honoring contracts, protecting client budgets, respecting confidentiality.</li>
</ul>
<div class="callout"><span class="badge">Career note</span> A planner's reputation is built on how well events go, but grows fastest from how well problems are handled when things do NOT go as planned.</div>`,
    `<span class="eyebrow">EVP201 · Chương 8 · Bài 8.1</span>
<h2>Đánh giá sau sự kiện &amp; kỹ năng nghề nghiệp</h2>
<h3>Đánh giá sau sự kiện</h3>
<ul>
<li><strong>Phản hồi từ khách</strong> — khảo sát ngắn (mức hài lòng, điều tốt, điều chưa tốt).</li>
<li><strong>Mục tiêu so với kết quả</strong> — so sánh mục tiêu SMART đã đặt ở Chương 2 với số liệu thực tế (khách hàng tiềm năng, tiền gây quỹ, số lượng tham dự).</li>
<li><strong>Họp debrief</strong> — đội ngũ nhìn lại điều làm tốt và điều cần sửa cho lần sau, khi ký ức còn mới.</li>
<li><strong>Đóng sổ tài chính</strong> — đối soát ngân sách cuối cùng (dự trù vs thực tế), thanh toán hóa đơn nhà cung cấp còn lại, gửi lời cảm ơn đến khách, nhà tài trợ và nhà cung cấp.</li>
</ul>
<pre><code>Báo cáo đánh giá đơn giản:
 Mục tiêu (dự trù)     : 200 khách hàng tiềm năng
 Kết quả (thực tế)     : 235 khách hàng tiềm năng -> ĐẠT mục tiêu
 Ngân sách (dự trù)    : 41,250,000
 Ngân sách (thực tế)   : 43,000,000 -> vượt ~4%
 3 bài học chính        : ...
</code></pre>
<h3>Kỹ năng nghề nghiệp cốt lõi của event planner</h3>
<ul>
<li><strong>Tổ chức</strong> — xử lý nhiều đầu việc cùng lúc (ngân sách, timeline, nhà cung cấp) mà không bỏ sót.</li>
<li><strong>Giao tiếp &amp; đàm phán</strong> — briefing rõ ràng cho nhà cung cấp/nhân sự, đàm phán giá và hợp đồng.</li>
<li><strong>Giải quyết vấn đề dưới áp lực</strong> — giữ bình tĩnh và linh hoạt khi kế hoạch thay đổi ngay trong ngày.</li>
<li><strong>Đạo đức nghề nghiệp</strong> — tôn trọng hợp đồng, bảo vệ ngân sách khách hàng, giữ bảo mật thông tin.</li>
</ul>
<div class="callout"><span class="badge">Ghi chú nghề nghiệp</span> Danh tiếng của planner được xây từ việc sự kiện diễn ra tốt, nhưng lớn nhanh nhất từ cách xử lý vấn đề khi mọi thứ KHÔNG diễn ra như kế hoạch.</div>`,
  ]]);

const c8q = quiz('evp201-quiz-8', 'Quiz 8 — Post-event evaluation & skills|||Quiz 8 — Đánh giá sau sự kiện & kỹ năng', [
  { id: 'q1', question: 'Đánh giá sau sự kiện nên so sánh điều gì?', options: ['Chỉ so sánh số lượng khách', 'Mục tiêu SMART đã đặt ra với kết quả thực tế', 'Chỉ so sánh màu trang trí', 'Không cần so sánh gì'], correctIndex: 1, explanation: 'So sánh mục tiêu ban đầu với kết quả thực tế giúp đo được sự kiện có thành công hay không.' },
  { id: 'q2', question: 'Họp debrief nên diễn ra khi nào để hiệu quả nhất?', options: ['Vài tháng sau sự kiện', 'Ngay sau sự kiện khi ký ức còn mới', 'Trước khi sự kiện diễn ra', 'Không cần họp debrief'], correctIndex: 1, explanation: 'Họp debrief sớm giúp ghi nhận chính xác điều làm tốt và điều cần cải thiện.' },
  { id: 'q3', question: 'Theo bài học, danh tiếng của event planner phát triển nhanh nhất từ đâu?', options: ['Từ việc luôn có ngân sách lớn', 'Từ cách xử lý vấn đề khi kế hoạch không diễn ra như dự kiến', 'Từ số lượng khách mời', 'Từ việc chọn địa điểm sang trọng'], correctIndex: 1, explanation: 'Khả năng xử lý sự cố linh hoạt là yếu tố xây dựng danh tiếng nghề nghiệp nhanh nhất.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'EVP201',
    slug: 'evp201-event-planning',
    title: 'Event Planning',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EVP201.webp',
    shortDescription: 'Foundations of event planning — event types, objectives/audience/concept, budgeting, venue & timing, timeline/checklists, guests/program/vendors, event-day coordination, post-event evaluation. Bilingual, with quizzes.|||Nền tảng lập kế hoạch sự kiện — loại hình, mục tiêu/đối tượng/concept, ngân sách, địa điểm & thời gian, timeline/checklist, khách/chương trình/nhà cung cấp, điều phối ngày sự kiện, đánh giá sau sự kiện. Song ngữ, có quiz.',
    description: 'Môn <strong>EVP201 — Event Planning</strong> (Lập kế hoạch Sự kiện, kỳ 1, khối Quản trị Kinh doanh) là môn <strong>nhập môn</strong> cung cấp nền tảng cơ bản để lập kế hoạch sự kiện — khác với môn nâng cao Entertainment Planning thiên về giải trí. Từ <strong>loại hình sự kiện</strong> → <strong>mục tiêu, đối tượng &amp; concept</strong> → <strong>ngân sách cơ bản</strong> → <strong>địa điểm &amp; thời gian</strong> → <strong>timeline &amp; checklist</strong> → <strong>khách mời, chương trình &amp; nhà cung cấp</strong> → <strong>điều phối ngày sự kiện</strong> → <strong>đánh giá sau sự kiện &amp; kỹ năng nghề nghiệp</strong>. Bám giáo trình Judy Allen, Shone/Parry, song ngữ, có ví dụ thực tế và quiz mỗi chương.',
    whatYouLearn: 'Phân loại sự kiện (doanh nghiệp, xã hội, gây quỹ, hội nghị, nghi lễ); mục tiêu SMART, phân tích đối tượng, xây concept; nhóm chi phí, chi phí cố định/biến đổi, dự phòng ngân sách; tiêu chí chọn địa điểm & thời gian; xây timeline ngược & checklist công việc; quản lý khách/RSVP, thiết kế run of show, chọn & quản lý nhà cung cấp; vai trò đội ngũ & xử lý sự cố ngày sự kiện; đánh giá sau sự kiện, đóng sổ tài chính & kỹ năng nghề nghiệp.',
    requirements: 'Không yêu cầu kiến thức nền trước đó — môn nhập môn Kỳ 1. Nên có tư duy tổ chức và quan tâm đến làm việc nhóm.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Judy Allen/Shone-Parry, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Sự kiện là gì, vai trò event planner, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Sự kiện & các loại hình|||Chapter 1 — Events & types', description: 'Định nghĩa sự kiện, phân loại doanh nghiệp/xã hội/gây quỹ/hội nghị/nghi lễ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mục tiêu, đối tượng & concept|||Chapter 2 — Objectives, audience & concept', description: 'SMART, phân tích đối tượng, xây concept.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ngân sách cơ bản|||Chapter 3 — Basic budgeting', description: 'Nhóm chi phí, cố định/biến đổi, dự phòng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Địa điểm & thời gian|||Chapter 4 — Venue & timing', description: 'Tiêu chí chọn địa điểm, khảo sát, yếu tố thời gian.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Timeline & checklist|||Chapter 5 — Timeline & checklist', description: 'Timeline ngược, phân rã công việc, người chịu trách nhiệm.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Khách, chương trình & nhà cung cấp|||Chapter 6 — Guests, program & vendors', description: 'RSVP, run of show, chọn & quản lý nhà cung cấp.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Ngày sự kiện: điều phối cơ bản|||Chapter 7 — Event day coordination', description: 'Vai trò đội ngũ, setup/teardown, xử lý sự cố, liên lạc.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đánh giá sau sự kiện & kỹ năng nghề nghiệp|||Chapter 8 — Post-event evaluation & skills', description: 'Đánh giá kết quả, đóng sổ, kỹ năng nghề nghiệp.', lessons: [c8, c8q] },
  ],
};
