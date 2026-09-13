/**
 * TPG302 — Typography &amp; E-publication (Nghệ thuật chữ & Xuất bản điện tử).
 * Ngành Thiết kế mỹ thuật số, kỳ 4. Giáo trình: Bringhurst "The Elements of
 * Typographic Style", Lupton "Thinking with Type", Muller-Brockmann "Grid
 * Systems", Adobe InDesign. 8 chương song ngữ + quiz. Giữ NGUYÊN
 * slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong nội dung; & → &amp;amp;; < → &amp;lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('tpg302-0-0-tai-lieu', '📚 Course materials &amp; references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Bringhurst, Lupton, Muller-Brockmann), tài liệu Adobe InDesign, web font, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">TPG302 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Typography &amp; E-publication</strong> — type anatomy, classification, measurement, grids, hierarchy, readability, screen &amp; web type, and electronic publishing — in one place. Official slides &amp; syllabus live on <strong>FLM</strong>; below are the classic references and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for TPG302 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core reference books</h3>
<ul>
<li><em>The Elements of Typographic Style</em> — Robert Bringhurst (the field's standard)</li>
<li><a href="https://thinkingwithtype.com/" target="_blank" rel="noopener"><em>Thinking with Type</em> — Ellen Lupton</a></li>
<li><em>Grid Systems in Graphic Design</em> — Josef Muller-Brockmann</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://helpx.adobe.com/indesign/user-guide.html" target="_blank" rel="noopener">Adobe InDesign — official user guide</a></li>
<li><a href="https://fonts.google.com/knowledge" target="_blank" rel="noopener">Google Fonts Knowledge — typography glossary &amp; lessons</a></li>
<li><a href="https://practicaltypography.com/" target="_blank" rel="noopener">Butterick's Practical Typography</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFutur" target="_blank" rel="noopener">The Futur</a> — typography &amp; design theory</li>
<li><a href="https://www.youtube.com/results?search_query=typography+basics" target="_blank" rel="noopener">Typography basics</a> — anatomy, kerning, hierarchy</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a> — free web fonts &amp; pairing</li>
<li><a href="https://type-scale.com/" target="_blank" rel="noopener">Type Scale</a> — build a modular type scale</li>
<li><a href="https://www.kerntype.method.ac/" target="_blank" rel="noopener">Kern Type</a> — the kerning game</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — read the anatomy of type, learn to name the parts of a letter.</li>
<li><strong>Measure</strong> — points, leading, kerning &amp; tracking until the numbers feel natural.</li>
<li><strong>Compose</strong> — build a grid, set a hierarchy, and control readability with space and contrast.</li>
<li><strong>Publish</strong> — take type to screen (web fonts, responsive) and produce an EPUB / interactive PDF in InDesign.</li>
</ol></div>`,
    `<span class="eyebrow">TPG302 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Nghệ thuật chữ &amp; Xuất bản điện tử</strong> — giải phẫu chữ, phân loại, đo lường, hệ lưới, phân cấp, khả năng đọc, chữ cho màn hình &amp; web, và xuất bản điện tử — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là sách kinh điển và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của TPG302 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><em>The Elements of Typographic Style</em> — Robert Bringhurst (chuẩn mực của ngành)</li>
<li><a href="https://thinkingwithtype.com/" target="_blank" rel="noopener"><em>Thinking with Type</em> — Ellen Lupton</a></li>
<li><em>Grid Systems in Graphic Design</em> — Josef Muller-Brockmann</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://helpx.adobe.com/indesign/user-guide.html" target="_blank" rel="noopener">Adobe InDesign — hướng dẫn chính thức</a></li>
<li><a href="https://fonts.google.com/knowledge" target="_blank" rel="noopener">Google Fonts Knowledge — từ điển &amp; bài học typography</a></li>
<li><a href="https://practicaltypography.com/" target="_blank" rel="noopener">Butterick's Practical Typography</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFutur" target="_blank" rel="noopener">The Futur</a> — lý thuyết typography &amp; thiết kế</li>
<li><a href="https://www.youtube.com/results?search_query=typography+basics" target="_blank" rel="noopener">Typography basics</a> — giải phẫu, kerning, phân cấp</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a> — web font miễn phí &amp; ghép cặp</li>
<li><a href="https://type-scale.com/" target="_blank" rel="noopener">Type Scale</a> — dựng thang chữ theo module</li>
<li><a href="https://www.kerntype.method.ac/" target="_blank" rel="noopener">Kern Type</a> — trò chơi luyện kerning</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — đọc giải phẫu chữ, gọi được tên từng bộ phận của một con chữ.</li>
<li><strong>Đo lường</strong> — point, leading, kerning &amp; tracking đến khi con số thành phản xạ.</li>
<li><strong>Bố cục</strong> — dựng lưới, đặt phân cấp, kiểm soát khả năng đọc bằng khoảng trắng và tương phản.</li>
<li><strong>Xuất bản</strong> — đưa chữ lên màn hình (web font, responsive) và làm EPUB / PDF tương tác trong InDesign.</li>
</ol></div>`,
  ]]);

const intro = doc('tpg302-0-1-overview', 'Course overview: Typography &amp; E-publication|||Tổng quan: Nghệ thuật chữ &amp; Xuất bản điện tử',
  'Typography làm gì; vì sao chữ là 95% của thiết kế đồ hoạ; lộ trình: giải phẫu &amp; phân loại chữ → đo lường → lưới &amp; phân cấp → khả năng đọc → chữ cho web → xuất bản điện tử (EPUB/PDF/InDesign).',
  [[
    `<span class="eyebrow">TPG302 · Lesson 0.1 · Overview</span>
<h2>Typography &amp; E-publication</h2>
<p class="lead">This course teaches you to <strong>arrange type so it is beautiful, readable and purposeful</strong> — the craft behind books, magazines, websites and e-publications. You will learn the anatomy and history of letterforms, how to measure and space type, build grids, set hierarchy, and finally publish for screen: web pages, EPUB and interactive PDF.</p>
<h3>Why typography matters</h3>
<p>It's often said that <strong>typography is about 95% of graphic design</strong> — most of what a reader looks at is words. Good typography is largely invisible: it lets the reader absorb the message without friction. As Bringhurst puts it, typography exists to <em>honor the content</em>.</p>
<h3>What "e-publication" adds</h3>
<p>Beyond print, we produce <strong>electronic publications</strong> — reflowable EPUB e-books, interactive PDFs, and digital magazines — where type must adapt to any screen size while keeping the same discipline of measure, hierarchy and readability.</p>
<h3>Roadmap</h3>
<p>Anatomy &amp; history → classification (serif / sans / script) → measurement (point, leading, kerning, tracking) → grids &amp; layout → hierarchy &amp; contrast → color, negative space &amp; readability → screen &amp; web type → electronic publishing (EPUB, interactive PDF, InDesign). Bilingual, with worked type specs and a quiz each chapter.</p>`,
    `<span class="eyebrow">TPG302 · Bài 0.1 · Tổng quan</span>
<h2>Nghệ thuật chữ &amp; Xuất bản điện tử</h2>
<p class="lead">Môn này dạy bạn <strong>sắp đặt chữ sao cho đẹp, dễ đọc và đúng mục đích</strong> — nghề đứng sau sách, tạp chí, website và ấn phẩm điện tử. Bạn học giải phẫu và lịch sử con chữ, cách đo và giãn chữ, dựng lưới, đặt phân cấp, và cuối cùng xuất bản cho màn hình: trang web, EPUB và PDF tương tác.</p>
<h3>Vì sao typography quan trọng</h3>
<p>Người ta hay nói <strong>typography chiếm khoảng 95% của thiết kế đồ hoạ</strong> — phần lớn thứ độc giả nhìn là chữ. Typography tốt gần như vô hình: nó để người đọc tiếp nhận thông điệp mà không vấp. Như Bringhurst nói, typography tồn tại để <em>tôn trọng nội dung</em>.</p>
<h3>"Xuất bản điện tử" thêm gì</h3>
<p>Ngoài in ấn, ta làm <strong>ấn phẩm điện tử</strong> — sách EPUB tái dòng (reflowable), PDF tương tác, và tạp chí số — nơi chữ phải thích ứng mọi kích thước màn hình mà vẫn giữ kỷ luật về đo lường, phân cấp và khả năng đọc.</p>
<h3>Lộ trình</h3>
<p>Giải phẫu &amp; lịch sử → phân loại (serif / sans / script) → đo lường (point, leading, kerning, tracking) → lưới &amp; bố cục → phân cấp &amp; tương phản → màu, không gian âm &amp; khả năng đọc → chữ cho màn hình &amp; web → xuất bản điện tử (EPUB, PDF tương tác, InDesign). Song ngữ, có thông số chữ mẫu và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('tpg302-1-1-anatomy', '1.1 — History &amp; anatomy of type|||1.1 — Lịch sử &amp; giải phẫu chữ',
  'Từ Gutenberg đến chữ số; giải phẫu con chữ: baseline, x-height, cap height, ascender, descender, serif, counter, stem, bowl, terminal.',
  [[
    `<span class="eyebrow">TPG302 · Chapter 1 · Lesson 1.1</span>
<h2>History &amp; anatomy of type</h2>
<h3>A short history</h3>
<p>Movable metal type began with <strong>Gutenberg (c. 1450)</strong>, imitating the handwritten blackletter of scribes. Renaissance punchcutters gave us the humanist <strong>serif</strong>; the industrial era brought bold display faces and the first <strong>sans-serifs</strong>; the 20th century added grid-based modernism and, finally, <strong>digital type</strong> (PostScript, TrueType, OpenType) that we scale freely today.</p>
<h3>Anatomy — naming the parts</h3>
<p>To talk about type precisely you must name its parts. The key horizontal guides:</p>
<pre><code>Vertical metrics of a typeface:
  Cap height  --- top of capital letters (H, E)
  Ascender    --- top of b, d, h, k, l (often above cap height)
  x-height    --- height of the lowercase x (body of a, e, n)
  Baseline    --- the line letters "sit" on
  Descender   --- bottom of g, j, p, q, y
</code></pre>
<h3>Parts of a single glyph</h3>
<ul>
<li><strong>Stem</strong> — the main vertical stroke; <strong>bowl</strong> — the curved stroke enclosing a space (in b, o, p).</li>
<li><strong>Counter</strong> — the enclosed or partly enclosed white space (inside o, e, a).</li>
<li><strong>Serif</strong> — the small finishing stroke at a stem's end; <strong>terminal</strong> — the end of a stroke with no serif.</li>
<li><strong>Ascender / descender</strong> — the parts rising above the x-height or dropping below the baseline.</li>
</ul>
<div class="callout"><span class="badge">Why x-height matters</span> A large x-height makes a font look bigger and often more readable at small sizes — it's why two fonts at the same point size can look very different.</div>`,
    `<span class="eyebrow">TPG302 · Chương 1 · Bài 1.1</span>
<h2>Lịch sử &amp; giải phẫu chữ</h2>
<h3>Lịch sử ngắn</h3>
<p>Chữ kim loại rời bắt đầu với <strong>Gutenberg (khoảng 1450)</strong>, mô phỏng chữ blackletter viết tay của thầy chép. Thợ khắc thời Phục Hưng cho ta chữ <strong>serif</strong> nhân văn; thời công nghiệp mang tới các kiểu chữ tít đậm và <strong>sans-serif</strong> đầu tiên; thế kỷ 20 thêm chủ nghĩa hiện đại dựa trên lưới và cuối cùng là <strong>chữ số hoá</strong> (PostScript, TrueType, OpenType) mà ta phóng to tuỳ ý ngày nay.</p>
<h3>Giải phẫu — gọi tên các bộ phận</h3>
<p>Để nói về chữ cho chính xác, bạn phải gọi được tên các bộ phận. Các đường ngang then chốt:</p>
<pre><code>Metric dọc của một kiểu chữ:
  Cap height  --- đỉnh chữ hoa (H, E)
  Ascender    --- đỉnh b, d, h, k, l (thường cao hơn cap height)
  x-height    --- chiều cao chữ x thường (thân a, e, n)
  Baseline    --- đường chữ "đứng" lên
  Descender   --- đáy g, j, p, q, y
</code></pre>
<h3>Bộ phận của một con chữ</h3>
<ul>
<li><strong>Stem (thân)</strong> — nét dọc chính; <strong>bowl (bụng)</strong> — nét cong bao quanh một khoảng (trong b, o, p).</li>
<li><strong>Counter (khoảng trong)</strong> — khoảng trắng khép kín hoặc bán khép (bên trong o, e, a).</li>
<li><strong>Serif (chân)</strong> — nét kết nhỏ ở đầu thân; <strong>terminal (đầu nét)</strong> — điểm kết của nét không có serif.</li>
<li><strong>Ascender / descender</strong> — phần vươn trên x-height hoặc thả dưới baseline.</li>
</ul>
<div class="callout"><span class="badge">Vì sao x-height quan trọng</span> x-height lớn khiến font trông to hơn và thường dễ đọc hơn ở cỡ nhỏ — đó là lý do hai font cùng point size lại trông rất khác nhau.</div>`,
  ]]);

const c1q = quiz('tpg302-quiz-1', 'Quiz 1 — Anatomy of type|||Quiz 1 — Giải phẫu chữ', [
  { id: 'q1', question: 'Đường mà các con chữ "đứng" lên gọi là gì?', options: ['x-height', 'Baseline (đường cơ sở)', 'Cap height', 'Descender'], correctIndex: 1, explanation: 'Baseline là đường ngang mà phần lớn các con chữ đặt lên trên.' },
  { id: 'q2', question: 'x-height là chiều cao của?', options: ['Chữ hoa H', 'Chữ x thường (thân a, e, n)', 'Ascender', 'Serif'], correctIndex: 1, explanation: 'x-height = chiều cao thân chữ thường, đo bằng chữ x; ảnh hưởng cảm giác to/nhỏ và độ dễ đọc.' },
  { id: 'q3', question: 'Nét kết nhỏ ở đầu thân chữ (trong font có "chân") gọi là?', options: ['Counter', 'Bowl', 'Serif', 'Stem'], correctIndex: 2, explanation: 'Serif là nét chân nhỏ; font không có nó gọi là sans-serif.' },
]);

const c2 = doc('tpg302-2-1-classification', '2.1 — Type classification|||2.1 — Phân loại kiểu chữ',
  'Serif (old-style, transitional, modern, slab), sans-serif (grotesque, humanist, geometric), script, display/monospace; chọn font theo mục đích và ghép cặp.',
  [[
    `<span class="eyebrow">TPG302 · Chapter 2 · Lesson 2.1</span>
<h2>Type classification</h2>
<p class="lead">Knowing the families lets you choose the right voice and pair fonts that work together.</p>
<h3>Serif — has finishing strokes</h3>
<ul>
<li><strong>Old-style</strong> (Garamond) — diagonal stress, low contrast; classic, bookish.</li>
<li><strong>Transitional / Modern</strong> (Times, Didot) — vertical stress, high thick/thin contrast; elegant, formal.</li>
<li><strong>Slab serif</strong> (Rockwell) — thick block serifs; sturdy, editorial.</li>
</ul>
<h3>Sans-serif — no serifs</h3>
<ul>
<li><strong>Grotesque</strong> (Helvetica) — neutral, workhorse.</li>
<li><strong>Humanist</strong> (Frutiger) — warmer, calligraphic proportions; very readable.</li>
<li><strong>Geometric</strong> (Futura) — built from circles &amp; straight lines; modern, cool.</li>
</ul>
<h3>Script, display &amp; monospace</h3>
<ul>
<li><strong>Script</strong> — imitates handwriting; for invitations/logos, never body text.</li>
<li><strong>Display</strong> — designed for large headlines only.</li>
<li><strong>Monospace</strong> — every glyph the same width; for code.</li>
</ul>
<div class="callout"><span class="badge">Pairing rule of thumb</span> Pair fonts that <em>contrast</em> (e.g. a serif for body + a sans for headings), not two that are almost-but-not-quite alike. One family with many weights is often enough.</div>`,
    `<span class="eyebrow">TPG302 · Chương 2 · Bài 2.1</span>
<h2>Phân loại kiểu chữ</h2>
<p class="lead">Biết các họ chữ giúp bạn chọn đúng "giọng" và ghép các font ăn ý với nhau.</p>
<h3>Serif — có nét chân</h3>
<ul>
<li><strong>Old-style</strong> (Garamond) — trục nghiêng, tương phản thấp; cổ điển, hợp sách.</li>
<li><strong>Transitional / Modern</strong> (Times, Didot) — trục dọc, tương phản dày/mảnh cao; thanh lịch, trang trọng.</li>
<li><strong>Slab serif</strong> (Rockwell) — chân khối dày; chắc chắn, hợp báo chí.</li>
</ul>
<h3>Sans-serif — không chân</h3>
<ul>
<li><strong>Grotesque</strong> (Helvetica) — trung tính, đa dụng.</li>
<li><strong>Humanist</strong> (Frutiger) — ấm hơn, tỉ lệ thư pháp; rất dễ đọc.</li>
<li><strong>Geometric</strong> (Futura) — dựng từ hình tròn &amp; đường thẳng; hiện đại, lạnh.</li>
</ul>
<h3>Script, display &amp; monospace</h3>
<ul>
<li><strong>Script</strong> — bắt chước chữ viết tay; cho thiệp/logo, không dùng cho thân bài.</li>
<li><strong>Display</strong> — thiết kế chỉ để làm tít lớn.</li>
<li><strong>Monospace</strong> — mọi con chữ cùng bề rộng; dùng cho code.</li>
</ul>
<div class="callout"><span class="badge">Mẹo ghép font</span> Ghép các font <em>tương phản</em> (vd serif cho thân + sans cho tít), đừng ghép hai font gần-giống-mà-không-giống. Một họ chữ nhiều trọng lượng (weight) thường là đủ.</div>`,
  ]]);

const c2q = quiz('tpg302-quiz-2', 'Quiz 2 — Classification|||Quiz 2 — Phân loại', [
  { id: 'q1', question: 'Font KHÔNG có nét chân gọi chung là?', options: ['Serif', 'Sans-serif', 'Slab serif', 'Script'], correctIndex: 1, explanation: 'Sans-serif ("không serif") là các font không có nét chân, vd Helvetica, Futura.' },
  { id: 'q2', question: 'Loại font nào mọi con chữ đều CÙNG bề rộng, hợp để hiển thị code?', options: ['Script', 'Geometric sans', 'Monospace', 'Display'], correctIndex: 2, explanation: 'Monospace cho mỗi glyph cùng chiều rộng, giúp code thẳng cột.' },
  { id: 'q3', question: 'Font "script" (bắt chước chữ viết tay) nên dùng cho?', options: ['Thân bài dài', 'Thiệp mời, logo, tiêu đề ngắn', 'Bảng dữ liệu', 'Code'], correctIndex: 1, explanation: 'Script khó đọc khi dài; chỉ hợp tiêu đề ngắn, thiệp, logo.' },
]);

const c3 = doc('tpg302-3-1-measurement', '3.1 — Typographic measurement|||3.1 — Đo lường typographic',
  'Point &amp; pica; font size vs leading (line-height); kerning (cặp chữ) vs tracking (cả đoạn); em/en; đơn vị em, rem, ch trên web.',
  [[
    `<span class="eyebrow">TPG302 · Chapter 3 · Lesson 3.1</span>
<h2>Typographic measurement</h2>
<h3>Point &amp; pica</h3>
<p>Type is measured in <strong>points</strong>: 1 point = 1/72 inch, and 12 points = 1 <strong>pica</strong>. "Font size" is the point size of the body — but note it does not equal the visible letter height (that's the x-height and cap height).</p>
<h3>Leading — the space between lines</h3>
<p><strong>Leading</strong> (rhymes with "wedding") is the vertical distance from one baseline to the next — on the web it's <code>line-height</code>. A comfortable body setting is roughly <strong>1.4-1.6x</strong> the font size.</p>
<pre><code>CSS body text example:
  font-size: 16px;
  line-height: 1.5;   /* = 24px leading */
  max-width: 66ch;    /* ~66 characters per line */
</code></pre>
<h3>Kerning vs tracking</h3>
<ul>
<li><strong>Kerning</strong> — adjusting space between a <em>specific pair</em> of letters (e.g. "AV", "To") so gaps look even.</li>
<li><strong>Tracking (letter-spacing)</strong> — adding/removing space uniformly across a <em>whole run</em> of text. Small caps and all-caps usually need a little positive tracking.</li>
</ul>
<h3>Em &amp; en</h3>
<p>An <strong>em</strong> equals the current font size (16px font -> 1em = 16px); an <strong>en</strong> is half an em. The em-dash (—) and en-dash (–) get their names here.</p>
<div class="callout"><span class="badge">Kern vs track</span> Kerning fixes ONE pair; tracking spaces the WHOLE line. Don't fix a bad pair by tracking the entire word.</div>`,
    `<span class="eyebrow">TPG302 · Chương 3 · Bài 3.1</span>
<h2>Đo lường typographic</h2>
<h3>Point &amp; pica</h3>
<p>Chữ được đo bằng <strong>point</strong>: 1 point = 1/72 inch, và 12 point = 1 <strong>pica</strong>. "Cỡ chữ" (font size) là point size của thân chữ — nhưng lưu ý nó không bằng chiều cao con chữ nhìn thấy (đó là x-height và cap height).</p>
<h3>Leading — khoảng cách giữa các dòng</h3>
<p><strong>Leading</strong> (đọc như "led") là khoảng cách dọc từ baseline này tới baseline kế — trên web là <code>line-height</code>. Thân bài dễ đọc thường đặt khoảng <strong>1.4-1.6 lần</strong> cỡ chữ.</p>
<pre><code>Ví dụ CSS cho thân bài:
  font-size: 16px;
  line-height: 1.5;   /* = leading 24px */
  max-width: 66ch;    /* ~66 ký tự mỗi dòng */
</code></pre>
<h3>Kerning vs tracking</h3>
<ul>
<li><strong>Kerning</strong> — chỉnh khoảng giữa một <em>cặp chữ cụ thể</em> (vd "AV", "To") cho khe trông đều.</li>
<li><strong>Tracking (letter-spacing)</strong> — thêm/bớt khoảng đều nhau trên <em>cả một đoạn</em> chữ. Chữ small caps và chữ hoa toàn phần thường cần tracking dương một chút.</li>
</ul>
<h3>Em &amp; en</h3>
<p>Một <strong>em</strong> bằng cỡ chữ hiện tại (font 16px -> 1em = 16px); một <strong>en</strong> bằng nửa em. Gạch em (—) và gạch en (–) lấy tên từ đây.</p>
<div class="callout"><span class="badge">Kern vs track</span> Kerning sửa MỘT cặp; tracking giãn CẢ dòng. Đừng sửa một cặp xấu bằng cách tracking cả từ.</div>`,
  ]]);

const c3q = quiz('tpg302-quiz-3', 'Quiz 3 — Measurement|||Quiz 3 — Đo lường', [
  { id: 'q1', question: 'Khoảng cách dọc giữa hai dòng chữ (line-height trên web) gọi là?', options: ['Kerning', 'Tracking', 'Leading', 'Pica'], correctIndex: 2, explanation: 'Leading = khoảng cách baseline-tới-baseline; trên web là line-height.' },
  { id: 'q2', question: 'Chỉnh khoảng cách giữa MỘT cặp chữ cụ thể (như "AV") gọi là?', options: ['Kerning', 'Tracking', 'Leading', 'Indent'], correctIndex: 0, explanation: 'Kerning tinh chỉnh từng cặp; tracking mới là giãn đều cả đoạn.' },
  { id: 'q3', question: '1 point bằng bao nhiêu inch?', options: ['1/12 inch', '1/72 inch', '1/6 inch', '1/100 inch'], correctIndex: 1, explanation: '1 point = 1/72 inch; 12 point = 1 pica.' },
]);

const c4 = doc('tpg302-4-1-grid', '4.1 — Grid systems &amp; page layout|||4.1 — Hệ lưới &amp; bố cục trang',
  'Muller-Brockmann: cột, module, margin, gutter, baseline grid; lưới 12 cột trên web; đặt nội dung theo lưới cho nhất quán.',
  [[
    `<span class="eyebrow">TPG302 · Chapter 4 · Lesson 4.1</span>
<h2>Grid systems &amp; page layout</h2>
<p class="lead">Josef Muller-Brockmann's grid systems give a layout order, rhythm and consistency — the invisible scaffolding behind clean design.</p>
<h3>Parts of a grid</h3>
<ul>
<li><strong>Columns</strong> — vertical divisions text and images align to.</li>
<li><strong>Gutter</strong> — the space between columns (keeps them from touching).</li>
<li><strong>Margin</strong> — the breathing space around the whole page.</li>
<li><strong>Module</strong> — a cell formed where columns meet horizontal rows.</li>
<li><strong>Baseline grid</strong> — evenly spaced horizontal lines so text across columns lines up.</li>
</ul>
<h3>The 12-column web grid</h3>
<p>The web standardized on a <strong>12-column</strong> grid because 12 divides evenly into 2, 3, 4 and 6 — so you can make halves, thirds and quarters from one system.</p>
<pre><code>CSS grid, 12 columns:
  .page {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 24px;              /* gutter */
  }
  .feature { grid-column: 1 / 8; }   /* spans 7 columns */
  .sidebar { grid-column: 8 / 13; }  /* spans 5 columns */
</code></pre>
<div class="callout"><span class="badge">Freedom through constraint</span> A grid isn't a cage. Establish it, then break it deliberately for emphasis — a designed exception reads as intentional; a random one reads as a mistake.</div>`,
    `<span class="eyebrow">TPG302 · Chương 4 · Bài 4.1</span>
<h2>Hệ lưới &amp; bố cục trang</h2>
<p class="lead">Hệ lưới của Josef Muller-Brockmann mang lại trật tự, nhịp điệu và sự nhất quán cho bố cục — bộ khung vô hình đứng sau thiết kế gọn gàng.</p>
<h3>Các thành phần của lưới</h3>
<ul>
<li><strong>Cột (columns)</strong> — các chia dọc mà chữ và ảnh canh theo.</li>
<li><strong>Gutter (rãnh)</strong> — khoảng giữa các cột (giúp chúng không dính nhau).</li>
<li><strong>Margin (lề)</strong> — khoảng thở quanh cả trang.</li>
<li><strong>Module (ô)</strong> — ô tạo ra nơi cột giao với hàng ngang.</li>
<li><strong>Baseline grid</strong> — các đường ngang cách đều để chữ giữa các cột thẳng hàng nhau.</li>
</ul>
<h3>Lưới 12 cột trên web</h3>
<p>Web chuẩn hoá theo lưới <strong>12 cột</strong> vì 12 chia hết cho 2, 3, 4 và 6 — nên từ một hệ ta tạo được nửa, một phần ba và một phần tư.</p>
<pre><code>CSS grid, 12 cột:
  .page {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 24px;              /* gutter */
  }
  .feature { grid-column: 1 / 8; }   /* chiếm 7 cột */
  .sidebar { grid-column: 8 / 13; }  /* chiếm 5 cột */
</code></pre>
<div class="callout"><span class="badge">Tự do nhờ ràng buộc</span> Lưới không phải cái lồng. Dựng nó lên, rồi phá có chủ đích để nhấn mạnh — một ngoại lệ được thiết kế đọc ra là cố ý; một ngoại lệ ngẫu nhiên đọc ra là lỗi.</div>`,
  ]]);

const c4q = quiz('tpg302-quiz-4', 'Quiz 4 — Grid systems|||Quiz 4 — Hệ lưới', [
  { id: 'q1', question: 'Khoảng trống GIỮA các cột trong lưới gọi là?', options: ['Margin (lề)', 'Gutter (rãnh)', 'Module (ô)', 'Baseline'], correctIndex: 1, explanation: 'Gutter là rãnh giữa các cột; margin là lề quanh cả trang.' },
  { id: 'q2', question: 'Vì sao web hay dùng lưới 12 cột?', options: ['Vì 12 là số may mắn', 'Vì 12 chia hết cho 2, 3, 4 và 6 → dễ tạo nửa/ba/tư', 'Vì màn hình có 12 inch', 'Vì CSS bắt buộc 12'], correctIndex: 1, explanation: '12 chia đều cho 2,3,4,6 nên linh hoạt chia bố cục.' },
  { id: 'q3', question: 'Người gắn liền với "Grid Systems in Graphic Design" là?', options: ['Robert Bringhurst', 'Ellen Lupton', 'Josef Muller-Brockmann', 'Gutenberg'], correctIndex: 2, explanation: 'Muller-Brockmann là tác giả kinh điển về hệ lưới.' },
]);

const c5 = doc('tpg302-5-1-hierarchy', '5.1 — Hierarchy &amp; contrast|||5.1 — Phân cấp &amp; tương phản chữ',
  'Dẫn mắt người đọc bằng thang chữ (type scale), trọng lượng, hoa/thường, màu, khoảng cách; nhấn qua tương phản (kích thước, weight, style, màu).',
  [[
    `<span class="eyebrow">TPG302 · Chapter 5 · Lesson 5.1</span>
<h2>Hierarchy &amp; contrast</h2>
<p class="lead">Hierarchy is how type <strong>guides the eye</strong> — telling the reader what to look at first, second, third. It's built almost entirely from contrast.</p>
<h3>Tools of contrast</h3>
<ul>
<li><strong>Size</strong> — bigger = more important (headline &gt; subhead &gt; body).</li>
<li><strong>Weight</strong> — bold pulls attention out of a block of regular text.</li>
<li><strong>Style / case</strong> — italics, small caps, ALL CAPS mark a different role.</li>
<li><strong>Color &amp; space</strong> — a different color or extra whitespace also signals rank.</li>
</ul>
<h3>A modular type scale</h3>
<p>Rather than picking sizes at random, derive them from a <strong>ratio</strong> (e.g. 1.25, the "major third"). Each step multiplies the last, giving a harmonious scale:</p>
<pre><code>Base 16px, ratio 1.25:
  body   16px
  h4     20px   (16 x 1.25)
  h3     25px
  h2     31px
  h1     39px
</code></pre>
<div class="callout"><span class="badge">Three levels are usually enough</span> Most pages only need heading, subheading and body. If everything is emphasized, nothing is — restraint creates hierarchy.</div>`,
    `<span class="eyebrow">TPG302 · Chương 5 · Bài 5.1</span>
<h2>Phân cấp &amp; tương phản</h2>
<p class="lead">Phân cấp là cách chữ <strong>dẫn mắt</strong> — bảo người đọc nhìn cái gì trước, cái gì sau. Nó gần như hoàn toàn dựng từ tương phản.</p>
<h3>Công cụ tạo tương phản</h3>
<ul>
<li><strong>Kích thước</strong> — to hơn = quan trọng hơn (tít &gt; tít phụ &gt; thân).</li>
<li><strong>Trọng lượng (weight)</strong> — chữ đậm kéo sự chú ý ra khỏi khối chữ thường.</li>
<li><strong>Kiểu / hoa-thường</strong> — nghiêng, small caps, CHỮ HOA đánh dấu vai trò khác.</li>
<li><strong>Màu &amp; khoảng trắng</strong> — màu khác hoặc thêm khoảng trắng cũng báo thứ bậc.</li>
</ul>
<h3>Thang chữ theo module</h3>
<p>Thay vì chọn cỡ tuỳ hứng, hãy suy ra từ một <strong>tỉ lệ</strong> (vd 1.25, quãng "ba trưởng"). Mỗi bước nhân với bước trước, cho một thang hài hoà:</p>
<pre><code>Gốc 16px, tỉ lệ 1.25:
  body   16px
  h4     20px   (16 x 1.25)
  h3     25px
  h2     31px
  h1     39px
</code></pre>
<div class="callout"><span class="badge">Ba mức thường là đủ</span> Phần lớn trang chỉ cần tít, tít phụ và thân. Nếu nhấn mạnh mọi thứ thì chẳng có gì được nhấn — sự tiết chế tạo ra phân cấp.</div>`,
  ]]);

const c5q = quiz('tpg302-quiz-5', 'Quiz 5 — Hierarchy|||Quiz 5 — Phân cấp', [
  { id: 'q1', question: 'Phân cấp typographic chủ yếu được tạo ra bằng?', options: ['Chọn màu ngẫu nhiên', 'Tương phản (kích thước, weight, kiểu, màu, khoảng cách)', 'Dùng thật nhiều font', 'Căn giữa mọi thứ'], correctIndex: 1, explanation: 'Hierarchy dựng từ tương phản để dẫn mắt người đọc.' },
  { id: 'q2', question: 'Thang chữ (type scale) theo module được suy ra từ?', options: ['Một tỉ lệ nhân liên tiếp (vd 1.25)', 'Số trang', 'Kích thước màn hình', 'Số cột lưới'], correctIndex: 0, explanation: 'Mỗi cỡ = cỡ trước × tỉ lệ, cho thang hài hoà.' },
  { id: 'q3', question: 'Nếu MỌI thứ trên trang đều được nhấn mạnh thì?', options: ['Trang trông chuyên nghiệp hơn', 'Không có gì thực sự được nhấn — mất phân cấp', 'Người đọc đọc nhanh hơn', 'Tăng khả năng đọc'], correctIndex: 1, explanation: 'Nhấn tất cả = không nhấn gì; tiết chế mới tạo phân cấp.' },
]);

const c6 = doc('tpg302-6-1-readability', '6.1 — Color, negative space &amp; readability|||6.1 — Màu, không gian âm &amp; khả năng đọc',
  'Legibility vs readability; độ dài dòng (measure ~45-75 ký tự); tương phản màu (WCAG); không gian âm/khoảng trắng; căn lề trái vs justify.',
  [[
    `<span class="eyebrow">TPG302 · Chapter 6 · Lesson 6.1</span>
<h2>Color, negative space &amp; readability</h2>
<h3>Legibility vs readability</h3>
<p><strong>Legibility</strong> is how easily one letter is told from another (a property of the typeface). <strong>Readability</strong> is how easily a whole passage flows (a property of how you set it). You can make a legible font unreadable with bad spacing.</p>
<h3>Line length (measure)</h3>
<p>The comfortable <strong>measure</strong> is about <strong>45-75 characters per line</strong> (~66 is ideal). Too long and the eye loses the next line's start; too short and it jumps too often. On the web, <code>max-width: 66ch;</code> enforces this.</p>
<h3>Color contrast</h3>
<p>Text must have enough <strong>contrast</strong> against its background. <strong>WCAG</strong> asks for a ratio of at least <strong>4.5:1</strong> for normal body text (3:1 for large text). Light-gray-on-white fails many readers.</p>
<pre><code>WCAG contrast targets:
  Body text (normal)  >= 4.5 : 1
  Large text (>=24px) >= 3.0 : 1
  Example: #595959 on #ffffff = ~7:1  (passes)
</code></pre>
<h3>Negative space &amp; alignment</h3>
<p><strong>Negative space</strong> (whitespace) isn't empty — it groups, separates and rests the eye. Prefer <strong>flush-left / ragged-right</strong> for screens; full <strong>justification</strong> needs hyphenation or it opens ugly "rivers" of white.</p>
<div class="callout"><span class="badge">Readability first</span> If a reader has to work to read it, the design has failed — no matter how pretty.</div>`,
    `<span class="eyebrow">TPG302 · Chương 6 · Bài 6.1</span>
<h2>Màu, không gian âm &amp; khả năng đọc</h2>
<h3>Legibility vs readability</h3>
<p><strong>Legibility (rõ mặt chữ)</strong> là mức dễ phân biệt một con chữ với chữ khác (thuộc tính của kiểu chữ). <strong>Readability (dễ đọc)</strong> là mức trôi chảy của cả đoạn (thuộc tính của cách bạn sắp đặt). Bạn có thể làm một font rõ mặt chữ trở nên khó đọc bằng cách giãn dòng tệ.</p>
<h3>Độ dài dòng (measure)</h3>
<p><strong>Measure</strong> dễ chịu là khoảng <strong>45-75 ký tự mỗi dòng</strong> (~66 là lý tưởng). Quá dài, mắt lạc mất đầu dòng kế; quá ngắn, mắt nhảy quá thường xuyên. Trên web, <code>max-width: 66ch;</code> ép được điều này.</p>
<h3>Tương phản màu</h3>
<p>Chữ phải đủ <strong>tương phản</strong> với nền. <strong>WCAG</strong> đòi tỉ lệ tối thiểu <strong>4.5:1</strong> cho thân chữ thường (3:1 cho chữ lớn). Chữ xám nhạt trên nền trắng khiến nhiều người đọc không nổi.</p>
<pre><code>Mục tiêu tương phản WCAG:
  Thân chữ (thường)  >= 4.5 : 1
  Chữ lớn (>=24px)   >= 3.0 : 1
  Ví dụ: #595959 trên #ffffff = ~7:1  (đạt)
</code></pre>
<h3>Không gian âm &amp; căn lề</h3>
<p><strong>Không gian âm</strong> (khoảng trắng) không phải chỗ trống vô nghĩa — nó gom nhóm, tách biệt và cho mắt nghỉ. Nên dùng <strong>căn trái / lề phải răng cưa</strong> cho màn hình; <strong>căn đều hai bên (justify)</strong> cần chia âm tiết nếu không sẽ mở ra những "dòng sông" trắng xấu xí.</p>
<div class="callout"><span class="badge">Đọc được trước đã</span> Nếu người đọc phải gắng sức để đọc thì thiết kế đã hỏng — dù đẹp đến mấy.</div>`,
  ]]);

const c6q = quiz('tpg302-quiz-6', 'Quiz 6 — Readability|||Quiz 6 — Khả năng đọc', [
  { id: 'q1', question: 'Độ dài dòng (measure) dễ đọc cho thân bài vào khoảng?', options: ['10-20 ký tự', '45-75 ký tự mỗi dòng', '100-140 ký tự', 'Càng dài càng tốt'], correctIndex: 1, explanation: 'Khoảng 45-75 ký tự/dòng (~66) giúp mắt bắt đầu dòng kế dễ dàng.' },
  { id: 'q2', question: 'WCAG khuyến nghị tỉ lệ tương phản tối thiểu cho thân chữ thường là?', options: ['1.5:1', '3:1', '4.5:1', '10:1'], correctIndex: 2, explanation: 'Thân chữ thường cần >= 4.5:1; chữ lớn cần >= 3:1.' },
  { id: 'q3', question: '"Legibility" khác "readability" ở chỗ?', options: ['Không khác gì', 'Legibility = rõ từng mặt chữ; readability = cả đoạn trôi chảy', 'Legibility là về màu, readability là về font', 'Cả hai chỉ về cỡ chữ'], correctIndex: 1, explanation: 'Legibility thuộc kiểu chữ; readability thuộc cách sắp đặt.' },
]);

const c7 = doc('tpg302-7-1-screen-web', '7.1 — Typography for screen &amp; web|||7.1 — Typography cho màn hình &amp; web',
  'Web fonts (@font-face, WOFF2, Google Fonts, FOUT/FOIT); đơn vị tương đối (rem/em); responsive &amp; fluid type (clamp); pixel/hinting; system font stack.',
  [[
    `<span class="eyebrow">TPG302 · Chapter 7 · Lesson 7.1</span>
<h2>Typography for screen &amp; web</h2>
<h3>Web fonts</h3>
<p>Screens render type from font files loaded over the network. Use <strong>WOFF2</strong> (smallest, modern) via <code>@font-face</code> or a host like Google Fonts. Watch loading behavior — <strong>FOUT</strong> (flash of unstyled text) is usually better than <strong>FOIT</strong> (invisible text); control it with <code>font-display: swap;</code>.</p>
<h3>Relative units</h3>
<p>Prefer <strong>rem/em</strong> over fixed <code>px</code> so text respects the user's chosen size and scales cleanly.</p>
<pre><code>@font-face {
  font-family: "Inter";
  src: url("/fonts/inter.woff2") format("woff2");
  font-display: swap;
}
html { font-size: 100%; }          /* respects user default (16px) */
body { font-family: "Inter", system-ui, sans-serif; }
</code></pre>
<h3>Responsive &amp; fluid type</h3>
<p>Type should adapt to viewport width. <code>clamp()</code> sets a min, a fluid preferred value, and a max in one line:</p>
<pre><code>h1 {
  font-size: clamp(1.75rem, 4vw + 1rem, 3rem);
  line-height: 1.15;
}
</code></pre>
<div class="callout"><span class="badge">Performance is typography</span> A 400KB font that blocks rendering hurts the reader more than a slightly plainer system font. Subset, use WOFF2, and swap.</div>`,
    `<span class="eyebrow">TPG302 · Chương 7 · Bài 7.1</span>
<h2>Typography cho màn hình &amp; web</h2>
<h3>Web font</h3>
<p>Màn hình dựng chữ từ các tệp font tải qua mạng. Dùng <strong>WOFF2</strong> (nhỏ nhất, hiện đại) qua <code>@font-face</code> hoặc một dịch vụ như Google Fonts. Chú ý cách nạp — <strong>FOUT</strong> (chớp chữ chưa định kiểu) thường tốt hơn <strong>FOIT</strong> (chữ tàng hình); kiểm soát bằng <code>font-display: swap;</code>.</p>
<h3>Đơn vị tương đối</h3>
<p>Ưu tiên <strong>rem/em</strong> thay vì <code>px</code> cố định để chữ tôn trọng cỡ người dùng chọn và co giãn gọn gàng.</p>
<pre><code>@font-face {
  font-family: "Inter";
  src: url("/fonts/inter.woff2") format("woff2");
  font-display: swap;
}
html { font-size: 100%; }          /* tôn trọng mặc định người dùng (16px) */
body { font-family: "Inter", system-ui, sans-serif; }
</code></pre>
<h3>Responsive &amp; fluid type</h3>
<p>Chữ nên thích ứng theo bề rộng khung nhìn. <code>clamp()</code> đặt giá trị nhỏ nhất, giá trị co giãn mong muốn, và lớn nhất trong một dòng:</p>
<pre><code>h1 {
  font-size: clamp(1.75rem, 4vw + 1rem, 3rem);
  line-height: 1.15;
}
</code></pre>
<div class="callout"><span class="badge">Hiệu năng cũng là typography</span> Một font 400KB chặn render hại người đọc hơn một system font mộc hơn chút. Hãy subset, dùng WOFF2, và swap.</div>`,
  ]]);

const c7q = quiz('tpg302-quiz-7', 'Quiz 7 — Screen &amp; web|||Quiz 7 — Màn hình &amp; web', [
  { id: 'q1', question: 'Định dạng web font nhỏ gọn, hiện đại nên dùng là?', options: ['TTF không nén', 'WOFF2', 'BMP', 'PSD'], correctIndex: 1, explanation: 'WOFF2 nén tốt nhất, được trình duyệt hiện đại hỗ trợ rộng.' },
  { id: 'q2', question: 'Thuộc tính CSS nào tránh "chữ tàng hình" khi font đang tải?', options: ['font-weight: bold', 'font-display: swap', 'text-align: center', 'letter-spacing: 1px'], correctIndex: 1, explanation: 'font-display: swap hiện chữ bằng font dự phòng rồi đổi khi font chính về (FOUT thay vì FOIT).' },
  { id: 'q3', question: 'Hàm CSS nào đặt cỡ chữ co giãn với min/preferred/max trong một dòng?', options: ['calc()', 'clamp()', 'min()', 'var()'], correctIndex: 1, explanation: 'clamp(min, fluid, max) tạo fluid type responsive.' },
]);

const c8 = doc('tpg302-8-1-epublishing', '8.1 — Electronic publishing &amp; InDesign|||8.1 — Xuất bản điện tử &amp; InDesign',
  'EPUB reflowable vs fixed-layout; PDF tương tác; e-magazine; quy trình InDesign (master pages, paragraph/character styles, xuất EPUB/PDF); kiểm bằng EPUBCheck.',
  [[
    `<span class="eyebrow">TPG302 · Chapter 8 · Lesson 8.1</span>
<h2>Electronic publishing &amp; InDesign</h2>
<h3>Formats</h3>
<ul>
<li><strong>EPUB (reflowable)</strong> — text reflows to any screen; the reader controls font &amp; size. Best for novels &amp; text-heavy books.</li>
<li><strong>EPUB (fixed-layout)</strong> — pages keep their exact design; for children's books, comics, cookbooks.</li>
<li><strong>Interactive PDF</strong> — fixed pages with links, buttons, forms; great for print-parity documents.</li>
<li><strong>Digital magazine</strong> — often fixed-layout EPUB or app-based, mixing rich media.</li>
</ul>
<h3>The InDesign workflow</h3>
<pre><code>Set up  -> document, margins, columns, baseline grid
Style   -> Paragraph Styles + Character Styles (semantic, reusable)
Master  -> Master/Parent Pages for running heads &amp; folios
Structure -> map styles to tags for a clean EPUB
Export  -> File > Export > EPUB (reflowable) or Interactive PDF
Validate -> run EPUBCheck before publishing
</code></pre>
<h3>Why styles matter for EPUB</h3>
<p>Paragraph &amp; character <strong>styles</strong> become the CSS of the exported EPUB. Consistent, semantic styles (not manual overrides) produce clean, accessible e-books that reflow correctly.</p>
<div class="callout"><span class="badge">Validate before you ship</span> An EPUB that opens on your machine can still be broken. Run <strong>EPUBCheck</strong> — stores reject files that fail it.</div>`,
    `<span class="eyebrow">TPG302 · Chương 8 · Bài 8.1</span>
<h2>Xuất bản điện tử &amp; InDesign</h2>
<h3>Các định dạng</h3>
<ul>
<li><strong>EPUB (reflowable / tái dòng)</strong> — chữ chảy lại theo mọi màn hình; người đọc chỉnh font &amp; cỡ. Hợp tiểu thuyết &amp; sách nhiều chữ.</li>
<li><strong>EPUB (fixed-layout / cố định)</strong> — trang giữ nguyên thiết kế; cho sách thiếu nhi, truyện tranh, sách nấu ăn.</li>
<li><strong>PDF tương tác</strong> — trang cố định có liên kết, nút, biểu mẫu; hợp tài liệu cần giống bản in.</li>
<li><strong>Tạp chí số</strong> — thường là EPUB fixed-layout hoặc dạng app, trộn đa phương tiện.</li>
</ul>
<h3>Quy trình InDesign</h3>
<pre><code>Thiết lập -> tài liệu, lề, cột, baseline grid
Style     -> Paragraph Styles + Character Styles (ngữ nghĩa, tái dùng)
Master    -> Master/Parent Pages cho tít chạy &amp; số trang
Cấu trúc  -> ánh xạ style sang tag để EPUB sạch
Xuất      -> File > Export > EPUB (reflowable) hoặc PDF tương tác
Kiểm tra  -> chạy EPUBCheck trước khi phát hành
</code></pre>
<h3>Vì sao style quan trọng cho EPUB</h3>
<p>Paragraph &amp; character <strong>style</strong> trở thành CSS của EPUB xuất ra. Style nhất quán, ngữ nghĩa (không chỉnh tay đè lên) cho ra e-book sạch, dễ tiếp cận và tái dòng đúng.</p>
<div class="callout"><span class="badge">Kiểm trước khi phát hành</span> Một EPUB mở được trên máy bạn vẫn có thể lỗi. Hãy chạy <strong>EPUBCheck</strong> — các cửa hàng từ chối file không đạt.</div>`,
  ]]);

const c8q = quiz('tpg302-quiz-8', 'Quiz 8 — E-publishing|||Quiz 8 — Xuất bản điện tử', [
  { id: 'q1', question: 'Định dạng nào để chữ CHẢY LẠI theo mọi màn hình, người đọc chỉnh được cỡ chữ?', options: ['PDF cố định', 'EPUB reflowable (tái dòng)', 'EPUB fixed-layout', 'JPEG'], correctIndex: 1, explanation: 'EPUB reflowable tái dòng theo màn hình; fixed-layout thì giữ nguyên trang.' },
  { id: 'q2', question: 'Trong InDesign, thứ trở thành "CSS" của EPUB xuất ra là?', options: ['Master pages', 'Paragraph &amp; Character Styles', 'Số trang', 'Màu nền'], correctIndex: 1, explanation: 'Style đoạn/ký tự ánh xạ thành CSS khi xuất EPUB; dùng style nhất quán cho e-book sạch.' },
  { id: 'q3', question: 'Công cụ kiểm tính hợp lệ của tệp EPUB trước khi phát hành là?', options: ['EPUBCheck', 'EPUBCheck không tồn tại', 'Photoshop', 'WCAG'], correctIndex: 0, explanation: 'EPUBCheck xác nhận EPUB hợp lệ; cửa hàng từ chối file không đạt.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'TPG302',
    slug: 'tpg302-typography-and-e-publication',
    title: 'Typography &amp; E-publication',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/TPG302.webp',
    shortDescription: 'The craft of arranging type — anatomy & classification, measurement (point, leading, kerning, tracking), grids, hierarchy, readability, web fonts, and electronic publishing (EPUB, interactive PDF, InDesign). Bilingual, with type specs & quizzes.|||Nghề sắp đặt chữ — giải phẫu & phân loại, đo lường (point, leading, kerning, tracking), hệ lưới, phân cấp, khả năng đọc, web font, và xuất bản điện tử (EPUB, PDF tương tác, InDesign). Song ngữ, có thông số chữ & quiz.',
    description: 'Môn <strong>TPG302 — Typography &amp; E-publication</strong> (kỳ 4, ngành Thiết kế mỹ thuật số) dạy <strong>sắp đặt chữ sao cho đẹp, dễ đọc và đúng mục đích</strong>. Từ <strong>lịch sử &amp; giải phẫu chữ</strong> → <strong>phân loại</strong> (serif / sans / script) → <strong>đo lường</strong> (point, leading, kerning, tracking) → <strong>hệ lưới &amp; bố cục</strong> → <strong>phân cấp &amp; tương phản</strong> → <strong>màu, không gian âm &amp; khả năng đọc</strong> → <strong>chữ cho màn hình &amp; web</strong> → <strong>xuất bản điện tử</strong> (EPUB, PDF tương tác, InDesign). Bám các giáo trình kinh điển (Bringhurst, Lupton, Muller-Brockmann) &amp; tài liệu Adobe InDesign, song ngữ, có thông số chữ mẫu và quiz mỗi chương.',
    whatYouLearn: 'Giải phẫu chữ (baseline, x-height, ascender/descender, serif, counter); phân loại serif/sans/script/monospace &amp; ghép font; point/pica, leading, kerning vs tracking, em/en; hệ lưới (cột, gutter, module, baseline grid, lưới 12 cột); phân cấp qua type scale &amp; tương phản; measure 45-75 ký tự, tương phản WCAG 4.5:1, không gian âm; web font (WOFF2, font-display, clamp, rem/em); EPUB reflowable/fixed, PDF tương tác, quy trình InDesign &amp; EPUBCheck.',
    requirements: 'Không cần nền tảng thiết kế trước. Nên có Adobe InDesign (hoặc bản dùng thử) để thực hành xuất bản; biết chút HTML/CSS giúp phần chữ cho web.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, sách kinh điển, InDesign, web font, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Typography là gì, vì sao quan trọng, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Lịch sử & giải phẫu chữ|||Chapter 1 — History & anatomy', description: 'Gutenberg→số hoá; baseline, x-height, serif, counter.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phân loại kiểu chữ|||Chapter 2 — Classification', description: 'Serif/sans/script/monospace; ghép font.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đo lường typographic|||Chapter 3 — Measurement', description: 'Point, leading, kerning, tracking, em/en.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Hệ lưới & bố cục|||Chapter 4 — Grid & layout', description: 'Cột, gutter, module, lưới 12 cột.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân cấp & tương phản|||Chapter 5 — Hierarchy & contrast', description: 'Type scale, weight, hoa/thường, màu.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Màu, không gian âm & khả năng đọc|||Chapter 6 — Readability', description: 'Measure, WCAG, không gian âm, căn lề.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Chữ cho màn hình & web|||Chapter 7 — Screen & web', description: 'Web font, WOFF2, rem/em, clamp responsive.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xuất bản điện tử & InDesign|||Chapter 8 — E-publishing', description: 'EPUB, PDF tương tác, quy trình InDesign, EPUBCheck.', lessons: [c8, c8q] },
  ],
};
