/**
 * ADB201 — Book Design & Printing Technology (Thiết kế sách & Công nghệ in ấn).
 * Ngành Thiết kế mỹ thuật số FPTU, Kỳ 7. Khung chất lượng: 8 chương, song ngữ
 * VI+EN, bám sách chuẩn quốc tế — Haslam "Book Design", Bringhurst "The Elements
 * of Typographic Style", Lupton "Thinking with Type", tài liệu Adobe InDesign.
 * Giữ NGUYÊN slug/semester/thumb/courseCode. ⚠️ KHÔNG backtick/${; & → &amp;
 * trong HTML; helper doc content .join('\n').
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('adb201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Haslam, Bringhurst, Lupton), tài liệu Adobe InDesign, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">ADB201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to design and print a real book — from page anatomy and grids to typography, covers, color and binding — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are the field's standard references, plus free tools.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ADB201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Standard reference books</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/The_Elements_of_Typographic_Style" target="_blank" rel="noopener"><em>The Elements of Typographic Style</em> — Robert Bringhurst</a></li>
<li><a href="https://www.thamesandhudson.com/book-design-9780500289846" target="_blank" rel="noopener"><em>Book Design</em> — Andrew Haslam</a></li>
<li><a href="http://thinkingwithtype.com/" target="_blank" rel="noopener"><em>Thinking with Type</em> — Ellen Lupton</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://helpx.adobe.com/indesign/user-guide.html" target="_blank" rel="noopener">Adobe InDesign — official user guide</a></li>
<li><a href="https://www.adobe.com/creativecloud/design/discover/book-design.html" target="_blank" rel="noopener">Adobe — book design basics</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFuturisFuture" target="_blank" rel="noopener">The Futur</a> — design, typography &amp; layout</li>
<li><a href="https://www.youtube.com/@satorisan" target="_blank" rel="noopener">Satori Graphics</a> — practical InDesign &amp; print</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.adobe.com/products/indesign.html" target="_blank" rel="noopener">Adobe InDesign</a> — industry-standard page layout</li>
<li><a href="https://affinity.serif.com/publisher/" target="_blank" rel="noopener">Affinity Publisher</a> — affordable layout alternative</li>
<li><a href="https://scribus.net/" target="_blank" rel="noopener">Scribus</a> — free, open-source desktop publishing</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what book design is, page anatomy, formats &amp; grids, and typography for long reading.</li>
<li><strong>Practice</strong> — lay out a real chapter in InDesign with a baseline grid and master pages.</li>
<li><strong>Go deeper</strong> — cover design, image resolution &amp; CMYK color, then offset vs digital printing.</li>
<li><strong>Job-ready</strong> — export a press-ready PDF, understand imposition, and spec the paper, binding and finishing.</li>
</ol></div>`,
    `<span class="eyebrow">ADB201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để thiết kế và in ra một quyển sách thật — từ giải phẫu trang, lưới đến typography, bìa, màu và đóng sách — gom về một chỗ. Slide &amp; giáo trình FPTU chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách chuẩn của ngành, cùng công cụ miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ADB201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo chuẩn</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/The_Elements_of_Typographic_Style" target="_blank" rel="noopener"><em>The Elements of Typographic Style</em> — Robert Bringhurst</a></li>
<li><a href="https://www.thamesandhudson.com/book-design-9780500289846" target="_blank" rel="noopener"><em>Book Design</em> — Andrew Haslam</a></li>
<li><a href="http://thinkingwithtype.com/" target="_blank" rel="noopener"><em>Thinking with Type</em> — Ellen Lupton</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://helpx.adobe.com/indesign/user-guide.html" target="_blank" rel="noopener">Adobe InDesign — hướng dẫn sử dụng chính thức</a></li>
<li><a href="https://www.adobe.com/creativecloud/design/discover/book-design.html" target="_blank" rel="noopener">Adobe — kiến thức nền thiết kế sách</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFuturisFuture" target="_blank" rel="noopener">The Futur</a> — thiết kế, typography &amp; dàn trang</li>
<li><a href="https://www.youtube.com/@satorisan" target="_blank" rel="noopener">Satori Graphics</a> — InDesign &amp; in ấn thực tế</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.adobe.com/products/indesign.html" target="_blank" rel="noopener">Adobe InDesign</a> — chuẩn công nghiệp cho dàn trang</li>
<li><a href="https://affinity.serif.com/publisher/" target="_blank" rel="noopener">Affinity Publisher</a> — lựa chọn dàn trang giá mềm</li>
<li><a href="https://scribus.net/" target="_blank" rel="noopener">Scribus</a> — phần mềm dàn trang mã nguồn mở, miễn phí</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — thiết kế sách là gì, giải phẫu trang, khổ sách &amp; lưới, và typography cho văn bản đọc dài.</li>
<li><strong>Luyện tập</strong> — dàn một chương sách thật trong InDesign với baseline grid và master page.</li>
<li><strong>Đào sâu</strong> — thiết kế bìa, độ phân giải ảnh &amp; màu CMYK, rồi in offset và in kỹ thuật số.</li>
<li><strong>Sẵn sàng đi làm</strong> — xuất PDF sẵn sàng in, hiểu bình bản, và chọn giấy, kiểu đóng, gia công thành phẩm.</li>
</ol></div>`,
  ]]);

const intro = doc('adb201-0-1-overview', 'Course overview: Book design & printing|||Tổng quan: Thiết kế sách & in ấn',
  'Thiết kế sách làm gì; vì sao dàn trang tốt giúp đọc dễ; lộ trình: thiết kế & lưới → typography → dàn trang & bìa → hình ảnh, in ấn & đóng sách.',
  [[
    `<span class="eyebrow">ADB201 · Lesson 0.1 · Overview</span>
<h2>Book Design &amp; Printing Technology</h2>
<p class="lead">This course teaches you to <strong>design a book that reads well and then print it</strong> — the craft behind every novel, textbook and art book on the shelf. You'll work from the page up: anatomy, grids and typography for long text, then layout, covers, color, printing and binding, using <strong>Adobe InDesign</strong> as the production tool.</p>
<h3>Design first, then production</h3>
<ul>
<li><strong>Design</strong> — the invisible decisions (format, grid, type size, margins) that make a page comfortable to read for hours.</li>
<li><strong>Production</strong> — turning that design into physical objects: press-ready files, ink on paper, folded and bound into a book.</li>
</ul>
<p>Great book design is meant to be <em>felt, not noticed</em> — the reader glides through the text and never blames the page.</p>
<h3>Roadmap</h3>
<p>What book design is &amp; page anatomy → formats &amp; grids → typography → layout &amp; master pages → covers → images &amp; CMYK color → printing technology → binding &amp; finishing. Bilingual, with real-book examples and quizzes.</p>`,
    `<span class="eyebrow">ADB201 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế sách &amp; Công nghệ in ấn</h2>
<p class="lead">Môn này dạy bạn <strong>thiết kế một quyển sách dễ đọc rồi in nó ra</strong> — nghề đứng sau mọi tiểu thuyết, giáo trình và sách nghệ thuật trên kệ. Bạn làm từ trang giấy đi lên: giải phẫu, lưới và typography cho văn bản dài, rồi dàn trang, bìa, màu, in và đóng sách, dùng <strong>Adobe InDesign</strong> làm công cụ sản xuất.</p>
<h3>Thiết kế trước, sản xuất sau</h3>
<ul>
<li><strong>Thiết kế</strong> — những quyết định vô hình (khổ sách, lưới, cỡ chữ, lề) khiến một trang đọc thoải mái hàng giờ.</li>
<li><strong>Sản xuất</strong> — biến thiết kế đó thành vật thể: file sẵn sàng in, mực trên giấy, gấp và đóng thành sách.</li>
</ul>
<p>Thiết kế sách giỏi là thứ để <em>cảm nhận chứ không để ý</em> — người đọc lướt qua văn bản mà không bao giờ trách trang giấy.</p>
<h3>Lộ trình</h3>
<p>Thiết kế sách là gì &amp; giải phẫu trang → khổ sách &amp; lưới → typography → dàn trang &amp; master page → bìa → hình ảnh &amp; màu CMYK → công nghệ in → đóng sách &amp; thành phẩm. Song ngữ, có ví dụ sách thật và quiz.</p>`,
  ]]);

const c1 = doc('adb201-1-1-what-is-book-design', '1.1 — What is book design & page anatomy|||1.1 — Thiết kế sách là gì & giải phẫu trang',
  'Editorial/book design, phân biệt với thiết kế đồ hoạ khác; giải phẫu một quyển sách (front/body/back matter, các thành phần trang); các loại ấn phẩm.',
  [[
    `<span class="eyebrow">ADB201 · Chapter 1 · Lesson 1.1</span>
<h2>What is book design &amp; page anatomy</h2>
<h3>Book design vs other graphic design</h3>
<p><strong>Editorial / book design</strong> is the design of long, text-heavy documents read in sequence. Unlike a poster (seen at a glance) or a logo, a book asks the reader to spend hours with the page, so the goal is <strong>sustained legibility and rhythm</strong>, not a single striking image. Andrew Haslam calls the book a "content-holding structure" designed around the act of reading.</p>
<h3>Anatomy of a book</h3>
<p>A book has three parts in reading order:</p>
<ul>
<li><strong>Front matter</strong> — half title, title page, copyright/imprint, dedication, table of contents, preface.</li>
<li><strong>Body</strong> — the chapters, the main content.</li>
<li><strong>Back matter</strong> — appendix, glossary, bibliography, index, colophon.</li>
</ul>
<h3>Anatomy of a page</h3>
<pre><code>Page elements:
  Head margin  | running head + folio (page number)
  Text block   | the main column(s) of type
  Foot margin  | footnotes / folio
  Spine / gutter side <-> outer (fore-edge) side
</code></pre>
<div class="callout"><span class="badge">Real example</span> Open any Penguin Classics paperback: the recto (right-hand) page opens each chapter, folios sit in the same place every spread, and generous outer margins give the thumb somewhere to rest — all deliberate anatomy.</div>`,
    `<span class="eyebrow">ADB201 · Chương 1 · Bài 1.1</span>
<h2>Thiết kế sách là gì &amp; giải phẫu trang</h2>
<h3>Thiết kế sách khác gì thiết kế đồ hoạ khác</h3>
<p><strong>Editorial / book design</strong> là thiết kế những tài liệu dài, nhiều chữ, đọc theo trình tự. Khác với poster (nhìn một cái là xong) hay logo, một quyển sách đòi người đọc dành hàng giờ với trang giấy, nên mục tiêu là <strong>dễ đọc bền và có nhịp</strong>, không phải một hình ảnh gây sốc. Andrew Haslam gọi sách là "cấu trúc chứa nội dung" được thiết kế quanh hành động đọc.</p>
<h3>Giải phẫu một quyển sách</h3>
<p>Sách có ba phần theo thứ tự đọc:</p>
<ul>
<li><strong>Phần đầu (front matter)</strong> — nửa tựa, trang tựa, bản quyền/imprint, đề tặng, mục lục, lời nói đầu.</li>
<li><strong>Phần thân (body)</strong> — các chương, nội dung chính.</li>
<li><strong>Phần cuối (back matter)</strong> — phụ lục, bảng thuật ngữ, thư mục, chỉ mục, colophon.</li>
</ul>
<h3>Giải phẫu một trang</h3>
<pre><code>Thành phần trang:
  Lề đầu   | running head + folio (số trang)
  Khối chữ | cột chữ chính
  Lề chân  | chú thích / folio
  Cạnh gáy (gutter) <-> cạnh ngoài (fore-edge)
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Mở bất kỳ cuốn Penguin Classics bìa mềm: trang lẻ (bên phải) luôn mở đầu mỗi chương, folio nằm cùng một chỗ mọi trang, lề ngoài rộng rãi cho ngón cái tựa vào — tất cả là giải phẫu có chủ đích.</div>`,
  ]]);

const c1q = quiz('adb201-quiz-1', 'Quiz 1 — Book design & anatomy|||Quiz 1 — Thiết kế sách & giải phẫu', [
  { id: 'q1', question: 'Mục tiêu cốt lõi của thiết kế sách khác poster/logo ở chỗ?', options: ['Một hình ảnh gây sốc nhìn một cái là xong', 'Dễ đọc bền và có nhịp qua hàng giờ đọc', 'Càng nhiều màu càng tốt', 'Chỉ cần logo đẹp'], correctIndex: 1, explanation: 'Sách đọc theo trình tự, lâu dài → ưu tiên legibility và nhịp đọc.' },
  { id: 'q2', question: 'Mục lục, trang tựa, trang bản quyền nằm ở phần nào của sách?', options: ['Front matter (phần đầu)', 'Body (phần thân)', 'Back matter (phần cuối)', 'Bìa 4'], correctIndex: 0, explanation: 'Front matter gồm nửa tựa, trang tựa, bản quyền, mục lục, lời nói đầu.' },
  { id: 'q3', question: 'Trong giải phẫu trang, "gutter" chỉ cạnh nào?', options: ['Cạnh ngoài (fore-edge)', 'Cạnh gáy (phía đóng sách)', 'Lề chân', 'Lề đầu'], correctIndex: 1, explanation: 'Gutter là lề phía gáy, nơi hai trang gặp nhau khi đóng.' },
]);

const c2 = doc('adb201-2-1-format-and-grid', '2.1 — Format & grid|||2.1 — Khổ sách & lưới',
  'Chọn format & trim size; margin; lưới cột và baseline grid; tỉ lệ trang cổ điển (van de Graaf, tỉ lệ vàng); lưới giúp nhất quán toàn sách.',
  [[
    `<span class="eyebrow">ADB201 · Chapter 2 · Lesson 2.1</span>
<h2>Format &amp; grid</h2>
<h3>Format &amp; trim size</h3>
<p>The <strong>format</strong> is the page's shape and size after cutting — the <strong>trim size</strong>. It's driven by content, reading posture and paper economy: a novel is small (e.g. 129 × 198 mm), an art book large, a field guide narrow to fit a pocket. Choosing trim early fixes everything downstream.</p>
<h3>Margins &amp; the text block</h3>
<p>Margins are not wasted space — they frame the text, hold folios and give the hand room. Classic books use <strong>progressive margins</strong>: inner (gutter) smallest, then top, then outer, then bottom largest, so the text block sits slightly high and toward the spine.</p>
<h3>Grid &amp; baseline grid</h3>
<ul>
<li><strong>Column grid</strong> — divides the page into columns so images and text align consistently across the whole book.</li>
<li><strong>Baseline grid</strong> — a horizontal ruled grid every line of body text snaps to, so lines on facing pages and across columns line up exactly.</li>
</ul>
<pre><code>Van de Graaf canon (classic page proportion):
  text block height = page width
  margins in ratio  2 : 3 : 4 : 6  (inner:top:outer:bottom)
  -> text block sits high &amp; toward the spine
</code></pre>
<div class="callout"><span class="badge">Real example</span> Set a book in InDesign with a 12-point baseline grid and align all body text to it: flip between spreads and every line of text meets its neighbor across the gutter — the invisible discipline behind a "calm" page.</div>`,
    `<span class="eyebrow">ADB201 · Chương 2 · Bài 2.1</span>
<h2>Khổ sách &amp; lưới</h2>
<h3>Format &amp; trim size</h3>
<p><strong>Format</strong> là hình dạng và kích thước trang sau khi xén — tức <strong>trim size</strong>. Nó do nội dung, tư thế đọc và tính kinh tế của giấy quyết định: tiểu thuyết khổ nhỏ (vd 129 × 198 mm), sách nghệ thuật khổ lớn, sách cẩm nang bỏ túi thì hẹp. Chọn trim sớm sẽ khoá mọi thứ phía sau.</p>
<h3>Lề &amp; khối chữ</h3>
<p>Lề không phải chỗ trống bỏ phí — nó đóng khung văn bản, giữ folio và cho tay chỗ cầm. Sách cổ điển dùng <strong>lề tăng dần</strong>: lề trong (gáy) nhỏ nhất, rồi lề trên, lề ngoài, lề dưới lớn nhất, khiến khối chữ nằm hơi cao và lệch về phía gáy.</p>
<h3>Lưới &amp; baseline grid</h3>
<ul>
<li><strong>Lưới cột</strong> — chia trang thành cột để ảnh và chữ canh nhất quán suốt cả cuốn sách.</li>
<li><strong>Baseline grid</strong> — lưới dòng ngang mà mọi dòng chữ thân bám vào, để các dòng trên hai trang đối diện và giữa các cột thẳng hàng chính xác.</li>
</ul>
<pre><code>Van de Graaf canon (tỉ lệ trang cổ điển):
  chiều cao khối chữ = chiều rộng trang
  tỉ lệ lề  2 : 3 : 4 : 6  (trong:trên:ngoài:dưới)
  -> khối chữ nằm cao &amp; lệch về gáy
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Đặt một cuốn sách trong InDesign với baseline grid 12 point và canh mọi chữ thân theo nó: lật qua các trang, từng dòng chữ khớp với dòng bên kia qua gáy — kỷ luật vô hình đứng sau một trang giấy "yên".</div>`,
  ]]);

const c2q = quiz('adb201-quiz-2', 'Quiz 2 — Format & grid|||Quiz 2 — Khổ sách & lưới', [
  { id: 'q1', question: '"Trim size" của một quyển sách là gì?', options: ['Số trang của sách', 'Kích thước trang sau khi xén', 'Độ dày gáy sách', 'Cỡ chữ thân'], correctIndex: 1, explanation: 'Trim size = kích thước/hình dạng trang cuối cùng sau khi cắt xén.' },
  { id: 'q2', question: 'Baseline grid dùng để làm gì?', options: ['Chọn màu bìa', 'Canh mọi dòng chữ thân thẳng hàng qua các cột và trang đối diện', 'Đặt số trang', 'Tách màu CMYK'], correctIndex: 1, explanation: 'Baseline grid là lưới dòng ngang để mọi dòng chữ bám vào, giữ tính nhất quán.' },
  { id: 'q3', question: 'Trong lề tăng dần cổ điển, lề nào NHỎ nhất?', options: ['Lề trong (phía gáy)', 'Lề ngoài', 'Lề dưới', 'Lề trên'], correctIndex: 0, explanation: 'Lề trong (gutter) nhỏ nhất, lề dưới lớn nhất → khối chữ nằm cao, lệch về gáy.' },
]);

const c3 = doc('adb201-3-1-typography', '3.1 — Typography for books|||3.1 — Typography cho sách',
  'Chọn font (serif cho văn bản dài), cỡ chữ & leading, độ dài dòng (measure), phân cấp (heading/subhead/caption), và typography cho mục lục.',
  [[
    `<span class="eyebrow">ADB201 · Chapter 3 · Lesson 3.1</span>
<h2>Typography for books</h2>
<h3>Choosing a text face</h3>
<p>For long reading, a well-cut <strong>serif</strong> (Garamond, Minion, Caslon) is the traditional choice — serifs and modulated strokes guide the eye along the line. Bringhurst's rule: choose a face that suits the content and the period, then set it to be read, not admired.</p>
<h3>Size, leading &amp; measure</h3>
<ul>
<li><strong>Size</strong> — body text is usually 9–12 pt for print.</li>
<li><strong>Leading</strong> — the space between baselines; roughly 120–145% of the type size (11/14 means 11 pt type on 14 pt leading).</li>
<li><strong>Measure</strong> — line length; aim for <strong>45–75 characters</strong> per line (about 66 is ideal). Too long and the eye loses the return; too short and rhythm breaks.</li>
</ul>
<h3>Hierarchy</h3>
<p>Readers navigate by <strong>hierarchy</strong> — chapter title, subhead, body, caption, folio — signalled by size, weight, space and style rather than by many colors. A table of contents is pure hierarchy: aligned entries, dot leaders, page numbers.</p>
<pre><code>Example type spec:
  Body      Minion Pro 11/14, measure ~66 chars
  Subhead   same family, 14/16 bold, space above
  Caption   9/11 italic
</code></pre>
<div class="callout"><span class="badge">Real example</span> Compare a Penguin novel (single serif, tight hierarchy) with a cookbook (multiple sizes, sidebars) — same tools, hierarchy tuned to how each is read.</div>`,
    `<span class="eyebrow">ADB201 · Chương 3 · Bài 3.1</span>
<h2>Typography cho sách</h2>
<h3>Chọn font chữ thân</h3>
<p>Với văn bản đọc dài, một font <strong>serif</strong> được vẽ tốt (Garamond, Minion, Caslon) là lựa chọn truyền thống — chân chữ và nét đậm nhạt dẫn mắt chạy dọc dòng. Nguyên tắc của Bringhurst: chọn font hợp nội dung và thời kỳ, rồi set nó để ĐỌC, không phải để ngắm.</p>
<h3>Cỡ chữ, leading &amp; độ dài dòng</h3>
<ul>
<li><strong>Cỡ chữ</strong> — chữ thân thường 9–12 pt khi in.</li>
<li><strong>Leading</strong> — khoảng cách giữa các baseline; khoảng 120–145% cỡ chữ (11/14 nghĩa là chữ 11 pt trên leading 14 pt).</li>
<li><strong>Measure (độ dài dòng)</strong> — nhắm <strong>45–75 ký tự</strong> mỗi dòng (khoảng 66 là lý tưởng). Dòng quá dài mắt lạc chỗ quay về; quá ngắn thì gãy nhịp.</li>
</ul>
<h3>Phân cấp (hierarchy)</h3>
<p>Người đọc định hướng nhờ <strong>phân cấp</strong> — tựa chương, tiểu mục, chữ thân, chú thích ảnh, folio — báo hiệu bằng cỡ, độ đậm, khoảng trắng và kiểu chữ chứ không phải nhiều màu. Mục lục là phân cấp thuần: mục canh hàng, dấu chấm dẫn, số trang.</p>
<pre><code>Ví dụ đặc tả chữ:
  Chữ thân   Minion Pro 11/14, measure ~66 ký tự
  Tiểu mục   cùng họ, 14/16 đậm, chừa khoảng trên
  Chú thích  9/11 nghiêng
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> So một tiểu thuyết Penguin (một serif, phân cấp gọn) với một sách nấu ăn (nhiều cỡ, sidebar) — cùng công cụ, phân cấp chỉnh theo cách mỗi cuốn được đọc.</div>`,
  ]]);

const c3q = quiz('adb201-quiz-3', 'Quiz 3 — Typography|||Quiz 3 — Typography', [
  { id: 'q1', question: 'Độ dài dòng (measure) lý tưởng cho văn bản đọc dài là?', options: ['Khoảng 20 ký tự/dòng', 'Khoảng 45–75 ký tự/dòng (lý tưởng ~66)', 'Càng dài càng tốt', 'Đúng 100 ký tự/dòng'], correctIndex: 1, explanation: 'Measure 45–75 ký tự giữ mắt quay về dòng đúng chỗ; ~66 là lý tưởng.' },
  { id: 'q2', question: '"11/14" trong đặc tả chữ nghĩa là?', options: ['11 trang trên 14 chương', 'Chữ cỡ 11 pt trên leading 14 pt', 'Lề 11 mm, gáy 14 mm', '11 cột, 14 dòng'], correctIndex: 1, explanation: 'Ký hiệu size/leading: cỡ chữ 11 pt đặt trên khoảng dòng (leading) 14 pt.' },
  { id: 'q3', question: 'Vì sao serif thường được chọn cho văn bản thân dài?', options: ['Vì rẻ hơn', 'Chân chữ và nét đậm nhạt dẫn mắt chạy dọc dòng, dễ đọc bền', 'Vì luôn to hơn sans-serif', 'Vì chỉ serif in được'], correctIndex: 1, explanation: 'Serif hỗ trợ đọc liên tục nhờ chân chữ dẫn mắt và độ tương phản nét.' },
]);

const c4 = doc('adb201-4-1-layout', '4.1 — Layout & composition|||4.1 — Dàn trang & bố cục',
  'Dàn trang theo spread (hai trang đối diện); master page & style; xử lý mở đầu chương; running head/folio; văn bản chảy quanh ảnh.',
  [[
    `<span class="eyebrow">ADB201 · Chapter 4 · Lesson 4.1</span>
<h2>Layout &amp; composition</h2>
<h3>Think in spreads</h3>
<p>Readers see two facing pages at once — the <strong>spread</strong> — so design the spread, not the single page. Balance the two halves across the gutter, keep the baseline aligned, and never let important content fall into the gutter where the binding swallows it.</p>
<h3>Master pages &amp; styles</h3>
<p>In InDesign a <strong>master page</strong> holds elements that repeat on every page — margins, running head, folio position, grid. <strong>Paragraph &amp; character styles</strong> store the type spec once so a whole book restyles from one place. This is what makes a 400-page book consistent and editable.</p>
<h3>Chapter openers &amp; running heads</h3>
<ul>
<li><strong>Chapter opener</strong> — a designed first page (often a recto) with the chapter title, extra top space and often no folio/running head.</li>
<li><strong>Running head</strong> — the small line at the top giving the book or chapter title; the <strong>folio</strong> is the page number.</li>
</ul>
<pre><code>Master page 'A':
  outer top -> running head + folio
  text frame linked page to page (auto flow)
  chapter-opener master 'B' -> no running head, deep top margin
</code></pre>
<div class="callout"><span class="badge">Real example</span> Flip through a well-made textbook: every chapter opens the same way, running heads switch left/right (verso = book title, recto = chapter), and body text auto-flows through linked frames — all set on master pages.</div>`,
    `<span class="eyebrow">ADB201 · Chương 4 · Bài 4.1</span>
<h2>Dàn trang &amp; bố cục</h2>
<h3>Nghĩ theo spread</h3>
<p>Người đọc nhìn hai trang đối diện cùng lúc — tức <strong>spread</strong> — nên hãy thiết kế cả spread, không phải từng trang lẻ. Cân bằng hai nửa qua gáy, giữ baseline thẳng hàng, và đừng để nội dung quan trọng rơi vào gáy nơi chỗ đóng nuốt mất.</p>
<h3>Master page &amp; style</h3>
<p>Trong InDesign, <strong>master page</strong> giữ các thành phần lặp lại trên mọi trang — lề, running head, vị trí folio, lưới. <strong>Paragraph &amp; character style</strong> lưu đặc tả chữ một lần để cả cuốn đổi kiểu từ một chỗ. Đây là thứ khiến một cuốn 400 trang nhất quán và sửa được.</p>
<h3>Mở đầu chương &amp; running head</h3>
<ul>
<li><strong>Chapter opener</strong> — trang đầu chương được thiết kế (thường là trang lẻ) với tựa chương, chừa khoảng trên rộng và thường bỏ folio/running head.</li>
<li><strong>Running head</strong> — dòng nhỏ trên đầu ghi tên sách hoặc tên chương; <strong>folio</strong> là số trang.</li>
</ul>
<pre><code>Master page 'A':
  góc trên ngoài -> running head + folio
  text frame nối trang qua trang (chảy tự động)
  master 'B' mở chương -> không running head, lề trên sâu
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Lật một giáo trình làm tốt: mọi chương mở đầu giống nhau, running head đổi trái/phải (trang chẵn = tên sách, trang lẻ = tên chương), chữ thân chảy tự động qua các frame nối nhau — tất cả đặt trên master page.</div>`,
  ]]);

const c4q = quiz('adb201-quiz-4', 'Quiz 4 — Layout|||Quiz 4 — Dàn trang', [
  { id: 'q1', question: 'Vì sao nên thiết kế theo "spread" chứ không từng trang lẻ?', options: ['Vì in nhanh hơn', 'Vì người đọc nhìn hai trang đối diện cùng lúc', 'Vì tốn ít mực hơn', 'Vì bắt buộc trong InDesign'], correctIndex: 1, explanation: 'Mắt thấy cả hai trang một lúc → phải cân bằng bố cục trên toàn spread.' },
  { id: 'q2', question: 'Master page trong InDesign dùng để?', options: ['Chọn màu mực', 'Giữ các thành phần lặp lại (lề, running head, folio, lưới) cho mọi trang', 'Đóng gáy sách', 'Xén trang'], correctIndex: 1, explanation: 'Master page chứa mọi thứ lặp lại, giúp cuốn dày vẫn nhất quán và dễ sửa.' },
  { id: 'q3', question: '"Folio" trong một trang sách là?', options: ['Tên tác giả', 'Số trang', 'Tựa chương', 'Chú thích ảnh'], correctIndex: 1, explanation: 'Folio là số trang; running head là dòng ghi tên sách/chương.' },
]);

const c5 = doc('adb201-5-1-cover-and-parts', '5.1 — Cover & book parts|||5.1 — Bìa & các thành phần sách',
  'Thiết kế bìa (bìa 1, gáy, bìa 4); tính bề rộng gáy theo số trang/giấy; trang tựa, trang bản quyền, colophon; jacket/flap.',
  [[
    `<span class="eyebrow">ADB201 · Chapter 5 · Lesson 5.1</span>
<h2>Cover &amp; book parts</h2>
<h3>The cover as one wrapped surface</h3>
<p>A printed cover is a single flat sheet folded around the book, with three faces: <strong>front cover</strong> (title, author, image — it must sell and identify), <strong>spine</strong> (title + author, read on the shelf) and <strong>back cover</strong> (blurb, barcode/ISBN, publisher). A hardback adds a <strong>dust jacket</strong> with front/back <strong>flaps</strong>.</p>
<h3>Spine width</h3>
<p>The spine is not decorative — its width must match the physical thickness of the pages:</p>
<pre><code>Spine width (mm)
  = (page count / 2) x paper thickness per sheet (mm)
Example: 320 pages, 0.10 mm/sheet
  = 160 sheets x 0.10 = 16 mm spine
</code></pre>
<p>Get this wrong and the spine text wraps onto the front — always take the paper's <strong>PPI/bulk</strong> from the printer.</p>
<h3>Interior identity pages</h3>
<ul>
<li><strong>Title page</strong> — full title, author, publisher; the design "handshake" of the book.</li>
<li><strong>Copyright/imprint page</strong> — ISBN, edition, printer, legal notices (verso of the title page).</li>
<li><strong>Colophon</strong> — a note on the typefaces, paper and production, traditionally at the very back.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> Look at a Penguin spine on a shelf: title and author sized to read from a meter away, publisher's mark at the foot — designed for the one moment a browser scans the shelf edge-on.</div>`,
    `<span class="eyebrow">ADB201 · Chương 5 · Bài 5.1</span>
<h2>Bìa &amp; các thành phần sách</h2>
<h3>Bìa là một mặt phẳng bọc quanh sách</h3>
<p>Bìa in là một tờ phẳng gấp quanh sách, có ba mặt: <strong>bìa 1</strong> (tựa, tác giả, hình — phải bán được và nhận diện), <strong>gáy</strong> (tựa + tác giả, đọc khi xếp kệ) và <strong>bìa 4</strong> (giới thiệu, mã vạch/ISBN, nhà xuất bản). Sách bìa cứng có thêm <strong>áo sách (jacket)</strong> với <strong>tai gấp (flap)</strong> trước/sau.</p>
<h3>Bề rộng gáy</h3>
<p>Gáy không phải trang trí — bề rộng của nó phải khớp độ dày thật của ruột sách:</p>
<pre><code>Bề rộng gáy (mm)
  = (số trang / 2) x độ dày mỗi tờ giấy (mm)
Ví dụ: 320 trang, 0,10 mm/tờ
  = 160 tờ x 0,10 = 16 mm gáy
</code></pre>
<p>Sai chỗ này thì chữ gáy tràn ra bìa trước — luôn lấy <strong>PPI/định lượng (bulk)</strong> của giấy từ nhà in.</p>
<h3>Các trang nhận diện bên trong</h3>
<ul>
<li><strong>Trang tựa</strong> — tựa đầy đủ, tác giả, nhà xuất bản; cái "bắt tay" thiết kế của sách.</li>
<li><strong>Trang bản quyền/imprint</strong> — ISBN, lần in, nhà in, thông tin pháp lý (mặt sau trang tựa).</li>
<li><strong>Colophon</strong> — ghi chú về font chữ, giấy và cách sản xuất, theo truyền thống nằm ở cuối sách.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Nhìn gáy một cuốn Penguin trên kệ: tựa và tác giả to đủ đọc từ một mét, dấu nhà xuất bản ở chân gáy — thiết kế cho đúng khoảnh khắc người mua quét dọc mép kệ.</div>`,
  ]]);

const c5q = quiz('adb201-quiz-5', 'Quiz 5 — Cover & parts|||Quiz 5 — Bìa & thành phần', [
  { id: 'q1', question: 'Bề rộng gáy sách phụ thuộc chủ yếu vào?', options: ['Cỡ chữ tựa', 'Số trang và độ dày mỗi tờ giấy', 'Màu bìa', 'Tên tác giả dài hay ngắn'], correctIndex: 1, explanation: 'Gáy = (số trang/2) × độ dày mỗi tờ; phải lấy định lượng giấy từ nhà in.' },
  { id: 'q2', question: 'ISBN, mã vạch và lời giới thiệu thường nằm ở?', options: ['Bìa 1', 'Gáy', 'Bìa 4', 'Trang tựa'], correctIndex: 2, explanation: 'Bìa 4 (mặt sau) mang blurb, mã vạch/ISBN, thông tin nhà xuất bản.' },
  { id: 'q3', question: 'Colophon là gì?', options: ['Ghi chú về font chữ, giấy và cách sản xuất sách', 'Số trang', 'Mã vạch', 'Tên chương'], correctIndex: 0, explanation: 'Colophon mô tả typeface/giấy/sản xuất, truyền thống đặt ở cuối sách.' },
]);

const c6 = doc('adb201-6-1-image-and-color', '6.1 — Images & color printing|||6.1 — Hình ảnh & in màu',
  'Độ phân giải ảnh (300 ppi khi in); RGB vs CMYK; tách màu (4 kênh CMYK) & halftone; quản lý màu, ICC profile, thử proof.',
  [[
    `<span class="eyebrow">ADB201 · Chapter 6 · Lesson 6.1</span>
<h2>Images &amp; color printing</h2>
<h3>Resolution</h3>
<p>Screen and print measure detail differently. For quality print, photos should be about <strong>300 ppi at final printed size</strong>; line art (logos, diagrams) needs far more (1200 dpi) or should be vector. A 72-ppi web image blown up to a full page will look soft and blocky.</p>
<h3>RGB vs CMYK</h3>
<p>Screens mix light in <strong>RGB</strong> (red, green, blue — additive). Presses lay down ink in <strong>CMYK</strong> (cyan, magenta, yellow, key/black — subtractive). Every image bound for print must be converted to CMYK, and vivid RGB colors (bright greens, oranges) can shift because they fall outside the CMYK <strong>gamut</strong>.</p>
<h3>Separation, halftone &amp; color management</h3>
<ul>
<li><strong>Color separation</strong> — the file is split into four plates, one per CMYK ink.</li>
<li><strong>Halftone</strong> — continuous tone is reproduced as a grid of tiny dots of varying size; the eye blends them.</li>
<li><strong>Color management</strong> — <strong>ICC profiles</strong> describe how a device renders color so what you see previews the print; a <strong>proof</strong> confirms it before the full run.</li>
</ul>
<pre><code>Print image checklist:
  Mode   -> CMYK
  Res    -> ~300 ppi at final size
  Profile-> assign the printer's ICC / soft-proof
</code></pre>
<div class="callout"><span class="badge">Real example</span> An art book of paintings is proofed on the actual paper before printing — a matte uncoated stock drinks ink and dulls color, so the designer and printer adjust curves until the proof matches the artwork.</div>`,
    `<span class="eyebrow">ADB201 · Chương 6 · Bài 6.1</span>
<h2>Hình ảnh &amp; in màu</h2>
<h3>Độ phân giải</h3>
<p>Màn hình và bản in đo chi tiết khác nhau. Để in đẹp, ảnh chụp nên khoảng <strong>300 ppi tại kích thước in cuối</strong>; hình nét (logo, sơ đồ) cần cao hơn nhiều (1200 dpi) hoặc nên là vector. Ảnh web 72 ppi phóng lên cả trang sẽ nhoè và vỡ hạt.</p>
<h3>RGB vs CMYK</h3>
<p>Màn hình trộn ánh sáng theo <strong>RGB</strong> (đỏ, lục, lam — cộng màu). Máy in đặt mực theo <strong>CMYK</strong> (cyan, magenta, vàng, đen/key — trừ màu). Mọi ảnh dành để in phải đổi sang CMYK, và các màu RGB rực (xanh lá, cam chói) có thể lệch vì nằm ngoài <strong>gamut</strong> CMYK.</p>
<h3>Tách màu, halftone &amp; quản lý màu</h3>
<ul>
<li><strong>Tách màu</strong> — file được tách thành bốn bản (plate), mỗi bản cho một mực CMYK.</li>
<li><strong>Halftone (tram)</strong> — tông liên tục được tái tạo bằng lưới các chấm nhỏ to nhỏ khác nhau; mắt tự trộn lại.</li>
<li><strong>Quản lý màu</strong> — <strong>ICC profile</strong> mô tả cách một thiết bị hiển thị màu để cái bạn thấy dự đoán được bản in; một bản <strong>proof</strong> xác nhận trước khi in loạt lớn.</li>
</ul>
<pre><code>Checklist ảnh in:
  Mode   -> CMYK
  Res    -> ~300 ppi tại kích thước cuối
  Profile-> gán ICC của nhà in / soft-proof
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Một cuốn sách tranh được in proof trên đúng loại giấy trước khi in thật — giấy không tráng phủ hút mực và làm màu xỉn, nên nhà thiết kế và nhà in chỉnh đường cong màu đến khi proof khớp bản gốc.</div>`,
  ]]);

const c6q = quiz('adb201-quiz-6', 'Quiz 6 — Images & color|||Quiz 6 — Hình ảnh & màu', [
  { id: 'q1', question: 'Độ phân giải ảnh chụp thường cần bao nhiêu để in đẹp?', options: ['72 ppi', 'Khoảng 300 ppi tại kích thước in cuối', '10 ppi', 'Không quan trọng'], correctIndex: 1, explanation: 'Ảnh in chất lượng ~300 ppi tại kích thước cuối; hình nét cần cao hơn hoặc vector.' },
  { id: 'q2', question: 'Hệ màu dùng cho in ấn (mực trên giấy) là?', options: ['RGB', 'CMYK', 'HSB', 'Grayscale luôn'], correctIndex: 1, explanation: 'In dùng CMYK (cyan, magenta, vàng, đen) — trừ màu; màn hình dùng RGB.' },
  { id: 'q3', question: '"Halftone" (tram) trong in ấn là?', options: ['Một loại giấy', 'Tái tạo tông liên tục bằng lưới các chấm to nhỏ khác nhau', 'Cách đóng gáy', 'Font chữ'], correctIndex: 1, explanation: 'Halftone biến tông liên tục thành lưới chấm; mắt tự trộn thành sắc độ.' },
]);

const c7 = doc('adb201-7-1-printing-technology', '7.1 — Printing technology|||7.1 — Công nghệ in',
  'In offset vs in kỹ thuật số (khi nào dùng cái nào); giấy (định lượng, tráng/không tráng); khổ in & bình bản (imposition); overprint/bleed.',
  [[
    `<span class="eyebrow">ADB201 · Chapter 7 · Lesson 7.1</span>
<h2>Printing technology</h2>
<h3>Offset vs digital</h3>
<ul>
<li><strong>Offset lithography</strong> — ink is transferred from plates via a rubber blanket to paper. High setup cost (plates) but cheap per copy and best quality — the choice for long runs (thousands of books).</li>
<li><strong>Digital printing</strong> — no plates; prints straight from the file. Cheap for short runs and print-on-demand, and allows variable data, but higher cost per page at scale.</li>
</ul>
<h3>Paper</h3>
<p>Paper is chosen by <strong>weight (gsm)</strong>, <strong>finish</strong> (coated/glossy vs uncoated/matte) and <strong>bulk</strong>. Novels use light uncoated stock (easy on the eye, low weight); art books use heavier coated stock for sharp color.</p>
<h3>Sheet size &amp; imposition</h3>
<p>Books print many pages on one large sheet, folded into a <strong>signature</strong>. <strong>Imposition</strong> arranges pages on the sheet so that after folding and trimming they land in the right order.</p>
<pre><code>Prepress essentials:
  Bleed     -> art extends 3 mm past trim
  Imposition-> pages ordered for folding (e.g. 16-page signature)
  Marks     -> trim + registration + color bars
</code></pre>
<div class="callout"><span class="badge">Real example</span> A 320-page novel is printed as twenty 16-page signatures on an offset press, folded, gathered in order and then bound — imposition is why page 2 sits next to page 15 on the flat sheet.</div>`,
    `<span class="eyebrow">ADB201 · Chương 7 · Bài 7.1</span>
<h2>Công nghệ in</h2>
<h3>In offset vs in kỹ thuật số</h3>
<ul>
<li><strong>In offset</strong> — mực truyền từ bản kẽm qua tấm cao su (blanket) rồi lên giấy. Chi phí khởi tạo cao (làm bản) nhưng rẻ mỗi bản và chất lượng tốt nhất — chọn cho in loạt lớn (hàng nghìn cuốn).</li>
<li><strong>In kỹ thuật số</strong> — không cần bản; in thẳng từ file. Rẻ cho số lượng ít và in theo yêu cầu (print-on-demand), cho phép dữ liệu biến đổi, nhưng đắt hơn mỗi trang khi in nhiều.</li>
</ul>
<h3>Giấy</h3>
<p>Giấy được chọn theo <strong>định lượng (gsm)</strong>, <strong>bề mặt</strong> (tráng phủ/bóng vs không tráng/mờ) và <strong>độ xốp (bulk)</strong>. Tiểu thuyết dùng giấy không tráng nhẹ (đỡ chói mắt, nhẹ cân); sách nghệ thuật dùng giấy tráng nặng hơn cho màu sắc nét.</p>
<h3>Khổ in &amp; bình bản (imposition)</h3>
<p>Sách in nhiều trang trên một tờ lớn, gấp lại thành một <strong>tay sách (signature)</strong>. <strong>Bình bản</strong> sắp các trang trên tờ in sao cho sau khi gấp và xén chúng nằm đúng thứ tự.</p>
<pre><code>Cốt lõi trước in (prepress):
  Bleed     -> hình tràn 3 mm ra ngoài đường xén
  Bình bản  -> sắp trang để gấp (vd tay 16 trang)
  Marks     -> dấu xén + canh chồng màu + thanh màu
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Một tiểu thuyết 320 trang được in thành hai mươi tay sách 16 trang trên máy offset, gấp, gom đúng thứ tự rồi đóng — bình bản là lý do trang 2 nằm cạnh trang 15 trên tờ in phẳng.</div>`,
  ]]);

const c7q = quiz('adb201-quiz-7', 'Quiz 7 — Printing tech|||Quiz 7 — Công nghệ in', [
  { id: 'q1', question: 'Với in số lượng LỚN (hàng nghìn cuốn), phương pháp kinh tế và chất lượng nhất thường là?', options: ['In kỹ thuật số', 'In offset', 'In phun tại nhà', 'Photocopy'], correctIndex: 1, explanation: 'Offset: setup đắt (làm bản) nhưng rẻ mỗi bản và chất lượng tốt cho loạt lớn.' },
  { id: 'q2', question: '"Bleed" (tràn lề) trong chuẩn bị file in là?', options: ['Khoảng trắng giữa các cột', 'Hình tràn ra ngoài đường xén (thường ~3 mm)', 'Số trang mỗi tay sách', 'Độ dày gáy'], correctIndex: 1, explanation: 'Bleed cho hình vượt qua đường trim để sau khi xén không lộ mép trắng.' },
  { id: 'q3', question: 'Bình bản (imposition) làm gì?', options: ['Chọn màu mực', 'Sắp các trang trên tờ in lớn để sau khi gấp/xén ra đúng thứ tự', 'Thiết kế bìa', 'Đo độ phân giải ảnh'], correctIndex: 1, explanation: 'Imposition sắp trang trên signature để gấp thành đúng trình tự đọc.' },
]);

const c8 = doc('adb201-8-1-binding-and-finishing', '8.1 — Binding & finishing|||8.1 — Đóng sách & thành phẩm',
  'Kiểu đóng (khâu chỉ, đóng keo/perfect, đóng ghim, gáy xoắn); gia công (cán màng, dập nổi, ép nhũ); quy trình file→sách; ebook & EPUB.',
  [[
    `<span class="eyebrow">ADB201 · Chapter 8 · Lesson 8.1</span>
<h2>Binding &amp; finishing</h2>
<h3>Binding methods</h3>
<ul>
<li><strong>Saddle-stitch</strong> — folded sheets stapled at the spine; for thin booklets/magazines.</li>
<li><strong>Perfect binding</strong> — pages glued at the spine into a flat cover; standard for paperbacks.</li>
<li><strong>Sewn (section) binding</strong> — signatures sewn with thread, strongest and lies flat; used for durable hardbacks.</li>
<li><strong>Spiral / wire-o</strong> — a coil through punched holes; lies completely flat, for manuals and notebooks.</li>
</ul>
<h3>Finishing</h3>
<p>After binding, <strong>finishing</strong> adds protection and effect: <strong>lamination</strong> (matte/gloss film on the cover), <strong>spot UV</strong>, <strong>foil stamping</strong> (metallic), <strong>embossing/debossing</strong> (raised/recessed) and <strong>die-cutting</strong>.</p>
<h3>File to finished book</h3>
<pre><code>Production pipeline:
  Design (InDesign) -> preflight -> export press-ready PDF/X
  -> RIP &amp; plates (offset) or direct (digital)
  -> print -> fold into signatures -> gather -> bind
  -> trim -> finishing (laminate/foil) -> the book
</code></pre>
<h3>Ebook</h3>
<p>The same content can ship as an <strong>ebook</strong> — <strong>EPUB</strong> is <em>reflowable</em> (text adapts to the screen, so fixed page design is replaced by CSS/styles), while a <strong>fixed-layout</strong> EPUB or PDF keeps the print design for illustrated books.</p>
<div class="callout"><span class="badge">Real example</span> A hardcover art book is sewn (lies flat to show a double-page image), the jacket is matte-laminated with foil-stamped title — while its ebook edition is a fixed-layout EPUB that preserves the exact spreads.</div>`,
    `<span class="eyebrow">ADB201 · Chương 8 · Bài 8.1</span>
<h2>Đóng sách &amp; thành phẩm</h2>
<h3>Các kiểu đóng</h3>
<ul>
<li><strong>Đóng ghim (saddle-stitch)</strong> — các tờ gấp bấm ghim ở gáy; cho sách mỏng/tạp chí.</li>
<li><strong>Đóng keo (perfect binding)</strong> — các trang dán keo ở gáy vào bìa phẳng; chuẩn cho sách bìa mềm.</li>
<li><strong>Khâu chỉ (sewn)</strong> — các tay sách khâu bằng chỉ, chắc nhất và mở nằm phẳng; dùng cho sách bìa cứng bền.</li>
<li><strong>Gáy xoắn (spiral / wire-o)</strong> — lò xo luồn qua lỗ đục; mở phẳng hoàn toàn, cho sổ tay và cẩm nang.</li>
</ul>
<h3>Gia công thành phẩm</h3>
<p>Sau khi đóng, <strong>gia công</strong> thêm lớp bảo vệ và hiệu ứng: <strong>cán màng</strong> (màng mờ/bóng trên bìa), <strong>phủ UV cục bộ</strong>, <strong>ép nhũ (foil)</strong> (ánh kim), <strong>dập nổi/dập chìm</strong> (embossing/debossing) và <strong>bế/cắt khuôn (die-cut)</strong>.</p>
<h3>Từ file đến sách hoàn chỉnh</h3>
<pre><code>Quy trình sản xuất:
  Thiết kế (InDesign) -> preflight -> xuất PDF/X sẵn sàng in
  -> RIP &amp; làm bản (offset) hoặc in thẳng (số)
  -> in -> gấp thành tay sách -> gom -> đóng
  -> xén -> gia công (cán màng/ép nhũ) -> quyển sách
</code></pre>
<h3>Ebook</h3>
<p>Cùng nội dung có thể phát hành thành <strong>ebook</strong> — <strong>EPUB</strong> dạng <em>reflow</em> (chữ co giãn theo màn hình, nên thiết kế trang cố định được thay bằng CSS/style), còn <strong>fixed-layout</strong> EPUB hoặc PDF giữ nguyên thiết kế in cho sách nhiều hình.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Một cuốn sách tranh bìa cứng được khâu chỉ (mở phẳng để khoe ảnh trải hai trang), áo sách cán mờ với tựa ép nhũ — còn bản ebook là EPUB fixed-layout giữ nguyên đúng các spread.</div>`,
  ]]);

const c8q = quiz('adb201-quiz-8', 'Quiz 8 — Binding & finishing|||Quiz 8 — Đóng sách & thành phẩm', [
  { id: 'q1', question: 'Kiểu đóng nào chắc nhất và mở nằm phẳng, dùng cho sách bìa cứng bền?', options: ['Đóng ghim (saddle-stitch)', 'Đóng keo (perfect binding)', 'Khâu chỉ (sewn/section)', 'Gáy xoắn'], correctIndex: 2, explanation: 'Khâu chỉ theo tay sách bền nhất và mở phẳng; chuẩn cho bìa cứng cao cấp.' },
  { id: 'q2', question: '"Ép nhũ (foil stamping)" là gì?', options: ['Dán keo gáy', 'In hiệu ứng ánh kim lên bìa bằng lá kim loại và nhiệt/áp lực', 'Xén trang', 'Tách màu CMYK'], correctIndex: 1, explanation: 'Foil stamping ép lá kim loại lên bề mặt tạo chữ/hình ánh kim.' },
  { id: 'q3', question: 'Định dạng ebook "reflowable" (EPUB) khác bản in ở chỗ?', options: ['Giữ nguyên thiết kế trang cố định', 'Chữ co giãn theo màn hình, thiết kế trang cố định thay bằng CSS/style', 'Không đọc được trên điện thoại', 'Bắt buộc in ra giấy'], correctIndex: 1, explanation: 'EPUB reflow để văn bản thích ứng màn hình; muốn giữ bố cục in thì dùng fixed-layout.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'ADB201',
    slug: 'adb201-book-design-printing-technology',
    title: 'Book Design & Printing Technology',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ADB201.webp',
    shortDescription: 'Design and print a real book — book design & page anatomy, formats & grids, typography for long text, layout & master pages, covers, images & CMYK color, offset/digital printing, paper, binding & finishing. Bilingual, examples & quizzes.|||Thiết kế và in một quyển sách thật — book design & giải phẫu trang, khổ sách & lưới, typography, dàn trang & master page, bìa, ảnh & màu CMYK, in offset/số, giấy, đóng sách & thành phẩm. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>ADB201 — Book Design &amp; Printing Technology</strong> (Thiết kế sách &amp; Công nghệ in ấn, kỳ 7) dạy bạn <strong>thiết kế một quyển sách dễ đọc rồi in nó ra</strong>. Đi từ <strong>thiết kế sách là gì &amp; giải phẫu trang</strong> → <strong>khổ sách &amp; lưới</strong> → <strong>typography</strong> (font, cỡ chữ, leading, phân cấp) → <strong>dàn trang &amp; master page</strong> → <strong>bìa</strong> → <strong>hình ảnh &amp; màu CMYK</strong> → <strong>công nghệ in</strong> (offset/số, giấy, bình bản) → <strong>đóng sách &amp; thành phẩm</strong>. Bám sách chuẩn (Haslam, Bringhurst, Lupton) và Adobe InDesign, song ngữ, có ví dụ sách thật và quiz mỗi chương.',
    whatYouLearn: 'Book design vs thiết kế khác; giải phẫu sách/trang (front/body/back matter); format & trim size, lề, lưới cột & baseline grid; chọn font serif, cỡ chữ/leading, measure, phân cấp; spread, master page & style, running head/folio; bìa (bìa 1/gáy/bìa 4), tính bề rộng gáy, trang tựa & colophon; độ phân giải ảnh, RGB vs CMYK, tách màu, halftone, ICC/proof; in offset vs kỹ thuật số, giấy (gsm), bình bản, bleed; kiểu đóng (khâu chỉ/keo/ghim/xoắn), gia công (cán màng/ép nhũ/dập nổi), quy trình file→sách, và ebook (EPUB).',
    requirements: 'Kiến thức thiết kế đồ hoạ cơ bản (bố cục, màu, chữ). Nên có Adobe InDesign (hoặc Affinity Publisher/Scribus miễn phí) để làm theo.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, Adobe InDesign, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thiết kế sách làm gì, thiết kế trước – sản xuất sau, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Thiết kế sách & giải phẫu|||Chapter 1 — Book design & anatomy', description: 'Editorial/book design, giải phẫu sách & trang.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khổ sách & lưới|||Chapter 2 — Format & grid', description: 'Trim size, lề, lưới cột & baseline grid, tỉ lệ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Typography|||Chapter 3 — Typography', description: 'Font, cỡ chữ/leading, measure, phân cấp, mục lục.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Dàn trang & bố cục|||Chapter 4 — Layout', description: 'Spread, master page & style, running head/folio.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Bìa & thành phần|||Chapter 5 — Cover & parts', description: 'Bìa 1/gáy/bìa 4, bề rộng gáy, trang tựa, colophon.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Hình ảnh & in màu|||Chapter 6 — Images & color', description: 'Độ phân giải, RGB/CMYK, tách màu, halftone, ICC/proof.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Công nghệ in|||Chapter 7 — Printing technology', description: 'Offset vs số, giấy, khổ in & bình bản, bleed.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đóng sách & thành phẩm|||Chapter 8 — Binding & finishing', description: 'Kiểu đóng, gia công, quy trình file→sách, ebook.', lessons: [c8, c8q] },
  ],
};
