/**
 * IMC301 — Integrated Marketing Communication in Digital World. Môn NÂNG CAO
 * tiếp nối IMC201 (nền IMC), đi SÂU vào truyền thông marketing trong môi
 * trường số. Không có FLM syllabus → bám sách chuẩn quốc tế: Chaffey &
 * Ellis-Chadwick "Digital Marketing", Kingsnorth "Digital Marketing Strategy",
 * Belch & Belch (phần digital), + Google Digital Garage / Meta Blueprint /
 * HubSpot. Song ngữ VI+EN, công cụ/nền tảng thật + ví dụ chiến dịch số.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick/${; "&"→&amp;
 * chỉ trong HTML content; content PHẢI .join('\n') ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('imc301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách chuẩn (Chaffey, Kingsnorth, Belch & Belch), khoá miễn phí (Google Digital Garage, Meta Blueprint, HubSpot Academy), công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">IMC301 · Materials</span>
<h2>Materials &amp; resource hub</h2>
<p class="lead">Everything for <strong>Integrated Marketing Communication in the digital world</strong> in one place — the advanced follow-up to IMC201. Here you go deep into <strong>digital channels</strong>: search, paid ads, social, influencers, email automation, video/mobile and integrated measurement.</p>
<h3>📗 Core textbooks</h3>
<ul>
<li><a href="https://www.pearson.com/en-gb/subject-catalog/p/digital-marketing/P200000005719" target="_blank" rel="noopener">Chaffey &amp; Ellis-Chadwick — <em>Digital Marketing: Strategy, Implementation and Practice</em></a> (the RACE planning framework)</li>
<li><a href="https://www.koganpage.com/product/digital-marketing-strategy-9781398605978" target="_blank" rel="noopener">Simon Kingsnorth — <em>Digital Marketing Strategy: An Integrated Approach</em></a></li>
<li>Belch &amp; Belch — <em>Advertising and Promotion: An IMC Perspective</em> (digital &amp; social chapters)</li>
</ul>
<h3>🌐 Free official courses &amp; certificates</h3>
<ul>
<li><a href="https://grow.google/certificates/" target="_blank" rel="noopener">Google Digital Garage / Skillshop</a> — fundamentals of digital marketing, Google Ads &amp; Analytics (GA4) certifications</li>
<li><a href="https://www.facebook.com/business/learn" target="_blank" rel="noopener">Meta Blueprint</a> — official Facebook &amp; Instagram advertising courses</li>
<li><a href="https://academy.hubspot.com/" target="_blank" rel="noopener">HubSpot Academy</a> — inbound, content, email &amp; marketing automation (free certs)</li>
</ul>
<h3>🛠️ Tools you will actually use</h3>
<ul>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4 (GA4)</a> &amp; <a href="https://ads.google.com/" target="_blank" rel="noopener">Google Ads</a></li>
<li><a href="https://business.facebook.com/" target="_blank" rel="noopener">Meta Business Suite &amp; Ads Manager</a></li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a>, <a href="https://ahrefs.com/" target="_blank" rel="noopener">Ahrefs</a> / <a href="https://semrush.com/" target="_blank" rel="noopener">Semrush</a> (SEO &amp; keywords)</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — revisit IMC201 (message, audience, media mix) then learn the digital funnel &amp; RACE.</li>
<li><strong>Channels</strong> — SEO/content, paid search &amp; display, social, influencers, email automation.</li>
<li><strong>Practice</strong> — run a small real campaign (a Meta or Google Ads test) and read GA4.</li>
<li><strong>Job-ready</strong> — build an integrated plan with a budget, KPIs, attribution &amp; a dashboard.</li>
</ol></div>`,
    `<span class="eyebrow">IMC301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho <strong>Truyền thông marketing tích hợp trong môi trường số</strong> gom về một chỗ — môn nâng cao tiếp nối IMC201. Ở đây bạn đào SÂU vào <strong>kênh số</strong>: tìm kiếm, quảng cáo trả phí, mạng xã hội, influencer, email automation, video/mobile và đo lường tích hợp.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://www.pearson.com/en-gb/subject-catalog/p/digital-marketing/P200000005719" target="_blank" rel="noopener">Chaffey &amp; Ellis-Chadwick — <em>Digital Marketing: Strategy, Implementation and Practice</em></a> (khung hoạch định RACE)</li>
<li><a href="https://www.koganpage.com/product/digital-marketing-strategy-9781398605978" target="_blank" rel="noopener">Simon Kingsnorth — <em>Digital Marketing Strategy: An Integrated Approach</em></a></li>
<li>Belch &amp; Belch — <em>Advertising and Promotion: An IMC Perspective</em> (chương digital &amp; social)</li>
</ul>
<h3>🌐 Khoá học &amp; chứng chỉ miễn phí chính thức</h3>
<ul>
<li><a href="https://grow.google/certificates/" target="_blank" rel="noopener">Google Digital Garage / Skillshop</a> — nền tảng digital marketing, chứng chỉ Google Ads &amp; Analytics (GA4)</li>
<li><a href="https://www.facebook.com/business/learn" target="_blank" rel="noopener">Meta Blueprint</a> — khoá quảng cáo Facebook &amp; Instagram chính thức</li>
<li><a href="https://academy.hubspot.com/" target="_blank" rel="noopener">HubSpot Academy</a> — inbound, content, email &amp; marketing automation (chứng chỉ miễn phí)</li>
</ul>
<h3>🛠️ Công cụ dùng thật</h3>
<ul>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4 (GA4)</a> &amp; <a href="https://ads.google.com/" target="_blank" rel="noopener">Google Ads</a></li>
<li><a href="https://business.facebook.com/" target="_blank" rel="noopener">Meta Business Suite &amp; Ads Manager</a></li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a>, <a href="https://ahrefs.com/" target="_blank" rel="noopener">Ahrefs</a> / <a href="https://semrush.com/" target="_blank" rel="noopener">Semrush</a> (SEO &amp; từ khoá)</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — ôn IMC201 (thông điệp, công chúng, media mix) rồi học phễu số &amp; RACE.</li>
<li><strong>Kênh</strong> — SEO/content, quảng cáo tìm kiếm &amp; display, social, influencer, email automation.</li>
<li><strong>Thực hành</strong> — chạy một chiến dịch thật nhỏ (test Meta hoặc Google Ads) và đọc GA4.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng kế hoạch tích hợp có ngân sách, KPI, attribution &amp; dashboard.</li>
</ol></div>`,
  ]]);

const intro = doc('imc301-0-1-overview', 'Course overview: IMC in the digital world|||Tổng quan: IMC trong môi trường số',
  'Vì sao IMC chuyển lên số; IMC301 đào sâu digital, IMC201 là nền; lộ trình 8 chương: chiến lược & RACE → SEO/content → paid ads → social → influencer → email automation → video/mobile → đo lường tích hợp.',
  [[
    `<span class="eyebrow">IMC301 · Lesson 0.1 · Overview</span>
<h2>Integrated Marketing Communication in the digital world</h2>
<p class="lead"><strong>IMC201</strong> taught you the foundation: one clear message, one voice, delivered across a coordinated media mix. <strong>IMC301</strong> takes that principle into the channels where audiences now actually live — <strong>digital</strong> — and goes deep into each one.</p>
<h3>Why integration matters MORE online</h3>
<p>A modern customer touches a brand on search, social, email, video and a website before buying. If those messages contradict each other the brand feels broken. IMC's core idea — <strong>"speak with one voice"</strong> — is harder and more valuable when there are ten digital touchpoints instead of two.</p>
<h3>From IMC201 (foundation) to IMC301 (digital depth)</h3>
<ul>
<li><strong>IMC201 gave you:</strong> the promotional mix, message strategy, audience &amp; positioning, campaign brief.</li>
<li><strong>IMC301 adds:</strong> how each digital channel really works — SEO, paid search &amp; programmatic, social, influencers, email automation, video/mobile — and how to measure them together.</li>
</ul>
<h3>The 8-chapter roadmap</h3>
<p>Digital IMC strategy &amp; the <strong>RACE</strong> funnel → SEO &amp; content → paid digital advertising → social media → influencer/KOL/KOC → email &amp; automation → video, mobile &amp; emerging → integrated digital measurement.</p>
<div class="callout"><span class="badge">Big idea</span> A channel is just a pipe. IMC is what you send through ALL the pipes so they add up to one story.</div>`,
    `<span class="eyebrow">IMC301 · Bài 0.1 · Tổng quan</span>
<h2>Truyền thông marketing tích hợp trong môi trường số</h2>
<p class="lead"><strong>IMC201</strong> đã dạy bạn phần nền: một thông điệp rõ, một giọng nói, truyền qua một media mix phối hợp. <strong>IMC301</strong> đưa nguyên tắc đó vào các kênh mà công chúng giờ thực sự sống — <strong>số</strong> — và đào sâu từng kênh.</p>
<h3>Vì sao tích hợp còn QUAN TRỌNG HƠN khi lên số</h3>
<p>Khách hàng hiện đại chạm thương hiệu trên tìm kiếm, mạng xã hội, email, video và website trước khi mua. Nếu các thông điệp đó mâu thuẫn, thương hiệu trông rời rạc. Ý cốt lõi của IMC — <strong>"nói bằng một giọng"</strong> — khó hơn và giá trị hơn khi có mười điểm chạm số thay vì hai.</p>
<h3>Từ IMC201 (nền) đến IMC301 (chiều sâu số)</h3>
<ul>
<li><strong>IMC201 cho bạn:</strong> hỗn hợp xúc tiến, chiến lược thông điệp, công chúng &amp; định vị, bản brief chiến dịch.</li>
<li><strong>IMC301 thêm:</strong> từng kênh số thật sự vận hành ra sao — SEO, quảng cáo tìm kiếm &amp; programmatic, social, influencer, email automation, video/mobile — và cách đo chúng cùng nhau.</li>
</ul>
<h3>Lộ trình 8 chương</h3>
<p>Chiến lược IMC số &amp; phễu <strong>RACE</strong> → SEO &amp; content → quảng cáo số trả phí → mạng xã hội → influencer/KOL/KOC → email &amp; automation → video, mobile &amp; công nghệ mới → đo lường số tích hợp.</p>
<div class="callout"><span class="badge">Ý lớn</span> Một kênh chỉ là cái ống. IMC là thứ bạn gửi qua TẤT CẢ các ống sao cho chúng cộng lại thành một câu chuyện.</div>`,
  ]]);

const c1 = doc('imc301-1-1-strategy-race', '1.1 — Digital IMC strategy & RACE planning|||1.1 — Chiến lược IMC số & hoạch định RACE',
  'Khung RACE (Reach–Act–Convert–Engage), phễu số, đặt mục tiêu SMART & KPI theo giai đoạn, ngân sách và phối kênh tích hợp.',
  [[
    `<span class="eyebrow">IMC301 · Chapter 1 · Lesson 1.1</span>
<h2>Digital IMC strategy &amp; RACE planning</h2>
<h3>The RACE framework (Chaffey / Smart Insights)</h3>
<p><strong>RACE</strong> maps the customer journey into four planning stages, each with its own goal, tactics and KPIs:</p>
<ul>
<li><strong>Reach</strong> — build awareness &amp; traffic (SEO, paid ads, social, PR). KPI: impressions, reach, sessions.</li>
<li><strong>Act</strong> — interact &amp; generate leads (content, landing pages, lead magnets). KPI: engagement, leads, time on site.</li>
<li><strong>Convert</strong> — turn leads into sales (retargeting, email, offers, checkout). KPI: conversion rate, sales, ROAS.</li>
<li><strong>Engage</strong> — retain &amp; grow loyalty (email, community, loyalty). KPI: repeat rate, CLV, advocacy.</li>
</ul>
<h3>The digital funnel &amp; SMART objectives</h3>
<pre><code>AWARENESS  (Reach)   -> "40% of segment X know the brand in Q2"
INTEREST   (Act)     -> "5,000 email leads at &lt;= 20,000đ CPL"
DESIRE/ACTION (Convert) -> "ROAS &gt;= 4 on paid search"
LOYALTY    (Engage)  -> "repeat-purchase rate 25% -&gt; 32%"
</code></pre>
<p>Every objective is <strong>SMART</strong> — Specific, Measurable, Achievable, Relevant, Time-bound — and tied to one RACE stage so budget follows the journey.</p>
<div class="callout"><span class="badge">Integrated example</span> A skincare launch: TikTok + influencers for <em>Reach</em>, a quiz landing page for <em>Act</em>, retargeting ads + email for <em>Convert</em>, a members community for <em>Engage</em> — one message, four coordinated stages.</div>`,
    `<span class="eyebrow">IMC301 · Chương 1 · Bài 1.1</span>
<h2>Chiến lược IMC số &amp; hoạch định RACE</h2>
<h3>Khung RACE (Chaffey / Smart Insights)</h3>
<p><strong>RACE</strong> chia hành trình khách hàng thành bốn giai đoạn hoạch định, mỗi giai đoạn có mục tiêu, chiến thuật và KPI riêng:</p>
<ul>
<li><strong>Reach (Tiếp cận)</strong> — tạo nhận biết &amp; lưu lượng (SEO, quảng cáo trả phí, social, PR). KPI: hiển thị, reach, phiên.</li>
<li><strong>Act (Tương tác)</strong> — tương tác &amp; tạo lead (content, landing page, lead magnet). KPI: tương tác, lead, thời gian trên trang.</li>
<li><strong>Convert (Chuyển đổi)</strong> — biến lead thành đơn (retargeting, email, ưu đãi, thanh toán). KPI: tỉ lệ chuyển đổi, doanh số, ROAS.</li>
<li><strong>Engage (Gắn kết)</strong> — giữ chân &amp; nuôi trung thành (email, cộng đồng, loyalty). KPI: tỉ lệ mua lại, CLV, giới thiệu.</li>
</ul>
<h3>Phễu số &amp; mục tiêu SMART</h3>
<pre><code>NHẬN BIẾT  (Reach)   -> "40% nhóm X biết thương hiệu trong Q2"
QUAN TÂM   (Act)     -> "5.000 lead email với CPL &lt;= 20.000đ"
MONG MUỐN/HÀNH ĐỘNG (Convert) -> "ROAS &gt;= 4 trên quảng cáo tìm kiếm"
TRUNG THÀNH (Engage) -> "tỉ lệ mua lại 25% -&gt; 32%"
</code></pre>
<p>Mỗi mục tiêu đều <strong>SMART</strong> — Cụ thể, Đo được, Khả thi, Liên quan, Có hạn — và gắn với một giai đoạn RACE để ngân sách bám theo hành trình.</p>
<div class="callout"><span class="badge">Ví dụ tích hợp</span> Ra mắt mỹ phẩm: TikTok + influencer cho <em>Reach</em>, landing page trắc nghiệm cho <em>Act</em>, quảng cáo retargeting + email cho <em>Convert</em>, cộng đồng thành viên cho <em>Engage</em> — một thông điệp, bốn giai đoạn phối hợp.</div>`,
  ]]);

const c1q = quiz('imc301-quiz-1', 'Quiz 1 — Strategy & RACE|||Quiz 1 — Chiến lược & RACE', [
  { id: 'q1', question: 'Bốn giai đoạn của khung RACE theo đúng thứ tự là?', options: ['Research–Act–Create–Engage', 'Reach–Act–Convert–Engage', 'Reach–Advertise–Close–Email', 'Read–Act–Convert–Evaluate'], correctIndex: 1, explanation: 'RACE = Reach (tiếp cận) → Act (tương tác) → Convert (chuyển đổi) → Engage (gắn kết).' },
  { id: 'q2', question: 'KPI "ROAS >= 4" phù hợp nhất với giai đoạn nào?', options: ['Reach', 'Act', 'Convert', 'Engage'], correctIndex: 2, explanation: 'ROAS (doanh thu/chi phí quảng cáo) đo hiệu quả chuyển đổi thành đơn — giai đoạn Convert.' },
  { id: 'q3', question: 'Mục tiêu SMART khác mục tiêu chung ở chỗ?', options: ['Luôn dùng ngân sách lớn', 'Cụ thể, đo được, khả thi, liên quan, có hạn thời gian', 'Chỉ dành cho mạng xã hội', 'Không cần KPI'], correctIndex: 1, explanation: 'SMART = Specific, Measurable, Achievable, Relevant, Time-bound.' },
]);

const c2 = doc('imc301-2-1-seo-content', '2.1 — SEO & content marketing|||2.1 — SEO & content marketing',
  'Tìm kiếm tự nhiên (organic), ý định tìm kiếm & keyword, on-page/technical/off-page, content pillar–cluster, inbound marketing.',
  [[
    `<span class="eyebrow">IMC301 · Chapter 2 · Lesson 2.1</span>
<h2>SEO &amp; content marketing</h2>
<h3>How organic search works</h3>
<p><strong>SEO (Search Engine Optimization)</strong> earns free, ongoing traffic from Google's organic results. Three pillars:</p>
<ul>
<li><strong>On-page</strong> — title, headings, content matching <em>search intent</em>, internal links.</li>
<li><strong>Technical</strong> — site speed, mobile-friendliness, crawlable structure, HTTPS, schema.</li>
<li><strong>Off-page</strong> — backlinks &amp; authority from other trusted sites.</li>
</ul>
<h3>Keywords &amp; search intent</h3>
<p>Pick keywords by <strong>intent</strong>, not just volume: informational ("what is retinol"), commercial ("best retinol serum"), transactional ("buy retinol serum"). Tools: <strong>Google Keyword Planner, Ahrefs, Semrush, Google Trends</strong>.</p>
<h3>Content pillar–cluster &amp; inbound</h3>
<pre><code>PILLAR page: "Skincare routine" (broad, authoritative)
  └─ cluster: "How to layer serums"
  └─ cluster: "Retinol for beginners"
  └─ cluster: "Morning vs night routine"
(each cluster links back to the pillar -> topical authority)
</code></pre>
<p><strong>Inbound marketing</strong> flips advertising around: instead of interrupting people, you publish content they are already searching for, so they come to you — the organic engine of the <em>Act</em> stage.</p>
<div class="callout"><span class="badge">Digital campaign</span> A DTC brand builds a pillar–cluster blog; six months later organic search delivers 60% of leads at near-zero marginal cost, feeding email &amp; retargeting downstream.</div>`,
    `<span class="eyebrow">IMC301 · Chương 2 · Bài 2.1</span>
<h2>SEO &amp; content marketing</h2>
<h3>Tìm kiếm tự nhiên hoạt động ra sao</h3>
<p><strong>SEO (Tối ưu công cụ tìm kiếm)</strong> mang lưu lượng miễn phí, lâu dài từ kết quả tự nhiên của Google. Ba trụ:</p>
<ul>
<li><strong>On-page</strong> — tiêu đề, heading, nội dung khớp <em>ý định tìm kiếm</em>, liên kết nội bộ.</li>
<li><strong>Technical (kỹ thuật)</strong> — tốc độ, thân thiện mobile, cấu trúc crawl được, HTTPS, schema.</li>
<li><strong>Off-page</strong> — backlink &amp; uy tín từ các site đáng tin khác.</li>
</ul>
<h3>Từ khoá &amp; ý định tìm kiếm</h3>
<p>Chọn từ khoá theo <strong>ý định</strong>, không chỉ theo lượng: thông tin ("retinol là gì"), thương mại ("serum retinol tốt nhất"), giao dịch ("mua serum retinol"). Công cụ: <strong>Google Keyword Planner, Ahrefs, Semrush, Google Trends</strong>.</p>
<h3>Content pillar–cluster &amp; inbound</h3>
<pre><code>Trang PILLAR: "Quy trình chăm da" (rộng, uy tín)
  └─ cluster: "Cách xếp lớp serum"
  └─ cluster: "Retinol cho người mới"
  └─ cluster: "Routine sáng vs tối"
(mỗi cluster trỏ về pillar -> uy tín chủ đề)
</code></pre>
<p><strong>Inbound marketing</strong> lật ngược quảng cáo: thay vì cắt ngang, bạn xuất bản nội dung mà người ta đang tìm, để họ đến với mình — động cơ tự nhiên của giai đoạn <em>Act</em>.</p>
<div class="callout"><span class="badge">Chiến dịch số</span> Một thương hiệu DTC dựng blog pillar–cluster; sáu tháng sau tìm kiếm tự nhiên mang 60% lead với chi phí biên gần bằng 0, nuôi tiếp email &amp; retargeting phía sau.</div>`,
  ]]);

const c2q = quiz('imc301-quiz-2', 'Quiz 2 — SEO & content|||Quiz 2 — SEO & content', [
  { id: 'q1', question: 'Ba trụ của SEO là?', options: ['Paid, owned, earned', 'On-page, technical, off-page', 'Reach, Act, Convert', 'CPC, CPM, CPA'], correctIndex: 1, explanation: 'SEO gồm on-page (nội dung/khớp ý định), technical (kỹ thuật site), off-page (backlink/uy tín).' },
  { id: 'q2', question: 'Từ khoá "mua serum retinol" thể hiện ý định gì?', options: ['Thông tin (informational)', 'Điều hướng (navigational)', 'Giao dịch (transactional)', 'Không có ý định'], correctIndex: 2, explanation: 'Từ chứa "mua" là ý định giao dịch — người dùng sẵn sàng mua.' },
  { id: 'q3', question: 'Inbound marketing khác quảng cáo truyền thống ở chỗ?', options: ['Luôn trả tiền cho mỗi click', 'Cắt ngang người xem bằng banner', 'Thu hút bằng nội dung người ta đang tìm thay vì cắt ngang', 'Chỉ chạy trên TV'], correctIndex: 2, explanation: 'Inbound tạo giá trị/nội dung để khách tự tìm đến, thay vì gián đoạn (outbound).' },
]);

const c3 = doc('imc301-3-1-paid-ads', '3.1 — Paid digital advertising|||3.1 — Quảng cáo số trả phí',
  'SEM/Google Ads (đấu giá, Quality Score), display & programmatic, mô hình PPC/CPC/CPM/CPA, retargeting, ad rank.',
  [[
    `<span class="eyebrow">IMC301 · Chapter 3 · Lesson 3.1</span>
<h2>Paid digital advertising</h2>
<h3>Search advertising (SEM / Google Ads)</h3>
<p><strong>SEM</strong> buys visibility on the results page via an <strong>auction</strong>. You don't just outbid rivals — Google ranks you by <strong>Ad Rank = Bid × Quality Score</strong>, so a relevant ad with a good landing page can beat a higher bid. You pay <strong>PPC (pay-per-click)</strong>.</p>
<h3>Display &amp; programmatic</h3>
<ul>
<li><strong>Display</strong> — banner/image ads across the Google Display Network &amp; sites.</li>
<li><strong>Programmatic</strong> — software (a DSP) buys impressions in <em>real-time bidding (RTB)</em> auctions, targeted by audience data rather than by hand-picked sites.</li>
</ul>
<h3>The pricing models &amp; retargeting</h3>
<pre><code>CPM  - cost per 1,000 impressions  (awareness / Reach)
CPC  - cost per click              (traffic / Act)
CPA  - cost per acquisition        (sales / Convert)
</code></pre>
<p><strong>Retargeting (remarketing)</strong> shows ads to people who already visited but didn't buy — the workhorse of the <em>Convert</em> stage, usually the cheapest ROAS in the whole plan.</p>
<div class="callout"><span class="badge">Digital campaign</span> Search ads catch high-intent "buy" queries, display builds reach, and retargeting closes the visitors who bounced — three paid layers, one funnel.</div>`,
    `<span class="eyebrow">IMC301 · Chương 3 · Bài 3.1</span>
<h2>Quảng cáo số trả phí</h2>
<h3>Quảng cáo tìm kiếm (SEM / Google Ads)</h3>
<p><strong>SEM</strong> mua vị trí trên trang kết quả qua một cuộc <strong>đấu giá</strong>. Bạn không chỉ trả cao hơn đối thủ — Google xếp hạng theo <strong>Ad Rank = Giá thầu × Quality Score</strong>, nên một quảng cáo liên quan với landing page tốt có thể thắng giá thầu cao hơn. Bạn trả theo <strong>PPC (trả cho mỗi click)</strong>.</p>
<h3>Display &amp; programmatic</h3>
<ul>
<li><strong>Display</strong> — quảng cáo banner/hình ảnh trên Mạng hiển thị Google &amp; các site.</li>
<li><strong>Programmatic</strong> — phần mềm (DSP) mua lượt hiển thị trong đấu giá <em>thời gian thực (RTB)</em>, nhắm theo dữ liệu công chúng thay vì chọn tay từng site.</li>
</ul>
<h3>Các mô hình tính giá &amp; retargeting</h3>
<pre><code>CPM  - chi phí cho 1.000 lượt hiển thị (nhận biết / Reach)
CPC  - chi phí cho mỗi click           (lưu lượng / Act)
CPA  - chi phí cho mỗi chuyển đổi       (đơn hàng / Convert)
</code></pre>
<p><strong>Retargeting (remarketing)</strong> hiện quảng cáo cho người đã ghé mà chưa mua — chủ lực của giai đoạn <em>Convert</em>, thường có ROAS rẻ nhất cả kế hoạch.</p>
<div class="callout"><span class="badge">Chiến dịch số</span> Quảng cáo tìm kiếm chộp truy vấn "mua" ý định cao, display tạo reach, retargeting chốt người đã thoát — ba lớp trả phí, một phễu.</div>`,
  ]]);

const c3q = quiz('imc301-quiz-3', 'Quiz 3 — Paid ads|||Quiz 3 — Quảng cáo trả phí', [
  { id: 'q1', question: 'Trên Google Ads, thứ hạng quảng cáo (Ad Rank) được tính xấp xỉ bằng?', options: ['Chỉ giá thầu cao nhất', 'Giá thầu × Quality Score', 'Số từ khoá', 'Ngân sách ngày'], correctIndex: 1, explanation: 'Ad Rank ≈ Bid × Quality Score, nên quảng cáo liên quan có thể thắng dù thầu thấp hơn.' },
  { id: 'q2', question: 'Mô hình CPM tính tiền theo?', options: ['Mỗi click', 'Mỗi 1.000 lượt hiển thị', 'Mỗi đơn hàng', 'Mỗi lead'], correctIndex: 1, explanation: 'CPM = cost per mille = chi phí cho mỗi 1.000 lượt hiển thị, hợp cho mục tiêu nhận biết.' },
  { id: 'q3', question: 'Retargeting nhắm vào ai?', options: ['Người chưa từng biết thương hiệu', 'Người đã ghé/tương tác nhưng chưa chuyển đổi', 'Chỉ đối thủ cạnh tranh', 'Người đã mua và không mua lại'], correctIndex: 1, explanation: 'Retargeting hiện quảng cáo lại cho người đã ghé mà chưa mua — thúc đẩy Convert.' },
]);

const c4 = doc('imc301-4-1-social-media', '4.1 — Social media marketing|||4.1 — Marketing mạng xã hội',
  'Đặc thù nền tảng (Facebook/Instagram/TikTok/LinkedIn), organic vs paid social, xây community, nội dung do người dùng tạo (UGC).',
  [[
    `<span class="eyebrow">IMC301 · Chapter 4 · Lesson 4.1</span>
<h2>Social media marketing</h2>
<h3>Match the platform to the goal</h3>
<ul>
<li><strong>Facebook</strong> — broad reach, groups &amp; community, precise ad targeting.</li>
<li><strong>Instagram</strong> — visual brand-building, Reels, shopping tags.</li>
<li><strong>TikTok</strong> — short-form video, trends, discovery &amp; virality for younger audiences.</li>
<li><strong>LinkedIn</strong> — B2B, thought leadership, recruiting.</li>
</ul>
<h3>Organic vs paid social</h3>
<pre><code>ORGANIC - free posts to followers; builds trust &amp; community,
          but reach is throttled by the algorithm (often &lt;10%).
PAID    - boosted/targeted ads; buys reach precisely, scales fast,
          the only reliable way to reach non-followers at volume.
</code></pre>
<p>The two work together: organic proves what resonates, paid amplifies the winners — a test-then-scale loop.</p>
<h3>Community &amp; UGC</h3>
<p><strong>UGC (user-generated content)</strong> — reviews, unboxings, hashtag posts — is trusted far more than brand ads and is nearly free. Brands seed it with hashtags, challenges and reposts, turning customers into media. A living <strong>community</strong> (a group, a comment culture) drives the <em>Engage</em> stage and feeds fresh UGC back to Reach.</p>
<div class="callout"><span class="badge">Digital campaign</span> A drink brand launches a TikTok hashtag challenge; thousands of UGC videos give organic reach, then the best clips are boosted as paid ads — earned + paid reinforcing one message.</div>`,
    `<span class="eyebrow">IMC301 · Chương 4 · Bài 4.1</span>
<h2>Marketing mạng xã hội</h2>
<h3>Chọn nền tảng theo mục tiêu</h3>
<ul>
<li><strong>Facebook</strong> — reach rộng, nhóm &amp; cộng đồng, nhắm quảng cáo chính xác.</li>
<li><strong>Instagram</strong> — dựng thương hiệu bằng hình ảnh, Reels, gắn thẻ mua sắm.</li>
<li><strong>TikTok</strong> — video ngắn, trend, khám phá &amp; lan truyền cho công chúng trẻ.</li>
<li><strong>LinkedIn</strong> — B2B, dẫn dắt tư tưởng, tuyển dụng.</li>
</ul>
<h3>Organic vs paid social</h3>
<pre><code>ORGANIC - bài đăng miễn phí tới follower; tạo niềm tin &amp; cộng đồng,
          nhưng reach bị thuật toán bóp (thường &lt;10%).
PAID    - bài đẩy/nhắm mục tiêu; mua reach chính xác, mở rộng nhanh,
          cách đáng tin duy nhất để chạm người ngoài follower ở quy mô.
</code></pre>
<p>Hai cái đi cùng nhau: organic chứng minh nội dung nào cộng hưởng, paid khuếch đại cái thắng — vòng lặp test-rồi-scale.</p>
<h3>Cộng đồng &amp; UGC</h3>
<p><strong>UGC (nội dung do người dùng tạo)</strong> — review, unbox, bài gắn hashtag — được tin hơn nhiều so với quảng cáo thương hiệu và gần như miễn phí. Thương hiệu gieo mầm bằng hashtag, thử thách, repost, biến khách hàng thành kênh truyền thông. Một <strong>cộng đồng</strong> sống (nhóm, văn hoá bình luận) thúc đẩy giai đoạn <em>Engage</em> và trả UGC mới về cho Reach.</p>
<div class="callout"><span class="badge">Chiến dịch số</span> Một thương hiệu đồ uống mở thử thách hashtag TikTok; hàng nghìn video UGC tạo reach tự nhiên, rồi những clip tốt nhất được đẩy thành quảng cáo trả phí — earned + paid củng cố một thông điệp.</div>`,
  ]]);

const c4q = quiz('imc301-quiz-4', 'Quiz 4 — Social media|||Quiz 4 — Mạng xã hội', [
  { id: 'q1', question: 'Điểm khác cốt lõi giữa organic và paid social?', options: ['Organic luôn nhiều reach hơn paid', 'Paid mua reach chính xác/quy mô; organic miễn phí nhưng bị thuật toán bóp reach', 'Paid chỉ dùng cho LinkedIn', 'Organic phải trả CPC'], correctIndex: 1, explanation: 'Organic miễn phí nhưng reach hữu cơ thấp; paid trả tiền để mở rộng và nhắm chính xác.' },
  { id: 'q2', question: 'UGC (user-generated content) là gì?', options: ['Quảng cáo do agency dựng', 'Nội dung do chính người dùng/khách hàng tạo ra', 'Bài đăng chỉ của KOL trả phí', 'Email tự động'], correctIndex: 1, explanation: 'UGC = review, unbox, bài hashtag... do người dùng tạo, được tin cậy cao và chi phí thấp.' },
  { id: 'q3', question: 'Nền tảng nào thường phù hợp nhất cho marketing B2B & dẫn dắt tư tưởng?', options: ['TikTok', 'Instagram', 'LinkedIn', 'Snapchat'], correctIndex: 2, explanation: 'LinkedIn là mạng nghề nghiệp, mạnh cho B2B, thought leadership và tuyển dụng.' },
]);

const c5 = doc('imc301-5-1-influencer-kol-koc', '5.1 — Influencer & KOL/KOC marketing|||5.1 — Marketing influencer & KOL/KOC',
  'Phân tầng influencer (nano→mega), KOL vs KOC, tiêu chí chọn (fit/engagement/thật giả), hình thức hợp tác, đo lường & phát hiện follower ảo.',
  [[
    `<span class="eyebrow">IMC301 · Chapter 5 · Lesson 5.1</span>
<h2>Influencer &amp; KOL/KOC marketing</h2>
<h3>Tiers &amp; the KOL vs KOC split</h3>
<ul>
<li><strong>Nano</strong> (1k–10k) &amp; <strong>micro</strong> (10k–100k) — small but highly trusted, best engagement rate.</li>
<li><strong>Macro</strong> (100k–1M) &amp; <strong>mega/celebrity</strong> (1M+) — huge reach, lower engagement, higher cost.</li>
<li><strong>KOL</strong> (Key Opinion Leader) — an expert/celebrity who shapes opinion (top-down authority).</li>
<li><strong>KOC</strong> (Key Opinion Consumer) — an ordinary consumer whose honest reviews drive purchase (bottom-up trust); central to Vietnamese e-commerce.</li>
</ul>
<h3>Choosing well</h3>
<pre><code>FIT        - audience &amp; values match the brand?
ENGAGEMENT - real comments/saves, not just follower count
AUTHENTICITY - detect fake followers (sudden spikes,
             low engagement rate, bot-like comments)
</code></pre>
<h3>Collaboration &amp; measurement</h3>
<p>Formats: sponsored post, review, affiliate (commission via a code/link), brand ambassador, livestream selling. Measure with <strong>unique promo codes, UTM links and affiliate dashboards</strong> so each creator's real sales are visible — not just likes. Engagement rate = (likes + comments + saves) / followers.</p>
<div class="callout"><span class="badge">Digital campaign</span> A brand seeds 50 micro-KOCs with product + affiliate codes; their honest reviews create trust and trackable sales, while one KOL anchors the campaign's reach.</div>`,
    `<span class="eyebrow">IMC301 · Chương 5 · Bài 5.1</span>
<h2>Marketing influencer &amp; KOL/KOC</h2>
<h3>Phân tầng &amp; KOL vs KOC</h3>
<ul>
<li><strong>Nano</strong> (1k–10k) &amp; <strong>micro</strong> (10k–100k) — nhỏ nhưng được tin cao, tỉ lệ tương tác tốt nhất.</li>
<li><strong>Macro</strong> (100k–1M) &amp; <strong>mega/người nổi tiếng</strong> (1M+) — reach lớn, tương tác thấp hơn, chi phí cao hơn.</li>
<li><strong>KOL</strong> (Key Opinion Leader) — chuyên gia/người nổi tiếng định hình quan điểm (uy tín từ trên xuống).</li>
<li><strong>KOC</strong> (Key Opinion Consumer) — người tiêu dùng bình thường mà review chân thật thúc đẩy mua (niềm tin từ dưới lên); rất trọng yếu ở TMĐT Việt Nam.</li>
</ul>
<h3>Chọn cho đúng</h3>
<pre><code>FIT (độ hợp)   - công chúng &amp; giá trị có khớp thương hiệu?
ENGAGEMENT     - bình luận/lưu THẬT, không chỉ số follower
AUTHENTICITY   - phát hiện follower ảo (tăng đột biến,
                 tỉ lệ tương tác thấp, bình luận như bot)
</code></pre>
<h3>Hình thức hợp tác &amp; đo lường</h3>
<p>Dạng: bài tài trợ, review, affiliate (hoa hồng qua mã/link), đại sứ thương hiệu, bán livestream. Đo bằng <strong>mã ưu đãi riêng, link UTM và dashboard affiliate</strong> để thấy doanh số thật của từng creator — không chỉ like. Tỉ lệ tương tác = (like + bình luận + lưu) / follower.</p>
<div class="callout"><span class="badge">Chiến dịch số</span> Một thương hiệu gieo 50 micro-KOC kèm sản phẩm + mã affiliate; review chân thật tạo niềm tin và doanh số đo được, còn một KOL neo reach cho cả chiến dịch.</div>`,
  ]]);

const c5q = quiz('imc301-quiz-5', 'Quiz 5 — Influencer & KOC|||Quiz 5 — Influencer & KOC', [
  { id: 'q1', question: 'KOC (Key Opinion Consumer) khác KOL ở chỗ?', options: ['KOC luôn có nhiều follower hơn KOL', 'KOC là người tiêu dùng thường, review chân thật tạo niềm tin từ dưới lên', 'KOC chỉ chạy quảng cáo trả phí', 'KOC là thuật toán'], correctIndex: 1, explanation: 'KOC là người dùng bình thường; sức mạnh đến từ review chân thật (bottom-up), khác KOL là chuyên gia/uy tín top-down.' },
  { id: 'q2', question: 'Dấu hiệu nào gợi ý influencer có thể mua follower ảo?', options: ['Follower đông + tỉ lệ tương tác rất thấp, tăng đột biến, bình luận như bot', 'Nhiều bình luận thật và lưu bài', 'Nội dung đúng ngách thương hiệu', 'Có mã affiliate riêng'], correctIndex: 0, explanation: 'Follower ảo lộ ở tương tác thấp bất thường so với lượng follower và các đợt tăng đột ngột.' },
  { id: 'q3', question: 'Cách tốt nhất để đo doanh số THẬT từng influencer?', options: ['Đếm lượt like', 'Mã ưu đãi riêng + link UTM + dashboard affiliate', 'Số follower của họ', 'Số bài đã đăng'], correctIndex: 1, explanation: 'Mã/link riêng cho mỗi creator giúp quy doanh số về đúng người, thay vì chỉ nhìn like.' },
]);

const c6 = doc('imc301-6-1-email-automation', '6.1 — Email & marketing automation|||6.1 — Email & marketing automation',
  'Xây danh sách (list building) & lead magnet, phân khúc (segmentation), chuỗi nuôi dưỡng (drip), luồng tự động theo hành vi, chỉ số email.',
  [[
    `<span class="eyebrow">IMC301 · Chapter 6 · Lesson 6.1</span>
<h2>Email &amp; marketing automation</h2>
<h3>Building an owned audience</h3>
<p>Email is the one channel you <strong>own</strong> — no algorithm between you and the customer. You grow the list with a <strong>lead magnet</strong> (an ebook, discount, checklist) captured on a landing page, always with explicit <strong>consent (opt-in)</strong>.</p>
<h3>Segmentation &amp; drip sequences</h3>
<ul>
<li><strong>Segmentation</strong> — split the list by behaviour/interest/lifecycle so each group gets relevant mail (relevance beats blasting everyone).</li>
<li><strong>Drip / nurture</strong> — a pre-written sequence sent over days to warm a lead toward a purchase.</li>
</ul>
<h3>Behaviour-triggered automation</h3>
<pre><code>TRIGGER: user adds to cart, then leaves
   +1h  -> "You left something behind" + product image
   +24h -> reminder + social proof / review
   +72h -> small incentive (free ship / 5%)
(abandoned-cart flow — one of the highest-ROI automations)
</code></pre>
<p>Tools like <strong>Mailchimp, HubSpot, Klaviyo</strong> fire these flows automatically. Key metrics: <strong>open rate, click-through rate (CTR), conversion rate, unsubscribe rate</strong>.</p>
<div class="callout"><span class="badge">Digital campaign</span> A store captures emails with a 10% welcome offer, segments by first purchase, then runs welcome → post-purchase → win-back flows — automated <em>Engage</em> revenue that runs 24/7.</div>`,
    `<span class="eyebrow">IMC301 · Chương 6 · Bài 6.1</span>
<h2>Email &amp; marketing automation</h2>
<h3>Xây tệp công chúng mình sở hữu</h3>
<p>Email là kênh bạn <strong>sở hữu</strong> — không thuật toán nào chen giữa bạn và khách. Bạn lớn danh sách bằng <strong>lead magnet</strong> (ebook, mã giảm, checklist) thu qua landing page, luôn kèm <strong>đồng ý (opt-in)</strong> rõ ràng.</p>
<h3>Phân khúc &amp; chuỗi drip</h3>
<ul>
<li><strong>Segmentation (phân khúc)</strong> — chia danh sách theo hành vi/quan tâm/vòng đời để mỗi nhóm nhận mail liên quan (đúng người hơn là gửi đại trà).</li>
<li><strong>Drip / nurture</strong> — chuỗi soạn sẵn gửi rải qua nhiều ngày để hâm nóng lead tới lúc mua.</li>
</ul>
<h3>Tự động hoá theo hành vi</h3>
<pre><code>KÍCH HOẠT: khách thêm giỏ rồi rời đi
   +1h  -> "Bạn để quên món này" + hình sản phẩm
   +24h -> nhắc lại + bằng chứng xã hội / review
   +72h -> ưu đãi nhỏ (free ship / 5%)
(luồng bỏ giỏ hàng — một trong các automation ROI cao nhất)
</code></pre>
<p>Công cụ như <strong>Mailchimp, HubSpot, Klaviyo</strong> kích các luồng này tự động. Chỉ số chính: <strong>tỉ lệ mở, tỉ lệ click (CTR), tỉ lệ chuyển đổi, tỉ lệ huỷ đăng ký</strong>.</p>
<div class="callout"><span class="badge">Chiến dịch số</span> Một cửa hàng thu email bằng ưu đãi chào mừng 10%, phân khúc theo lần mua đầu, rồi chạy luồng chào mừng → sau mua → kéo lại — doanh thu <em>Engage</em> tự động chạy 24/7.</div>`,
  ]]);

const c6q = quiz('imc301-quiz-6', 'Quiz 6 — Email & automation|||Quiz 6 — Email & automation', [
  { id: 'q1', question: 'Vì sao email được coi là kênh "owned" (sở hữu)?', options: ['Vì miễn phí gửi vô hạn', 'Vì không có thuật toán chen giữa thương hiệu và khách như mạng xã hội', 'Vì luôn có tỉ lệ mở 100%', 'Vì Google trả tiền cho mỗi mail'], correctIndex: 1, explanation: 'Danh sách email thuộc về thương hiệu; không bị nền tảng bóp reach như organic social.' },
  { id: 'q2', question: '"Lead magnet" là gì?', options: ['Một loại quảng cáo trả phí', 'Thứ giá trị miễn phí (ebook, mã giảm) đổi lấy email để xây danh sách', 'Chỉ số đo tỉ lệ mở', 'Nam châm gắn máy chủ'], correctIndex: 1, explanation: 'Lead magnet đổi giá trị lấy thông tin liên hệ (email) có opt-in để nuôi danh sách.' },
  { id: 'q3', question: 'Luồng "abandoned cart" (bỏ giỏ hàng) được kích hoạt bởi?', options: ['Lịch cố định hàng tháng', 'Hành vi: khách thêm giỏ rồi rời đi mà chưa mua', 'Số follower tăng', 'Click vào quảng cáo TV'], correctIndex: 1, explanation: 'Đây là automation theo hành vi (behaviour-triggered), gửi khi khách bỏ giỏ chưa thanh toán.' },
]);

const c7 = doc('imc301-7-1-video-mobile-emerging', '7.1 — Video, mobile & emerging|||7.1 — Video, mobile & công nghệ mới',
  'Video ngắn (TikTok/Reels/Shorts) & YouTube, tư duy mobile-first, thực tế tăng cường (AR) filter, livestream commerce, tối ưu theo thiết bị.',
  [[
    `<span class="eyebrow">IMC301 · Chapter 7 · Lesson 7.1</span>
<h2>Video, mobile &amp; emerging channels</h2>
<h3>Video &amp; short-form</h3>
<ul>
<li><strong>YouTube</strong> — long-form &amp; the world's 2nd search engine; great for how-to, reviews, and pre-roll ads.</li>
<li><strong>Short-form (TikTok, Reels, Shorts)</strong> — hook in the first 3 seconds, native/authentic feel, trend-driven discovery. The dominant format for reach among young audiences.</li>
</ul>
<h3>Mobile-first</h3>
<p>Most digital traffic is on phones, so design <strong>mobile-first</strong>: vertical video (9:16), thumb-friendly buttons, fast-loading pages, short copy. A campaign that only looks right on desktop is already broken.</p>
<h3>Emerging: AR &amp; livestream commerce</h3>
<pre><code>AR filters  - "try-on" lipstick/glasses in-camera -> interactive Reach
Livestream  - host + live chat + "add to cart" in real time
              (TikTok Shop / Shopee Live) -> Reach + Convert in ONE session
</code></pre>
<p><strong>Livestream commerce</strong> collapses entertainment and checkout into one moment and is huge across Southeast Asia. <strong>AR</strong> try-on filters turn an ad into a hands-on experience.</p>
<div class="callout"><span class="badge">Digital campaign</span> A cosmetics brand ships an AR lip try-on filter, drives it with TikTok creators, then converts the hype in a Shopee livestream with limited-time bundles.</div>`,
    `<span class="eyebrow">IMC301 · Chương 7 · Bài 7.1</span>
<h2>Video, mobile &amp; kênh mới nổi</h2>
<h3>Video &amp; nội dung ngắn</h3>
<ul>
<li><strong>YouTube</strong> — nội dung dài &amp; là công cụ tìm kiếm lớn thứ 2 thế giới; hợp cho hướng dẫn, review, quảng cáo pre-roll.</li>
<li><strong>Short-form (TikTok, Reels, Shorts)</strong> — móc người xem trong 3 giây đầu, cảm giác tự nhiên/chân thật, khám phá theo trend. Định dạng chủ đạo cho reach với công chúng trẻ.</li>
</ul>
<h3>Tư duy mobile-first</h3>
<p>Phần lớn lưu lượng số nằm trên điện thoại, nên thiết kế <strong>mobile-first</strong>: video dọc (9:16), nút vừa ngón tay, trang tải nhanh, copy ngắn. Một chiến dịch chỉ đẹp trên desktop coi như đã hỏng.</p>
<h3>Công nghệ mới: AR &amp; livestream commerce</h3>
<pre><code>Filter AR   - "thử" son/kính ngay trong camera -> Reach tương tác
Livestream  - host + chat trực tiếp + "thêm giỏ" tức thì
              (TikTok Shop / Shopee Live) -> Reach + Convert trong MỘT phiên
</code></pre>
<p><strong>Livestream commerce</strong> gộp giải trí và thanh toán vào một khoảnh khắc, rất lớn ở Đông Nam Á. Filter <strong>AR</strong> thử đồ biến quảng cáo thành trải nghiệm chạm tay.</p>
<div class="callout"><span class="badge">Chiến dịch số</span> Một hãng mỹ phẩm tung filter AR thử son, đẩy bằng creator TikTok, rồi chuyển đổi cơn sốt trong phiên livestream Shopee với combo giới hạn giờ.</div>`,
  ]]);

const c7q = quiz('imc301-quiz-7', 'Quiz 7 — Video & mobile|||Quiz 7 — Video & mobile', [
  { id: 'q1', question: 'Nguyên tắc "mobile-first" nghĩa là?', options: ['Chỉ chạy quảng cáo trên app di động', 'Thiết kế ưu tiên cho điện thoại: video dọc 9:16, tải nhanh, nút vừa ngón tay', 'Bỏ hẳn desktop', 'Chỉ dùng SMS'], correctIndex: 1, explanation: 'Vì phần lớn lưu lượng ở điện thoại, thiết kế trải nghiệm cho mobile trước rồi mở rộng ra desktop.' },
  { id: 'q2', question: 'Livestream commerce đặc biệt ở chỗ?', options: ['Chỉ để giải trí, không bán được', 'Gộp giải trí và mua hàng ("thêm giỏ" tức thì) trong một phiên trực tiếp', 'Là một dạng email', 'Không đo lường được'], correctIndex: 1, explanation: 'Livestream commerce (TikTok Shop, Shopee Live) kết hợp Reach và Convert ngay trong một phiên.' },
  { id: 'q3', question: 'Với video short-form (TikTok/Reels), điều gì quan trọng nhất ở mở đầu?', options: ['Logo lớn 10 giây đầu', 'Móc (hook) người xem trong ~3 giây đầu', 'Nhạc bản quyền đắt tiền', 'Độ dài trên 10 phút'], correctIndex: 1, explanation: 'Short-form cần hook mạnh trong vài giây đầu, nếu không người xem lướt qua ngay.' },
]);

const c8 = doc('imc301-8-1-integrated-measurement', '8.1 — Integrated digital measurement|||8.1 — Đo lường số tích hợp',
  'GA4 & sự kiện, mô hình phân bổ (attribution: last-click/first-click/data-driven), ROAS & CPA, dashboard, vòng test–đo–tối ưu chiến dịch.',
  [[
    `<span class="eyebrow">IMC301 · Chapter 8 · Lesson 8.1</span>
<h2>Integrated digital measurement</h2>
<h3>GA4 &amp; the metrics that matter</h3>
<p><strong>Google Analytics 4 (GA4)</strong> is event-based: every click, view and purchase is an <em>event</em>, so you track the whole journey, not just pageviews. Core numbers:</p>
<pre><code>CTR   = clicks / impressions        (creative &amp; targeting quality)
CPA   = spend / acquisitions        (cost efficiency)
ROAS  = revenue / ad spend          (profitability of paid)
CVR   = conversions / sessions      (funnel &amp; landing quality)
CLV   = lifetime value per customer (worth of retention)
</code></pre>
<h3>Attribution — who gets the credit?</h3>
<ul>
<li><strong>Last-click</strong> — all credit to the final touch (simple, but undervalues Reach).</li>
<li><strong>First-click</strong> — all credit to the first touch (over-values awareness).</li>
<li><strong>Data-driven / multi-touch</strong> — splits credit across the journey; the fairest for an INTEGRATED plan where channels assist each other.</li>
</ul>
<h3>Dashboard &amp; the optimization loop</h3>
<p>Pull every channel into ONE dashboard (Looker Studio) so social, search, email and influencer sit side by side — that is IMC made measurable. Then run the loop: <strong>test → measure → optimize</strong> (A/B creatives, shift budget to the best ROAS, kill losers), continuously.</p>
<div class="callout"><span class="badge">Why integrated</span> Judged by last-click alone, awareness channels look worthless and get cut — starving the funnel. Multi-touch attribution + a shared dashboard is what keeps an integrated plan honest.</div>`,
    `<span class="eyebrow">IMC301 · Chương 8 · Bài 8.1</span>
<h2>Đo lường số tích hợp</h2>
<h3>GA4 &amp; các chỉ số quan trọng</h3>
<p><strong>Google Analytics 4 (GA4)</strong> dựa trên sự kiện: mỗi click, lượt xem, đơn mua là một <em>event</em>, nên bạn theo dõi cả hành trình chứ không chỉ pageview. Con số cốt lõi:</p>
<pre><code>CTR   = click / hiển thị             (chất lượng nội dung &amp; nhắm mục tiêu)
CPA   = chi phí / số chuyển đổi        (hiệu quả chi phí)
ROAS  = doanh thu / chi quảng cáo      (lợi nhuận của paid)
CVR   = chuyển đổi / phiên             (chất lượng phễu &amp; landing)
CLV   = giá trị vòng đời mỗi khách     (giá trị của giữ chân)
</code></pre>
<h3>Attribution — công thuộc về ai?</h3>
<ul>
<li><strong>Last-click</strong> — dồn công cho điểm chạm cuối (đơn giản, nhưng xem nhẹ Reach).</li>
<li><strong>First-click</strong> — dồn công cho điểm chạm đầu (thổi phồng nhận biết).</li>
<li><strong>Data-driven / đa điểm chạm</strong> — chia công dọc hành trình; công bằng nhất cho kế hoạch TÍCH HỢP nơi các kênh hỗ trợ nhau.</li>
</ul>
<h3>Dashboard &amp; vòng tối ưu</h3>
<p>Kéo mọi kênh về MỘT dashboard (Looker Studio) để social, search, email và influencer nằm cạnh nhau — đó chính là IMC được đo lường. Rồi chạy vòng lặp: <strong>test → đo → tối ưu</strong> (A/B nội dung, dồn ngân sách vào ROAS tốt nhất, cắt cái kém), liên tục.</p>
<div class="callout"><span class="badge">Vì sao tích hợp</span> Nếu chỉ chấm bằng last-click, các kênh nhận biết trông vô dụng và bị cắt — bỏ đói cả phễu. Attribution đa điểm chạm + một dashboard chung là thứ giữ kế hoạch tích hợp trung thực.</div>`,
  ]]);

const c8q = quiz('imc301-quiz-8', 'Quiz 8 — Measurement|||Quiz 8 — Đo lường', [
  { id: 'q1', question: 'ROAS được tính bằng?', options: ['Chi phí quảng cáo / doanh thu', 'Doanh thu / chi phí quảng cáo', 'Click / hiển thị', 'Số chuyển đổi / phiên'], correctIndex: 1, explanation: 'ROAS = Return On Ad Spend = doanh thu chia chi phí quảng cáo; càng cao càng lời.' },
  { id: 'q2', question: 'Vì sao mô hình last-click gây hại cho kế hoạch IMC tích hợp?', options: ['Vì nó quá tốn kém', 'Vì dồn hết công cho điểm chạm cuối, xem nhẹ các kênh nhận biết đầu phễu', 'Vì không dùng được với GA4', 'Vì chỉ đo được email'], correctIndex: 1, explanation: 'Last-click bỏ qua vai trò hỗ trợ của kênh awareness; multi-touch/data-driven công bằng hơn.' },
  { id: 'q3', question: 'GA4 khác Universal Analytics cũ chủ yếu ở chỗ?', options: ['Chỉ đếm pageview', 'Dựa trên SỰ KIỆN (event) để theo dõi cả hành trình', 'Không đo được chuyển đổi', 'Chỉ chạy trên mobile'], correctIndex: 1, explanation: 'GA4 là mô hình event-based: mỗi tương tác là một event, theo dõi được toàn hành trình.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'IMC301',
    slug: 'imc301-integrated-marketing-communication-in-digital-world',
    title: 'Integrated Marketing Communication in Digital World',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IMC301.webp',
    shortDescription: 'Advanced IMC in digital — building on IMC201. RACE planning, SEO & content, paid search/display, social, influencer/KOC, email automation, video/mobile & integrated GA4 measurement. Bilingual, real tools & campaigns.|||IMC nâng cao trong môi trường số — tiếp nối IMC201. Hoạch định RACE, SEO & content, quảng cáo tìm kiếm/display, social, influencer/KOC, email automation, video/mobile & đo lường GA4 tích hợp. Song ngữ, công cụ & chiến dịch thật.',
    description: 'Môn <strong>IMC301 — Integrated Marketing Communication in Digital World</strong> là môn <strong>nâng cao tiếp nối IMC201</strong>, đưa nguyên lý "nói bằng một giọng" của IMC vào <strong>kênh số</strong> và đào sâu từng kênh. Lộ trình 8 chương: <strong>chiến lược IMC số &amp; RACE</strong> → <strong>SEO &amp; content</strong> → <strong>quảng cáo số trả phí</strong> (Google Ads, display, programmatic, retargeting) → <strong>social media</strong> → <strong>influencer/KOL/KOC</strong> → <strong>email &amp; automation</strong> → <strong>video, mobile &amp; công nghệ mới</strong> → <strong>đo lường số tích hợp</strong> (GA4, attribution, ROAS, dashboard). Bám sách chuẩn quốc tế (Chaffey &amp; Ellis-Chadwick, Kingsnorth, Belch &amp; Belch), song ngữ, công cụ/nền tảng thật &amp; ví dụ chiến dịch, quiz mỗi chương.',
    whatYouLearn: 'Khung RACE (Reach–Act–Convert–Engage) & mục tiêu SMART; SEO (on-page/technical/off-page), ý định tìm kiếm, content pillar–cluster & inbound; quảng cáo trả phí (SEM/Google Ads, Ad Rank, CPM/CPC/CPA, display, programmatic, retargeting); organic vs paid social, community & UGC; influencer/KOL/KOC (phân tầng, chọn & đo, phát hiện follower ảo); email & automation (list building, segmentation, drip, luồng theo hành vi); video short-form, mobile-first, AR & livestream commerce; đo lường tích hợp (GA4, attribution, ROAS, dashboard, vòng test–đo–tối ưu).',
    requirements: 'Đã học hoặc nắm nền IMC (IMC201: hỗn hợp xúc tiến, thông điệp, công chúng, media mix). Có tài khoản Google (để dùng thử Google Ads/GA4) và tài khoản mạng xã hội là lợi thế cho phần thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chuẩn (Chaffey, Kingsnorth, Belch), khoá miễn phí (Google/Meta/HubSpot), công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao IMC lên số; IMC201 là nền, IMC301 đào sâu digital.', lessons: [intro] },
    { title: 'Chương 1 — Chiến lược IMC số & RACE|||Chapter 1 — Strategy & RACE', description: 'RACE, phễu số, mục tiêu SMART & KPI.', lessons: [c1, c1q] },
    { title: 'Chương 2 — SEO & content|||Chapter 2 — SEO & content', description: 'Organic search, keyword, pillar–cluster, inbound.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quảng cáo số trả phí|||Chapter 3 — Paid ads', description: 'Google Ads, display, programmatic, PPC, retargeting.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mạng xã hội|||Chapter 4 — Social media', description: 'Nền tảng, organic vs paid, community, UGC.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Influencer & KOL/KOC|||Chapter 5 — Influencer & KOC', description: 'Phân tầng, chọn, đo lường, hợp tác.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Email & automation|||Chapter 6 — Email & automation', description: 'List building, segmentation, drip, automation.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Video, mobile & mới nổi|||Chapter 7 — Video, mobile & emerging', description: 'Short-form, mobile-first, AR, livestream commerce.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường số tích hợp|||Chapter 8 — Integrated measurement', description: 'GA4, attribution, ROAS, dashboard, tối ưu.', lessons: [c8, c8q] },
  ],
};
