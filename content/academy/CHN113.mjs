/**
 * CHN113 — Elementary Chinese 1 (Tiếng Trung sơ cấp 1). Khối Ngôn ngữ Trung
 * FPTU. Đây là MÔN NGÔN NGỮ: cấu trúc theo BÀI HỌC TIẾNG (từ vựng, ngữ pháp,
 * hội thoại, luyện tập) bám trình độ HSK1 (~150 từ). Giáo trình chuẩn: HSK
 * Standard Course 1 (北京语言大学) / 汉语教程.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; trong
 * HTML content "&" → "&amp;". shortDescription dùng "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chn113-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình học',
  'Giáo trình chuẩn (HSK Standard Course 1, 汉语教程), app (Pleco/HelloChinese/Anki), từ điển hanzii.net, YouTube, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CHN113 · Materials</span>
<h2>How to learn Chinese — materials &amp; roadmap</h2>
<p class="lead">Elementary Chinese 1 builds a <strong>HSK1</strong> foundation: the <strong>pinyin</strong> sound system, the <strong>4 tones</strong>, and about <strong>150 core words</strong> for everyday situations. Below are the standard textbook plus free tools.</p>
<h3>📘 Standard textbooks</h3>
<ul>
<li><strong>HSK Standard Course 1</strong> (北京语言大学出版社 / Beijing Language and Culture University Press) — the mainstream HSK1 coursebook.</li>
<li><strong>汉语教程 (Hànyǔ Jiàochéng)</strong> — the classic elementary Chinese series.</li>
</ul>
<h3>📱 Apps &amp; dictionaries</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — the standard Chinese dictionary app (handwriting &amp; audio).</li>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — beginner course with speech practice.</li>
<li><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a> — spaced-repetition flashcards for hanzi &amp; vocab.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — Chinese–Vietnamese dictionary with stroke order.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — structured HSK lessons.</li>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — real dialogues with subtitles.</li>
</ul>
<div class="callout"><span class="badge">4-step path</span>
<ol>
<li><strong>Pronunciation</strong> — master pinyin initials/finals &amp; the 4 tones first; a wrong tone changes the word.</li>
<li><strong>Vocabulary</strong> — learn hanzi in context, review daily with Anki/Pleco.</li>
<li><strong>Grammar</strong> — short, fixed word-order patterns (Subject–Verb–Object).</li>
<li><strong>Speaking</strong> — say every sentence out loud; shadow the audio.</li>
</ol></div>`,
    `<span class="eyebrow">CHN113 · Tài liệu</span>
<h2>Cách học tiếng Trung — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung sơ cấp 1 dựng nền <strong>HSK1</strong>: hệ thống <strong>pinyin</strong>, <strong>4 thanh điệu</strong>, và khoảng <strong>150 từ lõi</strong> cho các tình huống hằng ngày. Bên dưới là giáo trình chuẩn cùng công cụ miễn phí.</p>
<h3>📘 Giáo trình chuẩn</h3>
<ul>
<li><strong>HSK Standard Course 1</strong> (NXB Đại học Ngôn ngữ Bắc Kinh) — giáo trình HSK1 phổ biến nhất.</li>
<li><strong>汉语教程 (Hán ngữ giáo trình)</strong> — bộ giáo trình tiếng Trung sơ cấp kinh điển.</li>
</ul>
<h3>📱 App &amp; từ điển</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển tiếng Trung chuẩn (viết tay &amp; phát âm).</li>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — khoá nhập môn có luyện nói.</li>
<li><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a> — thẻ ghi nhớ lặp lại ngắt quãng cho chữ Hán &amp; từ vựng.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — từ điển Trung–Việt kèm thứ tự nét.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — bài học HSK có hệ thống.</li>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — hội thoại thật có phụ đề.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình 4 bước</span>
<ol>
<li><strong>Phát âm</strong> — nắm thanh mẫu/vận mẫu pinyin &amp; 4 thanh trước; sai thanh là sai từ.</li>
<li><strong>Từ vựng</strong> — học chữ Hán trong ngữ cảnh, ôn mỗi ngày bằng Anki/Pleco.</li>
<li><strong>Ngữ pháp</strong> — mẫu câu ngắn, trật tự cố định (Chủ ngữ–Động từ–Tân ngữ).</li>
<li><strong>Luyện nói</strong> — đọc to mọi câu; nói nhại theo audio.</li>
</ol></div>`,
  ]]);

const intro = doc('chn113-0-1-overview', 'Course overview: Elementary Chinese 1|||Tổng quan: Tiếng Trung sơ cấp 1',
  'Mục tiêu HSK1 (~150 từ), hệ thống pinyin & 4 thanh, chữ Hán, và cách học tiếng Trung hiệu quả.',
  [[
    `<span class="eyebrow">CHN113 · Lesson 0.1 · Overview</span>
<h2>Elementary Chinese 1 (HSK1)</h2>
<p class="lead">This course takes you from <strong>zero</strong> to the <strong>HSK Level 1</strong> standard — around <strong>150 words</strong> and the basic sentence patterns needed to greet people, introduce yourself, count, talk about your family, tell the time, order food and describe daily activities.</p>
<h3>What makes Chinese special</h3>
<ul>
<li><strong>Tones</strong> — Mandarin has <strong>4 tones</strong> plus a neutral tone; the same syllable with a different tone is a different word (mā 妈 mother vs mǎ 马 horse).</li>
<li><strong>Hanzi (汉字)</strong> — Chinese is written with characters, not an alphabet. <strong>Pinyin</strong> spells their sound with Latin letters.</li>
<li><strong>No conjugation</strong> — verbs never change form; grammar comes from fixed word order and small particles.</li>
</ul>
<h3>Roadmap of this course</h3>
<p>Pinyin &amp; tones → greetings → numbers &amp; age → self-introduction → family → time &amp; dates → food &amp; shopping → daily activities. Every lesson has a vocabulary table, grammar points, a short dialogue, pronunciation/writing notes, and a quiz.</p>`,
    `<span class="eyebrow">CHN113 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung sơ cấp 1 (HSK1)</h2>
<p class="lead">Môn này đưa bạn từ <strong>con số 0</strong> tới chuẩn <strong>HSK cấp 1</strong> — khoảng <strong>150 từ</strong> và các mẫu câu cơ bản để chào hỏi, giới thiệu bản thân, đếm số, nói về gia đình, xem giờ, gọi món và mô tả hoạt động hằng ngày.</p>
<h3>Đặc trưng của tiếng Trung</h3>
<ul>
<li><strong>Thanh điệu</strong> — tiếng phổ thông có <strong>4 thanh</strong> cộng thanh nhẹ; cùng một âm khác thanh là khác từ (mā 妈 mẹ vs mǎ 马 ngựa).</li>
<li><strong>Chữ Hán (汉字)</strong> — tiếng Trung viết bằng chữ tượng hình, không phải bảng chữ cái. <strong>Pinyin</strong> ghi âm bằng chữ Latinh.</li>
<li><strong>Không chia động từ</strong> — động từ không đổi dạng; ngữ pháp nằm ở trật tự từ cố định và vài trợ từ nhỏ.</li>
</ul>
<h3>Lộ trình của môn</h3>
<p>Pinyin &amp; thanh điệu → chào hỏi → số đếm &amp; tuổi → giới thiệu bản thân → gia đình → thời gian &amp; ngày tháng → đồ ăn &amp; mua sắm → hoạt động hằng ngày. Mỗi bài có bảng từ vựng, điểm ngữ pháp, một hội thoại ngắn, ghi chú phát âm/chữ viết, và quiz.</p>`,
  ]]);

const b1 = doc('chn113-1-1-pinyin-tones', 'Lesson 1 — Pinyin & the four tones|||Bài 1 — Ngữ âm & thanh điệu',
  'Pinyin: thanh mẫu (initials) & vận mẫu (finals); 4 thanh + thanh nhẹ; dấu thanh ā á ǎ à; quy tắc biến điệu.',
  [[
    `<span class="eyebrow">CHN113 · Lesson 1 · Pronunciation</span>
<h2>Pinyin &amp; the four tones</h2>
<h3>1. Pinyin = initial + final</h3>
<p>Every Mandarin syllable is an <strong>initial (声母 shēngmǔ)</strong> plus a <strong>final (韵母 yùnmǔ)</strong>, carrying one tone. Example: <strong>h + ǎo → hǎo</strong> (好, good).</p>
<ul>
<li><strong>Initials</strong> (consonant sounds): b p m f, d t n l, g k h, j q x, zh ch sh r, z c s.</li>
<li><strong>Finals</strong> (vowel sounds): a o e i u ü, and combinations like ai ao an ang.</li>
</ul>
<h3>2. The four tones (声调 shēngdiào)</h3>
<table>
<tr><th>Tone</th><th>Mark</th><th>Contour</th><th>Example</th></tr>
<tr><td>1st</td><td>ā</td><td>high &amp; flat</td><td>mā 妈 — mother</td></tr>
<tr><td>2nd</td><td>á</td><td>rising</td><td>má 麻 — hemp</td></tr>
<tr><td>3rd</td><td>ǎ</td><td>falling-rising</td><td>mǎ 马 — horse</td></tr>
<tr><td>4th</td><td>à</td><td>sharp falling</td><td>mà 骂 — to scold</td></tr>
<tr><td>neutral</td><td>ma</td><td>light, short</td><td>ma 吗 — question particle</td></tr>
</table>
<h3>3. Tone-change rules</h3>
<ul>
<li><strong>Two 3rd tones</strong>: the first becomes 2nd — nǐ + hǎo → <strong>ní hǎo</strong> (你好).</li>
<li><strong>不 bù</strong> → <strong>bú</strong> before a 4th tone: bú shì (不是, is not).</li>
<li><strong>一 yī</strong> → yì / yí depending on the next tone.</li>
</ul>
<div class="callout"><span class="badge">Note</span> The tone mark sits on the main vowel; a 3rd-tone ǎ dips down then up. Practice mā / má / mǎ / mà until they sound clearly different.</div>`,
    `<span class="eyebrow">CHN113 · Bài 1 · Phát âm</span>
<h2>Ngữ âm &amp; bốn thanh điệu</h2>
<h3>1. Pinyin = thanh mẫu + vận mẫu</h3>
<p>Mỗi âm tiết tiếng phổ thông gồm một <strong>thanh mẫu (声母 shēngmǔ, phụ âm đầu)</strong> cộng một <strong>vận mẫu (韵母 yùnmǔ, phần vần)</strong>, mang một thanh điệu. Ví dụ: <strong>h + ǎo → hǎo</strong> (好, tốt).</p>
<ul>
<li><strong>Thanh mẫu</strong> (phụ âm): b p m f, d t n l, g k h, j q x, zh ch sh r, z c s.</li>
<li><strong>Vận mẫu</strong> (nguyên âm): a o e i u ü, và tổ hợp như ai ao an ang.</li>
</ul>
<h3>2. Bốn thanh điệu (声调 shēngdiào)</h3>
<table>
<tr><th>Thanh</th><th>Dấu</th><th>Diễn biến</th><th>Ví dụ</th></tr>
<tr><td>1</td><td>ā</td><td>cao &amp; ngang</td><td>mā 妈 — mẹ</td></tr>
<tr><td>2</td><td>á</td><td>lên (như dấu sắc)</td><td>má 麻 — cây gai</td></tr>
<tr><td>3</td><td>ǎ</td><td>xuống rồi lên</td><td>mǎ 马 — con ngựa</td></tr>
<tr><td>4</td><td>à</td><td>xuống gắt</td><td>mà 骂 — mắng</td></tr>
<tr><td>nhẹ</td><td>ma</td><td>nhẹ, ngắn</td><td>ma 吗 — trợ từ hỏi</td></tr>
</table>
<h3>3. Quy tắc biến điệu</h3>
<ul>
<li><strong>Hai thanh 3</strong> liền nhau: thanh 3 đầu đọc thành thanh 2 — nǐ + hǎo → <strong>ní hǎo</strong> (你好).</li>
<li><strong>不 bù</strong> → <strong>bú</strong> khi trước thanh 4: bú shì (不是, không phải).</li>
<li><strong>一 yī</strong> → yì / yí tuỳ thanh của chữ đứng sau.</li>
</ul>
<div class="callout"><span class="badge">Ghi chú</span> Dấu thanh đặt trên nguyên âm chính; thanh 3 ǎ hạ xuống rồi nâng lên. Luyện mā / má / mǎ / mà đến khi nghe rõ khác nhau.</div>`,
  ]]);

const b1q = quiz('chn113-quiz-1', 'Quiz 1 — Pinyin & tones|||Quiz 1 — Ngữ âm & thanh điệu', [
  { id: 'q1', question: 'Tiếng phổ thông có mấy thanh điệu (không kể thanh nhẹ)? / How many tones does Mandarin have (not counting the neutral tone)?', options: ['2', '3', '4', '6'], correctIndex: 2, explanation: '4 thanh: ā (cao ngang), á (lên), ǎ (xuống-lên), à (xuống gắt).' },
  { id: 'q2', question: 'Chữ 马 (con ngựa) mang thanh nào? / Which tone does 马 (horse) carry?', options: ['mā (thanh 1)', 'má (thanh 2)', 'mǎ (thanh 3)', 'mà (thanh 4)'], correctIndex: 2, explanation: '马 = mǎ, thanh 3 (xuống rồi lên).' },
  { id: 'q3', question: 'Khi 你 (nǐ) + 好 (hǎo) đứng cạnh nhau thì đọc thế nào? / When nǐ + hǎo meet, how are they read?', options: ['nì hǎo', 'ní hǎo', 'nǐ háo', 'nī hao'], correctIndex: 1, explanation: 'Hai thanh 3 liền nhau: thanh 3 đầu biến thành thanh 2 → ní hǎo.' },
]);

const b2 = doc('chn113-2-1-greetings', 'Lesson 2 — Greetings & pronouns|||Bài 2 — Chào hỏi & đại từ',
  'Từ vựng: 你好, 你好吗, 谢谢, 再见, 对不起; đại từ 我/你/他/她 và số nhiều 们. Ngữ pháp: câu hỏi với 吗, 很 + tính từ.',
  [[
    `<span class="eyebrow">CHN113 · Lesson 2 · Greetings</span>
<h2>Greetings &amp; pronouns</h2>
<h3>Vocabulary (词汇)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>你好</td><td>nǐ hǎo</td><td>hello</td></tr>
<tr><td>你好吗？</td><td>nǐ hǎo ma?</td><td>how are you?</td></tr>
<tr><td>很好</td><td>hěn hǎo</td><td>(I'm) very well</td></tr>
<tr><td>谢谢</td><td>xièxie</td><td>thank you</td></tr>
<tr><td>不客气</td><td>bú kèqi</td><td>you're welcome</td></tr>
<tr><td>对不起</td><td>duìbuqǐ</td><td>sorry</td></tr>
<tr><td>没关系</td><td>méi guānxi</td><td>it's okay</td></tr>
<tr><td>再见</td><td>zàijiàn</td><td>goodbye</td></tr>
</table>
<h3>Pronouns (代词)</h3>
<p>我 wǒ = I/me · 你 nǐ = you · 他 tā = he · 她 tā = she. Add <strong>们 men</strong> for plural: 我们 wǒmen (we), 你们 nǐmen (you all), 他们 tāmen (they).</p>
<h3>Grammar</h3>
<ul>
<li><strong>Yes/no questions with 吗 ma</strong>: statement + 吗 → question. 你好 → 你好<strong>吗</strong>? (Are you well?)</li>
<li><strong>很 hěn + adjective</strong>: adjectives usually take 很. 我<strong>很</strong>好 = I'm (very) well.</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你好！        Nǐ hǎo!        (Hello!)
B: 你好！你好吗？ Nǐ hǎo! Nǐ hǎo ma?  (Hello! How are you?)
A: 我很好，谢谢。 Wǒ hěn hǎo, xièxie. (I'm well, thanks.)
B: 再见！        Zàijiàn!       (Goodbye!)
</code></pre>
<div class="callout"><span class="badge">Writing note</span> 好 (hǎo, good) = 女 (woman) + 子 (child) side by side — a common, easy character to start writing.</div>`,
    `<span class="eyebrow">CHN113 · Bài 2 · Chào hỏi</span>
<h2>Chào hỏi &amp; đại từ</h2>
<h3>Từ vựng (词汇)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>你好</td><td>nǐ hǎo</td><td>xin chào</td></tr>
<tr><td>你好吗？</td><td>nǐ hǎo ma?</td><td>bạn khoẻ không?</td></tr>
<tr><td>很好</td><td>hěn hǎo</td><td>(tôi) rất khoẻ</td></tr>
<tr><td>谢谢</td><td>xièxie</td><td>cảm ơn</td></tr>
<tr><td>不客气</td><td>bú kèqi</td><td>không có gì</td></tr>
<tr><td>对不起</td><td>duìbuqǐ</td><td>xin lỗi</td></tr>
<tr><td>没关系</td><td>méi guānxi</td><td>không sao</td></tr>
<tr><td>再见</td><td>zàijiàn</td><td>tạm biệt</td></tr>
</table>
<h3>Đại từ (代词)</h3>
<p>我 wǒ = tôi · 你 nǐ = bạn · 他 tā = anh ấy · 她 tā = cô ấy. Thêm <strong>们 men</strong> để thành số nhiều: 我们 wǒmen (chúng tôi), 你们 nǐmen (các bạn), 他们 tāmen (họ).</p>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>Câu hỏi có/không với 吗 ma</strong>: câu trần thuật + 吗 → câu hỏi. 你好 → 你好<strong>吗</strong>? (Bạn khoẻ không?)</li>
<li><strong>很 hěn + tính từ</strong>: tính từ thường đi kèm 很. 我<strong>很</strong>好 = Tôi (rất) khoẻ.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你好！        Nǐ hǎo!        (Xin chào!)
B: 你好！你好吗？ Nǐ hǎo! Nǐ hǎo ma?  (Chào! Bạn khoẻ không?)
A: 我很好，谢谢。 Wǒ hěn hǎo, xièxie. (Tôi khoẻ, cảm ơn.)
B: 再见！        Zàijiàn!       (Tạm biệt!)
</code></pre>
<div class="callout"><span class="badge">Ghi chú chữ viết</span> 好 (hǎo, tốt) = 女 (nữ) + 子 (tử/con) ghép cạnh nhau — một chữ dễ, hợp để bắt đầu tập viết.</div>`,
  ]]);

const b2q = quiz('chn113-quiz-2', 'Quiz 2 — Greetings|||Quiz 2 — Chào hỏi', [
  { id: 'q1', question: '"Cảm ơn" trong tiếng Trung là? / How do you say "thank you"?', options: ['再见 zàijiàn', '谢谢 xièxie', '对不起 duìbuqǐ', '你好 nǐ hǎo'], correctIndex: 1, explanation: '谢谢 xièxie = cảm ơn; đáp lại là 不客气 bú kèqi.' },
  { id: 'q2', question: 'Trợ từ nào biến câu trần thuật thành câu hỏi có/không? / Which particle turns a statement into a yes/no question?', options: ['了 le', '吗 ma', '的 de', '呢 ne'], correctIndex: 1, explanation: 'Thêm 吗 ma cuối câu: 你好吗? = Bạn khoẻ không?' },
  { id: 'q3', question: '"我们" (wǒmen) nghĩa là gì? / What does 我们 mean?', options: ['tôi', 'họ', 'chúng tôi', 'các bạn'], correctIndex: 2, explanation: '我 (tôi) + 们 (số nhiều) = 我们 chúng tôi.' },
]);

const b3 = doc('chn113-3-1-numbers-age', 'Lesson 3 — Numbers & age|||Bài 3 — Số đếm & tuổi',
  'Số 0–100; hỏi số lượng với 几 và 多少; hỏi tuổi với 岁, 你几岁 / 你多大.',
  [[
    `<span class="eyebrow">CHN113 · Lesson 3 · Numbers</span>
<h2>Numbers &amp; age</h2>
<h3>Numbers 0–10 (数字)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>#</th><th>汉字</th><th>pīnyīn</th><th>#</th></tr>
<tr><td>零</td><td>líng</td><td>0</td><td>六</td><td>liù</td><td>6</td></tr>
<tr><td>一</td><td>yī</td><td>1</td><td>七</td><td>qī</td><td>7</td></tr>
<tr><td>二</td><td>èr</td><td>2</td><td>八</td><td>bā</td><td>8</td></tr>
<tr><td>三</td><td>sān</td><td>3</td><td>九</td><td>jiǔ</td><td>9</td></tr>
<tr><td>四</td><td>sì</td><td>4</td><td>十</td><td>shí</td><td>10</td></tr>
<tr><td>五</td><td>wǔ</td><td>5</td><td>百</td><td>bǎi</td><td>100</td></tr>
</table>
<h3>Building bigger numbers</h3>
<p>11 = 十一 shíyī (10+1); 20 = 二十 èrshí (2×10); 25 = 二十五 èrshíwǔ; 100 = 一百 yìbǎi.</p>
<h3>Grammar — asking "how many"</h3>
<ul>
<li><strong>几 jǐ</strong> — for small numbers (usually under 10): 几岁? (how old?)</li>
<li><strong>多少 duōshao</strong> — for larger/any amounts: 多少人? (how many people?)</li>
</ul>
<h3>Talking about age (岁 suì = years old)</h3>
<pre><code>你几岁？   Nǐ jǐ suì?    (How old are you? — to a child)
我八岁。   Wǒ bā suì.    (I'm eight.)
你多大？   Nǐ duō dà?    (How old are you? — general)
</code></pre>
<div class="callout"><span class="badge">Note</span> After a number you normally need a measure word, but 岁 (suì) acts as its own measure: 八岁 = eight years old (no extra word).</div>`,
    `<span class="eyebrow">CHN113 · Bài 3 · Số đếm</span>
<h2>Số đếm &amp; tuổi</h2>
<h3>Số 0–10 (数字)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>#</th><th>汉字</th><th>pīnyīn</th><th>#</th></tr>
<tr><td>零</td><td>líng</td><td>0</td><td>六</td><td>liù</td><td>6</td></tr>
<tr><td>一</td><td>yī</td><td>1</td><td>七</td><td>qī</td><td>7</td></tr>
<tr><td>二</td><td>èr</td><td>2</td><td>八</td><td>bā</td><td>8</td></tr>
<tr><td>三</td><td>sān</td><td>3</td><td>九</td><td>jiǔ</td><td>9</td></tr>
<tr><td>四</td><td>sì</td><td>4</td><td>十</td><td>shí</td><td>10</td></tr>
<tr><td>五</td><td>wǔ</td><td>5</td><td>百</td><td>bǎi</td><td>100</td></tr>
</table>
<h3>Ghép số lớn hơn</h3>
<p>11 = 十一 shíyī (10+1); 20 = 二十 èrshí (2×10); 25 = 二十五 èrshíwǔ; 100 = 一百 yìbǎi.</p>
<h3>Ngữ pháp — hỏi "bao nhiêu"</h3>
<ul>
<li><strong>几 jǐ</strong> — dùng cho số nhỏ (thường dưới 10): 几岁? (mấy tuổi?)</li>
<li><strong>多少 duōshao</strong> — dùng cho số lớn/bất kỳ: 多少人? (bao nhiêu người?)</li>
</ul>
<h3>Nói về tuổi (岁 suì = tuổi)</h3>
<pre><code>你几岁？   Nǐ jǐ suì?    (Cháu mấy tuổi? — hỏi trẻ nhỏ)
我八岁。   Wǒ bā suì.    (Cháu tám tuổi.)
你多大？   Nǐ duō dà?    (Bạn bao nhiêu tuổi? — chung)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Sau số thường cần lượng từ, nhưng 岁 (suì) tự làm lượng từ luôn: 八岁 = tám tuổi (không thêm chữ nào).</div>`,
  ]]);

const b3q = quiz('chn113-quiz-3', 'Quiz 3 — Numbers & age|||Quiz 3 — Số đếm & tuổi', [
  { id: 'q1', question: 'Số 8 viết là? / How is the number 8 written?', options: ['八 bā', '九 jiǔ', '十 shí', '六 liù'], correctIndex: 0, explanation: '八 bā = 8; 九 jiǔ = 9; 十 shí = 10; 六 liù = 6.' },
  { id: 'q2', question: '"二十五" (èrshíwǔ) là số mấy? / What number is 二十五?', options: ['15', '25', '52', '250'], correctIndex: 1, explanation: '二十 (20) + 五 (5) = 25.' },
  { id: 'q3', question: 'Hỏi tuổi bằng chữ nào? / Which word asks about age?', options: ['块 kuài', '岁 suì', '点 diǎn', '个 gè'], correctIndex: 1, explanation: '岁 suì = tuổi: 你几岁? / 我八岁。' },
]);

const b4 = doc('chn113-4-1-self-intro', 'Lesson 4 — Introducing yourself|||Bài 4 — Giới thiệu bản thân',
  'Tên với 叫/姓/名字; động từ 是; quốc tịch với 国 + 人; hỏi với 什么, 哪. Câu "很高兴认识你".',
  [[
    `<span class="eyebrow">CHN113 · Lesson 4 · Self-introduction</span>
<h2>Introducing yourself</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>叫</td><td>jiào</td><td>to be called (full/given name)</td></tr>
<tr><td>姓</td><td>xìng</td><td>surname (to be surnamed)</td></tr>
<tr><td>名字</td><td>míngzi</td><td>name</td></tr>
<tr><td>是</td><td>shì</td><td>to be (am/is/are)</td></tr>
<tr><td>什么</td><td>shénme</td><td>what</td></tr>
<tr><td>哪</td><td>nǎ</td><td>which</td></tr>
<tr><td>国</td><td>guó</td><td>country</td></tr>
<tr><td>人</td><td>rén</td><td>person</td></tr>
<tr><td>中国</td><td>Zhōngguó</td><td>China</td></tr>
<tr><td>越南</td><td>Yuènán</td><td>Vietnam</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>叫 vs 姓</strong>: 我<strong>姓</strong>王 (my surname is Wang) · 我<strong>叫</strong>王明 (my name is Wang Ming).</li>
<li><strong>是 shì</strong> links two nouns: 我<strong>是</strong>学生 (I am a student). Negate with 不: 我不是老师.</li>
<li><strong>Nationality</strong> = country + 人: 中国人 (Chinese), 越南人 (Vietnamese). Ask: 你是哪国人? (which country are you from?)</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你叫什么名字？ Nǐ jiào shénme míngzi? (What's your name?)
B: 我叫大卫。     Wǒ jiào Dàwèi.        (My name is David.)
A: 你是哪国人？   Nǐ shì nǎ guó rén?    (Which country are you from?)
B: 我是越南人。   Wǒ shì Yuènán rén.    (I'm Vietnamese.)
A: 很高兴认识你！ Hěn gāoxìng rènshi nǐ! (Nice to meet you!)
</code></pre>
<div class="callout"><span class="badge">Note</span> Chinese order is family name + given name: 王明 = surname 王 (Wáng) then given name 明 (Míng).</div>`,
    `<span class="eyebrow">CHN113 · Bài 4 · Giới thiệu</span>
<h2>Giới thiệu bản thân</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>叫</td><td>jiào</td><td>tên là (tên đầy đủ/tên gọi)</td></tr>
<tr><td>姓</td><td>xìng</td><td>họ (mang họ)</td></tr>
<tr><td>名字</td><td>míngzi</td><td>tên</td></tr>
<tr><td>是</td><td>shì</td><td>là</td></tr>
<tr><td>什么</td><td>shénme</td><td>gì, cái gì</td></tr>
<tr><td>哪</td><td>nǎ</td><td>nào</td></tr>
<tr><td>国</td><td>guó</td><td>nước, quốc gia</td></tr>
<tr><td>人</td><td>rén</td><td>người</td></tr>
<tr><td>中国</td><td>Zhōngguó</td><td>Trung Quốc</td></tr>
<tr><td>越南</td><td>Yuènán</td><td>Việt Nam</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>叫 và 姓</strong>: 我<strong>姓</strong>王 (tôi họ Vương) · 我<strong>叫</strong>王明 (tôi tên Vương Minh).</li>
<li><strong>是 shì</strong> nối hai danh từ: 我<strong>是</strong>学生 (tôi là học sinh). Phủ định bằng 不: 我不是老师.</li>
<li><strong>Quốc tịch</strong> = tên nước + 人: 中国人 (người Trung Quốc), 越南人 (người Việt Nam). Hỏi: 你是哪国人? (bạn là người nước nào?)</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你叫什么名字？ Nǐ jiào shénme míngzi? (Bạn tên gì?)
B: 我叫大卫。     Wǒ jiào Dàwèi.        (Tôi tên David.)
A: 你是哪国人？   Nǐ shì nǎ guó rén?    (Bạn là người nước nào?)
B: 我是越南人。   Wǒ shì Yuènán rén.    (Tôi là người Việt Nam.)
A: 很高兴认识你！ Hěn gāoxìng rènshi nǐ! (Rất vui được gặp bạn!)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Trật tự tên tiếng Trung là họ + tên: 王明 = họ 王 (Vương) rồi tên 明 (Minh).</div>`,
  ]]);

const b4q = quiz('chn113-quiz-4', 'Quiz 4 — Self-introduction|||Quiz 4 — Giới thiệu bản thân', [
  { id: 'q1', question: 'Hỏi "Bạn tên gì?" đúng là? / How do you ask "What is your name?"', options: ['你几岁？', '你好吗？', '你叫什么名字？', '你有几个？'], correctIndex: 2, explanation: '你叫什么名字? = Bạn tên (gọi là) gì?' },
  { id: 'q2', question: 'Động từ "là" (nối hai danh từ) trong tiếng Trung là? / Which verb means "to be" linking two nouns?', options: ['有 yǒu', '是 shì', '在 zài', '叫 jiào'], correctIndex: 1, explanation: '是 shì: 我是越南人 = Tôi là người Việt Nam. Phủ định: 不是.' },
  { id: 'q3', question: '"我是越南人" nghĩa là? / What does 我是越南人 mean?', options: ['Tôi họ Việt', 'Tôi là người Việt Nam', 'Tôi thích Việt Nam', 'Tôi ở Việt Nam'], correctIndex: 1, explanation: '越南 (Việt Nam) + 人 (người) = người Việt Nam; 我是… = tôi là…' },
]);

const b5 = doc('chn113-5-1-family', 'Lesson 5 — Family|||Bài 5 — Gia đình',
  'Thành viên gia đình (爸爸 妈妈 哥哥 姐姐 弟弟 妹妹); động từ 有/没有; lượng từ 个 và 口 (đếm người trong nhà).',
  [[
    `<span class="eyebrow">CHN113 · Lesson 5 · Family</span>
<h2>Family (家)</h2>
<h3>Family members (成员)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>家</td><td>jiā</td><td>family / home</td></tr>
<tr><td>爸爸</td><td>bàba</td><td>father</td></tr>
<tr><td>妈妈</td><td>māma</td><td>mother</td></tr>
<tr><td>哥哥</td><td>gēge</td><td>older brother</td></tr>
<tr><td>姐姐</td><td>jiějie</td><td>older sister</td></tr>
<tr><td>弟弟</td><td>dìdi</td><td>younger brother</td></tr>
<tr><td>妹妹</td><td>mèimei</td><td>younger sister</td></tr>
<tr><td>有</td><td>yǒu</td><td>to have</td></tr>
<tr><td>没有</td><td>méiyǒu</td><td>to not have</td></tr>
<tr><td>和</td><td>hé</td><td>and</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>有 yǒu / 没有 méiyǒu</strong>: 我<strong>有</strong>一个哥哥 (I have one older brother). The negative of 有 is always <strong>没有</strong>, never 不有.</li>
<li><strong>Measure words</strong>: number + measure + noun. 个 gè is the general one (三<strong>个</strong>人); 口 kǒu counts people in a household (五<strong>口</strong>人).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你家有几口人？   Nǐ jiā yǒu jǐ kǒu rén? (How many people in your family?)
B: 我家有四口人。   Wǒ jiā yǒu sì kǒu rén. (Four people.)
   爸爸、妈妈、姐姐和我。 Bàba, māma, jiějie hé wǒ. (Dad, mom, older sister and me.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 爸爸, 妈妈, 哥哥… double the character; the second syllable is neutral tone (bà<strong>ba</strong>, mā<strong>ma</strong>).</div>`,
    `<span class="eyebrow">CHN113 · Bài 5 · Gia đình</span>
<h2>Gia đình (家)</h2>
<h3>Thành viên (成员)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>家</td><td>jiā</td><td>gia đình / nhà</td></tr>
<tr><td>爸爸</td><td>bàba</td><td>bố</td></tr>
<tr><td>妈妈</td><td>māma</td><td>mẹ</td></tr>
<tr><td>哥哥</td><td>gēge</td><td>anh trai</td></tr>
<tr><td>姐姐</td><td>jiějie</td><td>chị gái</td></tr>
<tr><td>弟弟</td><td>dìdi</td><td>em trai</td></tr>
<tr><td>妹妹</td><td>mèimei</td><td>em gái</td></tr>
<tr><td>有</td><td>yǒu</td><td>có</td></tr>
<tr><td>没有</td><td>méiyǒu</td><td>không có</td></tr>
<tr><td>和</td><td>hé</td><td>và</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>有 yǒu / 没有 méiyǒu</strong>: 我<strong>有</strong>一个哥哥 (Tôi có một anh trai). Phủ định của 有 luôn là <strong>没有</strong>, không bao giờ 不有.</li>
<li><strong>Lượng từ</strong>: số + lượng từ + danh từ. 个 gè là lượng từ chung (三<strong>个</strong>人); 口 kǒu dùng đếm người trong nhà (五<strong>口</strong>人).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你家有几口人？   Nǐ jiā yǒu jǐ kǒu rén? (Nhà bạn có mấy người?)
B: 我家有四口人。   Wǒ jiā yǒu sì kǒu rén. (Nhà tôi có bốn người.)
   爸爸、妈妈、姐姐和我。 Bàba, māma, jiějie hé wǒ. (Bố, mẹ, chị gái và tôi.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 爸爸, 妈妈, 哥哥… lặp lại chữ; âm tiết thứ hai đọc thanh nhẹ (bà<strong>ba</strong>, mā<strong>ma</strong>).</div>`,
  ]]);

const b5q = quiz('chn113-quiz-5', 'Quiz 5 — Family|||Quiz 5 — Gia đình', [
  { id: 'q1', question: 'Phủ định của 有 (yǒu, có) là? / What is the negative of 有?', options: ['不有 bù yǒu', '没有 méiyǒu', '无有 wú yǒu', '别有 bié yǒu'], correctIndex: 1, explanation: '有 luôn phủ định bằng 没有, không dùng 不有.' },
  { id: 'q2', question: 'Lượng từ dùng để đếm người trong gia đình là? / Which measure word counts people in a household?', options: ['个 gè', '口 kǒu', '岁 suì', '块 kuài'], correctIndex: 1, explanation: '口 kǒu chuyên đếm số người trong nhà: 四口人 = bốn người.' },
  { id: 'q3', question: '"姐姐" (jiějie) là ai? / Who is 姐姐?', options: ['em gái', 'chị gái', 'anh trai', 'mẹ'], correctIndex: 1, explanation: '姐姐 = chị gái; 妹妹 = em gái; 哥哥 = anh trai.' },
]);

const b6 = doc('chn113-6-1-time-date', 'Lesson 6 — Time & dates|||Bài 6 — Thời gian & ngày tháng',
  'Năm/tháng/ngày (年 月 日/号), thứ (星期), giờ phút (点 分), 现在; số 2 đặc biệt 两.',
  [[
    `<span class="eyebrow">CHN113 · Lesson 6 · Time</span>
<h2>Time &amp; dates</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>年</td><td>nián</td><td>year</td></tr>
<tr><td>月</td><td>yuè</td><td>month</td></tr>
<tr><td>日 / 号</td><td>rì / hào</td><td>day (of month)</td></tr>
<tr><td>星期</td><td>xīngqī</td><td>week</td></tr>
<tr><td>今天</td><td>jīntiān</td><td>today</td></tr>
<tr><td>明天</td><td>míngtiān</td><td>tomorrow</td></tr>
<tr><td>昨天</td><td>zuótiān</td><td>yesterday</td></tr>
<tr><td>现在</td><td>xiànzài</td><td>now</td></tr>
<tr><td>点</td><td>diǎn</td><td>o'clock (hour)</td></tr>
<tr><td>分</td><td>fēn</td><td>minute</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>Dates go big → small</strong>: year 年 → month 月 → day 号. e.g. 2024年5月8号.</li>
<li><strong>Weekdays</strong> = 星期 + number: 星期一 Mon, 星期二 Tue … 星期六 Sat, 星期天 Sun.</li>
<li><strong>Telling time</strong>: 点 (hour) + 分 (minute). 现在几点? (What time is it now?) — 三点十分 (3:10).</li>
<li><strong>两 liǎng vs 二 èr</strong>: use <strong>两</strong> before a measure — 两点 (2 o'clock), not 二点.</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 现在几点？   Xiànzài jǐ diǎn?  (What time is it now?)
B: 现在两点半。 Xiànzài liǎng diǎn bàn. (It's 2:30 — 半 bàn = half.)
A: 今天几号？   Jīntiān jǐ hào?  (What's the date today?)
B: 今天八号，星期一。 Jīntiān bā hào, xīngqīyī. (The 8th, Monday.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 号 (hào) is spoken; 日 (rì) is the written/formal form for the day of the month.</div>`,
    `<span class="eyebrow">CHN113 · Bài 6 · Thời gian</span>
<h2>Thời gian &amp; ngày tháng</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>年</td><td>nián</td><td>năm</td></tr>
<tr><td>月</td><td>yuè</td><td>tháng</td></tr>
<tr><td>日 / 号</td><td>rì / hào</td><td>ngày (trong tháng)</td></tr>
<tr><td>星期</td><td>xīngqī</td><td>tuần</td></tr>
<tr><td>今天</td><td>jīntiān</td><td>hôm nay</td></tr>
<tr><td>明天</td><td>míngtiān</td><td>ngày mai</td></tr>
<tr><td>昨天</td><td>zuótiān</td><td>hôm qua</td></tr>
<tr><td>现在</td><td>xiànzài</td><td>bây giờ</td></tr>
<tr><td>点</td><td>diǎn</td><td>giờ</td></tr>
<tr><td>分</td><td>fēn</td><td>phút</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>Ngày tháng đi từ lớn → nhỏ</strong>: năm 年 → tháng 月 → ngày 号. Ví dụ 2024年5月8号.</li>
<li><strong>Thứ trong tuần</strong> = 星期 + số: 星期一 Thứ Hai, 星期二 Thứ Ba … 星期六 Thứ Bảy, 星期天 Chủ Nhật.</li>
<li><strong>Xem giờ</strong>: 点 (giờ) + 分 (phút). 现在几点? (Bây giờ mấy giờ?) — 三点十分 (3 giờ 10).</li>
<li><strong>两 liǎng và 二 èr</strong>: dùng <strong>两</strong> trước lượng từ — 两点 (2 giờ), không nói 二点.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 现在几点？   Xiànzài jǐ diǎn?  (Bây giờ mấy giờ?)
B: 现在两点半。 Xiànzài liǎng diǎn bàn. (2 giờ rưỡi — 半 bàn = rưỡi/nửa.)
A: 今天几号？   Jīntiān jǐ hào?  (Hôm nay ngày mấy?)
B: 今天八号，星期一。 Jīntiān bā hào, xīngqīyī. (Ngày 8, Thứ Hai.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 号 (hào) dùng khi nói; 日 (rì) là dạng viết/trang trọng cho ngày trong tháng.</div>`,
  ]]);

const b6q = quiz('chn113-quiz-6', 'Quiz 6 — Time & dates|||Quiz 6 — Thời gian & ngày tháng', [
  { id: 'q1', question: 'Chữ nào chỉ "giờ" khi xem đồng hồ? / Which word means the hour (o clock)?', options: ['分 fēn', '点 diǎn', '号 hào', '岁 suì'], correctIndex: 1, explanation: '点 diǎn = giờ; 分 fēn = phút. 三点十分 = 3 giờ 10.' },
  { id: 'q2', question: '"星期一" (xīngqīyī) là thứ mấy? / Which day is 星期一?', options: ['Chủ Nhật', 'Thứ Hai', 'Thứ Bảy', 'Thứ Tư'], correctIndex: 1, explanation: '星期 + 一 (1) = Thứ Hai (ngày làm việc đầu tuần).' },
  { id: 'q3', question: '"2 giờ" nói đúng là? / How do you say "2 o clock"?', options: ['二点 èr diǎn', '两点 liǎng diǎn', '二时 èr shí', '两号 liǎng hào'], correctIndex: 1, explanation: 'Trước lượng từ dùng 两 chứ không dùng 二 → 两点.' },
]);

const b7 = doc('chn113-7-1-food-shopping', 'Lesson 7 — Food & shopping|||Bài 7 — Đồ ăn & mua sắm',
  'Ăn/uống (吃 喝), món & đồ uống (米饭 菜 水 茶), động từ 想/要/买, tiền 钱/块, hỏi giá 多少钱.',
  [[
    `<span class="eyebrow">CHN113 · Lesson 7 · Food &amp; shopping</span>
<h2>Food &amp; shopping</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>吃</td><td>chī</td><td>to eat</td></tr>
<tr><td>喝</td><td>hē</td><td>to drink</td></tr>
<tr><td>米饭</td><td>mǐfàn</td><td>(cooked) rice</td></tr>
<tr><td>菜</td><td>cài</td><td>dish / vegetable</td></tr>
<tr><td>水</td><td>shuǐ</td><td>water</td></tr>
<tr><td>茶</td><td>chá</td><td>tea</td></tr>
<tr><td>想</td><td>xiǎng</td><td>to want / would like</td></tr>
<tr><td>要</td><td>yào</td><td>to want / need</td></tr>
<tr><td>买</td><td>mǎi</td><td>to buy</td></tr>
<tr><td>钱</td><td>qián</td><td>money</td></tr>
<tr><td>块</td><td>kuài</td><td>unit of money (yuan, spoken)</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>想 xiǎng + verb</strong> = would like to (do): 我<strong>想</strong>喝茶 (I'd like to drink tea).</li>
<li><strong>要 yào + noun</strong> = want (something): 我<strong>要</strong>米饭 (I want rice).</li>
<li><strong>Asking a price</strong>: 多少钱? (how much money?) Answer with 块: 五块 (5 yuan).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你想吃什么？ Nǐ xiǎng chī shénme? (What would you like to eat?)
B: 我想吃米饭和菜。 Wǒ xiǎng chī mǐfàn hé cài. (Rice and a dish.)
A: 这个苹果多少钱？ Zhège píngguǒ duōshao qián? (How much is this apple?)
B: 三块。          Sān kuài.            (Three yuan.)
</code></pre>
<div class="callout"><span class="badge">Note</span> Point at things with 这个 zhège (this one) / 那个 nàge (that one) — 个 gè is the general measure word.</div>`,
    `<span class="eyebrow">CHN113 · Bài 7 · Đồ ăn &amp; mua sắm</span>
<h2>Đồ ăn &amp; mua sắm</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>吃</td><td>chī</td><td>ăn</td></tr>
<tr><td>喝</td><td>hē</td><td>uống</td></tr>
<tr><td>米饭</td><td>mǐfàn</td><td>cơm</td></tr>
<tr><td>菜</td><td>cài</td><td>món ăn / rau</td></tr>
<tr><td>水</td><td>shuǐ</td><td>nước</td></tr>
<tr><td>茶</td><td>chá</td><td>trà</td></tr>
<tr><td>想</td><td>xiǎng</td><td>muốn</td></tr>
<tr><td>要</td><td>yào</td><td>muốn / cần (lấy)</td></tr>
<tr><td>买</td><td>mǎi</td><td>mua</td></tr>
<tr><td>钱</td><td>qián</td><td>tiền</td></tr>
<tr><td>块</td><td>kuài</td><td>đơn vị tiền (tệ, khi nói)</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>想 xiǎng + động từ</strong> = muốn (làm gì): 我<strong>想</strong>喝茶 (Tôi muốn uống trà).</li>
<li><strong>要 yào + danh từ</strong> = muốn/lấy (cái gì): 我<strong>要</strong>米饭 (Tôi lấy cơm).</li>
<li><strong>Hỏi giá</strong>: 多少钱? (bao nhiêu tiền?) Trả lời dùng 块: 五块 (5 tệ).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你想吃什么？ Nǐ xiǎng chī shénme? (Bạn muốn ăn gì?)
B: 我想吃米饭和菜。 Wǒ xiǎng chī mǐfàn hé cài. (Tôi muốn ăn cơm và món rau.)
A: 这个苹果多少钱？ Zhège píngguǒ duōshao qián? (Quả táo này bao nhiêu tiền?)
B: 三块。          Sān kuài.            (Ba tệ.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Chỉ vào vật bằng 这个 zhège (cái này) / 那个 nàge (cái kia) — 个 gè là lượng từ chung.</div>`,
  ]]);

const b7q = quiz('chn113-quiz-7', 'Quiz 7 — Food & shopping|||Quiz 7 — Đồ ăn & mua sắm', [
  { id: 'q1', question: '"Uống trà" nói đúng là? / How do you say "drink tea"?', options: ['吃茶 chī chá', '喝茶 hē chá', '买茶 mǎi chá', '要水 yào shuǐ'], correctIndex: 1, explanation: '喝 hē = uống (dùng cho đồ lỏng); 吃 chī = ăn.' },
  { id: 'q2', question: 'Hỏi giá "bao nhiêu tiền?" là? / How do you ask "how much?"', options: ['几点？', '多少钱？', '哪国人？', '几岁？'], correctIndex: 1, explanation: '多少钱? = bao nhiêu tiền; trả lời bằng …块.' },
  { id: 'q3', question: '"想 + động từ" diễn đạt điều gì? / What does 想 + verb express?', options: ['đã làm xong', 'muốn/định làm', 'không thể làm', 'đang ở đâu'], correctIndex: 1, explanation: '想 xiǎng + động từ = muốn làm: 我想吃米饭.' },
]);

const b8 = doc('chn113-8-1-daily-places', 'Lesson 8 — Daily activities & places|||Bài 8 — Hoạt động hằng ngày & địa điểm',
  'Động từ 去 做 看 说; 在 (ở/tại) làm giới từ & động từ; hỏi nơi chốn 哪儿; địa điểm 学校 商店 医院.',
  [[
    `<span class="eyebrow">CHN113 · Lesson 8 · Daily life</span>
<h2>Daily activities &amp; places</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>去</td><td>qù</td><td>to go</td></tr>
<tr><td>做</td><td>zuò</td><td>to do / make</td></tr>
<tr><td>看</td><td>kàn</td><td>to look / watch / read</td></tr>
<tr><td>说</td><td>shuō</td><td>to speak / say</td></tr>
<tr><td>在</td><td>zài</td><td>at / in; to be located</td></tr>
<tr><td>哪儿</td><td>nǎr</td><td>where</td></tr>
<tr><td>学校</td><td>xuéxiào</td><td>school</td></tr>
<tr><td>商店</td><td>shāngdiàn</td><td>shop / store</td></tr>
<tr><td>医院</td><td>yīyuàn</td><td>hospital</td></tr>
<tr><td>汉语</td><td>Hànyǔ</td><td>Chinese (language)</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>在 zài as a verb</strong> (to be located): 我<strong>在</strong>学校 (I'm at school). Ask: 你在哪儿? (Where are you?)</li>
<li><strong>在 zài as a preposition</strong> — comes <em>before</em> the verb: 我<strong>在</strong>家看书 (I read at home). Place phrase goes before the action.</li>
<li><strong>去 qù + place</strong>: 我去商店 (I go to the shop) — no extra "to" word needed.</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你去哪儿？   Nǐ qù nǎr?       (Where are you going?)
B: 我去学校。   Wǒ qù xuéxiào.   (I'm going to school.)
A: 你在学校做什么？ Nǐ zài xuéxiào zuò shénme? (What do you do at school?)
B: 我学习汉语。 Wǒ xuéxí Hànyǔ.  (I study Chinese.)
</code></pre>
<div class="callout"><span class="badge">Word order</span> Chinese keeps the pattern <strong>Who + (when) + (where 在…) + verb + what</strong>. The place with 在 sits before the verb, not after.</div>`,
    `<span class="eyebrow">CHN113 · Bài 8 · Đời sống hằng ngày</span>
<h2>Hoạt động hằng ngày &amp; địa điểm</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>去</td><td>qù</td><td>đi (đến)</td></tr>
<tr><td>做</td><td>zuò</td><td>làm</td></tr>
<tr><td>看</td><td>kàn</td><td>nhìn / xem / đọc</td></tr>
<tr><td>说</td><td>shuō</td><td>nói</td></tr>
<tr><td>在</td><td>zài</td><td>ở / tại; đang ở</td></tr>
<tr><td>哪儿</td><td>nǎr</td><td>ở đâu</td></tr>
<tr><td>学校</td><td>xuéxiào</td><td>trường học</td></tr>
<tr><td>商店</td><td>shāngdiàn</td><td>cửa hàng</td></tr>
<tr><td>医院</td><td>yīyuàn</td><td>bệnh viện</td></tr>
<tr><td>汉语</td><td>Hànyǔ</td><td>tiếng Trung (Hán ngữ)</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>在 zài làm động từ</strong> (ở tại): 我<strong>在</strong>学校 (Tôi ở trường). Hỏi: 你在哪儿? (Bạn ở đâu?)</li>
<li><strong>在 zài làm giới từ</strong> — đứng <em>trước</em> động từ: 我<strong>在</strong>家看书 (Tôi đọc sách ở nhà). Cụm nơi chốn đặt trước hành động.</li>
<li><strong>去 qù + địa điểm</strong>: 我去商店 (Tôi đi cửa hàng) — không cần thêm chữ "đến".</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你去哪儿？   Nǐ qù nǎr?       (Bạn đi đâu?)
B: 我去学校。   Wǒ qù xuéxiào.   (Tôi đi (đến) trường.)
A: 你在学校做什么？ Nǐ zài xuéxiào zuò shénme? (Bạn làm gì ở trường?)
B: 我学习汉语。 Wǒ xuéxí Hànyǔ.  (Tôi học tiếng Trung.)
</code></pre>
<div class="callout"><span class="badge">Trật tự từ</span> Tiếng Trung giữ mẫu <strong>Ai + (khi nào) + (ở đâu 在…) + động từ + cái gì</strong>. Cụm nơi chốn có 在 đứng trước động từ, không đứng sau.</div>`,
  ]]);

const b8q = quiz('chn113-quiz-8', 'Quiz 8 — Daily activities & places|||Quiz 8 — Hoạt động & địa điểm', [
  { id: 'q1', question: 'Hỏi "Bạn đi đâu?" đúng là? / How do you ask "Where are you going?"', options: ['你在哪儿？', '你去哪儿？', '你做什么？', '你几岁？'], correctIndex: 1, explanation: '去 (đi) + 哪儿 (đâu) = 你去哪儿? Còn 你在哪儿? = Bạn ở đâu?' },
  { id: 'q2', question: 'Trong câu "我在家看书", cụm nơi chốn 在家 đứng ở đâu? / In 我在家看书, where does the place phrase 在家 sit?', options: ['sau động từ 看', 'trước động từ 看', 'cuối câu', 'trước chủ ngữ'], correctIndex: 1, explanation: 'Cụm 在 + nơi chốn đứng TRƯỚC động từ: 我 在家 看书.' },
  { id: 'q3', question: '"学校" (xuéxiào) là nơi nào? / What place is 学校?', options: ['bệnh viện', 'cửa hàng', 'trường học', 'nhà'], correctIndex: 2, explanation: '学校 = trường học; 商店 = cửa hàng; 医院 = bệnh viện.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'CHN113',
    slug: 'chn113-elementary-chinese-1',
    title: 'Elementary Chinese 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHN113.webp',
    shortDescription: 'Elementary Chinese 1 (HSK1) — pinyin & the 4 tones, then ~150 core words: greetings, numbers, self-introduction, family, time, food & shopping, daily activities. Grammar, dialogues, hanzi, bilingual, with quizzes.|||Tiếng Trung sơ cấp 1 (HSK1) — pinyin & 4 thanh điệu, rồi ~150 từ lõi: chào hỏi, số đếm, giới thiệu bản thân, gia đình, thời gian, đồ ăn & mua sắm, hoạt động hằng ngày. Ngữ pháp, hội thoại, chữ Hán, song ngữ, kèm quiz.',
    description: 'Môn <strong>CHN113 — Elementary Chinese 1 (Tiếng Trung sơ cấp 1)</strong> đưa bạn từ con số 0 tới chuẩn <strong>HSK cấp 1</strong> (~150 từ). Bắt đầu từ <strong>pinyin &amp; 4 thanh điệu</strong> → <strong>chào hỏi</strong> → <strong>số đếm &amp; tuổi</strong> → <strong>giới thiệu bản thân</strong> → <strong>gia đình</strong> → <strong>thời gian &amp; ngày tháng</strong> → <strong>đồ ăn &amp; mua sắm</strong> → <strong>hoạt động hằng ngày &amp; địa điểm</strong>. Bám giáo trình chuẩn (HSK Standard Course 1 / 汉语教程), song ngữ Trung–Việt, mỗi bài có bảng từ vựng (汉字|pinyin|nghĩa), điểm ngữ pháp, hội thoại ngắn, ghi chú phát âm/chữ viết và quiz.',
    whatYouLearn: 'Hệ thống pinyin (thanh mẫu/vận mẫu) &amp; 4 thanh + thanh nhẹ, quy tắc biến điệu; chào hỏi &amp; đại từ; số 0–100, hỏi số lượng 几/多少, hỏi tuổi 岁; giới thiệu bản thân (叫/姓, 是, quốc tịch 国+人); gia đình (成员, 有/没有, lượng từ 个/口); thời gian &amp; ngày tháng (年月日, 星期, 点分, 现在); đồ ăn &amp; mua sắm (吃/喝, 想/要/买, hỏi giá 多少钱); hoạt động hằng ngày (去/做/看/说, giới từ 在, hỏi nơi chốn 哪儿). Đọc &amp; viết được các chữ Hán cơ bản.',
    requirements: 'Không cần kiến thức tiếng Trung trước đó. Nên cài Pleco hoặc dùng từ điển hanzii.net để tra chữ &amp; nghe phát âm; luyện viết chữ Hán theo thứ tự nét.',
  },
  sections: [
    { title: '📚 Tài liệu & lộ trình|||📚 Course materials', description: 'Giáo trình HSK1, app, từ điển, YouTube, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mục tiêu HSK1, pinyin, thanh điệu, cách học.', lessons: [intro] },
    { title: 'Bài 1 — Ngữ âm & thanh điệu|||Lesson 1 — Pinyin & tones', description: 'Pinyin, 4 thanh + thanh nhẹ, biến điệu.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Chào hỏi|||Lesson 2 — Greetings', description: '你好, 谢谢, 再见; đại từ; 吗, 很.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Số đếm & tuổi|||Lesson 3 — Numbers & age', description: 'Số 0–100, 几/多少, 岁.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Giới thiệu bản thân|||Lesson 4 — Self-introduction', description: 'Tên 叫/姓, 是, quốc tịch 国+人.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Gia đình|||Lesson 5 — Family', description: 'Thành viên, 有/没有, lượng từ 个/口.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Thời gian & ngày tháng|||Lesson 6 — Time & dates', description: '年月日, 星期, 点分, 现在.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Đồ ăn & mua sắm|||Lesson 7 — Food & shopping', description: '吃/喝, 想/要/买, tiền 钱/块.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Hoạt động & địa điểm|||Lesson 8 — Daily activities & places', description: '去/做/看, 在, 哪儿, địa điểm.', lessons: [b8, b8q] },
  ],
};
