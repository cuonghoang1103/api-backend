/**
 * BRA201 — Introduction to Brand Management / Nhập môn Quản trị thương hiệu.
 * Ngành Công nghệ Truyền thông (FPTU), Kỳ 2. Môn KHÔNG có trong FLM →
 * khung dựng theo giáo trình chuẩn quốc tế: Keller "Strategic Brand
 * Management" + Kotler "Marketing Management"; Aaker "Building Strong Brands".
 * KHUNG chất lượng: 8 chương outline song ngữ VI+EN + quiz + Tài liệu.
 * Giữ NGUYÊN slug/courseCode/semester/thumb. ⚠️ KHÔNG backtick/${ trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bra201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách chính (Keller, Aaker, Kotler), HBR on Branding, nguồn miễn phí (Interbrand), công cụ (Canva/Figma), lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">BRA201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Brand Management</strong> — what a brand is, brand equity, positioning, identity, communications, architecture, measurement and digital branding — in one place. No FLM syllabus exists for this subject, so the course follows the <strong>standard international textbooks</strong> below.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/strategic-brand-management/P200000006027/" target="_blank" rel="noopener"><strong>Keller, K. L. — <em>Strategic Brand Management</em></strong> (Pearson)</a> — the main reference; source of the CBBE model.</li>
<li><a href="https://www.simonandschuster.com/books/Building-Strong-Brands/David-A-Aaker/9781471104954" target="_blank" rel="noopener"><strong>Aaker, D. — <em>Building Strong Brands</em></strong></a> — brand identity &amp; brand equity (Free Press).</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/marketing-management/P200000005539/" target="_blank" rel="noopener"><strong>Kotler &amp; Keller — <em>Marketing Management</em></strong></a> — brands inside the wider marketing system.</li>
</ul>
<h3>🌐 Free / official reading</h3>
<ul>
<li><a href="https://hbr.org/topic/subject/branding" target="_blank" rel="noopener">Harvard Business Review — Branding topic hub</a> (many articles free).</li>
<li><a href="https://interbrand.com/best-global-brands/" target="_blank" rel="noopener">Interbrand — Best Global Brands</a> — annual brand valuation rankings &amp; method.</li>
<li><a href="https://www.marketingweek.com/" target="_blank" rel="noopener">Marketing Week</a> — current brand campaigns &amp; commentary.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — logos, moodboards, brand kit for practice.</li>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — brand identity boards &amp; design systems.</li>
</ul>
<div class="callout"><span class="badge">Self-study path (4 steps)</span>
<ol>
<li><strong>Foundations</strong> — what a brand is vs a product, why brands matter, brand equity (Keller CBBE).</li>
<li><strong>Strategy</strong> — positioning (POP/POD, brand mantra) and identity (name/logo/slogan, identity prism).</li>
<li><strong>Build &amp; grow</strong> — integrated communications (IMC), brand extension &amp; architecture, portfolio.</li>
<li><strong>Measure &amp; modernise</strong> — brand audit/tracking/valuation, then digital branding, community &amp; brand purpose/ESG.</li>
</ol></div>`,
    `<span class="eyebrow">BRA201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quản trị thương hiệu</strong> — thương hiệu là gì, tài sản thương hiệu, định vị, nhận diện, truyền thông, kiến trúc, đo lường và thương hiệu số — gom về một chỗ. Môn này không có giáo trình FLM, nên khung bám các <strong>sách chuẩn quốc tế</strong> dưới đây.</p>
<h3>📘 Sách chính</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/strategic-brand-management/P200000006027/" target="_blank" rel="noopener"><strong>Keller, K. L. — <em>Strategic Brand Management</em></strong> (Pearson)</a> — nguồn chính; gốc của mô hình CBBE.</li>
<li><a href="https://www.simonandschuster.com/books/Building-Strong-Brands/David-A-Aaker/9781471104954" target="_blank" rel="noopener"><strong>Aaker, D. — <em>Building Strong Brands</em></strong></a> — nhận diện &amp; tài sản thương hiệu (Free Press).</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/marketing-management/P200000005539/" target="_blank" rel="noopener"><strong>Kotler &amp; Keller — <em>Marketing Management</em></strong></a> — thương hiệu trong hệ thống marketing rộng.</li>
</ul>
<h3>🌐 Đọc miễn phí / chính thức</h3>
<ul>
<li><a href="https://hbr.org/topic/subject/branding" target="_blank" rel="noopener">Harvard Business Review — chuyên mục Branding</a> (nhiều bài miễn phí).</li>
<li><a href="https://interbrand.com/best-global-brands/" target="_blank" rel="noopener">Interbrand — Best Global Brands</a> — bảng xếp hạng &amp; phương pháp định giá thương hiệu.</li>
<li><a href="https://www.marketingweek.com/" target="_blank" rel="noopener">Marketing Week</a> — chiến dịch &amp; bình luận thương hiệu mới.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — logo, moodboard, brand kit để thực hành.</li>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — bảng nhận diện &amp; hệ thống thiết kế.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học (4 bước)</span>
<ol>
<li><strong>Nền tảng</strong> — thương hiệu vs sản phẩm, vì sao thương hiệu quan trọng, tài sản thương hiệu (Keller CBBE).</li>
<li><strong>Chiến lược</strong> — định vị (POP/POD, brand mantra) và nhận diện (tên/logo/slogan, identity prism).</li>
<li><strong>Xây &amp; mở rộng</strong> — truyền thông tích hợp (IMC), mở rộng &amp; kiến trúc thương hiệu, danh mục.</li>
<li><strong>Đo &amp; hiện đại hoá</strong> — brand audit/tracking/định giá, rồi thương hiệu số, cộng đồng &amp; brand purpose/ESG.</li>
</ol></div>`,
  ]]);

const intro = doc('bra201-0-1-overview', 'Course overview: what a brand is|||Tổng quan: thương hiệu là gì',
  'Thương hiệu là gì; vì sao quan trọng (với khách hàng & doanh nghiệp); chuẩn đầu ra; cơ cấu điểm gợi ý; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">BRA201 · Lesson 0.1 · Overview</span>
<h2>What is a brand — and why manage it?</h2>
<p class="lead">A <strong>brand</strong> is not just a logo. The American Marketing Association defines it as a <em>name, term, sign, symbol or design</em> — or a combination — meant to identify one seller's goods and <strong>differentiate</strong> them from competitors. But a strong brand is really a set of <strong>associations and promises</strong> living in the customer's mind.</p>
<h3>Why brands matter</h3>
<ul>
<li><strong>For customers</strong> — reduce risk and search effort, signal quality, express identity ("I'm an Apple person").</li>
<li><strong>For firms</strong> — command a price premium, earn loyalty, lower marketing cost per sale, and create a durable, ownable asset.</li>
</ul>
<h3>Learning outcomes</h3>
<ul>
<li>Explain brand equity and the <strong>Keller CBBE pyramid</strong>.</li>
<li>Build a <strong>positioning</strong> (POP/POD, brand mantra) and an <strong>identity</strong> system.</li>
<li>Plan integrated brand <strong>communications</strong>, <strong>extension &amp; architecture</strong>, and <strong>measurement</strong>.</li>
</ul>
<h3>Suggested grade structure</h3>
<pre><code>Participation / quizzes ....... 10%
Brand audit assignment ........ 20%
Group brand-plan project ...... 30%
Final exam .................... 40%</code></pre>
<div class="callout"><span class="badge">Roadmap</span> Ch1 brand basics → Ch2 brand equity → Ch3 positioning → Ch4 identity → Ch5 communications (IMC) → Ch6 extension &amp; architecture → Ch7 measurement → Ch8 digital &amp; trends.</div>`,
    `<span class="eyebrow">BRA201 · Bài 0.1 · Tổng quan</span>
<h2>Thương hiệu là gì — và vì sao phải quản trị?</h2>
<p class="lead">Một <strong>thương hiệu</strong> không chỉ là cái logo. Hiệp hội Marketing Hoa Kỳ (AMA) định nghĩa nó là <em>tên, thuật ngữ, dấu hiệu, biểu tượng hay thiết kế</em> — hoặc tổ hợp — nhằm nhận diện hàng hoá của một người bán và <strong>phân biệt</strong> với đối thủ. Nhưng thương hiệu mạnh thực chất là tập hợp <strong>liên tưởng và lời hứa</strong> sống trong tâm trí khách hàng.</p>
<h3>Vì sao thương hiệu quan trọng</h3>
<ul>
<li><strong>Với khách hàng</strong> — giảm rủi ro và công sức tìm kiếm, báo hiệu chất lượng, thể hiện bản sắc ("Tôi là người dùng Apple").</li>
<li><strong>Với doanh nghiệp</strong> — bán được giá cao hơn, tạo lòng trung thành, giảm chi phí marketing trên mỗi đơn, và tạo tài sản bền vững, sở hữu được.</li>
</ul>
<h3>Chuẩn đầu ra</h3>
<ul>
<li>Giải thích tài sản thương hiệu và <strong>tháp CBBE của Keller</strong>.</li>
<li>Xây một bản <strong>định vị</strong> (POP/POD, brand mantra) và một hệ thống <strong>nhận diện</strong>.</li>
<li>Lập kế hoạch <strong>truyền thông</strong> tích hợp, <strong>mở rộng &amp; kiến trúc</strong>, và <strong>đo lường</strong> thương hiệu.</li>
</ul>
<h3>Cơ cấu điểm gợi ý</h3>
<pre><code>Chuyên cần / quiz ............. 10%
Bài tập brand audit .......... 20%
Dự án nhóm brand-plan ........ 30%
Thi cuối kỳ .................. 40%</code></pre>
<div class="callout"><span class="badge">Lộ trình</span> Ch1 nền tảng → Ch2 tài sản thương hiệu → Ch3 định vị → Ch4 nhận diện → Ch5 truyền thông (IMC) → Ch6 mở rộng &amp; kiến trúc → Ch7 đo lường → Ch8 thương hiệu số &amp; xu hướng.</div>`,
  ]]);

const c1 = doc('bra201-1-1-brand-basics', '1.1 — Brand & brand management|||1.1 — Thương hiệu & quản trị thương hiệu',
  'Định nghĩa thương hiệu (AMA), vai trò thương hiệu, phân biệt brand vs product; nhiệm vụ của quản trị thương hiệu.',
  [[
    `<span class="eyebrow">BRA201 · Chapter 1 · Lesson 1.1</span>
<h2>Brand &amp; brand management</h2>
<h3>Brand vs product</h3>
<p>A <strong>product</strong> is anything offered to satisfy a need — it can be copied. A <strong>brand</strong> adds dimensions that <em>differentiate</em> it: meaning, feelings, reputation, trust. As Kotler puts it, "a product is made in a factory; a brand is bought by a customer." Two colas can be chemically similar; <strong>Coca-Cola</strong> vs a store label are worlds apart in value.</p>
<h3>The role of a brand</h3>
<ul>
<li><strong>Identification</strong> — tells buyers who made it and what to expect.</li>
<li><strong>Risk reduction</strong> — a known brand lowers the fear of a bad choice.</li>
<li><strong>Meaning &amp; status</strong> — brands carry symbolic value (Nike = performance, Rolex = success).</li>
</ul>
<h3>What brand management does</h3>
<p><strong>Brand management</strong> is the process of planning, building and controlling a brand's associations over time so its value grows. It covers strategy (equity, positioning), design (identity), delivery (communications, experience) and control (measurement).</p>
<div class="callout"><span class="badge">Real example</span> <strong>Apple</strong> sells hardware many rivals can match on specs, yet commands premium prices and fierce loyalty — because the brand means design, simplicity and belonging, not just a device.</div>`,
    `<span class="eyebrow">BRA201 · Chương 1 · Bài 1.1</span>
<h2>Thương hiệu &amp; quản trị thương hiệu</h2>
<h3>Brand vs product</h3>
<p>Một <strong>sản phẩm</strong> là thứ được cung cấp để thoả mãn nhu cầu — có thể bị sao chép. Một <strong>thương hiệu</strong> thêm những chiều <em>phân biệt</em> nó: ý nghĩa, cảm xúc, danh tiếng, niềm tin. Như Kotler nói, "sản phẩm được làm ra trong nhà máy; thương hiệu được khách hàng mua". Hai loại cola có thể giống nhau về hoá học; <strong>Coca-Cola</strong> và nhãn hàng riêng của siêu thị lại cách nhau rất xa về giá trị.</p>
<h3>Vai trò của thương hiệu</h3>
<ul>
<li><strong>Nhận diện</strong> — cho người mua biết ai làm ra và kỳ vọng điều gì.</li>
<li><strong>Giảm rủi ro</strong> — thương hiệu quen làm giảm nỗi lo chọn nhầm.</li>
<li><strong>Ý nghĩa &amp; địa vị</strong> — thương hiệu mang giá trị biểu tượng (Nike = hiệu suất, Rolex = thành đạt).</li>
</ul>
<h3>Quản trị thương hiệu làm gì</h3>
<p><strong>Quản trị thương hiệu</strong> là quá trình hoạch định, xây dựng và kiểm soát các liên tưởng của thương hiệu theo thời gian để giá trị của nó lớn lên. Nó gồm chiến lược (tài sản, định vị), thiết kế (nhận diện), phân phối (truyền thông, trải nghiệm) và kiểm soát (đo lường).</p>
<div class="callout"><span class="badge">Ví dụ thực</span> <strong>Apple</strong> bán phần cứng mà nhiều đối thủ ngang ngửa về thông số, nhưng vẫn giữ giá cao và lòng trung thành mạnh — vì thương hiệu nghĩa là thiết kế, sự đơn giản và cảm giác thuộc về, không chỉ là một thiết bị.</div>`,
  ]]);

const c1q = quiz('bra201-quiz-1', 'Quiz 1 — Brand basics|||Quiz 1 — Nền tảng thương hiệu', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa "product" và "brand" là?', options: ['Không có khác biệt', 'Brand thêm ý nghĩa/cảm xúc/niềm tin để phân biệt, product có thể sao chép', 'Product đắt hơn brand', 'Brand chỉ là cái logo'], correctIndex: 1, explanation: 'Sản phẩm làm trong nhà máy; thương hiệu là thứ khách hàng mua — thêm ý nghĩa, cảm xúc, niềm tin.' },
  { id: 'q2', question: 'Theo AMA, thương hiệu KHÔNG chỉ gồm yếu tố nào?', options: ['Tên, dấu hiệu, biểu tượng, thiết kế để phân biệt người bán', 'Chỉ giá bán', 'Chỉ số lượng bán ra', 'Chỉ nhà máy sản xuất'], correctIndex: 0, explanation: 'AMA: tên/thuật ngữ/dấu hiệu/biểu tượng/thiết kế nhằm nhận diện và phân biệt.' },
  { id: 'q3', question: 'Vai trò của thương hiệu với KHÁCH HÀNG là?', options: ['Tăng chi phí marketing', 'Giảm rủi ro & công sức tìm kiếm, báo hiệu chất lượng', 'Chỉ giúp doanh nghiệp', 'Không liên quan đến quyết định mua'], correctIndex: 1, explanation: 'Thương hiệu giảm rủi ro, giảm công sức tìm kiếm và báo hiệu chất lượng cho khách hàng.' },
]);

const c2 = doc('bra201-2-1-brand-equity', '2.1 — Brand equity (Keller CBBE)|||2.1 — Tài sản thương hiệu (CBBE của Keller)',
  'Brand equity là gì; tháp CBBE 6 khối: salience → performance/imagery → judgments/feelings → resonance; brand value/định giá.',
  [[
    `<span class="eyebrow">BRA201 · Chapter 2 · Lesson 2.1</span>
<h2>Brand equity — the Keller CBBE model</h2>
<p><strong>Brand equity</strong> is the added value a brand gives a product — the difference in customer response caused by knowing the brand. <strong>Customer-Based Brand Equity (CBBE)</strong> (Keller) says equity is built by shaping what customers think and feel, in a four-level pyramid of six blocks:</p>
<pre><code>4. RESONANCE   -> loyalty, community ("Are we in a relationship?")
3. JUDGMENTS  + FEELINGS   ("What do I think/feel about you?")
2. PERFORMANCE + IMAGERY    ("What are you?")
1. SALIENCE   -> brand awareness ("Who are you?")</code></pre>
<h3>The six blocks</h3>
<ul>
<li><strong>Salience</strong> — depth &amp; breadth of awareness (do people recall you?).</li>
<li><strong>Performance</strong> — how well the product meets functional needs; <strong>Imagery</strong> — the intangible, social/psychological meaning.</li>
<li><strong>Judgments</strong> — quality, credibility, superiority; <strong>Feelings</strong> — warmth, fun, security, self-respect.</li>
<li><strong>Resonance</strong> — the top: intense loyalty, active engagement, community.</li>
</ul>
<h3>Brand value</h3>
<p>Strong equity converts into <strong>brand value</strong> — a financial figure (see Interbrand). Firms like <strong>Apple</strong> and <strong>Amazon</strong> top these rankings because equity supports premium pricing and loyalty.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Harley-Davidson</strong> reaches <em>resonance</em>: owners tattoo the logo and join clubs — engagement far beyond the motorcycle itself.</div>`,
    `<span class="eyebrow">BRA201 · Chương 2 · Bài 2.1</span>
<h2>Tài sản thương hiệu — mô hình CBBE của Keller</h2>
<p><strong>Tài sản thương hiệu (brand equity)</strong> là giá trị tăng thêm mà thương hiệu mang lại cho sản phẩm — chênh lệch trong phản ứng của khách hàng do biết thương hiệu. <strong>CBBE (Customer-Based Brand Equity)</strong> của Keller nói tài sản được xây bằng cách định hình suy nghĩ và cảm xúc của khách hàng, theo một tháp 4 tầng gồm 6 khối:</p>
<pre><code>4. RESONANCE (cộng hưởng) -> trung thành, cộng đồng ("Ta có mối quan hệ?")
3. JUDGMENTS (đánh giá) + FEELINGS (cảm xúc) ("Nghĩ/cảm gì về bạn?")
2. PERFORMANCE (hiệu năng) + IMAGERY (hình ảnh) ("Bạn là gì?")
1. SALIENCE (nổi bật) -> nhận biết ("Bạn là ai?")</code></pre>
<h3>Sáu khối</h3>
<ul>
<li><strong>Salience</strong> — độ sâu &amp; rộng của nhận biết (người ta có nhớ ra bạn không?).</li>
<li><strong>Performance</strong> — sản phẩm đáp ứng nhu cầu chức năng tốt thế nào; <strong>Imagery</strong> — ý nghĩa vô hình, mang tính xã hội/tâm lý.</li>
<li><strong>Judgments</strong> — chất lượng, uy tín, vượt trội; <strong>Feelings</strong> — ấm áp, vui, an toàn, tự tôn.</li>
<li><strong>Resonance</strong> — đỉnh: trung thành mãnh liệt, gắn kết chủ động, cộng đồng.</li>
</ul>
<h3>Giá trị thương hiệu</h3>
<p>Tài sản mạnh chuyển thành <strong>giá trị thương hiệu (brand value)</strong> — một con số tài chính (xem Interbrand). Các hãng như <strong>Apple</strong>, <strong>Amazon</strong> đứng đầu bảng vì tài sản thương hiệu nâng đỡ giá cao và lòng trung thành.</p>
<div class="callout"><span class="badge">Ví dụ thực</span> <strong>Harley-Davidson</strong> chạm tới <em>resonance</em>: chủ xe xăm logo và lập hội nhóm — gắn kết vượt xa bản thân chiếc mô tô.</div>`,
  ]]);

const c2q = quiz('bra201-quiz-2', 'Quiz 2 — Brand equity|||Quiz 2 — Tài sản thương hiệu', [
  { id: 'q1', question: 'Tầng ĐÁY (nền) của tháp CBBE là?', options: ['Resonance', 'Salience (nhận biết)', 'Feelings', 'Judgments'], correctIndex: 1, explanation: 'CBBE xây từ dưới lên: Salience (nhận biết) → Performance/Imagery → Judgments/Feelings → Resonance.' },
  { id: 'q2', question: 'Đỉnh của tháp CBBE — trung thành, cộng đồng, gắn kết chủ động — là?', options: ['Salience', 'Performance', 'Resonance (cộng hưởng)', 'Imagery'], correctIndex: 2, explanation: 'Resonance là đỉnh: quan hệ sâu, trung thành và gắn kết mạnh (vd Harley-Davidson).' },
  { id: 'q3', question: '"Brand equity" (tài sản thương hiệu) nghĩa là?', options: ['Chi phí sản xuất', 'Giá trị tăng thêm do khách hàng biết thương hiệu, tạo phản ứng khác biệt', 'Số nhân viên marketing', 'Diện tích cửa hàng'], correctIndex: 1, explanation: 'Là giá trị tăng thêm/chênh lệch phản ứng của khách hàng do biết thương hiệu.' },
]);

const c3 = doc('bra201-3-1-positioning', '3.1 — Brand positioning|||3.1 — Định vị thương hiệu',
  'Positioning là gì; frame of reference; points-of-parity (POP) & points-of-difference (POD); brand mantra; positioning statement.',
  [[
    `<span class="eyebrow">BRA201 · Chapter 3 · Lesson 3.1</span>
<h2>Brand positioning</h2>
<p><strong>Positioning</strong> is designing the brand's offer and image to occupy a <em>distinctive place</em> in the target customer's mind. Good positioning answers: for whom, in what category, and why choose us?</p>
<h3>The building blocks</h3>
<ul>
<li><strong>Frame of reference</strong> — the category you compete in (what customers compare you against).</li>
<li><strong>Points-of-parity (POP)</strong> — attributes you must have just to be considered "table stakes" (a toothpaste must fight cavities).</li>
<li><strong>Points-of-difference (POD)</strong> — the strong, favourable, unique associations that make customers choose <em>you</em> (Volvo = safety).</li>
</ul>
<h3>Brand mantra &amp; positioning statement</h3>
<p>A <strong>brand mantra</strong> is a 3–5 word essence of the brand (Nike: "authentic athletic performance"; Disney: "fun family entertainment"). A <strong>positioning statement</strong> formalises it:</p>
<pre><code>For [target], [brand] is the [frame of reference]
that [point-of-difference], because [reason to believe].</code></pre>
<div class="callout"><span class="badge">Real example</span> <strong>Volvo</strong> owns "safety" as its POD while matching rivals on comfort and style (POP) — a clear, defensible position for decades.</div>`,
    `<span class="eyebrow">BRA201 · Chương 3 · Bài 3.1</span>
<h2>Định vị thương hiệu</h2>
<p><strong>Định vị (positioning)</strong> là thiết kế sản phẩm và hình ảnh của thương hiệu để chiếm một <em>vị trí khác biệt</em> trong tâm trí khách hàng mục tiêu. Định vị tốt trả lời: cho ai, trong nhóm ngành nào, và vì sao chọn ta?</p>
<h3>Các khối cấu thành</h3>
<ul>
<li><strong>Frame of reference</strong> — nhóm ngành bạn cạnh tranh (thứ khách hàng đem bạn ra so).</li>
<li><strong>Points-of-parity (POP)</strong> — thuộc tính bắt buộc phải có để được cân nhắc, ngang bằng đối thủ (kem đánh răng phải chống sâu răng).</li>
<li><strong>Points-of-difference (POD)</strong> — liên tưởng mạnh, tích cực, độc nhất khiến khách chọn <em>chính bạn</em> (Volvo = an toàn).</li>
</ul>
<h3>Brand mantra &amp; câu định vị</h3>
<p><strong>Brand mantra</strong> là tinh chất 3–5 chữ của thương hiệu (Nike: "authentic athletic performance"; Disney: "fun family entertainment"). <strong>Câu định vị (positioning statement)</strong> chính thức hoá nó:</p>
<pre><code>Với [đối tượng], [thương hiệu] là [frame of reference]
mà [điểm khác biệt], vì [lý do để tin].</code></pre>
<div class="callout"><span class="badge">Ví dụ thực</span> <strong>Volvo</strong> sở hữu "an toàn" làm POD trong khi vẫn ngang đối thủ về tiện nghi, kiểu dáng (POP) — một định vị rõ ràng, giữ vững suốt hàng chục năm.</div>`,
  ]]);

const c3q = quiz('bra201-quiz-3', 'Quiz 3 — Positioning|||Quiz 3 — Định vị', [
  { id: 'q1', question: '"Points-of-difference" (POD) là gì?', options: ['Thuộc tính bắt buộc phải có ngang đối thủ', 'Liên tưởng mạnh, độc nhất khiến khách chọn chính bạn', 'Giá thấp nhất thị trường', 'Số cửa hàng'], correctIndex: 1, explanation: 'POD là liên tưởng mạnh/tích cực/độc nhất tạo lý do chọn thương hiệu (vd Volvo = an toàn).' },
  { id: 'q2', question: '"Points-of-parity" (POP) là?', options: ['Điểm khác biệt độc nhất', 'Thuộc tính "table stakes" phải có để được cân nhắc, ngang đối thủ', 'Slogan của thương hiệu', 'Giá bán lẻ'], correctIndex: 1, explanation: 'POP là thuộc tính cần có để không bị loại — ngang bằng đối thủ.' },
  { id: 'q3', question: '"Brand mantra" là?', options: ['Bản báo cáo tài chính', 'Tinh chất thương hiệu ngắn 3–5 chữ', 'Danh sách kênh phân phối', 'Ngân sách quảng cáo'], correctIndex: 1, explanation: 'Brand mantra: cốt lõi 3–5 chữ (Nike: authentic athletic performance).' },
]);

const c4 = doc('bra201-4-1-brand-identity', '4.1 — Brand elements & identity|||4.1 — Yếu tố nhận diện & bản sắc thương hiệu',
  'Brand elements (tên, logo, slogan, màu, âm thanh); tiêu chí chọn; Kapferer brand identity prism (6 mặt).',
  [[
    `<span class="eyebrow">BRA201 · Chapter 4 · Lesson 4.1</span>
<h2>Brand elements &amp; identity</h2>
<h3>Brand elements</h3>
<p><strong>Brand elements</strong> are the trademarkable devices that identify and differentiate a brand:</p>
<ul>
<li><strong>Name</strong> — the hardest to change (Google, Vinamilk).</li>
<li><strong>Logo &amp; symbol</strong> — visual shorthand (Nike swoosh, Apple).</li>
<li><strong>Slogan / tagline</strong> — a memorable phrase ("Just Do It").</li>
<li><strong>Colour, typography, sound, character</strong> — Tiffany blue, the Intel jingle, the Michelin man.</li>
</ul>
<p>Keller's criteria for choosing them: <strong>memorable, meaningful, likable, transferable, adaptable, protectable</strong>.</p>
<h3>Brand identity prism (Kapferer)</h3>
<p>Identity is what the firm <em>sends out</em>; image is what customers <em>receive</em>. Kapferer's <strong>prism</strong> has six facets:</p>
<pre><code>Physique  |  Personality      (sender side)
Relationship | Culture
Reflection | Self-image        (receiver side)</code></pre>
<div class="callout"><span class="badge">Real example</span> <strong>Nike</strong>: physique = swoosh &amp; footwear; personality = daring; culture = American win-spirit; relationship = coach/motivator; reflection = athletic achiever; self-image = "I push my limits".</div>`,
    `<span class="eyebrow">BRA201 · Chương 4 · Bài 4.1</span>
<h2>Yếu tố nhận diện &amp; bản sắc thương hiệu</h2>
<h3>Brand elements</h3>
<p><strong>Yếu tố nhận diện (brand elements)</strong> là những dấu hiệu đăng ký được, dùng để nhận diện và phân biệt thương hiệu:</p>
<ul>
<li><strong>Tên</strong> — khó đổi nhất (Google, Vinamilk).</li>
<li><strong>Logo &amp; biểu tượng</strong> — ký hiệu thị giác (swoosh của Nike, quả táo Apple).</li>
<li><strong>Slogan / tagline</strong> — câu dễ nhớ ("Just Do It").</li>
<li><strong>Màu, kiểu chữ, âm thanh, nhân vật</strong> — xanh Tiffany, jingle Intel, người Michelin.</li>
</ul>
<p>Tiêu chí chọn của Keller: <strong>dễ nhớ, có ý nghĩa, được yêu thích, chuyển đổi được, thích ứng được, bảo hộ được</strong>.</p>
<h3>Lăng kính bản sắc (Kapferer)</h3>
<p>Bản sắc (identity) là thứ doanh nghiệp <em>phát đi</em>; hình ảnh (image) là thứ khách hàng <em>nhận về</em>. <strong>Lăng kính</strong> của Kapferer có sáu mặt:</p>
<pre><code>Physique (vật lý) | Personality (cá tính)   (bên gửi)
Relationship (quan hệ) | Culture (văn hoá)
Reflection (phản chiếu) | Self-image (tự hình dung)  (bên nhận)</code></pre>
<div class="callout"><span class="badge">Ví dụ thực</span> <strong>Nike</strong>: physique = swoosh &amp; giày; personality = táo bạo; culture = tinh thần chiến thắng kiểu Mỹ; relationship = huấn luyện/động viên; reflection = người thể thao thành đạt; self-image = "tôi vượt giới hạn của mình".</div>`,
  ]]);

const c4q = quiz('bra201-quiz-4', 'Quiz 4 — Identity|||Quiz 4 — Nhận diện', [
  { id: 'q1', question: 'Yếu tố nhận diện nào KHÓ thay đổi nhất?', options: ['Màu sắc', 'Tên thương hiệu', 'Slogan', 'Nhạc hiệu'], correctIndex: 1, explanation: 'Tên là yếu tố khó đổi nhất vì gắn với pháp lý, nhận biết tích luỹ lâu dài.' },
  { id: 'q2', question: 'Tiêu chí chọn brand element của Keller KHÔNG bao gồm?', options: ['Dễ nhớ (memorable)', 'Bảo hộ được (protectable)', 'Rẻ nhất có thể', 'Có ý nghĩa (meaningful)'], correctIndex: 2, explanation: 'Bộ 6 tiêu chí: memorable, meaningful, likable, transferable, adaptable, protectable — không có "rẻ nhất".' },
  { id: 'q3', question: 'Lăng kính bản sắc (identity prism) của Kapferer có bao nhiêu mặt?', options: ['3', '4', '6', '8'], correctIndex: 2, explanation: '6 mặt: physique, personality, culture, relationship, reflection, self-image.' },
]);

const c5 = doc('bra201-5-1-imc', '5.1 — Integrated brand communications|||5.1 — Truyền thông thương hiệu tích hợp',
  'IMC là gì; "one voice"; các công cụ (advertising, PR, digital, sponsorship...); brand touchpoints & customer journey.',
  [[
    `<span class="eyebrow">BRA201 · Chapter 5 · Lesson 5.1</span>
<h2>Integrated marketing communications (IMC)</h2>
<p><strong>IMC</strong> means coordinating every message so the brand speaks with <strong>one consistent voice</strong> across all channels. Fragmented messages confuse; aligned messages reinforce equity.</p>
<h3>The communication mix</h3>
<ul>
<li><strong>Advertising</strong> — paid, broad reach (TV, digital display).</li>
<li><strong>Public relations &amp; sponsorship</strong> — earned credibility, events.</li>
<li><strong>Digital &amp; social</strong> — content, influencers, search, community.</li>
<li><strong>Sales promotion, direct &amp; personal selling</strong> — short-term action &amp; relationships.</li>
</ul>
<h3>Brand touchpoints &amp; the journey</h3>
<p>A <strong>touchpoint</strong> is any moment a customer meets the brand — ad, website, packaging, store, support call, unboxing. Map them along the journey (awareness → consideration → purchase → use → advocacy) and keep the experience <em>on-brand</em> everywhere.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Coca-Cola</strong>'s "Share a Coke" ran one idea across TV, packaging (named bottles), social and in-store — a textbook IMC campaign driving talkability and sales.</div>`,
    `<span class="eyebrow">BRA201 · Chương 5 · Bài 5.1</span>
<h2>Truyền thông marketing tích hợp (IMC)</h2>
<p><strong>IMC</strong> nghĩa là phối hợp mọi thông điệp để thương hiệu nói bằng <strong>một giọng nhất quán</strong> trên tất cả kênh. Thông điệp rời rạc gây nhiễu; thông điệp đồng bộ củng cố tài sản thương hiệu.</p>
<h3>Bộ công cụ truyền thông</h3>
<ul>
<li><strong>Quảng cáo (advertising)</strong> — trả tiền, phủ rộng (TV, hiển thị số).</li>
<li><strong>PR &amp; tài trợ</strong> — uy tín "kiếm được", sự kiện.</li>
<li><strong>Số &amp; mạng xã hội</strong> — nội dung, KOL, tìm kiếm, cộng đồng.</li>
<li><strong>Khuyến mãi, bán trực tiếp &amp; cá nhân</strong> — thúc đẩy ngắn hạn &amp; quan hệ.</li>
</ul>
<h3>Điểm chạm &amp; hành trình khách hàng</h3>
<p><strong>Điểm chạm (touchpoint)</strong> là mọi khoảnh khắc khách gặp thương hiệu — quảng cáo, website, bao bì, cửa hàng, cuộc gọi hỗ trợ, mở hộp. Vẽ chúng dọc hành trình (nhận biết → cân nhắc → mua → dùng → ủng hộ) và giữ trải nghiệm <em>đúng chất thương hiệu</em> ở mọi nơi.</p>
<div class="callout"><span class="badge">Ví dụ thực</span> Chiến dịch "Share a Coke" của <strong>Coca-Cola</strong> chạy một ý tưởng xuyên TV, bao bì (chai in tên), mạng xã hội và tại điểm bán — một ví dụ IMC mẫu mực tạo bàn tán và doanh số.</div>`,
  ]]);

const c5q = quiz('bra201-quiz-5', 'Quiz 5 — IMC|||Quiz 5 — Truyền thông tích hợp', [
  { id: 'q1', question: 'Nguyên tắc cốt lõi của IMC là?', options: ['Mỗi kênh nói một kiểu khác nhau', 'Một giọng nhất quán trên mọi kênh', 'Chỉ dùng quảng cáo TV', 'Không đo lường'], correctIndex: 1, explanation: 'IMC = "one voice": phối hợp mọi thông điệp cho nhất quán.' },
  { id: 'q2', question: '"Brand touchpoint" là?', options: ['Chỉ là banner quảng cáo', 'Mọi khoảnh khắc khách hàng gặp thương hiệu (web, bao bì, cửa hàng, hỗ trợ...)', 'Chỉ là logo', 'Giá sản phẩm'], correctIndex: 1, explanation: 'Touchpoint là bất kỳ điểm tiếp xúc nào giữa khách và thương hiệu dọc hành trình.' },
  { id: 'q3', question: 'PR & tài trợ tạo ra loại uy tín gì?', options: ['Uy tín trả tiền (paid)', 'Uy tín "kiếm được" (earned)', 'Không tạo uy tín', 'Chỉ tăng giá'], correctIndex: 1, explanation: 'PR/sponsorship là kênh "earned" — uy tín kiếm được, khác quảng cáo trả tiền.' },
]);

const c6 = doc('bra201-6-1-extension-architecture', '6.1 — Brand extension & architecture|||6.1 — Mở rộng & kiến trúc thương hiệu',
  'Brand extension (line vs category, lợi ích/rủi ro, dilution); brand architecture: branded house vs house of brands; portfolio.',
  [[
    `<span class="eyebrow">BRA201 · Chapter 6 · Lesson 6.1</span>
<h2>Brand extension &amp; architecture</h2>
<h3>Brand extension</h3>
<p>A <strong>brand extension</strong> uses an existing brand on a new product. A <strong>line extension</strong> stays in the same category (Coke → Coke Zero); a <strong>category extension</strong> enters a new one (Apple → Apple Watch).</p>
<ul>
<li><strong>Benefits</strong> — instant awareness, transferred trust, cheaper launch.</li>
<li><strong>Risks</strong> — a bad extension can cause <strong>brand dilution</strong> or confuse the meaning (a luxury brand going cheap).</li>
</ul>
<h3>Brand architecture</h3>
<p><strong>Architecture</strong> is how a company organises and names its brands:</p>
<ul>
<li><strong>Branded house</strong> — one master brand on everything (Google Maps, Google Drive; FedEx).</li>
<li><strong>House of brands</strong> — independent brands under a hidden parent (P&amp;G: Tide, Gillette, Pampers).</li>
<li><strong>Endorsed / sub-brands</strong> — a mix (Marriott → Courtyard by Marriott).</li>
</ul>
<div class="callout"><span class="badge">Real example</span> <strong>Unilever</strong> runs a house of brands (Dove, Knorr, Lifebuoy) — each speaks to its own segment, and a stumble by one rarely harms the others.</div>`,
    `<span class="eyebrow">BRA201 · Chương 6 · Bài 6.1</span>
<h2>Mở rộng &amp; kiến trúc thương hiệu</h2>
<h3>Mở rộng thương hiệu</h3>
<p><strong>Mở rộng thương hiệu (brand extension)</strong> là dùng thương hiệu sẵn có cho sản phẩm mới. <strong>Line extension</strong> ở cùng nhóm ngành (Coke → Coke Zero); <strong>category extension</strong> sang nhóm mới (Apple → Apple Watch).</p>
<ul>
<li><strong>Lợi ích</strong> — có ngay nhận biết, chuyển được niềm tin, ra mắt rẻ hơn.</li>
<li><strong>Rủi ro</strong> — mở rộng dở gây <strong>pha loãng thương hiệu (dilution)</strong> hoặc làm nhoè ý nghĩa (thương hiệu cao cấp làm hàng rẻ).</li>
</ul>
<h3>Kiến trúc thương hiệu</h3>
<p><strong>Kiến trúc (architecture)</strong> là cách công ty tổ chức và đặt tên các thương hiệu:</p>
<ul>
<li><strong>Branded house</strong> — một thương hiệu mẹ trên mọi thứ (Google Maps, Google Drive; FedEx).</li>
<li><strong>House of brands</strong> — các thương hiệu độc lập dưới một mẹ ẩn (P&amp;G: Tide, Gillette, Pampers).</li>
<li><strong>Endorsed / sub-brand</strong> — pha trộn (Marriott → Courtyard by Marriott).</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thực</span> <strong>Unilever</strong> theo mô hình house of brands (Dove, Knorr, Lifebuoy) — mỗi thương hiệu nói với phân khúc riêng, một cái vấp hiếm khi kéo cả nhóm xuống.</div>`,
  ]]);

const c6q = quiz('bra201-quiz-6', 'Quiz 6 — Extension & architecture|||Quiz 6 — Mở rộng & kiến trúc', [
  { id: 'q1', question: 'Coke → Coke Zero là loại mở rộng nào?', options: ['Category extension', 'Line extension (cùng nhóm ngành)', 'Co-branding', 'Rebranding'], correctIndex: 1, explanation: 'Cùng nhóm ngành (nước ngọt) → line extension.' },
  { id: 'q2', question: 'P&G với Tide, Gillette, Pampers là mô hình kiến trúc nào?', options: ['Branded house', 'House of brands (thương hiệu độc lập, mẹ ẩn)', 'Sub-brand', 'Không có kiến trúc'], correctIndex: 1, explanation: 'Nhiều thương hiệu độc lập dưới một công ty mẹ ẩn = house of brands.' },
  { id: 'q3', question: 'Rủi ro lớn khi mở rộng thương hiệu sai là?', options: ['Tăng nhận biết', 'Brand dilution — pha loãng/làm nhoè ý nghĩa thương hiệu', 'Giảm chi phí', 'Tăng lòng trung thành'], correctIndex: 1, explanation: 'Mở rộng dở gây pha loãng, làm mờ ý nghĩa của thương hiệu mẹ.' },
]);

const c7 = doc('bra201-7-1-brand-measurement', '7.1 — Measuring brand health|||7.1 — Đo lường sức khoẻ thương hiệu',
  'Brand audit (inventory + exploratory); brand tracking (awareness/associations/NPS...); brand valuation (Interbrand approach).',
  [[
    `<span class="eyebrow">BRA201 · Chapter 7 · Lesson 7.1</span>
<h2>Measuring brand health</h2>
<h3>Brand audit</h3>
<p>A <strong>brand audit</strong> is a periodic health check with two parts: a <strong>brand inventory</strong> (what marketing actually puts out — all elements, messaging, touchpoints) and a <strong>brand exploratory</strong> (what customers really think and feel, via research).</p>
<h3>Brand tracking</h3>
<p><strong>Tracking</strong> measures the same metrics over time to catch trends:</p>
<ul>
<li><strong>Awareness</strong> — aided &amp; unaided recall, top-of-mind.</li>
<li><strong>Associations &amp; image</strong> — what attributes come to mind.</li>
<li><strong>Loyalty &amp; advocacy</strong> — repeat rate, <strong>Net Promoter Score (NPS)</strong>.</li>
</ul>
<h3>Brand valuation</h3>
<p><strong>Valuation</strong> puts a money figure on the brand. Interbrand's method blends <strong>financial performance</strong>, the <strong>role of the brand</strong> in driving choice, and <strong>brand strength</strong> (loyalty, protection). Useful for M&amp;A, licensing and board-level decisions.</p>
<div class="callout"><span class="badge">Real example</span> Interbrand's <strong>Best Global Brands</strong> values Apple and Amazon in the hundreds of billions — evidence that equity is a real financial asset, not a soft idea.</div>`,
    `<span class="eyebrow">BRA201 · Chương 7 · Bài 7.1</span>
<h2>Đo lường sức khoẻ thương hiệu</h2>
<h3>Brand audit (kiểm toán thương hiệu)</h3>
<p><strong>Brand audit</strong> là cuộc khám sức khoẻ định kỳ gồm hai phần: <strong>brand inventory</strong> (những gì marketing thực sự tung ra — mọi yếu tố, thông điệp, điểm chạm) và <strong>brand exploratory</strong> (khách hàng thực sự nghĩ và cảm gì, qua nghiên cứu).</p>
<h3>Brand tracking (theo dõi thương hiệu)</h3>
<p><strong>Tracking</strong> đo cùng bộ chỉ số theo thời gian để bắt xu hướng:</p>
<ul>
<li><strong>Nhận biết</strong> — nhớ có gợi ý &amp; không gợi ý, top-of-mind.</li>
<li><strong>Liên tưởng &amp; hình ảnh</strong> — những thuộc tính nảy ra trong đầu.</li>
<li><strong>Trung thành &amp; ủng hộ</strong> — tỉ lệ mua lại, <strong>Net Promoter Score (NPS)</strong>.</li>
</ul>
<h3>Brand valuation (định giá thương hiệu)</h3>
<p><strong>Định giá</strong> quy thương hiệu ra con số tiền. Phương pháp Interbrand kết hợp <strong>hiệu quả tài chính</strong>, <strong>vai trò của thương hiệu</strong> trong quyết định chọn mua, và <strong>sức mạnh thương hiệu</strong> (trung thành, bảo hộ). Hữu ích cho M&amp;A, cấp phép và quyết định cấp hội đồng.</p>
<div class="callout"><span class="badge">Ví dụ thực</span> Bảng <strong>Best Global Brands</strong> của Interbrand định giá Apple, Amazon ở mức hàng trăm tỉ đô — bằng chứng tài sản thương hiệu là tài sản tài chính thật, không phải ý niệm mơ hồ.</div>`,
  ]]);

const c7q = quiz('bra201-quiz-7', 'Quiz 7 — Measurement|||Quiz 7 — Đo lường', [
  { id: 'q1', question: 'Brand audit gồm hai phần nào?', options: ['Quảng cáo & khuyến mãi', 'Brand inventory (marketing tung ra) & brand exploratory (khách nghĩ gì)', 'Giá & khối lượng', 'Logo & slogan'], correctIndex: 1, explanation: 'Audit = inventory (đang làm gì) + exploratory (khách hàng cảm nhận thế nào).' },
  { id: 'q2', question: 'NPS (Net Promoter Score) đo điều gì?', options: ['Chi phí quảng cáo', 'Mức độ khách sẵn sàng giới thiệu/ủng hộ thương hiệu', 'Số nhân viên', 'Giá cổ phiếu'], correctIndex: 1, explanation: 'NPS đo lòng trung thành/khả năng khách giới thiệu thương hiệu cho người khác.' },
  { id: 'q3', question: 'Phương pháp định giá thương hiệu của Interbrand KHÔNG dựa trên?', options: ['Hiệu quả tài chính', 'Vai trò của thương hiệu trong quyết định mua', 'Sức mạnh thương hiệu (trung thành, bảo hộ)', 'Màu logo đẹp hay xấu'], correctIndex: 3, explanation: 'Interbrand kết hợp tài chính + vai trò thương hiệu + sức mạnh thương hiệu, không dựa vào thẩm mỹ logo.' },
]);

const c8 = doc('bra201-8-1-digital-branding', '8.1 — Digital branding & trends|||8.1 — Thương hiệu số & xu hướng',
  'Social media branding, content & influencer; brand community; brand purpose/ESG; xu hướng cá nhân hoá & AI.',
  [[
    `<span class="eyebrow">BRA201 · Chapter 8 · Lesson 8.1</span>
<h2>Digital branding &amp; trends</h2>
<h3>Branding in the social era</h3>
<p>Digital shifts the brand from a monologue to a <strong>dialogue</strong>. Customers co-create meaning through reviews, memes and shares. Winning here means valuable <strong>content</strong>, credible <strong>influencer/creator</strong> partnerships, and fast, human <strong>social response</strong>.</p>
<h3>Brand community</h3>
<p>A <strong>brand community</strong> is a group of engaged customers bonded by the brand (LEGO Ideas, Apple user groups, Xiaomi fans). Communities deepen resonance and turn customers into advocates and co-innovators.</p>
<h3>Brand purpose &amp; ESG</h3>
<p>Modern brands increasingly stand for something beyond profit — a <strong>purpose</strong> and <strong>ESG</strong> stance (environment, social, governance). Done authentically it builds trust; done as a slogan it invites accusations of "greenwashing".</p>
<h3>Where it's heading</h3>
<ul>
<li><strong>Personalisation &amp; AI</strong> — tailored content and service at scale.</li>
<li><strong>Creator economy &amp; short video</strong> — brands built on TikTok/Reels.</li>
<li><strong>Data ethics &amp; trust</strong> — privacy becomes part of the brand promise.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> <strong>Patagonia</strong> ties its brand to environmental purpose ("Don't buy this jacket", donating profits) — turning values into deep loyalty rather than a cheap slogan.</div>`,
    `<span class="eyebrow">BRA201 · Chương 8 · Bài 8.1</span>
<h2>Thương hiệu số &amp; xu hướng</h2>
<h3>Làm thương hiệu thời mạng xã hội</h3>
<p>Kỹ thuật số biến thương hiệu từ độc thoại thành <strong>đối thoại</strong>. Khách hàng cùng tạo nghĩa qua đánh giá, meme và chia sẻ. Thắng ở đây nghĩa là <strong>nội dung</strong> có giá trị, hợp tác <strong>KOL/creator</strong> đáng tin, và <strong>phản hồi mạng xã hội</strong> nhanh, có tính người.</p>
<h3>Cộng đồng thương hiệu</h3>
<p><strong>Brand community</strong> là nhóm khách hàng gắn kết quanh thương hiệu (LEGO Ideas, hội người dùng Apple, fan Xiaomi). Cộng đồng làm sâu resonance và biến khách thành người ủng hộ, đồng sáng tạo.</p>
<h3>Brand purpose &amp; ESG</h3>
<p>Thương hiệu hiện đại ngày càng đại diện cho điều gì đó ngoài lợi nhuận — một <strong>sứ mệnh (purpose)</strong> và lập trường <strong>ESG</strong> (môi trường, xã hội, quản trị). Làm thật thì tạo niềm tin; làm kiểu khẩu hiệu thì bị tố "tẩy xanh" (greenwashing).</p>
<h3>Xu hướng sắp tới</h3>
<ul>
<li><strong>Cá nhân hoá &amp; AI</strong> — nội dung, dịch vụ may đo ở quy mô lớn.</li>
<li><strong>Kinh tế creator &amp; video ngắn</strong> — thương hiệu dựng trên TikTok/Reels.</li>
<li><strong>Đạo đức dữ liệu &amp; niềm tin</strong> — quyền riêng tư thành một phần của lời hứa thương hiệu.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thực</span> <strong>Patagonia</strong> gắn thương hiệu với sứ mệnh môi trường ("Đừng mua chiếc áo này", trích lợi nhuận từ thiện) — biến giá trị thành lòng trung thành sâu, không phải khẩu hiệu rẻ tiền.</div>`,
  ]]);

const c8q = quiz('bra201-quiz-8', 'Quiz 8 — Digital & trends|||Quiz 8 — Thương hiệu số & xu hướng', [
  { id: 'q1', question: 'Điểm khác biệt lớn nhất của branding thời số so với truyền thống?', options: ['Không cần logo', 'Chuyển từ độc thoại sang đối thoại, khách cùng tạo nghĩa', 'Chỉ dùng TV', 'Không đo lường được'], correctIndex: 1, explanation: 'Digital biến thương hiệu thành đối thoại hai chiều, khách hàng đồng sáng tạo.' },
  { id: 'q2', question: '"Greenwashing" là?', options: ['Làm ESG thật, minh bạch', 'Giả vờ có trách nhiệm môi trường như khẩu hiệu mà không làm thật', 'Đổi logo sang màu xanh', 'Một kênh phân phối'], correctIndex: 1, explanation: 'Greenwashing = tuyên bố xanh/ESG kiểu khẩu hiệu mà không thực chất → mất niềm tin.' },
  { id: 'q3', question: '"Brand community" mang lại giá trị chính là?', options: ['Giảm giá bán', 'Làm sâu resonance, biến khách thành người ủng hộ & đồng sáng tạo', 'Thay thế bộ phận kế toán', 'Xoá bỏ nhu cầu quảng cáo'], correctIndex: 1, explanation: 'Cộng đồng làm sâu gắn kết (resonance) và tạo advocate/đồng sáng tạo.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'BRA201',
    slug: 'bra201-introduction-to-brand-management',
    title: 'Introduction to Brand Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BRA201.webp',
    shortDescription: 'What a brand is & how to manage it — brand equity (Keller CBBE), positioning (POP/POD, mantra), identity (elements, prism), IMC, extension & architecture, brand audit/valuation, digital branding & ESG. Bilingual, real brands (Apple/Nike/Coca-Cola), quizzes.|||Thương hiệu là gì & quản trị thế nào — tài sản (CBBE), định vị (POP/POD, mantra), nhận diện, IMC, mở rộng & kiến trúc, đo lường & định giá, thương hiệu số & ESG. Song ngữ, thương hiệu thật, có quiz.',
    description: 'Môn <strong>BRA201 — Introduction to Brand Management</strong> (Nhập môn Quản trị thương hiệu, ngành Truyền thông, Kỳ 2) giúp hiểu <strong>thương hiệu là gì và quản trị ra sao</strong>. Từ <strong>nền tảng</strong> (brand vs product, vai trò) → <strong>tài sản thương hiệu</strong> (mô hình CBBE của Keller) → <strong>định vị</strong> (POP/POD, brand mantra) → <strong>nhận diện</strong> (brand elements, identity prism) → <strong>truyền thông tích hợp (IMC)</strong> → <strong>mở rộng &amp; kiến trúc</strong> → <strong>đo lường (brand audit, tracking, valuation)</strong> → <strong>thương hiệu số &amp; ESG</strong>. Khung bám sách chuẩn quốc tế (Keller, Aaker, Kotler), song ngữ, ví dụ thương hiệu thật (Apple, Nike, Coca-Cola, Vinamilk), quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa thương hiệu & brand vs product; brand equity và tháp CBBE của Keller (salience/performance/imagery/judgments/feelings/resonance); định vị (frame of reference, POP/POD, brand mantra, positioning statement); brand elements & tiêu chí chọn, identity prism của Kapferer; IMC & brand touchpoints dọc hành trình; mở rộng thương hiệu (line/category, dilution) & kiến trúc (branded house vs house of brands); brand audit, brand tracking (awareness/NPS), brand valuation (Interbrand); thương hiệu số, brand community, brand purpose/ESG & xu hướng.',
    requirements: 'Không cần kiến thức nền chuyên sâu. Nên có hiểu biết cơ bản về marketing (4P) và sẵn sàng quan sát các thương hiệu quanh mình để phân tích.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chính (Keller, Aaker, Kotler), HBR, Interbrand, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thương hiệu là gì, vì sao quan trọng, chuẩn đầu ra, cơ cấu điểm.', lessons: [intro] },
    { title: 'Chương 1 — Thương hiệu & quản trị|||Chapter 1 — Brand & management', description: 'Định nghĩa, vai trò, brand vs product.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tài sản thương hiệu|||Chapter 2 — Brand equity', description: 'CBBE của Keller, brand value.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Định vị thương hiệu|||Chapter 3 — Positioning', description: 'POP/POD, brand mantra, positioning statement.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Nhận diện thương hiệu|||Chapter 4 — Brand identity', description: 'Brand elements, identity prism.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Truyền thông tích hợp (IMC)|||Chapter 5 — IMC', description: 'IMC, touchpoints, hành trình.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mở rộng & kiến trúc|||Chapter 6 — Extension & architecture', description: 'Brand extension, architecture, portfolio.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đo lường sức khoẻ|||Chapter 7 — Brand measurement', description: 'Brand audit, tracking, valuation.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Thương hiệu số & xu hướng|||Chapter 8 — Digital & trends', description: 'Social branding, community, purpose/ESG.', lessons: [c8, c8q] },
  ],
};
