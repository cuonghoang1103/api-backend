/**
 * STE301 — Strategic Event and Entertainment Management. Giáo trình FLM
 * (syl), tham khảo: Van der Wagen "Event Management: For Tourism, Cultural,
 * Business and Sporting Events"; Goldblatt "Special Events: Creating and
 * Sustaining a New World for Celebration". 8 chương: tổng quan ngành, lập
 * kế hoạch chiến lược & ý tưởng, quản lý dự án & timeline, ngân sách & tài
 * trợ, địa điểm & hậu cần, marketing, rủi ro & pháp lý, đánh giá/ROI/bền
 * vững & công nghệ. Song ngữ + ví dụ + bài tập.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ste301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo (Van der Wagen, Goldblatt), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">STE301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Strategic Event and Entertainment Management</strong> — from event concept to on-site delivery, budgeting, marketing, risk and post-event ROI — in one place. The official FPTU slides live on <strong>FLM</strong>; below are the reference textbooks and free, legal resources this course draws on.</p>
<h3>📘 Reference textbooks</h3>
<ul>
<li><em>Event Management: For Tourism, Cultural, Business and Sporting Events</em> — Lynn Van der Wagen. The core reference for event classification, planning process, logistics and risk.</li>
<li><em>Special Events: Creating and Sustaining a New World for Celebration</em> — Joe Goldblatt. The core reference for event concept/theme design, sponsorship and stakeholder management.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — official FPTU syllabus &amp; lecture slides for STE301, sign in with your FPTU account.</li>
<li><a href="https://www.eventmanagerblog.com/" target="_blank" rel="noopener">Event Manager Blog</a> — practitioner articles on planning, budgeting, marketing and event tech.</li>
<li><a href="https://www.pcma.org/" target="_blank" rel="noopener">PCMA (Professional Convention Management Association)</a> — industry standards, research and career resources.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@EventManagerBlog" target="_blank" rel="noopener">Event Manager Blog (YouTube)</a> — event planning &amp; industry trend breakdowns.</li>
<li><a href="https://www.youtube.com/@EventbriteUS" target="_blank" rel="noopener">Eventbrite</a> — organizer case studies, ticketing &amp; marketing tactics.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.eventbrite.com/" target="_blank" rel="noopener">Eventbrite</a> — ticketing, registration &amp; attendee data.</li>
<li><a href="https://asana.com/" target="_blank" rel="noopener">Asana</a> / <a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — event project timelines &amp; task tracking (Gantt-style boards).</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — quick event branding, invitations and social assets.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — event classification, the strategic planning cycle, concept &amp; theme, the project timeline (Gantt/critical path).</li>
<li><strong>Practice</strong> — build a mock budget and a run-of-show timeline for a small event (e.g. a 200-guest conference or a club night).</li>
<li><strong>Go deeper</strong> — sponsorship pitch decks, marketing/PR plans, risk registers and legal/permit checklists.</li>
<li><strong>Job-ready</strong> — post-event evaluation reports (ROI/ROO), sustainability practice, and hybrid/virtual event platforms.</li>
</ol></div>`,
    `<span class="eyebrow">STE301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quản trị Sự kiện &amp; Giải trí Chiến lược</strong> — từ ý tưởng sự kiện đến triển khai tại chỗ, ngân sách, marketing, rủi ro và đánh giá ROI sau sự kiện — gom về một chỗ. Slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là giáo trình tham khảo và nguồn miễn phí, hợp pháp mà môn này bám theo.</p>
<h3>📘 Giáo trình tham khảo</h3>
<ul>
<li><em>Event Management: For Tourism, Cultural, Business and Sporting Events</em> — Lynn Van der Wagen. Tài liệu gốc cho phân loại sự kiện, quy trình lập kế hoạch, hậu cần và rủi ro.</li>
<li><em>Special Events: Creating and Sustaining a New World for Celebration</em> — Joe Goldblatt. Tài liệu gốc cho thiết kế ý tưởng/chủ đề sự kiện, tài trợ và quản trị bên liên quan.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — giáo trình &amp; slide bài giảng chính thức của FPTU cho STE301, đăng nhập bằng tài khoản FPTU.</li>
<li><a href="https://www.eventmanagerblog.com/" target="_blank" rel="noopener">Event Manager Blog</a> — bài viết thực chiến về lập kế hoạch, ngân sách, marketing và công nghệ sự kiện.</li>
<li><a href="https://www.pcma.org/" target="_blank" rel="noopener">PCMA (Professional Convention Management Association)</a> — chuẩn ngành, nghiên cứu và tài nguyên nghề nghiệp.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@EventManagerBlog" target="_blank" rel="noopener">Event Manager Blog (YouTube)</a> — phân tích lập kế hoạch sự kiện &amp; xu hướng ngành.</li>
<li><a href="https://www.youtube.com/@EventbriteUS" target="_blank" rel="noopener">Eventbrite</a> — case study nhà tổ chức, chiến thuật bán vé &amp; marketing.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.eventbrite.com/" target="_blank" rel="noopener">Eventbrite</a> — bán vé, đăng ký &amp; dữ liệu khách tham dự.</li>
<li><a href="https://asana.com/" target="_blank" rel="noopener">Asana</a> / <a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — timeline dự án sự kiện &amp; theo dõi công việc (dạng bảng Gantt).</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — dựng nhanh nhận diện sự kiện, thư mời và ấn phẩm mạng xã hội.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — phân loại sự kiện, vòng lập kế hoạch chiến lược, ý tưởng &amp; chủ đề, timeline dự án (Gantt/đường tới hạn).</li>
<li><strong>Luyện tập</strong> — dựng một ngân sách mẫu và một timeline vận hành (run-of-show) cho một sự kiện nhỏ (vd hội thảo 200 khách hoặc một đêm nhạc club).</li>
<li><strong>Đào sâu</strong> — bộ slide gọi tài trợ, kế hoạch marketing/PR, sổ rủi ro và checklist pháp lý/giấy phép.</li>
<li><strong>Sẵn sàng đi làm</strong> — báo cáo đánh giá sau sự kiện (ROI/ROO), thực hành bền vững, và nền tảng sự kiện hybrid/virtual.</li>
</ol></div>`,
  ]]);

const intro = doc('ste301-0-1-overview', 'Course overview: Strategic Event and Entertainment Management|||Tổng quan: Quản trị Sự kiện & Giải trí Chiến lược',
  'Sự kiện là gì, vì sao cần "chiến lược"; lộ trình: tổng quan ngành → ý tưởng & lập kế hoạch → dự án & timeline → ngân sách & tài trợ → địa điểm & hậu cần → marketing → rủi ro & pháp lý → đánh giá/ROI/bền vững & công nghệ.',
  [[
    `<span class="eyebrow">STE301 · Lesson 0.1 · Overview</span>
<h2>Strategic Event and Entertainment Management</h2>
<p class="lead">This course teaches you to plan, budget, market and deliver an event as a <strong>business project</strong>, not just a party. You will treat an event the way a manager treats any strategic initiative: it has objectives, stakeholders, a budget, a timeline, risks — and a measurable return.</p>
<h3>Why "strategic"?</h3>
<ul>
<li><strong>Events tie to organizational goals</strong> — a product launch, a fundraiser, a music festival, a sports tournament all exist to move a metric (revenue, brand awareness, community goodwill, ticket sales).</li>
<li><strong>Resources are finite</strong> — budget, venue capacity, staff hours and time-to-event force trade-offs that must be planned, not improvised.</li>
<li><strong>Entertainment adds a layer</strong> — beyond logistics, an event/entertainment product must also create an emotional experience worth attending and worth remembering.</li>
</ul>
<h3>Roadmap</h3>
<p>Industry overview &amp; event classification → strategic planning &amp; concept/theme → project management &amp; timeline → budgeting, sponsorship &amp; revenue → venue, logistics &amp; operations → marketing &amp; communications → risk, safety &amp; legal → evaluation, ROI, sustainability &amp; event technology (hybrid/virtual). Bilingual, with worked examples and chapter quizzes, referencing Van der Wagen and Goldblatt.</p>`,
    `<span class="eyebrow">STE301 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị Sự kiện &amp; Giải trí Chiến lược</h2>
<p class="lead">Môn này dạy bạn lập kế hoạch, dự trù ngân sách, làm marketing và triển khai một sự kiện như một <strong>dự án kinh doanh</strong>, không chỉ là một buổi tiệc. Bạn sẽ đối xử với sự kiện theo cách nhà quản trị đối xử với bất kỳ dự án chiến lược nào: có mục tiêu, có bên liên quan, có ngân sách, có timeline, có rủi ro — và có kết quả đo được.</p>
<h3>Vì sao gọi là "chiến lược"?</h3>
<ul>
<li><strong>Sự kiện gắn với mục tiêu tổ chức</strong> — ra mắt sản phẩm, gây quỹ, lễ hội âm nhạc, giải thể thao — tất cả tồn tại để dịch chuyển một chỉ số (doanh thu, nhận diện thương hiệu, thiện cảm cộng đồng, số vé bán).</li>
<li><strong>Nguồn lực có hạn</strong> — ngân sách, sức chứa địa điểm, giờ công nhân sự và thời gian còn lại tới ngày diễn ra buộc phải đánh đổi có kế hoạch, không phải chữa cháy.</li>
<li><strong>Giải trí thêm một lớp</strong> — ngoài hậu cần, một sản phẩm sự kiện/giải trí còn phải tạo ra trải nghiệm cảm xúc đáng để tham dự và đáng để nhớ.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tổng quan ngành &amp; phân loại sự kiện → lập kế hoạch chiến lược &amp; ý tưởng/chủ đề → quản lý dự án &amp; timeline → ngân sách, tài trợ &amp; doanh thu → địa điểm, hậu cần &amp; vận hành → marketing &amp; truyền thông → rủi ro, an toàn &amp; pháp lý → đánh giá, ROI, bền vững &amp; công nghệ sự kiện (hybrid/virtual). Song ngữ, có ví dụ mẫu và quiz mỗi chương, tham khảo Van der Wagen và Goldblatt.</p>`,
  ]]);

const c1 = doc('ste301-1-1-industry-classification', '1.1 — Event & entertainment industry overview; event classification|||1.1 — Tổng quan ngành sự kiện & giải trí; phân loại sự kiện',
  'Quy mô & các mảng của ngành sự kiện (MICE, thể thao, văn hoá, giải trí); phân loại theo mục đích, quy mô, hình thức; các bên liên quan chính (Van der Wagen).',
  [[
    `<span class="eyebrow">STE301 · Chapter 1 · Lesson 1.1</span>
<h2>Event &amp; entertainment industry overview; event classification</h2>
<h3>A large, fragmented industry</h3>
<p>The events industry spans <strong>MICE</strong> (Meetings, Incentives, Conferences, Exhibitions), <strong>sporting events</strong>, <strong>cultural/festival events</strong>, <strong>corporate &amp; entertainment events</strong> (concerts, product launches, award shows) and <strong>private/social events</strong> (weddings, parties). Van der Wagen groups these by their purpose and audience rather than by size alone.</p>
<h3>Classifying an event</h3>
<ul>
<li><strong>By purpose</strong> — celebration (festivals, weddings), education (conferences, exhibitions), promotion (product launches, brand activations), commemoration (anniversaries), competition (sports).</li>
<li><strong>By scale</strong> — <em>mega-events</em> (Olympics, World Cup — national/global impact), <em>hallmark events</em> (identified with a city/region, e.g. an annual carnival), <em>major events</em> (large but not identity-defining), <em>local/community events</em>.</li>
<li><strong>By form</strong> — public vs. private, ticketed vs. free, one-off vs. recurring, in-person vs. hybrid/virtual.</li>
</ul>
<h3>Key stakeholders</h3>
<p>Every event manager must map: the <strong>client/organizer</strong> (who sets objectives), <strong>attendees</strong> (the audience whose experience is being designed), <strong>sponsors/partners</strong>, <strong>venue &amp; suppliers</strong>, <strong>government/authorities</strong> (permits, safety), and the <strong>local community</strong> (impact on traffic, noise, economy).</p>
<div class="callout"><span class="badge">Why classification matters</span> The classification decides the budget scale, the permit requirements, the marketing channel and the risk profile before a single detail is planned — get it wrong and every later decision inherits the mistake.</div>`,
    `<span class="eyebrow">STE301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan ngành sự kiện &amp; giải trí; phân loại sự kiện</h2>
<h3>Một ngành lớn và phân mảnh</h3>
<p>Ngành sự kiện trải rộng qua <strong>MICE</strong> (Meetings, Incentives, Conferences, Exhibitions — họp hội nghị, khen thưởng, hội thảo, triển lãm), <strong>sự kiện thể thao</strong>, <strong>sự kiện văn hoá/lễ hội</strong>, <strong>sự kiện doanh nghiệp &amp; giải trí</strong> (concert, ra mắt sản phẩm, lễ trao giải) và <strong>sự kiện cá nhân/xã hội</strong> (cưới, tiệc). Van der Wagen nhóm các sự kiện này theo mục đích và đối tượng, không chỉ theo quy mô.</p>
<h3>Phân loại một sự kiện</h3>
<ul>
<li><strong>Theo mục đích</strong> — ăn mừng (lễ hội, cưới), giáo dục (hội thảo, triển lãm), quảng bá (ra mắt sản phẩm, kích hoạt thương hiệu), tưởng niệm (kỷ niệm), thi đấu (thể thao).</li>
<li><strong>Theo quy mô</strong> — <em>mega-event</em> (Olympic, World Cup — tác động quốc gia/toàn cầu), <em>hallmark event</em> (gắn liền với một thành phố/vùng, vd một lễ hội carnival hàng năm), <em>major event</em> (lớn nhưng chưa định danh vùng), <em>sự kiện địa phương/cộng đồng</em>.</li>
<li><strong>Theo hình thức</strong> — công khai vs riêng tư, bán vé vs miễn phí, một lần vs định kỳ, trực tiếp vs hybrid/virtual.</li>
</ul>
<h3>Các bên liên quan chính</h3>
<p>Mọi người quản trị sự kiện phải xác định: <strong>khách hàng/đơn vị tổ chức</strong> (người đặt mục tiêu), <strong>người tham dự</strong> (đối tượng mà trải nghiệm được thiết kế cho), <strong>nhà tài trợ/đối tác</strong>, <strong>địa điểm &amp; nhà cung cấp</strong>, <strong>cơ quan quản lý</strong> (giấy phép, an toàn), và <strong>cộng đồng địa phương</strong> (ảnh hưởng giao thông, tiếng ồn, kinh tế).</p>
<div class="callout"><span class="badge">Vì sao phân loại quan trọng</span> Phân loại quyết định quy mô ngân sách, yêu cầu giấy phép, kênh marketing và mức độ rủi ro trước khi có bất kỳ chi tiết nào được lập kế hoạch — phân loại sai thì mọi quyết định sau đó thừa hưởng luôn cái sai đó.</div>`,
  ]]);

const c1q = quiz('ste301-quiz-1', 'Quiz 1 — Industry & classification|||Quiz 1 — Ngành & phân loại', [
  { id: 'q1', question: 'Một sự kiện được gọi là "hallmark event" khi nào?', options: ['Chỉ tổ chức một lần duy nhất', 'Gắn liền với danh tính của một thành phố/vùng cụ thể', 'Không cần bán vé', 'Chỉ dành cho doanh nghiệp'], correctIndex: 1, explanation: 'Hallmark event được nhận diện gắn liền với một địa danh/vùng, vd lễ hội định kỳ hàng năm của một thành phố.' },
  { id: 'q2', question: 'MICE trong ngành sự kiện là viết tắt của?', options: ['Music, Idea, Culture, Entertainment', 'Meetings, Incentives, Conferences, Exhibitions', 'Media, Investment, Catering, Event', 'Marketing, Info, Community, Ethics'], correctIndex: 1, explanation: 'MICE = Meetings, Incentives, Conferences, Exhibitions — một mảng lớn của ngành sự kiện doanh nghiệp.' },
  { id: 'q3', question: 'Vì sao cần xác định bên liên quan (stakeholder) ngay từ đầu?', options: ['Chỉ để mời họ dự tiệc', 'Vì mỗi bên đặt ra mục tiêu/ràng buộc khác nhau ảnh hưởng toàn bộ kế hoạch', 'Vì luật bắt buộc phải liệt kê tên', 'Không cần, chỉ cần lo khách tham dự'], correctIndex: 1, explanation: 'Khách hàng, người tham dự, tài trợ, địa điểm, cơ quan quản lý và cộng đồng đều đặt ra yêu cầu/ràng buộc riêng cho sự kiện.' },
]);

const c2 = doc('ste301-2-1-strategic-planning-concept', '2.1 — Strategic planning & event concept/theme|||2.1 — Lập kế hoạch chiến lược & ý tưởng sự kiện (concept, theme)',
  'Quy trình lập kế hoạch chiến lược (mục tiêu SMART, phân tích SWOT); phát triển ý tưởng (concept) & chủ đề (theme) gắn với đối tượng và mục tiêu (Goldblatt).',
  [[
    `<span class="eyebrow">STE301 · Chapter 2 · Lesson 2.1</span>
<h2>Strategic planning &amp; event concept/theme</h2>
<h3>The strategic planning cycle</h3>
<p>Every event plan starts from the organization's objectives, not from a venue or a date. Van der Wagen frames it as a cycle: <strong>research → objectives → design → planning → coordination → evaluation</strong>. Objectives should be <strong>SMART</strong> (Specific, Measurable, Achievable, Relevant, Time-bound) — "increase membership sign-ups by 15% within 30 days of the event", not "make people happy".</p>
<h3>SWOT for event feasibility</h3>
<p>Before committing, run a <strong>SWOT</strong>: internal <strong>Strengths</strong> (in-house AV team, sponsor relationships) and <strong>Weaknesses</strong> (thin budget, no prior track record), external <strong>Opportunities</strong> (a gap in the local calendar, a trending theme) and <strong>Threats</strong> (a competing event same weekend, weather, economic downturn).</p>
<h3>Concept &amp; theme (Goldblatt)</h3>
<p>The <strong>concept</strong> is the event's core idea and value proposition (why this event, for whom, what feeling it delivers). The <strong>theme</strong> is how that concept is expressed visually and experientially — decor, colour palette, music, dress code, food and beverage, all reinforcing one consistent story. A theme is not decoration bolted on afterward; Goldblatt treats it as the thread that makes every later decision (venue, vendor, marketing copy) easy to judge as "on-brand" or not.</p>
<div class="callout"><span class="badge">Concept-check test</span> If you can't describe your event's concept in one sentence that names the audience, the feeling, and the measurable goal, the planning that follows will drift.</div>`,
    `<span class="eyebrow">STE301 · Chương 2 · Bài 2.1</span>
<h2>Lập kế hoạch chiến lược &amp; ý tưởng sự kiện (concept, theme)</h2>
<h3>Vòng lập kế hoạch chiến lược</h3>
<p>Mọi kế hoạch sự kiện bắt đầu từ mục tiêu của tổ chức, không bắt đầu từ địa điểm hay ngày giờ. Van der Wagen mô tả nó như một vòng: <strong>nghiên cứu → mục tiêu → thiết kế → lập kế hoạch → điều phối → đánh giá</strong>. Mục tiêu nên đạt chuẩn <strong>SMART</strong> (Cụ thể, Đo được, Khả thi, Liên quan, Có hạn thời gian) — "tăng 15% lượt đăng ký thành viên trong 30 ngày sau sự kiện", không phải "làm mọi người vui".</p>
<h3>SWOT để đánh giá tính khả thi</h3>
<p>Trước khi cam kết, chạy một bản <strong>SWOT</strong>: <strong>Điểm mạnh</strong> nội bộ (có sẵn team kỹ thuật âm thanh/hình ảnh, quan hệ tài trợ) và <strong>Điểm yếu</strong> (ngân sách mỏng, chưa có track record), <strong>Cơ hội</strong> bên ngoài (một khoảng trống trong lịch sự kiện địa phương, một chủ đề đang thịnh hành) và <strong>Nguy cơ</strong> (một sự kiện đối thủ cùng cuối tuần, thời tiết, suy thoái kinh tế).</p>
<h3>Ý tưởng &amp; chủ đề (Goldblatt)</h3>
<p><strong>Ý tưởng (concept)</strong> là lõi giá trị của sự kiện (vì sao có sự kiện này, cho ai, mang lại cảm giác gì). <strong>Chủ đề (theme)</strong> là cách ý tưởng đó được thể hiện ra bằng hình ảnh và trải nghiệm — trang trí, bảng màu, âm nhạc, dress code, ẩm thực, tất cả cùng khẳng định một câu chuyện nhất quán. Chủ đề không phải là trang trí gắn thêm sau cùng; Goldblatt coi nó là mạch xuyên suốt giúp mọi quyết định sau đó (địa điểm, nhà cung cấp, câu chữ marketing) dễ đánh giá là "đúng thương hiệu" hay không.</p>
<div class="callout"><span class="badge">Phép kiểm ý tưởng</span> Nếu không thể mô tả ý tưởng sự kiện trong một câu nêu rõ đối tượng, cảm giác mang lại và mục tiêu đo được, thì kế hoạch sau đó sẽ trôi dạt.</div>`,
  ]]);

const c2q = quiz('ste301-quiz-2', 'Quiz 2 — Strategic planning & concept/theme|||Quiz 2 — Lập kế hoạch & ý tưởng/chủ đề', [
  { id: 'q1', question: 'Mục tiêu sự kiện đạt chuẩn SMART cần có yếu tố nào?', options: ['Chỉ cần "làm khách vui"', 'Cụ thể, đo được, khả thi, liên quan, có hạn thời gian', 'Chỉ cần được cấp trên phê duyệt', 'Chỉ cần lớn hơn năm trước'], correctIndex: 1, explanation: 'SMART = Specific, Measurable, Achievable, Relevant, Time-bound.' },
  { id: 'q2', question: 'Trong phân tích SWOT, "một sự kiện đối thủ diễn ra cùng cuối tuần" thuộc nhóm nào?', options: ['Điểm mạnh', 'Điểm yếu', 'Cơ hội', 'Nguy cơ (Threat)'], correctIndex: 3, explanation: 'Yếu tố bên ngoài gây bất lợi cho sự kiện là một Threat (nguy cơ), không phải yếu tố nội bộ.' },
  { id: 'q3', question: 'Theo Goldblatt, "theme" (chủ đề) của sự kiện là gì?', options: ['Chỉ là trang trí thêm vào cuối cùng', 'Cách thể hiện ý tưởng cốt lõi ra hình ảnh & trải nghiệm nhất quán', 'Tên gọi chính thức của sự kiện', 'Ngân sách dành cho decor'], correctIndex: 1, explanation: 'Theme là mạch xuyên suốt thể hiện concept qua decor, âm nhạc, ẩm thực... một cách nhất quán, không phải trang trí gắn thêm sau.' },
]);

const c3 = doc('ste301-3-1-project-management-timeline', '3.1 — Event project management & timeline|||3.1 — Quản lý dự án sự kiện & timeline',
  'Chia nhỏ công việc (WBS), sơ đồ Gantt/đường tới hạn, các cột mốc ngược từ ngày diễn ra (T-minus), run-of-show ngày sự kiện.',
  [[
    `<span class="eyebrow">STE301 · Chapter 3 · Lesson 3.1</span>
<h2>Event project management &amp; timeline</h2>
<h3>Breaking the event into a project</h3>
<p>Treat the event as a project with a <strong>work breakdown structure (WBS)</strong>: venue &amp; permits, programme &amp; talent, marketing, sponsorship, logistics &amp; F&amp;B, on-site staffing, post-event wrap-up. Each branch gets an owner, a deadline and a dependency (e.g. marketing copy can't go out before the venue is confirmed).</p>
<h3>Working backward from event day ("T-minus")</h3>
<pre><code>T-90 days  Confirm venue, date, budget, core concept/theme
T-60 days  Sign vendors & sponsors, open registration/ticketing
T-30 days  Finalize programme, confirm speakers/talent, marketing push
T-14 days  Run-of-show draft, staff briefing scheduled, permits confirmed
T-7  days  Final headcount, vendor confirmations, risk/contingency review
T-1  day   Venue load-in, rehearsal/tech check
T-0  Event day: run-of-show execution
T+3  days  Post-event: vendor payments, thank-you comms, evaluation survey
T+14 days  Full evaluation report (ROI/ROO) to stakeholders
</code></pre>
<h3>Gantt charts &amp; the critical path</h3>
<p>A <strong>Gantt chart</strong> lays tasks on a timeline showing overlap and duration. The <strong>critical path</strong> is the longest chain of dependent tasks that determines the minimum time to event day — a delay anywhere on it delays the whole event; delays off the critical path can often be absorbed.</p>
<h3>Run-of-show</h3>
<p>On event day itself, the plan becomes a minute-by-minute <strong>run-of-show</strong> document: doors open, MC cues, performance slots, technical changeovers, break times — shared with every team lead and vendor so everyone works off the same clock.</p>
<div class="callout"><span class="badge">Buffer, don't optimism</span> Build slack into the critical path (10-15% time buffer on load-in/load-out); a "perfectly efficient" timeline with zero slack fails the moment one truck is late.</div>`,
    `<span class="eyebrow">STE301 · Chương 3 · Bài 3.1</span>
<h2>Quản lý dự án sự kiện &amp; timeline</h2>
<h3>Chia sự kiện thành một dự án</h3>
<p>Đối xử với sự kiện như một dự án có <strong>cấu trúc phân rã công việc (WBS)</strong>: địa điểm &amp; giấy phép, chương trình &amp; nghệ sĩ/khách mời, marketing, tài trợ, hậu cần &amp; ẩm thực (F&amp;B), nhân sự tại chỗ, tổng kết sau sự kiện. Mỗi nhánh có một người chịu trách nhiệm, một hạn chót và một phụ thuộc (vd nội dung marketing không thể phát hành trước khi địa điểm được xác nhận).</p>
<h3>Tính ngược từ ngày sự kiện ("T-minus")</h3>
<pre><code>T-90 ngày  Xác nhận địa điểm, ngày, ngân sách, ý tưởng/chủ đề cốt lõi
T-60 ngày  Ký nhà cung cấp & tài trợ, mở đăng ký/bán vé
T-30 ngày  Chốt chương trình, xác nhận diễn giả/nghệ sĩ, đẩy marketing
T-14 ngày  Bản thảo run-of-show, lên lịch briefing nhân sự, xác nhận giấy phép
T-7  ngày  Số lượng khách cuối, xác nhận nhà cung cấp, rà rủi ro/dự phòng
T-1  ngày  Lắp dựng tại địa điểm, chạy thử/kiểm tra kỹ thuật
T-0  Ngày sự kiện: triển khai run-of-show
T+3  ngày  Sau sự kiện: thanh toán nhà cung cấp, cảm ơn, khảo sát đánh giá
T+14 ngày  Báo cáo đánh giá đầy đủ (ROI/ROO) gửi các bên liên quan
</code></pre>
<h3>Sơ đồ Gantt &amp; đường tới hạn</h3>
<p>Một <strong>sơ đồ Gantt</strong> đặt các công việc trên một timeline, cho thấy độ trùng lặp và thời lượng. <strong>Đường tới hạn (critical path)</strong> là chuỗi công việc phụ thuộc dài nhất quyết định thời gian tối thiểu tới ngày sự kiện — trễ ở bất cứ đâu trên đường này sẽ trễ cả sự kiện; trễ ngoài đường tới hạn thường có thể bù được.</p>
<h3>Run-of-show</h3>
<p>Vào chính ngày sự kiện, kế hoạch trở thành tài liệu <strong>run-of-show</strong> tính theo từng phút: giờ mở cửa, cue cho MC, các phần trình diễn, chuyển đổi kỹ thuật, giờ nghỉ — chia sẻ cho mọi trưởng nhóm và nhà cung cấp để mọi người theo cùng một đồng hồ.</p>
<div class="callout"><span class="badge">Có đệm, đừng lạc quan</span> Chèn khoảng đệm vào đường tới hạn (10-15% thời gian dự phòng cho lắp dựng/tháo dỡ); một timeline "tối ưu hoàn hảo" không có khoảng đệm sẽ vỡ ngay khi một xe hàng đến muộn.</div>`,
  ]]);

const c3q = quiz('ste301-quiz-3', 'Quiz 3 — Project management & timeline|||Quiz 3 — Quản lý dự án & timeline', [
  { id: 'q1', question: '"Đường tới hạn" (critical path) trong timeline sự kiện là gì?', options: ['Danh sách nhà cung cấp quan trọng nhất', 'Chuỗi công việc phụ thuộc dài nhất quyết định thời gian tối thiểu tới ngày sự kiện', 'Ngân sách tối đa được phép chi', 'Đường di chuyển của khách trong venue'], correctIndex: 1, explanation: 'Critical path là chuỗi task phụ thuộc dài nhất; trễ trên đường này làm trễ toàn bộ sự kiện.' },
  { id: 'q2', question: 'Tài liệu tính theo từng phút dùng đúng ngày sự kiện, chia cho mọi trưởng nhóm, gọi là?', options: ['WBS', 'SWOT', 'Run-of-show', 'Sơ đồ Gantt'], correctIndex: 2, explanation: 'Run-of-show là lịch trình chi tiết theo phút cho ngày sự kiện, dùng để mọi bộ phận đồng bộ.' },
  { id: 'q3', question: 'Vì sao nên chèn khoảng đệm (buffer) vào timeline thay vì lập timeline "tối ưu hoàn hảo"?', options: ['Để timeline dài hơn cho đẹp', 'Vì luật yêu cầu', 'Vì một sự chậm trễ nhỏ (vd xe hàng đến muộn) có thể phá vỡ timeline không có đệm', 'Không cần, timeline luôn đúng như kế hoạch'], correctIndex: 2, explanation: 'Thực tế luôn có trễ nhỏ; khoảng đệm 10-15% giúp timeline chịu được sai lệch thực tế.' },
]);

const c4 = doc('ste301-4-1-budget-sponsorship-revenue', '4.1 — Budget, sponsorship & revenue sources|||4.1 — Ngân sách, tài trợ & nguồn doanh thu',
  'Cấu trúc ngân sách sự kiện (chi phí cố định/biến đổi, dự phòng); các nguồn doanh thu (bán vé, tài trợ, bán hàng, cấp vốn); các cấp độ & lợi ích tài trợ.',
  [[
    `<span class="eyebrow">STE301 · Chapter 4 · Lesson 4.1</span>
<h2>Budget, sponsorship &amp; revenue sources</h2>
<h3>Anatomy of an event budget</h3>
<p>Split costs into <strong>fixed</strong> (venue rental, insurance, core staff — don't change with attendance) and <strong>variable</strong> (catering per head, printed badges, security scaled to crowd size). Always add a <strong>contingency line</strong> (typically 10-15% of total budget) for the unplanned — a supplier price change, extra security, bad weather.</p>
<pre><code>Sample line-item budget (200-guest conference, illustrative)
 Venue rental ............... 40,000,000 VND  (fixed)
 AV / staging ................ 25,000,000 VND  (fixed)
 Catering (200 x 250,000) .... 50,000,000 VND  (variable)
 Marketing & printing ........ 15,000,000 VND  (fixed)
 Staffing / security ......... 20,000,000 VND  (variable)
 Contingency (12%) ........... 18,000,000 VND
 -------------------------------------------
 Total estimated cost ........ 168,000,000 VND
</code></pre>
<h3>Revenue sources</h3>
<ul>
<li><strong>Ticketing</strong> — direct attendee revenue; tiered pricing (early-bird, standard, VIP) manages cash flow and demand.</li>
<li><strong>Sponsorship</strong> — cash or in-kind support in exchange for visibility/access (see below).</li>
<li><strong>Merchandising &amp; on-site sales</strong> — F&amp;B, branded goods, photo booths.</li>
<li><strong>Grants / subsidies</strong> — for cultural, community or educational events, government or foundation funding.</li>
</ul>
<h3>Sponsorship tiers</h3>
<p>Structure sponsorship as tiers (e.g. Title / Gold / Silver / Bronze), each with a defined price and a matched set of <strong>deliverables</strong> — logo placement, stage mentions, booth space, VIP tickets, data/lead access. A sponsorship pitch (Goldblatt) sells the <em>audience match</em> and <em>brand story fit</em>, not just "our event is big".</p>
<div class="callout"><span class="badge">Break-even point</span> Compute the break-even attendee count (fixed costs ÷ (ticket price − variable cost per attendee)) before setting the ticket price — it tells you whether the budget is even viable.</div>`,
    `<span class="eyebrow">STE301 · Chương 4 · Bài 4.1</span>
<h2>Ngân sách, tài trợ &amp; nguồn doanh thu</h2>
<h3>Cấu trúc ngân sách sự kiện</h3>
<p>Tách chi phí thành <strong>cố định</strong> (thuê địa điểm, bảo hiểm, nhân sự lõi — không đổi theo số khách) và <strong>biến đổi</strong> (ẩm thực theo đầu người, thẻ in, an ninh theo quy mô đám đông). Luôn thêm một <strong>dòng dự phòng</strong> (thường 10-15% tổng ngân sách) cho những thứ chưa lường tới — giá nhà cung cấp đổi, thêm an ninh, thời tiết xấu.</p>
<pre><code>Ngân sách mẫu chi tiết (hội thảo 200 khách, minh hoạ)
 Thuê địa điểm ................ 40.000.000 VND  (cố định)
 Âm thanh / dàn dựng .......... 25.000.000 VND  (cố định)
 Ẩm thực (200 x 250.000) ...... 50.000.000 VND  (biến đổi)
 Marketing & in ấn ............ 15.000.000 VND  (cố định)
 Nhân sự / an ninh ............ 20.000.000 VND  (biến đổi)
 Dự phòng (12%) ............... 18.000.000 VND
 -------------------------------------------
 Tổng chi phí dự trù .......... 168.000.000 VND
</code></pre>
<h3>Các nguồn doanh thu</h3>
<ul>
<li><strong>Bán vé</strong> — doanh thu trực tiếp từ người tham dự; định giá theo bậc (early-bird, thường, VIP) giúp quản lý dòng tiền và nhu cầu.</li>
<li><strong>Tài trợ</strong> — hỗ trợ bằng tiền hoặc hiện vật đổi lại sự hiện diện/tiếp cận (xem bên dưới).</li>
<li><strong>Bán hàng &amp; doanh thu tại chỗ</strong> — F&amp;B, hàng hoá thương hiệu, chụp ảnh.</li>
<li><strong>Tài trợ/hỗ trợ từ quỹ</strong> — với sự kiện văn hoá, cộng đồng hoặc giáo dục, vốn từ chính phủ hoặc quỹ tài trợ.</li>
</ul>
<h3>Các cấp độ tài trợ</h3>
<p>Cấu trúc tài trợ theo cấp (vd Title / Gold / Silver / Bronze), mỗi cấp có mức giá xác định và một bộ <strong>quyền lợi</strong> tương ứng — vị trí logo, được nhắc trên sân khấu, không gian gian hàng, vé VIP, quyền tiếp cận dữ liệu/lead. Một bộ slide gọi tài trợ (theo Goldblatt) bán <em>sự khớp đối tượng</em> và <em>sự phù hợp câu chuyện thương hiệu</em>, không chỉ "sự kiện của chúng tôi lớn".</p>
<div class="callout"><span class="badge">Điểm hoà vốn</span> Tính số khách hoà vốn (chi phí cố định ÷ (giá vé − chi phí biến đổi mỗi khách)) trước khi đặt giá vé — nó cho biết ngân sách có khả thi hay không.</div>`,
  ]]);

const c4q = quiz('ste301-quiz-4', 'Quiz 4 — Budget & sponsorship|||Quiz 4 — Ngân sách & tài trợ', [
  { id: 'q1', question: 'Chi phí nào sau đây thuộc "chi phí cố định" của một sự kiện?', options: ['Ẩm thực tính theo đầu khách', 'Thuê địa điểm', 'Số lượng an ninh theo đám đông', 'Quà tặng theo số khách'], correctIndex: 1, explanation: 'Thuê địa điểm không đổi theo số lượng khách tham dự, nên là chi phí cố định.' },
  { id: 'q2', question: 'Dòng "dự phòng" (contingency) trong ngân sách sự kiện dùng để làm gì?', options: ['Trả lương thêm cho ban tổ chức', 'Dự trù cho chi phí phát sinh chưa lường tới', 'Là khoản lợi nhuận cố định', 'Chỉ áp dụng cho sự kiện ngoài trời'], correctIndex: 1, explanation: 'Contingency (thường 10-15% ngân sách) là khoản dự phòng cho phát sinh ngoài kế hoạch.' },
  { id: 'q3', question: 'Một bộ slide gọi tài trợ hiệu quả (theo Goldblatt) nên tập trung bán điều gì?', options: ['Chỉ nói sự kiện có quy mô lớn', 'Sự khớp giữa đối tượng sự kiện và câu chuyện thương hiệu của nhà tài trợ', 'Chỉ nói về giá tài trợ rẻ', 'Chỉ liệt kê logo các đối tác cũ'], correctIndex: 1, explanation: 'Pitch tài trợ bán sự phù hợp đối tượng/thương hiệu (audience match, brand fit), không chỉ quy mô.' },
]);

const c5 = doc('ste301-5-1-venue-logistics-operations', '5.1 — Venue, logistics & event operations|||5.1 — Địa điểm, hậu cần & vận hành sự kiện',
  'Tiêu chí chọn địa điểm (sức chứa, tiếp cận, kỹ thuật); sơ đồ mặt bằng & luồng di chuyển; hậu cần (F&B, AV, vận chuyển); vận hành ngày sự kiện.',
  [[
    `<span class="eyebrow">STE301 · Chapter 5 · Lesson 5.1</span>
<h2>Venue, logistics &amp; event operations</h2>
<h3>Choosing a venue</h3>
<ul>
<li><strong>Capacity &amp; layout</strong> — legal max occupancy, seating/standing configuration options, breakout space if needed.</li>
<li><strong>Accessibility</strong> — parking, public transit, disability access, load-in/load-out access for trucks and crew.</li>
<li><strong>Technical infrastructure</strong> — power supply (kVA rating for lighting/sound rigs), rigging points, internet/Wi-Fi capacity, backup power.</li>
<li><strong>Commercial terms</strong> — rental cost, deposit &amp; cancellation policy, exclusivity clauses (in-house catering only?), insurance requirements.</li>
</ul>
<h3>Floor plan &amp; flow</h3>
<p>Design attendee <strong>flow</strong> before decor: entry/registration → main space → amenities (restrooms, F&amp;B) → exit, avoiding bottlenecks at pinch points (a single narrow doorway serving 500 guests is a hazard, not just an inconvenience).</p>
<h3>Logistics checklist</h3>
<pre><code>Logistics work streams:
  F&B          catering contract, dietary options, service timing
  AV/technical sound, lighting, staging, live-stream feed
  Transport    guest shuttles, vendor delivery windows, parking plan
  Signage      wayfinding, registration desk, emergency exits marked
  Staffing     roles, shift schedule, briefing before doors open
</code></pre>
<h3>Day-of operations</h3>
<p>Operations on event day is the coordination layer: a <strong>site manager</strong> holds the master run-of-show and radio/chat channel open to every team lead, resolving conflicts (a vendor truck blocking the load-in dock, a speaker running long) in real time against the plan built in Chapter 3.</p>
<div class="callout"><span class="badge">Walk the site first</span> A site visit/venue walkthrough before signing catches problems a floor plan on paper never shows — a blocked loading dock, weak Wi-Fi in the exact spot the registration desk needs it.</div>`,
    `<span class="eyebrow">STE301 · Chương 5 · Bài 5.1</span>
<h2>Địa điểm, hậu cần &amp; vận hành sự kiện</h2>
<h3>Chọn địa điểm</h3>
<ul>
<li><strong>Sức chứa &amp; mặt bằng</strong> — số người tối đa theo luật, các cách bố trí ghế/đứng, không gian tách nhóm (breakout) nếu cần.</li>
<li><strong>Khả năng tiếp cận</strong> — bãi đỗ xe, giao thông công cộng, tiếp cận cho người khuyết tật, đường vào/ra cho xe tải và đội kỹ thuật lúc lắp dựng/tháo dỡ.</li>
<li><strong>Hạ tầng kỹ thuật</strong> — công suất điện (kVA cho hệ thống ánh sáng/âm thanh), điểm treo (rigging), dung lượng internet/Wi-Fi, nguồn điện dự phòng.</li>
<li><strong>Điều khoản thương mại</strong> — chi phí thuê, chính sách đặt cọc &amp; hủy, điều khoản độc quyền (chỉ dùng catering nội bộ?), yêu cầu bảo hiểm.</li>
</ul>
<h3>Sơ đồ mặt bằng &amp; luồng di chuyển</h3>
<p>Thiết kế <strong>luồng di chuyển</strong> của khách trước khi trang trí: cửa vào/đăng ký → không gian chính → tiện ích (nhà vệ sinh, F&amp;B) → cửa ra, tránh nghẽn tại các điểm hẹp (một cửa hẹp duy nhất phục vụ 500 khách là một nguy cơ, không chỉ là bất tiện).</p>
<h3>Checklist hậu cần</h3>
<pre><code>Các luồng công việc hậu cần:
  F&B          hợp đồng catering, tùy chọn ăn kiêng, thời điểm phục vụ
  AV/kỹ thuật  âm thanh, ánh sáng, dàn dựng, tín hiệu live-stream
  Vận chuyển   xe đưa khách, khung giờ giao hàng nhà cung cấp, bãi đỗ
  Bảng chỉ dẫn wayfinding, quầy đăng ký, lối thoát hiểm đánh dấu rõ
  Nhân sự      vai trò, ca làm, briefing trước khi mở cửa
</code></pre>
<h3>Vận hành trong ngày sự kiện</h3>
<p>Vận hành ngày sự kiện là lớp điều phối: một <strong>quản lý hiện trường (site manager)</strong> giữ bản run-of-show chủ và kênh radio/chat mở với mọi trưởng nhóm, xử lý xung đột (xe nhà cung cấp chặn cửa bốc hàng, diễn giả nói quá giờ) theo thời gian thực, đối chiếu với kế hoạch đã dựng ở Chương 3.</p>
<div class="callout"><span class="badge">Đi khảo sát trước</span> Một buổi khảo sát/đi thực địa trước khi ký hợp đồng phát hiện những vấn đề mà sơ đồ mặt bằng trên giấy không bao giờ cho thấy — cửa bốc hàng bị chặn, Wi-Fi yếu đúng ngay vị trí cần đặt quầy đăng ký.</div>`,
  ]]);

const c5q = quiz('ste301-quiz-5', 'Quiz 5 — Venue & logistics|||Quiz 5 — Địa điểm & hậu cần', [
  { id: 'q1', question: 'Vì sao nên đi khảo sát thực địa (site visit) trước khi ký hợp đồng thuê địa điểm?', options: ['Chỉ để chụp ảnh quảng cáo', 'Để phát hiện vấn đề mà sơ đồ mặt bằng trên giấy không thể hiện, vd cửa bốc hàng bị chặn', 'Vì luật bắt buộc', 'Không cần thiết nếu đã có bản vẽ CAD'], correctIndex: 1, explanation: 'Đi thực địa phát hiện vấn đề thực tế (Wi-Fi yếu, cửa bốc hàng bị chặn...) mà bản vẽ không thể hiện.' },
  { id: 'q2', question: 'Thiết kế "luồng di chuyển" (flow) của khách nên được làm khi nào?', options: ['Sau khi trang trí xong', 'Trước khi thiết kế trang trí, để tránh nghẽn tại điểm hẹp', 'Ngay trong lúc sự kiện diễn ra', 'Không cần thiết kế, khách tự tìm đường'], correctIndex: 1, explanation: 'Luồng di chuyển phải được thiết kế trước decor để tránh các điểm nghẽn nguy hiểm.' },
  { id: 'q3', question: 'Vai trò giữ bản run-of-show chủ và điều phối các trưởng nhóm trong ngày sự kiện là?', options: ['Nhà tài trợ chính', 'Quản lý hiện trường (site manager)', 'MC chương trình', 'Nhân viên bán vé'], correctIndex: 1, explanation: 'Site manager là người điều phối trung tâm, xử lý xung đột thời gian thực trong ngày sự kiện.' },
]);

const c6 = doc('ste301-6-1-marketing-communications', '6.1 — Event marketing & communications|||6.1 — Marketing & truyền thông sự kiện',
  'Kế hoạch marketing sự kiện (định vị, kênh, thời điểm); vòng đời truyền thông trước/trong/sau sự kiện; quan hệ báo chí (PR) & influencer.',
  [[
    `<span class="eyebrow">STE301 · Chapter 6 · Lesson 6.1</span>
<h2>Event marketing &amp; communications</h2>
<h3>Positioning before promotion</h3>
<p>Marketing starts from the concept (Chapter 2): who is the target audience, what makes this event worth attending over alternatives (a competing event, or simply staying home), and what single message should stick. Only then pick channels and copy.</p>
<h3>The three-phase communication timeline</h3>
<ul>
<li><strong>Pre-event</strong> — teaser announcements, early-bird ticket push, speaker/lineup reveals, sponsor co-marketing, email &amp; social campaigns building urgency toward the on-sale and the event date.</li>
<li><strong>During the event</strong> — live social coverage, hashtag activation, on-site press/photo ops, real-time updates for remote/hybrid audiences.</li>
<li><strong>Post-event</strong> — thank-you communications, highlight reels/photos, press coverage follow-up, and content repurposed to market <em>next</em> year's edition.</li>
</ul>
<h3>Channels &amp; tactics</h3>
<p>Combine <strong>owned</strong> (email list, website, app), <strong>earned</strong> (press coverage, word-of-mouth, PR) and <strong>paid</strong> (social ads, influencer partnerships, sponsor cross-promotion) channels. A <strong>press kit</strong> (fact sheet, photos, spokesperson quotes) makes it easy for journalists to cover the event with minimal friction.</p>
<div class="callout"><span class="badge">Message discipline</span> Every channel and every phase should reinforce the same one-sentence concept from Chapter 2 — inconsistent messaging (a "family fun day" teaser followed by a nightclub-style event page) erodes trust before doors even open.</div>`,
    `<span class="eyebrow">STE301 · Chương 6 · Bài 6.1</span>
<h2>Marketing &amp; truyền thông sự kiện</h2>
<h3>Định vị trước khi quảng bá</h3>
<p>Marketing bắt đầu từ ý tưởng (Chương 2): đối tượng mục tiêu là ai, điều gì làm sự kiện này đáng tham dự hơn các lựa chọn khác (một sự kiện đối thủ, hoặc đơn giản là ở nhà), và một thông điệp duy nhất nào cần đọng lại. Chỉ sau đó mới chọn kênh và viết nội dung.</p>
<h3>Timeline truyền thông ba giai đoạn</h3>
<ul>
<li><strong>Trước sự kiện</strong> — teaser, đẩy vé early-bird, công bố diễn giả/line-up, co-marketing với tài trợ, chiến dịch email &amp; social tạo cảm giác cấp bách hướng tới đợt mở bán và ngày diễn ra.</li>
<li><strong>Trong sự kiện</strong> — đưa tin trực tiếp trên mạng xã hội, kích hoạt hashtag, chụp ảnh/báo chí tại chỗ, cập nhật thời gian thực cho khán giả từ xa/hybrid.</li>
<li><strong>Sau sự kiện</strong> — lời cảm ơn, video/ảnh highlight, theo dõi tin bài báo chí, và nội dung được tái sử dụng để marketing cho phiên bản <em>năm sau</em>.</li>
</ul>
<h3>Kênh &amp; chiến thuật</h3>
<p>Kết hợp kênh <strong>sở hữu</strong> (danh sách email, website, app), <strong>kiếm được</strong> (tin bài báo chí, truyền miệng, PR) và <strong>trả phí</strong> (quảng cáo social, hợp tác influencer, đồng quảng bá với tài trợ). Một <strong>press kit</strong> (bản thông tin, ảnh, trích dẫn người phát ngôn) giúp nhà báo dễ dàng đưa tin về sự kiện với ít trở ngại nhất.</p>
<div class="callout"><span class="badge">Nhất quán thông điệp</span> Mọi kênh và mọi giai đoạn nên khẳng định lại đúng một câu ý tưởng từ Chương 2 — thông điệp không nhất quán (teaser "ngày vui gia đình" nhưng trang sự kiện lại phong cách club đêm) làm mất niềm tin trước khi mở cửa.</div>`,
  ]]);

const c6q = quiz('ste301-quiz-6', 'Quiz 6 — Marketing & communications|||Quiz 6 — Marketing & truyền thông', [
  { id: 'q1', question: 'Marketing sự kiện nên bắt đầu từ đâu?', options: ['Chọn kênh quảng cáo trước tiên', 'Ý tưởng/concept và đối tượng mục tiêu của sự kiện', 'Ngân sách quảng cáo tối đa', 'Ngày diễn ra sự kiện'], correctIndex: 1, explanation: 'Định vị (dựa trên concept & đối tượng) phải có trước khi chọn kênh và viết nội dung.' },
  { id: 'q2', question: 'Hoạt động "kích hoạt hashtag, đưa tin trực tiếp trên social" thuộc giai đoạn truyền thông nào?', options: ['Trước sự kiện', 'Trong sự kiện', 'Sau sự kiện', 'Không thuộc giai đoạn nào'], correctIndex: 1, explanation: 'Đây là hoạt động truyền thông "trong sự kiện" (during the event).' },
  { id: 'q3', question: 'Tin bài báo chí do nhà báo viết về sự kiện (không phải trả tiền quảng cáo) thuộc loại kênh nào?', options: ['Kênh sở hữu (owned)', 'Kênh kiếm được (earned)', 'Kênh trả phí (paid)', 'Không phải kênh marketing'], correctIndex: 1, explanation: 'Tin bài báo chí, truyền miệng, PR là kênh "earned" — kiếm được nhờ uy tín/nội dung, không trả tiền trực tiếp.' },
]);

const c7 = doc('ste301-7-1-risk-safety-legal', '7.1 — Event risk management, safety & legal|||7.1 — Quản trị rủi ro, an toàn & pháp lý sự kiện',
  'Sổ rủi ro (nhận diện, đánh giá, giảm nhẹ); an toàn & sức chứa đám đông; hợp đồng, giấy phép & bảo hiểm sự kiện.',
  [[
    `<span class="eyebrow">STE301 · Chapter 7 · Lesson 7.1</span>
<h2>Event risk management, safety &amp; legal</h2>
<h3>The risk register</h3>
<p>List every plausible risk, then score each on <strong>likelihood</strong> and <strong>impact</strong> to prioritize response: weather (outdoor event), talent/speaker cancellation, low ticket sales, crowd crush at a pinch point, power/AV failure, food safety incident, protest/disruption. For each, define a <strong>mitigation</strong> (reduce likelihood/impact) and a <strong>contingency</strong> (what happens if it occurs anyway).</p>
<pre><code>Risk register (excerpt):
 Risk               Likelihood  Impact   Mitigation
 Speaker no-show     Medium      High     Backup speaker on standby
 Bad weather (outdoor) High      High     Tented backup area, refund policy
 Overcrowding at entry Medium     High     Stagger entry, extra staff/signage
</code></pre>
<h3>Safety &amp; crowd management</h3>
<p>Respect the venue's <strong>legal maximum occupancy</strong>; plan clear <strong>emergency egress</strong> routes and a visible <strong>first-aid</strong> station; brief security/staff on crowd-density warning signs before a crush happens, not after.</p>
<h3>Legal &amp; contracts</h3>
<ul>
<li><strong>Permits</strong> — local authority approval for public gatherings, noise ordinances, alcohol licensing where applicable.</li>
<li><strong>Contracts</strong> — vendor/venue contracts should specify deliverables, payment schedule, cancellation terms and liability.</li>
<li><strong>Insurance</strong> — public liability insurance covers third-party injury/property damage; event cancellation insurance covers financial loss from a forced cancellation (weather, force majeure).</li>
</ul>
<div class="callout"><span class="badge">Plan for the worst case first</span> Van der Wagen's core lesson: risk planning is not pessimism, it is what lets an event proceed confidently — an unplanned crisis costs far more than the hour spent drafting a risk register.</div>`,
    `<span class="eyebrow">STE301 · Chương 7 · Bài 7.1</span>
<h2>Quản trị rủi ro, an toàn &amp; pháp lý sự kiện</h2>
<h3>Sổ rủi ro (risk register)</h3>
<p>Liệt kê mọi rủi ro có thể xảy ra, rồi chấm điểm mỗi rủi ro theo <strong>khả năng xảy ra</strong> và <strong>mức độ ảnh hưởng</strong> để ưu tiên xử lý: thời tiết (sự kiện ngoài trời), diễn giả/nghệ sĩ hủy show, bán vé chậm, chen lấn tại điểm hẹp, mất điện/hỏng thiết bị AV, sự cố an toàn thực phẩm, biểu tình/gây rối. Với mỗi rủi ro, xác định <strong>giảm nhẹ</strong> (giảm khả năng xảy ra/ảnh hưởng) và <strong>dự phòng</strong> (làm gì nếu vẫn xảy ra).</p>
<pre><code>Sổ rủi ro (trích):
 Rủi ro                Khả năng   Ảnh hưởng  Giảm nhẹ
 Diễn giả hủy show      Trung bình  Cao        Diễn giả dự phòng sẵn sàng
 Thời tiết xấu (ngoài trời) Cao       Cao        Khu vực có lều dự phòng, chính sách hoàn tiền
 Chen lấn tại cửa vào    Trung bình  Cao        Vào cửa theo đợt, thêm nhân sự/bảng chỉ dẫn
</code></pre>
<h3>An toàn &amp; quản lý đám đông</h3>
<p>Tôn trọng <strong>sức chứa tối đa theo luật</strong> của địa điểm; lập tuyến <strong>thoát hiểm khẩn cấp</strong> rõ ràng và trạm <strong>cấp cứu</strong> dễ thấy; briefing an ninh/nhân sự về dấu hiệu cảnh báo mật độ đám đông trước khi xảy ra chen lấn, không phải sau.</p>
<h3>Pháp lý &amp; hợp đồng</h3>
<ul>
<li><strong>Giấy phép</strong> — chấp thuận của cơ quan địa phương cho tập trung công cộng, quy định về tiếng ồn, cấp phép bán rượu nếu có.</li>
<li><strong>Hợp đồng</strong> — hợp đồng với nhà cung cấp/địa điểm cần nêu rõ hạng mục giao, tiến độ thanh toán, điều khoản hủy và trách nhiệm pháp lý.</li>
<li><strong>Bảo hiểm</strong> — bảo hiểm trách nhiệm công cộng bao gồm thương tích/thiệt hại tài sản của bên thứ ba; bảo hiểm hủy sự kiện bao gồm tổn thất tài chính khi buộc phải hủy (thời tiết, bất khả kháng).</li>
</ul>
<div class="callout"><span class="badge">Lập kế hoạch cho tình huống xấu nhất trước</span> Bài học cốt lõi của Van der Wagen: lập kế hoạch rủi ro không phải bi quan, đó là điều giúp sự kiện được triển khai tự tin — một khủng hoảng không lường trước tốn kém hơn rất nhiều so với thời gian soạn một sổ rủi ro.</div>`,
  ]]);

const c7q = quiz('ste301-quiz-7', 'Quiz 7 — Risk, safety & legal|||Quiz 7 — Rủi ro, an toàn & pháp lý', [
  { id: 'q1', question: 'Trong sổ rủi ro, mỗi rủi ro nên được chấm điểm theo hai yếu tố nào?', options: ['Giá cả và màu sắc', 'Khả năng xảy ra và mức độ ảnh hưởng', 'Số lượng nhân viên và ngân sách', 'Thời gian và địa điểm'], correctIndex: 1, explanation: 'Risk register chấm điểm theo likelihood (khả năng xảy ra) và impact (ảnh hưởng) để ưu tiên xử lý.' },
  { id: 'q2', question: 'Loại bảo hiểm nào bao gồm tổn thất tài chính khi sự kiện buộc phải hủy do thời tiết/bất khả kháng?', options: ['Bảo hiểm trách nhiệm công cộng', 'Bảo hiểm hủy sự kiện (event cancellation insurance)', 'Bảo hiểm xe cộ', 'Bảo hiểm y tế nhân viên'], correctIndex: 1, explanation: 'Event cancellation insurance bảo vệ tổn thất tài chính khi sự kiện bị hủy vì lý do bất khả kháng.' },
  { id: 'q3', question: 'Vì sao cần briefing nhân sự/an ninh về dấu hiệu cảnh báo mật độ đám đông TRƯỚC sự kiện?', options: ['Chỉ để tuân thủ thủ tục hành chính', 'Để phát hiện và xử lý nguy cơ chen lấn trước khi nó thực sự xảy ra', 'Không cần thiết nếu venue nhỏ', 'Chỉ áp dụng cho sự kiện ngoài trời'], correctIndex: 1, explanation: 'Briefing trước giúp nhân sự nhận diện sớm dấu hiệu nguy hiểm và can thiệp trước khi xảy ra sự cố.' },
]);

const c8 = doc('ste301-8-1-evaluation-roi-sustainability-tech', '8.1 — Event evaluation, ROI, sustainable events & technology|||8.1 — Đánh giá sự kiện, ROI, sự kiện bền vững & công nghệ (hybrid/virtual)',
  'Đánh giá sau sự kiện & KPI; tính ROI/ROO; thực hành sự kiện bền vững; công nghệ sự kiện & mô hình hybrid/virtual.',
  [[
    `<span class="eyebrow">STE301 · Chapter 8 · Lesson 8.1</span>
<h2>Event evaluation, ROI, sustainable events &amp; technology</h2>
<h3>Post-event evaluation</h3>
<p>Evaluation closes the loop back to the SMART objectives set in Chapter 2. Gather <strong>quantitative</strong> data (attendance vs. target, revenue vs. budget, survey scores, social reach/engagement) and <strong>qualitative</strong> data (attendee feedback, staff debrief, sponsor satisfaction) within days of the event, while memory is fresh.</p>
<h3>ROI vs. ROO</h3>
<p><strong>ROI (Return on Investment)</strong> is financial: (revenue − cost) / cost — straightforward when the objective was ticket/sponsorship revenue. Many events, though, chase objectives that aren't purely financial (brand awareness, community goodwill, employee morale); for these, Goldblatt's <strong>ROO (Return on Objectives)</strong> measures whether the SMART objective itself was met, independent of a dollar figure.</p>
<pre><code>ROI example:
 Total cost .............. 168,000,000 VND
 Ticket + sponsor revenue . 210,000,000 VND
 ROI = (210M - 168M) / 168M = +25%
</code></pre>
<h3>Sustainable events</h3>
<p>Sustainability spans <strong>environmental</strong> (waste/recycling plans, reusable signage, local sourcing for catering, digital instead of printed materials), <strong>social</strong> (accessibility, fair vendor/staff treatment) and <strong>economic</strong> (supporting local suppliers) dimensions — increasingly a sponsor and venue requirement, not just goodwill.</p>
<h3>Event technology &amp; hybrid/virtual</h3>
<p>Modern events layer technology across every chapter: registration/ticketing platforms, RFID/QR check-in, live-streaming and <strong>hybrid events</strong> (a physical audience plus a remote one watching/interacting via a virtual platform), and post-event analytics dashboards. Hybrid/virtual formats extend reach and provide richer engagement data, but add their own logistics and technical-risk line to the Chapter 7 risk register (stream failure, platform downtime).</p>
<div class="callout"><span class="badge">Close the loop</span> A written evaluation report — objectives vs. results, ROI/ROO, lessons learned — is what turns "we ran an event" into organizational knowledge that makes next year's event better and easier to fund.</div>`,
    `<span class="eyebrow">STE301 · Chương 8 · Bài 8.1</span>
<h2>Đánh giá sự kiện, ROI, sự kiện bền vững &amp; công nghệ</h2>
<h3>Đánh giá sau sự kiện</h3>
<p>Đánh giá khép lại vòng lặp, đối chiếu về mục tiêu SMART đã đặt ở Chương 2. Thu thập dữ liệu <strong>định lượng</strong> (số khách so với mục tiêu, doanh thu so với ngân sách, điểm khảo sát, độ tiếp cận/tương tác trên social) và dữ liệu <strong>định tính</strong> (phản hồi người tham dự, họp rút kinh nghiệm nhân sự, mức hài lòng của tài trợ) trong vài ngày sau sự kiện, khi ký ức còn mới.</p>
<h3>ROI vs. ROO</h3>
<p><strong>ROI (Return on Investment)</strong> mang tính tài chính: (doanh thu − chi phí) / chi phí — dễ tính khi mục tiêu là doanh thu bán vé/tài trợ. Tuy nhiên nhiều sự kiện theo đuổi mục tiêu không hoàn toàn tài chính (nhận diện thương hiệu, thiện cảm cộng đồng, tinh thần nhân viên); với các trường hợp này, <strong>ROO (Return on Objectives)</strong> của Goldblatt đo việc mục tiêu SMART có đạt được hay không, độc lập với con số tiền.</p>
<pre><code>Ví dụ tính ROI:
 Tổng chi phí ................. 168.000.000 VND
 Doanh thu vé + tài trợ ........ 210.000.000 VND
 ROI = (210 triệu - 168 triệu) / 168 triệu = +25%
</code></pre>
<h3>Sự kiện bền vững</h3>
<p>Bền vững trải qua ba khía cạnh: <strong>môi trường</strong> (kế hoạch rác/tái chế, bảng hiệu tái sử dụng, nguồn thực phẩm địa phương, tài liệu số thay thay cho in ấn), <strong>xã hội</strong> (khả năng tiếp cận, đối xử công bằng với nhà cung cấp/nhân sự) và <strong>kinh tế</strong> (ủng hộ nhà cung cấp địa phương) — ngày càng là yêu cầu từ tài trợ và địa điểm, không chỉ là thiện chí.</p>
<h3>Công nghệ sự kiện &amp; hybrid/virtual</h3>
<p>Sự kiện hiện đại lồng công nghệ vào mọi chương: nền tảng đăng ký/bán vé, check-in bằng RFID/QR, live-stream và <strong>sự kiện hybrid</strong> (khán giả trực tiếp cộng thêm khán giả từ xa xem/tương tác qua nền tảng ảo), và bảng phân tích dữ liệu sau sự kiện. Định dạng hybrid/virtual mở rộng độ tiếp cận và cho dữ liệu tương tác phong phú hơn, nhưng thêm chính hậu cần và dòng rủi ro kỹ thuật riêng vào sổ rủi ro ở Chương 7 (sự cố stream, nền tảng bị downtime).</p>
<div class="callout"><span class="badge">Khép vòng lặp</span> Một báo cáo đánh giá bằng văn bản — mục tiêu so với kết quả, ROI/ROO, bài học rút ra — là điều biến "chúng ta đã tổ chức một sự kiện" thành kiến thức tổ chức giúp sự kiện năm sau tốt hơn và dễ gọi vốn hơn.</div>`,
  ]]);

const c8q = quiz('ste301-quiz-8', 'Quiz 8 — Evaluation, ROI, sustainability & tech|||Quiz 8 — Đánh giá, ROI, bền vững & công nghệ', [
  { id: 'q1', question: 'ROI của một sự kiện được tính như thế nào?', options: ['Doanh thu × chi phí', '(Doanh thu − chi phí) / chi phí', 'Số khách tham dự / ngân sách', 'Chi phí − doanh thu'], correctIndex: 1, explanation: 'ROI = (doanh thu - chi phí) / chi phí, biểu diễn dưới dạng tỉ lệ phần trăm.' },
  { id: 'q2', question: 'ROO (Return on Objectives) của Goldblatt được dùng khi nào?', options: ['Khi mục tiêu sự kiện thuần tài chính', 'Khi mục tiêu sự kiện không hoàn toàn tài chính, vd nhận diện thương hiệu, thiện cảm cộng đồng', 'Chỉ dùng cho sự kiện thể thao', 'Không bao giờ cần dùng nếu đã có ROI'], correctIndex: 1, explanation: 'ROO đo việc đạt mục tiêu SMART, phù hợp khi mục tiêu không quy đổi trực tiếp ra tiền.' },
  { id: 'q3', question: 'Sự kiện "hybrid" là gì?', options: ['Sự kiện chỉ diễn ra online', 'Sự kiện chỉ diễn ra trực tiếp, không công nghệ', 'Sự kiện có khán giả trực tiếp và khán giả từ xa cùng tham gia qua nền tảng ảo', 'Sự kiện không cần đánh giá sau khi kết thúc'], correctIndex: 2, explanation: 'Hybrid event kết hợp khán giả tại chỗ và khán giả từ xa theo dõi/tương tác qua nền tảng trực tuyến.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'STE301',
    slug: 'ste301-strategic-event-and-entertainment-management',
    title: 'Strategic Event and Entertainment Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/STE301.webp',
    shortDescription: 'Event & entertainment industry, classification, strategic planning, concept/theme, project timelines, budgeting & sponsorship, venue/logistics, marketing, risk & legal, evaluation/ROI, sustainable & hybrid events. Bilingual, with quizzes.|||Ngành sự kiện & giải trí, phân loại, lập kế hoạch chiến lược, ý tưởng/chủ đề, timeline dự án, ngân sách & tài trợ, địa điểm/hậu cần, marketing, rủi ro & pháp lý, đánh giá/ROI, sự kiện bền vững & hybrid. Song ngữ, có quiz.',
    description: 'Môn <strong>STE301 — Strategic Event and Entertainment Management</strong> (kỳ 5) dạy quản trị một sự kiện như một dự án kinh doanh chiến lược. Từ <strong>tổng quan ngành &amp; phân loại sự kiện</strong> → <strong>lập kế hoạch chiến lược &amp; ý tưởng/chủ đề</strong> → <strong>quản lý dự án &amp; timeline</strong> → <strong>ngân sách, tài trợ &amp; doanh thu</strong> → <strong>địa điểm, hậu cần &amp; vận hành</strong> → <strong>marketing &amp; truyền thông</strong> → <strong>rủi ro, an toàn &amp; pháp lý</strong> → <strong>đánh giá, ROI, bền vững &amp; công nghệ (hybrid/virtual)</strong>. Tham khảo Van der Wagen &amp; Goldblatt, song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Phân loại sự kiện (mega/hallmark/major/local) & bên liên quan; vòng lập kế hoạch chiến lược, mục tiêu SMART, SWOT; concept & theme (Goldblatt); WBS, Gantt, đường tới hạn, run-of-show; ngân sách cố định/biến đổi, điểm hoà vốn, cấp độ tài trợ; chọn địa điểm, sơ đồ mặt bằng, hậu cần; marketing 3 giai đoạn, kênh owned/earned/paid; sổ rủi ro, an toàn đám đông, hợp đồng/giấy phép/bảo hiểm; ROI vs ROO, sự kiện bền vững, công nghệ & hybrid/virtual event.',
    requirements: 'Không yêu cầu kiến thức chuyên sâu; nên đã quen khái niệm quản trị dự án & marketing cơ bản (các môn quản trị kinh doanh trước đó).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình tham khảo (Van der Wagen, Goldblatt), tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Sự kiện chiến lược là gì, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan ngành & phân loại|||Chapter 1 — Industry & classification', description: 'MICE, thể thao, văn hoá, giải trí; phân loại sự kiện; bên liên quan.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Lập kế hoạch chiến lược & ý tưởng|||Chapter 2 — Strategic planning & concept', description: 'SMART, SWOT, concept & theme.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quản lý dự án & timeline|||Chapter 3 — Project management & timeline', description: 'WBS, T-minus, Gantt, đường tới hạn, run-of-show.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ngân sách & tài trợ|||Chapter 4 — Budget & sponsorship', description: 'Chi phí cố định/biến đổi, nguồn doanh thu, cấp độ tài trợ, điểm hoà vốn.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Địa điểm & hậu cần|||Chapter 5 — Venue & logistics', description: 'Chọn địa điểm, sơ đồ mặt bằng, hậu cần, vận hành ngày sự kiện.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Marketing & truyền thông|||Chapter 6 — Marketing & communications', description: 'Định vị, timeline truyền thông 3 giai đoạn, kênh & PR.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Rủi ro, an toàn & pháp lý|||Chapter 7 — Risk, safety & legal', description: 'Sổ rủi ro, quản lý đám đông, hợp đồng, giấy phép, bảo hiểm.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đánh giá, ROI, bền vững & công nghệ|||Chapter 8 — Evaluation, ROI, sustainability & tech', description: 'ROI vs ROO, sự kiện bền vững, công nghệ & hybrid/virtual.', lessons: [c8, c8q] },
  ],
};
