/**
 * CHS121 — Chinese Speaking 2 (Tiếng Trung giao tiếp/nói 2). Khối Ngôn ngữ
 * Trung FPTU. Đây là MÔN NGÔN NGỮ, track LUYỆN NÓI, NỐI TIẾP CHS111: mở rộng
 * chủ đề giao tiếp ở trình độ khẩu ngữ HSK2 — sở thích, thời tiết/sức khoẻ,
 * gọi điện, nhà hàng, mua sắm, hỏi đường, thuê nhà, kể chuyện. Giáo trình
 * chuẩn: 汉语口语速成 基础篇 (Short-term Spoken Chinese, Elementary), HSK
 * Standard Course 2. Lộ trình 4 bước: Nghe → Bắt chước → Luyện cặp → Ứng dụng.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; trong
 * HTML content "&" → "&amp;". shortDescription dùng "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & mẫu câu giao tiếp của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chs121-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình luyện nói',
  'Giáo trình khẩu ngữ chuẩn (汉语口语速成 基础篇, HSK Standard Course 2), app luyện nói (HelloChinese/Pleco), lộ trình 4 bước: Nghe → Bắt chước → Luyện cặp → Ứng dụng.',
  [[
    `<span class="eyebrow">CHS121 · Materials</span>
<h2>Keep building spoken Chinese — materials &amp; roadmap</h2>
<p class="lead">Chinese Speaking 2 continues <strong>CHS111</strong>. It is still a <strong>speaking-first</strong> course, now at the <strong>HSK2</strong> level: longer real dialogues, more everyday topics, and the fixed phrases you say in real situations.</p>
<h3>📘 Standard textbooks (spoken track)</h3>
<ul>
<li><strong>汉语口语速成 基础篇 (Short-term Spoken Chinese, Elementary)</strong> (Beijing Language and Culture University Press): the mainstream spoken-Chinese coursebook, level 2.</li>
<li><strong>HSK Standard Course 2</strong> — vocabulary &amp; grammar that back up each speaking topic.</li>
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
    `<span class="eyebrow">CHS121 · Tài liệu</span>
<h2>Tiếp tục luyện nói tiếng Trung — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung giao tiếp 2 nối tiếp <strong>CHS111</strong>. Vẫn là môn <strong>lấy nói làm gốc</strong>, giờ ở trình độ <strong>HSK2</strong>: hội thoại thật dài hơn, nhiều chủ đề hằng ngày hơn, và những câu cố định dùng trong tình huống thật.</p>
<h3>📘 Giáo trình chuẩn (hướng khẩu ngữ)</h3>
<ul>
<li><strong>汉语口语速成 基础篇 (Short-term Spoken Chinese, Elementary)</strong> (NXB Đại học Ngôn ngữ Bắc Kinh): giáo trình khẩu ngữ phổ biến nhất, cấp 2.</li>
<li><strong>HSK Standard Course 2</strong> — từ vựng &amp; ngữ pháp nền cho mỗi chủ đề nói.</li>
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

const intro = doc('chs121-0-1-overview', 'Course overview: Chinese Speaking 2|||Tổng quan: Tiếng Trung giao tiếp 2',
  'Nối tiếp CHS111: nhắc lại nền phát âm/thanh điệu, mục tiêu giao tiếp HSK2, cách luyện nói theo chủ đề mở rộng.',
  [[
    `<span class="eyebrow">CHS121 · Lesson 0.1 · Overview</span>
<h2>Chinese Speaking 2 (HSK2)</h2>
<p class="lead">This course <strong>continues CHS111</strong>. There you built pinyin, the <strong>4 tones</strong>, and the first everyday phrases. Here you keep the same speaking habit and take it into <strong>longer, more real conversations</strong>: hobbies, weather &amp; health, phone calls, ordering in a restaurant, shopping, directions, renting a place, and telling a simple story.</p>
<h3>What CHS111 gave you (the base)</h3>
<ul>
<li><strong>Sound first</strong> — the 4 tones plus the neutral tone; a wrong tone is a wrong word, so keep shadowing native audio.</li>
<li><strong>Fixed phrases</strong> — spoken Chinese runs on set patterns (请问… , 多少钱? , 怎么走?). Learn the whole phrase, use it as one block.</li>
</ul>
<h3>How each lesson works</h3>
<p>Every lesson gives you a <strong>spoken vocabulary &amp; phrase table</strong> (汉字 | pinyin | nghĩa), the <strong>key communication patterns</strong> to memorise, a <strong>real dialogue</strong> to shadow and role-play, and <strong>pronunciation / intonation notes</strong>. Then a short quiz. Always follow the 4 steps: listen → imitate → pair-drill → apply.</p>
<h3>Roadmap</h3>
<p>Hobbies &amp; weekends → weather &amp; health → phone calls &amp; making plans → ordering in a restaurant → shopping → directions &amp; transport → renting a place → telling a simple story.</p>`,
    `<span class="eyebrow">CHS121 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung giao tiếp 2 (HSK2)</h2>
<p class="lead">Môn này <strong>nối tiếp CHS111</strong>. Ở đó bạn đã dựng pinyin, <strong>4 thanh điệu</strong> và những câu hằng ngày đầu tiên. Ở đây bạn giữ nguyên thói quen nói và đưa nó vào <strong>hội thoại dài hơn, thật hơn</strong>: sở thích, thời tiết &amp; sức khoẻ, gọi điện, gọi món ở nhà hàng, mua sắm, hỏi đường, thuê nhà, và kể chuyện đơn giản.</p>
<h3>CHS111 đã cho bạn nền gì</h3>
<ul>
<li><strong>Âm là gốc</strong> — 4 thanh cộng thanh nhẹ; sai thanh là sai từ, nên hãy tiếp tục nói nhại theo audio bản ngữ.</li>
<li><strong>Câu cố định</strong> — khẩu ngữ tiếng Trung chạy bằng các mẫu có sẵn (请问… , 多少钱? , 怎么走?). Hãy học cả cụm, dùng như một khối.</li>
</ul>
<h3>Mỗi bài học ra sao</h3>
<p>Mỗi bài có <strong>bảng từ vựng &amp; mẫu câu khẩu ngữ</strong> (汉字 | pinyin | nghĩa), các <strong>mẫu câu giao tiếp trọng tâm</strong> để thuộc, một <strong>hội thoại thực tế</strong> để nói nhại &amp; đóng vai, và <strong>ghi chú phát âm / ngữ điệu</strong>. Sau đó là quiz ngắn. Luôn theo 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.</p>
<h3>Lộ trình</h3>
<p>Sở thích &amp; cuối tuần → thời tiết &amp; sức khoẻ → gọi điện &amp; hẹn → gọi món ở nhà hàng → mua sắm → hỏi đường &amp; phương tiện → thuê nhà → kể chuyện đơn giản.</p>`,
  ]]);

const b1 = doc('chs121-1-1-hobbies-weekend', 'Lesson 1 — Hobbies &amp; the weekend|||Bài 1 — Sở thích &amp; cuối tuần',
  'Mẫu câu: 周末做什么, 喜欢…, 你有什么爱好, 一起去…吧; động từ sở thích 看电影/运动/唱歌; luyện hỏi-đáp về sở thích.',
  [[
    `<span class="eyebrow">CHS121 · Lesson 1 · Hobbies</span>
<h2>Hobbies &amp; the weekend</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>周末</td><td>zhōumò</td><td>weekend</td></tr>
<tr><td>做什么</td><td>zuò shénme</td><td>do what</td></tr>
<tr><td>喜欢</td><td>xǐhuan</td><td>to like</td></tr>
<tr><td>爱好</td><td>àihào</td><td>hobby</td></tr>
<tr><td>一起</td><td>yìqǐ</td><td>together</td></tr>
<tr><td>运动</td><td>yùndòng</td><td>sport, to exercise</td></tr>
<tr><td>看电影</td><td>kàn diànyǐng</td><td>watch a movie</td></tr>
<tr><td>唱歌</td><td>chàng gē</td><td>to sing</td></tr>
<tr><td>常常</td><td>chángcháng</td><td>often</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>周末你做什么?</strong> zhōumò nǐ zuò shénme? — what do you do on the weekend?</li>
<li><strong>我喜欢…</strong> wǒ xǐhuan… — I like … : 我喜欢看电影 (I like watching movies).</li>
<li><strong>你有什么爱好?</strong> nǐ yǒu shénme àihào? — what hobbies do you have?</li>
<li><strong>我们一起去…吧!</strong> — let us go … together! 吧 turns it into a friendly suggestion.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 周末你常常做什么？   Zhōumò nǐ chángcháng zuò shénme? (What do you usually do on the weekend?)
B: 我喜欢看电影，也喜欢运动。 Wǒ xǐhuan kàn diànyǐng, yě xǐhuan yùndòng. (I like watching movies, and I like sport.)
A: 这个周末我们一起去看电影吧！ Zhège zhōumò wǒmen yìqǐ qù kàn diànyǐng ba! (Let us go to a movie together this weekend!)
B: 好啊！             Hǎo a!                          (Sure!)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 喜欢 (xǐhuan) ends in a neutral 欢 — say it light: xǐ·huan. 也 (yě, also) links two likes: 我喜欢 A，也喜欢 B.</div>`,
    `<span class="eyebrow">CHS121 · Bài 1 · Sở thích</span>
<h2>Sở thích &amp; cuối tuần</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>周末</td><td>zhōumò</td><td>cuối tuần</td></tr>
<tr><td>做什么</td><td>zuò shénme</td><td>làm gì</td></tr>
<tr><td>喜欢</td><td>xǐhuan</td><td>thích</td></tr>
<tr><td>爱好</td><td>àihào</td><td>sở thích</td></tr>
<tr><td>一起</td><td>yìqǐ</td><td>cùng nhau</td></tr>
<tr><td>运动</td><td>yùndòng</td><td>thể thao, vận động</td></tr>
<tr><td>看电影</td><td>kàn diànyǐng</td><td>xem phim</td></tr>
<tr><td>唱歌</td><td>chàng gē</td><td>hát</td></tr>
<tr><td>常常</td><td>chángcháng</td><td>thường thường</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>周末你做什么?</strong> zhōumò nǐ zuò shénme? — cuối tuần bạn làm gì?</li>
<li><strong>我喜欢…</strong> wǒ xǐhuan… — tôi thích … : 我喜欢看电影 (tôi thích xem phim).</li>
<li><strong>你有什么爱好?</strong> nǐ yǒu shénme àihào? — bạn có sở thích gì?</li>
<li><strong>我们一起去…吧!</strong> — chúng ta cùng đi … nhé! 吧 biến câu thành lời gợi ý thân thiện.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 周末你常常做什么？   Zhōumò nǐ chángcháng zuò shénme? (Cuối tuần bạn thường làm gì?)
B: 我喜欢看电影，也喜欢运动。 Wǒ xǐhuan kàn diànyǐng, yě xǐhuan yùndòng. (Tôi thích xem phim, cũng thích thể thao.)
A: 这个周末我们一起去看电影吧！ Zhège zhōumò wǒmen yìqǐ qù kàn diànyǐng ba! (Cuối tuần này chúng ta cùng đi xem phim nhé!)
B: 好啊！             Hǎo a!                          (Được thôi!)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 喜欢 (xǐhuan) kết bằng 欢 thanh nhẹ — đọc nhẹ: xǐ·huan. 也 (yě, cũng) nối hai sở thích: 我喜欢 A，也喜欢 B.</div>`,
  ]]);

const b1q = quiz('chs121-quiz-1', 'Quiz 1 — Hobbies &amp; the weekend|||Quiz 1 — Sở thích &amp; cuối tuần', [
  { id: 'q1', question: 'Hỏi "cuối tuần bạn làm gì?" đúng là? / How do you ask what someone does on the weekend?', options: ['周末你做什么？', '你几岁？', '多少钱？', '你是谁？'], correctIndex: 0, explanation: '周末 (cuối tuần) + 你做什么 (bạn làm gì) → 周末你做什么?' },
  { id: 'q2', question: '"我喜欢看电影" nghĩa là gì? / What does 我喜欢看电影 mean?', options: ['Tôi thích xem phim|||I like watching movies', 'Tôi muốn ăn cơm|||I want to eat', 'Tôi đi làm|||I go to work', 'Tôi không khoẻ|||I am unwell'], correctIndex: 0, explanation: '喜欢 (thích) + 看电影 (xem phim) = tôi thích xem phim.' },
  { id: 'q3', question: 'Rủ ai đó "cùng đi… nhé" dùng cụm nào? / Which phrase invites doing something together?', options: ['一起去…吧', '再见', '多喝水', '打错了'], correctIndex: 0, explanation: '一起去…吧 — 一起 (cùng nhau) + 吧 làm câu thành lời rủ thân thiện.' },
]);

const b2 = doc('chs121-2-1-weather-health', 'Lesson 2 — Weather &amp; health|||Bài 2 — Thời tiết &amp; sức khoẻ',
  'Mẫu câu: 今天天气怎么样, 我有点儿不舒服, 你怎么了, 多喝水多休息; từ 热/冷/下雨/感冒/发烧; luyện hỏi thăm sức khoẻ.',
  [[
    `<span class="eyebrow">CHS121 · Lesson 2 · Weather &amp; health</span>
<h2>Weather &amp; health</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>天气</td><td>tiānqì</td><td>weather</td></tr>
<tr><td>怎么样</td><td>zěnmeyàng</td><td>how, how about</td></tr>
<tr><td>热</td><td>rè</td><td>hot</td></tr>
<tr><td>冷</td><td>lěng</td><td>cold</td></tr>
<tr><td>下雨</td><td>xià yǔ</td><td>to rain</td></tr>
<tr><td>不舒服</td><td>bù shūfu</td><td>unwell, uncomfortable</td></tr>
<tr><td>感冒</td><td>gǎnmào</td><td>a cold</td></tr>
<tr><td>发烧</td><td>fāshāo</td><td>to have a fever</td></tr>
<tr><td>多喝水</td><td>duō hē shuǐ</td><td>drink more water</td></tr>
<tr><td>休息</td><td>xiūxi</td><td>to rest</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>今天天气怎么样?</strong> — what is the weather like today? Answer: 今天很热 / 今天下雨.</li>
<li><strong>我有点儿不舒服</strong> wǒ yǒudiǎnr bù shūfu — I feel a bit unwell.</li>
<li><strong>你怎么了?</strong> nǐ zěnme le? — what is the matter (with you)?</li>
<li><strong>多喝水，多休息</strong> — drink more water, rest more. A common wish for a sick friend.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你怎么了？看起来不舒服。 Nǐ zěnme le? Kànqǐlai bù shūfu. (What is wrong? You look unwell.)
B: 我感冒了，有点儿发烧。 Wǒ gǎnmào le, yǒudiǎnr fāshāo. (I have a cold, and a slight fever.)
A: 多喝水，多休息吧。   Duō hē shuǐ, duō xiūxi ba. (Drink more water and rest.)
B: 谢谢！               Xièxie!                    (Thank you!)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 怎么样 (zěnmeyàng) has a neutral 么 — say it fast: zěn·me·yàng. 了 in 感冒了 marks a change: I have (now caught) a cold.</div>`,
    `<span class="eyebrow">CHS121 · Bài 2 · Thời tiết &amp; sức khoẻ</span>
<h2>Thời tiết &amp; sức khoẻ</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>天气</td><td>tiānqì</td><td>thời tiết</td></tr>
<tr><td>怎么样</td><td>zěnmeyàng</td><td>thế nào</td></tr>
<tr><td>热</td><td>rè</td><td>nóng</td></tr>
<tr><td>冷</td><td>lěng</td><td>lạnh</td></tr>
<tr><td>下雨</td><td>xià yǔ</td><td>mưa</td></tr>
<tr><td>不舒服</td><td>bù shūfu</td><td>khó chịu, không khoẻ</td></tr>
<tr><td>感冒</td><td>gǎnmào</td><td>cảm cúm</td></tr>
<tr><td>发烧</td><td>fāshāo</td><td>sốt</td></tr>
<tr><td>多喝水</td><td>duō hē shuǐ</td><td>uống nhiều nước</td></tr>
<tr><td>休息</td><td>xiūxi</td><td>nghỉ ngơi</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>今天天气怎么样?</strong> — hôm nay thời tiết thế nào? Đáp: 今天很热 / 今天下雨.</li>
<li><strong>我有点儿不舒服</strong> wǒ yǒudiǎnr bù shūfu — tôi hơi không khoẻ.</li>
<li><strong>你怎么了?</strong> nǐ zěnme le? — bạn bị làm sao vậy?</li>
<li><strong>多喝水，多休息</strong> — uống nhiều nước, nghỉ nhiều. Lời chúc quen thuộc cho bạn bị ốm.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你怎么了？看起来不舒服。 Nǐ zěnme le? Kànqǐlai bù shūfu. (Bạn sao thế? Trông không khoẻ.)
B: 我感冒了，有点儿发烧。 Wǒ gǎnmào le, yǒudiǎnr fāshāo. (Tôi bị cảm, hơi sốt.)
A: 多喝水，多休息吧。   Duō hē shuǐ, duō xiūxi ba. (Uống nhiều nước, nghỉ ngơi nhé.)
B: 谢谢！               Xièxie!                    (Cảm ơn!)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 怎么样 (zěnmeyàng) có 么 thanh nhẹ — đọc nhanh: zěn·me·yàng. 了 trong 感冒了 báo một sự thay đổi: nay đã (bị) cảm.</div>`,
  ]]);

const b2q = quiz('chs121-quiz-2', 'Quiz 2 — Weather &amp; health|||Quiz 2 — Thời tiết &amp; sức khoẻ', [
  { id: 'q1', question: 'Hỏi "hôm nay thời tiết thế nào?" đúng là? / How do you ask what the weather is like today?', options: ['今天天气怎么样？', '你叫什么？', '多少钱？', '几点见？'], correctIndex: 0, explanation: '今天天气 (thời tiết hôm nay) + 怎么样 (thế nào) → 今天天气怎么样?' },
  { id: 'q2', question: '"我感冒了" nghĩa là gì? / What does 我感冒了 mean?', options: ['Tôi bị cảm|||I have a cold', 'Tôi đói|||I am hungry', 'Tôi vui|||I am happy', 'Tôi bận|||I am busy'], correctIndex: 0, explanation: '感冒 (cảm cúm) + 了 (báo thay đổi) = tôi bị cảm.' },
  { id: 'q3', question: 'Lời khuyên quen thuộc cho người bị ốm là? / A common piece of advice for someone who is sick?', options: ['多喝水，多休息', '太贵了', '打错了', '一起去'], correctIndex: 0, explanation: '多喝水 (uống nhiều nước) + 多休息 (nghỉ nhiều) — lời chúc cho người ốm.' },
]);

const b3 = doc('chs121-3-1-phone-appointments', 'Lesson 3 — Phone calls &amp; making plans|||Bài 3 — Gọi điện &amp; hẹn',
  'Mẫu câu: 喂, 请问…在吗, 你打错了, 你是哪位, 什么时候方便, 请稍等; luyện gọi điện và hẹn gặp.',
  [[
    `<span class="eyebrow">CHS121 · Lesson 3 · Phone calls</span>
<h2>Phone calls &amp; making plans</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>喂</td><td>wéi</td><td>hello (on the phone)</td></tr>
<tr><td>在吗</td><td>zài ma</td><td>is (someone) there</td></tr>
<tr><td>打电话</td><td>dǎ diànhuà</td><td>to make a call</td></tr>
<tr><td>打错了</td><td>dǎ cuò le</td><td>wrong number</td></tr>
<tr><td>哪位</td><td>nǎ wèi</td><td>who (polite)</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>convenient</td></tr>
<tr><td>什么时候</td><td>shénme shíhou</td><td>when</td></tr>
<tr><td>稍等</td><td>shāo děng</td><td>hold on a moment</td></tr>
<tr><td>以后</td><td>yǐhòu</td><td>after, later</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>喂，请问…在吗?</strong> wéi, qǐngwèn … zài ma? — hello, may I ask, is … there?</li>
<li><strong>你打错了</strong> — you have the wrong number. Reply: 对不起 (sorry).</li>
<li><strong>你是哪位?</strong> nǐ shì nǎ wèi? — who is speaking (polite)?</li>
<li><strong>你什么时候方便?</strong> — when is convenient for you? · <strong>请稍等</strong> — please hold on.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 喂，你好！请问小李在吗？ Wéi, nǐ hǎo! Qǐngwèn Xiǎo Lǐ zài ma? (Hello! May I ask, is Xiao Li there?)
B: 他不在。你是哪位？     Tā bú zài. Nǐ shì nǎ wèi?         (He is not in. Who is calling?)
A: 我是他的朋友。他什么时候方便？ Wǒ shì tā de péngyou. Tā shénme shíhou fāngbiàn? (I am his friend. When is he free?)
B: 晚上七点以后吧。       Wǎnshang qī diǎn yǐhòu ba.        (After 7 in the evening.)
</code></pre>
<div class="callout"><span class="badge">Pronunciation note</span> On the phone 喂 is said with a rising tone, <strong>wéi</strong> (2nd), not the dictionary wèi. 哪位 (nǎ wèi) is the polite way to ask who is calling.</div>`,
    `<span class="eyebrow">CHS121 · Bài 3 · Gọi điện</span>
<h2>Gọi điện &amp; hẹn</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>喂</td><td>wéi</td><td>a lô (khi nghe điện thoại)</td></tr>
<tr><td>在吗</td><td>zài ma</td><td>có ở đó không</td></tr>
<tr><td>打电话</td><td>dǎ diànhuà</td><td>gọi điện</td></tr>
<tr><td>打错了</td><td>dǎ cuò le</td><td>gọi nhầm rồi</td></tr>
<tr><td>哪位</td><td>nǎ wèi</td><td>ai (lịch sự)</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>thuận tiện</td></tr>
<tr><td>什么时候</td><td>shénme shíhou</td><td>khi nào</td></tr>
<tr><td>稍等</td><td>shāo děng</td><td>đợi một chút</td></tr>
<tr><td>以后</td><td>yǐhòu</td><td>sau, về sau</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>喂，请问…在吗?</strong> wéi, qǐngwèn … zài ma? — a lô, cho hỏi … có ở đó không?</li>
<li><strong>你打错了</strong> — bạn gọi nhầm số rồi. Đáp: 对不起 (xin lỗi).</li>
<li><strong>你是哪位?</strong> nǐ shì nǎ wèi? — ai đang gọi vậy (lịch sự)?</li>
<li><strong>你什么时候方便?</strong> — khi nào bạn tiện? · <strong>请稍等</strong> — xin đợi chút.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 喂，你好！请问小李在吗？ Wéi, nǐ hǎo! Qǐngwèn Xiǎo Lǐ zài ma? (A lô, chào! Cho hỏi Tiểu Lý có đó không?)
B: 他不在。你是哪位？     Tā bú zài. Nǐ shì nǎ wèi?         (Anh ấy không có. Ai đang gọi vậy?)
A: 我是他的朋友。他什么时候方便？ Wǒ shì tā de péngyou. Tā shénme shíhou fāngbiàn? (Tôi là bạn anh ấy. Khi nào anh ấy tiện?)
B: 晚上七点以后吧。       Wǎnshang qī diǎn yǐhòu ba.        (Sau 7 giờ tối nhé.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú phát âm</span> Khi nghe điện thoại, 喂 đọc lên giọng, <strong>wéi</strong> (thanh 2), không phải wèi như từ điển. 哪位 (nǎ wèi) là cách hỏi lịch sự xem ai đang gọi.</div>`,
  ]]);

const b3q = quiz('chs121-quiz-3', 'Quiz 3 — Phone calls|||Quiz 3 — Gọi điện', [
  { id: 'q1', question: 'Từ để "a lô" khi nghe điện thoại là? / Which word answers the phone (hello)?', options: ['喂 wéi', '再见 zàijiàn', '谢谢 xièxie', '请问 qǐngwèn'], correctIndex: 0, explanation: '喂 (khi nghe điện thoại đọc là wéi, thanh 2) = a lô.' },
  { id: 'q2', question: '"你打错了" nghĩa là gì? / What does 你打错了 mean?', options: ['Bạn gọi nhầm số rồi|||You dialed the wrong number', 'Bạn đến muộn|||You are late', 'Bạn nói đúng|||You are right', 'Bạn về nhà|||You go home'], correctIndex: 0, explanation: '打 (gọi) + 错了 (nhầm rồi) = bạn gọi nhầm số rồi.' },
  { id: 'q3', question: 'Hỏi "khi nào bạn tiện?" đúng là? / How do you ask when someone is free?', options: ['你什么时候方便？', '你是哪国人？', '多少钱？', '几点了？'], correctIndex: 0, explanation: '什么时候 (khi nào) + 方便 (tiện) → 你什么时候方便?' },
]);

const b4 = doc('chs121-4-1-restaurant', 'Lesson 4 — At the restaurant|||Bài 4 — Ở nhà hàng',
  'Mẫu câu nâng cao: 有什么好吃的, 招牌菜, 不要太辣, 再来一个, 服务员结账; luyện gọi món và tính tiền.',
  [[
    `<span class="eyebrow">CHS121 · Lesson 4 · Restaurant</span>
<h2>At the restaurant</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>服务员</td><td>fúwùyuán</td><td>waiter, server</td></tr>
<tr><td>好吃的</td><td>hǎochī de</td><td>something tasty</td></tr>
<tr><td>点菜</td><td>diǎn cài</td><td>to order dishes</td></tr>
<tr><td>招牌菜</td><td>zhāopái cài</td><td>signature dish</td></tr>
<tr><td>辣</td><td>là</td><td>spicy</td></tr>
<tr><td>不要太辣</td><td>búyào tài là</td><td>not too spicy</td></tr>
<tr><td>再来一个</td><td>zài lái yíge</td><td>one more, please</td></tr>
<tr><td>米饭</td><td>mǐfàn</td><td>rice</td></tr>
<tr><td>结账</td><td>jiézhàng</td><td>to pay the bill</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>你们有什么好吃的?</strong> — what good food do you have here?</li>
<li><strong>不要太辣</strong> búyào tài là — not too spicy (a common request).</li>
<li><strong>再来一个… / 再来一碗…</strong> — one more … / one more bowl of ….</li>
<li><strong>服务员，结账!</strong> — waiter, the bill please!</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>顾客: 服务员，你们有什么好吃的？ Fúwùyuán, nǐmen yǒu shénme hǎochī de? (Waiter, what good dishes do you have?)
服务员: 我们的招牌菜是宫保鸡丁。 Wǒmen de zhāopái cài shì gōngbǎo jīdīng. (Our signature dish is Kung Pao chicken.)
顾客: 好，来一个，不要太辣。   Hǎo, lái yíge, búyào tài là. (Good, one please, not too spicy.)
服务员: 好的，请稍等。         Hǎo de, qǐng shāo děng.      (Sure, one moment.)
顾客: 再来一碗米饭，然后结账。 Zài lái yì wǎn mǐfàn, ránhòu jiézhàng. (One more bowl of rice, then the bill.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 不要 before a 4th tone becomes bú·yào; keep 要 short here. 再来一个 (zài lái yíge) is the natural spoken way to add an order.</div>`,
    `<span class="eyebrow">CHS121 · Bài 4 · Nhà hàng</span>
<h2>Ở nhà hàng</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>服务员</td><td>fúwùyuán</td><td>nhân viên phục vụ</td></tr>
<tr><td>好吃的</td><td>hǎochī de</td><td>món ngon</td></tr>
<tr><td>点菜</td><td>diǎn cài</td><td>gọi món</td></tr>
<tr><td>招牌菜</td><td>zhāopái cài</td><td>món đặc trưng</td></tr>
<tr><td>辣</td><td>là</td><td>cay</td></tr>
<tr><td>不要太辣</td><td>búyào tài là</td><td>đừng cay quá</td></tr>
<tr><td>再来一个</td><td>zài lái yíge</td><td>thêm một cái nữa</td></tr>
<tr><td>米饭</td><td>mǐfàn</td><td>cơm</td></tr>
<tr><td>结账</td><td>jiézhàng</td><td>tính tiền</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>你们有什么好吃的?</strong> — chỗ các bạn có món gì ngon?</li>
<li><strong>不要太辣</strong> búyào tài là — đừng cay quá (câu hay dùng).</li>
<li><strong>再来一个… / 再来一碗…</strong> — thêm một … nữa / thêm một bát … nữa.</li>
<li><strong>服务员，结账!</strong> — phục vụ ơi, tính tiền!</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>顾客: 服务员，你们有什么好吃的？ Fúwùyuán, nǐmen yǒu shénme hǎochī de? (Phục vụ ơi, có món gì ngon?)
服务员: 我们的招牌菜是宫保鸡丁。 Wǒmen de zhāopái cài shì gōngbǎo jīdīng. (Món đặc trưng của chúng tôi là gà cung bảo.)
顾客: 好，来一个，不要太辣。   Hǎo, lái yíge, búyào tài là. (Được, cho một phần, đừng cay quá.)
服务员: 好的，请稍等。         Hǎo de, qǐng shāo děng.      (Vâng, xin đợi chút.)
顾客: 再来一碗米饭，然后结账。 Zài lái yì wǎn mǐfàn, ránhòu jiézhàng. (Thêm một bát cơm, rồi tính tiền.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 不要 trước thanh 4 đọc thành bú·yào; ở đây 要 đọc ngắn. 再来一个 (zài lái yíge) là cách nói tự nhiên để gọi thêm món.</div>`,
  ]]);

const b4q = quiz('chs121-quiz-4', 'Quiz 4 — At the restaurant|||Quiz 4 — Ở nhà hàng', [
  { id: 'q1', question: 'Hỏi "có món gì ngon?" đúng là? / How do you ask what good food they have?', options: ['有什么好吃的？', '怎么走？', '多大？', '在哪儿？'], correctIndex: 0, explanation: '有什么 (có gì) + 好吃的 (món ngon) → 有什么好吃的?' },
  { id: 'q2', question: '"不要太辣" nghĩa là gì? / What does 不要太辣 mean?', options: ['Đừng cay quá|||Not too spicy', 'Thêm một cái|||One more', 'Tính tiền|||The bill', 'Rất ngon|||Very tasty'], correctIndex: 0, explanation: '不要 (đừng) + 太辣 (cay quá) = đừng cay quá.' },
  { id: 'q3', question: 'Gọi "tính tiền" ở nhà hàng dùng từ nào? / Which word asks for the bill?', options: ['结账 jiézhàng', '点菜 diǎn cài', '试试 shìshi', '换乘 huànchéng'], correctIndex: 0, explanation: '结账 jiézhàng = thanh toán, tính tiền.' },
]);

const b5 = doc('chs121-5-1-shopping', 'Lesson 5 — Shopping|||Bài 5 — Đi mua sắm',
  'Mẫu câu: 我可以试试吗, 有大一点儿的吗, 有别的颜色吗, 太贵了能不能便宜; từ 合适/颜色/件; luyện thử đồ và trả giá.',
  [[
    `<span class="eyebrow">CHS121 · Lesson 5 · Shopping</span>
<h2>Shopping</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>试试</td><td>shìshi</td><td>to try on</td></tr>
<tr><td>衣服</td><td>yīfu</td><td>clothes</td></tr>
<tr><td>大一点儿</td><td>dà yìdiǎnr</td><td>a bit bigger</td></tr>
<tr><td>小一点儿</td><td>xiǎo yìdiǎnr</td><td>a bit smaller</td></tr>
<tr><td>别的</td><td>biéde</td><td>other, another</td></tr>
<tr><td>颜色</td><td>yánsè</td><td>colour</td></tr>
<tr><td>合适</td><td>héshì</td><td>suitable, a good fit</td></tr>
<tr><td>太贵了</td><td>tài guì le</td><td>too expensive</td></tr>
<tr><td>便宜点儿</td><td>piányi diǎnr</td><td>a bit cheaper</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我可以试试吗?</strong> wǒ kěyǐ shìshi ma? — may I try it on?</li>
<li><strong>有大一点儿的吗?</strong> — do you have a bigger one? Also 有别的颜色吗? (another colour?).</li>
<li><strong>很合适!</strong> hěn héshì! — it fits well! (about clothes / shoes).</li>
<li><strong>太贵了，能不能便宜点儿?</strong> — too expensive, can it be a bit cheaper?</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>顾客: 这件衣服我可以试试吗？ Zhè jiàn yīfu wǒ kěyǐ shìshi ma? (May I try this piece of clothing on?)
店员: 当然可以。           Dāngrán kěyǐ.               (Of course.)
顾客: 有点儿小，有大一点儿的吗？ Yǒudiǎnr xiǎo, yǒu dà yìdiǎnr de ma? (A bit small, do you have a bigger one?)
店员: 有，这件怎么样？     Yǒu, zhè jiàn zěnmeyàng?    (Yes, how about this one?)
顾客: 很合适！有别的颜色吗？ Hěn héshì! Yǒu biéde yánsè ma? (It fits well! Any other colours?)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 试试 (shìshi) is a reduplicated verb — the second 试 is light: shì·shi, meaning to try just a little. 件 (jiàn) is the measure word for clothes: 一件衣服.</div>`,
    `<span class="eyebrow">CHS121 · Bài 5 · Mua sắm</span>
<h2>Đi mua sắm</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>试试</td><td>shìshi</td><td>mặc thử, thử</td></tr>
<tr><td>衣服</td><td>yīfu</td><td>quần áo</td></tr>
<tr><td>大一点儿</td><td>dà yìdiǎnr</td><td>to hơn một chút</td></tr>
<tr><td>小一点儿</td><td>xiǎo yìdiǎnr</td><td>nhỏ hơn một chút</td></tr>
<tr><td>别的</td><td>biéde</td><td>cái khác</td></tr>
<tr><td>颜色</td><td>yánsè</td><td>màu sắc</td></tr>
<tr><td>合适</td><td>héshì</td><td>vừa, hợp</td></tr>
<tr><td>太贵了</td><td>tài guì le</td><td>đắt quá</td></tr>
<tr><td>便宜点儿</td><td>piányi diǎnr</td><td>rẻ chút đi</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我可以试试吗?</strong> wǒ kěyǐ shìshi ma? — tôi mặc thử được không?</li>
<li><strong>有大一点儿的吗?</strong> — có cái to hơn không? Còn có 有别的颜色吗? (có màu khác không?).</li>
<li><strong>很合适!</strong> hěn héshì! — rất vừa! (nói về quần áo / giày).</li>
<li><strong>太贵了，能不能便宜点儿?</strong> — đắt quá, rẻ hơn một chút được không?</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>顾客: 这件衣服我可以试试吗？ Zhè jiàn yīfu wǒ kěyǐ shìshi ma? (Bộ đồ này tôi mặc thử được không?)
店员: 当然可以。           Dāngrán kěyǐ.               (Tất nhiên được.)
顾客: 有点儿小，有大一点儿的吗？ Yǒudiǎnr xiǎo, yǒu dà yìdiǎnr de ma? (Hơi nhỏ, có cái to hơn không?)
店员: 有，这件怎么样？     Yǒu, zhè jiàn zěnmeyàng?    (Có, cái này thế nào?)
顾客: 很合适！有别的颜色吗？ Hěn héshì! Yǒu biéde yánsè ma? (Rất vừa! Có màu khác không?)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 试试 (shìshi) là động từ lặp — 试 thứ hai đọc nhẹ: shì·shi, nghĩa là thử một chút. 件 (jiàn) là lượng từ cho quần áo: 一件衣服.</div>`,
  ]]);

const b5q = quiz('chs121-quiz-5', 'Quiz 5 — Shopping|||Quiz 5 — Đi mua sắm', [
  { id: 'q1', question: 'Hỏi "tôi mặc thử được không?" đúng là? / How do you ask to try something on?', options: ['我可以试试吗？', '多少钱？', '几点见？', '你好吗？'], correctIndex: 0, explanation: '可以 (được) + 试试 (mặc thử) + 吗 → 我可以试试吗?' },
  { id: 'q2', question: 'Hỏi "có màu khác không?" dùng cụm nào? / Which phrase asks for another colour?', options: ['有别的颜色吗？', '太贵了', '打错了', '多喝水'], correctIndex: 0, explanation: '别的 (khác) + 颜色 (màu) + 吗 → 有别的颜色吗?' },
  { id: 'q3', question: '"大一点儿" nghĩa là gì? / What does 大一点儿 mean?', options: ['To hơn một chút|||A bit bigger', 'Rẻ hơn|||Cheaper', 'Nhỏ hơn nhiều|||Much smaller', 'Đắt quá|||Too expensive'], correctIndex: 0, explanation: '大 (to) + 一点儿 (một chút) = to hơn một chút.' },
]);

const b6 = doc('chs121-6-1-directions-transport', 'Lesson 6 — Directions &amp; transport|||Bài 6 — Hỏi đường &amp; phương tiện',
  'Mẫu câu: 到…怎么走, 坐地铁还是坐公交, 要换乘吗, 大概多长时间; từ 站/一直走/换乘; luyện hỏi đường và chọn phương tiện.',
  [[
    `<span class="eyebrow">CHS121 · Lesson 6 · Directions</span>
<h2>Directions &amp; transport</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>怎么走</td><td>zěnme zǒu</td><td>how to get there</td></tr>
<tr><td>地铁</td><td>dìtiě</td><td>subway</td></tr>
<tr><td>公交车</td><td>gōngjiāochē</td><td>bus</td></tr>
<tr><td>还是</td><td>háishi</td><td>or (in a choice)</td></tr>
<tr><td>换乘</td><td>huànchéng</td><td>to change / transfer</td></tr>
<tr><td>大概</td><td>dàgài</td><td>about, roughly</td></tr>
<tr><td>多长时间</td><td>duō cháng shíjiān</td><td>how long (time)</td></tr>
<tr><td>站</td><td>zhàn</td><td>station, stop</td></tr>
<tr><td>一直走</td><td>yìzhí zǒu</td><td>go straight</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>请问，到…怎么走?</strong> — may I ask, how do I get to …?</li>
<li><strong>坐地铁还是坐公交?</strong> — go by subway or by bus? 还是 asks a choice.</li>
<li><strong>要换乘吗?</strong> yào huànchéng ma? — do I need to transfer?</li>
<li><strong>大概要多长时间?</strong> — roughly how long does it take?</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 请问，到火车站怎么走？ Qǐngwèn, dào huǒchēzhàn zěnme zǒu? (May I ask, how do I get to the train station?)
B: 你坐地铁还是坐公交？   Nǐ zuò dìtiě háishi zuò gōngjiāo? (By subway or by bus?)
A: 坐地铁。要换乘吗？     Zuò dìtiě. Yào huànchéng ma? (Subway. Do I need to transfer?)
B: 要，在中心站换乘，大概二十分钟。 Yào, zài zhōngxīn zhàn huànchéng, dàgài èrshí fēnzhōng. (Yes, transfer at Central station, about 20 minutes.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 还是 (háishi) has a light 是 and separates two choices — stress the words on either side (地铁 … 公交), not 还是 itself.</div>`,
    `<span class="eyebrow">CHS121 · Bài 6 · Hỏi đường</span>
<h2>Hỏi đường &amp; phương tiện</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>怎么走</td><td>zěnme zǒu</td><td>đi thế nào</td></tr>
<tr><td>地铁</td><td>dìtiě</td><td>tàu điện ngầm</td></tr>
<tr><td>公交车</td><td>gōngjiāochē</td><td>xe buýt</td></tr>
<tr><td>还是</td><td>háishi</td><td>hay là (trong câu lựa chọn)</td></tr>
<tr><td>换乘</td><td>huànchéng</td><td>chuyển tuyến</td></tr>
<tr><td>大概</td><td>dàgài</td><td>khoảng, đại khái</td></tr>
<tr><td>多长时间</td><td>duō cháng shíjiān</td><td>mất bao lâu</td></tr>
<tr><td>站</td><td>zhàn</td><td>trạm, bến</td></tr>
<tr><td>一直走</td><td>yìzhí zǒu</td><td>đi thẳng</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>请问，到…怎么走?</strong> — cho hỏi, đến … đi thế nào?</li>
<li><strong>坐地铁还是坐公交?</strong> — đi tàu điện hay xe buýt? 还是 dùng để hỏi lựa chọn.</li>
<li><strong>要换乘吗?</strong> yào huànchéng ma? — có phải chuyển tuyến không?</li>
<li><strong>大概要多长时间?</strong> — khoảng mất bao lâu?</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 请问，到火车站怎么走？ Qǐngwèn, dào huǒchēzhàn zěnme zǒu? (Cho hỏi, đến ga tàu đi thế nào?)
B: 你坐地铁还是坐公交？   Nǐ zuò dìtiě háishi zuò gōngjiāo? (Đi tàu điện hay xe buýt?)
A: 坐地铁。要换乘吗？     Zuò dìtiě. Yào huànchéng ma? (Đi tàu điện. Có phải chuyển tuyến không?)
B: 要，在中心站换乘，大概二十分钟。 Yào, zài zhōngxīn zhàn huànchéng, dàgài èrshí fēnzhōng. (Có, chuyển tuyến ở ga trung tâm, khoảng 20 phút.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 还是 (háishi) có 是 đọc nhẹ và ngăn hai lựa chọn — nhấn vào hai vế (地铁 … 公交), đừng nhấn vào 还是.</div>`,
  ]]);

const b6q = quiz('chs121-quiz-6', 'Quiz 6 — Directions &amp; transport|||Quiz 6 — Hỏi đường &amp; phương tiện', [
  { id: 'q1', question: 'Hỏi "đến ga tàu đi thế nào?" đúng là? / How do you ask the way to the train station?', options: ['到火车站怎么走？', '多少钱？', '你几岁？', '有家具吗？'], correctIndex: 0, explanation: '到火车站 (đến ga tàu) + 怎么走 (đi thế nào) → 到火车站怎么走?' },
  { id: 'q2', question: 'Từ "还是" (háishi) dùng để làm gì? / What is 还是 used for?', options: ['Hỏi lựa chọn A hay B|||To ask a choice: A or B', 'Chào hỏi|||To greet', 'Tính tiền|||To pay', 'Cảm ơn|||To thank'], correctIndex: 0, explanation: '还是 nối hai lựa chọn trong câu hỏi: A 还是 B (A hay B).' },
  { id: 'q3', question: 'Hỏi "khoảng mất bao lâu?" đúng là? / How do you ask how long it takes?', options: ['大概要多长时间？', '多少钱？', '你是谁？', '几点见？'], correctIndex: 0, explanation: '大概 (khoảng) + 多长时间 (mất bao lâu) → 大概要多长时间?' },
]);

const b7 = doc('chs121-7-1-renting', 'Lesson 7 — Renting a place &amp; asking the price|||Bài 7 — Thuê nhà &amp; hỏi giá',
  'Mẫu câu: 我想租房, 一个月多少钱, 有没有…, 我想看房, 押金是多少; từ 房子/厨房/卫生间/家具; luyện hỏi thuê nhà.',
  [[
    `<span class="eyebrow">CHS121 · Lesson 7 · Renting</span>
<h2>Renting a place &amp; asking the price</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>房子</td><td>fángzi</td><td>house, place to live</td></tr>
<tr><td>租房</td><td>zū fáng</td><td>to rent a place</td></tr>
<tr><td>一个月</td><td>yí ge yuè</td><td>one month</td></tr>
<tr><td>有没有</td><td>yǒu méiyǒu</td><td>is there … or not</td></tr>
<tr><td>看房</td><td>kàn fáng</td><td>to view the place</td></tr>
<tr><td>厨房</td><td>chúfáng</td><td>kitchen</td></tr>
<tr><td>卫生间</td><td>wèishēngjiān</td><td>bathroom</td></tr>
<tr><td>家具</td><td>jiājù</td><td>furniture</td></tr>
<tr><td>押金</td><td>yājīn</td><td>deposit</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我想租房</strong> wǒ xiǎng zū fáng — I would like to rent a place.</li>
<li><strong>这个房子一个月多少钱?</strong> — how much is this place per month?</li>
<li><strong>有没有…?</strong> yǒu méiyǒu …? — is there …? A quick yes/no question: 有没有家具?</li>
<li><strong>我想看房</strong> / <strong>押金是多少?</strong> — I want to view it / how much is the deposit?</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你好，我想租房。这个房子一个月多少钱？ Nǐ hǎo, wǒ xiǎng zū fáng. Zhège fángzi yí ge yuè duōshao qián? (Hello, I want to rent. How much is this place per month?)
B: 三千块，有家具。     Sānqiān kuài, yǒu jiājù.     (3000 yuan, furnished.)
A: 有没有厨房和卫生间？ Yǒu méiyǒu chúfáng hé wèishēngjiān? (Is there a kitchen and a bathroom?)
B: 都有。你想看房吗？   Dōu yǒu. Nǐ xiǎng kàn fáng ma? (Both. Would you like to view it?)
A: 好，押金是多少？     Hǎo, yājīn shì duōshao?      (Yes, how much is the deposit?)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 有没有 (yǒu méiyǒu) is a positive-negative question — the middle 没 is quick and light. 房子 ends in a neutral 子: fáng·zi.</div>`,
    `<span class="eyebrow">CHS121 · Bài 7 · Thuê nhà</span>
<h2>Thuê nhà &amp; hỏi giá</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>房子</td><td>fángzi</td><td>nhà, chỗ ở</td></tr>
<tr><td>租房</td><td>zū fáng</td><td>thuê nhà</td></tr>
<tr><td>一个月</td><td>yí ge yuè</td><td>một tháng</td></tr>
<tr><td>有没有</td><td>yǒu méiyǒu</td><td>có … hay không</td></tr>
<tr><td>看房</td><td>kàn fáng</td><td>xem nhà</td></tr>
<tr><td>厨房</td><td>chúfáng</td><td>nhà bếp</td></tr>
<tr><td>卫生间</td><td>wèishēngjiān</td><td>nhà vệ sinh</td></tr>
<tr><td>家具</td><td>jiājù</td><td>đồ nội thất</td></tr>
<tr><td>押金</td><td>yājīn</td><td>tiền đặt cọc</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我想租房</strong> wǒ xiǎng zū fáng — tôi muốn thuê nhà.</li>
<li><strong>这个房子一个月多少钱?</strong> — căn nhà này một tháng bao nhiêu tiền?</li>
<li><strong>有没有…?</strong> yǒu méiyǒu …? — có … không? Câu hỏi có/không nhanh gọn: 有没有家具?</li>
<li><strong>我想看房</strong> / <strong>押金是多少?</strong> — tôi muốn xem nhà / tiền cọc bao nhiêu?</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你好，我想租房。这个房子一个月多少钱？ Nǐ hǎo, wǒ xiǎng zū fáng. Zhège fángzi yí ge yuè duōshao qián? (Chào, tôi muốn thuê nhà. Căn này một tháng bao nhiêu?)
B: 三千块，有家具。     Sānqiān kuài, yǒu jiājù.     (3000 tệ, có nội thất.)
A: 有没有厨房和卫生间？ Yǒu méiyǒu chúfáng hé wèishēngjiān? (Có bếp và nhà vệ sinh không?)
B: 都有。你想看房吗？   Dōu yǒu. Nǐ xiǎng kàn fáng ma? (Đều có. Bạn muốn xem nhà không?)
A: 好，押金是多少？     Hǎo, yājīn shì duōshao?      (Được, tiền cọc bao nhiêu?)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 有没有 (yǒu méiyǒu) là câu hỏi khẳng định-phủ định — chữ 没 ở giữa đọc nhanh và nhẹ. 房子 kết bằng 子 thanh nhẹ: fáng·zi.</div>`,
  ]]);

const b7q = quiz('chs121-quiz-7', 'Quiz 7 — Renting a place|||Quiz 7 — Thuê nhà', [
  { id: 'q1', question: 'Hỏi "một tháng bao nhiêu tiền?" đúng là? / How do you ask the monthly rent?', options: ['一个月多少钱？', '怎么走？', '几点了？', '你好吗？'], correctIndex: 0, explanation: '一个月 (một tháng) + 多少钱 (bao nhiêu tiền) → 一个月多少钱?' },
  { id: 'q2', question: '"有没有家具?" hỏi điều gì? / What does 有没有家具 ask?', options: ['Có nội thất không|||Is there furniture', 'Bao nhiêu tiền|||How much', 'Ở đâu|||Where', 'Khi nào|||When'], correctIndex: 0, explanation: '有没有 (có … không) + 家具 (nội thất) = có nội thất không?' },
  { id: 'q3', question: 'Muốn "xem nhà" thì nói thế nào? / How do you say you want to view the place?', options: ['我想看房', '我要结账', '我打错了', '我很累'], correctIndex: 0, explanation: '想 (muốn) + 看房 (xem nhà) → 我想看房.' },
]);

const b8 = doc('chs121-8-1-telling-a-story', 'Lesson 8 — Telling a simple story|||Bài 8 — Kể chuyện đơn giản',
  'Mẫu câu: 先…然后…最后, 我觉得…, 很有意思, 昨天我去…了; kể lại một ngày/một chuyến đi theo trình tự.',
  [[
    `<span class="eyebrow">CHS121 · Lesson 8 · Telling a story</span>
<h2>Telling a simple story</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>先</td><td>xiān</td><td>first</td></tr>
<tr><td>然后</td><td>ránhòu</td><td>then, after that</td></tr>
<tr><td>最后</td><td>zuìhòu</td><td>finally, in the end</td></tr>
<tr><td>觉得</td><td>juéde</td><td>to feel, to think</td></tr>
<tr><td>有意思</td><td>yǒu yìsi</td><td>interesting</td></tr>
<tr><td>昨天</td><td>zuótiān</td><td>yesterday</td></tr>
<tr><td>旅行</td><td>lǚxíng</td><td>to travel</td></tr>
<tr><td>公园</td><td>gōngyuán</td><td>park</td></tr>
<tr><td>累</td><td>lèi</td><td>tired</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>先…，然后…，最后…</strong> — first …, then …, finally …. The frame for telling what you did in order.</li>
<li><strong>我觉得…</strong> wǒ juéde… — I feel / I think … : 我觉得很有意思.</li>
<li><strong>很有意思</strong> hěn yǒu yìsi — very interesting.</li>
<li><strong>昨天我去…了</strong> — yesterday I went … . 了 marks a completed action.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你昨天做什么了？   Nǐ zuótiān zuò shénme le? (What did you do yesterday?)
B: 我去旅行了。先去了公园，然后吃了饭，最后看了电影。 Wǒ qù lǚxíng le. Xiān qùle gōngyuán, ránhòu chīle fàn, zuìhòu kànle diànyǐng. (I went on a trip. First the park, then a meal, finally a movie.)
A: 玩儿得怎么样？     Wánr de zěnmeyàng?       (How was it?)
B: 很有意思，我觉得很高兴，就是有点儿累。 Hěn yǒu yìsi, wǒ juéde hěn gāoxìng, jiùshì yǒudiǎnr lèi. (Very interesting, I felt happy, just a bit tired.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 先…然后…最后 give a story its rhythm — pause a beat at each word. 觉得 ends in a neutral 得: jué·de. 有意思 ends in a light 思: yǒu yì·si.</div>`,
    `<span class="eyebrow">CHS121 · Bài 8 · Kể chuyện</span>
<h2>Kể chuyện đơn giản</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>先</td><td>xiān</td><td>đầu tiên, trước</td></tr>
<tr><td>然后</td><td>ránhòu</td><td>sau đó</td></tr>
<tr><td>最后</td><td>zuìhòu</td><td>cuối cùng</td></tr>
<tr><td>觉得</td><td>juéde</td><td>cảm thấy, thấy</td></tr>
<tr><td>有意思</td><td>yǒu yìsi</td><td>thú vị</td></tr>
<tr><td>昨天</td><td>zuótiān</td><td>hôm qua</td></tr>
<tr><td>旅行</td><td>lǚxíng</td><td>du lịch, đi chơi</td></tr>
<tr><td>公园</td><td>gōngyuán</td><td>công viên</td></tr>
<tr><td>累</td><td>lèi</td><td>mệt</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>先…，然后…，最后…</strong> — đầu tiên …, sau đó …, cuối cùng …. Khung để kể lại việc theo trình tự.</li>
<li><strong>我觉得…</strong> wǒ juéde… — tôi thấy / tôi cảm thấy … : 我觉得很有意思.</li>
<li><strong>很有意思</strong> hěn yǒu yìsi — rất thú vị.</li>
<li><strong>昨天我去…了</strong> — hôm qua tôi đã đi … . 了 báo một việc đã hoàn thành.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你昨天做什么了？   Nǐ zuótiān zuò shénme le? (Hôm qua bạn làm gì?)
B: 我去旅行了。先去了公园，然后吃了饭，最后看了电影。 Wǒ qù lǚxíng le. Xiān qùle gōngyuán, ránhòu chīle fàn, zuìhòu kànle diànyǐng. (Tôi đi chơi. Đầu tiên đến công viên, sau đó ăn cơm, cuối cùng xem phim.)
A: 玩儿得怎么样？     Wánr de zěnmeyàng?       (Chơi thế nào?)
B: 很有意思，我觉得很高兴，就是有点儿累。 Hěn yǒu yìsi, wǒ juéde hěn gāoxìng, jiùshì yǒudiǎnr lèi. (Rất thú vị, tôi thấy rất vui, chỉ là hơi mệt.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 先…然后…最后 tạo nhịp cho câu chuyện — ngắt một nhịp ở mỗi từ. 觉得 kết bằng 得 thanh nhẹ: jué·de. 有意思 kết bằng 思 nhẹ: yǒu yì·si.</div>`,
  ]]);

const b8q = quiz('chs121-quiz-8', 'Quiz 8 — Telling a simple story|||Quiz 8 — Kể chuyện đơn giản', [
  { id: 'q1', question: 'Trình tự "đầu tiên… sau đó… cuối cùng" là cụm nào? / Which set means first… then… finally?', options: ['先…然后…最后', '多少钱', '怎么走', '有意思'], correctIndex: 0, explanation: '先 (đầu tiên) … 然后 (sau đó) … 最后 (cuối cùng) — khung kể theo trình tự.' },
  { id: 'q2', question: '"很有意思" nghĩa là gì? / What does 很有意思 mean?', options: ['Rất thú vị|||Very interesting', 'Rất mệt|||Very tired', 'Rất đắt|||Very expensive', 'Rất xa|||Very far'], correctIndex: 0, explanation: '很 (rất) + 有意思 (thú vị) = rất thú vị.' },
  { id: 'q3', question: 'Từ "觉得" (juéde) nghĩa là? / What does 觉得 mean?', options: ['cảm thấy, thấy|||to feel, to think', 'đi bộ|||to walk', 'mua|||to buy', 'ngủ|||to sleep'], correctIndex: 0, explanation: '觉得 juéde = cảm thấy, cho rằng: 我觉得… (tôi thấy…).' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'CHS121',
    slug: 'chs121-chinese-speaking-2',
    title: 'Chinese speaking 2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHS121.webp',
    shortDescription: 'Spoken Chinese 2 (HSK2), continuing CHS111: hobbies, weather & health, phone calls, ordering food, shopping, directions & transport, renting, telling a simple story. Real dialogues, pronunciation notes, bilingual, quizzes.|||Tiếng Trung giao tiếp 2 (HSK2), nối tiếp CHS111: sở thích, thời tiết & sức khoẻ, gọi điện, gọi món, mua sắm, hỏi đường, thuê nhà, kể chuyện. Hội thoại thật, ghi chú phát âm, song ngữ, quiz.',
    description: 'Môn <strong>CHS121 — Chinese Speaking 2 (Tiếng Trung giao tiếp 2)</strong> là môn <strong>luyện nói</strong> ở trình độ khẩu ngữ <strong>HSK2</strong>, <strong>nối tiếp CHS111</strong>. Mở rộng chủ đề giao tiếp hằng ngày: <strong>sở thích &amp; cuối tuần</strong> → <strong>thời tiết &amp; sức khoẻ</strong> → <strong>gọi điện &amp; hẹn</strong> → <strong>gọi món ở nhà hàng</strong> → <strong>mua sắm</strong> → <strong>hỏi đường &amp; phương tiện</strong> → <strong>thuê nhà &amp; hỏi giá</strong> → <strong>kể chuyện đơn giản</strong>. Bám giáo trình khẩu ngữ chuẩn (汉语口语速成 基础篇 / HSK Standard Course 2), song ngữ Trung–Việt, mỗi bài có bảng từ vựng khẩu ngữ (汉字|pinyin|nghĩa), mẫu câu giao tiếp trọng tâm, hội thoại thực tế để nói nhại &amp; đóng vai, ghi chú phát âm/ngữ điệu và quiz. Học theo lộ trình 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.',
    whatYouLearn: 'Nói về sở thích &amp; cuối tuần (周末做什么, 喜欢, 爱好, 一起去…吧); hỏi thăm thời tiết &amp; sức khoẻ (今天天气怎么样, 不舒服, 感冒, 多喝水多休息); gọi điện &amp; hẹn (喂, 请问…在吗, 打错了, 什么时候方便); gọi món ở nhà hàng (有什么好吃的, 不要太辣, 再来一个, 结账); mua sắm &amp; thử đồ (试试, 大一点儿, 别的颜色, 太贵了能不能便宜); hỏi đường &amp; chọn phương tiện (到…怎么走, 坐地铁还是公交, 换乘, 大概多长时间); thuê nhà &amp; hỏi giá (一个月多少钱, 有没有, 看房, 押金); kể chuyện đơn giản (先…然后…最后, 觉得, 有意思). Nói được các hội thoại hằng ngày dài hơn với phát âm rõ.',
    requirements: 'Nên học xong CHS111 (nền phát âm, 4 thanh, câu giao tiếp cơ bản) trước khi vào môn này. Cài Pleco hoặc HelloChinese để nghe audio bản ngữ &amp; luyện nói theo; hãy nói to và tự thu âm để so với mẫu.',
  },
  sections: [
    { title: '📚 Tài liệu &amp; lộ trình luyện nói|||📚 Course materials', description: 'Giáo trình khẩu ngữ 汉语口语速成 基础篇, app luyện nói, lộ trình 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CHS111: nhắc nền phát âm/thanh điệu, mục tiêu giao tiếp HSK2, cách luyện nói theo chủ đề mở rộng.', lessons: [intro] },
    { title: 'Bài 1 — Sở thích &amp; cuối tuần|||Lesson 1 — Hobbies & the weekend', description: '周末做什么, 喜欢, 爱好, 一起去…吧.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Thời tiết &amp; sức khoẻ|||Lesson 2 — Weather & health', description: '今天天气怎么样, 不舒服, 感冒, 多喝水.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Gọi điện &amp; hẹn|||Lesson 3 — Phone calls', description: '喂, 请问…在吗, 打错了, 什么时候方便.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Ở nhà hàng|||Lesson 4 — At the restaurant', description: '有什么好吃的, 不要太辣, 再来一个, 结账.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Đi mua sắm|||Lesson 5 — Shopping', description: '试试, 大一点儿, 别的颜色, 太贵了能不能便宜.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Hỏi đường &amp; phương tiện|||Lesson 6 — Directions & transport', description: '到…怎么走, 坐地铁还是公交, 换乘, 大概多长时间.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Thuê nhà &amp; hỏi giá|||Lesson 7 — Renting a place', description: '房子, 一个月多少钱, 有没有, 看房.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Kể chuyện đơn giản|||Lesson 8 — Telling a simple story', description: '先…然后…最后, 觉得, 有意思.', lessons: [b8, b8q] },
  ],
};
