/**
 * JPD133 — Elementary Japanese 1 (A1/A2). Giáo trình FLM (syl, môn ngoại ngữ,
 * chủ yếu tiếng Việt): bảng chữ kana, mẫu câu cơ bản, tự giới thiệu/gia đình, số
 * đếm & thời gian, văn hoá Nhật. Song ngữ EN/VI, chữ Nhật (kana + romaji) trong
 * cả hai. Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('jpd133-0-1-overview', 'Course overview: Elementary Japanese|||Tổng quan: Tiếng Nhật sơ cấp',
  'Ba hệ chữ (hiragana/katakana/kanji), mục tiêu A1/A2, lộ trình: kana → mẫu câu です → tự giới thiệu & gia đình → số đếm/thời gian & văn hoá.',
  [[
    `<span class="eyebrow">JPD133 · Lesson 0.1 · Overview</span>
<h2>Elementary Japanese 1 (A1/A2)</h2>
<p class="lead">This course continues your basic Japanese: core sentence patterns and everyday expressions, plus a deeper feel for Japan — its people, customs and habits. By the end you can introduce yourself and your family simply, and handle basic daily situations (A1/A2).</p>
<h3>Three writing systems</h3>
<ul>
<li><strong>Hiragana</strong> (ひらがな) — the basic phonetic script for Japanese words and grammar.</li>
<li><strong>Katakana</strong> (カタカナ) — same sounds, used for foreign/loan words (コーヒー = coffee).</li>
<li><strong>Kanji</strong> (漢字) — characters borrowed from Chinese, each carrying meaning (日 = sun/day).</li>
</ul>
<h3>Roadmap</h3>
<p>Kana &amp; pronunciation → the "A wa B desu" sentence pattern &amp; particles → self &amp; family introduction → numbers, time &amp; Japanese culture. Bilingual, with Japanese (kana + romaji) and practice.</p>`,
    `<span class="eyebrow">JPD133 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Nhật sơ cấp 1 (A1/A2)</h2>
<p class="lead">Môn này tiếp tục tiếng Nhật cơ bản của bạn: các mẫu câu cốt lõi và cách nói hằng ngày, cùng hiểu sâu hơn về Nhật Bản — con người, phong tục, thói quen. Kết thúc, bạn có thể giới thiệu bản thân và gia đình ở mức đơn giản, và xử lý tình huống hằng ngày cơ bản (A1/A2).</p>
<h3>Ba hệ chữ viết</h3>
<ul>
<li><strong>Hiragana</strong> (ひらがな) — bảng chữ phiên âm cơ bản cho từ và ngữ pháp tiếng Nhật.</li>
<li><strong>Katakana</strong> (カタカナ) — cùng âm, dùng cho từ mượn/nước ngoài (コーヒー = cà phê).</li>
<li><strong>Kanji</strong> (漢字) — chữ mượn từ tiếng Hán, mỗi chữ mang nghĩa (日 = mặt trời/ngày).</li>
</ul>
<h3>Lộ trình</h3>
<p>Kana &amp; phát âm → mẫu câu "A wa B desu" &amp; trợ từ → tự giới thiệu &amp; gia đình → số đếm, thời gian &amp; văn hoá Nhật. Song ngữ, có chữ Nhật (kana + romaji) và luyện tập.</p>`,
  ]]);

const c1 = doc('jpd133-1-1-kana', '1.1 — Kana & pronunciation|||1.1 — Bảng chữ kana & phát âm',
  'Cấu trúc hiragana/katakana (5 nguyên âm × hàng phụ âm), âm biến (dakuten), trường âm; đọc-viết một số chữ cơ bản.',
  [[
    `<span class="eyebrow">JPD133 · Chapter 1 · Lesson 1.1</span>
<h2>Kana &amp; pronunciation</h2>
<h3>The sound system</h3>
<p>Japanese is built from simple syllables: five vowels — <strong>あ a, い i, う u, え e, お o</strong> — combined with consonants to form rows: か ka き ki く ku け ke こ ko, さ sa し shi す su … Each hiragana is one sound. Katakana has the same sounds in a sharper shape (ア a, カ ka).</p>
<h3>Sound changes</h3>
<ul>
<li><strong>Dakuten</strong> (゛) voices a sound: か ka → が ga, さ sa → ざ za, は ha → ば ba.</li>
<li><strong>Handakuten</strong> (゜): は ha → ぱ pa.</li>
<li><strong>Long vowels</strong> matter: おばさん obasan (aunt) vs おばあさん obaasan (grandmother) — length changes meaning.</li>
</ul>
<pre><code>Read these:
  すし   = sushi
  ねこ   = neko (cat)
  がくせい = gakusei (student)
  コーヒー = koohii (coffee, katakana + long vowel)
</code></pre>
<div class="callout"><span class="badge">Learn kana first</span> Master hiragana and katakana before anything else — they unlock reading real Japanese and free you from romaji, which no real text uses.</div>`,
    `<span class="eyebrow">JPD133 · Chương 1 · Bài 1.1</span>
<h2>Bảng chữ kana &amp; phát âm</h2>
<h3>Hệ âm thanh</h3>
<p>Tiếng Nhật dựng từ các âm tiết đơn giản: năm nguyên âm — <strong>あ a, い i, う u, え e, お o</strong> — ghép với phụ âm thành các hàng: か ka き ki く ku け ke こ ko, さ sa し shi す su … Mỗi hiragana là một âm. Katakana cùng âm nhưng nét sắc hơn (ア a, カ ka).</p>
<h3>Âm biến đổi</h3>
<ul>
<li><strong>Dakuten</strong> (゛) làm âm "hữu thanh": か ka → が ga, さ sa → ざ za, は ha → ば ba.</li>
<li><strong>Handakuten</strong> (゜): は ha → ぱ pa.</li>
<li><strong>Trường âm (âm dài)</strong> quan trọng: おばさん obasan (cô/dì) vs おばあさん obaasan (bà) — độ dài đổi nghĩa.</li>
</ul>
<pre><code>Đọc thử:
  すし   = sushi
  ねこ   = neko (con mèo)
  がくせい = gakusei (học sinh/sinh viên)
  コーヒー = koohii (cà phê, katakana + trường âm)
</code></pre>
<div class="callout"><span class="badge">Học kana trước</span> Thành thạo hiragana và katakana trước mọi thứ — chúng mở khoá đọc tiếng Nhật thật và giải phóng bạn khỏi romaji, thứ không văn bản thật nào dùng.</div>`,
  ]]);

const c1q = quiz('jpd133-quiz-1', 'Quiz 1 — Kana|||Quiz 1 — Kana', [
  { id: 'q1', question: 'Katakana (カタカナ) chủ yếu dùng để viết?', options: ['Ngữ pháp tiếng Nhật', 'Từ mượn/nước ngoài (vd コーヒー)', 'Chữ Hán', 'Số đếm'], correctIndex: 1, explanation: 'Katakana cho từ ngoại lai; hiragana cho từ/ngữ pháp Nhật.' },
  { id: 'q2', question: 'Dấu dakuten (゛) biến か (ka) thành?', options: ['さ sa', 'が ga', 'ぱ pa', 'は ha'], correctIndex: 1, explanation: 'Dakuten làm âm hữu thanh: ka → ga.' },
  { id: 'q3', question: 'おばさん (obasan) và おばあさん (obaasan) khác nhau vì?', options: ['Khác chữ Hán', 'Trường âm (độ dài nguyên âm) đổi nghĩa: cô/dì vs bà', 'Cùng nghĩa', 'Katakana'], correctIndex: 1, explanation: 'Âm dài đổi nghĩa hoàn toàn.' },
]);

const c2 = doc('jpd133-2-1-desu-particles', '2.1 — Sentence pattern & particles|||2.1 — Mẫu câu & trợ từ',
  'Mẫu câu "A は B です" (A là B), trợ từ は (wa), の (sở hữu), か (câu hỏi); phủ định ではありません.',
  [[
    `<span class="eyebrow">JPD133 · Chapter 2 · Lesson 2.1</span>
<h2>The "A wa B desu" pattern &amp; particles</h2>
<h3>The core sentence</h3>
<pre><code>わたし は がくせい です。
watashi wa gakusei desu.
= I am a student.

  わたし  = I
  は (wa) = topic particle ("as for...")
  がくせい = student
  です    = polite "to be" (am/is/are)
</code></pre>
<p>The pattern <strong>[Topic] は [X] です</strong> means "[Topic] is [X]." Note は is written HA but read <strong>WA</strong> when it's the topic particle.</p>
<h3>More particles</h3>
<ul>
<li><strong>の (no)</strong> — possession/linking: わたし の ほん (watashi no hon) = my book; にほんご の せんせい = Japanese-language teacher.</li>
<li><strong>か (ka)</strong> — turns a statement into a question: がくせい です<strong>か</strong>。= Are you a student?</li>
</ul>
<h3>Negation</h3>
<pre><code>わたし は せんせい では ありません。
watashi wa sensei dewa arimasen.
= I am not a teacher.
</code></pre>
<div class="callout"><span class="badge">Word order</span> Japanese is <strong>Subject–Object–Verb</strong>, and the verb/です comes last. Particles (は, の, か) mark each word's job, so meaning stays clear.</div>`,
    `<span class="eyebrow">JPD133 · Chương 2 · Bài 2.1</span>
<h2>Mẫu câu "A wa B desu" &amp; trợ từ</h2>
<h3>Câu cốt lõi</h3>
<pre><code>わたし は がくせい です。
watashi wa gakusei desu.
= Tôi là sinh viên.

  わたし  = tôi
  は (wa) = trợ từ chủ đề ("còn về...")
  がくせい = sinh viên
  です    = "là" thể lịch sự
</code></pre>
<p>Mẫu <strong>[Chủ đề] は [X] です</strong> nghĩa là "[Chủ đề] là [X]." Lưu ý は viết là HA nhưng đọc <strong>WA</strong> khi làm trợ từ chủ đề.</p>
<h3>Thêm trợ từ</h3>
<ul>
<li><strong>の (no)</strong> — sở hữu/nối: わたし の ほん (watashi no hon) = sách của tôi; にほんご の せんせい = giáo viên tiếng Nhật.</li>
<li><strong>か (ka)</strong> — biến câu kể thành câu hỏi: がくせい です<strong>か</strong>。= Bạn là sinh viên phải không?</li>
</ul>
<h3>Phủ định</h3>
<pre><code>わたし は せんせい では ありません。
watashi wa sensei dewa arimasen.
= Tôi không phải là giáo viên.
</code></pre>
<div class="callout"><span class="badge">Trật tự từ</span> Tiếng Nhật là <strong>Chủ–Tân–Động</strong>, và động từ/です đứng cuối. Trợ từ (は, の, か) đánh dấu vai trò từng từ nên nghĩa vẫn rõ.</div>`,
  ]]);

const c2q = quiz('jpd133-quiz-2', 'Quiz 2 — Sentence & particles|||Quiz 2 — Mẫu câu & trợ từ', [
  { id: 'q1', question: 'Trợ từ chủ đề は khi làm trợ từ được ĐỌC là?', options: ['ha', 'wa', 'ba', 'pa'], correctIndex: 1, explanation: 'は viết "ha" nhưng đọc "wa" khi là trợ từ chủ đề.' },
  { id: 'q2', question: '"わたし の ほん" (watashi no hon) nghĩa là?', options: ['Tôi là sách', 'Sách của tôi (の = sở hữu)', 'Sách và tôi', 'Bạn có sách không'], correctIndex: 1, explanation: 'の nối/sở hữu: A の B = B của A.' },
  { id: 'q3', question: 'Thêm gì vào cuối câu để thành câu hỏi lịch sự?', options: ['の', 'か (ka)', 'です', 'は'], correctIndex: 1, explanation: 'か cuối câu biến câu kể thành câu hỏi.' },
]);

const c3 = doc('jpd133-3-1-self-family-culture', '3.1 — Self, family, numbers & culture|||3.1 — Bản thân, gia đình, số đếm & văn hoá',
  'Tự giới thiệu (はじめまして), từ vựng gia đình (uchi/soto), số đếm & giờ; và vài nét văn hoá/lễ nghi Nhật.',
  [[
    `<span class="eyebrow">JPD133 · Chapter 3 · Lesson 3.1</span>
<h2>Self, family, numbers &amp; culture</h2>
<h3>Introducing yourself</h3>
<pre><code>はじめまして。
hajimemashite.               = Nice to meet you (first time).
わたし は ミン です。
watashi wa Min desu.          = I am Minh.
どうぞ よろしく おねがいします。
douzo yoroshiku onegaishimasu = Please treat me well / looking forward.
</code></pre>
<h3>Family — inside vs outside words</h3>
<p>Japanese uses <em>different</em> words for your OWN family vs someone else's (humble vs honorific):</p>
<ul>
<li>My mother: <strong>はは haha</strong>; your mother: <strong>おかあさん okaasan</strong>.</li>
<li>My father: <strong>ちち chichi</strong>; your father: <strong>おとうさん otousan</strong>.</li>
</ul>
<h3>Numbers &amp; time</h3>
<p>いち 1, に 2, さん 3, し/よん 4, ご 5, ろく 6, しち/なな 7, はち 8, きゅう 9, じゅう 10. Time: いちじ (1 o'clock), にじ (2 o'clock).</p>
<h3>A note on culture</h3>
<p>Politeness levels (keigo), bowing, and taking off shoes indoors reflect a culture of <strong>respect and group harmony</strong>. Learning the language includes learning when to be humble (about yourself) and honorific (about others) — that's why family words come in pairs.</p>`,
    `<span class="eyebrow">JPD133 · Chương 3 · Bài 3.1</span>
<h2>Bản thân, gia đình, số đếm &amp; văn hoá</h2>
<h3>Tự giới thiệu</h3>
<pre><code>はじめまして。
hajimemashite.               = Rất vui được gặp (lần đầu).
わたし は ミン です。
watashi wa Min desu.          = Tôi là Minh.
どうぞ よろしく おねがいします。
douzo yoroshiku onegaishimasu = Mong được giúp đỡ / rất mong.
</code></pre>
<h3>Gia đình — từ "trong nhà" vs "ngoài nhà"</h3>
<p>Tiếng Nhật dùng từ <em>khác nhau</em> cho gia đình MÌNH và gia đình người khác (khiêm nhường vs kính ngữ):</p>
<ul>
<li>Mẹ tôi: <strong>はは haha</strong>; mẹ của bạn: <strong>おかあさん okaasan</strong>.</li>
<li>Bố tôi: <strong>ちち chichi</strong>; bố của bạn: <strong>おとうさん otousan</strong>.</li>
</ul>
<h3>Số đếm &amp; giờ</h3>
<p>いち 1, に 2, さん 3, し/よん 4, ご 5, ろく 6, しち/なな 7, はち 8, きゅう 9, じゅう 10. Giờ: いちじ (1 giờ), にじ (2 giờ).</p>
<h3>Một nét văn hoá</h3>
<p>Các mức lịch sự (keigo), cúi chào, và cởi giày khi vào nhà phản ánh văn hoá <strong>tôn trọng và hoà hợp tập thể</strong>. Học ngôn ngữ bao gồm học khi nào khiêm nhường (về mình) và kính ngữ (về người khác) — đó là lý do từ chỉ gia đình đi theo cặp.</p>`,
  ]]);

const c3q = quiz('jpd133-quiz-3', 'Quiz 3 — Self, family & numbers|||Quiz 3 — Bản thân, gia đình & số', [
  { id: 'q1', question: 'Câu chào "lần đầu gặp mặt" là?', options: ['ありがとう arigatou', 'はじめまして hajimemashite', 'さようなら sayounara', 'こんばんは konbanwa'], correctIndex: 1, explanation: 'はじめまして dùng khi gặp lần đầu.' },
  { id: 'q2', question: '"Mẹ của TÔI" (khiêm nhường) trong tiếng Nhật là?', options: ['おかあさん okaasan', 'はは haha', 'おとうさん otousan', 'ちち chichi'], correctIndex: 1, explanation: 'はは = mẹ mình (khiêm nhường); おかあさん = mẹ người khác (kính).' },
  { id: 'q3', question: 'Số 3 trong tiếng Nhật đọc là?', options: ['いち ichi', 'に ni', 'さん san', 'ご go'], correctIndex: 2, explanation: 'さん = 3 (ichi 1, ni 2, san 3...).' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'JPD133',
    slug: 'jpd133-elementary-japanese-1-a1-a2',
    title: 'Elementary Japanese 1-A1/A2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JPD133.webp',
    shortDescription: 'Elementary Japanese (A1/A2) — kana & pronunciation, the "A wa B desu" pattern & particles, self/family introduction, numbers & culture. Bilingual (VI), with Japanese script + romaji & quizzes.|||Tiếng Nhật sơ cấp (A1/A2) — kana & phát âm, mẫu câu "A wa B desu" & trợ từ, tự giới thiệu/gia đình, số đếm & văn hoá. Song ngữ (VI), có chữ Nhật + romaji & quiz.',
    description: 'Môn <strong>JPD133 — Tiếng Nhật sơ cấp 1 (A1/A2)</strong> (kỳ 5) tiếp tục nền tiếng Nhật cơ bản: từ <strong>bảng chữ kana &amp; phát âm</strong> (hiragana/katakana, dakuten, trường âm) → <strong>mẫu câu "A は B です" &amp; trợ từ</strong> (は/の/か, phủ định) → <strong>tự giới thiệu, gia đình, số đếm, thời gian &amp; văn hoá Nhật</strong>. Bám giáo trình FLM, chủ yếu tiếng Việt kèm chữ Nhật (kana + romaji), quiz mỗi chương. Kết thúc bạn giới thiệu được bản thân &amp; gia đình ở mức đơn giản.',
    whatYouLearn: 'Đọc-viết hiragana/katakana, âm biến (dakuten/handakuten), trường âm; mẫu câu [Chủ đề] は [X] です; trợ từ は (wa), の (sở hữu), か (câu hỏi), phủ định ではありません; trật tự Chủ-Tân-Động; chào hỏi & tự giới thiệu (はじめまして, よろしく); từ vựng gia đình (khiêm nhường vs kính ngữ); số đếm 1-10 & giờ; vài nét văn hoá/lễ nghi Nhật.',
    requirements: 'Đã học học phần tiếng Nhật nhập môn trước (hoặc biết kana cơ bản). Không cần nền CNTT.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Ba hệ chữ, mục tiêu A1/A2.', lessons: [intro] },
    { title: 'Chương 1 — Kana & phát âm|||Chapter 1 — Kana & pronunciation', description: 'Hiragana/katakana, dakuten, trường âm.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mẫu câu & trợ từ|||Chapter 2 — Sentence & particles', description: 'A wa B desu, は/の/か, phủ định.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Bản thân, gia đình & văn hoá|||Chapter 3 — Self, family & culture', description: 'Tự giới thiệu, gia đình, số đếm, văn hoá.', lessons: [c3, c3q] },
  ],
};
