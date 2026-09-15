/**
 * CCL401 — Chinese Literature (Văn học Trung Quốc).
 * (syl): dòng chảy lịch sử văn học Trung Quốc — Kinh Thi & Sở từ, thơ phú
 * Hán-Nguỵ-Tấn, thơ Đường, từ Tống, hí khúc Nguyên & tiểu thuyết Minh-Thanh,
 * văn học hiện đại Ngũ Tứ (Lỗ Tấn), văn học đương đại (Mạc Ngôn). Song ngữ
 * Việt-Anh, kèm trích dẫn nguyên văn chữ Hán + pinyin + dịch nghĩa.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ccl401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình chính (袁行霈, Owen), kho văn bản cổ điển miễn phí, công cụ tra pinyin, lộ trình tự học.',
  [[
    `<span class="eyebrow">CCL401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study the history of Chinese literature — from the <em>Book of Songs</em> to Mo Yan — in one place. The official FPTU slides live on <strong>FLM</strong>; below are the reference textbooks and free legal resources used to build this course.</p>
<h3>📘 Reference textbooks (cited, not uploaded)</h3>
<ul>
<li><em>中国文学史</em> (<em>History of Chinese Literature</em>), chief editor <strong>袁行霈 Yuán Xíngpèi</strong> — the standard four-volume mainland Chinese textbook, organized by dynasty.</li>
<li><strong>Stephen Owen (ed.)</strong>, <em>An Anthology of Chinese Literature: Beginnings to 1911</em> — the standard English-language anthology with translations of nearly every text quoted in this course.</li>
</ul>
<h3>🌐 Free classical-text databases</h3>
<ul>
<li><a href="https://ctext.org/" target="_blank" rel="noopener">Chinese Text Project (ctext.org)</a> — searchable pre-modern Chinese texts, parallel English where available.</li>
<li><a href="https://www.gushiwen.cn/" target="_blank" rel="noopener">Gushiwen (gushiwen.cn)</a> — classical poems with pinyin, annotation and appreciation notes (Chinese only).</li>
<li><a href="https://en.wikisource.org/wiki/Category:Chinese_literature" target="_blank" rel="noopener">Wikisource — Chinese literature</a> — public-domain English translations of many classics.</li>
</ul>
<h3>▶️ Video</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=history+of+chinese+literature+lecture" target="_blank" rel="noopener">"History of Chinese literature" lecture playlists</a> — search for university open-courseware overviews of each dynasty.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the <em>Book of Songs</em> (诗经) and <em>Songs of Chu</em> (楚辞): the two roots of poetry, folk vs. individual voice.</li>
<li><strong>Golden age</strong> — Tang poetry (唐诗) and Song ci (宋词): read a handful of poems by Li Bai, Du Fu, Su Shi aloud, in Chinese, before the translation.</li>
<li><strong>Narrative turn</strong> — Yuan drama and the Ming-Qing novels: notice how vernacular storytelling displaces classical verse.</li>
<li><strong>Modern &amp; contemporary</strong> — Lu Xun's break with classical Chinese, then Mo Yan's return to oral, regional storytelling.</li>
</ol></div>`,
    `<span class="eyebrow">CCL401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học lịch sử văn học Trung Quốc — từ <em>Kinh Thi</em> đến Mạc Ngôn — gom về một chỗ. Slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là giáo trình được trích dẫn và nguồn miễn phí, hợp pháp dùng để dựng môn này.</p>
<h3>📘 Giáo trình tham khảo (trích dẫn, không tải lên)</h3>
<ul>
<li><em>中国文学史</em> (<em>Lịch sử văn học Trung Quốc</em>), chủ biên <strong>袁行霈 Viên Hành Bái</strong> — bộ giáo trình bốn tập chuẩn của Trung Quốc đại lục, biên soạn theo triều đại.</li>
<li><strong>Stephen Owen (chủ biên)</strong>, <em>An Anthology of Chinese Literature: Beginnings to 1911</em> — tuyển tập tiếng Anh chuẩn, có bản dịch gần như mọi văn bản được trích trong môn này.</li>
</ul>
<h3>🌐 Kho văn bản cổ điển miễn phí</h3>
<ul>
<li><a href="https://ctext.org/" target="_blank" rel="noopener">Chinese Text Project (ctext.org)</a> — tra cứu văn bản cổ Trung Quốc, có bản đối chiếu tiếng Anh khi có.</li>
<li><a href="https://www.gushiwen.cn/" target="_blank" rel="noopener">Gushiwen (gushiwen.cn)</a> — thơ cổ kèm pinyin, chú giải và bình giảng (tiếng Trung).</li>
<li><a href="https://en.wikisource.org/wiki/Category:Chinese_literature" target="_blank" rel="noopener">Wikisource — Chinese literature</a> — bản dịch tiếng Anh miễn phí bản quyền của nhiều tác phẩm kinh điển.</li>
</ul>
<h3>▶️ Video</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=history+of+chinese+literature+lecture" target="_blank" rel="noopener">Playlist bài giảng "History of Chinese literature"</a> — tìm các khoá mở của đại học tổng quan từng triều đại.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — <em>Kinh Thi</em> (诗经) và <em>Sở từ</em> (楚辞): hai cội rễ của thơ ca, tiếng nói dân gian và tiếng nói cá nhân.</li>
<li><strong>Thời hoàng kim</strong> — thơ Đường (唐诗) và từ Tống (宋词): đọc thành tiếng vài bài của Lý Bạch, Đỗ Phủ, Tô Thức bằng tiếng Trung trước khi xem bản dịch.</li>
<li><strong>Bước ngoặt tự sự</strong> — kịch Nguyên và tiểu thuyết Minh-Thanh: để ý cách kể chuyện bạch thoại dần thay thế thơ văn ngôn.</li>
<li><strong>Hiện đại &amp; đương đại</strong> — Lỗ Tấn dứt khỏi văn ngôn cổ, rồi Mạc Ngôn quay về lối kể chuyện truyền khẩu, đậm chất vùng miền.</li>
</ol></div>`,
  ]]);

const intro = doc('ccl401-0-1-overview', 'Course overview: Chinese Literature|||Tổng quan: Văn học Trung Quốc',
  'Văn học TQ trải hơn 3000 năm; lộ trình 8 chương theo dòng lịch sử từ Kinh Thi đến văn học đương đại, mỗi chương gắn tác giả/tác phẩm tiêu biểu và trích dẫn nguyên văn.',
  [[
    `<span class="eyebrow">CCL401 · Lesson 0.1 · Overview</span>
<h2>Chinese Literature</h2>
<p class="lead">Chinese literature spans more than three thousand years — from anonymous folk songs collected before Confucius to a Nobel laureate writing today. This course reads it as one continuous conversation: each era answers, or rebels against, the one before it.</p>
<h3>Roadmap — eight chapters, one timeline</h3>
<ul>
<li><strong>Ch.1</strong> The <em>Book of Songs</em> (诗经) &amp; <em>Songs of Chu</em> (楚辞) — the two founding voices: collective folk song vs. the solitary poet-exile Qu Yuan.</li>
<li><strong>Ch.2</strong> Han-Wei-Jin rhapsody &amp; prose (汉赋, 乐府) — court rhetoric, folk ballads, and Tao Yuanming's turn to pastoral quiet.</li>
<li><strong>Ch.3</strong> Tang poetry (唐诗) — Li Bai, Du Fu, Bai Juyi: the genre's golden age.</li>
<li><strong>Ch.4</strong> Song ci (宋词) — Su Shi's bold voice, Li Qingzhao's delicate one.</li>
<li><strong>Ch.5</strong> Yuan drama (元曲) &amp; the Ming-Qing novel (四大名著) — literature moves from verse to vernacular narrative.</li>
<li><strong>Ch.6</strong> Lu Xun &amp; the May Fourth movement (鲁迅, 五四) — classical Chinese gives way to modern vernacular fiction.</li>
<li><strong>Ch.7</strong> Contemporary literature &amp; Mo Yan (莫言) — from scar literature to the 2012 Nobel Prize.</li>
<li><strong>Ch.8</strong> Review — genre features across dynasties, close reading, and the overall current of Chinese literary history.</li>
</ul>
<p>Every chapter pairs a short historical document with an original Chinese excerpt (汉字 + pinyin + Vietnamese translation), so you read the text itself, not just a description of it.</p>`,
    `<span class="eyebrow">CCL401 · Bài 0.1 · Tổng quan</span>
<h2>Văn học Trung Quốc</h2>
<p class="lead">Văn học Trung Quốc trải hơn ba nghìn năm — từ những bài ca dao khuyết danh được sưu tập trước thời Khổng Tử, đến một nhà văn đoạt Nobel đang viết hôm nay. Môn này đọc nó như một cuộc đối thoại liên tục: mỗi thời đại đáp lại, hoặc nổi loạn chống lại, thời đại trước nó.</p>
<h3>Lộ trình — tám chương, một dòng chảy</h3>
<ul>
<li><strong>Ch.1</strong> <em>Kinh Thi</em> (诗经) &amp; <em>Sở từ</em> (楚辞) — hai tiếng nói khởi thuỷ: ca dao tập thể đối lại nhà thơ lưu vong đơn độc Khuất Nguyên.</li>
<li><strong>Ch.2</strong> Phú &amp; văn Hán-Nguỵ-Tấn (汉赋, 乐府) — hùng biện cung đình, dân ca nhạc phủ, và bước ngoặt điền viên tĩnh lặng của Đào Uyên Minh.</li>
<li><strong>Ch.3</strong> Thơ Đường (唐诗) — Lý Bạch, Đỗ Phủ, Bạch Cư Dị: thời hoàng kim của thể loại.</li>
<li><strong>Ch.4</strong> Từ Tống (宋词) — tiếng nói hào phóng của Tô Thức, tiếng nói uyển ước của Lý Thanh Chiếu.</li>
<li><strong>Ch.5</strong> Hí khúc Nguyên (元曲) &amp; tiểu thuyết Minh-Thanh (四大名著) — văn học chuyển từ vận văn sang tự sự bạch thoại.</li>
<li><strong>Ch.6</strong> Lỗ Tấn &amp; phong trào Ngũ Tứ (鲁迅, 五四) — văn ngôn cổ nhường chỗ cho tiểu thuyết bạch thoại hiện đại.</li>
<li><strong>Ch.7</strong> Văn học đương đại &amp; Mạc Ngôn (莫言) — từ văn học vết thương đến giải Nobel năm 2012.</li>
<li><strong>Ch.8</strong> Ôn tập — đặc trưng thể loại qua các triều đại, phân tích tác phẩm, và dòng chảy chung của lịch sử văn học Trung Quốc.</li>
</ul>
<p>Mỗi chương ghép một tài liệu lịch sử ngắn với một trích đoạn Hán văn gốc (汉字 + pinyin + dịch nghĩa tiếng Việt), để bạn đọc chính văn bản chứ không chỉ đọc mô tả về nó.</p>`,
  ]]);

const c1 = doc('ccl401-1-1-shijing-chuci', '1.1 — Book of Songs & Songs of Chu|||1.1 — Kinh Thi & Sở từ',
  '诗经 (tuyển ca dao cổ nhất, Phong-Nhã-Tụng) và 楚辞 (thơ cá nhân của Khuất Nguyên, Ly Tao); trích "Quan thư" và "Ly Tao".',
  [[
    `<span class="eyebrow">CCL401 · Chapter 1 · Lesson 1.1</span>
<h2>The Book of Songs &amp; the Songs of Chu</h2>
<h3>诗经 (Shījīng) — the Book of Songs</h3>
<p>Compiled roughly between the 11th and 6th centuries BCE, the <strong>Book of Songs</strong> is China's oldest anthology: 305 anonymous poems traditionally said to have been edited by Confucius. It has three sections: <strong>风 (fēng)</strong> — folk songs from the states, about love, farm work and complaint; <strong>雅 (yǎ)</strong> — court odes; and <strong>颂 (sòng)</strong> — hymns for ancestral sacrifice. Its four-character line became the basic unit of Chinese verse for centuries.</p>
<pre><code>关关雎鸠，在河之洲。
窈窕淑女，君子好逑。

Guān guān jū jiū, zài hé zhī zhōu.
Yǎotiǎo shūnǚ, jūnzǐ hǎo qiú.

"Quan quan" — đôi chim thư cưu, cất tiếng trên cồn bãi giữa sông.
Người thục nữ dịu dàng, xứng đôi cùng bậc quân tử.</code></pre>
<p>This is the opening of "关雎" (Guān Jū), poem No. 1 of the <em>Guofeng</em> section — a courtship song that Confucian tradition later read as a moral allegory of harmonious marriage.</p>
<h3>楚辞 (Chǔ Cí) — the Songs of Chu</h3>
<p>Centuries later, from the southern state of Chu, came a very different voice: longer, irregular lines punctuated by the exclamatory particle <strong>兮 (xī)</strong>, shot through with shamanistic imagery and personal anguish. Its central figure is <strong>屈原 Qū Yuán</strong> (c. 340–278 BCE), a minister slandered and exiled, whose masterpiece <strong>离骚 (Lí Sāo)</strong>, "Encountering Sorrow," is the first great work of individually-authored Chinese poetry.</p>
<pre><code>路漫漫其修远兮，吾将上下而求索。

Lù mànmàn qí xiūyuǎn xī, wú jiāng shàngxià ér qiúsuǒ.

"Đường xa xôi thăm thẳm hề, ta sẽ tìm kiếm khắp trên dưới."</code></pre>
<div class="callout"><span class="badge">Legacy</span> Qu Yuan drowned himself in the Miluo River in protest at his king; the annual <strong>Dragon Boat Festival (端午节)</strong> commemorates him. "风" (folk voice) and "骚" (individual voice) together gave Chinese literary history its oldest pairing of terms — <strong>风骚</strong> — still used today to mean "literary elegance."</div>`,
    `<span class="eyebrow">CCL401 · Chương 1 · Bài 1.1</span>
<h2>Kinh Thi &amp; Sở từ</h2>
<h3>诗经 (Shījīng) — Kinh Thi</h3>
<p>Được sưu tập trong khoảng thế kỷ 11 đến thế kỷ 6 TCN, <strong>Kinh Thi</strong> là tuyển tập cổ nhất của Trung Quốc: 305 bài thơ khuyết danh, tương truyền do Khổng Tử biên tập. Sách chia ba phần: <strong>风 (Phong)</strong> — ca dao dân gian các nước chư hầu, nói về tình yêu, lao động đồng áng và than thở; <strong>雅 (Nhã)</strong> — nhạc chương cung đình; và <strong>颂 (Tụng)</strong> — thánh ca tế tổ tiên. Câu bốn chữ của Kinh Thi trở thành đơn vị cơ bản của thơ ca Trung Quốc suốt nhiều thế kỷ sau.</p>
<pre><code>关关雎鸠，在河之洲。
窈窕淑女，君子好逑。

Guān guān jū jiū, zài hé zhī zhōu.
Yǎotiǎo shūnǚ, jūnzǐ hǎo qiú.

"Quan quan" — đôi chim thư cưu, cất tiếng trên cồn bãi giữa sông.
Người thục nữ dịu dàng, xứng đôi cùng bậc quân tử.</code></pre>
<p>Đây là câu mở đầu bài "关雎" (Quan thư), bài số 1 phần <em>Quốc phong</em> — một khúc hát tỏ tình mà truyền thống Nho gia sau này đọc như một ngụ ngôn đạo đức về hôn nhân hoà thuận.</p>
<h3>楚辞 (Chǔ Cí) — Sở từ</h3>
<p>Nhiều thế kỷ sau, từ nước Sở phương nam, xuất hiện một tiếng nói rất khác: câu dài, không đều, điểm xuyết trợ từ cảm thán <strong>兮 (hề)</strong>, đầy hình ảnh vu thuật và nỗi đau cá nhân. Nhân vật trung tâm là <strong>屈原 Khuất Nguyên</strong> (khoảng 340–278 TCN), một vị quan bị gièm pha và đày ải, mà kiệt tác <strong>离骚 (Ly Tao)</strong>, "Gặp nỗi buồn," là tác phẩm lớn đầu tiên của thơ ca Trung Quốc do một cá nhân đứng tên.</p>
<pre><code>路漫漫其修远兮，吾将上下而求索。

Lù mànmàn qí xiūyuǎn xī, wú jiāng shàngxià ér qiúsuǒ.

"Đường xa xôi thăm thẳm hề, ta sẽ tìm kiếm khắp trên dưới."</code></pre>
<div class="callout"><span class="badge">Di sản</span> Khuất Nguyên trẫm mình xuống sông Mịch La để phản đối nhà vua; <strong>Tết Đoan Ngọ (端午节)</strong> hằng năm là để tưởng nhớ ông. "Phong" (tiếng nói tập thể) và "Tao" (tiếng nói cá nhân) hợp lại thành cặp thuật ngữ cổ nhất của lịch sử văn học Trung Quốc — <strong>风骚 (phong tao)</strong> — ngày nay vẫn dùng để chỉ sự tao nhã trong văn chương.</div>`,
  ]]);

const c1q = quiz('ccl401-quiz-1', 'Quiz 1 — Book of Songs & Songs of Chu|||Quiz 1 — Kinh Thi & Sở từ', [
  { id: 'q1', question: '诗经 (Kinh Thi) là gì?', options: ['Tuyển tập ca dao/thơ ca cổ nhất Trung Quốc, gồm ba phần Phong-Nhã-Tụng', 'Bộ tiểu thuyết chương hồi đời Minh', 'Vở kịch tạp kịch đời Nguyên', 'Bộ sử ký của Tư Mã Thiên'], correctIndex: 0, explanation: 'Kinh Thi gồm 305 bài, sưu tập khoảng thế kỷ 11-6 TCN, chia ba phần Phong (dân ca), Nhã (nhạc chương cung đình), Tụng (thánh ca tế tổ).' },
  { id: 'q2', question: 'Tác giả của "Ly Tao" (离骚), tác phẩm mở đầu Sở từ, là ai?', options: ['Khổng Tử', 'Khuất Nguyên', 'Tư Mã Thiên', 'Lý Bạch'], correctIndex: 1, explanation: 'Khuất Nguyên (khoảng 340-278 TCN), quan nước Sở bị đày ải, là tác giả Ly Tao và là nhà thơ cá nhân đầu tiên được ghi danh trong lịch sử văn học Trung Quốc.' },
  { id: 'q3', question: 'Câu "关关雎鸠，在河之洲" (Quan quan thư cưu) là câu mở đầu của bài thơ nào?', options: ['Ly Tao', '"Quan thư" — bài số 1 phần Quốc phong của Kinh Thi', 'Đoản ca hành của Tào Tháo', 'Tĩnh dạ tứ của Lý Bạch'], correctIndex: 1, explanation: '"Quan thư" là bài mở đầu Kinh Thi, một khúc hát tỏ tình được Nho gia đọc như ngụ ngôn đạo đức về hôn nhân hoà thuận.' },
]);

const c2 = doc('ccl401-2-1-han-wei-jin', '2.1 — Han-Wei-Jin rhapsody & prose|||2.1 — Thơ phú & văn Hán-Nguỵ-Tấn',
  '汉赋 (phú Hán, hoa mỹ), 乐府 (nhạc phủ dân ca), thơ Kiến An của Tào Tháo, và bước ngoặt điền viên của Đào Uyên Minh.',
  [[
    `<span class="eyebrow">CCL401 · Chapter 2 · Lesson 2.1</span>
<h2>Han-Wei-Jin rhapsody &amp; prose</h2>
<h3>汉赋 (Hàn fù) — the Han rhapsody</h3>
<p>The dominant genre of the Han dynasty (206 BCE–220 CE) was the <strong>fù</strong> — an ornate, rhymed prose-poem piling up parallel description and rare vocabulary to praise palaces, hunts and capitals. Sima Xiangru (司马相如) was its master. Alongside it, the imperial <strong>Music Bureau (乐府 Yuèfǔ)</strong> collected folk ballads in plainer language — narrative songs of soldiers, orphans and abandoned wives, such as the long tragic ballad "孔雀东南飞" (<em>The Peacocks Fly Southeast</em>).</p>
<h3>Jian'an poetry — Cao Cao's generation</h3>
<p>At the fall of Han, the warlord-poet <strong>曹操 Cáo Cāo</strong> and his sons revived the yuefu form for personal, often melancholy reflection — the "Jian'an style" (建安风骨), prized for its direct, sturdy emotion.</p>
<pre><code>对酒当歌，人生几何？
譬如朝露，去日苦多。

Duì jiǔ dāng gē, rénshēng jǐhé?
Pìrú zhāolù, qù rì kǔ duō.

"Đối rượu nên ca, đời người được bao?
Ví như sương sớm, ngày đã qua khổ nhiều."</code></pre>
<h3>Tao Yuanming — the turn to the fields</h3>
<p>A century later, <strong>陶渊明 Táo Yuānmíng</strong> (365–427) resigned a minor post rather than "bow for five pecks of rice," and founded <strong>pastoral poetry (田园诗)</strong> — plain, quiet verse about farm life and wine, prized for centuries as a model of sincerity over ornament. His prose fable <strong>桃花源记</strong> ("Peach Blossom Spring") imagines a hidden village untouched by dynastic upheaval — China's utopia.</p>
<pre><code>少无适俗韵，性本爱丘山。

Shào wú shì sú yùn, xìng běn ài qiūshān.

"Thuở nhỏ vốn chẳng hợp thói tục, tính vốn yêu núi đồi."</code></pre>
<div class="callout"><span class="badge">Contrast</span> Han <em>fù</em> praised the empire from the outside, in ornate court language; Tao Yuanming turned inward, in plain language, toward the private self. That shift — public rhetoric to private voice — recurs throughout Chinese literary history.</div>`,
    `<span class="eyebrow">CCL401 · Chương 2 · Bài 2.1</span>
<h2>Thơ phú &amp; văn Hán-Nguỵ-Tấn</h2>
<h3>汉赋 (Hán phú)</h3>
<p>Thể loại chủ đạo đời Hán (206 TCN–220 SCN) là <strong>phú</strong> — một dạng văn xuôi có vần, hoa mỹ, chất chồng những đoạn miêu tả đối xứng và từ ngữ hiếm để ca ngợi cung điện, cuộc săn, kinh đô. Tư Mã Tương Như (司马相如) là bậc thầy của thể loại này. Song song đó, <strong>Nhạc phủ (乐府 Yuèfǔ)</strong> — cơ quan âm nhạc triều đình — sưu tập dân ca bằng ngôn ngữ giản dị hơn: những khúc hát tự sự về người lính, trẻ mồ côi, người vợ bị ruồng bỏ, như khúc bi ca dài "孔雀东南飞" (<em>Khổng tước đông nam phi</em>).</p>
<h3>Thơ Kiến An — thế hệ Tào Tháo</h3>
<p>Khi nhà Hán suy tàn, quân phiệt-thi nhân <strong>曹操 Tào Tháo</strong> cùng các con hồi sinh thể nhạc phủ để bộc lộ tâm tư cá nhân, thường u hoài — "phong cốt Kiến An" (建安风骨), được quý trọng vì tình cảm chân thực, chắc khoẻ.</p>
<pre><code>对酒当歌，人生几何？
譬如朝露，去日苦多。

Duì jiǔ dāng gē, rénshēng jǐhé?
Pìrú zhāolù, qù rì kǔ duō.

"Đối rượu nên ca, đời người được bao?
Ví như sương sớm, ngày đã qua khổ nhiều."</code></pre>
<h3>Đào Uyên Minh — bước ngoặt về đồng ruộng</h3>
<p>Một thế kỷ sau, <strong>陶渊明 Đào Uyên Minh</strong> (365–427) từ quan nhỏ thay vì "khom lưng vì năm đấu gạo," và khai sinh <strong>thơ điền viên (田园诗)</strong> — thơ giản dị, tĩnh lặng về đời sống nông trại và rượu, được xem trọng suốt nhiều thế kỷ như mẫu mực của sự chân thành hơn là trau chuốt. Bài văn ngụ ngôn <strong>桃花源记</strong> ("Đào hoa nguyên ký") tưởng tượng một ngôi làng ẩn giấu, không hề bị biến động triều đại chạm tới — cõi không tưởng của Trung Quốc.</p>
<pre><code>少无适俗韵，性本爱丘山。

Shào wú shì sú yùn, xìng běn ài qiūshān.

"Thuở nhỏ vốn chẳng hợp thói tục, tính vốn yêu núi đồi."</code></pre>
<div class="callout"><span class="badge">Tương phản</span> Phú đời Hán ca ngợi đế chế từ bên ngoài, bằng ngôn ngữ cung đình hoa mỹ; Đào Uyên Minh quay vào bên trong, bằng ngôn ngữ giản dị, hướng tới cái tôi riêng tư. Sự chuyển dịch đó — từ hùng biện công cộng sang tiếng nói riêng tư — lặp lại xuyên suốt lịch sử văn học Trung Quốc.</div>`,
  ]]);

const c2q = quiz('ccl401-quiz-2', 'Quiz 2 — Han-Wei-Jin|||Quiz 2 — Hán-Nguỵ-Tấn', [
  { id: 'q1', question: 'Thể loại văn xuôi có vần, hoa mỹ, chuyên miêu tả cung điện/cuộc săn, thịnh hành đời Hán, gọi là gì?', options: ['Phú (赋)', 'Từ (词)', 'Khúc (曲)', 'Tiểu thuyết chương hồi'], correctIndex: 0, explanation: 'Hán phú là thể văn xuôi có vần, hoa mỹ, chất chồng miêu tả đối xứng; Tư Mã Tương Như là bậc thầy tiêu biểu.' },
  { id: 'q2', question: 'Câu "对酒当歌，人生几何" (Đối rượu nên ca) là của ai?', options: ['Đào Uyên Minh', 'Tào Tháo', 'Khuất Nguyên', 'Tư Mã Tương Như'], correctIndex: 1, explanation: 'Đây là câu mở đầu bài "Đoản ca hành" của Tào Tháo, tiêu biểu cho phong cốt Kiến An — tình cảm cá nhân, u hoài.' },
  { id: 'q3', question: 'Đào Uyên Minh được xem là người khai sáng dòng thơ nào?', options: ['Thơ biên tái', 'Thơ điền viên (pastoral)', 'Từ khúc', 'Tiểu thuyết chí quái'], correctIndex: 1, explanation: 'Đào Uyên Minh từ quan về ở ẩn, mở ra thơ điền viên — giản dị, tĩnh lặng, viết về đồng ruộng và rượu.' },
]);

const c3 = doc('ccl401-3-1-tang-poetry', '3.1 — Tang poetry: Li Bai, Du Fu, Bai Juyi|||3.1 — Thơ Đường: Lý Bạch, Đỗ Phủ, Bạch Cư Dị',
  'Thời hoàng kim thơ Đường: "Thi Tiên" Lý Bạch (lãng mạn), "Thi Thánh" Đỗ Phủ (hiện thực), Bạch Cư Dị (bình dị, tự sự); trích Tĩnh dạ tứ và Xuân vọng.',
  [[
    `<span class="eyebrow">CCL401 · Chapter 3 · Lesson 3.1</span>
<h2>Tang poetry: Li Bai, Du Fu, Bai Juyi</h2>
<p>The Tang dynasty (618–907) is poetry's golden age: the <em>Complete Tang Poems</em> collects some 48,900 poems by 2,200 poets. New regulated forms crystallized — <strong>律诗 (lǜshī)</strong>, the eight-line "regulated verse" with strict tonal and parallel rules, and <strong>绝句 (juéjù)</strong>, the four-line quatrain.</p>
<h3>李白 Lǐ Bái — the "Poet Immortal" (诗仙)</h3>
<p>Romantic, Daoist, fond of wine and moonlight, Li Bai (701–762) wrote with effortless, soaring imagination. His best-known quatrain is memorized by every Chinese schoolchild:</p>
<pre><code>床前明月光，疑是地上霜。
举头望明月，低头思故乡。

Chuáng qián míngyuè guāng, yí shì dìshang shuāng.
Jǔ tóu wàng míngyuè, dītóu sī gùxiāng.

"Trước giường ánh trăng sáng, ngỡ là sương phủ mặt đất.
Ngẩng đầu ngắm trăng sáng, cúi đầu nhớ cố hương."</code></pre>
<h3>杜甫 Dù Fǔ — the "Poet Sage" (诗圣)</h3>
<p>Where Li Bai soars, Du Fu (712–770) grieves with precision. Living through the catastrophic <strong>An Lushan Rebellion</strong>, he turned poetry into witness — a chronicle of a broken empire.</p>
<pre><code>国破山河在，城春草木深。
感时花溅泪，恨别鸟惊心。

Guó pò shānhé zài, chéng chūn cǎomù shēn.
Gǎn shí huā jiàn lèi, hèn bié niǎo jīng xīn.

"Nước mất, núi sông còn đó; thành xuân, cỏ cây rậm rạp.
Cảm thời hoa cũng rơi lệ, hận biệt ly chim cũng giật mình."</code></pre>
<h3>白居易 Bái Jūyì — the accessible narrator</h3>
<p>Bai Juyi (772–846) wrote deliberately plain, tuneful verse — legend says he tested lines on an illiterate old woman. His long narrative poems <strong>长恨歌</strong> (<em>Song of Everlasting Sorrow</em>, on Emperor Xuanzong and Yang Guifei) and <strong>琵琶行</strong> (<em>The Pipa Player</em>) remain among the most-read Tang poems.</p>
<div class="callout"><span class="badge">Three temperaments</span> Li Bai = imagination unbound; Du Fu = history witnessed with grief; Bai Juyi = story made singable. Together they define the range of what Tang poetry could do.</div>`,
    `<span class="eyebrow">CCL401 · Chương 3 · Bài 3.1</span>
<h2>Thơ Đường: Lý Bạch, Đỗ Phủ, Bạch Cư Dị</h2>
<p>Đời Đường (618–907) là thời hoàng kim của thơ ca: bộ <em>Toàn Đường thi</em> sưu tập khoảng 48.900 bài của 2.200 nhà thơ. Các thể luật mới định hình: <strong>律诗 (luật thi)</strong> — thơ tám câu niêm luật thanh điệu và đối chặt chẽ, và <strong>绝句 (tuyệt cú)</strong> — thơ bốn câu.</p>
<h3>李白 Lý Bạch — "Thi Tiên" (诗仙)</h3>
<p>Lãng mạn, theo tinh thần Đạo gia, yêu rượu và ánh trăng, Lý Bạch (701–762) viết với trí tưởng tượng bay bổng, nhẹ nhàng. Bài tuyệt cú nổi tiếng nhất của ông được mọi học sinh Trung Quốc thuộc lòng:</p>
<pre><code>床前明月光，疑是地上霜。
举头望明月，低头思故乡。

Chuáng qián míngyuè guāng, yí shì dìshang shuāng.
Jǔ tóu wàng míngyuè, dītóu sī gùxiāng.

"Trước giường ánh trăng sáng, ngỡ là sương phủ mặt đất.
Ngẩng đầu ngắm trăng sáng, cúi đầu nhớ cố hương."</code></pre>
<h3>杜甫 Đỗ Phủ — "Thi Thánh" (诗圣)</h3>
<p>Nếu Lý Bạch bay bổng, Đỗ Phủ (712–770) đau xót với sự chính xác. Sống qua <strong>loạn An Lộc Sơn</strong> tàn khốc, ông biến thơ ca thành chứng từ — biên niên sử của một đế chế đổ vỡ.</p>
<pre><code>国破山河在，城春草木深。
感时花溅泪，恨别鸟惊心。

Guó pò shānhé zài, chéng chūn cǎomù shēn.
Gǎn shí huā jiàn lèi, hèn bié niǎo jīng xīn.

"Nước mất, núi sông còn đó; thành xuân, cỏ cây rậm rạp.
Cảm thời hoa cũng rơi lệ, hận biệt ly chim cũng giật mình."</code></pre>
<h3>白居易 Bạch Cư Dị — người kể chuyện bình dị</h3>
<p>Bạch Cư Dị (772–846) chủ ý viết câu thơ giản dị, dễ nhớ — tương truyền ông thử đọc thơ cho một bà lão mù chữ nghe. Hai bài thơ tự sự dài <strong>长恨歌</strong> (<em>Trường hận ca</em>, viết về Đường Huyền Tông và Dương Quý Phi) và <strong>琵琶行</strong> (<em>Tỳ bà hành</em>) vẫn nằm trong số những bài thơ Đường được đọc nhiều nhất.</p>
<div class="callout"><span class="badge">Ba khí chất</span> Lý Bạch = trí tưởng tượng không giới hạn; Đỗ Phủ = lịch sử được chứng kiến trong đau xót; Bạch Cư Dị = câu chuyện hoá thành lời ca. Ba người cùng vẽ nên biên độ mà thơ Đường có thể vươn tới.</div>`,
  ]]);

const c3q = quiz('ccl401-quiz-3', 'Quiz 3 — Tang poetry|||Quiz 3 — Thơ Đường', [
  { id: 'q1', question: 'Ai được gọi là "Thi Tiên" (诗仙)?', options: ['Đỗ Phủ', 'Lý Bạch', 'Bạch Cư Dị', 'Tô Thức'], correctIndex: 1, explanation: 'Lý Bạch được gọi là "Thi Tiên" vì phong cách lãng mạn, bay bổng, mang tinh thần Đạo gia.' },
  { id: 'q2', question: 'Nhà thơ nào được gọi là "Thi Thánh" vì phong cách hiện thực, ghi lại cảnh loạn An Lộc Sơn?', options: ['Lý Bạch', 'Đỗ Phủ', 'Bạch Cư Dị', 'Khuất Nguyên'], correctIndex: 1, explanation: 'Đỗ Phủ sống qua loạn An Lộc Sơn và viết thơ như chứng từ lịch sử, được tôn là "Thi Thánh".' },
  { id: 'q3', question: '"Trường hận ca" và "Tỳ bà hành" là tác phẩm của ai?', options: ['Bạch Cư Dị', 'Đỗ Phủ', 'Lý Bạch', 'Tô Thức'], correctIndex: 0, explanation: 'Bạch Cư Dị viết hai bài thơ tự sự dài này, nổi tiếng vì ngôn ngữ bình dị, dễ hiểu.' },
]);

const c4 = doc('ccl401-4-1-song-ci', '4.1 — Song ci: Su Shi & Li Qingzhao|||4.1 — Từ Tống: Tô Thức & Lý Thanh Chiếu',
  '词 (từ) — lời ca theo điệu nhạc có sẵn; hai phái Hào phóng (Tô Thức) và Uyển ước (Lý Thanh Chiếu); trích Niệm nô kiều và Thanh thanh mạn.',
  [[
    `<span class="eyebrow">CCL401 · Chapter 4 · Lesson 4.1</span>
<h2>Song ci: Su Shi &amp; Li Qingzhao</h2>
<h3>词 (cí) — poetry written to a tune</h3>
<p>The signature form of the Song dynasty (960–1279) is <strong>ci</strong> — lyrics fitted to pre-existing musical patterns (<strong>词牌 cípái</strong>, "tune titles"), with lines of irregular length dictated by the melody, originally sung in wine-houses. Two broad schools emerged: the bold <strong>豪放派 (hàofàng pài)</strong> and the delicate <strong>婉约派 (wǎnyuē pài)</strong>.</p>
<h3>苏轼 Sū Shì (Su Dongpo) — bold school</h3>
<p>Su Shi (1037–1101) — poet, essayist, calligrapher, statesman — stretched ci beyond romantic love into history, philosophy and exile. His "念奴娇·赤壁怀古" (<em>Charmed by Niannu: Meditation at Red Cliff</em>) opens with a sweep worthy of an epic:</p>
<pre><code>大江东去，浪淘尽，千古风流人物。

Dàjiāng dōng qù, làng táo jìn, qiāngǔ fēngliú rénwù.

"Sông lớn cuồn cuộn về đông, sóng cuốn sạch,
bao anh hùng phong lưu muôn thuở."</code></pre>
<p>His mid-autumn ci "水调歌头" closes with one of the most-quoted lines in Chinese: <strong>但愿人长久，千里共婵娟</strong> ("Dàn yuàn rén chángjiǔ, qiānlǐ gòng chányuān" — "Chỉ mong người ta sống lâu, ngàn dặm vẫn cùng chung một vầng trăng").</p>
<h3>李清照 Lǐ Qīngzhào — delicate school</h3>
<p>China's most celebrated woman poet, Li Qingzhao (1084–c.1155) began writing of wine and leisure, then, widowed and a refugee from the fall of Northern Song, turned to grief. Her "声声慢" (<em>Sheng Sheng Man</em>) opens with seven doubled, monosyllabic characters — a sound-effect no translation fully carries:</p>
<pre><code>寻寻觅觅，冷冷清清，凄凄惨惨戚戚。

Xún xún mì mì, lěng lěng qīng qīng, qī qī cǎn cǎn qī qī.

"Tìm tìm kiếm kiếm, lạnh lạnh vắng vắng,
thê thê thảm thảm sầu sầu não não."</code></pre>
<div class="callout"><span class="badge">Two schools, one form</span> Same tune-based genre, opposite temperaments: Su Shi widens ci to the scale of history and cosmos; Li Qingzhao narrows it to the exact texture of private loss.</div>`,
    `<span class="eyebrow">CCL401 · Chương 4 · Bài 4.1</span>
<h2>Từ Tống: Tô Thức &amp; Lý Thanh Chiếu</h2>
<h3>词 (từ) — thơ phổ theo điệu nhạc</h3>
<p>Thể loại tiêu biểu của đời Tống (960–1279) là <strong>từ</strong> — lời ca đặt vào các mô hình nhạc có sẵn (<strong>词牌 từ bài</strong>, "tên điệu"), câu dài ngắn không đều theo giai điệu, vốn được hát trong tửu lâu. Hai trường phái lớn hình thành: <strong>豪放派 (Hào phóng phái)</strong> và <strong>婉约派 (Uyển ước phái)</strong>.</p>
<h3>苏轼 Tô Thức (Tô Đông Pha) — phái Hào phóng</h3>
<p>Tô Thức (1037–1101) — nhà thơ, nhà văn, thư pháp gia, quan lại — mở rộng từ vượt khỏi tình yêu lãng mạn, chạm tới lịch sử, triết lý và cảnh lưu đày. Bài "念奴娇·赤壁怀古" (<em>Niệm nô kiều · Xích Bích hoài cổ</em>) mở đầu bằng khí thế hùng vĩ xứng tầm sử thi:</p>
<pre><code>大江东去，浪淘尽，千古风流人物。

Dàjiāng dōng qù, làng táo jìn, qiāngǔ fēngliú rénwù.

"Sông lớn cuồn cuộn về đông, sóng cuốn sạch,
bao anh hùng phong lưu muôn thuở."</code></pre>
<p>Bài từ trung thu "水调歌头" (Thuỷ điệu ca đầu) khép lại bằng một trong những câu được trích dẫn nhiều nhất tiếng Trung: <strong>但愿人长久，千里共婵娟</strong> ("Dàn yuàn rén chángjiǔ, qiānlǐ gòng chányuān" — "Chỉ mong người ta sống lâu, ngàn dặm vẫn cùng chung một vầng trăng").</p>
<h3>李清照 Lý Thanh Chiếu — phái Uyển ước</h3>
<p>Nữ từ nhân nổi tiếng nhất Trung Quốc, Lý Thanh Chiếu (1084–khoảng 1155) khởi đầu viết về rượu và nhàn tản, rồi khi goá bụa và phải chạy loạn lúc Bắc Tống sụp đổ, bà chuyển sang viết về nỗi đau. Bài "声声慢" (Thanh thanh mạn) mở đầu bằng bảy cặp chữ đơn âm lặp lại — hiệu ứng âm thanh mà không bản dịch nào truyền tải trọn vẹn:</p>
<pre><code>寻寻觅觅，冷冷清清，凄凄惨惨戚戚。

Xún xún mì mì, lěng lěng qīng qīng, qī qī cǎn cǎn qī qī.

"Tìm tìm kiếm kiếm, lạnh lạnh vắng vắng,
thê thê thảm thảm sầu sầu não não."</code></pre>
<div class="callout"><span class="badge">Hai trường phái, một thể loại</span> Cùng là thể loại phổ theo điệu nhạc, nhưng khí chất trái ngược: Tô Thức mở rộng từ tới tầm lịch sử và vũ trụ; Lý Thanh Chiếu thu hẹp nó về đúng kết cấu của nỗi mất mát riêng tư.</div>`,
  ]]);

const c4q = quiz('ccl401-quiz-4', 'Quiz 4 — Song ci|||Quiz 4 — Từ Tống', [
  { id: 'q1', question: '"Từ" (词) đời Tống có đặc điểm gì khác thơ Đường?', options: ['Là lời ca phổ theo điệu nhạc có sẵn (từ bài), câu dài ngắn không đều theo giai điệu', 'Luôn có đúng 8 câu, mỗi câu 5 chữ', 'Không có quy tắc thanh điệu nào', 'Chỉ được viết bằng văn ngôn cổ, không thể hát'], correctIndex: 0, explanation: 'Từ được viết theo các "từ bài" (tên điệu nhạc có sẵn), nên độ dài câu không đều, khác luật thi/tuyệt cú của thơ Đường.' },
  { id: 'q2', question: 'Tô Thức thuộc trường phái từ nào?', options: ['Uyển ước phái', 'Hào phóng phái', 'Điền viên phái', 'Biên tái phái'], correctIndex: 1, explanation: 'Tô Thức mở rộng từ tới đề tài lịch sử, triết lý, khí thế hùng vĩ — tiêu biểu cho phái Hào phóng.' },
  { id: 'q3', question: 'Lý Thanh Chiếu là ai?', options: ['Nữ từ nhân tiêu biểu phái Uyển ước đời Tống', 'Tác giả Hồng Lâu Mộng', 'Kịch tác gia đời Nguyên', 'Hoàng hậu đời Đường'], correctIndex: 0, explanation: 'Lý Thanh Chiếu là nữ từ nhân nổi tiếng nhất Trung Quốc, đại diện phái Uyển ước với ngôn từ tinh tế, giàu cảm xúc riêng tư.' },
]);

const c5 = doc('ccl401-5-1-yuan-opera-novels', '5.1 — Yuan drama & Ming-Qing novels|||5.1 — Hí khúc Nguyên & tiểu thuyết Minh-Thanh',
  '元曲 (tạp kịch Nguyên, Quan Hán Khanh) và 四大名著 (Tam Quốc, Thuỷ Hử, Tây Du Ký, Hồng Lâu Mộng) — văn học chuyển sang tự sự bạch thoại.',
  [[
    `<span class="eyebrow">CCL401 · Chapter 5 · Lesson 5.1</span>
<h2>Yuan drama &amp; the Ming-Qing novel</h2>
<h3>元曲 (Yuán qǔ) — Yuan drama</h3>
<p>Under Mongol rule (1271–1368), the civil-service exams were suspended and many literati turned to writing for the popular stage instead — creating <strong>zaju (杂剧)</strong>, verse-drama combining song, spoken dialogue and stock character roles. Its master was <strong>关汉卿 Guān Hànqīng</strong>, whose "窦娥冤" (<em>The Injustice to Dou E</em>) tells of a wrongly-executed woman whose dying curses come true — a searing indictment of corrupt justice.</p>
<pre><code>地也，你不分好歹何为地？
天也，你错勘贤愚枉做天！

Dì yě, nǐ bù fēn hǎodǎi hé wéi dì?
Tiān yě, nǐ cuò kān xián yú wǎng zuò tiān!

"Đất kia, ngươi không phân biệt tốt xấu, sao gọi là đất?
Trời kia, ngươi xét lầm hiền ngu, uổng làm trời!"</code></pre>
<h3>四大名著 — the Four Great Classical Novels</h3>
<p>Ming and Qing storytellers, building on oral performance traditions, produced the vernacular novel — long, chaptered, plot-driven prose fiction. Four works came to define the canon: <strong>三国演义</strong> (<em>Romance of the Three Kingdoms</em>, attr. Luo Guanzhong — war and statecraft), <strong>水浒传</strong> (<em>Water Margin</em>, attr. Shi Nai'an — outlaw brotherhood), <strong>西游记</strong> (<em>Journey to the West</em>, attr. Wu Cheng'en — a monk's pilgrimage with a monkey-god escort) and <strong>红楼梦</strong> (<em>Dream of the Red Chamber</em>, Cao Xueqin — the decline of an aristocratic family, China's most admired novel).</p>
<pre><code>话说天下大势，分久必合，合久必分。 （三国演义，开篇）

Huàshuō tiānxià dàshì, fēn jiǔ bì hé, hé jiǔ bì fēn.

"Nói về đại thế thiên hạ, chia lâu ắt hợp, hợp lâu ắt chia." (Tam Quốc Diễn Nghĩa, câu mở đầu)

满纸荒唐言，一把辛酸泪。 （红楼梦，开篇）

Mǎn zhǐ huāngtáng yán, yì bǎ xīnsuān lèi.

"Đầy giấy lời hoang đường, một vốc lệ chua cay." (Hồng Lâu Mộng, câu mở đầu)</code></pre>
<div class="callout"><span class="badge">The big shift</span> From this chapter on, prose narrative fiction — not poetry — becomes the genre where new literary energy concentrates. That shift culminates in the modern novel of Chapters 6–7.</div>`,
    `<span class="eyebrow">CCL401 · Chương 5 · Bài 5.1</span>
<h2>Hí khúc Nguyên &amp; tiểu thuyết Minh-Thanh</h2>
<h3>元曲 (Yuán qǔ) — Hí khúc đời Nguyên</h3>
<p>Dưới ách cai trị Mông Cổ (1271–1368), khoa cử bị đình chỉ, nhiều văn nhân chuyển sang viết cho sân khấu bình dân — hình thành <strong>tạp kịch (杂剧)</strong>, kịch có vần kết hợp ca hát, đối thoại và các vai diễn định hình. Bậc thầy của thể loại này là <strong>关汉卿 Quan Hán Khanh</strong>, với vở "窦娥冤" (<em>Đậu Nga oan</em>) kể về một người phụ nữ bị xử oan, lời nguyền lúc chết ứng nghiệm — một lời tố cáo gay gắt nền công lý thối nát.</p>
<pre><code>地也，你不分好歹何为地？
天也，你错勘贤愚枉做天！

Dì yě, nǐ bù fēn hǎodǎi hé wéi dì?
Tiān yě, nǐ cuò kān xián yú wǎng zuò tiān!

"Đất kia, ngươi không phân biệt tốt xấu, sao gọi là đất?
Trời kia, ngươi xét lầm hiền ngu, uổng làm trời!"</code></pre>
<h3>四大名著 — Tứ đại danh tác</h3>
<p>Những người kể chuyện đời Minh-Thanh, dựa trên truyền thống biểu diễn truyền khẩu, tạo ra tiểu thuyết bạch thoại — văn xuôi dài, chia hồi, nặng về cốt truyện. Bốn tác phẩm trở thành kinh điển: <strong>三国演义</strong> (<em>Tam Quốc Diễn Nghĩa</em>, tương truyền La Quán Trung — chiến tranh và mưu lược trị quốc), <strong>水浒传</strong> (<em>Thuỷ Hử</em>, tương truyền Thi Nại Am — tình huynh đệ giang hồ), <strong>西游记</strong> (<em>Tây Du Ký</em>, tương truyền Ngô Thừa Ân — hành trình thỉnh kinh của một nhà sư cùng đoàn tuỳ tùng thần thông) và <strong>红楼梦</strong> (<em>Hồng Lâu Mộng</em>, Tào Tuyết Cần — sự suy tàn của một gia tộc quý tộc, tiểu thuyết được ngưỡng mộ nhất Trung Quốc).</p>
<pre><code>话说天下大势，分久必合，合久必分。 （三国演义，开篇）

Huàshuō tiānxià dàshì, fēn jiǔ bì hé, hé jiǔ bì fēn.

"Nói về đại thế thiên hạ, chia lâu ắt hợp, hợp lâu ắt chia." (Tam Quốc Diễn Nghĩa, câu mở đầu)

满纸荒唐言，一把辛酸泪。 （红楼梦，开篇）

Mǎn zhǐ huāngtáng yán, yì bǎ xīnsuān lèi.

"Đầy giấy lời hoang đường, một vốc lệ chua cay." (Hồng Lâu Mộng, câu mở đầu)</code></pre>
<div class="callout"><span class="badge">Bước ngoặt lớn</span> Từ chương này trở đi, tiểu thuyết văn xuôi tự sự — không còn là thơ ca — trở thành thể loại tập trung năng lượng sáng tạo mới. Bước ngoặt đó lên đến đỉnh điểm ở tiểu thuyết hiện đại trong Chương 6–7.</div>`,
  ]]);

const c5q = quiz('ccl401-quiz-5', 'Quiz 5 — Yuan drama & Ming-Qing novels|||Quiz 5 — Hí khúc Nguyên & tiểu thuyết Minh-Thanh', [
  { id: 'q1', question: '"Tứ đại danh tác" của tiểu thuyết cổ điển Trung Quốc gồm những tác phẩm nào?', options: ['Tam Quốc Diễn Nghĩa, Thuỷ Hử, Tây Du Ký, Hồng Lâu Mộng', 'Ly Tao, Kinh Thi, Sở từ, Đoản ca hành', 'Đậu Nga Oan, Tây Sương Ký, Mẫu Đơn Đình, Trường Sinh Điện', 'Cao Lương Đỏ, Sống, Ếch, Phế Đô'], correctIndex: 0, explanation: 'Bốn tiểu thuyết chương hồi này được coi là đỉnh cao của tiểu thuyết cổ điển bạch thoại Minh-Thanh.' },
  { id: 'q2', question: 'Quan Hán Khanh nổi tiếng với thể loại nào đời Nguyên?', options: ['Từ Tống', 'Phú Hán', 'Hí khúc / tạp kịch (Yuan drama)', 'Tiểu thuyết chương hồi'], correctIndex: 2, explanation: 'Quan Hán Khanh là bậc thầy tạp kịch (zaju) đời Nguyên — kịch có vần kết hợp ca hát và đối thoại.' },
  { id: 'q3', question: '"Đậu Nga Oan" (窦娥冤) là tác phẩm của ai?', options: ['La Quán Trung', 'Tào Tuyết Cần', 'Quan Hán Khanh', 'Ngô Thừa Ân'], correctIndex: 2, explanation: 'Quan Hán Khanh viết vở tạp kịch "Đậu Nga Oan", kể về một người phụ nữ bị xử oan và lời nguyền ứng nghiệm.' },
]);

const c6 = doc('ccl401-6-1-lu-xun-may-fourth', '6.1 — Lu Xun & the May Fourth movement|||6.1 — Lỗ Tấn & phong trào Ngũ Tứ',
  '五四运动 (1919) thay văn ngôn bằng bạch thoại; 鲁迅 (Lỗ Tấn) — "Nhật ký người điên", "AQ chính truyện" — cha đẻ văn học hiện đại TQ.',
  [[
    `<span class="eyebrow">CCL401 · Chapter 6 · Lesson 6.1</span>
<h2>Lu Xun &amp; the May Fourth movement</h2>
<h3>五四运动 (Wǔsì Yùndòng) — May Fourth, 1919</h3>
<p>Student protests on 4 May 1919 against the Treaty of Versailles crystallized a broader <strong>New Culture Movement</strong>: a generation demanding "Mr. Science and Mr. Democracy," rejecting Confucian tradition, and — for literature — replacing <strong>classical Chinese (文言文)</strong>, a written language far from everyday speech, with <strong>vernacular Chinese (白话文)</strong>, closer to how people actually spoke. Reformer <strong>胡适 Hú Shì</strong> made the case in essays; a young writer put it into practice in fiction.</p>
<h3>鲁迅 Lǔ Xùn — father of modern Chinese literature</h3>
<p>In 1918, <strong>Lu Xun</strong> (1881–1936) published "狂人日记" (<em>Diary of a Madman</em>) — the first major vernacular short story, narrated by a man who becomes convinced that Confucian society is literally cannibalistic.</p>
<pre><code>仔细看了半夜，才从字缝里看出字来，满本都写着两个字是"吃人"！

Zǐxì kànle bànyè, cái cóng zìfèng lǐ kàn chū zì lái,
mǎn běn dōu xiězhe liǎng gè zì shì "chī rén"!

"Xem kỹ suốt nửa đêm, mới từ giữa các dòng chữ nhìn ra được chữ,
cả cuốn sách chỉ viết hai chữ: 'ăn thịt người'!"</code></pre>
<p>His novella "阿Q正传" (<em>The True Story of Ah Q</em>) followed — a satirical portrait of a peasant who converts every humiliation into an imagined "spiritual victory" (精神胜利法), a coping mechanism Lu Xun diagnosed as a national disease.</p>
<div class="callout"><span class="badge">Why it mattered</span> May Fourth writers didn't just change vocabulary — they changed who literature could speak to and about: ordinary, semi-literate people, in the language they actually used. Every modern Chinese novel since writes in the vernacular Lu Xun helped legitimize.</div>`,
    `<span class="eyebrow">CCL401 · Chương 6 · Bài 6.1</span>
<h2>Lỗ Tấn &amp; phong trào Ngũ Tứ</h2>
<h3>五四运动 (Ngũ Tứ vận động) — Ngũ Tứ, 1919</h3>
<p>Cuộc biểu tình của sinh viên ngày 4 tháng 5 năm 1919 phản đối Hoà ước Versailles đã kết tinh thành một phong trào rộng lớn hơn — <strong>Phong trào Tân Văn hoá</strong>: một thế hệ đòi hỏi "ông Khoa học và ông Dân chủ," chối bỏ truyền thống Nho giáo, và về mặt văn học — thay <strong>văn ngôn (文言文)</strong>, một thứ chữ viết cách xa lời nói hằng ngày, bằng <strong>bạch thoại văn (白话文)</strong>, gần với cách người ta thực sự nói chuyện. Nhà cải cách <strong>胡适 Hồ Thích</strong> lập luận điều này trong các bài tiểu luận; một nhà văn trẻ đã đưa nó vào thực hành bằng tiểu thuyết.</p>
<h3>鲁迅 Lỗ Tấn — cha đẻ văn học hiện đại Trung Quốc</h3>
<p>Năm 1918, <strong>Lỗ Tấn</strong> (1881–1936) công bố "狂人日记" (<em>Nhật ký người điên</em>) — truyện ngắn bạch thoại lớn đầu tiên, do một người dần tin rằng xã hội Nho giáo thực chất là ăn thịt người kể lại.</p>
<pre><code>仔细看了半夜，才从字缝里看出字来，满本都写着两个字是"吃人"！

Zǐxì kànle bànyè, cái cóng zìfèng lǐ kàn chū zì lái,
mǎn běn dōu xiězhe liǎng gè zì shì "chī rén"!

"Xem kỹ suốt nửa đêm, mới từ giữa các dòng chữ nhìn ra được chữ,
cả cuốn sách chỉ viết hai chữ: 'ăn thịt người'!"</code></pre>
<p>Truyện vừa "阿Q正传" (<em>AQ chính truyện</em>) ra đời sau đó — chân dung châm biếm một người nông dân biến mọi sự sỉ nhục thành "thắng lợi tinh thần" tưởng tượng (精神胜利法), một cơ chế tự huyễn hoặc mà Lỗ Tấn chẩn đoán như một căn bệnh của cả dân tộc.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Các nhà văn Ngũ Tứ không chỉ đổi từ vựng — họ đổi cả đối tượng mà văn học có thể nói tới và nói về: những con người bình thường, bán mù chữ, bằng chính ngôn ngữ họ dùng. Mọi tiểu thuyết Trung Quốc hiện đại từ đó đến nay đều viết bằng thứ bạch thoại mà Lỗ Tấn góp phần hợp thức hoá.</div>`,
  ]]);

const c6q = quiz('ccl401-quiz-6', 'Quiz 6 — Lu Xun & May Fourth|||Quiz 6 — Lỗ Tấn & Ngũ Tứ', [
  { id: 'q1', question: 'Phong trào Ngũ Tứ (1919) chủ trương thay thế văn ngôn bằng thứ chữ viết nào?', options: ['Sở từ', 'Bạch thoại văn (vernacular Chinese)', 'Biền văn', 'Hí khúc'], correctIndex: 1, explanation: 'Ngũ Tứ đề xướng dùng bạch thoại văn — gần với lời nói hằng ngày — thay cho văn ngôn cổ xa rời thực tế.' },
  { id: 'q2', question: '"Nhật ký người điên" (狂人日记) — truyện ngắn bạch thoại hiện đại quan trọng đầu tiên — là của ai?', options: ['Hồ Thích', 'Lỗ Tấn', 'Quách Mạt Nhược', 'Mạc Ngôn'], correctIndex: 1, explanation: 'Lỗ Tấn công bố "Nhật ký người điên" năm 1918, mở đầu tiểu thuyết bạch thoại hiện đại Trung Quốc.' },
  { id: 'q3', question: '"AQ chính truyện" của Lỗ Tấn phê phán điều gì?', options: ['Chế độ khoa cử', 'Tâm lý "thắng lợi tinh thần" — tự huyễn hoặc trước mọi sỉ nhục', 'Chiến tranh Nha phiến', 'Cách mạng Văn hoá'], correctIndex: 1, explanation: 'Nhân vật AQ biến mọi thất bại/sỉ nhục thành "thắng lợi tinh thần" tưởng tượng — Lỗ Tấn dùng đó để phê phán căn bệnh tinh thần của cả xã hội.' },
]);

const c7 = doc('ccl401-7-1-contemporary-mo-yan', '7.1 — Contemporary literature & Mo Yan|||7.1 — Văn học đương đại & Mạc Ngôn',
  'Từ văn học vết thương (伤痕文学) sau 1978 đến 莫言 Mạc Ngôn — Nobel 2012, "hiện thực huyền ảo", Cao Lương Đỏ, Ếch.',
  [[
    `<span class="eyebrow">CCL401 · Chapter 7 · Lesson 7.1</span>
<h2>Contemporary literature &amp; Mo Yan</h2>
<h3>From scars to a Nobel Prize</h3>
<p>After 1949, literature was largely subordinated to state policy; the Cultural Revolution (1966–1976) silenced most independent writing. Its aftermath produced <strong>"scar literature" (伤痕文学)</strong> — stories of the trauma just endured — followed in the 1980s by <strong>"root-seeking literature" (寻根文学)</strong>, which turned to regional folklore and myth for identity, and experimental avant-garde fiction.</p>
<h3>莫言 Mò Yán — hallucinatory realism</h3>
<p>Mo Yan (b. 1955, pen name meaning "don't speak"), from Gaomi in Shandong, became in 2012 the first China-based writer to win the <strong>Nobel Prize in Literature</strong>, cited for work that "with hallucinatory realism merges folk tales, history and the contemporary." His breakthrough novel <strong>红高粱家族</strong> (<em>Red Sorghum</em>, 1986) opens with a description of his fictional home region that fuses beauty and brutality:</p>
<pre><code>高密东北乡无疑是地球上最美丽最丑陋、最超脱最世俗、
最圣洁最龌龊、最英雄好汉最王八蛋、最能喝酒最能爱的地方。

"Vùng đông bắc Cao Mật chắc chắn là nơi đẹp nhất mà cũng xấu xí nhất,
thoát tục nhất mà cũng trần tục nhất, thánh khiết nhất mà cũng dơ bẩn nhất,
anh hùng hảo hán nhất mà cũng khốn nạn nhất, uống rượu giỏi nhất
mà cũng biết yêu say đắm nhất trên trái đất này."</code></pre>
<p>Later, <strong>蛙</strong> (<em>Frog</em>, 2009) confronts the one-child policy through the life of a rural midwife. Alongside Mo Yan, <strong>余华 Yú Huá</strong> (<em>活着</em>, <em>To Live</em>) and others extended contemporary fiction's reach into recent Chinese history's harshest chapters.</p>
<div class="callout"><span class="badge">A long circle back</span> Mo Yan's oral, regional, myth-soaked storytelling — closer in spirit to folk yuefu ballads than to Lu Xun's cool social diagnosis — shows Chinese literature returning, a century later, to the folk voice this course began with in Chapter 1.</div>`,
    `<span class="eyebrow">CCL401 · Chương 7 · Bài 7.1</span>
<h2>Văn học đương đại &amp; Mạc Ngôn</h2>
<h3>Từ vết thương đến giải Nobel</h3>
<p>Sau 1949, văn học phần lớn phục vụ chính sách nhà nước; Cách mạng Văn hoá (1966–1976) khiến hầu hết sáng tác độc lập bị dập tắt. Hậu quả của nó sinh ra <strong>"văn học vết thương" (伤痕文学)</strong> — những câu chuyện về sang chấn vừa trải qua — tiếp nối vào thập niên 1980 bằng <strong>"văn học tầm căn" (寻根文学)</strong>, quay về văn hoá dân gian và huyền thoại vùng miền để tìm bản sắc, cùng dòng tiểu thuyết thể nghiệm tiên phong.</p>
<h3>莫言 Mạc Ngôn — hiện thực huyền ảo</h3>
<p>Mạc Ngôn (sinh 1955, bút danh nghĩa là "đừng nói"), quê Cao Mật, Sơn Đông, năm 2012 trở thành nhà văn đầu tiên sống tại Trung Quốc đại lục đoạt <strong>giải Nobel Văn học</strong>, được vinh danh vì tác phẩm "bằng hiện thực huyền ảo, hoà trộn truyện dân gian, lịch sử và đương đại." Tiểu thuyết làm nên tên tuổi ông, <strong>红高粱家族</strong> (<em>Cao Lương Đỏ</em>, 1986), mở đầu bằng một đoạn mô tả quê hương hư cấu của ông, hoà trộn cái đẹp và sự tàn khốc:</p>
<pre><code>高密东北乡无疑是地球上最美丽最丑陋、最超脱最世俗、
最圣洁最龌龊、最英雄好汉最王八蛋、最能喝酒最能爱的地方。

"Vùng đông bắc Cao Mật chắc chắn là nơi đẹp nhất mà cũng xấu xí nhất,
thoát tục nhất mà cũng trần tục nhất, thánh khiết nhất mà cũng dơ bẩn nhất,
anh hùng hảo hán nhất mà cũng khốn nạn nhất, uống rượu giỏi nhất
mà cũng biết yêu say đắm nhất trên trái đất này."</code></pre>
<p>Sau này, <strong>蛙</strong> (<em>Ếch</em>, 2009) đối diện với chính sách một con qua cuộc đời một bà đỡ ở nông thôn. Cùng với Mạc Ngôn, <strong>余华 Dư Hoa</strong> (<em>活着</em>, <em>Sống</em>) và những người khác mở rộng phạm vi tiểu thuyết đương đại tới những chương khắc nghiệt nhất của lịch sử Trung Quốc gần đây.</p>
<div class="callout"><span class="badge">Một vòng quay dài</span> Lối kể chuyện truyền khẩu, đậm chất vùng miền, thấm đẫm huyền thoại của Mạc Ngôn — gần với tinh thần những khúc nhạc phủ dân gian hơn là lối chẩn đoán xã hội lạnh lùng của Lỗ Tấn — cho thấy văn học Trung Quốc, sau một thế kỷ, đang quay trở lại tiếng nói dân gian mà môn học này bắt đầu ở Chương 1.</div>`,
  ]]);

const c7q = quiz('ccl401-quiz-7', 'Quiz 7 — Contemporary literature & Mo Yan|||Quiz 7 — Văn học đương đại & Mạc Ngôn', [
  { id: 'q1', question: 'Mạc Ngôn đoạt giải Nobel Văn học năm nào?', options: ['2000', '2012', '1988', '2020'], correctIndex: 1, explanation: 'Mạc Ngôn đoạt giải Nobel Văn học năm 2012, nhà văn đầu tiên sống tại Trung Quốc đại lục nhận giải này.' },
  { id: 'q2', question: 'Phong cách văn học của Mạc Ngôn thường được gọi là gì?', options: ['Hiện thực xã hội chủ nghĩa', '"Hiện thực huyền ảo" (hallucinatory/magical realism)', 'Tượng trưng chủ nghĩa cổ điển', 'Lãng mạn chủ nghĩa thuần tuý'], correctIndex: 1, explanation: 'Uỷ ban Nobel vinh danh Mạc Ngôn vì hoà trộn hiện thực huyền ảo với truyện dân gian, lịch sử và đương đại.' },
  { id: 'q3', question: '"Cao Lương Đỏ" (红高粱家族) của Mạc Ngôn lấy bối cảnh vùng nào?', options: ['Giang Nam', 'Đông bắc Cao Mật, Sơn Đông', 'Tứ Xuyên', 'Bắc Kinh'], correctIndex: 1, explanation: 'Mạc Ngôn lấy quê hương mình, vùng Cao Mật (Sơn Đông), làm bối cảnh xuyên suốt các tiểu thuyết, trong đó có Cao Lương Đỏ.' },
]);

const c8 = doc('ccl401-8-1-review', '8.1 — Review: genres, close reading & the literary current|||8.1 — Ôn tập: thể loại, phân tích tác phẩm & dòng chảy văn học',
  'Bảng tổng kết thể loại theo triều đại, kỹ năng đọc gần một trích đoạn, và mạch chảy chung nối Kinh Thi tới Mạc Ngôn.',
  [[
    `<span class="eyebrow">CCL401 · Chapter 8 · Lesson 8.1</span>
<h2>Review: genres, close reading &amp; the literary current</h2>
<h3>One genre per era</h3>
<pre><code>先秦 Pre-Qin      诗经/楚辞   folk song  &amp; individual verse-exile
汉魏晋 Han-Wei-Jin 赋/乐府     court rhapsody &amp; pastoral turn
唐 Tang           诗 (shī)    regulated/quatrain poetry — golden age
宋 Song           词 (cí)     lyric fitted to tunes — bold vs delicate
元 Yuan           曲 (qǔ)     verse-drama — the popular stage
明清 Ming-Qing    小说        the vernacular chaptered novel
现代 Modern       白话小说    vernacular fiction — Lu Xun, May Fourth
当代 Contemporary 小说        scar / root-seeking / Mo Yan</code></pre>
<h3>How to close-read a passage in this course</h3>
<ul>
<li><strong>1. Form first</strong> — is it a four-character Shijing line, a Tang quatrain, a Song cí to a named tune, or vernacular prose? Form signals era.</li>
<li><strong>2. Voice</strong> — collective/anonymous (folk song, yuefu) or a named individual staking a personal claim (Qu Yuan, Du Fu, Li Qingzhao, Lu Xun)?</li>
<li><strong>3. Historical pressure</strong> — is the text responding to a real event (An Lushan Rebellion, the fall of Northern Song, the Cultural Revolution)? Chinese literary history is unusually legible this way.</li>
<li><strong>4. What changed next</strong> — every genre in the table above was, in its moment, a break from the one before it.</li>
</ul>
<h3>The current that runs through eight chapters</h3>
<p>Two threads recur across three thousand years: <strong>folk voice vs. individual voice</strong> (Shijing vs. Qu Yuan; yuefu ballads vs. Jian'an poets; and, a hundred years after Lu Xun's cool diagnosis, Mo Yan's return to oral regional myth) — and <strong>form under historical pressure</strong> (Du Fu's war poems; Li Qingzhao's exile lyrics; scar literature after the Cultural Revolution). Read that way, eight chapters are one long argument, not eight separate topics.</p>
<div class="callout"><span class="badge">Exam tip</span> When asked to identify or analyze an unseen excerpt, name the era from its form, then explain what historical or literary pressure it is answering — that two-step is what this whole course has been practicing.</div>`,
    `<span class="eyebrow">CCL401 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập: thể loại, phân tích tác phẩm &amp; dòng chảy văn học</h2>
<h3>Mỗi thời đại một thể loại chủ đạo</h3>
<pre><code>Tiên Tần         诗经/楚辞   ca dao tập thể &amp; thơ cá nhân lưu vong
Hán-Nguỵ-Tấn      赋/乐府     phú cung đình &amp; bước ngoặt điền viên
Đường             诗 (thi)    luật thi/tuyệt cú — thời hoàng kim
Tống              词 (từ)     lời ca theo điệu — hào phóng đối uyển ước
Nguyên            曲 (khúc)   kịch có vần — sân khấu bình dân
Minh-Thanh        小说        tiểu thuyết chương hồi bạch thoại
Hiện đại          白话小说    tiểu thuyết bạch thoại — Lỗ Tấn, Ngũ Tứ
Đương đại         小说        văn học vết thương / tầm căn / Mạc Ngôn</code></pre>
<h3>Cách đọc gần một trích đoạn trong môn này</h3>
<ul>
<li><strong>1. Thể loại trước tiên</strong> — đó là câu bốn chữ Kinh Thi, tuyệt cú đời Đường, từ Tống theo một điệu có tên, hay văn xuôi bạch thoại? Thể loại chỉ ra thời đại.</li>
<li><strong>2. Tiếng nói</strong> — tập thể/khuyết danh (ca dao, nhạc phủ) hay một cá nhân có tên đang khẳng định tiếng nói riêng (Khuất Nguyên, Đỗ Phủ, Lý Thanh Chiếu, Lỗ Tấn)?</li>
<li><strong>3. Áp lực lịch sử</strong> — văn bản có đang phản ứng với một sự kiện có thật không (loạn An Lộc Sơn, Bắc Tống sụp đổ, Cách mạng Văn hoá)? Lịch sử văn học Trung Quốc dễ đọc theo cách này một cách khác thường.</li>
<li><strong>4. Điều gì thay đổi tiếp theo</strong> — mỗi thể loại trong bảng trên, vào thời điểm của nó, đều là một sự đoạn tuyệt với thể loại trước.</li>
</ul>
<h3>Mạch chảy xuyên suốt tám chương</h3>
<p>Hai sợi chỉ lặp lại xuyên suốt ba nghìn năm: <strong>tiếng nói dân gian đối lại tiếng nói cá nhân</strong> (Kinh Thi đối Khuất Nguyên; nhạc phủ dân ca đối các nhà thơ Kiến An; và, một trăm năm sau lối chẩn đoán lạnh lùng của Lỗ Tấn, Mạc Ngôn quay về huyền thoại truyền khẩu vùng miền) — và <strong>thể loại dưới áp lực lịch sử</strong> (thơ chiến tranh của Đỗ Phủ; từ lưu vong của Lý Thanh Chiếu; văn học vết thương sau Cách mạng Văn hoá). Đọc theo cách đó, tám chương là một mạch lập luận dài, không phải tám chủ đề rời rạc.</p>
<div class="callout"><span class="badge">Mẹo làm bài</span> Khi được yêu cầu nhận diện hoặc phân tích một trích đoạn chưa từng thấy, hãy gọi tên thời đại qua thể loại của nó, rồi giải thích nó đang đáp lại áp lực lịch sử hay văn học nào — hai bước đó chính là điều cả môn học này đã luyện tập.</div>`,
  ]]);

const c8q = quiz('ccl401-quiz-8', 'Quiz 8 — Review|||Quiz 8 — Ôn tập', [
  { id: 'q1', question: 'Sắp xếp đúng trình tự dòng chảy văn học Trung Quốc theo lịch sử?', options: ['Kinh Thi/Sở từ → thơ Đường → từ Tống → hí khúc Nguyên/tiểu thuyết Minh-Thanh → văn học hiện đại Ngũ Tứ', 'Thơ Đường → Kinh Thi/Sở từ → tiểu thuyết Minh-Thanh → từ Tống → hí khúc Nguyên', 'Văn học hiện đại Ngũ Tứ → Kinh Thi/Sở từ → thơ Đường → từ Tống', 'Từ Tống → thơ Đường → Kinh Thi/Sở từ → hí khúc Nguyên'], correctIndex: 0, explanation: 'Đây đúng là trình tự lịch sử: Tiên Tần (Kinh Thi/Sở từ) → Đường (thơ) → Tống (từ) → Nguyên (hí khúc)/Minh-Thanh (tiểu thuyết) → hiện đại (Ngũ Tứ).' },
  { id: 'q2', question: 'Ghép đúng thể loại chủ đạo với triều đại: Đường - Tống - Nguyên - Minh/Thanh?', options: ['Thơ (Đường) - Từ (Tống) - Khúc/kịch (Nguyên) - Tiểu thuyết chương hồi (Minh-Thanh)', 'Từ (Đường) - Thơ (Tống) - Tiểu thuyết (Nguyên) - Khúc (Minh-Thanh)', 'Phú (Đường) - Khúc (Tống) - Thơ (Nguyên) - Từ (Minh-Thanh)', 'Tiểu thuyết (Đường) - Khúc (Tống) - Từ (Nguyên) - Thơ (Minh-Thanh)'], correctIndex: 0, explanation: 'Mỗi triều đại có một thể loại "đặc trưng" nhất được văn học sử ghi nhận: Đường-thơ, Tống-từ, Nguyên-khúc, Minh/Thanh-tiểu thuyết.' },
  { id: 'q3', question: 'Điểm chung giữa Khuất Nguyên (Sở từ) và Lỗ Tấn (Ngũ Tứ) dù cách nhau khoảng 2000 năm là gì?', options: ['Cả hai đều viết tiểu thuyết chương hồi dài', 'Cả hai đều dùng văn học để bộc lộ ưu tư và phê phán xã hội thời đại mình', 'Cả hai đều chỉ viết bằng bạch thoại hiện đại', 'Cả hai đều là quan lại được trọng dụng suốt đời'], correctIndex: 1, explanation: 'Dù cách biệt niên đại và hình thức, cả Khuất Nguyên (bị đày ải, viết Ly Tao) và Lỗ Tấn (viết Nhật ký người điên) đều dùng ngòi bút để chất vấn xã hội và thời đại họ sống.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CCL401',
    slug: 'ccl401-chinese-literature',
    title: 'Chinese Literature',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CCL401.webp',
    shortDescription: 'Chinese literature from the Book of Songs & Songs of Chu through Tang poetry, Song ci, Yuan drama, Ming-Qing novels, to Lu Xun and Mo Yan — bilingual, with original Chinese excerpts, pinyin & translation.|||Văn học Trung Quốc từ Kinh Thi, Sở từ đến thơ Đường, từ Tống, hí khúc Nguyên, tiểu thuyết Minh-Thanh, đến Lỗ Tấn và Mạc Ngôn — song ngữ, kèm trích Hán văn, pinyin & dịch nghĩa.',
    description: 'Môn <strong>CCL401 — Chinese Literature</strong> (kỳ 5, ngành Ngôn ngữ Trung) đưa sinh viên đi dọc <strong>dòng chảy lịch sử văn học Trung Quốc</strong> qua tám chương: <strong>Kinh Thi &amp; Sở từ</strong> → <strong>thơ phú Hán-Nguỵ-Tấn</strong> → <strong>thơ Đường</strong> (Lý Bạch, Đỗ Phủ, Bạch Cư Dị) → <strong>từ Tống</strong> (Tô Thức, Lý Thanh Chiếu) → <strong>hí khúc Nguyên &amp; tiểu thuyết Minh-Thanh</strong> (Tứ đại danh tác) → <strong>văn học hiện đại Ngũ Tứ</strong> (Lỗ Tấn) → <strong>văn học đương đại</strong> (Mạc Ngôn) → <strong>ôn tập</strong>. Mỗi chương gắn trích dẫn nguyên văn chữ Hán kèm pinyin và dịch nghĩa tiếng Việt, tham chiếu giáo trình 中国文学史 (袁行霈) và An Anthology of Chinese Literature (Owen).',
    whatYouLearn: 'Kinh Thi (Phong-Nhã-Tụng) & Sở từ (Khuất Nguyên, Ly Tao); phú Hán, nhạc phủ, thơ Kiến An, thơ điền viên Đào Uyên Minh; thơ Đường (luật thi/tuyệt cú, Lý Bạch, Đỗ Phủ, Bạch Cư Dị); từ Tống (hào phóng/uyển ước, Tô Thức, Lý Thanh Chiếu); tạp kịch Nguyên (Quan Hán Khanh) & tứ đại danh tác Minh-Thanh; phong trào Ngũ Tứ & Lỗ Tấn (bạch thoại văn); văn học đương đại & Mạc Ngôn (Nobel 2012); kỹ năng nhận diện thể loại và phân tích trích đoạn theo dòng lịch sử.',
    requirements: 'Không yêu cầu trình độ tiếng Trung cao; đọc được chữ Hán cơ bản và biết pinyin sẽ giúp theo trích dẫn nguyên văn dễ hơn. Nên tham khảo giáo trình chính thức trên FLM (flm.fpt.edu.vn) song song.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình 中国文学史 (袁行霈), Owen anthology, kho văn bản cổ điển miễn phí, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Lộ trình 8 chương theo dòng lịch sử văn học Trung Quốc.', lessons: [intro] },
    { title: 'Chương 1 — Kinh Thi & Sở từ|||Chapter 1 — Book of Songs & Songs of Chu', description: '诗经, 楚辞 — Khuất Nguyên, Ly Tao.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thơ phú & văn Hán-Nguỵ-Tấn|||Chapter 2 — Han-Wei-Jin rhapsody & prose', description: '汉赋, 乐府 — Tào Tháo, Đào Uyên Minh.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thơ Đường|||Chapter 3 — Tang poetry', description: 'Lý Bạch, Đỗ Phủ, Bạch Cư Dị.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Từ Tống|||Chapter 4 — Song ci', description: 'Tô Thức, Lý Thanh Chiếu.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Hí khúc Nguyên & tiểu thuyết Minh-Thanh|||Chapter 5 — Yuan drama & Ming-Qing novels', description: 'Quan Hán Khanh, Tứ đại danh tác.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Lỗ Tấn & Ngũ Tứ|||Chapter 6 — Lu Xun & May Fourth', description: 'Nhật ký người điên, AQ chính truyện.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Văn học đương đại & Mạc Ngôn|||Chapter 7 — Contemporary literature & Mo Yan', description: 'Cao Lương Đỏ, Nobel 2012.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập|||Chapter 8 — Review', description: 'Đặc trưng thể loại, phân tích tác phẩm, dòng chảy văn học.', lessons: [c8, c8q] },
  ],
};
