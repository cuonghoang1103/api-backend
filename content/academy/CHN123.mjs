/**
 * CHN123 — Elementary Chinese 2 (Tiếng Trung sơ cấp 2). Khối Ngôn ngữ Trung
 * FPTU. NỐI TIẾP CHN113 (Elementary Chinese 1). Đây là MÔN NGÔN NGỮ: cấu trúc
 * theo BÀI HỌC TIẾNG (từ vựng, ngữ pháp, hội thoại, luyện tập), đưa người học
 * từ cuối HSK1 lên HSK2 (~300 từ). Giáo trình chuẩn: HSK Standard Course 1-2
 * (北京语言大学) / 汉语教程.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; trong
 * HTML content "&" → "&amp;". shortDescription dùng "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chn123-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình học',
  'Giáo trình chuẩn (HSK Standard Course 1-2, 汉语教程), app (Pleco/HelloChinese/Anki), từ điển hanzii.net, YouTube, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CHN123 · Materials</span>
<h2>How to keep learning Chinese — materials &amp; roadmap</h2>
<p class="lead">Elementary Chinese 2 continues straight on from <strong>CHN113</strong>. It takes your HSK1 base and grows it toward <strong>HSK2</strong> — about <strong>300 words</strong> in total — so you can talk about hobbies, shopping, food, weather, directions, daily routines and health. Below are the standard textbooks plus free tools.</p>
<h3>📘 Standard textbooks</h3>
<ul>
<li><strong>HSK Standard Course 1 &amp; 2</strong> (北京语言大学出版社 / Beijing Language and Culture University Press) — the mainstream HSK coursebooks; this course spans the tail of Book 1 into Book 2.</li>
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
<li><strong>Review the tones</strong> — a wrong tone still changes the word; keep drilling the 4 tones and tone-change rules from CHN113.</li>
<li><strong>Vocabulary</strong> — learn new hanzi in context, review daily with Anki/Pleco.</li>
<li><strong>Grammar</strong> — HSK2 adds comparison (比), aspect and time patterns; keep sentences short and word order fixed.</li>
<li><strong>Speaking</strong> — say every dialogue out loud; shadow the audio until it feels natural.</li>
</ol></div>`,
    `<span class="eyebrow">CHN123 · Tài liệu</span>
<h2>Học tiếp tiếng Trung — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung sơ cấp 2 nối thẳng từ <strong>CHN113</strong>. Môn này lấy nền HSK1 và mở rộng lên <strong>HSK2</strong> — tổng khoảng <strong>300 từ</strong> — để bạn nói được về sở thích, mua sắm, đồ ăn, thời tiết, phương hướng, sinh hoạt hằng ngày và sức khoẻ. Bên dưới là giáo trình chuẩn cùng công cụ miễn phí.</p>
<h3>📘 Giáo trình chuẩn</h3>
<ul>
<li><strong>HSK Standard Course 1 &amp; 2</strong> (NXB Đại học Ngôn ngữ Bắc Kinh) — giáo trình HSK phổ biến nhất; môn này trải từ cuối Quyển 1 sang Quyển 2.</li>
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
<li><strong>Ôn lại thanh điệu</strong> — sai thanh vẫn là sai từ; tiếp tục luyện 4 thanh &amp; quy tắc biến điệu đã học ở CHN113.</li>
<li><strong>Từ vựng</strong> — học chữ Hán mới trong ngữ cảnh, ôn mỗi ngày bằng Anki/Pleco.</li>
<li><strong>Ngữ pháp</strong> — HSK2 thêm so sánh (比), thể &amp; các mẫu thời gian; giữ câu ngắn, trật tự cố định.</li>
<li><strong>Luyện nói</strong> — đọc to mọi hội thoại; nói nhại theo audio đến khi trôi chảy.</li>
</ol></div>`,
  ]]);

const intro = doc('chn123-0-1-overview', 'Course overview: Elementary Chinese 2|||Tổng quan: Tiếng Trung sơ cấp 2',
  'Nối tiếp CHN113; mục tiêu HSK2 (~300 từ), ngữ pháp mới (会/能, 太…了, 比, 从…到, 先…再, 别/可以) và cách học hiệu quả.',
  [[
    `<span class="eyebrow">CHN123 · Lesson 0.1 · Overview</span>
<h2>Elementary Chinese 2 (HSK2)</h2>
<p class="lead">This course picks up where <strong>CHN113 (Elementary Chinese 1)</strong> left off. Assuming you know pinyin, the 4 tones and the HSK1 core, it grows your Chinese toward the <strong>HSK Level 2</strong> standard — around <strong>300 words</strong> in total — and the sentence patterns you need for everyday conversation.</p>
<h3>What is new at HSK2</h3>
<ul>
<li><strong>Modal verbs</strong> — 会 huì (a learned skill), 能 néng (be able to), 可以 kěyǐ (be allowed to).</li>
<li><strong>Comparison</strong> — the pattern A 比 bǐ B + adjective (today is hotter than yesterday).</li>
<li><strong>Time &amp; sequence</strong> — 从…到… (from…to…), …的时候 (when…), 先…再… (first…then…).</li>
<li><strong>Degree &amp; commands</strong> — 太…了 (too…), 别 bié (do not…).</li>
</ul>
<h3>Roadmap of this course</h3>
<p>Review &amp; expand greetings → hobbies &amp; abilities → shopping &amp; prices → food &amp; restaurants → weather &amp; seasons → directions &amp; getting around → schedules &amp; frequency → health &amp; making plans. Every lesson has a vocabulary table (汉字 / pinyin / meaning), grammar points with examples, a short dialogue, notes, and a quiz.</p>`,
    `<span class="eyebrow">CHN123 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung sơ cấp 2 (HSK2)</h2>
<p class="lead">Môn này học tiếp từ chỗ <strong>CHN113 (Tiếng Trung sơ cấp 1)</strong> dừng lại. Giả định bạn đã nắm pinyin, 4 thanh và vốn lõi HSK1, môn nâng tiếng Trung của bạn lên chuẩn <strong>HSK cấp 2</strong> — tổng khoảng <strong>300 từ</strong> — cùng các mẫu câu cần cho hội thoại hằng ngày.</p>
<h3>Điểm mới ở HSK2</h3>
<ul>
<li><strong>Động từ năng nguyện</strong> — 会 huì (kỹ năng đã học), 能 néng (có thể làm), 可以 kěyǐ (được phép).</li>
<li><strong>So sánh</strong> — mẫu A 比 bǐ B + tính từ (hôm nay nóng hơn hôm qua).</li>
<li><strong>Thời gian &amp; trình tự</strong> — 从…到… (từ…đến…), …的时候 (khi…), 先…再… (trước…rồi…).</li>
<li><strong>Mức độ &amp; mệnh lệnh</strong> — 太…了 (quá…), 别 bié (đừng…).</li>
</ul>
<h3>Lộ trình của môn</h3>
<p>Ôn &amp; mở rộng chào hỏi → sở thích &amp; năng lực → mua sắm &amp; giá cả → ăn uống &amp; nhà hàng → thời tiết &amp; mùa → phương hướng &amp; đi lại → thời gian biểu &amp; tần suất → sức khoẻ &amp; hẹn gặp. Mỗi bài có bảng từ vựng (汉字 / pinyin / nghĩa), điểm ngữ pháp kèm ví dụ, một hội thoại ngắn, ghi chú, và quiz.</p>`,
  ]]);

const b1 = doc('chn123-1-1-review-greetings', 'Lesson 1 — Review &amp; expanding introductions|||Bài 1 — Ôn tập &amp; mở rộng giới thiệu',
  'Ôn 是/叫/姓; mở rộng 认识 (quen biết), 请问 (xin hỏi), 贵姓; trợ từ 呢; phó từ 也/都.',
  [[
    `<span class="eyebrow">CHN123 · Lesson 1 · Review</span>
<h2>Review &amp; expanding introductions</h2>
<h3>Vocabulary (词汇)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>认识</td><td>rènshi</td><td>to know / be acquainted with (a person)</td></tr>
<tr><td>请问</td><td>qǐngwèn</td><td>may I ask… / excuse me</td></tr>
<tr><td>贵姓</td><td>guìxìng</td><td>your (honourable) surname</td></tr>
<tr><td>老师</td><td>lǎoshī</td><td>teacher</td></tr>
<tr><td>学生</td><td>xuésheng</td><td>student</td></tr>
<tr><td>朋友</td><td>péngyou</td><td>friend</td></tr>
<tr><td>也</td><td>yě</td><td>also / too</td></tr>
<tr><td>都</td><td>dōu</td><td>all / both</td></tr>
<tr><td>呢</td><td>ne</td><td>follow-up question particle</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>请问 qǐngwèn</strong> opens a polite question: 请问，你贵姓? (May I ask your surname?) Answer: 我姓王.</li>
<li><strong>呢 ne</strong> bounces a question back: 我很好，你<strong>呢</strong>? (I'm well, and you?)</li>
<li><strong>也 yě / 都 dōu</strong> go <em>before</em> the verb: 我<strong>也</strong>是学生 (I'm a student too); 我们<strong>都</strong>是学生 (we are all students).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 请问，你贵姓？   Qǐngwèn, nǐ guìxìng?   (May I ask your surname?)
B: 我姓王，叫王明。 Wǒ xìng Wáng, jiào Wáng Míng. (Wang; my name is Wang Ming.)
A: 认识你很高兴。   Rènshi nǐ hěn gāoxìng. (Nice to meet you.)
B: 我也很高兴。     Wǒ yě hěn gāoxìng.     (Me too.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 贵姓 is polite and asks only for the surname, so you answer with 姓 (我姓王), not 叫.</div>`,
    `<span class="eyebrow">CHN123 · Bài 1 · Ôn tập</span>
<h2>Ôn tập &amp; mở rộng giới thiệu</h2>
<h3>Từ vựng (词汇)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>认识</td><td>rènshi</td><td>quen biết (một người)</td></tr>
<tr><td>请问</td><td>qǐngwèn</td><td>xin hỏi / cho hỏi</td></tr>
<tr><td>贵姓</td><td>guìxìng</td><td>quý danh, họ của ngài (lịch sự)</td></tr>
<tr><td>老师</td><td>lǎoshī</td><td>giáo viên</td></tr>
<tr><td>学生</td><td>xuésheng</td><td>học sinh</td></tr>
<tr><td>朋友</td><td>péngyou</td><td>bạn bè</td></tr>
<tr><td>也</td><td>yě</td><td>cũng</td></tr>
<tr><td>都</td><td>dōu</td><td>đều, tất cả</td></tr>
<tr><td>呢</td><td>ne</td><td>trợ từ hỏi lại</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>请问 qǐngwèn</strong> mở đầu câu hỏi lịch sự: 请问，你贵姓? (Xin hỏi, ngài họ gì?) Trả lời: 我姓王.</li>
<li><strong>呢 ne</strong> hỏi vặn lại: 我很好，你<strong>呢</strong>? (Tôi khoẻ, còn bạn?)</li>
<li><strong>也 yě / 都 dōu</strong> đứng <em>trước</em> động từ: 我<strong>也</strong>是学生 (Tôi cũng là học sinh); 我们<strong>都</strong>是学生 (Chúng tôi đều là học sinh).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 请问，你贵姓？   Qǐngwèn, nǐ guìxìng?   (Xin hỏi, bạn họ gì?)
B: 我姓王，叫王明。 Wǒ xìng Wáng, jiào Wáng Míng. (Tôi họ Vương, tên Vương Minh.)
A: 认识你很高兴。   Rènshi nǐ hěn gāoxìng. (Rất vui được quen bạn.)
B: 我也很高兴。     Wǒ yě hěn gāoxìng.     (Tôi cũng rất vui.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 贵姓 lịch sự và chỉ hỏi họ, nên trả lời bằng 姓 (我姓王), không dùng 叫.</div>`,
  ]]);

const b1q = quiz('chn123-quiz-1', 'Quiz 1 — Review &amp; introductions|||Quiz 1 — Ôn tập &amp; giới thiệu', [
  { id: 'q1', question: 'Hỏi họ một cách lịch sự "ngài họ gì?" là? / How do you politely ask someone their surname?', options: ['你叫什么？', '你贵姓？', '你几岁？', '你好吗？'], correctIndex: 1, explanation: '你贵姓? hỏi họ lịch sự; trả lời bằng 我姓… (我姓王).' },
  { id: 'q2', question: 'Phó từ 也 (yě, cũng) và 都 (dōu, đều) đứng ở đâu? / Where do 也 and 都 sit?', options: ['sau động từ', 'trước động từ', 'cuối câu', 'trước chủ ngữ'], correctIndex: 1, explanation: '也/都 là phó từ, luôn đứng trước động từ: 我也是学生; 我们都是学生.' },
  { id: 'q3', question: 'Trợ từ nào dùng để hỏi vặn "còn bạn?" / Which particle bounces a question back ("and you?")', options: ['吗 ma', '呢 ne', '了 le', '的 de'], correctIndex: 1, explanation: '呢 ne: 我很好，你呢? = Tôi khoẻ, còn bạn?' },
]);

const b2 = doc('chn123-2-1-hobbies-abilities', 'Lesson 2 — Hobbies &amp; abilities|||Bài 2 — Sở thích &amp; năng lực',
  'Từ vựng sở thích (打篮球, 踢足球, 看书, 唱歌, 运动); động từ 喜欢; năng nguyện 会 (kỹ năng) vs 能 (có thể).',
  [[
    `<span class="eyebrow">CHN123 · Lesson 2 · Hobbies</span>
<h2>Hobbies &amp; abilities</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>喜欢</td><td>xǐhuan</td><td>to like</td></tr>
<tr><td>会</td><td>huì</td><td>can (a learned skill)</td></tr>
<tr><td>能</td><td>néng</td><td>can / be able to</td></tr>
<tr><td>打篮球</td><td>dǎ lánqiú</td><td>to play basketball</td></tr>
<tr><td>踢足球</td><td>tī zúqiú</td><td>to play football</td></tr>
<tr><td>看书</td><td>kàn shū</td><td>to read (books)</td></tr>
<tr><td>唱歌</td><td>chànggē</td><td>to sing</td></tr>
<tr><td>跳舞</td><td>tiàowǔ</td><td>to dance</td></tr>
<tr><td>运动</td><td>yùndòng</td><td>sport / to exercise</td></tr>
<tr><td>音乐</td><td>yīnyuè</td><td>music</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>喜欢 xǐhuan + noun/verb</strong>: 我<strong>喜欢</strong>音乐 (I like music); 我<strong>喜欢</strong>看书 (I like reading).</li>
<li><strong>会 huì</strong> = a skill you learned: 我<strong>会</strong>唱歌 (I can sing). Negative: 不会.</li>
<li><strong>能 néng</strong> = able / possible right now: 我今天<strong>能</strong>去 (I can go today). Negative: 不能.</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你喜欢什么运动？ Nǐ xǐhuan shénme yùndòng? (What sport do you like?)
B: 我喜欢打篮球。   Wǒ xǐhuan dǎ lánqiú.      (I like playing basketball.)
A: 你会踢足球吗？   Nǐ huì tī zúqiú ma?       (Can you play football?)
B: 我不会，但是我喜欢看。 Wǒ bú huì, dànshì wǒ xǐhuan kàn. (No, but I like watching.)
</code></pre>
<div class="callout"><span class="badge">Note</span> Use 会 for skills you have trained (会说汉语), and 能 for whether something is possible now (今天不能去).</div>`,
    `<span class="eyebrow">CHN123 · Bài 2 · Sở thích</span>
<h2>Sở thích &amp; năng lực</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>喜欢</td><td>xǐhuan</td><td>thích</td></tr>
<tr><td>会</td><td>huì</td><td>biết (kỹ năng đã học)</td></tr>
<tr><td>能</td><td>néng</td><td>có thể / được</td></tr>
<tr><td>打篮球</td><td>dǎ lánqiú</td><td>chơi bóng rổ</td></tr>
<tr><td>踢足球</td><td>tī zúqiú</td><td>đá bóng</td></tr>
<tr><td>看书</td><td>kàn shū</td><td>đọc sách</td></tr>
<tr><td>唱歌</td><td>chànggē</td><td>hát</td></tr>
<tr><td>跳舞</td><td>tiàowǔ</td><td>nhảy múa</td></tr>
<tr><td>运动</td><td>yùndòng</td><td>thể thao / vận động</td></tr>
<tr><td>音乐</td><td>yīnyuè</td><td>âm nhạc</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>喜欢 xǐhuan + danh từ/động từ</strong>: 我<strong>喜欢</strong>音乐 (Tôi thích âm nhạc); 我<strong>喜欢</strong>看书 (Tôi thích đọc sách).</li>
<li><strong>会 huì</strong> = kỹ năng đã học: 我<strong>会</strong>唱歌 (Tôi biết hát). Phủ định: 不会.</li>
<li><strong>能 néng</strong> = có thể / được vào lúc này: 我今天<strong>能</strong>去 (Hôm nay tôi có thể đi). Phủ định: 不能.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你喜欢什么运动？ Nǐ xǐhuan shénme yùndòng? (Bạn thích môn thể thao nào?)
B: 我喜欢打篮球。   Wǒ xǐhuan dǎ lánqiú.      (Tôi thích chơi bóng rổ.)
A: 你会踢足球吗？   Nǐ huì tī zúqiú ma?       (Bạn biết đá bóng không?)
B: 我不会，但是我喜欢看。 Wǒ bú huì, dànshì wǒ xǐhuan kàn. (Không, nhưng tôi thích xem.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Dùng 会 cho kỹ năng đã luyện (会说汉语), và 能 cho việc có thể thực hiện lúc này (今天不能去).</div>`,
  ]]);

const b2q = quiz('chn123-quiz-2', 'Quiz 2 — Hobbies &amp; abilities|||Quiz 2 — Sở thích &amp; năng lực', [
  { id: 'q1', question: '"Tôi thích đọc sách" nói đúng là? / How do you say "I like reading"?', options: ['我会看书。', '我喜欢看书。', '我能看书。', '我要看书。'], correctIndex: 1, explanation: '喜欢 + động từ: 我喜欢看书 = Tôi thích đọc sách.' },
  { id: 'q2', question: 'Diễn đạt một kỹ năng đã học (biết hát) dùng chữ nào? / Which word expresses a learned skill (know how to sing)?', options: ['会 huì', '要 yào', '想 xiǎng', '在 zài'], correctIndex: 0, explanation: '会 huì chỉ kỹ năng đã học: 我会唱歌 = Tôi biết hát.' },
  { id: 'q3', question: '"打篮球" (dǎ lánqiú) nghĩa là gì? / What does 打篮球 mean?', options: ['đá bóng', 'chơi bóng rổ', 'hát', 'nhảy múa'], correctIndex: 1, explanation: '打篮球 = chơi bóng rổ; 踢足球 = đá bóng.' },
]);

const b3 = doc('chn123-3-1-shopping-prices', 'Lesson 3 — Shopping &amp; prices|||Bài 3 — Mua sắm &amp; giá cả',
  'Từ vựng mua sắm (衣服, 件, 颜色, 便宜/贵); hỏi giá 多少钱; cấu trúc 太…了; 想买.',
  [[
    `<span class="eyebrow">CHN123 · Lesson 3 · Shopping</span>
<h2>Shopping &amp; prices</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>商店</td><td>shāngdiàn</td><td>shop / store</td></tr>
<tr><td>衣服</td><td>yīfu</td><td>clothes</td></tr>
<tr><td>件</td><td>jiàn</td><td>measure word (clothes, items)</td></tr>
<tr><td>颜色</td><td>yánsè</td><td>colour</td></tr>
<tr><td>便宜</td><td>piányi</td><td>cheap</td></tr>
<tr><td>贵</td><td>guì</td><td>expensive</td></tr>
<tr><td>想</td><td>xiǎng</td><td>would like to</td></tr>
<tr><td>买</td><td>mǎi</td><td>to buy</td></tr>
<tr><td>大</td><td>dà</td><td>big</td></tr>
<tr><td>小</td><td>xiǎo</td><td>small</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>多少钱 duōshao qián</strong> asks the price: 这件衣服多少钱? (How much is this piece of clothing?)</li>
<li><strong>太…了 tài…le</strong> = too / excessively: 太<strong>贵</strong>了! (Too expensive!) 太<strong>大</strong>了 (too big).</li>
<li><strong>想买 xiǎng mǎi</strong>: 我<strong>想买</strong>一件衣服 (I would like to buy a piece of clothing).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 我想买一件衣服。 Wǒ xiǎng mǎi yí jiàn yīfu. (I'd like to buy some clothes.)
B: 这件很好，你喜欢吗？ Zhè jiàn hěn hǎo, nǐ xǐhuan ma? (This one is nice, do you like it?)
A: 多少钱？          Duōshao qián?              (How much?)
B: 三百块。          Sān bǎi kuài.              (300 yuan.)
A: 太贵了！          Tài guì le!                (Too expensive!)
</code></pre>
<div class="callout"><span class="badge">Note</span> 件 jiàn is the measure word for clothing: 一件衣服. Point with 这件 / 那件 (this piece / that piece).</div>`,
    `<span class="eyebrow">CHN123 · Bài 3 · Mua sắm</span>
<h2>Mua sắm &amp; giá cả</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>商店</td><td>shāngdiàn</td><td>cửa hàng</td></tr>
<tr><td>衣服</td><td>yīfu</td><td>quần áo</td></tr>
<tr><td>件</td><td>jiàn</td><td>lượng từ (quần áo, món đồ)</td></tr>
<tr><td>颜色</td><td>yánsè</td><td>màu sắc</td></tr>
<tr><td>便宜</td><td>piányi</td><td>rẻ</td></tr>
<tr><td>贵</td><td>guì</td><td>đắt</td></tr>
<tr><td>想</td><td>xiǎng</td><td>muốn</td></tr>
<tr><td>买</td><td>mǎi</td><td>mua</td></tr>
<tr><td>大</td><td>dà</td><td>to, lớn</td></tr>
<tr><td>小</td><td>xiǎo</td><td>nhỏ</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>多少钱 duōshao qián</strong> hỏi giá: 这件衣服多少钱? (Cái áo này bao nhiêu tiền?)</li>
<li><strong>太…了 tài…le</strong> = quá / quá mức: 太<strong>贵</strong>了! (Đắt quá!) 太<strong>大</strong>了 (to quá).</li>
<li><strong>想买 xiǎng mǎi</strong>: 我<strong>想买</strong>一件衣服 (Tôi muốn mua một cái áo).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 我想买一件衣服。 Wǒ xiǎng mǎi yí jiàn yīfu. (Tôi muốn mua một cái áo.)
B: 这件很好，你喜欢吗？ Zhè jiàn hěn hǎo, nǐ xǐhuan ma? (Cái này đẹp, bạn thích không?)
A: 多少钱？          Duōshao qián?              (Bao nhiêu tiền?)
B: 三百块。          Sān bǎi kuài.              (300 tệ.)
A: 太贵了！          Tài guì le!                (Đắt quá!)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 件 jiàn là lượng từ cho quần áo: 一件衣服. Chỉ vào bằng 这件 / 那件 (cái này / cái kia).</div>`,
  ]]);

const b3q = quiz('chn123-quiz-3', 'Quiz 3 — Shopping &amp; prices|||Quiz 3 — Mua sắm &amp; giá cả', [
  { id: 'q1', question: 'Lượng từ dùng cho quần áo là? / Which measure word is used for clothes?', options: ['个 gè', '件 jiàn', '口 kǒu', '杯 bēi'], correctIndex: 1, explanation: '件 jiàn dùng cho quần áo: 一件衣服 = một cái áo.' },
  { id: 'q2', question: 'Kêu "đắt quá!" đúng là? / How do you exclaim "too expensive!"', options: ['很贵。', '太贵了！', '不贵。', '贵吗？'], correctIndex: 1, explanation: 'Cấu trúc 太…了 diễn đạt mức độ quá: 太贵了! = Đắt quá!' },
  { id: 'q3', question: '"便宜" (piányi) nghĩa là gì? / What does 便宜 mean?', options: ['đắt', 'rẻ', 'to', 'đẹp'], correctIndex: 1, explanation: '便宜 piányi = rẻ; trái nghĩa là 贵 guì (đắt).' },
]);

const b4 = doc('chn123-4-1-food-restaurant', 'Lesson 4 — Food &amp; restaurants|||Bài 4 — Ăn uống &amp; nhà hàng',
  'Gọi món (点菜, 服务员, 饭馆); động từ 要/来; tính từ 好吃; lượng từ 杯/碗.',
  [[
    `<span class="eyebrow">CHN123 · Lesson 4 · Restaurant</span>
<h2>Food &amp; restaurants</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>饭馆</td><td>fànguǎn</td><td>restaurant</td></tr>
<tr><td>服务员</td><td>fúwùyuán</td><td>waiter / server</td></tr>
<tr><td>点菜</td><td>diǎn cài</td><td>to order dishes</td></tr>
<tr><td>要</td><td>yào</td><td>to want (order)</td></tr>
<tr><td>来</td><td>lái</td><td>to bring / give me (in ordering)</td></tr>
<tr><td>好吃</td><td>hǎochī</td><td>delicious</td></tr>
<tr><td>杯</td><td>bēi</td><td>cup / glass (measure word)</td></tr>
<tr><td>碗</td><td>wǎn</td><td>bowl (measure word)</td></tr>
<tr><td>面条</td><td>miàntiáo</td><td>noodles</td></tr>
<tr><td>咖啡</td><td>kāfēi</td><td>coffee</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>要 yào / 来 lái + measure + noun</strong> to order: 我<strong>要</strong>一碗面条 (I want a bowl of noodles); 来一杯咖啡 (bring a cup of coffee).</li>
<li><strong>Measure words for drinks/food</strong>: 杯 bēi for cups (一杯茶), 碗 wǎn for bowls (一碗米饭).</li>
<li><strong>好吃 hǎochī</strong> = tastes good; 这个菜很<strong>好吃</strong> (this dish is delicious).</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>服务员：你们要点什么？ Nǐmen yào diǎn shénme? (What would you like to order?)
A: 来一碗面条，一杯茶。 Lái yì wǎn miàntiáo, yì bēi chá. (A bowl of noodles and a cup of tea.)
B: 我要一杯咖啡。       Wǒ yào yì bēi kāfēi.  (I want a cup of coffee.)
A: 这个面条很好吃！     Zhège miàntiáo hěn hǎochī! (These noodles are delicious!)
</code></pre>
<div class="callout"><span class="badge">Note</span> 来 lái literally means "come", but in a restaurant it works like "bring me": 来一个… is a natural way to order.</div>`,
    `<span class="eyebrow">CHN123 · Bài 4 · Nhà hàng</span>
<h2>Ăn uống &amp; nhà hàng</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>饭馆</td><td>fànguǎn</td><td>nhà hàng, quán ăn</td></tr>
<tr><td>服务员</td><td>fúwùyuán</td><td>nhân viên phục vụ</td></tr>
<tr><td>点菜</td><td>diǎn cài</td><td>gọi món</td></tr>
<tr><td>要</td><td>yào</td><td>muốn / lấy (gọi món)</td></tr>
<tr><td>来</td><td>lái</td><td>cho / lấy (khi gọi món)</td></tr>
<tr><td>好吃</td><td>hǎochī</td><td>ngon</td></tr>
<tr><td>杯</td><td>bēi</td><td>ly, cốc (lượng từ)</td></tr>
<tr><td>碗</td><td>wǎn</td><td>bát (lượng từ)</td></tr>
<tr><td>面条</td><td>miàntiáo</td><td>mì (sợi)</td></tr>
<tr><td>咖啡</td><td>kāfēi</td><td>cà phê</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>要 yào / 来 lái + lượng từ + danh từ</strong> để gọi món: 我<strong>要</strong>一碗面条 (Tôi lấy một bát mì); 来一杯咖啡 (cho một ly cà phê).</li>
<li><strong>Lượng từ cho đồ ăn uống</strong>: 杯 bēi cho ly (一杯茶), 碗 wǎn cho bát (一碗米饭).</li>
<li><strong>好吃 hǎochī</strong> = ngon; 这个菜很<strong>好吃</strong> (món này rất ngon).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>服务员：你们要点什么？ Nǐmen yào diǎn shénme? (Các bạn muốn gọi gì?)
A: 来一碗面条，一杯茶。 Lái yì wǎn miàntiáo, yì bēi chá. (Cho một bát mì và một ly trà.)
B: 我要一杯咖啡。       Wǒ yào yì bēi kāfēi.  (Tôi lấy một ly cà phê.)
A: 这个面条很好吃！     Zhège miàntiáo hěn hǎochī! (Mì này ngon quá!)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 来 lái nghĩa gốc là "đến", nhưng ở quán ăn dùng như "cho tôi": 来一个… là cách gọi món tự nhiên.</div>`,
  ]]);

const b4q = quiz('chn123-quiz-4', 'Quiz 4 — Food &amp; restaurants|||Quiz 4 — Ăn uống &amp; nhà hàng', [
  { id: 'q1', question: 'Lượng từ cho "một ly cà phê" là? / Which measure word fits "a cup of coffee"?', options: ['碗 wǎn', '杯 bēi', '件 jiàn', '个 gè'], correctIndex: 1, explanation: '杯 bēi đếm ly/cốc: 一杯咖啡 = một ly cà phê. 碗 wǎn dùng cho bát.' },
  { id: 'q2', question: '"点菜" (diǎn cài) nghĩa là gì? / What does 点菜 mean?', options: ['nấu ăn', 'gọi món', 'rửa bát', 'trả tiền'], correctIndex: 1, explanation: '点菜 diǎn cài = gọi món ở nhà hàng.' },
  { id: 'q3', question: 'Khen món ăn "rất ngon" đúng là? / How do you say a dish is "very delicious"?', options: ['很好。', '很好吃。', '很贵。', '很大。'], correctIndex: 1, explanation: '好吃 hǎochī = ngon: 这个菜很好吃 = Món này rất ngon.' },
]);

const b5 = doc('chn123-5-1-weather-seasons', 'Lesson 5 — Weather &amp; seasons|||Bài 5 — Thời tiết &amp; mùa',
  'Từ vựng thời tiết (天气, 冷/热, 下雨/下雪, 4 mùa); so sánh cơ bản A 比 B + tính từ.',
  [[
    `<span class="eyebrow">CHN123 · Lesson 5 · Weather</span>
<h2>Weather &amp; seasons</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>天气</td><td>tiānqì</td><td>weather</td></tr>
<tr><td>冷</td><td>lěng</td><td>cold</td></tr>
<tr><td>热</td><td>rè</td><td>hot</td></tr>
<tr><td>下雨</td><td>xià yǔ</td><td>to rain</td></tr>
<tr><td>下雪</td><td>xià xuě</td><td>to snow</td></tr>
<tr><td>比</td><td>bǐ</td><td>compared to (than)</td></tr>
<tr><td>春天</td><td>chūntiān</td><td>spring</td></tr>
<tr><td>夏天</td><td>xiàtiān</td><td>summer</td></tr>
<tr><td>秋天</td><td>qiūtiān</td><td>autumn</td></tr>
<tr><td>冬天</td><td>dōngtiān</td><td>winter</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>Comparison A 比 B + adjective</strong>: 今天<strong>比</strong>昨天热 (today is hotter than yesterday); 夏天<strong>比</strong>冬天热.</li>
<li>Do <em>not</em> add 很 in a 比 sentence — say 今天比昨天热, never 今天比昨天很热.</li>
<li><strong>下雨 / 下雪</strong> are verb phrases: 今天下雨 (it is raining today); 冬天常常下雪.</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 今天天气怎么样？ Jīntiān tiānqì zěnmeyàng? (How is the weather today?)
B: 今天下雨，很冷。 Jīntiān xià yǔ, hěn lěng.  (It's raining and cold.)
A: 北京冬天比这儿冷吗？ Běijīng dōngtiān bǐ zhèr lěng ma? (Is Beijing colder in winter than here?)
B: 对，北京冬天很冷，常常下雪。 Duì, Běijīng dōngtiān hěn lěng, chángcháng xià xuě. (Yes, very cold and it often snows.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 怎么样 zěnmeyàng ("how / how about") is handy for asking opinions: 今天天气怎么样?</div>`,
    `<span class="eyebrow">CHN123 · Bài 5 · Thời tiết</span>
<h2>Thời tiết &amp; mùa</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>天气</td><td>tiānqì</td><td>thời tiết</td></tr>
<tr><td>冷</td><td>lěng</td><td>lạnh</td></tr>
<tr><td>热</td><td>rè</td><td>nóng</td></tr>
<tr><td>下雨</td><td>xià yǔ</td><td>mưa</td></tr>
<tr><td>下雪</td><td>xià xuě</td><td>tuyết rơi</td></tr>
<tr><td>比</td><td>bǐ</td><td>hơn (so với)</td></tr>
<tr><td>春天</td><td>chūntiān</td><td>mùa xuân</td></tr>
<tr><td>夏天</td><td>xiàtiān</td><td>mùa hè</td></tr>
<tr><td>秋天</td><td>qiūtiān</td><td>mùa thu</td></tr>
<tr><td>冬天</td><td>dōngtiān</td><td>mùa đông</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>So sánh A 比 B + tính từ</strong>: 今天<strong>比</strong>昨天热 (hôm nay nóng hơn hôm qua); 夏天<strong>比</strong>冬天热.</li>
<li><em>Không</em> thêm 很 trong câu 比 — nói 今天比昨天热, không nói 今天比昨天很热.</li>
<li><strong>下雨 / 下雪</strong> là cụm động từ: 今天下雨 (hôm nay trời mưa); 冬天常常下雪.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 今天天气怎么样？ Jīntiān tiānqì zěnmeyàng? (Hôm nay thời tiết thế nào?)
B: 今天下雨，很冷。 Jīntiān xià yǔ, hěn lěng.  (Hôm nay mưa, rất lạnh.)
A: 北京冬天比这儿冷吗？ Běijīng dōngtiān bǐ zhèr lěng ma? (Mùa đông Bắc Kinh lạnh hơn ở đây không?)
B: 对，北京冬天很冷，常常下雪。 Duì, Běijīng dōngtiān hěn lěng, chángcháng xià xuě. (Đúng, rất lạnh và hay có tuyết.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 怎么样 zěnmeyàng ("thế nào / ra sao") rất tiện để hỏi ý kiến: 今天天气怎么样?</div>`,
  ]]);

const b5q = quiz('chn123-quiz-5', 'Quiz 5 — Weather &amp; seasons|||Quiz 5 — Thời tiết &amp; mùa', [
  { id: 'q1', question: '"Hôm nay nóng hơn hôm qua" đúng là? / How do you say "today is hotter than yesterday"?', options: ['今天很热昨天。', '今天比昨天热。', '今天昨天热比。', '今天比昨天很热。'], correctIndex: 1, explanation: 'Mẫu A 比 B + tính từ: 今天比昨天热. Không thêm 很 trong câu 比.' },
  { id: 'q2', question: '"下雪" (xià xuě) nghĩa là gì? / What does 下雪 mean?', options: ['trời mưa', 'tuyết rơi', 'trời nóng', 'trời lạnh'], correctIndex: 1, explanation: '下雪 = tuyết rơi; 下雨 = mưa.' },
  { id: 'q3', question: '"夏天" (xiàtiān) là mùa nào? / Which season is 夏天?', options: ['mùa xuân', 'mùa hè', 'mùa thu', 'mùa đông'], correctIndex: 1, explanation: '春天 xuân, 夏天 hè, 秋天 thu, 冬天 đông.' },
]);

const b6 = doc('chn123-6-1-directions', 'Lesson 6 — Directions &amp; getting around|||Bài 6 — Phương hướng &amp; đi lại',
  'Hỏi đường 怎么走; phương tiện 坐车 (公共汽车, 出租车); phương hướng 左/右/前/后, 往; khoảng cách 离.',
  [[
    `<span class="eyebrow">CHN123 · Lesson 6 · Directions</span>
<h2>Directions &amp; getting around</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>怎么走</td><td>zěnme zǒu</td><td>how do I get there</td></tr>
<tr><td>坐</td><td>zuò</td><td>to take / ride (transport)</td></tr>
<tr><td>公共汽车</td><td>gōnggòng qìchē</td><td>bus</td></tr>
<tr><td>出租车</td><td>chūzūchē</td><td>taxi</td></tr>
<tr><td>左</td><td>zuǒ</td><td>left</td></tr>
<tr><td>右</td><td>yòu</td><td>right</td></tr>
<tr><td>前</td><td>qián</td><td>front / ahead</td></tr>
<tr><td>后</td><td>hòu</td><td>back / behind</td></tr>
<tr><td>往</td><td>wǎng</td><td>toward</td></tr>
<tr><td>离</td><td>lí</td><td>away from (distance)</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>怎么走 zěnme zǒu</strong> asks the way: 请问，火车站怎么走? (Excuse me, how do I get to the station?)</li>
<li><strong>往 wǎng + direction + verb</strong>: 往<strong>左</strong>走 (go left), 往<strong>前</strong>走 (go straight ahead).</li>
<li><strong>坐 zuò + vehicle</strong>: 坐<strong>公共汽车</strong> (take the bus), 坐<strong>出租车</strong> (take a taxi).</li>
<li><strong>A 离 B + 远/近</strong> for distance: 学校<strong>离</strong>这儿远吗? (Is the school far from here?)</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 请问，商店怎么走？ Qǐngwèn, shāngdiàn zěnme zǒu? (Excuse me, how do I get to the shop?)
B: 往前走，然后往左。 Wǎng qián zǒu, ránhòu wǎng zuǒ. (Go straight, then turn left.)
A: 离这儿远吗？       Lí zhèr yuǎn ma?             (Is it far from here?)
B: 不远，你可以坐公共汽车。 Bù yuǎn, nǐ kěyǐ zuò gōnggòng qìchē. (Not far, you can take the bus.)
</code></pre>
<div class="callout"><span class="badge">Note</span> With 离, put the two places on each side: 学校离我家很近 (the school is close to my home).</div>`,
    `<span class="eyebrow">CHN123 · Bài 6 · Đi lại</span>
<h2>Phương hướng &amp; đi lại</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>怎么走</td><td>zěnme zǒu</td><td>đi thế nào, đường nào</td></tr>
<tr><td>坐</td><td>zuò</td><td>đi (bằng phương tiện)</td></tr>
<tr><td>公共汽车</td><td>gōnggòng qìchē</td><td>xe buýt</td></tr>
<tr><td>出租车</td><td>chūzūchē</td><td>taxi</td></tr>
<tr><td>左</td><td>zuǒ</td><td>trái</td></tr>
<tr><td>右</td><td>yòu</td><td>phải</td></tr>
<tr><td>前</td><td>qián</td><td>phía trước</td></tr>
<tr><td>后</td><td>hòu</td><td>phía sau</td></tr>
<tr><td>往</td><td>wǎng</td><td>về phía, hướng</td></tr>
<tr><td>离</td><td>lí</td><td>cách (khoảng cách)</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>怎么走 zěnme zǒu</strong> hỏi đường: 请问，火车站怎么走? (Xin hỏi, đến ga tàu đi đường nào?)</li>
<li><strong>往 wǎng + hướng + động từ</strong>: 往<strong>左</strong>走 (rẽ trái), 往<strong>前</strong>走 (đi thẳng).</li>
<li><strong>坐 zuò + phương tiện</strong>: 坐<strong>公共汽车</strong> (đi xe buýt), 坐<strong>出租车</strong> (đi taxi).</li>
<li><strong>A 离 B + 远/近</strong> chỉ khoảng cách: 学校<strong>离</strong>这儿远吗? (Trường có xa đây không?)</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 请问，商店怎么走？ Qǐngwèn, shāngdiàn zěnme zǒu? (Xin hỏi, đến cửa hàng đi thế nào?)
B: 往前走，然后往左。 Wǎng qián zǒu, ránhòu wǎng zuǒ. (Đi thẳng, rồi rẽ trái.)
A: 离这儿远吗？       Lí zhèr yuǎn ma?             (Cách đây có xa không?)
B: 不远，你可以坐公共汽车。 Bù yuǎn, nǐ kěyǐ zuò gōnggòng qìchē. (Không xa, bạn có thể đi xe buýt.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Với 离, đặt hai địa điểm ở hai bên: 学校离我家很近 (trường gần nhà tôi).</div>`,
  ]]);

const b6q = quiz('chn123-quiz-6', 'Quiz 6 — Directions|||Quiz 6 — Phương hướng &amp; đi lại', [
  { id: 'q1', question: '"Rẽ trái" nói đúng là? / How do you say "turn left"?', options: ['往右走', '往左走', '往后走', '往前走'], correctIndex: 1, explanation: '往 + hướng + 走: 往左走 = rẽ trái; 往前走 = đi thẳng.' },
  { id: 'q2', question: 'Chữ nào chỉ khoảng cách "A cách B"? / Which word marks the distance "A is from B"?', options: ['离 lí', '往 wǎng', '坐 zuò', '在 zài'], correctIndex: 0, explanation: 'A 离 B + 远/近: 学校离这儿远吗? = Trường cách đây có xa không?' },
  { id: 'q3', question: '"坐公共汽车" nghĩa là gì? / What does 坐公共汽车 mean?', options: ['đi taxi', 'đi xe buýt', 'đi tàu', 'đi bộ'], correctIndex: 1, explanation: '坐 (đi bằng) + 公共汽车 (xe buýt) = đi xe buýt; 出租车 = taxi.' },
]);

const b7 = doc('chn123-7-1-schedule-frequency', 'Lesson 7 — Schedules &amp; frequency|||Bài 7 — Thời gian biểu &amp; tần suất',
  'Sinh hoạt (起床, 睡觉, 上班, 上课); 每天; tần suất 常常/有时候; mẫu 从…到…, …的时候, 先…再….',
  [[
    `<span class="eyebrow">CHN123 · Lesson 7 · Routine</span>
<h2>Schedules &amp; frequency</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>每天</td><td>měitiān</td><td>every day</td></tr>
<tr><td>起床</td><td>qǐchuáng</td><td>to get up</td></tr>
<tr><td>睡觉</td><td>shuìjiào</td><td>to sleep</td></tr>
<tr><td>上班</td><td>shàngbān</td><td>to go to work</td></tr>
<tr><td>上课</td><td>shàngkè</td><td>to attend class</td></tr>
<tr><td>常常</td><td>chángcháng</td><td>often</td></tr>
<tr><td>有时候</td><td>yǒu shíhou</td><td>sometimes</td></tr>
<tr><td>从</td><td>cóng</td><td>from</td></tr>
<tr><td>到</td><td>dào</td><td>to / until</td></tr>
<tr><td>先</td><td>xiān</td><td>first</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>从…到… cóng…dào…</strong> = from…to…: 我<strong>从</strong>八点<strong>到</strong>五点上班 (I work from 8 to 5).</li>
<li><strong>…的时候 …de shíhou</strong> = when…: 吃饭<strong>的时候</strong>不看手机 (do not look at your phone when eating).</li>
<li><strong>先…再… xiān…zài…</strong> = first…then…: <strong>先</strong>吃饭<strong>再</strong>看书 (first eat, then study).</li>
<li><strong>常常 / 有时候</strong> for frequency, placed before the verb: 我<strong>常常</strong>运动.</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你每天几点起床？ Nǐ měitiān jǐ diǎn qǐchuáng? (What time do you get up every day?)
B: 我每天七点起床。 Wǒ měitiān qī diǎn qǐchuáng. (I get up at 7 every day.)
A: 你从几点到几点上课？ Nǐ cóng jǐ diǎn dào jǐ diǎn shàngkè? (From when to when are your classes?)
B: 从八点到十一点。我常常先上课再运动。 Cóng bā diǎn dào shíyī diǎn. Wǒ chángcháng xiān shàngkè zài yùndòng. (From 8 to 11. I often have class first, then exercise.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 睡觉 and 起床 are verb-object words; keep them together — say 我要睡觉, not just 我要睡.</div>`,
    `<span class="eyebrow">CHN123 · Bài 7 · Sinh hoạt</span>
<h2>Thời gian biểu &amp; tần suất</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>每天</td><td>měitiān</td><td>mỗi ngày</td></tr>
<tr><td>起床</td><td>qǐchuáng</td><td>thức dậy</td></tr>
<tr><td>睡觉</td><td>shuìjiào</td><td>đi ngủ</td></tr>
<tr><td>上班</td><td>shàngbān</td><td>đi làm</td></tr>
<tr><td>上课</td><td>shàngkè</td><td>lên lớp, đi học</td></tr>
<tr><td>常常</td><td>chángcháng</td><td>thường xuyên</td></tr>
<tr><td>有时候</td><td>yǒu shíhou</td><td>đôi khi</td></tr>
<tr><td>从</td><td>cóng</td><td>từ</td></tr>
<tr><td>到</td><td>dào</td><td>đến</td></tr>
<tr><td>先</td><td>xiān</td><td>trước, trước tiên</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>从…到… cóng…dào…</strong> = từ…đến…: 我<strong>从</strong>八点<strong>到</strong>五点上班 (Tôi làm từ 8 giờ đến 5 giờ).</li>
<li><strong>…的时候 …de shíhou</strong> = khi…: 吃饭<strong>的时候</strong>不看手机 (khi ăn cơm thì không xem điện thoại).</li>
<li><strong>先…再… xiān…zài…</strong> = trước…rồi…: <strong>先</strong>吃饭<strong>再</strong>看书 (ăn cơm trước rồi học sau).</li>
<li><strong>常常 / 有时候</strong> chỉ tần suất, đặt trước động từ: 我<strong>常常</strong>运动.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你每天几点起床？ Nǐ měitiān jǐ diǎn qǐchuáng? (Mỗi ngày bạn dậy lúc mấy giờ?)
B: 我每天七点起床。 Wǒ měitiān qī diǎn qǐchuáng. (Tôi dậy lúc 7 giờ mỗi ngày.)
A: 你从几点到几点上课？ Nǐ cóng jǐ diǎn dào jǐ diǎn shàngkè? (Bạn học từ mấy giờ đến mấy giờ?)
B: 从八点到十一点。我常常先上课再运动。 Cóng bā diǎn dào shíyī diǎn. Wǒ chángcháng xiān shàngkè zài yùndòng. (Từ 8 đến 11. Tôi thường học trước rồi mới tập.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 睡觉 và 起床 là từ động-tân; giữ nguyên cả cụm — nói 我要睡觉, không nói cụt 我要睡.</div>`,
  ]]);

const b7q = quiz('chn123-quiz-7', 'Quiz 7 — Schedules &amp; frequency|||Quiz 7 — Thời gian biểu &amp; tần suất', [
  { id: 'q1', question: '"Từ 8 giờ đến 5 giờ" đúng là? / How do you say "from 8 to 5"?', options: ['八点五点', '从八点到五点', '到八点从五点', '八点到五点从'], correctIndex: 1, explanation: 'Mẫu 从…到…: 从八点到五点 = từ 8 giờ đến 5 giờ.' },
  { id: 'q2', question: '"先吃饭再看书" nghĩa là gì? / What does 先吃饭再看书 mean?', options: ['vừa ăn vừa học', 'ăn cơm trước rồi học sau', 'không ăn không học', 'học trước rồi ăn'], correctIndex: 1, explanation: '先…再… = trước…rồi…: ăn cơm trước, sau đó học.' },
  { id: 'q3', question: 'Cụm nào nghĩa là "khi…" (lúc làm gì đó)? / Which phrase means "when…"?', options: ['的时候 de shíhou', '每天 měitiān', '常常 chángcháng', '有时候 yǒu shíhou'], correctIndex: 0, explanation: '…的时候: 吃饭的时候 = khi ăn cơm. 有时候 = đôi khi (tần suất).' },
]);

const b8 = doc('chn123-8-1-health-plans', 'Lesson 8 — Health &amp; making plans|||Bài 8 — Sức khoẻ &amp; hẹn gặp',
  'Sức khoẻ (身体, 生病, 看病, 医生, 药, 休息, 累); hẹn gặp 约/见面; năng nguyện 可以; mệnh lệnh phủ định 别.',
  [[
    `<span class="eyebrow">CHN123 · Lesson 8 · Health</span>
<h2>Health &amp; making plans</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>身体</td><td>shēntǐ</td><td>body / health</td></tr>
<tr><td>生病</td><td>shēngbìng</td><td>to get sick</td></tr>
<tr><td>看病</td><td>kàn bìng</td><td>to see a doctor</td></tr>
<tr><td>医生</td><td>yīshēng</td><td>doctor</td></tr>
<tr><td>药</td><td>yào</td><td>medicine</td></tr>
<tr><td>休息</td><td>xiūxi</td><td>to rest</td></tr>
<tr><td>累</td><td>lèi</td><td>tired</td></tr>
<tr><td>可以</td><td>kěyǐ</td><td>can / may (allowed)</td></tr>
<tr><td>别</td><td>bié</td><td>do not (command)</td></tr>
<tr><td>约</td><td>yuē</td><td>to arrange to meet</td></tr>
</table>
<h3>Grammar</h3>
<ul>
<li><strong>可以 kěyǐ</strong> = allowed / may: 你<strong>可以</strong>休息 (you may rest). Ask permission: 我可以进来吗?</li>
<li><strong>别 bié + verb</strong> = do not…: <strong>别</strong>喝咖啡了 (don't drink coffee). 别 gives a soft command.</li>
<li><strong>生病 / 看病 / 吃药</strong> are set verb-object phrases: 我生病了，要去医院看病，然后吃药.</li>
</ul>
<h3>Mini-dialogue</h3>
<pre><code>A: 你今天怎么样？ Nǐ jīntiān zěnmeyàng? (How are you today?)
B: 我生病了，很累。 Wǒ shēngbìng le, hěn lèi. (I'm sick and very tired.)
A: 你应该去看病。别上班了，好好休息。 Nǐ yīnggāi qù kàn bìng. Bié shàngbān le, hǎohǎo xiūxi. (You should see a doctor. Don't go to work, rest well.)
B: 好，我们明天再约见面吧。 Hǎo, wǒmen míngtiān zài yuē jiànmiàn ba. (OK, let's arrange to meet tomorrow.)
</code></pre>
<div class="callout"><span class="badge">Note</span> 别 bié is short for 不要; 别去 = don't go. Add 了 for "stop doing it now": 别看手机了.</div>`,
    `<span class="eyebrow">CHN123 · Bài 8 · Sức khoẻ</span>
<h2>Sức khoẻ &amp; hẹn gặp</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>身体</td><td>shēntǐ</td><td>cơ thể / sức khoẻ</td></tr>
<tr><td>生病</td><td>shēngbìng</td><td>bị bệnh, ốm</td></tr>
<tr><td>看病</td><td>kàn bìng</td><td>đi khám bệnh</td></tr>
<tr><td>医生</td><td>yīshēng</td><td>bác sĩ</td></tr>
<tr><td>药</td><td>yào</td><td>thuốc</td></tr>
<tr><td>休息</td><td>xiūxi</td><td>nghỉ ngơi</td></tr>
<tr><td>累</td><td>lèi</td><td>mệt</td></tr>
<tr><td>可以</td><td>kěyǐ</td><td>có thể / được phép</td></tr>
<tr><td>别</td><td>bié</td><td>đừng (mệnh lệnh)</td></tr>
<tr><td>约</td><td>yuē</td><td>hẹn gặp</td></tr>
</table>
<h3>Ngữ pháp</h3>
<ul>
<li><strong>可以 kěyǐ</strong> = được phép / có thể: 你<strong>可以</strong>休息 (bạn có thể nghỉ). Xin phép: 我可以进来吗?</li>
<li><strong>别 bié + động từ</strong> = đừng…: <strong>别</strong>喝咖啡了 (đừng uống cà phê nữa). 别 là mệnh lệnh nhẹ.</li>
<li><strong>生病 / 看病 / 吃药</strong> là cụm động-tân cố định: 我生病了，要去医院看病，然后吃药.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你今天怎么样？ Nǐ jīntiān zěnmeyàng? (Hôm nay bạn thế nào?)
B: 我生病了，很累。 Wǒ shēngbìng le, hěn lèi. (Tôi bị ốm, rất mệt.)
A: 你应该去看病。别上班了，好好休息。 Nǐ yīnggāi qù kàn bìng. Bié shàngbān le, hǎohǎo xiūxi. (Bạn nên đi khám. Đừng đi làm nữa, nghỉ cho khoẻ.)
B: 好，我们明天再约见面吧。 Hǎo, wǒmen míngtiān zài yuē jiànmiàn ba. (Được, mai mình hẹn gặp nhau nhé.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 别 bié là dạng rút gọn của 不要; 别去 = đừng đi. Thêm 了 để nói "dừng ngay bây giờ": 别看手机了.</div>`,
  ]]);

const b8q = quiz('chn123-quiz-8', 'Quiz 8 — Health &amp; making plans|||Quiz 8 — Sức khoẻ &amp; hẹn gặp', [
  { id: 'q1', question: '"Đừng đi làm nữa" đúng là? / How do you say "do not go to work anymore"?', options: ['不上班。', '别上班了。', '没上班。', '要上班。'], correctIndex: 1, explanation: '别 + động từ (+ 了) là mệnh lệnh phủ định: 别上班了 = đừng đi làm nữa.' },
  { id: 'q2', question: '"看病" (kàn bìng) nghĩa là gì? / What does 看病 mean?', options: ['nghỉ ngơi', 'đi khám bệnh', 'uống thuốc', 'bị mệt'], correctIndex: 1, explanation: '看病 = đi khám bệnh; 生病 = bị ốm; 吃药 = uống thuốc.' },
  { id: 'q3', question: 'Xin phép "tôi có thể vào không?" dùng chữ nào? / Which word asks permission "may I come in?"', options: ['会 huì', '可以 kěyǐ', '别 bié', '累 lèi'], correctIndex: 1, explanation: '可以 kěyǐ chỉ sự được phép: 我可以进来吗? = Tôi có thể vào không?' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CHN123',
    slug: 'chn123-elementary-chinese-2',
    title: 'Elementary Chinese 2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHN123.webp',
    shortDescription: 'Elementary Chinese 2 (HSK2), continuing CHN113: hobbies & abilities, shopping & prices, food & restaurants, weather & seasons, directions, schedules & frequency, health & plans. Grammar, dialogues, hanzi, bilingual, with quizzes.|||Tiếng Trung sơ cấp 2 (HSK2), nối tiếp CHN113: sở thích & năng lực, mua sắm, ăn uống, thời tiết, phương hướng, thời gian biểu & tần suất, sức khoẻ & hẹn gặp. Ngữ pháp, hội thoại, chữ Hán, song ngữ, kèm quiz.',
    description: 'Môn <strong>CHN123 — Elementary Chinese 2 (Tiếng Trung sơ cấp 2)</strong> nối tiếp <strong>CHN113</strong>, đưa bạn từ cuối HSK1 lên chuẩn <strong>HSK cấp 2</strong> (~300 từ). Lộ trình: <strong>ôn &amp; mở rộng chào hỏi</strong> → <strong>sở thích &amp; năng lực</strong> → <strong>mua sắm &amp; giá cả</strong> → <strong>ăn uống &amp; nhà hàng</strong> → <strong>thời tiết &amp; mùa</strong> → <strong>phương hướng &amp; đi lại</strong> → <strong>thời gian biểu &amp; tần suất</strong> → <strong>sức khoẻ &amp; hẹn gặp</strong>. Bám giáo trình chuẩn (HSK Standard Course 1-2 / 汉语教程), song ngữ Trung–Việt, mỗi bài có bảng từ vựng (汉字|pinyin|nghĩa), điểm ngữ pháp, hội thoại ngắn, ghi chú và quiz.',
    whatYouLearn: 'Mở rộng chào hỏi &amp; giới thiệu (认识, 请问, 贵姓, 也/都, 呢); sở thích &amp; năng lực (喜欢, 会 vs 能, 打篮球/踢足球); mua sắm &amp; giá cả (多少钱, 太…了, 便宜/贵, 件); ăn uống &amp; nhà hàng (点菜, 要/来, 好吃, 杯/碗); thời tiết &amp; mùa (天气, 冷/热, 下雨/下雪, so sánh 比, 4 mùa); phương hướng &amp; đi lại (怎么走, 坐车, 左右前后, 往, 离); thời gian biểu &amp; tần suất (每天, 从…到, 的时候, 先…再, 常常); sức khoẻ &amp; hẹn gặp (身体, 看病, 药, 休息, 可以, 别, 约).',
    requirements: 'Cần vốn tiếng Trung tương đương CHN113 (Elementary Chinese 1): pinyin, 4 thanh &amp; vốn lõi HSK1. Nên cài Pleco hoặc dùng hanzii.net để tra chữ &amp; nghe phát âm; luyện viết chữ Hán theo thứ tự nét.',
  },
  sections: [
    { title: '📚 Tài liệu &amp; lộ trình|||📚 Course materials', description: 'Giáo trình HSK1-2, app, từ điển, YouTube, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CHN113, mục tiêu HSK2, ngữ pháp mới, cách học.', lessons: [intro] },
    { title: 'Bài 1 — Ôn tập &amp; mở rộng giới thiệu|||Lesson 1 — Review &amp; introductions', description: '认识, 请问, 贵姓; 也/都; 呢.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Sở thích &amp; năng lực|||Lesson 2 — Hobbies &amp; abilities', description: '喜欢, 会 vs 能, 打篮球/踢足球.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Mua sắm &amp; giá cả|||Lesson 3 — Shopping &amp; prices', description: '多少钱, 太…了, 便宜/贵, 想买.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Ăn uống &amp; nhà hàng|||Lesson 4 — Food &amp; restaurants', description: '点菜, 要/来, 好吃, 杯/碗.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Thời tiết &amp; mùa|||Lesson 5 — Weather &amp; seasons', description: '天气, 冷/热, 下雨, so sánh 比.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Phương hướng &amp; đi lại|||Lesson 6 — Directions', description: '怎么走, 坐车, 左右前后, 离.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Thời gian biểu &amp; tần suất|||Lesson 7 — Schedules &amp; frequency', description: '每天, 从…到, 的时候, 先…再.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Sức khoẻ &amp; hẹn gặp|||Lesson 8 — Health &amp; making plans', description: '身体, 看病, 约, 可以, 别.', lessons: [b8, b8q] },
  ],
};
