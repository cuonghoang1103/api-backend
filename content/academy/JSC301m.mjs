/**
 * JSC301m — Japanese Culture & Japanese Studies (Văn hoá & Nhật Bản học).
 * Ngành Ngôn ngữ Nhật, Kỳ 5. Giáo trình trích dẫn: 日本事情 (Understanding
 * Japan); The Japanese Mind (Davies & Ikeno); 日本文化論. 8 chương, song ngữ
 * Việt-Anh + thuật ngữ văn hoá tiếng Nhật (kana/kanji + romaji + nghĩa Việt).
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('jsc301m-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình trích dẫn (日本事情, The Japanese Mind, 日本文化論), tài liệu chính thức miễn phí, YouTube, công cụ tra kanji, lộ trình tự học.',
  [[
    `<span class="eyebrow">JSC301m · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study Japanese Culture &amp; Japanese Studies — geography &amp; history, Shinto/Buddhism, values, customs, arts, food, pop culture and modern society — cited from the course's reference texts. The official FPTU slides &amp; giáo trình live on <strong>FLM</strong>; below are free, legal resources for further reading.</p>
<h3>📘 Reference texts (cited in this course)</h3>
<ul>
<li><em>日本事情 (Understanding Japan)</em> — a standard Japanese-studies survey textbook covering geography, history and society.</li>
<li><em>The Japanese Mind: Understanding Contemporary Japanese Culture</em> — Roger J. Davies &amp; Osamu Ikeno (Tuttle Publishing) — essays on key cultural concepts (honne/tatemae, wa, amae, giri...).</li>
<li><em>日本文化論 (Theories of Japanese Culture)</em> — academic survey of nihonjinron (theories about Japanese identity and culture).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.japan.go.jp/" target="_blank" rel="noopener">Japan.go.jp — Government of Japan official portal</a></li>
<li><a href="https://www.nippon.com/en/" target="_blank" rel="noopener">Nippon.com — culture, society &amp; history in English</a></li>
<li><a href="https://www.tofugu.com/" target="_blank" rel="noopener">Tofugu — Japanese culture &amp; language guides</a></li>
<li><a href="https://www3.nhk.or.jp/nhkworld/" target="_blank" rel="noopener">NHK World-Japan</a> — documentaries on history &amp; culture</li>
</ul>
<h3>▶️ Video</h3>
<ul>
<li><a href="https://www.youtube.com/@NHKWORLDJAPAN" target="_blank" rel="noopener">NHK World-Japan (YouTube)</a></li>
<li><a href="https://www.youtube.com/@Tofugu" target="_blank" rel="noopener">Tofugu (YouTube)</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">Jisho.org</a> — Japanese-English dictionary (look up every kanji term below)</li>
<li><a href="https://www.aozora.gr.jp/" target="_blank" rel="noopener">Aozora Bunko</a> — free public-domain Japanese texts</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — geography, historical periods (時代), and the Shinto/Buddhist religious base.</li>
<li><strong>Core concepts</strong> — honne/tatemae, wa, amae, giri/ninjō — the psychology behind daily behaviour.</li>
<li><strong>Living culture</strong> — festivals, tea ceremony, traditional arts, food and dress.</li>
<li><strong>Contemporary Japan</strong> — anime/manga, an ageing society, and Vietnam-Japan relations.</li>
</ol></div>`,
    `<span class="eyebrow">JSC301m · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Văn hoá &amp; Nhật Bản học</strong> — địa lý &amp; lịch sử, Thần đạo/Phật giáo, giá trị tâm lý, phong tục, nghệ thuật, ẩm thực, văn hoá đại chúng và xã hội hiện đại — trích từ các giáo trình môn học. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp để đọc thêm.</p>
<h3>📘 Giáo trình trích dẫn trong môn</h3>
<ul>
<li><em>日本事情 (Nihon Jijō — Understanding Japan)</em> — giáo trình nền về địa lý, lịch sử và xã hội Nhật Bản, chuẩn trong ngành Nhật Bản học.</li>
<li><em>The Japanese Mind</em> — Roger J. Davies &amp; Osamu Ikeno (Tuttle Publishing) — các bài luận về khái niệm văn hoá cốt lõi (本音/建前, 和, 甘え, 義理...).</li>
<li><em>日本文化論 (Nihon Bunkaron — Lý luận văn hoá Nhật Bản)</em> — tổng quan học thuật về nihonjinron (các lý thuyết bản sắc và văn hoá Nhật).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.japan.go.jp/" target="_blank" rel="noopener">Japan.go.jp — Cổng chính thức Chính phủ Nhật Bản</a></li>
<li><a href="https://www.nippon.com/en/" target="_blank" rel="noopener">Nippon.com — văn hoá, xã hội &amp; lịch sử (tiếng Anh)</a></li>
<li><a href="https://www.tofugu.com/" target="_blank" rel="noopener">Tofugu — hướng dẫn văn hoá &amp; tiếng Nhật</a></li>
<li><a href="https://www3.nhk.or.jp/nhkworld/" target="_blank" rel="noopener">NHK World-Japan</a> — phim tài liệu lịch sử &amp; văn hoá</li>
</ul>
<h3>▶️ Video</h3>
<ul>
<li><a href="https://www.youtube.com/@NHKWORLDJAPAN" target="_blank" rel="noopener">NHK World-Japan (YouTube)</a></li>
<li><a href="https://www.youtube.com/@Tofugu" target="_blank" rel="noopener">Tofugu (YouTube)</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">Jisho.org</a> — từ điển Nhật-Anh (tra mọi thuật ngữ kanji trong bài)</li>
<li><a href="https://www.aozora.gr.jp/" target="_blank" rel="noopener">Aozora Bunko</a> — kho văn bản tiếng Nhật miễn phí, hết bản quyền</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — địa lý, các thời kỳ lịch sử (時代), và nền tôn giáo Thần đạo/Phật giáo.</li>
<li><strong>Khái niệm cốt lõi</strong> — 本音/建前, 和, 甘え, 義理/人情 — tâm lý đứng sau hành vi thường ngày.</li>
<li><strong>Văn hoá sống</strong> — lễ hội, trà đạo, nghệ thuật truyền thống, ẩm thực và trang phục.</li>
<li><strong>Nhật Bản đương đại</strong> — anime/manga, xã hội già hoá, và quan hệ Việt-Nhật.</li>
</ol></div>`,
  ]]);

const c1 = doc('jsc301m-1-1-dia-ly-lich-su', '1.1 — Geography & history (歴史)|||1.1 — Địa lý & lịch sử Nhật Bản (歴史)',
  'Bốn đảo chính, vành đai lửa, bốn mùa; trục thời gian 15 thời kỳ (時代 jidai) từ Jomon đến Reiwa; ba bước ngoặt: Kamakura, sakoku, Minh Trị Duy Tân.',
  [[
    `<span class="eyebrow">JSC301m · Chapter 1 · Lesson 1.1</span>
<h2>Japan: geography &amp; the shape of its history (歴史 rekishi)</h2>
<h3>Geography in four facts</h3>
<ul>
<li><strong>An island arc</strong> — Japan (日本 Nihon/Nippon, "origin of the sun") is a chain of over 6,800 islands; the four main ones are <strong>Hokkaido (北海道)</strong>, <strong>Honshu (本州)</strong> — the largest, home to Tokyo and Kyoto — <strong>Shikoku (四国)</strong> and <strong>Kyushu (九州)</strong>.</li>
<li><strong>Mountainous &amp; volcanic</strong> — about 73% of the land is mountains; <strong>Mount Fuji (富士山 Fujisan, 3,776m)</strong> is the highest peak and a sacred symbol.</li>
<li><strong>The Ring of Fire</strong> — Japan sits on the Pacific Ring of Fire, so earthquakes (地震 jishin) and typhoons (台風 taifū) are part of daily life; building codes and disaster drills reflect this.</li>
<li><strong>Four seasons</strong> — spring (春 haru, cherry blossoms 桜 sakura), summer (夏 natsu), autumn (秋 aki, maple leaves 紅葉 kōyō) and winter (冬 fuyu) shape festivals, food and aesthetics throughout this course.</li>
</ul>
<h3>Jidai (時代) — the historical periods</h3>
<p>Japanese history is taught as a sequence of named eras (時代 jidai), each tied to a capital, a ruling power, or an emperor's reign. Knowing this timeline is the backbone for every later chapter — religion, values, and arts all attach to a period.</p>
<pre><code>Jomon      (縄文時代, ~14000-300 BCE)  hunter-gatherers, cord-marked pottery
Yayoi      (弥生時代, ~300 BCE-300 CE)  rice farming, bronze &amp; iron tools
Kofun      (古墳時代, 300-538)          giant keyhole burial mounds, clan chiefs
Asuka      (飛鳥時代, 538-710)          Buddhism arrives from Korea/China
Nara       (奈良時代, 710-794)          first fixed capital (Nara), Chinese-style law
Heian      (平安時代, 794-1185)          capital moves to Kyoto; court culture, kana
Kamakura   (鎌倉時代, 1185-1333)         first shogunate; rise of the samurai (侍)
Muromachi  (室町時代, 1336-1573)         Ashikaga shoguns; Noh theatre, tea ceremony
Sengoku    ("Warring States", ~1467-1603) civil war among daimyo warlords
Edo        (江戸時代, 1603-1868)         Tokugawa shogunate; sakoku (鎖国) isolation
Meiji      (明治時代, 1868-1912)         Meiji Restoration; rapid modernisation
Taisho     (大正時代, 1912-1926)         brief liberal, urban era
Showa      (昭和時代, 1926-1989)         WWII, defeat, post-war economic miracle
Heisei     (平成時代, 1989-2019)         economic slowdown, globalisation
Reiwa      (令和時代, 2019-present)      current era, under Emperor Naruhito
</code></pre>
<h3>Three turning points to remember</h3>
<ul>
<li><strong>1185 — Kamakura shogunate:</strong> political power shifts from the imperial court to military rulers (shogun 将軍) for nearly 700 years.</li>
<li><strong>1603-1868 — Sakoku (鎖国, "closed country"):</strong> the Tokugawa shogunate largely sealed Japan off from the outside world, letting a distinct, insulated culture mature.</li>
<li><strong>1868 — Meiji Restoration (明治維新):</strong> imperial rule is restored and Japan rapidly industrialises and westernises to avoid colonisation — the hinge between "traditional" and "modern" Japan.</li>
</ul>
<div class="callout"><span class="badge">Why this chapter matters</span> Every later chapter references a period from this timeline — Zen arrives in Kamakura, tea ceremony matures in Muromachi, samurai values persist into modern business culture. Learn the order once, and the rest of the course clicks into place.</div>`,
    `<span class="eyebrow">JSC301m · Chương 1 · Bài 1.1</span>
<h2>Nhật Bản: địa lý &amp; dòng chảy lịch sử (歴史 rekishi)</h2>
<h3>Địa lý trong bốn điểm chính</h3>
<ul>
<li><strong>Quần đảo hình vòng cung</strong> — Nhật Bản (日本 Nihon/Nippon, nghĩa "gốc mặt trời") gồm hơn 6.800 đảo lớn nhỏ; bốn đảo chính là <strong>Hokkaido (北海道)</strong>, <strong>Honshu (本州)</strong> — đảo lớn nhất, nơi có Tokyo và Kyoto — <strong>Shikoku (四国)</strong> và <strong>Kyushu (九州)</strong>.</li>
<li><strong>Nhiều núi &amp; núi lửa</strong> — khoảng 73% diện tích là núi; <strong>núi Phú Sĩ (富士山 Fujisan, cao 3.776m)</strong> là đỉnh cao nhất và là biểu tượng thiêng liêng.</li>
<li><strong>Vành đai lửa Thái Bình Dương</strong> — Nhật nằm trên vành đai lửa nên động đất (地震 jishin) và bão (台風 taifū) là một phần đời sống hàng ngày; quy chuẩn xây dựng và diễn tập ứng phó thiên tai phản ánh điều này.</li>
<li><strong>Bốn mùa rõ rệt</strong> — xuân (春 haru, hoa anh đào 桜 sakura), hạ (夏 natsu), thu (秋 aki, lá phong đỏ 紅葉 kōyō) và đông (冬 fuyu) định hình lễ hội, ẩm thực và thẩm mỹ xuyên suốt môn học này.</li>
</ul>
<h3>Thời kỳ (時代 jidai) — trục thời gian lịch sử</h3>
<p>Lịch sử Nhật được dạy như một chuỗi thời kỳ có tên riêng (時代 jidai), mỗi thời kỳ gắn với một kinh đô, một thế lực cầm quyền, hoặc triều đại một Thiên hoàng. Nắm được trục thời gian này là xương sống cho mọi chương sau — tôn giáo, giá trị, nghệ thuật đều gắn với một thời kỳ cụ thể.</p>
<pre><code>Jomon      (縄文時代, ~14000-300 TCN)   săn bắt hái lượm, gốm thừng
Yayoi      (弥生時代, ~300 TCN-300)     trồng lúa nước, công cụ đồng &amp; sắt
Kofun      (古墳時代, 300-538)          mộ cổ hình lỗ khoá khổng lồ, thủ lĩnh thị tộc
Asuka      (飛鳥時代, 538-710)          Phật giáo du nhập từ Hàn Quốc/Trung Quốc
Nara       (奈良時代, 710-794)          kinh đô cố định đầu tiên (Nara), luật kiểu TQ
Heian      (平安時代, 794-1185)          dời đô về Kyoto; văn hoá cung đình, chữ kana
Kamakura   (鎌倉時代, 1185-1333)         mạc phủ đầu tiên; tầng lớp samurai (侍) nổi lên
Muromachi  (室町時代, 1336-1573)         mạc phủ Ashikaga; kịch Noh, trà đạo hình thành
Sengoku    ("thời Chiến Quốc", ~1467-1603) nội chiến giữa các lãnh chúa daimyo
Edo        (江戸時代, 1603-1868)         mạc phủ Tokugawa; toả quốc (鎖国) đóng cửa
Meiji      (明治時代, 1868-1912)         Minh Trị Duy Tân; hiện đại hoá thần tốc
Taisho     (大正時代, 1912-1926)         thời kỳ tự do, đô thị hoá ngắn ngủi
Showa      (昭和時代, 1926-1989)         Thế chiến II, thất bại, thần kỳ kinh tế hậu chiến
Heisei     (平成時代, 1989-2019)         kinh tế chững lại, toàn cầu hoá
Reiwa      (令和時代, 2019-nay)          thời kỳ hiện tại, dưới triều Thiên hoàng Naruhito
</code></pre>
<h3>Ba bước ngoặt cần nhớ</h3>
<ul>
<li><strong>1185 — Mạc phủ Kamakura:</strong> quyền lực chính trị chuyển từ triều đình sang các lãnh chúa quân sự (tướng quân 将軍 shōgun) trong gần 700 năm.</li>
<li><strong>1603-1868 — Toả quốc (鎖国, "đóng cửa đất nước"):</strong> mạc phủ Tokugawa gần như cô lập Nhật Bản khỏi thế giới bên ngoài, cho phép một nền văn hoá riêng biệt, khép kín trưởng thành.</li>
<li><strong>1868 — Minh Trị Duy Tân (明治維新):</strong> quyền lực Thiên hoàng được khôi phục, Nhật công nghiệp hoá và Tây phương hoá thần tốc để tránh bị thuộc địa hoá — bản lề giữa Nhật Bản "truyền thống" và "hiện đại".</li>
</ul>
<div class="callout"><span class="badge">Vì sao chương này quan trọng</span> Mọi chương sau đều nhắc lại một thời kỳ trong trục này — Thiền tông du nhập ở Kamakura, trà đạo trưởng thành ở Muromachi, giá trị samurai còn ảnh hưởng văn hoá kinh doanh hiện đại. Học thuộc trình tự một lần, cả môn học sẽ khớp lại với nhau.</div>`,
  ]]);

const c1q = quiz('jsc301m-quiz-1', 'Quiz 1 — Geography & history|||Quiz 1 — Địa lý & lịch sử', [
  { id: 'q1', question: 'Thời kỳ nào đánh dấu sự ra đời của mạc phủ đầu tiên và sự nổi lên của tầng lớp samurai?', options: ['Heian', 'Kamakura', 'Edo', 'Nara'], correctIndex: 1, explanation: 'Mạc phủ Kamakura (1185-1333) là mạc phủ đầu tiên, chuyển quyền lực từ triều đình sang shogun.' },
  { id: 'q2', question: '"Toả quốc" (鎖国) — chính sách đóng cửa đất nước — diễn ra dưới mạc phủ nào?', options: ['Meiji', 'Sengoku', 'Edo (Tokugawa)', 'Showa'], correctIndex: 2, explanation: 'Mạc phủ Tokugawa (thời Edo, 1603-1868) thi hành sakoku, gần như cô lập Nhật Bản.' },
  { id: 'q3', question: 'Đỉnh núi cao nhất, biểu tượng thiêng liêng của Nhật Bản, tên là gì?', options: ['Núi Aso', 'Núi Phú Sĩ (富士山)', 'Núi Osore', 'Núi Koya'], correctIndex: 1, explanation: 'Núi Phú Sĩ (Fujisan, 3.776m) là đỉnh cao nhất Nhật Bản và mang ý nghĩa thiêng liêng.' },
]);

const c2 = doc('jsc301m-2-1-than-dao-phat-giao', '2.1 — Shinto & Buddhism (神道, 仏教)|||2.1 — Thần đạo & Phật giáo (神道, 仏教)',
  'Thần đạo (神道): kami, đền, torii, thanh tẩy. Phật giáo (仏教): du nhập, các tông phái (Zen, Tịnh Độ, Nhật Liên). Thần Phật tập hợp (神仏習合) và tách biệt 1868.',
  [[
    `<span class="eyebrow">JSC301m · Chapter 2 · Lesson 2.1</span>
<h2>Shinto &amp; Buddhism: Japan's two religious roots (神道 &amp; 仏教)</h2>
<h3>Shinto (神道 Shintō) — "the way of the kami"</h3>
<p>Shinto is Japan's indigenous animist faith: it has no single founder, no central scripture, and worships <strong>kami (神)</strong> — spirits or sacred qualities found in nature (mountains, rivers, trees), ancestors, and extraordinary people. A shrine (<strong>神社 jinja</strong>) marks a place where a kami is enshrined; you enter through a <strong>torii gate (鳥居)</strong>, purify your hands and mouth at the <strong>temizuya (手水舎)</strong>, then bow and clap to greet the kami. Ritual purification (<strong>禊 misogi</strong>, <strong>祓い harai</strong>) — washing away impurity (<strong>穢れ kegare</strong>) — is Shinto's central concern, not sin or salvation.</p>
<h3>Buddhism (仏教 Bukkyō) — imported, then made Japanese</h3>
<p>Buddhism arrived from Korea/China around 538 CE (Asuka period) and became the vehicle for writing, art and statecraft. Major schools that took root: <strong>Zen (禅 Zen)</strong> — meditation-focused, popular with the samurai class; <strong>Pure Land (浄土宗 Jōdo-shū)</strong> — salvation through faith in Amida Buddha, popular with commoners; <strong>Nichiren (日蓮宗)</strong> — chanting the Lotus Sutra's title. A Buddhist site is a temple (<strong>寺 tera</strong>, often written <strong>お寺 o-tera</strong>), guarded by a gate rather than a torii.</p>
<h3>Shinbutsu-shūgō (神仏習合) — living together, not competing</h3>
<p>For over a thousand years Shinto and Buddhism blended rather than fought: the same site could hold both a shrine and a temple, and kami were reinterpreted as local manifestations of Buddhas. Only in 1868 (Meiji period) did the state force a legal separation (<strong>神仏分離 shinbutsu bunri</strong>) to build a state Shinto identity. This is why most Japanese today are married in a Shinto ceremony but hold a Buddhist funeral — the two faiths still divide life's occasions rather than compete for the whole person.</p>
<pre><code>Shrine (神社 jinja)         vs   Temple (寺 tera)
gate: torii (鳥居)               gate: sanmon (山門)
guardians: komainu (狛犬)        guardians: nio (仁王)
staff: priest, kannushi (神主)   staff: monk, sō (僧)
occasion: birth, weddings, New Year   occasion: funerals, ancestor rites
</code></pre>
<div class="callout"><span class="badge">Not either/or</span> Asking "is Japan Shinto or Buddhist" misreads the culture — most Japanese practise both without contradiction, visiting a shrine at New Year and a temple at Obon. Religion here is about ritual practice, not exclusive belief.</div>`,
    `<span class="eyebrow">JSC301m · Chương 2 · Bài 2.1</span>
<h2>Thần đạo &amp; Phật giáo: hai gốc rễ tín ngưỡng của Nhật Bản (神道 &amp; 仏教)</h2>
<h3>Thần đạo (神道 Shintō) — "con đường của thần linh"</h3>
<p>Thần đạo là tín ngưỡng vật linh bản địa của Nhật Bản: không có người sáng lập, không có kinh sách trung tâm, thờ <strong>kami (神)</strong> — thần linh hoặc phẩm chất thiêng liêng hiện diện trong tự nhiên (núi, sông, cây cối), tổ tiên, và những người phi thường. Một ngôi đền (<strong>神社 jinja</strong>) là nơi một vị kami được thờ; bạn bước qua cổng <strong>torii (鳥居)</strong>, rửa tay và súc miệng tại <strong>temizuya (手水舎)</strong>, rồi cúi chào và vỗ tay để chào kami. Nghi thức thanh tẩy (<strong>禊 misogi</strong>, <strong>祓い harai</strong>) — gột rửa uế tạp (<strong>穢れ kegare</strong>) — là mối quan tâm trung tâm của Thần đạo, chứ không phải tội lỗi hay cứu rỗi.</p>
<h3>Phật giáo (仏教 Bukkyō) — du nhập rồi được "Nhật hoá"</h3>
<p>Phật giáo du nhập từ Hàn Quốc/Trung Quốc khoảng năm 538 (thời Asuka) và trở thành phương tiện mang theo chữ viết, nghệ thuật và kỹ thuật trị quốc. Các tông phái lớn bén rễ: <strong>Thiền tông (禅 Zen)</strong> — tập trung thiền định, phổ biến trong tầng lớp samurai; <strong>Tịnh Độ tông (浄土宗 Jōdo-shū)</strong> — cứu rỗi qua đức tin vào Phật A Di Đà, phổ biến với dân thường; <strong>Nhật Liên tông (日蓮宗)</strong> — tụng niệm tên Kinh Pháp Hoa. Cơ sở Phật giáo là chùa (<strong>寺 tera</strong>, thường viết <strong>お寺 o-tera</strong>), có cổng riêng khác với torii.</p>
<h3>Thần Phật tập hợp (神仏習合) — sống chung, không cạnh tranh</h3>
<p>Suốt hơn một nghìn năm, Thần đạo và Phật giáo hoà trộn thay vì đối đầu: cùng một khuôn viên có thể vừa có đền vừa có chùa, và kami được diễn giải lại như hoá thân địa phương của các vị Phật. Chỉ đến năm 1868 (thời Meiji), nhà nước mới cưỡng ép tách biệt về mặt pháp lý (<strong>神仏分離 shinbutsu bunri</strong>) để xây dựng bản sắc Thần đạo Nhà nước. Đây là lý do vì sao phần lớn người Nhật ngày nay tổ chức lễ cưới theo nghi thức Thần đạo nhưng làm tang lễ theo nghi thức Phật giáo — hai tín ngưỡng vẫn phân chia các dịp trong đời chứ không cạnh tranh giành trọn một con người.</p>
<pre><code>Đền (神社 jinja)            so với   Chùa (寺 tera)
cổng: torii (鳥居)                   cổng: sanmon (山門)
linh vật canh cổng: komainu (狛犬)    linh vật canh cổng: nio (仁王)
người phụ trách: thầy tế, kannushi (神主)   người phụ trách: sư, sō (僧)
dịp: sinh nở, cưới hỏi, năm mới      dịp: tang lễ, cúng giỗ tổ tiên
</code></pre>
<div class="callout"><span class="badge">Không phải chọn một trong hai</span> Hỏi "Nhật Bản theo Thần đạo hay Phật giáo" là hiểu sai văn hoá — đa số người Nhật thực hành cả hai mà không thấy mâu thuẫn, đi đền vào năm mới và đi chùa vào lễ Obon. Tôn giáo ở đây là thực hành nghi lễ, không phải niềm tin độc quyền.</div>`,
  ]]);

const c2q = quiz('jsc301m-quiz-2', 'Quiz 2 — Shinto & Buddhism|||Quiz 2 — Thần đạo & Phật giáo', [
  { id: 'q1', question: 'Cổng đặc trưng dẫn vào một ngôi đền Thần đạo gọi là gì?', options: ['Sanmon', 'Torii (鳥居)', 'Nio', 'Komainu'], correctIndex: 1, explanation: 'Torii (鳥居) là cổng đặc trưng của đền Thần đạo (神社), khác với cổng sanmon của chùa.' },
  { id: 'q2', question: 'Sự kiện năm 1868 buộc tách biệt Thần đạo và Phật giáo về mặt pháp lý gọi là gì?', options: ['Sakoku (鎖国)', 'Shinbutsu bunri (神仏分離)', 'Shinbutsu-shūgō (神仏習合)', 'Misogi (禊)'], correctIndex: 1, explanation: 'Shinbutsu bunri (神仏分離, 1868) là lệnh tách biệt, trái với shinbutsu-shūgō (hoà trộn) trước đó.' },
  { id: 'q3', question: 'Vì sao nhiều người Nhật vừa làm lễ cưới theo Thần đạo vừa làm tang lễ theo Phật giáo?', options: ['Vì luật pháp bắt buộc', 'Vì hai tín ngưỡng phân chia các dịp trong đời chứ không cạnh tranh', 'Vì Phật giáo bị cấm trong hôn lễ', 'Vì Thần đạo mới du nhập gần đây'], correctIndex: 1, explanation: 'Thần đạo và Phật giáo cùng tồn tại theo dịp: Thần đạo cho sinh/cưới, Phật giáo cho tang lễ/giỗ.' },
]);

const c3 = doc('jsc301m-3-1-gia-tri-tam-ly', '3.1 — Values & psychology (本音/建前, 和, 甘え)|||3.1 — Giá trị & tâm lý người Nhật (本音/建前, 和, 甘え)',
  'Honne/tatemae, wa (和), amae (甘え), uchi/soto, meiwaku, giri/ninjō — logic tâm lý đứng sau hành vi thường ngày của người Nhật.',
  [[
    `<span class="eyebrow">JSC301m · Chapter 3 · Lesson 3.1</span>
<h2>Japanese values &amp; psychology: honne/tatemae, wa, amae</h2>
<h3>Honne &amp; tatemae (本音・建前) — true sound vs. built-up front</h3>
<p><strong>Honne (本音)</strong> is a person's real feelings and desires; <strong>tatemae (建前)</strong> is the socially appropriate face shown in public, especially to preserve group harmony. This is not "lying" in the Western moral sense — it is a social skill: knowing which register to use with which audience, and when.</p>
<h3>Wa (和) — harmony as the top value</h3>
<p><strong>Wa</strong> means group harmony, and it outranks individual assertion in most Japanese institutions: meetings favour consensus (<strong>根回し nemawashi</strong>, informal groundwork before a decision) over open confrontation; disagreement is expressed indirectly.</p>
<h3>Amae (甘え) — the wish to be indulged</h3>
<p>Psychiatrist Doi Takeo's concept of <strong>amae (甘え)</strong> describes the (often unconscious) wish to be taken care of and indulged by another, rooted in the mother-child bond and extended into adult relationships (employee-boss, junior-senior). It explains behaviour that looks like "childish dependence" to outsiders but is a normal social bid for closeness in Japan.</p>
<h3>Other key pairs</h3>
<ul>
<li><strong>Uchi/soto (内・外)</strong> — "inside" group vs. "outside" group; language, politeness level and obligation all shift depending on which side someone is on.</li>
<li><strong>Meiwaku (迷惑)</strong> — the deep norm of "not causing trouble/inconvenience to others" — behind queueing, quiet trains, and returning lost items.</li>
<li><strong>Giri/ninjō (義理・人情)</strong> — social duty/obligation vs. human/personal feeling — a classic tension in Japanese drama and business ethics.</li>
</ul>
<pre><code>本音 honne     real feelings (private)
建前 tatemae   public front (social)
和   wa        group harmony
甘え amae      wish to be indulged / dependence
内   uchi      in-group
外   soto      out-group
迷惑 meiwaku   trouble/burden to others (avoid causing it)
義理 giri      social duty/obligation
人情 ninjō     human feeling/compassion
</code></pre>
<div class="callout"><span class="badge">Reading the code</span> These concepts are not exotic quirks — they are the operating logic behind everyday scenes: silence in a meeting, an indirect "that would be a bit difficult" instead of "no", or a gift given for no obvious occasion.</div>`,
    `<span class="eyebrow">JSC301m · Chương 3 · Bài 3.1</span>
<h2>Giá trị &amp; tâm lý người Nhật: 本音/建前, 和, 甘え</h2>
<h3>Honne &amp; tatemae (本音・建前) — tiếng lòng thật vs. mặt ngoài dựng sẵn</h3>
<p><strong>Honne (本音)</strong> là cảm xúc và mong muốn thật sự của một người; <strong>tatemae (建前)</strong> là bộ mặt phù hợp về mặt xã hội được thể hiện nơi công cộng, đặc biệt để giữ hoà khí tập thể. Đây không phải "nói dối" theo nghĩa đạo đức phương Tây — đó là một kỹ năng xã hội: biết dùng "giọng" nào với đối tượng nào, vào lúc nào.</p>
<h3>Wa (和) — hài hoà là giá trị cao nhất</h3>
<p><strong>Wa</strong> nghĩa là sự hài hoà tập thể, và nó đứng trên cả việc khẳng định cá nhân trong hầu hết tổ chức Nhật Bản: các cuộc họp ưu tiên đồng thuận (<strong>根回し nemawashi</strong> — vận động ngầm trước khi ra quyết định chính thức) hơn là đối đầu công khai; bất đồng được bày tỏ một cách gián tiếp.</p>
<h3>Amae (甘え) — mong muốn được nương tựa, nuông chiều</h3>
<p>Khái niệm <strong>甘え (amae)</strong> của bác sĩ tâm thần Doi Takeo mô tả mong muốn (thường vô thức) được người khác chăm sóc và nuông chiều, bắt nguồn từ mối quan hệ mẹ-con và mở rộng sang các quan hệ người lớn (nhân viên-sếp, đàn em-đàn anh). Nó giải thích những hành vi mà người ngoài nhìn vào tưởng là "phụ thuộc trẻ con" nhưng thực chất là một lời mời gần gũi hoàn toàn bình thường trong xã hội Nhật.</p>
<h3>Các cặp khái niệm quan trọng khác</h3>
<ul>
<li><strong>Uchi/soto (内・外)</strong> — nhóm "trong" và nhóm "ngoài"; ngôn ngữ, mức độ lịch sự và nghĩa vụ đều thay đổi tuỳ vào việc ai đó thuộc phía nào.</li>
<li><strong>Meiwaku (迷惑)</strong> — chuẩn mực sâu sắc "không gây phiền/bất tiện cho người khác" — đứng sau việc xếp hàng, giữ yên lặng trên tàu điện, và trả lại đồ đánh rơi.</li>
<li><strong>Giri/ninjō (義理・人情)</strong> — nghĩa vụ xã hội vs. tình cảm con người — một căng thẳng kinh điển trong kịch nghệ và đạo đức kinh doanh Nhật Bản.</li>
</ul>
<pre><code>本音 honne     cảm xúc thật (riêng tư)
建前 tatemae   mặt ngoài (xã hội)
和   wa        hài hoà tập thể
甘え amae      mong nương tựa / phụ thuộc
内   uchi      nhóm trong
外   soto      nhóm ngoài
迷惑 meiwaku   phiền/gánh nặng cho người khác (tránh gây ra)
義理 giri      nghĩa vụ xã hội
人情 ninjō     tình cảm con người
</code></pre>
<div class="callout"><span class="badge">Đọc được "mã văn hoá"</span> Những khái niệm này không phải nét lạ kỳ dị — chúng là logic vận hành đứng sau các cảnh đời thường: sự im lặng trong cuộc họp, một câu "việc đó hơi khó" gián tiếp thay vì "không", hay một món quà tặng không rõ lý do.</div>`,
  ]]);

const c3q = quiz('jsc301m-quiz-3', 'Quiz 3 — Values & psychology|||Quiz 3 — Giá trị & tâm lý', [
  { id: 'q1', question: '"Tatemae" (建前) trong văn hoá Nhật Bản có nghĩa là gì?', options: ['Cảm xúc thật sự cá nhân', 'Bộ mặt/thái độ phù hợp thể hiện nơi công cộng', 'Nghi thức thanh tẩy', 'Nghĩa vụ xã hội'], correctIndex: 1, explanation: 'Tatemae (建前) là mặt ngoài xã hội, đối lập với honne (本音) là cảm xúc thật riêng tư.' },
  { id: 'q2', question: 'Khái niệm 甘え (amae) mô tả điều gì?', options: ['Mong muốn được người khác chăm sóc, nuông chiều', 'Sự cô lập cá nhân', 'Nghi lễ trà đạo', 'Quy tắc xếp hàng nơi công cộng'], correctIndex: 0, explanation: 'Amae (甘え), khái niệm của Doi Takeo, là mong muốn (thường vô thức) được nương tựa/nuông chiều.' },
  { id: 'q3', question: '"Nemawashi" (根回し) trong một cuộc họp Nhật Bản nghĩa là gì?', options: ['Tranh luận công khai gay gắt', 'Vận động, thăm dò ngầm trước khi ra quyết định chính thức', 'Bỏ phiếu đa số', 'Im lặng tuyệt đối'], correctIndex: 1, explanation: 'Nemawashi là cách xây dựng đồng thuận ngầm trước cuộc họp, ưu tiên wa (和) hơn đối đầu.' },
]);

const c4 = doc('jsc301m-4-1-phong-tuc-le-hoi', '4.1 — Customs, festivals & ritual (祭り, 正月, 茶道)|||4.1 — Phong tục, lễ hội & nghi thức (祭り, 正月, 茶道)',
  'Matsuri, oshōgatsu (Tết Nhật), trà đạo (茶道) và tinh thần wa-kei-sei-jaku, nghi thức chào hỏi ojigi & meishi.',
  [[
    `<span class="eyebrow">JSC301m · Chapter 4 · Lesson 4.1</span>
<h2>Customs, festivals &amp; ritual: matsuri, oshōgatsu, sadō</h2>
<h3>Matsuri (祭り) — the festival calendar</h3>
<p>A <strong>matsuri</strong> is a Shinto-rooted local festival, usually honouring a shrine's kami with a procession carrying a portable shrine (<strong>神輿 mikoshi</strong>), music, food stalls and fireworks. Famous examples: <strong>Gion Matsuri (祇園祭)</strong> in Kyoto (July), and <strong>Tanabata (七夕)</strong>, the star festival (July 7), where wishes are written on strips of paper (<strong>短冊 tanzaku</strong>) and hung on bamboo.</p>
<h3>Oshōgatsu (お正月) — New Year</h3>
<p>New Year is Japan's most important holiday. Customs include: <strong>hatsumōde (初詣)</strong> — the first shrine/temple visit of the year; <strong>osechi ryōri (御節料理)</strong> — an assembled box of symbolic New Year dishes eaten over several days; <strong>nengajō (年賀状)</strong> — New Year greeting postcards; and <strong>otoshidama (お年玉)</strong> — money gifts given to children.</p>
<h3>Sadō / chanoyu (茶道) — the way of tea</h3>
<p>The tea ceremony is a ritualised way of preparing and serving matcha, refined in the Muromachi period and codified by tea master <strong>Sen no Rikyū</strong>. Its guiding spirit is <strong>wa-kei-sei-jaku (和敬清寂)</strong> — harmony, respect, purity, tranquility — every gesture (how the bowl is turned, how the room is entered) is deliberate and repeatable.</p>
<h3>Everyday etiquette</h3>
<ul>
<li><strong>Ojigi (お辞儀)</strong> — bowing, with depth signalling the level of respect (a slight nod vs. a deep 90° bow).</li>
<li><strong>Meishi (名刺)</strong> — business cards are exchanged with both hands and studied respectfully before being put away, never pocketed carelessly.</li>
<li>Removing shoes (<strong>玄関 genkan</strong>, entryway) before stepping onto raised flooring — a spatial, not just hygienic, boundary between "outside" and "inside".</li>
</ul>
<pre><code>祭り matsuri        festival (shrine-rooted, local)
神輿 mikoshi        portable shrine carried in procession
初詣 hatsumōde      first shrine/temple visit of the New Year
御節料理 osechi     New Year symbolic food box
年賀状 nengajō      New Year greeting postcard
茶道 sadō           the way of tea (tea ceremony)
和敬清寂 wa-kei-sei-jaku  harmony, respect, purity, tranquility
お辞儀 ojigi        bow
</code></pre>
<div class="callout"><span class="badge">Ritual = repeatable meaning</span> Whether it's a bow's angle or the exact steps of tea ceremony, Japanese ritual fixes a gesture's form so its meaning is unambiguous — the opposite of spontaneity, and on purpose.</div>`,
    `<span class="eyebrow">JSC301m · Chương 4 · Bài 4.1</span>
<h2>Phong tục, lễ hội &amp; nghi thức: 祭り, お正月, 茶道</h2>
<h3>Matsuri (祭り) — lịch lễ hội</h3>
<p>Một <strong>matsuri</strong> là lễ hội địa phương có gốc Thần đạo, thường tôn vinh vị kami của một ngôi đền bằng đoàn rước kiệu thần di động (<strong>神輿 mikoshi</strong>), âm nhạc, gian hàng ẩm thực và pháo hoa. Ví dụ nổi tiếng: <strong>Gion Matsuri (祇園祭)</strong> ở Kyoto (tháng 7), và <strong>Tanabata (七夕)</strong> — lễ hội sao (7/7), nơi điều ước được viết lên dải giấy (<strong>短冊 tanzaku</strong>) và treo lên cành tre.</p>
<h3>Oshōgatsu (お正月) — Tết Nhật</h3>
<p>Năm mới là ngày lễ quan trọng nhất của Nhật Bản. Phong tục gồm: <strong>hatsumōde (初詣)</strong> — chuyến viếng đền/chùa đầu tiên trong năm; <strong>osechi ryōri (御節料理)</strong> — hộp món ăn mang tính biểu tượng cho năm mới, ăn dần trong vài ngày; <strong>nengajō (年賀状)</strong> — thiệp chúc mừng năm mới; và <strong>otoshidama (お年玉)</strong> — tiền mừng tuổi cho trẻ em.</p>
<h3>Sadō / chanoyu (茶道) — trà đạo</h3>
<p>Trà đạo là cách pha và mời trà bột matcha theo nghi thức, được hoàn thiện ở thời Muromachi và hệ thống hoá bởi trà sư <strong>Sen no Rikyū</strong>. Tinh thần cốt lõi là <strong>和敬清寂 (wa-kei-sei-jaku)</strong> — hài hoà, tôn trọng, thanh khiết, tĩnh lặng — mọi động tác (cách xoay chén trà, cách bước vào phòng trà) đều có chủ đích và có thể lặp lại y hệt.</p>
<h3>Nghi thức thường ngày</h3>
<ul>
<li><strong>Ojigi (お辞儀)</strong> — cúi chào, độ sâu của cái cúi thể hiện mức độ tôn trọng (gật đầu nhẹ so với cúi 90 độ).</li>
<li><strong>Meishi (名刺)</strong> — danh thiếp được trao bằng hai tay và xem xét trân trọng trước khi cất đi, không bao giờ nhét vội vào túi.</li>
<li>Cởi giày ở lối vào (<strong>玄関 genkan</strong>) trước khi bước lên sàn nhà cao hơn — một ranh giới không gian, không chỉ vệ sinh, giữa "ngoài" và "trong".</li>
</ul>
<pre><code>祭り matsuri        lễ hội (gốc Thần đạo, địa phương)
神輿 mikoshi        kiệu thần di động rước trong lễ hội
初詣 hatsumōde      chuyến viếng đền/chùa đầu tiên năm mới
御節料理 osechi     hộp món ăn biểu tượng năm mới
年賀状 nengajō      thiệp chúc mừng năm mới
茶道 sadō           trà đạo
和敬清寂 wa-kei-sei-jaku  hài hoà, tôn trọng, thanh khiết, tĩnh lặng
お辞儀 ojigi        cúi chào
</code></pre>
<div class="callout"><span class="badge">Nghi thức = ý nghĩa lặp lại được</span> Dù là góc cúi chào hay từng bước trong trà đạo, nghi thức Nhật Bản cố định hình thức của một động tác để ý nghĩa của nó không bị hiểu sai — ngược hẳn với sự ngẫu hứng, và đó là chủ đích.</div>`,
  ]]);

const c4q = quiz('jsc301m-quiz-4', 'Quiz 4 — Customs & festivals|||Quiz 4 — Phong tục & lễ hội', [
  { id: 'q1', question: '"Hatsumōde" (初詣) là gì?', options: ['Lễ hội mùa hè có kiệu thần', 'Chuyến viếng đền/chùa đầu tiên trong năm mới', 'Nghi thức pha trà', 'Thiệp chúc năm mới'], correctIndex: 1, explanation: 'Hatsumōde là chuyến viếng đền/chùa đầu tiên trong năm mới, một phong tục Oshōgatsu quan trọng.' },
  { id: 'q2', question: 'Tinh thần cốt lõi của trà đạo (茶道) được gói trong bốn chữ nào?', options: ['本音建前', '和敬清寂 (hài hoà, tôn trọng, thanh khiết, tĩnh lặng)', '神仏習合', '内外関係'], correctIndex: 1, explanation: 'Wa-kei-sei-jaku (和敬清寂) do Sen no Rikyū đúc kết là tinh thần cốt lõi của trà đạo.' },
  { id: 'q3', question: 'Vì sao người Nhật cởi giày ở genkan (玄関) trước khi vào nhà?', options: ['Chỉ vì lý do thời trang', 'Đánh dấu ranh giới không gian "ngoài" và "trong", không chỉ vệ sinh', 'Vì luật pháp bắt buộc', 'Chỉ áp dụng ở đền chùa'], correctIndex: 1, explanation: 'Genkan là ranh giới nghi thức giữa không gian ngoài và trong, mang ý nghĩa văn hoá hơn là chỉ vệ sinh.' },
]);

const c5 = doc('jsc301m-5-1-nghe-thuat-tham-my', '5.1 — Traditional arts & aesthetics (侘寂, 浮世絵, 能/歌舞伎)|||5.1 — Nghệ thuật truyền thống & thẩm mỹ (侘寂, 浮世絵, 能/歌舞伎)',
  'Wabi-sabi (vẻ đẹp không hoàn hảo), ukiyo-e (tranh khắc gỗ), Noh vs Kabuki, ikebana, origami, bonsai.',
  [[
    `<span class="eyebrow">JSC301m · Chapter 5 · Lesson 5.1</span>
<h2>Traditional arts &amp; aesthetics: wabi-sabi, ukiyo-e, Noh/Kabuki</h2>
<h3>Wabi-sabi (侘寂) — beauty in imperfection</h3>
<p><strong>Wabi-sabi</strong> is the aesthetic of accepting transience and imperfection: a cracked tea bowl mended with visible gold lacquer (<strong>金継ぎ kintsugi</strong>) is considered more beautiful, not less, because the repair is honest. It connects to the Buddhist idea of <strong>mujō (無常)</strong> — impermanence — nothing is meant to look finished or permanent.</p>
<h3>Ukiyo-e (浮世絵) — pictures of the floating world</h3>
<p><strong>Ukiyo-e</strong> woodblock prints (Edo period) depicted kabuki actors, courtesans, landscapes and everyday urban life for a mass, commercial audience — the opposite of elite court art. Masters include <strong>Hokusai</strong> (<em>The Great Wave off Kanagawa</em>) and <strong>Hiroshige</strong> (landscape series). Ukiyo-e later influenced European Impressionism (<em>Japonisme</em>).</p>
<h3>Noh (能) &amp; Kabuki (歌舞伎) — two kinds of theatre</h3>
<ul>
<li><strong>Noh (能)</strong> — slow, masked, minimalist theatre for the samurai class (Muromachi period); performers wear carved wooden masks (<strong>面 men</strong>) to portray spirits, ghosts and gods.</li>
<li><strong>Kabuki (歌舞伎)</strong> — bold, colourful, popular theatre (Edo period) with exaggerated makeup (<strong>隈取 kumadori</strong>), all-male casts, and dramatic poses (<strong>見得 mie</strong>) that freeze the action at an emotional peak.</li>
</ul>
<h3>Other refined arts</h3>
<ul>
<li><strong>Ikebana (生け花)</strong> — the art of flower arranging, valuing asymmetry and empty space over symmetry and fullness.</li>
<li><strong>Origami (折り紙)</strong> — paper folding; the crane (<strong>折り鶴 orizuru</strong>) symbolises peace and longevity.</li>
<li><strong>Bonsai (盆栽)</strong> — miniature potted trees shaped over years to suggest a full-grown tree in nature.</li>
</ul>
<pre><code>侘寂 wabi-sabi    beauty in imperfection &amp; transience
無常 mujō         impermanence (Buddhist concept)
金継ぎ kintsugi   repairing pottery with visible gold lacquer
浮世絵 ukiyo-e    "pictures of the floating world" (woodblock prints)
能   Noh          slow, masked classical theatre
歌舞伎 Kabuki      bold, popular theatre with exaggerated style
生け花 ikebana    flower arranging
盆栽 bonsai        miniature potted trees
</code></pre>
<div class="callout"><span class="badge">One thread, many arts</span> Notice the recurring idea across every art form here: less is deliberately shown, and the viewer completes the meaning — the same instinct that makes a rock garden's empty gravel as important as its rocks.</div>`,
    `<span class="eyebrow">JSC301m · Chương 5 · Bài 5.1</span>
<h2>Nghệ thuật truyền thống &amp; thẩm mỹ: 侘寂, 浮世絵, 能/歌舞伎</h2>
<h3>Wabi-sabi (侘寂) — vẻ đẹp trong sự không hoàn hảo</h3>
<p><strong>Wabi-sabi</strong> là thẩm mỹ chấp nhận sự vô thường và không hoàn hảo: một chén trà nứt được hàn lại bằng sơn mài dát vàng lộ rõ vết nứt (<strong>金継ぎ kintsugi</strong>) được xem là đẹp hơn, chứ không kém đẹp, vì vết sửa trung thực với lịch sử của nó. Khái niệm này gắn với tư tưởng Phật giáo về <strong>vô thường (無常 mujō)</strong> — không có gì được xem là hoàn thiện hay vĩnh viễn.</p>
<h3>Ukiyo-e (浮世絵) — tranh "thế giới nổi trôi"</h3>
<p>Tranh khắc gỗ <strong>ukiyo-e</strong> (thời Edo) khắc hoạ diễn viên kabuki, kỹ nữ, phong cảnh và đời sống đô thị thường nhật cho khán giả đại chúng, thương mại — ngược hẳn nghệ thuật cung đình quý tộc. Các bậc thầy tiêu biểu: <strong>Hokusai</strong> (bức <em>Sóng lừng ngoài khơi Kanagawa</em>) và <strong>Hiroshige</strong> (chuỗi tranh phong cảnh). Ukiyo-e sau này ảnh hưởng đến trường phái Ấn tượng châu Âu (<em>Japonisme</em>).</p>
<h3>Noh (能) &amp; Kabuki (歌舞伎) — hai kiểu kịch nghệ</h3>
<ul>
<li><strong>Noh (能)</strong> — kịch chậm rãi, đeo mặt nạ, tối giản, dành cho tầng lớp samurai (thời Muromachi); diễn viên đeo mặt nạ gỗ chạm khắc (<strong>面 men</strong>) để hoá thân thành thần linh, hồn ma, thần thánh.</li>
<li><strong>Kabuki (歌舞伎)</strong> — kịch nghệ đại chúng, rực rỡ sắc màu (thời Edo) với hoá trang cường điệu (<strong>隈取 kumadori</strong>), toàn bộ diễn viên là nam giới, và tư thế kịch tính (<strong>見得 mie</strong>) đóng băng hành động ở đỉnh điểm cảm xúc.</li>
</ul>
<h3>Các nghệ thuật tinh tế khác</h3>
<ul>
<li><strong>Ikebana (生け花)</strong> — nghệ thuật cắm hoa, coi trọng sự bất đối xứng và khoảng trống hơn là sự đối xứng và đầy đặn.</li>
<li><strong>Origami (折り紙)</strong> — gấp giấy; con hạc giấy (<strong>折り鶴 orizuru</strong>) biểu trưng cho hoà bình và trường thọ.</li>
<li><strong>Bonsai (盆栽)</strong> — cây cảnh trồng chậu thu nhỏ, được tạo dáng qua nhiều năm để gợi hình ảnh một cây trưởng thành ngoài tự nhiên.</li>
</ul>
<pre><code>侘寂 wabi-sabi    vẻ đẹp trong sự không hoàn hảo &amp; vô thường
無常 mujō         vô thường (khái niệm Phật giáo)
金継ぎ kintsugi   hàn gốm bằng sơn mài dát vàng lộ vết nứt
浮世絵 ukiyo-e    "tranh thế giới nổi trôi" (tranh khắc gỗ)
能   Noh          kịch cổ điển chậm rãi, đeo mặt nạ
歌舞伎 Kabuki      kịch đại chúng, phong cách cường điệu
生け花 ikebana    nghệ thuật cắm hoa
盆栽 bonsai        cây cảnh trồng chậu thu nhỏ
</code></pre>
<div class="callout"><span class="badge">Một mạch xuyên suốt nhiều loại hình</span> Hãy để ý ý tưởng lặp lại xuyên suốt mọi loại hình nghệ thuật ở đây: cái được phô bày là có chủ đích tối giản, người xem tự hoàn thiện phần ý nghĩa còn lại — cùng bản năng khiến khoảng sỏi trống trong vườn đá cũng quan trọng như những hòn đá.</div>`,
  ]]);

const c5q = quiz('jsc301m-quiz-5', 'Quiz 5 — Traditional arts|||Quiz 5 — Nghệ thuật truyền thống', [
  { id: 'q1', question: '"Kintsugi" (金継ぎ) minh hoạ triết lý thẩm mỹ nào?', options: ['Wabi-sabi — vẻ đẹp trong sự không hoàn hảo', 'Sự hoàn hảo tuyệt đối', 'Chủ nghĩa tối giản phương Tây', 'Nghi thức trà đạo'], correctIndex: 0, explanation: 'Kintsugi hàn gốm vỡ bằng sơn mài dát vàng, lộ vết nứt thay vì che giấu — minh hoạ wabi-sabi.' },
  { id: 'q2', question: 'Điểm khác biệt chính giữa Noh (能) và Kabuki (歌舞伎) là gì?', options: ['Noh chậm rãi, đeo mặt nạ, dành cho samurai; Kabuki rực rỡ, đại chúng', 'Cả hai giống hệt nhau', 'Kabuki chỉ diễn trong đền chùa', 'Noh xuất hiện sau Kabuki'], correctIndex: 0, explanation: 'Noh (thời Muromachi) tối giản, đeo mặt nạ cho tầng lớp samurai; Kabuki (thời Edo) đại chúng, cường điệu.' },
  { id: 'q3', question: 'Ukiyo-e (浮世絵) là loại hình nghệ thuật nào?', options: ['Điêu khắc gỗ', 'Tranh khắc gỗ mô tả đời sống thị dân, diễn viên, phong cảnh', 'Thư pháp', 'Kiến trúc đền chùa'], correctIndex: 1, explanation: 'Ukiyo-e là tranh khắc gỗ thời Edo, phổ biến đại chúng, sau này ảnh hưởng tới Ấn tượng châu Âu.' },
]);

const c6 = doc('jsc301m-6-1-am-thuc-trang-phuc', '6.1 — Food, dress & daily life (和食, 着物)|||6.1 — Ẩm thực, trang phục & đời sống (和食, 着物)',
  'Washoku (一汁三菜, umami, dashi), kimono/yukata & obi, nhà truyền thống (tatami, fusuma, engawa), onsen.',
  [[
    `<span class="eyebrow">JSC301m · Chapter 6 · Lesson 6.1</span>
<h2>Food, dress &amp; daily life: washoku, kimono</h2>
<h3>Washoku (和食) — traditional Japanese cuisine</h3>
<p>UNESCO-listed as intangible cultural heritage, <strong>washoku</strong> follows the principle of <strong>ichijū-sansai (一汁三菜)</strong> — one soup, three side dishes, plus rice — built around <strong>umami (旨味)</strong>, the "fifth taste" carried by <strong>dashi (出汁)</strong> stock (kombu kelp + katsuobushi bonito flakes). Seasonality (<strong>旬 shun</strong>) matters as much as flavour: a dish is chosen because an ingredient is at its best that week.</p>
<h3>Kimono (着物) &amp; yukata (浴衣)</h3>
<p>The <strong>kimono (着物, literally "thing to wear")</strong> is a T-shaped robe wrapped left-over-right (right-over-left is reserved for dressing the dead) and secured with a wide sash (<strong>帯 obi</strong>). Formality, pattern and sleeve length signal age, marital status and occasion. The <strong>yukata (浴衣)</strong> is its light cotton, casual cousin worn in summer and at hot-spring inns.</p>
<h3>The traditional home</h3>
<ul>
<li><strong>Tatami (畳)</strong> — woven straw floor mats; room size is even measured in tatami units.</li>
<li><strong>Fusuma (襖)</strong> — sliding paper-and-wood partition doors that can reconfigure a room's layout.</li>
<li><strong>Engawa (縁側)</strong> — a narrow veranda blurring the line between indoors and the garden.</li>
<li><strong>Onsen (温泉)</strong> — natural hot-spring baths, a social as much as hygienic ritual, bathed nude by gender-separated custom.</li>
</ul>
<pre><code>和食 washoku          traditional Japanese cuisine
一汁三菜 ichijū-sansai  one soup, three side dishes (+ rice)
旨味 umami            the "fifth taste" (savoury depth)
出汁 dashi            Japanese soup/cooking stock
着物 kimono           traditional wrapped robe
帯   obi              wide sash worn with kimono
畳   tatami           woven straw floor mat
温泉 onsen            natural hot-spring bath
</code></pre>
<div class="callout"><span class="badge">Form encodes meaning</span> Wrapping direction on a kimono, or the order dishes arrive in a kaiseki meal, are not style choices — reading them wrong sends an unintended, sometimes serious, social signal.</div>`,
    `<span class="eyebrow">JSC301m · Chương 6 · Bài 6.1</span>
<h2>Ẩm thực, trang phục &amp; đời sống: 和食, 着物</h2>
<h3>Washoku (和食) — ẩm thực truyền thống Nhật Bản</h3>
<p>Được UNESCO công nhận là di sản văn hoá phi vật thể, <strong>washoku</strong> tuân theo nguyên tắc <strong>一汁三菜 (ichijū-sansai)</strong> — một canh, ba món phụ, cùng cơm — xoay quanh <strong>umami (旨味)</strong>, "vị thứ năm" mang lại từ nước dùng <strong>dashi (出汁)</strong> (rong biển kombu + cá ngừ bào katsuobushi). Tính theo mùa (<strong>旬 shun</strong>) quan trọng không kém hương vị: một món được chọn vì nguyên liệu đang ở độ ngon nhất trong tuần đó.</p>
<h3>Kimono (着物) &amp; yukata (浴衣)</h3>
<p><strong>Kimono (着物, nghĩa đen "vật để mặc")</strong> là áo choàng hình chữ T, được quấn vạt trái đè lên vạt phải (vạt phải đè trái chỉ dùng khi liệm người đã mất) và cố định bằng đai lưng rộng (<strong>帯 obi</strong>). Độ trang trọng, hoạ tiết và độ dài tay áo thể hiện tuổi tác, tình trạng hôn nhân và dịp mặc. <strong>Yukata (浴衣)</strong> là phiên bản cotton nhẹ, thường ngày hơn, mặc vào mùa hè và ở các nhà trọ suối nước nóng.</p>
<h3>Ngôi nhà truyền thống</h3>
<ul>
<li><strong>Tatami (畳)</strong> — chiếu dệt từ rơm; diện tích phòng thậm chí được đo bằng đơn vị chiếu tatami.</li>
<li><strong>Fusuma (襖)</strong> — cửa trượt bằng giấy và gỗ, có thể thay đổi cách bố trí một căn phòng.</li>
<li><strong>Engawa (縁側)</strong> — hiên hẹp làm mờ ranh giới giữa trong nhà và khu vườn.</li>
<li><strong>Onsen (温泉)</strong> — suối nước nóng tự nhiên, vừa là nghi thức xã giao vừa là vệ sinh, tắm khoả thân theo tục lệ tách riêng nam nữ.</li>
</ul>
<pre><code>和食 washoku          ẩm thực truyền thống Nhật Bản
一汁三菜 ichijū-sansai  một canh, ba món phụ (+ cơm)
旨味 umami            "vị thứ năm" (vị đậm đà)
出汁 dashi            nước dùng Nhật Bản
着物 kimono           áo choàng truyền thống
帯   obi              đai lưng rộng đi kèm kimono
畳   tatami           chiếu dệt rơm
温泉 onsen            suối nước nóng tự nhiên
</code></pre>
<div class="callout"><span class="badge">Hình thức mang theo ý nghĩa</span> Hướng quấn vạt áo kimono, hay thứ tự món ăn dọn ra trong một bữa kaiseki, không phải là lựa chọn phong cách tuỳ ý — hiểu sai chúng gửi đi một tín hiệu xã hội ngoài ý muốn, đôi khi rất nghiêm trọng.</div>`,
  ]]);

const c6q = quiz('jsc301m-quiz-6', 'Quiz 6 — Food & dress|||Quiz 6 — Ẩm thực & trang phục', [
  { id: 'q1', question: 'Nguyên tắc "ichijū-sansai" (一汁三菜) trong washoku nghĩa là gì?', options: ['Một canh, ba món phụ cùng cơm', 'Ba loại nước chấm', 'Bốn mùa ẩm thực', 'Năm vị cơ bản'], correctIndex: 0, explanation: 'Ichijū-sansai là bố cục bữa ăn washoku chuẩn: một canh, ba món phụ, cùng cơm.' },
  { id: 'q2', question: 'Vì sao hướng quấn vạt áo kimono lại quan trọng?', options: ['Chỉ là thẩm mỹ cá nhân', 'Vạt phải đè trái chỉ dùng khi liệm người mất, quấn sai gửi tín hiệu xã hội nghiêm trọng', 'Không có quy tắc nào cả', 'Chỉ áp dụng cho yukata'], correctIndex: 1, explanation: 'Kimono quấn trái đè phải khi mặc sống; phải đè trái chỉ dành cho người đã khuất.' },
  { id: 'q3', question: '"Umami" (旨味) được gọi là gì trong ẩm thực Nhật?', options: ['Vị chua', 'Vị thứ năm, vị đậm đà từ dashi', 'Vị cay', 'Vị ngọt tự nhiên'], correctIndex: 1, explanation: 'Umami là "vị thứ năm", vị đậm đà đặc trưng mang lại từ nước dùng dashi.' },
]);

const c7 = doc('jsc301m-7-1-van-hoa-dai-chung', '7.1 — Pop culture: anime, manga & Cool Japan (アニメ, 漫画)|||7.1 — Văn hoá đại chúng: anime, manga & Cool Japan (アニメ, 漫画)',
  'Manga (Tezuka Osamu), anime (Studio Ghibli, otaku), chính sách Cool Japan biến văn hoá đại chúng thành sức mạnh mềm quốc gia.',
  [[
    `<span class="eyebrow">JSC301m · Chapter 7 · Lesson 7.1</span>
<h2>Pop culture: anime, manga &amp; Cool Japan</h2>
<h3>Manga (漫画) — the comics tradition</h3>
<p><strong>Tezuka Osamu (手塚治虫)</strong>, creator of <em>Astro Boy (鉄腕アトム)</em>, is widely called "the god of manga" (<strong>漫画の神様</strong>) for shaping the cinematic panel style and genre range that defines modern manga — serialised weekly in magazines, then collected into paperback volumes (<strong>単行本 tankōbon</strong>), spanning genres for every age and gender (shōnen 少年 for boys, shōjo 少女 for girls, seinen 青年 for adult men, josei 女性 for adult women).</p>
<h3>Anime (アニメ) — animation as an industry</h3>
<p><strong>Anime</strong> is Japan's distinct animation style/industry, ranging from TV series to feature films. <strong>Studio Ghibli (スタジオジブリ)</strong>, co-founded by <strong>Miyazaki Hayao (宮崎駿)</strong>, brought anime global arthouse prestige (<em>Spirited Away</em>, <em>My Neighbor Totoro</em>). The devoted-fan subculture is called <strong>otaku (オタク)</strong> — originally a mild slur, now reclaimed as an identity by many fans, domestically and abroad.</p>
<h3>Cool Japan (クールジャパン) — culture as soft power</h3>
<p>Since the 2000s, the Japanese government has run a <strong>Cool Japan</strong> policy to export manga, anime, J-pop, fashion, gaming and food as a form of national branding and soft power — turning what was once subcultural into official cultural diplomacy.</p>
<pre><code>漫画 manga           Japanese comics
単行本 tankōbon      collected paperback comic volume
アニメ anime          Japanese animation
オタク otaku          devoted fan / hobbyist subculture
少年 shōnen / 少女 shōjo  boys' / girls' manga demographic
クールジャパン Cool Japan  govt. policy exporting pop culture as soft power
コスプレ cosplay      costume play, dressing as a character
</code></pre>
<div class="callout"><span class="badge">Subculture to state policy</span> The arc from Tezuka's post-war manga to a government "Cool Japan" ministry-level strategy shows how a once-marginal youth medium became one of Japan's main global exports and diplomatic tools.</div>`,
    `<span class="eyebrow">JSC301m · Chương 7 · Bài 7.1</span>
<h2>Văn hoá đại chúng: anime, manga &amp; Cool Japan</h2>
<h3>Manga (漫画) — truyền thống truyện tranh</h3>
<p><strong>Tezuka Osamu (手塚治虫)</strong>, cha đẻ của <em>Astro Boy (鉄腕アトム)</em>, được xem là "vị thần của manga" (<strong>漫画の神様</strong>) vì đã định hình phong cách kể chuyện theo khung hình kiểu điện ảnh và độ đa dạng thể loại làm nên manga hiện đại — đăng nhiều kỳ hàng tuần trên tạp chí, rồi tập hợp thành tập sách (<strong>単行本 tankōbon</strong>), trải rộng thể loại cho mọi độ tuổi và giới tính (shōnen 少年 cho nam thiếu niên, shōjo 少女 cho nữ thiếu niên, seinen 青年 cho nam trưởng thành, josei 女性 cho nữ trưởng thành).</p>
<h3>Anime (アニメ) — hoạt hình như một ngành công nghiệp</h3>
<p><strong>Anime</strong> là phong cách/ngành hoạt hình đặc trưng của Nhật Bản, từ phim truyền hình đến phim điện ảnh. <strong>Studio Ghibli (スタジオジブリ)</strong>, đồng sáng lập bởi <strong>Miyazaki Hayao (宮崎駿)</strong>, đưa anime lên tầm vóc nghệ thuật được công nhận toàn cầu (<em>Vùng Đất Linh Hồn</em>, <em>Hàng Xóm Của Tôi Là Totoro</em>). Nhóm fan cuồng nhiệt được gọi là <strong>otaku (オタク)</strong> — vốn là từ mang sắc thái miệt thị nhẹ, nay được nhiều fan trong và ngoài nước tái định nghĩa như một bản sắc.</p>
<h3>Cool Japan (クールジャパン) — văn hoá như sức mạnh mềm</h3>
<p>Từ những năm 2000, chính phủ Nhật Bản triển khai chính sách <strong>Cool Japan</strong> để xuất khẩu manga, anime, J-pop, thời trang, game và ẩm thực như một hình thức xây dựng thương hiệu quốc gia và sức mạnh mềm — biến thứ từng là văn hoá ngoài lề thành ngoại giao văn hoá chính thức.</p>
<pre><code>漫画 manga           truyện tranh Nhật Bản
単行本 tankōbon      tập truyện tranh đóng thành sách
アニメ anime          hoạt hình Nhật Bản
オタク otaku          fan cuồng nhiệt / nhóm đam mê chuyên sâu
少年 shōnen / 少女 shōjo  phân khúc manga nam / nữ thiếu niên
クールジャパン Cool Japan  chính sách xuất khẩu văn hoá đại chúng làm sức mạnh mềm
コスプレ cosplay      hoá trang thành nhân vật
</code></pre>
<div class="callout"><span class="badge">Từ văn hoá ngoài lề đến chính sách quốc gia</span> Hành trình từ manga hậu chiến của Tezuka đến chiến lược cấp bộ "Cool Japan" cho thấy một loại hình truyền thông giới trẻ từng bị xem nhẹ đã trở thành một trong những mặt hàng xuất khẩu và công cụ ngoại giao toàn cầu chủ lực của Nhật Bản.</div>`,
  ]]);

const c7q = quiz('jsc301m-quiz-7', 'Quiz 7 — Pop culture|||Quiz 7 — Văn hoá đại chúng', [
  { id: 'q1', question: 'Ai được xem là "vị thần của manga" (漫画の神様)?', options: ['Miyazaki Hayao', 'Tezuka Osamu', 'Hokusai', 'Sen no Rikyū'], correctIndex: 1, explanation: 'Tezuka Osamu, cha đẻ Astro Boy, được xem là "vị thần của manga" nhờ định hình phong cách manga hiện đại.' },
  { id: 'q2', question: '"Otaku" (オタク) ban đầu và hiện nay được hiểu như thế nào?', options: ['Luôn mang nghĩa xúc phạm', 'Vốn miệt thị nhẹ, nay nhiều fan tái định nghĩa như bản sắc', 'Chỉ dùng cho người nước ngoài', 'Chỉ áp dụng cho manga, không dùng cho anime'], correctIndex: 1, explanation: 'Otaku vốn là từ miệt thị nhẹ, nay được nhiều fan trong và ngoài Nhật tái định nghĩa như một bản sắc.' },
  { id: 'q3', question: '"Cool Japan" là gì?', options: ['Tên một bộ anime nổi tiếng', 'Chính sách chính phủ xuất khẩu văn hoá đại chúng làm sức mạnh mềm', 'Festival mùa hè', 'Hãng sản xuất kimono'], correctIndex: 1, explanation: 'Cool Japan là chính sách của chính phủ Nhật xuất khẩu manga, anime, J-pop... như sức mạnh mềm quốc gia.' },
]);

const c8 = doc('jsc301m-8-1-xa-hoi-hien-dai-on-tap', '8.1 — Modern society, Vietnam-Japan ties & review|||8.1 — Xã hội hiện đại, quan hệ Nhật-Việt & ôn tập',
  'Xã hội già hoá (少子高齢化), hikikomori, karōshi; quan hệ Đối tác chiến lược sâu rộng Nhật-Việt; ôn tập mạch xuyên suốt 8 chương.',
  [[
    `<span class="eyebrow">JSC301m · Chapter 8 · Lesson 8.1</span>
<h2>Modern Japanese society, Japan-Vietnam ties &amp; review</h2>
<h3>An ageing, shrinking society (少子高齢化 shōshi kōreika)</h3>
<p>Japan faces a demographic crunch: a falling birth rate combined with the world's longest life expectancy means a shrinking workforce supporting a growing retired population. Related social phenomena studied alongside it: <strong>hikikomori (引きこもり)</strong> — acute, prolonged social withdrawal, mostly among young adults; <strong>karōshi (過労死)</strong> — literally "death from overwork", which pushed reforms limiting overtime hours; and <strong>kodokushi (孤独死)</strong> — dying alone, unnoticed, tied to an ageing, increasingly single-person-household society.</p>
<h3>Japan-Vietnam relations (日越関係)</h3>
<p>Japan and Vietnam are an <strong>Extensive Strategic Partnership</strong>: Japan is a top source of ODA (official development assistance) and foreign direct investment into Vietnam, and Vietnam is now one of the largest source countries for Japan's <strong>Technical Intern Training Program (技能実習制度)</strong> and international students, with a large and growing Vietnamese community living and working across Japan. This economic and people-to-people tie is the practical, present-day bridge between the two cultures this course studies.</p>
<h3>Review — the arc of the course</h3>
<pre><code>Ch.1 Geography &amp; history (時代)      -> the timeline everything else hangs on
Ch.2 Shinto &amp; Buddhism (神道/仏教)    -> the religious base of ritual &amp; values
Ch.3 Values (本音/建前, 和, 甘え)      -> the psychology behind behaviour
Ch.4 Customs &amp; festivals (祭り, 茶道)  -> values made visible as ritual
Ch.5 Traditional arts (侘寂, 浮世絵)   -> the same aesthetic instinct, many forms
Ch.6 Food &amp; dress (和食, 着物)        -> everyday life encoding the same values
Ch.7 Pop culture (アニメ, 漫画)        -> tradition reinvented as global export
Ch.8 Modern society &amp; Vietnam ties  -> where the culture stands today, and how it meets us
</code></pre>
<div class="callout"><span class="badge">The thread through all eight chapters</span> Harmony (和), attention to form, and the coexistence of old and new run from Shinto ritual in Chapter 1 all the way to an anime export strategy in Chapter 7 — Japanese culture is best understood as one continuous logic, not eight separate topics.</div>`,
    `<span class="eyebrow">JSC301m · Chương 8 · Bài 8.1</span>
<h2>Xã hội Nhật Bản hiện đại, quan hệ Nhật-Việt &amp; ôn tập</h2>
<h3>Xã hội già hoá, ít sinh (少子高齢化 shōshi kōreika)</h3>
<p>Nhật Bản đối mặt với khủng hoảng nhân khẩu học: tỷ lệ sinh giảm kết hợp với tuổi thọ trung bình cao hàng đầu thế giới khiến lực lượng lao động thu hẹp phải gánh một dân số nghỉ hưu ngày càng đông. Các hiện tượng xã hội liên quan được nghiên cứu song song: <strong>hikikomori (引きこもり)</strong> — tình trạng thu mình khỏi xã hội kéo dài, nghiêm trọng, chủ yếu ở người trẻ trưởng thành; <strong>karōshi (過労死)</strong> — nghĩa đen "chết vì làm việc quá sức", đã thúc đẩy cải cách giới hạn giờ làm thêm; và <strong>kodokushi (孤独死)</strong> — chết trong cô độc, không ai hay biết, gắn với một xã hội già hoá và ngày càng nhiều hộ sống một mình.</p>
<h3>Quan hệ Nhật Bản - Việt Nam (日越関係)</h3>
<p>Nhật Bản và Việt Nam là <strong>Đối tác chiến lược sâu rộng</strong>: Nhật Bản là một trong những nguồn ODA (viện trợ phát triển chính thức) và đầu tư trực tiếp nước ngoài hàng đầu vào Việt Nam, còn Việt Nam hiện là một trong những nước có số lượng lớn nhất tham gia <strong>Chương trình thực tập sinh kỹ năng (技能実習制度)</strong> và du học sinh tại Nhật, với cộng đồng người Việt sinh sống và làm việc ngày càng đông khắp Nhật Bản. Mối liên kết kinh tế và giao lưu con người này chính là cây cầu thực tế, đương đại nối hai nền văn hoá mà môn học này nghiên cứu.</p>
<h3>Ôn tập — mạch xuyên suốt môn học</h3>
<pre><code>Chg.1 Địa lý &amp; lịch sử (時代)        -> trục thời gian mọi thứ khác bám vào
Chg.2 Thần đạo &amp; Phật giáo (神道/仏教) -> nền tôn giáo của nghi thức &amp; giá trị
Chg.3 Giá trị (本音/建前, 和, 甘え)     -> tâm lý đứng sau hành vi
Chg.4 Phong tục &amp; lễ hội (祭り, 茶道)  -> giá trị hiện hình thành nghi thức
Chg.5 Nghệ thuật truyền thống (侘寂)   -> cùng bản năng thẩm mỹ, nhiều hình thức
Chg.6 Ẩm thực &amp; trang phục (和食,着物) -> đời sống thường ngày mã hoá cùng giá trị
Chg.7 Văn hoá đại chúng (アニメ,漫画)   -> truyền thống được tái sinh thành xuất khẩu toàn cầu
Chg.8 Xã hội hiện đại &amp; quan hệ Việt-Nhật -> văn hoá hôm nay đứng ở đâu, và gặp ta thế nào
</code></pre>
<div class="callout"><span class="badge">Mạch xuyên suốt tám chương</span> Sự hài hoà (和), sự chú trọng hình thức, và sự song hành giữa cũ và mới chạy suốt từ nghi thức Thần đạo ở Chương 1 đến chiến lược xuất khẩu anime ở Chương 7 — văn hoá Nhật Bản được hiểu tốt nhất như một logic liên tục, không phải tám chủ đề tách rời.</div>`,
  ]]);

const c8q = quiz('jsc301m-quiz-8', 'Quiz 8 — Modern society & review|||Quiz 8 — Xã hội hiện đại & ôn tập', [
  { id: 'q1', question: '"Karōshi" (過労死) nghĩa đen là gì?', options: ['Chết vì làm việc quá sức', 'Sống một mình cô độc', 'Thu mình khỏi xã hội', 'Nghỉ hưu sớm'], correctIndex: 0, explanation: 'Karōshi (過労死) nghĩa đen là "chết vì làm việc quá sức", dẫn đến cải cách giới hạn giờ làm thêm.' },
  { id: 'q2', question: 'Việt Nam hiện là một trong những nước dẫn đầu về điều gì trong quan hệ với Nhật Bản?', options: ['Xuất khẩu anime sang Nhật', 'Số lượng tham gia Chương trình thực tập sinh kỹ năng và du học sinh tại Nhật', 'Nhập khẩu kimono', 'Tổ chức lễ hội Gion Matsuri'], correctIndex: 1, explanation: 'Việt Nam là một trong những nước có số lượng lớn nhất thực tập sinh kỹ năng và du học sinh tại Nhật.' },
  { id: 'q3', question: 'Sợi chỉ xuyên suốt cả 8 chương của môn học này là gì?', options: ['Chỉ có ẩm thực là quan trọng', 'Sự hài hoà (和) và chú trọng hình thức chạy xuyên suốt từ tôn giáo đến văn hoá đại chúng', 'Mỗi chương hoàn toàn tách biệt, không liên quan', 'Chỉ lịch sử là đáng học'], correctIndex: 1, explanation: 'Wa (和) và sự chú trọng hình thức là mạch logic liên tục nối các chương từ tôn giáo đến pop culture.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'JSC301m',
    slug: 'jsc301m-japanese-culture-japanese-studies',
    title: 'Japanese Culture & Japanese Studies',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JSC301m.webp',
    shortDescription: "Japan's geography & history (時代); Shinto & Buddhism (神道/仏教); values (本音/建前, 和, 甘え); festivals, tea ceremony & arts (侘寂, 浮世絵); food, dress, anime & Cool Japan; society & Vietnam-Japan ties. Bilingual, with terms & quizzes.|||Địa lý & lịch sử Nhật Bản (時代); Thần đạo & Phật giáo (神道/仏教); giá trị tâm lý (本音/建前, 和, 甘え); lễ hội, trà đạo & nghệ thuật (侘寂, 浮世絵); ẩm thực, trang phục, anime & Cool Japan; xã hội & quan hệ Việt-Nhật. Song ngữ, kèm thuật ngữ & quiz.",
    description: 'Môn <strong>JSC301m — Japanese Culture &amp; Japanese Studies (Văn hoá &amp; Nhật Bản học)</strong> thuộc ngành Ngôn ngữ Nhật, kỳ 5, đi qua 8 chương: <strong>địa lý &amp; lịch sử</strong> (thời kỳ 時代) → <strong>Thần đạo &amp; Phật giáo</strong> (神道, 仏教) → <strong>giá trị &amp; tâm lý người Nhật</strong> (本音/建前, 和, 甘え) → <strong>phong tục, lễ hội &amp; nghi thức</strong> (祭り, 茶道) → <strong>nghệ thuật truyền thống</strong> (侘寂, 浮世絵, 能/歌舞伎) → <strong>ẩm thực, trang phục &amp; đời sống</strong> (和食, 着物) → <strong>văn hoá đại chúng</strong> (アニメ, 漫画, Cool Japan) → <strong>xã hội hiện đại &amp; quan hệ Nhật-Việt</strong>. Giảng bằng tiếng Việt, kèm thuật ngữ tiếng Anh và tiếng Nhật (kanji + romaji + nghĩa), có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Địa lý & các thời kỳ lịch sử Nhật Bản (時代); Thần đạo (神道) & Phật giáo (仏教) và sự hoà quyện thần Phật; honne/tatemae, wa (和), amae (甘え), giri/ninjō; matsuri, oshōgatsu, trà đạo (茶道) & nghi thức chào hỏi; wabi-sabi, ukiyo-e, Noh/Kabuki, ikebana, bonsai; washoku (和食), kimono (着物), nhà truyền thống & onsen; manga, anime, otaku & chính sách Cool Japan; xã hội già hoá Nhật Bản & quan hệ Nhật-Việt.',
    requirements: 'Không yêu cầu tiếng Nhật trước đó; môn giảng bằng tiếng Việt kèm thuật ngữ Anh-Nhật. Nên tra cứu thêm trên FLM (flm.fpt.edu.vn) để đối chiếu giáo trình chính thức.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình trích dẫn, tài liệu chính thức, YouTube, công cụ tra kanji, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Chương 1 — Địa lý & lịch sử Nhật Bản|||Chapter 1 — Geography & history', description: 'Địa lý bốn đảo, các thời kỳ (時代), ba bước ngoặt lịch sử.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thần đạo & Phật giáo|||Chapter 2 — Shinto & Buddhism', description: 'Thần đạo (神道), Phật giáo (仏教), thần Phật tập hợp.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Giá trị & tâm lý người Nhật|||Chapter 3 — Values & psychology', description: '本音/建前, 和, 甘え, uchi/soto, giri/ninjō.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phong tục, lễ hội & nghi thức|||Chapter 4 — Customs, festivals & ritual', description: '祭り, お正月, 茶道, nghi thức chào hỏi.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nghệ thuật truyền thống & thẩm mỹ|||Chapter 5 — Traditional arts & aesthetics', description: '侘寂, 浮世絵, 能/歌舞伎, ikebana, bonsai.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ẩm thực, trang phục & đời sống|||Chapter 6 — Food, dress & daily life', description: '和食, 着物, nhà truyền thống, onsen.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Văn hoá đại chúng|||Chapter 7 — Pop culture', description: 'Manga, anime, otaku, Cool Japan.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xã hội hiện đại & ôn tập|||Chapter 8 — Modern society & review', description: 'Xã hội già hoá, quan hệ Nhật-Việt, ôn tập toàn môn.', lessons: [c8, c8q] },
  ],
};
