/**
 * CHC401 — Chinese Culture / Văn Hóa Trung Quốc. Ngành Ngôn ngữ Trung, Kỳ 5.
 * Nhấn VĂN HOÁ TRUYỀN THỐNG & tổng quát (triết học, chữ Hán/nghệ thuật, phong
 * tục, kiến trúc/trang phục, kinh kịch, triết lý sống/y học, giao thoa Việt-
 * Trung) — KHÔNG lặp phần kinh doanh (CCB401: guanxi/mianzi/đàm phán) hay đất
 * nước học/địa lý-chính trị (CCS401). Giáo trình trích dẫn: 中国文化概论
 * (张岱年), The Cambridge Illustrated History of China (Ebrey).
 * Song ngữ + thuật ngữ Hán (UTF-8) + pinyin có dấu thanh thật.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('chc401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: 中国文化概论 (张岱年), The Cambridge Illustrated History of China (Ebrey), tài liệu chính thức miễn phí, YouTube, công cụ tra Hán tự, lộ trình tự học.',
  [[
    `<span class="eyebrow">CHC401 · Materials</span>
<h2>Chinese Culture &amp; resource hub</h2>
<p class="lead">Everything to learn traditional Chinese culture — civilization &amp; dynasties, philosophy &amp; religion, calligraphy &amp; painting, customs &amp; festivals, architecture &amp; arts, opera, philosophy of life &amp; medicine, and Sino-Vietnamese exchange — in one place.</p>
<h3>📘 Core textbooks (cited, not uploaded)</h3>
<ul>
<li><strong>中国文化概论</strong> (<em>Introduction to Chinese Culture</em>) — 张岱年 (Zhāng Dàinián), the standard Chinese-language survey used in most 对外汉语 (Chinese-as-foreign-language) culture courses.</li>
<li><strong>The Cambridge Illustrated History of China</strong> — Patricia Buckley Ebrey, an accessible English-language history from prehistory to the present.</li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="http://www.chinaculture.org/" target="_blank" rel="noopener">chinaculture.org</a> — Ministry of Culture and Tourism's English-language culture portal.</li>
<li><a href="https://www.britannica.com/place/China/Cultural-life" target="_blank" rel="noopener">Britannica — China: Cultural life</a></li>
<li><a href="https://www.metmuseum.org/toah/ht/09/eac.html" target="_blank" rel="noopener">The Met — Heilbrunn Timeline: China</a> — art history by dynasty, with images.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@CGTN" target="_blank" rel="noopener">CGTN Culture</a> — documentaries on festivals, heritage, arts.</li>
<li><a href="https://www.youtube.com/results?search_query=peking+opera+documentary" target="_blank" rel="noopener">Peking opera &amp; traditional crafts documentaries</a> — search for 京剧, 剪纸, 中医 explainers.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — look up 汉字 (Hanzi), pinyin, stroke order.</li>
<li><a href="https://www.archchinese.com/chinese_stroke_order.html" target="_blank" rel="noopener">Arch Chinese</a> — stroke order animations for calligraphy practice.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the dynasty timeline, and the three pillars 儒释道 (Confucianism/Buddhism/Daoism).</li>
<li><strong>Practice</strong> — learn 15-20 key terms in Hanzi + pinyin per chapter; recognize them in context.</li>
<li><strong>Go deeper</strong> — connect philosophy to visible practice: calligraphy, festivals, architecture, opera.</li>
<li><strong>Apply</strong> — compare with Vietnamese culture (Chapter 8) to see what was shared and what diverged.</li>
</ol></div>`,
    `<span class="eyebrow">CHC401 · Tài liệu</span>
<h2>Trung tâm tài liệu Văn hoá Trung Quốc</h2>
<p class="lead">Mọi thứ để học văn hoá truyền thống Trung Hoa — văn minh &amp; triều đại, triết học &amp; tín ngưỡng, thư pháp &amp; hội hoạ, phong tục &amp; lễ tết, kiến trúc &amp; nghệ thuật, kinh kịch, triết lý sống &amp; y học, giao thoa Việt-Trung — gom về một chỗ.</p>
<h3>📘 Giáo trình chính (trích dẫn, không đính kèm file)</h3>
<ul>
<li><strong>中国文化概论</strong> (<em>Đại cương Văn hoá Trung Quốc</em>) — 张岱年 (Trương Đại Niên), giáo trình tiếng Trung chuẩn dùng trong hầu hết môn văn hoá của chương trình 对外汉语 (dạy tiếng Trung cho người nước ngoài).</li>
<li><strong>The Cambridge Illustrated History of China</strong> — Patricia Buckley Ebrey, lịch sử tiếng Anh dễ tiếp cận từ thời tiền sử tới hiện đại.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="http://www.chinaculture.org/" target="_blank" rel="noopener">chinaculture.org</a> — cổng văn hoá tiếng Anh của Bộ Văn hoá &amp; Du lịch TQ.</li>
<li><a href="https://www.britannica.com/place/China/Cultural-life" target="_blank" rel="noopener">Britannica — China: Cultural life</a></li>
<li><a href="https://www.metmuseum.org/toah/ht/09/eac.html" target="_blank" rel="noopener">The Met — Heilbrunn Timeline: China</a> — lịch sử nghệ thuật theo triều đại, kèm ảnh.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@CGTN" target="_blank" rel="noopener">CGTN Culture</a> — phim tài liệu về lễ hội, di sản, nghệ thuật.</li>
<li><a href="https://www.youtube.com/results?search_query=peking+opera+documentary" target="_blank" rel="noopener">Phim tài liệu kinh kịch &amp; nghề thủ công</a> — tìm 京剧, 剪纸, 中医.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — tra 汉字, pinyin, thứ tự nét.</li>
<li><a href="https://www.archchinese.com/chinese_stroke_order.html" target="_blank" rel="noopener">Arch Chinese</a> — hoạt hình thứ tự nét để luyện thư pháp.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — trục thời gian triều đại, và ba trụ cột 儒释道 (Nho-Phật-Đạo).</li>
<li><strong>Luyện tập</strong> — học 15-20 thuật ngữ Hán tự + pinyin mỗi chương; nhận ra khi gặp trong ngữ cảnh.</li>
<li><strong>Đào sâu</strong> — nối triết học với thực hành hữu hình: thư pháp, lễ tết, kiến trúc, kinh kịch.</li>
<li><strong>Vận dụng</strong> — so sánh với văn hoá Việt Nam (Chương 8) để thấy điểm chung và điểm khác biệt.</li>
</ol></div>`,
  ]]);

const intro = doc('chc401-0-1-overview', 'Course overview: Chinese Culture|||Tổng quan: Văn hoá Trung Quốc',
  'CHC401 khác CCB401 (văn hoá kinh doanh) và CCS401 (đất nước học) — nhấn văn hoá TRUYỀN THỐNG: triết học, phong tục, nghệ thuật, tín ngưỡng. Lộ trình 8 chương.',
  [[
    `<span class="eyebrow">CHC401 · Lesson 0.1 · Overview</span>
<h2>Chinese Culture — traditional &amp; general culture</h2>
<p class="lead">This course studies <strong>traditional Chinese culture</strong>: the philosophy, customs, arts, and beliefs that shaped Chinese civilization over three millennia. It is <em>not</em> about business etiquette (that's CCB401 — guānxì 关系, miànzi 面子, negotiation) and it is not a country-studies survey of geography/politics/economy (that's CCS401). Here, the question is: <strong>what do Chinese people believe, make, and celebrate — and why?</strong></p>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li>Overview of Chinese civilization &amp; dynasties</li>
<li>Confucianism, Daoism &amp; Buddhism (儒释道)</li>
<li>Chinese characters, calligraphy &amp; painting (书法, 国画)</li>
<li>Customs, festivals &amp; cuisine (春节, 茶文化)</li>
<li>Architecture, clothing &amp; traditional arts</li>
<li>Peking opera, music &amp; performing arts (京剧)</li>
<li>Philosophy of life, feng shui &amp; traditional medicine (中医, 风水)</li>
<li>Sino-Vietnamese cultural exchange &amp; modern Chinese culture</li>
</ol>
<div class="callout"><span class="badge">How to read the terms</span> Each chapter gives key vocabulary as <strong>汉字 (Hanzi) + pinyin with real tone marks + Vietnamese/English meaning</strong> — the same term you'll meet again in HSK culture sections and in CCS401/CCB401.</div>`,
    `<span class="eyebrow">CHC401 · Bài 0.1 · Tổng quan</span>
<h2>Văn hoá Trung Quốc — văn hoá truyền thống &amp; tổng quát</h2>
<p class="lead">Môn này học <strong>văn hoá truyền thống Trung Hoa</strong>: triết học, phong tục, nghệ thuật và tín ngưỡng định hình nền văn minh Trung Hoa suốt ba nghìn năm. Đây <em>không phải</em> nghi thức kinh doanh (đó là CCB401 — guānxì 关系, miànzi 面子, đàm phán) và cũng không phải khảo sát đất nước học về địa lý/chính trị/kinh tế (đó là CCS401). Ở đây, câu hỏi là: <strong>người Trung Quốc tin gì, làm gì, và mừng lễ gì — và vì sao?</strong></p>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li>Tổng quan văn minh Trung Hoa &amp; các triều đại</li>
<li>Nho giáo, Đạo giáo &amp; Phật giáo (儒释道)</li>
<li>Chữ Hán, thư pháp &amp; hội hoạ (书法, 国画)</li>
<li>Phong tục, lễ tết &amp; ẩm thực (春节, 茶文化)</li>
<li>Kiến trúc, trang phục &amp; nghệ thuật truyền thống</li>
<li>Kinh kịch, âm nhạc &amp; nghệ thuật biểu diễn (京剧)</li>
<li>Triết lý sống, phong thuỷ &amp; y học cổ truyền (中医, 风水)</li>
<li>Giao thoa văn hoá Trung-Việt &amp; văn hoá Trung Quốc hiện đại</li>
</ol>
<div class="callout"><span class="badge">Cách đọc thuật ngữ</span> Mỗi chương cho từ khoá dạng <strong>汉字 (chữ Hán) + pinyin có dấu thanh thật + nghĩa tiếng Việt/Anh</strong> — đúng thuật ngữ bạn sẽ gặp lại trong phần văn hoá của HSK và trong CCS401/CCB401.</div>`,
  ]]);

const c1 = doc('chc401-1-1-civilization-dynasties', '1.1 — Chinese civilization overview & dynasties|||1.1 — Tổng quan văn minh Trung Hoa & các triều đại',
  'Cái nôi sông Hoàng Hà; trục triều đại 夏商周→秦汉→隋唐→宋元→明清; Thiên mệnh (天命) — vì sao triều đại đổi.',
  [[
    `<span class="eyebrow">CHC401 · Chapter 1 · Lesson 1.1</span>
<h2>Chinese civilization overview &amp; dynasties</h2>
<p>Chinese civilization grew along the <strong>Yellow River (黄河, Huáng Hé)</strong> and the Yangtze (长江, Cháng Jiāng), among the world's oldest continuous civilizations. Dynastic history is the backbone every other chapter refers back to.</p>
<pre><code>夏 Xià       ~2070-1600 BCE  semi-legendary; earliest dynasty in tradition
商 Shāng     ~1600-1046 BCE  oracle bone script 甲骨文 (jiǎgǔwén), bronze vessels
周 Zhōu      1046-256 BCE    Mandate of Heaven 天命 (Tiānmìng); Confucius born
秦 Qín       221-206 BCE     First unification; 秦始皇 (Qín Shǐhuáng); Great Wall 长城
汉 Hàn       206 BCE-220 CE  Confucianism = state ideology; Silk Road 丝绸之路
唐 Táng      618-907         Golden age; cosmopolitan capital 长安 (Cháng'ān); poetry
宋 Sòng      960-1279        Printing, compass, gunpowder; Neo-Confucianism
元 Yuán      1271-1368       Mongol rule (Kublai Khan)
明 Míng      1368-1644       Forbidden City 紫禁城; Zheng He's voyages 郑和下西洋
清 Qīng      1644-1912       Last dynasty (Manchu); fell in the 1911 Revolution
</code></pre>
<h3>The Mandate of Heaven (天命 Tiānmìng)</h3>
<p>A recurring idea explaining <em>why</em> dynasties rise and fall: Heaven grants a ruler the right to govern as long as he rules justly; natural disasters, rebellion, or corruption were read as signs the Mandate had been withdrawn. This concept — not a divine-right-forever claim — is why Chinese history reads as a repeating cycle of unification → golden age → decline → new dynasty, rather than one continuous line.</p>
<div class="callout"><span class="badge">Why it matters</span> Almost every later chapter anchors to a dynasty: calligraphy peaks in the Tang/Song, Peking opera is Qing-era, the Forbidden City is Ming. Knowing the order lets you place any artifact in time.</div>`,
    `<span class="eyebrow">CHC401 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan văn minh Trung Hoa &amp; các triều đại</h2>
<p>Văn minh Trung Hoa hình thành dọc sông <strong>Hoàng Hà (黄河, Huáng Hé)</strong> và Trường Giang (长江, Cháng Jiāng), một trong những nền văn minh liên tục lâu đời nhất thế giới. Trục triều đại là khung xương mà mọi chương sau đều quay lại tham chiếu.</p>
<pre><code>夏 Hạ (Xià)       ~2070-1600 TCN  bán huyền thoại; triều đại sớm nhất theo truyền thống
商 Thương (Shāng) ~1600-1046 TCN  chữ giáp cốt 甲骨文 (jiǎgǔwén), đồ đồng
周 Chu (Zhōu)     1046-256 TCN    Thiên mệnh 天命 (Tiānmìng); Khổng Tử ra đời
秦 Tần (Qín)      221-206 TCN     Thống nhất lần đầu; 秦始皇 (Tần Thuỷ Hoàng); Vạn Lý Trường Thành 长城
汉 Hán (Hàn)      206 TCN-220 SCN Nho giáo = quốc giáo; Con đường Tơ lụa 丝绸之路
唐 Đường (Táng)   618-907         Thời hoàng kim; kinh đô 长安 (Trường An); thơ ca
宋 Tống (Sòng)    960-1279        In ấn, la bàn, thuốc súng; Tân Nho giáo
元 Nguyên (Yuán)  1271-1368       Nhà Nguyên Mông (Hốt Tất Liệt)
明 Minh (Míng)    1368-1644       Tử Cấm Thành 紫禁城; các chuyến đi của Trịnh Hoà 郑和下西洋
清 Thanh (Qīng)   1644-1912       Triều đại cuối cùng (người Mãn); sụp đổ ở Cách mạng Tân Hợi 1911
</code></pre>
<h3>Thiên mệnh (天命 Tiānmìng)</h3>
<p>Một ý tưởng lặp lại giải thích <em>vì sao</em> triều đại lên rồi xuống: Trời trao cho người cai trị quyền cai quản chừng nào ông ta còn trị vì công chính; thiên tai, khởi nghĩa, hay tham nhũng bị đọc như dấu hiệu Thiên mệnh đã bị rút lại. Đây không phải lời khẳng định "quyền trời ban vĩnh viễn" — đó là lý do lịch sử Trung Hoa đọc như một vòng lặp thống nhất → thời hoàng kim → suy tàn → triều đại mới, chứ không phải một đường thẳng liên tục.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Gần như mọi chương sau đều neo vào một triều đại: thư pháp đỉnh cao ở Đường/Tống, kinh kịch thuộc thời Thanh, Tử Cấm Thành thuộc thời Minh. Biết đúng thứ tự giúp bạn đặt bất kỳ hiện vật nào vào đúng thời điểm.</div>`,
  ]]);

const c1q = quiz('chc401-quiz-1', 'Quiz 1 — Civilization & dynasties|||Quiz 1 — Văn minh & triều đại', [
  { id: 'q1', question: 'Triều đại nào thống nhất Trung Quốc lần đầu và xây Vạn Lý Trường Thành?', options: ['汉 Hán', '秦 Qín (Tần)', '唐 Táng (Đường)', '清 Qīng (Thanh)'], correctIndex: 1, explanation: 'Tần Thuỷ Hoàng (秦始皇) thống nhất Trung Quốc năm 221 TCN, xây Vạn Lý Trường Thành 长城.' },
  { id: 'q2', question: '天命 (Thiên mệnh) dùng để giải thích điều gì?', options: ['Vì sao chữ Hán ra đời', 'Vì sao triều đại lên rồi sụp đổ', 'Cách pha trà công phu', 'Quy tắc thư pháp'], correctIndex: 1, explanation: 'Thiên mệnh giải thích tính chính danh của người trị vì và vì sao triều đại có thể mất quyền cai trị.' },
  { id: 'q3', question: 'Thời hoàng kim với kinh đô Trường An (长安), thơ ca nở rộ, thuộc triều đại nào?', options: ['商 Shāng', '宋 Sòng', '唐 Táng', '元 Yuán'], correctIndex: 2, explanation: 'Nhà Đường (618-907) là thời hoàng kim, kinh đô Trường An, thơ Đường nổi tiếng.' },
]);

const c2 = doc('chc401-2-1-confucianism-daoism-buddhism', '2.1 — Confucianism, Daoism & Buddhism (儒释道)|||2.1 — Nho giáo, Đạo giáo & Phật giáo (儒释道)',
  '儒家 Nho giáo (仁, 礼, 孝); 道家 Đạo giáo (道, 无为); 佛教 Phật giáo (Thiền tông); 三教合一 hoà quyện chứ không loại trừ.',
  [[
    `<span class="eyebrow">CHC401 · Chapter 2 · Lesson 2.1</span>
<h2>Confucianism, Daoism &amp; Buddhism (儒释道)</h2>
<p>Chinese thought is not one religion but <strong>three traditions that blended</strong> — often summarized as 儒释道 (Rú Shì Dào): Confucianism (儒), Buddhism (释, from 佛 Fó), and Daoism (道).</p>
<h3>儒家 Rújiā — Confucianism</h3>
<p>Founded by <strong>孔子 Kǒngzǐ</strong> (Confucius, 551-479 BCE). Core values: <strong>仁 rén</strong> (benevolence, humaneness), <strong>礼 lǐ</strong> (ritual propriety, correct social behavior), <strong>孝 xiào</strong> (filial piety), and the <strong>五伦 wǔlún</strong> (Five Relationships: ruler-subject, father-son, husband-wife, elder-younger sibling, friend-friend) that structure social order through mutual obligation, not law alone.</p>
<h3>道家 Dàojiā — Daoism</h3>
<p>Attributed to <strong>老子 Lǎozǐ</strong> (author of the <em>道德经 Dàodéjīng</em>) and <strong>庄子 Zhuāngzǐ</strong>. Central idea: <strong>道 Dào</strong>, "the Way" — the natural order underlying everything — and <strong>无为 wúwéi</strong>, "non-action" or acting in effortless accordance with that order, rather than forcing outcomes.</p>
<h3>佛教 Fójiào — Buddhism</h3>
<p>Entered China from India via the Silk Road (~1st century CE) and sinicized into <strong>禅宗 Chánzōng</strong> (Chan/Zen Buddhism), which fused Buddhist meditation with Daoist naturalness.</p>
<pre><code>儒 Rú  (Confucianism) -> social order: 仁 rén, 礼 lǐ, 孝 xiào
道 Dào (Daoism)        -> natural order: 道 Dào, 无为 wúwéi
释 Shì (Buddhism)      -> spiritual liberation: 禅 chán (meditation)
三教合一 sān jiào héyī  -> "the three teachings merge into one"
</code></pre>
<div class="callout"><span class="badge">Not exclusive</span> A traditional Chinese person could follow Confucian ethics at work, Daoist aesthetics in leisure, and Buddhist ritual at a funeral — the three were seen as complementary layers, not competing religions to choose between.</div>`,
    `<span class="eyebrow">CHC401 · Chương 2 · Bài 2.1</span>
<h2>Nho giáo, Đạo giáo &amp; Phật giáo (儒释道)</h2>
<p>Tư tưởng Trung Hoa không phải một tôn giáo duy nhất mà là <strong>ba dòng hoà quyện với nhau</strong> — thường gọi tắt là 儒释道 (Rú Shì Dào): Nho giáo (儒), Phật giáo (释, từ 佛 Fó), và Đạo giáo (道).</p>
<h3>儒家 Rújiā — Nho giáo</h3>
<p>Sáng lập bởi <strong>孔子 Khổng Tử</strong> (Kǒngzǐ, 551-479 TCN). Giá trị cốt lõi: <strong>仁 rén</strong> (nhân, lòng nhân ái), <strong>礼 lǐ</strong> (lễ, phép tắc ứng xử đúng mực), <strong>孝 xiào</strong> (hiếu, hiếu thảo), và <strong>五伦 wǔlún</strong> (Ngũ luân: vua-tôi, cha-con, chồng-vợ, anh-em, bạn-bè) — cấu trúc trật tự xã hội qua nghĩa vụ hai chiều, không chỉ bằng luật pháp.</p>
<h3>道家 Dàojiā — Đạo giáo</h3>
<p>Gắn với <strong>老子 Lão Tử</strong> (tác giả <em>道德经 Đạo Đức Kinh</em>) và <strong>庄子 Trang Tử</strong>. Ý tưởng trung tâm: <strong>道 Đạo</strong>, "Con Đường" — trật tự tự nhiên nằm dưới mọi thứ — và <strong>无为 vô vi</strong>, "không hành động cưỡng ép" — hành xử thuận theo trật tự đó thay vì ép buộc kết quả.</p>
<h3>佛教 Fójiào — Phật giáo</h3>
<p>Du nhập vào Trung Quốc từ Ấn Độ qua Con đường Tơ lụa (~thế kỷ 1 SCN) và bản địa hoá thành <strong>禅宗 Thiền tông</strong> (Chánzōng), hoà thiền định Phật giáo với tính tự nhiên của Đạo giáo.</p>
<pre><code>儒 Nho  (Confucianism) -> trật tự xã hội: 仁 nhân, 礼 lễ, 孝 hiếu
道 Đạo  (Daoism)       -> trật tự tự nhiên: 道 Đạo, 无为 vô vi
释 Thích (Buddhism)    -> giải thoát tâm linh: 禅 thiền (chán)
三教合一 tam giáo hợp nhất -> "ba giáo lý hoà làm một"
</code></pre>
<div class="callout"><span class="badge">Không loại trừ nhau</span> Một người Trung Hoa truyền thống có thể theo đạo đức Nho giáo lúc làm việc, thẩm mỹ Đạo giáo lúc nghỉ ngơi, và nghi lễ Phật giáo lúc tang ma — ba dòng được xem là các lớp bổ trợ nhau, không phải tôn giáo cạnh tranh buộc phải chọn một.</div>`,
  ]]);

const c2q = quiz('chc401-quiz-2', 'Quiz 2 — Confucianism, Daoism & Buddhism|||Quiz 2 — Nho, Đạo, Phật', [
  { id: 'q1', question: '仁 (rén) trong Nho giáo nghĩa gần nhất là?', options: ['Vô vi', 'Lòng nhân ái, nhân đức', 'Thiền định', 'Phong thuỷ'], correctIndex: 1, explanation: '仁 rén là giá trị cốt lõi của Khổng Tử — lòng nhân, nhân ái.' },
  { id: 'q2', question: '无为 (wúwéi) là khái niệm trung tâm của dòng tư tưởng nào?', options: ['儒家 Nho giáo', '道家 Đạo giáo', '佛教 Phật giáo', '风水 Phong thuỷ'], correctIndex: 1, explanation: 'Vô vi (无为) — hành động thuận tự nhiên — là ý tưởng cốt lõi của Đạo giáo (Lão Tử, Trang Tử).' },
  { id: 'q3', question: '三教合一 nghĩa là gì?', options: ['Ba triều đại hợp nhất', 'Ba giáo lý (Nho-Phật-Đạo) hoà quyện, không loại trừ nhau', 'Ba loại chữ Hán cổ', 'Ba trường phái thư pháp'], correctIndex: 1, explanation: '三教合一 — "ba giáo lý hợp làm một" — người TQ truyền thống theo cả ba, không chọn một bỏ hai.' },
]);

const c3 = doc('chc401-3-1-hanzi-calligraphy-painting', '3.1 — Chinese characters, calligraphy & painting (书法, 国画)|||3.1 — Chữ Hán, thư pháp & hội hoạ (书法, 国画)',
  'Tiến hoá chữ Hán 甲骨文→楷书; Tứ Bảo Văn Phòng 文房四宝; Vương Hy Chi 王羲之; hội hoạ thuỷ mặc 水墨画 & lưu bạch 留白.',
  [[
    `<span class="eyebrow">CHC401 · Chapter 3 · Lesson 3.1</span>
<h2>Chinese characters, calligraphy &amp; painting</h2>
<h3>How 汉字 (Hànzì) evolved</h3>
<pre><code>甲骨文 jiǎgǔwén  oracle bone script  (Shang, ~1300 BCE) — carved on turtle shells/bones
金文   jīnwén    bronze script       (Zhou)             — cast into bronze vessels
篆书   zhuànshū  seal script         (Qin)              — standardized by Qin Shi Huang
隶书   lìshū     clerical script     (Han)              — flatter, faster to write
楷书   kǎishū    regular script      (Tang-present)     — today's standard printed form
</code></pre>
<h3>书法 Shūfǎ — calligraphy</h3>
<p>Calligraphy is considered a fine art, not just writing — practiced with the <strong>文房四宝 wénfáng sìbǎo</strong> ("Four Treasures of the Study"): brush <strong>笔 bǐ</strong>, ink <strong>墨 mò</strong>, paper <strong>纸 zhǐ</strong>, and inkstone <strong>砚 yàn</strong>. The most celebrated calligrapher is <strong>王羲之 Wáng Xīzhī</strong> (303-361), whose <em>兰亭集序 Lántíng Jí Xù</em> ("Preface to the Poems Collected from the Orchid Pavilion") is still studied as the model of running script.</p>
<h3>国画 Guóhuà — traditional painting</h3>
<p>Chinese painting favors <strong>水墨画 shuǐmòhuà</strong> (ink wash painting) over color, with two dominant genres: <strong>山水 shānshuǐ</strong> (landscape — literally "mountain-water") and <strong>花鸟 huāniǎo</strong> (birds-and-flowers). A defining aesthetic is <strong>留白 liúbái</strong>, "leaving blankness" — empty space is not unfinished, it is deliberate, suggesting mist, sky, or water and inviting the viewer's imagination.</p>
<div class="callout"><span class="badge">Same tool, two arts</span> Calligraphy and painting share the same brush, ink and paper — mastery of the brush stroke is why the two are traditionally taught and judged together.</div>`,
    `<span class="eyebrow">CHC401 · Chương 3 · Bài 3.1</span>
<h2>Chữ Hán, thư pháp &amp; hội hoạ</h2>
<h3>汉字 (Hán tự) tiến hoá thế nào</h3>
<pre><code>甲骨文 jiǎgǔwén  chữ giáp cốt      (Thương, ~1300 TCN) — khắc trên mai rùa/xương
金文   jīnwén    chữ kim văn       (Chu)               — đúc trên đồ đồng
篆书   zhuànshū  chữ triện         (Tần)               — chuẩn hoá bởi Tần Thuỷ Hoàng
隶书   lìshū     chữ lệ            (Hán)               — phẳng hơn, viết nhanh hơn
楷书   kǎishū    chữ khải          (Đường-nay)         — dạng chuẩn in ấn ngày nay
</code></pre>
<h3>书法 Shūfǎ — thư pháp</h3>
<p>Thư pháp được xem là mỹ thuật, không chỉ là viết chữ — thực hành với <strong>文房四宝 wénfáng sìbǎo</strong> ("Tứ Bảo Văn Phòng"): bút <strong>笔 bǐ</strong>, mực <strong>墨 mò</strong>, giấy <strong>纸 zhǐ</strong>, và nghiên mực <strong>砚 yàn</strong>. Nhà thư pháp được tôn vinh nhất là <strong>王羲之 Vương Hy Chi</strong> (303-361), với tác phẩm <em>兰亭集序 Lan Đình Tập Tự</em> ("Lời tựa thơ ở Đình Lan") vẫn được học như mẫu mực của chữ hành thư.</p>
<h3>国画 Guóhuà — hội hoạ truyền thống</h3>
<p>Hội hoạ Trung Hoa ưu tiên <strong>水墨画 shuǐmòhuà</strong> (tranh thuỷ mặc) hơn màu sắc, với hai thể loại chủ đạo: <strong>山水 shānshuǐ</strong> (sơn thuỷ — nghĩa đen "núi-nước") và <strong>花鸟 huāniǎo</strong> (hoa điểu — hoa và chim). Một thẩm mỹ đặc trưng là <strong>留白 liúbái</strong>, "để trống" — khoảng trắng không phải chưa vẽ xong, mà là chủ ý, gợi sương mù, bầu trời, hay mặt nước, mời người xem tự tưởng tượng.</p>
<div class="callout"><span class="badge">Chung công cụ, hai môn nghệ thuật</span> Thư pháp và hội hoạ dùng chung bút, mực, giấy — làm chủ được nét bút là lý do hai môn này truyền thống được dạy và đánh giá cùng nhau.</div>`,
  ]]);

const c3q = quiz('chc401-quiz-3', 'Quiz 3 — Characters, calligraphy & painting|||Quiz 3 — Chữ Hán, thư pháp & hội hoạ', [
  { id: 'q1', question: 'Dạng chữ Hán cổ nhất, khắc trên mai rùa/xương, gọi là?', options: ['楷书 kǎishū', '甲骨文 jiǎgǔwén', '隶书 lìshū', '篆书 zhuànshū'], correctIndex: 1, explanation: '甲骨文 (chữ giáp cốt) là dạng chữ Hán cổ nhất được biết đến, thời nhà Thương.' },
  { id: 'q2', question: '文房四宝 (Tứ Bảo Văn Phòng) gồm bút, mực, giấy và?', options: ['Quạt giấy', '砚 nghiên mực', '瓷器 đồ sứ', '折扇 quạt xếp'], correctIndex: 1, explanation: 'Tứ Bảo Văn Phòng: 笔 bút, 墨 mực, 纸 giấy, 砚 nghiên mực.' },
  { id: 'q3', question: '留白 (liúbái) trong hội hoạ Trung Hoa nghĩa là gì?', options: ['Vẽ bằng màu trắng duy nhất', 'Cố ý để khoảng trống, gợi mở cho người xem', 'Lỗi vẽ chưa hoàn thành', 'Kỹ thuật pha mực đậm'], correctIndex: 1, explanation: 'Liúbái là thẩm mỹ chủ động để trống không gian, không phải tranh vẽ dở.' },
]);

const c4 = doc('chc401-4-1-customs-festivals-cuisine', '4.1 — Customs, festivals & cuisine (春节, 茶文化)|||4.1 — Phong tục, lễ tết & ẩm thực (春节, 茶文化)',
  'Lịch âm 农历; 春节 Tết Nguyên Đán, 中秋节 Trung Thu, 端午节 Đoan Ngọ; văn hoá trà 茶文化 & triết lý ẩm thực cân bằng.',
  [[
    `<span class="eyebrow">CHC401 · Chapter 4 · Lesson 4.1</span>
<h2>Customs, festivals &amp; cuisine</h2>
<p>Most major Chinese festivals follow the <strong>农历 Nónglì</strong> (lunar calendar), not the solar Gregorian one — that's why their dates shift each year.</p>
<pre><code>春节 Chūnjié      Spring Festival (Lunar New Year) — reunion dinner, 红包 hóngbāo
                  (red envelopes), 春联 chūnlián (couplets on doorframes)
中秋节 Zhōngqiū Jié Mid-Autumn Festival — 月饼 yuèbǐng (mooncakes), family reunion
                  under the full moon
端午节 Duānwǔ Jié   Dragon Boat Festival — 粽子 zòngzi (sticky rice dumplings),
                  commemorates poet 屈原 Qū Yuán
</code></pre>
<h3>茶文化 Chá wénhuà — tea culture</h3>
<p>Tea is a social ritual, not just a drink. Major types — green, oolong, pu'er — are brewed differently; the elaborate <strong>功夫茶 gōngfu chá</strong> ("kung-fu tea") ceremony uses small cups and repeated short infusions to draw out layered flavor, and serving tea is itself a gesture of respect (e.g. to elders, or to apologize).</p>
<h3>Food philosophy</h3>
<p>Traditional Chinese cuisine aims for <strong>balance</strong> — of flavor (sweet/sour/bitter/spicy/salty), texture, and even the "heating"/"cooling" properties of ingredients (a folk-medicine idea, connected to Chapter 7's yin-yang). Regional variety is vast, often grouped into the <strong>八大菜系 bā dà càixì</strong> ("eight great cuisines," e.g. Sichuan 川菜, Cantonese 粤菜) — there is no single "Chinese food."</p>
<div class="callout"><span class="badge">Shared with Vietnam</span> Tết Nguyên Đán and Tết Trung Thu are the Vietnamese versions of 春节 and 中秋节 — Chapter 8 looks at what carried over and what changed.</div>`,
    `<span class="eyebrow">CHC401 · Chương 4 · Bài 4.1</span>
<h2>Phong tục, lễ tết &amp; ẩm thực</h2>
<p>Hầu hết lễ tết lớn của Trung Quốc theo <strong>农历 Nónglì</strong> (âm lịch), không theo lịch dương Gregory — đó là lý do ngày lễ đổi mỗi năm.</p>
<pre><code>春节 Chūnjié      Tết Nguyên Đán (Xuân tiết) — cơm đoàn viên, 红包 hóngbāo
                  (lì xì), 春联 chūnlián (câu đối dán trước cửa)
中秋节 Zhōngqiū Jié Tết Trung Thu — 月饼 yuèbǐng (bánh trung thu), đoàn viên
                  gia đình dưới trăng tròn
端午节 Duānwǔ Jié   Tết Đoan Ngọ — 粽子 zòngzi (bánh chưng/bánh ú nếp),
                  tưởng nhớ nhà thơ 屈原 Khuất Nguyên
</code></pre>
<h3>茶文化 Chá wénhuà — văn hoá trà</h3>
<p>Trà là nghi thức xã hội, không chỉ là thức uống. Các loại chính — trà xanh, ô long, phổ nhĩ — được pha khác nhau; nghi thức <strong>功夫茶 gōngfu chá</strong> ("trà công phu") dùng chén nhỏ và nhiều lượt hãm ngắn để lấy trọn hương vị theo lớp, và mời trà tự nó là cử chỉ tôn trọng (vd với người lớn tuổi, hay để xin lỗi).</p>
<h3>Triết lý ẩm thực</h3>
<p>Ẩm thực Trung Hoa truyền thống hướng tới <strong>sự cân bằng</strong> — về vị (ngọt/chua/đắng/cay/mặn), kết cấu, và cả tính "nóng"/"mát" của nguyên liệu (quan niệm dân gian, liên hệ âm dương ở Chương 7). Sự đa dạng vùng miền rất lớn, thường gộp thành <strong>八大菜系 bā dà càixì</strong> ("tám trường phái ẩm thực lớn", vd Tứ Xuyên 川菜, Quảng Đông 粤菜) — không có một "món ăn Trung Quốc" duy nhất.</p>
<div class="callout"><span class="badge">Điểm chung với Việt Nam</span> Tết Nguyên Đán và Tết Trung Thu ở Việt Nam chính là bản Việt hoá của 春节 và 中秋节 — Chương 8 sẽ xem điều gì được giữ lại và điều gì đã biến đổi.</div>`,
  ]]);

const c4q = quiz('chc401-quiz-4', 'Quiz 4 — Customs, festivals & cuisine|||Quiz 4 — Phong tục, lễ tết & ẩm thực', [
  { id: 'q1', question: 'Lễ tết Trung Quốc chủ yếu tính theo lịch nào?', options: ['Lịch dương Gregory', '农历 âm lịch', 'Lịch Julian', 'Không theo lịch nào'], correctIndex: 1, explanation: '春节, 中秋节, 端午节 đều tính theo 农历 (âm lịch) nên ngày dương lịch đổi mỗi năm.' },
  { id: 'q2', question: '粽子 (zòngzi) gắn liền với lễ tết nào và nhân vật nào?', options: ['中秋节 — Hằng Nga', '端午节 — 屈原 Khuất Nguyên', '春节 — Táo Quân', '清明节 — Khổng Tử'], correctIndex: 1, explanation: 'Zòngzi (bánh ú nếp) gắn với Tết Đoan Ngọ, tưởng nhớ nhà thơ Khuất Nguyên.' },
  { id: 'q3', question: '八大菜系 (bā dà càixì) nói lên điều gì về ẩm thực Trung Quốc?', options: ['Chỉ có 8 món ăn nổi tiếng', 'Có nhiều trường phái ẩm thực vùng miền khác nhau, không phải một khối', 'Mọi món đều cay như Tứ Xuyên', 'Trà chỉ có 8 loại'], correctIndex: 1, explanation: 'Tám trường phái ẩm thực lớn cho thấy sự đa dạng vùng miền, không có "món Trung Quốc" đồng nhất.' },
]);

const c5 = doc('chc401-5-1-architecture-clothing-arts', '5.1 — Architecture, clothing & traditional arts|||5.1 — Kiến trúc, trang phục & nghệ thuật truyền thống',
  '四合院 nhà tứ hợp viện, 紫禁城 Tử Cấm Thành, 斗拱 kết cấu đấu củng; 汉服/旗袍 trang phục; 剪纸/刺绣/瓷器 thủ công.',
  [[
    `<span class="eyebrow">CHC401 · Chapter 5 · Lesson 5.1</span>
<h2>Architecture, clothing &amp; traditional arts</h2>
<h3>Architecture</h3>
<p>The classic residential form is the <strong>四合院 sìhéyuàn</strong> — a courtyard house with four buildings enclosing a central open space, oriented north-south and organized by family hierarchy (elders in the main north hall). At imperial scale, the <strong>紫禁城 Zǐjìnchéng</strong> (Forbidden City, Ming-Qing) applies the same logic of axial symmetry and enclosed courtyards. Traditional wooden buildings use <strong>斗拱 dǒugǒng</strong>, an interlocking bracket system that transfers roof weight to columns without nails — allowing huge overhanging eaves.</p>
<h3>Clothing</h3>
<ul>
<li><strong>汉服 Hànfú</strong> — the historical clothing of the Han ethnic majority across dynasties: flowing robes, wide sleeves, wrapped-front closure (交领 jiāolǐng).</li>
<li><strong>旗袍 Qípáo</strong> — originated from Manchu (Qing) dress, modernized into the fitted, high-collared silhouette in 1920s Shanghai; still the standard "formal Chinese dress" today.</li>
</ul>
<h3>Traditional crafts</h3>
<ul>
<li><strong>剪纸 Jiǎnzhǐ</strong> — paper-cutting, often red, pasted on windows for festivals (especially 春节).</li>
<li><strong>刺绣 Cìxiù</strong> — embroidery; the <strong>四大名绣 sì dà míngxiù</strong> ("Four Great Embroideries") are Sū 苏绣, Xiāng 湘绣, Yuè 粤绣, Shǔ 蜀绣, named after their regions.</li>
<li><strong>瓷器 Cíqì</strong> — porcelain, historically centered in <strong>景德镇 Jǐngdézhèn</strong> ("Porcelain Capital"); the English word "china" comes from this export.</li>
</ul>
<div class="callout"><span class="badge">One logic, many forms</span> Symmetry, enclosure, and hierarchy show up in the courtyard house AND the imperial palace — architecture literalizes the same social order Chapter 2's Confucianism describes.</div>`,
    `<span class="eyebrow">CHC401 · Chương 5 · Bài 5.1</span>
<h2>Kiến trúc, trang phục &amp; nghệ thuật truyền thống</h2>
<h3>Kiến trúc</h3>
<p>Kiểu nhà ở cổ điển là <strong>四合院 sìhéyuàn</strong> (tứ hợp viện) — nhà có bốn dãy nhà bao quanh một sân trong, hướng bắc-nam, sắp xếp theo tôn ti gia đình (người lớn tuổi ở gian chính hướng bắc). Ở quy mô cung đình, <strong>紫禁城 Zǐjìnchéng</strong> (Tử Cấm Thành, thời Minh-Thanh) áp dụng cùng logic đối xứng trục và sân khép kín. Kiến trúc gỗ truyền thống dùng <strong>斗拱 dǒugǒng</strong> (đấu củng), hệ kết cấu lồng khớp truyền trọng lượng mái xuống cột mà không cần đinh — cho phép mái nhô rất xa.</p>
<h3>Trang phục</h3>
<ul>
<li><strong>汉服 Hànfú</strong> — trang phục lịch sử của tộc Hán qua các triều đại: áo dài thướt tha, tay áo rộng, vạt áo chéo cài bên (交领 jiāolǐng).</li>
<li><strong>旗袍 Qípáo</strong> (sườn xám) — bắt nguồn từ trang phục người Mãn (nhà Thanh), hiện đại hoá thành dáng ôm, cổ cao ở Thượng Hải thập niên 1920; ngày nay vẫn là "trang phục lễ phục chuẩn" của Trung Quốc.</li>
</ul>
<h3>Nghề thủ công truyền thống</h3>
<ul>
<li><strong>剪纸 Jiǎnzhǐ</strong> — cắt giấy, thường màu đỏ, dán lên cửa sổ dịp lễ tết (nhất là 春节).</li>
<li><strong>刺绣 Cìxiù</strong> — thêu; <strong>四大名绣 sì dà míngxiù</strong> ("Tứ Đại Danh Tú") gồm Tô 苏绣, Tương 湘绣, Việt 粤绣, Thục 蜀绣, đặt tên theo vùng miền.</li>
<li><strong>瓷器 Cíqì</strong> — đồ sứ, trung tâm lịch sử là <strong>景德镇 Jǐngdézhèn</strong> ("Kinh đô đồ sứ"); từ "china" trong tiếng Anh bắt nguồn từ mặt hàng xuất khẩu này.</li>
</ul>
<div class="callout"><span class="badge">Một logic, nhiều hình thức</span> Đối xứng, khép kín, và tôn ti xuất hiện cả ở nhà tứ hợp viện LẪN cung điện hoàng gia — kiến trúc hiện thực hoá đúng trật tự xã hội mà Nho giáo (Chương 2) mô tả.</div>`,
  ]]);

const c5q = quiz('chc401-quiz-5', 'Quiz 5 — Architecture, clothing & arts|||Quiz 5 — Kiến trúc, trang phục & nghệ thuật', [
  { id: 'q1', question: '四合院 (sìhéyuàn) là kiểu kiến trúc nào?', options: ['Chùa tháp nhiều tầng', 'Nhà ở có sân trong, bốn dãy nhà bao quanh', 'Cung điện nổi trên nước', 'Nhà thuyền'], correctIndex: 1, explanation: 'Sìhéyuàn là nhà tứ hợp viện — sân trong bao quanh bởi bốn dãy nhà, sắp theo tôn ti.' },
  { id: 'q2', question: '旗袍 (Qípáo) có nguồn gốc từ đâu rồi được hiện đại hoá ở đâu?', options: ['Trang phục Hán cổ, hiện đại hoá ở Bắc Kinh', 'Trang phục người Mãn, hiện đại hoá ở Thượng Hải thập niên 1920', 'Trang phục Mông Cổ, hiện đại hoá ở Hàng Châu', 'Trang phục Tây Tạng, không thay đổi'], correctIndex: 1, explanation: 'Qípáo bắt nguồn từ trang phục Mãn Thanh, được may ôm hiện đại ở Thượng Hải những năm 1920.' },
  { id: 'q3', question: '斗拱 (dǒugǒng) trong kiến trúc gỗ Trung Hoa có chức năng gì?', options: ['Trang trí mái ngói', 'Hệ kết cấu lồng khớp truyền tải trọng mái xuống cột, không cần đinh', 'Hệ thống thoát nước mưa', 'Cửa sổ chạm khắc'], correctIndex: 1, explanation: 'Dǒugǒng là hệ đấu-củng bằng gỗ lồng khớp, truyền trọng lượng mái xuống cột.' },
]);

const c6 = doc('chc401-6-1-opera-music-performing-arts', '6.1 — Peking opera, music & performing arts (京剧)|||6.1 — Kinh kịch, âm nhạc & nghệ thuật biểu diễn (京剧)',
  '京剧 tứ hành đương 生旦净丑; 脸谱 mặt nạ & màu sắc; nhạc cụ 二胡/古筝/琵琶; 川剧 biến kiểm.',
  [[
    `<span class="eyebrow">CHC401 · Chapter 6 · Lesson 6.1</span>
<h2>Peking opera, music &amp; performing arts</h2>
<h3>京剧 Jīngjù — Peking opera</h3>
<p>China's most famous stage art, combining <strong>singing, dialogue, mime, martial arts and acrobatics</strong> in one performance. Roles fall into four types (<strong>行当 hángdang</strong>): <strong>生 shēng</strong> (male lead), <strong>旦 dàn</strong> (female role, historically also played by men), <strong>净 jìng</strong> (painted-face, bold male roles), and <strong>丑 chǒu</strong> (clown).</p>
<h3>脸谱 Liǎnpǔ — facial masks &amp; color symbolism</h3>
<pre><code>红 red     -> loyalty, courage         (e.g. Guan Yu 关羽)
白 white   -> treachery, cunning       (e.g. Cao Cao 曹操)
黑 black   -> integrity, boldness      (e.g. Bao Zheng 包拯)
蓝/绿 blue/green -> stubbornness, wildness
金/银 gold/silver -> deities, spirits, supernatural beings
</code></pre>
<h3>Traditional instruments</h3>
<ul>
<li><strong>二胡 Èrhú</strong> — two-string bowed fiddle, expressive and closest in feel to a human voice.</li>
<li><strong>古筝 Gǔzhēng</strong> — plucked zither with movable bridges, 21+ strings.</li>
<li><strong>琵琶 Pípá</strong> — four-string plucked lute, played held upright.</li>
</ul>
<h3>Regional operas beyond Beijing</h3>
<p><strong>越剧 Yuèjù</strong> (Shaoxing/Zhejiang opera) and <strong>川剧 Chuānjù</strong> (Sichuan opera) are regional forms; Sichuan opera is internationally known for <strong>变脸 biànliǎn</strong> ("face-changing") — performers swap painted silk masks in a split second, a closely guarded stage technique.</p>
<div class="callout"><span class="badge">Read the face, know the character</span> An audience can tell a hero from a villain before a single line is sung, just from mask color — Peking opera builds meaning into every visual choice.</div>`,
    `<span class="eyebrow">CHC401 · Chương 6 · Bài 6.1</span>
<h2>Kinh kịch, âm nhạc &amp; nghệ thuật biểu diễn</h2>
<h3>京剧 Jīngjù — Kinh kịch (Kịch Bắc Kinh)</h3>
<p>Loại hình sân khấu nổi tiếng nhất Trung Quốc, kết hợp <strong>hát, thoại, kịch câm, võ thuật và nhào lộn</strong> trong một vở diễn. Vai diễn chia thành bốn loại (<strong>行当 hángdang</strong>): <strong>生 sinh</strong> (vai nam chính), <strong>旦 đán</strong> (vai nữ, xưa cũng do nam đóng), <strong>净 tịnh</strong> (vai vẽ mặt, nam mạnh mẽ), và <strong>丑 sửu</strong> (vai hề).</p>
<h3>脸谱 Liǎnpǔ — mặt nạ &amp; biểu tượng màu sắc</h3>
<pre><code>红 đỏ     -> trung nghĩa, dũng cảm        (vd Quan Vũ 关羽)
白 trắng  -> gian trá, mưu mô             (vd Tào Tháo 曹操)
黑 đen    -> chính trực, cương nghị       (vd Bao Chửng 包拯)
蓝/绿 xanh dương/lục -> ương ngạnh, hoang dã
金/银 vàng/bạc -> thần thánh, yêu quái, thế lực siêu nhiên
</code></pre>
<h3>Nhạc cụ truyền thống</h3>
<ul>
<li><strong>二胡 Èrhú</strong> — đàn nhị hai dây kéo cung, biểu cảm, gần với giọng người nhất.</li>
<li><strong>古筝 Gǔzhēng</strong> — đàn tranh gảy dây, có ngựa đàn di động, 21 dây trở lên.</li>
<li><strong>琵琶 Pípá</strong> — đàn tỳ bà bốn dây gảy, ôm đàn thẳng đứng khi chơi.</li>
</ul>
<h3>Các loại hình kịch địa phương khác</h3>
<p><strong>越剧 Yuèjù</strong> (kịch Việt/Chiết Giang) và <strong>川剧 Chuānjù</strong> (kịch Tứ Xuyên) là các loại hình vùng miền; kịch Tứ Xuyên nổi tiếng thế giới với <strong>变脸 biànliǎn</strong> ("biến kiểm" — đổi mặt) — diễn viên đổi mặt nạ lụa vẽ trong tích tắc, một kỹ thuật sân khấu được giữ bí mật.</p>
<div class="callout"><span class="badge">Nhìn mặt, biết vai</span> Khán giả có thể phân biệt anh hùng và phản diện trước cả khi lời hát cất lên, chỉ từ màu mặt nạ — Kinh kịch gửi ý nghĩa vào từng lựa chọn thị giác.</div>`,
  ]]);

const c6q = quiz('chc401-quiz-6', 'Quiz 6 — Opera, music & performing arts|||Quiz 6 — Kinh kịch, âm nhạc & biểu diễn', [
  { id: 'q1', question: 'Trong 脸谱 (mặt nạ Kinh kịch), màu trắng thường biểu thị điều gì?', options: ['Trung nghĩa, dũng cảm', 'Gian trá, mưu mô', 'Thần thánh', 'Hề, hài hước'], correctIndex: 1, explanation: 'Màu trắng trong mặt nạ Kinh kịch biểu thị nhân vật gian trá, mưu mô (vd Tào Tháo).' },
  { id: 'q2', question: '变脸 (biànliǎn) là kỹ thuật đặc trưng của loại hình kịch nào?', options: ['京剧 Kinh kịch', '越剧 Kịch Việt', '川剧 Kịch Tứ Xuyên', '昆曲 Kịch Côn Khúc'], correctIndex: 2, explanation: 'Biến kiểm (đổi mặt nạ tức thời) là kỹ thuật đặc trưng của kịch Tứ Xuyên (川剧).' },
  { id: 'q3', question: 'Nhạc cụ nào là đàn kéo cung hai dây, gần với giọng người nhất?', options: ['古筝 Gǔzhēng', '琵琶 Pípá', '二胡 Èrhú', '笛子 Dízi'], correctIndex: 2, explanation: 'Èrhú (đàn nhị) là đàn kéo cung hai dây, nổi tiếng vì âm sắc biểu cảm gần giọng người.' },
]);

const c7 = doc('chc401-7-1-philosophy-fengshui-medicine', '7.1 — Philosophy of life, feng shui & traditional medicine (中医, 风水)|||7.1 — Triết lý sống, phong thuỷ & y học cổ truyền (中医, 风水)',
  '阴阳 âm dương & 五行 ngũ hành làm ngữ pháp chung; 风水 phong thuỷ (khí 气); 中医 y học cổ truyền (kinh lạc, châm cứu); 中庸 trung dung.',
  [[
    `<span class="eyebrow">CHC401 · Chapter 7 · Lesson 7.1</span>
<h2>Philosophy of life, feng shui &amp; traditional medicine</h2>
<h3>阴阳 Yīnyáng &amp; 五行 Wǔxíng — the shared grammar</h3>
<p><strong>阴阳 Yīnyáng</strong> (yin-yang) describes reality as pairs of opposite, complementary forces (dark/light, still/moving, cold/hot) that balance rather than cancel each other. <strong>五行 Wǔxíng</strong>, the Five Elements — <strong>金木水火土</strong> (metal, wood, water, fire, earth) — describe how forces generate and constrain one another in cycles. Together they are the conceptual toolkit behind feng shui, medicine, and much everyday reasoning about balance.</p>
<h3>风水 Fēngshuǐ — "wind-water"</h3>
<p>A system for reading how <strong>气 qì</strong> (life energy/flow) moves through a landscape or a building, and orienting structures to gather favorable qi and avoid harmful currents — hence the north-south axis and enclosed courtyards seen in Chapter 5's architecture.</p>
<h3>中医 Zhōngyī — Traditional Chinese Medicine</h3>
<ul>
<li><strong>气 Qì</strong> — vital energy circulating through the body.</li>
<li><strong>经络 Jīngluò</strong> — meridians, the pathways qi is believed to flow along.</li>
<li><strong>针灸 Zhēnjiǔ</strong> — acupuncture, inserting needles at points along the meridians.</li>
<li><strong>中药 Zhōngyào</strong> — herbal medicine, prescribed to restore yin-yang balance rather than target a single germ.</li>
</ul>
<h3>中庸 Zhōngyōng — the Doctrine of the Mean</h3>
<p>A Confucian-linked life philosophy: virtue lies in moderation and balance, avoiding extremes in both action and emotion — <strong>和谐 héxié</strong> ("harmony") as the guiding value of a well-lived life.</p>
<div class="callout"><span class="badge">Framework, not superstition, for this course</span> These systems are studied here as historically influential ways of organizing knowledge — not as medical claims to be taken as fact.</div>`,
    `<span class="eyebrow">CHC401 · Chương 7 · Bài 7.1</span>
<h2>Triết lý sống, phong thuỷ &amp; y học cổ truyền</h2>
<h3>阴阳 Âm dương &amp; 五行 Ngũ hành — ngữ pháp chung</h3>
<p><strong>阴阳 Yīnyáng</strong> (âm dương) mô tả thực tại như những cặp lực đối lập nhưng bổ trợ nhau (tối/sáng, tĩnh/động, lạnh/nóng) — cân bằng chứ không triệt tiêu nhau. <strong>五行 Wǔxíng</strong>, Ngũ hành — <strong>金木水火土</strong> (kim, mộc, thuỷ, hoả, thổ) — mô tả cách các lực sinh ra và khắc chế nhau theo chu kỳ. Cùng nhau, đây là bộ công cụ khái niệm đứng sau phong thuỷ, y học, và nhiều cách suy nghĩ về sự cân bằng trong đời sống hằng ngày.</p>
<h3>风水 Fēngshuǐ — "gió-nước"</h3>
<p>Một hệ thống đọc cách <strong>气 khí</strong> (năng lượng sống/dòng chảy) di chuyển qua cảnh quan hay một công trình, và định hướng kiến trúc để đón khí lành, tránh dòng khí xấu — đây là lý do có trục bắc-nam và sân khép kín trong kiến trúc ở Chương 5.</p>
<h3>中医 Zhōngyī — Y học cổ truyền Trung Hoa</h3>
<ul>
<li><strong>气 Khí</strong> — năng lượng sống lưu thông trong cơ thể.</li>
<li><strong>经络 Kinh lạc</strong> — đường dẫn được cho là khí lưu thông theo.</li>
<li><strong>针灸 Châm cứu</strong> — châm kim vào các huyệt dọc kinh lạc.</li>
<li><strong>中药 Trung dược</strong> — thuốc thảo dược, kê để khôi phục cân bằng âm dương chứ không nhắm một mầm bệnh cụ thể.</li>
</ul>
<h3>中庸 Zhōngyōng — Trung Dung</h3>
<p>Một triết lý sống gắn với Nho giáo: đức hạnh nằm ở sự chừng mực và cân bằng, tránh cực đoan cả trong hành động lẫn cảm xúc — <strong>和谐 héxié</strong> ("hài hoà") là giá trị dẫn đường của một đời sống tốt đẹp.</p>
<div class="callout"><span class="badge">Khung tham chiếu, không phải mê tín, trong môn này</span> Các hệ thống này được học ở đây như những cách tổ chức tri thức có ảnh hưởng lịch sử — không phải khẳng định y khoa cần xem là sự thật.</div>`,
  ]]);

const c7q = quiz('chc401-quiz-7', 'Quiz 7 — Philosophy, feng shui & medicine|||Quiz 7 — Triết lý, phong thuỷ & y học', [
  { id: 'q1', question: '五行 (Ngũ hành) gồm những yếu tố nào?', options: ['Kim, mộc, thuỷ, hoả, thổ', 'Âm, dương, khí, lễ, nghĩa', 'Sinh, đán, tịnh, sửu', 'Nhân, nghĩa, lễ, trí, tín'], correctIndex: 0, explanation: 'Ngũ hành (五行): 金 kim, 木 mộc, 水 thuỷ, 火 hoả, 土 thổ.' },
  { id: 'q2', question: '风水 (fēngshuǐ) là hệ thống dùng để làm gì?', options: ['Bốc thuốc trị bệnh', 'Đọc dòng chảy của khí (气) để định hướng công trình', 'Chọn màu mặt nạ Kinh kịch', 'Tính lịch âm cho lễ tết'], correctIndex: 1, explanation: 'Phong thuỷ đọc cách khí lưu chuyển qua cảnh quan/công trình để định hướng xây dựng.' },
  { id: 'q3', question: '针灸 (châm cứu) dựa trên khái niệm nào của y học cổ truyền?', options: ['Vi khuẩn và kháng sinh', '经络 kinh lạc — đường dẫn khí trong cơ thể', '阴阳 chỉ dùng trong ẩm thực', '五行 chỉ dùng trong phong thuỷ'], correctIndex: 1, explanation: 'Châm cứu châm kim vào huyệt dọc theo 经络 (kinh lạc), nơi khí được cho là lưu thông.' },
]);

const c8 = doc('chc401-8-1-sino-vietnamese-exchange-modern', '8.1 — Sino-Vietnamese cultural exchange & modern Chinese culture|||8.1 — Giao thoa văn hoá Trung - Việt & văn hoá Trung Quốc hiện đại',
  'Chữ Hán/chữ Nôm, khoa cử Nho học, lễ tết chung, 12 con giáp — điểm chung THẬT & khác biệt cần kiểm chứng; văn hoá đại chúng, 国潮 hiện đại.',
  [[
    `<span class="eyebrow">CHC401 · Chapter 8 · Lesson 8.1</span>
<h2>Sino-Vietnamese cultural exchange &amp; modern Chinese culture</h2>
<h3>What was historically shared</h3>
<ul>
<li><strong>Chinese characters (chữ Hán)</strong> were Vietnam's official writing system for over a thousand years; Vietnamese scholars later adapted characters to write Vietnamese itself as <strong>chữ Nôm</strong>.</li>
<li>The <strong>Confucian civil-service exam system (科举 kējǔ)</strong> was adopted for selecting officials.</li>
<li>The <strong>lunar calendar</strong> and its festivals — 春节/Tết Nguyên Đán, 中秋节/Tết Trung Thu — and the <strong>十二生肖 shí'èr shēngxiào</strong> (12-animal zodiac) are shared frameworks, each locally adapted (e.g. Vietnam's zodiac swaps the ox for the water buffalo in casual usage, and the rabbit for the cat).</li>
</ul>
<h3>What diverged — and why generalizing is risky</h3>
<p>Centuries of Vietnamese resistance to Chinese rule (and later independence) produced a distinct identity within a shared vocabulary — Tết customs, dress, and cuisine differ from their Chinese counterparts in real, specific ways. A claim like "Vietnamese culture is just Chinese culture" is exactly the kind of code-vs-data mistake to avoid: the shared origin does not tell you what a modern practice actually looks like — that has to be checked, not assumed.</p>
<h3>Modern Chinese culture</h3>
<p>Alongside tradition, contemporary China runs on <strong>C-dramas</strong>, apps like <strong>微信 Wēixìn</strong> (WeChat) and <strong>抖音 Dǒuyīn</strong> (Douyin/TikTok's China version), and <strong>国潮 guócháo</strong> ("national trend") — a fashion/design movement blending traditional aesthetics (Hanfu silhouettes, calligraphy motifs) with streetwear. Chinese-language teaching abroad (Confucius Institutes) is part of this same modern outward-facing culture.</p>
<div class="callout"><span class="badge">This chapter's method</span> State what's genuinely shared, name what's genuinely different, and flag what would need checking (dates, exact customs) before being stated as fact — the same discipline used throughout this course.</div>`,
    `<span class="eyebrow">CHC401 · Chương 8 · Bài 8.1</span>
<h2>Giao thoa văn hoá Trung-Việt &amp; văn hoá Trung Quốc hiện đại</h2>
<h3>Điều gì thực sự dùng chung trong lịch sử</h3>
<ul>
<li><strong>Chữ Hán</strong> là văn tự chính thức của Việt Nam hơn một nghìn năm; học giả Việt sau đó cải biên chữ Hán để ghi tiếng Việt thành <strong>chữ Nôm</strong>.</li>
<li>Hệ thống <strong>khoa cử Nho học (科举 kējǔ)</strong> được dùng để tuyển quan lại.</li>
<li><strong>Âm lịch</strong> và các lễ tết đi kèm — 春节/Tết Nguyên Đán, 中秋节/Tết Trung Thu — cùng <strong>十二生肖 shí'èr shēngxiào</strong> (12 con giáp) là khung dùng chung, mỗi nơi bản địa hoá riêng (vd 12 con giáp Việt Nam thay Sửu bằng trâu trong cách gọi thông thường, và Mão là mèo chứ không phải thỏ).</li>
</ul>
<h3>Điều gì khác biệt — và vì sao khái quát hoá là rủi ro</h3>
<p>Nhiều thế kỷ Việt Nam chống lại và sau đó độc lập khỏi ách đô hộ Trung Hoa đã tạo ra một bản sắc riêng biệt trong lớp từ vựng chung — phong tục Tết, trang phục, ẩm thực Việt khác Trung Quốc ở những điểm cụ thể, có thật. Câu nói kiểu "văn hoá Việt Nam chỉ là văn hoá Trung Quốc" chính là kiểu sai lầm "mã nói khả năng, dữ liệu nói thực tế": nguồn gốc chung không cho biết một tập tục hiện đại thực sự trông ra sao — điều đó phải được kiểm chứng, không được mặc định.</p>
<h3>Văn hoá Trung Quốc hiện đại</h3>
<p>Song song với truyền thống, Trung Quốc đương đại vận hành với <strong>phim truyền hình Hoa ngữ</strong>, các ứng dụng như <strong>微信 Wēixìn</strong> (WeChat) và <strong>抖音 Dǒuyīn</strong> (Douyin — bản Trung Quốc của TikTok), và <strong>国潮 guócháo</strong> ("trào lưu quốc gia") — phong trào thời trang/thiết kế hoà thẩm mỹ truyền thống (dáng Hán phục, hoạ tiết thư pháp) với streetwear. Việc dạy tiếng Trung ra nước ngoài (Viện Khổng Tử) cũng nằm trong dòng chảy văn hoá hướng ngoại hiện đại này.</p>
<div class="callout"><span class="badge">Phương pháp của chương này</span> Nói rõ điều gì thực sự dùng chung, gọi tên điều gì thực sự khác biệt, và đánh dấu điều gì cần kiểm chứng (ngày tháng, tập tục cụ thể) trước khi phát biểu như sự thật — đúng kỷ luật xuyên suốt môn học này.</div>`,
  ]]);

const c8q = quiz('chc401-quiz-8', 'Quiz 8 — Sino-Vietnamese exchange & modern culture|||Quiz 8 — Giao thoa Việt-Trung & văn hoá hiện đại', [
  { id: 'q1', question: 'Người Việt cải biên chữ Hán để ghi tiếng Việt, tạo ra hệ chữ nào?', options: ['Chữ Quốc ngữ', 'Chữ Nôm', 'Chữ Triện', 'Chữ Khải'], correctIndex: 1, explanation: 'Chữ Nôm được học giả Việt tạo ra dựa trên chữ Hán để ghi âm tiếng Việt.' },
  { id: 'q2', question: 'Vì sao câu "văn hoá Việt Nam chỉ là văn hoá Trung Quốc" là khái quát rủi ro?', options: ['Vì hai nước không hề liên quan lịch sử', 'Vì nguồn gốc chung không suy ra được tập tục hiện đại giống hệt — cần kiểm chứng cụ thể', 'Vì Việt Nam không dùng âm lịch', 'Vì Việt Nam không có Tết Trung Thu'], correctIndex: 1, explanation: 'Có gốc chung (chữ Hán, khoa cử, lễ tết) nhưng thực hành cụ thể đã phân hoá — phải kiểm chứng, không mặc định.' },
  { id: 'q3', question: '国潮 (guócháo) là trào lưu gì trong văn hoá Trung Quốc hiện đại?', options: ['Phong trào bảo tồn thư pháp cổ điển thuần tuý', 'Trào lưu thời trang/thiết kế hoà thẩm mỹ truyền thống với streetwear hiện đại', 'Chính sách xuất khẩu đồ sứ', 'Một loại hình kinh kịch mới'], correctIndex: 1, explanation: 'Guócháo ("trào lưu quốc gia") pha trộn yếu tố thẩm mỹ truyền thống với thời trang/thiết kế đương đại.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CHC401',
    slug: 'chc401-van-hoa-trung-quoc',
    title: 'Văn Hóa Trung Quốc',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHC401.webp',
    shortDescription: 'Traditional Chinese culture — civilization & dynasties, Confucianism/Daoism/Buddhism, calligraphy & painting, festivals & cuisine, architecture & arts, Peking opera, feng shui & TCM, China-Vietnam exchange. Bilingual, real Chinese terms & quizzes.|||Văn hoá truyền thống Trung Hoa — văn minh & triều đại, Nho-Phật-Đạo, thư pháp & hội hoạ, lễ tết & ẩm thực, kiến trúc & nghệ thuật, kinh kịch, phong thuỷ & y học cổ truyền, giao thoa Việt-Trung. Song ngữ, thuật ngữ Hán tự & quiz.',
    description: 'Môn <strong>CHC401 — Chinese Culture / Văn Hóa Trung Quốc</strong> (kỳ 5, ngành Ngôn ngữ Trung) học <strong>văn hoá truyền thống &amp; tổng quát</strong> Trung Hoa — khác CCB401 (văn hoá kinh doanh) và CCS401 (đất nước học). Từ <strong>văn minh &amp; triều đại</strong> → <strong>Nho-Phật-Đạo (儒释道)</strong> → <strong>chữ Hán, thư pháp &amp; hội hoạ</strong> → <strong>phong tục, lễ tết &amp; ẩm thực</strong> → <strong>kiến trúc, trang phục &amp; thủ công</strong> → <strong>Kinh kịch &amp; âm nhạc</strong> → <strong>triết lý sống, phong thuỷ &amp; y học cổ truyền</strong> → <strong>giao thoa văn hoá Trung-Việt &amp; văn hoá hiện đại</strong>. Song ngữ Việt-Anh, kèm thuật ngữ Hán tự (UTF-8) + pinyin có dấu thanh, ví dụ minh hoạ và quiz mỗi chương.',
    whatYouLearn: 'Trục triều đại & Thiên mệnh; 儒释道 Nho-Phật-Đạo (仁/礼/孝, 道/无为, Thiền tông); tiến hoá chữ Hán & thư pháp (文房四宝), hội hoạ thuỷ mặc (留白); lễ tết âm lịch (春节/中秋节/端午节) & văn hoá trà; kiến trúc tứ hợp viện/Tử Cấm Thành, trang phục Hán phục/xường xám, thủ công (剪纸/刺绣/瓷器); Kinh kịch (脸谱, hành đương) & nhạc cụ truyền thống; âm dương/ngũ hành, phong thuỷ, y học cổ truyền (中医); giao thoa văn hoá Trung-Việt & văn hoá đại chúng hiện đại (国潮).',
    requirements: 'Không yêu cầu tiếng Trung trước đó — thuật ngữ Hán tự đều kèm pinyin & nghĩa Việt/Anh. Nên đã học qua CCB401/CCS401 hoặc có hiểu biết cơ bản về ngành Ngôn ngữ Trung là một lợi thế, không bắt buộc.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: '中国文化概论 (张岱年), Cambridge Illustrated History of China (Ebrey), tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Phạm vi CHC401 khác CCB401/CCS401; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Văn minh & triều đại|||Chapter 1 — Civilization & dynasties', description: 'Trục triều đại 夏商周→清; Thiên mệnh 天命.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nho, Đạo, Phật (儒释道)|||Chapter 2 — Confucianism, Daoism & Buddhism', description: '仁/礼/孝, 道/无为, Thiền tông, 三教合一.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chữ Hán, thư pháp & hội hoạ|||Chapter 3 — Characters, calligraphy & painting', description: '甲骨文→楷书, 文房四宝, 王羲之, 留白.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phong tục, lễ tết & ẩm thực|||Chapter 4 — Customs, festivals & cuisine', description: '春节/中秋节/端午节, 茶文化, 八大菜系.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kiến trúc, trang phục & thủ công|||Chapter 5 — Architecture, clothing & crafts', description: '四合院/紫禁城, 汉服/旗袍, 剪纸/刺绣/瓷器.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kinh kịch, âm nhạc & biểu diễn|||Chapter 6 — Peking opera, music & performing arts', description: '京剧 脸谱, 二胡/古筝/琵琶, 川剧变脸.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Triết lý sống, phong thuỷ & y học cổ truyền|||Chapter 7 — Philosophy, feng shui & TCM', description: '阴阳/五行, 风水, 中医, 中庸.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Giao thoa Trung-Việt & văn hoá hiện đại|||Chapter 8 — Sino-Vietnamese exchange & modern culture', description: 'Chữ Nôm, khoa cử, 12 con giáp, 国潮.', lessons: [c8, c8q] },
  ],
};
