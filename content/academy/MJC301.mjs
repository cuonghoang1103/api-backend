/**
 * MJC301 — MarTech & Customer Journey Orchestration. Môn KHÔNG có FLM syllabus
 * → dựng theo giáo trình chuẩn quốc tế: Scott Brinker "Hacking Marketing" &
 * chiefmartec martech landscape; Kingsnorth "Digital Marketing Strategy";
 * Lemon & Verhoef "Understanding Customer Experience" (JM 2016); HubSpot &
 * Google Analytics Academy. 8 chương, song ngữ VI+EN, công cụ thật + ví dụ,
 * quiz mỗi chương. Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG
 * backtick/${ trong HTML; "&"→"&amp;" chỉ trong content HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('mjc301-0-1-overview', 'Course overview: MarTech & the customer journey|||Tổng quan: MarTech & hành trình khách hàng',
  'MarTech là gì; vì sao marketing hiện đại là công nghệ + dữ liệu; hành trình khách hàng là trục xuyên suốt; lộ trình: nền tảng → dữ liệu → CRM/CDP → tự động hoá → cá nhân hoá/AI → đo lường → dựng stack.',
  [[
    `<span class="eyebrow">MJC301 · Lesson 0.1 · Overview</span>
<h2>MarTech &amp; the customer journey</h2>
<p class="lead">Modern marketing runs on <strong>technology and data</strong>. This course teaches <strong>MarTech (marketing technology)</strong> — the software that captures, connects and acts on customer data — organized around one spine: the <strong>customer journey</strong> from first touch to loyal advocate.</p>
<h3>Two big ideas</h3>
<ul>
<li><strong>Marketing is now software.</strong> As Scott Brinker argues in <em>Hacking Marketing</em>, marketers manage stacks of tools the way engineers manage code — iterating, integrating and measuring.</li>
<li><strong>The journey is the unit of work.</strong> Lemon &amp; Verhoef (2016) frame customer experience as a journey across touchpoints; MarTech exists to observe and orchestrate that journey.</li>
</ul>
<h3>Roadmap</h3>
<p>What MarTech is &amp; the landscape → the customer journey stages → collecting &amp; managing data (GA4, tags) → CRM &amp; CDP → marketing automation → personalization &amp; AI → measurement &amp; attribution → building a martech stack. Bilingual, with real tools (HubSpot, Salesforce, GA4, Segment) and worked examples.</p>`,
    `<span class="eyebrow">MJC301 · Bài 0.1 · Tổng quan</span>
<h2>MarTech &amp; hành trình khách hàng</h2>
<p class="lead">Marketing hiện đại chạy trên <strong>công nghệ và dữ liệu</strong>. Môn này dạy <strong>MarTech (công nghệ marketing)</strong> — phần mềm thu thập, kết nối và hành động trên dữ liệu khách hàng — xoay quanh một trục: <strong>hành trình khách hàng</strong> từ lần chạm đầu tiên đến người ủng hộ trung thành.</p>
<h3>Hai ý tưởng lớn</h3>
<ul>
<li><strong>Marketing giờ là phần mềm.</strong> Như Scott Brinker viết trong <em>Hacking Marketing</em>, marketer quản một "stack" công cụ giống kỹ sư quản mã — lặp, tích hợp và đo lường.</li>
<li><strong>Hành trình là đơn vị công việc.</strong> Lemon &amp; Verhoef (2016) xem trải nghiệm khách hàng là một hành trình qua các điểm chạm; MarTech tồn tại để quan sát và điều phối hành trình đó.</li>
</ul>
<h3>Lộ trình</h3>
<p>MarTech là gì &amp; bản đồ công cụ → các giai đoạn hành trình → thu thập &amp; quản lý dữ liệu (GA4, tag) → CRM &amp; CDP → tự động hoá → cá nhân hoá &amp; AI → đo lường &amp; attribution → dựng martech stack. Song ngữ, có công cụ thật (HubSpot, Salesforce, GA4, Segment) và ví dụ.</p>`,
  ]]);

const c1 = doc('mjc301-1-1-what-is-martech', '1.1 — What is MarTech? The landscape|||1.1 — MarTech là gì? Bản đồ công cụ',
  'Định nghĩa MarTech; vì sao marketing được công nghệ hoá; martech landscape của chiefmartec; phân biệt MarTech vs AdTech.',
  [[
    `<span class="eyebrow">MJC301 · Chapter 1 · Lesson 1.1</span>
<h2>What is MarTech? The landscape</h2>
<p><strong>MarTech</strong> = the tools marketers use to plan, execute and measure campaigns, and to manage customer data across the journey. Scott Brinker's annual <strong>chiefmartec martech landscape</strong> tracked ~150 tools in 2011 and over <strong>14,000</strong> in recent years — proof that marketing has become a software discipline.</p>
<h3>Why marketing became technology</h3>
<ul>
<li><strong>Digital touchpoints exploded</strong> — web, app, email, social, ads — each emits data that must be captured.</li>
<li><strong>Customers expect relevance</strong> — the right message, right channel, right time — impossible to do by hand at scale.</li>
<li><strong>Marketing must prove ROI</strong> — spend is tied to measurable outcomes, which requires analytics tooling.</li>
</ul>
<h3>MarTech vs AdTech</h3>
<ul>
<li><strong>MarTech</strong> — owns the relationship with <em>known</em> customers: CRM, email, CMS, analytics, automation (e.g. HubSpot, Salesforce, GA4). Focus: retention, engagement, lifecycle.</li>
<li><strong>AdTech</strong> — buys attention from <em>unknown</em> audiences on paid media: DSPs, ad exchanges, DMPs (e.g. Google Ads, The Trade Desk). Focus: reach &amp; acquisition.</li>
</ul>
<p>The line is blurring, but the mental model holds: <strong>AdTech brings strangers in; MarTech turns them into customers.</strong></p>
<div class="callout"><span class="badge">Categories</span> A stack usually spans: Advertising, Content &amp; Experience, Social &amp; Relationships, Commerce &amp; Sales, Data, and Management — the six blocks of Brinker's map.</div>`,
    `<span class="eyebrow">MJC301 · Chương 1 · Bài 1.1</span>
<h2>MarTech là gì? Bản đồ công cụ</h2>
<p><strong>MarTech</strong> = bộ công cụ marketer dùng để lập kế hoạch, triển khai và đo lường chiến dịch, và quản lý dữ liệu khách hàng suốt hành trình. <strong>Martech landscape</strong> hằng năm của chiefmartec (Scott Brinker) từng đếm ~150 công cụ năm 2011 và nay hơn <strong>14.000</strong> — bằng chứng marketing đã thành một ngành phần mềm.</p>
<h3>Vì sao marketing thành công nghệ</h3>
<ul>
<li><strong>Điểm chạm số bùng nổ</strong> — web, app, email, mạng xã hội, quảng cáo — mỗi cái sinh dữ liệu cần được thu.</li>
<li><strong>Khách hàng đòi sự liên quan</strong> — đúng thông điệp, đúng kênh, đúng lúc — không thể làm tay ở quy mô lớn.</li>
<li><strong>Marketing phải chứng minh ROI</strong> — chi tiêu gắn với kết quả đo được, nên cần công cụ phân tích.</li>
</ul>
<h3>MarTech vs AdTech</h3>
<ul>
<li><strong>MarTech</strong> — nắm quan hệ với khách hàng <em>đã biết</em>: CRM, email, CMS, analytics, tự động hoá (vd HubSpot, Salesforce, GA4). Trọng tâm: giữ chân, tương tác, vòng đời.</li>
<li><strong>AdTech</strong> — mua sự chú ý từ đám đông <em>chưa biết</em> trên media trả tiền: DSP, ad exchange, DMP (vd Google Ads, The Trade Desk). Trọng tâm: tiếp cận &amp; thu hút.</li>
</ul>
<p>Ranh giới đang mờ dần, nhưng mô hình tư duy vẫn đúng: <strong>AdTech đưa người lạ vào; MarTech biến họ thành khách hàng.</strong></p>
<div class="callout"><span class="badge">Nhóm công cụ</span> Một stack thường trải: Quảng cáo, Nội dung &amp; Trải nghiệm, Xã hội &amp; Quan hệ, Thương mại &amp; Bán hàng, Dữ liệu, và Quản trị — sáu khối trên bản đồ của Brinker.</div>`,
  ]]);

const c1q = quiz('mjc301-quiz-1', 'Quiz 1 — What is MarTech|||Quiz 1 — MarTech là gì', [
  { id: 'q1', question: 'Điểm khác cốt lõi giữa MarTech và AdTech?', options: ['MarTech chỉ dùng cho B2B', 'MarTech nắm quan hệ khách hàng đã biết; AdTech mua sự chú ý từ đám đông chưa biết', 'AdTech không dùng dữ liệu', 'Chúng là hai tên gọi của cùng một thứ'], correctIndex: 1, explanation: 'MarTech: retention/engagement với khách đã biết; AdTech: reach/acquisition với người lạ.' },
  { id: 'q2', question: '"Martech landscape" nổi tiếng của Scott Brinker (chiefmartec) cho thấy điều gì?', options: ['Số công cụ giảm dần', 'Số công cụ marketing tăng bùng nổ (nay hơn 14.000)', 'Chỉ có 6 công cụ trên thị trường', 'Quảng cáo đã chết'], correctIndex: 1, explanation: 'Từ ~150 (2011) lên hơn 14.000 — marketing đã thành ngành phần mềm.' },
  { id: 'q3', question: 'Đâu KHÔNG phải một trong sáu nhóm chính của bản đồ MarTech?', options: ['Dữ liệu (Data)', 'Nội dung & Trải nghiệm', 'Nhân sự & Tuyển dụng', 'Quản trị (Management)'], correctIndex: 2, explanation: 'Sáu khối: Advertising, Content & Experience, Social & Relationships, Commerce & Sales, Data, Management.' },
]);

const c2 = doc('mjc301-2-1-customer-journey', '2.1 — The customer journey & mapping|||2.1 — Hành trình khách hàng & lập bản đồ',
  'Các giai đoạn: awareness → consideration → purchase → retention → advocacy; điểm chạm, khoảnh khắc sự thật; kỹ thuật journey mapping.',
  [[
    `<span class="eyebrow">MJC301 · Chapter 2 · Lesson 2.1</span>
<h2>The customer journey &amp; mapping</h2>
<p>The <strong>customer journey</strong> is the full path a person takes with a brand across many touchpoints and over time. Lemon &amp; Verhoef (2016) describe it in three phases — <em>pre-purchase, purchase, post-purchase</em> — commonly expanded to five stages:</p>
<pre><code>Awareness    -> becomes aware a need/brand exists
Consideration-> evaluates &amp; compares options
Purchase     -> decides and buys (conversion)
Retention    -> keeps using; onboarding &amp; support
Advocacy     -> recommends, reviews, refers others
</code></pre>
<h3>Touchpoints &amp; moments of truth</h3>
<p>A <strong>touchpoint</strong> is any interaction: an ad, a search result, an email, a support chat, a product page. Some are <strong>moments of truth</strong> — high-stakes points (checkout, first use, a complaint) that disproportionately shape how the customer feels.</p>
<h3>Journey mapping</h3>
<p>A <strong>journey map</strong> is a visual model of the stages, listing at each step: the customer's <em>goal</em>, <em>actions</em>, <em>emotions</em>, the <em>touchpoints/channels</em>, and the <em>pain points</em> to fix. It turns "we do marketing" into "we know exactly where a customer gets stuck." Tools like <strong>Miro</strong>, <strong>Figma</strong> or a CRM's journey builder are used to draw and share them.</p>
<div class="callout"><span class="badge">Why it matters</span> Every later chapter — data, CRM, automation, personalization, measurement — plugs into <em>a specific stage</em> of this journey. The map is the shared language for the whole stack.</div>`,
    `<span class="eyebrow">MJC301 · Chương 2 · Bài 2.1</span>
<h2>Hành trình khách hàng &amp; lập bản đồ</h2>
<p><strong>Hành trình khách hàng</strong> là toàn bộ con đường một người đi cùng thương hiệu qua nhiều điểm chạm và theo thời gian. Lemon &amp; Verhoef (2016) mô tả ba pha — <em>trước mua, khi mua, sau mua</em> — thường mở rộng thành năm giai đoạn:</p>
<pre><code>Nhận biết (Awareness)     -> biết có nhu cầu/thương hiệu
Cân nhắc (Consideration)  -> đánh giá &amp; so sánh lựa chọn
Mua (Purchase)            -> quyết định và mua (chuyển đổi)
Giữ chân (Retention)      -> tiếp tục dùng; onboarding &amp; hỗ trợ
Ủng hộ (Advocacy)         -> giới thiệu, đánh giá, giới thiệu người khác
</code></pre>
<h3>Điểm chạm &amp; khoảnh khắc sự thật</h3>
<p><strong>Điểm chạm</strong> là mọi tương tác: một quảng cáo, kết quả tìm kiếm, email, chat hỗ trợ, trang sản phẩm. Vài điểm là <strong>khoảnh khắc sự thật</strong> — thời điểm quan trọng (thanh toán, lần dùng đầu, một khiếu nại) tác động mạnh đến cảm nhận của khách.</p>
<h3>Lập bản đồ hành trình (journey mapping)</h3>
<p><strong>Bản đồ hành trình</strong> là mô hình trực quan các giai đoạn, mỗi bước liệt kê: <em>mục tiêu</em> của khách, <em>hành động</em>, <em>cảm xúc</em>, <em>điểm chạm/kênh</em>, và <em>điểm đau</em> cần sửa. Nó biến "chúng ta làm marketing" thành "chúng ta biết chính xác khách kẹt ở đâu". Công cụ như <strong>Miro</strong>, <strong>Figma</strong> hay journey builder trong CRM dùng để vẽ và chia sẻ.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Mọi chương sau — dữ liệu, CRM, tự động hoá, cá nhân hoá, đo lường — đều cắm vào <em>một giai đoạn cụ thể</em> của hành trình này. Bản đồ là ngôn ngữ chung cho cả stack.</div>`,
  ]]);

const c2q = quiz('mjc301-quiz-2', 'Quiz 2 — Customer journey|||Quiz 2 — Hành trình khách hàng', [
  { id: 'q1', question: 'Thứ tự đúng của năm giai đoạn hành trình khách hàng?', options: ['Purchase → Awareness → Retention → Advocacy → Consideration', 'Awareness → Consideration → Purchase → Retention → Advocacy', 'Consideration → Purchase → Awareness → Advocacy → Retention', 'Retention → Purchase → Awareness → Consideration → Advocacy'], correctIndex: 1, explanation: 'Nhận biết → Cân nhắc → Mua → Giữ chân → Ủng hộ.' },
  { id: 'q2', question: '"Khoảnh khắc sự thật" (moment of truth) là gì?', options: ['Bất kỳ email nào gửi đi', 'Điểm tương tác quan trọng ảnh hưởng mạnh đến cảm nhận khách (vd thanh toán, lần dùng đầu)', 'Thời điểm chốt ngân sách quảng cáo', 'Lúc báo cáo ROI cho sếp'], correctIndex: 1, explanation: 'Là điểm chạm quyết định, tác động không cân xứng đến trải nghiệm.' },
  { id: 'q3', question: 'Một bản đồ hành trình (journey map) tốt ghi lại điều gì ở mỗi bước?', options: ['Chỉ doanh thu', 'Mục tiêu, hành động, cảm xúc, điểm chạm và điểm đau của khách', 'Chỉ tên nhân viên phụ trách', 'Chỉ mã sản phẩm'], correctIndex: 1, explanation: 'Journey map mô hình hoá goal/action/emotion/touchpoint/pain point để biết khách kẹt ở đâu.' },
]);

const c3 = doc('mjc301-3-1-data-collection', '3.1 — Collecting & managing customer data|||3.1 — Thu thập & quản lý dữ liệu khách hàng',
  'First/second/third-party data; cookie & tracking; Google Analytics 4 (event-based), Google Tag Manager; quyền riêng tư (GDPR, consent).',
  [[
    `<span class="eyebrow">MJC301 · Chapter 3 · Lesson 3.1</span>
<h2>Collecting &amp; managing customer data</h2>
<h3>Three kinds of data</h3>
<ul>
<li><strong>First-party</strong> — data YOU collect directly (site behaviour, purchases, email sign-ups). Most valuable: accurate, consented, uniquely yours.</li>
<li><strong>Second-party</strong> — another company's first-party data, shared via partnership.</li>
<li><strong>Third-party</strong> — aggregated by data brokers and sold. Being deprecated: browsers block third-party cookies, so strategy is shifting to first-party.</li>
</ul>
<h3>Cookies &amp; tracking</h3>
<p>A <strong>cookie</strong> is a small file storing an ID so a site can recognise a returning visitor. <strong>Pixels/tags</strong> (snippets of JavaScript) fire on page loads and clicks to send events to analytics and ad platforms.</p>
<h3>GA4 &amp; Google Tag Manager</h3>
<ul>
<li><strong>Google Analytics 4 (GA4)</strong> — the current standard, built on an <em>event-based</em> model: everything (page_view, scroll, add_to_cart, purchase) is an <strong>event</strong> with parameters, not just pageviews. It maps naturally onto journey stages.</li>
<li><strong>Google Tag Manager (GTM)</strong> — a <em>tag management system</em>: instead of editing site code for every new tag, marketers deploy and version tags/triggers from one dashboard.</li>
</ul>
<h3>Privacy first</h3>
<p>Collection is governed by law (<strong>GDPR</strong>, CCPA) and needs <strong>consent</strong> (a cookie banner / consent mode). "Collect everything" is neither legal nor wise — collect with purpose and permission.</p>
<pre><code>Journey stage   -> example GA4 event
Awareness       -> page_view, session_start
Consideration   -> view_item, add_to_wishlist
Purchase        -> add_to_cart, begin_checkout, purchase
Retention       -> login, feature_used
</code></pre>`,
    `<span class="eyebrow">MJC301 · Chương 3 · Bài 3.1</span>
<h2>Thu thập &amp; quản lý dữ liệu khách hàng</h2>
<h3>Ba loại dữ liệu</h3>
<ul>
<li><strong>First-party (bên thứ nhất)</strong> — dữ liệu BẠN tự thu trực tiếp (hành vi trên web, đơn hàng, đăng ký email). Giá trị nhất: chính xác, có sự đồng ý, độc quyền của bạn.</li>
<li><strong>Second-party (bên thứ hai)</strong> — dữ liệu first-party của công ty khác, chia sẻ qua hợp tác.</li>
<li><strong>Third-party (bên thứ ba)</strong> — dữ liệu gom bởi data broker rồi bán. Đang bị loại bỏ: trình duyệt chặn cookie bên thứ ba, nên chiến lược chuyển sang first-party.</li>
</ul>
<h3>Cookie &amp; tracking</h3>
<p><strong>Cookie</strong> là tệp nhỏ lưu một ID để website nhận ra khách quay lại. <strong>Pixel/tag</strong> (đoạn JavaScript) kích hoạt khi tải trang và click để gửi sự kiện về analytics và nền tảng quảng cáo.</p>
<h3>GA4 &amp; Google Tag Manager</h3>
<ul>
<li><strong>Google Analytics 4 (GA4)</strong> — chuẩn hiện tại, dựa trên mô hình <em>hướng sự kiện</em>: mọi thứ (page_view, scroll, add_to_cart, purchase) là một <strong>event</strong> có tham số, không chỉ là lượt xem trang. Nó khớp tự nhiên với các giai đoạn hành trình.</li>
<li><strong>Google Tag Manager (GTM)</strong> — <em>hệ quản lý tag</em>: thay vì sửa mã web cho từng tag mới, marketer triển khai và quản phiên bản tag/trigger từ một bảng điều khiển.</li>
</ul>
<h3>Ưu tiên quyền riêng tư</h3>
<p>Thu thập bị luật điều chỉnh (<strong>GDPR</strong>, CCPA) và cần <strong>sự đồng ý</strong> (banner cookie / consent mode). "Thu tất cả" vừa phạm luật vừa không khôn ngoan — thu có mục đích và có phép.</p>
<pre><code>Giai đoạn       -> ví dụ event GA4
Nhận biết       -> page_view, session_start
Cân nhắc        -> view_item, add_to_wishlist
Mua             -> add_to_cart, begin_checkout, purchase
Giữ chân        -> login, feature_used
</code></pre>`,
  ]]);

const c3q = quiz('mjc301-quiz-3', 'Quiz 3 — Data & tracking|||Quiz 3 — Dữ liệu & tracking', [
  { id: 'q1', question: 'Vì sao dữ liệu first-party ngày càng quan trọng?', options: ['Vì nó miễn phí mua từ broker', 'Vì chính xác, có sự đồng ý, độc quyền — và cookie bên thứ ba đang bị chặn', 'Vì không cần tuân thủ GDPR', 'Vì nó luôn ẩn danh'], correctIndex: 1, explanation: 'Trình duyệt loại cookie third-party nên first-party (bạn tự thu, có consent) thành trục chiến lược.' },
  { id: 'q2', question: 'GA4 khác Universal Analytics ở mô hình dữ liệu nào?', options: ['Chỉ đếm lượt xem trang', 'Hướng sự kiện (event-based): mọi tương tác là một event có tham số', 'Chỉ đo doanh thu', 'Không thu thập gì'], correctIndex: 1, explanation: 'GA4 dựng trên event model, khớp tự nhiên với các giai đoạn hành trình.' },
  { id: 'q3', question: 'Google Tag Manager (GTM) giải quyết vấn đề gì?', options: ['Thay thế toàn bộ CRM', 'Triển khai & quản phiên bản tag/trigger từ một bảng, không phải sửa mã web mỗi lần', 'Tự viết nội dung quảng cáo', 'Chặn mọi cookie'], correctIndex: 1, explanation: 'GTM là tag management system — quản tag tập trung, có versioning.' },
]);

const c4 = doc('mjc301-4-1-crm-cdp', '4.1 — CRM & customer data platforms|||4.1 — CRM & nền tảng dữ liệu khách hàng',
  'CRM vs CDP vs DMP; hồ sơ khách hàng thống nhất; phân khúc (segmentation); chấm điểm lead (lead scoring); Salesforce, HubSpot, Segment.',
  [[
    `<span class="eyebrow">MJC301 · Chapter 4 · Lesson 4.1</span>
<h2>CRM &amp; customer data platforms</h2>
<h3>Three data systems — don't confuse them</h3>
<ul>
<li><strong>CRM (Customer Relationship Management)</strong> — the system of record for <em>known</em> people and deals: contacts, companies, sales pipeline, support tickets. Examples: <strong>Salesforce</strong>, <strong>HubSpot CRM</strong>, Zoho.</li>
<li><strong>CDP (Customer Data Platform)</strong> — unifies data from every source (web, app, CRM, email, support) into one <strong>persistent, single customer profile</strong>, then makes it available to other tools. Examples: <strong>Segment</strong>, Salesforce Data Cloud, Adobe RT-CDP.</li>
<li><strong>DMP (Data Management Platform)</strong> — mostly <em>anonymous</em> third-party audience data for ad targeting. Fading as third-party cookies die.</li>
</ul>
<p>Mental model: <strong>CRM = who they are &amp; deals; CDP = everything they did, unified; DMP = anonymous ad audiences.</strong></p>
<h3>Segmentation</h3>
<p><strong>Segmentation</strong> splits the audience into groups so messaging can differ: by demographics, behaviour (e.g. "added to cart but didn't buy"), lifecycle stage, or value. Good segments are the input to targeting and automation.</p>
<h3>Lead scoring</h3>
<p><strong>Lead scoring</strong> assigns points to a contact from their attributes (job title, company size) and behaviour (opened emails, visited pricing page). When the score crosses a threshold the lead is "sales-qualified" and handed to sales — so effort focuses on the readiest prospects.</p>
<pre><code>Lead scoring example
 +10  visited /pricing
 +15  requested a demo
 +5   opened 3 emails
 -20  unsubscribed
 => score >= 50  ->  route to sales (MQL -> SQL)
</code></pre>`,
    `<span class="eyebrow">MJC301 · Chương 4 · Bài 4.1</span>
<h2>CRM &amp; nền tảng dữ liệu khách hàng</h2>
<h3>Ba hệ dữ liệu — đừng nhầm lẫn</h3>
<ul>
<li><strong>CRM (Quản lý quan hệ khách hàng)</strong> — hệ ghi nhận người &amp; giao dịch <em>đã biết</em>: liên hệ, công ty, pipeline bán hàng, ticket hỗ trợ. Vd: <strong>Salesforce</strong>, <strong>HubSpot CRM</strong>, Zoho.</li>
<li><strong>CDP (Nền tảng dữ liệu khách hàng)</strong> — hợp nhất dữ liệu từ mọi nguồn (web, app, CRM, email, hỗ trợ) thành một <strong>hồ sơ khách hàng thống nhất, bền vững</strong>, rồi cấp cho các công cụ khác. Vd: <strong>Segment</strong>, Salesforce Data Cloud, Adobe RT-CDP.</li>
<li><strong>DMP (Nền tảng quản lý dữ liệu)</strong> — chủ yếu dữ liệu đối tượng <em>ẩn danh</em> bên thứ ba cho nhắm quảng cáo. Đang mờ nhạt khi cookie third-party biến mất.</li>
</ul>
<p>Mô hình tư duy: <strong>CRM = họ là ai &amp; giao dịch; CDP = mọi thứ họ đã làm, hợp nhất; DMP = đối tượng quảng cáo ẩn danh.</strong></p>
<h3>Phân khúc (segmentation)</h3>
<p><strong>Phân khúc</strong> chia đối tượng thành nhóm để thông điệp khác nhau: theo nhân khẩu, hành vi (vd "thêm giỏ nhưng chưa mua"), giai đoạn vòng đời, hay giá trị. Phân khúc tốt là đầu vào cho nhắm mục tiêu và tự động hoá.</p>
<h3>Chấm điểm lead (lead scoring)</h3>
<p><strong>Lead scoring</strong> gán điểm cho một liên hệ theo thuộc tính (chức danh, quy mô công ty) và hành vi (mở email, xem trang giá). Khi điểm vượt ngưỡng, lead thành "đủ điều kiện bán hàng" và chuyển cho sales — dồn công sức vào người sẵn sàng nhất.</p>
<pre><code>Ví dụ lead scoring
 +10  xem trang /pricing
 +15  yêu cầu demo
 +5   mở 3 email
 -20  huỷ đăng ký
 => điểm >= 50  ->  chuyển cho sales (MQL -> SQL)
</code></pre>`,
  ]]);

const c4q = quiz('mjc301-quiz-4', 'Quiz 4 — CRM & CDP|||Quiz 4 — CRM & CDP', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa CRM và CDP?', options: ['CRM và CDP giống hệt nhau', 'CRM là hệ ghi người & giao dịch đã biết; CDP hợp nhất dữ liệu mọi nguồn thành hồ sơ khách hàng thống nhất', 'CDP chỉ lưu email', 'CRM chỉ dùng cho quảng cáo ẩn danh'], correctIndex: 1, explanation: 'CRM = who + deals; CDP = unified profile từ mọi nguồn cấp cho công cụ khác.' },
  { id: 'q2', question: 'Lead scoring dùng để làm gì?', options: ['Xoá liên hệ cũ', 'Gán điểm theo thuộc tính + hành vi để xác định lead sẵn sàng chuyển cho sales', 'Tính lương nhân viên', 'Đo tốc độ website'], correctIndex: 1, explanation: 'Điểm vượt ngưỡng → MQL thành SQL, dồn nỗ lực vào prospect nóng nhất.' },
  { id: 'q3', question: 'Đâu là ví dụ một phân khúc hành vi (behavioral segment)?', options: ['Tất cả người trên 18 tuổi', 'Người đã "thêm vào giỏ nhưng chưa mua"', 'Toàn bộ danh sách email', 'Người sống ở Hà Nội'], correctIndex: 1, explanation: 'Phân khúc hành vi dựa trên hành động (add-to-cart chưa mua), khác nhân khẩu/địa lý.' },
]);

const c5 = doc('mjc301-5-1-marketing-automation', '5.1 — Marketing automation|||5.1 — Tự động hoá marketing',
  'Email automation, workflow/trigger, drip campaign, lead nurturing; công cụ HubSpot, Marketo, Mailchimp, ActiveCampaign; ví dụ chuỗi welcome & bỏ giỏ.',
  [[
    `<span class="eyebrow">MJC301 · Chapter 5 · Lesson 5.1</span>
<h2>Marketing automation</h2>
<p><strong>Marketing automation</strong> lets software send the right message automatically when a condition is met — so a team of five can nurture a million contacts. Core tools: <strong>HubSpot</strong>, <strong>Marketo</strong> (Adobe), <strong>Mailchimp</strong>, <strong>ActiveCampaign</strong>.</p>
<h3>Building blocks</h3>
<ul>
<li><strong>Trigger</strong> — the event that starts a flow (signed up, abandoned cart, hit a lead score, a date).</li>
<li><strong>Workflow</strong> — the branching logic: <em>if/then</em> steps, delays, and actions (send email, add tag, update CRM, notify sales).</li>
<li><strong>Drip campaign</strong> — a pre-set sequence sent on a schedule ("drip" over days/weeks).</li>
<li><strong>Lead nurturing</strong> — using drips + behaviour to move a contact along the journey toward purchase.</li>
</ul>
<h3>Two classic workflows</h3>
<pre><code>Welcome series (trigger: newsletter sign-up)
  Day 0  -> welcome + what to expect
  Day 2  -> best content / social proof
  Day 5  -> soft offer / trial
  (branch) opened all -> raise lead score -> sales

Abandoned cart (trigger: begin_checkout, no purchase in 1h)
  +1h   -> "You left something behind"
  +24h  -> reminder + reviews
  +48h  -> incentive (free shipping)
</code></pre>
<div class="callout"><span class="badge">Journey link</span> Automation is where the map becomes motion: each workflow targets one stage (welcome = onboarding/retention; cart = purchase). Measure by conversion, not emails sent.</div>`,
    `<span class="eyebrow">MJC301 · Chương 5 · Bài 5.1</span>
<h2>Tự động hoá marketing</h2>
<p><strong>Tự động hoá marketing</strong> để phần mềm tự gửi đúng thông điệp khi thoả một điều kiện — nhờ đó nhóm năm người nuôi dưỡng được cả triệu liên hệ. Công cụ chính: <strong>HubSpot</strong>, <strong>Marketo</strong> (Adobe), <strong>Mailchimp</strong>, <strong>ActiveCampaign</strong>.</p>
<h3>Các khối cơ bản</h3>
<ul>
<li><strong>Trigger (kích hoạt)</strong> — sự kiện khởi động một luồng (đăng ký, bỏ giỏ, đạt lead score, một mốc ngày).</li>
<li><strong>Workflow (luồng)</strong> — logic phân nhánh: bước <em>nếu/thì</em>, độ trễ, và hành động (gửi email, gắn tag, cập nhật CRM, báo sales).</li>
<li><strong>Drip campaign</strong> — chuỗi định sẵn gửi theo lịch ("nhỏ giọt" qua ngày/tuần).</li>
<li><strong>Lead nurturing (nuôi dưỡng lead)</strong> — dùng drip + hành vi để đẩy liên hệ dọc hành trình đến lúc mua.</li>
</ul>
<h3>Hai luồng kinh điển</h3>
<pre><code>Chuỗi welcome (trigger: đăng ký nhận tin)
  Ngày 0  -> chào mừng + cho biết sẽ nhận gì
  Ngày 2  -> nội dung hay / bằng chứng xã hội
  Ngày 5  -> ưu đãi nhẹ / dùng thử
  (nhánh) mở hết -> tăng lead score -> sales

Bỏ giỏ hàng (trigger: begin_checkout, 1h chưa mua)
  +1h   -> "Bạn còn quên món này"
  +24h  -> nhắc lại + đánh giá
  +48h  -> ưu đãi (miễn phí ship)
</code></pre>
<div class="callout"><span class="badge">Liên kết hành trình</span> Tự động hoá là lúc bản đồ chuyển động: mỗi workflow nhắm một giai đoạn (welcome = onboarding/giữ chân; giỏ = mua). Đo bằng chuyển đổi, không phải số email gửi.</div>`,
  ]]);

const c5q = quiz('mjc301-quiz-5', 'Quiz 5 — Marketing automation|||Quiz 5 — Tự động hoá marketing', [
  { id: 'q1', question: 'Trong một workflow tự động hoá, "trigger" là gì?', options: ['Báo cáo cuối chiến dịch', 'Sự kiện khởi động luồng (vd đăng ký, bỏ giỏ, đạt lead score)', 'Ngân sách quảng cáo', 'Một loại cookie'], correctIndex: 1, explanation: 'Trigger là điều kiện/sự kiện bắt đầu chuỗi hành động.' },
  { id: 'q2', question: '"Drip campaign" nghĩa là gì?', options: ['Gửi một email duy nhất cho tất cả', 'Chuỗi thông điệp định sẵn gửi nhỏ giọt theo lịch qua ngày/tuần', 'Xoá danh sách email', 'Quảng cáo trả tiền theo click'], correctIndex: 1, explanation: 'Drip = sequence gửi theo lịch, nền của lead nurturing.' },
  { id: 'q3', question: 'Nên đo hiệu quả một workflow tự động hoá chủ yếu bằng?', options: ['Số email đã gửi', 'Tỷ lệ chuyển đổi (conversion) theo mục tiêu của giai đoạn', 'Số công cụ trong stack', 'Kích thước file HTML email'], correctIndex: 1, explanation: 'Đo bằng chuyển đổi/kết quả, không phải số email gửi ra.' },
]);

const c6 = doc('mjc301-6-1-personalization-ai', '6.1 — Personalization & AI in marketing|||6.1 — Cá nhân hoá & AI trong marketing',
  'Personalization engine; recommendation systems; chatbot; phân tích dự đoán (predictive, churn/CLV); generative AI cho nội dung; ranh giới đạo đức.',
  [[
    `<span class="eyebrow">MJC301 · Chapter 6 · Lesson 6.1</span>
<h2>Personalization &amp; AI in marketing</h2>
<h3>Personalization</h3>
<p><strong>Personalization</strong> tailors content, offers and timing to the individual using their data. A <strong>personalization engine</strong> (built into HubSpot, Salesforce Marketing Cloud, Dynamic Yield) swaps in the right hero image, product or subject line per segment or per person in real time.</p>
<h3>Recommendation systems</h3>
<p><strong>Recommendation engines</strong> ("customers who bought X also bought Y") use collaborative filtering and behaviour to suggest the next item — Amazon and Netflix are the canonical examples; the same tech powers ecommerce upsell blocks.</p>
<h3>Chatbots &amp; conversational marketing</h3>
<p><strong>Chatbots</strong> (Drift, Intercom, and now LLM-based bots) answer questions, qualify leads and book meetings 24/7 — moving people through consideration without a human on every chat.</p>
<h3>Predictive analytics</h3>
<p><strong>Predictive models</strong> use historical data to forecast: <em>churn</em> (who will leave), <em>CLV</em> (customer lifetime value), <em>propensity to buy</em>, and best send-time. Marketers then act <em>before</em> the event.</p>
<h3>Generative AI</h3>
<p><strong>Generative AI</strong> (e.g. GPT-class models, Jasper, Copy.ai) drafts copy, subject lines, images and variants at scale — a force multiplier for content and A/B testing.</p>
<div class="callout"><span class="badge">Do it responsibly</span> Personalization needs consent and restraint — over-personalization feels "creepy", and AI output must be checked for accuracy, bias and brand fit. Powerful is not the same as appropriate.</div>`,
    `<span class="eyebrow">MJC301 · Chương 6 · Bài 6.1</span>
<h2>Cá nhân hoá &amp; AI trong marketing</h2>
<h3>Cá nhân hoá</h3>
<p><strong>Cá nhân hoá</strong> điều chỉnh nội dung, ưu đãi và thời điểm cho từng người dựa trên dữ liệu của họ. Một <strong>personalization engine</strong> (có trong HubSpot, Salesforce Marketing Cloud, Dynamic Yield) thay đúng ảnh hero, sản phẩm hay dòng tiêu đề theo phân khúc hoặc theo từng người, theo thời gian thực.</p>
<h3>Hệ gợi ý (recommendation)</h3>
<p><strong>Recommendation engine</strong> ("người mua X cũng mua Y") dùng lọc cộng tác và hành vi để gợi ý món tiếp theo — Amazon và Netflix là ví dụ kinh điển; cùng công nghệ đó chạy khối upsell trên ecommerce.</p>
<h3>Chatbot &amp; marketing hội thoại</h3>
<p><strong>Chatbot</strong> (Drift, Intercom, và nay bot dựa trên LLM) trả lời câu hỏi, sàng lọc lead và đặt lịch 24/7 — đẩy khách qua giai đoạn cân nhắc mà không cần người trực mọi cuộc chat.</p>
<h3>Phân tích dự đoán (predictive)</h3>
<p><strong>Mô hình dự đoán</strong> dùng dữ liệu lịch sử để dự báo: <em>churn</em> (ai sẽ rời bỏ), <em>CLV</em> (giá trị vòng đời khách hàng), <em>xu hướng mua</em>, và thời điểm gửi tốt nhất. Marketer hành động <em>trước</em> khi sự việc xảy ra.</p>
<h3>Generative AI (AI tạo sinh)</h3>
<p><strong>Generative AI</strong> (vd mô hình lớp GPT, Jasper, Copy.ai) soạn nội dung, tiêu đề, hình ảnh và biến thể ở quy mô lớn — nhân đôi sức cho sản xuất nội dung và A/B testing.</p>
<div class="callout"><span class="badge">Làm có trách nhiệm</span> Cá nhân hoá cần sự đồng ý và chừng mực — cá nhân hoá quá đà gây cảm giác "rợn người", và đầu ra AI phải được kiểm độ chính xác, thiên lệch và độ hợp thương hiệu. Mạnh không đồng nghĩa với phù hợp.</div>`,
  ]]);

const c6q = quiz('mjc301-quiz-6', 'Quiz 6 — Personalization & AI|||Quiz 6 — Cá nhân hoá & AI', [
  { id: 'q1', question: 'Phân tích dự đoán (predictive analytics) trong marketing điển hình dự báo điều gì?', options: ['Màu logo nên dùng', 'Churn, CLV, xu hướng mua, thời điểm gửi tốt nhất — để hành động trước', 'Giá cổ phiếu công ty', 'Số nhân viên cần tuyển'], correctIndex: 1, explanation: 'Predictive model dự báo churn/CLV/propensity để can thiệp sớm.' },
  { id: 'q2', question: 'Một hệ gợi ý (recommendation engine) hoạt động dựa trên?', options: ['Chỉ ngày trong tuần', 'Lọc cộng tác & hành vi ("người mua X cũng mua Y")', 'Màu nền website', 'Số lượng email gửi'], correctIndex: 1, explanation: 'Collaborative filtering + hành vi gợi món tiếp theo (Amazon/Netflix).' },
  { id: 'q3', question: 'Rủi ro đáng lưu ý nhất của cá nhân hoá & generative AI là gì?', options: ['Chúng luôn miễn phí', 'Cá nhân hoá quá đà gây "rợn người", và đầu ra AI có thể sai/thiên lệch nếu không kiểm', 'Chúng không dùng được dữ liệu', 'Chúng chỉ chạy trên giấy'], correctIndex: 1, explanation: 'Cần consent, chừng mực, và kiểm tính chính xác/thiên lệch/độ hợp thương hiệu.' },
]);

const c7 = doc('mjc301-7-1-measurement-attribution', '7.1 — Measuring & analyzing the journey|||7.1 — Đo lường & phân tích hành trình',
  'Mô hình attribution (last/first-click, linear, time-decay, data-driven); phân tích phễu (funnel); cohort; A/B testing; KPI theo giai đoạn.',
  [[
    `<span class="eyebrow">MJC301 · Chapter 7 · Lesson 7.1</span>
<h2>Measuring &amp; analyzing the journey</h2>
<h3>Attribution — who gets the credit?</h3>
<p>A customer touches many channels before buying. <strong>Attribution models</strong> decide how credit for the conversion is split:</p>
<ul>
<li><strong>Last-click</strong> — 100% to the final touch. Simple, but ignores earlier influence.</li>
<li><strong>First-click</strong> — 100% to the first touch (awareness).</li>
<li><strong>Linear</strong> — equal credit to every touch.</li>
<li><strong>Time-decay</strong> — more credit to touches nearer the purchase.</li>
<li><strong>Data-driven (GA4)</strong> — an algorithm assigns credit from actual patterns.</li>
</ul>
<h3>Funnel analytics</h3>
<p>A <strong>funnel</strong> tracks how many people pass each journey stage and where they drop off (e.g. 1000 view → 300 add-to-cart → 120 checkout → 90 buy). The biggest drop is the biggest opportunity.</p>
<h3>Cohort analysis</h3>
<p><strong>Cohort analysis</strong> groups users by a shared start (e.g. "signed up in March") and tracks their behaviour over time — the honest way to measure <em>retention</em> and whether changes actually help.</p>
<h3>A/B testing</h3>
<p><strong>A/B testing</strong> shows variant A vs B to random halves and keeps the winner by a metric — the scientific method for marketing decisions (subject lines, landing pages, CTAs). Tools: <strong>Optimizely</strong>, <strong>VWO</strong>, GA4 experiments.</p>
<pre><code>KPIs by stage
 Awareness    -> reach, impressions, traffic
 Consideration-> CTR, time on site, leads
 Purchase     -> conversion rate, CAC, AOV
 Retention    -> churn, repeat rate, NPS
 Advocacy     -> referrals, reviews, CLV
</code></pre>`,
    `<span class="eyebrow">MJC301 · Chương 7 · Bài 7.1</span>
<h2>Đo lường &amp; phân tích hành trình</h2>
<h3>Attribution — công thuộc về ai?</h3>
<p>Một khách chạm nhiều kênh trước khi mua. <strong>Mô hình attribution</strong> quyết định chia công cho chuyển đổi thế nào:</p>
<ul>
<li><strong>Last-click</strong> — 100% cho điểm chạm cuối. Đơn giản nhưng bỏ qua ảnh hưởng trước đó.</li>
<li><strong>First-click</strong> — 100% cho điểm chạm đầu (nhận biết).</li>
<li><strong>Linear</strong> — chia đều cho mọi điểm chạm.</li>
<li><strong>Time-decay</strong> — điểm gần lúc mua được nhiều công hơn.</li>
<li><strong>Data-driven (GA4)</strong> — thuật toán gán công theo mẫu hành vi thực.</li>
</ul>
<h3>Phân tích phễu (funnel)</h3>
<p><strong>Phễu</strong> đo bao nhiêu người qua mỗi giai đoạn và rơi rớt ở đâu (vd 1000 xem → 300 thêm giỏ → 120 checkout → 90 mua). Chỗ rớt lớn nhất là cơ hội lớn nhất.</p>
<h3>Phân tích cohort</h3>
<p><strong>Cohort analysis</strong> nhóm người dùng theo mốc bắt đầu chung (vd "đăng ký tháng 3") và theo dõi hành vi theo thời gian — cách trung thực để đo <em>giữ chân</em> và xem thay đổi có thực sự cải thiện.</p>
<h3>A/B testing</h3>
<p><strong>A/B testing</strong> cho một nửa ngẫu nhiên thấy bản A, nửa kia bản B, rồi giữ bản thắng theo một chỉ số — phương pháp khoa học cho quyết định marketing (tiêu đề, landing page, CTA). Công cụ: <strong>Optimizely</strong>, <strong>VWO</strong>, thử nghiệm GA4.</p>
<pre><code>KPI theo giai đoạn
 Nhận biết   -> reach, impressions, traffic
 Cân nhắc    -> CTR, thời gian trên site, số lead
 Mua         -> tỷ lệ chuyển đổi, CAC, AOV
 Giữ chân    -> churn, tỷ lệ mua lại, NPS
 Ủng hộ      -> giới thiệu, đánh giá, CLV
</code></pre>`,
  ]]);

const c7q = quiz('mjc301-quiz-7', 'Quiz 7 — Measurement & attribution|||Quiz 7 — Đo lường & attribution', [
  { id: 'q1', question: 'Mô hình attribution "last-click" gán công thế nào?', options: ['Chia đều mọi điểm chạm', '100% cho điểm chạm cuối trước chuyển đổi', '100% cho điểm chạm đầu tiên', 'Theo thuật toán học máy'], correctIndex: 1, explanation: 'Last-click dồn toàn bộ công cho touch cuối, bỏ qua ảnh hưởng trước.' },
  { id: 'q2', question: 'Phân tích cohort đặc biệt hữu ích để đo điều gì?', options: ['Kích thước ảnh', 'Giữ chân (retention) theo thời gian của nhóm có mốc bắt đầu chung', 'Ngân sách quảng cáo tổng', 'Số tag trong GTM'], correctIndex: 1, explanation: 'Cohort nhóm theo start chung, theo dõi hành vi/retention theo thời gian.' },
  { id: 'q3', question: 'A/B testing về bản chất là gì?', options: ['Gửi cùng một bản cho mọi người', 'Cho hai nửa ngẫu nhiên thấy hai biến thể rồi giữ bản thắng theo một chỉ số', 'Xoá dữ liệu cũ', 'Một loại mô hình attribution'], correctIndex: 1, explanation: 'A/B test là thí nghiệm ngẫu nhiên hoá để chọn biến thể tốt hơn.' },
]);

const c8 = doc('mjc301-8-1-martech-stack', '8.1 — Building a martech stack|||8.1 — Xây dựng martech stack',
  'Chọn công cụ theo nhu cầu; tích hợp qua API/webhook & iPaaS; đo ROI của martech; quản trị dữ liệu (governance) & bảo mật, tuân thủ.',
  [[
    `<span class="eyebrow">MJC301 · Chapter 8 · Lesson 8.1</span>
<h2>Building a martech stack</h2>
<p>A <strong>martech stack</strong> is the set of tools a company uses together across the journey. More tools is not better — a good stack is <em>integrated, used, and justified</em>.</p>
<h3>Choosing tools</h3>
<ul>
<li>Start from <strong>needs &amp; the journey</strong>, not the shiniest tool. What stage hurts?</li>
<li>Check <strong>integration</strong> — does it connect to your CRM/CDP? Native connectors beat glue code.</li>
<li>Weigh <strong>total cost</strong>, learning curve, data ownership and whether the team will actually use it.</li>
</ul>
<h3>Integration</h3>
<p>Tools talk to each other via <strong>APIs</strong> and <strong>webhooks</strong>; a <strong>CDP</strong> or an <strong>iPaaS</strong> (Zapier, Make, Segment) acts as the connective tissue so data flows instead of sitting in silos. The stack is only as strong as its integrations.</p>
<h3>ROI of martech</h3>
<p>Justify spend: <strong>ROI = (value gained − cost) / cost</strong>. Value includes revenue lifted, hours saved by automation, and better retention — not just "we bought a tool".</p>
<h3>Governance, security &amp; compliance</h3>
<ul>
<li><strong>Data governance</strong> — who owns which data, quality rules, definitions everyone agrees on.</li>
<li><strong>Security</strong> — access control, encryption, minimal collection; a breach of customer data is catastrophic.</li>
<li><strong>Compliance</strong> — GDPR/CCPA: consent, the right to be forgotten, and honoring opt-outs across every tool.</li>
</ul>
<div class="callout"><span class="badge">The takeaway</span> The best stack is the smallest one that serves the journey end-to-end, keeps data unified and safe, and pays for itself. Buy for the problem, integrate everything, measure the return.</div>`,
    `<span class="eyebrow">MJC301 · Chương 8 · Bài 8.1</span>
<h2>Xây dựng martech stack</h2>
<p><strong>Martech stack</strong> là tập công cụ một công ty dùng phối hợp trên suốt hành trình. Nhiều công cụ hơn không phải tốt hơn — stack tốt là thứ <em>được tích hợp, được dùng, và được biện minh</em>.</p>
<h3>Chọn công cụ</h3>
<ul>
<li>Bắt đầu từ <strong>nhu cầu &amp; hành trình</strong>, không phải công cụ hào nhoáng nhất. Giai đoạn nào đang đau?</li>
<li>Kiểm <strong>khả năng tích hợp</strong> — nó nối được với CRM/CDP của bạn không? Connector gốc hơn hẳn mã chắp vá.</li>
<li>Cân <strong>tổng chi phí</strong>, độ khó học, quyền sở hữu dữ liệu và liệu nhóm có thực sự dùng.</li>
</ul>
<h3>Tích hợp</h3>
<p>Công cụ nói chuyện với nhau qua <strong>API</strong> và <strong>webhook</strong>; một <strong>CDP</strong> hoặc <strong>iPaaS</strong> (Zapier, Make, Segment) đóng vai mô liên kết để dữ liệu chảy thay vì nằm ốc đảo. Stack chỉ mạnh bằng các tích hợp của nó.</p>
<h3>ROI của martech</h3>
<p>Biện minh chi tiêu: <strong>ROI = (giá trị thu được − chi phí) / chi phí</strong>. Giá trị gồm doanh thu tăng, giờ công tiết kiệm nhờ tự động hoá, và giữ chân tốt hơn — không chỉ là "đã mua một công cụ".</p>
<h3>Quản trị, bảo mật &amp; tuân thủ</h3>
<ul>
<li><strong>Quản trị dữ liệu (governance)</strong> — ai sở hữu dữ liệu nào, quy tắc chất lượng, định nghĩa mọi người thống nhất.</li>
<li><strong>Bảo mật</strong> — kiểm soát truy cập, mã hoá, thu tối thiểu; lộ dữ liệu khách hàng là thảm hoạ.</li>
<li><strong>Tuân thủ</strong> — GDPR/CCPA: sự đồng ý, quyền được quên, và tôn trọng opt-out trên mọi công cụ.</li>
</ul>
<div class="callout"><span class="badge">Đúc kết</span> Stack tốt nhất là stack nhỏ nhất phục vụ trọn hành trình, giữ dữ liệu thống nhất và an toàn, và tự trả được chi phí. Mua vì vấn đề, tích hợp mọi thứ, đo lại lợi ích.</div>`,
  ]]);

const c8q = quiz('mjc301-quiz-8', 'Quiz 8 — Martech stack|||Quiz 8 — Martech stack', [
  { id: 'q1', question: 'Nguyên tắc đúng khi chọn công cụ cho martech stack?', options: ['Càng nhiều công cụ càng tốt', 'Bắt đầu từ nhu cầu & hành trình, ưu tiên khả năng tích hợp và việc nhóm sẽ dùng', 'Chọn công cụ mới ra mắt nhất', 'Chỉ chọn công cụ đắt nhất'], correctIndex: 1, explanation: 'Stack tốt = được tích hợp, được dùng, được biện minh — mua vì vấn đề.' },
  { id: 'q2', question: 'Vai trò của API/webhook và iPaaS (Zapier, Segment) trong stack?', options: ['Thay thế toàn bộ marketer', 'Là mô liên kết để dữ liệu chảy giữa công cụ thay vì nằm ốc đảo', 'Tăng giá công cụ', 'Xoá dữ liệu định kỳ'], correctIndex: 1, explanation: 'Integration là mô liên kết; stack chỉ mạnh bằng các tích hợp.' },
  { id: 'q3', question: 'Trong quản trị martech, "tuân thủ" (GDPR/CCPA) đòi hỏi gì?', options: ['Thu thập càng nhiều dữ liệu càng tốt', 'Sự đồng ý, quyền được quên, và tôn trọng opt-out trên mọi công cụ', 'Bỏ qua bảo mật', 'Chỉ áp dụng cho quảng cáo'], correctIndex: 1, explanation: 'Compliance = consent + right to be forgotten + honor opt-out xuyên suốt stack.' },
]);

const taiLieu = doc('mjc301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách chuẩn (Brinker, Kingsnorth, Lemon & Verhoef), khoá học miễn phí (HubSpot Academy, Google Analytics Academy), martech landscape, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">MJC301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn MarTech &amp; customer journey orchestration — the landscape, data, CRM/CDP, automation, personalization and measurement — in one place. All resources below are free or legally accessible.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.scottbrinker.com/hacking-marketing/" target="_blank" rel="noopener">Scott Brinker — <em>Hacking Marketing</em></a> (agile marketing &amp; software mindset)</li>
<li><a href="https://www.koganpage.com/product/digital-marketing-strategy-9781398605978" target="_blank" rel="noopener">Simon Kingsnorth — <em>Digital Marketing Strategy</em></a></li>
<li><a href="https://journals.sagepub.com/doi/10.1509/jm.15.0420" target="_blank" rel="noopener">Lemon &amp; Verhoef — <em>Understanding Customer Experience Throughout the Customer Journey</em> (JM 2016)</a></li>
</ul>
<h3>🌐 Free courses &amp; certifications</h3>
<ul>
<li><a href="https://academy.hubspot.com/" target="_blank" rel="noopener">HubSpot Academy</a> — free courses on inbound, CRM, email &amp; automation</li>
<li><a href="https://skillshop.exceedlms.com/student/catalog" target="_blank" rel="noopener">Google Analytics Academy / Skillshop</a> — GA4 &amp; measurement</li>
<li><a href="https://chiefmartec.com/" target="_blank" rel="noopener">chiefmartec.com</a> — the annual martech landscape &amp; commentary</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot</a> — marketing, CRM &amp; automation tutorials</li>
<li><a href="https://www.youtube.com/@GoogleAnalytics" target="_blank" rel="noopener">Google Analytics</a> — official GA4 how-tos</li>
</ul>
<h3>🛠️ Tools to try (free tiers)</h3>
<ul>
<li><a href="https://www.hubspot.com/products/crm" target="_blank" rel="noopener">HubSpot CRM</a> — free CRM, email &amp; workflows</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — free web/app analytics</li>
<li><a href="https://segment.com/" target="_blank" rel="noopener">Segment</a> — CDP with a developer free tier</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what MarTech is, MarTech vs AdTech, and the five journey stages.</li>
<li><strong>Data core</strong> — first-party data, GA4 events &amp; GTM; set up analytics on a real site.</li>
<li><strong>Engage</strong> — CRM/CDP, segmentation, automation workflows and lead nurturing in HubSpot.</li>
<li><strong>Optimize &amp; scale</strong> — attribution, A/B testing, personalization/AI, then design a small integrated stack.</li>
</ol></div>`,
    `<span class="eyebrow">MJC301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học MarTech &amp; điều phối hành trình khách hàng — bản đồ công cụ, dữ liệu, CRM/CDP, tự động hoá, cá nhân hoá và đo lường — gom về một chỗ. Mọi nguồn dưới đây miễn phí hoặc truy cập hợp pháp.</p>
<h3>📗 Sách chuẩn</h3>
<ul>
<li><a href="https://www.scottbrinker.com/hacking-marketing/" target="_blank" rel="noopener">Scott Brinker — <em>Hacking Marketing</em></a> (tư duy agile &amp; phần mềm trong marketing)</li>
<li><a href="https://www.koganpage.com/product/digital-marketing-strategy-9781398605978" target="_blank" rel="noopener">Simon Kingsnorth — <em>Digital Marketing Strategy</em></a></li>
<li><a href="https://journals.sagepub.com/doi/10.1509/jm.15.0420" target="_blank" rel="noopener">Lemon &amp; Verhoef — <em>Understanding Customer Experience Throughout the Customer Journey</em> (JM 2016)</a></li>
</ul>
<h3>🌐 Khoá học &amp; chứng chỉ miễn phí</h3>
<ul>
<li><a href="https://academy.hubspot.com/" target="_blank" rel="noopener">HubSpot Academy</a> — khoá miễn phí về inbound, CRM, email &amp; tự động hoá</li>
<li><a href="https://skillshop.exceedlms.com/student/catalog" target="_blank" rel="noopener">Google Analytics Academy / Skillshop</a> — GA4 &amp; đo lường</li>
<li><a href="https://chiefmartec.com/" target="_blank" rel="noopener">chiefmartec.com</a> — bản đồ martech landscape hằng năm &amp; bình luận</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot</a> — hướng dẫn marketing, CRM &amp; tự động hoá</li>
<li><a href="https://www.youtube.com/@GoogleAnalytics" target="_blank" rel="noopener">Google Analytics</a> — hướng dẫn GA4 chính thức</li>
</ul>
<h3>🛠️ Công cụ nên thử (gói miễn phí)</h3>
<ul>
<li><a href="https://www.hubspot.com/products/crm" target="_blank" rel="noopener">HubSpot CRM</a> — CRM, email &amp; workflow miễn phí</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — phân tích web/app miễn phí</li>
<li><a href="https://segment.com/" target="_blank" rel="noopener">Segment</a> — CDP có gói dev miễn phí</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — MarTech là gì, MarTech vs AdTech, và năm giai đoạn hành trình.</li>
<li><strong>Lõi dữ liệu</strong> — first-party data, event GA4 &amp; GTM; cài analytics trên một site thật.</li>
<li><strong>Tương tác</strong> — CRM/CDP, phân khúc, workflow tự động hoá và nuôi dưỡng lead trong HubSpot.</li>
<li><strong>Tối ưu &amp; mở rộng</strong> — attribution, A/B testing, cá nhân hoá/AI, rồi thiết kế một stack nhỏ tích hợp.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'MJC301',
    slug: 'mjc301-martech-customer-journey-orchestration',
    title: 'MarTech & Customer Journey Orchestration',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MJC301.webp',
    shortDescription: 'MarTech & the customer journey — the martech landscape, journey stages, data (GA4, first-party), CRM/CDP, automation, personalization & AI, attribution and building a stack. Bilingual, real tools, quizzes.|||Công nghệ marketing & hành trình khách hàng — martech landscape, các giai đoạn, dữ liệu (GA4), CRM/CDP, tự động hoá, cá nhân hoá & AI, attribution và dựng stack. Song ngữ, công cụ thật, quiz.',
    description: 'Môn <strong>MJC301 — MarTech &amp; Customer Journey</strong> (Công nghệ marketing và hành trình khách hàng, kỳ 5, khối Công nghệ Truyền thông) dạy cách marketing hiện đại chạy trên <strong>công nghệ &amp; dữ liệu</strong>, xoay quanh trục <strong>hành trình khách hàng</strong>. Từ <strong>MarTech là gì &amp; martech landscape</strong> → <strong>các giai đoạn hành trình</strong> → <strong>thu thập &amp; quản lý dữ liệu</strong> (GA4, tag) → <strong>CRM &amp; CDP</strong> → <strong>tự động hoá</strong> → <strong>cá nhân hoá &amp; AI</strong> → <strong>đo lường &amp; attribution</strong> → <strong>dựng martech stack</strong>. Song ngữ, dùng công cụ thật (HubSpot, Salesforce, GA4, Segment), có ví dụ và quiz mỗi chương. Tài liệu: Brinker, Kingsnorth, Lemon &amp; Verhoef, HubSpot &amp; Google Analytics Academy.',
    whatYouLearn: 'Phân biệt MarTech vs AdTech &amp; đọc martech landscape; năm giai đoạn hành trình &amp; lập journey map; first/second/third-party data, cookie, GA4 event-based &amp; GTM; CRM vs CDP vs DMP, phân khúc &amp; lead scoring; email automation, workflow, drip &amp; lead nurturing; personalization engine, recommendation, chatbot, predictive &amp; generative AI; mô hình attribution, funnel, cohort &amp; A/B testing; chọn công cụ, tích hợp API, ROI, governance &amp; bảo mật dữ liệu.',
    requirements: 'Không cần nền kỹ thuật sâu. Nên có tài khoản Google (để thử GA4) và một tài khoản HubSpot/Mailchimp miễn phí để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chuẩn, HubSpot & Google Analytics Academy, martech landscape, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'MarTech là gì, marketing = công nghệ + dữ liệu, trục hành trình.', lessons: [intro] },
    { title: 'Chương 1 — MarTech là gì|||Chapter 1 — What is MarTech', description: 'Martech landscape, vì sao công nghệ hoá, MarTech vs AdTech.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hành trình khách hàng|||Chapter 2 — Customer journey', description: 'Awareness→advocacy, điểm chạm, journey mapping.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thu thập & quản lý dữ liệu|||Chapter 3 — Data collection', description: 'First/second/third-party, cookie, GA4, tag manager.', lessons: [c3, c3q] },
    { title: 'Chương 4 — CRM & CDP|||Chapter 4 — CRM & CDP', description: 'CRM, CDP, DMP, phân khúc, lead scoring.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tự động hoá marketing|||Chapter 5 — Marketing automation', description: 'Email automation, workflow, drip, lead nurturing.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cá nhân hoá & AI|||Chapter 6 — Personalization & AI', description: 'Personalization, recommendation, chatbot, predictive, generative AI.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đo lường & phân tích|||Chapter 7 — Measurement & analytics', description: 'Attribution, funnel, cohort, A/B testing.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xây dựng martech stack|||Chapter 8 — Building a stack', description: 'Chọn công cụ, tích hợp API, ROI, governance & bảo mật.', lessons: [c8, c8q] },
  ],
};
