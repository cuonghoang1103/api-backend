/**
 * CHS111 — Chinese Speaking 1 (Tiếng Trung giao tiếp/nói 1). Khối Ngôn ngữ
 * Trung FPTU. Đây là MÔN NGÔN NGỮ, track LUYỆN NÓI: nhấn phát âm chuẩn, mẫu
 * câu giao tiếp, hội thoại thực tế và luyện nói ở trình độ nhập môn khẩu ngữ
 * (HSK1-2). Giáo trình chuẩn: 汉语口语速成 (Short-term Spoken Chinese) 入门篇/
 * 基础篇, HSK Standard Course. Lộ trình 4 bước: Nghe → Bắt chước → Luyện cặp →
 * Ứng dụng.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; trong
 * HTML content "&" → "&amp;". shortDescription dùng "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & mẫu câu giao tiếp của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chs111-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình luyện nói',
  'Giáo trình khẩu ngữ chuẩn (汉语口语速成 Short-term Spoken Chinese, HSK Standard Course), app luyện nói (HelloChinese/Pleco), lộ trình 4 bước: Nghe → Bắt chước → Luyện cặp → Ứng dụng.',
  [[
    `<span class="eyebrow">CHS111 · Materials</span>
<h2>How to build spoken Chinese — materials &amp; roadmap</h2>
<p class="lead">Chinese Speaking 1 is a <strong>speaking-first</strong> course at the <strong>HSK1-2</strong> level. The goal is not to read the most characters, but to <strong>open your mouth</strong>: correct pronunciation, the <strong>4 tones</strong>, and the fixed phrases you say in real situations.</p>
<h3>📘 Standard textbooks (spoken track)</h3>
<ul>
<li><strong>汉语口语速成 (Short-term Spoken Chinese)</strong> — 入门篇 / 基础篇 (Beijing Language and Culture University Press): the mainstream spoken-Chinese coursebook.</li>
<li><strong>HSK Standard Course 1-2</strong> — vocabulary &amp; grammar that back up each speaking topic.</li>
</ul>
<h3>📱 Apps for speaking &amp; sound</h3>
<ul>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — beginner course with speech-recognition practice.</li>
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
    `<span class="eyebrow">CHS111 · Tài liệu</span>
<h2>Cách luyện nói tiếng Trung — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung giao tiếp 1 là môn <strong>lấy nói làm gốc</strong> ở trình độ <strong>HSK1-2</strong>. Mục tiêu không phải đọc được nhiều chữ, mà là <strong>mở miệng nói</strong>: phát âm chuẩn, <strong>4 thanh điệu</strong>, và những câu cố định dùng trong tình huống thật.</p>
<h3>📘 Giáo trình chuẩn (hướng khẩu ngữ)</h3>
<ul>
<li><strong>汉语口语速成 (Short-term Spoken Chinese)</strong> — 入门篇 / 基础篇 (NXB Đại học Ngôn ngữ Bắc Kinh): giáo trình khẩu ngữ phổ biến nhất.</li>
<li><strong>HSK Standard Course 1-2</strong> — từ vựng &amp; ngữ pháp nền cho mỗi chủ đề nói.</li>
</ul>
<h3>📱 App luyện nói &amp; nghe âm</h3>
<ul>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — khoá nhập môn có nhận diện giọng nói.</li>
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

const intro = doc('chs111-0-1-overview', 'Course overview: Chinese Speaking 1|||Tổng quan: Tiếng Trung giao tiếp 1',
  'Mục tiêu giao tiếp (nói được trong tình huống hằng ngày, HSK1-2), tầm quan trọng của phát âm & thanh điệu, cách luyện nói hiệu quả.',
  [[
    `<span class="eyebrow">CHS111 · Lesson 0.1 · Overview</span>
<h2>Chinese Speaking 1 (HSK1-2)</h2>
<p class="lead">This is a <strong>communication course</strong>. By the end you can <strong>hold short everyday conversations</strong> in Mandarin: greet people and get acquainted, ask for personal information, cope inside a classroom or office, shop and bargain, order food, ask for directions, and make plans to meet.</p>
<h3>Why pronunciation comes first</h3>
<ul>
<li><strong>Tones carry meaning</strong> — Mandarin has <strong>4 tones</strong> plus a neutral tone; the same syllable in a different tone is a different word (mā 妈 mother vs mǎ 马 horse). A wrong tone is a wrong word, so we drill sound before anything else.</li>
<li><strong>Speaking is a habit, not knowledge</strong> — you learn it by saying phrases out loud many times, not by reading about them.</li>
<li><strong>Fixed phrases</strong> — spoken Chinese runs on set patterns (请问… , 多少钱? , 怎么走?). Learn the whole phrase, use it as one block.</li>
</ul>
<h3>How each lesson works</h3>
<p>Every lesson gives you a <strong>spoken vocabulary &amp; phrase table</strong> (汉字 | pinyin | nghĩa), the <strong>key communication patterns</strong> to memorise, a <strong>real dialogue</strong> to shadow and role-play, and <strong>pronunciation / intonation notes</strong>. Then a short quiz. Always follow the 4 steps: listen → imitate → pair-drill → apply.</p>
<h3>Roadmap</h3>
<p>Pronunciation &amp; tones → greetings &amp; getting acquainted → personal information → classroom &amp; office → shopping &amp; bargaining → eating &amp; ordering → directions &amp; getting around → making appointments &amp; invitations.</p>`,
    `<span class="eyebrow">CHS111 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung giao tiếp 1 (HSK1-2)</h2>
<p class="lead">Đây là môn <strong>giao tiếp</strong>. Học xong bạn có thể <strong>nói được các hội thoại ngắn hằng ngày</strong> bằng tiếng phổ thông: chào hỏi &amp; làm quen, hỏi thông tin cá nhân, xoay xở trong lớp học hay công sở, mua sắm &amp; mặc cả, gọi món, hỏi đường, và hẹn gặp nhau.</p>
<h3>Vì sao phát âm phải học trước</h3>
<ul>
<li><strong>Thanh điệu mang nghĩa</strong> — tiếng phổ thông có <strong>4 thanh</strong> cộng thanh nhẹ; cùng một âm khác thanh là khác từ (mā 妈 mẹ vs mǎ 马 ngựa). Sai thanh là sai từ, nên ta luyện âm trước tiên.</li>
<li><strong>Nói là thói quen, không phải kiến thức</strong> — bạn học nói bằng cách nói to nhiều lần, không phải bằng đọc về nó.</li>
<li><strong>Câu cố định</strong> — khẩu ngữ tiếng Trung chạy bằng các mẫu có sẵn (请问… , 多少钱? , 怎么走?). Hãy học cả cụm, dùng như một khối.</li>
</ul>
<h3>Mỗi bài học ra sao</h3>
<p>Mỗi bài có <strong>bảng từ vựng &amp; mẫu câu khẩu ngữ</strong> (汉字 | pinyin | nghĩa), các <strong>mẫu câu giao tiếp trọng tâm</strong> để thuộc, một <strong>hội thoại thực tế</strong> để nói nhại &amp; đóng vai, và <strong>ghi chú phát âm / ngữ điệu</strong>. Sau đó là quiz ngắn. Luôn theo 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.</p>
<h3>Lộ trình</h3>
<p>Phát âm &amp; thanh điệu → chào hỏi &amp; làm quen → thông tin cá nhân → lớp học &amp; công sở → mua sắm &amp; mặc cả → ăn uống &amp; gọi món → hỏi đường &amp; đi lại → hẹn &amp; mời.</p>`,
  ]]);

const b1 = doc('chs111-1-1-pronunciation', 'Lesson 1 — Standard pronunciation &amp; tones|||Bài 1 — Phát âm chuẩn &amp; thanh điệu',
  'Thanh mẫu/vận mẫu khó (zh ch sh r, j q x, z c s, ü); 4 thanh + thanh nhẹ; quy tắc biến điệu; bài luyện thanh (tone drill).',
  [[
    `<span class="eyebrow">CHS111 · Lesson 1 · Pronunciation</span>
<h2>Standard pronunciation &amp; the four tones</h2>
<h3>1. Tricky sounds to drill</h3>
<table>
<tr><th>Sound</th><th>How to say it</th><th>Example</th></tr>
<tr><td>j q x</td><td>tongue flat, smiling — soft</td><td>jī 鸡 chicken · qī 七 seven · xī 西 west</td></tr>
<tr><td>zh ch sh r</td><td>tongue curled back</td><td>zhè 这 this · chī 吃 eat · shì 是 be · rén 人 person</td></tr>
<tr><td>z c s</td><td>tongue tip at the teeth</td><td>zǎo 早 early · cài 菜 dish · sān 三 three</td></tr>
<tr><td>ü (u with dots)</td><td>say ee, then round the lips</td><td>nǚ 女 female · lǜ 绿 green</td></tr>
</table>
<h3>2. The four tones (声调 shēngdiào)</h3>
<table>
<tr><th>Tone</th><th>Mark</th><th>Contour</th><th>Example</th></tr>
<tr><td>1st</td><td>ā</td><td>high &amp; flat</td><td>mā 妈 — mother</td></tr>
<tr><td>2nd</td><td>á</td><td>rising</td><td>má 麻 — hemp</td></tr>
<tr><td>3rd</td><td>ǎ</td><td>falling-rising</td><td>mǎ 马 — horse</td></tr>
<tr><td>4th</td><td>à</td><td>sharp falling</td><td>mà 骂 — to scold</td></tr>
<tr><td>neutral</td><td>ma</td><td>light, short</td><td>ma 吗 — question particle</td></tr>
</table>
<h3>3. Tone-change rules you hear when speaking</h3>
<ul>
<li><strong>Two 3rd tones</strong>: the first becomes 2nd — nǐ + hǎo → <strong>ní hǎo</strong> (你好).</li>
<li><strong>不 bù → bú</strong> before a 4th tone: bú shì (不是, is not).</li>
<li><strong>一 yī → yì / yí</strong> depending on the next tone: yì bēi (一杯), yí ge (一个).</li>
</ul>
<h3>4. Tone drill (luyện thanh) — say out loud</h3>
<pre><code>mā  má  mǎ  mà        (妈 麻 马 骂)
bā  bá  bǎ  bà        (八 拔 把 爸)
yī  èr  sān  sì  wǔ   (1 2 3 4 5 — hear each tone)
nǐ hǎo → ní hǎo      (drill the 3+3 change)
</code></pre>
<div class="callout"><span class="badge">Pronunciation note</span> The tone mark sits on the main vowel. A 3rd-tone ǎ dips down then up. Record yourself and compare with Pleco audio — your ear improves faster than your mouth.</div>`,
    `<span class="eyebrow">CHS111 · Bài 1 · Phát âm</span>
<h2>Phát âm chuẩn &amp; bốn thanh điệu</h2>
<h3>1. Những âm khó cần luyện</h3>
<table>
<tr><th>Âm</th><th>Cách phát âm</th><th>Ví dụ</th></tr>
<tr><td>j q x</td><td>lưỡi bẹt, miệng cười — âm nhẹ</td><td>jī 鸡 gà · qī 七 bảy · xī 西 tây</td></tr>
<tr><td>zh ch sh r</td><td>cong lưỡi ra sau</td><td>zhè 这 này · chī 吃 ăn · shì 是 là · rén 人 người</td></tr>
<tr><td>z c s</td><td>đầu lưỡi chạm chân răng</td><td>zǎo 早 sớm · cài 菜 món · sān 三 ba</td></tr>
<tr><td>ü (u hai chấm)</td><td>đọc i rồi tròn môi lại</td><td>nǚ 女 nữ · lǜ 绿 xanh lá</td></tr>
</table>
<h3>2. Bốn thanh điệu (声调 shēngdiào)</h3>
<table>
<tr><th>Thanh</th><th>Dấu</th><th>Diễn biến</th><th>Ví dụ</th></tr>
<tr><td>1</td><td>ā</td><td>cao &amp; ngang</td><td>mā 妈 — mẹ</td></tr>
<tr><td>2</td><td>á</td><td>lên (như dấu sắc)</td><td>má 麻 — cây gai</td></tr>
<tr><td>3</td><td>ǎ</td><td>xuống rồi lên</td><td>mǎ 马 — con ngựa</td></tr>
<tr><td>4</td><td>à</td><td>xuống gắt</td><td>mà 骂 — mắng</td></tr>
<tr><td>nhẹ</td><td>ma</td><td>nhẹ, ngắn</td><td>ma 吗 — trợ từ hỏi</td></tr>
</table>
<h3>3. Quy tắc biến điệu nghe thấy khi nói</h3>
<ul>
<li><strong>Hai thanh 3</strong> liền nhau: thanh 3 đầu đọc thành thanh 2 — nǐ + hǎo → <strong>ní hǎo</strong> (你好).</li>
<li><strong>不 bù → bú</strong> khi trước thanh 4: bú shì (不是, không phải).</li>
<li><strong>一 yī → yì / yí</strong> tuỳ thanh chữ sau: yì bēi (一杯), yí ge (一个).</li>
</ul>
<h3>4. Bài luyện thanh — đọc to</h3>
<pre><code>mā  má  mǎ  mà        (妈 麻 马 骂)
bā  bá  bǎ  bà        (八 拔 把 爸)
yī  èr  sān  sì  wǔ   (1 2 3 4 5 — nghe rõ từng thanh)
nǐ hǎo → ní hǎo      (luyện biến điệu 3+3)
</code></pre>
<div class="callout"><span class="badge">Ghi chú phát âm</span> Dấu thanh đặt trên nguyên âm chính. Thanh 3 ǎ hạ xuống rồi nâng lên. Hãy tự thu âm rồi so với audio Pleco — tai bạn tiến nhanh hơn miệng.</div>`,
  ]]);

const b1q = quiz('chs111-quiz-1', 'Quiz 1 — Pronunciation &amp; tones|||Quiz 1 — Phát âm &amp; thanh điệu', [
  { id: 'q1', question: 'Tiếng phổ thông có mấy thanh điệu (không kể thanh nhẹ)? / How many tones does Mandarin have (not counting the neutral tone)?', options: ['2', '3', '4', '6'], correctIndex: 2, explanation: '4 thanh: ā (cao ngang), á (lên), ǎ (xuống-lên), à (xuống gắt).' },
  { id: 'q2', question: 'Khi 你 (nǐ) + 好 (hǎo) đứng cạnh nhau thì đọc thế nào? / When nǐ + hǎo meet, how are they read?', options: ['nì hǎo', 'ní hǎo', 'nǐ háo', 'nī hao'], correctIndex: 1, explanation: 'Hai thanh 3 liền nhau: thanh 3 đầu biến thành thanh 2 → ní hǎo.' },
  { id: 'q3', question: 'Nhóm âm nào phát âm bằng cách CONG lưỡi ra sau? / Which group is pronounced with the tongue curled back?', options: ['j q x', 'z c s', 'zh ch sh r', 'b p m'], correctIndex: 2, explanation: 'zh ch sh r là âm cong lưỡi (chī 吃, shì 是); j q x thì lưỡi bẹt.' },
]);

const b2 = doc('chs111-2-1-greetings', 'Lesson 2 — Greetings &amp; getting acquainted|||Bài 2 — Chào hỏi &amp; làm quen',
  'Mẫu câu: 你好/您好, 请问, 很高兴认识你, 你是哪国人; đại từ 我/你/他; luyện chào hỏi và tự giới thiệu khi gặp lần đầu.',
  [[
    `<span class="eyebrow">CHS111 · Lesson 2 · Greetings</span>
<h2>Greetings &amp; getting acquainted</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>你好</td><td>nǐ hǎo</td><td>hello</td></tr>
<tr><td>您好</td><td>nín hǎo</td><td>hello (polite)</td></tr>
<tr><td>请问</td><td>qǐng wèn</td><td>may I ask …</td></tr>
<tr><td>认识</td><td>rènshi</td><td>to know / get acquainted</td></tr>
<tr><td>高兴</td><td>gāoxìng</td><td>glad, happy</td></tr>
<tr><td>哪国人</td><td>nǎ guó rén</td><td>person of which country</td></tr>
<tr><td>越南</td><td>Yuènán</td><td>Vietnam</td></tr>
<tr><td>中国</td><td>Zhōngguó</td><td>China</td></tr>
<tr><td>再见</td><td>zàijiàn</td><td>goodbye</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>请问，…?</strong> — a polite opener before a question: 请问，你是哪国人? (May I ask, which country are you from?)</li>
<li><strong>很高兴认识你</strong> hěn gāoxìng rènshi nǐ — nice to meet you. Reply: 我也很高兴 (me too).</li>
<li><strong>Nationality = country + 人</strong>: 越南人 (Vietnamese), 中国人 (Chinese).</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你好！请问，你叫什么名字？ Nǐ hǎo! Qǐng wèn, nǐ jiào shénme míngzi? (Hello! May I ask your name?)
B: 我叫小明。你呢？           Wǒ jiào Xiǎomíng. Nǐ ne?           (I am Xiaoming. And you?)
A: 我叫大卫。你是哪国人？     Wǒ jiào Dàwèi. Nǐ shì nǎ guó rén?  (I am David. Which country are you from?)
B: 我是中国人。很高兴认识你！ Wǒ shì Zhōngguó rén. Hěn gāoxìng rènshi nǐ! (I am Chinese. Nice to meet you!)
A: 我也很高兴！               Wǒ yě hěn gāoxìng!                 (Me too!)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 你呢? (nǐ ne?) bounces the question back — say it with a light rising tone. 您 (nín) is the polite you: use it with teachers, elders, customers.</div>`,
    `<span class="eyebrow">CHS111 · Bài 2 · Chào hỏi</span>
<h2>Chào hỏi &amp; làm quen</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>你好</td><td>nǐ hǎo</td><td>xin chào</td></tr>
<tr><td>您好</td><td>nín hǎo</td><td>chào (lịch sự)</td></tr>
<tr><td>请问</td><td>qǐng wèn</td><td>cho hỏi / xin hỏi</td></tr>
<tr><td>认识</td><td>rènshi</td><td>quen biết, làm quen</td></tr>
<tr><td>高兴</td><td>gāoxìng</td><td>vui, vui mừng</td></tr>
<tr><td>哪国人</td><td>nǎ guó rén</td><td>người nước nào</td></tr>
<tr><td>越南</td><td>Yuènán</td><td>Việt Nam</td></tr>
<tr><td>中国</td><td>Zhōngguó</td><td>Trung Quốc</td></tr>
<tr><td>再见</td><td>zàijiàn</td><td>tạm biệt</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>请问，…?</strong> — mở đầu lịch sự trước khi hỏi: 请问，你是哪国人? (Cho hỏi, bạn là người nước nào?)</li>
<li><strong>很高兴认识你</strong> hěn gāoxìng rènshi nǐ — rất vui được biết bạn. Đáp: 我也很高兴 (tôi cũng vậy).</li>
<li><strong>Quốc tịch = tên nước + 人</strong>: 越南人 (người Việt Nam), 中国人 (người Trung Quốc).</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你好！请问，你叫什么名字？ Nǐ hǎo! Qǐng wèn, nǐ jiào shénme míngzi? (Chào! Cho hỏi bạn tên gì?)
B: 我叫小明。你呢？           Wǒ jiào Xiǎomíng. Nǐ ne?           (Tôi tên Tiểu Minh. Còn bạn?)
A: 我叫大卫。你是哪国人？     Wǒ jiào Dàwèi. Nǐ shì nǎ guó rén?  (Tôi tên David. Bạn là người nước nào?)
B: 我是中国人。很高兴认识你！ Wǒ shì Zhōngguó rén. Hěn gāoxìng rènshi nǐ! (Tôi là người Trung Quốc. Rất vui được biết bạn!)
A: 我也很高兴！               Wǒ yě hěn gāoxìng!                 (Tôi cũng rất vui!)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 你呢? (nǐ ne?) hất câu hỏi ngược lại — nói với ngữ điệu lên nhẹ. 您 (nín) là "bạn" lịch sự: dùng với thầy cô, người lớn tuổi, khách hàng.</div>`,
  ]]);

const b2q = quiz('chs111-quiz-2', 'Quiz 2 — Greetings|||Quiz 2 — Chào hỏi', [
  { id: 'q1', question: 'Cụm mở đầu lịch sự trước khi hỏi là? / Which phrase politely opens a question?', options: ['再见 zàijiàn', '请问 qǐng wèn', '谢谢 xièxie', '你呢 nǐ ne'], correctIndex: 1, explanation: '请问 qǐng wèn = cho hỏi/xin hỏi, dùng trước khi đặt câu hỏi.' },
  { id: 'q2', question: '"很高兴认识你" nghĩa là gì? / What does 很高兴认识你 mean?', options: ['Tạm biệt bạn', 'Rất vui được biết bạn', 'Bạn tên gì', 'Bạn khoẻ không'], correctIndex: 1, explanation: '高兴 (vui) + 认识你 (biết bạn) = rất vui được biết bạn.' },
  { id: 'q3', question: 'Hỏi "Bạn là người nước nào?" đúng là? / How do you ask which country someone is from?', options: ['你几岁？', '你是哪国人？', '你叫什么？', '你在哪儿？'], correctIndex: 1, explanation: '哪国 (nước nào) + 人 (người) → 你是哪国人?' },
]);

const b3 = doc('chs111-3-1-personal-info', 'Lesson 3 — Asking personal information|||Bài 3 — Hỏi thông tin cá nhân',
  'Mẫu câu: 你叫什么, 你多大, 你在哪儿工作, 你的电话号码是多少; nghề nghiệp 学生/老师; luyện hỏi-đáp thông tin.',
  [[
    `<span class="eyebrow">CHS111 · Lesson 3 · Personal info</span>
<h2>Asking personal information</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>多大</td><td>duō dà</td><td>how old</td></tr>
<tr><td>工作</td><td>gōngzuò</td><td>work / to work</td></tr>
<tr><td>在</td><td>zài</td><td>at / in (place)</td></tr>
<tr><td>哪儿</td><td>nǎr</td><td>where</td></tr>
<tr><td>电话号码</td><td>diànhuà hàomǎ</td><td>phone number</td></tr>
<tr><td>多少</td><td>duōshao</td><td>how much / how many</td></tr>
<tr><td>学生</td><td>xuéshēng</td><td>student</td></tr>
<tr><td>老师</td><td>lǎoshī</td><td>teacher</td></tr>
<tr><td>公司</td><td>gōngsī</td><td>company</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>你多大?</strong> nǐ duō dà? — how old are you (general). To a child: 你几岁?</li>
<li><strong>你在哪儿工作?</strong> nǐ zài nǎr gōngzuò? — where do you work? Answer: 我在… 工作.</li>
<li><strong>你的电话号码是多少?</strong> — what is your phone number? Read digits one by one; 1 is often said <strong>yāo</strong> on the phone.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你在哪儿工作？       Nǐ zài nǎr gōngzuò?        (Where do you work?)
B: 我是学生，在大学学习。 Wǒ shì xuéshēng, zài dàxué xuéxí. (I am a student, I study at university.)
A: 你的电话号码是多少？   Nǐ de diànhuà hàomǎ shì duōshao? (What is your phone number?)
B: 我的号码是幺三八…      Wǒ de hàomǎ shì yāo-sān-bā…  (My number is 1-3-8 …)
</code></pre>
<div class="callout"><span class="badge">Pronunciation note</span> On the phone the digit 1 (一 yī) is read <strong>幺 yāo</strong> so it is not confused with 七 (qī, 7). Say numbers one digit at a time, clearly.</div>`,
    `<span class="eyebrow">CHS111 · Bài 3 · Thông tin cá nhân</span>
<h2>Hỏi thông tin cá nhân</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>多大</td><td>duō dà</td><td>bao nhiêu tuổi</td></tr>
<tr><td>工作</td><td>gōngzuò</td><td>công việc / làm việc</td></tr>
<tr><td>在</td><td>zài</td><td>ở / tại (nơi chốn)</td></tr>
<tr><td>哪儿</td><td>nǎr</td><td>ở đâu</td></tr>
<tr><td>电话号码</td><td>diànhuà hàomǎ</td><td>số điện thoại</td></tr>
<tr><td>多少</td><td>duōshao</td><td>bao nhiêu</td></tr>
<tr><td>学生</td><td>xuéshēng</td><td>học sinh / sinh viên</td></tr>
<tr><td>老师</td><td>lǎoshī</td><td>giáo viên</td></tr>
<tr><td>公司</td><td>gōngsī</td><td>công ty</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>你多大?</strong> nǐ duō dà? — bạn bao nhiêu tuổi (hỏi chung). Hỏi trẻ nhỏ: 你几岁?</li>
<li><strong>你在哪儿工作?</strong> nǐ zài nǎr gōngzuò? — bạn làm việc ở đâu? Đáp: 我在… 工作.</li>
<li><strong>你的电话号码是多少?</strong> — số điện thoại của bạn là bao nhiêu? Đọc từng chữ số; số 1 khi gọi điện thường đọc là <strong>yāo</strong>.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你在哪儿工作？       Nǐ zài nǎr gōngzuò?        (Bạn làm việc ở đâu?)
B: 我是学生，在大学学习。 Wǒ shì xuéshēng, zài dàxué xuéxí. (Tôi là sinh viên, học ở đại học.)
A: 你的电话号码是多少？   Nǐ de diànhuà hàomǎ shì duōshao? (Số điện thoại của bạn là bao nhiêu?)
B: 我的号码是幺三八…      Wǒ de hàomǎ shì yāo-sān-bā…  (Số của tôi là 1-3-8 …)
</code></pre>
<div class="callout"><span class="badge">Ghi chú phát âm</span> Khi gọi điện, chữ số 1 (一 yī) đọc là <strong>幺 yāo</strong> để khỏi lẫn với 七 (qī, 7). Đọc số từng chữ một, thật rõ.</div>`,
  ]]);

const b3q = quiz('chs111-quiz-3', 'Quiz 3 — Personal information|||Quiz 3 — Thông tin cá nhân', [
  { id: 'q1', question: 'Hỏi "Bạn bao nhiêu tuổi?" (hỏi chung) đúng là? / How do you ask an adult their age?', options: ['你几岁？', '你多大？', '你多少？', '你哪儿？'], correctIndex: 1, explanation: '你多大? hỏi tuổi chung; 你几岁? dùng cho trẻ nhỏ.' },
  { id: 'q2', question: 'Hỏi "Bạn làm việc ở đâu?" là? / How do you ask "Where do you work?"', options: ['你在哪儿工作？', '你叫什么？', '你想吃什么？', '你有时间吗？'], correctIndex: 0, explanation: '在哪儿 (ở đâu) + 工作 (làm việc) → 你在哪儿工作?' },
  { id: 'q3', question: 'Khi gọi điện, chữ số 1 (一) thường được đọc là? / On the phone, the digit 1 is usually read as?', options: ['qī', 'yāo', 'liǎng', 'líng'], correctIndex: 1, explanation: 'Số 1 đọc là 幺 yāo khi đọc số điện thoại, tránh lẫn với 七 (qī, 7).' },
]);

const b4 = doc('chs111-4-1-classroom-office', 'Lesson 4 — In the classroom &amp; office|||Bài 4 — Trong lớp học &amp; công sở',
  'Mẫu câu xoay xở: 请再说一遍, 我听不懂, 是什么意思, 请慢一点儿, 用中文怎么说; luyện nhờ nhắc lại và hỏi nghĩa.',
  [[
    `<span class="eyebrow">CHS111 · Lesson 4 · Classroom &amp; office</span>
<h2>In the classroom &amp; office</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>请再说一遍</td><td>qǐng zài shuō yí biàn</td><td>please say it again</td></tr>
<tr><td>听不懂</td><td>tīng bu dǒng</td><td>can not understand (by listening)</td></tr>
<tr><td>意思</td><td>yìsi</td><td>meaning</td></tr>
<tr><td>什么意思</td><td>shénme yìsi</td><td>what does it mean</td></tr>
<tr><td>慢</td><td>màn</td><td>slow</td></tr>
<tr><td>一点儿</td><td>yìdiǎnr</td><td>a little</td></tr>
<tr><td>怎么说</td><td>zěnme shuō</td><td>how to say</td></tr>
<tr><td>中文</td><td>Zhōngwén</td><td>Chinese (language)</td></tr>
<tr><td>明白</td><td>míngbai</td><td>to understand, be clear</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>请再说一遍</strong> — please say it again. Add 请 (please) to stay polite.</li>
<li><strong>我听不懂 / 请慢一点儿</strong> — I do not understand / please a bit slower. 听不懂 = the listening did not get through.</li>
<li><strong>… 是什么意思?</strong> and <strong>… 用中文怎么说?</strong> — what does … mean? / how do you say … in Chinese? These two keep any conversation going.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>老师: 请翻到第八页。       Qǐng fān dào dì-bā yè.      (Please turn to page 8.)
学生: 对不起，我听不懂，请再说一遍。 Duìbuqǐ, wǒ tīng bu dǒng, qǐng zài shuō yí biàn. (Sorry, I do not understand, please say it again.)
老师: 请翻—到—第八页。     Qǐng fān — dào — dì-bā yè. (Please — turn — to page 8.)
学生: 翻是什么意思？       Fān shì shénme yìsi?       (What does 翻 mean?)
老师: 翻就是 open / turn。 Fān jiùshì open / turn.    (翻 means to open / turn.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 听不懂 has a neutral 不 in the middle — say it fast and light: tīng·bu·dǒng. Do not stress 不.</div>`,
    `<span class="eyebrow">CHS111 · Bài 4 · Lớp học &amp; công sở</span>
<h2>Trong lớp học &amp; công sở</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>请再说一遍</td><td>qǐng zài shuō yí biàn</td><td>xin nói lại một lần</td></tr>
<tr><td>听不懂</td><td>tīng bu dǒng</td><td>nghe không hiểu</td></tr>
<tr><td>意思</td><td>yìsi</td><td>ý nghĩa</td></tr>
<tr><td>什么意思</td><td>shénme yìsi</td><td>nghĩa là gì</td></tr>
<tr><td>慢</td><td>màn</td><td>chậm</td></tr>
<tr><td>一点儿</td><td>yìdiǎnr</td><td>một chút</td></tr>
<tr><td>怎么说</td><td>zěnme shuō</td><td>nói thế nào</td></tr>
<tr><td>中文</td><td>Zhōngwén</td><td>tiếng Trung</td></tr>
<tr><td>明白</td><td>míngbai</td><td>hiểu, rõ</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>请再说一遍</strong> — xin nói lại một lần. Thêm 请 (làm ơn) cho lịch sự.</li>
<li><strong>我听不懂 / 请慢一点儿</strong> — tôi nghe không hiểu / xin chậm một chút. 听不懂 = nghe mà không hiểu.</li>
<li><strong>… 是什么意思?</strong> và <strong>… 用中文怎么说?</strong> — … nghĩa là gì? / … tiếng Trung nói thế nào? Hai câu này giúp cuộc trò chuyện tiếp tục.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>老师: 请翻到第八页。       Qǐng fān dào dì-bā yè.      (Xin lật đến trang 8.)
学生: 对不起，我听不懂，请再说一遍。 Duìbuqǐ, wǒ tīng bu dǒng, qǐng zài shuō yí biàn. (Xin lỗi, em nghe không hiểu, xin nói lại một lần.)
老师: 请翻—到—第八页。     Qǐng fān — dào — dì-bā yè. (Xin — lật — đến trang 8.)
学生: 翻是什么意思？       Fān shì shénme yìsi?       (翻 nghĩa là gì ạ?)
老师: 翻就是 open / turn。 Fān jiùshì open / turn.    (翻 nghĩa là lật/mở.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 听不懂 có chữ 不 thanh nhẹ ở giữa — đọc nhanh và nhẹ: tīng·bu·dǒng. Đừng nhấn vào 不.</div>`,
  ]]);

const b4q = quiz('chs111-quiz-4', 'Quiz 4 — Classroom &amp; office|||Quiz 4 — Lớp học &amp; công sở', [
  { id: 'q1', question: 'Nhờ "nói lại một lần" đúng là? / How do you ask someone to say it again?', options: ['请慢一点儿', '请再说一遍', '什么意思？', '再见！'], correctIndex: 1, explanation: '再说 (nói lại) + 一遍 (một lần) → 请再说一遍.' },
  { id: 'q2', question: '"我听不懂" nghĩa là gì? / What does 我听不懂 mean?', options: ['Tôi không nhìn thấy', 'Tôi nghe không hiểu', 'Tôi không nói được', 'Tôi rất vui'], correctIndex: 1, explanation: '听 (nghe) + 不懂 (không hiểu) = nghe không hiểu.' },
  { id: 'q3', question: 'Hỏi nghĩa của một từ bằng câu nào? / Which phrase asks the meaning of a word?', options: ['… 是什么意思？', '… 多少钱？', '… 在哪儿？', '… 几点？'], correctIndex: 0, explanation: '… 是什么意思? = … nghĩa là gì?' },
]);

const b5 = doc('chs111-5-1-shopping-bargain', 'Lesson 5 — Shopping &amp; bargaining|||Bài 5 — Mua sắm &amp; mặc cả',
  'Mẫu câu: 多少钱, 太贵了, 便宜点儿, 我要这个, 能不能…; tiền 块, chỉ vật 这个/那个; luyện mua hàng và trả giá.',
  [[
    `<span class="eyebrow">CHS111 · Lesson 5 · Shopping</span>
<h2>Shopping &amp; bargaining</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>多少钱</td><td>duōshao qián</td><td>how much (money)</td></tr>
<tr><td>块</td><td>kuài</td><td>yuan (spoken)</td></tr>
<tr><td>贵</td><td>guì</td><td>expensive</td></tr>
<tr><td>太贵了</td><td>tài guì le</td><td>too expensive</td></tr>
<tr><td>便宜</td><td>piányi</td><td>cheap</td></tr>
<tr><td>便宜点儿</td><td>piányi diǎnr</td><td>a bit cheaper</td></tr>
<tr><td>能不能</td><td>néng bu néng</td><td>can (you) or not</td></tr>
<tr><td>这个 / 那个</td><td>zhège / nàge</td><td>this one / that one</td></tr>
<tr><td>要</td><td>yào</td><td>to want / take</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>… 多少钱?</strong> — how much is …? Answer with 块: 五块 (5 yuan).</li>
<li><strong>太贵了，便宜点儿吧!</strong> — too expensive, a bit cheaper please! 吧 (ba) softens it into a friendly request.</li>
<li><strong>能不能…?</strong> — can you …? A polite yes/no question: 能不能便宜点儿? Answer 能 (can) or 不能 (can not).</li>
<li><strong>我要这个</strong> — I will take this one. Point with 这个 / 那个.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>顾客: 这个多少钱？     Zhège duōshao qián?   (How much is this?)
店员: 五十块。         Wǔshí kuài.           (50 yuan.)
顾客: 太贵了！能不能便宜点儿？ Tài guì le! Néng bu néng piányi diǎnr? (Too expensive! Can it be cheaper?)
店员: 好吧，四十块。   Hǎo ba, sìshí kuài.   (Okay, 40 yuan.)
顾客: 好，我要这个。   Hǎo, wǒ yào zhège.    (Good, I will take this one.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 太…了 (tài … le) is an exclamation frame — stretch 太 and drop 了 lightly: tài guì·le. It shows real feeling, useful when bargaining.</div>`,
    `<span class="eyebrow">CHS111 · Bài 5 · Mua sắm</span>
<h2>Mua sắm &amp; mặc cả</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>多少钱</td><td>duōshao qián</td><td>bao nhiêu tiền</td></tr>
<tr><td>块</td><td>kuài</td><td>tệ (khi nói)</td></tr>
<tr><td>贵</td><td>guì</td><td>đắt</td></tr>
<tr><td>太贵了</td><td>tài guì le</td><td>đắt quá</td></tr>
<tr><td>便宜</td><td>piányi</td><td>rẻ</td></tr>
<tr><td>便宜点儿</td><td>piányi diǎnr</td><td>rẻ chút đi</td></tr>
<tr><td>能不能</td><td>néng bu néng</td><td>có thể … không</td></tr>
<tr><td>这个 / 那个</td><td>zhège / nàge</td><td>cái này / cái kia</td></tr>
<tr><td>要</td><td>yào</td><td>muốn / lấy</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>… 多少钱?</strong> — … bao nhiêu tiền? Trả lời dùng 块: 五块 (5 tệ).</li>
<li><strong>太贵了，便宜点儿吧!</strong> — đắt quá, rẻ chút đi! 吧 (ba) làm câu thành lời đề nghị thân thiện.</li>
<li><strong>能不能…?</strong> — có thể … không? Câu hỏi có/không lịch sự: 能不能便宜点儿? Đáp 能 (được) hoặc 不能 (không được).</li>
<li><strong>我要这个</strong> — tôi lấy cái này. Chỉ vào bằng 这个 / 那个.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>顾客: 这个多少钱？     Zhège duōshao qián?   (Cái này bao nhiêu tiền?)
店员: 五十块。         Wǔshí kuài.           (50 tệ.)
顾客: 太贵了！能不能便宜点儿？ Tài guì le! Néng bu néng piányi diǎnr? (Đắt quá! Rẻ chút được không?)
店员: 好吧，四十块。   Hǎo ba, sìshí kuài.   (Được thôi, 40 tệ.)
顾客: 好，我要这个。   Hǎo, wǒ yào zhège.    (Được, tôi lấy cái này.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 太…了 (tài … le) là khung cảm thán — kéo dài 太 và buông 了 thật nhẹ: tài guì·le. Nó thể hiện cảm xúc thật, rất hợp khi mặc cả.</div>`,
  ]]);

const b5q = quiz('chs111-quiz-5', 'Quiz 5 — Shopping &amp; bargaining|||Quiz 5 — Mua sắm &amp; mặc cả', [
  { id: 'q1', question: 'Câu "rẻ chút đi" đúng là? / How do you say "a bit cheaper"?', options: ['太贵了', '便宜点儿', '多少钱', '我要这个'], correctIndex: 1, explanation: '便宜 (rẻ) + 点儿 (một chút) = 便宜点儿.' },
  { id: 'q2', question: 'Đơn vị tiền khi nói (khẩu ngữ) là chữ nào? / Which spoken word is the money unit?', options: ['岁 suì', '块 kuài', '点 diǎn', '路 lù'], correctIndex: 1, explanation: '块 kuài là đơn vị tiền (tệ) khi nói: 五块 = 5 tệ.' },
  { id: 'q3', question: '"能不能便宜点儿?" là kiểu câu gì? / What kind of question is 能不能便宜点儿?', options: ['câu cảm thán', 'câu hỏi có/không lịch sự', 'câu mệnh lệnh', 'câu chào hỏi'], correctIndex: 1, explanation: '能不能 = có thể … không, một câu hỏi có/không lịch sự; đáp 能 hoặc 不能.' },
]);

const b6 = doc('chs111-6-1-eating-ordering', 'Lesson 6 — Eating &amp; ordering food|||Bài 6 — Ăn uống &amp; gọi món',
  'Mẫu câu: 你想吃什么, 来一个…, 好吃/好喝, 买单; 服务员/菜单; luyện gọi món và tính tiền ở nhà hàng.',
  [[
    `<span class="eyebrow">CHS111 · Lesson 6 · Eating &amp; ordering</span>
<h2>Eating &amp; ordering food</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>服务员</td><td>fúwùyuán</td><td>waiter / server</td></tr>
<tr><td>菜单</td><td>càidān</td><td>menu</td></tr>
<tr><td>想</td><td>xiǎng</td><td>would like to</td></tr>
<tr><td>来一个</td><td>lái yíge</td><td>bring / I will have one</td></tr>
<tr><td>米饭</td><td>mǐfàn</td><td>rice</td></tr>
<tr><td>好吃</td><td>hǎochī</td><td>tasty (food)</td></tr>
<tr><td>好喝</td><td>hǎohē</td><td>tasty (drink)</td></tr>
<tr><td>买单</td><td>mǎidān</td><td>the bill / to pay</td></tr>
<tr><td>再来</td><td>zài lái</td><td>bring more / one more</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>你想吃什么?</strong> — what would you like to eat? Answer: 我想吃… (I would like to eat …).</li>
<li><strong>来一个…</strong> — a casual way to order: 来一个米饭 (I will have a rice). 再来一个 = one more.</li>
<li><strong>… 很好吃 / 很好喝</strong> — … is very tasty (food / drink). 吃 for food, 喝 for drinks.</li>
<li><strong>服务员，买单!</strong> — waiter, the bill please! Call the server with 服务员.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>服务员: 你想吃什么？     Nǐ xiǎng chī shénme?   (What would you like to eat?)
客人:   来一个米饭，一个青菜。 Lái yíge mǐfàn, yíge qīngcài. (A rice and a green-vegetable dish.)
服务员: 喝什么？         Hē shénme?             (What would you like to drink?)
客人:   来一杯茶。       Lái yì bēi chá.        (A cup of tea.)
   （吃完之后 — after eating）
客人:   服务员，买单！   Fúwùyuán, mǎidān!      (Waiter, the bill please!)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 好吃 (hǎochī) and 好喝 (hǎohē) both start with a 3rd-tone 好 — before another full tone it stays low; say hǎo·chī, not háo. A quick 好吃！ after a bite makes any host happy.</div>`,
    `<span class="eyebrow">CHS111 · Bài 6 · Ăn uống</span>
<h2>Ăn uống &amp; gọi món</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>服务员</td><td>fúwùyuán</td><td>nhân viên phục vụ</td></tr>
<tr><td>菜单</td><td>càidān</td><td>thực đơn</td></tr>
<tr><td>想</td><td>xiǎng</td><td>muốn</td></tr>
<tr><td>来一个</td><td>lái yíge</td><td>cho một cái / phần</td></tr>
<tr><td>米饭</td><td>mǐfàn</td><td>cơm</td></tr>
<tr><td>好吃</td><td>hǎochī</td><td>ngon (đồ ăn)</td></tr>
<tr><td>好喝</td><td>hǎohē</td><td>ngon (đồ uống)</td></tr>
<tr><td>买单</td><td>mǎidān</td><td>tính tiền</td></tr>
<tr><td>再来</td><td>zài lái</td><td>cho thêm / một cái nữa</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>你想吃什么?</strong> — bạn muốn ăn gì? Đáp: 我想吃… (tôi muốn ăn …).</li>
<li><strong>来一个…</strong> — cách gọi món thân mật: 来一个米饭 (cho một phần cơm). 再来一个 = thêm một cái nữa.</li>
<li><strong>… 很好吃 / 很好喝</strong> — … rất ngon (đồ ăn / đồ uống). 吃 cho đồ ăn, 喝 cho đồ uống.</li>
<li><strong>服务员，买单!</strong> — nhân viên ơi, tính tiền! Gọi phục vụ bằng 服务员.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>服务员: 你想吃什么？     Nǐ xiǎng chī shénme?   (Bạn muốn ăn gì?)
客人:   来一个米饭，一个青菜。 Lái yíge mǐfàn, yíge qīngcài. (Cho một phần cơm và một món rau xanh.)
服务员: 喝什么？         Hē shénme?             (Uống gì ạ?)
客人:   来一杯茶。       Lái yì bēi chá.        (Cho một cốc trà.)
   （吃完之后 — sau khi ăn xong）
客人:   服务员，买单！   Fúwùyuán, mǎidān!      (Nhân viên ơi, tính tiền!)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 好吃 (hǎochī) và 好喝 (hǎohē) đều bắt đầu bằng thanh 3 好 — trước một thanh đầy đủ nó giữ ở thấp; đọc hǎo·chī, không đọc háo. Một câu 好吃！ ngay sau miếng đầu làm chủ nhà rất vui.</div>`,
  ]]);

const b6q = quiz('chs111-quiz-6', 'Quiz 6 — Eating &amp; ordering|||Quiz 6 — Ăn uống &amp; gọi món', [
  { id: 'q1', question: 'Gọi tính tiền ở nhà hàng nói thế nào? / How do you ask for the bill?', options: ['买单', '菜单', '好吃', '再见'], correctIndex: 0, explanation: '买单 mǎidān = tính tiền/thanh toán; 菜单 càidān = thực đơn.' },
  { id: 'q2', question: 'Khen "ngon" cho ĐỒ UỐNG dùng chữ nào? / Which word praises a drink as tasty?', options: ['好吃 hǎochī', '好喝 hǎohē', '好看 hǎokàn', '好听 hǎotīng'], correctIndex: 1, explanation: '喝 (uống) → 好喝 cho đồ uống; 吃 (ăn) → 好吃 cho đồ ăn.' },
  { id: 'q3', question: 'Cách gọi món thân mật "cho một phần…" là? / Which casual phrase orders "one …"?', options: ['来一个…', '多少钱？', '在哪儿？', '几点见？'], correctIndex: 0, explanation: '来一个… = cho một cái/phần…; thêm nữa thì 再来一个.' },
]);

const b7 = doc('chs111-7-1-directions', 'Lesson 7 — Directions &amp; getting around|||Bài 7 — Hỏi đường &amp; đi lại',
  'Mẫu câu: 怎么走, …在哪儿, 坐几路车, 离这儿远吗; hướng 往前走/往左拐; phương tiện 地铁/公交车; luyện hỏi đường.',
  [[
    `<span class="eyebrow">CHS111 · Lesson 7 · Directions</span>
<h2>Directions &amp; getting around</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>怎么走</td><td>zěnme zǒu</td><td>how to get there</td></tr>
<tr><td>往前走</td><td>wǎng qián zǒu</td><td>go straight ahead</td></tr>
<tr><td>往左拐 / 往右拐</td><td>wǎng zuǒ guǎi / wǎng yòu guǎi</td><td>turn left / turn right</td></tr>
<tr><td>坐几路车</td><td>zuò jǐ lù chē</td><td>which bus number to take</td></tr>
<tr><td>地铁</td><td>dìtiě</td><td>subway / metro</td></tr>
<tr><td>公交车</td><td>gōngjiāochē</td><td>bus</td></tr>
<tr><td>离</td><td>lí</td><td>(distance) from</td></tr>
<tr><td>远 / 近</td><td>yuǎn / jìn</td><td>far / near</td></tr>
<tr><td>这儿 / 那儿</td><td>zhèr / nàr</td><td>here / there</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>… 怎么走?</strong> — how do I get to …? 火车站怎么走? (how to get to the train station?)</li>
<li><strong>… 在哪儿?</strong> — where is …? Answer with directions: 往前走，往左拐.</li>
<li><strong>坐几路车?</strong> — which bus (number) do I take? Answer: 坐三路车 (take bus No. 3).</li>
<li><strong>… 离这儿远吗?</strong> — is … far from here? 离 marks the distance between two points.</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 请问，地铁站怎么走？   Qǐng wèn, dìtiě zhàn zěnme zǒu? (Excuse me, how do I get to the metro station?)
B: 往前走，往左拐就到了。 Wǎng qián zǒu, wǎng zuǒ guǎi jiù dào le. (Go straight, turn left and you are there.)
A: 离这儿远吗？           Lí zhèr yuǎn ma?               (Is it far from here?)
B: 不远，很近。           Bù yuǎn, hěn jìn.              (Not far, very near.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 往 (wǎng, toward) + direction + 走/拐 is one fixed chunk — say it as a block: wǎng-qián-zǒu, wǎng-zuǒ-guǎi. 就到了 (jiù dào le) tags on the idea and you have arrived.</div>`,
    `<span class="eyebrow">CHS111 · Bài 7 · Hỏi đường</span>
<h2>Hỏi đường &amp; đi lại</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>怎么走</td><td>zěnme zǒu</td><td>đi thế nào</td></tr>
<tr><td>往前走</td><td>wǎng qián zǒu</td><td>đi thẳng về phía trước</td></tr>
<tr><td>往左拐 / 往右拐</td><td>wǎng zuǒ guǎi / wǎng yòu guǎi</td><td>rẽ trái / rẽ phải</td></tr>
<tr><td>坐几路车</td><td>zuò jǐ lù chē</td><td>đi xe (buýt) số mấy</td></tr>
<tr><td>地铁</td><td>dìtiě</td><td>tàu điện ngầm</td></tr>
<tr><td>公交车</td><td>gōngjiāochē</td><td>xe buýt</td></tr>
<tr><td>离</td><td>lí</td><td>cách (khoảng cách)</td></tr>
<tr><td>远 / 近</td><td>yuǎn / jìn</td><td>xa / gần</td></tr>
<tr><td>这儿 / 那儿</td><td>zhèr / nàr</td><td>ở đây / ở kia</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>… 怎么走?</strong> — đi … thế nào? 火车站怎么走? (đi ga tàu thế nào?)</li>
<li><strong>… 在哪儿?</strong> — … ở đâu? Trả lời bằng chỉ đường: 往前走，往左拐.</li>
<li><strong>坐几路车?</strong> — đi xe (buýt) số mấy? Đáp: 坐三路车 (đi xe số 3).</li>
<li><strong>… 离这儿远吗?</strong> — … cách đây có xa không? 离 đánh dấu khoảng cách giữa hai điểm.</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 请问，地铁站怎么走？   Qǐng wèn, dìtiě zhàn zěnme zǒu? (Cho hỏi, đi đến ga tàu điện ngầm thế nào?)
B: 往前走，往左拐就到了。 Wǎng qián zǒu, wǎng zuǒ guǎi jiù dào le. (Đi thẳng, rẽ trái là tới.)
A: 离这儿远吗？           Lí zhèr yuǎn ma?               (Cách đây có xa không?)
B: 不远，很近。           Bù yuǎn, hěn jìn.              (Không xa, rất gần.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 往 (wǎng, về hướng) + hướng + 走/拐 là một cụm cố định — nói liền một khối: wǎng-qián-zǒu, wǎng-zuǒ-guǎi. 就到了 (jiù dào le) gắn thêm ý "là tới ngay".</div>`,
  ]]);

const b7q = quiz('chs111-quiz-7', 'Quiz 7 — Directions|||Quiz 7 — Hỏi đường &amp; đi lại', [
  { id: 'q1', question: 'Hỏi "đi … thế nào?" đúng là? / How do you ask how to get somewhere?', options: ['… 多少钱？', '… 怎么走？', '… 几点？', '… 好吃吗？'], correctIndex: 1, explanation: '怎么 (thế nào) + 走 (đi) → … 怎么走?' },
  { id: 'q2', question: '"往左拐" nghĩa là gì? / What does 往左拐 mean?', options: ['đi thẳng', 'rẽ trái', 'rẽ phải', 'quay lại'], correctIndex: 1, explanation: '往 (về hướng) + 左 (trái) + 拐 (rẽ) = rẽ trái.' },
  { id: 'q3', question: 'Hỏi "đi xe buýt số mấy?" là? / How do you ask which bus number to take?', options: ['坐几路车？', '离这儿远吗？', '在哪儿工作？', '几点见？'], correctIndex: 0, explanation: '坐 (đi/ngồi) + 几路 (tuyến số mấy) + 车 (xe) → 坐几路车?' },
]);

const b8 = doc('chs111-8-1-appointments', 'Lesson 8 — Appointments &amp; invitations|||Bài 8 — Hẹn &amp; mời',
  'Mẫu câu: 你有时间吗, 一起去…, 几点见, 在…等你; 好啊 nhận lời; luyện rủ bạn đi chơi và hẹn giờ-địa điểm.',
  [[
    `<span class="eyebrow">CHS111 · Lesson 8 · Appointments</span>
<h2>Appointments &amp; invitations</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>时间</td><td>shíjiān</td><td>time</td></tr>
<tr><td>有时间吗</td><td>yǒu shíjiān ma</td><td>do you have time</td></tr>
<tr><td>一起</td><td>yìqǐ</td><td>together</td></tr>
<tr><td>一起去</td><td>yìqǐ qù</td><td>go together</td></tr>
<tr><td>几点见</td><td>jǐ diǎn jiàn</td><td>what time shall we meet</td></tr>
<tr><td>等</td><td>děng</td><td>to wait</td></tr>
<tr><td>在…等你</td><td>zài … děng nǐ</td><td>wait for you at …</td></tr>
<tr><td>好啊</td><td>hǎo a</td><td>sure / okay</td></tr>
<tr><td>咖啡馆</td><td>kāfēiguǎn</td><td>cafe</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>你有时间吗?</strong> — do you have time? The usual opener for an invitation.</li>
<li><strong>我们一起去…吧!</strong> — let us go … together! 吧 turns it into a friendly suggestion.</li>
<li><strong>几点见?</strong> — what time shall we meet? Answer: 三点见 (meet at 3).</li>
<li><strong>我在…等你</strong> — I will wait for you at …: 我在咖啡馆等你 (I will wait at the cafe).</li>
</ul>
<h3>Real dialogue — shadow &amp; role-play</h3>
<pre><code>A: 明天你有时间吗？   Míngtiān nǐ yǒu shíjiān ma? (Do you have time tomorrow?)
B: 有啊，什么事？     Yǒu a, shénme shì?         (Yes, what is up?)
A: 我们一起去看电影吧！ Wǒmen yìqǐ qù kàn diànyǐng ba! (Let us go watch a movie together!)
B: 好啊！几点见？     Hǎo a! Jǐ diǎn jiàn?       (Sure! What time shall we meet?)
A: 三点，我在咖啡馆等你。 Sān diǎn, wǒ zài kāfēiguǎn děng nǐ. (3 pm, I will wait for you at the cafe.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 好啊！(hǎo a) with a bright, rising 啊 sounds warm and willing — a flat 好 can sound reluctant. The little particles 吗 / 吧 / 啊 carry the mood, so give them their own light beat.</div>`,
    `<span class="eyebrow">CHS111 · Bài 8 · Hẹn &amp; mời</span>
<h2>Hẹn &amp; mời</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>时间</td><td>shíjiān</td><td>thời gian</td></tr>
<tr><td>有时间吗</td><td>yǒu shíjiān ma</td><td>có thời gian không</td></tr>
<tr><td>一起</td><td>yìqǐ</td><td>cùng nhau</td></tr>
<tr><td>一起去</td><td>yìqǐ qù</td><td>cùng đi</td></tr>
<tr><td>几点见</td><td>jǐ diǎn jiàn</td><td>mấy giờ gặp</td></tr>
<tr><td>等</td><td>děng</td><td>đợi</td></tr>
<tr><td>在…等你</td><td>zài … děng nǐ</td><td>đợi bạn ở …</td></tr>
<tr><td>好啊</td><td>hǎo a</td><td>được thôi / ừ</td></tr>
<tr><td>咖啡馆</td><td>kāfēiguǎn</td><td>quán cà phê</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>你有时间吗?</strong> — bạn có thời gian không? Câu mở đầu quen thuộc để rủ nhau.</li>
<li><strong>我们一起去…吧!</strong> — chúng ta cùng đi … nhé! 吧 biến câu thành lời gợi ý thân thiện.</li>
<li><strong>几点见?</strong> — mấy giờ gặp? Đáp: 三点见 (gặp lúc 3 giờ).</li>
<li><strong>我在…等你</strong> — tôi đợi bạn ở …: 我在咖啡馆等你 (tôi đợi bạn ở quán cà phê).</li>
</ul>
<h3>Hội thoại thực tế — nói nhại &amp; đóng vai</h3>
<pre><code>A: 明天你有时间吗？   Míngtiān nǐ yǒu shíjiān ma? (Ngày mai bạn có thời gian không?)
B: 有啊，什么事？     Yǒu a, shénme shì?         (Có chứ, có việc gì thế?)
A: 我们一起去看电影吧！ Wǒmen yìqǐ qù kàn diànyǐng ba! (Chúng ta cùng đi xem phim nhé!)
B: 好啊！几点见？     Hǎo a! Jǐ diǎn jiàn?       (Được thôi! Mấy giờ gặp?)
A: 三点，我在咖啡馆等你。 Sān diǎn, wǒ zài kāfēiguǎn děng nǐ. (3 giờ chiều, tôi đợi bạn ở quán cà phê.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 好啊！(hǎo a) với 啊 lên giọng tươi nghe ấm áp, sẵn lòng — 好 nói phẳng lại nghe miễn cưỡng. Các trợ từ nhỏ 吗 / 吧 / 啊 mang sắc thái, nên hãy cho chúng một nhịp nhẹ riêng.</div>`,
  ]]);

const b8q = quiz('chs111-quiz-8', 'Quiz 8 — Appointments &amp; invitations|||Quiz 8 — Hẹn &amp; mời', [
  { id: 'q1', question: 'Rủ "chúng ta cùng đi… nhé!" dùng trợ từ nào ở cuối? / Which particle turns a suggestion friendly at the end?', options: ['吗 ma', '吧 ba', '的 de', '了 le'], correctIndex: 1, explanation: '一起去…吧! — 吧 ba làm câu thành lời gợi ý/rủ rê thân thiện.' },
  { id: 'q2', question: 'Hỏi "mấy giờ gặp?" đúng là? / How do you ask "what time shall we meet?"', options: ['几点见？', '在哪儿？', '多少钱？', '怎么走？'], correctIndex: 0, explanation: '几点 (mấy giờ) + 见 (gặp) → 几点见?' },
  { id: 'q3', question: '"我在咖啡馆等你" nghĩa là gì? / What does 我在咖啡馆等你 mean?', options: ['Tôi đi quán cà phê', 'Tôi đợi bạn ở quán cà phê', 'Tôi thích cà phê', 'Quán cà phê ở đâu'], correctIndex: 1, explanation: '在咖啡馆 (ở quán cà phê) + 等你 (đợi bạn) = tôi đợi bạn ở quán cà phê.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'CHS111',
    slug: 'chs111-chinese-speaking-1',
    title: 'Chinese speaking 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHS111.webp',
    shortDescription: 'Spoken Chinese 1 (HSK1-2): pinyin & the 4 tones, then real-life speaking — greetings, personal info, classroom, shopping & bargaining, ordering food, directions, making plans. Real dialogues, pronunciation notes, bilingual, quizzes.|||Tiếng Trung giao tiếp 1 (HSK1-2): pinyin & 4 thanh, rồi nói thực tế — chào hỏi, thông tin cá nhân, lớp học, mua sắm & mặc cả, gọi món, hỏi đường, hẹn mời. Hội thoại thật, ghi chú phát âm, song ngữ, quiz.',
    description: 'Môn <strong>CHS111 — Chinese Speaking 1 (Tiếng Trung giao tiếp 1)</strong> là môn <strong>luyện nói</strong> ở trình độ nhập môn khẩu ngữ (<strong>HSK1-2</strong>). Bắt đầu từ <strong>phát âm chuẩn &amp; 4 thanh điệu</strong> → <strong>chào hỏi &amp; làm quen</strong> → <strong>hỏi thông tin cá nhân</strong> → <strong>trong lớp học &amp; công sở</strong> → <strong>mua sắm &amp; mặc cả</strong> → <strong>ăn uống &amp; gọi món</strong> → <strong>hỏi đường &amp; đi lại</strong> → <strong>hẹn &amp; mời</strong>. Bám giáo trình khẩu ngữ chuẩn (汉语口语速成 Short-term Spoken Chinese / HSK Standard Course), song ngữ Trung–Việt, mỗi bài có bảng từ vựng khẩu ngữ (汉字|pinyin|nghĩa), mẫu câu giao tiếp trọng tâm, hội thoại thực tế để nói nhại &amp; đóng vai, ghi chú phát âm/ngữ điệu và quiz. Học theo lộ trình 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.',
    whatYouLearn: 'Phát âm chuẩn: thanh mẫu/vận mẫu khó (zh ch sh r, j q x, z c s, ü) &amp; 4 thanh + thanh nhẹ, biến điệu, luyện thanh; chào hỏi &amp; làm quen (请问, 很高兴认识你, 哪国人); hỏi thông tin cá nhân (多大, 在哪儿工作, 电话号码); xoay xở trong lớp/công sở (请再说一遍, 听不懂, 什么意思); mua sắm &amp; mặc cả (多少钱, 便宜点儿, 能不能); ăn uống &amp; gọi món (你想吃什么, 来一个, 好吃, 买单); hỏi đường &amp; đi lại (怎么走, 坐几路车, 离这儿远吗); hẹn &amp; mời (你有时间吗, 一起去, 几点见, 在…等你). Nói được các hội thoại ngắn hằng ngày với phát âm rõ.',
    requirements: 'Không cần kiến thức tiếng Trung trước đó. Nên cài Pleco hoặc HelloChinese để nghe audio bản ngữ &amp; luyện nói theo; hãy nói to và tự thu âm để so với mẫu. Học kèm CHN113 (đọc-viết) sẽ bổ trợ tốt cho phần nói.',
  },
  sections: [
    { title: '📚 Tài liệu &amp; lộ trình luyện nói|||📚 Course materials', description: 'Giáo trình khẩu ngữ 汉语口语速成, app luyện nói, lộ trình 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mục tiêu giao tiếp, tầm quan trọng của phát âm & thanh điệu, cách luyện nói.', lessons: [intro] },
    { title: 'Bài 1 — Phát âm chuẩn &amp; thanh điệu|||Lesson 1 — Pronunciation &amp; tones', description: 'Âm khó, 4 thanh + thanh nhẹ, biến điệu, luyện thanh.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Chào hỏi &amp; làm quen|||Lesson 2 — Greetings', description: '请问, 很高兴认识你, 哪国人.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Hỏi thông tin cá nhân|||Lesson 3 — Personal information', description: '多大, 在哪儿工作, 电话号码.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Trong lớp học &amp; công sở|||Lesson 4 — Classroom & office', description: '请再说一遍, 听不懂, 什么意思.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Mua sắm &amp; mặc cả|||Lesson 5 — Shopping & bargaining', description: '多少钱, 便宜点儿, 能不能, 我要这个.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Ăn uống &amp; gọi món|||Lesson 6 — Eating & ordering', description: '你想吃什么, 来一个, 好吃, 买单.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Hỏi đường &amp; đi lại|||Lesson 7 — Directions', description: '怎么走, 坐几路车, 离这儿远吗.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Hẹn &amp; mời|||Lesson 8 — Appointments', description: '你有时间吗, 一起去, 几点见, 在…等你.', lessons: [b8, b8q] },
  ],
};
