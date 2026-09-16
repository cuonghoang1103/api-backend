/**
 * KEG301 — Economic Geography of Korea / Địa lý kinh tế Hàn Quốc.
 * Ngành Ngôn ngữ Hàn, FPTU, Kỳ 4. Giáo trình tham khảo (trích dẫn, không upload
 * PDF): "한국경제지리 (Economic Geography of Korea)"; "The Korean Economy"
 * (SaKong & Koh); số liệu tham chiếu KOSIS (kosis.kr) & 한국은행/Bank of Korea
 * (bok.or.kr). Song ngữ Việt-Anh + thuật ngữ Hàn (한글 + romaja + nghĩa Việt).
 * Số liệu là số tham khảo/ước tính phổ biến, không phải số liệu chính thức
 * theo năm cụ thể — nêu rõ bằng "khoảng"/"ước tính".
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('keg301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo, số liệu chính thức KOSIS/Ngân hàng Hàn Quốc, công cụ tra cứu bản đồ kinh tế.',
  [[
    `<span class="eyebrow">KEG301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Tài liệu tham khảo cho môn <strong>Economic Geography of Korea</strong> — vùng kinh tế, công nghiệp, nông-lâm-ngư, giao thông và thương mại quốc tế của Hàn Quốc. Slide &amp; giáo trình chính thức FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn tham khảo &amp; số liệu chính thức miễn phí.</p>
<h3>📘 Textbooks (tham khảo, không đính kèm PDF)</h3>
<ul>
<li><em>한국경제지리 (Economic Geography of Korea)</em> — giáo trình tiếng Hàn về vùng kinh tế, tài nguyên, công nghiệp và đô thị hoá của Hàn Quốc.</li>
<li><em>The Korean Economy: Six Decades of Growth and Development</em> — Il SaKong &amp; Youngsun Koh (KDI) — lịch sử phát triển kinh tế Hàn Quốc theo giai đoạn và vùng.</li>
</ul>
<h3>🌐 Official statistics (free)</h3>
<ul>
<li><a href="https://kosis.kr" target="_blank" rel="noopener">KOSIS — Korean Statistical Information Service</a> — dân số, GRDP theo vùng, công nghiệp, nông-lâm-ngư nghiệp.</li>
<li><a href="https://www.bok.or.kr" target="_blank" rel="noopener">Bank of Korea (한국은행)</a> — số liệu kinh tế vĩ mô, thương mại, cán cân thanh toán.</li>
<li><a href="https://english.motie.go.kr" target="_blank" rel="noopener">Ministry of Trade, Industry and Energy (MOTIE)</a> — chính sách công nghiệp &amp; năng lượng.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://kosis.kr/eng/" target="_blank" rel="noopener">KOSIS (English)</a> — bản đồ &amp; bảng số liệu vùng có thể lọc theo tỉnh/thành.</li>
</ul>
<div class="callout"><span class="badge">Cách học</span> Học theo VÙNG (수도권/영남/호남) chứ không học rời rạc theo chủ đề — mỗi chương gắn một vùng hoặc một ngành với địa danh và thuật ngữ Hàn cụ thể để dễ nhớ khi thi và khi dùng thực tế (hướng dẫn viên, biên phiên dịch, xuất nhập khẩu).</div>`,
    `<span class="eyebrow">KEG301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Tài liệu tham khảo cho môn <strong>Địa lý kinh tế Hàn Quốc</strong> — vùng kinh tế, công nghiệp, nông-lâm-ngư và thương mại quốc tế của Hàn Quốc. Slide &amp; giáo trình chính thức FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn tham khảo &amp; số liệu chính thức miễn phí.</p>
<h3>📘 Giáo trình tham khảo (không đính kèm PDF)</h3>
<ul>
<li><em>한국경제지리 (Economic Geography of Korea)</em> — giáo trình tiếng Hàn về vùng kinh tế, tài nguyên, công nghiệp và đô thị hoá của Hàn Quốc.</li>
<li><em>The Korean Economy: Six Decades of Growth and Development</em> — Il SaKong &amp; Youngsun Koh (KDI) — lịch sử phát triển kinh tế Hàn Quốc theo giai đoạn và vùng.</li>
</ul>
<h3>🌐 Số liệu chính thức (miễn phí)</h3>
<ul>
<li><a href="https://kosis.kr" target="_blank" rel="noopener">KOSIS — Cổng thông tin thống kê Hàn Quốc</a> — dân số, GRDP theo vùng, công nghiệp, nông-lâm-ngư nghiệp.</li>
<li><a href="https://www.bok.or.kr" target="_blank" rel="noopener">Ngân hàng Hàn Quốc (한국은행)</a> — số liệu kinh tế vĩ mô, thương mại, cán cân thanh toán.</li>
<li><a href="https://english.motie.go.kr" target="_blank" rel="noopener">Bộ Thương mại, Công nghiệp và Năng lượng (MOTIE)</a> — chính sách công nghiệp &amp; năng lượng.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://kosis.kr/eng/" target="_blank" rel="noopener">KOSIS (tiếng Anh)</a> — bản đồ &amp; bảng số liệu vùng có thể lọc theo tỉnh/thành.</li>
</ul>
<div class="callout"><span class="badge">Cách học</span> Học theo VÙNG (수도권/영남/호남) chứ không học rời rạc theo chủ đề — mỗi chương gắn một vùng hoặc một ngành với địa danh và thuật ngữ Hàn cụ thể để dễ nhớ khi thi và khi dùng thực tế (hướng dẫn viên, biên phiên dịch, xuất nhập khẩu).</div>`,
  ]]);

const c1 = doc('keg301-1-1-vung-kinh-te', '1.1 — Overview: Korea\'s geography & economic regions|||1.1 — Tổng quan địa lý & vùng kinh tế Hàn Quốc',
  'Vị trí địa lý bán đảo, địa hình đồi núi; ba vùng kinh tế lớn: 수도권 (Sudogwon), 영남 (Yeongnam), 호남 (Honam).',
  [[
    `<span class="eyebrow">KEG301 · Chapter 1 · Lesson 1.1</span>
<h2>Overview: Korea's geography &amp; economic regions</h2>
<h3>Physical geography snapshot</h3>
<ul>
<li>South Korea occupies the southern half of the <strong>Korean Peninsula</strong>, area roughly <strong>100,000 km²</strong> — about a third the size of Vietnam.</li>
<li><strong>~70% mountainous terrain</strong> (tallest ranges in the east/northeast); plains concentrate along the west and south coasts, where most rice farming and dense population sit.</li>
<li>Bordered by the <strong>Yellow Sea</strong> (west), the <strong>East Sea / Sea of Japan</strong> (east), and the <strong>Korea Strait</strong> (south, facing Japan).</li>
</ul>
<h3>Three traditional macro-regions</h3>
<ul>
<li><strong>수도권 (Sudogwon, "Capital Region")</strong> — Seoul + Incheon + Gyeonggi-do. Holds roughly <strong>half of the national population and GDP</strong> on a small share of the land — the single most important fact about Korea's economic geography.</li>
<li><strong>영남 (Yeongnam, "the region south-east of the Yeong mountain pass")</strong> — Busan, Daegu, Ulsan and the Gyeongsang provinces. Korea's historic heavy-industry and port belt.</li>
<li><strong>호남 (Honam, "the region south-west of the lake/gate")</strong> — Gwangju and the Jeolla provinces. Traditionally Korea's rice basket, now also home to newer industrial complexes (Yeosu, Gwangyang).</li>
</ul>
<pre><code>Rough regional shares of population (illustrative, KOSIS-style breakdown):
 Sudogwon (수도권: Seoul/Incheon/Gyeonggi) ~50%
 Yeongnam (영남: Busan/Daegu/Ulsan/Gyeongsang) ~25%
 Honam    (호남: Gwangju/Jeolla)              ~10%
 Other (Chungcheong, Gangwon, Jeju)          ~15%
</code></pre>
<div class="callout"><span class="badge">Why this matters</span> Almost every topic in this course — industry clusters, ports, migration, regional policy — is easier to place once you can locate it inside one of these three regions on a map.</div>`,
    `<span class="eyebrow">KEG301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan địa lý &amp; vùng kinh tế Hàn Quốc</h2>
<h3>Địa lý tự nhiên</h3>
<ul>
<li>Hàn Quốc chiếm nửa phía nam <strong>bán đảo Triều Tiên</strong>, diện tích khoảng <strong>100.000 km²</strong> — bằng khoảng một phần ba Việt Nam.</li>
<li><strong>Khoảng 70% diện tích là đồi núi</strong> (dãy núi cao nhất ở phía đông/đông bắc); đồng bằng tập trung ở bờ tây và bờ nam — nơi tập trung nông nghiệp lúa nước và dân cư đông đúc.</li>
<li>Giáp <strong>Hoàng Hải (Yellow Sea)</strong> ở phía tây, <strong>biển Đông Hàn Quốc (East Sea/Sea of Japan)</strong> ở phía đông, và <strong>eo biển Triều Tiên (Korea Strait)</strong> ở phía nam (đối diện Nhật Bản).</li>
</ul>
<h3>Ba vùng kinh tế lớn theo truyền thống</h3>
<ul>
<li><strong>수도권 (Sudogwon, "Vùng Thủ đô")</strong> — Seoul + Incheon + tỉnh Gyeonggi. Chiếm khoảng <strong>một nửa dân số và GDP cả nước</strong> trên một diện tích nhỏ — dữ kiện quan trọng nhất về địa lý kinh tế Hàn Quốc.</li>
<li><strong>영남 (Yeongnam, "vùng phía đông-nam đèo Yeong")</strong> — Busan, Daegu, Ulsan và các tỉnh Gyeongsang. Vành đai công nghiệp nặng và cảng biển lâu đời của Hàn Quốc.</li>
<li><strong>호남 (Honam, "vùng phía tây-nam hồ/cửa")</strong> — Gwangju và các tỉnh Jeolla. Vựa lúa truyền thống của Hàn Quốc, nay có thêm các khu công nghiệp mới (Yeosu, Gwangyang).</li>
</ul>
<pre><code>Tỉ trọng dân số theo vùng (minh hoạ, kiểu phân nhóm của KOSIS):
 Sudogwon (수도권: Seoul/Incheon/Gyeonggi) ~50%
 Yeongnam (영남: Busan/Daegu/Ulsan/Gyeongsang) ~25%
 Honam    (호남: Gwangju/Jeolla)              ~10%
 Vùng khác (Chungcheong, Gangwon, Jeju)      ~15%
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Gần như mọi chủ đề trong môn này — cụm công nghiệp, cảng biển, di dân, chính sách vùng — đều dễ hiểu hơn khi bạn định vị được nó trong một trong ba vùng này trên bản đồ.</div>`,
  ]]);

const c1q = quiz('keg301-quiz-1', 'Quiz 1 — Regions|||Quiz 1 — Vùng kinh tế', [
  { id: 'q1', question: '수도권 (Sudogwon) gồm những khu vực nào?', options: ['Busan, Daegu, Ulsan', 'Seoul, Incheon, Gyeonggi-do', 'Gwangju, Jeolla', 'Jeju, Gangwon'], correctIndex: 1, explanation: 'Sudogwon = "Vùng Thủ đô" gồm Seoul, Incheon và tỉnh Gyeonggi.' },
  { id: 'q2', question: 'Khoảng bao nhiêu phần trăm diện tích Hàn Quốc là đồi núi?', options: ['Khoảng 30%', 'Khoảng 50%', 'Khoảng 70%', 'Khoảng 90%'], correctIndex: 2, explanation: 'Địa hình Hàn Quốc khoảng 70% là đồi núi, đồng bằng tập trung ở bờ tây/nam.' },
  { id: 'q3', question: '영남 (Yeongnam) là vùng gắn với đặc điểm kinh tế nào?', options: ['Vựa lúa truyền thống', 'Vành đai công nghiệp nặng & cảng biển lâu đời', 'Trung tâm hành chính quốc gia', 'Vùng núi cao chưa phát triển'], correctIndex: 1, explanation: 'Yeongnam (Busan, Daegu, Ulsan, Gyeongsang) là vùng công nghiệp nặng và cảng biển lâu đời.' },
]);

const c2 = doc('keg301-2-1-tai-nguyen-nang-luong', '2.1 — Natural resources, energy & natural conditions|||2.1 — Tài nguyên, năng lượng & điều kiện tự nhiên',
  'Nghèo khoáng sản, phụ thuộc nhập khẩu năng lượng; cơ cấu điện (nhiệt điện, hạt nhân, tái tạo); khí hậu bốn mùa và mùa mưa 장마.',
  [[
    `<span class="eyebrow">KEG301 · Chapter 2 · Lesson 2.1</span>
<h2>Natural resources, energy &amp; natural conditions</h2>
<h3>A resource-poor country by land area</h3>
<p>Korea has very limited domestic mineral and fossil-fuel reserves relative to its industrial size — small deposits of low-grade coal and some limestone (used for cement), but essentially no oil or gas of its own. This is the geographic root of one of Korea's defining economic facts: it must <strong>import almost all of its energy</strong> (commonly cited as well over 90% of primary energy supply).</p>
<h3>Electricity mix (illustrative structure)</h3>
<pre><code>Korea's power generation mix (typical structure, illustrative):
 Coal &amp; LNG thermal   ~55-60%
 Nuclear (원자력, wonjaryeok) ~25-30%
 Renewables &amp; other   ~10-15% (growing)
</code></pre>
<h3>Climate &amp; terrain shape where people can farm and build</h3>
<ul>
<li>Four distinct seasons; a hot, humid summer with a concentrated rainy season called <strong>장마 (jangma, "monsoon/rainy season")</strong> — a large share of annual rainfall falls in a few summer weeks, driving flood-control and reservoir planning.</li>
<li>Mountainous terrain pushes farmland, industry and cities onto the narrow western/southern coastal plains — the same plains that host Sudogwon and the Honam rice belt.</li>
</ul>
<div class="callout"><span class="badge">Key term</span> <strong>에너지 (eneoji, "energy")</strong> and <strong>자원 (jawon, "resources")</strong> — two words you'll meet constantly in Korean economic-geography texts and news.</div>`,
    `<span class="eyebrow">KEG301 · Chương 2 · Bài 2.1</span>
<h2>Tài nguyên, năng lượng &amp; điều kiện tự nhiên</h2>
<h3>Một nước nghèo tài nguyên xét theo diện tích</h3>
<p>Hàn Quốc có trữ lượng khoáng sản và nhiên liệu hoá thạch trong nước rất hạn chế so với quy mô công nghiệp — chỉ có một ít than chất lượng thấp và đá vôi (dùng làm xi măng), gần như không có dầu hay khí đốt của riêng mình. Đây là gốc rễ địa lý của một sự thật kinh tế then chốt: Hàn Quốc phải <strong>nhập khẩu gần như toàn bộ năng lượng</strong> (thường được dẫn là hơn 90% nguồn cung năng lượng sơ cấp).</p>
<h3>Cơ cấu phát điện (mang tính minh hoạ)</h3>
<pre><code>Cơ cấu phát điện Hàn Quốc (cấu trúc điển hình, minh hoạ):
 Nhiệt điện than &amp; khí LNG   ~55-60%
 Điện hạt nhân (원자력, wonjaryeok) ~25-30%
 Tái tạo &amp; khác             ~10-15% (đang tăng)
</code></pre>
<h3>Khí hậu &amp; địa hình quyết định nơi có thể canh tác, xây dựng</h3>
<ul>
<li>Bốn mùa rõ rệt; mùa hè nóng ẩm với mùa mưa tập trung gọi là <strong>장마 (jangma, "mùa mưa")</strong> — phần lớn lượng mưa cả năm rơi trong vài tuần hè, chi phối việc quy hoạch chống lũ và hồ chứa.</li>
<li>Địa hình núi đẩy đất nông nghiệp, công nghiệp và đô thị dồn về các đồng bằng ven biển tây/nam hẹp — cũng chính là nơi có Sudogwon và vựa lúa Honam.</li>
</ul>
<div class="callout"><span class="badge">Thuật ngữ chính</span> <strong>에너지 (eneoji, "năng lượng")</strong> và <strong>자원 (jawon, "tài nguyên")</strong> — hai từ bạn sẽ gặp liên tục trong tài liệu địa lý kinh tế và tin tức tiếng Hàn.</div>`,
  ]]);

const c2q = quiz('keg301-quiz-2', 'Quiz 2 — Resources & energy|||Quiz 2 — Tài nguyên & năng lượng', [
  { id: 'q1', question: 'Hàn Quốc phụ thuộc nhập khẩu năng lượng ở mức nào?', options: ['Khoảng 20%', 'Khoảng 50%', 'Hơn 90%', 'Gần như 0%'], correctIndex: 2, explanation: 'Hàn Quốc nghèo khoáng sản/nhiên liệu hoá thạch, phải nhập khẩu hơn 90% năng lượng sơ cấp.' },
  { id: 'q2', question: '장마 (jangma) nghĩa là gì?', options: ['Mùa đông lạnh', 'Mùa mưa tập trung mùa hè', 'Bão cát', 'Mùa gặt lúa'], correctIndex: 1, explanation: 'Jangma là mùa mưa tập trung vào mùa hè, chiếm phần lớn lượng mưa cả năm.' },
  { id: 'q3', question: 'Trong cơ cấu điện Hàn Quốc, nguồn nào chiếm tỉ trọng lớn nhất (nhiệt điện gộp)?', options: ['Điện hạt nhân', 'Nhiệt điện than & khí LNG', 'Thuỷ điện', 'Điện gió ngoài khơi'], correctIndex: 1, explanation: 'Nhiệt điện than & LNG vẫn chiếm tỉ trọng lớn nhất, kế đến là điện hạt nhân, rồi tái tạo.' },
]);

const c3 = doc('keg301-3-1-cong-nghiep-khu-cong-nghiep', '3.1 — Industry & industrial complexes|||3.1 — Công nghiệp & các khu công nghiệp',
  '울산 (ô tô/đóng tàu/hoá dầu), 창원 (cơ khí), cụm bán dẫn Gyeonggi (반도체), 조선 đóng tàu, 자동차 ô tô.',
  [[
    `<span class="eyebrow">KEG301 · Chapter 3 · Lesson 3.1</span>
<h2>Industry &amp; industrial complexes</h2>
<h3>Heavy industry anchor: 울산 (Ulsan)</h3>
<p><strong>울산 (Ulsan)</strong>, in the Yeongnam region, is Korea's single largest industrial city by output — home to a Hyundai Motor plant (largest automobile assembly complex in the world by some measures), a large petrochemical complex, and HD Hyundai Heavy Industries shipyards. Three pillars in one city: <strong>자동차 (jadongcha, "automobile")</strong>, <strong>조선 (joseon, "shipbuilding")</strong>, and petrochemicals.</p>
<h3>Precision machinery: 창원 (Changwon)</h3>
<p><strong>창원 (Changwon)</strong>, also in Yeongnam (South Gyeongsang), was purpose-built as a planned industrial city specializing in precision machinery, defense equipment and machine tools — part of Korea's 1970s "Heavy and Chemical Industry" (HCI) drive to move up the value chain.</p>
<h3>The semiconductor belt: Gyeonggi-do</h3>
<p><strong>반도체 (bandochae, "semiconductor")</strong> production concentrates just outside Seoul in Sudogwon: SK Hynix around Icheon/Yongin, and Samsung Electronics' Pyeongtaek/Hwaseong fabs. This cluster is often called Korea's economic crown jewel — a small geographic footprint generating an outsized share of exports.</p>
<pre><code>Industrial clusters at a glance:
 Region      City         Specialty
 영남 Yeongnam Ulsan        cars, shipbuilding, petrochemicals
 영남 Yeongnam Changwon     precision machinery, defense
 영남 Yeongnam Geoje        shipyards (large tankers/LNG carriers)
 수도권 Sudogwon Icheon/Yongin  semiconductors (SK Hynix)
 수도권 Sudogwon Pyeongtaek/Hwaseong semiconductors (Samsung)
 호남 Honam    Yeosu/Gwangyang  petrochemicals, steel
</code></pre>
<div class="callout"><span class="badge">Pattern to remember</span> Korea's export-driving industries cluster geographically — you can predict a lot about a region just by knowing which of these clusters sits inside it.</div>`,
    `<span class="eyebrow">KEG301 · Chương 3 · Bài 3.1</span>
<h2>Công nghiệp &amp; các khu công nghiệp</h2>
<h3>Trụ cột công nghiệp nặng: 울산 (Ulsan)</h3>
<p><strong>울산 (Ulsan)</strong>, thuộc vùng Yeongnam, là thành phố công nghiệp lớn nhất Hàn Quốc xét theo sản lượng — nơi có nhà máy Hyundai Motor (theo một số cách tính là tổ hợp lắp ráp ô tô lớn nhất thế giới), một khu hoá dầu lớn, và các xưởng đóng tàu HD Hyundai Heavy Industries. Ba trụ cột trong một thành phố: <strong>자동차 (jadongcha, "ô tô")</strong>, <strong>조선 (joseon, "đóng tàu")</strong>, và hoá dầu.</p>
<h3>Cơ khí chính xác: 창원 (Changwon)</h3>
<p><strong>창원 (Changwon)</strong>, cũng thuộc Yeongnam (Nam Gyeongsang), là thành phố công nghiệp được quy hoạch xây dựng chuyên về máy móc chính xác, thiết bị quốc phòng và công cụ máy — một phần của chiến lược "Công nghiệp nặng &amp; hoá chất" (HCI) thập niên 1970 nhằm đưa nền kinh tế Hàn Quốc lên nấc thang giá trị cao hơn.</p>
<h3>Vành đai bán dẫn: tỉnh Gyeonggi</h3>
<p>Sản xuất <strong>반도체 (bandochae, "chất bán dẫn")</strong> tập trung ngay ngoại ô Seoul trong vùng Sudogwon: SK Hynix quanh khu vực Icheon/Yongin, và các nhà máy (fab) của Samsung Electronics ở Pyeongtaek/Hwaseong. Cụm này thường được gọi là "viên ngọc" của kinh tế Hàn Quốc — một khu vực địa lý nhỏ tạo ra tỉ trọng xuất khẩu vượt trội.</p>
<pre><code>Các cụm công nghiệp chính:
 Vùng        Thành phố    Chuyên ngành
 영남 Yeongnam Ulsan        ô tô, đóng tàu, hoá dầu
 영남 Yeongnam Changwon     cơ khí chính xác, quốc phòng
 영남 Yeongnam Geoje        đóng tàu (tàu chở dầu/LNG cỡ lớn)
 수도권 Sudogwon Icheon/Yongin  bán dẫn (SK Hynix)
 수도권 Sudogwon Pyeongtaek/Hwaseong bán dẫn (Samsung)
 호남 Honam    Yeosu/Gwangyang  hoá dầu, thép
</code></pre>
<div class="callout"><span class="badge">Mẫu hình cần nhớ</span> Các ngành công nghiệp dẫn dắt xuất khẩu của Hàn Quốc tập trung theo cụm địa lý — biết cụm nào nằm trong một vùng là đoán được rất nhiều điều về vùng đó.</div>`,
  ]]);

const c3q = quiz('keg301-quiz-3', 'Quiz 3 — Industry|||Quiz 3 — Công nghiệp', [
  { id: 'q1', question: '울산 (Ulsan) nổi bật với những ngành nào?', options: ['Nông nghiệp lúa nước', 'Ô tô, đóng tàu, hoá dầu', 'Công nghệ phần mềm', 'Du lịch biển'], correctIndex: 1, explanation: 'Ulsan là thành phố công nghiệp lớn nhất, trụ cột là ô tô (Hyundai Motor), đóng tàu và hoá dầu.' },
  { id: 'q2', question: 'Cụm sản xuất bán dẫn (반도체) lớn của Hàn Quốc nằm chủ yếu ở vùng nào?', options: ['호남 Honam', '영남 Yeongnam', '수도권 Sudogwon (Icheon/Yongin, Pyeongtaek/Hwaseong)', 'Jeju'], correctIndex: 2, explanation: 'SK Hynix và Samsung Electronics đặt các fab bán dẫn lớn ngay ngoại ô Seoul, trong vùng Sudogwon.' },
  { id: 'q3', question: '창원 (Changwon) được quy hoạch chuyên về ngành nào?', options: ['Cơ khí chính xác & thiết bị quốc phòng', 'Chế biến thuỷ sản', 'Dệt may', 'Khai khoáng than'], correctIndex: 0, explanation: 'Changwon là thành phố công nghiệp quy hoạch từ thập niên 1970, chuyên cơ khí chính xác và quốc phòng.' },
]);

const c4 = doc('keg301-4-1-vung-thu-do-do-thi-hoa', '4.1 — Seoul Capital Area & urbanization|||4.1 — Vùng thủ đô Seoul & đô thị hoá',
  '수도권 집중 (tập trung vùng thủ đô); quy mô dân số Seoul & Sudogwon; chính sách phi tập trung 세종시, 혁신도시.',
  [[
    `<span class="eyebrow">KEG301 · Chapter 4 · Lesson 4.1</span>
<h2>Seoul Capital Area &amp; urbanization</h2>
<h3>수도권 집중 — the single most-discussed fact in Korean regional policy</h3>
<p><strong>수도권 집중 (Sudogwon jipjung, "concentration in the Capital Region")</strong> describes how Seoul city (roughly 9-10 million people) plus its surrounding Sudogwon (Incheon + Gyeonggi-do) together hold around <strong>half of Korea's entire population</strong> on a small share of the national land area — and an even larger share of head-office jobs, universities and cultural/media industries.</p>
<h3>Urbanization overall</h3>
<p>Korea is one of the most urbanized countries in the world — commonly cited as <strong>over 80% urban population</strong> — a rapid shift from a mostly rural, agrarian society in the 1960s to today's metropolitan-dominated economy in about two generations.</p>
<h3>Decentralization policy</h3>
<ul>
<li><strong>세종시 (Sejong-si)</strong> — a purpose-built administrative city (south of Seoul) hosting many central-government ministries, created specifically to pull government functions out of Sudogwon.</li>
<li><strong>혁신도시 (Hyeoksin-dosi, "Innovation Cities")</strong> — a program relocating public corporations and research institutes to provincial cities, to build jobs and population outside the capital region.</li>
</ul>
<div class="callout"><span class="badge">Cause &amp; effect</span> Concentration in Sudogwon drives up housing prices and traffic in Seoul while accelerating population decline in rural provinces — the two sides of the same geographic coin, revisited in Chapter 8.</div>`,
    `<span class="eyebrow">KEG301 · Chương 4 · Bài 4.1</span>
<h2>Vùng thủ đô Seoul &amp; đô thị hoá</h2>
<h3>수도권 집중 — dữ kiện được bàn nhiều nhất trong chính sách vùng của Hàn Quốc</h3>
<p><strong>수도권 집중 (Sudogwon jipjung, "tập trung vào Vùng Thủ đô")</strong> mô tả việc thành phố Seoul (khoảng 9-10 triệu dân) cùng vùng Sudogwon bao quanh (Incheon + tỉnh Gyeonggi) gộp lại chiếm khoảng <strong>một nửa tổng dân số Hàn Quốc</strong> trên một phần nhỏ diện tích cả nước — và một tỉ trọng còn lớn hơn thế về trụ sở doanh nghiệp, trường đại học, và ngành văn hoá/truyền thông.</p>
<h3>Đô thị hoá nói chung</h3>
<p>Hàn Quốc là một trong những nước đô thị hoá cao nhất thế giới — thường được dẫn là <strong>hơn 80% dân số sống ở đô thị</strong> — một chuyển dịch nhanh từ một xã hội nông nghiệp nông thôn vào thập niên 1960 sang nền kinh tế do các đô thị lớn chi phối ngày nay, chỉ trong khoảng hai thế hệ.</p>
<h3>Chính sách phi tập trung</h3>
<ul>
<li><strong>세종시 (Sejong-si)</strong> — thành phố hành chính được xây dựng theo quy hoạch (phía nam Seoul), nơi đặt nhiều bộ ngành trung ương, được lập ra chính là để kéo chức năng hành chính ra khỏi Sudogwon.</li>
<li><strong>혁신도시 (Hyeoksin-dosi, "Thành phố đổi mới")</strong> — chương trình di dời các tập đoàn công &amp; viện nghiên cứu về các thành phố địa phương, nhằm tạo việc làm và dân số bên ngoài vùng thủ đô.</li>
</ul>
<div class="callout"><span class="badge">Nhân-quả</span> Tập trung vào Sudogwon đẩy giá nhà và ùn tắc giao thông ở Seoul lên cao, đồng thời làm dân số các tỉnh nông thôn suy giảm nhanh hơn — hai mặt của cùng một vấn đề địa lý, sẽ quay lại ở Chương 8.</div>`,
  ]]);

const c4q = quiz('keg301-quiz-4', 'Quiz 4 — Seoul & urbanization|||Quiz 4 — Seoul & đô thị hoá', [
  { id: 'q1', question: '수도권 집중 (Sudogwon jipjung) mô tả hiện tượng gì?', options: ['Dân số phân tán đều cả nước', 'Tập trung dân số/kinh tế vào vùng thủ đô Seoul', 'Di dân ra nông thôn', 'Suy giảm dân số Seoul'], correctIndex: 1, explanation: 'Sudogwon jipjung là hiện tượng tập trung dân số, kinh tế, việc làm vào vùng Seoul-Incheon-Gyeonggi.' },
  { id: 'q2', question: '세종시 (Sejong-si) được xây dựng với mục đích chính nào?', options: ['Trung tâm du lịch biển', 'Thành phố hành chính, kéo chức năng chính phủ khỏi Sudogwon', 'Khu công nghiệp đóng tàu', 'Cảng biển quốc tế'], correctIndex: 1, explanation: 'Sejong-si là thành phố hành chính quy hoạch để giảm tập trung vào vùng thủ đô.' },
  { id: 'q3', question: 'Tỉ lệ đô thị hoá của Hàn Quốc hiện nay ở mức nào?', options: ['Khoảng 30%', 'Khoảng 50%', 'Hơn 80%', 'Dưới 20%'], correctIndex: 2, explanation: 'Hàn Quốc đô thị hoá rất cao, thường được dẫn ở mức hơn 80% dân số sống tại đô thị.' },
]);

const c5 = doc('keg301-5-1-nong-lam-ngu-nghiep', '5.1 — Agriculture, forestry & fisheries|||5.1 — Nông - lâm - ngư nghiệp & phân bố',
  'Vựa lúa Honam/Chungcheong; già hoá nông dân; ngư nghiệp Busan & nuôi trồng ven biển; phủ xanh rừng 산림녹화.',
  [[
    `<span class="eyebrow">KEG301 · Chapter 5 · Lesson 5.1</span>
<h2>Agriculture, forestry &amp; fisheries</h2>
<h3>Agriculture — small, aging, but rice-self-sufficient</h3>
<p>Cultivable land is limited to the western/southern plains — chiefly the <strong>호남 (Honam)</strong> region (Jeolla provinces) and parts of Chungcheong, historically Korea's rice basket. Two long-running trends define Korean agriculture today: farmland area has been shrinking as cities and industry expand, and the farming population is aging rapidly, with rural areas skewing older than the national average. Rice remains the one staple where Korea keeps near self-sufficiency; most other food, especially feed grains, is imported.</p>
<h3>Fisheries</h3>
<p>Busan is Korea's fishing and seafood-trading hub, anchored by markets like <strong>Jagalchi</strong>. Along the south coast, aquaculture (seaweed, oysters, farmed fish) is a major and growing share of output alongside wild-caught fisheries.</p>
<h3>Forestry — a rare reforestation success story</h3>
<p><strong>산림녹화 (Sallim nokhwa, "greening the mountains/forests")</strong> refers to Korea's national reforestation campaigns from the 1960s-70s, which turned war- and deforestation-stripped mountains into the densely forested hillsides seen across the country today — frequently cited internationally as a reforestation success story.</p>
<pre><code>Sector snapshot:
 Rice        -> self-sufficient, concentrated in Honam/Chungcheong plains
 Other crops -> heavy import dependence (feed grains, soybeans, wheat)
 Fisheries   -> Busan hub (Jagalchi market) + south-coast aquaculture
 Forestry    -> 산림녹화 (Sallim nokhwa) reforestation since 1960s-70s
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> Pair each sector with its region: rice → Honam/Chungcheong plains; fisheries → Busan/south coast; forestry recovery → nationwide mountains.</div>`,
    `<span class="eyebrow">KEG301 · Chương 5 · Bài 5.1</span>
<h2>Nông - lâm - ngư nghiệp &amp; phân bố</h2>
<h3>Nông nghiệp — quy mô nhỏ, già hoá, nhưng tự chủ được lúa gạo</h3>
<p>Đất canh tác chỉ giới hạn ở các đồng bằng phía tây/nam — chủ yếu là vùng <strong>호남 (Honam)</strong> (các tỉnh Jeolla) và một phần Chungcheong, vốn là vựa lúa truyền thống của Hàn Quốc. Hai xu hướng dài hạn định hình nông nghiệp Hàn Quốc ngày nay: diện tích đất nông nghiệp đang thu hẹp dần khi đô thị và công nghiệp mở rộng, và dân số làm nông đang già hoá nhanh, các vùng nông thôn có độ tuổi trung bình cao hơn hẳn cả nước. Lúa gạo là mặt hàng lương thực chủ lực duy nhất mà Hàn Quốc gần như tự chủ được; phần lớn thực phẩm khác, nhất là ngũ cốc làm thức ăn chăn nuôi, phải nhập khẩu.</p>
<h3>Ngư nghiệp</h3>
<p>Busan là trung tâm đánh bắt và giao thương thuỷ sản của Hàn Quốc, gắn với các chợ như <strong>Jagalchi</strong>. Dọc bờ biển phía nam, nuôi trồng thuỷ sản (rong biển, hàu, cá nuôi) chiếm tỉ trọng lớn và đang tăng bên cạnh đánh bắt tự nhiên.</p>
<h3>Lâm nghiệp — một câu chuyện phủ xanh hiếm có thành công</h3>
<p><strong>산림녹화 (Sallim nokhwa, "phủ xanh núi rừng")</strong> chỉ các chiến dịch trồng rừng quốc gia của Hàn Quốc từ thập niên 1960-70, biến những ngọn núi trơ trọi vì chiến tranh và phá rừng thành những sườn đồi rừng rậm rạp như thấy khắp cả nước ngày nay — thường được quốc tế nhắc đến như một câu chuyện phủ xanh rừng thành công.</p>
<pre><code>Tổng quan ngành:
 Lúa gạo      -> tự chủ, tập trung ở đồng bằng Honam/Chungcheong
 Cây trồng khác -> phụ thuộc nhập khẩu nặng (ngũ cốc chăn nuôi, đậu tương, lúa mì)
 Ngư nghiệp   -> trung tâm Busan (chợ Jagalchi) + nuôi trồng bờ biển phía nam
 Lâm nghiệp   -> 산림녹화 (Sallim nokhwa) phủ xanh từ thập niên 1960-70
</code></pre>
<div class="callout"><span class="badge">Mẹo ghi nhớ khi thi</span> Ghép mỗi ngành với vùng của nó: lúa gạo → đồng bằng Honam/Chungcheong; ngư nghiệp → Busan/bờ biển nam; phục hồi rừng → núi khắp cả nước.</div>`,
  ]]);

const c5q = quiz('keg301-quiz-5', 'Quiz 5 — Agri/forestry/fisheries|||Quiz 5 — Nông-lâm-ngư nghiệp', [
  { id: 'q1', question: 'Vựa lúa truyền thống của Hàn Quốc nằm chủ yếu ở đâu?', options: ['Đồng bằng Honam/Chungcheong', 'Vùng núi Gangwon', 'Đảo Jeju', 'Vùng Yeongnam'], correctIndex: 0, explanation: 'Honam (Jeolla) và Chungcheong là các đồng bằng lúa nước truyền thống.' },
  { id: 'q2', question: '산림녹화 (Sallim nokhwa) là gì?', options: ['Chính sách xuất khẩu gỗ', 'Chiến dịch phủ xanh/trồng rừng quốc gia', 'Luật cấm đánh bắt cá', 'Chương trình đô thị hoá'], correctIndex: 1, explanation: 'Sallim nokhwa là các chiến dịch phủ xanh núi rừng từ thập niên 1960-70.' },
  { id: 'q3', question: 'Trung tâm ngư nghiệp lớn của Hàn Quốc, gắn với chợ Jagalchi, là thành phố nào?', options: ['Seoul', 'Busan', 'Daegu', 'Sejong'], correctIndex: 1, explanation: 'Busan là trung tâm đánh bắt & giao thương thuỷ sản, nổi tiếng với chợ Jagalchi.' },
]);

const c6 = doc('keg301-6-1-giao-thong-logistics', '6.1 — Transport, logistics & seaports|||6.1 — Giao thông, logistics & cảng biển',
  '부산항 cảng container top thế giới; 인천공항 trung tâm logistics hàng không; mạng KTX/đường bộ hình nan quạt từ Seoul.',
  [[
    `<span class="eyebrow">KEG301 · Chapter 6 · Lesson 6.1</span>
<h2>Transport, logistics &amp; seaports</h2>
<h3>부산항 (Busan Port) — the maritime gateway</h3>
<p><strong>부산항 (Busan hang, "Busan Port")</strong> is Korea's largest container port and one of the world's busiest transshipment hubs — a port where cargo is trans-loaded between long-haul and regional ships rather than only starting/ending there. Its Yeongnam-region location, facing Japan and the wider Pacific, made it the natural maritime gateway as Korea industrialized export-led growth from the 1960s onward.</p>
<h3>인천공항 (Incheon International Airport) — the air-cargo hub</h3>
<p><strong>인천공항 (Incheon gonghang, "Incheon Airport")</strong>, west of Seoul in Sudogwon, is Korea's main international air-passenger gateway and a major regional air-cargo hub — critical for high-value, time-sensitive exports such as semiconductors and electronics components that move by air rather than sea.</p>
<h3>Domestic network: rail &amp; roads radiate from Seoul</h3>
<p>Korea's expressway and <strong>KTX (고속철도, gosok cheoldo, "high-speed railway")</strong> networks are built largely as a fan radiating out of Seoul, reflecting and reinforcing Sudogwon's centrality — most inter-regional trips, freight included, still pass through or near the capital corridor.</p>
<pre><code>Logistics map:
 부산항 Busan Port    -> sea freight, container transshipment (Yeongnam)
 인천공항 Incheon Airport -> air cargo & international passengers (Sudogwon)
 KTX / expressways   -> radiate from Seoul, connect regions to Sudogwon
</code></pre>
<div class="callout"><span class="badge">Why geography = trade</span> Export-led growth needed a port (Busan) and later an air hub (Incheon) close to the industrial and capital core — location, not chance, explains why these two sites became Korea's logistics anchors.</div>`,
    `<span class="eyebrow">KEG301 · Chương 6 · Bài 6.1</span>
<h2>Giao thông, logistics &amp; cảng biển</h2>
<h3>부산항 (Cảng Busan) — cửa ngõ hàng hải</h3>
<p><strong>부산항 (Busan hang, "Cảng Busan")</strong> là cảng container lớn nhất Hàn Quốc và là một trong những trung tâm trung chuyển (transshipment) bận rộn nhất thế giới — nơi hàng hoá được chuyển tải giữa các tuyến tàu viễn dương và tàu khu vực chứ không chỉ xuất phát/kết thúc tại đó. Vị trí ở vùng Yeongnam, hướng ra Nhật Bản và Thái Bình Dương, khiến nơi đây trở thành cửa ngõ hàng hải tự nhiên khi Hàn Quốc công nghiệp hoá theo hướng xuất khẩu từ thập niên 1960.</p>
<h3>인천공항 (Sân bay quốc tế Incheon) — trung tâm logistics hàng không</h3>
<p><strong>인천공항 (Incheon gonghang, "Sân bay Incheon")</strong>, phía tây Seoul trong vùng Sudogwon, là cửa ngõ hàng không quốc tế chính của Hàn Quốc và là trung tâm vận chuyển hàng hoá hàng không lớn của khu vực — thiết yếu cho các mặt hàng xuất khẩu giá trị cao, gấp thời gian như bán dẫn và linh kiện điện tử vốn cần vận chuyển bằng đường không thay vì đường biển.</p>
<h3>Mạng lưới nội địa: đường sắt &amp; đường bộ toả hình nan quạt từ Seoul</h3>
<p>Mạng đường cao tốc và <strong>KTX (고속철도, gosok cheoldo, "đường sắt cao tốc")</strong> của Hàn Quốc chủ yếu được xây theo hình nan quạt toả ra từ Seoul, phản ánh và củng cố thêm vị trí trung tâm của Sudogwon — phần lớn các chuyến đi liên vùng, kể cả vận chuyển hàng hoá, vẫn đi qua hoặc gần hành lang thủ đô.</p>
<pre><code>Bản đồ logistics:
 부산항 Cảng Busan    -> vận tải biển, trung chuyển container (Yeongnam)
 인천공항 Sân bay Incheon -> hàng hoá & hành khách quốc tế (Sudogwon)
 KTX / cao tốc        -> toả ra từ Seoul, nối các vùng về Sudogwon
</code></pre>
<div class="callout"><span class="badge">Vì sao địa lý = thương mại</span> Tăng trưởng hướng xuất khẩu cần một cảng biển (Busan) và sau này một trung tâm hàng không (Incheon) gần lõi công nghiệp và thủ đô — vị trí địa lý, chứ không phải ngẫu nhiên, giải thích vì sao hai nơi này trở thành trụ cột logistics của Hàn Quốc.</div>`,
  ]]);

const c6q = quiz('keg301-quiz-6', 'Quiz 6 — Transport & logistics|||Quiz 6 — Giao thông & logistics', [
  { id: 'q1', question: '부산항 (Cảng Busan) nổi bật với vai trò gì?', options: ['Cảng cá nhỏ địa phương', 'Trung tâm trung chuyển container hàng đầu thế giới', 'Cảng du lịch', 'Cảng quân sự duy nhất'], correctIndex: 1, explanation: 'Busan là cảng container lớn nhất Hàn Quốc và một trung tâm trung chuyển toàn cầu.' },
  { id: 'q2', question: '인천공항 (Sân bay Incheon) quan trọng nhất với loại hàng xuất khẩu nào?', options: ['Gạo, nông sản', 'Hàng giá trị cao, gấp thời gian như bán dẫn/linh kiện điện tử', 'Than đá', 'Vật liệu xây dựng'], correctIndex: 1, explanation: 'Vận chuyển hàng không phù hợp với hàng giá trị cao, nhẹ, cần giao nhanh như bán dẫn.' },
  { id: 'q3', question: 'Mạng KTX và đường cao tốc Hàn Quốc có đặc điểm bố trí nào?', options: ['Toả hình nan quạt từ Seoul', 'Mạng lưới vòng quanh Busan', 'Chỉ nối các đảo', 'Song song bờ biển đông'], correctIndex: 0, explanation: 'Mạng giao thông chủ yếu toả ra từ Seoul, phản ánh vị trí trung tâm của Sudogwon.' },
]);

const c7 = doc('keg301-7-1-thuong-mai-fta', '7.1 — International trade & FTAs|||7.1 — Thương mại quốc tế & FTA',
  '수출 주도 경제 (kinh tế hướng xuất khẩu); mặt hàng & đối tác xuất khẩu chính; các FTA lớn gồm VKFTA với Việt Nam.',
  [[
    `<span class="eyebrow">KEG301 · Chapter 7 · Lesson 7.1</span>
<h2>International trade &amp; FTAs</h2>
<h3>수출 주도 경제 — an export-led economy</h3>
<p><strong>수출 주도 경제 (Suchul judo gyeongje, "export-led economy")</strong> is the term for Korea's core growth model since the 1960s: with a small domestic market, Korea grew by manufacturing for export rather than for internal demand. Trade (exports + imports) commonly runs close to or above Korea's GDP in value — a sign of how open and export-dependent the economy is.</p>
<h3>What Korea exports, and to whom</h3>
<ul>
<li>Leading export categories: semiconductors (반도체), automobiles, ships, petrochemicals/refined products, steel, and — more recently — electric-vehicle batteries.</li>
<li>Major trading partners: China, the United States, ASEAN (including Vietnam, now one of Korea's top export destinations and a major manufacturing base for Korean firms), and the EU.</li>
</ul>
<h3>Free Trade Agreements (FTAs)</h3>
<pre><code>Selected Korean FTAs:
 KORUS FTA        -> Korea - United States
 Korea - EU FTA    -> Korea - European Union
 RCEP             -> Korea + ASEAN + China/Japan/Australia/NZ
 VKFTA            -> Vietnam - Korea FTA (2015)
</code></pre>
<p>The agency <strong>KOTRA</strong> (Korea Trade-Investment Promotion Agency) supports Korean firms' overseas trade and investment; the general term for "trade" in Korean is <strong>무역 (mudyeok)</strong>.</p>
<div class="callout"><span class="badge">Vietnam connection</span> Korea is one of Vietnam's largest sources of FDI, and many of the industrial clusters from Chapter 3 (electronics, automotive parts) now have matching production sites in Vietnam under Korean investment — a direct link between Korean economic geography and the Vietnamese economy.</div>`,
    `<span class="eyebrow">KEG301 · Chương 7 · Bài 7.1</span>
<h2>Thương mại quốc tế &amp; FTA</h2>
<h3>수출 주도 경제 — nền kinh tế hướng xuất khẩu</h3>
<p><strong>수출 주도 경제 (Suchul judo gyeongje, "kinh tế hướng xuất khẩu")</strong> là tên gọi cho mô hình tăng trưởng cốt lõi của Hàn Quốc từ thập niên 1960: với thị trường nội địa nhỏ, Hàn Quốc tăng trưởng bằng cách sản xuất để xuất khẩu thay vì phục vụ nhu cầu trong nước. Kim ngạch thương mại (xuất khẩu + nhập khẩu) thường xấp xỉ hoặc vượt GDP Hàn Quốc về giá trị — dấu hiệu cho thấy nền kinh tế mở và phụ thuộc xuất khẩu tới mức nào.</p>
<h3>Hàn Quốc xuất khẩu gì, cho ai</h3>
<ul>
<li>Các nhóm hàng xuất khẩu chủ lực: bán dẫn (반도체), ô tô, tàu biển, sản phẩm hoá dầu/lọc dầu, thép, và gần đây là pin xe điện.</li>
<li>Đối tác thương mại lớn: Trung Quốc, Hoa Kỳ, ASEAN (gồm Việt Nam — nay là một trong những thị trường xuất khẩu hàng đầu của Hàn Quốc và là căn cứ sản xuất lớn của doanh nghiệp Hàn), và EU.</li>
</ul>
<h3>Các hiệp định thương mại tự do (FTA)</h3>
<pre><code>Một số FTA của Hàn Quốc:
 KORUS FTA        -> Hàn Quốc - Hoa Kỳ
 Korea - EU FTA    -> Hàn Quốc - Liên minh châu Âu
 RCEP             -> Hàn Quốc + ASEAN + Trung Quốc/Nhật Bản/Úc/NZ
 VKFTA            -> FTA Việt Nam - Hàn Quốc (2015)
</code></pre>
<p>Cơ quan <strong>KOTRA</strong> (Cơ quan Xúc tiến Thương mại-Đầu tư Hàn Quốc) hỗ trợ doanh nghiệp Hàn Quốc thương mại &amp; đầu tư ra nước ngoài; từ chung cho "thương mại" trong tiếng Hàn là <strong>무역 (mudyeok)</strong>.</p>
<div class="callout"><span class="badge">Liên hệ Việt Nam</span> Hàn Quốc là một trong những nguồn FDI lớn nhất vào Việt Nam, và nhiều cụm công nghiệp ở Chương 3 (điện tử, linh kiện ô tô) nay có các cơ sở sản xuất tương ứng tại Việt Nam do doanh nghiệp Hàn đầu tư — một liên hệ trực tiếp giữa địa lý kinh tế Hàn Quốc và kinh tế Việt Nam.</div>`,
  ]]);

const c7q = quiz('keg301-quiz-7', 'Quiz 7 — Trade & FTAs|||Quiz 7 — Thương mại & FTA', [
  { id: 'q1', question: '수출 주도 경제 (Suchul judo gyeongje) nghĩa là gì?', options: ['Kinh tế bao cấp', 'Kinh tế hướng xuất khẩu', 'Kinh tế tự cung tự cấp', 'Kinh tế kế hoạch hoá tập trung'], correctIndex: 1, explanation: 'Suchul judo gyeongje = mô hình tăng trưởng dựa vào sản xuất cho xuất khẩu.' },
  { id: 'q2', question: 'VKFTA là hiệp định thương mại tự do giữa các bên nào?', options: ['Hàn Quốc - Hoa Kỳ', 'Việt Nam - Hàn Quốc', 'Hàn Quốc - EU', 'Hàn Quốc - Nhật Bản'], correctIndex: 1, explanation: 'VKFTA (2015) là FTA giữa Việt Nam và Hàn Quốc.' },
  { id: 'q3', question: 'KOTRA là cơ quan làm nhiệm vụ gì?', options: ['Quản lý cảng biển', 'Xúc tiến thương mại & đầu tư ra nước ngoài của Hàn Quốc', 'Cấp visa lao động', 'Quản lý điện lực quốc gia'], correctIndex: 1, explanation: 'KOTRA hỗ trợ doanh nghiệp Hàn Quốc mở rộng thương mại và đầu tư quốc tế.' },
]);

const c8 = doc('keg301-8-1-phat-trien-vung-on-tap', '8.1 — Regional development, disparity & contemporary Korea (review)|||8.1 — Phát triển vùng, chênh lệch & kinh tế Hàn đương đại (ôn tập)',
  '지방 소멸 (suy giảm dân số địa phương); 균형발전 (phát triển cân bằng); 한강의 기적; ôn tập 7 chương.',
  [[
    `<span class="eyebrow">KEG301 · Chapter 8 · Lesson 8.1</span>
<h2>Regional development, disparity &amp; contemporary Korea</h2>
<h3>지방 소멸 — the "local extinction" crisis</h3>
<p><strong>지방 소멸 (Jibang somyeol, literally "local/provincial extinction")</strong> is the term Korean policy debates use for rural and small-city population decline driven by low birthrates plus continued migration to Sudogwon — some provincial counties are projected to see steep population loss over coming decades, closing schools and hospitals as the working-age population thins out.</p>
<h3>균형발전 — balanced national development policy</h3>
<p>The government's response is grouped under <strong>균형발전 (Gyunhyeong baljeon, "balanced development")</strong>: relocating public institutions (혁신도시, Chapter 4), building Sejong as an administrative counterweight, and targeted investment in provincial industrial belts. Results are mixed — Sudogwon's pull remains strong even against these policies.</p>
<h3>From 한강의 기적 to a high-tech, aging economy</h3>
<p><strong>한강의 기적 (Hangang-ui gijeok, "the Miracle on the Han River")</strong> is the name for Korea's rapid industrialization from the 1960s-1990s, transforming a war-devastated agrarian economy into a manufacturing and later technology powerhouse. Today's Korea layers new challenges onto that legacy: one of the world's fastest-aging populations, continued reliance on a handful of export industries (semiconductors, autos, shipbuilding), and the regional imbalance covered throughout this course.</p>
<h3>Course review — the 8 chapters in one table</h3>
<pre><code>1. Overview & 3 regions      -> 수도권 / 영남 / 호남
2. Resources & energy        -> import-dependent, coal/nuclear/renewables
3. Industry clusters         -> Ulsan, Changwon, Gyeonggi semiconductor belt
4. Seoul & urbanization       -> Sudogwon jipjung, Sejong, Hyeoksin-dosi
5. Agriculture/forestry/fishing -> Honam rice, Busan fisheries, reforestation
6. Transport & logistics     -> Busan Port, Incheon Airport, KTX network
7. Trade & FTAs              -> export-led economy, KORUS/EU/RCEP/VKFTA
8. Regional disparity & today -> Jibang somyeol, Gyunhyeong baljeon, Hangang-ui gijeok
</code></pre>
<div class="callout"><span class="badge">Study tip</span> Before the exam, be able to place every proper noun in this course (a city, a policy, an FTA) into its region AND its chapter — the two axes examiners test most.</div>`,
    `<span class="eyebrow">KEG301 · Chương 8 · Bài 8.1</span>
<h2>Phát triển vùng, chênh lệch &amp; kinh tế Hàn đương đại</h2>
<h3>지방 소멸 — khủng hoảng "địa phương biến mất"</h3>
<p><strong>지방 소멸 (Jibang somyeol, nghĩa đen "địa phương/tỉnh biến mất")</strong> là thuật ngữ trong tranh luận chính sách Hàn Quốc để chỉ tình trạng suy giảm dân số ở nông thôn và thành phố nhỏ, do tỉ lệ sinh thấp cộng với dòng di cư liên tục về Sudogwon — một số huyện tỉnh được dự báo sẽ mất dân số mạnh trong vài thập kỷ tới, phải đóng cửa trường học, bệnh viện khi dân số trong độ tuổi lao động mỏng dần.</p>
<h3>균형발전 — chính sách phát triển cân bằng quốc gia</h3>
<p>Phản ứng của chính phủ được gom lại dưới tên gọi <strong>균형발전 (Gyunhyeong baljeon, "phát triển cân bằng")</strong>: di dời các cơ quan/tập đoàn công (혁신도시, Chương 4), xây dựng Sejong như đối trọng hành chính, và đầu tư có mục tiêu vào các vành đai công nghiệp địa phương. Kết quả còn lẫn lộn — sức hút của Sudogwon vẫn rất mạnh dù có các chính sách này.</p>
<h3>Từ 한강의 기적 đến một nền kinh tế công nghệ cao, đang già hoá</h3>
<p><strong>한강의 기적 (Hangang-ui gijeok, "Kỳ tích sông Hán")</strong> là tên gọi cho quá trình công nghiệp hoá nhanh chóng của Hàn Quốc từ thập niên 1960-1990, biến một nền kinh tế nông nghiệp bị tàn phá bởi chiến tranh thành cường quốc sản xuất rồi công nghệ. Hàn Quốc ngày nay chồng thêm những thách thức mới lên di sản đó: một trong những nước có dân số già hoá nhanh nhất thế giới, vẫn phụ thuộc vào một số ít ngành xuất khẩu (bán dẫn, ô tô, đóng tàu), và sự mất cân bằng vùng xuyên suốt môn học này.</p>
<h3>Ôn tập môn học — 8 chương trong một bảng</h3>
<pre><code>1. Tổng quan & 3 vùng        -> 수도권 / 영남 / 호남
2. Tài nguyên & năng lượng    -> phụ thuộc nhập khẩu, than/hạt nhân/tái tạo
3. Cụm công nghiệp            -> Ulsan, Changwon, vành đai bán dẫn Gyeonggi
4. Seoul & đô thị hoá         -> Sudogwon jipjung, Sejong, Hyeoksin-dosi
5. Nông-lâm-ngư nghiệp        -> lúa Honam, ngư nghiệp Busan, phủ xanh rừng
6. Giao thông & logistics     -> Cảng Busan, Sân bay Incheon, mạng KTX
7. Thương mại & FTA           -> kinh tế xuất khẩu, KORUS/EU/RCEP/VKFTA
8. Chênh lệch vùng & đương đại -> Jibang somyeol, Gyunhyeong baljeon, Hangang-ui gijeok
</code></pre>
<div class="callout"><span class="badge">Mẹo ôn thi</span> Trước khi thi, hãy đảm bảo có thể gắn mỗi danh từ riêng trong môn này (một thành phố, một chính sách, một FTA) vào đúng VÙNG và đúng CHƯƠNG — hai trục mà đề thi hay kiểm tra nhất.</div>`,
  ]]);

const c8q = quiz('keg301-quiz-8', 'Quiz 8 — Review|||Quiz 8 — Ôn tập', [
  { id: 'q1', question: '지방 소멸 (Jibang somyeol) mô tả vấn đề gì?', options: ['Ô nhiễm không khí đô thị', 'Suy giảm dân số nông thôn/tỉnh nhỏ do sinh thấp & di cư về Sudogwon', 'Khủng hoảng năng lượng', 'Lạm phát cao'], correctIndex: 1, explanation: 'Jibang somyeol là nguy cơ "biến mất" của các địa phương do dân số suy giảm mạnh.' },
  { id: 'q2', question: '한강의 기적 (Hangang-ui gijeok) nói về giai đoạn nào?', options: ['Chiến tranh Triều Tiên', 'Công nghiệp hoá nhanh chóng từ thập niên 1960-1990', 'Khủng hoảng tài chính 1997', 'Thời kỳ thuộc địa'], correctIndex: 1, explanation: '"Kỳ tích sông Hán" chỉ giai đoạn công nghiệp hoá thần tốc của Hàn Quốc.' },
  { id: 'q3', question: '균형발전 (Gyunhyeong baljeon) là chính sách nhằm mục tiêu gì?', options: ['Tăng tập trung vào Seoul', 'Phát triển cân bằng giữa vùng thủ đô và địa phương', 'Cấm di cư nội địa', 'Ưu tiên xuất khẩu nông sản'], correctIndex: 1, explanation: 'Gyunhyeong baljeon là chính sách phát triển cân bằng vùng, đối trọng với Sudogwon jipjung.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'KEG301',
    slug: 'keg301-ia-ly-kinh-te-han-quoc',
    title: 'Địa lý kinh tế Hàn Quốc',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KEG301.webp',
    shortDescription: 'Economic Geography of Korea: regions (Sudogwon/Yeongnam/Honam), resources & energy, industry clusters (Ulsan, semiconductors), Seoul urbanization, agriculture/fisheries, ports & logistics, trade & FTAs, regional disparity. Bilingual + Korean terms.|||Địa lý kinh tế Hàn Quốc: vùng (수도권/영남/호남), tài nguyên & năng lượng, cụm công nghiệp (Ulsan, bán dẫn), đô thị hoá Seoul, nông-ngư nghiệp, cảng & logistics, thương mại & FTA, chênh lệch vùng. Song ngữ + thuật ngữ Hàn.',
    description: 'Môn <strong>KEG301 — Economic Geography of Korea / Địa lý kinh tế Hàn Quốc</strong> (ngành Ngôn ngữ Hàn, kỳ 4) dựng theo 8 chương bám giáo trình <em>한국경제지리</em> và <em>The Korean Economy</em> (SaKong &amp; Koh): <strong>vùng kinh tế</strong> (수도권/영남/호남) → <strong>tài nguyên &amp; năng lượng</strong> → <strong>công nghiệp &amp; khu công nghiệp</strong> (Ulsan, Changwon, bán dẫn) → <strong>vùng thủ đô Seoul &amp; đô thị hoá</strong> → <strong>nông-lâm-ngư nghiệp</strong> → <strong>giao thông, logistics &amp; cảng biển</strong> (Busan, Incheon) → <strong>thương mại quốc tế &amp; FTA</strong> → <strong>phát triển vùng &amp; kinh tế đương đại</strong>. Song ngữ Việt-Anh, kèm địa danh &amp; thuật ngữ tiếng Hàn (한글 + romaja + nghĩa), quiz mỗi chương.',
    whatYouLearn: 'Ba vùng kinh tế 수도권/영남/호남; tài nguyên nghèo & phụ thuộc nhập khẩu năng lượng; cụm công nghiệp Ulsan/Changwon/bán dẫn Gyeonggi; 수도권 집중 & chính sách phi tập trung (세종시, 혁신도시); nông-lâm-ngư nghiệp & phân bố vùng; cảng Busan & sân bay Incheon; kinh tế xuất khẩu & các FTA (KORUS, EU, RCEP, VKFTA); chênh lệch vùng (지방 소멸) & chính sách 균형발전.',
    requirements: 'Không yêu cầu kiến thức tiếng Hàn chuyên sâu — môn dùng thuật ngữ Hàn cơ bản kèm romaja & nghĩa Việt. Nên có kiến thức nền về địa lý/kinh tế phổ thông.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình tham khảo, số liệu KOSIS/한국은행, công cụ tra cứu.', lessons: [taiLieu] },
    { title: 'Chương 1 — Vùng kinh tế|||Chapter 1 — Economic regions', description: '수도권/영남/호남, địa lý tự nhiên.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tài nguyên & năng lượng|||Chapter 2 — Resources & energy', description: 'Nhập khẩu năng lượng, cơ cấu điện, khí hậu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Công nghiệp & khu công nghiệp|||Chapter 3 — Industry & industrial complexes', description: 'Ulsan, Changwon, vành đai bán dẫn.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Vùng thủ đô Seoul & đô thị hoá|||Chapter 4 — Seoul & urbanization', description: '수도권 집중, Sejong, Hyeoksin-dosi.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nông-lâm-ngư nghiệp|||Chapter 5 — Agriculture, forestry & fisheries', description: 'Lúa Honam, ngư nghiệp Busan, phủ xanh rừng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Giao thông & logistics|||Chapter 6 — Transport & logistics', description: 'Cảng Busan, sân bay Incheon, mạng KTX.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thương mại quốc tế & FTA|||Chapter 7 — International trade & FTAs', description: 'Kinh tế xuất khẩu, KORUS/EU/RCEP/VKFTA.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Phát triển vùng & ôn tập|||Chapter 8 — Regional development & review', description: 'Chênh lệch vùng, kinh tế đương đại, ôn tập.', lessons: [c8, c8q] },
  ],
};
