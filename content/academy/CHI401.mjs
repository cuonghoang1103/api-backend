/**
 * CHI401 — Integrated Chinese 6 (Tiếng Trung tổng hợp 6). Khối Ngôn ngữ Trung
 * FPTU. NỐI TIẾP CHI331. Đây là MÔN NGÔN NGỮ: cấu trúc theo BÀI HỌC TIẾNG (từ
 * vựng, ngữ pháp, hội thoại, luyện tập) theo track "Integrated Chinese", bám
 * Level 2 Part 2 (Liu et al., Cheng &amp; Tsui) — mức tương đương HSK4.
 * Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick lồng/${; trong HTML content "&" → "&amp;". shortDescription
 * dùng "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chi401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình học',
  'Giáo trình chuẩn (Integrated Chinese Level 2 Part 2, Liu et al.), workbook & character workbook, app (Pleco/Anki), từ điển hanzii.net, YouTube, lộ trình 4 bước. Nhắc lại nền tảng CHI331.',
  [[
    `<span class="eyebrow">CHI401 · Materials</span>
<h2>How to keep learning Chinese — materials &amp; roadmap</h2>
<p class="lead">Integrated Chinese 6 <strong>continues CHI331</strong> on the <strong>Integrated Chinese</strong> track: it assumes you already have the connectives 无论…都, 只要…就 and 即使…也, plus the compound directional complements 起来 and 下去. It now moves toward more formal, abstract topics — the economy and online shopping, jobs and interviews, study abroad, society and generations, media, arts, health and psychology, and globalization — at roughly <strong>HSK4</strong>. Below are the standard textbook plus free tools.</p>
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
<li><strong>Review CHI331</strong> — make sure 无论…都, 只要…就, 即使…也 and the complements 起来 / 下去 are solid before you start.</li>
<li><strong>Vocabulary</strong> — learn hanzi in context, review daily with Anki/Pleco.</li>
<li><strong>Grammar</strong> — new HSK4 connectives (不管…都, 既…又, 与其…不如, 之所以…是因为) build on old word order.</li>
<li><strong>Speaking</strong> — say every sentence out loud; shadow the audio.</li>
</ol></div>`,
    `<span class="eyebrow">CHI401 · Tài liệu</span>
<h2>Học tiếp tiếng Trung — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung tổng hợp 6 <strong>nối tiếp CHI331</strong> trên track <strong>Integrated Chinese</strong>: giả định bạn đã nắm các liên từ 无论…都, 只要…就 và 即使…也, cùng bổ ngữ xu hướng phức hợp 起来 và 下去. Giờ học chuyển sang các chủ đề trang trọng, trừu tượng hơn — kinh tế và mua sắm online, việc làm và phỏng vấn, du học, xã hội và thế hệ, truyền thông, nghệ thuật, sức khỏe và tâm lý, và toàn cầu hóa — ở mức tương đương <strong>HSK4</strong>. Bên dưới là giáo trình chuẩn cùng công cụ miễn phí.</p>
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
<li><strong>Ôn CHI331</strong> — bảo đảm 无论…都, 只要…就, 即使…也 và bổ ngữ 起来 / 下去 đã vững trước khi bắt đầu.</li>
<li><strong>Từ vựng</strong> — học chữ Hán trong ngữ cảnh, ôn mỗi ngày bằng Anki/Pleco.</li>
<li><strong>Ngữ pháp</strong> — liên từ HSK4 mới (不管…都, 既…又, 与其…不如, 之所以…是因为) xây trên trật tự từ cũ.</li>
<li><strong>Luyện nói</strong> — đọc to mọi câu; nói nhại theo audio.</li>
</ol></div>`,
  ]]);

const intro = doc('chi401-0-1-overview', 'Course overview: Integrated Chinese 6|||Tổng quan: Tiếng Trung tổng hợp 6',
  'Nối tiếp CHI331 (无论…都, 只要…就, 即使…也, bổ ngữ 起来/下去), track Integrated Chinese, mục tiêu HSK4, và lộ trình 8 bài chủ đề nâng cao.',
  [[
    `<span class="eyebrow">CHI401 · Lesson 0.1 · Overview</span>
<h2>Integrated Chinese 6</h2>
<p class="lead">This course picks up right where <strong>CHI331</strong> left off, still on the <strong>Integrated Chinese</strong> (Liu et al.) track. You already have 无论…都, 只要…就, 即使…也 and the complements 起来 / 下去; now you learn to talk about the economy and online shopping, jobs and interviews, study abroad, society and generations, media and social networks, arts and culture, health and psychology, and globalization and the future.</p>
<h3>What is new at this level</h3>
<ul>
<li><strong>不管 … 都 …</strong> — 不管年轻人还是父母，都需要多沟通 (no matter young people or parents, all need to communicate more).</li>
<li><strong>既 … 又 …</strong> — 网购既方便又便宜 (online shopping is both convenient and cheap).</li>
<li><strong>与其 … 不如 …</strong> — 与其抱怨薪水低，不如提高能力 (rather than complain about low pay, better raise your ability).</li>
<li><strong>之所以 … 是因为 …</strong> — 他之所以成功，是因为一直坚持 (the reason he succeeded is that he kept persisting).</li>
</ul>
<h3>Roadmap of this course</h3>
<p>Economy &amp; online shopping → jobs &amp; interviews → study abroad → society &amp; generations → media &amp; social networks → arts &amp; culture → health &amp; psychology → globalization &amp; the future. Every lesson has a vocabulary table (汉字 | pinyin | meaning), grammar points with examples, a short dialogue, notes, and a quiz.</p>`,
    `<span class="eyebrow">CHI401 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung tổng hợp 6</h2>
<p class="lead">Môn này học tiếp ngay từ chỗ <strong>CHI331</strong> dừng lại, vẫn trên track <strong>Integrated Chinese</strong> (Liu và cộng sự). Bạn đã có 无论…都, 只要…就, 即使…也 và bổ ngữ 起来 / 下去; giờ học cách nói về kinh tế và mua sắm online, việc làm và phỏng vấn, du học, xã hội và thế hệ, truyền thông và mạng xã hội, văn hóa và nghệ thuật, sức khỏe và tâm lý, và toàn cầu hóa cùng tương lai.</p>
<h3>Điểm mới ở trình độ này</h3>
<ul>
<li><strong>不管 … 都 …</strong> — 不管年轻人还是父母，都需要多沟通 (bất kể người trẻ hay cha mẹ, đều cần trao đổi nhiều).</li>
<li><strong>既 … 又 …</strong> — 网购既方便又便宜 (mua sắm online vừa tiện vừa rẻ).</li>
<li><strong>与其 … 不如 …</strong> — 与其抱怨薪水低，不如提高能力 (thay vì than lương thấp, chẳng bằng nâng cao năng lực).</li>
<li><strong>之所以 … 是因为 …</strong> — 他之所以成功，是因为一直坚持 (sở dĩ anh ấy thành công là vì luôn kiên trì).</li>
</ul>
<h3>Lộ trình của môn</h3>
<p>Kinh tế &amp; mua sắm online → việc làm &amp; phỏng vấn → du học → xã hội &amp; thế hệ → truyền thông &amp; mạng xã hội → văn hóa &amp; nghệ thuật → sức khỏe &amp; tâm lý → toàn cầu hóa &amp; tương lai. Mỗi bài có bảng từ vựng (汉字 | pinyin | nghĩa), điểm ngữ pháp kèm ví dụ, một hội thoại ngắn, ghi chú, và quiz.</p>`,
  ]]);

const b1 = doc('chi401-1-1-economy-shopping', 'Lesson 1 — Economy &amp; online shopping|||Bài 1 — Kinh tế &amp; mua sắm online',
  'Từ vựng: 经济, 网购, 消费, 支付, 优惠, 打折, 购物, 价格, 既. Ngữ pháp: 既…又 (vừa…vừa), 支付/打折.',
  [[
    `<span class="eyebrow">CHI401 · Lesson 1 · Economy</span>
<h2>Economy &amp; online shopping (经济和网购)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>经济</td><td>jīngjì</td><td>economy; economical</td></tr>
<tr><td>网购</td><td>wǎnggòu</td><td>online shopping</td></tr>
<tr><td>消费</td><td>xiāofèi</td><td>to consume; consumption</td></tr>
<tr><td>支付</td><td>zhīfù</td><td>to pay</td></tr>
<tr><td>优惠</td><td>yōuhuì</td><td>discount / preferential offer</td></tr>
<tr><td>打折</td><td>dǎzhé</td><td>to give a discount</td></tr>
<tr><td>购物</td><td>gòuwù</td><td>to shop; shopping</td></tr>
<tr><td>价格</td><td>jiàgé</td><td>price</td></tr>
<tr><td>既</td><td>jì</td><td>both (in 既…又)</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>既 … 又 …</strong> = both … and …: 网购<strong>既</strong>方便<strong>又</strong>便宜 (online shopping is both convenient and cheap).</li>
<li><strong>支付 zhīfù</strong> = to pay: 现在很多人用手机<strong>支付</strong> (many people now pay by phone).</li>
<li><strong>打折 dǎzhé</strong> = to discount: 节日的时候商店常常<strong>打折</strong> (shops often give discounts during holidays).</li>
<li><strong>消费 xiāofèi</strong> = to consume: 年轻人的<strong>消费</strong>观念跟父母不一样 (young people have different spending ideas from their parents).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你为什么喜欢网购？ Nǐ wèishénme xǐhuan wǎnggòu? (Why do you like online shopping?)
B: 网购既方便又有很多优惠。 Wǎnggòu jì fāngbiàn yòu yǒu hěn duō yōuhuì. (Online shopping is both convenient and full of discounts.)
A: 你一般怎么支付？ Nǐ yìbān zěnme zhīfù? (How do you usually pay?)
B: 用手机支付，很快。 Yòng shǒujī zhīfù, hěn kuài. (I pay by phone, very fast.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 既 … 又 … links two qualities of the same thing and both parts are usually adjectives or verbs of similar length: 这件衣服<strong>既</strong>好看<strong>又</strong>便宜 (this dress is both nice and cheap). The idiom 一举两得 (yī jǔ liǎng dé, to gain two things at once) fits online bargains well.</div>`,
    `<span class="eyebrow">CHI401 · Bài 1 · Kinh tế</span>
<h2>Kinh tế &amp; mua sắm online (经济和网购)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>经济</td><td>jīngjì</td><td>kinh tế; tiết kiệm</td></tr>
<tr><td>网购</td><td>wǎnggòu</td><td>mua sắm online</td></tr>
<tr><td>消费</td><td>xiāofèi</td><td>tiêu dùng, tiêu xài</td></tr>
<tr><td>支付</td><td>zhīfù</td><td>chi trả, thanh toán</td></tr>
<tr><td>优惠</td><td>yōuhuì</td><td>ưu đãi</td></tr>
<tr><td>打折</td><td>dǎzhé</td><td>giảm giá</td></tr>
<tr><td>购物</td><td>gòuwù</td><td>mua sắm</td></tr>
<tr><td>价格</td><td>jiàgé</td><td>giá cả</td></tr>
<tr><td>既</td><td>jì</td><td>vừa (trong 既…又)</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>既 … 又 …</strong> = vừa … vừa …: 网购<strong>既</strong>方便<strong>又</strong>便宜 (mua online vừa tiện vừa rẻ).</li>
<li><strong>支付 zhīfù</strong> = chi trả, thanh toán: 现在很多人用手机<strong>支付</strong> (giờ nhiều người thanh toán bằng điện thoại).</li>
<li><strong>打折 dǎzhé</strong> = giảm giá: 节日的时候商店常常<strong>打折</strong> (dịp lễ cửa hàng thường giảm giá).</li>
<li><strong>消费 xiāofèi</strong> = tiêu dùng: 年轻人的<strong>消费</strong>观念跟父母不一样 (quan niệm tiêu dùng của người trẻ khác cha mẹ).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你为什么喜欢网购？ Nǐ wèishénme xǐhuan wǎnggòu? (Sao bạn thích mua online?)
B: 网购既方便又有很多优惠。 Wǎnggòu jì fāngbiàn yòu yǒu hěn duō yōuhuì. (Mua online vừa tiện lại vừa nhiều ưu đãi.)
A: 你一般怎么支付？ Nǐ yìbān zěnme zhīfù? (Bạn thường thanh toán thế nào?)
B: 用手机支付，很快。 Yòng shǒujī zhīfù, hěn kuài. (Thanh toán bằng điện thoại, rất nhanh.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 既 … 又 … nối hai đặc điểm của cùng một sự vật, hai vế thường là tính từ hoặc động từ dài tương đương: 这件衣服<strong>既</strong>好看<strong>又</strong>便宜 (áo này vừa đẹp vừa rẻ). Thành ngữ 一举两得 (yī jǔ liǎng dé, một công đôi việc) rất hợp để nói về săn ưu đãi online.</div>`,
  ]]);

const b1q = quiz('chi401-quiz-1', 'Quiz 1 — Economy &amp; online shopping|||Quiz 1 — Kinh tế &amp; mua sắm online', [
  { id: 'q1', question: 'Mẫu "既…又…" nghĩa là? / What does 既…又… mean?', options: ['vừa … vừa …|||both … and …', 'chỉ cần … là …|||as long as … then …', 'không phải … mà là …|||not … but …', 'tuy … nhưng …|||although … but …'], correctIndex: 0, explanation: '既…又… nối hai đặc điểm của một sự vật: 网购既方便又便宜.' },
  { id: 'q2', question: '"支付" (zhīfù) nghĩa là? / What does 支付 mean?', options: ['tiết kiệm|||to save', 'chi trả, thanh toán|||to pay', 'giảm giá|||to discount', 'mua sắm|||to shop'], correctIndex: 1, explanation: '支付 = chi trả, thanh toán: 用手机支付 = thanh toán bằng điện thoại.' },
  { id: 'q3', question: '"打折" (dǎzhé) nghĩa là? / What does 打折 mean?', options: ['tăng giá|||to raise the price', 'giảm giá|||to give a discount', 'trả tiền|||to pay', 'đặt hàng|||to order'], correctIndex: 1, explanation: '打折 = giảm giá: 商店常常打折 = cửa hàng thường giảm giá.' },
]);

const b2 = doc('chi401-2-1-jobs-interviews', 'Lesson 2 — Jobs &amp; interviews|||Bài 2 — Việc làm &amp; phỏng vấn',
  'Từ vựng: 求职, 简历, 面试, 能力, 薪水, 经验, 应聘, 招聘, 与其. Ngữ pháp: 与其…不如 (chẳng thà), 之所以…是因为 (sở dĩ…là vì).',
  [[
    `<span class="eyebrow">CHI401 · Lesson 2 · Jobs</span>
<h2>Jobs &amp; interviews (求职和面试)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>求职</td><td>qiúzhí</td><td>to look for a job</td></tr>
<tr><td>简历</td><td>jiǎnlì</td><td>résumé / CV</td></tr>
<tr><td>面试</td><td>miànshì</td><td>interview; to interview</td></tr>
<tr><td>能力</td><td>nénglì</td><td>ability</td></tr>
<tr><td>薪水</td><td>xīnshuǐ</td><td>salary</td></tr>
<tr><td>经验</td><td>jīngyàn</td><td>experience</td></tr>
<tr><td>应聘</td><td>yìngpìn</td><td>to apply for a job</td></tr>
<tr><td>招聘</td><td>zhāopìn</td><td>to recruit</td></tr>
<tr><td>与其</td><td>yǔqí</td><td>rather than (in 与其…不如)</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>与其 … 不如 …</strong> = rather than … better …: <strong>与其</strong>抱怨薪水低，<strong>不如</strong>提高自己的能力 (rather than complain about low pay, better raise your own ability).</li>
<li><strong>之所以 … 是因为 …</strong> = the reason … is that …: 他<strong>之所以</strong>被录取，<strong>是因为</strong>经验丰富 (the reason he was hired is that he has rich experience).</li>
<li><strong>面试 miànshì</strong> = interview: <strong>面试</strong>的时候要有信心 (be confident during the interview).</li>
<li><strong>简历 jiǎnlì</strong> = résumé: 投<strong>简历</strong>以前先修改好 (revise your résumé before you submit it).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 我应聘了好几家公司，都没有回复。 Wǒ yìngpìn le hǎo jǐ jiā gōngsī, dōu méiyǒu huífù. (I applied to several companies with no reply.)
B: 与其等消息，不如先改一改简历。 Yǔqí děng xiāoxi, bùrú xiān gǎi yi gǎi jiǎnlì. (Rather than wait, better revise your résumé first.)
A: 你说得对。面试的时候我也太紧张了。 Nǐ shuō de duì. Miànshì de shíhou wǒ yě tài jǐnzhāng le. (You are right. I was also too nervous in the interview.)
B: 之所以紧张，是因为准备得不够。 Zhīsuǒyǐ jǐnzhāng, shì yīnwèi zhǔnbèi de bú gòu. (You were nervous because you did not prepare enough.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 与其 … 不如 … compares two choices and prefers the second: 与其坐车，不如走路 (rather than take the bus, better walk). 之所以 … 是因为 … puts the result first and the reason after — the reverse of 因为 … 所以 …</div>`,
    `<span class="eyebrow">CHI401 · Bài 2 · Việc làm</span>
<h2>Việc làm &amp; phỏng vấn (求职和面试)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>求职</td><td>qiúzhí</td><td>tìm việc, xin việc</td></tr>
<tr><td>简历</td><td>jiǎnlì</td><td>sơ yếu lý lịch, CV</td></tr>
<tr><td>面试</td><td>miànshì</td><td>phỏng vấn</td></tr>
<tr><td>能力</td><td>nénglì</td><td>năng lực</td></tr>
<tr><td>薪水</td><td>xīnshuǐ</td><td>lương</td></tr>
<tr><td>经验</td><td>jīngyàn</td><td>kinh nghiệm</td></tr>
<tr><td>应聘</td><td>yìngpìn</td><td>ứng tuyển</td></tr>
<tr><td>招聘</td><td>zhāopìn</td><td>tuyển dụng</td></tr>
<tr><td>与其</td><td>yǔqí</td><td>chẳng thà (trong 与其…不如)</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>与其 … 不如 …</strong> = chẳng thà … không bằng …: <strong>与其</strong>抱怨薪水低，<strong>不如</strong>提高自己的能力 (thay vì than lương thấp, chẳng bằng nâng cao năng lực của mình).</li>
<li><strong>之所以 … 是因为 …</strong> = sở dĩ … là vì …: 他<strong>之所以</strong>被录取，<strong>是因为</strong>经验丰富 (sở dĩ anh ấy được nhận là vì kinh nghiệm phong phú).</li>
<li><strong>面试 miànshì</strong> = phỏng vấn: <strong>面试</strong>的时候要有信心 (khi phỏng vấn phải tự tin).</li>
<li><strong>简历 jiǎnlì</strong> = CV: 投<strong>简历</strong>以前先修改好 (trước khi nộp CV hãy sửa kỹ).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 我应聘了好几家公司，都没有回复。 Wǒ yìngpìn le hǎo jǐ jiā gōngsī, dōu méiyǒu huífù. (Tôi ứng tuyển mấy công ty mà chẳng nơi nào hồi âm.)
B: 与其等消息，不如先改一改简历。 Yǔqí děng xiāoxi, bùrú xiān gǎi yi gǎi jiǎnlì. (Thay vì đợi tin, chẳng bằng sửa CV trước.)
A: 你说得对。面试的时候我也太紧张了。 Nǐ shuō de duì. Miànshì de shíhou wǒ yě tài jǐnzhāng le. (Bạn nói đúng. Lúc phỏng vấn tôi cũng quá căng.)
B: 之所以紧张，是因为准备得不够。 Zhīsuǒyǐ jǐnzhāng, shì yīnwèi zhǔnbèi de bú gòu. (Sở dĩ căng là vì chuẩn bị chưa đủ.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 与其 … 不如 … so sánh hai lựa chọn và nghiêng về vế sau: 与其坐车，不如走路 (thay vì đi xe, chẳng bằng đi bộ). 之所以 … 是因为 … nêu kết quả trước, lý do sau — ngược với 因为 … 所以 …</div>`,
  ]]);

const b2q = quiz('chi401-quiz-2', 'Quiz 2 — Jobs &amp; interviews|||Quiz 2 — Việc làm &amp; phỏng vấn', [
  { id: 'q1', question: 'Mẫu "与其…不如…" nghĩa là? / What does 与其…不如… mean?', options: ['vừa … vừa …|||both … and …', 'chẳng thà … không bằng …|||rather than … better …', 'bất kể … đều …|||no matter … all …', 'sở dĩ … là vì …|||the reason … is that …'], correctIndex: 1, explanation: '与其…不如… so sánh và nghiêng về vế sau: 与其抱怨薪水低，不如提高能力.' },
  { id: 'q2', question: 'Mẫu "之所以…是因为…" nghĩa là? / What does 之所以…是因为… mean?', options: ['nếu … thì …|||if … then …', 'sở dĩ … là vì …|||the reason … is that …', 'tuy … nhưng …|||although … but …', 'chỉ cần … là …|||as long as … then …'], correctIndex: 1, explanation: '之所以…是因为… nêu kết quả trước, lý do sau: 他之所以被录取，是因为经验丰富.' },
  { id: 'q3', question: '"简历" (jiǎnlì) nghĩa là? / What does 简历 mean?', options: ['phỏng vấn|||interview', 'sơ yếu lý lịch, CV|||résumé / CV', 'lương|||salary', 'kinh nghiệm|||experience'], correctIndex: 1, explanation: '简历 = sơ yếu lý lịch, CV: 投简历 = nộp CV.' },
]);

const b3 = doc('chi401-3-1-study-abroad', 'Lesson 3 — Education &amp; study abroad|||Bài 3 — Giáo dục &amp; du học',
  'Từ vựng: 留学, 申请, 奖学金, 适应, 挑战, 专业, 提前, 尽管, 以便. Ngữ pháp: 尽管…还是 (mặc dù…vẫn), 以便 (để tiện).',
  [[
    `<span class="eyebrow">CHI401 · Lesson 3 · Study abroad</span>
<h2>Education &amp; study abroad (教育和留学)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>留学</td><td>liúxué</td><td>to study abroad</td></tr>
<tr><td>申请</td><td>shēnqǐng</td><td>to apply</td></tr>
<tr><td>奖学金</td><td>jiǎngxuéjīn</td><td>scholarship</td></tr>
<tr><td>适应</td><td>shìyìng</td><td>to adapt</td></tr>
<tr><td>挑战</td><td>tiǎozhàn</td><td>challenge</td></tr>
<tr><td>专业</td><td>zhuānyè</td><td>major / field of study</td></tr>
<tr><td>提前</td><td>tíqián</td><td>in advance / ahead of time</td></tr>
<tr><td>尽管</td><td>jǐnguǎn</td><td>although / even though</td></tr>
<tr><td>以便</td><td>yǐbiàn</td><td>so that / in order to</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>尽管 … 还是 …</strong> = although … still …: <strong>尽管</strong>有很多挑战，他<strong>还是</strong>决定去留学 (although there are many challenges, he still decided to study abroad).</li>
<li><strong>以便 yǐbiàn</strong> = so that / in order to: 提前<strong>申请</strong>奖学金，<strong>以便</strong>早点儿准备 (apply for the scholarship early so that you can prepare sooner).</li>
<li><strong>适应 shìyìng</strong> = to adapt: 刚到国外要慢慢<strong>适应</strong>新环境 (when you first arrive abroad, adapt to the new environment gradually).</li>
<li><strong>申请 shēnqǐng</strong> = to apply: <strong>申请</strong>留学要准备很多材料 (applying to study abroad needs a lot of documents).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你打算申请哪个国家的大学？ Nǐ dǎsuàn shēnqǐng nǎge guójiā de dàxué? (Which country are you applying to?)
B: 还没定。尽管有挑战，我还是想去留学。 Hái méi dìng. Jǐnguǎn yǒu tiǎozhàn, wǒ háishì xiǎng qù liúxué. (Not decided. Although there are challenges, I still want to study abroad.)
A: 那要早点儿准备。 Nà yào zǎo diǎnr zhǔnbèi. (Then prepare early.)
B: 对，我要提前申请奖学金，以便减轻压力。 Duì, wǒ yào tíqián shēnqǐng jiǎngxuéjīn, yǐbiàn jiǎnqīng yālì. (Right, I will apply for a scholarship early so as to ease the pressure.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 尽管 introduces a fact you accept, and the main clause pushes back with 还是 / 但是: 尽管很累，他还是坚持了 (although tired, he still persisted). 以便 always begins the second clause and states a purpose that becomes easier because of the first.</div>`,
    `<span class="eyebrow">CHI401 · Bài 3 · Du học</span>
<h2>Giáo dục &amp; du học (教育和留学)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>留学</td><td>liúxué</td><td>du học</td></tr>
<tr><td>申请</td><td>shēnqǐng</td><td>nộp đơn, đăng ký</td></tr>
<tr><td>奖学金</td><td>jiǎngxuéjīn</td><td>học bổng</td></tr>
<tr><td>适应</td><td>shìyìng</td><td>thích nghi</td></tr>
<tr><td>挑战</td><td>tiǎozhàn</td><td>thử thách</td></tr>
<tr><td>专业</td><td>zhuānyè</td><td>chuyên ngành</td></tr>
<tr><td>提前</td><td>tíqián</td><td>trước hạn, sớm hơn</td></tr>
<tr><td>尽管</td><td>jǐnguǎn</td><td>mặc dù</td></tr>
<tr><td>以便</td><td>yǐbiàn</td><td>để, để tiện</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>尽管 … 还是 …</strong> = mặc dù … vẫn …: <strong>尽管</strong>有很多挑战，他<strong>还是</strong>决定去留学 (mặc dù có nhiều thử thách, anh ấy vẫn quyết định đi du học).</li>
<li><strong>以便 yǐbiàn</strong> = để, để tiện: 提前<strong>申请</strong>奖学金，<strong>以便</strong>早点儿准备 (nộp đơn học bổng sớm để chuẩn bị sớm hơn).</li>
<li><strong>适应 shìyìng</strong> = thích nghi: 刚到国外要慢慢<strong>适应</strong>新环境 (mới đến nước ngoài phải dần thích nghi môi trường mới).</li>
<li><strong>申请 shēnqǐng</strong> = nộp đơn: <strong>申请</strong>留学要准备很多材料 (xin du học phải chuẩn bị nhiều hồ sơ).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你打算申请哪个国家的大学？ Nǐ dǎsuàn shēnqǐng nǎge guójiā de dàxué? (Bạn định nộp đơn vào đại học nước nào?)
B: 还没定。尽管有挑战，我还是想去留学。 Hái méi dìng. Jǐnguǎn yǒu tiǎozhàn, wǒ háishì xiǎng qù liúxué. (Chưa quyết. Dù có thử thách, tôi vẫn muốn đi du học.)
A: 那要早点儿准备。 Nà yào zǎo diǎnr zhǔnbèi. (Vậy phải chuẩn bị sớm.)
B: 对，我要提前申请奖学金，以便减轻压力。 Duì, wǒ yào tíqián shēnqǐng jiǎngxuéjīn, yǐbiàn jiǎnqīng yālì. (Đúng, tôi nộp học bổng sớm để giảm bớt áp lực.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 尽管 nêu một sự thật bạn chấp nhận, vế chính đẩy lại bằng 还是 / 但是: 尽管很累，他还是坚持了 (dù mệt, anh ấy vẫn kiên trì). 以便 luôn mở đầu vế sau và nêu mục đích trở nên dễ hơn nhờ vế trước.</div>`,
  ]]);

const b3q = quiz('chi401-quiz-3', 'Quiz 3 — Education &amp; study abroad|||Quiz 3 — Giáo dục &amp; du học', [
  { id: 'q1', question: '"尽管有挑战，他还是去留学" nghĩa là? / What does it mean?', options: ['vì có thử thách nên anh ấy không đi|||because of challenges he did not go', 'mặc dù có thử thách, anh ấy vẫn đi du học|||although there are challenges, he still goes abroad', 'nếu có thử thách thì đi|||if there are challenges, go', 'chỉ khi hết thử thách mới đi|||only when challenges end will he go'], correctIndex: 1, explanation: '尽管…还是… = mặc dù … vẫn …: 尽管有挑战，他还是去留学.' },
  { id: 'q2', question: '"以便" (yǐbiàn) nghĩa là? / What does 以便 mean?', options: ['vì vậy nên khó|||so it is hard', 'để, để tiện (làm gì)|||so that / in order to', 'mặc dù|||although', 'ngoài ra|||besides'], correctIndex: 1, explanation: '以便 mở đầu vế sau nêu mục đích: 提前申请，以便早点儿准备.' },
  { id: 'q3', question: '"适应" (shìyìng) nghĩa là? / What does 适应 mean?', options: ['từ chối|||to refuse', 'thích nghi|||to adapt', 'nộp đơn|||to apply', 'thử thách|||to challenge'], correctIndex: 1, explanation: '适应 = thích nghi: 慢慢适应新环境 = dần thích nghi môi trường mới.' },
]);

const b4 = doc('chi401-4-1-society-generations', 'Lesson 4 — Society &amp; generations|||Bài 4 — Xã hội &amp; thế hệ',
  'Từ vựng: 社会, 年轻人, 父母, 代沟, 观念, 沟通, 理解, 尊重, 不管. Ngữ pháp: 不管…都 (bất kể…đều), 沟通/代沟.',
  [[
    `<span class="eyebrow">CHI401 · Lesson 4 · Society</span>
<h2>Society &amp; generations (社会和代沟)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>社会</td><td>shèhuì</td><td>society</td></tr>
<tr><td>年轻人</td><td>niánqīngrén</td><td>young people</td></tr>
<tr><td>父母</td><td>fùmǔ</td><td>parents</td></tr>
<tr><td>代沟</td><td>dàigōu</td><td>generation gap</td></tr>
<tr><td>观念</td><td>guānniàn</td><td>concept / idea</td></tr>
<tr><td>沟通</td><td>gōutōng</td><td>to communicate</td></tr>
<tr><td>理解</td><td>lǐjiě</td><td>to understand</td></tr>
<tr><td>尊重</td><td>zūnzhòng</td><td>to respect</td></tr>
<tr><td>不管</td><td>bùguǎn</td><td>no matter</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>不管 … 都 …</strong> = no matter … all …: <strong>不管</strong>年轻人还是父母，<strong>都</strong>需要多沟通 (no matter young people or parents, all need to communicate more).</li>
<li><strong>代沟 dàigōu</strong> = generation gap: 两代人之间常常有<strong>代沟</strong> (there is often a gap between two generations).</li>
<li><strong>沟通 gōutōng</strong> = to communicate: 多<strong>沟通</strong>才能减少误会 (only more communication can reduce misunderstanding).</li>
<li><strong>观念 guānniàn</strong> = idea / concept: 年轻人和父母的<strong>观念</strong>不太一样 (young people and parents have rather different ideas).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你和父母有代沟吗？ Nǐ hé fùmǔ yǒu dàigōu ma? (Do you have a generation gap with your parents?)
B: 有一点儿，我们的观念不太一样。 Yǒu yìdiǎnr, wǒmen de guānniàn bú tài yíyàng. (A little, our ideas are quite different.)
A: 那怎么办呢？ Nà zěnme bàn ne? (So what do you do?)
B: 不管谁对谁错，都应该多沟通、互相理解。 Bùguǎn shéi duì shéi cuò, dōu yīnggāi duō gōutōng, hùxiāng lǐjiě. (No matter who is right or wrong, both should talk more and understand each other.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 不管 works like 无论: it must be followed by a choice or a question word (谁 / 还是 / 多少), and the main clause takes 都 or 也. 不管 is a bit more colloquial than 无论.</div>`,
    `<span class="eyebrow">CHI401 · Bài 4 · Xã hội</span>
<h2>Xã hội &amp; thế hệ (社会和代沟)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>社会</td><td>shèhuì</td><td>xã hội</td></tr>
<tr><td>年轻人</td><td>niánqīngrén</td><td>người trẻ</td></tr>
<tr><td>父母</td><td>fùmǔ</td><td>cha mẹ</td></tr>
<tr><td>代沟</td><td>dàigōu</td><td>khoảng cách thế hệ</td></tr>
<tr><td>观念</td><td>guānniàn</td><td>quan niệm</td></tr>
<tr><td>沟通</td><td>gōutōng</td><td>giao tiếp, trao đổi</td></tr>
<tr><td>理解</td><td>lǐjiě</td><td>hiểu, thấu hiểu</td></tr>
<tr><td>尊重</td><td>zūnzhòng</td><td>tôn trọng</td></tr>
<tr><td>不管</td><td>bùguǎn</td><td>bất kể</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>不管 … 都 …</strong> = bất kể … đều …: <strong>不管</strong>年轻人还是父母，<strong>都</strong>需要多沟通 (bất kể người trẻ hay cha mẹ, đều cần trao đổi nhiều).</li>
<li><strong>代沟 dàigōu</strong> = khoảng cách thế hệ: 两代人之间常常有<strong>代沟</strong> (giữa hai thế hệ thường có khoảng cách).</li>
<li><strong>沟通 gōutōng</strong> = trao đổi: 多<strong>沟通</strong>才能减少误会 (trao đổi nhiều mới giảm được hiểu lầm).</li>
<li><strong>观念 guānniàn</strong> = quan niệm: 年轻人和父母的<strong>观念</strong>不太一样 (quan niệm của người trẻ và cha mẹ khá khác nhau).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你和父母有代沟吗？ Nǐ hé fùmǔ yǒu dàigōu ma? (Bạn và cha mẹ có khoảng cách thế hệ không?)
B: 有一点儿，我们的观念不太一样。 Yǒu yìdiǎnr, wǒmen de guānniàn bú tài yíyàng. (Có chút, quan niệm khác nhau.)
A: 那怎么办呢？ Nà zěnme bàn ne? (Vậy làm sao?)
B: 不管谁对谁错，都应该多沟通、互相理解。 Bùguǎn shéi duì shéi cuò, dōu yīnggāi duō gōutōng, hùxiāng lǐjiě. (Bất kể ai đúng ai sai, đều nên trao đổi nhiều và hiểu nhau.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 不管 dùng như 无论: phải đi với một lựa chọn hoặc từ để hỏi (谁 / 还是 / 多少), vế chính dùng 都 hoặc 也. 不管 khẩu ngữ hơn 无论 một chút.</div>`,
  ]]);

const b4q = quiz('chi401-quiz-4', 'Quiz 4 — Society &amp; generations|||Quiz 4 — Xã hội &amp; thế hệ', [
  { id: 'q1', question: 'Mẫu "不管…都…" nghĩa là? / What does 不管…都… mean?', options: ['chẳng thà … không bằng …|||rather than … better …', 'bất kể … đều …|||no matter … all …', 'vừa … vừa …|||both … and …', 'mặc dù … vẫn …|||although … still …'], correctIndex: 1, explanation: '不管…都… = bất kể … đều: 不管年轻人还是父母，都需要多沟通.' },
  { id: 'q2', question: '"代沟" (dàigōu) nghĩa là? / What does 代沟 mean?', options: ['bạn cùng lứa|||peers', 'khoảng cách thế hệ|||generation gap', 'gia đình|||family', 'quan niệm|||concept'], correctIndex: 1, explanation: '代沟 = khoảng cách thế hệ: 两代人之间有代沟.' },
  { id: 'q3', question: '"沟通" (gōutōng) nghĩa là? / What does 沟通 mean?', options: ['tranh cãi|||to argue', 'giao tiếp, trao đổi|||to communicate', 'im lặng|||to stay silent', 'tôn trọng|||to respect'], correctIndex: 1, explanation: '沟通 = giao tiếp, trao đổi: 多沟通才能减少误会.' },
]);

const b5 = doc('chi401-5-1-media-social', 'Lesson 5 — Media &amp; social networks|||Bài 5 — Truyền thông &amp; mạng xã hội',
  'Từ vựng: 媒体, 新闻, 社交网络, 信息, 影响, 传播, 真假, 判断, 从而. Ngữ pháp: 从而 (từ đó, do đó), 传播/判断.',
  [[
    `<span class="eyebrow">CHI401 · Lesson 5 · Media</span>
<h2>Media &amp; social networks (媒体和社交网络)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>媒体</td><td>méitǐ</td><td>media</td></tr>
<tr><td>新闻</td><td>xīnwén</td><td>news</td></tr>
<tr><td>社交网络</td><td>shèjiāo wǎngluò</td><td>social network</td></tr>
<tr><td>信息</td><td>xìnxī</td><td>information</td></tr>
<tr><td>影响</td><td>yǐngxiǎng</td><td>influence; to affect</td></tr>
<tr><td>传播</td><td>chuánbō</td><td>to spread / disseminate</td></tr>
<tr><td>真假</td><td>zhēnjiǎ</td><td>true or false</td></tr>
<tr><td>判断</td><td>pànduàn</td><td>to judge / determine</td></tr>
<tr><td>从而</td><td>cóng ér</td><td>thus / thereby</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>从而 cóng ér</strong> = thus / thereby (a result of the first clause): 社交网络让信息传播得很快，<strong>从而</strong>影响了很多人 (social networks make information spread fast, and thereby affect many people).</li>
<li><strong>传播 chuánbō</strong> = to spread: 假新闻<strong>传播</strong>得很快 (fake news spreads very fast).</li>
<li><strong>判断 pànduàn</strong> = to judge: 我们要学会<strong>判断</strong>信息的<strong>真假</strong> (we must learn to judge whether information is true or false).</li>
<li><strong>影响 yǐngxiǎng</strong> = to affect: 媒体对人们的观念有很大<strong>影响</strong> (media has a big influence on people ideas).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 现在的新闻真多，什么都有。 Xiànzài de xīnwén zhēn duō, shénme dōu yǒu. (There is so much news now, everything is there.)
B: 是啊，可是不是每条都真。 Shì a, kěshì bú shì měi tiáo dōu zhēn. (Yes, but not every piece is true.)
A: 社交网络传播得太快了。 Shèjiāo wǎngluò chuánbō de tài kuài le. (Social networks spread things too fast.)
B: 所以我们要学会判断真假，从而不被假信息影响。 Suǒyǐ wǒmen yào xuéhuì pànduàn zhēnjiǎ, cóng ér bú bèi jiǎ xìnxī yǐngxiǎng. (So we must judge true from false, and thereby not be affected by fake information.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 从而 is written and formal; it links a cause in the first clause to a natural result in the second, and the subject is usually the same. It is close to 因此 but stresses that the result follows on from the action just mentioned.</div>`,
    `<span class="eyebrow">CHI401 · Bài 5 · Truyền thông</span>
<h2>Truyền thông &amp; mạng xã hội (媒体和社交网络)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>媒体</td><td>méitǐ</td><td>truyền thông</td></tr>
<tr><td>新闻</td><td>xīnwén</td><td>tin tức</td></tr>
<tr><td>社交网络</td><td>shèjiāo wǎngluò</td><td>mạng xã hội</td></tr>
<tr><td>信息</td><td>xìnxī</td><td>thông tin</td></tr>
<tr><td>影响</td><td>yǐngxiǎng</td><td>ảnh hưởng</td></tr>
<tr><td>传播</td><td>chuánbō</td><td>lan truyền, truyền bá</td></tr>
<tr><td>真假</td><td>zhēnjiǎ</td><td>thật giả</td></tr>
<tr><td>判断</td><td>pànduàn</td><td>phán đoán, đánh giá</td></tr>
<tr><td>从而</td><td>cóng ér</td><td>từ đó, do đó</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>从而 cóng ér</strong> = từ đó, do đó (kết quả của vế trước): 社交网络让信息传播得很快，<strong>从而</strong>影响了很多人 (mạng xã hội khiến thông tin lan nhanh, từ đó ảnh hưởng nhiều người).</li>
<li><strong>传播 chuánbō</strong> = lan truyền: 假新闻<strong>传播</strong>得很快 (tin giả lan rất nhanh).</li>
<li><strong>判断 pànduàn</strong> = phán đoán, đánh giá: 我们要学会<strong>判断</strong>信息的<strong>真假</strong> (ta phải biết đánh giá thông tin thật giả).</li>
<li><strong>影响 yǐngxiǎng</strong> = ảnh hưởng: 媒体对人们的观念有很大<strong>影响</strong> (truyền thông ảnh hưởng lớn tới quan niệm mọi người).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 现在的新闻真多，什么都有。 Xiànzài de xīnwén zhēn duō, shénme dōu yǒu. (Tin tức giờ nhiều thật, cái gì cũng có.)
B: 是啊，可是不是每条都真。 Shì a, kěshì bú shì měi tiáo dōu zhēn. (Ừ, nhưng không phải tin nào cũng thật.)
A: 社交网络传播得太快了。 Shèjiāo wǎngluò chuánbō de tài kuài le. (Mạng xã hội lan tin quá nhanh.)
B: 所以我们要学会判断真假，从而不被假信息影响。 Suǒyǐ wǒmen yào xuéhuì pànduàn zhēnjiǎ, cóng ér bú bèi jiǎ xìnxī yǐngxiǎng. (Nên ta phải biết đánh giá thật giả, từ đó không bị thông tin giả ảnh hưởng.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 从而 mang tính văn viết, trang trọng; nối nguyên nhân ở vế trước với kết quả tự nhiên ở vế sau, chủ ngữ thường giống nhau. Nó gần với 因此 nhưng nhấn rằng kết quả tiếp nối ngay hành động vừa nêu.</div>`,
  ]]);

const b5q = quiz('chi401-quiz-5', 'Quiz 5 — Media &amp; social networks|||Quiz 5 — Truyền thông &amp; mạng xã hội', [
  { id: 'q1', question: '"从而" (cóng ér) nghĩa là? / What does 从而 mean?', options: ['trước khi|||before', 'từ đó, do đó|||thus / thereby', 'tuy nhiên|||however', 'chẳng thà|||rather than'], correctIndex: 1, explanation: '从而 nối nguyên nhân với kết quả: 信息传播得快，从而影响很多人.' },
  { id: 'q2', question: '"判断信息的真假" nghĩa là? / What does it mean?', options: ['lan truyền thông tin|||to spread information', 'đánh giá thông tin thật hay giả|||to judge whether information is true or false', 'giấu thông tin|||to hide information', 'quên thông tin|||to forget information'], correctIndex: 1, explanation: '判断 (đánh giá) + 真假 (thật giả) = đánh giá thông tin thật hay giả.' },
  { id: 'q3', question: '"传播" (chuánbō) nghĩa là? / What does 传播 mean?', options: ['dừng lại|||to stop', 'lan truyền, truyền bá|||to spread', 'phán đoán|||to judge', 'sửa chữa|||to fix'], correctIndex: 1, explanation: '传播 = lan truyền: 假新闻传播得很快.' },
]);

const b6 = doc('chi401-6-1-arts-culture', 'Lesson 6 — Arts &amp; culture|||Bài 6 — Văn hóa &amp; nghệ thuật',
  'Từ vựng: 艺术, 表演, 欣赏, 传统, 现代, 作品, 京剧, 结合, 既. Ngữ pháp: 既…又 (vừa…vừa), 欣赏/结合.',
  [[
    `<span class="eyebrow">CHI401 · Lesson 6 · Arts</span>
<h2>Arts &amp; culture (艺术和文化)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>艺术</td><td>yìshù</td><td>art</td></tr>
<tr><td>表演</td><td>biǎoyǎn</td><td>performance; to perform</td></tr>
<tr><td>欣赏</td><td>xīnshǎng</td><td>to appreciate / enjoy</td></tr>
<tr><td>传统</td><td>chuántǒng</td><td>tradition; traditional</td></tr>
<tr><td>现代</td><td>xiàndài</td><td>modern</td></tr>
<tr><td>作品</td><td>zuòpǐn</td><td>work (of art)</td></tr>
<tr><td>京剧</td><td>Jīngjù</td><td>Peking opera</td></tr>
<tr><td>结合</td><td>jiéhé</td><td>to combine</td></tr>
<tr><td>既</td><td>jì</td><td>both (in 既…又)</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>既 … 又 …</strong> = both … and …: 这个表演<strong>既</strong>传统<strong>又</strong>现代 (this performance is both traditional and modern).</li>
<li><strong>欣赏 xīnshǎng</strong> = to appreciate: 我很<strong>欣赏</strong>这位艺术家的<strong>作品</strong> (I really appreciate this artist works).</li>
<li><strong>结合 jiéhé</strong> = to combine: 这幅画把传统和现代<strong>结合</strong>起来 (this painting combines the traditional and the modern).</li>
<li><strong>表演 biǎoyǎn</strong> = performance: <strong>京剧</strong>是一种传统的<strong>表演</strong>艺术 (Peking opera is a traditional performing art).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你看过京剧吗？ Nǐ kàn guò Jīngjù ma? (Have you seen Peking opera?)
B: 看过，那是一种很美的传统艺术。 Kàn guò, nà shì yì zhǒng hěn měi de chuántǒng yìshù. (Yes, it is a beautiful traditional art.)
A: 这次的表演有点儿不一样。 Zhè cì de biǎoyǎn yǒudiǎnr bù yíyàng. (This performance is a bit different.)
B: 对，它既传统又现代，把两者结合起来了。 Duì, tā jì chuántǒng yòu xiàndài, bǎ liǎng zhě jiéhé qǐlái le. (Right, it is both traditional and modern, combining the two.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 欣赏 means to appreciate or enjoy something with taste (art, scenery, a person quality), while 喜欢 is a plainer to like. 结合 often takes 起来 to stress that separate things are brought together.</div>`,
    `<span class="eyebrow">CHI401 · Bài 6 · Nghệ thuật</span>
<h2>Văn hóa &amp; nghệ thuật (艺术和文化)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>艺术</td><td>yìshù</td><td>nghệ thuật</td></tr>
<tr><td>表演</td><td>biǎoyǎn</td><td>biểu diễn</td></tr>
<tr><td>欣赏</td><td>xīnshǎng</td><td>thưởng thức</td></tr>
<tr><td>传统</td><td>chuántǒng</td><td>truyền thống</td></tr>
<tr><td>现代</td><td>xiàndài</td><td>hiện đại</td></tr>
<tr><td>作品</td><td>zuòpǐn</td><td>tác phẩm</td></tr>
<tr><td>京剧</td><td>Jīngjù</td><td>Kinh kịch</td></tr>
<tr><td>结合</td><td>jiéhé</td><td>kết hợp</td></tr>
<tr><td>既</td><td>jì</td><td>vừa (trong 既…又)</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>既 … 又 …</strong> = vừa … vừa …: 这个表演<strong>既</strong>传统<strong>又</strong>现代 (buổi biểu diễn này vừa truyền thống vừa hiện đại).</li>
<li><strong>欣赏 xīnshǎng</strong> = thưởng thức: 我很<strong>欣赏</strong>这位艺术家的<strong>作品</strong> (tôi rất thưởng thức tác phẩm của nghệ sĩ này).</li>
<li><strong>结合 jiéhé</strong> = kết hợp: 这幅画把传统和现代<strong>结合</strong>起来 (bức tranh này kết hợp truyền thống và hiện đại).</li>
<li><strong>表演 biǎoyǎn</strong> = biểu diễn: <strong>京剧</strong>是一种传统的<strong>表演</strong>艺术 (Kinh kịch là một loại nghệ thuật biểu diễn truyền thống).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你看过京剧吗？ Nǐ kàn guò Jīngjù ma? (Bạn xem Kinh kịch chưa?)
B: 看过，那是一种很美的传统艺术。 Kàn guò, nà shì yì zhǒng hěn měi de chuántǒng yìshù. (Xem rồi, đó là nghệ thuật truyền thống rất đẹp.)
A: 这次的表演有点儿不一样。 Zhè cì de biǎoyǎn yǒudiǎnr bù yíyàng. (Buổi biểu diễn lần này hơi khác.)
B: 对，它既传统又现代，把两者结合起来了。 Duì, tā jì chuántǒng yòu xiàndài, bǎ liǎng zhě jiéhé qǐlái le. (Đúng, nó vừa truyền thống vừa hiện đại, kết hợp cả hai.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 欣赏 là thưởng thức, cảm thụ có gu (nghệ thuật, cảnh đẹp, phẩm chất người), còn 喜欢 chỉ đơn giản là thích. 结合 hay đi với 起来 để nhấn việc gộp những thứ riêng lẻ lại.</div>`,
  ]]);

const b6q = quiz('chi401-quiz-6', 'Quiz 6 — Arts &amp; culture|||Quiz 6 — Văn hóa &amp; nghệ thuật', [
  { id: 'q1', question: '"这个表演既传统又现代" nghĩa là? / What does it mean?', options: ['buổi biểu diễn không truyền thống cũng không hiện đại|||neither traditional nor modern', 'buổi biểu diễn vừa truyền thống vừa hiện đại|||both traditional and modern', 'buổi biểu diễn chỉ truyền thống|||only traditional', 'buổi biểu diễn thay đổi liên tục|||constantly changing'], correctIndex: 1, explanation: '既…又… = vừa … vừa …: 既传统又现代.' },
  { id: 'q2', question: '"欣赏" (xīnshǎng) nghĩa là? / What does 欣赏 mean?', options: ['phê bình|||to criticize', 'thưởng thức, cảm thụ|||to appreciate / enjoy', 'biểu diễn|||to perform', 'sao chép|||to copy'], correctIndex: 1, explanation: '欣赏 = thưởng thức: 欣赏艺术家的作品 = thưởng thức tác phẩm của nghệ sĩ.' },
  { id: 'q3', question: '"结合" (jiéhé) nghĩa là? / What does 结合 mean?', options: ['tách rời|||to separate', 'kết hợp|||to combine', 'so sánh|||to compare', 'thay thế|||to replace'], correctIndex: 1, explanation: '结合 = kết hợp: 把传统和现代结合起来.' },
]);

const b7 = doc('chi401-7-1-health-psychology', 'Lesson 7 — Health &amp; psychology|||Bài 7 — Sức khỏe &amp; tâm lý',
  'Từ vựng: 心理, 压力, 情绪, 平衡, 幸福, 放松, 宁可, 万一, 保持. Ngữ pháp: 宁可…也 (thà…chứ), 万一 (nhỡ, lỡ).',
  [[
    `<span class="eyebrow">CHI401 · Lesson 7 · Health</span>
<h2>Health &amp; psychology (心理和健康)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>心理</td><td>xīnlǐ</td><td>psychology / mental state</td></tr>
<tr><td>压力</td><td>yālì</td><td>pressure / stress</td></tr>
<tr><td>情绪</td><td>qíngxù</td><td>mood / emotion</td></tr>
<tr><td>平衡</td><td>pínghéng</td><td>balance; to balance</td></tr>
<tr><td>幸福</td><td>xìngfú</td><td>happiness; happy</td></tr>
<tr><td>放松</td><td>fàngsōng</td><td>to relax</td></tr>
<tr><td>宁可</td><td>nìngkě</td><td>would rather (in 宁可…也)</td></tr>
<tr><td>万一</td><td>wànyī</td><td>in case / if by chance</td></tr>
<tr><td>保持</td><td>bǎochí</td><td>to keep / maintain</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>宁可 … 也 …</strong> = would rather … in order to …: 我<strong>宁可</strong>少赚一点儿，<strong>也</strong>要保持身体健康 (I would rather earn a little less in order to keep healthy).</li>
<li><strong>万一 wànyī</strong> = in case / if by chance: <strong>万一</strong>压力太大，就找朋友聊聊 (in case the pressure is too great, talk to a friend).</li>
<li><strong>平衡 pínghéng</strong> = balance: 要注意工作和生活的<strong>平衡</strong> (pay attention to work-life balance).</li>
<li><strong>情绪 qíngxù</strong> = mood: 运动可以帮助我们调节<strong>情绪</strong> (exercise helps us regulate our mood).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你最近工作太忙了，要注意身体。 Nǐ zuìjìn gōngzuò tài máng le, yào zhùyì shēntǐ. (You have been too busy lately, mind your health.)
B: 我知道，我宁可少赚一点儿，也要保持健康。 Wǒ zhīdào, wǒ nìngkě shǎo zhuàn yìdiǎnr, yě yào bǎochí jiànkāng. (I know, I would rather earn less to stay healthy.)
A: 压力大的时候怎么办？ Yālì dà de shíhou zěnme bàn? (What do you do when stress is high?)
B: 万一压力太大，我就去运动，放松一下情绪。 Wànyī yālì tài dà, wǒ jiù qù yùndòng, fàngsōng yíxià qíngxù. (If the pressure gets too big, I go exercise and relax my mood.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 宁可 … 也 … chooses a less pleasant option on purpose to protect something more important; it often pairs with 也要 (in order to) or 也不 (rather than). 万一 introduces an unlikely but possible bad case, close to if it happens that.</div>`,
    `<span class="eyebrow">CHI401 · Bài 7 · Sức khỏe</span>
<h2>Sức khỏe &amp; tâm lý (心理和健康)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>心理</td><td>xīnlǐ</td><td>tâm lý</td></tr>
<tr><td>压力</td><td>yālì</td><td>áp lực</td></tr>
<tr><td>情绪</td><td>qíngxù</td><td>cảm xúc, tâm trạng</td></tr>
<tr><td>平衡</td><td>pínghéng</td><td>cân bằng</td></tr>
<tr><td>幸福</td><td>xìngfú</td><td>hạnh phúc</td></tr>
<tr><td>放松</td><td>fàngsōng</td><td>thư giãn</td></tr>
<tr><td>宁可</td><td>nìngkě</td><td>thà (trong 宁可…也)</td></tr>
<tr><td>万一</td><td>wànyī</td><td>nhỡ, lỡ</td></tr>
<tr><td>保持</td><td>bǎochí</td><td>giữ, duy trì</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>宁可 … 也 …</strong> = thà … chứ (cũng) …: 我<strong>宁可</strong>少赚一点儿，<strong>也</strong>要保持身体健康 (thà kiếm ít đi một chút, cũng phải giữ sức khỏe).</li>
<li><strong>万一 wànyī</strong> = nhỡ, lỡ: <strong>万一</strong>压力太大，就找朋友聊聊 (lỡ áp lực quá lớn thì tìm bạn tâm sự).</li>
<li><strong>平衡 pínghéng</strong> = cân bằng: 要注意工作和生活的<strong>平衡</strong> (phải chú ý cân bằng công việc và cuộc sống).</li>
<li><strong>情绪 qíngxù</strong> = cảm xúc: 运动可以帮助我们调节<strong>情绪</strong> (vận động giúp ta điều chỉnh cảm xúc).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你最近工作太忙了，要注意身体。 Nǐ zuìjìn gōngzuò tài máng le, yào zhùyì shēntǐ. (Dạo này bạn làm quá bận, phải giữ sức khỏe.)
B: 我知道，我宁可少赚一点儿，也要保持健康。 Wǒ zhīdào, wǒ nìngkě shǎo zhuàn yìdiǎnr, yě yào bǎochí jiànkāng. (Tôi biết, thà kiếm ít hơn, cũng phải giữ sức khỏe.)
A: 压力大的时候怎么办？ Yālì dà de shíhou zěnme bàn? (Khi áp lực lớn thì làm sao?)
B: 万一压力太大，我就去运动，放松一下情绪。 Wànyī yālì tài dà, wǒ jiù qù yùndòng, fàngsōng yíxià qíngxù. (Lỡ áp lực quá lớn, tôi đi vận động, thư giãn tâm trạng.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 宁可 … 也 … cố ý chọn phương án kém dễ chịu hơn để bảo vệ điều quan trọng hơn; thường đi với 也要 (để mà) hoặc 也不 (chứ không). 万一 nêu một tình huống xấu ít khả năng nhưng có thể xảy ra, gần với nhỡ như xảy ra.</div>`,
  ]]);

const b7q = quiz('chi401-quiz-7', 'Quiz 7 — Health &amp; psychology|||Quiz 7 — Sức khỏe &amp; tâm lý', [
  { id: 'q1', question: '"我宁可少赚一点儿，也要保持健康" nghĩa là? / What does it mean?', options: ['tôi muốn kiếm nhiều tiền hơn|||I want to earn more money', 'thà kiếm ít hơn, cũng phải giữ sức khỏe|||I would rather earn less to stay healthy', 'sức khỏe không quan trọng|||health is not important', 'tôi không muốn làm việc|||I do not want to work'], correctIndex: 1, explanation: '宁可…也… cố ý chọn vế kém hơn để giữ điều quan trọng hơn: 宁可少赚，也要保持健康.' },
  { id: 'q2', question: '"万一" (wànyī) nghĩa là? / What does 万一 mean?', options: ['chắc chắn|||definitely', 'nhỡ, lỡ (như xảy ra)|||in case / if by chance', 'ngay lập tức|||immediately', 'mỗi ngày|||every day'], correctIndex: 1, explanation: '万一 nêu tình huống xấu có thể xảy ra: 万一压力太大，就找朋友聊聊.' },
  { id: 'q3', question: '"保持平衡" nghĩa là? / What does 保持平衡 mean?', options: ['mất cân bằng|||to lose balance', 'giữ cân bằng|||to keep balance', 'tăng áp lực|||to raise pressure', 'thay đổi tâm trạng|||to change mood'], correctIndex: 1, explanation: '保持 (giữ) + 平衡 (cân bằng) = giữ cân bằng: 工作和生活的平衡.' },
]);

const b8 = doc('chi401-8-1-globalization-future', 'Lesson 8 — Globalization &amp; the future|||Bài 8 — Toàn cầu hóa &amp; tương lai',
  'Từ vựng: 全球化, 发展, 机会, 变化, 趋势, 科技, 竞争, 之所以, 随着. Ngữ pháp: 之所以…是因为 (sở dĩ…là vì), 随着 (cùng với).',
  [[
    `<span class="eyebrow">CHI401 · Lesson 8 · Globalization</span>
<h2>Globalization &amp; the future (全球化和未来)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>全球化</td><td>quánqiúhuà</td><td>globalization</td></tr>
<tr><td>发展</td><td>fāzhǎn</td><td>to develop; development</td></tr>
<tr><td>机会</td><td>jīhuì</td><td>opportunity</td></tr>
<tr><td>变化</td><td>biànhuà</td><td>change</td></tr>
<tr><td>趋势</td><td>qūshì</td><td>trend</td></tr>
<tr><td>科技</td><td>kējì</td><td>science &amp; technology</td></tr>
<tr><td>竞争</td><td>jìngzhēng</td><td>competition; to compete</td></tr>
<tr><td>之所以</td><td>zhīsuǒyǐ</td><td>the reason why (in 之所以…是因为)</td></tr>
<tr><td>随着</td><td>suízhe</td><td>along with / as</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>之所以 … 是因为 …</strong> = the reason … is that …: 全球化<strong>之所以</strong>重要，<strong>是因为</strong>它带来了很多机会 (the reason globalization matters is that it brings many opportunities).</li>
<li><strong>随着 suízhe</strong> = along with / as: <strong>随着</strong>科技的发展，世界变化得越来越快 (as technology develops, the world changes faster and faster).</li>
<li><strong>趋势 qūshì</strong> = trend: 全球化是不可避免的<strong>趋势</strong> (globalization is an unavoidable trend).</li>
<li><strong>竞争 jìngzhēng</strong> = competition: 全球化也带来了更大的<strong>竞争</strong> (globalization also brings greater competition).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你觉得全球化是好事还是坏事？ Nǐ juéde quánqiúhuà shì hǎoshì háishì huàishì? (Do you think globalization is good or bad?)
B: 之所以说它好，是因为它带来了很多机会。 Zhīsuǒyǐ shuō tā hǎo, shì yīnwèi tā dài lái le hěn duō jīhuì. (The reason it is good is that it brings many opportunities.)
A: 可是竞争也更大了。 Kěshì jìngzhēng yě gèng dà le. (But competition is bigger too.)
B: 是啊，随着科技发展，我们要不断学习，抓住机会。 Shì a, suízhe kējì fāzhǎn, wǒmen yào búduàn xuéxí, zhuāzhù jīhuì. (Yes, as technology develops, we must keep learning and seize opportunities.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 之所以 … 是因为 … states a fact first and explains its cause after — useful for essays and discussion. The idiom 机不可失 (jī bù kě shī, the chance must not be missed) fits a lesson about seizing opportunity.</div>`,
    `<span class="eyebrow">CHI401 · Bài 8 · Toàn cầu hóa</span>
<h2>Toàn cầu hóa &amp; tương lai (全球化和未来)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>全球化</td><td>quánqiúhuà</td><td>toàn cầu hóa</td></tr>
<tr><td>发展</td><td>fāzhǎn</td><td>phát triển</td></tr>
<tr><td>机会</td><td>jīhuì</td><td>cơ hội</td></tr>
<tr><td>变化</td><td>biànhuà</td><td>biến đổi, thay đổi</td></tr>
<tr><td>趋势</td><td>qūshì</td><td>xu thế, xu hướng</td></tr>
<tr><td>科技</td><td>kējì</td><td>khoa học công nghệ</td></tr>
<tr><td>竞争</td><td>jìngzhēng</td><td>cạnh tranh</td></tr>
<tr><td>之所以</td><td>zhīsuǒyǐ</td><td>sở dĩ (trong 之所以…是因为)</td></tr>
<tr><td>随着</td><td>suízhe</td><td>cùng với, theo</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>之所以 … 是因为 …</strong> = sở dĩ … là vì …: 全球化<strong>之所以</strong>重要，<strong>是因为</strong>它带来了很多机会 (sở dĩ toàn cầu hóa quan trọng là vì nó mang lại nhiều cơ hội).</li>
<li><strong>随着 suízhe</strong> = cùng với, theo: <strong>随着</strong>科技的发展，世界变化得越来越快 (cùng với sự phát triển KHCN, thế giới thay đổi ngày càng nhanh).</li>
<li><strong>趋势 qūshì</strong> = xu thế: 全球化是不可避免的<strong>趋势</strong> (toàn cầu hóa là xu thế không thể tránh khỏi).</li>
<li><strong>竞争 jìngzhēng</strong> = cạnh tranh: 全球化也带来了更大的<strong>竞争</strong> (toàn cầu hóa cũng mang lại cạnh tranh lớn hơn).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你觉得全球化是好事还是坏事？ Nǐ juéde quánqiúhuà shì hǎoshì háishì huàishì? (Bạn thấy toàn cầu hóa là tốt hay xấu?)
B: 之所以说它好，是因为它带来了很多机会。 Zhīsuǒyǐ shuō tā hǎo, shì yīnwèi tā dài lái le hěn duō jīhuì. (Sở dĩ nói nó tốt là vì nó mang lại nhiều cơ hội.)
A: 可是竞争也更大了。 Kěshì jìngzhēng yě gèng dà le. (Nhưng cạnh tranh cũng lớn hơn.)
B: 是啊，随着科技发展，我们要不断学习，抓住机会。 Shì a, suízhe kējì fāzhǎn, wǒmen yào búduàn xuéxí, zhuāzhù jīhuì. (Ừ, cùng với KHCN phát triển, ta phải học không ngừng, nắm lấy cơ hội.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 之所以 … 是因为 … nêu sự thật trước rồi giải thích nguyên nhân sau — rất hợp cho bài luận và thảo luận. Thành ngữ 机不可失 (jī bù kě shī, cơ hội không thể bỏ lỡ) hợp với một bài nói về nắm bắt cơ hội.</div>`,
  ]]);

const b8q = quiz('chi401-quiz-8', 'Quiz 8 — Globalization &amp; the future|||Quiz 8 — Toàn cầu hóa &amp; tương lai', [
  { id: 'q1', question: '"全球化之所以重要，是因为它带来了机会" nghĩa là? / What does it mean?', options: ['toàn cầu hóa không quan trọng|||globalization is not important', 'sở dĩ toàn cầu hóa quan trọng là vì nó mang lại cơ hội|||the reason globalization matters is that it brings opportunities', 'nếu quan trọng thì có cơ hội|||if important, there are chances', 'cơ hội làm toàn cầu hóa quan trọng hơn|||chances make it more important'], correctIndex: 1, explanation: '之所以…是因为… nêu sự thật rồi nêu nguyên nhân: 之所以重要，是因为带来了机会.' },
  { id: 'q2', question: '"随着科技的发展" nghĩa là? / What does it mean?', options: ['trước khi công nghệ phát triển|||before technology develops', 'cùng với sự phát triển của khoa học công nghệ|||as science &amp; technology develops', 'không cần công nghệ|||without technology', 'công nghệ ngừng phát triển|||technology stops developing'], correctIndex: 1, explanation: '随着 = cùng với, theo: 随着科技的发展，世界变化得越来越快.' },
  { id: 'q3', question: '"趋势" (qūshì) nghĩa là? / What does 趋势 mean?', options: ['nguyên nhân|||cause', 'xu thế, xu hướng|||trend', 'cơ hội|||opportunity', 'cạnh tranh|||competition'], correctIndex: 1, explanation: '趋势 = xu thế: 全球化是不可避免的趋势.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CHI401',
    slug: 'chi401-integrated-chinese-6',
    title: 'Integrated Chinese 6',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHI401.webp',
    shortDescription: 'Integrated Chinese 6 (continues CHI331, HSK4) — economy & online shopping, jobs & interviews, study abroad, society & generations, media, arts & culture, health & psychology, globalization & the future. Bilingual vocab, grammar & quizzes.|||Tiếng Trung tổng hợp 6 (nối tiếp CHI331, HSK4) — kinh tế & mua online, việc làm & phỏng vấn, du học, xã hội & thế hệ, truyền thông, văn hóa & nghệ thuật, sức khỏe & tâm lý, toàn cầu hóa & tương lai. Song ngữ từ vựng, ngữ pháp & quiz.',
    description: 'Môn <strong>CHI401 — Integrated Chinese 6 (Tiếng Trung tổng hợp 6)</strong> <strong>nối tiếp CHI331</strong> trên track <strong>Integrated Chinese</strong> (Liu et al., Cheng &amp; Tsui), đưa bạn lên mức tương đương HSK4. Học tiếp qua các chủ đề nâng cao: <strong>kinh tế &amp; mua sắm online</strong> → <strong>việc làm &amp; phỏng vấn</strong> → <strong>giáo dục &amp; du học</strong> → <strong>xã hội &amp; thế hệ</strong> → <strong>truyền thông &amp; mạng xã hội</strong> → <strong>văn hóa &amp; nghệ thuật</strong> → <strong>sức khỏe &amp; tâm lý</strong> → <strong>toàn cầu hóa &amp; tương lai</strong>. Song ngữ Trung–Việt, mỗi bài có bảng từ vựng (汉字 | pinyin | nghĩa), điểm ngữ pháp kèm ví dụ, hội thoại ngắn, ghi chú và quiz.',
    whatYouLearn: 'Kinh tế &amp; mua sắm online (经济, 网购, 消费, 支付, 优惠, 既…又); việc làm &amp; phỏng vấn (求职, 简历, 面试, 薪水, 与其…不如, 之所以…是因为); giáo dục &amp; du học (留学, 申请, 奖学金, 适应, 尽管…还是, 以便); xã hội &amp; thế hệ (社会, 年轻人, 代沟, 沟通, 观念, 不管…都); truyền thông &amp; mạng xã hội (媒体, 新闻, 社交网络, 传播, 判断, 从而); văn hóa &amp; nghệ thuật (艺术, 表演, 欣赏, 传统, 现代, 结合); sức khỏe &amp; tâm lý (心理, 压力, 情绪, 平衡, 幸福, 宁可…也, 万一); toàn cầu hóa &amp; tương lai (全球化, 发展, 机会, 趋势, 竞争, 随着).',
    requirements: 'Cần hoàn thành CHI331 hoặc nắm vững pinyin, 4 thanh điệu, các liên từ 无论…都, 只要…就, 即使…也, bổ ngữ xu hướng phức hợp 起来 / 下去, cùng từ vựng về văn hóa, học tập, môi trường, công nghệ và sức khỏe. Nên cài Pleco hoặc dùng từ điển hanzii.net để tra chữ &amp; nghe phát âm; luyện viết chữ Hán theo thứ tự nét.',
  },
  sections: [
    { title: '📚 Tài liệu &amp; lộ trình|||📚 Course materials', description: 'Giáo trình Integrated Chinese (Level 2 Part 2), workbook, app, từ điển, YouTube, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CHI331, track Integrated Chinese, mục tiêu HSK4, cách học.', lessons: [intro] },
    { title: 'Bài 1 — Kinh tế &amp; mua sắm online|||Lesson 1 — Economy &amp; online shopping', description: '经济, 网购, 消费, 支付, 优惠, 打折, 既…又.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Việc làm &amp; phỏng vấn|||Lesson 2 — Jobs &amp; interviews', description: '求职, 简历, 面试, 能力, 薪水, 与其…不如, 之所以…是因为.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Giáo dục &amp; du học|||Lesson 3 — Education &amp; study abroad', description: '留学, 申请, 奖学金, 适应, 挑战, 尽管…还是, 以便.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Xã hội &amp; thế hệ|||Lesson 4 — Society &amp; generations', description: '社会, 年轻人, 父母, 代沟, 观念, 沟通, 不管…都.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Truyền thông &amp; mạng xã hội|||Lesson 5 — Media &amp; social networks', description: '媒体, 新闻, 社交网络, 信息, 传播, 判断, 从而.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Văn hóa &amp; nghệ thuật|||Lesson 6 — Arts &amp; culture', description: '艺术, 表演, 欣赏, 传统, 现代, 结合, 既…又.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Sức khỏe &amp; tâm lý|||Lesson 7 — Health &amp; psychology', description: '心理, 压力, 情绪, 平衡, 幸福, 宁可…也, 万一.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Toàn cầu hóa &amp; tương lai|||Lesson 8 — Globalization &amp; the future', description: '全球化, 发展, 机会, 变化, 趋势, 竞争, 之所以…是因为, 随着.', lessons: [b8, b8q] },
  ],
};
