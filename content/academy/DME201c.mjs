/**
 * DME201c — Digital Marketing and E-commerce (Marketing số & Thương mại điện tử).
 * Khối Công nghệ Truyền thông FPTU, Kỳ 6. Song ngữ VI+EN, ví dụ thương hiệu/sàn
 * thật (VN: Shopee/Tiki/Biti's), quiz mỗi chương. 8 chương.
 * Sách: Chaffey & Ellis-Chadwick "Digital Marketing"; Laudon & Traver
 * "E-commerce: Business, Technology, Society"; Kingsnorth "Digital Marketing
 * Strategy". Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "&"→&amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dme201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế, chứng chỉ miễn phí (Google/Meta), nền tảng thực hành, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">DME201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Digital Marketing &amp; E-commerce</strong> — from strategy and the customer journey to running a real online store — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal, industry-standard resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DME201c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (international standard)</h3>
<ul>
<li><em>Digital Marketing</em> — Dave Chaffey &amp; Fiona Ellis-Chadwick (Pearson). The RACE framework used throughout this course.</li>
<li><em>E-commerce: Business, Technology, Society</em> — Kenneth Laudon &amp; Carol Traver (Pearson).</li>
<li><em>Digital Marketing Strategy: An Integrated Approach</em> — Simon Kingsnorth (Kogan Page).</li>
</ul>
<h3>🌐 Free official training &amp; certificates</h3>
<ul>
<li><a href="https://grow.google/intl/en/courses-and-tools/" target="_blank" rel="noopener">Google Digital Garage / Skillshop</a> — Fundamentals of Digital Marketing, Google Ads &amp; Analytics (GA4) certificates.</li>
<li><a href="https://www.facebook.com/business/learn" target="_blank" rel="noopener">Meta Blueprint</a> — Facebook &amp; Instagram advertising.</li>
<li><a href="https://www.shopify.com/learn" target="_blank" rel="noopener">Shopify Learn / Help Center</a> — build and run a store end to end.</li>
</ul>
<h3>🛠️ Hands-on platforms</h3>
<ul>
<li><a href="https://www.shopify.com" target="_blank" rel="noopener">Shopify</a> — build your own store (14-day trial).</li>
<li><a href="https://analytics.google.com" target="_blank" rel="noopener">Google Analytics 4</a> &amp; <a href="https://ads.google.com" target="_blank" rel="noopener">Google Ads</a>.</li>
<li>VN marketplaces to study: <a href="https://shopee.vn" target="_blank" rel="noopener">Shopee</a>, <a href="https://tiki.vn" target="_blank" rel="noopener">Tiki</a>, <a href="https://www.lazada.vn" target="_blank" rel="noopener">Lazada</a>.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — what digital marketing &amp; e-commerce are, the digital ecosystem, business models (B2C/B2B/C2C/D2C).</li>
<li><strong>Strategy</strong> — RACE, the customer journey and funnel; plan before you spend.</li>
<li><strong>Channels &amp; store</strong> — website/CRO, SEO &amp; SEM, social &amp; content, then build &amp; operate a store.</li>
<li><strong>Measure &amp; optimize</strong> — GA4, KPIs (conversion/AOV/CLV), A/B testing, data ethics.</li>
</ol></div>`,
    `<span class="eyebrow">DME201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Marketing số &amp; Thương mại điện tử</strong> — từ chiến lược, hành trình khách hàng đến vận hành một cửa hàng online thật — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, chuẩn ngành.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DME201c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (chuẩn quốc tế)</h3>
<ul>
<li><em>Digital Marketing</em> — Dave Chaffey &amp; Fiona Ellis-Chadwick (Pearson). Khung RACE dùng xuyên suốt môn này.</li>
<li><em>E-commerce: Business, Technology, Society</em> — Kenneth Laudon &amp; Carol Traver (Pearson).</li>
<li><em>Digital Marketing Strategy: An Integrated Approach</em> — Simon Kingsnorth (Kogan Page).</li>
</ul>
<h3>🌐 Đào tạo &amp; chứng chỉ miễn phí chính thức</h3>
<ul>
<li><a href="https://grow.google/intl/en/courses-and-tools/" target="_blank" rel="noopener">Google Digital Garage / Skillshop</a> — chứng chỉ Digital Marketing, Google Ads &amp; Analytics (GA4).</li>
<li><a href="https://www.facebook.com/business/learn" target="_blank" rel="noopener">Meta Blueprint</a> — quảng cáo Facebook &amp; Instagram.</li>
<li><a href="https://www.shopify.com/learn" target="_blank" rel="noopener">Shopify Learn / Help Center</a> — dựng và vận hành cửa hàng từ A tới Z.</li>
</ul>
<h3>🛠️ Nền tảng thực hành</h3>
<ul>
<li><a href="https://www.shopify.com" target="_blank" rel="noopener">Shopify</a> — tự dựng cửa hàng (dùng thử 14 ngày).</li>
<li><a href="https://analytics.google.com" target="_blank" rel="noopener">Google Analytics 4</a> &amp; <a href="https://ads.google.com" target="_blank" rel="noopener">Google Ads</a>.</li>
<li>Sàn VN để nghiên cứu: <a href="https://shopee.vn" target="_blank" rel="noopener">Shopee</a>, <a href="https://tiki.vn" target="_blank" rel="noopener">Tiki</a>, <a href="https://www.lazada.vn" target="_blank" rel="noopener">Lazada</a>.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — marketing số &amp; TMĐT là gì, hệ sinh thái digital, mô hình kinh doanh (B2C/B2B/C2C/D2C).</li>
<li><strong>Chiến lược</strong> — RACE, hành trình khách hàng &amp; phễu; lập kế hoạch trước khi chi tiền.</li>
<li><strong>Kênh &amp; cửa hàng</strong> — website/CRO, SEO &amp; SEM, social &amp; content, rồi dựng &amp; vận hành cửa hàng.</li>
<li><strong>Đo &amp; tối ưu</strong> — GA4, KPI (conversion/AOV/CLV), A/B testing, đạo đức dữ liệu.</li>
</ol></div>`,
  ]]);

const intro = doc('dme201c-0-1-overview', 'Course overview: Digital marketing & e-commerce|||Tổng quan: Marketing số & TMĐT',
  'Môn học làm gì; khác biệt marketing số vs truyền thống; lộ trình: khái niệm → chiến lược → website/SEO/SEM/social → sàn & vận hành → trải nghiệm mua → phân tích.',
  [[
    `<span class="eyebrow">DME201c · Lesson 0.1 · Overview</span>
<h2>Digital Marketing &amp; E-commerce</h2>
<p class="lead">This course teaches you how brands <strong>attract, convert and keep customers online</strong> — and how an <strong>online store actually runs</strong>, from product listing to payment, delivery and repeat purchase. You learn strategy first (so you don't just "boost posts"), then each channel, then how to build and measure a real store.</p>
<h3>Digital vs traditional marketing</h3>
<ul>
<li><strong>Measurable</strong> — every click, view and sale is tracked; you optimize with data, not guesses.</li>
<li><strong>Targeted &amp; two-way</strong> — you reach specific audiences and they talk back (reviews, comments, chat).</li>
<li><strong>Fast &amp; iterative</strong> — you test, read results, and adjust in days, not quarters.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Concepts &amp; business models → strategy &amp; customer journey (RACE) → website &amp; conversion (CRO) → SEO &amp; SEM → social &amp; content → e-commerce platforms &amp; operations → buying experience &amp; retention → analytics &amp; optimization. Bilingual, with real tools (Google Ads, GA4, Shopify) and real brands (Shopee, Tiki, Biti's), plus a quiz per chapter.</p>
<div class="callout"><span class="badge">One thread</span> Everything ties back to a single loop: <strong>Reach → Act → Convert → Engage</strong>. Keep it in mind and each chapter clicks into place.</div>`,
    `<span class="eyebrow">DME201c · Bài 0.1 · Tổng quan</span>
<h2>Marketing số &amp; Thương mại điện tử</h2>
<p class="lead">Môn này dạy cách thương hiệu <strong>thu hút, chuyển đổi và giữ chân khách hàng online</strong> — và một <strong>cửa hàng online vận hành thế nào</strong>, từ đăng sản phẩm đến thanh toán, giao hàng và mua lại. Bạn học chiến lược trước (để không chỉ "đẩy bài"), rồi từng kênh, rồi cách dựng và đo một cửa hàng thật.</p>
<h3>Marketing số vs truyền thống</h3>
<ul>
<li><strong>Đo được</strong> — mọi click, lượt xem, đơn hàng đều được ghi nhận; tối ưu bằng dữ liệu, không đoán mò.</li>
<li><strong>Nhắm đúng &amp; hai chiều</strong> — tiếp cận đúng nhóm và họ phản hồi lại (review, bình luận, chat).</li>
<li><strong>Nhanh &amp; lặp</strong> — thử, đọc kết quả, chỉnh trong vài ngày, không phải vài quý.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Khái niệm &amp; mô hình kinh doanh → chiến lược &amp; hành trình khách hàng (RACE) → website &amp; chuyển đổi (CRO) → SEO &amp; SEM → social &amp; content → nền tảng TMĐT &amp; vận hành → trải nghiệm mua &amp; giữ chân → phân tích &amp; tối ưu. Song ngữ, có công cụ thật (Google Ads, GA4, Shopify) và thương hiệu thật (Shopee, Tiki, Biti's), kèm quiz mỗi chương.</p>
<div class="callout"><span class="badge">Một sợi chỉ</span> Tất cả quy về một vòng lặp: <strong>Reach → Act → Convert → Engage</strong> (Tiếp cận → Tương tác → Chuyển đổi → Gắn kết). Nhớ nó thì mỗi chương tự vào khớp.</div>`,
  ]]);

const c1 = doc('dme201c-1-1-what-is', '1.1 — What digital marketing & e-commerce are|||1.1 — Marketing số & TMĐT là gì',
  'Khái niệm marketing số & TMĐT; hệ sinh thái digital (owned/earned/paid media); các mô hình kinh doanh B2C, B2B, C2C, D2C với ví dụ thật.',
  [[
    `<span class="eyebrow">DME201c · Chapter 1 · Lesson 1.1</span>
<h2>What digital marketing &amp; e-commerce are</h2>
<p><strong>Digital marketing</strong> is promoting products and building customer relationships through digital channels (search, social, email, websites, apps). <strong>E-commerce</strong> is buying and selling goods and services online — the transaction itself.</p>
<h3>The digital ecosystem: owned, earned, paid</h3>
<ul>
<li><strong>Owned media</strong> — assets you control: your website, app, email list. Example: <em>tiki.vn</em> and its app.</li>
<li><strong>Earned media</strong> — exposure you don't pay for: reviews, shares, press, word of mouth.</li>
<li><strong>Paid media</strong> — you pay to reach people: Google Ads, Facebook/Instagram Ads, Shopee ads.</li>
</ul>
<h3>Business models</h3>
<ul>
<li><strong>B2C</strong> (Business to Consumer) — a brand sells to shoppers. Example: <em>Shopee</em>, <em>Tiki</em>.</li>
<li><strong>B2B</strong> (Business to Business) — companies sell to companies. Example: <em>Alibaba</em>, wholesale suppliers.</li>
<li><strong>C2C</strong> (Consumer to Consumer) — people sell to each other on a platform. Example: <em>Chợ Tốt</em>, Shopee individual sellers.</li>
<li><strong>D2C</strong> (Direct to Consumer) — a maker sells straight to buyers, skipping middlemen. Example: <em>Biti's</em> selling on its own website.</li>
</ul>
<div class="callout"><span class="badge">Why models matter</span> The model decides your channels, pricing and logistics. A D2C brand like Biti's owns the customer relationship (and the data); a seller inside Shopee rents traffic but reaches millions fast.</div>`,
    `<span class="eyebrow">DME201c · Chương 1 · Bài 1.1</span>
<h2>Marketing số &amp; TMĐT là gì</h2>
<p><strong>Marketing số</strong> là quảng bá sản phẩm và xây quan hệ khách hàng qua kênh số (tìm kiếm, social, email, website, app). <strong>Thương mại điện tử (TMĐT)</strong> là việc mua bán hàng hoá &amp; dịch vụ trực tuyến — bản thân giao dịch đó.</p>
<h3>Hệ sinh thái digital: owned, earned, paid</h3>
<ul>
<li><strong>Owned media</strong> — tài sản bạn sở hữu: website, app, danh sách email. Ví dụ: <em>tiki.vn</em> và app của Tiki.</li>
<li><strong>Earned media</strong> — hiển thị không mất tiền: review, chia sẻ, báo chí, truyền miệng.</li>
<li><strong>Paid media</strong> — trả tiền để tiếp cận: Google Ads, Facebook/Instagram Ads, quảng cáo Shopee.</li>
</ul>
<h3>Các mô hình kinh doanh</h3>
<ul>
<li><strong>B2C</strong> (Doanh nghiệp → Người dùng) — thương hiệu bán cho người mua. Ví dụ: <em>Shopee</em>, <em>Tiki</em>.</li>
<li><strong>B2B</strong> (Doanh nghiệp → Doanh nghiệp) — công ty bán cho công ty. Ví dụ: <em>Alibaba</em>, nhà cung cấp sỉ.</li>
<li><strong>C2C</strong> (Người dùng → Người dùng) — cá nhân bán cho nhau qua nền tảng. Ví dụ: <em>Chợ Tốt</em>, người bán cá nhân trên Shopee.</li>
<li><strong>D2C</strong> (Trực tiếp tới người dùng) — nhà sản xuất bán thẳng cho người mua, bỏ trung gian. Ví dụ: <em>Biti's</em> bán trên website của chính mình.</li>
</ul>
<div class="callout"><span class="badge">Vì sao mô hình quan trọng</span> Mô hình quyết định kênh, giá và logistics. Thương hiệu D2C như Biti's sở hữu quan hệ khách hàng (và dữ liệu); người bán trong Shopee "thuê" lưu lượng nhưng chạm hàng triệu người rất nhanh.</div>`,
  ]]);

const c1q = quiz('dme201c-quiz-1', 'Quiz 1 — Concepts & models|||Quiz 1 — Khái niệm & mô hình', [
  { id: 'q1', question: 'Website và danh sách email của thương hiệu thuộc loại media nào?|||A brand website and email list are which media?', options: ['Paid media', 'Earned media', 'Owned media|||Owned media', 'Social media'], correctIndex: 2, explanation: 'Owned media là tài sản bạn sở hữu và kiểm soát.' },
  { id: 'q2', question: 'Biti\'s bán trực tiếp trên website của mình là mô hình?|||Biti\'s selling on its own website is which model?', options: ['B2B', 'C2C', 'D2C|||D2C', 'B2G'], correctIndex: 2, explanation: 'D2C: nhà sản xuất bán thẳng cho người mua, bỏ trung gian.' },
  { id: 'q3', question: 'Người dùng bán đồ cũ cho người dùng khác trên Chợ Tốt là?|||A user selling used goods to another on Chợ Tốt is?', options: ['B2C', 'C2C|||C2C', 'D2C', 'B2B'], correctIndex: 1, explanation: 'C2C: cá nhân bán cho cá nhân qua nền tảng.' },
]);

const c2 = doc('dme201c-2-1-strategy-journey', '2.1 — Strategy & the digital customer journey|||2.1 — Chiến lược & hành trình khách hàng số',
  'Chiến lược digital, khung RACE (Reach–Act–Convert–Engage); hành trình khách hàng (awareness→consideration→purchase→loyalty) và phễu marketing.',
  [[
    `<span class="eyebrow">DME201c · Chapter 2 · Lesson 2.1</span>
<h2>Strategy &amp; the digital customer journey</h2>
<p>A <strong>digital strategy</strong> answers: who are we for, what do we offer, on which channels, and how do we measure success — <em>before</em> spending money. Chaffey's <strong>RACE framework</strong> is the standard planning tool.</p>
<h3>RACE</h3>
<ul>
<li><strong>Reach</strong> — build awareness &amp; visits (SEO, ads, social).</li>
<li><strong>Act</strong> — encourage interaction (browse products, read reviews, add to cart).</li>
<li><strong>Convert</strong> — turn interest into a sale.</li>
<li><strong>Engage</strong> — keep customers coming back (email, loyalty, remarketing).</li>
</ul>
<h3>The customer journey &amp; the funnel</h3>
<pre><code>Awareness    -> "I have a need / I see the brand"
Consideration-> "I compare options, read reviews"
Purchase     -> "I buy"
Loyalty      -> "I buy again &amp; recommend"</code></pre>
<p>The <strong>funnel</strong> narrows at each stage: many reach the top, fewer convert. Your job is to reduce the drop-off between stages — measured by conversion rate at each step.</p>
<div class="callout"><span class="badge">Example</span> A Shopee seller uses live streams &amp; ads for <em>Reach</em>, product photos &amp; reviews for <em>Act</em>, vouchers at checkout for <em>Convert</em>, and follow + push notifications for <em>Engage</em>.</div>`,
    `<span class="eyebrow">DME201c · Chương 2 · Bài 2.1</span>
<h2>Chiến lược &amp; hành trình khách hàng số</h2>
<p><strong>Chiến lược digital</strong> trả lời: ta phục vụ ai, cung cấp gì, trên kênh nào, và đo thành công thế nào — <em>trước khi</em> tiêu tiền. Khung <strong>RACE</strong> của Chaffey là công cụ lập kế hoạch chuẩn.</p>
<h3>RACE</h3>
<ul>
<li><strong>Reach (Tiếp cận)</strong> — tạo nhận biết &amp; lượt truy cập (SEO, quảng cáo, social).</li>
<li><strong>Act (Tương tác)</strong> — khuyến khích hành động (xem sản phẩm, đọc review, thêm giỏ).</li>
<li><strong>Convert (Chuyển đổi)</strong> — biến quan tâm thành đơn hàng.</li>
<li><strong>Engage (Gắn kết)</strong> — giữ khách quay lại (email, loyalty, remarketing).</li>
</ul>
<h3>Hành trình khách hàng &amp; phễu</h3>
<pre><code>Nhận biết     -> "Tôi có nhu cầu / thấy thương hiệu"
Cân nhắc      -> "Tôi so sánh, đọc review"
Mua           -> "Tôi mua"
Trung thành   -> "Tôi mua lại &amp; giới thiệu"</code></pre>
<p><strong>Phễu</strong> hẹp dần qua mỗi bước: nhiều người ở miệng phễu, ít người chuyển đổi. Việc của bạn là giảm rơi rớt giữa các bước — đo bằng tỉ lệ chuyển đổi ở từng bước.</p>
<div class="callout"><span class="badge">Ví dụ</span> Người bán Shopee dùng livestream &amp; quảng cáo cho <em>Reach</em>, ảnh sản phẩm &amp; review cho <em>Act</em>, voucher lúc thanh toán cho <em>Convert</em>, và nút Theo dõi + thông báo đẩy cho <em>Engage</em>.</div>`,
  ]]);

const c2q = quiz('dme201c-quiz-2', 'Quiz 2 — Strategy & journey|||Quiz 2 — Chiến lược & hành trình', [
  { id: 'q1', question: 'Bốn bước của khung RACE theo đúng thứ tự là?|||The four RACE stages in order are?', options: ['Reach → Act → Convert → Engage|||Reach → Act → Convert → Engage', 'Research → Ads → Convert → Email', 'Reach → Ads → Cost → Engage', 'Retarget → Act → Close → Earn'], correctIndex: 0, explanation: 'RACE = Reach, Act, Convert, Engage.' },
  { id: 'q2', question: 'Giai đoạn khách "so sánh lựa chọn, đọc review" gọi là?|||The stage where a customer compares options and reads reviews is?', options: ['Nhận biết (Awareness)', 'Cân nhắc (Consideration)|||Consideration', 'Mua (Purchase)', 'Trung thành (Loyalty)'], correctIndex: 1, explanation: 'Consideration/Cân nhắc: đánh giá và so sánh trước khi mua.' },
  { id: 'q3', question: 'Vì sao phễu (funnel) hẹp dần?|||Why does the funnel narrow?', options: ['Vì quảng cáo đắt hơn', 'Vì có ít người rơi rớt qua mỗi bước, ít người chuyển đổi hơn|||Because people drop off at each step, fewer convert', 'Vì website chậm', 'Vì giá tăng'], correctIndex: 1, explanation: 'Mỗi bước mất một phần người dùng nên số người còn lại giảm dần.' },
]);

const c3 = doc('dme201c-3-1-website-cro', '3.1 — Website & conversion optimization|||3.1 — Website & tối ưu chuyển đổi',
  'UX & thiết kế lấy người dùng làm trung tâm; landing page; CRO (tối ưu tỉ lệ chuyển đổi); mobile-first & tốc độ; các đòn bẩy chuyển đổi.',
  [[
    `<span class="eyebrow">DME201c · Chapter 3 · Lesson 3.1</span>
<h2>Website &amp; conversion optimization</h2>
<p>Traffic is wasted if the site doesn't convert. <strong>UX (user experience)</strong> and <strong>CRO (Conversion Rate Optimization)</strong> turn visitors into buyers.</p>
<h3>Landing pages &amp; UX</h3>
<ul>
<li>A <strong>landing page</strong> has one job and one main call to action (CTA), e.g. "Add to cart".</li>
<li>Clear value proposition above the fold; fast load; trust signals (reviews, secure-payment badges, return policy).</li>
<li><strong>Mobile-first</strong> — most VN shoppers browse on phones, so design for the small screen first.</li>
</ul>
<h3>Conversion levers</h3>
<pre><code>Conversion rate = orders / visitors × 100%

Levers:
- Speed        (a 1s delay can drop conversions)
- Fewer steps  (short, guest-friendly checkout)
- Trust        (reviews, ratings, clear returns)
- Clear CTA    (one obvious next action)</code></pre>
<div class="callout"><span class="badge">CRO in practice</span> Tiki and Shopee show ratings, "sold" counts and free-shipping thresholds right on the product page — each is a conversion lever tested with data, not decoration.</div>`,
    `<span class="eyebrow">DME201c · Chương 3 · Bài 3.1</span>
<h2>Website &amp; tối ưu chuyển đổi</h2>
<p>Lưu lượng vô ích nếu site không chuyển đổi. <strong>UX (trải nghiệm người dùng)</strong> và <strong>CRO (tối ưu tỉ lệ chuyển đổi)</strong> biến khách ghé thăm thành người mua.</p>
<h3>Landing page &amp; UX</h3>
<ul>
<li>Một <strong>landing page</strong> chỉ có một nhiệm vụ và một lời kêu gọi hành động (CTA) chính, ví dụ "Thêm vào giỏ".</li>
<li>Giá trị rõ ràng ngay phần đầu trang; tải nhanh; tín hiệu tin cậy (review, huy hiệu thanh toán an toàn, chính sách đổi trả).</li>
<li><strong>Mobile-first</strong> — phần lớn người mua VN lướt trên điện thoại, nên thiết kế cho màn nhỏ trước.</li>
</ul>
<h3>Các đòn bẩy chuyển đổi</h3>
<pre><code>Tỉ lệ chuyển đổi = số đơn / số khách × 100%

Đòn bẩy:
- Tốc độ       (chậm 1s có thể tụt chuyển đổi)
- Ít bước hơn  (checkout ngắn, cho khách vãng lai)
- Tin cậy      (review, đánh giá, đổi trả rõ)
- CTA rõ ràng  (một hành động kế tiếp hiển nhiên)</code></pre>
<div class="callout"><span class="badge">CRO thực tế</span> Tiki và Shopee hiển thị đánh giá, số "đã bán" và mốc miễn phí vận chuyển ngay trên trang sản phẩm — mỗi thứ là một đòn bẩy chuyển đổi được kiểm bằng dữ liệu, không phải trang trí.</div>`,
  ]]);

const c3q = quiz('dme201c-quiz-3', 'Quiz 3 — Website & CRO|||Quiz 3 — Website & CRO', [
  { id: 'q1', question: 'CRO là viết tắt của?|||CRO stands for?', options: ['Customer Return Order', 'Conversion Rate Optimization|||Conversion Rate Optimization', 'Content Reach Online', 'Cost of Revenue Online'], correctIndex: 1, explanation: 'CRO = Conversion Rate Optimization — tối ưu tỉ lệ chuyển đổi.' },
  { id: 'q2', question: 'Vì sao thiết kế "mobile-first" quan trọng ở VN?|||Why is mobile-first important in Vietnam?', options: ['Vì máy tính rẻ', 'Vì phần lớn người mua lướt và mua bằng điện thoại|||Because most shoppers browse and buy on phones', 'Vì Google cấm desktop', 'Vì email chỉ mở trên điện thoại'], correctIndex: 1, explanation: 'Đa số lưu lượng TMĐT ở VN đến từ di động nên ưu tiên màn nhỏ.' },
  { id: 'q3', question: 'Tỉ lệ chuyển đổi được tính bằng?|||Conversion rate is calculated as?', options: ['Khách / đơn × 100%', 'Đơn / khách × 100%|||Orders / visitors × 100%', 'Doanh thu / quảng cáo', 'Lượt xem / click'], correctIndex: 1, explanation: 'Conversion rate = số đơn chia số khách, nhân 100%.' },
]);

const c4 = doc('dme201c-4-1-seo-sem', '4.1 — SEO & SEM|||4.1 — SEO & SEM',
  'Tìm kiếm tự nhiên (SEO): từ khoá, on-page, nội dung; tìm kiếm trả tiền (SEM/PPC): Google Ads, đấu giá, Quality Score, chỉ số CPC/CTR/ROAS.',
  [[
    `<span class="eyebrow">DME201c · Chapter 4 · Lesson 4.1</span>
<h2>SEO &amp; SEM</h2>
<p>Search is where buyers with intent go. You reach them two ways: <strong>SEO</strong> (free, organic ranking) and <strong>SEM/PPC</strong> (paid ads).</p>
<h3>SEO — organic search</h3>
<ul>
<li><strong>Keyword research</strong> — find what people actually type (e.g. "giày sneaker nam").</li>
<li><strong>On-page</strong> — title, headings, useful content, fast &amp; mobile-friendly pages.</li>
<li><strong>Off-page</strong> — backlinks &amp; reputation. SEO is slow but compounds over time.</li>
</ul>
<h3>SEM — paid search (Google Ads / PPC)</h3>
<p>You bid on keywords; ads run on an <strong>auction</strong>. You pay <strong>per click (PPC)</strong>. Google ranks ads by <em>bid × Quality Score</em>, so a more relevant ad can win a lower spot for less money.</p>
<pre><code>Key metrics:
CPC  = cost per click
CTR  = clicks / impressions
ROAS = revenue / ad spend  (return on ad spend)</code></pre>
<div class="callout"><span class="badge">SEO vs SEM</span> SEM buys traffic <em>today</em> and stops when you stop paying; SEO earns traffic that <em>lasts</em> but takes months. Most brands run both.</div>`,
    `<span class="eyebrow">DME201c · Chương 4 · Bài 4.1</span>
<h2>SEO &amp; SEM</h2>
<p>Tìm kiếm là nơi người mua có ý định tìm đến. Bạn tiếp cận họ hai cách: <strong>SEO</strong> (miễn phí, xếp hạng tự nhiên) và <strong>SEM/PPC</strong> (quảng cáo trả tiền).</p>
<h3>SEO — tìm kiếm tự nhiên</h3>
<ul>
<li><strong>Nghiên cứu từ khoá</strong> — tìm cụm người ta thực sự gõ (vd "giày sneaker nam").</li>
<li><strong>On-page</strong> — tiêu đề, thẻ heading, nội dung hữu ích, trang tải nhanh &amp; thân thiện di động.</li>
<li><strong>Off-page</strong> — backlink &amp; uy tín. SEO chậm nhưng cộng dồn theo thời gian.</li>
</ul>
<h3>SEM — tìm kiếm trả tiền (Google Ads / PPC)</h3>
<p>Bạn đấu giá từ khoá; quảng cáo chạy theo cơ chế <strong>đấu giá</strong>. Bạn trả <strong>theo click (PPC)</strong>. Google xếp hạng quảng cáo theo <em>giá thầu × Quality Score</em>, nên một quảng cáo liên quan hơn có thể thắng vị trí thấp với chi phí ít hơn.</p>
<pre><code>Chỉ số then chốt:
CPC  = chi phí mỗi click
CTR  = số click / số hiển thị
ROAS = doanh thu / chi phí quảng cáo</code></pre>
<div class="callout"><span class="badge">SEO vs SEM</span> SEM mua lưu lượng <em>ngay hôm nay</em> và dừng khi ngừng trả tiền; SEO tạo lưu lượng <em>bền</em> nhưng mất nhiều tháng. Đa số thương hiệu chạy cả hai.</div>`,
  ]]);

const c4q = quiz('dme201c-quiz-4', 'Quiz 4 — SEO & SEM|||Quiz 4 — SEO & SEM', [
  { id: 'q1', question: 'Điểm khác nhau cốt lõi giữa SEO và SEM là?|||The core difference between SEO and SEM is?', options: ['SEO trả tiền, SEM miễn phí', 'SEO là tự nhiên (miễn phí), SEM là quảng cáo trả tiền|||SEO is organic (free), SEM is paid ads', 'SEO chỉ cho di động', 'SEM chỉ dùng email'], correctIndex: 1, explanation: 'SEO = xếp hạng tự nhiên; SEM/PPC = quảng cáo trả tiền.' },
  { id: 'q2', question: 'PPC nghĩa là bạn trả tiền khi nào?|||In PPC, you pay when?', options: ['Mỗi lần hiển thị', 'Mỗi lần có người click vào quảng cáo|||Each time someone clicks the ad', 'Mỗi tháng cố định', 'Khi đơn hàng giao xong'], correctIndex: 1, explanation: 'PPC = Pay Per Click: trả theo mỗi click.' },
  { id: 'q3', question: 'ROAS đo lường điều gì?|||ROAS measures what?', options: ['Số click trên số hiển thị', 'Doanh thu thu được trên mỗi đồng chi quảng cáo|||Revenue earned per unit of ad spend', 'Tốc độ tải trang', 'Số backlink'], correctIndex: 1, explanation: 'ROAS = doanh thu / chi phí quảng cáo (return on ad spend).' },
]);

const c5 = doc('dme201c-5-1-social-content', '5.1 — Social & content marketing|||5.1 — Social & content marketing số',
  'Social media (Facebook/Instagram/TikTok/Zalo); content marketing & storytelling; influencer/KOL/KOC; email marketing & automation.',
  [[
    `<span class="eyebrow">DME201c · Chapter 5 · Lesson 5.1</span>
<h2>Social &amp; content marketing</h2>
<h3>Social media</h3>
<p>Platforms like <strong>Facebook, Instagram, TikTok and Zalo</strong> reach large audiences and let you target precisely. Organic posts build community; paid ads scale reach and drive sales.</p>
<h3>Content marketing</h3>
<ul>
<li>Create useful/entertaining content (guides, short videos, tips) so people find and trust you — not just "buy now" ads.</li>
<li><strong>Storytelling</strong> and consistency turn followers into customers over time.</li>
</ul>
<h3>Influencers: KOL vs KOC</h3>
<ul>
<li><strong>KOL</strong> (Key Opinion Leader) — a celebrity/large influencer, big reach.</li>
<li><strong>KOC</strong> (Key Opinion Consumer) — an everyday reviewer; smaller reach but high trust &amp; conversion, huge in VN on TikTok &amp; Shopee.</li>
</ul>
<h3>Email marketing</h3>
<p>Email is <strong>owned</strong> and cheap: newsletters, abandoned-cart reminders, and automated flows (welcome, post-purchase) keep customers engaged.</p>
<div class="callout"><span class="badge">Example</span> A VN fashion brand seeds products to KOCs for honest TikTok reviews, boosts the best clips as ads, and emails a discount to viewers who visited but didn't buy.</div>`,
    `<span class="eyebrow">DME201c · Chương 5 · Bài 5.1</span>
<h2>Social &amp; content marketing số</h2>
<h3>Social media</h3>
<p>Nền tảng như <strong>Facebook, Instagram, TikTok và Zalo</strong> chạm lượng lớn khán giả và cho nhắm mục tiêu chính xác. Bài đăng tự nhiên xây cộng đồng; quảng cáo trả tiền mở rộng tiếp cận và thúc đẩy bán hàng.</p>
<h3>Content marketing</h3>
<ul>
<li>Tạo nội dung hữu ích/giải trí (hướng dẫn, video ngắn, mẹo) để người ta tìm thấy và tin bạn — không chỉ quảng cáo "mua ngay".</li>
<li><strong>Storytelling</strong> (kể chuyện) và sự đều đặn biến người theo dõi thành khách hàng theo thời gian.</li>
</ul>
<h3>Người ảnh hưởng: KOL vs KOC</h3>
<ul>
<li><strong>KOL</strong> (Key Opinion Leader) — người nổi tiếng/ảnh hưởng lớn, tiếp cận rộng.</li>
<li><strong>KOC</strong> (Key Opinion Consumer) — người dùng review đời thường; tiếp cận nhỏ hơn nhưng độ tin cậy &amp; chuyển đổi cao, rất mạnh ở VN trên TikTok &amp; Shopee.</li>
</ul>
<h3>Email marketing</h3>
<p>Email là kênh <strong>owned</strong> và rẻ: newsletter, nhắc giỏ hàng bỏ quên, và luồng tự động (chào mừng, sau mua) giữ khách gắn kết.</p>
<div class="callout"><span class="badge">Ví dụ</span> Một thương hiệu thời trang VN gửi sản phẩm cho KOC để review thật trên TikTok, chạy quảng cáo cho clip tốt nhất, và email mã giảm giá cho người đã ghé mà chưa mua.</div>`,
  ]]);

const c5q = quiz('dme201c-quiz-5', 'Quiz 5 — Social & content|||Quiz 5 — Social & content', [
  { id: 'q1', question: 'Khác biệt chính giữa KOL và KOC là?|||The main difference between a KOL and a KOC is?', options: ['KOL là người dùng thường, KOC là người nổi tiếng', 'KOC là người dùng đời thường review, tin cậy cao; KOL là người ảnh hưởng lớn, tiếp cận rộng|||A KOC is an everyday reviewer with high trust; a KOL is a large influencer with big reach', 'Cả hai giống hệt nhau', 'KOC chỉ dùng email'], correctIndex: 1, explanation: 'KOC nhỏ mà tin cậy/chuyển đổi cao; KOL lớn mà tiếp cận rộng.' },
  { id: 'q2', question: 'Vì sao email được xem là kênh "owned"?|||Why is email an "owned" channel?', options: ['Vì Google sở hữu nó', 'Vì bạn sở hữu danh sách và kiểm soát thông điệp, không phụ thuộc thuật toán nền tảng|||Because you own the list and control the message, independent of platform algorithms', 'Vì email luôn miễn phí gửi vô hạn', 'Vì email là earned media'], correctIndex: 1, explanation: 'Danh sách email do bạn sở hữu và kiểm soát → owned media.' },
  { id: 'q3', question: 'Mục tiêu của content marketing (khác quảng cáo bán trực tiếp) là?|||The goal of content marketing (vs direct-sell ads) is?', options: ['Ép mua ngay lập tức', 'Tạo nội dung hữu ích để được tìm thấy và xây niềm tin theo thời gian|||Create useful content to get found and build trust over time', 'Tăng CPC', 'Giảm tồn kho'], correctIndex: 1, explanation: 'Content thu hút và tạo niềm tin, dẫn tới mua lâu dài.' },
]);

const c6 = doc('dme201c-6-1-platforms-operations', '6.1 — E-commerce platforms & operations|||6.1 — Nền tảng TMĐT & vận hành',
  'Kênh bán: website (Shopify) vs marketplace (Shopee/Lazada/Tiki); quản lý sản phẩm & tồn kho; cổng thanh toán (VNPay/MoMo/COD); logistics & fulfillment.',
  [[
    `<span class="eyebrow">DME201c · Chapter 6 · Lesson 6.1</span>
<h2>E-commerce platforms &amp; operations</h2>
<h3>Where to sell: own store vs marketplace</h3>
<ul>
<li><strong>Own store (Shopify, WooCommerce)</strong> — full control, your data &amp; branding; you must drive your own traffic.</li>
<li><strong>Marketplace (Shopee, Lazada, Tiki)</strong> — built-in traffic and trust; but fees, competition and less data ownership. Many VN brands sell on both.</li>
</ul>
<h3>Product &amp; inventory</h3>
<p>Good <strong>product listings</strong> (title, photos, variants, price, description) plus accurate <strong>inventory</strong> prevent overselling and lost trust.</p>
<h3>Payments</h3>
<p>VN buyers use <strong>COD</strong> (cash on delivery), e-wallets (<strong>MoMo, ZaloPay</strong>), and gateways (<strong>VNPay</strong>), cards and bank transfer. Offer the methods your customers trust.</p>
<h3>Logistics &amp; fulfillment</h3>
<pre><code>Order -> Pick &amp; pack -> Ship (GHN/GHTK/Viettel Post) -> Deliver -> (Returns)</code></pre>
<p><strong>Fulfillment</strong> = getting the product to the door. Shopee/Lazada offer integrated shipping; a Shopify store connects carriers or a 3PL.</p>
<div class="callout"><span class="badge">Reality check</span> Fast, reliable delivery and easy returns are part of the marketing — in VN, free-shipping vouchers and fast delivery badges directly lift conversion.</div>`,
    `<span class="eyebrow">DME201c · Chương 6 · Bài 6.1</span>
<h2>Nền tảng TMĐT &amp; vận hành</h2>
<h3>Bán ở đâu: cửa hàng riêng vs marketplace</h3>
<ul>
<li><strong>Cửa hàng riêng (Shopify, WooCommerce)</strong> — toàn quyền kiểm soát, dữ liệu &amp; thương hiệu là của bạn; nhưng phải tự kéo lưu lượng.</li>
<li><strong>Marketplace (Shopee, Lazada, Tiki)</strong> — có sẵn lưu lượng và niềm tin; đổi lại là phí, cạnh tranh và ít sở hữu dữ liệu hơn. Nhiều thương hiệu VN bán cả hai.</li>
</ul>
<h3>Sản phẩm &amp; tồn kho</h3>
<p><strong>Listing sản phẩm</strong> tốt (tên, ảnh, phân loại/variant, giá, mô tả) cộng <strong>tồn kho</strong> chính xác giúp tránh bán vượt hàng và mất niềm tin.</p>
<h3>Thanh toán</h3>
<p>Người mua VN dùng <strong>COD</strong> (giao trả tiền), ví điện tử (<strong>MoMo, ZaloPay</strong>), cổng (<strong>VNPay</strong>), thẻ và chuyển khoản. Hãy mở đúng các phương thức khách tin dùng.</p>
<h3>Logistics &amp; fulfillment</h3>
<pre><code>Đơn -> Soạn &amp; đóng gói -> Giao (GHN/GHTK/Viettel Post) -> Nhận -> (Đổi trả)</code></pre>
<p><strong>Fulfillment</strong> = đưa sản phẩm tới tận cửa. Shopee/Lazada có vận chuyển tích hợp; cửa hàng Shopify kết nối đơn vị vận chuyển hoặc 3PL.</p>
<div class="callout"><span class="badge">Nhìn thực tế</span> Giao nhanh, tin cậy và đổi trả dễ cũng là marketing — ở VN, voucher freeship và huy hiệu giao nhanh trực tiếp nâng tỉ lệ chuyển đổi.</div>`,
  ]]);

const c6q = quiz('dme201c-quiz-6', 'Quiz 6 — Platforms & operations|||Quiz 6 — Nền tảng & vận hành', [
  { id: 'q1', question: 'Lợi thế lớn của bán trên marketplace (Shopee/Lazada) so với cửa hàng riêng là?|||A big advantage of selling on a marketplace vs your own store is?', options: ['Toàn quyền sở hữu dữ liệu', 'Có sẵn lưu lượng và niềm tin của người mua|||Built-in traffic and buyer trust', 'Không mất phí', 'Kiểm soát thương hiệu tuyệt đối'], correctIndex: 1, explanation: 'Marketplace có sẵn traffic & niềm tin; đổi lại là phí và ít sở hữu dữ liệu.' },
  { id: 'q2', question: '"COD" trong TMĐT Việt Nam nghĩa là?|||"COD" in Vietnamese e-commerce means?', options: ['Thẻ tín dụng quốc tế', 'Giao hàng thu tiền tận nơi (cash on delivery)|||Cash on delivery', 'Ví điện tử MoMo', 'Chuyển khoản ngân hàng'], correctIndex: 1, explanation: 'COD = cash on delivery: trả tiền mặt khi nhận hàng.' },
  { id: 'q3', question: '"Fulfillment" trong TMĐT chỉ điều gì?|||"Fulfillment" in e-commerce refers to?', options: ['Chạy quảng cáo', 'Quá trình soạn, đóng gói và giao sản phẩm tới khách|||The process of picking, packing and delivering the product to the customer', 'Viết mô tả sản phẩm', 'Đặt giá sản phẩm'], correctIndex: 1, explanation: 'Fulfillment là toàn bộ khâu đưa hàng tới tay người mua.' },
]);

const c7 = doc('dme201c-7-1-experience-retention', '7.1 — Buying experience & retention|||7.1 — Trải nghiệm mua & giữ chân',
  'Giỏ hàng & checkout (giảm bỏ giỏ); review & bằng chứng xã hội; loyalty & remarketing; livestream commerce và mua lại.',
  [[
    `<span class="eyebrow">DME201c · Chapter 7 · Lesson 7.1</span>
<h2>Buying experience &amp; retention</h2>
<h3>Cart &amp; checkout</h3>
<p><strong>Cart abandonment</strong> (leaving without buying) is huge. Reduce it with a short checkout, guest option, clear shipping cost early, and trusted payment. <strong>Abandoned-cart emails/notifications</strong> recover lost sales.</p>
<h3>Reviews &amp; social proof</h3>
<p>Ratings, photos and "sold" counts reassure buyers. On Shopee/Tiki, good reviews directly raise conversion and search ranking within the platform.</p>
<h3>Retention: cheaper than acquisition</h3>
<ul>
<li><strong>Loyalty programs</strong> — points, tiers, vouchers to reward repeat buyers.</li>
<li><strong>Remarketing</strong> — show ads to people who visited or added to cart but didn't buy.</li>
<li><strong>Livestream commerce</strong> — sellers demo products live with limited-time deals; a major sales channel on Shopee Live &amp; TikTok Shop in VN.</li>
</ul>
<div class="callout"><span class="badge">Why retention wins</span> Winning a new customer costs far more than keeping one. A returning buyer with a loyalty voucher and a good last experience buys again — lifting CLV (customer lifetime value).</div>`,
    `<span class="eyebrow">DME201c · Chương 7 · Bài 7.1</span>
<h2>Trải nghiệm mua &amp; giữ chân</h2>
<h3>Giỏ hàng &amp; checkout</h3>
<p><strong>Bỏ giỏ hàng</strong> (rời đi mà không mua) rất phổ biến. Giảm nó bằng checkout ngắn, cho mua với tư cách khách, hiện phí ship sớm và thanh toán tin cậy. <strong>Email/thông báo nhắc giỏ bỏ quên</strong> cứu lại đơn hàng đã mất.</p>
<h3>Review &amp; bằng chứng xã hội</h3>
<p>Đánh giá, ảnh và số "đã bán" trấn an người mua. Trên Shopee/Tiki, review tốt trực tiếp nâng chuyển đổi và thứ hạng tìm kiếm trong nền tảng.</p>
<h3>Giữ chân: rẻ hơn thu hút mới</h3>
<ul>
<li><strong>Chương trình loyalty</strong> — điểm, hạng thành viên, voucher thưởng khách mua lại.</li>
<li><strong>Remarketing</strong> — hiển thị quảng cáo cho người đã ghé hoặc thêm giỏ mà chưa mua.</li>
<li><strong>Livestream commerce</strong> — người bán demo sản phẩm trực tiếp với ưu đãi giới hạn giờ; một kênh bán lớn trên Shopee Live &amp; TikTok Shop tại VN.</li>
</ul>
<div class="callout"><span class="badge">Vì sao giữ chân thắng</span> Kiếm khách mới tốn hơn nhiều so với giữ khách cũ. Người mua quay lại với voucher loyalty và trải nghiệm tốt sẽ mua tiếp — nâng CLV (giá trị vòng đời khách hàng).</div>`,
  ]]);

const c7q = quiz('dme201c-quiz-7', 'Quiz 7 — Experience & retention|||Quiz 7 — Trải nghiệm & giữ chân', [
  { id: 'q1', question: '"Cart abandonment" (bỏ giỏ hàng) là?|||"Cart abandonment" means?', options: ['Khách xoá tài khoản', 'Khách thêm hàng vào giỏ nhưng rời đi mà không hoàn tất mua|||A shopper adds items to cart but leaves without completing the purchase', 'Sàn xoá sản phẩm', 'Giao hàng thất bại'], correctIndex: 1, explanation: 'Bỏ giỏ = thêm vào giỏ nhưng không thanh toán.' },
  { id: 'q2', question: 'Remarketing nhắm tới ai?|||Remarketing targets whom?', options: ['Người chưa từng nghe tới thương hiệu', 'Người đã ghé hoặc thêm giỏ nhưng chưa mua|||People who visited or added to cart but did not buy', 'Chỉ khách hàng trung thành', 'Đối thủ cạnh tranh'], correctIndex: 1, explanation: 'Remarketing "đuổi theo" người đã tương tác mà chưa chuyển đổi.' },
  { id: 'q3', question: 'Vì sao giữ chân khách cũ thường có giá trị hơn thu hút khách mới?|||Why is retaining customers often more valuable than acquiring new ones?', options: ['Vì khách mới không mua bao giờ', 'Vì giữ khách rẻ hơn và khách quay lại mua tiếp, nâng CLV|||Because it is cheaper and returning buyers purchase again, raising CLV', 'Vì quảng cáo bị cấm', 'Vì sàn thu phí khách mới'], correctIndex: 1, explanation: 'Giữ chân rẻ hơn thu hút, và mua lại nâng giá trị vòng đời (CLV).' },
]);

const c8 = doc('dme201c-8-1-analytics', '8.1 — Analytics & optimization|||8.1 — Phân tích & tối ưu',
  'Web analytics (GA4); KPI TMĐT (conversion rate, AOV, CLV); A/B testing; đạo đức dữ liệu & quyền riêng tư (GDPR/Nghị định 13).',
  [[
    `<span class="eyebrow">DME201c · Chapter 8 · Lesson 8.1</span>
<h2>Analytics &amp; optimization</h2>
<h3>Web analytics: GA4</h3>
<p><strong>Google Analytics 4 (GA4)</strong> is event-based: it tracks page views, add-to-cart, checkout and purchase, showing where users come from and where they drop off. What you can't measure, you can't improve.</p>
<h3>E-commerce KPIs</h3>
<pre><code>Conversion rate = orders / visitors
AOV (avg order value) = revenue / orders
CLV (customer lifetime value) = value a customer brings over time
Also: traffic, CTR, CAC (cost to acquire a customer), ROAS</code></pre>
<h3>A/B testing</h3>
<p>Show version A to half your visitors and version B to the other half; keep the one that converts better. Test one thing at a time (a headline, a button, a price display) and decide by data, not opinion.</p>
<h3>Data ethics &amp; privacy</h3>
<p>Collecting behavior data brings responsibility: get consent (cookie banners), be transparent, and follow privacy law — <strong>GDPR</strong> in the EU and Vietnam's <strong>Nghị định 13/2023 (PDPD)</strong> on personal data protection.</p>
<div class="callout"><span class="badge">Close the loop</span> Analytics feeds back into RACE: measure each stage, A/B-test the weak step, and optimize — that is the whole job of a digital marketer.</div>`,
    `<span class="eyebrow">DME201c · Chương 8 · Bài 8.1</span>
<h2>Phân tích &amp; tối ưu</h2>
<h3>Web analytics: GA4</h3>
<p><strong>Google Analytics 4 (GA4)</strong> hoạt động theo sự kiện: theo dõi lượt xem, thêm giỏ, checkout và mua, cho thấy người dùng đến từ đâu và rơi rớt ở đâu. Không đo được thì không cải thiện được.</p>
<h3>KPI thương mại điện tử</h3>
<pre><code>Tỉ lệ chuyển đổi = số đơn / số khách
AOV (giá trị đơn TB) = doanh thu / số đơn
CLV (giá trị vòng đời khách) = giá trị một khách mang lại theo thời gian
Kèm: lưu lượng, CTR, CAC (chi phí có được một khách), ROAS</code></pre>
<h3>A/B testing</h3>
<p>Cho một nửa khách thấy phiên bản A, nửa kia thấy phiên bản B; giữ bản chuyển đổi tốt hơn. Mỗi lần chỉ thử một thứ (một tiêu đề, một nút, cách hiện giá) và quyết định bằng dữ liệu, không phải ý kiến.</p>
<h3>Đạo đức dữ liệu &amp; quyền riêng tư</h3>
<p>Thu thập dữ liệu hành vi đi kèm trách nhiệm: xin đồng ý (banner cookie), minh bạch, và tuân thủ luật riêng tư — <strong>GDPR</strong> ở EU và <strong>Nghị định 13/2023 (PDPD)</strong> của Việt Nam về bảo vệ dữ liệu cá nhân.</p>
<div class="callout"><span class="badge">Khép vòng lặp</span> Phân tích phản hồi ngược vào RACE: đo từng bước, A/B-test bước yếu, và tối ưu — đó chính là toàn bộ công việc của một nhà marketing số.</div>`,
  ]]);

const c8q = quiz('dme201c-quiz-8', 'Quiz 8 — Analytics & optimization|||Quiz 8 — Phân tích & tối ưu', [
  { id: 'q1', question: 'AOV (average order value) được tính bằng?|||AOV (average order value) is calculated as?', options: ['Số đơn / số khách', 'Doanh thu / số đơn|||Revenue / number of orders', 'Chi phí quảng cáo / doanh thu', 'Số khách / số đơn'], correctIndex: 1, explanation: 'AOV = doanh thu chia cho số đơn hàng.' },
  { id: 'q2', question: 'Nguyên tắc cốt lõi khi làm A/B testing là?|||A core principle of A/B testing is?', options: ['Đổi nhiều thứ cùng lúc cho nhanh', 'Chỉ thử một thay đổi mỗi lần và quyết định bằng dữ liệu|||Test one change at a time and decide by data', 'Luôn chọn bản đẹp hơn', 'Không cần đo lường'], correctIndex: 1, explanation: 'Thử một biến mỗi lần thì mới biết yếu tố nào gây khác biệt.' },
  { id: 'q3', question: 'Ở Việt Nam, luật nào điều chỉnh bảo vệ dữ liệu cá nhân?|||In Vietnam, which regulation governs personal data protection?', options: ['GDPR', 'Nghị định 13/2023 (PDPD)|||Decree 13/2023 (PDPD)', 'Luật quảng cáo Google', 'Tiêu chuẩn PCI'], correctIndex: 1, explanation: 'Nghị định 13/2023 (PDPD) là khung bảo vệ dữ liệu cá nhân của VN; GDPR áp dụng ở EU.' },
]);

export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    courseCode: 'DME201c',
    slug: 'dme201c-digital-marketing-and-e-commerce',
    title: 'Digital Marketing and E-commerce',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DME201c.webp',
    shortDescription: 'Digital marketing & e-commerce end to end — digital ecosystem, business models, RACE & customer journey, CRO, SEO & Google Ads, social & content, Shopify/Shopee/Lazada/Tiki operations, checkout & loyalty, GA4 KPIs (conversion/AOV/CLV) & A/B testing.|||Marketing số & TMĐT — hệ sinh thái digital, mô hình kinh doanh, RACE & hành trình khách hàng, CRO, SEO & Google Ads, social & content, vận hành Shopify/Shopee/Lazada/Tiki, checkout & loyalty, KPI GA4 (conversion/AOV/CLV) & A/B testing.',
    description: 'Môn <strong>DME201c — Digital Marketing and E-commerce</strong> (Marketing số &amp; Thương mại điện tử, khối Công nghệ Truyền thông) dạy cách <strong>thu hút, chuyển đổi và giữ chân khách hàng online</strong>, đồng thời <strong>vận hành một cửa hàng TMĐT thật</strong>. Từ <strong>khái niệm &amp; mô hình kinh doanh</strong> (B2C/B2B/C2C/D2C) → <strong>chiến lược &amp; hành trình khách hàng</strong> (RACE) → <strong>website &amp; CRO</strong> → <strong>SEO &amp; SEM</strong> → <strong>social &amp; content</strong> → <strong>nền tảng &amp; vận hành</strong> (Shopify, Shopee/Lazada/Tiki) → <strong>trải nghiệm mua &amp; giữ chân</strong> → <strong>phân tích &amp; tối ưu</strong> (GA4, KPI, A/B testing). Bám sách chuẩn quốc tế (Chaffey, Laudon &amp; Traver, Kingsnorth), song ngữ, ví dụ thương hiệu &amp; sàn thật, quiz mỗi chương.',
    whatYouLearn: 'Marketing số &amp; TMĐT là gì; owned/earned/paid media; mô hình B2C/B2B/C2C/D2C; khung RACE &amp; hành trình khách hàng/phễu; UX, landing page &amp; CRO, mobile-first; SEO (từ khoá, on-page) &amp; SEM/PPC (Google Ads, CPC/CTR/ROAS); social, content, KOL/KOC, email; cửa hàng vs marketplace, sản phẩm/tồn kho, thanh toán (COD/MoMo/VNPay), logistics &amp; fulfillment; giỏ hàng/checkout, review, loyalty, remarketing, livestream commerce; GA4, KPI (conversion/AOV/CLV), A/B testing, đạo đức &amp; quyền riêng tư dữ liệu.',
    requirements: 'Không cần nền kỹ thuật. Nên có tài khoản Google (để dùng Google Ads/GA4 bản học) và một tài khoản sàn TMĐT (Shopee/Tiki) để quan sát thực tế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn quốc tế, chứng chỉ Google/Meta, nền tảng thực hành, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Marketing số vs truyền thống; lộ trình 8 chương; vòng lặp RACE.', lessons: [intro] },
    { title: 'Chương 1 — Marketing số & TMĐT là gì|||Chapter 1 — What they are', description: 'Khái niệm, hệ sinh thái digital, mô hình B2C/B2B/C2C/D2C.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chiến lược & hành trình khách hàng|||Chapter 2 — Strategy & journey', description: 'RACE, hành trình khách hàng, phễu marketing.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Website & tối ưu chuyển đổi|||Chapter 3 — Website & CRO', description: 'UX, landing page, CRO, mobile-first.', lessons: [c3, c3q] },
    { title: 'Chương 4 — SEO & SEM|||Chapter 4 — SEO & SEM', description: 'Tìm kiếm tự nhiên, từ khoá, Google Ads, PPC.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Social & content|||Chapter 5 — Social & content', description: 'Social media, content, influencer/KOC, email.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nền tảng TMĐT & vận hành|||Chapter 6 — Platforms & operations', description: 'Shopify/marketplace, sản phẩm, thanh toán, logistics.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Trải nghiệm mua & giữ chân|||Chapter 7 — Experience & retention', description: 'Giỏ hàng, checkout, review, loyalty, remarketing, livestream.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Phân tích & tối ưu|||Chapter 8 — Analytics & optimization', description: 'GA4, KPI (conversion/AOV/CLV), A/B testing, đạo đức dữ liệu.', lessons: [c8, c8q] },
  ],
};
