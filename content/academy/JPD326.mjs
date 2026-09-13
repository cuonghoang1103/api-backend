/**
 * JPD326 — Intermediate Japanese 2 (Tiếng Nhật trung cấp 2, B2.1).
 * Khối Ngôn ngữ Nhật FPTU, Kỳ 3. NỐI TIẾP JPD226 Pre-Intermediate Japanese 2.
 * MÔN NGÔN NGỮ: cấu trúc bài học tiếng (từ vựng, ngữ pháp, hội thoại, luyện
 * tập), trình độ JLPT N3 (中級). Bám giáo trình chuẩn みんなの日本語 中級 I
 * Minna no Nihongo Chukyu I / Tobira (đầu).
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML;
 * "&"→&amp; trong content HTML; helper doc .join('\n') ra STRING.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức bài học.', quiz: { timeLimitSeconds: 300, questions } });

const taiLieu = doc('jpd326-0-0-tai-lieu', '📚 Materials & references|||📚 Tài liệu & lộ trình học',
  'Trung tâm tài liệu: giáo trình (Minna no Nihongo Chukyu I, Tobira), app (Anki/Bunpro), từ điển jisho.org, lộ trình 4 bước cho N3.',
  [[
    `<span class="eyebrow">JPD326 · Materials</span>
<h2>Materials &amp; resource hub</h2>
<p class="lead">Everything to work through <strong>Intermediate Japanese</strong> — this course picks up right where <strong>JPD226</strong> left off and carries you into solid <strong>JLPT N3</strong> (中級) grammar. The official FPTU slides &amp; textbook live on <strong>FLM</strong>; below are trusted study resources.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><strong>みんなの日本語 中級 I</strong> (Minna no Nihongo Chukyu I) — the standard bridge from beginner to intermediate; each lesson pairs a reading with the exact N3 patterns taught here.</li>
<li><strong>とびら (Tobira: Gateway to Advanced Japanese)</strong> — a content-rich intermediate course whose early chapters cover the same conjunctions, conditionals and keigo.</li>
</ul>
<h3>🌐 Dictionary &amp; grammar</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — the best free Japanese-English dictionary; it tags each word by JLPT level and shows every plain form.</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — grammar SRS ordered by JLPT level; drill every N3 pattern below in order.</li>
</ul>
<h3>🃏 Apps for drilling</h3>
<ul>
<li><strong>Anki</strong> — spaced-repetition flashcards; add decks for N3 vocabulary and for the pattern pairs that are easy to confuse (はず vs わけ, the four conditionals).</li>
<li><strong>Migii JLPT</strong> — N3 mock tests and vocab by level, popular in Vietnam.</li>
</ul>
<div class="callout"><span class="badge">4-step study path</span>
<ol>
<li><strong>Review JPD226</strong> — the passive, causative, causative-passive and the special keigo verbs must be automatic; N3 keigo (Lesson 6) reuses and systematises them.</li>
<li><strong>Learn each pattern in a pair</strong> — N3 grammar is mostly about telling near-synonyms apart (はず vs わけ, ように vs ために, てしまう vs ておく vs てある). Study the contrast, not the pattern alone.</li>
<li><strong>Read and speak</strong> — the patterns appear constantly in intermediate readings and conversation; use each lesson dialogue as a model.</li>
<li><strong>Test-ready</strong> — drill vocab &amp; grammar with Anki, take N3 mock tests on Migii.</li>
</ol></div>`,
    `<span class="eyebrow">JPD326 · Tài liệu</span>
<h2>Trung tâm tài liệu &amp; lộ trình</h2>
<p class="lead">Mọi thứ để học <strong>tiếng Nhật trung cấp</strong> — môn này nối thẳng từ <strong>JPD226</strong> và đưa bạn vào ngữ pháp <strong>JLPT N3</strong> (中級) vững vàng. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn học đáng tin.</p>
<h3>📘 Giáo trình lõi</h3>
<ul>
<li><strong>みんなの日本語 中級 I</strong> (Minna no Nihongo Chukyu I) — giáo trình bắc cầu chuẩn từ sơ cấp lên trung cấp; mỗi bài gắn một bài đọc với đúng các mẫu N3 dạy ở đây.</li>
<li><strong>とびら (Tobira)</strong> — giáo trình trung cấp giàu nội dung, các chương đầu bao trùm chính các liên từ, thể điều kiện và kính ngữ này.</li>
</ul>
<h3>🌐 Từ điển &amp; ngữ pháp</h3>
<ul>
<li><a href="https://jisho.org/" target="_blank" rel="noopener">jisho.org</a> — từ điển Nhật-Anh miễn phí tốt nhất; nó gắn nhãn trình độ JLPT và chỉ mọi thể thường.</li>
<li><a href="https://bunpro.jp/" target="_blank" rel="noopener">Bunpro</a> — luyện ngữ pháp theo trình độ JLPT; luyện lần lượt mọi mẫu N3 bên dưới.</li>
</ul>
<h3>🃏 App luyện</h3>
<ul>
<li><strong>Anki</strong> — thẻ ghi nhớ lặp lại ngắt quãng; nên tạo bộ cho từ vựng N3 và cho các cặp mẫu dễ nhầm (はず và わけ, bốn thể điều kiện).</li>
<li><strong>Migii JLPT</strong> — đề thi thử N3 &amp; từ vựng theo trình độ, phổ biến ở Việt Nam.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình học 4 bước</span>
<ol>
<li><strong>Ôn JPD226</strong> — thể bị động, sai khiến, sai khiến-bị động và các động từ kính ngữ đặc biệt phải thành phản xạ; kính ngữ N3 (Bài 6) dùng lại và hệ thống hóa chúng.</li>
<li><strong>Học mỗi mẫu theo cặp</strong> — ngữ pháp N3 phần lớn là phân biệt các mẫu gần nghĩa (はず và わけ, ように và ために, てしまう / ておく / てある). Học sự khác biệt, đừng học riêng lẻ.</li>
<li><strong>Đọc và nói</strong> — các mẫu xuất hiện liên tục trong bài đọc và hội thoại trung cấp; lấy hội thoại mỗi bài làm mẫu.</li>
<li><strong>Sẵn sàng thi</strong> — luyện từ vựng &amp; ngữ pháp bằng Anki, làm đề N3 thử trên Migii.</li>
</ol></div>`,
  ]]);

const intro = doc('jpd326-0-1-overview', 'Course overview: Intermediate Japanese 2|||Tổng quan: Tiếng Nhật trung cấp 2',
  'Nối tiếp JPD226; mục tiêu N3 vững; trọng tâm các liên từ &amp; mẫu nối trung cấp, bốn thể điều kiện, hệ thống kính ngữ và các thể 〜て mở rộng; lộ trình 8 bài.',
  [[
    `<span class="eyebrow">JPD326 · Lesson 0.1 · Overview</span>
<h2>Intermediate Japanese 2 (B2.1)</h2>
<p class="lead">This course continues <strong>JPD226 (Pre-Intermediate Japanese 2)</strong> and moves fully into <strong>JLPT N3</strong> (中級). Where the beginner series taught one clear pattern at a time, intermediate Japanese is about <strong>choosing between near-synonyms</strong> — patterns that translate the same way in English but differ in nuance and grammar.</p>
<h3>What is new here</h3>
<p>You gain richer connectives and modality: <strong>〜ばかり / 〜ところ</strong> pinpoint when an action happened, <strong>〜はず / 〜わけ</strong> express reasoned certainty and explanation, <strong>〜による / 〜において / 〜として</strong> add formal relations, the <strong>four conditionals</strong> (と・ば・たら・なら) are compared side by side, <strong>〜ように / 〜ため</strong> mark purpose precisely, the full <strong>keigo system</strong> is organised, <strong>〜てしまう / 〜ておく / 〜てある</strong> express completion, preparation and result, and <strong>〜そうだ / 〜ようだ / 〜らしい / 〜みたい</strong> report and infer.</p>
<h3>Study tip for N3</h3>
<ul>
<li><strong>Learn in contrast</strong> — はず (reasoned expectation) vs わけ (logical conclusion); ように (non-volitional purpose) vs ために (volitional purpose).</li>
<li><strong>Watch the attachment</strong> — many patterns take the plain form, but a noun or な-adjective often needs な or の (静かなはず, 病気のよう).</li>
<li><strong>Keep JPD226 warm</strong> — the passive, causative and keigo verbs return here.</li>
</ul>
<h3>Roadmap (8 lessons)</h3>
<p>Recent &amp; imminent → certainty &amp; explanation → depending on / at / as → the four conditionals → purpose → the keigo system → completion &amp; preparation → reporting &amp; conjecture.</p>`,
    `<span class="eyebrow">JPD326 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Nhật trung cấp 2 (B2.1)</h2>
<p class="lead">Môn này nối tiếp <strong>JPD226 (Tiếng Nhật tiền trung cấp 2)</strong> và bước hẳn vào <strong>JLPT N3</strong> (中級). Nếu chuỗi sơ cấp dạy từng mẫu một cách rõ ràng, thì tiếng Nhật trung cấp là chuyện <strong>chọn giữa các mẫu gần nghĩa</strong> — những mẫu dịch ra tiếng Việt giống nhau nhưng khác về sắc thái và ngữ pháp.</p>
<h3>Điểm mới ở đây</h3>
<p>Bạn có thêm liên từ và cách diễn đạt phong phú: <strong>〜ばかり / 〜ところ</strong> định vị thời điểm hành động, <strong>〜はず / 〜わけ</strong> nêu sự chắc chắn có căn cứ và lời giải thích, <strong>〜による / 〜において / 〜として</strong> thêm quan hệ trang trọng, <strong>bốn thể điều kiện</strong> (と・ば・たら・なら) được so sánh song song, <strong>〜ように / 〜ため</strong> đánh dấu mục đích chính xác, toàn bộ <strong>hệ thống kính ngữ</strong> được sắp xếp, <strong>〜てしまう / 〜ておく / 〜てある</strong> nói hoàn thành, chuẩn bị và trạng thái, và <strong>〜そうだ / 〜ようだ / 〜らしい / 〜みたい</strong> để truyền đạt và suy đoán.</p>
<h3>Mẹo học N3</h3>
<ul>
<li><strong>Học theo cặp đối chiếu</strong> — はず (kỳ vọng có căn cứ) và わけ (kết luận logic); ように (mục đích vô ý chí) và ために (mục đích ý chí).</li>
<li><strong>Để ý cách gắn</strong> — nhiều mẫu đi với thể thường, nhưng danh từ hay tính từ な thường cần な hoặc の (静かなはず, 病気のよう).</li>
<li><strong>Giữ JPD226 còn nóng</strong> — thể bị động, sai khiến và các động từ kính ngữ quay lại ở đây.</li>
</ul>
<h3>Lộ trình (8 bài)</h3>
<p>Vừa &amp; sắp xảy ra → chắc chắn &amp; giải thích → tùy theo / tại / với tư cách → bốn thể điều kiện → mục đích → hệ thống kính ngữ → hoàn thành &amp; chuẩn bị → truyền đạt &amp; suy đoán.</p>`,
  ]]);

const b1 = doc('jpd326-1-1-recent-imminent', 'Lesson 1 — Recent & imminent actions|||Bài 1 — Vừa mới & sắp làm',
  '〜たばかり (vừa mới, cảm nhận chủ quan); 〜たところ / 〜るところ / 〜ているところ (vừa xong / sắp làm / đang làm).',
  [[
    `<span class="eyebrow">JPD326 · Lesson 1</span>
<h2>Recent &amp; imminent actions</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>卒業します</td><td>sotsugyō shimasu</td><td>to graduate</td></tr>
<tr><td>引っ越します</td><td>hikkoshimasu</td><td>to move house</td></tr>
<tr><td>慣れます</td><td>naremasu</td><td>to get used to</td></tr>
<tr><td>出かけます</td><td>dekakemasu</td><td>to go out</td></tr>
<tr><td>ちょうど</td><td>chōdo</td><td>just / exactly</td></tr>
</table>
<h3>Grammar — 〜たばかり (just did, felt as recent)</h3>
<p><strong>[た-form] + ばかり</strong> = "just did", from the speaker's feeling — the event may not be objectively recent.</p>
<ul>
<li>日本へ 来たばかりで、まだ 慣れていません。 (Nihon e kita bakari de, mada narete imasen.) — I have only just come to Japan, so I am not used to it yet.</li>
<li>この 車は 先月 買ったばかりです。 (Kono kuruma wa sengetsu katta bakari desu.) — I bought this car only last month.</li>
</ul>
<h3>Grammar — 〜ところ (the point of an action)</h3>
<p><strong>[dictionary form] + ところ</strong> = about to do; <strong>[〜ている] + ところ</strong> = in the middle of doing; <strong>[た-form] + ところ</strong> = have just done (objectively, right now).</p>
<ul>
<li>今から 出かけるところです。 (Ima kara dekakeru tokoro desu.) — I am just about to go out.</li>
<li>今 レポートを 書いているところです。 (Ima repōto o kaite iru tokoro desu.) — I am in the middle of writing a report.</li>
<li>ちょうど 駅に 着いたところです。 (Chōdo eki ni tsuita tokoro desu.) — I have just arrived at the station.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: もう 昼ご飯を 食べましたか。
   Mō hirugohan o tabemashita ka.
B: いいえ、今から 食べるところです。
   Iie, ima kara taberu tokoro desu.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜たばかり is a subjective feeling of "recent" and can follow a distant event; 〜たところ is objectively "right now, just finished". Use 〜るところ for "about to", 〜ているところ for "in the middle of".</div>`,
    `<span class="eyebrow">JPD326 · Bài 1</span>
<h2>Vừa mới &amp; sắp làm</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>卒業します</td><td>sotsugyō shimasu</td><td>tốt nghiệp</td></tr>
<tr><td>引っ越します</td><td>hikkoshimasu</td><td>chuyển nhà</td></tr>
<tr><td>慣れます</td><td>naremasu</td><td>quen (với)</td></tr>
<tr><td>出かけます</td><td>dekakemasu</td><td>ra ngoài</td></tr>
<tr><td>ちょうど</td><td>chōdo</td><td>vừa đúng, vừa vặn</td></tr>
</table>
<h3>Ngữ pháp — 〜たばかり (vừa mới làm, cảm nhận chủ quan)</h3>
<p><strong>[thể た] + ばかり</strong> = "vừa mới", theo cảm nhận của người nói — việc đó có thể không thực sự mới về thời gian.</p>
<ul>
<li>日本へ 来たばかりで、まだ 慣れていません。 (Nihon e kita bakari de, mada narete imasen.) — Tôi mới sang Nhật nên chưa quen.</li>
<li>この 車は 先月 買ったばかりです。 (Kono kuruma wa sengetsu katta bakari desu.) — Chiếc xe này tôi mới mua tháng trước.</li>
</ul>
<h3>Ngữ pháp — 〜ところ (thời điểm của hành động)</h3>
<p><strong>[thể từ điển] + ところ</strong> = sắp làm; <strong>[〜ている] + ところ</strong> = đang trong lúc làm; <strong>[thể た] + ところ</strong> = vừa làm xong (khách quan, ngay lúc này).</p>
<ul>
<li>今から 出かけるところです。 (Ima kara dekakeru tokoro desu.) — Tôi đang định ra ngoài ngay bây giờ.</li>
<li>今 レポートを 書いているところです。 (Ima repōto o kaite iru tokoro desu.) — Tôi đang viết báo cáo.</li>
<li>ちょうど 駅に 着いたところです。 (Chōdo eki ni tsuita tokoro desu.) — Tôi vừa đến ga xong.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: もう 昼ご飯を 食べましたか。
   Mō hirugohan o tabemashita ka.
B: いいえ、今から 食べるところです。
   Iie, ima kara taberu tokoro desu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜たばかり là cảm nhận chủ quan về "mới" và có thể theo sau một việc đã lâu; 〜たところ là "ngay lúc này, vừa xong" một cách khách quan. Dùng 〜るところ cho "sắp làm", 〜ているところ cho "đang giữa chừng".</div>`,
  ]]);

const b1q = quiz('jpd326-quiz-1', 'Quiz 1 — Recent & imminent|||Quiz 1 — Vừa mới & sắp làm', [
  { id: 'q1', question: 'Mẫu nào diễn đạt "sắp làm" (chưa bắt đầu)?|||Which pattern means "about to do" (not yet started)?', options: ['[thể từ điển] + ところ|||[dictionary form] + ところ', '[thể た] + ところ|||[た-form] + ところ', '[〜ている] + ところ|||[〜ている] + ところ', '[thể た] + ばかり|||[た-form] + ばかり'], correctIndex: 0, explanation: '[thể từ điển] + ところ = sắp làm: 出かけるところです.' },
  { id: 'q2', question: '〜たばかり khác 〜たところ ở chỗ nào?|||How does 〜たばかり differ from 〜たところ?', options: ['〜たばかり là cảm nhận chủ quan về "mới", có thể theo việc đã lâu; 〜たところ là "ngay vừa xong" khách quan|||〜たばかり is a subjective feeling of recent and can follow a distant event; 〜たところ is objectively just now', 'không khác gì|||no difference', '〜たばかり chỉ dùng cho danh từ|||〜たばかり is only for nouns', '〜たところ nghĩa là sắp làm|||〜たところ means about to do'], correctIndex: 0, explanation: '〜たばかり: cảm nhận "mới" (chủ quan); 〜たところ: khách quan, ngay vừa hoàn thành.' },
  { id: 'q3', question: '"Tôi đang viết báo cáo" dùng mẫu nào?|||"I am in the middle of writing a report" uses which pattern?', options: ['書くところです', '書いたところです', '書いているところです', '書いたばかりです'], correctIndex: 2, explanation: '[〜ている] + ところ = đang giữa chừng: 書いているところです.' },
]);

const b2 = doc('jpd326-2-1-certainty-explanation', 'Lesson 2 — Certainty & explanation|||Bài 2 — Chắc chắn & giải thích',
  '〜はず (lẽ ra, chắc là — có căn cứ); 〜わけ (tức là, hóa ra — kết luận logic); 〜わけにはいかない (không thể).',
  [[
    `<span class="eyebrow">JPD326 · Lesson 2</span>
<h2>Certainty &amp; explanation</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>約束</td><td>yakusoku</td><td>promise / appointment</td></tr>
<tr><td>締め切り</td><td>shimekiri</td><td>deadline</td></tr>
<tr><td>まじめ</td><td>majime</td><td>serious / diligent</td></tr>
<tr><td>事情</td><td>jijō</td><td>circumstances / reasons</td></tr>
<tr><td>確か</td><td>tashika</td><td>if I remember rightly / surely</td></tr>
</table>
<h3>Grammar — 〜はず (reasoned expectation)</h3>
<p><strong>[plain form] + はずです</strong> = "it should be" from evidence or reasoning (noun の, な-adjective な). <strong>〜はずがない</strong> = "there is no way that". <strong>〜はずだった</strong> = "was supposed to (but did not)".</p>
<ul>
<li>田中さんは 来るはずです。約束しましたから。 (Tanaka-san wa kuru hazu desu. Yakusoku shimashita kara.) — Tanaka should come, because he promised.</li>
<li>まじめな 彼が 遅刻するはずがありません。 (Majime na kare ga chikoku suru hazu ga arimasen.) — There is no way such a diligent person would be late.</li>
</ul>
<h3>Grammar — 〜わけ (logical conclusion)</h3>
<p><strong>[plain form] + わけです</strong> = "that is why / it follows that" (na-adj な, noun という). <strong>〜わけではない</strong> = "it does not necessarily mean". <strong>〜わけにはいかない</strong> = "cannot (for social or moral reasons)".</p>
<ul>
<li>3年 日本に いたんですか。日本語が 上手なわけですね。 (San-nen nihon ni ita n desu ka. Nihongo ga jōzu na wake desu ne.) — You lived in Japan for three years? No wonder your Japanese is good.</li>
<li>明日は 試験だから、遊びに 行くわけには いきません。 (Ashita wa shiken da kara, asobi ni iku wake ni wa ikimasen.) — There is an exam tomorrow, so I cannot go out to play.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 彼は 来ますか。
   Kare wa kimasu ka.
B: 約束したから、来るはずですよ。
   Yakusoku shita kara, kuru hazu desu yo.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜はず is a confident guess backed by a reason; 〜わけ draws a logical conclusion or gives the reason behind a fact. Do not confuse 〜はずがない ("no way", based on reasoning) with 〜わけにはいかない ("cannot", for social or moral reasons).</div>`,
    `<span class="eyebrow">JPD326 · Bài 2</span>
<h2>Chắc chắn &amp; giải thích</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>約束</td><td>yakusoku</td><td>lời hứa / cuộc hẹn</td></tr>
<tr><td>締め切り</td><td>shimekiri</td><td>hạn chót</td></tr>
<tr><td>まじめ</td><td>majime</td><td>nghiêm túc, chăm chỉ</td></tr>
<tr><td>事情</td><td>jijō</td><td>hoàn cảnh, lý do</td></tr>
<tr><td>確か</td><td>tashika</td><td>nếu tôi nhớ không nhầm / chắc là</td></tr>
</table>
<h3>Ngữ pháp — 〜はず (kỳ vọng có căn cứ)</h3>
<p><strong>[thể thường] + はずです</strong> = "lẽ ra, chắc là" dựa trên căn cứ hay suy luận (danh từ の, tính từ な thêm な). <strong>〜はずがない</strong> = "không thể nào". <strong>〜はずだった</strong> = "lẽ ra đã (nhưng không xảy ra)".</p>
<ul>
<li>田中さんは 来るはずです。約束しましたから。 (Tanaka-san wa kuru hazu desu. Yakusoku shimashita kara.) — Anh Tanaka chắc sẽ đến, vì đã hứa rồi.</li>
<li>まじめな 彼が 遅刻するはずがありません。 (Majime na kare ga chikoku suru hazu ga arimasen.) — Người chăm chỉ như anh ấy không thể nào đến muộn.</li>
</ul>
<h3>Ngữ pháp — 〜わけ (kết luận logic)</h3>
<p><strong>[thể thường] + わけです</strong> = "tức là / thảo nào / hóa ra là" (tính từ な thêm な, danh từ thêm という). <strong>〜わけではない</strong> = "không hẳn là". <strong>〜わけにはいかない</strong> = "không thể (vì lý do xã hội hay đạo lý)".</p>
<ul>
<li>3年 日本に いたんですか。日本語が 上手なわけですね。 (San-nen nihon ni ita n desu ka. Nihongo ga jōzu na wake desu ne.) — Anh ở Nhật ba năm à? Thảo nào tiếng Nhật giỏi thế.</li>
<li>明日は 試験だから、遊びに 行くわけには いきません。 (Ashita wa shiken da kara, asobi ni iku wake ni wa ikimasen.) — Mai thi rồi nên không thể đi chơi được.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 彼は 来ますか。
   Kare wa kimasu ka.
B: 約束したから、来るはずですよ。
   Yakusoku shita kara, kuru hazu desu yo.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜はず là phán đoán tự tin có lý do làm căn cứ; 〜わけ rút ra kết luận logic hoặc nêu lý do đằng sau một sự việc. Đừng lẫn 〜はずがない ("không thể nào", dựa suy luận) với 〜わけにはいかない ("không thể", vì lý do xã hội hay đạo lý).</div>`,
  ]]);

const b2q = quiz('jpd326-quiz-2', 'Quiz 2 — Certainty & explanation|||Quiz 2 — Chắc chắn & giải thích', [
  { id: 'q1', question: '"Anh ấy chắc sẽ đến (vì đã hứa)" dùng mẫu nào?|||"He should come (because he promised)" uses which pattern?', options: ['来るはずです', '来るわけです', '来るはずがありません', '来るわけにはいきません'], correctIndex: 0, explanation: '〜はずです = kỳ vọng có căn cứ: 来るはずです.' },
  { id: 'q2', question: 'Danh từ / tính từ な đứng trước はず thì gắn thế nào? (ví dụ 上手)|||How does a な-adjective attach to はず? (e.g. 上手)', options: ['上手だはず', '上手なはず', '上手のはず', '上手はず'], correctIndex: 1, explanation: 'Tính từ な + な + はず: 上手なはず. (Danh từ thì dùng の: 病気のはず.)' },
  { id: 'q3', question: '"Mai thi rồi nên KHÔNG THỂ đi chơi" (vì lý do tình thế) dùng mẫu nào?|||"I cannot go out to play (given the exam)" uses which pattern?', options: ['行くはずがありません', '行くわけにはいきません', '行くわけではありません', '行くところです'], correctIndex: 1, explanation: '〜わけにはいかない = không thể vì lý do xã hội / tình thế, khác 〜はずがない (không thể theo suy luận).' },
]);

const b3 = doc('jpd326-3-1-relation-particles', 'Lesson 3 — Depending on, at, as|||Bài 3 — Tùy theo, tại, với tư cách',
  '〜によって/による (tùy theo / do / bằng / bởi); 〜において (tại, trong — trang trọng); 〜として (với tư cách là).',
  [[
    `<span class="eyebrow">JPD326 · Lesson 3</span>
<h2>Depending on, at, as</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>場合</td><td>baai</td><td>case / situation</td></tr>
<tr><td>立場</td><td>tachiba</td><td>standpoint / position</td></tr>
<tr><td>代表</td><td>daihyō</td><td>representative</td></tr>
<tr><td>会議</td><td>kaigi</td><td>meeting / conference</td></tr>
<tr><td>習慣</td><td>shūkan</td><td>custom / habit</td></tr>
</table>
<h3>Grammar — 〜によって / 〜による (depending on / by / due to)</h3>
<p><strong>[noun] + によって</strong> has several senses: it varies "depending on", "due to" a cause, "by means of", and marks the agent in a passive sentence. <strong>[noun] + による + [noun]</strong> modifies a noun.</p>
<ul>
<li>国に よって、習慣が 違います。 (Kuni ni yotte, shūkan ga chigaimasu.) — Customs differ depending on the country. (varies)</li>
<li>この 小説は 夏目漱石に よって 書かれました。 (Kono shōsetsu wa Natsume Sōseki ni yotte kakaremashita.) — This novel was written by Natsume Soseki. (agent)</li>
</ul>
<h3>Grammar — 〜において (at / in, formal)</h3>
<p><strong>[noun] + において</strong> is a formal equivalent of で, marking a place, time or field.</p>
<ul>
<li>会議は 東京に おいて 行われます。 (Kaigi wa Tōkyō ni oite okonawaremasu.) — The conference will be held in Tokyo.</li>
</ul>
<h3>Grammar — 〜として (as / in the role of)</h3>
<p><strong>[noun] + として</strong> = "as, in the capacity of".</p>
<ul>
<li>私は 代表として 会議に 出席します。 (Watashi wa daihyō to shite kaigi ni shusseki shimasu.) — I attend the meeting as a representative.</li>
<li>彼は 医者として 有名です。 (Kare wa isha to shite yūmei desu.) — He is famous as a doctor.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 出席者は だれですか。
   Shussekisha wa dare desu ka.
B: 私が 会社の 代表として 出ます。
   Watashi ga kaisha no daihyō to shite demasu.
</code></pre>
<div class="callout"><span class="badge">Note</span> によって is the busiest of the three: "varies with", "caused by", "by means of", and the passive agent — context decides. において is a formal で; として states a role or capacity.</div>`,
    `<span class="eyebrow">JPD326 · Bài 3</span>
<h2>Tùy theo, tại, với tư cách</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>場合</td><td>baai</td><td>trường hợp</td></tr>
<tr><td>立場</td><td>tachiba</td><td>lập trường, vị trí</td></tr>
<tr><td>代表</td><td>daihyō</td><td>đại diện</td></tr>
<tr><td>会議</td><td>kaigi</td><td>cuộc họp, hội nghị</td></tr>
<tr><td>習慣</td><td>shūkan</td><td>tập quán, thói quen</td></tr>
</table>
<h3>Ngữ pháp — 〜によって / 〜による (tùy theo / do / bằng / bởi)</h3>
<p><strong>[danh từ] + によって</strong> có nhiều nghĩa: "tùy theo" (thay đổi), "do" (nguyên nhân), "bằng" (phương tiện), và đánh dấu chủ thể trong câu bị động. <strong>[danh từ] + による + [danh từ]</strong> để bổ nghĩa cho danh từ.</p>
<ul>
<li>国に よって、習慣が 違います。 (Kuni ni yotte, shūkan ga chigaimasu.) — Tùy theo mỗi nước mà tập quán khác nhau. (thay đổi)</li>
<li>この 小説は 夏目漱石に よって 書かれました。 (Kono shōsetsu wa Natsume Sōseki ni yotte kakaremashita.) — Cuốn tiểu thuyết này do Natsume Soseki viết. (chủ thể bị động)</li>
</ul>
<h3>Ngữ pháp — 〜において (tại / trong, trang trọng)</h3>
<p><strong>[danh từ] + において</strong> là dạng trang trọng của で, chỉ nơi chốn, thời gian hay lĩnh vực.</p>
<ul>
<li>会議は 東京に おいて 行われます。 (Kaigi wa Tōkyō ni oite okonawaremasu.) — Cuộc họp được tổ chức tại Tokyo.</li>
</ul>
<h3>Ngữ pháp — 〜として (với tư cách là)</h3>
<p><strong>[danh từ] + として</strong> = "với tư cách, trong vai trò".</p>
<ul>
<li>私は 代表として 会議に 出席します。 (Watashi wa daihyō to shite kaigi ni shusseki shimasu.) — Tôi dự họp với tư cách đại diện.</li>
<li>彼は 医者として 有名です。 (Kare wa isha to shite yūmei desu.) — Anh ấy nổi tiếng với tư cách một bác sĩ.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 出席者は だれですか。
   Shussekisha wa dare desu ka.
B: 私が 会社の 代表として 出ます。
   Watashi ga kaisha no daihyō to shite demasu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> によって là mẫu bận rộn nhất trong ba: "thay đổi tùy theo", "do nguyên nhân", "bằng phương tiện", và chủ thể bị động — ngữ cảnh quyết định. において là で trang trọng; として nêu vai trò hay tư cách.</div>`,
  ]]);

const b3q = quiz('jpd326-quiz-3', 'Quiz 3 — Depending on, at, as|||Quiz 3 — Tùy theo, tại, với tư cách', [
  { id: 'q1', question: '"Tùy theo mỗi nước mà tập quán khác nhau" dùng mẫu nào?|||"Customs differ depending on the country" uses which pattern?', options: ['国に よって', '国に おいて', '国として', '国のはず'], correctIndex: 0, explanation: '〜によって mang nghĩa "thay đổi tùy theo": 国によって 習慣が 違います.' },
  { id: 'q2', question: '〜において gần nghĩa với trợ từ nào (trang trọng)?|||〜において is a formal equivalent of which particle?', options: ['で', 'に', 'を', 'と'], correctIndex: 0, explanation: '〜において = で trang trọng, chỉ nơi chốn / thời gian / lĩnh vực.' },
  { id: 'q3', question: '"Tôi dự họp với tư cách đại diện" dùng mẫu nào?|||"I attend as a representative" uses which pattern?', options: ['代表によって', '代表において', '代表として', '代表のわけ'], correctIndex: 2, explanation: '〜として = với tư cách / trong vai trò: 代表として.' },
]);

const b4 = doc('jpd326-4-1-conditionals', 'Lesson 4 — The four conditionals|||Bài 4 — Bốn thể điều kiện',
  '〜と (quy luật tất yếu); 〜ば (giả định chung); 〜たら (nếu/khi, linh hoạt nhất); 〜なら (nếu theo ngữ cảnh) — so sánh.',
  [[
    `<span class="eyebrow">JPD326 · Lesson 4</span>
<h2>The four conditionals compared</h2>
<h3>How each one forms</h3>
<table>
<tr><th>form</th><th>rule</th><th>example</th></tr>
<tr><td>と</td><td>dictionary form + と</td><td>押す → 押すと</td></tr>
<tr><td>ば</td><td>I: u-row → e-row + ば; II: る → れば; い-adj: い → ければ</td><td>書く → 書けば, 食べる → 食べれば, 安い → 安ければ</td></tr>
<tr><td>たら</td><td>past (た) form + ら</td><td>書いた → 書いたら, 食べた → 食べたら</td></tr>
<tr><td>なら</td><td>plain form (noun/な-adj bare) + なら</td><td>行く → 行くなら, 温泉 → 温泉なら</td></tr>
</table>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>押します</td><td>oshimasu</td><td>to push / press</td></tr>
<tr><td>咲きます</td><td>sakimasu</td><td>to bloom</td></tr>
<tr><td>温泉</td><td>onsen</td><td>hot spring</td></tr>
<tr><td>おすすめ</td><td>osusume</td><td>recommendation</td></tr>
<tr><td>切符</td><td>kippu</td><td>ticket</td></tr>
</table>
<h3>The four uses side by side</h3>
<ul>
<li>この ボタンを 押すと、切符が 出ます。 (Kono botan o osu to, kippu ga demasu.) — If you press this button, a ticket comes out. (と: inevitable, natural result)</li>
<li>春に なれば、桜が 咲きます。 (Haru ni nareba, sakura ga sakimasu.) — When spring comes, the cherry blossoms bloom. (ば: general hypothesis)</li>
<li>日本へ 行ったら、温泉に 入りたいです。 (Nihon e ittara, onsen ni hairitai desu.) — When (if) I go to Japan, I want to visit a hot spring. (たら: one specific case)</li>
<li>温泉に 行くなら、箱根が おすすめです。 (Onsen ni iku nara, Hakone ga osusume desu.) — If you are going to a hot spring, Hakone is my recommendation. (なら: based on what you just said)</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 週末 京都へ 行きます。
   Shūmatsu Kyōto e ikimasu.
B: 京都へ 行くなら、お寺を 見た ほうが いいですよ。
   Kyōto e iku nara, otera o mita hō ga ii desu yo.
</code></pre>
<div class="callout"><span class="badge">Note</span> と = an inevitable, always-true result (never a request or will after it); ば = a general hypothesis, good for proverbs; たら = the most flexible, one specific event ("when/if"); なら = takes up what the other person said and usually leads to advice or an opinion.</div>`,
    `<span class="eyebrow">JPD326 · Bài 4</span>
<h2>So sánh bốn thể điều kiện</h2>
<h3>Cách chia từng thể</h3>
<table>
<tr><th>thể</th><th>quy tắc</th><th>ví dụ</th></tr>
<tr><td>と</td><td>thể từ điển + と</td><td>押す → 押すと</td></tr>
<tr><td>ば</td><td>I: hàng u → hàng e + ば; II: る → れば; tính từ い: い → ければ</td><td>書く → 書けば, 食べる → 食べれば, 安い → 安ければ</td></tr>
<tr><td>たら</td><td>thể quá khứ (た) + ら</td><td>書いた → 書いたら, 食べた → 食べたら</td></tr>
<tr><td>なら</td><td>thể thường (danh từ / tính từ な để trần) + なら</td><td>行く → 行くなら, 温泉 → 温泉なら</td></tr>
</table>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>押します</td><td>oshimasu</td><td>ấn, bấm</td></tr>
<tr><td>咲きます</td><td>sakimasu</td><td>(hoa) nở</td></tr>
<tr><td>温泉</td><td>onsen</td><td>suối nước nóng</td></tr>
<tr><td>おすすめ</td><td>osusume</td><td>gợi ý, khuyên dùng</td></tr>
<tr><td>切符</td><td>kippu</td><td>vé</td></tr>
</table>
<h3>Bốn cách dùng đặt cạnh nhau</h3>
<ul>
<li>この ボタンを 押すと、切符が 出ます。 (Kono botan o osu to, kippu ga demasu.) — Hễ bấm nút này thì vé ra. (と: kết quả tất yếu, tự nhiên)</li>
<li>春に なれば、桜が 咲きます。 (Haru ni nareba, sakura ga sakimasu.) — Cứ đến xuân là hoa anh đào nở. (ば: giả định chung)</li>
<li>日本へ 行ったら、温泉に 入りたいです。 (Nihon e ittara, onsen ni hairitai desu.) — Nếu (khi) đến Nhật, tôi muốn tắm suối nước nóng. (たら: một trường hợp cụ thể)</li>
<li>温泉に 行くなら、箱根が おすすめです。 (Onsen ni iku nara, Hakone ga osusume desu.) — Nếu định đi suối nước nóng thì Hakone là gợi ý của tôi. (なら: dựa trên điều vừa nghe)</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 週末 京都へ 行きます。
   Shūmatsu Kyōto e ikimasu.
B: 京都へ 行くなら、お寺を 見た ほうが いいですよ。
   Kyōto e iku nara, otera o mita hō ga ii desu yo.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> と = kết quả tất yếu, luôn đúng (vế sau không dùng lời nhờ hay ý chí); ば = giả định chung, hợp với tục ngữ; たら = linh hoạt nhất, một sự việc cụ thể ("khi/nếu"); なら = nhận lại điều người kia vừa nói và thường dẫn tới lời khuyên hay ý kiến.</div>`,
  ]]);

const b4q = quiz('jpd326-quiz-4', 'Quiz 4 — The four conditionals|||Quiz 4 — Bốn thể điều kiện', [
  { id: 'q1', question: 'Thể điều kiện nào diễn đạt kết quả TẤT YẾU, tự nhiên (vế sau không được là ý chí/mệnh lệnh)?|||Which conditional expresses an inevitable, natural result (no will or command after it)?', options: ['〜と', '〜たら', '〜なら', '〜ば (với ý chí)|||〜ば (with a will)'], correctIndex: 0, explanation: '〜と = kết quả tất yếu, tự nhiên; vế sau không dùng ý chí, mệnh lệnh hay lời nhờ.' },
  { id: 'q2', question: 'Thể điều kiện của 書く (ば) là gì?|||What is the ば-conditional of 書く?', options: ['書くば', '書けば', '書いたら', '書くなら'], correctIndex: 1, explanation: 'Nhóm I: hàng u → hàng e + ば, 書く → 書けば.' },
  { id: 'q3', question: 'Khi NHẬN LẠI điều người kia vừa nói rồi đưa lời khuyên, dùng thể nào?|||To pick up what the other person just said and give advice, which conditional?', options: ['〜と', '〜ば', '〜たら', '〜なら'], correctIndex: 3, explanation: '〜なら nhận lại đề tài từ lời người kia và thường dẫn tới lời khuyên/ý kiến: 京都へ 行くなら….' },
]);

const b5 = doc('jpd326-5-1-purpose', 'Lesson 5 — Purpose: ように & ため|||Bài 5 — Mục đích: ように & ため',
  '〜ように (mục đích với động từ vô ý chí / khả năng / phủ định); 〜ために (mục đích với động từ ý chí; nguyên nhân với danh từ) — phân biệt.',
  [[
    `<span class="eyebrow">JPD326 · Lesson 5</span>
<h2>Purpose: ように &amp; ため</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>健康</td><td>kenkō</td><td>health</td></tr>
<tr><td>合格します</td><td>gōkaku shimasu</td><td>to pass (an exam)</td></tr>
<tr><td>見えます</td><td>miemasu</td><td>to be visible / can see</td></tr>
<tr><td>治ります</td><td>naorimasu</td><td>to recover / be cured</td></tr>
<tr><td>伝えます</td><td>tsutaemasu</td><td>to convey / pass on a message</td></tr>
</table>
<h3>Grammar — 〜ように (purpose, non-volitional)</h3>
<p><strong>[potential / non-volitional / negative verb] + ように</strong> marks a goal you aim toward but do not directly control. The subject of the two clauses may differ.</p>
<ul>
<li>病気が 治るように、薬を 飲みます。 (Byōki ga naoru yō ni, kusuri o nomimasu.) — I take medicine so that the illness gets better.</li>
<li>忘れないように、メモします。 (Wasurenai yō ni, memo shimasu.) — I take notes so that I do not forget.</li>
</ul>
<h3>Grammar — 〜ために (purpose / cause)</h3>
<p><strong>[volitional dictionary verb] + ために</strong> = "in order to", when the same person controls both actions. <strong>[noun の] + ために</strong> = "for the sake of / because of".</p>
<ul>
<li>試験に 合格するために、毎日 勉強します。 (Shiken ni gōkaku suru tame ni, mainichi benkyō shimasu.) — I study every day in order to pass the exam.</li>
<li>健康の ために、運動します。 (Kenkō no tame ni, undō shimasu.) — I exercise for the sake of my health.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: どうして 毎朝 走っているんですか。
   Dōshite maiasa hashitte iru n desu ka.
B: やせるように、運動しているんです。
   Yaseru yō ni, undō shite iru n desu.
</code></pre>
<div class="callout"><span class="badge">Note</span> Use ために with a volitional verb and one subject (勉強するために). Use ように with a potential, negative or non-volitional verb, or when the subjects differ (治るように, 見えるように, 忘れないように). ため + a noun also gives a cause or benefit.</div>`,
    `<span class="eyebrow">JPD326 · Bài 5</span>
<h2>Mục đích: ように &amp; ため</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>健康</td><td>kenkō</td><td>sức khỏe</td></tr>
<tr><td>合格します</td><td>gōkaku shimasu</td><td>đỗ, đậu (kỳ thi)</td></tr>
<tr><td>見えます</td><td>miemasu</td><td>nhìn thấy được</td></tr>
<tr><td>治ります</td><td>naorimasu</td><td>khỏi (bệnh), lành</td></tr>
<tr><td>伝えます</td><td>tsutaemasu</td><td>truyền đạt, nhắn lại</td></tr>
</table>
<h3>Ngữ pháp — 〜ように (mục đích, vô ý chí)</h3>
<p><strong>[động từ khả năng / vô ý chí / phủ định] + ように</strong> đánh dấu một mục tiêu bạn hướng tới nhưng không trực tiếp điều khiển. Chủ thể hai vế có thể khác nhau.</p>
<ul>
<li>病気が 治るように、薬を 飲みます。 (Byōki ga naoru yō ni, kusuri o nomimasu.) — Tôi uống thuốc để bệnh khỏi.</li>
<li>忘れないように、メモします。 (Wasurenai yō ni, memo shimasu.) — Tôi ghi chú để khỏi quên.</li>
</ul>
<h3>Ngữ pháp — 〜ために (mục đích / nguyên nhân)</h3>
<p><strong>[động từ ý chí thể từ điển] + ために</strong> = "để, nhằm", khi cùng một người điều khiển cả hai hành động. <strong>[danh từ の] + ために</strong> = "vì, cho / do".</p>
<ul>
<li>試験に 合格するために、毎日 勉強します。 (Shiken ni gōkaku suru tame ni, mainichi benkyō shimasu.) — Tôi học mỗi ngày để đỗ kỳ thi.</li>
<li>健康の ために、運動します。 (Kenkō no tame ni, undō shimasu.) — Tôi tập thể dục vì sức khỏe.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: どうして 毎朝 走っているんですか。
   Dōshite maiasa hashitte iru n desu ka.
B: やせるように、運動しているんです。
   Yaseru yō ni, undō shite iru n desu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Dùng ために với động từ ý chí và cùng một chủ thể (勉強するために). Dùng ように với động từ khả năng, phủ định hay vô ý chí, hoặc khi chủ thể hai vế khác nhau (治るように, 見えるように, 忘れないように). ため + danh từ cũng nêu nguyên nhân hay lợi ích.</div>`,
  ]]);

const b5q = quiz('jpd326-quiz-5', 'Quiz 5 — Purpose|||Quiz 5 — Mục đích', [
  { id: 'q1', question: '"Uống thuốc ĐỂ bệnh khỏi" (治る là động từ vô ý chí) dùng mẫu nào?|||"Take medicine so the illness gets better" (治る is non-volitional) uses which pattern?', options: ['治るように', '治るために', '治るところ', '治るはず'], correctIndex: 0, explanation: 'Động từ vô ý chí / khả năng / phủ định → ように: 治るように.' },
  { id: 'q2', question: '"Học mỗi ngày ĐỂ đỗ kỳ thi" (cùng chủ thể, động từ ý chí) dùng mẫu nào?|||"Study every day in order to pass" (same subject, volitional) uses which pattern?', options: ['合格するように', '合格するために', '合格するなら', '合格するわけ'], correctIndex: 1, explanation: 'Động từ ý chí, cùng chủ thể → ために: 合格するために.' },
  { id: 'q3', question: '"Ghi chú để KHỎI quên" dùng mẫu nào?|||"Take notes so as NOT to forget" uses which pattern?', options: ['忘れるために', '忘れないために', '忘れないように', '忘れるところ'], correctIndex: 2, explanation: 'Với động từ phủ định dùng ように: 忘れないように.' },
]);

const b6 = doc('jpd326-6-1-keigo-system', 'Lesson 6 — The keigo system|||Bài 6 — Hệ thống kính ngữ',
  '尊敬語 (お〜になる, động từ đặc biệt); 謙譲語 (お〜する, 伺う/いたす); 丁寧語 (です/ます, ございます) — công thức chung.',
  [[
    `<span class="eyebrow">JPD326 · Lesson 6</span>
<h2>The keigo system (敬語)</h2>
<h3>The three types</h3>
<table>
<tr><th>type</th><th>function</th><th>general pattern</th></tr>
<tr><td>尊敬語 respectful</td><td>raises the OTHER person's action</td><td>お + [ます-stem] + になります</td></tr>
<tr><td>謙譲語 humble</td><td>lowers YOUR OWN action</td><td>お + [ます-stem] + します</td></tr>
<tr><td>丁寧語 polite</td><td>makes the sentence polite to anyone</td><td>です / ます / ございます</td></tr>
</table>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>伺います</td><td>ukagaimasu</td><td>to visit / ask (humble)</td></tr>
<tr><td>ご存じ</td><td>gozonji</td><td>to know (respectful)</td></tr>
<tr><td>承知しました</td><td>shōchi shimashita</td><td>understood / certainly (humble)</td></tr>
<tr><td>社長</td><td>shachō</td><td>company president</td></tr>
<tr><td>荷物</td><td>nimotsu</td><td>luggage / package</td></tr>
</table>
<h3>Respectful (尊敬語) — the other person</h3>
<p>General form <strong>お + [ます-stem] + になります</strong>; some verbs have special forms.</p>
<ul>
<li>社長は もう お帰りに なりました。 (Shachō wa mō okaeri ni narimashita.) — The president has already gone home.</li>
<li>田中先生を ご存じですか。 (Tanaka-sensei o gozonji desu ka.) — Do you know Professor Tanaka?</li>
</ul>
<h3>Humble (謙譲語) — yourself</h3>
<p>General form <strong>お + [ます-stem] + します</strong>; special verbs 伺う (visit), いたす (do), 申す (say).</p>
<ul>
<li>私が 荷物を お持ちします。 (Watashi ga nimotsu o omochi shimasu.) — Let me carry your luggage.</li>
<li>明日 3時に 伺います。 (Ashita san-ji ni ukagaimasu.) — I will visit you at three tomorrow.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 社長は いらっしゃいますか。
   Shachō wa irasshaimasu ka.
B: 申し訳 ありません。ただいま 席を 外して おります。
   Mōshiwake arimasen. Tadaima seki o hazushite orimasu.
</code></pre>
<div class="callout"><span class="badge">Note</span> 尊敬語 raises the other person's action (お〜になります or a special verb); 謙譲語 lowers your own (お〜します, 伺う, いたす); 丁寧語 (です/ます, ございます) is polite to anyone. Never use 尊敬語 for yourself or 謙譲語 for a superior's action.</div>`,
    `<span class="eyebrow">JPD326 · Bài 6</span>
<h2>Hệ thống kính ngữ (敬語)</h2>
<h3>Ba loại</h3>
<table>
<tr><th>loại</th><th>chức năng</th><th>công thức chung</th></tr>
<tr><td>尊敬語 tôn kính</td><td>nâng hành động của NGƯỜI KHÁC</td><td>お + [đuôi ます] + になります</td></tr>
<tr><td>謙譲語 khiêm nhường</td><td>hạ hành động của CHÍNH MÌNH</td><td>お + [đuôi ます] + します</td></tr>
<tr><td>丁寧語 lịch sự</td><td>làm câu lịch sự với mọi người</td><td>です / ます / ございます</td></tr>
</table>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>伺います</td><td>ukagaimasu</td><td>đến thăm / hỏi (khiêm nhường)</td></tr>
<tr><td>ご存じ</td><td>gozonji</td><td>biết (tôn kính)</td></tr>
<tr><td>承知しました</td><td>shōchi shimashita</td><td>tôi hiểu rồi ạ (khiêm nhường)</td></tr>
<tr><td>社長</td><td>shachō</td><td>giám đốc công ty</td></tr>
<tr><td>荷物</td><td>nimotsu</td><td>hành lý, kiện hàng</td></tr>
</table>
<h3>Tôn kính (尊敬語) — người khác</h3>
<p>Công thức chung <strong>お + [đuôi ます] + になります</strong>; một số động từ có dạng đặc biệt.</p>
<ul>
<li>社長は もう お帰りに なりました。 (Shachō wa mō okaeri ni narimashita.) — Giám đốc đã về rồi ạ.</li>
<li>田中先生を ご存じですか。 (Tanaka-sensei o gozonji desu ka.) — Ngài có biết thầy Tanaka không ạ?</li>
</ul>
<h3>Khiêm nhường (謙譲語) — bản thân</h3>
<p>Công thức chung <strong>お + [đuôi ます] + します</strong>; động từ đặc biệt 伺う (đến thăm), いたす (làm), 申す (nói).</p>
<ul>
<li>私が 荷物を お持ちします。 (Watashi ga nimotsu o omochi shimasu.) — Để tôi xách hành lý cho ạ.</li>
<li>明日 3時に 伺います。 (Ashita san-ji ni ukagaimasu.) — Mai 3 giờ tôi xin đến ạ.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 社長は いらっしゃいますか。
   Shachō wa irasshaimasu ka.
B: 申し訳 ありません。ただいま 席を 外して おります。
   Mōshiwake arimasen. Tadaima seki o hazushite orimasu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 尊敬語 nâng hành động của người khác (お〜になります hoặc động từ đặc biệt); 謙譲語 hạ hành động của mình (お〜します, 伺う, いたす); 丁寧語 (です/ます, ございます) lịch sự với mọi người. Đừng bao giờ dùng 尊敬語 cho mình hay 謙譲語 cho hành động của người trên.</div>`,
  ]]);

const b6q = quiz('jpd326-quiz-6', 'Quiz 6 — The keigo system|||Quiz 6 — Hệ thống kính ngữ', [
  { id: 'q1', question: 'Công thức chung của TÔN KÍNH (尊敬語) là gì?|||What is the general RESPECTFUL (尊敬語) pattern?', options: ['お + [đuôi ます] + します|||お + [ます-stem] + します', 'お + [đuôi ます] + になります|||お + [ます-stem] + になります', 'お + [đuôi ます] + ください|||お + [ます-stem] + ください', '[đuôi ます] + ましょう|||[ます-stem] + ましょう'], correctIndex: 1, explanation: 'Tôn kính: お + [đuôi ます] + になります (お帰りになります). Khiêm nhường mới là お〜します.' },
  { id: 'q2', question: 'Nói về hành động của CHÍNH MÌNH thì dùng loại kính ngữ nào?|||To speak of YOUR OWN action, which type of keigo?', options: ['尊敬語 (tôn kính)|||尊敬語 (respectful)', '謙譲語 (khiêm nhường)|||謙譲語 (humble)', '丁寧語 (lịch sự) một mình đủ|||丁寧語 (polite) alone', 'không dùng kính ngữ|||no keigo'], correctIndex: 1, explanation: 'Hành động của mình dùng 謙譲語 (お〜します, 伺う, いたす, 申す) để hạ mình tỏ kính.' },
  { id: 'q3', question: '伺います là dạng khiêm nhường của động từ nào?|||伺います is the humble form of which verb?', options: ['行きます / 来ます / 聞きます|||行きます / 来ます / 聞きます', '食べます / 飲みます', '見ます', 'します'], correctIndex: 0, explanation: '伺います = dạng khiêm nhường của 行きます / 来ます / 聞きます (đến / hỏi ai đó).' },
]);

const b7 = doc('jpd326-7-1-te-forms', 'Lesson 7 — Completion, preparation, result|||Bài 7 — Hoàn thành, chuẩn bị, trạng thái',
  '〜てしまう (làm xong trọn / lỡ, tiếc); 〜ておく (làm sẵn, chuẩn bị trước); 〜てある (trạng thái do ai đó cố ý làm).',
  [[
    `<span class="eyebrow">JPD326 · Lesson 7</span>
<h2>Completion, preparation, result</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>予約します</td><td>yoyaku shimasu</td><td>to reserve / book</td></tr>
<tr><td>なくします</td><td>nakushimasu</td><td>to lose (something)</td></tr>
<tr><td>飾ります</td><td>kazarimasu</td><td>to decorate / display</td></tr>
<tr><td>書類</td><td>shorui</td><td>documents</td></tr>
<tr><td>冷蔵庫</td><td>reizōko</td><td>refrigerator</td></tr>
</table>
<h3>Grammar — 〜てしまう (completion / regret)</h3>
<p><strong>[て-form] + しまいます</strong> = do completely, or do by accident with regret. Casual: 〜ちゃう / 〜じゃう.</p>
<ul>
<li>宿題は もう やってしまいました。 (Shukudai wa mō yatte shimaimashita.) — I have already finished all the homework.</li>
<li>大事な 書類を なくしてしまいました。 (Daiji na shorui o nakushite shimaimashita.) — I accidentally lost an important document.</li>
</ul>
<h3>Grammar — 〜ておく (prepare in advance)</h3>
<p><strong>[て-form] + おきます</strong> = do something in advance, or leave something as it is. Casual: 〜とく.</p>
<ul>
<li>旅行の 前に、ホテルを 予約しておきます。 (Ryokō no mae ni, hoteru o yoyaku shite okimasu.) — Before the trip, I will book the hotel in advance.</li>
<li>ビールを 冷蔵庫に 入れておきました。 (Bīru o reizōko ni irete okimashita.) — I put the beer in the fridge (ready).</li>
</ul>
<h3>Grammar — 〜てある (result of a deliberate action)</h3>
<p><strong>[transitive て-form] + あります</strong> = a state that remains because someone did it on purpose; the object takes が.</p>
<ul>
<li>机の 上に 花が 飾ってあります。 (Tsukue no ue ni hana ga kazatte arimasu.) — Flowers are displayed on the desk (someone arranged them).</li>
<li>窓が 開けてあります。 (Mado ga akete arimasu.) — The window has been (deliberately) left open.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 会議の 準備は?
   Kaigi no junbi wa?
B: 資料は もう 印刷してあります。
   Shiryō wa mō insatsu shite arimasu.
</code></pre>
<div class="callout"><span class="badge">Note</span> 〜てしまう = finished completely, or an accidental action you regret; 〜ておく = done ahead of time to prepare; 〜てある = a lasting state from a deliberate transitive action (subject が). Contrast 〜てある with 〜ている, which describes an ongoing action or an intransitive result.</div>`,
    `<span class="eyebrow">JPD326 · Bài 7</span>
<h2>Hoàn thành, chuẩn bị, trạng thái</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>予約します</td><td>yoyaku shimasu</td><td>đặt chỗ, đặt trước</td></tr>
<tr><td>なくします</td><td>nakushimasu</td><td>làm mất (đồ)</td></tr>
<tr><td>飾ります</td><td>kazarimasu</td><td>trang trí, trưng bày</td></tr>
<tr><td>書類</td><td>shorui</td><td>giấy tờ, tài liệu</td></tr>
<tr><td>冷蔵庫</td><td>reizōko</td><td>tủ lạnh</td></tr>
</table>
<h3>Ngữ pháp — 〜てしまう (hoàn thành / tiếc nuối)</h3>
<p><strong>[thể て] + しまいます</strong> = làm xong trọn vẹn, hoặc lỡ làm và tiếc. Khẩu ngữ: 〜ちゃう / 〜じゃう.</p>
<ul>
<li>宿題は もう やってしまいました。 (Shukudai wa mō yatte shimaimashita.) — Bài tập tôi đã làm xong hết rồi.</li>
<li>大事な 書類を なくしてしまいました。 (Daiji na shorui o nakushite shimaimashita.) — Tôi lỡ làm mất tài liệu quan trọng.</li>
</ul>
<h3>Ngữ pháp — 〜ておく (chuẩn bị trước)</h3>
<p><strong>[thể て] + おきます</strong> = làm sẵn từ trước, hoặc để nguyên như vậy. Khẩu ngữ: 〜とく.</p>
<ul>
<li>旅行の 前に、ホテルを 予約しておきます。 (Ryokō no mae ni, hoteru o yoyaku shite okimasu.) — Trước chuyến đi, tôi đặt khách sạn trước.</li>
<li>ビールを 冷蔵庫に 入れておきました。 (Bīru o reizōko ni irete okimashita.) — Tôi đã cho bia vào tủ lạnh (sẵn).</li>
</ul>
<h3>Ngữ pháp — 〜てある (trạng thái do cố ý làm)</h3>
<p><strong>[tha động từ thể て] + あります</strong> = trạng thái còn lại vì ai đó đã cố ý làm; tân ngữ đi với が.</p>
<ul>
<li>机の 上に 花が 飾ってあります。 (Tsukue no ue ni hana ga kazatte arimasu.) — Trên bàn có hoa được cắm sẵn (ai đó đã cắm).</li>
<li>窓が 開けてあります。 (Mado ga akete arimasu.) — Cửa sổ đã được mở (cố ý để mở).</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 会議の 準備は?
   Kaigi no junbi wa?
B: 資料は もう 印刷してあります。
   Shiryō wa mō insatsu shite arimasu.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> 〜てしまう = làm xong trọn, hoặc lỡ tay và tiếc; 〜ておく = làm sẵn từ trước để chuẩn bị; 〜てある = trạng thái còn lại từ một tha động từ cố ý (chủ thể が). So sánh 〜てある với 〜ている vốn tả hành động đang diễn ra hoặc kết quả của tự động từ.</div>`,
  ]]);

const b7q = quiz('jpd326-quiz-7', 'Quiz 7 — Completion & preparation|||Quiz 7 — Hoàn thành & chuẩn bị', [
  { id: 'q1', question: '"Tôi LỠ làm mất tài liệu quan trọng" (tiếc nuối) dùng mẫu nào?|||"I accidentally lost an important document" (regret) uses which pattern?', options: ['なくしておきました', 'なくしてしまいました', 'なくしてあります', 'なくしているところです'], correctIndex: 1, explanation: '〜てしまう mang sắc thái lỡ tay, tiếc nuối: なくしてしまいました.' },
  { id: 'q2', question: '"Đặt khách sạn TRƯỚC (để chuẩn bị)" dùng mẫu nào?|||"Book the hotel in advance" uses which pattern?', options: ['予約しておきます', '予約してしまいます', '予約してあります', '予約するところです'], correctIndex: 0, explanation: '〜ておく = làm sẵn từ trước để chuẩn bị: 予約しておきます.' },
  { id: 'q3', question: '"Trên bàn có hoa được cắm sẵn (ai đó cố ý cắm)" dùng mẫu nào?|||"Flowers are displayed on the desk (someone arranged them)" uses which pattern?', options: ['飾っています', '飾ってしまいました', '飾ってあります', '飾っておきます'], correctIndex: 2, explanation: '〜てある = trạng thái còn lại từ tha động từ cố ý; tân ngữ đi với が: 花が 飾ってあります.' },
]);

const b8 = doc('jpd326-8-1-reporting-conjecture', 'Lesson 8 — Reporting & conjecture|||Bài 8 — Truyền đạt & suy đoán',
  '〜そうだ (nghe nói / trông có vẻ); 〜ようだ (phán đoán từ quan sát, so sánh); 〜らしい (suy đoán từ tin nghe được); 〜みたい (khẩu ngữ của ようだ).',
  [[
    `<span class="eyebrow">JPD326 · Lesson 8</span>
<h2>Reporting &amp; conjecture</h2>
<h3>Vocabulary</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>meaning</th></tr>
<tr><td>台風</td><td>taifū</td><td>typhoon</td></tr>
<tr><td>熱</td><td>netsu</td><td>fever</td></tr>
<tr><td>顔色</td><td>kaoiro</td><td>complexion / look of one's face</td></tr>
<tr><td>人形</td><td>ningyō</td><td>doll</td></tr>
<tr><td>まるで</td><td>marude</td><td>just like / as if</td></tr>
</table>
<h3>Grammar — 〜そうだ (hearsay vs appearance)</h3>
<p><strong>[plain form] + そうです</strong> = hearsay (noun / な-adjective adds だ). <strong>[ます-stem / adjective-stem] + そうです</strong> = it looks like (a visual guess).</p>
<ul>
<li>天気予報に よると、台風が 来るそうです。 (Tenki yohō ni yoru to, taifū ga kuru sō desu.) — According to the forecast, a typhoon is coming. (hearsay)</li>
<li>空が 暗いです。雨が 降りそうです。 (Sora ga kurai desu. Ame ga furisō desu.) — The sky is dark. It looks like it will rain. (appearance)</li>
</ul>
<h3>Grammar — 〜ようだ / 〜みたい (judgment &amp; simile)</h3>
<p><strong>[plain form] + ようです</strong> = a judgment from your own observation (noun の, な-adj な); it also makes a simile with まるで. <strong>〜みたい</strong> is the casual form of ようだ (attaches directly to a noun).</p>
<ul>
<li>彼は 熱が あるようです。顔色が 悪いです。 (Kare wa netsu ga aru yō desu. Kaoiro ga warui desu.) — He seems to have a fever; he looks pale.</li>
<li>あの 人形は まるで 生きているみたいです。 (Ano ningyō wa marude ikite iru mitai desu.) — That doll is just like a living thing.</li>
</ul>
<h3>Grammar — 〜らしい (inference from information)</h3>
<p><strong>[plain form] + らしい</strong> = a guess based on information you received (attaches directly to a noun).</p>
<ul>
<li>田中さんは 会社を やめたらしいです。 (Tanaka-san wa kaisha o yameta rashii desu.) — Apparently Tanaka has quit the company.</li>
</ul>
<h3>Short dialogue</h3>
<pre><code>A: 田中さん、元気が ないですね。
   Tanaka-san, genki ga nai desu ne.
B: かぜを ひいたようですよ。
   Kaze o hiita yō desu yo.
</code></pre>
<div class="callout"><span class="badge">Note</span> そうです: 台風が 来るそうです (I hear it will come — plain + そう) vs 雨が 降りそうです (it looks about to rain — stem + そう). ようです / みたい come from your own observation (みたい is casual); らしい comes from information you received.</div>`,
    `<span class="eyebrow">JPD326 · Bài 8</span>
<h2>Truyền đạt &amp; suy đoán</h2>
<h3>Từ vựng</h3>
<table>
<tr><th>日本語</th><th>romaji</th><th>nghĩa</th></tr>
<tr><td>台風</td><td>taifū</td><td>bão</td></tr>
<tr><td>熱</td><td>netsu</td><td>sốt</td></tr>
<tr><td>顔色</td><td>kaoiro</td><td>sắc mặt</td></tr>
<tr><td>人形</td><td>ningyō</td><td>búp bê</td></tr>
<tr><td>まるで</td><td>marude</td><td>cứ như là</td></tr>
</table>
<h3>Ngữ pháp — 〜そうだ (nghe nói và trông có vẻ)</h3>
<p><strong>[thể thường] + そうです</strong> = nghe nói (danh từ / tính từ な thêm だ). <strong>[đuôi ます / gốc tính từ] + そうです</strong> = trông có vẻ (đoán qua quan sát).</p>
<ul>
<li>天気予報に よると、台風が 来るそうです。 (Tenki yohō ni yoru to, taifū ga kuru sō desu.) — Theo dự báo, bão sắp đến. (nghe nói)</li>
<li>空が 暗いです。雨が 降りそうです。 (Sora ga kurai desu. Ame ga furisō desu.) — Trời tối rồi. Có vẻ sắp mưa. (quan sát)</li>
</ul>
<h3>Ngữ pháp — 〜ようだ / 〜みたい (phán đoán &amp; so sánh)</h3>
<p><strong>[thể thường] + ようです</strong> = phán đoán từ quan sát của chính mình (danh từ の, tính từ な thêm な); cũng dùng so sánh với まるで. <strong>〜みたい</strong> là dạng khẩu ngữ của ようだ (gắn thẳng vào danh từ).</p>
<ul>
<li>彼は 熱が あるようです。顔色が 悪いです。 (Kare wa netsu ga aru yō desu. Kaoiro ga warui desu.) — Anh ấy có vẻ bị sốt; sắc mặt xấu.</li>
<li>あの 人形は まるで 生きているみたいです。 (Ano ningyō wa marude ikite iru mitai desu.) — Con búp bê kia cứ như đang sống vậy.</li>
</ul>
<h3>Ngữ pháp — 〜らしい (suy đoán từ thông tin)</h3>
<p><strong>[thể thường] + らしい</strong> = suy đoán dựa trên thông tin nghe được (gắn thẳng vào danh từ).</p>
<ul>
<li>田中さんは 会社を やめたらしいです。 (Tanaka-san wa kaisha o yameta rashii desu.) — Nghe nói anh Tanaka đã nghỉ việc.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 田中さん、元気が ないですね。
   Tanaka-san, genki ga nai desu ne.
B: かぜを ひいたようですよ。
   Kaze o hiita yō desu yo.
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> そうです: 台風が 来るそうです (nghe nói bão đến — thể thường + そう) với 雨が 降りそうです (trông sắp mưa — gốc + そう). ようです / みたい từ quan sát của bản thân (みたい là khẩu ngữ); らしい từ thông tin nghe được.</div>`,
  ]]);

const b8q = quiz('jpd326-quiz-8', 'Quiz 8 — Reporting & conjecture|||Quiz 8 — Truyền đạt & suy đoán', [
  { id: 'q1', question: '"Theo dự báo, bão sắp đến" (NGHE NÓI) dùng mẫu nào?|||"According to the forecast, a typhoon is coming" (hearsay) uses which pattern?', options: ['台風が 来るそうです', '台風が 来そうです', '台風が 来るようです', '台風が 来るらしくないです'], correctIndex: 0, explanation: 'Nghe nói: [thể thường] + そうです → 来るそうです. (来そうです là "trông sắp đến", gốc + そう.)' },
  { id: 'q2', question: '〜みたい là dạng gì của mẫu nào?|||〜みたい is which form of which pattern?', options: ['dạng trang trọng của そうだ|||the formal form of そうだ', 'dạng khẩu ngữ của ようだ|||the casual form of ようだ', 'dạng phủ định của らしい|||the negative of らしい', 'dạng quá khứ của です|||the past of です'], correctIndex: 1, explanation: '〜みたい là dạng khẩu ngữ của ようだ, gắn thẳng vào danh từ.' },
  { id: 'q3', question: 'Suy đoán dựa trên THÔNG TIN NGHE ĐƯỢC (không phải quan sát trực tiếp) dùng mẫu nào?|||A guess based on information you RECEIVED uses which pattern?', options: ['〜そうだ (gốc + そう)|||〜そうだ (stem + そう)', '〜ようだ', '〜らしい', '〜ところだ'], correctIndex: 2, explanation: '〜らしい = suy đoán từ thông tin nghe được; ようだ mới là từ quan sát của chính mình.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'JPD326',
    slug: 'jpd326-intermediate-japanese-2-b21',
    title: 'Intermediate Japanese 2-B2.1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JPD326.webp',
    shortDescription: 'Intermediate Japanese 2 (B2.1, JLPT N3), continuing JPD226 — recent & imminent actions, certainty & explanation, formal relations, the four conditionals, purpose, keigo, the extended て-forms, and reporting. Bilingual, with quizzes.|||Tiếng Nhật trung cấp 2 (B2.1, JLPT N3), nối tiếp JPD226 — vừa/sắp làm, chắc chắn & giải thích, quan hệ trang trọng, bốn thể điều kiện, mục đích, kính ngữ, các thể 〜て mở rộng, và truyền đạt. Song ngữ, có quiz.',
    description: 'Môn <strong>JPD326 — Intermediate Japanese 2 (Tiếng Nhật trung cấp 2, B2.1)</strong> thuộc khối Ngôn ngữ Nhật FPTU, Kỳ 3, <strong>nối tiếp JPD226</strong> và bước hẳn vào ngữ pháp <strong>JLPT N3</strong> (中級). Bám giáo trình chuẩn <em>Minna no Nihongo Chukyu I / Tobira (đầu)</em>, trọng tâm là chọn giữa các mẫu gần nghĩa: <strong>vừa mới &amp; sắp làm</strong> (〜ばかり, 〜ところ) → <strong>chắc chắn &amp; giải thích</strong> (〜はず, 〜わけ) → <strong>tùy theo / tại / với tư cách</strong> (〜による, 〜において, 〜として) → <strong>bốn thể điều kiện</strong> (と・ば・たら・なら) → <strong>mục đích</strong> (〜ように, 〜ために) → <strong>hệ thống kính ngữ</strong> (尊敬語 / 謙譲語 / 丁寧語) → <strong>hoàn thành, chuẩn bị, trạng thái</strong> (〜てしまう, 〜ておく, 〜てある) → <strong>truyền đạt &amp; suy đoán</strong> (〜そうだ, 〜ようだ, 〜らしい, 〜みたい). Mỗi bài có từ vựng, ngữ pháp, hội thoại và quiz; song ngữ Nhật-Việt.',
    whatYouLearn: 'Định vị thời điểm hành động bằng 〜たばかり / 〜ところ; nêu sự chắc chắn có căn cứ 〜はず và kết luận logic 〜わけ (kể cả 〜わけにはいかない); dùng các quan hệ trang trọng 〜によって / 〜において / 〜として; phân biệt &amp; dùng đúng bốn thể điều kiện と・ば・たら・なら; đánh dấu mục đích chính xác với 〜ように (vô ý chí) và 〜ために (ý chí); nắm toàn bộ hệ thống kính ngữ — tôn kính (お〜になる), khiêm nhường (お〜する, 伺う, いたす) và lịch sự (です/ます, ございます); diễn đạt hoàn thành 〜てしまう, chuẩn bị 〜ておく và trạng thái 〜てある; truyền đạt &amp; suy đoán bằng 〜そうだ / 〜ようだ / 〜らしい / 〜みたい.',
    requirements: 'Cần đã học <strong>JPD226 (Pre-Intermediate Japanese 2)</strong> hoặc tương đương (JLPT N4): chia thành thạo thể bị động, thể sai khiến, thể sai khiến-bị động và các động từ kính ngữ đặc biệt. Nên dùng app thẻ ghi nhớ (Anki) để luyện từ vựng N3 &amp; các cặp mẫu dễ nhầm mỗi ngày.',
  },
  sections: [
    { title: '📚 Tài liệu & lộ trình|||📚 Materials & path', description: 'Giáo trình, app, từ điển, lộ trình 4 bước cho N3.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp JPD226, mục tiêu N3 vững, trọng tâm chọn giữa các mẫu gần nghĩa.', lessons: [intro] },
    { title: 'Bài 1 — Vừa mới & sắp làm|||Lesson 1 — Recent & imminent', description: '〜ばかり, 〜ところ.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Chắc chắn & giải thích|||Lesson 2 — Certainty & explanation', description: '〜はず, 〜わけ, 〜わけにはいかない.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Tùy theo, tại, với tư cách|||Lesson 3 — Depending on, at, as', description: '〜による, 〜において, 〜として.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Bốn thể điều kiện|||Lesson 4 — The four conditionals', description: 'と・ば・たら・なら.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Mục đích|||Lesson 5 — Purpose', description: '〜ように, 〜ために.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Hệ thống kính ngữ|||Lesson 6 — The keigo system', description: '尊敬語 / 謙譲語 / 丁寧語.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Hoàn thành, chuẩn bị, trạng thái|||Lesson 7 — Completion & preparation', description: '〜てしまう, 〜ておく, 〜てある.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Truyền đạt & suy đoán|||Lesson 8 — Reporting & conjecture', description: '〜そうだ, 〜ようだ, 〜らしい, 〜みたい.', lessons: [b8, b8q] },
  ],
};
