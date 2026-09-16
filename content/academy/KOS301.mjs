/**
 * KOS301 — Korean Country Studies / Đất nước học Hàn Quốc. Ngành Ngôn ngữ Hàn,
 * FPTU, Kỳ 3. Giáo trình (trích dẫn, KHÔNG upload PDF): "한국의 이해
 * (Understanding Korea)"; "Korea: A Religious History"; tài liệu KOCIS/한국관광공사.
 * 8 chương: địa lý → lịch sử → chính trị → kinh tế (한강의 기적/재벌) → xã hội
 * (교육/저출산) → văn hoá (한복/설날/추석) → Hallyu (한류) → quan hệ Hàn-Việt.
 * Song ngữ Việt-Anh + thuật ngữ Hàn (Hangeul + romaja + nghĩa Việt).
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ lồng nhau.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('kos301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Giáo trình tham khảo (trích dẫn, không phải file tải): 한국의 이해, Korea: A Religious History; nguồn chính thức KOCIS, Korea.net, Korea Tourism Organization.',
  [[
    `<span class="eyebrow">KOS301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">This course is built around widely-used Korean Studies references. We cite them for further reading — <strong>no PDF is distributed here</strong>; use your library or the official free sources below.</p>
<h3>📘 Reference textbooks (citation only)</h3>
<ul>
<li><em>한국의 이해 (Understanding Korea)</em> — a standard overview textbook used in Korean-Studies programs, covering geography, history, politics, economy and culture.</li>
<li><em>Korea: A Religious History</em> — James H. Grayson — shamanism, Buddhism, Confucianism and Christianity in Korean history.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.kocis.go.kr/" target="_blank" rel="noopener">KOCIS — Korean Culture and Information Service</a></li>
<li><a href="https://www.korea.net/" target="_blank" rel="noopener">Korea.net — the government's official English portal</a></li>
<li><a href="https://english.visitkorea.or.kr/" target="_blank" rel="noopener">Korea Tourism Organization (한국관광공사) — Visit Korea</a></li>
<li><a href="https://www.nl.go.kr/" target="_blank" rel="noopener">National Library of Korea</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@koreanet" target="_blank" rel="noopener">Korea.net TV</a> — official culture &amp; policy explainers</li>
<li><a href="https://www.youtube.com/@ArirangTV" target="_blank" rel="noopener">Arirang TV</a> — English-language Korean news &amp; culture</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — geography, administrative map, and the historical timeline (Gojoseon → Joseon → modern).</li>
<li><strong>Institutions</strong> — government structure, the economic "miracle", and the chaebol.</li>
<li><strong>Society &amp; culture</strong> — education, demographics, festivals, Hallyu.</li>
<li><strong>Applied</strong> — Korea-Vietnam relations, current affairs, and terminology in Hangeul.</li>
</ol></div>`,
    `<span class="eyebrow">KOS301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Môn học bám theo các tài liệu Hàn Quốc học phổ biến, được <strong>trích dẫn để tham khảo thêm</strong> — <strong>không có file PDF nào được phát tại đây</strong>; dùng thư viện trường hoặc các nguồn chính thức miễn phí bên dưới.</p>
<h3>📘 Giáo trình tham khảo (chỉ trích dẫn)</h3>
<ul>
<li><em>한국의 이해 (Understanding Korea)</em> — giáo trình tổng quan chuẩn cho ngành Hàn Quốc học, bao quát địa lý, lịch sử, chính trị, kinh tế và văn hoá.</li>
<li><em>Korea: A Religious History</em> — James H. Grayson — shaman giáo, Phật giáo, Nho giáo và Cơ Đốc giáo trong lịch sử Hàn Quốc.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.kocis.go.kr/" target="_blank" rel="noopener">KOCIS — Cục Thông tin &amp; Văn hoá Hàn Quốc</a></li>
<li><a href="https://www.korea.net/" target="_blank" rel="noopener">Korea.net — cổng thông tin tiếng Anh chính thức của chính phủ</a></li>
<li><a href="https://english.visitkorea.or.kr/" target="_blank" rel="noopener">Tổng cục Du lịch Hàn Quốc (한국관광공사) — Visit Korea</a></li>
<li><a href="https://www.nl.go.kr/" target="_blank" rel="noopener">Thư viện Quốc gia Hàn Quốc</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@koreanet" target="_blank" rel="noopener">Korea.net TV</a> — giải thích văn hoá &amp; chính sách chính thức</li>
<li><a href="https://www.youtube.com/@ArirangTV" target="_blank" rel="noopener">Arirang TV</a> — tin tức &amp; văn hoá Hàn Quốc bằng tiếng Anh</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — địa lý, bản đồ hành chính, và dòng thời gian lịch sử (Cổ Triều Tiên → Joseon → hiện đại).</li>
<li><strong>Thể chế</strong> — cơ cấu chính quyền, "kỳ tích" kinh tế, và tập đoàn chaebol.</li>
<li><strong>Xã hội &amp; văn hoá</strong> — giáo dục, dân số, lễ tết, làn sóng Hallyu.</li>
<li><strong>Ứng dụng</strong> — quan hệ Hàn-Việt, thời sự, và thuật ngữ bằng Hangeul.</li>
</ol></div>`,
  ]]);

const intro = doc('kos301-0-1-overview', 'Course overview: Korean Country Studies|||Tổng quan: Đất nước học Hàn Quốc',
  'Vì sao học Đất nước học Hàn Quốc; 8 chương từ địa lý, lịch sử, chính trị, kinh tế đến xã hội, văn hoá, Hallyu và quan hệ Hàn-Việt; cách đọc thuật ngữ Hàn (Hangeul + romaja).',
  [[
    `<span class="eyebrow">KOS301 · Lesson 0.1 · Overview</span>
<h2>Korean Country Studies</h2>
<p class="lead">This course gives you the background every learner of Korean needs beyond the language itself: <strong>where Korea is, how it got here, how it is governed, how its economy grew, how its society lives, and why its pop culture spread worldwide.</strong></p>
<h3>Eight chapters</h3>
<ol>
<li>Geography, territory &amp; climate (지리)</li>
<li>History: from Gojoseon to modern Korea (역사)</li>
<li>Politics &amp; institutions of modern Korea</li>
<li>Economy &amp; the "Miracle on the Han River" (한강의 기적, chaebol 재벌)</li>
<li>Society, education &amp; population (교육, 저출산)</li>
<li>Traditional culture &amp; festivals (한복, 설날, 추석)</li>
<li>Hallyu, K-pop &amp; popular culture (한류)</li>
<li>International relations, Korea-Vietnam &amp; contemporary Korea</li>
</ol>
<h3>How Korean terms are shown</h3>
<p>Every key term appears as <strong>Hangeul (한글) + romaja (Latin transliteration) + Vietnamese/English meaning</strong>, e.g. <strong>한류 (Hallyu — "làn sóng Hàn")</strong>. You don't need to read Hangeul to follow the course, but recognizing these terms will help enormously once you do.</p>`,
    `<span class="eyebrow">KOS301 · Bài 0.1 · Tổng quan</span>
<h2>Đất nước học Hàn Quốc</h2>
<p class="lead">Môn này cung cấp nền tảng mà bất kỳ ai học tiếng Hàn cũng cần, ngoài bản thân ngôn ngữ: <strong>Hàn Quốc nằm ở đâu, đã đi qua những gì, được điều hành ra sao, kinh tế tăng trưởng thế nào, xã hội sống ra sao, và vì sao văn hoá đại chúng của họ lan khắp thế giới.</strong></p>
<h3>Tám chương</h3>
<ol>
<li>Vị trí địa lý, lãnh thổ &amp; khí hậu (지리)</li>
<li>Lịch sử: từ Cổ Triều Tiên đến hiện đại (역사)</li>
<li>Chính trị &amp; thể chế Hàn Quốc hiện đại</li>
<li>Kinh tế &amp; "Kỳ tích sông Hàn" (한강의 기적, chaebol 재벌)</li>
<li>Xã hội, giáo dục &amp; dân số (교육, 저출산)</li>
<li>Văn hoá truyền thống &amp; lễ tết (한복, 설날, 추석)</li>
<li>Làn sóng Hallyu, K-pop &amp; văn hoá đại chúng (한류)</li>
<li>Quan hệ quốc tế, Hàn-Việt &amp; Hàn Quốc đương đại</li>
</ol>
<h3>Cách đọc thuật ngữ tiếng Hàn</h3>
<p>Mỗi thuật ngữ quan trọng đều có <strong>Hangeul (한글) + romaja (phiên âm Latin) + nghĩa tiếng Việt/Anh</strong>, ví dụ <strong>한류 (Hallyu — "làn sóng Hàn")</strong>. Bạn không cần biết đọc Hangeul mới theo được môn học, nhưng nhận diện được các thuật ngữ này sẽ giúp ích rất nhiều khi bạn học đọc.</p>`,
  ]]);

const c1 = doc('kos301-1-1-geography', '1.1 — Geography, territory & climate|||1.1 — Vị trí địa lý, lãnh thổ & khí hậu',
  'Bán đảo Triều Tiên, vĩ tuyến 38 & DMZ, diện tích/dân số Hàn Quốc, 17 đơn vị hành chính cấp 1 (đặc biệt thị/광역시/도), núi Halla & Baekdu, khí hậu 4 mùa & gió mùa (장마).',
  [[
    `<span class="eyebrow">KOS301 · Chapter 1 · Lesson 1.1</span>
<h2>Geography, territory &amp; climate</h2>
<h3>A peninsula split in two</h3>
<p>Korea occupies the <strong>Korean Peninsula</strong> in East Asia, bordering China (via the Amnok/Yalu and Tumen rivers) to the north. Since 1953 it has been divided at roughly the <strong>38th parallel</strong> by the <strong>DMZ (비무장지대, bimujangjidae — "demilitarized zone")</strong> into South Korea (Republic of Korea) and North Korea. South Korea covers about <strong>100,210 km²</strong> — slightly smaller than Iceland — with a population of roughly <strong>51.7 million</strong> (2024), about half of whom live in the Seoul Capital Area.</p>
<h3>Administrative map — 17 first-level divisions</h3>
<pre><code>Seoul (서울특별시)         Special City          — capital, ~9.4M people
Busan (부산광역시)         Metropolitan City     — 2nd city, major port
Incheon (인천광역시)       Metropolitan City     — main international airport
Daegu / Gwangju / Daejeon / Ulsan     Metropolitan Cities (광역시)
Sejong (세종특별자치시)    Special Self-Gov. City — administrative capital, est. 2012
Gyeonggi-do (경기도)       Province              — most populous, surrounds Seoul
Gangwon / Chungcheong(N,S) / Jeolla(N,S) / Gyeongsang(N,S)   Provinces (도)
Jeju-do (제주특별자치도)   Special Self-Gov. Province — volcanic island

Total: 17 first-level divisions · ~100,210 km² · ~51.7 million people (2024)</code></pre>
<p>Note: since 2023-2024, Gangwon and North Jeolla were separately upgraded to "special self-governing province" status for greater autonomy — the table above shows the classic civics grouping still used in most textbooks.</p>
<h3>Mountains &amp; the "Baekdu-daegan" spine</h3>
<ul>
<li><strong>Baekdudaegan (백두대간)</strong> — the mountain range running the length of the peninsula, considered its geographic and symbolic backbone.</li>
<li><strong>Hallasan (한라산)</strong> — 1,947 m, on Jeju Island, the highest peak in South Korea; a dormant volcano.</li>
<li><strong>Baekdusan (백두산)</strong> — 2,744 m, on the China-North Korea border, the highest peak on the whole peninsula and a national symbol referenced in the anthem.</li>
</ul>
<h3>Climate: four seasons, one monsoon</h3>
<p>Korea has a <strong>temperate climate with four distinct seasons</strong>: a cold, dry winter driven by the Siberian high-pressure system; a hot, humid summer; and short spring/autumn. The rainy season is called <strong>jangma (장마)</strong>, roughly June-July, followed by typhoon season in late summer.</p>
<div class="callout"><span class="badge">Term</span> <strong>DMZ / 비무장지대 (bimujangjidae)</strong> — the ~4 km-wide buffer along the 38th parallel, one of the most heavily fortified borders on Earth, ironically also a de facto wildlife sanctuary.</div>`,
    `<span class="eyebrow">KOS301 · Chương 1 · Bài 1.1</span>
<h2>Vị trí địa lý, lãnh thổ &amp; khí hậu</h2>
<h3>Một bán đảo bị chia đôi</h3>
<p>Hàn Quốc nằm trên <strong>bán đảo Triều Tiên</strong> ở Đông Á, giáp Trung Quốc (qua sông Áp Lục/Amnok và sông Đồ Môn/Tumen) ở phía bắc. Từ năm 1953, bán đảo bị chia cắt gần đúng theo <strong>vĩ tuyến 38</strong> bởi <strong>DMZ (비무장지대, bimujangjidae — "khu phi quân sự")</strong> thành Hàn Quốc (Đại Hàn Dân Quốc) và Triều Tiên (CHDCND Triều Tiên). Hàn Quốc rộng khoảng <strong>100.210 km²</strong> — nhỏ hơn Iceland một chút — dân số khoảng <strong>51,7 triệu</strong> (2024), trong đó gần một nửa sống ở vùng thủ đô Seoul.</p>
<h3>Bản đồ hành chính — 17 đơn vị cấp 1</h3>
<pre><code>Seoul (서울특별시)         Đặc biệt thị          — thủ đô, ~9,4 triệu dân
Busan (부산광역시)         Quảng vực thị (도시lớn)— thành phố lớn thứ 2, cảng biển
Incheon (인천광역시)       Quảng vực thị         — sân bay quốc tế chính
Daegu / Gwangju / Daejeon / Ulsan     Quảng vực thị (광역시)
Sejong (세종특별자치시)    Đặc biệt tự trị thị   — thủ đô hành chính, lập 2012
Gyeonggi-do (경기도)       Đạo (tỉnh)            — đông dân nhất, bao quanh Seoul
Gangwon / Chungcheong(Bắc,Nam) / Jeolla(Bắc,Nam) / Gyeongsang(Bắc,Nam)   Đạo (도)
Jeju-do (제주특별자치도)   Đặc biệt tự trị đạo   — đảo núi lửa

Tổng: 17 đơn vị cấp 1 · ~100.210 km² · ~51,7 triệu dân (2024)</code></pre>
<p>Lưu ý: từ 2023-2024, Gangwon và Bắc Jeolla lần lượt được nâng thành "đạo tự trị đặc biệt" để tăng quyền tự chủ — bảng trên theo cách phân loại phổ thông vẫn dùng trong hầu hết giáo trình.</p>
<h3>Núi non &amp; "xương sống Baekdu-daegan"</h3>
<ul>
<li><strong>Baekdudaegan (백두대간)</strong> — dãy núi chạy dọc suốt bán đảo, được xem là xương sống địa lý và biểu tượng của Hàn Quốc.</li>
<li><strong>Hallasan (한라산)</strong> — cao 1.947 m, trên đảo Jeju, đỉnh cao nhất Hàn Quốc; một núi lửa đang ngủ.</li>
<li><strong>Baekdusan (백두산)</strong> — cao 2.744 m, trên biên giới Trung Quốc-Triều Tiên, đỉnh cao nhất toàn bán đảo và là biểu tượng quốc gia được nhắc trong quốc ca.</li>
</ul>
<h3>Khí hậu: bốn mùa, một mùa mưa</h3>
<p>Hàn Quốc có <strong>khí hậu ôn đới với bốn mùa rõ rệt</strong>: mùa đông lạnh, khô do áp cao Siberia; mùa hè nóng ẩm; xuân/thu ngắn. Mùa mưa gọi là <strong>jangma (장마)</strong>, khoảng tháng 6-7, tiếp theo là mùa bão cuối hè.</p>
<div class="callout"><span class="badge">Thuật ngữ</span> <strong>DMZ / 비무장지대 (bimujangjidae)</strong> — vùng đệm rộng khoảng 4 km dọc vĩ tuyến 38, một trong những biên giới được vũ trang dày đặc nhất thế giới, trớ trêu thay lại cũng là khu bảo tồn hoang dã trên thực tế.</div>`,
  ]]);

const c1q = quiz('kos301-quiz-1', 'Quiz 1 — Địa lý Hàn Quốc|||Quiz 1 — Địa lý Hàn Quốc', [
  { id: 'q1', question: 'Bán đảo Triều Tiên bị chia thành hai miền Nam-Bắc từ năm nào, dọc theo ranh giới nào?', options: ['1945, sông Áp Lục', '1953, khoảng vĩ tuyến 38', '1910, vĩ tuyến 30', '1987, sông Tumen'], correctIndex: 1, explanation: 'Sau Chiến tranh Triều Tiên (kết thúc 1953), ranh giới đình chiến nằm gần vĩ tuyến 38, với DMZ (비무장지대) là vùng đệm.' },
  { id: 'q2', question: 'Đỉnh núi cao nhất của Hàn Quốc (South Korea), nằm trên đảo Jeju, là?', options: ['Baekdusan (백두산)', 'Hallasan (한라산)', 'Baekdudaegan (백두대간)', 'Namsan (남산)'], correctIndex: 1, explanation: 'Hallasan (1.947 m) trên đảo Jeju là đỉnh cao nhất South Korea; Baekdusan (2.744 m) cao hơn nhưng nằm ở biên giới Triều Tiên-Trung Quốc, thuộc toàn bán đảo.' },
  { id: 'q3', question: 'Mùa mưa của Hàn Quốc, thường rơi vào khoảng tháng 6-7, được gọi là?', options: ['Chuseok (추석)', 'Jangma (장마)', 'Seollal (설날)', 'Hallyu (한류)'], correctIndex: 1, explanation: 'Jangma (장마) là mùa mưa/gió mùa hè của Hàn Quốc, trước mùa bão cuối hè.' },
]);

const c2 = doc('kos301-2-1-history', '2.1 — History: from Gojoseon to modern Korea|||2.1 — Lịch sử: từ Cổ Triều Tiên đến hiện đại',
  'Cổ Triều Tiên & Dangun, Tam Quốc (Goguryeo/Baekje/Silla), Silla thống nhất, Goryeo (nguồn gốc tên "Korea"), Joseon & vua Sejong sáng tạo Hangeul, thời Nhật thuộc, chia cắt & Chiến tranh Triều Tiên.',
  [[
    `<span class="eyebrow">KOS301 · Chapter 2 · Lesson 2.1</span>
<h2>History: from Gojoseon to modern Korea</h2>
<pre><code>c. 2333 BC   Gojoseon (고조선) — legendary founding by Dangun (단군)
57 BC-935 AD Three Kingdoms &amp; Unified Silla (see below)
918-1392     Goryeo (고려) — root of the name "Korea"
1392-1897    Joseon (조선) — Confucian state; Hangeul created 1443/1446
1897-1910    Korean Empire (대한제국)
1910-1945    Japanese colonial rule (일제강점기)
1945         Liberation; division at the 38th parallel
1948         Republic of Korea &amp; DPRK founded separately
1950-1953    Korean War (한국전쟁) -&gt; Armistice, DMZ established
1960s-1990s  Rapid industrialization ("Miracle on the Han River")
1987-        Democratic Constitution; direct presidential elections</code></pre>
<h3>Ancient &amp; Three Kingdoms period</h3>
<p><strong>Gojoseon (고조선, "Old Joseon")</strong> is traditionally dated to 2333 BC, founded by the legendary <strong>Dangun (단군)</strong>. From roughly the 1st century BC, three rival kingdoms — <strong>Goguryeo (고구려)</strong> in the north, <strong>Baekje (백제)</strong> in the southwest, and <strong>Silla (신라)</strong> in the southeast — controlled the peninsula. Silla, allied with Tang China, unified most of the peninsula in 668 as <strong>Unified Silla (통일신라)</strong>.</p>
<h3>Goryeo &amp; Joseon</h3>
<p><strong>Goryeo (고려, 918-1392)</strong> gave Korea its Western name and produced world firsts such as the <em>Tripitaka Koreana</em> woodblocks and early movable metal type. <strong>Joseon (조선, 1392-1897)</strong> made Confucianism the state ideology. Its most celebrated ruler, <strong>King Sejong the Great (세종대왕)</strong>, created the Korean alphabet <strong>Hangeul (한글)</strong>, published as <em>Hunminjeongeum</em> in 1446 — a phonetic script designed so ordinary people could read and write.</p>
<h3>Colonial rule, division &amp; war</h3>
<p>Korea was annexed by Japan in 1910 (<strong>일제강점기, Iljegangjeomgi</strong>) until liberation in 1945. The peninsula was then split into Soviet (north) and US (south) occupation zones, hardening into two states in 1948. The <strong>Korean War (한국전쟁, 1950-1953)</strong> devastated both sides; the 1953 Armistice (never a peace treaty) fixed the DMZ that still divides the peninsula today.</p>
<div class="callout"><span class="badge">Term</span> <strong>한글 (Hangeul)</strong> — the Korean writing system created under King Sejong; <strong>Hangeul Day (한글날)</strong>, October 9, celebrates it as one of the world's few scripts with a known inventor and creation date.</div>`,
    `<span class="eyebrow">KOS301 · Chương 2 · Bài 2.1</span>
<h2>Lịch sử: từ Cổ Triều Tiên đến hiện đại</h2>
<pre><code>k. 2333 TCN  Cổ Triều Tiên (Gojoseon, 고조선) — lập quốc truyền thuyết bởi Dangun (단군)
57 TCN-935   Tam Quốc &amp; Silla thống nhất (xem bên dưới)
918-1392     Goryeo (고려) — nguồn gốc tên gọi "Korea"
1392-1897    Joseon (조선) — nhà nước Nho giáo; sáng tạo Hangeul năm 1443/1446
1897-1910    Đế quốc Đại Hàn (대한제국)
1910-1945    Thời kỳ Nhật thuộc (일제강점기)
1945         Giải phóng; chia cắt tại vĩ tuyến 38
1948         Đại Hàn Dân Quốc &amp; CHDCND Triều Tiên thành lập riêng biệt
1950-1953    Chiến tranh Triều Tiên (한국전쟁) -&gt; Hiệp định đình chiến, lập DMZ
1960-1990s   Công nghiệp hoá thần tốc ("Kỳ tích sông Hàn")
1987-        Hiến pháp dân chủ; bầu cử tổng thống trực tiếp</code></pre>
<h3>Cổ đại &amp; thời Tam Quốc</h3>
<p><strong>Cổ Triều Tiên (Gojoseon, 고조선)</strong> theo truyền thuyết được lập năm 2333 TCN bởi <strong>Dangun (단군)</strong>. Từ khoảng thế kỷ 1 TCN, ba vương quốc cạnh tranh nhau — <strong>Goguryeo (고구려)</strong> ở phía bắc, <strong>Baekje (백제)</strong> ở tây nam, và <strong>Silla (신라)</strong> ở đông nam — kiểm soát bán đảo. Silla, liên minh với nhà Đường (Trung Quốc), thống nhất phần lớn bán đảo năm 668, trở thành <strong>Silla thống nhất (통일신라)</strong>.</p>
<h3>Goryeo &amp; Joseon</h3>
<p><strong>Goryeo (고려, 918-1392)</strong> là nguồn gốc tên gọi phương Tây "Korea" và tạo ra những "cái đầu tiên của thế giới" như bộ mộc bản <em>Tripitaka Koreana</em> và kỹ thuật in chữ rời bằng kim loại thời kỳ đầu. <strong>Joseon (조선, 1392-1897)</strong> đưa Nho giáo thành quốc giáo. Vị vua được ca ngợi nhất, <strong>vua Sejong Đại Đế (세종대왕)</strong>, đã sáng tạo bảng chữ cái Hàn Quốc <strong>Hangeul (한글)</strong>, công bố dưới tên <em>Hunminjeongeum</em> năm 1446 — một hệ chữ ghi âm được thiết kế để dân thường cũng đọc viết được.</p>
<h3>Thời Nhật thuộc, chia cắt &amp; chiến tranh</h3>
<p>Hàn Quốc bị Nhật Bản sáp nhập năm 1910 (<strong>일제강점기, Iljegangjeomgi</strong>) cho đến khi giải phóng năm 1945. Bán đảo sau đó bị chia thành vùng chiếm đóng của Liên Xô (bắc) và Mỹ (nam), rồi trở thành hai nhà nước riêng năm 1948. <strong>Chiến tranh Triều Tiên (한국전쟁, 1950-1953)</strong> tàn phá cả hai miền; Hiệp định đình chiến năm 1953 (chưa từng là hiệp ước hoà bình) ấn định đường DMZ vẫn còn chia cắt bán đảo đến ngày nay.</p>
<div class="callout"><span class="badge">Thuật ngữ</span> <strong>한글 (Hangeul)</strong> — hệ chữ viết Hàn Quốc do vua Sejong sáng tạo; <strong>Ngày Hangeul (한글날)</strong>, mùng 9 tháng 10, tôn vinh đây là một trong số ít hệ chữ trên thế giới biết rõ người sáng tạo và ngày ra đời.</div>`,
  ]]);

const c2q = quiz('kos301-quiz-2', 'Quiz 2 — Lịch sử Hàn Quốc|||Quiz 2 — Lịch sử Hàn Quốc', [
  { id: 'q1', question: 'Ba vương quốc thời Tam Quốc trên bán đảo Triều Tiên là?', options: ['Goryeo, Joseon, Gojoseon', 'Goguryeo, Baekje, Silla', 'Silla, Balhae, Goryeo', 'Baekje, Joseon, Han'], correctIndex: 1, explanation: 'Goguryeo (bắc), Baekje (tây nam) và Silla (đông nam) là ba vương quốc thời Tam Quốc; Silla sau đó thống nhất phần lớn bán đảo năm 668.' },
  { id: 'q2', question: 'Bảng chữ cái Hangeul (한글) được sáng tạo dưới triều đại nào, bởi ai?', options: ['Goryeo, bởi các nhà sư', 'Joseon, bởi vua Sejong Đại Đế', 'Cổ Triều Tiên, bởi Dangun', 'Đế quốc Đại Hàn, bởi hoàng đế Gojong'], correctIndex: 1, explanation: 'Vua Sejong Đại Đế (Joseon) sáng tạo Hangeul, công bố dưới tên Hunminjeongeum năm 1446.' },
  { id: 'q3', question: 'Chiến tranh Triều Tiên (1950-1953) kết thúc bằng?', options: ['Một hiệp ước hoà bình chính thức', 'Hiệp định đình chiến, lập ra đường DMZ', 'Thống nhất hai miền', 'Nhật Bản tái chiếm đóng'], correctIndex: 1, explanation: 'Năm 1953 chỉ có Hiệp định đình chiến (armistice), không phải hiệp ước hoà bình — về mặt kỹ thuật hai miền vẫn trong tình trạng chiến tranh.' },
]);

const c3 = doc('kos301-3-1-politics', '3.1 — Politics & institutions of modern Korea|||3.1 — Chính trị & thể chế Hàn Quốc hiện đại',
  'Cộng hoà tổng thống chế, nhiệm kỳ 5 năm không tái cử, Quốc hội (국회) đơn viện, Toà án Hiến pháp (헌법재판소), phong trào dân chủ hoá (4·19, 5·18, 6월 민주항쟁).',
  [[
    `<span class="eyebrow">KOS301 · Chapter 3 · Lesson 3.1</span>
<h2>Politics &amp; institutions of modern Korea</h2>
<h3>A presidential republic</h3>
<p>South Korea is a <strong>presidential republic</strong>. The President is directly elected for a <strong>single, non-renewable 5-year term</strong> (단임제, danimje) — a rule written into the 1987 Constitution specifically to prevent the long dictatorships of earlier decades. The <strong>National Assembly (국회, Gukhoe)</strong> is a unicameral legislature of 300 members serving 4-year terms. The judiciary includes a <strong>Constitutional Court (헌법재판소, Heonbeop jaepanso)</strong> with power to rule on constitutionality and even remove a sitting president through impeachment — most notably President Park Geun-hye in 2017.</p>
<h3>Hard-won democracy</h3>
<p>Korea's democracy was not automatic — it was built through repeated protest movements:</p>
<ul>
<li><strong>April Revolution, 1960 (4·19혁명)</strong> — student-led protests toppled President Syngman Rhee.</li>
<li><strong>Gwangju Uprising, 1980 (5·18 광주민주화운동)</strong> — a pro-democracy uprising violently suppressed by the military government.</li>
<li><strong>June Democratic Struggle, 1987 (6월 민주항쟁)</strong> — nationwide protests forced direct presidential elections and the current Constitution.</li>
</ul>
<h3>The seat of power</h3>
<p>The presidential office was long known as the <strong>Blue House (청와대, Cheongwadae)</strong>; in 2022 the executive office relocated to the <strong>Yongsan (용산)</strong> district of Seoul. The Constitutional Court's power to check the presidency remains a defining, and periodically tested, feature of the system.</p>
<div class="callout"><span class="badge">Term</span> <strong>탄핵 (tanhaek — "impeachment")</strong> — the constitutional process the National Assembly and Constitutional Court use to remove a president for serious violations, exercised more than once in Korea's recent history.</div>`,
    `<span class="eyebrow">KOS301 · Chương 3 · Bài 3.1</span>
<h2>Chính trị &amp; thể chế Hàn Quốc hiện đại</h2>
<h3>Một nền cộng hoà tổng thống chế</h3>
<p>Hàn Quốc là <strong>cộng hoà theo chế độ tổng thống</strong>. Tổng thống được bầu trực tiếp với <strong>một nhiệm kỳ 5 năm duy nhất, không được tái cử</strong> (단임제, danimje) — quy định được viết vào Hiến pháp 1987 nhằm ngăn chặn các chế độ độc tài kéo dài của những thập niên trước. <strong>Quốc hội (국회, Gukhoe)</strong> là cơ quan lập pháp đơn viện gồm 300 nghị sĩ, nhiệm kỳ 4 năm. Ngành tư pháp có <strong>Toà án Hiến pháp (헌법재판소, Heonbeop jaepanso)</strong> với quyền phán quyết về tính hợp hiến, thậm chí phế truất tổng thống đương nhiệm qua thủ tục luận tội — nổi bật nhất là Tổng thống Park Geun-hye năm 2017.</p>
<h3>Nền dân chủ giành được bằng đấu tranh</h3>
<p>Dân chủ Hàn Quốc không tự nhiên mà có — nó được xây bằng nhiều phong trào biểu tình liên tiếp:</p>
<ul>
<li><strong>Cách mạng Tháng Tư, 1960 (4·19혁명)</strong> — biểu tình do sinh viên dẫn đầu lật đổ Tổng thống Syngman Rhee.</li>
<li><strong>Khởi nghĩa Gwangju, 1980 (5·18 광주민주화운동)</strong> — cuộc nổi dậy đòi dân chủ bị chính quyền quân sự đàn áp đẫm máu.</li>
<li><strong>Đấu tranh Dân chủ Tháng Sáu, 1987 (6월 민주항쟁)</strong> — biểu tình toàn quốc buộc phải khôi phục bầu cử tổng thống trực tiếp và ra đời Hiến pháp hiện hành.</li>
</ul>
<h3>Trụ sở quyền lực</h3>
<p>Văn phòng tổng thống từng được gọi là <strong>Nhà Xanh (청와대, Cheongwadae)</strong>; năm 2022 văn phòng hành pháp chuyển về khu <strong>Yongsan (용산)</strong> ở Seoul. Quyền giám sát tổng thống của Toà án Hiến pháp vẫn là một đặc điểm định hình, và thỉnh thoảng được thử thách, của thể chế này.</p>
<div class="callout"><span class="badge">Thuật ngữ</span> <strong>탄핵 (tanhaek — "luận tội")</strong> — thủ tục hiến định mà Quốc hội và Toà án Hiến pháp dùng để phế truất tổng thống vì vi phạm nghiêm trọng, đã được vận dụng nhiều lần trong lịch sử gần đây của Hàn Quốc.</div>`,
  ]]);

const c3q = quiz('kos301-quiz-3', 'Quiz 3 — Chính trị Hàn Quốc|||Quiz 3 — Chính trị Hàn Quốc', [
  { id: 'q1', question: 'Tổng thống Hàn Quốc được bầu với nhiệm kỳ như thế nào?', options: ['4 năm, được tái cử nhiều lần', '5 năm duy nhất, không được tái cử (단임제)', '7 năm, tái cử một lần', 'Suốt đời'], correctIndex: 1, explanation: 'Hiến pháp 1987 quy định tổng thống chỉ có một nhiệm kỳ 5 năm, không tái cử — để ngăn độc tài kéo dài.' },
  { id: 'q2', question: 'Cơ quan có quyền phán quyết tính hợp hiến và có thể phế truất tổng thống là?', options: ['Quốc hội (국회) một mình', 'Toà án Hiến pháp (헌법재판소)', 'Nhà Xanh (청와대)', 'Uỷ ban bầu cử'], correctIndex: 1, explanation: 'Toà án Hiến pháp (Heonbeop jaepanso) có quyền luận tội và phế truất tổng thống, như trường hợp Park Geun-hye năm 2017.' },
  { id: 'q3', question: 'Phong trào nào năm 1987 buộc khôi phục bầu cử tổng thống trực tiếp ở Hàn Quốc?', options: ['Cách mạng Tháng Tư (4·19)', 'Khởi nghĩa Gwangju (5·18)', 'Đấu tranh Dân chủ Tháng Sáu (6월 민주항쟁)', 'Chiến tranh Triều Tiên'], correctIndex: 2, explanation: 'Đấu tranh Dân chủ Tháng Sáu 1987 (6월 민주항쟁) dẫn tới Hiến pháp hiện hành với bầu cử tổng thống trực tiếp.' },
]);

const c4 = doc('kos301-4-1-economy', '4.1 — Economy & the Miracle on the Han River|||4.1 — Kinh tế & Kỳ tích sông Hàn',
  'Từ nghèo đói hậu chiến đến nền kinh tế top 10-13 thế giới; kế hoạch 5 năm thời Park Chung-hee, chaebol (재벌: Samsung, Hyundai, LG, SK), khủng hoảng tài chính 1997 (외환위기).',
  [[
    `<span class="eyebrow">KOS301 · Chapter 4 · Lesson 4.1</span>
<h2>Economy &amp; the "Miracle on the Han River"</h2>
<h3>From one of the world's poorest to the OECD</h3>
<p>After the Korean War, South Korea was among the poorest countries on Earth. Under President <strong>Park Chung-hee (박정희, 1961-1979)</strong>, the government ran a series of <strong>Five-Year Economic Development Plans</strong>, driving export-oriented industrialization — steel, shipbuilding, electronics — with heavy state support for a handful of large family-run conglomerates. This transformation is known as the <strong>"Miracle on the Han River" (한강의 기적, Han-gang-ui gijeok)</strong>.</p>
<h3>The chaebol (재벌)</h3>
<p>A <strong>chaebol (재벌, jaebeol — "wealth clan")</strong> is a large, family-controlled business conglomerate spanning many industries. The best-known: <strong>Samsung (삼성)</strong>, <strong>Hyundai (현대)</strong>, <strong>LG (엘지)</strong>, and <strong>SK</strong>. Chaebol drove Korea's export growth (semiconductors, cars, ships, phones) but their concentrated ownership and dominance are still debated as both Korea's greatest strength and a structural risk.</p>
<pre><code>1953   One of the world's poorest economies (GDP/capita ~$67)
1962   First Five-Year Plan begins (Park Chung-hee)
1970s  Heavy &amp; chemical industry drive; chaebol expand
1988   Seoul Summer Olympics — Korea's "coming out"
1996   OECD membership
1997   Asian Financial Crisis -&gt; IMF bailout (외환위기), restructuring
Today  ~10th-13th largest economy in the world; G20 member;
       leading exporter of semiconductors, autos, ships, K-content</code></pre>
<div class="callout"><span class="badge">Term</span> <strong>외환위기 (oehwan wigi — "foreign-exchange crisis")</strong> — Korea's name for the 1997 Asian Financial Crisis, remembered for the citizen-led "gold-collecting campaign" (금 모으기 운동) that donated household gold to help repay the IMF loan.</div>`,
    `<span class="eyebrow">KOS301 · Chương 4 · Bài 4.1</span>
<h2>Kinh tế &amp; "Kỳ tích sông Hàn"</h2>
<h3>Từ một trong những nước nghèo nhất đến thành viên OECD</h3>
<p>Sau Chiến tranh Triều Tiên, Hàn Quốc thuộc nhóm nước nghèo nhất thế giới. Dưới thời Tổng thống <strong>Park Chung-hee (박정희, 1961-1979)</strong>, chính phủ triển khai một loạt <strong>Kế hoạch phát triển kinh tế 5 năm</strong>, thúc đẩy công nghiệp hoá hướng xuất khẩu — thép, đóng tàu, điện tử — với sự hỗ trợ mạnh của nhà nước cho một số ít tập đoàn gia đình lớn. Sự chuyển mình này được gọi là <strong>"Kỳ tích sông Hàn" (한강의 기적, Han-gang-ui gijeok)</strong>.</p>
<h3>Chaebol (재벌)</h3>
<p>Một <strong>chaebol (재벌, jaebeol — "gia tộc của cải")</strong> là một tập đoàn kinh doanh lớn do một gia đình kiểm soát, trải rộng qua nhiều ngành. Nổi tiếng nhất: <strong>Samsung (삼성)</strong>, <strong>Hyundai (현대)</strong>, <strong>LG (엘지)</strong>, và <strong>SK</strong>. Chaebol dẫn dắt tăng trưởng xuất khẩu của Hàn Quốc (bán dẫn, ô tô, tàu, điện thoại) nhưng quyền sở hữu tập trung và sự thống trị của họ vẫn được tranh luận — vừa là thế mạnh lớn nhất, vừa là rủi ro cơ cấu của Hàn Quốc.</p>
<pre><code>1953   Một trong những nền kinh tế nghèo nhất thế giới (GDP/đầu người ~67 USD)
1962   Kế hoạch 5 năm đầu tiên bắt đầu (Park Chung-hee)
1970s  Đẩy mạnh công nghiệp nặng &amp; hoá chất; chaebol mở rộng
1988   Olympic mùa hè Seoul — Hàn Quốc "ra mắt" thế giới
1996   Gia nhập OECD
1997   Khủng hoảng tài chính châu Á -&gt; IMF cứu trợ (외환위기), tái cơ cấu
Nay    Nền kinh tế lớn thứ 10-13 thế giới; thành viên G20;
       xuất khẩu hàng đầu bán dẫn, ô tô, tàu biển, nội dung K-content</code></pre>
<div class="callout"><span class="badge">Thuật ngữ</span> <strong>외환위기 (oehwan wigi — "khủng hoảng ngoại hối")</strong> — tên gọi của Hàn Quốc cho Khủng hoảng tài chính châu Á 1997, được nhớ đến qua "phong trào góp vàng" (금 모으기 운동) khi người dân quyên vàng cá nhân để giúp trả nợ IMF.</div>`,
  ]]);

const c4q = quiz('kos301-quiz-4', 'Quiz 4 — Kinh tế Hàn Quốc|||Quiz 4 — Kinh tế Hàn Quốc', [
  { id: 'q1', question: '"Kỳ tích sông Hàn" (한강의 기적) chỉ điều gì?', options: ['Việc xây cầu qua sông Hàn', 'Sự công nghiệp hoá &amp; tăng trưởng kinh tế thần tốc từ thập niên 1960-1990', 'Khủng hoảng tài chính 1997', 'Làn sóng Hallyu'], correctIndex: 1, explanation: '"Kỳ tích sông Hàn" là tên gọi cho quá trình Hàn Quốc chuyển từ nước nghèo thành nền kinh tế công nghiệp hiện đại, bắt đầu dưới thời Park Chung-hee.' },
  { id: 'q2', question: 'Chaebol (재벌) là gì?', options: ['Cơ quan chính phủ quản lý xuất khẩu', 'Tập đoàn kinh doanh lớn do gia đình kiểm soát, đa ngành', 'Một loại thuế thu nhập', 'Tên gọi khác của Quốc hội'], correctIndex: 1, explanation: 'Chaebol là tập đoàn gia đình đa ngành như Samsung, Hyundai, LG, SK — trụ cột của nền kinh tế xuất khẩu Hàn Quốc.' },
  { id: 'q3', question: 'Sự kiện 1997 buộc Hàn Quốc phải nhận cứu trợ từ IMF được gọi là?', options: ['한강의 기적 (Kỳ tích sông Hàn)', '외환위기 (Khủng hoảng ngoại hối)', '저출산 (Tỷ lệ sinh thấp)', '한류 (Làn sóng Hallyu)'], correctIndex: 1, explanation: '외환위기 (oehwan wigi) là tên Hàn Quốc gọi Khủng hoảng tài chính châu Á 1997, dẫn tới gói cứu trợ và tái cơ cấu của IMF.' },
]);

const c5 = doc('kos301-5-1-society', '5.1 — Society, education & population|||5.1 — Xã hội, giáo dục & dân số',
  'Giáo dục Hàn Quốc: kỳ thi Suneung (수능), học thêm ở hagwon (학원); khủng hoảng tỷ suất sinh thấp nhất thế giới (저출산), già hoá dân số (고령화), nghĩa vụ quân sự bắt buộc.',
  [[
    `<span class="eyebrow">KOS301 · Chapter 5 · Lesson 5.1</span>
<h2>Society, education &amp; population</h2>
<h3>"Education fever" &amp; the Suneung</h3>
<p>Rooted in Confucian tradition, Korea's intense <strong>education fever (교육열, gyoyugyeol)</strong> centers on the <strong>CSAT / Suneung (수능)</strong> — the single, once-a-year national college entrance exam. It is such a major social event that flights are rescheduled and businesses open late during the listening test so noise doesn't disturb test-takers. Most students also attend private after-school academies called <strong>hagwon (학원)</strong>, often late into the evening.</p>
<h3>The lowest birth rate in the world</h3>
<p>Korea faces a demographic crisis: a <strong>total fertility rate around 0.7-0.8 children per woman</strong> (2023-2024), the lowest in the world — a phenomenon called <strong>jeochulsan (저출산, "low birth rate")</strong>. Combined with a rapidly <strong>aging society (고령화, goryeonghwa)</strong>, this threatens the future workforce, pension system, and even entire rural towns and schools.</p>
<h3>Military service</h3>
<p>Almost all able-bodied Korean men must complete <strong>mandatory military service (군복무, gunbokmu)</strong>, roughly 18-21 months depending on the branch — a shared national experience that shapes careers, K-pop idol schedules, and pop culture alike.</p>
<div class="callout"><span class="badge">Term</span> <strong>저출산 (jeochulsan)</strong> — Korea's ultra-low birth rate crisis, now a top-priority national policy issue with dedicated cabinet-level ministries and large subsidy programs.</div>`,
    `<span class="eyebrow">KOS301 · Chương 5 · Bài 5.1</span>
<h2>Xã hội, giáo dục &amp; dân số</h2>
<h3>"Cơn sốt giáo dục" &amp; kỳ thi Suneung</h3>
<p>Bắt nguồn từ truyền thống Nho giáo, <strong>cơn sốt giáo dục (교육열, gyoyugyeol)</strong> mãnh liệt của Hàn Quốc xoay quanh kỳ thi <strong>Suneung (수능)</strong> — kỳ thi tuyển sinh đại học quốc gia duy nhất, tổ chức một lần mỗi năm. Đây là sự kiện xã hội lớn đến mức các chuyến bay bị dời lịch và doanh nghiệp mở cửa trễ trong giờ thi nghe để tiếng ồn không ảnh hưởng thí sinh. Phần lớn học sinh còn học thêm tại các trung tâm tư nhân gọi là <strong>hagwon (학원)</strong>, thường đến tận tối muộn.</p>
<h3>Tỷ suất sinh thấp nhất thế giới</h3>
<p>Hàn Quốc đối mặt khủng hoảng nhân khẩu học: <strong>tổng tỷ suất sinh khoảng 0,7-0,8 con/phụ nữ</strong> (2023-2024), thấp nhất thế giới — hiện tượng gọi là <strong>저출산 (jeochulsan, "tỷ lệ sinh thấp")</strong>. Kết hợp với <strong>xã hội già hoá nhanh (고령화, goryeonghwa)</strong>, điều này đe doạ lực lượng lao động tương lai, hệ thống lương hưu, và thậm chí toàn bộ thị trấn nông thôn cùng các trường học.</p>
<h3>Nghĩa vụ quân sự</h3>
<p>Hầu hết nam giới Hàn Quốc đủ sức khoẻ phải hoàn thành <strong>nghĩa vụ quân sự bắt buộc (군복무, gunbokmu)</strong>, khoảng 18-21 tháng tuỳ quân chủng — một trải nghiệm chung của cả quốc gia, ảnh hưởng đến sự nghiệp, cả lịch trình của idol K-pop lẫn văn hoá đại chúng.</p>
<div class="callout"><span class="badge">Thuật ngữ</span> <strong>저출산 (jeochulsan)</strong> — khủng hoảng tỷ lệ sinh cực thấp của Hàn Quốc, nay là vấn đề chính sách ưu tiên hàng đầu quốc gia với các bộ cấp nội các riêng và chương trình trợ cấp lớn.</div>`,
  ]]);

const c5q = quiz('kos301-quiz-5', 'Quiz 5 — Xã hội Hàn Quốc|||Quiz 5 — Xã hội Hàn Quốc', [
  { id: 'q1', question: 'Suneung (수능) là gì?', options: ['Lễ hội mùa thu', 'Kỳ thi tuyển sinh đại học quốc gia, tổ chức một lần mỗi năm', 'Kỳ nghỉ lễ Tết', 'Kỳ thi tuyển công chức'], correctIndex: 1, explanation: 'Suneung là kỳ thi CSAT của Hàn Quốc — sự kiện xã hội lớn ảnh hưởng cả lịch bay và giờ mở cửa doanh nghiệp.' },
  { id: 'q2', question: 'Hiện tượng 저출산 (jeochulsan) mà Hàn Quốc đang đối mặt là gì?', options: ['Tỷ lệ ly hôn tăng', 'Tỷ suất sinh cực thấp, thấp nhất thế giới', 'Giá nhà giảm', 'Số lượng hagwon giảm'], correctIndex: 1, explanation: 'Jeochulsan (저출산) là khủng hoảng tỷ suất sinh cực thấp (khoảng 0,7-0,8 con/phụ nữ), thấp nhất thế giới.' },
  { id: 'q3', question: 'Đối tượng nào ở Hàn Quốc phải thực hiện nghĩa vụ quân sự bắt buộc?', options: ['Chỉ nữ giới', 'Hầu hết nam giới đủ sức khoẻ, khoảng 18-21 tháng', 'Chỉ công chức nhà nước', 'Không ai, quân đội hoàn toàn tự nguyện'], correctIndex: 1, explanation: 'Nam giới Hàn Quốc đủ sức khoẻ phải hoàn thành nghĩa vụ quân sự (군복무) bắt buộc khoảng 18-21 tháng.' },
]);

const c6 = doc('kos301-6-1-culture', '6.1 — Traditional culture & festivals|||6.1 — Văn hoá truyền thống & lễ tết',
  'Hanbok (한복), Tết Nguyên Đán Seollal (설날) & sebae, Tết Trung Thu Chuseok (추석) & songpyeon, nhà truyền thống hanok (한옥) & sưởi ondol, kimchi & kimjang.',
  [[
    `<span class="eyebrow">KOS301 · Chapter 6 · Lesson 6.1</span>
<h2>Traditional culture &amp; festivals</h2>
<h3>Hanbok (한복)</h3>
<p><strong>Hanbok (한복)</strong> is Korea's traditional dress — colorful, flowing, and still worn today for weddings, festivals, and important family events. Women's hanbok pairs a short jacket (<em>jeogori</em>) with a high-waisted skirt (<em>chima</em>); men's pairs a jacket with loose trousers (<em>baji</em>).</p>
<h3>The two biggest holidays</h3>
<ul>
<li><strong>Seollal (설날)</strong> — Lunar New Year. Families gather to perform ancestral rites (<em>charye, 차례</em>), children bow to elders (<em>sebae, 세배</em>) and receive New Year's money, and everyone eats rice-cake soup (<em>tteokguk, 떡국</em>).</li>
<li><strong>Chuseok (추석)</strong> — the mid-autumn harvest festival (8th day of the 8th lunar month). Families travel home, hold ancestral rites, and share half-moon rice cakes (<em>songpyeon, 송편</em>). Often called "Korean Thanksgiving."</li>
</ul>
<h3>The traditional home &amp; national dish</h3>
<p>A <strong>hanok (한옥)</strong> is a traditional Korean house, notable for its underfloor heating system called <strong>ondol (온돌)</strong>. <strong>Kimchi (김치)</strong> — fermented, seasoned vegetables (usually napa cabbage) — is Korea's signature side dish; the communal autumn tradition of making large batches together is called <strong>kimjang (김장)</strong>, recognized by UNESCO as Intangible Cultural Heritage.</p>
<div class="callout"><span class="badge">Term</span> <strong>차례 (charye)</strong> — the ancestral memorial rite performed at Seollal and Chuseok, reflecting the enduring influence of Confucian family values.</div>`,
    `<span class="eyebrow">KOS301 · Chương 6 · Bài 6.1</span>
<h2>Văn hoá truyền thống &amp; lễ tết</h2>
<h3>Hanbok (한복)</h3>
<p><strong>Hanbok (한복)</strong> là trang phục truyền thống của Hàn Quốc — nhiều màu sắc, thướt tha, và vẫn được mặc ngày nay trong đám cưới, lễ hội, và các dịp gia đình quan trọng. Hanbok nữ gồm áo khoác ngắn (<em>jeogori</em>) và váy cao lưng (<em>chima</em>); hanbok nam gồm áo khoác cùng quần rộng (<em>baji</em>).</p>
<h3>Hai lễ tết lớn nhất</h3>
<ul>
<li><strong>Seollal (설날)</strong> — Tết Nguyên Đán. Gia đình sum họp để cúng tổ tiên (<em>charye, 차례</em>), con cháu vái lạy người lớn tuổi (<em>sebae, 세배</em>) để nhận tiền lì xì, và mọi người ăn canh bánh gạo (<em>tteokguk, 떡국</em>).</li>
<li><strong>Chuseok (추석)</strong> — lễ hội thu hoạch giữa mùa thu (ngày 15 tháng 8 âm lịch). Các gia đình về quê, cúng tổ tiên, và chia nhau bánh gạo hình bán nguyệt (<em>songpyeon, 송편</em>). Thường được gọi là "Lễ Tạ ơn của Hàn Quốc".</li>
</ul>
<h3>Nhà truyền thống &amp; món ăn quốc hồn quốc tuý</h3>
<p>Một <strong>hanok (한옥)</strong> là ngôi nhà truyền thống Hàn Quốc, nổi bật với hệ thống sưởi sàn gọi là <strong>ondol (온돌)</strong>. <strong>Kimchi (김치)</strong> — rau lên men, ướp gia vị (thường là cải thảo) — là món ăn kèm đặc trưng của Hàn Quốc; truyền thống làm kimchi số lượng lớn cùng nhau vào mùa thu gọi là <strong>kimjang (김장)</strong>, được UNESCO công nhận là Di sản văn hoá phi vật thể.</p>
<div class="callout"><span class="badge">Thuật ngữ</span> <strong>차례 (charye)</strong> — nghi lễ tưởng nhớ tổ tiên thực hiện vào dịp Seollal và Chuseok, phản ánh ảnh hưởng lâu bền của giá trị gia đình Nho giáo.</div>`,
  ]]);

const c6q = quiz('kos301-quiz-6', 'Quiz 6 — Văn hoá & lễ tết|||Quiz 6 — Văn hoá & lễ tết', [
  { id: 'q1', question: 'Seollal (설날) là dịp lễ nào của Hàn Quốc?', options: ['Tết Trung Thu', 'Tết Nguyên Đán (âm lịch)', 'Ngày Hangeul', 'Lễ hội mùa hè'], correctIndex: 1, explanation: 'Seollal là Tết Nguyên Đán của Hàn Quốc, với nghi lễ charye, tục sebae và món tteokguk.' },
  { id: 'q2', question: 'Món bánh gạo hình bán nguyệt ăn vào dịp Chuseok (추석) gọi là?', options: ['Tteokguk (떡국)', 'Songpyeon (송편)', 'Kimchi (김치)', 'Hanbok (한복)'], correctIndex: 1, explanation: 'Songpyeon là bánh gạo hình bán nguyệt đặc trưng của Tết Trung Thu Chuseok.' },
  { id: 'q3', question: 'Hệ thống sưởi sàn truyền thống trong nhà hanok (한옥) gọi là?', options: ['Ondol (온돌)', 'Kimjang (김장)', 'Jeogori', 'Charye (차례)'], correctIndex: 0, explanation: 'Ondol (온돌) là hệ thống sưởi dưới sàn nhà, đặc trưng của kiến trúc nhà truyền thống Hàn Quốc.' },
]);

const c7 = doc('kos301-7-1-hallyu', '7.1 — Hallyu, K-pop & popular culture|||7.1 — Làn sóng Hallyu, K-pop & văn hoá đại chúng',
  'Hallyu (한류) từ phim truyền hình thập niên 1990 đến K-pop toàn cầu (BTS, BLACKPINK), K-drama & K-movie (Parasite/기생충 đoạt Oscar), K-beauty, webtoon, chính sách quảng bá "quyền lực mềm".',
  [[
    `<span class="eyebrow">KOS301 · Chapter 7 · Lesson 7.1</span>
<h2>Hallyu, K-pop &amp; popular culture</h2>
<h3>From regional dramas to a global wave</h3>
<p><strong>Hallyu (한류, "the Korean Wave")</strong> began in the late 1990s as Korean TV dramas gained popularity across China and Southeast Asia, then Japan (notably <em>Winter Sonata</em>, 겨울연가, in the early 2000s). Streaming platforms later turned it into a truly global phenomenon.</p>
<h3>K-pop</h3>
<p><strong>K-pop</strong> is produced through an intensive "idol" training-and-management system run by entertainment agencies (e.g. SM, YG, JYP, HYBE). Groups like <strong>BTS (방탄소년단)</strong> and <strong>BLACKPINK (블랙핑크)</strong> now top global charts and sell out stadiums worldwide, combining polished choreography, multilingual releases, and direct fan engagement on social media.</p>
<h3>K-drama, K-movie &amp; beyond</h3>
<p>Global streaming (especially Netflix) carried Korean drama and film worldwide — <strong>Squid Game (오징어 게임)</strong> became one of the most-watched series ever, and <strong>Parasite (기생충, Gisaengchung)</strong> won the 2020 Academy Award for Best Picture, the first non-English-language film to do so. The wave also includes K-beauty, Korean webtoons (웹툰), and a global boom in people learning Korean.</p>
<h3>Soft power by design</h3>
<p>The South Korean government actively promotes Hallyu as both a cultural-diplomacy tool and an export industry, through agencies under the Ministry of Culture, Sports and Tourism.</p>
<div class="callout"><span class="badge">Term</span> <strong>한류 (Hallyu — "the Korean Wave")</strong> — the umbrella term for the global spread of Korean pop culture, from dramas and K-pop to food, beauty, and language.</div>`,
    `<span class="eyebrow">KOS301 · Chương 7 · Bài 7.1</span>
<h2>Làn sóng Hallyu, K-pop &amp; văn hoá đại chúng</h2>
<h3>Từ phim truyền hình khu vực đến làn sóng toàn cầu</h3>
<p><strong>Hallyu (한류, "Làn sóng Hàn")</strong> bắt đầu cuối thập niên 1990 khi phim truyền hình Hàn Quốc trở nên phổ biến ở Trung Quốc và Đông Nam Á, rồi Nhật Bản (nổi bật là <em>Bản Tình Ca Mùa Đông</em>, 겨울연가, đầu những năm 2000). Các nền tảng streaming sau đó biến nó thành một hiện tượng toàn cầu thực sự.</p>
<h3>K-pop</h3>
<p><strong>K-pop</strong> được sản xuất qua một hệ thống đào tạo-quản lý "idol" chuyên sâu do các công ty giải trí điều hành (như SM, YG, JYP, HYBE). Các nhóm nhạc như <strong>BTS (방탄소년단)</strong> và <strong>BLACKPINK (블랙핑크)</strong> nay đứng đầu các bảng xếp hạng toàn cầu và bán hết vé sân vận động khắp thế giới, kết hợp vũ đạo chỉn chu, phát hành đa ngôn ngữ, và tương tác trực tiếp với người hâm mộ trên mạng xã hội.</p>
<h3>K-drama, K-movie &amp; hơn thế</h3>
<p>Streaming toàn cầu (đặc biệt Netflix) đưa phim truyền hình và điện ảnh Hàn Quốc ra khắp thế giới — <strong>Squid Game (오징어 게임)</strong> trở thành một trong những series được xem nhiều nhất mọi thời, và <strong>Parasite (기생충, Gisaengchung)</strong> đoạt giải Oscar Phim hay nhất năm 2020, bộ phim không nói tiếng Anh đầu tiên làm được điều đó. Làn sóng này còn bao gồm K-beauty, webtoon Hàn Quốc (웹툰), và sự bùng nổ toàn cầu của việc học tiếng Hàn.</p>
<h3>Quyền lực mềm có chủ đích</h3>
<p>Chính phủ Hàn Quốc chủ động quảng bá Hallyu vừa như công cụ ngoại giao văn hoá, vừa như một ngành công nghiệp xuất khẩu, thông qua các cơ quan trực thuộc Bộ Văn hoá, Thể thao và Du lịch.</p>
<div class="callout"><span class="badge">Thuật ngữ</span> <strong>한류 (Hallyu — "Làn sóng Hàn")</strong> — thuật ngữ bao trùm cho sự lan toả toàn cầu của văn hoá đại chúng Hàn Quốc, từ phim ảnh và K-pop đến ẩm thực, làm đẹp, và ngôn ngữ.</div>`,
  ]]);

const c7q = quiz('kos301-quiz-7', 'Quiz 7 — Hallyu & K-pop|||Quiz 7 — Hallyu & K-pop', [
  { id: 'q1', question: 'Hallyu (한류) nghĩa là gì?', options: ['Nghĩa vụ quân sự', 'Làn sóng Hàn — sự lan toả toàn cầu của văn hoá đại chúng Hàn Quốc', 'Kỳ thi đại học', 'Tên một tập đoàn chaebol'], correctIndex: 1, explanation: 'Hallyu ("Làn sóng Hàn") là thuật ngữ cho sự lan toả toàn cầu của K-drama, K-pop, K-beauty và văn hoá Hàn Quốc nói chung.' },
  { id: 'q2', question: 'Bộ phim nào của Hàn Quốc đoạt giải Oscar Phim hay nhất năm 2020, là phim không nói tiếng Anh đầu tiên làm được điều đó?', options: ['Squid Game (오징어 게임)', 'Parasite (기생충)', 'Winter Sonata (겨울연가)', 'Train to Busan'], correctIndex: 1, explanation: 'Parasite (기생충, Gisaengchung) đoạt Oscar Phim hay nhất 2020 — cột mốc lịch sử của điện ảnh Hàn Quốc.' },
  { id: 'q3', question: 'K-pop được sản xuất chủ yếu qua hệ thống nào?', options: ['Tự do, không qua công ty quản lý', 'Đào tạo-quản lý "idol" bởi các công ty giải trí (SM, YG, JYP, HYBE...)', 'Do chính phủ trực tiếp tuyển chọn', 'Chỉ qua các cuộc thi truyền hình thực tế'], correctIndex: 1, explanation: 'Các công ty giải trí (SM, YG, JYP, HYBE...) vận hành hệ thống đào tạo và quản lý idol chuyên sâu, nền tảng của ngành K-pop.' },
]);

const c8 = doc('kos301-8-1-international', '8.1 — International relations, Korea-Vietnam & contemporary Korea|||8.1 — Quan hệ quốc tế, Hàn-Việt & Hàn Quốc đương đại',
  'Quan hệ Hàn-Việt (thiết lập 1992, đối tác chiến lược toàn diện 2022), đầu tư Hàn Quốc tại Việt Nam, liên minh Hàn-Mỹ (한미동맹), quan hệ liên Triều (남북관계).',
  [[
    `<span class="eyebrow">KOS301 · Chapter 8 · Lesson 8.1</span>
<h2>International relations, Korea-Vietnam &amp; contemporary Korea</h2>
<h3>Korea-Vietnam relations</h3>
<p>South Korea and Vietnam established diplomatic relations on <strong>22 December 1992</strong>. Ties deepened steadily, reaching a <strong>Comprehensive Strategic Partnership in December 2022</strong> — Korea's highest tier of diplomatic relationship. Korea is one of Vietnam's largest foreign investors (Samsung's major factories in Bac Ninh and Thai Nguyen are a well-known example), a top trading partner, and a major source of tourism, while a large Korean expatriate community lives in Vietnam and many Vietnamese live, study, or work in Korea. K-pop and K-drama are also hugely popular among Vietnamese audiences.</p>
<h3>Alliance with the United States</h3>
<p>The <strong>Korea-US alliance (한미동맹, Han-Mi dongmaeng)</strong> dates to the Mutual Defense Treaty signed after the Korean War (1953) and remains a cornerstone of Korea's security policy, including the continued presence of US Forces Korea (USFK).</p>
<h3>Inter-Korean relations</h3>
<p><strong>남북관계 (Nambuk gwangye — "North-South relations")</strong> has cycled between tension and dialogue — including landmark inter-Korean summits (2000, 2007, and 2018 at Panmunjom) — but formal reunification remains a distant, unresolved goal, and the two Koreas remain technically at war since no peace treaty ever replaced the 1953 armistice.</p>
<div class="callout"><span class="badge">Term</span> <strong>포괄적 전략 동반자 관계 (comprehensive strategic partnership)</strong> — the top tier of Korea's diplomatic relationships, which Vietnam reached with Korea in 2022, alongside countries such as the US, China, and Russia.</div>`,
    `<span class="eyebrow">KOS301 · Chương 8 · Bài 8.1</span>
<h2>Quan hệ quốc tế, Hàn-Việt &amp; Hàn Quốc đương đại</h2>
<h3>Quan hệ Hàn-Việt</h3>
<p>Hàn Quốc và Việt Nam thiết lập quan hệ ngoại giao ngày <strong>22 tháng 12 năm 1992</strong>. Quan hệ ngày càng sâu sắc, đạt mức <strong>Đối tác Chiến lược Toàn diện vào tháng 12 năm 2022</strong> — cấp độ quan hệ ngoại giao cao nhất của Hàn Quốc. Hàn Quốc là một trong những nhà đầu tư nước ngoài lớn nhất tại Việt Nam (các nhà máy lớn của Samsung ở Bắc Ninh và Thái Nguyên là ví dụ tiêu biểu), đối tác thương mại hàng đầu, và nguồn khách du lịch lớn, trong khi một cộng đồng người Hàn đông đảo sinh sống tại Việt Nam và nhiều người Việt sinh sống, học tập, làm việc tại Hàn Quốc. K-pop và K-drama cũng cực kỳ được yêu thích trong khán giả Việt Nam.</p>
<h3>Liên minh với Hoa Kỳ</h3>
<p><strong>Liên minh Hàn-Mỹ (한미동맹, Han-Mi dongmaeng)</strong> bắt nguồn từ Hiệp ước Phòng thủ chung ký sau Chiến tranh Triều Tiên (1953) và vẫn là trụ cột trong chính sách an ninh của Hàn Quốc, bao gồm cả sự hiện diện liên tục của Lực lượng Mỹ tại Hàn Quốc (USFK).</p>
<h3>Quan hệ liên Triều</h3>
<p><strong>남북관계 (Nambuk gwangye — "quan hệ Nam-Bắc")</strong> luân phiên giữa căng thẳng và đối thoại — bao gồm các hội nghị thượng đỉnh liên Triều mang tính bước ngoặt (2000, 2007, và 2018 tại Bàn Môn Điếm) — nhưng thống nhất chính thức vẫn là mục tiêu xa vời, chưa đạt được, và hai miền về mặt kỹ thuật vẫn trong tình trạng chiến tranh vì chưa từng có hiệp ước hoà bình thay thế cho hiệp định đình chiến 1953.</p>
<div class="callout"><span class="badge">Thuật ngữ</span> <strong>포괄적 전략 동반자 관계 (đối tác chiến lược toàn diện)</strong> — cấp độ quan hệ ngoại giao cao nhất của Hàn Quốc, mà Việt Nam đạt được với Hàn Quốc năm 2022, cùng với các nước như Mỹ, Trung Quốc, Nga.</div>`,
  ]]);

const c8q = quiz('kos301-quiz-8', 'Quiz 8 — Quan hệ quốc tế & Hàn-Việt|||Quiz 8 — Quan hệ quốc tế & Hàn-Việt', [
  { id: 'q1', question: 'Hàn Quốc và Việt Nam thiết lập quan hệ ngoại giao vào năm nào, và đạt mức đối tác cao nhất vào năm nào?', options: ['1992 và 2022 (Đối tác Chiến lược Toàn diện)', '1975 và 2000', '1953 và 1987', '2000 và 2010'], correctIndex: 0, explanation: 'Quan hệ ngoại giao thiết lập năm 1992, nâng lên Đối tác Chiến lược Toàn diện — cấp cao nhất — vào tháng 12/2022.' },
  { id: 'q2', question: 'Liên minh Hàn-Mỹ (한미동맹) bắt nguồn từ đâu?', options: ['Hiệp ước Phòng thủ chung sau Chiến tranh Triều Tiên (1953)', 'Hiệp định thương mại tự do 2007', 'Thế vận hội Seoul 1988', 'Khủng hoảng tài chính 1997'], correctIndex: 0, explanation: 'Liên minh Hàn-Mỹ bắt nguồn từ Hiệp ước Phòng thủ chung ký sau Chiến tranh Triều Tiên năm 1953, vẫn là trụ cột an ninh của Hàn Quốc.' },
  { id: 'q3', question: 'Vì sao có thể nói hai miền Triều Tiên "về mặt kỹ thuật vẫn trong tình trạng chiến tranh"?', options: ['Vì chưa từng có hiệp ước hoà bình thay thế hiệp định đình chiến 1953', 'Vì DMZ đã bị dỡ bỏ', 'Vì Liên Hợp Quốc chưa công nhận cả hai nước', 'Vì hai bên chưa từng đối thoại'], correctIndex: 0, explanation: 'Hiệp định đình chiến 1953 chỉ tạm ngừng chiến sự, chưa từng được thay bằng một hiệp ước hoà bình chính thức.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'KOS301',
    slug: 'kos301-at-nuoc-hoc-han-quoc',
    title: 'Đất nước học Hàn Quốc',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KOS301.webp',
    shortDescription: 'Korea: geography &amp; climate, history (Gojoseon to modern), politics, the chaebol economy, society &amp; low birth rate, traditions (hanbok, Seollal, Chuseok), Hallyu/K-pop, and Korea-Vietnam relations.|||Hàn Quốc: địa lý &amp; khí hậu, lịch sử (Cổ Triều Tiên đến hiện đại), chính trị, kinh tế chaebol, xã hội &amp; tỷ suất sinh thấp, truyền thống (hanbok, Seollal, Chuseok), Hallyu/K-pop, và quan hệ Hàn-Việt.',
    description: 'Môn <strong>KOS301 — Korean Country Studies / Đất nước học Hàn Quốc</strong> (ngành Ngôn ngữ Hàn, kỳ 3) trang bị nền tảng văn hoá-xã hội-lịch sử để hiểu Hàn Quốc và học tiếng Hàn hiệu quả hơn. 8 chương đi từ <strong>địa lý &amp; hành chính</strong> → <strong>lịch sử</strong> (Cổ Triều Tiên đến hiện đại) → <strong>chính trị</strong> → <strong>kinh tế</strong> (Kỳ tích sông Hàn, chaebol) → <strong>xã hội &amp; giáo dục</strong> → <strong>văn hoá truyền thống &amp; lễ tết</strong> → <strong>làn sóng Hallyu/K-pop</strong> → <strong>quan hệ quốc tế &amp; Hàn-Việt</strong>. Song ngữ Việt-Anh, mỗi thuật ngữ quan trọng kèm Hangeul (한글) + romaja, có quiz mỗi chương.',
    whatYouLearn: 'Địa lý &amp; 17 đơn vị hành chính Hàn Quốc; dòng lịch sử Gojoseon → Tam Quốc → Goryeo → Joseon (Hangeul) → Nhật thuộc → chia cắt &amp; Chiến tranh Triều Tiên; thể chế tổng thống chế &amp; phong trào dân chủ hoá; Kỳ tích sông Hàn &amp; chaebol (Samsung, Hyundai, LG, SK); giáo dục (Suneung, hagwon) &amp; khủng hoảng tỷ suất sinh thấp; văn hoá truyền thống (hanbok, Seollal, Chuseok, hanok, kimchi); làn sóng Hallyu &amp; K-pop; quan hệ Hàn-Việt và các mối quan hệ quốc tế then chốt.',
    requirements: 'Không yêu cầu biết tiếng Hàn trước; phù hợp cho sinh viên năm nhất ngành Ngôn ngữ Hàn. Nên tra thêm trên FLM (flm.fpt.edu.vn) để đối chiếu đề cương chi tiết của trường.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Trích dẫn giáo trình 한국의 이해, Korea: A Religious History; nguồn chính thức KOCIS/Korea.net/Korea Tourism.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: '8 chương, cách đọc thuật ngữ Hàn (Hangeul + romaja).', lessons: [intro] },
    { title: 'Chương 1 — Địa lý, lãnh thổ & khí hậu|||Chapter 1 — Geography & climate', description: 'Bán đảo, DMZ, 17 đơn vị hành chính, núi Halla/Baekdu, khí hậu.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Lịch sử Hàn Quốc|||Chapter 2 — History of Korea', description: 'Gojoseon, Tam Quốc, Goryeo, Joseon & Hangeul, Nhật thuộc, chia cắt.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chính trị & thể chế|||Chapter 3 — Politics & institutions', description: 'Tổng thống chế, Quốc hội, Toà án Hiến pháp, phong trào dân chủ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Kinh tế & kỳ tích sông Hàn|||Chapter 4 — Economy & Han River miracle', description: 'Kế hoạch 5 năm, chaebol, khủng hoảng 1997.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Xã hội, giáo dục & dân số|||Chapter 5 — Society, education & population', description: 'Suneung, hagwon, tỷ suất sinh thấp, nghĩa vụ quân sự.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Văn hoá truyền thống & lễ tết|||Chapter 6 — Traditional culture & festivals', description: 'Hanbok, Seollal, Chuseok, hanok, kimchi.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hallyu, K-pop & văn hoá đại chúng|||Chapter 7 — Hallyu, K-pop & pop culture', description: 'K-drama, K-pop, Parasite, quyền lực mềm.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quan hệ quốc tế & Hàn-Việt|||Chapter 8 — International relations & Korea-Vietnam', description: 'Quan hệ Hàn-Việt, liên minh Hàn-Mỹ, quan hệ liên Triều.', lessons: [c8, c8q] },
  ],
};
