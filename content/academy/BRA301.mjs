/**
 * BRA301 — Brand Management / Quản trị thương hiệu NÂNG CAO.
 * Ngành Công nghệ Truyền thông (FPTU), Kỳ 7. Môn KHÔNG có trong FLM →
 * khung dựng theo giáo trình chuẩn quốc tế: Keller "Strategic Brand
 * Management"; Aaker "Aaker on Branding"; Kapferer "The New Strategic
 * Brand Management". Đây là môn NÂNG CAO nối tiếp BRA201 (nhập môn) —
 * đi sâu CHIẾN LƯỢC: growth, portfolio, leverage, global, CX, valuation,
 * repositioning, leadership. KHUNG chất lượng: 8 chương outline song ngữ
 * VI+EN + quiz + Tài liệu. Giữ NGUYÊN slug/courseCode/semester/thumb.
 * ⚠️ KHÔNG backtick/${ trong HTML; "&" trong content HTML → "&amp;".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bra301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu nâng cao: Keller, Aaker "Aaker on Branding", Kapferer, HBR, bảng định giá Interbrand & BrandZ; lộ trình chiến lược 4 bước.',
  [[
    `<span class="eyebrow">BRA301 · Materials</span>
<h2>Advanced materials &amp; resource hub</h2>
<p class="lead">This is the <strong>advanced</strong> brand course — it assumes the fundamentals from BRA201 (brand equity, positioning, identity, IMC) and goes deep on <strong>strategy</strong>: growth, portfolio architecture, brand leverage, global branding, experience, valuation, repositioning and leadership. No FLM syllabus exists, so the course follows the <strong>standard international texts</strong> below.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/strategic-brand-management/P200000006027/" target="_blank" rel="noopener"><strong>Keller, K. L. — <em>Strategic Brand Management</em></strong> (Pearson)</a> — the strategic backbone: equity, architecture, leverage, measurement.</li>
<li><a href="https://www.davidaaker.com/aaker-on-branding" target="_blank" rel="noopener"><strong>Aaker, D. — <em>Aaker on Branding</em></strong></a> — 20 principles: brand vision, portfolio, relevance, brand as a business strategy.</li>
<li><a href="https://www.koganpage.com/product/the-new-strategic-brand-management-9780749465155" target="_blank" rel="noopener"><strong>Kapferer, J-N. — <em>The New Strategic Brand Management</em></strong> (Kogan Page)</a> — identity, architecture, global brands, luxury.</li>
</ul>
<h3>🌐 Free / official reading</h3>
<ul>
<li><a href="https://hbr.org/topic/subject/branding" target="_blank" rel="noopener">Harvard Business Review — Branding hub</a> — strategy cases (many free).</li>
<li><a href="https://interbrand.com/best-global-brands/" target="_blank" rel="noopener">Interbrand — Best Global Brands</a> — valuation method &amp; annual ranking.</li>
<li><a href="https://www.kantar.com/campaigns/brandz/global" target="_blank" rel="noopener">Kantar BrandZ — Most Valuable Global Brands</a> — a second, demand-based valuation lens.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma / FigJam</a> — portfolio maps, architecture diagrams, brand journey boards.</li>
<li><a href="https://www.marketingweek.com/" target="_blank" rel="noopener">Marketing Week</a> — live repositioning &amp; rebrand case commentary.</li>
</ul>
<div class="callout"><span class="badge">Strategy path (4 steps)</span>
<ol>
<li><strong>Strategy &amp; growth</strong> — brand as a growth driver, brand vision, growth vectors (Keller, Aaker).</li>
<li><strong>Structure</strong> — portfolio &amp; architecture, extension &amp; leverage, global standardisation vs adaptation.</li>
<li><strong>Value &amp; experience</strong> — brand experience &amp; D2C, brand valuation &amp; brand finance (Interbrand/BrandZ).</li>
<li><strong>Renew &amp; lead</strong> — innovation, repositioning &amp; revitalization, brand leadership, purpose/ESG &amp; AI governance.</li>
</ol></div>`,
    `<span class="eyebrow">BRA301 · Tài liệu</span>
<h2>Trung tâm tài liệu nâng cao</h2>
<p class="lead">Đây là môn thương hiệu <strong>nâng cao</strong> — giả định bạn đã có nền BRA201 (tài sản thương hiệu, định vị, nhận diện, IMC) và đi sâu vào <strong>chiến lược</strong>: tăng trưởng, kiến trúc danh mục, đòn bẩy thương hiệu, thương hiệu toàn cầu, trải nghiệm, định giá, tái định vị và lãnh đạo. Môn không có giáo trình FLM, nên khung bám các <strong>sách chuẩn quốc tế</strong> dưới đây.</p>
<h3>📘 Sách chính</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/strategic-brand-management/P200000006027/" target="_blank" rel="noopener"><strong>Keller, K. L. — <em>Strategic Brand Management</em></strong> (Pearson)</a> — xương sống chiến lược: tài sản, kiến trúc, đòn bẩy, đo lường.</li>
<li><a href="https://www.davidaaker.com/aaker-on-branding" target="_blank" rel="noopener"><strong>Aaker, D. — <em>Aaker on Branding</em></strong></a> — 20 nguyên tắc: tầm nhìn, danh mục, độ liên quan, thương hiệu như chiến lược kinh doanh.</li>
<li><a href="https://www.koganpage.com/product/the-new-strategic-brand-management-9780749465155" target="_blank" rel="noopener"><strong>Kapferer, J-N. — <em>The New Strategic Brand Management</em></strong> (Kogan Page)</a> — bản sắc, kiến trúc, thương hiệu toàn cầu, hàng xa xỉ.</li>
</ul>
<h3>🌐 Đọc miễn phí / chính thức</h3>
<ul>
<li><a href="https://hbr.org/topic/subject/branding" target="_blank" rel="noopener">Harvard Business Review — chuyên mục Branding</a> — case chiến lược (nhiều bài miễn phí).</li>
<li><a href="https://interbrand.com/best-global-brands/" target="_blank" rel="noopener">Interbrand — Best Global Brands</a> — phương pháp định giá &amp; bảng xếp hạng năm.</li>
<li><a href="https://www.kantar.com/campaigns/brandz/global" target="_blank" rel="noopener">Kantar BrandZ — Most Valuable Global Brands</a> — lăng kính định giá thứ hai, dựa trên cầu.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma / FigJam</a> — sơ đồ danh mục, kiến trúc, bảng hành trình thương hiệu.</li>
<li><a href="https://www.marketingweek.com/" target="_blank" rel="noopener">Marketing Week</a> — bình luận ca tái định vị &amp; rebrand đang diễn ra.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình chiến lược (4 bước)</span>
<ol>
<li><strong>Chiến lược &amp; tăng trưởng</strong> — thương hiệu như động lực tăng trưởng, tầm nhìn, vector tăng trưởng (Keller, Aaker).</li>
<li><strong>Cấu trúc</strong> — danh mục &amp; kiến trúc, mở rộng &amp; đòn bẩy, chuẩn hoá vs địa phương hoá toàn cầu.</li>
<li><strong>Giá trị &amp; trải nghiệm</strong> — trải nghiệm thương hiệu &amp; D2C, định giá &amp; tài chính thương hiệu (Interbrand/BrandZ).</li>
<li><strong>Làm mới &amp; dẫn dắt</strong> — đổi mới, tái định vị &amp; hồi sinh, lãnh đạo thương hiệu, purpose/ESG &amp; quản trị AI.</li>
</ol></div>`,
  ]]);

const intro = doc('bra301-0-1-overview', 'Course overview: brand as strategy|||Tổng quan: thương hiệu như chiến lược',
  'Vì sao thương hiệu là quyết định cấp hội đồng; khác biệt so với BRA201; chuẩn đầu ra nâng cao; cơ cấu điểm; lộ trình 8 chương chiến lược.',
  [[
    `<span class="eyebrow">BRA301 · Lesson 0.1 · Overview</span>
<h2>Brand as a strategic asset</h2>
<p class="lead">At advanced level the question shifts from "what is a brand?" to <strong>"how does the brand create and protect business value over time?"</strong> A brand is a <em>board-level</em> asset: it steers growth, M&amp;A, pricing power and risk. This course treats brand management as <strong>strategy</strong>, not just communication.</p>
<h3>How this differs from BRA201</h3>
<ul>
<li>BRA201 = <strong>foundations</strong> (equity, positioning, identity, IMC, basic extension &amp; measurement).</li>
<li>BRA301 = <strong>strategy</strong> — growth, portfolio &amp; architecture at scale, leverage &amp; risk, global, experience, valuation &amp; finance, repositioning, leadership.</li>
</ul>
<h3>Learning outcomes</h3>
<ul>
<li>Use the brand to drive <strong>growth</strong> and structure a multi-brand <strong>portfolio &amp; architecture</strong>.</li>
<li>Leverage a brand safely (extension, co-branding, licensing) and manage <strong>dilution risk</strong>.</li>
<li>Run <strong>global</strong> brand strategy, design <strong>brand experience</strong>, and read a <strong>brand valuation</strong>.</li>
<li>Lead <strong>repositioning / revitalization</strong> and set up brand <strong>governance</strong> (purpose, ESG, AI).</li>
</ul>
<h3>Suggested grade structure</h3>
<pre><code>Participation / quizzes ........ 10%
Portfolio &amp; architecture case .. 25%
Brand strategy project ......... 35%
Final exam ..................... 30%</code></pre>
<div class="callout"><span class="badge">Roadmap</span> Ch1 strategy &amp; growth → Ch2 portfolio &amp; architecture → Ch3 extension &amp; leverage → Ch4 global → Ch5 experience &amp; D2C → Ch6 valuation &amp; finance → Ch7 innovation &amp; repositioning → Ch8 leadership &amp; the future.</div>`,
    `<span class="eyebrow">BRA301 · Bài 0.1 · Tổng quan</span>
<h2>Thương hiệu như một tài sản chiến lược</h2>
<p class="lead">Ở mức nâng cao, câu hỏi chuyển từ "thương hiệu là gì?" sang <strong>"thương hiệu tạo và bảo vệ giá trị doanh nghiệp theo thời gian ra sao?"</strong> Thương hiệu là tài sản <em>cấp hội đồng</em>: nó dẫn dắt tăng trưởng, M&amp;A, sức mạnh định giá và rủi ro. Môn này coi quản trị thương hiệu là <strong>chiến lược</strong>, không chỉ là truyền thông.</p>
<h3>Khác BRA201 thế nào</h3>
<ul>
<li>BRA201 = <strong>nền tảng</strong> (tài sản, định vị, nhận diện, IMC, mở rộng &amp; đo lường cơ bản).</li>
<li>BRA301 = <strong>chiến lược</strong> — tăng trưởng, danh mục &amp; kiến trúc ở quy mô lớn, đòn bẩy &amp; rủi ro, toàn cầu, trải nghiệm, định giá &amp; tài chính, tái định vị, lãnh đạo.</li>
</ul>
<h3>Chuẩn đầu ra</h3>
<ul>
<li>Dùng thương hiệu để dẫn dắt <strong>tăng trưởng</strong> và cấu trúc một <strong>danh mục &amp; kiến trúc</strong> đa thương hiệu.</li>
<li>Tạo đòn bẩy thương hiệu an toàn (mở rộng, co-branding, licensing) và quản trị <strong>rủi ro pha loãng</strong>.</li>
<li>Chạy chiến lược thương hiệu <strong>toàn cầu</strong>, thiết kế <strong>trải nghiệm thương hiệu</strong>, và đọc một bản <strong>định giá thương hiệu</strong>.</li>
<li>Dẫn dắt <strong>tái định vị / hồi sinh</strong> và thiết lập <strong>quản trị</strong> thương hiệu (purpose, ESG, AI).</li>
</ul>
<h3>Cơ cấu điểm gợi ý</h3>
<pre><code>Chuyên cần / quiz .............. 10%
Case danh mục &amp; kiến trúc ...... 25%
Dự án chiến lược thương hiệu ... 35%
Thi cuối kỳ ................... 30%</code></pre>
<div class="callout"><span class="badge">Lộ trình</span> Ch1 chiến lược &amp; tăng trưởng → Ch2 danh mục &amp; kiến trúc → Ch3 mở rộng &amp; đòn bẩy → Ch4 toàn cầu → Ch5 trải nghiệm &amp; D2C → Ch6 định giá &amp; tài chính → Ch7 đổi mới &amp; tái định vị → Ch8 lãnh đạo &amp; tương lai.</div>`,
  ]]);

const c1 = doc('bra301-1-1-brand-strategy-growth', '1.1 — Brand strategy & growth|||1.1 — Chiến lược thương hiệu & tăng trưởng',
  'Brand vision, brand như động lực tăng trưởng; brand relevance vs preference; growth vectors (Ansoff qua lăng kính thương hiệu); brand-led growth.',
  [[
    `<span class="eyebrow">BRA301 · Chapter 1 · Lesson 1.1</span>
<h2>Brand strategy &amp; growth</h2>
<h3>Brand vision drives the business</h3>
<p>Aaker argues the brand should express a <strong>brand vision</strong> — the aspirational image the firm wants, tied to strategy. Strong brands don't just describe the product; they <em>guide</em> what the business builds next. Brand becomes the engine of growth, not a coat of paint applied at the end.</p>
<h3>Relevance beats preference</h3>
<p>Aaker's <strong>brand relevance</strong> idea: instead of winning a "my brand vs your brand" preference fight, create or own a <em>new category / subcategory</em> so competitors become irrelevant. Being the brand that <strong>defines</strong> the category (and its "must-haves") is a stronger moat than being slightly preferred within it.</p>
<h3>Growth vectors through a brand lens</h3>
<pre><code>            Existing products      New products
Existing    Deepen loyalty /       Brand extension
markets     usage occasions        (leverage equity)
New         Geographic / segment   New brand or
markets     expansion              endorsed sub-brand</code></pre>
<div class="callout"><span class="badge">Real example</span> <strong>Tesla</strong> grew by defining the "premium EV" subcategory and owning its must-haves (range, software, Supercharger) — relevance, not incremental preference against petrol cars.</div>`,
    `<span class="eyebrow">BRA301 · Chương 1 · Bài 1.1</span>
<h2>Chiến lược thương hiệu &amp; tăng trưởng</h2>
<h3>Tầm nhìn thương hiệu dẫn dắt kinh doanh</h3>
<p>Aaker cho rằng thương hiệu nên thể hiện một <strong>brand vision</strong> — hình ảnh khát vọng mà doanh nghiệp muốn, gắn với chiến lược. Thương hiệu mạnh không chỉ mô tả sản phẩm; nó <em>định hướng</em> việc doanh nghiệp sẽ xây gì tiếp theo. Thương hiệu thành động cơ tăng trưởng, không phải lớp sơn phủ ở cuối.</p>
<h3>Độ liên quan thắng sự ưa thích</h3>
<p>Ý tưởng <strong>brand relevance</strong> của Aaker: thay vì thắng cuộc so kè "thương hiệu tôi vs thương hiệu bạn", hãy tạo hoặc sở hữu một <em>nhóm ngành / phân nhóm mới</em> để đối thủ trở nên vô can. Là thương hiệu <strong>định nghĩa</strong> nhóm ngành (và các "phải có" của nó) là con hào mạnh hơn việc chỉ được ưa thích hơn chút ít trong nhóm.</p>
<h3>Vector tăng trưởng qua lăng kính thương hiệu</h3>
<pre><code>              Sản phẩm cũ           Sản phẩm mới
Thị trường    Tăng trung thành /    Mở rộng thương hiệu
cũ            dịp dùng              (dùng đòn bẩy tài sản)
Thị trường    Mở rộng địa lý /      Thương hiệu mới hoặc
mới           phân khúc             sub-brand có bảo chứng</code></pre>
<div class="callout"><span class="badge">Ví dụ thực</span> <strong>Tesla</strong> tăng trưởng bằng cách định nghĩa phân nhóm "xe điện cao cấp" và sở hữu các phải-có (quãng đường, phần mềm, Supercharger) — độ liên quan, không phải nhích ưa thích so với xe xăng.</div>`,
  ]]);

const c1q = quiz('bra301-quiz-1', 'Quiz 1 — Strategy & growth|||Quiz 1 — Chiến lược & tăng trưởng', [
  { id: 'q1', question: 'Theo Aaker, "brand relevance" (độ liên quan) khuyên doanh nghiệp?', options: ['Thắng cuộc đua ưa thích trong cùng nhóm ngành', 'Tạo/sở hữu nhóm ngành hoặc phân nhóm mới để đối thủ trở nên vô can', 'Giảm giá thấp hơn đối thủ', 'Sao chép thương hiệu dẫn đầu'], correctIndex: 1, explanation: 'Relevance: định nghĩa nhóm ngành/phân nhóm mới mạnh hơn là chỉ được ưa thích hơn chút ít.' },
  { id: 'q2', question: '"Brand vision" khác gì với một câu mô tả sản phẩm?', options: ['Không khác gì', 'Là hình ảnh khát vọng gắn chiến lược, định hướng doanh nghiệp xây gì tiếp theo', 'Chỉ là logo mới', 'Chỉ là khẩu hiệu quảng cáo'], correctIndex: 1, explanation: 'Brand vision là hình ảnh khát vọng dẫn dắt chiến lược, không chỉ mô tả sản phẩm hiện có.' },
  { id: 'q3', question: 'Dùng thương hiệu sẵn có cho sản phẩm MỚI ở thị trường CŨ là vector tăng trưởng nào?', options: ['Mở rộng địa lý', 'Brand extension (dùng đòn bẩy tài sản thương hiệu)', 'Tăng dịp dùng', 'Tạo thương hiệu hoàn toàn mới'], correctIndex: 1, explanation: 'Sản phẩm mới + thị trường cũ, dùng lại thương hiệu = brand extension (đòn bẩy equity).' },
]);

const c2 = doc('bra301-2-1-portfolio-architecture', '2.1 — Brand portfolio & architecture (nâng cao)|||2.1 — Danh mục & kiến trúc thương hiệu (nâng cao)',
  'Brand portfolio strategy; Aaker brand relationship spectrum (branded house → sub-brands → endorsed → house of brands); roles (driver, endorser, flanker); brand migration.',
  [[
    `<span class="eyebrow">BRA301 · Chapter 2 · Lesson 2.1</span>
<h2>Brand portfolio &amp; architecture</h2>
<h3>The brand relationship spectrum (Aaker)</h3>
<p>Architecture is a spectrum, not two boxes. Aaker lays it out from tightly to loosely linked:</p>
<pre><code>Branded house  -> Sub-brands -> Endorsed brands -> House of brands
(one master)      (Playada)     (Courtyard by     (P&amp;G: Tide,
 Google Maps                     Marriott)          Ariel, Gillette)</code></pre>
<h3>Brand roles inside a portfolio</h3>
<ul>
<li><strong>Driver</strong> — the brand that actually drives the purchase decision (whose promise the buyer trusts).</li>
<li><strong>Endorser</strong> — a parent lending credibility (Marriott endorsing Courtyard).</li>
<li><strong>Sub-brand</strong> — extends/stretches a master into a new space (Sony PlayStation).</li>
<li><strong>Flanker / fighter</strong> — a lower-tier brand that protects the flagship from cheap rivals.</li>
</ul>
<h3>Brand migration</h3>
<p>Portfolios evolve: after M&amp;A firms often <strong>migrate</strong> an acquired brand toward the master (co-brand → endorse → absorb) to consolidate equity — done too fast, you destroy the equity you paid for.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Marriott</strong> runs a layered portfolio (Ritz-Carlton, Marriott, Courtyard by Marriott, Moxy) with clear roles; after buying Starwood it migrated brands into one loyalty system without collapsing them into one name.</div>`,
    `<span class="eyebrow">BRA301 · Chương 2 · Bài 2.1</span>
<h2>Danh mục &amp; kiến trúc thương hiệu</h2>
<h3>Phổ quan hệ thương hiệu (Aaker)</h3>
<p>Kiến trúc là một phổ liên tục, không phải hai ô. Aaker trải nó từ gắn chặt tới lỏng:</p>
<pre><code>Branded house  -> Sub-brand -> Endorsed brand -> House of brands
(một mẹ)          (PlayStation) (Courtyard by    (P&amp;G: Tide,
 Google Maps                     Marriott)         Ariel, Gillette)</code></pre>
<h3>Vai trò thương hiệu trong danh mục</h3>
<ul>
<li><strong>Driver</strong> — thương hiệu thực sự dẫn dắt quyết định mua (người mua tin vào lời hứa của nó).</li>
<li><strong>Endorser (bảo chứng)</strong> — thương hiệu mẹ cho mượn uy tín (Marriott bảo chứng Courtyard).</li>
<li><strong>Sub-brand</strong> — kéo/giãn thương hiệu mẹ sang không gian mới (Sony PlayStation).</li>
<li><strong>Flanker / fighter</strong> — thương hiệu bậc thấp bảo vệ hàng chủ lực khỏi đối thủ giá rẻ.</li>
</ul>
<h3>Di trú thương hiệu (brand migration)</h3>
<p>Danh mục tiến hoá: sau M&amp;A doanh nghiệp thường <strong>di trú</strong> thương hiệu mua về hướng thương hiệu mẹ (co-brand → bảo chứng → hấp thụ) để gom tài sản — làm quá nhanh sẽ phá đúng phần equity mình vừa bỏ tiền mua.</p>
<div class="callout"><span class="badge">Ví dụ thực</span> <strong>Marriott</strong> vận hành danh mục nhiều tầng (Ritz-Carlton, Marriott, Courtyard by Marriott, Moxy) với vai trò rõ; sau khi mua Starwood đã di trú các thương hiệu về một hệ loyalty mà không gộp tất cả thành một tên.</div>`,
  ]]);

const c2q = quiz('bra301-quiz-2', 'Quiz 2 — Portfolio & architecture|||Quiz 2 — Danh mục & kiến trúc', [
  { id: 'q1', question: 'Trong "brand relationship spectrum" của Aaker, "Courtyard by Marriott" là kiểu?', options: ['Branded house', 'Endorsed brand (thương hiệu được bảo chứng)', 'House of brands', 'Fighter brand'], correctIndex: 1, explanation: '"X by Y" là endorsed brand — mẹ Marriott cho mượn uy tín cho Courtyard.' },
  { id: 'q2', question: 'Vai trò "driver" của một thương hiệu trong danh mục nghĩa là?', options: ['Thương hiệu bảo vệ hàng chủ lực khỏi đối thủ rẻ', 'Thương hiệu thực sự dẫn dắt quyết định mua', 'Thương hiệu mẹ cho mượn uy tín', 'Thương hiệu sắp bị khai tử'], correctIndex: 1, explanation: 'Driver là thương hiệu mà người mua tin lời hứa và ra quyết định mua vì nó.' },
  { id: 'q3', question: 'Rủi ro lớn khi "brand migration" sau M&A diễn ra quá nhanh?', options: ['Tăng nhận biết quá mức', 'Phá huỷ chính phần tài sản thương hiệu vừa bỏ tiền mua về', 'Giảm chi phí loyalty', 'Tự động tạo sub-brand'], correctIndex: 1, explanation: 'Gộp/hấp thụ quá nhanh làm mất equity của thương hiệu mua lại — đúng thứ vừa trả tiền.' },
]);

const c3 = doc('bra301-3-1-extension-leverage', '3.1 — Brand extension & leverage|||3.1 — Mở rộng & đòn bẩy thương hiệu',
  'Fit & leverage; co-branding & ingredient branding; licensing; risk of dilution & feedback effects; fighter brands; khi nào KHÔNG mở rộng.',
  [[
    `<span class="eyebrow">BRA301 · Chapter 3 · Lesson 3.1</span>
<h2>Brand extension &amp; leverage</h2>
<h3>Fit, leverage and the feedback effect</h3>
<p>An extension works when there is <strong>fit</strong> — a logical link (category, image or benefit) between the parent and the new product. Leverage is the parent's equity transferring <em>into</em> the extension; the <strong>feedback effect</strong> is the extension's experience flowing <em>back</em> onto the parent — for better or worse.</p>
<h3>Leverage without owning the product</h3>
<ul>
<li><strong>Co-branding</strong> — two brands on one offer (Nike + Apple Watch Nike edition); each must gain, neither should be diluted.</li>
<li><strong>Ingredient branding</strong> — a branded component inside a host (Intel Inside, Gore-Tex) creating pull.</li>
<li><strong>Licensing</strong> — renting the brand to a third party (Ferrari apparel) — pure margin, but weak control = dilution risk.</li>
</ul>
<h3>When NOT to extend</h3>
<p>If the extension contradicts the brand's core meaning, it dilutes it. A <strong>fighter brand</strong> (a separate cheaper name) is often safer than dragging a premium brand downmarket.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Gore-Tex</strong> ingredient-brands into many jackets — but <em>Zippo perfume</em> and <em>Colgate frozen dinners</em> are classic dilution failures: no fit, negative feedback onto the parent.</div>`,
    `<span class="eyebrow">BRA301 · Chương 3 · Bài 3.1</span>
<h2>Mở rộng &amp; đòn bẩy thương hiệu</h2>
<h3>Độ khớp, đòn bẩy và hiệu ứng phản hồi</h3>
<p>Mở rộng thành công khi có <strong>fit (độ khớp)</strong> — mối liên hệ hợp lý (nhóm ngành, hình ảnh hoặc lợi ích) giữa mẹ và sản phẩm mới. Đòn bẩy là equity của mẹ chảy <em>vào</em> phần mở rộng; <strong>hiệu ứng phản hồi (feedback)</strong> là trải nghiệm phần mở rộng chảy <em>ngược</em> về mẹ — tốt hoặc xấu.</p>
<h3>Tạo đòn bẩy mà không sở hữu sản phẩm</h3>
<ul>
<li><strong>Co-branding</strong> — hai thương hiệu trên một sản phẩm (Nike + Apple Watch bản Nike); mỗi bên phải được lợi, không bên nào bị pha loãng.</li>
<li><strong>Ingredient branding</strong> — một thành phần có thương hiệu bên trong sản phẩm chủ (Intel Inside, Gore-Tex) tạo lực kéo.</li>
<li><strong>Licensing (cấp phép)</strong> — cho bên thứ ba thuê thương hiệu (thời trang Ferrari) — biên lợi nhuận thuần, nhưng ít kiểm soát = rủi ro pha loãng.</li>
</ul>
<h3>Khi nào KHÔNG nên mở rộng</h3>
<p>Nếu mở rộng mâu thuẫn với ý nghĩa cốt lõi, nó pha loãng thương hiệu. Một <strong>fighter brand</strong> (tên riêng, rẻ hơn) thường an toàn hơn là kéo thương hiệu cao cấp xuống phân khúc thấp.</p>
<div class="callout"><span class="badge">Ví dụ thực</span> <strong>Gore-Tex</strong> làm ingredient brand trong nhiều áo khoác — nhưng <em>nước hoa Zippo</em> và <em>bữa đông lạnh Colgate</em> là thất bại pha loãng kinh điển: không khớp, phản hồi tiêu cực về mẹ.</div>`,
  ]]);

const c3q = quiz('bra301-quiz-3', 'Quiz 3 — Extension & leverage|||Quiz 3 — Mở rộng & đòn bẩy', [
  { id: 'q1', question: '"Feedback effect" của một brand extension là?', options: ['Doanh số của phần mở rộng', 'Trải nghiệm phần mở rộng chảy NGƯỢC về thương hiệu mẹ, tốt hoặc xấu', 'Chi phí quảng cáo', 'Số lượng SKU mới'], correctIndex: 1, explanation: 'Feedback: trải nghiệm với extension ảnh hưởng ngược lại lên thương hiệu mẹ.' },
  { id: 'q2', question: 'Intel Inside, Gore-Tex là ví dụ của?', options: ['Licensing', 'Ingredient branding (thành phần có thương hiệu trong sản phẩm chủ)', 'Fighter brand', 'Rebranding'], correctIndex: 1, explanation: 'Thành phần có thương hiệu bên trong sản phẩm chủ tạo lực kéo = ingredient branding.' },
  { id: 'q3', question: 'Vì sao "licensing" thương hiệu có rủi ro pha loãng cao?', options: ['Vì biên lợi nhuận thấp', 'Vì ít kiểm soát chất lượng/hình ảnh do bên thứ ba sản xuất', 'Vì luôn cần sản phẩm mới', 'Vì phải đổi logo'], correctIndex: 1, explanation: 'Cho thuê thương hiệu = mất kiểm soát trực tiếp → nếu bên thứ ba làm dở, thương hiệu bị pha loãng.' },
]);

const c4 = doc('bra301-4-1-global-branding', '4.1 — Global branding|||4.1 — Thương hiệu toàn cầu',
  'Standardisation vs adaptation (glocal); global brand vs multi-local; brand consistency across cultures; brand equity xuyên biên giới; entry & naming.',
  [[
    `<span class="eyebrow">BRA301 · Chapter 4 · Lesson 4.1</span>
<h2>Global branding</h2>
<h3>Standardise vs adapt — the "glocal" tension</h3>
<p>The core strategic choice: run <strong>one standardised</strong> brand worldwide (scale, consistency, efficiency) or <strong>adapt</strong> to each market (relevance, local taste, regulation). Most strong brands are <strong>"glocal"</strong> — a consistent core idea, locally adapted expression.</p>
<pre><code>Keep global:  positioning, values, visual system, quality promise
Adapt local:  product variants, price, media, language, campaigns</code></pre>
<h3>Brand across cultures</h3>
<p>Meaning is not universal: colours, names and symbols carry different associations across cultures, and Hofstede-style dimensions (individualism, uncertainty avoidance) shift what resonates. Names must be checked for <strong>linguistic pitfalls</strong> before entry.</p>
<h3>Global vs multi-local architecture</h3>
<ul>
<li><strong>Global brand</strong> — one name, one promise (Apple, Coca-Cola).</li>
<li><strong>Multi-local</strong> — different brands per market, often via acquisition (Unilever's local food brands).</li>
</ul>
<div class="callout"><span class="badge">Real example</span> <strong>McDonald's</strong> keeps the brand system global but adapts the menu — McSpicy Paneer in India, McRice in Asia — a textbook glocal play. Its consistent Golden Arches promise travels; the product flexes.</div>`,
    `<span class="eyebrow">BRA301 · Chương 4 · Bài 4.1</span>
<h2>Thương hiệu toàn cầu</h2>
<h3>Chuẩn hoá vs địa phương hoá — căng thẳng "glocal"</h3>
<p>Lựa chọn chiến lược cốt lõi: chạy <strong>một thương hiệu chuẩn hoá</strong> toàn cầu (quy mô, nhất quán, hiệu quả) hay <strong>địa phương hoá</strong> theo từng thị trường (độ liên quan, khẩu vị bản địa, quy định). Đa số thương hiệu mạnh theo hướng <strong>"glocal"</strong> — ý tưởng lõi nhất quán, biểu đạt điều chỉnh theo địa phương.</p>
<pre><code>Giữ toàn cầu:  định vị, giá trị, hệ nhận diện, lời hứa chất lượng
Điều chỉnh:    biến thể sản phẩm, giá, kênh media, ngôn ngữ, chiến dịch</code></pre>
<h3>Thương hiệu xuyên văn hoá</h3>
<p>Ý nghĩa không phổ quát: màu sắc, tên gọi và biểu tượng mang liên tưởng khác nhau giữa các nền văn hoá, và các chiều kiểu Hofstede (chủ nghĩa cá nhân, né tránh bất định) làm đổi thứ gây cộng hưởng. Tên phải được kiểm <strong>bẫy ngôn ngữ</strong> trước khi thâm nhập.</p>
<h3>Kiến trúc toàn cầu vs đa-bản-địa</h3>
<ul>
<li><strong>Global brand</strong> — một tên, một lời hứa (Apple, Coca-Cola).</li>
<li><strong>Multi-local</strong> — thương hiệu khác nhau theo thị trường, thường qua mua lại (các thương hiệu thực phẩm bản địa của Unilever).</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thực</span> <strong>McDonald's</strong> giữ hệ thống thương hiệu toàn cầu nhưng điều chỉnh thực đơn — McSpicy Paneer ở Ấn Độ, McRice ở châu Á — một nước cờ glocal mẫu mực. Lời hứa Golng Arches nhất quán đi khắp nơi; sản phẩm thì uốn theo.</div>`,
  ]]);

const c4q = quiz('bra301-quiz-4', 'Quiz 4 — Global branding|||Quiz 4 — Thương hiệu toàn cầu', [
  { id: 'q1', question: 'Chiến lược "glocal" nghĩa là?', options: ['Chuẩn hoá 100% mọi thứ toàn cầu', 'Ý tưởng lõi nhất quán toàn cầu, biểu đạt/sản phẩm điều chỉnh theo địa phương', 'Mỗi nước một thương hiệu riêng biệt hoàn toàn', 'Chỉ bán ở một quốc gia'], correctIndex: 1, explanation: 'Glocal = giữ lõi (định vị/giá trị/nhận diện) toàn cầu, uốn biểu đạt và sản phẩm theo địa phương.' },
  { id: 'q2', question: 'Yếu tố nào thường được GIỮ nhất quán toàn cầu, KHÔNG địa phương hoá?', options: ['Định vị & lời hứa chất lượng cốt lõi', 'Giá bán lẻ', 'Ngôn ngữ chiến dịch', 'Biến thể sản phẩm'], correctIndex: 0, explanation: 'Định vị, giá trị, hệ nhận diện, lời hứa chất lượng giữ toàn cầu; giá/ngôn ngữ/sản phẩm uốn theo địa phương.' },
  { id: 'q3', question: 'Vì sao phải kiểm TÊN thương hiệu trước khi vào thị trường mới?', options: ['Vì logo cần đổi màu', 'Vì tên/màu/biểu tượng mang liên tưởng khác nhau giữa các văn hoá, có thể gây phản cảm', 'Vì luôn cần đổi tên', 'Vì giá sẽ tăng'], correctIndex: 1, explanation: 'Ý nghĩa không phổ quát — tên có thể mang nghĩa xấu/khó phát âm ở văn hoá khác (bẫy ngôn ngữ).' },
]);

const c5 = doc('bra301-5-1-brand-experience', '5.1 — Brand & customer experience|||5.1 — Thương hiệu & trải nghiệm khách hàng',
  'Brand experience (Brakus: sensory/affective/behavioral/intellectual); brand journey & signature moments; service & employee (living the brand); D2C & data.',
  [[
    `<span class="eyebrow">BRA301 · Chapter 5 · Lesson 5.1</span>
<h2>Brand &amp; customer experience</h2>
<h3>What "brand experience" means</h3>
<p>Brakus et al. define <strong>brand experience</strong> as the responses a brand triggers across four dimensions:</p>
<ul>
<li><strong>Sensory</strong> — sight, sound, smell, touch (Apple Store materials; a signature scent).</li>
<li><strong>Affective</strong> — feelings and moods evoked.</li>
<li><strong>Behavioural</strong> — actions and bodily experiences (test-riding, trying).</li>
<li><strong>Intellectual</strong> — curiosity, thinking, problem-solving.</li>
</ul>
<h3>The journey and its signature moments</h3>
<p>Advanced CX designs the whole <strong>journey</strong> and picks a few <strong>signature moments</strong> that carry the brand disproportionately (unboxing, onboarding, a recovery when something goes wrong). Consistency matters, but a memorable <em>peak</em> defines recall.</p>
<h3>Employees &amp; D2C</h3>
<p>In services the brand is <em>delivered by people</em> — "living the brand" (internal branding) turns staff into the promise. <strong>Direct-to-consumer (D2C)</strong> gives brands the whole relationship and <strong>first-party data</strong> to personalise, instead of hiding behind retailers.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Starbucks</strong> engineers a multi-sensory "third place" and trains baristas to deliver it; the app + rewards turn it D2C, feeding data back into personalised offers.</div>`,
    `<span class="eyebrow">BRA301 · Chương 5 · Bài 5.1</span>
<h2>Thương hiệu &amp; trải nghiệm khách hàng</h2>
<h3>"Brand experience" nghĩa là gì</h3>
<p>Brakus và cộng sự định nghĩa <strong>trải nghiệm thương hiệu</strong> là các phản ứng thương hiệu khơi ra trên bốn chiều:</p>
<ul>
<li><strong>Giác quan (sensory)</strong> — nhìn, nghe, ngửi, chạm (chất liệu Apple Store; một mùi hương đặc trưng).</li>
<li><strong>Cảm xúc (affective)</strong> — cảm giác và tâm trạng được gợi lên.</li>
<li><strong>Hành vi (behavioural)</strong> — hành động và trải nghiệm cơ thể (lái thử, dùng thử).</li>
<li><strong>Trí tuệ (intellectual)</strong> — tò mò, suy nghĩ, giải quyết vấn đề.</li>
</ul>
<h3>Hành trình và khoảnh khắc chữ ký</h3>
<p>CX nâng cao thiết kế toàn bộ <strong>hành trình</strong> và chọn vài <strong>signature moment (khoảnh khắc chữ ký)</strong> mang thương hiệu vượt trội (mở hộp, onboarding, cách xử lý khi có sự cố). Nhất quán quan trọng, nhưng một <em>đỉnh</em> đáng nhớ định hình sự nhớ lại.</p>
<h3>Nhân viên &amp; D2C</h3>
<p>Trong dịch vụ, thương hiệu <em>được con người phân phối</em> — "living the brand" (internal branding) biến nhân viên thành lời hứa. <strong>Direct-to-consumer (D2C)</strong> cho thương hiệu toàn bộ mối quan hệ và <strong>dữ liệu bên thứ nhất</strong> để cá nhân hoá, thay vì nấp sau nhà bán lẻ.</p>
<div class="callout"><span class="badge">Ví dụ thực</span> <strong>Starbucks</strong> dàn dựng một "third place" đa giác quan và huấn luyện barista phân phối nó; app + rewards biến nó thành D2C, đưa dữ liệu quay lại để cá nhân hoá ưu đãi.</div>`,
  ]]);

const c5q = quiz('bra301-quiz-5', 'Quiz 5 — Brand experience|||Quiz 5 — Trải nghiệm thương hiệu', [
  { id: 'q1', question: 'Bốn chiều của "brand experience" (Brakus) là?', options: ['Giá, chỗ, khuyến mãi, sản phẩm', 'Sensory, affective, behavioural, intellectual', 'Nhận biết, cân nhắc, mua, trung thành', 'Logo, tên, màu, slogan'], correctIndex: 1, explanation: 'Brakus: giác quan, cảm xúc, hành vi, trí tuệ.' },
  { id: 'q2', question: '"Living the brand" / internal branding nhấn mạnh điều gì?', options: ['Chỉ quảng cáo bên ngoài', 'Nhân viên chính là người phân phối lời hứa thương hiệu, nhất là trong dịch vụ', 'Giảm số nhân viên', 'Chỉ dùng chatbot'], correctIndex: 1, explanation: 'Trong dịch vụ, con người truyền tải thương hiệu — nhân viên phải "sống" lời hứa đó.' },
  { id: 'q3', question: 'Lợi thế lớn của mô hình D2C với việc quản trị thương hiệu?', options: ['Không cần thương hiệu nữa', 'Sở hữu toàn bộ quan hệ & dữ liệu bên thứ nhất để cá nhân hoá', 'Bắt buộc bán qua nhà bán lẻ', 'Giảm chất lượng sản phẩm'], correctIndex: 1, explanation: 'D2C cho thương hiệu quan hệ trực tiếp + first-party data để cá nhân hoá trải nghiệm.' },
]);

const c6 = doc('bra301-6-1-brand-valuation', '6.1 — Brand valuation & brand finance|||6.1 — Định giá & tài chính thương hiệu',
  'Vì sao định giá; ba cách tiếp cận (cost/market/income); phương pháp Interbrand (financial × role of brand × brand strength) & BrandZ; brand ROI & premium; intangible trên bảng cân đối.',
  [[
    `<span class="eyebrow">BRA301 · Chapter 6 · Lesson 6.1</span>
<h2>Brand valuation &amp; brand finance</h2>
<h3>Why value a brand?</h3>
<p>A brand is an <strong>intangible asset</strong>. Putting a money figure on it is needed for M&amp;A, licensing royalties, litigation, and to justify marketing spend to the CFO — turning brand from "cost" into "investment".</p>
<h3>Three approaches</h3>
<ul>
<li><strong>Cost</strong> — what it cost (or would cost) to build the brand. Simple, but ignores future earnings.</li>
<li><strong>Market</strong> — what comparable brands sold for. Hard: few clean comparables.</li>
<li><strong>Income</strong> — the present value of future earnings the brand drives. The dominant, forward-looking method.</li>
</ul>
<h3>Interbrand vs BrandZ</h3>
<pre><code>Interbrand = Financial performance
           x Role of brand (how much choice it drives)
           x Brand strength (loyalty, protection -> discount rate)

BrandZ (Kantar) = brand contribution derived from consumer
                  demand research + financials</code></pre>
<p>Both convert equity into a defensible number; they differ in weighting <em>financial modelling</em> vs <em>consumer demand data</em>. Strong brands earn a <strong>price premium</strong> and higher loyalty — the financial face of equity.</p>
<div class="callout"><span class="badge">Real example</span> Interbrand routinely values <strong>Apple</strong> and <strong>Amazon</strong> in the hundreds of billions; a brand can be worth more than a company's tangible assets, and shows up as goodwill after an acquisition.</div>`,
    `<span class="eyebrow">BRA301 · Chương 6 · Bài 6.1</span>
<h2>Định giá &amp; tài chính thương hiệu</h2>
<h3>Vì sao định giá thương hiệu?</h3>
<p>Thương hiệu là <strong>tài sản vô hình</strong>. Quy nó ra con số tiền là cần cho M&amp;A, phí bản quyền cấp phép, kiện tụng, và để biện minh chi phí marketing trước CFO — biến thương hiệu từ "chi phí" thành "đầu tư".</p>
<h3>Ba cách tiếp cận</h3>
<ul>
<li><strong>Chi phí (cost)</strong> — chi phí đã (hoặc sẽ) bỏ ra để dựng thương hiệu. Đơn giản, nhưng bỏ qua lợi nhuận tương lai.</li>
<li><strong>Thị trường (market)</strong> — giá các thương hiệu tương đương đã bán. Khó: hiếm mẫu so sánh sạch.</li>
<li><strong>Thu nhập (income)</strong> — giá trị hiện tại của lợi nhuận tương lai do thương hiệu tạo ra. Phương pháp chủ đạo, hướng tương lai.</li>
</ul>
<h3>Interbrand vs BrandZ</h3>
<pre><code>Interbrand = Hiệu quả tài chính
           x Vai trò thương hiệu (dẫn dắt quyết định chọn bao nhiêu)
           x Sức mạnh thương hiệu (trung thành, bảo hộ -> lãi suất chiết khấu)

BrandZ (Kantar) = đóng góp thương hiệu suy từ nghiên cứu
                  cầu của người tiêu dùng + số liệu tài chính</code></pre>
<p>Cả hai đều biến equity thành con số bảo vệ được; khác nhau ở việc nặng về <em>mô hình tài chính</em> hay <em>dữ liệu cầu người tiêu dùng</em>. Thương hiệu mạnh kiếm được <strong>price premium (giá cao hơn)</strong> và trung thành cao hơn — bộ mặt tài chính của tài sản thương hiệu.</p>
<div class="callout"><span class="badge">Ví dụ thực</span> Interbrand thường định giá <strong>Apple</strong> và <strong>Amazon</strong> ở hàng trăm tỉ đô; một thương hiệu có thể đáng giá hơn tài sản hữu hình của công ty, và hiện thành goodwill sau một thương vụ mua lại.</div>`,
  ]]);

const c6q = quiz('bra301-quiz-6', 'Quiz 6 — Valuation & finance|||Quiz 6 — Định giá & tài chính', [
  { id: 'q1', question: 'Ba nhân tố trong phương pháp định giá Interbrand là?', options: ['Logo, tên, slogan', 'Hiệu quả tài chính × vai trò thương hiệu × sức mạnh thương hiệu', 'Chi phí, số nhân viên, doanh thu', 'Giá, chỗ, khuyến mãi'], correctIndex: 1, explanation: 'Interbrand = financial performance × role of brand × brand strength.' },
  { id: 'q2', question: 'Cách tiếp cận định giá "income" dựa trên?', options: ['Chi phí đã bỏ ra để dựng thương hiệu', 'Giá trị hiện tại của lợi nhuận TƯƠNG LAI do thương hiệu tạo ra', 'Giá thương hiệu tương đương đã bán', 'Số lượng cửa hàng'], correctIndex: 1, explanation: 'Income = PV của dòng lợi nhuận tương lai thương hiệu dẫn dắt — hướng tương lai.' },
  { id: 'q3', question: 'Điểm khác chính giữa Interbrand và BrandZ?', options: ['Không khác gì', 'BrandZ nặng dữ liệu CẦU của người tiêu dùng; Interbrand nặng mô hình tài chính + vai trò/sức mạnh', 'BrandZ chỉ tính chi phí logo', 'Interbrand không dùng số tài chính'], correctIndex: 1, explanation: 'BrandZ suy từ nghiên cứu cầu người tiêu dùng; Interbrand thiên về mô hình tài chính + role/strength.' },
]);

const c7 = doc('bra301-7-1-innovation-repositioning', '7.1 — Brand innovation & repositioning|||7.1 — Đổi mới & tái định vị thương hiệu',
  'Brand relevance decay; repositioning vs rebranding; brand revitalization (Keller: reinforce vs revitalize); risks (backlash, New Coke); khi nào làm mới.',
  [[
    `<span class="eyebrow">BRA301 · Chapter 7 · Lesson 7.1</span>
<h2>Brand innovation &amp; repositioning</h2>
<h3>Reinforce vs revitalize (Keller)</h3>
<p>Keller frames brand management over time as two jobs: <strong>reinforce</strong> equity (keep the meaning consistent and fresh) and, when a brand fades, <strong>revitalize</strong> it — recover lost sources of equity or create new ones.</p>
<h3>Repositioning vs rebranding</h3>
<ul>
<li><strong>Repositioning</strong> — changing what the brand <em>stands for</em> in the customer's mind (Old Spice moving from "grandpa" to young, funny).</li>
<li><strong>Rebranding</strong> — changing the <em>identity</em> (name, logo, system). It can express a reposition, or just refresh the look.</li>
</ul>
<h3>Revitalization levers &amp; risk</h3>
<pre><code>Expand awareness / usage occasions
Improve or add points-of-difference
Re-target a new segment or generation
Refresh identity + signature product</code></pre>
<p>Change carries risk: move too far from the core and loyalists revolt. <strong>New Coke (1985)</strong> is the classic warning — changing the product/meaning triggered backlash and a fast reversal.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Old Spice</strong> repositioned from an ageing brand to a youthful, humorous one ("The Man Your Man Could Smell Like") — a revitalization that recaptured relevance without abandoning the name.</div>`,
    `<span class="eyebrow">BRA301 · Chương 7 · Bài 7.1</span>
<h2>Đổi mới &amp; tái định vị thương hiệu</h2>
<h3>Củng cố vs hồi sinh (Keller)</h3>
<p>Keller mô tả quản trị thương hiệu theo thời gian là hai việc: <strong>củng cố (reinforce)</strong> tài sản (giữ ý nghĩa nhất quán và tươi mới) và, khi thương hiệu phai nhạt, <strong>hồi sinh (revitalize)</strong> nó — lấy lại nguồn equity đã mất hoặc tạo nguồn mới.</p>
<h3>Tái định vị vs rebranding</h3>
<ul>
<li><strong>Repositioning (tái định vị)</strong> — đổi thứ thương hiệu <em>đại diện</em> trong tâm trí khách (Old Spice chuyển từ "ông già" sang trẻ, hài).</li>
<li><strong>Rebranding</strong> — đổi <em>nhận diện</em> (tên, logo, hệ thống). Có thể thể hiện một cuộc tái định vị, hoặc chỉ làm mới hình thức.</li>
</ul>
<h3>Đòn bẩy hồi sinh &amp; rủi ro</h3>
<pre><code>Mở rộng nhận biết / dịp dùng
Cải thiện hoặc thêm điểm khác biệt (POD)
Nhắm lại phân khúc / thế hệ mới
Làm mới nhận diện + sản phẩm chữ ký</code></pre>
<p>Thay đổi có rủi ro: đi quá xa cái lõi thì khách trung thành phản ứng. <strong>New Coke (1985)</strong> là lời cảnh báo kinh điển — đổi sản phẩm/ý nghĩa gây phản ứng dữ dội và phải đảo ngược nhanh.</p>
<div class="callout"><span class="badge">Ví dụ thực</span> <strong>Old Spice</strong> tái định vị từ thương hiệu già cỗi sang trẻ trung, hài hước ("The Man Your Man Could Smell Like") — một cuộc hồi sinh lấy lại độ liên quan mà không bỏ cái tên.</div>`,
  ]]);

const c7q = quiz('bra301-quiz-7', 'Quiz 7 — Innovation & repositioning|||Quiz 7 — Đổi mới & tái định vị', [
  { id: 'q1', question: 'Theo Keller, khi thương hiệu phai nhạt thì việc cần làm là?', options: ['Reinforce (củng cố)', 'Revitalize (hồi sinh) — lấy lại nguồn equity đã mất hoặc tạo nguồn mới', 'Ngừng bán ngay', 'Chỉ đổi logo'], correctIndex: 1, explanation: 'Reinforce giữ equity; khi phai nhạt cần revitalize — phục hồi/tạo mới nguồn tài sản.' },
  { id: 'q2', question: 'Khác biệt cốt lõi giữa repositioning và rebranding?', options: ['Không khác gì', 'Repositioning đổi thứ thương hiệu ĐẠI DIỆN trong tâm trí; rebranding đổi NHẬN DIỆN (tên/logo)', 'Rebranding luôn rẻ hơn', 'Repositioning chỉ là đổi màu'], correctIndex: 1, explanation: 'Reposition = đổi ý nghĩa/định vị; rebrand = đổi nhận diện. Rebrand có thể thể hiện reposition.' },
  { id: 'q3', question: 'Bài học từ "New Coke (1985)" là?', options: ['Luôn nên đổi công thức', 'Đi quá xa khỏi lõi/ý nghĩa có thể gây phản ứng dữ dội từ khách trung thành', 'Rebranding luôn thành công', 'Không bao giờ nên đo lường'], correctIndex: 1, explanation: 'Đổi sản phẩm/ý nghĩa quá mạnh khiến loyalist phản đối → phải đảo ngược nhanh.' },
]);

const c8 = doc('bra301-8-1-brand-leadership-future', '8.1 — Brand leadership & the future|||8.1 — Lãnh đạo thương hiệu & tương lai',
  'Brand leadership vs classic model (Aaker); brand purpose & ESG (thật vs greenwashing); AI & tech trong branding; brand governance & guidelines; brand risk/reputation.',
  [[
    `<span class="eyebrow">BRA301 · Chapter 8 · Lesson 8.1</span>
<h2>Brand leadership &amp; the future</h2>
<h3>From tactical to strategic (Aaker)</h3>
<p>Aaker's <strong>brand leadership</strong> model contrasts with the old tactical view: the brand manager is <em>strategic and visionary</em>, owns brand equity as a business asset, and drives architecture and culture — not just next quarter's ads.</p>
<h3>Purpose &amp; ESG — done for real</h3>
<p>A credible <strong>brand purpose</strong> (a reason to exist beyond profit) plus a genuine <strong>ESG</strong> stance builds trust and talent. Faked, it becomes <strong>greenwashing</strong> and destroys credibility faster than silence. The test: is the purpose backed by operations, or just advertising?</p>
<h3>Technology &amp; governance</h3>
<ul>
<li><strong>AI</strong> — personalisation, generative content and service at scale; but consistency and rights become harder to control.</li>
<li><strong>Brand governance</strong> — guidelines, a design system and clear ownership keep the brand consistent across markets, agencies and AI tools.</li>
<li><strong>Brand risk</strong> — in a viral world reputation can be lost overnight; crisis response is now core brand management.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> <strong>Patagonia</strong> makes purpose operational — repairs, recycled materials, giving the company to fight climate change — so its ESG claims read as real, not greenwash, and deepen loyalty.</div>`,
    `<span class="eyebrow">BRA301 · Chương 8 · Bài 8.1</span>
<h2>Lãnh đạo thương hiệu &amp; tương lai</h2>
<h3>Từ chiến thuật sang chiến lược (Aaker)</h3>
<p>Mô hình <strong>brand leadership</strong> của Aaker tương phản với lối nhìn chiến thuật cũ: người quản trị thương hiệu <em>mang tính chiến lược và tầm nhìn</em>, sở hữu tài sản thương hiệu như một tài sản kinh doanh, và dẫn dắt kiến trúc lẫn văn hoá — không chỉ lo quảng cáo quý tới.</p>
<h3>Purpose &amp; ESG — làm cho thật</h3>
<p>Một <strong>brand purpose</strong> đáng tin (lý do tồn tại ngoài lợi nhuận) cộng lập trường <strong>ESG</strong> chân thật xây niềm tin và thu hút nhân tài. Làm giả thì thành <strong>greenwashing</strong>, phá uy tín còn nhanh hơn im lặng. Phép thử: purpose có được vận hành hậu thuẫn, hay chỉ là quảng cáo?</p>
<h3>Công nghệ &amp; quản trị</h3>
<ul>
<li><strong>AI</strong> — cá nhân hoá, nội dung sinh và dịch vụ ở quy mô lớn; nhưng nhất quán và quyền sở hữu khó kiểm soát hơn.</li>
<li><strong>Brand governance</strong> — guidelines, một design system và quyền sở hữu rõ ràng giữ thương hiệu nhất quán qua các thị trường, agency và công cụ AI.</li>
<li><strong>Brand risk</strong> — trong thế giới lan truyền, danh tiếng có thể mất qua một đêm; xử lý khủng hoảng nay là phần lõi của quản trị thương hiệu.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thực</span> <strong>Patagonia</strong> vận hành hoá purpose — sửa chữa, vật liệu tái chế, trao công ty để chống biến đổi khí hậu — nên tuyên bố ESG đọc ra như thật, không phải greenwash, và làm sâu lòng trung thành.</div>`,
  ]]);

const c8q = quiz('bra301-quiz-8', 'Quiz 8 — Leadership & the future|||Quiz 8 — Lãnh đạo & tương lai', [
  { id: 'q1', question: 'Mô hình "brand leadership" của Aaker nhấn mạnh người quản trị thương hiệu?', options: ['Chỉ lo quảng cáo quý tới', 'Mang tính chiến lược & tầm nhìn, sở hữu equity như tài sản kinh doanh, dẫn dắt kiến trúc & văn hoá', 'Chỉ quản kho', 'Chỉ chọn màu logo'], correctIndex: 1, explanation: 'Brand leadership: vai trò chiến lược/tầm nhìn, coi thương hiệu là tài sản kinh doanh dài hạn.' },
  { id: 'q2', question: 'Phép thử để phân biệt brand purpose thật với greenwashing?', options: ['Ngân sách quảng cáo lớn hay nhỏ', 'Purpose có được VẬN HÀNH hậu thuẫn hay chỉ là quảng cáo', 'Logo có màu xanh không', 'Số người theo dõi mạng xã hội'], correctIndex: 1, explanation: 'Thật = có hành động/vận hành đằng sau; chỉ nói mà không làm = greenwashing, phá uy tín.' },
  { id: 'q3', question: 'Vì sao "brand governance" (guidelines, design system, quyền sở hữu) quan trọng hơn trong kỷ nguyên AI?', options: ['Vì AI thay thế thương hiệu', 'Vì nội dung sinh ở quy mô lớn khiến nhất quán & quyền sở hữu khó kiểm soát hơn', 'Vì không cần con người nữa', 'Vì giá luôn giảm'], correctIndex: 1, explanation: 'AI sinh nội dung nhiều/nhanh → cần governance để giữ nhất quán qua thị trường, agency, công cụ.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'BRA301',
    slug: 'bra301-brand-management',
    title: 'Brand Management',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BRA301.webp',
    shortDescription: 'Advanced brand strategy — brand-led growth, portfolio & architecture, extension & co-branding, global branding, brand experience & D2C, valuation & brand finance, repositioning & revitalization, brand leadership, purpose/ESG & AI. Bilingual, real cases, quizzes.|||Quản trị thương hiệu nâng cao — tăng trưởng, danh mục & kiến trúc, mở rộng & co-branding, toàn cầu hoá, trải nghiệm & D2C, định giá & tài chính, tái định vị, lãnh đạo & tương lai (ESG, AI). Song ngữ, ca thật, quiz.',
    description: 'Môn <strong>BRA301 — Brand Management</strong> (Quản trị thương hiệu nâng cao, ngành Truyền thông, Kỳ 7) đi sâu <strong>chiến lược thương hiệu</strong>, nối tiếp BRA201. Từ <strong>chiến lược &amp; tăng trưởng</strong> (brand vision, brand relevance) → <strong>danh mục &amp; kiến trúc nâng cao</strong> (endorsed/sub-brand, brand migration) → <strong>mở rộng &amp; đòn bẩy</strong> (co-branding, licensing, rủi ro pha loãng) → <strong>thương hiệu toàn cầu</strong> (chuẩn hoá vs địa phương hoá) → <strong>trải nghiệm thương hiệu &amp; D2C</strong> → <strong>định giá &amp; tài chính thương hiệu</strong> (Interbrand/BrandZ, ROI) → <strong>đổi mới &amp; tái định vị</strong> → <strong>lãnh đạo thương hiệu &amp; tương lai</strong> (purpose, ESG, AI, governance). Khung bám sách chuẩn quốc tế (Keller, Aaker, Kapferer), song ngữ, ví dụ thương hiệu thật (Tesla, Marriott, McDonald\'s, Starbucks, Patagonia), quiz mỗi chương.',
    whatYouLearn: 'Dùng thương hiệu để dẫn dắt tăng trưởng (brand vision, relevance vs preference, growth vectors); brand portfolio & brand relationship spectrum của Aaker, vai trò driver/endorser/flanker & brand migration; brand extension nâng cao (fit, feedback effect), co-branding, ingredient branding, licensing & rủi ro pha loãng; global branding (standardisation vs adaptation, glocal, brand across cultures); brand experience (Brakus 4 chiều), brand journey, D2C & first-party data; brand valuation (cost/market/income, Interbrand, BrandZ) & brand finance; brand innovation, repositioning vs rebranding, revitalization (Keller); brand leadership (Aaker), brand purpose/ESG, AI & brand governance.',
    requirements: 'Nên đã học BRA201 (Nhập môn Quản trị thương hiệu) hoặc nắm chắc brand equity (CBBE), định vị (POP/POD), nhận diện và IMC. Sẵn sàng phân tích ca thương hiệu thật ở góc chiến lược và tài chính.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Keller, Aaker "Aaker on Branding", Kapferer, HBR, Interbrand & BrandZ, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thương hiệu như chiến lược, khác BRA201, chuẩn đầu ra, cơ cấu điểm.', lessons: [intro] },
    { title: 'Chương 1 — Chiến lược & tăng trưởng|||Chapter 1 — Strategy & growth', description: 'Brand vision, brand relevance, growth vectors.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Danh mục & kiến trúc|||Chapter 2 — Portfolio & architecture', description: 'Relationship spectrum, roles, brand migration.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mở rộng & đòn bẩy|||Chapter 3 — Extension & leverage', description: 'Co-branding, licensing, rủi ro pha loãng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thương hiệu toàn cầu|||Chapter 4 — Global branding', description: 'Chuẩn hoá vs địa phương hoá, glocal, văn hoá.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Trải nghiệm & D2C|||Chapter 5 — Experience & D2C', description: 'Brand experience, journey, D2C & data.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Định giá & tài chính|||Chapter 6 — Valuation & finance', description: 'Interbrand, BrandZ, brand ROI, intangible.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đổi mới & tái định vị|||Chapter 7 — Innovation & repositioning', description: 'Repositioning, rebranding, revitalization.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Lãnh đạo & tương lai|||Chapter 8 — Leadership & the future', description: 'Brand leadership, purpose/ESG, AI, governance.', lessons: [c8, c8q] },
  ],
};
