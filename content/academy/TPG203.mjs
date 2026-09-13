/**
 * TPG203 — Basic Typography & Layout. Ngành Thiết kế mỹ thuật số FPTU (Kỳ 3):
 * nghệ thuật chữ và dàn trang — giải phẫu chữ, phân loại & phối font, khoảng
 * cách/nhịp chữ, hệ lưới, phân cấp, dàn trang, ứng dụng (poster/tạp chí/web).
 * Sách chuẩn: Lupton "Thinking with Type"; Bringhurst "The Elements of
 * Typographic Style"; Müller-Brockmann "Grid Systems". Song ngữ + ví dụ font
 * thật + quiz. Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('tpg203-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Lupton, Bringhurst, Müller-Brockmann), Google Fonts & Adobe Type, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">TPG203 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>typography &amp; layout</strong> — letterforms, font choice, spacing, grids, hierarchy and page design — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for TPG203 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (the canon)</h3>
<ul>
<li><a href="https://thinkingwithtype.com/" target="_blank" rel="noopener">Ellen Lupton — <em>Thinking with Type</em></a> (full text free online) — the friendliest first book on type.</li>
<li><a href="http://webtypography.net/" target="_blank" rel="noopener">Robert Bringhurst — <em>The Elements of Typographic Style</em></a> (companion: <em>The Elements of Typographic Style Applied to the Web</em>) — the reference bible.</li>
<li><a href="https://en.wikipedia.org/wiki/Grid_Systems_in_Graphic_Design" target="_blank" rel="noopener">Josef Müller-Brockmann — <em>Grid Systems in Graphic Design</em></a> — the classic on grids.</li>
</ul>
<h3>🌐 Font libraries &amp; type foundries</h3>
<ul>
<li><a href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a> — free, open-source fonts (with pairing suggestions).</li>
<li><a href="https://fonts.adobe.com/" target="_blank" rel="noopener">Adobe Fonts (Adobe Type)</a> — pro type library, included with Creative Cloud.</li>
<li><a href="https://fontsinuse.com/" target="_blank" rel="noopener">Fonts In Use</a> — real-world typography, searchable by industry.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFutur" target="_blank" rel="noopener">The Futur</a> — design theory, typography &amp; branding.</li>
<li><a href="https://www.youtube.com/results?search_query=typography+basics" target="_blank" rel="noopener">Typography basics playlists</a> — short practical lessons.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — design layouts &amp; type on a real grid, free.</li>
<li><a href="https://type-scale.com/" target="_blank" rel="noopener">Type Scale</a> — build a modular type scale visually.</li>
<li><a href="https://fontjoy.com/" target="_blank" rel="noopener">Fontjoy</a> — generate font pairings.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — read letterform anatomy, then font classification (serif / sans / script / display).</li>
<li><strong>Craft</strong> — practise pairing, spacing (kerning / tracking / leading) and line length until text reads effortlessly.</li>
<li><strong>Structure</strong> — build grids and a typographic hierarchy; organise information with size, weight and space.</li>
<li><strong>Apply</strong> — design a poster, a magazine spread and a web/UI screen; keep them all on one grid.</li>
</ol></div>`,
    `<span class="eyebrow">TPG203 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>chữ &amp; dàn trang</strong> — con chữ, chọn font, khoảng cách, hệ lưới, phân cấp và thiết kế trang — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của TPG203 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (kinh điển)</h3>
<ul>
<li><a href="https://thinkingwithtype.com/" target="_blank" rel="noopener">Ellen Lupton — <em>Thinking with Type</em></a> (đọc miễn phí online) — cuốn nhập môn dễ chịu nhất về chữ.</li>
<li><a href="http://webtypography.net/" target="_blank" rel="noopener">Robert Bringhurst — <em>The Elements of Typographic Style</em></a> (kèm bản cho web) — cuốn tham chiếu gối đầu.</li>
<li><a href="https://en.wikipedia.org/wiki/Grid_Systems_in_Graphic_Design" target="_blank" rel="noopener">Josef Müller-Brockmann — <em>Grid Systems in Graphic Design</em></a> — sách kinh điển về hệ lưới.</li>
</ul>
<h3>🌐 Thư viện font &amp; xưởng chữ</h3>
<ul>
<li><a href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a> — font mã nguồn mở, miễn phí (có gợi ý phối cặp).</li>
<li><a href="https://fonts.adobe.com/" target="_blank" rel="noopener">Adobe Fonts (Adobe Type)</a> — thư viện font chuyên nghiệp, kèm Creative Cloud.</li>
<li><a href="https://fontsinuse.com/" target="_blank" rel="noopener">Fonts In Use</a> — typography thực tế, tra được theo ngành.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFutur" target="_blank" rel="noopener">The Futur</a> — lý thuyết thiết kế, chữ &amp; thương hiệu.</li>
<li><a href="https://www.youtube.com/results?search_query=typography+basics" target="_blank" rel="noopener">Playlist typography căn bản</a> — bài học ngắn, thực hành.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — dàn trang &amp; đặt chữ trên lưới thật, miễn phí.</li>
<li><a href="https://type-scale.com/" target="_blank" rel="noopener">Type Scale</a> — dựng thang cỡ chữ theo tỉ lệ, trực quan.</li>
<li><a href="https://fontjoy.com/" target="_blank" rel="noopener">Fontjoy</a> — gợi ý cặp font.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — học giải phẫu con chữ, rồi phân loại font (serif / sans / script / display).</li>
<li><strong>Kỹ thuật</strong> — luyện phối font, khoảng cách (kerning / tracking / leading) và độ dài dòng đến khi chữ đọc trơn tru.</li>
<li><strong>Cấu trúc</strong> — dựng hệ lưới và hệ phân cấp; tổ chức thông tin bằng cỡ, độ đậm và khoảng trắng.</li>
<li><strong>Ứng dụng</strong> — thiết kế một poster, một trang tạp chí và một màn hình web/UI; giữ cả ba trên cùng một lưới.</li>
</ol></div>`,
  ]]);

const intro = doc('tpg203-0-1-overview', 'Course overview: Typography & layout|||Tổng quan: Chữ & dàn trang',
  'Typography là gì và vì sao quan trọng; typography tốt = vô hình (dễ đọc); lộ trình: con chữ → phân loại & phối font → khoảng cách → lưới → phân cấp → dàn trang → ứng dụng.',
  [[
    `<span class="eyebrow">TPG203 · Lesson 0.1 · Overview</span>
<h2>Typography &amp; layout</h2>
<p class="lead">Typography is the <strong>art of arranging type</strong> so language becomes visible and readable. Layout is how you <strong>organise a page</strong> — where type, images and space go. Together they decide whether a poster grabs you, whether an article is a pleasure to read, and whether an app feels clear or cluttered.</p>
<h3>Good typography is invisible</h3>
<p>Beatrice Warde called the perfect type a <em>"crystal goblet"</em> — you notice the wine, not the glass. Great type serves the message; the reader glides through without ever thinking about the letters. Our job is <strong>clarity first, personality second</strong>.</p>
<h3>Roadmap</h3>
<p>Letterforms &amp; anatomy → font classification (serif / sans / script / display) → pairing &amp; contrast → spacing &amp; rhythm (kerning, tracking, leading, line length) → grid systems → typographic hierarchy → page layout → applications (poster, magazine, web/UI). Bilingual, with real fonts and worked examples, plus a quiz each chapter.</p>
<div class="callout"><span class="badge">Why it matters</span> 95% of the web is text. Master type and layout and every design you touch — a slide, a CV, a landing page — instantly looks more professional.</div>`,
    `<span class="eyebrow">TPG203 · Bài 0.1 · Tổng quan</span>
<h2>Chữ &amp; dàn trang</h2>
<p class="lead">Typography là <strong>nghệ thuật sắp đặt con chữ</strong> để ngôn ngữ trở nên nhìn thấy được và dễ đọc. Dàn trang (layout) là cách bạn <strong>tổ chức một trang</strong> — chữ, hình và khoảng trắng đặt ở đâu. Cùng nhau, chúng quyết định một tấm poster có hút mắt không, một bài viết có dễ đọc không, và một ứng dụng trông rõ ràng hay rối rắm.</p>
<h3>Typography tốt là vô hình</h3>
<p>Beatrice Warde gọi con chữ hoàn hảo là <em>"chiếc ly pha lê"</em> — bạn để ý rượu, không để ý cái ly. Chữ tốt phục vụ thông điệp; người đọc lướt qua mà chẳng bao giờ nghĩ về con chữ. Việc của ta là <strong>rõ ràng trước, cá tính sau</strong>.</p>
<h3>Lộ trình</h3>
<p>Con chữ &amp; giải phẫu → phân loại font (serif / sans / script / display) → phối &amp; tương phản → khoảng cách &amp; nhịp (kerning, tracking, leading, độ dài dòng) → hệ lưới → phân cấp → dàn trang → ứng dụng (poster, tạp chí, web/UI). Song ngữ, có font thật và ví dụ mẫu, kèm quiz mỗi chương.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> 95% của web là chữ. Nắm chữ và dàn trang thì mọi thứ bạn chạm — một slide, một CV, một trang đích — lập tức trông chuyên nghiệp hơn.</div>`,
  ]]);

const c1 = doc('tpg203-1-1-anatomy', '1.1 — Type & letterform anatomy|||1.1 — Chữ & giải phẫu con chữ',
  'Typography là gì; giải phẫu con chữ: baseline, x-height, cap height, ascender, descender, serif, counter, bowl, stem — vì sao x-height quyết định cảm giác "to/nhỏ" của font.',
  [[
    `<span class="eyebrow">TPG203 · Chapter 1 · Lesson 1.1</span>
<h2>Type &amp; letterform anatomy</h2>
<p>Before you choose or combine fonts, you need the vocabulary. Every letter sits on shared reference lines and is built from named parts.</p>
<h3>The reference lines</h3>
<ul>
<li><strong>Baseline</strong> — the invisible line letters "sit" on.</li>
<li><strong>x-height</strong> — the height of a lowercase "x"; the body of most lowercase letters. A <em>large</em> x-height (e.g. Verdana) looks bigger and reads well on screens; a small one (e.g. Garamond) feels elegant and literary.</li>
<li><strong>Cap height</strong> — the height of capital letters (usually a touch below the ascenders).</li>
<li><strong>Ascender</strong> — the part rising above the x-height (b, d, h, k, l).</li>
<li><strong>Descender</strong> — the part dropping below the baseline (g, j, p, q, y).</li>
</ul>
<h3>Parts of a letter</h3>
<ul>
<li><strong>Serif</strong> — the little "feet" at stroke ends (Times, Garamond). No serifs = <strong>sans-serif</strong> (Helvetica, Arial).</li>
<li><strong>Stem</strong> — the main vertical stroke. <strong>Bowl</strong> — the round enclosing curve (in b, d, o). <strong>Counter</strong> — the enclosed white space inside (the hole in "o", "e", "a").</li>
</ul>
<pre><code>Vertical metrics (tallest to shortest):
  ascender line   --- b d h k l
  cap height      --- A B C
  x-height        --- x a e o     &lt;- the "reading" zone
  baseline        ---------------
  descender line  --- g p y
</code></pre>
<div class="callout"><span class="badge">Why x-height rules</span> Two fonts at the same "point size" can look very different in size — because point size measures the metal body, not the letters. The x-height is what your eye reads, so it decides perceived size and screen legibility.</div>`,
    `<span class="eyebrow">TPG203 · Chương 1 · Bài 1.1</span>
<h2>Chữ &amp; giải phẫu con chữ</h2>
<p>Trước khi chọn hay phối font, bạn cần vốn từ. Mỗi con chữ nằm trên các đường tham chiếu chung và được dựng từ những bộ phận có tên riêng.</p>
<h3>Các đường tham chiếu</h3>
<ul>
<li><strong>Baseline (đường chân)</strong> — đường vô hình mà chữ "đứng" lên.</li>
<li><strong>x-height</strong> — chiều cao chữ "x" thường; phần thân của hầu hết chữ thường. x-height <em>lớn</em> (vd Verdana) trông to hơn, đọc tốt trên màn hình; x-height nhỏ (vd Garamond) cho cảm giác thanh lịch, văn chương.</li>
<li><strong>Cap height (chiều cao chữ hoa)</strong> — chiều cao chữ in hoa (thường hơi thấp hơn ascender).</li>
<li><strong>Ascender (nét vươn)</strong> — phần vươn trên x-height (b, d, h, k, l).</li>
<li><strong>Descender (nét buông)</strong> — phần thả dưới baseline (g, j, p, q, y).</li>
</ul>
<h3>Bộ phận của một con chữ</h3>
<ul>
<li><strong>Serif (chân)</strong> — những "bàn chân" nhỏ ở đầu nét (Times, Garamond). Không chân = <strong>sans-serif</strong> (Helvetica, Arial).</li>
<li><strong>Stem (thân)</strong> — nét dọc chính. <strong>Bowl (vành)</strong> — đường cong bao tròn (trong b, d, o). <strong>Counter (mắt chữ)</strong> — khoảng trắng khép kín bên trong (lỗ trong "o", "e", "a").</li>
</ul>
<pre><code>Đo dọc (cao đến thấp):
  đường ascender  --- b d h k l
  cap height      --- A B C
  x-height        --- x a e o     &lt;- vùng "đọc"
  baseline        ---------------
  đường descender --- g p y
</code></pre>
<div class="callout"><span class="badge">Vì sao x-height quan trọng</span> Hai font cùng "cỡ point" có thể trông to nhỏ khác hẳn — vì cỡ point đo thân kim loại, không đo con chữ. x-height mới là thứ mắt bạn đọc, nên nó quyết định cỡ cảm nhận và độ dễ đọc trên màn hình.</div>`,
  ]]);

const c1q = quiz('tpg203-quiz-1', 'Quiz 1 — Anatomy|||Quiz 1 — Giải phẫu chữ', [
  { id: 'q1', question: 'x-height là gì?', options: ['Chiều cao chữ in hoa', 'Chiều cao thân chữ thường (như chữ x)', 'Phần vươn trên baseline', 'Khoảng cách giữa hai dòng'], correctIndex: 1, explanation: 'x-height = chiều cao chữ thường như "x"; quyết định cỡ cảm nhận và độ dễ đọc.' },
  { id: 'q2', question: '"Chân" nhỏ ở đầu nét chữ (như trong Times) gọi là?', options: ['Serif', 'Counter', 'Bowl', 'Stem'], correctIndex: 0, explanation: 'Serif là các "bàn chân" ở đầu nét; không có serif thì gọi là sans-serif.' },
  { id: 'q3', question: 'Phần con chữ THẢ XUỐNG dưới baseline (như g, p, y) gọi là?', options: ['Ascender', 'Descender', 'Cap height', 'Baseline'], correctIndex: 1, explanation: 'Descender là nét buông dưới baseline; ascender là nét vươn lên trên x-height.' },
]);

const c2 = doc('tpg203-2-1-classification', '2.1 — Font classification|||2.1 — Phân loại font',
  'Bốn nhóm lớn: serif (Old Style/Transitional/Modern/Slab), sans-serif (Grotesque/Humanist/Geometric), script, display; lịch sử ngắn và cách chọn nhóm theo mục đích.',
  [[
    `<span class="eyebrow">TPG203 · Chapter 2 · Lesson 2.1</span>
<h2>Font classification</h2>
<p>Thousands of fonts fall into a handful of families. Knowing the family tells you the <em>mood</em> and the <em>right job</em> for a typeface.</p>
<h3>The four big groups</h3>
<ul>
<li><strong>Serif</strong> — has feet; feels traditional, trustworthy, literary. Sub-styles by era: <em>Old Style</em> (Garamond), <em>Transitional</em> (Baskerville, Times New Roman), <em>Modern/Didone</em> (Didot, Bodoni — high contrast, elegant), <em>Slab</em> (Rockwell — blocky feet). Great for long body text in print.</li>
<li><strong>Sans-serif</strong> — no feet; feels clean, modern, neutral. Sub-styles: <em>Grotesque</em> (Helvetica), <em>Humanist</em> (Gill Sans, Frutiger — warmer, calligraphic), <em>Geometric</em> (Futura, Montserrat — built from circles/lines). The default for screens and UI.</li>
<li><strong>Script</strong> — mimics handwriting/calligraphy (Pacifico, brush scripts). Emotional, personal — use for accents, <strong>never</strong> for body text or ALL CAPS.</li>
<li><strong>Display / decorative</strong> — designed to shout at large sizes (posters, logos). High personality; unreadable in paragraphs.</li>
</ul>
<pre><code>Match the group to the job:
  Long print article  -> Serif (Garamond, Georgia)
  App / website UI    -> Sans-serif (Inter, Roboto)
  Wedding invite      -> Script (as an accent)
  Poster headline     -> Display
</code></pre>
<div class="callout"><span class="badge">History in one line</span> Serifs came first (carved into Roman stone, then printed); sans-serifs are a 19th–20th century idea born for signs, industry and, eventually, screens.</div>`,
    `<span class="eyebrow">TPG203 · Chương 2 · Bài 2.1</span>
<h2>Phân loại font</h2>
<p>Hàng nghìn font quy về vài họ chính. Biết họ font là biết được <em>cảm xúc</em> và <em>việc phù hợp</em> của một kiểu chữ.</p>
<h3>Bốn nhóm lớn</h3>
<ul>
<li><strong>Serif (có chân)</strong> — cảm giác truyền thống, đáng tin, văn chương. Phân theo thời kỳ: <em>Old Style</em> (Garamond), <em>Transitional</em> (Baskerville, Times New Roman), <em>Modern/Didone</em> (Didot, Bodoni — tương phản cao, thanh lịch), <em>Slab</em> (Rockwell — chân vuông khối). Rất hợp chữ thân dài khi in.</li>
<li><strong>Sans-serif (không chân)</strong> — cảm giác sạch, hiện đại, trung tính. Phân nhóm: <em>Grotesque</em> (Helvetica), <em>Humanist</em> (Gill Sans, Frutiger — ấm, gần thư pháp), <em>Geometric</em> (Futura, Montserrat — dựng từ hình tròn/đường thẳng). Lựa chọn mặc định cho màn hình và UI.</li>
<li><strong>Script (thảo)</strong> — mô phỏng chữ viết tay/thư pháp (Pacifico, brush). Giàu cảm xúc, cá nhân — dùng làm điểm nhấn, <strong>không bao giờ</strong> cho chữ thân hay VIẾT HOA TOÀN BỘ.</li>
<li><strong>Display / trang trí</strong> — thiết kế để "hét" ở cỡ lớn (poster, logo). Cá tính cao; không đọc nổi trong đoạn văn.</li>
</ul>
<pre><code>Ghép nhóm với việc:
  Bài in dài        -> Serif (Garamond, Georgia)
  UI app / website  -> Sans-serif (Inter, Roboto)
  Thiệp cưới        -> Script (làm điểm nhấn)
  Tiêu đề poster    -> Display
</code></pre>
<div class="callout"><span class="badge">Lịch sử một dòng</span> Serif có trước (khắc trên đá La Mã, rồi in ấn); sans-serif là ý tưởng thế kỷ 19–20, sinh ra cho biển hiệu, công nghiệp và cuối cùng là màn hình.</div>`,
  ]]);

const c2q = quiz('tpg203-quiz-2', 'Quiz 2 — Classification|||Quiz 2 — Phân loại', [
  { id: 'q1', question: 'Nhóm font nào thường là lựa chọn MẶC ĐỊNH cho UI app/website?', options: ['Serif', 'Sans-serif', 'Script', 'Display'], correctIndex: 1, explanation: 'Sans-serif sạch, trung tính, đọc tốt trên màn hình → mặc định cho UI.' },
  { id: 'q2', question: 'Font nào KHÔNG nên dùng cho chữ thân dài hay VIẾT HOA TOÀN BỘ?', options: ['Serif Old Style', 'Sans-serif Humanist', 'Script (thảo)', 'Slab serif'], correctIndex: 2, explanation: 'Script mô phỏng viết tay, khó đọc khi làm body text hoặc all caps; chỉ nên làm điểm nhấn.' },
  { id: 'q3', question: 'Futura và Montserrat thuộc kiểu sans-serif nào?', options: ['Grotesque', 'Humanist', 'Geometric', 'Slab'], correctIndex: 2, explanation: 'Geometric sans dựng từ hình tròn và đường thẳng (Futura, Montserrat).' },
]);

const c3 = doc('tpg203-3-1-pairing', '3.1 — Font pairing & combining|||3.1 — Cặp đôi & phối font',
  'Nguyên tắc phối font: tương phản (không tương tự), giới hạn 2-3 font, dùng superfamily, cặp serif+sans; ví dụ cặp thật (Playfair Display + Source Sans, Merriweather + Open Sans).',
  [[
    `<span class="eyebrow">TPG203 · Chapter 3 · Lesson 3.1</span>
<h2>Font pairing &amp; combining</h2>
<p>A design usually uses <strong>two</strong> typefaces: one for headings, one for body. The skill is combining them so they feel intentional, not accidental.</p>
<h3>The rules of pairing</h3>
<ul>
<li><strong>Contrast, don't clash.</strong> Pair fonts that are clearly <em>different</em> (a serif with a sans), not two that are almost-but-not-quite the same — near-similarity looks like a mistake.</li>
<li><strong>Keep a common thread.</strong> Fonts that share an era, a mood, or a similar x-height sit together comfortably.</li>
<li><strong>Limit to 2 (maybe 3).</strong> One display/heading font + one workhorse body font is usually enough. Add a third only for a distinct role (e.g. captions or code).</li>
<li><strong>Use a superfamily for a safe win.</strong> Families like <em>Source Sans / Source Serif</em> or <em>IBM Plex Sans / Serif / Mono</em> are designed to pair perfectly.</li>
</ul>
<h3>Battle-tested pairs</h3>
<pre><code>Heading (serif)        + Body (sans)
  Playfair Display     + Source Sans Pro     (elegant, editorial)
  Merriweather         + Open Sans           (readable, friendly)
Heading (sans)         + Body (serif)
  Montserrat           + Merriweather        (modern + warm)
Same family (safest)
  Roboto Slab          + Roboto              (one voice, two weights)
</code></pre>
<div class="callout"><span class="badge">The lazy pro trick</span> Can't decide? Use <strong>one</strong> good font family and create contrast with <em>weight</em> and <em>size</em> alone (Bold 32px heading, Regular 16px body). It's almost impossible to get wrong.</div>`,
    `<span class="eyebrow">TPG203 · Chương 3 · Bài 3.1</span>
<h2>Cặp đôi &amp; phối font</h2>
<p>Một thiết kế thường dùng <strong>hai</strong> kiểu chữ: một cho tiêu đề, một cho thân. Kỹ năng là phối chúng sao cho trông có chủ đích, chứ không phải tình cờ.</p>
<h3>Nguyên tắc phối font</h3>
<ul>
<li><strong>Tương phản, đừng đụng nhau.</strong> Ghép font rõ ràng <em>khác nhau</em> (serif với sans), không ghép hai font gần-giống-mà-không-giống — na ná nhau trông như lỗi.</li>
<li><strong>Giữ một sợi chỉ chung.</strong> Font cùng thời kỳ, cùng cảm xúc, hoặc x-height gần nhau sẽ đứng cạnh nhau êm.</li>
<li><strong>Giới hạn 2 (nhiều nhất 3).</strong> Một font tiêu đề/display + một font thân chủ lực là thường đủ. Thêm font thứ ba chỉ khi có vai trò riêng (chú thích hoặc code).</li>
<li><strong>Dùng superfamily cho chắc thắng.</strong> Các họ như <em>Source Sans / Source Serif</em> hay <em>IBM Plex Sans / Serif / Mono</em> được thiết kế để phối khớp hoàn hảo.</li>
</ul>
<h3>Những cặp đã kiểm chứng</h3>
<pre><code>Tiêu đề (serif)       + Thân (sans)
  Playfair Display    + Source Sans Pro     (thanh lịch, kiểu tạp chí)
  Merriweather        + Open Sans           (dễ đọc, thân thiện)
Tiêu đề (sans)        + Thân (serif)
  Montserrat          + Merriweather        (hiện đại + ấm)
Cùng họ (an toàn nhất)
  Roboto Slab         + Roboto              (một giọng, hai độ đậm)
</code></pre>
<div class="callout"><span class="badge">Mẹo lười của dân pro</span> Không quyết được? Dùng <strong>một</strong> họ font tốt và tạo tương phản chỉ bằng <em>độ đậm</em> và <em>cỡ</em> (tiêu đề Bold 32px, thân Regular 16px). Gần như không thể sai.</div>`,
  ]]);

const c3q = quiz('tpg203-quiz-3', 'Quiz 3 — Pairing|||Quiz 3 — Phối font', [
  { id: 'q1', question: 'Cặp font tốt nên có quan hệ thế nào?', options: ['Gần giống hệt nhau', 'Tương phản rõ ràng (vd serif + sans)', 'Càng nhiều font càng phong phú', 'Cùng đúng một cỡ và độ đậm'], correctIndex: 1, explanation: 'Nên tương phản rõ, tránh na ná; hai font gần-giống trông như lỗi.' },
  { id: 'q2', question: 'Một thiết kế thông thường nên giới hạn bao nhiêu font?', options: ['1 font duy nhất bắt buộc', '2 (nhiều nhất 3)', '5-6 để đa dạng', 'Không giới hạn'], correctIndex: 1, explanation: 'Thường 2 font (tiêu đề + thân), thêm font thứ 3 chỉ khi có vai trò riêng.' },
  { id: 'q3', question: 'Cách "chắc thắng" khi không tự tin phối font là?', options: ['Trộn 4 font ngẫu nhiên', 'Dùng một họ font và tạo tương phản bằng độ đậm/cỡ', 'Chỉ dùng font display', 'Dùng hai script khác nhau'], correctIndex: 1, explanation: 'Một họ font + tương phản bằng weight và size là gần như không thể sai.' },
]);

const c4 = doc('tpg203-4-1-spacing', '4.1 — Spacing & rhythm|||4.1 — Khoảng cách & nhịp chữ',
  'Kerning (khoảng giữa hai chữ cụ thể), tracking (giãn cả khối), leading (khoảng dòng ~1.4-1.6× cỡ), độ dài dòng lý tưởng 45-75 ký tự — ba đòn bẩy quyết định độ dễ đọc.',
  [[
    `<span class="eyebrow">TPG203 · Chapter 4 · Lesson 4.1</span>
<h2>Spacing &amp; rhythm</h2>
<p>Choosing a font is 20% of typography. The other 80% is <strong>spacing</strong> — the air between letters, words and lines. Get it right and even a plain font reads beautifully.</p>
<h3>The three levers</h3>
<ul>
<li><strong>Kerning</strong> — adjusting the space between <em>two specific</em> letters (the classic problem pair is "AV" or "To", which look too far apart). Mostly for large headings and logos.</li>
<li><strong>Tracking (letter-spacing)</strong> — the <em>uniform</em> space across a whole run of text. Tighten display headings slightly; add a little tracking to ALL-CAPS and small text so it breathes. Never track lowercase body text loose.</li>
<li><strong>Leading (line-height)</strong> — the vertical space between baselines. A good default for body text is <strong>1.4–1.6× the font size</strong> (16px text → ~24px line-height). Too tight and lines collide; too loose and they float apart.</li>
</ul>
<h3>Line length (measure)</h3>
<p>The ideal line is <strong>45–75 characters</strong> (~66 is the classic target). Too long and the eye loses its way back to the next line; too short and the rhythm stutters. On the web, set a <code>max-width</code> on text columns to hold this range.</p>
<pre><code>Body text starting point:
  font-size:   16px
  line-height: 1.5   (= 24px)
  measure:     ~66 characters  (max-width ~ 34em)
  tracking:    0     (default)
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> If text feels hard to read, fix spacing before you blame the font: loosen the leading and shorten the line — that solves most problems.</div>`,
    `<span class="eyebrow">TPG203 · Chương 4 · Bài 4.1</span>
<h2>Khoảng cách &amp; nhịp chữ</h2>
<p>Chọn font chỉ là 20% của typography. 80% còn lại là <strong>khoảng cách</strong> — khoảng thở giữa các chữ, từ và dòng. Chỉnh đúng thì một font bình thường cũng đọc rất đẹp.</p>
<h3>Ba đòn bẩy</h3>
<ul>
<li><strong>Kerning</strong> — chỉnh khoảng giữa <em>hai chữ cụ thể</em> (cặp kinh điển hay lỗi là "AV" hoặc "To", trông cách quá xa). Chủ yếu cho tiêu đề lớn và logo.</li>
<li><strong>Tracking (giãn chữ)</strong> — khoảng <em>đều nhau</em> trải trên cả một khối chữ. Siết nhẹ tiêu đề display; thêm chút tracking cho CHỮ HOA và chữ nhỏ để nó thở. Đừng nới lỏng chữ thân thường.</li>
<li><strong>Leading (khoảng dòng)</strong> — khoảng dọc giữa các baseline. Mặc định tốt cho chữ thân là <strong>1.4–1.6× cỡ chữ</strong> (chữ 16px → khoảng 24px). Quá sát thì các dòng đâm nhau; quá lỏng thì trôi rời.</li>
</ul>
<h3>Độ dài dòng (measure)</h3>
<p>Dòng lý tưởng dài <strong>45–75 ký tự</strong> (~66 là mốc kinh điển). Quá dài thì mắt lạc đường về đầu dòng sau; quá ngắn thì nhịp bị vấp. Trên web, đặt <code>max-width</code> cho cột chữ để giữ khoảng này.</p>
<pre><code>Điểm khởi đầu cho chữ thân:
  font-size:   16px
  line-height: 1.5   (= 24px)
  measure:     ~66 ký tự  (max-width ~ 34em)
  tracking:    0     (mặc định)
</code></pre>
<div class="callout"><span class="badge">Mẹo nhanh</span> Nếu chữ thấy khó đọc, sửa khoảng cách trước khi đổ lỗi cho font: nới leading và rút ngắn dòng — cách đó giải quyết hầu hết vấn đề.</div>`,
  ]]);

const c4q = quiz('tpg203-quiz-4', 'Quiz 4 — Spacing|||Quiz 4 — Khoảng cách', [
  { id: 'q1', question: 'Leading (line-height) tốt cho chữ THÂN thường là khoảng?', options: ['0.8× cỡ chữ', '1.0× cỡ chữ', '1.4–1.6× cỡ chữ', '3× cỡ chữ'], correctIndex: 2, explanation: 'Khoảng 1.4–1.6× cỡ chữ (16px → ~24px) cho chữ thân dễ đọc nhất.' },
  { id: 'q2', question: 'Kerning khác tracking ở chỗ?', options: ['Kerning chỉnh khoảng giữa HAI chữ cụ thể; tracking giãn ĐỀU cả khối', 'Kerning là khoảng dòng; tracking là cỡ chữ', 'Không khác gì nhau', 'Kerning chỉ dùng cho web'], correctIndex: 0, explanation: 'Kerning = cặp chữ cụ thể; tracking = giãn đều toàn khối.' },
  { id: 'q3', question: 'Độ dài dòng (measure) lý tưởng cho văn bản là?', options: ['10-20 ký tự', '45-75 ký tự', '100-140 ký tự', 'Càng dài càng tốt'], correctIndex: 1, explanation: 'Khoảng 45-75 ký tự (~66) giúp mắt tìm lại đầu dòng sau dễ dàng.' },
]);

const c5 = doc('tpg203-5-1-grids', '5.1 — Grid systems|||5.1 — Hệ lưới',
  'Lưới là bộ khung vô hình: margin, column, gutter, module, baseline grid; lưới cột (12 cột web) và lưới module; trường phái Thụy Sĩ & Müller-Brockmann — trật tự sinh ra tự do.',
  [[
    `<span class="eyebrow">TPG203 · Chapter 5 · Lesson 5.1</span>
<h2>Grid systems</h2>
<p>A <strong>grid</strong> is an invisible skeleton of lines that you align everything to. It's what makes a page feel organised instead of scattered — the single biggest upgrade to any layout.</p>
<h3>Parts of a grid</h3>
<ul>
<li><strong>Margins</strong> — the outer breathing space around the content.</li>
<li><strong>Columns</strong> — vertical divisions text and images snap to. The web standard is a <strong>12-column</strong> grid (12 divides neatly into 2, 3, 4, 6).</li>
<li><strong>Gutters</strong> — the gaps between columns that keep them from touching.</li>
<li><strong>Modules</strong> — cells formed where columns cross horizontal rows (a <em>modular grid</em>), used for image galleries and dashboards.</li>
<li><strong>Baseline grid</strong> — evenly spaced horizontal lines that text baselines sit on, so type lines up across columns.</li>
</ul>
<h3>Kinds of grid</h3>
<pre><code>Manuscript grid  -> one block  (books, essays)
Column grid      -> N columns  (magazines, websites: 12-col)
Modular grid     -> cols x rows (catalogues, dashboards)
Baseline grid    -> horizontal rhythm for all text
</code></pre>
<h3>The Swiss school</h3>
<p>Josef <strong>Müller-Brockmann</strong> and the Swiss Style (1950s) made the grid a design philosophy: mathematical order, sans-serif type, generous white space. His book <em>Grid Systems in Graphic Design</em> is still the reference.</p>
<div class="callout"><span class="badge">Order creates freedom</span> The grid isn't a cage. It removes a hundred tiny "where does this go?" decisions so your energy goes to the ones that matter — and you can break the grid deliberately for emphasis.</div>`,
    `<span class="eyebrow">TPG203 · Chương 5 · Bài 5.1</span>
<h2>Hệ lưới</h2>
<p>Một <strong>hệ lưới (grid)</strong> là bộ khung xương vô hình gồm các đường mà bạn canh mọi thứ theo. Nó khiến trang trông ngăn nắp thay vì rời rạc — bản nâng cấp lớn nhất cho bất kỳ layout nào.</p>
<h3>Các thành phần của lưới</h3>
<ul>
<li><strong>Margin (lề)</strong> — khoảng thở bên ngoài quanh nội dung.</li>
<li><strong>Column (cột)</strong> — các cột dọc mà chữ và hình bám vào. Chuẩn web là lưới <strong>12 cột</strong> (12 chia đẹp cho 2, 3, 4, 6).</li>
<li><strong>Gutter (rãnh)</strong> — khoảng hở giữa các cột, giữ chúng không dính vào nhau.</li>
<li><strong>Module (ô)</strong> — ô tạo ra nơi cột cắt các hàng ngang (<em>lưới module</em>), dùng cho thư viện ảnh và dashboard.</li>
<li><strong>Baseline grid (lưới chân dòng)</strong> — các đường ngang cách đều để baseline chữ nằm lên, giúp chữ thẳng hàng qua các cột.</li>
</ul>
<h3>Các loại lưới</h3>
<pre><code>Lưới trang đơn  -> một khối    (sách, tiểu luận)
Lưới cột        -> N cột       (tạp chí, website: 12 cột)
Lưới module     -> cột x hàng  (catalogue, dashboard)
Baseline grid   -> nhịp ngang cho toàn bộ chữ
</code></pre>
<h3>Trường phái Thụy Sĩ</h3>
<p>Josef <strong>Müller-Brockmann</strong> và Swiss Style (thập ni 1950) biến lưới thành triết lý thiết kế: trật tự toán học, chữ sans-serif, khoảng trắng rộng rãi. Cuốn <em>Grid Systems in Graphic Design</em> của ông đến nay vẫn là tài liệu tham chiếu.</p>
<div class="callout"><span class="badge">Trật tự sinh ra tự do</span> Lưới không phải cái lồng. Nó bỏ đi hàng trăm quyết định vụn "cái này đặt đâu?" để sức bạn dồn vào những cái quan trọng — và bạn có thể phá lưới có chủ đích để nhấn mạnh.</div>`,
  ]]);

const c5q = quiz('tpg203-quiz-5', 'Quiz 5 — Grids|||Quiz 5 — Hệ lưới', [
  { id: 'q1', question: 'Lưới chuẩn phổ biến nhất cho web là mấy cột?', options: ['5 cột', '8 cột', '12 cột', '20 cột'], correctIndex: 2, explanation: 'Lưới 12 cột chia đẹp cho 2, 3, 4, 6 nên rất linh hoạt cho web.' },
  { id: 'q2', question: '"Gutter" trong hệ lưới là gì?', options: ['Lề ngoài của trang', 'Khoảng hở giữa các cột', 'Đường chân dòng chữ', 'Ô giao cột và hàng'], correctIndex: 1, explanation: 'Gutter là khoảng hở giữa các cột, giữ chúng không dính nhau.' },
  { id: 'q3', question: 'Ai gắn liền với trường phái Thụy Sĩ và sách "Grid Systems in Graphic Design"?', options: ['Ellen Lupton', 'Robert Bringhurst', 'Josef Müller-Brockmann', 'Beatrice Warde'], correctIndex: 2, explanation: 'Müller-Brockmann là tên tuổi của Swiss Style và cuốn Grid Systems kinh điển.' },
]);

const c6 = doc('tpg203-6-1-hierarchy', '6.1 — Typographic hierarchy|||6.1 — Hệ thống phân cấp',
  'Phân cấp = dẫn mắt theo thứ tự quan trọng bằng cỡ, độ đậm, màu, khoảng trắng và vị trí; thang cỡ theo tỉ lệ (modular scale); H1/H2/body/caption — tổ chức thông tin để "quét" được.',
  [[
    `<span class="eyebrow">TPG203 · Chapter 6 · Lesson 6.1</span>
<h2>Typographic hierarchy</h2>
<p><strong>Hierarchy</strong> is guiding the reader's eye through content in order of importance — what to read first, second, third. Without it, everything screams at once and nothing stands out.</p>
<h3>The tools of contrast</h3>
<ul>
<li><strong>Size</strong> — bigger = more important. The most obvious signal (H1 &gt; H2 &gt; body).</li>
<li><strong>Weight</strong> — Bold pulls the eye without changing size; great for inline emphasis and labels.</li>
<li><strong>Colour / contrast</strong> — a darker or accent colour lifts an element; muted grey recedes (captions, metadata).</li>
<li><strong>Space &amp; position</strong> — white space around an item, or placing it at the top, signals importance more quietly than size.</li>
<li><strong>Case &amp; style</strong> — ALL-CAPS labels, italics for asides.</li>
</ul>
<h3>A type scale</h3>
<p>Don't pick sizes at random. Use a <strong>modular scale</strong> — each step multiplied by a ratio (e.g. 1.25) — so sizes relate harmonically.</p>
<pre><code>Scale (ratio 1.25, base 16px):
  H1  ~ 39px / Bold
  H2  ~ 31px / Bold
  H3  ~ 25px / Semibold
  Body  16px / Regular
  Caption 13px / Regular, muted
</code></pre>
<div class="callout"><span class="badge">The squint test</span> Squint at your design until it blurs. You should still see the shape of the hierarchy — the biggest, boldest thing first. If everything blurs into one grey mass, your hierarchy is too weak.</div>`,
    `<span class="eyebrow">TPG203 · Chương 6 · Bài 6.1</span>
<h2>Hệ thống phân cấp</h2>
<p><strong>Phân cấp (hierarchy)</strong> là dẫn mắt người đọc qua nội dung theo thứ tự quan trọng — đọc gì trước, gì sau. Thiếu nó, mọi thứ cùng "hét" và chẳng gì nổi bật.</p>
<h3>Các công cụ tạo tương phản</h3>
<ul>
<li><strong>Cỡ (size)</strong> — to hơn = quan trọng hơn. Tín hiệu rõ nhất (H1 &gt; H2 &gt; thân).</li>
<li><strong>Độ đậm (weight)</strong> — Bold hút mắt mà không đổi cỡ; hợp cho nhấn trong dòng và nhãn.</li>
<li><strong>Màu / tương phản</strong> — màu đậm hay màu nhấn làm nổi một phần tử; xám nhạt lùi lại (chú thích, metadata).</li>
<li><strong>Khoảng trắng &amp; vị trí</strong> — khoảng trắng quanh một mục, hay đặt nó ở trên cùng, báo hiệu quan trọng một cách nhẹ nhàng hơn cỡ chữ.</li>
<li><strong>Kiểu chữ &amp; dáng</strong> — nhãn VIẾT HOA, in nghiêng cho phần chú.</li>
</ul>
<h3>Thang cỡ chữ (type scale)</h3>
<p>Đừng chọn cỡ tùy hứng. Dùng <strong>thang theo tỉ lệ (modular scale)</strong> — mỗi bậc nhân với một tỉ số (vd 1.25) — để các cỡ liên hệ hài hòa.</p>
<pre><code>Thang (tỉ số 1.25, gốc 16px):
  H1  ~ 39px / Bold
  H2  ~ 31px / Bold
  H3  ~ 25px / Semibold
  Thân  16px / Regular
  Chú thích 13px / Regular, xám nhạt
</code></pre>
<div class="callout"><span class="badge">Phép thử nheo mắt</span> Nheo mắt đến khi thiết kế nhòe đi. Bạn vẫn phải thấy được hình dáng của phân cấp — thứ to nhất, đậm nhất trước. Nếu mọi thứ nhòe thành một mảng xám, phân cấp của bạn còn quá yếu.</div>`,
  ]]);

const c6q = quiz('tpg203-quiz-6', 'Quiz 6 — Hierarchy|||Quiz 6 — Phân cấp', [
  { id: 'q1', question: 'Phân cấp (typographic hierarchy) nhằm mục đích gì?', options: ['Làm chữ đều một cỡ', 'Dẫn mắt theo thứ tự quan trọng', 'Dùng càng nhiều màu càng tốt', 'Chỉ để trang trí'], correctIndex: 1, explanation: 'Hierarchy dẫn mắt đọc gì trước, gì sau theo mức quan trọng.' },
  { id: 'q2', question: '"Modular scale" (thang cỡ theo tỉ lệ) là gì?', options: ['Chọn cỡ chữ ngẫu nhiên', 'Mỗi bậc cỡ nhân với một tỉ số cố định (vd 1.25)', 'Luôn dùng đúng một cỡ chữ', 'Cỡ chữ theo số trang'], correctIndex: 1, explanation: 'Modular scale: các cỡ nhân theo một tỉ số để liên hệ hài hòa.' },
  { id: 'q3', question: 'Cách tạo phân cấp mà KHÔNG cần đổi cỡ chữ?', options: ['Đổi độ đậm (Bold) hoặc màu/khoảng trắng', 'Chỉ có thể bằng cỡ chữ', 'Xóa hết khoảng trắng', 'Viết tất cả in hoa'], correctIndex: 0, explanation: 'Độ đậm, màu/tương phản, khoảng trắng và vị trí đều tạo được phân cấp.' },
]);

const c7 = doc('tpg203-7-1-layout', '7.1 — Page layout|||7.1 — Dàn trang',
  'Dàn trang: cân bằng (đối xứng/bất đối xứng), khoảng trắng chủ động, canh lề (trái/phải/giữa/căn đều), gom nhóm gần nhau; khác biệt in ấn (pt, DPI, CMYK) và màn hình (px, RGB, responsive).',
  [[
    `<span class="eyebrow">TPG203 · Chapter 7 · Lesson 7.1</span>
<h2>Page layout</h2>
<p>Layout is arranging <em>all</em> the elements — type, images, space — on the page. The grid gives you structure; these principles give you polish.</p>
<h3>Layout principles</h3>
<ul>
<li><strong>Balance</strong> — <em>symmetric</em> (centred, formal, calm) vs <em>asymmetric</em> (off-centre, dynamic, modern). Both work; pick one on purpose.</li>
<li><strong>White space</strong> — empty space is <em>active</em>, not wasted. Generous margins and spacing make content feel premium and easy to scan.</li>
<li><strong>Alignment</strong> — align elements to shared edges. <strong>Left-aligned</strong> body text is the most readable; <strong>justified</strong> looks tidy but can open ugly "rivers" of space; <strong>centred</strong> suits short headings, not paragraphs.</li>
<li><strong>Proximity &amp; grouping</strong> — put related items close together and unrelated ones apart; distance shows relationship.</li>
</ul>
<h3>Print vs screen</h3>
<pre><code>              PRINT                 SCREEN
Unit          point (pt), pica      pixel (px), rem
Resolution    300 DPI (dots/inch)   72-96 PPI, but responsive
Colour        CMYK (ink)            RGB (light)
Size          fixed (paper)         fluid (many devices)
Text setup    tighter leading ok    looser leading, bigger body
</code></pre>
<div class="callout"><span class="badge">Design for the medium</span> A layout that sings on A4 paper can fail on a phone. Print is fixed and high-resolution; screens are fluid, lit from behind and read at arm's length — so on screen use a slightly bigger body size and more line-height.</div>`,
    `<span class="eyebrow">TPG203 · Chương 7 · Bài 7.1</span>
<h2>Dàn trang</h2>
<p>Dàn trang là sắp xếp <em>tất cả</em> phần tử — chữ, hình, khoảng trắng — trên trang. Lưới cho bạn cấu trúc; các nguyên tắc này cho bạn độ tinh.</p>
<h3>Nguyên tắc dàn trang</h3>
<ul>
<li><strong>Cân bằng</strong> — <em>đối xứng</em> (canh giữa, trang trọng, tĩnh) và <em>bất đối xứng</em> (lệch tâm, năng động, hiện đại). Cả hai đều được; chọn một cách có chủ đích.</li>
<li><strong>Khoảng trắng</strong> — khoảng trống là <em>chủ động</em>, không phải lãng phí. Lề rộng và khoảng cách rộng làm nội dung sang và dễ quét mắt.</li>
<li><strong>Canh lề (alignment)</strong> — canh phần tử theo các cạnh chung. Chữ thân <strong>canh trái</strong> dễ đọc nhất; <strong>căn đều (justified)</strong> gọn nhưng dễ tạo "dòng sông" khoảng trắng xấu; <strong>canh giữa</strong> hợp tiêu đề ngắn, không hợp đoạn văn.</li>
<li><strong>Gần nhau &amp; gom nhóm</strong> — mục liên quan đặt gần, mục không liên quan tách xa; khoảng cách thể hiện quan hệ.</li>
</ul>
<h3>In ấn vs màn hình</h3>
<pre><code>              IN ẤN                 MÀN HÌNH
Đơn vị        point (pt), pica      pixel (px), rem
Độ phân giải  300 DPI (chấm/inch)   72-96 PPI, nhưng responsive
Màu           CMYK (mực)            RGB (ánh sáng)
Kích thước    cố định (giấy)        co giãn (nhiều thiết bị)
Đặt chữ       leading sát cũng ổn   leading rộng hơn, thân to hơn
</code></pre>
<div class="callout"><span class="badge">Thiết kế theo phương tiện</span> Một layout đẹp trên giấy A4 có thể hỏng trên điện thoại. In là cố định và độ phân giải cao; màn hình co giãn, phát sáng từ sau và đọc ở khoảng tay với — nên trên màn hình dùng cỡ thân lớn hơn chút và line-height rộng hơn.</div>`,
  ]]);

const c7q = quiz('tpg203-quiz-7', 'Quiz 7 — Layout|||Quiz 7 — Dàn trang', [
  { id: 'q1', question: 'Kiểu canh lề nào DỄ ĐỌC nhất cho chữ thân dài?', options: ['Canh giữa', 'Canh trái', 'Căn đều (justified)', 'Canh phải'], correctIndex: 1, explanation: 'Canh trái tạo mép trái đều, mắt tìm đầu dòng dễ; canh giữa hợp tiêu đề ngắn thôi.' },
  { id: 'q2', question: 'Khoảng trắng (white space) trong dàn trang nên hiểu là?', options: ['Chỗ trống bị lãng phí cần lấp đầy', 'Yếu tố chủ động giúp nội dung dễ quét và sang hơn', 'Chỉ dùng khi thiếu nội dung', 'Luôn phải bằng 0'], correctIndex: 1, explanation: 'Khoảng trắng là chủ động: lề và khoảng cách rộng làm nội dung dễ đọc, sang trọng.' },
  { id: 'q3', question: 'Khác biệt đúng giữa in ấn và màn hình?', options: ['In dùng RGB, màn hình dùng CMYK', 'In dùng px, màn hình dùng point', 'In dùng CMYK & DPI cố định; màn hình dùng RGB & responsive', 'Không có khác biệt nào'], correctIndex: 2, explanation: 'In: CMYK, ~300 DPI, cố định; màn hình: RGB, co giãn theo thiết bị.' },
]);

const c8 = doc('tpg203-8-1-applications', '8.1 — Applications: poster, magazine, web/UI|||8.1 — Ứng dụng: poster, tạp chí, web/UI',
  'Gộp mọi thứ vào dự án thật: poster (một tiêu điểm, cỡ lớn), trang tạp chí (lưới cột, ảnh + chữ), typography web/UI (rem, line-height, system font vs web font, responsive); checklist bàn giao.',
  [[
    `<span class="eyebrow">TPG203 · Chapter 8 · Lesson 8.1</span>
<h2>Applications: poster, magazine, web/UI</h2>
<p>Now put anatomy, classification, pairing, spacing, grids and hierarchy to work on three real formats.</p>
<h3>Poster</h3>
<ul>
<li>One <strong>focal point</strong> — a single huge headline or image the eye hits first.</li>
<li>Strong hierarchy: title (display, huge) → subtitle → details (date, place) small.</li>
<li>Read from across a room, so contrast and size are everything.</li>
</ul>
<h3>Magazine / editorial spread</h3>
<ul>
<li>Multi-<strong>column grid</strong> with a clear baseline; images snap to the columns.</li>
<li>A big <strong>pull quote</strong> and a drop cap add rhythm and entry points.</li>
<li>Body serif for long reading; sans for captions and headings.</li>
</ul>
<h3>Web / UI typography</h3>
<ul>
<li>Use <strong>rem</strong> for scalable, accessible sizing; body ~16px, line-height ~1.5.</li>
<li><strong>System font stacks</strong> load instantly; <strong>web fonts</strong> (Google Fonts) add brand but cost load time — subset and preload them.</li>
<li>Design <strong>responsive</strong>: type and layout must reflow from phone to desktop; keep the measure in range at every width.</li>
</ul>
<pre><code>Layout project checklist (hand-in):
  [ ] one clear hierarchy (squint test passes)
  [ ] 2-3 fonts max, paired with contrast
  [ ] everything aligned to a grid
  [ ] body line-height 1.4-1.6, measure 45-75 chars
  [ ] white space is intentional, not leftover
  [ ] works in its medium (print DPI or responsive screen)
</code></pre>
<div class="callout"><span class="badge">Final project</span> Design one layout — a poster, a spread, or a landing page — that shows every principle from this course on a single, deliberate grid. That is the exam of typography: not knowing the rules, but making them disappear.</div>`,
    `<span class="eyebrow">TPG203 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng: poster, tạp chí, web/UI</h2>
<p>Giờ đem giải phẫu, phân loại, phối font, khoảng cách, lưới và phân cấp vào ba định dạng thật.</p>
<h3>Poster</h3>
<ul>
<li>Một <strong>tiêu điểm</strong> duy nhất — một tiêu đề hoặc hình cực lớn mà mắt chạm đầu tiên.</li>
<li>Phân cấp mạnh: tiêu đề (display, thật to) → phụ đề → chi tiết (ngày, nơi) nhỏ.</li>
<li>Phải đọc được từ xa cả căn phòng, nên tương phản và cỡ là tất cả.</li>
</ul>
<h3>Trang tạp chí / editorial</h3>
<ul>
<li><strong>Lưới nhiều cột</strong> với baseline rõ; ảnh bám vào các cột.</li>
<li>Một <strong>câu trích lớn (pull quote)</strong> và chữ cái đầu to (drop cap) tạo nhịp và điểm vào.</li>
<li>Chữ thân serif cho đọc dài; sans cho chú thích và tiêu đề.</li>
</ul>
<h3>Typography web / UI</h3>
<ul>
<li>Dùng <strong>rem</strong> để cỡ chữ co giãn và dễ tiếp cận; thân ~16px, line-height ~1.5.</li>
<li><strong>System font stack</strong> tải tức thì; <strong>web font</strong> (Google Fonts) thêm bản sắc nhưng tốn thời gian tải — hãy subset và preload.</li>
<li>Thiết kế <strong>responsive</strong>: chữ và layout phải chảy lại từ điện thoại đến desktop; giữ measure trong khoảng ở mọi bề rộng.</li>
</ul>
<pre><code>Checklist dự án dàn trang (bàn giao):
  [ ] một phân cấp rõ (qua phép thử nheo mắt)
  [ ] tối đa 2-3 font, phối có tương phản
  [ ] mọi thứ canh theo lưới
  [ ] line-height thân 1.4-1.6, measure 45-75 ký tự
  [ ] khoảng trắng có chủ đích, không phải thừa ra
  [ ] chạy đúng phương tiện (in đúng DPI hoặc màn hình responsive)
</code></pre>
<div class="callout"><span class="badge">Dự án cuối</span> Thiết kế một layout — một poster, một trang tạp chí, hoặc một trang đích — thể hiện mọi nguyên tắc của môn trên cùng một lưới có chủ đích. Đó là bài thi của typography: không phải biết luật, mà là làm cho luật biến mất.</div>`,
  ]]);

const c8q = quiz('tpg203-quiz-8', 'Quiz 8 — Applications|||Quiz 8 — Ứng dụng', [
  { id: 'q1', question: 'Ưu tiên số một khi thiết kế một POSTER là?', options: ['Nhồi thật nhiều chữ nhỏ', 'Một tiêu điểm rõ với tương phản & cỡ mạnh', 'Dùng 6 font khác nhau', 'Canh đều mọi thứ ở giữa'], correctIndex: 1, explanation: 'Poster cần một focal point, đọc được từ xa nhờ tương phản và cỡ lớn.' },
  { id: 'q2', question: 'Trong typography web/UI, nên dùng đơn vị nào cho cỡ chữ co giãn, dễ tiếp cận?', options: ['px cố định', 'rem', 'pt (point in ấn)', 'cm'], correctIndex: 1, explanation: 'rem co giãn theo cỡ gốc, tốt cho accessibility và responsive.' },
  { id: 'q3', question: 'So với web font, "system font stack" có lợi thế gì?', options: ['Tải tức thì, không tốn thời gian tải font', 'Luôn đẹp hơn', 'Bắt buộc cho in ấn', 'Không dùng được trên điện thoại'], correctIndex: 0, explanation: 'System font đã có sẵn trên máy nên tải tức thì; web font thêm bản sắc nhưng tốn tải.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'TPG203',
    slug: 'tpg203-basic-typography-layout',
    title: 'Basic typography & Layout',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/TPG203.webp',
    shortDescription: 'Typography & layout fundamentals — letterform anatomy, font classification, pairing, spacing (kerning/tracking/leading), grid systems, hierarchy, page layout & applications (poster, magazine, web/UI). Bilingual with real fonts & quizzes.|||Nền tảng chữ & dàn trang — giải phẫu con chữ, phân loại & phối font, khoảng cách (kerning/tracking/leading), hệ lưới, phân cấp, dàn trang & ứng dụng (poster, tạp chí, web/UI). Song ngữ, font thật & quiz.',
    description: 'Môn <strong>TPG203 — Basic Typography &amp; Layout</strong> (ngành Thiết kế mỹ thuật số, kỳ 3) dạy <strong>nghệ thuật chữ và dàn trang</strong>. Từ <strong>giải phẫu con chữ</strong> (x-height, ascender, serif) → <strong>phân loại &amp; phối font</strong> (serif/sans/script/display) → <strong>khoảng cách &amp; nhịp</strong> (kerning, tracking, leading, độ dài dòng) → <strong>hệ lưới</strong> (cột, module, baseline) → <strong>phân cấp</strong> → <strong>dàn trang</strong> → <strong>ứng dụng</strong> (poster, tạp chí, web/UI). Bám sách kinh điển (Lupton, Bringhurst, Müller-Brockmann), song ngữ, có font &amp; ví dụ thật, quiz mỗi chương.',
    whatYouLearn: 'Giải phẫu con chữ (baseline, x-height, ascender/descender, serif, counter); phân loại font 4 nhóm; nguyên tắc phối font (tương phản, giới hạn 2-3, superfamily); kerning/tracking/leading & độ dài dòng 45-75 ký tự; hệ lưới (12 cột, module, gutter, baseline); phân cấp bằng cỡ/đậm/màu/khoảng trắng & thang cỡ theo tỉ lệ; cân bằng, canh lề, khoảng trắng; in ấn (CMYK/DPI) vs màn hình (RGB/rem/responsive); ứng dụng poster/tạp chí/web.',
    requirements: 'Không cần nền thiết kế trước. Nên có Figma (miễn phí) để thực hành đặt chữ trên lưới; biết dùng Google Fonts là một lợi thế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách kinh điển (Lupton, Bringhurst, Müller-Brockmann), Google Fonts & Adobe Type, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Typography & dàn trang là gì; typography tốt là vô hình.', lessons: [intro] },
    { title: 'Chương 1 — Chữ & giải phẫu chữ|||Chapter 1 — Type & anatomy', description: 'baseline, x-height, ascender/descender, serif, counter.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phân loại font|||Chapter 2 — Font classification', description: 'serif/sans/script/display, lịch sử, chọn font.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Cặp đôi & phối font|||Chapter 3 — Font pairing', description: 'tương phản, giới hạn 2-3, cặp font thật.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Khoảng cách & nhịp chữ|||Chapter 4 — Spacing & rhythm', description: 'kerning, tracking, leading, độ dài dòng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Hệ lưới|||Chapter 5 — Grid systems', description: 'cột, module, gutter, baseline grid, Swiss style.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Hệ thống phân cấp|||Chapter 6 — Hierarchy', description: 'cỡ, đậm, màu, khoảng trắng, thang cỡ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Dàn trang|||Chapter 7 — Page layout', description: 'cân bằng, khoảng trắng, canh lề, in vs màn hình.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng|||Chapter 8 — Applications', description: 'poster, tạp chí, web/UI typography, dự án cuối.', lessons: [c8, c8q] },
  ],
};
