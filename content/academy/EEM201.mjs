/**
 * EEM201 — Introduction to Entertainment and Event Management. Giáo trình
 * (trích dẫn, không upload PDF): "Event Management" (Bowdin/Allen/O'Toole),
 * "Special Events" (Goldblatt), "The Entertainment Industry" (Vogel). Khối
 * Quản trị Kinh doanh (BBA), kỳ 2. Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('eem201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Giáo trình & slide trên FLM, sách tham khảo, tài liệu chính thức, YouTube, công cụ, lộ trình.',
  [[
    `<span class="eyebrow">EEM201 · Materials</span>
<h2>Course materials &amp; references</h2>
<p class="lead">Everything to study <strong>Entertainment &amp; Event Management</strong> — event types, stakeholders, planning, budgeting &amp; sponsorship, marketing, operations, risk and evaluation — gathered in one place. The official FPTU syllabus and slides live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Syllabus &amp; textbooks (citation only — not uploaded)</h3>
<ul>
<li><em>Event Management</em> — Glenn Bowdin, Johnny Allen, William O'Toole, Rob Harris, Ian McDonnell (core reference for planning &amp; operations)</li>
<li><em>Special Events</em> — Joe Goldblatt (core reference for design, stakeholders &amp; risk)</li>
<li><em>The Entertainment Industry: Economics — A Guide for Financial Analysis</em> — Harold L. Vogel (core reference for the economics of entertainment)</li>
</ul>
<h3>🌐 Free / official resources</h3>
<ul>
<li><a href="https://www.eventindustrynews.com/" target="_blank" rel="noopener">Event Industry News</a> — industry news &amp; case studies</li>
<li><a href="https://www.meetingsnet.com/" target="_blank" rel="noopener">MeetingsNet</a> — event planning guides</li>
<li><a href="https://www.eventbrite.com/blog/" target="_blank" rel="noopener">Eventbrite Organizer Blog</a> — practical planning &amp; marketing checklists</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@BizBash" target="_blank" rel="noopener">BizBash</a> — event design &amp; production trends</li>
<li><a href="https://www.youtube.com/@EventManagerBlog" target="_blank" rel="noopener">Event Manager Blog</a> — planning tips &amp; interviews</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.eventbrite.com/" target="_blank" rel="noopener">Eventbrite</a> — ticketing &amp; registration</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — event branding &amp; run-sheets</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — planning timeline &amp; task boards</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — industry overview, event types, stakeholder roles, the planning process.</li>
<li><strong>Practice</strong> — draft a run sheet and a budget for a small mock event.</li>
<li><strong>Go deeper</strong> — sponsorship proposals, marketing plans, risk registers.</li>
<li><strong>Job-ready</strong> — read post-event evaluation reports and industry trend articles.</li>
</ol></div>`,
    `<span class="eyebrow">EEM201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quản trị Giải trí &amp; Sự kiện</strong> — loại hình sự kiện, các bên liên quan, lập kế hoạch, ngân sách &amp; tài trợ, marketing, vận hành và rủi ro — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; sách tham khảo (chỉ trích dẫn — không upload)</h3>
<ul>
<li><em>Event Management</em> — Glenn Bowdin, Johnny Allen, William O'Toole, Rob Harris, Ian McDonnell (nguồn chính cho lập kế hoạch &amp; vận hành)</li>
<li><em>Special Events</em> — Joe Goldblatt (nguồn chính cho thiết kế, các bên liên quan &amp; rủi ro)</li>
<li><em>The Entertainment Industry: Economics — A Guide for Financial Analysis</em> — Harold L. Vogel (nguồn chính cho kinh tế học ngành giải trí)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.eventindustrynews.com/" target="_blank" rel="noopener">Event Industry News</a> — tin ngành &amp; case study</li>
<li><a href="https://www.meetingsnet.com/" target="_blank" rel="noopener">MeetingsNet</a> — hướng dẫn lập kế hoạch sự kiện</li>
<li><a href="https://www.eventbrite.com/blog/" target="_blank" rel="noopener">Eventbrite Organizer Blog</a> — checklist lập kế hoạch &amp; marketing thực tế</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BizBash" target="_blank" rel="noopener">BizBash</a> — thiết kế sự kiện &amp; xu hướng sản xuất</li>
<li><a href="https://www.youtube.com/@EventManagerBlog" target="_blank" rel="noopener">Event Manager Blog</a> — mẹo lập kế hoạch &amp; phỏng vấn</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.eventbrite.com/" target="_blank" rel="noopener">Eventbrite</a> — bán vé &amp; đăng ký</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — nhận diện sự kiện &amp; run sheet</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — lịch trình lập kế hoạch &amp; bảng công việc</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — tổng quan ngành, loại hình sự kiện, vai trò các bên, quy trình lập kế hoạch.</li>
<li><strong>Luyện tập</strong> — soạn một run sheet và ngân sách cho một sự kiện giả định nhỏ.</li>
<li><strong>Đào sâu thực tế</strong> — đề xuất tài trợ, kế hoạch marketing, sổ rủi ro.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc báo cáo đánh giá sau sự kiện và bài viết xu hướng ngành.</li>
</ol></div>`,
  ]]);

const intro = doc('eem201-0-1-overview', 'Course overview: Entertainment & Event Management|||Tổng quan: Quản trị Giải trí & Sự kiện',
  'Ngành giải trí & sự kiện; kinh tế trải nghiệm; lộ trình 8 chương của môn.',
  [[
    `<span class="eyebrow">EEM201 · Lesson 0.1 · Overview</span>
<h2>Introduction to Entertainment &amp; Event Management</h2>
<p class="lead">This course introduces the <strong>entertainment &amp; event industry</strong> — one of the fastest-growing sectors of the experience economy. You'll learn to recognize event types, identify who does what in an event team, follow a structured planning process, budget realistically (including sponsorship), promote an event, run it safely, and evaluate whether it worked.</p>
<h3>Why events matter</h3>
<p>Events create memorable, temporary experiences — weddings, concerts, conferences, festivals, sports tournaments — that generate revenue, build brands and bring communities together. The global events industry spans corporate meetings, live entertainment, festivals and sport, and keeps growing as consumers pay for experiences, not just products.</p>
<h3>Roadmap</h3>
<p>Industry overview → event types → stakeholders &amp; roles → planning process → budgeting &amp; sponsorship → marketing &amp; communications → operations, logistics &amp; risk → evaluation, trends &amp; careers.</p>`,
    `<span class="eyebrow">EEM201 · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn Quản trị Giải trí &amp; Sự kiện</h2>
<p class="lead">Môn này giới thiệu <strong>ngành giải trí &amp; sự kiện</strong> — một trong những khu vực tăng trưởng nhanh nhất của kinh tế trải nghiệm. Bạn sẽ học nhận diện các loại hình sự kiện, xác định ai làm gì trong nhóm sự kiện, theo một quy trình lập kế hoạch có cấu trúc, dự toán ngân sách thực tế (kể cả tài trợ), truyền thông cho sự kiện, vận hành an toàn, và đánh giá xem nó có thành công không.</p>
<h3>Vì sao sự kiện quan trọng</h3>
<p>Sự kiện tạo ra trải nghiệm đáng nhớ, có tính tạm thời — đám cưới, hoà nhạc, hội nghị, lễ hội, giải thể thao — mang lại doanh thu, xây thương hiệu và kết nối cộng đồng. Ngành sự kiện toàn cầu bao trùm hội họp doanh nghiệp, giải trí trực tiếp, lễ hội và thể thao, và tiếp tục tăng trưởng khi người tiêu dùng trả tiền cho trải nghiệm, không chỉ sản phẩm.</p>
<h3>Lộ trình</h3>
<p>Tổng quan ngành → các loại hình sự kiện → các bên liên quan &amp; vai trò → quy trình lập kế hoạch → ngân sách &amp; tài trợ → marketing &amp; truyền thông → vận hành, hậu cần &amp; rủi ro → đánh giá, xu hướng &amp; sự nghiệp.</p>`,
  ]]);

const c1 = doc('eem201-1-1-overview', '1.1 — The entertainment & events industry|||1.1 — Ngành giải trí & sự kiện',
  'Định nghĩa sự kiện, kinh tế trải nghiệm, các phân khúc ngành (MICE, lễ hội, thể thao, giải trí trực tiếp).',
  [[
    `<span class="eyebrow">EEM201 · Chapter 1 · Lesson 1.1</span>
<h2>The entertainment &amp; events industry</h2>
<h3>What counts as an "event"?</h3>
<p>An <strong>event</strong> is a temporary, planned gathering with a specific purpose — celebration (wedding, festival), business (conference, product launch), competition (sports tournament) or cause (charity gala). Goldblatt defines special events as occasions marked by <strong>ceremony and ritual</strong> to satisfy specific needs.</p>
<h3>The experience economy</h3>
<p>Pine &amp; Gilmore's idea, used throughout event literature: as commodities and goods become common, people pay a premium for <strong>staged experiences</strong> — a concert, a themed festival, an immersive brand activation. Entertainment (Vogel) and events (Bowdin/Goldblatt) are two branches of the same economy: both sell an experience, not a physical product.</p>
<h3>Industry segments</h3>
<ul>
<li><strong>Live entertainment</strong> — concerts, theatre, comedy, theme parks.</li>
<li><strong>MICE</strong> — Meetings, Incentives, Conferences, Exhibitions (the corporate/business events segment).</li>
<li><strong>Festivals &amp; cultural events</strong> — music festivals, food festivals, heritage celebrations.</li>
<li><strong>Sport events</strong> — from local tournaments to the Olympics.</li>
<li><strong>Social &amp; life-cycle events</strong> — weddings, anniversaries, reunions.</li>
</ul>
<h3>Why the industry keeps growing</h3>
<ul>
<li>Rising disposable income and demand for experiences over goods.</li>
<li>Cities and governments use events for tourism &amp; place branding (destination events).</li>
<li>Brands use live events and sponsorship to reach audiences that ignore traditional ads.</li>
<li>Digital &amp; hybrid formats (livestreamed events) expanded reach after 2020.</li>
</ul>
<pre><code>Event vs. entertainment vs. MICE — quick map:
 Event         = any planned gathering with a purpose
 Entertainment = a SEGMENT of events (concerts, shows, theme parks) sold as leisure content
 MICE          = a SEGMENT of events that is business-driven (meetings, conferences, exhibitions)
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Every event, regardless of segment, is judged on the same core: did it deliver the intended experience, safely, within budget, to the target audience?</div>`,
    `<span class="eyebrow">EEM201 · Chương 1 · Bài 1.1</span>
<h2>Ngành giải trí &amp; sự kiện</h2>
<h3>"Sự kiện" là gì?</h3>
<p>Một <strong>sự kiện</strong> là một cuộc tập hợp có kế hoạch, tạm thời, với mục đích cụ thể — lễ kỷ niệm (đám cưới, lễ hội), kinh doanh (hội nghị, ra mắt sản phẩm), thi đấu (giải thể thao) hoặc từ thiện (gala gây quỹ). Goldblatt định nghĩa sự kiện đặc biệt (special event) là những dịp được đánh dấu bởi <strong>nghi lễ và lễ thức</strong> nhằm đáp ứng những nhu cầu cụ thể.</p>
<h3>Kinh tế trải nghiệm</h3>
<p>Ý tưởng của Pine &amp; Gilmore, được dùng xuyên suốt tài liệu ngành sự kiện: khi hàng hoá và dịch vụ trở nên phổ biến, người ta trả giá cao hơn cho những <strong>trải nghiệm được dàn dựng</strong> — một buổi hoà nhạc, một lễ hội theo chủ đề, một hoạt động thương hiệu nhập vai. Giải trí (Vogel) và sự kiện (Bowdin/Goldblatt) là hai nhánh của cùng một nền kinh tế: cả hai đều bán trải nghiệm, không phải sản phẩm vật lý.</p>
<h3>Các phân khúc ngành</h3>
<ul>
<li><strong>Giải trí trực tiếp</strong> — hoà nhạc, sân khấu, hài kịch, công viên chủ đề.</li>
<li><strong>MICE</strong> — Meetings, Incentives, Conferences, Exhibitions (phân khúc sự kiện doanh nghiệp/kinh doanh).</li>
<li><strong>Lễ hội &amp; sự kiện văn hoá</strong> — lễ hội âm nhạc, lễ hội ẩm thực, lễ hội truyền thống.</li>
<li><strong>Sự kiện thể thao</strong> — từ giải đấu địa phương đến Olympic.</li>
<li><strong>Sự kiện xã hội &amp; đời sống</strong> — đám cưới, kỷ niệm, họp mặt.</li>
</ul>
<h3>Vì sao ngành này liên tục tăng trưởng</h3>
<ul>
<li>Thu nhập khả dụng tăng và nhu cầu trải nghiệm thay cho hàng hoá.</li>
<li>Thành phố &amp; chính quyền dùng sự kiện để phát triển du lịch &amp; xây thương hiệu điểm đến.</li>
<li>Thương hiệu dùng sự kiện trực tiếp &amp; tài trợ để tiếp cận khán giả đã bỏ qua quảng cáo truyền thống.</li>
<li>Định dạng số &amp; hybrid (sự kiện livestream) mở rộng phạm vi tiếp cận sau 2020.</li>
</ul>
<pre><code>Sự kiện vs. giải trí vs. MICE — bản đồ nhanh:
 Sự kiện   = mọi cuộc tập hợp có kế hoạch, có mục đích
 Giải trí  = MỘT PHÂN KHÚC của sự kiện (hoà nhạc, show, công viên chủ đề), bán như nội dung giải trí
 MICE      = MỘT PHÂN KHÚC của sự kiện, do kinh doanh dẫn dắt (hội họp, hội nghị, triển lãm)
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Mọi sự kiện, bất kể phân khúc, đều được đánh giá trên cùng một tiêu chí gốc: nó có mang lại trải nghiệm như dự định, an toàn, đúng ngân sách, đến đúng đối tượng không?</div>`,
  ]]);

const c1q = quiz('eem201-quiz-1', 'Quiz 1 — Industry overview|||Quiz 1 — Tổng quan ngành', [
  { id: 'q1', question: 'Ngành sự kiện thuộc khối kinh tế nào theo Pine & Gilmore?', options: ['Kinh tế hàng hoá', 'Kinh tế dịch vụ', 'Kinh tế trải nghiệm', 'Kinh tế nông nghiệp'], correctIndex: 2, explanation: 'Pine & Gilmore: khi hàng hoá/dịch vụ phổ biến, người ta trả giá cao cho trải nghiệm được dàn dựng — sự kiện thuộc kinh tế trải nghiệm.' },
  { id: 'q2', question: 'MICE là viết tắt của?', options: ['Music, Idol, Concert, Event', 'Meetings, Incentives, Conferences, Exhibitions', 'Media, Industry, Culture, Entertainment', 'Marketing, Insurance, Catering, Events'], correctIndex: 1, explanation: 'MICE là phân khúc sự kiện doanh nghiệp: hội họp, khen thưởng, hội nghị, triển lãm.' },
  { id: 'q3', question: 'Theo Goldblatt, sự kiện đặc biệt (special event) được đánh dấu bởi điều gì?', options: ['Giá vé cao', 'Nghi lễ và lễ thức đáp ứng nhu cầu cụ thể', 'Luôn diễn ra ngoài trời', 'Chỉ dành cho doanh nghiệp'], correctIndex: 1, explanation: 'Định nghĩa của Goldblatt tập trung vào ceremony & ritual — nghi lễ và lễ thức phục vụ một mục đích cụ thể.' },
]);

const c2 = doc('eem201-2-1-types', '2.1 — Types of events|||2.1 — Các loại hình sự kiện',
  'Sự kiện doanh nghiệp, lễ hội, thể thao, văn hoá/xã hội — mục tiêu và nguồn thu khác nhau thế nào.',
  [[
    `<span class="eyebrow">EEM201 · Chapter 2 · Lesson 2.1</span>
<h2>Types of events</h2>
<h3>Corporate events</h3>
<p>Organized by/for a business: conferences, seminars, product launches, trade shows, incentive trips, annual meetings, team-building. Goal: business outcomes — sales, networking, training, brand image. Budget usually comes from a marketing/HR line, and success is measured in leads, attendance, or employee engagement.</p>
<h3>Festivals</h3>
<p>Recurring, theme-based celebrations open to the public — music festivals, food festivals, film festivals, heritage/cultural festivals. Often multi-day, multi-stage/multi-venue, funded by ticketing, sponsorship and sometimes government/tourism grants. Success is measured in attendance, media reach and destination branding.</p>
<h3>Sport events</h3>
<p>From a local 5K run to a national tournament or the Olympics. Distinct challenges: strict scheduling (broadcast windows), athlete/spectator safety, anti-doping and officiating integrity, large-scale logistics (venues, transport). Revenue mix: ticketing, broadcast rights, sponsorship, merchandising.</p>
<h3>Cultural &amp; social events</h3>
<p>Weddings, religious/traditional ceremonies, community festivals, art exhibitions, charity galas. Purpose is often symbolic/relational rather than commercial; success is measured by guest satisfaction and how well the event honored its tradition/cause.</p>
<h3>Comparing the four</h3>
<pre><code>Type            | Primary goal              | Typical funding
----------------|---------------------------|--------------------------------
Corporate       | business outcome          | company marketing/HR budget
Festival        | culture + reach           | ticketing + sponsorship + grants
Sport           | competition + broadcast   | ticketing + broadcast rights + sponsorship
Cultural/social | tradition/relationship    | private budget + guest contribution
</code></pre>
<div class="callout"><span class="badge">Same toolbox, different goals</span> The planning, budgeting and risk tools you'll learn in this course apply to all four types — only the goals and success metrics change.</div>`,
    `<span class="eyebrow">EEM201 · Chương 2 · Bài 2.1</span>
<h2>Các loại hình sự kiện</h2>
<h3>Sự kiện doanh nghiệp</h3>
<p>Do/cho một doanh nghiệp tổ chức: hội nghị, hội thảo, ra mắt sản phẩm, triển lãm thương mại, chuyến du lịch khen thưởng, họp thường niên, team-building. Mục tiêu: kết quả kinh doanh — doanh số, kết nối, đào tạo, hình ảnh thương hiệu. Ngân sách thường lấy từ dòng marketing/HR, thành công đo bằng khách hàng tiềm năng, lượt tham dự hoặc mức độ gắn kết nhân viên.</p>
<h3>Lễ hội</h3>
<p>Những lễ kỷ niệm lặp lại theo chủ đề, mở cho công chúng — lễ hội âm nhạc, ẩm thực, điện ảnh, lễ hội văn hoá/di sản. Thường kéo dài nhiều ngày, nhiều sân khấu/địa điểm, được tài trợ bằng bán vé, tài trợ và đôi khi trợ cấp du lịch/nhà nước. Thành công đo bằng lượt tham dự, độ phủ truyền thông và xây dựng thương hiệu điểm đến.</p>
<h3>Sự kiện thể thao</h3>
<p>Từ một giải chạy 5km địa phương đến giải quốc gia hoặc Olympic. Thách thức riêng: lịch trình nghiêm ngặt (khung giờ phát sóng), an toàn cho vận động viên/khán giả, chống doping và tính công bằng trọng tài, hậu cần quy mô lớn (địa điểm, vận chuyển). Cơ cấu doanh thu: bán vé, quyền phát sóng, tài trợ, hàng lưu niệm.</p>
<h3>Sự kiện văn hoá &amp; xã hội</h3>
<p>Đám cưới, nghi lễ tôn giáo/truyền thống, lễ hội cộng đồng, triển lãm nghệ thuật, gala từ thiện. Mục đích thường mang tính biểu tượng/quan hệ hơn là thương mại; thành công đo bằng sự hài lòng của khách và mức độ tôn trọng truyền thống/mục đích của sự kiện.</p>
<h3>So sánh bốn loại hình</h3>
<pre><code>Loại hình       | Mục tiêu chính            | Nguồn tài trợ điển hình
----------------|---------------------------|--------------------------------
Doanh nghiệp    | kết quả kinh doanh        | ngân sách marketing/HR công ty
Lễ hội          | văn hoá + độ phủ          | bán vé + tài trợ + trợ cấp
Thể thao        | thi đấu + phát sóng       | vé + quyền phát sóng + tài trợ
Văn hoá/xã hội  | truyền thống/quan hệ      | ngân sách cá nhân + đóng góp khách
</code></pre>
<div class="callout"><span class="badge">Cùng bộ công cụ, mục tiêu khác nhau</span> Các công cụ lập kế hoạch, ngân sách và rủi ro trong môn này áp dụng cho cả bốn loại hình — chỉ mục tiêu và tiêu chí thành công thay đổi.</div>`,
  ]]);

const c2q = quiz('eem201-quiz-2', 'Quiz 2 — Event types|||Quiz 2 — Loại hình sự kiện', [
  { id: 'q1', question: 'Mục tiêu chính của sự kiện doanh nghiệp (corporate event) thường là gì?', options: ['Kết quả kinh doanh (doanh số, đào tạo, thương hiệu)', 'Chỉ để vui chơi', 'Luôn miễn phí cho công chúng', 'Không cần đo lường'], correctIndex: 0, explanation: 'Sự kiện doanh nghiệp phục vụ mục tiêu kinh doanh: doanh số, kết nối, đào tạo, hình ảnh thương hiệu.' },
  { id: 'q2', question: 'Nguồn thu chính của một sự kiện thể thao lớn thường gồm?', options: ['Chỉ bán vé', 'Vé + quyền phát sóng + tài trợ', 'Chỉ ngân sách nhà nước', 'Chỉ hàng lưu niệm'], correctIndex: 1, explanation: 'Sự kiện thể thao lớn có cơ cấu doanh thu đa dạng: bán vé, quyền phát sóng, tài trợ, merchandise.' },
  { id: 'q3', question: 'Lễ hội (festival) khác sự kiện doanh nghiệp chủ yếu ở điểm nào?', options: ['Lễ hội luôn nhỏ hơn', 'Lễ hội mở cho công chúng, lặp lại theo chủ đề; sự kiện doanh nghiệp phục vụ mục tiêu kinh doanh của tổ chức', 'Sự kiện doanh nghiệp không cần ngân sách', 'Không có khác biệt'], correctIndex: 1, explanation: 'Lễ hội hướng tới công chúng và văn hoá/du lịch; sự kiện doanh nghiệp phục vụ mục tiêu kinh doanh cụ thể của một tổ chức.' },
]);

const c3 = doc('eem201-3-1-stakeholders', '3.1 — Roles & stakeholders|||3.1 — Vai trò & các bên liên quan',
  'Vai trò trong nhóm sự kiện; bản đồ các bên liên quan (khách hàng, khán giả, nhà tài trợ, nhà cung cấp, chính quyền, truyền thông).',
  [[
    `<span class="eyebrow">EEM201 · Chapter 3 · Lesson 3.1</span>
<h2>Roles &amp; stakeholders in event organization</h2>
<h3>Core team roles</h3>
<ul>
<li><strong>Event manager/director</strong> — owns the vision, budget and final decisions.</li>
<li><strong>Event planner/coordinator</strong> — turns the plan into a timeline, books vendors, tracks tasks.</li>
<li><strong>Operations/logistics lead</strong> — venue, transport, equipment, on-the-day flow.</li>
<li><strong>Marketing/communications lead</strong> — promotion, media, social content.</li>
<li><strong>Sponsorship/partnerships lead</strong> — sells and services sponsor packages.</li>
<li><strong>Volunteers/production crew</strong> — staging, registration, ushering, technical support.</li>
</ul>
<h3>Stakeholders (Bowdin's stakeholder map)</h3>
<ul>
<li><strong>Clients/organizers</strong> — who commissions the event and defines objectives.</li>
<li><strong>Attendees/audience</strong> — the people the event is FOR; their experience is the product.</li>
<li><strong>Sponsors &amp; partners</strong> — fund or provide in-kind support in exchange for exposure/access.</li>
<li><strong>Suppliers/vendors</strong> — venue, catering, AV, security, décor.</li>
<li><strong>Local authorities/community</strong> — permits, safety regulation, noise/traffic impact on neighbors.</li>
<li><strong>Media</strong> — coverage that extends reach beyond attendees.</li>
</ul>
<h3>Why stakeholder mapping matters</h3>
<p>Each stakeholder has different, sometimes conflicting interests (a sponsor wants visibility, a neighbor wants quiet, an authority wants safety compliance). A good event plan identifies every stakeholder EARLY and manages their expectations — this is the single biggest predictor of "smooth event" vs. "event with a crisis."</p>
<pre><code>Stakeholder checklist (fill before planning starts):
 [ ] Who is the client and what does THEY consider success?
 [ ] Who are we asking money from (sponsors) and what do THEY need in return?
 [ ] Who approves permits/safety (authorities) and what do THEY require?
 [ ] Who lives/works near the venue and how are THEY affected?
 [ ] Who covers it (media) and what story do THEY want to tell?
</code></pre>
<div class="callout"><span class="badge">One team, many masters</span> The event team is one small group serving many stakeholder groups at once — role clarity inside the team is what makes that possible.</div>`,
    `<span class="eyebrow">EEM201 · Chương 3 · Bài 3.1</span>
<h2>Vai trò &amp; các bên liên quan trong tổ chức sự kiện</h2>
<h3>Các vai trò cốt lõi trong nhóm</h3>
<ul>
<li><strong>Event manager/director</strong> — nắm tầm nhìn, ngân sách và quyết định cuối cùng.</li>
<li><strong>Event planner/coordinator</strong> — biến kế hoạch thành lịch trình, đặt nhà cung cấp, theo dõi công việc.</li>
<li><strong>Trưởng vận hành/hậu cần</strong> — địa điểm, vận chuyển, thiết bị, dòng chảy trong ngày.</li>
<li><strong>Trưởng marketing/truyền thông</strong> — quảng bá, báo chí, nội dung mạng xã hội.</li>
<li><strong>Trưởng tài trợ/đối tác</strong> — bán và phục vụ các gói tài trợ.</li>
<li><strong>Tình nguyện viên/đội sản xuất</strong> — dựng sân khấu, đăng ký, hướng dẫn khách, hỗ trợ kỹ thuật.</li>
</ul>
<h3>Các bên liên quan (bản đồ của Bowdin)</h3>
<ul>
<li><strong>Khách hàng/đơn vị tổ chức</strong> — người đặt hàng sự kiện và định nghĩa mục tiêu.</li>
<li><strong>Người tham dự/khán giả</strong> — đối tượng mà sự kiện HƯỚNG TỚI; trải nghiệm của họ chính là sản phẩm.</li>
<li><strong>Nhà tài trợ &amp; đối tác</strong> — tài trợ tiền hoặc hỗ trợ bằng hàng hoá/dịch vụ, đổi lại là sự hiển thị/tiếp cận.</li>
<li><strong>Nhà cung cấp</strong> — địa điểm, catering, âm thanh/ánh sáng, an ninh, trang trí.</li>
<li><strong>Chính quyền/cộng đồng địa phương</strong> — giấy phép, quy định an toàn, tác động tiếng ồn/giao thông đến hàng xóm.</li>
<li><strong>Truyền thông</strong> — độ phủ mở rộng phạm vi tiếp cận ngoài số người tham dự.</li>
</ul>
<h3>Vì sao lập bản đồ các bên liên quan quan trọng</h3>
<p>Mỗi bên liên quan có lợi ích khác nhau, đôi khi xung đột (nhà tài trợ muốn được hiển thị, hàng xóm muốn yên tĩnh, chính quyền muốn tuân thủ an toàn). Một kế hoạch sự kiện tốt xác định TẤT CẢ các bên liên quan SỚM và quản lý kỳ vọng của họ — đây là yếu tố dự báo lớn nhất cho "sự kiện suôn sẻ" so với "sự kiện gặp khủng hoảng."</p>
<pre><code>Checklist các bên liên quan (điền trước khi bắt đầu lập kế hoạch):
 [ ] Khách hàng là ai và HỌ coi thành công là gì?
 [ ] Ai là người mình xin tiền (nhà tài trợ) và HỌ cần gì đổi lại?
 [ ] Ai cấp phép/an toàn (chính quyền) và HỌ yêu cầu gì?
 [ ] Ai sống/làm việc gần địa điểm và HỌ bị ảnh hưởng thế nào?
 [ ] Ai đưa tin (truyền thông) và HỌ muốn kể câu chuyện gì?
</code></pre>
<div class="callout"><span class="badge">Một nhóm, nhiều "chủ"</span> Nhóm sự kiện là một nhóm nhỏ phục vụ nhiều nhóm bên liên quan cùng lúc — sự rõ ràng về vai trò trong nhóm là điều làm cho việc đó khả thi.</div>`,
  ]]);

const c3q = quiz('eem201-quiz-3', 'Quiz 3 — Roles & stakeholders|||Quiz 3 — Vai trò & các bên liên quan', [
  { id: 'q1', question: 'Ai chịu trách nhiệm cao nhất về ngân sách và quyết định cuối cùng của sự kiện?', options: ['Tình nguyện viên', 'Event manager/director', 'Nhà tài trợ', 'Cơ quan chính quyền'], correctIndex: 1, explanation: 'Event manager/director nắm tầm nhìn, ngân sách và ra quyết định cuối cùng.' },
  { id: 'q2', question: 'Vì sao phải lập bản đồ các bên liên quan (stakeholder map) sớm?', options: ['Để tăng chi phí sự kiện', 'Vì mỗi bên có lợi ích khác nhau, quản lý kỳ vọng sớm giúp tránh khủng hoảng', 'Vì luật yêu cầu ở mọi trường hợp', 'Không cần thiết nếu sự kiện nhỏ'], correctIndex: 1, explanation: 'Nhận diện sớm và quản lý kỳ vọng của từng bên là yếu tố dự báo lớn nhất cho một sự kiện suôn sẻ.' },
  { id: 'q3', question: 'Nhà tài trợ (sponsor) thường mong đợi điều gì khi hỗ trợ sự kiện?', options: ['Không mong đợi gì', 'Được hiển thị/tiếp cận đối tượng khán giả (visibility/exposure)', 'Chỉ muốn giảm giá vé', 'Kiểm soát toàn bộ nội dung sự kiện'], correctIndex: 1, explanation: 'Tài trợ là một cuộc trao đổi: tiền/hàng hoá đổi lấy sự hiển thị và tiếp cận khán giả.' },
]);

const c4 = doc('eem201-4-1-planning', '4.1 — The event planning process|||4.1 — Quy trình lập kế hoạch sự kiện',
  'Khung 5 giai đoạn của Bowdin (Research→Design→Planning→Coordination→Evaluation), mục tiêu SMART, lịch trình lập kế hoạch, event brief.',
  [[
    `<span class="eyebrow">EEM201 · Chapter 4 · Lesson 4.1</span>
<h2>The event planning process</h2>
<h3>Bowdin's planning framework — five phases</h3>
<pre><code>1. Research      -&gt; define purpose, audience, feasibility, similar past events
2. Design        -&gt; concept, theme, program, venue, date, format
3. Planning      -&gt; detailed logistics, budget, timeline, staffing, permits
4. Coordination  -&gt; execution: run the event, manage on-the-day issues
5. Evaluation    -&gt; post-event review: did it meet objectives? what changed?
</code></pre>
<h3>SMART objectives</h3>
<p>Before any logistics, define objectives that are <strong>Specific, Measurable, Achievable, Relevant, Time-bound</strong> — e.g. "sell 500 tickets by launch date," not "have a great festival." Objectives drive every later decision (budget size, marketing channel, venue capacity).</p>
<h3>The planning timeline</h3>
<p>Work backward from the event date. A typical mid-size event timeline:</p>
<pre><code>T-6 months : confirm objectives, budget, venue, date
T-4 months : book key suppliers/talent, open sponsorship sales
T-3 months : marketing launch, ticket sales open
T-1 month  : finalize run sheet, confirm staffing, safety plan
T-1 week   : venue walkthrough, final headcounts, vendor confirmations
Event day  : setup -&gt; execution -&gt; teardown
T+1 week   : post-event evaluation &amp; stakeholder debrief
</code></pre>
<h3>The event brief</h3>
<p>A one-page document that captures purpose, objectives, target audience, date/venue, budget ceiling and key deliverables. It is the single reference every team member and supplier checks when in doubt.</p>
<div class="callout"><span class="badge">Plan backward from the deadline</span> Most planning failures are timeline failures — a task discovered too late to fix (e.g. permits) rather than a bad idea.</div>`,
    `<span class="eyebrow">EEM201 · Chương 4 · Bài 4.1</span>
<h2>Quy trình lập kế hoạch sự kiện</h2>
<h3>Khung lập kế hoạch của Bowdin — 5 giai đoạn</h3>
<pre><code>1. Research (Nghiên cứu)   -&gt; xác định mục đích, đối tượng, tính khả thi, sự kiện tương tự trước đây
2. Design (Thiết kế)       -&gt; ý tưởng, chủ đề, chương trình, địa điểm, ngày, hình thức
3. Planning (Lập kế hoạch) -&gt; hậu cần chi tiết, ngân sách, lịch trình, nhân sự, giấy phép
4. Coordination (Điều phối)-&gt; triển khai: chạy sự kiện, xử lý vấn đề trong ngày
5. Evaluation (Đánh giá)   -&gt; rà soát sau sự kiện: có đạt mục tiêu không? thay đổi gì?
</code></pre>
<h3>Mục tiêu SMART</h3>
<p>Trước khi lo hậu cần, hãy xác định mục tiêu <strong>Cụ thể (Specific), Đo được (Measurable), Khả thi (Achievable), Liên quan (Relevant), Có thời hạn (Time-bound)</strong> — ví dụ "bán 500 vé trước ngày mở bán chính thức," không phải "tổ chức một lễ hội hoành tráng." Mục tiêu chi phối mọi quyết định sau đó (quy mô ngân sách, kênh marketing, sức chứa địa điểm).</p>
<h3>Lịch trình lập kế hoạch</h3>
<p>Làm việc ngược từ ngày diễn ra sự kiện. Lịch trình điển hình cho một sự kiện quy mô vừa:</p>
<pre><code>T-6 tháng : xác nhận mục tiêu, ngân sách, địa điểm, ngày
T-4 tháng : đặt nhà cung cấp/nghệ sĩ chính, mở bán tài trợ
T-3 tháng : khởi động marketing, mở bán vé
T-1 tháng : hoàn thiện run sheet, xác nhận nhân sự, kế hoạch an toàn
T-1 tuần  : khảo sát địa điểm, số lượng khách cuối cùng, xác nhận nhà cung cấp
Ngày sự kiện : dựng -&gt; triển khai -&gt; dỡ bỏ
T+1 tuần  : đánh giá sau sự kiện &amp; họp rút kinh nghiệm với các bên liên quan
</code></pre>
<h3>Event brief</h3>
<p>Một tài liệu một trang tóm tắt mục đích, mục tiêu, đối tượng mục tiêu, ngày/địa điểm, mức ngân sách tối đa và các sản phẩm bàn giao chính. Đây là tài liệu tham chiếu duy nhất mà mọi thành viên nhóm và nhà cung cấp tra cứu khi cần.</p>
<div class="callout"><span class="badge">Lập kế hoạch ngược từ hạn cuối</span> Hầu hết thất bại trong lập kế hoạch là thất bại về lịch trình — một việc phát hiện quá muộn để sửa (ví dụ giấy phép) chứ không phải một ý tưởng tồi.</div>`,
  ]]);

const c4q = quiz('eem201-quiz-4', 'Quiz 4 — Planning process|||Quiz 4 — Quy trình lập kế hoạch', [
  { id: 'q1', question: 'Theo khung 5 giai đoạn của Bowdin, giai đoạn đầu tiên là gì?', options: ['Coordination', 'Research', 'Evaluation', 'Design'], correctIndex: 1, explanation: 'Giai đoạn đầu là Research — nghiên cứu mục đích, đối tượng, tính khả thi.' },
  { id: 'q2', question: 'Mục tiêu SMART yêu cầu điều gì?', options: ['Càng mơ hồ càng tốt', 'Cụ thể, đo được, khả thi, liên quan, có thời hạn', 'Chỉ cần có ngân sách lớn', 'Không cần đo lường'], correctIndex: 1, explanation: 'SMART = Specific, Measurable, Achievable, Relevant, Time-bound.' },
  { id: 'q3', question: '"Event brief" dùng để làm gì?', options: ['Thay thế hợp đồng pháp lý', 'Tóm tắt mục đích, đối tượng, ngày/địa điểm, ngân sách và sản phẩm bàn giao — tài liệu tham chiếu chung', 'Chỉ dành cho nhà tài trợ', 'Chỉ cần sau khi sự kiện kết thúc'], correctIndex: 1, explanation: 'Event brief là tài liệu một trang mà cả nhóm và nhà cung cấp cùng tham chiếu.' },
]);

const c5 = doc('eem201-5-1-budget-sponsorship', '5.1 — Budgeting & sponsorship|||5.1 — Ngân sách & tài trợ',
  'Chi phí cố định/biến đổi, dự phòng, điểm hoà vốn, tài trợ tiền mặt vs. hiện vật.',
  [[
    `<span class="eyebrow">EEM201 · Chapter 5 · Lesson 5.1</span>
<h2>Budgeting &amp; sponsorship</h2>
<h3>Building an event budget</h3>
<ul>
<li><strong>Fixed costs</strong> — venue rental, permits, insurance, core staff — due regardless of attendance.</li>
<li><strong>Variable costs</strong> — catering per head, printed materials, temp staff — scale with attendance.</li>
<li><strong>Contingency</strong> — a reserve (commonly 10-15% of budget) for the unexpected; every event book recommends never planning at zero margin.</li>
<li><strong>Revenue lines</strong> — ticket sales, sponsorship, merchandising, grants/subsidies.</li>
</ul>
<h3>Break-even &amp; pricing</h3>
<pre><code>Break-even attendance = Fixed costs / (Ticket price - Variable cost per attendee)

Example:
 Fixed costs = 60,000,000 VND
 Ticket price = 200,000 VND, variable cost/attendee = 50,000 VND
 Break-even = 60,000,000 / (200,000 - 50,000) = 400 attendees
</code></pre>
<h3>Sponsorship — a trade, not a donation</h3>
<p>Sponsorship is an exchange: the sponsor gives money/goods/services, the event gives <strong>exposure and access</strong> (logo placement, stage mentions, booth space, data/leads, hospitality). A sponsorship proposal should state clearly what the sponsor gets, tiered by contribution level (e.g. Title/Gold/Silver/Bronze), and how that exposure will be measured (impressions, foot traffic, media value).</p>
<h3>In-kind vs. cash sponsorship</h3>
<p><strong>Cash sponsorship</strong> funds the budget directly. <strong>In-kind sponsorship</strong> (a supplier providing free equipment, food, or media placement) reduces cost lines instead — both should be logged in the budget at their fair value so the true cost of the event is visible.</p>
<div class="callout"><span class="badge">Never plan at zero margin</span> A budget with no contingency turns the first unexpected cost (a rain plan, extra security) into a deficit.</div>`,
    `<span class="eyebrow">EEM201 · Chương 5 · Bài 5.1</span>
<h2>Ngân sách &amp; tài trợ</h2>
<h3>Xây dựng ngân sách sự kiện</h3>
<ul>
<li><strong>Chi phí cố định</strong> — thuê địa điểm, giấy phép, bảo hiểm, nhân sự cốt lõi — phải chi bất kể số lượng khách.</li>
<li><strong>Chi phí biến đổi</strong> — catering theo đầu người, tài liệu in ấn, nhân sự thời vụ — thay đổi theo số lượng khách.</li>
<li><strong>Dự phòng</strong> — một khoản dự trữ (thường 10-15% ngân sách) cho những việc bất ngờ; mọi giáo trình sự kiện đều khuyến cáo không nên lập ngân sách với biên độ bằng không.</li>
<li><strong>Các dòng doanh thu</strong> — bán vé, tài trợ, hàng lưu niệm, trợ cấp/tài trợ nhà nước.</li>
</ul>
<h3>Điểm hoà vốn &amp; định giá</h3>
<pre><code>Số khách hoà vốn = Chi phí cố định / (Giá vé - Chi phí biến đổi/khách)

Ví dụ:
 Chi phí cố định = 60.000.000 VND
 Giá vé = 200.000 VND, chi phí biến đổi/khách = 50.000 VND
 Hoà vốn = 60.000.000 / (200.000 - 50.000) = 400 khách
</code></pre>
<h3>Tài trợ — một cuộc trao đổi, không phải quyên góp</h3>
<p>Tài trợ là một cuộc trao đổi: nhà tài trợ cho tiền/hàng hoá/dịch vụ, sự kiện đem lại <strong>sự hiển thị và tiếp cận</strong> (đặt logo, nhắc tên trên sân khấu, gian hàng, dữ liệu/khách hàng tiềm năng, tiếp đón). Một đề xuất tài trợ cần nêu rõ nhà tài trợ nhận được gì, phân theo hạng mức đóng góp (ví dụ Title/Gold/Silver/Bronze), và cách đo lường sự hiển thị đó (số lượt hiển thị, lượt khách qua gian hàng, giá trị truyền thông).</p>
<h3>Tài trợ hiện vật vs. tiền mặt</h3>
<p><strong>Tài trợ tiền mặt</strong> tài trợ trực tiếp cho ngân sách. <strong>Tài trợ hiện vật</strong> (nhà cung cấp cho mượn thiết bị, thực phẩm hoặc vị trí truyền thông miễn phí) thay vào đó làm giảm các dòng chi phí — cả hai loại nên được ghi vào ngân sách theo giá trị thực để thấy được chi phí thật của sự kiện.</p>
<div class="callout"><span class="badge">Không bao giờ lập ngân sách bằng không dự phòng</span> Một ngân sách không có khoản dự phòng biến chi phí bất ngờ đầu tiên (kế hoạch mưa, thêm an ninh) thành thâm hụt.</div>`,
  ]]);

const c5q = quiz('eem201-quiz-5', 'Quiz 5 — Budget & sponsorship|||Quiz 5 — Ngân sách & tài trợ', [
  { id: 'q1', question: 'Chi phí thuê địa điểm, bảo hiểm, giấy phép là loại chi phí gì?', options: ['Chi phí biến đổi', 'Chi phí cố định', 'Doanh thu', 'Quỹ dự phòng'], correctIndex: 1, explanation: 'Đây là chi phí cố định — phải chi bất kể số lượng khách tham dự.' },
  { id: 'q2', question: 'Công thức điểm hoà vốn (break-even) về số khách cần có là?', options: ['Chi phí cố định × giá vé', 'Chi phí cố định / (Giá vé − chi phí biến đổi/khách)', 'Doanh thu / chi phí', 'Không thể tính được'], correctIndex: 1, explanation: 'Số khách hoà vốn = Chi phí cố định / (Giá vé − Chi phí biến đổi mỗi khách).' },
  { id: 'q3', question: 'Bản chất của tài trợ (sponsorship) là gì?', options: ['Một khoản quyên góp không điều kiện', 'Một cuộc trao đổi — nhà tài trợ cho tiền/hàng hoá, sự kiện đem lại sự hiển thị/tiếp cận', 'Chỉ áp dụng cho sự kiện thể thao', 'Luôn miễn phí cho nhà tài trợ'], correctIndex: 1, explanation: 'Tài trợ là trao đổi: tiền/hiện vật đổi lấy sự hiển thị và tiếp cận khán giả.' },
]);

const c6 = doc('eem201-6-1-marketing', '6.1 — Event marketing & communications|||6.1 — Marketing & truyền thông sự kiện',
  'Marketing mix của sự kiện, PR & báo chí, chiến lược số/mạng xã hội, đo lường KPI marketing.',
  [[
    `<span class="eyebrow">EEM201 · Chapter 6 · Lesson 6.1</span>
<h2>Event marketing &amp; communications</h2>
<h3>The event marketing mix</h3>
<ul>
<li><strong>Positioning</strong> — who is this event for, and why should THEY come (not everyone)?</li>
<li><strong>Channels</strong> — social media, email/CRM lists, influencers/partners, PR (media coverage), paid ads, on-ground signage.</li>
<li><strong>Content</strong> — teaser announcements, lineup/agenda reveals, countdown content, behind-the-scenes, live coverage, post-event highlights.</li>
<li><strong>Ticketing funnel</strong> — awareness → interest (early-bird pricing) → decision (urgency, social proof) → purchase → reminder before the event.</li>
</ul>
<h3>Public relations &amp; media</h3>
<p>A press kit (fact sheet, high-res images, spokesperson quotes) makes it easy for journalists to cover the event. Media partnerships (radio, TV, online outlets) trade coverage for access/branding — much like sponsorship but paid in exposure, not cash.</p>
<h3>Digital &amp; social strategy</h3>
<p>Event hashtags, geo-tagged posts, and influencer invitations turn attendees into promoters. Livestreaming/hybrid formats extend an event's reach far past physical capacity — a trend that accelerated industry-wide.</p>
<h3>Measuring marketing success</h3>
<pre><code>Marketing KPIs to track:
 Reach       -&gt; impressions, followers gained, media mentions
 Engagement  -&gt; shares, comments, hashtag usage
 Conversion  -&gt; ticket sales by channel (which channel actually sold tickets?)
 Sentiment   -&gt; tone of comments/reviews before &amp; after
</code></pre>
<div class="callout"><span class="badge">Sell the experience, not the schedule</span> Marketing that lists times/venue only converts people who already decided; marketing that sells the FEELING (belonging, exclusivity, fun) converts everyone else.</div>`,
    `<span class="eyebrow">EEM201 · Chương 6 · Bài 6.1</span>
<h2>Marketing &amp; truyền thông sự kiện</h2>
<h3>Marketing mix của sự kiện</h3>
<ul>
<li><strong>Định vị (positioning)</strong> — sự kiện này dành cho ai, và vì sao HỌ nên đến (không phải mọi người)?</li>
<li><strong>Kênh</strong> — mạng xã hội, email/danh sách CRM, người ảnh hưởng/đối tác, PR (báo chí), quảng cáo trả tiền, biển bảng tại chỗ.</li>
<li><strong>Nội dung</strong> — thông báo teaser, hé lộ line-up/chương trình, nội dung đếm ngược, hậu trường, đưa tin trực tiếp, điểm nhấn sau sự kiện.</li>
<li><strong>Kênh chuyển đổi vé (ticketing funnel)</strong> — nhận biết → quan tâm (giá early-bird) → quyết định (khan hiếm, bằng chứng xã hội) → mua → nhắc nhở trước sự kiện.</li>
</ul>
<h3>Quan hệ công chúng &amp; báo chí</h3>
<p>Một press kit (bảng thông tin, ảnh độ phân giải cao, trích dẫn người phát ngôn) giúp nhà báo dễ dàng đưa tin về sự kiện. Hợp tác truyền thông (radio, TV, báo mạng) đổi độ phủ lấy quyền tiếp cận/nhận diện thương hiệu — giống tài trợ nhưng trả bằng sự hiển thị, không phải tiền mặt.</p>
<h3>Chiến lược số &amp; mạng xã hội</h3>
<p>Hashtag sự kiện, bài đăng gắn vị trí, và lời mời người ảnh hưởng biến người tham dự thành người quảng bá. Định dạng livestream/hybrid mở rộng phạm vi tiếp cận của sự kiện vượt xa sức chứa vật lý — một xu hướng đã tăng tốc trên toàn ngành.</p>
<h3>Đo lường hiệu quả marketing</h3>
<pre><code>Các KPI marketing cần theo dõi:
 Độ phủ (Reach)       -&gt; số lượt hiển thị, người theo dõi mới, lượt được nhắc trên báo
 Tương tác (Engagement)-&gt; lượt chia sẻ, bình luận, sử dụng hashtag
 Chuyển đổi (Conversion)-&gt; doanh số vé theo từng kênh (kênh nào thực sự bán được vé?)
 Cảm xúc (Sentiment)  -&gt; tông bình luận/đánh giá trước &amp; sau sự kiện
</code></pre>
<div class="callout"><span class="badge">Bán trải nghiệm, không phải lịch trình</span> Marketing chỉ liệt kê giờ/địa điểm chỉ chuyển đổi được người đã quyết định sẵn; marketing bán CẢM XÚC (thuộc về, độc quyền, vui vẻ) chuyển đổi được tất cả những người còn lại.</div>`,
  ]]);

const c6q = quiz('eem201-quiz-6', 'Quiz 6 — Marketing & communications|||Quiz 6 — Marketing & truyền thông', [
  { id: 'q1', question: "'Positioning' trong marketing sự kiện nghĩa là gì?", options: ['Vị trí sân khấu', 'Xác định sự kiện dành cho ai và vì sao họ nên đến', 'Giá vé cố định', 'Vị trí địa lý của địa điểm'], correctIndex: 1, explanation: 'Positioning trả lời câu hỏi: sự kiện dành cho ai, và tại sao đúng đối tượng đó nên đến.' },
  { id: 'q2', question: 'Kênh nào KHÔNG thuộc marketing mix của sự kiện theo bài học?', options: ['Mạng xã hội', 'Email/CRM', 'PR/báo chí', 'Kiểm toán tài chính'], correctIndex: 3, explanation: 'Kiểm toán tài chính không phải kênh marketing; nó thuộc quản lý ngân sách.' },
  { id: 'q3', question: 'Chỉ số nào đo lường CHUYỂN ĐỔI (conversion) trong marketing sự kiện?', options: ['Số lượt theo dõi mới', 'Doanh số vé bán theo từng kênh', 'Số bài đăng', 'Cảm xúc bình luận'], correctIndex: 1, explanation: 'Conversion đo bằng doanh số vé bán được, gắn với từng kênh cụ thể.' },
]);

const c7 = doc('eem201-7-1-operations-risk', '7.1 — Operations, logistics & risk|||7.1 — Vận hành, hậu cần & quản lý rủi ro',
  'Run sheet, checklist hậu cần, chu trình quản lý rủi ro của Goldblatt, quản lý an toàn đám đông.',
  [[
    `<span class="eyebrow">EEM201 · Chapter 7 · Lesson 7.1</span>
<h2>Operations, logistics &amp; risk management</h2>
<h3>The run sheet</h3>
<p>A minute-by-minute schedule of the event day — setup times, arrival of talent/VIPs, program cues, breaks, teardown — shared with every team and supplier so everyone works off ONE timeline, not memory.</p>
<pre><code>Sample run sheet excerpt:
 06:00 Venue access, setup begins
 08:00 AV/sound check
 09:30 Registration desk opens
 10:00 Opening ceremony
 12:00 Lunch break / networking
 17:00 Program ends, teardown begins
 19:00 Venue handover
</code></pre>
<h3>Logistics checklist</h3>
<ul>
<li><strong>Venue</strong> — capacity, layout, accessibility, parking, power supply.</li>
<li><strong>Transport</strong> — for talent/VIPs, equipment delivery, attendee shuttle if needed.</li>
<li><strong>Technical</strong> — sound, lighting, staging, connectivity, backup power.</li>
<li><strong>F&amp;B, security, medical</strong> — catering headcount, security staffing ratio, first-aid/medical presence.</li>
</ul>
<h3>Risk management (Goldblatt's risk cycle)</h3>
<pre><code>1. Identify   -&gt; weather, crowd crush, technical failure, no-show talent, fire, theft
2. Assess     -&gt; likelihood x impact for each risk
3. Mitigate   -&gt; plan B / insurance / extra staff / permits / rain plan
4. Respond    -&gt; what the team DOES if it happens (who decides, who calls emergency services)
5. Review     -&gt; after the event, what actually happened vs. the plan
</code></pre>
<h3>Crowd &amp; safety management</h3>
<p>For any event with more than a few hundred attendees: crowd flow (entry/exit capacity, one-way routes), clear emergency exits, visible security/staff, and a communicated emergency plan. This is a legal duty, not an optional extra, in most jurisdictions.</p>
<div class="callout"><span class="badge">No plan survives contact with reality unchanged</span> The run sheet and risk register aren't paperwork — they are what lets the team improvise safely when (not if) something goes off-script.</div>`,
    `<span class="eyebrow">EEM201 · Chương 7 · Bài 7.1</span>
<h2>Vận hành, hậu cần &amp; quản lý rủi ro</h2>
<h3>Run sheet</h3>
<p>Lịch trình chi tiết theo từng phút của ngày sự kiện — giờ dựng, thời điểm nghệ sĩ/VIP đến, các cue trong chương trình, giờ nghỉ, dỡ bỏ — chia sẻ cho toàn bộ nhóm và nhà cung cấp để mọi người làm theo MỘT lịch trình duy nhất, không phải theo trí nhớ.</p>
<pre><code>Trích đoạn run sheet mẫu:
 06:00 Vào địa điểm, bắt đầu dựng
 08:00 Kiểm tra âm thanh/hình ảnh
 09:30 Mở bàn đăng ký
 10:00 Lễ khai mạc
 12:00 Nghỉ trưa / kết nối
 17:00 Kết thúc chương trình, bắt đầu dỡ bỏ
 19:00 Bàn giao lại địa điểm
</code></pre>
<h3>Checklist hậu cần</h3>
<ul>
<li><strong>Địa điểm</strong> — sức chứa, bố trí, khả năng tiếp cận, bãi đỗ xe, nguồn điện.</li>
<li><strong>Vận chuyển</strong> — cho nghệ sĩ/VIP, giao thiết bị, xe đưa đón khách nếu cần.</li>
<li><strong>Kỹ thuật</strong> — âm thanh, ánh sáng, dựng sân khấu, kết nối mạng, nguồn điện dự phòng.</li>
<li><strong>Ăn uống, an ninh, y tế</strong> — số lượng khách để tính catering, tỷ lệ nhân sự an ninh, sự có mặt của y tế/cấp cứu.</li>
</ul>
<h3>Quản lý rủi ro (chu trình của Goldblatt)</h3>
<pre><code>1. Nhận diện  -&gt; thời tiết, chen lấn đám đông, hỏng kỹ thuật, nghệ sĩ không đến, cháy, trộm cắp
2. Đánh giá   -&gt; khả năng xảy ra x mức độ ảnh hưởng cho từng rủi ro
3. Giảm thiểu -&gt; kế hoạch B / bảo hiểm / thêm nhân sự / giấy phép / kế hoạch mưa
4. Ứng phó    -&gt; nhóm LÀM GÌ nếu xảy ra (ai quyết định, ai gọi cấp cứu)
5. Rà soát    -&gt; sau sự kiện, thực tế xảy ra gì so với kế hoạch
</code></pre>
<h3>Quản lý đám đông &amp; an toàn</h3>
<p>Với bất kỳ sự kiện nào có hơn vài trăm khách: dòng chảy đám đông (sức chứa lối vào/ra, lối đi một chiều), lối thoát hiểm rõ ràng, an ninh/nhân sự dễ nhận thấy, và một kế hoạch khẩn cấp được truyền đạt rõ. Đây là nghĩa vụ pháp lý, không phải tuỳ chọn, ở hầu hết các khu vực pháp lý.</p>
<div class="callout"><span class="badge">Không kế hoạch nào sống sót nguyên vẹn khi va vào thực tế</span> Run sheet và sổ rủi ro không phải giấy tờ hình thức — chúng là thứ giúp nhóm ứng biến an toàn khi (không phải "nếu") có gì đó chệch khỏi kịch bản.</div>`,
  ]]);

const c7q = quiz('eem201-quiz-7', 'Quiz 7 — Operations & risk|||Quiz 7 — Vận hành & rủi ro', [
  { id: 'q1', question: "'Run sheet' của sự kiện là gì?", options: ['Danh sách khách VIP', 'Lịch trình chi tiết theo từng phút trong ngày sự kiện, dùng chung cho cả nhóm', 'Hợp đồng với nhà tài trợ', 'Báo cáo sau sự kiện'], correctIndex: 1, explanation: 'Run sheet là lịch trình chi tiết theo phút, chia sẻ cho cả nhóm và nhà cung cấp.' },
  { id: 'q2', question: 'Theo chu trình quản lý rủi ro của Goldblatt, sau khi NHẬN DIỆN rủi ro là bước gì?', options: ['Bỏ qua rủi ro nhỏ', 'Đánh giá (khả năng × mức độ ảnh hưởng)', 'Huỷ sự kiện', 'Chuyển toàn bộ cho bảo hiểm'], correctIndex: 1, explanation: 'Sau Identify là Assess — đánh giá khả năng xảy ra và mức độ ảnh hưởng của từng rủi ro.' },
  { id: 'q3', question: 'Quản lý dòng người (crowd management) là gì?', options: ['Chỉ áp dụng cho concert lớn', 'Kiểm soát luồng vào/ra, lối thoát hiểm rõ ràng — nghĩa vụ pháp lý ở nhiều nơi', 'Chỉ cần khi thời tiết xấu', 'Không liên quan đến an toàn'], correctIndex: 1, explanation: 'Quản lý đám đông là nghĩa vụ an toàn/pháp lý cho bất kỳ sự kiện đông người.' },
]);

const c8 = doc('eem201-8-1-evaluation-careers', '8.1 — Evaluation, trends & careers|||8.1 — Đánh giá sự kiện, xu hướng & sự nghiệp',
  'Báo cáo sau sự kiện, xu hướng ngành (hybrid, bền vững, cá nhân hoá), lộ trình nghề nghiệp.',
  [[
    `<span class="eyebrow">EEM201 · Chapter 8 · Lesson 8.1</span>
<h2>Event evaluation, trends &amp; careers</h2>
<h3>Post-event evaluation</h3>
<p>Compare outcomes against the SMART objectives set in the planning phase: attendance vs. target, revenue vs. budget, sponsor satisfaction, media reach, attendee feedback (surveys, NPS). A written post-event report captures what worked, what didn't, and specific recommendations for next time — this is how event organizations build institutional memory instead of repeating the same mistakes.</p>
<pre><code>Post-event report — minimum sections:
 1. Objectives vs. actual results
 2. Financial summary (budget vs. actual, ROI for sponsors)
 3. Attendee feedback highlights
 4. Operational issues &amp; how they were handled
 5. Recommendations for the next edition
</code></pre>
<h3>Industry trends</h3>
<ul>
<li><strong>Hybrid &amp; virtual events</strong> — livestreaming extends reach beyond the physical venue.</li>
<li><strong>Sustainability</strong> — waste reduction, local sourcing, carbon accounting for large events.</li>
<li><strong>Experience personalization</strong> — data-driven agendas, matchmaking at business events.</li>
<li><strong>Technology on-site</strong> — RFID/QR check-in, event apps, AI-assisted planning tools.</li>
</ul>
<h3>Careers in the industry</h3>
<ul>
<li><strong>Event/wedding planner</strong>, <strong>venue manager</strong>, <strong>festival producer</strong>, <strong>sponsorship/partnerships manager</strong>, <strong>MICE/exhibition coordinator</strong>, <strong>sports event operations</strong>, <strong>entertainment/talent booking</strong>.</li>
<li>Entry paths: internships with event agencies, volunteering at festivals/sport events, in-house corporate marketing/events teams.</li>
</ul>
<div class="callout"><span class="badge">The loop closes here</span> Evaluation from THIS event becomes the research input (Chapter 1's first planning phase) for the NEXT one — the industry keeps improving by writing down what it learns.</div>`,
    `<span class="eyebrow">EEM201 · Chương 8 · Bài 8.1</span>
<h2>Đánh giá sự kiện, xu hướng &amp; sự nghiệp</h2>
<h3>Đánh giá sau sự kiện</h3>
<p>So sánh kết quả với các mục tiêu SMART đã đặt ra trong giai đoạn lập kế hoạch: lượt tham dự so với mục tiêu, doanh thu so với ngân sách, mức hài lòng của nhà tài trợ, độ phủ truyền thông, phản hồi người tham dự (khảo sát, NPS). Một báo cáo sau sự kiện bằng văn bản ghi lại điều gì hiệu quả, điều gì không, và đề xuất cụ thể cho lần sau — đây là cách các tổ chức sự kiện xây dựng bộ nhớ tổ chức thay vì lặp lại cùng một sai lầm.</p>
<pre><code>Báo cáo sau sự kiện — các phần tối thiểu:
 1. Mục tiêu so với kết quả thực tế
 2. Tóm tắt tài chính (ngân sách so với thực tế, ROI cho nhà tài trợ)
 3. Điểm nổi bật từ phản hồi người tham dự
 4. Vấn đề vận hành &amp; cách xử lý
 5. Đề xuất cho lần tổ chức tiếp theo
</code></pre>
<h3>Xu hướng ngành</h3>
<ul>
<li><strong>Sự kiện hybrid &amp; trực tuyến</strong> — livestream mở rộng phạm vi tiếp cận vượt ngoài địa điểm vật lý.</li>
<li><strong>Bền vững</strong> — giảm rác thải, nguồn cung địa phương, tính toán carbon cho sự kiện lớn.</li>
<li><strong>Cá nhân hoá trải nghiệm</strong> — chương trình dựa trên dữ liệu, kết nối đối tác tại sự kiện kinh doanh.</li>
<li><strong>Công nghệ tại chỗ</strong> — check-in RFID/QR, ứng dụng sự kiện, công cụ lập kế hoạch hỗ trợ AI.</li>
</ul>
<h3>Sự nghiệp trong ngành</h3>
<ul>
<li><strong>Người tổ chức sự kiện/đám cưới</strong>, <strong>quản lý địa điểm</strong>, <strong>nhà sản xuất lễ hội</strong>, <strong>quản lý tài trợ/đối tác</strong>, <strong>điều phối MICE/triển lãm</strong>, <strong>vận hành sự kiện thể thao</strong>, <strong>đặt lịch nghệ sĩ/giải trí</strong>.</li>
<li>Lối vào ngành: thực tập tại các agency sự kiện, làm tình nguyện viên tại lễ hội/sự kiện thể thao, nhóm marketing/sự kiện nội bộ của doanh nghiệp.</li>
</ul>
<div class="callout"><span class="badge">Vòng lặp khép lại ở đây</span> Đánh giá từ sự kiện NÀY trở thành đầu vào nghiên cứu (giai đoạn Research đầu tiên ở Chương 1) cho sự kiện TIẾP THEO — ngành liên tục cải thiện bằng cách ghi lại những gì đã học được.</div>`,
  ]]);

const c8q = quiz('eem201-quiz-8', 'Quiz 8 — Evaluation, trends & careers|||Quiz 8 — Đánh giá, xu hướng & sự nghiệp', [
  { id: 'q1', question: 'Báo cáo sau sự kiện (post-event report) nên bao gồm điều gì?', options: ['Chỉ số liệu doanh thu', 'Mục tiêu vs kết quả thực tế, tài chính, phản hồi khách, vấn đề vận hành và đề xuất', 'Chỉ danh sách khách mời', 'Không cần thiết nếu sự kiện thành công'], correctIndex: 1, explanation: 'Báo cáo cần đủ 5 phần: mục tiêu vs thực tế, tài chính, phản hồi, vận hành, đề xuất.' },
  { id: 'q2', question: 'Xu hướng nào sau đây thuộc ngành sự kiện hiện nay?', options: ['Sự kiện chỉ tổ chức trực tiếp, không dùng công nghệ', 'Sự kiện hybrid/trực tuyến, bền vững, cá nhân hoá trải nghiệm, công nghệ check-in', 'Ngành đang thu hẹp lại', 'Không có xu hướng rõ ràng'], correctIndex: 1, explanation: 'Các xu hướng chính: hybrid/virtual, bền vững, cá nhân hoá, công nghệ tại chỗ.' },
  { id: 'q3', question: 'Vì sao đánh giá sau sự kiện lại quan trọng cho sự kiện TIẾP THEO?', options: ['Không quan trọng, vì mỗi sự kiện độc lập', 'Nó trở thành đầu vào nghiên cứu cho giai đoạn lập kế hoạch tiếp theo — giúp ngành cải thiện liên tục', 'Chỉ để làm hài lòng nhà tài trợ', 'Chỉ cần khi sự kiện thất bại'], correctIndex: 1, explanation: 'Đánh giá nuôi lại giai đoạn Research của vòng lập kế hoạch tiếp theo, tạo ra cải thiện liên tục.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'EEM201',
    slug: 'eem201-introduction-to-entertainment-and-event-management',
    title: 'Introduction to Entertainment and Event Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EEM201.webp',
    shortDescription: 'How the entertainment & event industry works — event types, stakeholder roles, the planning process, budgeting & sponsorship, marketing, operations & risk, evaluation & career trends. Bilingual, with checklists & quizzes.|||Ngành giải trí & sự kiện hoạt động thế nào — loại hình sự kiện, vai trò các bên, quy trình lập kế hoạch, ngân sách & tài trợ, marketing, vận hành & rủi ro, đánh giá & xu hướng nghề nghiệp. Song ngữ, có checklist & quiz.',
    description: 'Môn <strong>EEM201 — Introduction to Entertainment and Event Management</strong> (kỳ 2) giới thiệu <strong>ngành giải trí &amp; sự kiện</strong>. Từ <strong>tổng quan ngành</strong> (kinh tế trải nghiệm, MICE, lễ hội, thể thao) → <strong>các loại hình sự kiện</strong> → <strong>vai trò &amp; các bên liên quan</strong> → <strong>quy trình lập kế hoạch</strong> (5 giai đoạn Bowdin) → <strong>ngân sách &amp; tài trợ</strong> → <strong>marketing &amp; truyền thông</strong> → <strong>vận hành, hậu cần &amp; quản lý rủi ro</strong> → <strong>đánh giá sự kiện, xu hướng &amp; sự nghiệp</strong>. Bám giáo trình quốc tế (Bowdin, Goldblatt, Vogel), song ngữ, có checklist, run sheet mẫu và quiz mỗi chương.',
    whatYouLearn: 'Kinh tế trải nghiệm & phân khúc ngành (MICE, lễ hội, thể thao, giải trí trực tiếp); phân loại sự kiện doanh nghiệp/lễ hội/thể thao/văn hoá; vai trò trong nhóm sự kiện & bản đồ các bên liên quan; quy trình lập kế hoạch 5 giai đoạn (Research→Design→Planning→Coordination→Evaluation) & mục tiêu SMART; xây ngân sách, điểm hoà vốn, đề xuất tài trợ theo hạng mục; marketing mix & KPI truyền thông sự kiện; run sheet, checklist hậu cần, chu trình quản lý rủi ro & an toàn đám đông; báo cáo sau sự kiện, xu hướng ngành & lộ trình nghề nghiệp.',
    requirements: 'Không yêu cầu kiến thức chuyên ngành trước đó. Phù hợp cho sinh viên năm nhất khối Quản trị Kinh doanh (BBA), kỳ 2.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & sách trên FLM, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Ngành giải trí & sự kiện, kinh tế trải nghiệm.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan ngành|||Chapter 1 — Industry overview', description: 'Kinh tế trải nghiệm, các phân khúc ngành.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Loại hình sự kiện|||Chapter 2 — Event types', description: 'Doanh nghiệp, lễ hội, thể thao, văn hoá/xã hội.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Vai trò & bên liên quan|||Chapter 3 — Roles & stakeholders', description: 'Nhóm sự kiện, bản đồ các bên liên quan.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Quy trình lập kế hoạch|||Chapter 4 — Planning process', description: '5 giai đoạn Bowdin, SMART, lịch trình, event brief.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Ngân sách & tài trợ|||Chapter 5 — Budget & sponsorship', description: 'Chi phí, hoà vốn, tài trợ tiền/hiện vật.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Marketing & truyền thông|||Chapter 6 — Marketing & communications', description: 'Marketing mix, PR, số/mạng xã hội, KPI.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Vận hành & rủi ro|||Chapter 7 — Operations & risk', description: 'Run sheet, hậu cần, chu trình rủi ro, an toàn đám đông.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đánh giá & sự nghiệp|||Chapter 8 — Evaluation & careers', description: 'Báo cáo sau sự kiện, xu hướng, nghề nghiệp.', lessons: [c8, c8q] },
  ],
};
