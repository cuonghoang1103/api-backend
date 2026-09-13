/**
 * EVN205 — Event Management For PR (Quản trị sự kiện cho Quan hệ công chúng).
 * Khối Công nghệ Truyền thông FPTU, Kỳ 7. Song ngữ VI+EN + checklist + ca thật.
 * Sách chuẩn: Goldblatt "Special Events"; Bowdin et al "Events Management";
 * Allen "Event Planning"; Getz "Event Studies"; ISO 20121 (sự kiện bền vững).
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('evn205-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Goldblatt, Bowdin, Allen, Getz), ISO 20121, tổ chức nghề, kênh học, lộ trình tự học.',
  [[
    `<span class="eyebrow">EVN205 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Event Management for PR</strong> — from event strategy and planning through budgets, logistics, production, media relations, risk and evaluation — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for EVN205 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Joe Goldblatt — <em>Special Events: Creating and Sustaining a New World for Celebration</em> (the classic event-management text).</li>
<li>Bowdin, Allen, O'Toole, Harris &amp; McDonnell — <em>Events Management</em> (the university standard, full event lifecycle).</li>
<li>Judy Allen — <em>Event Planning</em> (practical checklists, budgets, logistics, contracts).</li>
<li>Donald Getz — <em>Event Studies</em> (theory, event tourism, portfolio thinking).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.iso.org/standard/86389.html" target="_blank" rel="noopener">ISO 20121 — Sustainable event management systems</a></li>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA — Public Relations Society of America (resources &amp; ethics)</a></li>
<li><a href="https://www.eventmanagerblog.com/" target="_blank" rel="noopener">Skift Meetings (Event Manager Blog) — guides &amp; templates</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — invitations, run-of-show &amp; stage graphics.</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello / Notion</a> — task boards, timelines &amp; vendor tracking.</li>
<li><a href="https://sheets.google.com/" target="_blank" rel="noopener">Google Sheets</a> — budgets, guest lists &amp; RSVP tracking.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what a PR event is, event types and how they serve communication goals.</li>
<li><strong>Plan on paper</strong> — write a concept, SMART objectives, budget and timeline for a real (or imagined) launch.</li>
<li><strong>Go deeper</strong> — logistics, run of show, media &amp; KOL invites, risk assessment.</li>
<li><strong>Job-ready</strong> — run a small event, then measure PR value, ROI and sustainability.</li>
</ol></div>`,
    `<span class="eyebrow">EVN205 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quản trị sự kiện cho PR</strong> — từ chiến lược &amp; hoạch định qua ngân sách, logistics, sản xuất, quan hệ báo chí, rủi ro tới đánh giá — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của EVN205 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Joe Goldblatt — <em>Special Events</em> (sách kinh điển của ngành sự kiện).</li>
<li>Bowdin, Allen, O'Toole, Harris &amp; McDonnell — <em>Events Management</em> (chuẩn đại học, trọn vòng đời sự kiện).</li>
<li>Judy Allen — <em>Event Planning</em> (checklist, ngân sách, logistics, hợp đồng thực chiến).</li>
<li>Donald Getz — <em>Event Studies</em> (lý thuyết, du lịch sự kiện, tư duy danh mục).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.iso.org/standard/86389.html" target="_blank" rel="noopener">ISO 20121 — Hệ thống quản lý sự kiện bền vững</a></li>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA — Hiệp hội PR Hoa Kỳ (tài nguyên &amp; đạo đức nghề)</a></li>
<li><a href="https://www.eventmanagerblog.com/" target="_blank" rel="noopener">Skift Meetings — hướng dẫn &amp; mẫu biểu</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — thiệp mời, kịch bản &amp; đồ hoạ sân khấu.</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello / Notion</a> — bảng việc, timeline &amp; theo dõi nhà cung cấp.</li>
<li><a href="https://sheets.google.com/" target="_blank" rel="noopener">Google Sheets</a> — ngân sách, danh sách khách &amp; theo dõi RSVP.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — sự kiện PR là gì, các loại sự kiện và cách chúng phục vụ mục tiêu truyền thông.</li>
<li><strong>Lập trên giấy</strong> — viết concept, mục tiêu SMART, ngân sách và timeline cho một lễ ra mắt thật (hoặc giả định).</li>
<li><strong>Đào sâu</strong> — logistics, kịch bản, mời báo chí &amp; KOL, đánh giá rủi ro.</li>
<li><strong>Sẵn sàng đi làm</strong> — chạy một sự kiện nhỏ, rồi đo giá trị PR, ROI và tính bền vững.</li>
</ol></div>`,
  ]]);

const intro = doc('evn205-0-1-overview', 'Course overview: Event Management for PR|||Tổng quan: Quản trị sự kiện cho PR',
  'Sự kiện là công cụ PR đắt giá: tạo trải nghiệm trực tiếp, tin bài, và quan hệ với công chúng. Lộ trình 4 bước: hoạch định → chuẩn bị → thực thi → đánh giá.',
  [[
    `<span class="eyebrow">EVN205 · Lesson 0.1 · Overview</span>
<h2>Event Management for PR</h2>
<p class="lead">A <strong>PR event</strong> is a planned, face-to-face experience a brand or organisation creates to build relationships, shape reputation and earn media coverage. Unlike an ad, an event lets your public <em>touch</em> the brand — and gives journalists, KOLs and customers a story to retell.</p>
<h3>Why events matter to PR</h3>
<ul>
<li><strong>Direct experience</strong> — people remember what they feel, not what they're told.</li>
<li><strong>Earned media</strong> — a well-run launch or festival generates press articles and social content the brand didn't pay for.</li>
<li><strong>Relationships</strong> — events bring press, partners, KOLs and community together in one room.</li>
</ul>
<h3>The four-step roadmap</h3>
<pre><code>1. PLAN     -> concept, objectives (SMART), audience, theme, timeline
2. PREPARE  -> budget, sponsors, vendors, venue, logistics, program
3. EXECUTE  -> media invites, run of show, on-site management on the day
4. EVALUATE -> measure PR value / ROI, wrap-up report, sustainability
</code></pre>
<p>This course follows that arc across eight chapters, grounded in Goldblatt, Bowdin, Allen and Getz, and closes with ISO 20121 sustainable-event thinking.</p>
<div class="callout"><span class="badge">The core idea</span> An event is not a party — it is a <strong>communication tool with a goal</strong>. Every decision, from the venue to the MC script, should serve the PR objective.</div>`,
    `<span class="eyebrow">EVN205 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị sự kiện cho PR</h2>
<p class="lead">Một <strong>sự kiện PR</strong> là trải nghiệm trực tiếp, có kế hoạch mà thương hiệu/tổ chức tạo ra để xây quan hệ, định hình danh tiếng và thu tin bài. Khác quảng cáo, sự kiện cho công chúng <em>chạm</em> vào thương hiệu — và cho báo chí, KOL, khách hàng một câu chuyện để kể lại.</p>
<h3>Vì sao sự kiện quan trọng với PR</h3>
<ul>
<li><strong>Trải nghiệm trực tiếp</strong> — người ta nhớ điều họ cảm nhận, không phải điều được nghe kể.</li>
<li><strong>Truyền thông lan toả (earned media)</strong> — một lễ ra mắt hay lễ hội chạy tốt sinh ra bài báo và nội dung mạng xã hội mà thương hiệu không phải trả tiền.</li>
<li><strong>Quan hệ</strong> — sự kiện đưa báo chí, đối tác, KOL và cộng đồng về cùng một chỗ.</li>
</ul>
<h3>Lộ trình bốn bước</h3>
<pre><code>1. HOẠCH ĐỊNH -> concept, mục tiêu (SMART), đối tượng, chủ đề, timeline
2. CHUẨN BỊ   -> ngân sách, tài trợ, nhà cung cấp, địa điểm, logistics, chương trình
3. THỰC THI   -> mời báo chí, kịch bản (run of show), quản trị tại chỗ trong ngày
4. ĐÁNH GIÁ   -> đo giá trị PR / ROI, báo cáo tổng kết, tính bền vững
</code></pre>
<p>Môn này đi theo cung đó qua tám chương, dựa trên Goldblatt, Bowdin, Allen, Getz, và khép lại bằng tư duy sự kiện bền vững ISO 20121.</p>
<div class="callout"><span class="badge">Ý cốt lõi</span> Sự kiện không phải một bữa tiệc — nó là <strong>công cụ truyền thông có mục tiêu</strong>. Mọi quyết định, từ địa điểm tới kịch bản MC, đều phải phục vụ mục tiêu PR.</div>`,
  ]]);

const c1 = doc('evn205-1-1-events-in-pr', '1.1 — What a PR event is|||1.1 — Sự kiện trong PR là gì',
  'Vai trò của sự kiện trong PR/truyền thông; các loại sự kiện (họp báo, ra mắt, hội nghị, lễ hội, CSR); mục tiêu sự kiện phải gắn mục tiêu truyền thông.',
  [[
    `<span class="eyebrow">EVN205 · Chapter 1 · Lesson 1.1</span>
<h2>What a PR event is</h2>
<h3>The role of events in PR</h3>
<p>Events sit inside the wider PR toolkit alongside press releases and media relations. Their job is to create a <strong>controlled experience</strong> around which a brand story can be told — to media, customers, employees or the community.</p>
<h3>Common event types</h3>
<ul>
<li><strong>Press conference</strong> — announce news to journalists (a new product, a crisis response, a partnership).</li>
<li><strong>Product launch</strong> — reveal a product with experience and spectacle.</li>
<li><strong>Conference / seminar</strong> — position the brand as a thought leader.</li>
<li><strong>Brand festival / activation</strong> — mass, experiential engagement with the public.</li>
<li><strong>CSR / community event</strong> — build goodwill and demonstrate values.</li>
<li><strong>Internal event</strong> — kick-offs, galas and year-end parties for employees.</li>
</ul>
<h3>Objectives come first</h3>
<p>Every event should answer <strong>"what change in perception or behaviour do we want?"</strong> — more awareness, a shifted reputation, media pickup, leads, or loyalty. The type of event follows from the objective, never the reverse.</p>
<div class="callout"><span class="badge">Real case</span> When VinFast unveiled its cars at the Paris Motor Show, the objective wasn't ticket sales — it was <strong>global credibility and press coverage</strong>. Every choice (venue, celebrity guests, staging) served that PR goal.</div>`,
    `<span class="eyebrow">EVN205 · Chương 1 · Bài 1.1</span>
<h2>Sự kiện trong PR là gì</h2>
<h3>Vai trò của sự kiện trong PR</h3>
<p>Sự kiện nằm trong bộ công cụ PR rộng hơn, bên cạnh thông cáo báo chí và quan hệ báo chí. Việc của nó là tạo một <strong>trải nghiệm có kiểm soát</strong> để quanh đó kể câu chuyện thương hiệu — cho báo chí, khách hàng, nhân viên hay cộng đồng.</p>
<h3>Các loại sự kiện thường gặp</h3>
<ul>
<li><strong>Họp báo</strong> — công bố tin cho nhà báo (sản phẩm mới, ứng phó khủng hoảng, hợp tác).</li>
<li><strong>Ra mắt sản phẩm</strong> — giới thiệu sản phẩm bằng trải nghiệm và hiệu ứng.</li>
<li><strong>Hội nghị / hội thảo</strong> — định vị thương hiệu là người dẫn dắt tư tưởng.</li>
<li><strong>Lễ hội thương hiệu / activation</strong> — tương tác trải nghiệm với công chúng số đông.</li>
<li><strong>Sự kiện CSR / cộng đồng</strong> — xây thiện cảm và thể hiện giá trị.</li>
<li><strong>Sự kiện nội bộ</strong> — kick-off, gala, tất niên cho nhân viên.</li>
</ul>
<h3>Mục tiêu đứng trước</h3>
<p>Mọi sự kiện phải trả lời <strong>"ta muốn thay đổi nhận thức hay hành vi gì?"</strong> — tăng độ nhận biết, dịch chuyển danh tiếng, có tin bài, ra lead, hay tạo lòng trung thành. Loại sự kiện suy ra từ mục tiêu, không bao giờ ngược lại.</p>
<div class="callout"><span class="badge">Ca thật</span> Khi VinFast ra mắt xe tại Paris Motor Show, mục tiêu không phải bán vé — mà là <strong>uy tín toàn cầu và tin bài</strong>. Mọi lựa chọn (địa điểm, khách mời nổi tiếng, dàn dựng) đều phục vụ mục tiêu PR đó.</div>`,
  ]]);

const c1q = quiz('evn205-quiz-1', 'Quiz 1 — Events in PR|||Quiz 1 — Sự kiện trong PR', [
  { id: 'q1', question: 'Điều đầu tiên cần xác định khi làm một sự kiện PR là?|||What should you define FIRST for a PR event?', options: ['Địa điểm|||The venue', 'Mục tiêu (thay đổi nhận thức/hành vi)|||The objective (change in perception/behaviour)', 'Món ăn tiệc|||The catering menu', 'Màu backdrop|||The backdrop colour'], correctIndex: 1, explanation: 'Loại sự kiện suy ra từ mục tiêu; mục tiêu đứng trước.' },
  { id: 'q2', question: 'Loại sự kiện dùng để công bố tin chính thức cho nhà báo là?|||Which event type announces official news to journalists?', options: ['Lễ hội thương hiệu|||Brand festival', 'Họp báo|||Press conference', 'Tiệc nội bộ|||Internal party', 'Activation đường phố|||Street activation'], correctIndex: 1, explanation: 'Họp báo (press conference) là kênh công bố tin cho báo chí.' },
  { id: 'q3', question: 'Vì sao sự kiện mạnh cho PR hơn một quảng cáo đơn thuần?|||Why is an event stronger for PR than a plain ad?', options: ['Rẻ hơn mọi lúc|||It is always cheaper', 'Tạo trải nghiệm trực tiếp & earned media|||It creates direct experience & earned media', 'Không cần mục tiêu|||It needs no objective', 'Không cần đo lường|||It needs no measurement'], correctIndex: 1, explanation: 'Sự kiện cho công chúng trải nghiệm trực tiếp và sinh tin bài lan toả.' },
]);

const c2 = doc('evn205-2-1-concept-planning', '2.1 — Concept & planning|||2.1 — Ý tưởng & hoạch định',
  'Từ mục tiêu tới concept; mục tiêu SMART; chủ đề (theme) & thông điệp; xác định đối tượng khách mời; timeline ngược từ ngày sự kiện.',
  [[
    `<span class="eyebrow">EVN205 · Chapter 2 · Lesson 2.1</span>
<h2>Concept &amp; planning</h2>
<h3>From objective to concept</h3>
<p>A <strong>concept</strong> is the big creative idea that carries the message — the theme, the feeling, the one-line pitch. It must be born from the objective and the audience, not from a nice-looking Pinterest board.</p>
<h3>SMART objectives</h3>
<pre><code>S - Specific     e.g. "earn coverage in 15 tier-1 outlets"
M - Measurable   count articles, reach, attendees, leads
A - Achievable   realistic for the budget and timeline
R - Relevant     tied to the brand's PR goal
T - Time-bound   "within 2 weeks of launch day"
</code></pre>
<h3>Theme, audience &amp; timeline</h3>
<ul>
<li><strong>Theme</strong> — a single unifying idea that shapes visuals, script and experience.</li>
<li><strong>Audience</strong> — who must be in the room (press, KOLs, VIP customers) and what each needs.</li>
<li><strong>Timeline</strong> — plan <em>backwards</em> from event day: set milestones for venue lock, invites, rehearsal and press kit.</li>
</ul>
<div class="callout"><span class="badge">Real case</span> A skincare brand's launch used the theme "Skin, unfiltered". The concept drove everything — raw natural lighting, no-retouch photos, a dermatologist panel — and gave press a clear, quotable story angle.</div>`,
    `<span class="eyebrow">EVN205 · Chương 2 · Bài 2.1</span>
<h2>Ý tưởng &amp; hoạch định</h2>
<h3>Từ mục tiêu tới concept</h3>
<p>Một <strong>concept</strong> là ý tưởng sáng tạo lớn chở thông điệp — chủ đề, cảm xúc, câu chốt một dòng. Nó phải sinh ra từ mục tiêu và đối tượng, không phải từ một bảng Pinterest đẹp mắt.</p>
<h3>Mục tiêu SMART</h3>
<pre><code>S - Cụ thể       vd "có tin trên 15 báo tier-1"
M - Đo được      đếm bài, độ phủ, số khách, số lead
A - Khả thi      hợp với ngân sách và thời gian
R - Liên quan    gắn với mục tiêu PR của thương hiệu
T - Có mốc thời gian  "trong 2 tuần từ ngày ra mắt"
</code></pre>
<h3>Chủ đề, đối tượng &amp; timeline</h3>
<ul>
<li><strong>Chủ đề (theme)</strong> — một ý xuyên suốt định hình hình ảnh, kịch bản và trải nghiệm.</li>
<li><strong>Đối tượng</strong> — ai bắt buộc phải có mặt (báo chí, KOL, khách VIP) và mỗi nhóm cần gì.</li>
<li><strong>Timeline</strong> — lập <em>ngược</em> từ ngày sự kiện: đặt mốc chốt địa điểm, gửi thiệp, tổng duyệt và press kit.</li>
</ul>
<div class="callout"><span class="badge">Ca thật</span> Lễ ra mắt của một hãng dưỡng da lấy chủ đề "Làn da, không filter". Concept dẫn dắt tất cả — ánh sáng tự nhiên thô, ảnh không chỉnh sửa, hội đồng bác sĩ da liễu — và cho báo chí một góc câu chuyện rõ ràng, dễ trích.</div>`,
  ]]);

const c2q = quiz('evn205-quiz-2', 'Quiz 2 — Concept & planning|||Quiz 2 — Ý tưởng & hoạch định', [
  { id: 'q1', question: 'Chữ "M" trong mục tiêu SMART nghĩa là?|||What does "M" stand for in SMART objectives?', options: ['Money (tiền)|||Money', 'Measurable (đo được)|||Measurable', 'Marketing', 'Meeting (họp)|||Meeting'], correctIndex: 1, explanation: 'SMART = Specific, Measurable, Achievable, Relevant, Time-bound.' },
  { id: 'q2', question: 'Timeline sự kiện nên được lập như thế nào?|||How should an event timeline be built?', options: ['Ngược từ ngày sự kiện|||Backwards from event day', 'Từ hôm nay đi tới, không có mốc|||Forward with no milestones', 'Sau khi sự kiện xong|||After the event', 'Không cần timeline|||No timeline needed'], correctIndex: 0, explanation: 'Lập ngược từ ngày sự kiện để đặt mốc cho từng hạng mục.' },
  { id: 'q3', question: 'Concept của sự kiện phải sinh ra từ đâu?|||A concept must be born from what?', options: ['Bảng Pinterest đẹp|||A pretty Pinterest board', 'Mục tiêu & đối tượng|||The objective & audience', 'Ngân sách còn thừa|||Leftover budget', 'Sở thích của MC|||The MC preference'], correctIndex: 1, explanation: 'Concept phục vụ mục tiêu và đối tượng, không phải thẩm mỹ đơn thuần.' },
]);

const c3 = doc('evn205-3-1-budget-vendors', '3.1 — Budget & vendors|||3.1 — Ngân sách & nhà cung cấp',
  'Lập ngân sách (hạng mục, dự phòng 10%); tài trợ (sponsorship, quyền lợi); chọn & so nhà cung cấp; đàm phán; hợp đồng & điều khoản.',
  [[
    `<span class="eyebrow">EVN205 · Chapter 3 · Lesson 3.1</span>
<h2>Budget &amp; vendors</h2>
<h3>Building a budget</h3>
<p>A budget is a line-item plan of every cost. Group them: <strong>venue, production (stage/AV), F&amp;B, talent/MC, media &amp; content, staffing, printing, contingency</strong>. Always add a <strong>~10% contingency</strong> — something always goes over.</p>
<h3>Sponsorship</h3>
<p>Sponsors fund the event in exchange for exposure. Sell <strong>benefits, not begging</strong>: logo on backdrop, speaking slot, sampling booth, social mentions. Package tiers (Diamond / Gold / Silver) so partners self-select.</p>
<h3>Vendors, negotiation &amp; contracts</h3>
<ul>
<li><strong>Compare</strong> — get at least three quotes for big line items.</li>
<li><strong>Negotiate</strong> — bundle services, ask for off-peak rates, trade exposure for discount.</li>
<li><strong>Contract</strong> — put scope, deliverables, timing, payment terms, cancellation and a penalty clause in writing. A verbal "yes" is not a plan.</li>
</ul>
<div class="callout"><span class="badge">Real case</span> A tech conference covered 40% of its budget through sponsors — but only after packaging clear tiers with named benefits (keynote slot, booth, attendee data). Sponsors buy outcomes, so spell the outcomes out.</div>`,
    `<span class="eyebrow">EVN205 · Chương 3 · Bài 3.1</span>
<h2>Ngân sách &amp; nhà cung cấp</h2>
<h3>Lập ngân sách</h3>
<p>Ngân sách là bảng liệt kê từng khoản chi. Nhóm chúng lại: <strong>địa điểm, sản xuất (sân khấu/âm thanh-hình ảnh), F&amp;B, talent/MC, truyền thông &amp; nội dung, nhân sự, in ấn, dự phòng</strong>. Luôn cộng <strong>~10% dự phòng</strong> — luôn có khoản vượt.</p>
<h3>Tài trợ (sponsorship)</h3>
<p>Nhà tài trợ chi tiền đổi lấy độ phủ. Hãy bán <strong>quyền lợi, đừng xin</strong>: logo trên backdrop, suất phát biểu, gian sampling, nhắc tên trên mạng xã hội. Đóng gói theo hạng (Kim cương / Vàng / Bạc) để đối tác tự chọn.</p>
<h3>Nhà cung cấp, đàm phán &amp; hợp đồng</h3>
<ul>
<li><strong>So sánh</strong> — lấy ít nhất ba báo giá cho các hạng mục lớn.</li>
<li><strong>Đàm phán</strong> — gộp dịch vụ, xin giá giờ thấp điểm, đổi độ phủ lấy chiết khấu.</li>
<li><strong>Hợp đồng</strong> — ghi rõ phạm vi, hạng mục giao, thời gian, điều khoản thanh toán, huỷ và phạt. Một câu "ok" bằng miệng không phải kế hoạch.</li>
</ul>
<div class="callout"><span class="badge">Ca thật</span> Một hội nghị công nghệ bù được 40% ngân sách nhờ tài trợ — nhưng chỉ sau khi đóng gói các hạng rõ ràng kèm quyền lợi cụ thể (suất keynote, gian hàng, dữ liệu khách). Nhà tài trợ mua kết quả, nên phải nói rõ kết quả.</div>`,
  ]]);

const c3q = quiz('evn205-quiz-3', 'Quiz 3 — Budget & vendors|||Quiz 3 — Ngân sách & nhà cung cấp', [
  { id: 'q1', question: 'Vì sao ngân sách sự kiện nên có khoản dự phòng (~10%)?|||Why include a ~10% contingency in the budget?', options: ['Để tiêu cho vui|||To spend for fun', 'Vì luôn có khoản phát sinh/vượt|||Because costs always run over', 'Luật bắt buộc|||It is required by law', 'Để giấu nhà tài trợ|||To hide it from sponsors'], correctIndex: 1, explanation: 'Dự phòng che các khoản phát sinh không lường trước.' },
  { id: 'q2', question: 'Cách bán gói tài trợ hiệu quả nhất là?|||The best way to sell sponsorship is to?', options: ['Xin tiền chung chung|||Ask for money vaguely', 'Đóng gói quyền lợi rõ ràng theo hạng|||Package clear tiered benefits', 'Hứa miệng, không giấy tờ|||Promise verbally, no paper', 'Giảm giá vé|||Discount tickets'], correctIndex: 1, explanation: 'Nhà tài trợ mua kết quả — phải nêu rõ quyền lợi từng hạng.' },
  { id: 'q3', question: 'Trước khi chốt một nhà cung cấp lớn nên?|||Before locking a major vendor you should?', options: ['Lấy ít nhất 3 báo giá & ký hợp đồng|||Get 3+ quotes & sign a contract', 'Chốt bằng lời nói|||Confirm verbally', 'Chọn người rẻ nhất ngay|||Pick the cheapest instantly', 'Bỏ qua điều khoản huỷ|||Skip the cancellation clause'], correctIndex: 0, explanation: 'So báo giá và đưa mọi điều khoản vào hợp đồng viết.' },
]);

const c4 = doc('evn205-4-1-logistics-venue', '4.1 — Logistics & venue|||4.1 — Logistics & địa điểm',
  'Chọn địa điểm (sức chứa, vị trí, kỹ thuật); sơ đồ mặt bằng & luồng khách; thiết bị âm thanh-ánh sáng; F&B; giấy phép & an toàn.',
  [[
    `<span class="eyebrow">EVN205 · Chapter 4 · Lesson 4.1</span>
<h2>Logistics &amp; venue</h2>
<h3>Choosing a venue</h3>
<p>Match the venue to the concept and headcount. Check <strong>capacity, location &amp; access, power supply, load-in, parking, and technical fit</strong> (ceiling height for rigging, internet for livestream). Always do a physical <strong>site visit</strong> before signing.</p>
<h3>Floor plan &amp; guest flow</h3>
<p>Draw a <strong>floor plan</strong>: entrance and check-in, stage, seating, photo wall, sponsor booths, F&amp;B, toilets, backstage. Design the <strong>flow</strong> so guests move naturally from registration to the main show without bottlenecks.</p>
<h3>AV, F&amp;B &amp; permits</h3>
<ul>
<li><strong>Sound &amp; light</strong> — speakers, mics (wired + backup), lighting for stage and mood; test everything at rehearsal.</li>
<li><strong>F&amp;B</strong> — match menu and quantity to the audience and timing; plan for dietary needs.</li>
<li><strong>Permits</strong> — secure venue, sound, fire-safety and any public-gathering permits early.</li>
</ul>
<div class="callout"><span class="badge">Real case</span> An outdoor brand festival lost 20 minutes of program because one generator couldn't carry the LED wall <em>and</em> the sound rig. The fix is a <strong>power &amp; load plan</strong> checked against every device before the day.</div>`,
    `<span class="eyebrow">EVN205 · Chương 4 · Bài 4.1</span>
<h2>Logistics &amp; địa điểm</h2>
<h3>Chọn địa điểm</h3>
<p>Khớp địa điểm với concept và số lượng khách. Kiểm <strong>sức chứa, vị trí &amp; lối vào, nguồn điện, đường vận chuyển đồ (load-in), bãi xe, và độ phù hợp kỹ thuật</strong> (chiều cao trần để treo giàn, internet cho livestream). Luôn <strong>đi khảo sát thực địa</strong> trước khi ký.</p>
<h3>Sơ đồ mặt bằng &amp; luồng khách</h3>
<p>Vẽ <strong>sơ đồ mặt bằng</strong>: cổng và check-in, sân khấu, khu ngồi, photo wall, gian nhà tài trợ, F&amp;B, nhà vệ sinh, hậu đài. Thiết kế <strong>luồng di chuyển</strong> để khách đi tự nhiên từ đăng ký tới chương trình chính mà không tắc nghẽn.</p>
<h3>Âm thanh-ánh sáng, F&amp;B &amp; giấy phép</h3>
<ul>
<li><strong>Âm thanh &amp; ánh sáng</strong> — loa, micro (có dây + dự phòng), đèn cho sân khấu và không khí; thử tất cả ở buổi tổng duyệt.</li>
<li><strong>F&amp;B</strong> — khớp thực đơn và số lượng với đối tượng và thời điểm; tính cả nhu cầu ăn kiêng.</li>
<li><strong>Giấy phép</strong> — xin phép địa điểm, âm thanh, phòng cháy và tụ tập đông người từ sớm.</li>
</ul>
<div class="callout"><span class="badge">Ca thật</span> Một lễ hội thương hiệu ngoài trời mất 20 phút chương trình vì một máy phát không gánh nổi màn LED <em>và</em> dàn âm thanh cùng lúc. Cách chữa là một <strong>bảng điện &amp; tải</strong> đối chiếu với từng thiết bị trước ngày diễn ra.</div>`,
  ]]);

const c4q = quiz('evn205-quiz-4', 'Quiz 4 — Logistics & venue|||Quiz 4 — Logistics & địa điểm', [
  { id: 'q1', question: 'Việc bắt buộc làm trước khi ký hợp đồng địa điểm là?|||What must you do before signing a venue contract?', options: ['Đăng lên mạng xã hội|||Post it on social media', 'Đi khảo sát thực địa (site visit)|||Do a physical site visit', 'Mời báo chí|||Invite the press', 'In thiệp mời|||Print invitations'], correctIndex: 1, explanation: 'Khảo sát thực địa để kiểm sức chứa, điện, kỹ thuật, lối vào.' },
  { id: 'q2', question: 'Sơ đồ mặt bằng chủ yếu giúp điều gì?|||A floor plan mainly helps with?', options: ['Trang trí đẹp hơn|||Prettier decoration', 'Thiết kế luồng khách, tránh tắc nghẽn|||Guest flow, avoiding bottlenecks', 'Giảm ngân sách|||Cutting budget', 'Mời KOL|||Inviting KOLs'], correctIndex: 1, explanation: 'Sơ đồ định vị các khu và luồng di chuyển của khách.' },
  { id: 'q3', question: 'Bài học từ ca "máy phát quá tải" là cần?|||The generator-overload case teaches you to?', options: ['Bỏ màn LED|||Drop the LED wall', 'Có bảng điện & tải, kiểm mọi thiết bị trước|||Make a power & load plan checked in advance', 'Thuê thêm MC|||Hire more MCs', 'Bỏ tổng duyệt|||Skip rehearsal'], correctIndex: 1, explanation: 'Tính tải điện của mọi thiết bị trước ngày sự kiện.' },
]);

const c5 = doc('evn205-5-1-program-production', '5.1 — Program & production|||5.1 — Chương trình & sản xuất',
  'Run of show (kịch bản phút-theo-phút); kịch bản MC; dàn dựng sân khấu; đạo diễn hình & âm thanh; thiết kế trải nghiệm khách mời.',
  [[
    `<span class="eyebrow">EVN205 · Chapter 5 · Lesson 5.1</span>
<h2>Program &amp; production</h2>
<h3>The run of show</h3>
<p>The <strong>run of show</strong> is a minute-by-minute script: what happens, who does it, and which cue triggers it (lights, video, music). It is the single document the whole crew works from on the day.</p>
<pre><code>Time   Segment            Owner     Cue
18:00  Doors / check-in   Ushers    Lobby music
18:30  MC opening         MC        Spotlight + intro VT
18:40  CEO keynote        CEO       Slide 1, mic 1
19:00  Product reveal     Stage     Countdown VT + LED
19:15  Press Q&amp;A + photo   PR lead   House lights up
</code></pre>
<h3>MC script, stage &amp; experience</h3>
<ul>
<li><strong>MC script</strong> — write the actual words for openings, transitions and names; never leave it to improvisation.</li>
<li><strong>Stage &amp; set</strong> — backdrop, lighting, screen content and reveal mechanics support the message.</li>
<li><strong>Guest experience</strong> — design the journey: welcome, wow-moment, interaction, shareable photo spot, send-off.</li>
</ul>
<div class="callout"><span class="badge">Real case</span> At a phone launch, the "reveal" — lights down, countdown video, the device rising on a lift as the logo hit the LED — was rehearsed to the second. The wow-moment is what press photograph and audiences share.</div>`,
    `<span class="eyebrow">EVN205 · Chương 5 · Bài 5.1</span>
<h2>Chương trình &amp; sản xuất</h2>
<h3>Run of show (kịch bản chạy)</h3>
<p><strong>Run of show</strong> là kịch bản phút-theo-phút: điều gì diễn ra, ai làm, và tín hiệu nào kích hoạt (đèn, video, nhạc). Đây là tài liệu duy nhất cả ê-kíp bám theo trong ngày.</p>
<pre><code>Giờ    Phân đoạn           Phụ trách  Cue
18:00  Mở cửa / check-in   Lễ tân     Nhạc sảnh
18:30  MC mở màn           MC         Spotlight + VT giới thiệu
18:40  CEO phát biểu       CEO        Slide 1, mic 1
19:00  Ra mắt sản phẩm     Sân khấu   VT đếm ngược + LED
19:15  Q&amp;A báo chí + chụp   PR lead    Bật đèn khán phòng
</code></pre>
<h3>Kịch bản MC, sân khấu &amp; trải nghiệm</h3>
<ul>
<li><strong>Kịch bản MC</strong> — viết đúng lời cho mở màn, chuyển đoạn và xướng tên; đừng để ứng khẩu.</li>
<li><strong>Sân khấu &amp; bối cảnh</strong> — backdrop, ánh sáng, nội dung màn hình và cơ chế "reveal" phục vụ thông điệp.</li>
<li><strong>Trải nghiệm khách</strong> — thiết kế hành trình: chào đón, khoảnh khắc wow, tương tác, điểm chụp ảnh chia sẻ, tiễn khách.</li>
</ul>
<div class="callout"><span class="badge">Ca thật</span> Ở một lễ ra mắt điện thoại, màn "reveal" — tắt đèn, video đếm ngược, máy nâng lên bằng thang khi logo đập lên LED — được tổng duyệt tới từng giây. Khoảnh khắc wow là thứ báo chí chụp và khán giả chia sẻ.</div>`,
  ]]);

const c5q = quiz('evn205-quiz-5', 'Quiz 5 — Program & production|||Quiz 5 — Chương trình & sản xuất', [
  { id: 'q1', question: 'Run of show là gì?|||What is a run of show?', options: ['Danh sách khách mời|||The guest list', 'Kịch bản phút-theo-phút kèm cue|||A minute-by-minute script with cues', 'Bảng ngân sách|||The budget sheet', 'Hợp đồng địa điểm|||The venue contract'], correctIndex: 1, explanation: 'Run of show ghi từng phân đoạn, người phụ trách và cue.' },
  { id: 'q2', question: 'Kịch bản MC nên được xử lý thế nào?|||How should the MC script be handled?', options: ['Để MC ứng khẩu hoàn toàn|||Fully improvised by the MC', 'Viết sẵn lời mở, chuyển đoạn, xướng tên|||Written out for openings, transitions, names', 'Chỉ đọc tên nhà tài trợ|||Only read sponsor names', 'Bỏ qua nếu MC giỏi|||Skipped if the MC is good'], correctIndex: 1, explanation: 'Viết trước kịch bản MC để tránh sai sót và lệch thông điệp.' },
  { id: 'q3', question: 'Vì sao khoảnh khắc "wow"/reveal quan trọng với PR?|||Why does the "wow"/reveal moment matter for PR?', options: ['Vì nó rẻ|||Because it is cheap', 'Vì báo chí chụp & khán giả chia sẻ|||Because press photograph & audiences share it', 'Vì thay được ngân sách|||It replaces the budget', 'Vì bỏ được tổng duyệt|||It removes rehearsal'], correctIndex: 1, explanation: 'Khoảnh khắc wow sinh hình ảnh và lan toả — chính là earned media.' },
]);

const c6 = doc('evn205-6-1-media-pr', '6.1 — Media & PR for the event|||6.1 — Truyền thông & PR cho sự kiện',
  'Mời báo chí & press kit; hợp tác KOL/influencer; social media & hashtag; livestream; thu hoạch & theo dõi media coverage.',
  [[
    `<span class="eyebrow">EVN205 · Chapter 6 · Lesson 6.1</span>
<h2>Media &amp; PR for the event</h2>
<h3>Press invites &amp; press kit</h3>
<p>Build a targeted <strong>media list</strong>, send invitations early with a clear news angle, and prepare a <strong>press kit</strong> (press release, fact sheet, key visuals, spokesperson bios, hi-res photos). Make it effortless for a journalist to file a story.</p>
<h3>KOLs, social &amp; livestream</h3>
<ul>
<li><strong>KOLs / influencers</strong> — pick voices that fit the brand and audience; brief them, don't script them into robots.</li>
<li><strong>Social media</strong> — one memorable <strong>hashtag</strong>, a content plan for before / during / after, and a photo spot built for sharing.</li>
<li><strong>Livestream</strong> — extend reach beyond the room; check bandwidth, a backup connection, and a dedicated stream operator.</li>
</ul>
<h3>Media coverage</h3>
<p>After the event, <strong>track coverage</strong> — which outlets ran it, reach, tone, and whether key messages appeared. This is the raw material for the PR-value report in Chapter 8.</p>
<div class="callout"><span class="badge">Real case</span> A launch trended nationally because the hashtag was short, the photo wall was designed for phone cameras, and 12 briefed KOLs posted within the first hour — turning attendees into a distribution network.</div>`,
    `<span class="eyebrow">EVN205 · Chương 6 · Bài 6.1</span>
<h2>Truyền thông &amp; PR cho sự kiện</h2>
<h3>Mời báo chí &amp; press kit</h3>
<p>Dựng <strong>danh sách báo chí</strong> có chọn lọc, gửi thiệp mời sớm kèm góc tin rõ ràng, và chuẩn bị <strong>press kit</strong> (thông cáo báo chí, fact sheet, key visual, tiểu sử người phát ngôn, ảnh độ phân giải cao). Làm cho nhà báo viết bài dễ nhất có thể.</p>
<h3>KOL, mạng xã hội &amp; livestream</h3>
<ul>
<li><strong>KOL / influencer</strong> — chọn tiếng nói hợp thương hiệu và đối tượng; brief họ, đừng biến họ thành cái máy đọc thoại.</li>
<li><strong>Mạng xã hội</strong> — một <strong>hashtag</strong> dễ nhớ, kế hoạch nội dung trước / trong / sau, và điểm chụp ảnh làm để chia sẻ.</li>
<li><strong>Livestream</strong> — mở rộng độ phủ ra ngoài khán phòng; kiểm băng thông, đường truyền dự phòng, và người vận hành stream riêng.</li>
</ul>
<h3>Media coverage (thu hoạch tin bài)</h3>
<p>Sau sự kiện, <strong>theo dõi tin bài</strong> — báo nào đăng, độ phủ, sắc thái, và thông điệp chính có xuất hiện không. Đây là nguyên liệu cho báo cáo giá trị PR ở Chương 8.</p>
<div class="callout"><span class="badge">Ca thật</span> Một lễ ra mắt lên xu hướng toàn quốc vì hashtag ngắn, photo wall làm cho camera điện thoại, và 12 KOL được brief đăng bài trong giờ đầu — biến khách dự thành một mạng lưới phân phối.</div>`,
  ]]);

const c6q = quiz('evn205-quiz-6', 'Quiz 6 — Media & PR|||Quiz 6 — Truyền thông & PR', [
  { id: 'q1', question: 'Press kit dùng để làm gì?|||What is a press kit for?', options: ['Trang trí bàn tiệc|||Decorating the table', 'Giúp nhà báo viết bài dễ dàng|||Making it easy for journalists to file a story', 'Trả tiền nhà cung cấp|||Paying vendors', 'Điều khiển ánh sáng|||Controlling lights'], correctIndex: 1, explanation: 'Press kit gồm thông cáo, fact sheet, ảnh, bio — nguyên liệu để nhà báo viết.' },
  { id: 'q2', question: 'Cách làm việc đúng với KOL là?|||The right way to work with KOLs is to?', options: ['Bắt đọc thoại như máy|||Force robotic scripts', 'Brief rõ nhưng để họ nói bằng chất riêng|||Brief clearly but let them use their own voice', 'Không cần chọn ai hợp thương hiệu|||No need to match the brand', 'Trả tiền là đủ, không brief|||Just pay, no brief'], correctIndex: 1, explanation: 'Chọn KOL hợp thương hiệu, brief rõ, giữ chất riêng của họ.' },
  { id: 'q3', question: 'Theo dõi media coverage sau sự kiện để?|||Tracking media coverage after the event lets you?', options: ['Đặt tiệc lần sau|||Order the next catering', 'Đo độ phủ, sắc thái, thông điệp — làm báo cáo PR value|||Measure reach, tone, messages for the PR-value report', 'Chọn địa điểm mới|||Pick a new venue', 'Thuê thêm bảo vệ|||Hire more security'], correctIndex: 1, explanation: 'Coverage là nguyên liệu đo giá trị PR/ROI của sự kiện.' },
]);

const c7 = doc('evn205-7-1-risk-safety', '7.1 — Risk & safety|||7.1 — Quản trị rủi ro & an toàn',
  'Đánh giá rủi ro (risk assessment); an ninh & kiểm soát đám đông; ứng phó khủng hoảng truyền thông; kế hoạch dự phòng (plan B); bảo hiểm.',
  [[
    `<span class="eyebrow">EVN205 · Chapter 7 · Lesson 7.1</span>
<h2>Risk &amp; safety</h2>
<h3>Risk assessment</h3>
<p>List every plausible risk, rate it by <strong>likelihood × impact</strong>, and assign a mitigation and an owner. Cover weather, technical failure, medical incidents, crowd surges, no-show speakers and PR crises.</p>
<pre><code>Risk               Likelihood  Impact  Mitigation
Rain (outdoor)     Medium      High    Tent + indoor backup
AV / power failure Low         High    Backup generator + spare mics
Speaker no-show    Low         Medium  Pre-recorded VT + standby host
Negative press     Low         High    Holding statement + spokesperson
</code></pre>
<h3>Security, crisis &amp; contingency</h3>
<ul>
<li><strong>Security &amp; crowd control</strong> — staff, barriers, clear entrances/exits, and capacity limits.</li>
<li><strong>Crisis communication</strong> — a designated spokesperson, a holding statement, and a rule that only they speak to press.</li>
<li><strong>Plan B</strong> — a written contingency for the top risks; everyone knows the trigger and the call.</li>
<li><strong>Insurance</strong> — event/liability insurance transfers the cost of the worst outcomes.</li>
</ul>
<div class="callout"><span class="badge">Real case</span> When rain hit an outdoor product launch, the team executed a pre-agreed indoor Plan B in 15 minutes — because the trigger ("rain after 5pm"), the space and the crew roles were decided <em>weeks</em> earlier, not on the spot.</div>`,
    `<span class="eyebrow">EVN205 · Chương 7 · Bài 7.1</span>
<h2>Quản trị rủi ro &amp; an toàn</h2>
<h3>Đánh giá rủi ro</h3>
<p>Liệt kê mọi rủi ro hợp lý, chấm theo <strong>khả năng × tác động</strong>, rồi gán biện pháp giảm thiểu và người chịu trách nhiệm. Bao gồm thời tiết, hỏng kỹ thuật, sự cố y tế, chen lấn đám đông, diễn giả vắng và khủng hoảng PR.</p>
<pre><code>Rủi ro              Khả năng   Tác động  Giảm thiểu
Mưa (ngoài trời)    Trung bình High      Rạp + phương án trong nhà
Hỏng AV / điện      Thấp       High      Máy phát dự phòng + micro dự phòng
Diễn giả vắng       Thấp       Medium    VT ghi sẵn + MC thay thế
Tin tiêu cực        Thấp       High      Thông cáo tạm + người phát ngôn
</code></pre>
<h3>An ninh, khủng hoảng &amp; dự phòng</h3>
<ul>
<li><strong>An ninh &amp; kiểm soát đám đông</strong> — nhân sự, rào chắn, lối vào/ra rõ ràng, và giới hạn sức chứa.</li>
<li><strong>Truyền thông khủng hoảng</strong> — một người phát ngôn được chỉ định, một thông cáo tạm, và quy tắc chỉ người đó nói với báo chí.</li>
<li><strong>Plan B</strong> — kế hoạch dự phòng bằng văn bản cho các rủi ro hàng đầu; mọi người biết điều kiện kích hoạt và người ra quyết định.</li>
<li><strong>Bảo hiểm</strong> — bảo hiểm sự kiện/trách nhiệm chuyển chi phí của những kết cục xấu nhất.</li>
</ul>
<div class="callout"><span class="badge">Ca thật</span> Khi trời mưa giữa lễ ra mắt ngoài trời, ê-kíp chạy Plan B vào trong nhà trong 15 phút — vì điều kiện kích hoạt ("mưa sau 17h"), không gian và vai trò từng người đã được quyết <em>nhiều tuần</em> trước, không phải ứng biến tại chỗ.</div>`,
  ]]);

const c7q = quiz('evn205-quiz-7', 'Quiz 7 — Risk & safety|||Quiz 7 — Rủi ro & an toàn', [
  { id: 'q1', question: 'Rủi ro thường được chấm điểm theo hai chiều nào?|||Risk is usually rated on which two dimensions?', options: ['Giá & màu|||Price & colour', 'Khả năng xảy ra × Tác động|||Likelihood × Impact', 'Số khách × Số MC|||Guests × MCs', 'Thời gian × Địa điểm|||Time × Venue'], correctIndex: 1, explanation: 'Ma trận rủi ro: khả năng nhân với mức tác động.' },
  { id: 'q2', question: 'Trong khủng hoảng truyền thông, ai nên nói với báo chí?|||In a media crisis, who should speak to the press?', options: ['Bất kỳ nhân viên nào|||Any staff member', 'Chỉ người phát ngôn được chỉ định|||Only the designated spokesperson', 'Nhà tài trợ|||The sponsor', 'MC sân khấu|||The stage MC'], correctIndex: 1, explanation: 'Chỉ người phát ngôn được chỉ định phát ngôn, theo thông cáo tạm.' },
  { id: 'q3', question: 'Điều làm Plan B chạy được nhanh khi sự cố xảy ra là?|||What makes a Plan B execute fast when trouble hits?', options: ['Quyết định tại chỗ|||Deciding on the spot', 'Điều kiện kích hoạt & vai trò quyết trước|||Trigger & roles decided in advance', 'Chờ nhà tài trợ duyệt|||Waiting for sponsor approval', 'Bỏ bảo hiểm|||Skipping insurance'], correctIndex: 1, explanation: 'Điều kiện kích hoạt, không gian và vai trò định trước cho phản ứng nhanh.' },
]);

const c8 = doc('evn205-8-1-execution-evaluation', '8.1 — Event-day execution & evaluation|||8.1 — Thực thi ngày sự kiện & đánh giá',
  'Quản trị tại chỗ (onsite) & phân vai đội ngũ; đo lường ROI & giá trị PR; báo cáo hậu sự kiện; sự kiện bền vững (ISO 20121).',
  [[
    `<span class="eyebrow">EVN205 · Chapter 8 · Lesson 8.1</span>
<h2>Event-day execution &amp; evaluation</h2>
<h3>On-site management</h3>
<p>On the day, the plan meets reality. A clear <strong>team structure</strong> — event director, stage manager, registration, media handler, logistics, security — plus radios and the run of show keep it under control. One person (the director) makes the final calls.</p>
<h3>Measuring PR value &amp; ROI</h3>
<ul>
<li><strong>Output</strong> — attendees, media pieces, reach, social mentions, hashtag volume.</li>
<li><strong>Outcome</strong> — shift in awareness/sentiment, leads, key messages that landed.</li>
<li><strong>PR value / ROI</strong> — compare results to objectives and cost; report it against the SMART goals from Chapter 2.</li>
</ul>
<h3>Wrap-up &amp; sustainability</h3>
<p>Write a <strong>post-event report</strong> (results vs objectives, budget actuals, lessons). And design for <strong>sustainable events</strong> per <strong>ISO 20121</strong>: cut waste, reusable materials, digital over print, and responsible sourcing — increasingly a reputational must for PR.</p>
<div class="callout"><span class="badge">Real case</span> A conference reported "2.4M reach, 18 tier-1 articles, 92% carried the key message, cost-per-media-contact down 30% vs last year" — turning a party into a defensible business result, and ran paperless check-in to meet its sustainability pledge.</div>`,
    `<span class="eyebrow">EVN205 · Chương 8 · Bài 8.1</span>
<h2>Thực thi ngày sự kiện &amp; đánh giá</h2>
<h3>Quản trị tại chỗ (onsite)</h3>
<p>Trong ngày, kế hoạch gặp thực tế. Một <strong>cấu trúc đội ngũ</strong> rõ ràng — giám đốc sự kiện, quản lý sân khấu, đăng ký, phụ trách báo chí, logistics, an ninh — cùng bộ đàm và run of show giữ mọi thứ trong tầm kiểm soát. Một người (giám đốc) ra quyết định cuối.</p>
<h3>Đo giá trị PR &amp; ROI</h3>
<ul>
<li><strong>Đầu ra (output)</strong> — số khách, số bài báo, độ phủ, lượt nhắc mạng xã hội, lượng hashtag.</li>
<li><strong>Kết quả (outcome)</strong> — dịch chuyển nhận biết/sắc thái, số lead, thông điệp chính có "đến nơi".</li>
<li><strong>Giá trị PR / ROI</strong> — so kết quả với mục tiêu và chi phí; báo cáo đối chiếu mục tiêu SMART ở Chương 2.</li>
</ul>
<h3>Tổng kết &amp; bền vững</h3>
<p>Viết <strong>báo cáo hậu sự kiện</strong> (kết quả so mục tiêu, chi phí thực, bài học). Và thiết kế <strong>sự kiện bền vững</strong> theo <strong>ISO 20121</strong>: giảm rác, vật liệu tái dùng, ưu tiên số hoá thay in ấn, nguồn cung có trách nhiệm — ngày càng là điều bắt buộc về danh tiếng cho PR.</p>
<div class="callout"><span class="badge">Ca thật</span> Một hội nghị báo cáo "2,4 triệu lượt tiếp cận, 18 bài tier-1, 92% mang thông điệp chính, chi phí trên mỗi đầu mối báo chí giảm 30% so năm trước" — biến một bữa tiệc thành kết quả kinh doanh bảo vệ được, và làm check-in không giấy để giữ cam kết bền vững.</div>`,
  ]]);

const c8q = quiz('evn205-quiz-8', 'Quiz 8 — Execution & evaluation|||Quiz 8 — Thực thi & đánh giá', [
  { id: 'q1', question: 'Trong ngày sự kiện, ai nên ra quyết định cuối cùng?|||On event day, who makes the final calls?', options: ['Nhà tài trợ lớn nhất|||The biggest sponsor', 'Giám đốc sự kiện (event director)|||The event director', 'Bất kỳ ai rảnh|||Whoever is free', 'MC', ], correctIndex: 1, explanation: 'Một cấu trúc đội ngũ rõ với giám đốc sự kiện ra quyết định cuối.' },
  { id: 'q2', question: 'Giá trị PR / ROI của sự kiện được đo bằng cách?|||PR value / ROI is measured by?', options: ['Đếm số món ăn|||Counting food dishes', 'So kết quả (độ phủ, thông điệp, lead) với mục tiêu & chi phí|||Comparing results to objectives & cost', 'Hỏi cảm giác MC|||Asking how the MC felt', 'Đo diện tích sân khấu|||Measuring the stage size'], correctIndex: 1, explanation: 'Đối chiếu output/outcome với mục tiêu SMART và chi phí.' },
  { id: 'q3', question: 'ISO 20121 liên quan tới điều gì trong sự kiện?|||ISO 20121 relates to what in events?', options: ['Kích thước backdrop|||Backdrop size', 'Quản lý sự kiện bền vững (giảm rác, số hoá)|||Sustainable event management (less waste, digital)', 'Giá vé|||Ticket price', 'Số lượng KOL|||KOL count'], correctIndex: 1, explanation: 'ISO 20121 là chuẩn hệ thống quản lý sự kiện bền vững.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'EVN205',
    slug: 'evn205-event-management-for-pr',
    title: 'Event Management For PR',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EVN205.webp',
    shortDescription: 'Run PR events end-to-end — event types & goals, concept & SMART objectives, budget & sponsorship, venue & logistics, run of show, media/KOL/livestream, risk & safety, on-site delivery and PR value/ROI with sustainable events (ISO 20121).|||Tổ chức sự kiện PR trọn gói — loại & mục tiêu, concept & SMART, ngân sách & tài trợ, địa điểm & logistics, kịch bản, báo chí/KOL/livestream, rủi ro & an toàn, thực thi tại chỗ, đo giá trị PR/ROI & sự kiện bền vững (ISO 20121).',
    description: 'Môn <strong>EVN205 — Event Management For PR</strong> (Quản trị sự kiện cho PR, khối Công nghệ Truyền thông, kỳ 7) dạy tổ chức sự kiện như một <strong>công cụ truyền thông có mục tiêu</strong>. Đi trọn vòng đời: <strong>vai trò sự kiện trong PR</strong> → <strong>ý tưởng &amp; hoạch định</strong> (concept, SMART, timeline) → <strong>ngân sách &amp; nhà cung cấp</strong> (tài trợ, đàm phán, hợp đồng) → <strong>logistics &amp; địa điểm</strong> → <strong>chương trình &amp; sản xuất</strong> (run of show, MC, sân khấu) → <strong>truyền thông &amp; PR</strong> (báo chí, KOL, livestream) → <strong>quản trị rủi ro &amp; an toàn</strong> → <strong>thực thi ngày sự kiện &amp; đánh giá</strong> (ROI/PR value, ISO 20121). Dựa trên Goldblatt, Bowdin, Allen, Getz; song ngữ, checklist, ca thật, quiz mỗi chương.',
    whatYouLearn: 'Các loại sự kiện & cách gắn mục tiêu truyền thông; viết concept & mục tiêu SMART, timeline ngược; lập ngân sách (dự phòng 10%), gọi tài trợ theo hạng, đàm phán & hợp đồng nhà cung cấp; chọn địa điểm, sơ đồ mặt bằng, âm thanh-ánh sáng, F&B, giấy phép; dựng run of show, kịch bản MC, thiết kế trải nghiệm & khoảnh khắc wow; mời báo chí, press kit, KOL, social/hashtag, livestream, thu hoạch media coverage; đánh giá rủi ro, an ninh, khủng hoảng, plan B, bảo hiểm; quản trị onsite, đo ROI/giá trị PR, báo cáo hậu sự kiện & sự kiện bền vững (ISO 20121).',
    requirements: 'Không cần nền tảng chuyên môn trước. Hữu ích nếu đã học nhập môn PR/truyền thông. Xem điều kiện tiên quyết của khối Công nghệ Truyền thông trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Goldblatt, Bowdin, Allen, Getz), ISO 20121, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Sự kiện là công cụ PR; lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Sự kiện trong PR|||Chapter 1 — Events in PR', description: 'Vai trò, các loại sự kiện, mục tiêu.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ý tưởng & hoạch định|||Chapter 2 — Concept & planning', description: 'Concept, SMART, chủ đề, đối tượng, timeline.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ngân sách & nhà cung cấp|||Chapter 3 — Budget & vendors', description: 'Budgeting, tài trợ, đàm phán, hợp đồng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Logistics & địa điểm|||Chapter 4 — Logistics & venue', description: 'Venue, sơ đồ, thiết bị, âm thanh-ánh sáng, F&B, giấy phép.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chương trình & sản xuất|||Chapter 5 — Program & production', description: 'Run of show, kịch bản MC, sân khấu, trải nghiệm.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Truyền thông & PR|||Chapter 6 — Media & PR', description: 'Báo chí, KOL, social, livestream, media coverage.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Rủi ro & an toàn|||Chapter 7 — Risk & safety', description: 'Risk assessment, khủng hoảng, an ninh, plan B, bảo hiểm.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Thực thi & đánh giá|||Chapter 8 — Execution & evaluation', description: 'Onsite, ROI/PR value, hậu sự kiện, ISO 20121.', lessons: [c8, c8q] },
  ],
};
