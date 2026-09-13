/**
 * HOA102 — Art History (Lịch sử Mỹ thuật). Ngành Thiết kế mỹ thuật số FPTU, Kỳ 2.
 * Khung chất lượng: 8 chương theo dòng thời gian, song ngữ VI+EN, mỗi chương 1
 * DOCUMENT + 1 QUIZ 3 câu. Nguồn chuẩn quốc tế: Gardner "Art Through the Ages",
 * Gombrich "The Story of Art", Janson "History of Art", Khan Academy Art History,
 * Google Arts & Culture.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML;
 * "&" trong HTML viết &amp;. Giữ tiến độ người học bằng cách không đổi slug.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('hoa102-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách chuẩn quốc tế (Gardner, Gombrich, Janson), tài liệu miễn phí (Khan Academy, Google Arts & Culture), bảo tàng số, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">HOA102 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Art History — from prehistoric caves to contemporary art — in one place. The official FPTU giáo trình &amp; slides live on <strong>FLM</strong>; below are free, world-class resources.</p>
<h3>📘 Standard textbooks</h3>
<ul>
<li><strong>Gardner — <em>Art Through the Ages</em></strong>: the most widely used art-history survey.</li>
<li><strong>E. H. Gombrich — <em>The Story of Art</em></strong>: the classic, readable one-volume history.</li>
<li><strong>Janson — <em>History of Art</em></strong>: a rigorous survey of Western art.</li>
</ul>
<h3>🌐 Free / official resources</h3>
<ul>
<li><a href="https://www.khanacademy.org/humanities/art-history" target="_blank" rel="noopener">Khan Academy — Art History (Smarthistory)</a></li>
<li><a href="https://artsandculture.google.com/" target="_blank" rel="noopener">Google Arts &amp; Culture</a> — high-resolution works from museums worldwide</li>
<li><a href="https://www.metmuseum.org/toah/" target="_blank" rel="noopener">The Met — Heilbrunn Timeline of Art History</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@smarthistory" target="_blank" rel="noopener">Smarthistory</a> — expert conversations in front of real artworks</li>
<li><a href="https://www.youtube.com/@TheNationalGallery" target="_blank" rel="noopener">The National Gallery, London</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — learn to read a work: subject, style, medium, period.</li>
<li><strong>Timeline</strong> — walk the periods in order (ancient → medieval → Renaissance → modern) so styles connect.</li>
<li><strong>Go deeper</strong> — study key artists and landmark works in each movement.</li>
<li><strong>Apply</strong> — visit museums (or Google Arts &amp; Culture), and connect history to your own design work.</li>
</ol></div>`,
    `<span class="eyebrow">HOA102 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Lịch sử Mỹ thuật — từ hang động tiền sử đến nghệ thuật đương đại — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, đẳng cấp thế giới.</p>
<h3>📘 Sách chuẩn</h3>
<ul>
<li><strong>Gardner — <em>Art Through the Ages</em></strong>: giáo trình khảo lược lịch sử mỹ thuật được dùng rộng rãi nhất.</li>
<li><strong>E. H. Gombrich — <em>The Story of Art</em></strong>: cuốn kinh điển, dễ đọc, một tập.</li>
<li><strong>Janson — <em>History of Art</em></strong>: khảo lược nghiêm cẩn về mỹ thuật phương Tây.</li>
</ul>
<h3>🌐 Tài liệu miễn phí / chính thức</h3>
<ul>
<li><a href="https://www.khanacademy.org/humanities/art-history" target="_blank" rel="noopener">Khan Academy — Lịch sử Mỹ thuật (Smarthistory)</a></li>
<li><a href="https://artsandculture.google.com/" target="_blank" rel="noopener">Google Arts &amp; Culture</a> — tác phẩm độ phân giải cao từ bảo tàng khắp thế giới</li>
<li><a href="https://www.metmuseum.org/toah/" target="_blank" rel="noopener">The Met — Dòng thời gian Lịch sử Mỹ thuật</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@smarthistory" target="_blank" rel="noopener">Smarthistory</a> — chuyên gia trò chuyện trước tác phẩm thật</li>
<li><a href="https://www.youtube.com/@TheNationalGallery" target="_blank" rel="noopener">The National Gallery, London</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — học cách đọc một tác phẩm: đề tài, phong cách, chất liệu, thời kỳ.</li>
<li><strong>Dòng thời gian</strong> — đi qua các thời kỳ theo thứ tự (cổ đại → trung cổ → Phục Hưng → hiện đại) để các phong cách nối được với nhau.</li>
<li><strong>Đào sâu</strong> — nghiên cứu nghệ sĩ và tác phẩm cột mốc của từng trào lưu.</li>
<li><strong>Vận dụng</strong> — đi bảo tàng (hoặc Google Arts &amp; Culture), và nối lịch sử với chính công việc thiết kế của bạn.</li>
</ol></div>`,
  ]]);

const intro = doc('hoa102-0-1-overview', 'Course overview: Art History|||Tổng quan: Lịch sử Mỹ thuật',
  'Lịch sử mỹ thuật là gì và học để làm gì; cách đọc một tác phẩm (đề tài, phong cách, chất liệu, thời kỳ); lộ trình 8 chương theo dòng thời gian từ cổ đại đến đương đại và mỹ thuật châu Á - Việt Nam.',
  [[
    `<span class="eyebrow">HOA102 · Lesson 0.1 · Overview</span>
<h2>Art History</h2>
<p class="lead">Art History studies <strong>how and why people have made images and objects across time</strong> — and how each age saw beauty, power, faith and the human self. For a designer, it is a vast visual library: every style, palette and composition you use has a history.</p>
<h3>How to read a work</h3>
<ul>
<li><strong>Subject</strong> — what is shown (a god, a ruler, a landscape, an idea)?</li>
<li><strong>Style</strong> — how is it made (realistic or abstract, calm or dramatic)?</li>
<li><strong>Medium</strong> — fresco, oil, marble, ink, lacquer, print?</li>
<li><strong>Context</strong> — the period, place and beliefs that shaped it.</li>
</ul>
<h3>Roadmap — eight chapters along the timeline</h3>
<p>Ancient → Medieval → Renaissance → Baroque &amp; Rococo → the 19th century → early 20th-century modern art → modern &amp; contemporary → and the art of Asia &amp; Vietnam. Bilingual, with real artists and landmark works, plus a quiz per chapter.</p>
<div class="callout"><span class="badge">Why it matters</span> Styles do not appear from nowhere — each answers or rebels against the one before. Seeing that chain is the heart of art history.</div>`,
    `<span class="eyebrow">HOA102 · Bài 0.1 · Tổng quan</span>
<h2>Lịch sử Mỹ thuật</h2>
<p class="lead">Lịch sử Mỹ thuật nghiên cứu <strong>con người đã tạo ra hình ảnh và tác phẩm như thế nào và vì sao qua các thời đại</strong> — và mỗi thời nhìn cái đẹp, quyền lực, đức tin và bản ngã con người ra sao. Với người thiết kế, đây là một thư viện thị giác khổng lồ: mọi phong cách, bảng màu, bố cục bạn dùng đều có lịch sử.</p>
<h3>Cách đọc một tác phẩm</h3>
<ul>
<li><strong>Đề tài</strong> — vẽ gì (thần linh, người cai trị, phong cảnh, một ý niệm)?</li>
<li><strong>Phong cách</strong> — làm theo lối nào (tả thực hay trừu tượng, tĩnh lặng hay kịch tính)?</li>
<li><strong>Chất liệu</strong> — bích hoạ, sơn dầu, cẩm thạch, mực, sơn mài, tranh in?</li>
<li><strong>Bối cảnh</strong> — thời kỳ, nơi chốn và niềm tin đã hình thành nên nó.</li>
</ul>
<h3>Lộ trình — tám chương theo dòng thời gian</h3>
<p>Cổ đại → Trung cổ → Phục Hưng → Baroque &amp; Rococo → thế kỷ 19 → nghệ thuật hiện đại đầu thế kỷ 20 → hiện đại &amp; đương đại → và mỹ thuật châu Á &amp; Việt Nam. Song ngữ, có nghệ sĩ và tác phẩm cột mốc thật, kèm quiz mỗi chương.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Phong cách không tự nhiên mà có — mỗi cái đáp lại hoặc nổi loạn với cái trước. Nhìn ra sợi dây đó chính là cốt lõi của lịch sử mỹ thuật.</div>`,
  ]]);

const c1 = doc('hoa102-1-1-ancient', '1.1 — Ancient art|||1.1 — Mỹ thuật cổ đại',
  'Tiền sử (hang Lascaux, Venus of Willendorf); Ai Cập (Kim tự tháp, tượng bán thân Nefertiti, quy ước chính diện); Lưỡng Hà (ziggurat, bia Hammurabi); Hy Lạp (Parthenon, tượng lý tưởng) và La Mã (Colosseum, Pantheon, vòm và bê tông).',
  [[
    `<span class="eyebrow">HOA102 · Chapter 1 · Lesson 1.1</span>
<h2>Ancient art</h2>
<p class="lead">Art begins in the dark — on cave walls tens of thousands of years old. This chapter traces the first great civilizations: the caves of prehistory, the god-kings of Egypt and Mesopotamia, and the human ideal of Greece and Rome.</p>
<h3>Prehistoric</h3>
<p>The <strong>Lascaux</strong> and <strong>Chauvet</strong> cave paintings (France, c. 17,000–36,000 BCE) show bulls, horses and deer in charcoal and ochre — art made long before writing. Small fertility figures like the <strong>Venus of Willendorf</strong> (c. 25,000 BCE) are among the oldest sculptures.</p>
<h3>Egypt &amp; Mesopotamia</h3>
<ul>
<li><strong>Egypt</strong> — art served eternity: the <strong>Pyramids of Giza</strong> and <strong>Great Sphinx</strong>, tomb paintings with the rigid frontal convention (head in profile, eye and torso from the front), and the serene <strong>Bust of Nefertiti</strong>.</li>
<li><strong>Mesopotamia</strong> — the stepped <strong>ziggurat</strong> temples, the <strong>Standard of Ur</strong>, and the <strong>Stele of Hammurabi</strong> carrying one of the first written law codes.</li>
</ul>
<h3>Greece &amp; Rome</h3>
<p><strong>Greece</strong> pursued ideal beauty and balance: the <strong>Parthenon</strong> with its Doric columns, and sculptures like the <strong>Doryphoros</strong> of Polykleitos, the <strong>Discobolus</strong> of Myron and the <strong>Venus de Milo</strong>. <strong>Rome</strong> engineered on a grand scale — the <strong>Colosseum</strong> and <strong>Pantheon</strong> using the arch, vault and concrete — and prized lifelike portrait busts.</p>
<div class="callout"><span class="badge">Key idea</span> From cave to temple, ancient art moves from magic and survival toward order, the divine, and the ideal human form.</div>`,
    `<span class="eyebrow">HOA102 · Chương 1 · Bài 1.1</span>
<h2>Mỹ thuật cổ đại</h2>
<p class="lead">Mỹ thuật khởi đầu trong bóng tối — trên vách hang có tuổi hàng chục nghìn năm. Chương này lần theo những nền văn minh lớn đầu tiên: hang động tiền sử, các vua-thần của Ai Cập và Lưỡng Hà, và lý tưởng về con người của Hy Lạp và La Mã.</p>
<h3>Tiền sử</h3>
<p>Tranh hang <strong>Lascaux</strong> và <strong>Chauvet</strong> (Pháp, khoảng 17.000–36.000 TCN) vẽ bò rừng, ngựa và hươu bằng than và thổ hoàng — nghệ thuật có trước cả chữ viết. Những tượng nhỏ phồn thực như <strong>Venus of Willendorf</strong> (khoảng 25.000 TCN) thuộc nhóm điêu khắc cổ nhất.</p>
<h3>Ai Cập &amp; Lưỡng Hà</h3>
<ul>
<li><strong>Ai Cập</strong> — nghệ thuật phục vụ sự vĩnh hằng: <strong>Kim tự tháp Giza</strong> và <strong>Nhân sư lớn</strong>, tranh mộ theo quy ước chính diện cứng nhắc (đầu nghiêng, mắt và thân nhìn thẳng), và tượng bán thân <strong>Nefertiti</strong> thanh tú.</li>
<li><strong>Lưỡng Hà</strong> — đền tháp bậc <strong>ziggurat</strong>, <strong>Standard of Ur</strong>, và <strong>bia đá Hammurabi</strong> khắc một trong những bộ luật thành văn đầu tiên.</li>
</ul>
<h3>Hy Lạp &amp; La Mã</h3>
<p><strong>Hy Lạp</strong> theo đuổi cái đẹp lý tưởng và sự cân đối: đền <strong>Parthenon</strong> với cột Doric, và các tượng như <strong>Doryphoros</strong> của Polykleitos, <strong>Discobolus</strong> của Myron và <strong>Venus de Milo</strong>. <strong>La Mã</strong> xây dựng ở quy mô lớn — <strong>Colosseum</strong> và <strong>Pantheon</strong> dùng vòm, mái vòm và bê tông — và chuộng tượng chân dung tả thực.</p>
<div class="callout"><span class="badge">Ý chính</span> Từ hang động đến đền đài, mỹ thuật cổ đại chuyển từ ma thuật và sinh tồn sang trật tự, thần linh và hình mẫu con người lý tưởng.</div>`,
  ]]);

const c1q = quiz('hoa102-quiz-1', 'Quiz 1 — Ancient art|||Quiz 1 — Mỹ thuật cổ đại', [
  { id: 'q1', question: 'Tranh hang tiền sử nổi tiếng ở Pháp là?|||A famous prehistoric cave painting site in France is?', options: ['Lascaux', 'Parthenon', 'Colosseum', 'Ziggurat'], correctIndex: 0, explanation: 'Lascaux (và Chauvet) là các hang tranh tiền sử ở Pháp.' },
  { id: 'q2', question: 'Quy ước "chính diện" (head in profile, eye/torso frontal) đặc trưng cho mỹ thuật?|||The frontal convention is characteristic of which art?', options: ['Ai Cập cổ đại|||Ancient Egypt', 'La Mã|||Rome', 'Hy Lạp|||Greece', 'Lưỡng Hà|||Mesopotamia'], correctIndex: 0, explanation: 'Tranh mộ Ai Cập vẽ đầu nghiêng nhưng mắt và thân nhìn thẳng.' },
  { id: 'q3', question: 'Công trình La Mã dùng vòm, mái vòm và bê tông là?|||A Roman building using arch, vault and concrete is?', options: ['Pantheon', 'Bust of Nefertiti', 'Venus de Milo', 'Standard of Ur'], correctIndex: 0, explanation: 'Pantheon và Colosseum thể hiện kỹ thuật vòm - bê tông của La Mã.' },
]);

const c2 = doc('hoa102-2-1-medieval', '2.1 — Medieval art|||2.1 — Mỹ thuật Trung cổ',
  'Byzantine (Hagia Sophia, tranh khảm/mosaic, icon, nền vàng, hình dẹt chính diện); Gothic (nhà thờ, vòm nhọn, trụ bay, kính màu, cửa sổ hoa hồng); nghệ thuật Kitô giáo và bản thảo trang trí; Giotto làm cầu nối.',
  [[
    `<span class="eyebrow">HOA102 · Chapter 2 · Lesson 2.1</span>
<h2>Medieval art</h2>
<p class="lead">For a thousand years after Rome, Western art served the Church. Figures grew flat and symbolic, gold replaced deep space, and the great cathedrals reached toward heaven in stone and colored light.</p>
<h3>Byzantine</h3>
<p>Centered on Constantinople, Byzantine art is known for shimmering <strong>mosaics</strong> and <strong>icons</strong> on <strong>gold grounds</strong> — flat, frontal, otherworldly figures. The domed <strong>Hagia Sophia</strong> and the mosaics of <strong>San Vitale</strong> in Ravenna are landmarks.</p>
<h3>Romanesque &amp; Gothic</h3>
<ul>
<li><strong>Romanesque</strong> — heavy walls, round arches, small windows; solid, fortress-like churches.</li>
<li><strong>Gothic</strong> — the <strong>pointed arch</strong>, <strong>ribbed vault</strong> and <strong>flying buttress</strong> let walls open into vast <strong>stained-glass</strong> windows and <strong>rose windows</strong>. See <strong>Notre-Dame de Paris</strong> and <strong>Chartres Cathedral</strong>.</li>
</ul>
<h3>Manuscripts &amp; Giotto</h3>
<p>Monks painted jewel-like <strong>illuminated manuscripts</strong> such as the <strong>Book of Kells</strong>. Late in the period <strong>Giotto</strong> began giving figures weight, emotion and space — a first step toward the Renaissance.</p>
<div class="callout"><span class="badge">Key idea</span> Medieval art speaks in symbols for the faithful; the Gothic cathedral turns engineering into a vision of divine light.</div>`,
    `<span class="eyebrow">HOA102 · Chương 2 · Bài 2.1</span>
<h2>Mỹ thuật Trung cổ</h2>
<p class="lead">Suốt nghìn năm sau La Mã, mỹ thuật phương Tây phục vụ Giáo hội. Hình người trở nên dẹt và mang tính biểu tượng, vàng thay cho chiều sâu không gian, và những đại giáo đường vươn lên trời bằng đá và ánh sáng màu.</p>
<h3>Byzantine</h3>
<p>Lấy Constantinople làm trung tâm, mỹ thuật Byzantine nổi tiếng với <strong>tranh khảm (mosaic)</strong> lấp lánh và <strong>icon</strong> trên <strong>nền vàng</strong> — hình dẹt, chính diện, phi trần thế. Đền mái vòm <strong>Hagia Sophia</strong> và tranh khảm ở <strong>San Vitale</strong> (Ravenna) là các cột mốc.</p>
<h3>Romanesque &amp; Gothic</h3>
<ul>
<li><strong>Romanesque</strong> — tường dày, vòm tròn, cửa sổ nhỏ; nhà thờ chắc nịch như pháo đài.</li>
<li><strong>Gothic</strong> — <strong>vòm nhọn</strong>, <strong>vòm gân</strong> và <strong>trụ bay (flying buttress)</strong> cho phép mở tường thành những ô <strong>kính màu</strong> lớn và <strong>cửa sổ hoa hồng</strong>. Xem <strong>Notre-Dame de Paris</strong> và <strong>nhà thờ Chartres</strong>.</li>
</ul>
<h3>Bản thảo trang trí &amp; Giotto</h3>
<p>Các tu sĩ vẽ <strong>bản thảo trang trí (illuminated manuscript)</strong> lộng lẫy như <strong>Book of Kells</strong>. Cuối thời kỳ, <strong>Giotto</strong> bắt đầu cho nhân vật có trọng lượng, cảm xúc và không gian — bước đầu tiên hướng tới Phục Hưng.</p>
<div class="callout"><span class="badge">Ý chính</span> Mỹ thuật Trung cổ nói bằng biểu tượng cho tín đồ; đại giáo đường Gothic biến kỹ thuật xây dựng thành một thị kiến về ánh sáng thần linh.</div>`,
  ]]);

const c2q = quiz('hoa102-quiz-2', 'Quiz 2 — Medieval art|||Quiz 2 — Mỹ thuật Trung cổ', [
  { id: 'q1', question: 'Nền vàng, hình dẹt chính diện và tranh khảm là đặc trưng của?|||Gold grounds, flat frontal figures and mosaics are typical of?', options: ['Byzantine', 'Baroque', 'Impressionism|||Ấn tượng', 'Cubism|||Lập thể'], correctIndex: 0, explanation: 'Đó là đặc trưng mỹ thuật Byzantine.' },
  { id: 'q2', question: 'Vòm nhọn, vòm gân và trụ bay thuộc phong cách kiến trúc?|||Pointed arch, ribbed vault and flying buttress belong to which style?', options: ['Gothic', 'Romanesque', 'La Mã cổ đại|||Ancient Rome', 'Rococo'], correctIndex: 0, explanation: 'Đó là ba đặc trưng kỹ thuật của nhà thờ Gothic.' },
  { id: 'q3', question: 'Hoạ sĩ cuối Trung cổ cho nhân vật có trọng lượng và cảm xúc, mở đường cho Phục Hưng?|||The late-medieval painter who gave figures weight and emotion, paving the way for the Renaissance?', options: ['Giotto', 'Caravaggio', 'Monet', 'Picasso'], correctIndex: 0, explanation: 'Giotto là cầu nối tới Phục Hưng.' },
]);

const c3 = doc('hoa102-3-1-renaissance', '3.1 — The Renaissance|||3.1 — Phục Hưng',
  'Phục Hưng Ý: hồi sinh tinh thần cổ điển, chủ nghĩa nhân văn, phối cảnh tuyến tính (Brunelleschi, Alberti); Botticelli; bộ ba đỉnh cao Leonardo (Mona Lisa, sfumato), Michelangelo (David, trần Sistine), Raphael (Trường Athens); Phục Hưng phương Bắc.',
  [[
    `<span class="eyebrow">HOA102 · Chapter 3 · Lesson 3.1</span>
<h2>The Renaissance</h2>
<p class="lead">In 15th-century Italy art was reborn (renaissance = rebirth). Artists revived the balance of Greece and Rome, put the human being at the center (humanism), and mastered a new tool for realistic space: linear perspective.</p>
<h3>A new science of seeing</h3>
<p><strong>Linear perspective</strong> — codified by <strong>Brunelleschi</strong> and <strong>Alberti</strong> — let painters build convincing depth on a flat surface using a vanishing point. Combined with anatomy and light, it made painting look like a window onto the real world.</p>
<h3>The High Renaissance masters</h3>
<ul>
<li><strong>Leonardo da Vinci</strong> — the <strong>Mona Lisa</strong> and <strong>The Last Supper</strong>, with his soft <em>sfumato</em> (smoky, blurred transitions).</li>
<li><strong>Michelangelo</strong> — the marble <strong>David</strong> and the <strong>Sistine Chapel ceiling</strong>.</li>
<li><strong>Raphael</strong> — the <strong>School of Athens</strong>, a perfect harmony of composition and perspective.</li>
</ul>
<p>Earlier, <strong>Botticelli</strong> painted the <strong>Birth of Venus</strong> and <strong>Primavera</strong>. In the North, <strong>Jan van Eyck</strong> perfected oil painting (the <strong>Arnolfini Portrait</strong>).</p>
<div class="callout"><span class="badge">Key idea</span> The Renaissance unites science and beauty: perspective, anatomy and light serve a new confidence in the human being.</div>`,
    `<span class="eyebrow">HOA102 · Chương 3 · Bài 3.1</span>
<h2>Phục Hưng</h2>
<p class="lead">Ở nước Ý thế kỷ 15, mỹ thuật được tái sinh (renaissance = tái sinh). Nghệ sĩ làm sống lại sự cân đối của Hy Lạp - La Mã, đặt con người vào trung tâm (chủ nghĩa nhân văn), và làm chủ một công cụ mới để tạo không gian tả thực: phối cảnh tuyến tính.</p>
<h3>Một khoa học mới về cách nhìn</h3>
<p><strong>Phối cảnh tuyến tính</strong> — được <strong>Brunelleschi</strong> và <strong>Alberti</strong> đúc kết — cho phép hoạ sĩ dựng chiều sâu thuyết phục trên mặt phẳng bằng điểm tụ. Kết hợp với giải phẫu và ánh sáng, nó khiến bức tranh trông như một ô cửa sổ nhìn ra thế giới thật.</p>
<h3>Bộ ba bậc thầy đỉnh cao</h3>
<ul>
<li><strong>Leonardo da Vinci</strong> — <strong>Mona Lisa</strong> và <strong>Bữa tối cuối cùng</strong>, với kỹ thuật <em>sfumato</em> mềm mại (chuyển sắc mờ như khói).</li>
<li><strong>Michelangelo</strong> — tượng cẩm thạch <strong>David</strong> và <strong>trần nhà nguyện Sistine</strong>.</li>
<li><strong>Raphael</strong> — <strong>Trường Athens</strong>, sự hài hoà hoàn hảo giữa bố cục và phối cảnh.</li>
</ul>
<p>Trước đó, <strong>Botticelli</strong> vẽ <strong>Sự ra đời của thần Vệ Nữ</strong> và <strong>Primavera</strong>. Ở phương Bắc, <strong>Jan van Eyck</strong> hoàn thiện tranh sơn dầu (<strong>Chân dung Arnolfini</strong>).</p>
<div class="callout"><span class="badge">Ý chính</span> Phục Hưng hợp nhất khoa học và cái đẹp: phối cảnh, giải phẫu và ánh sáng phục vụ một niềm tin mới vào con người.</div>`,
  ]]);

const c3q = quiz('hoa102-quiz-3', 'Quiz 3 — The Renaissance|||Quiz 3 — Phục Hưng', [
  { id: 'q1', question: 'Kỹ thuật dựng chiều sâu bằng điểm tụ trên mặt phẳng gọi là?|||The technique of building depth with a vanishing point is called?', options: ['Phối cảnh tuyến tính|||Linear perspective', 'Tranh khảm|||Mosaic', 'Sơn mài|||Lacquer', 'Điểm hoạ|||Pointillism'], correctIndex: 0, explanation: 'Phối cảnh tuyến tính (linear perspective) do Brunelleschi/Alberti đúc kết.' },
  { id: 'q2', question: 'Ai vẽ Mona Lisa và dùng kỹ thuật sfumato?|||Who painted the Mona Lisa and used sfumato?', options: ['Leonardo da Vinci', 'Raphael', 'Caravaggio', 'Monet'], correctIndex: 0, explanation: 'Leonardo da Vinci, với sfumato (chuyển sắc mờ như khói).' },
  { id: 'q3', question: 'Bức "Trường Athens" (School of Athens) là của?|||"The School of Athens" is by?', options: ['Raphael', 'Michelangelo', 'Botticelli', 'Van Eyck'], correctIndex: 0, explanation: 'Raphael vẽ Trường Athens ở Vatican.' },
]);

const c4 = doc('hoa102-4-1-baroque-rococo', '4.1 — Baroque & Rococo|||4.1 — Baroque & Rococo',
  'Baroque: kịch tính, chuyển động, tương phản sáng-tối mạnh (chiaroscuro/tenebrism) — Caravaggio, Bernini (điêu khắc), Rembrandt, Vermeer, Velázquez. Rococo: nhẹ nhàng, cầu kỳ, màu pastel — Watteau, Fragonard.',
  [[
    `<span class="eyebrow">HOA102 · Chapter 4 · Lesson 4.1</span>
<h2>Baroque &amp; Rococo</h2>
<p class="lead">After the Renaissance, art turned dramatic. The Baroque (1600s) uses movement, deep shadow and emotion to grip the viewer; the later Rococo softens it into playful, ornate elegance.</p>
<h3>Baroque — light, drama, motion</h3>
<p>Baroque painters mastered <strong>chiaroscuro</strong> (strong light-dark contrast); its extreme form, <strong>tenebrism</strong>, plunges scenes into darkness pierced by a shaft of light.</p>
<ul>
<li><strong>Caravaggio</strong> — raw realism and spotlight drama (<strong>The Calling of St Matthew</strong>).</li>
<li><strong>Bernini</strong> — sculpture full of motion and feeling (<strong>Ecstasy of St Teresa</strong>).</li>
<li><strong>Rembrandt</strong> — light and psychology (<strong>The Night Watch</strong>, self-portraits).</li>
<li><strong>Vermeer</strong> — quiet interiors (<strong>Girl with a Pearl Earring</strong>); <strong>Velázquez</strong> — <strong>Las Meninas</strong>.</li>
</ul>
<h3>Rococo — light and ornate</h3>
<p>In 18th-century France, <strong>Rococo</strong> brought pastel colors, curves and carefree charm — <strong>Watteau</strong> and <strong>Fragonard</strong> (<strong>The Swing</strong>).</p>
<div class="callout"><span class="badge">Key idea</span> Baroque overwhelms with drama and light; Rococo delights with elegance and play.</div>`,
    `<span class="eyebrow">HOA102 · Chương 4 · Bài 4.1</span>
<h2>Baroque &amp; Rococo</h2>
<p class="lead">Sau Phục Hưng, mỹ thuật trở nên kịch tính. Baroque (thế kỷ 17) dùng chuyển động, bóng đổ sâu và cảm xúc để cuốn lấy người xem; Rococo về sau làm dịu lại thành sự thanh nhã cầu kỳ, vui tươi.</p>
<h3>Baroque — ánh sáng, kịch tính, chuyển động</h3>
<p>Hoạ sĩ Baroque làm chủ <strong>chiaroscuro</strong> (tương phản sáng-tối mạnh); dạng cực đoan của nó là <strong>tenebrism</strong>, nhấn cảnh vào bóng tối bị xé bởi một luồng sáng.</p>
<ul>
<li><strong>Caravaggio</strong> — tả thực trần trụi và kịch tính kiểu đèn rọi (<strong>The Calling of St Matthew</strong>).</li>
<li><strong>Bernini</strong> — điêu khắc đầy chuyển động và cảm xúc (<strong>Ecstasy of St Teresa</strong>).</li>
<li><strong>Rembrandt</strong> — ánh sáng và tâm lý (<strong>The Night Watch</strong>, tranh tự hoạ).</li>
<li><strong>Vermeer</strong> — nội thất tĩnh lặng (<strong>Thiếu nữ đeo hoa tai ngọc trai</strong>); <strong>Velázquez</strong> — <strong>Las Meninas</strong>.</li>
</ul>
<h3>Rococo — nhẹ nhàng và cầu kỳ</h3>
<p>Ở nước Pháp thế kỷ 18, <strong>Rococo</strong> mang màu pastel, đường cong và nét duyên vô tư — <strong>Watteau</strong> và <strong>Fragonard</strong> (<strong>The Swing</strong>).</p>
<div class="callout"><span class="badge">Ý chính</span> Baroque áp đảo bằng kịch tính và ánh sáng; Rococo mê hoặc bằng sự thanh nhã và vui đùa.</div>`,
  ]]);

const c4q = quiz('hoa102-quiz-4', 'Quiz 4 — Baroque & Rococo|||Quiz 4 — Baroque & Rococo', [
  { id: 'q1', question: 'Tương phản sáng-tối mạnh trong Baroque gọi là?|||The strong light-dark contrast in Baroque is called?', options: ['Chiaroscuro', 'Sfumato', 'Sơn mài|||Lacquer', 'Phối cảnh|||Perspective'], correctIndex: 0, explanation: 'Chiaroscuro; dạng cực đoan là tenebrism.' },
  { id: 'q2', question: 'Hoạ sĩ Baroque nổi tiếng với kịch tính kiểu đèn rọi (The Calling of St Matthew)?|||The Baroque painter famous for spotlight drama?', options: ['Caravaggio', 'Fragonard', 'Botticelli', 'Warhol'], correctIndex: 0, explanation: 'Caravaggio, bậc thầy tenebrism.' },
  { id: 'q3', question: 'Rococo được đặc trưng bởi?|||Rococo is characterized by?', options: ['Màu pastel, đường cong, nhẹ nhàng cầu kỳ|||Pastel colors, curves, light ornate charm', 'Nền vàng dẹt|||Flat gold grounds', 'Trừu tượng hình học|||Geometric abstraction', 'Điểm hoạ|||Pointillism'], correctIndex: 0, explanation: 'Rococo Pháp thế kỷ 18: pastel, đường cong, vui tươi (Watteau, Fragonard).' },
]);

const c5 = doc('hoa102-5-1-nineteenth-century', '5.1 — The 19th century|||5.1 — Thế kỷ 19',
  'Tân cổ điển (David, Ingres); Lãng mạn (Delacroix, Géricault, Goya, Turner); Hiện thực (Courbet, Millet); Ấn tượng (Monet, Renoir, Degas) — vẽ ngoài trời, ánh sáng và màu tách nét.',
  [[
    `<span class="eyebrow">HOA102 · Chapter 5 · Lesson 5.1</span>
<h2>The 19th century</h2>
<p class="lead">The 19th century races through styles as society industrializes. Reason gives way to emotion, then to everyday truth, and finally to a revolution in how light itself is painted.</p>
<h3>Neoclassicism &amp; Romanticism</h3>
<ul>
<li><strong>Neoclassicism</strong> — order, reason and antique ideals; <strong>Jacques-Louis David</strong> (<strong>Oath of the Horatii</strong>, <strong>Death of Marat</strong>) and <strong>Ingres</strong>.</li>
<li><strong>Romanticism</strong> — emotion, drama and nature; <strong>Delacroix</strong> (<strong>Liberty Leading the People</strong>), <strong>Géricault</strong> (<strong>Raft of the Medusa</strong>), <strong>Goya</strong> and <strong>Turner</strong>.</li>
</ul>
<h3>Realism</h3>
<p><strong>Courbet</strong> and <strong>Millet</strong> (<strong>The Gleaners</strong>) painted ordinary workers and real life, without idealizing.</p>
<h3>Impressionism</h3>
<p>The great break: <strong>Monet</strong> (<strong>Impression, Sunrise</strong>, <strong>Water Lilies</strong>), <strong>Renoir</strong> and <strong>Degas</strong> left the studio to paint outdoors (<em>en plein air</em>), catching fleeting light with quick, broken brushstrokes of pure color.</p>
<div class="callout"><span class="badge">Key idea</span> By the end of the century, artists stop painting <em>what they know is there</em> and start painting <em>the light they actually see</em> — the door to modern art.</div>`,
    `<span class="eyebrow">HOA102 · Chương 5 · Bài 5.1</span>
<h2>Thế kỷ 19</h2>
<p class="lead">Thế kỷ 19 lướt qua hàng loạt phong cách khi xã hội công nghiệp hoá. Lý trí nhường chỗ cho cảm xúc, rồi cho sự thật đời thường, và cuối cùng là một cuộc cách mạng trong cách vẽ chính ánh sáng.</p>
<h3>Tân cổ điển &amp; Lãng mạn</h3>
<ul>
<li><strong>Tân cổ điển (Neoclassicism)</strong> — trật tự, lý trí và lý tưởng cổ đại; <strong>Jacques-Louis David</strong> (<strong>Lời thề Horatii</strong>, <strong>Cái chết của Marat</strong>) và <strong>Ingres</strong>.</li>
<li><strong>Lãng mạn (Romanticism)</strong> — cảm xúc, kịch tính và thiên nhiên; <strong>Delacroix</strong> (<strong>Nữ thần Tự do dẫn dắt nhân dân</strong>), <strong>Géricault</strong> (<strong>Chiếc bè Medusa</strong>), <strong>Goya</strong> và <strong>Turner</strong>.</li>
</ul>
<h3>Hiện thực</h3>
<p><strong>Courbet</strong> và <strong>Millet</strong> (<strong>Những người mót lúa</strong>) vẽ người lao động bình thường và đời thực, không tô vẽ lý tưởng hoá.</p>
<h3>Ấn tượng</h3>
<p>Bước ngoặt lớn: <strong>Monet</strong> (<strong>Ấn tượng, mặt trời mọc</strong>, <strong>Hoa súng</strong>), <strong>Renoir</strong> và <strong>Degas</strong> rời xưởng vẽ để vẽ ngoài trời (<em>en plein air</em>), bắt ánh sáng thoáng qua bằng những nét cọ nhanh, tách nét, màu nguyên.</p>
<div class="callout"><span class="badge">Ý chính</span> Cuối thế kỷ, nghệ sĩ thôi vẽ <em>thứ họ biết là có ở đó</em> và bắt đầu vẽ <em>ánh sáng họ thật sự trông thấy</em> — cánh cửa dẫn vào nghệ thuật hiện đại.</div>`,
  ]]);

const c5q = quiz('hoa102-quiz-5', 'Quiz 5 — The 19th century|||Quiz 5 — Thế kỷ 19', [
  { id: 'q1', question: 'Trào lưu vẽ ngoài trời, bắt ánh sáng thoáng qua bằng nét cọ tách màu?|||The movement of painting outdoors to catch fleeting light with broken color?', options: ['Ấn tượng|||Impressionism', 'Tân cổ điển|||Neoclassicism', 'Baroque', 'Lập thể|||Cubism'], correctIndex: 0, explanation: 'Ấn tượng (Monet, Renoir, Degas), vẽ en plein air.' },
  { id: 'q2', question: '"Nữ thần Tự do dẫn dắt nhân dân" (Liberty Leading the People) thuộc trào lưu?|||"Liberty Leading the People" belongs to which movement?', options: ['Lãng mạn|||Romanticism', 'Hiện thực|||Realism', 'Ấn tượng|||Impressionism', 'Rococo'], correctIndex: 0, explanation: 'Delacroix, một kiệt tác Lãng mạn.' },
  { id: 'q3', question: 'Bức "Ấn tượng, mặt trời mọc" đặt tên cho trào lưu Ấn tượng là của?|||"Impression, Sunrise", which named Impressionism, is by?', options: ['Monet', 'David', 'Courbet', 'Goya'], correctIndex: 0, explanation: 'Claude Monet; tên tranh sinh ra tên trào lưu.' },
]);

const c6 = doc('hoa102-6-1-early-modern', '6.1 — Early 20th-century modern art|||6.1 — Nghệ thuật hiện đại đầu thế kỷ 20',
  'Hậu ấn tượng (Cézanne, Van Gogh, Gauguin, Seurat); Dã thú (Matisse); Lập thể (Picasso & Braque); Biểu hiện (Munch, Kandinsky); Siêu thực (Dalí, Magritte); vòng đời sáng tạo của Picasso.',
  [[
    `<span class="eyebrow">HOA102 · Chapter 6 · Lesson 6.1</span>
<h2>Early 20th-century modern art</h2>
<p class="lead">In a few explosive decades, artists broke every old rule. Once photography could record reality, painting was free to distort, flatten, fragment and dream — and Picasso stood at the center of it.</p>
<h3>Post-Impressionism</h3>
<p><strong>Cézanne</strong> (structure and geometry), <strong>Van Gogh</strong> (<strong>The Starry Night</strong>, emotional color), <strong>Gauguin</strong> (flat bold color) and <strong>Seurat</strong> (<strong>pointillism</strong> — dots of pure color).</p>
<h3>The great isms</h3>
<ul>
<li><strong>Fauvism</strong> — wild, unnatural color; <strong>Matisse</strong>.</li>
<li><strong>Cubism</strong> — objects shattered into facets seen from many angles at once; <strong>Picasso</strong> &amp; <strong>Braque</strong> (<strong>Les Demoiselles d Avignon</strong>, <strong>Guernica</strong>).</li>
<li><strong>Expressionism</strong> — inner feeling over appearance; <strong>Munch</strong> (<strong>The Scream</strong>), <strong>Kandinsky</strong>.</li>
<li><strong>Surrealism</strong> — dreams and the unconscious; <strong>Dalí</strong> (<strong>The Persistence of Memory</strong>), <strong>Magritte</strong>, <strong>Miró</strong>.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Modern art shifts the question from "does it look real?" to "what can a painting be?" — color, form and idea become free.</div>`,
    `<span class="eyebrow">HOA102 · Chương 6 · Bài 6.1</span>
<h2>Nghệ thuật hiện đại đầu thế kỷ 20</h2>
<p class="lead">Chỉ trong vài thập niên bùng nổ, nghệ sĩ phá bỏ mọi luật lệ cũ. Khi nhiếp ảnh đã ghi lại được hiện thực, hội hoạ được tự do bóp méo, dàn phẳng, phân mảnh và mộng mơ — và Picasso đứng ở trung tâm.</p>
<h3>Hậu ấn tượng</h3>
<p><strong>Cézanne</strong> (cấu trúc và hình học), <strong>Van Gogh</strong> (<strong>Đêm đầy sao</strong>, màu sắc cảm xúc), <strong>Gauguin</strong> (mảng màu phẳng, mạnh) và <strong>Seurat</strong> (<strong>điểm hoạ</strong> — các chấm màu nguyên).</p>
<h3>Các trào lưu -ism lớn</h3>
<ul>
<li><strong>Dã thú (Fauvism)</strong> — màu hoang dã, phi tự nhiên; <strong>Matisse</strong>.</li>
<li><strong>Lập thể (Cubism)</strong> — vật thể vỡ thành các mặt nhìn từ nhiều góc cùng lúc; <strong>Picasso</strong> &amp; <strong>Braque</strong> (<strong>Les Demoiselles d Avignon</strong>, <strong>Guernica</strong>).</li>
<li><strong>Biểu hiện (Expressionism)</strong> — cảm xúc bên trong hơn là vẻ ngoài; <strong>Munch</strong> (<strong>Tiếng thét</strong>), <strong>Kandinsky</strong>.</li>
<li><strong>Siêu thực (Surrealism)</strong> — giấc mơ và vô thức; <strong>Dalí</strong> (<strong>Sự dai dẳng của ký ức</strong>), <strong>Magritte</strong>, <strong>Miró</strong>.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Nghệ thuật hiện đại đổi câu hỏi từ "trông có thật không?" sang "một bức tranh có thể là gì?" — màu, hình và ý niệm đều được tự do.</div>`,
  ]]);

const c6q = quiz('hoa102-quiz-6', 'Quiz 6 — Early modern art|||Quiz 6 — Hiện đại đầu thế kỷ 20', [
  { id: 'q1', question: 'Trào lưu vỡ vật thể thành các mặt nhìn từ nhiều góc cùng lúc?|||The movement that shatters objects into facets seen from many angles?', options: ['Lập thể|||Cubism', 'Ấn tượng|||Impressionism', 'Baroque', 'Tân cổ điển|||Neoclassicism'], correctIndex: 0, explanation: 'Lập thể (Cubism), do Picasso và Braque khởi xướng.' },
  { id: 'q2', question: 'Bức "Đêm đầy sao" (The Starry Night) là của?|||"The Starry Night" is by?', options: ['Van Gogh', 'Dalí|||Dalí', 'Matisse', 'Monet'], correctIndex: 0, explanation: 'Vincent van Gogh, một hoạ sĩ Hậu ấn tượng.' },
  { id: 'q3', question: 'Trào lưu lấy giấc mơ và vô thức làm đề tài (Dalí, Magritte)?|||The movement of dreams and the unconscious (Dalí, Magritte)?', options: ['Siêu thực|||Surrealism', 'Hiện thực|||Realism', 'Dã thú|||Fauvism', 'Pop Art'], correctIndex: 0, explanation: 'Siêu thực (Surrealism).' },
]);

const c7 = doc('hoa102-7-1-modern-contemporary', '7.1 — Modern & contemporary art|||7.1 — Nghệ thuật hiện đại & đương đại',
  'Trừu tượng (Kandinsky, Mondrian, Malevich); Biểu hiện trừu tượng (Pollock, Rothko); Pop Art (Warhol, Lichtenstein); ý niệm (Duchamp); và nghệ thuật đương đại (sắp đặt, video, nghệ thuật đường phố).',
  [[
    `<span class="eyebrow">HOA102 · Chapter 7 · Lesson 7.1</span>
<h2>Modern &amp; contemporary art</h2>
<p class="lead">After 1945 the center of art moved to New York, and the definition of art kept expanding — from pure abstraction to soup cans to ideas and installations.</p>
<h3>Abstraction</h3>
<p><strong>Kandinsky</strong> (color as music), <strong>Mondrian</strong> (grids of primary color, De Stijl) and <strong>Malevich</strong> pushed art toward pure form with no subject at all.</p>
<h3>Abstract Expressionism &amp; Pop Art</h3>
<ul>
<li><strong>Abstract Expressionism</strong> — gesture and scale; <strong>Jackson Pollock</strong> (drip painting) and <strong>Mark Rothko</strong> (glowing color fields).</li>
<li><strong>Pop Art</strong> — the imagery of mass culture; <strong>Andy Warhol</strong> (<strong>Campbell s Soup Cans</strong>, <strong>Marilyn</strong>) and <strong>Lichtenstein</strong> (comic-strip dots).</li>
</ul>
<h3>Concept &amp; contemporary</h3>
<p><strong>Marcel Duchamp</strong> (<strong>Fountain</strong>) made the idea itself the art. Today, <strong>contemporary art</strong> spans installation, video and performance — <strong>Yayoi Kusama</strong>, <strong>Ai Weiwei</strong> and street artists such as <strong>Banksy</strong>.</p>
<div class="callout"><span class="badge">Key idea</span> Modern art frees form; contemporary art frees the very definition of what art can be.</div>`,
    `<span class="eyebrow">HOA102 · Chương 7 · Bài 7.1</span>
<h2>Nghệ thuật hiện đại &amp; đương đại</h2>
<p class="lead">Sau năm 1945, trung tâm nghệ thuật chuyển sang New York, và định nghĩa về nghệ thuật liên tục mở rộng — từ trừu tượng thuần tuý đến lon súp, đến ý niệm và sắp đặt.</p>
<h3>Trừu tượng</h3>
<p><strong>Kandinsky</strong> (màu như âm nhạc), <strong>Mondrian</strong> (lưới ô màu nguyên, De Stijl) và <strong>Malevich</strong> đẩy nghệ thuật về hình thức thuần tuý, không còn đề tài nào.</p>
<h3>Biểu hiện trừu tượng &amp; Pop Art</h3>
<ul>
<li><strong>Biểu hiện trừu tượng (Abstract Expressionism)</strong> — cử chỉ và quy mô; <strong>Jackson Pollock</strong> (vẩy màu) và <strong>Mark Rothko</strong> (mảng màu rực).</li>
<li><strong>Pop Art</strong> — hình ảnh của văn hoá đại chúng; <strong>Andy Warhol</strong> (<strong>Lon súp Campbell</strong>, <strong>Marilyn</strong>) và <strong>Lichtenstein</strong> (chấm kiểu truyện tranh).</li>
</ul>
<h3>Ý niệm &amp; đương đại</h3>
<p><strong>Marcel Duchamp</strong> (<strong>Fountain</strong>) biến chính ý niệm thành tác phẩm. Ngày nay, <strong>nghệ thuật đương đại</strong> trải khắp sắp đặt, video và trình diễn — <strong>Yayoi Kusama</strong>, <strong>Ai Weiwei</strong> và các nghệ sĩ đường phố như <strong>Banksy</strong>.</p>
<div class="callout"><span class="badge">Ý chính</span> Nghệ thuật hiện đại giải phóng hình thức; nghệ thuật đương đại giải phóng chính định nghĩa về nghệ thuật là gì.</div>`,
  ]]);

const c7q = quiz('hoa102-quiz-7', 'Quiz 7 — Modern & contemporary|||Quiz 7 — Hiện đại & đương đại', [
  { id: 'q1', question: 'Hoạ sĩ nổi tiếng với kỹ thuật "vẩy màu" (drip painting)?|||The artist famous for drip painting?', options: ['Jackson Pollock', 'Mondrian', 'Warhol', 'Duchamp'], correctIndex: 0, explanation: 'Jackson Pollock, tiêu biểu Biểu hiện trừu tượng.' },
  { id: 'q2', question: 'Ai vẽ "Lon súp Campbell" và chân dung Marilyn theo phong cách Pop Art?|||Who made the Campbell s Soup Cans and Marilyn in Pop Art style?', options: ['Andy Warhol', 'Rothko', 'Kandinsky', 'Cézanne|||Cézanne'], correctIndex: 0, explanation: 'Andy Warhol, gương mặt tiêu biểu của Pop Art.' },
  { id: 'q3', question: 'Ai biến chính ý niệm thành tác phẩm với "Fountain"?|||Who made the idea itself the art with "Fountain"?', options: ['Marcel Duchamp', 'Banksy', 'Matisse', 'Monet'], correctIndex: 0, explanation: 'Marcel Duchamp, khởi nguồn nghệ thuật ý niệm.' },
]);

const c8 = doc('hoa102-8-1-asian-vietnamese', '8.1 — Art of Asia & Vietnam|||8.1 — Mỹ thuật châu Á & Việt Nam',
  'Đông Á: tranh thuỷ mặc và thư pháp Trung Hoa, tranh khắc gỗ ukiyo-e Nhật (Hokusai). Việt Nam: tranh dân gian Đông Hồ, gốm, sơn mài; mỹ thuật hiện đại từ Trường Mỹ thuật Đông Dương (Tô Ngọc Vân, Nguyễn Phan Chánh, Bùi Xuân Phái).',
  [[
    `<span class="eyebrow">HOA102 · Chapter 8 · Lesson 8.1</span>
<h2>Art of Asia &amp; Vietnam</h2>
<p class="lead">Art history is not only Western. East Asia developed profound traditions of ink, line and space — and Vietnam has both a rich folk heritage and a distinctive modern school.</p>
<h3>East Asia</h3>
<ul>
<li><strong>China</strong> — <strong>ink-wash painting</strong> and <strong>calligraphy</strong>; sweeping <em>shanshui</em> (mountain-water) landscapes on scrolls, and refined porcelain.</li>
<li><strong>Japan</strong> — <strong>ukiyo-e</strong> woodblock prints; <strong>Hokusai s</strong> <strong>The Great Wave off Kanagawa</strong> later inspired the Impressionists.</li>
</ul>
<h3>Traditional Vietnamese art</h3>
<p><strong>Đông Hồ</strong> and <strong>Hàng Trống</strong> folk prints, temple and communal-house (<em>đình</em>) wood carving, ceramics (Bát Tràng), and the native craft of <strong>lacquer (sơn mài)</strong>.</p>
<h3>Modern Vietnamese art</h3>
<p>The <strong>École des Beaux-Arts de l Indochine</strong> (Hanoi, 1925) fused Western technique with Vietnamese subjects and materials: <strong>Tô Ngọc Vân</strong> (<strong>Young Woman with Lilies</strong>), <strong>Nguyễn Phan Chánh</strong> (silk painting, <em>tranh lụa</em>), <strong>Nguyễn Gia Trí</strong> (lacquer) and <strong>Bùi Xuân Phái</strong> (the streets of old Hanoi, <em>Phố Phái</em>).</p>
<div class="callout"><span class="badge">Key idea</span> Ink and line carry East Asian art; in Vietnam, folk print, silk and lacquer give a modern school its own voice.</div>`,
    `<span class="eyebrow">HOA102 · Chương 8 · Bài 8.1</span>
<h2>Mỹ thuật châu Á &amp; Việt Nam</h2>
<p class="lead">Lịch sử mỹ thuật không chỉ là phương Tây. Đông Á phát triển những truyền thống sâu sắc về mực, đường nét và khoảng trống — và Việt Nam có cả di sản dân gian phong phú lẫn một trường phái hiện đại đặc sắc.</p>
<h3>Đông Á</h3>
<ul>
<li><strong>Trung Hoa</strong> — <strong>tranh thuỷ mặc</strong> và <strong>thư pháp</strong>; tranh phong cảnh <em>sơn thuỷ (shanshui)</em> trải dài trên trục cuộn, và đồ sứ tinh xảo.</li>
<li><strong>Nhật Bản</strong> — tranh khắc gỗ <strong>ukiyo-e</strong>; bức <strong>Sóng lừng ngoài khơi Kanagawa</strong> của <strong>Hokusai</strong> về sau truyền cảm hứng cho phái Ấn tượng.</li>
</ul>
<h3>Mỹ thuật truyền thống Việt Nam</h3>
<p>Tranh dân gian <strong>Đông Hồ</strong> và <strong>Hàng Trống</strong>, chạm khắc gỗ ở chùa và <em>đình</em>, gốm (Bát Tràng), và nghề bản địa <strong>sơn mài</strong>.</p>
<h3>Mỹ thuật hiện đại Việt Nam</h3>
<p><strong>Trường Mỹ thuật Đông Dương</strong> (Hà Nội, 1925) hoà kỹ thuật phương Tây với đề tài và chất liệu Việt: <strong>Tô Ngọc Vân</strong> (<strong>Thiếu nữ bên hoa huệ</strong>), <strong>Nguyễn Phan Chánh</strong> (<em>tranh lụa</em>), <strong>Nguyễn Gia Trí</strong> (sơn mài) và <strong>Bùi Xuân Phái</strong> (phố cổ Hà Nội, <em>Phố Phái</em>).</p>
<div class="callout"><span class="badge">Ý chính</span> Mực và nét gánh vác mỹ thuật Đông Á; ở Việt Nam, tranh dân gian, lụa và sơn mài cho trường phái hiện đại một tiếng nói riêng.</div>`,
  ]]);

const c8q = quiz('hoa102-quiz-8', 'Quiz 8 — Art of Asia & Vietnam|||Quiz 8 — Mỹ thuật châu Á & Việt Nam', [
  { id: 'q1', question: 'Tranh "Sóng lừng ngoài khơi Kanagawa" theo lối khắc gỗ ukiyo-e là của?|||"The Great Wave off Kanagawa" (ukiyo-e woodblock) is by?', options: ['Hokusai', 'Tô Ngọc Vân|||Tô Ngọc Vân', 'Warhol', 'Monet'], correctIndex: 0, explanation: 'Katsushika Hokusai, tranh khắc gỗ ukiyo-e Nhật Bản.' },
  { id: 'q2', question: 'Dòng tranh dân gian Việt Nam nổi tiếng ở Bắc Ninh là?|||A famous Vietnamese folk woodblock print tradition is?', options: ['Đông Hồ|||Đông Hồ', 'Ukiyo-e', 'Pop Art', 'Rococo'], correctIndex: 0, explanation: 'Tranh dân gian Đông Hồ (cùng Hàng Trống).' },
  { id: 'q3', question: 'Trường đặt nền cho mỹ thuật hiện đại Việt Nam (Hà Nội, 1925) là?|||The school that founded modern Vietnamese art (Hanoi, 1925)?', options: ['Trường Mỹ thuật Đông Dương|||École des Beaux-Arts de l Indochine', 'Bauhaus', 'De Stijl', 'École de Paris|||École de Paris'], correctIndex: 0, explanation: 'Trường Mỹ thuật Đông Dương đào tạo Tô Ngọc Vân, Nguyễn Phan Chánh, Bùi Xuân Phái...' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'HOA102',
    slug: 'hoa102-art-history',
    title: 'Art History',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/HOA102.webp',
    shortDescription: 'A journey through world art — prehistoric caves, Egypt, Greece & Rome, the Middle Ages, Renaissance, Baroque, the 19th century, modern movements, and the art of Asia & Vietnam. Bilingual, with real artists, works & quizzes.|||Hành trình qua mỹ thuật thế giới — hang tiền sử, Ai Cập, Hy Lạp & La Mã, Trung cổ, Phục Hưng, Baroque, thế kỷ 19, các trào lưu hiện đại và mỹ thuật châu Á & Việt Nam. Song ngữ, có nghệ sĩ, tác phẩm thật & quiz.',
    description: 'Môn <strong>HOA102 — Art History (Lịch sử Mỹ thuật)</strong> thuộc ngành Thiết kế mỹ thuật số, kỳ 2, đi theo dòng thời gian qua <strong>8 chương</strong>: mỹ thuật <strong>cổ đại</strong> (tiền sử, Ai Cập, Hy Lạp, La Mã) → <strong>Trung cổ</strong> (Byzantine, Gothic) → <strong>Phục Hưng</strong> (phối cảnh, Leonardo, Michelangelo, Raphael) → <strong>Baroque &amp; Rococo</strong> → <strong>thế kỷ 19</strong> (Tân cổ điển, Lãng mạn, Hiện thực, Ấn tượng) → <strong>hiện đại đầu thế kỷ 20</strong> (Lập thể, Siêu thực, Picasso) → <strong>hiện đại &amp; đương đại</strong> (Pop Art, Warhol) → <strong>mỹ thuật châu Á &amp; Việt Nam</strong>. Bám sách chuẩn quốc tế (Gardner, Gombrich, Janson), song ngữ, có tác phẩm và nghệ sĩ thật, quiz mỗi chương.',
    whatYouLearn: 'Đọc một tác phẩm (đề tài, phong cách, chất liệu, bối cảnh); nhận diện các thời kỳ và trào lưu lớn của mỹ thuật thế giới; đặc trưng phong cách của mỗi thời; nghệ sĩ và tác phẩm cột mốc (Leonardo, Michelangelo, Caravaggio, Monet, Van Gogh, Picasso, Warhol...); và mỹ thuật châu Á cùng mỹ thuật truyền thống, hiện đại Việt Nam.',
    requirements: 'Không cần kiến thức nền. Nên xem tác phẩm độ phân giải cao trên Google Arts & Culture khi học từng chương.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chuẩn (Gardner, Gombrich, Janson), Khan Academy, Google Arts & Culture, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Lịch sử mỹ thuật là gì, cách đọc tác phẩm, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Mỹ thuật cổ đại|||Chapter 1 — Ancient art', description: 'Tiền sử, Ai Cập, Lưỡng Hà, Hy Lạp, La Mã.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mỹ thuật Trung cổ|||Chapter 2 — Medieval art', description: 'Byzantine, Gothic, nghệ thuật Kitô giáo.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phục Hưng|||Chapter 3 — The Renaissance', description: 'Phối cảnh, nhân văn, Leonardo/Michelangelo/Raphael.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Baroque & Rococo|||Chapter 4 — Baroque & Rococo', description: 'Caravaggio, Rembrandt, ánh sáng, kịch tính; Rococo.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thế kỷ 19|||Chapter 5 — The 19th century', description: 'Tân cổ điển, Lãng mạn, Hiện thực, Ấn tượng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Hiện đại đầu thế kỷ 20|||Chapter 6 — Early modern art', description: 'Hậu ấn tượng, Lập thể, Biểu hiện, Siêu thực, Picasso.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hiện đại & đương đại|||Chapter 7 — Modern & contemporary', description: 'Trừu tượng, Pop Art, Warhol, đương đại.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Mỹ thuật châu Á & Việt Nam|||Chapter 8 — Art of Asia & Vietnam', description: 'Đông Á; mỹ thuật truyền thống & hiện đại Việt Nam.', lessons: [c8, c8q] },
  ],
};
