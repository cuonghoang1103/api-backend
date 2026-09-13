/**
 * CHI331 — Integrated Chinese 5 (Tiếng Trung tổng hợp 5). Khối Ngôn ngữ Trung
 * FPTU. NỐI TIẾP CHI321. Đây là MÔN NGÔN NGỮ: cấu trúc theo BÀI HỌC TIẾNG (từ
 * vựng, ngữ pháp, hội thoại, luyện tập) theo track "Integrated Chinese", bám
 * Level 2 Part 2 (Liu et al., Cheng &amp; Tsui) — mức tương đương HSK3 lên HSK4.
 * Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick lồng/${; trong HTML content "&" → "&amp;". shortDescription
 * dùng "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chi331-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình học',
  'Giáo trình chuẩn (Integrated Chinese Level 2 Part 2, Liu et al.), workbook & character workbook, app (Pleco/Anki), từ điển hanzii.net, YouTube, lộ trình 4 bước. Nhắc lại nền tảng CHI321.',
  [[
    `<span class="eyebrow">CHI331 · Materials</span>
<h2>How to keep learning Chinese — materials &amp; roadmap</h2>
<p class="lead">Integrated Chinese 5 <strong>continues CHI321</strong> on the <strong>Integrated Chinese</strong> track: it assumes you already have the 把 sentence, the 被 passive, potential complements, and connectives such as 虽然…但是 and 不但…而且. It now moves toward more abstract topics — culture and customs, East-West differences, study pressure, the environment, technology, health habits, friendship and future careers — at roughly <strong>HSK3 rising to HSK4</strong>. Below are the standard textbook plus free tools.</p>
<h3>📘 Standard textbook</h3>
<ul>
<li><strong>Integrated Chinese, Level 2 Part 2</strong> (Yuehua Liu, Tao-chung Yao et al. — Cheng &amp; Tsui) — the mainstream university coursebook this track continues into.</li>
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
<li><strong>Review CHI321</strong> — make sure the 把 sentence, the 被 passive, potential complements and 虽然…但是 are solid before you start.</li>
<li><strong>Vocabulary</strong> — learn hanzi in context, review daily with Anki/Pleco.</li>
<li><strong>Grammar</strong> — new HSK4 connectives (无论…都, 只要…就, 即使…也) build on old word order.</li>
<li><strong>Speaking</strong> — say every sentence out loud; shadow the audio.</li>
</ol></div>`,
    `<span class="eyebrow">CHI331 · Tài liệu</span>
<h2>Học tiếp tiếng Trung — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung tổng hợp 5 <strong>nối tiếp CHI321</strong> trên track <strong>Integrated Chinese</strong>: giả định bạn đã nắm câu chữ 把, câu bị động 被, bổ ngữ khả năng, cùng các liên từ như 虽然…但是 và 不但…而且. Giờ học chuyển sang các chủ đề trừu tượng hơn — văn hóa và phong tục, khác biệt Đông-Tây, áp lực học tập, môi trường, công nghệ, thói quen sức khỏe, tình bạn và nghề nghiệp tương lai — ở mức tương đương <strong>HSK3 lên HSK4</strong>. Bên dưới là giáo trình chuẩn cùng công cụ miễn phí.</p>
<h3>📘 Giáo trình chuẩn</h3>
<ul>
<li><strong>Integrated Chinese, Level 2 Part 2</strong> (Yuehua Liu, Tao-chung Yao và cộng sự — NXB Cheng &amp; Tsui) — giáo trình đại học mà track này học tiếp.</li>
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
<li><strong>Ôn CHI321</strong> — bảo đảm câu chữ 把, câu bị động 被, bổ ngữ khả năng và 虽然…但是 đã vững trước khi bắt đầu.</li>
<li><strong>Từ vựng</strong> — học chữ Hán trong ngữ cảnh, ôn mỗi ngày bằng Anki/Pleco.</li>
<li><strong>Ngữ pháp</strong> — liên từ HSK4 mới (无论…都, 只要…就, 即使…也) xây trên trật tự từ cũ.</li>
<li><strong>Luyện nói</strong> — đọc to mọi câu; nói nhại theo audio.</li>
</ol></div>`,
  ]]);

const intro = doc('chi331-0-1-overview', 'Course overview: Integrated Chinese 5|||Tổng quan: Tiếng Trung tổng hợp 5',
  'Nối tiếp CHI321 (câu chữ 把, câu bị động 被, bổ ngữ khả năng), track Integrated Chinese, mục tiêu HSK3 lên HSK4, và lộ trình 8 bài chủ đề trung cấp.',
  [[
    `<span class="eyebrow">CHI331 · Lesson 0.1 · Overview</span>
<h2>Integrated Chinese 5</h2>
<p class="lead">This course picks up right where <strong>CHI321</strong> left off, still on the <strong>Integrated Chinese</strong> (Liu et al.) track. You already have the 把 sentence, the 被 passive and potential complements; now you learn to talk about culture and customs, East-West differences, study pressure, the environment, technology and the internet, health habits, friendship, and dreams and careers.</p>
<h3>What is new at this level</h3>
<ul>
<li><strong>无论 … 都 …</strong> — 无论大人还是孩子，都应该保护环境 (no matter adults or children, everyone should protect the environment).</li>
<li><strong>只要 … 就 …</strong> — 只要努力，就会进步 (as long as you try hard, you will improve).</li>
<li><strong>即使 … 也 …</strong> — 即使很方便，也不能沉迷 (even if it is convenient, you must not get addicted).</li>
<li><strong>Compound directional complements 起来 / 下去</strong> — 紧张起来 (start to get nervous), 坚持下去 (keep going).</li>
</ul>
<h3>Roadmap of this course</h3>
<p>Culture &amp; customs → East-West differences → study &amp; stress → environment → technology &amp; internet → health &amp; habits → friendship → dreams &amp; careers. Every lesson has a vocabulary table (汉字 | pinyin | meaning), grammar points with examples, a short dialogue, notes, and a quiz.</p>`,
    `<span class="eyebrow">CHI331 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung tổng hợp 5</h2>
<p class="lead">Môn này học tiếp ngay từ chỗ <strong>CHI321</strong> dừng lại, vẫn trên track <strong>Integrated Chinese</strong> (Liu và cộng sự). Bạn đã có câu chữ 把, câu bị động 被 và bổ ngữ khả năng; giờ học cách nói về văn hóa và phong tục, khác biệt Đông-Tây, áp lực học tập, môi trường, công nghệ và internet, thói quen sức khỏe, tình bạn, và ước mơ cùng nghề nghiệp.</p>
<h3>Điểm mới ở trình độ này</h3>
<ul>
<li><strong>无论 … 都 …</strong> — 无论大人还是孩子，都应该保护环境 (bất kể người lớn hay trẻ em, đều nên bảo vệ môi trường).</li>
<li><strong>只要 … 就 …</strong> — 只要努力，就会进步 (chỉ cần cố gắng, sẽ tiến bộ).</li>
<li><strong>即使 … 也 …</strong> — 即使很方便，也不能沉迷 (dù rất tiện, cũng không được đắm chìm).</li>
<li><strong>Bổ ngữ xu hướng phức hợp 起来 / 下去</strong> — 紧张起来 (bắt đầu căng thẳng), 坚持下去 (kiên trì tiếp).</li>
</ul>
<h3>Lộ trình của môn</h3>
<p>Văn hóa &amp; phong tục → khác biệt Đông-Tây → học tập &amp; áp lực → môi trường → công nghệ &amp; internet → sức khỏe &amp; thói quen → tình bạn → ước mơ &amp; nghề nghiệp. Mỗi bài có bảng từ vựng (汉字 | pinyin | nghĩa), điểm ngữ pháp kèm ví dụ, một hội thoại ngắn, ghi chú, và quiz.</p>`,
  ]]);

const b1 = doc('chi331-1-1-culture-customs', 'Lesson 1 — Culture &amp; customs|||Bài 1 — Văn hóa &amp; phong tục',
  'Từ vựng: 文化, 风俗, 传统, 节日, 春节, 庆祝, 习惯, 举行, 随着. Ngữ pháp: 随着 (cùng với), 对…来说 (đối với…mà nói).',
  [[
    `<span class="eyebrow">CHI331 · Lesson 1 · Culture</span>
<h2>Culture &amp; customs (文化和风俗)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>文化</td><td>wénhuà</td><td>culture</td></tr>
<tr><td>风俗</td><td>fēngsú</td><td>custom</td></tr>
<tr><td>传统</td><td>chuántǒng</td><td>tradition; traditional</td></tr>
<tr><td>节日</td><td>jiérì</td><td>festival / holiday</td></tr>
<tr><td>春节</td><td>Chūnjié</td><td>Spring Festival (Lunar New Year)</td></tr>
<tr><td>庆祝</td><td>qìngzhù</td><td>to celebrate</td></tr>
<tr><td>习惯</td><td>xíguàn</td><td>habit / custom</td></tr>
<tr><td>举行</td><td>jǔxíng</td><td>to hold (an event)</td></tr>
<tr><td>随着</td><td>suízhe</td><td>along with / as</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>随着 suízhe</strong> = along with / as: <strong>随着</strong>时代的变化，风俗也在变 (as the times change, customs change too).</li>
<li><strong>对 … 来说</strong> = for / as far as … is concerned: <strong>对</strong>中国人<strong>来说</strong>，春节最重要 (for Chinese people, Spring Festival is the most important).</li>
<li><strong>传统 chuántǒng</strong> = tradition: 每个节日都有自己的<strong>传统</strong> (every festival has its own traditions).</li>
<li><strong>举行 jǔxíng</strong> = to hold: 春节的时候，各地都<strong>举行</strong>庆祝活动 (during Spring Festival, celebrations are held everywhere).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 中国最重要的传统节日是什么？ Zhōngguó zuì zhòngyào de chuántǒng jiérì shì shénme? (What is the most important traditional festival in China?)
B: 对中国人来说，是春节。 Duì Zhōngguó rén lái shuō, shì Chūnjié. (For Chinese people, it is Spring Festival.)
A: 你们怎么庆祝？ Nǐmen zěnme qìngzhù? (How do you celebrate?)
B: 随着时代变化，风俗有点儿不同了，但还是很热闹。 Suízhe shídài biànhuà, fēngsú yǒudiǎnr bùtóng le, dàn háishì hěn rènao. (As times change, customs differ a bit, but it is still lively.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 对 … 来说 marks whose point of view a statement is made from. It usually stands at the front of the sentence: 对我来说，学中文很有意思 (for me, learning Chinese is interesting).</div>`,
    `<span class="eyebrow">CHI331 · Bài 1 · Văn hóa</span>
<h2>Văn hóa &amp; phong tục (文化和风俗)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>文化</td><td>wénhuà</td><td>văn hóa</td></tr>
<tr><td>风俗</td><td>fēngsú</td><td>phong tục</td></tr>
<tr><td>传统</td><td>chuántǒng</td><td>truyền thống</td></tr>
<tr><td>节日</td><td>jiérì</td><td>ngày lễ, lễ hội</td></tr>
<tr><td>春节</td><td>Chūnjié</td><td>Tết Nguyên đán</td></tr>
<tr><td>庆祝</td><td>qìngzhù</td><td>chúc mừng, tổ chức mừng</td></tr>
<tr><td>习惯</td><td>xíguàn</td><td>thói quen, tập quán</td></tr>
<tr><td>举行</td><td>jǔxíng</td><td>tổ chức (sự kiện)</td></tr>
<tr><td>随着</td><td>suízhe</td><td>cùng với, theo</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>随着 suízhe</strong> = cùng với, theo: <strong>随着</strong>时代的变化，风俗也在变 (cùng với sự thay đổi của thời đại, phong tục cũng đổi).</li>
<li><strong>对 … 来说</strong> = đối với … mà nói: <strong>对</strong>中国人<strong>来说</strong>，春节最重要 (đối với người Trung Quốc mà nói, Tết là quan trọng nhất).</li>
<li><strong>传统 chuántǒng</strong> = truyền thống: 每个节日都有自己的<strong>传统</strong> (mỗi ngày lễ đều có truyền thống riêng).</li>
<li><strong>举行 jǔxíng</strong> = tổ chức: 春节的时候，各地都<strong>举行</strong>庆祝活动 (dịp Tết, khắp nơi đều tổ chức hoạt động mừng lễ).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 中国最重要的传统节日是什么？ Zhōngguó zuì zhòngyào de chuántǒng jiérì shì shénme? (Ngày lễ truyền thống quan trọng nhất của Trung Quốc là gì?)
B: 对中国人来说，是春节。 Duì Zhōngguó rén lái shuō, shì Chūnjié. (Đối với người Trung Quốc, đó là Tết Nguyên đán.)
A: 你们怎么庆祝？ Nǐmen zěnme qìngzhù? (Các bạn ăn mừng thế nào?)
B: 随着时代变化，风俗有点儿不同了，但还是很热闹。 Suízhe shídài biànhuà, fēngsú yǒudiǎnr bùtóng le, dàn háishì hěn rènao. (Cùng với thời gian, phong tục hơi khác đi, nhưng vẫn rất náo nhiệt.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 对 … 来说 nêu góc nhìn của ai khi phát biểu. Nó thường đứng đầu câu: 对我来说，学中文很有意思 (đối với tôi, học tiếng Trung rất thú vị).</div>`,
  ]]);

const b1q = quiz('chi331-quiz-1', 'Quiz 1 — Culture &amp; customs|||Quiz 1 — Văn hóa &amp; phong tục', [
  { id: 'q1', question: '"对中国人来说" nghĩa là? / What does 对中国人来说 mean?', options: ['người Trung Quốc nói|||Chinese people say', 'đối với người Trung Quốc mà nói|||for Chinese people', 'hỏi người Trung Quốc|||ask Chinese people', 'giống người Trung Quốc|||like Chinese people'], correctIndex: 1, explanation: '对 … 来说 = đối với … mà nói, nêu góc nhìn: 对中国人来说，春节最重要.' },
  { id: 'q2', question: '"随着" (suízhe) nghĩa là? / What does 随着 mean?', options: ['trước khi|||before', 'cùng với, theo|||along with / as', 'tuy nhiên|||however', 'ngoài ra|||besides'], correctIndex: 1, explanation: '随着 = cùng với, theo (một quá trình): 随着时代的变化，风俗也在变.' },
  { id: 'q3', question: '"春节" (Chūnjié) là gì? / What is 春节?', options: ['Trung thu|||Mid-Autumn Festival', 'Tết Nguyên đán|||Spring Festival / Lunar New Year', 'Quốc khánh|||National Day', 'Tết Đoan Ngọ|||Dragon Boat Festival'], correctIndex: 1, explanation: '春节 = Tết Nguyên đán, ngày lễ truyền thống quan trọng nhất của Trung Quốc.' },
]);

const b2 = doc('chi331-2-1-east-west', 'Lesson 2 — East-West differences|||Bài 2 — So sánh Đông-Tây',
  'Từ vựng: 中西方, 差别, 区别, 习惯, 接受, 观念, 表达, 尊重, 一方面. Ngữ pháp: 不是…而是 (không phải…mà là), 一方面…另一方面 (một mặt…mặt khác).',
  [[
    `<span class="eyebrow">CHI331 · Lesson 2 · East &amp; West</span>
<h2>East-West differences (中西方的差别)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>中西方</td><td>Zhōngxīfāng</td><td>East and West (China &amp; the West)</td></tr>
<tr><td>差别</td><td>chābié</td><td>difference</td></tr>
<tr><td>区别</td><td>qūbié</td><td>distinction</td></tr>
<tr><td>习惯</td><td>xíguàn</td><td>habit / custom</td></tr>
<tr><td>接受</td><td>jiēshòu</td><td>to accept</td></tr>
<tr><td>观念</td><td>guānniàn</td><td>concept / idea</td></tr>
<tr><td>表达</td><td>biǎodá</td><td>to express</td></tr>
<tr><td>尊重</td><td>zūnzhòng</td><td>to respect</td></tr>
<tr><td>一方面</td><td>yì fāngmiàn</td><td>on one hand</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>不是 … 而是 …</strong> = not … but rather: 这<strong>不是</strong>坏习惯，<strong>而是</strong>文化差别 (this is not a bad habit, but a cultural difference).</li>
<li><strong>一方面 … 另一方面 …</strong> = on one hand … on the other: <strong>一方面</strong>要接受新观念，<strong>另一方面</strong>也要尊重传统 (on one hand accept new ideas, on the other respect tradition).</li>
<li><strong>差别 vs 区别</strong>: both mean difference; 差别 stresses the gap in degree, 区别 stresses telling two things apart.</li>
<li><strong>表达 biǎodá</strong> = to express: 西方人喜欢直接<strong>表达</strong>意见 (Westerners like to express opinions directly).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 中西方文化的差别大吗？ Zhōngxīfāng wénhuà de chābié dà ma? (Are East-West cultural differences big?)
B: 不小。这不是好坏的问题，而是习惯不同。 Bù xiǎo. Zhè bú shì hǎo huài de wèntí, ér shì xíguàn bùtóng. (Not small. It is not about good or bad, but different habits.)
A: 那我们应该怎么做？ Nà wǒmen yīnggāi zěnme zuò? (So what should we do?)
B: 一方面接受新观念，另一方面尊重对方的文化。 Yì fāngmiàn jiēshòu xīn guānniàn, lìng yì fāngmiàn zūnzhòng duìfāng de wénhuà. (On one hand accept new ideas, on the other respect the other side culture.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 不是 … 而是 … corrects a wrong idea and gives the right one: it denies the first part with 不是 and states the truth after 而是. Do not use 但是 here.</div>`,
    `<span class="eyebrow">CHI331 · Bài 2 · Đông-Tây</span>
<h2>So sánh Đông-Tây (中西方的差别)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>中西方</td><td>Zhōngxīfāng</td><td>phương Đông và phương Tây</td></tr>
<tr><td>差别</td><td>chābié</td><td>sự khác biệt</td></tr>
<tr><td>区别</td><td>qūbié</td><td>sự phân biệt, khác nhau</td></tr>
<tr><td>习惯</td><td>xíguàn</td><td>thói quen, tập quán</td></tr>
<tr><td>接受</td><td>jiēshòu</td><td>tiếp nhận, chấp nhận</td></tr>
<tr><td>观念</td><td>guānniàn</td><td>quan niệm</td></tr>
<tr><td>表达</td><td>biǎodá</td><td>biểu đạt, bày tỏ</td></tr>
<tr><td>尊重</td><td>zūnzhòng</td><td>tôn trọng</td></tr>
<tr><td>一方面</td><td>yì fāngmiàn</td><td>một mặt</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>不是 … 而是 …</strong> = không phải … mà là: 这<strong>不是</strong>坏习惯，<strong>而是</strong>文化差别 (đây không phải thói xấu, mà là khác biệt văn hóa).</li>
<li><strong>一方面 … 另一方面 …</strong> = một mặt … mặt khác: <strong>一方面</strong>要接受新观念，<strong>另一方面</strong>也要尊重传统 (một mặt phải tiếp nhận quan niệm mới, mặt khác cũng phải tôn trọng truyền thống).</li>
<li><strong>差别 và 区别</strong>: đều nghĩa là sự khác nhau; 差别 nhấn khoảng cách mức độ, 区别 nhấn việc phân biệt hai thứ.</li>
<li><strong>表达 biǎodá</strong> = biểu đạt: 西方人喜欢直接<strong>表达</strong>意见 (người phương Tây thích bày tỏ ý kiến trực tiếp).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 中西方文化的差别大吗？ Zhōngxīfāng wénhuà de chābié dà ma? (Khác biệt văn hóa Đông-Tây có lớn không?)
B: 不小。这不是好坏的问题，而是习惯不同。 Bù xiǎo. Zhè bú shì hǎo huài de wèntí, ér shì xíguàn bùtóng. (Không nhỏ. Đây không phải chuyện tốt xấu, mà là thói quen khác nhau.)
A: 那我们应该怎么做？ Nà wǒmen yīnggāi zěnme zuò? (Vậy chúng ta nên làm sao?)
B: 一方面接受新观念，另一方面尊重对方的文化。 Yì fāngmiàn jiēshòu xīn guānniàn, lìng yì fāngmiàn zūnzhòng duìfāng de wénhuà. (Một mặt tiếp nhận quan niệm mới, mặt khác tôn trọng văn hóa của đối phương.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 不是 … 而是 … dùng để sửa một ý sai và nêu ý đúng: phủ định phần đầu bằng 不是, nêu sự thật sau 而是. Không dùng 但是 ở đây.</div>`,
  ]]);

const b2q = quiz('chi331-quiz-2', 'Quiz 2 — East-West differences|||Quiz 2 — So sánh Đông-Tây', [
  { id: 'q1', question: 'Mẫu "不是…而是…" nghĩa là? / What does 不是…而是… mean?', options: ['không những … mà còn …|||not only … but also …', 'không phải … mà là …|||not … but rather …', 'tuy … nhưng …|||although … but …', 'chỉ cần … là …|||as long as … then …'], correctIndex: 1, explanation: '不是…而是… phủ định ý sai rồi nêu ý đúng: 不是坏习惯，而是文化差别.' },
  { id: 'q2', question: 'Mẫu "一方面…另一方面…" nghĩa là? / What does 一方面…另一方面… mean?', options: ['một mặt … mặt khác …|||on one hand … on the other …', 'trước tiên … sau đó …|||first … then …', 'vì … cho nên …|||because … therefore …', 'nếu … thì …|||if … then …'], correctIndex: 0, explanation: '一方面…另一方面… nêu hai mặt của một việc: 一方面接受新观念，另一方面尊重传统.' },
  { id: 'q3', question: '"接受" (jiēshòu) nghĩa là? / What does 接受 mean?', options: ['từ chối|||to refuse', 'tiếp nhận, chấp nhận|||to accept', 'so sánh|||to compare', 'thay đổi|||to change'], correctIndex: 1, explanation: '接受 = tiếp nhận, chấp nhận: 接受新观念 = tiếp nhận quan niệm mới.' },
]);

const b3 = doc('chi331-3-1-study-stress', 'Lesson 3 — Study &amp; stress|||Bài 3 — Học tập &amp; áp lực',
  'Từ vựng: 压力, 成绩, 努力, 放松, 复习, 紧张, 考试, 进步, 只要. Ngữ pháp: 只要…就 (chỉ cần…là), bổ ngữ xu hướng phức hợp 起来 (紧张起来).',
  [[
    `<span class="eyebrow">CHI331 · Lesson 3 · Study &amp; stress</span>
<h2>Study &amp; stress (学习和压力)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>压力</td><td>yālì</td><td>pressure / stress</td></tr>
<tr><td>成绩</td><td>chéngjì</td><td>grades / results</td></tr>
<tr><td>努力</td><td>nǔlì</td><td>to work hard</td></tr>
<tr><td>放松</td><td>fàngsōng</td><td>to relax</td></tr>
<tr><td>复习</td><td>fùxí</td><td>to review</td></tr>
<tr><td>紧张</td><td>jǐnzhāng</td><td>nervous / tense</td></tr>
<tr><td>考试</td><td>kǎoshì</td><td>exam</td></tr>
<tr><td>进步</td><td>jìnbù</td><td>to make progress</td></tr>
<tr><td>只要</td><td>zhǐyào</td><td>as long as</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>只要 … 就 …</strong> = as long as … then: <strong>只要</strong>努力复习，成绩<strong>就</strong>会进步 (as long as you review hard, grades will improve).</li>
<li><strong>起来 (compound directional complement)</strong> — used for a state that starts: 一到考试，我<strong>就</strong>紧张<strong>起来</strong> (as soon as an exam comes, I start to get nervous).</li>
<li><strong>放松 fàngsōng</strong> = to relax: 考试以前也要<strong>放松</strong>一下 (relax a bit before the exam too).</li>
<li><strong>压力 yālì</strong> = pressure: 学习<strong>压力</strong>大的时候，别忘了休息 (when study pressure is high, do not forget to rest).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 快考试了，你压力大吗？ Kuài kǎoshì le, nǐ yālì dà ma? (The exam is near, is your pressure high?)
B: 挺大的，一想到考试就紧张起来。 Tǐng dà de, yì xiǎngdào kǎoshì jiù jǐnzhāng qǐlái. (Quite high, I get nervous whenever I think of the exam.)
A: 别太紧张，只要努力复习，成绩就会进步。 Bié tài jǐnzhāng, zhǐyào nǔlì fùxí, chéngjì jiù huì jìnbù. (Do not be too nervous; as long as you review hard, grades will improve.)
B: 你说得对，我也要学会放松。 Nǐ shuō de duì, wǒ yě yào xuéhuì fàngsōng. (You are right, I should learn to relax too.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 起来 after an adjective or verb often marks the start of a state or action: 天气热<strong>起来</strong>了 (the weather is turning hot), 唱<strong>起来</strong>了 (started to sing).</div>`,
    `<span class="eyebrow">CHI331 · Bài 3 · Học tập</span>
<h2>Học tập &amp; áp lực (学习和压力)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>压力</td><td>yālì</td><td>áp lực</td></tr>
<tr><td>成绩</td><td>chéngjì</td><td>thành tích, điểm số</td></tr>
<tr><td>努力</td><td>nǔlì</td><td>nỗ lực, cố gắng</td></tr>
<tr><td>放松</td><td>fàngsōng</td><td>thư giãn</td></tr>
<tr><td>复习</td><td>fùxí</td><td>ôn tập</td></tr>
<tr><td>紧张</td><td>jǐnzhāng</td><td>căng thẳng, hồi hộp</td></tr>
<tr><td>考试</td><td>kǎoshì</td><td>kỳ thi, thi cử</td></tr>
<tr><td>进步</td><td>jìnbù</td><td>tiến bộ</td></tr>
<tr><td>只要</td><td>zhǐyào</td><td>chỉ cần</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>只要 … 就 …</strong> = chỉ cần … là: <strong>只要</strong>努力复习，成绩<strong>就</strong>会进步 (chỉ cần chăm ôn tập, điểm số sẽ tiến bộ).</li>
<li><strong>起来 (bổ ngữ xu hướng phức hợp)</strong> — chỉ trạng thái bắt đầu: 一到考试，我<strong>就</strong>紧张<strong>起来</strong> (hễ đến kỳ thi là tôi bắt đầu căng thẳng).</li>
<li><strong>放松 fàngsōng</strong> = thư giãn: 考试以前也要<strong>放松</strong>一下 (trước khi thi cũng nên thư giãn chút).</li>
<li><strong>压力 yālì</strong> = áp lực: 学习<strong>压力</strong>大的时候，别忘了休息 (khi áp lực học tập lớn, đừng quên nghỉ ngơi).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 快考试了，你压力大吗？ Kuài kǎoshì le, nǐ yālì dà ma? (Sắp thi rồi, bạn áp lực nhiều không?)
B: 挺大的，一想到考试就紧张起来。 Tǐng dà de, yì xiǎngdào kǎoshì jiù jǐnzhāng qǐlái. (Khá nhiều, hễ nghĩ đến thi là bắt đầu căng thẳng.)
A: 别太紧张，只要努力复习，成绩就会进步。 Bié tài jǐnzhāng, zhǐyào nǔlì fùxí, chéngjì jiù huì jìnbù. (Đừng quá căng, chỉ cần chăm ôn thì điểm sẽ tiến bộ.)
B: 你说得对，我也要学会放松。 Nǐ shuō de duì, wǒ yě yào xuéhuì fàngsōng. (Bạn nói đúng, tôi cũng phải học cách thư giãn.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 起来 sau tính từ hoặc động từ thường chỉ trạng thái hay hành động bắt đầu: 天气热<strong>起来</strong>了 (trời bắt đầu nóng lên), 唱<strong>起来</strong>了 (bắt đầu hát).</div>`,
  ]]);

const b3q = quiz('chi331-quiz-3', 'Quiz 3 — Study &amp; stress|||Quiz 3 — Học tập &amp; áp lực', [
  { id: 'q1', question: 'Mẫu "只要…就…" nghĩa là? / What does 只要…就… mean?', options: ['dù … cũng …|||even if … still …', 'chỉ cần … là …|||as long as … then …', 'không phải … mà là …|||not … but …', 'bất kể … đều …|||no matter … all …'], correctIndex: 1, explanation: '只要…就… nêu điều kiện đủ: 只要努力复习，成绩就会进步.' },
  { id: 'q2', question: '"紧张起来" nghĩa là? / What does 紧张起来 mean?', options: ['hết căng thẳng|||stop being nervous', 'bắt đầu căng thẳng|||start to get nervous', 'rất thoải mái|||very relaxed', 'quên căng thẳng|||forget the tension'], correctIndex: 1, explanation: '起来 chỉ trạng thái bắt đầu: 紧张起来 = bắt đầu căng thẳng.' },
  { id: 'q3', question: '"进步" (jìnbù) nghĩa là? / What does 进步 mean?', options: ['thụt lùi|||to fall behind', 'tiến bộ|||to make progress', 'nghỉ ngơi|||to rest', 'thất bại|||to fail'], correctIndex: 1, explanation: '进步 = tiến bộ: 成绩进步了 = điểm số tiến bộ rồi.' },
]);

const b4 = doc('chi331-4-1-environment', 'Lesson 4 — Environment &amp; protection|||Bài 4 — Môi trường &amp; bảo vệ',
  'Từ vựng: 环境, 污染, 保护, 节约, 垃圾, 空气, 资源, 无论, 通过. Ngữ pháp: 无论…都 (bất kể…đều), 通过 (thông qua).',
  [[
    `<span class="eyebrow">CHI331 · Lesson 4 · Environment</span>
<h2>Environment &amp; protection (环境和保护)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>环境</td><td>huánjìng</td><td>environment</td></tr>
<tr><td>污染</td><td>wūrǎn</td><td>pollution; to pollute</td></tr>
<tr><td>保护</td><td>bǎohù</td><td>to protect</td></tr>
<tr><td>节约</td><td>jiéyuē</td><td>to save / economize</td></tr>
<tr><td>垃圾</td><td>lājī</td><td>garbage / trash</td></tr>
<tr><td>空气</td><td>kōngqì</td><td>air</td></tr>
<tr><td>资源</td><td>zīyuán</td><td>resource</td></tr>
<tr><td>无论</td><td>wúlùn</td><td>no matter / regardless</td></tr>
<tr><td>通过</td><td>tōngguò</td><td>through / by means of</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>无论 … 都 …</strong> = no matter … all: <strong>无论</strong>大人还是孩子，<strong>都</strong>应该保护环境 (no matter adults or children, everyone should protect the environment).</li>
<li><strong>通过 tōngguò</strong> = through / by means of: <strong>通过</strong>节约用水，我们可以保护资源 (by saving water, we can protect resources).</li>
<li><strong>污染 wūrǎn</strong> = pollution: 空气<strong>污染</strong>越来越严重 (air pollution is more and more serious).</li>
<li><strong>节约 jiéyuē</strong> = to save: 我们应该<strong>节约</strong>用电，少扔<strong>垃圾</strong> (we should save electricity and throw away less garbage).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 城市的空气污染很严重。 Chéngshì de kōngqì wūrǎn hěn yánzhòng. (Air pollution in the city is serious.)
B: 是啊，无论政府还是我们，都应该保护环境。 Shì a, wúlùn zhèngfǔ háishì wǒmen, dōu yīnggāi bǎohù huánjìng. (Yes, no matter the government or us, all should protect the environment.)
A: 我们能做什么呢？ Wǒmen néng zuò shénme ne? (What can we do?)
B: 通过节约用水用电，少扔垃圾，就能帮忙。 Tōngguò jiéyuē yòng shuǐ yòng diàn, shǎo rēng lājī, jiù néng bāngmáng. (By saving water and power and dropping less trash, we can help.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 无论 must be followed by a choice or a question word (还是 / 多少 / 什么), and the main clause takes 都 or 也: 无论多难，我都要学好中文 (no matter how hard, I will learn Chinese well).</div>`,
    `<span class="eyebrow">CHI331 · Bài 4 · Môi trường</span>
<h2>Môi trường &amp; bảo vệ (环境和保护)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>环境</td><td>huánjìng</td><td>môi trường</td></tr>
<tr><td>污染</td><td>wūrǎn</td><td>ô nhiễm; làm ô nhiễm</td></tr>
<tr><td>保护</td><td>bǎohù</td><td>bảo vệ</td></tr>
<tr><td>节约</td><td>jiéyuē</td><td>tiết kiệm</td></tr>
<tr><td>垃圾</td><td>lājī</td><td>rác</td></tr>
<tr><td>空气</td><td>kōngqì</td><td>không khí</td></tr>
<tr><td>资源</td><td>zīyuán</td><td>tài nguyên</td></tr>
<tr><td>无论</td><td>wúlùn</td><td>bất kể, dù</td></tr>
<tr><td>通过</td><td>tōngguò</td><td>thông qua, bằng cách</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>无论 … 都 …</strong> = bất kể … đều: <strong>无论</strong>大人还是孩子，<strong>都</strong>应该保护环境 (bất kể người lớn hay trẻ em, đều nên bảo vệ môi trường).</li>
<li><strong>通过 tōngguò</strong> = thông qua, bằng cách: <strong>通过</strong>节约用水，我们可以保护资源 (thông qua tiết kiệm nước, ta có thể bảo vệ tài nguyên).</li>
<li><strong>污染 wūrǎn</strong> = ô nhiễm: 空气<strong>污染</strong>越来越严重 (ô nhiễm không khí ngày càng nghiêm trọng).</li>
<li><strong>节约 jiéyuē</strong> = tiết kiệm: 我们应该<strong>节约</strong>用电，少扔<strong>垃圾</strong> (chúng ta nên tiết kiệm điện, bớt vứt rác).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 城市的空气污染很严重。 Chéngshì de kōngqì wūrǎn hěn yánzhòng. (Ô nhiễm không khí ở thành phố rất nghiêm trọng.)
B: 是啊，无论政府还是我们，都应该保护环境。 Shì a, wúlùn zhèngfǔ háishì wǒmen, dōu yīnggāi bǎohù huánjìng. (Ừ, bất kể chính phủ hay chúng ta, đều nên bảo vệ môi trường.)
A: 我们能做什么呢？ Wǒmen néng zuò shénme ne? (Chúng ta có thể làm gì?)
B: 通过节约用水用电，少扔垃圾，就能帮忙。 Tōngguò jiéyuē yòng shuǐ yòng diàn, shǎo rēng lājī, jiù néng bāngmáng. (Bằng cách tiết kiệm nước điện, bớt vứt rác, là giúp được.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 无论 phải đi với một lựa chọn hoặc từ để hỏi (还是 / 多少 / 什么), và vế chính dùng 都 hoặc 也: 无论多难，我都要学好中文 (dù khó thế nào, tôi đều học giỏi tiếng Trung).</div>`,
  ]]);

const b4q = quiz('chi331-quiz-4', 'Quiz 4 — Environment &amp; protection|||Quiz 4 — Môi trường &amp; bảo vệ', [
  { id: 'q1', question: 'Mẫu "无论…都…" nghĩa là? / What does 无论…都… mean?', options: ['chỉ cần … là …|||as long as … then …', 'bất kể … đều …|||no matter … all …', 'không phải … mà là …|||not … but …', 'cùng với …|||along with …'], correctIndex: 1, explanation: '无论…都… = bất kể … đều: 无论大人还是孩子，都应该保护环境.' },
  { id: 'q2', question: '"通过节约用水" nghĩa là? / What does 通过节约用水 mean?', options: ['vì lãng phí nước|||because of wasting water', 'thông qua (bằng cách) tiết kiệm nước|||by / through saving water', 'quên tiết kiệm nước|||forget to save water', 'thiếu nước|||short of water'], correctIndex: 1, explanation: '通过 = thông qua, bằng cách: 通过节约用水，我们可以保护资源.' },
  { id: 'q3', question: '"保护环境" nghĩa là? / What does 保护环境 mean?', options: ['làm ô nhiễm môi trường|||to pollute the environment', 'bảo vệ môi trường|||to protect the environment', 'thay đổi môi trường|||to change the environment', 'nghiên cứu môi trường|||to study the environment'], correctIndex: 1, explanation: '保护 (bảo vệ) + 环境 (môi trường) = bảo vệ môi trường.' },
]);

const b5 = doc('chi331-5-1-technology-internet', 'Lesson 5 — Technology &amp; the internet|||Bài 5 — Công nghệ &amp; internet',
  'Từ vựng: 网络, 手机, 方便, 影响, 沉迷, 上网, 信息, 联系, 即使. Ngữ pháp: 即使…也 (dù…cũng), bổ ngữ xu hướng 下去 (沉迷下去).',
  [[
    `<span class="eyebrow">CHI331 · Lesson 5 · Technology</span>
<h2>Technology &amp; the internet (网络和手机)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>网络</td><td>wǎngluò</td><td>internet / network</td></tr>
<tr><td>手机</td><td>shǒujī</td><td>mobile phone</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>convenient</td></tr>
<tr><td>影响</td><td>yǐngxiǎng</td><td>influence; to affect</td></tr>
<tr><td>沉迷</td><td>chénmí</td><td>to be addicted / absorbed</td></tr>
<tr><td>上网</td><td>shàngwǎng</td><td>to go online</td></tr>
<tr><td>信息</td><td>xìnxī</td><td>information</td></tr>
<tr><td>联系</td><td>liánxì</td><td>to contact; contact</td></tr>
<tr><td>即使</td><td>jíshǐ</td><td>even if</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>即使 … 也 …</strong> = even if … still: <strong>即使</strong>网络很方便，<strong>也</strong>不能沉迷 (even if the internet is convenient, you must not get addicted).</li>
<li><strong>下去 (compound directional complement)</strong> — a continuing action: 这样沉迷<strong>下去</strong>，会影响学习 (if you keep on being addicted like this, it will affect your studies).</li>
<li><strong>方便 fāngbiàn</strong> = convenient: 用手机<strong>联系</strong>朋友很<strong>方便</strong> (contacting friends by phone is very convenient).</li>
<li><strong>影响 yǐngxiǎng</strong> = to affect: 玩手机太多会<strong>影响</strong>睡眠 (playing on the phone too much affects sleep).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 现在上网真方便，什么信息都找得到。 Xiànzài shàngwǎng zhēn fāngbiàn, shénme xìnxī dōu zhǎo de dào. (Going online is so convenient now, you can find any information.)
B: 是，可是有的人沉迷手机。 Shì, kěshì yǒude rén chénmí shǒujī. (Yes, but some people get addicted to their phones.)
A: 即使网络很方便，也不能沉迷。 Jíshǐ wǎngluò hěn fāngbiàn, yě bù néng chénmí. (Even if the internet is convenient, you must not get addicted.)
B: 对，这样沉迷下去会影响学习和健康。 Duì, zhèyàng chénmí xiàqù huì yǐngxiǎng xuéxí hé jiànkāng. (Right, keeping on like this affects study and health.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 即使 … 也 … accepts a hypothetical and says the result stays the same: 即使下雨，我也去 (even if it rains, I will still go). It is stronger than 虽然.</div>`,
    `<span class="eyebrow">CHI331 · Bài 5 · Công nghệ</span>
<h2>Công nghệ &amp; internet (网络和手机)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>网络</td><td>wǎngluò</td><td>mạng internet</td></tr>
<tr><td>手机</td><td>shǒujī</td><td>điện thoại di động</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>tiện lợi</td></tr>
<tr><td>影响</td><td>yǐngxiǎng</td><td>ảnh hưởng</td></tr>
<tr><td>沉迷</td><td>chénmí</td><td>đắm chìm, nghiện</td></tr>
<tr><td>上网</td><td>shàngwǎng</td><td>lên mạng</td></tr>
<tr><td>信息</td><td>xìnxī</td><td>thông tin</td></tr>
<tr><td>联系</td><td>liánxì</td><td>liên lạc</td></tr>
<tr><td>即使</td><td>jíshǐ</td><td>dù, cho dù</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>即使 … 也 …</strong> = dù … cũng: <strong>即使</strong>网络很方便，<strong>也</strong>不能沉迷 (dù mạng rất tiện, cũng không được đắm chìm).</li>
<li><strong>下去 (bổ ngữ xu hướng phức hợp)</strong> — hành động tiếp diễn: 这样沉迷<strong>下去</strong>，会影响学习 (cứ nghiện tiếp thế này, sẽ ảnh hưởng học tập).</li>
<li><strong>方便 fāngbiàn</strong> = tiện lợi: 用手机<strong>联系</strong>朋友很<strong>方便</strong> (dùng điện thoại liên lạc bạn bè rất tiện).</li>
<li><strong>影响 yǐngxiǎng</strong> = ảnh hưởng: 玩手机太多会<strong>影响</strong>睡眠 (chơi điện thoại quá nhiều ảnh hưởng giấc ngủ).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 现在上网真方便，什么信息都找得到。 Xiànzài shàngwǎng zhēn fāngbiàn, shénme xìnxī dōu zhǎo de dào. (Giờ lên mạng thật tiện, thông tin gì cũng tìm được.)
B: 是，可是有的人沉迷手机。 Shì, kěshì yǒude rén chénmí shǒujī. (Ừ, nhưng có người nghiện điện thoại.)
A: 即使网络很方便，也不能沉迷。 Jíshǐ wǎngluò hěn fāngbiàn, yě bù néng chénmí. (Dù mạng rất tiện, cũng không được đắm chìm.)
B: 对，这样沉迷下去会影响学习和健康。 Duì, zhèyàng chénmí xiàqù huì yǐngxiǎng xuéxí hé jiànkāng. (Đúng, cứ nghiện tiếp sẽ ảnh hưởng học tập và sức khỏe.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 即使 … 也 … nêu một giả định và nói kết quả vẫn không đổi: 即使下雨，我也去 (dù trời mưa, tôi vẫn đi). Nó mạnh hơn 虽然.</div>`,
  ]]);

const b5q = quiz('chi331-quiz-5', 'Quiz 5 — Technology &amp; the internet|||Quiz 5 — Công nghệ &amp; internet', [
  { id: 'q1', question: 'Mẫu "即使…也…" nghĩa là? / What does 即使…也… mean?', options: ['dù … cũng …|||even if … still …', 'chỉ cần … là …|||as long as … then …', 'ngoài … ra …|||besides …', 'vừa … vừa …|||both … and …'], correctIndex: 0, explanation: '即使…也… nêu giả định, kết quả không đổi: 即使网络很方便，也不能沉迷.' },
  { id: 'q2', question: '"沉迷下去" nghĩa là? / What does 沉迷下去 mean?', options: ['thôi nghiện|||stop being addicted', 'cứ nghiện tiếp|||keep being addicted', 'bắt đầu nghiện|||start being addicted', 'không nghiện|||not addicted'], correctIndex: 1, explanation: '下去 chỉ hành động tiếp diễn: 沉迷下去 = cứ đắm chìm/nghiện tiếp.' },
  { id: 'q3', question: '"影响" (yǐngxiǎng) nghĩa là? / What does 影响 mean?', options: ['giúp đỡ|||to help', 'ảnh hưởng|||to affect / influence', 'tiết kiệm|||to save', 'liên lạc|||to contact'], correctIndex: 1, explanation: '影响 = ảnh hưởng: 玩手机太多会影响睡眠 = chơi điện thoại nhiều ảnh hưởng giấc ngủ.' },
]);

const b6 = doc('chi331-6-1-health-habits', 'Lesson 6 — Health &amp; habits|||Bài 6 — Sức khỏe &amp; thói quen',
  'Từ vựng: 健康, 饮食, 运动, 生活, 习惯, 坚持, 规律, 保持, 睡眠. Ngữ pháp: 对…来说 (đối với…mà nói), bổ ngữ xu hướng 下去 (坚持下去) / 起来 (好起来).',
  [[
    `<span class="eyebrow">CHI331 · Lesson 6 · Health</span>
<h2>Health &amp; habits (健康和习惯)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>健康</td><td>jiànkāng</td><td>health; healthy</td></tr>
<tr><td>饮食</td><td>yǐnshí</td><td>diet / food and drink</td></tr>
<tr><td>运动</td><td>yùndòng</td><td>exercise; sports</td></tr>
<tr><td>生活</td><td>shēnghuó</td><td>life / daily life</td></tr>
<tr><td>习惯</td><td>xíguàn</td><td>habit</td></tr>
<tr><td>坚持</td><td>jiānchí</td><td>to keep at it / persist</td></tr>
<tr><td>规律</td><td>guīlǜ</td><td>regular / routine</td></tr>
<tr><td>保持</td><td>bǎochí</td><td>to keep / maintain</td></tr>
<tr><td>睡眠</td><td>shuìmián</td><td>sleep</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>对 … 来说</strong> = for / as far as: <strong>对</strong>身体<strong>来说</strong>，规律的生活很重要 (for the body, a regular life is very important).</li>
<li><strong>坚持下去</strong> — 下去 marks keeping on: 好习惯要<strong>坚持下去</strong> (good habits should be kept up).</li>
<li><strong>好起来</strong> — 起来 marks a state turning better: 只要多运动，身体就会<strong>好起来</strong> (as long as you exercise more, your body will get better).</li>
<li><strong>保持 bǎochí</strong> = to keep: <strong>保持</strong>健康的<strong>饮食</strong>和足够的<strong>睡眠</strong> (keep a healthy diet and enough sleep).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你的身体一直这么好，有什么秘密？ Nǐ de shēntǐ yìzhí zhème hǎo, yǒu shénme mìmì? (Your health is always so good, what is the secret?)
B: 对我来说，规律的生活最重要。 Duì wǒ lái shuō, guīlǜ de shēnghuó zuì zhòngyào. (For me, a regular life matters most.)
A: 具体怎么做呢？ Jùtǐ zěnme zuò ne? (What do you do exactly?)
B: 保持健康饮食，每天运动，还要坚持下去。 Bǎochí jiànkāng yǐnshí, měitiān yùndòng, hái yào jiānchí xiàqù. (Keep a healthy diet, exercise daily, and keep it up.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 坚持下去 and 好起来 both use directional complements as aspect: 下去 says an action continues, 起来 says a state begins or improves. They are not about real direction here.</div>`,
    `<span class="eyebrow">CHI331 · Bài 6 · Sức khỏe</span>
<h2>Sức khỏe &amp; thói quen (健康和习惯)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>健康</td><td>jiànkāng</td><td>sức khỏe; khỏe mạnh</td></tr>
<tr><td>饮食</td><td>yǐnshí</td><td>ăn uống, ẩm thực</td></tr>
<tr><td>运动</td><td>yùndòng</td><td>vận động, thể thao</td></tr>
<tr><td>生活</td><td>shēnghuó</td><td>cuộc sống, sinh hoạt</td></tr>
<tr><td>习惯</td><td>xíguàn</td><td>thói quen</td></tr>
<tr><td>坚持</td><td>jiānchí</td><td>kiên trì, giữ vững</td></tr>
<tr><td>规律</td><td>guīlǜ</td><td>điều độ, quy luật</td></tr>
<tr><td>保持</td><td>bǎochí</td><td>giữ gìn, duy trì</td></tr>
<tr><td>睡眠</td><td>shuìmián</td><td>giấc ngủ</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>对 … 来说</strong> = đối với … mà nói: <strong>对</strong>身体<strong>来说</strong>，规律的生活很重要 (đối với cơ thể mà nói, sinh hoạt điều độ rất quan trọng).</li>
<li><strong>坚持下去</strong> — 下去 chỉ sự duy trì tiếp: 好习惯要<strong>坚持下去</strong> (thói quen tốt phải kiên trì tiếp).</li>
<li><strong>好起来</strong> — 起来 chỉ trạng thái chuyển tốt lên: 只要多运动，身体就会<strong>好起来</strong> (chỉ cần vận động nhiều, cơ thể sẽ khá lên).</li>
<li><strong>保持 bǎochí</strong> = duy trì: <strong>保持</strong>健康的<strong>饮食</strong>和足够的<strong>睡眠</strong> (duy trì ăn uống lành mạnh và ngủ đủ giấc).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你的身体一直这么好，有什么秘密？ Nǐ de shēntǐ yìzhí zhème hǎo, yǒu shénme mìmì? (Sức khỏe bạn luôn tốt vậy, có bí quyết gì?)
B: 对我来说，规律的生活最重要。 Duì wǒ lái shuō, guīlǜ de shēnghuó zuì zhòngyào. (Đối với tôi, sinh hoạt điều độ là quan trọng nhất.)
A: 具体怎么做呢？ Jùtǐ zěnme zuò ne? (Cụ thể làm thế nào?)
B: 保持健康饮食，每天运动，还要坚持下去。 Bǎochí jiànkāng yǐnshí, měitiān yùndòng, hái yào jiānchí xiàqù. (Duy trì ăn uống lành mạnh, ngày nào cũng vận động, và phải kiên trì tiếp.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 坚持下去 và 好起来 dùng bổ ngữ xu hướng theo nghĩa thể: 下去 nói hành động tiếp diễn, 起来 nói trạng thái bắt đầu hay khá lên. Ở đây không phải hướng thật.</div>`,
  ]]);

const b6q = quiz('chi331-quiz-6', 'Quiz 6 — Health &amp; habits|||Quiz 6 — Sức khỏe &amp; thói quen', [
  { id: 'q1', question: '"坚持下去" nghĩa là? / What does 坚持下去 mean?', options: ['bỏ cuộc|||to give up', 'kiên trì tiếp, duy trì|||to keep it up', 'bắt đầu làm|||to start doing', 'làm một lần|||to do once'], correctIndex: 1, explanation: '下去 chỉ hành động tiếp diễn: 好习惯要坚持下去 = thói quen tốt phải kiên trì tiếp.' },
  { id: 'q2', question: '"身体好起来了" nghĩa là? / What does 身体好起来了 mean?', options: ['cơ thể yếu đi|||the body got weaker', 'cơ thể đang khá lên|||the body is getting better', 'cơ thể không đổi|||the body stayed the same', 'cơ thể rất khỏe từ đầu|||the body was always strong'], correctIndex: 1, explanation: '起来 chỉ trạng thái chuyển tốt lên: 好起来了 = khá lên rồi.' },
  { id: 'q3', question: '"保持健康饮食" nghĩa là? / What does 保持健康饮食 mean?', options: ['bỏ ăn uống lành mạnh|||stop eating healthily', 'duy trì ăn uống lành mạnh|||keep a healthy diet', 'thay đổi món ăn|||change the food', 'ăn nhiều hơn|||eat more'], correctIndex: 1, explanation: '保持 = duy trì, giữ gìn: 保持健康饮食 = duy trì chế độ ăn uống lành mạnh.' },
]);

const b7 = doc('chi331-7-1-friendship', 'Lesson 7 — Friendship &amp; getting along|||Bài 7 — Tình bạn &amp; xã giao',
  'Từ vựng: 朋友, 性格, 交往, 帮助, 误会, 理解, 信任, 真诚, 联系. Ngữ pháp: 不是…而是 (không phải…mà là), 一方面…另一方面 (một mặt…mặt khác).',
  [[
    `<span class="eyebrow">CHI331 · Lesson 7 · Friendship</span>
<h2>Friendship &amp; getting along (朋友和交往)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>朋友</td><td>péngyou</td><td>friend</td></tr>
<tr><td>性格</td><td>xìnggé</td><td>personality / character</td></tr>
<tr><td>交往</td><td>jiāowǎng</td><td>to associate / get along</td></tr>
<tr><td>帮助</td><td>bāngzhù</td><td>to help; help</td></tr>
<tr><td>误会</td><td>wùhuì</td><td>misunderstanding</td></tr>
<tr><td>理解</td><td>lǐjiě</td><td>to understand</td></tr>
<tr><td>信任</td><td>xìnrèn</td><td>to trust; trust</td></tr>
<tr><td>真诚</td><td>zhēnchéng</td><td>sincere</td></tr>
<tr><td>联系</td><td>liánxì</td><td>to keep in touch</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>不是 … 而是 …</strong> = not … but: 真正的朋友<strong>不是</strong>天天见面，<strong>而是</strong>互相理解 (real friends are not those who meet daily, but those who understand each other).</li>
<li><strong>一方面 … 另一方面 …</strong> = on one hand … on the other: 交朋友<strong>一方面</strong>要真诚，<strong>另一方面</strong>要互相帮助 (making friends means being sincere on one hand and helping each other on the other).</li>
<li><strong>误会 wùhuì</strong> = misunderstanding: 有<strong>误会</strong>的时候，最好直接说清楚 (when there is a misunderstanding, it is best to speak clearly).</li>
<li><strong>信任 xìnrèn</strong> = trust: 朋友之间要互相<strong>信任</strong> (friends should trust each other).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你和小王性格不一样，怎么成了好朋友？ Nǐ hé Xiǎo Wáng xìnggé bù yíyàng, zěnme chéng le hǎo péngyou? (You and Xiao Wang have different personalities, how did you become good friends?)
B: 真正的朋友不是性格一样，而是互相理解。 Zhēnzhèng de péngyou bú shì xìnggé yíyàng, ér shì hùxiāng lǐjiě. (Real friends are not alike in character, but understand each other.)
A: 你们从来没有误会吗？ Nǐmen cónglái méiyǒu wùhuì ma? (Have you never had a misunderstanding?)
B: 有过，但一方面真诚，一方面互相信任，就过去了。 Yǒu guò, dàn yì fāngmiàn zhēnchéng, yì fāngmiàn hùxiāng xìnrèn, jiù guòqù le. (We did, but being sincere and trusting each other, it passed.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 交往 is to interact or get along with people in general; 交朋友 is to make friends. A good relationship needs 理解 (understanding) and 信任 (trust).</div>`,
    `<span class="eyebrow">CHI331 · Bài 7 · Tình bạn</span>
<h2>Tình bạn &amp; xã giao (朋友和交往)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>朋友</td><td>péngyou</td><td>bạn bè</td></tr>
<tr><td>性格</td><td>xìnggé</td><td>tính cách</td></tr>
<tr><td>交往</td><td>jiāowǎng</td><td>giao thiệp, qua lại</td></tr>
<tr><td>帮助</td><td>bāngzhù</td><td>giúp đỡ</td></tr>
<tr><td>误会</td><td>wùhuì</td><td>hiểu lầm</td></tr>
<tr><td>理解</td><td>lǐjiě</td><td>hiểu, thấu hiểu</td></tr>
<tr><td>信任</td><td>xìnrèn</td><td>tin tưởng</td></tr>
<tr><td>真诚</td><td>zhēnchéng</td><td>chân thành</td></tr>
<tr><td>联系</td><td>liánxì</td><td>giữ liên lạc</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>不是 … 而是 …</strong> = không phải … mà là: 真正的朋友<strong>不是</strong>天天见面，<strong>而是</strong>互相理解 (bạn thật sự không phải ngày nào cũng gặp, mà là hiểu nhau).</li>
<li><strong>一方面 … 另一方面 …</strong> = một mặt … mặt khác: 交朋友<strong>一方面</strong>要真诚，<strong>另一方面</strong>要互相帮助 (kết bạn một mặt phải chân thành, mặt khác phải giúp đỡ nhau).</li>
<li><strong>误会 wùhuì</strong> = hiểu lầm: 有<strong>误会</strong>的时候，最好直接说清楚 (khi có hiểu lầm, tốt nhất nói rõ trực tiếp).</li>
<li><strong>信任 xìnrèn</strong> = tin tưởng: 朋友之间要互相<strong>信任</strong> (giữa bạn bè phải tin tưởng lẫn nhau).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你和小王性格不一样，怎么成了好朋友？ Nǐ hé Xiǎo Wáng xìnggé bù yíyàng, zěnme chéng le hǎo péngyou? (Bạn và Tiểu Vương tính cách khác nhau, sao lại thành bạn thân?)
B: 真正的朋友不是性格一样，而是互相理解。 Zhēnzhèng de péngyou bú shì xìnggé yíyàng, ér shì hùxiāng lǐjiě. (Bạn thật sự không phải tính cách giống nhau, mà là hiểu nhau.)
A: 你们从来没有误会吗？ Nǐmen cónglái méiyǒu wùhuì ma? (Các bạn chưa từng hiểu lầm nhau sao?)
B: 有过，但一方面真诚，一方面互相信任，就过去了。 Yǒu guò, dàn yì fāngmiàn zhēnchéng, yì fāngmiàn hùxiāng xìnrèn, jiù guòqù le. (Có, nhưng một mặt chân thành, một mặt tin nhau, là qua thôi.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 交往 là qua lại, giao thiệp với người nói chung; 交朋友 là kết bạn. Quan hệ tốt cần 理解 (hiểu nhau) và 信任 (tin tưởng).</div>`,
  ]]);

const b7q = quiz('chi331-quiz-7', 'Quiz 7 — Friendship &amp; getting along|||Quiz 7 — Tình bạn &amp; xã giao', [
  { id: 'q1', question: 'Câu 真正的朋友不是天天见面，而是互相理解 nhấn mạnh điều gì? / What does it stress?', options: ['bạn phải gặp nhau mỗi ngày|||friends must meet daily', 'điều quan trọng là hiểu nhau, không phải gặp nhau nhiều|||understanding matters, not frequent meeting', 'bạn không cần liên lạc|||no need to keep in touch', 'tính cách phải giống nhau|||personalities must be the same'], correctIndex: 1, explanation: '不是…而是… phủ định ý sai (天天见面) rồi nêu ý đúng (互相理解).' },
  { id: 'q2', question: '"误会" (wùhuì) nghĩa là? / What does 误会 mean?', options: ['hiểu lầm|||misunderstanding', 'giúp đỡ|||help', 'tin tưởng|||trust', 'gặp mặt|||meeting'], correctIndex: 0, explanation: '误会 = hiểu lầm: 有误会的时候最好直接说清楚.' },
  { id: 'q3', question: '"互相信任" nghĩa là? / What does 互相信任 mean?', options: ['nghi ngờ lẫn nhau|||suspect each other', 'tin tưởng lẫn nhau|||trust each other', 'giúp đỡ một chiều|||one-sided help', 'ít liên lạc|||rarely contact'], correctIndex: 1, explanation: '互相 (lẫn nhau) + 信任 (tin tưởng) = tin tưởng lẫn nhau.' },
]);

const b8 = doc('chi331-8-1-dreams-careers', 'Lesson 8 — Dreams &amp; careers|||Bài 8 — Ước mơ &amp; nghề nghiệp',
  'Từ vựng: 理想, 职业, 选择, 努力, 成功, 实现, 机会, 坚持, 将来. Ngữ pháp: 只要…就 (chỉ cần…là), 无论…都 (bất kể…đều), bổ ngữ xu hướng 起来.',
  [[
    `<span class="eyebrow">CHI331 · Lesson 8 · Dreams &amp; careers</span>
<h2>Dreams &amp; careers (理想和职业)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>理想</td><td>lǐxiǎng</td><td>ideal / dream</td></tr>
<tr><td>职业</td><td>zhíyè</td><td>occupation / career</td></tr>
<tr><td>选择</td><td>xuǎnzé</td><td>to choose; choice</td></tr>
<tr><td>努力</td><td>nǔlì</td><td>to work hard</td></tr>
<tr><td>成功</td><td>chénggōng</td><td>success; to succeed</td></tr>
<tr><td>实现</td><td>shíxiàn</td><td>to realize / achieve</td></tr>
<tr><td>机会</td><td>jīhuì</td><td>opportunity</td></tr>
<tr><td>坚持</td><td>jiānchí</td><td>to persist</td></tr>
<tr><td>将来</td><td>jiānglái</td><td>the future</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>只要 … 就 …</strong> = as long as … then: <strong>只要</strong>坚持努力，<strong>就</strong>一定能成功 (as long as you keep working hard, you will surely succeed).</li>
<li><strong>无论 … 都 …</strong> = no matter … all: <strong>无论</strong>遇到什么困难，<strong>都</strong>不要放弃 (no matter what difficulty you meet, do not give up).</li>
<li><strong>起来 (compound directional complement)</strong>: 说<strong>起</strong>理想，他就高兴<strong>起来</strong> (speaking of his dream, he cheers up).</li>
<li><strong>实现 shíxiàn</strong> = to realize: 努力<strong>选择</strong>正确的<strong>职业</strong>，才能<strong>实现</strong>理想 (only by choosing the right career can you realize your dream).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你将来想做什么职业？ Nǐ jiānglái xiǎng zuò shénme zhíyè? (What career do you want in the future?)
B: 我的理想是当老师。 Wǒ de lǐxiǎng shì dāng lǎoshī. (My dream is to be a teacher.)
A: 一说起理想，你就高兴起来了。 Yì shuōqǐ lǐxiǎng, nǐ jiù gāoxìng qǐlái le. (As soon as you speak of your dream, you cheer up.)
B: 是啊，只要坚持努力，无论多难，都能成功。 Shì a, zhǐyào jiānchí nǔlì, wúlùn duō nán, dōu néng chénggōng. (Yes, as long as I keep trying, no matter how hard, I can succeed.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 只要 (as long as) gives a sufficient condition — one thing is enough; 只有 (only if) gives a necessary one — nothing else works. Do not mix them: 只要 pairs with 就, 只有 pairs with 才.</div>`,
    `<span class="eyebrow">CHI331 · Bài 8 · Ước mơ</span>
<h2>Ước mơ &amp; nghề nghiệp (理想和职业)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>理想</td><td>lǐxiǎng</td><td>lý tưởng, ước mơ</td></tr>
<tr><td>职业</td><td>zhíyè</td><td>nghề nghiệp</td></tr>
<tr><td>选择</td><td>xuǎnzé</td><td>lựa chọn</td></tr>
<tr><td>努力</td><td>nǔlì</td><td>nỗ lực, cố gắng</td></tr>
<tr><td>成功</td><td>chénggōng</td><td>thành công</td></tr>
<tr><td>实现</td><td>shíxiàn</td><td>thực hiện, đạt được</td></tr>
<tr><td>机会</td><td>jīhuì</td><td>cơ hội</td></tr>
<tr><td>坚持</td><td>jiānchí</td><td>kiên trì</td></tr>
<tr><td>将来</td><td>jiānglái</td><td>tương lai</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>只要 … 就 …</strong> = chỉ cần … là: <strong>只要</strong>坚持努力，<strong>就</strong>一定能成功 (chỉ cần kiên trì cố gắng, nhất định sẽ thành công).</li>
<li><strong>无论 … 都 …</strong> = bất kể … đều: <strong>无论</strong>遇到什么困难，<strong>都</strong>不要放弃 (bất kể gặp khó khăn gì, đều đừng bỏ cuộc).</li>
<li><strong>起来 (bổ ngữ xu hướng phức hợp)</strong>: 说<strong>起</strong>理想，他就高兴<strong>起来</strong> (nói đến ước mơ, anh ấy vui hẳn lên).</li>
<li><strong>实现 shíxiàn</strong> = thực hiện: 努力<strong>选择</strong>正确的<strong>职业</strong>，才能<strong>实现</strong>理想 (cố gắng chọn đúng nghề mới thực hiện được ước mơ).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你将来想做什么职业？ Nǐ jiānglái xiǎng zuò shénme zhíyè? (Tương lai bạn muốn làm nghề gì?)
B: 我的理想是当老师。 Wǒ de lǐxiǎng shì dāng lǎoshī. (Ước mơ của tôi là làm giáo viên.)
A: 一说起理想，你就高兴起来了。 Yì shuōqǐ lǐxiǎng, nǐ jiù gāoxìng qǐlái le. (Hễ nói đến ước mơ là bạn vui hẳn lên.)
B: 是啊，只要坚持努力，无论多难，都能成功。 Shì a, zhǐyào jiānchí nǔlì, wúlùn duō nán, dōu néng chénggōng. (Ừ, chỉ cần kiên trì cố gắng, dù khó thế nào, đều thành công được.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 只要 (chỉ cần) nêu điều kiện đủ — một điều là đủ; 只有 (chỉ có) nêu điều kiện cần — không còn cách khác. Đừng lẫn: 只要 đi với 就, 只有 đi với 才.</div>`,
  ]]);

const b8q = quiz('chi331-quiz-8', 'Quiz 8 — Dreams &amp; careers|||Quiz 8 — Ước mơ &amp; nghề nghiệp', [
  { id: 'q1', question: 'Câu 只要坚持努力，就一定能成功 nghĩa là? / What does it mean?', options: ['Cố gắng cũng không thành công|||effort will not lead to success', 'Chỉ cần kiên trì cố gắng là nhất định thành công|||as long as you keep trying, you will surely succeed', 'Thành công không cần cố gắng|||success needs no effort', 'Khó nên bỏ cuộc|||it is hard so give up'], correctIndex: 1, explanation: '只要…就… nêu điều kiện đủ: chỉ cần 坚持努力 là 一定能成功.' },
  { id: 'q2', question: '"无论多难，都不要放弃" nghĩa là? / What does it mean?', options: ['nếu khó thì bỏ|||if hard, give up', 'bất kể khó thế nào, đều đừng bỏ cuộc|||no matter how hard, do not give up', 'chỉ khó một chút|||only a little hard', 'khó nên nghỉ|||hard so rest'], correctIndex: 1, explanation: '无论…都… = bất kể … đều: 无论多难，都不要放弃.' },
  { id: 'q3', question: '"实现理想" nghĩa là? / What does 实现理想 mean?', options: ['từ bỏ ước mơ|||give up the dream', 'thực hiện được ước mơ|||to realize the dream', 'quên ước mơ|||forget the dream', 'thay đổi ước mơ|||change the dream'], correctIndex: 1, explanation: '实现 = thực hiện, đạt được: 实现理想 = thực hiện được ước mơ.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CHI331',
    slug: 'chi331-integrated-chinese-5',
    title: 'Integrated Chinese 5',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHI331.webp',
    shortDescription: 'Integrated Chinese 5 (continues CHI321, HSK3 to HSK4) — culture & customs, East-West differences, study & stress, environment, tech & internet, health, friendship, dreams & careers. Bilingual vocab, grammar, dialogues & quizzes.|||Tiếng Trung tổng hợp 5 (nối tiếp CHI321, HSK3 lên HSK4) — văn hóa & phong tục, so sánh Đông-Tây, học tập & áp lực, môi trường, công nghệ, sức khỏe, tình bạn, ước mơ & nghề nghiệp. Song ngữ từ vựng, ngữ pháp, hội thoại & quiz.',
    description: 'Môn <strong>CHI331 — Integrated Chinese 5 (Tiếng Trung tổng hợp 5)</strong> <strong>nối tiếp CHI321</strong> trên track <strong>Integrated Chinese</strong> (Liu et al., Cheng &amp; Tsui), đưa bạn từ HSK3 lên mức tương đương HSK4. Học tiếp qua các chủ đề trung cấp: <strong>văn hóa &amp; phong tục</strong> → <strong>so sánh Đông-Tây</strong> → <strong>học tập &amp; áp lực</strong> → <strong>môi trường &amp; bảo vệ</strong> → <strong>công nghệ &amp; internet</strong> → <strong>sức khỏe &amp; thói quen</strong> → <strong>tình bạn &amp; xã giao</strong> → <strong>ước mơ &amp; nghề nghiệp</strong>. Song ngữ Trung–Việt, mỗi bài có bảng từ vựng (汉字 | pinyin | nghĩa), điểm ngữ pháp kèm ví dụ, hội thoại ngắn, ghi chú và quiz.',
    whatYouLearn: 'Văn hóa &amp; phong tục (文化, 风俗, 传统, 春节, 随着, 对…来说); so sánh Đông-Tây (中西方, 差别, 观念, 接受, 不是…而是, 一方面…另一方面); học tập &amp; áp lực (压力, 成绩, 复习, 紧张, 只要…就, 起来); môi trường (环境, 污染, 保护, 节约, 无论…都, 通过); công nghệ &amp; internet (网络, 手机, 方便, 影响, 沉迷, 即使…也, 下去); sức khỏe &amp; thói quen (健康, 饮食, 运动, 规律, 保持, 坚持下去); tình bạn &amp; xã giao (朋友, 性格, 交往, 误会, 理解, 信任); ước mơ &amp; nghề nghiệp (理想, 职业, 选择, 成功, 实现, 无论…都).',
    requirements: 'Cần hoàn thành CHI321 hoặc nắm vững pinyin, 4 thanh điệu, câu chữ 把, câu bị động 被, bổ ngữ khả năng (听得懂/买不起), các mẫu 虽然…但是 và 不但…而且, cùng từ vựng đời sống, mua sắm, giao thông và sức khỏe. Nên cài Pleco hoặc dùng từ điển hanzii.net để tra chữ &amp; nghe phát âm; luyện viết chữ Hán theo thứ tự nét.',
  },
  sections: [
    { title: '📚 Tài liệu &amp; lộ trình|||📚 Course materials', description: 'Giáo trình Integrated Chinese (Level 2 Part 2), workbook, app, từ điển, YouTube, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CHI321, track Integrated Chinese, mục tiêu HSK3 lên HSK4, cách học.', lessons: [intro] },
    { title: 'Bài 1 — Văn hóa &amp; phong tục|||Lesson 1 — Culture &amp; customs', description: '文化, 风俗, 传统, 节日, 春节, 随着, 对…来说.', lessons: [b1, b1q] },
    { title: 'Bài 2 — So sánh Đông-Tây|||Lesson 2 — East-West differences', description: '中西方, 差别, 区别, 观念, 接受, 不是…而是, 一方面…另一方面.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Học tập &amp; áp lực|||Lesson 3 — Study &amp; stress', description: '压力, 成绩, 努力, 放松, 复习, 只要…就, 起来.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Môi trường &amp; bảo vệ|||Lesson 4 — Environment &amp; protection', description: '环境, 污染, 保护, 节约, 垃圾, 无论…都, 通过.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Công nghệ &amp; internet|||Lesson 5 — Technology &amp; the internet', description: '网络, 手机, 方便, 影响, 沉迷, 即使…也, 下去.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Sức khỏe &amp; thói quen|||Lesson 6 — Health &amp; habits', description: '健康, 饮食, 运动, 规律, 保持, 坚持下去, 对…来说.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Tình bạn &amp; xã giao|||Lesson 7 — Friendship &amp; getting along', description: '朋友, 性格, 交往, 帮助, 误会, 不是…而是, 一方面…另一方面.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Ước mơ &amp; nghề nghiệp|||Lesson 8 — Dreams &amp; careers', description: '理想, 职业, 选择, 努力, 成功, 只要…就, 无论…都.', lessons: [b8, b8q] },
  ],
};
