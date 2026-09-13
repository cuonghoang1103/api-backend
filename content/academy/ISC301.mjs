/**
 * ISC301 — e-Commerce (Thương mại điện tử). Ngành Hệ thống thông tin FPTU, Kỳ 7.
 * Tài liệu: Laudon & Traver "E-commerce: Business, Technology, Society"; Turban
 * "Electronic Commerce: A Managerial and Social Networks Perspective"; tài liệu
 * Shopify/Shopee. 8 chương, song ngữ + ví dụ sàn/doanh nghiệp thật VN + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('isc301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế, tài liệu sàn TMĐT, YouTube, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">ISC301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>e-Commerce</strong> — from what e-commerce is, through business models, payment, marketing and logistics, to security and analytics — in one place. The official FPTU slides &amp; giáo trình live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ISC301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>E-commerce: Business, Technology, Society</em> — Kenneth C. Laudon &amp; Carol Guercio Traver (the standard text).</li>
<li><em>Electronic Commerce: A Managerial and Social Networks Perspective</em> — Efraim Turban et al.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://help.shopify.com/" target="_blank" rel="noopener">Shopify Help Center</a> — how a real storefront platform works.</li>
<li><a href="https://banhang.shopee.vn/edu" target="_blank" rel="noopener">Shopee Uni</a> — seller education from a leading VN marketplace.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li>Shopify — official tutorials on building and running an online store.</li>
<li>Shopee / Lazada seller channels — marketplace operations in Vietnam.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>Shopify / WooCommerce — build a real storefront.</li>
<li>Shopee, Lazada, Tiki seller centers — list and manage products on VN marketplaces.</li>
<li>Google Analytics 4 — measure traffic, conversion and revenue.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what e-commerce is, the B2C/B2B/C2C/O2O models, business &amp; revenue models.</li>
<li><strong>Build</strong> — tech infrastructure, e-payment and a working storefront or marketplace shop.</li>
<li><strong>Grow</strong> — digital marketing, logistics &amp; fulfillment, customer experience and retention.</li>
<li><strong>Operate safely</strong> — security, VN e-commerce &amp; consumer-protection law, and analytics (conversion, AOV, CLV).</li>
</ol></div>`,
    `<span class="eyebrow">ISC301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Thương mại điện tử</strong> — từ TMĐT là gì, qua mô hình kinh doanh, thanh toán, marketing và logistics, tới bảo mật và phân tích — gom về một chỗ. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ISC301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>E-commerce: Business, Technology, Society</em> — Kenneth C. Laudon &amp; Carol Guercio Traver (sách chuẩn quốc tế).</li>
<li><em>Electronic Commerce: A Managerial and Social Networks Perspective</em> — Efraim Turban và cộng sự.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://help.shopify.com/" target="_blank" rel="noopener">Shopify Help Center</a> — cách một nền tảng gian hàng thật vận hành.</li>
<li><a href="https://banhang.shopee.vn/edu" target="_blank" rel="noopener">Shopee Uni</a> — đào tạo người bán từ một sàn lớn ở VN.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li>Shopify — hướng dẫn chính thức dựng và vận hành cửa hàng trực tuyến.</li>
<li>Kênh người bán Shopee / Lazada — vận hành trên sàn tại Việt Nam.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li>Shopify / WooCommerce — dựng gian hàng thật.</li>
<li>Trung tâm người bán Shopee, Lazada, Tiki — đăng và quản lý sản phẩm trên sàn VN.</li>
<li>Google Analytics 4 — đo lượng truy cập, tỉ lệ chuyển đổi và doanh thu.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — TMĐT là gì, các mô hình B2C/B2B/C2C/O2O, mô hình kinh doanh &amp; doanh thu.</li>
<li><strong>Xây dựng</strong> — hạ tầng công nghệ, thanh toán điện tử và một gian hàng/shop trên sàn chạy được.</li>
<li><strong>Tăng trưởng</strong> — marketing số, logistics &amp; giao vận, trải nghiệm và giữ chân khách hàng.</li>
<li><strong>Vận hành an toàn</strong> — bảo mật, luật TMĐT &amp; bảo vệ người tiêu dùng VN, và phân tích (conversion, AOV, CLV).</li>
</ol></div>`,
  ]]);

const intro = doc('isc301-0-1-overview', 'Course overview: e-Commerce|||Tổng quan: Thương mại điện tử',
  'TMĐT làm gì; vì sao quan trọng; lộ trình 8 chương: khái niệm & mô hình → kinh doanh & doanh thu → hạ tầng → thanh toán → marketing → logistics → trải nghiệm → bảo mật, pháp lý & phân tích.',
  [[
    `<span class="eyebrow">ISC301 · Lesson 0.1 · Overview</span>
<h2>e-Commerce</h2>
<p class="lead">This course explains <strong>how commerce works online</strong> — how a customer discovers a product, pays for it, and receives it, and how a business builds, markets, ships and measures all of that. You will study the technology, the business models and the operations behind stores like <strong>Shopee, Lazada, Tiki</strong> and brand sites.</p>
<h3>Why e-commerce matters</h3>
<p>Vietnam is one of the fastest-growing e-commerce markets in Southeast Asia. Understanding how online selling works — the platforms, payments, logistics and data — is now core knowledge for anyone in information systems and business technology.</p>
<h3>Roadmap (8 chapters)</h3>
<p>What e-commerce is &amp; its models → business &amp; revenue models → tech infrastructure → e-payment → digital marketing → logistics &amp; operations → customer experience &amp; retention → security, law &amp; analytics. Bilingual, with real Vietnamese marketplace and business examples, plus a quiz per chapter.</p>`,
    `<span class="eyebrow">ISC301 · Bài 0.1 · Tổng quan</span>
<h2>Thương mại điện tử</h2>
<p class="lead">Môn này giải thích <strong>thương mại vận hành trực tuyến ra sao</strong> — khách hàng tìm ra sản phẩm, thanh toán và nhận hàng thế nào, và doanh nghiệp xây dựng, tiếp thị, giao hàng và đo lường tất cả những việc đó ra sao. Bạn học công nghệ, mô hình kinh doanh và vận hành đằng sau các nơi như <strong>Shopee, Lazada, Tiki</strong> và website thương hiệu.</p>
<h3>Vì sao TMĐT quan trọng</h3>
<p>Việt Nam là một trong những thị trường TMĐT tăng trưởng nhanh nhất Đông Nam Á. Hiểu bán hàng trực tuyến vận hành thế nào — nền tảng, thanh toán, logistics và dữ liệu — giờ là kiến thức cốt lõi cho người làm hệ thống thông tin và công nghệ kinh doanh.</p>
<h3>Lộ trình (8 chương)</h3>
<p>TMĐT là gì &amp; các mô hình → mô hình kinh doanh &amp; doanh thu → hạ tầng công nghệ → thanh toán điện tử → marketing số → logistics &amp; vận hành → trải nghiệm &amp; giữ chân khách hàng → bảo mật, pháp lý &amp; phân tích. Song ngữ, có ví dụ sàn và doanh nghiệp thật ở Việt Nam, kèm quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('isc301-1-1-what-is-ecommerce', '1.1 — What e-Commerce is|||1.1 — Thương mại điện tử là gì',
  'Khái niệm, lịch sử; các mô hình B2C/B2B/C2C/C2B/O2O; đặc điểm riêng của TMĐT (phi tuyến vị trí, thông tin phong phú, cá nhân hoá).',
  [[
    `<span class="eyebrow">ISC301 · Chapter 1 · Lesson 1.1</span>
<h2>What e-commerce is</h2>
<p><strong>E-commerce</strong> is the buying and selling of goods and services over digital networks, plus the transactions and processes that support it. It grew from early online catalogs in the 1990s to today's mobile-first marketplaces and social commerce.</p>
<h3>The main models</h3>
<ul>
<li><strong>B2C</strong> (Business-to-Consumer) — a business sells to shoppers, e.g. <strong>Tiki</strong> or a brand's own site.</li>
<li><strong>B2B</strong> (Business-to-Business) — one business sells to another, e.g. wholesale platforms.</li>
<li><strong>C2C</strong> (Consumer-to-Consumer) — individuals sell to each other on a marketplace, e.g. <strong>Shopee</strong> or <strong>Chợ Tốt</strong>.</li>
<li><strong>C2B</strong> (Consumer-to-Business) — individuals offer to businesses, e.g. freelancers, influencers.</li>
<li><strong>O2O</strong> (Online-to-Offline) — online drives offline purchase/pickup, e.g. order online, collect in store.</li>
</ul>
<h3>What makes e-commerce different</h3>
<p>It is <strong>ubiquitous</strong> (buy anywhere, anytime), has <strong>global reach</strong>, offers <strong>information richness</strong>, and enables <strong>personalization</strong> — showing each shopper different products and prices based on their data.</p>
<div class="callout"><span class="badge">VN example</span> Shopee is largely a C2C/B2C marketplace; a coffee brand selling on its own website is pure B2C.</div>`,
    `<span class="eyebrow">ISC301 · Chương 1 · Bài 1.1</span>
<h2>Thương mại điện tử là gì</h2>
<p><strong>Thương mại điện tử (TMĐT)</strong> là việc mua bán hàng hoá và dịch vụ qua mạng số, cùng các giao dịch và quy trình hỗ trợ nó. Nó phát triển từ catalog trực tuyến sơ khai thập niên 1990 tới các sàn ưu tiên di động và social commerce ngày nay.</p>
<h3>Các mô hình chính</h3>
<ul>
<li><strong>B2C</strong> (Doanh nghiệp tới người tiêu dùng) — doanh nghiệp bán cho người mua, vd <strong>Tiki</strong> hay website của thương hiệu.</li>
<li><strong>B2B</strong> (Doanh nghiệp tới doanh nghiệp) — doanh nghiệp bán cho doanh nghiệp, vd sàn bán buôn.</li>
<li><strong>C2C</strong> (Người tiêu dùng tới người tiêu dùng) — cá nhân bán cho nhau trên sàn, vd <strong>Shopee</strong> hay <strong>Chợ Tốt</strong>.</li>
<li><strong>C2B</strong> (Người tiêu dùng tới doanh nghiệp) — cá nhân chào dịch vụ cho doanh nghiệp, vd freelancer, người ảnh hưởng.</li>
<li><strong>O2O</strong> (Trực tuyến tới ngoại tuyến) — online dẫn tới mua/nhận offline, vd đặt online rồi lấy tại cửa hàng.</li>
</ul>
<h3>Điều làm TMĐT khác biệt</h3>
<p>Nó <strong>hiện diện khắp nơi</strong> (mua bất cứ đâu, bất cứ lúc nào), có <strong>tầm với toàn cầu</strong>, cho <strong>thông tin phong phú</strong>, và cho phép <strong>cá nhân hoá</strong> — hiển thị sản phẩm và giá khác nhau cho từng người dựa trên dữ liệu của họ.</p>
<div class="callout"><span class="badge">Ví dụ VN</span> Shopee chủ yếu là sàn C2C/B2C; một thương hiệu cà phê bán trên website riêng là B2C thuần.</div>`,
  ]]);

const c1q = quiz('isc301-quiz-1', 'Quiz 1 — What e-commerce is|||Quiz 1 — TMĐT là gì', [
  { id: 'q1', question: 'Cá nhân bán cho cá nhân trên Shopee/Chợ Tốt là mô hình?', options: ['B2B', 'B2C', 'C2C', 'C2B'], correctIndex: 2, explanation: 'C2C: người tiêu dùng bán cho người tiêu dùng qua một sàn trung gian.' },
  { id: 'q2', question: 'O2O (Online-to-Offline) nghĩa là?', options: ['Bán buôn giữa doanh nghiệp', 'Online dẫn tới mua/nhận hàng offline', 'Chỉ bán qua mạng xã hội', 'Đấu giá trực tuyến'], correctIndex: 1, explanation: 'O2O: kênh online thúc đẩy giao dịch/nhận hàng tại điểm offline.' },
  { id: 'q3', question: 'Đặc điểm nào KHÔNG phải của TMĐT?', options: ['Hiện diện khắp nơi', 'Tầm với toàn cầu', 'Cá nhân hoá theo dữ liệu', 'Bắt buộc gặp mặt trực tiếp'], correctIndex: 3, explanation: 'TMĐT không đòi gặp mặt; giao dịch diễn ra qua mạng số.' },
]);

const c2 = doc('isc301-2-1-business-revenue-models', '2.1 — Business & revenue models|||2.1 — Mô hình kinh doanh & doanh thu',
  'Business model vs revenue model; value proposition; các nguồn doanh thu (bán hàng, hoa hồng, phí, quảng cáo, thuê bao); marketplace vs D2C.',
  [[
    `<span class="eyebrow">ISC301 · Chapter 2 · Lesson 2.1</span>
<h2>Business &amp; revenue models</h2>
<h3>Two different questions</h3>
<ul>
<li><strong>Business model</strong> — how a company creates and delivers value: who the customer is, the <strong>value proposition</strong>, and how the whole thing hangs together.</li>
<li><strong>Revenue model</strong> — specifically <em>how it makes money</em>.</li>
</ul>
<h3>Common revenue models</h3>
<ul>
<li><strong>Sales</strong> — sell goods directly (a D2C brand site).</li>
<li><strong>Commission / transaction fee</strong> — take a cut of each sale (a marketplace like Shopee, Lazada).</li>
<li><strong>Advertising</strong> — sell placement and promoted listings.</li>
<li><strong>Subscription</strong> — recurring fee for access (Netflix, membership boxes).</li>
<li><strong>Listing / service fees</strong> — charge sellers to list or use tools.</li>
</ul>
<h3>Marketplace vs D2C</h3>
<p>A <strong>marketplace</strong> connects many sellers and buyers and earns commissions (Shopee, Tiki, Lazada). A <strong>D2C</strong> (direct-to-consumer) brand sells its own products on its own channel, keeping the full margin but paying for its own traffic.</p>
<div class="callout"><span class="badge">VN example</span> Shopee earns commission + ads (marketplace); a brand like Coolmate selling on coolmate.me is D2C.</div>`,
    `<span class="eyebrow">ISC301 · Chương 2 · Bài 2.1</span>
<h2>Mô hình kinh doanh &amp; doanh thu</h2>
<h3>Hai câu hỏi khác nhau</h3>
<ul>
<li><strong>Mô hình kinh doanh</strong> — công ty tạo và trao giá trị thế nào: khách hàng là ai, <strong>giá trị cốt lõi (value proposition)</strong>, và mọi thứ khớp với nhau ra sao.</li>
<li><strong>Mô hình doanh thu</strong> — cụ thể là <em>kiếm tiền bằng cách nào</em>.</li>
</ul>
<h3>Các mô hình doanh thu phổ biến</h3>
<ul>
<li><strong>Bán hàng</strong> — bán trực tiếp hàng hoá (website thương hiệu D2C).</li>
<li><strong>Hoa hồng / phí giao dịch</strong> — thu một phần mỗi đơn (sàn như Shopee, Lazada).</li>
<li><strong>Quảng cáo</strong> — bán vị trí hiển thị và tin đăng được đẩy.</li>
<li><strong>Thuê bao</strong> — phí định kỳ để truy cập (Netflix, hộp hội viên).</li>
<li><strong>Phí đăng tin / dịch vụ</strong> — thu của người bán để đăng hoặc dùng công cụ.</li>
</ul>
<h3>Sàn (marketplace) vs D2C</h3>
<p>Một <strong>sàn</strong> kết nối nhiều người bán và người mua và thu hoa hồng (Shopee, Tiki, Lazada). Một thương hiệu <strong>D2C</strong> (bán thẳng tới người tiêu dùng) bán sản phẩm của mình trên kênh riêng, giữ trọn biên lợi nhuận nhưng tự trả tiền cho lượng truy cập.</p>
<div class="callout"><span class="badge">Ví dụ VN</span> Shopee kiếm hoa hồng + quảng cáo (sàn); thương hiệu như Coolmate bán trên coolmate.me là D2C.</div>`,
  ]]);

const c2q = quiz('isc301-quiz-2', 'Quiz 2 — Business & revenue|||Quiz 2 — Kinh doanh & doanh thu', [
  { id: 'q1', question: 'Sàn TMĐT như Shopee, Lazada kiếm tiền chủ yếu bằng?', options: ['Thuê bao hằng tháng của người mua', 'Hoa hồng/phí giao dịch + quảng cáo', 'Bán phần cứng', 'Phí gặp mặt trực tiếp'], correctIndex: 1, explanation: 'Sàn thu hoa hồng trên mỗi đơn và bán quảng cáo/đẩy tin.' },
  { id: 'q2', question: 'Mô hình D2C (direct-to-consumer) khác sàn ở chỗ?', options: ['Không có website', 'Bán thẳng sản phẩm của mình trên kênh riêng, giữ trọn biên lợi nhuận', 'Chỉ bán buôn', 'Không cần marketing'], correctIndex: 1, explanation: 'D2C bán trực tiếp trên kênh riêng, giữ biên lợi nhuận nhưng tự lo traffic.' },
  { id: 'q3', question: 'Value proposition (giá trị cốt lõi) trả lời câu hỏi?', options: ['Máy chủ đặt ở đâu', 'Vì sao khách chọn ta thay vì đối thủ', 'Dùng ngôn ngữ lập trình nào', 'Giao hàng mất bao lâu'], correctIndex: 1, explanation: 'Value proposition là lý do khách nhận được giá trị và chọn bạn.' },
]);

const c3 = doc('isc301-3-1-tech-infrastructure', '3.1 — E-commerce technology infrastructure|||3.1 — Hạ tầng công nghệ TMĐT',
  'Web/app phía khách; nền tảng (Shopify/WooCommerce/sàn); hosting & CDN; kiến trúc hệ thống TMĐT (catalog, giỏ hàng, đơn hàng, thanh toán, kho).',
  [[
    `<span class="eyebrow">ISC301 · Chapter 3 · Lesson 3.1</span>
<h2>E-commerce technology infrastructure</h2>
<h3>The storefront</h3>
<p>Customers meet the store as a <strong>website or mobile app</strong>. It must be fast, mobile-first and searchable. Speed and uptime directly affect sales.</p>
<h3>Platform choices</h3>
<ul>
<li><strong>Hosted platform</strong> — Shopify: fastest to launch, less control.</li>
<li><strong>Self-hosted</strong> — WooCommerce/Magento: full control, more maintenance.</li>
<li><strong>Marketplace</strong> — sell on Shopee/Lazada: instant traffic, less ownership of the customer.</li>
</ul>
<h3>System architecture</h3>
<p>Behind the storefront sit several cooperating parts:</p>
<pre><code>Storefront (web/app)
  -&gt; Product catalog &amp; search
  -&gt; Shopping cart &amp; checkout
  -&gt; Order management
  -&gt; Payment gateway
  -&gt; Inventory / warehouse
  -&gt; Shipping / logistics
</code></pre>
<p><strong>Hosting &amp; CDN</strong> keep pages and images loading quickly worldwide; databases store products, orders and customers.</p>
<div class="callout"><span class="badge">Trade-off</span> A marketplace gives you traffic on day one; your own store gives you the customer relationship and data. Many VN brands do both.</div>`,
    `<span class="eyebrow">ISC301 · Chương 3 · Bài 3.1</span>
<h2>Hạ tầng công nghệ TMĐT</h2>
<h3>Gian hàng (storefront)</h3>
<p>Khách gặp cửa hàng dưới dạng <strong>website hoặc ứng dụng di động</strong>. Nó phải nhanh, ưu tiên di động và dễ tìm kiếm. Tốc độ và độ sẵn sàng ảnh hưởng trực tiếp tới doanh số.</p>
<h3>Lựa chọn nền tảng</h3>
<ul>
<li><strong>Nền tảng dịch vụ (hosted)</strong> — Shopify: lên nhanh nhất, ít quyền kiểm soát.</li>
<li><strong>Tự dựng (self-hosted)</strong> — WooCommerce/Magento: toàn quyền, phải tự bảo trì nhiều hơn.</li>
<li><strong>Sàn</strong> — bán trên Shopee/Lazada: có traffic ngay, ít sở hữu khách hàng.</li>
</ul>
<h3>Kiến trúc hệ thống</h3>
<p>Sau gian hàng là nhiều bộ phận phối hợp:</p>
<pre><code>Gian hàng (web/app)
  -&gt; Danh mục sản phẩm &amp; tìm kiếm
  -&gt; Giỏ hàng &amp; thanh toán
  -&gt; Quản lý đơn hàng
  -&gt; Cổng thanh toán
  -&gt; Tồn kho / kho hàng
  -&gt; Giao vận / logistics
</code></pre>
<p><strong>Hosting &amp; CDN</strong> giúp trang và ảnh tải nhanh trên toàn cầu; cơ sở dữ liệu lưu sản phẩm, đơn hàng và khách hàng.</p>
<div class="callout"><span class="badge">Đánh đổi</span> Sàn cho bạn traffic ngay ngày đầu; cửa hàng riêng cho bạn quan hệ và dữ liệu khách hàng. Nhiều thương hiệu VN làm cả hai.</div>`,
  ]]);

const c3q = quiz('isc301-quiz-3', 'Quiz 3 — Tech infrastructure|||Quiz 3 — Hạ tầng công nghệ', [
  { id: 'q1', question: 'Nền tảng nào lên gian hàng nhanh nhất nhưng ít quyền kiểm soát nhất?', options: ['Tự dựng WooCommerce', 'Shopify (hosted)', 'Tự viết từ đầu', 'Magento tự host'], correctIndex: 1, explanation: 'Shopify là nền tảng dịch vụ: lên nhanh, đổi lại ít quyền tuỳ biến sâu.' },
  { id: 'q2', question: 'Thành phần nào xử lý việc thu tiền của khách trong kiến trúc TMĐT?', options: ['Danh mục sản phẩm', 'Cổng thanh toán (payment gateway)', 'Tồn kho', 'CDN'], correctIndex: 1, explanation: 'Cổng thanh toán kết nối giao dịch với ngân hàng/ví để thu tiền.' },
  { id: 'q3', question: 'Bán trên sàn (Shopee/Lazada) đánh đổi điều gì so với cửa hàng riêng?', options: ['Mất traffic ngày đầu', 'Có traffic ngay nhưng ít sở hữu khách hàng & dữ liệu', 'Không thể bán được', 'Không cần sản phẩm'], correctIndex: 1, explanation: 'Sàn cho traffic tức thì nhưng quan hệ và dữ liệu khách thuộc về sàn.' },
]);

const c4 = doc('isc301-4-1-e-payment', '4.1 — Electronic payment|||4.1 — Thanh toán điện tử',
  'Cổng thanh toán; ví điện tử MoMo/VNPay/ZaloPay; thẻ; COD (giao hàng thu tiền); an toàn giao dịch (mã hoá, 3-D Secure, chống gian lận).',
  [[
    `<span class="eyebrow">ISC301 · Chapter 4 · Lesson 4.1</span>
<h2>Electronic payment</h2>
<h3>How money moves</h3>
<p>A <strong>payment gateway</strong> sits between the store and the banks. It securely captures the payment, checks it, and moves funds from the buyer to the seller.</p>
<h3>Payment methods in Vietnam</h3>
<ul>
<li><strong>E-wallets</strong> — <strong>MoMo, VNPay, ZaloPay</strong>: scan a QR code or confirm in-app.</li>
<li><strong>Cards</strong> — domestic ATM/napas cards and international Visa/Mastercard.</li>
<li><strong>Bank transfer / QR</strong> — VietQR interbank transfers.</li>
<li><strong>COD (Cash on Delivery)</strong> — pay the courier in cash on arrival; still very common in VN because it builds buyer trust.</li>
</ul>
<h3>Transaction safety</h3>
<ul>
<li><strong>Encryption (TLS)</strong> — data is scrambled in transit.</li>
<li><strong>3-D Secure / OTP</strong> — the bank verifies the cardholder with a one-time code.</li>
<li><strong>Fraud detection</strong> — flag unusual orders and chargebacks.</li>
</ul>
<div class="callout"><span class="badge">Why COD persists</span> Many VN shoppers still prefer COD because they only pay after seeing the product — reducing perceived risk. Good e-commerce supports COD alongside e-wallets.</div>`,
    `<span class="eyebrow">ISC301 · Chương 4 · Bài 4.1</span>
<h2>Thanh toán điện tử</h2>
<h3>Dòng tiền chạy thế nào</h3>
<p>Một <strong>cổng thanh toán (payment gateway)</strong> nằm giữa cửa hàng và ngân hàng. Nó thu thông tin thanh toán an toàn, kiểm tra, và chuyển tiền từ người mua sang người bán.</p>
<h3>Phương thức thanh toán ở Việt Nam</h3>
<ul>
<li><strong>Ví điện tử</strong> — <strong>MoMo, VNPay, ZaloPay</strong>: quét mã QR hoặc xác nhận trong ứng dụng.</li>
<li><strong>Thẻ</strong> — thẻ ATM/napas nội địa và Visa/Mastercard quốc tế.</li>
<li><strong>Chuyển khoản / QR</strong> — chuyển khoản liên ngân hàng VietQR.</li>
<li><strong>COD (giao hàng thu tiền)</strong> — trả tiền mặt cho shipper khi nhận; vẫn rất phổ biến ở VN vì tạo niềm tin cho người mua.</li>
</ul>
<h3>An toàn giao dịch</h3>
<ul>
<li><strong>Mã hoá (TLS)</strong> — dữ liệu được xáo trộn khi truyền đi.</li>
<li><strong>3-D Secure / OTP</strong> — ngân hàng xác thực chủ thẻ bằng mã dùng một lần.</li>
<li><strong>Phát hiện gian lận</strong> — đánh dấu đơn bất thường và khiếu nại hoàn tiền.</li>
</ul>
<div class="callout"><span class="badge">Vì sao COD còn phổ biến</span> Nhiều người mua VN vẫn thích COD vì chỉ trả tiền sau khi thấy hàng — giảm rủi ro cảm nhận. TMĐT tốt hỗ trợ COD song song với ví điện tử.</div>`,
  ]]);

const c4q = quiz('isc301-quiz-4', 'Quiz 4 — E-payment|||Quiz 4 — Thanh toán điện tử', [
  { id: 'q1', question: 'COD trong TMĐT nghĩa là?', options: ['Trả trước bằng thẻ', 'Giao hàng rồi thu tiền mặt khi nhận', 'Trả bằng tiền mã hoá', 'Đặt cọc qua ví'], correctIndex: 1, explanation: 'COD = Cash on Delivery: trả tiền mặt cho shipper khi nhận hàng.' },
  { id: 'q2', question: 'MoMo, VNPay, ZaloPay thuộc nhóm phương thức nào?', options: ['Ví điện tử', 'Thẻ tín dụng quốc tế', 'Chuyển phát nhanh', 'Sàn TMĐT'], correctIndex: 0, explanation: 'Đây là các ví điện tử phổ biến ở Việt Nam.' },
  { id: 'q3', question: 'Cơ chế nào giúp ngân hàng xác thực chủ thẻ khi thanh toán online?', options: ['CDN', '3-D Secure / OTP', 'COD', 'SEO'], correctIndex: 1, explanation: '3-D Secure gửi OTP để xác nhận đúng chủ thẻ, chống gian lận.' },
]);

const c5 = doc('isc301-5-1-digital-marketing', '5.1 — Digital marketing for e-commerce|||5.1 — Marketing số cho TMĐT',
  'SEO/SEM; social & influencer; email; remarketing; bán trên sàn Shopee/Lazada/Tiki (từ khoá, flash sale, đánh giá, quảng cáo trong sàn).',
  [[
    `<span class="eyebrow">ISC301 · Chapter 5 · Lesson 5.1</span>
<h2>Digital marketing for e-commerce</h2>
<h3>Getting found</h3>
<ul>
<li><strong>SEO</strong> — rank in unpaid search results by matching what people search for.</li>
<li><strong>SEM / paid ads</strong> — buy placement on Google, Facebook, TikTok.</li>
</ul>
<h3>Engaging &amp; converting</h3>
<ul>
<li><strong>Social &amp; influencer</strong> — reach shoppers where they spend time; creators drive trust.</li>
<li><strong>Email</strong> — cheap, owned channel for offers and cart reminders.</li>
<li><strong>Remarketing</strong> — show ads to people who visited but didn't buy.</li>
</ul>
<h3>Selling on marketplaces</h3>
<p>On <strong>Shopee, Lazada, Tiki</strong>, marketing means: strong <strong>keywords</strong> in the title, joining <strong>flash sales</strong> and campaign days (like 9.9, 11.11), collecting good <strong>reviews</strong>, and buying <strong>in-marketplace ads</strong> to appear at the top of search.</p>
<div class="callout"><span class="badge">Funnel</span> Awareness → interest → consideration → purchase → loyalty. Different channels serve different stages: ads and SEO bring people in; email and remarketing bring them back.</div>`,
    `<span class="eyebrow">ISC301 · Chương 5 · Bài 5.1</span>
<h2>Marketing số cho TMĐT</h2>
<h3>Được tìm thấy</h3>
<ul>
<li><strong>SEO</strong> — lên hạng trong kết quả tìm kiếm không trả tiền bằng cách khớp điều người ta tìm.</li>
<li><strong>SEM / quảng cáo trả tiền</strong> — mua vị trí trên Google, Facebook, TikTok.</li>
</ul>
<h3>Thu hút &amp; chuyển đổi</h3>
<ul>
<li><strong>Mạng xã hội &amp; người ảnh hưởng</strong> — tiếp cận khách nơi họ dành thời gian; nhà sáng tạo tạo niềm tin.</li>
<li><strong>Email</strong> — kênh sở hữu, rẻ, để gửi ưu đãi và nhắc giỏ hàng.</li>
<li><strong>Remarketing</strong> — hiển thị quảng cáo cho người đã ghé mà chưa mua.</li>
</ul>
<h3>Bán trên sàn</h3>
<p>Trên <strong>Shopee, Lazada, Tiki</strong>, marketing nghĩa là: <strong>từ khoá</strong> mạnh trong tiêu đề, tham gia <strong>flash sale</strong> và ngày hội (như 9.9, 11.11), gom <strong>đánh giá</strong> tốt, và mua <strong>quảng cáo trong sàn</strong> để hiện lên đầu kết quả tìm kiếm.</p>
<div class="callout"><span class="badge">Phễu</span> Nhận biết → quan tâm → cân nhắc → mua → trung thành. Mỗi kênh phục vụ một giai đoạn: quảng cáo và SEO kéo người vào; email và remarketing kéo họ quay lại.</div>`,
  ]]);

const c5q = quiz('isc301-quiz-5', 'Quiz 5 — Digital marketing|||Quiz 5 — Marketing số', [
  { id: 'q1', question: 'SEO khác SEM ở điểm cốt lõi nào?', options: ['SEO là quảng cáo trả tiền', 'SEO là lên hạng tìm kiếm không trả tiền, SEM là trả tiền', 'SEM chỉ dùng email', 'Hai cái giống hệt nhau'], correctIndex: 1, explanation: 'SEO tối ưu để lên hạng tự nhiên; SEM/quảng cáo là mua vị trí trả tiền.' },
  { id: 'q2', question: 'Remarketing nhắm tới ai?', options: ['Người chưa từng biết đến shop', 'Người đã ghé thăm nhưng chưa mua', 'Chỉ nhân viên nội bộ', 'Đối thủ cạnh tranh'], correctIndex: 1, explanation: 'Remarketing hiển thị quảng cáo lại cho khách đã ghé mà chưa chuyển đổi.' },
  { id: 'q3', question: 'Trên sàn Shopee, cách nào giúp sản phẩm hiện lên đầu tìm kiếm?', options: ['Xoá hết đánh giá', 'Từ khoá tốt + quảng cáo trong sàn + tham gia flash sale', 'Tăng giá thật cao', 'Ẩn sản phẩm'], correctIndex: 1, explanation: 'Từ khoá, đánh giá, flash sale và quảng cáo trong sàn cùng nâng khả năng hiển thị.' },
]);

const c6 = doc('isc301-6-1-logistics-operations', '6.1 — Logistics & operations|||6.1 — Logistics & vận hành',
  'Fulfillment; kho hàng; giao vận GHN/GHTK/Viettel Post; quản lý đơn hàng; xử lý hoàn/đổi trả (reverse logistics).',
  [[
    `<span class="eyebrow">ISC301 · Chapter 6 · Lesson 6.1</span>
<h2>Logistics &amp; operations</h2>
<h3>Fulfillment — from click to doorstep</h3>
<p><strong>Fulfillment</strong> is everything that happens after the order: pick the item from the <strong>warehouse</strong>, pack it, hand it to a carrier, and deliver it. Speed and reliability here decide whether a customer returns.</p>
<h3>Shipping in Vietnam</h3>
<ul>
<li><strong>GHN</strong> (Giao Hàng Nhanh), <strong>GHTK</strong> (Giao Hàng Tiết Kiệm), <strong>Viettel Post</strong>, <strong>J&amp;T</strong> — the main last-mile carriers.</li>
<li>Marketplaces integrate these carriers so a seller just prints a label.</li>
</ul>
<h3>Order management &amp; returns</h3>
<ul>
<li><strong>Order management</strong> tracks each order's state: placed → confirmed → packed → shipped → delivered.</li>
<li><strong>Returns / reverse logistics</strong> — handling refunds and getting goods back is a real cost; a clear return policy builds trust but must be controlled.</li>
</ul>
<div class="callout"><span class="badge">Why it matters</span> Late or failed delivery is a top reason for bad reviews and churn. Operations, not just marketing, decide repeat purchase.</div>`,
    `<span class="eyebrow">ISC301 · Chương 6 · Bài 6.1</span>
<h2>Logistics &amp; vận hành</h2>
<h3>Fulfillment — từ cú nhấp tới tận cửa</h3>
<p><strong>Fulfillment (hoàn tất đơn)</strong> là mọi việc sau khi có đơn: lấy hàng từ <strong>kho</strong>, đóng gói, giao cho đơn vị vận chuyển, và giao tới khách. Tốc độ và độ tin cậy ở đây quyết định khách có quay lại không.</p>
<h3>Giao vận ở Việt Nam</h3>
<ul>
<li><strong>GHN</strong> (Giao Hàng Nhanh), <strong>GHTK</strong> (Giao Hàng Tiết Kiệm), <strong>Viettel Post</strong>, <strong>J&amp;T</strong> — các đơn vị giao chặng cuối chính.</li>
<li>Sàn tích hợp sẵn các đơn vị này nên người bán chỉ cần in vận đơn.</li>
</ul>
<h3>Quản lý đơn &amp; hoàn trả</h3>
<ul>
<li><strong>Quản lý đơn hàng</strong> theo dõi trạng thái từng đơn: đặt → xác nhận → đóng gói → giao vận → đã giao.</li>
<li><strong>Hoàn/đổi trả (reverse logistics)</strong> — xử lý hoàn tiền và nhận hàng về là chi phí thật; chính sách đổi trả rõ ràng tạo niềm tin nhưng phải kiểm soát.</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Giao trễ hoặc giao hỏng là lý do hàng đầu gây đánh giá xấu và mất khách. Vận hành, không chỉ marketing, quyết định mua lại.</div>`,
  ]]);

const c6q = quiz('isc301-quiz-6', 'Quiz 6 — Logistics|||Quiz 6 — Logistics & vận hành', [
  { id: 'q1', question: 'Fulfillment trong TMĐT là?', options: ['Việc viết mô tả sản phẩm', 'Toàn bộ quy trình lấy hàng, đóng gói, giao tới khách', 'Chỉ việc quảng cáo', 'Việc định giá'], correctIndex: 1, explanation: 'Fulfillment là hoàn tất đơn: lấy hàng từ kho, đóng gói và giao đến khách.' },
  { id: 'q2', question: 'GHN, GHTK, Viettel Post là?', options: ['Cổng thanh toán', 'Ví điện tử', 'Đơn vị giao vận chặng cuối', 'Sàn TMĐT'], correctIndex: 2, explanation: 'Đây là các đơn vị vận chuyển (last-mile) phổ biến ở VN.' },
  { id: 'q3', question: 'Reverse logistics chỉ việc gì?', options: ['Giao hàng đi', 'Xử lý hoàn/đổi trả và nhận hàng về', 'Quảng cáo ngược', 'Tăng giá'], correctIndex: 1, explanation: 'Reverse logistics là dòng hàng đi ngược: hoàn trả, đổi, thu hồi.' },
]);

const c7 = doc('isc301-7-1-customer-experience', '7.1 — Customer experience & retention|||7.1 — Trải nghiệm & giữ chân khách hàng',
  'UX mua sắm; giỏ hàng & checkout; đánh giá/review & niềm tin; chương trình loyalty; livestream commerce.',
  [[
    `<span class="eyebrow">ISC301 · Chapter 7 · Lesson 7.1</span>
<h2>Customer experience &amp; retention</h2>
<h3>Shopping UX</h3>
<p>Good <strong>UX</strong> makes it easy to find, decide and buy: clear photos, fast search, honest info, and a <strong>checkout</strong> with as few steps as possible. Every extra field loses buyers.</p>
<h3>Cart &amp; checkout</h3>
<p><strong>Cart abandonment</strong> — shoppers who add items but don't pay — is huge. Guest checkout, saved addresses, multiple payment options and clear shipping fees all recover sales.</p>
<h3>Trust &amp; retention</h3>
<ul>
<li><strong>Reviews &amp; ratings</strong> — social proof; the single biggest trust signal on marketplaces.</li>
<li><strong>Loyalty programs</strong> — points, vouchers, membership tiers bring customers back.</li>
<li><strong>Livestream commerce</strong> — huge in Vietnam: sellers demo products live on Shopee Live/TikTok Shop and take orders in real time.</li>
</ul>
<div class="callout"><span class="badge">Retention beats acquisition</span> Keeping an existing customer is far cheaper than winning a new one — so reviews, loyalty and service quality directly protect profit.</div>`,
    `<span class="eyebrow">ISC301 · Chương 7 · Bài 7.1</span>
<h2>Trải nghiệm &amp; giữ chân khách hàng</h2>
<h3>Trải nghiệm mua sắm (UX)</h3>
<p><strong>UX</strong> tốt giúp dễ tìm, dễ quyết và dễ mua: ảnh rõ, tìm kiếm nhanh, thông tin trung thực, và <strong>trang thanh toán</strong> ít bước nhất có thể. Mỗi ô nhập thừa là mất khách.</p>
<h3>Giỏ hàng &amp; thanh toán</h3>
<p><strong>Bỏ giỏ hàng</strong> — khách thêm hàng nhưng không trả tiền — rất lớn. Thanh toán không cần đăng ký, lưu địa chỉ, nhiều lựa chọn thanh toán và phí ship rõ ràng đều giúp thu lại đơn.</p>
<h3>Niềm tin &amp; giữ chân</h3>
<ul>
<li><strong>Đánh giá &amp; xếp hạng</strong> — bằng chứng xã hội; tín hiệu niềm tin lớn nhất trên sàn.</li>
<li><strong>Chương trình loyalty</strong> — điểm, voucher, hạng hội viên kéo khách quay lại.</li>
<li><strong>Livestream commerce</strong> — rất lớn ở VN: người bán trình diễn sản phẩm trực tiếp trên Shopee Live/TikTok Shop và chốt đơn theo thời gian thực.</li>
</ul>
<div class="callout"><span class="badge">Giữ chân hơn giành mới</span> Giữ một khách cũ rẻ hơn nhiều so với giành khách mới — nên đánh giá, loyalty và chất lượng dịch vụ bảo vệ lợi nhuận trực tiếp.</div>`,
  ]]);

const c7q = quiz('isc301-quiz-7', 'Quiz 7 — CX & retention|||Quiz 7 — Trải nghiệm & giữ chân', [
  { id: 'q1', question: '"Cart abandonment" (bỏ giỏ hàng) là hiện tượng?', options: ['Khách thêm hàng vào giỏ nhưng không hoàn tất thanh toán', 'Shop xoá sản phẩm', 'Giao hàng thất bại', 'Khách trả hàng'], correctIndex: 0, explanation: 'Bỏ giỏ hàng: đã thêm sản phẩm nhưng rời đi trước khi trả tiền.' },
  { id: 'q2', question: 'Tín hiệu niềm tin lớn nhất cho người mua trên sàn thường là?', options: ['Màu nền trang', 'Đánh giá & xếp hạng của khách trước', 'Tên miền dài', 'Số lượng ảnh động'], correctIndex: 1, explanation: 'Review/rating là bằng chứng xã hội mạnh nhất giúp khách quyết định.' },
  { id: 'q3', question: 'Livestream commerce ở Việt Nam là?', options: ['Gửi email hàng loạt', 'Bán hàng trực tiếp qua phát trực tiếp (Shopee Live/TikTok Shop)', 'In catalog giấy', 'Chuyển khoản ngân hàng'], correctIndex: 1, explanation: 'Người bán demo và chốt đơn theo thời gian thực trên livestream.' },
]);

const c8 = doc('isc301-8-1-security-law-analytics', '8.1 — Security, law & analytics|||8.1 — Bảo mật, pháp lý & phân tích',
  'An ninh (HTTPS, bảo vệ dữ liệu, chống gian lận); Luật Giao dịch điện tử & bảo vệ người tiêu dùng VN; analytics & KPI (conversion, AOV, CLV).',
  [[
    `<span class="eyebrow">ISC301 · Chapter 8 · Lesson 8.1</span>
<h2>Security, law &amp; analytics</h2>
<h3>Security</h3>
<ul>
<li><strong>HTTPS/TLS</strong> everywhere; never store card data you don't need.</li>
<li><strong>Protect personal data</strong> — accounts, addresses, order history.</li>
<li><strong>Fraud &amp; account protection</strong> — strong passwords, OTP, monitoring.</li>
</ul>
<h3>Law in Vietnam</h3>
<p>E-commerce in Vietnam is governed by the <strong>Law on E-Transactions</strong>, the <strong>Law on Protection of Consumer Rights</strong>, and decrees on e-commerce and personal-data protection. Sellers must show clear seller info, honest pricing, and honour return rights.</p>
<h3>Analytics &amp; KPIs</h3>
<ul>
<li><strong>Conversion rate</strong> — % of visitors who buy.</li>
<li><strong>AOV</strong> (Average Order Value) — average money per order.</li>
<li><strong>CLV</strong> (Customer Lifetime Value) — total value a customer brings over time.</li>
</ul>
<pre><code>Revenue ≈ Visitors × Conversion rate × AOV
Grow any one factor and revenue grows.
</code></pre>
<div class="callout"><span class="badge">Measure to manage</span> Tools like Google Analytics 4 turn clicks into these numbers, so you improve the weakest step instead of guessing.</div>`,
    `<span class="eyebrow">ISC301 · Chương 8 · Bài 8.1</span>
<h2>Bảo mật, pháp lý &amp; phân tích</h2>
<h3>Bảo mật</h3>
<ul>
<li><strong>HTTPS/TLS</strong> ở mọi nơi; không lưu dữ liệu thẻ nếu không cần.</li>
<li><strong>Bảo vệ dữ liệu cá nhân</strong> — tài khoản, địa chỉ, lịch sử đơn hàng.</li>
<li><strong>Chống gian lận &amp; bảo vệ tài khoản</strong> — mật khẩu mạnh, OTP, giám sát.</li>
</ul>
<h3>Pháp lý ở Việt Nam</h3>
<p>TMĐT ở Việt Nam chịu điều chỉnh bởi <strong>Luật Giao dịch điện tử</strong>, <strong>Luật Bảo vệ quyền lợi người tiêu dùng</strong>, và các nghị định về TMĐT và bảo vệ dữ liệu cá nhân. Người bán phải công khai thông tin người bán rõ ràng, niêm yết giá trung thực, và tôn trọng quyền đổi trả.</p>
<h3>Phân tích &amp; KPI</h3>
<ul>
<li><strong>Tỉ lệ chuyển đổi (conversion rate)</strong> — % khách truy cập có mua.</li>
<li><strong>AOV</strong> (Giá trị đơn trung bình) — số tiền trung bình mỗi đơn.</li>
<li><strong>CLV</strong> (Giá trị vòng đời khách hàng) — tổng giá trị một khách mang lại theo thời gian.</li>
</ul>
<pre><code>Doanh thu ≈ Lượt khách × Tỉ lệ chuyển đổi × AOV
Nâng bất kỳ yếu tố nào thì doanh thu tăng.
</code></pre>
<div class="callout"><span class="badge">Đo để quản</span> Công cụ như Google Analytics 4 biến cú nhấp thành các con số này, để bạn cải thiện bước yếu nhất thay vì đoán.</div>`,
  ]]);

const c8q = quiz('isc301-quiz-8', 'Quiz 8 — Security, law & analytics|||Quiz 8 — Bảo mật, pháp lý & phân tích', [
  { id: 'q1', question: 'AOV (Average Order Value) đo cái gì?', options: ['Số khách truy cập', 'Số tiền trung bình mỗi đơn hàng', 'Tỉ lệ hoàn trả', 'Tốc độ giao hàng'], correctIndex: 1, explanation: 'AOV = tổng doanh thu chia số đơn: tiền trung bình mỗi đơn.' },
  { id: 'q2', question: 'Ở Việt Nam, văn bản nào điều chỉnh giao dịch TMĐT và quyền người mua?', options: ['Chỉ luật giao thông', 'Luật Giao dịch điện tử & Luật Bảo vệ quyền lợi người tiêu dùng', 'Không có luật nào', 'Chỉ nội quy của sàn'], correctIndex: 1, explanation: 'TMĐT VN chịu Luật Giao dịch điện tử, Luật Bảo vệ NTD và các nghị định liên quan.' },
  { id: 'q3', question: 'Nếu doanh thu ≈ Lượt khách × Tỉ lệ chuyển đổi × AOV, muốn tăng doanh thu ta có thể?', options: ['Chỉ có thể tăng lượt khách', 'Nâng bất kỳ yếu tố nào trong ba yếu tố', 'Giảm tất cả các yếu tố', 'Không làm gì được'], correctIndex: 1, explanation: 'Cải thiện lượt khách, tỉ lệ chuyển đổi hoặc AOV đều làm tăng doanh thu.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'ISC301',
    slug: 'isc301-e-commerce',
    title: 'e-Commerce',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ISC301.webp',
    shortDescription: 'e-Commerce end to end — what it is (B2C/B2B/C2C/O2O), business & revenue models, tech infrastructure, e-payment (MoMo/VNPay/COD), digital marketing, logistics (GHN/GHTK), customer experience, security, VN law & analytics. Bilingual, with quizzes.|||Thương mại điện tử từ A-Z — là gì (B2C/B2B/C2C/O2O), mô hình kinh doanh & doanh thu, hạ tầng công nghệ, thanh toán (MoMo/VNPay/COD), marketing số, logistics (GHN/GHTK), trải nghiệm KH, bảo mật, luật VN & phân tích. Song ngữ, có quiz.',
    description: 'Môn <strong>ISC301 — e-Commerce (Thương mại điện tử)</strong> thuộc khung chương trình ngành Hệ thống thông tin, kỳ 7. Từ <strong>TMĐT là gì</strong> (mô hình B2C/B2B/C2C/C2B/O2O) → <strong>mô hình kinh doanh &amp; doanh thu</strong> (marketplace vs D2C) → <strong>hạ tầng công nghệ</strong> → <strong>thanh toán điện tử</strong> (MoMo/VNPay/COD) → <strong>marketing số</strong> (SEO/SEM, sàn Shopee/Lazada/Tiki) → <strong>logistics &amp; vận hành</strong> (GHN/GHTK) → <strong>trải nghiệm &amp; giữ chân khách hàng</strong> (review, loyalty, livestream) → <strong>bảo mật, pháp lý VN &amp; phân tích</strong> (conversion, AOV, CLV). Bám sách chuẩn Laudon &amp; Traver và Turban, song ngữ, có ví dụ sàn/doanh nghiệp thật VN và quiz mỗi chương.',
    whatYouLearn: 'Khái niệm & các mô hình TMĐT (B2C/B2B/C2C/C2B/O2O); business model & revenue model, marketplace vs D2C; hạ tầng công nghệ & kiến trúc hệ thống TMĐT; thanh toán điện tử (cổng thanh toán, ví MoMo/VNPay, COD, an toàn giao dịch); marketing số (SEO/SEM, social, email, remarketing, bán trên sàn); logistics & fulfillment (GHN/GHTK, quản lý đơn, hoàn trả); trải nghiệm & giữ chân KH (UX, giỏ hàng, review, loyalty, livestream); bảo mật, Luật Giao dịch điện tử/bảo vệ NTD VN, analytics & KPI (conversion/AOV/CLV).',
    requirements: 'Không cần kiến thức lập trình chuyên sâu. Biết dùng web/di động cơ bản; nên có tài khoản một sàn TMĐT (Shopee/Lazada/Tiki) để quan sát thực tế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn quốc tế, tài liệu sàn, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'TMĐT làm gì, vì sao quan trọng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — TMĐT là gì|||Chapter 1 — What e-commerce is', description: 'Khái niệm, lịch sử, mô hình B2C/B2B/C2C/C2B/O2O, đặc điểm.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kinh doanh & doanh thu|||Chapter 2 — Business & revenue', description: 'Business/revenue model, value proposition, marketplace/D2C.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hạ tầng công nghệ|||Chapter 3 — Tech infrastructure', description: 'Web/app, nền tảng, hosting, kiến trúc hệ thống TMĐT.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thanh toán điện tử|||Chapter 4 — E-payment', description: 'Payment gateway, ví MoMo/VNPay, COD, an toàn giao dịch.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Marketing số|||Chapter 5 — Digital marketing', description: 'SEO/SEM, social, email, remarketing, sàn Shopee/Lazada/Tiki.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Logistics & vận hành|||Chapter 6 — Logistics & operations', description: 'Fulfillment, kho, giao vận GHN/GHTK, quản lý đơn, hoàn trả.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Trải nghiệm & giữ chân KH|||Chapter 7 — CX & retention', description: 'UX, giỏ hàng, review, loyalty, livestream commerce.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Bảo mật, pháp lý & phân tích|||Chapter 8 — Security, law & analytics', description: 'Security, luật TMĐT/bảo vệ NTD VN, analytics, KPI.', lessons: [c8, c8q] },
  ],
};
