/**
 * JPD126 — Elementary Japanese 2 (Tiếng Nhật sơ cấp 2, A2). Khối Ngôn ngữ
 * Nhật FPTU, Kỳ 1. NỐI TIẾP JPD116 Elementary Japanese 1. MÔN NGÔN NGỮ:
 * cấu trúc bài học tiếng (từ vựng, ngữ pháp, hội thoại, luyện tập), trình độ
 * JLPT N5 cuối → N4 đầu. Bám giáo trình chuẩn みんなの日本語 Minna no Nihongo I
 * (bài ~13-25) / Genki I-II.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML;
 * "&"→&amp; trong content HTML; helper doc .join('\n') ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức bài học.', quiz: { timeLimitSeconds: 300, questions } });

const taiLieu = doc('jpd126-0-0-tai-lieu', '📚 Materials & references|||📚 Tài liệu & lộ trình học',
  'Trung tâm tài liệu: giáo trình (Minna no Nihongo I bài 13-25, Genki I-II), app (Anki/Bunpro), từ điển jisho.org, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">JPD126 · Materials</span>
<h2>Materials &amp; resource hub</h2>
<p class="lead">Everything to continue <strong>Elementary Japanese</strong> — this course picks up right where <strong>JPD116</strong> left off and carries you from late <strong>JLPT N5</strong> into the beginning of <strong>N4</strong>. The official FPTU slides &amp; textbook live on <strong>FLM</strong>; below are trusted study resources.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><strong>みんなの日本語 初級 I</strong> (Minna no Nihongo I) — this course maps to its <strong>second half (units ~13-25)</strong>: the て-form, ない-form, dictionary form and the grammar built on them.</li>
<li><strong>Genki I-II</strong> — a friendly English-language beginner course covering the same verb forms with clear drills.</li>
</ul>
<h3>🌐 Dictionary &amp; grammar</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — the best free Japanese-English dictionary; it shows each verb's group and its て/た forms.</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — grammar SRS ordered by JLPT level; drill each pattern below in order.</li>
</ul>
<h3>🃏 Apps for drilling</h3>
<ul>
<li><strong>Anki</strong> — spaced-repetition flashcards; add a deck for verb conjugation (dict → ます → て → た → ない).</li>
<li><strong>Migii JLPT</strong> — mock tests and vocab by level, popular in Vietnam.</li>
</ul>
<div class="callout"><span class="badge">4-step study path</span>
<ol>
<li><strong>Review JPD116</strong> — kana, ます-form verbs, い/な adjectives and the core particles must be automatic first.</li>
<li><strong>Master verb forms</strong> — learn to conjugate any verb into て, た, ない and dictionary form; every lesson here depends on one of them.</li>
<li><strong>Use the patterns</strong> — ask, request, permit, forbid, oblige, compare and state intentions in real sentences.</li>
<li><strong>Test-ready</strong> — drill vocab &amp; conjugation with Anki, take N5/N4 mock tests on Migii.</li>
</ol></div>`,
    `<span class="eyebrow">JPD126 · Tài liệu</span>
<h2>Trung tâm tài liệu &amp; lộ trình</h2>
<p class="lead">Mọi thứ để học tiếp <strong>tiếng Nhật sơ cấp</strong> — môn này nối thẳng từ <strong>JPD116</strong> và đưa bạn từ cuối <strong>JLPT N5</strong> sang đầu <strong>N4</strong>. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn học đáng tin.</p>
<h3>📘 Giáo trình lõi</h3>
<ul>
<li><strong>みんなの日本語 初級 I</strong> (Minna no Nihongo I) — môn này bám <strong>nửa sau (bài ~13-25)</strong>: thể て, thể ない, thể từ điển và ngữ pháp dựng trên chúng.</li>
<li><strong>Genki I-II</strong> — giáo trình tiếng Anh dễ tiếp cận, cùng các thể động từ này với bài luyện rõ ràng.</li>
</ul>
<h3>🌐 Từ điển &amp; ngữ pháp</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — từ điển Nhật-Anh miễn phí tốt nhất; nó chỉ rõ nhóm động từ và thể て/た.</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — luyện ngữ pháp theo trình độ JLPT; luyện lần lượt các mẫu bên dưới.</li>
</ul>
<h3>🃏 App luyện</h3>
<ul>
<li><strong>Anki</strong> — thẻ ghi nhớ lặp lại ngắt quãng; nên tạo bộ chia động từ (từ điển → ます → て → た → ない).</li>
<li><strong>Migii JLPT</strong> — đề thi thử &amp; từ vựng theo trình độ, phổ biến ở Việt Nam.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình học 4 bước</span>
<ol>
<li><strong>Ôn JPD116</strong> — kana, động từ thể ます, tính từ い/な và các trợ từ lõi phải thành phản xạ trước.</li>
<li><strong>Thạo các thể động từ</strong> — chia được mọi động từ sang thể て, た, ない và thể từ điển; mỗi bài ở đây đều dựa vào một thể.</li>
<li><strong>Dùng mẫu câu</strong> — hỏi, nhờ, cho phép, cấm, bắt buộc, so sánh và nói dự định trong câu thật.</li>
<li><strong>Sẵn sàng thi</strong> — luyện từ vựng &amp; chia động từ bằng Anki, làm đề N5/N4 thử trên Migii.</li>
</ol></div>`,
  ]]);

const intro = doc('jpd126-0-1-overview', 'Course overview: Elementary Japanese 2|||Tổng quan: Tiếng Nhật sơ cấp 2',
  'Nối tiếp JPD116; mục tiêu N5 cuối → N4 đầu; trọng tâm các thể động từ (て/た/ない/từ điển); lộ trình 8 bài.',
  [[
    `<span class="eyebrow">JPD126 · Lesson 0.1 · Overview</span>
<h2>Elementary Japanese 2 (A2)</h2>
<p class="lead">This course continues <strong>JPD116 (Elementary Japanese 1)</strong> and takes you from the end of <strong>JLPT N5</strong> into the start of <strong>N4</strong>. Where JPD116 gave you kana and ます-form verbs, this course teaches the <strong>other verb forms</strong> — て, た, ない and the plain dictionary form — and the everyday grammar built on each of them.</p>
<h3>Why verb forms matter</h3>
<p>Almost every new pattern here attaches to a particular verb form: <strong>てください</strong> (request) needs the て-form, <strong>なければなりません</strong> (obligation) needs the ない-form, <strong>ことができます</strong> (ability) needs the dictionary form, <strong>たことがあります</strong> (experience) needs the た-form. Learn to conjugate first, and the grammar follows easily.</p>
<h3>The three verb groups (quick review)</h3>
<ul>
<li><strong>Group I (う-verbs)</strong> — かいます, のみます, かきます; the ます-stem ends in an i-sound.</li>
<li><strong>Group II (る-verbs)</strong> — たべます, みます; conjugate by simply swapping ます.</li>
<li><strong>Group III (irregular)</strong> — only します and きます.</li>
</ul>
<h3>Roadmap (8 lessons)</h3>
<p>Desires &amp; purpose → て-form &amp; requests → permission &amp; prohibition → ない-form &amp; obligation → dictionary form &amp; ability → past-form experience → comparison → intention &amp; prediction.</p>`,
    `<span class="eyebrow">JPD126 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Nhật sơ cấp 2 (A2)</h2>
<p class="lead">Môn này nối tiếp <strong>JPD116 (Tiếng Nhật sơ cấp 1)</strong> và đưa bạn từ cuối <strong>JLPT N5</strong> sang đầu <strong>N4</strong>. Nếu JPD116 cho bạn kana và động từ thể ます, thì môn này dạy <strong>các thể động từ còn lại</strong> — て, た, ない và thể từ điển — cùng ngữ pháp hằng ngày dựng trên từng thể.</p>
<h3>Vì sao các thể động từ quan trọng</h3>
<p>Gần như mọi mẫu mới ở đây đều gắn vào một thể nhất định: <strong>てください</strong> (nhờ vả) cần thể て, <strong>なければなりません</strong> (nghĩa vụ) cần thể ない, <strong>ことができます</strong> (khả năng) cần thể từ điển, <strong>たことがあります</strong> (kinh nghiệm) cần thể た. Chia được động từ trước thì ngữ pháp theo sau rất nhẹ.</p>
<h3>Ba nhóm động từ (ôn nhanh)</h3>
<ul>
<li><strong>Nhóm I (động từ う)</strong> — かいます, のみます, かきます; đuôi thể ます kết thúc bằng âm hàng i.</li>
<li><strong>Nhóm II (động từ る)</strong> — たべます, みます; chia bằng cách bỏ ます.</li>
<li><strong>Nhóm III (bất quy tắc)</strong> — chỉ có します và きます.</li>
</ul>
<h3>Lộ trình (8 bài)</h3>
<p>Ước muốn &amp; mục đích → thể て &amp; yêu cầu → cho phép &amp; cấm → thể ない &amp; nghĩa vụ → thể từ điển &amp; khả năng → thể た &amp; kinh nghiệm → so sánh → ý định &amp; dự đoán.</p>`,
  ]]);

const b1 = doc('jpd126-1-1-desires-purpose', 'Lesson 1 — Desires & purpose|||Bài 1 — Ước muốn & mục đích',
  '〜がほしいです (muốn có); 〜たいです (muốn làm); 〜へ〜に行きます (đi để làm gì).',
  [[
    `<span class="eyebrow">JPD126 · Lesson 1</span>
<h2>Desires &amp; purpose</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>ほしい</td><td>hoshii</td><td>to want (a thing)</td></tr>
<tr><td>おかね</td><td>okane</td><td>money</td></tr>
<tr><td>じかん</td><td>jikan</td><td>time</td></tr>
<tr><td>りょこう</td><td>ryokō</td><td>trip / travel</td></tr>
<tr><td>デパート</td><td>depāto</td><td>department store</td></tr>
</table>
<h3>Grammar — wanting a thing: 〜がほしいです</h3>
<p><strong>[noun] が ほしいです</strong> = I want [noun]. ほしい behaves like an い-adjective.</p>
<ul>
<li>わたしは あたらしい くるまが ほしいです。 (Watashi wa atarashii kuruma ga hoshii desu.) — I want a new car.</li>
<li>Negative: おかねは ほしくないです。 (Okane wa hoshiku nai desu.) — I don't want money.</li>
</ul>
<h3>Grammar — wanting to do: 〜たいです</h3>
<p>Take the <strong>ます-stem</strong> and add <strong>たい</strong>: たべます → たべたい, のみます → のみたい.</p>
<ul>
<li>わたしは にほんへ 行きたいです。 (Watashi wa nihon e ikitai desu.) — I want to go to Japan.</li>
<li>The object may take が or を: みずが／を のみたいです。</li>
</ul>
<h3>Grammar — going for a purpose: 〜に 行きます</h3>
<p><strong>[place] へ [verb ます-stem] に 行きます</strong> = go to [place] to [do]. Use noun + に for する-nouns.</p>
<ul>
<li>デパートへ かばんを かいに 行きます。 (Depāto e kaban o kai ni ikimasu.) — I go to the department store to buy a bag.</li>
<li>にほんへ りょこうに 行きます。 (Nihon e ryokō ni ikimasu.) — I go to Japan for a trip.</li>
</ul>
<div class="callout"><span class="badge">Note</span> 〜たい describes the SPEAKER's own wish; to talk about a third person's wish you switch to 〜たがっています. Also, ほしい / たい cannot be used to invite someone — use 〜ませんか from JPD116 instead.</div>`,
    `<span class="eyebrow">JPD126 · Bài 1</span>
<h2>Ước muốn &amp; mục đích</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>ほしい</td><td>hoshii</td><td>muốn (có một vật)</td></tr>
<tr><td>おかね</td><td>okane</td><td>tiền</td></tr>
<tr><td>じかん</td><td>jikan</td><td>thời gian</td></tr>
<tr><td>りょこう</td><td>ryokō</td><td>chuyến du lịch</td></tr>
<tr><td>デパート</td><td>depāto</td><td>trung tâm thương mại</td></tr>
</table>
<h3>Ngữ pháp — muốn một vật: 〜がほしいです</h3>
<p><strong>[danh từ] が ほしいです</strong> = Tôi muốn [danh từ]. ほしい hoạt động như một tính từ い.</p>
<ul>
<li>わたしは あたらしい くるまが ほしいです。 (Watashi wa atarashii kuruma ga hoshii desu.) — Tôi muốn một chiếc xe mới.</li>
<li>Phủ định: おかねは ほしくないです。 (Okane wa hoshiku nai desu.) — Tôi không muốn tiền.</li>
</ul>
<h3>Ngữ pháp — muốn làm gì: 〜たいです</h3>
<p>Lấy <strong>đuôi thể ます</strong> rồi thêm <strong>たい</strong>: たべます → たべたい, のみます → のみたい.</p>
<ul>
<li>わたしは にほんへ 行きたいです。 (Watashi wa nihon e ikitai desu.) — Tôi muốn đi Nhật.</li>
<li>Tân ngữ có thể dùng が hoặc を: みずが／を のみたいです。</li>
</ul>
<h3>Ngữ pháp — đi để làm gì: 〜に 行きます</h3>
<p><strong>[nơi] へ [động từ thể ます-stem] に 行きます</strong> = đi tới [nơi] để [làm]. Danh từ する dùng danh từ + に.</p>
<ul>
<li>デパートへ かばんを かいに 行きます。 (Depāto e kaban o kai ni ikimasu.) — Tôi đến trung tâm thương mại để mua cặp.</li>
<li>にほんへ りょこうに 行きます。 (Nihon e ryokō ni ikimasu.) — Tôi đi Nhật để du lịch.</li>
</ul>
<div class="callout"><span class="badge">Ghi chú</span> 〜たい nói về ước muốn của CHÍNH người nói; muốn nói ước muốn của người thứ ba thì đổi sang 〜たがっています. Ngoài ra, ほしい / たい không dùng để rủ ai đó — hãy dùng 〜ませんか đã học ở JPD116.</div>`,
  ]]);

const b1q = quiz('jpd126-quiz-1', 'Quiz 1 — Desires & purpose|||Quiz 1 — Ước muốn & mục đích', [
  { id: 'q1', question: '"Tôi muốn đi Nhật" — dạng nào đúng của động từ 行きます?|||"I want to go to Japan" — which form of 行きます is correct?', options: ['行きたいです', '行きほしいです', '行くたいです', '行きますたい'], correctIndex: 0, explanation: 'ます-stem 行き + たい → 行きたいです.' },
  { id: 'q2', question: 'Trợ từ nào đứng trước ほしいです để nói "muốn có vật đó"?|||Which particle comes before ほしいです to say "want that thing"?', options: ['を', 'が', 'に', 'で'], correctIndex: 1, explanation: '[danh từ] が ほしいです.' },
  { id: 'q3', question: '"Đến trung tâm thương mại để mua cặp" — chọn câu đúng.|||"Go to the department store to buy a bag" — pick the correct sentence.', options: ['デパートへ かばんを かいに 行きます', 'デパートへ かばんを かいたいです', 'デパートで かばんが ほしいです', 'デパートへ かって 行きます'], correctIndex: 0, explanation: 'ます-stem かい + に 行きます = đi để mua.' },
]);

const b2 = doc('jpd126-2-1-te-form-requests', 'Lesson 2 — て-form & requests|||Bài 2 — Thể て & yêu cầu',
  'Cách chia thể て (3 nhóm); 〜てください (nhờ/mời); 〜ています (đang diễn ra).',
  [[
    `<span class="eyebrow">JPD126 · Lesson 2</span>
<h2>The て-form &amp; requests</h2>
<h3>How to form the て-form</h3>
<table>
<tr><th>group</th><th>rule</th><th>example</th></tr>
<tr><td>I: い・ち・り</td><td>→ って</td><td>かいます → かって</td></tr>
<tr><td>I: み・び・に</td><td>→ んで</td><td>のみます → のんで</td></tr>
<tr><td>I: き / ぎ</td><td>→ いて / いで</td><td>かきます → かいて</td></tr>
<tr><td>I: し</td><td>→ して</td><td>はなします → はなして</td></tr>
<tr><td>II (る-verbs)</td><td>ます → て</td><td>たべます → たべて</td></tr>
<tr><td>III</td><td>irregular</td><td>します → して, きます → きて</td></tr>
</table>
<p>One exception in Group I: <strong>いきます → いって</strong> (not いいて).</p>
<h3>Grammar — 〜てください (please do)</h3>
<ul>
<li>すみません、この かんじを おしえてください。 (Sumimasen, kono kanji o oshiete kudasai.) — Please teach me this kanji.</li>
<li>ちょっと まってください。 (Chotto matte kudasai.) — Please wait a moment.</li>
</ul>
<h3>Grammar — 〜ています (ongoing action)</h3>
<p><strong>て-form + います</strong> = an action in progress right now.</p>
<ul>
<li>いま あめが ふっています。 (Ima ame ga futte imasu.) — It is raining now.</li>
<li>タンさんは いま ほんを よんでいます。 (Tan-san wa ima hon o yonde imasu.) — Tan is reading a book now.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: すみません、しゃしんを とってください。
   Sumimasen, shashin o totte kudasai.
B: はい。では、とりますよ。
   Hai. Dewa, torimasu yo.
</code></pre>
<div class="callout"><span class="badge">Note</span> The て-form is the single most useful conjugation in Japanese — many later patterns (permission, prohibition, sequencing) all attach to it, so drill it until it is automatic.</div>`,
    `<span class="eyebrow">JPD126 · Bài 2</span>
<h2>Thể て &amp; yêu cầu</h2>
<h3>Cách chia thể て</h3>
<table>
<tr><th>nhóm</th><th>quy tắc</th><th>ví dụ</th></tr>
<tr><td>I: い・ち・り</td><td>→ って</td><td>かいます → かって</td></tr>
<tr><td>I: み・び・に</td><td>→ んで</td><td>のみます → のんで</td></tr>
<tr><td>I: き / ぎ</td><td>→ いて / いで</td><td>かきます → かいて</td></tr>
<tr><td>I: し</td><td>→ して</td><td>はなします → はなして</td></tr>
<tr><td>II (động từ る)</td><td>ます → て</td><td>たべます → たべて</td></tr>
<tr><td>III</td><td>bất quy tắc</td><td>します → して, きます → きて</td></tr>
</table>
<p>Một ngoại lệ ở nhóm I: <strong>いきます → いって</strong> (không phải いいて).</p>
<h3>Ngữ pháp — 〜てください (xin hãy làm)</h3>
<ul>
<li>すみません、この かんじを おしえてください。 (Sumimasen, kono kanji o oshiete kudasai.) — Xin hãy chỉ tôi chữ kanji này.</li>
<li>ちょっと まってください。 (Chotto matte kudasai.) — Xin đợi một chút.</li>
</ul>
<h3>Ngữ pháp — 〜ています (đang diễn ra)</h3>
<p><strong>thể て + います</strong> = hành động đang diễn ra ngay lúc này.</p>
<ul>
<li>いま あめが ふっています。 (Ima ame ga futte imasu.) — Bây giờ trời đang mưa.</li>
<li>タンさんは いま ほんを よんでいます。 (Tan-san wa ima hon o yonde imasu.) — Bạn Tân đang đọc sách.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: すみません、しゃしんを とってください。
   Sumimasen, shashin o totte kudasai.
B: はい。では、とりますよ。
   Hai. Dewa, torimasu yo.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Thể て là cách chia hữu ích nhất trong tiếng Nhật — nhiều mẫu về sau (cho phép, cấm, nối chuỗi) đều gắn vào nó, hãy luyện đến khi thành phản xạ.</div>`,
  ]]);

const b2q = quiz('jpd126-quiz-2', 'Quiz 2 — て-form|||Quiz 2 — Thể て', [
  { id: 'q1', question: 'Thể て của のみます là gì?|||What is the て-form of のみます?', options: ['のみて', 'のって', 'のんで', 'のいて'], correctIndex: 2, explanation: 'Nhóm I đuôi み → んで: のみます → のんで.' },
  { id: 'q2', question: 'Động từ いきます có thể て đặc biệt là?|||いきます has a special て-form of?', options: ['いいて', 'いきて', 'いって', 'いんで'], correctIndex: 2, explanation: 'Ngoại lệ nhóm I: いきます → いって.' },
  { id: 'q3', question: '"Trời đang mưa (ngay bây giờ)" dùng mẫu nào?|||"It is raining right now" uses which pattern?', options: ['あめが ふります', 'あめが ふっています', 'あめが ふりたいです', 'あめを ふってください'], correctIndex: 1, explanation: 'thể て + います diễn tả hành động đang diễn ra.' },
]);

const b3 = doc('jpd126-3-1-permission-prohibition', 'Lesson 3 — Permission & prohibition|||Bài 3 — Cho phép & cấm',
  '〜てもいいです (được phép); 〜てはいけません (cấm); xin phép và trả lời.',
  [[
    `<span class="eyebrow">JPD126 · Lesson 3</span>
<h2>Permission &amp; prohibition</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>すいます</td><td>suimasu</td><td>to smoke (a cigarette)</td></tr>
<tr><td>はいります</td><td>hairimasu</td><td>to enter</td></tr>
<tr><td>つかいます</td><td>tsukaimasu</td><td>to use</td></tr>
<tr><td>ここ</td><td>koko</td><td>here</td></tr>
<tr><td>だいじょうぶ</td><td>daijōbu</td><td>all right / fine</td></tr>
</table>
<h3>Grammar — 〜てもいいです (you may)</h3>
<p><strong>て-form + もいいです</strong> gives permission. Ask with か.</p>
<ul>
<li>ここで しゃしんを とってもいいです。 (Koko de shashin o totte mo ii desu.) — You may take photos here.</li>
<li>Question: この ペンを つかってもいいですか。 — May I use this pen? Answer: はい、いいですよ。 / ええ、どうぞ。</li>
</ul>
<h3>Grammar — 〜てはいけません (you must not)</h3>
<p><strong>て-form + はいけません</strong> forbids. は here is read <em>wa</em>.</p>
<ul>
<li>ここで たばこを すってはいけません。 (Koko de tabako o sutte wa ikemasen.) — You must not smoke here.</li>
<li>この へやに はいってはいけません。 (Kono heya ni haitte wa ikemasen.) — You must not enter this room.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: すみません、ここで しゃしんを とってもいいですか。
   Sumimasen, koko de shashin o totte mo ii desu ka.
B: すみません、ここは とってはいけません。
   Sumimasen, koko wa totte wa ikemasen.
</code></pre>
<div class="callout"><span class="badge">Note</span> A polite refusal to a 〜てもいいですか request is usually softened: ちょっと… (chotto…) means "that's a bit…" and signals no without a blunt いいえ.</div>`,
    `<span class="eyebrow">JPD126 · Bài 3</span>
<h2>Cho phép &amp; cấm</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>すいます</td><td>suimasu</td><td>hút (thuốc)</td></tr>
<tr><td>はいります</td><td>hairimasu</td><td>đi vào</td></tr>
<tr><td>つかいます</td><td>tsukaimasu</td><td>sử dụng</td></tr>
<tr><td>ここ</td><td>koko</td><td>ở đây</td></tr>
<tr><td>だいじょうぶ</td><td>daijōbu</td><td>ổn / không sao</td></tr>
</table>
<h3>Ngữ pháp — 〜てもいいです (được phép)</h3>
<p><strong>thể て + もいいです</strong> cho phép làm gì. Thêm か để xin phép.</p>
<ul>
<li>ここで しゃしんを とってもいいです。 (Koko de shashin o totte mo ii desu.) — Bạn được chụp ảnh ở đây.</li>
<li>Câu hỏi: この ペンを つかってもいいですか。 — Tôi dùng cây bút này được không? Trả lời: はい、いいですよ。 / ええ、どうぞ。</li>
</ul>
<h3>Ngữ pháp — 〜てはいけません (không được / cấm)</h3>
<p><strong>thể て + はいけません</strong> cấm làm gì. は ở đây đọc là <em>wa</em>.</p>
<ul>
<li>ここで たばこを すってはいけません。 (Koko de tabako o sutte wa ikemasen.) — Không được hút thuốc ở đây.</li>
<li>この へやに はいってはいけません。 (Kono heya ni haitte wa ikemasen.) — Không được vào phòng này.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: すみません、ここで しゃしんを とってもいいですか。
   Sumimasen, koko de shashin o totte mo ii desu ka.
B: すみません、ここは とってはいけません。
   Sumimasen, koko wa totte wa ikemasen.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Từ chối lịch sự cho câu xin phép 〜てもいいですか thường nói giảm: ちょっと… (chotto…) nghĩa là "hơi bất tiện…", báo "không" mà không phải nói thẳng いいえ.</div>`,
  ]]);

const b3q = quiz('jpd126-quiz-3', 'Quiz 3 — Permission|||Quiz 3 — Cho phép & cấm', [
  { id: 'q1', question: 'Mẫu nào nghĩa là "được phép làm"?|||Which pattern means "you may do"?', options: ['〜てはいけません', '〜てもいいです', '〜なければなりません', '〜たいです'], correctIndex: 1, explanation: 'thể て + もいいです = được phép.' },
  { id: 'q2', question: '"Không được hút thuốc ở đây" — chọn câu đúng.|||"You must not smoke here" — pick the correct sentence.', options: ['ここで たばこを すってもいいです', 'ここで たばこを すってはいけません', 'ここで たばこを すいたいです', 'ここで たばこを すってください'], correctIndex: 1, explanation: 'thể て + はいけません = cấm.' },
  { id: 'q3', question: 'Trong 〜てはいけません, chữ は được đọc là?|||In 〜てはいけません, は is read as?', options: ['ha', 'wa', 'ba', 'pa'], correctIndex: 1, explanation: 'は làm trợ từ đọc là "wa".' },
]);

const b4 = doc('jpd126-4-1-nai-form-obligation', 'Lesson 4 — ない-form & obligation|||Bài 4 — Thể ない & nghĩa vụ',
  'Cách chia thể ない (3 nhóm); 〜なければなりません (phải); 〜なくてもいいです (không cần).',
  [[
    `<span class="eyebrow">JPD126 · Lesson 4</span>
<h2>The ない-form &amp; obligation</h2>
<h3>How to form the ない-form</h3>
<table>
<tr><th>group</th><th>rule</th><th>example</th></tr>
<tr><td>I</td><td>i-row → a-row + ない</td><td>かきます → かかない</td></tr>
<tr><td>I: 〜います</td><td>い → わ + ない</td><td>かいます → かわない</td></tr>
<tr><td>II (る-verbs)</td><td>ます → ない</td><td>たべます → たべない</td></tr>
<tr><td>III</td><td>irregular</td><td>します → しない, きます → こない</td></tr>
</table>
<h3>Grammar — 〜なければなりません (must do)</h3>
<p>Take the ない-form, drop <strong>ない</strong>, add <strong>なければなりません</strong>.</p>
<ul>
<li>あした 早く 来なければなりません。 (Ashita hayaku konakereba narimasen.) — I must come early tomorrow.</li>
<li>くすりを のまなければなりません。 (Kusuri o nomanakereba narimasen.) — I must take the medicine.</li>
</ul>
<h3>Grammar — 〜なくてもいいです (need not do)</h3>
<p>Drop <strong>ない</strong>, add <strong>なくてもいいです</strong>.</p>
<ul>
<li>あした 来なくてもいいです。 (Ashita konakute mo ii desu.) — You don't have to come tomorrow.</li>
<li>くつを ぬがなくてもいいです。 (Kutsu o nuganakute mo ii desu.) — You don't have to take off your shoes.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: あした しけんが あります。べんきょうしなければなりません。
   Ashita shiken ga arimasu. Benkyō shinakereba narimasen.
B: たいへんですね。がんばってください。
   Taihen desu ne. Ganbatte kudasai.
</code></pre>
<div class="callout"><span class="badge">Note</span> Do not confuse the two: 〜なければなりません = "must (do)"; 〜なくてもいいです = "need not (do)". They are opposites built on the same ない-form.</div>`,
    `<span class="eyebrow">JPD126 · Bài 4</span>
<h2>Thể ない &amp; nghĩa vụ</h2>
<h3>Cách chia thể ない</h3>
<table>
<tr><th>nhóm</th><th>quy tắc</th><th>ví dụ</th></tr>
<tr><td>I</td><td>hàng i → hàng a + ない</td><td>かきます → かかない</td></tr>
<tr><td>I: 〜います</td><td>い → わ + ない</td><td>かいます → かわない</td></tr>
<tr><td>II (động từ る)</td><td>ます → ない</td><td>たべます → たべない</td></tr>
<tr><td>III</td><td>bất quy tắc</td><td>します → しない, きます → こない</td></tr>
</table>
<h3>Ngữ pháp — 〜なければなりません (phải làm)</h3>
<p>Lấy thể ない, bỏ <strong>ない</strong>, thêm <strong>なければなりません</strong>.</p>
<ul>
<li>あした 早く 来なければなりません。 (Ashita hayaku konakereba narimasen.) — Ngày mai tôi phải đến sớm.</li>
<li>くすりを のまなければなりません。 (Kusuri o nomanakereba narimasen.) — Tôi phải uống thuốc.</li>
</ul>
<h3>Ngữ pháp — 〜なくてもいいです (không cần làm)</h3>
<p>Bỏ <strong>ない</strong>, thêm <strong>なくてもいいです</strong>.</p>
<ul>
<li>あした 来なくてもいいです。 (Ashita konakute mo ii desu.) — Ngày mai bạn không cần đến.</li>
<li>くつを ぬがなくてもいいです。 (Kutsu o nuganakute mo ii desu.) — Bạn không cần cởi giày.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: あした しけんが あります。べんきょうしなければなりません。
   Ashita shiken ga arimasu. Benkyō shinakereba narimasen.
B: たいへんですね。がんばってください。
   Taihen desu ne. Ganbatte kudasai.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Đừng lẫn hai mẫu: 〜なければなりません = "phải (làm)"; 〜なくてもいいです = "không cần (làm)". Chúng trái nghĩa nhau nhưng cùng dựng trên thể ない.</div>`,
  ]]);

const b4q = quiz('jpd126-quiz-4', 'Quiz 4 — ない-form|||Quiz 4 — Thể ない', [
  { id: 'q1', question: 'Thể ない của かいます là gì?|||What is the ない-form of かいます?', options: ['かかない', 'かいない', 'かわない', 'からない'], correctIndex: 2, explanation: 'Nhóm I đuôi います: い → わ → かわない.' },
  { id: 'q2', question: 'Mẫu nào nghĩa là "phải làm"?|||Which pattern means "must do"?', options: ['〜なくてもいいです', '〜なければなりません', '〜てもいいです', '〜たいです'], correctIndex: 1, explanation: '〜なければなりません = phải làm.' },
  { id: 'q3', question: '"Ngày mai bạn không cần đến" dùng mẫu nào?|||"You don\'t have to come tomorrow" uses which pattern?', options: ['来なければなりません', '来なくてもいいです', '来てはいけません', '来たいです'], correctIndex: 1, explanation: '〜なくてもいいです = không cần làm.' },
]);

const b5 = doc('jpd126-5-1-dict-form-ability', 'Lesson 5 — Dictionary form & ability|||Bài 5 — Thể từ điển & khả năng',
  'Cách chia thể từ điển; 〜ことができます (có thể); 〜まえに (trước khi).',
  [[
    `<span class="eyebrow">JPD126 · Lesson 5</span>
<h2>Dictionary form &amp; ability</h2>
<h3>How to form the dictionary form</h3>
<table>
<tr><th>group</th><th>rule</th><th>example</th></tr>
<tr><td>I</td><td>i-row → u-row</td><td>かきます → かく, のみます → のむ</td></tr>
<tr><td>II (る-verbs)</td><td>ます → る</td><td>たべます → たべる</td></tr>
<tr><td>III</td><td>irregular</td><td>します → する, きます → くる</td></tr>
</table>
<p>The dictionary form is the plain, informal present — it is how verbs appear in a dictionary, and many patterns attach to it.</p>
<h3>Grammar — 〜ことができます (can do)</h3>
<p><strong>[dictionary form] ことが できます</strong> = be able to / can.</p>
<ul>
<li>わたしは にほんごを はなすことが できます。 (Watashi wa nihongo o hanasu koto ga dekimasu.) — I can speak Japanese.</li>
<li>ここで おかねを かえることが できます。 (Koko de okane o kaeru koto ga dekimasu.) — You can exchange money here.</li>
</ul>
<h3>Grammar — 〜まえに (before doing)</h3>
<p><strong>[dictionary form] まえに</strong> = before [doing]. With a noun use <strong>[noun] の まえに</strong>.</p>
<ul>
<li>ねるまえに、ほんを よみます。 (Neru mae ni, hon o yomimasu.) — Before sleeping, I read a book.</li>
<li>しょくじの まえに、てを あらいます。 (Shokuji no mae ni, te o araimasu.) — Before a meal, I wash my hands.</li>
</ul>
<div class="callout"><span class="badge">Note</span> The verb before まえに always stays in the DICTIONARY form, even when the whole sentence is about the past: 日本へ 来るまえに、にほんごを べんきょうしました。</div>`,
    `<span class="eyebrow">JPD126 · Bài 5</span>
<h2>Thể từ điển &amp; khả năng</h2>
<h3>Cách chia thể từ điển</h3>
<table>
<tr><th>nhóm</th><th>quy tắc</th><th>ví dụ</th></tr>
<tr><td>I</td><td>hàng i → hàng u</td><td>かきます → かく, のみます → のむ</td></tr>
<tr><td>II (động từ る)</td><td>ます → る</td><td>たべます → たべる</td></tr>
<tr><td>III</td><td>bất quy tắc</td><td>します → する, きます → くる</td></tr>
</table>
<p>Thể từ điển là dạng suồng sã, hiện tại — là cách động từ xuất hiện trong từ điển, và nhiều mẫu ngữ pháp gắn vào nó.</p>
<h3>Ngữ pháp — 〜ことができます (có thể)</h3>
<p><strong>[thể từ điển] ことが できます</strong> = có khả năng / có thể.</p>
<ul>
<li>わたしは にほんごを はなすことが できます。 (Watashi wa nihongo o hanasu koto ga dekimasu.) — Tôi có thể nói tiếng Nhật.</li>
<li>ここで おかねを かえることが できます。 (Koko de okane o kaeru koto ga dekimasu.) — Ở đây có thể đổi tiền.</li>
</ul>
<h3>Ngữ pháp — 〜まえに (trước khi)</h3>
<p><strong>[thể từ điển] まえに</strong> = trước khi [làm]. Với danh từ dùng <strong>[danh từ] の まえに</strong>.</p>
<ul>
<li>ねるまえに、ほんを よみます。 (Neru mae ni, hon o yomimasu.) — Trước khi ngủ, tôi đọc sách.</li>
<li>しょくじの まえに、てを あらいます。 (Shokuji no mae ni, te o araimasu.) — Trước bữa ăn, tôi rửa tay.</li>
</ul>
<div class="callout"><span class="badge">Ghi chú</span> Động từ trước まえに luôn giữ thể TỪ ĐIỂN, dù cả câu nói về quá khứ: 日本へ 来るまえに、にほんごを べんきょうしました。</div>`,
  ]]);

const b5q = quiz('jpd126-quiz-5', 'Quiz 5 — Dictionary form|||Quiz 5 — Thể từ điển', [
  { id: 'q1', question: 'Thể từ điển của のみます là gì?|||What is the dictionary form of のみます?', options: ['のむ', 'のみる', 'のんで', 'のまない'], correctIndex: 0, explanation: 'Nhóm I: hàng i → hàng u, のみ → のむ.' },
  { id: 'q2', question: '"Tôi có thể nói tiếng Nhật" dùng mẫu nào?|||"I can speak Japanese" uses which pattern?', options: ['はなすことが できます', 'はなしたいです', 'はなしてください', 'はなさなければなりません'], correctIndex: 0, explanation: '[thể từ điển] ことが できます = có thể.' },
  { id: 'q3', question: 'Trước まえに, động từ ねます phải ở dạng nào?|||Before まえに, the verb ねます must be in which form?', options: ['ねます', 'ねる', 'ねて', 'ねた'], correctIndex: 1, explanation: 'まえに luôn đi với thể từ điển: ねるまえに.' },
]);

const b6 = doc('jpd126-6-1-past-experience', 'Lesson 6 — Experience & listing|||Bài 6 — Kinh nghiệm & liệt kê',
  'Thể た; 〜たことがあります (đã từng); 〜たり〜たり (làm những việc như).',
  [[
    `<span class="eyebrow">JPD126 · Lesson 6</span>
<h2>Experience &amp; listing</h2>
<h3>The た-form</h3>
<p>The <strong>た-form</strong> is the plain past. It is made exactly like the て-form, but with た/だ instead of て/で:</p>
<table>
<tr><th>て-form</th><th>た-form</th></tr>
<tr><td>たべて</td><td>たべた</td></tr>
<tr><td>かって</td><td>かった</td></tr>
<tr><td>のんで</td><td>のんだ</td></tr>
<tr><td>いって (いきます)</td><td>いった</td></tr>
</table>
<h3>Grammar — 〜たことがあります (have done)</h3>
<p><strong>[た-form] ことが あります</strong> = have (once) done; describes past experience.</p>
<ul>
<li>わたしは にほんへ 行ったことが あります。 (Watashi wa nihon e itta koto ga arimasu.) — I have been to Japan.</li>
<li>おすしを たべたことが ありますか。 — Have you ever eaten sushi?</li>
</ul>
<h3>Grammar — 〜たり〜たり します (do things like)</h3>
<p><strong>[た-form] り、[た-form] り します</strong> lists a few representative actions (not exhaustive).</p>
<ul>
<li>にちようびは えいがを みたり、ほんを よんだり します。 (Nichiyōbi wa eiga o mitari, hon o yondari shimasu.) — On Sundays I do things like watch films and read books.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: ほっかいどうへ 行ったことが ありますか。
   Hokkaidō e itta koto ga arimasu ka.
B: いいえ、まだ 行ったことが ありません。
   Iie, mada itta koto ga arimasen.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜たことがあります is about experience "at least once in life", so it does not fit a fixed recent time — say きのう 日本料理を たべました, not 〜たことが あります, for yesterday.</div>`,
    `<span class="eyebrow">JPD126 · Bài 6</span>
<h2>Kinh nghiệm &amp; liệt kê</h2>
<h3>Thể た</h3>
<p><strong>Thể た</strong> là dạng quá khứ suồng sã. Chia y hệt thể て, chỉ đổi て/で thành た/だ:</p>
<table>
<tr><th>thể て</th><th>thể た</th></tr>
<tr><td>たべて</td><td>たべた</td></tr>
<tr><td>かって</td><td>かった</td></tr>
<tr><td>のんで</td><td>のんだ</td></tr>
<tr><td>いって (いきます)</td><td>いった</td></tr>
</table>
<h3>Ngữ pháp — 〜たことがあります (đã từng)</h3>
<p><strong>[thể た] ことが あります</strong> = đã (từng) làm; nói về kinh nghiệm quá khứ.</p>
<ul>
<li>わたしは にほんへ 行ったことが あります。 (Watashi wa nihon e itta koto ga arimasu.) — Tôi đã từng đến Nhật.</li>
<li>おすしを たべたことが ありますか。 — Bạn đã từng ăn sushi chưa?</li>
</ul>
<h3>Ngữ pháp — 〜たり〜たり します (làm những việc như)</h3>
<p><strong>[thể た] り、[thể た] り します</strong> liệt kê vài hành động tiêu biểu (không đầy đủ).</p>
<ul>
<li>にちようびは えいがを みたり、ほんを よんだり します。 (Nichiyōbi wa eiga o mitari, hon o yondari shimasu.) — Chủ nhật tôi làm những việc như xem phim và đọc sách.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: ほっかいどうへ 行ったことが ありますか。
   Hokkaidō e itta koto ga arimasu ka.
B: いいえ、まだ 行ったことが ありません。
   Iie, mada itta koto ga arimasen.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜たことがあります nói về kinh nghiệm "ít nhất một lần trong đời", nên không hợp với một mốc thời gian gần cố định — hôm qua thì nói きのう 日本料理を たべました, chứ không dùng 〜たことが あります.</div>`,
  ]]);

const b6q = quiz('jpd126-quiz-6', 'Quiz 6 — Experience|||Quiz 6 — Kinh nghiệm', [
  { id: 'q1', question: 'Thể た được chia giống thể nào?|||The た-form is conjugated like which form?', options: ['thể ます|||the ます-form', 'thể て|||the て-form', 'thể ない|||the ない-form', 'thể từ điển|||the dictionary form'], correctIndex: 1, explanation: 'Thể た chia y hệt thể て, đổi て/で thành た/だ.' },
  { id: 'q2', question: '"Tôi đã từng đến Nhật" dùng mẫu nào?|||"I have been to Japan" uses which pattern?', options: ['行ったことが あります', '行くことが できます', '行きたいです', '行かなければなりません'], correctIndex: 0, explanation: '[thể た] ことが あります = đã từng làm.' },
  { id: 'q3', question: 'Mẫu nào dùng để liệt kê vài hành động tiêu biểu?|||Which pattern lists a few representative actions?', options: ['〜てから〜て', '〜たり〜たり します', '〜ながら', '〜まえに'], correctIndex: 1, explanation: '〜たり〜たり します liệt kê vài việc, không đầy đủ.' },
]);

const b7 = doc('jpd126-7-1-comparison', 'Lesson 7 — Comparison|||Bài 7 — So sánh',
  '〜より (hơn); 〜のほうが (cái nào hơn); 〜でいちばん (nhất trong nhóm).',
  [[
    `<span class="eyebrow">JPD126 · Lesson 7</span>
<h2>Comparison</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>より</td><td>yori</td><td>than</td></tr>
<tr><td>ほう</td><td>hō</td><td>side / one (of two)</td></tr>
<tr><td>いちばん</td><td>ichiban</td><td>most / number one</td></tr>
<tr><td>はやい</td><td>hayai</td><td>fast / early</td></tr>
<tr><td>やま</td><td>yama</td><td>mountain</td></tr>
</table>
<h3>Grammar — A は B より 〜です (A is more ~ than B)</h3>
<ul>
<li>にほんは ベトナムより さむいです。 (Nihon wa betonamu yori samui desu.) — Japan is colder than Vietnam.</li>
</ul>
<h3>Grammar — 〜のほうが 〜より 〜です (which of two is more)</h3>
<ul>
<li>でんしゃの ほうが バスより はやいです。 (Densha no hō ga basu yori hayai desu.) — The train is faster than the bus.</li>
<li>Question: でんしゃと バスと どちらが はやいですか。 — Which is faster, the train or the bus?</li>
</ul>
<h3>Grammar — 〜で いちばん 〜 (the most in a group)</h3>
<ul>
<li>にほんで いちばん たかい やまは ふじさんです。 (Nihon de ichiban takai yama wa fujisan desu.) — The highest mountain in Japan is Mt. Fuji.</li>
<li>くだものの なかで なにが いちばん すきですか。 — Which fruit do you like best?</li>
</ul>
<div class="callout"><span class="badge">Note</span> より marks the thing that LOSES the comparison, so word order can flip freely: A は B より… and B より A のほうが… mean the same. いちばん simply means "number one / most".</div>`,
    `<span class="eyebrow">JPD126 · Bài 7</span>
<h2>So sánh</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>より</td><td>yori</td><td>hơn (so với)</td></tr>
<tr><td>ほう</td><td>hō</td><td>phía / cái (trong hai)</td></tr>
<tr><td>いちばん</td><td>ichiban</td><td>nhất / số một</td></tr>
<tr><td>はやい</td><td>hayai</td><td>nhanh / sớm</td></tr>
<tr><td>やま</td><td>yama</td><td>núi</td></tr>
</table>
<h3>Ngữ pháp — A は B より 〜です (A hơn B về ~)</h3>
<ul>
<li>にほんは ベトナムより さむいです。 (Nihon wa betonamu yori samui desu.) — Nhật lạnh hơn Việt Nam.</li>
</ul>
<h3>Ngữ pháp — 〜のほうが 〜より 〜です (cái nào hơn trong hai)</h3>
<ul>
<li>でんしゃの ほうが バスより はやいです。 (Densha no hō ga basu yori hayai desu.) — Tàu điện nhanh hơn xe buýt.</li>
<li>Câu hỏi: でんしゃと バスと どちらが はやいですか。 — Tàu điện và xe buýt, cái nào nhanh hơn?</li>
</ul>
<h3>Ngữ pháp — 〜で いちばん 〜 (nhất trong một nhóm)</h3>
<ul>
<li>にほんで いちばん たかい やまは ふじさんです。 (Nihon de ichiban takai yama wa fujisan desu.) — Ngọn núi cao nhất Nhật Bản là núi Phú Sĩ.</li>
<li>くだものの なかで なにが いちばん すきですか。 — Trong các loại trái cây, bạn thích nhất loại nào?</li>
</ul>
<div class="callout"><span class="badge">Ghi chú</span> より đánh dấu vế BỊ so kém hơn, nên trật tự có thể đảo tự do: A は B より… và B より A のほうが… nghĩa như nhau. いちばん đơn giản là "số một / nhất".</div>`,
  ]]);

const b7q = quiz('jpd126-quiz-7', 'Quiz 7 — Comparison|||Quiz 7 — So sánh', [
  { id: 'q1', question: 'Trợ từ nào nghĩa là "hơn (so với)"?|||Which particle means "than"?', options: ['ほう', 'より', 'いちばん', 'ほど'], correctIndex: 1, explanation: 'より đánh dấu vế bị so, nghĩa "hơn / so với".' },
  { id: 'q2', question: '"Tàu điện nhanh hơn xe buýt" — chọn câu đúng.|||"The train is faster than the bus" — pick the correct sentence.', options: ['でんしゃの ほうが バスより はやいです', 'バスの ほうが でんしゃより はやいです', 'でんしゃで バスが いちばん はやいです', 'でんしゃは バスが はやいです'], correctIndex: 0, explanation: 'AのほうがBより〜: cái A (tàu) hơn.' },
  { id: 'q3', question: '"Núi cao nhất Nhật Bản" dùng cụm nào?|||"The highest mountain in Japan" uses which phrase?', options: ['にほんより たかい', 'にほんで いちばん たかい', 'にほんの ほうが たかい', 'にほんは たかいより'], correctIndex: 1, explanation: '〜で いちばん = nhất trong phạm vi/nhóm đó.' },
]);

const b8 = doc('jpd126-8-1-intention-prediction', 'Lesson 8 — Intention & prediction|||Bài 8 — Ý định & dự định',
  '〜つもりです (dự định); 〜と思います (tôi nghĩ rằng); 〜でしょう (chắc là / có lẽ).',
  [[
    `<span class="eyebrow">JPD126 · Lesson 8</span>
<h2>Intention &amp; prediction</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>つもり</td><td>tsumori</td><td>intention / plan</td></tr>
<tr><td>おもいます</td><td>omoimasu</td><td>to think</td></tr>
<tr><td>なつやすみ</td><td>natsuyasumi</td><td>summer vacation</td></tr>
<tr><td>くに</td><td>kuni</td><td>home country</td></tr>
<tr><td>はれ</td><td>hare</td><td>clear / fine weather</td></tr>
</table>
<h3>Grammar — 〜つもりです (intend to)</h3>
<p><strong>[dictionary / ない form] つもりです</strong> = intend to / plan to.</p>
<ul>
<li>なつやすみに くにへ かえるつもりです。 (Natsuyasumi ni kuni e kaeru tsumori desu.) — I plan to return to my home country over summer vacation.</li>
<li>Negative intention: たばこを すわないつもりです。 — I intend not to smoke.</li>
</ul>
<h3>Grammar — 〜と思います (I think that)</h3>
<p><strong>[plain form] と 思います</strong> states an opinion or guess.</p>
<ul>
<li>あした あめが ふると 思います。 (Ashita ame ga furu to omoimasu.) — I think it will rain tomorrow.</li>
<li>にほんごは おもしろいと 思います。 — I think Japanese is interesting.</li>
</ul>
<h3>Grammar — 〜でしょう (probably)</h3>
<p><strong>[plain form / noun / な-adj] でしょう</strong> = probably / I expect; a softer prediction than 〜と思います.</p>
<ul>
<li>あしたは はれるでしょう。 (Ashita wa hareru deshō.) — It will probably be fine tomorrow.</li>
</ul>
<div class="callout"><span class="badge">Note</span> つもり expresses a firm personal PLAN; 〜と思います is an opinion or a softer guess; でしょう is a prediction. Do not use つもり for other people's plans stated as fact.</div>`,
    `<span class="eyebrow">JPD126 · Bài 8</span>
<h2>Ý định &amp; dự định</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>つもり</td><td>tsumori</td><td>ý định / dự định</td></tr>
<tr><td>おもいます</td><td>omoimasu</td><td>nghĩ</td></tr>
<tr><td>なつやすみ</td><td>natsuyasumi</td><td>kỳ nghỉ hè</td></tr>
<tr><td>くに</td><td>kuni</td><td>quê hương / nước mình</td></tr>
<tr><td>はれ</td><td>hare</td><td>trời quang / đẹp</td></tr>
</table>
<h3>Ngữ pháp — 〜つもりです (dự định)</h3>
<p><strong>[thể từ điển / thể ない] つもりです</strong> = dự định / định làm.</p>
<ul>
<li>なつやすみに くにへ かえるつもりです。 (Natsuyasumi ni kuni e kaeru tsumori desu.) — Kỳ nghỉ hè tôi dự định về quê.</li>
<li>Ý định phủ định: たばこを すわないつもりです。 — Tôi định không hút thuốc.</li>
</ul>
<h3>Ngữ pháp — 〜と思います (tôi nghĩ rằng)</h3>
<p><strong>[thể thường] と 思います</strong> nêu ý kiến hoặc phỏng đoán.</p>
<ul>
<li>あした あめが ふると 思います。 (Ashita ame ga furu to omoimasu.) — Tôi nghĩ ngày mai trời sẽ mưa.</li>
<li>にほんごは おもしろいと 思います。 — Tôi nghĩ tiếng Nhật thú vị.</li>
</ul>
<h3>Ngữ pháp — 〜でしょう (chắc là / có lẽ)</h3>
<p><strong>[thể thường / danh từ / tính từ な] でしょう</strong> = chắc là / có lẽ; nhẹ hơn 〜と思います.</p>
<ul>
<li>あしたは はれるでしょう。 (Ashita wa hareru deshō.) — Ngày mai chắc trời sẽ đẹp.</li>
</ul>
<div class="callout"><span class="badge">Ghi chú</span> つもり nêu KẾ HOẠCH cá nhân chắc chắn; 〜と思います là ý kiến hoặc phỏng đoán nhẹ; でしょう là dự đoán. Đừng dùng つもり cho dự định của người khác nói như một sự thật.</div>`,
  ]]);

const b8q = quiz('jpd126-quiz-8', 'Quiz 8 — Intention|||Quiz 8 — Ý định & dự định', [
  { id: 'q1', question: 'Mẫu nào nghĩa là "dự định làm gì"?|||Which pattern means "intend to do"?', options: ['〜と思います', '〜つもりです', '〜でしょう', '〜たいです'], correctIndex: 1, explanation: '[thể từ điển] つもりです = dự định.' },
  { id: 'q2', question: 'Trước 思います, động từ ふります phải ở thể nào?|||Before 思います, the verb ふります must be in which form?', options: ['thể ます|||the ます-form', 'thể thường (từ điển)|||the plain (dictionary) form', 'thể て|||the て-form', 'thể ない|||the ない-form'], correctIndex: 1, explanation: '〜と思います đi với thể thường: ふると 思います.' },
  { id: 'q3', question: '"Ngày mai chắc trời sẽ đẹp" dùng đuôi nào?|||"It will probably be fine tomorrow" uses which ending?', options: ['でしょう', 'つもりです', 'たいです', 'てください'], correctIndex: 0, explanation: '〜でしょう = chắc là / có lẽ (dự đoán).' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'JPD126',
    slug: 'jpd126-elementary-japanese-2-a2',
    title: 'Elementary Japanese 2-A2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JPD126.webp',
    shortDescription: 'Elementary Japanese 2 (late N5 to early N4), continuing JPD116 — the て/た/ない/dictionary verb forms: requests, permission, obligation, ability, experience, comparison & intention. Bilingual, with vocab, grammar, dialogue & quizzes.|||Tiếng Nhật sơ cấp 2 (N5 cuối tới N4 đầu), nối tiếp JPD116 — các thể động từ て/た/ない/từ điển: yêu cầu, cho phép, nghĩa vụ, khả năng, kinh nghiệm, so sánh & ý định. Song ngữ Nhật-Việt, có từ vựng, ngữ pháp, hội thoại & quiz.',
    description: 'Môn <strong>JPD126 — Elementary Japanese 2 (Tiếng Nhật sơ cấp 2, A2)</strong> thuộc khối Ngôn ngữ Nhật FPTU, Kỳ 1, <strong>nối tiếp JPD116</strong> và đưa bạn từ cuối <strong>JLPT N5</strong> sang đầu <strong>N4</strong>. Bám giáo trình chuẩn <em>Minna no Nihongo I (bài ~13-25) / Genki I-II</em>, trọng tâm là các <strong>thể động từ</strong> và ngữ pháp dựng trên chúng: <strong>ước muốn &amp; mục đích</strong> (〜たい, 〜に行きます) → <strong>thể て &amp; yêu cầu</strong> (〜てください, 〜ています) → <strong>cho phép &amp; cấm</strong> (〜てもいいです, 〜てはいけません) → <strong>thể ない &amp; nghĩa vụ</strong> (〜なければなりません) → <strong>thể từ điển &amp; khả năng</strong> (〜ことができます, 〜まえに) → <strong>thể た &amp; kinh nghiệm</strong> (〜たことがあります, 〜たり〜たり) → <strong>so sánh</strong> (〜より, 〜のほうが, 〜でいちばん) → <strong>ý định &amp; dự định</strong> (〜つもりです, 〜と思います, 〜でしょう). Mỗi bài có từ vựng, ngữ pháp, hội thoại và quiz; song ngữ Nhật-Việt.',
    whatYouLearn: 'Chia thành thạo động từ sang thể て, た, ない và thể từ điển; nói ước muốn 〜がほしい/〜たい &amp; mục đích 〜に行きます; nhờ vả 〜てください &amp; hành động đang diễn ra 〜ています; xin phép 〜てもいいです &amp; cấm 〜てはいけません; nghĩa vụ 〜なければなりません &amp; 〜なくてもいいです; khả năng 〜ことができます &amp; 〜まえに; kinh nghiệm 〜たことがあります &amp; liệt kê 〜たり〜たり; so sánh 〜より/〜のほうが/〜でいちばん; ý định 〜つもりです, 〜と思います &amp; dự đoán 〜でしょう.',
    requirements: 'Cần đã học <strong>JPD116 (Elementary Japanese 1)</strong> hoặc tương đương: đọc viết kana, động từ thể ます, tính từ い/な và các trợ từ lõi. Nên dùng app thẻ ghi nhớ (Anki) để luyện chia động từ &amp; từ vựng mỗi ngày.',
  },
  sections: [
    { title: '📚 Tài liệu & lộ trình|||📚 Materials & path', description: 'Giáo trình, app, từ điển, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp JPD116, mục tiêu N5→N4, trọng tâm các thể động từ.', lessons: [intro] },
    { title: 'Bài 1 — Ước muốn & mục đích|||Lesson 1 — Desires & purpose', description: '〜がほしい, 〜たいです, 〜に行きます.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Thể て & yêu cầu|||Lesson 2 — て-form & requests', description: 'Chia thể て, 〜てください, 〜ています.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Cho phép & cấm|||Lesson 3 — Permission & prohibition', description: '〜てもいいです, 〜てはいけません.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Thể ない & nghĩa vụ|||Lesson 4 — ない-form & obligation', description: 'Chia thể ない, 〜なければなりません, 〜なくてもいいです.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Thể từ điển & khả năng|||Lesson 5 — Dictionary form & ability', description: 'Chia thể từ điển, 〜ことができます, 〜まえに.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Kinh nghiệm & liệt kê|||Lesson 6 — Experience & listing', description: 'Thể た, 〜たことがあります, 〜たり〜たり.', lessons: [b6, b6q] },
    { title: 'Bài 7 — So sánh|||Lesson 7 — Comparison', description: '〜より, 〜のほうが, 〜でいちばん.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Ý định & dự định|||Lesson 8 — Intention & prediction', description: '〜つもりです, 〜と思います, 〜でしょう.', lessons: [b8, b8q] },
  ],
};
