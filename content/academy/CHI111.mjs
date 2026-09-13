/**
 * CHI111 — Integrated Chinese 1 (Tiếng Trung tổng hợp 1). Khối Ngôn ngữ Trung
 * FPTU. Đây là MÔN NGÔN NGỮ: cấu trúc theo BÀI HỌC TIẾNG (từ vựng, ngữ pháp,
 * hội thoại, luyện tập) theo track "Integrated Chinese" bám các bài đầu của
 * giáo trình. Giáo trình chuẩn: "Integrated Chinese" Level 1 Part 1 (Liu et
 * al., Cheng &amp; Tsui) — hệ pinyin.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; trong
 * HTML content "&" → "&amp;". shortDescription dùng "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chi111-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình học',
  'Giáo trình chuẩn (Integrated Chinese L1P1, Liu et al.), workbook & character workbook, app (Pleco/Anki), từ điển hanzii.net, YouTube, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CHI111 · Materials</span>
<h2>How to learn Chinese — materials &amp; roadmap</h2>
<p class="lead">Integrated Chinese 1 follows the <strong>Integrated Chinese</strong> textbook track: the <strong>pinyin</strong> sound system, the <strong>4 tones</strong>, and the first everyday topics (greetings, family, time, hobbies, appointments, studying, school life) at roughly <strong>HSK1</strong> level. Below are the standard textbook plus free tools.</p>
<h3>📘 Standard textbook</h3>
<ul>
<li><strong>Integrated Chinese, Level 1 Part 1</strong> (Yuehua Liu, Tao-chung Yao et al. — Cheng &amp; Tsui) — the mainstream university coursebook this track is built on.</li>
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
<li><strong>Pronunciation</strong> — master pinyin initials/finals &amp; the 4 tones first; a wrong tone changes the word.</li>
<li><strong>Vocabulary</strong> — learn hanzi in context, review daily with Anki/Pleco.</li>
<li><strong>Grammar</strong> — short, fixed word-order patterns (Subject then Verb then Object).</li>
<li><strong>Speaking</strong> — say every sentence out loud; shadow the audio.</li>
</ol></div>`,
    `<span class="eyebrow">CHI111 · Tài liệu</span>
<h2>Cách học tiếng Trung — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung tổng hợp 1 đi theo giáo trình <strong>Integrated Chinese</strong>: hệ thống <strong>pinyin</strong>, <strong>4 thanh điệu</strong>, và các chủ đề hằng ngày đầu tiên (chào hỏi, gia đình, thời gian, sở thích, hẹn gặp, học tập, trường lớp) ở mức tương đương <strong>HSK1</strong>. Bên dưới là giáo trình chuẩn cùng công cụ miễn phí.</p>
<h3>📘 Giáo trình chuẩn</h3>
<ul>
<li><strong>Integrated Chinese, Level 1 Part 1</strong> (Yuehua Liu, Tao-chung Yao và cộng sự — NXB Cheng &amp; Tsui) — giáo trình đại học mà track này bám theo.</li>
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
<li><strong>Phát âm</strong> — nắm thanh mẫu/vận mẫu pinyin &amp; 4 thanh trước; sai thanh là sai từ.</li>
<li><strong>Từ vựng</strong> — học chữ Hán trong ngữ cảnh, ôn mỗi ngày bằng Anki/Pleco.</li>
<li><strong>Ngữ pháp</strong> — mẫu câu ngắn, trật tự cố định (Chủ ngữ rồi Động từ rồi Tân ngữ).</li>
<li><strong>Luyện nói</strong> — đọc to mọi câu; nói nhại theo audio.</li>
</ol></div>`,
  ]]);

const intro = doc('chi111-0-1-overview', 'Course overview: Integrated Chinese 1|||Tổng quan: Tiếng Trung tổng hợp 1',
  'Track Integrated Chinese, hệ pinyin & 4 thanh, chữ Hán, mục tiêu nhập môn (tương đương HSK1), và lộ trình 8 bài.',
  [[
    `<span class="eyebrow">CHI111 · Lesson 0.1 · Overview</span>
<h2>Integrated Chinese 1</h2>
<p class="lead">This course follows the <strong>Integrated Chinese</strong> (Liu et al.) track and takes you from <strong>zero</strong> to a solid beginner standard — the pinyin sound system and the everyday language needed to greet people, talk about family, tell dates and time, describe hobbies, make phone calls and appointments, talk about studying Chinese, and describe school life.</p>
<h3>What makes Chinese special</h3>
<ul>
<li><strong>Tones</strong> — Mandarin has <strong>4 tones</strong> plus a neutral tone; the same syllable with a different tone is a different word (mā 妈 mother vs mǎ 马 horse).</li>
<li><strong>Hanzi (汉字)</strong> — Chinese is written with characters, not an alphabet. <strong>Pinyin</strong> spells their sound with Latin letters.</li>
<li><strong>No conjugation</strong> — verbs never change form; grammar comes from fixed word order and small particles.</li>
</ul>
<h3>Roadmap of this course</h3>
<p>Pinyin &amp; tones → greetings &amp; names → family → dates &amp; time (birthdays) → hobbies → phone calls &amp; visiting → studying Chinese → school life. Every lesson has a vocabulary table (汉字 | pinyin | meaning), grammar points with examples, a short dialogue, notes, and a quiz.</p>`,
    `<span class="eyebrow">CHI111 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung tổng hợp 1</h2>
<p class="lead">Môn này đi theo track <strong>Integrated Chinese</strong> (Liu và cộng sự), đưa bạn từ <strong>con số 0</strong> tới trình độ nhập môn vững — hệ thống pinyin và ngôn ngữ hằng ngày để chào hỏi, nói về gia đình, nói ngày giờ, mô tả sở thích, gọi điện và hẹn gặp, nói về việc học tiếng Trung, và mô tả đời sống trường lớp.</p>
<h3>Đặc trưng của tiếng Trung</h3>
<ul>
<li><strong>Thanh điệu</strong> — tiếng phổ thông có <strong>4 thanh</strong> cộng thanh nhẹ; cùng một âm khác thanh là khác từ (mā 妈 mẹ vs mǎ 马 ngựa).</li>
<li><strong>Chữ Hán (汉字)</strong> — tiếng Trung viết bằng chữ tượng hình, không phải bảng chữ cái. <strong>Pinyin</strong> ghi âm bằng chữ Latinh.</li>
<li><strong>Không chia động từ</strong> — động từ không đổi dạng; ngữ pháp nằm ở trật tự từ cố định và vài trợ từ nhỏ.</li>
</ul>
<h3>Lộ trình của môn</h3>
<p>Pinyin &amp; thanh điệu → chào hỏi &amp; tên → gia đình → ngày &amp; giờ (sinh nhật) → sở thích → gọi điện &amp; thăm hỏi → học tiếng Trung → đời sống trường lớp. Mỗi bài có bảng từ vựng (汉字 | pinyin | nghĩa), điểm ngữ pháp kèm ví dụ, một hội thoại ngắn, ghi chú, và quiz.</p>`,
  ]]);

const b1 = doc('chi111-1-1-pinyin-tones', 'Lesson 1 — Pinyin &amp; the four tones|||Bài 1 — Ngữ âm &amp; thanh điệu',
  'Pinyin: thanh mẫu (initials) & vận mẫu (finals); 4 thanh + thanh nhẹ; dấu thanh ā á ǎ à; quy tắc biến điệu.',
  [[
    `<span class="eyebrow">CHI111 · Lesson 1 · Pronunciation</span>
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
    `<span class="eyebrow">CHI111 · Bài 1 · Phát âm</span>
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

const b1q = quiz('chi111-quiz-1', 'Quiz 1 — Pinyin &amp; tones|||Quiz 1 — Ngữ âm &amp; thanh điệu', [
  { id: 'q1', question: 'Tiếng phổ thông có mấy thanh điệu (không kể thanh nhẹ)? / How many tones does Mandarin have (not counting the neutral tone)?', options: ['2', '3', '4', '6'], correctIndex: 2, explanation: '4 thanh: ā (cao ngang), á (lên), ǎ (xuống-lên), à (xuống gắt).' },
  { id: 'q2', question: 'Chữ 马 (con ngựa) mang thanh nào? / Which tone does 马 (horse) carry?', options: ['mā (thanh 1)', 'má (thanh 2)', 'mǎ (thanh 3)', 'mà (thanh 4)'], correctIndex: 2, explanation: '马 = mǎ, thanh 3 (xuống rồi lên).' },
  { id: 'q3', question: 'Khi 你 (nǐ) + 好 (hǎo) đứng cạnh nhau thì đọc thế nào? / When nǐ + hǎo meet, how are they read?', options: ['nì hǎo', 'ní hǎo', 'nǐ háo', 'nī hao'], correctIndex: 1, explanation: 'Hai thanh 3 liền nhau: thanh 3 đầu biến thành thanh 2 → ní hǎo.' },
]);

const b2 = doc('chi111-2-1-greetings', 'Lesson 2 — Greetings &amp; names|||Bài 2 — Chào hỏi &amp; tên gọi',
  'Từ vựng: 你好, 请问, 您, 贵姓, 姓, 叫, 什么, 名字, 呢, 老师. Ngữ pháp: 姓 vs 叫, hỏi lịch sự 您贵姓, hỏi tiếp với 呢.',
  [[
    `<span class="eyebrow">CHI111 · Lesson 2 · Greetings</span>
<h2>Greetings &amp; names</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>你好</td><td>nǐ hǎo</td><td>hello</td></tr>
<tr><td>您</td><td>nín</td><td>you (polite)</td></tr>
<tr><td>请问</td><td>qǐng wèn</td><td>may I ask / excuse me</td></tr>
<tr><td>贵姓</td><td>guì xìng</td><td>your (honorable) surname</td></tr>
<tr><td>姓</td><td>xìng</td><td>surname; to be surnamed</td></tr>
<tr><td>叫</td><td>jiào</td><td>to be called (given name)</td></tr>
<tr><td>什么</td><td>shénme</td><td>what</td></tr>
<tr><td>名字</td><td>míngzi</td><td>name</td></tr>
<tr><td>呢</td><td>ne</td><td>and (you)? — follow-up particle</td></tr>
<tr><td>老师</td><td>lǎoshī</td><td>teacher</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>姓 vs 叫</strong>: 我<strong>姓</strong>王 (my surname is Wang) · 我<strong>叫</strong>王明 (my name is Wang Ming).</li>
<li><strong>Polite: 您贵姓?</strong> — a respectful way to ask a surname. Answer: 我姓… (I am surnamed …).</li>
<li><strong>呢 ne</strong> throws the same question back: 我很好，你<strong>呢</strong>? (I am well, and you?)</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你好！请问，您贵姓？ Nǐ hǎo! Qǐng wèn, nín guì xìng? (Hello! May I ask your surname?)
B: 我姓王，叫王明。你呢？ Wǒ xìng Wáng, jiào Wáng Míng. Nǐ ne? (Wang, Wang Ming. And you?)
A: 我叫李友。         Wǒ jiào Lǐ Yǒu.           (I am Li You.)
</code></pre>
<div class="callout"><span class="badge">Writing note</span> 好 (hǎo, good) = 女 (woman) + 子 (child) side by side — a common, easy character to start writing.</div>`,
    `<span class="eyebrow">CHI111 · Bài 2 · Chào hỏi</span>
<h2>Chào hỏi &amp; tên gọi</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>你好</td><td>nǐ hǎo</td><td>xin chào</td></tr>
<tr><td>您</td><td>nín</td><td>ngài / bạn (lịch sự)</td></tr>
<tr><td>请问</td><td>qǐng wèn</td><td>cho hỏi / xin hỏi</td></tr>
<tr><td>贵姓</td><td>guì xìng</td><td>quý danh (họ của ngài)</td></tr>
<tr><td>姓</td><td>xìng</td><td>họ; mang họ</td></tr>
<tr><td>叫</td><td>jiào</td><td>tên là (tên gọi)</td></tr>
<tr><td>什么</td><td>shénme</td><td>gì, cái gì</td></tr>
<tr><td>名字</td><td>míngzi</td><td>tên</td></tr>
<tr><td>呢</td><td>ne</td><td>còn (bạn)? — trợ từ hỏi tiếp</td></tr>
<tr><td>老师</td><td>lǎoshī</td><td>giáo viên</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>姓 và 叫</strong>: 我<strong>姓</strong>王 (tôi họ Vương) · 我<strong>叫</strong>王明 (tôi tên Vương Minh).</li>
<li><strong>Lịch sự: 您贵姓?</strong> — cách hỏi họ trân trọng. Đáp: 我姓… (tôi họ …).</li>
<li><strong>呢 ne</strong> hỏi ngược lại cùng câu hỏi: 我很好，你<strong>呢</strong>? (Tôi khoẻ, còn bạn?)</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你好！请问，您贵姓？ Nǐ hǎo! Qǐng wèn, nín guì xìng? (Chào! Cho hỏi ngài họ gì?)
B: 我姓王，叫王明。你呢？ Wǒ xìng Wáng, jiào Wáng Míng. Nǐ ne? (Tôi họ Vương, tên Vương Minh. Còn bạn?)
A: 我叫李友。         Wǒ jiào Lǐ Yǒu.           (Tôi tên Lý Hữu.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú chữ viết</span> 好 (hǎo, tốt) = 女 (nữ) + 子 (tử/con) ghép cạnh nhau — một chữ dễ, hợp để bắt đầu tập viết.</div>`,
  ]]);

const b2q = quiz('chi111-quiz-2', 'Quiz 2 — Greetings &amp; names|||Quiz 2 — Chào hỏi &amp; tên', [
  { id: 'q1', question: '"Xin chào" trong tiếng Trung là? / How do you say "hello"?', options: ['你好 nǐ hǎo', '谢谢 xièxie', '再见 zàijiàn', '请问 qǐng wèn'], correctIndex: 0, explanation: '你好 nǐ hǎo = xin chào; 谢谢 = cảm ơn; 再见 = tạm biệt.' },
  { id: 'q2', question: 'Hỏi họ một cách lịch sự dùng cụm nào? / Which phrase politely asks someone surname?', options: ['你几岁？', '您贵姓？', '你好吗？', '你叫什么？'], correctIndex: 1, explanation: '您贵姓? là cách hỏi họ trân trọng; đáp lại 我姓…' },
  { id: 'q3', question: 'Chữ 姓 (xìng) nghĩa là gì? / What does 姓 mean?', options: ['tên gọi|||given name', 'họ|||surname', 'quốc gia|||country', 'tuổi|||age'], correctIndex: 1, explanation: '姓 xìng = họ; 叫 jiào dùng cho tên gọi.' },
]);

const b3 = doc('chi111-3-1-family', 'Lesson 3 — Family|||Bài 3 — Gia đình',
  'Từ vựng: 家, 有, 几, 口, 人, 爸爸 妈妈 哥哥 姐姐 弟弟 妹妹, 都, 老师/学生. Ngữ pháp: 有/没有, 几口人, 都, nghề nghiệp với 是.',
  [[
    `<span class="eyebrow">CHI111 · Lesson 3 · Family</span>
<h2>Family (家)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>家</td><td>jiā</td><td>family / home</td></tr>
<tr><td>有</td><td>yǒu</td><td>to have</td></tr>
<tr><td>几</td><td>jǐ</td><td>how many (small number)</td></tr>
<tr><td>口</td><td>kǒu</td><td>measure word for family members</td></tr>
<tr><td>人</td><td>rén</td><td>person</td></tr>
<tr><td>爸爸 / 妈妈</td><td>bàba / māma</td><td>father / mother</td></tr>
<tr><td>哥哥 / 姐姐</td><td>gēge / jiějie</td><td>older brother / older sister</td></tr>
<tr><td>弟弟 / 妹妹</td><td>dìdi / mèimei</td><td>younger brother / younger sister</td></tr>
<tr><td>都</td><td>dōu</td><td>all / both</td></tr>
<tr><td>学生</td><td>xuéshēng</td><td>student</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>有 yǒu / 没有 méiyǒu</strong>: 我<strong>有</strong>一个哥哥 (I have one older brother). The negative of 有 is always <strong>没有</strong>, never 不有.</li>
<li><strong>几口人</strong>: 口 kǒu counts people in a household — 你家有<strong>几口人</strong>? (how many people are in your family?).</li>
<li><strong>都 dōu</strong> (all) goes before the verb: 我们<strong>都</strong>是学生 (we are all students).</li>
<li><strong>Occupation with 是</strong>: 我爸爸<strong>是</strong>老师 (my father is a teacher).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你家有几口人？   Nǐ jiā yǒu jǐ kǒu rén? (How many people are in your family?)
B: 我家有四口人。   Wǒ jiā yǒu sì kǒu rén. (Four people.)
   爸爸、妈妈、姐姐和我。 Bàba, māma, jiějie hé wǒ. (Dad, mom, older sister and me.)
A: 他们都是老师吗？ Tāmen dōu shì lǎoshī ma? (Are they all teachers?)
</code></pre>
<div class="callout"><span class="badge">Note</span> 爸爸, 妈妈, 哥哥… double the character; the second syllable is neutral tone (bà<strong>ba</strong>, mā<strong>ma</strong>).</div>`,
    `<span class="eyebrow">CHI111 · Bài 3 · Gia đình</span>
<h2>Gia đình (家)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>家</td><td>jiā</td><td>gia đình / nhà</td></tr>
<tr><td>有</td><td>yǒu</td><td>có</td></tr>
<tr><td>几</td><td>jǐ</td><td>mấy, bao nhiêu (số nhỏ)</td></tr>
<tr><td>口</td><td>kǒu</td><td>lượng từ đếm người trong nhà</td></tr>
<tr><td>人</td><td>rén</td><td>người</td></tr>
<tr><td>爸爸 / 妈妈</td><td>bàba / māma</td><td>bố / mẹ</td></tr>
<tr><td>哥哥 / 姐姐</td><td>gēge / jiějie</td><td>anh trai / chị gái</td></tr>
<tr><td>弟弟 / 妹妹</td><td>dìdi / mèimei</td><td>em trai / em gái</td></tr>
<tr><td>都</td><td>dōu</td><td>đều / tất cả</td></tr>
<tr><td>学生</td><td>xuéshēng</td><td>học sinh, sinh viên</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>有 yǒu / 没有 méiyǒu</strong>: 我<strong>有</strong>一个哥哥 (Tôi có một anh trai). Phủ định của 有 luôn là <strong>没有</strong>, không bao giờ 不有.</li>
<li><strong>几口人</strong>: 口 kǒu đếm người trong nhà — 你家有<strong>几口人</strong>? (nhà bạn có mấy người?).</li>
<li><strong>都 dōu</strong> (đều) đứng trước động từ: 我们<strong>都</strong>是学生 (chúng tôi đều là sinh viên).</li>
<li><strong>Nghề nghiệp với 是</strong>: 我爸爸<strong>是</strong>老师 (bố tôi là giáo viên).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你家有几口人？   Nǐ jiā yǒu jǐ kǒu rén? (Nhà bạn có mấy người?)
B: 我家有四口人。   Wǒ jiā yǒu sì kǒu rén. (Nhà tôi có bốn người.)
   爸爸、妈妈、姐姐和我。 Bàba, māma, jiějie hé wǒ. (Bố, mẹ, chị gái và tôi.)
A: 他们都是老师吗？ Tāmen dōu shì lǎoshī ma? (Họ đều là giáo viên à?)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 爸爸, 妈妈, 哥哥… lặp lại chữ; âm tiết thứ hai đọc thanh nhẹ (bà<strong>ba</strong>, mā<strong>ma</strong>).</div>`,
  ]]);

const b3q = quiz('chi111-quiz-3', 'Quiz 3 — Family|||Quiz 3 — Gia đình', [
  { id: 'q1', question: 'Lượng từ dùng để đếm người trong gia đình là? / Which measure word counts people in a household?', options: ['个 gè', '口 kǒu', '岁 suì', '本 běn'], correctIndex: 1, explanation: '口 kǒu chuyên đếm số người trong nhà: 四口人 = bốn người.' },
  { id: 'q2', question: '"都" (dōu) nghĩa là gì? / What does 都 mean?', options: ['và|||and', 'đều / tất cả|||all / both', 'không|||not', 'có|||to have'], correctIndex: 1, explanation: '都 dōu = đều/tất cả, đứng trước động từ: 我们都是学生.' },
  { id: 'q3', question: 'Phủ định của 有 (yǒu, có) là? / What is the negative of 有?', options: ['不有 bù yǒu', '没有 méiyǒu', '无有 wú yǒu', '别有 bié yǒu'], correctIndex: 1, explanation: '有 luôn phủ định bằng 没有, không dùng 不有.' },
]);

const b4 = doc('chi111-4-1-dates-time', 'Lesson 4 — Dates, time &amp; birthdays|||Bài 4 — Ngày giờ &amp; sinh nhật',
  'Từ vựng: 年 月 日/号 星期 天, 点 分 半, 生日, 请客, 怎么样, 岁. Ngữ pháp: ngày lớn→nhỏ, 星期+số, xem giờ, mời khách 请客.',
  [[
    `<span class="eyebrow">CHI111 · Lesson 4 · Dates &amp; time</span>
<h2>Dates, time &amp; birthdays</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>年</td><td>nián</td><td>year</td></tr>
<tr><td>月</td><td>yuè</td><td>month</td></tr>
<tr><td>日 / 号</td><td>rì / hào</td><td>day (of month)</td></tr>
<tr><td>星期</td><td>xīngqī</td><td>week</td></tr>
<tr><td>点 / 分</td><td>diǎn / fēn</td><td>hour (o clock) / minute</td></tr>
<tr><td>半</td><td>bàn</td><td>half (past)</td></tr>
<tr><td>生日</td><td>shēngrì</td><td>birthday</td></tr>
<tr><td>请客</td><td>qǐng kè</td><td>to treat / invite (to a meal)</td></tr>
<tr><td>怎么样</td><td>zěnmeyàng</td><td>how about? / how is it?</td></tr>
<tr><td>岁</td><td>suì</td><td>years old</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>Dates go big to small</strong>: year 年 → month 月 → day 号. e.g. 2024年5月8号.</li>
<li><strong>Weekdays</strong> = 星期 + number: 星期一 Mon … 星期六 Sat, 星期天 Sun.</li>
<li><strong>Telling time</strong>: 点 (hour) + 分 (minute); 半 bàn = half. 两点半 = 2:30. Ask: 现在几点?</li>
<li><strong>请客 qǐng kè</strong> = to treat someone. 今天我请客 (today it is my treat). Suggest with 怎么样? — 星期六怎么样? (how about Saturday?).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你的生日是几月几号？ Nǐ de shēngrì shì jǐ yuè jǐ hào? (What date is your birthday?)
B: 五月八号。星期六怎么样？ Wǔ yuè bā hào. Xīngqīliù zěnmeyàng? (May 8th. How about Saturday?)
A: 好，我请客！       Hǎo, wǒ qǐng kè!         (Great, my treat!)
</code></pre>
<div class="callout"><span class="badge">Note</span> 号 (hào) is spoken; 日 (rì) is the written/formal form for the day of the month.</div>`,
    `<span class="eyebrow">CHI111 · Bài 4 · Ngày giờ</span>
<h2>Ngày giờ &amp; sinh nhật</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>年</td><td>nián</td><td>năm</td></tr>
<tr><td>月</td><td>yuè</td><td>tháng</td></tr>
<tr><td>日 / 号</td><td>rì / hào</td><td>ngày (trong tháng)</td></tr>
<tr><td>星期</td><td>xīngqī</td><td>tuần</td></tr>
<tr><td>点 / 分</td><td>diǎn / fēn</td><td>giờ / phút</td></tr>
<tr><td>半</td><td>bàn</td><td>rưỡi (nửa)</td></tr>
<tr><td>生日</td><td>shēngrì</td><td>sinh nhật</td></tr>
<tr><td>请客</td><td>qǐng kè</td><td>mời khách / đãi khách</td></tr>
<tr><td>怎么样</td><td>zěnmeyàng</td><td>thế nào? / được không?</td></tr>
<tr><td>岁</td><td>suì</td><td>tuổi</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>Ngày tháng đi từ lớn tới nhỏ</strong>: năm 年 → tháng 月 → ngày 号. Ví dụ 2024年5月8号.</li>
<li><strong>Thứ trong tuần</strong> = 星期 + số: 星期一 Thứ Hai … 星期六 Thứ Bảy, 星期天 Chủ Nhật.</li>
<li><strong>Xem giờ</strong>: 点 (giờ) + 分 (phút); 半 bàn = rưỡi. 两点半 = 2 giờ rưỡi. Hỏi: 现在几点?</li>
<li><strong>请客 qǐng kè</strong> = mời/đãi khách. 今天我请客 (hôm nay tôi mời). Gợi ý bằng 怎么样? — 星期六怎么样? (Thứ Bảy được không?).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你的生日是几月几号？ Nǐ de shēngrì shì jǐ yuè jǐ hào? (Sinh nhật bạn ngày mấy tháng mấy?)
B: 五月八号。星期六怎么样？ Wǔ yuè bā hào. Xīngqīliù zěnmeyàng? (Ngày 8 tháng 5. Thứ Bảy được không?)
A: 好，我请客！       Hǎo, wǒ qǐng kè!         (Được, tôi mời!)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 号 (hào) dùng khi nói; 日 (rì) là dạng viết/trang trọng cho ngày trong tháng.</div>`,
  ]]);

const b4q = quiz('chi111-quiz-4', 'Quiz 4 — Dates &amp; time|||Quiz 4 — Ngày giờ &amp; sinh nhật', [
  { id: 'q1', question: 'Chữ nào chỉ "giờ" khi xem đồng hồ? / Which word means the hour (o clock)?', options: ['分 fēn', '点 diǎn', '号 hào', '岁 suì'], correctIndex: 1, explanation: '点 diǎn = giờ; 分 fēn = phút. 两点半 = 2 giờ rưỡi.' },
  { id: 'q2', question: '"生日" (shēngrì) nghĩa là? / What does 生日 mean?', options: ['ngày mai|||tomorrow', 'sinh nhật|||birthday', 'tuần|||week', 'buổi tối|||evening'], correctIndex: 1, explanation: '生 (sinh) + 日 (nhật/ngày) = sinh nhật.' },
  { id: 'q3', question: '"请客" (qǐng kè) nghĩa là? / What does 请客 mean?', options: ['mời/đãi khách|||to treat someone', 'đi học|||go to school', 'gọi điện|||make a call', 'xem phim|||watch a movie'], correctIndex: 0, explanation: '请客 = mời khách, đãi (ai đó) một bữa; 今天我请客 = hôm nay tôi mời.' },
]);

const b5 = doc('chi111-5-1-hobbies', 'Lesson 5 — Hobbies|||Bài 5 — Sở thích',
  'Từ vựng: 喜欢, 看电影, 唱歌, 跳舞, 听音乐, 觉得, 有意思, 因为, 所以, 常常. Ngữ pháp: 喜欢+DT/ĐT, 觉得, 因为…所以…',
  [[
    `<span class="eyebrow">CHI111 · Lesson 5 · Hobbies</span>
<h2>Hobbies (爱好)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>喜欢</td><td>xǐhuan</td><td>to like</td></tr>
<tr><td>电影</td><td>diànyǐng</td><td>movie</td></tr>
<tr><td>看电影</td><td>kàn diànyǐng</td><td>to watch a movie</td></tr>
<tr><td>唱歌</td><td>chàng gē</td><td>to sing</td></tr>
<tr><td>跳舞</td><td>tiào wǔ</td><td>to dance</td></tr>
<tr><td>听音乐</td><td>tīng yīnyuè</td><td>to listen to music</td></tr>
<tr><td>觉得</td><td>juéde</td><td>to think / feel</td></tr>
<tr><td>有意思</td><td>yǒu yìsi</td><td>interesting</td></tr>
<tr><td>因为 … 所以 …</td><td>yīnwèi … suǒyǐ …</td><td>because … so …</td></tr>
<tr><td>常常</td><td>chángcháng</td><td>often</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>喜欢 + noun / verb</strong>: 我<strong>喜欢</strong>音乐 (I like music) · 我<strong>喜欢</strong>看电影 (I like watching movies).</li>
<li><strong>觉得 juéde + opinion</strong>: 我<strong>觉得</strong>很有意思 (I think it is very interesting).</li>
<li><strong>因为 … 所以 …</strong>: cause then result — <strong>因为</strong>没有意思，<strong>所以</strong>我不去 (because it is boring, so I am not going).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你喜欢做什么？   Nǐ xǐhuan zuò shénme? (What do you like to do?)
B: 我喜欢看电影和听音乐。 Wǒ xǐhuan kàn diànyǐng hé tīng yīnyuè. (Watch movies and listen to music.)
A: 你觉得这个电影怎么样？ Nǐ juéde zhège diànyǐng zěnmeyàng? (How do you find this movie?)
B: 很有意思！       Hěn yǒu yìsi!         (Very interesting!)
</code></pre>
<div class="callout"><span class="badge">Note</span> 唱歌 and 跳舞 are verb-object pairs (sing-song, jump-dance); keep them together as one activity.</div>`,
    `<span class="eyebrow">CHI111 · Bài 5 · Sở thích</span>
<h2>Sở thích (爱好)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>喜欢</td><td>xǐhuan</td><td>thích</td></tr>
<tr><td>电影</td><td>diànyǐng</td><td>phim</td></tr>
<tr><td>看电影</td><td>kàn diànyǐng</td><td>xem phim</td></tr>
<tr><td>唱歌</td><td>chàng gē</td><td>hát</td></tr>
<tr><td>跳舞</td><td>tiào wǔ</td><td>nhảy múa</td></tr>
<tr><td>听音乐</td><td>tīng yīnyuè</td><td>nghe nhạc</td></tr>
<tr><td>觉得</td><td>juéde</td><td>cảm thấy / cho rằng</td></tr>
<tr><td>有意思</td><td>yǒu yìsi</td><td>thú vị, hay</td></tr>
<tr><td>因为 … 所以 …</td><td>yīnwèi … suǒyǐ …</td><td>bởi vì … cho nên …</td></tr>
<tr><td>常常</td><td>chángcháng</td><td>thường xuyên</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>喜欢 + danh từ / động từ</strong>: 我<strong>喜欢</strong>音乐 (Tôi thích nhạc) · 我<strong>喜欢</strong>看电影 (Tôi thích xem phim).</li>
<li><strong>觉得 juéde + ý kiến</strong>: 我<strong>觉得</strong>很有意思 (Tôi thấy rất thú vị).</li>
<li><strong>因为 … 所以 …</strong>: nguyên nhân rồi kết quả — <strong>因为</strong>没有意思，<strong>所以</strong>我不去 (vì chán nên tôi không đi).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你喜欢做什么？   Nǐ xǐhuan zuò shénme? (Bạn thích làm gì?)
B: 我喜欢看电影和听音乐。 Wǒ xǐhuan kàn diànyǐng hé tīng yīnyuè. (Tôi thích xem phim và nghe nhạc.)
A: 你觉得这个电影怎么样？ Nǐ juéde zhège diànyǐng zěnmeyàng? (Bạn thấy phim này thế nào?)
B: 很有意思！       Hěn yǒu yìsi!         (Rất thú vị!)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 唱歌 và 跳舞 là cặp động từ + tân ngữ (hát-bài, nhảy-múa); giữ nguyên cả cụm như một hoạt động.</div>`,
  ]]);

const b5q = quiz('chi111-quiz-5', 'Quiz 5 — Hobbies|||Quiz 5 — Sở thích', [
  { id: 'q1', question: '"喜欢" (xǐhuan) nghĩa là? / What does 喜欢 mean?', options: ['ghét|||to hate', 'thích|||to like', 'muốn|||to want', 'biết|||to know'], correctIndex: 1, explanation: '喜欢 xǐhuan = thích; theo sau là danh từ hoặc động từ.' },
  { id: 'q2', question: 'Cặp liên từ diễn đạt nhân–quả là? / Which pair expresses cause and effect?', options: ['因为…所以… yīnwèi…suǒyǐ', '太…了 tài…le', '一边…一边…', '又…又…'], correctIndex: 0, explanation: '因为 (bởi vì) … 所以 (cho nên) …: nêu nguyên nhân rồi kết quả.' },
  { id: 'q3', question: '"看电影" (kàn diànyǐng) nghĩa là? / What does 看电影 mean?', options: ['nghe nhạc|||listen to music', 'xem phim|||watch a movie', 'hát|||to sing', 'nhảy múa|||to dance'], correctIndex: 1, explanation: '看 (xem) + 电影 (phim) = xem phim.' },
]);

const b6 = doc('chi111-6-1-appointments', 'Lesson 6 — Phone calls &amp; visiting|||Bài 6 — Thăm hỏi &amp; sắp xếp',
  'Từ vựng: 打电话, 喂, 在, 帮忙, 别, 客气, 别客气, 请进, 忙, 时间, 见面, 可以. Ngữ pháp: 在(ở nhà?), 别+ĐT, 帮忙, 可以.',
  [[
    `<span class="eyebrow">CHI111 · Lesson 6 · Appointments</span>
<h2>Phone calls &amp; visiting</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>打电话</td><td>dǎ diànhuà</td><td>to make a phone call</td></tr>
<tr><td>喂</td><td>wéi</td><td>hello (on the phone)</td></tr>
<tr><td>在</td><td>zài</td><td>to be in / at / present</td></tr>
<tr><td>帮忙</td><td>bāng máng</td><td>to help</td></tr>
<tr><td>别</td><td>bié</td><td>do not (do)</td></tr>
<tr><td>客气</td><td>kèqi</td><td>polite</td></tr>
<tr><td>别客气</td><td>bié kèqi</td><td>you are welcome / do not be so polite</td></tr>
<tr><td>请进</td><td>qǐng jìn</td><td>please come in</td></tr>
<tr><td>时间</td><td>shíjiān</td><td>time</td></tr>
<tr><td>可以</td><td>kěyǐ</td><td>can / may</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>在 zài (present)</strong>: on the phone, ask if someone is home — 请问，王老师<strong>在</strong>吗? (Is teacher Wang there?).</li>
<li><strong>别 + verb</strong> = do not do it: <strong>别</strong>客气 (do not be so polite / you are welcome).</li>
<li><strong>帮忙 bāng máng</strong> = to help: 你可以<strong>帮</strong>我一个<strong>忙</strong>吗? (can you do me a favor?).</li>
<li><strong>可以 kěyǐ</strong> = can / may: 明天<strong>可以</strong>吗? (is tomorrow OK?).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 喂，请问王老师在吗？ Wéi, qǐng wèn Wáng lǎoshī zài ma? (Hello, is teacher Wang there?)
B: 在。请问你有时间吗？ Zài. Qǐng wèn nǐ yǒu shíjiān ma? (Yes. Do you have time?)
A: 明天可以吗？我想请你帮忙。 Míngtiān kěyǐ ma? Wǒ xiǎng qǐng nǐ bāng máng. (Is tomorrow OK? I would like your help.)
B: 可以。别客气！   Kěyǐ. Bié kèqi!      (Sure. You are welcome!)
</code></pre>
<div class="callout"><span class="badge">Note</span> On the phone you answer 喂 wéi (often said in 2nd tone); it is only used for phone calls, not face to face.</div>`,
    `<span class="eyebrow">CHI111 · Bài 6 · Thăm hỏi</span>
<h2>Thăm hỏi &amp; sắp xếp</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>打电话</td><td>dǎ diànhuà</td><td>gọi điện thoại</td></tr>
<tr><td>喂</td><td>wéi</td><td>a-lô (khi gọi điện)</td></tr>
<tr><td>在</td><td>zài</td><td>ở / có mặt</td></tr>
<tr><td>帮忙</td><td>bāng máng</td><td>giúp đỡ</td></tr>
<tr><td>别</td><td>bié</td><td>đừng (làm)</td></tr>
<tr><td>客气</td><td>kèqi</td><td>khách sáo</td></tr>
<tr><td>别客气</td><td>bié kèqi</td><td>đừng khách sáo / không có gì</td></tr>
<tr><td>请进</td><td>qǐng jìn</td><td>mời vào</td></tr>
<tr><td>时间</td><td>shíjiān</td><td>thời gian</td></tr>
<tr><td>可以</td><td>kěyǐ</td><td>có thể / được</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>在 zài (có mặt)</strong>: khi gọi điện, hỏi ai đó có nhà không — 请问，王老师<strong>在</strong>吗? (Thầy Vương có ở đó không?).</li>
<li><strong>别 + động từ</strong> = đừng làm: <strong>别</strong>客气 (đừng khách sáo / không có gì).</li>
<li><strong>帮忙 bāng máng</strong> = giúp: 你可以<strong>帮</strong>我一个<strong>忙</strong>吗? (bạn giúp tôi một việc được không?).</li>
<li><strong>可以 kěyǐ</strong> = có thể / được: 明天<strong>可以</strong>吗? (ngày mai được không?).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 喂，请问王老师在吗？ Wéi, qǐng wèn Wáng lǎoshī zài ma? (A-lô, cho hỏi thầy Vương có đó không?)
B: 在。请问你有时间吗？ Zài. Qǐng wèn nǐ yǒu shíjiān ma? (Có. Bạn có thời gian không?)
A: 明天可以吗？我想请你帮忙。 Míngtiān kěyǐ ma? Wǒ xiǎng qǐng nǐ bāng máng. (Ngày mai được không? Tôi muốn nhờ bạn giúp.)
B: 可以。别客气！   Kěyǐ. Bié kèqi!      (Được. Đừng khách sáo!)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Khi nghe điện thoại, người ta đáp 喂 wéi (thường đọc thanh 2); chỉ dùng lúc gọi điện, không dùng khi gặp trực tiếp.</div>`,
  ]]);

const b6q = quiz('chi111-quiz-6', 'Quiz 6 — Phone calls &amp; visiting|||Quiz 6 — Thăm hỏi &amp; sắp xếp', [
  { id: 'q1', question: '"打电话" (dǎ diànhuà) nghĩa là? / What does 打电话 mean?', options: ['gọi điện thoại|||make a phone call', 'giúp đỡ|||to help', 'gặp mặt|||to meet', 'vào nhà|||to enter'], correctIndex: 0, explanation: '打 (đánh/thực hiện) + 电话 (điện thoại) = gọi điện thoại.' },
  { id: 'q2', question: 'Đáp lại lời cảm ơn một cách thân mật dùng câu nào? / Which phrase means "you are welcome"?', options: ['对不起 duìbuqǐ', '别客气 bié kèqi', '再见 zàijiàn', '请进 qǐng jìn'], correctIndex: 1, explanation: '别客气 = đừng khách sáo / không có gì; 别 + động từ = đừng làm.' },
  { id: 'q3', question: '"别 + động từ" diễn đạt điều gì? / What does 别 + verb express?', options: ['đã làm xong|||already done', 'đừng làm|||do not do', 'muốn làm|||want to do', 'thích làm|||like to do'], correctIndex: 1, explanation: '别 bié + động từ = mệnh lệnh phủ định (đừng): 别去 = đừng đi.' },
]);

const b7 = doc('chi111-7-1-studying-chinese', 'Lesson 7 — Studying Chinese|||Bài 7 — Học tiếng Trung',
  'Từ vựng: 学/学习, 写, 字, 写字, 说, 汉语, 太…了, 难, 容易, 复习, 预习, 生词, 比. Ngữ pháp: 太…了, 复习/预习, so sánh với 比.',
  [[
    `<span class="eyebrow">CHI111 · Lesson 7 · Studying Chinese</span>
<h2>Studying Chinese</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>学 / 学习</td><td>xué / xuéxí</td><td>to study / to learn</td></tr>
<tr><td>写字</td><td>xiě zì</td><td>to write characters</td></tr>
<tr><td>说</td><td>shuō</td><td>to speak / say</td></tr>
<tr><td>汉语</td><td>Hànyǔ</td><td>Chinese (language)</td></tr>
<tr><td>太 … 了</td><td>tài … le</td><td>too … (excessive)</td></tr>
<tr><td>难 / 容易</td><td>nán / róngyì</td><td>difficult / easy</td></tr>
<tr><td>复习</td><td>fùxí</td><td>to review</td></tr>
<tr><td>预习</td><td>yùxí</td><td>to preview</td></tr>
<tr><td>生词</td><td>shēngcí</td><td>new word</td></tr>
<tr><td>比</td><td>bǐ</td><td>compared with</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>太 … 了 tài … le</strong> = too / very (often a complaint or strong feeling): 汉字<strong>太</strong>难<strong>了</strong> (characters are too hard).</li>
<li><strong>复习 vs 预习</strong>: 复习 = review what you learned; 预习 = preview before class.</li>
<li><strong>Comparison with 比</strong>: A <strong>比</strong> B + adjective. 说<strong>比</strong>写容易 (speaking is easier than writing).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你觉得汉语难吗？ Nǐ juéde Hànyǔ nán ma? (Do you find Chinese hard?)
B: 写字太难了！但是说比写容易。 Xiě zì tài nán le! Dànshì shuō bǐ xiě róngyì. (Writing is too hard! But speaking is easier than writing.)
A: 你每天复习生词吗？ Nǐ měitiān fùxí shēngcí ma? (Do you review new words daily?)
B: 复习，也预习。   Fùxí, yě yùxí.       (Yes, and I preview too.)
</code></pre>
<div class="callout"><span class="badge">Note</span> In A 比 B comparisons, do not add 很 — say 说比写容易, not 说比写很容易.</div>`,
    `<span class="eyebrow">CHI111 · Bài 7 · Học tiếng Trung</span>
<h2>Học tiếng Trung</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>学 / 学习</td><td>xué / xuéxí</td><td>học</td></tr>
<tr><td>写字</td><td>xiě zì</td><td>viết chữ (Hán)</td></tr>
<tr><td>说</td><td>shuō</td><td>nói</td></tr>
<tr><td>汉语</td><td>Hànyǔ</td><td>tiếng Trung (Hán ngữ)</td></tr>
<tr><td>太 … 了</td><td>tài … le</td><td>quá … (mức cao)</td></tr>
<tr><td>难 / 容易</td><td>nán / róngyì</td><td>khó / dễ</td></tr>
<tr><td>复习</td><td>fùxí</td><td>ôn lại</td></tr>
<tr><td>预习</td><td>yùxí</td><td>xem trước (chuẩn bị bài)</td></tr>
<tr><td>生词</td><td>shēngcí</td><td>từ mới</td></tr>
<tr><td>比</td><td>bǐ</td><td>so với</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>太 … 了 tài … le</strong> = quá / rất (thường mang cảm xúc mạnh hoặc than): 汉字<strong>太</strong>难<strong>了</strong> (chữ Hán quá khó).</li>
<li><strong>复习 và 预习</strong>: 复习 = ôn lại điều đã học; 预习 = xem trước bài trước khi lên lớp.</li>
<li><strong>So sánh với 比</strong>: A <strong>比</strong> B + tính từ. 说<strong>比</strong>写容易 (nói dễ hơn viết).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你觉得汉语难吗？ Nǐ juéde Hànyǔ nán ma? (Bạn thấy tiếng Trung khó không?)
B: 写字太难了！但是说比写容易。 Xiě zì tài nán le! Dànshì shuō bǐ xiě róngyì. (Viết chữ quá khó! Nhưng nói dễ hơn viết.)
A: 你每天复习生词吗？ Nǐ měitiān fùxí shēngcí ma? (Bạn ôn từ mới mỗi ngày không?)
B: 复习，也预习。   Fùxí, yě yùxí.       (Có, và cũng xem trước bài.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Trong so sánh A 比 B, không thêm 很 — nói 说比写容易, không nói 说比写很容易.</div>`,
  ]]);

const b7q = quiz('chi111-quiz-7', 'Quiz 7 — Studying Chinese|||Quiz 7 — Học tiếng Trung', [
  { id: 'q1', question: 'Mẫu "太…了" diễn đạt điều gì? / What does 太…了 express?', options: ['quá / rất (mức cao)|||too / very', 'một chút|||a little', 'không|||not', 'đang làm|||-ing'], correctIndex: 0, explanation: '太 … 了 nhấn mạnh mức độ cao, thường kèm cảm xúc: 太难了 = quá khó.' },
  { id: 'q2', question: '"复习" và "预习" khác nhau thế nào? / How do 复习 and 预习 differ?', options: ['ôn lại vs xem trước|||review vs preview', 'viết vs đọc|||write vs read', 'nói vs nghe|||speak vs listen', 'học vs chơi|||study vs play'], correctIndex: 0, explanation: '复习 fùxí = ôn lại bài đã học; 预习 yùxí = xem trước bài mới.' },
  { id: 'q3', question: '"写字" (xiě zì) nghĩa là? / What does 写字 mean?', options: ['đọc sách|||read a book', 'viết chữ|||write characters', 'nói chuyện|||to chat', 'nghe nhạc|||listen to music'], correctIndex: 1, explanation: '写 (viết) + 字 (chữ) = viết chữ Hán.' },
]);

const b8 = doc('chi111-8-1-school-life', 'Lesson 8 — School life|||Bài 8 — Trường lớp',
  'Từ vựng: 上课/下课, 教室, 图书馆, 宿舍, 以前, 以后, 的时候, 早上/晚上, 起床, 学习. Ngữ pháp: …的时候, 以前/以后, thời gian trước động từ.',
  [[
    `<span class="eyebrow">CHI111 · Lesson 8 · School life</span>
<h2>School life</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>上课 / 下课</td><td>shàng kè / xià kè</td><td>to start class / to finish class</td></tr>
<tr><td>教室</td><td>jiàoshì</td><td>classroom</td></tr>
<tr><td>图书馆</td><td>túshūguǎn</td><td>library</td></tr>
<tr><td>宿舍</td><td>sùshè</td><td>dormitory</td></tr>
<tr><td>以前</td><td>yǐqián</td><td>before / previously</td></tr>
<tr><td>以后</td><td>yǐhòu</td><td>after / later</td></tr>
<tr><td>的时候</td><td>de shíhou</td><td>when / at the time of</td></tr>
<tr><td>早上 / 晚上</td><td>zǎoshang / wǎnshang</td><td>morning / evening</td></tr>
<tr><td>起床</td><td>qǐ chuáng</td><td>to get up</td></tr>
<tr><td>学习</td><td>xuéxí</td><td>to study</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>上课 / 下课</strong>: 我们八点<strong>上课</strong> (we start class at 8); 十点<strong>下课</strong> (finish at 10).</li>
<li><strong>… 的时候 de shíhou</strong> = when …: 上课<strong>的时候</strong>不说话 (do not talk when in class).</li>
<li><strong>以前 / 以后</strong>: 上课<strong>以前</strong>预习 (preview before class); 下课<strong>以后</strong>去图书馆 (go to the library after class).</li>
<li><strong>Time before the verb</strong>: 我早上七点起床 (I get up at 7 in the morning) — the time-when phrase comes before the verb.</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你早上几点起床？ Nǐ zǎoshang jǐ diǎn qǐ chuáng? (What time do you get up?)
B: 七点。八点上课。 Qī diǎn. Bā diǎn shàng kè.   (Seven. Class starts at eight.)
A: 下课以后你做什么？ Xià kè yǐhòu nǐ zuò shénme? (What do you do after class?)
B: 我去图书馆学习。 Wǒ qù túshūguǎn xuéxí.     (I go to the library to study.)
</code></pre>
<div class="callout"><span class="badge">Word order</span> A time-when phrase (早上七点, 下课以后) sits before the verb, not after it.</div>`,
    `<span class="eyebrow">CHI111 · Bài 8 · Trường lớp</span>
<h2>Đời sống trường lớp</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>上课 / 下课</td><td>shàng kè / xià kè</td><td>vào học / tan học</td></tr>
<tr><td>教室</td><td>jiàoshì</td><td>lớp học (phòng học)</td></tr>
<tr><td>图书馆</td><td>túshūguǎn</td><td>thư viện</td></tr>
<tr><td>宿舍</td><td>sùshè</td><td>ký túc xá</td></tr>
<tr><td>以前</td><td>yǐqián</td><td>trước (kia)</td></tr>
<tr><td>以后</td><td>yǐhòu</td><td>sau (này)</td></tr>
<tr><td>的时候</td><td>de shíhou</td><td>khi / lúc</td></tr>
<tr><td>早上 / 晚上</td><td>zǎoshang / wǎnshang</td><td>buổi sáng / buổi tối</td></tr>
<tr><td>起床</td><td>qǐ chuáng</td><td>ngủ dậy</td></tr>
<tr><td>学习</td><td>xuéxí</td><td>học tập</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>上课 / 下课</strong>: 我们八点<strong>上课</strong> (chúng tôi 8 giờ vào học); 十点<strong>下课</strong> (10 giờ tan học).</li>
<li><strong>… 的时候 de shíhou</strong> = khi …: 上课<strong>的时候</strong>不说话 (khi học không nói chuyện).</li>
<li><strong>以前 / 以后</strong>: 上课<strong>以前</strong>预习 (xem bài trước khi vào học); 下课<strong>以后</strong>去图书馆 (sau khi tan học đi thư viện).</li>
<li><strong>Thời gian đứng trước động từ</strong>: 我早上七点起床 (tôi dậy lúc 7 giờ sáng) — cụm thời gian đặt trước động từ.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你早上几点起床？ Nǐ zǎoshang jǐ diǎn qǐ chuáng? (Buổi sáng bạn dậy lúc mấy giờ?)
B: 七点。八点上课。 Qī diǎn. Bā diǎn shàng kè.   (7 giờ. 8 giờ vào học.)
A: 下课以后你做什么？ Xià kè yǐhòu nǐ zuò shénme? (Sau khi tan học bạn làm gì?)
B: 我去图书馆学习。 Wǒ qù túshūguǎn xuéxí.     (Tôi đi thư viện học.)
</code></pre>
<div class="callout"><span class="badge">Trật tự từ</span> Cụm thời gian (早上七点, 下课以后) đứng trước động từ, không đứng sau.</div>`,
  ]]);

const b8q = quiz('chi111-quiz-8', 'Quiz 8 — School life|||Quiz 8 — Trường lớp', [
  { id: 'q1', question: '"图书馆" (túshūguǎn) là nơi nào? / What place is 图书馆?', options: ['lớp học|||classroom', 'thư viện|||library', 'ký túc xá|||dormitory', 'bệnh viện|||hospital'], correctIndex: 1, explanation: '图书馆 = thư viện; 教室 = lớp học; 宿舍 = ký túc xá.' },
  { id: 'q2', question: 'Cụm "…的时候" (de shíhou) nghĩa là? / What does …的时候 mean?', options: ['sau khi|||after', 'khi / lúc|||when / at the time of', 'trước khi|||before', 'bởi vì|||because'], correctIndex: 1, explanation: '…的时候 = khi/lúc (làm gì): 上课的时候 = khi đang học.' },
  { id: 'q3', question: '"上课" (shàng kè) nghĩa là? / What does 上课 mean?', options: ['tan học|||finish class', 'vào học / lên lớp|||attend class', 'nghỉ học|||skip class', 'ôn bài|||review'], correctIndex: 1, explanation: '上课 = vào học/lên lớp; 下课 = tan học.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'CHI111',
    slug: 'chi111-integrated-chinese-1',
    title: 'Integrated Chinese 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHI111.webp',
    shortDescription: 'Integrated Chinese 1 (Liu track) — pinyin & the 4 tones, then greetings, family, dates & time, hobbies, phone calls & visits, studying Chinese and school life. Bilingual, with vocabulary, grammar, dialogues & quizzes.|||Tiếng Trung tổng hợp 1 (track Liu) — pinyin & 4 thanh, chào hỏi, gia đình, ngày giờ, sở thích, gọi điện & thăm hỏi, học tiếng Trung và đời sống trường lớp. Song ngữ, kèm từ vựng, ngữ pháp, hội thoại & quiz.',
    description: 'Môn <strong>CHI111 — Integrated Chinese 1 (Tiếng Trung tổng hợp 1)</strong> theo track <strong>Integrated Chinese</strong> (Liu et al., Cheng &amp; Tsui), đưa bạn từ con số 0 tới trình độ nhập môn vững (tương đương HSK1). Bắt đầu từ <strong>pinyin &amp; 4 thanh điệu</strong> → <strong>chào hỏi &amp; tên</strong> → <strong>gia đình</strong> → <strong>ngày giờ &amp; sinh nhật</strong> → <strong>sở thích</strong> → <strong>gọi điện &amp; thăm hỏi</strong> → <strong>học tiếng Trung</strong> → <strong>đời sống trường lớp</strong>. Song ngữ Trung–Việt, mỗi bài có bảng từ vựng (汉字 | pinyin | nghĩa), điểm ngữ pháp kèm ví dụ, hội thoại ngắn, ghi chú và quiz.',
    whatYouLearn: 'Hệ thống pinyin (thanh mẫu/vận mẫu) &amp; 4 thanh + thanh nhẹ, quy tắc biến điệu; chào hỏi &amp; tên (姓/叫, 您贵姓, 呢); gia đình (家, 有/没有, 几口人, 都, nghề nghiệp với 是); ngày giờ &amp; sinh nhật (年月日, 星期, 点分半, 生日, 请客, 怎么样); sở thích (喜欢, 看电影, 唱歌跳舞, 觉得, 因为…所以…); gọi điện &amp; thăm hỏi (打电话, 在, 帮忙, 别客气, 可以); học tiếng Trung (写字, 说, 太…了, 复习/预习, so sánh 比); đời sống trường lớp (上课/下课, 教室, 图书馆, 以前/以后, 的时候). Đọc &amp; viết được các chữ Hán cơ bản.',
    requirements: 'Không cần kiến thức tiếng Trung trước đó. Nên cài Pleco hoặc dùng từ điển hanzii.net để tra chữ &amp; nghe phát âm; luyện viết chữ Hán theo thứ tự nét.',
  },
  sections: [
    { title: '📚 Tài liệu &amp; lộ trình|||📚 Course materials', description: 'Giáo trình Integrated Chinese, workbook, app, từ điển, YouTube, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Track Integrated Chinese, pinyin, thanh điệu, cách học.', lessons: [intro] },
    { title: 'Bài 1 — Ngữ âm &amp; thanh điệu|||Lesson 1 — Pinyin &amp; tones', description: 'Pinyin, 4 thanh + thanh nhẹ, biến điệu.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Chào hỏi &amp; tên|||Lesson 2 — Greetings &amp; names', description: '你好, 请问, 贵姓, 叫什么名字; 姓 vs 叫, 呢.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Gia đình|||Lesson 3 — Family', description: '家, 有, 几口人, 都, 老师/学生.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Ngày giờ &amp; sinh nhật|||Lesson 4 — Dates &amp; time', description: '年月日星期, 点, 生日, 请客.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Sở thích|||Lesson 5 — Hobbies', description: '喜欢, 看电影, 唱歌跳舞, 觉得, 因为…所以…', lessons: [b5, b5q] },
    { title: 'Bài 6 — Thăm hỏi &amp; sắp xếp|||Lesson 6 — Appointments', description: '打电话, 在, 帮忙, 别客气.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Học tiếng Trung|||Lesson 7 — Studying Chinese', description: '学, 写字, 说, 太…了, 复习/预习, 比.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Trường lớp|||Lesson 8 — School life', description: '上课, 教室, 图书馆, 以前/以后, 的时候.', lessons: [b8, b8q] },
  ],
};
