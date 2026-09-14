/**
 * EEP201 — Entertainment Planning. Giáo trình FLM (syl): lập kế hoạch sự
 * kiện/giải trí — concept, mục tiêu & đối tượng, timeline/production
 * schedule, địa điểm & thiết kế không gian, chương trình & nghệ sĩ, nhà
 * cung cấp & hậu cần, rủi ro & dự phòng, run sheet ngày sự kiện & đánh giá
 * sau sự kiện. Trích: Judy Allen "Event Planning"; Bowdin "Events
 * Management"; Shone & Parry "Successful Event Management". Song ngữ.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('eep201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">EEP201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Entertainment Planning — event concept, objectives &amp; audience, timelines, venue design, programming, vendors &amp; logistics, risk management, and day-of execution — in one place. The full official slides &amp; giáo trình live on <strong>FLM</strong>; below are widely-cited textbooks and free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for EEP201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Event Planning: The Ultimate Guide</em> — Judy Allen (Wiley) — concept development, timelines, vendor &amp; logistics management from a working planner's playbook.</li>
<li><em>Events Management</em> — Glenn A. J. Bowdin, Johnny Allen, William O'Toole, Rob Harris, Ian McDonnell (Routledge) — the academic reference on stakeholders, risk &amp; project management for events.</li>
<li><em>Successful Event Management: A Practical Handbook</em> — Anton Shone &amp; Bryn Parry (Cengage) — end-to-end lifecycle including post-event evaluation.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.eventmanagerblog.com/" target="_blank" rel="noopener">Event Manager Blog</a> — planning checklists &amp; industry practice</li>
<li><a href="https://www.iaee.com/" target="_blank" rel="noopener">IAEE — International Association of Exhibitions &amp; Events</a> — standards &amp; resources</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@EventManagerBlog" target="_blank" rel="noopener">Event Manager Blog (YouTube)</a> — planning walkthroughs</li>
<li><a href="https://www.youtube.com/@BizBash" target="_blank" rel="noopener">BizBash</a> — event design &amp; production case studies</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.trello.com/" target="_blank" rel="noopener">Trello</a> — timeline &amp; task tracking for a production schedule</li>
<li><a href="https://www.allseated.com/" target="_blank" rel="noopener">Allseated</a> — venue floor-plan &amp; seating design</li>
<li><a href="https://www.eventbrite.com/" target="_blank" rel="noopener">Eventbrite</a> — registration &amp; RSVP for audience planning</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the planning process, SMART objectives, audience &amp; theme, the production schedule.</li>
<li><strong>Practice</strong> — write a one-page concept brief and a reverse-timeline schedule for a mock event.</li>
<li><strong>Go deeper</strong> — venue &amp; space design, programming &amp; talent booking, vendor RFPs, risk &amp; contingency plans.</li>
<li><strong>Job-ready</strong> — build a full run sheet, coordinate a live event, run a post-event debrief with real KPIs.</li>
</ol></div>`,
    `<span class="eyebrow">EEP201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Lập kế hoạch giải trí/sự kiện — concept, mục tiêu &amp; đối tượng, timeline, thiết kế địa điểm, chương trình, nhà cung cấp &amp; hậu cần, quản trị rủi ro, và điều phối ngày sự kiện — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là sách kinh điển của ngành và nguồn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của EEP201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Event Planning: The Ultimate Guide</em> — Judy Allen (Wiley) — dựng concept, làm timeline, quản lý nhà cung cấp &amp; hậu cần theo kinh nghiệm người làm nghề.</li>
<li><em>Events Management</em> — Glenn A. J. Bowdin, Johnny Allen, William O'Toole, Rob Harris, Ian McDonnell (Routledge) — tài liệu học thuật về stakeholder, rủi ro &amp; quản lý dự án sự kiện.</li>
<li><em>Successful Event Management: A Practical Handbook</em> — Anton Shone &amp; Bryn Parry (Cengage) — toàn bộ vòng đời sự kiện kể cả đánh giá sau sự kiện.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.eventmanagerblog.com/" target="_blank" rel="noopener">Event Manager Blog</a> — checklist &amp; thực hành ngành</li>
<li><a href="https://www.iaee.com/" target="_blank" rel="noopener">IAEE — International Association of Exhibitions &amp; Events</a> — chuẩn &amp; tài nguyên</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@EventManagerBlog" target="_blank" rel="noopener">Event Manager Blog (YouTube)</a> — hướng dẫn lập kế hoạch</li>
<li><a href="https://www.youtube.com/@BizBash" target="_blank" rel="noopener">BizBash</a> — case study thiết kế &amp; sản xuất sự kiện</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.trello.com/" target="_blank" rel="noopener">Trello</a> — theo dõi timeline &amp; công việc cho production schedule</li>
<li><a href="https://www.allseated.com/" target="_blank" rel="noopener">Allseated</a> — thiết kế sơ đồ mặt bằng &amp; chỗ ngồi</li>
<li><a href="https://www.eventbrite.com/" target="_blank" rel="noopener">Eventbrite</a> — đăng ký &amp; RSVP để nắm đối tượng</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — quy trình lập kế hoạch, mục tiêu SMART, đối tượng &amp; chủ đề, production schedule.</li>
<li><strong>Luyện tập</strong> — viết một concept brief một trang và một timeline ngược cho sự kiện giả định.</li>
<li><strong>Đào sâu thực tế</strong> — thiết kế địa điểm &amp; không gian, dựng chương trình &amp; đặt nghệ sĩ, RFP nhà cung cấp, kế hoạch rủi ro &amp; dự phòng.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng run sheet đầy đủ, điều phối một sự kiện thật, chạy buổi debrief sau sự kiện với KPI thật.</li>
</ol></div>`,
  ]]);

const intro = doc('eep201-0-1-overview', 'Course overview: Entertainment Planning|||Tổng quan: Lập kế hoạch giải trí/sự kiện',
  'Lập kế hoạch sự kiện làm gì; vòng đời sự kiện (Judy Allen): concept → mục tiêu → timeline → thực thi → đánh giá; các loại sự kiện.',
  [[
    `<span class="eyebrow">EEP201 · Lesson 0.1 · Overview</span>
<h2>Entertainment Planning</h2>
<p class="lead">This course teaches you to plan and run an event — corporate, social, or public — from a raw idea to a working <strong>concept</strong>, a detailed <strong>production schedule</strong>, a chosen <strong>venue</strong>, a booked <strong>program</strong>, coordinated <strong>vendors</strong>, a <strong>risk/contingency plan</strong>, and a live-day <strong>run sheet</strong> that ends in a proper <strong>post-event evaluation</strong>.</p>
<h3>The event planning lifecycle (Judy Allen)</h3>
<ul>
<li><strong>Concept</strong> — the big idea that ties objectives, theme and audience together.</li>
<li><strong>Objectives &amp; audience</strong> — why this event exists, and who it's for.</li>
<li><strong>Timeline (production schedule)</strong> — every task, owner and deadline, counted back from event day.</li>
<li><strong>Venue &amp; program</strong> — where it happens and what fills the agenda.</li>
<li><strong>Vendors &amp; logistics</strong> — who supplies what, and how it all arrives on time.</li>
<li><strong>Risk &amp; contingency</strong> — what could go wrong, and the backup plan.</li>
<li><strong>Execution &amp; evaluation</strong> — the run sheet on the day, then measuring against the objectives.</li>
</ul>
<h3>Types of events</h3>
<p><strong>Corporate</strong> (conferences, product launches, company parties), <strong>social</strong> (weddings, birthdays, galas), and <strong>public</strong> (festivals, fundraisers, community events) — each has different stakeholders, budgets and risk profiles, but the same eight-step lifecycle underneath.</p>
<div class="callout"><span class="badge">Why it matters</span> A great event isn't luck — it's a concept made real by a schedule, a venue, a program and a team that all point at the same objective.</div>`,
    `<span class="eyebrow">EEP201 · Bài 0.1 · Tổng quan</span>
<h2>Lập kế hoạch giải trí/sự kiện</h2>
<p class="lead">Môn này dạy bạn lập kế hoạch và điều hành một sự kiện — công ty, xã hội, hay công cộng — từ một ý tưởng thô thành một <strong>concept</strong> có thể chạy được, một <strong>production schedule</strong> chi tiết, một <strong>địa điểm</strong> đã chọn, một <strong>chương trình</strong> đã đặt, các <strong>nhà cung cấp</strong> đã phối hợp, một <strong>kế hoạch rủi ro/dự phòng</strong>, và một <strong>run sheet</strong> ngày diễn ra khép lại bằng một buổi <strong>đánh giá sau sự kiện</strong> đúng nghĩa.</p>
<h3>Vòng đời lập kế hoạch sự kiện (Judy Allen)</h3>
<ul>
<li><strong>Concept</strong> — ý tưởng lớn nối mục tiêu, chủ đề và đối tượng lại với nhau.</li>
<li><strong>Mục tiêu &amp; đối tượng</strong> — vì sao sự kiện tồn tại, và dành cho ai.</li>
<li><strong>Timeline (production schedule)</strong> — mọi việc, người chịu trách nhiệm và hạn chót, đếm ngược từ ngày sự kiện.</li>
<li><strong>Địa điểm &amp; chương trình</strong> — diễn ra ở đâu và nội dung chương trình gồm gì.</li>
<li><strong>Nhà cung cấp &amp; hậu cần</strong> — ai cung cấp gì, và làm sao mọi thứ tới đúng giờ.</li>
<li><strong>Rủi ro &amp; dự phòng</strong> — điều gì có thể sai, và kế hoạch dự phòng là gì.</li>
<li><strong>Thực thi &amp; đánh giá</strong> — run sheet trong ngày, sau đó đo lại theo mục tiêu.</li>
</ul>
<h3>Các loại sự kiện</h3>
<p><strong>Công ty</strong> (hội nghị, ra mắt sản phẩm, tiệc công ty), <strong>xã hội</strong> (đám cưới, sinh nhật, gala), và <strong>công cộng</strong> (lễ hội, gây quỹ, sự kiện cộng đồng) — mỗi loại có stakeholder, ngân sách và mức rủi ro khác nhau, nhưng cùng chạy trên một vòng đời tám bước.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Một sự kiện tốt không phải vì may — mà vì một concept được biến thành thật nhờ một lịch trình, một địa điểm, một chương trình và một đội ngũ cùng hướng về một mục tiêu.</div>`,
  ]]);

const c1 = doc('eep201-1-1-overview-concept', '1.1 — Event planning overview & concept development|||1.1 — Tổng quan lập kế hoạch sự kiện & phát triển concept',
  'Định nghĩa lập kế hoạch sự kiện; quy trình 8 bước (Judy Allen); phát triển concept — ý tưởng lớn, chủ đề, câu chuyện.',
  [[
    `<span class="eyebrow">EEP201 · Chapter 1 · Lesson 1.1</span>
<h2>Event planning overview &amp; concept development</h2>
<h3>What is event planning?</h3>
<p><strong>Event planning</strong> is the coordination of every logistical and creative element — venue, program, vendors, budget, timeline — into one experience that meets a specific objective for a specific audience. It sits at the intersection of <em>project management</em> and <em>creative design</em>.</p>
<h3>Concept development</h3>
<p>The <strong>concept</strong> is the single big idea that everything else is judged against: the theme, the tone, the story the event tells. A strong concept answers three questions before any vendor is booked: <em>Why does this event exist? Who is it for? What should people feel when they leave?</em></p>
<pre><code>Event planning process (Judy Allen):
1. Concept        - the big idea (theme, tone, story)
2. Objectives     - why this event exists
3. Audience       - who it is for
4. Timeline        - production schedule, counted back from event day
5. Venue & program - where, and what fills the agenda
6. Vendors        - who supplies what
7. Risk plan      - what could go wrong
8. Execution      - run the event, then evaluate against step 2
</code></pre>
<div class="callout"><span class="badge">Concept first</span> Skipping concept development and jumping straight to "book a venue" is the single most common planning mistake — every later decision (venue, program, decor) should be tested against the concept, not the other way around.</div>`,
    `<span class="eyebrow">EEP201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan lập kế hoạch sự kiện &amp; phát triển concept</h2>
<h3>Lập kế hoạch sự kiện là gì?</h3>
<p><strong>Lập kế hoạch sự kiện</strong> là việc phối hợp mọi yếu tố hậu cần và sáng tạo — địa điểm, chương trình, nhà cung cấp, ngân sách, lịch trình — thành một trải nghiệm đáp ứng đúng một mục tiêu cho đúng một đối tượng. Nó nằm ở giao điểm giữa <em>quản lý dự án</em> và <em>thiết kế sáng tạo</em>.</p>
<h3>Phát triển concept</h3>
<p><strong>Concept</strong> là ý tưởng lớn duy nhất mà mọi thứ khác được đối chiếu vào: chủ đề, tinh thần, câu chuyện mà sự kiện kể. Một concept tốt trả lời được ba câu hỏi trước khi đặt bất kỳ nhà cung cấp nào: <em>Vì sao sự kiện này tồn tại? Dành cho ai? Người tham dự nên cảm thấy gì khi ra về?</em></p>
<pre><code>Quy trình lập kế hoạch sự kiện (Judy Allen):
1. Concept    - ý tưởng lớn (chủ đề, tinh thần, câu chuyện)
2. Mục tiêu   - vì sao sự kiện tồn tại
3. Đối tượng  - dành cho ai
4. Timeline    - production schedule, đếm ngược từ ngày sự kiện
5. Địa điểm & chương trình - ở đâu, và nội dung chương trình gồm gì
6. Nhà cung cấp - ai cung cấp gì
7. Kế hoạch rủi ro - điều gì có thể sai
8. Thực thi   - chạy sự kiện, rồi đánh giá lại theo bước 2
</code></pre>
<div class="callout"><span class="badge">Concept trước tiên</span> Bỏ qua phát triển concept và nhảy thẳng vào "đặt địa điểm" là lỗi lập kế hoạch phổ biến nhất — mọi quyết định sau đó (địa điểm, chương trình, décor) phải được kiểm lại theo concept, không phải ngược lại.</div>`,
  ]]);

const c1q = quiz('eep201-quiz-1', 'Quiz 1 — Overview & concept|||Quiz 1 — Tổng quan & concept', [
  { id: 'q1', question: 'Theo quy trình 8 bước của Judy Allen, bước nào đến TRƯỚC bước "Timeline"?', options: ['Thực thi', 'Đối tượng', 'Đánh giá', 'Kế hoạch rủi ro'], correctIndex: 1, explanation: 'Thứ tự: Concept → Mục tiêu → Đối tượng → Timeline → ...' },
  { id: 'q2', question: '"Concept" trong lập kế hoạch sự kiện là gì?', options: ['Bảng ngân sách chi tiết', 'Ý tưởng lớn nối mục tiêu, chủ đề & đối tượng', 'Danh sách nhà cung cấp', 'Sơ đồ mặt bằng địa điểm'], correctIndex: 1, explanation: 'Concept là ý tưởng lớn mà mọi quyết định sau (địa điểm, chương trình, décor) được đối chiếu vào.' },
  { id: 'q3', question: 'Lỗi lập kế hoạch phổ biến nhất được nhắc trong bài là?', options: ['Đặt quá nhiều nhà cung cấp', 'Bỏ qua phát triển concept, nhảy thẳng vào đặt địa điểm', 'Làm timeline quá chi tiết', 'Đánh giá sau sự kiện quá kỹ'], correctIndex: 1, explanation: 'Mọi quyết định phải được kiểm lại theo concept, không phải chọn địa điểm trước rồi mới nghĩ concept.' },
]);

const c2 = doc('eep201-2-1-objectives-audience-theme', '2.1 — Objectives, audience & theme|||2.1 — Mục tiêu, đối tượng & chủ đề',
  'Mục tiêu SMART; phân tích đối tượng (nhân khẩu học, kỳ vọng); chọn chủ đề gắn với mục tiêu & đối tượng; nhu cầu stakeholder (Bowdin).',
  [[
    `<span class="eyebrow">EEP201 · Chapter 2 · Lesson 2.1</span>
<h2>Objectives, audience &amp; theme</h2>
<h3>SMART objectives</h3>
<p>Every event needs objectives that are <strong>S</strong>pecific, <strong>M</strong>easurable, <strong>A</strong>chievable, <strong>R</strong>elevant, <strong>T</strong>ime-bound. "Make people happy" is not an objective; "Generate 150 qualified leads and a 4.5/5 satisfaction score by the end of the conference" is.</p>
<h3>Audience analysis</h3>
<p>Before booking anything, profile the audience: <strong>demographics</strong> (age, role, culture), <strong>expectations</strong> (formal vs. casual, what "good" looks like to them), and <strong>size</strong> (drives venue and budget). Bowdin's stakeholder view extends this beyond attendees to sponsors, staff and the community around the venue — each with their own needs the event must satisfy.</p>
<h3>Choosing a theme</h3>
<p>The <strong>theme</strong> should reinforce the objective and speak to the audience — not be decoration bolted on afterward. A product-launch theme built around "innovation" only works if the audience (press, partners) actually cares about that story.</p>
<pre><code>SMART objective example:
 Not SMART: "Have a successful gala."
 SMART:     "Raise $50,000 for the scholarship fund from 200
             attendees, with a post-event satisfaction score
             ≥ 4.5/5, by the end of the gala evening."
</code></pre>
<div class="callout"><span class="badge">Order matters</span> Objectives and audience come BEFORE theme — a beautiful theme that ignores who's in the room, or what they came to accomplish, is decoration, not planning.</div>`,
    `<span class="eyebrow">EEP201 · Chương 2 · Bài 2.1</span>
<h2>Mục tiêu, đối tượng &amp; chủ đề</h2>
<h3>Mục tiêu SMART</h3>
<p>Mọi sự kiện cần mục tiêu đạt chuẩn <strong>S</strong>pecific (cụ thể), <strong>M</strong>easurable (đo được), <strong>A</strong>chievable (khả thi), <strong>R</strong>elevant (liên quan), <strong>T</strong>ime-bound (có hạn). "Làm mọi người vui" không phải mục tiêu; "Thu về 150 lead đạt chuẩn và điểm hài lòng 4.5/5 khi hội nghị kết thúc" mới là mục tiêu.</p>
<h3>Phân tích đối tượng</h3>
<p>Trước khi đặt bất cứ thứ gì, hãy phác hồ sơ đối tượng: <strong>nhân khẩu học</strong> (tuổi, vai trò, văn hoá), <strong>kỳ vọng</strong> (trang trọng hay thoải mái, "tốt" với họ nghĩa là gì), và <strong>quy mô</strong> (quyết định địa điểm và ngân sách). Góc nhìn stakeholder của Bowdin mở rộng điều này ra ngoài người tham dự — tới nhà tài trợ, nhân sự và cộng đồng quanh địa điểm — mỗi nhóm có nhu cầu riêng mà sự kiện phải đáp ứng.</p>
<h3>Chọn chủ đề</h3>
<p><strong>Chủ đề</strong> phải củng cố mục tiêu và nói đúng với đối tượng — không phải trang trí gắn thêm sau cùng. Một chủ đề ra mắt sản phẩm xây quanh "đổi mới" chỉ hiệu quả nếu đối tượng (báo chí, đối tác) thật sự quan tâm câu chuyện đó.</p>
<pre><code>Ví dụ mục tiêu SMART:
 Không SMART: "Tổ chức một buổi gala thành công."
 SMART:      "Gây quỹ 50.000 đô cho học bổng từ 200 khách,
             điểm hài lòng sau sự kiện ≥ 4.5/5, tính đến hết
             buổi tối gala."
</code></pre>
<div class="callout"><span class="badge">Thứ tự quan trọng</span> Mục tiêu và đối tượng đến TRƯỚC chủ đề — một chủ đề đẹp mà bỏ qua ai đang ngồi trong phòng, hoặc họ tới để đạt được gì, chỉ là trang trí, không phải lập kế hoạch.</div>`,
  ]]);

const c2q = quiz('eep201-quiz-2', 'Quiz 2 — Objectives, audience & theme|||Quiz 2 — Mục tiêu, đối tượng & chủ đề', [
  { id: 'q1', question: 'Chữ "M" trong mục tiêu SMART là gì?', options: ['Multiple (nhiều)', 'Measurable (đo được)', 'Modern (hiện đại)', 'Moderate (vừa phải)'], correctIndex: 1, explanation: 'SMART: Specific, Measurable, Achievable, Relevant, Time-bound.' },
  { id: 'q2', question: 'Theo góc nhìn stakeholder của Bowdin, ai KHÔNG được xem là stakeholder cần cân nhắc?', options: ['Người tham dự', 'Nhà tài trợ', 'Nhân sự sự kiện', 'Không có — tất cả đều là stakeholder'], correctIndex: 3, explanation: 'Stakeholder gồm cả người tham dự, tài trợ, nhân sự và cộng đồng quanh địa điểm.' },
  { id: 'q3', question: 'Theo bài học, chủ đề nên được chọn khi nào?', options: ['Trước khi xác định mục tiêu', 'Sau khi đã hiểu mục tiêu & đối tượng', 'Ngay khi đặt địa điểm', 'Không liên quan tới mục tiêu'], correctIndex: 1, explanation: 'Chủ đề phải củng cố mục tiêu và nói đúng với đối tượng, nên đến sau khi đã xác định cả hai.' },
]);

const c3 = doc('eep201-3-1-timeline-production-schedule', '3.1 — Detailed planning & the production schedule|||3.1 — Lập kế hoạch chi tiết & production schedule',
  'Reverse-timeline planning; production schedule (task, owner, deadline); đường tới hạn (critical path) & milestone.',
  [[
    `<span class="eyebrow">EEP201 · Chapter 3 · Lesson 3.1</span>
<h2>Detailed planning &amp; the production schedule</h2>
<h3>Reverse-timeline planning</h3>
<p>Start from event day and work <strong>backward</strong>: what has to be true 1 day before, 1 week before, 1 month before, 3 months before? This "reverse-timeline" method (Judy Allen) surfaces deadlines that a forward plan easily misses — e.g. "invitations must go out 6 weeks before" only becomes obvious once you count back from the RSVP deadline.</p>
<h3>The production schedule</h3>
<p>A <strong>production schedule</strong> lists every task with an <strong>owner</strong> and a <strong>deadline</strong> — venue contract, vendor bookings, marketing, rehearsals, load-in. It is the single source of truth the whole team works from.</p>
<h3>Critical path &amp; milestones</h3>
<p>The <strong>critical path</strong> is the chain of tasks that, if delayed, delays the whole event (e.g. venue confirmed → permits filed → catering finalized). <strong>Milestones</strong> are checkpoints (contract signed, 50% deposits paid, final headcount) used to confirm the plan is on track.</p>
<pre><code>Sample production schedule (excerpt):
 T-90 days  Venue contract signed          Owner: PM
 T-60 days  Vendors booked & deposits paid Owner: Ops
 T-30 days  Program & run sheet drafted    Owner: Producer
 T-14 days  Final headcount to caterer     Owner: PM
 T-1 day    Load-in & full rehearsal       Owner: Production team
 T-0        Event day                      Owner: Everyone
</code></pre>
<div class="callout"><span class="badge">Buffer, always</span> Build slack into every deadline on the critical path — a vendor confirming "on time" with zero buffer means one late reply turns into a missed event day.</div>`,
    `<span class="eyebrow">EEP201 · Chương 3 · Bài 3.1</span>
<h2>Lập kế hoạch chi tiết &amp; production schedule</h2>
<h3>Lập lịch ngược (reverse-timeline)</h3>
<p>Bắt đầu từ ngày sự kiện và đi <strong>ngược lại</strong>: điều gì phải đúng 1 ngày trước, 1 tuần trước, 1 tháng trước, 3 tháng trước? Phương pháp "lập lịch ngược" này (Judy Allen) làm lộ ra những hạn chót mà lập kế hoạch xuôi dễ bỏ sót — ví dụ "thư mời phải gửi trước 6 tuần" chỉ trở nên rõ ràng khi đếm ngược từ hạn RSVP.</p>
<h3>Production schedule</h3>
<p>Một <strong>production schedule</strong> liệt kê mọi việc kèm <strong>người chịu trách nhiệm</strong> và <strong>hạn chót</strong> — hợp đồng địa điểm, đặt nhà cung cấp, marketing, tổng duyệt, load-in. Đây là nguồn sự thật duy nhất mà cả đội dựa vào.</p>
<h3>Đường tới hạn &amp; milestone</h3>
<p><strong>Đường tới hạn (critical path)</strong> là chuỗi việc mà nếu trễ sẽ làm trễ cả sự kiện (vd: xác nhận địa điểm → nộp giấy phép → chốt catering). <strong>Milestone</strong> là các điểm kiểm (hợp đồng đã ký, đặt cọc 50%, số khách cuối cùng) dùng để xác nhận kế hoạch đang đúng tiến độ.</p>
<pre><code>Mẫu production schedule (trích):
 T-90 ngày  Ký hợp đồng địa điểm         Chịu trách nhiệm: PM
 T-60 ngày  Đặt nhà cung cấp & đặt cọc    Chịu trách nhiệm: Ops
 T-30 ngày  Nháp chương trình & run sheet Chịu trách nhiệm: Producer
 T-14 ngày  Chốt số khách cho catering    Chịu trách nhiệm: PM
 T-1 ngày   Load-in & tổng duyệt          Chịu trách nhiệm: Đội production
 T-0        Ngày sự kiện                  Chịu trách nhiệm: Tất cả
</code></pre>
<div class="callout"><span class="badge">Luôn có buffer</span> Chèn khoảng đệm vào mọi hạn chót trên đường tới hạn — một nhà cung cấp xác nhận "đúng giờ" mà không có buffer nghĩa là một lần trả lời trễ biến thành lỡ ngày sự kiện.</div>`,
  ]]);

const c3q = quiz('eep201-quiz-3', 'Quiz 3 — Timeline & production schedule|||Quiz 3 — Timeline & production schedule', [
  { id: 'q1', question: 'Lập lịch ngược (reverse-timeline planning) bắt đầu từ đâu?', options: ['Ngày ký hợp đồng địa điểm', 'Ngày sự kiện, rồi đi lùi về hiện tại', 'Ngày gửi thư mời', 'Ngày đánh giá sau sự kiện'], correctIndex: 1, explanation: 'Đi ngược từ event day giúp lộ ra các hạn chót dễ bị bỏ sót khi lập kế hoạch xuôi.' },
  { id: 'q2', question: '"Đường tới hạn" (critical path) là gì?', options: ['Danh sách khách VIP', 'Chuỗi việc mà nếu trễ sẽ làm trễ cả sự kiện', 'Ngân sách tối thiểu', 'Sơ đồ mặt bằng địa điểm'], correctIndex: 1, explanation: 'Critical path là chuỗi việc quyết định tiến độ chung — trễ một việc trong chuỗi là trễ cả sự kiện.' },
  { id: 'q3', question: 'Vì sao nên chèn buffer vào mọi hạn chót trên đường tới hạn?', options: ['Để tiết kiệm ngân sách', 'Để một lần trả lời trễ không biến thành lỡ ngày sự kiện', 'Vì quy định của FLM', 'Để giảm số nhà cung cấp'], correctIndex: 1, explanation: 'Không có buffer, một trễ nhỏ ở một mắt xích có thể kéo trễ toàn bộ kế hoạch.' },
]);

const c4 = doc('eep201-4-1-venue-space-design', '4.1 — Venue selection & space design|||4.1 — Chọn địa điểm & thiết kế không gian',
  'Tiêu chí chọn địa điểm (Shone & Parry); kiểu bố cục (theatre/banquet/classroom/cocktail); luồng di chuyển & sightline; site inspection.',
  [[
    `<span class="eyebrow">EEP201 · Chapter 4 · Lesson 4.1</span>
<h2>Venue selection &amp; space design</h2>
<h3>Venue selection criteria (Shone &amp; Parry)</h3>
<ul>
<li><strong>Capacity</strong> — fits the guest count without feeling empty or cramped.</li>
<li><strong>Location &amp; accessibility</strong> — travel time, parking, accessibility for guests with disabilities.</li>
<li><strong>Cost</strong> — rental fee plus hidden costs (security, cleaning, overtime, corkage).</li>
<li><strong>Technical capability</strong> — power load, rigging points, Wi-Fi, AV, loading dock.</li>
</ul>
<h3>Space design &amp; layout types</h3>
<p>Choose the floor plan that matches the program: <strong>theatre</strong> (rows facing a stage — best for presentations), <strong>banquet</strong> (round tables — best for dining and networking), <strong>classroom</strong> (tables + chairs facing front — best for workshops), <strong>cocktail</strong> (standing, no fixed seats — best for mingling).</p>
<h3>Flow &amp; sightlines</h3>
<p>Design the guest <strong>flow</strong> — entrance → registration → main space → exits — so it never bottlenecks, and check <strong>sightlines</strong> from every seat/standing spot to the stage or screen before confirming the layout.</p>
<pre><code>Venue site-inspection checklist:
[ ] Capacity matches guest count (not over, not empty-looking)
[ ] Power load & rigging points sufficient for AV/lighting plan
[ ] Loading dock / load-in path measured for largest item
[ ] Sightlines checked from back row and side seats
[ ] Accessible entrance, restrooms, parking confirmed
[ ] Backup power / Wi-Fi confirmed
</code></pre>
<div class="callout"><span class="badge">Walk it, don't just picture it</span> A floor plan on paper hides real obstacles — pillars blocking sightlines, a loading dock too narrow for a stage truss. Always do an in-person site inspection before signing.</div>`,
    `<span class="eyebrow">EEP201 · Chương 4 · Bài 4.1</span>
<h2>Chọn địa điểm &amp; thiết kế không gian</h2>
<h3>Tiêu chí chọn địa điểm (Shone &amp; Parry)</h3>
<ul>
<li><strong>Sức chứa</strong> — vừa với số khách, không trống trải hay chật chội.</li>
<li><strong>Vị trí &amp; khả năng tiếp cận</strong> — thời gian di chuyển, chỗ đậu xe, khả năng tiếp cận cho khách khuyết tật.</li>
<li><strong>Chi phí</strong> — phí thuê cộng chi phí ẩn (an ninh, vệ sinh, tăng ca, phí mở chai).</li>
<li><strong>Năng lực kỹ thuật</strong> — tải điện, điểm treo (rigging), Wi-Fi, AV, cửa nhận hàng.</li>
</ul>
<h3>Thiết kế không gian &amp; kiểu bố cục</h3>
<p>Chọn sơ đồ mặt bằng khớp với chương trình: <strong>theatre</strong> (ghế xếp hàng hướng sân khấu — hợp cho thuyết trình), <strong>banquet</strong> (bàn tròn — hợp cho ăn tối và networking), <strong>classroom</strong> (bàn + ghế hướng lên — hợp cho workshop), <strong>cocktail</strong> (đứng, không ghế cố định — hợp cho giao lưu).</p>
<h3>Luồng di chuyển &amp; sightline</h3>
<p>Thiết kế <strong>luồng di chuyển</strong> của khách — cổng vào → đăng ký → khu chính → lối ra — để không bao giờ nghẽn, và kiểm <strong>sightline</strong> (tầm nhìn) từ mọi vị trí ngồi/đứng tới sân khấu hoặc màn hình trước khi chốt bố cục.</p>
<pre><code>Checklist khảo sát địa điểm (site inspection):
[ ] Sức chứa khớp số khách (không quá tải, không trống trải)
[ ] Tải điện & điểm treo đủ cho kế hoạch AV/ánh sáng
[ ] Đường load-in / cửa nhận hàng đã đo cho vật lớn nhất
[ ] Đã kiểm sightline từ hàng cuối & ghế cạnh
[ ] Đã xác nhận lối vào, nhà vệ sinh, chỗ đậu xe tiếp cận được
[ ] Đã xác nhận nguồn điện dự phòng / Wi-Fi
</code></pre>
<div class="callout"><span class="badge">Đi thực tế, không chỉ nhìn hình</span> Sơ đồ mặt bằng trên giấy giấu đi trở ngại thật — cột chắn sightline, cửa nhận hàng quá hẹp cho khung sân khấu. Luôn khảo sát trực tiếp trước khi ký hợp đồng.</div>`,
  ]]);

const c4q = quiz('eep201-quiz-4', 'Quiz 4 — Venue & space design|||Quiz 4 — Địa điểm & thiết kế không gian', [
  { id: 'q1', question: 'Kiểu bố cục nào phù hợp nhất cho một buổi thuyết trình lớn có sân khấu?', options: ['Cocktail', 'Theatre', 'Banquet', 'Classroom'], correctIndex: 1, explanation: 'Theatre xếp ghế hàng hướng sân khấu, hợp cho thuyết trình đông người.' },
  { id: 'q2', question: 'Vì sao phải kiểm "sightline" trước khi chốt bố cục?', options: ['Để tính chi phí thuê', 'Để đảm bảo mọi vị trí ngồi/đứng đều nhìn được sân khấu/màn hình', 'Để tính sức chứa', 'Để đặt catering'], correctIndex: 1, explanation: 'Sightline kém (cột chắn, góc khuất) làm khách không xem được chương trình dù bố cục trông hợp lý trên giấy.' },
  { id: 'q3', question: 'Theo bài học, vì sao nên khảo sát địa điểm trực tiếp thay vì chỉ xem sơ đồ?', options: ['Vì luật yêu cầu', 'Vì sơ đồ giấy có thể giấu trở ngại thật như cột chắn hay cửa nhận hàng quá hẹp', 'Để giảm chi phí thuê', 'Để chọn chủ đề'], correctIndex: 1, explanation: 'Site inspection phát hiện trở ngại vật lý mà bản vẽ không thể hiện được.' },
]);

const c5 = doc('eep201-5-1-program-talent', '5.1 — Program, content & performers/speakers|||5.1 — Chương trình, nội dung & nghệ sĩ/diễn giả',
  'Thiết kế agenda & pacing; đặt nghệ sĩ/diễn giả (hợp đồng, rider, tổng duyệt); nội dung — kịch bản, MC, yêu cầu AV.',
  [[
    `<span class="eyebrow">EEP201 · Chapter 5 · Lesson 5.1</span>
<h2>Program, content &amp; performers/speakers</h2>
<h3>Designing the program</h3>
<p>The <strong>program</strong> is the agenda — what happens, in what order, for how long. Good <strong>pacing</strong> alternates high-energy segments (performance, keynote) with lower-energy ones (breaks, networking) so attention doesn't collapse; a program packed wall-to-wall with content, with no breathing room, is a common planning mistake.</p>
<h3>Booking performers &amp; speakers</h3>
<p>Every booking needs a <strong>contract</strong> (fee, cancellation terms), a <strong>rider</strong> (technical &amp; hospitality requirements — stage size, sound gear, green room needs), and a scheduled <strong>rehearsal</strong> slot on the production schedule. A rider ignored on event day is the most common cause of a talent-related crisis.</p>
<h3>Content &amp; the MC</h3>
<p>A written <strong>script</strong> (or run-of-show for the host/MC) keeps transitions smooth between segments — introducing speakers, filling gaps, and keeping the program on time. AV requirements (microphones, screens, lighting cues) belong on the same document as the script, not in a separate file no one checks.</p>
<pre><code>Program agenda example (2-hour segment):
 18:00-18:10  Welcome & MC opening        (low energy)
 18:10-18:40  Keynote speaker             (high energy)
 18:40-18:55  Networking break            (low energy)
 18:55-19:35  Live performance             (high energy)
 19:35-19:45  Closing remarks & thank-you  (low energy)
</code></pre>
<div class="callout"><span class="badge">Rider = contract, not a wish list</span> Treat every technical and hospitality rider as binding — the performer's team built their whole show around those requirements being met.</div>`,
    `<span class="eyebrow">EEP201 · Chương 5 · Bài 5.1</span>
<h2>Chương trình, nội dung &amp; nghệ sĩ/diễn giả</h2>
<h3>Thiết kế chương trình</h3>
<p><strong>Chương trình</strong> là agenda — điều gì diễn ra, theo thứ tự nào, kéo dài bao lâu. <strong>Pacing</strong> tốt xen kẽ các đoạn năng lượng cao (biểu diễn, keynote) với đoạn năng lượng thấp (nghỉ, giao lưu) để sự chú ý không tuột dốc; một chương trình dồn kín nội dung, không có chỗ thở, là lỗi lập kế hoạch phổ biến.</p>
<h3>Đặt nghệ sĩ &amp; diễn giả</h3>
<p>Mỗi lần đặt cần một <strong>hợp đồng</strong> (phí, điều khoản huỷ), một <strong>rider</strong> (yêu cầu kỹ thuật &amp; hậu cần — kích thước sân khấu, thiết bị âm thanh, nhu cầu phòng chờ), và một khung <strong>tổng duyệt</strong> đã ghi trong production schedule. Một rider bị bỏ qua vào ngày sự kiện là nguyên nhân phổ biến nhất gây khủng hoảng liên quan tới nghệ sĩ.</p>
<h3>Nội dung &amp; MC</h3>
<p>Một <strong>kịch bản</strong> viết sẵn (hay run-of-show cho MC) giữ các đoạn chuyển mượt mà — giới thiệu diễn giả, lấp khoảng trống, giữ chương trình đúng giờ. Yêu cầu AV (micro, màn hình, cue ánh sáng) phải nằm cùng tài liệu với kịch bản, không phải một file riêng không ai kiểm.</p>
<pre><code>Ví dụ agenda chương trình (đoạn 2 giờ):
 18:00-18:10  Chào mừng & MC mở đầu       (năng lượng thấp)
 18:10-18:40  Diễn giả keynote             (năng lượng cao)
 18:40-18:55  Nghỉ giao lưu                (năng lượng thấp)
 18:55-19:35  Biểu diễn trực tiếp          (năng lượng cao)
 19:35-19:45  Lời kết & cảm ơn             (năng lượng thấp)
</code></pre>
<div class="callout"><span class="badge">Rider = hợp đồng, không phải danh sách mong muốn</span> Xem mọi rider kỹ thuật và hậu cần như điều khoản ràng buộc — đội của nghệ sĩ dựng cả buổi diễn dựa trên việc những yêu cầu đó được đáp ứng.</div>`,
  ]]);

const c5q = quiz('eep201-quiz-5', 'Quiz 5 — Program & talent|||Quiz 5 — Chương trình & nghệ sĩ', [
  { id: 'q1', question: '"Pacing" tốt trong thiết kế chương trình nghĩa là gì?', options: ['Dồn tất cả nội dung liên tục không nghỉ', 'Xen kẽ đoạn năng lượng cao & thấp để giữ sự chú ý', 'Chỉ có một diễn giả duy nhất', 'Kéo dài chương trình càng lâu càng tốt'], correctIndex: 1, explanation: 'Pacing tốt luân chuyển giữa cao/thấp năng lượng, tránh chương trình dồn kín gây mệt.' },
  { id: 'q2', question: '"Rider" khi đặt nghệ sĩ/diễn giả là gì?', options: ['Hoá đơn thanh toán', 'Yêu cầu kỹ thuật & hậu cần đi kèm hợp đồng', 'Kịch bản của MC', 'Sơ đồ mặt bằng địa điểm'], correctIndex: 1, explanation: 'Rider ghi yêu cầu kỹ thuật (âm thanh, sân khấu) & hậu cần (phòng chờ) — cần được đáp ứng như hợp đồng.' },
  { id: 'q3', question: 'Theo bài học, nguyên nhân phổ biến nhất gây khủng hoảng liên quan nghệ sĩ là?', options: ['Chọn nhạc sai gu', 'Rider bị bỏ qua vào ngày sự kiện', 'Kịch bản MC quá dài', 'Chương trình bắt đầu sớm'], correctIndex: 1, explanation: 'Bỏ qua yêu cầu trong rider khiến đội nghệ sĩ không có điều kiện đã cam kết để biểu diễn.' },
]);

const c6 = doc('eep201-6-1-vendor-logistics', '6.1 — Vendor management & logistics|||6.1 — Quản lý nhà cung cấp & hậu cần',
  'Chọn nhà cung cấp (RFP, hợp đồng, lịch thanh toán); hậu cần load-in/load-out; giấy phép & chuỗi cung ứng.',
  [[
    `<span class="eyebrow">EEP201 · Chapter 6 · Lesson 6.1</span>
<h2>Vendor management &amp; logistics</h2>
<h3>Selecting &amp; contracting vendors</h3>
<p>For each vendor category (catering, AV, decor, transport), send an <strong>RFP</strong> (request for proposal) to 2-3 suppliers, compare on price, reliability and past references — not price alone — then lock terms in a <strong>contract</strong> with a clear <strong>payment schedule</strong> (deposit, milestone payments, final balance).</p>
<h3>Logistics: load-in &amp; load-out</h3>
<p><strong>Load-in</strong> is everything arriving and being set up before doors open — staging, AV, decor, catering equipment — in the right <strong>sequence</strong> (structural items before decorative ones, decor before final AV checks). <strong>Load-out</strong> is the reverse, right after the event ends, and needs its own schedule so the venue isn't held past its rental window.</p>
<h3>Permits &amp; supply chain</h3>
<p>Confirm required <strong>permits</strong> early (noise, alcohol service, temporary structures, fire marshal sign-off) — these often have long lead times. Track the <strong>supply chain</strong> for anything custom-made (staging, signage) so a production delay upstream doesn't surface as a surprise two days before the event.</p>
<pre><code>Load-in sequence example:
1. Staging & structural rigging
2. Power & AV cabling
3. Furniture & decor
4. Catering equipment & final AV checks
5. Final walkthrough before doors open
</code></pre>
<div class="callout"><span class="badge">Never book on price alone</span> The cheapest vendor who no-shows costs far more than the reliable one who charges 10% more — check references, not just quotes.</div>`,
    `<span class="eyebrow">EEP201 · Chương 6 · Bài 6.1</span>
<h2>Quản lý nhà cung cấp &amp; hậu cần</h2>
<h3>Chọn &amp; ký hợp đồng nhà cung cấp</h3>
<p>Với mỗi nhóm nhà cung cấp (catering, AV, décor, vận chuyển), gửi <strong>RFP</strong> (yêu cầu đề xuất) cho 2-3 đơn vị, so sánh theo giá, độ tin cậy và tham chiếu cũ — không chỉ theo giá — rồi chốt điều khoản trong <strong>hợp đồng</strong> kèm <strong>lịch thanh toán</strong> rõ ràng (đặt cọc, thanh toán theo milestone, số dư cuối).</p>
<h3>Hậu cần: load-in &amp; load-out</h3>
<p><strong>Load-in</strong> là mọi thứ được mang tới và dựng lên trước khi mở cửa — sân khấu, AV, décor, thiết bị catering — theo đúng <strong>thứ tự</strong> (kết cấu trước, trang trí sau, décor trước kiểm AV cuối cùng). <strong>Load-out</strong> là chiều ngược lại, ngay sau khi sự kiện kết thúc, và cần lịch riêng để không giữ địa điểm quá khung giờ thuê.</p>
<h3>Giấy phép &amp; chuỗi cung ứng</h3>
<p>Xác nhận <strong>giấy phép</strong> cần thiết sớm (tiếng ồn, phục vụ rượu, kết cấu tạm, xác nhận phòng cháy chữa cháy) — những thứ này thường có thời gian xử lý dài. Theo dõi <strong>chuỗi cung ứng</strong> cho bất cứ thứ gì làm theo yêu cầu (sân khấu, biển hiệu) để một trễ sản xuất ở khâu trên không lộ ra bất ngờ hai ngày trước sự kiện.</p>
<pre><code>Ví dụ thứ tự load-in:
1. Sân khấu & rigging kết cấu
2. Dây điện & AV
3. Nội thất & décor
4. Thiết bị catering & kiểm AV cuối
5. Đi vòng kiểm tra lần cuối trước khi mở cửa
</code></pre>
<div class="callout"><span class="badge">Đừng chọn chỉ vì giá</span> Nhà cung cấp rẻ nhất mà bỏ show tốn kém hơn nhiều so với đơn vị đáng tin cậy tính thêm 10% — kiểm tham chiếu, không chỉ nhìn báo giá.</div>`,
  ]]);

const c6q = quiz('eep201-quiz-6', 'Quiz 6 — Vendors & logistics|||Quiz 6 — Nhà cung cấp & hậu cần', [
  { id: 'q1', question: '"RFP" khi chọn nhà cung cấp là gì?', options: ['Hợp đồng cuối cùng', 'Yêu cầu đề xuất gửi cho vài đơn vị để so sánh', 'Giấy phép tổ chức sự kiện', 'Sơ đồ load-in'], correctIndex: 1, explanation: 'RFP (request for proposal) gửi tới 2-3 nhà cung cấp để so sánh trước khi chốt hợp đồng.' },
  { id: 'q2', question: 'Trong load-in, thứ tự nào đúng?', options: ['Décor trước, sân khấu sau', 'Sân khấu/kết cấu trước, décor & AV cuối sau', 'AV cuối trước, sân khấu sau', 'Không cần thứ tự cụ thể'], correctIndex: 1, explanation: 'Kết cấu (sân khấu, rigging) phải xong trước; décor và kiểm AV cuối diễn ra sau.' },
  { id: 'q3', question: 'Theo bài học, vì sao không nên chọn nhà cung cấp chỉ dựa vào giá thấp nhất?', options: ['Vì luật cấm', 'Vì nhà cung cấp rẻ mà bỏ show tốn kém hơn nhà cung cấp đáng tin cậy', 'Vì giá thấp luôn đi kèm chất lượng thấp', 'Vì RFP chỉ chấp nhận giá cao'], correctIndex: 1, explanation: 'Rủi ro bỏ show/không đạt của nhà cung cấp rẻ có thể tốn kém hơn phần chênh giá.' },
]);

const c7 = doc('eep201-7-1-risk-contingency-safety', '7.1 — Contingency, safety & risk management|||7.1 — Kế hoạch dự phòng, an toàn & quản trị rủi ro',
  'Khung quản trị rủi ro (nhận diện → đánh giá → giảm nhẹ → theo dõi); kế hoạch dự phòng; an toàn — kiểm soát đám đông, lối thoát, bảo hiểm.',
  [[
    `<span class="eyebrow">EEP201 · Chapter 7 · Lesson 7.1</span>
<h2>Contingency, safety &amp; risk management</h2>
<h3>The risk management framework (Bowdin)</h3>
<p>Four steps, repeated through planning: <strong>identify</strong> risks (weather, no-show vendor/talent, technical failure, medical emergency), <strong>assess</strong> likelihood and impact, <strong>mitigate</strong> (reduce likelihood or impact — backup vendor, weatherproof tenting), and <strong>monitor</strong> continuously as plans change.</p>
<h3>Contingency plans</h3>
<p>For every high-impact risk, write the <strong>specific</strong> backup plan — not "we'll figure it out." Weather → an indoor backup venue or tent, confirmed in advance. Technical failure → a backup microphone and a technician on standby. No-show talent → a substitute act or MC-led filler segment ready to go.</p>
<h3>Safety</h3>
<p><strong>Crowd management</strong> (capacity limits, controlled entry points), clearly marked <strong>emergency exits</strong>, a staffed <strong>first-aid</strong> point, and event <strong>insurance</strong> (liability, cancellation) are non-negotiable baseline requirements, regardless of event size.</p>
<pre><code>Risk management cycle:
 Identify  -> what could go wrong? (weather, no-show, tech, medical)
 Assess    -> how likely, how bad if it happens?
 Mitigate  -> backup venue/vendor/talent, insurance
 Monitor   -> re-check as event day approaches
</code></pre>
<div class="callout"><span class="badge">A plan without a backup isn't a plan</span> If a risk is rated high-impact, it needs a written, specific contingency — a vague "we'll adapt" is not a mitigation.</div>`,
    `<span class="eyebrow">EEP201 · Chương 7 · Bài 7.1</span>
<h2>Kế hoạch dự phòng, an toàn &amp; quản trị rủi ro</h2>
<h3>Khung quản trị rủi ro (Bowdin)</h3>
<p>Bốn bước, lặp lại suốt quá trình lập kế hoạch: <strong>nhận diện</strong> rủi ro (thời tiết, nhà cung cấp/nghệ sĩ bỏ show, hỏng kỹ thuật, cấp cứu y tế), <strong>đánh giá</strong> khả năng xảy ra và mức ảnh hưởng, <strong>giảm nhẹ</strong> (giảm khả năng hoặc ảnh hưởng — nhà cung cấp dự phòng, lều chống thời tiết), và <strong>theo dõi</strong> liên tục khi kế hoạch thay đổi.</p>
<h3>Kế hoạch dự phòng</h3>
<p>Với mỗi rủi ro ảnh hưởng lớn, viết kế hoạch dự phòng <strong>cụ thể</strong> — không phải "tới đâu tính đó". Thời tiết → địa điểm trong nhà hoặc lều dự phòng, đã xác nhận trước. Hỏng kỹ thuật → micro dự phòng và kỹ thuật viên trực sẵn. Nghệ sĩ bỏ show → tiết mục thay thế hoặc đoạn lấp do MC dẫn, sẵn sàng dùng ngay.</p>
<h3>An toàn</h3>
<p><strong>Kiểm soát đám đông</strong> (giới hạn sức chứa, kiểm soát điểm vào), <strong>lối thoát khẩn cấp</strong> đánh dấu rõ, một điểm <strong>cấp cứu</strong> có người trực, và <strong>bảo hiểm</strong> sự kiện (trách nhiệm, huỷ sự kiện) là yêu cầu nền tảng không thể thương lượng, bất kể quy mô sự kiện.</p>
<pre><code>Vòng quản trị rủi ro:
 Nhận diện -> điều gì có thể sai? (thời tiết, bỏ show, kỹ thuật, y tế)
 Đánh giá  -> khả năng xảy ra, mức ảnh hưởng nếu xảy ra?
 Giảm nhẹ  -> địa điểm/nhà cung cấp/nghệ sĩ dự phòng, bảo hiểm
 Theo dõi  -> kiểm lại khi ngày sự kiện gần tới
</code></pre>
<div class="callout"><span class="badge">Kế hoạch không có dự phòng thì không phải kế hoạch</span> Nếu một rủi ro được đánh giá ảnh hưởng lớn, nó cần một kế hoạch dự phòng cụ thể, viết ra — "tới đâu tính đó" không phải là giảm nhẹ rủi ro.</div>`,
  ]]);

const c7q = quiz('eep201-quiz-7', 'Quiz 7 — Risk & contingency|||Quiz 7 — Rủi ro & dự phòng', [
  { id: 'q1', question: 'Bốn bước của khung quản trị rủi ro (Bowdin) theo đúng thứ tự là?', options: ['Giảm nhẹ → Nhận diện → Theo dõi → Đánh giá', 'Nhận diện → Đánh giá → Giảm nhẹ → Theo dõi', 'Theo dõi → Giảm nhẹ → Nhận diện → Đánh giá', 'Đánh giá → Nhận diện → Theo dõi → Giảm nhẹ'], correctIndex: 1, explanation: 'Chu trình: nhận diện rủi ro → đánh giá khả năng/ảnh hưởng → giảm nhẹ → theo dõi liên tục.' },
  { id: 'q2', question: 'Theo bài học, một kế hoạch dự phòng tốt cho rủi ro thời tiết là gì?', options: ['"Tới đâu tính đó"', 'Địa điểm trong nhà hoặc lều dự phòng đã xác nhận trước', 'Huỷ sự kiện ngay khi có mây', 'Không cần kế hoạch vì thời tiết không kiểm soát được'], correctIndex: 1, explanation: 'Dự phòng phải cụ thể và xác nhận TRƯỚC, không phải phản ứng tại chỗ.' },
  { id: 'q3', question: 'Yêu cầu nền tảng về an toàn nào KHÔNG thể thương lượng bất kể quy mô sự kiện?', options: ['Chủ đề trang trí', 'Lối thoát khẩn cấp đánh dấu rõ & bảo hiểm sự kiện', 'Số lượng nghệ sĩ', 'Loại nhạc phát trong tiệc'], correctIndex: 1, explanation: 'Kiểm soát đám đông, lối thoát khẩn cấp, cấp cứu và bảo hiểm là baseline an toàn cho mọi sự kiện.' },
]);

const c8 = doc('eep201-8-1-run-sheet-evaluation', '8.1 — Day-of run sheet, coordination & post-event evaluation|||8.1 — Run sheet ngày sự kiện, điều phối & đánh giá sau sự kiện',
  'Run sheet chi tiết theo phút; vai trò & điều phối tại chỗ; đánh giá sau sự kiện (KPI, khảo sát, bài học) — Shone & Parry.',
  [[
    `<span class="eyebrow">EEP201 · Chapter 8 · Lesson 8.1</span>
<h2>Day-of run sheet, coordination &amp; post-event evaluation</h2>
<h3>The run sheet</h3>
<p>The <strong>run sheet</strong> is the minute-by-minute schedule for event day — every cue, every owner, down to a few minutes' resolution. Unlike the production schedule (weeks/months out), the run sheet covers only the hours of the event itself.</p>
<h3>On-site coordination</h3>
<p>Assign clear <strong>roles</strong> (stage manager, registration lead, vendor liaison), keep everyone on <strong>radios</strong> or a group channel, and run everything through a single <strong>command post</strong> so decisions during the event aren't made by five people independently.</p>
<h3>Post-event evaluation (Shone &amp; Parry)</h3>
<p>Within days of the event: hold a team <strong>debrief</strong>, measure results against the original <strong>KPIs</strong> set in the objectives stage, collect attendee <strong>feedback surveys</strong>, and calculate <strong>ROI</strong> where relevant. Write down <strong>lessons learned</strong> — this is what makes the next event's planning faster and safer.</p>
<pre><code>Run sheet excerpt (event day):
 07:00  Load-in complete, AV check           Stage manager
 09:00  Vendors on-site, final walkthrough    Vendor liaison
 10:00  Doors open, registration live         Registration lead
 10:30  Welcome & keynote begins              MC / Producer
 12:00  Program ends, load-out begins         Stage manager
</code></pre>
<div class="callout"><span class="badge">Close the loop</span> An event isn't "done" when the doors close — it's done when the debrief happens, the KPIs are measured against the objectives, and the lessons are written down for next time.</div>`,
    `<span class="eyebrow">EEP201 · Chương 8 · Bài 8.1</span>
<h2>Run sheet ngày sự kiện, điều phối &amp; đánh giá sau sự kiện</h2>
<h3>Run sheet</h3>
<p><strong>Run sheet</strong> là lịch trình chi tiết theo phút cho ngày sự kiện — mọi cue, mọi người chịu trách nhiệm, chính xác tới vài phút. Khác với production schedule (theo tuần/tháng), run sheet chỉ bao trùm những giờ diễn ra sự kiện.</p>
<h3>Điều phối tại chỗ</h3>
<p>Phân <strong>vai trò</strong> rõ ràng (stage manager, phụ trách đăng ký, đầu mối nhà cung cấp), giữ mọi người trên <strong>bộ đàm</strong> hoặc kênh chung, và đưa mọi quyết định qua một <strong>command post</strong> duy nhất để không có năm người tự quyết định độc lập trong lúc sự kiện diễn ra.</p>
<h3>Đánh giá sau sự kiện (Shone &amp; Parry)</h3>
<p>Trong vài ngày sau sự kiện: tổ chức <strong>debrief</strong> với cả đội, đo kết quả so với <strong>KPI</strong> đã đặt ở giai đoạn mục tiêu, thu thập <strong>khảo sát phản hồi</strong> từ người tham dự, và tính <strong>ROI</strong> nếu liên quan. Ghi lại <strong>bài học rút ra</strong> — đây là thứ giúp lần lập kế hoạch tiếp theo nhanh và an toàn hơn.</p>
<pre><code>Trích run sheet (ngày sự kiện):
 07:00  Load-in xong, kiểm AV                 Stage manager
 09:00  Nhà cung cấp có mặt, đi vòng cuối      Đầu mối nhà cung cấp
 10:00  Mở cửa, đăng ký bắt đầu                Phụ trách đăng ký
 10:30  Chào mừng & keynote bắt đầu            MC / Producer
 12:00  Chương trình kết thúc, load-out        Stage manager
</code></pre>
<div class="callout"><span class="badge">Khép vòng đầy đủ</span> Một sự kiện chưa "xong" khi đóng cửa — nó xong khi buổi debrief diễn ra, KPI được đo lại so với mục tiêu, và bài học được ghi lại cho lần sau.</div>`,
  ]]);

const c8q = quiz('eep201-quiz-8', 'Quiz 8 — Run sheet & evaluation|||Quiz 8 — Run sheet & đánh giá', [
  { id: 'q1', question: 'Khác biệt chính giữa "production schedule" và "run sheet" là gì?', options: ['Không khác nhau', 'Production schedule tính theo tuần/tháng; run sheet tính theo phút trong ngày sự kiện', 'Run sheet chỉ dùng cho sự kiện ngoài trời', 'Production schedule chỉ dùng cho nhà cung cấp'], correctIndex: 1, explanation: 'Production schedule là lịch trình dài hơi trước sự kiện; run sheet là lịch chi tiết theo phút chỉ trong ngày sự kiện.' },
  { id: 'q2', question: 'Vì sao nên có một "command post" duy nhất khi điều phối tại chỗ?', options: ['Để tiết kiệm bộ đàm', 'Để tránh nhiều người tự ra quyết định độc lập trong lúc sự kiện diễn ra', 'Vì quy định phòng cháy chữa cháy', 'Để chọn nhạc'], correctIndex: 1, explanation: 'Một đầu mối quyết định giữ sự phối hợp nhất quán, tránh xung đột quyết định giữa các vai trò.' },
  { id: 'q3', question: 'Theo Shone & Parry, một sự kiện được xem là "xong" khi nào?', options: ['Ngay khi khách ra về', 'Khi load-out hoàn tất', 'Khi debrief diễn ra, KPI được đo lại và bài học được ghi lại', 'Khi thanh toán cuối cho nhà cung cấp xong'], correctIndex: 2, explanation: 'Đánh giá sau sự kiện (debrief, đo KPI, ghi bài học) là bước khép vòng đầy đủ của vòng đời sự kiện.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'EEP201',
    slug: 'eep201-entertainment-planning',
    title: 'Entertainment Planning',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EEP201.webp',
    shortDescription: 'The event-planning lifecycle — concept & objectives, production schedule, venue & space design, program & talent, vendors & logistics, risk & contingency, day-of run sheet & post-event evaluation. Bilingual, with checklists & quizzes.|||Vòng đời lập kế hoạch sự kiện — concept & mục tiêu, production schedule, địa điểm & thiết kế không gian, chương trình & nghệ sĩ, nhà cung cấp & hậu cần, rủi ro & dự phòng, run sheet & đánh giá sau sự kiện. Song ngữ, có checklist & quiz.',
    description: 'Môn <strong>EEP201 — Entertainment Planning</strong> (kỳ 3, khối Quản trị Kinh doanh) dạy toàn bộ vòng đời lập kế hoạch sự kiện/giải trí: <strong>concept &amp; mục tiêu</strong> (SMART, đối tượng, chủ đề) → <strong>timeline</strong> (production schedule, reverse-timeline, đường tới hạn) → <strong>địa điểm &amp; thiết kế không gian</strong> (tiêu chí chọn, bố cục, sightline) → <strong>chương trình &amp; nghệ sĩ/diễn giả</strong> (agenda, pacing, rider) → <strong>nhà cung cấp &amp; hậu cần</strong> (RFP, load-in/load-out) → <strong>rủi ro &amp; dự phòng</strong> (khung quản trị rủi ro, an toàn) → <strong>run sheet ngày sự kiện &amp; đánh giá sau sự kiện</strong>. Trích dẫn Judy Allen "Event Planning", Bowdin "Events Management", Shone &amp; Parry "Successful Event Management". Song ngữ, có checklist, ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Quy trình lập kế hoạch sự kiện 8 bước; phát triển concept; mục tiêu SMART & phân tích đối tượng; chọn chủ đề gắn mục tiêu; reverse-timeline & production schedule; đường tới hạn & milestone; tiêu chí chọn địa điểm & kiểu bố cục (theatre/banquet/classroom/cocktail); luồng di chuyển & sightline; thiết kế agenda & pacing; hợp đồng/rider nghệ sĩ & diễn giả; RFP & quản lý nhà cung cấp; load-in/load-out & giấy phép; khung quản trị rủi ro (nhận diện/đánh giá/giảm nhẹ/theo dõi); kế hoạch dự phòng & an toàn; run sheet & điều phối tại chỗ; đánh giá sau sự kiện (KPI, khảo sát, bài học).',
    requirements: 'Không yêu cầu kiến thức nền đặc biệt. Nên đọc trước giáo trình chính thức trên FLM (flm.fpt.edu.vn) để bám sát chuẩn đầu ra của môn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách kinh điển, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vòng đời lập kế hoạch sự kiện, các loại sự kiện.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & concept|||Chapter 1 — Overview & concept', description: 'Quy trình 8 bước, phát triển concept.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mục tiêu, đối tượng & chủ đề|||Chapter 2 — Objectives, audience & theme', description: 'SMART, phân tích đối tượng, chọn chủ đề.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Timeline & production schedule|||Chapter 3 — Timeline & production schedule', description: 'Reverse-timeline, đường tới hạn, milestone.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Địa điểm & thiết kế không gian|||Chapter 4 — Venue & space design', description: 'Tiêu chí chọn, bố cục, sightline, site inspection.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chương trình & nghệ sĩ/diễn giả|||Chapter 5 — Program & talent', description: 'Agenda, pacing, hợp đồng & rider.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nhà cung cấp & hậu cần|||Chapter 6 — Vendors & logistics', description: 'RFP, hợp đồng, load-in/load-out, giấy phép.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Rủi ro, dự phòng & an toàn|||Chapter 7 — Risk, contingency & safety', description: 'Khung quản trị rủi ro, kế hoạch dự phòng, an toàn.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Run sheet & đánh giá sau sự kiện|||Chapter 8 — Run sheet & post-event evaluation', description: 'Run sheet, điều phối, KPI, bài học.', lessons: [c8, c8q] },
  ],
};
