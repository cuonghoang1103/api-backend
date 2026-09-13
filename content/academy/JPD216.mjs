/**
 * JPD216 — Pre-Intermediate Japanese 1 (Tiếng Nhật tiền trung cấp 1, A2/B1).
 * Khối Ngôn ngữ Nhật FPTU, Kỳ 2. NỐI TIẾP JPD126 Elementary Japanese 2. MÔN
 * NGÔN NGỮ: cấu trúc bài học tiếng (từ vựng, ngữ pháp, hội thoại, luyện tập),
 * trình độ JLPT N4. Bám giáo trình chuẩn みんなの日本語 Minna no Nihongo II
 * (bài ~26-38) / Genki II.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML;
 * "&"→&amp; trong content HTML; helper doc .join('\n') ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức bài học.', quiz: { timeLimitSeconds: 300, questions } });

const taiLieu = doc('jpd216-0-0-tai-lieu', '📚 Materials & references|||📚 Tài liệu & lộ trình học',
  'Trung tâm tài liệu: giáo trình (Minna no Nihongo II bài 26-38, Genki II), app (Anki/Bunpro), từ điển jisho.org, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">JPD216 · Materials</span>
<h2>Materials &amp; resource hub</h2>
<p class="lead">Everything to continue <strong>Pre-Intermediate Japanese</strong> — this course picks up right where <strong>JPD126</strong> left off and consolidates you at <strong>JLPT N4</strong>. The official FPTU slides &amp; textbook live on <strong>FLM</strong>; below are trusted study resources.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><strong>みんなの日本語 初級 II</strong> (Minna no Nihongo II) — this course maps to its core N4 range, roughly <strong>units 26-38</strong>: explanation, conditionals, the potential form, volition, giving &amp; receiving favours and basic keigo.</li>
<li><strong>Genki II</strong> — a friendly English-language course covering the same grammar with clear drills.</li>
</ul>
<h3>🌐 Dictionary &amp; grammar</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — the best free Japanese-English dictionary; it shows each verb's group, its potential form and its plain forms.</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — grammar SRS ordered by JLPT level; drill each N4 pattern below in order.</li>
</ul>
<h3>🃏 Apps for drilling</h3>
<ul>
<li><strong>Anki</strong> — spaced-repetition flashcards; add decks for the potential form, the volitional form and the keigo verb pairs.</li>
<li><strong>Migii JLPT</strong> — N4 mock tests and vocab by level, popular in Vietnam.</li>
</ul>
<div class="callout"><span class="badge">4-step study path</span>
<ol>
<li><strong>Review JPD126</strong> — the て / た / ない / dictionary verb forms must be automatic first; every N4 pattern here builds on one of them.</li>
<li><strong>Add the new forms</strong> — the potential form and the volitional form are new conjugations; learn them before their grammar.</li>
<li><strong>Use the patterns</strong> — explain, request, suppose conditions, concede, state ability, express will, exchange favours and speak politely with keigo.</li>
<li><strong>Test-ready</strong> — drill vocab &amp; conjugation with Anki, take N4 mock tests on Migii.</li>
</ol></div>`,
    `<span class="eyebrow">JPD216 · Tài liệu</span>
<h2>Trung tâm tài liệu &amp; lộ trình</h2>
<p class="lead">Mọi thứ để học tiếp <strong>tiếng Nhật tiền trung cấp</strong> — môn này nối thẳng từ <strong>JPD126</strong> và củng cố bạn ở trình độ <strong>JLPT N4</strong>. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn học đáng tin.</p>
<h3>📘 Giáo trình lõi</h3>
<ul>
<li><strong>みんなの日本語 初級 II</strong> (Minna no Nihongo II) — môn này bám vùng N4 lõi, khoảng <strong>bài 26-38</strong>: giải thích, điều kiện, thể khả năng, ý chí, cho &amp; nhận ơn huệ và kính ngữ cơ bản.</li>
<li><strong>Genki II</strong> — giáo trình tiếng Anh dễ tiếp cận, cùng ngữ pháp này với bài luyện rõ ràng.</li>
</ul>
<h3>🌐 Từ điển &amp; ngữ pháp</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — từ điển Nhật-Anh miễn phí tốt nhất; nó chỉ rõ nhóm động từ, thể khả năng và các thể thường.</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — luyện ngữ pháp theo trình độ JLPT; luyện lần lượt các mẫu N4 bên dưới.</li>
</ul>
<h3>🃏 App luyện</h3>
<ul>
<li><strong>Anki</strong> — thẻ ghi nhớ lặp lại ngắt quãng; nên tạo bộ cho thể khả năng, thể ý chí và các cặp động từ kính ngữ.</li>
<li><strong>Migii JLPT</strong> — đề thi thử N4 &amp; từ vựng theo trình độ, phổ biến ở Việt Nam.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình học 4 bước</span>
<ol>
<li><strong>Ôn JPD126</strong> — các thể động từ て / た / ない / từ điển phải thành phản xạ trước; mọi mẫu N4 ở đây đều dựa vào một thể.</li>
<li><strong>Thêm các thể mới</strong> — thể khả năng và thể ý chí là cách chia mới; học chúng trước khi học ngữ pháp dùng chúng.</li>
<li><strong>Dùng mẫu câu</strong> — giải thích, nhờ vả, giả định điều kiện, nhượng bộ, nói khả năng, bày tỏ ý chí, trao đổi ơn huệ và nói lịch sự bằng kính ngữ.</li>
<li><strong>Sẵn sàng thi</strong> — luyện từ vựng &amp; chia động từ bằng Anki, làm đề N4 thử trên Migii.</li>
</ol></div>`,
  ]]);

const intro = doc('jpd216-0-1-overview', 'Course overview: Pre-Intermediate Japanese 1|||Tổng quan: Tiếng Nhật tiền trung cấp 1',
  'Nối tiếp JPD126; mục tiêu JLPT N4; trọng tâm thể khả năng, thể ý chí, điều kiện, ơn huệ và kính ngữ; lộ trình 8 bài.',
  [[
    `<span class="eyebrow">JPD216 · Lesson 0.1 · Overview</span>
<h2>Pre-Intermediate Japanese 1 (A2/B1)</h2>
<p class="lead">This course continues <strong>JPD126 (Elementary Japanese 2)</strong> and consolidates you at the <strong>JLPT N4</strong> level. Where JPD126 taught the て, た, ない and dictionary verb forms, this course puts them to work in richer everyday grammar — and adds two brand-new conjugations, the <strong>potential form</strong> and the <strong>volitional form</strong>.</p>
<h3>What is new here</h3>
<p>You move from single patterns to explaining and reasoning: <strong>〜んです</strong> gives a reason, <strong>〜たら</strong> and <strong>〜と</strong> set up conditions, <strong>〜ても</strong> and <strong>〜のに</strong> concede, the <strong>potential form</strong> states ability, the <strong>volitional form</strong> states will, the giving/receiving verbs express favours, and <strong>keigo</strong> lets you speak politely to a superior.</p>
<h3>The three verb groups (quick review)</h3>
<ul>
<li><strong>Group I (う-verbs)</strong> — かきます, のみます, いきます; the ます-stem ends in an i-sound.</li>
<li><strong>Group II (る-verbs)</strong> — たべます, みます; conjugate by simply swapping ます.</li>
<li><strong>Group III (irregular)</strong> — only します and きます.</li>
</ul>
<h3>Roadmap (8 lessons)</h3>
<p>Explanation &amp; reason → trying &amp; planning → conditionals → concession → potential form &amp; listing → volition &amp; intention → giving &amp; receiving favours → basic keigo.</p>`,
    `<span class="eyebrow">JPD216 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Nhật tiền trung cấp 1 (A2/B1)</h2>
<p class="lead">Môn này nối tiếp <strong>JPD126 (Tiếng Nhật sơ cấp 2)</strong> và củng cố bạn ở trình độ <strong>JLPT N4</strong>. Nếu JPD126 dạy các thể động từ て, た, ない và thể từ điển, thì môn này cho chúng hoạt động trong ngữ pháp hằng ngày phong phú hơn — và thêm hai cách chia hoàn toàn mới: <strong>thể khả năng</strong> và <strong>thể ý chí</strong>.</p>
<h3>Điểm mới ở đây</h3>
<p>Bạn chuyển từ mẫu đơn lẻ sang giải thích và lập luận: <strong>〜んです</strong> nêu lý do, <strong>〜たら</strong> và <strong>〜と</strong> đặt điều kiện, <strong>〜ても</strong> và <strong>〜のに</strong> nhượng bộ, <strong>thể khả năng</strong> nói được năng lực, <strong>thể ý chí</strong> nói ý muốn, nhóm động từ cho/nhận diễn tả ơn huệ, và <strong>kính ngữ</strong> giúp bạn nói lịch sự với người trên.</p>
<h3>Ba nhóm động từ (ôn nhanh)</h3>
<ul>
<li><strong>Nhóm I (động từ う)</strong> — かきます, のみます, いきます; đuôi thể ます kết thúc bằng âm hàng i.</li>
<li><strong>Nhóm II (động từ る)</strong> — たべます, みます; chia bằng cách bỏ ます.</li>
<li><strong>Nhóm III (bất quy tắc)</strong> — chỉ có します và きます.</li>
</ul>
<h3>Lộ trình (8 bài)</h3>
<p>Giải thích &amp; lý do → thử &amp; định → điều kiện → nhượng bộ → thể khả năng &amp; liệt kê → ý chí &amp; dự định → cho &amp; nhận ơn huệ → kính ngữ cơ bản.</p>`,
  ]]);

const b1 = doc('jpd216-1-1-explanation-reason', 'Lesson 1 — Explanation & reason|||Bài 1 — Giải thích & lý do',
  '〜んです (giải thích/lý do); 〜ていただけませんか &amp; 〜てくださいませんか (nhờ vả lịch sự).',
  [[
    `<span class="eyebrow">JPD216 · Lesson 1</span>
<h2>Explanation &amp; reason</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>どうして</td><td>dōshite</td><td>why</td></tr>
<tr><td>遅れます</td><td>okuremasu</td><td>to be late</td></tr>
<tr><td>手伝います</td><td>tetsudaimasu</td><td>to help</td></tr>
<tr><td>読み方</td><td>yomikata</td><td>way of reading</td></tr>
<tr><td>説明します</td><td>setsumei shimasu</td><td>to explain</td></tr>
</table>
<h3>Grammar — 〜んです (giving a reason)</h3>
<p><strong>[plain form] んです</strong> asks for, or gives, an explanation or reason. A noun or な-adjective takes <strong>な</strong> before んです.</p>
<ul>
<li>どうして 学校を 休んだんですか。 (Dōshite gakkō o yasunda n desu ka.) — Why did you miss school?</li>
<li>あたまが いたいんです。 (Atama ga itai n desu.) — (It's because) I have a headache.</li>
<li>Noun: きょうは 誕生日なんです。 (Kyō wa tanjōbi na n desu.) — It's my birthday today.</li>
</ul>
<h3>Grammar — 〜ていただけませんか (could you please...)</h3>
<p><strong>て-form + いただけませんか</strong> is a very polite request.</p>
<ul>
<li>ちょっと 手伝って いただけませんか。 (Chotto tetsudatte itadakemasen ka.) — Could you help me a little?</li>
</ul>
<h3>Grammar — 〜てくださいませんか (would you...)</h3>
<p><strong>て-form + くださいませんか</strong> is also a polite request, a touch softer than いただけませんか.</p>
<ul>
<li>もう いちど 説明して くださいませんか。 (Mō ichido setsumei shite kudasaimasen ka.) — Would you explain once more?</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: すみません、この 漢字の 読み方を 教えて いただけませんか。
   Sumimasen, kono kanji no yomikata o oshiete itadakemasen ka.
B: いいですよ。これは「東京」と 読みます。
   Ii desu yo. Kore wa "tōkyō" to yomimasu.
</code></pre>
<div class="callout"><span class="badge">Note</span> Use 〜んです when there is a reason behind the words; a plain 〜ます sentence is neutral and factual. In casual speech んです becomes んだ or just の.</div>`,
    `<span class="eyebrow">JPD216 · Bài 1</span>
<h2>Giải thích &amp; lý do</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>どうして</td><td>dōshite</td><td>tại sao</td></tr>
<tr><td>遅れます</td><td>okuremasu</td><td>đến muộn</td></tr>
<tr><td>手伝います</td><td>tetsudaimasu</td><td>giúp đỡ</td></tr>
<tr><td>読み方</td><td>yomikata</td><td>cách đọc</td></tr>
<tr><td>説明します</td><td>setsumei shimasu</td><td>giải thích</td></tr>
</table>
<h3>Ngữ pháp — 〜んです (nêu lý do)</h3>
<p><strong>[thể thường] んです</strong> dùng để hỏi hoặc nêu một lời giải thích, lý do. Danh từ và tính từ な thêm <strong>な</strong> trước んです.</p>
<ul>
<li>どうして 学校を 休んだんですか。 (Dōshite gakkō o yasunda n desu ka.) — Tại sao bạn nghỉ học?</li>
<li>あたまが いたいんです。 (Atama ga itai n desu.) — (Là vì) tôi đau đầu.</li>
<li>Danh từ: きょうは 誕生日なんです。 (Kyō wa tanjōbi na n desu.) — Hôm nay là sinh nhật tôi.</li>
</ul>
<h3>Ngữ pháp — 〜ていただけませんか (xin ông/bà làm ơn...)</h3>
<p><strong>thể て + いただけませんか</strong> là cách nhờ vả rất lịch sự.</p>
<ul>
<li>ちょっと 手伝って いただけませんか。 (Chotto tetsudatte itadakemasen ka.) — Xin giúp tôi một chút được không?</li>
</ul>
<h3>Ngữ pháp — 〜てくださいませんか (xin hãy...)</h3>
<p><strong>thể て + くださいませんか</strong> cũng là nhờ vả lịch sự, nhẹ hơn いただけませんか một chút.</p>
<ul>
<li>もう いちど 説明して くださいませんか。 (Mō ichido setsumei shite kudasaimasen ka.) — Xin giải thích lại một lần nữa được không?</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: すみません、この 漢字の 読み方を 教えて いただけませんか。
   Sumimasen, kono kanji no yomikata o oshiete itadakemasen ka.
B: いいですよ。これは「東京」と 読みます。
   Ii desu yo. Kore wa "tōkyō" to yomimasu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Dùng 〜んです khi phía sau lời nói có một lý do; câu 〜ます trơn thì trung tính, chỉ nêu sự việc. Trong khẩu ngữ suồng sã, んです thành んだ hoặc chỉ còn の.</div>`,
  ]]);

const b1q = quiz('jpd216-quiz-1', 'Quiz 1 — Explanation & reason|||Quiz 1 — Giải thích & lý do', [
  { id: 'q1', question: 'Danh từ 誕生日 đứng trước んです thì thêm gì?|||What comes between the noun 誕生日 and んです?', options: ['だ', 'な', 'の', 'không thêm gì|||nothing'], correctIndex: 1, explanation: 'Danh từ / tính từ な + な + んです: 誕生日なんです.' },
  { id: 'q2', question: 'Mẫu nào là cách nhờ vả LỊCH SỰ nhất?|||Which is the most polite request pattern?', options: ['〜てください', '〜ていただけませんか', '〜てもいいですか', '〜てみます'], correctIndex: 1, explanation: 'て + いただけませんか là cách nhờ rất lịch sự.' },
  { id: 'q3', question: '"Tại sao bạn nghỉ học?" — chọn câu đúng.|||"Why did you miss school?" — pick the correct sentence.', options: ['どうして 学校を 休んだんですか', 'どうして 学校を 休みますか', 'どうして 学校を 休みたいですか', 'どうして 学校を 休んでください'], correctIndex: 0, explanation: 'Thể thường 休んだ + んですか để hỏi lý do.' },
]);

const b2 = doc('jpd216-2-1-trying-planning', 'Lesson 2 — Trying & planning|||Bài 2 — Thử & định',
  '〜てみます (thử làm); 〜つもりです (ôn: dự định); 〜予定です (dự kiến/lịch trình).',
  [[
    `<span class="eyebrow">JPD216 · Lesson 2</span>
<h2>Trying &amp; planning</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>着ます</td><td>kimasu</td><td>to wear (on the body)</td></tr>
<tr><td>予定</td><td>yotei</td><td>plan / schedule</td></tr>
<tr><td>会議</td><td>kaigi</td><td>meeting</td></tr>
<tr><td>お寺</td><td>otera</td><td>temple</td></tr>
<tr><td>料理</td><td>ryōri</td><td>dish / cooking</td></tr>
</table>
<h3>Grammar — 〜てみます (try doing)</h3>
<p><strong>て-form + みます</strong> = do something to see how it goes; try doing.</p>
<ul>
<li>あたらしい 料理を 食べて みます。 (Atarashii ryōri o tabete mimasu.) — I'll try eating a new dish.</li>
<li>日本語で 話して みます。 (Nihongo de hanashite mimasu.) — I'll try speaking in Japanese.</li>
</ul>
<h3>Grammar — 〜つもりです (intend to, review)</h3>
<p><strong>[dictionary / ない form] つもりです</strong> = a personal intention or plan.</p>
<ul>
<li>なつやすみに 旅行する つもりです。 (Natsuyasumi ni ryokō suru tsumori desu.) — I intend to travel over the summer.</li>
<li>車を 買わない つもりです。 (Kuruma o kawanai tsumori desu.) — I don't intend to buy a car.</li>
</ul>
<h3>Grammar — 〜予定です (be scheduled to)</h3>
<p><strong>[dictionary form] 予定です</strong> or <strong>[noun] の 予定です</strong> = a fixed, arranged schedule; more objective than つもり.</p>
<ul>
<li>来月 国へ 帰る 予定です。 (Raigetsu kuni e kaeru yotei desu.) — I'm scheduled to return home next month.</li>
<li>会議は 3時からの 予定です。 (Kaigi wa san-ji kara no yotei desu.) — The meeting is scheduled from 3 o'clock.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: なつやすみは 何を する 予定ですか。
   Natsuyasumi wa nani o suru yotei desu ka.
B: 京都へ 行って、お寺を 見て みる つもりです。
   Kyōto e itte, otera o mite miru tsumori desu.
</code></pre>
<div class="callout"><span class="badge">Note</span> つもり is your own will or intention; 予定 is a fixed, often externally-set schedule. 〜てみます adds the nuance of "try and see", so it pairs naturally with new experiences.</div>`,
    `<span class="eyebrow">JPD216 · Bài 2</span>
<h2>Thử &amp; định</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>着ます</td><td>kimasu</td><td>mặc (lên người)</td></tr>
<tr><td>予定</td><td>yotei</td><td>kế hoạch / lịch trình</td></tr>
<tr><td>会議</td><td>kaigi</td><td>cuộc họp</td></tr>
<tr><td>お寺</td><td>otera</td><td>chùa</td></tr>
<tr><td>料理</td><td>ryōri</td><td>món ăn / nấu ăn</td></tr>
</table>
<h3>Ngữ pháp — 〜てみます (thử làm)</h3>
<p><strong>thể て + みます</strong> = làm gì đó để xem sao; thử làm.</p>
<ul>
<li>あたらしい 料理を 食べて みます。 (Atarashii ryōri o tabete mimasu.) — Tôi sẽ thử ăn một món mới.</li>
<li>日本語で 話して みます。 (Nihongo de hanashite mimasu.) — Tôi sẽ thử nói bằng tiếng Nhật.</li>
</ul>
<h3>Ngữ pháp — 〜つもりです (dự định, ôn lại)</h3>
<p><strong>[thể từ điển / thể ない] つもりです</strong> = ý định hoặc dự định của cá nhân.</p>
<ul>
<li>なつやすみに 旅行する つもりです。 (Natsuyasumi ni ryokō suru tsumori desu.) — Kỳ nghỉ hè tôi dự định đi du lịch.</li>
<li>車を 買わない つもりです。 (Kuruma o kawanai tsumori desu.) — Tôi không định mua xe.</li>
</ul>
<h3>Ngữ pháp — 〜予定です (dự kiến / theo lịch)</h3>
<p><strong>[thể từ điển] 予定です</strong> hoặc <strong>[danh từ] の 予定です</strong> = lịch trình đã định sẵn; khách quan hơn つもり.</p>
<ul>
<li>来月 国へ 帰る 予定です。 (Raigetsu kuni e kaeru yotei desu.) — Tháng sau tôi dự kiến về nước.</li>
<li>会議は 3時からの 予定です。 (Kaigi wa san-ji kara no yotei desu.) — Cuộc họp dự kiến từ 3 giờ.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: なつやすみは 何を する 予定ですか。
   Natsuyasumi wa nani o suru yotei desu ka.
B: 京都へ 行って、お寺を 見て みる つもりです。
   Kyōto e itte, otera o mite miru tsumori desu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> つもり là ý chí, dự định của bản thân; 予定 là lịch trình đã được ấn định, thường do bên ngoài đặt. 〜てみます mang sắc thái "thử xem sao", nên hợp với những trải nghiệm mới.</div>`,
  ]]);

const b2q = quiz('jpd216-quiz-2', 'Quiz 2 — Trying & planning|||Quiz 2 — Thử & định', [
  { id: 'q1', question: 'Mẫu nào nghĩa là "thử làm để xem sao"?|||Which pattern means "try doing to see how it goes"?', options: ['〜てみます', '〜てあります', '〜ています', '〜てください'], correctIndex: 0, explanation: 'thể て + みます = thử làm.' },
  { id: 'q2', question: 'Từ nào diễn tả LỊCH TRÌNH đã ấn định (khách quan)?|||Which word expresses a fixed, objective schedule?', options: ['つもり', '予定', 'たい', 'ほしい'], correctIndex: 1, explanation: '予定 là lịch trình đã định; つもり là ý định cá nhân.' },
  { id: 'q3', question: 'Trước 予定です, động từ 帰ります phải ở thể nào?|||Before 予定です, the verb 帰ります must be in which form?', options: ['thể ます|||the ます-form', 'thể từ điển|||the dictionary form', 'thể て|||the て-form', 'thể た|||the た-form'], correctIndex: 1, explanation: '[thể từ điển] 予定です: 帰る 予定です.' },
]);

const b3 = doc('jpd216-3-1-conditionals', 'Lesson 3 — Conditionals|||Bài 3 — Điều kiện',
  '〜たら (nếu/khi); 〜と (điều kiện tự nhiên, kết quả tất yếu).',
  [[
    `<span class="eyebrow">JPD216 · Lesson 3</span>
<h2>Conditionals</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>押します</td><td>oshimasu</td><td>to push / press</td></tr>
<tr><td>春</td><td>haru</td><td>spring</td></tr>
<tr><td>咲きます</td><td>sakimasu</td><td>to bloom</td></tr>
<tr><td>切符</td><td>kippu</td><td>ticket</td></tr>
<tr><td>まっすぐ</td><td>massugu</td><td>straight</td></tr>
</table>
<h3>Grammar — 〜たら (if / when)</h3>
<p>Take the <strong>た-form</strong> and add <strong>ら</strong>. It covers both "if" (hypothetical) and "when/after" (a completed event).</p>
<ul>
<li>お金が あったら、旅行します。 (Okane ga attara, ryokō shimasu.) — If I have money, I'll travel.</li>
<li>雨が 降ったら、行きません。 (Ame ga futtara, ikimasen.) — If it rains, I won't go.</li>
<li>うちへ 帰ったら、電話します。 (Uchi e kaettara, denwa shimasu.) — When I get home, I'll call you.</li>
</ul>
<h3>Grammar — 〜と (natural, inevitable result)</h3>
<p><strong>[dictionary form] と</strong> states a result that always / naturally follows. The main clause must NOT be a request, invitation, will or permission.</p>
<ul>
<li>春に なると、さくらが 咲きます。 (Haru ni naru to, sakura ga sakimasu.) — When spring comes, the cherry blossoms bloom.</li>
<li>この ボタンを 押すと、切符が 出ます。 (Kono botan o osu to, kippu ga demasu.) — When you press this button, a ticket comes out.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: すみません、駅は どこですか。
   Sumimasen, eki wa doko desu ka.
B: この 道を まっすぐ 行くと、右に あります。
   Kono michi o massugu iku to, migi ni arimasu.
</code></pre>
<div class="callout"><span class="badge">Note</span> Use 〜と only for automatic or always-true results (nature, machines, directions). If the main clause is a wish, request or command, switch to 〜たら: お金が あったら、買ってください is fine, but 押すと ください is wrong.</div>`,
    `<span class="eyebrow">JPD216 · Bài 3</span>
<h2>Điều kiện</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>押します</td><td>oshimasu</td><td>đẩy / bấm</td></tr>
<tr><td>春</td><td>haru</td><td>mùa xuân</td></tr>
<tr><td>咲きます</td><td>sakimasu</td><td>nở (hoa)</td></tr>
<tr><td>切符</td><td>kippu</td><td>vé</td></tr>
<tr><td>まっすぐ</td><td>massugu</td><td>thẳng</td></tr>
</table>
<h3>Ngữ pháp — 〜たら (nếu / khi)</h3>
<p>Lấy <strong>thể た</strong> rồi thêm <strong>ら</strong>. Nó bao cả "nếu" (giả định) lẫn "khi/sau khi" (việc đã hoàn tất).</p>
<ul>
<li>お金が あったら、旅行します。 (Okane ga attara, ryokō shimasu.) — Nếu có tiền, tôi sẽ đi du lịch.</li>
<li>雨が 降ったら、行きません。 (Ame ga futtara, ikimasen.) — Nếu trời mưa, tôi không đi.</li>
<li>うちへ 帰ったら、電話します。 (Uchi e kaettara, denwa shimasu.) — Khi về đến nhà, tôi sẽ gọi điện.</li>
</ul>
<h3>Ngữ pháp — 〜と (điều kiện tự nhiên, kết quả tất yếu)</h3>
<p><strong>[thể từ điển] と</strong> nêu kết quả luôn xảy ra / mang tính tất yếu. Vế chính KHÔNG được là lời nhờ, rủ, ý chí hay cho phép.</p>
<ul>
<li>春に なると、さくらが 咲きます。 (Haru ni naru to, sakura ga sakimasu.) — Cứ đến mùa xuân là hoa anh đào nở.</li>
<li>この ボタンを 押すと、切符が 出ます。 (Kono botan o osu to, kippu ga demasu.) — Bấm nút này thì vé sẽ ra.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: すみません、駅は どこですか。
   Sumimasen, eki wa doko desu ka.
B: この 道を まっすぐ 行くと、右に あります。
   Kono michi o massugu iku to, migi ni arimasu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Chỉ dùng 〜と cho kết quả tự động hoặc luôn đúng (tự nhiên, máy móc, chỉ đường). Nếu vế chính là mong muốn, nhờ vả hay mệnh lệnh thì đổi sang 〜たら: お金が あったら、買ってください thì được, còn 押すと ください thì sai.</div>`,
  ]]);

const b3q = quiz('jpd216-quiz-3', 'Quiz 3 — Conditionals|||Quiz 3 — Điều kiện', [
  { id: 'q1', question: 'Thể たら được tạo từ thể nào?|||The 〜たら form is built from which form?', options: ['thể て|||the て-form', 'thể た + ら|||the た-form + ら', 'thể từ điển + ら|||the dictionary form + ら', 'thể ない + ら|||the ない-form + ら'], correctIndex: 1, explanation: 'thể た + ら: 降った → 降ったら.' },
  { id: 'q2', question: '"Cứ đến mùa xuân là hoa anh đào nở" dùng mẫu nào?|||"When spring comes, the cherry blossoms bloom" uses which pattern?', options: ['春に なると、さくらが 咲きます', '春に なったら、さくらを 咲いてください', '春に なって、さくらが 咲きたいです', '春に なるのに、さくらが 咲きます'], correctIndex: 0, explanation: '〜と cho kết quả tự nhiên, tất yếu.' },
  { id: 'q3', question: 'Vế sau 〜と KHÔNG được là loại câu nào?|||The clause after 〜と must NOT be which kind?', options: ['sự việc tự nhiên|||a natural fact', 'lời nhờ vả / mệnh lệnh|||a request or command', 'kết quả của máy móc|||a machine result', 'chỉ đường|||directions'], correctIndex: 1, explanation: 'Vế chính của 〜と không được là nhờ/rủ/ý chí/cho phép — hãy dùng 〜たら.' },
]);

const b4 = doc('jpd216-4-1-concession', 'Lesson 4 — Concession & contrast|||Bài 4 — Nhượng bộ & ngược lại',
  '〜ても (dù cho); 〜のに (mặc dù ... vẫn, mang ý bất ngờ/không hài lòng).',
  [[
    `<span class="eyebrow">JPD216 · Lesson 4</span>
<h2>Concession &amp; contrast</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>高い</td><td>takai</td><td>expensive / high</td></tr>
<tr><td>便利[な]</td><td>benri</td><td>convenient</td></tr>
<tr><td>痛い</td><td>itai</td><td>painful</td></tr>
<tr><td>働きます</td><td>hatarakimasu</td><td>to work</td></tr>
<tr><td>薬</td><td>kusuri</td><td>medicine</td></tr>
</table>
<h3>Grammar — 〜ても (even if / even though)</h3>
<p>Verb: <strong>て-form + も</strong>. い-adjective: <strong>〜くても</strong>. な-adjective / noun: <strong>〜でも</strong>.</p>
<ul>
<li>雨が 降っても、行きます。 (Ame ga futte mo, ikimasu.) — Even if it rains, I'll go.</li>
<li>高くても、買います。 (Takakute mo, kaimasu.) — Even if it's expensive, I'll buy it.</li>
<li>便利でも、使いません。 (Benri de mo, tsukaimasen.) — Even if it's convenient, I won't use it.</li>
</ul>
<h3>Grammar — 〜のに (although / and yet)</h3>
<p><strong>[plain form] のに</strong>; a noun or な-adjective takes <strong>な</strong> before のに. It states a real fact and carries surprise or dissatisfaction.</p>
<ul>
<li>薬を 飲んだのに、まだ 痛いです。 (Kusuri o nonda noni, mada itai desu.) — Although I took the medicine, it still hurts.</li>
<li>日曜日なのに、働きます。 (Nichiyōbi na noni, hatarakimasu.) — Even though it's Sunday, I have to work.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: この 問題、わかりましたか。
   Kono mondai, wakarimashita ka.
B: せんせいに 聞いたのに、まだ わかりません。
   Sensei ni kiita noni, mada wakarimasen.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜ても is hypothetical ("even if"), while 〜のに is factual ("although") and always adds a feeling of surprise or complaint. With a question word, いくら〜ても means "no matter how much...".</div>`,
    `<span class="eyebrow">JPD216 · Bài 4</span>
<h2>Nhượng bộ &amp; ngược lại</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>高い</td><td>takai</td><td>đắt / cao</td></tr>
<tr><td>便利[な]</td><td>benri</td><td>tiện lợi</td></tr>
<tr><td>痛い</td><td>itai</td><td>đau</td></tr>
<tr><td>働きます</td><td>hatarakimasu</td><td>làm việc</td></tr>
<tr><td>薬</td><td>kusuri</td><td>thuốc</td></tr>
</table>
<h3>Ngữ pháp — 〜ても (dù cho / cho dù)</h3>
<p>Động từ: <strong>thể て + も</strong>. Tính từ い: <strong>〜くても</strong>. Tính từ な / danh từ: <strong>〜でも</strong>.</p>
<ul>
<li>雨が 降っても、行きます。 (Ame ga futte mo, ikimasu.) — Dù trời mưa, tôi vẫn đi.</li>
<li>高くても、買います。 (Takakute mo, kaimasu.) — Dù đắt, tôi vẫn mua.</li>
<li>便利でも、使いません。 (Benri de mo, tsukaimasen.) — Dù tiện, tôi vẫn không dùng.</li>
</ul>
<h3>Ngữ pháp — 〜のに (mặc dù ... vậy mà)</h3>
<p><strong>[thể thường] のに</strong>; danh từ hoặc tính từ な thêm <strong>な</strong> trước のに. Nó nêu một sự thật có thật và mang sắc thái bất ngờ hoặc không hài lòng.</p>
<ul>
<li>薬を 飲んだのに、まだ 痛いです。 (Kusuri o nonda noni, mada itai desu.) — Mặc dù đã uống thuốc, vẫn còn đau.</li>
<li>日曜日なのに、働きます。 (Nichiyōbi na noni, hatarakimasu.) — Mặc dù là chủ nhật, tôi vẫn phải làm việc.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: この 問題、わかりましたか。
   Kono mondai, wakarimashita ka.
B: せんせいに 聞いたのに、まだ わかりません。
   Sensei ni kiita noni, mada wakarimasen.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜ても mang tính giả định ("dù cho"), còn 〜のに nêu sự thật ("mặc dù") và luôn kèm cảm giác bất ngờ hoặc than phiền. Với từ để hỏi, いくら〜ても nghĩa là "dù ... bao nhiêu đi nữa".</div>`,
  ]]);

const b4q = quiz('jpd216-quiz-4', 'Quiz 4 — Concession|||Quiz 4 — Nhượng bộ', [
  { id: 'q1', question: 'Tính từ い 高い ghép với 〜ても thành gì?|||How does the い-adjective 高い combine with 〜ても?', options: ['高いても', 'takakute mo → 高くても|||高くても', '高くても', '高いでも'], correctIndex: 2, explanation: 'Tính từ い: 高い → 高くても.' },
  { id: 'q2', question: '"Mặc dù đã uống thuốc, vẫn còn đau" dùng mẫu nào?|||"Although I took medicine, it still hurts" uses which pattern?', options: ['薬を 飲んでも、まだ 痛いです', '薬を 飲んだのに、まだ 痛いです', '薬を 飲んだら、まだ 痛いです', '薬を 飲むと、まだ 痛いです'], correctIndex: 1, explanation: '〜のに nêu sự thật ngược với mong đợi, kèm sắc thái than phiền.' },
  { id: 'q3', question: 'Điểm khác nhau chính giữa 〜ても và 〜のに là gì?|||What is the main difference between 〜ても and 〜のに?', options: ['〜ても giả định, 〜のに nêu sự thật|||〜ても is hypothetical, 〜のに is factual', 'Không khác gì|||No difference', '〜のに chỉ dùng cho danh từ|||〜のに is only for nouns', '〜ても mang ý bất ngờ|||〜ても carries surprise'], correctIndex: 0, explanation: '〜ても "dù cho" (giả định); 〜のに "mặc dù" (sự thật, kèm bất ngờ/than phiền).' },
]);

const b5 = doc('jpd216-5-1-potential-listing', 'Lesson 5 — Potential form & listing|||Bài 5 — Thể khả năng & liệt kê',
  'Thể khả năng (可能動詞); 〜し (liệt kê lý do); 見えます/聞こえます (nhìn/nghe thấy tự nhiên).',
  [[
    `<span class="eyebrow">JPD216 · Lesson 5</span>
<h2>Potential form &amp; listing</h2>
<h3>How to form the potential (可能動詞)</h3>
<table>
<tr><th>group</th><th>rule</th><th>example</th></tr>
<tr><td>I</td><td>u-row → e-row + る</td><td>かく → かける, のむ → のめる, はなす → はなせる</td></tr>
<tr><td>II (る-verbs)</td><td>る → られる</td><td>たべる → たべられる, みる → みられる</td></tr>
<tr><td>III</td><td>irregular</td><td>する → できる, くる → こられる</td></tr>
</table>
<p>All potential verbs behave like Group II verbs. The object usually takes <strong>が</strong> instead of を.</p>
<ul>
<li>私は 日本語が 話せます。 (Watashi wa nihongo ga hanasemasu.) — I can speak Japanese.</li>
<li>ここで 切符が 買えます。 (Koko de kippu ga kaemasu.) — You can buy tickets here.</li>
</ul>
<h3>Grammar — 〜し (listing reasons)</h3>
<p><strong>[plain form] し</strong> lists two or more reasons or facts, often leading to a conclusion.</p>
<ul>
<li>この 店は 安いし、おいしいし、よく 来ます。 (Kono mise wa yasui shi, oishii shi, yoku kimasu.) — This shop is cheap and tasty, so I come often.</li>
</ul>
<h3>Grammar — 見えます / 聞こえます (spontaneously visible / audible)</h3>
<p>These describe what naturally comes into view or hearing, without effort.</p>
<ul>
<li>ここから 富士山が 見えます。 (Koko kara fujisan ga miemasu.) — Mt. Fuji is visible from here.</li>
<li>波の 音が 聞こえます。 (Nami no oto ga kikoemasu.) — I can hear the sound of the waves.</li>
</ul>
<div class="callout"><span class="badge">Note</span> 見えます / 聞こえます are spontaneous — the thing appears or reaches your ears on its own. The potential 見られる / 聞ける mean "able to see / hear by choice" (e.g. you can watch a film). Do not mix them up.</div>`,
    `<span class="eyebrow">JPD216 · Bài 5</span>
<h2>Thể khả năng &amp; liệt kê</h2>
<h3>Cách chia thể khả năng (可能動詞)</h3>
<table>
<tr><th>nhóm</th><th>quy tắc</th><th>ví dụ</th></tr>
<tr><td>I</td><td>hàng u → hàng e + る</td><td>かく → かける, のむ → のめる, はなす → はなせる</td></tr>
<tr><td>II (động từ る)</td><td>る → られる</td><td>たべる → たべられる, みる → みられる</td></tr>
<tr><td>III</td><td>bất quy tắc</td><td>する → できる, くる → こられる</td></tr>
</table>
<p>Mọi động từ khả năng đều chia như động từ nhóm II. Tân ngữ thường dùng <strong>が</strong> thay cho を.</p>
<ul>
<li>私は 日本語が 話せます。 (Watashi wa nihongo ga hanasemasu.) — Tôi có thể nói tiếng Nhật.</li>
<li>ここで 切符が 買えます。 (Koko de kippu ga kaemasu.) — Ở đây có thể mua vé.</li>
</ul>
<h3>Ngữ pháp — 〜し (liệt kê lý do)</h3>
<p><strong>[thể thường] し</strong> liệt kê hai lý do / sự việc trở lên, thường dẫn tới một kết luận.</p>
<ul>
<li>この 店は 安いし、おいしいし、よく 来ます。 (Kono mise wa yasui shi, oishii shi, yoku kimasu.) — Quán này vừa rẻ vừa ngon, nên tôi hay đến.</li>
</ul>
<h3>Ngữ pháp — 見えます / 聞こえます (nhìn/nghe thấy một cách tự nhiên)</h3>
<p>Hai từ này tả cái tự lọt vào tầm mắt hoặc tai, không do cố gắng.</p>
<ul>
<li>ここから 富士山が 見えます。 (Koko kara fujisan ga miemasu.) — Từ đây nhìn thấy núi Phú Sĩ.</li>
<li>波の 音が 聞こえます。 (Nami no oto ga kikoemasu.) — Nghe thấy tiếng sóng.</li>
</ul>
<div class="callout"><span class="badge">Ghi chú</span> 見えます / 聞こえます mang tính tự nhiên — vật tự hiện ra hoặc tự lọt vào tai. Còn thể khả năng 見られる / 聞ける nghĩa "có thể xem / nghe do chủ động" (ví dụ có thể xem được một bộ phim). Đừng lẫn hai loại.</div>`,
  ]]);

const b5q = quiz('jpd216-quiz-5', 'Quiz 5 — Potential form|||Quiz 5 — Thể khả năng', [
  { id: 'q1', question: 'Thể khả năng của のむ (nhóm I) là gì?|||What is the potential form of のむ (Group I)?', options: ['のめる', 'のまれる', 'のみられる', 'のむことができる'], correctIndex: 0, explanation: 'Nhóm I: hàng u → hàng e + る, のむ → のめる.' },
  { id: 'q2', question: 'Với động từ khả năng, tân ngữ thường dùng trợ từ nào?|||With a potential verb, the object usually takes which particle?', options: ['を', 'が', 'に', 'へ'], correctIndex: 1, explanation: 'Tân ngữ của thể khả năng thường chuyển sang が: 日本語が 話せます.' },
  { id: 'q3', question: '"Từ đây nhìn thấy núi Phú Sĩ" (tự nhiên) dùng từ nào?|||"Mt. Fuji is visible from here" (spontaneous) uses which verb?', options: ['見られます', '見えます', '見ます', '見せます'], correctIndex: 1, explanation: '見えます = nhìn thấy một cách tự nhiên; 見られる = xem được do chủ động.' },
]);

const b6 = doc('jpd216-6-1-volition-intention', 'Lesson 6 — Volition & intention|||Bài 6 — Ý chí & dự định',
  'Thể ý chí (意向形 〜よう); 〜ようと思います (định làm); 〜つもりです (ôn, so sánh).',
  [[
    `<span class="eyebrow">JPD216 · Lesson 6</span>
<h2>Volition &amp; intention</h2>
<h3>How to form the volitional (意向形)</h3>
<table>
<tr><th>group</th><th>rule</th><th>example</th></tr>
<tr><td>I</td><td>u-row → o-row + う</td><td>かく → かこう, のむ → のもう, いく → いこう</td></tr>
<tr><td>II (る-verbs)</td><td>る → よう</td><td>たべる → たべよう, みる → みよう</td></tr>
<tr><td>III</td><td>irregular</td><td>する → しよう, くる → こよう</td></tr>
</table>
<p>Alone, the volitional is a casual "let's": いっしょに 帰ろう。 (Issho ni kaerō.) — Let's go home together.</p>
<h3>Grammar — 〜ようと思います (I'm thinking of doing)</h3>
<p><strong>[volitional] と 思います</strong> = a decision or plan just being formed. <strong>〜と 思っています</strong> shows an intention held for some time.</p>
<ul>
<li>週末は うちで 休もうと 思います。 (Shūmatsu wa uchi de yasumō to omoimasu.) — I'm thinking of resting at home this weekend.</li>
<li>日本の 会社で 働こうと 思っています。 (Nihon no kaisha de hatarakō to omotte imasu.) — I've been thinking of working at a Japanese company.</li>
</ul>
<h3>Grammar — 〜つもりです (a firmer intention, review)</h3>
<ul>
<li>来年 日本へ 留学する つもりです。 (Rainen nihon e ryūgaku suru tsumori desu.) — I intend to study abroad in Japan next year.</li>
</ul>
<div class="callout"><span class="badge">Note</span> 〜ようと思います is a decision just being made; 〜つもりです is a firmer, already-set plan; the bare volitional (帰ろう) is a casual "let's". Compare 予定です from Lesson 2, which is an objective schedule.</div>`,
    `<span class="eyebrow">JPD216 · Bài 6</span>
<h2>Ý chí &amp; dự định</h2>
<h3>Cách chia thể ý chí (意向形)</h3>
<table>
<tr><th>nhóm</th><th>quy tắc</th><th>ví dụ</th></tr>
<tr><td>I</td><td>hàng u → hàng o + う</td><td>かく → かこう, のむ → のもう, いく → いこう</td></tr>
<tr><td>II (động từ る)</td><td>る → よう</td><td>たべる → たべよう, みる → みよう</td></tr>
<tr><td>III</td><td>bất quy tắc</td><td>する → しよう, くる → こよう</td></tr>
</table>
<p>Đứng một mình, thể ý chí là lời rủ suồng sã "cùng ... nào": いっしょに 帰ろう。 (Issho ni kaerō.) — Cùng về nhà nào.</p>
<h3>Ngữ pháp — 〜ようと思います (định làm gì)</h3>
<p><strong>[thể ý chí] と 思います</strong> = quyết định hoặc dự định vừa mới hình thành. <strong>〜と 思っています</strong> thể hiện ý định đã có từ trước.</p>
<ul>
<li>週末は うちで 休もうと 思います。 (Shūmatsu wa uchi de yasumō to omoimasu.) — Cuối tuần này tôi định nghỉ ở nhà.</li>
<li>日本の 会社で 働こうと 思っています。 (Nihon no kaisha de hatarakō to omotte imasu.) — Tôi đang định làm việc ở công ty Nhật.</li>
</ul>
<h3>Ngữ pháp — 〜つもりです (ý định chắc chắn hơn, ôn lại)</h3>
<ul>
<li>来年 日本へ 留学する つもりです。 (Rainen nihon e ryūgaku suru tsumori desu.) — Năm sau tôi dự định đi du học Nhật.</li>
</ul>
<div class="callout"><span class="badge">Ghi chú</span> 〜ようと思います là quyết định vừa mới hình thành; 〜つもりです là dự định đã chắc chắn hơn; thể ý chí trơn (帰ろう) là lời rủ suồng sã. So với 予定です ở Bài 2, đó là lịch trình khách quan.</div>`,
  ]]);

const b6q = quiz('jpd216-quiz-6', 'Quiz 6 — Volition|||Quiz 6 — Ý chí', [
  { id: 'q1', question: 'Thể ý chí của のむ (nhóm I) là gì?|||What is the volitional form of のむ (Group I)?', options: ['のもう', 'のみよう', 'のめる', 'のまう'], correctIndex: 0, explanation: 'Nhóm I: hàng u → hàng o + う, のむ → のもう.' },
  { id: 'q2', question: '"Cuối tuần này tôi định nghỉ ở nhà" dùng mẫu nào?|||"I\'m thinking of resting at home this weekend" uses which pattern?', options: ['休もうと 思います', '休むつもりでした', '休んでください', '休みたいです'], correctIndex: 0, explanation: '[thể ý chí] と 思います = định/tính làm gì.' },
  { id: 'q3', question: 'Thể ý chí đứng MỘT MÌNH mang nghĩa gì?|||What does the volitional form mean when used alone?', options: ['mệnh lệnh|||a command', 'lời rủ suồng sã "cùng ... nào"|||a casual "let\'s"', 'câu hỏi lịch sự|||a polite question', 'điều kiện|||a condition'], correctIndex: 1, explanation: 'Thể ý chí trơn = "let\'s / cùng ... nào" (suồng sã): 帰ろう.' },
]);

const b7 = doc('jpd216-7-1-giving-receiving', 'Lesson 7 — Giving & receiving favours|||Bài 7 — Cho & nhận ơn huệ',
  'あげます/もらいます/くれます; 〜てあげる/〜てもらう/〜てくれる (làm ơn cho ai / được ai làm cho).',
  [[
    `<span class="eyebrow">JPD216 · Lesson 7</span>
<h2>Giving &amp; receiving favours</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>貸します</td><td>kashimasu</td><td>to lend</td></tr>
<tr><td>荷物</td><td>nimotsu</td><td>luggage / baggage</td></tr>
<tr><td>持ちます</td><td>mochimasu</td><td>to hold / carry</td></tr>
<tr><td>親切[な]</td><td>shinsetsu</td><td>kind</td></tr>
<tr><td>プレゼント</td><td>purezento</td><td>present / gift</td></tr>
</table>
<h3>Grammar — giving &amp; receiving nouns</h3>
<ul>
<li>私は 友達に プレゼントを あげました。 (Watashi wa tomodachi ni purezento o agemashita.) — I gave my friend a present.</li>
<li>私は 友達に プレゼントを もらいました。 (Watashi wa tomodachi ni purezento o moraimashita.) — I received a present from my friend.</li>
<li>友達が 私に プレゼントを くれました。 (Tomodachi ga watashi ni purezento o kuremashita.) — My friend gave me a present.</li>
</ul>
<h3>Grammar — 〜てあげる / 〜てもらう / 〜てくれる (favours)</h3>
<p>Attach the giving/receiving verb to the <strong>て-form</strong> to express a favour done or received.</p>
<ul>
<li>私は 友達に 本を 貸して あげました。 (Watashi wa tomodachi ni hon o kashite agemashita.) — I lent my friend a book (as a favour).</li>
<li>私は 友達に 本を 貸して もらいました。 (Watashi wa tomodachi ni hon o kashite moraimashita.) — I had my friend lend me a book.</li>
<li>友達が 本を 貸して くれました。 (Tomodachi ga hon o kashite kuremashita.) — My friend lent me a book (for me).</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 重そうですね。荷物を 持ちましょうか。
   Omosō desu ne. Nimotsu o mochimashō ka.
B: ありがとうございます。じゃ、これを 持って くれませんか。
   Arigatō gozaimasu. Ja, kore o motte kuremasen ka.
</code></pre>
<div class="callout"><span class="badge">Note</span> くれます / くれる is used only when the receiver is I or my in-group. 〜てあげる implies you are doing someone a favour, so it can sound condescending toward a superior — with a superior, offer help with ましょうか or use humble keigo instead.</div>`,
    `<span class="eyebrow">JPD216 · Bài 7</span>
<h2>Cho &amp; nhận ơn huệ</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>貸します</td><td>kashimasu</td><td>cho mượn</td></tr>
<tr><td>荷物</td><td>nimotsu</td><td>hành lý / đồ đạc</td></tr>
<tr><td>持ちます</td><td>mochimasu</td><td>cầm / mang</td></tr>
<tr><td>親切[な]</td><td>shinsetsu</td><td>tử tế</td></tr>
<tr><td>プレゼント</td><td>purezento</td><td>quà</td></tr>
</table>
<h3>Ngữ pháp — nhóm động từ cho &amp; nhận</h3>
<ul>
<li>私は 友達に プレゼントを あげました。 (Watashi wa tomodachi ni purezento o agemashita.) — Tôi tặng bạn một món quà.</li>
<li>私は 友達に プレゼントを もらいました。 (Watashi wa tomodachi ni purezento o moraimashita.) — Tôi nhận được quà từ bạn.</li>
<li>友達が 私に プレゼントを くれました。 (Tomodachi ga watashi ni purezento o kuremashita.) — Bạn tặng quà cho tôi.</li>
</ul>
<h3>Ngữ pháp — 〜てあげる / 〜てもらう / 〜てくれる (ơn huệ)</h3>
<p>Gắn động từ cho/nhận vào <strong>thể て</strong> để diễn tả một việc làm ơn được cho hoặc được nhận.</p>
<ul>
<li>私は 友達に 本を 貸して あげました。 (Watashi wa tomodachi ni hon o kashite agemashita.) — Tôi cho bạn mượn sách (làm ơn cho bạn).</li>
<li>私は 友達に 本を 貸して もらいました。 (Watashi wa tomodachi ni hon o kashite moraimashita.) — Tôi được bạn cho mượn sách.</li>
<li>友達が 本を 貸して くれました。 (Tomodachi ga hon o kashite kuremashita.) — Bạn cho tôi mượn sách (vì tôi).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 重そうですね。荷物を 持ちましょうか。
   Omosō desu ne. Nimotsu o mochimashō ka.
B: ありがとうございます。じゃ、これを 持って くれませんか。
   Arigatō gozaimasu. Ja, kore o motte kuremasen ka.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> くれます / くれる chỉ dùng khi người nhận là tôi hoặc nhóm của tôi. 〜てあげる hàm ý bạn đang làm ơn cho ai đó, nên có thể nghe kẻ cả với người trên — với người trên, hãy ngỏ giúp bằng ましょうか hoặc dùng kính ngữ khiêm nhường.</div>`,
  ]]);

const b7q = quiz('jpd216-quiz-7', 'Quiz 7 — Giving & receiving|||Quiz 7 — Cho & nhận', [
  { id: 'q1', question: 'Động từ nào dùng khi NGƯỜI KHÁC cho/tặng TÔI?|||Which verb is used when someone else gives to ME?', options: ['あげます', 'もらいます', 'くれます', 'かします'], correctIndex: 2, explanation: 'くれます: người khác cho tôi / nhóm của tôi.' },
  { id: 'q2', question: '"Tôi được bạn cho mượn sách" dùng mẫu nào?|||"I had my friend lend me a book" uses which pattern?', options: ['貸して あげました', '貸して もらいました', '貸して くれました', '貸しました'], correctIndex: 1, explanation: '〜てもらう: tôi được người khác làm cho việc gì.' },
  { id: 'q3', question: 'Vì sao 〜てあげる cần thận trọng với người trên?|||Why should 〜てあげる be used carefully toward a superior?', options: ['vì nó sai ngữ pháp|||it is grammatically wrong', 'vì nó hàm ý làm ơn, nghe kẻ cả|||it implies doing a favour and can sound condescending', 'vì nó quá trang trọng|||it is too formal', 'vì chỉ dùng cho đồ vật|||it is only for objects'], correctIndex: 1, explanation: '〜てあげる hàm ý ban ơn, dễ nghe kẻ cả với người trên; nên dùng kính ngữ khiêm nhường.' },
]);

const b8 = doc('jpd216-8-1-basic-keigo', 'Lesson 8 — Basic keigo|||Bài 8 — Kính ngữ cơ bản',
  'Tôn kính 〜れます/られます; khiêm nhường お〜します; lịch sự ございます.',
  [[
    `<span class="eyebrow">JPD216 · Lesson 8</span>
<h2>Basic keigo (polite language)</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>社長</td><td>shachō</td><td>company president</td></tr>
<tr><td>部長</td><td>buchō</td><td>department head</td></tr>
<tr><td>受付</td><td>uketsuke</td><td>reception</td></tr>
<tr><td>少々</td><td>shōshō</td><td>a little (polite)</td></tr>
<tr><td>いらっしゃいます</td><td>irasshaimasu</td><td>to be / come / go (respectful)</td></tr>
</table>
<h3>Grammar — respectful 〜れます / られます (尊敬語)</h3>
<p>The respectful form is identical to the passive form; use it for the OTHER person's actions.</p>
<table>
<tr><th>group</th><th>rule</th><th>example</th></tr>
<tr><td>I</td><td>u-row → a-row + れます</td><td>かきます → かかれます, よみます → よまれます</td></tr>
<tr><td>II (る-verbs)</td><td>ます → られます</td><td>たべます → たべられます</td></tr>
<tr><td>III</td><td>irregular</td><td>します → されます, きます → こられます</td></tr>
</table>
<ul>
<li>社長は もう 帰られました。 (Shachō wa mō kaeraremashita.) — The president has already gone home.</li>
</ul>
<h3>Grammar — humble お〜します (謙譲語)</h3>
<p><strong>お + ます-stem + します</strong> lowers YOUR OWN action to show respect to the listener.</p>
<ul>
<li>私が 荷物を お持ちします。 (Watashi ga nimotsu o omochi shimasu.) — I'll carry your luggage (humbly).</li>
<li>ここで お待ちします。 (Koko de omachi shimasu.) — I'll wait here (humbly).</li>
</ul>
<h3>Grammar — polite ございます</h3>
<p><strong>あります → ございます</strong>, <strong>です → でございます</strong> raise the politeness level.</p>
<ul>
<li>受付は 2階に ございます。 (Uketsuke wa ni-kai ni gozaimasu.) — Reception is on the 2nd floor.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 社長は 何時に 来られますか。
   Shachō wa nan-ji ni koraremasu ka.
B: 10時に いらっしゃいます。少々 お待ちください。
   Jū-ji ni irasshaimasu. Shōshō omachi kudasai.
</code></pre>
<div class="callout"><span class="badge">Note</span> Use respectful forms for the other person's actions and humble forms for your own; ございます is a polite level, not respect or humility in itself. Some verbs have special forms: いらっしゃいます (= います/いきます/きます), めしあがります (= たべます/のみます), なさいます (= します).</div>`,
    `<span class="eyebrow">JPD216 · Bài 8</span>
<h2>Kính ngữ cơ bản</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>社長</td><td>shachō</td><td>giám đốc / chủ tịch công ty</td></tr>
<tr><td>部長</td><td>buchō</td><td>trưởng phòng</td></tr>
<tr><td>受付</td><td>uketsuke</td><td>quầy tiếp tân</td></tr>
<tr><td>少々</td><td>shōshō</td><td>một chút (lịch sự)</td></tr>
<tr><td>いらっしゃいます</td><td>irasshaimasu</td><td>ở / đến / đi (tôn kính)</td></tr>
</table>
<h3>Ngữ pháp — tôn kính 〜れます / られます (尊敬語)</h3>
<p>Thể tôn kính trùng dạng với thể bị động; dùng cho hành động của NGƯỜI KHÁC (người trên).</p>
<table>
<tr><th>nhóm</th><th>quy tắc</th><th>ví dụ</th></tr>
<tr><td>I</td><td>hàng u → hàng a + れます</td><td>かきます → かかれます, よみます → よまれます</td></tr>
<tr><td>II (động từ る)</td><td>ます → られます</td><td>たべます → たべられます</td></tr>
<tr><td>III</td><td>bất quy tắc</td><td>します → されます, きます → こられます</td></tr>
</table>
<ul>
<li>社長は もう 帰られました。 (Shachō wa mō kaeraremashita.) — Giám đốc đã về rồi.</li>
</ul>
<h3>Ngữ pháp — khiêm nhường お〜します (謙譲語)</h3>
<p><strong>お + đuôi ます + します</strong> hạ thấp hành động của CHÍNH MÌNH để tỏ kính trọng với người nghe.</p>
<ul>
<li>私が 荷物を お持ちします。 (Watashi ga nimotsu o omochi shimasu.) — Để tôi xách hành lý cho ạ (khiêm nhường).</li>
<li>ここで お待ちします。 (Koko de omachi shimasu.) — Tôi xin đợi ở đây ạ (khiêm nhường).</li>
</ul>
<h3>Ngữ pháp — lịch sự ございます</h3>
<p><strong>あります → ございます</strong>, <strong>です → でございます</strong> nâng mức độ lịch sự.</p>
<ul>
<li>受付は 2階に ございます。 (Uketsuke wa ni-kai ni gozaimasu.) — Quầy tiếp tân ở tầng 2 ạ.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 社長は 何時に 来られますか。
   Shachō wa nan-ji ni koraremasu ka.
B: 10時に いらっしゃいます。少々 お待ちください。
   Jū-ji ni irasshaimasu. Shōshō omachi kudasai.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Dùng thể tôn kính cho hành động của người khác, thể khiêm nhường cho hành động của mình; ございます là mức lịch sự, tự nó không phải tôn kính hay khiêm nhường. Vài động từ có dạng riêng: いらっしゃいます (= います/いきます/きます), めしあがります (= たべます/のみます), なさいます (= します).</div>`,
  ]]);

const b8q = quiz('jpd216-quiz-8', 'Quiz 8 — Basic keigo|||Quiz 8 — Kính ngữ cơ bản', [
  { id: 'q1', question: 'Thể tôn kính (尊敬語) 〜れます/られます trùng dạng với thể nào?|||The respectful form 〜れます/られます is identical to which form?', options: ['thể sai khiến|||the causative form', 'thể bị động|||the passive form', 'thể khả năng|||the potential form', 'thể ý chí|||the volitional form'], correctIndex: 1, explanation: 'Thể tôn kính trùng dạng với thể bị động: 帰ります → 帰られます.' },
  { id: 'q2', question: '"Để tôi xách hành lý cho ạ" (nói về việc của MÌNH) dùng mẫu nào?|||"I\'ll carry your luggage" (about MY OWN action) uses which pattern?', options: ['お持ちになります', 'お持ちします', '持たれます', '持ってあげます'], correctIndex: 1, explanation: 'Khiêm nhường: お + đuôi ます + します → お持ちします (hành động của chính mình).' },
  { id: 'q3', question: 'あります được nâng lên mức lịch sự thành gì?|||What is the polite (raised) form of あります?', options: ['ございます', 'いらっしゃいます', 'おります', 'なさいます'], correctIndex: 0, explanation: 'あります → ございます (mức lịch sự); いらっしゃいます là tôn kính cho います/いきます/きます.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'JPD216',
    slug: 'jpd216-pre-intermediate-japanese-1-a2b1',
    title: 'Pre-Intermediate Japanese 1-A2/B1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JPD216.webp',
    shortDescription: 'Pre-Intermediate Japanese 1 (A2-B1, JLPT N4), continuing JPD126 — explanations, polite requests, conditionals, concession, the potential & volitional forms, favours, and basic keigo. Bilingual, with vocab, grammar & quizzes.|||Tiếng Nhật tiền trung cấp 1 (A2-B1, JLPT N4), nối tiếp JPD126 — giải thích, nhờ vả lịch sự, điều kiện, nhượng bộ, thể khả năng & ý chí, ơn huệ, và kính ngữ cơ bản. Song ngữ Nhật-Việt, có quiz.',
    description: 'Môn <strong>JPD216 — Pre-Intermediate Japanese 1 (Tiếng Nhật tiền trung cấp 1, A2/B1)</strong> thuộc khối Ngôn ngữ Nhật FPTU, Kỳ 2, <strong>nối tiếp JPD126</strong> và củng cố bạn ở trình độ <strong>JLPT N4</strong>. Bám giáo trình chuẩn <em>Minna no Nihongo II (bài ~26-38) / Genki II</em>, trọng tâm là ngữ pháp N4 và hai cách chia mới: <strong>giải thích &amp; lý do</strong> (〜んです, 〜ていただけませんか) → <strong>thử &amp; định</strong> (〜てみます, 〜予定です) → <strong>điều kiện</strong> (〜たら, 〜と) → <strong>nhượng bộ</strong> (〜ても, 〜のに) → <strong>thể khả năng &amp; liệt kê</strong> (可能動詞, 〜し, 見えます/聞こえます) → <strong>ý chí &amp; dự định</strong> (意向形, 〜ようと思います) → <strong>cho &amp; nhận ơn huệ</strong> (〜てあげる/てもらう/てくれる) → <strong>kính ngữ cơ bản</strong> (〜れます/られます, お〜します, ございます). Mỗi bài có từ vựng, ngữ pháp, hội thoại và quiz; song ngữ Nhật-Việt.',
    whatYouLearn: 'Giải thích &amp; nêu lý do bằng 〜んです; nhờ vả lịch sự 〜ていただけませんか/〜てくださいませんか; thử làm 〜てみます &amp; nói dự định 〜つもり/〜予定; đặt điều kiện 〜たら &amp; kết quả tự nhiên 〜と; nhượng bộ 〜ても &amp; 〜のに; chia &amp; dùng thể khả năng (可能動詞), liệt kê lý do 〜し, phân biệt 見えます/聞こえます với thể khả năng; chia &amp; dùng thể ý chí (意向形) với 〜ようと思います; trao đổi ơn huệ 〜てあげる/てもらう/てくれる; và kính ngữ cơ bản: tôn kính 〜れます/られます, khiêm nhường お〜します, lịch sự ございます.',
    requirements: 'Cần đã học <strong>JPD126 (Elementary Japanese 2)</strong> hoặc tương đương: chia thành thạo các thể động từ て, た, ない và thể từ điển, tính từ い/な và các trợ từ lõi. Nên dùng app thẻ ghi nhớ (Anki) để luyện thể khả năng, thể ý chí &amp; từ vựng mỗi ngày.',
  },
  sections: [
    { title: '📚 Tài liệu & lộ trình|||📚 Materials & path', description: 'Giáo trình, app, từ điển, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp JPD126, mục tiêu JLPT N4, trọng tâm thể khả năng, thể ý chí, điều kiện, ơn huệ & kính ngữ.', lessons: [intro] },
    { title: 'Bài 1 — Giải thích & lý do|||Lesson 1 — Explanation & reason', description: '〜んです, 〜ていただけませんか, 〜てくださいませんか.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Thử & định|||Lesson 2 — Trying & planning', description: '〜てみます, 〜つもりです, 〜予定です.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Điều kiện|||Lesson 3 — Conditionals', description: '〜たら, 〜と (điều kiện tự nhiên).', lessons: [b3, b3q] },
    { title: 'Bài 4 — Nhượng bộ & ngược lại|||Lesson 4 — Concession & contrast', description: '〜ても, 〜のに.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Thể khả năng & liệt kê|||Lesson 5 — Potential form & listing', description: '可能動詞, 〜し, 見えます/聞こえます.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Ý chí & dự định|||Lesson 6 — Volition & intention', description: '意向形, 〜ようと思います, 〜つもりです.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Cho & nhận ơn huệ|||Lesson 7 — Giving & receiving favours', description: 'あげます/もらいます/くれます, 〜てあげる/てもらう/てくれる.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Kính ngữ cơ bản|||Lesson 8 — Basic keigo', description: '〜れます/られます, お〜します, ございます.', lessons: [b8, b8q] },
  ],
};
