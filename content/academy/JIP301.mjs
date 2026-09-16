/**
 * JIP301 — Những vấn đề cơ bản về Ngữ âm, Từ vựng & Ngữ pháp tiếng Nhật -
 * Từ lý thuyết đến thực tiễn (Japanese Phonetics, Vocabulary & Grammar).
 * Khối Ngôn ngữ Nhật FPTU, Kỳ 5. MÔN LÝ THUYẾT (không phải môn tiếng theo bài
 * học từ vựng/hội thoại như JPD*): 8 chương chia 3 phần Ngữ âm — Từ vựng —
 * Ngữ pháp, giảng bằng tiếng Việt + thuật ngữ tiếng Anh, minh hoạ bằng ví dụ
 * tiếng Nhật thật (kana/kanji + romaji + nghĩa). Trích dẫn giáo trình: "日本語
 * の文法" (Japanese Grammar), "A Dictionary of Basic Japanese Grammar"
 * (Makino & Tsutsui), "現代日本語" (Modern Japanese) — KHÔNG upload PDF.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML;
 * "&"→&amp; khi hiển thị chữ "&"; helper doc .join('\n') ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 420, questions } });

const taiLieu = doc('jip301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình ngữ pháp tham khảo (trích dẫn, không upload PDF), từ điển, công cụ tra kanji/accent, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">JIP301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">This is a <strong>theory</strong> course: it steps back from "learn lesson N of a textbook" and asks <em>why</em> Japanese phonetics, vocabulary and grammar work the way they do. The reference grammars below are cited by name for further reading — no file is uploaded here.</p>
<h3>📘 Reference grammars (cited, not uploaded)</h3>
<ul>
<li><strong>日本語の文法</strong> (Japanese Grammar) — a general reference on the structure of the language.</li>
<li><strong>A Dictionary of Basic Japanese Grammar</strong> — Makino &amp; Tsutsui — the standard English-language grammar-pattern dictionary, organized entry by entry with example sentences.</li>
<li><strong>現代日本語</strong> (Modern Japanese) — a descriptive grammar of the standard modern language.</li>
</ul>
<h3>🌐 Dictionaries &amp; lookup tools</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — Japanese-English dictionary; shows kanji readings (on'yomi/kun'yomi), word origin tags (和/漢/外) and example sentences.</li>
<li><a href="https://www.japanesepronunciation.com/" target="_blank" rel="noopener">OJAD (Online Japanese Accent Dictionary)</a> style tools — look up the pitch-accent pattern of any word.</li>
</ul>
<h3>▶️ For listening to real pitch accent</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=japanese+pitch+accent" target="_blank" rel="noopener">YouTube — "Japanese pitch accent"</a> — short explainer videos with native audio minimal pairs (橋/箸/端).</li>
</ul>
<div class="callout"><span class="badge">4-step study path</span>
<ol>
<li><strong>Phonetics first</strong> — mora, long vowels, gemination and pitch accent are what make Japanese <em>sound</em> Japanese; get the ear right before anything else.</li>
<li><strong>Writing &amp; vocabulary layers</strong> — hiragana/katakana/kanji, then 和語/漢語/外来語 — knowing which layer a word belongs to predicts its spelling and register.</li>
<li><strong>Grammar mechanics</strong> — word classes, particles, conjugation: the machinery that turns vocabulary into sentences.</li>
<li><strong>Register &amp; syntax</strong> — keigo and sentence structure, then tie every chapter back to a real sentence.</li>
</ol></div>`,
    `<span class="eyebrow">JIP301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Đây là môn <strong>lý thuyết</strong>: thay vì "học bài N của một giáo trình", môn hỏi <em>vì sao</em> ngữ âm, từ vựng và ngữ pháp tiếng Nhật vận hành như vậy. Các giáo trình tham khảo dưới đây được trích dẫn tên để đọc thêm — không có file nào được tải lên đây.</p>
<h3>📘 Giáo trình tham khảo (trích dẫn, không upload)</h3>
<ul>
<li><strong>日本語の文法</strong> (Japanese Grammar) — tài liệu tham khảo tổng quát về cấu trúc ngôn ngữ.</li>
<li><strong>A Dictionary of Basic Japanese Grammar</strong> — Makino &amp; Tsutsui — từ điển mẫu ngữ pháp tiếng Anh chuẩn, trình bày theo từng mục kèm câu ví dụ.</li>
<li><strong>現代日本語</strong> (Modern Japanese) — ngữ pháp mô tả của tiếng Nhật hiện đại chuẩn.</li>
</ul>
<h3>🌐 Từ điển &amp; công cụ tra cứu</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — từ điển Nhật-Anh; hiển thị cách đọc kanji (âm On/Kun), nhãn nguồn gốc từ (和/漢/外) và câu ví dụ.</li>
<li>Công cụ kiểu <strong>OJAD (Online Japanese Accent Dictionary)</strong> — tra hình mẫu trọng âm (アクセント) của bất kỳ từ nào.</li>
</ul>
<h3>▶️ Để nghe trọng âm thật</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=japanese+pitch+accent" target="_blank" rel="noopener">YouTube — "Japanese pitch accent"</a> — video ngắn giải thích kèm âm thanh người bản xứ, có cặp từ tối thiểu (橋/箸/端).</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học 4 bước</span>
<ol>
<li><strong>Ngữ âm trước</strong> — mora, trường âm, âm ngắt và trọng âm là thứ khiến tiếng Nhật <em>nghe</em> ra tiếng Nhật; luyện tai đúng trước khi học gì khác.</li>
<li><strong>Lớp chữ viết &amp; từ vựng</strong> — hiragana/katakana/kanji, rồi đến 和語/漢語/外来語 — biết một từ thuộc lớp nào sẽ đoán được cách viết và mức trang trọng của nó.</li>
<li><strong>Cơ chế ngữ pháp</strong> — từ loại, trợ từ, chia dạng: bộ máy biến từ vựng thành câu.</li>
<li><strong>Mức trang trọng &amp; cú pháp</strong> — kính ngữ và cấu trúc câu, rồi nối mỗi chương lại với một câu thật.</li>
</ol></div>`,
  ]]);

const intro = doc('jip301-0-1-overview', 'Course overview: Japanese phonetics, vocabulary & grammar|||Tổng quan: Ngữ âm, từ vựng & ngữ pháp tiếng Nhật',
  '8 chương chia 3 phần: ngữ âm (mora, trọng âm) → chữ viết & từ vựng (hiragana/katakana/kanji, 和語/漢語/外来語) → ngữ pháp (từ loại, trợ từ, chia động từ, kính ngữ, cú pháp).',
  [[
    `<span class="eyebrow">JIP301 · Lesson 0.1 · Overview</span>
<h2>Basic issues in Japanese phonetics, vocabulary &amp; grammar</h2>
<p class="lead">This course does not teach "lesson 1, lesson 2" of a textbook the way a language-skill course does. It steps back and explains the <strong>system</strong> behind Japanese: how its sounds are organized, how its three writing systems and three vocabulary layers work together, and how its grammar builds a sentence — <strong>from theory to practice</strong>, always anchored in real Japanese examples.</p>
<h3>Three parts, eight chapters</h3>
<ul>
<li><strong>Phonetics (Chapters 1-2)</strong> — the sound system (mora, long vowels, pitch accent) and the writing system that encodes it (hiragana, katakana, kanji with on'yomi/kun'yomi).</li>
<li><strong>Vocabulary (Chapters 3-4)</strong> — the three historical layers of the lexicon (和語/漢語/外来語) and how words are classified and built (品詞, word formation).</li>
<li><strong>Grammar (Chapters 5-8)</strong> — particles (助詞), verb/adjective conjugation (活用), the honorific system (敬語), and sentence syntax, ending with a review chapter.</li>
</ul>
<h3>Why this matters even if you already "speak" some Japanese</h3>
<p>Language-skill courses (JPD1xx/2xx/3xx) teach you to <em>use</em> patterns; this course explains <em>why</em> they exist — why おばさん and おばあさん differ only by one mora, why 山 is read やま alone but サン in 富士山, why は and が are not interchangeable, why 食べる becomes 召し上がる in respectful speech. That understanding is what lets you generalize to sentences you have never memorized.</p>
<h3>Roadmap</h3>
<p>1. Sound system (mora, length, accent) → 2. Writing system (hiragana/katakana/kanji, on-kun) → 3. Vocabulary layers (和語/漢語/外来語) → 4. Word classes &amp; word formation (品詞) → 5. Particles (助詞) → 6. Verb &amp; adjective conjugation (活用) → 7. Honorifics (敬語) → 8. Sentence syntax &amp; review.</p>`,
    `<span class="eyebrow">JIP301 · Bài 0.1 · Tổng quan</span>
<h2>Những vấn đề cơ bản về ngữ âm, từ vựng &amp; ngữ pháp tiếng Nhật</h2>
<p class="lead">Môn này không dạy "bài 1, bài 2" của một giáo trình như môn kỹ năng tiếng. Nó lùi lại và giải thích <strong>hệ thống</strong> đứng sau tiếng Nhật: âm thanh được tổ chức thế nào, ba hệ chữ viết và ba lớp từ vựng phối hợp ra sao, và ngữ pháp dựng câu thế nào — <strong>từ lý thuyết đến thực tiễn</strong>, luôn bám vào ví dụ tiếng Nhật thật.</p>
<h3>Ba phần, tám chương</h3>
<ul>
<li><strong>Ngữ âm (Chương 1-2)</strong> — hệ thống âm thanh (mora, trường âm, trọng âm) và hệ chữ viết mã hoá nó (hiragana, katakana, kanji với âm On/âm Kun).</li>
<li><strong>Từ vựng (Chương 3-4)</strong> — ba lớp từ vựng theo lịch sử (和語/漢語/外来語) và cách từ được phân loại, cấu tạo (品詞, cấu tạo từ).</li>
<li><strong>Ngữ pháp (Chương 5-8)</strong> — trợ từ (助詞), chia động từ/tính từ (活用), hệ thống kính ngữ (敬語), và cú pháp câu, kết bằng chương ôn tập.</li>
</ul>
<h3>Vì sao cần môn này dù đã "nói được" ít nhiều</h3>
<p>Các môn kỹ năng tiếng (JPD1xx/2xx/3xx) dạy bạn <em>dùng</em> mẫu câu; môn này giải thích <em>vì sao</em> chúng tồn tại — vì sao おばさん và おばあさん chỉ khác nhau một mora, vì sao 山 đọc やま khi đứng một mình nhưng đọc サン trong 富士山, vì sao は và が không thay nhau được, vì sao 食べる biến thành 召し上がる trong lời nói kính trọng. Hiểu được điều đó mới khái quát được sang những câu chưa từng học thuộc.</p>
<h3>Lộ trình</h3>
<p>1. Hệ thống âm (mora, trường âm, trọng âm) → 2. Hệ chữ viết (hiragana/katakana/kanji, On-Kun) → 3. Lớp từ vựng (和語/漢語/外来語) → 4. Từ loại &amp; cấu tạo từ (品詞) → 5. Trợ từ (助詞) → 6. Chia động từ &amp; tính từ (活用) → 7. Kính ngữ (敬語) → 8. Cú pháp câu &amp; ôn tập.</p>`,
  ]]);

// Chapter 1 — Phonetic system: mora, sounds, long vowels & pitch accent
const c1 = doc('jip301-1-1-phonetics', '1. The Japanese sound system: mora, vowel length & pitch accent (アクセント)|||1. Hệ thống ngữ âm tiếng Nhật: mora, trường âm & trọng âm (アクセント)',
  'Đơn vị nhịp là mora (拍) chứ không phải âm tiết; trường âm 長音, âm ngắt 促音 っ, âm mũi 撥音 ん đều là 1 mora; trọng âm cao-thấp アクセント phân biệt nghĩa (橋/箸/端).',
  [[
    `<span class="eyebrow">JIP301 · Chapter 1</span>
<h2>The Japanese sound system: mora, vowel length &amp; pitch accent</h2>
<h3>The mora (拍, はく), not the syllable</h3>
<p>Japanese rhythm is timed in <strong>mora</strong> (拍/モーラ), a unit of roughly equal length — not the "syllable" used to describe English. A plain CV sequence (consonant+vowel) is one mora, but so are three special elements that a syllable-based count would merge into the sound before them:</p>
<table>
<tr><th>Element</th><th>Name</th><th>Example</th><th>Mora count</th></tr>
<tr><td>Long vowel</td><td>長音 (chōon)</td><td>おばあさん (obāsan, "grandmother")</td><td>o-ba-a-sa-n = 5</td></tr>
<tr><td>Geminate consonant</td><td>促音 (sokuon) っ</td><td>きって (kitte, "stamp")</td><td>ki-t-te = 3</td></tr>
<tr><td>Moraic nasal</td><td>撥音 (hatsuon) ん</td><td>ほん (hon, "book")</td><td>ho-n = 2</td></tr>
</table>
<h3>Length is meaningful, not decorative</h3>
<p>Because each mora counts, a "small" difference of one mora changes the word entirely:</p>
<ul>
<li>おばさん (obasan, 4 mora) — "aunt" &nbsp;vs&nbsp; おばあさん (obāsan, 5 mora) — "grandmother".</li>
<li>きて (kite, 2 mora) — "come" (て-form of 来る) &nbsp;vs&nbsp; きって (kitte, 3 mora) — "stamp".</li>
<li>ビル (biru, 2 mora) — "building" &nbsp;vs&nbsp; ビール (bīru, 3 mora) — "beer".</li>
</ul>
<h3>Pitch accent (高低アクセント, アクセント)</h3>
<p>Japanese is not tonal like Chinese, but standard (Tokyo) Japanese has <strong>pitch accent</strong>: each mora is pronounced relatively High (H) or Low (L), and the pattern is fixed per word. Change the pattern and you can change the meaning — the classic minimal set:</p>
<pre><code>はし (hashi)
  箸 "chopsticks"  ->  HL  (high then low)
  橋 "bridge"      ->  LH  (low then high, stays high on particle)
  端 "edge"        ->  LH  (low then high, drops on particle)
</code></pre>
<div class="callout"><span class="badge">Why this matters</span> A learner who ignores mora length and pitch accent can still be understood from context, but every one of these contrasts is a real, commonly-cited minimal pair in Japanese phonology — they are the first thing a phonetics course has to make audible, not just readable.</div>`,
    `<span class="eyebrow">JIP301 · Chương 1</span>
<h2>Hệ thống ngữ âm tiếng Nhật: mora, trường âm &amp; trọng âm</h2>
<h3>Đơn vị mora (拍, はく), không phải âm tiết</h3>
<p>Nhịp điệu tiếng Nhật được tính theo <strong>mora</strong> (拍/モーラ), đơn vị có độ dài xấp xỉ bằng nhau — khác với "âm tiết" dùng để mô tả tiếng Anh. Một chuỗi CV (phụ âm+nguyên âm) đơn giản là một mora, nhưng ba yếu tố đặc biệt sau cũng tính là một mora riêng, dù cách đếm theo âm tiết sẽ gộp chúng vào âm trước:</p>
<table>
<tr><th>Yếu tố</th><th>Tên gọi</th><th>Ví dụ</th><th>Số mora</th></tr>
<tr><td>Trường âm</td><td>長音 (chōon)</td><td>おばあさん (obāsan, "bà")</td><td>o-ba-a-sa-n = 5</td></tr>
<tr><td>Phụ âm kép</td><td>促音 (sokuon) っ</td><td>きって (kitte, "tem")</td><td>ki-t-te = 3</td></tr>
<tr><td>Âm mũi độc lập</td><td>撥音 (hatsuon) ん</td><td>ほん (hon, "sách")</td><td>ho-n = 2</td></tr>
</table>
<h3>Độ dài mang nghĩa, không phải trang trí</h3>
<p>Vì mỗi mora đều được tính, một khác biệt "nhỏ" một mora làm đổi hẳn cả từ:</p>
<ul>
<li>おばさん (obasan, 4 mora) — "cô/dì" &nbsp;so với&nbsp; おばあさん (obāsan, 5 mora) — "bà".</li>
<li>きて (kite, 2 mora) — "đến/hãy đến" (thể て của 来る) &nbsp;so với&nbsp; きって (kitte, 3 mora) — "tem".</li>
<li>ビル (biru, 2 mora) — "toà nhà" &nbsp;so với&nbsp; ビール (bīru, 3 mora) — "bia".</li>
</ul>
<h3>Trọng âm cao-thấp (高低アクセント, アクセント)</h3>
<p>Tiếng Nhật không phải ngôn ngữ thanh điệu như tiếng Trung, nhưng tiếng Nhật chuẩn (giọng Tokyo) có <strong>trọng âm cao-thấp</strong>: mỗi mora được phát ở cao độ tương đối Cao (H) hoặc Thấp (L), và mẫu này cố định theo từng từ. Đổi mẫu là có thể đổi nghĩa — bộ ba kinh điển:</p>
<pre><code>はし (hashi)
  箸 "đôi đũa"   ->  HL  (cao rồi thấp)
  橋 "cây cầu"   ->  LH  (thấp rồi cao, giữ cao ở trợ từ)
  端 "mép/rìa"   ->  LH  (thấp rồi cao, hạ xuống ở trợ từ)
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Người học bỏ qua độ dài mora và trọng âm vẫn có thể được hiểu nhờ ngữ cảnh, nhưng mỗi cặp đối lập trên đều là ví dụ kinh điển, được trích dẫn thường xuyên trong ngữ âm học tiếng Nhật — đây là điều đầu tiên một môn ngữ âm phải làm cho nghe được, không chỉ đọc được.</div>`,
  ]]);

const c1q = quiz('jip301-quiz-1', 'Quiz 1 — Phonetics|||Quiz 1 — Ngữ âm', [
  { id: 'q1', question: 'Đơn vị nhịp cơ bản của tiếng Nhật là gì?', options: ['Âm tiết (syllable)', 'Mora (拍)', 'Từ (word)', 'Chữ cái (letter)'], correctIndex: 1, explanation: 'Tiếng Nhật tính nhịp theo mora — trường âm, âm ngắt っ và âm mũi ん mỗi thứ đều tính là một mora riêng.' },
  { id: 'q2', question: 'おばさん (4 mora, "cô/dì") khác おばあさん (5 mora, "bà") ở đâu?', options: ['Trọng âm khác hoàn toàn', 'Một trường âm (chōon) thêm vào', 'Một âm ngắt っ', 'Không khác gì, cùng nghĩa'], correctIndex: 1, explanation: 'おばあさん có thêm một mora trường âm (ba あ) so với おばさん — một khác biệt nhỏ nhưng đổi hẳn nghĩa.' },
  { id: 'q3', question: '橋 (cây cầu) và 箸 (đôi đũa) đều đọc "hashi" nhưng phân biệt bằng gì?', options: ['Số mora khác nhau', 'Trọng âm cao-thấp (pitch accent) khác nhau', 'Cách viết kanji giống hệt nên không phân biệt được khi nói', 'Một từ có âm ngắt, một từ không'], correctIndex: 1, explanation: '橋 có mẫu LH còn 箸 có mẫu HL — cùng số mora, cùng cách đọc La-tinh hoá nhưng khác trọng âm.' },
]);

// Chapter 2 — Writing system: hiragana, katakana, kanji, on'yomi/kun'yomi
const c2 = doc('jip301-2-1-writing-system', '2. Writing system: hiragana, katakana & kanji (音読み/訓読み)|||2. Chữ viết: hiragana, katakana & kanji (音読み/訓読み)',
  'Ba hệ chữ viết cùng tồn tại trong một câu: hiragana (ngữ pháp/từ thuần Nhật), katakana (từ ngoại lai/tượng thanh), kanji với hai cách đọc On (漢語) và Kun (和語).',
  [[
    `<span class="eyebrow">JIP301 · Chapter 2</span>
<h2>Writing system: hiragana, katakana &amp; kanji</h2>
<h3>Three scripts in one sentence</h3>
<p>A single ordinary Japanese sentence mixes all three scripts, each with its own job:</p>
<pre><code>私は  コーヒー を  飲みます。
kanji hiragana katakana hiragana kanji+hiragana

"I drink coffee."</code></pre>
<ul>
<li><strong>Hiragana (ひらがな)</strong> — 46 basic syllabic signs (curvy shapes) plus diacritics: <strong>濁点</strong> (dakuten, ゛) voices a consonant (か ka → が ga), <strong>半濁点</strong> (handakuten, ゜) turns h into p (は ha → ぱ pa); combined with a small や/ゆ/よ it makes <strong>拗音</strong> (yōon) sounds like きゃ (kya). Hiragana spells native grammar — particles, verb/adjective endings (okurigana) — and any native word not written in kanji.</li>
<li><strong>Katakana (カタカナ)</strong> — the same sound inventory, angular shapes, used for loanwords (外来語): コーヒー (kōhī, "coffee"), アメリカ (Amerika, "America"); also onomatopoeia and emphasis (like italics).</li>
<li><strong>Kanji (漢字)</strong> — logographic characters borrowed from Chinese; carry meaning and (usually) more than one pronunciation.</li>
</ul>
<h3>On'yomi (音読み) vs Kun'yomi (訓読み)</h3>
<p>Most kanji have two kinds of reading, and picking the right one depends on context:</p>
<table>
<tr><th>Kanji</th><th>Kun'yomi (native reading, alone)</th><th>On'yomi (Sino-Japanese, in compounds)</th></tr>
<tr><td>山 "mountain"</td><td>やま (yama) — 山 (yama) "a mountain"</td><td>サン (san) — 富士山 (Fujisan) "Mt. Fuji"</td></tr>
<tr><td>水 "water"</td><td>みず (mizu) — 水 (mizu) "water"</td><td>スイ (sui) — 水曜日 (suiyōbi) "Wednesday"</td></tr>
<tr><td>食 "eat"</td><td>た(べる) — 食べる (taberu) "to eat"</td><td>ショク (shoku) — 食堂 (shokudō) "cafeteria"</td></tr>
</table>
<p><strong>Rule of thumb:</strong> a kanji standing alone (often with hiragana okurigana) uses kun'yomi; a kanji joined with another kanji into a compound word usually uses on'yomi.</p>
<div class="callout"><span class="badge">Okurigana</span> The hiragana tail attached to a kanji verb/adjective stem — 食べ<u>る</u>, 食べ<u>ます</u>, 食べ<u>ません</u> — carries the conjugation while the kanji 食 carries the meaning. This is why the same kanji can appear in many different-looking words.</div>`,
    `<span class="eyebrow">JIP301 · Chương 2</span>
<h2>Chữ viết: hiragana, katakana &amp; kanji</h2>
<h3>Ba hệ chữ trong một câu</h3>
<p>Một câu tiếng Nhật thông thường trộn cả ba hệ chữ, mỗi hệ một vai trò:</p>
<pre><code>私は  コーヒー を  飲みます。
kanji hiragana katakana hiragana kanji+hiragana

"Tôi uống cà phê."</code></pre>
<ul>
<li><strong>Hiragana (ひらがな)</strong> — 46 ký hiệu âm tiết cơ bản (nét cong) cộng dấu phụ: <strong>濁点</strong> (dakuten, ゛) hữu thanh hoá phụ âm (か ka → が ga), <strong>半濁点</strong> (handakuten, ゜) biến h thành p (は ha → ぱ pa); ghép với や/ゆ/よ nhỏ tạo âm <strong>拗音</strong> (yōon) như きゃ (kya). Hiragana viết ngữ pháp thuần Nhật — trợ từ, đuôi chia động từ/tính từ (okurigana) — và mọi từ thuần Nhật không viết bằng kanji.</li>
<li><strong>Katakana (カタカナ)</strong> — cùng bộ âm, nét thẳng góc cạnh, dùng cho từ ngoại lai (外来語): コーヒー (kōhī, "cà phê"), アメリカ (Amerika, "nước Mỹ"); cũng dùng cho từ tượng thanh và nhấn mạnh (như in nghiêng).</li>
<li><strong>Kanji (漢字)</strong> — chữ biểu ý mượn từ tiếng Trung; mang nghĩa và (thường) có hơn một cách đọc.</li>
</ul>
<h3>Âm On (音読み) so với âm Kun (訓読み)</h3>
<p>Hầu hết kanji có hai loại cách đọc, và chọn đúng cách đọc phụ thuộc ngữ cảnh:</p>
<table>
<tr><th>Kanji</th><th>Kun'yomi (âm thuần Nhật, đứng một mình)</th><th>On'yomi (âm Hán-Nhật, trong từ ghép)</th></tr>
<tr><td>山 "núi"</td><td>やま (yama) — 山 (yama) "ngọn núi"</td><td>サン (san) — 富士山 (Fujisan) "núi Phú Sĩ"</td></tr>
<tr><td>水 "nước"</td><td>みず (mizu) — 水 (mizu) "nước"</td><td>スイ (sui) — 水曜日 (suiyōbi) "thứ Tư"</td></tr>
<tr><td>食 "ăn"</td><td>た(べる) — 食べる (taberu) "ăn"</td><td>ショク (shoku) — 食堂 (shokudō) "căng-tin"</td></tr>
</table>
<p><strong>Quy tắc chung:</strong> kanji đứng một mình (thường kèm okurigana hiragana) dùng âm Kun; kanji ghép với kanji khác thành từ ghép thường dùng âm On.</p>
<div class="callout"><span class="badge">Okurigana</span> Đuôi hiragana gắn sau gốc kanji của động từ/tính từ — 食べ<u>る</u>, 食べ<u>ます</u>, 食べ<u>ません</u> — mang phần chia dạng trong khi kanji 食 mang phần nghĩa. Đây là lý do cùng một kanji xuất hiện trong nhiều từ trông rất khác nhau.</div>`,
  ]]);

const c2q = quiz('jip301-quiz-2', 'Quiz 2 — Writing system|||Quiz 2 — Chữ viết', [
  { id: 'q1', question: 'Hệ chữ nào dùng chủ yếu để viết từ ngoại lai (外来語) như コーヒー?', options: ['Hiragana', 'Katakana', 'Kanji', 'Romaji'], correctIndex: 1, explanation: 'Katakana dùng cho từ mượn nước ngoài, từ tượng thanh và nhấn mạnh.' },
  { id: 'q2', question: 'Kanji 山 đọc "やま (yama)" khi đứng một mình, và đọc "サン (san)" trong 富士山 — đây là ví dụ của?', options: ['Trọng âm cao-thấp', 'Âm Kun (kun\'yomi) và âm On (on\'yomi)', 'Trường âm và âm ngắt', 'Dakuten và handakuten'], correctIndex: 1, explanation: 'やま là âm Kun (thuần Nhật, đứng một mình); サン là âm On (Hán-Nhật, trong từ ghép).' },
  { id: 'q3', question: 'Phần hiragana gắn sau gốc kanji của động từ, như る/ます trong 食べる/食べます, gọi là gì?', options: ['Furigana', 'Okurigana', 'Dakuten', 'Yōon'], correctIndex: 1, explanation: 'Okurigana là đuôi hiragana mang phần chia dạng, đi kèm gốc kanji mang nghĩa.' },
]);

// Chapter 3 — Vocabulary layers: wago, kango, gairaigo
const c3 = doc('jip301-3-1-vocabulary-layers', '3. Vocabulary: native, Sino-Japanese & loanwords (和語/漢語/外来語)|||3. Từ vựng: từ thuần Nhật, Hán-Nhật & ngoại lai (和語/漢語/外来語)',
  'Ba lớp từ vựng theo nguồn gốc lịch sử: 和語 (wago, thuần Nhật, âm Kun), 漢語 (kango, Hán-Nhật, âm On), 外来語 (gairaigo, ngoại lai, katakana); cộng 混種語 (từ lai) trộn nhiều lớp.',
  [[
    `<span class="eyebrow">JIP301 · Chapter 3</span>
<h2>Vocabulary: three historical layers</h2>
<p>Japanese vocabulary is traditionally divided into layers by <strong>origin</strong>, and the origin predicts spelling, pronunciation style and register.</p>
<h3>和語 (Wago) — native Japanese words</h3>
<p>The oldest layer, present before Chinese writing arrived. Usually written with <strong>kun'yomi</strong> kanji or plain hiragana, and tend to feel softer/more everyday.</p>
<ul>
<li>山 (やま, yama) — "mountain"; 川 (かわ, kawa) — "river"; 花 (はな, hana) — "flower".</li>
</ul>
<h3>漢語 (Kango) — Sino-Japanese words</h3>
<p>Borrowed from Chinese (via kanji) over many centuries. Almost always <strong>on'yomi</strong> compounds of two or more kanji, feel more formal/technical/abstract — much like Latin/Greek-derived vocabulary in English (e.g. "aquatic" vs "watery").</p>
<ul>
<li>学校 (がっこう, gakkō) — "school"; 電話 (でんわ, denwa) — "telephone"; 山脈 (さんみゃく, sanmyaku) — "mountain range" (山 here in on'yomi サン).</li>
</ul>
<h3>外来語 (Gairaigo) — loanwords</h3>
<p>Mostly from English (and some from Portuguese, Dutch, German, French — historically), written in <strong>katakana</strong>. Often clipped or reshaped to fit Japanese phonology.</p>
<ul>
<li>テレビ (terebi, from "television"); パソコン (pasokon, a clipped compound of "personal computer"); アルバイト (arubaito, "part-time job", from German <em>Arbeit</em> "work").</li>
</ul>
<h3>混種語 (Konshugo) — hybrid words</h3>
<p>Words that mix layers within a single word:</p>
<pre><code>消しゴム  (keshigomu, "eraser")
  消し  = wago  (from 消す "to erase")
  ゴム  = gairaigo (from Dutch "gom", rubber)
  -> wago + gairaigo compound
</code></pre>
<div class="callout"><span class="badge">Why the layers matter</span> The same idea often has a wago AND a kango word — 家 (いえ, ie, wago, "house/home", everyday) vs 住宅 (じゅうたく, jūtaku, kango, "residence", formal/legal register) — so choosing the right layer is choosing the right register, just like "ask" vs "inquire" in English.</div>`,
    `<span class="eyebrow">JIP301 · Chương 3</span>
<h2>Từ vựng: ba lớp theo lịch sử</h2>
<p>Từ vựng tiếng Nhật theo truyền thống chia thành các lớp theo <strong>nguồn gốc</strong>, và nguồn gốc quyết định cách viết, cách đọc và mức trang trọng.</p>
<h3>和語 (Wago) — từ thuần Nhật</h3>
<p>Lớp cổ nhất, có trước khi chữ Hán du nhập. Thường viết bằng kanji đọc <strong>âm Kun</strong> hoặc hiragana thuần, có cảm giác mềm mại/đời thường hơn.</p>
<ul>
<li>山 (やま, yama) — "núi"; 川 (かわ, kawa) — "sông"; 花 (はな, hana) — "hoa".</li>
</ul>
<h3>漢語 (Kango) — từ Hán-Nhật</h3>
<p>Mượn từ tiếng Trung (qua kanji) qua nhiều thế kỷ. Hầu như luôn là từ ghép <strong>âm On</strong> từ hai kanji trở lên, có cảm giác trang trọng/kỹ thuật/trừu tượng hơn — giống từ gốc Latin/Hy Lạp trong tiếng Anh (vd "aquatic" so với "watery").</p>
<ul>
<li>学校 (がっこう, gakkō) — "trường học"; 電話 (でんわ, denwa) — "điện thoại"; 山脈 (さんみゃく, sanmyaku) — "dãy núi" (山 ở đây đọc âm On サン).</li>
</ul>
<h3>外来語 (Gairaigo) — từ ngoại lai</h3>
<p>Phần lớn từ tiếng Anh (và một số từ Bồ Đào Nha, Hà Lan, Đức, Pháp — trong lịch sử), viết bằng <strong>katakana</strong>. Thường bị cắt gọn hoặc biến dạng cho hợp âm vị tiếng Nhật.</p>
<ul>
<li>テレビ (terebi, từ "television"); パソコン (pasokon, từ ghép rút gọn của "personal computer"); アルバイト (arubaito, "việc làm thêm", từ tiếng Đức <em>Arbeit</em> "công việc").</li>
</ul>
<h3>混種語 (Konshugo) — từ lai</h3>
<p>Từ trộn nhiều lớp trong cùng một từ:</p>
<pre><code>消しゴム  (keshigomu, "cục tẩy")
  消し  = wago  (từ 消す "xoá")
  ゴム  = gairaigo (từ tiếng Hà Lan "gom", cao su)
  -> từ ghép wago + gairaigo</code></pre>
<div class="callout"><span class="badge">Vì sao các lớp quan trọng</span> Cùng một ý thường có cả từ wago LẪN từ kango — 家 (いえ, ie, wago, "nhà", đời thường) so với 住宅 (じゅうたく, jūtaku, kango, "nơi cư trú", trang trọng/pháp lý) — nên chọn đúng lớp từ chính là chọn đúng mức trang trọng, giống "hỏi" so với "chất vấn" trong tiếng Việt.</div>`,
  ]]);

const c3q = quiz('jip301-quiz-3', 'Quiz 3 — Vocabulary layers|||Quiz 3 — Lớp từ vựng', [
  { id: 'q1', question: '学校 (がっこう, "trường học") thuộc lớp từ vựng nào?', options: ['和語 (wago, thuần Nhật)', '漢語 (kango, Hán-Nhật)', '外来語 (gairaigo, ngoại lai)', '混種語 (konshugo, từ lai)'], correctIndex: 1, explanation: '学校 là từ ghép hai kanji đọc âm On (がっこう) — điển hình của lớp 漢語.' },
  { id: 'q2', question: 'テレビ (terebi, "tivi") thuộc lớp từ vựng nào và viết bằng hệ chữ nào?', options: ['和語 — hiragana', '漢語 — kanji', '外来語 — katakana', '混種語 — romaji'], correctIndex: 2, explanation: 'テレビ mượn từ tiếng Anh "television", thuộc 外来語, viết bằng katakana.' },
  { id: 'q3', question: '消しゴム (keshigomu, "cục tẩy") là ví dụ của loại từ nào?', options: ['Từ thuần 和語', 'Từ thuần 漢語', 'Từ thuần 外来語', '混種語 — từ lai trộn 和語 + 外来語'], correctIndex: 3, explanation: '消し (từ 消す, wago) ghép với ゴム (gairaigo từ tiếng Hà Lan) tạo thành một từ lai.' },
]);

// Chapter 4 — Word classes & word formation (品詞)
const c4 = doc('jip301-4-1-word-classes', '4. Word classes & word formation (品詞)|||4. Từ loại & cấu tạo từ (品詞)',
  '9 từ loại chính: 名詞/動詞/形容詞(い)/形容動詞(な)/副詞/助詞/助動詞/接続詞/感動詞; cấu tạo từ ghép (複合語) và phái sinh bằng phụ tố (お/ご, さ/み).',
  [[
    `<span class="eyebrow">JIP301 · Chapter 4</span>
<h2>Word classes &amp; word formation (品詞, hinshi)</h2>
<h3>The main word classes</h3>
<table>
<tr><th>品詞</th><th>Class</th><th>Example</th></tr>
<tr><td>名詞 (meishi)</td><td>Noun</td><td>本 (hon) "book"</td></tr>
<tr><td>動詞 (dōshi)</td><td>Verb</td><td>読む (yomu) "to read"</td></tr>
<tr><td>形容詞 (keiyōshi)</td><td>い-adjective</td><td>高い (takai) "tall/expensive"</td></tr>
<tr><td>形容動詞 (keiyōdōshi)</td><td>な-adjective</td><td>静か(な) (shizuka na) "quiet"</td></tr>
<tr><td>副詞 (fukushi)</td><td>Adverb</td><td>とても (totemo) "very"</td></tr>
<tr><td>助詞 (joshi)</td><td>Particle</td><td>は, が, を, に, で ...</td></tr>
<tr><td>助動詞 (jodōshi)</td><td>Auxiliary verb</td><td>〜ます, 〜ない, 〜れる (attaches to a verb stem)</td></tr>
<tr><td>接続詞 (setsuzokushi)</td><td>Conjunction</td><td>そして (soshite) "and then"</td></tr>
<tr><td>感動詞 (kandōshi)</td><td>Interjection</td><td>ああ (ā) "oh"</td></tr>
</table>
<p>Note the two adjective classes: an <strong>い-adjective</strong> conjugates on its own (高い → 高くない → 高かった), while a <strong>な-adjective</strong> behaves like a noun and needs な before a noun, だ/です as a copula (静かな部屋 "a quiet room", 静かです "[it] is quiet").</p>
<h3>Word formation: compounding (複合語)</h3>
<p>Two free words combine into one, often with a sound change (連濁, rendaku — the second element's initial consonant voices):</p>
<ul>
<li>山 (やま, yama) + 登り (のぼり, nobori) → 山登り (やまのぼり, yamanobori) "mountain climbing" — のぼり's "n" stays, but many compounds do voice: 手 (て, te) + 紙 (かみ, kami) → 手紙 (てがみ, tegami) "letter" (かみ→がみ).</li>
</ul>
<h3>Word formation: derivation (affixes)</h3>
<ul>
<li><strong>お/ご + noun</strong> (honorific/polite prefix): お茶 (ocha, "tea"), ご飯 (gohan, "cooked rice/meal").</li>
<li><strong>い-adjective stem + さ</strong> (turns a quality into a measurable noun): 高い (takai, "tall") → 高さ (takasa, "height"); 楽しい (tanoshii, "fun") → 楽しさ (tanoshisa, "funness/degree of fun").</li>
<li><strong>い-adjective stem + み</strong> (a more subjective/felt nominalization): 高い → 高み (takami, "a high place, felt as height").</li>
</ul>
<div class="callout"><span class="badge">Why classify at all</span> A word's class predicts how it conjugates and what particle attaches to it — knowing 静か is a な-adjective (not an い-adjective) is exactly what tells you to say 静かな部屋, not "静かい部屋" (ungrammatical).</div>`,
    `<span class="eyebrow">JIP301 · Chương 4</span>
<h2>Từ loại &amp; cấu tạo từ (品詞, hinshi)</h2>
<h3>Các từ loại chính</h3>
<table>
<tr><th>品詞</th><th>Từ loại</th><th>Ví dụ</th></tr>
<tr><td>名詞 (meishi)</td><td>Danh từ</td><td>本 (hon) "sách"</td></tr>
<tr><td>動詞 (dōshi)</td><td>Động từ</td><td>読む (yomu) "đọc"</td></tr>
<tr><td>形容詞 (keiyōshi)</td><td>Tính từ đuôi い</td><td>高い (takai) "cao/đắt"</td></tr>
<tr><td>形容動詞 (keiyōdōshi)</td><td>Tính từ đuôi な</td><td>静か(な) (shizuka na) "yên tĩnh"</td></tr>
<tr><td>副詞 (fukushi)</td><td>Phó từ</td><td>とても (totemo) "rất"</td></tr>
<tr><td>助詞 (joshi)</td><td>Trợ từ</td><td>は, が, を, に, で ...</td></tr>
<tr><td>助動詞 (jodōshi)</td><td>Trợ động từ</td><td>〜ます, 〜ない, 〜れる (gắn vào gốc động từ)</td></tr>
<tr><td>接続詞 (setsuzokushi)</td><td>Liên từ</td><td>そして (soshite) "rồi thì"</td></tr>
<tr><td>感動詞 (kandōshi)</td><td>Thán từ</td><td>ああ (ā) "ôi"</td></tr>
</table>
<p>Chú ý hai loại tính từ: <strong>tính từ đuôi い</strong> tự chia dạng (高い → 高くない → 高かった), còn <strong>tính từ đuôi な</strong> hoạt động như danh từ, cần な trước danh từ, だ/です làm hệ từ (静かな部屋 "căn phòng yên tĩnh", 静かです "[nó] yên tĩnh").</p>
<h3>Cấu tạo từ: từ ghép (複合語)</h3>
<p>Hai từ tự do ghép lại thành một, thường kèm biến âm (連濁, rendaku — phụ âm đầu của yếu tố thứ hai hữu thanh hoá):</p>
<ul>
<li>山 (やま, yama) + 登り (のぼり, nobori) → 山登り (やまのぼり, yamanobori) "leo núi" — の của のぼり giữ nguyên, nhưng nhiều từ ghép có hữu thanh hoá: 手 (て, te) + 紙 (かみ, kami) → 手紙 (てがみ, tegami) "lá thư" (かみ→がみ).</li>
</ul>
<h3>Cấu tạo từ: phái sinh (phụ tố)</h3>
<ul>
<li><strong>お/ご + danh từ</strong> (tiền tố kính trọng/lịch sự): お茶 (ocha, "trà"), ご飯 (gohan, "cơm/bữa ăn").</li>
<li><strong>gốc tính từ い + さ</strong> (biến một tính chất thành danh từ đo được): 高い (takai, "cao") → 高さ (takasa, "độ cao"); 楽しい (tanoshii, "vui") → 楽しさ (tanoshisa, "mức độ vui").</li>
<li><strong>gốc tính từ い + み</strong> (danh hoá thiên về cảm nhận chủ quan hơn): 高い → 高み (takami, "chỗ cao, cảm nhận như một độ cao").</li>
</ul>
<div class="callout"><span class="badge">Vì sao phải phân loại</span> Từ loại của một từ quyết định nó chia dạng ra sao và trợ từ nào gắn vào nó — biết 静か là tính từ đuôi な (không phải đuôi い) chính là điều cho bạn biết phải nói 静かな部屋, chứ không phải "静かい部屋" (sai ngữ pháp).</div>`,
  ]]);

const c4q = quiz('jip301-quiz-4', 'Quiz 4 — Word classes|||Quiz 4 — Từ loại', [
  { id: 'q1', question: '静か (shizuka, "yên tĩnh") thuộc từ loại nào?', options: ['形容詞 — tính từ đuôi い', '形容動詞 — tính từ đuôi な', '名詞 thuần tuý, không phải tính từ', '副詞 — phó từ'], correctIndex: 1, explanation: '静か cần な trước danh từ (静かな部屋) nên là tính từ đuôi な (形容動詞), không tự chia như tính từ い.' },
  { id: 'q2', question: '高さ (takasa, "độ cao") được tạo ra bằng cách nào?', options: ['Ghép hai danh từ tự do', 'Thêm phụ tố さ vào gốc tính từ 高い', 'Mượn nguyên một từ tiếng Anh', 'Đảo trật tự âm tiết của 高い'], correctIndex: 1, explanation: 'さ gắn vào gốc tính từ い để danh hoá một tính chất thành đại lượng đo được.' },
  { id: 'q3', question: '手紙 (tegami, "lá thư") từ 手(te)+紙(kami) minh hoạ hiện tượng ngữ âm nào khi ghép từ?', options: ['促音 (âm ngắt)', '連濁 (rendaku, hữu thanh hoá phụ âm đầu)', '長音 (trường âm)', 'Không có biến đổi âm nào'], correctIndex: 1, explanation: 'かみ (kami) trở thành がみ (gami) khi đứng sau 手 — đây là rendaku, biến đổi âm phổ biến trong từ ghép tiếng Nhật.' },
]);

// Chapter 5 — Particles (助詞)
const c5 = doc('jip301-5-1-particles', '5. Particles (助詞): は/が/を/に/で… and their functions|||5. Trợ từ (助詞 は/が/を/に/で...) & chức năng',
  'は đánh dấu chủ đề, が đánh dấu chủ ngữ ngữ pháp/tiêu điểm, を đánh dấu tân ngữ, に/で phân biệt điểm đến-thời gian với địa điểm hành động; と/も/の/か và các trợ từ khác.',
  [[
    `<span class="eyebrow">JIP301 · Chapter 5</span>
<h2>Particles (助詞): は/が/を/に/で… and their functions</h2>
<p>Japanese has (almost) no word order marking grammatical roles by position; instead, small invariable words called <strong>particles (助詞)</strong>, placed right after a noun, mark its role in the sentence.</p>
<h3>は vs が — topic vs subject</h3>
<p>The most-debated pair in Japanese grammar pedagogy. <strong>は (wa)</strong> marks the <em>topic</em> — what the sentence is about, often already known; <strong>が (ga)</strong> marks the grammatical <em>subject</em>, often introducing new information or answering a "who/which" question.</p>
<ul>
<li>私は 学生です。 (Watashi wa gakusei desu.) — "As for me, [I] am a student." (topic: me)</li>
<li>誰が 来ましたか。 (Dare ga kimashita ka.) — "Who came?" — 山田さんが 来ました。(Yamada-san ga kimashita.) "[It was] Yamada-san [who] came." (が highlights the answer as new info)</li>
</ul>
<h3>The core case particles</h3>
<table>
<tr><th>助詞</th><th>Function</th><th>Example</th></tr>
<tr><td>を (o)</td><td>direct object</td><td>本を 読みます。(Hon o yomimasu.) "[I] read a book."</td></tr>
<tr><td>に (ni)</td><td>destination, time point, indirect object</td><td>東京に 行きます。(Tōkyō ni ikimasu.) "[I] go to Tokyo."</td></tr>
<tr><td>で (de)</td><td>location OF AN ACTION, means/instrument</td><td>図書館で 勉強します。(Toshokan de benkyō shimasu.) "[I] study at the library."</td></tr>
<tr><td>と (to)</td><td>"and" (exhaustive list), "with", quoting</td><td>友達と 行きます。(Tomodachi to ikimasu.) "[I] go with a friend."</td></tr>
<tr><td>も (mo)</td><td>"also/too" (replaces は/が/を)</td><td>私も 学生です。(Watashi mo gakusei desu.) "I am also a student."</td></tr>
<tr><td>の (no)</td><td>possessive, nominalizer</td><td>私の 本 (watashi no hon) "my book"</td></tr>
<tr><td>か (ka)</td><td>question marker</td><td>学生ですか。(Gakusei desu ka.) "Are [you] a student?"</td></tr>
</table>
<h3>に vs で — a common confusion</h3>
<p>Both can follow a place, but ask a different question: <strong>に</strong> answers "where does something exist / arrive?" (東京に います, "[I] am in Tokyo"); <strong>で</strong> answers "where does an action happen?" (東京で 働きます, "[I] work in Tokyo").</p>
<div class="callout"><span class="badge">Why particles matter</span> Because word order is flexible in Japanese, the particle — not position — is what tells you who did what to whom. Swap を for が in 猫が 魚を 食べた (the cat ate the fish) and you would need to swap the meaning too.</div>`,
    `<span class="eyebrow">JIP301 · Chương 5</span>
<h2>Trợ từ (助詞): は/が/を/に/で... & chức năng</h2>
<p>Tiếng Nhật (gần như) không dùng vị trí từ để đánh dấu vai ngữ pháp; thay vào đó, những từ nhỏ bất biến gọi là <strong>trợ từ (助詞)</strong>, đặt ngay sau danh từ, đánh dấu vai trò của nó trong câu.</p>
<h3>は so với が — chủ đề so với chủ ngữ</h3>
<p>Cặp trợ từ gây tranh cãi nhiều nhất trong giảng dạy ngữ pháp tiếng Nhật. <strong>は (wa)</strong> đánh dấu <em>chủ đề</em> — câu đang nói về cái gì, thường là thông tin đã biết; <strong>が (ga)</strong> đánh dấu <em>chủ ngữ</em> ngữ pháp, thường giới thiệu thông tin mới hoặc trả lời câu hỏi "ai/cái nào".</p>
<ul>
<li>私は 学生です。 (Watashi wa gakusei desu.) — "Còn tôi thì là học sinh." (chủ đề: tôi)</li>
<li>誰が 来ましたか。 (Dare ga kimashita ka.) — "Ai đã đến?" — 山田さんが 来ました。(Yamada-san ga kimashita.) "[Người đến] là anh Yamada." (が nêu bật câu trả lời là thông tin mới)</li>
</ul>
<h3>Các trợ từ cách (case particle) cốt lõi</h3>
<table>
<tr><th>助詞</th><th>Chức năng</th><th>Ví dụ</th></tr>
<tr><td>を (o)</td><td>tân ngữ trực tiếp</td><td>本を 読みます。(Hon o yomimasu.) "[Tôi] đọc sách."</td></tr>
<tr><td>に (ni)</td><td>điểm đến, mốc thời gian, tân ngữ gián tiếp</td><td>東京に 行きます。(Tōkyō ni ikimasu.) "[Tôi] đi Tokyo."</td></tr>
<tr><td>で (de)</td><td>ĐỊA ĐIỂM XẢY RA hành động, phương tiện/công cụ</td><td>図書館で 勉強します。(Toshokan de benkyō shimasu.) "[Tôi] học ở thư viện."</td></tr>
<tr><td>と (to)</td><td>"và" (liệt kê đầy đủ), "cùng với", trích dẫn</td><td>友達と 行きます。(Tomodachi to ikimasu.) "[Tôi] đi cùng bạn."</td></tr>
<tr><td>も (mo)</td><td>"cũng" (thay thế は/が/を)</td><td>私も 学生です。(Watashi mo gakusei desu.) "Tôi cũng là học sinh."</td></tr>
<tr><td>の (no)</td><td>sở hữu, danh hoá</td><td>私の 本 (watashi no hon) "sách của tôi"</td></tr>
<tr><td>か (ka)</td><td>đánh dấu câu hỏi</td><td>学生ですか。(Gakusei desu ka.) "[Bạn] là học sinh à?"</td></tr>
</table>
<h3>に so với で — nhầm lẫn phổ biến</h3>
<p>Cả hai đều có thể đứng sau một địa điểm, nhưng hỏi hai câu khác nhau: <strong>に</strong> trả lời "cái gì tồn tại/đến ở đâu?" (東京に います, "[tôi] đang ở Tokyo"); <strong>で</strong> trả lời "hành động xảy ra ở đâu?" (東京で 働きます, "[tôi] làm việc ở Tokyo").</p>
<div class="callout"><span class="badge">Vì sao trợ từ quan trọng</span> Vì trật tự từ trong tiếng Nhật khá linh hoạt, chính trợ từ — chứ không phải vị trí — cho biết ai làm gì với ai. Đổi を thành が trong 猫が 魚を 食べた (con mèo ăn con cá) là đổi luôn cả nghĩa của câu.</div>`,
  ]]);

const c5q = quiz('jip301-quiz-5', 'Quiz 5 — Particles|||Quiz 5 — Trợ từ', [
  { id: 'q1', question: 'Trong 私は学生です, trợ từ は đóng vai trò gì?', options: ['Đánh dấu tân ngữ trực tiếp', 'Đánh dấu chủ đề của câu', 'Đánh dấu địa điểm hành động', 'Đánh dấu câu hỏi'], correctIndex: 1, explanation: 'は đánh dấu chủ đề — điều câu đang nói về, thường là thông tin đã biết.' },
  { id: 'q2', question: 'Khác biệt chính giữa に và で khi theo sau một địa điểm là gì?', options: ['Không khác gì, dùng thay nhau tự do', 'に = nơi tồn tại/điểm đến; で = nơi hành động xảy ra', 'に dùng cho người, で dùng cho vật', 'に là trợ từ hỏi, で là trợ từ khẳng định'], correctIndex: 1, explanation: '東京に います (tồn tại/đến) khác 東京で 働きます (nơi hành động diễn ra).' },
  { id: 'q3', question: 'Câu 山田さんが来ました (trả lời "ai đã đến?") dùng が vì lý do gì?', options: ['が luôn bắt buộc sau tên người', 'が nêu bật thông tin mới, trả lời trực tiếp câu hỏi ai/cái nào', 'が là dạng lịch sự của は', 'が đánh dấu tân ngữ gián tiếp'], correctIndex: 1, explanation: 'が đánh dấu chủ ngữ ngữ pháp và thường xuất hiện khi trả lời câu hỏi nêu thông tin mới.' },
]);

// Chapter 6 — Verb & adjective conjugation (活用)
const c6 = doc('jip301-6-1-conjugation', '6. Verbs, adjectives & conjugation (活用): dictionary/ます/て/た forms|||6. Động từ, tính từ & chia dạng (活用, thể ます/て/た)',
  '3 nhóm động từ Godan/Ichidan/bất quy tắc; các thể chính từ điển/ます/て/た/ない; chia tính từ đuôi い và đuôi な.',
  [[
    `<span class="eyebrow">JIP301 · Chapter 6</span>
<h2>Verbs, adjectives &amp; conjugation (活用, katsuyō)</h2>
<h3>Three verb groups</h3>
<table>
<tr><th>Group</th><th>Also called</th><th>Pattern</th><th>Example</th></tr>
<tr><td>Group I</td><td>五段 (Godan, "u-verbs")</td><td>stem ends in any vowel + u; conjugates across all 5 vowel rows</td><td>書く (kaku, "to write") → 書きます, 書いて, 書いた</td></tr>
<tr><td>Group II</td><td>一段 (Ichidan, "ru-verbs")</td><td>stem ends in i/e + る; just drop る</td><td>食べる (taberu, "to eat") → 食べます, 食べて, 食べた</td></tr>
<tr><td>Group III</td><td>不規則 (irregular)</td><td>only two verbs, each unique</td><td>する (suru, "to do") → します; 来る (kuru, "to come") → 来ます (kimasu)</td></tr>
</table>
<h3>The key conjugated forms</h3>
<ul>
<li><strong>辞書形 (dictionary form)</strong> — the citation form, also plain non-past: 書く, 食べる, する, 来る.</li>
<li><strong>ます形 (masu-form)</strong> — the polite non-past, used in teineigo: 書きます, 食べます, します, 来ます.</li>
<li><strong>て形 (te-form)</strong> — links clauses, makes requests (〜てください), progressive (〜ている): 書いて, 食べて, して, 来て.</li>
<li><strong>た形 (ta-form)</strong> — the plain past, same sound changes as て-form: 書いた, 食べた, した, 来た.</li>
<li><strong>ない形 (nai-form)</strong> — plain negative: 書かない, 食べない, しない, 来ない (こない).</li>
</ul>
<pre><code>Group I sound changes into te/ta (音便, onbin):
  く → いて/いた   (書く -> 書いて/書いた)
  す → して/した   (話す -> 話して/話した)
  う/つ/る → って/った  (買う/待つ/取る -> 買って/待って/取って)
  ぬ/ぶ/む → んで/んだ  (死ぬ/遊ぶ/読む -> 死んで/遊んで/読んで)
</code></pre>
<h3>Adjective conjugation</h3>
<p><strong>い-adjective</strong> (drop い, add ending): 高い (takai) → 高くない (not) → 高かった (was) → 高くなかった (was not).<br><strong>な-adjective</strong> (use だ/です like a noun): 静か(な) → 静かではない (not) → 静かだった (was) → 静かではなかった (was not).</p>
<div class="callout"><span class="badge">Why conjugation is systematic</span> Once a verb's group is known, every form is fully predictable from its stem — this is why the grammar-reference habit of tagging a verb "Group I/II/III" (rather than memorizing each conjugated form separately) is the efficient way to learn it.</div>`,
    `<span class="eyebrow">JIP301 · Chương 6</span>
<h2>Động từ, tính từ &amp; chia dạng (活用, katsuyō)</h2>
<h3>Ba nhóm động từ</h3>
<table>
<tr><th>Nhóm</th><th>Tên khác</th><th>Quy tắc</th><th>Ví dụ</th></tr>
<tr><td>Nhóm I</td><td>五段 (Godan, "động từ u")</td><td>gốc kết thúc bằng bất kỳ nguyên âm + u; chia trên cả 5 hàng nguyên âm</td><td>書く (kaku, "viết") → 書きます, 書いて, 書いた</td></tr>
<tr><td>Nhóm II</td><td>一段 (Ichidan, "động từ ru")</td><td>gốc kết thúc bằng i/e + る; chỉ cần bỏ る</td><td>食べる (taberu, "ăn") → 食べます, 食べて, 食べた</td></tr>
<tr><td>Nhóm III</td><td>不規則 (bất quy tắc)</td><td>chỉ có hai động từ, mỗi cái một kiểu riêng</td><td>する (suru, "làm") → します; 来る (kuru, "đến") → 来ます (kimasu)</td></tr>
</table>
<h3>Các thể chia chính</h3>
<ul>
<li><strong>辞書形 (thể từ điển)</strong> — dạng gốc dùng để tra từ, cũng là thể thường thì hiện tại/tương lai: 書く, 食べる, する, 来る.</li>
<li><strong>ます形 (thể ます)</strong> — lịch sự, thì hiện tại/tương lai, dùng trong 丁寧語: 書きます, 食べます, します, 来ます.</li>
<li><strong>て形 (thể て)</strong> — nối mệnh đề, dùng để nhờ vả (〜てください), diễn tả tiếp diễn (〜ている): 書いて, 食べて, して, 来て.</li>
<li><strong>た形 (thể た)</strong> — thì quá khứ thường, cùng quy luật biến âm với thể て: 書いた, 食べた, した, 来た.</li>
<li><strong>ない形 (thể ない)</strong> — phủ định thường: 書かない, 食べない, しない, 来ない (こない).</li>
</ul>
<pre><code>Biến âm khi chia て/た ở Nhóm I (音便, onbin):
  く → いて/いた   (書く -> 書いて/書いた)
  す → して/した   (話す -> 話して/話した)
  う/つ/る → って/った  (買う/待つ/取る -> 買って/待って/取って)
  ぬ/ぶ/む → んで/んだ  (死ぬ/遊ぶ/読む -> 死んで/遊んで/読んで)
</code></pre>
<h3>Chia tính từ</h3>
<p><strong>Tính từ đuôi い</strong> (bỏ い, thêm đuôi): 高い (takai) → 高くない (không) → 高かった (đã) → 高くなかった (đã không).<br><strong>Tính từ đuôi な</strong> (dùng だ/です như danh từ): 静か(な) → 静かではない (không) → 静かだった (đã) → 静かではなかった (đã không).</p>
<div class="callout"><span class="badge">Vì sao chia dạng có hệ thống</span> Một khi biết nhóm của động từ, mọi thể đều suy ra được từ gốc — đây là lý do thói quen của giáo trình tham khảo gắn nhãn động từ "Nhóm I/II/III" (thay vì học thuộc từng thể riêng lẻ) là cách học hiệu quả.</div>`,
  ]]);

const c6q = quiz('jip301-quiz-6', 'Quiz 6 — Conjugation|||Quiz 6 — Chia dạng', [
  { id: 'q1', question: '食べる (taberu, "ăn") thuộc nhóm động từ nào?', options: ['Nhóm I (Godan)', 'Nhóm II (Ichidan)', 'Nhóm III (bất quy tắc)', 'Không thuộc nhóm nào'], correctIndex: 1, explanation: '食べる kết thúc bằng え+る (Ichidan) nên chỉ cần bỏ る để chia: 食べます, 食べて, 食べた.' },
  { id: 'q2', question: '書く (kaku, "viết") chia sang thể て đúng là?', options: ['書いて', '書て', '書きて', '書って'], correctIndex: 0, explanation: 'Động từ Nhóm I kết thúc く biến âm く→いて khi chia thể て/た (音便).' },
  { id: 'q3', question: 'Tính từ đuôi な như 静か chia phủ định thì quá khứ ("đã không yên tĩnh") đúng là?', options: ['静かくなかった', '静かではなかった', '静かじゃかった', '静かいなかった'], correctIndex: 1, explanation: 'Tính từ đuôi な dùng だ/です như danh từ; phủ định quá khứ là ではなかった (hoặc じゃなかった).' },
]);

// Chapter 7 — Honorifics (敬語)
const c7 = doc('jip301-7-1-keigo', '7. Honorific speech (敬語): respectful, humble & polite forms|||7. Kính ngữ (敬語: 尊敬語/謙譲語/丁寧語)',
  '敬語 chia 3 tầng: 丁寧語 (lịch sự, です/ます), 尊敬語 (kính trọng, nâng người nghe/chủ ngữ), 謙譲語 (khiêm nhường, hạ người nói); động từ đặc biệt cho mỗi tầng.',
  [[
    `<span class="eyebrow">JIP301 · Chapter 7</span>
<h2>Honorific speech (敬語, keigo)</h2>
<p>敬語 encodes social relationship directly into grammar: who is speaking, who is being spoken about, and their relative status all change the verb form — not just word choice.</p>
<h3>The three layers</h3>
<table>
<tr><th>Layer</th><th>What it does</th><th>Example verb (from 食べる/行く)</th></tr>
<tr><td>丁寧語 (teineigo)</td><td>Polite form — です/ます; makes speech generally polite without raising/lowering anyone</td><td>食べます (tabemasu), 行きます (ikimasu)</td></tr>
<tr><td>尊敬語 (sonkeigo)</td><td>Respectful form — elevates the LISTENER or the person being talked ABOUT (never the speaker)</td><td>召し上がります (meshiagarimasu, "to eat" — respectful); いらっしゃいます (irasshaimasu, "to go/come/be" — respectful)</td></tr>
<tr><td>謙譲語 (kenjōgo)</td><td>Humble form — lowers the SPEAKER (or the speaker's in-group) to indirectly show respect to the listener</td><td>いただきます (itadakimasu, "to eat/receive" — humble); 参ります (mairimasu, "to go/come" — humble)</td></tr>
</table>
<h3>One verb, three faces</h3>
<pre><code>食べる (taberu, plain "to eat")
  丁寧語: 食べます          -> polite, neutral
  尊敬語: 召し上がります     -> "you (honored) eat" / a superior eats
  謙譲語: いただきます       -> "I (humbly) eat" / to receive
</code></pre>
<h3>Two building patterns (when there is no special verb)</h3>
<ul>
<li><strong>Sonkeigo pattern:</strong> お + ます-stem + になる — お読みになる (o-yomi ni naru, "[you/they, respected] read").</li>
<li><strong>Kenjōgo pattern:</strong> お + ます-stem + する — お持ちする (o-mochi suru, "[I, humbly] carry [it for you]").</li>
</ul>
<div class="callout"><span class="badge">The direction rule</span> Sonkeigo points UP (raises someone else); kenjōgo points DOWN (lowers the speaker). Mixing them up — e.g. using いただきます about what a customer does — is a classic beginner mistake because it accidentally lowers the person you meant to honor.</div>`,
    `<span class="eyebrow">JIP301 · Chương 7</span>
<h2>Kính ngữ (敬語, keigo)</h2>
<p>敬語 mã hoá quan hệ xã hội trực tiếp vào ngữ pháp: ai đang nói, đang nói về ai, và địa vị tương đối của họ đều làm đổi thể động từ — chứ không chỉ đổi từ vựng.</p>
<h3>Ba tầng kính ngữ</h3>
<table>
<tr><th>Tầng</th><th>Chức năng</th><th>Ví dụ (từ 食べる/行く)</th></tr>
<tr><td>丁寧語 (teineigo)</td><td>Thể lịch sự — です/ます; làm lời nói lịch sự chung mà không nâng/hạ ai</td><td>食べます (tabemasu), 行きます (ikimasu)</td></tr>
<tr><td>尊敬語 (sonkeigo)</td><td>Thể kính trọng — nâng NGƯỜI NGHE hoặc người ĐƯỢC nói tới (không bao giờ nâng người nói)</td><td>召し上がります (meshiagarimasu, "ăn" — kính trọng); いらっしゃいます (irasshaimasu, "đi/đến/ở" — kính trọng)</td></tr>
<tr><td>謙譲語 (kenjōgo)</td><td>Thể khiêm nhường — hạ NGƯỜI NÓI (hoặc nhóm của người nói) để gián tiếp tỏ kính trọng người nghe</td><td>いただきます (itadakimasu, "ăn/nhận" — khiêm nhường); 参ります (mairimasu, "đi/đến" — khiêm nhường)</td></tr>
</table>
<h3>Một động từ, ba gương mặt</h3>
<pre><code>食べる (taberu, thể thường "ăn")
  丁寧語: 食べます          -> lịch sự, trung tính
  尊敬語: 召し上がります     -> "ngài/anh (được kính trọng) ăn" / người trên ăn
  謙譲語: いただきます       -> "tôi (khiêm nhường) ăn" / nhận lấy
</code></pre>
<h3>Hai mẫu dựng sẵn (khi không có động từ đặc biệt)</h3>
<ul>
<li><strong>Mẫu sonkeigo:</strong> お + gốc ます + になる — お読みになる (o-yomi ni naru, "[ngài/họ, được kính trọng] đọc").</li>
<li><strong>Mẫu kenjōgo:</strong> お + gốc ます + する — お持ちする (o-mochi suru, "[tôi, khiêm nhường] mang [giúp]").</li>
</ul>
<div class="callout"><span class="badge">Quy tắc hướng</span> Sonkeigo hướng LÊN (nâng người khác); kenjōgo hướng XUỐNG (hạ chính người nói). Lẫn lộn hai chiều — vd dùng いただきます để nói về việc khách hàng ăn — là lỗi kinh điển của người mới vì vô tình hạ đúng người mình định kính trọng.</div>`,
  ]]);

const c7q = quiz('jip301-quiz-7', 'Quiz 7 — Honorifics|||Quiz 7 — Kính ngữ', [
  { id: 'q1', question: '召し上がります (meshiagarimasu, "ăn") thuộc tầng kính ngữ nào?', options: ['丁寧語 (lịch sự trung tính)', '尊敬語 (kính trọng, nâng người khác)', '謙譲語 (khiêm nhường, hạ người nói)', 'Không thuộc kính ngữ, là từ thường'], correctIndex: 1, explanation: '召し上がります là động từ kính trọng đặc biệt của 食べる, dùng để nâng người nghe hoặc người được nói tới.' },
  { id: 'q2', question: 'いただきます (itadakimasu) hạ ai để gián tiếp tỏ kính trọng?', options: ['Hạ người nghe', 'Hạ người nói (hoặc nhóm của người nói)', 'Hạ cả hai bên', 'Không hạ ai, chỉ là lịch sự trung tính'], correctIndex: 1, explanation: '謙譲語 (kenjōgo) hướng xuống — hạ thấp người nói để tỏ kính trọng người nghe một cách gián tiếp.' },
  { id: 'q3', question: 'Mẫu お + gốc ます + になる dùng để tạo thể nào?', options: ['丁寧語', '尊敬語 (sonkeigo)', '謙譲語 (kenjōgo)', 'Thể phủ định thường'], correctIndex: 1, explanation: 'お...になる là mẫu dựng sonkeigo khi động từ không có dạng kính trọng đặc biệt riêng.' },
]);

// Chapter 8 — Sentence syntax, clauses & review
const c8 = doc('jip301-8-1-syntax-review', '8. Sentence syntax, clauses & theory-to-practice review|||8. Cú pháp câu, mệnh đề & ôn tập lý thuyết-thực tiễn',
  'Trật tự SOV, vị ngữ luôn ở cuối; mệnh đề bổ nghĩa đứng TRƯỚC danh từ (không có đại từ quan hệ); câu ghép/câu phức với から/けど/thể て; ôn lại 7 chương qua một câu thật.',
  [[
    `<span class="eyebrow">JIP301 · Chapter 8</span>
<h2>Sentence syntax, clauses &amp; theory-to-practice review</h2>
<h3>Basic word order: SOV, predicate-final</h3>
<p>Japanese is a <strong>Subject-Object-Verb (SOV)</strong> language, and — more importantly than the S/O order, which can shuffle thanks to particles (Chapter 5) — the <strong>predicate (verb/adjective) is always last</strong>. Everything else can move around it; the sentence only "closes" once you hear the final verb, which is why listening comprehension in Japanese means waiting for the end.</p>
<pre><code>私は  昨日  図書館で  本を  読みました。
watashi wa  kinō     toshokan de  hon o   yomimashita
"I"       "yesterday" "at the library" "a book" "read (past, polite)"
-> "Yesterday, I read a book at the library."</code></pre>
<h3>Modifying clauses precede the noun — no relative pronoun</h3>
<p>Unlike English ("the book <em>that</em> I bought"), Japanese has no relative pronoun; an entire clause simply sits, in plain form, directly BEFORE the noun it modifies:</p>
<ul>
<li>昨日 買った 本 (kinō katta hon) — literally "yesterday bought book" = "the book [that I] bought yesterday".</li>
<li>日本語を 勉強している 学生 (nihongo o benkyō shite iru gakusei) — "a student who is studying Japanese".</li>
</ul>
<h3>Linking clauses: から, けど/が, て-form</h3>
<ul>
<li><strong>から (kara)</strong> — "because": 疲れましたから、休みます。(Tsukaremashita kara, yasumimasu.) "Because [I] got tired, [I]'ll rest."</li>
<li><strong>けど / が</strong> — "but": 高いですが、買います。(Takai desu ga, kaimasu.) "It's expensive, but [I]'ll buy [it]."</li>
<li><strong>て-form</strong> — chains actions/states in sequence: 朝起きて、朝ごはんを食べて、学校に行きます。(Asa okite, asagohan o tabete, gakkō ni ikimasu.) "[I] wake up, eat breakfast, and go to school."</li>
</ul>
<h3>Putting all 7 chapters into one sentence</h3>
<pre><code>おばあさんは  静かな  図書館で  読みたかった  本を  お読みになりました。

- おばあさん: chōon (Ch.1) + kanji read as native word (Ch.2) + wago (Ch.3)
- 静かな: な-adjective (Ch.4) modifying a following noun
- 図書館で: kango noun (Ch.3) + place-of-action particle で (Ch.5)
- 読みたかった: Group I verb 読む, ta-form of the desiderative (Ch.6), inside a modifying clause (Ch.8)
- 本を: object particle を (Ch.5)
- お読みになりました: sonkeigo pattern お...になる, past polite (Ch.7)

"[My honored] grandmother read the book at the quiet library that she had wanted to read."</code></pre>
<div class="callout"><span class="badge">Theory to practice</span> That single sentence uses every chapter of this course at once — mora length, kanji reading, vocabulary layer, adjective class, particle choice, verb conjugation and honorific register. That is the point of a theory course: once you can decompose a sentence like this, you can also build one.</div>`,
    `<span class="eyebrow">JIP301 · Chương 8</span>
<h2>Cú pháp câu, mệnh đề &amp; ôn tập lý thuyết-thực tiễn</h2>
<h3>Trật tự cơ bản: SOV, vị ngữ ở cuối</h3>
<p>Tiếng Nhật là ngôn ngữ <strong>Chủ ngữ-Tân ngữ-Động từ (SOV)</strong>, và — quan trọng hơn cả thứ tự S/O, vốn có thể xáo trộn nhờ trợ từ (Chương 5) — <strong>vị ngữ (động từ/tính từ) luôn đứng cuối cùng</strong>. Mọi thứ khác có thể di chuyển quanh nó; câu chỉ "đóng" lại khi nghe tới động từ cuối, đây là lý do nghe hiểu tiếng Nhật nghĩa là phải chờ đến hết câu.</p>
<pre><code>私は  昨日  図書館で  本を  読みました。
watashi wa  kinō     toshokan de  hon o   yomimashita
"tôi"      "hôm qua"   "ở thư viện"  "một cuốn sách"  "đã đọc (quá khứ, lịch sự)"
-> "Hôm qua tôi đã đọc sách ở thư viện."</code></pre>
<h3>Mệnh đề bổ nghĩa đứng TRƯỚC danh từ — không có đại từ quan hệ</h3>
<p>Khác tiếng Việt/Anh ("cuốn sách <em>mà</em> tôi mua"), tiếng Nhật không có đại từ quan hệ; cả một mệnh đề, ở thể thường, đơn giản đứng ngay TRƯỚC danh từ nó bổ nghĩa:</p>
<ul>
<li>昨日 買った 本 (kinō katta hon) — nghĩa đen "hôm qua mua sách" = "cuốn sách [mà tôi] đã mua hôm qua".</li>
<li>日本語を 勉強している 学生 (nihongo o benkyō shite iru gakusei) — "sinh viên đang học tiếng Nhật".</li>
</ul>
<h3>Nối mệnh đề: から, けど/が, thể て</h3>
<ul>
<li><strong>から (kara)</strong> — "vì": 疲れましたから、休みます。(Tsukaremashita kara, yasumimasu.) "Vì [tôi] mệt rồi nên [tôi] sẽ nghỉ."</li>
<li><strong>けど / が</strong> — "nhưng": 高いですが、買います。(Takai desu ga, kaimasu.) "Nó đắt, nhưng [tôi] sẽ mua."</li>
<li><strong>thể て</strong> — nối liên tiếp các hành động/trạng thái: 朝起きて、朝ごはんを食べて、学校に行きます。(Asa okite, asagohan o tabete, gakkō ni ikimasu.) "[Tôi] thức dậy, ăn sáng, rồi đi học."</li>
</ul>
<h3>Gom cả 7 chương vào một câu</h3>
<pre><code>おばあさんは  静かな  図書館で  読みたかった  本を  お読みになりました。

- おばあさん: trường âm (Ch.1) + kanji đọc kiểu thuần Nhật (Ch.2) + 和語 (Ch.3)
- 静かな: tính từ đuôi な (Ch.4) bổ nghĩa cho danh từ phía sau
- 図書館で: danh từ 漢語 (Ch.3) + trợ từ nơi-xảy-ra-hành-động で (Ch.5)
- 読みたかった: động từ Nhóm I 読む, thể た của dạng mong muốn (Ch.6), nằm trong mệnh đề bổ nghĩa (Ch.8)
- 本を: trợ từ tân ngữ を (Ch.5)
- お読みになりました: mẫu sonkeigo お...になる, quá khứ lịch sự (Ch.7)

"[Bà tôi, được kính trọng] đã đọc cuốn sách mà bà muốn đọc, ở thư viện yên tĩnh."</code></pre>
<div class="callout"><span class="badge">Từ lý thuyết đến thực tiễn</span> Chỉ một câu đó đã dùng cả 8 chương của môn cùng lúc — độ dài mora, cách đọc kanji, lớp từ vựng, loại tính từ, chọn trợ từ, chia động từ và mức kính ngữ. Đó chính là mục đích của một môn lý thuyết: khi đã phân tích được một câu như vậy, bạn cũng dựng được một câu như vậy.</div>`,
  ]]);

const c8q = quiz('jip301-quiz-8', 'Quiz 8 — Syntax & review|||Quiz 8 — Cú pháp & ôn tập', [
  { id: 'q1', question: 'Đặc điểm cú pháp cố định nhất của câu tiếng Nhật là gì?', options: ['Chủ ngữ luôn đứng đầu câu', 'Vị ngữ (động từ/tính từ) luôn đứng cuối câu', 'Tân ngữ luôn đứng đầu câu', 'Trợ từ luôn đứng đầu câu'], correctIndex: 1, explanation: 'Tiếng Nhật là SOV và quan trọng nhất: vị ngữ luôn ở cuối, các thành phần khác có thể xê dịch nhờ trợ từ.' },
  { id: 'q2', question: 'Cụm 昨日買った本 ("cuốn sách mà tôi mua hôm qua") cho thấy điều gì về mệnh đề bổ nghĩa trong tiếng Nhật?', options: ['Cần đại từ quan hệ như tiếng Anh "that/which"', 'Mệnh đề bổ nghĩa (thể thường) đứng TRƯỚC danh từ, không cần đại từ quan hệ', 'Mệnh đề bổ nghĩa luôn đứng SAU danh từ', 'Không thể bổ nghĩa cho danh từ bằng một mệnh đề'], correctIndex: 1, explanation: 'Tiếng Nhật không có đại từ quan hệ; cả mệnh đề ở thể thường đứng ngay trước danh từ nó bổ nghĩa.' },
  { id: 'q3', question: 'Trợ từ から trong 疲れましたから、休みます dùng để làm gì?', options: ['Đánh dấu tân ngữ', 'Nối hai mệnh đề theo quan hệ nguyên nhân ("vì")', 'Đánh dấu câu hỏi', 'Đánh dấu mức kính ngữ'], correctIndex: 1, explanation: 'から nối mệnh đề lý do với mệnh đề kết quả, tương đương "vì/bởi vì" trong tiếng Việt.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'JIP301',
    slug: 'jip301-nhung-van-e-co-ban-ve-ngu-am-tu-vung-ngu-phap-tu-ly-thuyet-en-thuc-tien',
    title: 'Những vấn đề cơ bản về Ngữ âm, từ vựng & ngữ pháp - Từ lý thuyết đến thực tiễn',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JIP301.webp',
    shortDescription: 'Why Japanese sounds, scripts, vocabulary & grammar work: mora & pitch accent, hiragana/katakana/kanji, native/Sino/loan vocabulary, word classes, particles, conjugation, keigo, sentence syntax. Bilingual, real Japanese examples, quizzes.|||Vì sao ngữ âm, chữ viết, từ vựng & ngữ pháp tiếng Nhật vận hành như vậy: mora & trọng âm, hiragana/katakana/kanji, từ thuần/Hán/ngoại lai, từ loại, trợ từ, chia động từ, kính ngữ, cú pháp câu. Song ngữ, ví dụ tiếng Nhật thật, có quiz.',
    description: 'Môn <strong>JIP301 — Những vấn đề cơ bản về Ngữ âm, Từ vựng &amp; Ngữ pháp tiếng Nhật</strong> (kỳ 5, ngành Ngôn ngữ Nhật) là môn <strong>lý thuyết</strong>, giải thích <em>vì sao</em> tiếng Nhật vận hành như vậy, không chỉ dạy dùng mẫu câu. 8 chương chia 3 phần: <strong>Ngữ âm</strong> (mora, trường âm, trọng âm アクセント; hiragana/katakana/kanji, âm On/Kun) → <strong>Từ vựng</strong> (和語/漢語/外来語, từ loại 品詞 &amp; cấu tạo từ) → <strong>Ngữ pháp</strong> (trợ từ 助詞, chia động từ/tính từ 活用, kính ngữ 敬語, cú pháp câu). Trích dẫn giáo trình tham khảo (日本語の文法, A Dictionary of Basic Japanese Grammar, 現代日本語), giảng tiếng Việt kèm thuật ngữ tiếng Anh, mọi lý thuyết đều minh hoạ bằng ví dụ tiếng Nhật thật (kana/kanji + romaji + nghĩa), có quiz mỗi chương.',
    whatYouLearn: 'Mora & trường âm 長音/促音/撥音; trọng âm cao-thấp アクセント (橋/箸/端); hiragana/katakana/kanji, âm On (音読み) & âm Kun (訓読み), okurigana; 3 lớp từ vựng 和語/漢語/外来語 & từ lai 混種語; 9 từ loại 品詞 & cấu tạo từ (ghép, phụ tố さ/み); trợ từ は/が/を/に/で/と/も/の/か; 3 nhóm động từ & các thể từ điển/ます/て/た/ない, chia tính từ い/な; kính ngữ 丁寧語/尊敬語/謙譲語; trật tự câu SOV, mệnh đề bổ nghĩa, câu ghép から/けど/て.',
    requirements: 'Đã học qua các môn tiếng Nhật sơ-trung cấp (JPD1xx/2xx) để có vốn từ và ngữ pháp nền làm ví dụ. Không cần biết thuật ngữ ngôn ngữ học trước — mọi khái niệm được giải thích lại từ đầu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình tham khảo (trích dẫn), từ điển, công cụ tra kanji/accent, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: '3 phần 8 chương: ngữ âm → chữ viết & từ vựng → ngữ pháp.', lessons: [intro] },
    { title: 'Chương 1 — Hệ thống ngữ âm|||Chapter 1 — Sound system', description: 'Mora, trường âm, âm ngắt, trọng âm アクセント.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chữ viết|||Chapter 2 — Writing system', description: 'Hiragana, katakana, kanji, âm On/Kun, okurigana.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Lớp từ vựng|||Chapter 3 — Vocabulary layers', description: '和語/漢語/外来語 & từ lai 混種語.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Từ loại & cấu tạo từ|||Chapter 4 — Word classes', description: '9 từ loại 品詞, từ ghép, phái sinh bằng phụ tố.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Trợ từ|||Chapter 5 — Particles', description: 'は/が/を/に/で/と/も/の/か & chức năng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chia động từ & tính từ|||Chapter 6 — Conjugation', description: '3 nhóm động từ, thể từ điển/ます/て/た/ない, chia tính từ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Kính ngữ|||Chapter 7 — Honorifics', description: '丁寧語/尊敬語/謙譲語 & động từ đặc biệt.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Cú pháp & ôn tập|||Chapter 8 — Syntax & review', description: 'Trật tự SOV, mệnh đề bổ nghĩa, câu ghép, ôn 7 chương.', lessons: [c8, c8q] },
  ],
};
