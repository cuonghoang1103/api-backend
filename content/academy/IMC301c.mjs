/**
 * IMC301c — Integrated Marketing Communication in Digital World. Khối Quản
 * trị Kinh doanh (BBA), FPTU, Kỳ 3. Giáo trình tham khảo: Belch & Belch
 * "Advertising and Promotion (IMC)"; Kotler "Marketing 5.0"; Chaffey
 * "Digital Marketing". ⚠️ Có MKT304 (Integrated Marketing Communications)
 * rồi — môn NÀY nhấn góc SỐ: hành vi số, kênh owned/earned/paid, content,
 * social/influencer, quảng cáo số/programmatic, omnichannel, đo lường số.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('imc301c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo, tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">IMC301c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Integrated Marketing Communication in the digital world — digital channels, content, social/influencer, digital ads, omnichannel and measurement — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IMC301c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.mheducation.com/highered/product/advertising-promotion-integrated-marketing-communications-perspective-belch-belch/M9781260728356.html" target="_blank" rel="noopener">Belch &amp; Belch — <em>Advertising and Promotion: An Integrated Marketing Communications Perspective</em></a></li>
<li><a href="https://www.wiley.com/en-us/Marketing+5.0%3A+Technology+for+Humanity-p-9781119668514" target="_blank" rel="noopener">Kotler, Kartajaya &amp; Setiawan — <em>Marketing 5.0: Technology for Humanity</em></a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/digital-marketing/P200000003357" target="_blank" rel="noopener">Chaffey &amp; Ellis-Chadwick — <em>Digital Marketing: Strategy, Implementation and Practice</em></a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google — consumer insight &amp; digital trends</a></li>
<li><a href="https://www.metaskills.com/" target="_blank" rel="noopener">Meta Blueprint — social &amp; paid media skills</a></li>
<li><a href="https://blog.hubspot.com/marketing" target="_blank" rel="noopener">HubSpot Marketing Blog — inbound &amp; content marketing</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@NeilPatel" target="_blank" rel="noopener">Neil Patel</a> — SEO, content &amp; digital growth</li>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot</a> — inbound &amp; IMC strategy</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://ads.google.com/" target="_blank" rel="noopener">Google Ads</a> &amp; <a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — search &amp; trend data</li>
<li><a href="https://business.facebook.com/" target="_blank" rel="noopener">Meta Business Suite</a> — quản trị nội dung &amp; quảng cáo đa nền tảng</li>
<li><a href="https://buffer.com/" target="_blank" rel="noopener">Buffer</a> / <a href="https://later.com/" target="_blank" rel="noopener">Later</a> — lịch nội dung đa kênh</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — hành vi tiêu dùng số, chiến lược thông điệp, owned/earned/paid media.</li>
<li><strong>Practice</strong> — dựng content calendar &amp; storytelling cho một brand giả định.</li>
<li><strong>Go deeper</strong> — social/influencer, quảng cáo số &amp; programmatic, omnichannel journey.</li>
<li><strong>Job-ready</strong> — đọc dashboard KPI, mô hình attribution, theo kịp xu hướng AI &amp; cookieless.</li>
</ol></div>`,
    `<span class="eyebrow">IMC301c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Truyền thông Marketing tích hợp trong thế giới số — kênh số, content, social/influencer, quảng cáo số, omnichannel và đo lường — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IMC301c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.mheducation.com/highered/product/advertising-promotion-integrated-marketing-communications-perspective-belch-belch/M9781260728356.html" target="_blank" rel="noopener">Belch &amp; Belch — <em>Advertising and Promotion: An Integrated Marketing Communications Perspective</em></a></li>
<li><a href="https://www.wiley.com/en-us/Marketing+5.0%3A+Technology+for+Humanity-p-9781119668514" target="_blank" rel="noopener">Kotler, Kartajaya &amp; Setiawan — <em>Marketing 5.0: Technology for Humanity</em></a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/digital-marketing/P200000003357" target="_blank" rel="noopener">Chaffey &amp; Ellis-Chadwick — <em>Digital Marketing: Strategy, Implementation and Practice</em></a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google — insight người dùng &amp; xu hướng số</a></li>
<li><a href="https://www.metaskills.com/" target="_blank" rel="noopener">Meta Blueprint — kỹ năng social &amp; paid media</a></li>
<li><a href="https://blog.hubspot.com/marketing" target="_blank" rel="noopener">HubSpot Marketing Blog — inbound &amp; content marketing</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@NeilPatel" target="_blank" rel="noopener">Neil Patel</a> — SEO, content &amp; tăng trưởng số</li>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot</a> — chiến lược inbound &amp; IMC</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://ads.google.com/" target="_blank" rel="noopener">Google Ads</a> &amp; <a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — dữ liệu tìm kiếm &amp; xu hướng</li>
<li><a href="https://business.facebook.com/" target="_blank" rel="noopener">Meta Business Suite</a> — quản trị nội dung &amp; quảng cáo đa nền tảng</li>
<li><a href="https://buffer.com/" target="_blank" rel="noopener">Buffer</a> / <a href="https://later.com/" target="_blank" rel="noopener">Later</a> — lịch nội dung đa kênh</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — hành vi tiêu dùng số, chiến lược thông điệp, owned/earned/paid media.</li>
<li><strong>Luyện tập</strong> — dựng content calendar &amp; storytelling cho một brand giả định.</li>
<li><strong>Đào sâu</strong> — social/influencer, quảng cáo số &amp; programmatic, hành trình omnichannel.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc dashboard KPI, mô hình attribution, theo kịp xu hướng AI &amp; cookieless.</li>
</ol></div>`,
  ]]);

const intro = doc('imc301c-0-1-overview', 'Course overview: IMC in the digital world|||Tổng quan: Truyền thông Marketing tích hợp trong thế giới số',
  'IMC301c khác MKT304 ra sao (nhấn góc số); lộ trình 8 chương: hành vi số → thông điệp/định vị số → kênh số → content → social/influencer → quảng cáo số → omnichannel → đo lường.',
  [[
    `<span class="eyebrow">IMC301c · Lesson 0.1 · Overview</span>
<h2>Integrated Marketing Communication in the Digital World</h2>
<p class="lead">This course looks at <strong>Integrated Marketing Communication (IMC)</strong> — coordinating every message a brand sends so customers get one consistent story — but through a <strong>digital-first lens</strong>. Where MKT304 covers the classic IMC mix (advertising, PR, sales promotion, personal selling), IMC301c goes deep on what changes when most of that mix now runs through <strong>algorithms, feeds, and screens</strong>.</p>
<h3>Why "digital" changes the game</h3>
<ul>
<li><strong>Non-linear journeys</strong> — customers bounce between search, social, reviews and ads in any order, not a neat funnel.</li>
<li><strong>Owned channels compound</strong> — a website or app keeps working after the ad budget stops; a paid campaign doesn't.</li>
<li><strong>Everything is measurable</strong> — clicks, views, and conversions are trackable in real time, which raises the bar for accountability.</li>
</ul>
<h3>Roadmap</h3>
<p>Digital consumer behavior → message strategy &amp; brand positioning → owned/earned/paid digital channels → content marketing &amp; storytelling → social media &amp; influencer marketing → digital advertising &amp; programmatic → omnichannel integration → measurement (KPI, attribution) &amp; trends.</p>`,
    `<span class="eyebrow">IMC301c · Bài 0.1 · Tổng quan</span>
<h2>Truyền thông Marketing tích hợp trong Thế giới số</h2>
<p class="lead">Môn này nhìn <strong>IMC (Truyền thông Marketing tích hợp)</strong> — phối hợp mọi thông điệp thương hiệu để khách hàng nhận một câu chuyện thống nhất — qua <strong>lăng kính số</strong>. Nếu MKT304 học bộ công cụ IMC cổ điển (quảng cáo, PR, khuyến mãi, bán hàng cá nhân) thì IMC301c đào sâu vào phần thay đổi khi phần lớn bộ công cụ đó chạy qua <strong>thuật toán, newsfeed và màn hình</strong>.</p>
<h3>Vì sao "số" thay đổi cuộc chơi</h3>
<ul>
<li><strong>Hành trình không tuyến tính</strong> — khách hàng nhảy giữa tìm kiếm, social, review, quảng cáo không theo thứ tự, không còn là funnel gọn gàng.</li>
<li><strong>Kênh owned tích luỹ theo thời gian</strong> — website hay app vẫn hoạt động sau khi ngân sách quảng cáo dừng; quảng cáo trả tiền thì không.</li>
<li><strong>Mọi thứ đo được</strong> — click, view, chuyển đổi theo thời gian thực, nâng chuẩn trách nhiệm giải trình.</li>
</ul>
<h3>Lộ trình</h3>
<p>Hành vi tiêu dùng số → chiến lược thông điệp &amp; định vị thương hiệu số → kênh số owned/earned/paid → content marketing &amp; storytelling → social media &amp; influencer → quảng cáo số &amp; programmatic → tích hợp omnichannel → đo lường (KPI, attribution) &amp; xu hướng.</p>`,
  ]]);

const c1 = doc('imc301c-1-1-digital-consumer', '1.1 — IMC in the digital era & changing consumer behavior|||1.1 — IMC trong kỷ nguyên số & sự thay đổi hành vi',
  'Từ IMC truyền thống sang số: đa màn hình, nội dung theo yêu cầu, UGC, feed thuật toán; hành trình khách hàng không tuyến tính, ROPO.',
  [[
    `<span class="eyebrow">IMC301c · Chapter 1 · Lesson 1.1</span>
<h2>IMC in the digital era &amp; changing consumer behavior</h2>
<h3>What changed</h3>
<ul>
<li><strong>Multi-screen behavior</strong> — the same person switches between phone, laptop and TV within one purchase decision.</li>
<li><strong>On-demand content</strong> — audiences choose what and when to watch; brands can no longer buy a "guaranteed" prime-time slot the way TV once offered.</li>
<li><strong>User-generated content (UGC)</strong> — reviews, unboxings, and reaction videos from ordinary users now carry more trust than brand-made ads.</li>
<li><strong>Algorithmic feeds</strong> — a platform's algorithm, not the brand, decides who actually sees a message and when.</li>
</ul>
<h3>The non-linear journey</h3>
<p>Classic models like <strong>AIDA</strong> (Awareness → Interest → Desire → Action) assumed a straight line. Digital behavior is closer to a loop: a customer sees an ad, searches reviews, asks a friend in a group chat, sees a retargeting ad, then buys — often days later, and often switching brands mid-way.</p>
<pre><code>ROPO — Research Online, Purchase Offline
 See a product on social -> search reviews online
 -> compare prices on apps -> visit the physical store to buy
(the reverse, "Showrooming", also happens: try in-store, buy online)
</code></pre>
<div class="callout"><span class="badge">The IMC implication</span> If touchpoints are scattered and out of order, a brand's message, tone and offer must still be <strong>consistent everywhere</strong> — that consistency is what "integrated" means when the channels are digital.</div>`,
    `<span class="eyebrow">IMC301c · Chương 1 · Bài 1.1</span>
<h2>IMC trong kỷ nguyên số &amp; sự thay đổi hành vi</h2>
<h3>Điều gì đã thay đổi</h3>
<ul>
<li><strong>Hành vi đa màn hình</strong> — một người chuyển giữa điện thoại, laptop và TV trong cùng một quyết định mua.</li>
<li><strong>Nội dung theo yêu cầu</strong> — người xem tự chọn xem gì và khi nào; brand không còn mua được "giờ vàng đảm bảo" như TV từng có.</li>
<li><strong>Nội dung do người dùng tạo (UGC)</strong> — review, video unbox, phản ứng từ người dùng thường được tin hơn quảng cáo do brand làm.</li>
<li><strong>Feed thuật toán</strong> — thuật toán của nền tảng, không phải brand, quyết định ai thấy thông điệp và khi nào.</li>
</ul>
<h3>Hành trình không tuyến tính</h3>
<p>Các mô hình cổ điển như <strong>AIDA</strong> (Awareness → Interest → Desire → Action) giả định một đường thẳng. Hành vi số giống một vòng lặp hơn: khách hàng thấy quảng cáo trên social, tìm review online, hỏi bạn trong group chat, thấy quảng cáo retargeting, rồi mua — thường vài ngày sau, và thường đổi brand giữa đường.</p>
<pre><code>ROPO — Nghiên cứu Online, Mua Offline
 Thấy sản phẩm trên social -> tìm review online
 -> so giá trên app -> ra cửa hàng thật để mua
(chiều ngược lại, "Showrooming", cũng xảy ra: thử tại cửa hàng, mua online)
</code></pre>
<div class="callout"><span class="badge">Ý nghĩa với IMC</span> Nếu điểm chạm rải rác và không theo thứ tự, thông điệp, tông giọng và ưu đãi của brand vẫn phải <strong>nhất quán ở mọi nơi</strong> — đó chính là ý nghĩa của "tích hợp" khi các kênh là kênh số.</div>`,
  ]]);

const c1q = quiz('imc301c-quiz-1', 'Quiz 1 — Digital era & consumer behavior|||Quiz 1 — Kỷ nguyên số & hành vi tiêu dùng', [
  { id: 'q1', question: 'ROPO là hành vi gì?', options: ['Nghiên cứu online, mua offline', 'Mua online, trả offline', 'Chỉ mua online', 'Chỉ mua offline'], correctIndex: 0, explanation: 'ROPO = Research Online, Purchase Offline — tìm hiểu trên mạng rồi mua tại cửa hàng.' },
  { id: 'q2', question: 'Vì sao mô hình AIDA tuyến tính không còn khớp hoàn toàn với hành vi số?', options: ['Vì AIDA đã lỗi thời hoàn toàn', 'Vì hành trình số là vòng lặp đa điểm chạm, không theo thứ tự cố định', 'Vì AIDA chỉ dùng cho TV', 'Vì khách hàng số không cân nhắc nữa'], correctIndex: 1, explanation: 'Khách hàng số nhảy qua nhiều điểm chạm không theo trình tự thẳng.' },
  { id: 'q3', question: 'Trong kỷ nguyên số, ai/cái gì thường quyết định ai thấy một thông điệp trước?', options: ['Brand tự quyết hoàn toàn', 'Thuật toán của nền tảng (feed)', 'Chỉ có giá quảng cáo', 'Không ai quyết, ngẫu nhiên tuyệt đối'], correctIndex: 1, explanation: 'Feed thuật toán lọc và xếp hạng nội dung trước khi tới người xem.' },
]);

const c2 = doc('imc301c-2-1-message-positioning', '2.1 — Digital message strategy & brand positioning|||2.1 — Chiến lược thông điệp số & định vị thương hiệu',
  'Thông điệp cốt lõi thích nghi theo nền tảng; hook 3 giây đầu; nhất quán tông giọng đa kênh; message-market fit theo platform.',
  [[
    `<span class="eyebrow">IMC301c · Chapter 2 · Lesson 2.1</span>
<h2>Digital message strategy &amp; brand positioning</h2>
<h3>One positioning, many formats</h3>
<p>A brand's <strong>positioning</strong> (the one idea it owns in the customer's mind) stays fixed, but the <strong>message format</strong> must adapt per platform: a LinkedIn post reads like a mini-article, a TikTok video needs to hook in the <strong>first 3 seconds</strong> or the viewer scrolls away, and an email subject line has to win in one glance in a crowded inbox.</p>
<h3>Message-market fit</h3>
<pre><code>Same positioning, different execution:
 LinkedIn   -> professional tone, data/case study, longer copy
 TikTok/Reel -> fast hook, native format, casual tone, captions
 Email      -> personal subject line, single clear CTA
 Search ad  -> matches the exact keyword intent, short headline
</code></pre>
<h3>Brand voice consistency</h3>
<p>Even as format changes, <strong>tone of voice</strong>, visual identity (logo, color, font) and the core promise must stay recognizable — otherwise a customer who sees the brand on three platforms doesn't realize it's the same brand at all. A written <strong>brand voice guide</strong> (adjectives it is / is not) keeps multiple content creators consistent.</p>
<div class="callout"><span class="badge">Test before scaling</span> Digital lets brands A/B test headlines, hooks and CTAs on small budgets before scaling the winning message — something traditional media couldn't do cheaply.</div>`,
    `<span class="eyebrow">IMC301c · Chương 2 · Bài 2.1</span>
<h2>Chiến lược thông điệp số &amp; định vị thương hiệu</h2>
<h3>Một định vị, nhiều hình thức</h3>
<p><strong>Định vị</strong> của brand (ý tưởng duy nhất brand "sở hữu" trong đầu khách hàng) giữ cố định, nhưng <strong>hình thức thông điệp</strong> phải thích nghi theo từng nền tảng: một bài LinkedIn đọc như bài viết mini, một video TikTok cần hook trong <strong>3 giây đầu</strong> nếu không người xem lướt qua, và một dòng chủ đề email phải "thắng" chỉ trong một cái nhìn giữa hộp thư đầy ắp.</p>
<h3>Message-market fit</h3>
<pre><code>Cùng định vị, thực thi khác nhau:
 LinkedIn    -> tông chuyên nghiệp, dữ liệu/case study, bài dài hơn
 TikTok/Reel -> hook nhanh, đúng format nền tảng, tông tự nhiên, có caption
 Email       -> dòng chủ đề cá nhân hoá, một CTA rõ ràng
 Search ad   -> khớp đúng ý định từ khoá, tiêu đề ngắn
</code></pre>
<h3>Nhất quán tông giọng thương hiệu</h3>
<p>Dù hình thức đổi, <strong>tông giọng</strong>, nhận diện hình ảnh (logo, màu, font) và lời hứa cốt lõi phải giữ nguyên nhận diện được — nếu không, khách hàng thấy brand trên ba nền tảng sẽ không nhận ra đó là cùng một brand. Một <strong>brand voice guide</strong> viết sẵn (những tính từ brand LÀ / KHÔNG LÀ) giúp nhiều người tạo nội dung khác nhau vẫn nhất quán.</p>
<div class="callout"><span class="badge">Thử trước khi mở rộng</span> Kênh số cho phép A/B test tiêu đề, hook và CTA với ngân sách nhỏ trước khi mở rộng thông điệp thắng — điều truyền thông truyền thống không làm được với chi phí rẻ.</div>`,
  ]]);

const c2q = quiz('imc301c-quiz-2', 'Quiz 2 — Digital message & positioning|||Quiz 2 — Thông điệp số & định vị', [
  { id: 'q1', question: 'Điều gì PHẢI giữ cố định dù hình thức thông điệp thay đổi theo nền tảng?', options: ['Độ dài bài viết', 'Định vị & tông giọng thương hiệu', 'Số lượng hashtag', 'Giờ đăng bài'], correctIndex: 1, explanation: 'Định vị và brand voice phải nhất quán để khách hàng nhận ra cùng một brand.' },
  { id: 'q2', question: 'Vì sao video ngắn kiểu TikTok cần "hook" trong vài giây đầu?', options: ['Vì luật nền tảng bắt buộc', 'Vì người xem dễ lướt qua nếu không bị thu hút ngay', 'Vì video ngắn không cần nội dung', 'Vì thuật toán chỉ đếm 3 giây đầu'], correctIndex: 1, explanation: 'Người xem quyết định ở lại hay lướt qua rất nhanh trên nền tảng video ngắn.' },
  { id: 'q3', question: 'Lợi thế của kênh số với việc thử nghiệm thông điệp là gì?', options: ['Không thể thử nghiệm được', 'A/B test rẻ trước khi mở rộng thông điệp thắng', 'Phải thử trên toàn bộ ngân sách ngay', 'Chỉ thử được trên TV'], correctIndex: 1, explanation: 'Digital cho phép A/B test với ngân sách nhỏ, điều media truyền thống khó làm.' },
]);

const c3 = doc('imc301c-3-1-owned-earned-paid', '3.1 — Digital channels: owned, earned & paid media|||3.1 — Kênh truyền thông số: owned, earned, paid',
  'Owned (web/app/email/CRM), earned (review/UGC/SEO/PR số), paid (search/social ads/display/affiliate); khung POEM.',
  [[
    `<span class="eyebrow">IMC301c · Chapter 3 · Lesson 3.1</span>
<h2>Digital channels: owned, earned &amp; paid media</h2>
<h3>The POEM framework</h3>
<ul>
<li><strong>Owned media</strong> — channels the brand fully controls: website, mobile app, email list, CRM database. Slow to build, but keeps working with no ongoing media spend.</li>
<li><strong>Earned media</strong> — attention the brand didn't pay for: customer reviews, UGC, organic shares, digital PR coverage, organic search ranking (SEO). Highest trust, but not directly controllable.</li>
<li><strong>Paid media</strong> — media the brand buys: search ads (SEM), social ads, display/banner ads, affiliate commissions. Fast and scalable, but stops the moment spend stops.</li>
</ul>
<pre><code>How they work together:
 Paid ad -> drives traffic to a landing page (owned)
 Owned content -> good enough to get shared/reviewed (earns earned media)
 Earned trust -> lowers the cost of the next paid click (better ad relevance score)
</code></pre>
<h3>Why the mix matters</h3>
<p>Relying on paid alone is expensive and stops delivering the second the budget stops. Relying on earned alone is unpredictable. A healthy digital IMC plan builds <strong>owned</strong> assets as the foundation, uses <strong>paid</strong> to accelerate reach in the short term, and designs content quality/service to earn <strong>earned</strong> media over time.</p>
<div class="callout"><span class="badge">Common mistake</span> Treating paid media as the whole digital strategy — without an owned destination (website/app) to send traffic to, paid clicks convert poorly and nothing compounds.</div>`,
    `<span class="eyebrow">IMC301c · Chương 3 · Bài 3.1</span>
<h2>Kênh truyền thông số: owned, earned &amp; paid</h2>
<h3>Khung POEM</h3>
<ul>
<li><strong>Owned media</strong> — kênh brand hoàn toàn kiểm soát: website, app di động, danh sách email, dữ liệu CRM. Dựng chậm, nhưng vẫn hoạt động mà không cần chi tiền media liên tục.</li>
<li><strong>Earned media</strong> — sự chú ý brand KHÔNG trả tiền: review khách hàng, UGC, chia sẻ tự nhiên, tin PR số, hạng tìm kiếm tự nhiên (SEO). Độ tin cao nhất, nhưng không kiểm soát trực tiếp được.</li>
<li><strong>Paid media</strong> — media brand mua: quảng cáo tìm kiếm (SEM), quảng cáo social, banner/display, hoa hồng affiliate. Nhanh và dễ mở rộng, nhưng dừng ngay khi hết chi.</li>
</ul>
<pre><code>Chúng phối hợp thế nào:
 Quảng cáo trả tiền -> kéo traffic về landing page (owned)
 Nội dung owned tốt -> được chia sẻ/review (thành earned media)
 Niềm tin earned -> giảm chi phí click trả tiền kế tiếp (điểm liên quan quảng cáo tốt hơn)
</code></pre>
<h3>Vì sao phối trộn quan trọng</h3>
<p>Chỉ dựa vào paid thì đắt và ngừng ngay khi hết ngân sách. Chỉ dựa vào earned thì khó lường. Một kế hoạch IMC số tốt dựng <strong>owned</strong> làm nền, dùng <strong>paid</strong> để tăng tốc phạm vi ngắn hạn, và thiết kế chất lượng nội dung/dịch vụ để "kiếm" được <strong>earned</strong> media theo thời gian.</p>
<div class="callout"><span class="badge">Sai lầm thường gặp</span> Coi paid media là toàn bộ chiến lược số — không có điểm đến owned (website/app) để dẫn traffic về, click trả tiền chuyển đổi kém và không có gì tích luỹ lại.</div>`,
  ]]);

const c3q = quiz('imc301c-quiz-3', 'Quiz 3 — Owned/earned/paid media|||Quiz 3 — Owned/earned/paid media', [
  { id: 'q1', question: 'Kênh nào brand HOÀN TOÀN kiểm soát và không tốn chi phí media liên tục?', options: ['Paid media', 'Earned media', 'Owned media', 'Không kênh nào'], correctIndex: 2, explanation: 'Owned media (website, app, email, CRM) do brand sở hữu và kiểm soát.' },
  { id: 'q2', question: 'Review khách hàng và UGC (không trả tiền) thuộc loại media nào?', options: ['Owned media', 'Earned media', 'Paid media', 'Traditional media'], correctIndex: 1, explanation: 'Earned media là sự chú ý brand kiếm được, không mua và không tự sở hữu.' },
  { id: 'q3', question: 'Vì sao chỉ dựa vào paid media một mình là rủi ro?', options: ['Vì paid luôn rẻ hơn', 'Vì hiệu quả dừng ngay khi ngân sách dừng, không tích luỹ', 'Vì paid không đo được', 'Vì paid không hợp pháp'], correctIndex: 1, explanation: 'Paid media không tự tích luỹ tài sản như owned, và mất hiệu quả ngay khi ngừng chi.' },
]);

const c4 = doc('imc301c-4-1-content-storytelling', '4.1 — Content marketing & cross-platform storytelling|||4.1 — Content marketing & kể chuyện đa nền tảng',
  'Content pillar, lịch nội dung, tái sử dụng (1 video gốc → nhiều định dạng); khung kể chuyện; SEO content, evergreen vs trending.',
  [[
    `<span class="eyebrow">IMC301c · Chapter 4 · Lesson 4.1</span>
<h2>Content marketing &amp; cross-platform storytelling</h2>
<h3>Content pillars &amp; the content calendar</h3>
<p>Rather than posting random ideas, brands define 3-5 <strong>content pillars</strong> (recurring themes tied to the brand's positioning — e.g. "product tips", "customer stories", "behind the scenes") and plan them on a <strong>content calendar</strong> so every channel gets a steady, planned stream instead of silence then a burst.</p>
<h3>One idea, many formats (repurposing)</h3>
<pre><code>One long-form video (webinar/interview)
  -> cut into 3-5 short vertical clips (Reels/TikTok/Shorts)
  -> pull quotes into a carousel post (LinkedIn/Instagram)
  -> transcript becomes a blog post (SEO) + newsletter section
</code></pre>
<p>This <strong>repurposing</strong> multiplies reach per unit of production effort — a core IMC efficiency principle applied to digital content.</p>
<h3>Storytelling that isn't just a sales pitch</h3>
<p>Frameworks like <strong>Before–After–Bridge</strong> (the customer's problem before, the better state after, the product as the bridge) work across formats because they focus on the <em>customer's</em> story, not a features list. <strong>Evergreen content</strong> (useful indefinitely, e.g. "how to choose X") builds long-term SEO value; <strong>trending content</strong> (tied to a current moment) builds short-term reach — a content plan needs both.</p>
<div class="callout"><span class="badge">SEO content</span> Content built around real search-intent keywords keeps earning organic traffic (earned media) long after a paid campaign ends.</div>`,
    `<span class="eyebrow">IMC301c · Chương 4 · Bài 4.1</span>
<h2>Content marketing &amp; kể chuyện đa nền tảng</h2>
<h3>Content pillar &amp; lịch nội dung</h3>
<p>Thay vì đăng ý tưởng ngẫu nhiên, brand xác định 3-5 <strong>content pillar</strong> (chủ đề lặp lại gắn với định vị brand — vd "mẹo dùng sản phẩm", "câu chuyện khách hàng", "hậu trường") và lên kế hoạch trên <strong>lịch nội dung</strong> để mỗi kênh có dòng nội dung đều đặn, có kế hoạch thay vì im lặng rồi bùng nổ.</p>
<h3>Một ý tưởng, nhiều định dạng (tái sử dụng)</h3>
<pre><code>Một video dài (webinar/phỏng vấn)
  -> cắt thành 3-5 clip ngắn dọc (Reels/TikTok/Shorts)
  -> trích câu nói làm carousel post (LinkedIn/Instagram)
  -> bản chép lời thành bài blog (SEO) + mục newsletter
</code></pre>
<p>Việc <strong>tái sử dụng</strong> này nhân độ phủ trên mỗi đơn vị công sản xuất — một nguyên lý hiệu quả cốt lõi của IMC áp vào nội dung số.</p>
<h3>Kể chuyện không chỉ là bán hàng</h3>
<p>Khung như <strong>Before–After–Bridge</strong> (vấn đề khách hàng trước, trạng thái tốt hơn sau, sản phẩm là cầu nối) hoạt động tốt trên nhiều định dạng vì tập trung vào câu chuyện của <em>khách hàng</em>, không phải danh sách tính năng. <strong>Nội dung evergreen</strong> (hữu ích mãi mãi, vd "cách chọn X") xây giá trị SEO dài hạn; <strong>nội dung trending</strong> (gắn thời điểm hiện tại) xây độ phủ ngắn hạn — kế hoạch nội dung cần cả hai.</p>
<div class="callout"><span class="badge">Nội dung SEO</span> Nội dung dựng theo đúng ý định tìm kiếm thật vẫn kiếm được traffic tự nhiên (earned media) rất lâu sau khi chiến dịch trả tiền kết thúc.</div>`,
  ]]);

const c4q = quiz('imc301c-quiz-4', 'Quiz 4 — Content & storytelling|||Quiz 4 — Content & kể chuyện', [
  { id: 'q1', question: 'Content pillar là gì?', options: ['Một bài đăng viral duy nhất', 'Chủ đề lặp lại gắn với định vị brand, dùng để lên lịch nội dung', 'Tên nền tảng social', 'Ngân sách quảng cáo hàng tháng'], correctIndex: 1, explanation: 'Content pillar là chủ đề cốt lõi lặp lại, giúp nội dung đều đặn và nhất quán.' },
  { id: 'q2', question: 'Tái sử dụng (repurposing) một video dài thành nhiều clip ngắn mang lại lợi ích chính nào?', options: ['Giảm chất lượng nội dung', 'Nhân độ phủ trên mỗi đơn vị công sản xuất', 'Không có lợi ích', 'Chỉ tốn thêm chi phí'], correctIndex: 1, explanation: 'Một nội dung gốc tạo ra nhiều định dạng, tăng hiệu quả sản xuất.' },
  { id: 'q3', question: 'Nội dung evergreen khác trending ở điểm nào?', options: ['Evergreen chỉ dùng cho email', 'Evergreen hữu ích lâu dài (SEO), trending gắn thời điểm hiện tại (phủ ngắn hạn)', 'Trending luôn tốt hơn evergreen', 'Không có khác biệt'], correctIndex: 1, explanation: 'Evergreen xây giá trị dài hạn, trending tận dụng khoảnh khắc ngắn hạn — cần cả hai.' },
]);

const c5 = doc('imc301c-5-1-social-influencer', '5.1 — Social media & influencer marketing in IMC|||5.1 — Social media & influencer trong IMC',
  'Chọn nền tảng theo mục tiêu; các tầng influencer (nano→mega), KOL/KOC; UGC, social listening, quản trị cộng đồng.',
  [[
    `<span class="eyebrow">IMC301c · Chapter 5 · Lesson 5.1</span>
<h2>Social media &amp; influencer marketing in IMC</h2>
<h3>Platform selection by objective</h3>
<p>No brand needs to be on every platform. Choice follows the <strong>audience</strong> and the <strong>objective</strong>: awareness with a young audience often favors TikTok/Instagram Reels; B2B trust-building favors LinkedIn; direct customer service favors the platform customers already message on. IMC discipline means picking channels on purpose, not by habit.</p>
<h3>Influencer tiers</h3>
<pre><code>Nano   (1k-10k followers)  -> highest trust/engagement rate, cheap, niche reach
Micro  (10k-100k)          -> strong niche authority, good ROI
Macro  (100k-1M)           -> broad reach, still some authenticity
Mega/Celebrity (1M+)       -> mass awareness, lowest engagement rate, most expensive
</code></pre>
<p>In many Southeast Asian markets, <strong>KOL</strong> (Key Opinion Leader, paid/managed) and <strong>KOC</strong> (Key Opinion Consumer, more grassroots/authentic reviewer) are both used — KOLs for reach, KOCs for trust.</p>
<h3>Beyond posting: listening &amp; community</h3>
<p><strong>Social listening</strong> tracks what people say about the brand or category across platforms (even without being tagged), surfacing complaints or trends early. <strong>Community management</strong> — replying to comments/DMs, moderating, being visibly present — turns a one-way broadcast channel into a two-way relationship, which is what "integrated" communication should feel like from the customer's side.</p>
<div class="callout"><span class="badge">Disclosure matters</span> Sponsored influencer content should be disclosed (e.g. "#ad") — trust, once lost through hidden promotion, is expensive to rebuild.</div>`,
    `<span class="eyebrow">IMC301c · Chương 5 · Bài 5.1</span>
<h2>Social media &amp; influencer trong IMC</h2>
<h3>Chọn nền tảng theo mục tiêu</h3>
<p>Không brand nào cần có mặt trên MỌI nền tảng. Lựa chọn theo <strong>đối tượng</strong> và <strong>mục tiêu</strong>: tăng nhận biết với người trẻ thường ưu tiên TikTok/Reels; xây niềm tin B2B thường ưu tiên LinkedIn; chăm sóc khách hàng trực tiếp thì chọn nền tảng khách đã sẵn nhắn tin. Kỷ luật IMC là chọn kênh có chủ đích, không theo thói quen.</p>
<h3>Các tầng influencer</h3>
<pre><code>Nano   (1k-10k follower)   -> độ tin/tương tác cao nhất, rẻ, phủ niche
Micro  (10k-100k)          -> uy tín niche mạnh, ROI tốt
Macro  (100k-1M)           -> phủ rộng, còn ít tính chân thực
Mega/Celebrity (1M+)       -> nhận biết đại chúng, tương tác thấp nhất, đắt nhất
</code></pre>
<p>Ở nhiều thị trường Đông Nam Á, cả <strong>KOL</strong> (Key Opinion Leader, được trả tiền/quản lý) và <strong>KOC</strong> (Key Opinion Consumer, người review chân thực, cơ sở hơn) đều được dùng — KOL cho độ phủ, KOC cho niềm tin.</p>
<h3>Không chỉ đăng bài: lắng nghe & cộng đồng</h3>
<p><strong>Social listening</strong> theo dõi những gì mọi người nói về brand hoặc ngành trên các nền tảng (dù không tag), phát hiện sớm khiếu nại hoặc xu hướng. <strong>Quản trị cộng đồng</strong> — trả lời bình luận/DM, kiểm duyệt, hiện diện thấy rõ — biến kênh phát một chiều thành quan hệ hai chiều, đúng cảm giác mà truyền thông "tích hợp" nên mang lại từ góc nhìn khách hàng.</p>
<div class="callout"><span class="badge">Minh bạch quan trọng</span> Nội dung influencer được trả tiền cần công bố (vd "#ad") — niềm tin mất đi vì quảng cáo giấu kín thì rất đắt để xây lại.</div>`,
  ]]);

const c5q = quiz('imc301c-quiz-5', 'Quiz 5 — Social & influencer marketing|||Quiz 5 — Social & influencer marketing', [
  { id: 'q1', question: 'Nhóm influencer nào thường có tỉ lệ tương tác cao nhất nhưng phạm vi hẹp?', options: ['Mega/Celebrity', 'Macro', 'Nano', 'Không nhóm nào'], correctIndex: 2, explanation: 'Nano influencer có tương tác cao, chi phí thấp nhưng phủ niche hẹp.' },
  { id: 'q2', question: 'KOC khác KOL chủ yếu ở điểm nào?', options: ['KOC luôn có nhiều follower hơn KOL', 'KOC là người tiêu dùng review chân thực, cơ sở hơn; KOL được trả tiền/quản lý cho độ phủ', 'KOC không được phép nói về sản phẩm', 'Không có khác biệt'], correctIndex: 1, explanation: 'KOL nhấn độ phủ có quản lý, KOC nhấn tính chân thực từ người tiêu dùng thật.' },
  { id: 'q3', question: 'Social listening dùng để làm gì?', options: ['Chỉ đăng bài tự động', 'Theo dõi những gì được nói về brand/ngành để phát hiện sớm xu hướng, khiếu nại', 'Xoá bình luận tiêu cực', 'Chạy quảng cáo trả tiền'], correctIndex: 1, explanation: 'Social listening giúp phát hiện sớm vấn đề và xu hướng qua các cuộc thảo luận công khai.' },
]);

const c6 = doc('imc301c-6-1-digital-ads-programmatic', '6.1 — Digital advertising & programmatic|||6.1 — Quảng cáo số & programmatic',
  'SEM/search ads, display, programmatic (RTB, DSP/SSP), retargeting; nhắm mục tiêu (demographic/behavioral/lookalike); mô hình giá CPC/CPM/CPA.',
  [[
    `<span class="eyebrow">IMC301c · Chapter 6 · Lesson 6.1</span>
<h2>Digital advertising &amp; programmatic</h2>
<h3>Search vs. display</h3>
<ul>
<li><strong>Search ads (SEM)</strong> — appear on search results matching what a user is actively typing; captures existing intent (e.g. someone searching "best running shoes").</li>
<li><strong>Display ads</strong> — banners shown on websites/apps a user is browsing; creates or reinforces demand rather than capturing an active search.</li>
</ul>
<h3>Programmatic advertising</h3>
<p><strong>Programmatic</strong> means ad space is bought and sold automatically through software, in real time, rather than negotiated manually. A <strong>DSP</strong> (Demand-Side Platform) lets advertisers bid for impressions; an <strong>SSP</strong> (Supply-Side Platform) lets publishers sell them; the match happens through <strong>RTB</strong> (Real-Time Bidding) in the milliseconds it takes a page to load.</p>
<pre><code>RTB in one page load:
 User opens a page -> ad slot goes to auction
 -> DSPs bid based on the user's profile (age, interest, past behavior)
 -> highest bid wins -> that advertiser's ad renders
(all of this happens before the page finishes loading)
</code></pre>
<h3>Targeting &amp; retargeting</h3>
<p>Targeting narrows who sees an ad: <strong>demographic</strong> (age/gender/location), <strong>behavioral</strong> (past browsing/purchase actions), <strong>contextual</strong> (the content of the page itself), and <strong>lookalike</strong> (people who resemble existing customers). <strong>Retargeting</strong> specifically re-shows ads to people who already visited a site but didn't convert — one of the highest-converting digital ad tactics because intent was already shown.</p>
<h3>Pricing models</h3>
<p><strong>CPC</strong> (cost per click), <strong>CPM</strong> (cost per 1,000 impressions), <strong>CPA</strong> (cost per acquisition/conversion) — choosing the right model aligns what the brand pays for with what it actually wants (traffic, reach, or results).</p>`,
    `<span class="eyebrow">IMC301c · Chương 6 · Bài 6.1</span>
<h2>Quảng cáo số &amp; programmatic</h2>
<h3>Search và display</h3>
<ul>
<li><strong>Quảng cáo tìm kiếm (SEM)</strong> — hiện trên kết quả tìm kiếm khớp với những gì người dùng đang chủ động gõ; bắt được ý định sẵn có (vd người tìm "giày chạy bộ tốt nhất").</li>
<li><strong>Quảng cáo display</strong> — banner hiện trên website/app người dùng đang lướt; tạo hoặc củng cố nhu cầu hơn là bắt tìm kiếm chủ động.</li>
</ul>
<h3>Quảng cáo programmatic</h3>
<p><strong>Programmatic</strong> nghĩa là không gian quảng cáo được mua bán tự động qua phần mềm, theo thời gian thực, thay vì đàm phán bằng tay. Một <strong>DSP</strong> (Demand-Side Platform) cho nhà quảng cáo đấu giá impression; một <strong>SSP</strong> (Supply-Side Platform) cho nhà xuất bản bán chúng; việc khớp diễn ra qua <strong>RTB</strong> (Real-Time Bidding) trong vài milli-giây khi trang tải.</p>
<pre><code>RTB trong một lần tải trang:
 Người dùng mở trang -> ô quảng cáo đưa vào đấu giá
 -> các DSP đấu giá dựa trên hồ sơ người dùng (tuổi, sở thích, hành vi trước đó)
 -> giá cao nhất thắng -> quảng cáo của nhà quảng cáo đó hiển thị
(toàn bộ diễn ra trước khi trang tải xong)
</code></pre>
<h3>Nhắm mục tiêu & retargeting</h3>
<p>Nhắm mục tiêu thu hẹp ai thấy quảng cáo: <strong>demographic</strong> (tuổi/giới/vị trí), <strong>behavioral</strong> (hành vi lướt web/mua hàng trước đó), <strong>contextual</strong> (nội dung trang hiện tại), và <strong>lookalike</strong> (người giống khách hàng hiện có). <strong>Retargeting</strong> cụ thể là chiếu lại quảng cáo cho người đã vào site nhưng chưa chuyển đổi — một trong những chiến thuật quảng cáo số chuyển đổi cao nhất vì ý định đã được thể hiện.</p>
<h3>Mô hình giá</h3>
<p><strong>CPC</strong> (giá mỗi click), <strong>CPM</strong> (giá mỗi 1.000 lần hiển thị), <strong>CPA</strong> (giá mỗi chuyển đổi) — chọn đúng mô hình giúp brand trả tiền đúng với điều thực sự muốn (traffic, độ phủ, hay kết quả).</p>`,
  ]]);

const c6q = quiz('imc301c-quiz-6', 'Quiz 6 — Digital ads & programmatic|||Quiz 6 — Quảng cáo số & programmatic', [
  { id: 'q1', question: 'RTB (Real-Time Bidding) là gì?', options: ['Đàm phán giá quảng cáo bằng tay', 'Đấu giá tự động, thời gian thực để khớp quảng cáo với impression', 'Một loại banner tĩnh', 'Chỉ dùng cho email marketing'], correctIndex: 1, explanation: 'RTB khớp nhà quảng cáo và không gian hiển thị qua đấu giá tự động tức thời.' },
  { id: 'q2', question: 'Retargeting nhắm vào ai?', options: ['Người chưa từng biết đến brand', 'Người đã vào site/app nhưng chưa chuyển đổi', 'Chỉ khách hàng đã mua rồi', 'Đối thủ cạnh tranh'], correctIndex: 1, explanation: 'Retargeting chiếu lại quảng cáo cho người đã thể hiện ý định nhưng chưa hoàn tất chuyển đổi.' },
  { id: 'q3', question: 'CPA là mô hình giá tính theo gì?', options: ['Mỗi 1.000 lần hiển thị', 'Mỗi lần chuyển đổi/hành động hoàn tất', 'Mỗi click bất kể kết quả', 'Mỗi giờ chạy quảng cáo'], correctIndex: 1, explanation: 'CPA (Cost Per Acquisition) tính phí theo kết quả chuyển đổi thực tế.' },
]);

const c7 = doc('imc301c-7-1-omnichannel-journey', '7.1 — Omnichannel integration & the digital customer journey|||7.1 — Tích hợp omnichannel & hành trình khách hàng số',
  'Omnichannel khác multichannel; bản đồ hành trình khách hàng số; marketing automation & CRM; cá nhân hoá quy mô lớn.',
  [[
    `<span class="eyebrow">IMC301c · Chapter 7 · Lesson 7.1</span>
<h2>Omnichannel integration &amp; the digital customer journey</h2>
<h3>Multichannel vs. omnichannel</h3>
<p><strong>Multichannel</strong> means a brand is present on many channels — website, app, store, social — but each operates somewhat independently. <strong>Omnichannel</strong> means those channels are connected into one continuous experience: a cart started on mobile shows up on desktop; a support chat sees the customer's full order history regardless of which channel they used to order.</p>
<pre><code>Multichannel: website | app | store  (separate carts, separate history)
Omnichannel:  website <-> app <-> store  (one shared cart, one shared profile)
</code></pre>
<h3>Mapping the digital customer journey</h3>
<p>A <strong>customer journey map</strong> lists every touchpoint (ad, website visit, email, app notification, in-store pickup) across the awareness → consideration → purchase → retention stages, and identifies where the experience breaks (e.g. a promo shown on social doesn't apply at checkout on the app).</p>
<h3>Automation &amp; personalization</h3>
<p><strong>Marketing automation</strong> (triggered emails/notifications based on behavior, e.g. an abandoned-cart reminder) and a unified <strong>CRM</strong> (one customer record across channels) let a brand deliver <strong>personalization at scale</strong> — the right message to the right person at the right moment — without manually managing each customer.</p>
<div class="callout"><span class="badge">Integration is the point</span> IMC in a digital world is, at its core, an integration problem: message consistency (Ch.2), channel mix (Ch.3) and now data/systems all have to connect, or "omnichannel" is just a slogan.</div>`,
    `<span class="eyebrow">IMC301c · Chương 7 · Bài 7.1</span>
<h2>Tích hợp omnichannel &amp; hành trình khách hàng số</h2>
<h3>Multichannel khác omnichannel</h3>
<p><strong>Multichannel</strong> nghĩa là brand có mặt trên nhiều kênh — website, app, cửa hàng, social — nhưng mỗi kênh hoạt động khá độc lập. <strong>Omnichannel</strong> nghĩa là các kênh đó được kết nối thành một trải nghiệm liên tục: giỏ hàng bắt đầu trên mobile hiện lại trên desktop; chat hỗ trợ thấy toàn bộ lịch sử đơn hàng bất kể khách đặt qua kênh nào.</p>
<pre><code>Multichannel: website | app | cửa hàng  (giỏ hàng riêng, lịch sử riêng)
Omnichannel:  website <-> app <-> cửa hàng  (một giỏ hàng chung, một hồ sơ chung)
</code></pre>
<h3>Bản đồ hành trình khách hàng số</h3>
<p><strong>Bản đồ hành trình khách hàng</strong> liệt kê mọi điểm chạm (quảng cáo, vào website, email, thông báo app, nhận hàng tại cửa hàng) qua các giai đoạn nhận biết → cân nhắc → mua → duy trì, và xác định trải nghiệm gãy ở đâu (vd ưu đãi hiện trên social không áp dụng được lúc thanh toán trên app).</p>
<h3>Automation & cá nhân hoá</h3>
<p><strong>Marketing automation</strong> (email/thông báo tự kích hoạt theo hành vi, vd nhắc giỏ hàng bị bỏ quên) và một <strong>CRM</strong> thống nhất (một hồ sơ khách hàng xuyên kênh) cho phép brand tạo <strong>cá nhân hoá quy mô lớn</strong> — đúng thông điệp, đúng người, đúng lúc — mà không cần quản lý tay từng khách hàng.</p>
<div class="callout"><span class="badge">Tích hợp là trọng tâm</span> IMC trong thế giới số, về bản chất, là bài toán tích hợp: nhất quán thông điệp (Ch.2), phối kênh (Ch.3) và giờ cả dữ liệu/hệ thống đều phải nối lại, nếu không "omnichannel" chỉ là slogan.</div>`,
  ]]);

const c7q = quiz('imc301c-quiz-7', 'Quiz 7 — Omnichannel & customer journey|||Quiz 7 — Omnichannel & hành trình khách hàng', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa multichannel và omnichannel là gì?', options: ['Omnichannel có ít kênh hơn', 'Omnichannel kết nối các kênh thành một trải nghiệm/dữ liệu liên tục, multichannel thì tách rời', 'Multichannel chỉ dùng cho B2B', 'Không có khác biệt thực chất'], correctIndex: 1, explanation: 'Omnichannel chia sẻ dữ liệu/trải nghiệm xuyên kênh; multichannel để mỗi kênh hoạt động riêng.' },
  { id: 'q2', question: 'Marketing automation thường dùng để làm gì?', options: ['Thay thế toàn bộ nhân viên marketing', 'Tự động gửi thông điệp theo hành vi khách hàng (vd nhắc giỏ hàng bỏ quên)', 'Chỉ chạy quảng cáo trả tiền', 'Xoá dữ liệu khách hàng cũ'], correctIndex: 1, explanation: 'Automation kích hoạt thông điệp dựa trên hành vi, ví dụ email nhắc giỏ hàng.' },
  { id: 'q3', question: 'Bản đồ hành trình khách hàng dùng để làm gì?', options: ['Chỉ để trang trí báo cáo', 'Xác định mọi điểm chạm và tìm nơi trải nghiệm bị gãy giữa các kênh', 'Thay thế CRM', 'Chỉ áp dụng cho quảng cáo TV'], correctIndex: 1, explanation: 'Journey map giúp phát hiện điểm gãy trải nghiệm xuyên các điểm chạm và kênh.' },
]);

const c8 = doc('imc301c-8-1-measurement-trends', '8.1 — Measuring digital IMC (KPI, attribution) & trends|||8.1 — Đo lường IMC số (KPI, attribution) & xu hướng',
  'KPI theo từng giai đoạn funnel; mô hình attribution (last-click, multi-touch, data-driven); ROI/ROAS; AI content, cookieless, social commerce.',
  [[
    `<span class="eyebrow">IMC301c · Chapter 8 · Lesson 8.1</span>
<h2>Measuring digital IMC (KPI, attribution) &amp; trends</h2>
<h3>KPIs by funnel stage</h3>
<pre><code>Awareness     -> impressions, reach, video views
Consideration -> click-through rate (CTR), website sessions, engagement rate
Conversion    -> conversion rate, cost per acquisition (CPA), sales
Retention     -> repeat purchase rate, customer lifetime value (CLV)
</code></pre>
<p>Picking the wrong KPI for the stage causes bad decisions — e.g. judging an awareness campaign by conversion rate will make it look like a failure even when it's doing its job.</p>
<h3>Attribution models</h3>
<ul>
<li><strong>Last-click attribution</strong> — gives 100% credit to the final touchpoint before conversion; simple but ignores everything that built up intent earlier.</li>
<li><strong>Multi-touch attribution</strong> — splits credit across several touchpoints in the journey (e.g. equally, or weighted toward first/last).</li>
<li><strong>Data-driven attribution</strong> — uses statistical modeling on actual conversion data to assign credit based on real influence, not a fixed rule.</li>
</ul>
<p>Because digital journeys are non-linear (Ch.1), attribution choice directly changes which channel looks "responsible" for a sale — and therefore where next quarter's budget goes.</p>
<h3>ROI / ROAS &amp; dashboards</h3>
<p><strong>ROAS</strong> (Return on Ad Spend) = revenue generated ÷ ad spend. Dashboards pulling data from ads platforms, website analytics and CRM into one view let a marketer see the whole IMC mix's performance, not just one channel in isolation.</p>
<h3>Trends worth watching</h3>
<p><strong>AI-generated content</strong> (drafting, personalizing at scale) is speeding up production but raising authenticity questions; a <strong>cookieless future</strong> (browsers restricting third-party tracking) is pushing brands back toward first-party data (owned media, Ch.3) and contextual targeting; <strong>social commerce</strong> (buying directly inside a social app) is collapsing the gap between "seeing an ad" and "purchase" to a single tap.</p>`,
    `<span class="eyebrow">IMC301c · Chương 8 · Bài 8.1</span>
<h2>Đo lường IMC số (KPI, attribution) &amp; xu hướng</h2>
<h3>KPI theo từng giai đoạn funnel</h3>
<pre><code>Nhận biết    -> impression, reach, số view video
Cân nhắc     -> tỉ lệ click (CTR), số session website, tỉ lệ tương tác
Chuyển đổi   -> tỉ lệ chuyển đổi, chi phí mỗi khách (CPA), doanh số
Duy trì      -> tỉ lệ mua lại, giá trị vòng đời khách hàng (CLV)
</code></pre>
<p>Chọn sai KPI cho đúng giai đoạn dẫn đến quyết định sai — vd đánh giá chiến dịch nhận biết bằng tỉ lệ chuyển đổi sẽ khiến nó trông như thất bại dù nó đang làm đúng việc của nó.</p>
<h3>Mô hình attribution</h3>
<ul>
<li><strong>Last-click attribution</strong> — cho 100% công cho điểm chạm cuối trước khi chuyển đổi; đơn giản nhưng bỏ qua mọi thứ đã xây ý định trước đó.</li>
<li><strong>Multi-touch attribution</strong> — chia công cho nhiều điểm chạm trong hành trình (vd chia đều, hoặc nghiêng về điểm đầu/cuối).</li>
<li><strong>Data-driven attribution</strong> — dùng mô hình thống kê trên dữ liệu chuyển đổi thật để gán công theo ảnh hưởng thực, không theo quy tắc cố định.</li>
</ul>
<p>Vì hành trình số không tuyến tính (Ch.1), lựa chọn attribution trực tiếp thay đổi kênh nào "được ghi công" cho một đơn bán — và vì thế ngân sách quý sau sẽ đổ vào đâu.</p>
<h3>ROI / ROAS & dashboard</h3>
<p><strong>ROAS</strong> (Return on Ad Spend) = doanh thu tạo ra ÷ chi phí quảng cáo. Dashboard gom dữ liệu từ nền tảng quảng cáo, analytics website và CRM vào một màn hình giúp marketer thấy hiệu quả toàn bộ hỗn hợp IMC, không chỉ một kênh riêng lẻ.</p>
<h3>Xu hướng cần theo dõi</h3>
<p><strong>Nội dung do AI tạo</strong> (soạn thảo, cá nhân hoá quy mô lớn) đang đẩy nhanh sản xuất nhưng dấy lên câu hỏi về tính chân thực; <strong>tương lai cookieless</strong> (trình duyệt hạn chế theo dõi bên thứ ba) đang đẩy brand quay về dữ liệu first-party (owned media, Ch.3) và nhắm mục tiêu theo ngữ cảnh; <strong>social commerce</strong> (mua trực tiếp trong app social) đang thu hẹp khoảng cách giữa "thấy quảng cáo" và "mua" chỉ còn một cú chạm.</p>`,
  ]]);

const c8q = quiz('imc301c-quiz-8', 'Quiz 8 — Measurement & trends|||Quiz 8 — Đo lường & xu hướng', [
  { id: 'q1', question: 'Vì sao đánh giá một chiến dịch nhận biết bằng KPI tỉ lệ chuyển đổi thường sai?', options: ['Vì tỉ lệ chuyển đổi luôn bằng 0', 'Vì đó không phải KPI đúng cho giai đoạn nhận biết, dễ kết luận sai là thất bại', 'Vì chiến dịch nhận biết không đo được', 'Vì KPI chuyển đổi chỉ dùng cho email'], correctIndex: 1, explanation: 'Mỗi giai đoạn funnel cần KPI phù hợp; dùng sai KPI dẫn đến kết luận sai.' },
  { id: 'q2', question: 'Last-click attribution có nhược điểm gì?', options: ['Quá phức tạp để tính', 'Bỏ qua vai trò của các điểm chạm trước đó trong hành trình', 'Chỉ dùng được cho TV', 'Không thể đo được'], correctIndex: 1, explanation: 'Last-click cho 100% công cho điểm chạm cuối, bỏ qua ảnh hưởng của các điểm chạm sớm hơn.' },
  { id: 'q3', question: 'Xu hướng "cookieless" đang đẩy brand quay về đâu?', options: ['Quảng cáo TV truyền thống', 'Dữ liệu first-party qua owned media & nhắm mục tiêu theo ngữ cảnh', 'Bỏ hoàn toàn quảng cáo số', 'Chỉ dùng influencer mega'], correctIndex: 1, explanation: 'Khi tracking bên thứ ba bị hạn chế, dữ liệu first-party (owned media) trở nên quan trọng hơn.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'IMC301c',
    slug: 'imc301c-integrated-marketing-communication-in-digital-world',
    title: 'Integrated Marketing Communication in Digital World',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IMC301c.webp',
    shortDescription: 'IMC in the digital world: consumer behavior, digital message & positioning, owned/earned/paid channels, content & storytelling, social/influencer, digital ads & programmatic, omnichannel journeys, KPI & attribution. Bilingual, quizzes.|||IMC trong thế giới số: hành vi tiêu dùng, thông điệp & định vị số, kênh owned/earned/paid, content & kể chuyện, social/influencer, quảng cáo số & programmatic, hành trình omnichannel, KPI & attribution. Song ngữ, có quiz.',
    description: 'Môn <strong>IMC301c — Integrated Marketing Communication in Digital World</strong> (kỳ 3, khối BBA) nhấn góc <strong>số</strong> của IMC, khác MKT304 (bộ công cụ IMC cổ điển). Từ <strong>hành vi tiêu dùng số</strong> → <strong>thông điệp &amp; định vị thương hiệu số</strong> → <strong>kênh owned/earned/paid</strong> → <strong>content marketing &amp; storytelling</strong> → <strong>social media &amp; influencer</strong> → <strong>quảng cáo số &amp; programmatic</strong> → <strong>tích hợp omnichannel</strong> → <strong>đo lường (KPI, attribution) &amp; xu hướng</strong>. Bám giáo trình Belch &amp; Belch, Kotler Marketing 5.0, Chaffey Digital Marketing; song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Hành trình khách hàng số không tuyến tính (ROPO); thông điệp thích nghi theo nền tảng & nhất quán tông giọng; khung owned/earned/paid (POEM); content pillar, tái sử dụng, storytelling, SEO; tầng influencer & KOL/KOC, social listening; SEM/display, programmatic (RTB/DSP/SSP), retargeting, CPC/CPM/CPA; omnichannel vs multichannel, marketing automation & CRM; KPI theo funnel, mô hình attribution, ROAS, xu hướng AI content/cookieless/social commerce.',
    requirements: 'Kiến thức Marketing căn bản (nên đã học MKT304 hoặc tương đương). Có tài khoản mạng xã hội để tham khảo ví dụ thực tế là một lợi thế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'IMC301c khác MKT304 ra sao, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — IMC số & hành vi tiêu dùng|||Chapter 1 — Digital IMC & consumer behavior', description: 'Đa màn hình, UGC, feed thuật toán, hành trình không tuyến tính, ROPO.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thông điệp & định vị số|||Chapter 2 — Digital message & positioning', description: 'Message-market fit theo nền tảng, nhất quán tông giọng.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kênh owned/earned/paid|||Chapter 3 — Owned/earned/paid channels', description: 'Khung POEM, phối trộn kênh số.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Content & kể chuyện|||Chapter 4 — Content & storytelling', description: 'Content pillar, tái sử dụng, SEO, evergreen vs trending.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Social & influencer|||Chapter 5 — Social & influencer', description: 'Tầng influencer, KOL/KOC, social listening.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quảng cáo số & programmatic|||Chapter 6 — Digital ads & programmatic', description: 'SEM, display, RTB/DSP/SSP, retargeting, CPC/CPM/CPA.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Omnichannel & hành trình khách hàng|||Chapter 7 — Omnichannel & customer journey', description: 'Multichannel vs omnichannel, automation & CRM.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & xu hướng|||Chapter 8 — Measurement & trends', description: 'KPI theo funnel, attribution, ROAS, xu hướng.', lessons: [c8, c8q] },
  ],
};
