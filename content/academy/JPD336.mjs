/**
 * JPD336 — Intermediate Japanese 2-B2.2 (Tiếng Nhật trung cấp 2, B2.2).
 * Khối Ngôn ngữ Nhật FPTU, Kỳ 4. NỐI TIẾP JPD326 Intermediate Japanese 2 (B2.1).
 * MÔN NGÔN NGỮ: cấu trúc bài học tiếng (từ vựng, ngữ pháp, hội thoại, luyện
 * tập), trình độ JLPT N3 cuối → N2 đầu (中級). Bám giáo trình chuẩn みんなの日本語
 * 中級 II Minna no Nihongo Chukyu II / Tobira.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML;
 * "&"→&amp; trong content HTML; helper doc .join('\n') ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức bài học.', quiz: { timeLimitSeconds: 300, questions } });

const taiLieu = doc('jpd336-0-0-tai-lieu', '📚 Materials & references|||📚 Tài liệu & lộ trình học',
  'Trung tâm tài liệu: giáo trình (Minna no Nihongo Chukyu II, Tobira), app (Anki/Bunpro), từ điển jisho.org, lộ trình 4 bước cho N3 cuối - N2 đầu.',
  [[
    `<span class="eyebrow">JPD336 · Materials</span>
<h2>Materials &amp; resource hub</h2>
<p class="lead">Everything to work through <strong>Intermediate Japanese 2-B2.2</strong> — this course picks up right where <strong>JPD326</strong> left off and carries you from solid <strong>JLPT N3</strong> into the first <strong>N2</strong> patterns (中級). The official FPTU slides &amp; textbook live on <strong>FLM</strong>; below are trusted study resources.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><strong>みんなの日本語 中級 II</strong> (Minna no Nihongo Chukyu II) — the standard bridge that takes you from N3 into N2; each lesson pairs a reading with the exact patterns taught here.</li>
<li><strong>とびら (Tobira: Gateway to Advanced Japanese)</strong> — a content-rich intermediate course whose chapters cover the same connectives, modality and formal expressions.</li>
</ul>
<h3>🌐 Dictionary &amp; grammar</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — the best free Japanese-English dictionary; it tags each word by JLPT level and shows every plain form.</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — grammar SRS ordered by JLPT level; drill every N3 and early-N2 pattern below in order.</li>
</ul>
<h3>🃏 Apps for drilling</h3>
<ul>
<li><strong>Anki</strong> — spaced-repetition flashcards; add decks for N3-N2 vocabulary and for the pattern pairs that are easy to confuse (おかげで vs せいで, 次第 vs たとたん, ものだ vs ことだ).</li>
<li><strong>Migii JLPT</strong> — N3 &amp; N2 mock tests and vocab by level, popular in Vietnam.</li>
</ul>
<div class="callout"><span class="badge">4-step study path</span>
<ol>
<li><strong>Review JPD326</strong> — the four conditionals, keigo and the extended て-forms must be automatic; the patterns here build directly on them.</li>
<li><strong>Learn each pattern in a pair</strong> — intermediate grammar is mostly about telling near-synonyms apart (おかげで vs せいで, くせに vs のに, に違いない vs に決まっている). Study the contrast, not the pattern alone.</li>
<li><strong>Read and speak</strong> — the patterns appear constantly in intermediate readings and conversation; use each lesson dialogue as a model.</li>
<li><strong>Test-ready</strong> — drill vocab &amp; grammar with Anki, take N3-N2 mock tests on Migii.</li>
</ol></div>`,
    `<span class="eyebrow">JPD336 · Tài liệu</span>
<h2>Trung tâm tài liệu &amp; lộ trình</h2>
<p class="lead">Mọi thứ để học <strong>Tiếng Nhật trung cấp 2-B2.2</strong> — môn này nối thẳng từ <strong>JPD326</strong> và đưa bạn từ <strong>JLPT N3</strong> vững vàng sang những mẫu <strong>N2</strong> đầu tiên (中級). Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn học đáng tin.</p>
<h3>📘 Giáo trình lõi</h3>
<ul>
<li><strong>みんなの日本語 中級 II</strong> (Minna no Nihongo Chukyu II) — giáo trình bắc cầu chuẩn đưa bạn từ N3 lên N2; mỗi bài gắn một bài đọc với đúng các mẫu dạy ở đây.</li>
<li><strong>とびら (Tobira)</strong> — giáo trình trung cấp giàu nội dung, các chương bao trùm chính các liên từ, cách diễn đạt tình thái và mẫu trang trọng này.</li>
</ul>
<h3>🌐 Từ điển &amp; ngữ pháp</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — từ điển Nhật-Anh miễn phí tốt nhất; nó gắn nhãn trình độ JLPT và chỉ mọi thể thường.</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — luyện ngữ pháp theo trình độ JLPT; luyện lần lượt mọi mẫu N3 &amp; N2 đầu bên dưới.</li>
</ul>
<h3>🃏 App luyện</h3>
<ul>
<li><strong>Anki</strong> — thẻ ghi nhớ lặp lại ngắt quãng; nên tạo bộ cho từ vựng N3-N2 và cho các cặp mẫu dễ nhầm (おかげで và せいで, 次第 và たとたん, ものだ và ことだ).</li>
<li><strong>Migii JLPT</strong> — đề thi thử N3 &amp; N2 và từ vựng theo trình độ, phổ biến ở Việt Nam.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình học 4 bước</span>
<ol>
<li><strong>Ôn JPD326</strong> — bốn thể điều kiện, kính ngữ và các thể 〜て mở rộng phải thành phản xạ; các mẫu ở đây dựng thẳng lên chúng.</li>
<li><strong>Học mỗi mẫu theo cặp</strong> — ngữ pháp trung cấp phần lớn là phân biệt các mẫu gần nghĩa (おかげで và せいで, くせに và のに, に違いない và に決まっている). Học sự khác biệt, đừng học riêng lẻ.</li>
<li><strong>Đọc và nói</strong> — các mẫu xuất hiện liên tục trong bài đọc và hội thoại trung cấp; lấy hội thoại mỗi bài làm mẫu.</li>
<li><strong>Sẵn sàng thi</strong> — luyện từ vựng &amp; ngữ pháp bằng Anki, làm đề N3-N2 thử trên Migii.</li>
</ol></div>`,
  ]]);

const intro = doc('jpd336-0-1-overview', 'Course overview: Intermediate Japanese 2-B2.2|||Tổng quan: Tiếng Nhật trung cấp 2-B2.2',
  'Nối tiếp JPD326; mục tiêu N3 cuối - N2 đầu; trọng tâm các liên từ nêu đề tài, quan hệ nhân quả, tương phản, trạng thái để nguyên, thời điểm, phủ định bộ phận, lời khuyên và mức độ chắc chắn; lộ trình 8 bài.',
  [[
    `<span class="eyebrow">JPD336 · Lesson 0.1 · Overview</span>
<h2>Intermediate Japanese 2-B2.2</h2>
<p class="lead">This course continues <strong>JPD326 (Intermediate Japanese 2, B2.1)</strong> and moves from solid <strong>JLPT N3</strong> into the first <strong>N2</strong> grammar (中級). As before, intermediate Japanese is about <strong>choosing between near-synonyms</strong> — patterns that translate the same way in English but differ in nuance, register and grammar.</p>
<h3>What is new here</h3>
<p>You gain richer connectives and modality: <strong>〜について / 〜に関して / 〜をめぐって</strong> raise a topic, <strong>〜おかげで / 〜せいで</strong> mark a good vs a bad cause, <strong>〜くせに / 〜のに</strong> express contrast (with or without blame), <strong>〜っぱなし / 〜まま</strong> describe leaving something as it is, <strong>〜次第 / 〜たとたん</strong> mark "as soon as" (planned vs sudden), <strong>〜わけではない / 〜わけにはいかない</strong> give partial negation and social impossibility, <strong>〜ものだ / 〜ことだ</strong> give general truths and direct advice, and <strong>〜に違いない / 〜に決まっている</strong> express strong certainty.</p>
<h3>Study tip for N3-N2</h3>
<ul>
<li><strong>Learn in contrast</strong> — おかげで (good result) vs せいで (bad result); 次第 (planned, formal, future) vs たとたん (sudden, past).</li>
<li><strong>Watch the register</strong> — に関して and 次第 are formal/written; くせに and に決まっている are casual and carry attitude.</li>
<li><strong>Keep JPD326 warm</strong> — the conditionals and keigo return in these examples and dialogues.</li>
</ul>
<h3>Roadmap (8 lessons)</h3>
<p>Raising a topic → good vs bad cause → contrast &amp; blame → leaving as is → as soon as → partial negation &amp; cannot → general truth &amp; advice → strong certainty.</p>`,
    `<span class="eyebrow">JPD336 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Nhật trung cấp 2-B2.2</h2>
<p class="lead">Môn này nối tiếp <strong>JPD326 (Tiếng Nhật trung cấp 2, B2.1)</strong> và bước từ <strong>JLPT N3</strong> vững vàng sang ngữ pháp <strong>N2</strong> đầu tiên (中級). Như trước, tiếng Nhật trung cấp là chuyện <strong>chọn giữa các mẫu gần nghĩa</strong> — những mẫu dịch ra tiếng Việt giống nhau nhưng khác về sắc thái, văn phong và ngữ pháp.</p>
<h3>Điểm mới ở đây</h3>
<p>Bạn có thêm liên từ và cách diễn đạt phong phú: <strong>〜について / 〜に関して / 〜をめぐって</strong> nêu đề tài, <strong>〜おかげで / 〜せいで</strong> đánh dấu nguyên nhân tốt và xấu, <strong>〜くせに / 〜のに</strong> diễn đạt tương phản (có hoặc không kèm trách móc), <strong>〜っぱなし / 〜まま</strong> tả việc để nguyên trạng thái, <strong>〜次第 / 〜たとたん</strong> đánh dấu "ngay khi" (có kế hoạch và bất ngờ), <strong>〜わけではない / 〜わけにはいかない</strong> nêu phủ định bộ phận và sự bất khả về mặt xã hội, <strong>〜ものだ / 〜ことだ</strong> nêu chân lý chung và lời khuyên trực tiếp, và <strong>〜に違いない / 〜に決まっている</strong> diễn đạt sự chắc chắn cao.</p>
<h3>Mẹo học N3-N2</h3>
<ul>
<li><strong>Học theo cặp đối chiếu</strong> — おかげで (kết quả tốt) và せいで (kết quả xấu); 次第 (có kế hoạch, trang trọng, tương lai) và たとたん (bất ngờ, quá khứ).</li>
<li><strong>Để ý văn phong</strong> — に関して và 次第 trang trọng/văn viết; くせに và に決まっている là khẩu ngữ và mang thái độ.</li>
<li><strong>Giữ JPD326 còn nóng</strong> — các thể điều kiện và kính ngữ quay lại trong ví dụ và hội thoại ở đây.</li>
</ul>
<h3>Lộ trình (8 bài)</h3>
<p>Nêu đề tài → nguyên nhân tốt &amp; xấu → tương phản &amp; trách móc → để nguyên trạng → ngay khi → phủ định bộ phận &amp; không thể → chân lý &amp; lời khuyên → chắc chắn cao.</p>`,
  ]]);

const b1 = doc('jpd336-1-1-raising-a-topic', 'Lesson 1 — Raising a topic|||Bài 1 — Nêu đề tài: về, liên quan đến',
  '〜について (về, liên quan đến — trung tính); 〜に関して/に関する (liên quan đến — trang trọng); 〜をめぐって/をめぐる (xoay quanh — vấn đề tranh cãi).',
  [[
    `<span class="eyebrow">JPD336 · Lesson 1</span>
<h2>Raising a topic: about, concerning</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>研究します</td><td>kenkyū shimasu</td><td>to research</td></tr>
<tr><td>議論します</td><td>giron shimasu</td><td>to argue / discuss</td></tr>
<tr><td>環境</td><td>kankyō</td><td>environment</td></tr>
<tr><td>法律</td><td>hōritsu</td><td>law</td></tr>
<tr><td>意見</td><td>iken</td><td>opinion</td></tr>
</table>
<h3>Grammar — 〜について (about, concerning; neutral)</h3>
<p><strong>[noun] + について</strong> = "about, concerning". The everyday, neutral way to name a topic. The modifier form is <strong>[noun] + についての + [noun]</strong>.</p>
<ul>
<li>日本の 文化に ついて 研究しています。 (Nihon no bunka ni tsuite kenkyū shite imasu.) — I am researching Japanese culture.</li>
<li>この 問題に ついての レポートを 書きました。 (Kono mondai ni tsuite no repōto o kakimashita.) — I wrote a report about this problem.</li>
</ul>
<h3>Grammar — 〜に関して / 〜に関する (concerning; formal)</h3>
<p><strong>[noun] + に関して</strong> is a more formal, written equivalent of について. The modifier form is <strong>[noun] + に関する + [noun]</strong>.</p>
<ul>
<li>環境問題に 関して 議論しました。 (Kankyō mondai ni kanshite giron shimashita.) — We discussed matters concerning the environment.</li>
<li>法律に 関する 質問は ありますか。 (Hōritsu ni kansuru shitsumon wa arimasu ka.) — Do you have any questions concerning the law?</li>
</ul>
<h3>Grammar — 〜をめぐって / 〜をめぐる (surrounding a disputed matter)</h3>
<p><strong>[noun] + をめぐって</strong> = "surrounding, over" — used when opinions or a dispute revolve around an issue. The modifier form is <strong>[noun] + をめぐる + [noun]</strong>.</p>
<ul>
<li>新しい 法律を めぐって、意見が 分かれています。 (Atarashii hōritsu o megutte, iken ga wakarete imasu.) — Opinions are divided over the new law.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 今日の ゼミの テーマは 何ですか。
   Kyō no zemi no tēma wa nan desu ka.
B: 地球温暖化に ついて 議論します。
   Chikyū ondanka ni tsuite giron shimasu.
</code></pre>
<div class="callout"><span class="badge">Note</span> について is the neutral everyday choice; に関して is its formal, written twin (modifier 〜に関する); をめぐって suggests a matter that people argue or take sides over (modifier 〜をめぐる).</div>`,
    `<span class="eyebrow">JPD336 · Bài 1</span>
<h2>Nêu đề tài: về, liên quan đến</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>研究します</td><td>kenkyū shimasu</td><td>nghiên cứu</td></tr>
<tr><td>議論します</td><td>giron shimasu</td><td>tranh luận, thảo luận</td></tr>
<tr><td>環境</td><td>kankyō</td><td>môi trường</td></tr>
<tr><td>法律</td><td>hōritsu</td><td>luật, pháp luật</td></tr>
<tr><td>意見</td><td>iken</td><td>ý kiến</td></tr>
</table>
<h3>Ngữ pháp — 〜について (về, liên quan đến; trung tính)</h3>
<p><strong>[danh từ] + について</strong> = "về, liên quan đến". Cách trung tính, thường ngày để nêu đề tài. Dạng bổ nghĩa là <strong>[danh từ] + についての + [danh từ]</strong>.</p>
<ul>
<li>日本の 文化に ついて 研究しています。 (Nihon no bunka ni tsuite kenkyū shite imasu.) — Tôi đang nghiên cứu về văn hóa Nhật Bản.</li>
<li>この 問題に ついての レポートを 書きました。 (Kono mondai ni tsuite no repōto o kakimashita.) — Tôi đã viết một báo cáo về vấn đề này.</li>
</ul>
<h3>Ngữ pháp — 〜に関して / 〜に関する (liên quan đến; trang trọng)</h3>
<p><strong>[danh từ] + に関して</strong> là dạng trang trọng, văn viết của について. Dạng bổ nghĩa là <strong>[danh từ] + に関する + [danh từ]</strong>.</p>
<ul>
<li>環境問題に 関して 議論しました。 (Kankyō mondai ni kanshite giron shimashita.) — Chúng tôi đã thảo luận về những vấn đề liên quan đến môi trường.</li>
<li>法律に 関する 質問は ありますか。 (Hōritsu ni kansuru shitsumon wa arimasu ka.) — Bạn có câu hỏi nào liên quan đến pháp luật không?</li>
</ul>
<h3>Ngữ pháp — 〜をめぐって / 〜をめぐる (xoay quanh một vấn đề tranh cãi)</h3>
<p><strong>[danh từ] + をめぐって</strong> = "xoay quanh, xung quanh" — dùng khi các ý kiến hay tranh cãi xoay quanh một vấn đề. Dạng bổ nghĩa là <strong>[danh từ] + をめぐる + [danh từ]</strong>.</p>
<ul>
<li>新しい 法律を めぐって、意見が 分かれています。 (Atarashii hōritsu o megutte, iken ga wakarete imasu.) — Xung quanh luật mới, các ý kiến đang chia rẽ.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 今日の ゼミの テーマは 何ですか。
   Kyō no zemi no tēma wa nan desu ka.
B: 地球温暖化に ついて 議論します。
   Chikyū ondanka ni tsuite giron shimasu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> について là lựa chọn trung tính thường ngày; に関して là bản trang trọng, văn viết của nó (bổ nghĩa 〜に関する); をめぐって gợi một vấn đề mà người ta tranh cãi hoặc chia phe (bổ nghĩa 〜をめぐる).</div>`,
  ]]);

const b1q = quiz('jpd336-quiz-1', 'Quiz 1 — Raising a topic|||Quiz 1 — Nêu đề tài', [
  { id: 'q1', question: 'Cách TRUNG TÍNH, thường ngày để nêu đề tài "về ~" là mẫu nào?|||Which is the neutral, everyday way to raise a topic ("about ~")?', options: ['〜について', '〜をめぐって', '〜に関する', '〜のせいで'], correctIndex: 0, explanation: '〜について là cách trung tính, thường ngày; に関して mới là bản trang trọng văn viết.' },
  { id: 'q2', question: 'Mẫu nào hàm ý một vấn đề mà người ta TRANH CÃI, chia phe?|||Which pattern implies a disputed matter people take sides over?', options: ['〜について', '〜に関して', '〜をめぐって', '〜に対して'], correctIndex: 2, explanation: '〜をめぐって: ý kiến/tranh cãi xoay quanh một vấn đề, ví dụ 法律をめぐって 意見が 分かれる.' },
  { id: 'q3', question: 'Dạng bổ nghĩa danh từ của 〜に関して là gì?|||What is the noun-modifying form of 〜に関して?', options: ['に関しての', 'に関する', 'に関しで', 'に関れば'], correctIndex: 1, explanation: 'に関して → bổ nghĩa danh từ dùng に関する: 法律に関する質問.' },
]);

const b2 = doc('jpd336-2-1-good-bad-cause', 'Lesson 2 — Good vs bad cause|||Bài 2 — Nhờ & tại: おかげで, せいで',
  '〜おかげで (nhờ ~ mà — kết quả tốt); 〜せいで (tại ~ mà — kết quả xấu); 〜せいか (có lẽ tại ~).',
  [[
    `<span class="eyebrow">JPD336 · Lesson 2</span>
<h2>Good vs bad cause: おかげで &amp; せいで</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>合格します</td><td>gōkaku shimasu</td><td>to pass (an exam)</td></tr>
<tr><td>事故</td><td>jiko</td><td>accident</td></tr>
<tr><td>遅刻します</td><td>chikoku shimasu</td><td>to be late</td></tr>
<tr><td>成功します</td><td>seikō shimasu</td><td>to succeed</td></tr>
<tr><td>失敗します</td><td>shippai shimasu</td><td>to fail</td></tr>
</table>
<h3>Grammar — 〜おかげで (thanks to; good result)</h3>
<p><strong>[noun の / plain form] + おかげで</strong> = "thanks to", crediting a cause for a good outcome (な-adjective な, noun の).</p>
<ul>
<li>先生の おかげで、試験に 合格しました。 (Sensei no okage de, shiken ni gōkaku shimashita.) — Thanks to my teacher, I passed the exam.</li>
<li>薬を 飲んだ おかげで、早く 治りました。 (Kusuri o nonda okage de, hayaku naorimashita.) — Thanks to taking the medicine, I recovered quickly.</li>
</ul>
<h3>Grammar — 〜せいで / 〜せいか (because of; bad result)</h3>
<p><strong>[noun の / plain form] + せいで</strong> = "because of, owing to", blaming a cause for a bad outcome. <strong>〜せいか</strong> softens it to "perhaps because".</p>
<ul>
<li>台風の せいで、電車が 止まりました。 (Taifū no sei de, densha ga tomarimashita.) — Because of the typhoon, the trains stopped.</li>
<li>寝不足の せいか、頭が 痛いです。 (Nebusoku no sei ka, atama ga itai desu.) — Perhaps because of lack of sleep, I have a headache.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 合格 おめでとう！
   Gōkaku omedetō!
B: ありがとう。先生の おかげです。
   Arigatō. Sensei no okage desu.
</code></pre>
<div class="callout"><span class="badge">Note</span> おかげで credits a GOOD result (thanks to); せいで blames a BAD result (because of). Both take noun の or a plain form; use せいか when you are not fully sure of the cause.</div>`,
    `<span class="eyebrow">JPD336 · Bài 2</span>
<h2>Nhờ &amp; tại: おかげで &amp; せいで</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>合格します</td><td>gōkaku shimasu</td><td>đỗ, đậu (kỳ thi)</td></tr>
<tr><td>事故</td><td>jiko</td><td>tai nạn</td></tr>
<tr><td>遅刻します</td><td>chikoku shimasu</td><td>đến muộn</td></tr>
<tr><td>成功します</td><td>seikō shimasu</td><td>thành công</td></tr>
<tr><td>失敗します</td><td>shippai shimasu</td><td>thất bại</td></tr>
</table>
<h3>Ngữ pháp — 〜おかげで (nhờ ~ mà; kết quả tốt)</h3>
<p><strong>[danh từ の / thể thường] + おかげで</strong> = "nhờ ~ mà", quy công cho một nguyên nhân dẫn tới kết quả tốt (tính từ な thêm な, danh từ thêm の).</p>
<ul>
<li>先生の おかげで、試験に 合格しました。 (Sensei no okage de, shiken ni gōkaku shimashita.) — Nhờ thầy mà tôi đã đỗ kỳ thi.</li>
<li>薬を 飲んだ おかげで、早く 治りました。 (Kusuri o nonda okage de, hayaku naorimashita.) — Nhờ uống thuốc mà tôi khỏi nhanh.</li>
</ul>
<h3>Ngữ pháp — 〜せいで / 〜せいか (tại ~ mà; kết quả xấu)</h3>
<p><strong>[danh từ の / thể thường] + せいで</strong> = "tại, do", đổ lỗi cho một nguyên nhân dẫn tới kết quả xấu. <strong>〜せいか</strong> làm nhẹ lại thành "có lẽ tại".</p>
<ul>
<li>台風の せいで、電車が 止まりました。 (Taifū no sei de, densha ga tomarimashita.) — Tại cơn bão mà tàu điện đã dừng.</li>
<li>寝不足の せいか、頭が 痛いです。 (Nebusoku no sei ka, atama ga itai desu.) — Có lẽ tại thiếu ngủ nên tôi bị đau đầu.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 合格 おめでとう！
   Gōkaku omedetō!
B: ありがとう。先生の おかげです。
   Arigatō. Sensei no okage desu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> おかげで quy công cho kết quả TỐT (nhờ ~); せいで đổ lỗi cho kết quả XẤU (tại ~). Cả hai đi với danh từ の hoặc thể thường; dùng せいか khi bạn chưa chắc chắn hẳn về nguyên nhân.</div>`,
  ]]);

const b2q = quiz('jpd336-quiz-2', 'Quiz 2 — Good vs bad cause|||Quiz 2 — Nhờ & tại', [
  { id: 'q1', question: '"NHỜ thầy mà tôi đã đỗ" (kết quả tốt) dùng mẫu nào?|||"Thanks to my teacher, I passed" (good result) uses which pattern?', options: ['先生の おかげで', '先生の せいで', '先生の せいか', '先生に よって'], correctIndex: 0, explanation: 'おかげで quy công cho kết quả TỐT: 先生の おかげで 合格しました.' },
  { id: 'q2', question: '"TẠI cơn bão mà tàu dừng" (kết quả xấu) dùng mẫu nào?|||"Because of the typhoon, the trains stopped" (bad result) uses which pattern?', options: ['台風の おかげで', '台風の せいで', '台風の ように', '台風の ために'], correctIndex: 1, explanation: 'せいで đổ lỗi cho kết quả XẤU: 台風の せいで 電車が 止まった.' },
  { id: 'q3', question: 'Khi CHƯA CHẮC về nguyên nhân xấu ("có lẽ tại ~") thì dùng dạng nào?|||When unsure of the bad cause ("perhaps because ~"), which form?', options: ['〜おかげで', '〜せいで', '〜せいか', '〜おかげか'], correctIndex: 2, explanation: '〜せいか = "có lẽ tại ~", làm nhẹ せいで khi chưa chắc nguyên nhân.' },
]);

const b3 = doc('jpd336-3-1-contrast-blame', 'Lesson 3 — Contrast & blame|||Bài 3 — Dù ~ lại: くせに, のに',
  '〜のに (mặc dù ~ nhưng — bất ngờ, trung tính); 〜くせに (dù ~ vậy mà — kèm chê trách, chủ ngữ là người).',
  [[
    `<span class="eyebrow">JPD336 · Lesson 3</span>
<h2>Contrast &amp; blame: くせに &amp; のに</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>金持ち</td><td>kanemochi</td><td>rich person</td></tr>
<tr><td>けち</td><td>kechi</td><td>stingy</td></tr>
<tr><td>約束</td><td>yakusoku</td><td>promise</td></tr>
<tr><td>文句</td><td>monku</td><td>complaint</td></tr>
<tr><td>下手</td><td>heta</td><td>unskilful / bad at</td></tr>
</table>
<h3>Grammar — 〜のに (although; unexpected, neutral)</h3>
<p><strong>[plain form] + のに</strong> = "although, even though", marking a result that runs against expectation (な-adjective な, noun な). It is neutral and can describe anything.</p>
<ul>
<li>一生懸命 勉強したのに、試験に 落ちました。 (Isshōkenmei benkyō shita noni, shiken ni ochimashita.) — Even though I studied hard, I failed the exam.</li>
<li>日曜日なのに、働かなければ なりません。 (Nichiyōbi na noni, hatarakanakereba narimasen.) — Even though it is Sunday, I have to work.</li>
</ul>
<h3>Grammar — 〜くせに (although; with blame)</h3>
<p><strong>[plain form] + くせに</strong> also means "although", but adds <strong>criticism or contempt</strong>. The subject is normally a person, and it is usually the same person in both clauses (な-adjective な, noun の).</p>
<ul>
<li>知っている くせに、教えて くれません。 (Shitte iru kuse ni, oshiete kuremasen.) — He clearly knows, yet he will not tell me.</li>
<li>下手な くせに、いつも 文句を 言う。 (Heta na kuse ni, itsumo monku o iu.) — He is bad at it, yet he always complains.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 彼、また 遅刻したの？
   Kare, mata chikoku shita no?
B: うん。自分で 約束した くせに。
   Un. Jibun de yakusoku shita kuse ni.
</code></pre>
<div class="callout"><span class="badge">Note</span> のに is neutral "although" and takes any subject; くせに is "although" plus blame or contempt, with a person as subject and usually the same subject in both halves. Do not use くせに about yourself in a neutral way.</div>`,
    `<span class="eyebrow">JPD336 · Bài 3</span>
<h2>Dù ~ lại: くせに &amp; のに</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>金持ち</td><td>kanemochi</td><td>người giàu</td></tr>
<tr><td>けち</td><td>kechi</td><td>keo kiệt</td></tr>
<tr><td>約束</td><td>yakusoku</td><td>lời hứa</td></tr>
<tr><td>文句</td><td>monku</td><td>lời phàn nàn</td></tr>
<tr><td>下手</td><td>heta</td><td>kém, dở</td></tr>
</table>
<h3>Ngữ pháp — 〜のに (mặc dù ~ nhưng; trung tính)</h3>
<p><strong>[thể thường] + のに</strong> = "mặc dù ~ nhưng", đánh dấu kết quả trái với mong đợi (tính từ な thêm な, danh từ thêm な). Trung tính, tả được mọi thứ.</p>
<ul>
<li>一生懸命 勉強したのに、試験に 落ちました。 (Isshōkenmei benkyō shita noni, shiken ni ochimashita.) — Mặc dù đã học chăm chỉ, tôi vẫn trượt kỳ thi.</li>
<li>日曜日なのに、働かなければ なりません。 (Nichiyōbi na noni, hatarakanakereba narimasen.) — Dù là chủ nhật mà tôi vẫn phải làm việc.</li>
</ul>
<h3>Ngữ pháp — 〜くせに (dù ~ vậy mà; kèm chê trách)</h3>
<p><strong>[thể thường] + くせに</strong> cũng nghĩa "mặc dù", nhưng thêm <strong>sự chê trách hay coi thường</strong>. Chủ ngữ thường là người, và thường cùng một người ở cả hai vế (tính từ な thêm な, danh từ thêm の).</p>
<ul>
<li>知っている くせに、教えて くれません。 (Shitte iru kuse ni, oshiete kuremasen.) — Rõ ràng biết mà lại không chịu chỉ cho tôi.</li>
<li>下手な くせに、いつも 文句を 言う。 (Heta na kuse ni, itsumo monku o iu.) — Dở vậy mà lúc nào cũng phàn nàn.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 彼、また 遅刻したの？
   Kare, mata chikoku shita no?
B: うん。自分で 約束した くせに。
   Un. Jibun de yakusoku shita kuse ni.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> のに là "mặc dù" trung tính, dùng với mọi chủ ngữ; くせに là "mặc dù" kèm chê trách hay coi thường, chủ ngữ là người và thường cùng một người ở hai vế. Đừng dùng くせに để nói về bản thân một cách trung tính.</div>`,
  ]]);

const b3q = quiz('jpd336-quiz-3', 'Quiz 3 — Contrast & blame|||Quiz 3 — Dù ~ lại', [
  { id: 'q1', question: 'Mẫu nào là "mặc dù ~ nhưng" TRUNG TÍNH, dùng được với mọi chủ ngữ?|||Which is the neutral "although", usable with any subject?', options: ['〜くせに', '〜のに', '〜せいで', '〜おかげで'], correctIndex: 1, explanation: '〜のに trung tính; くせに luôn kèm chê trách và chủ ngữ là người.' },
  { id: 'q2', question: 'Mẫu nào kèm SẮC THÁI CHÊ TRÁCH / coi thường, chủ ngữ thường là người?|||Which adds blame or contempt, with a person as subject?', options: ['〜のに', '〜くせに', '〜ながら', '〜ものの'], correctIndex: 1, explanation: '〜くせに = "mặc dù" + chê trách: 下手な くせに 文句を 言う.' },
  { id: 'q3', question: 'Danh từ đứng trước くせに thì gắn thế nào? (ví dụ với 子供)|||How does a noun attach before くせに? (e.g. 子供)', options: ['子供だくせに', '子供のくせに', '子供なくせに', '子供くせに'], correctIndex: 1, explanation: 'Danh từ + の + くせに: 子供の くせに. (Tính từ な thì dùng な: 下手な くせに.)' },
]);

const b4 = doc('jpd336-4-1-leaving-as-is', 'Lesson 4 — Leaving as is|||Bài 4 — Để nguyên: っぱなし, まま',
  '〜っぱなし (để nguyên, bỏ mặc không xử lý — chê); 〜まま (giữ nguyên trạng thái không đổi — trung tính).',
  [[
    `<span class="eyebrow">JPD336 · Lesson 4</span>
<h2>Leaving as is: っぱなし &amp; まま</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>電気</td><td>denki</td><td>electricity / light</td></tr>
<tr><td>窓</td><td>mado</td><td>window</td></tr>
<tr><td>靴</td><td>kutsu</td><td>shoes</td></tr>
<tr><td>つけます</td><td>tsukemasu</td><td>to turn on</td></tr>
<tr><td>そのまま</td><td>sono mama</td><td>as it is / unchanged</td></tr>
</table>
<h3>Grammar — 〜っぱなし (left on / undone, with reproach)</h3>
<p><strong>[ます-stem] + っぱなし</strong> = leaving something in a state, usually because you forgot or neglected to deal with it — so it often carries reproach.</p>
<ul>
<li>電気を つけっぱなしで 寝て しまいました。 (Denki o tsukeppanashi de nete shimaimashita.) — I fell asleep with the light left on.</li>
<li>水を 出しっぱなしに しないで ください。 (Mizu o dashippanashi ni shinaide kudasai.) — Please do not leave the water running.</li>
</ul>
<h3>Grammar — 〜まま (in the unchanged state of)</h3>
<p><strong>[た-form / ない-form / noun の / な-adjective な] + まま</strong> = "in the state of, still", describing a state that stays unchanged while something else happens. It is neutral.</p>
<ul>
<li>窓を 開けた まま、出かけました。 (Mado o aketa mama, dekakemashita.) — I went out with the window left open.</li>
<li>靴を 履いた まま、家に 入らないで ください。 (Kutsu o haita mama, ie ni hairanaide kudasai.) — Please do not enter the house with your shoes on.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: あれ、エアコンが ついているよ。
   Are, eakon ga tsuite iru yo.
B: ごめん、つけっぱなしだった。
   Gomen, tsukeppanashi datta.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜っぱなし attaches to the ます-stem and usually blames negligence (left it on, left it undone). 〜まま is neutral "in the unchanged state of" and takes た / ない / noun の / な-adjective な. 窓を 開けたまま = simply describing; 開けっぱなし = with a hint of "should have closed it".</div>`,
    `<span class="eyebrow">JPD336 · Bài 4</span>
<h2>Để nguyên: っぱなし &amp; まま</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>電気</td><td>denki</td><td>điện, đèn</td></tr>
<tr><td>窓</td><td>mado</td><td>cửa sổ</td></tr>
<tr><td>靴</td><td>kutsu</td><td>giày</td></tr>
<tr><td>つけます</td><td>tsukemasu</td><td>bật (lên)</td></tr>
<tr><td>そのまま</td><td>sono mama</td><td>cứ để nguyên vậy</td></tr>
</table>
<h3>Ngữ pháp — 〜っぱなし (để nguyên, bỏ mặc — kèm chê)</h3>
<p><strong>[đuôi ます] + っぱなし</strong> = để nguyên một trạng thái, thường vì quên hay bỏ mặc không xử lý — nên hay mang sắc thái chê trách.</p>
<ul>
<li>電気を つけっぱなしで 寝て しまいました。 (Denki o tsukeppanashi de nete shimaimashita.) — Tôi để đèn bật nguyên rồi ngủ mất.</li>
<li>水を 出しっぱなしに しないで ください。 (Mizu o dashippanashi ni shinaide kudasai.) — Xin đừng để nước chảy nguyên như vậy.</li>
</ul>
<h3>Ngữ pháp — 〜まま (giữ nguyên trạng thái)</h3>
<p><strong>[thể た / thể ない / danh từ の / tính từ な thêm な] + まま</strong> = "giữ nguyên, vẫn để ~", tả một trạng thái không đổi trong khi việc khác diễn ra. Trung tính.</p>
<ul>
<li>窓を 開けた まま、出かけました。 (Mado o aketa mama, dekakemashita.) — Tôi cứ để cửa sổ mở nguyên rồi ra ngoài.</li>
<li>靴を 履いた まま、家に 入らないで ください。 (Kutsu o haita mama, ie ni hairanaide kudasai.) — Xin đừng đi cả giày vào nhà.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: あれ、エアコンが ついているよ。
   Are, eakon ga tsuite iru yo.
B: ごめん、つけっぱなしだった。
   Gomen, tsukeppanashi datta.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜っぱなし gắn vào đuôi ます và thường chê sự cẩu thả (để nguyên, bỏ dở). 〜まま trung tính, nghĩa "giữ nguyên trạng", đi với た / ない / danh từ の / tính từ な thêm な. 窓を 開けたまま = chỉ mô tả; 開けっぱなし = kèm ý "lẽ ra phải đóng".</div>`,
  ]]);

const b4q = quiz('jpd336-quiz-4', 'Quiz 4 — Leaving as is|||Quiz 4 — Để nguyên', [
  { id: 'q1', question: 'Mẫu nào thường KÈM CHÊ sự cẩu thả (để bật, bỏ dở không xử lý)?|||Which pattern usually blames negligence (left on, left undone)?', options: ['〜まま', '〜っぱなし', '〜ながら', '〜きり'], correctIndex: 1, explanation: '〜っぱなし: để nguyên vì quên/bỏ mặc, hàm ý chê: つけっぱなし.' },
  { id: 'q2', question: '〜っぱなし gắn vào phần nào của động từ?|||〜っぱなし attaches to which part of the verb?', options: ['đuôi ます (ます-stem)|||the ます-stem', 'thể từ điển|||the dictionary form', 'thể た|||the た-form', 'thể ない|||the ない-form'], correctIndex: 0, explanation: 'Gắn vào đuôi ます: 出す → 出しっぱなし, つける → つけっぱなし.' },
  { id: 'q3', question: '"Đi cả giày (giữ nguyên) vào nhà" dùng mẫu trung tính nào?|||"Enter the house with shoes on (unchanged)" uses which neutral pattern?', options: ['履いたまま', '履きっぱなし', '履くまま', '履いたくせに'], correctIndex: 0, explanation: '〜まま trung tính, đi với thể た: 靴を 履いた まま 入る.' },
]);

const b5 = doc('jpd336-5-1-as-soon-as', 'Lesson 5 — As soon as|||Bài 5 — Ngay khi: 次第, たとたん',
  '〜次第 (ngay khi ~ thì sẽ — có kế hoạch, trang trọng, vế sau tương lai); 〜たとたん(に) (ngay lúc ~ thì — bất ngờ, quá khứ).',
  [[
    `<span class="eyebrow">JPD336 · Lesson 5</span>
<h2>As soon as: 次第 &amp; たとたん</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>連絡します</td><td>renraku shimasu</td><td>to contact / get in touch</td></tr>
<tr><td>到着します</td><td>tōchaku shimasu</td><td>to arrive</td></tr>
<tr><td>完成します</td><td>kansei shimasu</td><td>to be completed</td></tr>
<tr><td>急に</td><td>kyū ni</td><td>suddenly</td></tr>
<tr><td>飛び出します</td><td>tobidashimasu</td><td>to jump / rush out</td></tr>
</table>
<h3>Grammar — 〜次第 (as soon as; planned, formal)</h3>
<p><strong>[ます-stem] + 次第</strong> = "as soon as", for a future, planned action. It is formal, and the second clause must be will, request or intention — never a past event.</p>
<ul>
<li>会議が 終わり次第、電話します。 (Kaigi ga owari shidai, denwa shimasu.) — I will call as soon as the meeting is over.</li>
<li>東京に 着き次第、ご連絡いたします。 (Tōkyō ni tsuki shidai, gorenraku itashimasu.) — I will contact you as soon as I arrive in Tokyo.</li>
</ul>
<h3>Grammar — 〜たとたん(に) (the moment that; sudden, past)</h3>
<p><strong>[た-form] + とたん(に)</strong> = "the moment, just as", for something that happened suddenly and unexpectedly. The second clause is a past, uncontrollable event.</p>
<ul>
<li>ドアを 開けたとたん、猫が 飛び出した。 (Doa o aketa totan, neko ga tobidashita.) — The moment I opened the door, the cat rushed out.</li>
<li>立ったとたんに、めまいが した。 (Tatta totan ni, memai ga shita.) — The moment I stood up, I felt dizzy.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 資料は いつ 送って もらえますか。
   Shiryō wa itsu okutte moraemasu ka.
B: 完成し次第、お送りします。
   Kansei shi shidai, ookuri shimasu.
</code></pre>
<div class="callout"><span class="badge">Note</span> 次第 is for a PLANNED, future action and is formal (連絡します, お送りします follow); the second clause cannot be a past event. たとたん is for a SUDDEN, unexpected past event you did not control. Both mean "as soon as", but the time direction and control are opposite.</div>`,
    `<span class="eyebrow">JPD336 · Bài 5</span>
<h2>Ngay khi: 次第 &amp; たとたん</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>連絡します</td><td>renraku shimasu</td><td>liên lạc</td></tr>
<tr><td>到着します</td><td>tōchaku shimasu</td><td>đến nơi</td></tr>
<tr><td>完成します</td><td>kansei shimasu</td><td>hoàn thành</td></tr>
<tr><td>急に</td><td>kyū ni</td><td>đột nhiên</td></tr>
<tr><td>飛び出します</td><td>tobidashimasu</td><td>lao ra, nhảy ra</td></tr>
</table>
<h3>Ngữ pháp — 〜次第 (ngay khi ~ thì sẽ; có kế hoạch, trang trọng)</h3>
<p><strong>[đuôi ます] + 次第</strong> = "ngay khi ~ thì sẽ", cho một hành động tương lai đã tính trước. Trang trọng, và vế sau phải là ý chí, lời nhờ hay dự định — không được là việc đã qua.</p>
<ul>
<li>会議が 終わり次第、電話します。 (Kaigi ga owari shidai, denwa shimasu.) — Ngay khi cuộc họp kết thúc, tôi sẽ gọi điện.</li>
<li>東京に 着き次第、ご連絡いたします。 (Tōkyō ni tsuki shidai, gorenraku itashimasu.) — Ngay khi đến Tokyo, tôi sẽ liên lạc với anh/chị.</li>
</ul>
<h3>Ngữ pháp — 〜たとたん(に) (ngay lúc ~ thì; bất ngờ, quá khứ)</h3>
<p><strong>[thể た] + とたん(に)</strong> = "ngay lúc, vừa mới", cho việc xảy ra đột ngột và bất ngờ. Vế sau là việc đã qua, không điều khiển được.</p>
<ul>
<li>ドアを 開けたとたん、猫が 飛び出した。 (Doa o aketa totan, neko ga tobidashita.) — Ngay khi tôi mở cửa thì con mèo lao ra.</li>
<li>立ったとたんに、めまいが した。 (Tatta totan ni, memai ga shita.) — Vừa đứng dậy thì tôi thấy chóng mặt.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 資料は いつ 送って もらえますか。
   Shiryō wa itsu okutte moraemasu ka.
B: 完成し次第、お送りします。
   Kansei shi shidai, ookuri shimasu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 次第 dành cho hành động TƯƠNG LAI đã tính trước và trang trọng (vế sau là 電話します, お送りします); vế sau không được là việc đã qua. たとたん dành cho việc quá khứ BẤT NGỜ, không điều khiển được. Cả hai đều nghĩa "ngay khi", nhưng hướng thời gian và tính điều khiển thì ngược nhau.</div>`,
  ]]);

const b5q = quiz('jpd336-quiz-5', 'Quiz 5 — As soon as|||Quiz 5 — Ngay khi', [
  { id: 'q1', question: '"Ngay khi họp xong, tôi SẼ gọi điện" (kế hoạch, trang trọng) dùng mẫu nào?|||"I will call as soon as the meeting ends" (planned, formal) uses which pattern?', options: ['終わり次第、電話します', '終わったとたん、電話した', '終わるくせに、電話します', '終わったまま、電話します'], correctIndex: 0, explanation: '〜次第 (đuôi ます) cho hành động tương lai đã tính trước; vế sau là ý chí: 終わり次第 電話します.' },
  { id: 'q2', question: '"Ngay khi mở cửa thì con mèo lao ra" (bất ngờ, đã xảy ra) dùng mẫu nào?|||"The moment I opened the door, the cat rushed out" (sudden, past) uses which?', options: ['開け次第', '開けたとたん', '開けるくせに', '開けたまま'], correctIndex: 1, explanation: '〜たとたん (thể た) cho việc quá khứ bất ngờ, không điều khiển được.' },
  { id: 'q3', question: 'Điểm khác nhau chính giữa 次第 và たとたん là gì?|||What is the key difference between 次第 and たとたん?', options: ['次第: tương lai đã tính trước, trang trọng; たとたん: quá khứ bất ngờ|||次第: planned future, formal; たとたん: sudden past', 'không khác gì|||no difference', 'cả hai đều chỉ quá khứ|||both refer to the past', '次第 chỉ dùng với danh từ|||次第 is only for nouns'], correctIndex: 0, explanation: '次第 = tương lai đã tính, trang trọng; たとたん = quá khứ bất ngờ, không điều khiển. Hướng thời gian ngược nhau.' },
]);

const b6 = doc('jpd336-6-1-partial-negation', 'Lesson 6 — Partial negation & cannot|||Bài 6 — Không hẳn & không thể: わけ',
  '〜わけではない (không hẳn là, không có nghĩa là — phủ định bộ phận); 〜わけにはいかない (không thể — vì lý do xã hội/đạo lý; ない + わけにはいかない = không thể không).',
  [[
    `<span class="eyebrow">JPD336 · Lesson 6</span>
<h2>Partial negation &amp; social impossibility</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>幸せ</td><td>shiawase</td><td>happy / happiness</td></tr>
<tr><td>大事</td><td>daiji</td><td>important</td></tr>
<tr><td>我慢します</td><td>gaman shimasu</td><td>to endure / put up with</td></tr>
<tr><td>責任</td><td>sekinin</td><td>responsibility</td></tr>
<tr><td>嫌い</td><td>kirai</td><td>disliked / hate</td></tr>
</table>
<h3>Grammar — 〜わけではない (it does not mean that; partial negation)</h3>
<p><strong>[plain form] + わけではない</strong> = "it does not necessarily mean, it is not that", denying a natural assumption in part rather than in full (な-adjective な / noun な or という).</p>
<ul>
<li>お金が あるからと いって、幸せな わけではない。 (Okane ga aru kara to itte, shiawase na wake dewa nai.) — Having money does not necessarily mean you are happy.</li>
<li>この 料理が 嫌いな わけではないが、あまり 食べない。 (Kono ryōri ga kirai na wake dewa nai ga, amari tabenai.) — It is not that I dislike this dish, but I rarely eat it.</li>
</ul>
<h3>Grammar — 〜わけにはいかない (cannot, for social reasons)</h3>
<p><strong>[dictionary form] + わけにはいかない</strong> = "cannot", not from ability but from social, moral or psychological pressure. With a ない-verb, <strong>[ない-form] + わけにはいかない</strong> = "cannot not / must".</p>
<ul>
<li>明日は 大事な 試験だから、休む わけには いかない。 (Ashita wa daiji na shiken da kara, yasumu wake ni wa ikanai.) — I cannot take the day off, because there is an important exam tomorrow.</li>
<li>約束したから、行かない わけには いかない。 (Yakusoku shita kara, ikanai wake ni wa ikanai.) — Since I promised, I cannot not go (I have to go).</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 疲れたなら、休んだら？
   Tsukareta nara, yasundara?
B: 締め切りが 近いから、休む わけには いかないんだ。
   Shimekiri ga chikai kara, yasumu wake ni wa ikanai n da.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜わけではない softly denies part of an assumption ("it does not necessarily mean"). 〜わけにはいかない says you cannot do something for social or moral reasons — and with a negative verb it flips to "cannot not = must" (行かない わけには いかない = I have to go).</div>`,
    `<span class="eyebrow">JPD336 · Bài 6</span>
<h2>Không hẳn &amp; không thể: わけ</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>幸せ</td><td>shiawase</td><td>hạnh phúc</td></tr>
<tr><td>大事</td><td>daiji</td><td>quan trọng</td></tr>
<tr><td>我慢します</td><td>gaman shimasu</td><td>chịu đựng, nhẫn nhịn</td></tr>
<tr><td>責任</td><td>sekinin</td><td>trách nhiệm</td></tr>
<tr><td>嫌い</td><td>kirai</td><td>ghét</td></tr>
</table>
<h3>Ngữ pháp — 〜わけではない (không hẳn là; phủ định bộ phận)</h3>
<p><strong>[thể thường] + わけではない</strong> = "không hẳn là, không có nghĩa là", phủ định một phần một giả định tự nhiên chứ không phủ định hoàn toàn (tính từ な thêm な / danh từ thêm な hoặc という).</p>
<ul>
<li>お金が あるからと いって、幸せな わけではない。 (Okane ga aru kara to itte, shiawase na wake dewa nai.) — Có tiền không có nghĩa là hạnh phúc.</li>
<li>この 料理が 嫌いな わけではないが、あまり 食べない。 (Kono ryōri ga kirai na wake dewa nai ga, amari tabenai.) — Không phải là tôi ghét món này, nhưng tôi ít ăn.</li>
</ul>
<h3>Ngữ pháp — 〜わけにはいかない (không thể; vì lý do xã hội)</h3>
<p><strong>[thể từ điển] + わけにはいかない</strong> = "không thể", không phải do khả năng mà do áp lực xã hội, đạo lý hay tâm lý. Với động từ thể ない, <strong>[thể ない] + わけにはいかない</strong> = "không thể không / phải".</p>
<ul>
<li>明日は 大事な 試験だから、休む わけには いかない。 (Ashita wa daiji na shiken da kara, yasumu wake ni wa ikanai.) — Vì mai có kỳ thi quan trọng nên tôi không thể nghỉ được.</li>
<li>約束したから、行かない わけには いかない。 (Yakusoku shita kara, ikanai wake ni wa ikanai.) — Vì đã hứa nên tôi không thể không đi (tức là phải đi).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 疲れたなら、休んだら？
   Tsukareta nara, yasundara?
B: 締め切りが 近いから、休む わけには いかないんだ。
   Shimekiri ga chikai kara, yasumu wake ni wa ikanai n da.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜わけではない phủ định nhẹ một phần giả định ("không hẳn là"). 〜わけにはいかない nói bạn không thể làm gì đó vì lý do xã hội hay đạo lý — và với động từ phủ định thì đảo thành "không thể không = phải" (行かない わけには いかない = tôi buộc phải đi).</div>`,
  ]]);

const b6q = quiz('jpd336-quiz-6', 'Quiz 6 — Partial negation & cannot|||Quiz 6 — Không hẳn & không thể', [
  { id: 'q1', question: '"Có tiền KHÔNG CÓ NGHĨA LÀ hạnh phúc" (phủ định bộ phận) dùng mẫu nào?|||"Money does not necessarily mean happiness" (partial negation) uses which pattern?', options: ['幸せな わけではない', '幸せな わけにはいかない', '幸せに 違いない', '幸せな はずだ'], correctIndex: 0, explanation: '〜わけではない = "không hẳn là", phủ định một phần giả định tự nhiên.' },
  { id: 'q2', question: '"Không thể nghỉ được (vì có kỳ thi quan trọng)" — lý do xã hội / tình thế — dùng mẫu nào?|||"I cannot take the day off (important exam)" uses which pattern?', options: ['休む わけではない', '休む わけにはいかない', '休むに 決まっている', '休むものだ'], correctIndex: 1, explanation: '〜わけにはいかない = không thể vì lý do xã hội / đạo lý, không phải vì khả năng.' },
  { id: 'q3', question: '行かない わけにはいかない có nghĩa là gì?|||What does 行かない わけにはいかない mean?', options: ['không thể đi|||cannot go', 'không thể không đi = phải đi|||cannot not go = must go', 'không hẳn là đi|||not necessarily go', 'chắc chắn không đi|||definitely will not go'], correctIndex: 1, explanation: '[thể ない] + わけにはいかない = "không thể không ~" = buộc phải làm: 行かない わけにはいかない = phải đi.' },
]);

const b7 = doc('jpd336-7-1-truth-and-advice', 'Lesson 7 — General truth & advice|||Bài 7 — Chân lý & lời khuyên: ものだ, ことだ',
  '〜ものだ (vốn dĩ, lẽ thường; nên — đạo lý chung; hồi tưởng); 〜ことだ (nên ~ (lời khuyên riêng cho tình huống cụ thể)).',
  [[
    `<span class="eyebrow">JPD336 · Lesson 7</span>
<h2>General truth &amp; advice: ものだ &amp; ことだ</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>敬語</td><td>keigo</td><td>honorific language</td></tr>
<tr><td>守ります</td><td>mamorimasu</td><td>to keep / protect (a promise, rule)</td></tr>
<tr><td>練習します</td><td>renshū shimasu</td><td>to practise</td></tr>
<tr><td>年上</td><td>toshiue</td><td>older (person)</td></tr>
<tr><td>過ぎます</td><td>sugimasu</td><td>to pass (by) / go past</td></tr>
</table>
<h3>Grammar — 〜ものだ (the way things are; one should; reminiscence)</h3>
<p><strong>[plain form] + ものだ</strong> has three main uses: a general truth or the nature of things; social common sense ("one should"); and, with the past, fond reminiscence ("used to").</p>
<ul>
<li>時間は あっという間に 過ぎる ものだ。 (Jikan wa attoiuma ni sugiru mono da.) — Time just flies by (that is how it is).</li>
<li>年上の 人には 敬語を 使う ものだ。 (Toshiue no hito ni wa keigo o tsukau mono da.) — One should use honorific language with older people.</li>
<li>子供の ころ、よく 川で 遊んだ ものだ。 (Kodomo no koro, yoku kawa de asonda mono da.) — When I was a child, I used to play in the river a lot.</li>
</ul>
<h3>Grammar — 〜ことだ (you had better; direct advice)</h3>
<p><strong>[dictionary form / ない-form] + ことだ</strong> = direct advice to a particular person in a particular situation ("you had better, you should").</p>
<ul>
<li>上手に なりたいなら、毎日 練習する ことだ。 (Jōzu ni naritai nara, mainichi renshū suru koto da.) — If you want to get good, you should practise every day.</li>
<li>風邪の ときは、無理を しない ことだ。 (Kaze no toki wa, muri o shinai koto da.) — When you have a cold, you had better not overdo it.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 最近 よく 眠れないんです。
   Saikin yoku nemurenai n desu.
B: 寝る前に スマホを 見ない ことですよ。
   Neru mae ni sumaho o minai koto desu yo.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜ものだ states a general truth or social norm ("that is how things are", "one should"), and with the past tense recalls how things used to be. 〜ことだ gives direct, situation-specific advice to one listener ("you had better"). Norm for everyone → ものだ; advice for you → ことだ.</div>`,
    `<span class="eyebrow">JPD336 · Bài 7</span>
<h2>Chân lý &amp; lời khuyên: ものだ &amp; ことだ</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>敬語</td><td>keigo</td><td>kính ngữ</td></tr>
<tr><td>守ります</td><td>mamorimasu</td><td>giữ (lời hứa, quy tắc)</td></tr>
<tr><td>練習します</td><td>renshū shimasu</td><td>luyện tập</td></tr>
<tr><td>年上</td><td>toshiue</td><td>người lớn tuổi hơn</td></tr>
<tr><td>過ぎます</td><td>sugimasu</td><td>trôi qua, đi qua</td></tr>
</table>
<h3>Ngữ pháp — 〜ものだ (vốn dĩ, lẽ thường; nên; hồi tưởng)</h3>
<p><strong>[thể thường] + ものだ</strong> có ba cách dùng chính: một chân lý chung hay bản chất vốn dĩ; lẽ thường xã hội ("nên"); và với thì quá khứ là hồi tưởng trìu mến ("ngày xưa hay ~").</p>
<ul>
<li>時間は あっという間に 過ぎる ものだ。 (Jikan wa attoiuma ni sugiru mono da.) — Thời gian vốn dĩ trôi qua trong chớp mắt.</li>
<li>年上の 人には 敬語を 使う ものだ。 (Toshiue no hito ni wa keigo o tsukau mono da.) — Với người lớn tuổi thì nên dùng kính ngữ.</li>
<li>子供の ころ、よく 川で 遊んだ ものだ。 (Kodomo no koro, yoku kawa de asonda mono da.) — Hồi nhỏ tôi hay chơi ở sông lắm.</li>
</ul>
<h3>Ngữ pháp — 〜ことだ (nên ~; lời khuyên trực tiếp)</h3>
<p><strong>[thể từ điển / thể ない] + ことだ</strong> = lời khuyên trực tiếp cho một người cụ thể trong một tình huống cụ thể ("nên, tốt nhất là").</p>
<ul>
<li>上手に なりたいなら、毎日 練習する ことだ。 (Jōzu ni naritai nara, mainichi renshū suru koto da.) — Nếu muốn giỏi thì nên luyện tập mỗi ngày.</li>
<li>風邪の ときは、無理を しない ことだ。 (Kaze no toki wa, muri o shinai koto da.) — Lúc bị cảm thì tốt nhất là đừng gắng sức.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 最近 よく 眠れないんです。
   Saikin yoku nemurenai n desu.
B: 寝る前に スマホを 見ない ことですよ。
   Neru mae ni sumaho o minai koto desu yo.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜ものだ nêu chân lý chung hay lẽ thường xã hội ("vốn dĩ là vậy", "nên"), và với thì quá khứ thì hồi tưởng ngày xưa. 〜ことだ đưa lời khuyên trực tiếp, riêng cho tình huống, tới một người nghe ("tốt nhất là"). Lẽ thường cho mọi người → ものだ; lời khuyên cho bạn → ことだ.</div>`,
  ]]);

const b7q = quiz('jpd336-quiz-7', 'Quiz 7 — General truth & advice|||Quiz 7 — Chân lý & lời khuyên', [
  { id: 'q1', question: '"Với người lớn tuổi thì NÊN dùng kính ngữ" (lẽ thường chung) dùng mẫu nào?|||"One should use keigo with elders" (social norm) uses which pattern?', options: ['敬語を 使う ものだ', '敬語を 使う ことだ', '敬語を 使う わけだ', '敬語を 使う ところだ'], correctIndex: 0, explanation: '〜ものだ nêu lẽ thường / chân lý chung áp dụng cho mọi người.' },
  { id: 'q2', question: '"Nếu muốn giỏi thì NÊN luyện mỗi ngày" (khuyên riêng cho người nghe) dùng mẫu nào?|||"If you want to improve, practise daily" (direct advice) uses which pattern?', options: ['練習する ものだ', '練習する ことだ', '練習する はずだ', '練習する せいだ'], correctIndex: 1, explanation: '〜ことだ đưa lời khuyên trực tiếp, riêng cho tình huống của người nghe.' },
  { id: 'q3', question: '子供の ころ、よく 遊んだ ものだ diễn đạt sắc thái gì?|||What nuance does 子供の ころ、よく 遊んだ ものだ express?', options: ['lời khuyên|||advice', 'hồi tưởng "ngày xưa hay ~"|||reminiscence "used to ~"', 'phủ định bộ phận|||partial negation', 'sự chắc chắn|||certainty'], correctIndex: 1, explanation: 'ものだ + thì quá khứ = hồi tưởng trìu mến: ngày xưa hay làm việc gì đó.' },
]);

const b8 = doc('jpd336-8-1-strong-certainty', 'Lesson 8 — Strong certainty|||Bài 8 — Chắc chắn: に違いない, に決まっている',
  '〜に違いない (chắc chắn là, hẳn là — suy luận có căn cứ); 〜に決まっている (chắc chắn là, đương nhiên — khẳng định khẩu ngữ, tự tin cao).',
  [[
    `<span class="eyebrow">JPD336 · Lesson 8</span>
<h2>Strong certainty: に違いない &amp; に決まっている</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>嘘</td><td>uso</td><td>lie</td></tr>
<tr><td>犯人</td><td>hannin</td><td>culprit / criminal</td></tr>
<tr><td>留守</td><td>rusu</td><td>absence (not at home)</td></tr>
<tr><td>当たり前</td><td>atarimae</td><td>obvious / natural</td></tr>
<tr><td>絶対</td><td>zettai</td><td>absolutely</td></tr>
</table>
<h3>Grammar — 〜に違いない (surely, must be; reasoned)</h3>
<p><strong>[plain form / noun / な-adjective] + に違いない</strong> = "surely, there is no doubt that", a confident judgment based on evidence. It is somewhat formal and written.</p>
<ul>
<li>あの 人は 嘘を ついている に違いない。 (Ano hito wa uso o tsuite iru ni chigainai.) — That person must be lying.</li>
<li>電気が 消えている。留守に違いない。 (Denki ga kiete iru. Rusu ni chigainai.) — The lights are off. They must be out.</li>
</ul>
<h3>Grammar — 〜に決まっている (bound to be; emphatic, casual)</h3>
<p><strong>[plain form / noun / な-adjective] + に決まっている</strong> = "is bound to be, of course", an emphatic, subjective conviction. It is casual and treats the outcome as obvious.</p>
<ul>
<li>こんなに 勉強したんだから、合格する に決まっている。 (Konna ni benkyō shita n dakara, gōkaku suru ni kimatte iru.) — After studying this much, of course I will pass.</li>
<li>そんな 話、嘘に決まっている よ。 (Sonna hanashi, uso ni kimatte iru yo.) — A story like that is obviously a lie.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 田中さん、来るかな。
   Tanaka-san, kuru kana.
B: 約束したんだから、来るに決まっているよ。
   Yakusoku shita n dakara, kuru ni kimatte iru yo.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜に違いない is a reasoned "must be" backed by evidence, and is more formal. 〜に決まっている is an emphatic, casual "of course / bound to be" — a subjective conviction that treats the result as self-evident. Both attach directly to a noun or な-adjective (no だ).</div>`,
    `<span class="eyebrow">JPD336 · Bài 8</span>
<h2>Chắc chắn: に違いない &amp; に決まっている</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>嘘</td><td>uso</td><td>lời nói dối</td></tr>
<tr><td>犯人</td><td>hannin</td><td>thủ phạm</td></tr>
<tr><td>留守</td><td>rusu</td><td>sự vắng nhà</td></tr>
<tr><td>当たり前</td><td>atarimae</td><td>đương nhiên, hiển nhiên</td></tr>
<tr><td>絶対</td><td>zettai</td><td>tuyệt đối</td></tr>
</table>
<h3>Ngữ pháp — 〜に違いない (chắc chắn là, hẳn là; suy luận có căn cứ)</h3>
<p><strong>[thể thường / danh từ / tính từ な] + に違いない</strong> = "chắc chắn là, không nghi ngờ gì", một phán đoán tự tin dựa trên căn cứ. Hơi trang trọng, thiên văn viết.</p>
<ul>
<li>あの 人は 嘘を ついている に違いない。 (Ano hito wa uso o tsuite iru ni chigainai.) — Người kia chắc chắn đang nói dối.</li>
<li>電気が 消えている。留守に違いない。 (Denki ga kiete iru. Rusu ni chigainai.) — Đèn tắt hết. Chắc chắn là họ đi vắng.</li>
</ul>
<h3>Ngữ pháp — 〜に決まっている (chắc chắn là, đương nhiên; khẳng định khẩu ngữ)</h3>
<p><strong>[thể thường / danh từ / tính từ な] + に決まっている</strong> = "đương nhiên là, chắc chắn phải là", một niềm tin chủ quan, nhấn mạnh. Là khẩu ngữ và coi kết quả như hiển nhiên.</p>
<ul>
<li>こんなに 勉強したんだから、合格する に決まっている。 (Konna ni benkyō shita n dakara, gōkaku suru ni kimatte iru.) — Học nhiều thế này thì đương nhiên là đỗ.</li>
<li>そんな 話、嘘に決まっている よ。 (Sonna hanashi, uso ni kimatte iru yo.) — Chuyện như thế thì rõ ràng là nói dối rồi.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 田中さん、来るかな。
   Tanaka-san, kuru kana.
B: 約束したんだから、来るに決まっているよ。
   Yakusoku shita n dakara, kuru ni kimatte iru yo.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜に違いない là "chắc chắn phải là" dựa suy luận có căn cứ, và trang trọng hơn. 〜に決まっている là "đương nhiên / chắc chắn phải thế" mang tính nhấn mạnh, khẩu ngữ — một niềm tin chủ quan coi kết quả là hiển nhiên. Cả hai gắn thẳng vào danh từ hoặc tính từ な (không có だ).</div>`,
  ]]);

const b8q = quiz('jpd336-quiz-8', 'Quiz 8 — Strong certainty|||Quiz 8 — Chắc chắn', [
  { id: 'q1', question: '"Người kia CHẮC CHẮN đang nói dối" (suy luận có căn cứ, trang trọng hơn) dùng mẫu nào?|||"That person must be lying" (reasoned, more formal) uses which pattern?', options: ['嘘を ついている に違いない', '嘘を ついている わけではない', '嘘を つく ものだ', '嘘を つく ことだ'], correctIndex: 0, explanation: '〜に違いない = "chắc chắn phải là", phán đoán có căn cứ, hơi trang trọng.' },
  { id: 'q2', question: 'Mẫu nào là khẳng định KHẨU NGỮ, nhấn mạnh, coi kết quả là ĐƯƠNG NHIÊN?|||Which is the casual, emphatic "of course / bound to be"?', options: ['〜に違いない', '〜に決まっている', '〜わけではない', '〜ものだ'], correctIndex: 1, explanation: '〜に決まっている = niềm tin chủ quan nhấn mạnh, khẩu ngữ: 合格する に決まっている.' },
  { id: 'q3', question: 'Danh từ (ví dụ 嘘) gắn với に決まっている / に違いない thế nào?|||How does a noun (e.g. 嘘) attach to に決まっている / に違いない?', options: ['嘘だに決まっている', '嘘に決まっている', '嘘なに決まっている', '嘘のに決まっている'], correctIndex: 1, explanation: 'Gắn THẲNG vào danh từ, không có だ: 嘘に決まっている, 嘘に違いない.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'JPD336',
    slug: 'jpd336-intermediate-japanese-2-b22',
    title: 'Intermediate Japanese 2-B2.2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JPD336.webp',
    shortDescription: 'Intermediate Japanese 2-B2.2 (JLPT N3 to early N2), continuing JPD326 — raising a topic, good vs bad cause, contrast & blame, leaving as is, as soon as, partial negation & cannot, general truth & advice, and strong certainty. Bilingual, with quizzes.|||Tiếng Nhật trung cấp 2-B2.2 (N3 cuối đến N2 đầu), nối tiếp JPD326 — nêu đề tài, nhờ & tại, dù ~ lại, để nguyên, ngay khi, không hẳn & không thể, chân lý & lời khuyên, và chắc chắn cao. Song ngữ, có quiz.',
    description: 'Môn <strong>JPD336 — Intermediate Japanese 2-B2.2 (Tiếng Nhật trung cấp 2, B2.2)</strong> thuộc khối Ngôn ngữ Nhật FPTU, Kỳ 4, <strong>nối tiếp JPD326</strong> và bước từ <strong>JLPT N3</strong> vững vàng sang những mẫu <strong>N2</strong> đầu tiên (中級). Bám giáo trình chuẩn <em>Minna no Nihongo Chukyu II / Tobira</em>, trọng tâm là chọn giữa các mẫu gần nghĩa: <strong>nêu đề tài</strong> (〜について, 〜に関して, 〜をめぐって) → <strong>nhờ &amp; tại</strong> (〜おかげで, 〜せいで) → <strong>dù ~ lại</strong> (〜くせに, 〜のに) → <strong>để nguyên trạng</strong> (〜っぱなし, 〜まま) → <strong>ngay khi</strong> (〜次第, 〜たとたん) → <strong>không hẳn &amp; không thể</strong> (〜わけではない, 〜わけにはいかない) → <strong>chân lý &amp; lời khuyên</strong> (〜ものだ, 〜ことだ) → <strong>chắc chắn cao</strong> (〜に違いない, 〜に決まっている). Mỗi bài có từ vựng, ngữ pháp, hội thoại và quiz; song ngữ Nhật-Việt.',
    whatYouLearn: 'Nêu đề tài bằng 〜について / 〜に関して / 〜をめぐって; phân biệt nguyên nhân tốt 〜おかげで và xấu 〜せいで; diễn đạt tương phản với 〜のに (trung tính) và 〜くせに (kèm chê trách); tả trạng thái để nguyên bằng 〜っぱなし (bỏ mặc) và 〜まま (giữ nguyên); đánh dấu "ngay khi" với 〜次第 (kế hoạch, trang trọng) và 〜たとたん (bất ngờ, quá khứ); phủ định bộ phận 〜わけではない và sự bất khả xã hội 〜わけにはいかない (kể cả "không thể không"); nêu chân lý &amp; lẽ thường 〜ものだ và lời khuyên trực tiếp 〜ことだ; diễn đạt sự chắc chắn cao bằng 〜に違いない (suy luận) và 〜に決まっている (khẩu ngữ).',
    requirements: 'Cần đã học <strong>JPD326 (Intermediate Japanese 2, B2.1)</strong> hoặc tương đương (JLPT N3): dùng thành thạo bốn thể điều kiện (と・ば・たら・なら), hệ thống kính ngữ và các thể 〜て mở rộng. Nên dùng app thẻ ghi nhớ (Anki) để luyện từ vựng N3-N2 &amp; các cặp mẫu dễ nhầm mỗi ngày.',
  },
  sections: [
    { title: '📚 Tài liệu & lộ trình|||📚 Materials & path', description: 'Giáo trình, app, từ điển, lộ trình 4 bước cho N3 cuối - N2 đầu.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp JPD326, mục tiêu N3 cuối - N2 đầu, trọng tâm chọn giữa các mẫu gần nghĩa.', lessons: [intro] },
    { title: 'Bài 1 — Nêu đề tài|||Lesson 1 — Raising a topic', description: '〜について, 〜に関して, 〜をめぐって.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Nhờ & tại|||Lesson 2 — Good vs bad cause', description: '〜おかげで, 〜せいで.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Dù ~ lại|||Lesson 3 — Contrast & blame', description: '〜くせに, 〜のに.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Để nguyên|||Lesson 4 — Leaving as is', description: '〜っぱなし, 〜まま.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Ngay khi|||Lesson 5 — As soon as', description: '〜次第, 〜たとたん.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Không hẳn & không thể|||Lesson 6 — Partial negation & cannot', description: '〜わけではない, 〜わけにはいかない.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Chân lý & lời khuyên|||Lesson 7 — General truth & advice', description: '〜ものだ, 〜ことだ.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Chắc chắn|||Lesson 8 — Strong certainty', description: '〜に違いない, 〜に決まっている.', lessons: [b8, b8q] },
  ],
};
