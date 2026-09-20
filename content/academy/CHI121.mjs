/**
 * CHI121 — Integrated Chinese 2 (Tiếng Trung tổng hợp 2). Khối Ngôn ngữ Trung
 * FPTU. NỐI TIẾP CHI111. Đây là MÔN NGÔN NGỮ: cấu trúc theo BÀI HỌC TIẾNG (từ
 * vựng, ngữ pháp, hội thoại, luyện tập) theo track "Integrated Chinese", bám
 * nửa sau Level 1 Part 1 sang đầu Level 1 Part 2 (Liu et al., Cheng &amp; Tsui) —
 * mức tương đương HSK2. Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick lồng/${; trong HTML content "&" → "&amp;". shortDescription
 * dùng "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chi121-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình học',
  'Giáo trình chuẩn (Integrated Chinese L1P1 nửa sau → L1P2, Liu et al.), workbook & character workbook, app (Pleco/Anki), từ điển hanzii.net, YouTube, lộ trình 4 bước. Nhắc lại nền tảng CHI111.',
  [[
    `<span class="eyebrow">CHI121 · Materials</span>
<h2>How to keep learning Chinese — materials &amp; roadmap</h2>
<p class="lead">Integrated Chinese 2 <strong>continues CHI111</strong> on the <strong>Integrated Chinese</strong> track: it assumes you already know pinyin, the 4 tones and the first everyday topics, and moves on to shopping, transport, weather, dining, visiting, appointments, directions and parties — at roughly <strong>HSK2</strong> level. Below are the standard textbook plus free tools.</p>
<h3>📘 Standard textbook</h3>
<ul>
<li><strong>Integrated Chinese, Level 1 Part 1</strong> (later lessons) <strong>and Part 2</strong> (Yuehua Liu, Tao-chung Yao et al. — Cheng &amp; Tsui) — the mainstream university coursebook this track continues from.</li>
<li><strong>Integrated Chinese Workbook &amp; Character Workbook</strong> — drills for listening, speaking and stroke-order writing.</li>
</ul>
<h3>📱 Apps &amp; dictionaries</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — the standard Chinese dictionary app (handwriting &amp; audio).</li>
<li><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a> — spaced-repetition flashcards for hanzi &amp; vocab.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — Chinese to Vietnamese dictionary with stroke order.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — structured lessons that match this course order.</li>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — real dialogues with subtitles.</li>
</ul>
<div class="callout"><span class="badge">4-step path</span>
<ol>
<li><strong>Review CHI111</strong> — make sure the 4 tones, numbers, dates and 是/有/都 are solid before you start.</li>
<li><strong>Vocabulary</strong> — learn hanzi in context, review daily with Anki/Pleco.</li>
<li><strong>Grammar</strong> — new patterns build on old word order (Subject then Verb then Object).</li>
<li><strong>Speaking</strong> — say every sentence out loud; shadow the audio.</li>
</ol></div>`,
    `<span class="eyebrow">CHI121 · Tài liệu</span>
<h2>Học tiếp tiếng Trung — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung tổng hợp 2 <strong>nối tiếp CHI111</strong> trên track <strong>Integrated Chinese</strong>: giả định bạn đã nắm pinyin, 4 thanh và các chủ đề hằng ngày đầu tiên, rồi đi tiếp sang mua sắm, giao thông, thời tiết, ăn uống, thăm hỏi, hẹn gặp, chỉ đường và tiệc tùng — ở mức tương đương <strong>HSK2</strong>. Bên dưới là giáo trình chuẩn cùng công cụ miễn phí.</p>
<h3>📘 Giáo trình chuẩn</h3>
<ul>
<li><strong>Integrated Chinese, Level 1 Part 1</strong> (các bài sau) <strong>và Part 2</strong> (Yuehua Liu, Tao-chung Yao và cộng sự — NXB Cheng &amp; Tsui) — giáo trình đại học mà track này học tiếp.</li>
<li><strong>Integrated Chinese Workbook &amp; Character Workbook</strong> — bài luyện nghe, nói và tập viết theo thứ tự nét.</li>
</ul>
<h3>📱 App &amp; từ điển</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển tiếng Trung chuẩn (viết tay &amp; phát âm).</li>
<li><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a> — thẻ ghi nhớ lặp lại ngắt quãng cho chữ Hán &amp; từ vựng.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — từ điển Trung sang Việt kèm thứ tự nét.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — bài học có hệ thống, khớp thứ tự môn này.</li>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — hội thoại thật có phụ đề.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình 4 bước</span>
<ol>
<li><strong>Ôn CHI111</strong> — bảo đảm 4 thanh, số đếm, ngày giờ và 是/有/都 đã vững trước khi bắt đầu.</li>
<li><strong>Từ vựng</strong> — học chữ Hán trong ngữ cảnh, ôn mỗi ngày bằng Anki/Pleco.</li>
<li><strong>Ngữ pháp</strong> — mẫu câu mới xây trên trật tự từ cũ (Chủ ngữ rồi Động từ rồi Tân ngữ).</li>
<li><strong>Luyện nói</strong> — đọc to mọi câu; nói nhại theo audio.</li>
</ol></div>`,
  ]]);

const intro = doc('chi121-0-1-overview', 'Course overview: Integrated Chinese 2|||Tổng quan: Tiếng Trung tổng hợp 2',
  'Nối tiếp CHI111 (nền pinyin & 4 thanh), track Integrated Chinese, mục tiêu tương đương HSK2, và lộ trình 8 bài chủ đề sinh hoạt.',
  [[
    `<span class="eyebrow">CHI121 · Lesson 0.1 · Overview</span>
<h2>Integrated Chinese 2</h2>
<p class="lead">This course picks up right where <strong>CHI111</strong> left off, still on the <strong>Integrated Chinese</strong> (Liu et al.) track. You already have pinyin, the 4 tones, and everyday basics; now you learn to shop and bargain, get around town, talk about the weather, order in a restaurant, visit friends, make a doctor appointment, ask for and give directions, and celebrate a birthday.</p>
<h3>What is new at this level</h3>
<ul>
<li><strong>Longer sentences</strong> — you connect clauses with pairs like 一边…一边… and 又…又…, and reason with 因为…所以… from CHI111.</li>
<li><strong>Comparison &amp; degree</strong> — 比 for comparing, 太…了 and …极了 for strong feelings.</li>
<li><strong>Time &amp; aspect</strong> — 正在 for an action in progress, 要…了 for something about to happen, 会…的 for certainty.</li>
<li><strong>Measure words &amp; money</strong> — 块 / 毛 / 分 for prices, 双 and 件 as new measure words.</li>
</ul>
<h3>Roadmap of this course</h3>
<p>Shopping → transport → weather → dining → visiting &amp; gifts → appointments (doctor) → directions → birthday party. Every lesson has a vocabulary table (汉字 | pinyin | meaning), grammar points with examples, a short dialogue, notes, and a quiz.</p>`,
    `<span class="eyebrow">CHI121 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung tổng hợp 2</h2>
<p class="lead">Môn này học tiếp ngay từ chỗ <strong>CHI111</strong> dừng lại, vẫn trên track <strong>Integrated Chinese</strong> (Liu và cộng sự). Bạn đã có pinyin, 4 thanh và nền tảng hằng ngày; giờ học cách mua sắm và mặc cả, đi lại trong thành phố, nói về thời tiết, gọi món trong quán, thăm bạn, hẹn khám bác sĩ, hỏi và chỉ đường, và mừng sinh nhật.</p>
<h3>Điểm mới ở trình độ này</h3>
<ul>
<li><strong>Câu dài hơn</strong> — nối vế bằng các cặp như 一边…一边… và 又…又…, lập luận với 因为…所以… từ CHI111.</li>
<li><strong>So sánh &amp; mức độ</strong> — 比 để so sánh, 太…了 và …极了 diễn tả cảm xúc mạnh.</li>
<li><strong>Thời &amp; thể</strong> — 正在 cho hành động đang diễn ra, 要…了 cho việc sắp xảy ra, 会…的 cho sự chắc chắn.</li>
<li><strong>Lượng từ &amp; tiền</strong> — 块 / 毛 / 分 cho giá cả, 双 và 件 là lượng từ mới.</li>
</ul>
<h3>Lộ trình của môn</h3>
<p>Mua sắm → giao thông → thời tiết → ăn uống → thăm bạn &amp; tặng quà → hẹn gặp (bác sĩ) → chỉ đường → tiệc sinh nhật. Mỗi bài có bảng từ vựng (汉字 | pinyin | nghĩa), điểm ngữ pháp kèm ví dụ, một hội thoại ngắn, ghi chú, và quiz.</p>`,
  ]]);

const b1 = doc('chi121-1-1-shopping', 'Lesson 1 — Shopping|||Bài 1 — Mua sắm',
  'Từ vựng: 买东西, 多少钱, 块/毛/分, 便宜, 贵, 换, 双, 件, 衣服. Ngữ pháp: hỏi giá 多少钱, đơn vị tiền, 太…了, lượng từ 双/件, đổi hàng 换.',
  [[
    `<span class="eyebrow">CHI121 · Lesson 1 · Shopping</span>
<h2>Shopping (买东西)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>买东西</td><td>mǎi dōngxi</td><td>to shop / buy things</td></tr>
<tr><td>多少钱</td><td>duōshao qián</td><td>how much (money)?</td></tr>
<tr><td>钱</td><td>qián</td><td>money</td></tr>
<tr><td>块 / 毛 / 分</td><td>kuài / máo / fēn</td><td>yuan / 0.1 yuan / 0.01 yuan (spoken)</td></tr>
<tr><td>便宜</td><td>piányi</td><td>cheap</td></tr>
<tr><td>贵</td><td>guì</td><td>expensive</td></tr>
<tr><td>换</td><td>huàn</td><td>to change / exchange</td></tr>
<tr><td>双</td><td>shuāng</td><td>pair (measure word)</td></tr>
<tr><td>件</td><td>jiàn</td><td>measure word for clothes / items</td></tr>
<tr><td>衣服</td><td>yīfu</td><td>clothes</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>多少钱 duōshao qián</strong> asks a price: 这件衣服<strong>多少钱</strong>? (how much is this piece of clothing?).</li>
<li><strong>Money units</strong>: spoken 块 / 毛 / 分; written 元 / 角 / 分. 三块五毛 = 3.5 yuan; the last unit is often dropped.</li>
<li><strong>太 … 了</strong>: 太<strong>贵</strong>了! (too expensive!); ask 便宜一点儿吗? (a bit cheaper?).</li>
<li><strong>Measure words</strong>: 一<strong>双</strong>鞋 (a pair of shoes) · 一<strong>件</strong>衣服 (a piece of clothing).</li>
<li><strong>换 huàn</strong> = to exchange: 我想<strong>换</strong>一双 (I want to exchange for another pair).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 这件衣服多少钱？   Zhè jiàn yīfu duōshao qián? (How much is this piece?)
B: 三十五块。         Sānshíwǔ kuài.             (35 yuan.)
A: 太贵了！便宜一点儿吗？ Tài guì le! Piányi yìdiǎnr ma? (Too expensive! A bit cheaper?)
B: 三十块。           Sānshí kuài.               (30 yuan.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 块 / 毛 / 分 are the everyday spoken words; 元 / 角 / 分 appear on receipts and price tags. One 块 = ten 毛 = one hundred 分.</div>`,
    `<span class="eyebrow">CHI121 · Bài 1 · Mua sắm</span>
<h2>Mua sắm (买东西)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>买东西</td><td>mǎi dōngxi</td><td>mua sắm / mua đồ</td></tr>
<tr><td>多少钱</td><td>duōshao qián</td><td>bao nhiêu tiền?</td></tr>
<tr><td>钱</td><td>qián</td><td>tiền</td></tr>
<tr><td>块 / 毛 / 分</td><td>kuài / máo / fēn</td><td>đồng / hào / xu (khẩu ngữ)</td></tr>
<tr><td>便宜</td><td>piányi</td><td>rẻ</td></tr>
<tr><td>贵</td><td>guì</td><td>đắt</td></tr>
<tr><td>换</td><td>huàn</td><td>đổi</td></tr>
<tr><td>双</td><td>shuāng</td><td>đôi (lượng từ)</td></tr>
<tr><td>件</td><td>jiàn</td><td>lượng từ cho áo quần / đồ vật</td></tr>
<tr><td>衣服</td><td>yīfu</td><td>quần áo</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>多少钱 duōshao qián</strong> hỏi giá: 这件衣服<strong>多少钱</strong>? (cái áo này bao nhiêu tiền?).</li>
<li><strong>Đơn vị tiền</strong>: khẩu ngữ 块 / 毛 / 分; văn viết 元 / 角 / 分. 三块五毛 = 3,5 đồng; đơn vị cuối thường được lược bỏ.</li>
<li><strong>太 … 了</strong>: 太<strong>贵</strong>了! (đắt quá!); hỏi 便宜一点儿吗? (rẻ chút được không?).</li>
<li><strong>Lượng từ</strong>: 一<strong>双</strong>鞋 (một đôi giày) · 一<strong>件</strong>衣服 (một cái áo).</li>
<li><strong>换 huàn</strong> = đổi: 我想<strong>换</strong>一双 (tôi muốn đổi sang đôi khác).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 这件衣服多少钱？   Zhè jiàn yīfu duōshao qián? (Cái áo này bao nhiêu tiền?)
B: 三十五块。         Sānshíwǔ kuài.             (35 đồng.)
A: 太贵了！便宜一点儿吗？ Tài guì le! Piányi yìdiǎnr ma? (Đắt quá! Rẻ chút được không?)
B: 三十块。           Sānshí kuài.               (30 đồng.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 块 / 毛 / 分 là từ khẩu ngữ hằng ngày; 元 / 角 / 分 xuất hiện trên hoá đơn và bảng giá. Một 块 = mười 毛 = một trăm 分.</div>`,
  ]]);

const b1q = quiz('chi121-quiz-1', 'Quiz 1 — Shopping|||Quiz 1 — Mua sắm', [
  { id: 'q1', question: 'Hỏi giá món đồ dùng cụm nào? / Which phrase asks a price?', options: ['多少钱 duōshao qián', '怎么样 zěnmeyàng', '在哪儿 zài nǎr', '几点 jǐ diǎn'], correctIndex: 0, explanation: '多少钱 = bao nhiêu tiền; 怎么样 = thế nào; 在哪儿 = ở đâu; 几点 = mấy giờ.' },
  { id: 'q2', question: 'Đơn vị tiền khẩu ngữ lớn nhất trong 块/毛/分 là? / Which is the largest spoken money unit?', options: ['分 fēn', '毛 máo', '块 kuài', 'bằng nhau|||all equal'], correctIndex: 2, explanation: '1 块 (kuài) = 10 毛 (máo) = 100 分 (fēn). 块 tương đương 元 trong văn viết.' },
  { id: 'q3', question: 'Lượng từ cho một đôi giày là? / Which measure word counts a pair of shoes?', options: ['件 jiàn', '双 shuāng', '口 kǒu', '本 běn'], correctIndex: 1, explanation: '双 shuāng = đôi (giày, đũa); 件 jiàn dùng cho áo quần/đồ vật.' },
]);

const b2 = doc('chi121-2-1-transportation', 'Lesson 2 — Transportation|||Bài 2 — Giao thông',
  'Từ vựng: 怎么走, 坐, 开车, 地铁, 公共汽车, 出租车, 离, 从…到…, 花, 分钟. Ngữ pháp: 怎么走, 坐+phương tiện, 离 chỉ khoảng cách, 从…到…, 花+thời gian.',
  [[
    `<span class="eyebrow">CHI121 · Lesson 2 · Transportation</span>
<h2>Transportation (交通)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>怎么走</td><td>zěnme zǒu</td><td>how do I get there?</td></tr>
<tr><td>坐</td><td>zuò</td><td>to sit; to go by (vehicle)</td></tr>
<tr><td>开车</td><td>kāi chē</td><td>to drive</td></tr>
<tr><td>地铁</td><td>dìtiě</td><td>subway / metro</td></tr>
<tr><td>公共汽车</td><td>gōnggòng qìchē</td><td>bus</td></tr>
<tr><td>出租车</td><td>chūzūchē</td><td>taxi</td></tr>
<tr><td>离</td><td>lí</td><td>(distance) from</td></tr>
<tr><td>从 … 到 …</td><td>cóng … dào …</td><td>from … to …</td></tr>
<tr><td>花</td><td>huā</td><td>to spend (time / money)</td></tr>
<tr><td>分钟</td><td>fēnzhōng</td><td>minute (duration)</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>怎么走 zěnme zǒu</strong> asks the way: 去地铁站<strong>怎么走</strong>? (how do I get to the subway station?).</li>
<li><strong>坐 + vehicle</strong>: 坐<strong>地铁</strong> (take the subway), 坐<strong>公共汽车</strong> (take the bus); but 开车 (drive) and 走路 (walk).</li>
<li><strong>离 lí</strong> for distance: A <strong>离</strong> B 远 / 近 — 学校<strong>离</strong>我家很近 (school is close to my home).</li>
<li><strong>从 … 到 …</strong>: <strong>从</strong>家<strong>到</strong>学校 (from home to school).</li>
<li><strong>花 huā + time / money</strong>: 从家到学校<strong>花</strong>二十<strong>分钟</strong> (it takes 20 minutes from home to school).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 去学校怎么走？     Qù xuéxiào zěnme zǒu? (How do I get to school?)
B: 你可以坐地铁。     Nǐ kěyǐ zuò dìtiě.     (You can take the subway.)
A: 从这儿到学校要多长时间？ Cóng zhèr dào xuéxiào yào duō cháng shíjiān? (How long from here to school?)
B: 花二十分钟。       Huā èrshí fēnzhōng.   (It takes 20 minutes.)
</code></pre>
<div class="callout"><span class="badge">Note</span> Use 坐 for vehicles you ride in (bus, subway, taxi, train) and 骑 qí for things you straddle (bike, motorbike). Only 开 goes with 车 when you are the driver.</div>`,
    `<span class="eyebrow">CHI121 · Bài 2 · Giao thông</span>
<h2>Giao thông (交通)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>怎么走</td><td>zěnme zǒu</td><td>đi thế nào? / đường nào?</td></tr>
<tr><td>坐</td><td>zuò</td><td>ngồi; đi (bằng xe)</td></tr>
<tr><td>开车</td><td>kāi chē</td><td>lái xe</td></tr>
<tr><td>地铁</td><td>dìtiě</td><td>tàu điện ngầm</td></tr>
<tr><td>公共汽车</td><td>gōnggòng qìchē</td><td>xe buýt</td></tr>
<tr><td>出租车</td><td>chūzūchē</td><td>taxi</td></tr>
<tr><td>离</td><td>lí</td><td>cách (khoảng cách)</td></tr>
<tr><td>从 … 到 …</td><td>cóng … dào …</td><td>từ … đến …</td></tr>
<tr><td>花</td><td>huā</td><td>tốn (thời gian / tiền)</td></tr>
<tr><td>分钟</td><td>fēnzhōng</td><td>phút (khoảng thời gian)</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>怎么走 zěnme zǒu</strong> hỏi đường: 去地铁站<strong>怎么走</strong>? (đến ga tàu điện đi thế nào?).</li>
<li><strong>坐 + phương tiện</strong>: 坐<strong>地铁</strong> (đi tàu điện), 坐<strong>公共汽车</strong> (đi xe buýt); còn 开车 (lái xe) và 走路 (đi bộ).</li>
<li><strong>离 lí</strong> chỉ khoảng cách: A <strong>离</strong> B 远 / 近 — 学校<strong>离</strong>我家很近 (trường gần nhà tôi).</li>
<li><strong>从 … 到 …</strong>: <strong>从</strong>家<strong>到</strong>学校 (từ nhà đến trường).</li>
<li><strong>花 huā + thời gian / tiền</strong>: 从家到学校<strong>花</strong>二十<strong>分钟</strong> (từ nhà đến trường tốn 20 phút).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 去学校怎么走？     Qù xuéxiào zěnme zǒu? (Đến trường đi thế nào?)
B: 你可以坐地铁。     Nǐ kěyǐ zuò dìtiě.     (Bạn có thể đi tàu điện ngầm.)
A: 从这儿到学校要多长时间？ Cóng zhèr dào xuéxiào yào duō cháng shíjiān? (Từ đây đến trường mất bao lâu?)
B: 花二十分钟。       Huā èrshí fēnzhōng.   (Tốn 20 phút.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Dùng 坐 cho phương tiện mình ngồi vào (buýt, tàu điện, taxi, tàu hoả) và 骑 qí cho thứ ngồi dạng cưỡi (xe đạp, xe máy). Chỉ 开 đi với 车 khi bạn là người lái.</div>`,
  ]]);

const b2q = quiz('chi121-quiz-2', 'Quiz 2 — Transportation|||Quiz 2 — Giao thông', [
  { id: 'q1', question: 'Hỏi "đi thế nào / đường nào" dùng cụm nào? / Which phrase asks the way?', options: ['多少钱 duōshao qián', '怎么走 zěnme zǒu', '几口人 jǐ kǒu rén', '好不好 hǎo bù hǎo'], correctIndex: 1, explanation: '怎么走 = đi thế nào; hỏi lộ trình tới một nơi.' },
  { id: 'q2', question: 'Đi xe buýt nói đúng là? / Which is correct for taking the bus?', options: ['开公共汽车 kāi gōnggòng qìchē', '坐公共汽车 zuò gōnggòng qìchē', '走公共汽车 zǒu gōnggòng qìchē', '花公共汽车 huā gōnggòng qìchē'], correctIndex: 1, explanation: '坐 dùng cho phương tiện mình ngồi vào: 坐公共汽车. 开车 là khi tự lái.' },
  { id: 'q3', question: 'Câu 学校离我家很近 nghĩa là? / What does 学校离我家很近 mean?', options: ['Trường xa nhà tôi|||School is far from home', 'Trường gần nhà tôi|||School is close to my home', 'Nhà tôi có trường|||My home has a school', 'Tôi đi học bằng tàu|||I go to school by train'], correctIndex: 1, explanation: '离 chỉ khoảng cách: A 离 B 近 = A gần B. 近 = gần, 远 = xa.' },
]);

const b3 = doc('chi121-3-1-weather', 'Lesson 3 — Weather|||Bài 3 — Thời tiết',
  'Từ vựng: 天气, 暖和, 冷, 热, 下雨, 下雪, 比, 会…的, 要…了, 预报, 度. Ngữ pháp: so sánh với 比, 会…的 (chắc chắn), 要…了 (sắp), động từ thời tiết 下雨/下雪.',
  [[
    `<span class="eyebrow">CHI121 · Lesson 3 · Weather</span>
<h2>Weather (天气)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>天气</td><td>tiānqì</td><td>weather</td></tr>
<tr><td>暖和</td><td>nuǎnhuo</td><td>warm</td></tr>
<tr><td>冷 / 热</td><td>lěng / rè</td><td>cold / hot</td></tr>
<tr><td>下雨</td><td>xià yǔ</td><td>to rain</td></tr>
<tr><td>下雪</td><td>xià xuě</td><td>to snow</td></tr>
<tr><td>比</td><td>bǐ</td><td>compared with</td></tr>
<tr><td>会 … 的</td><td>huì … de</td><td>will (surely) …</td></tr>
<tr><td>要 … 了</td><td>yào … le</td><td>about to …</td></tr>
<tr><td>预报</td><td>yùbào</td><td>forecast</td></tr>
<tr><td>度</td><td>dù</td><td>degree (temperature)</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>Comparison with 比</strong>: A <strong>比</strong> B + adjective — 今天<strong>比</strong>昨天冷 (today is colder than yesterday). Do not add 很.</li>
<li><strong>会 … 的 huì … de</strong> = it surely will: 明天<strong>会</strong>下雨<strong>的</strong> (it will rain tomorrow).</li>
<li><strong>要 … 了 yào … le</strong> = about to happen: <strong>要</strong>下雨<strong>了</strong> (it is about to rain).</li>
<li><strong>Weather verbs</strong>: 下雨 / 下雪 use 下 (to fall); temperature uses 度 — 今天二十度 (20 degrees today).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 今天天气怎么样？   Jīntiān tiānqì zěnmeyàng? (How is the weather today?)
B: 今天比昨天冷。     Jīntiān bǐ zuótiān lěng. (Colder than yesterday.)
A: 明天呢？           Míngtiān ne?             (And tomorrow?)
B: 预报说明天会下雨的。要下雨了。 Yùbào shuō míngtiān huì xià yǔ de. Yào xià yǔ le. (The forecast says it will rain. It is about to rain.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 会…的 stresses certainty about the future; 要…了 stresses that something is on the point of happening now. They often appear together.</div>`,
    `<span class="eyebrow">CHI121 · Bài 3 · Thời tiết</span>
<h2>Thời tiết (天气)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>天气</td><td>tiānqì</td><td>thời tiết</td></tr>
<tr><td>暖和</td><td>nuǎnhuo</td><td>ấm áp</td></tr>
<tr><td>冷 / 热</td><td>lěng / rè</td><td>lạnh / nóng</td></tr>
<tr><td>下雨</td><td>xià yǔ</td><td>mưa</td></tr>
<tr><td>下雪</td><td>xià xuě</td><td>tuyết rơi</td></tr>
<tr><td>比</td><td>bǐ</td><td>so với</td></tr>
<tr><td>会 … 的</td><td>huì … de</td><td>sẽ … (chắc chắn)</td></tr>
<tr><td>要 … 了</td><td>yào … le</td><td>sắp … rồi</td></tr>
<tr><td>预报</td><td>yùbào</td><td>dự báo</td></tr>
<tr><td>度</td><td>dù</td><td>độ (nhiệt độ)</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>So sánh với 比</strong>: A <strong>比</strong> B + tính từ — 今天<strong>比</strong>昨天冷 (hôm nay lạnh hơn hôm qua). Không thêm 很.</li>
<li><strong>会 … 的 huì … de</strong> = chắc chắn sẽ: 明天<strong>会</strong>下雨<strong>的</strong> (mai chắc sẽ mưa).</li>
<li><strong>要 … 了 yào … le</strong> = sắp xảy ra: <strong>要</strong>下雨<strong>了</strong> (sắp mưa rồi).</li>
<li><strong>Động từ thời tiết</strong>: 下雨 / 下雪 dùng 下 (rơi); nhiệt độ dùng 度 — 今天二十度 (hôm nay 20 độ).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 今天天气怎么样？   Jīntiān tiānqì zěnmeyàng? (Hôm nay thời tiết thế nào?)
B: 今天比昨天冷。     Jīntiān bǐ zuótiān lěng. (Hôm nay lạnh hơn hôm qua.)
A: 明天呢？           Míngtiān ne?             (Còn ngày mai?)
B: 预报说明天会下雨的。要下雨了。 Yùbào shuō míngtiān huì xià yǔ de. Yào xià yǔ le. (Dự báo nói mai sẽ mưa. Sắp mưa rồi.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 会…的 nhấn sự chắc chắn về tương lai; 要…了 nhấn việc sắp xảy ra ngay lúc này. Hai mẫu thường đi cùng nhau.</div>`,
  ]]);

const b3q = quiz('chi121-quiz-3', 'Quiz 3 — Weather|||Quiz 3 — Thời tiết', [
  { id: 'q1', question: 'Câu 今天比昨天冷 nghĩa là? / What does 今天比昨天冷 mean?', options: ['Hôm nay ấm hơn hôm qua|||Today is warmer', 'Hôm nay lạnh hơn hôm qua|||Today is colder than yesterday', 'Hôm qua lạnh hơn hôm nay|||Yesterday was colder', 'Hôm nay và hôm qua bằng nhau|||Same as yesterday'], correctIndex: 1, explanation: 'A 比 B + tính từ = A hơn B về tính chất đó. 今天比昨天冷 = hôm nay lạnh hơn hôm qua.' },
  { id: 'q2', question: 'Mẫu "要…了" diễn đạt điều gì? / What does 要…了 express?', options: ['đã xong|||already done', 'sắp xảy ra|||about to happen', 'thường xuyên|||often', 'không bao giờ|||never'], correctIndex: 1, explanation: '要…了 = sắp … rồi: 要下雨了 = sắp mưa rồi.' },
  { id: 'q3', question: 'Động từ chỉ "mưa" là? / Which means "to rain"?', options: ['下雪 xià xuě', '下雨 xià yǔ', '暖和 nuǎnhuo', '预报 yùbào'], correctIndex: 1, explanation: '下雨 = mưa; 下雪 = tuyết rơi; cả hai dùng động từ 下 (rơi).' },
]);

const b4 = doc('chi121-4-1-dining', 'Lesson 4 — Dining|||Bài 4 — Ăn uống',
  'Từ vựng: 饭馆, 点菜, 菜, 服务员, 够, 极了, 来, 素, 好吃, 碗, 米饭. Ngữ pháp: 点菜, 来 gọi món, 够 (đủ), …极了 (cực kỳ), 吃素.',
  [[
    `<span class="eyebrow">CHI121 · Lesson 4 · Dining</span>
<h2>Dining (饭馆)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>饭馆</td><td>fànguǎn</td><td>restaurant</td></tr>
<tr><td>点菜</td><td>diǎn cài</td><td>to order dishes</td></tr>
<tr><td>菜</td><td>cài</td><td>dish / vegetable</td></tr>
<tr><td>服务员</td><td>fúwùyuán</td><td>waiter / server</td></tr>
<tr><td>够</td><td>gòu</td><td>enough</td></tr>
<tr><td>极了</td><td>jí le</td><td>extremely (after adjective)</td></tr>
<tr><td>来</td><td>lái</td><td>to bring / have (when ordering)</td></tr>
<tr><td>素</td><td>sù</td><td>vegetarian</td></tr>
<tr><td>好吃</td><td>hǎochī</td><td>delicious</td></tr>
<tr><td>碗 / 米饭</td><td>wǎn / mǐfàn</td><td>bowl / cooked rice</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>点菜 diǎn cài</strong> = to order; you call 服务员 (server) first.</li>
<li><strong>来 lái when ordering</strong> = bring / I will have: <strong>来</strong>一<strong>碗</strong>米饭 (a bowl of rice, please).</li>
<li><strong>够 gòu</strong> = enough: 这些菜<strong>够</strong>了 (these dishes are enough).</li>
<li><strong>… 极了</strong> = extremely (a degree complement after an adjective): 这个菜好吃<strong>极了</strong> (this dish is extremely delicious).</li>
<li><strong>吃素 chī sù</strong> = to eat vegetarian: 我<strong>吃素</strong> (I am vegetarian).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 服务员，我们点菜。 Fúwùyuán, wǒmen diǎn cài. (Waiter, we would like to order.)
B: 你们要什么？       Nǐmen yào shénme?         (What would you like?)
A: 来一碗米饭。我吃素。 Lái yì wǎn mǐfàn. Wǒ chī sù. (A bowl of rice. I am vegetarian.)
B: 好。这个菜好吃极了！ Hǎo. Zhège cài hǎochī jí le! (Sure. This dish is extremely delicious!)
</code></pre>
<div class="callout"><span class="badge">Note</span> …极了 always follows the adjective (好吃极了), while 太…了 wraps around it (太好吃了). Both mean "extremely / too".</div>`,
    `<span class="eyebrow">CHI121 · Bài 4 · Ăn uống</span>
<h2>Ăn uống (饭馆)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>饭馆</td><td>fànguǎn</td><td>quán ăn / nhà hàng</td></tr>
<tr><td>点菜</td><td>diǎn cài</td><td>gọi món</td></tr>
<tr><td>菜</td><td>cài</td><td>món ăn / rau</td></tr>
<tr><td>服务员</td><td>fúwùyuán</td><td>nhân viên phục vụ</td></tr>
<tr><td>够</td><td>gòu</td><td>đủ</td></tr>
<tr><td>极了</td><td>jí le</td><td>cực kỳ (đứng sau tính từ)</td></tr>
<tr><td>来</td><td>lái</td><td>cho / lấy (khi gọi món)</td></tr>
<tr><td>素</td><td>sù</td><td>chay</td></tr>
<tr><td>好吃</td><td>hǎochī</td><td>ngon</td></tr>
<tr><td>碗 / 米饭</td><td>wǎn / mǐfàn</td><td>bát / cơm</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>点菜 diǎn cài</strong> = gọi món; trước tiên gọi 服务员 (phục vụ).</li>
<li><strong>来 lái khi gọi món</strong> = cho / lấy: <strong>来</strong>一<strong>碗</strong>米饭 (cho một bát cơm).</li>
<li><strong>够 gòu</strong> = đủ: 这些菜<strong>够</strong>了 (mấy món này đủ rồi).</li>
<li><strong>… 极了</strong> = cực kỳ (bổ ngữ mức độ sau tính từ): 这个菜好吃<strong>极了</strong> (món này ngon cực kỳ).</li>
<li><strong>吃素 chī sù</strong> = ăn chay: 我<strong>吃素</strong> (tôi ăn chay).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 服务员，我们点菜。 Fúwùyuán, wǒmen diǎn cài. (Phục vụ ơi, chúng tôi gọi món.)
B: 你们要什么？       Nǐmen yào shénme?         (Anh chị dùng gì?)
A: 来一碗米饭。我吃素。 Lái yì wǎn mǐfàn. Wǒ chī sù. (Cho một bát cơm. Tôi ăn chay.)
B: 好。这个菜好吃极了！ Hǎo. Zhège cài hǎochī jí le! (Vâng. Món này ngon cực kỳ!)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> …极了 luôn đứng sau tính từ (好吃极了), còn 太…了 kẹp quanh nó (太好吃了). Cả hai đều nghĩa "cực kỳ / quá".</div>`,
  ]]);

const b4q = quiz('chi121-quiz-4', 'Quiz 4 — Dining|||Quiz 4 — Ăn uống', [
  { id: 'q1', question: '"点菜" (diǎn cài) nghĩa là? / What does 点菜 mean?', options: ['nấu ăn|||to cook', 'gọi món|||to order dishes', 'rửa bát|||to wash dishes', 'trả tiền|||to pay'], correctIndex: 1, explanation: '点 (chọn/gọi) + 菜 (món) = gọi món trong quán.' },
  { id: 'q2', question: 'Khi gọi món, "来一碗米饭" nghĩa là? / When ordering, 来一碗米饭 means?', options: ['Đi lấy một bát cơm|||Go get rice yourself', 'Cho một bát cơm|||A bowl of rice, please', 'Cơm này ngon|||This rice is good', 'Không có cơm|||No rice'], correctIndex: 1, explanation: '来 khi gọi món = cho/lấy; 碗 là lượng từ cho bát: 来一碗米饭 = cho một bát cơm.' },
  { id: 'q3', question: '"好吃极了" nghĩa là? / What does 好吃极了 mean?', options: ['hơi ngon|||a little tasty', 'ngon cực kỳ|||extremely delicious', 'không ngon|||not tasty', 'đủ ăn|||enough to eat'], correctIndex: 1, explanation: '…极了 là bổ ngữ mức độ đứng sau tính từ: 好吃极了 = ngon cực kỳ.' },
]);

const b5 = doc('chi121-5-1-visiting', 'Lesson 5 — Visiting a friend|||Bài 5 — Thăm bạn',
  'Từ vựng: 拜访, 进来, 送, 礼物, 一边…一边…, 又…又…, 高兴, 聊天, 茶. Ngữ pháp: 送礼物, 一边…一边… (đồng thời), 又…又… (hai tính chất), 请进/进来.',
  [[
    `<span class="eyebrow">CHI121 · Lesson 5 · Visiting</span>
<h2>Visiting a friend (拜访朋友)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>拜访</td><td>bàifǎng</td><td>to visit (politely)</td></tr>
<tr><td>进来</td><td>jìnlai</td><td>to come in</td></tr>
<tr><td>送</td><td>sòng</td><td>to give (a gift); to see off</td></tr>
<tr><td>礼物</td><td>lǐwù</td><td>gift</td></tr>
<tr><td>一边 … 一边 …</td><td>yìbiān … yìbiān …</td><td>doing A while doing B</td></tr>
<tr><td>又 … 又 …</td><td>yòu … yòu …</td><td>both … and …</td></tr>
<tr><td>高兴</td><td>gāoxìng</td><td>happy / glad</td></tr>
<tr><td>聊天</td><td>liáo tiān</td><td>to chat</td></tr>
<tr><td>茶</td><td>chá</td><td>tea</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>拜访 / 进来</strong>: 拜访 is a polite "to visit"; the host says 请进 or 进来 (come in).</li>
<li><strong>送礼物 sòng lǐwù</strong> = to give a gift: 我<strong>送</strong>你一个<strong>礼物</strong> (I give you a gift).</li>
<li><strong>一边 … 一边 …</strong> = two actions at the same time: 我们<strong>一边</strong>喝茶<strong>一边</strong>聊天 (we chat while drinking tea).</li>
<li><strong>又 … 又 …</strong> = two qualities together: 这个礼物<strong>又</strong>好<strong>又</strong>便宜 (this gift is both nice and cheap).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你好！请进，进来坐。 Nǐ hǎo! Qǐng jìn, jìnlai zuò. (Hello! Please come in and sit.)
B: 这是给你的礼物。   Zhè shì gěi nǐ de lǐwù. (This is a gift for you.)
A: 谢谢！我们一边喝茶一边聊天吧。 Xièxie! Wǒmen yìbiān hē chá yìbiān liáo tiān ba. (Thanks! Let us chat over tea.)
B: 好，我很高兴。     Hǎo, wǒ hěn gāoxìng.   (Great, I am very glad.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 一边…一边… links two verbs done at once; 又…又… links two adjectives (or states). Do not mix them up.</div>`,
    `<span class="eyebrow">CHI121 · Bài 5 · Thăm bạn</span>
<h2>Thăm bạn (拜访朋友)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>拜访</td><td>bàifǎng</td><td>thăm viếng (trang trọng)</td></tr>
<tr><td>进来</td><td>jìnlai</td><td>vào đây / mời vào</td></tr>
<tr><td>送</td><td>sòng</td><td>tặng; đưa tiễn</td></tr>
<tr><td>礼物</td><td>lǐwù</td><td>quà</td></tr>
<tr><td>一边 … 一边 …</td><td>yìbiān … yìbiān …</td><td>vừa … vừa … (đồng thời)</td></tr>
<tr><td>又 … 又 …</td><td>yòu … yòu …</td><td>vừa … vừa … (hai tính chất)</td></tr>
<tr><td>高兴</td><td>gāoxìng</td><td>vui, vui mừng</td></tr>
<tr><td>聊天</td><td>liáo tiān</td><td>trò chuyện, tán gẫu</td></tr>
<tr><td>茶</td><td>chá</td><td>trà</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>拜访 / 进来</strong>: 拜访 là "thăm" trang trọng; chủ nhà nói 请进 hoặc 进来 (mời vào).</li>
<li><strong>送礼物 sòng lǐwù</strong> = tặng quà: 我<strong>送</strong>你一个<strong>礼物</strong> (tôi tặng bạn một món quà).</li>
<li><strong>一边 … 一边 …</strong> = hai hành động cùng lúc: 我们<strong>一边</strong>喝茶<strong>一边</strong>聊天 (chúng tôi vừa uống trà vừa trò chuyện).</li>
<li><strong>又 … 又 …</strong> = hai tính chất cùng có: 这个礼物<strong>又</strong>好<strong>又</strong>便宜 (món quà này vừa đẹp vừa rẻ).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你好！请进，进来坐。 Nǐ hǎo! Qǐng jìn, jìnlai zuò. (Chào! Mời vào, vào ngồi đi.)
B: 这是给你的礼物。   Zhè shì gěi nǐ de lǐwù. (Đây là quà tặng bạn.)
A: 谢谢！我们一边喝茶一边聊天吧。 Xièxie! Wǒmen yìbiān hē chá yìbiān liáo tiān ba. (Cảm ơn! Chúng ta vừa uống trà vừa trò chuyện nhé.)
B: 好，我很高兴。     Hǎo, wǒ hěn gāoxìng.   (Được, tôi rất vui.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 一边…一边… nối hai động từ làm cùng lúc; 又…又… nối hai tính từ (hoặc trạng thái). Đừng dùng lẫn.</div>`,
  ]]);

const b5q = quiz('chi121-quiz-5', 'Quiz 5 — Visiting a friend|||Quiz 5 — Thăm bạn', [
  { id: 'q1', question: 'Mẫu "一边…一边…" diễn đạt điều gì? / What does 一边…一边… express?', options: ['nguyên nhân–kết quả|||cause and effect', 'hai hành động cùng lúc|||two actions at once', 'so sánh|||comparison', 'sắp xảy ra|||about to happen'], correctIndex: 1, explanation: '一边…一边… nối hai động từ làm đồng thời: 一边喝茶一边聊天.' },
  { id: 'q2', question: '"送礼物" (sòng lǐwù) nghĩa là? / What does 送礼物 mean?', options: ['nhận quà|||to receive a gift', 'tặng quà|||to give a gift', 'mua quà|||to buy a gift', 'gói quà|||to wrap a gift'], correctIndex: 1, explanation: '送 = tặng/đưa; 礼物 = quà; 送礼物 = tặng quà.' },
  { id: 'q3', question: 'Câu 这个礼物又好又便宜 nghĩa là? / What does 这个礼物又好又便宜 mean?', options: ['Món quà vừa đẹp vừa rẻ|||both nice and cheap', 'Món quà đắt|||the gift is expensive', 'Món quà xấu|||the gift is ugly', 'Không có quà|||there is no gift'], correctIndex: 0, explanation: '又…又… nối hai tính chất: 又好又便宜 = vừa tốt/đẹp vừa rẻ.' },
]);

const b6 = doc('chi121-6-1-appointments', 'Lesson 6 — Doctor appointments & being busy|||Bài 6 — Hẹn khám bệnh & bận rộn',
  'Từ vựng: 帮, 为, 别, 正在, 得(děi), 看病, 医生, 忙, 药, 舒服. Ngữ pháp: 正在 (đang), 得 děi (phải), 帮 (giúp), 为 (vì/cho), 别 (đừng).',
  [[
    `<span class="eyebrow">CHI121 · Lesson 6 · Appointments</span>
<h2>Doctor appointments &amp; being busy</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>帮</td><td>bāng</td><td>to help</td></tr>
<tr><td>为</td><td>wèi</td><td>for / for the sake of</td></tr>
<tr><td>别</td><td>bié</td><td>do not (do)</td></tr>
<tr><td>正在</td><td>zhèngzài</td><td>in the middle of (doing)</td></tr>
<tr><td>得</td><td>děi</td><td>must / have to</td></tr>
<tr><td>看病</td><td>kàn bìng</td><td>to see a doctor</td></tr>
<tr><td>医生</td><td>yīshēng</td><td>doctor</td></tr>
<tr><td>忙</td><td>máng</td><td>busy</td></tr>
<tr><td>药</td><td>yào</td><td>medicine</td></tr>
<tr><td>舒服</td><td>shūfu</td><td>comfortable / well</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>正在 + verb</strong> = an action in progress: 医生<strong>正在</strong>看病 (the doctor is seeing patients right now).</li>
<li><strong>得 děi</strong> = must / have to (read <em>děi</em>, not <em>de</em>): 我<strong>得</strong>去看医生 (I have to go see a doctor).</li>
<li><strong>帮 bāng</strong> = to help: 你可以<strong>帮</strong>我吗? (can you help me?).</li>
<li><strong>为 wèi</strong> = for / on behalf of: 我<strong>为</strong>你担心 (I worry about you / for you).</li>
<li><strong>别 + verb</strong> = do not: 你不舒服，<strong>别</strong>工作了 (you are unwell, do not work).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 我不舒服，得去看医生。 Wǒ bù shūfu, děi qù kàn yīshēng. (I am unwell, I have to see a doctor.)
B: 医生正在看病，你等一下。 Yīshēng zhèngzài kàn bìng, nǐ děng yíxià. (The doctor is with a patient; wait a moment.)
A: 好。你能帮我吗？   Hǎo. Nǐ néng bāng wǒ ma? (OK. Can you help me?)
B: 别担心，先吃药。   Bié dānxīn, xiān chī yào. (Do not worry, take the medicine first.)
</code></pre>
<div class="callout"><span class="badge">Note</span> The character 得 has three readings: 得 <em>děi</em> (must), 得 <em>de</em> (a complement particle), 得 <em>dé</em> (to obtain). Here it is <em>děi</em> = have to.</div>`,
    `<span class="eyebrow">CHI121 · Bài 6 · Hẹn khám bệnh</span>
<h2>Hẹn khám bệnh &amp; bận rộn</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>帮</td><td>bāng</td><td>giúp</td></tr>
<tr><td>为</td><td>wèi</td><td>vì / cho</td></tr>
<tr><td>别</td><td>bié</td><td>đừng (làm)</td></tr>
<tr><td>正在</td><td>zhèngzài</td><td>đang (tiến hành)</td></tr>
<tr><td>得</td><td>děi</td><td>phải / cần</td></tr>
<tr><td>看病</td><td>kàn bìng</td><td>khám bệnh</td></tr>
<tr><td>医生</td><td>yīshēng</td><td>bác sĩ</td></tr>
<tr><td>忙</td><td>máng</td><td>bận</td></tr>
<tr><td>药</td><td>yào</td><td>thuốc</td></tr>
<tr><td>舒服</td><td>shūfu</td><td>dễ chịu / khoẻ</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>正在 + động từ</strong> = hành động đang diễn ra: 医生<strong>正在</strong>看病 (bác sĩ đang khám bệnh).</li>
<li><strong>得 děi</strong> = phải (đọc <em>děi</em>, không phải <em>de</em>): 我<strong>得</strong>去看医生 (tôi phải đi khám bác sĩ).</li>
<li><strong>帮 bāng</strong> = giúp: 你可以<strong>帮</strong>我吗? (bạn giúp tôi được không?).</li>
<li><strong>为 wèi</strong> = vì / cho: 我<strong>为</strong>你担心 (tôi lo cho bạn).</li>
<li><strong>别 + động từ</strong> = đừng: 你不舒服，<strong>别</strong>工作了 (bạn không khoẻ, đừng làm việc nữa).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 我不舒服，得去看医生。 Wǒ bù shūfu, děi qù kàn yīshēng. (Tôi không khoẻ, phải đi khám bác sĩ.)
B: 医生正在看病，你等一下。 Yīshēng zhèngzài kàn bìng, nǐ děng yíxià. (Bác sĩ đang khám, bạn đợi một chút.)
A: 好。你能帮我吗？   Hǎo. Nǐ néng bāng wǒ ma? (Được. Bạn giúp tôi được không?)
B: 别担心，先吃药。   Bié dānxīn, xiān chī yào. (Đừng lo, uống thuốc trước đã.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Chữ 得 có ba âm: 得 <em>děi</em> (phải), 得 <em>de</em> (trợ từ bổ ngữ), 得 <em>dé</em> (đạt được). Ở đây là <em>děi</em> = phải.</div>`,
  ]]);

const b6q = quiz('chi121-quiz-6', 'Quiz 6 — Appointments|||Quiz 6 — Hẹn khám bệnh', [
  { id: 'q1', question: 'Mẫu "正在 + động từ" diễn đạt điều gì? / What does 正在 + verb express?', options: ['sắp làm|||about to do', 'đang làm|||in the middle of doing', 'đã làm xong|||already done', 'không làm|||not doing'], correctIndex: 1, explanation: '正在 = đang (tiến hành): 医生正在看病 = bác sĩ đang khám bệnh.' },
  { id: 'q2', question: 'Trong 我得去看医生, chữ 得 đọc và nghĩa là? / In 我得去看医生, 得 is read and means?', options: ['de — trợ từ|||particle', 'děi — phải|||must / have to', 'dé — đạt được|||to obtain', 'dài — dài|||long'], correctIndex: 1, explanation: 'Ở đây 得 đọc děi = phải/cần: 我得去看医生 = tôi phải đi khám bác sĩ.' },
  { id: 'q3', question: '"不舒服" (bù shūfu) nghĩa là? / What does 不舒服 mean?', options: ['rất khoẻ|||very well', 'không khoẻ / khó chịu|||unwell / uncomfortable', 'rất bận|||very busy', 'rất vui|||very happy'], correctIndex: 1, explanation: '舒服 = dễ chịu/khoẻ; 不舒服 = không khoẻ, khó chịu (ốm).' },
]);

const b7 = doc('chi121-7-1-directions', 'Lesson 7 — Getting around & directions|||Bài 7 — Đi lại & chỉ đường',
  'Từ vựng: 往, 一直, 拐, 过, 中间, 离, 远, 近, 路口, 红绿灯. Ngữ pháp: 往+hướng+ĐT, 一直走, 拐 (rẽ), 过 (qua), 离…远/近.',
  [[
    `<span class="eyebrow">CHI121 · Lesson 7 · Directions</span>
<h2>Getting around &amp; directions</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>往</td><td>wǎng</td><td>toward / in the direction of</td></tr>
<tr><td>一直</td><td>yìzhí</td><td>straight / continuously</td></tr>
<tr><td>拐</td><td>guǎi</td><td>to turn</td></tr>
<tr><td>过</td><td>guò</td><td>to cross / pass</td></tr>
<tr><td>中间</td><td>zhōngjiān</td><td>in the middle</td></tr>
<tr><td>离</td><td>lí</td><td>(distance) from</td></tr>
<tr><td>远 / 近</td><td>yuǎn / jìn</td><td>far / near</td></tr>
<tr><td>路口</td><td>lùkǒu</td><td>intersection</td></tr>
<tr><td>红绿灯</td><td>hónglǜdēng</td><td>traffic light</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>往 + direction + verb</strong>: <strong>往</strong>前走 (go straight ahead), <strong>往</strong>左<strong>拐</strong> (turn left).</li>
<li><strong>一直 yìzhí</strong> = straight on / all the way: <strong>一直</strong>走 (keep going straight).</li>
<li><strong>过 guò</strong> = to cross / pass: <strong>过</strong>马路 (cross the street), <strong>过</strong>红绿灯 (pass the traffic light).</li>
<li><strong>离 … 远 / 近</strong>: 银行<strong>离</strong>这儿不<strong>远</strong> (the bank is not far from here).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 请问，银行离这儿远吗？ Qǐng wèn, yínháng lí zhèr yuǎn ma? (Excuse me, is the bank far from here?)
B: 不远。往前一直走。   Bù yuǎn. Wǎng qián yìzhí zǒu. (Not far. Go straight ahead.)
A: 然后呢？             Ránhòu ne?                   (Then?)
B: 过红绿灯，往右拐。就在中间。 Guò hónglǜdēng, wǎng yòu guǎi. Jiù zài zhōngjiān. (Cross the light, turn right. It is right in the middle.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 往 marks the direction of movement and comes before the verb; compare 往左拐 (turn to the left) with 在左边 (on the left side).</div>`,
    `<span class="eyebrow">CHI121 · Bài 7 · Đi lại</span>
<h2>Đi lại &amp; chỉ đường</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>往</td><td>wǎng</td><td>về phía / hướng về</td></tr>
<tr><td>一直</td><td>yìzhí</td><td>thẳng / liên tục</td></tr>
<tr><td>拐</td><td>guǎi</td><td>rẽ, quẹo</td></tr>
<tr><td>过</td><td>guò</td><td>qua, băng qua</td></tr>
<tr><td>中间</td><td>zhōngjiān</td><td>ở giữa</td></tr>
<tr><td>离</td><td>lí</td><td>cách (khoảng cách)</td></tr>
<tr><td>远 / 近</td><td>yuǎn / jìn</td><td>xa / gần</td></tr>
<tr><td>路口</td><td>lùkǒu</td><td>ngã tư, giao lộ</td></tr>
<tr><td>红绿灯</td><td>hónglǜdēng</td><td>đèn giao thông</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>往 + hướng + động từ</strong>: <strong>往</strong>前走 (đi thẳng về phía trước), <strong>往</strong>左<strong>拐</strong> (rẽ trái).</li>
<li><strong>一直 yìzhí</strong> = thẳng / liên tục: <strong>一直</strong>走 (cứ đi thẳng).</li>
<li><strong>过 guò</strong> = qua / băng qua: <strong>过</strong>马路 (băng qua đường), <strong>过</strong>红绿灯 (qua đèn giao thông).</li>
<li><strong>离 … 远 / 近</strong>: 银行<strong>离</strong>这儿不<strong>远</strong> (ngân hàng không xa đây).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 请问，银行离这儿远吗？ Qǐng wèn, yínháng lí zhèr yuǎn ma? (Cho hỏi, ngân hàng có xa đây không?)
B: 不远。往前一直走。   Bù yuǎn. Wǎng qián yìzhí zǒu. (Không xa. Cứ đi thẳng về phía trước.)
A: 然后呢？             Ránhòu ne?                   (Rồi sao nữa?)
B: 过红绿灯，往右拐。就在中间。 Guò hónglǜdēng, wǎng yòu guǎi. Jiù zài zhōngjiān. (Qua đèn giao thông, rẽ phải. Nó ở ngay giữa.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 往 chỉ hướng di chuyển và đứng trước động từ; so sánh 往左拐 (rẽ về bên trái) với 在左边 (ở bên trái).</div>`,
  ]]);

const b7q = quiz('chi121-quiz-7', 'Quiz 7 — Directions|||Quiz 7 — Chỉ đường', [
  { id: 'q1', question: '"往左拐" (wǎng zuǒ guǎi) nghĩa là? / What does 往左拐 mean?', options: ['rẽ phải|||turn right', 'rẽ trái|||turn left', 'đi thẳng|||go straight', 'quay lại|||turn back'], correctIndex: 1, explanation: '往 (về phía) + 左 (trái) + 拐 (rẽ) = rẽ trái. 往右拐 = rẽ phải.' },
  { id: 'q2', question: '"一直走" (yìzhí zǒu) nghĩa là? / What does 一直走 mean?', options: ['dừng lại|||stop', 'cứ đi thẳng|||keep going straight', 'đi chậm|||walk slowly', 'rẽ ngay|||turn now'], correctIndex: 1, explanation: '一直 = thẳng/liên tục; 一直走 = cứ đi thẳng.' },
  { id: 'q3', question: 'Câu 银行离这儿不远 nghĩa là? / What does 银行离这儿不远 mean?', options: ['Ngân hàng rất xa đây|||far from here', 'Ngân hàng không xa đây|||not far from here', 'Đây không có ngân hàng|||no bank here', 'Ngân hàng đóng cửa|||the bank is closed'], correctIndex: 1, explanation: '离 chỉ khoảng cách: A 离 B 不远 = A không xa B.' },
]);

const b8 = doc('chi121-8-1-birthday-party', 'Lesson 8 — Birthday party|||Bài 8 — Tiệc sinh nhật',
  'Từ vựng: 送, 礼物, 祝, 年龄, 属, 岁, 长大, 生日快乐, 蛋糕, 聚会. Ngữ pháp: 祝 (chúc), 属 (con giáp), hỏi tuổi 多大/几岁, 长大, 送礼物.',
  [[
    `<span class="eyebrow">CHI121 · Lesson 8 · Birthday party</span>
<h2>Birthday party (生日聚会)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>送</td><td>sòng</td><td>to give (a gift)</td></tr>
<tr><td>礼物</td><td>lǐwù</td><td>gift</td></tr>
<tr><td>祝</td><td>zhù</td><td>to wish (someone)</td></tr>
<tr><td>年龄</td><td>niánlíng</td><td>age (formal)</td></tr>
<tr><td>属</td><td>shǔ</td><td>to be born in the year of (zodiac)</td></tr>
<tr><td>岁</td><td>suì</td><td>years old</td></tr>
<tr><td>长大</td><td>zhǎng dà</td><td>to grow up</td></tr>
<tr><td>生日快乐</td><td>shēngrì kuàilè</td><td>happy birthday</td></tr>
<tr><td>蛋糕</td><td>dàngāo</td><td>cake</td></tr>
<tr><td>聚会</td><td>jùhuì</td><td>party / gathering</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>祝 zhù</strong> = to wish someone: <strong>祝</strong>你<strong>生日快乐</strong>! (happy birthday to you!).</li>
<li><strong>Asking age</strong>: 你今年<strong>多大</strong>? (adults) · 你<strong>几岁</strong>? (small children) · answer 我二十<strong>岁</strong>.</li>
<li><strong>属 shǔ (zodiac)</strong>: 你<strong>属</strong>什么? — 我<strong>属</strong>龙 (what is your zodiac animal? — I was born in the year of the dragon).</li>
<li><strong>长大 zhǎng dà</strong> = to grow up: 我在北京<strong>长大</strong> (I grew up in Beijing).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 祝你生日快乐！这是给你的礼物。 Zhù nǐ shēngrì kuàilè! Zhè shì gěi nǐ de lǐwù. (Happy birthday! This gift is for you.)
B: 谢谢！我们吃蛋糕吧。 Xièxie! Wǒmen chī dàngāo ba. (Thanks! Let us eat the cake.)
A: 你今年多大？       Nǐ jīnnián duō dà?     (How old are you this year?)
B: 二十岁。我属龙。   Èrshí suì. Wǒ shǔ lóng. (Twenty. I was born in the year of the dragon.)
</code></pre>
<div class="callout"><span class="badge">Note</span> Use 多大 for teens and adults, 几岁 for young children, and 年龄 as the formal noun for "age". 岁 is the counter for years of age.</div>`,
    `<span class="eyebrow">CHI121 · Bài 8 · Tiệc sinh nhật</span>
<h2>Tiệc sinh nhật (生日聚会)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>送</td><td>sòng</td><td>tặng</td></tr>
<tr><td>礼物</td><td>lǐwù</td><td>quà</td></tr>
<tr><td>祝</td><td>zhù</td><td>chúc</td></tr>
<tr><td>年龄</td><td>niánlíng</td><td>tuổi (trang trọng)</td></tr>
<tr><td>属</td><td>shǔ</td><td>cầm tinh (con giáp)</td></tr>
<tr><td>岁</td><td>suì</td><td>tuổi</td></tr>
<tr><td>长大</td><td>zhǎng dà</td><td>lớn lên</td></tr>
<tr><td>生日快乐</td><td>shēngrì kuàilè</td><td>chúc mừng sinh nhật</td></tr>
<tr><td>蛋糕</td><td>dàngāo</td><td>bánh kem</td></tr>
<tr><td>聚会</td><td>jùhuì</td><td>tiệc, buổi họp mặt</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>祝 zhù</strong> = chúc ai đó: <strong>祝</strong>你<strong>生日快乐</strong>! (chúc bạn sinh nhật vui vẻ!).</li>
<li><strong>Hỏi tuổi</strong>: 你今年<strong>多大</strong>? (người lớn) · 你<strong>几岁</strong>? (trẻ nhỏ) · đáp 我二十<strong>岁</strong>.</li>
<li><strong>属 shǔ (con giáp)</strong>: 你<strong>属</strong>什么? — 我<strong>属</strong>龙 (bạn cầm tinh con gì? — tôi tuổi Rồng).</li>
<li><strong>长大 zhǎng dà</strong> = lớn lên: 我在北京<strong>长大</strong> (tôi lớn lên ở Bắc Kinh).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 祝你生日快乐！这是给你的礼物。 Zhù nǐ shēngrì kuàilè! Zhè shì gěi nǐ de lǐwù. (Chúc mừng sinh nhật! Đây là quà tặng bạn.)
B: 谢谢！我们吃蛋糕吧。 Xièxie! Wǒmen chī dàngāo ba. (Cảm ơn! Chúng ta ăn bánh kem nhé.)
A: 你今年多大？       Nǐ jīnnián duō dà?     (Năm nay bạn bao nhiêu tuổi?)
B: 二十岁。我属龙。   Èrshí suì. Wǒ shǔ lóng. (Hai mươi tuổi. Tôi tuổi Rồng.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Dùng 多大 cho thiếu niên và người lớn, 几岁 cho trẻ nhỏ, và 年龄 là danh từ trang trọng cho "tuổi". 岁 là lượng từ đếm số tuổi.</div>`,
  ]]);

const b8q = quiz('chi121-quiz-8', 'Quiz 8 — Birthday party|||Quiz 8 — Tiệc sinh nhật', [
  { id: 'q1', question: 'Chúc mừng sinh nhật nói thế nào? / How do you say "happy birthday"?', options: ['新年快乐 xīnnián kuàilè', '生日快乐 shēngrì kuàilè', '恭喜发财 gōngxǐ fācái', '一路平安 yílù píng ān'], correctIndex: 1, explanation: '生日快乐 = chúc mừng sinh nhật; 新年快乐 = chúc mừng năm mới.' },
  { id: 'q2', question: 'Hỏi tuổi người lớn dùng cụm nào? / Which asks an adult age?', options: ['几岁 jǐ suì', '多大 duō dà', '多少钱 duōshao qián', '怎么样 zěnmeyàng'], correctIndex: 1, explanation: '你今年多大? dùng cho người lớn; 几岁 hỏi trẻ nhỏ.' },
  { id: 'q3', question: '"我属龙" (wǒ shǔ lóng) nghĩa là? / What does 我属龙 mean?', options: ['Tôi thích rồng|||I like dragons', 'Tôi tuổi Rồng|||I was born in the year of the dragon', 'Tôi tên Long|||My name is Long', 'Tôi vẽ rồng|||I draw dragons'], correctIndex: 1, explanation: '属 shǔ chỉ con giáp: 我属龙 = tôi cầm tinh con Rồng (tuổi Rồng).' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'CHI121',
    slug: 'chi121-integrated-chinese-2',
    title: 'Integrated Chinese 2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHI121.webp',
    shortDescription: 'Integrated Chinese 2 (continues CHI111, Liu track) — shopping, transport & directions, weather, dining, visiting & gifts, doctor appointments and birthday parties. Bilingual, with vocabulary, grammar, dialogues & quizzes.|||Tiếng Trung tổng hợp 2 (nối tiếp CHI111, track Liu) — mua sắm, giao thông & chỉ đường, thời tiết, ăn uống, thăm bạn & tặng quà, hẹn khám bệnh và tiệc sinh nhật. Song ngữ, kèm từ vựng, ngữ pháp, hội thoại & quiz.',
    description: 'Môn <strong>CHI121 — Integrated Chinese 2 (Tiếng Trung tổng hợp 2)</strong> <strong>nối tiếp CHI111</strong> trên track <strong>Integrated Chinese</strong> (Liu et al., Cheng &amp; Tsui), đưa bạn từ nền tảng nhập môn lên mức tương đương HSK2. Học tiếp qua các chủ đề sinh hoạt: <strong>mua sắm</strong> → <strong>giao thông</strong> → <strong>thời tiết</strong> → <strong>ăn uống</strong> → <strong>thăm bạn &amp; tặng quà</strong> → <strong>hẹn khám bệnh</strong> → <strong>chỉ đường</strong> → <strong>tiệc sinh nhật</strong>. Song ngữ Trung–Việt, mỗi bài có bảng từ vựng (汉字 | pinyin | nghĩa), điểm ngữ pháp kèm ví dụ, hội thoại ngắn, ghi chú và quiz.',
    whatYouLearn: 'Mua sắm &amp; mặc cả (买东西, 多少钱, 块/毛/分, 太…了, 便宜/贵, 换, lượng từ 双/件); giao thông (怎么走, 坐+phương tiện, 开车, 地铁, 离, 从…到…, 花+thời gian); thời tiết (天气, 暖和/冷/热, 下雨/下雪, so sánh 比, 会…的, 要…了); ăn uống (饭馆, 点菜, 服务员, 来 gọi món, 够, …极了, 吃素); thăm bạn &amp; tặng quà (拜访, 进来, 送礼物, 一边…一边…, 又…又…); hẹn khám bệnh (看病, 医生, 正在, 得 děi, 帮, 为, 别); chỉ đường (往, 一直, 拐, 过, 离…远/近, 红绿灯); tiệc sinh nhật (祝, 生日快乐, 多大/几岁, 属 con giáp, 长大, 蛋糕).',
    requirements: 'Cần hoàn thành CHI111 hoặc nắm vững pinyin, 4 thanh điệu, số đếm, ngày giờ và các mẫu câu cơ bản (是, 有/没有, 都, 喜欢). Nên cài Pleco hoặc dùng từ điển hanzii.net để tra chữ &amp; nghe phát âm; luyện viết chữ Hán theo thứ tự nét.',
  },
  sections: [
    { title: '📚 Tài liệu & lộ trình|||📚 Course materials', description: 'Giáo trình Integrated Chinese (L1P1 nửa sau → L1P2), workbook, app, từ điển, YouTube, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CHI111, track Integrated Chinese, mục tiêu HSK2, cách học.', lessons: [intro] },
    { title: 'Bài 1 — Mua sắm|||Lesson 1 — Shopping', description: '买东西, 多少钱, 块/毛/分, 便宜/贵, 换, 双/件.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Giao thông|||Lesson 2 — Transportation', description: '怎么走, 坐, 开车, 地铁, 离, 从…到…, 花时间.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Thời tiết|||Lesson 3 — Weather', description: '天气, 暖和/冷/热, 下雨/下雪, 比, 会…的, 要…了.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Ăn uống|||Lesson 4 — Dining', description: '饭馆, 点菜, 服务员, 够, 极了, 来, 素.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Thăm bạn|||Lesson 5 — Visiting', description: '拜访, 进来, 送礼物, 一边…一边…, 又…又…', lessons: [b5, b5q] },
    { title: 'Bài 6 — Hẹn khám bệnh|||Lesson 6 — Appointments', description: '帮, 为, 别, 正在, 得 děi, 看病, 医生.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Chỉ đường|||Lesson 7 — Directions', description: '往, 一直, 拐, 过, 中间, 离…远/近, 红绿灯.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Tiệc sinh nhật|||Lesson 8 — Birthday party', description: '送礼物, 祝, 年龄, 属, 岁, 长大, 蛋糕.', lessons: [b8, b8q] },
  ],
};
