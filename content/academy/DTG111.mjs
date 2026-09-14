/**
 * DTG111 — Visual Design Tools 1 (Công cụ thiết kế đồ hoạ 1, cho truyền
 * thông/marketing). Giáo trình trích dẫn: tài liệu Adobe Photoshop/
 * Illustrator, Canva Design School, "The Non-Designer's Design Book"
 * (Williams — CRAP), "Making and Breaking the Grid" (Samara). Song ngữ +
 * ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dtg111-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: tài liệu Adobe Photoshop/Illustrator, Canva Design School, sách thiết kế, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">DTG111 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Visual Design Tools 1</strong> — design fundamentals, color, typography, raster &amp; vector graphics, layout, and marketing collateral — in one place. The official slides live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DTG111 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.papress.com/html/product.details.dna?isbn=9781440339902" target="_blank" rel="noopener"><em>The Non-Designer's Design Book</em> — Robin Williams (CRAP principles)</a></li>
<li><a href="https://www.harpercollins.com/products/making-and-breaking-the-grid-timothy-samara" target="_blank" rel="noopener"><em>Making and Breaking the Grid</em> — Timothy Samara (layout &amp; grid systems)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://helpx.adobe.com/photoshop/user-guide.html" target="_blank" rel="noopener">Adobe Photoshop — official user guide</a></li>
<li><a href="https://helpx.adobe.com/illustrator/user-guide.html" target="_blank" rel="noopener">Adobe Illustrator — official user guide</a></li>
<li><a href="https://www.canva.com/designschool/" target="_blank" rel="noopener">Canva Design School — free lessons &amp; tutorials</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@PiXimperfect" target="_blank" rel="noopener">PiXimperfect</a> — Photoshop tutorials &amp; retouching</li>
<li><a href="https://www.youtube.com/@SatoriGraphics" target="_blank" rel="noopener">Satori Graphics</a> — Illustrator, logo &amp; vector design</li>
<li><a href="https://www.youtube.com/@CanvaDesignSchool" target="_blank" rel="noopener">Canva Design School</a> — templates, brand kits, quick design</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.adobe.com/products/photoshop.html" target="_blank" rel="noopener">Adobe Photoshop</a> — raster image editing</li>
<li><a href="https://www.adobe.com/products/illustrator.html" target="_blank" rel="noopener">Adobe Illustrator</a> — vector graphics</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — templates for social/poster/brochure</li>
<li><a href="https://coolors.co/" target="_blank" rel="noopener">Coolors</a> — color palette generator</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — CRAP principles, color theory, typography basics.</li>
<li><strong>Practice</strong> — retouch a photo in Photoshop; trace a simple logo in Illustrator.</li>
<li><strong>Go deeper</strong> — grid layout, then design a poster/social post/brochure end to end.</li>
<li><strong>Job-ready</strong> — export correctly for print vs. web, and assemble a small portfolio.</li>
</ol></div>`,
    `<span class="eyebrow">DTG111 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Công cụ thiết kế đồ hoạ 1</strong> — nền tảng thiết kế, màu sắc, typography, đồ hoạ raster &amp; vector, bố cục, ấn phẩm marketing — gom về một chỗ. Slide chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DTG111 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.papress.com/html/product.details.dna?isbn=9781440339902" target="_blank" rel="noopener"><em>The Non-Designer's Design Book</em> — Robin Williams (nguyên tắc CRAP)</a></li>
<li><a href="https://www.harpercollins.com/products/making-and-breaking-the-grid-timothy-samara" target="_blank" rel="noopener"><em>Making and Breaking the Grid</em> — Timothy Samara (bố cục &amp; hệ lưới)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://helpx.adobe.com/photoshop/user-guide.html" target="_blank" rel="noopener">Adobe Photoshop — hướng dẫn chính thức</a></li>
<li><a href="https://helpx.adobe.com/illustrator/user-guide.html" target="_blank" rel="noopener">Adobe Illustrator — hướng dẫn chính thức</a></li>
<li><a href="https://www.canva.com/designschool/" target="_blank" rel="noopener">Canva Design School — bài học miễn phí</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@PiXimperfect" target="_blank" rel="noopener">PiXimperfect</a> — hướng dẫn Photoshop &amp; ghép/chỉnh ảnh</li>
<li><a href="https://www.youtube.com/@SatoriGraphics" target="_blank" rel="noopener">Satori Graphics</a> — Illustrator, logo &amp; vector</li>
<li><a href="https://www.youtube.com/@CanvaDesignSchool" target="_blank" rel="noopener">Canva Design School</a> — mẫu thiết kế, brand kit, thiết kế nhanh</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.adobe.com/products/photoshop.html" target="_blank" rel="noopener">Adobe Photoshop</a> — chỉnh ảnh raster</li>
<li><a href="https://www.adobe.com/products/illustrator.html" target="_blank" rel="noopener">Adobe Illustrator</a> — đồ hoạ vector</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — mẫu cho social/poster/brochure</li>
<li><a href="https://coolors.co/" target="_blank" rel="noopener">Coolors</a> — công cụ tạo bảng màu</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — nguyên tắc CRAP, lý thuyết màu, typography cơ bản.</li>
<li><strong>Luyện tập</strong> — chỉnh sửa một tấm ảnh trong Photoshop; vẽ lại một logo đơn giản trong Illustrator.</li>
<li><strong>Đào sâu</strong> — bố cục lưới, rồi thiết kế trọn vẹn một poster/bài social/brochure.</li>
<li><strong>Sẵn sàng đi làm</strong> — xuất file đúng chuẩn in ấn vs. web, và dựng một portfolio nhỏ.</li>
</ol></div>`,
  ]]);

const intro = doc('dtg111-0-1-overview', 'Course overview: Visual Design Tools 1|||Tổng quan: Công cụ thiết kế đồ hoạ 1',
  'Thiết kế thị giác cho truyền thông/marketing là gì; lộ trình môn học: nguyên tắc thiết kế → màu & chữ → Photoshop & Illustrator → bố cục → ấn phẩm marketing → xuất file & portfolio.',
  [[
    `<span class="eyebrow">DTG111 · Lesson 0.1 · Overview</span>
<h2>Visual Design Tools 1</h2>
<p class="lead">This course builds the <strong>visual design foundation</strong> for marketing and communication work — the thinking and the tools behind every poster, social post and brochure you'll be asked to make. You'll learn design <strong>principles</strong> (why some layouts "just work"), core <strong>color</strong> and <strong>typography</strong> theory, then put them into practice in <strong>Adobe Photoshop</strong> (raster/photo editing) and <strong>Adobe Illustrator</strong> (vector/logo design), before assembling real marketing collateral.</p>
<h3>Why designers need BOTH theory and tools</h3>
<ul>
<li><strong>Theory without tools</strong> — you can critique a design but can't produce one.</li>
<li><strong>Tools without theory</strong> — you can operate software but every layout looks accidental.</li>
</ul>
<p>This course pairs them: each design principle is immediately practiced inside Photoshop, Illustrator, or Canva.</p>
<h3>Roadmap</h3>
<p>Design principles (CRAP) &amp; visual hierarchy → color theory → typography → raster graphics in Photoshop → vector graphics in Illustrator → layout &amp; grid systems → marketing collateral (poster/social/brochure) → export standards &amp; portfolio. Bilingual, with worked examples and quizzes.</p>`,
    `<span class="eyebrow">DTG111 · Bài 0.1 · Tổng quan</span>
<h2>Công cụ thiết kế đồ hoạ 1</h2>
<p class="lead">Môn này xây <strong>nền tảng thiết kế thị giác</strong> cho công việc truyền thông và marketing — cách nghĩ và công cụ đứng sau mỗi tấm poster, bài social, brochure bạn sẽ phải làm. Bạn học các <strong>nguyên tắc</strong> thiết kế (vì sao vài bố cục "cứ thế mà đúng"), lý thuyết <strong>màu sắc</strong> và <strong>typography</strong> cốt lõi, rồi thực hành trong <strong>Adobe Photoshop</strong> (chỉnh ảnh raster) và <strong>Adobe Illustrator</strong> (thiết kế vector/logo), trước khi dựng ấn phẩm marketing thật.</p>
<h3>Vì sao người thiết kế cần CẢ lý thuyết và công cụ</h3>
<ul>
<li><strong>Lý thuyết mà không có công cụ</strong> — bạn chê được thiết kế nhưng không làm ra được thiết kế.</li>
<li><strong>Công cụ mà không có lý thuyết</strong> — bạn vận hành được phần mềm nhưng mọi bố cục nhìn ngẫu nhiên.</li>
</ul>
<p>Môn này ghép hai thứ lại: mỗi nguyên tắc thiết kế được thực hành ngay trong Photoshop, Illustrator, hoặc Canva.</p>
<h3>Lộ trình</h3>
<p>Nguyên tắc thiết kế (CRAP) &amp; hệ thống thị giác → lý thuyết màu → typography → đồ hoạ raster trong Photoshop → đồ hoạ vector trong Illustrator → bố cục &amp; hệ lưới → ấn phẩm marketing (poster/social/brochure) → chuẩn xuất file &amp; portfolio. Song ngữ, có ví dụ mẫu và quiz.</p>`,
  ]]);

const c1 = doc('dtg111-1-1-crap-principles', '1.1 — Visual design foundations & the CRAP principles|||1.1 — Nền tảng thiết kế thị giác & nguyên tắc CRAP',
  'Bốn nguyên tắc CRAP (Contrast/Repetition/Alignment/Proximity) từ sách Non-Designer Design Book; hệ thống thị giác, khoảng trắng.',
  [[
    `<span class="eyebrow">DTG111 · Chapter 1 · Lesson 1.1</span>
<h2>Visual design foundations &amp; the CRAP principles</h2>
<p>Robin Williams' <em>The Non-Designer's Design Book</em> distills good layout into four principles, remembered by the acronym <strong>CRAP</strong>.</p>
<h3>Contrast</h3>
<p>Make different elements <em>clearly different</em> — in size, color, weight, or type — so the eye immediately sees what matters most. A headline and body text that look almost the same create a flat, boring page; a bold headline against light body text creates instant hierarchy.</p>
<h3>Repetition</h3>
<p>Repeat visual elements (colors, fonts, shapes, spacing) throughout a design so it reads as <em>one</em> consistent piece rather than several unrelated parts. This is why brand style guides exist.</p>
<h3>Alignment</h3>
<p>Every element should have a visual connection to another element — nothing placed arbitrarily. A shared left edge, center line, or grid gives a layout an invisible structure the eye can follow.</p>
<h3>Proximity</h3>
<p>Group related items close together, and separate unrelated items with space. Proximity tells the viewer what belongs together <em>before</em> they read a single word.</p>
<pre><code>Quick CRAP self-check for any layout:
 [ ] Contrast   - Is it obvious what to look at first?
 [ ] Repetition - Do colors/fonts/spacing repeat consistently?
 [ ] Alignment  - Does everything line up to something else?
 [ ] Proximity  - Are related items grouped, unrelated items separated?
</code></pre>
<h3>Visual hierarchy &amp; white space</h3>
<p><strong>Visual hierarchy</strong> is the order in which the eye scans a page — controlled by size, color, and position. <strong>White space</strong> (empty space) is not wasted space: it gives elements room to breathe and is often what separates an amateur layout from a professional one.</p>
<div class="callout"><span class="badge">Rule of thumb</span> When a design "feels off" but you can't say why, run the CRAP checklist — it is almost always one of the four that's missing.</div>`,
    `<span class="eyebrow">DTG111 · Chương 1 · Bài 1.1</span>
<h2>Nền tảng thiết kế thị giác &amp; nguyên tắc CRAP</h2>
<p>Cuốn <em>The Non-Designer's Design Book</em> của Robin Williams gói bố cục tốt lại thành bốn nguyên tắc, nhớ bằng chữ viết tắt <strong>CRAP</strong>.</p>
<h3>Contrast (Đối lập)</h3>
<p>Làm cho các phần tử khác nhau <em>khác nhau rõ ràng</em> — về kích cỡ, màu, độ đậm, hoặc kiểu chữ — để mắt lập tức thấy cái gì quan trọng nhất. Tiêu đề và nội dung nhìn gần giống nhau tạo ra một trang phẳng, nhạt; tiêu đề đậm trên nền chữ nhẹ tạo hệ thống thị giác ngay lập tức.</p>
<h3>Repetition (Lặp lại)</h3>
<p>Lặp lại các yếu tố thị giác (màu, font, hình khối, khoảng cách) xuyên suốt thiết kế để nó đọc như <em>một</em> khối thống nhất, không phải nhiều phần rời rạc. Đây là lý do brand style guide tồn tại.</p>
<h3>Alignment (Căn chỉnh)</h3>
<p>Mọi phần tử nên có liên kết thị giác với một phần tử khác — không đặt tuỳ tiện. Một mép trái chung, một đường giữa, hay một lưới cho bố cục một cấu trúc vô hình mà mắt có thể theo.</p>
<h3>Proximity (Khoảng cách gần)</h3>
<p>Nhóm các mục liên quan lại gần nhau, và tách các mục không liên quan bằng khoảng trống. Proximity cho người xem biết cái gì thuộc về nhau <em>trước cả khi</em> họ đọc một chữ.</p>
<pre><code>Tự kiểm CRAP nhanh cho mọi bố cục:
 [ ] Contrast   - Có rõ nên nhìn vào đâu trước không?
 [ ] Repetition - Màu/font/khoảng cách có lặp lại nhất quán không?
 [ ] Alignment  - Mọi thứ có căn theo thứ gì khác không?
 [ ] Proximity  - Mục liên quan có được nhóm, mục không liên quan có được tách không?
</code></pre>
<h3>Hệ thống thị giác &amp; khoảng trắng</h3>
<p><strong>Hệ thống thị giác (visual hierarchy)</strong> là thứ tự mắt quét qua một trang — điều khiển bằng kích cỡ, màu, và vị trí. <strong>Khoảng trắng (white space)</strong> không phải khoảng trống lãng phí: nó cho các phần tử không gian để "thở" và thường là thứ phân biệt bố cục nghiệp dư với bố cục chuyên nghiệp.</p>
<div class="callout"><span class="badge">Quy tắc tay</span> Khi một thiết kế "thấy sai" mà không nói được vì sao, chạy checklist CRAP — hầu như luôn thiếu một trong bốn nguyên tắc trên.</div>`,
  ]]);

const c1q = quiz('dtg111-quiz-1', 'Quiz 1 — CRAP principles|||Quiz 1 — Nguyên tắc CRAP', [
  { id: 'q1', question: 'CRAP là viết tắt của bốn nguyên tắc nào?', options: ['Color/Repetition/Art/Print', 'Contrast/Repetition/Alignment/Proximity', 'Contrast/Resolution/Art/Pixel', 'Copy/Repeat/Align/Print'], correctIndex: 1, explanation: 'CRAP = Contrast, Repetition, Alignment, Proximity (Robin Williams).' },
  { id: 'q2', question: 'Nguyên tắc nào nói "nhóm các mục liên quan lại gần nhau"?', options: ['Contrast', 'Repetition', 'Alignment', 'Proximity'], correctIndex: 3, explanation: 'Proximity: khoảng cách gần cho biết cái gì thuộc về nhau.' },
  { id: 'q3', question: 'Khoảng trắng (white space) trong thiết kế nên hiểu là gì?', options: ['Lỗi bố cục cần lấp đầy', 'Không gian có chủ đích, giúp phân cấp và dễ đọc', 'Chỉ dùng khi hết nội dung', 'Luôn nên loại bỏ để tiết kiệm giấy'], correctIndex: 1, explanation: 'White space là công cụ thiết kế có chủ đích, không phải không gian lãng phí.' },
]);

const c2 = doc('dtg111-2-1-color-theory', '2.1 — Color & color theory|||2.1 — Màu sắc & lý thuyết màu',
  'Bánh xe màu, RGB vs CMYK, hoà sắc bổ túc/tương đồng/tam giác, tâm lý màu, độ tương phản & khả năng đọc.',
  [[
    `<span class="eyebrow">DTG111 · Chapter 2 · Lesson 2.1</span>
<h2>Color &amp; color theory</h2>
<h3>The color wheel &amp; harmonies</h3>
<ul>
<li><strong>Complementary</strong> — colors opposite each other (e.g. blue &amp; orange); high contrast, high energy.</li>
<li><strong>Analogous</strong> — colors next to each other (e.g. blue, teal, green); calm, harmonious.</li>
<li><strong>Triadic</strong> — three colors evenly spaced on the wheel; vibrant, balanced.</li>
</ul>
<h3>RGB vs. CMYK — two different "recipes" for color</h3>
<ul>
<li><strong>RGB (Red/Green/Blue)</strong> — <em>additive</em> light, for <strong>screens</strong> (web, social media, apps). Mixing all three at full gives white.</li>
<li><strong>CMYK (Cyan/Magenta/Yellow/Key-black)</strong> — <em>subtractive</em> ink, for <strong>print</strong>. Mixing all four gives (near) black.</li>
</ul>
<p>Designing for print but working in RGB is a classic mistake — colors shift, often duller, once printed, because the printer converts RGB to CMYK on its own terms.</p>
<h3>Color psychology (brief)</h3>
<p>Red = urgency/energy; blue = trust/calm; green = growth/eco; yellow = optimism/caution; black = luxury/authority. Context and culture matter more than any fixed rule — always check against the brand and audience.</p>
<h3>Contrast &amp; accessibility</h3>
<p>Text needs enough contrast against its background to be readable — this also affects people with low vision or color blindness (the most common form confuses red/green). Don't rely on color alone to carry meaning (e.g. "red = error") — pair it with an icon or label too.</p>
<pre><code>Quick palette recipe for a marketing piece:
 1 dominant brand color (60%)
 1 secondary/supporting color (30%)
 1 accent color for CTAs/highlights (10%)
</code></pre>
<div class="callout"><span class="badge">Tool tip</span> Use <strong>Coolors.co</strong> or Adobe Color to generate and test a harmonious palette before opening Photoshop/Illustrator.</div>`,
    `<span class="eyebrow">DTG111 · Chương 2 · Bài 2.1</span>
<h2>Màu sắc &amp; lý thuyết màu</h2>
<h3>Bánh xe màu &amp; các cách hoà sắc</h3>
<ul>
<li><strong>Bổ túc (complementary)</strong> — hai màu đối diện nhau (vd xanh &amp; cam); tương phản cao, năng động.</li>
<li><strong>Tương đồng (analogous)</strong> — các màu cạnh nhau (vd xanh dương, xanh ngọc, xanh lá); êm, hài hoà.</li>
<li><strong>Tam giác (triadic)</strong> — ba màu cách đều trên bánh xe; sống động, cân bằng.</li>
</ul>
<h3>RGB vs. CMYK — hai "công thức" màu khác nhau</h3>
<ul>
<li><strong>RGB (Đỏ/Xanh lá/Xanh dương)</strong> — ánh sáng <em>cộng</em>, dùng cho <strong>màn hình</strong> (web, social, app). Trộn cả ba ở mức tối đa ra màu trắng.</li>
<li><strong>CMYK (Cyan/Magenta/Yellow/Key-đen)</strong> — mực <em>trừ</em>, dùng cho <strong>in ấn</strong>. Trộn cả bốn ra màu (gần) đen.</li>
</ul>
<p>Thiết kế cho in ấn mà làm việc ở RGB là lỗi kinh điển — màu bị lệch, thường xuống tông, một khi in ra, vì máy in tự chuyển RGB sang CMYK theo cách riêng của nó.</p>
<h3>Tâm lý màu (ngắn)</h3>
<p>Đỏ = cấp bách/năng lượng; xanh dương = tin cậy/bình tĩnh; xanh lá = phát triển/xanh; vàng = tích cực/cảnh báo; đen = sang trọng/quyền lực. Bối cảnh và văn hoá quan trọng hơn bất kỳ quy tắc cố định nào — luôn đối chiếu với thương hiệu và đối tượng người xem.</p>
<h3>Độ tương phản &amp; khả năng tiếp cận</h3>
<p>Chữ cần đủ tương phản với nền để đọc được — điều này cũng ảnh hưởng người có thị lực yếu hoặc mù màu (dạng phổ biến nhất nhầm đỏ/xanh lá). Không dựa hoàn toàn vào màu để truyền nghĩa (vd "đỏ = lỗi") — kèm theo icon hoặc nhãn chữ.</p>
<pre><code>Công thức bảng màu nhanh cho một ấn phẩm marketing:
 1 màu chủ đạo của thương hiệu (60%)
 1 màu phụ/hỗ trợ (30%)
 1 màu điểm nhấn cho CTA/nổi bật (10%)
</code></pre>
<div class="callout"><span class="badge">Mẹo công cụ</span> Dùng <strong>Coolors.co</strong> hoặc Adobe Color để sinh và thử một bảng màu hài hoà trước khi mở Photoshop/Illustrator.</div>`,
  ]]);

const c2q = quiz('dtg111-quiz-2', 'Quiz 2 — Color theory|||Quiz 2 — Lý thuyết màu', [
  { id: 'q1', question: 'Hệ màu nào dùng cho in ấn (mực)?', options: ['RGB', 'CMYK', 'HEX', 'HSB'], correctIndex: 1, explanation: 'CMYK (Cyan/Magenta/Yellow/Key-đen) là mực, dùng cho in ấn; RGB dùng cho màn hình.' },
  { id: 'q2', question: 'Hai màu đối diện nhau trên bánh xe màu (vd xanh & cam) gọi là hoà sắc gì?', options: ['Tương đồng (analogous)', 'Bổ túc (complementary)', 'Tam giác (triadic)', 'Đơn sắc (monochromatic)'], correctIndex: 1, explanation: 'Bổ túc: hai màu đối diện, tương phản cao.' },
  { id: 'q3', question: 'Vì sao KHÔNG nên chỉ dùng màu để truyền nghĩa (vd "đỏ = lỗi")?', options: ['Vì màu đỏ luôn xấu', 'Vì người mù màu/thị lực yếu có thể không phân biệt được, nên cần kèm icon/nhãn', 'Vì máy in không in được màu đỏ', 'Vì RGB không có màu đỏ'], correctIndex: 1, explanation: 'Khả năng tiếp cận: kèm icon/nhãn chữ để không phụ thuộc hoàn toàn vào màu.' },
]);

const c3 = doc('dtg111-3-1-typography', '3.1 — Typography basics|||3.1 — Typography cơ bản',
  'Typeface vs font, serif/sans-serif, hệ thống cấp bậc (size/weight), ghép font, kerning/leading/tracking, khả năng đọc.',
  [[
    `<span class="eyebrow">DTG111 · Chapter 3 · Lesson 3.1</span>
<h2>Typography basics</h2>
<h3>Typeface vs. font</h3>
<p>A <strong>typeface</strong> is the design (e.g. Helvetica); a <strong>font</strong> is one specific weight/style/size of that typeface (e.g. Helvetica Bold 24pt). People use "font" loosely for both.</p>
<h3>Serif vs. sans-serif</h3>
<ul>
<li><strong>Serif</strong> (small strokes at letter ends, e.g. Times New Roman, Georgia) — traditional, trustworthy; common in print body text.</li>
<li><strong>Sans-serif</strong> (no strokes, e.g. Helvetica, Roboto) — clean, modern; common on screens and in headlines.</li>
</ul>
<h3>Hierarchy: size &amp; weight</h3>
<p>Use 2-3 clear levels — e.g. Headline (large, bold) → Subhead (medium, semibold) → Body (small, regular) — so the eye knows what to read first without needing many different typefaces.</p>
<h3>Font pairing</h3>
<p>A safe rule: pair a bold serif or display font for headlines with a clean sans-serif for body text (or vice-versa) — one for personality, one for readability. Avoid mixing more than 2 typefaces in one design.</p>
<h3>Kerning, tracking, leading</h3>
<ul>
<li><strong>Kerning</strong> — spacing between two <em>specific</em> letter pairs (e.g. tightening "AV").</li>
<li><strong>Tracking</strong> — spacing applied uniformly across a <em>whole</em> word/line.</li>
<li><strong>Leading</strong> — vertical space between lines of text (line-height).</li>
</ul>
<pre><code>Readability checklist:
 [ ] Body text >= ~10-12pt (print) / 16px (web)
 [ ] Line length ~45-75 characters per line
 [ ] Leading ~120-145% of font size
 [ ] Enough contrast against the background
 [ ] No more than 2 typefaces in one piece
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Typography is 90% of most designs — even the best color palette and layout fail if the text is hard to read.</div>`,
    `<span class="eyebrow">DTG111 · Chương 3 · Bài 3.1</span>
<h2>Typography cơ bản</h2>
<h3>Typeface vs. font</h3>
<p>Một <strong>typeface</strong> là bộ thiết kế chữ (vd Helvetica); một <strong>font</strong> là một biến thể cụ thể về độ đậm/kiểu/cỡ của typeface đó (vd Helvetica Bold 24pt). Mọi người thường dùng "font" một cách xuề xoà cho cả hai.</p>
<h3>Serif vs. sans-serif</h3>
<ul>
<li><strong>Serif</strong> (có chân nhỏ ở đầu chữ, vd Times New Roman, Georgia) — truyền thống, đáng tin; thường dùng cho nội dung in ấn.</li>
<li><strong>Sans-serif</strong> (không chân, vd Helvetica, Roboto) — sạch, hiện đại; thường dùng trên màn hình và cho tiêu đề.</li>
</ul>
<h3>Hệ cấp bậc: cỡ chữ &amp; độ đậm</h3>
<p>Dùng 2-3 cấp rõ ràng — vd Tiêu đề (lớn, đậm) → Tiêu đề phụ (vừa, đậm nhẹ) → Nội dung (nhỏ, thường) — để mắt biết đọc gì trước mà không cần nhiều typeface khác nhau.</p>
<h3>Ghép font</h3>
<p>Quy tắc an toàn: ghép một font serif hoặc display đậm cho tiêu đề với một font sans-serif sạch cho nội dung (hoặc ngược lại) — một mang cá tính, một mang khả năng đọc. Tránh trộn quá 2 typeface trong một thiết kế.</p>
<h3>Kerning, tracking, leading</h3>
<ul>
<li><strong>Kerning</strong> — khoảng cách giữa hai chữ <em>cụ thể</em> đứng cạnh nhau (vd siết lại cặp "AV").</li>
<li><strong>Tracking</strong> — khoảng cách áp đều lên <em>cả</em> một từ/dòng.</li>
<li><strong>Leading</strong> — khoảng cách dọc giữa các dòng chữ (line-height).</li>
</ul>
<pre><code>Checklist khả năng đọc:
 [ ] Chữ nội dung >= ~10-12pt (in) / 16px (web)
 [ ] Độ dài dòng ~45-75 ký tự mỗi dòng
 [ ] Leading ~120-145% cỡ chữ
 [ ] Đủ tương phản với nền
 [ ] Không quá 2 typeface trong một ấn phẩm
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Typography chiếm 90% phần lớn thiết kế — dù bảng màu và bố cục tốt nhất cũng thất bại nếu chữ khó đọc.</div>`,
  ]]);

const c3q = quiz('dtg111-quiz-3', 'Quiz 3 — Typography|||Quiz 3 — Typography', [
  { id: 'q1', question: 'Sự khác biệt giữa typeface và font là gì?', options: ['Không khác gì cả', 'Typeface là bộ thiết kế chữ, font là một biến thể cụ thể (đậm/cỡ/kiểu) của nó', 'Font dùng cho in, typeface dùng cho web', 'Typeface chỉ có serif, font chỉ có sans-serif'], correctIndex: 1, explanation: 'Typeface = thiết kế tổng thể; font = một biến thể cụ thể của typeface đó.' },
  { id: 'q2', question: '"Leading" trong typography là gì?', options: ['Khoảng cách giữa hai chữ cụ thể', 'Khoảng cách dọc giữa các dòng chữ', 'Độ đậm của font', 'Kiểu chữ có chân'], correctIndex: 1, explanation: 'Leading = khoảng cách dòng (line-height), khác kerning (khoảng cách giữa 2 chữ cụ thể).' },
  { id: 'q3', question: 'Quy tắc an toàn khi ghép font trong một thiết kế là gì?', options: ['Dùng càng nhiều typeface càng đẹp', 'Ghép tối đa 2 typeface — một cho cá tính (tiêu đề), một cho khả năng đọc (nội dung)', 'Chỉ dùng serif cho mọi thứ', 'Chỉ dùng chữ hoa toàn bộ'], correctIndex: 1, explanation: 'Không quá 2 typeface: một mang cá tính, một mang khả năng đọc.' },
]);

const c4 = doc('dtg111-4-1-raster-photoshop', '4.1 — Raster graphics & Photoshop|||4.1 — Đồ hoạ raster & Photoshop',
  'Ảnh raster (điểm ảnh), độ phân giải/DPI, layer & adjustment layer, công cụ chọn, chỉnh ảnh không phá hủy.',
  [[
    `<span class="eyebrow">DTG111 · Chapter 4 · Lesson 4.1</span>
<h2>Raster graphics &amp; Photoshop</h2>
<h3>What is a raster image?</h3>
<p>A <strong>raster</strong> (bitmap) image is a grid of colored pixels — photos are raster. Zoom in far enough and you see individual squares. This means raster images <strong>lose quality when scaled up</strong> ("pixelation") — unlike vector graphics (next chapter).</p>
<h3>Resolution &amp; DPI</h3>
<ul>
<li><strong>Resolution</strong> — total pixel count (e.g. 1920×1080).</li>
<li><strong>DPI/PPI</strong> (dots/pixels per inch) — density. <strong>72-96 DPI</strong> is enough for screens; <strong>300 DPI</strong> is the standard for print, or output looks soft/blurry.</li>
</ul>
<h3>Layers — the core Photoshop concept</h3>
<p>Every element (background, subject, text, effect) lives on its own <strong>layer</strong>, stacked like transparent sheets. This lets you edit, hide, reorder, or delete one part without touching the rest.</p>
<h3>Adjustment layers &amp; non-destructive editing</h3>
<p>Instead of editing pixels directly (destructive), use <strong>adjustment layers</strong> (Levels, Curves, Hue/Saturation, etc.) that sit on top and can be tweaked or removed anytime — the original pixels stay untouched. Always work non-destructively so nothing is permanently lost.</p>
<h3>Selection &amp; retouching basics</h3>
<ul>
<li><strong>Selection tools</strong> (Marquee, Lasso, Magic Wand, Object Selection) isolate a region before editing only that part.</li>
<li><strong>Retouching tools</strong> — Clone Stamp (copy pixels from elsewhere), Healing Brush (blend seamlessly), Spot Healing (remove small blemishes automatically).</li>
</ul>
<pre><code>Basic non-destructive workflow:
 1. Duplicate the background layer (never edit the original)
 2. Add adjustment layers (Levels/Curves/Hue-Sat) above it
 3. Use layer masks to limit an effect to part of the image
 4. Flatten/export only at the very end
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> If Photoshop asks "flatten image?" before you're done editing, say no — flattening merges layers and removes your ability to undo individually.</div>`,
    `<span class="eyebrow">DTG111 · Chương 4 · Bài 4.1</span>
<h2>Đồ hoạ raster &amp; Photoshop</h2>
<h3>Ảnh raster là gì?</h3>
<p>Ảnh <strong>raster</strong> (bitmap) là một lưới điểm ảnh có màu — ảnh chụp là raster. Zoom đủ gần sẽ thấy từng ô vuông riêng. Điều này nghĩa là ảnh raster <strong>mất chất lượng khi phóng to</strong> ("vỡ hạt") — khác với đồ hoạ vector (chương sau).</p>
<h3>Độ phân giải &amp; DPI</h3>
<ul>
<li><strong>Độ phân giải (resolution)</strong> — tổng số điểm ảnh (vd 1920×1080).</li>
<li><strong>DPI/PPI</strong> (điểm/pixel mỗi inch) — mật độ. <strong>72-96 DPI</strong> đủ cho màn hình; <strong>300 DPI</strong> là chuẩn cho in ấn, thiếu thì bản in mờ/nhoè.</li>
</ul>
<h3>Layer (lớp) — khái niệm cốt lõi của Photoshop</h3>
<p>Mỗi phần tử (nền, chủ thể, chữ, hiệu ứng) nằm trên một <strong>layer</strong> riêng, xếp chồng như các lớp trong suốt. Điều này cho phép chỉnh, ẩn, đổi thứ tự, hoặc xoá một phần mà không đụng phần còn lại.</p>
<h3>Adjustment layer &amp; chỉnh ảnh không phá hủy</h3>
<p>Thay vì chỉnh trực tiếp lên điểm ảnh (phá hủy), dùng <strong>adjustment layer</strong> (Levels, Curves, Hue/Saturation, v.v.) nằm phía trên, có thể chỉnh lại hoặc xoá bất kỳ lúc nào — điểm ảnh gốc không bị đụng. Luôn làm việc không phá hủy để không mất gì vĩnh viễn.</p>
<h3>Chọn vùng &amp; chỉnh sửa cơ bản</h3>
<ul>
<li><strong>Công cụ chọn</strong> (Marquee, Lasso, Magic Wand, Object Selection) khoanh một vùng trước khi chỉ chỉnh phần đó.</li>
<li><strong>Công cụ chỉnh sửa</strong> — Clone Stamp (chép điểm ảnh từ nơi khác), Healing Brush (trộn liền mạch), Spot Healing (tự xoá vết nhỏ).</li>
</ul>
<pre><code>Quy trình không phá hủy cơ bản:
 1. Nhân bản layer nền (không bao giờ chỉnh trực tiếp bản gốc)
 2. Thêm adjustment layer (Levels/Curves/Hue-Sat) phía trên
 3. Dùng layer mask để giới hạn hiệu ứng vào một phần ảnh
 4. Chỉ flatten/xuất file ở bước cuối cùng
</code></pre>
<div class="callout"><span class="badge">Quy tắc tay</span> Nếu Photoshop hỏi "flatten image?" trước khi chỉnh xong, chọn không — flatten hợp nhất các layer và mất khả năng undo riêng từng phần.</div>`,
  ]]);

const c4q = quiz('dtg111-quiz-4', 'Quiz 4 — Raster & Photoshop|||Quiz 4 — Raster & Photoshop', [
  { id: 'q1', question: 'Ảnh raster khi phóng to lớn sẽ bị gì?', options: ['Sắc nét hơn', 'Vỡ hạt (pixelation) vì mất chất lượng', 'Tự động chuyển sang vector', 'Không thay đổi gì'], correctIndex: 1, explanation: 'Raster là lưới điểm ảnh cố định, phóng to quá sẽ lộ từng ô vuông (vỡ hạt).' },
  { id: 'q2', question: 'DPI chuẩn cho in ấn (khác với màn hình) là bao nhiêu?', options: ['72 DPI', '96 DPI', '300 DPI', '30 DPI'], correctIndex: 2, explanation: '300 DPI là chuẩn in ấn; 72-96 DPI đủ cho màn hình.' },
  { id: 'q3', question: 'Adjustment layer trong Photoshop giúp gì?', options: ['Xoá vĩnh viễn điểm ảnh gốc', 'Chỉnh màu/sáng không phá hủy, có thể sửa lại hoặc xoá bất kỳ lúc nào', 'Chỉ dùng để đổi tên file', 'Biến ảnh raster thành vector'], correctIndex: 1, explanation: 'Adjustment layer nằm phía trên, chỉnh không phá hủy pixel gốc.' },
]);

const c5 = doc('dtg111-5-1-vector-illustrator', '5.1 — Vector graphics & Illustrator|||5.1 — Đồ hoạ vector & Illustrator',
  'Vector vs raster, điểm neo & đường Bézier, công cụ Pen, nguyên tắc thiết kế logo/icon, khả năng phóng to vô hạn.',
  [[
    `<span class="eyebrow">DTG111 · Chapter 5 · Lesson 5.1</span>
<h2>Vector graphics &amp; Illustrator</h2>
<h3>Vector vs. raster</h3>
<p>A <strong>vector</strong> image is defined by mathematical paths (points and curves), not pixels. This means it can be <strong>scaled to any size — huge or tiny — with zero quality loss</strong>. Logos, icons, and illustrations are almost always built as vectors so they work on a business card and a billboard alike.</p>
<h3>Anchor points &amp; Bézier curves</h3>
<p>A vector shape is made of <strong>anchor points</strong> connected by straight or curved segments. Curved segments are <strong>Bézier curves</strong>, shaped by direction handles at each anchor point — drag a handle and the curve bends.</p>
<h3>The Pen tool</h3>
<p>Illustrator's <strong>Pen tool</strong> draws precise custom paths: click for straight corners, click-and-drag for smooth curves. It's the single most important tool for tracing a logo or building custom shapes — practice is essential, since it behaves nothing like a pencil.</p>
<h3>Logo &amp; icon design principles</h3>
<ul>
<li><strong>Simplicity</strong> — a logo must be recognizable at a glance and at a tiny size (favicon-sized).</li>
<li><strong>Scalability</strong> — must look correct from a favicon to a billboard (a vector's core advantage).</li>
<li><strong>Versatility</strong> — must work in full color, black-only, and reversed on a dark background.</li>
<li><strong>Relevance</strong> — should connect, even loosely, to the brand's identity or industry.</li>
</ul>
<pre><code>Vector building blocks in Illustrator:
 Pen tool     -> custom paths / tracing
 Shape tools  -> rectangle, ellipse, polygon (fast base shapes)
 Pathfinder   -> combine/subtract/intersect shapes
 Live Trace   -> convert a raster sketch to editable vector paths
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> If a graphic needs to appear at multiple sizes (logo, icon, favicon) — build it as a vector, never as a raster.</div>`,
    `<span class="eyebrow">DTG111 · Chương 5 · Bài 5.1</span>
<h2>Đồ hoạ vector &amp; Illustrator</h2>
<h3>Vector vs. raster</h3>
<p>Ảnh <strong>vector</strong> được định nghĩa bằng các đường toán học (điểm và đường cong), không phải điểm ảnh. Điều này nghĩa là nó có thể <strong>phóng to/nhỏ tuỳ ý — cực lớn hay cực nhỏ — mà không mất chất lượng</strong>. Logo, icon, minh hoạ hầu như luôn được dựng dạng vector để dùng được từ tấm card đến biển quảng cáo lớn.</p>
<h3>Điểm neo &amp; đường Bézier</h3>
<p>Một hình vector gồm các <strong>điểm neo (anchor point)</strong> nối bằng đoạn thẳng hoặc đoạn cong. Đoạn cong là <strong>đường Bézier</strong>, được định hình bằng tay điều hướng (handle) ở mỗi điểm neo — kéo một tay là đường cong đó bẻ theo.</p>
<h3>Công cụ Pen</h3>
<p><strong>Công cụ Pen</strong> trong Illustrator vẽ đường tuỳ ý chính xác: click để tạo góc thẳng, click-và-kéo để tạo đường cong mượt. Đây là công cụ quan trọng nhất để vẽ lại logo hoặc dựng hình tuỳ ý — cần luyện tập nhiều vì nó không hoạt động giống bút chì.</p>
<h3>Nguyên tắc thiết kế logo &amp; icon</h3>
<ul>
<li><strong>Đơn giản</strong> — logo phải nhận ra ngay ở kích cỡ nhìn lướt và ở cỡ rất nhỏ (cỡ favicon).</li>
<li><strong>Khả năng phóng to</strong> — phải đúng từ favicon đến biển quảng cáo lớn (lợi thế cốt lõi của vector).</li>
<li><strong>Đa dụng</strong> — phải hoạt động ở bản đầy màu, chỉ đen, và đảo màu trên nền tối.</li>
<li><strong>Liên quan</strong> — nên gắn, dù lỏng, với bản sắc hoặc ngành của thương hiệu.</li>
</ul>
<pre><code>Các khối dựng vector trong Illustrator:
 Pen tool     -> đường tuỳ ý / vẽ lại (tracing)
 Shape tools  -> hình chữ nhật, ellipse, đa giác (hình nền nhanh)
 Pathfinder   -> gộp/trừ/giao các hình
 Live Trace   -> chuyển phác thảo raster thành đường vector chỉnh được
</code></pre>
<div class="callout"><span class="badge">Quy tắc tay</span> Nếu một hình cần xuất hiện ở nhiều cỡ (logo, icon, favicon) — dựng nó dạng vector, không bao giờ dạng raster.</div>`,
  ]]);

const c5q = quiz('dtg111-quiz-5', 'Quiz 5 — Vector & Illustrator|||Quiz 5 — Vector & Illustrator', [
  { id: 'q1', question: 'Lợi thế cốt lõi của đồ hoạ vector so với raster là gì?', options: ['Nhẹ hơn về dung lượng luôn', 'Phóng to/nhỏ tuỳ ý mà không mất chất lượng', 'Chỉ dùng được cho ảnh chụp', 'Không cần công cụ Pen'], correctIndex: 1, explanation: 'Vector định nghĩa bằng toán học (điểm/đường), scale không vỡ hạt.' },
  { id: 'q2', question: 'Đường cong trong hình vector được tạo bằng tay điều hướng ở điểm neo gọi là?', options: ['Đường Bézier', 'Đường Kirchhoff', 'Đường lưới (grid line)', 'Đường DPI'], correctIndex: 0, explanation: 'Đường Bézier: hình dạng do các tay điều hướng ở anchor point quyết định.' },
  { id: 'q3', question: 'Vì sao logo nên được thiết kế dạng vector?', options: ['Vì logo chỉ dùng trên máy tính', 'Vì cần dùng đúng ở nhiều kích cỡ khác nhau, từ favicon đến biển lớn', 'Vì vector không cần màu', 'Vì raster không mở được trong Illustrator'], correctIndex: 1, explanation: 'Khả năng phóng to vô hạn của vector là lý do logo/icon luôn dựng dạng vector.' },
]);

const c6 = doc('dtg111-6-1-layout-grid', '6.1 — Layout & grid systems|||6.1 — Bố cục & hệ lưới',
  'Hệ lưới cột/module (Samara), khoảng lề & gutter, rule of thirds, căn chỉnh theo lưới cho bố cục nhất quán.',
  [[
    `<span class="eyebrow">DTG111 · Chapter 6 · Lesson 6.1</span>
<h2>Layout &amp; grid systems</h2>
<h3>Why grids exist</h3>
<p>Timothy Samara's <em>Making and Breaking the Grid</em> frames a grid as an invisible structure that organizes content — text, images, whitespace — into a consistent, navigable layout. A grid doesn't limit creativity; it gives creativity a stable frame to work inside (and to deliberately break, once the rules are understood).</p>
<h3>Column grids &amp; modular grids</h3>
<ul>
<li><strong>Column grid</strong> — vertical columns (e.g. 12-column) that content snaps to; common for documents, brochures, web pages.</li>
<li><strong>Modular grid</strong> — columns AND rows form a grid of modules/cells; common for image-heavy layouts (photo grids, dashboards, magazine spreads).</li>
</ul>
<h3>Margins &amp; gutters</h3>
<ul>
<li><strong>Margin</strong> — the space between content and the edge of the page/canvas.</li>
<li><strong>Gutter</strong> — the space between two columns (or two modules).</li>
</ul>
<p>Consistent margins and gutters are what make a multi-page or multi-slide piece feel "designed" rather than assembled by accident.</p>
<h3>Rule of thirds</h3>
<p>Divide the canvas into a 3×3 grid; place key subjects along the lines or at their intersections rather than dead-center — a simple, fast way to get a more dynamic, balanced composition (borrowed from photography).</p>
<pre><code>Grid setup checklist for a new layout:
 [ ] Choose column count (e.g. 12 for flexibility)
 [ ] Set consistent margins (top/bottom/left/right)
 [ ] Set a consistent gutter width
 [ ] Snap text blocks & images to the grid
 [ ] Leave at least one module empty for breathing room
</code></pre>
<div class="callout"><span class="badge">Break it on purpose</span> Once a grid is established, breaking it for ONE element (e.g. a large hero image bleeding past a column) draws attention precisely because everything else stayed on-grid.</div>`,
    `<span class="eyebrow">DTG111 · Chương 6 · Bài 6.1</span>
<h2>Bố cục &amp; hệ lưới</h2>
<h3>Vì sao lưới tồn tại</h3>
<p>Cuốn <em>Making and Breaking the Grid</em> của Timothy Samara coi lưới là một cấu trúc vô hình tổ chức nội dung — chữ, ảnh, khoảng trắng — thành một bố cục nhất quán, dễ theo. Lưới không giới hạn sáng tạo; nó cho sáng tạo một khung ổn định để làm việc bên trong (và để cố ý phá vỡ, khi đã hiểu rõ luật).</p>
<h3>Lưới cột &amp; lưới module</h3>
<ul>
<li><strong>Lưới cột (column grid)</strong> — các cột dọc (vd 12 cột) mà nội dung bám vào; phổ biến cho tài liệu, brochure, trang web.</li>
<li><strong>Lưới module (modular grid)</strong> — cột VÀ dòng tạo thành lưới các ô/module; phổ biến cho bố cục nhiều ảnh (lưới ảnh, dashboard, trang tạp chí).</li>
</ul>
<h3>Lề &amp; gutter</h3>
<ul>
<li><strong>Lề (margin)</strong> — khoảng cách giữa nội dung và cạnh trang/canvas.</li>
<li><strong>Gutter</strong> — khoảng cách giữa hai cột (hoặc hai module).</li>
</ul>
<p>Lề và gutter nhất quán là thứ làm một ấn phẩm nhiều trang/nhiều slide cảm giác "được thiết kế" chứ không phải ghép tuỳ hứng.</p>
<h3>Quy tắc một phần ba (rule of thirds)</h3>
<p>Chia canvas thành lưới 3×3; đặt chủ thể chính dọc theo đường hoặc tại giao điểm thay vì chính giữa — cách đơn giản, nhanh để có bố cục động và cân bằng hơn (mượn từ nhiếp ảnh).</p>
<pre><code>Checklist dựng lưới cho một bố cục mới:
 [ ] Chọn số cột (vd 12 cột để linh hoạt)
 [ ] Đặt lề nhất quán (trên/dưới/trái/phải)
 [ ] Đặt độ rộng gutter nhất quán
 [ ] Bám các khối chữ & ảnh vào lưới
 [ ] Để trống ít nhất một module để "thở"
</code></pre>
<div class="callout"><span class="badge">Phá lưới có chủ đích</span> Khi lưới đã được thiết lập, phá lưới cho MỘT phần tử (vd ảnh hero lớn tràn qua khỏi cột) thu hút chú ý chính vì mọi thứ khác vẫn theo lưới.</div>`,
  ]]);

const c6q = quiz('dtg111-quiz-6', 'Quiz 6 — Layout & grid|||Quiz 6 — Bố cục & lưới', [
  { id: 'q1', question: 'Gutter trong hệ lưới là gì?', options: ['Khoảng cách giữa nội dung và cạnh trang', 'Khoảng cách giữa hai cột (hoặc hai module)', 'Số cột trong lưới', 'Kích cỡ font chữ'], correctIndex: 1, explanation: 'Gutter = khoảng cách giữa các cột/module; margin mới là khoảng cách tới cạnh trang.' },
  { id: 'q2', question: 'Quy tắc một phần ba (rule of thirds) khuyên đặt chủ thể chính ở đâu?', options: ['Chính giữa canvas', 'Trên các đường chia 3×3 hoặc tại giao điểm của chúng', 'Sát mép trên cùng', 'Luôn ở góc phải dưới'], correctIndex: 1, explanation: 'Đặt theo đường/giao điểm lưới 3×3 tạo bố cục động, cân bằng hơn chính giữa.' },
  { id: 'q3', question: 'Vì sao "phá lưới" một cách có chủ đích lại hiệu quả?', options: ['Vì lưới vốn không cần thiết', 'Vì phần bị phá lưới nổi bật đúng nhờ mọi phần khác vẫn theo lưới nhất quán', 'Vì phá lưới giúp tiết kiệm mực in', 'Vì phần mềm thiết kế yêu cầu vậy'], correctIndex: 1, explanation: 'Sự nhất quán của lưới làm cho một ngoại lệ có chủ đích trở nên nổi bật.' },
]);

const c7 = doc('dtg111-7-1-marketing-collateral', '7.1 — Marketing collateral: posters, social & brochures|||7.1 — Thiết kế ấn phẩm marketing: poster, social & brochure',
  'Kích cỡ chuẩn cho poster/social media/brochure; dùng template & brand kit trong Canva/Adobe Express hiệu quả.',
  [[
    `<span class="eyebrow">DTG111 · Chapter 7 · Lesson 7.1</span>
<h2>Marketing collateral: posters, social media &amp; brochures</h2>
<h3>Posters</h3>
<p>A poster must communicate its message in <strong>3 seconds</strong> from a distance — a single bold headline, one strong image, minimal text. Common sizes: A3 (297×420mm) and A2 (420×594mm) for print.</p>
<h3>Social media posts</h3>
<p>Each platform has its own optimal size — designing at the wrong ratio gets content cropped or padded awkwardly.</p>
<pre><code>Common social media sizes (2026, check platform docs for changes):
 Instagram feed post (square)  1080 x 1080 px
 Instagram/Facebook story      1080 x 1920 px
 Facebook feed post            1200 x 630  px
 LinkedIn feed post            1200 x 627  px
</code></pre>
<h3>Brochures</h3>
<p>A <strong>tri-fold brochure</strong> (one page folded into 3 panels) is the marketing workhorse: front panel = hook, inside panels = details/benefits, back panel = contact/CTA. Plan the fold lines BEFORE laying out content, or text ends up hidden in a crease.</p>
<h3>Working efficiently with Canva &amp; Adobe Express</h3>
<ul>
<li><strong>Templates</strong> — a fast starting point, but always adjust colors, fonts and imagery to match the brand — an unedited template looks generic.</li>
<li><strong>Brand kits</strong> (logo, brand colors, brand fonts saved once) keep every new design on-brand automatically and save huge amounts of repeat work.</li>
<li><strong>Resize/Magic Switch</strong> features repurpose one design across multiple platform sizes without rebuilding from scratch.</li>
</ul>
<div class="callout"><span class="badge">Brief first</span> Before opening any tool, know: the audience, the one key message, the required sizes, and the brand assets to use — a design without a brief gets redone.</div>`,
    `<span class="eyebrow">DTG111 · Chương 7 · Bài 7.1</span>
<h2>Ấn phẩm marketing: poster, social media &amp; brochure</h2>
<h3>Poster</h3>
<p>Một poster phải truyền được thông điệp trong <strong>3 giây</strong> nhìn từ xa — một tiêu đề đậm duy nhất, một hình ảnh mạnh, chữ tối thiểu. Cỡ phổ biến: A3 (297×420mm) và A2 (420×594mm) cho in ấn.</p>
<h3>Bài đăng social media</h3>
<p>Mỗi nền tảng có cỡ tối ưu riêng — thiết kế sai tỉ lệ khiến nội dung bị cắt hoặc thêm viền một cách gượng gạo.</p>
<pre><code>Cỡ social media phổ biến (2026, kiểm lại tài liệu nền tảng nếu đổi):
 Bài feed Instagram (vuông)      1080 x 1080 px
 Story Instagram/Facebook        1080 x 1920 px
 Bài feed Facebook                1200 x 630  px
 Bài feed LinkedIn                1200 x 627  px
</code></pre>
<h3>Brochure</h3>
<p><strong>Brochure gấp ba (tri-fold)</strong> (một trang gấp thành 3 mặt) là công cụ chủ lực của marketing: mặt trước = móc câu, mặt trong = chi tiết/lợi ích, mặt sau = liên hệ/CTA. Lên kế hoạch đường gấp TRƯỚC khi dàn nội dung, không thì chữ bị khuất vào nếp gấp.</p>
<h3>Làm việc hiệu quả với Canva &amp; Adobe Express</h3>
<ul>
<li><strong>Template (mẫu)</strong> — điểm khởi đầu nhanh, nhưng luôn chỉnh màu, font, hình ảnh khớp với thương hiệu — một mẫu không chỉnh nhìn chung chung.</li>
<li><strong>Brand kit</strong> (logo, màu thương hiệu, font thương hiệu lưu một lần) giữ mọi thiết kế mới đúng thương hiệu tự động và tiết kiệm rất nhiều công lặp lại.</li>
<li>Tính năng <strong>Resize/Magic Switch</strong> tái sử dụng một thiết kế sang nhiều cỡ nền tảng khác nhau mà không cần dựng lại từ đầu.</li>
</ul>
<div class="callout"><span class="badge">Brief trước</span> Trước khi mở bất kỳ công cụ nào, cần biết: đối tượng, một thông điệp chính, các cỡ cần có, và tài sản thương hiệu để dùng — thiết kế không có brief thường phải làm lại.</div>`,
  ]]);

const c7q = quiz('dtg111-quiz-7', 'Quiz 7 — Marketing collateral|||Quiz 7 — Ấn phẩm marketing', [
  { id: 'q1', question: 'Một poster hiệu quả nên truyền thông điệp trong khoảng thời gian nào?', options: ['30 giây', '3 giây', '3 phút', 'Không giới hạn'], correctIndex: 1, explanation: 'Poster cần truyền được ý chính trong khoảng 3 giây nhìn từ xa.' },
  { id: 'q2', question: 'Vì sao cần lên kế hoạch đường gấp TRƯỚC khi dàn nội dung brochure gấp ba?', options: ['Vì máy in yêu cầu vậy', 'Để tránh chữ hoặc chi tiết quan trọng bị khuất vào nếp gấp', 'Vì Canva không cho gấp nhiều hơn 3', 'Không cần thiết'], correctIndex: 1, explanation: 'Dàn nội dung trước khi biết đường gấp dễ khiến nội dung quan trọng nằm đúng vào nếp gấp.' },
  { id: 'q3', question: 'Brand kit trong Canva/Adobe Express dùng để làm gì?', options: ['Chỉ lưu ảnh nền', 'Lưu logo, màu và font thương hiệu để mọi thiết kế mới tự động đúng thương hiệu', 'Tự động viết nội dung marketing', 'Chuyển raster thành vector'], correctIndex: 1, explanation: 'Brand kit lưu tài sản thương hiệu (logo/màu/font) để áp dụng nhất quán, nhanh.' },
]);

const c8 = doc('dtg111-8-1-export-portfolio', '8.1 — Export standards, print/web & building a portfolio|||8.1 — Xuất file, chuẩn in ấn/web & xây dựng portfolio',
  'Định dạng file (PNG/JPG/SVG/PDF), hệ màu & DPI theo đích in ấn/web, bleed, và cách xây một portfolio nhỏ.',
  [[
    `<span class="eyebrow">DTG111 · Chapter 8 · Lesson 8.1</span>
<h2>Export standards, print/web &amp; building a portfolio</h2>
<h3>Choosing the right file format</h3>
<pre><code>Format  | Best for                      | Notes
--------|--------------------------------|---------------------------------
PNG     | Web graphics, logos, UI        | Supports transparency, lossless
JPG     | Photos, web images             | Smaller size, lossy, no transparency
SVG     | Logos, icons                   | Vector, scales infinitely, tiny size
PDF     | Print files, documents         | Preserves layout, fonts, vector data
</code></pre>
<h3>Print vs. web export checklist</h3>
<pre><code>Print export:
 [ ] Color mode = CMYK
 [ ] Resolution = 300 DPI
 [ ] Include bleed (extra ~3mm past the trim edge, for cutting margin)
 [ ] Fonts outlined/embedded (so the printer doesn't substitute fonts)

Web export:
 [ ] Color mode = RGB
 [ ] Resolution = 72-96 DPI (or export at 2x for retina screens)
 [ ] Compress file size (faster loading)
 [ ] Use SVG for logos/icons, JPG/PNG(WebP) for photos
</code></pre>
<h3>What "bleed" means</h3>
<p><strong>Bleed</strong> is extra artwork extending past the final trim line, so that tiny cutting misalignment doesn't leave an unwanted white sliver at the edge. Any background color or image meant to reach the very edge of a printed piece must extend into the bleed area.</p>
<h3>Building a small portfolio</h3>
<p>Even a first-semester portfolio should show <strong>process, not just polish</strong>: 3-5 pieces (a poster, a social set, a brochure/logo), each with a one-line brief (audience &amp; goal), and — where possible — a "before" sketch or draft next to the final. That process view is what recruiters actually want to see, more than a single flawless final image.</p>
<div class="callout"><span class="badge">Rule of thumb</span> Export for print in CMYK/300 DPI/with bleed, and export for web in RGB/optimized size — mixing the two up is the #1 export mistake for beginners.</div>`,
    `<span class="eyebrow">DTG111 · Chương 8 · Bài 8.1</span>
<h2>Xuất file, chuẩn in ấn/web &amp; xây dựng portfolio</h2>
<h3>Chọn đúng định dạng file</h3>
<pre><code>Định dạng | Phù hợp cho                    | Ghi chú
----------|--------------------------------|---------------------------------
PNG       | Đồ hoạ web, logo, UI            | Có nền trong suốt, không mất chất lượng
JPG       | Ảnh chụp, ảnh web                | Nhẹ hơn, mất chất lượng, không trong suốt
SVG       | Logo, icon                       | Vector, phóng to vô hạn, dung lượng rất nhỏ
PDF       | File in ấn, tài liệu              | Giữ bố cục, font, dữ liệu vector
</code></pre>
<h3>Checklist xuất file cho in ấn vs. web</h3>
<pre><code>Xuất cho in ấn:
 [ ] Hệ màu = CMYK
 [ ] Độ phân giải = 300 DPI
 [ ] Có bleed (thêm ~3mm ngoài đường cắt, làm lề cắt)
 [ ] Font đã outline/nhúng (để máy in không thay font khác)

Xuất cho web:
 [ ] Hệ màu = RGB
 [ ] Độ phân giải = 72-96 DPI (hoặc xuất 2x cho màn hình retina)
 [ ] Nén dung lượng file (tải nhanh hơn)
 [ ] Dùng SVG cho logo/icon, JPG/PNG(WebP) cho ảnh chụp
</code></pre>
<h3>"Bleed" nghĩa là gì</h3>
<p><strong>Bleed</strong> là phần nội dung mở rộng thêm ra ngoài đường cắt cuối cùng, để lệch cắt nhỏ không để lại một dải trắng ngoài ý muốn ở cạnh. Bất kỳ màu nền hoặc ảnh nào cần chạm tới đúng cạnh ấn phẩm in phải được mở rộng vào vùng bleed.</p>
<h3>Xây dựng một portfolio nhỏ</h3>
<p>Dù là portfolio kỳ 1, nên thể hiện <strong>quy trình, không chỉ bản đẹp cuối</strong>: 3-5 ấn phẩm (một poster, một bộ social, một brochure/logo), mỗi cái kèm một dòng brief (đối tượng &amp; mục tiêu), và — nếu có thể — một phác thảo "trước" đặt cạnh bản cuối. Góc nhìn quy trình đó mới là thứ nhà tuyển dụng thực sự muốn thấy, hơn cả một bản cuối hoàn hảo đơn lẻ.</p>
<div class="callout"><span class="badge">Quy tắc tay</span> Xuất cho in ấn ở CMYK/300 DPI/có bleed, và xuất cho web ở RGB/dung lượng tối ưu — lẫn hai thứ này là lỗi xuất file #1 của người mới.</div>`,
  ]]);

const c8q = quiz('dtg111-quiz-8', 'Quiz 8 — Export & portfolio|||Quiz 8 — Xuất file & portfolio', [
  { id: 'q1', question: 'Định dạng nào phù hợp nhất cho logo cần phóng to nhiều cỡ khác nhau?', options: ['JPG', 'SVG', 'PNG nén cao', 'PDF quét'], correctIndex: 1, explanation: 'SVG là vector, phóng to vô hạn mà không mất chất lượng — phù hợp logo/icon.' },
  { id: 'q2', question: '"Bleed" trong xuất file in ấn dùng để làm gì?', options: ['Tăng độ phân giải file', 'Mở rộng nội dung ra ngoài đường cắt để tránh dải trắng khi cắt lệch nhẹ', 'Chuyển ảnh raster sang vector', 'Giảm dung lượng file'], correctIndex: 1, explanation: 'Bleed là phần dư ra ngoài đường cắt, bù cho sai số cắt giấy.' },
  { id: 'q3', question: 'Một portfolio kỳ 1 nên thể hiện điều gì, theo bài học?', options: ['Chỉ bản đẹp cuối cùng, không cần gì khác', 'Quy trình làm việc (brief, phác thảo, bản cuối), không chỉ bản đẹp cuối', 'Càng nhiều ấn phẩm càng tốt, không cần brief', 'Chỉ cần một ấn phẩm duy nhất thật hoàn hảo'], correctIndex: 1, explanation: 'Nhà tuyển dụng muốn thấy quy trình (brief, phác thảo/nháp, bản cuối), không chỉ kết quả cuối.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'DTG111',
    slug: 'dtg111-visual-design-tools-1',
    title: 'Visual Design Tools 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DTG111.webp',
    shortDescription: 'Visual design fundamentals for marketing — CRAP principles, color theory, typography, raster (Photoshop) & vector (Illustrator) graphics, grid layout, and marketing collateral with Canva/Adobe. Bilingual, with examples & quizzes.|||Nền tảng thiết kế thị giác cho marketing — nguyên tắc CRAP, lý thuyết màu, typography, đồ hoạ raster (Photoshop) & vector (Illustrator), bố cục lưới, ấn phẩm marketing với Canva/Adobe. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>DTG111 — Visual Design Tools 1</strong> (kỳ 1, khối Quản trị Kinh doanh) xây <strong>nền tảng thiết kế thị giác cho truyền thông/marketing</strong>. Từ <strong>nguyên tắc thiết kế CRAP</strong> (Contrast/Repetition/Alignment/Proximity) → <strong>màu sắc</strong> (RGB/CMYK, hoà sắc) → <strong>typography</strong> → <strong>đồ hoạ raster</strong> trong <strong>Photoshop</strong> (layer, chỉnh ảnh không phá hủy) → <strong>đồ hoạ vector</strong> trong <strong>Illustrator</strong> (logo, icon) → <strong>bố cục &amp; hệ lưới</strong> → <strong>ấn phẩm marketing</strong> (poster, social, brochure) với Canva/Adobe → <strong>xuất file</strong> đúng chuẩn in ấn/web và xây <strong>portfolio</strong>. Trích dẫn sách Non-Designer Design Book (Williams) và Making and Breaking the Grid (Samara), song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Nguyên tắc CRAP (Contrast/Repetition/Alignment/Proximity) & hệ thống thị giác; bánh xe màu, RGB vs CMYK, hoà sắc; typography (serif/sans-serif, hệ cấp bậc, kerning/leading); đồ hoạ raster & Photoshop (layer, adjustment layer, chỉnh ảnh không phá hủy); đồ hoạ vector & Illustrator (điểm neo, Pen tool, thiết kế logo/icon); hệ lưới cột/module, lề & gutter, rule of thirds; thiết kế poster/social media/brochure với Canva & Adobe Express; xuất file đúng chuẩn (định dạng, CMYK/RGB, DPI, bleed) & xây portfolio.',
    requirements: 'Không cần kiến thức thiết kế trước đó. Nên có/dùng thử Adobe Photoshop, Adobe Illustrator (hoặc bản Creative Cloud thử) và tài khoản Canva miễn phí.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Tài liệu Adobe Photoshop/Illustrator, Canva Design School, sách, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thiết kế thị giác cho truyền thông/marketing, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Nền tảng thiết kế & CRAP|||Chapter 1 — Design foundations & CRAP', description: 'Contrast, Repetition, Alignment, Proximity; hệ thống thị giác.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Màu sắc & lý thuyết màu|||Chapter 2 — Color & color theory', description: 'Bánh xe màu, RGB vs CMYK, hoà sắc, tâm lý màu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Typography cơ bản|||Chapter 3 — Typography basics', description: 'Serif/sans-serif, hệ cấp bậc, ghép font, kerning/leading.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đồ hoạ raster & Photoshop|||Chapter 4 — Raster graphics & Photoshop', description: 'Layer, adjustment layer, chỉnh ảnh không phá hủy.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đồ hoạ vector & Illustrator|||Chapter 5 — Vector graphics & Illustrator', description: 'Điểm neo, Pen tool, thiết kế logo/icon.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Bố cục & hệ lưới|||Chapter 6 — Layout & grid systems', description: 'Lưới cột/module, lề & gutter, rule of thirds.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Ấn phẩm marketing|||Chapter 7 — Marketing collateral', description: 'Poster, social media, brochure với Canva/Adobe.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xuất file & portfolio|||Chapter 8 — Export & portfolio', description: 'Chuẩn in ấn/web, bleed, xây portfolio.', lessons: [c8, c8q] },
  ],
};
