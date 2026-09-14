/**
 * ESM301 — E-Commerce Simulation. Giáo trình FLM (syl): mô phỏng vận hành một
 * cửa hàng thương mại điện tử từ ý tưởng đến báo cáo hiệu quả — Laudon/Traver
 * "E-Commerce: Business, Technology, Society"; Shopify/WooCommerce docs;
 * "The E-Commerce Book". Song ngữ + ví dụ + bài tập. Thiên THỰC HÀNH mô phỏng.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('esm301-0-1-overview', 'Course overview: E-Commerce Simulation|||Tổng quan: Mô phỏng Thương mại điện tử',
  'Môn thực hành mô phỏng: dựng và vận hành một cửa hàng TMĐT ảo qua 8 giai đoạn, từ ý tưởng đến báo cáo hiệu quả kinh doanh.',
  [[
    `<span class="eyebrow">ESM301 · Lesson 0.1 · Overview</span>
<h2>E-Commerce Simulation</h2>
<p class="lead">This is a <strong>hands-on simulation course</strong>: you will build and run a virtual e-commerce store from scratch, stage by stage, the same way a real online seller would. There is no single "final exam" — the <strong>deliverable</strong> is a working simulated store plus a short performance report at the end.</p>
<h3>What "simulation" means here</h3>
<ul>
<li>You pick a real (or realistic) niche and set up an actual free-tier storefront (Shopify trial or a local WooCommerce/WordPress install) — not a slide deck about e-commerce.</li>
<li>Every chapter adds one operational layer: platform → catalog → payments/shipping → marketing → order handling → analytics → business review.</li>
<li>Numbers (pricing, ad budgets, conversion rates) are simulated with realistic ranges so you practice the math without needing real customers.</li>
</ul>
<h3>The 8 stages</h3>
<pre><code>1. Business idea &amp; niche market research
2. Platform selection &amp; store setup (Shopify / WooCommerce)
3. Product, catalog &amp; pricing management
4. Payment, shipping &amp; operations configuration
5. Marketing &amp; customer acquisition (SEO, ads, social)
6. Order processing, inventory &amp; customer service
7. Analytics &amp; conversion rate optimization
8. Business performance review, scaling &amp; final simulation report
</code></pre>
<div class="callout"><span class="badge">Deliverable</span> By the end you will have: one live trial storefront, a documented pricing/shipping/marketing setup, and a one-page performance report with the KPIs you tracked.</div>`,
    `<span class="eyebrow">ESM301 · Bài 0.1 · Tổng quan</span>
<h2>Mô phỏng Thương mại điện tử</h2>
<p class="lead">Đây là môn <strong>thực hành mô phỏng</strong>: bạn dựng và vận hành một cửa hàng TMĐT ảo từ đầu, qua từng giai đoạn, đúng như một người bán hàng online thật sự làm. Không có "bài thi cuối kỳ" đơn lẻ — <strong>sản phẩm đầu ra (deliverable)</strong> là một cửa hàng mô phỏng đang chạy cộng một báo cáo hiệu quả ngắn ở cuối môn.</p>
<h3>"Mô phỏng" nghĩa là gì ở đây</h3>
<ul>
<li>Bạn chọn một thị trường ngách thật (hoặc gần thật) và dựng một cửa hàng bản dùng thử miễn phí thật (Shopify trial hoặc WooCommerce/WordPress cài cục bộ) — không phải một bộ slide nói về TMĐT.</li>
<li>Mỗi chương thêm một lớp vận hành: nền tảng → danh mục sản phẩm → thanh toán/vận chuyển → marketing → xử lý đơn hàng → số liệu → đánh giá kinh doanh.</li>
<li>Các con số (giá bán, ngân sách quảng cáo, tỉ lệ chuyển đổi) được mô phỏng theo khoảng thực tế để bạn luyện tính toán mà không cần khách hàng thật.</li>
</ul>
<h3>8 giai đoạn</h3>
<pre><code>1. Ý tưởng kinh doanh &amp; nghiên cứu thị trường ngách
2. Lựa chọn nền tảng &amp; thiết lập cửa hàng (Shopify / WooCommerce)
3. Quản lý sản phẩm, danh mục &amp; định giá
4. Thanh toán, vận chuyển &amp; cấu hình vận hành
5. Marketing &amp; thu hút khách hàng (SEO, ads, social)
6. Xử lý đơn hàng, kho &amp; chăm sóc khách hàng
7. Phân tích số liệu &amp; tối ưu chuyển đổi
8. Đánh giá hiệu quả kinh doanh, mở rộng &amp; báo cáo mô phỏng
</code></pre>
<div class="callout"><span class="badge">Sản phẩm đầu ra</span> Kết thúc môn bạn sẽ có: một cửa hàng bản dùng thử đang chạy, một bộ cấu hình giá/vận chuyển/marketing đã ghi lại, và một báo cáo hiệu quả một trang kèm các KPI đã theo dõi.</div>`,
  ]]);

const c1 = doc('esm301-1-1-idea-niche-research', '1.1 — Business idea & niche market research|||1.1 — Ý tưởng kinh doanh & nghiên cứu thị trường ngách',
  'Chọn thị trường ngách: đam mê/kỹ năng, quy mô nhu cầu, đối thủ; công cụ Google Trends, khảo sát khách hàng mục tiêu (persona).',
  [[
    `<span class="eyebrow">ESM301 · Chapter 1 · Lesson 1.1</span>
<h2>Business idea &amp; niche market research</h2>
<h3>Why a "niche", not "everything"</h3>
<p>A brand-new store cannot out-price or out-catalog Amazon. It can win a <strong>niche</strong> — a narrow, underserved segment — by being more relevant: a specific customer, a specific problem, a specific style. "Sports shoes" is a market; "minimalist running shoes for flat feet" is a niche.</p>
<h3>The 3-filter niche test</h3>
<pre><code>1. Interest/skill fit  -> can you credibly talk about this niche for a year?
2. Demand signal       -> search volume / trend NOT collapsing (Google Trends)
3. Competition gap     -> existing sellers weak on price, service, or content
</code></pre>
<h3>Research method for this simulation</h3>
<ul>
<li><strong>Trend check</strong> — search the niche keyword on <em>Google Trends</em>: is interest flat, rising, or seasonal?</li>
<li><strong>Competitor scan</strong> — find 3-5 existing stores in the niche; note their price range, review count, and one visible weakness (slow shipping, poor photos, no bundles...).</li>
<li><strong>Customer persona</strong> — write one paragraph: who buys this, what triggers the purchase, what price they expect.</li>
</ul>
<div class="callout"><span class="badge">Deliverable for this stage</span> A one-paragraph niche statement + a persona + a short competitor table (name, price range, one weakness). This feeds directly into Chapter 3 (pricing) and Chapter 5 (marketing).</div>`,
    `<span class="eyebrow">ESM301 · Chương 1 · Bài 1.1</span>
<h2>Ý tưởng kinh doanh &amp; nghiên cứu thị trường ngách</h2>
<h3>Vì sao chọn "ngách", không phải "mọi thứ"</h3>
<p>Một cửa hàng mới toanh không thể thắng Amazon về giá hay số lượng mặt hàng. Nhưng nó có thể thắng ở một <strong>thị trường ngách (niche)</strong> — một phân khúc hẹp, chưa được phục vụ tốt — bằng cách sát nhu cầu hơn: một khách hàng cụ thể, một vấn đề cụ thể, một phong cách cụ thể. "Giày thể thao" là một thị trường; "giày chạy bộ tối giản cho người bàn chân bẹt" là một ngách.</p>
<h3>Bài kiểm 3 lớp cho ngách</h3>
<pre><code>1. Phù hợp sở thích/kỹ năng -> bạn nói được về ngách này trong 1 năm không?
2. Tín hiệu nhu cầu         -> lượng tìm kiếm/xu hướng KHÔNG lao dốc (Google Trends)
3. Khoảng trống cạnh tranh  -> người bán hiện tại yếu ở giá, dịch vụ, hoặc nội dung
</code></pre>
<h3>Cách nghiên cứu cho môn mô phỏng này</h3>
<ul>
<li><strong>Kiểm xu hướng</strong> — tra từ khoá ngách trên <em>Google Trends</em>: lượng quan tâm đi ngang, tăng, hay theo mùa?</li>
<li><strong>Rà đối thủ</strong> — tìm 3-5 cửa hàng hiện có trong ngách; ghi lại khoảng giá, số đánh giá, và một điểm yếu thấy rõ (giao hàng chậm, ảnh xấu, không có combo...).</li>
<li><strong>Vẽ persona khách hàng</strong> — viết một đoạn: ai mua món này, điều gì khiến họ quyết định mua, họ kỳ vọng mức giá nào.</li>
</ul>
<div class="callout"><span class="badge">Sản phẩm giai đoạn này</span> Một đoạn mô tả ngách + một persona + một bảng đối thủ ngắn (tên, khoảng giá, một điểm yếu). Đây là đầu vào trực tiếp cho Chương 3 (định giá) và Chương 5 (marketing).</div>`,
  ]]);

const c1q = quiz('esm301-quiz-1', 'Quiz 1 — Idea & niche research|||Quiz 1 — Ý tưởng & nghiên cứu ngách', [
  { id: 'q1', question: 'Vì sao một cửa hàng mới nên nhắm vào "thị trường ngách" thay vì "mọi thị trường"?', options: ['Vì ngách luôn rẻ hơn', 'Vì khó cạnh tranh trực diện với các sàn lớn về giá/danh mục, nên thắng bằng sự phù hợp', 'Vì luật yêu cầu', 'Vì ngách không cần marketing'], correctIndex: 1, explanation: 'Cửa hàng mới không thể đấu giá/số lượng với Amazon; thắng bằng độ phù hợp với một phân khúc hẹp.' },
  { id: 'q2', question: 'Trong bài kiểm 3 lớp chọn ngách, "tín hiệu nhu cầu" được kiểm bằng công cụ nào?', options: ['Google Trends', 'Trình soạn thảo văn bản', 'Máy tính bảng lương', 'Trình duyệt riêng tư'], correctIndex: 0, explanation: 'Google Trends cho thấy xu hướng tìm kiếm tăng/giảm/theo mùa của từ khoá ngách.' },
  { id: 'q3', question: 'Persona khách hàng trong nghiên cứu ngách mô tả điều gì?', options: ['Cấu trúc kỹ thuật của website', 'Ai mua, điều gì khiến họ mua, họ kỳ vọng giá nào', 'Mã màu thương hiệu', 'Chính sách hoàn trả'], correctIndex: 1, explanation: 'Persona tập trung vào hành vi và kỳ vọng của khách hàng mục tiêu, làm đầu vào cho định giá và marketing.' },
]);

const c2 = doc('esm301-2-1-platform-setup', '2.1 — Platform selection & store setup|||2.1 — Lựa chọn nền tảng & thiết lập cửa hàng',
  'So sánh Shopify vs WooCommerce; các bước dựng cửa hàng bản dùng thử: chọn theme, domain, cấu hình cơ bản.',
  [[
    `<span class="eyebrow">ESM301 · Chapter 2 · Lesson 2.1</span>
<h2>Platform selection &amp; store setup</h2>
<h3>Shopify vs WooCommerce — pick one for the simulation</h3>
<table>
<tr><th></th><th>Shopify</th><th>WooCommerce</th></tr>
<tr><td>Hosting</td><td>Fully hosted (SaaS)</td><td>Self-hosted on WordPress</td></tr>
<tr><td>Setup speed</td><td>Fast, guided wizard</td><td>Slower, more manual config</td></tr>
<tr><td>Cost model</td><td>Monthly subscription + app fees</td><td>Free core plugin + hosting + paid extensions</td></tr>
<tr><td>Best for</td><td>Fast launch, less technical control needed</td><td>Full control, already on WordPress</td></tr>
</table>
<h3>Setup checklist (free trial)</h3>
<pre><code>1. Create a free trial store (Shopify trial, or local WordPress + WooCommerce)
2. Pick a free theme matching the niche (minimal, colorful, dark...)
3. Set store name, currency, and basic legal pages (About, Contact, Refund policy)
4. Add a placeholder logo and favicon
5. Connect (or simulate) a custom domain name
</code></pre>
<div class="callout"><span class="badge">Simulation note</span> You do not need to spend real money — a Shopify free trial or a local WooCommerce install is enough to complete every later stage (catalog, payments, marketing configuration).</div>`,
    `<span class="eyebrow">ESM301 · Chương 2 · Bài 2.1</span>
<h2>Lựa chọn nền tảng &amp; thiết lập cửa hàng</h2>
<h3>Shopify vs WooCommerce — chọn một để mô phỏng</h3>
<table>
<tr><th></th><th>Shopify</th><th>WooCommerce</th></tr>
<tr><td>Hạ tầng</td><td>Hosted toàn phần (SaaS)</td><td>Tự host trên WordPress</td></tr>
<tr><td>Tốc độ thiết lập</td><td>Nhanh, có wizard hướng dẫn</td><td>Chậm hơn, cấu hình tay nhiều hơn</td></tr>
<tr><td>Mô hình chi phí</td><td>Thuê theo tháng + phí app</td><td>Plugin lõi miễn phí + hosting + extension trả phí</td></tr>
<tr><td>Phù hợp khi</td><td>Cần ra mắt nhanh, không cần kiểm soát kỹ thuật sâu</td><td>Cần toàn quyền kiểm soát, đã sẵn WordPress</td></tr>
</table>
<h3>Checklist thiết lập (bản dùng thử)</h3>
<pre><code>1. Tạo cửa hàng bản dùng thử (Shopify trial, hoặc WordPress + WooCommerce cục bộ)
2. Chọn theme miễn phí hợp với ngách (tối giản, nhiều màu, tối màu...)
3. Đặt tên cửa hàng, đơn vị tiền tệ, các trang pháp lý cơ bản (Giới thiệu, Liên hệ, Chính sách hoàn trả)
4. Thêm logo và favicon tạm
5. Gắn (hoặc mô phỏng) một tên miền riêng
</code></pre>
<div class="callout"><span class="badge">Lưu ý mô phỏng</span> Bạn không cần chi tiền thật — một Shopify trial miễn phí hoặc WooCommerce cài cục bộ là đủ để hoàn thành mọi giai đoạn sau (danh mục, thanh toán, cấu hình marketing).</div>`,
  ]]);

const c2q = quiz('esm301-quiz-2', 'Quiz 2 — Platform & store setup|||Quiz 2 — Nền tảng & thiết lập cửa hàng', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa Shopify và WooCommerce là gì?', options: ['Shopify chỉ bán quần áo', 'Shopify là SaaS hosted toàn phần, WooCommerce tự host trên WordPress', 'WooCommerce không cho thêm sản phẩm', 'Cả hai đều giống Amazon'], correctIndex: 1, explanation: 'Shopify hosted và trả phí thuê tháng; WooCommerce là plugin miễn phí chạy trên WordPress tự host.' },
  { id: 'q2', question: 'Vì sao bản dùng thử/miễn phí là đủ cho môn mô phỏng này?', options: ['Vì môn không kiểm tra gì', 'Vì mọi giai đoạn sau (danh mục, thanh toán, marketing) đều cấu hình được trên bản trial', 'Vì Shopify trial không giới hạn thời gian', 'Vì WooCommerce miễn phí vĩnh viễn không cần hosting'], correctIndex: 1, explanation: 'Bản dùng thử/cài cục bộ đủ tính năng để thực hành toàn bộ 8 giai đoạn mà không cần chi tiền thật.' },
  { id: 'q3', question: 'Trong checklist thiết lập cửa hàng, việc nào nên làm SỚM nhất?', options: ['Chạy quảng cáo trả phí', 'Tạo cửa hàng bản dùng thử và chọn theme phù hợp ngách', 'Phân tích chuyển đổi', 'Viết báo cáo cuối kỳ'], correctIndex: 1, explanation: 'Phải có cửa hàng và theme trước, các bước danh mục/thanh toán/marketing xây dựng trên nền đó.' },
]);

const c3 = doc('esm301-3-1-product-catalog-pricing', '3.1 — Product, catalog & pricing management|||3.1 — Quản lý sản phẩm, danh mục & định giá',
  'Cấu trúc listing sản phẩm (tên, ảnh, biến thể), phân loại danh mục/collection, chiến lược định giá (cost-plus, cạnh tranh, tâm lý giá).',
  [[
    `<span class="eyebrow">ESM301 · Chapter 3 · Lesson 3.1</span>
<h2>Product, catalog &amp; pricing management</h2>
<h3>Anatomy of a good product listing</h3>
<ul>
<li><strong>Title</strong> — clear, keyword-relevant (helps both customers and SEO, Chapter 5).</li>
<li><strong>Images</strong> — at least 3 angles; consistent background across the catalog.</li>
<li><strong>Variants</strong> — size/color/material, each with its own price/stock if needed.</li>
<li><strong>Description</strong> — benefits first, specs second.</li>
</ul>
<h3>Catalog structure</h3>
<p>Group products into <strong>collections/categories</strong> (e.g. "New arrivals", "Under $20", "Best sellers") so customers can browse without searching — this also feeds navigation menus and ad landing pages.</p>
<h3>Pricing strategies</h3>
<pre><code>Cost-plus:     price = cost x (1 + markup%)          simple, guarantees margin
Competitive:   price ~= average of top 3 competitors  matches market expectation
Psychological: 199,000d instead of 200,000d            perceived as cheaper
</code></pre>
<pre><code>Worked example (cost-plus):
 Product cost = 120,000 VND
 Target markup = 50%
 Price = 120,000 x 1.5 = 180,000 VND
 Gross margin = (180,000 - 120,000) / 180,000 = 33.3%
</code></pre>
<div class="callout"><span class="badge">Simulation note</span> Pick ONE primary pricing strategy for your store and apply it consistently across the catalog — mixing strategies without a reason confuses customers and your own margin math.</div>`,
    `<span class="eyebrow">ESM301 · Chương 3 · Bài 3.1</span>
<h2>Quản lý sản phẩm, danh mục &amp; định giá</h2>
<h3>Cấu trúc một listing sản phẩm tốt</h3>
<ul>
<li><strong>Tên sản phẩm</strong> — rõ ràng, có từ khoá liên quan (giúp cả khách hàng và SEO, xem Chương 5).</li>
<li><strong>Ảnh</strong> — tối thiểu 3 góc chụp; nền ảnh đồng nhất trong toàn danh mục.</li>
<li><strong>Biến thể (variant)</strong> — size/màu/vật liệu, mỗi biến thể có giá/kho riêng nếu cần.</li>
<li><strong>Mô tả</strong> — lợi ích trước, thông số kỹ thuật sau.</li>
</ul>
<h3>Cấu trúc danh mục</h3>
<p>Gom sản phẩm vào <strong>collection/danh mục</strong> (vd "Hàng mới", "Dưới 500k", "Bán chạy nhất") để khách duyệt mà không cần tìm kiếm — cấu trúc này cũng nạp vào menu điều hướng và trang đích quảng cáo.</p>
<h3>Chiến lược định giá</h3>
<pre><code>Cost-plus (chi phí cộng lời): giá = chi phí x (1 + %lời)   đơn giản, đảm bảo biên lợi nhuận
Cạnh tranh:                   giá ~= trung bình 3 đối thủ đầu   khớp kỳ vọng thị trường
Tâm lý giá:                   199.000đ thay vì 200.000đ         cảm giác rẻ hơn
</code></pre>
<pre><code>Ví dụ tính (cost-plus):
 Giá vốn sản phẩm = 120.000đ
 %lời mục tiêu = 50%
 Giá bán = 120.000 x 1,5 = 180.000đ
 Biên lợi nhuận gộp = (180.000 - 120.000) / 180.000 = 33,3%
</code></pre>
<div class="callout"><span class="badge">Lưu ý mô phỏng</span> Chọn MỘT chiến lược định giá chính cho cửa hàng và áp dụng nhất quán toàn danh mục — trộn nhiều chiến lược không có lý do sẽ gây rối cho khách và cho chính bài toán biên lợi nhuận của bạn.</div>`,
  ]]);

const c3q = quiz('esm301-quiz-3', 'Quiz 3 — Catalog & pricing|||Quiz 3 — Danh mục & định giá', [
  { id: 'q1', question: 'Chiến lược "cost-plus" tính giá bán như thế nào?', options: ['Giá = trung bình giá đối thủ', 'Giá = chi phí x (1 + %lời mục tiêu)', 'Giá = giá đối thủ trừ 10%', 'Giá cố định không đổi'], correctIndex: 1, explanation: 'Cost-plus lấy giá vốn nhân với hệ số lời mong muốn, đảm bảo biên lợi nhuận.' },
  { id: 'q2', question: 'Với giá vốn 120.000đ và markup mục tiêu 50%, giá bán là bao nhiêu?', options: ['150.000đ', '160.000đ', '180.000đ', '200.000đ'], correctIndex: 2, explanation: '120.000 x 1,5 = 180.000đ.' },
  { id: 'q3', question: 'Vì sao nên gom sản phẩm vào collection/danh mục?', options: ['Để tăng giá tự động', 'Để khách duyệt hàng dễ hơn và phục vụ menu điều hướng/trang đích quảng cáo', 'Để ẩn sản phẩm bán chậm', 'Vì nền tảng bắt buộc phải có'], correctIndex: 1, explanation: 'Danh mục giúp khách browse không cần tìm kiếm, và tái sử dụng cho navigation/landing page quảng cáo.' },
]);

const c4 = doc('esm301-4-1-payment-shipping-ops', '4.1 — Payment, shipping & operations configuration|||4.1 — Thanh toán, vận chuyển & cấu hình vận hành',
  'Cổng thanh toán (thẻ, VNPay/Momo, COD), vùng/mức phí vận chuyển, thuế, quy trình xử lý đơn cơ bản.',
  [[
    `<span class="eyebrow">ESM301 · Chapter 4 · Lesson 4.1</span>
<h2>Payment, shipping &amp; operations configuration</h2>
<h3>Payment methods to configure</h3>
<ul>
<li><strong>Card / gateway</strong> — Stripe, PayPal, or a local gateway (VNPay, MoMo) for card and e-wallet payments.</li>
<li><strong>Cash on delivery (COD)</strong> — common in local markets; higher return risk, so pair it with order confirmation calls/SMS.</li>
<li><strong>Bank transfer</strong> — manual verification, slower but zero gateway fee.</li>
</ul>
<h3>Shipping configuration</h3>
<pre><code>Shipping zone      Rate rule                         Example
Domestic - near    Flat rate                          25,000 VND
Domestic - far     Weight/size based                  40,000-80,000 VND
Free shipping      Order value over threshold         Free if order > 500,000 VND
International      Not offered in this simulation     -
</code></pre>
<h3>Tax &amp; basic operations settings</h3>
<p>Set a simple tax rule (e.g. prices include VAT, or VAT added at checkout — pick one and state it clearly), and define an <strong>order processing time</strong> (e.g. "ships within 1-2 business days") that you can actually meet.</p>
<div class="callout"><span class="badge">Simulation note</span> Use gateway SANDBOX/test mode credentials only — never enter real card numbers or connect a real bank account for a class simulation.</div>`,
    `<span class="eyebrow">ESM301 · Chương 4 · Bài 4.1</span>
<h2>Thanh toán, vận chuyển &amp; cấu hình vận hành</h2>
<h3>Các phương thức thanh toán cần cấu hình</h3>
<ul>
<li><strong>Thẻ / cổng thanh toán</strong> — Stripe, PayPal, hoặc cổng nội địa (VNPay, MoMo) cho thẻ và ví điện tử.</li>
<li><strong>Thanh toán khi nhận hàng (COD)</strong> — phổ biến ở thị trường nội địa; rủi ro hoàn hàng cao hơn nên cần gọi/SMS xác nhận đơn.</li>
<li><strong>Chuyển khoản ngân hàng</strong> — xác nhận tay, chậm hơn nhưng không mất phí cổng.</li>
</ul>
<h3>Cấu hình vận chuyển</h3>
<pre><code>Vùng vận chuyển     Quy tắc tính phí                   Ví dụ
Nội thành - gần      Phí cố định                        25.000đ
Nội địa - xa         Theo cân nặng/kích thước           40.000đ-80.000đ
Miễn phí vận chuyển  Đơn vượt ngưỡng giá trị             Miễn phí nếu đơn > 500.000đ
Quốc tế              Không phục vụ trong mô phỏng này    -
</code></pre>
<h3>Thuế &amp; cấu hình vận hành cơ bản</h3>
<p>Đặt một quy tắc thuế đơn giản (vd giá đã gồm VAT, hoặc VAT cộng thêm lúc thanh toán — chọn một cách và nói rõ), và xác định <strong>thời gian xử lý đơn</strong> (vd "giao trong 1-2 ngày làm việc") mà bạn thực sự đáp ứng được.</p>
<div class="callout"><span class="badge">Lưu ý mô phỏng</span> Chỉ dùng thông tin SANDBOX/test mode của cổng thanh toán — không bao giờ nhập số thẻ thật hoặc gắn tài khoản ngân hàng thật cho một bài mô phỏng lớp học.</div>`,
  ]]);

const c4q = quiz('esm301-quiz-4', 'Quiz 4 — Payment, shipping & ops|||Quiz 4 — Thanh toán, vận chuyển & vận hành', [
  { id: 'q1', question: 'Rủi ro chính của phương thức thanh toán COD (nhận hàng trả tiền) là gì?', options: ['Phí cổng thanh toán cao', 'Tỉ lệ hoàn/từ chối nhận hàng cao hơn', 'Không hợp pháp', 'Chỉ dùng được cho đơn quốc tế'], correctIndex: 1, explanation: 'COD dễ bị khách đổi ý hoặc không nhận hàng, nên cần xác nhận đơn trước khi giao.' },
  { id: 'q2', question: 'Khi cấu hình cổng thanh toán cho môn mô phỏng này, nên dùng gì?', options: ['Thẻ ngân hàng thật của giảng viên', 'Chế độ sandbox/test mode của cổng', 'Tài khoản công ty thật', 'Chuyển khoản tiền mặt thật'], correctIndex: 1, explanation: 'Không bao giờ dùng thông tin thanh toán thật cho bài tập mô phỏng; luôn dùng sandbox/test mode.' },
  { id: 'q3', question: 'Quy tắc "miễn phí vận chuyển nếu đơn trên 500.000đ" là loại cấu hình nào?', options: ['Cấu hình thuế', 'Quy tắc phí vận chuyển theo ngưỡng giá trị đơn', 'Chính sách hoàn trả', 'Chiến lược quảng cáo'], correctIndex: 1, explanation: 'Đây là một rule tính phí vận chuyển dựa trên tổng giá trị đơn hàng.' },
]);

const c5 = doc('esm301-5-1-marketing-acquisition', '5.1 — Marketing & customer acquisition|||5.1 — Marketing & thu hút khách hàng',
  'SEO on-page cơ bản, quảng cáo trả phí (Google/Meta), mạng xã hội/content, email marketing funnel.',
  [[
    `<span class="eyebrow">ESM301 · Chapter 5 · Lesson 5.1</span>
<h2>Marketing &amp; customer acquisition</h2>
<h3>Four channels to configure in the simulation</h3>
<ul>
<li><strong>SEO (on-page)</strong> — keyword-relevant product titles/descriptions, alt text on images, a clean URL per product.</li>
<li><strong>Paid ads</strong> — Google Search/Shopping or Meta (Facebook/Instagram) ads pointed at a specific collection page, not the homepage.</li>
<li><strong>Social/content</strong> — a simple content calendar (e.g. 3 posts/week) showing the product in use, not just a catalog photo.</li>
<li><strong>Email marketing</strong> — a welcome email + one abandoned-cart email; the two highest-ROI emails for a new store.</li>
</ul>
<h3>A simple acquisition funnel</h3>
<pre><code>Ad / social post -> Landing page (collection) -> Product page -> Cart -> Checkout
                     ^ each step should lose progressively fewer visitors
</code></pre>
<h3>Budget worked example</h3>
<pre><code>Simulated ad budget = 1,000,000 VND
Estimated CPC (cost per click) = 5,000 VND
Estimated clicks = 1,000,000 / 5,000 = 200 clicks
Assume 2% convert to a sale -> 4 sales from this budget
</code></pre>
<div class="callout"><span class="badge">Simulation note</span> Log every assumption (CPC, conversion %) explicitly in your report — Chapter 7 will compare these ASSUMED numbers against the SIMULATED analytics data.</div>`,
    `<span class="eyebrow">ESM301 · Chương 5 · Bài 5.1</span>
<h2>Marketing &amp; thu hút khách hàng</h2>
<h3>Bốn kênh cần cấu hình trong bài mô phỏng</h3>
<ul>
<li><strong>SEO (on-page)</strong> — tên/mô tả sản phẩm có từ khoá liên quan, alt text cho ảnh, URL sản phẩm gọn gàng.</li>
<li><strong>Quảng cáo trả phí</strong> — Google Search/Shopping hoặc Meta (Facebook/Instagram) ads dẫn tới một trang collection cụ thể, không phải trang chủ.</li>
<li><strong>Mạng xã hội/nội dung</strong> — một lịch nội dung đơn giản (vd 3 bài/tuần) cho thấy sản phẩm đang được dùng, không chỉ ảnh catalog.</li>
<li><strong>Email marketing</strong> — một email chào mừng + một email nhắc giỏ hàng bỏ quên; hai loại email hiệu quả nhất cho cửa hàng mới.</li>
</ul>
<h3>Một funnel thu hút khách đơn giản</h3>
<pre><code>Quảng cáo/bài đăng -> Trang đích (collection) -> Trang sản phẩm -> Giỏ hàng -> Thanh toán
                       ^ mỗi bước nên rơi rụng khách ít dần
</code></pre>
<h3>Ví dụ tính ngân sách</h3>
<pre><code>Ngân sách quảng cáo mô phỏng = 1.000.000đ
CPC (chi phí mỗi lượt click) ước tính = 5.000đ
Số lượt click ước tính = 1.000.000 / 5.000 = 200 lượt click
Giả sử 2% chuyển đổi thành đơn hàng -> 4 đơn từ ngân sách này
</code></pre>
<div class="callout"><span class="badge">Lưu ý mô phỏng</span> Ghi lại rõ mọi giả định (CPC, %chuyển đổi) trong báo cáo — Chương 7 sẽ so các con số GIẢ ĐỊNH này với dữ liệu số liệu MÔ PHỎNG thật.</div>`,
  ]]);

const c5q = quiz('esm301-quiz-5', 'Quiz 5 — Marketing & acquisition|||Quiz 5 — Marketing & thu hút khách hàng', [
  { id: 'q1', question: 'Quảng cáo trả phí nên dẫn khách tới đâu, không phải trang chủ?', options: ['Trang liên hệ', 'Một trang collection/sản phẩm cụ thể liên quan tới nội dung quảng cáo', 'Trang chính sách hoàn trả', 'Trang đăng nhập admin'], correctIndex: 1, explanation: 'Landing page cụ thể khớp với nội dung ad giúp tăng tỉ lệ chuyển đổi so với đổ về trang chủ chung.' },
  { id: 'q2', question: 'Với ngân sách 1.000.000đ và CPC 5.000đ, số lượt click ước tính là bao nhiêu?', options: ['20 lượt', '100 lượt', '200 lượt', '500 lượt'], correctIndex: 2, explanation: '1.000.000 / 5.000 = 200 lượt click.' },
  { id: 'q3', question: 'Hai loại email được xem là hiệu quả nhất cho một cửa hàng mới là?', options: ['Email khuyến mãi hàng tháng và email sinh nhật', 'Email chào mừng và email nhắc giỏ hàng bỏ quên', 'Email hoá đơn và email khảo sát', 'Email xin lỗi và email cảm ơn'], correctIndex: 1, explanation: 'Email chào mừng (welcome) và email giỏ hàng bỏ quên (abandoned cart) thường có ROI cao nhất cho store mới.' },
]);

const c6 = doc('esm301-6-1-order-inventory-cs', '6.1 — Order processing, inventory & customer service|||6.1 — Xử lý đơn hàng, kho & chăm sóc khách hàng',
  'Vòng đời đơn hàng, quản lý kho (mức tồn, điểm đặt lại hàng), quy trình chăm sóc khách hàng & xử lý hoàn trả.',
  [[
    `<span class="eyebrow">ESM301 · Chapter 6 · Lesson 6.1</span>
<h2>Order processing, inventory &amp; customer service</h2>
<h3>Order lifecycle</h3>
<pre><code>Pending payment -> Paid -> Processing/packed -> Shipped -> Delivered
                                             \\-> Cancelled / Refunded (exception path)
</code></pre>
<h3>Inventory basics</h3>
<ul>
<li><strong>Stock level</strong> — quantity currently available per variant.</li>
<li><strong>Reorder point</strong> — the stock level that triggers a restock order, so you never sell out completely.</li>
<li><strong>Oversell prevention</strong> — the platform should block checkout once stock hits zero, not after.</li>
</ul>
<pre><code>Worked example (reorder point):
 Average daily sales = 4 units
 Supplier lead time = 5 days
 Reorder point = 4 x 5 = 20 units
 -> reorder as soon as stock drops to 20, not when it hits 0
</code></pre>
<h3>Customer service basics</h3>
<p>Define a <strong>response time target</strong> (e.g. "reply within 24h") and a simple <strong>return/refund policy</strong> (window in days, condition of the item). Consistency here builds the reviews that later feed your marketing (Chapter 5) and conversion rate (Chapter 7).</p>
<div class="callout"><span class="badge">Simulation note</span> Simulate 5-10 sample orders moving through the full lifecycle, including at least one cancellation/refund case — this is what Chapter 8's report will reference.</div>`,
    `<span class="eyebrow">ESM301 · Chương 6 · Bài 6.1</span>
<h2>Xử lý đơn hàng, kho &amp; chăm sóc khách hàng</h2>
<h3>Vòng đời đơn hàng</h3>
<pre><code>Chờ thanh toán -> Đã thanh toán -> Đang đóng gói -> Đã gửi -> Đã giao
                                                \\-> Hủy / Hoàn tiền (đường ngoại lệ)
</code></pre>
<h3>Kiến thức nền về quản lý kho</h3>
<ul>
<li><strong>Mức tồn kho</strong> — số lượng hiện có của từng biến thể.</li>
<li><strong>Điểm đặt lại hàng (reorder point)</strong> — mức tồn kho kích hoạt đơn nhập hàng mới, để không bao giờ hết hàng hoàn toàn.</li>
<li><strong>Chống bán vượt tồn</strong> — hệ thống nên chặn thanh toán khi tồn kho về 0, không phải sau khi bán mất rồi mới biết.</li>
</ul>
<pre><code>Ví dụ tính (điểm đặt lại hàng):
 Bán trung bình mỗi ngày = 4 đơn vị
 Thời gian nhà cung cấp giao hàng = 5 ngày
 Điểm đặt lại hàng = 4 x 5 = 20 đơn vị
 -> đặt hàng lại ngay khi tồn kho về 20, không phải chờ về 0
</code></pre>
<h3>Kiến thức nền chăm sóc khách hàng</h3>
<p>Đặt một <strong>mục tiêu thời gian phản hồi</strong> (vd "trả lời trong 24h") và một <strong>chính sách hoàn trả/hoàn tiền</strong> đơn giản (số ngày cho phép, điều kiện sản phẩm). Sự nhất quán ở đây tạo ra các đánh giá tốt, sau này nạp lại cho marketing (Chương 5) và tỉ lệ chuyển đổi (Chương 7).</p>
<div class="callout"><span class="badge">Lưu ý mô phỏng</span> Mô phỏng 5-10 đơn hàng mẫu đi qua toàn bộ vòng đời, gồm ít nhất một trường hợp hủy/hoàn tiền — đây là dữ liệu báo cáo Chương 8 sẽ tham chiếu tới.</div>`,
  ]]);

const c6q = quiz('esm301-quiz-6', 'Quiz 6 — Orders, inventory & CS|||Quiz 6 — Đơn hàng, kho & chăm sóc khách hàng', [
  { id: 'q1', question: 'Với bán trung bình 4 đơn vị/ngày và thời gian giao hàng nhà cung cấp 5 ngày, điểm đặt lại hàng là bao nhiêu?', options: ['5 đơn vị', '9 đơn vị', '20 đơn vị', '4 đơn vị'], correctIndex: 2, explanation: 'Điểm đặt lại hàng = bán trung bình/ngày x thời gian giao hàng = 4 x 5 = 20.' },
  { id: 'q2', question: '"Chống bán vượt tồn" nghĩa là gì?', options: ['Luôn giảm giá khi hết hàng', 'Chặn thanh toán ngay khi tồn kho về 0, tránh bán món không còn hàng', 'Tăng giá khi tồn kho thấp', 'Xoá sản phẩm khỏi catalog'], correctIndex: 1, explanation: 'Hệ thống cần ngăn khách đặt mua sản phẩm đã hết tồn kho.' },
  { id: 'q3', question: 'Bước nào KHÔNG thuộc đường đi bình thường của vòng đời đơn hàng?', options: ['Chờ thanh toán → Đã thanh toán', 'Đang đóng gói → Đã gửi', 'Đã gửi → Đã giao', 'Đã giao → Chờ thanh toán'], correctIndex: 3, explanation: 'Đơn hàng đi một chiều tới trạng thái Đã giao (hoặc rẽ nhánh Hủy/Hoàn tiền), không quay lại Chờ thanh toán.' },
]);

const c7 = doc('esm301-7-1-analytics-cro', '7.1 — Analytics & conversion rate optimization|||7.1 — Phân tích số liệu & tối ưu chuyển đổi',
  'KPI cốt lõi (tỉ lệ chuyển đổi, AOV, CAC, LTV, bỏ giỏ hàng), funnel Google Analytics, A/B test cơ bản.',
  [[
    `<span class="eyebrow">ESM301 · Chapter 7 · Lesson 7.1</span>
<h2>Analytics &amp; conversion rate optimization</h2>
<h3>Core e-commerce KPIs</h3>
<pre><code>Conversion rate (CR) = orders / visits x 100%
AOV (average order value) = total revenue / number of orders
CAC (customer acquisition cost) = ad spend / number of new customers
LTV (lifetime value) = average revenue per customer over their whole relationship
Cart abandonment rate = (carts started - orders completed) / carts started x 100%
</code></pre>
<h3>Worked example</h3>
<pre><code>1,000 visits, 25 orders, total revenue 4,500,000 VND, ad spend 1,000,000 VND, 20 new customers
CR  = 25 / 1000 x 100% = 2.5%
AOV = 4,500,000 / 25 = 180,000 VND
CAC = 1,000,000 / 20 = 50,000 VND
-> healthy only if LTV per customer clearly exceeds 50,000 VND
</code></pre>
<h3>Reading the funnel &amp; a simple A/B test</h3>
<p>A funnel report (visits → product view → add to cart → checkout → paid) shows exactly WHERE visitors drop off. Once you know the weakest step, run a simple <strong>A/B test</strong>: change ONE variable (e.g. button color, or free-shipping threshold) and compare conversion rate between version A and B over a comparable traffic sample.</p>
<div class="callout"><span class="badge">Simulation note</span> Because there is no real traffic, generate a small simulated dataset (visits/orders per day) with realistic ranges and compute the KPIs above from it — this dataset becomes the evidence base for Chapter 8's report.</div>`,
    `<span class="eyebrow">ESM301 · Chương 7 · Bài 7.1</span>
<h2>Phân tích số liệu &amp; tối ưu chuyển đổi</h2>
<h3>Các KPI cốt lõi của TMĐT</h3>
<pre><code>Tỉ lệ chuyển đổi (CR) = số đơn hàng / số lượt truy cập x 100%
AOV (giá trị đơn trung bình) = tổng doanh thu / số đơn hàng
CAC (chi phí thu hút một khách) = chi phí quảng cáo / số khách hàng mới
LTV (giá trị trọn đời khách hàng) = doanh thu trung bình một khách mang lại suốt mối quan hệ
Tỉ lệ bỏ giỏ hàng = (giỏ hàng đã tạo - đơn hoàn tất) / giỏ hàng đã tạo x 100%
</code></pre>
<h3>Ví dụ tính</h3>
<pre><code>1.000 lượt truy cập, 25 đơn hàng, tổng doanh thu 4.500.000đ, chi quảng cáo 1.000.000đ, 20 khách mới
CR  = 25 / 1000 x 100% = 2,5%
AOV = 4.500.000 / 25 = 180.000đ
CAC = 1.000.000 / 20 = 50.000đ
-> chỉ lành mạnh nếu LTV mỗi khách rõ ràng vượt 50.000đ
</code></pre>
<h3>Đọc funnel & một bài A/B test đơn giản</h3>
<p>Báo cáo funnel (lượt truy cập → xem sản phẩm → thêm vào giỏ → thanh toán → hoàn tất) cho thấy chính xác khách RƠI RỤNG ở đâu. Khi biết bước yếu nhất, chạy một <strong>A/B test</strong> đơn giản: đổi MỘT biến (vd màu nút, hoặc ngưỡng miễn phí vận chuyển) và so tỉ lệ chuyển đổi giữa phiên bản A và B trên mẫu lưu lượng tương đương.</p>
<div class="callout"><span class="badge">Lưu ý mô phỏng</span> Vì không có lưu lượng thật, hãy sinh một tập dữ liệu mô phỏng nhỏ (lượt truy cập/đơn hàng theo ngày) theo khoảng thực tế và tính các KPI trên từ đó — tập dữ liệu này trở thành bằng chứng cho báo cáo Chương 8.</div>`,
  ]]);

const c7q = quiz('esm301-quiz-7', 'Quiz 7 — Analytics & CRO|||Quiz 7 — Số liệu & tối ưu chuyển đổi', [
  { id: 'q1', question: 'Với 1.000 lượt truy cập và 25 đơn hàng, tỉ lệ chuyển đổi (CR) là bao nhiêu?', options: ['0,25%', '2,5%', '25%', '4%'], correctIndex: 1, explanation: 'CR = đơn hàng/lượt truy cập x 100% = 25/1000 x 100% = 2,5%.' },
  { id: 'q2', question: 'CAC (chi phí thu hút một khách hàng) được tính như thế nào?', options: ['Tổng doanh thu / số đơn hàng', 'Chi phí quảng cáo / số khách hàng mới', 'Số đơn hàng / lượt truy cập', 'Doanh thu / số khách cũ'], correctIndex: 1, explanation: 'CAC = chi phí quảng cáo chia cho số khách hàng mới có được từ chi phí đó.' },
  { id: 'q3', question: 'Trong một A/B test tối ưu chuyển đổi, nguyên tắc quan trọng nhất là gì?', options: ['Đổi càng nhiều biến càng tốt trong một lần test', 'Chỉ đổi MỘT biến mỗi lần rồi so sánh trên mẫu lưu lượng tương đương', 'Chỉ chạy test vào cuối kỳ', 'Không cần đo tỉ lệ chuyển đổi'], correctIndex: 1, explanation: 'Đổi một biến duy nhất giúp quy kết đúng nguyên nhân thay đổi kết quả, tránh nhiễu.' },
]);

const c8 = doc('esm301-8-1-review-scaling-report', '8.1 — Business performance review, scaling & simulation report|||8.1 — Đánh giá hiệu quả kinh doanh, mở rộng & báo cáo mô phỏng',
  'P&L cơ bản của một shop, điểm hoà vốn, các hướng mở rộng, cấu trúc báo cáo mô phỏng cuối môn.',
  [[
    `<span class="eyebrow">ESM301 · Chapter 8 · Lesson 8.1</span>
<h2>Business performance review, scaling &amp; simulation report</h2>
<h3>A simple store P&amp;L (profit &amp; loss)</h3>
<pre><code>Revenue                              4,500,000 VND
- Cost of goods sold (COGS)          3,000,000 VND
= Gross profit                       1,500,000 VND
- Ad spend + platform/gateway fees     650,000 VND
= Net profit (this period)             850,000 VND
</code></pre>
<h3>Break-even point</h3>
<pre><code>Break-even units = Fixed costs / (price per unit - variable cost per unit)
Example: fixed costs 2,000,000 VND, price 180,000 VND, variable cost 120,000 VND
Break-even units = 2,000,000 / (180,000 - 120,000) = 34 units
</code></pre>
<h3>Ways to scale, ranked by risk</h3>
<ul>
<li><strong>Low risk</strong> — raise the ad budget on the channel that already has the best CAC/LTV ratio (Chapter 7).</li>
<li><strong>Medium risk</strong> — add 1-2 new products validated by existing customer requests.</li>
<li><strong>Higher risk</strong> — open a new marketing channel or a new market segment with no track record yet.</li>
</ul>
<h3>Final simulation report structure</h3>
<pre><code>1. Niche &amp; store summary (Ch.1-2)
2. Catalog &amp; pricing strategy used (Ch.3)
3. Payment/shipping/ops configuration (Ch.4)
4. Marketing channels &amp; budget assumptions (Ch.5)
5. Sample order log + inventory/CS policy (Ch.6)
6. KPI table: CR, AOV, CAC, LTV, cart abandonment (Ch.7)
7. P&amp;L, break-even, and ONE recommended scaling move, with reasoning
</code></pre>
<div class="callout"><span class="badge">Deliverable</span> This report is the graded artifact of the whole simulation — it should read as a real small-business review, not a slide summary of the course.</div>`,
    `<span class="eyebrow">ESM301 · Chương 8 · Bài 8.1</span>
<h2>Đánh giá hiệu quả kinh doanh, mở rộng &amp; báo cáo mô phỏng</h2>
<h3>Bảng lãi/lỗ (P&amp;L) đơn giản của một shop</h3>
<pre><code>Doanh thu                                4.500.000đ
- Giá vốn hàng bán (COGS)                3.000.000đ
= Lợi nhuận gộp                          1.500.000đ
- Chi quảng cáo + phí nền tảng/cổng        650.000đ
= Lợi nhuận thuần (kỳ này)                 850.000đ
</code></pre>
<h3>Điểm hoà vốn</h3>
<pre><code>Số lượng hoà vốn = Chi phí cố định / (giá bán một đơn vị - chi phí biến đổi một đơn vị)
Ví dụ: chi phí cố định 2.000.000đ, giá bán 180.000đ, chi phí biến đổi 120.000đ
Số lượng hoà vốn = 2.000.000 / (180.000 - 120.000) = 34 đơn vị
</code></pre>
<h3>Các hướng mở rộng, xếp theo mức độ rủi ro</h3>
<ul>
<li><strong>Rủi ro thấp</strong> — tăng ngân sách quảng cáo cho kênh đã có tỉ lệ CAC/LTV tốt nhất (Chương 7).</li>
<li><strong>Rủi ro trung bình</strong> — thêm 1-2 sản phẩm mới được xác nhận qua yêu cầu của khách hàng hiện có.</li>
<li><strong>Rủi ro cao hơn</strong> — mở một kênh marketing mới hoặc một phân khúc thị trường mới chưa có dữ liệu lịch sử.</li>
</ul>
<h3>Cấu trúc báo cáo mô phỏng cuối môn</h3>
<pre><code>1. Tóm tắt ngách &amp; cửa hàng (Chương 1-2)
2. Chiến lược danh mục &amp; định giá đã dùng (Chương 3)
3. Cấu hình thanh toán/vận chuyển/vận hành (Chương 4)
4. Các kênh marketing &amp; giả định ngân sách (Chương 5)
5. Log đơn hàng mẫu + chính sách kho/chăm sóc khách hàng (Chương 6)
6. Bảng KPI: CR, AOV, CAC, LTV, tỉ lệ bỏ giỏ hàng (Chương 7)
7. P&amp;L, điểm hoà vốn, và MỘT hướng mở rộng đề xuất, kèm lý do
</code></pre>
<div class="callout"><span class="badge">Sản phẩm đầu ra</span> Báo cáo này là sản phẩm được đánh giá của toàn bộ môn mô phỏng — nó nên đọc như một bản đánh giá kinh doanh nhỏ thật sự, không phải bản tóm tắt slide của môn học.</div>`,
  ]]);

const c8q = quiz('esm301-quiz-8', 'Quiz 8 — Performance review & scaling|||Quiz 8 — Đánh giá hiệu quả & mở rộng', [
  { id: 'q1', question: 'Với chi phí cố định 2.000.000đ, giá bán 180.000đ và chi phí biến đổi 120.000đ mỗi đơn vị, điểm hoà vốn là bao nhiêu đơn vị?', options: ['17 đơn vị', '20 đơn vị', '34 đơn vị', '60 đơn vị'], correctIndex: 2, explanation: '2.000.000 / (180.000-120.000) = 2.000.000/60.000 = 34 đơn vị (tròn lên).' },
  { id: 'q2', question: 'Hướng mở rộng nào được xem là RỦI RO THẤP nhất theo bài học?', options: ['Mở một phân khúc thị trường hoàn toàn mới', 'Tăng ngân sách cho kênh quảng cáo đã có CAC/LTV tốt nhất', 'Ra mắt một kênh marketing chưa từng thử', 'Giảm giá toàn bộ sản phẩm 50%'], correctIndex: 1, explanation: 'Tăng ngân sách trên kênh đã chứng minh hiệu quả là hướng mở rộng ít rủi ro nhất vì đã có dữ liệu.' },
  { id: 'q3', question: 'Báo cáo mô phỏng cuối môn KHÔNG nên có đặc điểm nào sau đây?', options: ['Có bảng KPI cụ thể (CR, AOV, CAC, LTV)', 'Có P&L và điểm hoà vốn', 'Chỉ là bản tóm tắt lại slide bài giảng của môn học', 'Đề xuất một hướng mở rộng kèm lý do'], correctIndex: 2, explanation: 'Báo cáo phải đọc như một đánh giá kinh doanh thật, không phải một bản tóm tắt slide của khoá học.' },
]);

const taiLieu = doc('esm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (FLM), sách tham khảo, tài liệu chính thức Shopify/WooCommerce, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ESM301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn E-Commerce Simulation — from niche research to store setup, marketing and performance analysis — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources used throughout this course.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ESM301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>E-Commerce: Business, Technology, Society</em> — Kenneth C. Laudon &amp; Carol Guercio Traver (core reference for e-commerce business models, technology infrastructure and society/policy issues).</li>
<li><em>The E-Commerce Book: Building the E-Empire</em> — Steffano Korper &amp; Juanita Ellis (practical build-and-run perspective).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://help.shopify.com/en" target="_blank" rel="noopener">Shopify Help Center</a> — official setup, catalog, payments &amp; shipping docs</li>
<li><a href="https://www.shopify.com/learn" target="_blank" rel="noopener">Shopify Learn</a> — free e-commerce courses</li>
<li><a href="https://woocommerce.com/documentation/" target="_blank" rel="noopener">WooCommerce Documentation</a> — official setup &amp; extension docs</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Shopify" target="_blank" rel="noopener">Shopify (official)</a> — store setup &amp; growth tutorials</li>
<li><a href="https://www.youtube.com/@WooCommerce" target="_blank" rel="noopener">WooCommerce (official)</a> — WordPress store tutorials</li>
</ul>
<h3>🛠️ Tools used in this simulation</h3>
<ul>
<li><a href="https://trends.google.com" target="_blank" rel="noopener">Google Trends</a> — niche demand research (Chapter 1)</li>
<li><a href="https://analytics.google.com" target="_blank" rel="noopener">Google Analytics</a> — funnel &amp; KPI tracking (Chapter 7)</li>
<li><a href="https://business.facebook.com" target="_blank" rel="noopener">Meta Business Suite</a> — social/ads configuration (Chapter 5)</li>
<li><a href="https://www.canva.com" target="_blank" rel="noopener">Canva</a> — product images &amp; social content mockups</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — niche research, platform choice, basic store setup (Chapters 1-2).</li>
<li><strong>Operate</strong> — catalog/pricing, payments/shipping, marketing configuration (Chapters 3-5).</li>
<li><strong>Run &amp; measure</strong> — order/inventory handling, analytics and CRO (Chapters 6-7).</li>
<li><strong>Report</strong> — P&amp;L, break-even and a scaling recommendation, written up as the final simulation report (Chapter 8).</li>
</ol></div>`,
    `<span class="eyebrow">ESM301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Mô phỏng Thương mại điện tử — từ nghiên cứu ngách đến thiết lập cửa hàng, marketing và phân tích hiệu quả — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp dùng suốt môn học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ESM301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>E-Commerce: Business, Technology, Society</em> — Kenneth C. Laudon &amp; Carol Guercio Traver (tài liệu gốc về mô hình kinh doanh TMĐT, hạ tầng công nghệ và các vấn đề xã hội/chính sách).</li>
<li><em>The E-Commerce Book: Building the E-Empire</em> — Steffano Korper &amp; Juanita Ellis (góc nhìn thực hành dựng &amp; vận hành).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://help.shopify.com/en" target="_blank" rel="noopener">Shopify Help Center</a> — tài liệu chính thức thiết lập, danh mục, thanh toán &amp; vận chuyển</li>
<li><a href="https://www.shopify.com/learn" target="_blank" rel="noopener">Shopify Learn</a> — khoá học TMĐT miễn phí</li>
<li><a href="https://woocommerce.com/documentation/" target="_blank" rel="noopener">WooCommerce Documentation</a> — tài liệu thiết lập &amp; extension chính thức</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Shopify" target="_blank" rel="noopener">Shopify (chính thức)</a> — hướng dẫn thiết lập &amp; phát triển cửa hàng</li>
<li><a href="https://www.youtube.com/@WooCommerce" target="_blank" rel="noopener">WooCommerce (chính thức)</a> — hướng dẫn cửa hàng WordPress</li>
</ul>
<h3>🛠️ Công cụ dùng trong môn mô phỏng này</h3>
<ul>
<li><a href="https://trends.google.com" target="_blank" rel="noopener">Google Trends</a> — nghiên cứu nhu cầu ngách (Chương 1)</li>
<li><a href="https://analytics.google.com" target="_blank" rel="noopener">Google Analytics</a> — theo dõi funnel &amp; KPI (Chương 7)</li>
<li><a href="https://business.facebook.com" target="_blank" rel="noopener">Meta Business Suite</a> — cấu hình mạng xã hội/quảng cáo (Chương 5)</li>
<li><a href="https://www.canva.com" target="_blank" rel="noopener">Canva</a> — dựng ảnh sản phẩm &amp; nội dung mạng xã hội</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — nghiên cứu ngách, chọn nền tảng, thiết lập cửa hàng cơ bản (Chương 1-2).</li>
<li><strong>Vận hành</strong> — danh mục/định giá, thanh toán/vận chuyển, cấu hình marketing (Chương 3-5).</li>
<li><strong>Chạy &amp; đo lường</strong> — xử lý đơn/kho, số liệu và tối ưu chuyển đổi (Chương 6-7).</li>
<li><strong>Báo cáo</strong> — P&amp;L, điểm hoà vốn và đề xuất mở rộng, viết thành báo cáo mô phỏng cuối môn (Chương 8).</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ESM301',
    slug: 'esm301-e-commerce-simulation',
    title: 'E-Commerce simulation',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ESM301.webp',
    shortDescription: 'Hands-on simulation: build & run a virtual e-commerce store through 8 stages — niche research, platform setup, catalog/pricing, payments/shipping, marketing, order/inventory ops, analytics & a final report. Bilingual, with worked examples & quizzes.|||Thực hành mô phỏng: dựng & vận hành một cửa hàng TMĐT ảo qua 8 giai đoạn — nghiên cứu ngách, thiết lập nền tảng, danh mục/định giá, thanh toán/vận chuyển, marketing, vận hành đơn/kho, số liệu & báo cáo cuối môn. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>ESM301 — E-Commerce Simulation</strong> (kỳ 5, khối Quản trị Kinh doanh) là môn <strong>thực hành mô phỏng</strong>: sinh viên dựng và vận hành một cửa hàng thương mại điện tử ảo qua 8 giai đoạn liên tiếp — từ <strong>ý tưởng kinh doanh &amp; nghiên cứu thị trường ngách</strong>, <strong>lựa chọn nền tảng &amp; thiết lập cửa hàng</strong> (Shopify/WooCommerce), <strong>quản lý sản phẩm, danh mục &amp; định giá</strong>, <strong>thanh toán, vận chuyển &amp; vận hành</strong>, <strong>marketing &amp; thu hút khách hàng</strong>, <strong>xử lý đơn hàng, kho &amp; chăm sóc khách hàng</strong>, <strong>phân tích số liệu &amp; tối ưu chuyển đổi</strong>, đến <strong>đánh giá hiệu quả kinh doanh, mở rộng &amp; báo cáo mô phỏng</strong> cuối môn. Bám giáo trình FLM (tham khảo Laudon &amp; Traver "E-Commerce: Business, Technology, Society", tài liệu chính thức Shopify/WooCommerce, "The E-Commerce Book"), song ngữ, có ví dụ tính toán thực tế và quiz mỗi chương.',
    whatYouLearn: 'Nghiên cứu & kiểm định thị trường ngách (Google Trends, phân tích đối thủ, persona khách hàng); so sánh & thiết lập Shopify/WooCommerce; cấu trúc listing sản phẩm, danh mục/collection, chiến lược định giá (cost-plus, cạnh tranh, tâm lý giá); cấu hình cổng thanh toán, vùng/mức phí vận chuyển, thuế; SEO on-page, quảng cáo trả phí, social/content, email marketing; vòng đời đơn hàng, điểm đặt lại hàng, chính sách chăm sóc khách hàng; KPI TMĐT (CR, AOV, CAC, LTV, tỉ lệ bỏ giỏ hàng), đọc funnel, A/B test; P&L, điểm hoà vốn và viết báo cáo hiệu quả kinh doanh mô phỏng.',
    requirements: 'Không yêu cầu kiến thức kỹ thuật trước; nên có tài khoản Shopify (bản dùng thử miễn phí) hoặc một WordPress/WooCommerce cài cục bộ để thực hành trực tiếp qua từng giai đoạn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách tham khảo, tài liệu Shopify/WooCommerce, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Môn thực hành mô phỏng, 8 giai đoạn, deliverable.', lessons: [intro] },
    { title: 'Chương 1 — Ý tưởng & nghiên cứu ngách|||Chapter 1 — Idea & niche research', description: 'Chọn ngách, Google Trends, đối thủ, persona.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nền tảng & thiết lập cửa hàng|||Chapter 2 — Platform & store setup', description: 'Shopify vs WooCommerce, checklist thiết lập.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Sản phẩm, danh mục & định giá|||Chapter 3 — Catalog & pricing', description: 'Listing, collection, chiến lược giá, cost-plus.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thanh toán, vận chuyển & vận hành|||Chapter 4 — Payment, shipping & ops', description: 'Cổng thanh toán, phí vận chuyển, thuế, sandbox.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Marketing & thu hút khách hàng|||Chapter 5 — Marketing & acquisition', description: 'SEO, ads, social/content, email marketing.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đơn hàng, kho & chăm sóc khách hàng|||Chapter 6 — Orders, inventory & CS', description: 'Vòng đời đơn, reorder point, chính sách CS.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Số liệu & tối ưu chuyển đổi|||Chapter 7 — Analytics & CRO', description: 'CR, AOV, CAC, LTV, funnel, A/B test.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Hiệu quả kinh doanh, mở rộng & báo cáo|||Chapter 8 — Performance, scaling & report', description: 'P&L, hoà vốn, mở rộng, báo cáo mô phỏng.', lessons: [c8, c8q] },
  ],
};
