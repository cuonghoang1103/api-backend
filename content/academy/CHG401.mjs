/**
 * CHG401 — Chinese Grammar (Ngữ pháp tiếng Trung hệ thống). Khối Ngôn ngữ
 * Trung FPTU, kỳ 5. Môn NGỮ PHÁP LÝ THUYẾT toàn diện: từ loại, cụm từ/kết
 * cấu (的/地/得), thành phần câu & trật tự, bổ ngữ, câu 把/被, câu so
 * sánh/tồn hiện/kiêm ngữ, trợ từ ngữ khí & thể (了/着/过), câu phức.
 * ⚠️ CHG401c là bản KHÁC — không dựng giống. Nguồn trích dẫn (không upload
 * PDF): 现代汉语语法 (Modern Chinese Grammar); A Grammar of Spoken Chinese
 * (Chao Yuen Ren); Chinese: A Comprehensive Grammar (Yip & Rimmington).
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; HTML
 * "&" → "&amp;", "<" thường → "&lt;". Pinyin dấu thanh THẬT (ā á ǎ à…).
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh ngữ pháp của chương.', quiz: { timeLimitSeconds: 420, questions } });

const taiLieu = doc('chg401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Giáo trình ngữ pháp chuẩn (现代汉语语法, Chao Yuen Ren, Yip & Rimmington), tài liệu miễn phí (Chinese Grammar Wiki), YouTube, công cụ tra cứu, lộ trình học.',
  [[
    `<span class="eyebrow">CHG401 · Materials</span>
<h2>Chinese Grammar — materials &amp; resource hub</h2>
<p class="lead">This course builds a <strong>systematic</strong> map of Mandarin grammar — word classes, phrase structures, sentence patterns, complements, 把/被, aspect &amp; modal particles. The academic references below are cited for context; no PDF is distributed here.</p>
<h3>📘 Reference grammars (cited, not distributed)</h3>
<ul>
<li><em>现代汉语语法 (Modern Chinese Grammar)</em> — the standard mainland reference on word classes and sentence structure.</li>
<li><em>A Grammar of Spoken Chinese</em> — Chao Yuen Ren — the classic descriptive grammar of spoken Mandarin.</li>
<li><em>Chinese: A Comprehensive Grammar</em> — Yip &amp; Rimmington — a full English-language reference grammar, widely used alongside HSK study.</li>
</ul>
<h3>🌐 Free / official documentation</h3>
<ul>
<li><a href="https://resources.allsetlearning.com/chinese/grammar/Main_Page" target="_blank" rel="noopener">Chinese Grammar Wiki (AllSet Learning)</a> — searchable grammar points by HSK level, with example sentences.</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — look up any character/word, stroke order, pinyin.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@yoyochinese" target="_blank" rel="noopener">Yoyo Chinese</a> — clear grammar explanations with drills.</li>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — structured HSK-aligned grammar lessons.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — dictionary app with example sentences for every grammar pattern.</li>
<li><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a> — spaced repetition for sentence patterns, not just single words.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — word classes &amp; measure words, then the three "de" (的/地/得).</li>
<li><strong>Core skeleton</strong> — basic word order (SVO, time/place pre-verbal), then the four complement types.</li>
<li><strong>Marked structures</strong> — 把/被 sentences, comparison, existential &amp; pivotal sentences.</li>
<li><strong>Fluency layer</strong> — aspect particles 了/着/过, modal particles, adverbs, then conjunctions for complex sentences.</li>
</ol></div>`,
    `<span class="eyebrow">CHG401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Môn này dựng một bản đồ <strong>hệ thống</strong> của ngữ pháp tiếng Trung — từ loại, kết cấu cụm từ, mẫu câu, bổ ngữ, 把/被, trợ từ thể &amp; ngữ khí. Các giáo trình bên dưới được trích dẫn để tham khảo; không có file PDF nào được phát ở đây.</p>
<h3>📘 Giáo trình tham khảo (trích dẫn, không phát file)</h3>
<ul>
<li><em>现代汉语语法 (Ngữ pháp tiếng Hán hiện đại)</em> — tài liệu chuẩn về từ loại và cấu trúc câu.</li>
<li><em>A Grammar of Spoken Chinese</em> — Triệu Nguyên Nhiệm (Chao Yuen Ren) — ngữ pháp mô tả kinh điển của tiếng Trung nói.</li>
<li><em>Chinese: A Comprehensive Grammar</em> — Yip &amp; Rimmington — ngữ pháp tham khảo tiếng Anh đầy đủ, dùng song song với ôn HSK.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://resources.allsetlearning.com/chinese/grammar/Main_Page" target="_blank" rel="noopener">Chinese Grammar Wiki (AllSet Learning)</a> — tra điểm ngữ pháp theo cấp HSK, kèm câu ví dụ.</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — tra chữ/từ, thứ tự nét, pinyin.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@yoyochinese" target="_blank" rel="noopener">Yoyo Chinese</a> — giảng ngữ pháp rõ ràng kèm luyện tập.</li>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — bài giảng ngữ pháp bám chuẩn HSK.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển có câu ví dụ cho từng mẫu ngữ pháp.</li>
<li><a href="https://apps.ankiweb.net/" target="_blank" rel="noopener">Anki</a> — lặp lại ngắt quãng cho cả MẪU CÂU, không chỉ từ đơn.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — từ loại &amp; lượng từ, rồi ba chữ "de" (的/地/得).</li>
<li><strong>Khung câu lõi</strong> — trật tự cơ bản (SVO, thời gian/nơi chốn đứng trước động từ), rồi bốn loại bổ ngữ.</li>
<li><strong>Kết cấu đánh dấu</strong> — câu 把/被, câu so sánh, câu tồn hiện &amp; kiêm ngữ.</li>
<li><strong>Lớp trôi chảy</strong> — trợ từ thể 了/着/过, trợ từ ngữ khí, phó từ, rồi liên từ cho câu phức.</li>
</ol></div>`,
  ]]);

const intro = doc('chg401-0-1-overview', 'Course overview: Chinese Grammar|||Tổng quan: Ngữ pháp tiếng Trung',
  'Vì sao ngữ pháp tiếng Trung dựa vào trật tự từ & trợ từ chứ không chia động từ; lộ trình 8 chương từ từ loại đến câu phức.',
  [[
    `<span class="eyebrow">CHG401 · Lesson 0.1 · Overview</span>
<h2>Chinese Grammar — a systematic map</h2>
<p class="lead">Chinese verbs never conjugate — no tense, no person, no number agreement. All the grammatical work that European languages do with endings, Chinese does with <strong>word order</strong> and a small set of <strong>function words/particles</strong>. This course builds that system chapter by chapter, from single words up to complex sentences.</p>
<h3>The core idea</h3>
<ul>
<li><strong>Word order is grammar.</strong> Move a word and the meaning or grammaticality changes, even though no word itself changes form.</li>
<li><strong>Particles do the marking.</strong> 的/地/得 mark different phrase types; 了/着/过 mark aspect; 吗/呢/吧/啊 mark the speaker's attitude at the end of a sentence.</li>
<li><strong>Some structures reorder the default S-V-O</strong> on purpose — 把, 被, topic-comment — to shift emphasis onto a specific element.</li>
</ul>
<h3>Roadmap of this course</h3>
<p>Ch.1 word classes &amp; measure words (量词) → Ch.2 phrases with 的/地/得 → Ch.3 sentence elements &amp; basic word order (SVO, topic-comment) → Ch.4 the four complement types → Ch.5 把字句 &amp; 被字句 → Ch.6 comparative, existential &amp; pivotal sentences → Ch.7 aspect particles 了/着/过, modal particles &amp; adverbs → Ch.8 complex sentences with conjunction pairs &amp; system review. Every chapter has bilingual theory, real sentence examples (汉字 + pinyin + nghĩa), and a quiz.</p>`,
    `<span class="eyebrow">CHG401 · Bài 0.1 · Tổng quan</span>
<h2>Ngữ pháp tiếng Trung — một bản đồ hệ thống</h2>
<p class="lead">Động từ tiếng Trung không bao giờ chia dạng — không thì, không ngôi, không hoà hợp số. Toàn bộ việc mà các ngôn ngữ châu Âu làm bằng đuôi từ, tiếng Trung làm bằng <strong>trật tự từ</strong> và một nhóm nhỏ <strong>hư từ/trợ từ</strong>. Môn này dựng hệ thống đó theo từng chương, từ từ đơn tới câu phức.</p>
<h3>Ý tưởng cốt lõi</h3>
<ul>
<li><strong>Trật tự từ chính là ngữ pháp.</strong> Đổi vị trí một từ là đổi nghĩa hoặc đổi tính đúng-sai của câu, dù bản thân từ không đổi dạng.</li>
<li><strong>Trợ từ làm nhiệm vụ đánh dấu.</strong> 的/地/得 đánh dấu các loại cụm từ khác nhau; 了/着/过 đánh dấu thể (aspect); 吗/呢/吧/啊 đánh dấu thái độ người nói ở cuối câu.</li>
<li><strong>Một số kết cấu CỐ Ý đảo trật tự</strong> S-V-O mặc định — 把, 被, câu chủ đề — để dồn trọng tâm vào một thành phần cụ thể.</li>
</ul>
<h3>Lộ trình môn học</h3>
<p>Chương 1 từ loại &amp; lượng từ (量词) → Chương 2 cụm từ với 的/地/得 → Chương 3 thành phần câu &amp; trật tự cơ bản (SVO, câu chủ đề) → Chương 4 bốn loại bổ ngữ → Chương 5 把字句 &amp; 被字句 → Chương 6 câu so sánh, tồn hiện &amp; kiêm ngữ → Chương 7 trợ từ thể 了/着/过, trợ từ ngữ khí &amp; phó từ → Chương 8 câu phức với liên từ &amp; ôn tập hệ thống. Mỗi chương có lý thuyết song ngữ, ví dụ câu thật (汉字 + pinyin + nghĩa), và quiz.</p>`,
  ]]);

const c1 = doc('chg401-1-1-word-classes', 'Chapter 1 — Word classes & measure words (量词)|||Chương 1 — Từ loại tiếng Trung & lượng từ',
  'Danh từ, động từ (không chia dạng), tính từ làm vị ngữ trực tiếp; hệ thống lượng từ 量词 bắt buộc giữa số đếm và danh từ.',
  [[
    `<span class="eyebrow">CHG401 · Chapter 1 · Word classes</span>
<h2>Chinese word classes (词类) &amp; measure words (量词)</h2>
<p class="lead">Chinese words never change form for tense, number or case — grammar is carried by <strong>word order</strong> and small <strong>function words</strong>. This chapter maps the word classes every sentence is built from.</p>
<h3>1. Nouns, verbs, adjectives</h3>
<ul>
<li><strong>Noun (名词 míngcí)</strong> — a thing, person or place: 书 (shū, book), 老师 (lǎoshī, teacher).</li>
<li><strong>Verb (动词 dòngcí)</strong> — never conjugates; tense/aspect is added later by particles (了/着/过): 吃 (chī, to eat), 学习 (xuéxí, to study).</li>
<li><strong>Adjective (形容词 xíngróngcí)</strong> — can act as the WHOLE predicate without a verb "to be": 她很漂亮 (Tā hěn piàoliang) — She is very pretty. Here 很 (hěn, "very") is a required linking adverb, not necessarily strong emphasis — dropping it usually implies a contrast.</li>
</ul>
<h3>2. Measure words (量词 liàngcí) — the classifier system</h3>
<p>Chinese cannot say "one book" as *一书; a <strong>measure word</strong> must sit between the number and the noun: <strong>Number + Measure word + Noun</strong>.</p>
<pre><code>Number + Measure word + Noun
 一 (yī)  + 个 (gè)    + 人 (rén) = 一个人 (yí gè rén)    — one person
 三 (sān) + 本 (běn)   + 书 (shū) = 三本书 (sān běn shū)   — three books
 这 (zhè) + 张 (zhāng) + 纸 (zhǐ) = 这张纸 (zhè zhāng zhǐ) — this sheet of paper
</code></pre>
<table>
<tr><th>Measure word</th><th>Used for</th><th>Example</th></tr>
<tr><td>个 (gè)</td><td>general-purpose (people, generic objects)</td><td>一个人 yí gè rén — one person</td></tr>
<tr><td>本 (běn)</td><td>bound volumes</td><td>一本书 yì běn shū — one book</td></tr>
<tr><td>张 (zhāng)</td><td>flat objects</td><td>一张纸 yì zhāng zhǐ — one sheet of paper</td></tr>
<tr><td>杯 (bēi)</td><td>cup-shaped containers</td><td>这杯茶 zhè bēi chá — this cup of tea</td></tr>
<tr><td>只 (zhī)</td><td>animals</td><td>一只猫 yì zhī māo — one cat</td></tr>
<tr><td>件 (jiàn)</td><td>clothing / matters / items</td><td>一件衣服 yí jiàn yīfu — one item of clothing</td></tr>
</table>
<div class="callout"><span class="badge">Key rule</span> A number never modifies a noun directly in Chinese — the measure word is mandatory, and each noun has a "default" measure word to memorize alongside it.</div>`,
    `<span class="eyebrow">CHG401 · Chương 1 · Từ loại</span>
<h2>Từ loại tiếng Trung (词类) &amp; lượng từ (量词)</h2>
<p class="lead">Từ tiếng Trung không bao giờ đổi dạng theo thì, số hay cách — ngữ pháp nằm ở <strong>trật tự từ</strong> và các <strong>hư từ</strong> nhỏ. Chương này dựng bản đồ từ loại mà mọi câu được xây từ đó.</p>
<h3>1. Danh từ, động từ, tính từ</h3>
<ul>
<li><strong>Danh từ (名词 míngcí)</strong> — chỉ vật, người, nơi chốn: 书 (shū, sách), 老师 (lǎoshī, giáo viên).</li>
<li><strong>Động từ (动词 dòngcí)</strong> — không bao giờ chia dạng; thì/thể được thêm sau bằng trợ từ (了/着/过): 吃 (chī, ăn), 学习 (xuéxí, học).</li>
<li><strong>Tính từ (形容词 xíngróngcí)</strong> — có thể làm TOÀN BỘ vị ngữ mà không cần động từ "là": 她很漂亮 (Tā hěn piàoliang) — Cô ấy rất xinh. Ở đây 很 (hěn, "rất") là phó từ liên kết bắt buộc về ngữ pháp, không nhất thiết mang nghĩa nhấn mạnh — bỏ nó thường ngầm ý so sánh/tương phản.</li>
</ul>
<h3>2. Lượng từ (量词 liàngcí) — hệ thống phân loại</h3>
<p>Tiếng Trung không thể nói "một sách" kiểu *一书; một <strong>lượng từ</strong> phải đứng giữa số đếm và danh từ: <strong>Số + Lượng từ + Danh từ</strong>.</p>
<pre><code>Số + Lượng từ + Danh từ
 一 (yī)  + 个 (gè)    + 人 (rén) = 一个人 (yí gè rén)    — một người
 三 (sān) + 本 (běn)   + 书 (shū) = 三本书 (sān běn shū)   — ba quyển sách
 这 (zhè) + 张 (zhāng) + 纸 (zhǐ) = 这张纸 (zhè zhāng zhǐ) — tờ giấy này
</code></pre>
<table>
<tr><th>Lượng từ</th><th>Dùng cho</th><th>Ví dụ</th></tr>
<tr><td>个 (gè)</td><td>đa dụng (người, vật chung chung)</td><td>一个人 yí gè rén — một người</td></tr>
<tr><td>本 (běn)</td><td>vật đóng thành tập</td><td>一本书 yì běn shū — một quyển sách</td></tr>
<tr><td>张 (zhāng)</td><td>vật phẳng, mỏng</td><td>一张纸 yì zhāng zhǐ — một tờ giấy</td></tr>
<tr><td>杯 (bēi)</td><td>vật đựng hình cốc</td><td>这杯茶 zhè bēi chá — cốc trà này</td></tr>
<tr><td>只 (zhī)</td><td>động vật</td><td>一只猫 yì zhī māo — một con mèo</td></tr>
<tr><td>件 (jiàn)</td><td>quần áo / sự việc / món đồ</td><td>一件衣服 yí jiàn yīfu — một cái áo</td></tr>
</table>
<div class="callout"><span class="badge">Quy tắc chính</span> Số đếm KHÔNG BAO GIỜ đứng trực tiếp trước danh từ trong tiếng Trung — lượng từ là bắt buộc, và mỗi danh từ có một lượng từ "mặc định" cần học kèm.</div>`,
  ]]);

const c1q = quiz('chg401-quiz-1', 'Quiz 1 — Word classes & measure words|||Quiz 1 — Từ loại & lượng từ', [
  { id: 'q1', question: 'Động từ tiếng Trung (vd 吃 chī — ăn) có chia dạng theo thì hay ngôi không?', options: ['Có, chia theo 3 ngôi như tiếng Anh', 'Không, động từ không đổi dạng — thì/thể thêm bằng trợ từ', 'Chỉ chia ở thì quá khứ', 'Chỉ chia khi chủ ngữ số nhiều'], correctIndex: 1, explanation: 'Động từ tiếng Trung không chia dạng; thì/thể (aspect) được biểu đạt bằng trợ từ như 了/着/过.' },
  { id: 'q2', question: 'Cấu trúc bắt buộc khi dùng số đếm với danh từ trong tiếng Trung?', options: ['Số + Danh từ', 'Số + Lượng từ + Danh từ', 'Danh từ + Số', 'Lượng từ + Số + Danh từ'], correctIndex: 1, explanation: 'Phải có lượng từ đứng giữa số đếm và danh từ, ví dụ 三本书 (ba quyển sách).' },
  { id: 'q3', question: 'Trong câu "她很漂亮" (Tā hěn piàoliang — Cô ấy rất xinh), 很 giữ vai trò gì?', options: ['Động từ "là"', 'Phó từ liên kết bắt buộc trước tính từ làm vị ngữ', 'Lượng từ', 'Trợ từ ngữ khí cuối câu'], correctIndex: 1, explanation: 'Tính từ làm vị ngữ trực tiếp không cần 是 (là), nhưng thường cần 很 làm phó từ liên kết theo ngữ pháp.' },
]);

const c2 = doc('chg401-2-1-de-particles', 'Chapter 2 — Phrases & structures: 的 / 地 / 得|||Chương 2 — Cụm từ & kết cấu: định ngữ 的, trạng ngữ 地, bổ ngữ 得',
  'Ba chữ "de" cùng âm khác chữ: 的 nối định ngữ trước danh từ, 地 nối trạng ngữ trước động từ, 得 nối bổ ngữ sau động từ/tính từ.',
  [[
    `<span class="eyebrow">CHG401 · Chapter 2 · The three "de"</span>
<h2>Attributive 的, adverbial 地 &amp; complement 得</h2>
<p class="lead">Mandarin has three particles all pronounced <strong>de</strong> but written with different characters, each linking a different pair of word classes.</p>
<h3>1. 的 (de) — attributive marker: [modifier] 的 [noun]</h3>
<ul>
<li>Possession: 我的书 (wǒ de shū) — my book.</li>
<li>Description: 红色的花 (hóngsè de huā) — the red flower.</li>
<li>A whole clause can modify a noun too: 我昨天买的书 (wǒ zuótiān mǎi de shū) — the book [that] I bought yesterday.</li>
</ul>
<h3>2. 地 (de) — adverbial marker: [descriptive word] 地 [verb]</h3>
<p>地 turns a descriptive word into an adverb modifying the VERB that follows it: 慢慢地走 (mànmàn de zǒu) — walk slowly; 高兴地说 (gāoxìng de shuō) — say [it] happily.</p>
<h3>3. 得 (de) — complement marker: [verb/adjective] 得 [result or degree]</h3>
<p>得 comes AFTER the verb and introduces how the action turns out: 跑得很快 (pǎo de hěn kuài) — runs very fast; 说得很好 (shuō de hěn hǎo) — speaks very well.</p>
<pre><code>的  before a NOUN:   [modifier]        的 + NOUN   我的书 (my book)
地  before a VERB:   [descriptive]     地 + VERB   慢慢地走 (walk slowly)
得  after a VERB:    VERB/ADJ + 得 + [result/degree]  跑得很快 (run very fast)
</code></pre>
<div class="callout"><span class="badge">Memory hook</span> 的 stands BEFORE a noun, 地 stands BEFORE a verb, 得 stands AFTER a verb/adjective — position alone tells you which "de" to write.</div>`,
    `<span class="eyebrow">CHG401 · Chương 2 · Ba chữ "de"</span>
<h2>Định ngữ 的, trạng ngữ 地 &amp; bổ ngữ 得</h2>
<p class="lead">Tiếng phổ thông có ba trợ từ cùng đọc là <strong>de</strong> nhưng viết khác chữ, mỗi chữ nối một cặp từ loại khác nhau.</p>
<h3>1. 的 (de) — đánh dấu định ngữ: [từ bổ nghĩa] 的 [danh từ]</h3>
<ul>
<li>Sở hữu: 我的书 (wǒ de shū) — sách của tôi.</li>
<li>Miêu tả: 红色的花 (hóngsè de huā) — bông hoa màu đỏ.</li>
<li>Cả một mệnh đề cũng có thể bổ nghĩa cho danh từ: 我昨天买的书 (wǒ zuótiān mǎi de shū) — quyển sách [mà] tôi mua hôm qua.</li>
</ul>
<h3>2. 地 (de) — đánh dấu trạng ngữ: [từ miêu tả] 地 [động từ]</h3>
<p>地 biến một từ miêu tả thành trạng ngữ bổ nghĩa cho ĐỘNG TỪ đứng sau nó: 慢慢地走 (mànmàn de zǒu) — đi từ từ; 高兴地说 (gāoxìng de shuō) — nói [điều đó] một cách vui vẻ.</p>
<h3>3. 得 (de) — đánh dấu bổ ngữ: [động từ/tính từ] 得 [kết quả hoặc mức độ]</h3>
<p>得 đứng SAU động từ và giới thiệu hành động diễn ra thế nào: 跑得很快 (pǎo de hěn kuài) — chạy rất nhanh; 说得很好 (shuō de hěn hǎo) — nói rất giỏi.</p>
<pre><code>的  trước DANH TỪ:   [từ bổ nghĩa]      的 + DANH TỪ   我的书 (sách của tôi)
地  trước ĐỘNG TỪ:   [từ miêu tả]       地 + ĐỘNG TỪ   慢慢地走 (đi từ từ)
得  sau ĐỘNG TỪ:     ĐỘNG/TÍNH TỪ + 得 + [kết quả/mức độ]  跑得很快 (chạy rất nhanh)
</code></pre>
<div class="callout"><span class="badge">Mẹo nhớ</span> 的 đứng TRƯỚC danh từ, 地 đứng TRƯỚC động từ, 得 đứng SAU động từ/tính từ — chỉ cần nhìn vị trí là biết dùng "de" nào.</div>`,
  ]]);

const c2q = quiz('chg401-quiz-2', 'Quiz 2 — 的/地/得|||Quiz 2 — 的/地/得', [
  { id: 'q1', question: 'Câu "我___书" (sách của tôi) dùng chữ "de" nào?', options: ['的', '地', '得', 'Không cần "de"'], correctIndex: 0, explanation: '的 nối định ngữ sở hữu trước danh từ: 我的书.' },
  { id: 'q2', question: 'Câu "慢慢___走" (đi từ từ) dùng chữ "de" nào?', options: ['的', '地', '得', 'Không cần "de"'], correctIndex: 1, explanation: '地 nối trạng ngữ (từ miêu tả cách thức) trước động từ: 慢慢地走.' },
  { id: 'q3', question: 'Câu "跑___很快" (chạy rất nhanh) dùng chữ "de" nào và nó đứng ở đâu so với động từ?', options: ['的, trước động từ', '地, trước động từ', '得, SAU động từ', '的, sau động từ'], correctIndex: 2, explanation: '得 nối bổ ngữ kết quả/mức độ, luôn đứng SAU động từ hoặc tính từ: 跑得很快.' },
]);

const c3 = doc('chg401-3-1-word-order', 'Chapter 3 — Sentence elements & basic word order|||Chương 3 — Thành phần câu & trật tự cơ bản',
  'Trật tự SVO, thời gian/nơi chốn đứng TRƯỚC động từ (khác tiếng Anh), câu chủ đề (主题句) đưa tân ngữ lên đầu câu.',
  [[
    `<span class="eyebrow">CHG401 · Chapter 3 · Word order</span>
<h2>Sentence elements &amp; basic word order</h2>
<h3>1. Subject–Verb–Object (SVO)</h3>
<p>The default order is <strong>Subject + Verb + Object</strong>, the same skeleton as English: 我吃苹果 (Wǒ chī píngguǒ) — I eat an apple.</p>
<h3>2. Time &amp; place come BEFORE the verb</h3>
<p>Unlike English, time and place expressions sit between the subject and the verb, never at the end: <strong>Subject + Time + Place(在...) + Verb + Object</strong>.</p>
<pre><code>我   今天    在学校     学习。
Wǒ  jīntiān zài xuéxiào xuéxí.
I   today   at-school   study
= Today I study at school.
</code></pre>
<h3>3. Topic–comment sentences (主题句)</h3>
<p>Chinese often puts the item being talked ABOUT (the topic) first, even when it is logically the object: 这本书我看过了 (Zhè běn shū wǒ kàn guo le) — This book, I've already read [it]. The topic 这本书 leads the sentence even though it is the object of 看.</p>
<div class="callout"><span class="badge">Common learner mistake</span> Putting time/place at the end, as English does (*我学习在学校今天), is ungrammatical in Chinese — they must precede the verb.</div>`,
    `<span class="eyebrow">CHG401 · Chương 3 · Trật tự từ</span>
<h2>Thành phần câu &amp; trật tự cơ bản</h2>
<h3>1. Chủ ngữ–Động từ–Tân ngữ (SVO)</h3>
<p>Trật tự mặc định là <strong>Chủ ngữ + Động từ + Tân ngữ</strong>, giống khung tiếng Anh: 我吃苹果 (Wǒ chī píngguǒ) — Tôi ăn táo.</p>
<h3>2. Thời gian &amp; nơi chốn đứng TRƯỚC động từ</h3>
<p>Khác tiếng Anh, cụm từ chỉ thời gian và nơi chốn nằm giữa chủ ngữ và động từ, không bao giờ ở cuối câu: <strong>Chủ ngữ + Thời gian + Nơi chốn(在...) + Động từ + Tân ngữ</strong>.</p>
<pre><code>我   今天    在学校     学习。
Wǒ  jīntiān zài xuéxiào xuéxí.
Tôi hôm-nay ở-trường     học
= Hôm nay tôi học ở trường.
</code></pre>
<h3>3. Câu chủ đề (主题句)</h3>
<p>Tiếng Trung thường đưa thứ ĐANG ĐƯỢC NÓI TỚI (chủ đề) lên đầu câu, dù về mặt logic nó là tân ngữ: 这本书我看过了 (Zhè běn shū wǒ kàn guo le) — Quyển sách này tôi đã đọc rồi. Chủ đề 这本书 dẫn đầu câu dù nó là tân ngữ của 看.</p>
<div class="callout"><span class="badge">Lỗi thường gặp</span> Đặt thời gian/nơi chốn ở cuối câu như tiếng Anh (*我学习在学校今天) là SAI ngữ pháp trong tiếng Trung — chúng phải đứng trước động từ.</div>`,
  ]]);

const c3q = quiz('chg401-quiz-3', 'Quiz 3 — Word order|||Quiz 3 — Trật tự câu', [
  { id: 'q1', question: 'Trật tự đúng của "Hôm nay tôi học ở trường" trong tiếng Trung?', options: ['我在学校今天学习', '我今天在学校学习', '我学习今天在学校', '今天学习我在学校'], correctIndex: 1, explanation: 'Chủ ngữ + Thời gian + Nơi chốn(在) + Động từ: 我今天在学校学习.' },
  { id: 'q2', question: 'So với tiếng Anh, cụm từ chỉ nơi chốn/thời gian trong câu tiếng Trung đứng ở đâu?', options: ['Cuối câu, giống tiếng Anh', 'Trước động từ, giữa chủ ngữ và động từ', 'Đầu câu, trước cả chủ ngữ luôn', 'Sau tân ngữ'], correctIndex: 1, explanation: 'Đây là khác biệt lớn với tiếng Anh: thời gian/nơi chốn là "tiền động từ" trong tiếng Trung.' },
  { id: 'q3', question: 'Câu "这本书我看过了" (Quyển sách này tôi đã đọc rồi) minh hoạ kết cấu nào?', options: ['Câu bị động 被', 'Câu chữ 把', 'Câu chủ đề (主题句) — tân ngữ được đưa lên làm chủ đề', 'Câu so sánh 比'], correctIndex: 2, explanation: 'Tân ngữ logic (这本书) được đưa lên đầu làm chủ đề của câu, dù nó vẫn là tân ngữ của 看.' },
]);

const c4 = doc('chg401-4-1-complements', 'Chapter 4 — The four complement types (补语)|||Chương 4 — Các loại bổ ngữ',
  'Bổ ngữ kết quả (听懂), bổ ngữ xu hướng (进来/出去), bổ ngữ khả năng (得懂/不懂), bổ ngữ mức độ (得 + mức độ).',
  [[
    `<span class="eyebrow">CHG401 · Chapter 4 · Complements</span>
<h2>The four complement types (补语)</h2>
<p class="lead">A complement follows the verb to say how the action turns out. Chinese has four main kinds.</p>
<h3>1. Result complement (结果补语)</h3>
<p>A second verb/adjective glued right after the main verb states the RESULT: 听懂 (tīngdǒng, listen+understand). 我听懂了 (Wǒ tīngdǒng le) — I understood [what I heard].</p>
<h3>2. Directional complement (趋向补语)</h3>
<p>来/去 and compounds like 进来/出去 show the direction of motion relative to the speaker: 走进来 (zǒu jìnlái) — walk in (towards here); 拿出去 (ná chūqù) — take out (away from here).</p>
<h3>3. Potential complement (可能补语)</h3>
<p>Insert 得 (can) or 不 (cannot) between the verb and the result to say whether the result CAN happen: 听得懂 (tīng de dǒng) — can understand by listening; 听不懂 (tīng bu dǒng) — cannot understand.</p>
<h3>4. Degree complement (程度补语)</h3>
<p>得 + degree word describes HOW MUCH: 好极了 (hǎo jíle) — extremely good; 高兴得跳起来 (gāoxìng de tiào qǐlái) — so happy [he] jumped up.</p>
<pre><code>Result:      V + V/Adj                听懂 (hear + understand)
Directional: V + 来/去/进来/出去...    走进来 (walk in)
Potential:   V + 得/不 + Result        听得懂 / 听不懂
Degree:      V/Adj + 得 + degree       高兴得跳起来
</code></pre>
<div class="callout"><span class="badge">Compare</span> 听得懂 (potential: CAN understand) vs 听懂了 (result + 了: DID understand) — same core meaning "understand", different grammar for possibility vs a completed fact.</div>`,
    `<span class="eyebrow">CHG401 · Chương 4 · Bổ ngữ</span>
<h2>Bốn loại bổ ngữ (补语)</h2>
<p class="lead">Bổ ngữ đứng sau động từ để nói hành động diễn ra thế nào. Tiếng Trung có bốn loại chính.</p>
<h3>1. Bổ ngữ kết quả (结果补语)</h3>
<p>Một động từ/tính từ thứ hai gắn ngay sau động từ chính nêu KẾT QUẢ: 听懂 (tīngdǒng, nghe + hiểu). 我听懂了 (Wǒ tīngdǒng le) — Tôi đã nghe hiểu [rồi].</p>
<h3>2. Bổ ngữ xu hướng (趋向补语)</h3>
<p>来/去 và các tổ hợp như 进来/出去 chỉ hướng chuyển động so với người nói: 走进来 (zǒu jìnlái) — đi vào (hướng về đây); 拿出去 (ná chūqù) — mang ra (hướng ra xa).</p>
<h3>3. Bổ ngữ khả năng (可能补语)</h3>
<p>Chèn 得 (có thể) hoặc 不 (không thể) giữa động từ và kết quả để nói kết quả CÓ xảy ra được không: 听得懂 (tīng de dǒng) — nghe hiểu được; 听不懂 (tīng bu dǒng) — nghe không hiểu.</p>
<h3>4. Bổ ngữ mức độ (程度补语)</h3>
<p>得 + từ chỉ mức độ nói RẤT ĐẾN MỨC NÀO: 好极了 (hǎo jíle) — tốt cực kỳ; 高兴得跳起来 (gāoxìng de tiào qǐlái) — vui đến mức nhảy lên.</p>
<pre><code>Kết quả:    V + V/Tính từ            听懂 (nghe + hiểu)
Xu hướng:   V + 来/去/进来/出去...    走进来 (đi vào)
Khả năng:   V + 得/不 + Kết quả       听得懂 / 听不懂
Mức độ:     V/Tính từ + 得 + mức độ  高兴得跳起来
</code></pre>
<div class="callout"><span class="badge">So sánh</span> 听得懂 (khả năng: CÓ THỂ hiểu) khác 听懂了 (kết quả + 了: ĐÃ hiểu) — cùng gốc nghĩa "hiểu", nhưng một bên nói về khả năng, một bên nói về việc đã xảy ra.</div>`,
  ]]);

const c4q = quiz('chg401-quiz-4', 'Quiz 4 — Complements|||Quiz 4 — Bổ ngữ', [
  { id: 'q1', question: '"听懂" (tīngdǒng — nghe hiểu) là ví dụ của loại bổ ngữ nào?', options: ['Bổ ngữ kết quả', 'Bổ ngữ xu hướng', 'Bổ ngữ khả năng', 'Bổ ngữ mức độ'], correctIndex: 0, explanation: '懂 (hiểu) gắn ngay sau 听 (nghe) nêu KẾT QUẢ của hành động nghe.' },
  { id: 'q2', question: '"听得懂" và "听不懂" khác nhau ở điểm nào?', options: ['Thì quá khứ và hiện tại', 'CÓ THỂ hiểu và KHÔNG THỂ hiểu (bổ ngữ khả năng)', 'Chủ ngữ số ít và số nhiều', 'Không khác gì cả'], correctIndex: 1, explanation: '得/不 chèn giữa động từ và kết quả tạo bổ ngữ khả năng: có thể / không thể.' },
  { id: 'q3', question: 'Câu "高兴得跳起来" (vui đến mức nhảy lên) là loại bổ ngữ nào?', options: ['Kết quả', 'Xu hướng', 'Khả năng', 'Mức độ'], correctIndex: 3, explanation: '得 + cụm diễn tả mức độ (nhảy lên) sau tính từ 高兴 (vui) là bổ ngữ mức độ.' },
]);

const c5 = doc('chg401-5-1-ba-bei', 'Chapter 5 — 把 (bǎ) disposal sentences & 被 (bèi) passive|||Chương 5 — Câu chữ 把 & câu bị động 被',
  'Câu 把: S + 把 + O(xác định) + V + thành phần khác. Câu bị động 被: người/vật chịu tác động + 被 + (tác nhân) + V + thành phần khác.',
  [[
    `<span class="eyebrow">CHG401 · Chapter 5 · 把 & 被</span>
<h2>The 把 (bǎ) disposal sentence &amp; the 被 (bèi) passive</h2>
<h3>1. 把字句 — the 把 sentence</h3>
<p>Normal order is S+V+O, but to stress WHAT HAPPENS TO a specific, already-known object, Chinese moves it in front of the verb with 把: <strong>Subject + 把 + Object + Verb + other element</strong>.</p>
<pre><code>我 把 书 放在   桌子上。
Wǒ bǎ shū fàng zài zhuōzi shàng.
I  BA book put-at table-on
= I put the book on the table.
</code></pre>
<p>Two conditions: the object after 把 must be <strong>definite</strong> (a specific, known book — not just "a book"), and the verb cannot stand bare — it needs a complement, 了, or a duplicated form.</p>
<h3>2. 被字句 — the passive sentence</h3>
<p>The receiver of the action becomes the subject; the doer (optional) follows 被: <strong>Patient + 被 + (Agent) + Verb + other element</strong>.</p>
<pre><code>杯子   被   他  打破 了。
Bēizi bèi  tā  dǎpò le.
cup   BEI  him break-PFV
= The cup was broken by him.
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> 把 emphasizes the disposal/result of a definite object; 被 marks a true passive. Both require the verb to carry a complement/aspect marker — a bare verb after 把 or 被 is ungrammatical.</div>`,
    `<span class="eyebrow">CHG401 · Chương 5 · 把 & 被</span>
<h2>Câu chữ 把 (bǎ) &amp; câu bị động 被 (bèi)</h2>
<h3>1. 把字句 — câu chữ 把</h3>
<p>Trật tự thường là S+V+O, nhưng để nhấn mạnh ĐIỀU GÌ XẢY RA VỚI một tân ngữ xác định, đã biết trước, tiếng Trung đưa nó lên trước động từ bằng 把: <strong>Chủ ngữ + 把 + Tân ngữ + Động từ + thành phần khác</strong>.</p>
<pre><code>我 把 书 放在   桌子上。
Wǒ bǎ shū fàng zài zhuōzi shàng.
Tôi BA sách để-tại  bàn-trên
= Tôi để quyển sách lên bàn.
</code></pre>
<p>Hai điều kiện: tân ngữ sau 把 phải <strong>xác định</strong> (một quyển sách cụ thể, đã biết — không phải "một quyển sách" chung chung), và động từ không được đứng trơ trọi — nó cần bổ ngữ, 了, hoặc dạng láy.</p>
<h3>2. 被字句 — câu bị động</h3>
<p>Vật/người chịu tác động trở thành chủ ngữ; tác nhân (có thể lược bỏ) đứng sau 被: <strong>Bên chịu tác động + 被 + (Tác nhân) + Động từ + thành phần khác</strong>.</p>
<pre><code>杯子   被   他  打破 了。
Bēizi bèi  tā  dǎpò le.
cốc   BỊ   anh-ấy làm-vỡ  rồi
= Cái cốc bị anh ấy làm vỡ.
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> 把 nhấn mạnh việc xử lý/kết quả của một tân ngữ xác định; 被 đánh dấu câu bị động thật sự. Cả hai đều đòi hỏi động từ mang bổ ngữ/trợ từ thể — động từ trơ trọi sau 把 hoặc 被 là SAI ngữ pháp.</div>`,
  ]]);

const c5q = quiz('chg401-quiz-5', 'Quiz 5 — 把 & 被|||Quiz 5 — Câu 把 & câu 被', [
  { id: 'q1', question: 'Trong câu "我把书放在桌子上", tân ngữ sau 把 phải như thế nào?', options: ['Bất kỳ, không cần rõ ràng', 'Xác định — một quyển sách cụ thể, đã biết', 'Luôn là đại từ nhân xưng', 'Không được có tân ngữ'], correctIndex: 1, explanation: 'Câu 把 đòi hỏi tân ngữ xác định (definite) — vật cụ thể người nghe đã biết.' },
  { id: 'q2', question: 'Câu "杯子被他打破了" nghĩa là gì?', options: ['Anh ấy làm vỡ cái cốc (chủ động)', 'Cái cốc bị anh ấy làm vỡ (bị động)', 'Cái cốc không bị vỡ', 'Anh ấy mua một cái cốc'], correctIndex: 1, explanation: '被 đánh dấu câu bị động: chủ ngữ 杯子 (cốc) chịu tác động từ tác nhân 他 (anh ấy).' },
  { id: 'q3', question: 'Điều kiện chung của cả câu 把 và câu 被 về động từ là gì?', options: ['Động từ phải đứng trơ trọi, không thêm gì', 'Động từ phải mang bổ ngữ/trợ từ thể (vd 了, 在...上)', 'Không được dùng động từ chuyển động', 'Động từ phải ở đầu câu'], correctIndex: 1, explanation: 'Một động từ trơ trọi (không bổ ngữ, không 了...) sau 把 hoặc 被 là câu sai ngữ pháp.' },
]);

const c6 = doc('chg401-6-1-comparative-existential-pivotal', 'Chapter 6 — Comparative, existential & pivotal sentences|||Chương 6 — Câu so sánh, câu tồn hiện & câu kiêm ngữ',
  'Câu so sánh 比 (A比B+tính từ), câu tồn hiện (nơi chốn+有/是/V着+vật), câu kiêm ngữ (S1+V1+O1=S2+V2, vd 叫/让/请).',
  [[
    `<span class="eyebrow">CHG401 · Chapter 6 · Three sentence types</span>
<h2>Comparative, existential &amp; pivotal sentences</h2>
<h3>1. Comparative sentences with 比 (bǐ)</h3>
<p><strong>A + 比 + B + Adjective</strong>: 他比我高 (Tā bǐ wǒ gāo) — He is taller than me. Add a degree word AFTER the adjective for "by how much": 他比我高一点 (Tā bǐ wǒ gāo yìdiǎn) — He's a little taller than me. Negative equality uses 没有: 他没有我高 (Tā méiyǒu wǒ gāo) — He isn't as tall as me.</p>
<h3>2. Existential sentences (存现句)</h3>
<p>To say something EXISTS at a place, the place comes first: <strong>Place + 有/是/Verb-着 + Object</strong>. 桌子上有一本书 (Zhuōzi shàng yǒu yì běn shū) — There's a book on the table. 墙上挂着一张画 (Qiáng shàng guà zhe yì zhāng huà) — A painting is hanging on the wall.</p>
<h3>3. Pivotal sentences (兼语句)</h3>
<p>One word is simultaneously the OBJECT of the first verb and the SUBJECT of the second: <strong>S1 + V1 + O1/S2 + V2</strong>. 老师叫我回答问题 (Lǎoshī jiào wǒ huídá wèntí) — The teacher told me to answer the question — 我 (me) is both what the teacher called AND who answers.</p>
<pre><code>Comparative: A + 比 + B + Adj(+degree)   他比我高一点
Existential: Place + 有/是/V着 + Object   桌子上有一本书
Pivotal:     S1 + V1 + O1(=S2) + V2      老师叫我回答问题
</code></pre>
<div class="callout"><span class="badge">Common pivotal verbs</span> 叫 (jiào, tell/call), 让 (ràng, let/make), 请 (qǐng, invite/ask) all introduce a pivotal structure.</div>`,
    `<span class="eyebrow">CHG401 · Chương 6 · Ba loại câu</span>
<h2>Câu so sánh, câu tồn hiện &amp; câu kiêm ngữ</h2>
<h3>1. Câu so sánh với 比 (bǐ)</h3>
<p><strong>A + 比 + B + Tính từ</strong>: 他比我高 (Tā bǐ wǒ gāo) — Anh ấy cao hơn tôi. Thêm từ chỉ mức độ SAU tính từ để nói "hơn bao nhiêu": 他比我高一点 (Tā bǐ wǒ gāo yìdiǎn) — Anh ấy cao hơn tôi một chút. So sánh "không bằng" dùng 没有: 他没有我高 (Tā méiyǒu wǒ gāo) — Anh ấy không cao bằng tôi.</p>
<h3>2. Câu tồn hiện (存现句)</h3>
<p>Để nói một thứ TỒN TẠI ở một nơi, nơi chốn đứng đầu câu: <strong>Nơi chốn + 有/是/Động từ-着 + Vật</strong>. 桌子上有一本书 (Zhuōzi shàng yǒu yì běn shū) — Trên bàn có một quyển sách. 墙上挂着一张画 (Qiáng shàng guà zhe yì zhāng huà) — Trên tường treo một bức tranh.</p>
<h3>3. Câu kiêm ngữ (兼语句)</h3>
<p>Một từ vừa là TÂN NGỮ của động từ thứ nhất, vừa là CHỦ NGỮ của động từ thứ hai: <strong>S1 + V1 + O1/S2 + V2</strong>. 老师叫我回答问题 (Lǎoshī jiào wǒ huídá wèntí) — Giáo viên gọi tôi trả lời câu hỏi — 我 (tôi) vừa là người được gọi vừa là người trả lời.</p>
<pre><code>So sánh:    A + 比 + B + Tính từ(+mức độ)  他比我高一点
Tồn hiện:   Nơi chốn + 有/是/V着 + Vật      桌子上有一本书
Kiêm ngữ:   S1 + V1 + O1(=S2) + V2         老师叫我回答问题
</code></pre>
<div class="callout"><span class="badge">Động từ kiêm ngữ thường gặp</span> 叫 (jiào, bảo/gọi), 让 (ràng, để cho/khiến), 请 (qǐng, mời/nhờ) đều mở đầu một kết cấu kiêm ngữ.</div>`,
  ]]);

const c6q = quiz('chg401-quiz-6', 'Quiz 6 — Comparative/existential/pivotal|||Quiz 6 — So sánh/tồn hiện/kiêm ngữ', [
  { id: 'q1', question: 'Cấu trúc so sánh "hơn" trong tiếng Trung là gì?', options: ['A + 没有 + B + tính từ', 'A + 比 + B + tính từ', 'A + 是 + B + tính từ', '比 + A + B + tính từ'], correctIndex: 1, explanation: '他比我高 (A比B高) — cấu trúc so sánh hơn cơ bản dùng 比.' },
  { id: 'q2', question: 'Câu "桌子上有一本书" (Trên bàn có một quyển sách) là loại câu gì, và thành phần nào đứng đầu?', options: ['Câu so sánh; tính từ đứng đầu', 'Câu tồn hiện; nơi chốn đứng đầu', 'Câu bị động; tân ngữ đứng đầu', 'Câu kiêm ngữ; động từ đứng đầu'], correctIndex: 1, explanation: 'Câu tồn hiện (存现句) đặt nơi chốn ở đầu câu, theo sau là 有/là/động từ-着 rồi đến vật.' },
  { id: 'q3', question: 'Trong câu kiêm ngữ "老师叫我回答问题", từ "我" giữ vai trò gì?', options: ['Chỉ là chủ ngữ của cả câu', 'Vừa là tân ngữ của 叫, vừa là chủ ngữ của 回答', 'Chỉ là tân ngữ của 回答', 'Không có vai trò ngữ pháp'], correctIndex: 1, explanation: 'Đặc trưng câu kiêm ngữ: một từ đảm nhiệm hai vai trò — tân ngữ của động từ 1 và chủ ngữ của động từ 2.' },
]);

const c7 = doc('chg401-7-1-aspect-particles', 'Chapter 7 — Aspect particles 了/着/过, modal particles & adverbs|||Chương 7 — Trợ từ ngữ khí, trợ từ thể 了/着/过 & phó từ',
  'Thể (aspect) không phải thì: 了 hoàn thành, 着 tiếp diễn, 过 từng trải; trợ từ ngữ khí 吗/呢/吧/啊; phó từ 都/也/就/才/很/太.',
  [[
    `<span class="eyebrow">CHG401 · Chapter 7 · Aspect & modal particles</span>
<h2>Aspect particles 了/着/过, modal particles &amp; adverbs</h2>
<h3>1. Aspect, not tense</h3>
<p>Chinese verbs mark ASPECT (how an action unfolds), not tense (when). Three core aspect particles:</p>
<ul>
<li><strong>了 (le)</strong> — completed action: 他吃了饭 (Tā chī le fàn) — He ate [finished eating].</li>
<li><strong>着 (zhe)</strong> — ongoing/continuous state: 他坐着 (Tā zuò zhe) — He is sitting [in the state of sitting].</li>
<li><strong>过 (guo)</strong> — past experience, "have ever...": 我去过中国 (Wǒ qùguo Zhōngguó) — I have been to China [at some point].</li>
</ul>
<h3>2. Modal particles (语气助词) — end-of-sentence attitude</h3>
<ul>
<li><strong>吗 (ma)</strong> — turns a statement into a yes/no question: 你忙吗? (Nǐ máng ma?) — Are you busy?</li>
<li><strong>呢 (ne)</strong> — question follow-up / continuation: 你呢? (Nǐ ne?) — And you?</li>
<li><strong>吧 (ba)</strong> — suggestion/softened tone: 我们走吧 (Wǒmen zǒu ba) — Let's go.</li>
<li><strong>啊 (a)</strong> — emphasis/exclamation: 真漂亮啊! (Zhēn piàoliang a!) — So pretty!</li>
</ul>
<h3>3. Key adverbs (副词)</h3>
<p>都 (dōu, all), 也 (yě, also), 就 (jiù, then/as early as), 才 (cái, only then/as late as), 很 (hěn, very), 太 (tài, too) — these sit BEFORE the verb/adjective they modify, never after.</p>
<div class="callout"><span class="badge">了 vs 过</span> 他去了北京 (he went to Beijing — a completed trip, possibly still there) vs 他去过北京 (he has been to Beijing — an experience, now in the past, he's back).</div>`,
    `<span class="eyebrow">CHG401 · Chương 7 · Trợ từ thể & ngữ khí</span>
<h2>Trợ từ thể 了/着/过, trợ từ ngữ khí &amp; phó từ</h2>
<h3>1. Thể (aspect), không phải thì (tense)</h3>
<p>Động từ tiếng Trung đánh dấu THỂ (hành động diễn ra như thế nào), không phải THÌ (khi nào). Ba trợ từ thể cốt lõi:</p>
<ul>
<li><strong>了 (le)</strong> — hành động đã hoàn thành: 他吃了饭 (Tā chī le fàn) — Anh ấy đã ăn cơm [xong].</li>
<li><strong>着 (zhe)</strong> — trạng thái đang tiếp diễn: 他坐着 (Tā zuò zhe) — Anh ấy đang ngồi [ở trạng thái ngồi].</li>
<li><strong>过 (guo)</strong> — kinh nghiệm đã từng: 我去过中国 (Wǒ qùguo Zhōngguó) — Tôi đã từng đi Trung Quốc [ít nhất một lần].</li>
</ul>
<h3>2. Trợ từ ngữ khí (语气助词) — thái độ cuối câu</h3>
<ul>
<li><strong>吗 (ma)</strong> — biến câu trần thuật thành câu hỏi có/không: 你忙吗? (Nǐ máng ma?) — Bạn có bận không?</li>
<li><strong>呢 (ne)</strong> — hỏi tiếp/duy trì chủ đề: 你呢? (Nǐ ne?) — Còn bạn thì sao?</li>
<li><strong>吧 (ba)</strong> — đề nghị/làm mềm giọng điệu: 我们走吧 (Wǒmen zǒu ba) — Chúng ta đi thôi.</li>
<li><strong>啊 (a)</strong> — nhấn mạnh/cảm thán: 真漂亮啊! (Zhēn piàoliang a!) — Đẹp thật đấy!</li>
</ul>
<h3>3. Phó từ quan trọng (副词)</h3>
<p>都 (dōu, đều/tất cả), 也 (yě, cũng), 就 (jiù, thì/ngay/sớm), 才 (cái, mới/muộn), 很 (hěn, rất), 太 (tài, quá) — các phó từ này đứng TRƯỚC động từ/tính từ mà chúng bổ nghĩa, không bao giờ đứng sau.</p>
<div class="callout"><span class="badge">了 khác 过</span> 他去了北京 (anh ấy đã đi Bắc Kinh — chuyến đi đã hoàn thành, có thể vẫn còn ở đó) khác 他去过北京 (anh ấy đã từng đi Bắc Kinh — một kinh nghiệm, giờ đã về).</div>`,
  ]]);

const c7q = quiz('chg401-quiz-7', 'Quiz 7 — Aspect & modal particles|||Quiz 7 — Trợ từ thể & ngữ khí', [
  { id: 'q1', question: 'Trợ từ nào đánh dấu HÀNH ĐỘNG ĐANG TIẾP DIỄN, ví dụ "他坐着" (Anh ấy đang ngồi)?', options: ['了 (le)', '着 (zhe)', '过 (guo)', '吗 (ma)'], correctIndex: 1, explanation: '着 diễn tả trạng thái tiếp diễn/liên tục của hành động.' },
  { id: 'q2', question: '"我去过中国" (Tôi đã từng đi Trung Quốc) khác "我去了中国" ở điểm nào?', options: ['Không khác gì, chỉ là hai cách viết', '过 nhấn mạnh KINH NGHIỆM từng trải, 了 nhấn mạnh hành động đã HOÀN THÀNH', '过 dùng cho tương lai, 了 dùng cho quá khứ', '过 chỉ dùng với động vật'], correctIndex: 1, explanation: '过 = đã từng có kinh nghiệm; 了 = hành động đã hoàn thành, có thể vẫn đang ở trạng thái đó.' },
  { id: 'q3', question: 'Trợ từ ngữ khí nào biến một câu trần thuật thành câu hỏi có/không?', options: ['呢 (ne)', '吧 (ba)', '吗 (ma)', '啊 (a)'], correctIndex: 2, explanation: '吗 đặt cuối câu trần thuật để tạo câu hỏi yes/no, ví dụ 你忙吗?' },
]);

const c8 = doc('chg401-8-1-complex-sentences', 'Chapter 8 — Complex sentences, conjunctions & system review|||Chương 8 — Câu phức, liên từ & ôn tập hệ thống ngữ pháp',
  'Cặp liên từ 因为...所以.../虽然...但是.../如果...就.../不但...而且...; ghép toàn bộ 8 chương thành một hệ thống phân tích câu.',
  [[
    `<span class="eyebrow">CHG401 · Chapter 8 · Complex sentences & review</span>
<h2>Complex sentences, conjunction pairs &amp; system review</h2>
<h3>1. Paired conjunctions (关联词)</h3>
<table>
<tr><th>Pattern</th><th>Meaning</th><th>Example</th></tr>
<tr><td>因为...所以... (yīnwèi...suǒyǐ...)</td><td>because...so...</td><td>因为下雨，所以我没去。(Yīnwèi xiàyǔ, suǒyǐ wǒ méi qù.) — Because it rained, I didn't go.</td></tr>
<tr><td>虽然...但是... (suīrán...dànshì...)</td><td>although...but...</td><td>虽然很累，但是他继续工作。(Suīrán hěn lèi, dànshì tā jìxù gōngzuò.) — Although tired, he kept working.</td></tr>
<tr><td>如果...就... (rúguǒ...jiù...)</td><td>if...then...</td><td>如果明天下雨，我们就不去。(Rúguǒ míngtiān xiàyǔ, wǒmen jiù bú qù.) — If it rains tomorrow, we won't go.</td></tr>
<tr><td>不但...而且... (búdàn...érqiě...)</td><td>not only...but also...</td><td>他不但聪明，而且努力。(Tā búdàn cōngming, érqiě nǔlì.) — He's not only smart but also hardworking.</td></tr>
</table>
<h3>2. Putting the system together</h3>
<p>A full Chinese sentence is built by layering everything in this course: word classes &amp; measure words (Ch.1) → 的/地/得 phrases (Ch.2) → SVO order with time/place pre-verbal (Ch.3) → complements to state results (Ch.4) → 把/被 to reorganize focus (Ch.5) → comparison/existence/pivotal structures (Ch.6) → aspect &amp; modal particles for nuance (Ch.7) → conjunctions to link clauses (Ch.8).</p>
<div class="callout"><span class="badge">Study tip</span> When you meet a new sentence, ask in order: what's the topic/subject? where's the verb? does it have a complement? which "de"? which aspect particle? — this system always applies.</div>`,
    `<span class="eyebrow">CHG401 · Chương 8 · Câu phức & ôn tập</span>
<h2>Câu phức, cặp liên từ &amp; ôn tập hệ thống</h2>
<h3>1. Cặp liên từ (关联词)</h3>
<table>
<tr><th>Mẫu</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td>因为...所以... (yīnwèi...suǒyǐ...)</td><td>vì...nên...</td><td>因为下雨，所以我没去。(Yīnwèi xiàyǔ, suǒyǐ wǒ méi qù.) — Vì trời mưa, nên tôi không đi.</td></tr>
<tr><td>虽然...但是... (suīrán...dànshì...)</td><td>mặc dù...nhưng...</td><td>虽然很累，但是他继续工作。(Suīrán hěn lèi, dànshì tā jìxù gōngzuò.) — Mặc dù rất mệt, nhưng anh ấy vẫn tiếp tục làm việc.</td></tr>
<tr><td>如果...就... (rúguǒ...jiù...)</td><td>nếu...thì...</td><td>如果明天下雨，我们就不去。(Rúguǒ míngtiān xiàyǔ, wǒmen jiù bú qù.) — Nếu ngày mai trời mưa, chúng tôi sẽ không đi.</td></tr>
<tr><td>不但...而且... (búdàn...érqiě...)</td><td>không những...mà còn...</td><td>他不但聪明，而且努力。(Tā búdàn cōngming, érqiě nǔlì.) — Anh ấy không những thông minh mà còn chăm chỉ.</td></tr>
</table>
<h3>2. Ghép cả hệ thống lại</h3>
<p>Một câu tiếng Trung hoàn chỉnh được xây bằng cách xếp chồng mọi thứ trong môn này: từ loại &amp; lượng từ (Chương 1) → cụm từ 的/地/得 (Chương 2) → trật tự SVO với thời gian/nơi chốn trước động từ (Chương 3) → bổ ngữ để nêu kết quả (Chương 4) → 把/被 để tổ chức lại trọng tâm (Chương 5) → kết cấu so sánh/tồn hiện/kiêm ngữ (Chương 6) → trợ từ thể &amp; ngữ khí để thêm sắc thái (Chương 7) → liên từ để nối mệnh đề (Chương 8).</p>
<div class="callout"><span class="badge">Mẹo học</span> Gặp một câu mới, hỏi theo thứ tự: chủ đề/chủ ngữ là gì? động từ ở đâu? có bổ ngữ không? "de" nào? trợ từ thể nào? — hệ thống này luôn áp dụng được.</div>`,
  ]]);

const c8q = quiz('chg401-quiz-8', 'Quiz 8 — Complex sentences & review|||Quiz 8 — Câu phức & ôn tập', [
  { id: 'q1', question: 'Cặp liên từ nào diễn tả quan hệ "mặc dù...nhưng..."?', options: ['因为...所以...', '虽然...但是...', '如果...就...', '不但...而且...'], correctIndex: 1, explanation: '虽然...但是... (suīrán...dànshì...) là cặp liên từ nhượng bộ "mặc dù...nhưng...".' },
  { id: 'q2', question: 'Câu "他不但聪明，而且努力" nghĩa là gì?', options: ['Anh ấy vừa thông minh vừa lười biếng', 'Anh ấy không những thông minh mà còn chăm chỉ', 'Anh ấy không thông minh cũng không chăm chỉ', 'Nếu anh ấy thông minh thì sẽ chăm chỉ'], correctIndex: 1, explanation: '不但...而且... (búdàn...érqiě...) diễn tả "không những...mà còn...", thêm một đặc điểm tích cực nữa.' },
  { id: 'q3', question: 'Theo hệ thống ôn tập của môn, khi gặp một câu tiếng Trung mới nên hỏi theo thứ tự nào trước tiên?', options: ['Câu có bao nhiêu chữ Hán?', 'Chủ đề/chủ ngữ là gì, rồi động từ ở đâu, có bổ ngữ không, "de" nào, trợ từ thể nào', 'Câu có vần với câu trước không?', 'Câu dùng bao nhiêu lượng từ?'], correctIndex: 1, explanation: 'Đây là quy trình phân tích câu hệ thống được tổng kết ở Chương 8, gộp lại toàn bộ 7 chương trước.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CHG401',
    slug: 'chg401-chinese-grammar',
    title: 'Chinese Grammar',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHG401.webp',
    shortDescription: 'Systematic Chinese grammar: word classes & measure words (量词), phrases with 的/地/得, basic word order (SVO, topic-comment), the 4 complement types, 把/被 sentences, comparative/existential/pivotal sentences, aspect particles 了/着/过 & modal particles, complex sentences.|||Ngữ pháp tiếng Trung hệ thống: từ loại & lượng từ (量词), cụm từ 的/地/得, trật tự câu cơ bản (SVO, câu chủ đề), 4 loại bổ ngữ, câu 把/被, câu so sánh/tồn hiện/kiêm ngữ, trợ từ thể 了/着/过 & ngữ khí, câu phức.',
    description: 'Môn <strong>CHG401 — Chinese Grammar</strong> (Ngữ pháp tiếng Trung, kỳ 5, ngành Ngôn ngữ Trung) dựng <strong>hệ thống ngữ pháp toàn diện</strong> chứ không phải một khoá hội thoại. Từ <strong>từ loại &amp; lượng từ 量词</strong> → <strong>cụm từ với 的/地/得</strong> → <strong>thành phần câu &amp; trật tự cơ bản</strong> (SVO, thời gian/nơi chốn trước động từ, câu chủ đề) → <strong>bốn loại bổ ngữ</strong> (kết quả/xu hướng/khả năng/mức độ) → <strong>câu chữ 把 &amp; câu bị động 被</strong> → <strong>câu so sánh, tồn hiện &amp; kiêm ngữ</strong> → <strong>trợ từ thể 了/着/过, trợ từ ngữ khí &amp; phó từ</strong> → <strong>câu phức với liên từ</strong>. Mỗi chương có lý thuyết song ngữ kèm ví dụ câu chữ Hán + pinyin có dấu thanh + nghĩa Việt, và quiz. Tham khảo 现代汉语语法, A Grammar of Spoken Chinese (Chao Yuen Ren), Chinese: A Comprehensive Grammar (Yip &amp; Rimmington).',
    whatYouLearn: 'Từ loại tiếng Trung & hệ thống lượng từ 量词; ba chữ "de" (的 định ngữ / 地 trạng ngữ / 得 bổ ngữ); trật tự câu cơ bản SVO, thời gian/nơi chốn trước động từ, câu chủ đề; bốn loại bổ ngữ (kết quả/xu hướng/khả năng/mức độ); câu chữ 把 (把字句) & câu bị động 被 (被字句); câu so sánh 比, câu tồn hiện, câu kiêm ngữ; trợ từ thể 了/着/过 & trợ từ ngữ khí 吗/呢/吧/啊, phó từ; câu phức với cặp liên từ (因为...所以.../虽然...但是.../如果...就.../不但...而且...).',
    requirements: 'Đã học qua tiếng Trung sơ cấp (từ vựng & pinyin cơ bản, tương đương HSK1-2, vd CHN113/CHN123). Nên có từ điển Pleco hoặc hanzii.net để tra ví dụ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình tham khảo (现代汉语语法, Chao Yuen Ren, Yip & Rimmington), Chinese Grammar Wiki, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao ngữ pháp tiếng Trung dựa vào trật tự từ & trợ từ; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Từ loại & lượng từ|||Chapter 1 — Word classes & measure words', description: 'Danh/động/tính từ, hệ thống lượng từ 量词 bắt buộc.', lessons: [c1, c1q] },
    { title: 'Chương 2 — 的/地/得|||Chapter 2 — 的/地/得', description: 'Định ngữ 的, trạng ngữ 地, bổ ngữ 得.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thành phần câu & trật tự|||Chapter 3 — Sentence elements & word order', description: 'SVO, thời gian/nơi chốn trước động từ, câu chủ đề.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Các loại bổ ngữ|||Chapter 4 — Complement types', description: 'Kết quả, xu hướng, khả năng, mức độ.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Câu 把 & câu 被|||Chapter 5 — 把 & 被 sentences', description: 'Câu chữ 把, câu bị động 被.', lessons: [c5, c5q] },
    { title: 'Chương 6 — So sánh, tồn hiện & kiêm ngữ|||Chapter 6 — Comparative/existential/pivotal', description: 'Câu 比, câu tồn hiện, câu kiêm ngữ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Trợ từ thể & ngữ khí|||Chapter 7 — Aspect & modal particles', description: '了/着/过, 吗/呢/吧/啊, phó từ.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Câu phức & ôn tập|||Chapter 8 — Complex sentences & review', description: 'Cặp liên từ, ôn tập toàn hệ thống.', lessons: [c8, c8q] },
  ],
};
