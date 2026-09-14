/**
 * DMA302m — Digital Marketing Analytics. Giáo trình FLM (syl): phân tích số
 * liệu marketing số — KPI, GA4 (sự kiện/phễu/phân khúc), đo hiệu quả quảng
 * cáo (Google/Meta Ads, ROAS/CPA), SEO & content, social, email/automation,
 * attribution, dashboard Looker Studio. Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dma302m-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (Hemann/Burbary, Kaushik), tài liệu GA4 chính thức, Google Skillshop/Digital Garage, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">DMA302m · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Digital Marketing Analytics — KPIs, Google Analytics 4, ad performance, SEO, social, email and attribution — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DMA302m are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Digital Marketing Analytics: Making Sense of Consumer Data in a Digital World</em> — Chuck Hemann &amp; Ken Burbary (Que Publishing)</li>
<li><em>Web Analytics 2.0: The Art of Online Accountability and Science of Customer Centricity</em> — Avinash Kaushik</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://support.google.com/analytics/answer/10089681" target="_blank" rel="noopener">Google Analytics 4 — official help center</a></li>
<li><a href="https://developers.google.com/analytics/devguides/collection/ga4" target="_blank" rel="noopener">GA4 developer guide — events &amp; measurement</a></li>
<li><a href="https://skillshop.exceedlms.com/student/catalog" target="_blank" rel="noopener">Google Skillshop — Analytics &amp; Ads Academy (free certifications)</a></li>
<li><a href="https://learndigital.withgoogle.com/digitalgarage" target="_blank" rel="noopener">Google Digital Garage — Fundamentals of Digital Marketing</a></li>
<li><a href="https://www.kaushik.net/avinash/" target="_blank" rel="noopener">Occam's Razor — Avinash Kaushik's blog</a></li>
<li><a href="https://support.google.com/analytics/answer/6367342" target="_blank" rel="noopener">GA4 Demo Account — practice on real data</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@GoogleAnalytics" target="_blank" rel="noopener">Google Analytics (official channel)</a></li>
<li><a href="https://www.youtube.com/@MeasureSchool" target="_blank" rel="noopener">Measureschool</a> — GA4, GTM and tracking tutorials</li>
<li><a href="https://www.youtube.com/@AnalyticsMania" target="_blank" rel="noopener">Analytics Mania</a> — GA4 &amp; Google Tag Manager deep dives</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — web/app analytics (free)</li>
<li><a href="https://tagmanager.google.com/" target="_blank" rel="noopener">Google Tag Manager</a> — event &amp; tag deployment (free)</li>
<li><a href="https://lookerstudio.google.com/" target="_blank" rel="noopener">Looker Studio</a> — free dashboards &amp; reports on top of GA4/Sheets/Ads</li>
<li><a href="https://search.google.com/search-console" target="_blank" rel="noopener">Google Search Console</a> — organic search performance (free)</li>
<li><a href="https://ads.google.com/" target="_blank" rel="noopener">Google Ads</a> &amp; <a href="https://www.facebook.com/business/tools/meta-ads-manager" target="_blank" rel="noopener">Meta Ads Manager</a> — paid campaign metrics</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — marketing KPIs &amp; a measurement plan, GA4 events/funnels/segments, ROAS &amp; CPA maths.</li>
<li><strong>Practice</strong> — explore the GA4 Demo Account, build one Looker Studio report from real numbers.</li>
<li><strong>Go deeper</strong> — SEO/content, social &amp; email metrics, attribution models beyond last-click.</li>
<li><strong>Job-ready</strong> — earn the free Google Analytics &amp; Google Ads certifications on Skillshop; keep a portfolio dashboard.</li>
</ol></div>`,
    `<span class="eyebrow">DMA302m · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Phân tích Marketing số — KPI, Google Analytics 4, hiệu quả quảng cáo, SEO, social, email và attribution — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DMA302m có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Digital Marketing Analytics: Making Sense of Consumer Data in a Digital World</em> — Chuck Hemann &amp; Ken Burbary (Que Publishing)</li>
<li><em>Web Analytics 2.0: The Art of Online Accountability and Science of Customer Centricity</em> — Avinash Kaushik</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://support.google.com/analytics/answer/10089681" target="_blank" rel="noopener">Google Analytics 4 — trung tâm hỗ trợ chính thức</a></li>
<li><a href="https://developers.google.com/analytics/devguides/collection/ga4" target="_blank" rel="noopener">GA4 developer guide — sự kiện &amp; đo lường</a></li>
<li><a href="https://skillshop.exceedlms.com/student/catalog" target="_blank" rel="noopener">Google Skillshop — chứng chỉ Analytics &amp; Ads (miễn phí)</a></li>
<li><a href="https://learndigital.withgoogle.com/digitalgarage" target="_blank" rel="noopener">Google Digital Garage — Nền tảng Marketing số</a></li>
<li><a href="https://www.kaushik.net/avinash/" target="_blank" rel="noopener">Occam's Razor — blog của Avinash Kaushik</a></li>
<li><a href="https://support.google.com/analytics/answer/6367342" target="_blank" rel="noopener">GA4 Demo Account — luyện trên dữ liệu thật</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GoogleAnalytics" target="_blank" rel="noopener">Google Analytics (kênh chính thức)</a></li>
<li><a href="https://www.youtube.com/@MeasureSchool" target="_blank" rel="noopener">Measureschool</a> — hướng dẫn GA4, GTM và tracking</li>
<li><a href="https://www.youtube.com/@AnalyticsMania" target="_blank" rel="noopener">Analytics Mania</a> — đào sâu GA4 &amp; Google Tag Manager</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — đo web/app (miễn phí)</li>
<li><a href="https://tagmanager.google.com/" target="_blank" rel="noopener">Google Tag Manager</a> — triển khai sự kiện &amp; tag (miễn phí)</li>
<li><a href="https://lookerstudio.google.com/" target="_blank" rel="noopener">Looker Studio</a> — dashboard/báo cáo miễn phí trên GA4/Sheets/Ads</li>
<li><a href="https://search.google.com/search-console" target="_blank" rel="noopener">Google Search Console</a> — hiệu quả tìm kiếm tự nhiên (miễn phí)</li>
<li><a href="https://ads.google.com/" target="_blank" rel="noopener">Google Ads</a> &amp; <a href="https://www.facebook.com/business/tools/meta-ads-manager" target="_blank" rel="noopener">Meta Ads Manager</a> — chỉ số chiến dịch trả phí</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — KPI marketing &amp; kế hoạch đo lường, sự kiện/phễu/phân khúc GA4, toán ROAS &amp; CPA.</li>
<li><strong>Luyện tập</strong> — khám phá GA4 Demo Account, dựng một báo cáo Looker Studio từ số liệu thật.</li>
<li><strong>Đào sâu thực tế</strong> — chỉ số SEO/content, social &amp; email, mô hình attribution ngoài last-click.</li>
<li><strong>Sẵn sàng đi làm</strong> — lấy chứng chỉ Google Analytics &amp; Google Ads miễn phí trên Skillshop; giữ một dashboard portfolio.</li>
</ol></div>`,
  ]]);

const intro = doc('dma302m-0-1-overview', 'Course overview: Digital Marketing Analytics|||Tổng quan: Phân tích Marketing số',
  'Vai trò của phân tích số liệu trong marketing hiện đại; lộ trình 8 chương từ KPI → GA4 → quảng cáo → SEO → social → email → attribution → dashboard.',
  [[
    `<span class="eyebrow">DMA302m · Lesson 0.1 · Overview</span>
<h2>Digital Marketing Analytics</h2>
<p class="lead">This course turns marketing from guesswork into a <strong>measurable, data-driven discipline</strong>. You'll learn to define the right <strong>KPIs</strong>, instrument a website/app with <strong>Google Analytics 4</strong>, judge whether ad spend is actually working (<strong>ROAS</strong>, <strong>CPA</strong>), read SEO/content/social/email performance, understand who deserves credit for a conversion (<strong>attribution</strong>), and package it all into a <strong>dashboard</strong> that drives real decisions.</p>
<h3>Why analytics, not opinions</h3>
<ul>
<li><strong>Every click is loggable</strong> — unlike TV or print, digital channels report exactly who did what, when.</li>
<li><strong>Budgets follow evidence</strong> — analytics tells you which channel/campaign/page to spend more (or less) on.</li>
<li><strong>Metrics without a plan mislead</strong> — page views feel good but rarely pay the bills; the course insists on tying every metric to a business goal.</li>
</ul>
<h3>Roadmap</h3>
<p>KPIs &amp; measurement plan → Web analytics with GA4 (events, funnels, segments) → Ad campaign measurement (Google/Meta Ads, ROAS/CPA) → SEO &amp; content analytics → Social media analytics → Email &amp; marketing automation metrics → Attribution models &amp; customer journey → Dashboards (Looker Studio) &amp; data-driven decisions.</p>
<div class="callout"><span class="badge">Reference</span> Grounded in <em>Digital Marketing Analytics</em> (Hemann &amp; Burbary), <em>Web Analytics 2.0</em> (Kaushik), official Google Analytics 4 documentation, and Google Digital Garage.</div>`,
    `<span class="eyebrow">DMA302m · Bài 0.1 · Tổng quan</span>
<h2>Phân tích Marketing số</h2>
<p class="lead">Môn này biến marketing từ việc "đoán" thành một môn học <strong>đo lường được, dựa trên dữ liệu</strong>. Bạn sẽ học cách chọn đúng <strong>KPI</strong>, gắn đo lường cho website/app bằng <strong>Google Analytics 4</strong>, đánh giá tiền quảng cáo có thực sự hiệu quả (<strong>ROAS</strong>, <strong>CPA</strong>), đọc hiệu quả SEO/content/social/email, hiểu ai xứng đáng được "ghi công" cho một chuyển đổi (<strong>attribution</strong>), và đóng gói tất cả vào một <strong>dashboard</strong> giúp ra quyết định thật.</p>
<h3>Vì sao cần phân tích, không phải cảm tính</h3>
<ul>
<li><strong>Mọi cú click đều ghi lại được</strong> — khác TV hay báo in, kênh số báo cáo chính xác ai đã làm gì, lúc nào.</li>
<li><strong>Ngân sách đi theo bằng chứng</strong> — phân tích cho biết nên tăng/giảm tiền cho kênh/chiến dịch/trang nào.</li>
<li><strong>Chỉ số không có kế hoạch dễ gây hiểu lầm</strong> — lượt xem trang "trông đẹp" nhưng ít khi ra tiền; môn học buộc mọi chỉ số phải gắn với một mục tiêu kinh doanh.</li>
</ul>
<h3>Lộ trình</h3>
<p>KPI &amp; kế hoạch đo lường → Web analytics với GA4 (sự kiện, phễu, phân khúc) → Đo lường chiến dịch quảng cáo (Google/Meta Ads, ROAS/CPA) → Phân tích SEO &amp; content → Social media analytics → Chỉ số email &amp; marketing automation → Mô hình attribution &amp; hành trình khách hàng → Dashboard (Looker Studio) &amp; ra quyết định dựa trên dữ liệu.</p>
<div class="callout"><span class="badge">Nguồn</span> Bám theo <em>Digital Marketing Analytics</em> (Hemann &amp; Burbary), <em>Web Analytics 2.0</em> (Kaushik), tài liệu chính thức Google Analytics 4, và Google Digital Garage.</div>`,
  ]]);

const c1 = doc('dma302m-1-1-kpi-measurement-plan', '1.1 — Marketing KPIs & the measurement plan|||1.1 — KPI marketing & kế hoạch đo lường',
  'Phân biệt metric vs KPI; khung SMART; kế hoạch đo lường (Goals→KPIs→Segments→Tools); các nhóm KPI theo mục tiêu (nhận diện, tương tác, chuyển đổi, giữ chân).',
  [[
    `<span class="eyebrow">DMA302m · Chapter 1 · Lesson 1.1</span>
<h2>Marketing KPIs &amp; the measurement plan</h2>
<h3>Metric vs KPI</h3>
<p>A <strong>metric</strong> is any number you can measure (page views, likes, sessions). A <strong>KPI (Key Performance Indicator)</strong> is a metric explicitly tied to a business goal, with a target and an owner. Not every metric deserves to be a KPI — Avinash Kaushik calls untethered metrics "data puking."</p>
<h3>SMART KPIs</h3>
<ul>
<li><strong>Specific</strong> — "increase checkout conversion rate," not "get more sales."</li>
<li><strong>Measurable</strong> — a number you can pull from a tool (GA4, Ads, CRM).</li>
<li><strong>Achievable</strong> &amp; <strong>Relevant</strong> — realistic, and tied to a real business objective.</li>
<li><strong>Time-bound</strong> — "this quarter," not "eventually."</li>
</ul>
<h3>Building a measurement plan</h3>
<pre><code>Business Goal  -&gt; e.g. Grow online revenue
  Objective    -&gt; Increase checkout conversion rate
    KPI        -&gt; Conversion rate (target: 3.0% -&gt; 3.5% in Q3)
      Segments -&gt; New vs returning, mobile vs desktop, by campaign
        Tool   -&gt; GA4 (ecommerce_purchase event), weekly review
</code></pre>
<h3>KPI groups by funnel stage</h3>
<ul>
<li><strong>Awareness</strong> — impressions, reach, brand search volume.</li>
<li><strong>Engagement</strong> — sessions, engagement rate, avg. engagement time, scroll depth.</li>
<li><strong>Conversion</strong> — conversion rate, cost per acquisition (CPA), revenue, ROAS.</li>
<li><strong>Retention</strong> — repeat purchase rate, churn, customer lifetime value (LTV).</li>
</ul>
<div class="callout"><span class="badge">Vanity vs actionable</span> A vanity metric (total page views) looks impressive but rarely changes a decision. An actionable KPI (checkout conversion rate by traffic source) tells you exactly where to act.</div>`,
    `<span class="eyebrow">DMA302m · Chương 1 · Bài 1.1</span>
<h2>KPI marketing &amp; kế hoạch đo lường</h2>
<h3>Metric vs KPI</h3>
<p>Một <strong>metric (chỉ số)</strong> là bất kỳ số nào đo được (lượt xem trang, lượt thích, session). Một <strong>KPI (chỉ số hiệu suất then chốt)</strong> là chỉ số gắn rõ với một mục tiêu kinh doanh, có mục tiêu cụ thể và người chịu trách nhiệm. Không phải chỉ số nào cũng đáng là KPI — Avinash Kaushik gọi chỉ số không gắn mục tiêu là "ói dữ liệu."</p>
<h3>KPI kiểu SMART</h3>
<ul>
<li><strong>Cụ thể (Specific)</strong> — "tăng tỉ lệ chuyển đổi ở bước thanh toán," không phải "bán được nhiều hơn."</li>
<li><strong>Đo được (Measurable)</strong> — một con số lấy được từ công cụ (GA4, Ads, CRM).</li>
<li><strong>Khả thi</strong> &amp; <strong>Liên quan</strong> — thực tế, và gắn với mục tiêu kinh doanh thật.</li>
<li><strong>Có thời hạn (Time-bound)</strong> — "trong quý này," không phải "một ngày nào đó."</li>
</ul>
<h3>Dựng kế hoạch đo lường</h3>
<pre><code>Mục tiêu KD   -&gt; vd Tăng doanh thu online
  Mục tiêu    -&gt; Tăng tỉ lệ chuyển đổi ở thanh toán
    KPI       -&gt; Tỉ lệ chuyển đổi (mục tiêu: 3.0% -&gt; 3.5% trong Q3)
      Segment -&gt; Khách mới vs quay lại, mobile vs desktop, theo campaign
        Công cụ -&gt; GA4 (sự kiện ecommerce_purchase), xem lại hàng tuần
</code></pre>
<h3>Nhóm KPI theo giai đoạn phễu</h3>
<ul>
<li><strong>Nhận diện (Awareness)</strong> — impressions, reach, lượng tìm kiếm thương hiệu.</li>
<li><strong>Tương tác (Engagement)</strong> — session, tỉ lệ tương tác, thời gian tương tác trung bình, độ cuộn trang.</li>
<li><strong>Chuyển đổi (Conversion)</strong> — tỉ lệ chuyển đổi, chi phí trên mỗi khách (CPA), doanh thu, ROAS.</li>
<li><strong>Giữ chân (Retention)</strong> — tỉ lệ mua lại, tỉ lệ rời bỏ (churn), giá trị khách hàng trọn đời (LTV).</li>
</ul>
<div class="callout"><span class="badge">Vanity vs hành động được</span> Chỉ số "làm đẹp" (tổng lượt xem trang) trông ấn tượng nhưng ít khi đổi được quyết định gì. Một KPI hành động được (tỉ lệ chuyển đổi thanh toán theo nguồn traffic) chỉ đúng nơi cần hành động.</div>`,
  ]]);

const c1q = quiz('dma302m-quiz-1', 'Quiz 1 — KPI & measurement plan|||Quiz 1 — KPI & kế hoạch đo lường', [
  { id: 'q1', question: 'Điểm khác biệt chính giữa "metric" và "KPI" là gì?', options: ['KPI luôn lớn hơn metric', 'KPI là metric gắn với mục tiêu kinh doanh, có target', 'Metric chỉ đo được bằng GA4', 'Không có khác biệt'], correctIndex: 1, explanation: 'KPI là metric được chọn có chủ đích, gắn mục tiêu và có mục tiêu cụ thể — không phải mọi metric đều là KPI.' },
  { id: 'q2', question: 'Chữ "T" trong khung KPI kiểu SMART nghĩa là gì?', options: ['Total (tổng)', 'Time-bound (có thời hạn)', 'Trend (xu hướng)', 'Tool (công cụ)'], correctIndex: 1, explanation: 'SMART: Specific, Measurable, Achievable, Relevant, Time-bound — KPI phải có mốc thời gian rõ.' },
  { id: 'q3', question: 'Tổng lượt xem trang mà không gắn với mục tiêu kinh doanh nào thường được gọi là?', options: ['KPI chiến lược', 'Chỉ số vanity (làm đẹp)', 'ROAS', 'Chỉ số attribution'], correctIndex: 1, explanation: 'Chỉ số "trông đẹp" nhưng không dẫn tới hành động cụ thể là vanity metric — cần tránh làm KPI chính.' },
]);

const c2 = doc('dma302m-2-1-ga4-events-funnels-segments', '2.1 — Web analytics with GA4: events, funnels & segments|||2.1 — Web analytics với GA4: sự kiện, phễu & phân khúc',
  'Mô hình dữ liệu GA4 (event-based); sự kiện tự động/nâng cao/tuỳ chỉnh; chuyển đổi (conversions); phân tích phễu (Funnel exploration); phân khúc (segments) & đối tượng (audiences).',
  [[
    `<span class="eyebrow">DMA302m · Chapter 2 · Lesson 2.1</span>
<h2>Web analytics with GA4: events, funnels &amp; segments</h2>
<h3>Everything is an event</h3>
<p><strong>Google Analytics 4</strong> replaced the old session/pageview model with a single, flexible concept: <strong>events</strong>. A page view, a click, a purchase, a scroll — all are events with a name and optional <strong>parameters</strong> (key-value pairs).</p>
<pre><code>Event: purchase
  params: { transaction_id: "T123", value: 49.90, currency: "VND" }

Event: page_view
  params: { page_location: "/pricing", page_title: "Pricing" }
</code></pre>
<h3>Event types</h3>
<ul>
<li><strong>Automatically collected</strong> — page_view, first_visit, session_start.</li>
<li><strong>Enhanced measurement</strong> — scroll, outbound click, site search, video engagement — toggled on, no code needed.</li>
<li><strong>Recommended / custom</strong> — sign_up, purchase, or anything specific to your business, sent via <strong>gtag.js</strong> or <strong>Google Tag Manager</strong>.</li>
</ul>
<h3>Conversions &amp; funnel exploration</h3>
<p>Any event can be marked a <strong>key event (conversion)</strong> — e.g. <code>generate_lead</code> or <code>purchase</code>. GA4's <strong>Funnel exploration</strong> report shows the drop-off between ordered steps (e.g. view_item → add_to_cart → begin_checkout → purchase), so you can see exactly where users abandon.</p>
<pre><code>Funnel: view_item (1,000) -&gt; add_to_cart (400, 40%)
        -&gt; begin_checkout (220, 55%) -&gt; purchase (150, 68%)
Biggest drop: view_item -&gt; add_to_cart (only 40% add to cart)
</code></pre>
<h3>Segments &amp; audiences</h3>
<p>A <strong>segment</strong> filters existing data for analysis (e.g. "mobile users from Facebook ads last 30 days"). An <strong>audience</strong> is a saved group of users you can re-target in Google Ads or send to other tools. Comparing segments (new vs returning, by device, by campaign) is how you find where to focus.</p>
<div class="callout"><span class="badge">GA4 vs Universal Analytics</span> Universal Analytics counted sessions and pageviews; GA4 counts <strong>events</strong> and models user behavior across web + app. UA was sunset in 2023/2024 — GA4 is the current standard.</div>`,
    `<span class="eyebrow">DMA302m · Chương 2 · Bài 2.1</span>
<h2>Web analytics với GA4: sự kiện, phễu &amp; phân khúc</h2>
<h3>Mọi thứ đều là "sự kiện"</h3>
<p><strong>Google Analytics 4</strong> thay mô hình session/pageview cũ bằng một khái niệm linh hoạt duy nhất: <strong>sự kiện (event)</strong>. Xem một trang, một cú click, một lượt mua, một lần cuộn trang — tất cả đều là sự kiện có tên và các <strong>tham số (parameters)</strong> tuỳ chọn (cặp khoá-giá trị).</p>
<pre><code>Sự kiện: purchase
  params: { transaction_id: "T123", value: 49.90, currency: "VND" }

Sự kiện: page_view
  params: { page_location: "/pricing", page_title: "Pricing" }
</code></pre>
<h3>Các loại sự kiện</h3>
<ul>
<li><strong>Tự động thu thập</strong> — page_view, first_visit, session_start.</li>
<li><strong>Đo lường nâng cao (enhanced measurement)</strong> — cuộn trang, click ra ngoài, tìm kiếm trên site, tương tác video — chỉ cần bật, không cần viết code.</li>
<li><strong>Được gợi ý / tuỳ chỉnh</strong> — sign_up, purchase, hay bất cứ gì đặc thù cho doanh nghiệp, gửi qua <strong>gtag.js</strong> hoặc <strong>Google Tag Manager</strong>.</li>
</ul>
<h3>Chuyển đổi (conversions) &amp; phân tích phễu</h3>
<p>Bất kỳ sự kiện nào cũng có thể đánh dấu là <strong>key event (chuyển đổi)</strong> — vd <code>generate_lead</code> hoặc <code>purchase</code>. Báo cáo <strong>Funnel exploration</strong> của GA4 cho thấy tỉ lệ rơi rớt giữa các bước theo thứ tự (vd view_item → add_to_cart → begin_checkout → purchase), giúp thấy chính xác chỗ người dùng bỏ đi.</p>
<pre><code>Phễu: view_item (1.000) -&gt; add_to_cart (400, 40%)
      -&gt; begin_checkout (220, 55%) -&gt; purchase (150, 68%)
Rơi mạnh nhất: view_item -&gt; add_to_cart (chỉ 40% cho vào giỏ)
</code></pre>
<h3>Phân khúc &amp; đối tượng</h3>
<p>Một <strong>segment (phân khúc)</strong> lọc dữ liệu có sẵn để phân tích (vd "người dùng mobile từ quảng cáo Facebook 30 ngày qua"). Một <strong>audience (đối tượng)</strong> là nhóm người dùng được lưu để nhắm lại (remarketing) trên Google Ads hoặc gửi sang công cụ khác. So sánh phân khúc (mới vs quay lại, theo thiết bị, theo campaign) là cách tìm ra nơi cần tập trung.</p>
<div class="callout"><span class="badge">GA4 vs Universal Analytics</span> Universal Analytics đếm session và pageview; GA4 đếm <strong>sự kiện</strong> và mô hình hành vi người dùng trên cả web + app. UA đã ngừng hoạt động 2023/2024 — GA4 là chuẩn hiện tại.</div>`,
  ]]);

const c2q = quiz('dma302m-quiz-2', 'Quiz 2 — GA4: events, funnels & segments|||Quiz 2 — GA4: sự kiện, phễu & phân khúc', [
  { id: 'q1', question: 'Mô hình dữ liệu nền tảng của GA4 dựa trên khái niệm nào?', options: ['Session & pageview', 'Sự kiện (event) có tham số', 'Cookie bên thứ ba', 'Chỉ số ROAS'], correctIndex: 1, explanation: 'GA4 mô hình hoá mọi hành vi (xem trang, click, mua) như các sự kiện có tham số, khác Universal Analytics cũ.' },
  { id: 'q2', question: 'Báo cáo GA4 dùng để thấy tỉ lệ rơi rớt giữa các bước như view_item → add_to_cart → purchase gọi là gì?', options: ['Segment overlap', 'Funnel exploration', 'Attribution report', 'Audience builder'], correctIndex: 1, explanation: 'Funnel exploration hiển thị số người qua từng bước theo thứ tự và tỉ lệ rơi rớt giữa các bước.' },
  { id: 'q3', question: '"Segment" trong GA4 dùng để làm gì?', options: ['Gửi email marketing', 'Lọc dữ liệu có sẵn để phân tích riêng một nhóm người dùng', 'Tính ROAS tự động', 'Thay thế Google Tag Manager'], correctIndex: 1, explanation: 'Segment lọc dữ liệu hiện có (vd mobile + nguồn Facebook Ads) để phân tích sâu hơn, khác với audience dùng để remarketing.' },
]);

const c3 = doc('dma302m-3-1-ad-campaign-measurement', '3.1 — Measuring ad campaigns: Google/Meta Ads, ROAS & CPA|||3.1 — Đo lường chiến dịch quảng cáo: Google/Meta Ads, ROAS & CPA',
  'Chỉ số nền tảng quảng cáo (impressions, CTR, CPC, CPM); ROAS & CPA công thức; UTM & tracking chiến dịch; so sánh Google Ads vs Meta Ads.',
  [[
    `<span class="eyebrow">DMA302m · Chapter 3 · Lesson 3.1</span>
<h2>Measuring ad campaigns: Google/Meta Ads, ROAS &amp; CPA</h2>
<h3>Core paid-media metrics</h3>
<ul>
<li><strong>Impressions</strong> — how many times an ad was shown.</li>
<li><strong>CTR (Click-Through Rate)</strong> = clicks / impressions.</li>
<li><strong>CPC (Cost Per Click)</strong> = spend / clicks.</li>
<li><strong>CPM (Cost Per Mille)</strong> = spend / impressions × 1,000.</li>
</ul>
<h3>The two questions that matter most: ROAS &amp; CPA</h3>
<pre><code>ROAS (Return On Ad Spend) = Revenue from ads / Ad spend
  Example: 20,000,000 VND revenue / 5,000,000 VND spend = 4.0 (400%)

CPA (Cost Per Acquisition) = Ad spend / Number of conversions
  Example: 5,000,000 VND spend / 50 orders = 100,000 VND per order
</code></pre>
<p>A campaign can have a great CTR and still lose money if <strong>ROAS &lt; 1</strong> or <strong>CPA</strong> exceeds what a customer is worth. Always compare CPA against customer lifetime value (LTV), not against "feels expensive."</p>
<h3>UTM parameters &amp; campaign tracking</h3>
<p><strong>UTM tags</strong> appended to a URL let GA4 attribute traffic to the right campaign, source and medium: <code>?utm_source=facebook&amp;utm_medium=cpc&amp;utm_campaign=summer_sale</code>. Without consistent UTMs, ad platform numbers and GA4 numbers won't match, and budget decisions get made on bad data.</p>
<h3>Google Ads vs Meta Ads</h3>
<ul>
<li><strong>Google Ads (Search/Shopping/Display/YouTube)</strong> — mostly intent-based (someone is searching); measured with conversion tracking + GA4 linking.</li>
<li><strong>Meta Ads (Facebook/Instagram)</strong> — interest/behavior-based (interrupting a feed); measured with the Meta Pixel/Conversions API, whose numbers often differ from GA4 due to different attribution windows.</li>
</ul>
<div class="callout"><span class="badge">Platform bias</span> Every ad platform tends to over-report its own conversions ("last-touch, self-reported"). Cross-check Google Ads and Meta Ads numbers against GA4/your CRM before trusting either in isolation.</div>`,
    `<span class="eyebrow">DMA302m · Chương 3 · Bài 3.1</span>
<h2>Đo lường chiến dịch quảng cáo: Google/Meta Ads, ROAS &amp; CPA</h2>
<h3>Chỉ số nền tảng của quảng cáo trả phí</h3>
<ul>
<li><strong>Impressions</strong> — số lần quảng cáo được hiển thị.</li>
<li><strong>CTR (tỉ lệ click)</strong> = số click / impressions.</li>
<li><strong>CPC (chi phí mỗi click)</strong> = chi tiêu / số click.</li>
<li><strong>CPM (chi phí trên 1.000 lần hiển thị)</strong> = chi tiêu / impressions × 1.000.</li>
</ul>
<h3>Hai câu hỏi quan trọng nhất: ROAS & CPA</h3>
<pre><code>ROAS (hiệu quả trên chi tiêu QC) = Doanh thu từ QC / Chi tiêu QC
  Ví dụ: 20.000.000 VND doanh thu / 5.000.000 VND chi = 4.0 (400%)

CPA (chi phí trên mỗi khách) = Chi tiêu QC / Số lượt chuyển đổi
  Ví dụ: 5.000.000 VND chi / 50 đơn hàng = 100.000 VND mỗi đơn
</code></pre>
<p>Một chiến dịch có CTR tốt vẫn có thể lỗ nếu <strong>ROAS &lt; 1</strong> hoặc <strong>CPA</strong> vượt giá trị mà một khách hàng mang lại. Luôn so CPA với giá trị khách hàng trọn đời (LTV), không so bằng cảm giác "thấy đắt."</p>
<h3>Tham số UTM & theo dõi chiến dịch</h3>
<p><strong>Tag UTM</strong> gắn vào URL giúp GA4 gán đúng traffic cho chiến dịch, nguồn và loại kênh: <code>?utm_source=facebook&amp;utm_medium=cpc&amp;utm_campaign=summer_sale</code>. Không có UTM nhất quán, số liệu từ nền tảng quảng cáo và GA4 sẽ không khớp, và quyết định ngân sách bị đưa ra trên dữ liệu sai.</p>
<h3>Google Ads vs Meta Ads</h3>
<ul>
<li><strong>Google Ads (Search/Shopping/Display/YouTube)</strong> — chủ yếu dựa trên nhu cầu (người dùng đang tìm kiếm); đo bằng conversion tracking + liên kết GA4.</li>
<li><strong>Meta Ads (Facebook/Instagram)</strong> — dựa trên sở thích/hành vi (chen vào feed); đo bằng Meta Pixel/Conversions API, số liệu thường khác GA4 do khung thời gian attribution khác nhau.</li>
</ul>
<div class="callout"><span class="badge">Thiên vị của nền tảng</span> Mọi nền tảng quảng cáo có xu hướng báo cáo chuyển đổi của mình cao hơn thực tế ("last-touch, tự báo cáo"). Đối chiếu số liệu Google Ads và Meta Ads với GA4/CRM trước khi tin riêng lẻ.</div>`,
  ]]);

const c3q = quiz('dma302m-quiz-3', 'Quiz 3 — Ad campaign measurement|||Quiz 3 — Đo lường chiến dịch quảng cáo', [
  { id: 'q1', question: 'Công thức tính ROAS là gì?', options: ['Doanh thu từ QC / Chi tiêu QC', 'Chi tiêu QC / Số click', 'Số click / Impressions', 'Impressions / Chi tiêu QC'], correctIndex: 0, explanation: 'ROAS = Doanh thu từ quảng cáo chia cho chi tiêu quảng cáo; ROAS &lt; 1 nghĩa là lỗ.' },
  { id: 'q2', question: 'Tham số UTM trong URL quảng cáo dùng để làm gì?', options: ['Tăng CTR tự động', 'Giúp GA4 gán đúng traffic về nguồn/chiến dịch', 'Giảm CPM', 'Thay thế Meta Pixel'], correctIndex: 1, explanation: 'UTM (utm_source, utm_medium, utm_campaign,...) giúp công cụ phân tích biết traffic đến từ chiến dịch nào.' },
  { id: 'q3', question: 'Vì sao số chuyển đổi trên Meta Ads Manager thường khác số trên GA4?', options: ['Meta Ads không đo được gì', 'Khung thời gian attribution và cách đo (Pixel/CAPI vs GA4) khác nhau', 'GA4 không hỗ trợ quảng cáo', 'Vì CPM luôn sai'], correctIndex: 1, explanation: 'Mỗi nền tảng dùng cửa sổ attribution và phương thức đo riêng, nên số "chuyển đổi" tự báo cáo thường không khớp GA4.' },
]);

const c4 = doc('dma302m-4-1-seo-content-analytics', '4.1 — SEO & content analytics|||4.1 — Phân tích SEO & content',
  'Organic search: impressions/clicks/CTR/vị trí trung bình trên Search Console; on-page vs off-page; chỉ số content (thời gian đọc, tỉ lệ thoát, exit page); bám giáo trình từ khoá & backlink.',
  [[
    `<span class="eyebrow">DMA302m · Chapter 4 · Lesson 4.1</span>
<h2>SEO &amp; content analytics</h2>
<h3>Measuring organic search with Search Console</h3>
<p><strong>Google Search Console</strong> is the source of truth for organic (unpaid) search performance — GA4 sees what happens after a click, Search Console sees the search itself:</p>
<ul>
<li><strong>Impressions</strong> — how often your page appeared in search results.</li>
<li><strong>Clicks</strong> &amp; <strong>CTR</strong> — clicks / impressions for a query or page.</li>
<li><strong>Average position</strong> — average ranking across all matching queries.</li>
</ul>
<pre><code>Query "phan tich marketing so"
  Impressions: 5,000   Clicks: 150   CTR: 3.0%   Avg. position: 8.2
-&gt; Ranks page 1 (~pos 8) but low CTR: title/snippet may need work
</code></pre>
<h3>On-page vs off-page SEO</h3>
<ul>
<li><strong>On-page</strong> — content quality, keywords in titles/headings, page speed (Core Web Vitals), internal linking, mobile-friendliness.</li>
<li><strong>Off-page</strong> — backlinks (other sites linking to yours) and domain authority; still the strongest ranking signal after content relevance.</li>
</ul>
<h3>Content performance metrics</h3>
<ul>
<li><strong>Engagement rate</strong> (GA4) — % of sessions with meaningful interaction (&gt;10s, a conversion event, or 2+ page views).</li>
<li><strong>Bounce rate</strong> — inverse of engagement rate; high bounce on a landing page often signals a content/intent mismatch.</li>
<li><strong>Exit pages</strong> — where users leave the site; useful to spot content that ends a journey instead of continuing it.</li>
<li><strong>Avg. engagement time</strong> — how long content actually holds attention.</li>
</ul>
<div class="callout"><span class="badge">Query vs keyword</span> A search "query" is what a user actually typed; a "keyword" is what you plan around. SEO analytics is about closing the gap between the two — the real queries bringing traffic often surprise you.</div>`,
    `<span class="eyebrow">DMA302m · Chương 4 · Bài 4.1</span>
<h2>Phân tích SEO &amp; content</h2>
<h3>Đo tìm kiếm tự nhiên với Search Console</h3>
<p><strong>Google Search Console</strong> là nguồn dữ liệu chuẩn cho hiệu quả tìm kiếm tự nhiên (organic) — GA4 thấy điều xảy ra sau khi click, còn Search Console thấy chính lượt tìm kiếm:</p>
<ul>
<li><strong>Impressions</strong> — số lần trang xuất hiện trong kết quả tìm kiếm.</li>
<li><strong>Clicks</strong> &amp; <strong>CTR</strong> — số click / impressions cho một truy vấn hoặc trang.</li>
<li><strong>Vị trí trung bình (Average position)</strong> — thứ hạng trung bình trên mọi truy vấn khớp.</li>
</ul>
<pre><code>Truy vấn "phan tich marketing so"
  Impressions: 5.000   Clicks: 150   CTR: 3.0%   Vị trí TB: 8.2
-&gt; Vào top trang 1 (~vị trí 8) nhưng CTR thấp: cần cải thiện title/snippet
</code></pre>
<h3>SEO on-page vs off-page</h3>
<ul>
<li><strong>On-page</strong> — chất lượng nội dung, từ khoá trong title/heading, tốc độ trang (Core Web Vitals), liên kết nội bộ, thân thiện mobile.</li>
<li><strong>Off-page</strong> — backlink (trang khác liên kết về trang bạn) và độ uy tín domain; vẫn là tín hiệu xếp hạng mạnh nhất sau độ liên quan nội dung.</li>
</ul>
<h3>Chỉ số hiệu quả content</h3>
<ul>
<li><strong>Tỉ lệ tương tác (engagement rate)</strong> (GA4) — % session có tương tác đáng kể (&gt;10s, có sự kiện chuyển đổi, hoặc ≥2 lượt xem trang).</li>
<li><strong>Tỉ lệ thoát (bounce rate)</strong> — nghịch với engagement rate; bounce cao trên trang landing thường báo hiệu nội dung không khớp ý định tìm kiếm.</li>
<li><strong>Trang thoát (exit pages)</strong> — nơi người dùng rời site; hữu ích để tìm nội dung kết thúc hành trình thay vì tiếp tục.</li>
<li><strong>Thời gian tương tác trung bình</strong> — nội dung thực sự giữ chân bao lâu.</li>
</ul>
<div class="callout"><span class="badge">Truy vấn vs từ khoá</span> "Truy vấn (query)" là điều người dùng thực sự gõ; "từ khoá (keyword)" là điều bạn lập kế hoạch xoay quanh. Phân tích SEO là thu hẹp khoảng cách giữa hai thứ đó — truy vấn thật mang traffic thường khiến bạn bất ngờ.</div>`,
  ]]);

const c4q = quiz('dma302m-quiz-4', 'Quiz 4 — SEO & content analytics|||Quiz 4 — Phân tích SEO & content', [
  { id: 'q1', question: 'Công cụ nào là nguồn chuẩn để đo hiệu quả tìm kiếm tự nhiên (organic search)?', options: ['Meta Ads Manager', 'Google Search Console', 'Looker Studio', 'GA4 Funnel exploration'], correctIndex: 1, explanation: 'Search Console báo cáo impressions/clicks/CTR/vị trí trung bình trực tiếp từ kết quả tìm kiếm Google.' },
  { id: 'q2', question: 'Backlink (liên kết từ trang khác về trang mình) thuộc nhóm SEO nào?', options: ['On-page', 'Off-page', 'Paid search', 'Email automation'], correctIndex: 1, explanation: 'Backlink là yếu tố off-page — không nằm trong nội dung/kỹ thuật của chính trang, mà là tín hiệu bên ngoài.' },
  { id: 'q3', question: 'Bounce rate cao trên một trang landing thường gợi ý điều gì?', options: ['Trang đang xếp hạng rất tốt', 'Nội dung có thể không khớp với ý định tìm kiếm của người dùng', 'ROAS đang tăng', 'CPM đang giảm'], correctIndex: 1, explanation: 'Người vào rồi rời ngay thường vì nội dung không đáp ứng đúng điều họ mong đợi khi click vào.' },
]);

const c5 = doc('dma302m-5-1-social-media-analytics', '5.1 — Social media analytics & engagement|||5.1 — Social media analytics & engagement',
  'Chỉ số theo nền tảng (reach/impressions/engagement rate); vanity vs actionable trên social; chỉ số theo mục tiêu (nhận diện/tương tác/chuyển đổi); social listening & sentiment.',
  [[
    `<span class="eyebrow">DMA302m · Chapter 5 · Lesson 5.1</span>
<h2>Social media analytics &amp; engagement</h2>
<h3>Core social metrics</h3>
<ul>
<li><strong>Reach</strong> — unique accounts that saw a post.</li>
<li><strong>Impressions</strong> — total times a post was displayed (can exceed reach — one person may see it twice).</li>
<li><strong>Engagement</strong> — likes, comments, shares, saves.</li>
<li><strong>Engagement rate</strong> = engagements / reach (or / impressions or / followers, depending on the platform's convention — always state which).</li>
<li><strong>Click-through to site</strong> — link clicks leading back to your website, trackable with UTM + GA4.</li>
</ul>
<h3>Vanity vs actionable on social</h3>
<p><strong>Follower count</strong> is the classic vanity metric — a large but disengaged audience matters less than a smaller, active one. Prefer <strong>engagement rate</strong>, <strong>share of voice</strong>, and <strong>referral traffic/conversions from social</strong> as actionable signals.</p>
<h3>Matching metrics to objective</h3>
<pre><code>Objective: Awareness   -&gt; Reach, impressions, video views
Objective: Engagement  -&gt; Engagement rate, comments, shares
Objective: Conversion  -&gt; Link clicks, GA4 conversions from social, ROAS on boosted posts
</code></pre>
<h3>Social listening &amp; sentiment</h3>
<p><strong>Social listening</strong> tracks mentions of your brand/competitors across platforms, even where you didn't post. <strong>Sentiment analysis</strong> classifies those mentions as positive/neutral/negative — a spike in negative sentiment after a launch is an early-warning signal that raw engagement numbers miss.</p>
<div class="callout"><span class="badge">Platform-native tools</span> Each platform (Meta Business Suite, TikTok Analytics, LinkedIn Analytics) has its own insights dashboard; cross-platform reporting usually needs a connector or manual export into a shared dashboard like Looker Studio.</div>`,
    `<span class="eyebrow">DMA302m · Chương 5 · Bài 5.1</span>
<h2>Social media analytics &amp; engagement</h2>
<h3>Chỉ số nền tảng của social</h3>
<ul>
<li><strong>Reach</strong> — số tài khoản riêng biệt đã thấy bài viết.</li>
<li><strong>Impressions</strong> — tổng số lần bài viết được hiển thị (có thể lớn hơn reach — một người có thể thấy hai lần).</li>
<li><strong>Engagement (tương tác)</strong> — like, comment, share, save.</li>
<li><strong>Tỉ lệ tương tác</strong> = engagement / reach (hoặc / impressions hoặc / followers, tuỳ quy ước từng nền tảng — luôn ghi rõ dùng mẫu số nào).</li>
<li><strong>Click về site</strong> — lượt click liên kết dẫn về website, theo dõi được bằng UTM + GA4.</li>
</ul>
<h3>Vanity vs hành động được trên social</h3>
<p><strong>Số lượng follower</strong> là chỉ số vanity kinh điển — một lượng lớn người theo dõi nhưng không tương tác kém giá trị hơn một nhóm nhỏ nhưng năng động. Ưu tiên <strong>tỉ lệ tương tác</strong>, <strong>share of voice</strong>, và <strong>traffic/chuyển đổi từ social</strong> như tín hiệu hành động được.</p>
<h3>Khớp chỉ số với mục tiêu</h3>
<pre><code>Mục tiêu: Nhận diện  -&gt; Reach, impressions, lượt xem video
Mục tiêu: Tương tác  -&gt; Tỉ lệ tương tác, comment, share
Mục tiêu: Chuyển đổi -&gt; Link click, chuyển đổi GA4 từ social, ROAS bài quảng cáo
</code></pre>
<h3>Social listening &amp; sentiment</h3>
<p><strong>Social listening</strong> theo dõi lượt đề cập đến thương hiệu/đối thủ trên các nền tảng, cả khi bạn không đăng bài. <strong>Phân tích cảm xúc (sentiment)</strong> phân loại các lượt đề cập đó thành tích cực/trung tính/tiêu cực — cảm xúc tiêu cực tăng vọt sau một lần ra mắt là tín hiệu cảnh báo sớm mà số liệu tương tác thô không thấy được.</p>
<div class="callout"><span class="badge">Công cụ riêng từng nền tảng</span> Mỗi nền tảng (Meta Business Suite, TikTok Analytics, LinkedIn Analytics) có dashboard insight riêng; báo cáo đa nền tảng thường cần connector hoặc xuất tay vào một dashboard chung như Looker Studio.</div>`,
  ]]);

const c5q = quiz('dma302m-quiz-5', 'Quiz 5 — Social media analytics|||Quiz 5 — Social media analytics', [
  { id: 'q1', question: 'Reach và Impressions khác nhau ở điểm nào?', options: ['Không khác gì cả', 'Reach là số TÀI KHOẢN riêng biệt thấy bài, Impressions là TỔNG số lần hiển thị (có thể trùng người)', 'Impressions luôn nhỏ hơn Reach', 'Reach chỉ dùng cho quảng cáo trả phí'], correctIndex: 1, explanation: 'Một người có thể thấy một bài đăng nhiều lần: Impressions ghi mọi lần hiển thị, Reach chỉ đếm mỗi tài khoản một lần.' },
  { id: 'q2', question: 'Chỉ số nào trên social thường bị coi là "vanity metric" nếu đứng riêng lẻ?', options: ['Tỉ lệ tương tác', 'Số lượng follower', 'Chuyển đổi từ social', 'Referral traffic'], correctIndex: 1, explanation: 'Follower đông nhưng không tương tác/không chuyển đổi thì ít giá trị hơn một cộng đồng nhỏ nhưng chủ động.' },
  { id: 'q3', question: 'Social listening dùng để làm gì?', options: ['Tự động tăng follower', 'Theo dõi lượt đề cập đến thương hiệu/đối thủ trên các nền tảng', 'Tính ROAS cho Google Ads', 'Thay thế Search Console'], correctIndex: 1, explanation: 'Social listening bắt các lượt đề cập ở mọi nơi, kể cả những nơi thương hiệu không tự đăng bài, phục vụ phân tích sentiment.' },
]);

const c6 = doc('dma302m-6-1-email-automation-metrics', '6.1 — Email & marketing automation metrics|||6.1 — Chỉ số email & marketing automation',
  'Chỉ số email cốt lõi (open rate, CTR, CTOR, unsubscribe, deliverability); A/B testing subject line; automation & lead scoring; nurture flow.',
  [[
    `<span class="eyebrow">DMA302m · Chapter 6 · Lesson 6.1</span>
<h2>Email &amp; marketing automation metrics</h2>
<h3>Core email metrics</h3>
<pre><code>Delivered            = Sent - Bounced
Open Rate            = Opens / Delivered
Click-Through Rate   = Clicks / Delivered
CTOR (Click-to-Open) = Clicks / Opens   -&gt; measures content, not subject line
Unsubscribe Rate     = Unsubscribes / Delivered
</code></pre>
<p>A high <strong>open rate</strong> with a low <strong>CTOR</strong> means the subject line worked but the content/offer inside didn't — the two metrics diagnose different parts of the email.</p>
<h3>Deliverability</h3>
<p>None of the above matters if email lands in spam. <strong>Bounce rate</strong> (hard vs soft), <strong>spam complaint rate</strong>, and sender reputation all affect whether future emails even reach the inbox — list hygiene (removing invalid/unengaged addresses) protects deliverability.</p>
<h3>A/B testing subject lines &amp; send time</h3>
<p>Split a list into two random groups, vary one element (subject line, send time, CTA), and compare — statistically significant open/click differences guide what to scale to the full list.</p>
<h3>Automation &amp; lead scoring</h3>
<ul>
<li><strong>Marketing automation</strong> — trigger-based flows (welcome series, cart abandonment, re-engagement) that fire on user behavior instead of a fixed schedule.</li>
<li><strong>Lead scoring</strong> — assigning points to actions (opened email = +1, clicked pricing page = +10) so sales can prioritize the hottest leads.</li>
<li><strong>Nurture flow</strong> — a sequence that moves a lead from "just subscribed" toward "ready to buy," measured by progression rate through each stage, not just one email's open rate.</li>
</ul>
<div class="callout"><span class="badge">Segment before you send</span> A single email blasted to everyone underperforms a segmented send (by interest, lifecycle stage, or past purchase) — relevance is the biggest lever on open and click rates.</div>`,
    `<span class="eyebrow">DMA302m · Chương 6 · Bài 6.1</span>
<h2>Chỉ số email &amp; marketing automation</h2>
<h3>Chỉ số email cốt lõi</h3>
<pre><code>Delivered (Đã gửi thành công) = Sent - Bounced
Tỉ lệ mở (Open Rate)           = Opens / Delivered
Tỉ lệ click (CTR)              = Clicks / Delivered
CTOR (Click-to-Open)           = Clicks / Opens  -&gt; đo NỘI DUNG, không đo subject
Tỉ lệ unsubscribe               = Unsubscribes / Delivered
</code></pre>
<p>Tỉ lệ mở cao nhưng <strong>CTOR</strong> thấp nghĩa là subject line hiệu quả nhưng nội dung/ưu đãi bên trong chưa thuyết phục — hai chỉ số này chẩn đoán hai phần khác nhau của email.</p>
<h3>Deliverability (khả năng gửi đến hộp thư)</h3>
<p>Mọi chỉ số trên vô nghĩa nếu email vào spam. <strong>Tỉ lệ bounce</strong> (hard vs soft), <strong>tỉ lệ báo spam</strong>, và uy tín người gửi đều ảnh hưởng đến việc email sau có tới được hộp thư không — dọn danh sách (bỏ địa chỉ không hợp lệ/không tương tác) bảo vệ deliverability.</p>
<h3>A/B test subject line & giờ gửi</h3>
<p>Chia danh sách thành hai nhóm ngẫu nhiên, thay đổi một yếu tố (subject line, giờ gửi, CTA), rồi so sánh — khác biệt tỉ lệ mở/click có ý nghĩa thống kê sẽ định hướng thứ cần áp dụng cho toàn danh sách.</p>
<h3>Automation & lead scoring</h3>
<ul>
<li><strong>Marketing automation</strong> — luồng kích hoạt theo hành vi (welcome series, giỏ hàng bỏ quên, re-engagement) chạy theo hành động người dùng thay vì lịch cố định.</li>
<li><strong>Lead scoring</strong> — gán điểm cho hành động (mở email = +1, click trang giá = +10) để sales ưu tiên lead "nóng" nhất.</li>
<li><strong>Nurture flow</strong> — chuỗi email đưa một lead từ "mới đăng ký" tới "sẵn sàng mua," đo bằng tỉ lệ tiến qua từng giai đoạn, không chỉ tỉ lệ mở một email.</li>
</ul>
<div class="callout"><span class="badge">Phân khúc trước khi gửi</span> Một email gửi đại trà cho tất cả luôn kém hiệu quả hơn gửi theo phân khúc (sở thích, giai đoạn khách hàng, lịch sử mua) — độ liên quan là yếu tố quyết định lớn nhất tới tỉ lệ mở và click.</div>`,
  ]]);

const c6q = quiz('dma302m-quiz-6', 'Quiz 6 — Email & automation metrics|||Quiz 6 — Chỉ số email & automation', [
  { id: 'q1', question: 'CTOR (Click-to-Open Rate) được tính bằng?', options: ['Clicks / Delivered', 'Clicks / Opens', 'Opens / Delivered', 'Unsubscribes / Delivered'], correctIndex: 1, explanation: 'CTOR = Clicks chia Opens, đo hiệu quả NỘI DUNG email với người đã mở, tách khỏi hiệu quả của subject line.' },
  { id: 'q2', question: 'Mở email cao nhưng CTOR thấp thường nghĩa là gì?', options: ['Email vào spam', 'Subject line hiệu quả nhưng nội dung/ưu đãi bên trong chưa thuyết phục', 'Danh sách email quá nhỏ', 'Deliverability kém'], correctIndex: 1, explanation: 'Nhiều người mở (subject tốt) nhưng ít click (nội dung chưa đủ hấp dẫn) — hai chỉ số chẩn đoán hai phần khác nhau.' },
  { id: 'q3', question: 'Marketing automation khác gửi email hàng loạt cố định ở điểm nào?', options: ['Automation luôn rẻ hơn', 'Automation kích hoạt theo HÀNH VI người dùng, không theo lịch cố định', 'Automation không cần đo lường', 'Automation chỉ dùng cho social'], correctIndex: 1, explanation: 'Automation (welcome series, cart abandonment...) fire dựa trên hành động thực tế của người dùng, không phải một lịch gửi cố định.' },
]);

const c7 = doc('dma302m-7-1-attribution-customer-journey', '7.1 — Attribution models & the customer journey|||7.1 — Mô hình attribution & hành trình khách hàng',
  'Vấn đề "ai được ghi công" cho một chuyển đổi; các mô hình attribution (last-click, first-click, linear, time-decay, data-driven); multi-touch & hành trình đa kênh.',
  [[
    `<span class="eyebrow">DMA302m · Chapter 7 · Lesson 7.1</span>
<h2>Attribution models &amp; the customer journey</h2>
<h3>The problem: who gets the credit?</h3>
<p>A customer might see a Facebook ad (touch 1), search on Google later (touch 2), read a blog post (touch 3), and finally convert from an email (touch 4). Which channel "caused" the sale? <strong>Attribution modeling</strong> is the set of rules for assigning credit across a multi-touch journey.</p>
<h3>Common attribution models</h3>
<pre><code>Journey: Facebook Ad -&gt; Organic Search -&gt; Blog -&gt; Email -&gt; Purchase

Last-click       : 100% credit -&gt; Email
First-click      : 100% credit -&gt; Facebook Ad
Linear           : 25% credit  -&gt; each of the 4 touches
Time-decay       : more credit -&gt; touches closer to conversion (Email &gt; Blog &gt; ...)
Data-driven (GA4): credit based on modeled contribution to conversion probability
</code></pre>
<h3>Why the choice matters</h3>
<p>Under <strong>last-click</strong>, email and branded search look great and the Facebook ad that started everything looks worthless — leading a team to (wrongly) cut top-of-funnel spend. GA4's default, <strong>data-driven attribution (DDA)</strong>, uses machine learning across converting and non-converting paths to distribute credit more fairly.</p>
<h3>Customer journey mapping</h3>
<p>Beyond a single model number, mapping the actual sequence of touchpoints (awareness → consideration → decision → retention) across channels reveals which combinations of channels work together — e.g. "social drives awareness that search later converts."</p>
<div class="callout"><span class="badge">No model is "the truth"</span> Every attribution model is an approximation with a bias baked in. The practical skill is knowing which model's bias fits the decision you're making, and sanity-checking with more than one model before reallocating a real budget.</div>`,
    `<span class="eyebrow">DMA302m · Chương 7 · Bài 7.1</span>
<h2>Mô hình attribution &amp; hành trình khách hàng</h2>
<h3>Vấn đề: ai được ghi công?</h3>
<p>Một khách hàng có thể thấy quảng cáo Facebook (điểm chạm 1), sau đó tìm trên Google (điểm chạm 2), đọc một bài blog (điểm chạm 3), rồi cuối cùng chuyển đổi từ một email (điểm chạm 4). Kênh nào "gây ra" đơn hàng? <strong>Mô hình attribution</strong> là tập quy tắc để phân bổ công cho một hành trình nhiều điểm chạm.</p>
<h3>Các mô hình attribution phổ biến</h3>
<pre><code>Hành trình: QC Facebook -&gt; Tìm kiếm tự nhiên -&gt; Blog -&gt; Email -&gt; Mua hàng

Last-click (chạm cuối) : 100% công -&gt; Email
First-click (chạm đầu) : 100% công -&gt; QC Facebook
Linear (đều nhau)      : 25% công  -&gt; mỗi 4 điểm chạm
Time-decay (theo thời gian): công nhiều hơn -&gt; điểm chạm gần lúc chuyển đổi (Email &gt; Blog &gt; ...)
Data-driven (GA4)      : công dựa trên mô hình đóng góp vào xác suất chuyển đổi
</code></pre>
<h3>Vì sao lựa chọn mô hình quan trọng</h3>
<p>Theo <strong>last-click</strong>, email và tìm kiếm thương hiệu trông rất tốt còn quảng cáo Facebook khởi đầu mọi thứ lại trông vô giá trị — khiến một nhóm (sai lầm) cắt ngân sách đầu phễu. Mô hình mặc định của GA4, <strong>data-driven attribution (DDA)</strong>, dùng machine learning trên cả đường dẫn chuyển đổi và không chuyển đổi để phân bổ công công bằng hơn.</p>
<h3>Lập bản đồ hành trình khách hàng</h3>
<p>Ngoài một con số của một mô hình, lập bản đồ chuỗi điểm chạm thực tế (nhận diện → xem xét → quyết định → giữ chân) qua các kênh cho thấy tổ hợp kênh nào phối hợp tốt với nhau — vd "social tạo nhận diện mà sau đó search chuyển đổi."</p>
<div class="callout"><span class="badge">Không mô hình nào là "sự thật"</span> Mọi mô hình attribution đều là xấp xỉ có sẵn thiên lệch. Kỹ năng thực dụng là biết thiên lệch của mô hình nào phù hợp với quyết định đang cần, và đối chiếu bằng nhiều hơn một mô hình trước khi phân bổ lại ngân sách thật.</div>`,
  ]]);

const c7q = quiz('dma302m-quiz-7', 'Quiz 7 — Attribution & customer journey|||Quiz 7 — Attribution & hành trình khách hàng', [
  { id: 'q1', question: 'Mô hình attribution "last-click" ghi công 100% cho?', options: ['Điểm chạm đầu tiên trong hành trình', 'Điểm chạm cuối cùng trước khi chuyển đổi', 'Chia đều mọi điểm chạm', 'Kênh có chi phí thấp nhất'], correctIndex: 1, explanation: 'Last-click gán toàn bộ công cho điểm chạm cuối cùng, dù các điểm chạm trước có thể đã khởi tạo nhu cầu.' },
  { id: 'q2', question: 'Rủi ro lớn nhất khi chỉ dùng mô hình last-click để quyết định ngân sách là gì?', options: ['Tính toán quá phức tạp', 'Có thể đánh giá thấp các kênh đầu phễu (như social) và cắt sai ngân sách', 'Không tương thích với GA4', 'Chỉ áp dụng được cho email'], correctIndex: 1, explanation: 'Kênh khởi tạo nhận diện (top-of-funnel) thường bị "vô hình" dưới last-click, dẫn tới quyết định cắt ngân sách sai.' },
  { id: 'q3', question: 'Data-driven attribution (DDA) trong GA4 phân bổ công dựa trên?', options: ['Luôn chia đều cho mọi kênh', 'Mô hình học máy trên đóng góp thực tế vào xác suất chuyển đổi', 'Chỉ điểm chạm đầu tiên', 'Ngẫu nhiên'], correctIndex: 1, explanation: 'DDA dùng machine learning so sánh đường dẫn có và không có chuyển đổi để ước lượng đóng góp thật của mỗi điểm chạm.' },
]);

const c8 = doc('dma302m-8-1-dashboards-looker-studio-decisions', '8.1 — Dashboards, Looker Studio & data-driven decisions|||8.1 — Dashboard, Looker Studio & ra quyết định dựa trên dữ liệu',
  'Nguyên tắc thiết kế dashboard tốt; kết nối GA4/Sheets/Ads vào Looker Studio; nhịp báo cáo (cadence); từ insight tới quyết định & khép vòng đo lường.',
  [[
    `<span class="eyebrow">DMA302m · Chapter 8 · Lesson 8.1</span>
<h2>Dashboards, Looker Studio &amp; data-driven decisions</h2>
<h3>What makes a dashboard good</h3>
<ul>
<li><strong>One audience, one purpose</strong> — an executive dashboard (top KPIs, trend) differs from an analyst dashboard (granular, filterable).</li>
<li><strong>KPIs first, detail on demand</strong> — lead with the 3-5 numbers that matter; let viewers drill down instead of drowning them upfront.</li>
<li><strong>Context, not just numbers</strong> — a KPI needs a target/benchmark and a trend line; "3.2%" alone tells you nothing.</li>
</ul>
<h3>Building in Looker Studio</h3>
<pre><code>Data sources: GA4 property, Google Ads, Google Sheets (offline data), Search Console
  -&gt; Connect each as a "data source" in Looker Studio
  -&gt; Blend sources sharing a common key (e.g. date, campaign) for cross-channel views
  -&gt; Add scorecards (single KPI), time series (trend), tables (by segment), filters (date range, channel)
</code></pre>
<p>Looker Studio is <strong>free</strong> and refreshes automatically when connected sources update — a durable answer to "can you send me last month's numbers again?"</p>
<h3>Reporting cadence</h3>
<ul>
<li><strong>Daily/weekly</strong> — operational metrics (spend pacing, campaign anomalies).</li>
<li><strong>Monthly/quarterly</strong> — strategic KPIs against targets, channel mix review.</li>
</ul>
<h3>From insight to decision — closing the loop</h3>
<pre><code>Data -&gt; Insight -&gt; Decision -&gt; Action -&gt; Measure the result -&gt; back to Data
</code></pre>
<p>A dashboard that nobody acts on is decoration. The measurement plan from Chapter 1 closes the loop here: every KPI on the dashboard should map back to a decision someone is actually empowered to make.</p>
<div class="callout"><span class="badge">Course wrap-up</span> KPIs → GA4 → ad measurement → SEO/content → social → email/automation → attribution → dashboards: each chapter feeds the next, and the dashboard is where they all meet to drive a real decision.</div>`,
    `<span class="eyebrow">DMA302m · Chương 8 · Bài 8.1</span>
<h2>Dashboard, Looker Studio &amp; ra quyết định dựa trên dữ liệu</h2>
<h3>Điều làm nên một dashboard tốt</h3>
<ul>
<li><strong>Một đối tượng xem, một mục đích</strong> — dashboard cho lãnh đạo (KPI tổng, xu hướng) khác dashboard cho analyst (chi tiết, lọc được).</li>
<li><strong>KPI trước, chi tiết khi cần</strong> — dẫn đầu bằng 3-5 số quan trọng nhất; để người xem tự đào sâu thay vì nhồi hết ngay từ đầu.</li>
<li><strong>Có ngữ cảnh, không chỉ là số</strong> — một KPI cần mục tiêu/benchmark và đường xu hướng; "3,2%" đứng riêng không nói lên điều gì.</li>
</ul>
<h3>Dựng dashboard trong Looker Studio</h3>
<pre><code>Nguồn dữ liệu: property GA4, Google Ads, Google Sheets (dữ liệu offline), Search Console
  -&gt; Kết nối từng nguồn như một "data source" trong Looker Studio
  -&gt; Blend (trộn) các nguồn có chung khoá (vd ngày, campaign) để xem đa kênh
  -&gt; Thêm scorecard (một KPI), time series (xu hướng), bảng (theo phân khúc), filter (khoảng ngày, kênh)
</code></pre>
<p>Looker Studio <strong>miễn phí</strong> và tự cập nhật khi nguồn dữ liệu kết nối thay đổi — câu trả lời bền vững cho "gửi lại số tháng trước cho tôi được không?"</p>
<h3>Nhịp báo cáo</h3>
<ul>
<li><strong>Hàng ngày/tuần</strong> — chỉ số vận hành (tốc độ chi tiêu, bất thường chiến dịch).</li>
<li><strong>Hàng tháng/quý</strong> — KPI chiến lược so với mục tiêu, xem lại tỉ trọng kênh.</li>
</ul>
<h3>Từ insight tới quyết định — khép vòng đo lường</h3>
<pre><code>Dữ liệu -&gt; Insight -&gt; Quyết định -&gt; Hành động -&gt; Đo kết quả -&gt; quay lại Dữ liệu
</code></pre>
<p>Một dashboard không ai hành động theo chỉ là vật trang trí. Kế hoạch đo lường từ Chương 1 khép vòng ở đây: mỗi KPI trên dashboard nên gắn lại với một quyết định mà ai đó thực sự có quyền đưa ra.</p>
<div class="callout"><span class="badge">Tổng kết môn học</span> KPI → GA4 → đo quảng cáo → SEO/content → social → email/automation → attribution → dashboard: mỗi chương nuôi chương sau, và dashboard là nơi tất cả gặp nhau để dẫn tới một quyết định thật.</div>`,
  ]]);

const c8q = quiz('dma302m-quiz-8', 'Quiz 8 — Dashboards & data-driven decisions|||Quiz 8 — Dashboard & ra quyết định dựa trên dữ liệu', [
  { id: 'q1', question: 'Nguyên tắc nào KHÔNG nên áp dụng khi thiết kế dashboard?', options: ['KPI quan trọng đặt trước, chi tiết đào sâu sau', 'Nhồi mọi chỉ số có thể lên cùng một màn hình đầu tiên', 'Gắn ngữ cảnh (mục tiêu/benchmark) cho mỗi KPI', 'Thiết kế theo đúng đối tượng xem'], correctIndex: 1, explanation: 'Nhồi hết mọi chỉ số ngay từ đầu làm người xem chìm trong dữ liệu — nên dẫn bằng vài KPI quan trọng, cho đào sâu khi cần.' },
  { id: 'q2', question: 'Trong Looker Studio, việc "blend" (trộn) nguồn dữ liệu dùng để làm gì?', options: ['Xoá dữ liệu cũ', 'Kết hợp nhiều nguồn theo một khoá chung (vd ngày, campaign) để xem đa kênh', 'Chỉ hoạt động với Google Ads', 'Thay thế GA4 hoàn toàn'], correctIndex: 1, explanation: 'Blend cho phép ghép các nguồn khác nhau (GA4, Ads, Sheets...) theo khoá chung để có góc nhìn tổng hợp.' },
  { id: 'q3', question: 'Vòng khép "Dữ liệu → Insight → Quyết định → Hành động → Đo kết quả" nhấn mạnh điều gì?', options: ['Dashboard chỉ cần đẹp là đủ', 'Mỗi chỉ số nên dẫn tới một quyết định và hành động thật, rồi đo lại kết quả', 'Chỉ cần đo một lần là xong', 'Insight quan trọng hơn hành động'], correctIndex: 1, explanation: 'Một dashboard không dẫn tới hành động chỉ là trang trí — mục tiêu là khép vòng: đo -&gt; hiểu -&gt; quyết định -&gt; hành động -&gt; đo lại.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'DMA302m',
    slug: 'dma302m-digital-marketing-analytics',
    title: 'Digital Marketing Analytics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DMA302m.webp',
    shortDescription: 'Digital marketing analytics: KPIs & measurement plan, GA4 (events, funnels, segments), ad metrics (ROAS, CPA, Google/Meta Ads), SEO & content, social & email metrics, attribution, dashboards (Looker Studio) & data-driven decisions.|||Phân tích marketing số: KPI & kế hoạch đo lường, GA4 (sự kiện, phễu, phân khúc), chỉ số QC (ROAS, CPA, Google/Meta Ads), SEO & content, social & email, attribution, dashboard (Looker Studio) & ra quyết định dựa trên dữ liệu.',
    description: 'Môn <strong>DMA302m — Digital Marketing Analytics</strong> (kỳ 5) giúp biến marketing thành một môn <strong>đo lường được, dựa trên dữ liệu</strong>. Từ <strong>KPI &amp; kế hoạch đo lường</strong> → <strong>Web analytics với GA4</strong> (sự kiện, phễu, phân khúc) → <strong>đo lường chiến dịch quảng cáo</strong> (Google/Meta Ads, ROAS/CPA) → <strong>SEO &amp; content analytics</strong> → <strong>social media analytics</strong> → <strong>email &amp; marketing automation</strong> → <strong>mô hình attribution</strong> &amp; hành trình khách hàng → <strong>dashboard</strong> (Looker Studio) &amp; ra quyết định. Bám giáo trình Hemann/Burbary, Kaushik và tài liệu GA4 chính thức, song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Metric vs KPI, khung SMART, kế hoạch đo lường; GA4: sự kiện, key events, funnel exploration, segment & audience; ROAS/CPA, UTM, Google Ads vs Meta Ads; Search Console, on-page/off-page SEO, chỉ số content; reach/impressions/engagement rate, social listening & sentiment; open rate/CTR/CTOR, deliverability, automation & lead scoring; mô hình attribution (last-click, linear, time-decay, data-driven); dashboard Looker Studio & khép vòng insight-to-action.',
    requirements: 'Kiến thức marketing căn bản (kênh, chiến dịch); có tài khoản Google để thực hành GA4/Looker Studio (miễn phí, dùng GA4 Demo Account nếu chưa có site riêng).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Hemann/Burbary & Kaushik, tài liệu GA4, Skillshop/Digital Garage, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vai trò của phân tích số liệu trong marketing, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — KPI & kế hoạch đo lường|||Chapter 1 — KPIs & measurement plan', description: 'Metric vs KPI, SMART, measurement plan, nhóm KPI theo funnel.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Web analytics & GA4|||Chapter 2 — Web analytics & GA4', description: 'Sự kiện, funnel exploration, segment & audience.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đo lường quảng cáo|||Chapter 3 — Ad campaign measurement', description: 'ROAS, CPA, UTM, Google Ads vs Meta Ads.', lessons: [c3, c3q] },
    { title: 'Chương 4 — SEO & content analytics|||Chapter 4 — SEO & content analytics', description: 'Search Console, on/off-page, chỉ số content.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Social media analytics|||Chapter 5 — Social media analytics', description: 'Reach/impressions/engagement, social listening.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Email & marketing automation|||Chapter 6 — Email & marketing automation', description: 'Open rate/CTR/CTOR, deliverability, lead scoring.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Attribution & hành trình khách hàng|||Chapter 7 — Attribution & customer journey', description: 'Last-click, linear, time-decay, data-driven.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Dashboard & ra quyết định|||Chapter 8 — Dashboards & decisions', description: 'Looker Studio, nhịp báo cáo, insight → hành động.', lessons: [c8, c8q] },
  ],
};
