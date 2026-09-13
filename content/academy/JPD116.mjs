/**
 * JPD116 — Elementary Japanese 1 (Tiếng Nhật sơ cấp 1, A1/A2). Khối Ngôn ngữ
 * Nhật FPTU, Kỳ 1. MÔN NGÔN NGỮ: cấu trúc bài học tiếng (từ vựng, ngữ pháp,
 * hội thoại, luyện tập), trình độ JLPT N5 nhập môn. Bám giáo trình chuẩn
 * みんなの日本語 Minna no Nihongo I / Genki I.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML;
 * "&"→&amp; trong content HTML; helper doc .join('\n') ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức bài học.', quiz: { timeLimitSeconds: 300, questions } });

const taiLieu = doc('jpd116-0-0-tai-lieu', '📚 Materials & references|||📚 Tài liệu & lộ trình học',
  'Trung tâm tài liệu: giáo trình (Minna no Nihongo I, Genki I), app (Anki/Migii/Bunpro), từ điển jisho.org, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">JPD116 · Materials</span>
<h2>Materials &amp; resource hub</h2>
<p class="lead">Everything to start <strong>Elementary Japanese</strong> — the two kana scripts, core N5 grammar and everyday conversation — in one place. The official FPTU slides &amp; textbook live on <strong>FLM</strong>; below are trusted study resources.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><strong>みんなの日本語 初級 I</strong> (Minna no Nihongo I) — the standard beginner course; each of this course's lessons maps to its early units.</li>
<li><strong>Genki I</strong> — a friendly English-language beginner textbook, great for self-study.</li>
</ul>
<h3>🌐 Dictionary &amp; grammar</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — the best free Japanese-English dictionary (kanji, readings, examples).</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — grammar SRS ordered by JLPT level (N5 first).</li>
</ul>
<h3>🃏 Apps for drilling</h3>
<ul>
<li><strong>Anki</strong> — spaced-repetition flashcards for kana, vocab and kanji.</li>
<li><strong>Migii JLPT</strong> — mock tests and vocab by level, popular in Vietnam.</li>
</ul>
<div class="callout"><span class="badge">4-step self-study path</span>
<ol>
<li><strong>Kana first</strong> — read &amp; write all ひらがな and カタカナ before anything else.</li>
<li><strong>Core N5 grammar</strong> — です, は/を/に/で particles, ます-form verbs, い/な adjectives.</li>
<li><strong>Speak daily</strong> — greetings, self-intro, numbers, time, shopping and inviting.</li>
<li><strong>Test-ready</strong> — drill vocab with Anki, take N5 mock tests on Migii.</li>
</ol></div>`,
    `<span class="eyebrow">JPD116 · Tài liệu</span>
<h2>Trung tâm tài liệu &amp; lộ trình</h2>
<p class="lead">Mọi thứ để bắt đầu <strong>tiếng Nhật sơ cấp</strong> — hai bộ chữ kana, ngữ pháp lõi N5 và hội thoại hằng ngày — gom về một chỗ. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn học đáng tin.</p>
<h3>📘 Giáo trình lõi</h3>
<ul>
<li><strong>みんなの日本語 初級 I</strong> (Minna no Nihongo I) — bộ chuẩn cho người mới; mỗi bài của môn này bám theo các bài đầu của sách.</li>
<li><strong>Genki I</strong> — giáo trình tiếng Anh dễ tiếp cận, hợp tự học.</li>
</ul>
<h3>🌐 Từ điển &amp; ngữ pháp</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — từ điển Nhật-Anh miễn phí tốt nhất (kanji, cách đọc, ví dụ).</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — luyện ngữ pháp theo trình độ JLPT (bắt đầu từ N5).</li>
</ul>
<h3>🃏 App luyện</h3>
<ul>
<li><strong>Anki</strong> — thẻ ghi nhớ lặp lại ngắt quãng cho kana, từ vựng, kanji.</li>
<li><strong>Migii JLPT</strong> — đề thi thử &amp; từ vựng theo trình độ, phổ biến ở Việt Nam.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học 4 bước</span>
<ol>
<li><strong>Kana trước tiên</strong> — đọc &amp; viết thạo toàn bộ ひらがな và カタカナ trước mọi thứ khác.</li>
<li><strong>Ngữ pháp lõi N5</strong> — です, trợ từ は/を/に/で, động từ thể ます, tính từ い/な.</li>
<li><strong>Nói mỗi ngày</strong> — chào hỏi, tự giới thiệu, số, giờ, mua sắm, rủ rê.</li>
<li><strong>Sẵn sàng thi</strong> — luyện từ vựng bằng Anki, làm đề N5 thử trên Migii.</li>
</ol></div>`,
  ]]);

const intro = doc('jpd116-0-1-overview', 'Course overview: Elementary Japanese 1|||Tổng quan: Tiếng Nhật sơ cấp 1',
  'Mục tiêu N5 nhập môn; ba hệ chữ (kana + kanji); cách học tiếng Nhật hiệu quả; lộ trình 8 bài.',
  [[
    `<span class="eyebrow">JPD116 · Lesson 0.1 · Overview</span>
<h2>Elementary Japanese 1 (A1/A2)</h2>
<p class="lead">This course takes you from zero to the foundation of <strong>JLPT N5</strong> — you'll read and write both kana scripts, use the core grammar of everyday Japanese, and hold simple conversations: greetings, self-introduction, numbers, time, places and daily activities.</p>
<h3>Three writing systems</h3>
<ul>
<li><strong>ひらがな (hiragana)</strong> — the rounded script for native Japanese words and grammar; you learn it first.</li>
<li><strong>カタカナ (katakana)</strong> — the angular script for foreign/loanwords (コーヒー kōhī, テレビ terebi).</li>
<li><strong>漢字 (kanji)</strong> — characters borrowed from Chinese; N5 needs only about 100 basic ones.</li>
</ul>
<h3>How to study Japanese</h3>
<p>Master kana before grammar — everything else is built on it. Learn vocabulary in small daily batches with spaced repetition, and always practise <strong>reading aloud</strong> so pronunciation and grammar become automatic.</p>
<h3>Roadmap (8 lessons)</h3>
<p>Kana → greetings &amp; self-intro → これ/それ/あれ → numbers &amp; time → places &amp; existence → verbs → adjectives → going &amp; inviting.</p>`,
    `<span class="eyebrow">JPD116 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Nhật sơ cấp 1 (A1/A2)</h2>
<p class="lead">Môn này đưa bạn từ số 0 tới nền tảng <strong>JLPT N5</strong> — đọc viết được cả hai bộ kana, dùng ngữ pháp lõi của tiếng Nhật hằng ngày, và nói được hội thoại đơn giản: chào hỏi, tự giới thiệu, số, giờ, địa điểm và sinh hoạt.</p>
<h3>Ba hệ chữ viết</h3>
<ul>
<li><strong>ひらがな (hiragana)</strong> — bộ chữ mềm cho từ thuần Nhật và ngữ pháp; học đầu tiên.</li>
<li><strong>カタカナ (katakana)</strong> — bộ chữ góc cạnh cho từ mượn nước ngoài (コーヒー kōhī, テレビ terebi).</li>
<li><strong>漢字 (kanji)</strong> — chữ mượn từ tiếng Hán; N5 chỉ cần khoảng 100 chữ cơ bản.</li>
</ul>
<h3>Cách học tiếng Nhật</h3>
<p>Thạo kana trước ngữ pháp — mọi thứ về sau đều dựng trên nó. Học từ vựng thành từng đợt nhỏ mỗi ngày kèm lặp lại ngắt quãng, và luôn luyện <strong>đọc to</strong> để phát âm và ngữ pháp thành phản xạ.</p>
<h3>Lộ trình (8 bài)</h3>
<p>Kana → chào hỏi &amp; tự giới thiệu → これ/それ/あれ → số &amp; giờ → địa điểm &amp; tồn tại → động từ → tính từ → đi lại &amp; mời rủ.</p>`,
  ]]);

const b1 = doc('jpd116-1-1-kana', 'Lesson 1 — The kana scripts|||Bài 1 — Hệ chữ kana',
  'ひらがな đầy đủ + カタカナ; quy tắc đọc gojūon; âm đục (dakuten), âm ngắt (っ), trường âm, âm ghép.',
  [[
    `<span class="eyebrow">JPD116 · Lesson 1</span>
<h2>The kana scripts — ひらがな &amp; カタカナ</h2>
<h3>Hiragana — the 46 basic sounds (gojūon)</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>reading</th></tr>
<tr><td>あ い う え お</td><td>a i u e o</td><td>the five vowels</td></tr>
<tr><td>か き く け こ</td><td>ka ki ku ke ko</td><td>k-row</td></tr>
<tr><td>さ し す せ そ</td><td>sa shi su se so</td><td>note shi, not si</td></tr>
<tr><td>た ち つ て と</td><td>ta chi tsu te to</td><td>note chi, tsu</td></tr>
<tr><td>な に ぬ ね の</td><td>na ni nu ne no</td><td>n-row</td></tr>
<tr><td>は ひ ふ へ ほ</td><td>ha hi fu he ho</td><td>note fu</td></tr>
<tr><td>ま み む め も</td><td>ma mi mu me mo</td><td>m-row</td></tr>
<tr><td>や ゆ よ</td><td>ya yu yo</td><td>y-row</td></tr>
<tr><td>ら り る れ ろ</td><td>ra ri ru re ro</td><td>r-row (soft, near l)</td></tr>
<tr><td>わ を ん</td><td>wa wo n</td><td>を marks the object; ん is the only final n</td></tr>
</table>
<h3>Voiced &amp; half-voiced sounds</h3>
<p>Two little marks change a sound: <strong>dakuten</strong> ( ゛) voices it — か→が (ka→ga), さ→ざ (sa→za), た→だ (ta→da), は→ば (ha→ba); <strong>handakuten</strong> ( ゜) turns は→ぱ (ha→pa).</p>
<h3>Long vowels, small っ, and ゃゅょ</h3>
<ul>
<li><strong>Long vowel</strong> — held twice as long: おかあさん (okāsan, mother). Katakana uses a bar: コーヒー (kōhī, coffee).</li>
<li><strong>Small っ (sokuon)</strong> — a doubled consonant / short pause: きって (kitte, stamp) vs きて (kite, come).</li>
<li><strong>ゃゅょ (yōon)</strong> — a small y-kana blends the sound: きゃ kya, しゅ shu, ちょ cho.</li>
</ul>
<h3>Katakana — same 46 sounds, angular shapes</h3>
<p>ア a・カ ka・サ sa・タ ta・ナ na・ハ ha・マ ma・ヤ ya・ラ ra・ワ wa・ン n. Used for loanwords: テレビ (terebi, TV), パン (pan, bread).</p>
<div class="callout"><span class="badge">Writing note</span> Stroke order matters — write top-to-bottom, left-to-right. Learn to WRITE each kana, not just recognise it; the muscle memory locks in the shapes.</div>`,
    `<span class="eyebrow">JPD116 · Bài 1</span>
<h2>Hệ chữ kana — ひらがな &amp; カタカナ</h2>
<h3>Hiragana — 46 âm cơ bản (gojūon)</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa/ghi chú</th></tr>
<tr><td>あ い う え お</td><td>a i u e o</td><td>năm nguyên âm</td></tr>
<tr><td>か き く け こ</td><td>ka ki ku ke ko</td><td>hàng k</td></tr>
<tr><td>さ し す せ そ</td><td>sa shi su se so</td><td>đọc "shi", không phải "si"</td></tr>
<tr><td>た ち つ て と</td><td>ta chi tsu te to</td><td>đọc "chi", "tsu"</td></tr>
<tr><td>な に ぬ ね の</td><td>na ni nu ne no</td><td>hàng n</td></tr>
<tr><td>は ひ ふ へ ほ</td><td>ha hi fu he ho</td><td>đọc "fu"</td></tr>
<tr><td>ま み む め も</td><td>ma mi mu me mo</td><td>hàng m</td></tr>
<tr><td>や ゆ よ</td><td>ya yu yo</td><td>hàng y</td></tr>
<tr><td>ら り る れ ろ</td><td>ra ri ru re ro</td><td>hàng r (nhẹ, gần "l")</td></tr>
<tr><td>わ を ん</td><td>wa wo n</td><td>を đánh dấu tân ngữ; ん là "n" cuối duy nhất</td></tr>
</table>
<h3>Âm đục &amp; bán đục</h3>
<p>Hai dấu nhỏ đổi âm: <strong>dakuten</strong> ( ゛) làm âm đục — か→が (ka→ga), さ→ざ (sa→za), た→だ (ta→da), は→ば (ha→ba); <strong>handakuten</strong> ( ゜) biến は→ぱ (ha→pa).</p>
<h3>Trường âm, âm ngắt っ, và ゃゅょ</h3>
<ul>
<li><strong>Trường âm</strong> — kéo dài gấp đôi: おかあさん (okāsan, mẹ). Katakana dùng gạch dài: コーヒー (kōhī, cà phê).</li>
<li><strong>Âm ngắt っ (sokuon)</strong> — nhân đôi phụ âm / ngắt ngắn: きって (kitte, con tem) khác きて (kite, hãy đến).</li>
<li><strong>ゃゅょ (âm ghép)</strong> — kana y nhỏ ghép âm: きゃ kya, しゅ shu, ちょ cho.</li>
</ul>
<h3>Katakana — cùng 46 âm, nét góc cạnh</h3>
<p>ア a・カ ka・サ sa・タ ta・ナ na・ハ ha・マ ma・ヤ ya・ラ ra・ワ wa・ン n. Dùng cho từ mượn: テレビ (terebi, tivi), パン (pan, bánh mì).</p>
<div class="callout"><span class="badge">Ghi chú viết</span> Thứ tự nét quan trọng — viết từ trên xuống, trái sang phải. Hãy tập VIẾT từng chữ chứ không chỉ nhận mặt; trí nhớ cơ bắp sẽ khắc sâu hình chữ.</div>`,
  ]]);

const b1q = quiz('jpd116-quiz-1', 'Quiz 1 — Kana|||Quiz 1 — Chữ kana', [
  { id: 'q1', question: 'Chữ し đọc là gì?|||How is し read?', options: ['si', 'shi', 'chi', 'tsu'], correctIndex: 1, explanation: 'し = "shi" (không phải "si").' },
  { id: 'q2', question: 'Dấu dakuten ( ゛) biến か (ka) thành?|||Dakuten turns か (ka) into?', options: ['が (ga)', 'ぱ (pa)', 'きゃ (kya)', 'か (ka)'], correctIndex: 0, explanation: 'Dakuten làm âm đục: か→が.' },
  { id: 'q3', question: 'Bộ chữ nào dùng cho từ mượn nước ngoài (vd テレビ)?|||Which script is used for loanwords (e.g. テレビ)?', options: ['ひらがな', 'カタカナ', '漢字', 'romaji'], correctIndex: 1, explanation: 'Katakana dùng cho từ mượn/ngoại lai.' },
]);

const b2 = doc('jpd116-2-1-greetings', 'Lesson 2 — Greetings & self-introduction|||Bài 2 — Chào hỏi & giới thiệu',
  'Chào hỏi hằng ngày; mẫu わたしは〜です; 〜さん; はじめまして・よろしくおねがいします.',
  [[
    `<span class="eyebrow">JPD116 · Lesson 2</span>
<h2>Greetings &amp; self-introduction</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>おはようございます</td><td>ohayō gozaimasu</td><td>good morning</td></tr>
<tr><td>こんにちは</td><td>konnichiwa</td><td>hello / good afternoon</td></tr>
<tr><td>こんばんは</td><td>konbanwa</td><td>good evening</td></tr>
<tr><td>さようなら</td><td>sayōnara</td><td>goodbye</td></tr>
<tr><td>ありがとうございます</td><td>arigatō gozaimasu</td><td>thank you</td></tr>
<tr><td>すみません</td><td>sumimasen</td><td>excuse me / sorry</td></tr>
</table>
<h3>Grammar — わたしは〜です</h3>
<p><strong>[topic] は [noun] です</strong> means "[topic] is [noun]". は is the topic particle, read <em>wa</em> here. です is a polite "to be".</p>
<ul>
<li>わたしは タンです。 (Watashi wa Tan desu.) — I am Tan.</li>
<li>タンさんは がくせいです。 (Tan-san wa gakusei desu.) — Mr./Ms. Tan is a student.</li>
</ul>
<p>Add <strong>〜さん</strong> after someone's name for politeness — but NEVER after your own name.</p>
<h3>Short dialogue</h3>
<pre><code>A: はじめまして。タンです。どうぞ よろしく おねがいします。
   Hajimemashite. Tan desu. Dōzo yoroshiku onegaishimasu.
B: はじめまして。田中です。よろしく おねがいします。
   Hajimemashite. Tanaka desu. Yoroshiku onegaishimasu.
</code></pre>
<div class="callout"><span class="badge">Note</span> はじめまして = "nice to meet you" (first time); よろしくおねがいします = a set closing phrase with no English equivalent, roughly "please treat me well".</div>`,
    `<span class="eyebrow">JPD116 · Bài 2</span>
<h2>Chào hỏi &amp; giới thiệu</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>おはようございます</td><td>ohayō gozaimasu</td><td>chào buổi sáng</td></tr>
<tr><td>こんにちは</td><td>konnichiwa</td><td>xin chào / chào buổi trưa</td></tr>
<tr><td>こんばんは</td><td>konbanwa</td><td>chào buổi tối</td></tr>
<tr><td>さようなら</td><td>sayōnara</td><td>tạm biệt</td></tr>
<tr><td>ありがとうございます</td><td>arigatō gozaimasu</td><td>cảm ơn</td></tr>
<tr><td>すみません</td><td>sumimasen</td><td>xin lỗi / làm phiền</td></tr>
</table>
<h3>Ngữ pháp — わたしは〜です</h3>
<p><strong>[chủ đề] は [danh từ] です</strong> nghĩa là "[chủ đề] là [danh từ]". は là trợ từ chủ đề, ở đây đọc là <em>wa</em>. です là "thì/là" lịch sự.</p>
<ul>
<li>わたしは タンです。 (Watashi wa Tan desu.) — Tôi là Tân.</li>
<li>タンさんは がくせいです。 (Tan-san wa gakusei desu.) — Bạn Tân là sinh viên.</li>
</ul>
<p>Thêm <strong>〜さん</strong> sau tên người để lịch sự — nhưng KHÔNG bao giờ thêm vào tên mình.</p>
<h3>Hội thoại ngắn</h3>
<pre><code>A: はじめまして。タンです。どうぞ よろしく おねがいします。
   Hajimemashite. Tan desu. Dōzo yoroshiku onegaishimasu.
B: はじめまして。田中です。よろしく おねがいします。
   Hajimemashite. Tanaka desu. Yoroshiku onegaishimasu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> はじめまして = "rất vui được gặp" (lần đầu); よろしくおねがいします = câu chào kết thân không có bản dịch sát, đại ý "mong được bạn giúp đỡ".</div>`,
  ]]);

const b2q = quiz('jpd116-quiz-2', 'Quiz 2 — Greetings|||Quiz 2 — Chào hỏi', [
  { id: 'q1', question: 'Câu chào buổi sáng lịch sự là?|||The polite morning greeting is?', options: ['こんばんは', 'おはようございます', 'さようなら', 'すみません'], correctIndex: 1, explanation: 'おはようございます = chào buổi sáng.' },
  { id: 'q2', question: 'Trong わたしは タンです, trợ từ は được đọc là?|||In わたしは タンです, the particle は is read as?', options: ['ha', 'wa', 'ga', 'ba'], correctIndex: 1, explanation: 'は làm trợ từ chủ đề đọc là "wa".' },
  { id: 'q3', question: 'Đuôi 〜さん được dùng khi nào?|||When do you use the 〜さん suffix?', options: ['Sau tên mình|||After your own name', 'Sau tên người khác để lịch sự|||After another person\'s name, politely', 'Trước động từ|||Before a verb', 'Cuối câu hỏi|||At the end of a question'], correctIndex: 1, explanation: 'さん thêm sau tên người khác, không thêm vào tên mình.' },
]);

const b3 = doc('jpd116-3-1-kore-sore-are', 'Lesson 3 — What is this?|||Bài 3 — Đây là gì',
  'これ/それ/あれ; mẫu 〜は〜です / ですか; はい・いいえ; trợ từ の (sở hữu, bổ nghĩa).',
  [[
    `<span class="eyebrow">JPD116 · Lesson 3</span>
<h2>What is this? — これ・それ・あれ</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>これ</td><td>kore</td><td>this (near me)</td></tr>
<tr><td>それ</td><td>sore</td><td>that (near you)</td></tr>
<tr><td>あれ</td><td>are</td><td>that (over there)</td></tr>
<tr><td>ほん</td><td>hon</td><td>book</td></tr>
<tr><td>かばん</td><td>kaban</td><td>bag</td></tr>
<tr><td>なん / なに</td><td>nan / nani</td><td>what</td></tr>
</table>
<h3>Grammar — statements &amp; questions</h3>
<ul>
<li><strong>これは ほんです。</strong> (Kore wa hon desu.) — This is a book.</li>
<li><strong>それは なんですか。</strong> (Sore wa nan desu ka.) — What is that? Add か to make a question.</li>
<li>Answer: <strong>はい</strong> (hai, yes) / <strong>いいえ</strong> (iie, no).</li>
</ul>
<h3>The particle の (possession &amp; linking)</h3>
<p><strong>[A] の [B]</strong> links two nouns: A modifies/owns B.</p>
<ul>
<li>わたしの ほん (watashi no hon) — my book.</li>
<li>にほんごの ほん (nihongo no hon) — a Japanese-language book.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: それは なんですか。   Sore wa nan desu ka.
B: これは かばんです。   Kore wa kaban desu.
A: だれの かばんですか。 Dare no kaban desu ka.
B: わたしの かばんです。 Watashi no kaban desu.
</code></pre>
<div class="callout"><span class="badge">Note</span> これ/それ/あれ stand alone ("this one"); この/その/あの must attach to a noun (この ほん = this book).</div>`,
    `<span class="eyebrow">JPD116 · Bài 3</span>
<h2>Đây là gì — これ・それ・あれ</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>これ</td><td>kore</td><td>cái này (gần tôi)</td></tr>
<tr><td>それ</td><td>sore</td><td>cái đó (gần bạn)</td></tr>
<tr><td>あれ</td><td>are</td><td>cái kia (đằng xa)</td></tr>
<tr><td>ほん</td><td>hon</td><td>sách</td></tr>
<tr><td>かばん</td><td>kaban</td><td>cặp / túi</td></tr>
<tr><td>なん / なに</td><td>nan / nani</td><td>gì / cái gì</td></tr>
</table>
<h3>Ngữ pháp — câu kể &amp; câu hỏi</h3>
<ul>
<li><strong>これは ほんです。</strong> (Kore wa hon desu.) — Đây là quyển sách.</li>
<li><strong>それは なんですか。</strong> (Sore wa nan desu ka.) — Đó là cái gì? Thêm か để thành câu hỏi.</li>
<li>Trả lời: <strong>はい</strong> (hai, vâng) / <strong>いいえ</strong> (iie, không).</li>
</ul>
<h3>Trợ từ の (sở hữu &amp; nối)</h3>
<p><strong>[A] の [B]</strong> nối hai danh từ: A bổ nghĩa / sở hữu B.</p>
<ul>
<li>わたしの ほん (watashi no hon) — sách của tôi.</li>
<li>にほんごの ほん (nihongo no hon) — sách tiếng Nhật.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: それは なんですか。   Sore wa nan desu ka.
B: これは かばんです。   Kore wa kaban desu.
A: だれの かばんですか。 Dare no kaban desu ka.
B: わたしの かばんです。 Watashi no kaban desu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> これ/それ/あれ đứng một mình ("cái này"); この/その/あの phải đi kèm danh từ (この ほん = quyển sách này).</div>`,
  ]]);

const b3q = quiz('jpd116-quiz-3', 'Quiz 3 — This/that|||Quiz 3 — Chỉ định', [
  { id: 'q1', question: 'Từ nào nghĩa là "cái này" (gần người nói)?|||Which word means "this" (near the speaker)?', options: ['これ', 'それ', 'あれ', 'どれ'], correctIndex: 0, explanation: 'これ = cái này, gần người nói.' },
  { id: 'q2', question: 'Để biến これは ほんです thành câu hỏi, ta thêm gì ở cuối?|||To make これは ほんです a question, add what at the end?', options: ['ね', 'か', 'よ', 'の'], correctIndex: 1, explanation: 'Thêm か vào cuối câu để hỏi.' },
  { id: 'q3', question: '"Sách của tôi" viết đúng là?|||"My book" is correctly written as?', options: ['わたし ほん', 'わたしは ほん', 'わたしの ほん', 'ほんの わたし'], correctIndex: 2, explanation: 'の nối sở hữu: わたしの ほん.' },
]);

const b4 = doc('jpd116-4-1-numbers-time', 'Lesson 4 — Numbers & time|||Bài 4 — Số & thời gian',
  'Số đếm 1-10 và mở rộng; giờ 〜時, phút 〜分; なんじ; ごぜん/ごご; mẫu 〜から〜まで.',
  [[
    `<span class="eyebrow">JPD116 · Lesson 4</span>
<h2>Numbers &amp; time</h2>
<h3>Numbers 1-10</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>number</th></tr>
<tr><td>いち に さん</td><td>ichi ni san</td><td>1 2 3</td></tr>
<tr><td>し / よん ご ろく</td><td>shi/yon go roku</td><td>4 5 6</td></tr>
<tr><td>しち / なな はち</td><td>shichi/nana hachi</td><td>7 8</td></tr>
<tr><td>きゅう じゅう</td><td>kyū jū</td><td>9 10</td></tr>
</table>
<p>Beyond ten you combine: じゅういち (jūichi) 11, にじゅう (nijū) 20, ひゃく (hyaku) 100.</p>
<h3>Telling the time</h3>
<ul>
<li>Hour: <strong>〜じ</strong> (〜時) — いちじ (ichi-ji) 1 o'clock, しちじ (shichi-ji) 7 o'clock.</li>
<li>Minute: <strong>〜ふん / 〜ぷん</strong> (〜分) — ごふん (go-fun) 5 min, じゅっぷん (juppun) 10 min.</li>
<li>Question: <strong>いま なんじですか。</strong> (Ima nan-ji desu ka.) — What time is it now?</li>
<li><strong>ごぜん</strong> (gozen) = AM, <strong>ごご</strong> (gogo) = PM.</li>
</ul>
<h3>From ... to ... — 〜から〜まで</h3>
<p><strong>から</strong> = from, <strong>まで</strong> = until.</p>
<pre><code>じゅぎょうは くじから さんじまでです。
Jugyō wa ku-ji kara san-ji made desu.
Class is from 9 o'clock to 3 o'clock.
</code></pre>
<div class="callout"><span class="badge">Note</span> 4, 7, 9 have two readings; for time you say よじ (yo-ji, 4:00), しちじ (7:00), くじ (9:00).</div>`,
    `<span class="eyebrow">JPD116 · Bài 4</span>
<h2>Số &amp; thời gian</h2>
<h3>Số 1-10</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>số</th></tr>
<tr><td>いち に さん</td><td>ichi ni san</td><td>1 2 3</td></tr>
<tr><td>し / よん ご ろく</td><td>shi/yon go roku</td><td>4 5 6</td></tr>
<tr><td>しち / なな はち</td><td>shichi/nana hachi</td><td>7 8</td></tr>
<tr><td>きゅう じゅう</td><td>kyū jū</td><td>9 10</td></tr>
</table>
<p>Trên mười thì ghép: じゅういち (jūichi) 11, にじゅう (nijū) 20, ひゃく (hyaku) 100.</p>
<h3>Nói giờ</h3>
<ul>
<li>Giờ: <strong>〜じ</strong> (〜時) — いちじ (ichi-ji) 1 giờ, しちじ (shichi-ji) 7 giờ.</li>
<li>Phút: <strong>〜ふん / 〜ぷん</strong> (〜分) — ごふん (go-fun) 5 phút, じゅっぷん (juppun) 10 phút.</li>
<li>Câu hỏi: <strong>いま なんじですか。</strong> (Ima nan-ji desu ka.) — Bây giờ là mấy giờ?</li>
<li><strong>ごぜん</strong> (gozen) = sáng (AM), <strong>ごご</strong> (gogo) = chiều (PM).</li>
</ul>
<h3>Từ ... đến ... — 〜から〜まで</h3>
<p><strong>から</strong> = từ, <strong>まで</strong> = đến.</p>
<pre><code>じゅぎょうは くじから さんじまでです。
Jugyō wa ku-ji kara san-ji made desu.
Lớp học từ 9 giờ đến 3 giờ.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Số 4, 7, 9 có hai cách đọc; nói giờ thì dùng よじ (yo-ji, 4 giờ), しちじ (7 giờ), くじ (9 giờ).</div>`,
  ]]);

const b4q = quiz('jpd116-quiz-4', 'Quiz 4 — Numbers & time|||Quiz 4 — Số & giờ', [
  { id: 'q1', question: 'Số 7 đọc phổ biến là gì?|||How is the number 7 commonly read?', options: ['ろく (roku)', 'なな / しち (nana/shichi)', 'きゅう (kyū)', 'はち (hachi)'], correctIndex: 1, explanation: '7 = なな hoặc しち.' },
  { id: 'q2', question: 'Muốn hỏi "Bây giờ mấy giờ?" ta nói?|||To ask "What time is it now?" you say?', options: ['いま なんじですか', 'いま どこですか', 'これは なんですか', 'なんの ほんですか'], correctIndex: 0, explanation: 'いま なんじですか = bây giờ mấy giờ.' },
  { id: 'q3', question: 'Cặp trợ từ nào nghĩa là "từ ... đến ..."?|||Which particle pair means "from ... to ..."?', options: ['は / を', 'から / まで', 'の / に', 'と / も'], correctIndex: 1, explanation: 'から = từ, まで = đến.' },
]);

const b5 = doc('jpd116-5-1-place-existence', 'Lesson 5 — Places & existence|||Bài 5 — Địa điểm & tồn tại',
  'ここ/そこ/あそこ; あります (đồ vật) / います (người, vật sống); trợ từ に chỉ nơi chốn; từ vị trí.',
  [[
    `<span class="eyebrow">JPD116 · Lesson 5</span>
<h2>Places &amp; existence</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>ここ・そこ・あそこ</td><td>koko / soko / asoko</td><td>here / there / over there</td></tr>
<tr><td>うえ・した</td><td>ue / shita</td><td>on top / under</td></tr>
<tr><td>なか・となり</td><td>naka / tonari</td><td>inside / next to</td></tr>
<tr><td>つくえ・いす</td><td>tsukue / isu</td><td>desk / chair</td></tr>
<tr><td>ねこ・ひと</td><td>neko / hito</td><td>cat / person</td></tr>
</table>
<h3>Grammar — あります vs います</h3>
<p>Both mean "there is / exists", but split by what exists:</p>
<ul>
<li><strong>あります</strong> — inanimate things (books, desks, buildings).</li>
<li><strong>います</strong> — living, moving things (people, animals).</li>
</ul>
<p>Location is marked by <strong>に</strong>: <strong>[place] に [thing] が あります／います</strong>.</p>
<ul>
<li>つくえの うえに ほんが あります。 (Tsukue no ue ni hon ga arimasu.) — There is a book on the desk.</li>
<li>へやに ねこが います。 (Heya ni neko ga imasu.) — There is a cat in the room.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: すみません、トイレは どこですか。 Sumimasen, toire wa doko desu ka.
B: あそこです。            Asoko desu.
</code></pre>
<div class="callout"><span class="badge">Note</span> Choose the verb by the SUBJECT, not the place: a person is always います even inside a building.</div>`,
    `<span class="eyebrow">JPD116 · Bài 5</span>
<h2>Địa điểm &amp; tồn tại</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>ここ・そこ・あそこ</td><td>koko / soko / asoko</td><td>ở đây / ở đó / đằng kia</td></tr>
<tr><td>うえ・した</td><td>ue / shita</td><td>ở trên / ở dưới</td></tr>
<tr><td>なか・となり</td><td>naka / tonari</td><td>bên trong / bên cạnh</td></tr>
<tr><td>つくえ・いす</td><td>tsukue / isu</td><td>cái bàn / cái ghế</td></tr>
<tr><td>ねこ・ひと</td><td>neko / hito</td><td>con mèo / người</td></tr>
</table>
<h3>Ngữ pháp — あります và います</h3>
<p>Cả hai nghĩa "có / tồn tại", nhưng chia theo cái gì tồn tại:</p>
<ul>
<li><strong>あります</strong> — vật vô tri (sách, bàn, toà nhà).</li>
<li><strong>います</strong> — vật sống, di chuyển được (người, động vật).</li>
</ul>
<p>Nơi chốn đánh dấu bằng <strong>に</strong>: <strong>[nơi] に [vật] が あります／います</strong>.</p>
<ul>
<li>つくえの うえに ほんが あります。 (Tsukue no ue ni hon ga arimasu.) — Trên bàn có quyển sách.</li>
<li>へやに ねこが います。 (Heya ni neko ga imasu.) — Trong phòng có con mèo.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: すみません、トイレは どこですか。 Sumimasen, toire wa doko desu ka.
B: あそこです。            Asoko desu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Chọn động từ theo CHỦ THỂ, không theo nơi chốn: người luôn dùng います dù ở trong toà nhà.</div>`,
  ]]);

const b5q = quiz('jpd116-quiz-5', 'Quiz 5 — Existence|||Quiz 5 — Tồn tại', [
  { id: 'q1', question: 'Động từ nào dùng cho vật vô tri (sách, bàn)?|||Which verb is used for inanimate things (books, desks)?', options: ['います', 'あります', 'します', 'いきます'], correctIndex: 1, explanation: 'あります dùng cho vật vô tri.' },
  { id: 'q2', question: '"Trong phòng có con mèo" — chọn câu đúng.|||"There is a cat in the room" — pick the correct sentence.', options: ['へやに ねこが います', 'へやに ねこが あります', 'ねこは へやです', 'へやの ねこです'], correctIndex: 0, explanation: 'Mèo là vật sống → います; nơi chốn dùng に.' },
  { id: 'q3', question: 'Trợ từ nào đánh dấu nơi chốn tồn tại?|||Which particle marks the place of existence?', options: ['を', 'に', 'の', 'は'], correctIndex: 1, explanation: 'に đánh dấu nơi chốn với あります/います.' },
]);

const b6 = doc('jpd116-6-1-verbs', 'Lesson 6 — Verbs & daily activities|||Bài 6 — Động từ & hoạt động',
  'Thể ます; trợ từ を (tân ngữ), で (nơi diễn ra); khẳng định/phủ định, hiện tại/quá khứ.',
  [[
    `<span class="eyebrow">JPD116 · Lesson 6</span>
<h2>Verbs &amp; daily activities</h2>
<h3>Vocabulary (ます-form)</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>たべます</td><td>tabemasu</td><td>to eat</td></tr>
<tr><td>のみます</td><td>nomimasu</td><td>to drink</td></tr>
<tr><td>みます</td><td>mimasu</td><td>to see / watch</td></tr>
<tr><td>よみます</td><td>yomimasu</td><td>to read</td></tr>
<tr><td>べんきょうします</td><td>benkyō shimasu</td><td>to study</td></tr>
</table>
<h3>Grammar — the four ます endings</h3>
<table>
<tr><th></th><th>present</th><th>past</th></tr>
<tr><td>affirmative</td><td>〜ます (tabemasu)</td><td>〜ました (tabemashita)</td></tr>
<tr><td>negative</td><td>〜ません (tabemasen)</td><td>〜ませんでした (tabemasen deshita)</td></tr>
</table>
<h3>Particles を and で</h3>
<ul>
<li><strong>を</strong> marks the direct object: パンを たべます (pan o tabemasu) — I eat bread.</li>
<li><strong>で</strong> marks where an action happens: レストランで たべます (resutoran de tabemasu) — I eat at a restaurant.</li>
</ul>
<pre><code>きのう としょかんで ほんを よみました。
Kinō toshokan de hon o yomimashita.
Yesterday I read a book at the library.
</code></pre>
<div class="callout"><span class="badge">Note</span> The object particle を is written with the kana を but pronounced "o". Word order is flexible, but the verb always comes LAST.</div>`,
    `<span class="eyebrow">JPD116 · Bài 6</span>
<h2>Động từ &amp; hoạt động</h2>
<h3>Từ vựng (thể ます)</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>たべます</td><td>tabemasu</td><td>ăn</td></tr>
<tr><td>のみます</td><td>nomimasu</td><td>uống</td></tr>
<tr><td>みます</td><td>mimasu</td><td>xem / nhìn</td></tr>
<tr><td>よみます</td><td>yomimasu</td><td>đọc</td></tr>
<tr><td>べんきょうします</td><td>benkyō shimasu</td><td>học</td></tr>
</table>
<h3>Ngữ pháp — bốn đuôi ます</h3>
<table>
<tr><th></th><th>hiện tại</th><th>quá khứ</th></tr>
<tr><td>khẳng định</td><td>〜ます (tabemasu)</td><td>〜ました (tabemashita)</td></tr>
<tr><td>phủ định</td><td>〜ません (tabemasen)</td><td>〜ませんでした (tabemasen deshita)</td></tr>
</table>
<h3>Trợ từ を và で</h3>
<ul>
<li><strong>を</strong> đánh dấu tân ngữ trực tiếp: パンを たべます (pan o tabemasu) — Tôi ăn bánh mì.</li>
<li><strong>で</strong> đánh dấu nơi diễn ra hành động: レストランで たべます (resutoran de tabemasu) — Tôi ăn ở nhà hàng.</li>
</ul>
<pre><code>きのう としょかんで ほんを よみました。
Kinō toshokan de hon o yomimashita.
Hôm qua tôi đọc sách ở thư viện.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Trợ từ tân ngữ を viết bằng kana を nhưng đọc là "o". Trật tự từ linh hoạt, nhưng động từ luôn đứng CUỐI.</div>`,
  ]]);

const b6q = quiz('jpd116-quiz-6', 'Quiz 6 — Verbs|||Quiz 6 — Động từ', [
  { id: 'q1', question: 'Dạng quá khứ khẳng định của たべます là?|||The past affirmative of たべます is?', options: ['たべません', 'たべました', 'たべませんでした', 'たべます'], correctIndex: 1, explanation: '〜ます → 〜ました (quá khứ khẳng định).' },
  { id: 'q2', question: 'Trợ từ nào đánh dấu tân ngữ trực tiếp?|||Which particle marks the direct object?', options: ['で', 'を', 'に', 'へ'], correctIndex: 1, explanation: 'を đánh dấu tân ngữ (đọc "o").' },
  { id: 'q3', question: '"Ăn ở nhà hàng" — trợ từ nào đứng sau レストラン?|||"Eat at a restaurant" — which particle follows レストラン?', options: ['を', 'の', 'で', 'は'], correctIndex: 2, explanation: 'で đánh dấu nơi diễn ra hành động.' },
]);

const b7 = doc('jpd116-7-1-adjectives', 'Lesson 7 — Adjectives|||Bài 7 — Tính từ',
  'Tính từ い và な; miêu tả người/vật; phủ định 〜くない / じゃありません; mẫu 〜が好きです.',
  [[
    `<span class="eyebrow">JPD116 · Lesson 7</span>
<h2>Adjectives — い &amp; な</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>おおきい・ちいさい</td><td>ōkii / chiisai</td><td>big / small (い-adj)</td></tr>
<tr><td>たかい・やすい</td><td>takai / yasui</td><td>expensive / cheap (い-adj)</td></tr>
<tr><td>おいしい</td><td>oishii</td><td>delicious (い-adj)</td></tr>
<tr><td>きれい(な)</td><td>kirei (na)</td><td>pretty / clean (な-adj)</td></tr>
<tr><td>げんき(な)</td><td>genki (na)</td><td>well / energetic (な-adj)</td></tr>
</table>
<h3>Grammar — two adjective types</h3>
<ul>
<li><strong>い-adjectives</strong> end in い. Predicate: このカメラは たかいです (kono kamera wa takai desu) — this camera is expensive. Negative drops い → くない: たかくないです.</li>
<li><strong>な-adjectives</strong> take な before a noun: きれいな はな (kirei na hana) — a pretty flower. Predicate: きれいです; negative: きれいじゃありません.</li>
</ul>
<h3>Saying you like something — 〜が好きです</h3>
<p><strong>[thing] が すきです</strong> = I like [thing].</p>
<ul>
<li>わたしは にほんの えいがが すきです。 (Watashi wa nihon no eiga ga suki desu.) — I like Japanese films.</li>
</ul>
<div class="callout"><span class="badge">Note</span> いい (good) is irregular: its negative is よくない (yokunai), NOT いくない.</div>`,
    `<span class="eyebrow">JPD116 · Bài 7</span>
<h2>Tính từ — い &amp; な</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>おおきい・ちいさい</td><td>ōkii / chiisai</td><td>to / nhỏ (tính từ い)</td></tr>
<tr><td>たかい・やすい</td><td>takai / yasui</td><td>đắt / rẻ (tính từ い)</td></tr>
<tr><td>おいしい</td><td>oishii</td><td>ngon (tính từ い)</td></tr>
<tr><td>きれい(な)</td><td>kirei (na)</td><td>đẹp / sạch (tính từ な)</td></tr>
<tr><td>げんき(な)</td><td>genki (na)</td><td>khoẻ / năng động (tính từ な)</td></tr>
</table>
<h3>Ngữ pháp — hai loại tính từ</h3>
<ul>
<li><strong>Tính từ い</strong> kết thúc bằng い. Vị ngữ: このカメラは たかいです (kono kamera wa takai desu) — máy ảnh này đắt. Phủ định bỏ い → くない: たかくないです.</li>
<li><strong>Tính từ な</strong> thêm な trước danh từ: きれいな はな (kirei na hana) — bông hoa đẹp. Vị ngữ: きれいです; phủ định: きれいじゃありません.</li>
</ul>
<h3>Nói thích điều gì — 〜が好きです</h3>
<p><strong>[đối tượng] が すきです</strong> = Tôi thích [đối tượng].</p>
<ul>
<li>わたしは にほんの えいがが すきです。 (Watashi wa nihon no eiga ga suki desu.) — Tôi thích phim Nhật.</li>
</ul>
<div class="callout"><span class="badge">Ghi chú</span> いい (tốt) là bất quy tắc: phủ định là よくない (yokunai), KHÔNG phải いくない.</div>`,
  ]]);

const b7q = quiz('jpd116-quiz-7', 'Quiz 7 — Adjectives|||Quiz 7 — Tính từ', [
  { id: 'q1', question: 'Tính từ nào là tính từ loại な?|||Which is a な-adjective?', options: ['たかい', 'おいしい', 'きれい', 'ちいさい'], correctIndex: 2, explanation: 'きれい là tính từ な (thêm な trước danh từ).' },
  { id: 'q2', question: 'Phủ định của たかいです (đắt) là?|||The negative of たかいです (expensive) is?', options: ['たかくないです', 'たかいじゃありません', 'たかでした', 'たかません'], correctIndex: 0, explanation: 'Tính từ い bỏ い thêm くない: たかくないです.' },
  { id: 'q3', question: 'Mẫu câu nói "Tôi thích ~" dùng trợ từ nào trước 好きです?|||Which particle comes before 好きです to say "I like ~"?', options: ['を', 'が', 'に', 'で'], correctIndex: 1, explanation: '〜が すきです: đối tượng ưa thích đứng trước が.' },
]);

const b8 = doc('jpd116-8-1-going-inviting', 'Lesson 8 — Going & inviting|||Bài 8 — Đi lại & mời rủ',
  '行きます/来ます/帰ります; trợ từ へ (hướng), で (phương tiện); mời rủ 〜ませんか / 〜ましょう.',
  [[
    `<span class="eyebrow">JPD116 · Lesson 8</span>
<h2>Going &amp; inviting</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>行きます</td><td>ikimasu</td><td>to go</td></tr>
<tr><td>来ます</td><td>kimasu</td><td>to come</td></tr>
<tr><td>帰ります</td><td>kaerimasu</td><td>to return / go home</td></tr>
<tr><td>でんしゃ・バス</td><td>densha / basu</td><td>train / bus</td></tr>
<tr><td>いっしょに</td><td>issho ni</td><td>together</td></tr>
</table>
<h3>Grammar — direction &amp; transport</h3>
<ul>
<li><strong>へ</strong> marks the destination (written へ, pronounced "e"): がっこうへ 行きます (gakkō e ikimasu) — I go to school.</li>
<li><strong>で</strong> marks the means of transport: でんしゃで 行きます (densha de ikimasu) — I go by train.</li>
</ul>
<h3>Inviting — 〜ませんか &amp; 〜ましょう</h3>
<ul>
<li><strong>〜ませんか</strong> = "won't you ~?" (a polite invitation): えいがを みませんか (eiga o mimasen ka) — Won't you watch a film?</li>
<li><strong>〜ましょう</strong> = "let's ~": 行きましょう (ikimashō) — Let's go.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: あした いっしょに えいがを みませんか。
   Ashita issho ni eiga o mimasen ka.
B: いいですね。行きましょう。
   Ii desu ne. Ikimashō.
</code></pre>
<div class="callout"><span class="badge">Note</span> Walking uses no で: あるいて 行きます (aruite ikimasu) — I go on foot. で is only for a vehicle.</div>`,
    `<span class="eyebrow">JPD116 · Bài 8</span>
<h2>Đi lại &amp; mời rủ</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>行きます</td><td>ikimasu</td><td>đi</td></tr>
<tr><td>来ます</td><td>kimasu</td><td>đến</td></tr>
<tr><td>帰ります</td><td>kaerimasu</td><td>trở về / về nhà</td></tr>
<tr><td>でんしゃ・バス</td><td>densha / basu</td><td>tàu điện / xe buýt</td></tr>
<tr><td>いっしょに</td><td>issho ni</td><td>cùng nhau</td></tr>
</table>
<h3>Ngữ pháp — hướng &amp; phương tiện</h3>
<ul>
<li><strong>へ</strong> đánh dấu đích đến (viết へ, đọc "e"): がっこうへ 行きます (gakkō e ikimasu) — Tôi đi đến trường.</li>
<li><strong>で</strong> đánh dấu phương tiện: でんしゃで 行きます (densha de ikimasu) — Tôi đi bằng tàu điện.</li>
</ul>
<h3>Mời rủ — 〜ませんか &amp; 〜ましょう</h3>
<ul>
<li><strong>〜ませんか</strong> = "bạn ~ không?" (mời lịch sự): えいがを みませんか (eiga o mimasen ka) — Bạn xem phim không?</li>
<li><strong>〜ましょう</strong> = "cùng ~ nào": 行きましょう (ikimashō) — Đi thôi nào.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: あした いっしょに えいがを みませんか。
   Ashita issho ni eiga o mimasen ka.
B: いいですね。行きましょう。
   Ii desu ne. Ikimashō.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Đi bộ thì không dùng で: あるいて 行きます (aruite ikimasu) — Tôi đi bộ. で chỉ dùng cho phương tiện xe cộ.</div>`,
  ]]);

const b8q = quiz('jpd116-quiz-8', 'Quiz 8 — Going & inviting|||Quiz 8 — Đi lại & mời rủ', [
  { id: 'q1', question: 'Trợ từ nào đánh dấu đích đến (đọc "e")?|||Which particle marks the destination (read "e")?', options: ['で', 'を', 'へ', 'が'], correctIndex: 2, explanation: 'へ đánh dấu hướng/đích đến, đọc là "e".' },
  { id: 'q2', question: '"Đi bằng tàu điện" — trợ từ nào sau でんしゃ?|||"Go by train" — which particle follows でんしゃ?', options: ['で', 'へ', 'に', 'を'], correctIndex: 0, explanation: 'で đánh dấu phương tiện: でんしゃで.' },
  { id: 'q3', question: 'Đuôi nào nghĩa là "cùng ~ nào" (rủ làm chung)?|||Which ending means "let\'s ~"?', options: ['〜ませんでした', '〜ましょう', '〜ました', 'です'], correctIndex: 1, explanation: '〜ましょう = "cùng ~ nào".' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'JPD116',
    slug: 'jpd116-elementary-japanese-1-a1a2',
    title: 'Elementary Japanese 1-A1/A2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JPD116.webp',
    shortDescription: 'Elementary Japanese 1 (intro N5) — kana (hiragana & katakana), greetings & self-intro, これ/それ/あれ, numbers & time, existence あります/います, ます-form verbs, い/な adjectives, going & inviting. Bilingual, with vocab, grammar, dialogue & quizzes.|||Tiếng Nhật sơ cấp 1 (N5 nhập môn) — hệ chữ kana (hiragana & katakana), chào hỏi & giới thiệu, これ/それ/あれ, số & giờ, tồn tại あります/います, động từ thể ます, tính từ い/な, đi lại & mời rủ. Song ngữ Nhật-Việt, có từ vựng, ngữ pháp, hội thoại & quiz.',
    description: 'Môn <strong>JPD116 — Elementary Japanese 1 (Tiếng Nhật sơ cấp 1, A1/A2)</strong> thuộc khối Ngôn ngữ Nhật FPTU, Kỳ 1, đưa bạn từ số 0 tới nền tảng <strong>JLPT N5</strong>. Bám giáo trình chuẩn <em>Minna no Nihongo I / Genki I</em>: <strong>hệ chữ kana</strong> (ひらがな &amp; カタカナ) → <strong>chào hỏi &amp; tự giới thiệu</strong> (わたしは〜です) → <strong>chỉ định</strong> これ/それ/あれ &amp; trợ từ の → <strong>số &amp; giờ</strong> → <strong>địa điểm &amp; tồn tại</strong> (あります/います) → <strong>động từ thể ます</strong> → <strong>tính từ い/な</strong> → <strong>đi lại &amp; mời rủ</strong>. Mỗi bài có từ vựng, ngữ pháp, hội thoại và quiz; song ngữ Nhật-Việt.',
    whatYouLearn: 'Đọc viết ひらがな &amp; カタカナ (âm đục, trường âm, âm ngắt, âm ghép); chào hỏi &amp; tự giới thiệu; mẫu 〜は〜です/ですか; これ/それ/あれ &amp; trợ từ の; số đếm &amp; nói giờ (〜時〜分, 〜から〜まで); ここ/そこ/あそこ &amp; あります/います với trợ từ に; động từ thể ます (khẳng định/phủ định, hiện tại/quá khứ) &amp; trợ từ を/で; tính từ い/な &amp; 〜が好きです; 行きます/来ます/帰ります với へ/で &amp; mời rủ 〜ませんか/〜ましょう.',
    requirements: 'Không cần kiến thức tiếng Nhật trước. Nên cài app thẻ ghi nhớ (Anki) để luyện kana &amp; từ vựng mỗi ngày.',
  },
  sections: [
    { title: '📚 Tài liệu & lộ trình|||📚 Materials & path', description: 'Giáo trình, app, từ điển, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mục tiêu N5, ba hệ chữ, cách học.', lessons: [intro] },
    { title: 'Bài 1 — Hệ chữ kana|||Lesson 1 — Kana', description: 'Hiragana, katakana, âm đục, trường âm, âm ngắt.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Chào hỏi & giới thiệu|||Lesson 2 — Greetings', description: 'Chào hỏi, わたしは〜です, さん.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Đây là gì|||Lesson 3 — What is this?', description: 'これ/それ/あれ, ですか, trợ từ の.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Số & thời gian|||Lesson 4 — Numbers & time', description: 'Số đếm, 〜時〜分, から/まで.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Địa điểm & tồn tại|||Lesson 5 — Places & existence', description: 'ここ/そこ/あそこ, あります/います, に.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Động từ & hoạt động|||Lesson 6 — Verbs', description: 'Thể ます, を, で, thời/thể.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Tính từ|||Lesson 7 — Adjectives', description: 'Tính từ い/な, phủ định, 〜が好きです.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Đi lại & mời rủ|||Lesson 8 — Going & inviting', description: '行きます/来ます/帰ります, へ, で, ませんか/ましょう.', lessons: [b8, b8q] },
  ],
};
