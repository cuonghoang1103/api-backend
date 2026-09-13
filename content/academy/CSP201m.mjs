/**
 * CSP201m — Content Strategy Development / Xây dựng chiến lược nội dung.
 * Khối Công nghệ Truyền thông FPTU (Kỳ 4). Môn THỰC HÀNH/nâng cao: quy trình
 * xây dựng & triển khai một chiến lược nội dung hoàn chỉnh (đi cùng CSP202m
 * Introduction of Content Strategy — nền lý thuyết). Sách chuẩn: Halvorson &
 * Rach "Content Strategy for the Web", Pulizzi "Epic Content Marketing",
 * Bloomstein "Content Strategy at Work", Jones "Clout"; CMI, HubSpot Academy.
 * Giữ NGUYÊN slug/semester/thumb/courseCode. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('csp201m-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền tảng, tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CSP201m · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to build a real content strategy — goals, research, positioning, planning, production, distribution, governance and measurement — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Foundational books</h3>
<ul>
<li><a href="https://abookapart.com/products/content-strategy-for-the-web" target="_blank" rel="noopener"><em>Content Strategy for the Web</em> — Kristina Halvorson &amp; Melissa Rach</a></li>
<li><a href="https://contentmarketinginstitute.com/" target="_blank" rel="noopener"><em>Epic Content Marketing</em> — Joe Pulizzi (via CMI)</a></li>
<li><a href="https://rosenfeldmedia.com/books/content-strategy-at-work/" target="_blank" rel="noopener"><em>Content Strategy at Work</em> — Margot Bloomstein</a></li>
<li><a href="https://en.wikipedia.org/wiki/Content_strategy" target="_blank" rel="noopener"><em>Clout: The Art &amp; Science of Influential Web Content</em> — Colleen Jones</a></li>
</ul>
<h3>🌐 Official / free learning</h3>
<ul>
<li><a href="https://academy.hubspot.com/courses/content-marketing" target="_blank" rel="noopener">HubSpot Academy — Content Marketing (free certification)</a></li>
<li><a href="https://contentmarketinginstitute.com/articles/" target="_blank" rel="noopener">Content Marketing Institute — articles &amp; research</a></li>
<li><a href="https://www.nngroup.com/topic/content-strategy/" target="_blank" rel="noopener">Nielsen Norman Group — content strategy research</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://trends.google.com/trends/" target="_blank" rel="noopener">Google Trends</a> &amp; <a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — demand &amp; performance</li>
<li><a href="https://search.google.com/search-console/about" target="_blank" rel="noopener">Google Search Console</a> — SEO &amp; content queries</li>
<li><a href="https://coschedule.com/" target="_blank" rel="noopener">CoSchedule</a> / a shared spreadsheet — editorial calendar</li>
</ul>
<div class="callout"><span class="badge">4-step self-study path</span>
<ol>
<li><strong>Align</strong> — turn business goals into measurable content goals &amp; KPIs.</li>
<li><strong>Research</strong> — audience research, content audit, competitor analysis → insights.</li>
<li><strong>Plan &amp; produce</strong> — positioning, pillars, content model, editorial calendar, workflow.</li>
<li><strong>Distribute &amp; measure</strong> — multichannel distribution, governance, analytics &amp; ROI, iterate.</li>
</ol></div>`,
    `<span class="eyebrow">CSP201m · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để dựng một chiến lược nội dung thật — mục tiêu, nghiên cứu, định vị, lập kế hoạch, sản xuất, phân phối, quản trị và đo lường — gom về một chỗ. Slide &amp; giáo trình FPTU chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Sách nền tảng</h3>
<ul>
<li><a href="https://abookapart.com/products/content-strategy-for-the-web" target="_blank" rel="noopener"><em>Content Strategy for the Web</em> — Kristina Halvorson &amp; Melissa Rach</a></li>
<li><a href="https://contentmarketinginstitute.com/" target="_blank" rel="noopener"><em>Epic Content Marketing</em> — Joe Pulizzi (qua CMI)</a></li>
<li><a href="https://rosenfeldmedia.com/books/content-strategy-at-work/" target="_blank" rel="noopener"><em>Content Strategy at Work</em> — Margot Bloomstein</a></li>
<li><a href="https://en.wikipedia.org/wiki/Content_strategy" target="_blank" rel="noopener"><em>Clout: The Art &amp; Science of Influential Web Content</em> — Colleen Jones</a></li>
</ul>
<h3>🌐 Học chính thức / miễn phí</h3>
<ul>
<li><a href="https://academy.hubspot.com/courses/content-marketing" target="_blank" rel="noopener">HubSpot Academy — Content Marketing (chứng chỉ miễn phí)</a></li>
<li><a href="https://contentmarketinginstitute.com/articles/" target="_blank" rel="noopener">Content Marketing Institute — bài viết &amp; nghiên cứu</a></li>
<li><a href="https://www.nngroup.com/topic/content-strategy/" target="_blank" rel="noopener">Nielsen Norman Group — nghiên cứu content strategy</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://trends.google.com/trends/" target="_blank" rel="noopener">Google Trends</a> &amp; <a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — nhu cầu &amp; hiệu quả</li>
<li><a href="https://search.google.com/search-console/about" target="_blank" rel="noopener">Google Search Console</a> — SEO &amp; truy vấn nội dung</li>
<li><a href="https://coschedule.com/" target="_blank" rel="noopener">CoSchedule</a> / một bảng tính dùng chung — lịch biên tập</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học 4 bước</span>
<ol>
<li><strong>Align (căn chỉnh)</strong> — biến mục tiêu kinh doanh thành mục tiêu nội dung &amp; KPI đo được.</li>
<li><strong>Research (nghiên cứu)</strong> — audience research, content audit, phân tích đối thủ → insight.</li>
<li><strong>Plan &amp; produce (lập &amp; sản xuất)</strong> — định vị, trụ nội dung, content model, lịch biên tập, workflow.</li>
<li><strong>Distribute &amp; measure (phân phối &amp; đo)</strong> — phân phối đa kênh, quản trị, analytics &amp; ROI, cải tiến lặp.</li>
</ol></div>`,
  ]]);

const intro = doc('csp201m-0-1-overview', 'Course overview: Content Strategy Development|||Tổng quan: Xây dựng chiến lược nội dung',
  'Chiến lược nội dung là gì; khác gì với sản xuất nội dung; vì sao cần chiến lược; quan hệ với CSP202m (lý thuyết); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">CSP201m · Lesson 0.1 · Overview</span>
<h2>Content Strategy Development</h2>
<p class="lead">This is a <strong>hands-on</strong> course: you will build and ship a <strong>complete content strategy</strong> end-to-end. If <strong>CSP202m — Introduction of Content Strategy</strong> gives you the theory, CSP201m makes you <em>do</em> it — from a business goal all the way to a measured, governed, multichannel content operation.</p>
<h3>What is content strategy?</h3>
<p>Kristina Halvorson's classic definition: content strategy is <strong>planning for the creation, delivery and governance of useful, usable content</strong>. It is NOT "writing posts" — writing is production. Strategy decides <em>why</em> we publish, <em>for whom</em>, <em>what</em>, <em>where</em>, <em>how often</em>, <em>who owns it</em>, and <em>how we know it worked</em>.</p>
<h3>Strategy vs. production</h3>
<pre><code>STRATEGY  -> why / who / what / where / cadence / governance / metrics
PRODUCTION -> the actual articles, videos, posts, emails
Strategy is the map; production is the driving.
</code></pre>
<h3>Why bother?</h3>
<p>Without strategy you get "random acts of content": lots of publishing, no direction, no measurable return. A strategy ties every piece to a <strong>business goal</strong> and a <strong>KPI</strong>, so you can prove — and improve — ROI.</p>
<h3>Roadmap (8 chapters)</h3>
<p>Goals &amp; KPIs → research &amp; audit → positioning &amp; message → content model &amp; taxonomy → editorial calendar &amp; workflow → distribution &amp; repurposing → governance &amp; maintenance → measurement, optimization &amp; reporting. Each chapter has a bilingual lesson, a framework/template, a real-brand example and a quiz.</p>`,
    `<span class="eyebrow">CSP201m · Bài 0.1 · Tổng quan</span>
<h2>Xây dựng chiến lược nội dung</h2>
<p class="lead">Đây là môn <strong>thực hành</strong>: bạn sẽ dựng và triển khai một <strong>chiến lược nội dung hoàn chỉnh</strong> từ đầu tới cuối. Nếu <strong>CSP202m — Introduction of Content Strategy</strong> cho bạn lý thuyết, thì CSP201m bắt bạn <em>làm</em> — từ một mục tiêu kinh doanh tới một guồng nội dung đa kênh, được đo lường và quản trị.</p>
<h3>Chiến lược nội dung là gì?</h3>
<p>Định nghĩa kinh điển của Kristina Halvorson: chiến lược nội dung là <strong>hoạch định việc tạo, phân phối và quản trị nội dung hữu ích, dùng được</strong>. Nó KHÔNG phải "viết bài" — viết là sản xuất. Chiến lược quyết định <em>tại sao</em> xuất bản, <em>cho ai</em>, <em>cái gì</em>, <em>ở đâu</em>, <em>nhịp bao lâu</em>, <em>ai chịu trách nhiệm</em>, và <em>làm sao biết là hiệu quả</em>.</p>
<h3>Chiến lược vs. sản xuất</h3>
<pre><code>CHIẾN LƯỢC -> tại sao / cho ai / cái gì / ở đâu / nhịp / quản trị / chỉ số
SẢN XUẤT   -> bài viết, video, post, email cụ thể
Chiến lược là bản đồ; sản xuất là lái xe.
</code></pre>
<h3>Vì sao cần?</h3>
<p>Không có chiến lược thì thành "làm nội dung ngẫu hứng": xuất bản nhiều, không hướng, không đo được lợi ích. Chiến lược gắn mỗi mẩu nội dung với một <strong>mục tiêu kinh doanh</strong> và một <strong>KPI</strong>, để bạn chứng minh — và cải thiện — ROI.</p>
<h3>Lộ trình (8 chương)</h3>
<p>Mục tiêu &amp; KPI → nghiên cứu &amp; audit → định vị &amp; thông điệp → mô hình &amp; taxonomy → lịch biên tập &amp; workflow → phân phối &amp; tái sử dụng → quản trị &amp; duy trì → đo lường, tối ưu &amp; báo cáo. Mỗi chương có bài song ngữ, một framework/mẫu, một ví dụ thương hiệu thật và một quiz.</p>`,
  ]]);

const c1 = doc('csp201m-1-1-goals', '1.1 — From business goals to content goals|||1.1 — Từ mục tiêu kinh doanh tới mục tiêu nội dung',
  'Align nội dung với mục tiêu kinh doanh; chuỗi Business goal → content goal → content KPI; SMART & phễu; ví dụ Red Bull, HubSpot.',
  [[
    `<span class="eyebrow">CSP201m · Chapter 1 · Lesson 1.1</span>
<h2>From business goals to content goals</h2>
<p>Every content strategy must start where the business does. Content that is not tied to a goal is a cost, not an asset.</p>
<h3>The alignment chain</h3>
<pre><code>Business goal   -> Grow trial signups 30% this quarter
Content goal    -> Educate SME owners on the problem we solve
Content KPI     -> +25% organic sessions, 500 gated-guide leads
Content type    -> How-to articles, a lead-magnet guide, email nurture
</code></pre>
<p>Each level derives from the one above it. If you cannot draw the line from a piece of content back to a business goal, question why it exists.</p>
<h3>Make goals SMART</h3>
<p>A usable content goal is <strong>Specific, Measurable, Achievable, Relevant, Time-bound</strong>. "Get more traffic" is not a goal; "grow organic blog sessions 25% by end of Q3" is.</p>
<h3>Map goals to the funnel</h3>
<ul>
<li><strong>Awareness (TOFU)</strong> — reach &amp; brand recall (views, reach, new users).</li>
<li><strong>Consideration (MOFU)</strong> — engagement &amp; leads (time on page, subscribers, downloads).</li>
<li><strong>Decision (BOFU)</strong> — conversion &amp; revenue (trials, sales, assisted conversions).</li>
</ul>
<div class="callout"><span class="badge">Real brand — Red Bull</span> Red Bull's content goal is not "sell cans" directly; it is to <em>own the world of extreme sports &amp; adventure</em> so the brand is top-of-mind. Red Bull Media House runs like a publisher — video, events, a magazine — all serving the business goal of brand dominance. HubSpot works the other way: free educational content (blog, Academy) fuels a measurable inbound funnel into its software trials.</div>`,
    `<span class="eyebrow">CSP201m · Chương 1 · Bài 1.1</span>
<h2>Từ mục tiêu kinh doanh tới mục tiêu nội dung</h2>
<p>Mọi chiến lược nội dung phải bắt đầu từ nơi doanh nghiệp bắt đầu. Nội dung không gắn với mục tiêu là chi phí, không phải tài sản.</p>
<h3>Chuỗi căn chỉnh</h3>
<pre><code>Mục tiêu kinh doanh -> Tăng 30% đăng ký dùng thử quý này
Mục tiêu nội dung   -> Giáo dục chủ SME về vấn đề ta giải quyết
KPI nội dung        -> +25% phiên organic, 500 lead từ guide
Loại nội dung       -> Bài how-to, một guide lead-magnet, email nurture
</code></pre>
<p>Mỗi tầng suy ra từ tầng trên. Nếu không kẻ được đường từ một mẩu nội dung về một mục tiêu kinh doanh, hãy hỏi vì sao nó tồn tại.</p>
<h3>Đặt mục tiêu SMART</h3>
<p>Một mục tiêu nội dung dùng được phải <strong>Cụ thể, Đo được, Khả thi, Liên quan, Có hạn thời gian</strong>. "Tăng traffic" không phải mục tiêu; "tăng 25% phiên organic của blog trước hết Q3" thì có.</p>
<h3>Ánh xạ mục tiêu vào phễu</h3>
<ul>
<li><strong>Nhận biết (TOFU)</strong> — độ phủ &amp; nhớ thương hiệu (lượt xem, reach, người dùng mới).</li>
<li><strong>Cân nhắc (MOFU)</strong> — tương tác &amp; lead (thời gian trên trang, người đăng ký, lượt tải).</li>
<li><strong>Quyết định (BOFU)</strong> — chuyển đổi &amp; doanh thu (dùng thử, đơn hàng, assisted conversions).</li>
</ul>
<div class="callout"><span class="badge">Thương hiệu thật — Red Bull</span> Mục tiêu nội dung của Red Bull không phải "bán lon" trực tiếp, mà là <em>sở hữu thế giới thể thao mạo hiểm &amp; phiêu lưu</em> để thương hiệu luôn top-of-mind. Red Bull Media House vận hành như một nhà xuất bản — video, sự kiện, tạp chí — tất cả phục vụ mục tiêu thống trị thương hiệu. HubSpot đi chiều ngược: nội dung giáo dục miễn phí (blog, Academy) nuôi một phễu inbound đo được vào phần mềm.</div>`,
  ]]);

const c1q = quiz('csp201m-quiz-1', 'Quiz 1 — Goals & KPIs|||Quiz 1 — Mục tiêu & KPI', [
  { id: 'q1', question: 'Thứ tự đúng của chuỗi căn chỉnh nội dung?', options: ['KPI → mục tiêu kinh doanh → loại nội dung', 'Mục tiêu kinh doanh → mục tiêu nội dung → KPI nội dung', 'Loại nội dung → KPI → mục tiêu', 'Mục tiêu nội dung → mục tiêu kinh doanh'], correctIndex: 1, explanation: 'Nội dung phải suy ra từ mục tiêu kinh doanh, rồi tới KPI đo được.' },
  { id: 'q2', question: 'Đâu là mục tiêu nội dung "SMART"?', options: ['Tăng traffic', 'Nổi tiếng hơn', 'Tăng 25% phiên organic của blog trước hết Q3', 'Viết nhiều bài hơn'], correctIndex: 2, explanation: 'SMART = cụ thể, đo được, khả thi, liên quan, có hạn thời gian.' },
  { id: 'q3', question: 'Chỉ số phù hợp cho giai đoạn Nhận biết (TOFU)?', options: ['Số đơn hàng', 'Reach / lượt xem / người dùng mới', 'Doanh thu', 'Số hợp đồng ký'], correctIndex: 1, explanation: 'TOFU đo độ phủ & nhớ thương hiệu; doanh thu là BOFU.' },
]);

const c2 = doc('csp201m-2-1-research-audit', '2.1 — Research & analysis|||2.1 — Nghiên cứu & phân tích',
  'Audience research (persona, jobs-to-be-done, tìm kiếm), content audit (kiểm kê nội dung sẵn có), competitor & gap analysis → insight; ví dụ Airbnb.',
  [[
    `<span class="eyebrow">CSP201m · Chapter 2 · Lesson 2.1</span>
<h2>Research &amp; analysis</h2>
<p>Strategy is built on evidence, not opinion. Three research streams feed it: your audience, your existing content, and your competitors.</p>
<h3>1. Audience research</h3>
<p>Build <strong>personas</strong> and map their <strong>jobs-to-be-done</strong>: what problem are they trying to solve, in what words do they search, at what funnel stage? Sources: interviews, surveys, support tickets, Google Trends, Search Console queries, social listening.</p>
<h3>2. Content audit</h3>
<p>A <strong>content audit</strong> is a full inventory of what you already publish, scored so you can keep, improve, merge or kill each piece.</p>
<pre><code>Audit columns:
 URL | Title | Type | Owner | Traffic | Conversions
     | Last updated | Quality (1-5) | Action (keep/update/merge/kill)
</code></pre>
<h3>3. Competitor &amp; gap analysis</h3>
<p>Map what rivals cover well, then find the <strong>content gaps</strong> — high-demand topics nobody serves well. That gap is your opening.</p>
<h3>From data to insight</h3>
<p>Raw numbers are not insight. An <em>insight</em> is a decision-ready sentence: "SME owners search how-to questions but our library is all product pages — build a how-to hub."</p>
<div class="callout"><span class="badge">Real brand — Airbnb</span> Airbnb's early audience research showed travellers wanted to "live like a local", not just book a bed. That insight drove <em>Neighborhood Guides</em> and later the Airbnb magazine and Experiences — content built from a researched audience job, not from a guess.</div>`,
    `<span class="eyebrow">CSP201m · Chương 2 · Bài 2.1</span>
<h2>Nghiên cứu &amp; phân tích</h2>
<p>Chiến lược dựng trên bằng chứng, không phải cảm tính. Ba luồng nghiên cứu nuôi nó: khán giả, nội dung sẵn có, và đối thủ.</p>
<h3>1. Nghiên cứu khán giả</h3>
<p>Dựng <strong>persona</strong> và ánh xạ <strong>jobs-to-be-done</strong>: họ đang cố giải quyết vấn đề gì, tìm kiếm bằng từ nào, ở giai đoạn nào của phễu? Nguồn: phỏng vấn, khảo sát, ticket hỗ trợ, Google Trends, truy vấn Search Console, social listening.</p>
<h3>2. Content audit (kiểm kê nội dung)</h3>
<p><strong>Content audit</strong> là bản kiểm kê toàn bộ nội dung đang có, chấm điểm để quyết giữ, cải thiện, gộp hay loại từng mẩu.</p>
<pre><code>Cột audit:
 URL | Tiêu đề | Loại | Chủ | Traffic | Chuyển đổi
     | Cập nhật lần cuối | Chất lượng (1-5) | Hành động (giữ/sửa/gộp/xoá)
</code></pre>
<h3>3. Phân tích đối thủ &amp; khoảng trống</h3>
<p>Vẽ ra chỗ đối thủ làm tốt, rồi tìm <strong>khoảng trống nội dung</strong> — chủ đề nhu cầu cao mà chưa ai phục vụ tốt. Khoảng trống đó là cửa của bạn.</p>
<h3>Từ dữ liệu tới insight</h3>
<p>Con số thô chưa phải insight. <em>Insight</em> là một câu sẵn sàng để quyết: "Chủ SME tìm câu hỏi how-to nhưng thư viện của ta toàn trang sản phẩm — hãy dựng một hub how-to."</p>
<div class="callout"><span class="badge">Thương hiệu thật — Airbnb</span> Nghiên cứu khán giả thời đầu của Airbnb cho thấy khách muốn "sống như dân địa phương", không chỉ đặt chỗ ngủ. Insight đó dẫn tới <em>Neighborhood Guides</em>, rồi tạp chí Airbnb và Experiences — nội dung dựng từ một "job" đã nghiên cứu, không phải phỏng đoán.</div>`,
  ]]);

const c2q = quiz('csp201m-quiz-2', 'Quiz 2 — Research & audit|||Quiz 2 — Nghiên cứu & audit', [
  { id: 'q1', question: 'Content audit là gì?', options: ['Lịch xuất bản tương lai', 'Bản kiểm kê & chấm điểm nội dung ĐANG có để quyết giữ/sửa/gộp/xoá', 'Ngân sách quảng cáo', 'Danh sách đối thủ'], correctIndex: 1, explanation: 'Audit kiểm kê nội dung hiện tại, mỗi mẩu gắn một hành động.' },
  { id: 'q2', question: '"Content gap" (khoảng trống nội dung) là?', options: ['Chủ đề nhu cầu cao mà chưa ai phục vụ tốt', 'Khoảng nghỉ giữa hai bài', 'Lỗi chính tả', 'Nội dung trùng lặp'], correctIndex: 0, explanation: 'Gap = cơ hội: nhu cầu có, nguồn cung tốt thì thiếu.' },
  { id: 'q3', question: 'Đâu là một "insight" (chứ không phải dữ liệu thô)?', options: ['Blog có 10.000 lượt xem', 'Bounce rate 60%', 'Khán giả tìm how-to nhưng thư viện toàn trang sản phẩm — cần hub how-to', '3 đối thủ đăng mỗi ngày'], correctIndex: 2, explanation: 'Insight là câu sẵn sàng để quyết hành động, không chỉ là số.' },
]);

const c3 = doc('csp201m-3-1-positioning', '3.1 — Positioning & messaging|||3.1 — Định vị & thông điệp nội dung',
  'Core message, content pillars (trụ nội dung), brand voice & tone, differentiation; message architecture của Bloomstein; ví dụ Mailchimp, Nike.',
  [[
    `<span class="eyebrow">CSP201m · Chapter 3 · Lesson 3.1</span>
<h2>Positioning &amp; messaging</h2>
<p>Positioning answers: <em>what do we stand for, to whom, and why us and not a rival?</em> It turns research into a voice the whole team can share.</p>
<h3>Core message &amp; message architecture</h3>
<p>Margot Bloomstein's <strong>message architecture</strong> is a ranked list of communication goals — the adjectives you want the audience to feel — agreed <em>before</em> any writing. It is the tie-breaker for every later content decision.</p>
<h3>Content pillars</h3>
<p><strong>Content pillars</strong> are the 3-5 themes you will own. Every piece maps to a pillar; anything that fits none is off-strategy.</p>
<pre><code>Pillar example (a fintech app):
 1. Smart budgeting
 2. Debt-free living
 3. Beginner investing
 4. Financial confidence for young adults
</code></pre>
<h3>Brand voice &amp; tone</h3>
<p><strong>Voice</strong> is your consistent personality; <strong>tone</strong> flexes by context (a celebration email vs. an outage notice). Document both so ten writers still sound like one brand.</p>
<h3>Differentiation</h3>
<p>State plainly why your content is worth choosing — a unique angle, depth, format, or point of view a competitor cannot copy cheaply.</p>
<div class="callout"><span class="badge">Real brand — Mailchimp &amp; Nike</span> Mailchimp's public <em>Content Style Guide</em> and its "Voice &amp; Tone" work are a gold standard: one voice (plain, warm, a little offbeat), many tones by situation. Nike positions around a single core message — human potential, "Just Do It" — and every pillar (athletes, everyday runners, social causes) ladders back to it.</div>`,
    `<span class="eyebrow">CSP201m · Chương 3 · Bài 3.1</span>
<h2>Định vị &amp; thông điệp nội dung</h2>
<p>Định vị trả lời: <em>ta đại diện cho điều gì, cho ai, và vì sao chọn ta chứ không phải đối thủ?</em> Nó biến nghiên cứu thành một tiếng nói cả đội cùng dùng.</p>
<h3>Thông điệp lõi &amp; message architecture</h3>
<p><strong>Message architecture</strong> của Margot Bloomstein là một danh sách xếp hạng các mục tiêu truyền thông — những tính từ bạn muốn khán giả cảm nhận — được thống nhất <em>trước</em> khi viết. Đó là "trọng tài" cho mọi quyết định nội dung về sau.</p>
<h3>Trụ nội dung (content pillars)</h3>
<p><strong>Trụ nội dung</strong> là 3-5 chủ đề bạn sẽ sở hữu. Mỗi mẩu nội dung ánh xạ về một trụ; thứ gì không thuộc trụ nào là lệch chiến lược.</p>
<pre><code>Ví dụ trụ (một app fintech):
 1. Quản chi thông minh
 2. Sống không nợ
 3. Đầu tư cho người mới
 4. Tự tin tài chính cho người trẻ
</code></pre>
<h3>Brand voice &amp; tone</h3>
<p><strong>Voice (chất giọng)</strong> là cá tính nhất quán; <strong>tone (sắc thái)</strong> linh hoạt theo ngữ cảnh (email ăn mừng khác thông báo sự cố). Ghi cả hai để mười người viết vẫn nghe như một thương hiệu.</p>
<h3>Khác biệt hoá</h3>
<p>Nói thẳng vì sao nội dung của bạn đáng chọn — một góc nhìn, độ sâu, định dạng hay quan điểm mà đối thủ khó sao chép rẻ.</p>
<div class="callout"><span class="badge">Thương hiệu thật — Mailchimp &amp; Nike</span> <em>Content Style Guide</em> công khai và mảng "Voice &amp; Tone" của Mailchimp là chuẩn vàng: một chất giọng (giản dị, ấm, hơi lạ), nhiều sắc thái theo tình huống. Nike định vị quanh một thông điệp lõi — tiềm năng con người, "Just Do It" — và mọi trụ (vận động viên, người chạy thường ngày, vấn đề xã hội) đều dẫn về nó.</div>`,
  ]]);

const c3q = quiz('csp201m-quiz-3', 'Quiz 3 — Positioning & message|||Quiz 3 — Định vị & thông điệp', [
  { id: 'q1', question: 'Content pillars (trụ nội dung) là gì?', options: ['3-5 chủ đề cốt lõi mà thương hiệu sẽ sở hữu, mọi mẩu nội dung ánh xạ về', 'Cột trong bảng tính', 'Số bài đăng mỗi tuần', 'Ngân sách quảng cáo'], correctIndex: 0, explanation: 'Pillar giữ nội dung tập trung; thứ không thuộc trụ nào là lệch chiến lược.' },
  { id: 'q2', question: 'Khác biệt giữa "voice" và "tone"?', options: ['Giống hệt nhau', 'Voice là cá tính nhất quán; tone linh hoạt theo ngữ cảnh', 'Voice cho video, tone cho bài viết', 'Tone là logo'], correctIndex: 1, explanation: 'Một voice, nhiều tone theo tình huống (vui, khủng hoảng...).' },
  { id: 'q3', question: 'Message architecture (Bloomstein) được thống nhất khi nào?', options: ['Sau khi xuất bản', 'TRƯỚC khi viết, làm trọng tài cho mọi quyết định nội dung', 'Chỉ khi có khủng hoảng', 'Không cần thiết'], correctIndex: 1, explanation: 'Danh sách mục tiêu truyền thông xếp hạng, chốt trước khi sản xuất.' },
]);

const c4 = doc('csp201m-4-1-content-model', '4.1 — Content planning & model|||4.1 — Kế hoạch & mô hình nội dung',
  'Content model & content types, taxonomy/metadata, mô hình hub-and-spoke (pillar & cluster), lập kế hoạch theo chủ đề; ví dụ HubSpot topic clusters.',
  [[
    `<span class="eyebrow">CSP201m · Chapter 4 · Lesson 4.1</span>
<h2>Content planning &amp; model</h2>
<p>Once you know your pillars, you design <em>how</em> content is structured, typed and connected — before you write a word.</p>
<h3>Content types &amp; content model</h3>
<p>A <strong>content model</strong> defines the reusable structures you publish: e.g. an "article" has title, author, summary, body, hero image, tags. Naming your <strong>content types</strong> (guide, how-to, case study, glossary, video, checklist) keeps production consistent and reusable.</p>
<h3>Taxonomy &amp; metadata</h3>
<p><strong>Taxonomy</strong> is your system of categories and tags; <strong>metadata</strong> describes each piece (topic, stage, persona, pillar). Good taxonomy powers navigation, search, filtering and repurposing later.</p>
<h3>Hub-and-spoke (pillar &amp; cluster)</h3>
<pre><code>        [ Pillar page: "Content marketing" ]
        /        |          |          \\
 [cluster: SEO][cluster: email][cluster: video][cluster: KPIs]
 Each cluster links UP to the pillar; the pillar links DOWN to each.
</code></pre>
<p>The hub (pillar) covers a broad topic; the spokes (clusters) go deep on subtopics and interlink. This structure helps both readers and search engines understand your authority on a theme.</p>
<div class="callout"><span class="badge">Real brand — HubSpot</span> HubSpot popularized the <em>topic cluster</em> model: one comprehensive pillar page per core topic, surrounded by many cluster articles that all link back. It reorganized their whole blog around clusters and reported stronger rankings — a direct outcome of a deliberate content model, not more posting.</div>`,
    `<span class="eyebrow">CSP201m · Chương 4 · Bài 4.1</span>
<h2>Kế hoạch &amp; mô hình nội dung</h2>
<p>Khi đã biết các trụ, bạn thiết kế <em>cách</em> nội dung được cấu trúc, phân loại và liên kết — trước khi viết một chữ.</p>
<h3>Loại nội dung &amp; content model</h3>
<p><strong>Content model</strong> định nghĩa các cấu trúc tái sử dụng bạn xuất bản: vd một "bài viết" có tiêu đề, tác giả, tóm tắt, thân bài, ảnh hero, thẻ. Đặt tên <strong>loại nội dung</strong> (guide, how-to, case study, thuật ngữ, video, checklist) giữ sản xuất nhất quán và tái dùng được.</p>
<h3>Taxonomy &amp; metadata</h3>
<p><strong>Taxonomy</strong> là hệ thống danh mục và thẻ; <strong>metadata</strong> mô tả từng mẩu (chủ đề, giai đoạn, persona, trụ). Taxonomy tốt cấp năng lượng cho điều hướng, tìm kiếm, lọc và tái sử dụng về sau.</p>
<h3>Hub-and-spoke (pillar &amp; cluster)</h3>
<pre><code>        [ Trang trụ: "Content marketing" ]
        /        |          |          \\
 [cluster: SEO][cluster: email][cluster: video][cluster: KPI]
 Mỗi cluster liên kết LÊN trang trụ; trang trụ liên kết XUỐNG từng cluster.
</code></pre>
<p>Hub (trụ) bao chủ đề rộng; các spoke (cluster) đào sâu chủ đề con và liên kết chéo. Cấu trúc này giúp cả độc giả lẫn công cụ tìm kiếm hiểu độ uy tín của bạn về một chủ đề.</p>
<div class="callout"><span class="badge">Thương hiệu thật — HubSpot</span> HubSpot phổ biến mô hình <em>topic cluster</em>: một trang trụ đầy đủ cho mỗi chủ đề lõi, vây quanh bởi nhiều bài cluster cùng liên kết về. Họ tổ chức lại cả blog quanh cluster và báo cáo thứ hạng tốt hơn — kết quả trực tiếp của một content model có chủ đích, không phải đăng nhiều hơn.</div>`,
  ]]);

const c4q = quiz('csp201m-quiz-4', 'Quiz 4 — Content model|||Quiz 4 — Mô hình nội dung', [
  { id: 'q1', question: 'Mô hình hub-and-spoke (pillar & cluster) hoạt động thế nào?', options: ['Mỗi bài độc lập, không liên kết', 'Một trang trụ rộng, nhiều cluster đào sâu chủ đề con và liên kết về trụ', 'Chỉ đăng lên mạng xã hội', 'Xoá bài cũ mỗi tháng'], correctIndex: 1, explanation: 'Hub bao chủ đề rộng; spoke đào sâu và liên kết chéo về hub.' },
  { id: 'q2', question: 'Content model dùng để làm gì?', options: ['Định nghĩa cấu trúc tái sử dụng của mỗi loại nội dung (trường dữ liệu)', 'Tính lương nhân viên', 'Chạy quảng cáo', 'Đo bounce rate'], correctIndex: 0, explanation: 'Model chuẩn hoá cấu trúc (tiêu đề, tóm tắt, thân, thẻ...) để nhất quán & tái dùng.' },
  { id: 'q3', question: 'Taxonomy & metadata giúp ích chủ yếu ở đâu?', options: ['Điều hướng, tìm kiếm, lọc & tái sử dụng nội dung', 'Thiết kế logo', 'Đàm phán giá quảng cáo', 'Viết hợp đồng'], correctIndex: 0, explanation: 'Danh mục/thẻ + mô tả từng mẩu cấp năng lượng cho tìm & tái dùng.' },
]);

const c5 = doc('csp201m-5-1-editorial-calendar', '5.1 — Editorial calendar & production|||5.1 — Lịch biên tập & quy trình sản xuất',
  'Editorial calendar, workflow sản xuất (ý tưởng→duyệt→xuất bản), vai trò (RACI), sản xuất quy mô; ví dụ Buffer/CoSchedule.',
  [[
    `<span class="eyebrow">CSP201m · Chapter 5 · Lesson 5.1</span>
<h2>Editorial calendar &amp; production</h2>
<p>A strategy only ships if there is a repeatable machine to produce it. That machine is the editorial calendar plus a defined workflow.</p>
<h3>The editorial calendar</h3>
<p>An <strong>editorial calendar</strong> schedules what publishes, when, on which channel, mapped to a pillar and a funnel stage. It converts strategy into a predictable cadence and prevents last-minute scrambling.</p>
<pre><code>Calendar columns:
 Date | Title | Pillar | Type | Channel | Funnel stage
      | Owner | Status | CTA | Notes
</code></pre>
<h3>Production workflow</h3>
<pre><code>Idea -> Brief -> Draft -> Edit -> SEO/design -> Approve -> Publish -> Promote
Each stage has an owner and a "definition of done".
</code></pre>
<h3>Roles (RACI)</h3>
<p>Clarify who is <strong>Responsible</strong> (does the work), <strong>Accountable</strong> (signs off), <strong>Consulted</strong>, and <strong>Informed</strong> for each stage. Ambiguous ownership is the number-one cause of stalled content.</p>
<h3>Producing at scale</h3>
<p>Briefs, templates, a style guide and a content model let you scale output without losing consistency — and make freelancers and new hires productive fast.</p>
<div class="callout"><span class="badge">Real brand — Buffer &amp; CoSchedule</span> Buffer runs an open, transparent editorial process with clear owners and cadence; CoSchedule literally built a product around the editorial calendar after using one to align its own team. Both prove the same point: consistent publishing is an operations problem, solved by calendar + workflow, not by inspiration.</div>`,
    `<span class="eyebrow">CSP201m · Chương 5 · Bài 5.1</span>
<h2>Lịch biên tập &amp; quy trình sản xuất</h2>
<p>Chiến lược chỉ ra được thành phẩm nếu có một cỗ máy lặp lại để sản xuất. Cỗ máy đó là lịch biên tập cộng một workflow rõ ràng.</p>
<h3>Lịch biên tập</h3>
<p><strong>Lịch biên tập</strong> xếp lịch xuất bản cái gì, khi nào, trên kênh nào, gắn với một trụ và một giai đoạn phễu. Nó biến chiến lược thành nhịp đều đặn, dự đoán được, tránh chạy nước rút phút chót.</p>
<pre><code>Cột lịch:
 Ngày | Tiêu đề | Trụ | Loại | Kênh | Giai đoạn phễu
      | Chủ | Trạng thái | CTA | Ghi chú
</code></pre>
<h3>Workflow sản xuất</h3>
<pre><code>Ý tưởng -> Brief -> Bản nháp -> Biên tập -> SEO/thiết kế -> Duyệt -> Xuất bản -> Quảng bá
Mỗi bước có một chủ và một "định nghĩa hoàn thành".
</code></pre>
<h3>Vai trò (RACI)</h3>
<p>Làm rõ ai <strong>Responsible</strong> (làm), <strong>Accountable</strong> (chốt duyệt), <strong>Consulted</strong> (được hỏi), <strong>Informed</strong> (được báo) cho mỗi bước. Sở hữu mập mờ là nguyên nhân số một khiến nội dung tắc.</p>
<h3>Sản xuất quy mô</h3>
<p>Brief, mẫu, style guide và content model cho phép mở rộng sản lượng mà không mất nhất quán — và giúp freelancer, người mới vào việc nhanh.</p>
<div class="callout"><span class="badge">Thương hiệu thật — Buffer &amp; CoSchedule</span> Buffer chạy một quy trình biên tập minh bạch, chủ sở hữu và nhịp rõ ràng; CoSchedule dựng hẳn một sản phẩm quanh lịch biên tập sau khi dùng nó để căn chỉnh đội mình. Cả hai chứng minh cùng một điều: xuất bản đều đặn là bài toán vận hành, giải bằng lịch + workflow, không phải bằng cảm hứng.</div>`,
  ]]);

const c5q = quiz('csp201m-quiz-5', 'Quiz 5 — Calendar & workflow|||Quiz 5 — Lịch & quy trình', [
  { id: 'q1', question: 'Lịch biên tập (editorial calendar) chủ yếu để làm gì?', options: ['Tính thuế', 'Xếp lịch xuất bản cái gì/khi nào/kênh nào, gắn trụ & giai đoạn phễu', 'Thiết kế banner', 'Lưu mật khẩu'], correctIndex: 1, explanation: 'Biến chiến lược thành nhịp đều đặn, dự đoán được.' },
  { id: 'q2', question: 'Trong RACI, ai là người "Accountable"?', options: ['Người làm phần việc', 'Người chốt duyệt / chịu trách nhiệm cuối', 'Người chỉ được thông báo', 'Khách hàng'], correctIndex: 1, explanation: 'Accountable = ký duyệt; Responsible = người thực thi.' },
  { id: 'q3', question: 'Điều gì giúp sản xuất nội dung ở QUY MÔ mà vẫn nhất quán?', options: ['Cảm hứng nhất thời', 'Brief, mẫu, style guide & content model', 'Đăng ngẫu hứng', 'Bỏ khâu biên tập'], correctIndex: 1, explanation: 'Chuẩn hoá quy trình giúp nhiều người viết vẫn ra một chất lượng.' },
]);

const c6 = doc('csp201m-6-1-distribution', '6.1 — Multichannel distribution & repurposing|||6.1 — Phân phối đa kênh & tái sử dụng',
  'Owned/earned/paid (mô hình PESO), phân phối đa kênh, tái sử dụng 1 nội dung thành nhiều, SEO như kênh phân phối; ví dụ Gary Vaynerchuk.',
  [[
    `<span class="eyebrow">CSP201m · Chapter 6 · Lesson 6.1</span>
<h2>Multichannel distribution &amp; repurposing</h2>
<p>Great content that nobody sees has zero value. Distribution and repurposing are how strategy earns its reach.</p>
<h3>Owned, earned, paid (the PESO model)</h3>
<ul>
<li><strong>Owned</strong> — your site, blog, email list, app (you control it).</li>
<li><strong>Earned</strong> — press, mentions, shares, backlinks (others give it).</li>
<li><strong>Paid</strong> — ads, sponsored posts, boosted content (you buy reach).</li>
<li><strong>Shared</strong> — social channels (the "S" in PESO, blending earned &amp; owned).</li>
</ul>
<h3>SEO as a distribution channel</h3>
<p>Search is owned distribution that compounds. Match content to real queries, structure it with your hub-and-spoke model, and it keeps pulling traffic long after publish — unlike a social post that fades in hours.</p>
<h3>Repurposing: one idea, many formats</h3>
<pre><code>1 pillar article ->
   - a Twitter/LinkedIn thread
   - a short-form video / Reel
   - an email newsletter
   - an infographic / carousel
   - a podcast talking point
</code></pre>
<p>Repurposing multiplies ROI per idea and meets each audience where it already is.</p>
<div class="callout"><span class="badge">Real brand — Gary Vaynerchuk</span> GaryVee's team documents a "content pyramid": one long-form pillar (a keynote or video) is sliced into dozens of micro-pieces tailored per platform. Same core idea, reformatted for each channel's native style — the repurposing engine that produces a huge daily volume from a single recording.</div>`,
    `<span class="eyebrow">CSP201m · Chương 6 · Bài 6.1</span>
<h2>Phân phối đa kênh &amp; tái sử dụng</h2>
<p>Nội dung hay mà không ai thấy thì giá trị bằng không. Phân phối và tái sử dụng là cách chiến lược kiếm được độ phủ.</p>
<h3>Owned, earned, paid (mô hình PESO)</h3>
<ul>
<li><strong>Owned (sở hữu)</strong> — website, blog, email list, app (bạn kiểm soát).</li>
<li><strong>Earned (kiếm được)</strong> — báo chí, nhắc tên, chia sẻ, backlink (người khác cho).</li>
<li><strong>Paid (trả tiền)</strong> — quảng cáo, bài tài trợ, đẩy tin (mua độ phủ).</li>
<li><strong>Shared (chia sẻ)</strong> — kênh mạng xã hội (chữ "S" trong PESO, pha earned &amp; owned).</li>
</ul>
<h3>SEO như một kênh phân phối</h3>
<p>Tìm kiếm là phân phối sở hữu và cộng dồn. Khớp nội dung với truy vấn thật, cấu trúc bằng mô hình hub-and-spoke, nó kéo traffic bền lâu sau khi xuất bản — khác một post mạng xã hội tàn trong vài giờ.</p>
<h3>Tái sử dụng: một ý tưởng, nhiều định dạng</h3>
<pre><code>1 bài trụ ->
   - một thread Twitter/LinkedIn
   - một video ngắn / Reel
   - một email newsletter
   - một infographic / carousel
   - một luận điểm cho podcast
</code></pre>
<p>Tái sử dụng nhân ROI trên mỗi ý tưởng và gặp khán giả ngay nơi họ đang ở.</p>
<div class="callout"><span class="badge">Thương hiệu thật — Gary Vaynerchuk</span> Đội GaryVee ghi lại một "kim tự tháp nội dung": một mẩu long-form trụ (một keynote hay video) được cắt thành hàng chục micro-piece may đo theo từng nền tảng. Cùng một ý lõi, tái định dạng theo phong cách bản địa của mỗi kênh — cỗ máy tái sử dụng tạo ra sản lượng ngày khổng lồ từ một lần quay.</div>`,
  ]]);

const c6q = quiz('csp201m-quiz-6', 'Quiz 6 — Distribution & repurposing|||Quiz 6 — Phân phối & tái sử dụng', [
  { id: 'q1', question: 'Trong mô hình PESO, kênh "owned" là?', options: ['Báo chí nhắc tên', 'Quảng cáo trả tiền', 'Website, blog, email list, app do bạn kiểm soát', 'Bài chia sẻ của người lạ'], correctIndex: 2, explanation: 'Owned = kênh bạn sở hữu & kiểm soát; earned do người khác cho.' },
  { id: 'q2', question: 'Vì sao SEO là kênh phân phối đáng giá?', options: ['Kết quả tàn trong vài giờ', 'Là phân phối sở hữu, cộng dồn, kéo traffic bền lâu sau khi xuất bản', 'Chỉ tốn tiền', 'Không đo được'], correctIndex: 1, explanation: 'Khớp truy vấn thật + cấu trúc tốt → traffic bền, khác social nhanh tàn.' },
  { id: 'q3', question: '"Repurposing" (tái sử dụng) nghĩa là?', options: ['Xoá nội dung cũ', 'Biến một ý tưởng lõi thành nhiều định dạng cho nhiều kênh', 'Sao chép của đối thủ', 'Chỉ đăng lại y hệt'], correctIndex: 1, explanation: 'Một bài trụ → thread, video ngắn, email, infographic... nhân ROI mỗi ý.' },
]);

const c7 = doc('csp201m-7-1-governance', '7.1 — Content governance & maintenance|||7.1 — Quản trị & duy trì nội dung',
  'Content governance (ai quyết gì), style guide, vòng đời nội dung, kiểm ROT (redundant/outdated/trivial), cập nhật/loại bỏ; ví dụ GOV.UK.',
  [[
    `<span class="eyebrow">CSP201m · Chapter 7 · Lesson 7.1</span>
<h2>Content governance &amp; maintenance</h2>
<p>Publishing is easy; keeping content accurate, on-brand and useful over years is the hard part. Governance is the system that keeps a strategy alive after launch.</p>
<h3>What governance covers</h3>
<ul>
<li><strong>Roles &amp; decisions</strong> — who can create, edit, approve and retire content.</li>
<li><strong>Standards</strong> — a <strong>style guide</strong> (voice, grammar, formatting, accessibility, SEO rules).</li>
<li><strong>Process</strong> — review cycles, legal/brand checks, versioning.</li>
</ul>
<h3>The content lifecycle</h3>
<pre><code>Create -> Publish -> Maintain (review on a schedule) -> Update / Archive / Retire
Content is not "done" at publish; it has a lifecycle.
</code></pre>
<h3>ROT audits</h3>
<p>Periodically hunt <strong>ROT</strong> — content that is <strong>Redundant, Outdated or Trivial</strong>. Merge duplicates, refresh stale pages, and delete low-value pages. Less but better content ranks higher and is cheaper to maintain.</p>
<h3>Style guide</h3>
<p>A living style guide is the operational contract for consistency: it turns "brand voice" into rules ten writers can follow without asking.</p>
<div class="callout"><span class="badge">Real brand — GOV.UK</span> The UK government's GOV.UK is the textbook case of governance at scale: a strict public style guide, evidence-based plain-language rules, and a discipline of retiring or merging pages so a vast site stays usable. They famously deleted thousands of redundant pages — governance treated as ongoing maintenance, not a one-off launch.</div>`,
    `<span class="eyebrow">CSP201m · Chương 7 · Bài 7.1</span>
<h2>Quản trị &amp; duy trì nội dung</h2>
<p>Xuất bản thì dễ; giữ nội dung chính xác, đúng thương hiệu và hữu ích qua nhiều năm mới khó. Quản trị là hệ thống giữ chiến lược sống sau khi ra mắt.</p>
<h3>Quản trị bao gồm gì</h3>
<ul>
<li><strong>Vai trò &amp; quyết định</strong> — ai được tạo, sửa, duyệt và loại bỏ nội dung.</li>
<li><strong>Chuẩn mực</strong> — một <strong>style guide</strong> (chất giọng, ngữ pháp, định dạng, accessibility, luật SEO).</li>
<li><strong>Quy trình</strong> — chu kỳ rà soát, kiểm pháp lý/thương hiệu, quản phiên bản.</li>
</ul>
<h3>Vòng đời nội dung</h3>
<pre><code>Tạo -> Xuất bản -> Duy trì (rà theo lịch) -> Cập nhật / Lưu trữ / Loại bỏ
Nội dung không "xong" lúc xuất bản; nó có vòng đời.
</code></pre>
<h3>Kiểm ROT</h3>
<p>Định kỳ săn <strong>ROT</strong> — nội dung <strong>Redundant (trùng), Outdated (lỗi thời) hoặc Trivial (vụn vặt)</strong>. Gộp bản trùng, làm mới trang cũ, xoá trang giá trị thấp. Ít mà chất thì thứ hạng cao hơn và rẻ hơn khi duy trì.</p>
<h3>Style guide</h3>
<p>Một style guide sống là hợp đồng vận hành cho tính nhất quán: nó biến "brand voice" thành luật mà mười người viết theo được mà không phải hỏi.</p>
<div class="callout"><span class="badge">Thương hiệu thật — GOV.UK</span> GOV.UK của chính phủ Anh là ca sách giáo khoa về quản trị ở quy mô lớn: một style guide công khai nghiêm ngặt, luật ngôn ngữ giản dị dựa trên bằng chứng, và kỷ luật loại bỏ hoặc gộp trang để một site khổng lồ vẫn dùng được. Họ nổi tiếng vì đã xoá hàng nghìn trang trùng lặp — quản trị được coi là duy trì liên tục, không phải một lần ra mắt.</div>`,
  ]]);

const c7q = quiz('csp201m-quiz-7', 'Quiz 7 — Governance & maintenance|||Quiz 7 — Quản trị & duy trì', [
  { id: 'q1', question: 'Content governance chủ yếu quyết định điều gì?', options: ['Màu logo', 'Ai được tạo/sửa/duyệt/loại bỏ nội dung + chuẩn mực & quy trình', 'Giá quảng cáo', 'Lịch nghỉ lễ'], correctIndex: 1, explanation: 'Governance = vai trò, chuẩn (style guide) và quy trình giữ chiến lược sống.' },
  { id: 'q2', question: 'Kiểm "ROT" tìm loại nội dung nào?', options: ['Redundant, Outdated, Trivial (trùng, lỗi thời, vụn vặt)', 'Nội dung mới nhất', 'Nội dung bán chạy', 'Nội dung trả phí'], correctIndex: 0, explanation: 'ROT audit gộp/làm mới/xoá để ít mà chất, dễ duy trì.' },
  { id: 'q3', question: 'Nói nội dung có "vòng đời" nghĩa là?', options: ['Xong hẳn ngay khi xuất bản', 'Cần duy trì, cập nhật, lưu trữ hoặc loại bỏ theo thời gian', 'Không bao giờ được xoá', 'Chỉ đăng một lần rồi quên'], correctIndex: 1, explanation: 'Tạo→xuất bản→duy trì→cập nhật/lưu trữ/loại bỏ.' },
]);

const c8 = doc('csp201m-8-1-measurement', '8.1 — Measurement, optimization & reporting|||8.1 — Đo lường, tối ưu & báo cáo',
  'Analytics & KPI theo phễu (TOFU/MOFU/BOFU), content ROI, cải tiến lặp (test→học→sửa), trình bày kết quả cho lãnh đạo; ví dụ dashboard.',
  [[
    `<span class="eyebrow">CSP201m · Chapter 8 · Lesson 8.1</span>
<h2>Measurement, optimization &amp; reporting</h2>
<p>Measurement closes the loop opened in Chapter 1: it proves whether content hit its goals, and it tells you what to do next.</p>
<h3>KPIs by funnel stage</h3>
<pre><code>TOFU (awareness)   -> reach, impressions, new users, organic sessions
MOFU (consideration)-> time on page, email signups, downloads, return visits
BOFU (decision)    -> leads, trials, sales, assisted conversions
</code></pre>
<p>Pick a small set of KPIs per stage — vanity metrics (raw likes) look nice but rarely tie to the business goal.</p>
<h3>Content ROI</h3>
<pre><code>Content ROI = (value generated - cost to produce &amp; promote) / cost
Value = leads x close rate x deal value (or ad-equivalent, or LTV lift)
</code></pre>
<p>Even a rough ROI model forces the discipline of tying content to money — and defends the budget.</p>
<h3>Iterate: test, learn, refine</h3>
<p>Treat content as experiments: form a hypothesis, ship, measure against the KPI, then double down on what works and cut what does not. Optimization is continuous, not a year-end event.</p>
<h3>Reporting</h3>
<p>Report to the audience you are speaking to: executives want goals, ROI and decisions on one dashboard; the content team wants per-piece performance. Always pair the number with the <strong>so-what</strong> and the next action.</p>
<div class="callout"><span class="badge">Real brand — a KPI dashboard</span> Mature content teams (e.g. those following CMI/HubSpot practice) run a single dashboard: goal → KPI → this-period result → trend → next action. Reporting is not a data dump; it is a decision document that closes the loop back to the business goals from Chapter 1.</div>`,
    `<span class="eyebrow">CSP201m · Chương 8 · Bài 8.1</span>
<h2>Đo lường, tối ưu &amp; báo cáo</h2>
<p>Đo lường khép lại vòng lặp mở ra ở Chương 1: nó chứng minh nội dung có đạt mục tiêu không, và nói cho bạn phải làm gì tiếp.</p>
<h3>KPI theo giai đoạn phễu</h3>
<pre><code>TOFU (nhận biết)   -> reach, hiển thị, người dùng mới, phiên organic
MOFU (cân nhắc)    -> thời gian trên trang, đăng ký email, tải, quay lại
BOFU (quyết định)  -> lead, dùng thử, đơn hàng, assisted conversions
</code></pre>
<p>Chọn một bộ nhỏ KPI cho mỗi giai đoạn — chỉ số phù phiếm (like thô) nhìn đẹp nhưng hiếm khi gắn với mục tiêu kinh doanh.</p>
<h3>Content ROI</h3>
<pre><code>Content ROI = (giá trị tạo ra - chi phí sản xuất &amp; quảng bá) / chi phí
Giá trị = số lead x tỉ lệ chốt x giá trị đơn (hoặc quy đổi quảng cáo, hoặc LTV)
</code></pre>
<p>Ngay cả một mô hình ROI thô cũng ép kỷ luật gắn nội dung với tiền — và bảo vệ ngân sách.</p>
<h3>Cải tiến lặp: test, học, sửa</h3>
<p>Coi nội dung như thí nghiệm: đặt giả thuyết, xuất bản, đo theo KPI, rồi tăng gấp cái hiệu quả và cắt cái không. Tối ưu là liên tục, không phải sự kiện cuối năm.</p>
<h3>Báo cáo</h3>
<p>Báo cáo theo đúng người nghe: lãnh đạo muốn mục tiêu, ROI và quyết định trên một dashboard; đội nội dung muốn hiệu quả từng mẩu. Luôn ghép con số với <strong>vậy thì sao</strong> và hành động kế tiếp.</p>
<div class="callout"><span class="badge">Thương hiệu thật — dashboard KPI</span> Các đội nội dung trưởng thành (theo thực hành CMI/HubSpot) chạy một dashboard duy nhất: mục tiêu → KPI → kết quả kỳ này → xu hướng → hành động kế tiếp. Báo cáo không phải bãi dữ liệu; nó là tài liệu quyết định khép vòng về đúng mục tiêu kinh doanh ở Chương 1.</div>`,
  ]]);

const c8q = quiz('csp201m-quiz-8', 'Quiz 8 — Measurement & ROI|||Quiz 8 — Đo lường & ROI', [
  { id: 'q1', question: 'Chỉ số nào hợp cho giai đoạn Quyết định (BOFU)?', options: ['Reach & hiển thị', 'Lead, dùng thử, đơn hàng, assisted conversions', 'Số like', 'Người dùng mới'], correctIndex: 1, explanation: 'BOFU đo chuyển đổi & doanh thu; reach là TOFU.' },
  { id: 'q2', question: 'Vì sao cần mô hình Content ROI dù chỉ ước lượng thô?', options: ['Để đăng nhiều hơn', 'Ép kỷ luật gắn nội dung với tiền & bảo vệ ngân sách', 'Để tăng số like', 'Không cần thiết'], correctIndex: 1, explanation: 'ROI = (giá trị - chi phí)/chi phí; buộc nội dung chứng minh giá trị.' },
  { id: 'q3', question: 'Nguyên tắc "cải tiến lặp" (iterate) với nội dung là?', options: ['Làm một lần rồi thôi', 'Đặt giả thuyết → xuất bản → đo theo KPI → tăng cái hiệu quả, cắt cái không', 'Chỉ báo cáo cuối năm', 'Bỏ qua dữ liệu'], correctIndex: 1, explanation: 'Coi nội dung như thí nghiệm; tối ưu liên tục dựa trên KPI.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CSP201m',
    slug: 'csp201m-xay-dung-chien-luoc-noi-dung',
    title: 'Xây dựng chiến lược nội dung',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CSP201m.webp',
    shortDescription: 'Hands-on: build & ship a full content strategy — goals & KPIs, research & audit, positioning & pillars, content model, editorial calendar, distribution, governance, measurement & ROI. Bilingual, real brand examples.|||Thực hành: dựng & triển khai chiến lược nội dung hoàn chỉnh — mục tiêu & KPI, nghiên cứu & audit, định vị & trụ nội dung, content model, lịch biên tập, phân phối, quản trị, đo lường & ROI. Song ngữ, ví dụ thương hiệu thật.',
    description: 'Môn <strong>CSP201m — Content Strategy Development (Xây dựng chiến lược nội dung)</strong>, khối Công nghệ Truyền thông FPTU (Kỳ 4). Đây là môn <strong>thực hành</strong> đi cùng <strong>CSP202m — Introduction of Content Strategy</strong> (nền lý thuyết): bạn dựng và triển khai một chiến lược nội dung hoàn chỉnh. Từ <strong>mục tiêu kinh doanh → KPI</strong> → <strong>nghiên cứu &amp; content audit</strong> → <strong>định vị, trụ nội dung &amp; brand voice</strong> → <strong>content model &amp; taxonomy</strong> → <strong>lịch biên tập &amp; workflow</strong> → <strong>phân phối đa kênh, tái sử dụng &amp; SEO</strong> → <strong>quản trị</strong> → <strong>đo lường, ROI &amp; báo cáo</strong>. Bám sách chuẩn (Halvorson &amp; Rach, Pulizzi, Bloomstein, Jones) và thực hành CMI/HubSpot; song ngữ, có framework, mẫu, ví dụ thương hiệu thật và quiz mỗi chương.',
    whatYouLearn: 'Align nội dung với mục tiêu kinh doanh & đặt KPI theo phễu (TOFU/MOFU/BOFU); audience research, content audit & phân tích đối thủ → insight; core message, content pillars, brand voice & khác biệt hoá; content model, taxonomy & mô hình hub-and-spoke; lịch biên tập, workflow & vai trò RACI; phân phối owned/earned/paid (PESO), tái sử dụng & SEO; content governance, style guide & vòng đời (ROT); analytics, content ROI, cải tiến lặp & báo cáo.',
    requirements: 'Nên học CSP202m (Introduction of Content Strategy) trước để nắm lý thuyết nền. Biết dùng bảng tính; có tài khoản Google Analytics/Search Console & Google Trends để thực hành thì tốt.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách nền tảng, tài liệu chính thức, YouTube, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Chiến lược vs sản xuất; quan hệ với CSP202m; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Mục tiêu & KPI|||Chapter 1 — Goals & KPIs', description: 'Align business goal → content goal → KPI; SMART; phễu.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nghiên cứu & audit|||Chapter 2 — Research & audit', description: 'Audience research, content audit, phân tích đối thủ → insight.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Định vị & thông điệp|||Chapter 3 — Positioning & message', description: 'Core message, content pillars, brand voice, khác biệt hoá.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mô hình nội dung|||Chapter 4 — Content model', description: 'Content model, taxonomy, hub-and-spoke (pillar & cluster).', lessons: [c4, c4q] },
    { title: 'Chương 5 — Lịch biên tập & sản xuất|||Chapter 5 — Calendar & production', description: 'Editorial calendar, workflow, RACI, sản xuất quy mô.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Phân phối & tái sử dụng|||Chapter 6 — Distribution & repurposing', description: 'PESO, phân phối đa kênh, repurposing, SEO.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quản trị & duy trì|||Chapter 7 — Governance & maintenance', description: 'Governance, style guide, vòng đời, ROT audit.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường, tối ưu & báo cáo|||Chapter 8 — Measurement & reporting', description: 'KPI theo phễu, content ROI, cải tiến lặp, báo cáo.', lessons: [c8, c8q] },
  ],
};
