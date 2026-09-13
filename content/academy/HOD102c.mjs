/**
 * HOD102c — Design History (Lịch sử Thiết kế). Ngành Thiết kế mỹ thuật số, kỳ 8.
 * Giáo trình tham khảo (trích dẫn, KHÔNG upload PDF): Meggs "History of Graphic
 * Design"; Penny Sparke "An Introduction to Design and Culture"; John Heskett
 * "Design: A Very Short Introduction"; Gombrich "The Story of Art".
 * Môn lý thuyết lịch sử — 8 chương song ngữ + quiz. Giữ NGUYÊN
 * slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('hod102c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Meggs, Sparke, Heskett, Gombrich), bảo tàng & lưu trữ trực tuyến, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">HOD102c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study <strong>Design History</strong> — from writing, printing and the Industrial Revolution through modernism to today's digital and sustainable design — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for HOD102c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Philip Meggs — <em>Meggs History of Graphic Design</em> (the standard survey of graphic design)</li>
<li>Penny Sparke — <em>An Introduction to Design and Culture</em> (design in its social context, 1900 onward)</li>
<li>John Heskett — <em>Design: A Very Short Introduction</em> (what design is and does)</li>
<li>E. H. Gombrich — <em>The Story of Art</em> (the visual-culture backdrop)</li>
</ul>
<h3>🌐 Museums &amp; archives</h3>
<ul>
<li><a href="https://www.vam.ac.uk/" target="_blank" rel="noopener">Victoria &amp; Albert Museum</a> — the world design collection</li>
<li><a href="https://www.moma.org/collection/" target="_blank" rel="noopener">MoMA Collection</a> — design &amp; architecture holdings</li>
<li><a href="https://www.cooperhewitt.org/" target="_blank" rel="noopener">Cooper Hewitt, Smithsonian Design Museum</a></li>
</ul>
<h3>▶️ Video &amp; talks</h3>
<ul>
<li><a href="https://www.youtube.com/@TheArtAssignment" target="_blank" rel="noopener">The Art Assignment</a> — art &amp; design movements explained</li>
<li><a href="https://www.ted.com/topics/design" target="_blank" rel="noopener">TED — Design talks</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — read one movement per week; place it on the timeline (who, where, why then).</li>
<li><strong>Look closely</strong> — for each movement collect three canonical works and describe form, not just feeling.</li>
<li><strong>Connect</strong> — trace how each style answered the one before it (revolt, refinement or revival).</li>
<li><strong>Apply</strong> — spot these histories inside the brands, apps and posters you meet every day.</li>
</ol></div>`,
    `<span class="eyebrow">HOD102c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Lịch sử Thiết kế</strong> — từ chữ viết, in ấn và cách mạng công nghiệp, qua chủ nghĩa hiện đại, tới thiết kế số và bền vững hôm nay — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của HOD102c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo chuẩn</h3>
<ul>
<li>Philip Meggs — <em>Meggs History of Graphic Design</em> (bộ khảo cứu chuẩn về thiết kế đồ hoạ)</li>
<li>Penny Sparke — <em>An Introduction to Design and Culture</em> (thiết kế trong bối cảnh xã hội, từ 1900)</li>
<li>John Heskett — <em>Design: A Very Short Introduction</em> (thiết kế là gì và làm gì)</li>
<li>E. H. Gombrich — <em>The Story of Art</em> (nền văn hoá thị giác)</li>
</ul>
<h3>🌐 Bảo tàng &amp; lưu trữ</h3>
<ul>
<li><a href="https://www.vam.ac.uk/" target="_blank" rel="noopener">Bảo tàng Victoria &amp; Albert</a> — bộ sưu tập thiết kế lớn của thế giới</li>
<li><a href="https://www.moma.org/collection/" target="_blank" rel="noopener">Bộ sưu tập MoMA</a> — thiết kế &amp; kiến trúc</li>
<li><a href="https://www.cooperhewitt.org/" target="_blank" rel="noopener">Cooper Hewitt, Bảo tàng Thiết kế Smithsonian</a></li>
</ul>
<h3>▶️ Video &amp; bài nói</h3>
<ul>
<li><a href="https://www.youtube.com/@TheArtAssignment" target="_blank" rel="noopener">The Art Assignment</a> — giảng các phong trào nghệ thuật &amp; thiết kế</li>
<li><a href="https://www.ted.com/topics/design" target="_blank" rel="noopener">TED — các bài nói về thiết kế</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — mỗi tuần đọc một phong trào; đặt nó lên dòng thời gian (ai, ở đâu, vì sao lúc đó).</li>
<li><strong>Nhìn kỹ</strong> — mỗi phong trào chọn ba tác phẩm tiêu biểu và mô tả hình thức, không chỉ cảm giác.</li>
<li><strong>Nối lại</strong> — lần theo cách mỗi phong cách đáp lại phong cách trước (chống lại, tinh lọc hay phục hưng).</li>
<li><strong>Áp dụng</strong> — nhận ra các lịch sử này trong thương hiệu, ứng dụng và áp phích quanh bạn mỗi ngày.</li>
</ol></div>`,
  ]]);

const intro = doc('hod102c-0-1-overview', 'Course overview: Design History|||Tổng quan: Lịch sử Thiết kế',
  'Thiết kế là gì; vì sao học lịch sử thiết kế; cách đọc một phong trào (bối cảnh, hình thức, nhân vật); lộ trình 8 chương từ in ấn tới thiết kế đương đại & Việt Nam.',
  [[
    `<span class="eyebrow">HOD102c · Lesson 0.1 · Overview</span>
<h2>Design History</h2>
<p class="lead">This course tells the story of how <strong>design</strong> — the shaping of images, type, objects and interfaces for use — became the discipline we practise today. You will learn to <strong>place a work in time</strong>, name the movement behind it, and explain <em>why</em> it looked the way it did, from Gutenberg's press to the sustainable, digital and Vietnamese design of the present.</p>
<h3>What "design" means here</h3>
<p>Following <strong>John Heskett</strong>, design is human intention giving form to the made world for a purpose. It is not decoration added at the end — it is the plan that decides how something communicates or works. <strong>Penny Sparke</strong> reminds us that design always sits inside <em>culture</em>: taste, class, industry and technology all press on it.</p>
<h3>How to read a movement</h3>
<ul>
<li><strong>Context</strong> — what technology, economy and politics made it possible <em>then</em>?</li>
<li><strong>Form</strong> — what does the work actually look like (type, colour, layout, material)?</li>
<li><strong>People &amp; ideas</strong> — who led it, and what did they believe design was for?</li>
</ul>
<h3>Roadmap</h3>
<p>Origins (writing, print, industry) → Arts &amp; Crafts and Art Nouveau → Modernism (Bauhaus, De Stijl, Constructivism) → the Swiss Style → post-war and postmodern → industrial &amp; product design → the digital age (graphics, web, UX) → contemporary, sustainable and Vietnamese design. Bilingual, with a timeline and a quiz each chapter.</p>`,
    `<span class="eyebrow">HOD102c · Bài 0.1 · Tổng quan</span>
<h2>Lịch sử Thiết kế</h2>
<p class="lead">Môn này kể câu chuyện <strong>thiết kế</strong> — việc tạo hình cho hình ảnh, chữ, đồ vật và giao diện để sử dụng — đã trở thành ngành nghề ta làm hôm nay thế nào. Bạn sẽ học cách <strong>đặt một tác phẩm vào dòng thời gian</strong>, gọi tên phong trào đứng sau nó, và giải thích <em>vì sao</em> nó có hình thức ấy, từ máy in Gutenberg tới thiết kế bền vững, số và Việt Nam ngày nay.</p>
<h3>"Thiết kế" ở đây nghĩa là gì</h3>
<p>Theo <strong>John Heskett</strong>, thiết kế là ý định của con người tạo hình cho thế giới nhân tạo nhằm một mục đích. Nó không phải phần trang trí thêm vào cuối — nó là bản kế hoạch quyết định một thứ truyền đạt hay vận hành ra sao. <strong>Penny Sparke</strong> nhắc rằng thiết kế luôn nằm trong <em>văn hoá</em>: thị hiếu, giai tầng, công nghiệp và công nghệ đều ép lên nó.</p>
<h3>Cách đọc một phong trào</h3>
<ul>
<li><strong>Bối cảnh</strong> — công nghệ, kinh tế, chính trị nào khiến nó khả dĩ <em>lúc đó</em>?</li>
<li><strong>Hình thức</strong> — tác phẩm thực sự trông ra sao (chữ, màu, bố cục, chất liệu)?</li>
<li><strong>Con người &amp; tư tưởng</strong> — ai dẫn dắt, và họ tin thiết kế để làm gì?</li>
</ul>
<h3>Lộ trình</h3>
<p>Nguồn gốc (chữ viết, in ấn, công nghiệp) → Arts &amp; Crafts và Art Nouveau → Chủ nghĩa hiện đại (Bauhaus, De Stijl, Constructivism) → Trường phái Thuỵ Sĩ → hậu chiến và hậu hiện đại → thiết kế công nghiệp &amp; sản phẩm → thời đại số (đồ hoạ, web, UX) → thiết kế đương đại, bền vững và Việt Nam. Song ngữ, mỗi chương có dòng thời gian và một quiz.</p>`,
  ]]);

const c1 = doc('hod102c-1-1-origins', '1.1 — Origins: writing, printing & the Industrial Revolution|||1.1 — Nguồn gốc: chữ viết, in ấn & cách mạng công nghiệp',
  'Chữ viết & bảng chữ cái, chữ khắc La Mã, thư tịch chép tay; Gutenberg & in typo (1450s); cách mạng công nghiệp sinh ra quảng cáo, áp phích và nghề thiết kế đồ hoạ.',
  [[
    `<span class="eyebrow">HOD102c · Chapter 1 · Lesson 1.1</span>
<h2>Origins: writing, printing &amp; the Industrial Revolution</h2>
<p>Graphic design begins with the wish to <strong>record and transmit</strong>. Meggs starts the story with the invention of <strong>writing</strong> — Sumerian cuneiform, Egyptian hieroglyphs — and the leap to the <strong>alphabet</strong>, a small set of signs for sounds that any language could reuse. Roman <strong>inscriptional capitals</strong> gave the West its enduring letterforms; medieval scribes turned manuscripts into painstaking works of art.</p>
<h3>Gutenberg and movable type</h3>
<p>Around <strong>1450</strong>, Johannes Gutenberg combined movable metal type, oil-based ink and the press into one system. Suddenly a page could be set once and printed many times. Knowledge became cheap to copy — the single most important event in the history of communication before the computer.</p>
<h3>Industry changes everything</h3>
<p>The <strong>Industrial Revolution</strong> (c. 1760–1840) brought mass production, cities and consumer goods that all needed to be <em>sold</em>. New printing technology (lithography, wood type, the steam press) fed a flood of posters, packaging and advertisements — and created the paid role of the commercial artist, the ancestor of today's graphic designer.</p>
<pre><code>Timeline — origins
  c. 3200 BCE  Cuneiform / early writing
  c. 1050 BCE  Phoenician alphabet
  c.   50 CE   Roman inscriptional capitals
  c. 1450      Gutenberg: movable-type printing
  c. 1796      Lithography invented (Senefelder)
  1760-1840    Industrial Revolution -> mass advertising
</code></pre>
<div class="callout"><span class="badge">Big idea</span> Two inventions set the stage: the <strong>alphabet</strong> made language reproducible in signs, and the <strong>press</strong> made those signs reproducible in quantity. Design becomes a profession only once industry needs to communicate at scale.</div>`,
    `<span class="eyebrow">HOD102c · Chương 1 · Bài 1.1</span>
<h2>Nguồn gốc: chữ viết, in ấn &amp; cách mạng công nghiệp</h2>
<p>Thiết kế đồ hoạ khởi đầu từ mong muốn <strong>ghi lại và truyền đi</strong>. Meggs mở câu chuyện bằng phát minh <strong>chữ viết</strong> — chữ hình nêm Sumer, chữ tượng hình Ai Cập — và bước nhảy tới <strong>bảng chữ cái</strong>, một bộ nhỏ ký hiệu cho âm thanh mà mọi ngôn ngữ dùng lại được. <strong>Chữ khắc hoa La Mã</strong> cho phương Tây kiểu chữ trường tồn; thầy chép thời trung cổ biến thư tịch thành tác phẩm nghệ thuật công phu.</p>
<h3>Gutenberg và con chữ rời</h3>
<p>Khoảng <strong>1450</strong>, Johannes Gutenberg kết hợp con chữ kim loại rời, mực gốc dầu và máy ép thành một hệ thống. Bỗng nhiên một trang có thể sắp một lần và in nhiều lần. Tri thức trở nên rẻ để sao chép — sự kiện quan trọng nhất trong lịch sử truyền thông trước khi có máy tính.</p>
<h3>Công nghiệp thay đổi tất cả</h3>
<p><strong>Cách mạng công nghiệp</strong> (khoảng 1760–1840) mang lại sản xuất hàng loạt, đô thị và hàng tiêu dùng — tất cả đều cần được <em>bán</em>. Công nghệ in mới (in đá lithography, chữ gỗ, máy ép hơi nước) tuôn ra hàng loạt áp phích, bao bì và quảng cáo — và tạo ra vai trò được trả công cho hoạ sĩ thương mại, tổ tiên của nhà thiết kế đồ hoạ hôm nay.</p>
<pre><code>Dòng thời gian — nguồn gốc
  ~3200 TCN   Chữ hình nêm / chữ viết sơ khai
  ~1050 TCN   Bảng chữ cái Phoenicia
  ~  50 CN    Chữ khắc hoa La Mã
  ~1450       Gutenberg: in con chữ rời
  ~1796       Phát minh in đá (Senefelder)
  1760-1840   Cách mạng công nghiệp -> quảng cáo hàng loạt
</code></pre>
<div class="callout"><span class="badge">Ý lớn</span> Hai phát minh dựng sân khấu: <strong>bảng chữ cái</strong> khiến ngôn ngữ tái tạo được bằng ký hiệu, và <strong>máy in</strong> khiến ký hiệu tái tạo được với số lượng. Thiết kế thành một nghề chỉ khi công nghiệp cần truyền thông ở quy mô lớn.</div>`,
  ]]);

const c1q = quiz('hod102c-quiz-1', 'Quiz 1 — Origins|||Quiz 1 — Nguồn gốc', [
  { id: 'q1', question: 'Phát minh nào của Gutenberg (khoảng 1450) đã cách mạng hoá truyền thông?', options: ['In đá lithography', 'In con chữ kim loại rời (máy in typo)', 'Máy photocopy', 'Chữ khắc hoa La Mã'], correctIndex: 1, explanation: 'Gutenberg kết hợp con chữ rời, mực gốc dầu và máy ép, cho phép in một trang nhiều lần.' },
  { id: 'q2', question: 'Bảng chữ cái quan trọng vì điều gì?', options: ['Chỉ dùng cho tiếng Latin', 'Một bộ nhỏ ký hiệu cho âm mà mọi ngôn ngữ dùng lại được', 'Là hình vẽ trang trí', 'Chỉ xuất hiện sau máy in'], correctIndex: 1, explanation: 'Bảng chữ cái quy âm thanh về một bộ ký hiệu nhỏ, tái sử dụng cho nhiều ngôn ngữ.' },
  { id: 'q3', question: 'Cách mạng công nghiệp tác động thế nào tới thiết kế đồ hoạ?', options: ['Xoá bỏ quảng cáo', 'Sinh ra sản xuất hàng loạt cần quảng cáo, áp phích và nghề hoạ sĩ thương mại', 'Khiến chữ viết biến mất', 'Chỉ ảnh hưởng tới hội hoạ'], correctIndex: 1, explanation: 'Hàng hoá sản xuất hàng loạt cần được bán, tạo ra áp phích, bao bì và vai trò hoạ sĩ thương mại.' },
]);

const c2 = doc('hod102c-2-1-arts-crafts-nouveau', '2.1 — Arts & Crafts and Art Nouveau|||2.1 — Arts & Crafts và Art Nouveau',
  'Phản ứng với công nghiệp: William Morris & phong trào Arts & Crafts (thủ công, chất lượng); Art Nouveau (đường cong hữu cơ, thiên nhiên) — Mucha, Guimard, Kelmscott Press.',
  [[
    `<span class="eyebrow">HOD102c · Chapter 2 · Lesson 2.1</span>
<h2>Arts &amp; Crafts and Art Nouveau</h2>
<h3>Arts &amp; Crafts — a revolt against the machine</h3>
<p>By the late 1800s, mass-produced goods were often ugly and shoddy. <strong>William Morris</strong> and the <strong>Arts &amp; Crafts</strong> movement answered with a return to <em>handcraft</em>: honest materials, skilled making, and unity of art and utility. Morris's <strong>Kelmscott Press</strong> printed richly designed books that treated the page as a total work of art. The idea that <strong>everyday objects deserve good design</strong> starts here.</p>
<h3>Art Nouveau — the whiplash line</h3>
<p><strong>Art Nouveau</strong> (c. 1890–1910) took beauty in a new direction: flowing, organic curves drawn from plants and the human figure — the famous <em>whiplash line</em>. It was an international style touching posters, architecture, glass and jewellery. Key figures include <strong>Alphonse Mucha</strong> (decorative poster women), <strong>Hector Guimard</strong> (the Paris Métro entrances) and Victor Horta in architecture.</p>
<pre><code>Two answers to industry
  Arts & Crafts  handcraft, honesty, medieval revival, the book
  Art Nouveau    organic curves, nature motifs, the poster
  shared enemy   cheap, ugly mass production
  shared legacy  design as a serious, unified art
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Both movements insisted that <strong>how ordinary things look and are made</strong> is a moral and artistic question — a conviction that the modernists would keep even as they threw out the ornament.</div>`,
    `<span class="eyebrow">HOD102c · Chương 2 · Bài 2.1</span>
<h2>Arts &amp; Crafts và Art Nouveau</h2>
<h3>Arts &amp; Crafts — cuộc nổi dậy chống máy móc</h3>
<p>Cuối thế kỷ 19, hàng sản xuất hàng loạt thường xấu và ẩu. <strong>William Morris</strong> và phong trào <strong>Arts &amp; Crafts</strong> đáp lại bằng cách trở về <em>thủ công</em>: chất liệu trung thực, tay nghề cao, và sự hợp nhất giữa nghệ thuật với công năng. <strong>Kelmscott Press</strong> của Morris in những cuốn sách được thiết kế cầu kỳ, coi trang giấy như một tác phẩm nghệ thuật trọn vẹn. Ý tưởng <strong>đồ vật hằng ngày xứng đáng được thiết kế tốt</strong> bắt đầu từ đây.</p>
<h3>Art Nouveau — đường cong roi quất</h3>
<p><strong>Art Nouveau</strong> (khoảng 1890–1910) đưa cái đẹp theo hướng mới: đường cong hữu cơ, uốn lượn lấy từ cây cỏ và dáng người — <em>đường roi quất</em> nổi tiếng. Đây là phong cách quốc tế chạm tới áp phích, kiến trúc, thuỷ tinh và trang sức. Nhân vật chính gồm <strong>Alphonse Mucha</strong> (áp phích thiếu nữ trang trí), <strong>Hector Guimard</strong> (cổng ga tàu điện ngầm Paris) và Victor Horta trong kiến trúc.</p>
<pre><code>Hai lời đáp cho công nghiệp
  Arts & Crafts  thủ công, trung thực, phục hưng trung cổ, cuốn sách
  Art Nouveau    đường cong hữu cơ, hoạ tiết thiên nhiên, áp phích
  kẻ thù chung   sản xuất hàng loạt rẻ, xấu
  di sản chung   thiết kế là nghệ thuật nghiêm túc, hợp nhất
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Cả hai phong trào khẳng định rằng <strong>đồ vật thường ngày trông ra sao và được làm thế nào</strong> là một câu hỏi đạo đức và nghệ thuật — niềm tin mà những nhà hiện đại giữ lại ngay cả khi họ vứt bỏ hoạ tiết trang trí.</div>`,
  ]]);

const c2q = quiz('hod102c-quiz-2', 'Quiz 2 — Arts & Crafts / Art Nouveau|||Quiz 2 — Arts & Crafts / Art Nouveau', [
  { id: 'q1', question: 'William Morris và phong trào Arts & Crafts chủ trương điều gì?', options: ['Đẩy mạnh sản xuất máy móc hàng loạt', 'Trở về thủ công, chất liệu trung thực, hợp nhất nghệ thuật với công năng', 'Bỏ hết hoạ tiết', 'Chỉ thiết kế công trình bê tông'], correctIndex: 1, explanation: 'Arts & Crafts phản ứng với hàng loạt xấu ẩu bằng cách đề cao thủ công và chất lượng.' },
  { id: 'q2', question: 'Đặc trưng hình thức nổi bật nhất của Art Nouveau là gì?', options: ['Lưới vuông góc lạnh lùng', 'Đường cong hữu cơ, uốn lượn lấy từ thiên nhiên (đường roi quất)', 'Chữ không chân đều tăm tắp', 'Màu đen trắng thuần khối'], correctIndex: 1, explanation: 'Art Nouveau đặc trưng bởi đường cong hữu cơ mô phỏng cây cỏ và dáng người.' },
  { id: 'q3', question: 'Ai gắn với các cổng ga tàu điện ngầm Paris theo phong cách Art Nouveau?', options: ['William Morris', 'Hector Guimard', 'Gutenberg', 'Le Corbusier'], correctIndex: 1, explanation: 'Hector Guimard thiết kế các lối vào Métro Paris — biểu tượng Art Nouveau.' },
]);

const c3 = doc('hod102c-3-1-modernism', '3.1 — Modernism: Bauhaus, De Stijl, Constructivism|||3.1 — Chủ nghĩa hiện đại: Bauhaus, De Stijl, Constructivism',
  'Đầu thế kỷ 20: bỏ trang trí, "hình thức theo công năng". Bauhaus (Đức, xưởng+trường), De Stijl (Hà Lan, đường thẳng & 3 màu cơ bản), Constructivism (Nga, thiết kế phục vụ xã hội).',
  [[
    `<span class="eyebrow">HOD102c · Chapter 3 · Lesson 3.1</span>
<h2>Modernism: Bauhaus, De Stijl, Constructivism</h2>
<p>After World War I, a generation decided that a new century needed a <strong>new visual language</strong> — rational, stripped of ornament, made for the machine age. Their shared slogan was <strong>"form follows function"</strong>: an object's look should come from what it does, not from decoration.</p>
<h3>Three engines of modernism</h3>
<ul>
<li><strong>Bauhaus</strong> (Germany, 1919–1933) — a school founded by Walter Gropius that fused art, craft and industry. It taught geometry, sans-serif type and the honest use of materials, and shaped design education worldwide.</li>
<li><strong>De Stijl</strong> (Netherlands, from 1917) — Mondrian and van Doesburg reduced art to horizontals, verticals and the three primary colours plus black, white and grey. Pure abstraction as a universal harmony.</li>
<li><strong>Constructivism</strong> (Russia, from c. 1919) — Rodchenko, El Lissitzky and others put design to work for the new society: bold diagonals, photomontage, and typography as visual propaganda.</li>
</ul>
<pre><code>Modernist principles
  form follows function     purpose shapes appearance
  less is more              remove ornament
  the grid                  order through geometry
  sans-serif type           neutral, "machine-age" letters
  design for the many       affordable, reproducible
</code></pre>
<div class="callout"><span class="badge">The turning point</span> Modernism is the hinge of the whole course: it replaced <strong>decoration</strong> with <strong>system</strong>. Almost everything after it either extends this logic (the Swiss Style) or rebels against it (postmodernism).</div>`,
    `<span class="eyebrow">HOD102c · Chương 3 · Bài 3.1</span>
<h2>Chủ nghĩa hiện đại: Bauhaus, De Stijl, Constructivism</h2>
<p>Sau Thế chiến thứ nhất, một thế hệ quyết rằng thế kỷ mới cần một <strong>ngôn ngữ thị giác mới</strong> — duy lý, gột bỏ trang trí, làm cho thời đại máy móc. Khẩu hiệu chung của họ là <strong>"hình thức theo công năng"</strong>: dáng vẻ một đồ vật phải đến từ việc nó làm gì, không phải từ trang trí.</p>
<h3>Ba động cơ của chủ nghĩa hiện đại</h3>
<ul>
<li><strong>Bauhaus</strong> (Đức, 1919–1933) — trường do Walter Gropius lập, hợp nhất nghệ thuật, thủ công và công nghiệp. Nó dạy hình học, chữ không chân và cách dùng chất liệu trung thực, định hình giáo dục thiết kế toàn cầu.</li>
<li><strong>De Stijl</strong> (Hà Lan, từ 1917) — Mondrian và van Doesburg rút nghệ thuật về đường ngang, đường dọc và ba màu cơ bản cùng đen, trắng, xám. Trừu tượng thuần khiết như một hoà điệu phổ quát.</li>
<li><strong>Constructivism</strong> (Nga, từ khoảng 1919) — Rodchenko, El Lissitzky và những người khác đặt thiết kế phục vụ xã hội mới: đường chéo mạnh, ghép ảnh (photomontage), và chữ như tuyên truyền thị giác.</li>
</ul>
<pre><code>Nguyên tắc hiện đại
  hình thức theo công năng   mục đích quyết dáng vẻ
  ít mà nhiều                bỏ trang trí
  lưới (grid)                trật tự nhờ hình học
  chữ không chân            con chữ trung tính, "thời máy móc"
  thiết kế cho số đông       giá phải chăng, tái tạo được
</code></pre>
<div class="callout"><span class="badge">Bước ngoặt</span> Chủ nghĩa hiện đại là bản lề của cả môn học: nó thay <strong>trang trí</strong> bằng <strong>hệ thống</strong>. Hầu như mọi thứ sau nó hoặc kéo dài lôgic này (Trường phái Thuỵ Sĩ) hoặc nổi loạn chống lại (hậu hiện đại).</div>`,
  ]]);

const c3q = quiz('hod102c-quiz-3', 'Quiz 3 — Modernism|||Quiz 3 — Chủ nghĩa hiện đại', [
  { id: 'q1', question: 'Khẩu hiệu tiêu biểu của chủ nghĩa hiện đại là gì?', options: ['"Càng nhiều trang trí càng tốt"', '"Hình thức theo công năng"', '"Trở về trung cổ"', '"Đường cong là trên hết"'], correctIndex: 1, explanation: 'Chủ nghĩa hiện đại chủ trương dáng vẻ đến từ công năng, gột bỏ trang trí.' },
  { id: 'q2', question: 'Bauhaus (Đức, 1919–1933) là gì?', options: ['Một hãng in báo', 'Một trường hợp nhất nghệ thuật, thủ công và công nghiệp, định hình giáo dục thiết kế', 'Một bảo tàng cổ vật', 'Một phong cách áp phích Art Nouveau'], correctIndex: 1, explanation: 'Bauhaus do Gropius lập, dạy hình học, chữ không chân và dùng chất liệu trung thực.' },
  { id: 'q3', question: 'De Stijl (Hà Lan) rút nghệ thuật về những yếu tố nào?', options: ['Đường cong hữu cơ và pastel', 'Đường ngang/dọc và ba màu cơ bản cùng đen, trắng, xám', 'Ghép ảnh và đường chéo', 'Chữ khắc hoa La Mã'], correctIndex: 1, explanation: 'De Stijl (Mondrian, van Doesburg) dùng đường thẳng vuông góc và ba màu cơ bản.' },
]);

const c4 = doc('hod102c-4-1-swiss-style', '4.1 — The Swiss Style (International Typographic Style)|||4.1 — Trường phái Thuỵ Sĩ (International Typographic Style)',
  'Thuỵ Sĩ, 1950s: lưới toán học, chữ không chân (Helvetica/Univers), bố cục bất đối xứng, ảnh chụp thay minh hoạ, thông tin rõ ràng khách quan — Müller-Brockmann, Hofmann.',
  [[
    `<span class="eyebrow">HOD102c · Chapter 4 · Lesson 4.1</span>
<h2>The Swiss Style (International Typographic Style)</h2>
<p>In 1950s Switzerland, modernist principles hardened into a precise, teachable method — the <strong>International Typographic Style</strong>, better known as the <strong>Swiss Style</strong>. Its goal was <em>clarity and objectivity</em>: design that presents information cleanly, with the designer's personality kept out of the way.</p>
<h3>The toolkit</h3>
<ul>
<li><strong>The mathematical grid</strong> — a modular structure that organises type and image into calm, logical order.</li>
<li><strong>Sans-serif type</strong> — neutral faces such as <strong>Helvetica</strong> (1957) and <strong>Univers</strong>, set flush-left, ragged-right.</li>
<li><strong>Asymmetric layout</strong> — dynamic balance instead of centred symmetry.</li>
<li><strong>Objective photography</strong> — real photos rather than decorative illustration.</li>
</ul>
<p>Key figures include <strong>Josef Müller-Brockmann</strong> (whose book <em>Grid Systems</em> became a bible), Armin Hofmann and Emil Ruder. The style spread worldwide and still defines the look of corporate identity, signage and much of the web.</p>
<pre><code>Swiss Style checklist
  grid          modular, mathematical
  type          sans-serif, flush-left
  hierarchy     size & weight, not decoration
  image         objective photography
  goal          clarity, neutrality, universality
</code></pre>
<div class="callout"><span class="badge">Living legacy</span> When an airport sign, a train schedule or a clean app screen feels effortlessly readable, you are usually looking at the Swiss Style's grandchildren.</div>`,
    `<span class="eyebrow">HOD102c · Chương 4 · Bài 4.1</span>
<h2>Trường phái Thuỵ Sĩ (International Typographic Style)</h2>
<p>Ở Thuỵ Sĩ thập ni 1950, các nguyên tắc hiện đại kết tinh thành một phương pháp chính xác, dạy được — <strong>International Typographic Style</strong>, thường gọi là <strong>Trường phái Thuỵ Sĩ</strong>. Mục tiêu của nó là <em>sự rõ ràng và khách quan</em>: thiết kế trình bày thông tin gọn gàng, giữ cá tính người thiết kế ra ngoài.</p>
<h3>Bộ công cụ</h3>
<ul>
<li><strong>Lưới toán học</strong> — cấu trúc mô-đun sắp xếp chữ và ảnh vào trật tự bình tĩnh, hợp lý.</li>
<li><strong>Chữ không chân</strong> — kiểu chữ trung tính như <strong>Helvetica</strong> (1957) và <strong>Univers</strong>, canh trái, lề phải để so le.</li>
<li><strong>Bố cục bất đối xứng</strong> — cân bằng động thay cho đối xứng canh giữa.</li>
<li><strong>Ảnh chụp khách quan</strong> — ảnh thật thay cho minh hoạ trang trí.</li>
</ul>
<p>Nhân vật chính gồm <strong>Josef Müller-Brockmann</strong> (cuốn <em>Grid Systems</em> của ông thành kinh điển), Armin Hofmann và Emil Ruder. Phong cách lan ra toàn cầu và tới nay vẫn định hình bộ nhận diện doanh nghiệp, biển chỉ dẫn và phần lớn web.</p>
<pre><code>Bảng kiểm Trường phái Thuỵ Sĩ
  lưới          mô-đun, toán học
  chữ           không chân, canh trái
  phân cấp      bằng cỡ & độ đậm, không trang trí
  hình ảnh      ảnh chụp khách quan
  mục tiêu      rõ ràng, trung tính, phổ quát
</code></pre>
<div class="callout"><span class="badge">Di sản còn sống</span> Khi một biển chỉ dẫn sân bay, một bảng giờ tàu hay một màn hình ứng dụng gọn gàng dễ đọc như không, thường bạn đang nhìn con cháu của Trường phái Thuỵ Sĩ.</div>`,
  ]]);

const c4q = quiz('hod102c-quiz-4', 'Quiz 4 — Swiss Style|||Quiz 4 — Trường phái Thuỵ Sĩ', [
  { id: 'q1', question: 'Trường phái Thuỵ Sĩ (International Typographic Style) hướng tới điều gì?', options: ['Trang trí cầu kỳ', 'Sự rõ ràng và khách quan, giữ cá tính người thiết kế ra ngoài', 'Đường cong Art Nouveau', 'Chữ có chân cổ điển'], correctIndex: 1, explanation: 'Trường phái Thuỵ Sĩ đề cao clarity và tính khách quan trong trình bày thông tin.' },
  { id: 'q2', question: 'Công cụ cốt lõi của Trường phái Thuỵ Sĩ là gì?', options: ['Lưới toán học và chữ không chân (Helvetica/Univers)', 'Photomontage tuyên truyền', 'Minh hoạ vẽ tay màu nước', 'Chữ gothic trung cổ'], correctIndex: 0, explanation: 'Lưới mô-đun cùng chữ không chân canh trái là đặc trưng của phong cách này.' },
  { id: 'q3', question: 'Josef Müller-Brockmann nổi tiếng với đóng góp nào?', options: ['Phát minh in đá', 'Cuốn "Grid Systems" hệ thống hoá tư duy lưới', 'Cổng ga Métro Paris', 'Trường Bauhaus'], correctIndex: 1, explanation: 'Müller-Brockmann viết "Grid Systems", tài liệu kinh điển về thiết kế theo lưới.' },
]);

const c5 = doc('hod102c-5-1-postwar-postmodern', '5.1 — Post-war design & postmodernism|||5.1 — Thiết kế hậu chiến & chủ nghĩa hậu hiện đại',
  'Hậu chiến: bùng nổ tiêu dùng Mỹ, quảng cáo & nhận diện thương hiệu (Paul Rand), phong cách quốc tế lan rộng; rồi hậu hiện đại (1970s–80s) nổi loạn: trang trí trở lại, chiết trung, chơi đùa — Memphis, April Greiman.',
  [[
    `<span class="eyebrow">HOD102c · Chapter 5 · Lesson 5.1</span>
<h2>Post-war design &amp; postmodernism</h2>
<h3>After 1945 — the corporate era</h3>
<p>Post-war prosperity, especially in the United States, made design a business tool. Companies wanted consistent <strong>brand identity</strong>, and designers such as <strong>Paul Rand</strong> (logos for IBM, ABC, UPS) proved that a simple, memorable mark could carry a whole corporation. The rational Swiss grid became the global language of annual reports, airlines and packaging.</p>
<h3>The postmodern revolt</h3>
<p>By the 1970s–80s, many designers found modernism cold and dogmatic. <strong>Postmodernism</strong> pushed back: it welcomed <em>ornament, colour, historical quotation, irony and complexity</em>. "Less is a bore" answered "less is more." Landmarks include the Italian <strong>Memphis Group</strong> (playful, clashing furniture), <strong>April Greiman</strong>'s early digital "New Wave" layouts, and Wolfgang Weingart's deconstructed typography.</p>
<pre><code>Modern vs postmodern
  modern        order, grid, neutrality, "less is more"
  postmodern    play, layers, history, irony, "less is a bore"
  driver        reaction against modernist dogma
  tools later   the personal computer amplifies both
</code></pre>
<div class="callout"><span class="badge">Two moods, still with us</span> Today's design constantly swings between these poles — clean minimal systems on one side, expressive maximalism on the other. Knowing both lets you choose on purpose.</div>`,
    `<span class="eyebrow">HOD102c · Chương 5 · Bài 5.1</span>
<h2>Thiết kế hậu chiến &amp; chủ nghĩa hậu hiện đại</h2>
<h3>Sau 1945 — thời đại doanh nghiệp</h3>
<p>Thịnh vượng hậu chiến, nhất là ở Mỹ, biến thiết kế thành công cụ kinh doanh. Các công ty muốn <strong>nhận diện thương hiệu</strong> nhất quán, và những nhà thiết kế như <strong>Paul Rand</strong> (logo IBM, ABC, UPS) chứng minh một dấu hiệu đơn giản, dễ nhớ có thể gánh cả một tập đoàn. Lưới Thuỵ Sĩ duy lý trở thành ngôn ngữ toàn cầu của báo cáo thường niên, hãng hàng không và bao bì.</p>
<h3>Cuộc nổi loạn hậu hiện đại</h3>
<p>Đến thập niên 1970–80, nhiều nhà thiết kế thấy chủ nghĩa hiện đại lạnh lùng và giáo điều. <strong>Chủ nghĩa hậu hiện đại</strong> phản pháo: nó đón nhận <em>trang trí, màu sắc, trích dẫn lịch sử, châm biếm và sự phức tạp</em>. "Ít là chán" đáp lại "ít là nhiều". Cột mốc gồm <strong>nhóm Memphis</strong> của Ý (nội thất chơi đùa, chỏi màu), bố cục "New Wave" số hoá sớm của <strong>April Greiman</strong>, và chữ giải cấu trúc của Wolfgang Weingart.</p>
<pre><code>Hiện đại vs hậu hiện đại
  hiện đại      trật tự, lưới, trung tính, "ít là nhiều"
  hậu hiện đại  chơi đùa, lớp lang, lịch sử, châm biếm, "ít là chán"
  động lực      phản ứng với giáo điều hiện đại
  công cụ sau   máy tính cá nhân khuếch đại cả hai
</code></pre>
<div class="callout"><span class="badge">Hai tâm thế còn nguyên</span> Thiết kế hôm nay liên tục dao động giữa hai cực này — hệ thống tối giản gọn gàng một bên, tối đa biểu cảm bên kia. Hiểu cả hai để bạn chọn có chủ đích.</div>`,
  ]]);

const c5q = quiz('hod102c-quiz-5', 'Quiz 5 — Hậu chiến & hậu hiện đại|||Quiz 5 — Hậu chiến & hậu hiện đại', [
  { id: 'q1', question: 'Paul Rand nổi tiếng với đóng góp nào cho thiết kế hậu chiến?', options: ['Phát minh máy in', 'Các logo/nhận diện thương hiệu đơn giản, dễ nhớ (IBM, ABC, UPS)', 'Phong cách Art Nouveau', 'Trường Bauhaus'], correctIndex: 1, explanation: 'Paul Rand chứng minh một dấu hiệu tối giản có thể đại diện cả một tập đoàn.' },
  { id: 'q2', question: 'Câu khẩu hiệu nào thể hiện tinh thần hậu hiện đại phản lại hiện đại?', options: ['"Hình thức theo công năng"', '"Ít là chán" (đáp lại "ít là nhiều")', '"Trở về thủ công"', '"Lưới là trên hết"'], correctIndex: 1, explanation: 'Hậu hiện đại đón nhận trang trí và phức tạp; "less is a bore" chống lại "less is more".' },
  { id: 'q3', question: 'Nhóm Memphis của Ý gắn với đặc điểm nào?', options: ['Nội thất chơi đùa, màu sắc chỏi nhau, chiết trung', 'Lưới Thuỵ Sĩ nghiêm ngặt', 'Ảnh chụp khách quan đen trắng', 'Chữ khắc La Mã'], correctIndex: 0, explanation: 'Memphis tiêu biểu cho tinh thần hậu hiện đại: vui tươi, trang trí, phá vỡ khuôn mẫu.' },
]);

const c6 = doc('hod102c-6-1-industrial-product', '6.1 — Industrial & product design|||6.1 — Lịch sử thiết kế công nghiệp & sản phẩm',
  'Từ Deutscher Werkbund tới streamlining Mỹ; "hình thức theo công năng"; Dieter Rams & Braun (10 nguyên tắc "less but better"); thiết kế lấy con người làm trung tâm và di sản tới sản phẩm số.',
  [[
    `<span class="eyebrow">HOD102c · Chapter 6 · Lesson 6.1</span>
<h2>Industrial &amp; product design</h2>
<p>Graphic design shapes messages; <strong>industrial design</strong> shapes the objects themselves — chairs, radios, cars, phones. John Heskett stresses that design here is where <em>art, technology and everyday life meet</em>.</p>
<h3>From Werkbund to streamlining</h3>
<p>The German <strong>Deutscher Werkbund</strong> (1907) linked artists with industry to raise the quality of manufactured goods — a direct ancestor of the Bauhaus. In 1930s America, <strong>streamlining</strong> wrapped trains, toasters and cars in aerodynamic curves that signalled speed and modernity, and designers like Raymond Loewy made "the designer" a public figure.</p>
<h3>Good design: Dieter Rams</h3>
<p>At Braun, <strong>Dieter Rams</strong> distilled modernist product thinking into <strong>ten principles of good design</strong> — innovative, useful, aesthetic, understandable, unobtrusive, honest, long-lasting, thorough, environmentally friendly, and <em>as little design as possible</em> ("less but better"). His calm, functional products later inspired much of today's consumer electronics.</p>
<pre><code>Threads of product design
  Werkbund 1907     art + industry, quality
  Streamlining 30s  aerodynamic style, speed
  Braun / Rams      "less but better", 10 principles
  human-centred     ergonomics, usability
  today             the same ideas guide devices & apps
</code></pre>
<div class="callout"><span class="badge">Bridge to the digital</span> Rams's principles — honest, useful, unobtrusive — map almost directly onto good UX. Product design is the missing link between the poster and the app.</div>`,
    `<span class="eyebrow">HOD102c · Chương 6 · Bài 6.1</span>
<h2>Lịch sử thiết kế công nghiệp &amp; sản phẩm</h2>
<p>Thiết kế đồ hoạ tạo hình cho thông điệp; <strong>thiết kế công nghiệp</strong> tạo hình cho chính đồ vật — ghế, radio, xe hơi, điện thoại. John Heskett nhấn mạnh đây là nơi <em>nghệ thuật, công nghệ và đời sống thường ngày gặp nhau</em>.</p>
<h3>Từ Werkbund tới streamlining</h3>
<p><strong>Deutscher Werkbund</strong> của Đức (1907) nối hoạ sĩ với công nghiệp để nâng chất lượng hàng chế tạo — tổ tiên trực tiếp của Bauhaus. Ở Mỹ thập niên 1930, <strong>streamlining</strong> khoác cho tàu, lò nướng và xe hơi những đường cong khí động học báo hiệu tốc độ và sự hiện đại, và những nhà thiết kế như Raymond Loewy biến "nhà thiết kế" thành nhân vật của công chúng.</p>
<h3>Thiết kế tốt: Dieter Rams</h3>
<p>Tại Braun, <strong>Dieter Rams</strong> chưng cất tư duy sản phẩm hiện đại thành <strong>mười nguyên tắc thiết kế tốt</strong> — đổi mới, hữu ích, thẩm mỹ, dễ hiểu, kín đáo, trung thực, bền lâu, kỹ đến từng chi tiết, thân thiện môi trường, và <em>càng ít thiết kế càng tốt</em> ("ít nhưng tốt hơn"). Những sản phẩm điềm tĩnh, đầy công năng của ông sau này truyền cảm hứng cho phần lớn đồ điện tử tiêu dùng ngày nay.</p>
<pre><code>Các mạch của thiết kế sản phẩm
  Werkbund 1907     nghệ thuật + công nghiệp, chất lượng
  Streamlining 30s  phong cách khí động, tốc độ
  Braun / Rams      "ít nhưng tốt hơn", 10 nguyên tắc
  lấy người làm gốc ecgônômi, khả dụng
  hôm nay           cùng ý tưởng dẫn dắt thiết bị & ứng dụng
</code></pre>
<div class="callout"><span class="badge">Cầu nối sang thời số</span> Các nguyên tắc của Rams — trung thực, hữu ích, kín đáo — ánh xạ gần như trực tiếp sang UX tốt. Thiết kế sản phẩm là mắt xích còn thiếu giữa tấm áp phích và ứng dụng.</div>`,
  ]]);

const c6q = quiz('hod102c-quiz-6', 'Quiz 6 — Thiết kế công nghiệp|||Quiz 6 — Thiết kế công nghiệp', [
  { id: 'q1', question: 'Deutscher Werkbund (1907) làm gì?', options: ['Nối hoạ sĩ với công nghiệp để nâng chất lượng hàng chế tạo', 'In sách trung cổ', 'Phát minh máy tính', 'Vẽ áp phích Art Nouveau'], correctIndex: 0, explanation: 'Werkbund gắn nghệ thuật với công nghiệp, là tiền thân trực tiếp của Bauhaus.' },
  { id: 'q2', question: 'Dieter Rams (Braun) gắn với triết lý nào?', options: ['"Càng nhiều trang trí càng tốt"', '"Ít nhưng tốt hơn" và mười nguyên tắc thiết kế tốt', '"Hình thức là ngẫu nhiên"', 'Phục hưng thủ công trung cổ'], correctIndex: 1, explanation: 'Rams đúc kết "less but better" cùng 10 nguyên tắc thiết kế tốt, ảnh hưởng lớn tới UX.' },
  { id: 'q3', question: 'Streamlining ở Mỹ thập niên 1930 đặc trưng bởi điều gì?', options: ['Đường cong khí động học báo hiệu tốc độ và hiện đại', 'Lưới toán học nghiêm ngặt', 'Chữ giải cấu trúc', 'Photomontage tuyên truyền'], correctIndex: 0, explanation: 'Streamlining khoác đường cong khí động cho tàu, xe, đồ gia dụng để gợi tốc độ.' },
]);

const c7 = doc('hod102c-7-1-digital-age', '7.1 — The digital age: computer graphics, web & UX|||7.1 — Thời đại số: đồ hoạ máy tính, web & UX',
  'Máy tính cá nhân & DTP (Macintosh 1984, PostScript) dân chủ hoá thiết kế; đồ hoạ số & desktop publishing; web ra đời (HTML/CSS); nổi lên UX/UI, khả dụng, responsive và hệ thống thiết kế.',
  [[
    `<span class="eyebrow">HOD102c · Chapter 7 · Lesson 7.1</span>
<h2>The digital age: computer graphics, web &amp; UX</h2>
<h3>The desktop-publishing revolution</h3>
<p>The <strong>Apple Macintosh</strong> (1984), <strong>PostScript</strong> and page-layout software put the tools of typesetting on one desk. Design was <em>democratised</em>: anyone could set type and lay out a page, for better (access) and worse (a flood of amateur work). Designers like April Greiman embraced the pixel as a legitimate material.</p>
<h3>The web arrives</h3>
<p>From the early 1990s the <strong>World Wide Web</strong> turned design into something interactive and networked. <strong>HTML</strong> structured content and <strong>CSS</strong> styled it; screens replaced paper as the main surface. Design now had to handle <em>links, motion and unknown screen sizes</em>.</p>
<h3>From decoration to experience: UX/UI</h3>
<p>As software grew central to daily life, <strong>User Experience (UX)</strong> and <strong>User Interface (UI)</strong> design emerged — concerned less with how a screen looks and more with how it <em>works</em> for a person: usability, information architecture, accessibility. <strong>Responsive design</strong> and reusable <strong>design systems</strong> tamed the explosion of devices.</p>
<pre><code>Timeline — the digital age
  1984   Apple Macintosh + PostScript -> desktop publishing
  1991   World Wide Web made public
  1990s  HTML / CSS, screen becomes the canvas
  2007   smartphone -> mobile-first thinking
  2010s  UX/UI, responsive design, design systems
</code></pre>
<div class="callout"><span class="badge">Key shift</span> Design stops being only about <strong>images that are looked at</strong> and becomes about <strong>systems that are used</strong> — the direct root of the digital design you study today.</div>`,
    `<span class="eyebrow">HOD102c · Chương 7 · Bài 7.1</span>
<h2>Thời đại số: đồ hoạ máy tính, web &amp; UX</h2>
<h3>Cuộc cách mạng desktop publishing</h3>
<p><strong>Apple Macintosh</strong> (1984), <strong>PostScript</strong> và phần mềm dàn trang đặt công cụ sắp chữ lên một chiếc bàn. Thiết kế được <em>dân chủ hoá</em>: ai cũng có thể sắp chữ và dàn trang, vừa tốt (dễ tiếp cận) vừa dở (tràn ngập tác phẩm nghiệp dư). Những nhà thiết kế như April Greiman đón nhận điểm ảnh (pixel) như một chất liệu chính danh.</p>
<h3>Web xuất hiện</h3>
<p>Từ đầu thập niên 1990, <strong>World Wide Web</strong> biến thiết kế thành thứ tương tác và nối mạng. <strong>HTML</strong> cấu trúc nội dung và <strong>CSS</strong> tạo kiểu; màn hình thay giấy làm bề mặt chính. Thiết kế nay phải xử lý <em>liên kết, chuyển động và kích thước màn hình không biết trước</em>.</p>
<h3>Từ trang trí tới trải nghiệm: UX/UI</h3>
<p>Khi phần mềm thành trung tâm đời sống, thiết kế <strong>Trải nghiệm người dùng (UX)</strong> và <strong>Giao diện người dùng (UI)</strong> nổi lên — quan tâm ít hơn tới màn hình trông ra sao và nhiều hơn tới nó <em>hoạt động</em> cho con người thế nào: khả dụng, kiến trúc thông tin, khả năng tiếp cận. <strong>Thiết kế responsive</strong> và <strong>hệ thống thiết kế</strong> tái sử dụng thuần hoá sự bùng nổ thiết bị.</p>
<pre><code>Dòng thời gian — thời đại số
  1984   Apple Macintosh + PostScript -> desktop publishing
  1991   World Wide Web công khai
  1990s  HTML / CSS, màn hình thành khung vẽ
  2007   điện thoại thông minh -> tư duy mobile-first
  2010s  UX/UI, thiết kế responsive, hệ thống thiết kế
</code></pre>
<div class="callout"><span class="badge">Chuyển dịch cốt lõi</span> Thiết kế thôi chỉ là <strong>hình ảnh để ngắm</strong> và trở thành <strong>hệ thống để dùng</strong> — gốc rễ trực tiếp của thiết kế số bạn học hôm nay.</div>`,
  ]]);

const c7q = quiz('hod102c-quiz-7', 'Quiz 7 — Thời đại số|||Quiz 7 — Thời đại số', [
  { id: 'q1', question: 'Sự kiện nào "dân chủ hoá" thiết kế qua desktop publishing?', options: ['Máy in Gutenberg', 'Apple Macintosh (1984) + PostScript + phần mềm dàn trang', 'Cách mạng công nghiệp', 'Nhóm Memphis'], correctIndex: 1, explanation: 'Macintosh cùng PostScript đưa công cụ sắp chữ và dàn trang tới mọi người.' },
  { id: 'q2', question: 'Hai công nghệ nền tảng tạo và định kiểu trang web là gì?', options: ['PostScript và litho', 'HTML (cấu trúc) và CSS (kiểu dáng)', 'Helvetica và Univers', 'Photoshop và Illustrator'], correctIndex: 1, explanation: 'HTML cấu trúc nội dung, CSS tạo kiểu — nền của thiết kế web.' },
  { id: 'q3', question: 'Thiết kế UX quan tâm chủ yếu tới điều gì?', options: ['Chỉ màu sắc bắt mắt', 'Cách sản phẩm hoạt động cho người dùng: khả dụng, kiến trúc thông tin, khả năng tiếp cận', 'Vẽ minh hoạ tay', 'Đúc chữ kim loại'], correctIndex: 1, explanation: 'UX tập trung vào trải nghiệm sử dụng, không chỉ vẻ ngoài của giao diện.' },
]);

const c8 = doc('hod102c-8-1-contemporary-sustainable-vietnam', '8.1 — Contemporary, sustainable design & the Vietnamese context|||8.1 — Thiết kế đương đại, bền vững & bối cảnh Việt Nam',
  'Đương đại: thiết kế toàn cầu hoá, hệ thống thiết kế, motion & thương hiệu số; thiết kế bền vững & có trách nhiệm (vòng đời, đạo đức); và lịch sử thiết kế đồ hoạ Việt Nam — tranh cổ động, chữ Việt, bản sắc.',
  [[
    `<span class="eyebrow">HOD102c · Chapter 8 · Lesson 8.1</span>
<h2>Contemporary, sustainable design &amp; the Vietnamese context</h2>
<h3>Design now</h3>
<p>Contemporary design is <strong>global, fast and systematised</strong>. Brands live across screens, motion and social platforms, held together by <strong>design systems</strong> that keep a product consistent at scale. Tools change quickly — including AI-assisted design — but the historical questions (clarity vs expression, system vs personality) stay the same.</p>
<h3>Sustainable &amp; responsible design</h3>
<p>Penny Sparke's insistence that design sits inside culture now extends to the planet. <strong>Sustainable design</strong> asks about a product's whole <em>life cycle</em> — materials, energy, waste — and about <strong>ethics</strong>: accessibility, honesty, and the social effect of what we make. Rams's "environmentally friendly" principle has become a central demand, not a footnote.</p>
<h3>A Vietnamese thread</h3>
<p>Vietnam has its own rich design history: <strong>political propaganda posters (tranh cổ động)</strong> with bold flat colour and strong slogans; the visual heritage of folk prints such as <em>tranh Đông Hồ</em>; and the modern challenge of designing well for the <strong>Vietnamese alphabet</strong>, whose stacked diacritics demand careful typography. A young generation now blends global methods with local identity.</p>
<pre><code>Where the story arrives
  contemporary   global brands, design systems, motion, AI tools
  sustainable    life cycle, ethics, accessibility
  Vietnam        cổ động posters, Đông Hồ heritage, Vietnamese type
  constant       every style still answers "form vs function"
</code></pre>
<div class="callout"><span class="badge">Closing idea</span> History is not a museum — it is a toolbox. Knowing where a style came from lets you choose it, adapt it, or break it <em>on purpose</em>, whether you are designing for the world or for Vietnam.</div>`,
    `<span class="eyebrow">HOD102c · Chương 8 · Bài 8.1</span>
<h2>Thiết kế đương đại, bền vững &amp; bối cảnh Việt Nam</h2>
<h3>Thiết kế bây giờ</h3>
<p>Thiết kế đương đại <strong>toàn cầu, nhanh và hệ thống hoá</strong>. Thương hiệu sống trên nhiều màn hình, chuyển động và nền tảng mạng xã hội, được giữ nhất quán bởi <strong>hệ thống thiết kế (design system)</strong> ở quy mô lớn. Công cụ thay đổi chóng mặt — kể cả thiết kế có AI hỗ trợ — nhưng các câu hỏi lịch sử (rõ ràng vs biểu cảm, hệ thống vs cá tính) vẫn nguyên.</p>
<h3>Thiết kế bền vững &amp; có trách nhiệm</h3>
<p>Lời khẳng định của Penny Sparke rằng thiết kế nằm trong văn hoá nay mở rộng tới cả hành tinh. <strong>Thiết kế bền vững</strong> hỏi về toàn bộ <em>vòng đời</em> sản phẩm — chất liệu, năng lượng, rác thải — và về <strong>đạo đức</strong>: khả năng tiếp cận, sự trung thực, và tác động xã hội của thứ ta tạo ra. Nguyên tắc "thân thiện môi trường" của Rams đã thành đòi hỏi trung tâm, không còn là chú thích.</p>
<h3>Một mạch Việt Nam</h3>
<p>Việt Nam có lịch sử thiết kế phong phú của riêng mình: <strong>tranh cổ động chính trị</strong> với màu phẳng mạnh và khẩu hiệu dứt khoát; di sản thị giác của tranh dân gian như <em>tranh Đông Hồ</em>; và thách thức hiện đại là thiết kế tốt cho <strong>chữ Việt</strong>, với các dấu chồng đòi hỏi typography cẩn thận. Một thế hệ trẻ nay pha trộn phương pháp toàn cầu với bản sắc bản địa.</p>
<pre><code>Câu chuyện đi tới đâu
  đương đại   thương hiệu toàn cầu, design system, motion, công cụ AI
  bền vững    vòng đời, đạo đức, khả năng tiếp cận
  Việt Nam    tranh cổ động, di sản Đông Hồ, chữ Việt
  bất biến    mọi phong cách vẫn đáp "hình thức vs công năng"
</code></pre>
<div class="callout"><span class="badge">Ý khép lại</span> Lịch sử không phải bảo tàng — nó là hộp công cụ. Biết một phong cách đến từ đâu cho phép bạn chọn nó, chuyển hoá nó, hay phá nó <em>có chủ đích</em>, dù bạn thiết kế cho thế giới hay cho Việt Nam.</div>`,
  ]]);

const c8q = quiz('hod102c-quiz-8', 'Quiz 8 — Đương đại, bền vững & Việt Nam|||Quiz 8 — Đương đại, bền vững & Việt Nam', [
  { id: 'q1', question: 'Điều gì giữ một thương hiệu nhất quán trên nhiều màn hình ở quy mô lớn hôm nay?', options: ['In đá lithography', 'Hệ thống thiết kế (design system)', 'Tranh Đông Hồ', 'Chữ khắc La Mã'], correctIndex: 1, explanation: 'Design system chuẩn hoá thành phần để sản phẩm nhất quán trên nhiều nền tảng.' },
  { id: 'q2', question: 'Thiết kế bền vững quan tâm chủ yếu tới điều gì?', options: ['Chỉ làm sản phẩm đẹp hơn', 'Vòng đời sản phẩm (chất liệu, năng lượng, rác) và đạo đức, khả năng tiếp cận', 'Thêm nhiều trang trí', 'Chỉ dùng chữ không chân'], correctIndex: 1, explanation: 'Thiết kế bền vững xét toàn bộ vòng đời và tác động xã hội, môi trường của sản phẩm.' },
  { id: 'q3', question: 'Đâu là nét đặc trưng của lịch sử thiết kế đồ hoạ Việt Nam nêu trong bài?', options: ['Tranh cổ động màu phẳng mạnh và thách thức typography cho chữ Việt có dấu', 'Trường phái Thuỵ Sĩ thuần tuý', 'Streamlining khí động học', 'Nhóm Memphis của Ý'], correctIndex: 0, explanation: 'Bài nêu tranh cổ động, di sản Đông Hồ và bài toán thiết kế cho chữ Việt nhiều dấu.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'HOD102c',
    slug: 'hod102c-design-history',
    title: 'Design History',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/HOD102c.webp',
    shortDescription: 'How design became a discipline — writing & printing, Arts & Crafts, modernism (Bauhaus, Swiss Style), postmodernism, industrial & product design, the digital age (web, UX), plus contemporary, sustainable & Vietnamese design. Bilingual, with timelines & quizzes.|||Thiết kế thành một ngành thế nào — in ấn, Arts & Crafts, hiện đại (Bauhaus, Thuỵ Sĩ), hậu hiện đại, thiết kế công nghiệp, thời đại số (web, UX), cùng thiết kế đương đại, bền vững & Việt Nam. Song ngữ, có dòng thời gian & quiz.',
    description: 'Môn <strong>HOD102c — Design History</strong> (Lịch sử Thiết kế, kỳ 8, ngành Thiết kế mỹ thuật số) kể câu chuyện thiết kế đồ hoạ và sản phẩm trở thành ngành nghề hôm nay. Từ <strong>nguồn gốc</strong> (chữ viết, in ấn, cách mạng công nghiệp) → <strong>Arts &amp; Crafts và Art Nouveau</strong> → <strong>chủ nghĩa hiện đại</strong> (Bauhaus, De Stijl, Constructivism) → <strong>Trường phái Thuỵ Sĩ</strong> → <strong>hậu chiến &amp; hậu hiện đại</strong> → <strong>thiết kế công nghiệp &amp; sản phẩm</strong> → <strong>thời đại số</strong> (đồ hoạ, web, UX) → <strong>đương đại, bền vững &amp; Việt Nam</strong>. Bám các giáo trình chuẩn (Meggs, Sparke, Heskett, Gombrich), song ngữ, mỗi chương có dòng thời gian và quiz.',
    whatYouLearn: 'Đặt một tác phẩm vào dòng thời gian và gọi tên phong trào; chữ viết, bảng chữ cái, Gutenberg và in ấn; Arts &amp; Crafts và Art Nouveau; chủ nghĩa hiện đại (Bauhaus, De Stijl, Constructivism, "hình thức theo công năng"); Trường phái Thuỵ Sĩ (lưới, chữ không chân); hậu chiến &amp; hậu hiện đại; thiết kế công nghiệp (Werkbund, Rams); thời đại số (desktop publishing, web, UX/UI, design system); thiết kế bền vững và bối cảnh Việt Nam.',
    requirements: 'Không cần kiến thức trước. Thích quan sát hình ảnh, thương hiệu, áp phích và giao diện quanh mình. Nên tự sưu tầm ví dụ cho mỗi phong trào để đối chiếu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, bảo tàng & lưu trữ, video, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thiết kế là gì, cách đọc một phong trào, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Nguồn gốc|||Chapter 1 — Origins', description: 'Chữ viết, in ấn, Gutenberg, cách mạng công nghiệp.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Arts & Crafts / Art Nouveau|||Chapter 2 — Arts & Crafts / Art Nouveau', description: 'Morris, thủ công, đường cong hữu cơ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chủ nghĩa hiện đại|||Chapter 3 — Modernism', description: 'Bauhaus, De Stijl, Constructivism.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Trường phái Thuỵ Sĩ|||Chapter 4 — Swiss Style', description: 'Lưới, chữ không chân, khách quan.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Hậu chiến & hậu hiện đại|||Chapter 5 — Post-war & postmodern', description: 'Nhận diện thương hiệu, Memphis, chiết trung.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thiết kế công nghiệp|||Chapter 6 — Industrial design', description: 'Werkbund, streamlining, Dieter Rams.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thời đại số|||Chapter 7 — Digital age', description: 'Desktop publishing, web, UX/UI, design system.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đương đại, bền vững & Việt Nam|||Chapter 8 — Contemporary & Vietnam', description: 'Design system, bền vững, thiết kế Việt Nam.', lessons: [c8, c8q] },
  ],
};
