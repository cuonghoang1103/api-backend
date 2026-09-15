/**
 * RES223 — Bar Operations. Giáo trình tham khảo (trích dẫn, KHÔNG upload PDF):
 * "The Bar and Beverage Book" (Katsigris & Thomas); "Bartending & Mixology"
 * (BarSmarts); tiêu chuẩn IBA (International Bartenders Association).
 * 8 chương: tổ chức quầy bar; thiết bị & mise en place; đồ uống có cồn;
 * cocktail & mixology (IBA); đồ uống không cồn & cà phê; phục vụ & phục vụ
 * có trách nhiệm; tồn kho & chi phí đồ uống; vệ sinh an toàn & quản trị bar.
 * Song ngữ + công thức pha chế + bảng chi phí. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('res223-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo, tiêu chuẩn IBA, tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">RES223 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Bar Operations</strong> — bar organization, equipment, beverage knowledge, cocktail mixology, service and cost control — in one place. The full official slides live on <strong>FLM</strong>; below are widely used reference books and free, legal resources.</p>
<h3>📘 Reference textbooks</h3>
<ul>
<li><em>The Bar and Beverage Book</em> — Katsigris &amp; Thomas — the standard US hospitality-school text on bar setup, spirits, wine, beer and beverage cost control.</li>
<li><em>Bartending &amp; Mixology</em> — BarSmarts — industry certification curriculum covering spirits categories and classic cocktail technique.</li>
</ul>
<h3>🏆 Industry standard</h3>
<ul>
<li><a href="https://iba-world.com/" target="_blank" rel="noopener">IBA — International Bartenders Association</a> — official list of world cocktails and standard recipes used in this course.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://iba-world.com/cocktails/" target="_blank" rel="noopener">IBA Official Cocktails</a> — recipes, glassware and garnish for every IBA-listed drink.</li>
<li><a href="https://www.diffordsguide.com/" target="_blank" rel="noopener">Difford's Guide</a> — cocktail recipes, spirit reviews and bartending technique.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@BestBartenderStudio" target="_blank" rel="noopener">Best Bartender / Studio Cocktails</a> — technique breakdowns for build/stir/shake/blend.</li>
<li><a href="https://www.youtube.com/@ArtOfDrink" target="_blank" rel="noopener">Steve the Bartender / Art of Drink</a> — classic recipes and bar theory explained simply.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.diffordsguide.com/cocktails" target="_blank" rel="noopener">Difford's Guide cocktail database</a> — searchable by base spirit or technique.</li>
<li>Jigger/measuring app or a printed <strong>pour chart</strong> — practice accurate measuring before free-pouring.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — bar organization, equipment names, mise en place, standard measures.</li>
<li><strong>Beverage knowledge</strong> — six base spirits, wine styles, beer styles, liqueurs.</li>
<li><strong>Technique</strong> — build/stir/shake/blend, memorize IBA recipes, practice ratios.</li>
<li><strong>Job-ready</strong> — responsible service rules, pour cost math, HACCP basics.</li>
</ol></div>`,
    `<span class="eyebrow">RES223 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Nghiệp vụ Quầy Bar</strong> — tổ chức quầy bar, thiết bị, kiến thức đồ uống, kỹ thuật pha chế và kiểm soát chi phí — gom về một chỗ. Slide chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là sách tham khảo phổ biến và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình tham khảo</h3>
<ul>
<li><em>The Bar and Beverage Book</em> — Katsigris &amp; Thomas — giáo trình chuẩn của các trường du lịch-khách sạn Mỹ về bố trí quầy bar, rượu mạnh, vang, bia và kiểm soát chi phí đồ uống.</li>
<li><em>Bartending &amp; Mixology</em> — BarSmarts — khung chứng chỉ ngành, bao quát các nhóm rượu mạnh và kỹ thuật pha chế cổ điển.</li>
</ul>
<h3>🏆 Tiêu chuẩn ngành</h3>
<ul>
<li><a href="https://iba-world.com/" target="_blank" rel="noopener">IBA — International Bartenders Association</a> — danh sách cocktail thế giới chính thức và công thức chuẩn dùng trong môn này.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://iba-world.com/cocktails/" target="_blank" rel="noopener">IBA Official Cocktails</a> — công thức, ly và garnish cho mọi thức uống trong danh sách IBA.</li>
<li><a href="https://www.diffordsguide.com/" target="_blank" rel="noopener">Difford's Guide</a> — công thức cocktail, đánh giá rượu và kỹ thuật pha chế.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BestBartenderStudio" target="_blank" rel="noopener">Best Bartender / Studio Cocktails</a> — phân tích kỹ thuật build/stir/shake/blend.</li>
<li><a href="https://www.youtube.com/@ArtOfDrink" target="_blank" rel="noopener">Steve the Bartender / Art of Drink</a> — công thức cổ điển và lý thuyết quầy bar giảng dễ hiểu.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.diffordsguide.com/cocktails" target="_blank" rel="noopener">Cơ sở dữ liệu cocktail Difford's Guide</a> — tra theo rượu nền hoặc kỹ thuật.</li>
<li>App đo dung tích hoặc <strong>bảng định lượng (pour chart)</strong> in giấy — luyện đo chính xác trước khi rót tự do.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — tổ chức quầy bar, tên thiết bị, mise en place, đơn vị đo chuẩn.</li>
<li><strong>Kiến thức đồ uống</strong> — sáu rượu mạnh nền, dòng vang, dòng bia, liqueur.</li>
<li><strong>Kỹ thuật</strong> — build/stir/shake/blend, học công thức IBA, luyện tỉ lệ.</li>
<li><strong>Sẵn sàng đi làm</strong> — quy tắc phục vụ có trách nhiệm, toán pour cost, nền HACCP.</li>
</ol></div>`,
  ]]);

const intro = doc('res223-0-1-overview', 'Course overview: Bar Operations|||Tổng quan: Nghiệp vụ Quầy Bar',
  'Ngành bar & đồ uống làm gì; lộ trình môn: tổ chức quầy bar → thiết bị → kiến thức đồ uống → mixology → không cồn/cà phê → phục vụ → chi phí → vệ sinh & quản trị.',
  [[
    `<span class="eyebrow">RES223 · Lesson 0.1 · Overview</span>
<h2>Bar Operations</h2>
<p class="lead">This course teaches how a <strong>bar actually runs</strong> inside a hotel, restaurant or standalone venue — the knowledge and skills a Food &amp; Beverage / Hospitality Management graduate needs to work behind, or manage, a bar. You will learn the industry structure, tools, beverage categories, cocktail technique, guest service and cost control that keep a bar profitable and safe.</p>
<h3>Why bar operations matters in hospitality</h3>
<ul>
<li>Beverage sales carry far higher margins than food — bars are a major profit center in hotels and restaurants.</li>
<li>A badly run bar (over-pouring, waste, poor service) silently drains profit even when the venue looks busy.</li>
<li>Responsible service protects guests, staff and the venue's license.</li>
</ul>
<h3>Roadmap</h3>
<p>Bar industry overview &amp; organization → equipment &amp; mise en place → alcoholic beverage knowledge (spirits/wine/beer/liqueur) → cocktail technique &amp; mixology (IBA standards) → non-alcoholic drinks &amp; coffee → guest service &amp; responsible service → inventory &amp; beverage cost → food safety &amp; bar management. Bilingual, with recipe cards, cost formulas and quizzes.</p>`,
    `<span class="eyebrow">RES223 · Bài 0.1 · Tổng quan</span>
<h2>Nghiệp vụ Quầy Bar</h2>
<p class="lead">Môn này dạy một quầy bar <strong>vận hành thực tế</strong> ra sao trong khách sạn, nhà hàng hoặc quán độc lập — kiến thức và kỹ năng mà một sinh viên Quản trị Nhà hàng-Khách sạn cần để làm việc tại quầy bar, hoặc quản lý nó. Bạn sẽ học cấu trúc ngành, dụng cụ, các nhóm đồ uống, kỹ thuật pha chế, phục vụ khách và kiểm soát chi phí — những thứ giữ quầy bar có lãi và an toàn.</p>
<h3>Vì sao nghiệp vụ quầy bar quan trọng trong ngành khách sạn</h3>
<ul>
<li>Đồ uống có tỉ suất lợi nhuận cao hơn hẳn thức ăn — quầy bar là trung tâm lợi nhuận lớn của khách sạn và nhà hàng.</li>
<li>Một quầy bar vận hành kém (rót dư, hao hụt, phục vụ tệ) âm thầm mất lợi nhuận dù quán vẫn trông đông khách.</li>
<li>Phục vụ có trách nhiệm bảo vệ khách, nhân viên và giấy phép kinh doanh của quán.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tổng quan ngành bar &amp; tổ chức quầy bar → thiết bị &amp; mise en place → kiến thức đồ uống có cồn (rượu mạnh/vang/bia/liqueur) → kỹ thuật pha chế &amp; mixology (chuẩn IBA) → đồ uống không cồn &amp; cà phê → phục vụ khách &amp; phục vụ có trách nhiệm → tồn kho &amp; chi phí đồ uống → vệ sinh an toàn &amp; quản trị quầy bar. Song ngữ, có thẻ công thức, công thức tính chi phí và quiz.</p>`,
  ]]);

const c1 = doc('res223-1-1-industry-organization', '1.1 — Bar industry overview & bar organization|||1.1 — Tổng quan ngành bar & tổ chức quầy bar',
  'Các phân khúc ngành bar & đồ uống (on-premise/off-premise/banquet); sơ đồ tổ chức và vai trò từng vị trí trong quầy bar.',
  [[
    `<span class="eyebrow">RES223 · Chapter 1 · Lesson 1.1</span>
<h2>Bar industry overview &amp; bar organization</h2>
<h3>Segments of the bar &amp; beverage industry</h3>
<ul>
<li><strong>On-premise</strong> — hotel bars, restaurants, nightclubs, lounges: drinks are consumed at the venue.</li>
<li><strong>Off-premise</strong> — liquor stores, retail: bottles are sold to take away.</li>
<li><strong>Banquet &amp; catering bars</strong> — weddings, conferences, events: temporary bars set up for a set number of guests.</li>
</ul>
<h3>Bar organization chart</h3>
<pre><code>Beverage Manager
  -> Bar Manager
       -> Head Bartender (Bar Captain)
            -> Bartender
                 -> Barback
                      -> Bar Runner / Server
</code></pre>
<ul>
<li><strong>Beverage Manager</strong> — oversees all beverage outlets of a property, purchasing and overall cost control.</li>
<li><strong>Bar Manager</strong> — runs a single bar, schedules staff, controls stock and orders.</li>
<li><strong>Head Bartender / Bar Captain</strong> — leads the shift, trains the team, designs the drinks menu.</li>
<li><strong>Bartender</strong> — mixes and serves drinks, handles cash/POS, talks with guests.</li>
<li><strong>Barback</strong> — restocks ice, garnish, glassware and bottles; supports the bartender during service.</li>
<li><strong>Bar Runner / Server</strong> — carries drinks from the bar to tables in a restaurant/lounge setup.</li>
</ul>
<div class="callout"><span class="badge">Why the hierarchy matters</span> Knowing who does what keeps service fast during a rush and makes clear who is accountable for cash, stock and quality.</div>`,
    `<span class="eyebrow">RES223 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan ngành bar &amp; tổ chức quầy bar</h2>
<h3>Các phân khúc ngành bar &amp; đồ uống</h3>
<ul>
<li><strong>On-premise (uống tại chỗ)</strong> — bar khách sạn, nhà hàng, club, lounge: khách uống ngay tại quán.</li>
<li><strong>Off-premise (mua mang đi)</strong> — cửa hàng rượu, bán lẻ: bán chai để khách mang về.</li>
<li><strong>Bar tiệc &amp; sự kiện (banquet)</strong> — tiệc cưới, hội nghị, sự kiện: bar dựng tạm cho một số lượng khách xác định.</li>
</ul>
<h3>Sơ đồ tổ chức quầy bar</h3>
<pre><code>Beverage Manager (Quản lý Đồ uống)
  -> Bar Manager (Quản lý Quầy bar)
       -> Head Bartender (Trưởng ca / Bar Captain)
            -> Bartender (Nhân viên pha chế)
                 -> Barback (Phụ bar)
                      -> Bar Runner / Server (Chạy bàn)
</code></pre>
<ul>
<li><strong>Beverage Manager</strong> — quản lý toàn bộ các quầy đồ uống của cơ sở, thu mua và kiểm soát chi phí tổng.</li>
<li><strong>Bar Manager</strong> — vận hành một quầy bar cụ thể, xếp ca, kiểm soát tồn kho và đặt hàng.</li>
<li><strong>Head Bartender / Bar Captain</strong> — dẫn ca làm việc, đào tạo đội, thiết kế menu đồ uống.</li>
<li><strong>Bartender</strong> — pha chế và phục vụ đồ uống, xử lý tiền/POS, giao tiếp với khách.</li>
<li><strong>Barback</strong> — bổ sung đá, garnish, ly và chai rượu; hỗ trợ bartender trong giờ cao điểm.</li>
<li><strong>Bar Runner / Server</strong> — mang đồ uống từ quầy ra bàn trong mô hình nhà hàng/lounge.</li>
</ul>
<div class="callout"><span class="badge">Vì sao sơ đồ này quan trọng</span> Biết rõ ai làm gì giúp phục vụ nhanh trong giờ đông khách và xác định rõ ai chịu trách nhiệm về tiền, hàng và chất lượng.</div>`,
  ]]);

const c1q = quiz('res223-quiz-1', 'Quiz 1 — Industry & organization|||Quiz 1 — Ngành & tổ chức', [
  { id: 'q1', question: 'Bar dựng tạm phục vụ tiệc cưới, hội nghị thuộc phân khúc nào?', options: ['On-premise', 'Off-premise', 'Banquet & catering', 'Retail'], correctIndex: 2, explanation: 'Banquet & catering bar là bar tạm dựng cho sự kiện có số khách xác định.' },
  { id: 'q2', question: 'Trong sơ đồ tổ chức quầy bar, ai trực tiếp bổ sung đá, garnish, ly cho bartender?', options: ['Beverage Manager', 'Head Bartender', 'Barback', 'Bar Runner'], correctIndex: 2, explanation: 'Barback (phụ bar) lo hậu cần: đá, garnish, ly, chai — hỗ trợ bartender trong ca.' },
  { id: 'q3', question: 'Vị trí nào thiết kế menu đồ uống và dẫn ca làm việc?', options: ['Bartender', 'Head Bartender (Bar Captain)', 'Barback', 'Bar Runner'], correctIndex: 1, explanation: 'Head Bartender/Bar Captain dẫn ca, đào tạo đội và thiết kế menu.' },
]);

const c2 = doc('res223-2-1-equipment-mise-en-place', '2.1 — Bar equipment, tools & layout|||2.1 — Thiết bị, dụng cụ & bố trí quầy bar',
  'Dụng cụ pha chế chính (shaker, jigger, strainer, muddler); ly theo loại thức uống; bố trí quầy (back bar, well) và mise en place trước ca.',
  [[
    `<span class="eyebrow">RES223 · Chapter 2 · Lesson 2.1</span>
<h2>Bar equipment, tools &amp; layout</h2>
<h3>Core bartending tools</h3>
<ul>
<li><strong>Shaker</strong> — Boston shaker (metal tin + mixing glass) or cobbler shaker (built-in strainer &amp; cap) — mixes and chills a drink by agitation.</li>
<li><strong>Jigger</strong> — a two-sided measuring cup (e.g. 30ml/45ml) — the tool for accurate, consistent pours.</li>
<li><strong>Strainer</strong> — Hawthorne (spring coil, sits on a shaker), Julep (holed, for stirred drinks) and fine strainer (mesh, catches small ice/pulp — "double straining").</li>
<li><strong>Bar spoon</strong> — long twisted-handle spoon for stirring and layering.</li>
<li><strong>Muddler</strong> — crushes herbs/fruit to release flavor and oils (e.g. mint in a Mojito).</li>
<li><strong>Speed pourer &amp; ice tools</strong> — pourer spouts control flow from the bottle; ice scoop/tongs keep hands off ice for hygiene.</li>
</ul>
<h3>Glassware by drink category</h3>
<pre><code>Highball glass    -> long mixed drinks (Mojito, Gin &amp; Tonic)
Rocks / Old Fashioned glass -> spirit-forward drinks on ice
Coupe / Martini glass -> up (chilled, no ice) drinks
Flute       -> sparkling wine / Champagne cocktails
Wine glass  -> still wine
Mug / Irish coffee glass -> hot drinks
</code></pre>
<h3>Bar layout &amp; mise en place</h3>
<p>The <strong>front bar</strong> (where guests sit) holds the <strong>speed rail</strong> — the most-used bottles within arm's reach. The <strong>back bar</strong> displays premium bottles and glassware. <strong>Mise en place</strong> is pre-shift prep: fill ice bins, cut and stock garnish, squeeze juices, batch syrups, chill glassware, and check every bottle on the speed rail before doors open.</p>
<div class="callout"><span class="badge">Why it matters</span> Good mise en place is what lets a bartender make drinks fast and consistently once the rush starts — there is no time to prep mid-service.</div>`,
    `<span class="eyebrow">RES223 · Chương 2 · Bài 2.1</span>
<h2>Thiết bị, dụng cụ &amp; bố trí quầy bar</h2>
<h3>Dụng cụ pha chế cốt lõi</h3>
<ul>
<li><strong>Shaker (bình lắc)</strong> — Boston shaker (bình kim loại + cốc mixing glass) hoặc cobbler shaker (có nắp lọc sẵn) — trộn và làm lạnh đồ uống bằng cách lắc.</li>
<li><strong>Jigger (cốc đo)</strong> — cốc đo hai đầu (vd 30ml/45ml) — dụng cụ để rót chính xác, nhất quán.</li>
<li><strong>Strainer (lọc)</strong> — Hawthorne (lò xo, gắn lên shaker), Julep (có lỗ, dùng cho đồ uống khuấy) và fine strainer (lưới mịn, lọc vụn đá/xác quả — "double straining").</li>
<li><strong>Bar spoon (thìa bar)</strong> — thìa dài, cán xoắn, dùng để khuấy và rót phân lớp (layer).</li>
<li><strong>Muddler (chày dập)</strong> — dập lá thảo mộc/trái cây để tách hương và dầu (vd bạc hà trong Mojito).</li>
<li><strong>Speed pourer &amp; dụng cụ đá</strong> — vòi rót gắn chai kiểm soát tốc độ dòng chảy; xẻng/kẹp đá giữ tay không chạm đá vì lý do vệ sinh.</li>
</ul>
<h3>Ly theo loại thức uống</h3>
<pre><code>Highball glass       -> đồ uống pha dài (Mojito, Gin &amp; Tonic)
Rocks / Old Fashioned -> đồ uống nặng rượu, có đá
Coupe / Martini glass -> đồ uống "up" (lạnh, không đá)
Flute                -> vang sủi / Champagne cocktail
Wine glass           -> vang thường
Mug / Irish coffee   -> đồ uống nóng
</code></pre>
<h3>Bố trí quầy bar &amp; mise en place</h3>
<p><strong>Front bar</strong> (nơi khách ngồi) chứa <strong>speed rail</strong> — các chai dùng nhiều nhất, để trong tầm tay. <strong>Back bar</strong> trưng bày chai cao cấp và ly. <strong>Mise en place</strong> là chuẩn bị trước ca: đổ đầy thùng đá, cắt và trữ garnish, vắt nước quả, pha sẵn syrup theo lô, làm lạnh ly, và kiểm tra từng chai trên speed rail trước khi mở cửa.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Mise en place tốt là thứ giúp bartender pha nhanh và ổn định khi giờ cao điểm bắt đầu — không có thời gian chuẩn bị giữa ca.</div>`,
  ]]);

const c2q = quiz('res223-quiz-2', 'Quiz 2 — Equipment & layout|||Quiz 2 — Thiết bị & bố trí', [
  { id: 'q1', question: 'Dụng cụ nào dùng để đo chính xác lượng rượu khi pha chế?', options: ['Muddler', 'Jigger', 'Bar spoon', 'Fine strainer'], correctIndex: 1, explanation: 'Jigger là cốc đo hai đầu, đảm bảo rót chính xác và nhất quán.' },
  { id: 'q2', question: 'Speed rail nằm ở đâu và chứa gì?', options: ['Back bar, chai cao cấp trưng bày', 'Front bar, chai dùng nhiều nhất trong tầm tay', 'Kho lạnh, đá viên', 'Bàn khách, ly sạch'], correctIndex: 1, explanation: 'Speed rail ở front bar, chứa các chai dùng thường xuyên để bartender lấy nhanh.' },
  { id: 'q3', question: 'Mise en place trong quầy bar nghĩa là gì?', options: ['Rửa ly sau ca', 'Chuẩn bị trước ca: đá, garnish, syrup, ly lạnh', 'Kiểm kê tồn kho cuối tháng', 'Đào tạo nhân viên mới'], correctIndex: 1, explanation: 'Mise en place là mọi công việc chuẩn bị trước khi mở ca để phục vụ nhanh khi đông khách.' },
]);

const c3 = doc('res223-3-1-alcoholic-beverages', '3.1 — Alcoholic beverage knowledge|||3.1 — Kiến thức đồ uống có cồn',
  'Sáu rượu mạnh nền (vodka/gin/rum/tequila/whiskey/brandy); vang (màu, còn/sủi bọt, gia cường); dòng bia (ale/lager); liqueur; khái niệm ABV.',
  [[
    `<span class="eyebrow">RES223 · Chapter 3 · Lesson 3.1</span>
<h2>Alcoholic beverage knowledge</h2>
<h3>The six base spirits</h3>
<ul>
<li><strong>Vodka</strong> — neutral grain/potato spirit, minimal flavor, the base of Martini, Cosmopolitan.</li>
<li><strong>Gin</strong> — neutral spirit redistilled with botanicals, juniper-forward — the base of Martini, Gin &amp; Tonic.</li>
<li><strong>Rum</strong> — distilled from sugarcane/molasses; white (Mojito, Daiquiri), gold/dark (Cuba Libre, tiki drinks).</li>
<li><strong>Tequila</strong> — distilled from Blue Agave, from Mexico; Blanco/Reposado/Añejo — the base of Margarita.</li>
<li><strong>Whiskey</strong> — distilled from grain, aged in wood; Bourbon, Rye, Scotch — the base of Old Fashioned, Whiskey Sour.</li>
<li><strong>Brandy</strong> — distilled from wine/fruit; Cognac is its most famous style — sipped neat or in classics like the Sidecar.</li>
</ul>
<h3>Wine</h3>
<p>Still (red/white/rosé) vs sparkling (Champagne method); dry vs sweet; <strong>fortified wine</strong> (Port, Sherry, Vermouth) has spirit added, raising ABV and shelf life — Vermouth is essential to Martini and Manhattan.</p>
<h3>Beer</h3>
<p>Two main families by fermentation: <strong>ale</strong> (top-fermented, warmer, fruitier — Pale Ale, Stout, Wheat) and <strong>lager</strong> (bottom-fermented, cooler, crisper — Pilsner, most mass-market beers).</p>
<h3>Liqueurs</h3>
<p>Sweetened, flavored spirits with lower ABV — e.g. Triple Sec (orange), Amaretto (almond), Kahlúa (coffee), Baileys (cream) — used to add flavor and sweetness in cocktails, rarely as the base.</p>
<pre><code>ABV = Alcohol By Volume (% alcohol in the total liquid)
 e.g. a spirit at 40% ABV: 100ml contains 40ml pure alcohol
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> A bartender must recognize every category by sight/smell/taste to build drinks correctly and answer guest questions.</div>`,
    `<span class="eyebrow">RES223 · Chương 3 · Bài 3.1</span>
<h2>Kiến thức đồ uống có cồn</h2>
<h3>Sáu rượu mạnh nền</h3>
<ul>
<li><strong>Vodka</strong> — rượu trung tính từ ngũ cốc/khoai tây, ít mùi vị, làm nền cho Martini, Cosmopolitan.</li>
<li><strong>Gin</strong> — rượu trung tính chưng lại với thảo mộc, nổi bật hương juniper — nền của Martini, Gin &amp; Tonic.</li>
<li><strong>Rum</strong> — chưng cất từ mía/mật mía; rum trắng (Mojito, Daiquiri), rum vàng/đen (Cuba Libre, đồ uống tiki).</li>
<li><strong>Tequila</strong> — chưng cất từ cây Blue Agave, xuất xứ Mexico; Blanco/Reposado/Añejo — nền của Margarita.</li>
<li><strong>Whiskey</strong> — chưng cất từ ngũ cốc, ủ gỗ; Bourbon, Rye, Scotch — nền của Old Fashioned, Whiskey Sour.</li>
<li><strong>Brandy</strong> — chưng cất từ vang/trái cây; Cognac là dòng nổi tiếng nhất — uống nguyên chất hoặc trong cocktail cổ điển như Sidecar.</li>
</ul>
<h3>Vang</h3>
<p>Vang thường (đỏ/trắng/hồng) và vang sủi (theo phương pháp Champagne); khô vs ngọt; <strong>vang gia cường (fortified)</strong> (Port, Sherry, Vermouth) được thêm rượu mạnh, tăng độ cồn và thời gian bảo quản — Vermouth là thành phần không thể thiếu của Martini và Manhattan.</p>
<h3>Bia</h3>
<p>Hai dòng chính theo cách lên men: <strong>ale</strong> (lên men nổi, ấm hơn, hương trái cây — Pale Ale, Stout, Wheat) và <strong>lager</strong> (lên men chìm, lạnh hơn, sạch vị — Pilsner, phần lớn bia phổ thông).</p>
<h3>Liqueur</h3>
<p>Rượu có hương và đường, độ cồn thấp hơn — vd Triple Sec (cam), Amaretto (hạnh nhân), Kahlúa (cà phê), Baileys (kem) — dùng thêm hương và độ ngọt cho cocktail, ít khi làm nền chính.</p>
<pre><code>ABV = Alcohol By Volume (% cồn trong tổng chất lỏng)
 vd rượu 40% ABV: 100ml chứa 40ml cồn nguyên chất
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Bartender phải nhận diện từng nhóm qua nhìn/mùi/vị để pha đúng công thức và trả lời câu hỏi của khách.</div>`,
  ]]);

const c3q = quiz('res223-quiz-3', 'Quiz 3 — Alcoholic beverages|||Quiz 3 — Đồ uống có cồn', [
  { id: 'q1', question: 'Rượu mạnh nào chưng cất từ cây Blue Agave và là nền của Margarita?', options: ['Rum', 'Gin', 'Tequila', 'Brandy'], correctIndex: 2, explanation: 'Tequila chưng cất từ Blue Agave, xuất xứ Mexico, làm nền cho Margarita.' },
  { id: 'q2', question: 'Vermouth thuộc loại đồ uống nào?', options: ['Bia lager', 'Vang gia cường (fortified wine)', 'Liqueur cà phê', 'Rượu mạnh nền'], correctIndex: 1, explanation: 'Vermouth là vang gia cường, được thêm rượu mạnh, dùng trong Martini/Manhattan.' },
  { id: 'q3', question: 'ABV là viết tắt của gì?', options: ['Alcohol By Volume — % cồn trong chất lỏng', 'Average Beverage Value', 'Alcohol Batch Volume', 'Aged Barrel Vintage'], correctIndex: 0, explanation: 'ABV = Alcohol By Volume, tỉ lệ phần trăm cồn trong tổng thể tích.' },
]);

const c4 = doc('res223-4-1-cocktail-mixology', '4.1 — Cocktail techniques & mixology (IBA)|||4.1 — Kỹ thuật pha chế cocktail & mixology (IBA)',
  'Bốn kỹ thuật cơ bản (build/stir/shake/blend) và công thức chuẩn IBA cho Dry Martini, Old Fashioned, Margarita, Mojito.',
  [[
    `<span class="eyebrow">RES223 · Chapter 4 · Lesson 4.1</span>
<h2>Cocktail techniques &amp; mixology (IBA)</h2>
<h3>The four core techniques</h3>
<ul>
<li><strong>Build</strong> — ingredients poured directly into the serving glass, often over ice (e.g. Old Fashioned, Mojito).</li>
<li><strong>Stir</strong> — spirit-forward, all-alcohol ingredients stirred with ice in a mixing glass, then strained "up" — keeps the drink silky, not aerated (e.g. Martini, Manhattan).</li>
<li><strong>Shake</strong> — ingredients with juice, dairy, egg or syrup are shaken hard with ice to combine and chill fast, then strained (e.g. Daiquiri, Whiskey Sour, Margarita).</li>
<li><strong>Blend</strong> — ingredients blended with crushed ice for a frozen, slushy texture (e.g. frozen Daiquiri, Piña Colada).</li>
</ul>
<h3>IBA standard recipes</h3>
<pre><code>DRY MARTINI (Stirred)
 60 ml Gin
 10 ml Dry Vermouth
 Stir with ice, strain into a chilled Martini glass.
 Garnish: olive or lemon twist.

OLD FASHIONED (Built)
 45 ml Bourbon or Rye Whiskey
 2 dashes Angostura bitters
 1 sugar cube (or 6 ml simple syrup)
 Splash of soda water
 Build over ice in a rocks glass, stir gently.
 Garnish: orange twist.

MARGARITA (Shaken)
 35 ml Tequila
 20 ml Triple Sec
 15 ml Lime juice
 Shake with ice, strain into a chilled coupe/margarita glass.
 Garnish: lime wheel; salt rim optional.

MOJITO (Built)
 45 ml White rum
 20 ml Lime juice
 2 tsp sugar
 6-8 mint leaves
 Top with soda water
 Muddle mint gently, build over crushed ice in a highball glass.
 Garnish: mint sprig.
</code></pre>
<div class="callout"><span class="badge">Why the ratio matters</span> A recipe is a ratio, not a fixed volume — memorize the proportion of spirit : sour : sweet so you can scale a drink up or down and taste-correct it.</div>`,
    `<span class="eyebrow">RES223 · Chương 4 · Bài 4.1</span>
<h2>Kỹ thuật pha chế cocktail &amp; mixology (IBA)</h2>
<h3>Bốn kỹ thuật cơ bản</h3>
<ul>
<li><strong>Build (rót trực tiếp)</strong> — rót nguyên liệu trực tiếp vào ly phục vụ, thường trên đá (vd Old Fashioned, Mojito).</li>
<li><strong>Stir (khuấy)</strong> — nguyên liệu toàn rượu mạnh, khuấy với đá trong mixing glass rồi lọc rót ra ly "up" — giữ đồ uống mượt, không bị sục khí (vd Martini, Manhattan).</li>
<li><strong>Shake (lắc)</strong> — nguyên liệu có nước quả, sữa, trứng hoặc syrup được lắc mạnh với đá để hòa trộn và làm lạnh nhanh, sau đó lọc rót ra (vd Daiquiri, Whiskey Sour, Margarita).</li>
<li><strong>Blend (xay)</strong> — nguyên liệu xay cùng đá bào cho kết cấu đá tuyết mịn (vd Daiquiri đá xay, Piña Colada).</li>
</ul>
<h3>Công thức chuẩn IBA</h3>
<pre><code>DRY MARTINI (Khuấy)
 60 ml Gin
 10 ml Dry Vermouth
 Khuấy với đá, lọc rót vào ly Martini đã làm lạnh.
 Garnish: olive hoặc vỏ chanh xoắn.

OLD FASHIONED (Rót trực tiếp)
 45 ml Bourbon hoặc Rye Whiskey
 2 dash bitters Angostura
 1 viên đường (hoặc 6 ml syrup đường)
 Một ít soda
 Rót trực tiếp trên đá trong ly rocks, khuấy nhẹ.
 Garnish: vỏ cam xoắn.

MARGARITA (Lắc)
 35 ml Tequila
 20 ml Triple Sec
 15 ml Nước cốt chanh
 Lắc với đá, lọc rót vào ly coupe/margarita đã làm lạnh.
 Garnish: khoanh chanh; viền muối (tùy chọn).

MOJITO (Rót trực tiếp)
 45 ml Rum trắng
 20 ml Nước cốt chanh
 2 thìa cà phê đường
 6-8 lá bạc hà
 Thêm soda đầy ly
 Dập nhẹ bạc hà, rót trực tiếp trên đá bào trong ly highball.
 Garnish: nhánh bạc hà.
</code></pre>
<div class="callout"><span class="badge">Vì sao tỉ lệ quan trọng</span> Công thức là một tỉ lệ, không phải thể tích cố định — nhớ tỉ lệ rượu : chua : ngọt để tăng/giảm lượng và nêm nếm cho khớp.</div>`,
  ]]);

const c4q = quiz('res223-quiz-4', 'Quiz 4 — Cocktail & mixology|||Quiz 4 — Cocktail & mixology', [
  { id: 'q1', question: 'Kỹ thuật nào dùng cho đồ uống toàn rượu mạnh, cần giữ mượt không sục khí (vd Martini)?', options: ['Build', 'Stir', 'Shake', 'Blend'], correctIndex: 1, explanation: 'Stir (khuấy) dùng cho đồ uống toàn rượu, giữ kết cấu mượt, không bọt khí.' },
  { id: 'q2', question: 'Theo công thức chuẩn IBA, Margarita gồm Tequila, Triple Sec và thành phần chua nào?', options: ['Nước cốt chanh (Lime juice)', 'Nước cam', 'Syrup đường', 'Soda'], correctIndex: 0, explanation: 'Margarita chuẩn IBA: 35ml Tequila, 20ml Triple Sec, 15ml nước cốt chanh, lắc.' },
  { id: 'q3', question: 'Mojito được xếp vào kỹ thuật pha chế nào?', options: ['Stir', 'Shake', 'Build (có dập/muddle)', 'Blend'], correctIndex: 2, explanation: 'Mojito được rót/dập trực tiếp trong ly (build), không lắc hay xay.' },
]);

const c5 = doc('res223-5-1-non-alcoholic-coffee', '5.1 — Non-alcoholic drinks, coffee & mocktails|||5.1 — Đồ uống không cồn, cà phê & mocktail',
  'Nhóm đồ uống không cồn (nước ngọt, nước quả, syrup); nền tảng cà phê (espresso, phương pháp pha); mocktail dùng chung kỹ thuật với cocktail.',
  [[
    `<span class="eyebrow">RES223 · Chapter 5 · Lesson 5.1</span>
<h2>Non-alcoholic drinks, coffee &amp; mocktails</h2>
<h3>Non-alcoholic categories</h3>
<ul>
<li><strong>Soft drinks</strong> — carbonated (cola, tonic, soda water) and still (juice, iced tea) — used both alone and as mixers.</li>
<li><strong>Fresh juices &amp; syrups</strong> — lime, orange, cranberry juice; house-made simple syrup, grenadine — the building blocks of both cocktails and mocktails.</li>
<li><strong>Mocktails</strong> — a full cocktail experience with zero alcohol, e.g. <strong>Virgin Mojito</strong> (same recipe, rum omitted) or <strong>Shirley Temple</strong> (ginger ale + grenadine + cherry).</li>
</ul>
<h3>Coffee basics</h3>
<p><strong>Espresso</strong> is the base of most bar coffee drinks — hot water forced through finely-ground coffee under pressure. Common brew methods: <strong>espresso machine</strong> (fast, concentrated), <strong>pour-over/drip</strong> (filtered, lighter body), <strong>French press</strong> (full immersion, fuller body). An Irish Coffee (espresso/coffee + whiskey + cream) sits at the border of the bar and coffee menu.</p>
<h3>Building a mocktail</h3>
<p>Mocktails use the exact same technique categories as cocktails — build, shake, blend — just without spirit. A good mocktail still needs a balance of sour, sweet and something aromatic (mint, bitters-free citrus, fresh herbs) so it does not taste flat.</p>
<div class="callout"><span class="badge">Why it matters</span> Non-alcoholic and coffee sales are a growing share of bar revenue — designated drivers, non-drinkers and daytime guests all need a menu that is not an afterthought.</div>`,
    `<span class="eyebrow">RES223 · Chương 5 · Bài 5.1</span>
<h2>Đồ uống không cồn, cà phê &amp; mocktail</h2>
<h3>Các nhóm đồ uống không cồn</h3>
<ul>
<li><strong>Nước ngọt</strong> — có gas (cola, tonic, soda) và không gas (nước quả, trà đá) — dùng riêng hoặc làm mixer.</li>
<li><strong>Nước quả tươi &amp; syrup</strong> — nước cốt chanh, cam, cranberry; syrup đường tự pha, grenadine — thành phần nền cho cả cocktail và mocktail.</li>
<li><strong>Mocktail</strong> — trải nghiệm cocktail đầy đủ nhưng không cồn, vd <strong>Virgin Mojito</strong> (giữ nguyên công thức, bỏ rum) hoặc <strong>Shirley Temple</strong> (ginger ale + grenadine + cherry).</li>
</ul>
<h3>Nền tảng cà phê</h3>
<p><strong>Espresso</strong> là nền của hầu hết đồ uống cà phê tại quầy bar — nước nóng bị ép qua bột cà phê xay mịn dưới áp suất. Các phương pháp pha phổ biến: <strong>máy espresso</strong> (nhanh, đậm đặc), <strong>pour-over/drip</strong> (qua lọc, vị nhẹ hơn), <strong>French press</strong> (ngâm toàn phần, vị đậm hơn). Irish Coffee (espresso/cà phê + whiskey + kem) nằm giữa menu bar và menu cà phê.</p>
<h3>Pha một mocktail</h3>
<p>Mocktail dùng đúng các nhóm kỹ thuật như cocktail — build, shake, blend — chỉ khác là không có rượu. Một mocktail ngon vẫn cần cân bằng chua, ngọt và một yếu tố hương (bạc hà, cam chanh, thảo mộc tươi) để không bị nhạt vị.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Doanh thu đồ uống không cồn và cà phê ngày càng chiếm tỉ trọng lớn — người lái xe, khách không uống rượu và khách ban ngày đều cần một menu được đầu tư đúng mức.</div>`,
  ]]);

const c5q = quiz('res223-quiz-5', 'Quiz 5 — Non-alcoholic & coffee|||Quiz 5 — Không cồn & cà phê', [
  { id: 'q1', question: 'Virgin Mojito khác Mojito thường ở điểm nào?', options: ['Không có bạc hà', 'Không có nước cốt chanh', 'Bỏ rum, giữ nguyên còn lại', 'Không có đá'], correctIndex: 2, explanation: 'Virgin Mojito giữ nguyên công thức Mojito, chỉ bỏ thành phần rượu (rum).' },
  { id: 'q2', question: 'Espresso được tạo ra bằng cách nào?', options: ['Ngâm cà phê trong nước lạnh', 'Ép nước nóng qua bột cà phê mịn dưới áp suất', 'Nhỏ từng giọt qua bộ lọc giấy', 'Xay cà phê với đá'], correctIndex: 1, explanation: 'Espresso: nước nóng bị ép qua cà phê xay mịn dưới áp suất, cho ra đồ uống đậm đặc.' },
  { id: 'q3', question: 'Yếu tố nào giúp mocktail không bị nhạt vị?', options: ['Chỉ cần nhiều đường', 'Cân bằng chua, ngọt và yếu tố hương', 'Bỏ hết đá', 'Chỉ dùng nước lọc'], correctIndex: 1, explanation: 'Mocktail cần cân bằng chua/ngọt và một yếu tố hương (bạc hà, cam chanh...) để có chiều sâu vị.' },
]);

const c6 = doc('res223-6-1-service-responsible', '6.1 — Guest service & responsible service of alcohol|||6.1 — Phục vụ khách & phục vụ có trách nhiệm',
  'Trình tự phục vụ tại bar; kiểm tra tuổi/dấu hiệu say; quyền từ chối phục vụ; an toàn quầy bar (thủy tinh, lửa, đổ tràn).',
  [[
    `<span class="eyebrow">RES223 · Chapter 6 · Lesson 6.1</span>
<h2>Guest service &amp; responsible service of alcohol</h2>
<h3>Sequence of bar service</h3>
<pre><code>Greet guest -> Take order (suggest, upsell if appropriate)
 -> Make/serve drink -> Check back ("How is your drink?")
 -> Anticipate the next round -> Present/close the tab
</code></pre>
<h3>Responsible service of alcohol (RSA)</h3>
<ul>
<li><strong>Check ID</strong> for any guest who appears under the legal drinking age before serving.</li>
<li><strong>Recognize intoxication signs</strong> — slurred speech, unsteady balance, aggressive behavior, slowed reactions.</li>
<li><strong>Right to refuse service</strong> — a bartender may, and should, refuse to serve a visibly intoxicated or underage guest; this is a legal duty, not just a courtesy.</li>
<li><strong>Cutting off a guest</strong> — do it calmly and privately; offer water, food, or to call a taxi instead of alcohol.</li>
<li><strong>Over-service liability</strong> — a venue can be held liable for harm caused by a guest it kept serving while visibly drunk.</li>
</ul>
<h3>Bar safety</h3>
<p>Common hazards: <strong>broken glass</strong> (dispose in a dedicated bin, never bare-handed), <strong>fire</strong> (flambé drinks require training and a lid/extinguisher nearby), <strong>spills</strong> (wet floor signs, clean immediately to prevent slips).</p>
<div class="callout"><span class="badge">Why it matters</span> Responsible service protects the guest's life, the staff's job, and the venue's liquor license — it is a legal requirement in most jurisdictions, not optional courtesy.</div>`,
    `<span class="eyebrow">RES223 · Chương 6 · Bài 6.1</span>
<h2>Phục vụ khách &amp; phục vụ có trách nhiệm</h2>
<h3>Trình tự phục vụ tại quầy bar</h3>
<pre><code>Chào khách -> Nhận order (gợi ý, bán thêm nếu phù hợp)
 -> Pha/phục vụ đồ uống -> Hỏi lại ("Đồ uống ổn không?")
 -> Dự đoán ly tiếp theo -> Trình/khép hóa đơn
</code></pre>
<h3>Phục vụ có trách nhiệm (RSA)</h3>
<ul>
<li><strong>Kiểm tra CMND/CCCD</strong> với khách có vẻ chưa đủ tuổi hợp pháp trước khi phục vụ.</li>
<li><strong>Nhận diện dấu hiệu say</strong> — nói lắp, đi không vững, hành vi hung hăng, phản xạ chậm.</li>
<li><strong>Quyền từ chối phục vụ</strong> — bartender có quyền, và nên, từ chối phục vụ khách rõ ràng say hoặc chưa đủ tuổi; đây là trách nhiệm pháp lý, không chỉ là phép lịch sự.</li>
<li><strong>Ngừng phục vụ một khách</strong> — thực hiện bình tĩnh và kín đáo; mời nước, thức ăn, hoặc gọi taxi thay vì rượu.</li>
<li><strong>Trách nhiệm khi phục vụ quá mức</strong> — quán có thể bị liên đới trách nhiệm nếu vẫn phục vụ khách đã rõ ràng say và gây hậu quả.</li>
</ul>
<h3>An toàn quầy bar</h3>
<p>Rủi ro thường gặp: <strong>ly/thủy tinh vỡ</strong> (bỏ vào thùng chuyên dụng, không cầm tay không), <strong>lửa</strong> (đồ uống flambé cần được huấn luyện và có nắp/bình chữa cháy gần đó), <strong>đổ tràn</strong> (đặt bảng sàn ướt, lau ngay để tránh trơn trượt).</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Phục vụ có trách nhiệm bảo vệ tính mạng khách, công việc của nhân viên, và giấy phép kinh doanh rượu của quán — đây là yêu cầu pháp lý ở hầu hết nơi, không phải phép lịch sự tùy chọn.</div>`,
  ]]);

const c6q = quiz('res223-quiz-6', 'Quiz 6 — Service & responsible service|||Quiz 6 — Phục vụ & trách nhiệm', [
  { id: 'q1', question: 'Khi khách có dấu hiệu say rõ rệt, bartender nên làm gì?', options: ['Vẫn phục vụ nếu khách trả tiền', 'Từ chối phục vụ thêm, mời nước/thức ăn hoặc gọi taxi', 'Phục vụ nhanh hơn để khách về sớm', 'Bỏ qua vì không phải việc của mình'], correctIndex: 1, explanation: 'Bartender có trách nhiệm pháp lý từ chối phục vụ khách say, và hỗ trợ khách an toàn (nước, thức ăn, taxi).' },
  { id: 'q2', question: 'Bước nào KHÔNG thuộc trình tự phục vụ tại bar?', options: ['Chào khách', 'Nhận order', 'Kiểm kê tồn kho cuối ngày', 'Hỏi lại khách về đồ uống'], correctIndex: 2, explanation: 'Kiểm kê tồn kho là công việc quản lý cuối ca, không thuộc trình tự phục vụ từng khách.' },
  { id: 'q3', question: 'Vì sao quán có thể bị liên đới trách nhiệm khi phục vụ quá mức?', options: ['Vì tốn nhiều rượu', 'Vì gây hại cho khách say mà quán vẫn tiếp tục phục vụ', 'Vì khách phàn nàn về giá', 'Vì hết đá'], correctIndex: 1, explanation: 'Phục vụ quá mức cho khách rõ ràng say và gây hậu quả có thể khiến quán chịu trách nhiệm pháp lý.' },
]);

const c7 = doc('res223-7-1-inventory-cost-pricing', '7.1 — Inventory, beverage cost & pricing|||7.1 — Quản lý tồn kho, chi phí đồ uống & định giá',
  'Par stock & FIFO; công thức pour cost %; ví dụ tính chi phí và giá bán; biến động hao hụt (variance).',
  [[
    `<span class="eyebrow">RES223 · Chapter 7 · Lesson 7.1</span>
<h2>Inventory, beverage cost &amp; pricing</h2>
<h3>Inventory basics</h3>
<ul>
<li><strong>Par stock</strong> — the target quantity of each item to keep on hand; ordering brings stock back up to par.</li>
<li><strong>FIFO (First In, First Out)</strong> — use older stock before newer stock to avoid spoilage/expiry, especially for perishable garnish and mixers.</li>
<li><strong>Perpetual inventory</strong> — a running count updated with every sale/delivery, checked against a periodic physical count.</li>
</ul>
<h3>Pour cost formula</h3>
<pre><code>Pour Cost % = (Cost of ingredients in one drink / Selling price) x 100

Example — Margarita:
 35ml Tequila  @ 0.35/ml -> 12.25
 20ml Triple Sec @ 0.12/ml -> 2.40
 15ml Lime juice          -> 1.00
 Total ingredient cost           = 15.65
 Selling price                   = 75.00
 Pour Cost % = 15.65 / 75.00 x 100 = 20.9%
</code></pre>
<p>Target pour cost is usually <strong>18-24%</strong> for spirits-based cocktails (bars accept a higher % on wine/beer since they need less labor to serve). A lower pour cost is not always better — undersized pours hurt the guest experience and repeat business.</p>
<h3>Variance &amp; pricing</h3>
<p><strong>Variance</strong> = actual stock used − theoretical usage from POS sales; a large positive variance signals over-pouring, spillage, comps, or theft. <strong>Cost-plus pricing</strong> sets the selling price by dividing ingredient cost by the target pour cost % (e.g. cost 15.65 ÷ 0.20 = sell at ~78).</p>
<div class="callout"><span class="badge">Why it matters</span> Beverage cost control is where a bar's real profit is won or lost — a few percentage points of pour cost across thousands of drinks a month is real money.</div>`,
    `<span class="eyebrow">RES223 · Chương 7 · Bài 7.1</span>
<h2>Quản lý tồn kho, chi phí đồ uống &amp; định giá</h2>
<h3>Cơ bản về tồn kho</h3>
<ul>
<li><strong>Par stock</strong> — lượng tồn kho mục tiêu cần giữ cho mỗi mặt hàng; đặt hàng để đưa tồn kho về lại mức par.</li>
<li><strong>FIFO (nhập trước, xuất trước)</strong> — dùng hàng cũ trước hàng mới để tránh hư hỏng/hết hạn, đặc biệt với garnish và mixer dễ hỏng.</li>
<li><strong>Kiểm kê liên tục (perpetual inventory)</strong> — số liệu cập nhật theo từng lần bán/nhập, đối chiếu định kỳ với kiểm kê thực tế.</li>
</ul>
<h3>Công thức pour cost</h3>
<pre><code>Pour Cost % = (Chi phí nguyên liệu 1 ly / Giá bán) x 100

Ví dụ — Margarita:
 35ml Tequila    @ 0.35/ml -> 12.25
 20ml Triple Sec @ 0.12/ml -> 2.40
 15ml Nước cốt chanh       -> 1.00
 Tổng chi phí nguyên liệu         = 15.65
 Giá bán                          = 75.00
 Pour Cost % = 15.65 / 75.00 x 100 = 20.9%
</code></pre>
<p>Pour cost mục tiêu thường là <strong>18-24%</strong> cho cocktail dựa trên rượu mạnh (vang/bia được chấp nhận % cao hơn vì tốn ít công phục vụ). Pour cost thấp hơn không phải luôn tốt hơn — rót thiếu ảnh hưởng trải nghiệm khách và khả năng khách quay lại.</p>
<h3>Hao hụt (variance) &amp; định giá</h3>
<p><strong>Variance</strong> = lượng tồn thực tế đã dùng − lượng lý thuyết theo doanh số POS; variance dương lớn báo hiệu rót dư, đổ tràn, tặng miễn phí (comp), hoặc mất mát. <strong>Định giá cost-plus</strong> tính giá bán bằng cách chia chi phí nguyên liệu cho pour cost % mục tiêu (vd chi phí 15.65 ÷ 0.20 = bán ~78).</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Kiểm soát chi phí đồ uống là nơi lợi nhuận thật của quầy bar được giữ hoặc mất — vài điểm phần trăm pour cost trên hàng nghìn ly mỗi tháng là số tiền thật.</div>`,
  ]]);

const c7q = quiz('res223-quiz-7', 'Quiz 7 — Inventory & cost|||Quiz 7 — Tồn kho & chi phí', [
  { id: 'q1', question: 'Công thức tính Pour Cost % là gì?', options: ['(Giá bán / Chi phí nguyên liệu) x 100', '(Chi phí nguyên liệu / Giá bán) x 100', 'Giá bán − Chi phí nguyên liệu', 'Chi phí nguyên liệu x Số lượng bán'], correctIndex: 1, explanation: 'Pour Cost % = (Chi phí nguyên liệu / Giá bán) x 100.' },
  { id: 'q2', question: 'FIFO trong quản lý tồn kho quầy bar nghĩa là gì?', options: ['Nhập sau, xuất trước', 'Nhập trước, xuất trước', 'Chỉ xuất hàng đắt trước', 'Không quan tâm thứ tự'], correctIndex: 1, explanation: 'FIFO (First In, First Out): dùng hàng cũ trước để tránh hư hỏng/hết hạn.' },
  { id: 'q3', question: 'Variance dương lớn trong tồn kho thường là dấu hiệu của điều gì?', options: ['Tồn kho quá dư an toàn', 'Rót dư, đổ tràn, tặng miễn phí hoặc mất mát', 'Giá bán quá cao', 'Khách đặt quá nhiều'], correctIndex: 1, explanation: 'Variance lớn (dùng thực tế > lý thuyết) báo hiệu rót dư, hao hụt hoặc thất thoát.' },
]);

const c8 = doc('res223-8-1-food-safety-management', '8.1 — Food safety, quality control & bar management|||8.1 — Vệ sinh an toàn thực phẩm, kiểm soát chất lượng & quản trị quầy bar',
  'Nguyên tắc HACCP cơ bản, tránh nhiễm khuẩn chéo; quy trình rửa ly 3 bồn; công thức chuẩn để đồng nhất chất lượng; các chỉ số quản trị quầy bar.',
  [[
    `<span class="eyebrow">RES223 · Chapter 8 · Lesson 8.1</span>
<h2>Food safety, quality control &amp; bar management</h2>
<h3>HACCP basics at the bar</h3>
<p><strong>HACCP (Hazard Analysis Critical Control Points)</strong> means identifying where contamination could happen and controlling it at that exact point — e.g. ice, garnish, and dairy are the highest-risk items behind a bar.</p>
<ul>
<li><strong>Cross-contamination</strong> — never scoop ice with a glass that has touched a drink; keep raw garnish cutting boards separate from other prep.</li>
<li><strong>Temperature control</strong> — dairy, juices and cut fruit must stay refrigerated until moments before use.</li>
</ul>
<h3>Glass washing — the three-sink method</h3>
<pre><code>Sink 1: Wash    -> hot water + detergent, scrub with brush
Sink 2: Rinse   -> clean water, remove all soap residue
Sink 3: Sanitize -> sanitizer solution at correct concentration/time
        -> air dry (never towel-dry, re-contaminates the glass)
</code></pre>
<h3>Quality control &amp; standard recipes</h3>
<p>A <strong>standard recipe card</strong> (fixed ingredients, exact measures, garnish, glass) is what makes a Margarita taste the same whoever makes it, and on any night. Quality control means tasting/checking batches, checking garnish freshness daily, and retraining when a drink drifts from spec.</p>
<h3>Bar management KPIs</h3>
<p>A bar manager tracks: <strong>pour cost %</strong> (Ch. 7), <strong>labor cost %</strong> (staff wages vs revenue), <strong>sales per guest/average check</strong>, and guest satisfaction/complaint rate — together these show whether the bar is both profitable and well run.</p>
<div class="callout"><span class="badge">Why it matters</span> Food safety failures can close a venue overnight; weak quality control quietly loses regular guests — both matter as much as the drinks themselves.</div>`,
    `<span class="eyebrow">RES223 · Chương 8 · Bài 8.1</span>
<h2>Vệ sinh an toàn thực phẩm, kiểm soát chất lượng &amp; quản trị quầy bar</h2>
<h3>Nguyên tắc HACCP cơ bản ở quầy bar</h3>
<p><strong>HACCP (phân tích mối nguy &amp; điểm kiểm soát trọng yếu)</strong> nghĩa là xác định nơi có thể xảy ra nhiễm khuẩn và kiểm soát đúng tại điểm đó — vd đá, garnish và sữa/kem là những thứ rủi ro cao nhất sau quầy bar.</p>
<ul>
<li><strong>Nhiễm khuẩn chéo</strong> — không bao giờ xúc đá bằng ly đã chạm vào đồ uống; giữ thớt cắt garnish riêng khỏi khu chế biến khác.</li>
<li><strong>Kiểm soát nhiệt độ</strong> — sữa/kem, nước quả và trái cây đã cắt phải được bảo quản lạnh đến ngay trước khi dùng.</li>
</ul>
<h3>Rửa ly — quy trình 3 bồn</h3>
<pre><code>Bồn 1: Rửa (Wash)     -> nước nóng + chất tẩy rửa, chà bằng cọ
Bồn 2: Xả (Rinse)     -> nước sạch, loại hết cặn xà phòng
Bồn 3: Khử khuẩn (Sanitize) -> dung dịch khử khuẩn đúng nồng độ/thời gian
        -> để khô tự nhiên (KHÔNG lau bằng khăn, gây nhiễm lại)
</code></pre>
<h3>Kiểm soát chất lượng &amp; công thức chuẩn</h3>
<p>Một <strong>thẻ công thức chuẩn (standard recipe card)</strong> (nguyên liệu cố định, định lượng chính xác, garnish, loại ly) là thứ giúp một ly Margarita có vị giống nhau bất kể ai pha, và vào bất kỳ đêm nào. Kiểm soát chất lượng nghĩa là nếm/kiểm tra theo lô, kiểm tra độ tươi của garnish hằng ngày, và đào tạo lại khi đồ uống lệch chuẩn.</p>
<h3>Chỉ số quản trị quầy bar</h3>
<p>Một bar manager theo dõi: <strong>pour cost %</strong> (Chương 7), <strong>tỉ lệ chi phí lao động</strong> (lương nhân viên so với doanh thu), <strong>doanh số theo khách/hóa đơn trung bình</strong>, và tỉ lệ hài lòng/khiếu nại của khách — cùng nhau cho biết quầy bar có lãi và được vận hành tốt hay không.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Sự cố an toàn thực phẩm có thể khiến quán bị đóng cửa ngay lập tức; kiểm soát chất lượng yếu âm thầm làm mất khách quen — cả hai đều quan trọng như chính đồ uống.</div>`,
  ]]);

const c8q = quiz('res223-quiz-8', 'Quiz 8 — Food safety & management|||Quiz 8 — Vệ sinh & quản trị', [
  { id: 'q1', question: 'Trong quy trình rửa ly 3 bồn, bồn thứ 3 dùng để làm gì?', options: ['Rửa bằng nước nóng', 'Xả sạch xà phòng', 'Khử khuẩn ở đúng nồng độ/thời gian', 'Lau khô bằng khăn'], correctIndex: 2, explanation: 'Bồn 3 là bồn khử khuẩn (sanitize) đúng nồng độ và thời gian, sau đó để khô tự nhiên.' },
  { id: 'q2', question: 'Vì sao cần dùng thẻ công thức chuẩn (standard recipe card)?', options: ['Để tiết kiệm nguyên liệu tối đa', 'Để đồ uống có vị giống nhau bất kể ai pha', 'Để giảm số lượng ly cần rửa', 'Để tăng giá bán'], correctIndex: 1, explanation: 'Công thức chuẩn đảm bảo tính đồng nhất của đồ uống, bất kể bartender nào pha chế.' },
  { id: 'q3', question: 'Chỉ số nào KHÔNG thuộc nhóm KPI quản trị quầy bar?', options: ['Pour cost %', 'Tỉ lệ chi phí lao động', 'Doanh số trung bình mỗi khách', 'Nhiệt độ phòng khách'], correctIndex: 3, explanation: 'Nhiệt độ phòng khách không phải KPI quản trị bar; các KPI gồm pour cost, chi phí lao động, doanh số, hài lòng khách.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'RES223',
    slug: 'res223-bar-operations',
    title: 'Bar Operations',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/RES223.webp',
    shortDescription: 'How a bar runs: organization, equipment, spirits/wine/beer/liqueur, IBA cocktail recipes, non-alcoholic drinks & coffee, responsible service, pour cost & pricing, food safety and management. Bilingual, with quizzes.|||Quầy bar vận hành thế nào: tổ chức, thiết bị, kiến thức rượu/vang/bia/liqueur, công thức cocktail chuẩn IBA, đồ uống không cồn & cà phê, phục vụ có trách nhiệm, chi phí & định giá, vệ sinh an toàn và quản trị. Song ngữ, có quiz.',
    description: 'Môn <strong>RES223 — Bar Operations</strong> (kỳ 3, khối Quản trị Kinh doanh - ngành Quản trị Nhà hàng-Khách sạn) dạy cách một <strong>quầy bar vận hành thực tế</strong>. Từ <strong>tổ chức quầy bar</strong> → <strong>thiết bị &amp; mise en place</strong> → <strong>kiến thức đồ uống có cồn</strong> (rượu mạnh/vang/bia/liqueur) → <strong>kỹ thuật pha chế &amp; mixology</strong> theo chuẩn IBA → <strong>đồ uống không cồn &amp; cà phê</strong> → <strong>phục vụ khách &amp; phục vụ có trách nhiệm</strong> → <strong>tồn kho &amp; chi phí đồ uống</strong> → <strong>vệ sinh an toàn &amp; quản trị quầy bar</strong>. Bám tài liệu tham khảo ngành (Katsigris &amp; Thomas, BarSmarts, tiêu chuẩn IBA), song ngữ, có công thức pha chế, bảng chi phí và quiz mỗi chương.',
    whatYouLearn: 'Tổ chức & vai trò trong quầy bar; thiết bị pha chế & bố trí quầy; sáu rượu mạnh nền, vang, bia, liqueur; kỹ thuật build/stir/shake/blend; công thức chuẩn IBA (Dry Martini, Old Fashioned, Margarita, Mojito); đồ uống không cồn, mocktail & cà phê; trình tự phục vụ & phục vụ có trách nhiệm (RSA); pour cost %, par stock, FIFO, variance; HACCP, quy trình rửa ly 3 bồn, KPI quản trị quầy bar.',
    requirements: 'Không yêu cầu kiến thức chuyên ngành trước. Nên đọc trước khung chương trình khối Quản trị Nhà hàng-Khách sạn trên FLM để biết chuẩn đầu ra chính thức.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình tham khảo, chuẩn IBA, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nghiệp vụ quầy bar, vì sao quan trọng trong ngành khách sạn.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan ngành bar & tổ chức quầy bar|||Chapter 1 — Bar industry & organization', description: 'Phân khúc ngành bar, sơ đồ tổ chức, vai trò từng vị trí.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thiết bị, dụng cụ & bố trí quầy bar|||Chapter 2 — Equipment & bar layout', description: 'Dụng cụ pha chế, ly theo loại, mise en place.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kiến thức đồ uống có cồn|||Chapter 3 — Alcoholic beverage knowledge', description: 'Rượu mạnh, vang, bia, liqueur, ABV.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Kỹ thuật pha chế cocktail & mixology|||Chapter 4 — Cocktail techniques & mixology', description: 'Build/stir/shake/blend, công thức chuẩn IBA.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đồ uống không cồn, cà phê & mocktail|||Chapter 5 — Non-alcoholic drinks & coffee', description: 'Nước ngọt, syrup, mocktail, nền tảng cà phê.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Phục vụ khách & phục vụ có trách nhiệm|||Chapter 6 — Guest & responsible service', description: 'Trình tự phục vụ, RSA, an toàn quầy bar.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tồn kho, chi phí đồ uống & định giá|||Chapter 7 — Inventory, cost & pricing', description: 'Par stock, FIFO, pour cost %, variance.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Vệ sinh an toàn & quản trị quầy bar|||Chapter 8 — Food safety & bar management', description: 'HACCP, rửa ly 3 bồn, công thức chuẩn, KPI quản trị.', lessons: [c8, c8q] },
  ],
};
