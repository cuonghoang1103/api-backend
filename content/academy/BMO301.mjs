/**
 * BMO301 — Brand Measurement & Omnichannel Analytics. Đo lường thương hiệu &
 * phân tích đa kênh (khối Công nghệ Truyền thông FPTU, Kỳ 5). Song ngữ VI+EN.
 * Sách chuẩn: Farris et al "Marketing Metrics"; Keller "Strategic Brand
 * Management" (CBBE, brand equity measurement); Aaker "Managing Brand Equity";
 * Google/Nielsen Brand Lift; GA4 & attribution/MMM.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick lồng/${; & → &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bmo301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế (Farris, Keller, Aaker), tài liệu chính thức (GA4, Nielsen, Google Brand Lift), công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">BMO301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to measure a <strong>brand</strong> and analyze it <strong>across channels</strong> — brand equity, brand-health tracking, brand lift, omnichannel attribution and marketing dashboards — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are standard textbooks and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for BMO301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Standard reference books</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/marketing-metrics-the-manager-s-guide-to-measuring-marketing-performance/P200000005949" target="_blank" rel="noopener">Farris, Bendle, Pfeifer &amp; Reibstein — <em>Marketing Metrics</em></a> (the metric definitions used across this course)</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/strategic-brand-management/P200000005890" target="_blank" rel="noopener">Kevin Lane Keller — <em>Strategic Brand Management</em></a> (CBBE model, brand equity measurement)</li>
<li><a href="https://en.wikipedia.org/wiki/David_Aaker" target="_blank" rel="noopener">David Aaker — <em>Managing Brand Equity</em></a> (brand-equity assets: awareness, loyalty, perceived quality, associations)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://support.google.com/analytics/answer/10089681" target="_blank" rel="noopener">Google Analytics 4 (GA4) — official docs</a></li>
<li><a href="https://support.google.com/google-ads/answer/6320767" target="_blank" rel="noopener">Google Brand Lift — measure awareness, consideration &amp; recall</a></li>
<li><a href="https://www.nielsen.com/solutions/brand/" target="_blank" rel="noopener">Nielsen — brand &amp; audience measurement</a></li>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google — measurement &amp; attribution playbooks</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — cross-channel web &amp; app analytics</li>
<li><a href="https://lookerstudio.google.com/" target="_blank" rel="noopener">Looker Studio</a> — free marketing dashboards</li>
<li><a href="https://interbrand.com/best-global-brands/" target="_blank" rel="noopener">Interbrand — Best Global Brands</a> — public brand-valuation methodology</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what brand equity is and why brands are measured (Keller CBBE, Aaker assets).</li>
<li><strong>Track</strong> — awareness, consideration, brand health &amp; NPS; run a brand-lift study (control vs exposed).</li>
<li><strong>Go omnichannel</strong> — unify data across channels, apply multi-touch attribution and marketing-mix modeling.</li>
<li><strong>Decide</strong> — turn ROI/ROAS, CLV and share-of-voice into a KPI dashboard that drives action.</li>
</ol></div>`,
    `<span class="eyebrow">BMO301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để <strong>đo lường thương hiệu</strong> và phân tích nó <strong>trên nhiều kênh</strong> — tài sản thương hiệu, theo dõi sức khoẻ thương hiệu, brand lift, attribution đa kênh và dashboard marketing — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là sách chuẩn quốc tế và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của BMO301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách chuẩn tham khảo</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/marketing-metrics-the-manager-s-guide-to-measuring-marketing-performance/P200000005949" target="_blank" rel="noopener">Farris, Bendle, Pfeifer &amp; Reibstein — <em>Marketing Metrics</em></a> (định nghĩa các chỉ số dùng xuyên suốt môn)</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/strategic-brand-management/P200000005890" target="_blank" rel="noopener">Kevin Lane Keller — <em>Strategic Brand Management</em></a> (mô hình CBBE, đo tài sản thương hiệu)</li>
<li><a href="https://en.wikipedia.org/wiki/David_Aaker" target="_blank" rel="noopener">David Aaker — <em>Managing Brand Equity</em></a> (tài sản thương hiệu: nhận biết, trung thành, chất lượng cảm nhận, liên tưởng)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://support.google.com/analytics/answer/10089681" target="_blank" rel="noopener">Google Analytics 4 (GA4) — tài liệu chính thức</a></li>
<li><a href="https://support.google.com/google-ads/answer/6320767" target="_blank" rel="noopener">Google Brand Lift — đo nhận biết, cân nhắc &amp; ghi nhớ</a></li>
<li><a href="https://www.nielsen.com/solutions/brand/" target="_blank" rel="noopener">Nielsen — đo lường thương hiệu &amp; khán giả</a></li>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google — cẩm nang đo lường &amp; attribution</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — phân tích web &amp; app đa kênh</li>
<li><a href="https://lookerstudio.google.com/" target="_blank" rel="noopener">Looker Studio</a> — dashboard marketing miễn phí</li>
<li><a href="https://interbrand.com/best-global-brands/" target="_blank" rel="noopener">Interbrand — Best Global Brands</a> — phương pháp định giá thương hiệu công khai</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — tài sản thương hiệu là gì và vì sao phải đo (CBBE của Keller, các tài sản của Aaker).</li>
<li><strong>Theo dõi</strong> — nhận biết, cân nhắc, sức khoẻ thương hiệu &amp; NPS; chạy một nghiên cứu brand lift (đối chứng vs phơi nhiễm).</li>
<li><strong>Lên đa kênh</strong> — hợp nhất dữ liệu qua các kênh, áp dụng multi-touch attribution và marketing-mix modeling.</li>
<li><strong>Ra quyết định</strong> — biến ROI/ROAS, CLV và share of voice thành một dashboard KPI thúc đẩy hành động.</li>
</ol></div>`,
  ]]);

const intro = doc('bmo301-0-1-overview', 'Course overview: Brand measurement & omnichannel analytics|||Tổng quan: Đo lường thương hiệu & phân tích đa kênh',
  'Môn học đo gì; vì sao "đo được mới quản được"; lộ trình 4 bước: tài sản thương hiệu → theo dõi sức khoẻ & brand lift → đo lường đa kênh & attribution → chỉ số tài chính & dashboard.',
  [[
    `<span class="eyebrow">BMO301 · Lesson 0.1 · Overview</span>
<h2>Brand Measurement &amp; Omnichannel Analytics</h2>
<p class="lead">This course teaches you to answer a hard question with numbers: <strong>is our brand getting stronger, and are our channels working together?</strong> You'll measure <strong>brand equity</strong> (the value a brand name adds), track <strong>brand health</strong>, prove campaign impact with <strong>brand lift</strong>, and stitch behaviour across web, app, social and retail into <strong>omnichannel analytics</strong>.</p>
<h3>Two ideas the whole course rests on</h3>
<ul>
<li><strong>Brand equity</strong> — the same product sells for more, or sells more often, because of the name on it. Marketers measure it so they can grow it.</li>
<li><strong>Omnichannel</strong> — a customer meets a brand on many channels before buying. Measuring each channel alone double-counts and misleads; you need one unified view.</li>
</ul>
<h3>Why measure at all?</h3>
<p>"<strong>What gets measured gets managed.</strong>" Budgets, campaign decisions and even brand valuation on a balance sheet all depend on trustworthy metrics — that is what this course builds.</p>
<h3>Roadmap (4 steps)</h3>
<p>Brand equity &amp; the CBBE model (Keller, Aaker) → awareness, brand-health tracking &amp; brand lift → omnichannel measurement &amp; attribution (multi-touch, MMM) → financial metrics (ROI/ROAS, CLV, share of voice, valuation) &amp; KPI dashboards. Bilingual, with real brands, formulas and quizzes.</p>`,
    `<span class="eyebrow">BMO301 · Bài 0.1 · Tổng quan</span>
<h2>Đo lường thương hiệu &amp; phân tích đa kênh</h2>
<p class="lead">Môn này dạy bạn trả lời một câu hỏi khó bằng con số: <strong>thương hiệu của ta có mạnh lên không, và các kênh có phối hợp với nhau không?</strong> Bạn sẽ đo <strong>tài sản thương hiệu</strong> (giá trị mà cái tên tạo thêm), theo dõi <strong>sức khoẻ thương hiệu</strong>, chứng minh tác động chiến dịch bằng <strong>brand lift</strong>, và ghép hành vi trên web, app, mạng xã hội và cửa hàng thành <strong>phân tích đa kênh</strong>.</p>
<h3>Hai ý tưởng cả môn dựa vào</h3>
<ul>
<li><strong>Tài sản thương hiệu (brand equity)</strong> — cùng một sản phẩm bán được giá cao hơn, hoặc bán được nhiều hơn, nhờ cái tên gắn trên đó. Marketer đo nó để làm nó lớn lên.</li>
<li><strong>Đa kênh (omnichannel)</strong> — khách gặp thương hiệu trên nhiều kênh trước khi mua. Đo từng kênh riêng lẻ sẽ đếm trùng và gây hiểu sai; cần một góc nhìn hợp nhất.</li>
</ul>
<h3>Vì sao phải đo?</h3>
<p>"<strong>Đo được thì mới quản được.</strong>" Ngân sách, quyết định chiến dịch, thậm chí giá trị thương hiệu trên bảng cân đối kế toán đều dựa vào các chỉ số đáng tin — đó chính là thứ môn này xây dựng.</p>
<h3>Lộ trình (4 bước)</h3>
<p>Tài sản thương hiệu &amp; mô hình CBBE (Keller, Aaker) → nhận biết, theo dõi sức khoẻ &amp; brand lift → đo lường đa kênh &amp; attribution (multi-touch, MMM) → chỉ số tài chính (ROI/ROAS, CLV, share of voice, định giá) &amp; dashboard KPI. Song ngữ, có thương hiệu thật, công thức và quiz.</p>`,
  ]]);

const c1 = doc('bmo301-1-1-why-measure', '1.1 — Why measure a brand: brand equity|||1.1 — Vì sao đo lường thương hiệu: tài sản thương hiệu',
  'Brand equity là gì, thương hiệu là tài sản, đo để làm gì (định giá, ngân sách, ra quyết định); price premium, brand equity dựa trên khách hàng vs tài chính.',
  [[
    `<span class="eyebrow">BMO301 · Chapter 1 · Lesson 1.1</span>
<h2>Why measure a brand — brand equity</h2>
<h3>A brand is an asset</h3>
<p>A <strong>brand</strong> is more than a logo — it's a set of associations in customers' minds that changes how they choose and how much they'll pay. <strong>Brand equity</strong> is the added value a brand name gives a product. Because it drives future cash flow, it counts as an <em>intangible asset</em> — Interbrand values Apple's brand alone in the hundreds of billions of dollars.</p>
<h3>Two lenses on brand equity</h3>
<ul>
<li><strong>Customer-based (mindset):</strong> what people know, feel and prefer — awareness, associations, loyalty (Chapters 2–4).</li>
<li><strong>Financial (outcome):</strong> the money that mindset produces — price premium, market share, valuation (Chapter 7).</li>
</ul>
<h3>Why bother measuring?</h3>
<ul>
<li><strong>Justify budget</strong> — prove marketing builds a durable asset, not just short-term sales.</li>
<li><strong>Guide decisions</strong> — know which campaigns, channels and messages move the brand.</li>
<li><strong>Value the company</strong> — brand shows up in M&amp;A and on balance sheets.</li>
</ul>
<pre><code>Price premium (a simple equity signal):
  Our brand:    $1.20 for 330ml cola
  Store brand:  $0.60 for 330ml cola (same category)
  Premium = (1.20 - 0.60) / 0.60 = +100%
  -> customers pay 2x for the NAME -> strong equity
</code></pre>
<div class="callout"><span class="badge">Coca-Cola</span> In blind taste tests many people prefer Pepsi, yet Coca-Cola outsells it — the difference is <strong>brand equity</strong>, and measuring it is what this course is about.</div>`,
    `<span class="eyebrow">BMO301 · Chương 1 · Bài 1.1</span>
<h2>Vì sao đo lường thương hiệu — tài sản thương hiệu</h2>
<h3>Thương hiệu là một tài sản</h3>
<p>Một <strong>thương hiệu</strong> không chỉ là logo — nó là tập hợp liên tưởng trong tâm trí khách hàng, làm thay đổi cách họ chọn và mức họ sẵn lòng trả. <strong>Tài sản thương hiệu (brand equity)</strong> là giá trị tăng thêm mà cái tên mang lại cho sản phẩm. Vì nó tạo ra dòng tiền tương lai, nó được coi là <em>tài sản vô hình</em> — Interbrand định giá riêng thương hiệu Apple ở mức hàng trăm tỉ đô.</p>
<h3>Hai góc nhìn về tài sản thương hiệu</h3>
<ul>
<li><strong>Dựa trên khách hàng (nhận thức):</strong> người ta biết gì, cảm gì và thích gì — nhận biết, liên tưởng, trung thành (Chương 2–4).</li>
<li><strong>Tài chính (kết quả):</strong> số tiền mà nhận thức đó tạo ra — price premium, thị phần, định giá (Chương 7).</li>
</ul>
<h3>Đo để làm gì?</h3>
<ul>
<li><strong>Biện minh ngân sách</strong> — chứng minh marketing xây một tài sản bền, không chỉ doanh số ngắn hạn.</li>
<li><strong>Dẫn hướng quyết định</strong> — biết chiến dịch, kênh và thông điệp nào làm thương hiệu dịch chuyển.</li>
<li><strong>Định giá công ty</strong> — thương hiệu xuất hiện trong M&amp;A và trên bảng cân đối.</li>
</ul>
<pre><code>Price premium (tín hiệu equity đơn giản):
  Thương hiệu ta:  1,20$ cho lon cola 330ml
  Hàng nhãn riêng: 0,60$ cho lon cola 330ml (cùng nhóm)
  Premium = (1,20 - 0,60) / 0,60 = +100%
  -> khách trả gấp 2 lần cho CÁI TÊN -> equity mạnh
</code></pre>
<div class="callout"><span class="badge">Coca-Cola</span> Trong thử vị bịt mắt, nhiều người thích Pepsi hơn, nhưng Coca-Cola vẫn bán chạy hơn — khác biệt nằm ở <strong>tài sản thương hiệu</strong>, và đo nó chính là điều môn học này hướng tới.</div>`,
  ]]);

const c1q = quiz('bmo301-quiz-1', 'Quiz 1 — Why measure|||Quiz 1 — Vì sao đo lường', [
  { id: 'q1', question: 'Tài sản thương hiệu (brand equity) là?', options: ['Chi phí quảng cáo trong năm', 'Giá trị tăng thêm mà cái tên thương hiệu mang lại cho sản phẩm', 'Số nhân viên marketing', 'Giá cổ phiếu công ty'], correctIndex: 1, explanation: 'Brand equity = giá trị mà thương hiệu cộng thêm vào sản phẩm (mindset + tài chính).' },
  { id: 'q2', question: 'Khách sẵn lòng trả cao hơn cho cùng sản phẩm nhờ cái tên — chỉ số này gọi là?', options: ['Price premium', 'Bounce rate', 'Impression', 'CPM'], correctIndex: 0, explanation: 'Price premium là một tín hiệu tài chính của brand equity.' },
  { id: 'q3', question: 'Hai góc nhìn chính về brand equity là?', options: ['Online và offline', 'Dựa trên khách hàng (mindset) và tài chính (outcome)', 'Ngắn hạn và dài hạn', 'B2B và B2C'], correctIndex: 1, explanation: 'Customer-based (nhận thức) sinh ra financial (kết quả tiền).' },
]);

const c2 = doc('bmo301-2-1-cbbe', '2.1 — Customer-based brand equity (CBBE)|||2.1 — Tài sản thương hiệu dựa trên khách hàng (CBBE)',
  'Mô hình CBBE của Keller (kim tự tháp), tài sản Aaker: brand awareness, brand associations, perceived quality, brand loyalty; đo mỗi tầng.',
  [[
    `<span class="eyebrow">BMO301 · Chapter 2 · Lesson 2.1</span>
<h2>Customer-based brand equity (CBBE)</h2>
<p>Keller's <strong>CBBE model</strong> says brand equity lives in the customer's mind and is built in four steps — a pyramid from bottom to top:</p>
<ol>
<li><strong>Identity — "Who are you?"</strong> Salience / awareness: does the customer even know the brand?</li>
<li><strong>Meaning — "What are you?"</strong> Performance (does it work) &amp; imagery (what it feels like).</li>
<li><strong>Response — "What about you?"</strong> Judgments (quality, credibility) &amp; feelings.</li>
<li><strong>Resonance — "What about you and me?"</strong> The peak: loyalty, attachment, active advocacy.</li>
</ol>
<h3>Aaker's brand-equity assets</h3>
<p>David Aaker groups the measurable assets a strong brand holds:</p>
<ul>
<li><strong>Brand awareness</strong> — is the brand recognised/recalled?</li>
<li><strong>Brand associations</strong> — what ideas attach to it (safe, premium, fun)?</li>
<li><strong>Perceived quality</strong> — how good customers believe it is.</li>
<li><strong>Brand loyalty</strong> — do they come back and resist switching?</li>
</ul>
<pre><code>Where a metric lives on the pyramid:
  Awareness  -> aided/unaided recall, "top of mind"
  Meaning    -> brand-attribute / image surveys
  Response   -> perceived-quality & consideration scores
  Resonance  -> repeat rate, NPS, advocacy / referrals
</code></pre>
<div class="callout"><span class="badge">Apple</span> Apple reaches <strong>resonance</strong>: customers queue for launches, defend the brand and rebuy across products — the top of Keller's pyramid, and the hardest level to fake.</div>`,
    `<span class="eyebrow">BMO301 · Chương 2 · Bài 2.1</span>
<h2>Tài sản thương hiệu dựa trên khách hàng (CBBE)</h2>
<p>Mô hình <strong>CBBE</strong> của Keller cho rằng tài sản thương hiệu nằm trong tâm trí khách và được xây theo bốn bước — một kim tự tháp từ dưới lên:</p>
<ol>
<li><strong>Nhận diện — "Bạn là ai?"</strong> Độ nổi bật / nhận biết: khách có biết thương hiệu không?</li>
<li><strong>Ý nghĩa — "Bạn là gì?"</strong> Hiệu năng (có chạy tốt) &amp; hình ảnh (cảm giác thế nào).</li>
<li><strong>Phản hồi — "Bạn thì sao?"</strong> Đánh giá (chất lượng, tin cậy) &amp; cảm xúc.</li>
<li><strong>Cộng hưởng — "Bạn và tôi?"</strong> Đỉnh: trung thành, gắn bó, chủ động ủng hộ.</li>
</ol>
<h3>Các tài sản thương hiệu của Aaker</h3>
<p>David Aaker gom nhóm những tài sản đo được của một thương hiệu mạnh:</p>
<ul>
<li><strong>Nhận biết thương hiệu</strong> — thương hiệu có được nhận ra/nhớ lại?</li>
<li><strong>Liên tưởng thương hiệu</strong> — những ý niệm gắn vào nó (an toàn, cao cấp, vui)?</li>
<li><strong>Chất lượng cảm nhận</strong> — khách tin nó tốt tới đâu.</li>
<li><strong>Trung thành thương hiệu</strong> — họ có quay lại và ngại đổi sang hãng khác?</li>
</ul>
<pre><code>Chỉ số nằm ở tầng nào của kim tự tháp:
  Nhận biết   -> gợi/không gợi nhớ, "top of mind"
  Ý nghĩa     -> khảo sát thuộc tính / hình ảnh
  Phản hồi    -> điểm chất lượng cảm nhận & cân nhắc
  Cộng hưởng  -> tỉ lệ quay lại, NPS, giới thiệu
</code></pre>
<div class="callout"><span class="badge">Apple</span> Apple đạt <strong>cộng hưởng</strong>: khách xếp hàng ngày ra mắt, bảo vệ thương hiệu và mua lại xuyên nhiều sản phẩm — đỉnh kim tự tháp Keller, và là tầng khó giả nhất.</div>`,
  ]]);

const c2q = quiz('bmo301-quiz-2', 'Quiz 2 — CBBE|||Quiz 2 — CBBE', [
  { id: 'q1', question: 'Mô hình CBBE của Keller được sắp xếp dạng?', options: ['Phễu doanh số', 'Kim tự tháp 4 tầng (nhận diện → ý nghĩa → phản hồi → cộng hưởng)', 'Ma trận BCG', 'Vòng đời sản phẩm'], correctIndex: 1, explanation: 'CBBE là kim tự tháp: identity → meaning → response → resonance.' },
  { id: 'q2', question: 'Đâu KHÔNG phải một tài sản thương hiệu theo Aaker?', options: ['Brand awareness', 'Perceived quality', 'Brand loyalty', 'Chi phí máy chủ'], correctIndex: 3, explanation: 'Aaker: awareness, associations, perceived quality, loyalty — không gồm chi phí hạ tầng.' },
  { id: 'q3', question: 'Tầng đỉnh "resonance" của CBBE thể hiện qua chỉ số nào?', options: ['CPM quảng cáo', 'Trung thành/NPS/giới thiệu (advocacy)', 'Số impression', 'Kích thước banner'], correctIndex: 1, explanation: 'Resonance = loyalty, attachment, active advocacy (NPS, repeat, referral).' },
]);

const c3 = doc('bmo301-3-1-awareness-health', '3.1 — Awareness & brand-health tracking|||3.1 — Chỉ số nhận biết & sức khoẻ thương hiệu',
  'Awareness (aided/unaided, top-of-mind), consideration, brand health tracking (theo dõi định kỳ), funnel thương hiệu, NPS.',
  [[
    `<span class="eyebrow">BMO301 · Chapter 3 · Lesson 3.1</span>
<h2>Awareness &amp; brand-health tracking</h2>
<h3>The awareness ladder</h3>
<ul>
<li><strong>Unaided (spontaneous) awareness</strong> — "Name a sneaker brand." Whoever comes to mind unprompted is strongest.</li>
<li><strong>Top-of-mind</strong> — the <em>first</em> brand named. A prized position.</li>
<li><strong>Aided awareness</strong> — "Have you heard of Nike?" Easier to score, weaker signal.</li>
</ul>
<h3>The brand funnel</h3>
<pre><code>Awareness -> Consideration -> Preference -> Purchase -> Loyalty
  100%    ->     60%        ->    35%     ->   20%    ->  12%
  (leaks at each step show WHERE the brand loses people)
</code></pre>
<p>Tracking these stages over time is <strong>brand-health tracking</strong>: the same survey run every quarter so you see trends, not one-off snapshots.</p>
<h3>Net Promoter Score (NPS)</h3>
<pre><code>"How likely are you to recommend us?" (0-10)
  Promoters (9-10)  Passives (7-8)  Detractors (0-6)
  NPS = %Promoters - %Detractors      (range -100..+100)
  e.g. 50% - 20% = +30
</code></pre>
<div class="callout"><span class="badge">Why track over time</span> A single number means little; the <em>trend</em> is the insight. A falling top-of-mind score is an early warning long before sales drop.</div>`,
    `<span class="eyebrow">BMO301 · Chương 3 · Bài 3.1</span>
<h2>Chỉ số nhận biết &amp; sức khoẻ thương hiệu</h2>
<h3>Thang nhận biết</h3>
<ul>
<li><strong>Nhận biết không gợi ý (spontaneous)</strong> — "Kể tên một hãng giày." Ai bật ra tự nhiên là mạnh nhất.</li>
<li><strong>Top-of-mind</strong> — thương hiệu được nhắc <em>đầu tiên</em>. Vị trí quý giá.</li>
<li><strong>Nhận biết có gợi ý (aided)</strong> — "Bạn có nghe tới Nike không?" Dễ đạt điểm, tín hiệu yếu hơn.</li>
</ul>
<h3>Phễu thương hiệu</h3>
<pre><code>Nhận biết -> Cân nhắc -> Ưa thích -> Mua -> Trung thành
  100%    ->   60%    ->   35%    -> 20% ->    12%
  (rò rỉ ở mỗi bước cho thấy thương hiệu MẤT khách Ở ĐÂU)
</code></pre>
<p>Theo dõi các bước này theo thời gian là <strong>brand-health tracking</strong>: cùng một khảo sát chạy mỗi quý để thấy xu hướng, không phải ảnh chụp một lần.</p>
<h3>Net Promoter Score (NPS)</h3>
<pre><code>"Bạn có sẵn lòng giới thiệu chúng tôi?" (0-10)
  Ủng hộ (9-10)  Trung lập (7-8)  Chê (0-6)
  NPS = %Ủng hộ - %Chê        (khoảng -100..+100)
  vd 50% - 20% = +30
</code></pre>
<div class="callout"><span class="badge">Vì sao theo dõi theo thời gian</span> Một con số đơn lẻ nói ít; <em>xu hướng</em> mới là insight. Top-of-mind tụt dốc là cảnh báo sớm, trước khi doanh số giảm rất lâu.</div>`,
  ]]);

const c3q = quiz('bmo301-quiz-3', 'Quiz 3 — Awareness & health|||Quiz 3 — Nhận biết & sức khoẻ', [
  { id: 'q1', question: 'Thương hiệu được nhắc ĐẦU TIÊN khi hỏi không gợi ý gọi là?', options: ['Aided awareness', 'Top-of-mind', 'Bounce rate', 'Impression share'], correctIndex: 1, explanation: 'Top-of-mind = brand đầu tiên bật ra, vị trí mạnh nhất của awareness.' },
  { id: 'q2', question: 'Brand-health tracking khác một khảo sát đơn lẻ ở chỗ?', options: ['Chỉ hỏi nhân viên', 'Chạy định kỳ (vd mỗi quý) để thấy xu hướng theo thời gian', 'Chỉ đo doanh số', 'Không cần mẫu khách'], correctIndex: 1, explanation: 'Theo dõi định kỳ cho thấy trend — insight nằm ở xu hướng, không phải một snapshot.' },
  { id: 'q3', question: 'NPS được tính bằng?', options: ['%Promoters − %Detractors', 'Tổng doanh thu / chi phí', 'Số click / số impression', '%Passives × 2'], correctIndex: 0, explanation: 'NPS = % ủng hộ (9-10) trừ % chê (0-6), khoảng -100..+100.' },
]);

const c4 = doc('bmo301-4-1-brand-lift', '4.1 — Brand lift & research|||4.1 — Brand lift & nghiên cứu',
  'Brand lift study, control vs exposed, khảo sát nâng cao (awareness/consideration/recall), đo tác động thật của chiến dịch bằng thí nghiệm.',
  [[
    `<span class="eyebrow">BMO301 · Chapter 4 · Lesson 4.1</span>
<h2>Brand lift &amp; research</h2>
<h3>The core question</h3>
<p>Tracking tells you awareness went up — but did <strong>your campaign</strong> cause it, or the season, the price, a competitor's stumble? A <strong>brand lift study</strong> answers that with a controlled experiment.</p>
<h3>Control vs exposed</h3>
<pre><code>Randomly split the audience:
  EXPOSED group  -> sees the campaign ads
  CONTROL group  -> sees a placebo / no ad
Then survey BOTH with the same question:
  "Have you heard of Brand X?"  (aided awareness)
  Exposed: 42% say yes
  Control: 30% say yes
  Brand LIFT = 42% - 30% = +12 points
</code></pre>
<p>Because the only planned difference between the groups is the ad, the gap is caused <em>by the ad</em>. Google Brand Lift and Nielsen run exactly this design at scale.</p>
<h3>What lift studies measure</h3>
<ul>
<li><strong>Awareness lift</strong> — did more people recognise the brand?</li>
<li><strong>Consideration lift</strong> — would more people consider buying?</li>
<li><strong>Ad recall lift</strong> — do they remember seeing the ad?</li>
<li><strong>Search / favourability lift</strong> — behavioural &amp; attitude shifts.</li>
</ul>
<div class="callout"><span class="badge">Correlation ≠ causation</span> A control group is what turns "sales rose after our ad" (correlation) into "our ad <em>caused</em> the lift" (causation). Without it, you're guessing.</div>`,
    `<span class="eyebrow">BMO301 · Chương 4 · Bài 4.1</span>
<h2>Brand lift &amp; nghiên cứu</h2>
<h3>Câu hỏi cốt lõi</h3>
<p>Theo dõi cho thấy nhận biết tăng — nhưng <strong>chiến dịch của bạn</strong> gây ra điều đó, hay do mùa vụ, do giá, do đối thủ vấp ngã? Một <strong>nghiên cứu brand lift</strong> trả lời bằng một thí nghiệm có đối chứng.</p>
<h3>Đối chứng vs phơi nhiễm</h3>
<pre><code>Chia ngẫu nhiên khán giả:
  Nhóm PHƠI NHIỄM (exposed) -> thấy quảng cáo chiến dịch
  Nhóm ĐỐI CHỨNG (control)  -> thấy quảng cáo giả / không thấy
Rồi khảo sát CẢ HAI cùng một câu:
  "Bạn có nghe tới Thương hiệu X?"  (nhận biết có gợi ý)
  Phơi nhiễm: 42% nói có
  Đối chứng:  30% nói có
  Brand LIFT = 42% - 30% = +12 điểm
</code></pre>
<p>Vì khác biệt duy nhất được sắp đặt giữa hai nhóm là quảng cáo, khoảng chênh đó do <em>quảng cáo</em> gây ra. Google Brand Lift và Nielsen chạy đúng thiết kế này ở quy mô lớn.</p>
<h3>Brand lift đo những gì</h3>
<ul>
<li><strong>Lift nhận biết</strong> — có thêm người nhận ra thương hiệu?</li>
<li><strong>Lift cân nhắc</strong> — có thêm người cân nhắc mua?</li>
<li><strong>Lift ghi nhớ quảng cáo</strong> — họ có nhớ đã thấy quảng cáo?</li>
<li><strong>Lift tìm kiếm / thiện cảm</strong> — dịch chuyển hành vi &amp; thái độ.</li>
</ul>
<div class="callout"><span class="badge">Tương quan ≠ nhân quả</span> Nhóm đối chứng là thứ biến "doanh số tăng sau khi chạy quảng cáo" (tương quan) thành "quảng cáo <em>gây ra</em> lift" (nhân quả). Thiếu nó là đang đoán.</div>`,
  ]]);

const c4q = quiz('bmo301-quiz-4', 'Quiz 4 — Brand lift|||Quiz 4 — Brand lift', [
  { id: 'q1', question: 'Mục đích chính của một brand lift study là?', options: ['Đo dung lượng máy chủ', 'Đo tác động NHÂN QUẢ của chiến dịch bằng so sánh nhóm phơi nhiễm vs đối chứng', 'Tính lương đội marketing', 'Thiết kế logo'], correctIndex: 1, explanation: 'Brand lift dùng thí nghiệm control/exposed để tách tác động thật của quảng cáo.' },
  { id: 'q2', question: 'Nếu exposed = 42% và control = 30% nhận biết, brand lift là?', options: ['+72 điểm', '+12 điểm', '−12 điểm', '1,4 lần'], correctIndex: 1, explanation: 'Lift = 42% − 30% = +12 điểm.' },
  { id: 'q3', question: 'Vì sao cần nhóm đối chứng (control)?', options: ['Để tăng số impression', 'Để phân biệt tương quan với nhân quả (loại yếu tố ngoài quảng cáo)', 'Để giảm chi phí server', 'Để đổi màu quảng cáo'], correctIndex: 1, explanation: 'Control loại nhiễu (mùa vụ, giá...) nên chênh lệch còn lại là do quảng cáo.' },
]);

const c5 = doc('bmo301-5-1-omnichannel', '5.1 — Omnichannel measurement|||5.1 — Đo lường đa kênh',
  'Omnichannel vs multichannel, unified analytics (một góc nhìn), cross-channel: hợp nhất ID khách, đếm trùng, GA4 events; đo hành trình liền mạch.',
  [[
    `<span class="eyebrow">BMO301 · Chapter 5 · Lesson 5.1</span>
<h2>Omnichannel measurement</h2>
<h3>Multichannel vs omnichannel</h3>
<ul>
<li><strong>Multichannel</strong> — the brand is <em>present</em> on many channels (web, app, store, social), but each is measured in its own silo.</li>
<li><strong>Omnichannel</strong> — the channels are <em>joined</em> around one customer, so a single journey (see on Instagram → search → buy in-app → pick up in store) is measured as one path.</li>
</ul>
<h3>Why silos mislead</h3>
<pre><code>Same customer, counted per channel:
  Google Ads dashboard: "1 conversion"
  Facebook dashboard:   "1 conversion"
  Email tool:           "1 conversion"
  Reality = ONE sale, not three
  -> double-counting inflates every channel's "success"
</code></pre>
<h3>Unified analytics</h3>
<p>The fix is a <strong>single source of truth</strong> — a stitched user identity so all touchpoints roll up to one person and one order. Tools like <strong>GA4</strong> model events across web and app under one user/session, which is the foundation for the attribution in Chapter 6.</p>
<div class="callout"><span class="badge">Starbucks</span> App, card, store and website share one account — order on the app, earn stars in store, redeem online. That joined-up measurement is omnichannel done right.</div>`,
    `<span class="eyebrow">BMO301 · Chương 5 · Bài 5.1</span>
<h2>Đo lường đa kênh</h2>
<h3>Multichannel vs omnichannel</h3>
<ul>
<li><strong>Multichannel</strong> — thương hiệu <em>có mặt</em> trên nhiều kênh (web, app, cửa hàng, mạng xã hội), nhưng mỗi kênh đo trong ốc đảo riêng.</li>
<li><strong>Omnichannel</strong> — các kênh được <em>nối</em> quanh một khách, nên một hành trình (thấy trên Instagram → tìm kiếm → mua trong app → lấy hàng ở cửa hàng) được đo như một đường đi.</li>
</ul>
<h3>Vì sao ốc đảo gây hiểu sai</h3>
<pre><code>Cùng một khách, bị đếm theo từng kênh:
  Dashboard Google Ads: "1 chuyển đổi"
  Dashboard Facebook:   "1 chuyển đổi"
  Công cụ email:        "1 chuyển đổi"
  Thực tế = MỘT đơn hàng, không phải ba
  -> đếm trùng thổi phồng "thành công" của mọi kênh
</code></pre>
<h3>Phân tích hợp nhất (unified analytics)</h3>
<p>Cách chữa là một <strong>nguồn sự thật duy nhất</strong> — ghép danh tính người dùng để mọi điểm chạm gom về một người và một đơn. Công cụ như <strong>GA4</strong> mô hình hoá sự kiện xuyên web và app dưới cùng một user/session, làm nền cho attribution ở Chương 6.</p>
<div class="callout"><span class="badge">Starbucks</span> App, thẻ, cửa hàng và website chung một tài khoản — đặt trên app, tích sao ở cửa hàng, đổi thưởng online. Đo lường nối liền đó là omnichannel làm đúng.</div>`,
  ]]);

const c5q = quiz('bmo301-quiz-5', 'Quiz 5 — Omnichannel|||Quiz 5 — Đa kênh', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa multichannel và omnichannel là?', options: ['Số kênh nhiều hơn', 'Omnichannel NỐI các kênh quanh một khách và đo như một hành trình', 'Omnichannel chỉ dùng cho mạng xã hội', 'Không có khác biệt'], correctIndex: 1, explanation: 'Multichannel = có mặt rời rạc; omnichannel = hợp nhất quanh một khách.' },
  { id: 'q2', question: 'Đo từng kênh trong ốc đảo riêng dễ gây lỗi gì?', options: ['Thiếu impression', 'Đếm trùng (double-counting) một chuyển đổi ở nhiều dashboard', 'Server quá tải', 'Sai màu thương hiệu'], correctIndex: 1, explanation: 'Cùng một đơn bị mỗi công cụ nhận là của mình → thổi phồng thành công.' },
  { id: 'q3', question: 'Nền tảng để đo omnichannel đúng là?', options: ['Nhiều bảng tính rời', 'Unified analytics — một nguồn sự thật, ghép danh tính người dùng', 'Chỉ đo doanh số cửa hàng', 'Tắt hết tracking'], correctIndex: 1, explanation: 'Cần một góc nhìn hợp nhất (vd GA4 gom event web+app theo một user).' },
]);

const c6 = doc('bmo301-6-1-attribution-mmm', '6.1 — Attribution & the journey|||6.1 — Attribution & hành trình',
  'Attribution models: last-click, first-click, linear, time-decay, position-based, data-driven; multi-touch attribution; marketing mix modeling (MMM) — top-down vs bottom-up.',
  [[
    `<span class="eyebrow">BMO301 · Chapter 6 · Lesson 6.1</span>
<h2>Attribution &amp; the customer journey</h2>
<h3>The credit problem</h3>
<p>A customer touched an ad, an email and a search before buying. Which touch gets the credit for the sale? <strong>Attribution</strong> is the rule that assigns credit across touchpoints.</p>
<h3>Attribution models</h3>
<ul>
<li><strong>Last-click</strong> — 100% to the final touch. Simple, but ignores everything that built awareness.</li>
<li><strong>First-click</strong> — 100% to the first touch.</li>
<li><strong>Linear</strong> — equal credit to every touch.</li>
<li><strong>Time-decay</strong> — more credit to touches nearer the sale.</li>
<li><strong>Position-based (U-shaped)</strong> — most to first &amp; last, some to the middle.</li>
<li><strong>Data-driven (DDA)</strong> — an algorithm learns each touch's real contribution from the data (GA4's default).</li>
</ul>
<pre><code>Journey: Display -> Social -> Search -> BUY ($100)
  Last-click:  Search $100,  others $0
  Linear:      each of 3 gets ~$33
  Time-decay:  Search > Social > Display
</code></pre>
<h3>Multi-touch attribution vs MMM</h3>
<ul>
<li><strong>Multi-touch attribution (MTA)</strong> — bottom-up, tracks individual user paths; precise but needs cookies/IDs (privacy-limited).</li>
<li><strong>Marketing mix modeling (MMM)</strong> — top-down, uses aggregate history &amp; statistics to estimate each channel's effect (incl. offline TV); privacy-safe, less granular.</li>
</ul>
<div class="callout"><span class="badge">No model is "true"</span> Each model is a lens, not reality. Compare a few — if last-click and data-driven disagree, the upper-funnel channels are doing hidden work.</div>`,
    `<span class="eyebrow">BMO301 · Chương 6 · Bài 6.1</span>
<h2>Attribution &amp; hành trình khách hàng</h2>
<h3>Bài toán chia công</h3>
<p>Khách chạm một quảng cáo, một email và một tìm kiếm trước khi mua. Điểm chạm nào được ghi công cho đơn hàng? <strong>Attribution</strong> là quy tắc phân bổ công qua các điểm chạm.</p>
<h3>Các mô hình attribution</h3>
<ul>
<li><strong>Last-click</strong> — 100% cho chạm cuối. Đơn giản, nhưng bỏ qua mọi thứ đã tạo nhận biết.</li>
<li><strong>First-click</strong> — 100% cho chạm đầu.</li>
<li><strong>Linear (tuyến tính)</strong> — chia đều cho mọi điểm chạm.</li>
<li><strong>Time-decay</strong> — chạm càng gần lúc mua càng nhiều công.</li>
<li><strong>Position-based (chữ U)</strong> — nhiều nhất cho chạm đầu &amp; cuối, phần giữa ít.</li>
<li><strong>Data-driven (DDA)</strong> — thuật toán học đóng góp thật của mỗi chạm từ dữ liệu (mặc định của GA4).</li>
</ul>
<pre><code>Hành trình: Display -> Social -> Search -> MUA (100$)
  Last-click:  Search 100$,  còn lại 0$
  Linear:      mỗi trong 3 được ~33$
  Time-decay:  Search > Social > Display
</code></pre>
<h3>Multi-touch attribution vs MMM</h3>
<ul>
<li><strong>Multi-touch attribution (MTA)</strong> — bottom-up, bám đường đi từng người; chính xác nhưng cần cookie/ID (bị hạn chế quyền riêng tư).</li>
<li><strong>Marketing mix modeling (MMM)</strong> — top-down, dùng lịch sử tổng hợp &amp; thống kê để ước lượng tác động từng kênh (kể cả TV offline); an toàn về quyền riêng tư, ít chi tiết hơn.</li>
</ul>
<div class="callout"><span class="badge">Không mô hình nào "đúng tuyệt đối"</span> Mỗi mô hình là một lăng kính, không phải thực tế. So vài mô hình — nếu last-click và data-driven lệch nhau, các kênh đầu phễu đang làm việc thầm lặng.</div>`,
  ]]);

const c6q = quiz('bmo301-quiz-6', 'Quiz 6 — Attribution|||Quiz 6 — Attribution', [
  { id: 'q1', question: 'Mô hình attribution nào gán 100% công cho điểm chạm CUỐI?', options: ['First-click', 'Last-click', 'Linear', 'Time-decay'], correctIndex: 1, explanation: 'Last-click dồn toàn bộ công cho chạm cuối trước khi chuyển đổi.' },
  { id: 'q2', question: 'Data-driven attribution (DDA) khác các mô hình cố định ở chỗ?', options: ['Luôn chia đều', 'Dùng thuật toán học đóng góp thật của mỗi chạm từ dữ liệu', 'Chỉ tính chạm đầu', 'Bỏ qua tìm kiếm'], correctIndex: 1, explanation: 'DDA phân bổ theo dữ liệu thực, không theo quy tắc cứng.' },
  { id: 'q3', question: 'Marketing mix modeling (MMM) khác multi-touch attribution ở điểm nào?', options: ['MMM là top-down dùng dữ liệu tổng hợp/thống kê, an toàn quyền riêng tư', 'MMM cần cookie từng người', 'MMM chỉ đo kênh online', 'MMM và MTA giống hệt nhau'], correctIndex: 0, explanation: 'MMM top-down, đo cả offline, không cần ID cá nhân; MTA bottom-up theo từng user.' },
]);

const c7 = doc('bmo301-7-1-performance-finance', '7.1 — Performance & financial metrics|||7.1 — Chỉ số hiệu quả & tài chính',
  'ROI vs ROAS, customer lifetime value (CLV), share of voice (SOV), brand valuation (Interbrand); công thức và ý nghĩa quyết định.',
  [[
    `<span class="eyebrow">BMO301 · Chapter 7 · Lesson 7.1</span>
<h2>Performance &amp; financial metrics</h2>
<h3>ROI vs ROAS</h3>
<pre><code>ROAS = Revenue / Ad spend           (gross efficiency)
  $5,000 revenue / $1,000 ads = 5.0  (or "500%")
ROI  = (Profit - Cost) / Cost       (net, after margins)
  If margin is 40%: profit = 0.4*5000 = $2,000
  ROI = (2000 - 1000) / 1000 = +100%
</code></pre>
<p>ROAS looks at revenue per ad dollar; <strong>ROI</strong> counts real profit — a 5x ROAS can still lose money if margins are thin.</p>
<h3>Customer Lifetime Value (CLV)</h3>
<pre><code>CLV = Avg order value x Purchases/yr x Retention years
  $50 x 4 x 3 = $600 per customer
  Rule of thumb: CLV should exceed CAC (cost to acquire)
</code></pre>
<h3>Share of Voice (SOV)</h3>
<pre><code>SOV = Your brand's presence / Total category presence
  (ad spend, impressions, or mentions)
  $2M of a $10M category = 20% SOV
  SOV > market share often predicts GROWTH
</code></pre>
<h3>Brand valuation</h3>
<p><strong>Interbrand</strong> and others put a dollar figure on the brand itself — combining financial forecast, the role the brand plays in choice, and brand strength. This is where the mindset metrics of Chapters 2–4 turn into a number on the balance sheet.</p>
<div class="callout"><span class="badge">Connect the dots</span> Awareness &amp; loyalty (mindset) → price premium &amp; retention → CLV &amp; ROI → brand valuation. Financial metrics are the <em>outcome</em> of brand equity, not a substitute for measuring it.</div>`,
    `<span class="eyebrow">BMO301 · Chương 7 · Bài 7.1</span>
<h2>Chỉ số hiệu quả &amp; tài chính</h2>
<h3>ROI vs ROAS</h3>
<pre><code>ROAS = Doanh thu / Chi quảng cáo    (hiệu quả gộp)
  5.000$ doanh thu / 1.000$ ads = 5,0  (hay "500%")
ROI  = (Lợi nhuận - Chi phí) / Chi phí  (ròng, sau biên)
  Nếu biên 40%: lợi nhuận = 0,4*5000 = 2.000$
  ROI = (2000 - 1000) / 1000 = +100%
</code></pre>
<p>ROAS nhìn doanh thu trên mỗi đồng quảng cáo; <strong>ROI</strong> tính lợi nhuận thật — ROAS 5 lần vẫn có thể lỗ nếu biên mỏng.</p>
<h3>Giá trị vòng đời khách hàng (CLV)</h3>
<pre><code>CLV = Giá trị đơn TB x Số lần mua/năm x Số năm giữ chân
  50$ x 4 x 3 = 600$ mỗi khách
  Quy tắc: CLV nên lớn hơn CAC (chi phí thu hút khách)
</code></pre>
<h3>Share of Voice (SOV)</h3>
<pre><code>SOV = Hiện diện thương hiệu ta / Tổng hiện diện ngành
  (chi quảng cáo, impression, hoặc lượt nhắc)
  2 triệu$ trong ngành 10 triệu$ = 20% SOV
  SOV > thị phần thường báo hiệu TĂNG TRƯỞNG
</code></pre>
<h3>Định giá thương hiệu</h3>
<p><strong>Interbrand</strong> và các hãng khác gán một con số đô cho chính thương hiệu — kết hợp dự báo tài chính, vai trò của thương hiệu trong quyết định mua, và sức mạnh thương hiệu. Đây là nơi các chỉ số nhận thức ở Chương 2–4 biến thành con số trên bảng cân đối.</p>
<div class="callout"><span class="badge">Nối các mảnh</span> Nhận biết &amp; trung thành (nhận thức) → price premium &amp; giữ chân → CLV &amp; ROI → định giá thương hiệu. Chỉ số tài chính là <em>kết quả</em> của tài sản thương hiệu, không thay thế việc đo nó.</div>`,
  ]]);

const c7q = quiz('bmo301-quiz-7', 'Quiz 7 — Performance & finance|||Quiz 7 — Hiệu quả & tài chính', [
  { id: 'q1', question: 'ROAS được tính bằng?', options: ['Lợi nhuận / số nhân viên', 'Doanh thu / chi phí quảng cáo', 'Impression / click', 'CLV / CAC'], correctIndex: 1, explanation: 'ROAS = doanh thu chia chi quảng cáo (hiệu quả gộp trên mỗi đồng ads).' },
  { id: 'q2', question: 'Vì sao ROAS 5 lần vẫn có thể là lỗ?', options: ['Vì impression thấp', 'Vì ROAS tính doanh thu chứ không tính biên lợi nhuận; biên mỏng thì ROI có thể âm', 'Vì thiếu logo', 'Vì sai kênh'], correctIndex: 1, explanation: 'ROI mới tính lợi nhuận thật sau biên; ROAS cao nhưng biên mỏng vẫn lỗ.' },
  { id: 'q3', question: 'Share of Voice (SOV) đo?', options: ['Số nhân viên bán hàng', 'Tỉ lệ hiện diện của thương hiệu so với tổng cả ngành (spend/impression/mentions)', 'Tốc độ trang web', 'Số dòng code'], correctIndex: 1, explanation: 'SOV = hiện diện của mình / tổng ngành; SOV > thị phần thường báo hiệu tăng trưởng.' },
]);

const c8 = doc('bmo301-8-1-dashboard-decision', '8.1 — Dashboards, data & decisions|||8.1 — Dashboard, dữ liệu & ra quyết định',
  'KPI framework (mục tiêu → KPI → chỉ số), thiết kế dashboard, first-party data & quyền riêng tư (cookie, GDPR/consent), biến insight thành hành động.',
  [[
    `<span class="eyebrow">BMO301 · Chapter 8 · Lesson 8.1</span>
<h2>Dashboards, data &amp; decisions</h2>
<h3>From goal to KPI to metric</h3>
<pre><code>Goal:   Grow the brand in Gen-Z
KPI:    Top-of-mind awareness among 18-24 (target +5pt)
Metric: quarterly survey score
  A KPI is the ONE number that tells you if the goal is met;
  metrics are the many numbers that feed it.
</code></pre>
<p>A good <strong>KPI framework</strong> keeps a dashboard honest: every chart earns its place by answering a decision, not by looking busy.</p>
<h3>Designing a dashboard</h3>
<ul>
<li><strong>Audience-first</strong> — an exec wants 5 KPIs and a trend; an analyst wants the drill-down.</li>
<li><strong>Compare, don't just show</strong> — vs target, vs last period, vs competitor.</li>
<li><strong>Fewer, clearer</strong> — a wall of numbers hides the signal.</li>
</ul>
<h3>First-party data &amp; privacy</h3>
<p>Third-party cookies are disappearing. <strong>First-party data</strong> — collected directly from your own customers with consent — is now the durable foundation. Measurement must respect <strong>privacy law</strong> (GDPR, consent banners) and lean on privacy-safe methods like MMM and modelled conversions.</p>
<h3>Insight → action</h3>
<p>The point isn't the chart — it's the decision. A falling consideration score should trigger a message test; a channel with weak data-driven credit should lose budget. Measurement only matters when it <em>changes what you do next</em>.</p>
<div class="callout"><span class="badge">The whole course in one line</span> Measure brand equity, join it across channels, attribute it honestly, tie it to money — then <strong>act</strong> on what the numbers say.</div>`,
    `<span class="eyebrow">BMO301 · Chương 8 · Bài 8.1</span>
<h2>Dashboard, dữ liệu &amp; ra quyết định</h2>
<h3>Từ mục tiêu tới KPI tới chỉ số</h3>
<pre><code>Mục tiêu: Làm thương hiệu lớn trong Gen-Z
KPI:      Top-of-mind ở nhóm 18-24 (đích +5 điểm)
Chỉ số:   điểm khảo sát hằng quý
  KPI là MỘT con số cho biết mục tiêu đạt hay chưa;
  metrics là nhiều con số nuôi nó.
</code></pre>
<p>Một <strong>khung KPI</strong> tốt giữ dashboard trung thực: mỗi biểu đồ phải xứng chỗ bằng cách trả lời một quyết định, không phải để trông cho bận.</p>
<h3>Thiết kế dashboard</h3>
<ul>
<li><strong>Ưu tiên người xem</strong> — sếp muốn 5 KPI và một xu hướng; nhà phân tích muốn khoan sâu.</li>
<li><strong>So sánh, đừng chỉ hiển thị</strong> — so với đích, so kỳ trước, so đối thủ.</li>
<li><strong>Ít hơn, rõ hơn</strong> — một bức tường số làm chìm mất tín hiệu.</li>
</ul>
<h3>Dữ liệu first-party &amp; quyền riêng tư</h3>
<p>Cookie bên thứ ba đang biến mất. <strong>Dữ liệu first-party</strong> — thu trực tiếp từ chính khách của bạn có sự đồng ý — nay là nền tảng bền vững. Đo lường phải tôn trọng <strong>luật riêng tư</strong> (GDPR, banner đồng ý) và dựa vào phương pháp an toàn như MMM và chuyển đổi mô hình hoá.</p>
<h3>Insight → hành động</h3>
<p>Điểm mấu chốt không phải cái biểu đồ — mà là quyết định. Điểm cân nhắc tụt phải kích một cuộc thử thông điệp; một kênh có công data-driven yếu nên bị cắt ngân sách. Đo lường chỉ có ý nghĩa khi nó <em>thay đổi điều bạn làm tiếp theo</em>.</p>
<div class="callout"><span class="badge">Cả môn trong một câu</span> Đo tài sản thương hiệu, nối nó qua các kênh, phân bổ công trung thực, buộc nó với tiền — rồi <strong>hành động</strong> theo điều các con số nói.</div>`,
  ]]);

const c8q = quiz('bmo301-quiz-8', 'Quiz 8 — Dashboards & decisions|||Quiz 8 — Dashboard & quyết định', [
  { id: 'q1', question: 'Khác biệt giữa KPI và metric là?', options: ['Không có khác biệt', 'KPI là MỘT con số then chốt cho biết mục tiêu đạt hay chưa; metrics là nhiều số nuôi nó', 'KPI luôn là doanh thu', 'Metric chỉ dùng cho sếp'], correctIndex: 1, explanation: 'KPI gắn trực tiếp mục tiêu; metrics là các số hỗ trợ.' },
  { id: 'q2', question: 'Vì sao first-party data ngày càng quan trọng?', options: ['Vì nó miễn phí tuyệt đối', 'Vì cookie bên thứ ba đang biến mất và dữ liệu tự thu có đồng ý là nền bền vững, hợp quyền riêng tư', 'Vì nó không cần đo', 'Vì nó thay thế mọi KPI'], correctIndex: 1, explanation: 'Cookie 3rd-party mất dần; first-party (có consent) là nền tảng tuân thủ GDPR.' },
  { id: 'q3', question: 'Một dashboard thực sự có giá trị khi nào?', options: ['Khi có nhiều biểu đồ nhất', 'Khi mỗi chỉ số dẫn tới một quyết định/hành động (insight → action)', 'Khi màu sắc đẹp', 'Khi cập nhật mỗi giây'], correctIndex: 1, explanation: 'Đo lường chỉ có ý nghĩa khi nó thay đổi điều bạn làm tiếp theo.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'BMO301',
    slug: 'bmo301-brand-measurement-omnichannel-analytics',
    title: 'Brand Measurement & Omnichannel Analytics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BMO301.webp',
    shortDescription: 'Measure brand strength & analyze across channels — brand equity (CBBE/Keller, Aaker), awareness & brand-health tracking, brand lift, omnichannel attribution, MMM, ROI/ROAS/CLV, share of voice & KPI dashboards. Bilingual, real brands & quizzes.|||Đo lường thương hiệu & phân tích đa kênh — tài sản thương hiệu (CBBE, Aaker), nhận biết & sức khoẻ thương hiệu, brand lift, attribution đa kênh, MMM, ROI/ROAS/CLV, share of voice & dashboard KPI. Song ngữ, thương hiệu thật & quiz.',
    description: 'Môn <strong>BMO301 — Brand Measurement &amp; Omnichannel Analytics</strong> (kỳ 5, khối Công nghệ Truyền thông) dạy bạn <strong>đo lường thương hiệu bằng con số</strong> và phân tích nó trên nhiều kênh. Từ <strong>tài sản thương hiệu</strong> (CBBE của Keller, các tài sản của Aaker) → <strong>nhận biết, sức khoẻ thương hiệu &amp; brand lift</strong> (control/exposed) → <strong>đo lường đa kênh &amp; attribution</strong> (multi-touch, MMM) → <strong>chỉ số tài chính</strong> (ROI/ROAS, CLV, share of voice, định giá Interbrand) &amp; <strong>dashboard KPI</strong>. Bám giáo trình FLM và sách chuẩn (Farris, Keller, Aaker), song ngữ, có công thức, ví dụ thương hiệu thật và quiz mỗi chương.',
    whatYouLearn: 'Brand equity (mindset vs tài chính, price premium); CBBE Keller & tài sản Aaker; awareness (aided/unaided, top-of-mind), phễu thương hiệu, brand-health tracking & NPS; brand lift study (control/exposed); omnichannel vs multichannel, unified analytics, GA4; attribution (last/first-click, linear, time-decay, data-driven), multi-touch vs MMM; ROI/ROAS, CLV, share of voice, định giá thương hiệu; KPI framework, dashboard, first-party data & quyền riêng tư, insight → hành động.',
    requirements: 'Kiến thức marketing căn bản. Nên có tài khoản Google Analytics (GA4) và Looker Studio để thực hành. Xem điều kiện tiên quyết của khối Công nghệ Truyền thông trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Farris/Keller/Aaker), GA4, Nielsen, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đo gì, vì sao đo, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Vì sao đo lường|||Chapter 1 — Why measure', description: 'Brand equity, thương hiệu là tài sản, price premium.', lessons: [c1, c1q] },
    { title: 'Chương 2 — CBBE|||Chapter 2 — CBBE', description: 'Kim tự tháp Keller, tài sản Aaker.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nhận biết & sức khoẻ|||Chapter 3 — Awareness & health', description: 'Awareness, phễu, brand-health tracking, NPS.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Brand lift|||Chapter 4 — Brand lift', description: 'Control/exposed, đo tác động chiến dịch.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đo lường đa kênh|||Chapter 5 — Omnichannel', description: 'Unified analytics, cross-channel, GA4.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Attribution & hành trình|||Chapter 6 — Attribution', description: 'Multi-touch, MMM, data-driven.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hiệu quả & tài chính|||Chapter 7 — Performance & finance', description: 'ROI/ROAS, CLV, share of voice, định giá.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Dashboard & quyết định|||Chapter 8 — Dashboards & decisions', description: 'KPI framework, first-party data, insight → hành động.', lessons: [c8, c8q] },
  ],
};
