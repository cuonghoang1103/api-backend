/**
 * CCS401 — Chinese Country Studies (Đất nước học Trung Quốc). Ngành Ngôn ngữ
 * Trung, FPTU Kỳ 5. ⚠️ Có CHC401 (văn hoá truyền thống) và CCB401 (kinh doanh)
 * — môn này KHÔNG lặp lại hai môn đó, chỉ nhấn ĐẤT NƯỚC HỌC: địa lý, dân số,
 * chính trị, kinh tế, xã hội đương đại. Giáo trình tham khảo (trích dẫn,
 * không upload PDF): "中国国情" (China National Conditions); "China: A New
 * History" (Fairbank & Goldman); tài liệu 国家统计局 (NBS). 8 chương: (1) địa
 * lý & 34 省级行政区, (2) dân số/56 民族/phương ngữ, (3) lịch sử CHND Trung
 * Hoa hiện đại, (4) thể chế chính trị 政治体制, (5) kinh tế 改革开放, (6) giáo
 * dục/KHCN/đô thị hoá, (7) 北上广深 & đặc khu, (8) quan hệ quốc tế & Trung-Việt.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ccs401-0-0-materials', 'Course materials|||Tài liệu tham khảo',
  'Ba nguồn tham khảo chính của môn (trích dẫn, không upload PDF) + tài liệu miễn phí, hợp pháp.',
  [[
    `<span class="eyebrow">CCS401 · Course materials</span>
<h2>Reference materials</h2>
<p class="lead">This course draws on three main references. They are <strong>cited</strong>, not distributed as PDFs — use the official FLM (flm.fpt.edu.vn) slide deck as the primary source, and the links below for further, up-to-date reading.</p>
<h3>📘 Core references (cited)</h3>
<ul>
<li><strong>中国国情</strong> (<em>China National Conditions</em>) — standard Chinese-language textbook on geography, population, political system and economy of the PRC.</li>
<li><strong>"China: A New History"</strong> — John King Fairbank &amp; Merle Goldman, Harvard University Press (2nd ed., 2006) — the modern-history chapters.</li>
<li><strong>国家统计局</strong> (National Bureau of Statistics of China, NBS, stats.gov.cn) — official demographic and economic data.</li>
</ul>
<h3>🌐 Free, legitimate resources</h3>
<ul>
<li><a href="https://www.stats.gov.cn/english/" target="_blank" rel="noopener">NBS China — English statistics portal</a></li>
<li><a href="https://www.worldbank.org/en/country/china" target="_blank" rel="noopener">World Bank — China country overview</a></li>
<li><a href="https://www.bbc.com/news/world-asia-china-16957462" target="_blank" rel="noopener">BBC — China country profile</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AsianBossVN" target="_blank" rel="noopener">Asian Boss</a> — phỏng vấn đường phố về xã hội Trung Quốc đương đại</li>
<li><a href="https://www.youtube.com/@CGTN" target="_blank" rel="noopener">CGTN</a> — truyền thông nhà nước Trung Quốc (đối chiếu với nguồn phương Tây để có góc nhìn cân bằng)</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển Hán-Anh có pinyin, tra thuật ngữ nhanh</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — tra chữ Hán &amp; pinyin trực tuyến</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Đây là các nguồn để tự nghiên cứu thêm, không thay thế slide chính thức của FLM. Số liệu thống kê thay đổi theo năm — luôn đối chiếu với 国家统计局 (NBS) cho số mới nhất.</div>`,
    `<span class="eyebrow">CCS401 · Tài liệu tham khảo</span>
<h2>Tài liệu tham khảo</h2>
<p class="lead">Môn này dựa trên ba nguồn tham khảo chính. Các nguồn được <strong>trích dẫn</strong>, không phát PDF — dùng slide chính thức của FLM (flm.fpt.edu.vn) làm nguồn chính, và các đường dẫn dưới đây để đọc thêm, cập nhật số liệu mới.</p>
<h3>📘 Nguồn tham khảo chính (trích dẫn)</h3>
<ul>
<li><strong>中国国情</strong> (<em>China National Conditions</em>) — giáo trình tiếng Trung chuẩn về địa lý, dân số, thể chế chính trị và kinh tế CHND Trung Hoa.</li>
<li><strong>"China: A New History"</strong> — John King Fairbank &amp; Merle Goldman, Harvard University Press (bản 2, 2006) — các chương lịch sử hiện đại.</li>
<li><strong>国家统计局</strong> (Cục Thống kê Quốc gia Trung Quốc, NBS, stats.gov.cn) — số liệu dân số và kinh tế chính thức.</li>
</ul>
<h3>🌐 Tài liệu miễn phí, hợp pháp</h3>
<ul>
<li><a href="https://www.stats.gov.cn/english/" target="_blank" rel="noopener">NBS China — cổng thống kê tiếng Anh</a></li>
<li><a href="https://www.worldbank.org/en/country/china" target="_blank" rel="noopener">World Bank — tổng quan Trung Quốc</a></li>
<li><a href="https://www.bbc.com/news/world-asia-china-16957462" target="_blank" rel="noopener">BBC — hồ sơ quốc gia Trung Quốc</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AsianBossVN" target="_blank" rel="noopener">Asian Boss</a> — phỏng vấn đường phố về xã hội Trung Quốc đương đại</li>
<li><a href="https://www.youtube.com/@CGTN" target="_blank" rel="noopener">CGTN</a> — truyền thông nhà nước Trung Quốc (nên đối chiếu với nguồn phương Tây để có góc nhìn cân bằng)</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển Hán-Anh có pinyin, tra thuật ngữ nhanh</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — tra chữ Hán &amp; pinyin trực tuyến</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Đây là nguồn để tự nghiên cứu thêm, không thay thế slide chính thức của FLM. Số liệu thống kê đổi theo năm — luôn đối chiếu 国家统计局 (NBS) để lấy số mới nhất.</div>`,
  ]]);

const intro = doc('ccs401-0-1-overview', 'Course overview: Chinese Country Studies|||Tổng quan: Đất nước học Trung Quốc',
  'Đất nước học khác văn hoá học (CHC401) và kinh doanh (CCB401) thế nào; lộ trình 8 chương: địa lý, dân số, lịch sử, chính trị, kinh tế, xã hội, đô thị, đối ngoại.',
  [[
    `<span class="eyebrow">CCS401 · Lesson 0.1 · Overview</span>
<h2>Chinese Country Studies</h2>
<p class="lead">This course is <strong>country studies (国情 guóqíng)</strong> — the factual, contemporary picture of China: its territory, people, government, economy and place in the world. It is deliberately <strong>not</strong> a repeat of CHC401 (traditional culture, Confucian values, festivals) or CCB401 (business etiquette, negotiation) — here you learn the "hard facts" a diplomat, journalist or investor needs to know.</p>
<h3>Why country studies</h3>
<p>To work with China — in translation, trade, tourism or diplomacy — you need more than vocabulary and etiquette. You need to know <strong>how the country is actually organized</strong>: how many people live where, who governs whom, how the economy grew from planned to market, and how China relates to its neighbors, including Vietnam.</p>
<h3>Roadmap — 8 chapters</h3>
<pre><code>1. Geography, territory &amp; natural conditions   (34 provincial-level divisions)
2. Population, ethnic groups &amp; language        (56 minzu, major dialects)
3. History of the modern PRC                    (1949 -&gt; reform era)
4. Political system &amp; administration           (CPC, NPC, State Council)
5. Economy: reform, opening-up &amp; development   (改革开放 -&gt; today)
6. Education, science/technology &amp; urbanization
7. Major regions &amp; cities                      (北上广深, Greater Bay Area)
8. International relations, China-Vietnam &amp; China in today's world
</code></pre>
<div class="callout"><span class="badge">Neutral, factual tone</span> Country studies presents institutions and statistics as they are officially reported. Sensitive topics (borders, territorial disputes) are covered factually and even-handedly — this is an academic subject, not a political stance.</div>`,
    `<span class="eyebrow">CCS401 · Bài 0.1 · Tổng quan</span>
<h2>Đất nước học Trung Quốc</h2>
<p class="lead">Môn này là <strong>đất nước học (国情 guóqíng)</strong> — bức tranh thực tế, đương đại về Trung Quốc: lãnh thổ, con người, chính quyền, kinh tế và vị trí trong thế giới. Môn <strong>cố tình không lặp lại</strong> CHC401 (văn hoá truyền thống, giá trị Nho giáo, lễ hội) hay CCB401 (nghi thức kinh doanh, đàm phán) — ở đây bạn học những "sự kiện cứng" mà một nhà ngoại giao, nhà báo hay nhà đầu tư cần biết.</p>
<h3>Vì sao cần đất nước học</h3>
<p>Để làm việc với Trung Quốc — trong biên phiên dịch, thương mại, du lịch hay ngoại giao — bạn cần nhiều hơn từ vựng và nghi thức. Bạn cần biết <strong>đất nước thực sự được tổ chức ra sao</strong>: bao nhiêu người sống ở đâu, ai quản lý ai, kinh tế đã chuyển từ kế hoạch sang thị trường thế nào, và Trung Quốc quan hệ ra sao với các nước láng giềng, kể cả Việt Nam.</p>
<h3>Lộ trình — 8 chương</h3>
<pre><code>1. Địa lý, lãnh thổ &amp; điều kiện tự nhiên       (34 đơn vị hành chính cấp tỉnh)
2. Dân số, dân tộc &amp; ngôn ngữ                  (56 dân tộc, phương ngữ chính)
3. Lịch sử hình thành CHND Trung Hoa hiện đại   (1949 -&gt; thời kỳ cải cách)
4. Thể chế chính trị &amp; hệ thống hành chính     (ĐCS TQ, Nhân đại, Quốc vụ viện)
5. Kinh tế: cải cách mở cửa &amp; phát triển       (改革开放 -&gt; hiện nay)
6. Giáo dục, khoa học công nghệ &amp; đô thị hoá
7. Các vùng - thành phố lớn                     (北上广深, Vùng Vịnh Lớn)
8. Quan hệ quốc tế, Trung-Việt &amp; Trung Quốc trong thế giới hôm nay
</code></pre>
<div class="callout"><span class="badge">Giọng trung lập, sự kiện</span> Đất nước học trình bày thể chế và số liệu theo đúng công bố chính thức. Chủ đề nhạy cảm (biên giới, tranh chấp lãnh thổ) được trình bày trung thực và cân bằng — đây là môn học thuật, không phải lập trường chính trị.</div>`,
  ]]);

const c1 = doc('ccs401-1-1-geography', '1.1 — Geography, territory & natural conditions|||1.1 — Địa lý, lãnh thổ & điều kiện tự nhiên',
  'Diện tích ~9,6 triệu km², biên giới 14 nước, 34 đơn vị hành chính cấp tỉnh (省级行政区), địa hình "ba bậc thang", sông Trường Giang/Hoàng Hà, khí hậu gió mùa.',
  [[
    `<span class="eyebrow">CCS401 · Chapter 1 · Lesson 1.1</span>
<h2>Geography, territory &amp; natural conditions (地理 dìlǐ)</h2>
<h3>Size &amp; borders</h3>
<p>China covers about <strong>9.6 million km²</strong> — the world's 3rd or 4th largest country by area, depending on the method of counting disputed/coastal zones. It shares land borders with <strong>14 countries</strong> (the most of any country in the world, tied with Russia), including Vietnam, Laos, Myanmar, India, Russia, Mongolia and North Korea, plus a long coastline on the Pacific.</p>
<h3>34 provincial-level divisions (省级行政区 shěngjí xíngzhèngqū)</h3>
<pre><code>23 Provinces        省 shěng          (incl. Taiwan, claimed, not administered)
5  Autonomous regions 自治区 zìzhìqū   (Guangxi, Inner Mongolia, Tibet, Ningxia, Xinjiang)
4  Municipalities    直辖市 zhíxiáshì  (Beijing, Shanghai, Tianjin, Chongqing)
2  Special admin. regions 特别行政区 tèbié xíngzhèngqū (Hong Kong, Macau)
--------------------------------------------------------------
34 total provincial-level divisions
</code></pre>
<h3>Terrain — the "three-step staircase" (三级阶梯 sān jí jiētī)</h3>
<ul>
<li><strong>Step 1 (highest):</strong> the <strong>Tibetan Plateau (青藏高原 Qīngzàng Gāoyuán)</strong>, average &gt;4,000m — "the roof of the world," home to Mount Everest/Qomolangma (<strong>珠穆朗玛峰 Zhūmùlǎngmǎ Fēng</strong>, 8,849m, on the Nepal border, the world's highest peak).</li>
<li><strong>Step 2 (middle):</strong> plateaus and basins, 1,000-2,000m (Loess Plateau, Sichuan Basin, Tarim Basin).</li>
<li><strong>Step 3 (lowest):</strong> plains and hills below 500m along the east coast — where most of the population and economic activity is concentrated.</li>
</ul>
<h3>Major rivers</h3>
<ul>
<li><strong>Yangtze River (长江 Cháng Jiāng)</strong> — about 6,300 km, the longest river in Asia, flows west to east through central China into the East China Sea near Shanghai.</li>
<li><strong>Yellow River (黄河 Huáng Hé)</strong> — considered the "cradle of Chinese civilization"; named for the yellow loess silt it carries.</li>
</ul>
<h3>Climate</h3>
<p>China is dominated by the <strong>monsoon (季风 jìfēng)</strong>: wet, hot summers and dry, cold winters over most of the east. Because the country spans such a huge latitude range, climate varies from tropical in the far south (Hainan) to subarctic in the northeast (Heilongjiang) and cold, arid highland in Tibet and Xinjiang.</p>
<div class="callout"><span class="badge">Key number</span> 9.6 million km² · 14 land-border neighbors · 34 provincial-level divisions · 56 minzu (covered in Chapter 2).</div>`,
    `<span class="eyebrow">CCS401 · Chương 1 · Bài 1.1</span>
<h2>Địa lý, lãnh thổ &amp; điều kiện tự nhiên (地理 dìlǐ)</h2>
<h3>Diện tích &amp; biên giới</h3>
<p>Trung Quốc rộng khoảng <strong>9,6 triệu km²</strong> — quốc gia lớn thứ 3 hoặc thứ 4 thế giới về diện tích, tuỳ cách tính vùng tranh chấp/ven biển. Nước này có chung biên giới đất liền với <strong>14 quốc gia</strong> (nhiều nhất thế giới, ngang với Nga), bao gồm Việt Nam, Lào, Myanmar, Ấn Độ, Nga, Mông Cổ, Triều Tiên, cùng đường bờ biển dài ra Thái Bình Dương.</p>
<h3>34 đơn vị hành chính cấp tỉnh (省级行政区 shěngjí xíngzhèngqū)</h3>
<pre><code>23 Tỉnh              省 shěng          (kể cả Đài Loan, tuyên bố chủ quyền, chưa quản lý)
5  Khu tự trị        自治区 zìzhìqū    (Quảng Tây, Nội Mông, Tây Tạng, Ninh Hạ, Tân Cương)
4  Thành phố trực thuộc TW 直辖市 zhíxiáshì (Bắc Kinh, Thượng Hải, Thiên Tân, Trùng Khánh)
2  Đặc khu hành chính 特别行政区 tèbié xíngzhèngqū (Hồng Kông, Ma Cao)
--------------------------------------------------------------
34 đơn vị hành chính cấp tỉnh
</code></pre>
<h3>Địa hình — "ba bậc thang" (三级阶梯 sān jí jiētī)</h3>
<ul>
<li><strong>Bậc 1 (cao nhất):</strong> <strong>cao nguyên Thanh Tạng (青藏高原 Qīngzàng Gāoyuán)</strong>, trung bình &gt;4.000m — "nóc nhà thế giới," nơi có đỉnh Everest/Qomolangma (<strong>珠穆朗玛峰 Zhūmùlǎngmǎ Fēng</strong>, 8.849m, trên biên giới Nepal, đỉnh cao nhất thế giới).</li>
<li><strong>Bậc 2 (giữa):</strong> cao nguyên và bồn địa, 1.000-2.000m (cao nguyên Hoàng Thổ, bồn địa Tứ Xuyên, bồn địa Tarim).</li>
<li><strong>Bậc 3 (thấp nhất):</strong> đồng bằng và đồi dưới 500m dọc bờ biển phía đông — nơi tập trung phần lớn dân số và hoạt động kinh tế.</li>
</ul>
<h3>Các sông lớn</h3>
<ul>
<li><strong>Trường Giang (长江 Cháng Jiāng)</strong> — khoảng 6.300km, sông dài nhất châu Á, chảy từ tây sang đông qua miền trung Trung Quốc ra biển Hoa Đông gần Thượng Hải.</li>
<li><strong>Hoàng Hà (黄河 Huáng Hé)</strong> — được coi là "cái nôi của văn minh Trung Hoa"; tên gọi từ phù sa hoàng thổ màu vàng mà sông mang theo.</li>
</ul>
<h3>Khí hậu</h3>
<p>Trung Quốc chịu ảnh hưởng chính của <strong>gió mùa (季风 jìfēng)</strong>: mùa hè ẩm nóng, mùa đông khô lạnh ở phần lớn miền đông. Vì trải dài trên vĩ độ rất rộng, khí hậu thay đổi từ nhiệt đới ở cực nam (Hải Nam) đến cận Bắc Cực ở đông bắc (Hắc Long Giang) và cao nguyên lạnh khô ở Tây Tạng, Tân Cương.</p>
<div class="callout"><span class="badge">Số liệu chính</span> 9,6 triệu km² · 14 nước láng giềng chung biên giới đất liền · 34 đơn vị hành chính cấp tỉnh · 56 dân tộc (học ở Chương 2).</div>`,
  ]]);

const c1q = quiz('ccs401-quiz-1', 'Quiz 1 — Geography & territory|||Quiz 1 — Địa lý & lãnh thổ', [
  { id: 'q1', question: 'Trung Quốc có bao nhiêu đơn vị hành chính cấp tỉnh (省级行政区)?', options: ['23', '31', '34', '56'], correctIndex: 2, explanation: '34 = 23 tỉnh (kể cả Đài Loan) + 5 khu tự trị + 4 thành phố trực thuộc TW + 2 đặc khu hành chính (Hồng Kông, Ma Cao).' },
  { id: 'q2', question: '"Nóc nhà thế giới," nơi có đỉnh Everest, là địa hình nào của Trung Quốc?', options: ['Đồng bằng Hoa Bắc', 'Cao nguyên Thanh Tạng (青藏高原)', 'Bồn địa Tứ Xuyên', 'Cao nguyên Hoàng Thổ'], correctIndex: 1, explanation: 'Cao nguyên Thanh Tạng là bậc thang cao nhất trong địa hình "ba bậc thang" của Trung Quốc, trung bình trên 4.000m.' },
  { id: 'q3', question: 'Trung Quốc có chung biên giới đất liền với bao nhiêu quốc gia?', options: ['5', '9', '14', '20'], correctIndex: 2, explanation: '14 nước láng giềng chung biên giới đất liền — nhiều nhất thế giới, ngang với Nga; trong đó có Việt Nam.' },
]);

const c2 = doc('ccs401-2-1-population', '2.1 — Population, ethnic groups & language|||2.1 — Dân số, dân tộc & ngôn ngữ',
  'Dân số ~1,41 tỷ (bắt đầu giảm từ 2022), chính sách dân số qua các thời kỳ, 56 dân tộc (56 民族) với người Hán ~91%, phổ thoại (普通话) và các nhóm phương ngữ lớn.',
  [[
    `<span class="eyebrow">CCS401 · Chapter 2 · Lesson 2.1</span>
<h2>Population, ethnic groups &amp; language</h2>
<h3>Population</h3>
<p>China's population is about <strong>1.41 billion</strong> (National Bureau of Statistics, early-2020s data) — for decades the world's most populous country, recently overtaken by India. Notably, China's population began <strong>declining</strong> starting in 2022, the first drop in six decades, driven by a falling birth rate and an aging population.</p>
<pre><code>Population policy timeline
1980-2015  One-child policy      (独生子女政策) — to slow rapid growth
2016       Two-child policy      (二孩政策)
2021-now   Three-child policy + support measures (三孩政策), still low birth rate
</code></pre>
<h3>56 ethnic groups (56 民族 mínzú)</h3>
<p>China officially recognizes <strong>56 ethnic groups (民族 mínzú)</strong>: the <strong>Han (汉族 Hànzú)</strong> make up roughly <strong>91%</strong> of the population, and 55 <strong>ethnic minorities (少数民族 shǎoshù mínzú)</strong> make up the rest — including Zhuang (壮族 Zhuàngzú, the largest minority), Hui (回族 Huízú), Manchu (满族 Mǎnzú), Uyghur (维吾尔族 Wéiwú'ěrzú), Miao (苗族 Miáozú) and Tibetan (藏族 Zàngzú). Many minorities are concentrated in the autonomous regions from Chapter 1 (Xinjiang, Tibet, Inner Mongolia, Guangxi, Ningxia).</p>
<h3>Language &amp; dialects (方言 fāngyán)</h3>
<p>The official national language is <strong>Standard Mandarin (普通话 Pǔtōnghuà)</strong>, standardized on the Beijing dialect's pronunciation and taught nationwide since the 1950s. But spoken Chinese has major regional dialect groups that are often mutually unintelligible:</p>
<ul>
<li><strong>Mandarin group (官话)</strong> — the base for 普通话, spoken across the north and southwest.</li>
<li><strong>Wu (吴语 Wúyǔ)</strong> — Shanghai and the Yangtze Delta.</li>
<li><strong>Yue / Cantonese (粤语 Yuèyǔ)</strong> — Guangdong, Hong Kong, Macau.</li>
<li><strong>Min (闽语 Mǐnyǔ)</strong> — Fujian, Taiwan.</li>
<li><strong>Hakka (客家话 Kèjiāhuà)</strong> — scattered communities across the south.</li>
</ul>
<p>Writing is unified across dialects: mainland China uses <strong>simplified characters (简体字 jiǎntǐzì)</strong>, while Taiwan, Hong Kong and Macau use <strong>traditional characters (繁体字 fántǐzì)</strong>.</p>
<div class="callout"><span class="badge">Why this matters for translators</span> A Cantonese speaker and a Mandarin speaker cannot understand each other's speech, but both read the same written characters (in simplified or traditional form) — this is why 普通话 proficiency, not just literacy, is what a Chinese-language graduate needs to certify.</div>`,
    `<span class="eyebrow">CCS401 · Chương 2 · Bài 2.1</span>
<h2>Dân số, dân tộc &amp; ngôn ngữ</h2>
<h3>Dân số</h3>
<p>Dân số Trung Quốc khoảng <strong>1,41 tỷ người</strong> (số liệu Cục Thống kê Quốc gia, đầu thập niên 2020) — trong nhiều thập kỷ là nước đông dân nhất thế giới, gần đây bị Ấn Độ vượt qua. Đáng chú ý, dân số Trung Quốc bắt đầu <strong>giảm</strong> từ năm 2022, lần giảm đầu tiên trong sáu thập kỷ, do tỷ lệ sinh giảm và dân số già hoá.</p>
<pre><code>Dòng thời gian chính sách dân số
1980-2015  Chính sách một con    (独生子女政策) — để hãm đà tăng dân số nhanh
2016       Chính sách hai con    (二孩政策)
2021-nay   Chính sách ba con + hỗ trợ (三孩政策), tỷ lệ sinh vẫn thấp
</code></pre>
<h3>56 dân tộc (56 民族 mínzú)</h3>
<p>Trung Quốc chính thức công nhận <strong>56 dân tộc (民族 mínzú)</strong>: người <strong>Hán (汉族 Hànzú)</strong> chiếm khoảng <strong>91%</strong> dân số, và 55 <strong>dân tộc thiểu số (少数民族 shǎoshù mínzú)</strong> chiếm phần còn lại — gồm Choang (壮族 Zhuàngzú, dân tộc thiểu số đông nhất), Hồi (回族 Huízú), Mãn (满族 Mǎnzú), Duy Ngô Nhĩ (维吾尔族 Wéiwú'ěrzú), Miêu (苗族 Miáozú) và Tạng (藏族 Zàngzú). Nhiều dân tộc thiểu số tập trung ở các khu tự trị đã học ở Chương 1 (Tân Cương, Tây Tạng, Nội Mông, Quảng Tây, Ninh Hạ).</p>
<h3>Ngôn ngữ &amp; phương ngữ (方言 fāngyán)</h3>
<p>Ngôn ngữ quốc gia chính thức là <strong>phổ thoại (普通话 Pǔtōnghuà)</strong>, chuẩn hoá theo cách phát âm tiếng Bắc Kinh và được dạy trên toàn quốc từ thập niên 1950. Nhưng tiếng Trung nói có các nhóm phương ngữ vùng miền lớn, thường không hiểu được lẫn nhau:</p>
<ul>
<li><strong>Nhóm Quan thoại (官话)</strong> — nền tảng của 普通话, nói khắp miền bắc và tây nam.</li>
<li><strong>Ngô ngữ (吴语 Wúyǔ)</strong> — Thượng Hải và đồng bằng Trường Giang.</li>
<li><strong>Việt ngữ / Quảng Đông (粤语 Yuèyǔ)</strong> — Quảng Đông, Hồng Kông, Ma Cao.</li>
<li><strong>Mân ngữ (闽语 Mǐnyǔ)</strong> — Phúc Kiến, Đài Loan.</li>
<li><strong>Khách Gia (客家话 Kèjiāhuà)</strong> — cộng đồng rải rác khắp miền nam.</li>
</ul>
<p>Chữ viết thống nhất giữa các phương ngữ: Trung Quốc đại lục dùng <strong>chữ giản thể (简体字 jiǎntǐzì)</strong>, còn Đài Loan, Hồng Kông, Ma Cao dùng <strong>chữ phồn thể (繁体字 fántǐzì)</strong>.</p>
<div class="callout"><span class="badge">Vì sao quan trọng với người dịch</span> Người nói tiếng Quảng Đông và người nói phổ thoại không hiểu lời nói của nhau, nhưng cả hai đọc cùng một hệ chữ viết (giản thể hoặc phồn thể) — đây là lý do trình độ 普通话, chứ không chỉ biết chữ, mới là thứ sinh viên ngành tiếng Trung cần đạt chuẩn.</div>`,
  ]]);

const c2q = quiz('ccs401-quiz-2', 'Quiz 2 — Population & language|||Quiz 2 — Dân số & ngôn ngữ', [
  { id: 'q1', question: 'Dân tộc nào chiếm khoảng 91% dân số Trung Quốc?', options: ['壮族 Zhuàngzú (Choang)', '汉族 Hànzú (Hán)', '藏族 Zàngzú (Tạng)', '回族 Huízú (Hồi)'], correctIndex: 1, explanation: 'Người Hán (汉族) chiếm khoảng 91% dân số; 55 dân tộc thiểu số còn lại chiếm phần nhỏ hơn.' },
  { id: 'q2', question: 'Điểm mốc nào đúng về dân số Trung Quốc gần đây?', options: ['Dân số tăng liên tục không ngừng', 'Dân số bắt đầu giảm từ năm 2022', 'Dân số chưa từng vượt 1 tỷ', 'Chính sách một con vẫn áp dụng đến nay'], correctIndex: 1, explanation: 'Dân số Trung Quốc bắt đầu giảm từ 2022 — lần giảm đầu tiên trong sáu thập kỷ. Chính sách một con (1980-2015) đã được thay bằng chính sách hai con rồi ba con.' },
  { id: 'q3', question: 'Vì sao người nói tiếng Quảng Đông (粤语) và phổ thoại (普通话) có thể không hiểu lời nói của nhau nhưng vẫn đọc chung văn bản?', options: ['Vì họ dùng chung một ngôn ngữ nói', 'Vì cả hai đều thuộc nhóm Quan thoại', 'Vì chữ viết (giản thể/phồn thể) thống nhất trong khi phát âm phương ngữ khác nhau', 'Vì tiếng Quảng Đông không có chữ viết riêng'], correctIndex: 2, explanation: 'Các phương ngữ Trung Quốc khác nhau nhiều về phát âm/nói, nhưng dùng chung hệ chữ Hán (giản thể ở đại lục, phồn thể ở Đài Loan/HK/Macau).' },
]);

const c3 = doc('ccs401-3-1-modern-history', '3.1 — History of the modern PRC|||3.1 — Lịch sử hình thành CHND Trung Hoa hiện đại',
  '1949 lập quốc, Đại nhảy vọt (大跃进), Cách mạng Văn hoá (文化大革命), cải cách mở cửa của Đặng Tiểu Bình 1978, thu hồi Hồng Kông/Ma Cao, thời kỳ Tập Cận Bình.',
  [[
    `<span class="eyebrow">CCS401 · Chapter 3 · Lesson 3.1</span>
<h2>History of the modern PRC</h2>
<h3>Founding, 1949</h3>
<p>On <strong>October 1, 1949 (建国 jiànguó, "founding of the nation")</strong>, Mao Zedong (毛泽东 Máo Zédōng) proclaimed the <strong>People's Republic of China</strong> from Tiananmen Gate in Beijing, ending decades of civil war. The competing Republic of China government relocated to Taiwan — the origin of the mainland-Taiwan political divide that continues today.</p>
<h3>Turbulent decades (1950s-1970s)</h3>
<pre><code>1958-1962  大跃进 Dà Yuèjìn — Great Leap Forward
           rapid, forced industrialization and collectivization; led to a
           severe famine with an estimated tens of millions of deaths.
1966-1976  文化大革命 Wénhuà Dà Gémìng — Cultural Revolution
           mass political mobilization, purges of officials and
           intellectuals, closure of schools; ended with Mao's death, 1976.
</code></pre>
<h3>Reform and opening-up (改革开放 gǎigé kāifàng), from 1978</h3>
<p>After Mao's death, <strong>Deng Xiaoping (邓小平 Dèng Xiǎopíng)</strong> rose to leadership and launched <strong>改革开放</strong> in 1978 — moving China from a rigid planned economy toward markets, foreign trade and investment, starting with rural land reform and the first Special Economic Zones (covered in Chapter 5). This is the single most consequential turning point in modern Chinese history, underlying everything from Chapter 5 onward.</p>
<h3>Later milestones</h3>
<ul>
<li><strong>1997</strong> — Hong Kong returns to Chinese sovereignty from the UK; <strong>1999</strong> — Macau returns from Portugal. Both governed under <strong>"one country, two systems" (一国两制 yī guó liǎng zhì)</strong>.</li>
<li><strong>2001</strong> — China joins the World Trade Organization (WTO), accelerating export-led growth.</li>
<li><strong>2012/2013 -&gt; present</strong> — <strong>Xi Jinping (习近平 Xí Jìnpíng)</strong> becomes General Secretary of the CPC and President, the current era of Chinese leadership.</li>
</ul>
<div class="callout"><span class="badge">One date to remember</span> 1978 (改革开放) is the hinge of modern Chinese history — everything about today's economy (Chapter 5) and global role (Chapter 8) traces back to that turn.</div>`,
    `<span class="eyebrow">CCS401 · Chương 3 · Bài 3.1</span>
<h2>Lịch sử hình thành CHND Trung Hoa hiện đại</h2>
<h3>Lập quốc, 1949</h3>
<p>Ngày <strong>1 tháng 10 năm 1949 (建国 jiànguó, "lập quốc")</strong>, Mao Trạch Đông (毛泽东 Máo Zédōng) tuyên bố thành lập <strong>nước Cộng hoà Nhân dân Trung Hoa</strong> tại Thiên An Môn, Bắc Kinh, kết thúc nhiều thập kỷ nội chiến. Chính quyền Trung Hoa Dân Quốc đối lập rút về Đài Loan — khởi nguồn cho chia rẽ chính trị đại lục-Đài Loan kéo dài đến nay.</p>
<h3>Những thập kỷ biến động (1950s-1970s)</h3>
<pre><code>1958-1962  大跃进 Dà Yuèjìn — Đại nhảy vọt
           công nghiệp hoá và tập thể hoá cưỡng bức, tốc độ nhanh; dẫn đến
           nạn đói nghiêm trọng, ước tính hàng chục triệu người thiệt mạng.
1966-1976  文化大革命 Wénhuà Dà Gémìng — Cách mạng Văn hoá
           vận động chính trị quy mô lớn, thanh trừng quan chức và trí thức,
           đóng cửa trường học; kết thúc khi Mao qua đời năm 1976.
</code></pre>
<h3>Cải cách mở cửa (改革开放 gǎigé kāifàng), từ 1978</h3>
<p>Sau khi Mao qua đời, <strong>Đặng Tiểu Bình (邓小平 Dèng Xiǎopíng)</strong> lên nắm quyền lãnh đạo và khởi động <strong>改革开放</strong> năm 1978 — đưa Trung Quốc từ nền kinh tế kế hoạch cứng nhắc sang thị trường, thương mại và đầu tư nước ngoài, bắt đầu bằng cải cách ruộng đất nông thôn và các Đặc khu kinh tế đầu tiên (học ở Chương 5). Đây là bước ngoặt quan trọng nhất trong lịch sử hiện đại Trung Quốc, là nền tảng cho mọi nội dung từ Chương 5 trở đi.</p>
<h3>Các mốc sau đó</h3>
<ul>
<li><strong>1997</strong> — Hồng Kông trở về chủ quyền Trung Quốc từ Anh; <strong>1999</strong> — Ma Cao trở về từ Bồ Đào Nha. Cả hai được quản lý theo <strong>"một nước hai chế độ" (一国两制 yī guó liǎng zhì)</strong>.</li>
<li><strong>2001</strong> — Trung Quốc gia nhập Tổ chức Thương mại Thế giới (WTO), thúc đẩy tăng trưởng dựa vào xuất khẩu.</li>
<li><strong>2012/2013 -&gt; nay</strong> — <strong>Tập Cận Bình (习近平 Xí Jìnpíng)</strong> trở thành Tổng Bí thư ĐCS Trung Quốc và Chủ tịch nước, thời kỳ lãnh đạo hiện tại của Trung Quốc.</li>
</ul>
<div class="callout"><span class="badge">Một mốc cần nhớ</span> 1978 (改革开放) là bản lề của lịch sử Trung Quốc hiện đại — mọi thứ về kinh tế hôm nay (Chương 5) và vai trò toàn cầu (Chương 8) đều bắt nguồn từ bước ngoặt đó.</div>`,
  ]]);

const c3q = quiz('ccs401-quiz-3', 'Quiz 3 — Modern history|||Quiz 3 — Lịch sử hiện đại', [
  { id: 'q1', question: 'Nước Cộng hoà Nhân dân Trung Hoa được thành lập vào ngày nào?', options: ['1/1/1949', '1/10/1949', '1/7/1949', '10/10/1949'], correctIndex: 1, explanation: 'Mao Trạch Đông tuyên bố thành lập CHND Trung Hoa ngày 1/10/1949 tại Thiên An Môn.' },
  { id: 'q2', question: '改革开放 (gǎigé kāifàng) do ai khởi xướng, bắt đầu từ năm nào?', options: ['Mao Trạch Đông, 1949', 'Đặng Tiểu Bình, 1978', 'Tập Cận Bình, 2012', 'Chu Ân Lai, 1966'], correctIndex: 1, explanation: 'Đặng Tiểu Bình khởi động cải cách mở cửa (改革开放) năm 1978, bước ngoặt đưa Trung Quốc sang kinh tế thị trường.' },
  { id: 'q3', question: 'Hồng Kông và Ma Cao được quản lý theo nguyên tắc nào sau khi trở về Trung Quốc?', options: ['Sáp nhập hoàn toàn vào hệ thống pháp luật đại lục', 'Một nước hai chế độ (一国两制)', 'Trở thành quốc gia độc lập', 'Do Liên Hợp Quốc quản lý'], correctIndex: 1, explanation: 'Hồng Kông (1997) và Ma Cao (1999) trở về Trung Quốc theo nguyên tắc "một nước hai chế độ" (一国两制), giữ hệ thống pháp luật và kinh tế riêng trong thời hạn nhất định.' },
]);

const c4 = doc('ccs401-4-1-political-system', '4.1 — Political system & administration|||4.1 — Thể chế chính trị & hệ thống hành chính',
  'Đảng Cộng sản Trung Quốc lãnh đạo, Đại hội Đại biểu Nhân dân toàn quốc, Chủ tịch nước, Quốc vụ viện, nguyên tắc tập trung dân chủ, 5 cấp hành chính từ trung ương đến xã.',
  [[
    `<span class="eyebrow">CCS401 · Chapter 4 · Lesson 4.1</span>
<h2>Political system &amp; administration (政治体制 zhèngzhì tǐzhì)</h2>
<h3>One-party leadership</h3>
<p>China is governed as a one-party socialist state under the <strong>Communist Party of China (中国共产党 Zhōngguó Gòngchǎndǎng, CPC)</strong>, founded 1921. The CPC's General Secretary is, by convention, also the state President and the head of the military commission — currently one person holds all three roles.</p>
<h3>State institutions</h3>
<ul>
<li><strong>National People's Congress (全国人民代表大会 Quánguó Rénmín Dàibiǎo Dàhuì, shortened 人大 Réndà)</strong> — the top legislative body, formally the highest organ of state power; meets annually, delegates elected indirectly through local congresses.</li>
<li><strong>President (国家主席 guójiā zhǔxí)</strong> — the head of state.</li>
<li><strong>State Council (国务院 Guówùyuàn)</strong>, headed by the <strong>Premier (总理 zǒnglǐ)</strong> — the chief executive/administrative body, roughly equivalent to a cabinet.</li>
</ul>
<h3>Guiding principle: democratic centralism (民主集中制)</h3>
<p><strong>民主集中制 mínzhǔ jízhōng zhì</strong> — decisions are debated within the Party, then once decided, all levels must follow them uniformly; this centralizes authority while formally retaining internal consultation.</p>
<h3>Five administrative levels</h3>
<pre><code>1. National       (中央 zhōngyāng)
2. Provincial     (省级 shěngjí)        — see Chapter 1's 34 divisions
3. Prefecture     (地级 dìjí)           — prefecture-level cities
4. County         (县级 xiànjí)         — counties / county-level cities/districts
5. Township       (乡镇级 xiāngzhènjí)  — towns and townships
</code></pre>
<div class="callout"><span class="badge">Special cases</span> Hong Kong and Macau (special administrative regions, Chapter 1) keep their own legal and economic systems under 一国两制 and are NOT part of this five-level mainland hierarchy.</div>`,
    `<span class="eyebrow">CCS401 · Chương 4 · Bài 4.1</span>
<h2>Thể chế chính trị &amp; hệ thống hành chính (政治体制 zhèngzhì tǐzhì)</h2>
<h3>Lãnh đạo một đảng</h3>
<p>Trung Quốc được điều hành như một nhà nước xã hội chủ nghĩa một đảng dưới sự lãnh đạo của <strong>Đảng Cộng sản Trung Quốc (中国共产党 Zhōngguó Gòngchǎndǎng, ĐCSTQ)</strong>, thành lập năm 1921. Theo thông lệ, Tổng Bí thư ĐCSTQ đồng thời là Chủ tịch nước và Chủ tịch Quân uỷ Trung ương — hiện nay một người nắm cả ba vị trí.</p>
<h3>Các cơ quan nhà nước</h3>
<ul>
<li><strong>Đại hội Đại biểu Nhân dân toàn quốc (全国人民代表大会 Quánguó Rénmín Dàibiǎo Dàhuì, gọi tắt 人大 Réndà)</strong> — cơ quan lập pháp cao nhất, về mặt hình thức là cơ quan quyền lực nhà nước cao nhất; họp thường niên, đại biểu được bầu gián tiếp qua các đại hội địa phương.</li>
<li><strong>Chủ tịch nước (国家主席 guójiā zhǔxí)</strong> — nguyên thủ quốc gia.</li>
<li><strong>Quốc vụ viện (国务院 Guówùyuàn)</strong>, đứng đầu bởi <strong>Thủ tướng (总理 zǒnglǐ)</strong> — cơ quan hành chính-điều hành cao nhất, tương đương nội các.</li>
</ul>
<h3>Nguyên tắc chỉ đạo: tập trung dân chủ (民主集中制)</h3>
<p><strong>民主集中制 mínzhǔ jízhōng zhì</strong> — các quyết định được thảo luận trong nội bộ Đảng, khi đã quyết thì mọi cấp phải tuân thủ thống nhất; nguyên tắc này tập trung quyền lực trong khi vẫn giữ hình thức tham vấn nội bộ.</p>
<h3>Năm cấp hành chính</h3>
<pre><code>1. Trung ương       (中央 zhōngyāng)
2. Cấp tỉnh         (省级 shěngjí)        — xem 34 đơn vị ở Chương 1
3. Cấp địa khu       (地级 dìjí)          — thành phố cấp địa khu
4. Cấp huyện         (县级 xiànjí)        — huyện / thành phố-quận cấp huyện
5. Cấp hương trấn    (乡镇级 xiāngzhènjí) — thị trấn và xã</code></pre>
<div class="callout"><span class="badge">Trường hợp đặc biệt</span> Hồng Kông và Ma Cao (đặc khu hành chính, Chương 1) giữ hệ thống pháp luật và kinh tế riêng theo 一国两制 và KHÔNG nằm trong hệ thống 5 cấp hành chính đại lục nói trên.</div>`,
  ]]);

const c4q = quiz('ccs401-quiz-4', 'Quiz 4 — Political system|||Quiz 4 — Thể chế chính trị', [
  { id: 'q1', question: 'Cơ quan nào là cơ quan lập pháp cao nhất của Trung Quốc?', options: ['Quốc vụ viện (国务院)', 'Đại hội Đại biểu Nhân dân toàn quốc (全国人民代表大会)', 'Toà án Nhân dân Tối cao', 'Chính hiệp'], correctIndex: 1, explanation: '全国人民代表大会 (人大) là cơ quan quyền lực nhà nước cao nhất và cơ quan lập pháp của Trung Quốc.' },
  { id: 'q2', question: 'Ai đứng đầu Quốc vụ viện (国务院)?', options: ['Chủ tịch nước (国家主席)', 'Tổng Bí thư', 'Thủ tướng (总理)', 'Chủ tịch Nhân đại'], correctIndex: 2, explanation: 'Quốc vụ viện — cơ quan hành chính cao nhất, tương đương nội các — do Thủ tướng (总理) đứng đầu.' },
  { id: 'q3', question: 'Nguyên tắc "tập trung dân chủ" (民主集中制) nghĩa là gì?', options: ['Mỗi địa phương tự quyết định riêng, không cần thống nhất', 'Thảo luận nội bộ trước khi quyết, sau khi quyết thì mọi cấp phải tuân thủ thống nhất', 'Bầu cử trực tiếp toàn dân cho mọi chức vụ', 'Không có cơ quan lập pháp'], correctIndex: 1, explanation: '民主集中制: tham vấn/thảo luận nội bộ Đảng, nhưng quyết định cuối cùng có tính bắt buộc thống nhất cho toàn hệ thống.' },
]);

const c5 = doc('ccs401-5-1-economy', '5.1 — Economy: reform, opening-up & development|||5.1 — Kinh tế: cải cách mở cửa & phát triển',
  'Từ kinh tế kế hoạch sang "kinh tế thị trường xã hội chủ nghĩa" (社会主义市场经济), đặc khu kinh tế (经济特区), WTO 2001, "công xưởng thế giới", Sáng kiến Vành đai - Con đường (一带一路), thách thức hiện nay.',
  [[
    `<span class="eyebrow">CCS401 · Chapter 5 · Lesson 5.1</span>
<h2>Economy: reform, opening-up &amp; development</h2>
<h3>From planned economy to "socialist market economy"</h3>
<p>Before 1978, China ran a Soviet-style <strong>planned economy</strong>: state-set production targets, collective farms, almost no private business. 改革开放 (Chapter 3) gradually introduced markets while the Party retained overall control — officially termed the <strong>"socialist market economy" (社会主义市场经济 shèhuìzhǔyì shìchǎng jīngjì)</strong> since the 1990s.</p>
<h3>Special Economic Zones (经济特区 jīngjì tèqū)</h3>
<p>Starting in 1980, Deng Xiaoping designated coastal cities as <strong>Special Economic Zones</strong> — testing grounds for foreign investment, tax incentives and market rules before they spread nationwide: <strong>Shenzhen, Zhuhai, Shantou, Xiamen</strong> (Hainan became a province-wide SEZ later). Shenzhen's transformation from a fishing town into a tech megacity (Chapter 7) is the emblematic success story.</p>
<h3>Growth &amp; global integration</h3>
<pre><code>2001   Joins WTO -&gt; export-led manufacturing boom, "world's factory"
2010s  Overtakes Japan to become world's 2nd-largest economy (by nominal GDP)
2013-  一带一路 Yīdài Yīlù — Belt and Road Initiative: infrastructure &amp;
       trade links across Asia, Africa, Europe (covered further in Ch. 8)
</code></pre>
<h3>Current challenges</h3>
<p>Despite decades of rapid growth, China now faces: an <strong>aging population</strong> (Chapter 2) shrinking the workforce, a <strong>property-sector debt crisis</strong>, high local-government debt, and the need to shift from investment/export-led growth toward domestic consumption and higher-value manufacturing (semiconductors, EVs, renewable energy).</p>
<div class="callout"><span class="badge">One phrase to know</span> 改革开放 (Ch.3) is the cause; 经济特区 and "world's factory" status are the mechanism; today's slower, more consumption-driven growth is the current chapter of the same story.</div>`,
    `<span class="eyebrow">CCS401 · Chương 5 · Bài 5.1</span>
<h2>Kinh tế: cải cách mở cửa &amp; phát triển</h2>
<h3>Từ kinh tế kế hoạch đến "kinh tế thị trường xã hội chủ nghĩa"</h3>
<p>Trước 1978, Trung Quốc vận hành <strong>kinh tế kế hoạch</strong> kiểu Xô Viết: chỉ tiêu sản xuất do nhà nước ấn định, nông trại tập thể, gần như không có doanh nghiệp tư nhân. 改革开放 (Chương 3) từng bước đưa thị trường vào trong khi Đảng vẫn giữ quyền kiểm soát tổng thể — được gọi chính thức là <strong>"kinh tế thị trường xã hội chủ nghĩa" (社会主义市场经济 shèhuìzhǔyì shìchǎng jīngjì)</strong> từ thập niên 1990.</p>
<h3>Đặc khu kinh tế (经济特区 jīngjì tèqū)</h3>
<p>Từ năm 1980, Đặng Tiểu Bình chỉ định các thành phố ven biển làm <strong>Đặc khu kinh tế</strong> — nơi thử nghiệm đầu tư nước ngoài, ưu đãi thuế và quy tắc thị trường trước khi nhân rộng toàn quốc: <strong>Thâm Quyến, Chu Hải, Sán Đầu, Hạ Môn</strong> (sau này Hải Nam trở thành đặc khu cấp tỉnh). Sự chuyển mình của Thâm Quyến từ làng chài thành siêu đô thị công nghệ (Chương 7) là câu chuyện thành công tiêu biểu.</p>
<h3>Tăng trưởng &amp; hội nhập toàn cầu</h3>
<pre><code>2001    Gia nhập WTO -&gt; bùng nổ sản xuất xuất khẩu, "công xưởng thế giới"
2010s   Vượt Nhật Bản, trở thành nền kinh tế lớn thứ 2 thế giới (theo GDP danh nghĩa)
2013-   一带一路 Yīdài Yīlù — Sáng kiến Vành đai và Con đường: kết nối hạ tầng
        &amp; thương mại khắp châu Á, châu Phi, châu Âu (học sâu hơn ở Chương 8)</code></pre>
<h3>Thách thức hiện nay</h3>
<p>Dù tăng trưởng nhanh suốt nhiều thập kỷ, Trung Quốc hiện đối mặt: <strong>dân số già hoá</strong> (Chương 2) làm co hẹp lực lượng lao động, <strong>khủng hoảng nợ ngành bất động sản</strong>, nợ chính quyền địa phương cao, và nhu cầu chuyển từ tăng trưởng dựa vào đầu tư/xuất khẩu sang tiêu dùng nội địa và sản xuất giá trị cao hơn (chip bán dẫn, xe điện, năng lượng tái tạo).</p>
<div class="callout"><span class="badge">Một cụm cần nhớ</span> 改革开放 (Chương 3) là nguyên nhân; 经济特区 và vị thế "công xưởng thế giới" là cơ chế; tăng trưởng chậm hơn, dựa vào tiêu dùng nhiều hơn hôm nay là chương hiện tại của cùng câu chuyện đó.</div>`,
  ]]);

const c5q = quiz('ccs401-quiz-5', 'Quiz 5 — Economy|||Quiz 5 — Kinh tế', [
  { id: 'q1', question: 'Mô hình kinh tế chính thức của Trung Quốc từ thập niên 1990 được gọi là gì?', options: ['Kinh tế kế hoạch tập trung tuyệt đối', 'Kinh tế thị trường xã hội chủ nghĩa (社会主义市场经济)', 'Kinh tế tư bản tự do hoàn toàn', 'Kinh tế hợp tác xã'], correctIndex: 1, explanation: '社会主义市场经济 là tên gọi chính thức: có thị trường nhưng Đảng vẫn giữ vai trò kiểm soát tổng thể.' },
  { id: 'q2', question: 'Thâm Quyến là ví dụ tiêu biểu cho điều gì?', options: ['Một khu tự trị dân tộc thiểu số', 'Thành công của mô hình Đặc khu kinh tế (经济特区)', 'Thủ đô chính trị của Trung Quốc', 'Vùng nông nghiệp trọng điểm'], correctIndex: 1, explanation: 'Thâm Quyến từ làng chài nhỏ trở thành siêu đô thị công nghệ nhờ được chọn làm Đặc khu kinh tế từ 1980.' },
  { id: 'q3', question: 'Sự kiện nào năm 2001 thúc đẩy mạnh xuất khẩu và vai trò "công xưởng thế giới" của Trung Quốc?', options: ['Ban hành chính sách một con', 'Gia nhập Tổ chức Thương mại Thế giới (WTO)', 'Thu hồi Hồng Kông', 'Khởi động 一带一路'], correctIndex: 1, explanation: 'Gia nhập WTO năm 2001 mở đường cho Trung Quốc hội nhập sâu vào thương mại toàn cầu, thúc đẩy sản xuất xuất khẩu.' },
]);

const c6 = doc('ccs401-6-1-education-tech-urbanization', '6.1 — Education, science/technology & urbanization|||6.1 — Giáo dục, khoa học công nghệ & đô thị hoá',
  'Cao khảo (高考), giáo dục bắt buộc 9 năm, "song nhất lưu" đại học trọng điểm, các tập đoàn công nghệ, chương trình vũ trụ, tỷ lệ đô thị hoá và hộ khẩu (户口).',
  [[
    `<span class="eyebrow">CCS401 · Chapter 6 · Lesson 6.1</span>
<h2>Education, science/technology &amp; urbanization</h2>
<h3>Education system</h3>
<p>China mandates <strong>9 years of compulsory education</strong> (primary + junior secondary). At the end of senior secondary school, students take the <strong>Gaokao (高考 Gāokǎo)</strong> — the notoriously high-stakes, multi-day National College Entrance Examination that largely determines which university a student can attend, taken by over 10 million students each year.</p>
<p>Top universities are ranked under the <strong>"Double First Class" initiative (双一流 shuāng yīliú)</strong>, which replaced the earlier Project 985 / Project 211 elite-university programs — flagship institutions include Tsinghua and Peking University.</p>
<h3>Science &amp; technology</h3>
<p>China has become a global technology power, home to giants such as <strong>Huawei</strong> (telecom/5G), <strong>Tencent</strong> and <strong>Alibaba</strong> (internet platforms), and <strong>BYD</strong> (electric vehicles). State-driven R&amp;D investment is heavy, and China runs an independent space program — the <strong>Shenzhou (神舟 Shénzhōu)</strong> crewed missions and the <strong>Chang'e (嫦娥 Cháng'é)</strong> lunar exploration program (named for the moon goddess of Chinese mythology).</p>
<h3>Urbanization &amp; the hukou system</h3>
<p>China's urbanization rate has risen from under 20% in 1978 to roughly <strong>65%</strong> today, driven by mass rural-to-urban migration. Where a citizen can access local schooling, healthcare and social benefits is still shaped by the <strong>household registration system (户口 hùkǒu)</strong>, tied to one's place of birth — migrant workers in big cities often cannot access the same public services as local hukou holders, a long-standing social-policy issue.</p>
<div class="callout"><span class="badge">One system, one number</span> 高考 gates entry to 双一流 universities; hukou gates access to city services — both are single administrative mechanisms with outsized effects on hundreds of millions of lives.</div>`,
    `<span class="eyebrow">CCS401 · Chương 6 · Bài 6.1</span>
<h2>Giáo dục, khoa học công nghệ &amp; đô thị hoá</h2>
<h3>Hệ thống giáo dục</h3>
<p>Trung Quốc bắt buộc <strong>9 năm giáo dục</strong> (tiểu học + trung học cơ sở). Cuối trung học phổ thông, học sinh dự <strong>Cao khảo (高考 Gāokǎo)</strong> — kỳ thi tuyển sinh đại học quốc gia nổi tiếng khắc nghiệt, kéo dài nhiều ngày, gần như quyết định trường đại học học sinh có thể vào, với hơn 10 triệu thí sinh dự thi mỗi năm.</p>
<p>Các đại học hàng đầu được xếp trong sáng kiến <strong>"Song nhất lưu" (双一流 shuāng yīliú)</strong>, thay thế các chương trình đại học trọng điểm trước đây (Dự án 985 / Dự án 211) — các trường tiêu biểu gồm Thanh Hoa và Đại học Bắc Kinh.</p>
<h3>Khoa học &amp; công nghệ</h3>
<p>Trung Quốc đã trở thành cường quốc công nghệ toàn cầu, là nơi có các tập đoàn lớn như <strong>Huawei</strong> (viễn thông/5G), <strong>Tencent</strong> và <strong>Alibaba</strong> (nền tảng internet), và <strong>BYD</strong> (xe điện). Đầu tư R&amp;D do nhà nước dẫn dắt rất lớn, và Trung Quốc vận hành chương trình vũ trụ độc lập — các sứ mệnh có người lái <strong>Thần Châu (神舟 Shénzhōu)</strong> và chương trình thám hiểm Mặt Trăng <strong>Hằng Nga (嫦娥 Cháng'é)</strong> (đặt theo tên nữ thần Mặt Trăng trong thần thoại Trung Hoa).</p>
<h3>Đô thị hoá &amp; hệ thống hộ khẩu</h3>
<p>Tỷ lệ đô thị hoá của Trung Quốc tăng từ dưới 20% năm 1978 lên khoảng <strong>65%</strong> hiện nay, nhờ làn sóng di cư nông thôn ra thành thị quy mô lớn. Việc một công dân có được tiếp cận trường học, y tế và phúc lợi xã hội tại địa phương hay không vẫn phụ thuộc vào <strong>hệ thống hộ khẩu (户口 hùkǒu)</strong>, gắn với nơi sinh — lao động nhập cư ở các thành phố lớn thường không được hưởng dịch vụ công như người có hộ khẩu tại chỗ, một vấn đề chính sách xã hội tồn tại lâu dài.</p>
<div class="callout"><span class="badge">Một hệ thống, một con số</span> 高考 quyết định cửa vào đại học 双一流; hộ khẩu quyết định cửa vào dịch vụ thành phố — cả hai đều là cơ chế hành chính đơn lẻ nhưng ảnh hưởng tới hàng trăm triệu cuộc đời.</div>`,
  ]]);

const c6q = quiz('ccs401-quiz-6', 'Quiz 6 — Education, tech & urbanization|||Quiz 6 — Giáo dục, công nghệ & đô thị hoá', [
  { id: 'q1', question: '高考 (Gāokǎo) là gì?', options: ['Kỳ thi tốt nghiệp tiểu học', 'Kỳ thi tuyển sinh đại học quốc gia', 'Kỳ thi tuyển công chức', 'Kỳ thi tiếng Trung quốc tế (HSK)'], correctIndex: 1, explanation: '高考 là kỳ thi tuyển sinh đại học quốc gia, quyết định phần lớn khả năng vào đại học của học sinh Trung Quốc.' },
  { id: 'q2', question: 'Hệ thống nào quyết định quyền tiếp cận trường học/y tế theo nơi đăng ký cư trú?', options: ['双一流 (Song nhất lưu)', '户口 hùkǒu (hộ khẩu)', '经济特区 (Đặc khu kinh tế)', '一国两制'], correctIndex: 1, explanation: 'Hệ thống hộ khẩu (户口) gắn phúc lợi công (trường học, y tế) với nơi đăng ký cư trú gốc, ảnh hưởng đến lao động di cư.' },
  { id: 'q3', question: 'Chương trình thám hiểm Mặt Trăng của Trung Quốc mang tên gì?', options: ['神舟 Shénzhōu', '嫦娥 Cháng\'é', '天宫 Tiāngōng', '北斗 Běidǒu'], correctIndex: 1, explanation: '嫦娥 (Hằng Nga) là chương trình thám hiểm Mặt Trăng, đặt theo tên nữ thần Mặt Trăng; 神舟 là chương trình tàu vũ trụ có người lái.' },
]);

const c7 = doc('ccs401-7-1-major-regions-cities', '7.1 — Major regions, cities (北上广深) & special zones|||7.1 — Các vùng, thành phố lớn (北上广深) & đặc khu',
  'Bắc Kinh - Thượng Hải - Quảng Châu - Thâm Quyến (北上广深), Vùng Vịnh Lớn Quảng Đông-Hồng Kông-Ma Cao, đồng bằng Trường Giang, chiến lược phát triển miền Tây, Hải Nam.',
  [[
    `<span class="eyebrow">CCS401 · Chapter 7 · Lesson 7.1</span>
<h2>Major regions, cities (北上广深) &amp; special zones</h2>
<h3>北上广深 (Běi Shàng Guǎng Shēn) — the four "Tier-1 cities" (一线城市)</h3>
<ul>
<li><strong>Beijing (北京 Běijīng)</strong> — the political and cultural capital; seat of the central government (Chapter 4) and home to top universities (Chapter 6).</li>
<li><strong>Shanghai (上海 Shànghǎi)</strong> — China's financial and commercial center; the Pudong (浦东) district's skyline symbolizes post-1990s development.</li>
<li><strong>Guangzhou (广州 Guǎngzhōu)</strong> — the historic trade hub of the Pearl River Delta, home to the biannual Canton Fair (中国进出口商品交易会), China's largest trade fair.</li>
<li><strong>Shenzhen (深圳 Shēnzhèn)</strong> — from Special Economic Zone (Chapter 5) to a global technology hub, headquarters to Huawei and Tencent (Chapter 6).</li>
</ul>
<h3>Regional clusters</h3>
<ul>
<li><strong>Greater Bay Area (粤港澳大湾区 Yuè Gǎng Ào Dàwānqū)</strong> — an integrated economic region linking Guangdong province with Hong Kong and Macau, positioned as a rival to Tokyo Bay/Silicon Valley in scale.</li>
<li><strong>Yangtze River Delta (长三角 Cháng Sānjiǎo)</strong> — the Shanghai-centered economic region along the lower Yangtze (Chapter 1), China's most productive manufacturing and finance cluster.</li>
</ul>
<h3>Development beyond the coast</h3>
<p>Because early reform (Chapter 5) concentrated growth on the east coast, the government launched the <strong>Western Development Strategy (西部大开发 Xībù Dà Kāifā)</strong> to invest in inland/western provinces and reduce the coast-interior gap. <strong>Hainan (海南)</strong>, an island province (Chapter 1), was designated a province-wide free trade port to extend the SEZ model.</p>
<div class="callout"><span class="badge">Memory hook</span> 北上广深 = the four cities every business/language student should recognize instantly; each one embodies a different theme from this course (politics, finance, trade, tech).</div>`,
    `<span class="eyebrow">CCS401 · Chương 7 · Bài 7.1</span>
<h2>Các vùng, thành phố lớn (北上广深) &amp; đặc khu</h2>
<h3>北上广深 (Běi Shàng Guǎng Shēn) — bốn thành phố "cấp một" (一线城市)</h3>
<ul>
<li><strong>Bắc Kinh (北京 Běijīng)</strong> — thủ đô chính trị và văn hoá; nơi đặt chính quyền trung ương (Chương 4) và các đại học hàng đầu (Chương 6).</li>
<li><strong>Thượng Hải (上海 Shànghǎi)</strong> — trung tâm tài chính và thương mại của Trung Quốc; đường chân trời khu Phố Đông (浦东) là biểu tượng phát triển từ sau thập niên 1990.</li>
<li><strong>Quảng Châu (广州 Guǎngzhōu)</strong> — trung tâm thương mại lịch sử của đồng bằng Châu Giang, nơi tổ chức Hội chợ Quảng Châu (中国进出口商品交易会) hai lần mỗi năm, hội chợ thương mại lớn nhất Trung Quốc.</li>
<li><strong>Thâm Quyến (深圳 Shēnzhèn)</strong> — từ Đặc khu kinh tế (Chương 5) trở thành trung tâm công nghệ toàn cầu, trụ sở của Huawei và Tencent (Chương 6).</li>
</ul>
<h3>Các cụm vùng</h3>
<ul>
<li><strong>Vùng Vịnh Lớn (粤港澳大湾区 Yuè Gǎng Ào Dàwānqū)</strong> — vùng kinh tế tích hợp nối tỉnh Quảng Đông với Hồng Kông và Ma Cao, được định vị để cạnh tranh quy mô với vịnh Tokyo/Thung lũng Silicon.</li>
<li><strong>Đồng bằng Trường Giang (长三角 Cháng Sānjiǎo)</strong> — vùng kinh tế lấy Thượng Hải làm trung tâm dọc hạ lưu Trường Giang (Chương 1), cụm sản xuất và tài chính năng suất nhất Trung Quốc.</li>
</ul>
<h3>Phát triển ngoài vùng ven biển</h3>
<p>Vì cải cách ban đầu (Chương 5) tập trung tăng trưởng ở miền đông ven biển, chính phủ đã khởi động <strong>Chiến lược Phát triển miền Tây (西部大开发 Xībù Dà Kāifā)</strong> để đầu tư vào các tỉnh nội địa/miền tây, giảm khoảng cách ven biển-nội địa. <strong>Hải Nam (海南)</strong>, tỉnh đảo (Chương 1), được chỉ định làm cảng tự do thương mại cấp tỉnh, mở rộng mô hình đặc khu.</p>
<div class="callout"><span class="badge">Mẹo ghi nhớ</span> 北上广深 = bốn thành phố mà sinh viên ngành kinh doanh/ngôn ngữ nào cũng cần nhận ra ngay; mỗi thành phố tiêu biểu cho một chủ đề khác nhau của môn học (chính trị, tài chính, thương mại, công nghệ).</div>`,
  ]]);

const c7q = quiz('ccs401-quiz-7', 'Quiz 7 — Major regions & cities|||Quiz 7 — Vùng & thành phố lớn', [
  { id: 'q1', question: '北上广深 là viết tắt của bốn thành phố nào?', options: ['Bắc Kinh, Thượng Hải, Quảng Châu, Thâm Quyến', 'Bắc Kinh, Nam Kinh, Quảng Châu, Thành Đô', 'Thượng Hải, Hàng Châu, Nam Kinh, Tô Châu', 'Quảng Châu, Thâm Quyến, Hạ Môn, Chu Hải'], correctIndex: 0, explanation: '北上广深 = Bắc Kinh, Thượng Hải, Quảng Châu, Thâm Quyến — bốn thành phố "cấp một" của Trung Quốc.' },
  { id: 'q2', question: 'Thành phố nào là trụ sở của Huawei và Tencent, từng là một Đặc khu kinh tế?', options: ['Bắc Kinh', 'Thượng Hải', 'Thâm Quyến', 'Quảng Châu'], correctIndex: 2, explanation: 'Thâm Quyến chuyển mình từ Đặc khu kinh tế (Chương 5) thành trung tâm công nghệ toàn cầu.' },
  { id: 'q3', question: 'Vùng Vịnh Lớn (粤港澳大湾区) kết nối những khu vực nào?', options: ['Bắc Kinh - Thiên Tân - Hà Bắc', 'Tỉnh Quảng Đông - Hồng Kông - Ma Cao', 'Tứ Xuyên - Trùng Khánh', 'Sơn Đông - Giang Tô'], correctIndex: 1, explanation: '粤港澳大湾区 (Vùng Vịnh Lớn) tích hợp tỉnh Quảng Đông với hai đặc khu hành chính Hồng Kông và Ma Cao.' },
]);

const c8 = doc('ccs401-8-1-international-relations', '8.1 — International relations, China-Vietnam & China today|||8.1 — Quan hệ quốc tế, Trung-Việt & Trung Quốc hôm nay',
  'Uỷ viên thường trực Hội đồng Bảo an LHQ, 一带一路, BRICS/SCO, quan hệ Trung-Việt (bình thường hoá 1991, "16 chữ vàng"), tranh chấp Biển Đông, quan hệ Trung-Mỹ.',
  [[
    `<span class="eyebrow">CCS401 · Chapter 8 · Lesson 8.1</span>
<h2>International relations, China-Vietnam &amp; China today</h2>
<h3>China's global standing</h3>
<p>China is one of the five <strong>permanent members of the UN Security Council</strong> (with veto power), alongside the US, UK, France and Russia. It is a founding force behind newer multilateral groupings — <strong>BRICS</strong> (Brazil, Russia, India, China, South Africa, plus newer members) and the <strong>Shanghai Cooperation Organisation (SCO)</strong> — and promotes its <strong>Belt and Road Initiative (一带一路, Chapter 5)</strong> as infrastructure diplomacy across dozens of countries.</p>
<h3>China-Vietnam relations</h3>
<p>China and Vietnam established diplomatic relations in 1950. Relations were severely strained by the 1979 border conflict, then <strong>normalized in 1991</strong>. Since then, official rhetoric describes ties using the <strong>"16-character guideline" (十六字方针 shíliù zì fāngzhēn)</strong>: <em>长期稳定 (long-term stability), 面向未来 (future-oriented), 睦邻友好 (good-neighborliness and friendship), 全面合作 (comprehensive cooperation)</em>. The two countries maintain a <strong>Comprehensive Strategic Cooperative Partnership</strong>, and China is one of Vietnam's largest trading partners.</p>
<p>An unresolved point of friction is the competing claims in the <strong>South China Sea (南海 Nánhǎi; Biển Đông in Vietnamese)</strong>, which both countries — along with several Southeast Asian neighbors — dispute. This course presents the issue factually as an ongoing, unresolved territorial dispute rather than taking a position for either side.</p>
<h3>China in the contemporary world</h3>
<p>Alongside cooperation, China's relationship with the United States is defined by both deep economic interdependence and strategic competition — over trade, technology (e.g. semiconductors) and regional influence in the Indo-Pacific. China frequently frames its foreign policy around building a <strong>"community with a shared future for mankind" (人类命运共同体 rénlèi mìngyùn gòngtóngtǐ)</strong>.</p>
<div class="callout"><span class="badge">Course closing thread</span> From geography (Ch.1) through economy (Ch.5) to today's diplomacy (Ch.8), country studies asks one question throughout: how does this country actually work, in fact — not folklore, not slogans.</div>`,
    `<span class="eyebrow">CCS401 · Chương 8 · Bài 8.1</span>
<h2>Quan hệ quốc tế, Trung-Việt &amp; Trung Quốc hôm nay</h2>
<h3>Vị thế toàn cầu của Trung Quốc</h3>
<p>Trung Quốc là một trong năm <strong>Uỷ viên thường trực Hội đồng Bảo an Liên Hợp Quốc</strong> (có quyền phủ quyết), cùng với Mỹ, Anh, Pháp và Nga. Trung Quốc là lực lượng sáng lập các nhóm đa phương mới hơn — <strong>BRICS</strong> (Brazil, Nga, Ấn Độ, Trung Quốc, Nam Phi, cùng các thành viên mới) và <strong>Tổ chức Hợp tác Thượng Hải (SCO)</strong> — và thúc đẩy <strong>Sáng kiến Vành đai và Con đường (一带一路, Chương 5)</strong> như một hình thức ngoại giao hạ tầng trải rộng hàng chục quốc gia.</p>
<h3>Quan hệ Trung-Việt</h3>
<p>Trung Quốc và Việt Nam thiết lập quan hệ ngoại giao năm 1950. Quan hệ căng thẳng nghiêm trọng do xung đột biên giới năm 1979, sau đó <strong>bình thường hoá năm 1991</strong>. Từ đó, ngôn ngữ ngoại giao chính thức mô tả quan hệ hai nước bằng <strong>"phương châm 16 chữ" (十六字方针 shíliù zì fāngzhēn)</strong>: <em>长期稳定 (ổn định lâu dài), 面向未来 (hướng tới tương lai), 睦邻友好 (láng giềng hữu nghị), 全面合作 (hợp tác toàn diện)</em>. Hai nước duy trì <strong>quan hệ Đối tác Hợp tác Chiến lược Toàn diện</strong>, và Trung Quốc là một trong những đối tác thương mại lớn nhất của Việt Nam.</p>
<p>Một điểm còn chưa giải quyết là các tuyên bố chủ quyền chồng lấn tại <strong>Biển Đông (南海 Nánhǎi)</strong>, mà cả hai nước — cùng một số nước Đông Nam Á khác — đều có tranh chấp. Môn học trình bày vấn đề này một cách trung thực, như một tranh chấp lãnh thổ đang tiếp diễn, chưa có kết luận, chứ không đứng về phía nào.</p>
<h3>Trung Quốc trong thế giới đương đại</h3>
<p>Bên cạnh hợp tác, quan hệ Trung Quốc - Hoa Kỳ vừa mang tính phụ thuộc lẫn nhau sâu sắc về kinh tế, vừa mang tính cạnh tranh chiến lược — về thương mại, công nghệ (ví dụ chip bán dẫn) và ảnh hưởng khu vực Ấn Độ Dương - Thái Bình Dương. Trung Quốc thường xây dựng chính sách đối ngoại xoay quanh khái niệm <strong>"cộng đồng chung vận mệnh của nhân loại" (人类命运共同体 rénlèi mìngyùn gòngtóngtǐ)</strong>.</p>
<div class="callout"><span class="badge">Mạch xuyên suốt môn học</span> Từ địa lý (Chương 1) qua kinh tế (Chương 5) đến ngoại giao hôm nay (Chương 8), đất nước học luôn hỏi một câu: đất nước này thực sự vận hành thế nào trên thực tế — không phải truyền thuyết, không phải khẩu hiệu.</div>`,
  ]]);

const c8q = quiz('ccs401-quiz-8', 'Quiz 8 — International relations & China-Vietnam|||Quiz 8 — Quan hệ quốc tế & Trung-Việt', [
  { id: 'q1', question: 'Trung Quốc và Việt Nam bình thường hoá quan hệ ngoại giao vào năm nào?', options: ['1950', '1979', '1991', '2001'], correctIndex: 2, explanation: 'Quan hệ Trung-Việt được bình thường hoá năm 1991, sau giai đoạn căng thẳng từ xung đột biên giới 1979.' },
  { id: 'q2', question: '"Phương châm 16 chữ" (十六字方针) mô tả điều gì?', options: ['Chương trình cải cách kinh tế nội địa Trung Quốc', 'Nguyên tắc chỉ đạo quan hệ Trung-Việt (ổn định lâu dài, hướng tới tương lai, láng giềng hữu nghị, hợp tác toàn diện)', 'Danh sách 16 tỉnh miền Tây Trung Quốc', 'Tên gọi cũ của Sáng kiến Vành đai và Con đường'], correctIndex: 1, explanation: '十六字方针 là phương châm ngoại giao chính thức mô tả quan hệ Trung-Việt: 长期稳定、面向未来、睦邻友好、全面合作.' },
  { id: 'q3', question: 'Trung Quốc có vị trí gì trong Hội đồng Bảo an Liên Hợp Quốc?', options: ['Thành viên không thường trực, luân phiên', 'Một trong năm Uỷ viên thường trực có quyền phủ quyết', 'Không phải thành viên', 'Chỉ có vai trò quan sát viên'], correctIndex: 1, explanation: 'Trung Quốc là một trong năm Uỷ viên thường trực Hội đồng Bảo an LHQ (cùng Mỹ, Anh, Pháp, Nga), có quyền phủ quyết.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CCS401',
    slug: 'ccs401-chinese-country-studies',
    title: 'Chinese Country Studies',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CCS401.webp',
    shortDescription: 'China country studies: geography, population & ethnic groups, PRC history, political system, reform-era economy, education/tech/urbanization, major cities, China-Vietnam & world relations. Chinese terms with pinyin & quizzes.|||Đất nước học Trung Quốc: địa lý, dân số & dân tộc, lịch sử CHND Trung Hoa, thể chế chính trị, kinh tế cải cách, giáo dục/công nghệ/đô thị hoá, thành phố lớn, quan hệ Trung-Việt & thế giới. Thuật ngữ Hán kèm pinyin & quiz.',
    description: 'Môn <strong>CCS401 — Chinese Country Studies</strong> (Đất nước học Trung Quốc, kỳ 5, ngành Ngôn ngữ Trung) khác CHC401 (văn hoá truyền thống) và CCB401 (kinh doanh) — môn này trình bày bức tranh thực tế, đương đại về Trung Quốc: <strong>địa lý &amp; lãnh thổ</strong> → <strong>dân số, dân tộc &amp; ngôn ngữ</strong> → <strong>lịch sử CHND Trung Hoa hiện đại</strong> → <strong>thể chế chính trị</strong> → <strong>kinh tế cải cách mở cửa</strong> → <strong>giáo dục, khoa học công nghệ &amp; đô thị hoá</strong> → <strong>các vùng, thành phố lớn</strong> → <strong>quan hệ quốc tế &amp; Trung-Việt</strong>. Song ngữ Anh-Việt, mỗi chương kèm thuật ngữ và địa danh tiếng Trung (chữ Hán + pinyin có dấu thanh), bảng số liệu và quiz.',
    whatYouLearn: '34 đơn vị hành chính cấp tỉnh, địa hình "ba bậc thang", sông Trường Giang/Hoàng Hà; dân số ~1,41 tỷ và xu hướng già hoá, 56 dân tộc, phổ thoại &amp; các nhóm phương ngữ; các mốc lịch sử CHND Trung Hoa từ 1949 đến cải cách mở cửa 1978; hệ thống chính trị một đảng, Nhân đại, Quốc vụ viện, 5 cấp hành chính; đặc khu kinh tế, WTO, 一带一路, thách thức kinh tế hiện nay; cao khảo, đại học 双一流, tập đoàn công nghệ, đô thị hoá &amp; hộ khẩu; 北上广深 và Vùng Vịnh Lớn; vị thế quốc tế của Trung Quốc và quan hệ Trung-Việt.',
    requirements: 'Đã học tiếng Trung cơ bản (đọc được pinyin và một số Hán tự thông dụng). Không cần kiến thức lịch sử hay chính trị trước đó.',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Ba nguồn tham khảo chính + tài liệu miễn phí, hợp pháp.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Đất nước học khác văn hoá học & kinh doanh thế nào; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Địa lý, lãnh thổ & điều kiện tự nhiên|||Chapter 1 — Geography & territory', description: '9,6 triệu km², 14 nước láng giềng, 34 đơn vị hành chính cấp tỉnh, "ba bậc thang" địa hình.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Dân số, dân tộc & ngôn ngữ|||Chapter 2 — Population, ethnicity & language', description: '~1,41 tỷ dân, 56 dân tộc, phổ thoại & các nhóm phương ngữ lớn.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Lịch sử CHND Trung Hoa hiện đại|||Chapter 3 — History of the modern PRC', description: '1949 lập quốc, Đại nhảy vọt, Cách mạng Văn hoá, cải cách mở cửa 1978.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thể chế chính trị & hành chính|||Chapter 4 — Political system & administration', description: 'ĐCS Trung Quốc, Nhân đại, Quốc vụ viện, 5 cấp hành chính.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kinh tế: cải cách mở cửa & phát triển|||Chapter 5 — Economy: reform & development', description: 'Đặc khu kinh tế, WTO 2001, 一带一路, thách thức hiện nay.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Giáo dục, KHCN & đô thị hoá|||Chapter 6 — Education, tech & urbanization', description: 'Cao khảo, đại học 双一流, tập đoàn công nghệ, hộ khẩu.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Vùng, thành phố lớn (北上广深) & đặc khu|||Chapter 7 — Major regions, cities & special zones', description: 'Bắc Kinh-Thượng Hải-Quảng Châu-Thâm Quyến, Vùng Vịnh Lớn.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quan hệ quốc tế & Trung-Việt|||Chapter 8 — International relations & China-Vietnam', description: 'Vai trò toàn cầu, quan hệ Trung-Việt, Trung Quốc đương đại.', lessons: [c8, c8q] },
  ],
};
