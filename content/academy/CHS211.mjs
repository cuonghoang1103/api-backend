/**
 * CHS211 — Chinese Speaking 3A (Tiếng Trung giao tiếp/nói 3A). Khối Ngôn ngữ
 * Trung FPTU. Đây là MÔN NGÔN NGỮ, track LUYỆN NÓI chuyên sâu, SONG SONG &
 * NỐI TIẾP CHS201: luyện các chủ đề khẩu ngữ HSK3 theo hướng thực hành sâu —
 * thảo luận sở thích & giải trí, kể chuyện & thuật lại, tranh luận & thuyết
 * phục, xử lý tình huống dịch vụ (ngân hàng/bưu điện), điện thoại nâng cao,
 * miêu tả người & vật, trình bày ý kiến về xã hội, phỏng vấn & thuyết trình
 * ngắn. Giáo trình chuẩn: 汉语口语速成 提高篇 (Short-term Spoken Chinese,
 * Pre-Intermediate), HSK Standard Course 3. Lộ trình 4 bước: Nghe → Bắt chước
 * → Luyện cặp → Ứng dụng. Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG
 * backtick lồng/${; trong HTML content "&" → "&amp;". shortDescription "&".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & mẫu câu giao tiếp của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chs211-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình luyện nói',
  'Giáo trình khẩu ngữ chuẩn (汉语口语速成 提高篇, HSK Standard Course 3), app luyện nói (HelloChinese/Pleco), lộ trình 4 bước: Nghe → Bắt chước → Luyện cặp → Ứng dụng.',
  [[
    `<span class="eyebrow">CHS211 · Materials</span>
<h2>Deepen your spoken Chinese — materials &amp; roadmap</h2>
<p class="lead">Chinese Speaking 3A runs <strong>alongside CHS201</strong> and takes the same <strong>HSK3</strong> topics into <strong>deeper, real practice</strong>: longer role-plays, telling a story, persuading someone, handling a bank or post office, taking phone messages, describing people, giving an opinion on a social topic, and a short interview talk.</p>
<h3>📘 Standard textbooks (spoken track)</h3>
<ul>
<li><strong>汉语口语速成 提高篇 (Short-term Spoken Chinese, Pre-Intermediate)</strong> (Beijing Language and Culture University Press): the mainstream spoken-Chinese coursebook, level 3.</li>
<li><strong>HSK Standard Course 3</strong> — vocabulary &amp; grammar that back up each speaking topic.</li>
</ul>
<h3>📱 Apps for speaking &amp; sound</h3>
<ul>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — course with speech-recognition practice.</li>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — dictionary with native audio for every word (shadow it).</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — Chinese-Vietnamese dictionary with audio &amp; pinyin.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — real conversations with subtitles.</li>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — structured pronunciation &amp; HSK lessons.</li>
</ul>
<div class="callout"><span class="badge">4-step speaking path</span>
<ol>
<li><strong>Listen (Nghe)</strong> — hear the phrase and the tones before you read the pinyin.</li>
<li><strong>Imitate (Bắt chước)</strong> — shadow the audio out loud; copy the rhythm, not just the words.</li>
<li><strong>Pair drill (Luyện cặp)</strong> — practise each dialogue with a partner, swapping roles A and B.</li>
<li><strong>Apply (Ứng dụng)</strong> — use the phrase in a real situation the same day.</li>
</ol></div>`,
    `<span class="eyebrow">CHS211 · Tài liệu</span>
<h2>Luyện nói tiếng Trung sâu hơn — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung giao tiếp 3A chạy <strong>song song với CHS201</strong> và đưa cùng những chủ đề <strong>HSK3</strong> vào <strong>thực hành sâu, sát đời thật</strong>: hội thoại đóng vai dài hơn, kể chuyện, thuyết phục, xử lý ở ngân hàng hay bưu điện, nhắn qua điện thoại, tả người, nêu ý kiến về một chủ đề xã hội, và một bài thuyết trình ngắn khi phỏng vấn.</p>
<h3>📘 Giáo trình chuẩn (hướng khẩu ngữ)</h3>
<ul>
<li><strong>汉语口语速成 提高篇 (Short-term Spoken Chinese, Pre-Intermediate)</strong> (NXB Đại học Ngôn ngữ Bắc Kinh): giáo trình khẩu ngữ phổ biến nhất, cấp 3.</li>
<li><strong>HSK Standard Course 3</strong> — từ vựng &amp; ngữ pháp nền cho mỗi chủ đề nói.</li>
</ul>
<h3>📱 App luyện nói &amp; nghe âm</h3>
<ul>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — khoá học có nhận diện giọng nói.</li>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển có audio bản ngữ cho từng từ (hãy nói nhại theo).</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — từ điển Trung-Việt kèm audio &amp; pinyin.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — hội thoại thật có phụ đề.</li>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — bài phát âm &amp; HSK có hệ thống.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình 4 bước luyện nói</span>
<ol>
<li><strong>Nghe</strong> — nghe câu và thanh điệu trước khi nhìn pinyin.</li>
<li><strong>Bắt chước</strong> — nói nhại theo audio thật to; sao chép cả nhịp điệu, không chỉ từ.</li>
<li><strong>Luyện cặp</strong> — luyện mỗi hội thoại với bạn, đổi vai A và B.</li>
<li><strong>Ứng dụng</strong> — dùng ngay câu đó trong tình huống thật trong ngày.</li>
</ol></div>`,
  ]]);

const intro = doc('chs211-0-1-overview', 'Course overview: Chinese Speaking 3A|||Tổng quan: Tiếng Trung giao tiếp 3A',
  'Song song CHS201: nhắc nền phát âm/thanh điệu, mục tiêu khẩu ngữ HSK3, cách luyện các đoạn hội thoại đóng vai dài và trình bày một chủ đề ngắn.',
  [[
    `<span class="eyebrow">CHS211 · Lesson 0.1 · Overview</span>
<h2>Chinese Speaking 3A (HSK3)</h2>
<p class="lead">This course runs <strong>alongside CHS201</strong>. Where CHS201 builds the core HSK3 situations, CHS211 gives you <strong>deeper practice</strong> of the same level: talking about hobbies, telling a story, persuading someone, dealing with a bank or post office, taking a phone message, describing a person, sharing a view on a social topic, and a short interview talk.</p>
<h3>What you keep from CHS201 (the base)</h3>
<ul>
<li><strong>Sound first</strong> — the 4 tones plus the neutral tone; a wrong tone is a wrong word, so keep shadowing native audio.</li>
<li><strong>Fixed phrases</strong> — spoken Chinese runs on set patterns (我觉得… , 因为…所以… , 越来越…). Learn the whole phrase, use it as one block.</li>
</ul>
<h3>How each lesson works</h3>
<p>Every lesson gives you a <strong>spoken vocabulary &amp; phrase table</strong> (汉字 | pinyin | nghĩa), the <strong>key communication patterns</strong> to memorise, a <strong>real dialogue</strong> (3 to 4 turns) to shadow and role-play, and <strong>pronunciation / intonation notes</strong>. Then a short quiz. Always follow the 4 steps: listen → imitate → pair-drill → apply.</p>
<h3>Roadmap</h3>
<p>Hobbies &amp; entertainment → telling a story → persuading → service situations → phone messages → describing people &amp; things → social opinions → interview &amp; short talk.</p>`,
    `<span class="eyebrow">CHS211 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung giao tiếp 3A (HSK3)</h2>
<p class="lead">Môn này chạy <strong>song song với CHS201</strong>. CHS201 dựng những tình huống HSK3 cốt lõi, còn CHS211 cho bạn <strong>luyện sâu hơn</strong> ở cùng trình độ: nói về sở thích, kể chuyện, thuyết phục người khác, xử lý ở ngân hàng hay bưu điện, nhắn qua điện thoại, tả một người, nêu ý kiến về một chủ đề xã hội, và một bài thuyết trình ngắn khi phỏng vấn.</p>
<h3>Bạn giữ lại gì từ CHS201 (nền)</h3>
<ul>
<li><strong>Âm là gốc</strong> — 4 thanh cộng thanh nhẹ; sai thanh là sai từ, nên hãy tiếp tục nói nhại theo audio bản ngữ.</li>
<li><strong>Câu cố định</strong> — khẩu ngữ tiếng Trung chạy bằng các mẫu có sẵn (我觉得… , 因为…所以… , 越来越…). Hãy học cả cụm, dùng như một khối.</li>
</ul>
<h3>Mỗi bài học ra sao</h3>
<p>Mỗi bài có <strong>bảng từ vựng &amp; mẫu câu khẩu ngữ</strong> (汉字 | pinyin | nghĩa), các <strong>mẫu câu giao tiếp trọng tâm</strong> để thuộc, một <strong>hội thoại thực tế</strong> (3 đến 4 lượt) để nói nhại &amp; đóng vai, và <strong>ghi chú phát âm / ngữ điệu</strong>. Sau đó là quiz ngắn. Luôn theo 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.</p>
<h3>Lộ trình</h3>
<p>Sở thích &amp; giải trí → kể chuyện → thuyết phục → tình huống dịch vụ → nhắn điện thoại → miêu tả người &amp; vật → ý kiến xã hội → phỏng vấn &amp; thuyết trình ngắn.</p>`,
  ]]);

const b1 = doc('chs211-1-1-hobbies-entertainment', 'Lesson 1 — Hobbies &amp; entertainment|||Bài 1 — Thảo luận sở thích &amp; giải trí',
  'Mẫu câu: 你有什么爱好, 我给你推荐一部电影, 因为它很有意思, 一点儿也不无聊; từ 爱好/推荐/音乐/无聊; luyện thảo luận sở thích và giới thiệu phim.',
  [[
    `<span class="eyebrow">CHS211 · Lesson 1 · Hobbies</span>
<h2>Hobbies &amp; entertainment</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>爱好</td><td>àihào</td><td>hobby</td></tr>
<tr><td>讨论</td><td>tǎolùn</td><td>to discuss</td></tr>
<tr><td>推荐</td><td>tuījiàn</td><td>to recommend</td></tr>
<tr><td>电影</td><td>diànyǐng</td><td>film, movie</td></tr>
<tr><td>音乐</td><td>yīnyuè</td><td>music</td></tr>
<tr><td>唱歌</td><td>chàng gē</td><td>to sing</td></tr>
<tr><td>打篮球</td><td>dǎ lánqiú</td><td>to play basketball</td></tr>
<tr><td>有意思</td><td>yǒu yìsi</td><td>interesting, fun</td></tr>
<tr><td>无聊</td><td>wúliáo</td><td>boring</td></tr>
<tr><td>故事</td><td>gùshi</td><td>story, plot</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>你有什么爱好?</strong> nǐ yǒu shénme àihào? — what hobbies do you have?</li>
<li><strong>我最喜欢的爱好是…</strong> wǒ zuì xǐhuan de àihào shì… — my favourite hobby is …</li>
<li><strong>我给你推荐一部电影</strong> wǒ gěi nǐ tuījiàn yí bù diànyǐng — let me recommend you a movie.</li>
<li><strong>因为它很有意思</strong> yīnwèi tā hěn yǒu yìsi — because it is very interesting.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 周末你喜欢做什么？ Zhōumò nǐ xǐhuan zuò shénme? (What do you like to do on weekends?)
B: 我喜欢看电影，也喜欢听音乐。 Wǒ xǐhuan kàn diànyǐng, yě xǐhuan tīng yīnyuè. (I like watching movies, and I also like listening to music.)
A: 你能给我推荐一部电影吗？ Nǐ néng gěi wǒ tuījiàn yí bù diànyǐng ma? (Can you recommend me a movie?)
B: 你可以看这部，因为故事很有意思，一点儿也不无聊。 Nǐ kěyǐ kàn zhè bù, yīnwèi gùshi hěn yǒu yìsi, yìdiǎnr yě bù wúliáo. (You can watch this one, because the story is very interesting, not boring at all.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 爱好 (àihào) is two 4th tones — both fall. The frame 一点儿也不 + adjective is a strong negative: 一点儿也不无聊 = not boring at all; stress the 也不.</div>`,
    `<span class="eyebrow">CHS211 · Bài 1 · Sở thích</span>
<h2>Thảo luận sở thích &amp; giải trí</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>爱好</td><td>àihào</td><td>sở thích</td></tr>
<tr><td>讨论</td><td>tǎolùn</td><td>thảo luận</td></tr>
<tr><td>推荐</td><td>tuījiàn</td><td>giới thiệu, đề cử</td></tr>
<tr><td>电影</td><td>diànyǐng</td><td>phim</td></tr>
<tr><td>音乐</td><td>yīnyuè</td><td>âm nhạc</td></tr>
<tr><td>唱歌</td><td>chàng gē</td><td>hát</td></tr>
<tr><td>打篮球</td><td>dǎ lánqiú</td><td>chơi bóng rổ</td></tr>
<tr><td>有意思</td><td>yǒu yìsi</td><td>thú vị</td></tr>
<tr><td>无聊</td><td>wúliáo</td><td>chán, buồn tẻ</td></tr>
<tr><td>故事</td><td>gùshi</td><td>câu chuyện, cốt truyện</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>你有什么爱好?</strong> nǐ yǒu shénme àihào? — bạn có sở thích gì?</li>
<li><strong>我最喜欢的爱好是…</strong> wǒ zuì xǐhuan de àihào shì… — sở thích tôi thích nhất là …</li>
<li><strong>我给你推荐一部电影</strong> wǒ gěi nǐ tuījiàn yí bù diànyǐng — để tôi giới thiệu cho bạn một bộ phim.</li>
<li><strong>因为它很有意思</strong> yīnwèi tā hěn yǒu yìsi — vì nó rất thú vị.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 周末你喜欢做什么？ Zhōumò nǐ xǐhuan zuò shénme? (Cuối tuần bạn thích làm gì?)
B: 我喜欢看电影，也喜欢听音乐。 Wǒ xǐhuan kàn diànyǐng, yě xǐhuan tīng yīnyuè. (Tôi thích xem phim, cũng thích nghe nhạc.)
A: 你能给我推荐一部电影吗？ Nǐ néng gěi wǒ tuījiàn yí bù diànyǐng ma? (Bạn giới thiệu cho tôi một bộ phim được không?)
B: 你可以看这部，因为故事很有意思，一点儿也不无聊。 Nǐ kěyǐ kàn zhè bù, yīnwèi gùshi hěn yǒu yìsi, yìdiǎnr yě bù wúliáo. (Bạn có thể xem bộ này, vì câu chuyện rất thú vị, chẳng chán chút nào.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 爱好 (àihào) là hai thanh 4 — cùng đi xuống. Khung 一点儿也不 + tính từ là phủ định mạnh: 一点儿也不无聊 = chẳng chán chút nào; nhấn vào 也不.</div>`,
  ]]);

const b1q = quiz('chs211-quiz-1', 'Quiz 1 — Hobbies &amp; entertainment|||Quiz 1 — Sở thích &amp; giải trí', [
  { id: 'q1', question: '"你有什么爱好?" hỏi điều gì? / What does 你有什么爱好 ask?', options: ['Bạn có sở thích gì?|||What hobbies do you have?', 'Bạn bao nhiêu tuổi?|||How old are you?', 'Bạn tên gì?|||What is your name?', 'Bạn ở đâu?|||Where do you live?'], correctIndex: 0, explanation: '爱好 àihào = sở thích; 你有什么爱好? = bạn có sở thích gì?' },
  { id: 'q2', question: 'Giới thiệu một bộ phim cho ai đó nói thế nào? / How do you recommend someone a movie?', options: ['我给你推荐一部电影', '我不知道', '多少钱？', '再见'], correctIndex: 0, explanation: '推荐 tuījiàn = giới thiệu, đề cử; 一部电影 = một bộ phim.' },
  { id: 'q3', question: '"一点儿也不无聊" nghĩa là gì? / What does 一点儿也不无聊 mean?', options: ['Chẳng chán chút nào|||Not boring at all', 'Rất chán|||Very boring', 'Hơi chán|||A bit boring', 'Rất đắt|||Very expensive'], correctIndex: 0, explanation: '一点儿也不 + tính từ = chẳng … chút nào (phủ định mạnh); 无聊 = chán.' },
]);

const b2 = doc('chs211-2-1-storytelling', 'Lesson 2 — Telling &amp; retelling a story|||Bài 2 — Kể chuyện &amp; thuật lại',
  'Mẫu câu: 我给你讲个故事, 有一天…后来…最后, 原来…, 故事的内容是…; từ 讲故事/复述/发现/主人; luyện kể lại một câu chuyện.',
  [[
    `<span class="eyebrow">CHS211 · Lesson 2 · Storytelling</span>
<h2>Telling &amp; retelling a story</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>讲故事</td><td>jiǎng gùshi</td><td>to tell a story</td></tr>
<tr><td>复述</td><td>fùshù</td><td>to retell, to recount</td></tr>
<tr><td>有一天</td><td>yǒu yì tiān</td><td>one day</td></tr>
<tr><td>从前</td><td>cóngqián</td><td>once, in the past</td></tr>
<tr><td>后来</td><td>hòulái</td><td>later, afterwards</td></tr>
<tr><td>最后</td><td>zuìhòu</td><td>in the end, finally</td></tr>
<tr><td>发现</td><td>fāxiàn</td><td>to find, to discover</td></tr>
<tr><td>原来</td><td>yuánlái</td><td>it turns out</td></tr>
<tr><td>主人</td><td>zhǔrén</td><td>owner</td></tr>
<tr><td>内容</td><td>nèiróng</td><td>content</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我给你讲个故事</strong> wǒ gěi nǐ jiǎng ge gùshi — let me tell you a story.</li>
<li><strong>有一天…，后来…，最后…</strong> — one day …, later …, in the end … : the frame to narrate.</li>
<li><strong>故事的内容是…</strong> gùshi de nèiróng shì… — the story is about …</li>
<li><strong>原来…</strong> yuánlái… — it turns out that … (a surprise).</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你能给我讲个故事吗？ Nǐ néng gěi wǒ jiǎng ge gùshi ma? (Can you tell me a story?)
B: 好。有一天，一个人在路上捡到一个钱包。 Hǎo. Yǒu yì tiān, yí ge rén zài lùshang jiǎn dào yí ge qiánbāo. (Sure. One day, a person picked up a wallet on the road.)
A: 后来呢？ Hòulái ne? (And then?)
B: 后来他找到了钱包的主人，最后他们成了好朋友。 Hòulái tā zhǎo dào le qiánbāo de zhǔrén, zuìhòu tāmen chéng le hǎo péngyou. (Later he found the wallet owner, and in the end they became good friends.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 有一天…后来…最后 orders a story and builds to the ending — pause a beat at each marker. 原来 (yuánlái) at the start of a sentence carries surprise: it turns out ...</div>`,
    `<span class="eyebrow">CHS211 · Bài 2 · Kể chuyện</span>
<h2>Kể chuyện &amp; thuật lại</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>讲故事</td><td>jiǎng gùshi</td><td>kể chuyện</td></tr>
<tr><td>复述</td><td>fùshù</td><td>thuật lại, kể lại</td></tr>
<tr><td>有一天</td><td>yǒu yì tiān</td><td>một ngày nọ</td></tr>
<tr><td>从前</td><td>cóngqián</td><td>ngày xưa</td></tr>
<tr><td>后来</td><td>hòulái</td><td>sau đó, về sau</td></tr>
<tr><td>最后</td><td>zuìhòu</td><td>cuối cùng</td></tr>
<tr><td>发现</td><td>fāxiàn</td><td>phát hiện ra</td></tr>
<tr><td>原来</td><td>yuánlái</td><td>hoá ra</td></tr>
<tr><td>主人</td><td>zhǔrén</td><td>chủ nhân</td></tr>
<tr><td>内容</td><td>nèiróng</td><td>nội dung</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我给你讲个故事</strong> wǒ gěi nǐ jiǎng ge gùshi — để tôi kể cho bạn một câu chuyện.</li>
<li><strong>有一天…，后来…，最后…</strong> — một ngày nọ …, sau đó …, cuối cùng … : khung để thuật lại.</li>
<li><strong>故事的内容是…</strong> gùshi de nèiróng shì… — nội dung câu chuyện là …</li>
<li><strong>原来…</strong> yuánlái… — hoá ra là … (bất ngờ).</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你能给我讲个故事吗？ Nǐ néng gěi wǒ jiǎng ge gùshi ma? (Bạn kể cho tôi một câu chuyện được không?)
B: 好。有一天，一个人在路上捡到一个钱包。 Hǎo. Yǒu yì tiān, yí ge rén zài lùshang jiǎn dào yí ge qiánbāo. (Được. Một ngày nọ, một người nhặt được cái ví trên đường.)
A: 后来呢？ Hòulái ne? (Sau đó thì sao?)
B: 后来他找到了钱包的主人，最后他们成了好朋友。 Hòulái tā zhǎo dào le qiánbāo de zhǔrén, zuìhòu tāmen chéng le hǎo péngyou. (Sau đó anh ấy tìm được chủ cái ví, cuối cùng họ thành bạn tốt.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 有一天…后来…最后 xếp câu chuyện và dẫn tới kết thúc — ngắt một nhịp ở mỗi mốc. 原来 (yuánlái) mở đầu câu mang ý bất ngờ: hoá ra là ...</div>`,
  ]]);

const b2q = quiz('chs211-quiz-2', 'Quiz 2 — Telling a story|||Quiz 2 — Kể chuyện &amp; thuật lại', [
  { id: 'q1', question: 'Bộ khung nào dùng để thuật lại một câu chuyện? / Which set frames a story?', options: ['有一天…后来…最后', '因为…所以…', '越来越…', '一方面…另一方面…'], correctIndex: 0, explanation: '有一天 (một ngày nọ) … 后来 (sau đó) … 最后 (cuối cùng) — khung kể chuyện.' },
  { id: 'q2', question: '"有一天" nghĩa là gì? / What does 有一天 mean?', options: ['Một ngày nọ|||One day', 'Hôm nay|||Today', 'Ngày mai|||Tomorrow', 'Mỗi ngày|||Every day'], correctIndex: 0, explanation: '有一天 yǒu yì tiān = một ngày nọ, dùng để mở đầu câu chuyện.' },
  { id: 'q3', question: '"原来" (yuánlái) đứng đầu câu mang nghĩa gì? / What does 原来 add?', options: ['Hoá ra (bất ngờ)|||It turns out', 'Cẩn thận|||Be careful', 'Nhanh lên|||Hurry up', 'Tạm biệt|||Goodbye'], correctIndex: 0, explanation: '原来 = hoá ra, dùng khi phát hiện ra điều bất ngờ.' },
]);

const b3 = doc('chs211-3-1-persuading', 'Lesson 3 — Debating &amp; persuading|||Bài 3 — Tranh luận &amp; thuyết phục',
  'Mẫu câu: 我建议你…，因为…, 你应该考虑一下, 你说得有道理, 不过…; từ 说服/理由/反对/考虑; luyện thuyết phục và tranh luận lịch sự.',
  [[
    `<span class="eyebrow">CHS211 · Lesson 3 · Persuading</span>
<h2>Debating &amp; persuading</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>说服</td><td>shuōfú</td><td>to persuade</td></tr>
<tr><td>建议</td><td>jiànyì</td><td>to suggest, a suggestion</td></tr>
<tr><td>应该</td><td>yīnggāi</td><td>should, ought to</td></tr>
<tr><td>其实</td><td>qíshí</td><td>actually, in fact</td></tr>
<tr><td>不过</td><td>búguò</td><td>but, however</td></tr>
<tr><td>同意</td><td>tóngyì</td><td>to agree</td></tr>
<tr><td>反对</td><td>fǎnduì</td><td>to oppose, to object</td></tr>
<tr><td>理由</td><td>lǐyóu</td><td>reason</td></tr>
<tr><td>考虑</td><td>kǎolǜ</td><td>to consider</td></tr>
<tr><td>有道理</td><td>yǒu dàolǐ</td><td>to make sense</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我建议你…，因为…</strong> wǒ jiànyì nǐ…, yīnwèi… — I suggest you …, because …</li>
<li><strong>你应该考虑一下</strong> nǐ yīnggāi kǎolǜ yíxià — you should think it over.</li>
<li><strong>我的理由是…</strong> wǒ de lǐyóu shì… — my reason is …</li>
<li><strong>你说得有道理，不过…</strong> nǐ shuō de yǒu dàolǐ, búguò… — you have a point, but …</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 这个周末我想在家休息，不想出去。 Zhège zhōumò wǒ xiǎng zài jiā xiūxi, bù xiǎng chūqù. (This weekend I want to rest at home, I do not want to go out.)
B: 我建议你出去走走，因为天气很好，对身体也好。 Wǒ jiànyì nǐ chūqù zǒuzou, yīnwèi tiānqì hěn hǎo, duì shēntǐ yě hǎo. (I suggest you go out for a walk, because the weather is nice and it is good for your health.)
A: 你说得有道理，不过我有点儿累。 Nǐ shuō de yǒu dàolǐ, búguò wǒ yǒudiǎnr lèi. (You have a point, but I am a bit tired.)
B: 那我们去公园坐一会儿，你觉得怎么样？ Nà wǒmen qù gōngyuán zuò yíhuìr, nǐ juéde zěnmeyàng? (Then let us go and sit in the park for a while, what do you think?)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> Say 我建议你… then the reason with 因为… in one smooth line. Acknowledge first with 你说得有道理 before you push back with 不过 (but) — that is the polite way to disagree.</div>`,
    `<span class="eyebrow">CHS211 · Bài 3 · Thuyết phục</span>
<h2>Tranh luận &amp; thuyết phục</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>说服</td><td>shuōfú</td><td>thuyết phục</td></tr>
<tr><td>建议</td><td>jiànyì</td><td>đề nghị, khuyên</td></tr>
<tr><td>应该</td><td>yīnggāi</td><td>nên</td></tr>
<tr><td>其实</td><td>qíshí</td><td>thật ra</td></tr>
<tr><td>不过</td><td>búguò</td><td>nhưng</td></tr>
<tr><td>同意</td><td>tóngyì</td><td>đồng ý</td></tr>
<tr><td>反对</td><td>fǎnduì</td><td>phản đối</td></tr>
<tr><td>理由</td><td>lǐyóu</td><td>lý do</td></tr>
<tr><td>考虑</td><td>kǎolǜ</td><td>cân nhắc</td></tr>
<tr><td>有道理</td><td>yǒu dàolǐ</td><td>có lý</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我建议你…，因为…</strong> wǒ jiànyì nǐ…, yīnwèi… — tôi khuyên bạn …, vì …</li>
<li><strong>你应该考虑一下</strong> nǐ yīnggāi kǎolǜ yíxià — bạn nên cân nhắc một chút.</li>
<li><strong>我的理由是…</strong> wǒ de lǐyóu shì… — lý do của tôi là …</li>
<li><strong>你说得有道理，不过…</strong> nǐ shuō de yǒu dàolǐ, búguò… — bạn nói có lý, nhưng …</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 这个周末我想在家休息，不想出去。 Zhège zhōumò wǒ xiǎng zài jiā xiūxi, bù xiǎng chūqù. (Cuối tuần này tôi muốn ở nhà nghỉ, không muốn ra ngoài.)
B: 我建议你出去走走，因为天气很好，对身体也好。 Wǒ jiànyì nǐ chūqù zǒuzou, yīnwèi tiānqì hěn hǎo, duì shēntǐ yě hǎo. (Tôi khuyên bạn ra ngoài đi dạo, vì thời tiết đẹp, lại tốt cho sức khoẻ.)
A: 你说得有道理，不过我有点儿累。 Nǐ shuō de yǒu dàolǐ, búguò wǒ yǒudiǎnr lèi. (Bạn nói có lý, nhưng tôi hơi mệt.)
B: 那我们去公园坐一会儿，你觉得怎么样？ Nà wǒmen qù gōngyuán zuò yíhuìr, nǐ juéde zěnmeyàng? (Vậy mình ra công viên ngồi một lát, bạn thấy sao?)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> Nói 我建议你… rồi nêu lý do 因为… liền một mạch. Công nhận trước bằng 你说得有道理 rồi mới phản biện bằng 不过 (nhưng) — đó là cách tranh luận lịch sự.</div>`,
  ]]);

const b3q = quiz('chs211-quiz-3', 'Quiz 3 — Persuading|||Quiz 3 — Tranh luận &amp; thuyết phục', [
  { id: 'q1', question: 'Khuyên ai đó kèm lý do dùng khung nào? / Which frame gives advice with a reason?', options: ['我建议你…，因为…', '还是…吗', '有没有', '多少钱'], correctIndex: 0, explanation: '我建议你 (tôi khuyên bạn) … 因为 (vì) … — đưa lời khuyên kèm lý do.' },
  { id: 'q2', question: '"你说得有道理" nghĩa là gì? / What does 你说得有道理 mean?', options: ['Bạn nói có lý|||You have a point', 'Bạn nói sai|||You are wrong', 'Bạn nói to quá|||You are too loud', 'Bạn im lặng|||Be quiet'], correctIndex: 0, explanation: '有道理 yǒu dàolǐ = có lý; công nhận ý người kia trước khi phản biện.' },
  { id: 'q3', question: 'Từ "不过" (búguò) nối câu mang nghĩa gì? / What does 不过 mean as a connector?', options: ['nhưng|||but', 'vì thế|||therefore', 'hoặc|||or', 'và|||and'], correctIndex: 0, explanation: '不过 = nhưng, dùng để nêu ý ngược lại một cách nhẹ nhàng.' },
]);

const b4 = doc('chs211-4-1-service-situations', 'Lesson 4 — Service situations|||Bài 4 — Xử lý tình huống dịch vụ',
  'Mẫu câu: 我想办一张银行卡, 请问需要什么, 请填一下这张表格, 我要寄一封信; từ 银行/邮局/办手续/表格/护照; luyện ở ngân hàng, bưu điện.',
  [[
    `<span class="eyebrow">CHS211 · Lesson 4 · Services</span>
<h2>Service situations (bank &amp; post office)</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>银行</td><td>yínháng</td><td>bank</td></tr>
<tr><td>邮局</td><td>yóujú</td><td>post office</td></tr>
<tr><td>办手续</td><td>bàn shǒuxù</td><td>to do the paperwork</td></tr>
<tr><td>取钱</td><td>qǔ qián</td><td>to withdraw money</td></tr>
<tr><td>存钱</td><td>cún qián</td><td>to deposit money</td></tr>
<tr><td>寄信</td><td>jì xìn</td><td>to mail a letter</td></tr>
<tr><td>表格</td><td>biǎogé</td><td>form</td></tr>
<tr><td>填</td><td>tián</td><td>to fill in</td></tr>
<tr><td>护照</td><td>hùzhào</td><td>passport</td></tr>
<tr><td>需要</td><td>xūyào</td><td>to need</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我想办一张银行卡</strong> wǒ xiǎng bàn yì zhāng yínhángkǎ — I would like to open a bank card.</li>
<li><strong>请问需要什么?</strong> qǐngwèn xūyào shénme? — may I ask what is needed?</li>
<li><strong>请填一下这张表格</strong> qǐng tián yíxià zhè zhāng biǎogé — please fill in this form.</li>
<li><strong>我要寄一封信</strong> wǒ yào jì yì fēng xìn — I want to mail a letter.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>顾客: 你好，我想办一张银行卡。 Nǐ hǎo, wǒ xiǎng bàn yì zhāng yínhángkǎ. (Hello, I would like to open a bank card.)
职员: 好的，请问您带护照了吗？ Hǎo de, qǐngwèn nín dài hùzhào le ma? (Sure, may I ask, did you bring your passport?)
顾客: 带了。还需要什么？ Dài le. Hái xūyào shénme? (Yes. What else is needed?)
职员: 请先填一下这张表格，然后在这儿签名。 Qǐng xiān tián yíxià zhè zhāng biǎogé, ránhòu zài zhèr qiānmíng. (Please fill in this form first, then sign here.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 办手续 (bàn shǒuxù) is a set phrase = do the paperwork. 请问需要什么? is the polite line staff use; 请 + verb (请填, 请签名) makes a request more courteous.</div>`,
    `<span class="eyebrow">CHS211 · Bài 4 · Dịch vụ</span>
<h2>Xử lý tình huống dịch vụ (ngân hàng &amp; bưu điện)</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>银行</td><td>yínháng</td><td>ngân hàng</td></tr>
<tr><td>邮局</td><td>yóujú</td><td>bưu điện</td></tr>
<tr><td>办手续</td><td>bàn shǒuxù</td><td>làm thủ tục</td></tr>
<tr><td>取钱</td><td>qǔ qián</td><td>rút tiền</td></tr>
<tr><td>存钱</td><td>cún qián</td><td>gửi tiền</td></tr>
<tr><td>寄信</td><td>jì xìn</td><td>gửi thư</td></tr>
<tr><td>表格</td><td>biǎogé</td><td>tờ khai, biểu mẫu</td></tr>
<tr><td>填</td><td>tián</td><td>điền</td></tr>
<tr><td>护照</td><td>hùzhào</td><td>hộ chiếu</td></tr>
<tr><td>需要</td><td>xūyào</td><td>cần</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我想办一张银行卡</strong> wǒ xiǎng bàn yì zhāng yínhángkǎ — tôi muốn làm một thẻ ngân hàng.</li>
<li><strong>请问需要什么?</strong> qǐngwèn xūyào shénme? — xin hỏi cần những gì?</li>
<li><strong>请填一下这张表格</strong> qǐng tián yíxià zhè zhāng biǎogé — mời điền tờ khai này.</li>
<li><strong>我要寄一封信</strong> wǒ yào jì yì fēng xìn — tôi muốn gửi một lá thư.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>顾客: 你好，我想办一张银行卡。 Nǐ hǎo, wǒ xiǎng bàn yì zhāng yínhángkǎ. (Chào, tôi muốn làm một thẻ ngân hàng.)
职员: 好的，请问您带护照了吗？ Hǎo de, qǐngwèn nín dài hùzhào le ma? (Vâng, xin hỏi anh/chị mang hộ chiếu chưa?)
顾客: 带了。还需要什么？ Dài le. Hái xūyào shénme? (Mang rồi. Còn cần gì nữa không?)
职员: 请先填一下这张表格，然后在这儿签名。 Qǐng xiān tián yíxià zhè zhāng biǎogé, ránhòu zài zhèr qiānmíng. (Mời điền tờ khai này trước, rồi ký tên ở đây.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 办手续 (bàn shǒuxù) là cụm cố định = làm thủ tục. 请问需要什么? là câu hỏi lịch sự nhân viên hay dùng; 请 + động từ (请填, 请签名) làm yêu cầu nhã nhặn hơn.</div>`,
  ]]);

const b4q = quiz('chs211-quiz-4', 'Quiz 4 — Service situations|||Quiz 4 — Tình huống dịch vụ', [
  { id: 'q1', question: '"我想办一张银行卡" nghĩa là gì? / What does 我想办一张银行卡 mean?', options: ['Tôi muốn làm một thẻ ngân hàng|||I want to open a bank card', 'Tôi muốn rút tiền|||I want to withdraw money', 'Tôi muốn gửi thư|||I want to mail a letter', 'Tôi bị mất ví|||I lost my wallet'], correctIndex: 0, explanation: '办 bàn (làm thủ tục) + 银行卡 (thẻ ngân hàng).' },
  { id: 'q2', question: 'Nhân viên hỏi "còn cần gì nữa" nói thế nào? / How does staff ask what else is needed?', options: ['还需要什么？', '你好吗？', '几点了？', '怎么走？'], correctIndex: 0, explanation: '还 (còn) + 需要什么 (cần gì) = còn cần gì nữa.' },
  { id: 'q3', question: '"请填一下这张表格" yêu cầu điều gì? / What does 请填一下这张表格 ask you to do?', options: ['Điền tờ khai này|||Fill in this form', 'Ký tên|||Sign your name', 'Trả tiền|||Pay', 'Ngồi xuống|||Sit down'], correctIndex: 0, explanation: '填 tián (điền) + 表格 (tờ khai, biểu mẫu).' },
]);

const b5 = doc('chs211-5-1-phone-advanced', 'Lesson 5 — Phone calls (advanced)|||Bài 5 — Giao tiếp qua điện thoại nâng cao',
  'Mẫu câu: 请问…在吗, 您要留言吗, 请转告他…, 我们能不能改一下时间; từ 留言/转告/占线/约/会议; luyện để lời nhắn, đổi giờ hẹn.',
  [[
    `<span class="eyebrow">CHS211 · Lesson 5 · Phone</span>
<h2>Phone calls — messages &amp; rescheduling</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>喂</td><td>wéi</td><td>hello (on the phone)</td></tr>
<tr><td>留言</td><td>liúyán</td><td>to leave a message</td></tr>
<tr><td>转告</td><td>zhuǎngào</td><td>to pass on a message</td></tr>
<tr><td>占线</td><td>zhànxiàn</td><td>the line is busy</td></tr>
<tr><td>稍等</td><td>shāo děng</td><td>hold on a moment</td></tr>
<tr><td>约</td><td>yuē</td><td>to arrange, to make a date</td></tr>
<tr><td>改时间</td><td>gǎi shíjiān</td><td>to change the time</td></tr>
<tr><td>会议</td><td>huìyì</td><td>meeting</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>convenient</td></tr>
<tr><td>麻烦</td><td>máfan</td><td>to trouble someone</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>请问… 在吗?</strong> qǐngwèn … zài ma? — may I ask, is … there?</li>
<li><strong>他不在，您要留言吗?</strong> tā bú zài, nín yào liúyán ma? — he is not in, would you like to leave a message?</li>
<li><strong>麻烦您转告他…</strong> máfan nín zhuǎngào tā… — could you please pass on to him …</li>
<li><strong>我们能不能改一下时间?</strong> wǒmen néng bu néng gǎi yíxià shíjiān? — could we change the time?</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 喂，你好，请问王经理在吗？ Wéi, nǐ hǎo, qǐngwèn Wáng jīnglǐ zài ma? (Hello, may I ask, is Manager Wang there?)
B: 他现在不在，您要留言吗？ Tā xiànzài bú zài, nín yào liúyán ma? (He is not in right now, would you like to leave a message?)
A: 麻烦您转告他，明天的会议改到下午三点。 Máfan nín zhuǎngào tā, míngtiān de huìyì gǎi dào xiàwǔ sān diǎn. (Please pass on to him that tomorrow the meeting is moved to 3 in the afternoon.)
B: 好的，我一定转告他。 Hǎo de, wǒ yídìng zhuǎngào tā. (All right, I will surely pass it on.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 喂 (wéi) opens a call — say it rising, 2nd tone. 麻烦您… and 请转告… make a polite request; keep the voice light and even.</div>`,
    `<span class="eyebrow">CHS211 · Bài 5 · Điện thoại</span>
<h2>Điện thoại nâng cao — nhắn lại &amp; đổi giờ</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>喂</td><td>wéi</td><td>alô</td></tr>
<tr><td>留言</td><td>liúyán</td><td>để lời nhắn</td></tr>
<tr><td>转告</td><td>zhuǎngào</td><td>nhắn giúp, chuyển lời</td></tr>
<tr><td>占线</td><td>zhànxiàn</td><td>máy bận</td></tr>
<tr><td>稍等</td><td>shāo děng</td><td>đợi một lát</td></tr>
<tr><td>约</td><td>yuē</td><td>hẹn</td></tr>
<tr><td>改时间</td><td>gǎi shíjiān</td><td>đổi giờ</td></tr>
<tr><td>会议</td><td>huìyì</td><td>cuộc họp</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>tiện</td></tr>
<tr><td>麻烦</td><td>máfan</td><td>làm phiền</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>请问… 在吗?</strong> qǐngwèn … zài ma? — xin hỏi … có đó không?</li>
<li><strong>他不在，您要留言吗?</strong> tā bú zài, nín yào liúyán ma? — anh ấy không ở đây, anh/chị muốn nhắn lại không?</li>
<li><strong>麻烦您转告他…</strong> máfan nín zhuǎngào tā… — phiền anh/chị nhắn lại với anh ấy …</li>
<li><strong>我们能不能改一下时间?</strong> wǒmen néng bu néng gǎi yíxià shíjiān? — mình đổi giờ được không?</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 喂，你好，请问王经理在吗？ Wéi, nǐ hǎo, qǐngwèn Wáng jīnglǐ zài ma? (Alô, chào, xin hỏi giám đốc Vương có đó không?)
B: 他现在不在，您要留言吗？ Tā xiànzài bú zài, nín yào liúyán ma? (Anh ấy giờ không có ở đây, anh/chị muốn nhắn lại không?)
A: 麻烦您转告他，明天的会议改到下午三点。 Máfan nín zhuǎngào tā, míngtiān de huìyì gǎi dào xiàwǔ sān diǎn. (Phiền anh/chị nhắn lại với anh ấy, cuộc họp ngày mai đổi sang 3 giờ chiều.)
B: 好的，我一定转告他。 Hǎo de, wǒ yídìng zhuǎngào tā. (Vâng, tôi nhất định sẽ nhắn lại.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 喂 (wéi) mở đầu cuộc gọi đọc thanh 2 đi lên. 麻烦您… và 请转告… làm lời nhờ lịch sự; giữ giọng nhẹ và đều.</div>`,
  ]]);

const b5q = quiz('chs211-quiz-5', 'Quiz 5 — Phone calls|||Quiz 5 — Điện thoại nâng cao', [
  { id: 'q1', question: '"您要留言吗?" hỏi điều gì? / What does 您要留言吗 ask?', options: ['Anh/chị muốn nhắn lại không?|||Do you want to leave a message?', 'Anh/chị khoẻ không?|||How are you?', 'Anh/chị tên gì?|||What is your name?', 'Bao nhiêu tiền?|||How much?'], correctIndex: 0, explanation: '留言 liúyán = để lời nhắn; câu người nghe máy hay dùng khi người cần tìm vắng mặt.' },
  { id: 'q2', question: '"请转告他…" nghĩa là gì? / What does 请转告他 mean?', options: ['Nhờ nhắn lại với anh ấy|||Please pass it on to him', 'Gọi lại cho tôi|||Call me back', 'Cúp máy đi|||Hang up', 'Đợi một lát|||Wait a moment'], correctIndex: 0, explanation: '转告 zhuǎngào = chuyển lời, nhắn giúp.' },
  { id: 'q3', question: '"我们能不能改一下时间?" đề nghị điều gì? / What does 我们能不能改一下时间 propose?', options: ['Đổi lại giờ hẹn|||Change the time', 'Huỷ cuộc hẹn|||Cancel it', 'Đến sớm hơn|||Arrive early', 'Gặp ở đâu|||Where to meet'], correctIndex: 0, explanation: '改 gǎi (đổi) + 时间 (giờ) = đổi giờ; 能不能 làm lời đề nghị lịch sự.' },
]);

const b6 = doc('chs211-6-1-describing', 'Lesson 6 — Describing people &amp; things|||Bài 6 — Miêu tả người &amp; vật',
  'Mẫu câu: 他长得高高的, 她的性格很…, 它的特点是…; từ 描述/长得/性格/样子/特点/热情/认真; luyện tả ngoại hình và tính cách.',
  [[
    `<span class="eyebrow">CHS211 · Lesson 6 · Describing</span>
<h2>Describing people &amp; things</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>描述</td><td>miáoshù</td><td>to describe</td></tr>
<tr><td>长得</td><td>zhǎng de</td><td>to look (of appearance)</td></tr>
<tr><td>性格</td><td>xìnggé</td><td>personality</td></tr>
<tr><td>样子</td><td>yàngzi</td><td>look, appearance</td></tr>
<tr><td>特点</td><td>tèdiǎn</td><td>feature, trait</td></tr>
<tr><td>高</td><td>gāo</td><td>tall</td></tr>
<tr><td>热情</td><td>rèqíng</td><td>warm, enthusiastic</td></tr>
<tr><td>认真</td><td>rènzhēn</td><td>serious, diligent</td></tr>
<tr><td>仔细</td><td>zǐxì</td><td>careful, meticulous</td></tr>
<tr><td>戴眼镜</td><td>dài yǎnjìng</td><td>to wear glasses</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>他长得高高的</strong> tā zhǎng de gāogāo de — he is quite tall.</li>
<li><strong>她的性格很…</strong> tā de xìnggé hěn… — her personality is very …</li>
<li><strong>它的样子像…</strong> tā de yàngzi xiàng… — it looks like …</li>
<li><strong>他最大的特点是…</strong> tā zuì dà de tèdiǎn shì… — his biggest trait is …</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你的新同事是个什么样的人？ Nǐ de xīn tóngshì shì ge shénmeyàng de rén? (What kind of person is your new colleague?)
B: 他长得高高的，戴着眼镜，性格很热情。 Tā zhǎng de gāogāo de, dài zhe yǎnjìng, xìnggé hěn rèqíng. (He is quite tall, wears glasses, and has a warm personality.)
A: 工作认真吗？ Gōngzuò rènzhēn ma? (Is he diligent at work?)
B: 很认真，他最大的特点就是做事很仔细。 Hěn rènzhēn, tā zuì dà de tèdiǎn jiùshì zuò shì hěn zǐxì. (Very diligent; his biggest trait is that he does things very carefully.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> Here 长 is read zhǎng, not cháng. 长得 + adjective describes looks; doubling the adjective (高高的, 瘦瘦的) sounds softer and more natural, with 的 read light.</div>`,
    `<span class="eyebrow">CHS211 · Bài 6 · Miêu tả</span>
<h2>Miêu tả người &amp; vật</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>描述</td><td>miáoshù</td><td>miêu tả</td></tr>
<tr><td>长得</td><td>zhǎng de</td><td>trông (về ngoại hình)</td></tr>
<tr><td>性格</td><td>xìnggé</td><td>tính cách</td></tr>
<tr><td>样子</td><td>yàngzi</td><td>dáng vẻ, hình dáng</td></tr>
<tr><td>特点</td><td>tèdiǎn</td><td>đặc điểm</td></tr>
<tr><td>高</td><td>gāo</td><td>cao</td></tr>
<tr><td>热情</td><td>rèqíng</td><td>nhiệt tình</td></tr>
<tr><td>认真</td><td>rènzhēn</td><td>chăm chỉ, nghiêm túc</td></tr>
<tr><td>仔细</td><td>zǐxì</td><td>tỉ mỉ, cẩn thận</td></tr>
<tr><td>戴眼镜</td><td>dài yǎnjìng</td><td>đeo kính</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>他长得高高的</strong> tā zhǎng de gāogāo de — anh ấy trông cao cao.</li>
<li><strong>她的性格很…</strong> tā de xìnggé hěn… — tính cách cô ấy rất …</li>
<li><strong>它的样子像…</strong> tā de yàngzi xiàng… — nó trông giống …</li>
<li><strong>他最大的特点是…</strong> tā zuì dà de tèdiǎn shì… — đặc điểm lớn nhất của anh ấy là …</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你的新同事是个什么样的人？ Nǐ de xīn tóngshì shì ge shénmeyàng de rén? (Đồng nghiệp mới của bạn là người thế nào?)
B: 他长得高高的，戴着眼镜，性格很热情。 Tā zhǎng de gāogāo de, dài zhe yǎnjìng, xìnggé hěn rèqíng. (Anh ấy trông cao cao, đeo kính, tính cách rất nhiệt tình.)
A: 工作认真吗？ Gōngzuò rènzhēn ma? (Làm việc có chăm chỉ không?)
B: 很认真，他最大的特点就是做事很仔细。 Hěn rènzhēn, tā zuì dà de tèdiǎn jiùshì zuò shì hěn zǐxì. (Rất chăm chỉ, đặc điểm lớn nhất của anh ấy là làm việc rất tỉ mỉ.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> Ở đây 长 đọc zhǎng, không phải cháng. 长得 + tính từ để tả ngoại hình; lặp tính từ (高高的, 瘦瘦的) nghe mềm và tự nhiên hơn, 的 đọc nhẹ.</div>`,
  ]]);

const b6q = quiz('chs211-quiz-6', 'Quiz 6 — Describing people|||Quiz 6 — Miêu tả người &amp; vật', [
  { id: 'q1', question: '"他长得高高的" nghĩa là gì? / What does 他长得高高的 mean?', options: ['Anh ấy trông cao cao|||He is quite tall', 'Anh ấy rất giàu|||He is rich', 'Anh ấy đến muộn|||He is late', 'Anh ấy đang bận|||He is busy'], correctIndex: 0, explanation: '长得 zhǎng de + tính từ tả ngoại hình; lặp 高高 nghe tự nhiên hơn.' },
  { id: 'q2', question: 'Từ "性格" (xìnggé) nói về điều gì? / What does 性格 describe?', options: ['Tính cách|||Personality', 'Chiều cao|||Height', 'Tuổi tác|||Age', 'Nghề nghiệp|||Job'], correctIndex: 0, explanation: '性格 = tính cách: 性格很热情 (tính cách rất nhiệt tình).' },
  { id: 'q3', question: '"最大的特点是…" dùng để nói gì? / What does 最大的特点是 introduce?', options: ['Đặc điểm nổi bật nhất|||The biggest trait', 'Giá tiền|||The price', 'Địa chỉ|||The address', 'Thời gian|||The time'], correctIndex: 0, explanation: '特点 tèdiǎn = đặc điểm; 最大的特点 = đặc điểm lớn/nổi bật nhất.' },
]);

const b7 = doc('chs211-7-1-social-opinions', 'Lesson 7 — Opinions on social topics|||Bài 7 — Trình bày ý kiến về xã hội',
  'Mẫu câu: 你对…有什么看法, 我觉得…越来越…, 一方面…另一方面…; từ 看法/社会/网购/影响/花钱; luyện nêu quan điểm về chủ đề xã hội.',
  [[
    `<span class="eyebrow">CHS211 · Lesson 7 · Social opinions</span>
<h2>Opinions on social topics</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>看法</td><td>kànfǎ</td><td>view, opinion</td></tr>
<tr><td>社会</td><td>shèhuì</td><td>society</td></tr>
<tr><td>年轻人</td><td>niánqīngrén</td><td>young people</td></tr>
<tr><td>网购</td><td>wǎnggòu</td><td>online shopping</td></tr>
<tr><td>手机</td><td>shǒujī</td><td>mobile phone</td></tr>
<tr><td>越来越</td><td>yuèláiyuè</td><td>more and more</td></tr>
<tr><td>影响</td><td>yǐngxiǎng</td><td>influence, to affect</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>convenient</td></tr>
<tr><td>花钱</td><td>huā qián</td><td>to spend money</td></tr>
<tr><td>问题</td><td>wèntí</td><td>problem, issue</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>你对… 有什么看法?</strong> nǐ duì … yǒu shénme kànfǎ? — what is your view on …?</li>
<li><strong>我觉得…越来越…</strong> wǒ juéde … yuèláiyuè… — I feel … is more and more …</li>
<li><strong>一方面…，另一方面…</strong> yì fāngmiàn…, lìng yì fāngmiàn… — on one hand …, on the other hand …</li>
<li><strong>这对… 有影响</strong> zhè duì … yǒu yǐngxiǎng — this has an effect on …</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你对网购有什么看法？ Nǐ duì wǎnggòu yǒu shénme kànfǎ? (What is your view on online shopping?)
B: 我觉得网购越来越方便，在家就能买东西。 Wǒ juéde wǎnggòu yuèláiyuè fāngbiàn, zài jiā jiù néng mǎi dōngxi. (I feel online shopping is more and more convenient; you can buy things from home.)
A: 有没有什么问题呢？ Yǒu méiyǒu shénme wèntí ne? (Are there any problems?)
B: 有。一方面很方便，另一方面很多人花钱越来越多了。 Yǒu. Yì fāngmiàn hěn fāngbiàn, lìng yì fāngmiàn hěn duō rén huā qián yuèláiyuè duō le. (Yes. On one hand it is convenient, on the other hand many people spend more and more money.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> Open a view with 我觉得 / 我认为. 越来越 + adjective shows a rising degree — say the three syllables in one flow. 一方面…另一方面… lets you present both sides in balance.</div>`,
    `<span class="eyebrow">CHS211 · Bài 7 · Ý kiến xã hội</span>
<h2>Trình bày ý kiến về xã hội</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>看法</td><td>kànfǎ</td><td>quan điểm, cách nhìn</td></tr>
<tr><td>社会</td><td>shèhuì</td><td>xã hội</td></tr>
<tr><td>年轻人</td><td>niánqīngrén</td><td>người trẻ</td></tr>
<tr><td>网购</td><td>wǎnggòu</td><td>mua sắm online</td></tr>
<tr><td>手机</td><td>shǒujī</td><td>điện thoại di động</td></tr>
<tr><td>越来越</td><td>yuèláiyuè</td><td>ngày càng</td></tr>
<tr><td>影响</td><td>yǐngxiǎng</td><td>ảnh hưởng</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>tiện lợi</td></tr>
<tr><td>花钱</td><td>huā qián</td><td>tiêu tiền</td></tr>
<tr><td>问题</td><td>wèntí</td><td>vấn đề</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>你对… 有什么看法?</strong> nǐ duì … yǒu shénme kànfǎ? — bạn có quan điểm gì về …?</li>
<li><strong>我觉得…越来越…</strong> wǒ juéde … yuèláiyuè… — tôi thấy … ngày càng …</li>
<li><strong>一方面…，另一方面…</strong> yì fāngmiàn…, lìng yì fāngmiàn… — một mặt …, mặt khác …</li>
<li><strong>这对… 有影响</strong> zhè duì … yǒu yǐngxiǎng — cái này có ảnh hưởng đến …</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你对网购有什么看法？ Nǐ duì wǎnggòu yǒu shénme kànfǎ? (Bạn có quan điểm gì về mua sắm online?)
B: 我觉得网购越来越方便，在家就能买东西。 Wǒ juéde wǎnggòu yuèláiyuè fāngbiàn, zài jiā jiù néng mǎi dōngxi. (Tôi thấy mua online ngày càng tiện, ở nhà là mua được đồ.)
A: 有没有什么问题呢？ Yǒu méiyǒu shénme wèntí ne? (Có vấn đề gì không?)
B: 有。一方面很方便，另一方面很多人花钱越来越多了。 Yǒu. Yì fāngmiàn hěn fāngbiàn, lìng yì fāngmiàn hěn duō rén huā qián yuèláiyuè duō le. (Có. Một mặt rất tiện, mặt khác nhiều người tiêu tiền ngày càng nhiều.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> Mở đầu quan điểm bằng 我觉得 / 我认为. 越来越 + tính từ diễn tả mức tăng dần — đọc liền ba âm. 一方面…另一方面… giúp trình bày cân bằng hai mặt.</div>`,
  ]]);

const b7q = quiz('chs211-quiz-7', 'Quiz 7 — Social opinions|||Quiz 7 — Ý kiến xã hội', [
  { id: 'q1', question: '"你对网购有什么看法?" hỏi điều gì? / What does 你对网购有什么看法 ask?', options: ['Quan điểm của bạn về mua online|||Your view on online shopping', 'Bạn mua gì online|||What you buy online', 'Giá bao nhiêu|||The price', 'Mua ở đâu|||Where to buy'], correctIndex: 0, explanation: '对 … 有什么看法 = có quan điểm gì về …; 看法 kànfǎ = quan điểm.' },
  { id: 'q2', question: 'Cụm "越来越方便" nghĩa là gì? / What does 越来越方便 mean?', options: ['Ngày càng tiện|||More and more convenient', 'Không tiện lắm|||Not convenient', 'Rất đắt|||Very expensive', 'Đã hỏng|||Broken'], correctIndex: 0, explanation: '越来越 + tính từ = ngày càng …; 方便 = tiện lợi.' },
  { id: 'q3', question: '"一方面…，另一方面…" dùng để làm gì? / What is 一方面…另一方面 used for?', options: ['Nêu hai mặt của vấn đề|||Present two sides', 'Kể theo thứ tự|||Tell in order', 'Hỏi giá|||Ask the price', 'Xin lỗi|||Apologise'], correctIndex: 0, explanation: '一方面 (một mặt) … 另一方面 (mặt khác) … — trình bày cân bằng hai mặt.' },
]);

const b8 = doc('chs211-8-1-interview-talk', 'Lesson 8 — Interview &amp; short talk|||Bài 8 — Phỏng vấn &amp; thuyết trình ngắn',
  'Mẫu câu: 首先…然后…总之…, 我想介绍一个话题, 我来回答这个问题, 我有…年的工作经验; từ 面试/话题/优点/经验/适合; luyện tự thể hiện và trình bày.',
  [[
    `<span class="eyebrow">CHS211 · Lesson 8 · Interview</span>
<h2>Interview &amp; short talk</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>面试</td><td>miànshì</td><td>job interview</td></tr>
<tr><td>自我展示</td><td>zìwǒ zhǎnshì</td><td>to present oneself</td></tr>
<tr><td>话题</td><td>huàtí</td><td>topic</td></tr>
<tr><td>回答</td><td>huídá</td><td>to answer</td></tr>
<tr><td>首先</td><td>shǒuxiān</td><td>first of all</td></tr>
<tr><td>然后</td><td>ránhòu</td><td>then, after that</td></tr>
<tr><td>总之</td><td>zǒngzhī</td><td>in short</td></tr>
<tr><td>优点</td><td>yōudiǎn</td><td>strong point</td></tr>
<tr><td>经验</td><td>jīngyàn</td><td>experience</td></tr>
<tr><td>适合</td><td>shìhé</td><td>to be suitable for</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>首先…，然后…，总之…</strong> shǒuxiān…, ránhòu…, zǒngzhī… — first …, then …, in short …</li>
<li><strong>今天我想介绍一个话题</strong> jīntiān wǒ xiǎng jièshào yí ge huàtí — today I want to introduce a topic.</li>
<li><strong>我来回答这个问题</strong> wǒ lái huídá zhège wèntí — let me answer this question.</li>
<li><strong>我有… 年的工作经验</strong> wǒ yǒu … nián de gōngzuò jīngyàn — I have … years of work experience.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>面试官: 请你先做个自我介绍。 Qǐng nǐ xiān zuò ge zìwǒ jièshào. (Please introduce yourself first.)
应聘者: 好的。我叫小李，有三年的工作经验。 Hǎo de. Wǒ jiào Xiǎo Lǐ, yǒu sān nián de gōngzuò jīngyàn. (Sure. My name is Xiao Li, I have three years of work experience.)
面试官: 你觉得自己最大的优点是什么？ Nǐ juéde zìjǐ zuì dà de yōudiǎn shì shénme? (What do you think is your biggest strong point?)
应聘者: 首先我做事很认真，然后我也很喜欢学习新东西。总之，我很适合这个工作。 Shǒuxiān wǒ zuò shì hěn rènzhēn, ránhòu wǒ yě hěn xǐhuan xuéxí xīn dōngxi. Zǒngzhī, wǒ hěn shìhé zhège gōngzuò. (First, I work seriously; then, I also love learning new things. In short, I am well suited to this job.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 首先…然后…总之… structures a short talk so it stays clear — pause a beat at each marker. 自我展示 means showing your strengths on purpose — speak with confidence and a clear voice.</div>`,
    `<span class="eyebrow">CHS211 · Bài 8 · Phỏng vấn</span>
<h2>Phỏng vấn &amp; thuyết trình ngắn</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>面试</td><td>miànshì</td><td>phỏng vấn</td></tr>
<tr><td>自我展示</td><td>zìwǒ zhǎnshì</td><td>thể hiện bản thân</td></tr>
<tr><td>话题</td><td>huàtí</td><td>chủ đề</td></tr>
<tr><td>回答</td><td>huídá</td><td>trả lời</td></tr>
<tr><td>首先</td><td>shǒuxiān</td><td>trước tiên</td></tr>
<tr><td>然后</td><td>ránhòu</td><td>sau đó</td></tr>
<tr><td>总之</td><td>zǒngzhī</td><td>tóm lại</td></tr>
<tr><td>优点</td><td>yōudiǎn</td><td>ưu điểm</td></tr>
<tr><td>经验</td><td>jīngyàn</td><td>kinh nghiệm</td></tr>
<tr><td>适合</td><td>shìhé</td><td>phù hợp</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>首先…，然后…，总之…</strong> shǒuxiān…, ránhòu…, zǒngzhī… — trước tiên …, sau đó …, tóm lại …</li>
<li><strong>今天我想介绍一个话题</strong> jīntiān wǒ xiǎng jièshào yí ge huàtí — hôm nay tôi muốn giới thiệu một chủ đề.</li>
<li><strong>我来回答这个问题</strong> wǒ lái huídá zhège wèntí — để tôi trả lời câu hỏi này.</li>
<li><strong>我有… 年的工作经验</strong> wǒ yǒu … nián de gōngzuò jīngyàn — tôi có … năm kinh nghiệm làm việc.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>面试官: 请你先做个自我介绍。 Qǐng nǐ xiān zuò ge zìwǒ jièshào. (Mời bạn tự giới thiệu trước.)
应聘者: 好的。我叫小李，有三年的工作经验。 Hǎo de. Wǒ jiào Xiǎo Lǐ, yǒu sān nián de gōngzuò jīngyàn. (Vâng. Tôi tên Tiểu Lý, có ba năm kinh nghiệm làm việc.)
面试官: 你觉得自己最大的优点是什么？ Nǐ juéde zìjǐ zuì dà de yōudiǎn shì shénme? (Bạn thấy ưu điểm lớn nhất của mình là gì?)
应聘者: 首先我做事很认真，然后我也很喜欢学习新东西。总之，我很适合这个工作。 Shǒuxiān wǒ zuò shì hěn rènzhēn, ránhòu wǒ yě hěn xǐhuan xuéxí xīn dōngxi. Zǒngzhī, wǒ hěn shìhé zhège gōngzuò. (Trước tiên tôi làm việc rất nghiêm túc, sau đó tôi cũng thích học cái mới. Tóm lại, tôi rất phù hợp với công việc này.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 首先…然后…总之… giúp bài thuyết trình ngắn mạch lạc — nghỉ một nhịp ở mỗi mốc. 自我展示 nghĩa là chủ động cho người nghe thấy điểm mạnh — nói tự tin, giọng rõ ràng.</div>`,
  ]]);

const b8q = quiz('chs211-quiz-8', 'Quiz 8 — Interview &amp; short talk|||Quiz 8 — Phỏng vấn &amp; thuyết trình', [
  { id: 'q1', question: 'Khung nào giúp thuyết trình ngắn mạch lạc? / Which frame structures a short talk?', options: ['首先…然后…总之…', '因为…所以…', '越来越…', '太…了'], correctIndex: 0, explanation: '首先 (trước tiên) … 然后 (sau đó) … 总之 (tóm lại) — khung trình bày.' },
  { id: 'q2', question: '"我有三年的工作经验" nghĩa là gì? / What does 我有三年的工作经验 mean?', options: ['Tôi có ba năm kinh nghiệm làm việc|||I have three years of work experience', 'Tôi làm việc ba giờ|||I work three hours', 'Tôi ba mươi tuổi|||I am thirty', 'Tôi nghỉ ba ngày|||Three days off'], correctIndex: 0, explanation: '经验 jīngyàn = kinh nghiệm; 三年的工作经验 = ba năm kinh nghiệm làm việc.' },
  { id: 'q3', question: '"总之" (zǒngzhī) đứng cuối phần trình bày nghĩa là? / What does 总之 signal?', options: ['Tóm lại|||In short', 'Đầu tiên|||First', 'Có lẽ|||Maybe', 'Tại sao|||Why'], correctIndex: 0, explanation: '总之 = tóm lại, dùng để chốt lại ý ở cuối.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CHS211',
    slug: 'chs211-chinese-speaking-3a',
    title: 'Chinese Speaking 3A',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHS211.webp',
    shortDescription: 'Spoken Chinese 3A (HSK3), alongside CHS201: hobbies, storytelling, persuading, bank & post office, phone messages, describing people, social opinions, interviews. Longer role-play dialogues, bilingual, quizzes.|||Tiếng Trung nói 3A (HSK3), song song CHS201: sở thích, kể chuyện, thuyết phục, ngân hàng & bưu điện, nhắn điện thoại, tả người, ý kiến xã hội, phỏng vấn. Hội thoại đóng vai dài hơn, song ngữ, quiz.',
    description: 'Môn <strong>CHS211 — Chinese Speaking 3A (Tiếng Trung nói 3A)</strong> là môn <strong>luyện nói chuyên sâu</strong> ở trình độ khẩu ngữ <strong>HSK3</strong>, <strong>song song &amp; bổ trợ CHS201</strong>. Tám chủ đề thực hành: <strong>thảo luận sở thích &amp; giải trí</strong> → <strong>kể chuyện &amp; thuật lại</strong> → <strong>tranh luận &amp; thuyết phục</strong> → <strong>xử lý tình huống dịch vụ (ngân hàng, bưu điện)</strong> → <strong>giao tiếp qua điện thoại nâng cao</strong> → <strong>miêu tả người &amp; vật</strong> → <strong>trình bày ý kiến về xã hội</strong> → <strong>phỏng vấn &amp; thuyết trình ngắn</strong>. Bám giáo trình khẩu ngữ chuẩn (汉语口语速成 提高篇 / HSK Standard Course 3), song ngữ Trung–Việt, mỗi bài có bảng từ vựng khẩu ngữ (汉字|pinyin|nghĩa), mẫu câu giao tiếp trọng tâm, hội thoại đóng vai dài (3–4 lượt) để nói nhại, ghi chú ngữ điệu và quiz. Học theo lộ trình 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.',
    whatYouLearn: 'Thảo luận sở thích &amp; giải trí (你有什么爱好, 我给你推荐一部电影, 一点儿也不无聊); kể chuyện &amp; thuật lại (有一天…后来…最后, 原来); tranh luận &amp; thuyết phục (我建议你…因为, 你说得有道理, 不过); xử lý tình huống dịch vụ (办手续, 还需要什么, 请填一下表格); giao tiếp qua điện thoại nâng cao (留言, 转告, 改时间); miêu tả người &amp; vật (长得, 性格, 特点); trình bày ý kiến về xã hội (你对…有什么看法, 越来越, 一方面…另一方面); phỏng vấn &amp; thuyết trình ngắn (首先…然后…总之, 工作经验, 优点). Nói được các đoạn hội thoại tình huống dài hơn và trình bày một chủ đề ngắn mạch lạc.',
    requirements: 'Nên học xong CHS201 (giao tiếp HSK3: bản thân, sức khoẻ &amp; lời khuyên, ý kiến, kể sự việc, nhà hàng, du lịch, phỏng vấn, so sánh) hoặc học song song với môn đó. Cài Pleco hoặc HelloChinese để nghe audio bản ngữ &amp; luyện nói theo; hãy nói to và tự thu âm để so với mẫu.',
  },
  sections: [
    { title: '📚 Tài liệu &amp; lộ trình luyện nói|||📚 Course materials', description: 'Giáo trình khẩu ngữ 汉语口语速成 提高篇, app luyện nói, lộ trình 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Song song CHS201: nhắc nền phát âm/thanh điệu, mục tiêu khẩu ngữ HSK3, cách luyện hội thoại đóng vai dài và trình bày chủ đề ngắn.', lessons: [intro] },
    { title: 'Bài 1 — Thảo luận sở thích &amp; giải trí|||Lesson 1 — Hobbies & entertainment', description: '你有什么爱好, 我给你推荐一部电影, 因为它很有意思, 一点儿也不无聊.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Kể chuyện &amp; thuật lại|||Lesson 2 — Telling a story', description: '我给你讲个故事, 有一天…后来…最后, 原来, 复述.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Tranh luận &amp; thuyết phục|||Lesson 3 — Persuading', description: '我建议你…因为, 你应该考虑一下, 你说得有道理, 不过.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Xử lý tình huống dịch vụ|||Lesson 4 — Service situations', description: '办手续, 请问需要什么, 请填一下表格, 我要寄一封信.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Giao tiếp qua điện thoại nâng cao|||Lesson 5 — Phone calls', description: '请问…在吗, 您要留言吗, 请转告他, 改时间.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Miêu tả người &amp; vật|||Lesson 6 — Describing people', description: '长得高高的, 性格很热情, 最大的特点是, 样子.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Trình bày ý kiến về xã hội|||Lesson 7 — Social opinions', description: '你对…有什么看法, 越来越, 一方面…另一方面, 影响.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Phỏng vấn &amp; thuyết trình ngắn|||Lesson 8 — Interview & short talk', description: '首先…然后…总之, 自我展示, 工作经验, 优点, 适合.', lessons: [b8, b8q] },
  ],
};
