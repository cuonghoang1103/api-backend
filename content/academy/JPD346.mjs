/**
 * JPD346 — Intermediate Japanese 2-B2/C1 (Tiếng Nhật trung-cao cấp).
 * Khối Ngôn ngữ Nhật FPTU, Kỳ 4. NỐI TIẾP JPD336 Intermediate Japanese 2-B2.2.
 * MÔN NGÔN NGỮ: cấu trúc bài học tiếng (từ vựng, ngữ pháp, hội thoại, luyện
 * tập), trình độ JLPT N2 (中上級). Bám giáo trình chuẩn 新完全マスター N2
 * Shin Kanzen Master N2 / とびら Tobira, từ vựng chủ đề xã hội - kinh tế - khoa học.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML;
 * "&"→&amp; trong content HTML; helper doc .join('\n') ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức bài học.', quiz: { timeLimitSeconds: 300, questions } });

const taiLieu = doc('jpd346-0-0-tai-lieu', '📚 Materials & references|||📚 Tài liệu & lộ trình học',
  'Trung tâm tài liệu: giáo trình (Shin Kanzen Master N2, Tobira), app (Anki/Bunpro), từ điển jisho.org, lộ trình 4 bước cho JLPT N2.',
  [[
    `<span class="eyebrow">JPD346 · Materials</span>
<h2>Materials &amp; resource hub</h2>
<p class="lead">Everything to work through <strong>Intermediate Japanese 2-B2/C1</strong> — this course picks up right where <strong>JPD336</strong> left off and takes you through the core <strong>JLPT N2</strong> grammar (中上級). The official FPTU slides &amp; textbook live on <strong>FLM</strong>; below are trusted study resources.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><strong>新完全マスター N2 文法</strong> (Shin Kanzen Master N2 Grammar) — the standard N2 grammar reference; each unit isolates one pattern and drills the exact contrasts taught here.</li>
<li><strong>とびら (Tobira: Gateway to Advanced Japanese)</strong> — a content-rich upper-intermediate course whose readings recycle these formal connectives and modality patterns.</li>
</ul>
<h3>🌐 Dictionary &amp; grammar</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — the best free Japanese-English dictionary; it tags each word by JLPT level and shows every plain form.</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — grammar SRS ordered by JLPT level; drill every N2 pattern below in order.</li>
</ul>
<h3>🃏 Apps for drilling</h3>
<ul>
<li><strong>Anki</strong> — spaced-repetition flashcards; add decks for N2 vocabulary and for the pattern pairs that are easy to confuse (かねる vs かねない, ざるを得ない vs ずにはいられない, に基づいて vs に沿って).</li>
<li><strong>Migii JLPT</strong> — N2 mock tests and vocab by level, popular in Vietnam.</li>
</ul>
<div class="callout"><span class="badge">4-step study path</span>
<ol>
<li><strong>Review JPD336</strong> — the early-N2 connectives (について, おかげで, せいで, のに, 次第) must be automatic; the patterns here build directly on them.</li>
<li><strong>Learn each pattern in a pair</strong> — N2 grammar is mostly about telling near-synonyms apart (ものの vs とはいえ, ばかりに vs あまり, に基づいて vs に沿って). Study the contrast, not the pattern alone.</li>
<li><strong>Watch the register</strong> — many N2 patterns (を契機に, に基づいて, つつある, ざるを得ない) are formal or written; know when each fits.</li>
<li><strong>Test-ready</strong> — drill vocab &amp; grammar with Anki, take N2 mock tests on Migii.</li>
</ol></div>`,
    `<span class="eyebrow">JPD346 · Tài liệu</span>
<h2>Trung tâm tài liệu &amp; lộ trình</h2>
<p class="lead">Mọi thứ để học <strong>Tiếng Nhật trung-cao cấp B2/C1</strong> — môn này nối thẳng từ <strong>JPD336</strong> và đưa bạn qua các mẫu ngữ pháp lõi của <strong>JLPT N2</strong> (中上級). Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn học đáng tin.</p>
<h3>📘 Giáo trình lõi</h3>
<ul>
<li><strong>新完全マスター N2 文法</strong> (Shin Kanzen Master N2 Grammar) — sách ngữ pháp N2 chuẩn mực; mỗi phần tách riêng một mẫu và luyện đúng các cặp dễ nhầm dạy ở đây.</li>
<li><strong>とびら (Tobira)</strong> — giáo trình trung-cao cấp giàu nội dung, các bài đọc lặp lại chính các liên từ trang trọng và cách diễn đạt tình thái này.</li>
</ul>
<h3>🌐 Từ điển &amp; ngữ pháp</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — từ điển Nhật-Anh miễn phí tốt nhất; nó gắn nhãn trình độ JLPT và chỉ mọi thể thường.</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — luyện ngữ pháp theo trình độ JLPT; luyện lần lượt mọi mẫu N2 bên dưới.</li>
</ul>
<h3>🃏 App luyện</h3>
<ul>
<li><strong>Anki</strong> — thẻ ghi nhớ lặp lại ngắt quãng; nên tạo bộ cho từ vựng N2 và cho các cặp mẫu dễ nhầm (かねる và かねない, ざるを得ない và ずにはいられない, に基づいて và に沿って).</li>
<li><strong>Migii JLPT</strong> — đề thi thử N2 và từ vựng theo trình độ, phổ biến ở Việt Nam.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình học 4 bước</span>
<ol>
<li><strong>Ôn JPD336</strong> — các liên từ N2 đầu (について, おかげで, せいで, のに, 次第) phải thành phản xạ; các mẫu ở đây dựng thẳng lên chúng.</li>
<li><strong>Học mỗi mẫu theo cặp</strong> — ngữ pháp N2 phần lớn là phân biệt các mẫu gần nghĩa (ものの và とはいえ, ばかりに và あまり, に基づいて và に沿って). Học sự khác biệt, đừng học riêng lẻ.</li>
<li><strong>Để ý văn phong</strong> — nhiều mẫu N2 (を契機に, に基づいて, つつある, ざるを得ない) trang trọng hoặc thiên văn viết; nắm rõ khi nào dùng mẫu nào.</li>
<li><strong>Sẵn sàng thi</strong> — luyện từ vựng &amp; ngữ pháp bằng Anki, làm đề N2 thử trên Migii.</li>
</ol></div>`,
  ]]);

const intro = doc('jpd346-0-1-overview', 'Course overview: Intermediate Japanese 2-B2/C1|||Tổng quan: Tiếng Nhật trung-cao cấp B2/C1',
  'Nối tiếp JPD336; mục tiêu JLPT N2; trọng tâm điều kiện tất yếu, nhượng bộ, nguyên nhân - hậu quả, khả năng tiêu cực, mốc khởi đầu, căn cứ - đường lối, quá trình biến đổi và sự bắt buộc; lộ trình 8 bài.',
  [[
    `<span class="eyebrow">JPD346 · Lesson 0.1 · Overview</span>
<h2>Intermediate Japanese 2-B2/C1</h2>
<p class="lead">This course continues <strong>JPD336 (Intermediate Japanese 2-B2.2)</strong> and covers the core grammar of <strong>JLPT N2</strong> (中上級). As before, N2 Japanese is about <strong>choosing between near-synonyms</strong> — patterns that translate the same way but differ in nuance, register and construction.</p>
<h3>What is new here</h3>
<p>You gain richer connectives and modality: <strong>〜ないことには / 〜てはじめて</strong> mark a necessary condition, <strong>〜ものの / 〜とはいえ</strong> express concession, <strong>〜ばかりに / 〜あまり</strong> mark a single cause vs an excessive degree, <strong>〜かねる / 〜かねない</strong> express inability vs a bad possibility, <strong>〜をきっかけに / 〜を契機に</strong> mark a starting point, <strong>〜に基づいて / 〜に沿って</strong> mean based on vs in accordance with, <strong>〜つつある / 〜つつも</strong> describe a process vs a contradiction, and <strong>〜ざるを得ない / 〜ずにはいられない</strong> express external compulsion vs an inner impulse.</p>
<h3>Study tip for N2</h3>
<ul>
<li><strong>Learn in contrast</strong> — かねる (cannot) vs かねない (might, bad); に基づいて (based on) vs に沿って (in accordance with).</li>
<li><strong>Watch the register</strong> — を契機に, に基づいて and ざるを得ない are formal/written; ばかりに and つつも carry attitude and are often literary.</li>
<li><strong>Keep JPD336 warm</strong> — the early-N2 connectives return in these examples and dialogues.</li>
</ul>
<h3>Roadmap (8 lessons)</h3>
<p>Necessary condition → concession → single cause &amp; excess → inability &amp; bad possibility → starting point → basis &amp; guideline → process &amp; contradiction → compulsion.</p>`,
    `<span class="eyebrow">JPD346 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Nhật trung-cao cấp B2/C1</h2>
<p class="lead">Môn này nối tiếp <strong>JPD336 (Tiếng Nhật trung cấp 2-B2.2)</strong> và bao trùm ngữ pháp lõi của <strong>JLPT N2</strong> (中上級). Như trước, tiếng Nhật N2 là chuyện <strong>chọn giữa các mẫu gần nghĩa</strong> — những mẫu dịch ra tiếng Việt giống nhau nhưng khác về sắc thái, văn phong và cấu trúc.</p>
<h3>Điểm mới ở đây</h3>
<p>Bạn có thêm liên từ và cách diễn đạt phong phú: <strong>〜ないことには / 〜てはじめて</strong> nêu điều kiện tất yếu, <strong>〜ものの / 〜とはいえ</strong> diễn đạt nhượng bộ, <strong>〜ばかりに / 〜あまり</strong> đánh dấu một nguyên nhân duy nhất và mức độ thái quá, <strong>〜かねる / 〜かねない</strong> nêu sự bất khả và khả năng xấu, <strong>〜をきっかけに / 〜を契機に</strong> đánh dấu mốc khởi đầu, <strong>〜に基づいて / 〜に沿って</strong> nghĩa dựa trên và bám theo, <strong>〜つつある / 〜つつも</strong> tả quá trình biến đổi và sự mâu thuẫn, và <strong>〜ざるを得ない / 〜ずにはいられない</strong> diễn đạt sự bắt buộc từ ngoài và thôi thúc từ trong.</p>
<h3>Mẹo học N2</h3>
<ul>
<li><strong>Học theo cặp đối chiếu</strong> — かねる (không thể) và かねない (có thể, điều xấu); に基づいて (dựa trên) và に沿って (theo đúng).</li>
<li><strong>Để ý văn phong</strong> — を契機に, に基づいて và ざるを得ない trang trọng/văn viết; ばかりに và つつも mang thái độ và thường thiên văn chương.</li>
<li><strong>Giữ JPD336 còn nóng</strong> — các liên từ N2 đầu quay lại trong ví dụ và hội thoại ở đây.</li>
</ul>
<h3>Lộ trình (8 bài)</h3>
<p>Điều kiện tất yếu → nhượng bộ → một nguyên nhân &amp; mức độ thái quá → bất khả &amp; khả năng xấu → mốc khởi đầu → căn cứ &amp; đường lối → quá trình &amp; mâu thuẫn → bắt buộc.</p>`,
  ]]);

const b1 = doc('jpd346-1-1-necessary-condition', 'Lesson 1 — Necessary condition|||Bài 1 — Chỉ khi: ないことには, てはじめて',
  '〜ないことには〜ない (nếu không ~ thì không thể ~ — điều kiện tất yếu); 〜てはじめて (phải đến khi ~ mới ~ — nhận ra sau trải nghiệm).',
  [[
    `<span class="eyebrow">JPD346 · Lesson 1</span>
<h2>Necessary condition: only when</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>経験します</td><td>keiken shimasu</td><td>to experience</td></tr>
<tr><td>実際に</td><td>jissai ni</td><td>actually, in reality</td></tr>
<tr><td>判断します</td><td>handan shimasu</td><td>to judge</td></tr>
<tr><td>価値</td><td>kachi</td><td>value</td></tr>
<tr><td>努力します</td><td>doryoku shimasu</td><td>to make an effort</td></tr>
</table>
<h3>Grammar — 〜ないことには〜ない (unless ~, cannot ~)</h3>
<p><strong>[ない-form] + ことには</strong> = "unless ~". It states a necessary condition, so the second clause is always negative or expresses impossibility.</p>
<ul>
<li>自分で やって みないことには、何も 分からない。 (Jibun de yatte minai koto ni wa, nani mo wakaranai.) — Unless you try it yourself, you will not understand anything.</li>
<li>資料を 見ないことには、返事が できません。 (Shiryō o minai koto ni wa, henji ga dekimasen.) — Unless I see the materials, I cannot reply.</li>
</ul>
<h3>Grammar — 〜てはじめて (only after ~ did I ~)</h3>
<p><strong>[て-form] + はじめて</strong> = "it was only after ~ that ~". It stresses a realization reached only through experience.</p>
<ul>
<li>病気に なってはじめて、健康の 価値が 分かった。 (Byōki ni natte hajimete, kenkō no kachi ga wakatta.) — It was only after getting sick that I understood the value of health.</li>
<li>失敗してはじめて、努力の 大切さに 気づいた。 (Shippai shite hajimete, doryoku no taisetsusa ni kizuita.) — It was only after failing that I realized the importance of effort.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: この 機械、使い方が 難しいですか。
   Kono kikai, tsukaikata ga muzukashii desu ka.
B: 実際に 使って みないことには、分かりませんよ。
   Jissai ni tsukatte minai koto ni wa, wakarimasen yo.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜ないことには〜ない attaches to the ない-form and needs a negative second clause: nothing can proceed unless the condition is met. 〜てはじめて attaches to the て-form and looks back — you understood something only after living through it. One looks forward to a requirement; the other looks back at a realization.</div>`,
    `<span class="eyebrow">JPD346 · Bài 1</span>
<h2>Chỉ khi: điều kiện tất yếu</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>経験します</td><td>keiken shimasu</td><td>trải nghiệm</td></tr>
<tr><td>実際に</td><td>jissai ni</td><td>thực tế, trên thực tế</td></tr>
<tr><td>判断します</td><td>handan shimasu</td><td>phán đoán, đánh giá</td></tr>
<tr><td>価値</td><td>kachi</td><td>giá trị</td></tr>
<tr><td>努力します</td><td>doryoku shimasu</td><td>nỗ lực, cố gắng</td></tr>
</table>
<h3>Ngữ pháp — 〜ないことには〜ない (nếu không ~ thì không thể ~)</h3>
<p><strong>[thể ない] + ことには</strong> = "nếu không ~ thì". Nêu một điều kiện tất yếu, nên vế sau luôn phủ định hoặc chỉ sự bất khả.</p>
<ul>
<li>自分で やって みないことには、何も 分からない。 (Jibun de yatte minai koto ni wa, nani mo wakaranai.) — Nếu không tự mình thử làm thì chẳng hiểu được gì.</li>
<li>資料を 見ないことには、返事が できません。 (Shiryō o minai koto ni wa, henji ga dekimasen.) — Nếu không xem tài liệu thì tôi không thể trả lời.</li>
</ul>
<h3>Ngữ pháp — 〜てはじめて (phải đến khi ~ mới ~)</h3>
<p><strong>[thể て] + はじめて</strong> = "phải đến khi ~ mới ~". Nhấn mạnh sự nhận ra chỉ đạt được qua trải nghiệm.</p>
<ul>
<li>病気に なってはじめて、健康の 価値が 分かった。 (Byōki ni natte hajimete, kenkō no kachi ga wakatta.) — Phải đến khi đổ bệnh tôi mới hiểu giá trị của sức khỏe.</li>
<li>失敗してはじめて、努力の 大切さに 気づいた。 (Shippai shite hajimete, doryoku no taisetsusa ni kizuita.) — Phải đến khi thất bại tôi mới nhận ra tầm quan trọng của nỗ lực.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: この 機械、使い方が 難しいですか。
   Kono kikai, tsukaikata ga muzukashii desu ka.
B: 実際に 使って みないことには、分かりませんよ。
   Jissai ni tsukatte minai koto ni wa, wakarimasen yo.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜ないことには〜ない gắn vào thể ない và cần vế sau phủ định: chưa đủ điều kiện thì chưa làm được gì. 〜てはじめて gắn vào thể て và nhìn lại — bạn chỉ hiểu ra điều gì đó sau khi đã trải qua. Một mẫu nhìn tới điều kiện cần; mẫu kia nhìn lại sự nhận ra.</div>`,
  ]]);

const b1q = quiz('jpd346-quiz-1', 'Quiz 1 — Necessary condition|||Quiz 1 — Chỉ khi', [
  { id: 'q1', question: '"Nếu không tự làm thử thì chẳng hiểu được gì" dùng mẫu nào?|||"Unless you try it yourself, you will not understand" uses which?', options: ['やってみないことには', 'やってみたとたん', 'やってみるものの', 'やってみたばかりに'], correctIndex: 0, explanation: '〜ないことには〜ない: gắn thể ない, nêu điều kiện tất yếu, vế sau phủ định.' },
  { id: 'q2', question: 'Mẫu 〜てはじめて nhấn mạnh điều gì?|||What does 〜てはじめて emphasize?', options: ['phải đến khi trải qua ~ mới nhận ra|||realizing only after experiencing ~', 'một việc xảy ra bất ngờ|||a sudden event', 'điều trái với mong đợi|||something contrary to expectation', 'một nguyên nhân xấu|||a bad cause'], correctIndex: 0, explanation: '〜てはじめて gắn thể て, nhấn sự nhận ra chỉ có được sau khi trải nghiệm.' },
  { id: 'q3', question: 'Vế sau của 〜ないことには luôn ở dạng nào?|||The second clause after 〜ないことには is always in what form?', options: ['phủ định|||negative', 'khẳng định|||affirmative', 'nghi vấn|||interrogative', 'mệnh lệnh|||imperative'], correctIndex: 0, explanation: 'Vì là điều kiện tất yếu, vế sau luôn phủ định / bất khả: 見ないことには 分からない.' },
]);

const b2 = doc('jpd346-2-1-concession', 'Lesson 2 — Concession|||Bài 2 — Tuy nhưng: ものの, とはいえ',
  '〜ものの (tuy ~ nhưng — điều trái mong đợi đã xảy ra); 〜とはいえ (tuy nói là ~ nhưng — phản bác một tiền đề, văn viết).',
  [[
    `<span class="eyebrow">JPD346 · Lesson 2</span>
<h2>Concession: although yet</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>免許</td><td>menkyo</td><td>licence</td></tr>
<tr><td>実力</td><td>jitsuryoku</td><td>real ability</td></tr>
<tr><td>給料</td><td>kyūryō</td><td>salary</td></tr>
<tr><td>認めます</td><td>mitomemasu</td><td>to acknowledge / admit</td></tr>
<tr><td>現実</td><td>genjitsu</td><td>reality</td></tr>
</table>
<h3>Grammar — 〜ものの (although, but)</h3>
<p><strong>[plain form] + ものの</strong> = "although", marking that what you would expect from the first clause did not follow (な-adjective な / である, noun である).</p>
<ul>
<li>免許は 取ったものの、一度も 運転して いない。 (Menkyo wa totta monono, ichido mo unten shite inai.) — Although I got my licence, I have never once driven.</li>
<li>給料は 高いものの、仕事は とても 忙しい。 (Kyūryō wa takai monono, shigoto wa totemo isogashii.) — Although the salary is high, the work is very busy.</li>
</ul>
<h3>Grammar — 〜とはいえ (that said, even though)</h3>
<p><strong>[plain form / noun / な-adjective] + とはいえ</strong> = "although it is true that ~, still ~". It concedes a premise, then pushes back against it; it is somewhat formal and written.</p>
<ul>
<li>春とはいえ、まだ 寒い 日が 続いて いる。 (Haru to wa ie, mada samui hi ga tsuzuite iru.) — Although it is spring, cold days still continue.</li>
<li>実力が あるとはいえ、油断は 禁物だ。 (Jitsuryoku ga aru to wa ie, yudan wa kinmotsu da.) — Even though he has real ability, carelessness is forbidden.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 新しい 仕事は どう？
   Atarashii shigoto wa dō?
B: 給料は いいものの、残業が 多くて 大変だよ。
   Kyūryō wa ii monono, zangyō ga ōkute taihen da yo.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜ものの is "although", reporting that a natural expectation was not met; a noun takes である before it. 〜とはいえ concedes a stated premise ("granted it is spring, but...") and then contradicts it, and is more literary. Use ものの for a fact that fell short; use とはいえ to push back on something just claimed.</div>`,
    `<span class="eyebrow">JPD346 · Bài 2</span>
<h2>Tuy nhưng: nhượng bộ</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>免許</td><td>menkyo</td><td>giấy phép, bằng lái</td></tr>
<tr><td>実力</td><td>jitsuryoku</td><td>thực lực</td></tr>
<tr><td>給料</td><td>kyūryō</td><td>lương</td></tr>
<tr><td>認めます</td><td>mitomemasu</td><td>công nhận, thừa nhận</td></tr>
<tr><td>現実</td><td>genjitsu</td><td>hiện thực</td></tr>
</table>
<h3>Ngữ pháp — 〜ものの (tuy ~ nhưng)</h3>
<p><strong>[thể thường] + ものの</strong> = "tuy ~ nhưng", đánh dấu việc điều lẽ ra suy ra từ vế trước lại không xảy ra (tính từ な +な/である, danh từ +である).</p>
<ul>
<li>免許は 取ったものの、一度も 運転して いない。 (Menkyo wa totta monono, ichido mo unten shite inai.) — Tuy đã lấy bằng lái nhưng tôi chưa lái lần nào.</li>
<li>給料は 高いものの、仕事は とても 忙しい。 (Kyūryō wa takai monono, shigoto wa totemo isogashii.) — Tuy lương cao nhưng công việc rất bận.</li>
</ul>
<h3>Ngữ pháp — 〜とはいえ (tuy nói là ~ nhưng)</h3>
<p><strong>[thể thường / danh từ / tính từ な] + とはいえ</strong> = "tuy nói là ~ nhưng vẫn ~". Nó thừa nhận một tiền đề rồi phản bác lại; hơi trang trọng, thiên văn viết.</p>
<ul>
<li>春とはいえ、まだ 寒い 日が 続いて いる。 (Haru to wa ie, mada samui hi ga tsuzuite iru.) — Tuy nói là mùa xuân nhưng những ngày lạnh vẫn kéo dài.</li>
<li>実力が あるとはいえ、油断は 禁物だ。 (Jitsuryoku ga aru to wa ie, yudan wa kinmotsu da.) — Tuy có thực lực nhưng tuyệt đối không được chủ quan.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 新しい 仕事は どう？
   Atarashii shigoto wa dō?
B: 給料は いいものの、残業が 多くて 大変だよ。
   Kyūryō wa ii monono, zangyō ga ōkute taihen da yo.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜ものの là "tuy ~ nhưng", thuật lại việc một điều lẽ ra suy ra được lại không thành; danh từ gắn である trước nó. 〜とはいえ thừa nhận một tiền đề vừa nêu ("cứ cho là mùa xuân đi, nhưng...") rồi phản lại, và thiên văn chương hơn. Dùng ものの cho một sự thật hụt đi; dùng とはいえ để phản bác điều vừa được khẳng định.</div>`,
  ]]);

const b2q = quiz('jpd346-quiz-2', 'Quiz 2 — Concession|||Quiz 2 — Tuy nhưng', [
  { id: 'q1', question: 'Mẫu nào nghĩa "tuy ~ nhưng", nêu điều trái mong đợi đã xảy ra?|||Which means "although ~", a result contrary to expectation?', options: ['〜ものの', '〜からこそ', '〜ばかりに', '〜次第'], correctIndex: 0, explanation: '〜ものの nêu việc điều suy ra được từ vế trước lại không thành.' },
  { id: 'q2', question: '"Tuy nói là mùa xuân nhưng vẫn lạnh" dùng mẫu nào?|||"Although it is spring, it is still cold" uses which?', options: ['春とはいえ', '春だから', '春のあまり', '春かねない'], correctIndex: 0, explanation: '〜とはいえ thừa nhận tiền đề (mùa xuân) rồi phản bác (vẫn lạnh).' },
  { id: 'q3', question: 'Danh từ đứng trước ものの thì gắn thế nào? (ví dụ 学生)|||How does a noun attach before ものの? (e.g. 学生)', options: ['学生であるものの', '学生ものの', '学生のものの', '学生だものの'], correctIndex: 0, explanation: 'Danh từ + である + ものの: 学生であるものの. (とはいえ thì gắn thẳng: 学生とはいえ.)' },
]);

const b3 = doc('jpd346-3-1-single-cause-excess', 'Lesson 3 — Single cause & excess|||Bài 3 — Chỉ vì & quá nên: ばかりに, あまり',
  '〜ばかりに (chỉ vì ~ mà — một sơ suất dẫn tới hậu quả xấu); 〜あまり (vì quá ~ nên — mức độ thái quá dẫn tới kết quả).',
  [[
    `<span class="eyebrow">JPD346 · Lesson 3</span>
<h2>Single cause &amp; excess: just because / so much</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>不注意</td><td>fuchūi</td><td>carelessness</td></tr>
<tr><td>緊張します</td><td>kinchō shimasu</td><td>to be nervous / tense</td></tr>
<tr><td>心配</td><td>shinpai</td><td>worry</td></tr>
<tr><td>後悔します</td><td>kōkai shimasu</td><td>to regret</td></tr>
<tr><td>借金</td><td>shakkin</td><td>debt</td></tr>
</table>
<h3>Grammar — 〜ばかりに (just because ~, bad result)</h3>
<p><strong>[plain form] + ばかりに</strong> = "just because ~", singling out one cause that led to an unwanted result — it often carries regret (な-adjective な / だった, noun である / だった).</p>
<ul>
<li>お金が なかったばかりに、進学を あきらめた。 (Okane ga nakatta bakari ni, shingaku o akirameta.) — Just because I had no money, I gave up going on to higher study.</li>
<li>一言 多かったばかりに、彼を 怒らせて しまった。 (Hitokoto ōkatta bakari ni, kare o okorasete shimatta.) — Just because I said one word too many, I ended up angering him.</li>
</ul>
<h3>Grammar — 〜あまり (so much ~ that)</h3>
<p><strong>[noun の / verb dictionary form] + あまり</strong> = "because of too much ~, so ~ that ~". A high degree of emotion or action leads to a result.</p>
<ul>
<li>心配の あまり、夜も 眠れなかった。 (Shinpai no amari, yoru mo nemurenakatta.) — I was so worried that I could not sleep at night.</li>
<li>緊張する あまり、頭が 真っ白に なった。 (Kinchō suru amari, atama ga masshiro ni natta.) — I was so nervous that my mind went blank.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: どうして 後悔して いるの？
   Dōshite kōkai shite iru no?
B: 急いだ ばかりに、大事な 書類を 忘れたんだ。
   Isoida bakari ni, daiji na shorui o wasureta n da.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜ばかりに blames one specific cause for a bad outcome and often expresses regret over it. 〜あまり stresses an excessive degree (of worry, nervousness, joy) that produces a result; it takes noun の or a dictionary-form verb. ばかりに regrets a slip; あまり highlights "too much".</div>`,
    `<span class="eyebrow">JPD346 · Bài 3</span>
<h2>Chỉ vì &amp; quá nên</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>不注意</td><td>fuchūi</td><td>sự bất cẩn</td></tr>
<tr><td>緊張します</td><td>kinchō shimasu</td><td>căng thẳng, hồi hộp</td></tr>
<tr><td>心配</td><td>shinpai</td><td>sự lo lắng</td></tr>
<tr><td>後悔します</td><td>kōkai shimasu</td><td>hối hận</td></tr>
<tr><td>借金</td><td>shakkin</td><td>nợ, khoản nợ</td></tr>
</table>
<h3>Ngữ pháp — 〜ばかりに (chỉ vì ~ mà; hậu quả xấu)</h3>
<p><strong>[thể thường] + ばかりに</strong> = "chỉ vì ~ mà", nhấn một nguyên nhân duy nhất dẫn tới kết quả không mong muốn — thường mang sự tiếc nuối (tính từ な +な/だった, danh từ +である/だった).</p>
<ul>
<li>お金が なかったばかりに、進学を あきらめた。 (Okane ga nakatta bakari ni, shingaku o akirameta.) — Chỉ vì không có tiền mà tôi đã từ bỏ việc học lên.</li>
<li>一言 多かったばかりに、彼を 怒らせて しまった。 (Hitokoto ōkatta bakari ni, kare o okorasete shimatta.) — Chỉ vì lỡ nói dư một câu mà tôi làm anh ấy nổi giận.</li>
</ul>
<h3>Ngữ pháp — 〜あまり (vì quá ~ nên)</h3>
<p><strong>[danh từ の / động từ thể từ điển] + あまり</strong> = "vì quá ~ nên ~". Mức độ cảm xúc hay hành động quá cao dẫn tới một kết quả.</p>
<ul>
<li>心配の あまり、夜も 眠れなかった。 (Shinpai no amari, yoru mo nemurenakatta.) — Vì quá lo lắng nên tôi cả đêm cũng không ngủ được.</li>
<li>緊張する あまり、頭が 真っ白に なった。 (Kinchō suru amari, atama ga masshiro ni natta.) — Vì quá căng thẳng nên đầu óc tôi trắng xóa.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: どうして 後悔して いるの？
   Dōshite kōkai shite iru no?
B: 急いだ ばかりに、大事な 書類を 忘れたんだ。
   Isoida bakari ni, daiji na shorui o wasureta n da.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜ばかりに đổ lỗi cho một nguyên nhân cụ thể dẫn tới kết quả xấu và thường tỏ sự tiếc nuối. 〜あまり nhấn mức độ thái quá (lo lắng, căng thẳng, vui mừng) sinh ra kết quả; đi với danh từ の hoặc động từ thể từ điển. ばかりに tiếc một sơ suất; あまり làm nổi cái "quá mức".</div>`,
  ]]);

const b3q = quiz('jpd346-quiz-3', 'Quiz 3 — Single cause & excess|||Quiz 3 — Chỉ vì & quá nên', [
  { id: 'q1', question: '"Chỉ vì không có tiền mà phải bỏ học" (một sơ suất → hậu quả xấu) dùng mẫu nào?|||"Just because I had no money, I gave up studying" uses which?', options: ['お金が なかったばかりに', 'お金が ないあまり', 'お金が ないものの', 'お金が ない次第'], correctIndex: 0, explanation: '〜ばかりに nhấn một nguyên nhân duy nhất dẫn tới kết quả xấu, kèm tiếc nuối.' },
  { id: 'q2', question: '"Vì quá lo lắng nên không ngủ được" (mức độ quá cao) dùng mẫu nào?|||"So worried that I could not sleep" (excessive degree) uses which?', options: ['心配の あまり', '心配の ばかりに', '心配の おかげで', '心配の くせに'], correctIndex: 0, explanation: '〜あまり: mức độ (lo lắng) quá cao dẫn tới kết quả; danh từ + の + あまり.' },
  { id: 'q3', question: 'Khác nhau chính giữa 〜ばかりに và 〜あまり là gì?|||Key difference between 〜ばかりに and 〜あまり?', options: ['ばかりに: tiếc một sơ suất → hậu quả xấu; あまり: nhấn mức độ thái quá|||ばかりに: regret over one cause; あまり: excessive degree', 'không khác gì|||no difference', 'cả hai đều chỉ tương lai|||both refer to the future', 'あまり chỉ dùng khi kết quả tốt|||あまり is only for good results'], correctIndex: 0, explanation: 'ばかりに đổ lỗi một nguyên nhân dẫn tới điều xấu; あまり nhấn "quá mức" sinh ra kết quả.' },
]);

const b4 = doc('jpd346-4-1-inability-bad-possibility', 'Lesson 4 — Inability & bad possibility|||Bài 4 — Khó & có thể xấu: かねる, かねない',
  '〜かねる (khó lòng ~, không thể ~ — từ chối lịch sự); 〜かねない (có thể ~ — một khả năng tiêu cực).',
  [[
    `<span class="eyebrow">JPD346 · Lesson 4</span>
<h2>Inability &amp; bad possibility</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>回答します</td><td>kaitō shimasu</td><td>to reply / respond</td></tr>
<tr><td>責任</td><td>sekinin</td><td>responsibility</td></tr>
<tr><td>無理</td><td>muri</td><td>overdoing / unreasonable</td></tr>
<tr><td>引き受けます</td><td>hikiukemasu</td><td>to take on / undertake</td></tr>
<tr><td>命</td><td>inochi</td><td>life</td></tr>
</table>
<h3>Grammar — 〜かねる (cannot, find it hard to)</h3>
<p><strong>[ます-stem] + かねる</strong> = "cannot ~, be unable to ~". It is a polite, formal way to decline, common in business Japanese.</p>
<ul>
<li>その 件に つきましては、お答えしかねます。 (Sono ken ni tsukimashite wa, okotae shikanemasu.) — I am unable to answer regarding that matter.</li>
<li>私 一人では、判断しかねます。 (Watashi hitori de wa, handan shikanemasu.) — I alone cannot make that judgment.</li>
</ul>
<h3>Grammar — 〜かねない (might, could well, bad outcome)</h3>
<p><strong>[ます-stem] + かねない</strong> = "might ~, could well ~", used only for a negative, undesirable possibility.</p>
<ul>
<li>そんな 無理を 続けると、病気に なりかねない。 (Sonna muri o tsuzukeru to, byōki ni narikanenai.) — If you keep overdoing it, you could well get sick.</li>
<li>スピードの 出しすぎは、事故を 起こしかねない。 (Supīdo no dashisugi wa, jiko o okoshikanenai.) — Excessive speed could cause an accident.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: この 条件で 契約できますか。
   Kono jōken de keiyaku dekimasu ka.
B: 申し訳 ありませんが、その 条件では 引き受けかねます。
   Mōshiwake arimasen ga, sono jōken de wa hikiuke kanemasu.
</code></pre>
<div class="callout"><span class="badge">Note</span> Both attach to the ます-stem but mean opposite things. 〜かねる = "cannot / find it hard to", a formal, softened refusal (お答えしかねます). 〜かねない = "might, could well", always about a bad possibility (事故を 起こしかねない). Do not confuse "unable to do it" with "it might happen".</div>`,
    `<span class="eyebrow">JPD346 · Bài 4</span>
<h2>Khó &amp; có thể xấu</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>回答します</td><td>kaitō shimasu</td><td>trả lời, hồi đáp</td></tr>
<tr><td>責任</td><td>sekinin</td><td>trách nhiệm</td></tr>
<tr><td>無理</td><td>muri</td><td>quá sức, vô lý</td></tr>
<tr><td>引き受けます</td><td>hikiukemasu</td><td>nhận lãnh, đảm nhận</td></tr>
<tr><td>命</td><td>inochi</td><td>tính mạng, sinh mạng</td></tr>
</table>
<h3>Ngữ pháp — 〜かねる (khó lòng ~, không thể ~)</h3>
<p><strong>[đuôi ます] + かねる</strong> = "khó lòng ~, không thể ~". Là cách từ chối lịch sự, trang trọng, hay gặp trong tiếng Nhật thương mại.</p>
<ul>
<li>その 件に つきましては、お答えしかねます。 (Sono ken ni tsukimashite wa, okotae shikanemasu.) — Về việc đó thì tôi khó lòng trả lời được.</li>
<li>私 一人では、判断しかねます。 (Watashi hitori de wa, handan shikanemasu.) — Một mình tôi thì không thể phán đoán được.</li>
</ul>
<h3>Ngữ pháp — 〜かねない (có thể ~; kết quả xấu)</h3>
<p><strong>[đuôi ます] + かねない</strong> = "có thể ~, e rằng ~", chỉ dùng cho một khả năng tiêu cực, không mong muốn.</p>
<ul>
<li>そんな 無理を 続けると、病気に なりかねない。 (Sonna muri o tsuzukeru to, byōki ni narikanenai.) — Cứ làm quá sức thế thì có thể sinh bệnh đấy.</li>
<li>スピードの 出しすぎは、事故を 起こしかねない。 (Supīdo no dashisugi wa, jiko o okoshikanenai.) — Chạy quá tốc độ có thể gây tai nạn.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: この 条件で 契約できますか。
   Kono jōken de keiyaku dekimasu ka.
B: 申し訳 ありませんが、その 条件では 引き受けかねます。
   Mōshiwake arimasen ga, sono jōken de wa hikiuke kanemasu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Cả hai gắn vào đuôi ます nhưng nghĩa ngược nhau. 〜かねる = "không thể / khó lòng", một lời từ chối trang trọng, làm nhẹ (お答えしかねます). 〜かねない = "có thể, e rằng", luôn nói về khả năng xấu (事故を 起こしかねない). Đừng lẫn "không làm được" với "có thể xảy ra".</div>`,
  ]]);

const b4q = quiz('jpd346-quiz-4', 'Quiz 4 — Inability & bad possibility|||Quiz 4 — Khó & có thể xấu', [
  { id: 'q1', question: 'Cách TỪ CHỐI lịch sự "khó lòng trả lời được" dùng mẫu nào?|||The polite refusal "I am unable to answer" uses which?', options: ['お答えしかねます', 'お答えしかねません', '答えるものの', '答えざるを得ません'], correctIndex: 0, explanation: '〜かねる (đuôi ます + かねる) là cách từ chối lịch sự: お答えしかねます.' },
  { id: 'q2', question: '"Cứ làm quá sức thì có thể sinh bệnh" (khả năng xấu) dùng mẫu nào?|||"You could well get sick" (bad possibility) uses which?', options: ['病気に なりかねない', '病気に なりかねる', '病気に なるものの', '病気に なるあまり'], correctIndex: 0, explanation: '〜かねない (đuôi ます + かねない) chỉ một khả năng tiêu cực.' },
  { id: 'q3', question: 'Nghĩa của 〜かねる và 〜かねない khác nhau thế nào?|||How do 〜かねる and 〜かねない differ?', options: ['かねる = không thể/khó làm; かねない = có thể xảy ra (điều xấu)|||かねる = cannot do; かねない = might happen (bad)', 'giống hệt nhau|||identical', 'cả hai đều là lời khuyên|||both are advice', 'かねない = không thể làm|||かねない = cannot do'], correctIndex: 0, explanation: 'かねる = bất khả (khó làm); かねない = có thể xảy ra điều xấu. Ngược nghĩa dù cùng gắn đuôi ます.' },
]);

const b5 = doc('jpd346-5-1-starting-point', 'Lesson 5 — Starting point|||Bài 5 — Nhân dịp: をきっかけに, を契機に',
  '〜をきっかけに (nhân dịp ~, lấy ~ làm động cơ — trung tính); 〜を契機に (nhân dịp ~ — trang trọng, văn viết, sự kiện lớn).',
  [[
    `<span class="eyebrow">JPD346 · Lesson 5</span>
<h2>Starting point: taking ~ as an opportunity</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>留学</td><td>ryūgaku</td><td>studying abroad</td></tr>
<tr><td>定年</td><td>teinen</td><td>retirement age</td></tr>
<tr><td>事件</td><td>jiken</td><td>incident / affair</td></tr>
<tr><td>出会い</td><td>deai</td><td>encounter / meeting</td></tr>
<tr><td>転職します</td><td>tenshoku shimasu</td><td>to change jobs</td></tr>
</table>
<h3>Grammar — 〜をきっかけに(して) (with ~ as a trigger)</h3>
<p><strong>[noun] + をきっかけに</strong> = "with ~ as the trigger / prompted by ~", marking the event that started a change. It is neutral and everyday.</p>
<ul>
<li>留学を きっかけに、日本の 文化に 興味を 持った。 (Ryūgaku o kikkake ni, Nihon no bunka ni kyōmi o motta.) — My study abroad was what got me interested in Japanese culture.</li>
<li>病気を きっかけに、生活習慣を 見直した。 (Byōki o kikkake ni, seikatsu shūkan o minaoshita.) — The illness prompted me to review my lifestyle.</li>
</ul>
<h3>Grammar — 〜を契機に(して) (on the occasion of; formal)</h3>
<p><strong>[noun] + を契機に</strong> means the same as をきっかけに but is more formal and written, often used with major events.</p>
<ul>
<li>定年を 契機に、田舎で 暮らし 始めた。 (Teinen o keiki ni, inaka de kurashi hajimeta.) — Taking retirement as the occasion, I began living in the countryside.</li>
<li>事件を 契機に、法律が 改正された。 (Jiken o keiki ni, hōritsu ga kaisei sareta.) — The incident became the occasion for the law to be revised.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: どうして 日本語を 勉強し 始めたんですか。
   Dōshite nihongo o benkyō shi hajimeta n desu ka.
B: アニメとの 出会いを きっかけに、始めました。
   Anime to no deai o kikkake ni, hajimemashita.
</code></pre>
<div class="callout"><span class="badge">Note</span> Both attach to a noun and mean "taking ~ as an opportunity / prompted by ~". 〜をきっかけに is the neutral, everyday choice; 〜を契機に is its formal, written twin, favoured for weighty events (retirement, an incident, a reform). Same structure, different register.</div>`,
    `<span class="eyebrow">JPD346 · Bài 5</span>
<h2>Nhân dịp: lấy ~ làm mốc khởi đầu</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>留学</td><td>ryūgaku</td><td>du học</td></tr>
<tr><td>定年</td><td>teinen</td><td>tuổi nghỉ hưu</td></tr>
<tr><td>事件</td><td>jiken</td><td>vụ việc, sự kiện</td></tr>
<tr><td>出会い</td><td>deai</td><td>cuộc gặp gỡ</td></tr>
<tr><td>転職します</td><td>tenshoku shimasu</td><td>chuyển việc</td></tr>
</table>
<h3>Ngữ pháp — 〜をきっかけに(して) (nhân dịp ~, lấy ~ làm động cơ)</h3>
<p><strong>[danh từ] + をきっかけに</strong> = "nhân dịp ~, nhờ ~ mà bắt đầu", đánh dấu sự việc mở đầu cho một thay đổi. Trung tính, thường ngày.</p>
<ul>
<li>留学を きっかけに、日本の 文化に 興味を 持った。 (Ryūgaku o kikkake ni, Nihon no bunka ni kyōmi o motta.) — Nhân dịp du học, tôi bắt đầu quan tâm đến văn hóa Nhật.</li>
<li>病気を きっかけに、生活習慣を 見直した。 (Byōki o kikkake ni, seikatsu shūkan o minaoshita.) — Nhân trận ốm, tôi đã xem lại thói quen sinh hoạt.</li>
</ul>
<h3>Ngữ pháp — 〜を契機に(して) (nhân dịp ~; trang trọng)</h3>
<p><strong>[danh từ] + を契機に</strong> nghĩa như をきっかけに nhưng trang trọng, thiên văn viết, thường dùng với sự kiện lớn.</p>
<ul>
<li>定年を 契機に、田舎で 暮らし 始めた。 (Teinen o keiki ni, inaka de kurashi hajimeta.) — Nhân dịp nghỉ hưu, tôi bắt đầu sống ở quê.</li>
<li>事件を 契機に、法律が 改正された。 (Jiken o keiki ni, hōritsu ga kaisei sareta.) — Nhân vụ việc đó, luật đã được sửa đổi.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: どうして 日本語を 勉強し 始めたんですか。
   Dōshite nihongo o benkyō shi hajimeta n desu ka.
B: アニメとの 出会いを きっかけに、始めました。
   Anime to no deai o kikkake ni, hajimemashita.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Cả hai gắn vào danh từ, nghĩa "nhân dịp ~ / lấy ~ làm mốc khởi đầu". 〜をきっかけに là lựa chọn trung tính thường ngày; 〜を契機に là bản trang trọng, văn viết, ưu tiên cho sự kiện nặng ký (nghỉ hưu, vụ việc, cải cách). Cùng cấu trúc, khác văn phong.</div>`,
  ]]);

const b5q = quiz('jpd346-quiz-5', 'Quiz 5 — Starting point|||Quiz 5 — Nhân dịp', [
  { id: 'q1', question: 'Mẫu nào nghĩa "nhân dịp ~, lấy ~ làm động cơ" (trung tính, thường ngày)?|||Which means "taking ~ as a trigger" (neutral, everyday)?', options: ['〜をきっかけに', '〜を契機に', '〜に基づいて', '〜に沿って'], correctIndex: 0, explanation: '〜をきっかけに là cách trung tính, thường ngày; を契機に mới là bản trang trọng.' },
  { id: 'q2', question: 'Bản TRANG TRỌNG, văn viết của 〜をきっかけに là mẫu nào?|||Which is the formal, written equivalent of 〜をきっかけに?', options: ['〜を契機に', '〜のあまり', '〜ものの', '〜つつも'], correctIndex: 0, explanation: '〜を契機に (けいき) trang trọng hơn, hay dùng với sự kiện lớn: 定年を 契機に.' },
  { id: 'q3', question: '〜をきっかけに gắn với thành phần nào?|||〜をきっかけに attaches to what?', options: ['danh từ|||a noun', 'thể た|||the た-form', 'đuôi ます|||the ます-stem', 'thể ない|||the ない-form'], correctIndex: 0, explanation: 'Gắn thẳng vào danh từ: 留学を きっかけに, 事件を 契機に.' },
]);

const b6 = doc('jpd346-6-1-basis-guideline', 'Lesson 6 — Basis & guideline|||Bài 6 — Dựa trên & theo: に基づいて, に沿って',
  '〜に基づいて (dựa trên ~ làm căn cứ — bổ nghĩa に基づく/に基づいた); 〜に沿って (theo đúng ~, bám theo đường lối — bổ nghĩa に沿った).',
  [[
    `<span class="eyebrow">JPD346 · Lesson 6</span>
<h2>Basis &amp; guideline: based on / in accordance with</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>事実</td><td>jijitsu</td><td>fact</td></tr>
<tr><td>規則</td><td>kisoku</td><td>rule / regulation</td></tr>
<tr><td>計画</td><td>keikaku</td><td>plan</td></tr>
<tr><td>資料</td><td>shiryō</td><td>data / materials</td></tr>
<tr><td>方針</td><td>hōshin</td><td>policy / course</td></tr>
</table>
<h3>Grammar — 〜に基づいて (based on ~)</h3>
<p><strong>[noun] + に基づいて</strong> = "based on ~", where the noun is the evidence or foundation. The modifier form is <strong>に基づく / に基づいた</strong>.</p>
<ul>
<li>この 小説は 事実に 基づいて 書かれた。 (Kono shōsetsu wa jijitsu ni motozuite kakareta.) — This novel was written based on facts.</li>
<li>アンケートの 結果に 基づいて、計画を 立てる。 (Ankēto no kekka ni motozuite, keikaku o tateru.) — We make the plan based on the survey results.</li>
</ul>
<h3>Grammar — 〜に沿って (along ~, in accordance with ~)</h3>
<p><strong>[noun] + に沿って</strong> = "along / in line with ~", following a set course, plan or rule. The modifier form is <strong>に沿った</strong>.</p>
<ul>
<li>マニュアルに 沿って、作業を 進めて ください。 (Manyuaru ni sotte, sagyō o susumete kudasai.) — Please carry out the work in accordance with the manual.</li>
<li>会社の 方針に 沿って、計画を 変更した。 (Kaisha no hōshin ni sotte, keikaku o henkō shita.) — We changed the plan in line with the company policy.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 報告書は どう 書けば いいですか。
   Hōkokusho wa dō kakeba ii desu ka.
B: 事実に 基づいて、正確に 書いて ください。
   Jijitsu ni motozuite, seikaku ni kaite kudasai.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜に基づいて looks to the SOURCE that something rests on — facts, data, a law (modifier に基づく / に基づいた). 〜に沿って looks to a LINE you keep to — a plan, policy or manual laid out in advance (modifier に沿った). Basis vs following a set course.</div>`,
    `<span class="eyebrow">JPD346 · Bài 6</span>
<h2>Dựa trên &amp; theo</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>事実</td><td>jijitsu</td><td>sự thật, sự việc có thật</td></tr>
<tr><td>規則</td><td>kisoku</td><td>quy tắc, nội quy</td></tr>
<tr><td>計画</td><td>keikaku</td><td>kế hoạch</td></tr>
<tr><td>資料</td><td>shiryō</td><td>tài liệu, dữ liệu</td></tr>
<tr><td>方針</td><td>hōshin</td><td>phương châm, đường lối</td></tr>
</table>
<h3>Ngữ pháp — 〜に基づいて (dựa trên ~ làm căn cứ)</h3>
<p><strong>[danh từ] + に基づいて</strong> = "dựa trên ~", trong đó danh từ là căn cứ hay nền tảng. Dạng bổ nghĩa là <strong>に基づく / に基づいた</strong>.</p>
<ul>
<li>この 小説は 事実に 基づいて 書かれた。 (Kono shōsetsu wa jijitsu ni motozuite kakareta.) — Cuốn tiểu thuyết này được viết dựa trên sự thật.</li>
<li>アンケートの 結果に 基づいて、計画を 立てる。 (Ankēto no kekka ni motozuite, keikaku o tateru.) — Chúng tôi lập kế hoạch dựa trên kết quả khảo sát.</li>
</ul>
<h3>Ngữ pháp — 〜に沿って (theo đúng ~, bám theo)</h3>
<p><strong>[danh từ] + に沿って</strong> = "theo, dọc theo ~", làm đúng theo một đường lối, kế hoạch hay quy tắc đã định. Dạng bổ nghĩa là <strong>に沿った</strong>.</p>
<ul>
<li>マニュアルに 沿って、作業を 進めて ください。 (Manyuaru ni sotte, sagyō o susumete kudasai.) — Xin hãy tiến hành công việc theo đúng bản hướng dẫn.</li>
<li>会社の 方針に 沿って、計画を 変更した。 (Kaisha no hōshin ni sotte, keikaku o henkō shita.) — Chúng tôi đổi kế hoạch theo đường lối của công ty.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 報告書は どう 書けば いいですか。
   Hōkokusho wa dō kakeba ii desu ka.
B: 事実に 基づいて、正確に 書いて ください。
   Jijitsu ni motozuite, seikaku ni kaite kudasai.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜に基づいて nhìn về CĂN CỨ mà mọi thứ dựa vào — sự thật, dữ liệu, luật (bổ nghĩa に基づく / に基づいた). 〜に沿って nhìn về TUYẾN mà ta bám theo — kế hoạch, đường lối hay bản hướng dẫn đã vạch sẵn (bổ nghĩa に沿った). Căn cứ và bám theo một tuyến đã định.</div>`,
  ]]);

const b6q = quiz('jpd346-quiz-6', 'Quiz 6 — Basis & guideline|||Quiz 6 — Dựa trên & theo', [
  { id: 'q1', question: '"Viết báo cáo DỰA TRÊN sự thật (làm căn cứ)" dùng mẫu nào?|||"Write the report based on facts" uses which?', options: ['事実に 基づいて', '事実に 沿って', '事実を めぐって', '事実の あまり'], correctIndex: 0, explanation: '〜に基づいて: danh từ là căn cứ/nền tảng. 事実に 基づいて 書く.' },
  { id: 'q2', question: '"Tiến hành công việc THEO đúng bản hướng dẫn (bám theo)" dùng mẫu nào?|||"Proceed in accordance with the manual" uses which?', options: ['マニュアルに 沿って', 'マニュアルに 基づいて', 'マニュアルを きっかけに', 'マニュアルとはいえ'], correctIndex: 0, explanation: '〜に沿って: bám theo một tuyến đã định (kế hoạch, đường lối, hướng dẫn).' },
  { id: 'q3', question: 'Dạng bổ nghĩa danh từ của 〜に基づいて là gì?|||The noun-modifying form of 〜に基づいて is?', options: ['に基づく', 'に基づいで', 'に基づき', 'に基づけば'], correctIndex: 0, explanation: 'に基づいて → bổ nghĩa danh từ dùng に基づく / に基づいた: 事実に基づく判断.' },
]);

const b7 = doc('jpd346-7-1-process-contradiction', 'Lesson 7 — Process & contradiction|||Bài 7 — Đang dần & vừa vừa: つつある, つつも',
  '〜つつある (đang dần ~ — một quá trình biến đổi đang tiến triển); 〜つつ(も) (vừa ~ vừa / dù ~ vẫn — nhượng bộ, mâu thuẫn, văn viết).',
  [[
    `<span class="eyebrow">JPD346 · Lesson 7</span>
<h2>Process &amp; contradiction</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>景気</td><td>keiki</td><td>business conditions / economy</td></tr>
<tr><td>回復します</td><td>kaifuku shimasu</td><td>to recover</td></tr>
<tr><td>増加します</td><td>zōka shimasu</td><td>to increase</td></tr>
<tr><td>変化します</td><td>henka shimasu</td><td>to change</td></tr>
<tr><td>高齢化</td><td>kōreika</td><td>ageing (of a population)</td></tr>
</table>
<h3>Grammar — 〜つつある (be in the process of ~ing)</h3>
<p><strong>[ます-stem] + つつある</strong> = "be gradually ~ing", describing a change that is steadily under way. It is more formal than 〜ている.</p>
<ul>
<li>景気は 少しずつ 回復しつつある。 (Keiki wa sukoshi zutsu kaifuku shitsutsu aru.) — The economy is gradually recovering.</li>
<li>日本の 人口は 減りつつある。 (Nihon no jinkō wa heritsutsu aru.) — Japan's population is steadily decreasing.</li>
</ul>
<h3>Grammar — 〜つつ(も) (even while ~ing)</h3>
<p><strong>[ます-stem] + つつも</strong> = "even though ~, while ~". With も it stresses a contradiction — doing one thing while feeling or knowing the opposite. It is literary, close to ながらも.</p>
<ul>
<li>体に 悪いと 知りつつも、たばこが やめられない。 (Karada ni warui to shiritsutsu mo, tabako ga yamerarenai.) — Even though I know it is bad for me, I cannot quit smoking.</li>
<li>悪いと 思いつつも、つい 嘘を ついて しまった。 (Warui to omoitsutsu mo, tsui uso o tsuite shimatta.) — Even though I felt it was wrong, I ended up lying.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 最近、高齢化が 進んで いますね。
   Saikin, kōreika ga susunde imasu ne.
B: ええ、社会は 大きく 変化しつつ ありますね。
   Ee, shakai wa ōkiku henka shitsutsu arimasu ne.
</code></pre>
<div class="callout"><span class="badge">Note</span> Both attach to the ます-stem but do different jobs. 〜つつある = a change in progress ("gradually ~ing"), formal. 〜つつも = concession ("even while ~"), stressing a contradiction between two clauses, close to ながらも and literary. Process vs contradiction.</div>`,
    `<span class="eyebrow">JPD346 · Bài 7</span>
<h2>Đang dần &amp; vừa vừa</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>景気</td><td>keiki</td><td>tình hình kinh tế</td></tr>
<tr><td>回復します</td><td>kaifuku shimasu</td><td>hồi phục</td></tr>
<tr><td>増加します</td><td>zōka shimasu</td><td>tăng lên</td></tr>
<tr><td>変化します</td><td>henka shimasu</td><td>biến đổi, thay đổi</td></tr>
<tr><td>高齢化</td><td>kōreika</td><td>sự già hóa (dân số)</td></tr>
</table>
<h3>Ngữ pháp — 〜つつある (đang dần ~)</h3>
<p><strong>[đuôi ます] + つつある</strong> = "đang dần ~", tả một sự biến đổi đang đều đặn tiến triển. Trang trọng hơn 〜ている.</p>
<ul>
<li>景気は 少しずつ 回復しつつある。 (Keiki wa sukoshi zutsu kaifuku shitsutsu aru.) — Nền kinh tế đang dần hồi phục.</li>
<li>日本の 人口は 減りつつある。 (Nihon no jinkō wa heritsutsu aru.) — Dân số Nhật đang giảm dần.</li>
</ul>
<h3>Ngữ pháp — 〜つつ(も) (vừa ~ vừa / dù ~ vẫn)</h3>
<p><strong>[đuôi ます] + つつも</strong> = "dù ~ vẫn, vừa ~ vừa". Có も thì nhấn mâu thuẫn — làm một việc trong khi cảm thấy hay biết điều ngược lại. Thiên văn viết, gần với ながらも.</p>
<ul>
<li>体に 悪いと 知りつつも、たばこが やめられない。 (Karada ni warui to shiritsutsu mo, tabako ga yamerarenai.) — Dù biết là có hại cho cơ thể, tôi vẫn không bỏ được thuốc lá.</li>
<li>悪いと 思いつつも、つい 嘘を ついて しまった。 (Warui to omoitsutsu mo, tsui uso o tsuite shimatta.) — Dù thấy là sai, tôi vẫn lỡ nói dối.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 最近、高齢化が 進んで いますね。
   Saikin, kōreika ga susunde imasu ne.
B: ええ、社会は 大きく 変化しつつ ありますね。
   Ee, shakai wa ōkiku henka shitsutsu arimasu ne.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Cả hai gắn vào đuôi ます nhưng làm việc khác nhau. 〜つつある = một biến đổi đang diễn ra ("đang dần ~"), trang trọng. 〜つつも = nhượng bộ ("dù ~ vẫn"), nhấn mâu thuẫn giữa hai vế, gần với ながらも và thiên văn chương. Quá trình và mâu thuẫn.</div>`,
  ]]);

const b7q = quiz('jpd346-quiz-7', 'Quiz 7 — Process & contradiction|||Quiz 7 — Đang dần & vừa vừa', [
  { id: 'q1', question: '"Nền kinh tế đang dần hồi phục" (quá trình đang tiến triển) dùng mẫu nào?|||"The economy is gradually recovering" uses which?', options: ['回復しつつある', '回復しつつも', '回復するものの', '回復するあまり'], correctIndex: 0, explanation: '〜つつある: một quá trình biến đổi đang đều đặn tiến triển.' },
  { id: 'q2', question: '"Biết là có hại mà vẫn không bỏ được" (dù ~ vẫn, mâu thuẫn) dùng mẫu nào?|||"Even though I know it is harmful, I cannot quit" uses which?', options: ['知りつつも', '知りつつある', '知るものの', '知る次第'], correctIndex: 0, explanation: '〜つつも nhấn mâu thuẫn: biết là sai nhưng vẫn làm; gần với ながらも.' },
  { id: 'q3', question: '〜つつある và 〜つつも gắn vào phần nào của động từ?|||〜つつある and 〜つつも attach to which part of the verb?', options: ['đuôi ます (ます-stem)|||the ます-stem', 'thể た|||the た-form', 'thể từ điển|||the dictionary form', 'thể ない|||the ない-form'], correctIndex: 0, explanation: 'Gắn vào đuôi ます: 回復する → 回復しつつある, 知る → 知りつつも.' },
]);

const b8 = doc('jpd346-8-1-compulsion', 'Lesson 8 — Compulsion|||Bài 8 — Buộc phải & không thể không: ざるを得ない, ずにはいられない',
  '〜ざるを得ない (buộc phải ~ — do hoàn cảnh bên ngoài ép); 〜ずにはいられない (không thể không ~ — do thôi thúc bên trong không kìm được). する → せざるを得ない / せずにはいられない.',
  [[
    `<span class="eyebrow">JPD346 · Lesson 8</span>
<h2>Compulsion: no choice but to / cannot help but</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>命令</td><td>meirei</td><td>order / command</td></tr>
<tr><td>従います</td><td>shitagaimasu</td><td>to obey / follow</td></tr>
<tr><td>感動します</td><td>kandō shimasu</td><td>to be moved (emotionally)</td></tr>
<tr><td>中止します</td><td>chūshi shimasu</td><td>to call off / cancel</td></tr>
<tr><td>涙</td><td>namida</td><td>tears</td></tr>
</table>
<h3>Grammar — 〜ざるを得ない (have no choice but to ~)</h3>
<p><strong>[ない-form minus ない] + ざるを得ない</strong> = "have no choice but to ~", forced by outside circumstances. The exception is <strong>する → せざるを得ない</strong>.</p>
<ul>
<li>上司の 命令だから、従わざるを 得ない。 (Jōshi no meirei da kara, shitagawazaru o enai.) — Since it is the boss's order, I have no choice but to obey.</li>
<li>台風の ため、試合は 中止せざるを 得なかった。 (Taifū no tame, shiai wa chūshi sezaru o enakatta.) — Because of the typhoon, we had no choice but to call off the match.</li>
</ul>
<h3>Grammar — 〜ずにはいられない (cannot help ~ing)</h3>
<p><strong>[ない-form minus ない] + ずにはいられない</strong> = "cannot help ~ing", driven by an inner impulse you cannot hold back. The exception is <strong>する → せずにはいられない</strong>.</p>
<ul>
<li>あの 映画を 見ると、感動して 泣かずには いられない。 (Ano eiga o miru to, kandō shite nakazu ni wa irarenai.) — When I watch that film, I am so moved I cannot help but cry.</li>
<li>おかしくて、笑わずには いられなかった。 (Okashikute, warawazu ni wa irarenakatta.) — It was so funny I could not help laughing.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 残業、また 頼まれたの？
   Zangyō, mata tanomareta no?
B: うん。締め切りが 近いから、やらざるを 得ないよ。
   Un. Shimekiri ga chikai kara, yarazaru o enai yo.
</code></pre>
<div class="callout"><span class="badge">Note</span> Both attach to the ない-form (drop ない) and both mean a strong "must", but the force differs. 〜ざるを得ない = compelled from OUTSIDE (an order, the weather) — you would rather not. 〜ずにはいられない = an inner impulse you cannot suppress (crying, laughing). する becomes せ in both: せざるを得ない, せずにはいられない.</div>`,
    `<span class="eyebrow">JPD346 · Bài 8</span>
<h2>Buộc phải &amp; không thể không</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>命令</td><td>meirei</td><td>mệnh lệnh</td></tr>
<tr><td>従います</td><td>shitagaimasu</td><td>tuân theo, phục tùng</td></tr>
<tr><td>感動します</td><td>kandō shimasu</td><td>xúc động, cảm động</td></tr>
<tr><td>中止します</td><td>chūshi shimasu</td><td>hủy, đình chỉ</td></tr>
<tr><td>涙</td><td>namida</td><td>nước mắt</td></tr>
</table>
<h3>Ngữ pháp — 〜ざるを得ない (buộc phải ~)</h3>
<p><strong>[thể ない bỏ ない] + ざるを得ない</strong> = "buộc phải ~", do hoàn cảnh bên ngoài ép. Ngoại lệ là <strong>する → せざるを得ない</strong>.</p>
<ul>
<li>上司の 命令だから、従わざるを 得ない。 (Jōshi no meirei da kara, shitagawazaru o enai.) — Vì là lệnh của cấp trên nên tôi buộc phải tuân theo.</li>
<li>台風の ため、試合は 中止せざるを 得なかった。 (Taifū no tame, shiai wa chūshi sezaru o enakatta.) — Vì bão, trận đấu buộc phải hủy.</li>
</ul>
<h3>Ngữ pháp — 〜ずにはいられない (không thể không ~)</h3>
<p><strong>[thể ない bỏ ない] + ずにはいられない</strong> = "không thể không ~", do một thôi thúc bên trong không kìm được. Ngoại lệ là <strong>する → せずにはいられない</strong>.</p>
<ul>
<li>あの 映画を 見ると、感動して 泣かずには いられない。 (Ano eiga o miru to, kandō shite nakazu ni wa irarenai.) — Cứ xem phim đó là tôi xúc động không thể không khóc.</li>
<li>おかしくて、笑わずには いられなかった。 (Okashikute, warawazu ni wa irarenakatta.) — Buồn cười quá nên tôi không thể không bật cười.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 残業、また 頼まれたの？
   Zangyō, mata tanomareta no?
B: うん。締め切りが 近いから、やらざるを 得ないよ。
   Un. Shimekiri ga chikai kara, yarazaru o enai yo.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Cả hai gắn vào thể ない (bỏ ない) và đều nghĩa "phải" mạnh, nhưng lực khác nhau. 〜ざるを得ない = bị ép từ BÊN NGOÀI (mệnh lệnh, thời tiết) — dù không muốn. 〜ずにはいられない = một thôi thúc bên trong không nén được (khóc, cười). する thành せ ở cả hai: せざるを得ない, せずにはいられない.</div>`,
  ]]);

const b8q = quiz('jpd346-quiz-8', 'Quiz 8 — Compulsion|||Quiz 8 — Buộc phải & không thể không', [
  { id: 'q1', question: '"Là lệnh cấp trên nên BUỘC PHẢI tuân theo" (bị hoàn cảnh ép) dùng mẫu nào?|||"I have no choice but to obey" (forced by circumstance) uses which?', options: ['従わざるを得ない', '従わずにはいられない', '従うものの', '従いかねる'], correctIndex: 0, explanation: '〜ざるを得ない: bị hoàn cảnh bên ngoài ép, buộc phải làm dù không muốn.' },
  { id: 'q2', question: '"Xúc động quá KHÔNG THỂ KHÔNG khóc" (thôi thúc từ bên trong) dùng mẫu nào?|||"I cannot help but cry" (inner impulse) uses which?', options: ['泣かずにはいられない', '泣かざるを得ない', '泣くものの', '泣きかねない'], correctIndex: 0, explanation: '〜ずにはいられない: thôi thúc bên trong không kìm được (khóc, cười).' },
  { id: 'q3', question: 'Dạng đặc biệt của する với hai mẫu này là gì?|||What is the special する form for these patterns?', options: ['せざるを得ない / せずにはいられない', 'しざるを得ない / しずにはいられない', 'するざるを得ない / するずにはいられない', 'さざるを得ない / さずにはいられない'], correctIndex: 0, explanation: 'する chia bất quy tắc thành せ: せざるを得ない, せずにはいられない.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'JPD346',
    slug: 'jpd346-intermediate-japanese-2-b2c1',
    title: 'Intermediate Japanese 2-B2/C1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JPD346.webp',
    shortDescription: 'Intermediate Japanese 2-B2/C1 (JLPT N2), continuing JPD336 — necessary condition, concession, single cause & excess, inability & bad possibility, starting point, basis & guideline, process & contradiction, and compulsion. Bilingual, with quizzes.|||Tiếng Nhật trung-cao cấp B2/C1 (JLPT N2), nối tiếp JPD336 — chỉ khi, tuy nhưng, chỉ vì & quá nên, khó & có thể xấu, nhân dịp, dựa trên & theo, đang dần & vừa vừa, và buộc phải. Song ngữ, có quiz.',
    description: 'Môn <strong>JPD346 — Intermediate Japanese 2-B2/C1 (Tiếng Nhật trung-cao cấp)</strong> thuộc khối Ngôn ngữ Nhật FPTU, Kỳ 4, <strong>nối tiếp JPD336</strong> và bao trùm ngữ pháp lõi của <strong>JLPT N2</strong> (中上級). Bám giáo trình chuẩn <em>Shin Kanzen Master N2 / Tobira</em>, trọng tâm là chọn giữa các mẫu gần nghĩa: <strong>điều kiện tất yếu</strong> (〜ないことには, 〜てはじめて) → <strong>nhượng bộ</strong> (〜ものの, 〜とはいえ) → <strong>chỉ vì &amp; quá nên</strong> (〜ばかりに, 〜あまり) → <strong>bất khả &amp; khả năng xấu</strong> (〜かねる, 〜かねない) → <strong>mốc khởi đầu</strong> (〜をきっかけに, 〜を契機に) → <strong>căn cứ &amp; đường lối</strong> (〜に基づいて, 〜に沿って) → <strong>quá trình &amp; mâu thuẫn</strong> (〜つつある, 〜つつも) → <strong>bắt buộc</strong> (〜ざるを得ない, 〜ずにはいられない). Mỗi bài có từ vựng, ngữ pháp, hội thoại và quiz; song ngữ Nhật-Việt.',
    whatYouLearn: 'Nêu điều kiện tất yếu bằng 〜ないことには (nếu không thì không thể) và 〜てはじめて (phải đến khi mới); diễn đạt nhượng bộ với 〜ものの và 〜とはいえ; phân biệt một nguyên nhân 〜ばかりに và mức độ thái quá 〜あまり; nói sự bất khả 〜かねる (từ chối lịch sự) và khả năng xấu 〜かねない; đánh dấu mốc khởi đầu bằng 〜をきっかけに và 〜を契機に (trang trọng); diễn đạt căn cứ 〜に基づいて và đường lối 〜に沿って; tả quá trình 〜つつある và mâu thuẫn 〜つつも; nói sự bắt buộc từ ngoài 〜ざるを得ない và thôi thúc từ trong 〜ずにはいられない.',
    requirements: 'Cần đã học <strong>JPD336 (Intermediate Japanese 2-B2.2)</strong> hoặc tương đương (JLPT N3 cuối - N2 đầu): dùng thành thạo các liên từ N2 đầu (について, おかげで, せいで, のに, 次第) và các thể động từ căn bản. Nên dùng app thẻ ghi nhớ (Anki) để luyện từ vựng N2 &amp; các cặp mẫu dễ nhầm mỗi ngày.',
  },
  sections: [
    { title: '📚 Tài liệu & lộ trình|||📚 Materials & path', description: 'Giáo trình, app, từ điển, lộ trình 4 bước cho JLPT N2.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp JPD336, mục tiêu JLPT N2, trọng tâm chọn giữa các mẫu gần nghĩa.', lessons: [intro] },
    { title: 'Bài 1 — Chỉ khi|||Lesson 1 — Necessary condition', description: '〜ないことには, 〜てはじめて.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Tuy nhưng|||Lesson 2 — Concession', description: '〜ものの, 〜とはいえ.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Chỉ vì & quá nên|||Lesson 3 — Single cause & excess', description: '〜ばかりに, 〜あまり.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Khó & có thể xấu|||Lesson 4 — Inability & bad possibility', description: '〜かねる, 〜かねない.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Nhân dịp|||Lesson 5 — Starting point', description: '〜をきっかけに, 〜を契機に.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Dựa trên & theo|||Lesson 6 — Basis & guideline', description: '〜に基づいて, 〜に沿って.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Đang dần & vừa vừa|||Lesson 7 — Process & contradiction', description: '〜つつある, 〜つつも.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Buộc phải & không thể không|||Lesson 8 — Compulsion', description: '〜ざるを得ない, 〜ずにはいられない.', lessons: [b8, b8q] },
  ],
};
