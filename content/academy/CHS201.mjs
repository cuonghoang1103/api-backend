/**
 * CHS201 — Chinese Speaking 3 (Tiếng Trung giao tiếp/nói 3). Khối Ngôn ngữ
 * Trung FPTU. Đây là MÔN NGÔN NGỮ, track LUYỆN NÓI, NỐI TIẾP CHS121: giao
 * tiếp tình huống mở rộng ở trình độ khẩu ngữ HSK3 — kể về bản thân & học
 * tập, sức khoẻ & lời khuyên, bày tỏ ý kiến & cảm xúc, kể lại sự việc, phàn
 * nàn ở nhà hàng, du lịch & đặt chỗ, phỏng vấn xin việc, so sánh & lựa chọn.
 * Giáo trình chuẩn: 汉语口语速成 提高篇 (Short-term Spoken Chinese, Pre-
 * Intermediate), HSK Standard Course 3. Lộ trình 4 bước: Nghe → Bắt chước →
 * Luyện cặp → Ứng dụng. Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG
 * backtick lồng/${; trong HTML content "&" → "&amp;". shortDescription "&".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & mẫu câu giao tiếp của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chs201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình luyện nói',
  'Giáo trình khẩu ngữ chuẩn (汉语口语速成 提高篇, HSK Standard Course 3), app luyện nói (HelloChinese/Pleco), lộ trình 4 bước: Nghe → Bắt chước → Luyện cặp → Ứng dụng.',
  [[
    `<span class="eyebrow">CHS201 · Materials</span>
<h2>Keep building spoken Chinese — materials &amp; roadmap</h2>
<p class="lead">Chinese Speaking 3 continues <strong>CHS121</strong>. It is still a <strong>speaking-first</strong> course, now at the <strong>HSK3</strong> level: longer role-play dialogues, situations that need more than one sentence, and the fixed phrases you use to give advice, an opinion, and a reason.</p>
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
    `<span class="eyebrow">CHS201 · Tài liệu</span>
<h2>Tiếp tục luyện nói tiếng Trung — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung giao tiếp 3 nối tiếp <strong>CHS121</strong>. Vẫn là môn <strong>lấy nói làm gốc</strong>, giờ ở trình độ <strong>HSK3</strong>: hội thoại đóng vai dài hơn, tình huống cần nhiều hơn một câu, và những cụm cố định để đưa lời khuyên, nêu ý kiến và trình bày lý do.</p>
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

const intro = doc('chs201-0-1-overview', 'Course overview: Chinese Speaking 3|||Tổng quan: Tiếng Trung giao tiếp 3',
  'Nối tiếp CHS121: nhắc nền phát âm/thanh điệu, mục tiêu giao tiếp HSK3, cách luyện các đoạn hội thoại tình huống dài hơn.',
  [[
    `<span class="eyebrow">CHS201 · Lesson 0.1 · Overview</span>
<h2>Chinese Speaking 3 (HSK3)</h2>
<p class="lead">This course <strong>continues CHS121</strong>. There you handled everyday topics one exchange at a time. Here you keep the same speaking habit and take it into <strong>longer situations</strong>: introducing yourself in depth, giving advice, sharing an opinion and a feeling, telling a story in order, complaining politely, booking a trip, sitting a job interview, and comparing two choices.</p>
<h3>What CHS121 gave you (the base)</h3>
<ul>
<li><strong>Sound first</strong> — the 4 tones plus the neutral tone; a wrong tone is a wrong word, so keep shadowing native audio.</li>
<li><strong>Fixed phrases</strong> — spoken Chinese runs on set patterns (我觉得… , 应该… , 因为…所以…). Learn the whole phrase, use it as one block.</li>
</ul>
<h3>How each lesson works</h3>
<p>Every lesson gives you a <strong>spoken vocabulary &amp; phrase table</strong> (汉字 | pinyin | nghĩa), the <strong>key communication patterns</strong> to memorise, a <strong>real dialogue</strong> (3 to 4 turns) to shadow and role-play, and <strong>pronunciation / intonation notes</strong>. Then a short quiz. Always follow the 4 steps: listen → imitate → pair-drill → apply.</p>
<h3>Roadmap</h3>
<p>Yourself &amp; your studies → health &amp; advice → opinions &amp; feelings → narrating events → restaurant complaints → travel &amp; booking → work &amp; interviews → comparing &amp; choosing.</p>`,
    `<span class="eyebrow">CHS201 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung giao tiếp 3 (HSK3)</h2>
<p class="lead">Môn này <strong>nối tiếp CHS121</strong>. Ở đó bạn xử lý chủ đề hằng ngày qua từng lượt trao đổi. Ở đây bạn giữ nguyên thói quen nói và đưa nó vào <strong>tình huống dài hơn</strong>: giới thiệu bản thân sâu hơn, đưa lời khuyên, bày tỏ ý kiến và cảm xúc, kể chuyện theo trình tự, phàn nàn lịch sự, đặt chỗ đi chơi, dự phỏng vấn xin việc, và so sánh hai lựa chọn.</p>
<h3>CHS121 đã cho bạn nền gì</h3>
<ul>
<li><strong>Âm là gốc</strong> — 4 thanh cộng thanh nhẹ; sai thanh là sai từ, nên hãy tiếp tục nói nhại theo audio bản ngữ.</li>
<li><strong>Câu cố định</strong> — khẩu ngữ tiếng Trung chạy bằng các mẫu có sẵn (我觉得… , 应该… , 因为…所以…). Hãy học cả cụm, dùng như một khối.</li>
</ul>
<h3>Mỗi bài học ra sao</h3>
<p>Mỗi bài có <strong>bảng từ vựng &amp; mẫu câu khẩu ngữ</strong> (汉字 | pinyin | nghĩa), các <strong>mẫu câu giao tiếp trọng tâm</strong> để thuộc, một <strong>hội thoại thực tế</strong> (3 đến 4 lượt) để nói nhại &amp; đóng vai, và <strong>ghi chú phát âm / ngữ điệu</strong>. Sau đó là quiz ngắn. Luôn theo 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.</p>
<h3>Lộ trình</h3>
<p>Bản thân &amp; học tập → sức khoẻ &amp; lời khuyên → ý kiến &amp; cảm xúc → kể lại sự việc → phàn nàn ở nhà hàng → du lịch &amp; đặt chỗ → công việc &amp; phỏng vấn → so sánh &amp; lựa chọn.</p>`,
  ]]);

const b1 = doc('chs201-1-1-about-yourself', 'Lesson 1 — Yourself & your studies|||Bài 1 — Kể về bản thân & học tập',
  'Mẫu câu: 自我介绍一下, 我的专业是…, 我学中文已经…年了, 因为…所以…; từ 专业/经历/兴趣/提高; luyện giới thiệu bản thân sâu hơn.',
  [[
    `<span class="eyebrow">CHS201 · Lesson 1 · Yourself</span>
<h2>Yourself &amp; your studies</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>自我介绍</td><td>zìwǒ jièshào</td><td>self-introduction</td></tr>
<tr><td>专业</td><td>zhuānyè</td><td>major, field of study</td></tr>
<tr><td>学习</td><td>xuéxí</td><td>to study, learning</td></tr>
<tr><td>经历</td><td>jīnglì</td><td>experience</td></tr>
<tr><td>为什么</td><td>wèishénme</td><td>why</td></tr>
<tr><td>因为</td><td>yīnwèi</td><td>because</td></tr>
<tr><td>所以</td><td>suǒyǐ</td><td>so, therefore</td></tr>
<tr><td>兴趣</td><td>xìngqù</td><td>interest</td></tr>
<tr><td>已经</td><td>yǐjīng</td><td>already</td></tr>
<tr><td>提高</td><td>tígāo</td><td>to improve, raise</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我先自我介绍一下</strong> wǒ xiān zìwǒ jièshào yíxià — let me introduce myself first.</li>
<li><strong>我的专业是…</strong> wǒ de zhuānyè shì… — my major is …</li>
<li><strong>我学中文已经…年了</strong> — I have been studying Chinese for … years.</li>
<li><strong>因为…，所以…</strong> yīnwèi…, suǒyǐ… — because …, therefore … : states a reason.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你好，请你自我介绍一下。 Nǐ hǎo, qǐng nǐ zìwǒ jièshào yíxià. (Hello, please introduce yourself.)
B: 好的。我叫小明，我的专业是国际贸易。 Hǎo de. Wǒ jiào Xiǎo Míng, wǒ de zhuānyè shì guójì màoyì. (Sure. My name is Xiao Ming, my major is international trade.)
A: 你学中文多长时间了？ Nǐ xué Zhōngwén duō cháng shíjiān le? (How long have you studied Chinese?)
B: 已经两年了。我学中文是因为对中国文化很有兴趣。 Yǐjīng liǎng nián le. Wǒ xué Zhōngwén shì yīnwèi duì Zhōngguó wénhuà hěn yǒu xìngqù. (Two years already. I study Chinese because I am very interested in Chinese culture.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 一下 (yíxià) softens a request — say it light after the verb: 介绍一下. The frame 因为…所以… puts the reason first and the result second; pause a beat before 所以.</div>`,
    `<span class="eyebrow">CHS201 · Bài 1 · Bản thân</span>
<h2>Kể về bản thân &amp; học tập</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>自我介绍</td><td>zìwǒ jièshào</td><td>tự giới thiệu</td></tr>
<tr><td>专业</td><td>zhuānyè</td><td>chuyên ngành</td></tr>
<tr><td>学习</td><td>xuéxí</td><td>học tập</td></tr>
<tr><td>经历</td><td>jīnglì</td><td>trải nghiệm, kinh nghiệm</td></tr>
<tr><td>为什么</td><td>wèishénme</td><td>tại sao</td></tr>
<tr><td>因为</td><td>yīnwèi</td><td>bởi vì</td></tr>
<tr><td>所以</td><td>suǒyǐ</td><td>cho nên</td></tr>
<tr><td>兴趣</td><td>xìngqù</td><td>hứng thú, sở thích</td></tr>
<tr><td>已经</td><td>yǐjīng</td><td>đã … rồi</td></tr>
<tr><td>提高</td><td>tígāo</td><td>nâng cao</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我先自我介绍一下</strong> wǒ xiān zìwǒ jièshào yíxià — để tôi tự giới thiệu trước.</li>
<li><strong>我的专业是…</strong> wǒ de zhuānyè shì… — chuyên ngành của tôi là …</li>
<li><strong>我学中文已经…年了</strong> — tôi học tiếng Trung đã … năm rồi.</li>
<li><strong>因为…，所以…</strong> yīnwèi…, suǒyǐ… — bởi vì …, cho nên … : dùng để nêu lý do.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你好，请你自我介绍一下。 Nǐ hǎo, qǐng nǐ zìwǒ jièshào yíxià. (Chào bạn, mời bạn tự giới thiệu.)
B: 好的。我叫小明，我的专业是国际贸易。 Hǎo de. Wǒ jiào Xiǎo Míng, wǒ de zhuānyè shì guójì màoyì. (Vâng. Tôi tên Tiểu Minh, chuyên ngành của tôi là thương mại quốc tế.)
A: 你学中文多长时间了？ Nǐ xué Zhōngwén duō cháng shíjiān le? (Bạn học tiếng Trung bao lâu rồi?)
B: 已经两年了。我学中文是因为对中国文化很有兴趣。 Yǐjīng liǎng nián le. Wǒ xué Zhōngwén shì yīnwèi duì Zhōngguó wénhuà hěn yǒu xìngqù. (Đã hai năm rồi. Tôi học tiếng Trung vì rất thích văn hoá Trung Quốc.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 一下 (yíxià) làm lời đề nghị dịu đi — đọc nhẹ sau động từ: 介绍一下. Khung 因为…所以… đặt lý do trước, kết quả sau; ngắt một nhịp trước 所以.</div>`,
  ]]);

const b1q = quiz('chs201-quiz-1', 'Quiz 1 — Yourself & your studies|||Quiz 1 — Bản thân & học tập', [
  { id: 'q1', question: 'Mời ai đó "tự giới thiệu một chút" đúng là? / How do you ask someone to introduce themselves?', options: ['请你自我介绍一下', '多少钱？', '你打错了', '再见'], correctIndex: 0, explanation: '自我介绍 (tự giới thiệu) + 一下 (một chút) → 请你自我介绍一下.' },
  { id: 'q2', question: '"我的专业是国际贸易" nghĩa là gì? / What does 我的专业是国际贸易 mean?', options: ['Chuyên ngành của tôi là thương mại quốc tế|||My major is international trade', 'Tôi bị cảm|||I have a cold', 'Tôi muốn thuê nhà|||I want to rent', 'Tôi đến muộn|||I am late'], correctIndex: 0, explanation: '专业 (chuyên ngành) + 国际贸易 (thương mại quốc tế).' },
  { id: 'q3', question: 'Cặp từ nào nêu "bởi vì … cho nên …"? / Which pair means because … therefore …?', options: ['因为…所以…', '先…然后…', '还是…吗', '有没有'], correctIndex: 0, explanation: '因为 (bởi vì) … 所以 (cho nên) … — khung nêu lý do và kết quả.' },
]);

const b2 = doc('chs201-2-1-health-advice', 'Lesson 2 — Health & giving advice|||Bài 2 — Sức khoẻ & lời khuyên',
  'Mẫu câu: 我身体不舒服, 你应该…, 你最好…, 我建议你…; từ 肚子疼/头疼/看医生/注意; luyện đưa lời khuyên.',
  [[
    `<span class="eyebrow">CHS201 · Lesson 2 · Health &amp; advice</span>
<h2>Health &amp; giving advice</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>不舒服</td><td>bù shūfu</td><td>unwell, uncomfortable</td></tr>
<tr><td>肚子疼</td><td>dùzi téng</td><td>stomachache</td></tr>
<tr><td>头疼</td><td>tóu téng</td><td>headache</td></tr>
<tr><td>应该</td><td>yīnggāi</td><td>should, ought to</td></tr>
<tr><td>最好</td><td>zuìhǎo</td><td>had better</td></tr>
<tr><td>建议</td><td>jiànyì</td><td>to suggest, a suggestion</td></tr>
<tr><td>看医生</td><td>kàn yīshēng</td><td>to see a doctor</td></tr>
<tr><td>吃药</td><td>chī yào</td><td>to take medicine</td></tr>
<tr><td>注意</td><td>zhùyì</td><td>to take care, pay attention</td></tr>
<tr><td>休息</td><td>xiūxi</td><td>to rest</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我身体不舒服</strong> wǒ shēntǐ bù shūfu — I do not feel well.</li>
<li><strong>你应该…</strong> nǐ yīnggāi… — you should … (a firm suggestion).</li>
<li><strong>你最好…</strong> nǐ zuìhǎo… — you had better … (a bit softer).</li>
<li><strong>我建议你…</strong> wǒ jiànyì nǐ… — I suggest you … (the gentlest).</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 我肚子疼，很不舒服。 Wǒ dùzi téng, hěn bù shūfu. (I have a stomachache, I feel unwell.)
B: 你应该去看医生。   Nǐ yīnggāi qù kàn yīshēng. (You should see a doctor.)
A: 需要吃药吗？       Xūyào chī yào ma? (Do I need to take medicine?)
B: 我建议你先休息，别吃太凉的东西，最好多喝热水。 Wǒ jiànyì nǐ xiān xiūxi, bié chī tài liáng de dōngxi, zuìhǎo duō hē rè shuǐ. (I suggest you rest first, do not eat cold things, and had better drink more hot water.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> Three ways to advise, from firm to gentle: 应该 → 最好 → 建议. 疼 (téng) is 2nd tone; keep it rising in 肚子疼 and 头疼.</div>`,
    `<span class="eyebrow">CHS201 · Bài 2 · Sức khoẻ &amp; lời khuyên</span>
<h2>Sức khoẻ &amp; lời khuyên</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>不舒服</td><td>bù shūfu</td><td>không khoẻ, khó chịu</td></tr>
<tr><td>肚子疼</td><td>dùzi téng</td><td>đau bụng</td></tr>
<tr><td>头疼</td><td>tóu téng</td><td>đau đầu</td></tr>
<tr><td>应该</td><td>yīnggāi</td><td>nên</td></tr>
<tr><td>最好</td><td>zuìhǎo</td><td>tốt nhất là</td></tr>
<tr><td>建议</td><td>jiànyì</td><td>đề nghị, lời khuyên</td></tr>
<tr><td>看医生</td><td>kàn yīshēng</td><td>khám bác sĩ</td></tr>
<tr><td>吃药</td><td>chī yào</td><td>uống thuốc</td></tr>
<tr><td>注意</td><td>zhùyì</td><td>chú ý, giữ gìn</td></tr>
<tr><td>休息</td><td>xiūxi</td><td>nghỉ ngơi</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我身体不舒服</strong> wǒ shēntǐ bù shūfu — tôi thấy không khoẻ.</li>
<li><strong>你应该…</strong> nǐ yīnggāi… — bạn nên … (lời khuyên chắc chắn).</li>
<li><strong>你最好…</strong> nǐ zuìhǎo… — bạn tốt nhất là … (nhẹ hơn một chút).</li>
<li><strong>我建议你…</strong> wǒ jiànyì nǐ… — tôi khuyên bạn … (nhẹ nhàng nhất).</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 我肚子疼，很不舒服。 Wǒ dùzi téng, hěn bù shūfu. (Tôi đau bụng, rất khó chịu.)
B: 你应该去看医生。   Nǐ yīnggāi qù kàn yīshēng. (Bạn nên đi khám bác sĩ.)
A: 需要吃药吗？       Xūyào chī yào ma? (Có cần uống thuốc không?)
B: 我建议你先休息，别吃太凉的东西，最好多喝热水。 Wǒ jiànyì nǐ xiān xiūxi, bié chī tài liáng de dōngxi, zuìhǎo duō hē rè shuǐ. (Tôi khuyên bạn nghỉ trước đã, đừng ăn đồ lạnh, tốt nhất là uống nhiều nước ấm.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> Ba cách khuyên, từ chắc đến nhẹ: 应该 → 最好 → 建议. 疼 (téng) là thanh 2; giữ giọng lên trong 肚子疼 và 头疼.</div>`,
  ]]);

const b2q = quiz('chs201-quiz-2', 'Quiz 2 — Health & advice|||Quiz 2 — Sức khoẻ & lời khuyên', [
  { id: 'q1', question: '"你应该去看医生" nghĩa là gì? / What does 你应该去看医生 mean?', options: ['Bạn nên đi khám bác sĩ|||You should see a doctor', 'Bạn gọi nhầm số|||Wrong number', 'Bạn đến muộn|||You are late', 'Bạn về nhà|||Go home'], correctIndex: 0, explanation: '应该 (nên) + 去看医生 (đi khám bác sĩ).' },
  { id: 'q2', question: 'Cách khuyên nhẹ nhàng nhất trong ba cách dưới đây? / Which is the gentlest way to advise?', options: ['我建议你…', '你必须…', '你应该…', '你最好…'], correctIndex: 0, explanation: '建议 (đề nghị) nhẹ nhàng nhất; 应该 và 最好 chắc/mạnh hơn.' },
  { id: 'q3', question: '"最好" (zuìhǎo) đứng trước lời khuyên nghĩa là? / What does 最好 add to advice?', options: ['tốt nhất là…|||had better…', 'quá đắt|||too expensive', 'khi nào|||when', 'ở đâu|||where'], correctIndex: 0, explanation: '最好 = tốt nhất là: 最好多喝热水 (tốt nhất là uống nhiều nước ấm).' },
]);

const b3 = doc('chs201-3-1-opinions-feelings', 'Lesson 3 — Opinions & feelings|||Bài 3 — Bày tỏ ý kiến & cảm xúc',
  'Mẫu câu: 我觉得…, 我认为…, 我同意/不同意, 你说得对; từ 意见/高兴/生气/担心/其实; luyện nêu ý kiến và cảm xúc.',
  [[
    `<span class="eyebrow">CHS201 · Lesson 3 · Opinions</span>
<h2>Opinions &amp; feelings</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>觉得</td><td>juéde</td><td>to feel, to think</td></tr>
<tr><td>认为</td><td>rènwéi</td><td>to think, to believe</td></tr>
<tr><td>同意</td><td>tóngyì</td><td>to agree</td></tr>
<tr><td>不同意</td><td>bù tóngyì</td><td>to disagree</td></tr>
<tr><td>意见</td><td>yìjiàn</td><td>opinion, view</td></tr>
<tr><td>高兴</td><td>gāoxìng</td><td>happy, glad</td></tr>
<tr><td>生气</td><td>shēngqì</td><td>angry</td></tr>
<tr><td>担心</td><td>dānxīn</td><td>worried</td></tr>
<tr><td>也许</td><td>yěxǔ</td><td>maybe, perhaps</td></tr>
<tr><td>其实</td><td>qíshí</td><td>actually, in fact</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我觉得… / 我认为…</strong> — I feel … / I think … (认为 is a bit more considered).</li>
<li><strong>我同意你的意见</strong> wǒ tóngyì nǐ de yìjiàn — I agree with your opinion.</li>
<li><strong>我不太同意</strong> wǒ bú tài tóngyì — I do not quite agree.</li>
<li><strong>你说得对</strong> nǐ shuō de duì — you are right.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你觉得这部电影怎么样？ Nǐ juéde zhè bù diànyǐng zěnmeyàng? (What do you think of this movie?)
B: 我认为很好看，故事很有意思。 Wǒ rènwéi hěn hǎokàn, gùshi hěn yǒu yìsi. (I think it is very good, the story is interesting.)
A: 其实我不太同意，我觉得有点儿长。 Qíshí wǒ bú tài tóngyì, wǒ juéde yǒudiǎnr cháng. (Actually I do not quite agree, I feel it is a bit long.)
B: 也许吧，不过我很喜欢。 Yěxǔ ba, búguò wǒ hěn xǐhuan. (Maybe, but I really like it.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 觉得 (jué·de) ends in a neutral 得. To disagree softly, say 不太同意 rather than a flat 不同意 — 不太 (not quite) keeps it polite.</div>`,
    `<span class="eyebrow">CHS201 · Bài 3 · Ý kiến</span>
<h2>Bày tỏ ý kiến &amp; cảm xúc</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>觉得</td><td>juéde</td><td>cảm thấy, thấy</td></tr>
<tr><td>认为</td><td>rènwéi</td><td>cho rằng</td></tr>
<tr><td>同意</td><td>tóngyì</td><td>đồng ý</td></tr>
<tr><td>不同意</td><td>bù tóngyì</td><td>không đồng ý</td></tr>
<tr><td>意见</td><td>yìjiàn</td><td>ý kiến</td></tr>
<tr><td>高兴</td><td>gāoxìng</td><td>vui</td></tr>
<tr><td>生气</td><td>shēngqì</td><td>tức giận</td></tr>
<tr><td>担心</td><td>dānxīn</td><td>lo lắng</td></tr>
<tr><td>也许</td><td>yěxǔ</td><td>có lẽ</td></tr>
<tr><td>其实</td><td>qíshí</td><td>thật ra</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我觉得… / 我认为…</strong> — tôi thấy … / tôi cho rằng … (认为 nghe cân nhắc hơn).</li>
<li><strong>我同意你的意见</strong> wǒ tóngyì nǐ de yìjiàn — tôi đồng ý với ý kiến của bạn.</li>
<li><strong>我不太同意</strong> wǒ bú tài tóngyì — tôi không đồng ý lắm.</li>
<li><strong>你说得对</strong> nǐ shuō de duì — bạn nói đúng.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你觉得这部电影怎么样？ Nǐ juéde zhè bù diànyǐng zěnmeyàng? (Bạn thấy bộ phim này thế nào?)
B: 我认为很好看，故事很有意思。 Wǒ rènwéi hěn hǎokàn, gùshi hěn yǒu yìsi. (Tôi cho rằng rất hay, câu chuyện thú vị.)
A: 其实我不太同意，我觉得有点儿长。 Qíshí wǒ bú tài tóngyì, wǒ juéde yǒudiǎnr cháng. (Thật ra tôi không đồng ý lắm, tôi thấy hơi dài.)
B: 也许吧，不过我很喜欢。 Yěxǔ ba, búguò wǒ hěn xǐhuan. (Có lẽ vậy, nhưng tôi rất thích.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 觉得 (jué·de) kết bằng 得 thanh nhẹ. Muốn phản đối nhẹ nhàng, nói 不太同意 thay vì 不同意 gọn lỏn — 不太 (không lắm) giữ phép lịch sự.</div>`,
  ]]);

const b3q = quiz('chs201-quiz-3', 'Quiz 3 — Opinions & feelings|||Quiz 3 — Ý kiến & cảm xúc', [
  { id: 'q1', question: 'Hỏi "bạn thấy … thế nào?" dùng động từ nào? / Which verb asks for someone opinion?', options: ['觉得 juéde', '迟到 chídào', '投诉 tóusù', '出发 chūfā'], correctIndex: 0, explanation: '你觉得…怎么样? = bạn thấy … thế nào? 觉得 = cảm thấy, thấy.' },
  { id: 'q2', question: '"我不太同意" nghĩa là gì? / What does 我不太同意 mean?', options: ['Tôi không đồng ý lắm|||I do not quite agree', 'Tôi rất vui|||I am very happy', 'Tôi lo lắng|||I am worried', 'Tôi đồng ý hoàn toàn|||I fully agree'], correctIndex: 0, explanation: '不太 (không lắm) + 同意 (đồng ý) = không đồng ý lắm — cách phản đối lịch sự.' },
  { id: 'q3', question: '"你说得对" nghĩa là gì? / What does 你说得对 mean?', options: ['Bạn nói đúng|||You are right', 'Bạn nói sai|||You are wrong', 'Bạn tức giận|||You are angry', 'Bạn bận|||You are busy'], correctIndex: 0, explanation: '说得对 = nói đúng; 得 ở đây là trợ từ, đọc nhẹ (shuō·de duì).' },
]);

const b4 = doc('chs201-4-1-narrating-events', 'Lesson 4 — Narrating events in order|||Bài 4 — Kể lại sự việc',
  'Mẫu câu: 先…接着…后来…结果, 一…就…, 后来发生了什么; từ 突然/迟到/忘了/终于; luyện kể lại một chuyện theo trình tự.',
  [[
    `<span class="eyebrow">CHS201 · Lesson 4 · Narrating</span>
<h2>Narrating events in order</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>先</td><td>xiān</td><td>first</td></tr>
<tr><td>接着</td><td>jiēzhe</td><td>next, right after</td></tr>
<tr><td>后来</td><td>hòulái</td><td>later, afterwards</td></tr>
<tr><td>结果</td><td>jiéguǒ</td><td>as a result, in the end</td></tr>
<tr><td>发生</td><td>fāshēng</td><td>to happen</td></tr>
<tr><td>突然</td><td>tūrán</td><td>suddenly</td></tr>
<tr><td>迟到</td><td>chídào</td><td>to be late</td></tr>
<tr><td>忘了</td><td>wàng le</td><td>forgot</td></tr>
<tr><td>终于</td><td>zhōngyú</td><td>finally, at last</td></tr>
<tr><td>别提了</td><td>bié tí le</td><td>do not even ask</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>先…，接着…，后来…，结果…</strong> — first …, next …, later …, in the end … : the frame for a story.</li>
<li><strong>我一…就…</strong> wǒ yī … jiù … — as soon as I …, I … : 我一下车就跑.</li>
<li><strong>后来发生了什么?</strong> hòulái fāshēngle shénme? — what happened after that?</li>
<li><strong>终于…了</strong> — finally … happened.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 昨天你怎么迟到了？ Zuótiān nǐ zěnme chídào le? (Why were you late yesterday?)
B: 别提了。我先坐错了车，接着又忘了带手机。 Bié tí le. Wǒ xiān zuò cuò le chē, jiēzhe yòu wàng le dài shǒujī. (Do not even ask. First I took the wrong bus, next I forgot my phone.)
A: 后来呢？ Hòulái ne? (And then?)
B: 后来我一下车就跑，结果还是迟到了十分钟。 Hòulái wǒ yí xià chē jiù pǎo, jiéguǒ háishi chídào le shí fēnzhōng. (Later, as soon as I got off I ran, but in the end I was still ten minutes late.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 先…接着…后来…结果 orders a story and builds to the ending — pause a beat at each marker. 一…就… links two quick actions: keep 一 and 就 short and close together.</div>`,
    `<span class="eyebrow">CHS201 · Bài 4 · Kể chuyện</span>
<h2>Kể lại sự việc</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>先</td><td>xiān</td><td>đầu tiên, trước</td></tr>
<tr><td>接着</td><td>jiēzhe</td><td>tiếp đó</td></tr>
<tr><td>后来</td><td>hòulái</td><td>về sau, sau đó</td></tr>
<tr><td>结果</td><td>jiéguǒ</td><td>kết quả là, cuối cùng</td></tr>
<tr><td>发生</td><td>fāshēng</td><td>xảy ra</td></tr>
<tr><td>突然</td><td>tūrán</td><td>đột nhiên</td></tr>
<tr><td>迟到</td><td>chídào</td><td>đến muộn</td></tr>
<tr><td>忘了</td><td>wàng le</td><td>quên mất</td></tr>
<tr><td>终于</td><td>zhōngyú</td><td>cuối cùng thì</td></tr>
<tr><td>别提了</td><td>bié tí le</td><td>đừng nhắc nữa</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>先…，接着…，后来…，结果…</strong> — đầu tiên …, tiếp đó …, về sau …, cuối cùng … : khung để kể chuyện.</li>
<li><strong>我一…就…</strong> wǒ yī … jiù … — tôi vừa … thì … : 我一下车就跑.</li>
<li><strong>后来发生了什么?</strong> hòulái fāshēngle shénme? — sau đó xảy ra chuyện gì?</li>
<li><strong>终于…了</strong> — cuối cùng thì … đã xảy ra.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 昨天你怎么迟到了？ Zuótiān nǐ zěnme chídào le? (Hôm qua sao bạn đến muộn?)
B: 别提了。我先坐错了车，接着又忘了带手机。 Bié tí le. Wǒ xiān zuò cuò le chē, jiēzhe yòu wàng le dài shǒujī. (Đừng nhắc nữa. Đầu tiên tôi đi nhầm xe, tiếp đó lại quên mang điện thoại.)
A: 后来呢？ Hòulái ne? (Rồi sao nữa?)
B: 后来我一下车就跑，结果还是迟到了十分钟。 Hòulái wǒ yí xià chē jiù pǎo, jiéguǒ háishi chídào le shí fēnzhōng. (Về sau tôi vừa xuống xe là chạy ngay, cuối cùng vẫn muộn mười phút.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 先…接着…后来…结果 xếp câu chuyện và dẫn tới kết thúc — ngắt một nhịp ở mỗi mốc. 一…就… nối hai hành động nhanh: giữ 一 và 就 ngắn và sát nhau.</div>`,
  ]]);

const b4q = quiz('chs201-quiz-4', 'Quiz 4 — Narrating events|||Quiz 4 — Kể lại sự việc', [
  { id: 'q1', question: 'Bộ từ nào kể "đầu tiên… tiếp đó… về sau… cuối cùng"? / Which set orders a story?', options: ['先…接着…后来…结果', '因为…所以…', '还是…吗', '有没有'], correctIndex: 0, explanation: '先 (đầu tiên) … 接着 (tiếp đó) … 后来 (về sau) … 结果 (cuối cùng) — khung kể chuyện.' },
  { id: 'q2', question: 'Cấu trúc "一…就…" diễn tả điều gì? / What does 一…就… express?', options: ['Vừa … thì … (ngay lập tức)|||As soon as …, then …', 'Nếu … thì không|||If … not', 'Càng … càng ít|||The more … the less', 'Chưa … đã xong|||Not yet … done'], correctIndex: 0, explanation: '一 A 就 B = vừa A thì B ngay: 一下车就跑 (vừa xuống xe là chạy).' },
  { id: 'q3', question: '"结果还是迟到了" nghĩa là gì? / What does 结果还是迟到了 mean?', options: ['Cuối cùng vẫn đến muộn|||In the end still late', 'Cuối cùng đến sớm|||Ended up early', 'Không đi nữa|||Did not go', 'Đi nhầm đường|||Wrong way'], correctIndex: 0, explanation: '结果 (kết quả là) + 还是 (vẫn) + 迟到了 (đến muộn rồi).' },
]);

const b5 = doc('chs201-5-1-restaurant-complaints', 'Lesson 5 — Restaurant & complaining|||Bài 5 — Nhà hàng & phàn nàn',
  'Mẫu câu: 你们上错菜了, 太咸了能不能换, 菜凉了请重新做, 我要投诉; từ 太淡了/不新鲜/服务/退; luyện phàn nàn lịch sự.',
  [[
    `<span class="eyebrow">CHS201 · Lesson 5 · Complaining</span>
<h2>Restaurant &amp; complaining</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>点菜</td><td>diǎn cài</td><td>to order dishes</td></tr>
<tr><td>上错菜</td><td>shàng cuò cài</td><td>to bring the wrong dish</td></tr>
<tr><td>太咸了</td><td>tài xián le</td><td>too salty</td></tr>
<tr><td>太淡了</td><td>tài dàn le</td><td>too bland</td></tr>
<tr><td>凉了</td><td>liáng le</td><td>has gone cold</td></tr>
<tr><td>换</td><td>huàn</td><td>to change, to swap</td></tr>
<tr><td>不新鲜</td><td>bù xīnxiān</td><td>not fresh</td></tr>
<tr><td>服务</td><td>fúwù</td><td>service</td></tr>
<tr><td>投诉</td><td>tóusù</td><td>to make a complaint</td></tr>
<tr><td>重新做</td><td>chóngxīn zuò</td><td>to remake</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>你们上错菜了</strong> nǐmen shàng cuò cài le — you brought the wrong dish.</li>
<li><strong>这个太咸了，能不能换一个?</strong> — this is too salty, can you change it?</li>
<li><strong>菜凉了，请重新做</strong> — the food is cold, please remake it.</li>
<li><strong>我要投诉</strong> wǒ yào tóusù — I want to make a complaint (the strong last step).</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>顾客: 服务员，你们上错菜了，我点的是牛肉。 Fúwùyuán, nǐmen shàng cuò cài le, wǒ diǎn de shì niúròu. (Waiter, you brought the wrong dish, I ordered beef.)
服务员: 非常抱歉，我马上给您换。 Fēicháng bàoqiàn, wǒ mǎshàng gěi nín huàn. (I am very sorry, I will change it right away.)
顾客: 还有这个汤太咸了，也凉了。 Hái yǒu zhège tāng tài xián le, yě liáng le. (Also this soup is too salty, and it is cold.)
服务员: 对不起，我重新给您做一份。 Duìbuqǐ, wǒ chóngxīn gěi nín zuò yí fèn. (Sorry, I will make a fresh one for you.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 太…了 frames a complaint: 太咸了, 太淡了, 太凉了 — stress the adjective in the middle. 换 = swap the dish; 退 = get your money back. Soften with 能不能… and 请….</div>`,
    `<span class="eyebrow">CHS201 · Bài 5 · Phàn nàn</span>
<h2>Nhà hàng &amp; phàn nàn</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>点菜</td><td>diǎn cài</td><td>gọi món</td></tr>
<tr><td>上错菜</td><td>shàng cuò cài</td><td>bưng nhầm món</td></tr>
<tr><td>太咸了</td><td>tài xián le</td><td>mặn quá</td></tr>
<tr><td>太淡了</td><td>tài dàn le</td><td>nhạt quá</td></tr>
<tr><td>凉了</td><td>liáng le</td><td>nguội rồi</td></tr>
<tr><td>换</td><td>huàn</td><td>đổi</td></tr>
<tr><td>不新鲜</td><td>bù xīnxiān</td><td>không tươi</td></tr>
<tr><td>服务</td><td>fúwù</td><td>dịch vụ, phục vụ</td></tr>
<tr><td>投诉</td><td>tóusù</td><td>khiếu nại, phàn nàn</td></tr>
<tr><td>重新做</td><td>chóngxīn zuò</td><td>làm lại</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>你们上错菜了</strong> nǐmen shàng cuò cài le — các bạn bưng nhầm món rồi.</li>
<li><strong>这个太咸了，能不能换一个?</strong> — món này mặn quá, đổi món khác được không?</li>
<li><strong>菜凉了，请重新做</strong> — món nguội rồi, làm ơn làm lại.</li>
<li><strong>我要投诉</strong> wǒ yào tóusù — tôi muốn khiếu nại (bước mạnh cuối cùng).</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>顾客: 服务员，你们上错菜了，我点的是牛肉。 Fúwùyuán, nǐmen shàng cuò cài le, wǒ diǎn de shì niúròu. (Phục vụ ơi, các bạn bưng nhầm món rồi, tôi gọi thịt bò.)
服务员: 非常抱歉，我马上给您换。 Fēicháng bàoqiàn, wǒ mǎshàng gěi nín huàn. (Rất xin lỗi, tôi đổi ngay cho anh/chị.)
顾客: 还有这个汤太咸了，也凉了。 Hái yǒu zhège tāng tài xián le, yě liáng le. (Còn nữa, canh này mặn quá, lại còn nguội.)
服务员: 对不起，我重新给您做一份。 Duìbuqǐ, wǒ chóngxīn gěi nín zuò yí fèn. (Xin lỗi, tôi làm lại một phần mới cho anh/chị.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 太…了 tạo khung phàn nàn: 太咸了, 太淡了, 太凉了 — nhấn vào tính từ ở giữa. 换 = đổi món; 退 = lấy lại tiền. Làm dịu bằng 能不能… và 请….</div>`,
  ]]);

const b5q = quiz('chs201-quiz-5', 'Quiz 5 — Restaurant & complaining|||Quiz 5 — Nhà hàng & phàn nàn', [
  { id: 'q1', question: '"你们上错菜了" nghĩa là gì? / What does 你们上错菜了 mean?', options: ['Các bạn bưng nhầm món rồi|||You brought the wrong dish', 'Món này rất ngon|||This is tasty', 'Cho tính tiền|||The bill please', 'Thêm một bát cơm|||One more rice'], correctIndex: 0, explanation: '上错菜 (bưng nhầm món) + 了 = các bạn bưng nhầm món rồi.' },
  { id: 'q2', question: 'Nói "món này mặn quá, đổi được không?" dùng cụm nào? / How do you say it is too salty and ask to change it?', options: ['太咸了，能不能换一个？', '多少钱？', '你好吗？', '怎么走？'], correctIndex: 0, explanation: '太咸了 (mặn quá) + 能不能换一个 (đổi món khác được không).' },
  { id: 'q3', question: '"我要投诉" nghĩa là gì? / What does 我要投诉 mean?', options: ['Tôi muốn khiếu nại|||I want to complain', 'Tôi muốn gọi món|||I want to order', 'Tôi rất no|||I am full', 'Tôi trả tiền|||I pay'], correctIndex: 0, explanation: '投诉 tóusù = khiếu nại, phàn nàn chính thức.' },
]);

const b6 = doc('chs201-6-1-travel-booking', 'Lesson 6 — Travel & booking|||Bài 6 — Du lịch & đặt chỗ',
  'Mẫu câu: 我想订…票, 订一个双人间, 你能推荐景点吗, 行程几天; từ 单程/来回/出发/预订; luyện đặt vé, đặt phòng.',
  [[
    `<span class="eyebrow">CHS201 · Lesson 6 · Travel</span>
<h2>Travel &amp; booking</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>订票</td><td>dìng piào</td><td>to book a ticket</td></tr>
<tr><td>订房间</td><td>dìng fángjiān</td><td>to book a room</td></tr>
<tr><td>行程</td><td>xíngchéng</td><td>itinerary</td></tr>
<tr><td>景点</td><td>jǐngdiǎn</td><td>scenic spot</td></tr>
<tr><td>推荐</td><td>tuījiàn</td><td>to recommend</td></tr>
<tr><td>单人间</td><td>dānrénjiān</td><td>single room</td></tr>
<tr><td>双人间</td><td>shuāngrénjiān</td><td>double room</td></tr>
<tr><td>单程</td><td>dānchéng</td><td>one-way</td></tr>
<tr><td>来回</td><td>láihuí</td><td>round trip</td></tr>
<tr><td>出发</td><td>chūfā</td><td>to set off, depart</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我想订一张去…的票</strong> — I want to book a ticket to …</li>
<li><strong>我要订一个双人间</strong> — I want to book a double room.</li>
<li><strong>你能推荐几个景点吗?</strong> — can you recommend some scenic spots?</li>
<li><strong>行程大概几天?</strong> xíngchéng dàgài jǐ tiān? — about how many days is the itinerary?</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你好，我想订两张去上海的火车票。 Nǐ hǎo, wǒ xiǎng dìng liǎng zhāng qù Shànghǎi de huǒchēpiào. (Hello, I want to book two train tickets to Shanghai.)
B: 单程还是来回？ Dānchéng háishi láihuí? (One-way or round-trip?)
A: 来回。到了以后，你能推荐几个景点吗？ Láihuí. Dàole yǐhòu, nǐ néng tuījiàn jǐ ge jǐngdiǎn ma? (Round-trip. After arriving, can you recommend some scenic spots?)
B: 当然可以，我建议你去外滩，还可以订一个江边的房间。 Dāngrán kěyǐ, wǒ jiànyì nǐ qù Wàitān, hái kěyǐ dìng yí ge jiāngbiān de fángjiān. (Of course, I suggest the Bund, and you can book a room by the river.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 订 (dìng, 4th tone) is the key verb for tickets and rooms — say it short and falling. 单程 (one-way) contrasts with 来回 (round trip): the choice comes with 还是.</div>`,
    `<span class="eyebrow">CHS201 · Bài 6 · Du lịch</span>
<h2>Du lịch &amp; đặt chỗ</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>订票</td><td>dìng piào</td><td>đặt vé</td></tr>
<tr><td>订房间</td><td>dìng fángjiān</td><td>đặt phòng</td></tr>
<tr><td>行程</td><td>xíngchéng</td><td>lịch trình</td></tr>
<tr><td>景点</td><td>jǐngdiǎn</td><td>điểm tham quan</td></tr>
<tr><td>推荐</td><td>tuījiàn</td><td>giới thiệu, gợi ý</td></tr>
<tr><td>单人间</td><td>dānrénjiān</td><td>phòng đơn</td></tr>
<tr><td>双人间</td><td>shuāngrénjiān</td><td>phòng đôi</td></tr>
<tr><td>单程</td><td>dānchéng</td><td>một chiều</td></tr>
<tr><td>来回</td><td>láihuí</td><td>khứ hồi</td></tr>
<tr><td>出发</td><td>chūfā</td><td>xuất phát</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我想订一张去…的票</strong> — tôi muốn đặt một vé đi …</li>
<li><strong>我要订一个双人间</strong> — tôi muốn đặt một phòng đôi.</li>
<li><strong>你能推荐几个景点吗?</strong> — bạn gợi ý vài điểm tham quan được không?</li>
<li><strong>行程大概几天?</strong> xíngchéng dàgài jǐ tiān? — lịch trình khoảng mấy ngày?</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你好，我想订两张去上海的火车票。 Nǐ hǎo, wǒ xiǎng dìng liǎng zhāng qù Shànghǎi de huǒchēpiào. (Chào, tôi muốn đặt hai vé tàu đi Thượng Hải.)
B: 单程还是来回？ Dānchéng háishi láihuí? (Một chiều hay khứ hồi?)
A: 来回。到了以后，你能推荐几个景点吗？ Láihuí. Dàole yǐhòu, nǐ néng tuījiàn jǐ ge jǐngdiǎn ma? (Khứ hồi. Đến nơi rồi, bạn gợi ý vài điểm tham quan được không?)
B: 当然可以，我建议你去外滩，还可以订一个江边的房间。 Dāngrán kěyǐ, wǒ jiànyì nǐ qù Wàitān, hái kěyǐ dìng yí ge jiāngbiān de fángjiān. (Tất nhiên, tôi khuyên bạn đi Bến Thượng Hải, còn có thể đặt một phòng ven sông.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 订 (dìng, thanh 4) là động từ chính cho vé và phòng — đọc ngắn và xuống giọng. 单程 (một chiều) đối với 来回 (khứ hồi): lựa chọn đi kèm 还是.</div>`,
  ]]);

const b6q = quiz('chs201-quiz-6', 'Quiz 6 — Travel & booking|||Quiz 6 — Du lịch & đặt chỗ', [
  { id: 'q1', question: 'Động từ "đặt (vé, phòng)" là từ nào? / Which verb means to book (a ticket or room)?', options: ['订 dìng', '换 huàn', '疼 téng', '投诉 tóusù'], correctIndex: 0, explanation: '订 dìng = đặt trước: 订票 (đặt vé), 订房间 (đặt phòng).' },
  { id: 'q2', question: '"单程还是来回?" hỏi điều gì? / What does 单程还是来回 ask?', options: ['Một chiều hay khứ hồi|||One-way or round-trip', 'Sáng hay chiều|||Morning or afternoon', 'To hay nhỏ|||Big or small', 'Đắt hay rẻ|||Cheap or expensive'], correctIndex: 0, explanation: '单程 (một chiều) 还是 来回 (khứ hồi) — hỏi lựa chọn loại vé.' },
  { id: 'q3', question: 'Nhờ ai đó "gợi ý vài điểm tham quan" dùng cụm nào? / How do you ask for scenic-spot recommendations?', options: ['你能推荐几个景点吗？', '你几岁？', '多少钱？', '你打错了'], correctIndex: 0, explanation: '推荐 (gợi ý) + 景点 (điểm tham quan) → 你能推荐几个景点吗?' },
]);

const b7 = doc('chs201-7-1-job-interview', 'Lesson 7 — Work & the job interview|||Bài 7 — Công việc & phỏng vấn',
  'Mẫu câu: 我来应聘…, 我以前负责…, 我的优点是…缺点是…, 对工资的期望; từ 面试/经验/能力/合作; luyện trả lời phỏng vấn.',
  [[
    `<span class="eyebrow">CHS201 · Lesson 7 · Interview</span>
<h2>Work &amp; the job interview</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>面试</td><td>miànshì</td><td>interview</td></tr>
<tr><td>应聘</td><td>yìngpìn</td><td>to apply for a job</td></tr>
<tr><td>工作经验</td><td>gōngzuò jīngyàn</td><td>work experience</td></tr>
<tr><td>负责</td><td>fùzé</td><td>to be in charge of</td></tr>
<tr><td>优点</td><td>yōudiǎn</td><td>strength, merit</td></tr>
<tr><td>缺点</td><td>quēdiǎn</td><td>weakness, shortcoming</td></tr>
<tr><td>能力</td><td>nénglì</td><td>ability</td></tr>
<tr><td>合作</td><td>hézuò</td><td>to cooperate</td></tr>
<tr><td>期望</td><td>qīwàng</td><td>expectation</td></tr>
<tr><td>工资</td><td>gōngzī</td><td>salary</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我来应聘…</strong> wǒ lái yìngpìn… — I am here to apply for …</li>
<li><strong>我以前负责…</strong> wǒ yǐqián fùzé… — I used to be in charge of …</li>
<li><strong>我的优点是…，缺点是…</strong> — my strength is …, my weakness is …</li>
<li><strong>你对工资有什么期望?</strong> — what are your salary expectations?</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>面试官: 请介绍一下你的工作经验。 Qǐng jièshào yíxià nǐ de gōngzuò jīngyàn. (Please introduce your work experience.)
应聘者: 我以前在一家公司负责市场工作，做了三年。 Wǒ yǐqián zài yì jiā gōngsī fùzé shìchǎng gōngzuò, zuò le sān nián. (I was in charge of marketing at a company for three years.)
面试官: 你觉得自己的优点和缺点是什么？ Nǐ juéde zìjǐ de yōudiǎn hé quēdiǎn shì shénme? (What do you think your strengths and weaknesses are?)
应聘者: 我的优点是认真、能跟别人合作，缺点是有时候太仔细。 Wǒ de yōudiǎn shì rènzhēn, néng gēn biéren hézuò, quēdiǎn shì yǒu shíhou tài zǐxì. (My strength is being careful and able to cooperate; my weakness is being too meticulous at times.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 优点 (yōudiǎn) vs 缺点 (quēdiǎn) sound close — stress 优 (1st, high) and 缺 (1st, high) clearly. 负责 + a task = to be responsible for it. Turn a 缺点 into something you are already improving.</div>`,
    `<span class="eyebrow">CHS201 · Bài 7 · Phỏng vấn</span>
<h2>Công việc &amp; phỏng vấn</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>面试</td><td>miànshì</td><td>phỏng vấn</td></tr>
<tr><td>应聘</td><td>yìngpìn</td><td>ứng tuyển</td></tr>
<tr><td>工作经验</td><td>gōngzuò jīngyàn</td><td>kinh nghiệm làm việc</td></tr>
<tr><td>负责</td><td>fùzé</td><td>phụ trách</td></tr>
<tr><td>优点</td><td>yōudiǎn</td><td>ưu điểm</td></tr>
<tr><td>缺点</td><td>quēdiǎn</td><td>khuyết điểm</td></tr>
<tr><td>能力</td><td>nénglì</td><td>năng lực</td></tr>
<tr><td>合作</td><td>hézuò</td><td>hợp tác</td></tr>
<tr><td>期望</td><td>qīwàng</td><td>kỳ vọng, mong đợi</td></tr>
<tr><td>工资</td><td>gōngzī</td><td>lương</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我来应聘…</strong> wǒ lái yìngpìn… — tôi đến ứng tuyển …</li>
<li><strong>我以前负责…</strong> wǒ yǐqián fùzé… — trước đây tôi phụ trách …</li>
<li><strong>我的优点是…，缺点是…</strong> — ưu điểm của tôi là …, khuyết điểm là …</li>
<li><strong>你对工资有什么期望?</strong> — bạn kỳ vọng mức lương thế nào?</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>面试官: 请介绍一下你的工作经验。 Qǐng jièshào yíxià nǐ de gōngzuò jīngyàn. (Mời bạn giới thiệu kinh nghiệm làm việc.)
应聘者: 我以前在一家公司负责市场工作，做了三年。 Wǒ yǐqián zài yì jiā gōngsī fùzé shìchǎng gōngzuò, zuò le sān nián. (Trước đây tôi phụ trách mảng thị trường ở một công ty, làm ba năm.)
面试官: 你觉得自己的优点和缺点是什么？ Nǐ juéde zìjǐ de yōudiǎn hé quēdiǎn shì shénme? (Bạn thấy ưu điểm và khuyết điểm của mình là gì?)
应聘者: 我的优点是认真、能跟别人合作，缺点是有时候太仔细。 Wǒ de yōudiǎn shì rènzhēn, néng gēn biéren hézuò, quēdiǎn shì yǒu shíhou tài zǐxì. (Ưu điểm của tôi là cẩn thận, biết hợp tác với người khác; khuyết điểm là đôi khi quá tỉ mỉ.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 优点 (yōudiǎn) và 缺点 (quēdiǎn) nghe khá giống — đọc rõ 优 (thanh 1, cao) và 缺 (thanh 1, cao). 负责 + việc = chịu trách nhiệm việc đó. Hãy biến 缺点 thành thứ bạn đang cải thiện.</div>`,
  ]]);

const b7q = quiz('chs201-quiz-7', 'Quiz 7 — Work & interview|||Quiz 7 — Công việc & phỏng vấn', [
  { id: 'q1', question: '"面试" (miànshì) nghĩa là gì? / What does 面试 mean?', options: ['phỏng vấn|||interview', 'lương|||salary', 'nghỉ ngơi|||to rest', 'khứ hồi|||round trip'], correctIndex: 0, explanation: '面试 miànshì = buổi phỏng vấn xin việc.' },
  { id: 'q2', question: '"我的优点是认真" nghĩa là gì? / What does 我的优点是认真 mean?', options: ['Ưu điểm của tôi là cẩn thận|||My strength is being careful', 'Tôi bị cảm|||I have a cold', 'Tôi muốn thuê nhà|||I want to rent', 'Tôi đến muộn|||I am late'], correctIndex: 0, explanation: '优点 (ưu điểm) + 认真 (cẩn thận, nghiêm túc).' },
  { id: 'q3', question: '"负责" (fùzé) đi với một công việc nghĩa là? / What does 负责 + a task mean?', options: ['phụ trách, chịu trách nhiệm|||to be in charge of', 'từ chối|||to refuse', 'đặt vé|||to book', 'phàn nàn|||to complain'], correctIndex: 0, explanation: '负责市场工作 = phụ trách mảng thị trường.' },
]);

const b8 = doc('chs201-8-1-comparing-choosing', 'Lesson 8 — Comparing & choosing|||Bài 8 — So sánh & lựa chọn',
  'Mẫu câu: A比B更…, 哪个更好, 我比较喜欢…, 因为…所以我决定…; từ 比较/选择/决定/方便; luyện so sánh và đưa quyết định.',
  [[
    `<span class="eyebrow">CHS201 · Lesson 8 · Comparing</span>
<h2>Comparing &amp; choosing</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>比较</td><td>bǐjiào</td><td>to compare; relatively</td></tr>
<tr><td>比</td><td>bǐ</td><td>compared to (than)</td></tr>
<tr><td>更</td><td>gèng</td><td>more, even more</td></tr>
<tr><td>哪个</td><td>nǎge</td><td>which one</td></tr>
<tr><td>选择</td><td>xuǎnzé</td><td>to choose; a choice</td></tr>
<tr><td>决定</td><td>juédìng</td><td>to decide</td></tr>
<tr><td>功能</td><td>gōngnéng</td><td>function, feature</td></tr>
<tr><td>便宜</td><td>piányi</td><td>cheap</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>convenient</td></tr>
<tr><td>但是</td><td>dànshì</td><td>but, however</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>A 比 B 更…</strong> — A is even more … than B : 这个比那个更贵.</li>
<li><strong>哪个更好?</strong> nǎge gèng hǎo? — which one is better?</li>
<li><strong>我比较喜欢…</strong> wǒ bǐjiào xǐhuan… — I rather prefer …</li>
<li><strong>因为…，所以我决定…</strong> — because …, so I decided to …</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 这两个手机，你觉得哪个更好？ Zhè liǎng ge shǒujī, nǐ juéde nǎge gèng hǎo? (Of these two phones, which do you think is better?)
B: 这个比那个贵，但是功能更多。 Zhège bǐ nàge guì, dànshì gōngnéng gèng duō. (This one is more expensive than that one, but has more functions.)
A: 那个呢？ Nàge ne? (What about that one?)
B: 那个比较便宜，也很方便。因为我的钱不多，所以我决定买那个。 Nàge bǐjiào piányi, yě hěn fāngbiàn. Yīnwèi wǒ de qián bù duō, suǒyǐ wǒ juédìng mǎi nàge. (That one is cheaper and convenient. Because I do not have much money, I decided to buy that one.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> A 比 B + adjective is the core comparison; add 更 for even more. 因为…所以… gives the reason then the decision — this is how you justify a choice out loud.</div>`,
    `<span class="eyebrow">CHS201 · Bài 8 · So sánh</span>
<h2>So sánh &amp; lựa chọn</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>比较</td><td>bǐjiào</td><td>so sánh; khá</td></tr>
<tr><td>比</td><td>bǐ</td><td>hơn (so với)</td></tr>
<tr><td>更</td><td>gèng</td><td>hơn, càng</td></tr>
<tr><td>哪个</td><td>nǎge</td><td>cái nào</td></tr>
<tr><td>选择</td><td>xuǎnzé</td><td>lựa chọn</td></tr>
<tr><td>决定</td><td>juédìng</td><td>quyết định</td></tr>
<tr><td>功能</td><td>gōngnéng</td><td>tính năng</td></tr>
<tr><td>便宜</td><td>piányi</td><td>rẻ</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>tiện lợi</td></tr>
<tr><td>但是</td><td>dànshì</td><td>nhưng</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>A 比 B 更…</strong> — A … hơn B : 这个比那个更贵.</li>
<li><strong>哪个更好?</strong> nǎge gèng hǎo? — cái nào tốt hơn?</li>
<li><strong>我比较喜欢…</strong> wǒ bǐjiào xǐhuan… — tôi thích … hơn.</li>
<li><strong>因为…，所以我决定…</strong> — bởi vì …, cho nên tôi quyết định …</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 这两个手机，你觉得哪个更好？ Zhè liǎng ge shǒujī, nǐ juéde nǎge gèng hǎo? (Hai chiếc điện thoại này, bạn thấy cái nào tốt hơn?)
B: 这个比那个贵，但是功能更多。 Zhège bǐ nàge guì, dànshì gōngnéng gèng duō. (Cái này đắt hơn cái kia, nhưng nhiều tính năng hơn.)
A: 那个呢？ Nàge ne? (Còn cái kia thì sao?)
B: 那个比较便宜，也很方便。因为我的钱不多，所以我决定买那个。 Nàge bǐjiào piányi, yě hěn fāngbiàn. Yīnwèi wǒ de qián bù duō, suǒyǐ wǒ juédìng mǎi nàge. (Cái kia khá rẻ, lại tiện. Vì tôi không có nhiều tiền, nên tôi quyết định mua cái kia.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> A 比 B + tính từ là phép so sánh cốt lõi; thêm 更 để nói hơn hẳn. 因为…所以… nêu lý do rồi đến quyết định — đây là cách nói ra để biện minh cho lựa chọn.</div>`,
  ]]);

const b8q = quiz('chs201-quiz-8', 'Quiz 8 — Comparing & choosing|||Quiz 8 — So sánh & lựa chọn', [
  { id: 'q1', question: '"这个比那个贵" nghĩa là gì? / What does 这个比那个贵 mean?', options: ['Cái này đắt hơn cái kia|||This is more expensive than that', 'Cái này rẻ nhất|||This is the cheapest', 'Cái kia đẹp hơn|||That is prettier', 'Hai cái bằng nhau|||They are the same'], correctIndex: 0, explanation: 'A 比 B + tính từ: 这个 比 那个 贵 = cái này đắt hơn cái kia.' },
  { id: 'q2', question: 'Từ "更" (gèng) thêm vào câu so sánh nghĩa là? / What does 更 add to a comparison?', options: ['hơn nữa, càng hơn|||more, even more', 'ít hơn|||less', 'bằng nhau|||equal', 'không hơn|||no more'], correctIndex: 0, explanation: '功能更多 = nhiều tính năng hơn nữa; 更 làm mức so sánh mạnh hơn.' },
  { id: 'q3', question: '"因为…所以我决定…" dùng để làm gì? / What is 因为…所以我决定… used for?', options: ['Nêu lý do rồi đưa quyết định|||Give a reason then a decision', 'Hỏi giờ|||Ask the time', 'Chào tạm biệt|||Say goodbye', 'Gọi món|||Order food'], correctIndex: 0, explanation: '因为 (lý do) … 所以我决定 (nên tôi quyết định) … — biện minh cho lựa chọn.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CHS201',
    slug: 'chs201-chinese-speaking-3',
    title: 'Chinese Speaking 3',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHS201.webp',
    shortDescription: 'Spoken Chinese 3 (HSK3), after CHS121: yourself & studies, health & advice, opinions & feelings, narrating events, restaurant complaints, travel & booking, interviews, comparing & choosing. Longer role-play dialogues, bilingual, quizzes.|||Tiếng Trung giao tiếp 3 (HSK3), nối tiếp CHS121: bản thân & học tập, sức khoẻ & lời khuyên, ý kiến & cảm xúc, kể sự việc, phàn nàn nhà hàng, du lịch & đặt chỗ, phỏng vấn, so sánh. Hội thoại đóng vai dài hơn, song ngữ, quiz.',
    description: 'Môn <strong>CHS201 — Chinese Speaking 3 (Tiếng Trung giao tiếp 3)</strong> là môn <strong>luyện nói</strong> ở trình độ khẩu ngữ <strong>HSK3</strong>, <strong>nối tiếp CHS121</strong>. Giao tiếp tình huống mở rộng: <strong>kể về bản thân &amp; học tập</strong> → <strong>sức khoẻ &amp; lời khuyên</strong> → <strong>bày tỏ ý kiến &amp; cảm xúc</strong> → <strong>kể lại sự việc</strong> → <strong>nhà hàng &amp; phàn nàn</strong> → <strong>du lịch &amp; đặt chỗ</strong> → <strong>công việc &amp; phỏng vấn</strong> → <strong>so sánh &amp; lựa chọn</strong>. Bám giáo trình khẩu ngữ chuẩn (汉语口语速成 提高篇 / HSK Standard Course 3), song ngữ Trung–Việt, mỗi bài có bảng từ vựng khẩu ngữ (汉字|pinyin|nghĩa), mẫu câu giao tiếp trọng tâm, hội thoại đóng vai dài hơn để nói nhại, ghi chú phát âm/ngữ điệu và quiz. Học theo lộ trình 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.',
    whatYouLearn: 'Giới thiệu bản thân sâu hơn (自我介绍一下, 我的专业是, 因为…所以…); đưa lời khuyên (你应该, 你最好, 我建议你); bày tỏ ý kiến &amp; cảm xúc (我觉得, 我认为, 同意/不同意, 你说得对); kể lại sự việc theo trình tự (先…接着…后来…结果, 一…就…); gọi món &amp; phàn nàn ở nhà hàng (上错菜, 太咸了, 换, 我要投诉); du lịch &amp; đặt chỗ (订票, 订房间, 单程还是来回, 推荐景点); công việc &amp; phỏng vấn (面试, 负责, 优点缺点, 期望); so sánh &amp; lựa chọn (A比B更, 哪个更好, 因为…所以我决定). Nói được các hội thoại tình huống dài hơn với phát âm rõ.',
    requirements: 'Nên học xong CHS121 (giao tiếp HSK2: sở thích, sức khoẻ, gọi điện, nhà hàng, mua sắm, hỏi đường) trước khi vào môn này. Cài Pleco hoặc HelloChinese để nghe audio bản ngữ &amp; luyện nói theo; hãy nói to và tự thu âm để so với mẫu.',
  },
  sections: [
    { title: '📚 Tài liệu & lộ trình luyện nói|||📚 Course materials', description: 'Giáo trình khẩu ngữ 汉语口语速成 提高篇, app luyện nói, lộ trình 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CHS121: nhắc nền phát âm/thanh điệu, mục tiêu giao tiếp HSK3, cách luyện hội thoại tình huống dài hơn.', lessons: [intro] },
    { title: 'Bài 1 — Kể về bản thân & học tập|||Lesson 1 — Yourself & studies', description: '自我介绍一下, 我的专业是, 因为…所以…, 兴趣.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Sức khoẻ & lời khuyên|||Lesson 2 — Health & advice', description: '不舒服, 应该, 最好, 我建议你, 看医生.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Bày tỏ ý kiến & cảm xúc|||Lesson 3 — Opinions & feelings', description: '我觉得, 我认为, 同意/不同意, 你说得对.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Kể lại sự việc|||Lesson 4 — Narrating events', description: '先…接着…后来…结果, 一…就…, 突然, 终于.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Nhà hàng & phàn nàn|||Lesson 5 — Restaurant complaints', description: '上错菜, 太咸了, 换, 重新做, 我要投诉.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Du lịch & đặt chỗ|||Lesson 6 — Travel & booking', description: '订票, 订房间, 单程还是来回, 推荐景点, 行程.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Công việc & phỏng vấn|||Lesson 7 — Work & interview', description: '面试, 应聘, 负责, 优点缺点, 期望.', lessons: [b7, b7q] },
    { title: 'Bài 8 — So sánh & lựa chọn|||Lesson 8 — Comparing & choosing', description: 'A比B更, 哪个更好, 我比较喜欢, 因为…所以我决定.', lessons: [b8, b8q] },
  ],
};
