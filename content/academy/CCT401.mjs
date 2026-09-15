/**
 * CCT401 — Chinese Translation and Interpretation 1 (Biên - Phiên dịch tiếng
 * Trung 1). Ngành Ngôn ngữ Trung, FPTU, Kỳ 4. Nhập môn dịch thuật Trung-Việt:
 * 8 chương lý thuyết + ví dụ dịch song ngữ 汉语↔Việt, bám 汉越翻译教程 và
 * 翻译理论与实践 (张培基). Song ngữ EN/VN (.ml-en/.ml-vi).
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ trong nội dung.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

/* ══════════════════ CHƯƠNG 1 — Tổng quan dịch thuật & tiêu chí 信达雅 ══════════════════ */
const c1 = doc('cct401-1-1-tin-dat-nha', '1.1 — Overview of translation & the 信达雅 criteria|||1.1 — Tổng quan dịch thuật & tiêu chí 信达雅 (tín-đạt-nhã)',
  '笔译 (biên dịch, viết) và 口译 (phiên dịch, nói); ba tiêu chí 信达雅 (tín-đạt-nhã) của Nghiêm Phục (严复); ví dụ minh hoạ từng tiêu chí.',
  [[
    `<span class="eyebrow">CCT401 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of translation &amp; the 信达雅 criteria</h2>
<p class="lead"><strong>翻译 (fānyì)</strong> — translation in general — splits into <strong>笔译 (bǐyì)</strong>, written translation, and <strong>口译 (kǒuyì)</strong>, oral interpretation. CCT401 opens with the classic quality standard almost every Chinese translation course starts from.</p>
<h3>严复 and the 信达雅 standard</h3>
<p>Late-Qing scholar <strong>严复 (Yán Fù)</strong>, translating Huxley's <em>Evolution and Ethics</em> as <em>天演论</em>, proposed three criteria in his preface that are still taught today:</p>
<ul>
<li><strong>信 (xìn) — tín, faithfulness</strong>: the translation must not distort or add to the source meaning.</li>
<li><strong>达 (dá) — đạt, expressiveness/fluency</strong>: the translation must read naturally and clearly in the target language, not like a word-for-word transplant.</li>
<li><strong>雅 (yǎ) — nhã, elegance</strong>: where the source has style and polish, the translation should too — not flat or clumsy.</li>
</ul>
<h3>信 without 达 — a common trap</h3>
<pre><code>Source:  他每天早上七点起床。
Word-for-word (信 but NOT 达):
  "He every-day morning seven-o'clock get-up-bed."
Natural (信 AND 达):
  "He gets up at 7 a.m. every day."
</code></pre>
<p>The word-for-word version is technically "faithful" to every character, but it fails 达 — it does not read as natural English/Vietnamese. A good translation satisfies all three at once, in order of priority: 信 first, then 达, then 雅.</p>
<h3>Reaching for 雅</h3>
<pre><code>Source:   这本书写得很精彩。
Correct, plain (信+达): "This book is written very well."
More 雅 (elegant):       "This book is a brilliant piece of writing."
</code></pre>
<div class="callout"><span class="badge">Priority order</span> When the three criteria conflict, 信 (don't distort meaning) always wins over 达, and 达 (be understandable) always wins over 雅 (be beautiful). A correct but awkward sentence beats a beautiful but wrong one.</div>`,
    `<span class="eyebrow">CCT401 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan dịch thuật &amp; tiêu chí 信达雅</h2>
<p class="lead"><strong>翻译 (fānyì)</strong> — dịch nói chung — chia thành <strong>笔译 (bǐyì)</strong>, biên dịch (dịch viết), và <strong>口译 (kǒuyì)</strong>, phiên dịch (dịch nói). CCT401 mở đầu bằng tiêu chuẩn chất lượng kinh điển mà hầu như mọi giáo trình dịch Trung đều bắt đầu từ đó.</p>
<h3>Nghiêm Phục và tiêu chuẩn 信达雅</h3>
<p>Học giả cuối đời Thanh <strong>严复 (Nghiêm Phục)</strong>, khi dịch <em>Evolution and Ethics</em> của Huxley thành <em>天演论 (Thiên Diễn Luận)</em>, đã đề ra ba tiêu chí trong lời tựa mà đến nay vẫn được giảng dạy:</p>
<ul>
<li><strong>信 (xìn) — tín</strong>: bản dịch không được bóp méo hay thêm bớt so với nghĩa gốc.</li>
<li><strong>达 (dá) — đạt</strong>: bản dịch phải đọc tự nhiên, rõ ràng ở ngôn ngữ đích, không phải một bản "bê nguyên" từng chữ.</li>
<li><strong>雅 (yǎ) — nhã</strong>: nơi nguyên văn có phong cách, trau chuốt, bản dịch cũng nên vậy — không được khô cứng, vụng về.</li>
</ul>
<h3>信 mà không 达 — cái bẫy thường gặp</h3>
<pre><code>Nguyên văn: 他每天早上七点起床。
Dịch từng chữ (信 nhưng KHÔNG đạt):
  "Anh ấy mỗi ngày buổi sáng bảy giờ dậy giường."
Dịch tự nhiên (vừa 信 vừa đạt):
  "Anh ấy dậy lúc 7 giờ sáng mỗi ngày."
</code></pre>
<p>Bản dịch từng chữ về mặt kỹ thuật là "trung thành" với từng chữ, nhưng nó không đạt tiêu chí đạt — không đọc tự nhiên trong tiếng Việt. Một bản dịch tốt thoả cả ba tiêu chí cùng lúc, theo thứ tự ưu tiên: 信 trước, rồi đến đạt, rồi mới đến nhã.</p>
<h3>Vươn tới nhã</h3>
<pre><code>Nguyên văn: 这本书写得很精彩。
Đúng, đơn giản (tín+đạt): "Cuốn sách này viết rất hay."
Nhã hơn:                  "Cuốn sách này là một áng văn xuất sắc."
</code></pre>
<div class="callout"><span class="badge">Thứ tự ưu tiên</span> Khi ba tiêu chí xung đột, 信 (không bóp méo nghĩa) luôn thắng đạt, và đạt (phải hiểu được) luôn thắng nhã (phải hay). Một câu đúng nhưng vụng còn hơn một câu hay nhưng sai.</div>`,
  ]]);

const c1q = quiz('cct401-quiz-1', 'Quiz 1 — 信达雅|||Quiz 1 — Tín-đạt-nhã', [
  { id: 'q1', question: 'Ai là người đề xuất tiêu chí 信达雅 (tín-đạt-nhã) trong lời tựa bản dịch 天演论?', options: ['Lỗ Tấn', 'Nghiêm Phục (严复)', 'Khổng Tử', 'Lâm Ngữ Đường'], correctIndex: 1, explanation: 'Nghiêm Phục (严复) đề ra 信达雅 khi dịch Evolution and Ethics của Huxley thành 天演论.' },
  { id: 'q2', question: '"达" (đạt) trong ba tiêu chí dịch nghĩa là gì?', options: ['Trung thành tuyệt đối với nguyên văn', 'Thông suốt, tự nhiên ở ngôn ngữ đích', 'Trau chuốt, có văn phong', 'Dịch đúng từng chữ một'], correctIndex: 1, explanation: '达 (dá) là tiêu chí về sự thông suốt, tự nhiên khi đọc ở ngôn ngữ đích.' },
  { id: 'q3', question: 'Câu nào dưới đây KHÔNG đạt tiêu chí "đạt" dù mỗi chữ đều đúng nghĩa?', options: ['"Anh ấy dậy lúc 7 giờ sáng mỗi ngày."', '"Anh ấy mỗi ngày buổi sáng bảy giờ dậy giường."', '"Sáng nào anh ấy cũng dậy lúc 7 giờ."', '"Cứ 7 giờ sáng là anh ấy dậy."'], correctIndex: 1, explanation: 'Đây là bản dịch từng chữ (死译) — đúng nghĩa từng từ nhưng không tự nhiên, tối nghĩa trong tiếng Việt.' },
]);

/* ══════════════════ CHƯƠNG 2 — Khác biệt ngôn ngữ & tư duy Trung-Việt ══════════════════ */
const c2 = doc('cct401-2-1-khac-biet-ngon-ngu', '2.1 — Chinese-Vietnamese language & mindset gaps|||2.1 — Khác biệt ngôn ngữ & tư duy Trung-Việt',
  'Trật tự SVO giống nhau nhưng định ngữ (定语) ngược chiều; lượng từ (量词) không map 1-1; câu chủ đề-thuyết minh (topic-comment).',
  [[
    `<span class="eyebrow">CCT401 · Chapter 2 · Lesson 2.1</span>
<h2>Chinese-Vietnamese language &amp; mindset gaps</h2>
<h3>Same basic word order, opposite modifier order</h3>
<p>Both languages are basically <strong>Subject-Verb-Object</strong>: 我学习中文 (Wǒ xuéxí Zhōngwén) mirrors "Tôi học tiếng Trung" word for word. The trap is inside the noun phrase: a Chinese <strong>定语 (dìngyǔ, attributive/modifier)</strong> always comes <em>before</em> the noun it modifies, while Vietnamese usually puts the modifier <em>after</em>.</p>
<pre><code>漂亮的花     (piàoliang de huā)
literal order:  beautiful 的 flower
Vietnamese:     hoa đẹp   (flower beautiful — REVERSED)
</code></pre>
<p>With a long modifier chain, the whole chain must flip:</p>
<pre><code>我昨天从图书馆借的那本中文书
"the that-CL Chinese book [that] I borrowed from the library yesterday"
→ Vietnamese: "quyển sách tiếng Trung mà hôm qua tôi mượn ở thư viện"
</code></pre>
<h3>量词 (liàngcí) — measure words don't map 1-to-1</h3>
<p>Chinese requires a classifier between a number and a noun; Vietnamese does too, but the classifiers rarely correspond:</p>
<pre><code>一个人  (yí gè rén)    → một NGƯỜI            (个 → "người/cái" — generic)
一本书  (yì běn shū)   → một QUYỂN sách       (本 → "quyển/cuốn")
一张纸  (yì zhāng zhǐ) → một TỜ giấy          (张 → "tờ/tấm" — flat things)
一辆车  (yí liàng chē) → một CHIẾC xe         (辆 → "chiếc" — vehicles)
</code></pre>
<h3>Topic-comment sentences</h3>
<p>Chinese often fronts a "topic" before commenting on it: <strong>这个问题，我不知道</strong> (Zhège wèntí, wǒ bù zhīdào). This usually survives translation fine — "Vấn đề này, tôi không biết" — but a translator must recognise it is NOT the object of a missing verb; it is a separate topic slot.</p>
<div class="callout"><span class="badge">Rule of thumb</span> Translate the sentence skeleton (S-V-O) directly, but always re-order everything INSIDE a noun phrase before you output it.</div>`,
    `<span class="eyebrow">CCT401 · Chương 2 · Bài 2.1</span>
<h2>Khác biệt ngôn ngữ &amp; tư duy Trung-Việt</h2>
<h3>Trật tự câu cơ bản giống nhau, trật tự định ngữ ngược nhau</h3>
<p>Cả hai ngôn ngữ về cơ bản là <strong>Chủ-Vị-Tân (SVO)</strong>: 我学习中文 (Wǒ xuéxí Zhōngwén) khớp gần như từng chữ với "Tôi học tiếng Trung". Cái bẫy nằm trong cụm danh từ: <strong>定语 (dìngyǔ, định ngữ)</strong> tiếng Trung luôn đứng <em>trước</em> danh từ mà nó bổ nghĩa, còn tiếng Việt thường đặt định ngữ <em>sau</em>.</p>
<pre><code>漂亮的花     (piàoliang de huā)
trật tự gốc:    đẹp 的 hoa
tiếng Việt:     hoa đẹp   (hoa đẹp — ĐẢO NGƯỢC)
</code></pre>
<p>Với một chuỗi định ngữ dài, toàn bộ chuỗi phải đảo:</p>
<pre><code>我昨天从图书馆借的那本中文书
nghĩa đen: "cái quyển sách-Trung [mà] tôi hôm-qua từ thư-viện mượn ĐÓ"
→ Tiếng Việt: "quyển sách tiếng Trung mà hôm qua tôi mượn ở thư viện"
</code></pre>
<h3>量词 (liàngcí) — lượng từ không đối chiếu 1-1</h3>
<p>Tiếng Trung bắt buộc có lượng từ giữa số đếm và danh từ; tiếng Việt cũng vậy, nhưng lượng từ hai bên hiếm khi tương ứng:</p>
<pre><code>一个人  (yí gè rén)    → một NGƯỜI       (个 → "người/cái" — lượng từ chung)
一本书  (yì běn shū)   → một QUYỂN sách  (本 → "quyển/cuốn")
一张纸  (yì zhāng zhǐ) → một TỜ giấy     (张 → "tờ/tấm" — vật phẳng)
一辆车  (yí liàng chē) → một CHIẾC xe    (辆 → "chiếc" — phương tiện)
</code></pre>
<h3>Câu chủ đề-thuyết minh (topic-comment)</h3>
<p>Tiếng Trung hay đưa "chủ đề" ra đầu câu rồi mới bình luận về nó: <strong>这个问题，我不知道</strong> (Zhège wèntí, wǒ bù zhīdào). Cấu trúc này thường dịch trôi chảy — "Vấn đề này, tôi không biết" — nhưng người dịch cần nhận ra đây KHÔNG phải tân ngữ của một động từ bị thiếu; đó là một vị trí chủ đề riêng.</p>
<div class="callout"><span class="badge">Quy tắc nhớ nhanh</span> Dịch bộ khung câu (C-V-T) gần như trực tiếp, nhưng luôn đảo lại mọi thứ BÊN TRONG cụm danh từ trước khi xuất ra bản dịch.</div>`,
  ]]);

const c2q = quiz('cct401-quiz-2', 'Quiz 2 — Khác biệt ngôn ngữ|||Quiz 2 — Khác biệt ngôn ngữ', [
  { id: 'q1', question: 'Định ngữ (定语) trong tiếng Trung luôn đứng ở đâu so với danh từ trung tâm?', options: ['Sau danh từ, giống tiếng Việt', 'Trước danh từ trung tâm', 'Không có vị trí cố định', 'Luôn ở cuối câu'], correctIndex: 1, explanation: 'Định ngữ tiếng Trung luôn đứng TRƯỚC danh từ (vd 漂亮的花), ngược với tiếng Việt (hoa đẹp).' },
  { id: 'q2', question: '一本书 dùng lượng từ 本 và có nghĩa là?', options: ['Một người', 'Một quyển sách', 'Một tờ giấy', 'Một chiếc xe'], correctIndex: 1, explanation: '本 (běn) là lượng từ cho sách vở, tương ứng "quyển/cuốn" trong tiếng Việt.' },
  { id: 'q3', question: 'Khi dịch một chuỗi định ngữ dài như "我昨天从图书馆借的那本中文书" sang tiếng Việt, cần làm gì?', options: ['Giữ nguyên trật tự tiếng Trung', 'Đảo chuỗi định ngữ ra sau danh từ trung tâm theo trật tự Việt', 'Bỏ hết định ngữ đi', 'Chỉ dịch một mình động từ'], correctIndex: 1, explanation: 'Danh từ trung tâm ("quyển sách tiếng Trung") phải đứng trước, chuỗi định ngữ dài đảo ra sau bằng "mà".' },
]);

/* ══════════════════ CHƯƠNG 3 — Kỹ thuật dịch từ & cụm từ ══════════════════ */
const c3 = doc('cct401-3-1-ky-thuat-dich-tu', '3.1 — Word & phrase translation techniques|||3.1 — Kỹ thuật dịch từ & cụm từ',
  '直译 (dịch nghĩa) vs 音译 (dịch âm); từ Hán Việt (汉越词) và bẫy "giả bằng hữu"; nguyên tắc dịch danh từ riêng.',
  [[
    `<span class="eyebrow">CCT401 · Chapter 3 · Lesson 3.1</span>
<h2>Word &amp; phrase translation techniques</h2>
<h3>直译 (zhíyì) vs 音译 (yīnyì)</h3>
<ul>
<li><strong>直译 (zhíyì) — dịch nghĩa/dịch thẳng</strong>: translate the MEANING, not the literal characters. 电脑 (diànnǎo) literally means "electric brain", but it is translated by meaning as <strong>máy tính</strong> (computer), never "não điện".</li>
<li><strong>音译 (yīnyì) — dịch âm/phiên âm</strong>: used for proper nouns and loanwords with no cultural equivalent, by copying the SOUND. 咖啡 (kāfēi) → <strong>cà phê</strong> (from "coffee" via French/Chinese phonetics); 沙发 (shāfā) → <strong>sofa/ghế sô-pha</strong>.</li>
</ul>
<h3>汉越词 (hànyuècí) — Sino-Vietnamese vocabulary</h3>
<p>A huge share of modern Chinese vocabulary has a direct Sino-Vietnamese reading with the same meaning — the fastest translation tool a Vietnamese translator has:</p>
<pre><code>经济  jīngjì   → kinh tế
文化  wénhuà   → văn hoá
政治  zhèngzhì → chính trị
历史  lìshǐ    → lịch sử
</code></pre>
<div class="callout"><span class="badge">⚠️ False friends</span> Not every Han character reads the same way in practice. 汽车 (qìchē, "car") is NOT commonly rendered as "khí xa" in modern Vietnamese — it is simply <strong>xe hơi/ô tô</strong>. Always check that a Sino-Vietnamese reading is still IN USE before relying on it.</div>
<h3>Translating proper nouns</h3>
<p>Chinese names/places traditionally take their long-established Sino-Vietnamese reading: 习近平 → <strong>Tập Cận Bình</strong>, 北京 (Běijīng) → <strong>Bắc Kinh</strong>. But a Western name that was FIRST transliterated into Chinese must be translated back to its ORIGINAL spelling, not re-transliterated through the Chinese sound: 华盛顿 (Huáshèngdùn) is <strong>Washington</strong>, not a made-up Sino-Vietnamese reading of the Chinese syllables.</p>`,
    `<span class="eyebrow">CCT401 · Chương 3 · Bài 3.1</span>
<h2>Kỹ thuật dịch từ &amp; cụm từ</h2>
<h3>直译 (zhíyì) và 音译 (yīnyì)</h3>
<ul>
<li><strong>直译 (zhíyì) — dịch nghĩa/dịch thẳng</strong>: dịch theo Ý NGHĨA, không dịch theo từng chữ Hán. 电脑 (diànnǎo) nghĩa đen là "não điện", nhưng được dịch theo nghĩa thành <strong>máy tính</strong>, không bao giờ dịch là "não điện".</li>
<li><strong>音译 (yīnyì) — dịch âm/phiên âm</strong>: dùng cho danh từ riêng và từ vay mượn không có tương đương văn hoá, bằng cách sao chép ÂM THANH. 咖啡 (kāfēi) → <strong>cà phê</strong> (bắt nguồn từ "coffee" qua ngữ âm Pháp/Trung); 沙发 (shāfā) → <strong>sofa/ghế sô-pha</strong>.</li>
</ul>
<h3>汉越词 (hànyuècí) — từ Hán Việt</h3>
<p>Phần lớn từ vựng Trung hiện đại có âm đọc Hán Việt trực tiếp giữ nguyên nghĩa — công cụ dịch nhanh nhất mà người dịch Việt có sẵn:</p>
<pre><code>经济  jīngjì   → kinh tế
文化  wénhuà   → văn hoá
政治  zhèngzhì → chính trị
历史  lìshǐ    → lịch sử
</code></pre>
<div class="callout"><span class="badge">⚠️ "Giả bằng hữu"</span> Không phải chữ Hán nào cũng còn dùng âm Hán Việt trong thực tế. 汽车 (qìchē, "xe hơi") KHÔNG được dịch là "khí xa" trong tiếng Việt hiện đại — chỉ đơn giản là <strong>xe hơi/ô tô</strong>. Luôn kiểm tra âm Hán Việt đó CÒN ĐƯỢC DÙNG trước khi dựa vào nó.</div>
<h3>Nguyên tắc dịch danh từ riêng</h3>
<p>Tên người/địa danh Trung Quốc theo truyền thống dùng âm Hán Việt đã ổn định từ lâu: 习近平 → <strong>Tập Cận Bình</strong>, 北京 (Běijīng) → <strong>Bắc Kinh</strong>. Nhưng một tên phương Tây vốn đã được phiên âm SANG tiếng Trung trước thì phải dịch NGƯỢC LẠI về đúng chính tả gốc, không phiên âm Hán Việt lại từ âm tiết Trung: 华盛顿 (Huáshèngdùn) chính là <strong>Washington</strong>, không phải một âm Hán Việt tự chế từ các âm tiết Trung.</p>`,
  ]]);

const c3q = quiz('cct401-quiz-3', 'Quiz 3 — Dịch từ & cụm từ|||Quiz 3 — Dịch từ & cụm từ', [
  { id: 'q1', question: '咖啡 (kāfēi) dịch thành "cà phê" là ví dụ của kỹ thuật nào?', options: ['直译 — dịch nghĩa', '音译 — dịch âm/phiên âm', 'Dịch thoát ý hoàn toàn', 'Bỏ không dịch'], correctIndex: 1, explanation: 'Cà phê được tạo ra bằng cách sao chép ÂM THANH của từ, đây là 音译 (yīnyì — phiên âm).' },
  { id: 'q2', question: '经济 (jīngjì) dịch thành "kinh tế" là ví dụ của?', options: ['Phiên âm (音译)', 'Từ Hán Việt (âm đọc Hán Việt giữ nguyên nghĩa)', 'Dịch thoát nghĩa hoàn toàn mới', 'Giữ nguyên chữ Hán không dịch'], correctIndex: 1, explanation: '经济 → kinh tế là ví dụ điển hình của 汉越词 — từ Hán Việt.' },
  { id: 'q3', question: 'Khi dùng từ Hán Việt để dịch nhanh, người dịch cần cẩn thận điều gì?', options: ['Không cần cẩn thận gì cả', '"Giả bằng hữu" — âm Hán Việt tồn tại nhưng không còn dùng với nghĩa/cách đó (vd 汽车 không phải "khí xa")', 'Từ Hán Việt lúc nào cũng sai', 'Chỉ áp dụng được cho tên riêng'], correctIndex: 1, explanation: 'Phải kiểm tra âm Hán Việt còn được dùng trong thực tế, tránh bẫy "giả bằng hữu" như 汽车 ≠ "khí xa".' },
]);

/* ══════════════════ CHƯƠNG 4 — Dịch câu & điều chỉnh trật tự cú pháp ══════════════════ */
const c4 = doc('cct401-4-1-dieu-chinh-trat-tu', '4.1 — Sentence translation & syntax reordering|||4.1 — Dịch câu & điều chỉnh trật tự cú pháp (语序调整)',
  'Câu chữ 把 (bǎ), câu bị động 被 (bèi), bổ ngữ kết quả/xu hướng, và cách đảo trạng ngữ dài khi dịch sang tiếng Việt.',
  [[
    `<span class="eyebrow">CCT401 · Chapter 4 · Lesson 4.1</span>
<h2>Sentence translation &amp; syntax reordering (语序调整)</h2>
<h3>把-sentences (把字句)</h3>
<p>A <strong>把 (bǎ)</strong> sentence fronts the object before the verb to emphasise how it is handled or the resulting state. Never translate 把 as a word — it has no equivalent, it only signals reordering:</p>
<pre><code>我把书放在桌子上。 (Wǒ bǎ shū fàng zài zhuōzi shàng.)
literal: "I 把(BA) book put at table on."
correct: "Tôi để quyển sách lên bàn."
</code></pre>
<h3>被-sentences (被字句) — passive voice</h3>
<p>Chinese uses <strong>被 (bèi)</strong> for the passive far more freely than Vietnamese uses "bị/được". Vietnamese often prefers turning the sentence ACTIVE:</p>
<pre><code>这个问题被他解决了。 (Zhège wèntí bèi tā jiějué le.)
passive:  "Vấn đề này đã được anh ấy giải quyết."
active (more natural): "Anh ấy đã giải quyết vấn đề này."
</code></pre>
<h3>Result &amp; direction complements (结果/趋向补语)</h3>
<p>A verb + complement forms one translation unit — don't translate them separately:</p>
<pre><code>他走进来了。 (Tā zǒu jìnlái le.)
走 (walk) + 进来 (in-come) → ONE idea: "Anh ấy đi vào."
</code></pre>
<h3>Reordering long adverbials</h3>
<pre><code>他昨天在图书馆认真地看书。
(He yesterday at-library seriously read book.)
→ "Hôm qua, anh ấy đã chăm chỉ đọc sách ở thư viện."
</code></pre>
<div class="callout"><span class="badge">Method</span> Read the whole Chinese sentence first, identify subject/verb/object AND every complement/adverbial, THEN reassemble in the order Vietnamese naturally uses them — do not translate word-by-word left to right.</div>`,
    `<span class="eyebrow">CCT401 · Chương 4 · Bài 4.1</span>
<h2>Dịch câu &amp; điều chỉnh trật tự cú pháp (语序调整)</h2>
<h3>Câu chữ 把 (把字句)</h3>
<p>Câu <strong>把 (bǎ)</strong> đưa tân ngữ lên trước động từ để nhấn mạnh cách xử lý hoặc kết quả. Đừng bao giờ dịch 把 thành một từ — nó không có tương đương, chỉ là tín hiệu đảo trật tự:</p>
<pre><code>我把书放在桌子上。 (Wǒ bǎ shū fàng zài zhuōzi shàng.)
nghĩa đen: "Tôi 把(BẢ) sách để ở bàn trên."
đúng:      "Tôi để quyển sách lên bàn."
</code></pre>
<h3>Câu bị động 被 (被字句)</h3>
<p>Tiếng Trung dùng <strong>被 (bèi)</strong> cho câu bị động thoải mái hơn nhiều so với tiếng Việt dùng "bị/được". Tiếng Việt thường thích chuyển câu sang CHỦ ĐỘNG hơn:</p>
<pre><code>这个问题被他解决了。 (Zhège wèntí bèi tā jiějué le.)
bị động: "Vấn đề này đã được anh ấy giải quyết."
chủ động (tự nhiên hơn): "Anh ấy đã giải quyết vấn đề này."
</code></pre>
<h3>Bổ ngữ kết quả/xu hướng (结果/趋向补语)</h3>
<p>Động từ + bổ ngữ tạo thành MỘT đơn vị dịch — đừng dịch tách rời:</p>
<pre><code>他走进来了。 (Tā zǒu jìnlái le.)
走 (đi) + 进来 (vào-tới) → MỘT ý duy nhất: "Anh ấy đi vào."
</code></pre>
<h3>Đảo trạng ngữ dài</h3>
<pre><code>他昨天在图书馆认真地看书。
(Anh ấy hôm-qua ở-thư-viện chăm-chỉ đọc sách.)
→ "Hôm qua, anh ấy đã chăm chỉ đọc sách ở thư viện."
</code></pre>
<div class="callout"><span class="badge">Phương pháp</span> Đọc trọn câu tiếng Trung trước, xác định chủ-vị-tân VÀ mọi bổ ngữ/trạng ngữ, RỒI mới ráp lại theo trật tự tự nhiên của tiếng Việt — đừng dịch từng chữ theo thứ tự từ trái sang phải.</div>`,
  ]]);

const c4q = quiz('cct401-quiz-4', 'Quiz 4 — Trật tự cú pháp|||Quiz 4 — Trật tự cú pháp', [
  { id: 'q1', question: 'Câu chữ 把 (把字句) dùng để làm gì?', options: ['Đặt câu hỏi', 'Đưa tân ngữ lên trước động từ để nhấn xử lý/kết quả', 'Phủ định câu', 'Tạo câu cảm thán'], correctIndex: 1, explanation: '把 đảo tân ngữ ra trước động từ, nhấn mạnh cách xử lý hoặc trạng thái kết quả; bản thân 把 không có nghĩa để dịch.' },
  { id: 'q2', question: '"这个问题被他解决了" nên dịch tự nhiên nhất sang tiếng Việt là?', options: ['"Vấn đề này bị hắn giải quyết."', '"Anh ấy đã giải quyết vấn đề này." (hoặc: được anh ấy giải quyết)', '"Vấn đề này giải quyết anh ấy."', '"Hắn bị vấn đề giải quyết."'], correctIndex: 1, explanation: 'Tiếng Việt thường chuyển câu 被 sang dạng chủ động cho tự nhiên hơn.' },
  { id: 'q3', question: 'So với câu 被 của tiếng Trung, tiếng Việt có xu hướng ưu tiên dạng câu nào hơn?', options: ['Câu bị động', 'Câu chủ động', 'Câu nghi vấn', 'Câu cảm thán'], correctIndex: 1, explanation: 'Tiếng Việt tự nhiên hơn khi dùng câu chủ động thay vì lạm dụng "bị/được" theo kiểu 被 tiếng Trung.' },
]);

/* ══════════════════ CHƯƠNG 5 — Dịch văn bản thông dụng ══════════════════ */
const c5 = doc('cct401-5-1-dich-van-ban-thong-dung', '5.1 — Translating common texts: notices & introductions|||5.1 — Dịch văn bản thông dụng (thông báo, giới thiệu)',
  '应用文 (văn bản ứng dụng): cấu trúc thông báo 通知 và văn bản giới thiệu 介绍; văn phong trang trọng, thuật ngữ cố định.',
  [[
    `<span class="eyebrow">CCT401 · Chapter 5 · Lesson 5.1</span>
<h2>Translating common texts: notices &amp; introductions</h2>
<p class="lead"><strong>应用文 (yìngyòngwén)</strong>, "practical/applied writing", covers fixed-format documents like notices and introductions. Unlike literary text, these have a rigid skeleton the translator must preserve exactly.</p>
<h3>通知 (tōngzhī) — notices</h3>
<p>A Chinese notice always follows: title "通知" → recipient(s) → body (what/why) → time &amp; place → issuing unit + date.</p>
<pre><code>通知
全体员工：
定于本周五（3月15日）下午两点在会议室召开月度总结会议，请准时参加。

行政部
2026年3月10日
</code></pre>
<p>Vietnamese translation keeps the exact same skeleton:</p>
<pre><code>THÔNG BÁO
Kính gửi toàn thể nhân viên:
Công ty sẽ tổ chức họp tổng kết tháng vào 14:00 thứ Sáu (ngày 15/3) tại
phòng họp. Đề nghị tham dự đúng giờ.

Phòng Hành chính
Ngày 10 tháng 3 năm 2026
</code></pre>
<h3>介绍 (jièshào) — company/product introductions</h3>
<p>These use formal register, long sentences, and fixed professional phrases that map to fixed Vietnamese phrases — memorise the pairs, don't reinvent them each time:</p>
<pre><code>成立于        chéngyì yú        → được thành lập vào (năm...)
总部位于      zǒngbù wèiyú       → có trụ sở chính tại
主营业务      zhǔyíng yèwù       → lĩnh vực kinh doanh chính
</code></pre>
<div class="callout"><span class="badge">Discipline over style</span> For 应用文, fidelity to STRUCTURE (who, what, when, where, issuer) matters more than elegant phrasing — a beautifully-written notice missing the date is a translation failure.</div>`,
    `<span class="eyebrow">CCT401 · Chương 5 · Bài 5.1</span>
<h2>Dịch văn bản thông dụng (thông báo, giới thiệu)</h2>
<p class="lead"><strong>应用文 (yìngyòngwén)</strong>, "văn bản ứng dụng", bao gồm các văn bản có khuôn mẫu cố định như thông báo và bài giới thiệu. Khác với văn học, những văn bản này có khung sườn cứng mà người dịch phải giữ nguyên chính xác.</p>
<h3>通知 (tōngzhī) — thông báo</h3>
<p>Một thông báo tiếng Trung luôn theo khuôn: tiêu đề "通知" → đối tượng nhận → nội dung (việc gì/vì sao) → thời gian &amp; địa điểm → đơn vị ban hành + ngày tháng.</p>
<pre><code>通知
全体员工：
定于本周五（3月15日）下午两点在会议室召开月度总结会议，请准时参加。

行政部
2026年3月10日
</code></pre>
<p>Bản dịch tiếng Việt giữ nguyên chính xác khuôn đó:</p>
<pre><code>THÔNG BÁO
Kính gửi toàn thể nhân viên:
Công ty sẽ tổ chức họp tổng kết tháng vào 14:00 thứ Sáu (ngày 15/3) tại
phòng họp. Đề nghị tham dự đúng giờ.

Phòng Hành chính
Ngày 10 tháng 3 năm 2026
</code></pre>
<h3>介绍 (jièshào) — giới thiệu công ty/sản phẩm</h3>
<p>Loại văn bản này dùng văn phong trang trọng, câu dài, và các cụm từ chuyên ngành cố định tương ứng với cụm từ tiếng Việt cố định — cần thuộc lòng từng cặp, không tự sáng tạo mỗi lần:</p>
<pre><code>成立于        chéngyì yú        → được thành lập vào (năm...)
总部位于      zǒngbù wèiyú       → có trụ sở chính tại
主营业务      zhǔyíng yèwù       → lĩnh vực kinh doanh chính
</code></pre>
<div class="callout"><span class="badge">Kỷ luật hơn văn hoa</span> Với 应用文, trung thành với CẤU TRÚC (ai, việc gì, khi nào, ở đâu, đơn vị ban hành) quan trọng hơn câu chữ hoa mỹ — một thông báo viết hay nhưng thiếu ngày tháng là một bản dịch thất bại.</div>`,
  ]]);

const c5q = quiz('cct401-quiz-5', 'Quiz 5 — Văn bản thông dụng|||Quiz 5 — Văn bản thông dụng', [
  { id: 'q1', question: '通知 (tōngzhī) trong văn bản hành chính Trung Quốc tương ứng thể loại nào ở tiếng Việt?', options: ['Thư tình', 'Thông báo', 'Nhật ký', 'Truyện ngắn'], correctIndex: 1, explanation: '通知 (tōngzhī) chính là "thông báo" — văn bản hành chính có khuôn mẫu cố định.' },
  { id: 'q2', question: 'Văn bản giới thiệu công ty (介绍) thường có đặc điểm văn phong gì?', options: ['Khẩu ngữ, thân mật, câu ngắn', 'Trang trọng, câu dài, nhiều thuật ngữ chuyên ngành cố định', 'Văn phong thơ ca, giàu vần điệu', 'Toàn bộ ở dạng đối thoại'], correctIndex: 1, explanation: 'Văn bản giới thiệu dùng đăng ký trang trọng với các cụm từ chuyên ngành cố định như 成立于, 总部位于.' },
  { id: 'q3', question: 'Khi dịch văn bản thông báo, điều quan trọng nhất cần giữ đúng là?', options: ['Cấu trúc & thông tin (đối tượng, thời gian, địa điểm, đơn vị ban hành)', 'Vần điệu câu văn', 'Càng ngắn gọn càng tốt, có thể bỏ bớt chi tiết', 'Thêm ý kiến cá nhân của người dịch'], correctIndex: 0, explanation: 'Với 应用文, mất một chi tiết cấu trúc (vd ngày tháng) là lỗi dịch nghiêm trọng hơn cả câu chữ chưa hay.' },
]);

/* ══════════════════ CHƯƠNG 6 — Thành ngữ, quán ngữ & văn hoá ══════════════════ */
const c6 = doc('cct401-6-1-thanh-ngu-van-hoa', '6.1 — Idioms, set phrases & culture in translation|||6.1 — Xử lý thành ngữ, quán ngữ & văn hoá khi dịch',
  '成语 (thành ngữ 4 chữ) và 惯用语/俗语 (quán ngữ, tục ngữ); ba chiến lược: tương đương văn hoá, dịch thoát ý, dịch sát + chú thích.',
  [[
    `<span class="eyebrow">CCT401 · Chapter 6 · Lesson 6.1</span>
<h2>Idioms, set phrases &amp; culture in translation</h2>
<h3>成语 (chéngyǔ) — four-character idioms</h3>
<p>Chinese has thousands of <strong>成语</strong>, most rooted in a classical story (典故). Three typical cases:</p>
<pre><code>Case A — a matching Vietnamese idiom already exists (loanword or shared story):
  对牛弹琴  (duì niú tán qín, "play the lute to a cow")
  → "đàn gảy tai trâu"                (PERFECT match, same imagery)

Case B — the idiom exists in Vietnamese too, borrowed straight from Chinese:
  画蛇添足  (huàshé tiānzú, "draw a snake and add feet")
  → "vẽ rắn thêm chân"                (same image, understood in Vietnamese)

Case C — no equivalent image; translate the MEANING, drop the picture:
  马马虎虎  (mǎmǎhǔhǔ, literally "horse-horse tiger-tiger")
  → "qua loa, đại khái"               (meaning only, no literal image works)
</code></pre>
<h3>惯用语/俗语 (guànyòngyǔ/súyǔ) — set phrases &amp; sayings</h3>
<pre><code>戴高帽子  (dài gāo màozi, "wear a tall hat") → "nịnh hót, tâng bốc"
</code></pre>
<h3>Three-step strategy</h3>
<ol>
<li><strong>Look for a ready-made Vietnamese cultural equivalent first</strong> (Case A/B above).</li>
<li><strong>If none exists, translate by meaning/function</strong>, sacrificing the image (Case C).</li>
<li><strong>If the cultural flavour itself matters</strong> (literature, a specific reference), translate literally and add a short footnote/gloss instead of guessing an equivalent.</li>
</ol>
<div class="callout"><span class="badge">Never</span> Word-for-word render an idiom's characters without checking whether the RESULT means anything in Vietnamese — "ngựa ngựa hổ hổ" communicates nothing to a Vietnamese reader.</div>`,
    `<span class="eyebrow">CCT401 · Chương 6 · Bài 6.1</span>
<h2>Xử lý thành ngữ, quán ngữ &amp; văn hoá khi dịch</h2>
<h3>成语 (chéngyǔ) — thành ngữ bốn chữ</h3>
<p>Tiếng Trung có hàng nghìn <strong>成语</strong>, phần lớn bắt nguồn từ một điển tích (典故). Ba trường hợp điển hình:</p>
<pre><code>Trường hợp A — đã có thành ngữ Việt tương đương hoàn hảo (cùng gốc điển tích):
  对牛弹琴  (duì niú tán qín, "đàn gảy cho trâu nghe")
  → "đàn gảy tai trâu"                (KHỚP HOÀN HẢO, cùng hình ảnh)

Trường hợp B — thành ngữ cũng tồn tại trong tiếng Việt, vay mượn thẳng từ Hán:
  画蛇添足  (huàshé tiānzú, "vẽ rắn thêm chân")
  → "vẽ rắn thêm chân"                (cùng hình ảnh, người Việt hiểu ngay)

Trường hợp C — không có hình ảnh tương đương; dịch theo NGHĨA, bỏ hình ảnh:
  马马虎虎  (mǎmǎhǔhǔ, nghĩa đen "ngựa ngựa hổ hổ")
  → "qua loa, đại khái"               (chỉ giữ nghĩa, hình ảnh gốc vô nghĩa khi dịch thẳng)
</code></pre>
<h3>惯用语/俗语 (guànyòngyǔ/súyǔ) — quán ngữ &amp; tục ngữ</h3>
<pre><code>戴高帽子  (dài gāo màozi, "đội mũ cao") → "nịnh hót, tâng bốc"
</code></pre>
<h3>Chiến lược ba bước</h3>
<ol>
<li><strong>Tìm tương đương văn hoá có sẵn trong tiếng Việt trước</strong> (Trường hợp A/B ở trên).</li>
<li><strong>Nếu không có, dịch theo nghĩa/chức năng</strong>, chấp nhận mất hình ảnh (Trường hợp C).</li>
<li><strong>Nếu bản thân màu sắc văn hoá quan trọng</strong> (văn học, một điển tích cụ thể), dịch sát nghĩa đen và thêm chú thích ngắn thay vì đoán bừa một tương đương.</li>
</ol>
<div class="callout"><span class="badge">Tuyệt đối tránh</span> Dịch từng chữ của thành ngữ mà không kiểm tra xem KẾT QUẢ có nghĩa gì trong tiếng Việt hay không — "ngựa ngựa hổ hổ" không truyền đạt được gì cho người đọc tiếng Việt.</div>`,
  ]]);

const c6q = quiz('cct401-quiz-6', 'Quiz 6 — Thành ngữ & văn hoá|||Quiz 6 — Thành ngữ & văn hoá', [
  { id: 'q1', question: '对牛弹琴 dịch sang tiếng Việt tương đương hoàn hảo là?', options: ['Vẽ rắn thêm chân', 'Đàn gảy tai trâu', 'Qua loa đại khái', 'Nước đổ lá khoai'], correctIndex: 1, explanation: '对牛弹琴 (đàn gảy cho trâu nghe) khớp hoàn hảo với thành ngữ Việt "đàn gảy tai trâu" — cùng hình ảnh.' },
  { id: 'q2', question: '马马虎虎 nên dịch bằng chiến lược nào vì không có hình ảnh tương đương trong tiếng Việt?', options: ['Dịch từng chữ thành "ngựa ngựa hổ hổ"', 'Dịch thoát nghĩa: "qua loa, đại khái"', 'Giữ nguyên chữ Hán không dịch', 'Bỏ hẳn không dịch câu đó'], correctIndex: 1, explanation: 'Không có hình ảnh tương đương nên phải dịch theo NGHĨA, bỏ hình ảnh gốc.' },
  { id: 'q3', question: 'Theo chiến lược ba bước, bước ĐẦU TIÊN khi dịch một thành ngữ/quán ngữ là gì?', options: ['Dịch từng chữ ngay lập tức', 'Tìm tương đương văn hoá có sẵn trong tiếng Việt', 'Bỏ qua, không dịch thành ngữ', 'Luôn luôn chú thích dài dòng'], correctIndex: 1, explanation: 'Bước 1 là tìm xem tiếng Việt đã có sẵn thành ngữ/cách nói tương đương hay chưa.' },
]);

/* ══════════════════ CHƯƠNG 7 — Nhập môn phiên dịch: dịch đuổi ══════════════════ */
const c7 = doc('cct401-7-1-nhap-mon-phien-dich', '7.1 — Introduction to interpreting: basic consecutive interpretation|||7.1 — Nhập môn phiên dịch: dịch đuổi cơ bản (交替传译)',
  '口译 (phiên dịch): 交替传译 (dịch đuổi) vs 同声传译 (dịch song song); kỹ năng nghe ý chính và ghi chú 笔记法; ví dụ bài tập.',
  [[
    `<span class="eyebrow">CCT401 · Chapter 7 · Lesson 7.1</span>
<h2>Introduction to interpreting: basic consecutive interpretation</h2>
<h3>Two types of 口译 (kǒuyì, oral interpretation)</h3>
<ul>
<li><strong>交替传译 (jiāotì chuányì) — consecutive interpreting ("dịch đuổi")</strong>: the speaker pauses every few sentences, the interpreter then renders that chunk into the target language. This is where CCT401 starts.</li>
<li><strong>同声传译 (tóngshēng chuányì) — simultaneous interpreting ("dịch song song")</strong>: near real-time, typically booth + headset, done alongside the speaker without pausing. A later, harder skill.</li>
</ul>
<h3>Core skills for consecutive interpreting</h3>
<ol>
<li><strong>Listen for meaning, not words</strong> — capture the main idea and logical structure, not every character.</li>
<li><strong>笔记法 (bǐjì fǎ) — note-taking technique</strong> — use symbols, abbreviations and arrows, never write full sentences (there is no time, and writing every word blocks listening to what comes next).</li>
<li><strong>Reconstruct naturally in the target language</strong> — speak the way a Vietnamese speaker naturally would, don't force Chinese word order.</li>
</ol>
<h3>Worked example</h3>
<pre><code>Source (spoken, then paused):
"我们公司今年在越南新开了三家分店，主要销售电子产品，
 明年计划再开五家。"

Sample notes:
  公司→VN·26 3店 (elec)
  →27计 +5店

Target-language rendering:
"Công ty chúng tôi năm nay đã mở thêm ba chi nhánh mới tại Việt Nam,
 chủ yếu bán các sản phẩm điện tử. Năm sau dự kiến mở thêm năm chi nhánh nữa."
</code></pre>
<div class="callout"><span class="badge">Not a memory test</span> A good consecutive interpretation conveys the SAME information accurately and naturally — it does not need to reproduce the exact sentence structure or every filler word of the original.</div>`,
    `<span class="eyebrow">CCT401 · Chương 7 · Bài 7.1</span>
<h2>Nhập môn phiên dịch: dịch đuổi cơ bản</h2>
<h3>Hai loại 口译 (kǒuyì, phiên dịch nói)</h3>
<ul>
<li><strong>交替传译 (jiāotì chuányì) — dịch đuổi (consecutive interpreting)</strong>: người nói dừng lại sau vài câu, phiên dịch viên sau đó chuyển đoạn vừa nghe sang ngôn ngữ đích. Đây là điểm khởi đầu của CCT401.</li>
<li><strong>同声传译 (tóngshēng chuányì) — dịch song song (simultaneous interpreting)</strong>: gần như tức thời, thường trong cabin + tai nghe, thực hiện song song với người nói mà không dừng lại. Đây là kỹ năng khó hơn, học ở giai đoạn sau.</li>
</ul>
<h3>Kỹ năng nền của dịch đuổi</h3>
<ol>
<li><strong>Nghe để hiểu Ý, không phải từng từ</strong> — nắm ý chính và mạch logic, không cần nhớ từng chữ.</li>
<li><strong>笔记法 (bǐjì fǎ) — kỹ thuật ghi chú</strong> — dùng ký hiệu, viết tắt và mũi tên, không bao giờ viết câu đầy đủ (không đủ thời gian, và viết từng chữ sẽ cản việc nghe phần tiếp theo).</li>
<li><strong>Tái tạo tự nhiên bằng ngôn ngữ đích</strong> — nói theo cách người Việt nói tự nhiên, đừng gò theo trật tự câu tiếng Trung.</li>
</ol>
<h3>Ví dụ minh hoạ</h3>
<pre><code>Nguồn (nói, rồi dừng):
"我们公司今年在越南新开了三家分店，主要销售电子产品，
 明年计划再开五家。"

Ghi chú mẫu:
  公司→VN·26 3店 (elec)
  →27计 +5店

Bản dịch ra ngôn ngữ đích:
"Công ty chúng tôi năm nay đã mở thêm ba chi nhánh mới tại Việt Nam,
 chủ yếu bán các sản phẩm điện tử. Năm sau dự kiến mở thêm năm chi nhánh nữa."
</code></pre>
<div class="callout"><span class="badge">Không phải bài kiểm tra trí nhớ</span> Một bản dịch đuổi tốt truyền đạt ĐÚNG và TỰ NHIÊN cùng một thông tin — không cần tái hiện y hệt cấu trúc câu hay từng từ đệm của nguyên văn.</div>`,
  ]]);

const c7q = quiz('cct401-quiz-7', 'Quiz 7 — Phiên dịch đuổi|||Quiz 7 — Phiên dịch đuổi', [
  { id: 'q1', question: '交替传译 (jiāotì chuányì) là loại phiên dịch nào?', options: ['Dịch song song trong cabin, gần như đồng thời', 'Dịch đuổi — người nói ngừng lại rồi phiên dịch viên nói lại', 'Dịch văn bản viết', 'Dịch bằng phần mềm tự động'], correctIndex: 1, explanation: '交替传译 chính là consecutive interpreting — dịch đuổi, luân phiên giữa người nói và phiên dịch viên.' },
  { id: 'q2', question: 'Kỹ năng ghi chú (笔记法) trong dịch đuổi nên thực hiện như thế nào?', options: ['Viết đầy đủ từng câu nghe được', 'Dùng ký hiệu/viết tắt để ghi ý chính, không viết câu đầy đủ', 'Không cần ghi chép gì cả', 'Ghi lại toàn bộ bằng ngôn ngữ nguồn, từng chữ một'], correctIndex: 1, explanation: 'Ghi chú tốt dùng ký hiệu, mũi tên, viết tắt — vì không đủ thời gian và không cần viết trọn câu.' },
  { id: 'q3', question: 'Mục tiêu khi tái tạo lại bằng ngôn ngữ đích trong dịch đuổi là gì?', options: ['Dịch từng từ một cách máy móc theo đúng trật tự gốc', 'Truyền đạt tự nhiên, đúng ý — không nhất thiết đúng từng chữ', 'Nói càng dài, càng chi tiết càng tốt', 'Bỏ bớt nội dung cho nhanh, không cần đầy đủ ý'], correctIndex: 1, explanation: 'Dịch đuổi tốt ưu tiên truyền đạt đúng và tự nhiên ý nghĩa, không phải sao chép máy móc từng từ.' },
]);

/* ══════════════════ CHƯƠNG 8 — Ôn tập: thực hành dịch đoạn & sửa lỗi ══════════════════ */
const c8 = doc('cct401-8-1-on-tap-sua-loi', '8.1 — Review: passage practice & common translation errors|||8.1 — Ôn tập: thực hành dịch đoạn & sửa lỗi dịch thường gặp',
  'Bốn lỗi thường gặp: 死译 (dịch chết), bỏ sót định ngữ, lạm dụng từ Hán Việt, sai lượng từ; bài thực hành đoạn văn có bản dịch tham khảo.',
  [[
    `<span class="eyebrow">CCT401 · Chapter 8 · Lesson 8.1</span>
<h2>Review: passage practice &amp; common translation errors</h2>
<h3>Four errors seen again and again</h3>
<pre><code>1. 死译 (sǐyì) — "dead"/word-for-word translation
   Wrong:  "他给我打了一个电话" → "Anh ấy cho tôi đánh một cái điện thoại."
   Right:  "Anh ấy đã gọi điện cho tôi."

2. Dropping a long modifier instead of reordering it
   Wrong:  skips "从图书馆借的" and translates only "那本书" as "quyển sách"
   Right:  keep the full modifier, reordered (see Chapter 2/4).

3. Overusing Sino-Vietnamese where plain Vietnamese is more natural
   Stiff:  "Bổn nhân dĩ hoàn thành công tác."
   Natural: "Tôi đã hoàn thành công việc."

4. Wrong measure word (量词) when localising
   Wrong:  "một con sách" (nonsense classifier)
   Right:  "một quyển/cuốn sách"
</code></pre>
<h3>Practice passage</h3>
<pre><code>中文原文：
昨天下午，我在公司附近新开的那家咖啡馆里，遇到了一位老朋友。
他现在在一家外贸公司工作，主要负责把中国的产品介绍给越南客户。
我们聊了很久，约好下个月一起去河内出差。
</code></pre>
<p>Try translating this yourself before checking the reference below — identify the long modifier ("新开的那家" before 咖啡馆), the topic-comment feel of sentence 2, and the natural Vietnamese phrasing for 出差 (business trip).</p>
<pre><code>Bản dịch tham khảo:
Chiều hôm qua, tôi tình cờ gặp một người bạn cũ ở quán cà phê mới mở
gần công ty. Anh ấy hiện đang làm việc ở một công ty ngoại thương,
chủ yếu phụ trách giới thiệu sản phẩm Trung Quốc cho khách hàng Việt Nam.
Chúng tôi trò chuyện rất lâu và hẹn nhau tháng sau cùng đi công tác Hà Nội.
</code></pre>
<div class="callout"><span class="badge">Self-check</span> Read your own translation ALOUD, in isolation from the Chinese — if it doesn't sound like something a Vietnamese speaker would naturally say, it fails 达 no matter how faithful it is.</div>`,
    `<span class="eyebrow">CCT401 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập: thực hành dịch đoạn &amp; sửa lỗi dịch thường gặp</h2>
<h3>Bốn lỗi lặp đi lặp lại</h3>
<pre><code>1. 死译 (sǐyì) — dịch "chết"/dịch từng chữ
   Sai:  "他给我打了一个电话" → "Anh ấy cho tôi đánh một cái điện thoại."
   Đúng: "Anh ấy đã gọi điện cho tôi."

2. Bỏ sót định ngữ dài thay vì đảo trật tự
   Sai:  bỏ qua "从图书馆借的" và chỉ dịch "那本书" thành "quyển sách"
   Đúng: giữ đủ định ngữ, đảo trật tự (xem Chương 2/4).

3. Lạm dụng từ Hán Việt trong khi tiếng Việt thuần tự nhiên hơn
   Cứng nhắc: "Bổn nhân dĩ hoàn thành công tác."
   Tự nhiên:  "Tôi đã hoàn thành công việc."

4. Sai lượng từ (量词) khi Việt hoá
   Sai:  "một con sách" (lượng từ vô nghĩa)
   Đúng: "một quyển/cuốn sách"
</code></pre>
<h3>Đoạn văn thực hành</h3>
<pre><code>中文原文：
昨天下午，我在公司附近新开的那家咖啡馆里，遇到了一位老朋友。
他现在在一家外贸公司工作，主要负责把中国的产品介绍给越南客户。
我们聊了很久，约好下个月一起去河内出差。
</code></pre>
<p>Hãy tự dịch đoạn này trước khi xem bản tham khảo bên dưới — chú ý định ngữ dài ("新开的那家" trước 咖啡馆), cảm giác chủ đề-thuyết minh ở câu 2, và cách diễn đạt tự nhiên tiếng Việt cho 出差 (đi công tác).</p>
<pre><code>Bản dịch tham khảo:
Chiều hôm qua, tôi tình cờ gặp một người bạn cũ ở quán cà phê mới mở
gần công ty. Anh ấy hiện đang làm việc ở một công ty ngoại thương,
chủ yếu phụ trách giới thiệu sản phẩm Trung Quốc cho khách hàng Việt Nam.
Chúng tôi trò chuyện rất lâu và hẹn nhau tháng sau cùng đi công tác Hà Nội.
</code></pre>
<div class="callout"><span class="badge">Tự kiểm tra</span> Đọc TO bản dịch của chính bạn, tách biệt khỏi bản tiếng Trung — nếu nó không nghe giống câu người Việt tự nhiên nói, nó KHÔNG đạt tiêu chí đạt, dù có trung thành đến đâu.</div>`,
  ]]);

const c8q = quiz('cct401-quiz-8', 'Quiz 8 — Ôn tập & sửa lỗi|||Quiz 8 — Ôn tập & sửa lỗi', [
  { id: 'q1', question: '"死译" (sǐyì) là lỗi dịch gì?', options: ['Dịch quá thoát ý, xa nguyên văn', 'Dịch cứng/dịch chết theo từng chữ khiến câu tối nghĩa', 'Dịch sai thời gian trong câu', 'Chỉ là lỗi chính tả'], correctIndex: 1, explanation: '死译 là dịch máy móc từng chữ, giữ đúng nghĩa từng từ nhưng câu không tự nhiên, khó hiểu.' },
  { id: 'q2', question: 'Lỗi thường gặp khi Việt hoá liên quan đến việc dùng sai loại từ nào?', options: ['Thì của động từ', 'Lượng từ (quyển/tờ/chiếc…) không khớp với loại vật', 'Dấu câu cuối câu', 'Ngôi xưng hô'], correctIndex: 1, explanation: 'Dùng sai lượng từ (vd "một con sách" thay vì "một quyển sách") là lỗi Việt hoá phổ biến.' },
  { id: 'q3', question: 'Nên ưu tiên dùng từ thuần Việt thay vì lạm dụng từ Hán Việt khi nào?', options: ['Luôn luôn bắt buộc dùng từ Hán Việt', 'Khi từ thuần Việt tự nhiên hơn trong văn phong hiện đại và tránh câu cứng nhắc', 'Không bao giờ được dùng từ thuần Việt', 'Chỉ khi viết thơ ca'], correctIndex: 1, explanation: 'Từ Hán Việt hữu ích nhưng lạm dụng gây câu cứng nhắc, thiếu tự nhiên — nên ưu tiên diễn đạt tự nhiên hơn.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CCT401',
    slug: 'cct401-chinese-translation-and-interpretation-1',
    title: 'Chinese Translation and Interpretation 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CCT401.webp',
    shortDescription: 'Intro to Chinese-Vietnamese translation & interpreting: Yan Fu\'s 信达雅 criteria, Sino-Vietnamese vocabulary, syntax reordering, idioms & culture, basic consecutive interpreting. 8 chapters, bilingual with worked examples & quizzes.|||Nhập môn biên - phiên dịch Trung-Việt: tiêu chí 信达雅 (tín-đạt-nhã), từ Hán Việt, điều chỉnh trật tự câu, thành ngữ & văn hoá, phiên dịch đuổi cơ bản. 8 chương, song ngữ có ví dụ & quiz.',
    description: 'Môn <strong>CCT401 — Chinese Translation and Interpretation 1</strong> (Biên - Phiên dịch tiếng Trung 1, kỳ 4, ngành Ngôn ngữ Trung) là môn nhập môn dịch thuật Trung-Việt. Từ <strong>tiêu chí dịch 信达雅</strong> (tín-đạt-nhã của Nghiêm Phục) → <strong>khác biệt ngôn ngữ &amp; tư duy Trung-Việt</strong> (định ngữ, lượng từ) → <strong>kỹ thuật dịch từ/cụm từ</strong> (dịch nghĩa, dịch âm, từ Hán Việt) → <strong>điều chỉnh trật tự câu</strong> (把/被, bổ ngữ) → <strong>dịch văn bản thông dụng</strong> (thông báo, giới thiệu) → <strong>thành ngữ &amp; văn hoá</strong> → <strong>nhập môn phiên dịch đuổi</strong> → <strong>ôn tập, sửa lỗi</strong>. Bám 汉越翻译教程 và 翻译理论与实践 (张培基), song ngữ, có ví dụ dịch Trung-Việt cụ thể và quiz mỗi chương.',
    whatYouLearn: 'Phân biệt 笔译/口译; tiêu chí 信达雅 (tín-đạt-nhã) và thứ tự ưu tiên; khác biệt định ngữ & lượng từ (量词) Trung-Việt; kỹ thuật 直译 (dịch nghĩa) và 音译 (dịch âm); dùng từ Hán Việt (汉越词) đúng chỗ, tránh "giả bằng hữu"; nguyên tắc dịch danh từ riêng; điều chỉnh câu 把/被 và bổ ngữ kết quả/xu hướng; dịch văn bản thông báo & giới thiệu (应用文); chiến lược dịch thành ngữ/quán ngữ (成语/惯用语); nhập môn 交替传译 (dịch đuổi) — nghe ý chính, ghi chú 笔记法; nhận diện & sửa 4 lỗi dịch thường gặp qua bài thực hành đoạn văn.',
    requirements: 'Đã học tiếng Trung cơ bản (từ vựng & ngữ pháp sơ-trung cấp, tương đương HSK 3 trở lên) và tiếng Việt bản ngữ hoặc tương đương. Không yêu cầu kinh nghiệm dịch thuật trước đó.',
  },
  sections: [
    { title: 'Chương 1 — Tổng quan & tiêu chí 信达雅|||Chapter 1 — Overview & 信达雅 criteria', description: 'Tín-đạt-nhã (信达雅) của Nghiêm Phục; ví dụ dịch từng chữ vs dịch tự nhiên.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khác biệt ngôn ngữ & tư duy|||Chapter 2 — Language & mindset gaps', description: 'Trật tự định ngữ, lượng từ (量词), câu chủ đề-thuyết minh.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kỹ thuật dịch từ & cụm từ|||Chapter 3 — Word & phrase techniques', description: 'Dịch nghĩa (直译), dịch âm (音译), từ Hán Việt, dịch danh từ riêng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Dịch câu & trật tự cú pháp|||Chapter 4 — Sentence & syntax reordering', description: 'Câu 把/被, bổ ngữ kết quả/xu hướng, đảo trạng ngữ dài.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Dịch văn bản thông dụng|||Chapter 5 — Common text translation', description: 'Thông báo (通知), văn bản giới thiệu (介绍), thuật ngữ cố định.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thành ngữ, quán ngữ & văn hoá|||Chapter 6 — Idioms & culture', description: '成语, 惯用语/俗语; ba chiến lược xử lý khi dịch.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Nhập môn phiên dịch đuổi|||Chapter 7 — Intro to consecutive interpreting', description: '交替传译 vs 同声传译, kỹ năng nghe ý chính & ghi chú 笔记法.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập: thực hành & sửa lỗi|||Chapter 8 — Review: practice & error fixing', description: '4 lỗi thường gặp, bài thực hành đoạn văn có bản dịch tham khảo.', lessons: [c8, c8q] },
  ],
};
