/**
 * JPD226 — Pre-Intermediate Japanese 2 (Tiếng Nhật tiền trung cấp 2, B1).
 * Khối Ngôn ngữ Nhật FPTU, Kỳ 2. NỐI TIẾP JPD216 Pre-Intermediate Japanese 1.
 * MÔN NGÔN NGỮ: cấu trúc bài học tiếng (từ vựng, ngữ pháp, hội thoại, luyện
 * tập), trình độ JLPT N4 cuối → N3. Bám giáo trình chuẩn みんなの日本語
 * Minna no Nihongo II (bài ~39-50) / Genki II.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML;
 * "&"→&amp; trong content HTML; helper doc .join('\n') ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức bài học.', quiz: { timeLimitSeconds: 300, questions } });

const taiLieu = doc('jpd226-0-0-tai-lieu', '📚 Materials & references|||📚 Tài liệu & lộ trình học',
  'Trung tâm tài liệu: giáo trình (Minna no Nihongo II bài 39-50, Genki II), app (Anki/Bunpro), từ điển jisho.org, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">JPD226 · Materials</span>
<h2>Materials &amp; resource hub</h2>
<p class="lead">Everything to finish <strong>Pre-Intermediate Japanese</strong> — this course picks up right where <strong>JPD216</strong> left off and carries you from the end of <strong>JLPT N4</strong> toward <strong>N3</strong>. The official FPTU slides &amp; textbook live on <strong>FLM</strong>; below are trusted study resources.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><strong>みんなの日本語 初級 II</strong> (Minna no Nihongo II) — this course maps to its final N4 range, roughly <strong>units 39-50</strong>: cause &amp; emotion, ways of doing, change &amp; decisions, the passive, the causative, the causative-passive and advanced keigo.</li>
<li><strong>Genki II</strong> — a friendly English-language course covering the same grammar with clear drills.</li>
</ul>
<h3>🌐 Dictionary &amp; grammar</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — the best free Japanese-English dictionary; it shows each verb's group and all of its plain forms.</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — grammar SRS ordered by JLPT level; drill each pattern below in order, then continue into N3.</li>
</ul>
<h3>🃏 Apps for drilling</h3>
<ul>
<li><strong>Anki</strong> — spaced-repetition flashcards; add decks for the passive, causative and causative-passive conjugations and the keigo verb pairs.</li>
<li><strong>Migii JLPT</strong> — N4/N3 mock tests and vocab by level, popular in Vietnam.</li>
</ul>
<div class="callout"><span class="badge">4-step study path</span>
<ol>
<li><strong>Review JPD216</strong> — the potential, volitional, conditional and giving/receiving patterns must be automatic; the passive and causative built here reuse the same group rules.</li>
<li><strong>Master the new conjugations</strong> — the passive (〜られます), causative (〜させます) and causative-passive (〜させられます) are the heart of this course; learn the group rules before their grammar.</li>
<li><strong>Use the patterns</strong> — explain causes, describe how to do things, state changes &amp; decisions, speak in the passive and causative, use full keigo, and report what others say.</li>
<li><strong>Test-ready</strong> — drill vocab &amp; conjugation with Anki, take N4/N3 mock tests on Migii.</li>
</ol></div>`,
    `<span class="eyebrow">JPD226 · Tài liệu</span>
<h2>Trung tâm tài liệu &amp; lộ trình</h2>
<p class="lead">Mọi thứ để học nốt <strong>tiếng Nhật tiền trung cấp</strong> — môn này nối thẳng từ <strong>JPD216</strong> và đưa bạn từ cuối <strong>JLPT N4</strong> tiến tới <strong>N3</strong>. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn học đáng tin.</p>
<h3>📘 Giáo trình lõi</h3>
<ul>
<li><strong>みんなの日本語 初級 II</strong> (Minna no Nihongo II) — môn này bám vùng N4 cuối, khoảng <strong>bài 39-50</strong>: nguyên nhân &amp; cảm xúc, cách làm, thay đổi &amp; quyết định, thể bị động, thể sai khiến, thể sai khiến-bị động và kính ngữ nâng cao.</li>
<li><strong>Genki II</strong> — giáo trình tiếng Anh dễ tiếp cận, cùng ngữ pháp này với bài luyện rõ ràng.</li>
</ul>
<h3>🌐 Từ điển &amp; ngữ pháp</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — từ điển Nhật-Anh miễn phí tốt nhất; nó chỉ rõ nhóm động từ và mọi thể thường.</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — luyện ngữ pháp theo trình độ JLPT; luyện lần lượt các mẫu bên dưới rồi học tiếp lên N3.</li>
</ul>
<h3>🃏 App luyện</h3>
<ul>
<li><strong>Anki</strong> — thẻ ghi nhớ lặp lại ngắt quãng; nên tạo bộ cho cách chia thể bị động, sai khiến, sai khiến-bị động và các cặp động từ kính ngữ.</li>
<li><strong>Migii JLPT</strong> — đề thi thử N4/N3 &amp; từ vựng theo trình độ, phổ biến ở Việt Nam.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình học 4 bước</span>
<ol>
<li><strong>Ôn JPD216</strong> — thể khả năng, ý chí, điều kiện và nhóm cho/nhận phải thành phản xạ; thể bị động và sai khiến ở đây dùng lại chính các quy tắc nhóm đó.</li>
<li><strong>Nắm vững các cách chia mới</strong> — thể bị động (〜られます), sai khiến (〜させます) và sai khiến-bị động (〜させられます) là trọng tâm; học quy tắc nhóm trước khi học ngữ pháp dùng chúng.</li>
<li><strong>Dùng mẫu câu</strong> — nêu nguyên nhân, tả cách làm, nói thay đổi &amp; quyết định, dùng bị động và sai khiến, dùng kính ngữ đầy đủ, và truyền đạt lời người khác.</li>
<li><strong>Sẵn sàng thi</strong> — luyện từ vựng &amp; chia động từ bằng Anki, làm đề N4/N3 thử trên Migii.</li>
</ol></div>`,
  ]]);

const intro = doc('jpd226-0-1-overview', 'Course overview: Pre-Intermediate Japanese 2|||Tổng quan: Tiếng Nhật tiền trung cấp 2',
  'Nối tiếp JPD216; mục tiêu cuối N4 tiến tới N3; trọng tâm bị động, sai khiến, sai khiến-bị động, kính ngữ nâng cao và truyền đạt; lộ trình 8 bài.',
  [[
    `<span class="eyebrow">JPD226 · Lesson 0.1 · Overview</span>
<h2>Pre-Intermediate Japanese 2 (B1)</h2>
<p class="lead">This course continues <strong>JPD216 (Pre-Intermediate Japanese 1)</strong> and completes the <strong>JLPT N4</strong> grammar, opening the door to <strong>N3</strong>. Where JPD216 taught the potential, volitional and conditional forms, this course adds three demanding new conjugations — the <strong>passive</strong>, the <strong>causative</strong> and the <strong>causative-passive</strong> — plus full <strong>keigo</strong>.</p>
<h3>What is new here</h3>
<p>You move into richer expression: <strong>〜て / 〜ので / 〜ために</strong> state cause and purpose, <strong>〜方</strong> and <strong>〜やすい/にくい</strong> describe how to do things, <strong>〜ようになります</strong> and <strong>〜ことにします</strong> express change &amp; decision, the <strong>passive</strong> tells what was done to you, the <strong>causative</strong> makes or lets someone act, the <strong>causative-passive</strong> says you were made to act, advanced <strong>keigo</strong> handles superiors and customers, and <strong>〜そうです / 〜ようです / 〜らしい</strong> report and infer.</p>
<h3>The three verb groups (quick review)</h3>
<ul>
<li><strong>Group I (う-verbs)</strong> — かきます, のみます, いきます; the ます-stem ends in an i-sound.</li>
<li><strong>Group II (る-verbs)</strong> — たべます, みます; conjugate by simply swapping ます.</li>
<li><strong>Group III (irregular)</strong> — only します and きます.</li>
</ul>
<h3>Roadmap (8 lessons)</h3>
<p>Cause &amp; emotion → ways of doing → change &amp; decisions → passive → causative → causative-passive → advanced keigo → reporting &amp; conjecture.</p>`,
    `<span class="eyebrow">JPD226 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Nhật tiền trung cấp 2 (B1)</h2>
<p class="lead">Môn này nối tiếp <strong>JPD216 (Tiếng Nhật tiền trung cấp 1)</strong> và hoàn tất ngữ pháp <strong>JLPT N4</strong>, mở đường sang <strong>N3</strong>. Nếu JPD216 dạy thể khả năng, ý chí và điều kiện, thì môn này thêm ba cách chia mới đầy thử thách — <strong>thể bị động</strong>, <strong>thể sai khiến</strong> và <strong>thể sai khiến-bị động</strong> — cùng <strong>kính ngữ</strong> đầy đủ.</p>
<h3>Điểm mới ở đây</h3>
<p>Bạn tiến tới cách diễn đạt phong phú hơn: <strong>〜て / 〜ので / 〜ために</strong> nêu nguyên nhân &amp; mục đích, <strong>〜方</strong> và <strong>〜やすい/にくい</strong> tả cách làm, <strong>〜ようになります</strong> và <strong>〜ことにします</strong> nói thay đổi &amp; quyết định, <strong>thể bị động</strong> kể việc xảy ra với mình, <strong>thể sai khiến</strong> bắt/cho ai làm, <strong>thể sai khiến-bị động</strong> nói bị bắt phải làm, <strong>kính ngữ</strong> nâng cao dùng với người trên và khách, và <strong>〜そうです / 〜ようです / 〜らしい</strong> để truyền đạt và suy đoán.</p>
<h3>Ba nhóm động từ (ôn nhanh)</h3>
<ul>
<li><strong>Nhóm I (động từ う)</strong> — かきます, のみます, いきます; đuôi thể ます kết thúc bằng âm hàng i.</li>
<li><strong>Nhóm II (động từ る)</strong> — たべます, みます; chia bằng cách bỏ ます.</li>
<li><strong>Nhóm III (bất quy tắc)</strong> — chỉ có します và きます.</li>
</ul>
<h3>Lộ trình (8 bài)</h3>
<p>Nguyên nhân &amp; cảm xúc → cách làm → thay đổi &amp; quyết định → bị động → sai khiến → sai khiến-bị động → kính ngữ nâng cao → truyền đạt &amp; suy đoán.</p>`,
  ]]);

const b1 = doc('jpd226-1-1-cause-emotion', 'Lesson 1 — Cause & emotion|||Bài 1 — Nguyên nhân & cảm xúc',
  '〜て (nguyên nhân của cảm xúc/trạng thái); 〜ので (lý do, nhẹ &amp; lịch sự); 〜ために (mục đích / nguyên nhân).',
  [[
    `<span class="eyebrow">JPD226 · Lesson 1</span>
<h2>Cause &amp; emotion</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>事故</td><td>jiko</td><td>accident</td></tr>
<tr><td>びっくりします</td><td>bikkuri shimasu</td><td>to be surprised</td></tr>
<tr><td>安心します</td><td>anshin shimasu</td><td>to feel relieved</td></tr>
<tr><td>用事</td><td>yōji</td><td>errand / personal business</td></tr>
<tr><td>止まります</td><td>tomarimasu</td><td>to stop (intransitive)</td></tr>
</table>
<h3>Grammar — 〜て (reason for an emotion / state)</h3>
<p>The <strong>て-form</strong> can join a cause to a feeling or non-controllable state. The second clause must NOT be a request, will or command.</p>
<ul>
<li>ニュースを 聞いて、びっくりしました。 (Nyūsu o kiite, bikkuri shimashita.) — Hearing the news, I was surprised.</li>
<li>家族に 会えなくて、さびしいです。 (Kazoku ni aenakute, sabishii desu.) — Not being able to see my family, I feel lonely. (negative: 〜なくて)</li>
</ul>
<h3>Grammar — 〜ので (because, soft &amp; polite)</h3>
<p><strong>[plain form] ので</strong> gives a reason more softly and politely than から. A noun or な-adjective takes <strong>な</strong> before ので.</p>
<ul>
<li>用事が あるので、先に 帰ります。 (Yōji ga aru node, saki ni kaerimasu.) — Because I have an errand, I will leave first.</li>
<li>きょうは 日曜日なので、銀行は 休みです。 (Kyō wa nichiyōbi na node, ginkō wa yasumi desu.) — Because it is Sunday, the bank is closed.</li>
</ul>
<h3>Grammar — 〜ために (purpose / cause)</h3>
<p><strong>[dictionary form / noun の] ために</strong> = "in order to" (purpose). <strong>[noun の / plain past] ために</strong> = "because of" (cause).</p>
<ul>
<li>日本語を 勉強するために、日本へ 来ました。 (Nihongo o benkyō suru tame ni, nihon e kimashita.) — I came to Japan in order to study Japanese.</li>
<li>事故のために、電車が 遅れました。 (Jiko no tame ni, densha ga okuremashita.) — Because of an accident, the train was late.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: どうして 遅れたんですか。
   Dōshite okureta n desu ka.
B: 事故のために、電車が 止まったんです。
   Jiko no tame ni, densha ga tomatta n desu.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜て for a cause only works when the result is a feeling, ability or state you cannot control — never a command or request. Use ので for polite, gentle reasoning. ために means "purpose" with a volitional verb and "cause" with a fact.</div>`,
    `<span class="eyebrow">JPD226 · Bài 1</span>
<h2>Nguyên nhân &amp; cảm xúc</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>事故</td><td>jiko</td><td>tai nạn</td></tr>
<tr><td>びっくりします</td><td>bikkuri shimasu</td><td>giật mình, ngạc nhiên</td></tr>
<tr><td>安心します</td><td>anshin shimasu</td><td>yên tâm</td></tr>
<tr><td>用事</td><td>yōji</td><td>việc bận / việc riêng</td></tr>
<tr><td>止まります</td><td>tomarimasu</td><td>dừng lại (tự động)</td></tr>
</table>
<h3>Ngữ pháp — 〜て (nguyên nhân của cảm xúc / trạng thái)</h3>
<p><strong>Thể て</strong> có thể nối một nguyên nhân với một cảm xúc hoặc trạng thái không tự chủ. Vế sau KHÔNG được là lời nhờ, ý chí hay mệnh lệnh.</p>
<ul>
<li>ニュースを 聞いて、びっくりしました。 (Nyūsu o kiite, bikkuri shimashita.) — Nghe tin, tôi giật mình.</li>
<li>家族に 会えなくて、さびしいです。 (Kazoku ni aenakute, sabishii desu.) — Không gặp được gia đình, tôi thấy buồn. (phủ định: 〜なくて)</li>
</ul>
<h3>Ngữ pháp — 〜ので (vì, nhẹ &amp; lịch sự)</h3>
<p><strong>[thể thường] ので</strong> nêu lý do một cách mềm và lịch sự hơn から. Danh từ hoặc tính từ な thêm <strong>な</strong> trước ので.</p>
<ul>
<li>用事が あるので、先に 帰ります。 (Yōji ga aru node, saki ni kaerimasu.) — Vì có việc bận, tôi xin về trước.</li>
<li>きょうは 日曜日なので、銀行は 休みです。 (Kyō wa nichiyōbi na node, ginkō wa yasumi desu.) — Vì hôm nay là chủ nhật nên ngân hàng nghỉ.</li>
</ul>
<h3>Ngữ pháp — 〜ために (mục đích / nguyên nhân)</h3>
<p><strong>[thể từ điển / danh từ の] ために</strong> = "để, nhằm" (mục đích). <strong>[danh từ の / thể quá khứ] ために</strong> = "vì, do" (nguyên nhân).</p>
<ul>
<li>日本語を 勉強するために、日本へ 来ました。 (Nihongo o benkyō suru tame ni, nihon e kimashita.) — Tôi đến Nhật để học tiếng Nhật.</li>
<li>事故のために、電車が 遅れました。 (Jiko no tame ni, densha ga okuremashita.) — Vì tai nạn nên tàu điện bị muộn.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: どうして 遅れたんですか。
   Dōshite okureta n desu ka.
B: 事故のために、電車が 止まったんです。
   Jiko no tame ni, densha ga tomatta n desu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜て chỉ nguyên nhân chỉ dùng được khi vế sau là cảm xúc, khả năng hay trạng thái không tự chủ — không bao giờ là mệnh lệnh hay lời nhờ. Dùng ので để lập luận nhẹ nhàng, lịch sự. ために mang nghĩa "mục đích" với động từ ý chí, và "nguyên nhân" với một sự việc.</div>`,
  ]]);

const b1q = quiz('jpd226-quiz-1', 'Quiz 1 — Cause & emotion|||Quiz 1 — Nguyên nhân & cảm xúc', [
  { id: 'q1', question: 'Vế sau 〜て chỉ nguyên nhân KHÔNG được là loại câu nào?|||The clause after cause-marking 〜て must NOT be which kind?', options: ['cảm xúc|||an emotion', 'trạng thái|||a state', 'mệnh lệnh / lời nhờ|||a command or request', 'khả năng|||an ability'], correctIndex: 2, explanation: '〜て chỉ nguyên nhân chỉ đi với cảm xúc/khả năng/trạng thái không tự chủ, không đi với mệnh lệnh hay lời nhờ.' },
  { id: 'q2', question: 'Danh từ 日曜日 đứng trước ので thì thêm gì?|||What comes between the noun 日曜日 and ので?', options: ['だ', 'な', 'の', 'không thêm gì|||nothing'], correctIndex: 1, explanation: 'Danh từ / tính từ な + な + ので: 日曜日なので.' },
  { id: 'q3', question: '"Tôi đến Nhật để học tiếng Nhật" dùng động từ ở thể nào trước ために?|||"I came to Japan in order to study Japanese" uses which form before ために?', options: ['thể từ điển|||the dictionary form', 'thể て|||the て-form', 'thể た|||the た-form', 'thể ます|||the ます-form'], correctIndex: 0, explanation: 'Mục đích: [thể từ điển] ために — 勉強するために.' },
]);

const b2 = doc('jpd226-2-1-ways-of-doing', 'Lesson 2 — Ways of doing & situations|||Bài 2 — Cách làm & tình huống',
  '〜方 (cách làm); 〜やすい/〜にくい (dễ / khó làm); 〜ようにします (cố gắng làm thường xuyên).',
  [[
    `<span class="eyebrow">JPD226 · Lesson 2</span>
<h2>Ways of doing &amp; situations</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>使い方</td><td>tsukaikata</td><td>how to use</td></tr>
<tr><td>割れます</td><td>waremasu</td><td>to break / crack (intransitive)</td></tr>
<tr><td>濃い</td><td>koi</td><td>strong (taste) / dark (colour)</td></tr>
<tr><td>運動します</td><td>undō shimasu</td><td>to exercise</td></tr>
<tr><td>辞書</td><td>jisho</td><td>dictionary</td></tr>
</table>
<h3>Grammar — 〜方 (かた, way of doing)</h3>
<p><strong>[ます-stem] + 方</strong> makes a noun meaning "the way of doing". 使います → 使い方, 読みます → 読み方.</p>
<ul>
<li>漢字の 書き方を 教えてください。 (Kanji no kakikata o oshiete kudasai.) — Please teach me how to write kanji.</li>
</ul>
<h3>Grammar — 〜やすい / 〜にくい (easy / hard to do)</h3>
<p><strong>[ます-stem] + やすい</strong> = easy to do / tends to; <strong>[ます-stem] + にくい</strong> = hard to do. Both inflect like い-adjectives.</p>
<ul>
<li>この 薬は 飲みやすいです。 (Kono kusuri wa nomiyasui desu.) — This medicine is easy to take.</li>
<li>この コップは 割れやすいです。 (Kono koppu wa wareyasui desu.) — This glass breaks easily.</li>
<li>この ペンは 書きにくいです。 (Kono pen wa kakinikui desu.) — This pen is hard to write with.</li>
</ul>
<h3>Grammar — 〜ようにします (make an effort to)</h3>
<p><strong>[dictionary / ない form] + ようにします</strong> = make a habit of / try to do regularly.</p>
<ul>
<li>毎日 運動するように します。 (Mainichi undō suru yō ni shimasu.) — I will try to exercise every day.</li>
<li>あまい ものを 食べないように しています。 (Amai mono o tabenai yō ni shite imasu.) — I am trying not to eat sweet things.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: この 言葉の 読み方が わかりません。
   Kono kotoba no yomikata ga wakarimasen.
B: この 辞書は 使いやすいですよ。使って みて ください。
   Kono jisho wa tsukaiyasui desu yo. Tsukatte mite kudasai.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜方 turns a verb into a noun. 〜やすい / 〜にくい inflect like い-adjectives (〜やすくて, 〜やすかったです). Do not confuse 〜ようにします (ongoing effort) with 〜ようになります (a change that has happened), which is Lesson 3.</div>`,
    `<span class="eyebrow">JPD226 · Bài 2</span>
<h2>Cách làm &amp; tình huống</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>使い方</td><td>tsukaikata</td><td>cách dùng</td></tr>
<tr><td>割れます</td><td>waremasu</td><td>vỡ, nứt (tự động)</td></tr>
<tr><td>濃い</td><td>koi</td><td>đậm (vị) / sẫm (màu)</td></tr>
<tr><td>運動します</td><td>undō shimasu</td><td>vận động, tập thể dục</td></tr>
<tr><td>辞書</td><td>jisho</td><td>từ điển</td></tr>
</table>
<h3>Ngữ pháp — 〜方 (かた, cách làm)</h3>
<p><strong>[đuôi ます] + 方</strong> tạo danh từ nghĩa "cách làm". 使います → 使い方, 読みます → 読み方.</p>
<ul>
<li>漢字の 書き方を 教えてください。 (Kanji no kakikata o oshiete kudasai.) — Xin chỉ tôi cách viết chữ Hán.</li>
</ul>
<h3>Ngữ pháp — 〜やすい / 〜にくい (dễ / khó làm)</h3>
<p><strong>[đuôi ます] + やすい</strong> = dễ làm / hay bị; <strong>[đuôi ます] + にくい</strong> = khó làm. Cả hai chia như tính từ い.</p>
<ul>
<li>この 薬は 飲みやすいです。 (Kono kusuri wa nomiyasui desu.) — Thuốc này dễ uống.</li>
<li>この コップは 割れやすいです。 (Kono koppu wa wareyasui desu.) — Cái cốc này dễ vỡ.</li>
<li>この ペンは 書きにくいです。 (Kono pen wa kakinikui desu.) — Cây bút này khó viết.</li>
</ul>
<h3>Ngữ pháp — 〜ようにします (cố gắng làm thường xuyên)</h3>
<p><strong>[thể từ điển / thể ない] + ようにします</strong> = tạo thói quen / cố gắng làm đều đặn.</p>
<ul>
<li>毎日 運動するように します。 (Mainichi undō suru yō ni shimasu.) — Tôi sẽ cố tập thể dục mỗi ngày.</li>
<li>あまい ものを 食べないように しています。 (Amai mono o tabenai yō ni shite imasu.) — Tôi đang cố không ăn đồ ngọt.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: この 言葉の 読み方が わかりません。
   Kono kotoba no yomikata ga wakarimasen.
B: この 辞書は 使いやすいですよ。使って みて ください。
   Kono jisho wa tsukaiyasui desu yo. Tsukatte mite kudasai.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜方 biến động từ thành danh từ. 〜やすい / 〜にくい chia như tính từ い (〜やすくて, 〜やすかったです). Đừng lẫn 〜ようにします (cố gắng đang diễn ra) với 〜ようになります (một thay đổi đã xảy ra) ở Bài 3.</div>`,
  ]]);

const b2q = quiz('jpd226-quiz-2', 'Quiz 2 — Ways of doing|||Quiz 2 — Cách làm', [
  { id: 'q1', question: '書きます + 方 tạo ra từ nào?|||What does 書きます + 方 make?', options: ['書くかた', '書き方 (cách viết)|||書き方 (way of writing)', '書いて方', '書けかた'], correctIndex: 1, explanation: '[đuôi ます] + 方: 書きます → 書き方 (cách viết).' },
  { id: 'q2', question: '"Cái cốc này dễ vỡ" dùng đuôi nào?|||"This glass breaks easily" uses which suffix?', options: ['割れにくい', '割れやすい', '割れかた', '割れよう'], correctIndex: 1, explanation: '[đuôi ます] + やすい = dễ / hay bị: 割れやすい.' },
  { id: 'q3', question: '〜ようにします khác 〜ようになります ở chỗ nào?|||How does 〜ようにします differ from 〜ようになります?', options: ['nó nói về sự cố gắng đều đặn, còn 〜ようになります nói về một thay đổi đã xảy ra|||it is about ongoing effort, while 〜ようになります is about a change that happened', 'không khác gì|||no difference', '〜ようにします chỉ dùng cho danh từ|||〜ようにします is only for nouns', '〜ようになります là mệnh lệnh|||〜ようになります is a command'], correctIndex: 0, explanation: '〜ようにします = cố gắng/tạo thói quen; 〜ようになります = một thay đổi đã đạt tới.' },
]);

const b3 = doc('jpd226-3-1-change-decision', 'Lesson 3 — Change & decisions|||Bài 3 — Thay đổi & quyết định',
  '〜ようになります (thay đổi khả năng/trạng thái); 〜ことにします (tự quyết định); 〜ことになります (được quyết định).',
  [[
    `<span class="eyebrow">JPD226 · Lesson 3</span>
<h2>Change &amp; decisions</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>決めます</td><td>kimemasu</td><td>to decide</td></tr>
<tr><td>転勤します</td><td>tenkin shimasu</td><td>to be transferred (job)</td></tr>
<tr><td>日記</td><td>nikki</td><td>diary</td></tr>
<tr><td>通います</td><td>kayoimasu</td><td>to commute / attend regularly</td></tr>
<tr><td>やめます</td><td>yamemasu</td><td>to quit / stop</td></tr>
</table>
<h3>Grammar — 〜ようになります (a change reached)</h3>
<p><strong>[potential / dictionary form] + ようになります</strong> = come to be able to / a change over time.</p>
<ul>
<li>練習して、日本語が 話せるように なりました。 (Renshū shite, nihongo ga hanaseru yō ni narimashita.) — After practising, I became able to speak Japanese.</li>
<li>毎朝 走るように なりました。 (Maiasa hashiru yō ni narimashita.) — I have come to run every morning.</li>
</ul>
<h3>Grammar — 〜ことにします (I decide to)</h3>
<p><strong>[dictionary / ない form] + ことにします</strong> = a decision you make yourself.</p>
<ul>
<li>たばこを やめる ことに します。 (Tabako o yameru koto ni shimasu.) — I have decided to quit smoking.</li>
<li>毎日 日記を 書く ことに して います。 (Mainichi nikki o kaku koto ni shite imasu.) — I make it a rule to write a diary every day.</li>
</ul>
<h3>Grammar — 〜ことになります (it is decided)</h3>
<p><strong>[dictionary / ない form] + ことになります</strong> = a decision made by circumstances or others.</p>
<ul>
<li>来月 大阪へ 転勤する ことに なりました。 (Raigetsu Ōsaka e tenkin suru koto ni narimashita.) — It has been decided that I will be transferred to Osaka next month.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 夏休みは どう するんですか。
   Natsuyasumi wa dō suru n desu ka.
B: 国へ 帰る ことに しました。
   Kuni e kaeru koto ni shimashita.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜ようになります is a change of ability or state over time; 〜ことにします is your own decision; 〜ことになります is a decision reached by others or by circumstances. Compare with 〜つもり (a personal intention) from JPD216.</div>`,
    `<span class="eyebrow">JPD226 · Bài 3</span>
<h2>Thay đổi &amp; quyết định</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>決めます</td><td>kimemasu</td><td>quyết định</td></tr>
<tr><td>転勤します</td><td>tenkin shimasu</td><td>chuyển công tác</td></tr>
<tr><td>日記</td><td>nikki</td><td>nhật ký</td></tr>
<tr><td>通います</td><td>kayoimasu</td><td>đi lại thường xuyên</td></tr>
<tr><td>やめます</td><td>yamemasu</td><td>bỏ, thôi</td></tr>
</table>
<h3>Ngữ pháp — 〜ようになります (một thay đổi đã đạt tới)</h3>
<p><strong>[thể khả năng / thể từ điển] + ようになります</strong> = trở nên có thể / thay đổi dần theo thời gian.</p>
<ul>
<li>練習して、日本語が 話せるように なりました。 (Renshū shite, nihongo ga hanaseru yō ni narimashita.) — Sau khi luyện tập, tôi đã nói được tiếng Nhật.</li>
<li>毎朝 走るように なりました。 (Maiasa hashiru yō ni narimashita.) — Tôi đã bắt đầu chạy mỗi sáng.</li>
</ul>
<h3>Ngữ pháp — 〜ことにします (tôi quyết định)</h3>
<p><strong>[thể từ điển / thể ない] + ことにします</strong> = quyết định do chính mình đưa ra.</p>
<ul>
<li>たばこを やめる ことに します。 (Tabako o yameru koto ni shimasu.) — Tôi quyết định bỏ thuốc lá.</li>
<li>毎日 日記を 書く ことに して います。 (Mainichi nikki o kaku koto ni shite imasu.) — Tôi tự đặt lệ viết nhật ký mỗi ngày.</li>
</ul>
<h3>Ngữ pháp — 〜ことになります (được quyết định)</h3>
<p><strong>[thể từ điển / thể ない] + ことになります</strong> = quyết định do hoàn cảnh hoặc người khác đưa ra.</p>
<ul>
<li>来月 大阪へ 転勤する ことに なりました。 (Raigetsu Ōsaka e tenkin suru koto ni narimashita.) — Tháng sau tôi được quyết định chuyển công tác tới Osaka.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 夏休みは どう するんですか。
   Natsuyasumi wa dō suru n desu ka.
B: 国へ 帰る ことに しました。
   Kuni e kaeru koto ni shimashita.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜ようになります là thay đổi về khả năng hoặc trạng thái theo thời gian; 〜ことにします là quyết định của bản thân; 〜ことになります là quyết định do người khác hoặc hoàn cảnh. So với 〜つもり (ý định cá nhân) ở JPD216.</div>`,
  ]]);

const b3q = quiz('jpd226-quiz-3', 'Quiz 3 — Change & decisions|||Quiz 3 — Thay đổi & quyết định', [
  { id: 'q1', question: '"Tôi đã nói được tiếng Nhật (sau khi luyện)" dùng mẫu nào?|||"I became able to speak Japanese" uses which pattern?', options: ['話せるように なりました', '話す ことに しました', '話し方が わかりました', '話させられました'], correctIndex: 0, explanation: '[thể khả năng] + ようになりました = trở nên có thể: 話せるようになりました.' },
  { id: 'q2', question: 'Mẫu nào nói QUYẾT ĐỊNH DO CHÍNH MÌNH?|||Which pattern expresses a decision YOU make yourself?', options: ['〜ことになります', '〜ことにします', '〜ようになります', '〜ようです'], correctIndex: 1, explanation: '〜ことにします = tự quyết định; 〜ことになります = do người khác/hoàn cảnh quyết.' },
  { id: 'q3', question: '"Tôi được quyết định chuyển công tác tới Osaka" dùng mẫu nào?|||"It has been decided that I will be transferred to Osaka" uses which pattern?', options: ['転勤する ことに しました', '転勤する ことに なりました', '転勤するように します', '転勤する つもりです'], correctIndex: 1, explanation: '〜ことになりました = quyết định do bên ngoài đưa ra (công ty), không phải tự mình.' },
]);

const b4 = doc('jpd226-4-1-passive', 'Lesson 4 — The passive|||Bài 4 — Thể bị động',
  'Thể bị động (受身 〜られます); câu bị động trực tiếp và gián tiếp (chịu thiệt).',
  [[
    `<span class="eyebrow">JPD226 · Lesson 4</span>
<h2>The passive (受身)</h2>
<h3>How to form the passive</h3>
<table>
<tr><th>group</th><th>rule</th><th>example</th></tr>
<tr><td>I</td><td>u-row → a-row + れます</td><td>かく → かかれる, よむ → よまれる, いう → いわれる</td></tr>
<tr><td>II (る-verbs)</td><td>る → られる</td><td>たべる → たべられる, みる → みられる</td></tr>
<tr><td>III</td><td>irregular</td><td>する → される, くる → こられる</td></tr>
</table>
<p>All passive verbs behave like Group II verbs. The agent (the doer) takes <strong>に</strong>.</p>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>ほめます</td><td>homemasu</td><td>to praise</td></tr>
<tr><td>しかります</td><td>shikarimasu</td><td>to scold</td></tr>
<tr><td>盗みます</td><td>nusumimasu</td><td>to steal</td></tr>
<tr><td>泥棒</td><td>dorobō</td><td>thief</td></tr>
<tr><td>踏みます</td><td>fumimasu</td><td>to step on</td></tr>
</table>
<h3>Direct passive</h3>
<ul>
<li>私は 先生に ほめられました。 (Watashi wa sensei ni homeraremashita.) — I was praised by the teacher.</li>
<li>この お寺は 300年前に 建てられました。 (Kono otera wa sanbyaku-nen mae ni tateraremashita.) — This temple was built 300 years ago.</li>
</ul>
<h3>Indirect passive (suffering)</h3>
<p>The subject is troubled by an action, even one not aimed at them.</p>
<ul>
<li>私は 泥棒に かばんを 盗まれました。 (Watashi wa dorobō ni kaban o nusumaremashita.) — I had my bag stolen by a thief.</li>
<li>雨に 降られました。 (Ame ni furaremashita.) — I got rained on (and was troubled).</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: どう したんですか。
   Dō shita n desu ka.
B: 電車で 足を 踏まれたんです。
   Densha de ashi o fumareta n desu.
</code></pre>
<div class="callout"><span class="badge">Note</span> For Group II verbs the passive (食べられる) looks exactly like the potential (食べられる) — context tells them apart. The agent always takes に. The indirect passive adds a nuance of nuisance or being troubled.</div>`,
    `<span class="eyebrow">JPD226 · Bài 4</span>
<h2>Thể bị động (受身)</h2>
<h3>Cách chia thể bị động</h3>
<table>
<tr><th>nhóm</th><th>quy tắc</th><th>ví dụ</th></tr>
<tr><td>I</td><td>hàng u → hàng a + れます</td><td>かく → かかれる, よむ → よまれる, いう → いわれる</td></tr>
<tr><td>II (động từ る)</td><td>る → られる</td><td>たべる → たべられる, みる → みられる</td></tr>
<tr><td>III</td><td>bất quy tắc</td><td>する → される, くる → こられる</td></tr>
</table>
<p>Mọi động từ bị động đều chia như động từ nhóm II. Chủ thể hành động (người làm) đi với <strong>に</strong>.</p>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>ほめます</td><td>homemasu</td><td>khen</td></tr>
<tr><td>しかります</td><td>shikarimasu</td><td>mắng</td></tr>
<tr><td>盗みます</td><td>nusumimasu</td><td>trộm, lấy cắp</td></tr>
<tr><td>泥棒</td><td>dorobō</td><td>kẻ trộm</td></tr>
<tr><td>踏みます</td><td>fumimasu</td><td>giẫm, đạp lên</td></tr>
</table>
<h3>Bị động trực tiếp</h3>
<ul>
<li>私は 先生に ほめられました。 (Watashi wa sensei ni homeraremashita.) — Tôi được thầy khen.</li>
<li>この お寺は 300年前に 建てられました。 (Kono otera wa sanbyaku-nen mae ni tateraremashita.) — Ngôi chùa này được xây từ 300 năm trước.</li>
</ul>
<h3>Bị động gián tiếp (chịu thiệt)</h3>
<p>Chủ ngữ chịu ảnh hưởng khó chịu từ một hành động, kể cả khi hành động không nhắm vào mình.</p>
<ul>
<li>私は 泥棒に かばんを 盗まれました。 (Watashi wa dorobō ni kaban o nusumaremashita.) — Tôi bị kẻ trộm lấy mất cặp.</li>
<li>雨に 降られました。 (Ame ni furaremashita.) — Tôi bị dính mưa (và khổ sở).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: どう したんですか。
   Dō shita n desu ka.
B: 電車で 足を 踏まれたんです。
   Densha de ashi o fumareta n desu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Với động từ nhóm II, thể bị động (食べられる) trông giống hệt thể khả năng (食べられる) — ngữ cảnh phân biệt hai loại. Chủ thể hành động luôn đi với に. Bị động gián tiếp mang sắc thái phiền toái, chịu thiệt.</div>`,
  ]]);

const b4q = quiz('jpd226-quiz-4', 'Quiz 4 — The passive|||Quiz 4 — Thể bị động', [
  { id: 'q1', question: 'Thể bị động của のむ (nhóm I) là gì?|||What is the passive form of のむ (Group I)?', options: ['のまれる', 'のませる', 'のめる', 'のまされる'], correctIndex: 0, explanation: 'Nhóm I: hàng u → hàng a + れる, のむ → のまれる.' },
  { id: 'q2', question: 'Trong câu bị động, chủ thể hành động (người làm) đi với trợ từ nào?|||In a passive sentence, the agent takes which particle?', options: ['を', 'が', 'に', 'で'], correctIndex: 2, explanation: 'Chủ thể hành động của thể bị động đi với に: 先生に ほめられました.' },
  { id: 'q3', question: '"Tôi bị kẻ trộm lấy mất cặp" là loại bị động nào?|||"I had my bag stolen by a thief" is which kind of passive?', options: ['bị động trực tiếp|||direct passive', 'bị động gián tiếp (chịu thiệt)|||indirect passive (suffering)', 'thể sai khiến|||the causative', 'thể khả năng|||the potential'], correctIndex: 1, explanation: 'Bị động gián tiếp: chủ ngữ chịu thiệt do hành động lên vật của mình — 盗まれました.' },
]);

const b5 = doc('jpd226-5-1-causative', 'Lesson 5 — The causative|||Bài 5 — Thể sai khiến',
  'Thể sai khiến (使役 〜させます, bắt/cho làm); 〜させてください (xin cho phép làm).',
  [[
    `<span class="eyebrow">JPD226 · Lesson 5</span>
<h2>The causative (使役)</h2>
<h3>How to form the causative</h3>
<table>
<tr><th>group</th><th>rule</th><th>example</th></tr>
<tr><td>I</td><td>u-row → a-row + せます</td><td>かく → かかせる, よむ → よませる, いく → いかせる</td></tr>
<tr><td>II (る-verbs)</td><td>る → させる</td><td>たべる → たべさせる, みる → みさせる</td></tr>
<tr><td>III</td><td>irregular</td><td>する → させる, くる → こさせる</td></tr>
</table>
<p>The causative means "make / let someone do". The person made to act takes <strong>に</strong> with a transitive verb, but <strong>を</strong> with an intransitive verb.</p>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>資料</td><td>shiryō</td><td>materials / documents</td></tr>
<tr><td>運びます</td><td>hakobimasu</td><td>to carry</td></tr>
<tr><td>準備します</td><td>junbi shimasu</td><td>to prepare</td></tr>
<tr><td>部長</td><td>buchō</td><td>department manager</td></tr>
<tr><td>野菜</td><td>yasai</td><td>vegetables</td></tr>
</table>
<h3>Examples</h3>
<ul>
<li>部長は 私に 資料を 作らせました。 (Buchō wa watashi ni shiryō o tsukurasemashita.) — The manager made me prepare the materials. (transitive → に)</li>
<li>母は 子供を 買い物に 行かせました。 (Haha wa kodomo o kaimono ni ikasemashita.) — The mother made her child go shopping. (intransitive → を)</li>
<li>子供に 野菜を 食べさせます。 (Kodomo ni yasai o tabesasemasu.) — I make my child eat vegetables.</li>
</ul>
<h3>Grammar — 〜させてください (please let me)</h3>
<p><strong>[causative て-form] + ください</strong> asks permission or volunteers politely.</p>
<ul>
<li>すみません、早く 帰らせて ください。 (Sumimasen, hayaku kaerasete kudasai.) — Sorry, please let me leave early.</li>
<li>その 仕事は 私に やらせて ください。 (Sono shigoto wa watashi ni yarasete kudasai.) — Please let me do that job.</li>
</ul>
<div class="callout"><span class="badge">Note</span> With a transitive verb the person made to act takes に (to avoid two を in one clause); with an intransitive verb it takes を. 〜させてください is the polite way to ask permission or to offer to do something yourself.</div>`,
    `<span class="eyebrow">JPD226 · Bài 5</span>
<h2>Thể sai khiến (使役)</h2>
<h3>Cách chia thể sai khiến</h3>
<table>
<tr><th>nhóm</th><th>quy tắc</th><th>ví dụ</th></tr>
<tr><td>I</td><td>hàng u → hàng a + せます</td><td>かく → かかせる, よむ → よませる, いく → いかせる</td></tr>
<tr><td>II (động từ る)</td><td>る → させる</td><td>たべる → たべさせる, みる → みさせる</td></tr>
<tr><td>III</td><td>bất quy tắc</td><td>する → させる, くる → こさせる</td></tr>
</table>
<p>Thể sai khiến nghĩa là "bắt / cho ai làm". Người bị bắt làm đi với <strong>に</strong> khi động từ có tân ngữ (tha động từ), nhưng đi với <strong>を</strong> khi là tự động từ.</p>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>資料</td><td>shiryō</td><td>tài liệu</td></tr>
<tr><td>運びます</td><td>hakobimasu</td><td>mang, khiêng</td></tr>
<tr><td>準備します</td><td>junbi shimasu</td><td>chuẩn bị</td></tr>
<tr><td>部長</td><td>buchō</td><td>trưởng phòng</td></tr>
<tr><td>野菜</td><td>yasai</td><td>rau</td></tr>
</table>
<h3>Ví dụ</h3>
<ul>
<li>部長は 私に 資料を 作らせました。 (Buchō wa watashi ni shiryō o tsukurasemashita.) — Trưởng phòng bắt tôi làm tài liệu. (tha động từ → に)</li>
<li>母は 子供を 買い物に 行かせました。 (Haha wa kodomo o kaimono ni ikasemashita.) — Mẹ sai con đi mua đồ. (tự động từ → を)</li>
<li>子供に 野菜を 食べさせます。 (Kodomo ni yasai o tabesasemasu.) — Tôi bắt con ăn rau.</li>
</ul>
<h3>Ngữ pháp — 〜させてください (xin cho phép làm)</h3>
<p><strong>[thể て của sai khiến] + ください</strong> để xin phép hoặc xung phong một cách lịch sự.</p>
<ul>
<li>すみません、早く 帰らせて ください。 (Sumimasen, hayaku kaerasete kudasai.) — Xin lỗi, cho tôi về sớm ạ.</li>
<li>その 仕事は 私に やらせて ください。 (Sono shigoto wa watashi ni yarasete kudasai.) — Việc đó xin để tôi làm.</li>
</ul>
<div class="callout"><span class="badge">Ghi chú</span> Với tha động từ, người bị bắt làm đi với に (để tránh hai を trong một mệnh đề); với tự động từ thì đi với を. 〜させてください là cách lịch sự để xin phép hoặc xung phong tự làm.</div>`,
  ]]);

const b5q = quiz('jpd226-quiz-5', 'Quiz 5 — The causative|||Quiz 5 — Thể sai khiến', [
  { id: 'q1', question: 'Thể sai khiến của かく (nhóm I) là gì?|||What is the causative form of かく (Group I)?', options: ['かかれる', 'かかせる', 'かける', 'かかされる'], correctIndex: 1, explanation: 'Nhóm I: hàng u → hàng a + せる, かく → かかせる.' },
  { id: 'q2', question: 'Với THA động từ, người bị bắt làm đi với trợ từ nào?|||With a transitive verb, the person made to act takes which particle?', options: ['に', 'を', 'が', 'へ'], correctIndex: 0, explanation: 'Tha động từ (có を cho tân ngữ) → người bị bắt làm dùng に: 私に 資料を 作らせました.' },
  { id: 'q3', question: '"Cho tôi về sớm ạ" dùng mẫu nào?|||"Please let me leave early" uses which pattern?', options: ['帰られてください', '帰らせてください', '帰ってください', '帰りたいです'], correctIndex: 1, explanation: '[thể て của sai khiến] + ください: 帰らせてください = xin cho phép về sớm.' },
]);

const b6 = doc('jpd226-6-1-causative-passive', 'Lesson 6 — The causative-passive|||Bài 6 — Thể sai khiến-bị động',
  'Thể sai khiến-bị động (使役受身 〜させられます, bị bắt phải làm, kèm sự miễn cưỡng).',
  [[
    `<span class="eyebrow">JPD226 · Lesson 6</span>
<h2>The causative-passive (使役受身)</h2>
<h3>How to form it</h3>
<table>
<tr><th>group</th><th>rule</th><th>example</th></tr>
<tr><td>I</td><td>a-row + せられます; short: a-row + されます</td><td>のむ → のませられる = のまされる, かく → かかせられる = かかされる</td></tr>
<tr><td>I (す-verbs)</td><td>a-row + せられます (no short form)</td><td>はなす → はなさせられる</td></tr>
<tr><td>II (る-verbs)</td><td>る → させられます</td><td>たべる → たべさせられる</td></tr>
<tr><td>III</td><td>irregular</td><td>する → させられる, くる → こさせられる</td></tr>
</table>
<p>The causative-passive means "be made to do (unwillingly)". The person who forces the action takes <strong>に</strong>.</p>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>歌います</td><td>utaimasu</td><td>to sing</td></tr>
<tr><td>待ちます</td><td>machimasu</td><td>to wait</td></tr>
<tr><td>残業します</td><td>zangyō shimasu</td><td>to work overtime</td></tr>
<tr><td>飲み会</td><td>nomikai</td><td>drinking party</td></tr>
<tr><td>無理に</td><td>muri ni</td><td>forcibly / against one's will</td></tr>
</table>
<h3>Examples</h3>
<ul>
<li>私は 部長に お酒を 飲ませられました。 (Watashi wa buchō ni osake o nomaseraremashita.) — I was made to drink alcohol by the manager. (short: 飲まされました)</li>
<li>子供の とき、毎日 ピアノを 練習させられました。 (Kodomo no toki, mainichi piano o renshū saseraremashita.) — As a child, I was made to practise piano every day.</li>
<li>1時間 待たされました。 (Ichi-jikan matasaremashita.) — I was kept waiting for an hour.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 昨日の 飲み会は どうでしたか。
   Kinō no nomikai wa dō deshita ka.
B: 部長に カラオケで 歌わされました。
   Buchō ni karaoke de utawasaremashita.
</code></pre>
<div class="callout"><span class="badge">Note</span> The causative-passive says the subject unwillingly does something because someone made them, so it carries reluctance or burden. The short form (〜される) is common in speech, but す-ending verbs (はなす → はなさせられる) have no short form.</div>`,
    `<span class="eyebrow">JPD226 · Bài 6</span>
<h2>Thể sai khiến-bị động (使役受身)</h2>
<h3>Cách chia</h3>
<table>
<tr><th>nhóm</th><th>quy tắc</th><th>ví dụ</th></tr>
<tr><td>I</td><td>hàng a + せられます; rút gọn: hàng a + されます</td><td>のむ → のませられる = のまされる, かく → かかせられる = かかされる</td></tr>
<tr><td>I (động từ す)</td><td>hàng a + せられます (không có dạng rút gọn)</td><td>はなす → はなさせられる</td></tr>
<tr><td>II (động từ る)</td><td>る → させられます</td><td>たべる → たべさせられる</td></tr>
<tr><td>III</td><td>bất quy tắc</td><td>する → させられる, くる → こさせられる</td></tr>
</table>
<p>Thể sai khiến-bị động nghĩa là "bị bắt phải làm (miễn cưỡng)". Người ép hành động đi với <strong>に</strong>.</p>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>歌います</td><td>utaimasu</td><td>hát</td></tr>
<tr><td>待ちます</td><td>machimasu</td><td>đợi</td></tr>
<tr><td>残業します</td><td>zangyō shimasu</td><td>làm thêm giờ</td></tr>
<tr><td>飲み会</td><td>nomikai</td><td>buổi nhậu</td></tr>
<tr><td>無理に</td><td>muri ni</td><td>một cách miễn cưỡng, ép</td></tr>
</table>
<h3>Ví dụ</h3>
<ul>
<li>私は 部長に お酒を 飲ませられました。 (Watashi wa buchō ni osake o nomaseraremashita.) — Tôi bị trưởng phòng bắt uống rượu. (rút gọn: 飲まされました)</li>
<li>子供の とき、毎日 ピアノを 練習させられました。 (Kodomo no toki, mainichi piano o renshū saseraremashita.) — Hồi nhỏ, tôi bị bắt tập piano mỗi ngày.</li>
<li>1時間 待たされました。 (Ichi-jikan matasaremashita.) — Tôi bị bắt đợi một tiếng.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 昨日の 飲み会は どうでしたか。
   Kinō no nomikai wa dō deshita ka.
B: 部長に カラオケで 歌わされました。
   Buchō ni karaoke de utawasaremashita.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Thể sai khiến-bị động nói chủ ngữ miễn cưỡng làm gì đó vì bị người khác bắt, nên mang sắc thái không muốn, chịu khổ. Dạng rút gọn (〜される) hay dùng trong khẩu ngữ, nhưng động từ đuôi す (はなす → はなさせられる) không có dạng rút gọn.</div>`,
  ]]);

const b6q = quiz('jpd226-quiz-6', 'Quiz 6 — The causative-passive|||Quiz 6 — Thể sai khiến-bị động', [
  { id: 'q1', question: 'Thể sai khiến-bị động (dạng rút gọn) của のむ là gì?|||What is the short causative-passive of のむ?', options: ['のまれる', 'のませる', 'のまされる', 'のめる'], correctIndex: 2, explanation: 'のむ → のませられる → rút gọn のまされる (bị bắt uống).' },
  { id: 'q2', question: 'Động từ nào KHÔNG có dạng rút gọn 〜される?|||Which verb has NO short 〜される form?', options: ['のむ', 'かく', 'はなす', 'まつ'], correctIndex: 2, explanation: 'Động từ đuôi す (はなす → はなさせられる) không rút gọn được.' },
  { id: 'q3', question: 'Thể sai khiến-bị động mang sắc thái gì?|||What nuance does the causative-passive carry?', options: ['sự miễn cưỡng / bị ép|||reluctance / being forced', 'sự tôn kính|||respect', 'khả năng|||ability', 'lời rủ|||an invitation'], correctIndex: 0, explanation: 'Chủ ngữ miễn cưỡng làm vì bị người khác bắt — sắc thái không muốn, chịu khổ.' },
]);

const b7 = doc('jpd226-7-1-advanced-keigo', 'Lesson 7 — Advanced keigo|||Bài 7 — Kính ngữ nâng cao',
  'Kính ngữ tôn kính (尊敬語 いらっしゃる/召し上がる); khiêm nhường (謙譲語 参る/いただく) — động từ đặc biệt.',
  [[
    `<span class="eyebrow">JPD226 · Lesson 7</span>
<h2>Advanced keigo</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>お客様</td><td>okyakusama</td><td>customer / guest (honorific)</td></tr>
<tr><td>研究室</td><td>kenkyūshitsu</td><td>professor's office / lab</td></tr>
<tr><td>拝見します</td><td>haiken shimasu</td><td>to look (humble)</td></tr>
<tr><td>存じます</td><td>zonjimasu</td><td>to know / think (humble)</td></tr>
<tr><td>申します</td><td>mōshimasu</td><td>to say / be called (humble)</td></tr>
</table>
<h3>Respectful language (尊敬語) — the other person's actions</h3>
<table>
<tr><th>respectful</th><th>=</th><th>meaning</th></tr>
<tr><td>いらっしゃいます</td><td>います / 行きます / 来ます</td><td>to be / go / come</td></tr>
<tr><td>召し上がります</td><td>食べます / 飲みます</td><td>to eat / drink</td></tr>
<tr><td>ご覧になります</td><td>見ます</td><td>to look at</td></tr>
<tr><td>おっしゃいます</td><td>言います</td><td>to say</td></tr>
<tr><td>なさいます</td><td>します</td><td>to do</td></tr>
</table>
<ul>
<li>部長は 何を 召し上がりますか。 (Buchō wa nani o meshiagarimasu ka.) — What will the manager eat?</li>
<li>先生は 研究室に いらっしゃいます。 (Sensei wa kenkyūshitsu ni irasshaimasu.) — The teacher is in his office.</li>
</ul>
<h3>Humble language (謙譲語) — your own actions</h3>
<table>
<tr><th>humble</th><th>=</th><th>meaning</th></tr>
<tr><td>参ります</td><td>行きます / 来ます</td><td>to go / come</td></tr>
<tr><td>いただきます</td><td>食べます / 飲みます / もらいます</td><td>to eat / drink / receive</td></tr>
<tr><td>拝見します</td><td>見ます</td><td>to look at</td></tr>
<tr><td>申します</td><td>言います</td><td>to say</td></tr>
<tr><td>いたします</td><td>します</td><td>to do</td></tr>
</table>
<ul>
<li>私は 田中と 申します。 (Watashi wa Tanaka to mōshimasu.) — My name is Tanaka.</li>
<li>あした そちらへ 参ります。 (Ashita sochira e mairimasu.) — I will come there tomorrow.</li>
<li>お手紙を 拝見しました。 (Otegami o haiken shimashita.) — I have read your letter.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 先生は 今 どちらに いらっしゃいますか。
   Sensei wa ima dochira ni irasshaimasu ka.
B: 研究室に いらっしゃいます。私も これから 参ります。
   Kenkyūshitsu ni irasshaimasu. Watashi mo kore kara mairimasu.
</code></pre>
<div class="callout"><span class="badge">Note</span> Respectful language (尊敬語) raises the OTHER person's actions; humble language (謙譲語) lowers YOUR OWN to show respect. Never use 尊敬語 for yourself or 謙譲語 for a superior's actions. These special verbs are irregular — memorise the pairs.</div>`,
    `<span class="eyebrow">JPD226 · Bài 7</span>
<h2>Kính ngữ nâng cao</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>お客様</td><td>okyakusama</td><td>khách (kính)</td></tr>
<tr><td>研究室</td><td>kenkyūshitsu</td><td>phòng nghiên cứu của thầy</td></tr>
<tr><td>拝見します</td><td>haiken shimasu</td><td>xem (khiêm nhường)</td></tr>
<tr><td>存じます</td><td>zonjimasu</td><td>biết / nghĩ (khiêm nhường)</td></tr>
<tr><td>申します</td><td>mōshimasu</td><td>nói / tên là (khiêm nhường)</td></tr>
</table>
<h3>Tôn kính (尊敬語) — hành động của người khác</h3>
<table>
<tr><th>tôn kính</th><th>=</th><th>nghĩa</th></tr>
<tr><td>いらっしゃいます</td><td>います / 行きます / 来ます</td><td>ở / đi / đến</td></tr>
<tr><td>召し上がります</td><td>食べます / 飲みます</td><td>ăn / uống</td></tr>
<tr><td>ご覧になります</td><td>見ます</td><td>xem, nhìn</td></tr>
<tr><td>おっしゃいます</td><td>言います</td><td>nói</td></tr>
<tr><td>なさいます</td><td>します</td><td>làm</td></tr>
</table>
<ul>
<li>部長は 何を 召し上がりますか。 (Buchō wa nani o meshiagarimasu ka.) — Trưởng phòng dùng món gì ạ?</li>
<li>先生は 研究室に いらっしゃいます。 (Sensei wa kenkyūshitsu ni irasshaimasu.) — Thầy đang ở phòng nghiên cứu.</li>
</ul>
<h3>Khiêm nhường (謙譲語) — hành động của mình</h3>
<table>
<tr><th>khiêm nhường</th><th>=</th><th>nghĩa</th></tr>
<tr><td>参ります</td><td>行きます / 来ます</td><td>đi / đến</td></tr>
<tr><td>いただきます</td><td>食べます / 飲みます / もらいます</td><td>ăn / uống / nhận</td></tr>
<tr><td>拝見します</td><td>見ます</td><td>xem, nhìn</td></tr>
<tr><td>申します</td><td>言います</td><td>nói</td></tr>
<tr><td>いたします</td><td>します</td><td>làm</td></tr>
</table>
<ul>
<li>私は 田中と 申します。 (Watashi wa Tanaka to mōshimasu.) — Tôi tên là Tanaka.</li>
<li>あした そちらへ 参ります。 (Ashita sochira e mairimasu.) — Mai tôi sẽ đến chỗ đó ạ.</li>
<li>お手紙を 拝見しました。 (Otegami o haiken shimashita.) — Tôi đã đọc thư của ngài.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 先生は 今 どちらに いらっしゃいますか。
   Sensei wa ima dochira ni irasshaimasu ka.
B: 研究室に いらっしゃいます。私も これから 参ります。
   Kenkyūshitsu ni irasshaimasu. Watashi mo kore kara mairimasu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Tôn kính (尊敬語) nâng hành động của NGƯỜI KHÁC; khiêm nhường (謙譲語) hạ hành động của CHÍNH MÌNH để tỏ kính trọng. Đừng bao giờ dùng 尊敬語 cho mình hay 謙譲語 cho hành động của người trên. Các động từ đặc biệt này bất quy tắc — phải học thuộc từng cặp.</div>`,
  ]]);

const b7q = quiz('jpd226-quiz-7', 'Quiz 7 — Advanced keigo|||Quiz 7 — Kính ngữ nâng cao', [
  { id: 'q1', question: '召し上がります là dạng tôn kính của động từ nào?|||召し上がります is the respectful form of which verbs?', options: ['行きます / 来ます', '食べます / 飲みます', '見ます', 'します'], correctIndex: 1, explanation: '召し上がります = dạng tôn kính của 食べます / 飲みます.' },
  { id: 'q2', question: 'Nói về hành động của CHÍNH MÌNH thì dùng loại kính ngữ nào?|||To speak of YOUR OWN action, which type of keigo do you use?', options: ['tôn kính (尊敬語)|||respectful (尊敬語)', 'khiêm nhường (謙譲語)|||humble (謙譲語)', 'thể bị động|||the passive', 'thể sai khiến|||the causative'], correctIndex: 1, explanation: 'Hành động của mình dùng khiêm nhường (謙譲語): 参ります, いただきます, 申します.' },
  { id: 'q3', question: '"Mai tôi sẽ đến chỗ đó ạ" — chọn từ đúng cho 行きます (khiêm nhường).|||"I will come there tomorrow" — pick the humble word for 行きます.', options: ['いらっしゃいます', '参ります', 'おっしゃいます', 'なさいます'], correctIndex: 1, explanation: '参ります = dạng khiêm nhường của 行きます / 来ます; いらっしゃいます là tôn kính.' },
]);

const b8 = doc('jpd226-8-1-reporting-conjecture', 'Lesson 8 — Reporting & conjecture|||Bài 8 — Truyền đạt & suy đoán',
  '〜と言っていました (truyền đạt lời); 〜そうです (nghe nói / có vẻ); 〜ようです / 〜らしい (suy đoán).',
  [[
    `<span class="eyebrow">JPD226 · Lesson 8</span>
<h2>Reporting &amp; conjecture</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>天気予報</td><td>tenki yohō</td><td>weather forecast</td></tr>
<tr><td>晴れます</td><td>haremasu</td><td>to clear up (weather)</td></tr>
<tr><td>留守</td><td>rusu</td><td>being out / away from home</td></tr>
<tr><td>火事</td><td>kaji</td><td>fire</td></tr>
<tr><td>〜によると</td><td>ni yoru to</td><td>according to</td></tr>
</table>
<h3>Grammar — 〜と言っていました (someone said that)</h3>
<p><strong>[plain form] + と 言っていました</strong> reports what someone said.</p>
<ul>
<li>田中さんは 来ないと 言っていました。 (Tanaka-san wa konai to itte imashita.) — Tanaka said he would not come.</li>
</ul>
<h3>Grammar — 〜そうです (hearsay) vs (appearance)</h3>
<p><strong>[plain form] + そうです</strong> = hearsay ("I hear that"); a noun / な-adjective adds だ. <strong>[ます-stem / adjective-stem] + そうです</strong> = it looks like (a visual guess).</p>
<ul>
<li>天気予報に よると、明日は 雨だそうです。 (Tenki yohō ni yoru to, ashita wa ame da sō desu.) — According to the forecast, it will rain tomorrow. (hearsay)</li>
<li>雨が 降りそうです。 (Ame ga furisō desu.) — It looks like it will rain. (appearance)</li>
<li>この ケーキは おいしそうです。 (Kono kēki wa oishisō desu.) — This cake looks delicious. (いい → よさそう, ない → なさそう)</li>
</ul>
<h3>Grammar — 〜ようです / 〜らしい (it seems)</h3>
<p><strong>[plain form] + ようです</strong> = a judgment from your own observation (noun の, な-adj な). <strong>[plain form] + らしい</strong> = a guess from information you received.</p>
<ul>
<li>田中さんは 留守のようです。 (Tanaka-san wa rusu no yō desu.) — It seems Tanaka is out.</li>
<li>あの 店は おいしいらしいです。 (Ano mise wa oishii rashii desu.) — That shop is apparently good.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 天気予報に よると、週末は どうですか。
   Tenki yohō ni yoru to, shūmatsu wa dō desu ka.
B: 土曜日は 晴れるそうです。でも 日曜日は 雨が 降りそうですね。
   Doyōbi wa hareru sō desu. Demo nichiyōbi wa ame ga furisō desu ne.
</code></pre>
<div class="callout"><span class="badge">Note</span> Distinguish the two そうです: 雨だそうです (I heard it will rain — plain + そう) versus 雨が 降りそうです (it looks about to rain — stem + そう). ようです comes from your own observation; らしい comes from information you received.</div>`,
    `<span class="eyebrow">JPD226 · Bài 8</span>
<h2>Truyền đạt &amp; suy đoán</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>天気予報</td><td>tenki yohō</td><td>dự báo thời tiết</td></tr>
<tr><td>晴れます</td><td>haremasu</td><td>trời hửng, quang (thời tiết)</td></tr>
<tr><td>留守</td><td>rusu</td><td>vắng nhà</td></tr>
<tr><td>火事</td><td>kaji</td><td>hỏa hoạn</td></tr>
<tr><td>〜によると</td><td>ni yoru to</td><td>theo (nguồn tin)</td></tr>
</table>
<h3>Ngữ pháp — 〜と言っていました (ai đó đã nói rằng)</h3>
<p><strong>[thể thường] + と 言っていました</strong> để thuật lại lời người khác.</p>
<ul>
<li>田中さんは 来ないと 言っていました。 (Tanaka-san wa konai to itte imashita.) — Anh Tanaka nói là sẽ không đến.</li>
</ul>
<h3>Ngữ pháp — 〜そうです (nghe nói) và (có vẻ)</h3>
<p><strong>[thể thường] + そうです</strong> = nghe nói ("nghe bảo là"); danh từ / tính từ な thêm だ. <strong>[đuôi ます / gốc tính từ] + そうです</strong> = trông có vẻ (đoán qua quan sát).</p>
<ul>
<li>天気予報に よると、明日は 雨だそうです。 (Tenki yohō ni yoru to, ashita wa ame da sō desu.) — Theo dự báo, mai trời mưa. (nghe nói)</li>
<li>雨が 降りそうです。 (Ame ga furisō desu.) — Có vẻ trời sắp mưa. (quan sát)</li>
<li>この ケーキは おいしそうです。 (Kono kēki wa oishisō desu.) — Cái bánh này trông ngon. (いい → よさそう, ない → なさそう)</li>
</ul>
<h3>Ngữ pháp — 〜ようです / 〜らしい (hình như)</h3>
<p><strong>[thể thường] + ようです</strong> = phán đoán từ quan sát của chính mình (danh từ の, tính từ な thêm な). <strong>[thể thường] + らしい</strong> = phán đoán từ thông tin nghe được.</p>
<ul>
<li>田中さんは 留守のようです。 (Tanaka-san wa rusu no yō desu.) — Hình như anh Tanaka đi vắng.</li>
<li>あの 店は おいしいらしいです。 (Ano mise wa oishii rashii desu.) — Nghe nói quán kia ngon.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 天気予報に よると、週末は どうですか。
   Tenki yohō ni yoru to, shūmatsu wa dō desu ka.
B: 土曜日は 晴れるそうです。でも 日曜日は 雨が 降りそうですね。
   Doyōbi wa hareru sō desu. Demo nichiyōbi wa ame ga furisō desu ne.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Phân biệt hai そうです: 雨だそうです (nghe nói trời mưa — thể thường + そう) với 雨が 降りそうです (trông sắp mưa — gốc động từ + そう). ようです từ quan sát của bản thân; らしい từ thông tin nghe được.</div>`,
  ]]);

const b8q = quiz('jpd226-quiz-8', 'Quiz 8 — Reporting & conjecture|||Quiz 8 — Truyền đạt & suy đoán', [
  { id: 'q1', question: '"Theo dự báo, mai trời mưa" (NGHE NÓI) dùng mẫu nào?|||"According to the forecast, it will rain tomorrow" (hearsay) uses which pattern?', options: ['明日は 雨だそうです', '明日は 雨が 降りそうです', '明日は 雨のようです', '明日は 雨らしくないです'], correctIndex: 0, explanation: 'Nghe nói: [thể thường] + そうです, danh từ thêm だ → 雨だそうです.' },
  { id: 'q2', question: '雨が 降りそうです mang nghĩa gì?|||What does 雨が 降りそうです mean?', options: ['nghe nói trời mưa|||I heard it will rain', 'trông có vẻ sắp mưa|||it looks about to rain', 'trời chắc chắn mưa|||it will definitely rain', 'trời không mưa|||it will not rain'], correctIndex: 1, explanation: 'Gốc động từ + そうです = đoán qua quan sát: có vẻ sắp mưa.' },
  { id: 'q3', question: 'Để thuật lại lời người khác nói dùng mẫu nào?|||To report what someone else said, which pattern do you use?', options: ['〜と 言っていました', '〜そうに します', '〜ように なります', '〜ことに します'], correctIndex: 0, explanation: '[thể thường] + と 言っていました = thuật lại lời ai đó đã nói.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'JPD226',
    slug: 'jpd226-pre-intermediate-japanese-2-b1',
    title: 'Pre-Intermediate Japanese 2-B1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JPD226.webp',
    shortDescription: 'Pre-Intermediate Japanese 2 (B1, JLPT N4-N3), continuing JPD216 — cause & emotion, ways of doing, change & decisions, the passive, causative & causative-passive, advanced keigo, and reported speech. Bilingual, with quizzes.|||Tiếng Nhật tiền trung cấp 2 (B1, JLPT N4-N3), nối tiếp JPD216 — nguyên nhân & cảm xúc, cách làm, thay đổi & quyết định, thể bị động, sai khiến & sai khiến-bị động, kính ngữ nâng cao, và truyền đạt. Song ngữ Nhật-Việt, có quiz.',
    description: 'Môn <strong>JPD226 — Pre-Intermediate Japanese 2 (Tiếng Nhật tiền trung cấp 2, B1)</strong> thuộc khối Ngôn ngữ Nhật FPTU, Kỳ 2, <strong>nối tiếp JPD216</strong> và hoàn tất ngữ pháp <strong>JLPT N4</strong>, mở đường sang <strong>N3</strong>. Bám giáo trình chuẩn <em>Minna no Nihongo II (bài ~39-50) / Genki II</em>, trọng tâm là ba cách chia mới cùng kính ngữ đầy đủ: <strong>nguyên nhân &amp; cảm xúc</strong> (〜て, 〜ので, 〜ために) → <strong>cách làm</strong> (〜方, 〜やすい/にくい, 〜ようにします) → <strong>thay đổi &amp; quyết định</strong> (〜ようになります, 〜ことにします/になります) → <strong>thể bị động</strong> (受身 〜られます) → <strong>thể sai khiến</strong> (使役 〜させます) → <strong>thể sai khiến-bị động</strong> (使役受身 〜させられます) → <strong>kính ngữ nâng cao</strong> (尊敬語 / 謙譲語) → <strong>truyền đạt &amp; suy đoán</strong> (〜と言っていました, 〜そうです, 〜ようです/らしい). Mỗi bài có từ vựng, ngữ pháp, hội thoại và quiz; song ngữ Nhật-Việt.',
    whatYouLearn: 'Nêu nguyên nhân &amp; cảm xúc bằng 〜て/〜ので, mục đích 〜ために; tả cách làm 〜方 &amp; mức độ 〜やすい/にくい, tạo thói quen 〜ようにします; nói thay đổi 〜ようになります &amp; quyết định 〜ことにします/になります; chia &amp; dùng thể bị động (受身) trực tiếp và gián tiếp; chia &amp; dùng thể sai khiến (使役) với 〜させてください; chia &amp; dùng thể sai khiến-bị động (使役受身); dùng kính ngữ nâng cao — tôn kính (尊敬語 いらっしゃる/召し上がる) và khiêm nhường (謙譲語 参る/いただく); truyền đạt lời người khác 〜と言っていました và suy đoán 〜そうです/〜ようです/〜らしい.',
    requirements: 'Cần đã học <strong>JPD216 (Pre-Intermediate Japanese 1)</strong> hoặc tương đương: chia thành thạo thể khả năng, thể ý chí, các thể điều kiện (〜たら/〜と) và nhóm động từ cho/nhận. Nên dùng app thẻ ghi nhớ (Anki) để luyện các cách chia bị động, sai khiến &amp; từ vựng mỗi ngày.',
  },
  sections: [
    { title: '📚 Tài liệu & lộ trình|||📚 Materials & path', description: 'Giáo trình, app, từ điển, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp JPD216, mục tiêu cuối N4 tiến tới N3, trọng tâm bị động, sai khiến, sai khiến-bị động & kính ngữ.', lessons: [intro] },
    { title: 'Bài 1 — Nguyên nhân & cảm xúc|||Lesson 1 — Cause & emotion', description: '〜て, 〜ので, 〜ために.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Cách làm & tình huống|||Lesson 2 — Ways of doing', description: '〜方, 〜やすい/にくい, 〜ようにします.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Thay đổi & quyết định|||Lesson 3 — Change & decisions', description: '〜ようになります, 〜ことにします/になります.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Thể bị động|||Lesson 4 — The passive', description: '受身 〜られます, bị động trực tiếp/gián tiếp.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Thể sai khiến|||Lesson 5 — The causative', description: '使役 〜させます, 〜させてください.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Thể sai khiến-bị động|||Lesson 6 — The causative-passive', description: '使役受身 〜させられます.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Kính ngữ nâng cao|||Lesson 7 — Advanced keigo', description: '尊敬語 / 謙譲語, động từ đặc biệt.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Truyền đạt & suy đoán|||Lesson 8 — Reporting & conjecture', description: '〜と言っていました, 〜そうです, 〜ようです/らしい.', lessons: [b8, b8q] },
  ],
};
