/**
 * ADP301 — Packaging Design (Thiết kế bao bì). Ngành Thiết kế mỹ thuật số FPTU,
 * Kỳ 7. Giáo trình chuẩn quốc tế: Klimchuk & Krasovec "Packaging Design:
 * Successful Product Branding" + "The Packaging Designer's Book of Patterns";
 * tham khảo Dieline, Pentawards. 8 chương, song ngữ + ví dụ thương hiệu thật.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick/${ trong HTML;
 * "&"→"&amp;" trong content HTML. doc content .join('\n') ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

/* ── Materials hub ──────────────────────────────────────────────────────── */
const taiLieu = doc('adp301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Klimchuk & Krasovec, Book of Patterns), Dieline, Pentawards, công cụ dựng dieline & mockup, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">ADP301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>packaging design</strong> — from its protect/communicate/sell roles through structure, branding, typography, color, print, sustainability and a full brief-to-mockup project — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the standard books and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ADP301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Standard reference books</h3>
<ul>
<li><em>Packaging Design: Successful Product Branding from Concept to Shelf</em> — Marianne Rosner Klimchuk &amp; Sandra A. Krasovec (the core text).</li>
<li><em>The Packaging Designer's Book of Patterns</em> — a catalogue of ready dieline/structural templates.</li>
</ul>
<h3>🌐 Free / professional resources</h3>
<ul>
<li><a href="https://thedieline.com/" target="_blank" rel="noopener">The Dieline</a> — the world's leading packaging design showcase &amp; news.</li>
<li><a href="https://pentawards.com/" target="_blank" rel="noopener">Pentawards</a> — the global packaging design awards, a gallery of best practice.</li>
<li><a href="https://packagingoftheworld.com/" target="_blank" rel="noopener">Packaging of the World</a> — a large browsable case-study archive.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><strong>Adobe Illustrator</strong> — draw dielines (cut &amp; crease lines) and lay out artwork.</li>
<li><strong>Adobe Dimension</strong> / <strong>Adobe Substance</strong> — wrap the flat artwork onto a 3D box for realistic mockups.</li>
<li><a href="https://www.smashingmagazine.com/" target="_blank" rel="noopener">Free dieline template libraries</a> — start from a proven structural pattern.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what packaging is and its three jobs: protect, communicate, sell.</li>
<li><strong>Craft</strong> — dielines, materials, brand systems, typography, color, print &amp; finishing.</li>
<li><strong>Sustainability</strong> — design for recyclability, reduce material, choose eco-friendly substrates.</li>
<li><strong>Portfolio</strong> — run a real brief from concept → dieline → 3D mockup → production-ready file.</li>
</ol></div>`,
    `<span class="eyebrow">ADP301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>thiết kế bao bì</strong> — từ vai trò bảo vệ/truyền thông/bán hàng đến cấu trúc, thương hiệu, typography, màu, in ấn, bền vững và một dự án brief-đến-mockup hoàn chỉnh — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là sách chuẩn và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ADP301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo chuẩn</h3>
<ul>
<li><em>Packaging Design: Successful Product Branding from Concept to Shelf</em> — Klimchuk &amp; Krasovec (sách lõi của môn).</li>
<li><em>The Packaging Designer's Book of Patterns</em> — thư viện mẫu dieline/cấu trúc dựng sẵn.</li>
</ul>
<h3>🌐 Nguồn miễn phí / chuyên nghiệp</h3>
<ul>
<li><a href="https://thedieline.com/" target="_blank" rel="noopener">The Dieline</a> — trang trưng bày &amp; tin tức thiết kế bao bì hàng đầu thế giới.</li>
<li><a href="https://pentawards.com/" target="_blank" rel="noopener">Pentawards</a> — giải thưởng thiết kế bao bì toàn cầu, kho ví dụ chuẩn mực.</li>
<li><a href="https://packagingoftheworld.com/" target="_blank" rel="noopener">Packaging of the World</a> — kho case-study lớn, dễ duyệt.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><strong>Adobe Illustrator</strong> — vẽ dieline (đường cắt &amp; đường gấp) và dàn artwork.</li>
<li><strong>Adobe Dimension</strong> / <strong>Adobe Substance</strong> — bọc artwork phẳng lên hộp 3D để dựng mockup thật.</li>
<li><a href="https://www.smashingmagazine.com/" target="_blank" rel="noopener">Thư viện mẫu dieline miễn phí</a> — bắt đầu từ một mẫu cấu trúc đã kiểm chứng.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — bao bì là gì và ba nhiệm vụ: bảo vệ, truyền thông, bán hàng.</li>
<li><strong>Tay nghề</strong> — dieline, vật liệu, hệ nhận diện, typography, màu, in &amp; hoàn thiện.</li>
<li><strong>Bền vững</strong> — thiết kế để tái chế được, giảm vật liệu, chọn chất liệu thân thiện.</li>
<li><strong>Portfolio</strong> — chạy một brief thật từ ý tưởng → dieline → mockup 3D → file sẵn sàng in.</li>
</ol></div>`,
  ]]);

/* ── Intro ──────────────────────────────────────────────────────────────── */
const intro = doc('adp301-0-1-overview', 'Course overview: Packaging design|||Tổng quan: Thiết kế bao bì',
  'Bao bì làm gì (bảo vệ, truyền thông, bán hàng); "kệ hàng là quảng cáo cuối cùng"; lộ trình: bản chất & cấu trúc → thương hiệu, chữ, màu → in & bền vững → dự án brief-đến-mockup.',
  [[
    `<span class="eyebrow">ADP301 · Lesson 0.1 · Overview</span>
<h2>Packaging Design</h2>
<p class="lead">Packaging is the <strong>silent salesman</strong>. It is the last piece of marketing a shopper meets before deciding to buy — a designed object that must <strong>protect</strong> the product, <strong>communicate</strong> what it is, and <strong>sell</strong> it off a crowded shelf, all at once.</p>
<h3>The three jobs of packaging</h3>
<ul>
<li><strong>Protect</strong> — keep the product safe from damage, moisture, light and tampering, from factory to home.</li>
<li><strong>Communicate</strong> — tell the shopper the brand, the contents, the benefit and the legally required facts.</li>
<li><strong>Sell</strong> — stand out on the shelf, express the brand's personality and win the buy in a few seconds.</li>
</ul>
<h3>Roadmap</h3>
<p>What packaging is &amp; its structure/materials (dielines) → brand identity, typography &amp; the mandatory info → color &amp; imagery → print &amp; finishing → sustainable/eco design → a full project from <strong>brief → dieline → 3D mockup → production</strong>. Bilingual, with real brands (Coca-Cola, Apple, Tiki) and a quiz per chapter.</p>
<div class="callout"><span class="badge">Concept to shelf</span> This course follows the classic Klimchuk &amp; Krasovec arc — from strategy and structure to the finished object a customer holds.</div>`,
    `<span class="eyebrow">ADP301 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế bao bì</h2>
<p class="lead">Bao bì là <strong>người bán hàng thầm lặng</strong>. Nó là mẩu marketing cuối cùng người mua gặp trước khi quyết định mua — một vật được thiết kế phải cùng lúc <strong>bảo vệ</strong> sản phẩm, <strong>truyền thông</strong> nó là gì, và <strong>bán</strong> được trên một cái kệ chật chội.</p>
<h3>Ba nhiệm vụ của bao bì</h3>
<ul>
<li><strong>Bảo vệ</strong> — giữ sản phẩm an toàn khỏi va đập, ẩm, ánh sáng và bị mở trộm, từ nhà máy về đến nhà.</li>
<li><strong>Truyền thông</strong> — cho người mua biết thương hiệu, thành phần, lợi ích và thông tin bắt buộc theo luật.</li>
<li><strong>Bán hàng</strong> — nổi bật trên kệ, thể hiện cá tính thương hiệu và chốt đơn trong vài giây.</li>
</ul>
<h3>Lộ trình</h3>
<p>Bao bì là gì &amp; cấu trúc/vật liệu (dieline) → nhận diện thương hiệu, typography &amp; thông tin bắt buộc → màu &amp; hình ảnh → in &amp; hoàn thiện → thiết kế bền vững/eco → một dự án hoàn chỉnh từ <strong>brief → dieline → mockup 3D → sản xuất</strong>. Song ngữ, có thương hiệu thật (Coca-Cola, Apple, Tiki) và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Từ ý tưởng đến kệ hàng</span> Môn này đi theo cung chuẩn của Klimchuk &amp; Krasovec — từ chiến lược và cấu trúc đến chính vật phẩm người dùng cầm trên tay.</div>`,
  ]]);

/* ── Chapter 1 ──────────────────────────────────────────────────────────── */
const c1 = doc('adp301-1-1-what-is-packaging', '1.1 — What is packaging design|||1.1 — Thiết kế bao bì là gì',
  'Định nghĩa; ba chức năng (bảo vệ / truyền thông / bán hàng); bao bì là điểm chạm thương hiệu; primary/secondary/tertiary packaging.',
  [[
    `<span class="eyebrow">ADP301 · Chapter 1 · Lesson 1.1</span>
<h2>What is packaging design?</h2>
<p><strong>Packaging design</strong> is the discipline of shaping the form and the visuals of a container so it protects a product, carries its brand and information, and persuades a shopper to choose it. It sits where <em>industrial design</em>, <em>graphic design</em> and <em>marketing</em> meet.</p>
<h3>Three functions, always at once</h3>
<ul>
<li><strong>Protection</strong> — the engineering job: survive stacking, shipping, moisture and shelf life.</li>
<li><strong>Communication</strong> — the graphic job: brand, product name, benefit, usage and legal facts.</li>
<li><strong>Selling</strong> — the marketing job: attract, differentiate and convert at the shelf.</li>
</ul>
<h3>Levels of packaging</h3>
<ul>
<li><strong>Primary</strong> — touches the product (the drink bottle, the tube of cream).</li>
<li><strong>Secondary</strong> — groups primaries (the carton around six bottles).</li>
<li><strong>Tertiary</strong> — moves them in bulk (the shipping case &amp; pallet).</li>
</ul>
<h3>Packaging is a brand touchpoint</h3>
<p>A pack a customer holds for weeks does more brand-building than any ad. <strong>Coca-Cola's contour bottle</strong> is recognisable even in the dark — the package itself became the brand.</p>
<div class="callout"><span class="badge">Key idea</span> Good packaging is never "just a box". It is the product's face, its shield and its salesman, judged in the two seconds a shopper looks at the shelf.</div>`,
    `<span class="eyebrow">ADP301 · Chương 1 · Bài 1.1</span>
<h2>Thiết kế bao bì là gì?</h2>
<p><strong>Thiết kế bao bì</strong> là ngành tạo hình dáng và hình ảnh cho vật chứa sao cho nó bảo vệ sản phẩm, mang thương hiệu cùng thông tin, và thuyết phục người mua chọn nó. Nó nằm ở chỗ gặp nhau của <em>thiết kế công nghiệp</em>, <em>thiết kế đồ hoạ</em> và <em>marketing</em>.</p>
<h3>Ba chức năng, luôn cùng lúc</h3>
<ul>
<li><strong>Bảo vệ</strong> — phần kỹ thuật: chịu được xếp chồng, vận chuyển, ẩm và hạn dùng.</li>
<li><strong>Truyền thông</strong> — phần đồ hoạ: thương hiệu, tên sản phẩm, lợi ích, cách dùng và thông tin pháp lý.</li>
<li><strong>Bán hàng</strong> — phần marketing: thu hút, khác biệt hoá và chuyển đổi ngay tại kệ.</li>
</ul>
<h3>Các cấp bao bì</h3>
<ul>
<li><strong>Sơ cấp (primary)</strong> — chạm trực tiếp sản phẩm (chai nước, tuýp kem).</li>
<li><strong>Thứ cấp (secondary)</strong> — gom các gói sơ cấp (thùng carton quanh sáu chai).</li>
<li><strong>Cấp ba (tertiary)</strong> — vận chuyển số lượng lớn (kiện hàng &amp; pallet).</li>
</ul>
<h3>Bao bì là một điểm chạm thương hiệu</h3>
<p>Cái gói người dùng cầm hàng tuần xây thương hiệu hơn bất kỳ quảng cáo nào. <strong>Chai contour của Coca-Cola</strong> nhận ra được cả trong bóng tối — chính cái bao bì đã trở thành thương hiệu.</p>
<div class="callout"><span class="badge">Ý chính</span> Bao bì tốt không bao giờ chỉ là "cái hộp". Nó là gương mặt, tấm khiên và người bán hàng của sản phẩm, bị chấm điểm trong hai giây người mua nhìn lên kệ.</div>`,
  ]]);

const c1q = quiz('adp301-quiz-1', 'Quiz 1 — What is packaging|||Quiz 1 — Bao bì là gì', [
  { id: 'q1', question: 'Ba chức năng cốt lõi của bao bì là?', options: ['Bảo vệ, truyền thông, bán hàng', 'In, gấp, dán', 'Nặng, bền, rẻ', 'Đỏ, xanh, vàng'], correctIndex: 0, explanation: 'Bao bì cùng lúc bảo vệ sản phẩm, truyền thông thông tin/thương hiệu và bán hàng trên kệ.' },
  { id: 'q2', question: 'Bao bì "sơ cấp" (primary packaging) là loại?', options: ['Thùng chở hàng trên pallet', 'Carton gom nhiều chai', 'Lớp chạm trực tiếp sản phẩm (chai, tuýp)', 'Nhãn dán ngoài kiện'], correctIndex: 2, explanation: 'Primary là lớp tiếp xúc trực tiếp sản phẩm; secondary gom nhóm; tertiary để vận chuyển.' },
  { id: 'q3', question: 'Vì sao nói bao bì là một "điểm chạm thương hiệu"?', options: ['Vì nó luôn màu trắng', 'Vì người dùng cầm/nhìn nó lâu, nó xây nhận diện hơn cả quảng cáo', 'Vì nó rẻ hơn quảng cáo TV', 'Vì luật bắt phải in logo'], correctIndex: 1, explanation: 'Vật người dùng giữ hàng tuần (vd chai Coca-Cola) xây thương hiệu mạnh — bao bì chính là gương mặt sản phẩm.' },
]);

/* ── Chapter 2 ──────────────────────────────────────────────────────────── */
const c2 = doc('adp301-2-1-structure-materials', '2.1 — Structure & materials|||2.1 — Cấu trúc & vật liệu',
  'Structural design; giấy/bìa, nhựa, thuỷ tinh, kim loại; dieline (đường cắt/gấp/dán); gấp hộp (folding carton); chọn vật liệu theo sản phẩm.',
  [[
    `<span class="eyebrow">ADP301 · Chapter 2 · Lesson 2.1</span>
<h2>Structure &amp; materials</h2>
<p><strong>Structural design</strong> is the 3D form — before any graphics, the pack must exist as an object that holds, protects and opens well. It starts flat, as a <strong>dieline</strong>.</p>
<h3>The dieline</h3>
<p>A <strong>dieline</strong> is the flat 2D blueprint of the unfolded pack. Convention: <strong>solid lines = cut</strong>, <strong>dashed lines = crease/fold</strong>, plus glue tabs. Artwork is laid onto the dieline so that, once cut and folded, every panel lands in the right place.</p>
<pre><code>Folding carton dieline (simplified):
  --- cut line (outline)
  ...  crease/fold line
  [glue tab] on one edge
  Front | Right | Back | Left  (four side panels)
  + top &amp; bottom closure flaps
</code></pre>
<h3>The four main substrates</h3>
<ul>
<li><strong>Paper / paperboard</strong> — cheap, printable, recyclable; folding cartons, corrugated boxes.</li>
<li><strong>Plastic</strong> — light, moldable, water-proof; bottles, tubs, films (but a recyclability challenge).</li>
<li><strong>Glass</strong> — premium, inert, endlessly recyclable, but heavy &amp; breakable; spirits, cosmetics.</li>
<li><strong>Metal</strong> — strong, barrier to light/air; cans, aerosol, tins.</li>
</ul>
<div class="callout"><span class="badge">Match material to job</span> A fizzy drink needs a pressure-tight can or PET bottle; a perfume signals luxury with heavy glass; cereal ships cheaply in a printed folding carton.</div>`,
    `<span class="eyebrow">ADP301 · Chương 2 · Bài 2.1</span>
<h2>Cấu trúc &amp; vật liệu</h2>
<p><strong>Thiết kế cấu trúc (structural design)</strong> là phần hình khối 3D — trước mọi đồ hoạ, cái gói phải tồn tại như một vật chứa được, bảo vệ được và mở tốt. Nó bắt đầu ở dạng phẳng, là một <strong>dieline</strong>.</p>
<h3>Dieline (khuôn bế)</h3>
<p><strong>Dieline</strong> là bản vẽ phẳng 2D của cái gói khi trải ra. Quy ước: <strong>nét liền = đường cắt</strong>, <strong>nét đứt = đường gấp/cấn</strong>, cùng các tai dán keo. Artwork được đặt lên dieline sao cho khi cắt và gấp xong, mỗi mặt rơi đúng vị trí.</p>
<pre><code>Dieline hộp gấp (rút gọn):
  --- đường cắt (viền ngoài)
  ...  đường gấp/cấn
  [tai dán keo] ở một cạnh
  Mặt trước | phải | sau | trái  (bốn mặt bên)
  + nắp gập trên &amp; dưới
</code></pre>
<h3>Bốn nhóm vật liệu chính</h3>
<ul>
<li><strong>Giấy / bìa carton</strong> — rẻ, in đẹp, tái chế được; hộp gấp, thùng sóng.</li>
<li><strong>Nhựa</strong> — nhẹ, dễ tạo hình, chống nước; chai, hũ, màng (nhưng khó tái chế).</li>
<li><strong>Thuỷ tinh</strong> — cao cấp, trơ, tái chế vô hạn, nhưng nặng &amp; dễ vỡ; rượu, mỹ phẩm.</li>
<li><strong>Kim loại</strong> — chắc, chắn sáng/khí; lon, bình xịt, hộp thiếc.</li>
</ul>
<div class="callout"><span class="badge">Vật liệu phải khớp nhiệm vụ</span> Nước có ga cần lon chịu áp hoặc chai PET; nước hoa dùng thuỷ tinh nặng để báo hiệu sang; ngũ cốc đi rẻ trong hộp gấp in sẵn.</div>`,
  ]]);

const c2q = quiz('adp301-quiz-2', 'Quiz 2 — Structure & materials|||Quiz 2 — Cấu trúc & vật liệu', [
  { id: 'q1', question: 'Trên một dieline, nét ĐỨT (dashed) thường chỉ?', options: ['Đường cắt rời', 'Đường gấp/cấn (crease/fold)', 'Vùng in màu', 'Mã vạch'], correctIndex: 1, explanation: 'Quy ước: nét liền = cắt, nét đứt = gấp/cấn; cộng thêm tai dán keo.' },
  { id: 'q2', question: 'Vật liệu nào TRƠ, tái chế gần như vô hạn nhưng nặng và dễ vỡ, hay dùng cho nước hoa/rượu?', options: ['Nhựa PET', 'Bìa carton', 'Thuỷ tinh', 'Nhôm'], correctIndex: 2, explanation: 'Thuỷ tinh trơ và tái chế vô hạn, tạo cảm giác cao cấp, nhưng nặng và dễ vỡ.' },
  { id: 'q3', question: '"Structural design" trong bao bì nói về?', options: ['Chọn font chữ', 'Hình khối 3D & cách gói chứa/bảo vệ/mở', 'Bảng màu thương hiệu', 'Nội dung nhãn'], correctIndex: 1, explanation: 'Structural design là phần cấu trúc/hình khối — cái gói tồn tại như một vật thể trước khi thêm đồ hoạ.' },
]);

/* ── Chapter 3 ──────────────────────────────────────────────────────────── */
const c3 = doc('adp301-3-1-brand-on-pack', '3.1 — Brand identity on packaging|||3.1 — Thương hiệu trên bao bì',
  'Brand identity, logo & vị trí; hệ thống nhận diện đồng bộ cả dòng sản phẩm; shelf impact (sức hút trên kệ); nhất quán từ chai đến thùng.',
  [[
    `<span class="eyebrow">ADP301 · Chapter 3 · Lesson 3.1</span>
<h2>Brand identity on packaging</h2>
<p>The pack is where a brand becomes physical. It must carry the <strong>brand identity</strong> — the logo, colors, shapes and voice — consistently, so the shopper recognises it instantly.</p>
<h3>Building blocks</h3>
<ul>
<li><strong>Logo &amp; brandmark</strong> — placed with a clear focal point; usually top or center of the main display panel.</li>
<li><strong>Color &amp; shape system</strong> — the recognisable "brand block" (Coca-Cola red, the ribbon).</li>
<li><strong>Identity system across a line</strong> — many SKUs (flavors, sizes) share a template but vary one element (a color band) so they read as a family yet stay distinct.</li>
</ul>
<h3>Shelf impact</h3>
<p><strong>Shelf impact</strong> is how strongly a pack grabs attention among dozens of competitors. It depends on contrast, a clear brand block, and a design that repeats to build a "billboard" when products stand side by side (facings). Test a design <em>at shelf distance</em>, not just up close.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Apple's</strong> white, minimal, tightly-kerned boxes read as premium from across a store — the restraint IS the identity. A Vietnamese shopper spots <strong>Tiki's</strong> blue tape/boxes the same way.</div>`,
    `<span class="eyebrow">ADP301 · Chương 3 · Bài 3.1</span>
<h2>Thương hiệu trên bao bì</h2>
<p>Bao bì là nơi thương hiệu trở thành vật thể. Nó phải mang <strong>hệ nhận diện thương hiệu</strong> — logo, màu, hình khối và giọng điệu — một cách nhất quán, để người mua nhận ra tức thì.</p>
<h3>Các khối dựng</h3>
<ul>
<li><strong>Logo &amp; dấu hiệu thương hiệu</strong> — đặt có điểm nhấn rõ; thường ở trên hoặc giữa mặt trưng bày chính.</li>
<li><strong>Hệ màu &amp; hình khối</strong> — "khối thương hiệu" dễ nhận (đỏ Coca-Cola, dải ruy-băng).</li>
<li><strong>Hệ nhận diện xuyên suốt cả dòng</strong> — nhiều SKU (vị, dung tích) chung một khuôn nhưng đổi một yếu tố (dải màu) để vừa là một gia đình vừa phân biệt được.</li>
</ul>
<h3>Sức hút trên kệ (shelf impact)</h3>
<p><strong>Shelf impact</strong> là mức độ một cái gói giành được sự chú ý giữa hàng chục đối thủ. Nó phụ thuộc vào độ tương phản, một khối thương hiệu rõ, và thiết kế lặp lại tạo thành "billboard" khi nhiều sản phẩm đứng cạnh nhau (facing). Hãy kiểm thiết kế <em>ở khoảng cách nhìn kệ</em>, không chỉ nhìn gần.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Hộp trắng, tối giản, khoảng chữ chặt của <strong>Apple</strong> toát vẻ cao cấp từ đầu kia cửa hàng — chính sự tiết chế LÀ nhận diện. Người Việt nhận ra hộp/băng keo xanh của <strong>Tiki</strong> theo đúng cách đó.</div>`,
  ]]);

const c3q = quiz('adp301-quiz-3', 'Quiz 3 — Brand on packaging|||Quiz 3 — Thương hiệu trên bao bì', [
  { id: 'q1', question: '"Shelf impact" nghĩa là?', options: ['Độ bền khi rơi khỏi kệ', 'Mức độ gói hàng giành chú ý giữa nhiều đối thủ trên kệ', 'Chi phí thuê kệ', 'Số kệ trong siêu thị'], correctIndex: 1, explanation: 'Shelf impact = sức hút/độ nổi bật của bao bì giữa hàng chục sản phẩm cạnh tranh.' },
  { id: 'q2', question: 'Vì sao các SKU khác nhau (vị, dung tích) của một dòng nên dùng chung khuôn và chỉ đổi một yếu tố?', options: ['Để tiết kiệm mực', 'Để trông như một gia đình mà vẫn phân biệt được', 'Vì luật yêu cầu', 'Để giấu logo'], correctIndex: 1, explanation: 'Hệ nhận diện đồng bộ giúp cả dòng đọc thành một "gia đình" nhưng mỗi biến thể vẫn khác nhau (vd đổi dải màu).' },
  { id: 'q3', question: 'Bài học từ bao bì của Apple là?', options: ['Càng nhiều chi tiết càng sang', 'Sự tiết chế/tối giản có thể chính là nhận diện thương hiệu', 'Phải in bằng nhũ vàng', 'Màu càng chói càng tốt'], correctIndex: 1, explanation: 'Hộp trắng tối giản của Apple cho thấy sự tiết chế có thể là bản sắc thương hiệu, nhận ra từ xa.' },
]);

/* ── Chapter 4 ──────────────────────────────────────────────────────────── */
const c4 = doc('adp301-4-1-typography-info', '4.1 — Typography & information|||4.1 — Typography & thông tin',
  'Chữ trên bao bì; phân cấp thị giác (hierarchy); thông tin bắt buộc (tên, khối lượng, thành phần, HSD, mã vạch); nhãn & khả năng đọc trên bề mặt cong.',
  [[
    `<span class="eyebrow">ADP301 · Chapter 4 · Lesson 4.1</span>
<h2>Typography &amp; information</h2>
<p>A pack is a tiny, crowded, often curved canvas that must still be <strong>legible in a split second</strong>. Typography organises what the shopper reads first, second and last.</p>
<h3>Visual hierarchy</h3>
<ol>
<li><strong>Brand / product name</strong> — biggest, read from across the aisle.</li>
<li><strong>Key benefit / variant</strong> — the reason to buy (flavor, "sugar-free").</li>
<li><strong>Supporting &amp; legal text</strong> — smallest: ingredients, instructions, net weight.</li>
</ol>
<h3>Mandatory information</h3>
<p>Regulators require specific facts on food/consumer packs — commonly: <strong>product name, net quantity/weight, ingredients, manufacturer &amp; origin, best-before/expiry date, batch code and a barcode</strong>. In Vietnam a <strong>nhãn phụ</strong> (secondary label in Vietnamese) is required on imported goods.</p>
<div class="callout"><span class="badge">Legibility rules</span> Keep enough contrast between type and background; avoid tiny type on curved or reflective surfaces; and never let decoration hide the legally required facts.</div>`,
    `<span class="eyebrow">ADP301 · Chương 4 · Bài 4.1</span>
<h2>Typography &amp; thông tin</h2>
<p>Bao bì là một khung vẽ nhỏ, chật, thường cong, mà vẫn phải <strong>đọc được trong tích tắc</strong>. Typography sắp xếp thứ người mua đọc trước, đọc sau và đọc cuối.</p>
<h3>Phân cấp thị giác (hierarchy)</h3>
<ol>
<li><strong>Tên thương hiệu / sản phẩm</strong> — lớn nhất, đọc được từ cuối lối đi.</li>
<li><strong>Lợi ích / biến thể chính</strong> — lý do mua (vị, "không đường").</li>
<li><strong>Chữ phụ &amp; pháp lý</strong> — nhỏ nhất: thành phần, hướng dẫn, khối lượng tịnh.</li>
</ol>
<h3>Thông tin bắt buộc</h3>
<p>Cơ quan quản lý yêu cầu một số thông tin trên bao bì thực phẩm/hàng tiêu dùng — thường gồm: <strong>tên sản phẩm, khối lượng/dung tích tịnh, thành phần, nhà sản xuất &amp; xuất xứ, hạn sử dụng, mã lô và mã vạch</strong>. Ở Việt Nam, hàng nhập khẩu bắt buộc có <strong>nhãn phụ</strong> tiếng Việt.</p>
<div class="callout"><span class="badge">Quy tắc dễ đọc</span> Giữ đủ tương phản giữa chữ và nền; tránh chữ quá nhỏ trên bề mặt cong hoặc bóng; và đừng bao giờ để trang trí che mất thông tin bắt buộc.</div>`,
  ]]);

const c4q = quiz('adp301-quiz-4', 'Quiz 4 — Typography & info|||Quiz 4 — Chữ & thông tin', [
  { id: 'q1', question: 'Trong phân cấp thị giác của bao bì, yếu tố nào thường LỚN nhất?', options: ['Bảng thành phần', 'Tên thương hiệu / sản phẩm', 'Mã vạch', 'Địa chỉ nhà sản xuất'], correctIndex: 1, explanation: 'Tên thương hiệu/sản phẩm đọc từ xa nên đặt lớn nhất; chữ pháp lý nhỏ nhất.' },
  { id: 'q2', question: 'Hàng nhập khẩu bán ở Việt Nam bắt buộc phải có?', options: ['Logo màu vàng', 'Nhãn phụ tiếng Việt', 'Chữ nổi 3D', 'Mã QR quảng cáo'], correctIndex: 1, explanation: 'Luật ghi nhãn hàng hoá yêu cầu nhãn phụ tiếng Việt trên hàng nhập khẩu.' },
  { id: 'q3', question: 'Thông tin nào KHÔNG thuộc nhóm bắt buộc thường gặp trên bao bì thực phẩm?', options: ['Khối lượng tịnh', 'Hạn sử dụng', 'Câu slogan quảng cáo yêu thích của designer', 'Thành phần'], correctIndex: 2, explanation: 'Bắt buộc gồm tên, khối lượng, thành phần, HSD, xuất xứ, mã lô, mã vạch — slogan là tuỳ chọn marketing.' },
]);

/* ── Chapter 5 ──────────────────────────────────────────────────────────── */
const c5 = doc('adp301-5-1-color-imagery', '5.1 — Color & imagery|||5.1 — Màu & hình ảnh',
  'Vai trò của màu; tâm lý màu & liên tưởng ngành hàng; hình ảnh sản phẩm (appetite appeal); dùng màu/hình để khác biệt hoá trên kệ.',
  [[
    `<span class="eyebrow">ADP301 · Chapter 5 · Lesson 5.1</span>
<h2>Color &amp; imagery</h2>
<p>Color is the fastest signal on a shelf — the eye reads it before any word. Imagery then makes the promise concrete.</p>
<h3>Color psychology (with caution)</h3>
<ul>
<li><strong>Red</strong> — energy, appetite, urgency (Coca-Cola, many snacks).</li>
<li><strong>Green</strong> — natural, healthy, organic, eco.</li>
<li><strong>Blue</strong> — trust, calm, cleanliness (water, dairy, tech).</li>
<li><strong>Black / gold</strong> — premium, luxury.</li>
</ul>
<p>Meanings are <em>cultural and category-relative</em> — test, do not assume; the same green reads "organic" on food but "budget" elsewhere.</p>
<h3>Imagery &amp; differentiation</h3>
<p>Photography of the product (<strong>appetite appeal</strong> on food) or illustration sets tone and quality. To <strong>differentiate</strong>, deliberately break the category's color convention — a brand that goes matte-black in a shelf of glossy white instantly stands apart.</p>
<div class="callout"><span class="badge">Own a color</span> Strong brands "own" a color at shelf — Coca-Cola red, Tiffany blue. Category leaders defend it; challengers use contrast to break the sea of sameness.</div>`,
    `<span class="eyebrow">ADP301 · Chương 5 · Bài 5.1</span>
<h2>Màu &amp; hình ảnh</h2>
<p>Màu là tín hiệu nhanh nhất trên kệ — mắt đọc màu trước cả chữ. Hình ảnh sau đó biến lời hứa thành cụ thể.</p>
<h3>Tâm lý màu (dùng thận trọng)</h3>
<ul>
<li><strong>Đỏ</strong> — năng lượng, kích thích ăn uống, thúc giục (Coca-Cola, nhiều đồ ăn vặt).</li>
<li><strong>Xanh lá</strong> — tự nhiên, lành mạnh, hữu cơ, eco.</li>
<li><strong>Xanh dương</strong> — tin cậy, dịu, sạch (nước, sữa, công nghệ).</li>
<li><strong>Đen / vàng kim</strong> — cao cấp, sang trọng.</li>
</ul>
<p>Ý nghĩa mang tính <em>văn hoá và tuỳ ngành hàng</em> — hãy kiểm, đừng suy đoán; cùng một màu xanh lá đọc là "hữu cơ" trên thực phẩm nhưng "rẻ tiền" ở chỗ khác.</p>
<h3>Hình ảnh &amp; khác biệt hoá</h3>
<p>Ảnh chụp sản phẩm (<strong>gợi thèm</strong> với thực phẩm) hoặc minh hoạ định ra tông và chất lượng. Muốn <strong>khác biệt</strong>, cố ý phá quy ước màu của ngành — một thương hiệu chuyển sang đen mờ giữa kệ toàn trắng bóng lập tức nổi bật.</p>
<div class="callout"><span class="badge">Sở hữu một màu</span> Thương hiệu mạnh "sở hữu" một màu trên kệ — đỏ Coca-Cola, xanh Tiffany. Kẻ dẫn đầu bảo vệ màu đó; kẻ thách thức dùng tương phản để phá biển đồng nhất.</div>`,
  ]]);

const c5q = quiz('adp301-quiz-5', 'Quiz 5 — Color & imagery|||Quiz 5 — Màu & hình ảnh', [
  { id: 'q1', question: 'Trên kệ, yếu tố nào mắt người mua thường đọc NHANH nhất?', options: ['Bảng thành phần', 'Màu sắc', 'Mã vạch', 'Chữ nhỏ pháp lý'], correctIndex: 1, explanation: 'Màu là tín hiệu nhanh nhất — mắt bắt màu trước cả khi đọc chữ.' },
  { id: 'q2', question: 'Phát biểu ĐÚNG về tâm lý màu trong bao bì?', options: ['Ý nghĩa màu là tuyệt đối, giống nhau mọi văn hoá/ngành', 'Ý nghĩa màu tuỳ văn hoá & ngành hàng, cần kiểm chứng', 'Chỉ màu đỏ mới bán được hàng', 'Màu không ảnh hưởng quyết định mua'], correctIndex: 1, explanation: 'Liên tưởng màu phụ thuộc văn hoá và ngành hàng — phải test chứ không suy đoán.' },
  { id: 'q3', question: 'Một cách khác biệt hoá trên kệ là?', options: ['Dùng đúng màu giống mọi đối thủ', 'Cố ý phá quy ước màu của ngành để nổi bật', 'Làm bao bì nhỏ nhất có thể', 'Bỏ hết hình ảnh'], correctIndex: 1, explanation: 'Phá quy ước màu (vd đen mờ giữa kệ trắng bóng) giúp tách khỏi "biển đồng nhất".' },
]);

/* ── Chapter 6 ──────────────────────────────────────────────────────────── */
const c6 = doc('adp301-6-1-print-finishing', '6.1 — Print techniques & finishing|||6.1 — Kỹ thuật in & hoàn thiện',
  'In offset & flexo (khi nào dùng cái nào); gia công sau in: cán màng, dập nổi/chìm (emboss/deboss), ép kim (foil), phủ UV/spot; chất liệu bề mặt & cảm giác cầm.',
  [[
    `<span class="eyebrow">ADP301 · Chapter 6 · Lesson 6.1</span>
<h2>Print techniques &amp; finishing</h2>
<p>A design only becomes a product through <strong>print and finishing</strong> — and the process constrains what the artwork can do, so a good designer sets up files for the chosen method.</p>
<h3>Printing methods</h3>
<ul>
<li><strong>Offset (litho)</strong> — sharp, high quality on flat paperboard; best for cartons and short-to-medium runs with fine detail.</li>
<li><strong>Flexo (flexography)</strong> — flexible plates print on films, labels, corrugated and long runs; workhorse of flexible packaging.</li>
<li><strong>Digital</strong> — no plates; great for short runs, versioning and prototypes.</li>
</ul>
<h3>Finishing (after print)</h3>
<ul>
<li><strong>Lamination / varnish</strong> — matte or gloss film that protects and sets the feel.</li>
<li><strong>Spot UV</strong> — glossy highlight on a chosen area only (logo, product shot).</li>
<li><strong>Emboss / deboss</strong> — raise or press the surface for a tactile logo.</li>
<li><strong>Foil stamping</strong> — metallic gold/silver for a premium accent.</li>
</ul>
<div class="callout"><span class="badge">Feel sells too</span> Finishing engages touch, not just sight — a soft-touch matte laminate with a spot-UV logo signals "premium" the instant a shopper picks it up.</div>`,
    `<span class="eyebrow">ADP301 · Chương 6 · Bài 6.1</span>
<h2>Kỹ thuật in &amp; hoàn thiện</h2>
<p>Một thiết kế chỉ thành sản phẩm nhờ <strong>in và gia công hoàn thiện</strong> — và quy trình in giới hạn những gì artwork làm được, nên designer giỏi phải set-up file theo đúng phương pháp in đã chọn.</p>
<h3>Phương pháp in</h3>
<ul>
<li><strong>In offset (litho)</strong> — sắc nét, chất lượng cao trên bìa phẳng; hợp hộp giấy và số lượng vừa/nhỏ có chi tiết tinh.</li>
<li><strong>In flexo</strong> — bản in mềm, in trên màng, nhãn, sóng carton và số lượng lớn; chủ lực của bao bì mềm.</li>
<li><strong>In kỹ thuật số</strong> — không cần bản kẽm; hợp số lượng ít, in nhiều phiên bản và mẫu thử.</li>
</ul>
<h3>Gia công sau in</h3>
<ul>
<li><strong>Cán màng / phủ bóng-mờ</strong> — lớp phim bảo vệ và định cảm giác bề mặt.</li>
<li><strong>Phủ UV cục bộ (spot UV)</strong> — làm bóng nổi bật chỉ một vùng chọn (logo, ảnh sản phẩm).</li>
<li><strong>Dập nổi / dập chìm (emboss/deboss)</strong> — làm nổi hoặc lõm bề mặt cho logo có cảm giác chạm.</li>
<li><strong>Ép kim (foil)</strong> — nhũ vàng/bạc ánh kim tạo điểm nhấn cao cấp.</li>
</ul>
<div class="callout"><span class="badge">Cảm giác cũng bán hàng</span> Gia công đánh vào xúc giác, không chỉ thị giác — lớp cán mờ soft-touch cùng logo phủ spot-UV báo hiệu "cao cấp" ngay khi người mua cầm lên.</div>`,
  ]]);

const c6q = quiz('adp301-quiz-6', 'Quiz 6 — Print & finishing|||Quiz 6 — In & hoàn thiện', [
  { id: 'q1', question: 'Phương pháp in nào là "chủ lực" cho bao bì mềm (màng, nhãn, sóng) & số lượng lớn?', options: ['In offset', 'In flexo (flexography)', 'In lụa thủ công', 'Vẽ tay'], correctIndex: 1, explanation: 'Flexo dùng bản in mềm, in tốt trên màng/nhãn/carton sóng ở số lượng lớn.' },
  { id: 'q2', question: '"Spot UV" là kỹ thuật?', options: ['Phủ bóng lên TOÀN bộ bề mặt', 'Làm bóng nổi bật chỉ một VÙNG chọn (logo, ảnh)', 'Dập lõm bề mặt', 'Ép nhũ vàng'], correctIndex: 1, explanation: 'Spot UV phủ bóng cục bộ một vùng để tạo điểm nhấn tương phản với nền mờ.' },
  { id: 'q3', question: 'Gia công "ép kim" (foil stamping) dùng để?', options: ['Giảm chi phí in', 'Tạo điểm nhấn ánh kim vàng/bạc cao cấp', 'Chống ẩm cho thực phẩm', 'In mã vạch'], correctIndex: 1, explanation: 'Ép kim tạo lớp nhũ kim loại vàng/bạc, thường dùng để nâng cảm giác cao cấp.' },
]);

/* ── Chapter 7 ──────────────────────────────────────────────────────────── */
const c7 = doc('adp301-7-1-sustainable', '7.1 — Sustainable packaging|||7.1 — Bao bì bền vững',
  'Vì sao bền vững; nguyên tắc Reduce/Reuse/Recycle & mono-material; vật liệu tái chế/sinh học; eco-design; tránh greenwashing.',
  [[
    `<span class="eyebrow">ADP301 · Chapter 7 · Lesson 7.1</span>
<h2>Sustainable packaging</h2>
<p>Packaging is a huge share of consumer waste, so <strong>sustainability</strong> is now a core design constraint, not an afterthought — and often a legal and brand requirement.</p>
<h3>The design principles</h3>
<ul>
<li><strong>Reduce</strong> — use less material; right-size the pack; remove needless layers.</li>
<li><strong>Reuse</strong> — refillable or repurposable formats.</li>
<li><strong>Recycle</strong> — design so it can actually be recycled: prefer <strong>mono-material</strong> (one plastic type) over hard-to-separate laminates, and make separation easy.</li>
</ul>
<h3>Materials &amp; eco-design</h3>
<ul>
<li><strong>Recycled content</strong> — rPET, recycled paperboard.</li>
<li><strong>Renewable / bio-based</strong> — molded pulp, bagasse, PLA (with caveats on composting).</li>
<li><strong>Design for disassembly</strong> — labels/adhesives that don't contaminate the recycling stream.</li>
</ul>
<div class="callout"><span class="badge">Avoid greenwashing</span> A green leaf and the word "eco" are not sustainability. Claims must be true and specific (e.g. "80% recycled paperboard, widely recyclable"), or the brand loses trust — and may break advertising law.</div>`,
    `<span class="eyebrow">ADP301 · Chương 7 · Bài 7.1</span>
<h2>Bao bì bền vững</h2>
<p>Bao bì chiếm phần rất lớn trong rác thải tiêu dùng, nên <strong>bền vững</strong> giờ là ràng buộc thiết kế cốt lõi, không phải chuyện thêm vào sau — và thường là yêu cầu pháp lý lẫn thương hiệu.</p>
<h3>Các nguyên tắc thiết kế</h3>
<ul>
<li><strong>Giảm (Reduce)</strong> — dùng ít vật liệu hơn; đúng kích cỡ gói; bỏ lớp thừa.</li>
<li><strong>Tái dùng (Reuse)</strong> — dạng nạp lại (refill) hoặc dùng lại được.</li>
<li><strong>Tái chế (Recycle)</strong> — thiết kế để thật sự tái chế được: ưu tiên <strong>đơn vật liệu (mono-material)</strong> thay vì màng ghép khó tách, và làm cho việc phân loại dễ dàng.</li>
</ul>
<h3>Vật liệu &amp; eco-design</h3>
<ul>
<li><strong>Hàm lượng tái chế</strong> — rPET, bìa tái chế.</li>
<li><strong>Tái tạo / gốc sinh học</strong> — bột giấy ép, bã mía (bagasse), PLA (lưu ý điều kiện phân huỷ).</li>
<li><strong>Thiết kế để tháo rời</strong> — nhãn/keo không làm bẩn dòng tái chế.</li>
</ul>
<div class="callout"><span class="badge">Tránh greenwashing</span> Một chiếc lá xanh và chữ "eco" chưa phải là bền vững. Tuyên bố phải đúng và cụ thể (vd "bìa tái chế 80%, tái chế được rộng rãi"), nếu không thương hiệu mất niềm tin — và có thể vi phạm luật quảng cáo.</div>`,
  ]]);

const c7q = quiz('adp301-quiz-7', 'Quiz 7 — Sustainable packaging|||Quiz 7 — Bao bì bền vững', [
  { id: 'q1', question: 'Để bao bì DỄ tái chế hơn, nên ưu tiên?', options: ['Màng ghép nhiều lớp vật liệu khác nhau', 'Đơn vật liệu (mono-material)', 'Càng nhiều lớp càng tốt', 'Trộn nhựa với kim loại dán chặt'], correctIndex: 1, explanation: 'Mono-material (một loại nhựa) dễ phân loại và tái chế hơn màng ghép nhiều vật liệu.' },
  { id: 'q2', question: '"Greenwashing" là?', options: ['Rửa bao bì bằng nước sạch', 'Tuyên bố thân thiện môi trường sai/mơ hồ để đánh bóng', 'Một loại mực xanh', 'Kỹ thuật in eco'], correctIndex: 1, explanation: 'Greenwashing là gắn hình ảnh/chữ "xanh" mà không có bằng chứng thật — làm mất niềm tin và có thể phạm luật.' },
  { id: 'q3', question: 'Nguyên tắc "Reduce" trong bao bì bền vững nghĩa là?', options: ['Tăng kích thước hộp', 'Dùng ít vật liệu hơn, đúng kích cỡ, bỏ lớp thừa', 'Giảm giá bán', 'Bớt màu in'], correctIndex: 1, explanation: 'Reduce = giảm lượng vật liệu: right-size gói, loại bỏ các lớp không cần thiết.' },
]);

/* ── Chapter 8 ──────────────────────────────────────────────────────────── */
const c8 = doc('adp301-8-1-project-practice', '8.1 — Project & real-world practice|||8.1 — Dự án & thực tế',
  'Quy trình: brief → nghiên cứu/concept → dieline → artwork → 3D mockup → file sản xuất; làm việc với nhà in; ví dụ thương hiệu; dựng portfolio bao bì.',
  [[
    `<span class="eyebrow">ADP301 · Chapter 8 · Lesson 8.1</span>
<h2>Project &amp; real-world practice</h2>
<p>This chapter ties everything into the professional workflow — the path from a client brief to a factory-ready file.</p>
<h3>The end-to-end process</h3>
<pre><code>1. Brief        -> product, audience, brand, constraints, budget
2. Research     -> shelf audit, competitors, category conventions
3. Concept      -> sketches, structure &amp; big idea
4. Dieline      -> exact flat structural blueprint (cut/crease)
5. Artwork      -> logo, type, color, imagery on the dieline
6. 3D mockup    -> wrap artwork on the box; review at shelf distance
7. Prepress     -> bleeds, spot colors, dielines on their own layer
8. Production   -> proof with the printer, print run, finishing
</code></pre>
<h3>Working with the printer</h3>
<p>Deliver print-ready files: correct <strong>bleed</strong>, the <strong>dieline on its own layer</strong> (not printed), spot/Pantone colors specified, and a signed proof before the run. A designer who understands print avoids costly surprises.</p>
<h3>Portfolio</h3>
<p>Show the <em>thinking</em>, not just the pretty render: the brief, the sketches, the dieline, and a photographed or 3D mockup on a shelf. One strong end-to-end case (e.g. redesigning a Vietnamese brand like a <strong>Tiki</strong> own-label or a local coffee) beats ten flat visuals.</p>
<div class="callout"><span class="badge">Capstone</span> Pick one real product, run the full brief-to-mockup process, and present it as a case study — that is exactly what an employer wants to see.</div>`,
    `<span class="eyebrow">ADP301 · Chương 8 · Bài 8.1</span>
<h2>Dự án &amp; thực tế</h2>
<p>Chương này ráp mọi thứ vào quy trình chuyên nghiệp — đường đi từ brief của khách đến file sẵn sàng cho nhà máy.</p>
<h3>Quy trình đầu-cuối</h3>
<pre><code>1. Brief        -> sản phẩm, đối tượng, thương hiệu, ràng buộc, ngân sách
2. Nghiên cứu   -> khảo sát kệ, đối thủ, quy ước ngành hàng
3. Concept      -> phác thảo, cấu trúc &amp; ý tưởng lớn
4. Dieline      -> bản vẽ cấu trúc phẳng chính xác (cắt/gấp)
5. Artwork      -> logo, chữ, màu, hình ảnh đặt lên dieline
6. Mockup 3D    -> bọc artwork lên hộp; xem ở khoảng cách nhìn kệ
7. Chế bản      -> bù xén (bleed), màu spot, dieline ở layer riêng
8. Sản xuất     -> duyệt proof với nhà in, in hàng loạt, gia công
</code></pre>
<h3>Làm việc với nhà in</h3>
<p>Giao file sẵn sàng in: đúng <strong>bù xén (bleed)</strong>, <strong>dieline ở layer riêng</strong> (không in ra), chỉ định màu spot/Pantone, và có proof đã duyệt trước khi in loạt. Designer hiểu in ấn tránh được những cú bất ngờ tốn kém.</p>
<h3>Portfolio</h3>
<p>Trình bày <em>tư duy</em>, không chỉ bản render đẹp: brief, phác thảo, dieline, và mockup chụp ảnh hoặc 3D trên kệ. Một case đầu-cuối mạnh (vd thiết kế lại nhãn riêng của một thương hiệu Việt như <strong>Tiki</strong> hay một hãng cà phê nội) hơn mười hình phẳng.</p>
<div class="callout"><span class="badge">Đồ án tổng kết</span> Chọn một sản phẩm thật, chạy trọn quy trình brief-đến-mockup, và trình bày như một case study — đó chính là thứ nhà tuyển dụng muốn thấy.</div>`,
  ]]);

const c8q = quiz('adp301-quiz-8', 'Quiz 8 — Project & practice|||Quiz 8 — Dự án & thực tế', [
  { id: 'q1', question: 'Thứ tự ĐÚNG trong quy trình thiết kế bao bì là?', options: ['Artwork → brief → dieline → sản xuất', 'Brief → concept → dieline → artwork → mockup → sản xuất', 'Sản xuất → dieline → brief', 'Mockup → brief → in'], correctIndex: 1, explanation: 'Đi từ brief và nghiên cứu, tới concept, dieline, artwork, mockup 3D, chế bản rồi sản xuất.' },
  { id: 'q2', question: 'Khi giao file cho nhà in, dieline nên?', options: ['In ra cùng artwork', 'Nằm ở một layer RIÊNG và không in ra', 'Bỏ đi cho gọn', 'Vẽ bằng bút chì trên giấy'], correctIndex: 1, explanation: 'Dieline đặt ở layer riêng để nhà in dùng bế/cấn, không in thành nét lên sản phẩm.' },
  { id: 'q3', question: 'Portfolio bao bì tốt nên thể hiện điều gì nhất?', options: ['Chỉ bản render đẹp', 'Tư duy đầu-cuối: brief, phác thảo, dieline, mockup', 'Càng nhiều hình phẳng càng tốt', 'Chỉ logo'], correctIndex: 1, explanation: 'Nhà tuyển dụng muốn thấy quá trình tư duy và một case đầu-cuối hoàn chỉnh, không chỉ hình đẹp.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'ADP301',
    slug: 'adp301-packaging-design',
    title: 'Packaging design',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ADP301.webp',
    shortDescription: 'How packaging is designed — its protect, communicate & sell roles, structure & materials (dielines), brand & shelf impact, typography, color, print & finishing, and sustainable eco-design. Bilingual, real brands & quizzes.|||Bao bì được thiết kế thế nào — vai trò bảo vệ, truyền thông & bán hàng, cấu trúc & vật liệu (dieline), thương hiệu & sức hút trên kệ, typography, màu, in & hoàn thiện, bao bì bền vững. Song ngữ, thương hiệu thật & quiz.',
    description: 'Môn <strong>ADP301 — Packaging Design (Thiết kế bao bì)</strong> thuộc ngành Thiết kế mỹ thuật số, kỳ 7. Đi từ <strong>bản chất bao bì</strong> (ba chức năng: bảo vệ, truyền thông, bán hàng) → <strong>cấu trúc &amp; vật liệu</strong> (dieline, giấy/nhựa/thuỷ tinh/kim loại) → <strong>thương hiệu trên bao bì</strong> (nhận diện, shelf impact) → <strong>typography &amp; thông tin bắt buộc</strong> → <strong>màu &amp; hình ảnh</strong> → <strong>in &amp; hoàn thiện</strong> → <strong>bao bì bền vững</strong> → một <strong>dự án brief-đến-mockup</strong> hoàn chỉnh. Bám giáo trình chuẩn Klimchuk &amp; Krasovec, song ngữ, có ví dụ thương hiệu thật (Coca-Cola, Apple, Tiki) và quiz mỗi chương.',
    whatYouLearn: 'Ba chức năng bao bì & các cấp (primary/secondary/tertiary); structural design & đọc/vẽ dieline; giấy/nhựa/thuỷ tinh/kim loại; hệ nhận diện thương hiệu & shelf impact; phân cấp typography & thông tin bắt buộc (nhãn phụ); tâm lý màu & khác biệt hoá; in offset/flexo/digital & gia công (spot UV, emboss, foil); bao bì bền vững (mono-material, tái chế, tránh greenwashing); quy trình brief → dieline → 3D mockup → sản xuất và dựng portfolio.',
    requirements: 'Kiến thức nền về thiết kế đồ hoạ (bố cục, typography, màu) và Adobe Illustrator. Nên biết dựng file vector cơ bản.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, Dieline, Pentawards, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Bao bì làm gì; ba nhiệm vụ; lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Thiết kế bao bì là gì|||Chapter 1 — What is packaging design', description: 'Ba chức năng, các cấp bao bì, điểm chạm thương hiệu.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cấu trúc & vật liệu|||Chapter 2 — Structure & materials', description: 'Structural design, dieline, giấy/nhựa/thuỷ tinh/kim loại.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thương hiệu trên bao bì|||Chapter 3 — Brand on packaging', description: 'Nhận diện, logo, hệ dòng sản phẩm, shelf impact.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Typography & thông tin|||Chapter 4 — Typography & information', description: 'Phân cấp chữ, thông tin bắt buộc, nhãn.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Màu & hình ảnh|||Chapter 5 — Color & imagery', description: 'Tâm lý màu, hình ảnh sản phẩm, khác biệt hoá.', lessons: [c5, c5q] },
    { title: 'Chương 6 — In & hoàn thiện|||Chapter 6 — Print & finishing', description: 'Offset/flexo, spot UV, emboss, ép kim.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bao bì bền vững|||Chapter 7 — Sustainable packaging', description: 'Reduce/Reuse/Recycle, mono-material, eco-design.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Dự án & thực tế|||Chapter 8 — Project & practice', description: 'Brief → dieline → 3D mockup → sản xuất; portfolio.', lessons: [c8, c8q] },
  ],
};
