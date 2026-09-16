/**
 * JST301 — Japanese Translation and Interpretation Skills (Kỹ năng Biên-Phiên
 * dịch tiếng Nhật). Ngành Ngôn ngữ Nhật, Kỳ 5. Trình độ JLPT N3-N2.
 * Tham khảo: 日越翻訳の理論と実践 (Japanese-Vietnamese Translation); 通訳翻訳入門;
 * tài liệu JLPT N2. 8 chương lý thuyết + ví dụ dịch song ngữ 日本語→Việt, mỗi
 * chương 1 tài liệu + 1 quiz. Song ngữ EN/VN (.ml-en/.ml-vi). KHÔNG upload PDF.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

/* ══════════════════ Chương 1 — Tổng quan dịch thuật & tiêu chí tín-đạt-nhã ══════════════════ */
const c1 = doc('jst301-1-1-overview-criteria', '1.1 — Translation overview & the tín-đạt-nhã criteria|||1.1 — Tổng quan dịch thuật & tiêu chí tín-đạt-nhã',
  'Dịch là gì; biên dịch vs phiên dịch; ba tiêu chí tín (信) - đạt (達) - nhã (雅); ví dụ ba bản dịch cho cùng một câu.',
  [[
    `<span class="eyebrow">JST301 · Chapter 1 · Lesson 1.1</span>
<h2>Translation overview &amp; the tín-đạt-nhã criteria</h2>
<p class="lead">Translation (<strong>翻訳, honyaku</strong>) turns a source-language text into a target-language text while keeping its meaning, tone and effect. Japanese→Vietnamese translation is never word-for-word substitution — it is <strong>reconstructing meaning</strong> across two very different grammars.</p>
<h3>Biên dịch (translation) vs phiên dịch (interpretation)</h3>
<ul>
<li><strong>Biên dịch — 翻訳 (honyaku)</strong> — written text; there is time to revise and polish.</li>
<li><strong>Phiên dịch — 通訳 (tsūyaku)</strong> — spoken, real time; no chance to redo it.</li>
</ul>
<h3>The three classical criteria: tín (信) - đạt (達) - nhã (雅)</h3>
<p>Coined by the scholar Nghiêm Phục (厳復, Yan Fu), still the working standard for Japanese-Vietnamese translators:</p>
<ul>
<li><strong>Tín (信, faithfulness)</strong> — accurate to the source meaning; nothing added, nothing dropped.</li>
<li><strong>Đạt (達, fluency)</strong> — reads naturally in the target language, not "translationese".</li>
<li><strong>Nhã (雅, elegance)</strong> — matches the register and style of the original.</li>
</ul>
<h3>Worked example — one sentence, three drafts</h3>
<pre><code>Source (JA): 田中さんは毎朝早く起きて、会社に行く前にコーヒーを飲みます。
Romaji:      Tanaka-san wa maiasa hayaku okite, kaisha ni iku mae ni kōhī o nomimasu.

Draft 1 (tín only, giữ nguyên trật tự Nhật):
  "Tanaka thì mỗi sáng sớm dậy, trước khi đi công ty thì uống cà phê."
  -&gt; đúng nghĩa nhưng lủng củng, còn vết ngữ pháp tiếng Nhật.

Draft 2 (tín + đạt):
  "Sáng nào anh Tanaka cũng dậy sớm, uống cà phê rồi mới đi làm."
  -&gt; đúng nghĩa, câu tiếng Việt tự nhiên.

Draft 3 (tín + đạt + nhã, văn phong trang trọng hơn):
  "Mỗi sáng, ông Tanaka đều dậy sớm và dùng cà phê trước khi đến công ty."
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc xuyên suốt môn</span> Không có bản dịch "đúng duy nhất" — chỉ có bản dịch phù hợp hơn với văn cảnh, đối tượng đọc và mục đích. JST301 luyện bạn chọn phương án phù hợp nhất trong từng tình huống.</div>`,
    `<span class="eyebrow">JST301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan dịch thuật &amp; tiêu chí tín-đạt-nhã</h2>
<p class="lead">Dịch thuật (<strong>翻訳, honyaku</strong>) là chuyển một văn bản từ ngôn ngữ nguồn sang ngôn ngữ đích mà vẫn giữ được nghĩa, giọng điệu và hiệu quả. Dịch Nhật-Việt không phải là thay từng từ — đó là <strong>dựng lại nghĩa</strong> giữa hai hệ ngữ pháp rất khác nhau.</p>
<h3>Biên dịch và phiên dịch</h3>
<ul>
<li><strong>Biên dịch — 翻訳 (honyaku)</strong> — văn bản viết, có thời gian sửa lại và trau chuốt.</li>
<li><strong>Phiên dịch — 通訳 (tsūyaku)</strong> — nói trực tiếp, tức thời, không có cơ hội làm lại.</li>
</ul>
<h3>Ba tiêu chí kinh điển: tín (信) - đạt (達) - nhã (雅)</h3>
<p>Do học giả Nghiêm Phục (厳復, Yan Fu) đề ra, vẫn là chuẩn làm việc của người dịch Nhật-Việt:</p>
<ul>
<li><strong>Tín (信)</strong> — trung thành với nghĩa gốc; không thêm, không bớt.</li>
<li><strong>Đạt (達)</strong> — đọc tự nhiên ở ngôn ngữ đích; không phải "văn dịch".</li>
<li><strong>Nhã (雅)</strong> — đúng văn phong, sắc thái của bản gốc.</li>
</ul>
<h3>Ví dụ minh họa — một câu, ba bản nháp</h3>
<pre><code>Nguồn (JA): 田中さんは毎朝早く起きて、会社に行く前にコーヒーを飲みます。
Romaji:     Tanaka-san wa maiasa hayaku okite, kaisha ni iku mae ni kōhī o nomimasu.

Bản 1 (chỉ tín, giữ nguyên trật tự Nhật):
  "Tanaka thì mỗi sáng sớm dậy, trước khi đi công ty thì uống cà phê."
  -&gt; đúng nghĩa nhưng lủng củng, còn vết ngữ pháp tiếng Nhật.

Bản 2 (tín + đạt):
  "Sáng nào anh Tanaka cũng dậy sớm, uống cà phê rồi mới đi làm."
  -&gt; đúng nghĩa, câu tiếng Việt tự nhiên.

Bản 3 (tín + đạt + nhã, trang trọng hơn):
  "Mỗi sáng, ông Tanaka đều dậy sớm và dùng cà phê trước khi đến công ty."
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc xuyên suốt môn</span> Không có bản dịch "đúng duy nhất" — chỉ có bản dịch phù hợp hơn với văn cảnh, đối tượng đọc và mục đích. Toàn môn JST301 luyện bạn chọn được phương án phù hợp nhất.</div>`,
  ]]);

const c1q = quiz('jst301-quiz-1', 'Quiz 1 — Overview & criteria|||Quiz 1 — Tổng quan & tiêu chí', [
  { id: 'q1', question: "Tiêu chí 'tín' (信) trong dịch thuật nghĩa là gì?", options: ['Trung thành với nghĩa gốc, không thêm bớt', 'Đọc tự nhiên như văn bản gốc ngữ', 'Đúng văn phong, sắc thái', 'Dịch càng nhanh càng tốt'], correctIndex: 0, explanation: "Tín (信) = trung thành với nghĩa gốc; đạt (達) mới là đọc tự nhiên, nhã (雅) là đúng văn phong." },
  { id: 'q2', question: 'Phiên dịch (通訳) khác biên dịch (翻訳) chủ yếu ở điểm nào?', options: ['Phiên dịch là văn bản viết, có thời gian sửa', 'Phiên dịch diễn ra tức thời, nói trực tiếp, không có cơ hội sửa', 'Biên dịch luôn khó hơn phiên dịch', 'Không có khác biệt nào'], correctIndex: 1, explanation: 'Biên dịch (honyaku) là văn bản viết có thời gian trau chuốt; phiên dịch (tsūyaku) là nói, tức thời.' },
  { id: 'q3', question: "Một câu dịch 'đúng nghĩa nhưng lủng củng, còn vết ngữ pháp tiếng Nhật' thường đang thiếu tiêu chí nào?", options: ['Tín (信)', 'Đạt (達)', 'Nhã (雅)', 'Cả ba tiêu chí'], correctIndex: 1, explanation: 'Câu đúng nghĩa (đạt tín) nhưng đọc không tự nhiên là thiếu đạt (達, fluency) — cần diễn đạt lại theo cách nói tiếng Việt.' },
]);

/* ══════════════════ Chương 2 — Khác biệt cấu trúc Nhật-Việt & SOV→SVO ══════════════════ */
const c2 = doc('jst301-2-1-word-order', '2.1 — Structural differences & reordering (SOV → SVO)|||2.1 — Khác biệt cấu trúc Nhật-Việt & điều chỉnh trật tự SOV→SVO',
  'Tiếng Nhật SOV, động từ cuối câu, trợ từ đánh dấu vai trò ngữ pháp; mệnh đề bổ nghĩa đứng trước danh từ; lược chủ ngữ. Cách đảo trật tự khi dịch sang tiếng Việt (SVO).',
  [[
    `<span class="eyebrow">JST301 · Chapter 2 · Lesson 2.1</span>
<h2>Structural differences &amp; reordering (SOV → SVO)</h2>
<h3>Two very different skeletons</h3>
<ul>
<li><strong>Japanese — SOV</strong>, verb always at the end; grammatical roles are marked by particles (助詞: が/を/に/で…) rather than word order, so word order itself is flexible before the verb.</li>
<li><strong>Vietnamese — SVO</strong>, an analytic language with fixed word order and no particles doing that job — order itself carries the grammar.</li>
</ul>
<h3>Modifiers come BEFORE the noun in Japanese</h3>
<p>A whole relative clause sits in front of the noun it modifies in Japanese; Vietnamese puts it AFTER the noun, joined with "mà".</p>
<pre><code>Source (JA): 昨日、友達が私にくれた本はとても面白かった。
Romaji:      Kinō, tomodachi ga watashi ni kureta hon wa totemo omoshirokatta.

Structure:  [友達が私にくれた] 本 は とても面白かった
             (relative clause)  N  (topic) (very interesting-PAST)

Literal, word order kept:
  "Hôm qua, bạn tôi tặng tôi cuốn sách rất thú vị." -&gt; nghĩa mơ hồ.

Reordered for Vietnamese (relative clause moves AFTER the noun):
  "Cuốn sách mà hôm qua bạn tôi tặng tôi rất thú vị."
</code></pre>
<h3>Subject/object omission (pro-drop)</h3>
<p>Japanese freely omits a subject or object recoverable from context; Vietnamese usually needs it restored for the sentence to stand on its own.</p>
<pre><code>Source (JA): (私は)明日、日本へ行きます。
Romaji:      (Watashi wa) ashita, Nihon e ikimasu.
Translation: "Ngày mai, tôi sẽ đi Nhật Bản." (chủ ngữ "tôi" được bổ sung từ ngữ cảnh)
</code></pre>
<div class="callout"><span class="badge">Quy trình dịch câu Nhật</span> (1) Xác định trợ từ để biết ai làm gì với ai; (2) tìm động từ cuối câu để biết hành động chính; (3) suy ra thành phần bị lược từ ngữ cảnh; (4) sắp lại theo trật tự SVO của tiếng Việt.</div>`,
    `<span class="eyebrow">JST301 · Chương 2 · Bài 2.1</span>
<h2>Khác biệt cấu trúc Nhật-Việt &amp; điều chỉnh trật tự (SOV → SVO)</h2>
<h3>Hai bộ khung câu rất khác nhau</h3>
<ul>
<li><strong>Tiếng Nhật — SOV</strong>, động từ luôn đứng cuối câu; vai trò ngữ pháp được đánh dấu bằng trợ từ (助詞: が/を/に/で…) chứ không phải vị trí, nên trật tự trước động từ khá linh hoạt.</li>
<li><strong>Tiếng Việt — SVO</strong>, ngôn ngữ đơn lập, trật tự từ cố định và không có trợ từ làm việc đó — chính trật tự mang chức năng ngữ pháp.</li>
</ul>
<h3>Mệnh đề bổ nghĩa đứng TRƯỚC danh từ trong tiếng Nhật</h3>
<p>Cả một mệnh đề quan hệ đứng trước danh từ mà nó bổ nghĩa trong tiếng Nhật; tiếng Việt đặt nó SAU danh từ, nối bằng "mà".</p>
<pre><code>Nguồn (JA): 昨日、友達が私にくれた本はとても面白かった。
Romaji:     Kinō, tomodachi ga watashi ni kureta hon wa totemo omoshirokatta.

Cấu trúc:  [友達が私にくれた] 本 は とても面白かった
            (mệnh đề quan hệ)  DT  (chủ đề) (rất thú vị-QK)

Dịch giữ nguyên trật tự (SAI tự nhiên):
  "Hôm qua, bạn tôi tặng tôi cuốn sách rất thú vị." -&gt; nghĩa mơ hồ.

Đảo trật tự cho tiếng Việt (mệnh đề quan hệ chuyển ra SAU danh từ):
  "Cuốn sách mà hôm qua bạn tôi tặng tôi rất thú vị."
</code></pre>
<h3>Lược chủ ngữ/tân ngữ (pro-drop)</h3>
<p>Tiếng Nhật thoải mái lược chủ ngữ hoặc tân ngữ có thể suy ra từ ngữ cảnh; tiếng Việt thường cần khôi phục lại để câu tự đứng vững được.</p>
<pre><code>Nguồn (JA): (私は)明日、日本へ行きます。
Romaji:     (Watashi wa) ashita, Nihon e ikimasu.
Bản dịch:   "Ngày mai, tôi sẽ đi Nhật Bản." (chủ ngữ "tôi" được bổ sung từ ngữ cảnh)
</code></pre>
<div class="callout"><span class="badge">Quy trình dịch câu Nhật</span> (1) Xác định trợ từ để biết ai làm gì với ai; (2) tìm động từ cuối câu để biết hành động chính; (3) suy ra thành phần bị lược từ ngữ cảnh; (4) sắp lại theo trật tự SVO của tiếng Việt.</div>`,
  ]]);

const c2q = quiz('jst301-quiz-2', 'Quiz 2 — Word order|||Quiz 2 — Trật tự câu', [
  { id: 'q1', question: 'Tiếng Nhật có trật tự câu cơ bản nào?', options: ['SVO', 'SOV', 'VSO', 'OSV'], correctIndex: 1, explanation: 'Tiếng Nhật là ngôn ngữ SOV — động từ luôn đứng cuối câu.' },
  { id: 'q2', question: "Trong câu 友達が私にくれた本, mệnh đề quan hệ '友達が私にくれた' đứng ở đâu so với danh từ 本 (sách) khi dịch sang tiếng Việt?", options: ['Vẫn đứng trước danh từ như tiếng Nhật', "Chuyển ra SAU danh từ, nối bằng 'mà'", 'Bỏ hẳn mệnh đề quan hệ', 'Tách thành câu riêng không liên quan'], correctIndex: 1, explanation: "Tiếng Nhật đặt mệnh đề bổ nghĩa trước danh từ trung tâm; tiếng Việt phải đảo ra sau, nối bằng 'mà'." },
  { id: 'q3', question: 'Khi câu tiếng Nhật lược chủ ngữ (vd (私は)日本へ行きます), người dịch nên làm gì?', options: ['Bỏ trống chủ ngữ trong bản dịch tiếng Việt', 'Suy ra chủ ngữ từ ngữ cảnh và bổ sung khi cần', 'Luôn dịch chủ ngữ là "nó"', 'Giữ nguyên câu gốc tiếng Nhật, không dịch'], correctIndex: 1, explanation: 'Tiếng Việt thường cần chủ ngữ tường minh hơn tiếng Nhật; người dịch phải suy luận từ ngữ cảnh và bổ sung cho câu tự nhiên.' },
]);

/* ══════════════════ Chương 3 — Dịch từ Hán-Nhật (漢語) & tương ứng Hán-Việt ══════════════════ */
const c3 = doc('jst301-3-1-kango-hanviet', '3.1 — Sino-Japanese vocabulary (漢語) & Hán-Việt correspondence|||3.1 — Dịch từ Hán-Nhật (漢語) & tương ứng Hán-Việt',
  'Từ Hán-Nhật (漢語, kango) và âm Hán-Việt tương ứng; trật tự chữ Hán có thể đảo giữa hai ngôn ngữ; khi nào nên dùng từ thuần Việt thay vì âm Hán-Việt cứng nhắc.',
  [[
    `<span class="eyebrow">JST301 · Chapter 3 · Lesson 3.1</span>
<h2>Sino-Japanese vocabulary (漢語) &amp; Hán-Việt correspondence</h2>
<p class="lead">Both Japanese and Vietnamese borrowed huge amounts of vocabulary from Chinese characters (漢字). Many Sino-Japanese words (<strong>漢語, kango</strong>) map almost directly onto a Sino-Vietnamese (<strong>Hán-Việt</strong>) reading — a shortcut, but also a trap.</p>
<h3>Direct correspondences (same character order)</h3>
<pre><code>経済 (けいざい, keizai)   -&gt; kinh tế
会議 (かいぎ, kaigi)      -&gt; hội nghị
電話 (でんわ, denwa)      -&gt; điện thoại
学生 (がくせい, gakusei)  -&gt; học sinh
政治 (せいじ, seiji)      -&gt; chính trị
</code></pre>
<h3>Trap 1 — reversed character order</h3>
<p>Some kango compounds keep the same two kanji as their Hán-Việt equivalent, but in the OPPOSITE order:</p>
<pre><code>紹介 (しょうかい, shōkai)
  chữ Hán từng chữ: 紹=thiệu, 介=giới -&gt; đọc thẳng ra "thiệu giới"
  nhưng từ tiếng Việt tương ứng lại là "giới thiệu" (đảo ngược thứ tự!)

言語 (げんご, gengo)
  từng chữ: 言=ngôn, 語=ngữ -&gt; "ngôn ngữ" (thứ tự KHỚP, không đảo — để đối chiếu)
</code></pre>
<h3>Trap 2 — kango that needs a native Vietnamese word, not literal Hán-Việt</h3>
<pre><code>苦労 (くろう, kurō)
  âm Hán-Việt sát nghĩa: "khổ lao" -&gt; nghe cổ, ít dùng trong văn nói hiện đại
  bản dịch tự nhiên hơn: "vất vả", "cực nhọc", "chịu khó"

大丈夫 (だいじょうぶ, daijōbu)
  âm Hán-Việt: "đại trượng phu" -&gt; nghĩa hoàn toàn KHÁC nghĩa dùng thực tế
  nghĩa thực tế: "không sao", "ổn", "được đấy" (an toàn/ổn thỏa)
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> Âm Hán-Việt là điểm khởi đầu tốt để đoán nghĩa, KHÔNG phải quy tắc dịch chắc chắn — luôn kiểm tra nghĩa thực dùng và tự nhiên hoá bằng từ thuần Việt khi cần.</div>`,
    `<span class="eyebrow">JST301 · Chương 3 · Bài 3.1</span>
<h2>Dịch từ Hán-Nhật (漢語) &amp; tương ứng Hán-Việt</h2>
<p class="lead">Cả tiếng Nhật lẫn tiếng Việt đều vay mượn rất nhiều từ vựng từ chữ Hán (漢字). Nhiều từ Hán-Nhật (<strong>漢語, kango</strong>) ánh xạ gần như trực tiếp sang âm Hán-Việt tương ứng — một lối tắt hữu ích, nhưng cũng là cái bẫy.</p>
<h3>Tương ứng trực tiếp (giữ nguyên thứ tự chữ Hán)</h3>
<pre><code>経済 (けいざい, keizai)   -&gt; kinh tế
会議 (かいぎ, kaigi)      -&gt; hội nghị
電話 (でんわ, denwa)      -&gt; điện thoại
学生 (がくせい, gakusei)  -&gt; học sinh
政治 (せいじ, seiji)      -&gt; chính trị
</code></pre>
<h3>Bẫy 1 — thứ tự chữ Hán bị đảo ngược</h3>
<p>Một số từ Hán-Nhật giữ đúng hai chữ Hán như từ Hán-Việt tương ứng, nhưng lại theo thứ tự NGƯỢC LẠI:</p>
<pre><code>紹介 (しょうかい, shōkai)
  đọc từng chữ Hán-Việt: 紹=thiệu, 介=giới -&gt; đọc thẳng ra "thiệu giới"
  nhưng từ tiếng Việt tương ứng lại là "giới thiệu" (đảo ngược thứ tự!)

言語 (げんご, gengo)
  đọc từng chữ: 言=ngôn, 語=ngữ -&gt; "ngôn ngữ" (thứ tự KHỚP, không đảo — để đối chiếu)
</code></pre>
<h3>Bẫy 2 — kango cần dùng từ thuần Việt, không phải âm Hán-Việt cứng</h3>
<pre><code>苦労 (くろう, kurō)
  âm Hán-Việt sát nghĩa: "khổ lao" -&gt; nghe cổ, ít dùng trong văn nói hiện đại
  bản dịch tự nhiên hơn: "vất vả", "cực nhọc", "chịu khó"

大丈夫 (だいじょうぶ, daijōbu)
  âm Hán-Việt: "đại trượng phu" -&gt; nghĩa hoàn toàn KHÁC nghĩa dùng thực tế
  nghĩa thực tế: "không sao", "ổn", "được đấy" (an toàn/ổn thỏa)
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> Âm Hán-Việt là điểm khởi đầu tốt để đoán nghĩa, KHÔNG phải quy tắc dịch chắc chắn — luôn kiểm tra nghĩa thực dùng và tự nhiên hoá bằng từ thuần Việt khi cần.</div>`,
  ]]);

const c3q = quiz('jst301-quiz-3', 'Quiz 3 — Kango & Hán-Việt|||Quiz 3 — Hán-Nhật & Hán-Việt', [
  { id: 'q1', question: 'Từ Hán-Nhật 経済 (けいざい) tương ứng Hán-Việt là gì?', options: ['Kinh tế', 'Kinh nghiệm', 'Kính trọng', 'Cảnh giác'], correctIndex: 0, explanation: '経済 (keizai) đọc Hán-Việt trực tiếp là "kinh tế", đúng cả nghĩa lẫn thứ tự chữ.' },
  { id: 'q2', question: 'Từ 紹介 (しょうかい, đọc từng chữ Hán-Việt là "thiệu giới") khi dịch sang tiếng Việt có gì đặc biệt?', options: ['Trật tự chữ Hán trong từ tiếng Việt bị đảo ngược thành "giới thiệu"', 'Không có gì khác biệt, vẫn đọc "thiệu giới"', 'Nghĩa hoàn toàn khác, không liên quan tới "giới thiệu"', 'Từ này không tồn tại trong tiếng Việt'], correctIndex: 0, explanation: 'Hai chữ Hán 紹(thiệu)介(giới) đọc thẳng ra "thiệu giới", nhưng từ tiếng Việt tương ứng lại đảo ngược thành "giới thiệu".' },
  { id: 'q3', question: 'Vì sao không nên luôn dịch mọi từ Hán-Nhật (漢語) sang đúng âm Hán-Việt?', options: ['Vì âm Hán-Việt luôn sai hoàn toàn', 'Vì đôi khi âm Hán-Việt nghe cổ hoặc lệch nghĩa thực dùng, cần từ thuần Việt tự nhiên hơn (vd 苦労 nên dịch "vất vả" thay vì "khổ lao")', 'Vì tiếng Việt không có từ Hán-Việt', 'Vì kango không còn tồn tại trong tiếng Nhật hiện đại'], correctIndex: 1, explanation: 'Âm Hán-Việt chỉ là gợi ý ban đầu; người dịch phải kiểm tra nghĩa thực dùng và chọn từ tự nhiên nhất trong tiếng Việt.' },
]);

/* ══════════════════ Chương 4 — Dịch câu & xử lý kính ngữ (敬語) ══════════════════ */
const c4 = doc('jst301-4-1-keigo', '4.1 — Sentence translation & handling keigo (敬語)|||4.1 — Dịch câu & xử lý kính ngữ (敬語) khi dịch',
  'Ba tầng kính ngữ tiếng Nhật: tôn kính (尊敬語), khiêm nhường (謙譲語), lịch sự (丁寧語); tiếng Việt không chia động từ theo kính ngữ nên phải dùng xưng hô & từ ngữ trang trọng thay thế.',
  [[
    `<span class="eyebrow">JST301 · Chapter 4 · Lesson 4.1</span>
<h2>Sentence translation &amp; handling keigo (敬語)</h2>
<h3>Three layers of Japanese honorifics</h3>
<ul>
<li><strong>尊敬語 (sonkeigo)</strong> — raises the person you're talking ABOUT (their actions, belongings).</li>
<li><strong>謙譲語 (kenjōgo)</strong> — lowers YOURSELF to show respect toward the listener.</li>
<li><strong>丁寧語 (teineigo)</strong> — plain politeness, the です/ます form used in everyday polite speech.</li>
</ul>
<p><strong>Vietnamese has no grammatical honorific conjugation</strong> — it is an analytic language, so respect is carried entirely by <em>terms of address</em> (anh/chị/ông/bà/quý khách…) and by choosing more formal vocabulary, never by changing the verb's form.</p>
<h3>Worked examples</h3>
<pre><code>Sonkeigo (nâng người khác lên):
  社長は明日いらっしゃいます。
  Shachō wa ashita irasshaimasu. (いらっしゃる = sonkeigo of 来る/いる)
  -&gt; "Ngày mai giám đốc sẽ đến."
     (kính trọng thể hiện qua danh xưng "giám đốc", không cần chia lại động từ)

Kenjōgo (hạ mình xuống trước người nghe):
  明日、伺います。
  Ashita, ukagaimasu. (伺う = kenjōgo of 行く/聞く)
  -&gt; "Ngày mai, tôi xin phép đến ạ."
     (sắc thái khiêm nhường chuyển thành "xin phép" + "ạ", không phải một dạng động từ riêng)

Teineigo (lịch sự thông thường):
  これを見てください。
  Kore o mite kudasai.
  -&gt; "Xin anh/chị xem cái này giúp tôi."
</code></pre>
<div class="callout"><span class="badge">Chiến lược dịch kính ngữ</span> Đừng cố tìm một "động từ kính ngữ" tương ứng trong tiếng Việt — nó không tồn tại. Hãy chuyển sắc thái tôn kính/khiêm nhường vào: (1) đại từ xưng hô phù hợp vai vế, (2) các từ đệm như "ạ / xin phép / kính mong", (3) mức độ trang trọng của từ vựng.</div>`,
    `<span class="eyebrow">JST301 · Chương 4 · Bài 4.1</span>
<h2>Dịch câu &amp; xử lý kính ngữ (敬語) khi dịch</h2>
<h3>Ba tầng kính ngữ tiếng Nhật</h3>
<ul>
<li><strong>尊敬語 (sonkeigo — tôn kính ngữ)</strong> — nâng cao người đang được NÓI TỚI (hành động, đồ vật của họ).</li>
<li><strong>謙譲語 (kenjōgo — khiêm nhường ngữ)</strong> — hạ THẤP bản thân người nói để thể hiện tôn trọng người nghe.</li>
<li><strong>丁寧語 (teineigo — lịch sự ngữ)</strong> — lịch sự thông thường, dạng です/ます dùng trong giao tiếp lịch sự hằng ngày.</li>
</ul>
<p><strong>Tiếng Việt không có biến đổi động từ theo kính ngữ</strong> — đây là ngôn ngữ đơn lập, nên sự tôn trọng hoàn toàn nằm ở <em>từ xưng hô</em> (anh/chị/ông/bà/quý khách…) và việc chọn từ vựng trang trọng hơn, chứ không phải chia lại động từ.</p>
<h3>Ví dụ minh họa</h3>
<pre><code>Sonkeigo (nâng người khác lên):
  社長は明日いらっしゃいます。
  Shachō wa ashita irasshaimasu. (いらっしゃる = sonkeigo của 来る/いる)
  -&gt; "Ngày mai giám đốc sẽ đến."
     (kính trọng thể hiện qua danh xưng "giám đốc", không cần chia lại động từ)

Kenjōgo (hạ mình xuống trước người nghe):
  明日、伺います。
  Ashita, ukagaimasu. (伺う = kenjōgo của 行く/聞く)
  -&gt; "Ngày mai, tôi xin phép đến ạ."
     (sắc thái khiêm nhường chuyển thành "xin phép" + "ạ", không phải một dạng động từ riêng)

Teineigo (lịch sự thông thường):
  これを見てください。
  Kore o mite kudasai.
  -&gt; "Xin anh/chị xem cái này giúp tôi."
</code></pre>
<div class="callout"><span class="badge">Chiến lược dịch kính ngữ</span> Đừng cố tìm một "động từ kính ngữ" tương ứng trong tiếng Việt — nó không tồn tại. Hãy chuyển sắc thái tôn kính/khiêm nhường vào: (1) đại từ xưng hô phù hợp vai vế, (2) các từ đệm như "ạ / xin phép / kính mong", (3) mức độ trang trọng của từ vựng.</div>`,
  ]]);

const c4q = quiz('jst301-quiz-4', 'Quiz 4 — Keigo|||Quiz 4 — Kính ngữ', [
  { id: 'q1', question: '敬語 (kính ngữ) tiếng Nhật gồm mấy tầng chính?', options: ['2 tầng', '3 tầng (tôn kính, khiêm nhường, lịch sự)', '4 tầng', '5 tầng'], correctIndex: 1, explanation: 'Ba tầng: 尊敬語 (sonkeigo), 謙譲語 (kenjōgo), 丁寧語 (teineigo).' },
  { id: 'q2', question: '伺います (ukagaimasu, kenjōgo của 行く/聞く) nên dịch sang tiếng Việt theo cách nào là phù hợp nhất?', options: ['Tìm một dạng chia động từ khiêm nhường riêng trong tiếng Việt', 'Dùng cụm từ khiêm nhường như "tôi xin phép đến" để giữ sắc thái hạ mình', 'Bỏ qua không dịch phần kính ngữ', 'Dịch y hệt "đến" không thêm gì'], correctIndex: 1, explanation: 'Vì tiếng Việt không chia động từ theo kính ngữ, sắc thái khiêm nhường phải chuyển vào cụm từ như "xin phép".' },
  { id: 'q3', question: 'Vì sao tiếng Việt không thể dịch kính ngữ Nhật bằng cách chia lại động từ?', options: ['Vì tiếng Việt là ngôn ngữ đơn lập, không biến đổi hình thái động từ theo kính ngữ — phải dùng từ xưng hô & từ ngữ trang trọng thay thế', 'Vì tiếng Việt không có khái niệm lịch sự', 'Vì kính ngữ chỉ tồn tại trong văn viết tiếng Nhật', 'Vì đây là quy tắc tùy chọn, có thể bỏ qua'], correctIndex: 0, explanation: 'Tiếng Việt không biến hình động từ; sự tôn trọng nằm ở đại từ xưng hô và mức độ trang trọng của từ vựng.' },
]);

/* ══════════════════ Chương 5 — Dịch văn bản đời sống, thông tin & công sở ══════════════════ */
const c5 = doc('jst301-5-1-everyday-office', '5.1 — Translating everyday, informational & office texts|||5.1 — Dịch văn bản đời sống, thông tin & công sở',
  'Thông báo (お知らせ), biểu mẫu hành chính, email công việc (ビジネスメール) — công thức mở/kết thư kiểu Nhật và cách chuyển thành lời chào tương đương trong tiếng Việt.',
  [[
    `<span class="eyebrow">JST301 · Chapter 5 · Lesson 5.1</span>
<h2>Translating everyday, informational &amp; office texts</h2>
<h3>Business email openers are formulas, not sentences to translate literally</h3>
<p>Japanese business emails (<strong>ビジネスメール</strong>) open with fixed courtesy formulas that carry almost no literal meaning — translating them word-for-word produces nonsense. Replace them with the FUNCTIONAL equivalent Vietnamese business writing uses.</p>
<pre><code>いつもお世話になっております。
Itsumo osewa ni natte orimasu.
Nghĩa đen: "Tôi luôn được (quý công ty) chăm sóc."
-&gt; KHÔNG dịch đen. Thay bằng công thức mở thư tiếng Việt tương đương:
   "Kính gửi Quý công ty," / "Thân gửi anh/chị," (tuỳ mức trang trọng)

よろしくお願いいたします。 (câu kết thư rất phổ biến)
Yoroshiku onegai itashimasu.
-&gt; tuỳ ngữ cảnh: "Rất mong nhận được sự hợp tác từ Quý công ty."
   hoặc đơn giản: "Trân trọng." (nếu là câu kết email thông thường)
</code></pre>
<h3>Notices &amp; office memos — precision over elegance</h3>
<p>For an internal notice (<strong>お知らせ</strong>), the priority flips: preserve every hard fact — who, when, where, what to do — in plain, standard administrative Vietnamese; poetic phrasing is not needed here.</p>
<pre><code>Source (JA): 来週月曜日、9時よりビル全体の停電点検を行います。ご協力をお願いいたします。
Romaji: Raishū getsuyōbi, kuji yori biru zentai no teiden tenken o okonaimasu.
        Gokyōryoku o onegai itashimasu.
Translation:
  "Thứ Hai tuần sau, từ 9 giờ sẽ tiến hành kiểm tra cắt điện toàn bộ tòa nhà.
   Kính mong Quý khách/anh chị hợp tác."
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> Văn bản đời sống/công sở ưu tiên TÍN + ĐẠT (đúng thông tin, đọc tự nhiên theo văn phong hành chính Việt) hơn là dịch sát câu chữ từng công thức xã giao.</div>`,
    `<span class="eyebrow">JST301 · Chương 5 · Bài 5.1</span>
<h2>Dịch văn bản đời sống, thông tin &amp; công sở</h2>
<h3>Câu mở đầu email công việc là công thức, không phải câu cần dịch sát nghĩa</h3>
<p>Email công việc tiếng Nhật (<strong>ビジネスメール</strong>) mở đầu bằng những công thức xã giao cố định, gần như không mang nghĩa đen — dịch nguyên văn sẽ tạo ra câu vô nghĩa. Hãy thay bằng công thức TƯƠNG ĐƯƠNG VỀ CHỨC NĂNG mà văn phong công việc tiếng Việt dùng.</p>
<pre><code>いつもお世話になっております。
Itsumo osewa ni natte orimasu.
Nghĩa đen: "Tôi luôn được (quý công ty) chăm sóc."
-&gt; KHÔNG dịch đen. Thay bằng công thức mở thư tiếng Việt tương đương:
   "Kính gửi Quý công ty," / "Thân gửi anh/chị," (tuỳ mức trang trọng)

よろしくお願いいたします。 (câu kết thư rất phổ biến)
Yoroshiku onegai itashimasu.
-&gt; tuỳ ngữ cảnh: "Rất mong nhận được sự hợp tác từ Quý công ty."
   hoặc đơn giản: "Trân trọng." (nếu là câu kết email thông thường)
</code></pre>
<h3>Thông báo &amp; văn bản nội bộ — ưu tiên chính xác hơn hoa mỹ</h3>
<p>Với một thông báo nội bộ (<strong>お知らせ</strong>), thứ tự ưu tiên đảo ngược: giữ đúng mọi thông tin cứng — ai, khi nào, ở đâu, phải làm gì — bằng văn phong hành chính tiếng Việt chuẩn mực; không cần văn hoa.</p>
<pre><code>Nguồn (JA): 来週月曜日、9時よりビル全体の停電点検を行います。ご協力をお願いいたします。
Romaji: Raishū getsuyōbi, kuji yori biru zentai no teiden tenken o okonaimasu.
        Gokyōryoku o onegai itashimasu.
Bản dịch:
  "Thứ Hai tuần sau, từ 9 giờ sẽ tiến hành kiểm tra cắt điện toàn bộ tòa nhà.
   Kính mong Quý khách/anh chị hợp tác."
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> Văn bản đời sống/công sở ưu tiên TÍN + ĐẠT (đúng thông tin, đọc tự nhiên theo văn phong hành chính Việt) hơn là dịch sát câu chữ từng công thức xã giao.</div>`,
  ]]);

const c5q = quiz('jst301-quiz-5', 'Quiz 5 — Everyday & office texts|||Quiz 5 — Văn bản đời sống & công sở', [
  { id: 'q1', question: 'Câu mở đầu email công việc Nhật いつもお世話になっております nên xử lý thế nào khi dịch?', options: ['Dịch nghĩa đen "Tôi luôn được chăm sóc"', "Thay bằng lời chào trang trọng tương đương trong thư tiếng Việt (vd 'Kính gửi Quý công ty,') vì đây là công thức xã giao, không mang nghĩa thực", 'Bỏ hẳn không dịch vì không quan trọng', 'Giữ nguyên tiếng Nhật trong bản dịch'], correctIndex: 1, explanation: 'Đây là công thức xã giao cố định; dịch đen sẽ vô nghĩa, cần thay bằng công thức chức năng tương đương của tiếng Việt.' },
  { id: 'q2', question: 'Khi dịch văn bản thông báo/công sở, điều quan trọng nhất là gì?', options: ['Dịch từng chữ chính xác tuyệt đối kể cả công thức xã giao', 'Giữ đúng thông tin cốt lõi (ai, khi nào, ở đâu, làm gì) bằng văn phong hành chính tự nhiên của tiếng Việt', 'Thêm ý kiến cá nhân của người dịch vào bản dịch', 'Rút ngắn văn bản hết mức có thể, bỏ bớt chi tiết'], correctIndex: 1, explanation: 'Văn bản hành chính ưu tiên chính xác thông tin và văn phong chuẩn mực hơn là dịch sát câu chữ.' },
  { id: 'q3', question: "Thể loại văn bản nào sau đây KHÔNG thuộc nhóm 'đời sống & công sở' trong chương này?", options: ['Thông báo nội bộ (お知らせ)', 'Email công việc (ビジネスメール)', 'Bài phân tích kinh tế vĩ mô trên báo', 'Biểu mẫu hành chính'], correctIndex: 2, explanation: 'Bài phân tích kinh tế trên báo thuộc nhóm văn bản báo chí/kinh tế — chương 6, không phải văn bản đời sống/công sở.' },
]);

/* ══════════════════ Chương 6 — Dịch văn bản báo chí, kinh tế & thương mại ══════════════════ */
const c6 = doc('jst301-6-1-news-business', '6.1 — Translating news, economic & business texts|||6.1 — Dịch văn bản báo chí, kinh tế & thương mại',
  'Tiêu đề báo Nhật kiểu danh từ hoá nén thông tin; câu bị động phổ biến trong tin kinh tế; thuật ngữ thương mại (契約書, 為替レート); cách chuyển sang tiếng Việt tự nhiên.',
  [[
    `<span class="eyebrow">JST301 · Chapter 6 · Lesson 6.1</span>
<h2>Translating news, economic &amp; business texts</h2>
<h3>Headlines compress grammar into noun chains</h3>
<p>Japanese newspaper headlines drop particles and conjugated verbs, stringing nouns together for maximum compression. The translator must silently restore the missing grammar before rendering a natural Vietnamese headline.</p>
<pre><code>Headline (JA): 米中貿易摩擦拡大
Romaji:        Bei-Chū bōeki masatsu kakudai
Literal pieces: 米中(Mỹ-Trung) 貿易摩擦(căng thẳng thương mại) 拡大(mở rộng/leo thang)
Reconstructed:  "Mỹ-Trung mở rộng căng thẳng thương mại" / "Căng thẳng thương mại Mỹ-Trung leo thang"
</code></pre>
<h3>Passive voice is the default register in news &amp; economic reports</h3>
<p>Japanese news favors the passive to sound neutral and source-attributed (〜と発表された, 〜と報じられている); Vietnamese often reads more naturally with an active or a lighter passive.</p>
<pre><code>Source (JA): 政府は来年度予算案を発表した。専門家からは慎重な意見も出されている。
Romaji: Seifu wa rainendo yosan-an o happyō shita. Senmonka kara wa shinchō na iken mo dasarete iru.
Translation: "Chính phủ đã công bố dự thảo ngân sách năm tài khóa tới. Giới chuyên gia cũng đưa ra một số ý kiến thận trọng."
  (出されている giữ dạng gần-bị-động "đưa ra" thay vì dịch cứng "được đưa ra bởi")
</code></pre>
<h3>Business/commercial terms</h3>
<pre><code>契約書 (けいやくしょ, keiyakusho)      -&gt; hợp đồng
為替レート (かわせレート, kawase rēto)  -&gt; tỷ giá hối đoái
輸出入 (ゆしゅつにゅう, yushutsunyū)   -&gt; xuất nhập khẩu
株式会社 (かぶしきがいしゃ)            -&gt; công ty cổ phần
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> Với báo chí/kinh tế: (1) dựng lại ngữ pháp bị nén trong tiêu đề, (2) cân nhắc chủ động hoá câu bị động cho tự nhiên, (3) dùng đúng thuật ngữ chuyên ngành đã chuẩn hoá, không tự sáng tạo.</div>`,
    `<span class="eyebrow">JST301 · Chương 6 · Bài 6.1</span>
<h2>Dịch văn bản báo chí, kinh tế &amp; thương mại</h2>
<h3>Tiêu đề báo nén ngữ pháp thành chuỗi danh từ</h3>
<p>Tiêu đề báo tiếng Nhật lược bỏ trợ từ và động từ chia thì, ghép các danh từ lại với nhau để nén tối đa. Người dịch phải ngầm khôi phục lại ngữ pháp bị lược trước khi dựng thành tiêu đề tiếng Việt tự nhiên.</p>
<pre><code>Tiêu đề (JA): 米中貿易摩擦拡大
Romaji:       Bei-Chū bōeki masatsu kakudai
Từng mảnh:    米中(Mỹ-Trung) 貿易摩擦(căng thẳng thương mại) 拡大(mở rộng/leo thang)
Dựng lại:     "Mỹ-Trung mở rộng căng thẳng thương mại" / "Căng thẳng thương mại Mỹ-Trung leo thang"
</code></pre>
<h3>Câu bị động là văn phong mặc định trong tin tức & báo cáo kinh tế</h3>
<p>Báo Nhật ưa dùng bị động để nghe trung lập, gắn với nguồn tin (〜と発表された, 〜と報じられている); tiếng Việt thường tự nhiên hơn khi chuyển thành chủ động hoặc bị động nhẹ.</p>
<pre><code>Nguồn (JA): 政府は来年度予算案を発表した。専門家からは慎重な意見も出されている。
Romaji: Seifu wa rainendo yosan-an o happyō shita. Senmonka kara wa shinchō na iken mo dasarete iru.
Bản dịch: "Chính phủ đã công bố dự thảo ngân sách năm tài khóa tới. Giới chuyên gia cũng đưa ra một số ý kiến thận trọng."
  (出されている giữ dạng gần-bị-động "đưa ra" thay vì dịch cứng "được đưa ra bởi")
</code></pre>
<h3>Thuật ngữ thương mại</h3>
<pre><code>契約書 (けいやくしょ, keiyakusho)      -&gt; hợp đồng
為替レート (かわせレート, kawase rēto)  -&gt; tỷ giá hối đoái
輸出入 (ゆしゅつにゅう, yushutsunyū)   -&gt; xuất nhập khẩu
株式会社 (かぶしきがいしゃ)            -&gt; công ty cổ phần
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> Với báo chí/kinh tế: (1) dựng lại ngữ pháp bị nén trong tiêu đề, (2) cân nhắc chủ động hoá câu bị động cho tự nhiên, (3) dùng đúng thuật ngữ chuyên ngành đã chuẩn hoá, không tự sáng tạo.</div>`,
  ]]);

const c6q = quiz('jst301-quiz-6', 'Quiz 6 — News & business|||Quiz 6 — Báo chí & thương mại', [
  { id: 'q1', question: 'Tiêu đề báo Nhật thường lược bỏ thành phần nào để nén thông tin?', options: ['Chủ ngữ', 'Trợ từ và động từ chia thì (dùng chuỗi danh từ thay thế)', 'Toàn bộ nội dung câu', 'Chữ kanji'], correctIndex: 1, explanation: 'Tiêu đề Nhật ghép danh từ, bỏ trợ từ và chia thì để nén tối đa — người dịch phải khôi phục ngữ pháp khi dựng bản Việt.' },
  { id: 'q2', question: 'Cấu trúc bị động thường gặp trong tin kinh tế Nhật 〜と発表された nên xử lý thế nào khi dịch sang tiếng Việt?', options: ['Có thể chuyển thành câu chủ động tự nhiên hơn, ví dụ "đã công bố rằng..."', 'Luôn giữ nguyên dạng bị động máy móc "đã được công bố là bởi"', 'Bỏ qua không dịch phần này', 'Chuyển thành câu hỏi'], correctIndex: 0, explanation: 'Tiếng Việt thường tự nhiên hơn khi chuyển bị động Nhật thành câu chủ động hoặc bị động nhẹ, tuỳ ngữ cảnh.' },
  { id: 'q3', question: '契約書 (けいやくしょ) là thuật ngữ thương mại có nghĩa gì?', options: ['Báo cáo tài chính', 'Hợp đồng', 'Hóa đơn', 'Tỷ giá hối đoái'], correctIndex: 1, explanation: '契約書 (keiyakusho) = văn bản hợp đồng.' },
]);

/* ══════════════════ Chương 7 — Nhập môn phiên dịch: dịch đuổi & ghi chép ══════════════════ */
const c7 = doc('jst301-7-1-consecutive-notetaking', '7.1 — Intro to interpreting: consecutive interpreting (逐次通訳) & note-taking|||7.1 — Nhập môn phiên dịch: dịch đuổi (逐次通訳) & ghi chép',
  'Quy trình dịch đuổi (逐次通訳): nghe → ghi chép → tái hiện; hệ ký hiệu ghi chép nhanh (mũi tên, vòng tròn, gạch chéo); cân bằng giữa nghe-hiểu và ghi chép.',
  [[
    `<span class="eyebrow">JST301 · Chapter 7 · Lesson 7.1</span>
<h2>Intro to interpreting: consecutive interpreting (逐次通訳) &amp; note-taking</h2>
<h3>What is consecutive interpreting?</h3>
<p><strong>逐次通訳 (chikuji tsūyaku, consecutive interpreting)</strong> — the speaker talks for a chunk (a few sentences to a couple of minutes), pauses, and the interpreter reproduces that chunk in the target language. Unlike 同時通訳 (simultaneous interpreting, done in a booth in real time), there is a short window to organize the idea before speaking.</p>
<h3>The three-step process</h3>
<ul>
<li><strong>Listen &amp; understand</strong> — capture the MEANING and logical structure, not individual words.</li>
<li><strong>Note</strong> — write fast symbols/keywords as memory anchors, never full sentences.</li>
<li><strong>Reproduce</strong> — speak naturally in Vietnamese from meaning + notes, not from a memorized word list.</li>
</ul>
<h3>Common note-taking symbols (記号)</h3>
<pre><code>→        quan hệ nhân-quả, chuyển động, xu hướng ("dẫn đến", "chuyển sang")
↑ / ↓    tăng / giảm
=        tương đương, giống nhau
≠ hoặc ✕  phủ định, trái ngược
○        một người/nhóm người (ghi chữ cái đầu tên bên trong)
□        một tổ chức/công ty/quốc gia
"..."     lời trích dẫn trực tiếp
</code></pre>
<h3>Worked example</h3>
<pre><code>Nghe (JA): 今年、日本からベトナムへの投資は前年より20％増加しました。
Romaji: Kotoshi, Nihon kara Betonamu e no tōshi wa zennen yori nijū-pāsento zōka shimashita.

Ghi chép gợi ý:  日→VN 投資 ↑20% (so cùng kỳ)

Tái hiện (VI): "Năm nay, đầu tư từ Nhật Bản vào Việt Nam đã tăng 20% so với năm trước."
</code></pre>
<div class="callout"><span class="badge">Cân bằng nghe và ghi</span> Ghi chép chỉ là điểm tựa cho trí nhớ — nếu cắm đầu ghi từng chữ, bạn sẽ NGHE SÓT ý. Ưu tiên hiểu đúng ý chính, ghi tối thiểu, và tin vào trí nhớ ngắn hạn để lấp phần còn lại.</div>`,
    `<span class="eyebrow">JST301 · Chương 7 · Bài 7.1</span>
<h2>Nhập môn phiên dịch: dịch đuổi (逐次通訳) &amp; ghi chép</h2>
<h3>Dịch đuổi là gì?</h3>
<p><strong>逐次通訳 (chikuji tsūyaku, dịch đuổi/dịch nối tiếp)</strong> — người nói trình bày một đoạn (vài câu tới một-hai phút), dừng lại, rồi phiên dịch viên tái hiện đoạn đó bằng ngôn ngữ đích. Khác với 同時通訳 (dịch song song/dịch cabin, làm ngay tức thời), ở đây có một khoảng ngắn để sắp xếp ý trước khi nói.</p>
<h3>Ba bước của quy trình</h3>
<ul>
<li><strong>Nghe &amp; hiểu</strong> — nắm được NGHĨA và cấu trúc logic, không phải từng từ riêng lẻ.</li>
<li><strong>Ghi chép</strong> — viết nhanh ký hiệu/từ khóa làm điểm tựa trí nhớ, không bao giờ chép nguyên câu.</li>
<li><strong>Tái hiện</strong> — nói tự nhiên bằng tiếng Việt dựa trên nghĩa + ghi chú, không đọc lại danh sách từ đã học thuộc.</li>
</ul>
<h3>Các ký hiệu ghi chép thường dùng (記号)</h3>
<pre><code>→        quan hệ nhân-quả, chuyển động, xu hướng ("dẫn đến", "chuyển sang")
↑ / ↓    tăng / giảm
=        tương đương, giống nhau
≠ hoặc ✕  phủ định, trái ngược
○        một người/nhóm người (ghi chữ cái đầu tên bên trong)
□        một tổ chức/công ty/quốc gia
"..."     lời trích dẫn trực tiếp
</code></pre>
<h3>Ví dụ minh họa</h3>
<pre><code>Nghe (JA): 今年、日本からベトナムへの投資は前年より20％増加しました。
Romaji: Kotoshi, Nihon kara Betonamu e no tōshi wa zennen yori nijū-pāsento zōka shimashita.

Ghi chép gợi ý:  日→VN 投資 ↑20% (so cùng kỳ)

Tái hiện (VI): "Năm nay, đầu tư từ Nhật Bản vào Việt Nam đã tăng 20% so với năm trước."
</code></pre>
<div class="callout"><span class="badge">Cân bằng nghe và ghi</span> Ghi chép chỉ là điểm tựa cho trí nhớ — nếu cắm đầu ghi từng chữ, bạn sẽ NGHE SÓT ý. Ưu tiên hiểu đúng ý chính, ghi tối thiểu, và tin vào trí nhớ ngắn hạn để lấp phần còn lại.</div>`,
  ]]);

const c7q = quiz('jst301-quiz-7', 'Quiz 7 — Consecutive interpreting|||Quiz 7 — Dịch đuổi & ghi chép', [
  { id: 'q1', question: '逐次通訳 (chikuji tsūyaku) là hình thức phiên dịch nào?', options: ['Dịch song song cùng lúc với người nói (dịch cabin)', 'Dịch sau khi người nói tạm dừng lại một đoạn', 'Chỉ áp dụng cho văn bản viết', 'Không cần nghe, chỉ cần đọc kịch bản'], correctIndex: 1, explanation: 'Dịch đuổi (chikuji tsūyaku) khác dịch song song (同時通訳) ở chỗ có khoảng dừng để tổ chức lại ý trước khi nói.' },
  { id: 'q2', question: 'Trong ghi chép phiên dịch, ký hiệu mũi tên (→) thường biểu thị điều gì?', options: ['Sự phủ định', 'Quan hệ nhân-quả, chuyển động hoặc xu hướng', 'Số lượng người tham gia', 'Thời gian trong quá khứ'], correctIndex: 1, explanation: 'Mũi tên (→) thường dùng để biểu thị "dẫn đến", "chuyển sang" — quan hệ nhân-quả hoặc chuyển động/xu hướng.' },
  { id: 'q3', question: 'Vì sao người phiên dịch đuổi không nên cố ghi chép lại từng từ một?', options: ['Vì không có đủ thời gian, và ghi từng chữ khiến mất tập trung nghe-hiểu ý chính', 'Vì ghi chép làm sai chính tả tiếng Nhật', 'Vì không được phép mang giấy bút vào phòng dịch', 'Vì ghi chép tiếng Nhật rất dễ nên không cần thiết'], correctIndex: 0, explanation: 'Ghi chép chỉ là điểm tựa trí nhớ; cố ghi từng từ sẽ khiến người dịch nghe sót ý chính của người nói.' },
]);

/* ══════════════════ Chương 8 — Ôn tập: dịch đoạn, thành ngữ & lỗi thường gặp ══════════════════ */
const c8 = doc('jst301-8-1-idioms-review', '8.1 — Review: passage practice, idioms (慣用句) & common translation errors|||8.1 — Ôn tập: thực hành dịch đoạn, thành ngữ (慣用句) & lỗi dịch thường gặp',
  'Dịch thành ngữ (慣用句) theo nghĩa bóng, không dịch đen từng chữ; tổng hợp các lỗi dịch thường gặp của người mới học (kính ngữ, trật tự câu, âm Hán-Việt cứng nhắc); bài luyện dịch đoạn tổng hợp.',
  [[
    `<span class="eyebrow">JST301 · Chapter 8 · Lesson 8.1</span>
<h2>Review: passage practice, idioms (慣用句) &amp; common translation errors</h2>
<h3>Idioms (慣用句) — translate the MEANING, never the literal words</h3>
<pre><code>猫の手も借りたい
Neko no te mo karitai
Nghĩa đen: "muốn mượn cả tay mèo"
Nghĩa bóng: bận đến mức thiếu người, ai giúp cũng được
-&gt; bản dịch tự nhiên: "Bận đến mức chân tay không đủ dùng." / "Bận tối tăm mặt mũi, ai giúp cũng quý."

顔が広い
Kao ga hiroi
Nghĩa đen: "mặt rộng"
Nghĩa bóng: quen biết rộng, có nhiều mối quan hệ
-&gt; bản dịch tự nhiên: "Anh ấy quen biết rất rộng."
</code></pre>
<h3>Five common beginner mistakes (recap of Chapters 1-7)</h3>
<ul>
<li><strong>Dịch đen thành ngữ/quán ngữ</strong> — giữ nguyên nghĩa từng chữ khiến câu vô nghĩa (xem ví dụ 猫の手 ở trên).</li>
<li><strong>Cố chia "động từ kính ngữ" trong tiếng Việt</strong> — thay vào đó phải dùng xưng hô + từ đệm trang trọng (Chương 4).</li>
<li><strong>Giữ nguyên trật tự SOV khi dịch mệnh đề quan hệ</strong> — quên đảo mệnh đề ra sau danh từ (Chương 2).</li>
<li><strong>Dịch cứng âm Hán-Việt</strong> cho những từ mà tiếng Việt hiện đại đã dùng từ khác tự nhiên hơn (Chương 3).</li>
<li><strong>Dịch nguyên câu bị động kiểu Nhật</strong> trong văn bản báo chí thay vì chủ động hoá cho tự nhiên (Chương 6).</li>
</ul>
<h3>Practice passage</h3>
<pre><code>Source (JA): 田中さんが担当している新しいプロジェクトは、来月からベトナムのハノイで
             始まる予定です。人手が足りず、猫の手も借りたい状況だと聞きました。

Suggested translation:
  "Dự án mới mà anh Tanaka phụ trách dự kiến sẽ khởi động từ tháng sau tại
   Hà Nội, Việt Nam. Nghe nói bên đó đang thiếu người, bận đến mức chân
   tay không đủ dùng."
</code></pre>
<div class="callout"><span class="badge">Tổng kết môn</span> Một bản dịch tốt luôn đi qua ba bước: hiểu đúng cấu trúc &amp; nghĩa gốc (tín) → dựng lại câu tự nhiên theo tiếng Việt (đạt, đảo trật tự, xử lý kính ngữ/thành ngữ) → tinh chỉnh văn phong đúng ngữ cảnh (nhã).</div>`,
    `<span class="eyebrow">JST301 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập: thực hành dịch đoạn, thành ngữ (慣用句) &amp; lỗi dịch thường gặp</h2>
<h3>Thành ngữ (慣用句) — dịch theo NGHĨA BÓNG, không dịch đen từng chữ</h3>
<pre><code>猫の手も借りたい
Neko no te mo karitai
Nghĩa đen: "muốn mượn cả tay mèo"
Nghĩa bóng: bận đến mức thiếu người, ai giúp cũng được
-&gt; bản dịch tự nhiên: "Bận đến mức chân tay không đủ dùng." / "Bận tối tăm mặt mũi, ai giúp cũng quý."

顔が広い
Kao ga hiroi
Nghĩa đen: "mặt rộng"
Nghĩa bóng: quen biết rộng, có nhiều mối quan hệ
-&gt; bản dịch tự nhiên: "Anh ấy quen biết rất rộng."
</code></pre>
<h3>Năm lỗi thường gặp ở người mới học (tổng hợp Chương 1-7)</h3>
<ul>
<li><strong>Dịch đen thành ngữ/quán ngữ</strong> — giữ nguyên nghĩa từng chữ khiến câu vô nghĩa (xem ví dụ 猫の手 ở trên).</li>
<li><strong>Cố chia "động từ kính ngữ" trong tiếng Việt</strong> — thay vào đó phải dùng xưng hô + từ đệm trang trọng (Chương 4).</li>
<li><strong>Giữ nguyên trật tự SOV khi dịch mệnh đề quan hệ</strong> — quên đảo mệnh đề ra sau danh từ (Chương 2).</li>
<li><strong>Dịch cứng âm Hán-Việt</strong> cho những từ mà tiếng Việt hiện đại đã dùng từ khác tự nhiên hơn (Chương 3).</li>
<li><strong>Dịch nguyên câu bị động kiểu Nhật</strong> trong văn bản báo chí thay vì chủ động hoá cho tự nhiên (Chương 6).</li>
</ul>
<h3>Bài luyện dịch đoạn</h3>
<pre><code>Nguồn (JA): 田中さんが担当している新しいプロジェクトは、来月からベトナムのハノイで
            始まる予定です。人手が足りず、猫の手も借りたい状況だと聞きました。

Gợi ý bản dịch:
  "Dự án mới mà anh Tanaka phụ trách dự kiến sẽ khởi động từ tháng sau tại
   Hà Nội, Việt Nam. Nghe nói bên đó đang thiếu người, bận đến mức chân
   tay không đủ dùng."
</code></pre>
<div class="callout"><span class="badge">Tổng kết môn</span> Một bản dịch tốt luôn đi qua ba bước: hiểu đúng cấu trúc &amp; nghĩa gốc (tín) → dựng lại câu tự nhiên theo tiếng Việt (đạt, đảo trật tự, xử lý kính ngữ/thành ngữ) → tinh chỉnh văn phong đúng ngữ cảnh (nhã).</div>`,
  ]]);

const c8q = quiz('jst301-quiz-8', 'Quiz 8 — Review, idioms & errors|||Quiz 8 — Ôn tập, thành ngữ & lỗi thường gặp', [
  { id: 'q1', question: 'Thành ngữ 猫の手も借りたい nếu dịch sát nghĩa đen "muốn mượn cả tay mèo" thì người đọc tiếng Việt có hiểu đúng ý không?', options: ['Có, vì nghĩa đen đã đủ rõ ràng', "Không, cần dịch theo nghĩa bóng 'bận đến mức cần ai giúp cũng được'", 'Không liên quan gì tới việc dịch thuật', 'Chỉ đúng khi dùng trong văn viết trang trọng'], correctIndex: 1, explanation: 'Thành ngữ phải dịch theo nghĩa bóng thực tế, dịch đen từng chữ sẽ khiến người đọc tiếng Việt không hiểu được ý.' },
  { id: 'q2', question: 'Lỗi thường gặp khi người mới học dịch câu có kính ngữ là gì?', options: ['Dịch quá tự nhiên, không còn dấu vết tiếng Nhật', 'Cố tìm cách chia lại động từ tiếng Việt theo kiểu kính ngữ khiến câu gượng gạo', 'Bỏ hết nghĩa của cả câu', 'Không có lỗi nào đáng lưu ý'], correctIndex: 1, explanation: 'Tiếng Việt không chia động từ theo kính ngữ; cố làm vậy tạo ra câu gượng gạo, sai ngữ pháp tiếng Việt.' },
  { id: 'q3', question: 'Nguyên tắc chung khi gặp thành ngữ/quán ngữ (慣用句) trong bản gốc tiếng Nhật là gì?', options: ['Luôn dịch từng chữ một cách chính xác tuyệt đối', 'Tìm cách diễn đạt tương đương về Ý NGHĨA và SẮC THÁI trong tiếng Việt, không dịch đen từng chữ', 'Bỏ qua, không dịch thành ngữ', 'Giữ nguyên tiếng Nhật kèm chú thích trong ngoặc'], correctIndex: 1, explanation: 'Nguyên tắc dịch thành ngữ là truyền tải đúng ý nghĩa và sắc thái, không phải dịch nguyên văn từng chữ.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'JST301',
    slug: 'jst301-japanese-translation-and-interpretation-skills',
    title: 'Japanese Translation and Interpretation Skills',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JST301.webp',
    shortDescription: 'Japanese-Vietnamese translation & interpreting (JLPT N3-N2): tín-đạt-nhã criteria, SOV→SVO reordering, Hán-Nhật/Hán-Việt vocabulary, keigo, everyday/office & news/business texts, consecutive interpreting, note-taking, idioms.|||Kỹ năng biên-phiên dịch Nhật-Việt (JLPT N3-N2): tiêu chí tín-đạt-nhã, đảo trật tự SOV→SVO, từ Hán-Nhật & Hán-Việt, xử lý kính ngữ, văn bản đời sống/công sở, báo chí/kinh tế, dịch đuổi & ghi chép, thành ngữ.',
    description: 'Môn <strong>JST301 — Japanese Translation and Interpretation Skills</strong> (kỳ 5, trình độ JLPT N3-N2) rèn kỹ năng <strong>biên dịch &amp; phiên dịch Nhật-Việt</strong>. Từ <strong>tiêu chí tín-đạt-nhã</strong> và khác biệt cấu trúc SOV→SVO → <strong>từ Hán-Nhật (漢語) &amp; tương ứng Hán-Việt</strong> → <strong>xử lý kính ngữ (敬語)</strong> khi dịch → <strong>văn bản đời sống, công sở, báo chí, kinh tế &amp; thương mại</strong> → nhập môn <strong>dịch đuổi (逐次通訳) &amp; ghi chép</strong> → ôn tập thành ngữ (慣用句) và lỗi dịch thường gặp. Mỗi chương có ví dụ dịch song ngữ 日本語 (kana/kanji + romaji) → tiếng Việt và quiz kiểm tra.',
    whatYouLearn: 'Ba tiêu chí tín-đạt-nhã (信達雅); khác biệt SOV (Nhật) và SVO (Việt), đảo trật tự mệnh đề quan hệ, xử lý lược chủ ngữ; từ Hán-Nhật (漢語) và âm Hán-Việt tương ứng, các bẫy đảo thứ tự chữ Hán; ba tầng kính ngữ (尊敬語/謙譲語/丁寧語) và cách chuyển sang xưng hô tiếng Việt; dịch thông báo, email công việc, biểu mẫu hành chính; dịch tiêu đề báo, câu bị động, thuật ngữ kinh tế-thương mại; nhập môn dịch đuổi (逐次通訳) và hệ ký hiệu ghi chép; dịch thành ngữ (慣用句) theo nghĩa bóng và nhận diện lỗi dịch thường gặp.',
    requirements: 'Trình độ tiếng Nhật tương đương JLPT N3 trở lên (khuyến khích hướng tới N2); đã học ngữ pháp và từ vựng cơ bản-trung cấp. Nên có từ điển Nhật-Việt và thói quen đọc/nghe tiếng Nhật hằng ngày.',
  },
  sections: [
    { title: 'Chương 1 — Tổng quan dịch thuật & tiêu chí tín-đạt-nhã|||Chapter 1 — Overview & the tín-đạt-nhã criteria', description: 'Biên dịch vs phiên dịch; tiêu chí tín-đạt-nhã; ví dụ ba bản dịch.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khác biệt cấu trúc Nhật-Việt & SOV→SVO|||Chapter 2 — Structural differences & SOV→SVO', description: 'Trật tự câu, mệnh đề quan hệ, lược chủ ngữ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Dịch từ Hán-Nhật & tương ứng Hán-Việt|||Chapter 3 — Sino-Japanese & Hán-Việt correspondence', description: 'Kango (漢語), âm Hán-Việt, bẫy đảo thứ tự chữ Hán.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Dịch câu & xử lý kính ngữ (敬語)|||Chapter 4 — Sentence translation & keigo', description: 'Sonkeigo, kenjōgo, teineigo; chuyển sang xưng hô tiếng Việt.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Dịch văn bản đời sống, thông tin & công sở|||Chapter 5 — Everyday, informational & office texts', description: 'Thông báo, email công việc, biểu mẫu hành chính.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Dịch văn bản báo chí, kinh tế & thương mại|||Chapter 6 — News, economic & business texts', description: 'Tiêu đề báo, câu bị động, thuật ngữ thương mại.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Nhập môn phiên dịch: dịch đuổi & ghi chép|||Chapter 7 — Intro to interpreting: consecutive & note-taking', description: 'Quy trình dịch đuổi, hệ ký hiệu ghi chép.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập: dịch đoạn, thành ngữ & lỗi thường gặp|||Chapter 8 — Review: passages, idioms & common errors', description: 'Thành ngữ (慣用句), tổng hợp lỗi dịch, bài luyện dịch đoạn.', lessons: [c8, c8q] },
  ],
};
