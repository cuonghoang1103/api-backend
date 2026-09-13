/**
 * CHI311 — Integrated Chinese 3 (Tiếng Trung tổng hợp 3). Khối Ngôn ngữ Trung
 * FPTU. NỐI TIẾP CHI121. Đây là MÔN NGÔN NGỮ: cấu trúc theo BÀI HỌC TIẾNG (từ
 * vựng, ngữ pháp, hội thoại, luyện tập) theo track "Integrated Chinese", bám
 * cuối Level 1 Part 2 sang đầu Level 2 Part 1 (Liu et al., Cheng &amp; Tsui) —
 * mức tương đương HSK2 lên HSK3. Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick lồng/${; trong HTML content "&" → "&amp;". shortDescription
 * dùng "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chi311-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình học',
  'Giáo trình chuẩn (Integrated Chinese cuối L1P2 → L2P1, Liu et al.), workbook & character workbook, app (Pleco/Anki), từ điển hanzii.net, YouTube, lộ trình 4 bước. Nhắc lại nền tảng CHI121.',
  [[
    `<span class="eyebrow">CHI311 · Materials</span>
<h2>How to keep learning Chinese — materials &amp; roadmap</h2>
<p class="lead">Integrated Chinese 3 <strong>continues CHI121</strong> on the <strong>Integrated Chinese</strong> track: it assumes you already know pinyin, the 4 tones, everyday topics, shopping, transport, weather and dining, and it moves on to study &amp; exams, renting a home, chores, health, travel, the seasons, advanced shopping and hobbies — at roughly <strong>HSK2 rising to HSK3</strong>. Below are the standard textbook plus free tools.</p>
<h3>📘 Standard textbook</h3>
<ul>
<li><strong>Integrated Chinese, Level 1 Part 2</strong> (later lessons) <strong>and Level 2 Part 1</strong> (Yuehua Liu, Tao-chung Yao et al. — Cheng &amp; Tsui) — the mainstream university coursebook this track continues from.</li>
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
<li><strong>Review CHI121</strong> — make sure prices, 坐+vehicle, 比 comparison, 会…的 / 要…了 and the visiting vocabulary are solid before you start.</li>
<li><strong>Vocabulary</strong> — learn hanzi in context, review daily with Anki/Pleco.</li>
<li><strong>Grammar</strong> — new patterns build on old word order (Subject then Verb then Object).</li>
<li><strong>Speaking</strong> — say every sentence out loud; shadow the audio.</li>
</ol></div>`,
    `<span class="eyebrow">CHI311 · Tài liệu</span>
<h2>Học tiếp tiếng Trung — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung tổng hợp 3 <strong>nối tiếp CHI121</strong> trên track <strong>Integrated Chinese</strong>: giả định bạn đã nắm pinyin, 4 thanh, các chủ đề hằng ngày, mua sắm, giao thông, thời tiết và ăn uống, rồi đi tiếp sang học tập &amp; thi cử, thuê nhà, việc nhà, sức khỏe, du lịch, mùa trong năm, mua sắm nâng cao và sở thích — ở mức tương đương <strong>HSK2 lên HSK3</strong>. Bên dưới là giáo trình chuẩn cùng công cụ miễn phí.</p>
<h3>📘 Giáo trình chuẩn</h3>
<ul>
<li><strong>Integrated Chinese, Level 1 Part 2</strong> (các bài sau) <strong>và Level 2 Part 1</strong> (Yuehua Liu, Tao-chung Yao và cộng sự — NXB Cheng &amp; Tsui) — giáo trình đại học mà track này học tiếp.</li>
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
<li><strong>Ôn CHI121</strong> — bảo đảm cách hỏi giá, 坐+phương tiện, so sánh 比, 会…的 / 要…了 và từ vựng thăm bạn đã vững trước khi bắt đầu.</li>
<li><strong>Từ vựng</strong> — học chữ Hán trong ngữ cảnh, ôn mỗi ngày bằng Anki/Pleco.</li>
<li><strong>Ngữ pháp</strong> — mẫu câu mới xây trên trật tự từ cũ (Chủ ngữ rồi Động từ rồi Tân ngữ).</li>
<li><strong>Luyện nói</strong> — đọc to mọi câu; nói nhại theo audio.</li>
</ol></div>`,
  ]]);

const intro = doc('chi311-0-1-overview', 'Course overview: Integrated Chinese 3|||Tổng quan: Tiếng Trung tổng hợp 3',
  'Nối tiếp CHI121 (nền pinyin, so sánh, thời & thể cơ bản), track Integrated Chinese, mục tiêu HSK2 lên HSK3, và lộ trình 8 bài chủ đề đời sống mở rộng.',
  [[
    `<span class="eyebrow">CHI311 · Lesson 0.1 · Overview</span>
<h2>Integrated Chinese 3</h2>
<p class="lead">This course picks up right where <strong>CHI121</strong> left off, still on the <strong>Integrated Chinese</strong> (Liu et al.) track. You already have pinyin, the 4 tones, comparison with 比 and the basic time patterns; now you learn to talk about studying and exams, rent a home, describe chores and habits, see a doctor, plan travel, discuss the seasons, bargain when shopping, and talk about your hobbies.</p>
<h3>What is new at this level</h3>
<ul>
<li><strong>Resultative complements</strong> — 听懂 (understand by listening), 看懂 (understand by reading), 记住 (memorize), showing the result of an action.</li>
<li><strong>Degree complements with 得</strong> — 唱得很好 (sing very well), 考得不错 (do quite well on a test).</li>
<li><strong>Paired connectives</strong> — 一…就… (as soon as), 越来越… (more and more), 越…越… (the more … the more), 不但…而且… (not only … but also).</li>
<li><strong>Comparison &amp; degree</strong> — 比…更… (even more than), plus 应该 and 可能 for advice and possibility.</li>
</ul>
<h3>Roadmap of this course</h3>
<p>Study &amp; exams → renting a home → chores &amp; habits → health &amp; the doctor → travel → seasons &amp; climate → advanced shopping → hobbies &amp; entertainment. Every lesson has a vocabulary table (汉字 | pinyin | meaning), grammar points with examples, a short dialogue, notes, and a quiz.</p>`,
    `<span class="eyebrow">CHI311 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung tổng hợp 3</h2>
<p class="lead">Môn này học tiếp ngay từ chỗ <strong>CHI121</strong> dừng lại, vẫn trên track <strong>Integrated Chinese</strong> (Liu và cộng sự). Bạn đã có pinyin, 4 thanh, so sánh với 比 và các mẫu thời gian cơ bản; giờ học cách nói về học tập và thi cử, thuê nhà, mô tả việc nhà và thói quen, đi khám bệnh, lên kế hoạch du lịch, bàn về các mùa, mặc cả khi mua sắm, và nói về sở thích.</p>
<h3>Điểm mới ở trình độ này</h3>
<ul>
<li><strong>Bổ ngữ kết quả</strong> — 听懂 (nghe hiểu), 看懂 (đọc hiểu), 记住 (nhớ được), diễn tả kết quả của hành động.</li>
<li><strong>Bổ ngữ trình độ với 得</strong> — 唱得很好 (hát rất hay), 考得不错 (thi khá tốt).</li>
<li><strong>Cặp liên từ</strong> — 一…就… (hễ … là), 越来越… (càng ngày càng), 越…越… (càng … càng), 不但…而且… (không những … mà còn).</li>
<li><strong>So sánh &amp; mức độ</strong> — 比…更… (còn hơn cả), cùng 应该 và 可能 để khuyên và nói khả năng.</li>
</ul>
<h3>Lộ trình của môn</h3>
<p>Học tập &amp; thi cử → thuê nhà → việc nhà &amp; thói quen → sức khỏe &amp; khám bệnh → du lịch → mùa &amp; khí hậu → mua sắm nâng cao → sở thích &amp; giải trí. Mỗi bài có bảng từ vựng (汉字 | pinyin | nghĩa), điểm ngữ pháp kèm ví dụ, một hội thoại ngắn, ghi chú, và quiz.</p>`,
  ]]);

const b1 = doc('chi311-1-1-study-exams', 'Lesson 1 — Study &amp; exams|||Bài 1 — Học tập &amp; thi cử',
  'Từ vựng: 考试, 复习, 成绩, 懂, 记住, 复杂, 简单, 生词, 预习. Ngữ pháp: 复习/预习, bổ ngữ kết quả 听懂/看懂/记住, bổ ngữ trình độ 考得好, cặp trái nghĩa 复杂/简单.',
  [[
    `<span class="eyebrow">CHI311 · Lesson 1 · Study &amp; exams</span>
<h2>Study &amp; exams (学习和考试)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>考试</td><td>kǎoshì</td><td>exam; to take an exam</td></tr>
<tr><td>复习</td><td>fùxí</td><td>to review</td></tr>
<tr><td>预习</td><td>yùxí</td><td>to preview (before class)</td></tr>
<tr><td>成绩</td><td>chéngjì</td><td>grade / result</td></tr>
<tr><td>懂</td><td>dǒng</td><td>to understand</td></tr>
<tr><td>记住</td><td>jìzhù</td><td>to memorize / remember</td></tr>
<tr><td>复杂</td><td>fùzá</td><td>complicated</td></tr>
<tr><td>简单</td><td>jiǎndān</td><td>simple</td></tr>
<tr><td>生词</td><td>shēngcí</td><td>new word / vocabulary</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>复习 vs 预习</strong>: 复习 is to review what you learned; 预习 is to preview before class.</li>
<li><strong>Resultative complements</strong>: verb + result — 听<strong>懂</strong> (understand by listening), 看<strong>懂</strong> (understand by reading), 记<strong>住</strong> (fix in memory).</li>
<li><strong>得 + adjective (degree)</strong>: 他考<strong>得</strong>很好 (he did very well on the test). Here 得 is read neutral <em>de</em>.</li>
<li><strong>复杂 ↔ 简单</strong>: opposite adjectives — 这课很<strong>复杂</strong>, 那课很<strong>简单</strong>.</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 明天有考试，你复习了吗？ Míngtiān yǒu kǎoshì, nǐ fùxí le ma? (There is an exam tomorrow, have you reviewed?)
B: 复习了，可是这课很复杂。 Fùxí le, kěshì zhè kè hěn fùzá. (Yes, but this lesson is complicated.)
A: 别担心，你一定考得很好。 Bié dānxīn, nǐ yídìng kǎo de hěn hǎo. (Do not worry, you will surely do well.)
B: 我记住了很多生词。 Wǒ jìzhù le hěn duō shēngcí. (I have memorized many new words.)
</code></pre>
<div class="callout"><span class="badge">Note</span> A resultative complement joins a verb to its result: 听 (listen) + 懂 (understand) = 听懂 (understand by listening). The negative is 没 before the verb: 没听懂 (did not catch it).</div>`,
    `<span class="eyebrow">CHI311 · Bài 1 · Học tập &amp; thi cử</span>
<h2>Học tập &amp; thi cử (学习和考试)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>考试</td><td>kǎoshì</td><td>kỳ thi; đi thi</td></tr>
<tr><td>复习</td><td>fùxí</td><td>ôn tập</td></tr>
<tr><td>预习</td><td>yùxí</td><td>chuẩn bị bài (trước giờ học)</td></tr>
<tr><td>成绩</td><td>chéngjì</td><td>thành tích / điểm số</td></tr>
<tr><td>懂</td><td>dǒng</td><td>hiểu</td></tr>
<tr><td>记住</td><td>jìzhù</td><td>nhớ được, ghi nhớ</td></tr>
<tr><td>复杂</td><td>fùzá</td><td>phức tạp</td></tr>
<tr><td>简单</td><td>jiǎndān</td><td>đơn giản</td></tr>
<tr><td>生词</td><td>shēngcí</td><td>từ mới</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>复习 vs 预习</strong>: 复习 là ôn lại điều đã học; 预习 là chuẩn bị bài trước giờ học.</li>
<li><strong>Bổ ngữ kết quả</strong>: động từ + kết quả — 听<strong>懂</strong> (nghe hiểu), 看<strong>懂</strong> (đọc hiểu), 记<strong>住</strong> (nhớ được).</li>
<li><strong>得 + tính từ (bổ ngữ trình độ)</strong>: 他考<strong>得</strong>很好 (bạn ấy thi rất tốt). Ở đây 得 đọc thanh nhẹ <em>de</em>.</li>
<li><strong>复杂 ↔ 简单</strong>: cặp tính từ trái nghĩa — 这课很<strong>复杂</strong>, 那课很<strong>简单</strong>.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 明天有考试，你复习了吗？ Míngtiān yǒu kǎoshì, nǐ fùxí le ma? (Mai có thi, bạn ôn chưa?)
B: 复习了，可是这课很复杂。 Fùxí le, kěshì zhè kè hěn fùzá. (Ôn rồi, nhưng bài này phức tạp.)
A: 别担心，你一定考得很好。 Bié dānxīn, nǐ yídìng kǎo de hěn hǎo. (Đừng lo, bạn chắc chắn thi tốt.)
B: 我记住了很多生词。 Wǒ jìzhù le hěn duō shēngcí. (Tôi đã nhớ được nhiều từ mới.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Bổ ngữ kết quả nối động từ với kết quả của nó: 听 (nghe) + 懂 (hiểu) = 听懂 (nghe hiểu). Phủ định dùng 没 trước động từ: 没听懂 (nghe không hiểu).</div>`,
  ]]);

const b1q = quiz('chi311-quiz-1', 'Quiz 1 — Study &amp; exams|||Quiz 1 — Học tập &amp; thi cử', [
  { id: 'q1', question: 'Phân biệt 复习 và 预习? / Tell 复习 from 预习?', options: ['复习 là ôn lại, 预习 là chuẩn bị bài trước|||复习 review, 预习 preview', '复习 là thi, 预习 là học|||复习 exam, 预习 study', 'Hai từ nghĩa giống nhau|||both the same', '复习 là quên, 预习 là nhớ|||复习 forget, 预习 recall'], correctIndex: 0, explanation: '复习 = ôn lại điều đã học; 预习 = xem trước bài trước khi lên lớp.' },
  { id: 'q2', question: '"听懂" (tīng dǒng) nghĩa là? / What does 听懂 mean?', options: ['nghe nhạc|||listen to music', 'nghe hiểu|||to understand by listening', 'nói to|||speak loudly', 'nghe không rõ|||cannot hear'], correctIndex: 1, explanation: '懂 là bổ ngữ kết quả: 听 (nghe) + 懂 (hiểu) = nghe hiểu. Phủ định: 没听懂.' },
  { id: 'q3', question: 'Trong 他考得很好, chữ 得 làm gì? / In 他考得很好, what is 得 for?', options: ['chỉ khả năng|||shows ability', 'nối động từ với bổ ngữ trình độ|||links verb to a degree complement', 'nghĩa là phải|||means must', 'là danh từ|||is a noun'], correctIndex: 1, explanation: '得 (đọc de) nối động từ với bổ ngữ trình độ: 考得很好 = thi rất tốt.' },
]);

const b2 = doc('chi311-2-1-renting', 'Lesson 2 — Renting a home|||Bài 2 — Thuê nhà &amp; chỗ ở',
  'Từ vựng: 租房, 公寓, 家具, 安静, 干净, 合适, 押金, 房租, 卧室. Ngữ pháp: 租 (thuê), 合适 (phù hợp), 又…又… (vừa…vừa…), cách hỏi tiền thuê 房租 & 押金.',
  [[
    `<span class="eyebrow">CHI311 · Lesson 2 · Renting a home</span>
<h2>Renting a home (租房)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>租房</td><td>zū fáng</td><td>to rent a place</td></tr>
<tr><td>公寓</td><td>gōngyù</td><td>apartment</td></tr>
<tr><td>家具</td><td>jiājù</td><td>furniture</td></tr>
<tr><td>安静</td><td>ānjìng</td><td>quiet</td></tr>
<tr><td>干净</td><td>gānjìng</td><td>clean</td></tr>
<tr><td>合适</td><td>héshì</td><td>suitable</td></tr>
<tr><td>押金</td><td>yājīn</td><td>deposit</td></tr>
<tr><td>房租</td><td>fángzū</td><td>rent (money)</td></tr>
<tr><td>卧室</td><td>wòshì</td><td>bedroom</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>租 zū</strong> = to rent: 我想<strong>租</strong>一套<strong>公寓</strong> (I want to rent an apartment). 套 tào is the measure word for a flat.</li>
<li><strong>合适 héshì</strong> = suitable: 这套很<strong>合适</strong> (this one is very suitable). Do not confuse with 合适 and 适合 (word order differs).</li>
<li><strong>又 … 又 …</strong>: two qualities together — 这套<strong>又</strong>安静<strong>又</strong>干净 (this place is both quiet and clean).</li>
<li><strong>房租 &amp; 押金</strong>: ask 房租多少? (how much is the rent?) and 要押金吗? (is a deposit needed?).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 我想租一套公寓。 Wǒ xiǎng zū yí tào gōngyù. (I want to rent an apartment.)
B: 这套又安静又干净，很合适。 Zhè tào yòu ānjìng yòu gānjìng, hěn héshì. (This one is quiet and clean, very suitable.)
A: 房租多少？要押金吗？ Fángzū duōshao? Yào yājīn ma? (How much is the rent? Is a deposit needed?)
B: 一个月两千，押金一个月。 Yí ge yuè liǎng qiān, yājīn yí ge yuè. (2000 a month, one month deposit.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 押金 (deposit) is money you get back when you move out; 房租 (rent) is the monthly payment you do not get back. 套 is the measure word for an apartment.</div>`,
    `<span class="eyebrow">CHI311 · Bài 2 · Thuê nhà</span>
<h2>Thuê nhà &amp; chỗ ở (租房)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>租房</td><td>zū fáng</td><td>thuê nhà</td></tr>
<tr><td>公寓</td><td>gōngyù</td><td>căn hộ</td></tr>
<tr><td>家具</td><td>jiājù</td><td>đồ đạc, nội thất</td></tr>
<tr><td>安静</td><td>ānjìng</td><td>yên tĩnh</td></tr>
<tr><td>干净</td><td>gānjìng</td><td>sạch sẽ</td></tr>
<tr><td>合适</td><td>héshì</td><td>phù hợp, thích hợp</td></tr>
<tr><td>押金</td><td>yājīn</td><td>tiền đặt cọc</td></tr>
<tr><td>房租</td><td>fángzū</td><td>tiền thuê nhà</td></tr>
<tr><td>卧室</td><td>wòshì</td><td>phòng ngủ</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>租 zū</strong> = thuê: 我想<strong>租</strong>一套<strong>公寓</strong> (tôi muốn thuê một căn hộ). 套 tào là lượng từ cho căn hộ.</li>
<li><strong>合适 héshì</strong> = phù hợp: 这套很<strong>合适</strong> (căn này rất phù hợp).</li>
<li><strong>又 … 又 …</strong>: hai tính chất cùng có — 这套<strong>又</strong>安静<strong>又</strong>干净 (căn này vừa yên tĩnh vừa sạch).</li>
<li><strong>房租 &amp; 押金</strong>: hỏi 房租多少? (tiền thuê bao nhiêu?) và 要押金吗? (có cần đặt cọc không?).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 我想租一套公寓。 Wǒ xiǎng zū yí tào gōngyù. (Tôi muốn thuê một căn hộ.)
B: 这套又安静又干净，很合适。 Zhè tào yòu ānjìng yòu gānjìng, hěn héshì. (Căn này vừa yên tĩnh vừa sạch, rất phù hợp.)
A: 房租多少？要押金吗？ Fángzū duōshao? Yào yājīn ma? (Tiền thuê bao nhiêu? Có cần cọc không?)
B: 一个月两千，押金一个月。 Yí ge yuè liǎng qiān, yājīn yí ge yuè. (2000 một tháng, cọc một tháng.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 押金 (tiền cọc) là tiền được trả lại khi dọn đi; 房租 (tiền thuê) là khoản trả hằng tháng không được lấy lại. 套 là lượng từ cho căn hộ.</div>`,
  ]]);

const b2q = quiz('chi311-quiz-2', 'Quiz 2 — Renting a home|||Quiz 2 — Thuê nhà', [
  { id: 'q1', question: '"公寓" (gōngyù) nghĩa là? / What does 公寓 mean?', options: ['công viên|||park', 'căn hộ|||apartment', 'công ty|||company', 'nhà bếp|||kitchen'], correctIndex: 1, explanation: '公寓 = căn hộ; lượng từ dùng là 套 (yí tào gōngyù).' },
  { id: 'q2', question: 'Câu 这套又安静又干净 nghĩa là? / What does 这套又安静又干净 mean?', options: ['Căn này ồn và bẩn|||noisy and dirty', 'Căn này vừa yên tĩnh vừa sạch|||both quiet and clean', 'Căn này rất đắt|||very expensive', 'Căn này rất nhỏ|||very small'], correctIndex: 1, explanation: '又…又… nối hai tính chất: 又安静又干净 = vừa yên tĩnh vừa sạch.' },
  { id: 'q3', question: 'Khoản tiền được trả lại khi dọn đi là? / Which money is returned when you move out?', options: ['房租 fángzū', '押金 yājīn', '成绩 chéngjì', '家具 jiājù'], correctIndex: 1, explanation: '押金 = tiền cọc, được trả lại; 房租 = tiền thuê hằng tháng, không lấy lại.' },
]);

const b3 = doc('chi311-3-1-chores-habits', 'Lesson 3 — Chores &amp; habits|||Bài 3 — Việc nhà &amp; thói quen',
  'Từ vựng: 做饭, 打扫, 习惯, 自己, 洗, 收拾, 房间, 每天. Ngữ pháp: 一…就… (hễ…là…), 自己 (tự mình), 习惯 (quen), động-tân 做饭/打扫.',
  [[
    `<span class="eyebrow">CHI311 · Lesson 3 · Chores &amp; habits</span>
<h2>Chores &amp; habits (家务和习惯)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>做饭</td><td>zuò fàn</td><td>to cook</td></tr>
<tr><td>打扫</td><td>dǎsǎo</td><td>to clean / sweep</td></tr>
<tr><td>习惯</td><td>xíguàn</td><td>habit; to be used to</td></tr>
<tr><td>自己</td><td>zìjǐ</td><td>oneself</td></tr>
<tr><td>洗</td><td>xǐ</td><td>to wash</td></tr>
<tr><td>收拾</td><td>shōushi</td><td>to tidy up</td></tr>
<tr><td>房间</td><td>fángjiān</td><td>room</td></tr>
<tr><td>每天</td><td>měitiān</td><td>every day</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>一 … 就 …</strong> = as soon as A, then B: 我<strong>一</strong>回家<strong>就</strong>做饭 (as soon as I get home I cook).</li>
<li><strong>自己 zìjǐ</strong> = oneself: 我<strong>自己</strong>打扫房间 (I clean my room myself).</li>
<li><strong>习惯 xíguàn</strong>: as a verb, to be used to — 我已经<strong>习惯</strong>了 (I am already used to it); as a noun, a habit.</li>
<li><strong>Verb-object chores</strong>: 做饭 (cook), 打扫 (clean), 洗衣服 (wash clothes), 收拾房间 (tidy the room).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你每天做饭吗？ Nǐ měitiān zuò fàn ma? (Do you cook every day?)
B: 是，我一回家就做饭。 Shì, wǒ yì huí jiā jiù zuò fàn. (Yes, as soon as I get home I cook.)
A: 谁打扫房间？ Shéi dǎsǎo fángjiān? (Who cleans the room?)
B: 我自己打扫，已经习惯了。 Wǒ zìjǐ dǎsǎo, yǐjīng xíguàn le. (I clean it myself, I am used to it.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 一…就… links two events in time: the first triggers the second. 自己 can stand alone or follow a pronoun: 我自己 (I myself), 他自己 (he himself).</div>`,
    `<span class="eyebrow">CHI311 · Bài 3 · Việc nhà</span>
<h2>Việc nhà &amp; thói quen (家务和习惯)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>做饭</td><td>zuò fàn</td><td>nấu cơm</td></tr>
<tr><td>打扫</td><td>dǎsǎo</td><td>dọn dẹp, quét dọn</td></tr>
<tr><td>习惯</td><td>xíguàn</td><td>thói quen; quen</td></tr>
<tr><td>自己</td><td>zìjǐ</td><td>tự mình, bản thân</td></tr>
<tr><td>洗</td><td>xǐ</td><td>rửa, giặt</td></tr>
<tr><td>收拾</td><td>shōushi</td><td>dọn dẹp, thu xếp</td></tr>
<tr><td>房间</td><td>fángjiān</td><td>căn phòng</td></tr>
<tr><td>每天</td><td>měitiān</td><td>mỗi ngày</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>一 … 就 …</strong> = hễ A là B: 我<strong>一</strong>回家<strong>就</strong>做饭 (hễ về nhà là tôi nấu cơm).</li>
<li><strong>自己 zìjǐ</strong> = tự mình: 我<strong>自己</strong>打扫房间 (tôi tự dọn phòng).</li>
<li><strong>习惯 xíguàn</strong>: là động từ, quen với — 我已经<strong>习惯</strong>了 (tôi đã quen rồi); là danh từ, thói quen.</li>
<li><strong>Động-tân việc nhà</strong>: 做饭 (nấu cơm), 打扫 (dọn dẹp), 洗衣服 (giặt quần áo), 收拾房间 (dọn phòng).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你每天做饭吗？ Nǐ měitiān zuò fàn ma? (Bạn nấu cơm mỗi ngày không?)
B: 是，我一回家就做饭。 Shì, wǒ yì huí jiā jiù zuò fàn. (Có, hễ về nhà là tôi nấu.)
A: 谁打扫房间？ Shéi dǎsǎo fángjiān? (Ai dọn phòng?)
B: 我自己打扫，已经习惯了。 Wǒ zìjǐ dǎsǎo, yǐjīng xíguàn le. (Tôi tự dọn, đã quen rồi.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 一…就… nối hai sự việc theo thời gian: việc đầu kích hoạt việc sau. 自己 có thể đứng riêng hoặc theo sau đại từ: 我自己 (tự tôi), 他自己 (tự anh ấy).</div>`,
  ]]);

const b3q = quiz('chi311-quiz-3', 'Quiz 3 — Chores &amp; habits|||Quiz 3 — Việc nhà', [
  { id: 'q1', question: 'Mẫu "一…就…" diễn đạt điều gì? / What does 一…就… express?', options: ['so sánh|||comparison', 'hễ A là B ngay|||as soon as A, then B', 'phủ định|||negation', 'khả năng|||possibility'], correctIndex: 1, explanation: '一…就… nối hai sự việc: 我一回家就做饭 = hễ về nhà là tôi nấu cơm.' },
  { id: 'q2', question: '"我自己打扫" nghĩa là? / What does 我自己打扫 mean?', options: ['Có người dọn giúp tôi|||someone cleans for me', 'Tôi tự dọn dẹp|||I clean it myself', 'Tôi không dọn|||I do not clean', 'Tôi dọn cho bạn|||I clean for you'], correctIndex: 1, explanation: '自己 = tự mình: 我自己打扫 = tôi tự dọn dẹp.' },
  { id: 'q3', question: '"做饭" (zuò fàn) nghĩa là? / What does 做饭 mean?', options: ['ăn cơm|||to eat', 'nấu cơm|||to cook', 'mua cơm|||to buy food', 'rửa bát|||to wash dishes'], correctIndex: 1, explanation: '做 (làm) + 饭 (cơm) = nấu cơm, nấu ăn.' },
]);

const b4 = doc('chi311-4-1-health', 'Lesson 4 — Health &amp; seeing a doctor|||Bài 4 — Sức khỏe &amp; khám bệnh',
  'Từ vựng: 生病, 感冒, 发烧, 看病, 药, 舒服, 越来越, 医院, 应该, 休息. Ngữ pháp: 越来越+tính từ, 不舒服, 应该 (nên), động-tân 生病/看病/发烧.',
  [[
    `<span class="eyebrow">CHI311 · Lesson 4 · Health</span>
<h2>Health &amp; seeing a doctor (生病看病)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>生病</td><td>shēng bìng</td><td>to get sick</td></tr>
<tr><td>感冒</td><td>gǎnmào</td><td>to catch a cold</td></tr>
<tr><td>发烧</td><td>fā shāo</td><td>to have a fever</td></tr>
<tr><td>看病</td><td>kàn bìng</td><td>to see a doctor</td></tr>
<tr><td>药</td><td>yào</td><td>medicine</td></tr>
<tr><td>舒服</td><td>shūfu</td><td>comfortable / well</td></tr>
<tr><td>越来越</td><td>yuèláiyuè</td><td>more and more</td></tr>
<tr><td>医院</td><td>yīyuàn</td><td>hospital</td></tr>
<tr><td>应该</td><td>yīnggāi</td><td>should / ought to</td></tr>
<tr><td>休息</td><td>xiūxi</td><td>to rest</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>越来越 + adjective</strong> = more and more: 天气<strong>越来越</strong>热 (the weather is getting hotter and hotter); 病<strong>越来越</strong>重 (the illness gets worse).</li>
<li><strong>不舒服 bù shūfu</strong> = to feel unwell: 我今天<strong>不舒服</strong> (I do not feel well today).</li>
<li><strong>应该 yīnggāi</strong> = should: 你<strong>应该</strong>去看病 (you should go see a doctor).</li>
<li><strong>Verb-object health words</strong>: 生病 (fall ill), 看病 (see a doctor), 发烧 (run a fever), 吃药 (take medicine).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你怎么了？ Nǐ zěnme le? (What is wrong?)
B: 我感冒了，还发烧，很不舒服。 Wǒ gǎnmào le, hái fā shāo, hěn bù shūfu. (I have a cold and a fever, I feel unwell.)
A: 越来越严重，你应该去看病。 Yuèláiyuè yánzhòng, nǐ yīnggāi qù kàn bìng. (It gets worse, you should see a doctor.)
B: 好，我去医院吃点儿药，休息休息。 Hǎo, wǒ qù yīyuàn chī diǎnr yào, xiūxi xiūxi. (Ok, I will go to the hospital, take some medicine and rest.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 越来越 is followed directly by an adjective or a mental verb — 越来越冷, 越来越喜欢. Do not add 很 after it.</div>`,
    `<span class="eyebrow">CHI311 · Bài 4 · Sức khỏe</span>
<h2>Sức khỏe &amp; khám bệnh (生病看病)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>生病</td><td>shēng bìng</td><td>ốm, bị bệnh</td></tr>
<tr><td>感冒</td><td>gǎnmào</td><td>cảm cúm, cảm lạnh</td></tr>
<tr><td>发烧</td><td>fā shāo</td><td>sốt</td></tr>
<tr><td>看病</td><td>kàn bìng</td><td>khám bệnh</td></tr>
<tr><td>药</td><td>yào</td><td>thuốc</td></tr>
<tr><td>舒服</td><td>shūfu</td><td>dễ chịu, khỏe</td></tr>
<tr><td>越来越</td><td>yuèláiyuè</td><td>càng ngày càng</td></tr>
<tr><td>医院</td><td>yīyuàn</td><td>bệnh viện</td></tr>
<tr><td>应该</td><td>yīnggāi</td><td>nên</td></tr>
<tr><td>休息</td><td>xiūxi</td><td>nghỉ ngơi</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>越来越 + tính từ</strong> = càng ngày càng: 天气<strong>越来越</strong>热 (thời tiết càng ngày càng nóng); 病<strong>越来越</strong>重 (bệnh nặng hơn).</li>
<li><strong>不舒服 bù shūfu</strong> = thấy khó chịu, không khỏe: 我今天<strong>不舒服</strong> (hôm nay tôi không khỏe).</li>
<li><strong>应该 yīnggāi</strong> = nên: 你<strong>应该</strong>去看病 (bạn nên đi khám bệnh).</li>
<li><strong>Động-tân về bệnh</strong>: 生病 (bị bệnh), 看病 (khám bệnh), 发烧 (sốt), 吃药 (uống thuốc).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你怎么了？ Nǐ zěnme le? (Bạn sao vậy?)
B: 我感冒了，还发烧，很不舒服。 Wǒ gǎnmào le, hái fā shāo, hěn bù shūfu. (Tôi bị cảm, còn sốt, rất khó chịu.)
A: 越来越严重，你应该去看病。 Yuèláiyuè yánzhòng, nǐ yīnggāi qù kàn bìng. (Càng lúc càng nặng, bạn nên đi khám.)
B: 好，我去医院吃点儿药，休息休息。 Hǎo, wǒ qù yīyuàn chī diǎnr yào, xiūxi xiūxi. (Được, tôi tới bệnh viện uống ít thuốc rồi nghỉ.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 越来越 đứng ngay trước tính từ hoặc động từ tâm lý — 越来越冷, 越来越喜欢. Không thêm 很 sau nó.</div>`,
  ]]);

const b4q = quiz('chi311-quiz-4', 'Quiz 4 — Health &amp; seeing a doctor|||Quiz 4 — Sức khỏe', [
  { id: 'q1', question: 'Mẫu "越来越 + tính từ" nghĩa là? / What does 越来越 + adjective mean?', options: ['ít hơn|||less and less', 'càng ngày càng|||more and more', 'bằng nhau|||the same', 'đôi khi|||sometimes'], correctIndex: 1, explanation: '越来越 = càng ngày càng: 越来越热 = càng ngày càng nóng. Không thêm 很.' },
  { id: 'q2', question: '"发烧" (fā shāo) nghĩa là? / What does 发烧 mean?', options: ['ho|||to cough', 'sốt|||to have a fever', 'đau bụng|||stomachache', 'buồn ngủ|||sleepy'], correctIndex: 1, explanation: '发烧 = bị sốt; thường đi cùng 感冒 (cảm cúm).' },
  { id: 'q3', question: 'Khuyên ai đó đi khám dùng từ nào? / Which word gives advice to see a doctor?', options: ['应该 yīnggāi', '押金 yājīn', '习惯 xíguàn', '简单 jiǎndān'], correctIndex: 0, explanation: '应该 = nên: 你应该去看病 = bạn nên đi khám bệnh.' },
]);

const b5 = doc('chi311-5-1-travel', 'Lesson 5 — Travel|||Bài 5 — Đi lại &amp; du lịch',
  'Từ vựng: 旅行, 火车, 飞机, 订, 护照, 签证, 机票, 行李, 出发. Ngữ pháp: 坐火车/坐飞机, 订 (đặt vé/phòng), 一…就… trong du lịch, 需要 护照和签证.',
  [[
    `<span class="eyebrow">CHI311 · Lesson 5 · Travel</span>
<h2>Travel (旅行)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>旅行</td><td>lǚxíng</td><td>to travel</td></tr>
<tr><td>火车</td><td>huǒchē</td><td>train</td></tr>
<tr><td>飞机</td><td>fēijī</td><td>airplane</td></tr>
<tr><td>订</td><td>dìng</td><td>to book / reserve</td></tr>
<tr><td>护照</td><td>hùzhào</td><td>passport</td></tr>
<tr><td>签证</td><td>qiānzhèng</td><td>visa</td></tr>
<tr><td>机票</td><td>jīpiào</td><td>plane ticket</td></tr>
<tr><td>行李</td><td>xíngli</td><td>luggage</td></tr>
<tr><td>出发</td><td>chūfā</td><td>to set off</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>坐 + vehicle</strong> (from CHI121): 坐<strong>火车</strong> (go by train), 坐<strong>飞机</strong> (go by plane).</li>
<li><strong>订 dìng</strong> = to book: <strong>订</strong>机票 (book a plane ticket), <strong>订</strong>房间 (book a room).</li>
<li><strong>一 … 就 …</strong> in travel: 我<strong>一</strong>到<strong>就</strong>给你打电话 (as soon as I arrive I will call you).</li>
<li><strong>需要 xūyào</strong> = to need: 出国<strong>需要</strong>护照和签证 (going abroad needs a passport and a visa).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 放假我想去旅行。 Fàngjià wǒ xiǎng qù lǚxíng. (On vacation I want to travel.)
B: 你坐火车还是坐飞机？ Nǐ zuò huǒchē háishi zuò fēijī? (By train or by plane?)
A: 坐飞机。我已经订了机票。 Zuò fēijī. Wǒ yǐjīng dìng le jīpiào. (By plane. I have already booked the ticket.)
B: 别忘了带护照和签证。 Bié wàng le dài hùzhào hé qiānzhèng. (Do not forget to bring your passport and visa.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 还是 háishi asks an either-or question (train or plane?); 或者 huòzhě states an or in a statement. Use 还是 in questions.</div>`,
    `<span class="eyebrow">CHI311 · Bài 5 · Du lịch</span>
<h2>Đi lại &amp; du lịch (旅行)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>旅行</td><td>lǚxíng</td><td>du lịch</td></tr>
<tr><td>火车</td><td>huǒchē</td><td>tàu hỏa</td></tr>
<tr><td>飞机</td><td>fēijī</td><td>máy bay</td></tr>
<tr><td>订</td><td>dìng</td><td>đặt (vé, phòng)</td></tr>
<tr><td>护照</td><td>hùzhào</td><td>hộ chiếu</td></tr>
<tr><td>签证</td><td>qiānzhèng</td><td>thị thực, visa</td></tr>
<tr><td>机票</td><td>jīpiào</td><td>vé máy bay</td></tr>
<tr><td>行李</td><td>xíngli</td><td>hành lý</td></tr>
<tr><td>出发</td><td>chūfā</td><td>xuất phát</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>坐 + phương tiện</strong> (từ CHI121): 坐<strong>火车</strong> (đi tàu hỏa), 坐<strong>飞机</strong> (đi máy bay).</li>
<li><strong>订 dìng</strong> = đặt: <strong>订</strong>机票 (đặt vé máy bay), <strong>订</strong>房间 (đặt phòng).</li>
<li><strong>一 … 就 …</strong> trong du lịch: 我<strong>一</strong>到<strong>就</strong>给你打电话 (hễ tới nơi là tôi gọi bạn).</li>
<li><strong>需要 xūyào</strong> = cần: 出国<strong>需要</strong>护照和签证 (ra nước ngoài cần hộ chiếu và visa).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 放假我想去旅行。 Fàngjià wǒ xiǎng qù lǚxíng. (Nghỉ lễ tôi muốn đi du lịch.)
B: 你坐火车还是坐飞机？ Nǐ zuò huǒchē háishi zuò fēijī? (Bạn đi tàu hay đi máy bay?)
A: 坐飞机。我已经订了机票。 Zuò fēijī. Wǒ yǐjīng dìng le jīpiào. (Đi máy bay. Tôi đã đặt vé rồi.)
B: 别忘了带护照和签证。 Bié wàng le dài hùzhào hé qiānzhèng. (Đừng quên mang hộ chiếu và visa.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 还是 háishi hỏi lựa chọn A hay B (tàu hay máy bay?); 或者 huòzhě nêu "hoặc" trong câu trần thuật. Câu hỏi lựa chọn dùng 还是.</div>`,
  ]]);

const b5q = quiz('chi311-quiz-5', 'Quiz 5 — Travel|||Quiz 5 — Du lịch', [
  { id: 'q1', question: '"订机票" (dìng jīpiào) nghĩa là? / What does 订机票 mean?', options: ['huỷ vé máy bay|||cancel a ticket', 'đặt vé máy bay|||to book a plane ticket', 'mất vé máy bay|||lose a ticket', 'in vé máy bay|||print a ticket'], correctIndex: 1, explanation: '订 = đặt/đặt trước; 机票 = vé máy bay; 订机票 = đặt vé máy bay.' },
  { id: 'q2', question: 'Ra nước ngoài cần giấy tờ gì? / What documents do you need to go abroad?', options: ['成绩和押金|||grades and deposit', '护照和签证|||passport and visa', '行李和火车|||luggage and train', '家具和房租|||furniture and rent'], correctIndex: 1, explanation: '出国需要护照 (hộ chiếu) 和签证 (visa).' },
  { id: 'q3', question: 'Câu hỏi lựa chọn "tàu hay máy bay" dùng từ nào? / Which word makes an either-or question?', options: ['或者 huòzhě', '还是 háishi', '因为 yīnwèi', '所以 suǒyǐ'], correctIndex: 1, explanation: '还是 dùng trong câu hỏi lựa chọn: 坐火车还是坐飞机? 或者 dùng trong câu trần thuật.' },
]);

const b6 = doc('chi311-6-1-seasons', 'Lesson 6 — Seasons &amp; climate|||Bài 6 — Thời tiết &amp; khí hậu',
  'Từ vựng: 季节, 春天, 夏天, 秋天, 冬天, 凉快, 暖和, 预报, 可能, 气候. Ngữ pháp: bốn mùa, 比…更… (còn hơn cả), 可能 (có thể), 凉快/暖和.',
  [[
    `<span class="eyebrow">CHI311 · Lesson 6 · Seasons</span>
<h2>Seasons &amp; climate (季节和气候)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>季节</td><td>jìjié</td><td>season</td></tr>
<tr><td>春天</td><td>chūntiān</td><td>spring</td></tr>
<tr><td>夏天</td><td>xiàtiān</td><td>summer</td></tr>
<tr><td>秋天</td><td>qiūtiān</td><td>autumn</td></tr>
<tr><td>冬天</td><td>dōngtiān</td><td>winter</td></tr>
<tr><td>凉快</td><td>liángkuai</td><td>cool (pleasant)</td></tr>
<tr><td>暖和</td><td>nuǎnhuo</td><td>warm</td></tr>
<tr><td>预报</td><td>yùbào</td><td>forecast</td></tr>
<tr><td>可能</td><td>kěnéng</td><td>maybe / possible</td></tr>
<tr><td>气候</td><td>qìhòu</td><td>climate</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>The four seasons</strong>: 春天 (spring), 夏天 (summer), 秋天 (autumn), 冬天 (winter); each 天 here means the season.</li>
<li><strong>比 … 更 …</strong> = even more than: 今天<strong>比</strong>昨天<strong>更</strong>热 (today is even hotter than yesterday). 更 adds emphasis to 比.</li>
<li><strong>可能 kěnéng</strong> = maybe: 明天<strong>可能</strong>下雨 (maybe it will rain tomorrow).</li>
<li><strong>凉快 &amp; 暖和</strong>: pleasant temperatures — 秋天很<strong>凉快</strong>, 春天很<strong>暖和</strong>.</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你喜欢哪个季节？ Nǐ xǐhuan nǎge jìjié? (Which season do you like?)
B: 秋天，又凉快又舒服。 Qiūtiān, yòu liángkuai yòu shūfu. (Autumn, cool and comfortable.)
A: 明天天气怎么样？ Míngtiān tiānqì zěnmeyàng? (How is the weather tomorrow?)
B: 预报说可能比今天更冷。 Yùbào shuō kěnéng bǐ jīntiān gèng lěng. (The forecast says maybe even colder than today.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 凉快 is a pleasant cool; 冷 is plain cold. Add 更 inside a 比 sentence to say even more: A 比 B 更 + adjective.</div>`,
    `<span class="eyebrow">CHI311 · Bài 6 · Khí hậu</span>
<h2>Thời tiết &amp; khí hậu (季节和气候)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>季节</td><td>jìjié</td><td>mùa</td></tr>
<tr><td>春天</td><td>chūntiān</td><td>mùa xuân</td></tr>
<tr><td>夏天</td><td>xiàtiān</td><td>mùa hè</td></tr>
<tr><td>秋天</td><td>qiūtiān</td><td>mùa thu</td></tr>
<tr><td>冬天</td><td>dōngtiān</td><td>mùa đông</td></tr>
<tr><td>凉快</td><td>liángkuai</td><td>mát mẻ</td></tr>
<tr><td>暖和</td><td>nuǎnhuo</td><td>ấm áp</td></tr>
<tr><td>预报</td><td>yùbào</td><td>dự báo</td></tr>
<tr><td>可能</td><td>kěnéng</td><td>có thể, khả năng</td></tr>
<tr><td>气候</td><td>qìhòu</td><td>khí hậu</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>Bốn mùa</strong>: 春天 (xuân), 夏天 (hè), 秋天 (thu), 冬天 (đông); chữ 天 ở đây chỉ mùa.</li>
<li><strong>比 … 更 …</strong> = còn hơn cả: 今天<strong>比</strong>昨天<strong>更</strong>热 (hôm nay còn nóng hơn hôm qua). 更 nhấn mạnh cho 比.</li>
<li><strong>可能 kěnéng</strong> = có thể: 明天<strong>可能</strong>下雨 (mai có thể mưa).</li>
<li><strong>凉快 &amp; 暖和</strong>: nhiệt độ dễ chịu — 秋天很<strong>凉快</strong>, 春天很<strong>暖和</strong>.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你喜欢哪个季节？ Nǐ xǐhuan nǎge jìjié? (Bạn thích mùa nào?)
B: 秋天，又凉快又舒服。 Qiūtiān, yòu liángkuai yòu shūfu. (Mùa thu, vừa mát vừa dễ chịu.)
A: 明天天气怎么样？ Míngtiān tiānqì zěnmeyàng? (Mai thời tiết thế nào?)
B: 预报说可能比今天更冷。 Yùbào shuō kěnéng bǐ jīntiān gèng lěng. (Dự báo nói có thể còn lạnh hơn hôm nay.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 凉快 là mát mẻ dễ chịu; 冷 là lạnh thường. Thêm 更 vào câu 比 để nói "còn hơn": A 比 B 更 + tính từ.</div>`,
  ]]);

const b6q = quiz('chi311-quiz-6', 'Quiz 6 — Seasons &amp; climate|||Quiz 6 — Khí hậu', [
  { id: 'q1', question: '"秋天" (qiūtiān) là mùa nào? / Which season is 秋天?', options: ['mùa xuân|||spring', 'mùa hè|||summer', 'mùa thu|||autumn', 'mùa đông|||winter'], correctIndex: 2, explanation: '春天 xuân, 夏天 hè, 秋天 thu, 冬天 đông.' },
  { id: 'q2', question: 'Câu 今天比昨天更热 nghĩa là? / What does 今天比昨天更热 mean?', options: ['Hôm nay mát hơn|||cooler today', 'Hôm nay còn nóng hơn hôm qua|||even hotter than yesterday', 'Hôm qua nóng hơn|||yesterday was hotter', 'Hai ngày bằng nhau|||the same'], correctIndex: 1, explanation: '比…更… = còn hơn cả: 今天比昨天更热 = hôm nay còn nóng hơn hôm qua.' },
  { id: 'q3', question: '"可能" (kěnéng) nghĩa là? / What does 可能 mean?', options: ['chắc chắn|||certainly', 'có thể / có lẽ|||maybe / possible', 'không bao giờ|||never', 'đã xong|||already done'], correctIndex: 1, explanation: '可能 = có thể, có lẽ: 明天可能下雨 = mai có thể mưa.' },
]);

const b7 = doc('chi311-7-1-shopping-advanced', 'Lesson 7 — Advanced shopping|||Bài 7 — Mua sắm nâng cao',
  'Từ vựng: 讨价还价, 质量, 牌子, 退换, 打折, 顾客, 售货员, 便宜. Ngữ pháp: 不但…而且… (không những…mà còn…), 打折 (打八折 = giảm 20%), 退换, 讨价还价.',
  [[
    `<span class="eyebrow">CHI311 · Lesson 7 · Advanced shopping</span>
<h2>Advanced shopping (购物进阶)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>讨价还价</td><td>tǎojià huánjià</td><td>to bargain</td></tr>
<tr><td>质量</td><td>zhìliàng</td><td>quality</td></tr>
<tr><td>牌子</td><td>páizi</td><td>brand</td></tr>
<tr><td>退换</td><td>tuìhuàn</td><td>to return / exchange</td></tr>
<tr><td>打折</td><td>dǎ zhé</td><td>to give a discount</td></tr>
<tr><td>顾客</td><td>gùkè</td><td>customer</td></tr>
<tr><td>售货员</td><td>shòuhuòyuán</td><td>shop assistant</td></tr>
<tr><td>便宜</td><td>piányi</td><td>cheap</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>不但 … 而且 …</strong> = not only … but also: 这个牌子<strong>不但</strong>质量好<strong>而且</strong>不贵 (this brand is not only good quality but also not expensive).</li>
<li><strong>打折 dǎ zhé</strong>: 打<strong>八</strong>折 means you pay 80 percent, so it is 20 percent off; 打<strong>五</strong>折 is half price.</li>
<li><strong>退换 tuìhuàn</strong> = return or exchange: 可以<strong>退换</strong>吗? (can I return or exchange it?).</li>
<li><strong>讨价还价</strong> = to haggle over the price, common in markets, not in fixed-price shops.</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 这个牌子的衣服质量怎么样？ Zhège páizi de yīfu zhìliàng zěnmeyàng? (How is this brand quality?)
B: 不但质量好，而且现在打折。 Búdàn zhìliàng hǎo, érqiě xiànzài dǎ zhé. (Not only good quality, but also on sale now.)
A: 打几折？可以退换吗？ Dǎ jǐ zhé? Kěyǐ tuìhuàn ma? (What discount? Can I return or exchange it?)
B: 打八折，七天内可以退换。 Dǎ bā zhé, qī tiān nèi kěyǐ tuìhuàn. (20 percent off, return within 7 days.)
</code></pre>
<div class="callout"><span class="badge">Note</span> In Chinese, 打八折 (bā zhé) states the price you pay, not the discount: 八折 = 80 percent of the price = 20 percent off. So a smaller number means a bigger discount.</div>`,
    `<span class="eyebrow">CHI311 · Bài 7 · Mua sắm nâng cao</span>
<h2>Mua sắm nâng cao (购物进阶)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>讨价还价</td><td>tǎojià huánjià</td><td>mặc cả, trả giá</td></tr>
<tr><td>质量</td><td>zhìliàng</td><td>chất lượng</td></tr>
<tr><td>牌子</td><td>páizi</td><td>nhãn hiệu, thương hiệu</td></tr>
<tr><td>退换</td><td>tuìhuàn</td><td>đổi trả</td></tr>
<tr><td>打折</td><td>dǎ zhé</td><td>giảm giá</td></tr>
<tr><td>顾客</td><td>gùkè</td><td>khách hàng</td></tr>
<tr><td>售货员</td><td>shòuhuòyuán</td><td>nhân viên bán hàng</td></tr>
<tr><td>便宜</td><td>piányi</td><td>rẻ</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>不但 … 而且 …</strong> = không những … mà còn: 这个牌子<strong>不但</strong>质量好<strong>而且</strong>不贵 (nhãn này không những chất lượng tốt mà còn không đắt).</li>
<li><strong>打折 dǎ zhé</strong>: 打<strong>八</strong>折 nghĩa là trả 80 phần trăm, tức giảm 20 phần trăm; 打<strong>五</strong>折 là nửa giá.</li>
<li><strong>退换 tuìhuàn</strong> = trả lại hoặc đổi: 可以<strong>退换</strong>吗? (đổi trả được không?).</li>
<li><strong>讨价还价</strong> = mặc cả, hay dùng ở chợ, không dùng ở cửa hàng niêm yết giá.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 这个牌子的衣服质量怎么样？ Zhège páizi de yīfu zhìliàng zěnmeyàng? (Áo nhãn này chất lượng thế nào?)
B: 不但质量好，而且现在打折。 Búdàn zhìliàng hǎo, érqiě xiànzài dǎ zhé. (Không những chất lượng tốt mà còn đang giảm giá.)
A: 打几折？可以退换吗？ Dǎ jǐ zhé? Kěyǐ tuìhuàn ma? (Giảm mấy phần? Đổi trả được không?)
B: 打八折，七天内可以退换。 Dǎ bā zhé, qī tiān nèi kěyǐ tuìhuàn. (Giảm 20 phần trăm, đổi trả trong 7 ngày.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Tiếng Trung 打八折 nêu mức giá phải trả chứ không phải mức giảm: 八折 = 80 phần trăm giá = giảm 20 phần trăm. Số càng nhỏ, giảm càng nhiều.</div>`,
  ]]);

const b7q = quiz('chi311-quiz-7', 'Quiz 7 — Advanced shopping|||Quiz 7 — Mua sắm nâng cao', [
  { id: 'q1', question: 'Mẫu "不但…而且…" nghĩa là? / What does 不但…而且… mean?', options: ['hoặc … hoặc …|||either … or …', 'không những … mà còn …|||not only … but also …', 'nếu … thì …|||if … then …', 'tuy … nhưng …|||although … but …'], correctIndex: 1, explanation: '不但…而且… = không những … mà còn …: 不但质量好而且不贵.' },
  { id: 'q2', question: '"打八折" (dǎ bā zhé) nghĩa là gì? / What does 打八折 mean?', options: ['giảm 80 phần trăm|||80 percent off', 'trả 80 phần trăm giá, tức giảm 20 phần trăm|||pay 80 percent, so 20 percent off', 'tăng giá 80 phần trăm|||80 percent more', 'không giảm giá|||no discount'], correctIndex: 1, explanation: '打八折 = trả 80 phần trăm giá = giảm 20 phần trăm. Số càng nhỏ, giảm càng nhiều.' },
  { id: 'q3', question: '"退换" (tuìhuàn) nghĩa là? / What does 退换 mean?', options: ['mua thêm|||buy more', 'đổi trả|||return or exchange', 'thanh toán|||pay', 'gói lại|||wrap up'], correctIndex: 1, explanation: '退 (trả lại) + 换 (đổi) = đổi trả hàng: 七天内可以退换.' },
]);

const b8 = doc('chi311-8-1-hobbies', 'Lesson 8 — Hobbies &amp; entertainment|||Bài 8 — Sở thích &amp; giải trí',
  'Từ vựng: 爱好, 参加, 比赛, 表演, 唱歌, 跳舞, 练习, 不错. Ngữ pháp: 爱好 (sở thích), 参加比赛, bổ ngữ trình độ 得 (唱得好), 越…越… (càng…càng…).',
  [[
    `<span class="eyebrow">CHI311 · Lesson 8 · Hobbies</span>
<h2>Hobbies &amp; entertainment (爱好和娱乐)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>爱好</td><td>àihào</td><td>hobby</td></tr>
<tr><td>参加</td><td>cānjiā</td><td>to take part in</td></tr>
<tr><td>比赛</td><td>bǐsài</td><td>competition / match</td></tr>
<tr><td>表演</td><td>biǎoyǎn</td><td>to perform; a show</td></tr>
<tr><td>唱歌</td><td>chàng gē</td><td>to sing</td></tr>
<tr><td>跳舞</td><td>tiào wǔ</td><td>to dance</td></tr>
<tr><td>练习</td><td>liànxí</td><td>to practice</td></tr>
<tr><td>不错</td><td>búcuò</td><td>not bad / pretty good</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>爱好 àihào</strong> = hobby (noun): 我的<strong>爱好</strong>是唱歌 (my hobby is singing).</li>
<li><strong>参加 cānjiā</strong> = to join / take part: <strong>参加</strong>比赛 (enter a competition).</li>
<li><strong>Verb + 得 + adjective</strong> (degree): 他唱<strong>得</strong>很好 (he sings very well), 跳<strong>得</strong>不错 (dances quite well).</li>
<li><strong>越 … 越 …</strong> = the more … the more: 我<strong>越</strong>练<strong>越</strong>好 (the more I practice the better I get).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你有什么爱好？ Nǐ yǒu shénme àihào? (What hobbies do you have?)
B: 我喜欢唱歌，唱得还不错。 Wǒ xǐhuan chàng gē, chàng de hái búcuò. (I like singing, I sing pretty well.)
A: 下周有比赛，你参加吗？ Xià zhōu yǒu bǐsài, nǐ cānjiā ma? (There is a competition next week, will you join?)
B: 参加！我越练越好。 Cānjiā! Wǒ yuè liàn yuè hǎo. (Yes! The more I practice the better.)
</code></pre>
<div class="callout"><span class="badge">Note</span> The 得 here (Verb + 得 + adjective) shows how well you do something and is read neutral <em>de</em>. Do not confuse it with 得 read <em>děi</em> meaning must.</div>`,
    `<span class="eyebrow">CHI311 · Bài 8 · Sở thích</span>
<h2>Sở thích &amp; giải trí (爱好和娱乐)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>爱好</td><td>àihào</td><td>sở thích</td></tr>
<tr><td>参加</td><td>cānjiā</td><td>tham gia</td></tr>
<tr><td>比赛</td><td>bǐsài</td><td>cuộc thi, trận đấu</td></tr>
<tr><td>表演</td><td>biǎoyǎn</td><td>biểu diễn; buổi diễn</td></tr>
<tr><td>唱歌</td><td>chàng gē</td><td>hát</td></tr>
<tr><td>跳舞</td><td>tiào wǔ</td><td>nhảy múa</td></tr>
<tr><td>练习</td><td>liànxí</td><td>luyện tập</td></tr>
<tr><td>不错</td><td>búcuò</td><td>khá tốt, không tệ</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>爱好 àihào</strong> = sở thích (danh từ): 我的<strong>爱好</strong>是唱歌 (sở thích của tôi là hát).</li>
<li><strong>参加 cānjiā</strong> = tham gia: <strong>参加</strong>比赛 (dự thi, tham gia cuộc thi).</li>
<li><strong>Động từ + 得 + tính từ</strong> (bổ ngữ trình độ): 他唱<strong>得</strong>很好 (bạn ấy hát rất hay), 跳<strong>得</strong>不错 (nhảy khá đẹp).</li>
<li><strong>越 … 越 …</strong> = càng … càng: 我<strong>越</strong>练<strong>越</strong>好 (tôi càng luyện càng giỏi).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你有什么爱好？ Nǐ yǒu shénme àihào? (Bạn có sở thích gì?)
B: 我喜欢唱歌，唱得还不错。 Wǒ xǐhuan chàng gē, chàng de hái búcuò. (Tôi thích hát, hát cũng khá.)
A: 下周有比赛，你参加吗？ Xià zhōu yǒu bǐsài, nǐ cānjiā ma? (Tuần sau có cuộc thi, bạn tham gia không?)
B: 参加！我越练越好。 Cānjiā! Wǒ yuè liàn yuè hǎo. (Tham gia! Tôi càng luyện càng giỏi.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Chữ 得 ở đây (Động từ + 得 + tính từ) cho biết làm việc gì đó tốt đến mức nào, đọc thanh nhẹ <em>de</em>. Đừng nhầm với 得 đọc <em>děi</em> nghĩa là phải.</div>`,
  ]]);

const b8q = quiz('chi311-quiz-8', 'Quiz 8 — Hobbies &amp; entertainment|||Quiz 8 — Sở thích', [
  { id: 'q1', question: '"参加比赛" (cānjiā bǐsài) nghĩa là? / What does 参加比赛 mean?', options: ['xem trận đấu|||watch a match', 'tham gia cuộc thi|||to take part in a competition', 'thắng cuộc thi|||win a match', 'huỷ cuộc thi|||cancel a match'], correctIndex: 1, explanation: '参加 = tham gia; 比赛 = cuộc thi; 参加比赛 = tham gia cuộc thi.' },
  { id: 'q2', question: 'Câu 他唱得很好 nghĩa là? / What does 他唱得很好 mean?', options: ['Bạn ấy muốn hát|||he wants to sing', 'Bạn ấy hát rất hay|||he sings very well', 'Bạn ấy phải hát|||he must sing', 'Bạn ấy không hát|||he does not sing'], correctIndex: 1, explanation: 'Động từ + 得 + tính từ là bổ ngữ trình độ: 唱得很好 = hát rất hay. 得 đọc de.' },
  { id: 'q3', question: 'Mẫu "越…越…" nghĩa là? / What does 越…越… mean?', options: ['không những … mà còn …|||not only … but also …', 'càng … càng …|||the more … the more …', 'hễ … là …|||as soon as …', 'vừa … vừa …|||both … and …'], correctIndex: 1, explanation: '越…越… = càng … càng: 我越练越好 = tôi càng luyện càng giỏi.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CHI311',
    slug: 'chi311-integrated-chinese-3',
    title: 'Integrated Chinese 3',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHI311.webp',
    shortDescription: 'Integrated Chinese 3 (continues CHI121, Liu track) — study & exams, renting a home, chores & habits, health & the doctor, travel, seasons, advanced shopping and hobbies. Bilingual: vocabulary, grammar, dialogues & quizzes.|||Tiếng Trung tổng hợp 3 (nối tiếp CHI121, track Liu) — học tập & thi cử, thuê nhà, việc nhà & thói quen, sức khỏe & khám bệnh, du lịch, mùa & khí hậu, mua sắm nâng cao và sở thích. Song ngữ: từ vựng, ngữ pháp, hội thoại & quiz.',
    description: 'Môn <strong>CHI311 — Integrated Chinese 3 (Tiếng Trung tổng hợp 3)</strong> <strong>nối tiếp CHI121</strong> trên track <strong>Integrated Chinese</strong> (Liu et al., Cheng &amp; Tsui), đưa bạn từ mức tương đương HSK2 lên HSK3. Học tiếp qua các chủ đề đời sống mở rộng: <strong>học tập &amp; thi cử</strong> → <strong>thuê nhà</strong> → <strong>việc nhà &amp; thói quen</strong> → <strong>sức khỏe &amp; khám bệnh</strong> → <strong>du lịch</strong> → <strong>mùa &amp; khí hậu</strong> → <strong>mua sắm nâng cao</strong> → <strong>sở thích &amp; giải trí</strong>. Song ngữ Trung–Việt, mỗi bài có bảng từ vựng (汉字 | pinyin | nghĩa), điểm ngữ pháp kèm ví dụ, hội thoại ngắn, ghi chú và quiz.',
    whatYouLearn: 'Học tập &amp; thi cử (考试, 复习/预习, 成绩, bổ ngữ kết quả 听懂/看懂/记住, bổ ngữ trình độ 考得好, 复杂/简单); thuê nhà (租房, 公寓, 家具, 安静/干净, 合适, 押金, 房租, 又…又…); việc nhà &amp; thói quen (做饭, 打扫, 习惯, 自己, 一…就…); sức khỏe (生病, 感冒, 发烧, 看病, 药, 不舒服, 越来越, 应该); du lịch (旅行, 火车/飞机, 订机票, 护照/签证, 还是); mùa &amp; khí hậu (季节, 春夏秋冬, 凉快/暖和, 预报, 可能, 比…更…); mua sắm nâng cao (讨价还价, 质量, 牌子, 打折, 退换, 不但…而且…); sở thích (爱好, 参加比赛, 表演, bổ ngữ trình độ 得, 越…越…).',
    requirements: 'Cần hoàn thành CHI121 hoặc nắm vững pinyin, 4 thanh điệu, cách hỏi giá, 坐 + phương tiện, so sánh với 比, các mẫu 会…的 / 要…了 và từ vựng sinh hoạt cơ bản. Nên cài Pleco hoặc dùng từ điển hanzii.net để tra chữ &amp; nghe phát âm; luyện viết chữ Hán theo thứ tự nét.',
  },
  sections: [
    { title: '📚 Tài liệu &amp; lộ trình|||📚 Course materials', description: 'Giáo trình Integrated Chinese (cuối L1P2 → L2P1), workbook, app, từ điển, YouTube, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CHI121, track Integrated Chinese, mục tiêu HSK2 lên HSK3, cách học.', lessons: [intro] },
    { title: 'Bài 1 — Học tập &amp; thi cử|||Lesson 1 — Study &amp; exams', description: '考试, 复习/预习, 成绩, 听懂/看懂/记住, 复杂/简单.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Thuê nhà|||Lesson 2 — Renting a home', description: '租房, 公寓, 家具, 安静/干净, 合适, 押金, 房租.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Việc nhà &amp; thói quen|||Lesson 3 — Chores &amp; habits', description: '做饭, 打扫, 习惯, 自己, 一…就…', lessons: [b3, b3q] },
    { title: 'Bài 4 — Sức khỏe &amp; khám bệnh|||Lesson 4 — Health', description: '生病, 感冒, 发烧, 看病, 药, 越来越, 应该.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Du lịch|||Lesson 5 — Travel', description: '旅行, 火车/飞机, 订机票, 护照/签证, 还是.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Khí hậu|||Lesson 6 — Seasons &amp; climate', description: '季节, 春夏秋冬, 凉快/暖和, 预报, 可能, 比…更…', lessons: [b6, b6q] },
    { title: 'Bài 7 — Mua sắm nâng cao|||Lesson 7 — Advanced shopping', description: '讨价还价, 质量, 牌子, 打折, 退换, 不但…而且…', lessons: [b7, b7q] },
    { title: 'Bài 8 — Sở thích|||Lesson 8 — Hobbies', description: '爱好, 参加比赛, 表演, bổ ngữ 得, 越…越…', lessons: [b8, b8q] },
  ],
};
