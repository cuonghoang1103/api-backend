/**
 * CHG401c — Chinese Grammar (bản c: NGỮ PHÁP THỰC HÀNH & ỨNG DỤNG).
 * Khác CHG401 (ngữ pháp hệ thống theo từ loại/thành phần câu): bản này xoáy vào
 * các điểm ngữ pháp dễ nhầm, sửa lỗi sai, so sánh cặp cấu trúc gần nghĩa, luyện
 * dùng đúng — theo tinh thần 对外汉语教学语法 / Common Chinese Grammar Errors /
 * AllSet Chinese Grammar Wiki (trích dẫn, không upload PDF).
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${} lồng nhau.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

// ── Chapter 1 — Word order errors ──────────────────────────────────────────
const c1 = doc('chg401c-1-1-word-order', '1.1 — Word order mistakes & how to fix them|||1.1 — Lỗi trật tự từ & cách sửa',
  'Trạng ngữ thời gian/tần suất/mức độ/nơi chốn phải đứng TRƯỚC động từ trong tiếng Trung, khác thói quen tiếng Anh; so sánh 在 trước và sau động từ.',
  [[
    `<span class="eyebrow">CHG401c · Chapter 1 · Lesson 1.1</span>
<h2>Word order mistakes &amp; how to fix them</h2>
<p class="lead">Chinese is Subject-Verb-Object like English, but most <strong>adverbials</strong> (time, frequency, degree, and the place of an ongoing action) sit <strong>before the verb</strong>, not after it. Translating word-for-word from English/Vietnamese is the #1 cause of word-order errors.</p>
<h3>The basic template</h3>
<pre><code>Subject + Time + Place (在...) + Manner + Verb + Object</code></pre>
<h3>Common mistakes</h3>
<pre><code>✗ 我去昨天北京。
✓ 我昨天去北京。   Wǒ zuótiān qù Běijīng.   "I went to Beijing yesterday."

✗ 他高很。
✓ 他很高。          Tā hěn gāo.              "He is (very) tall."

✗ 我学习汉语每天。
✓ 我每天学习汉语。  Wǒ měitiān xuéxí Hànyǔ.  "I study Chinese every day."</code></pre>
<h3>在 (location): before or after the verb?</h3>
<p>The location of an <em>ongoing action</em> goes BEFORE the verb. The location that is the RESULT of the action goes AFTER it, as a complement.</p>
<pre><code>他在北京工作。   Tā zài Běijīng gōngzuò.  "He works in Beijing." (在 before verb — where the action happens)
他坐在椅子上。   Tā zuò zài yǐzi shàng.   "He sits on the chair." (在 after verb — where the action ends up)</code></pre>
<div class="callout"><span class="badge">Fix strategy</span> Whenever you catch yourself translating word-for-word from English, check every adverbial — time, frequency, degree, most locations — and move it in front of the verb. That single habit fixes most word-order errors.</div>`,
    `<span class="eyebrow">CHG401c · Chương 1 · Bài 1.1</span>
<h2>Lỗi trật tự từ &amp; cách sửa</h2>
<p class="lead">Tiếng Trung cũng theo trật tự Chủ-Động-Tân như tiếng Anh/Việt, nhưng phần lớn <strong>trạng ngữ</strong> (thời gian, tần suất, mức độ, và nơi chốn của hành động đang diễn ra) phải đứng <strong>TRƯỚC động từ</strong>, không đứng sau. Dịch nguyên trật tự từ tiếng Anh/Việt sang là nguyên nhân số một gây lỗi trật tự từ.</p>
<h3>Khung câu cơ bản</h3>
<pre><code>Chủ ngữ + Thời gian + Nơi chốn (在...) + Cách thức + Động từ + Tân ngữ</code></pre>
<h3>Lỗi thường gặp</h3>
<pre><code>✗ 我去昨天北京。   (sai: động từ đứng trước từ chỉ thời gian)
✓ 我昨天去北京。   Wǒ zuótiān qù Běijīng.   "Hôm qua tôi đã đi Bắc Kinh."

✗ 他高很。          (sai: phó từ mức độ đứng sau tính từ)
✓ 他很高。          Tā hěn gāo.              "Anh ấy rất cao."

✗ 我学习汉语每天。  (sai: trạng ngữ tần suất đặt cuối câu)
✓ 我每天学习汉语。  Wǒ měitiān xuéxí Hànyǔ.  "Ngày nào tôi cũng học tiếng Trung."</code></pre>
<h3>在 (nơi chốn): trước hay sau động từ?</h3>
<p>Nơi chốn của một hành động <em>đang diễn ra</em> đứng TRƯỚC động từ. Nơi chốn là KẾT QUẢ của hành động thì đứng SAU động từ, đóng vai trò bổ ngữ.</p>
<pre><code>他在北京工作。   Tā zài Běijīng gōngzuò.  "Anh ấy làm việc ở Bắc Kinh." (在 trước động từ — nơi hành động xảy ra)
他坐在椅子上。   Tā zuò zài yǐzi shàng.   "Anh ấy ngồi trên ghế." (在 sau động từ — nơi hành động dừng lại)</code></pre>
<div class="callout"><span class="badge">Mẹo sửa lỗi</span> Mỗi khi thấy mình đang dịch y nguyên trật tự tiếng Anh/Việt, hãy soát lại từng trạng ngữ — thời gian, tần suất, mức độ, phần lớn nơi chốn — và dời nó lên trước động từ. Chỉ riêng thói quen này đã sửa được phần lớn lỗi trật tự từ.</div>`,
  ]]);

const c1q = quiz('chg401c-quiz-1', 'Quiz 1 — Word order|||Quiz 1 — Trật tự từ', [
  { id: 'q1', question: 'Câu nào đúng trật tự từ (nghĩa: "Hôm qua tôi đã đi Bắc Kinh")?', options: ['我去昨天北京。', '我很昨天去北京。', '我昨天去北京。', '我去北京昨天。'], correctIndex: 2, explanation: 'Trạng ngữ thời gian 昨天 phải đứng TRƯỚC động từ 去: 我昨天去北京 (Wǒ zuótiān qù Běijīng).' },
  { id: 'q2', question: 'Câu nào đúng (nghĩa: "Anh ấy rất cao")?', options: ['他高很。', '他很高。', '很他高。', '他高了很。'], correctIndex: 1, explanation: 'Phó từ mức độ 很 đứng TRƯỚC tính từ: 他很高 (Tā hěn gāo).' },
  { id: 'q3', question: 'Câu "我学习汉语每天" sai ở đâu và sửa thế nào?', options: ['Sai động từ, sửa thành 学', 'Trạng ngữ tần suất 每天 phải đứng trước động từ: 我每天学习汉语', '不cần sửa, câu đã đúng', 'Bỏ hẳn 每天'], correctIndex: 1, explanation: 'Trạng ngữ tần suất đứng trước động từ: 我每天学习汉语 (Wǒ měitiān xuéxí Hànyǔ).' },
]);

// ── Chapter 2 — 的/得/地 ─────────────────────────────────────────────────
const c2 = doc('chg401c-2-1-de-de-di', '2.1 — Telling 的 / 得 / 地 apart|||2.1 — Phân biệt 的 / 得 / 地',
  'Ba chữ đều đọc "de" nhưng chức năng khác nhau: 的 gắn với danh từ, 地 gắn TRƯỚC động từ, 得 gắn SAU động từ để nối bổ ngữ.',
  [[
    `<span class="eyebrow">CHG401c · Chapter 2 · Lesson 2.1</span>
<h2>Telling 的 / 得 / 地 apart</h2>
<p class="lead">All three are pronounced <strong>de</strong> (neutral tone) and Vietnamese/English learners constantly confuse them in writing, because Vietnamese has no equivalent split. Each one attaches to a different part of speech.</p>
<h3>的 (de) — before a NOUN: possession / attribute</h3>
<pre><code>我的书       wǒ de shū        "my book"
漂亮的花     piàoliang de huā  "a beautiful flower"</code></pre>
<h3>地 (de) — before a VERB: manner adverbial</h3>
<pre><code>认真地学习   rènzhēn de xuéxí   "study seriously"
高兴地说     gāoxìng de shuō    "say happily"</code></pre>
<h3>得 (de) — after a VERB: connects a degree/result complement</h3>
<pre><code>跑得快       pǎo de kuài        "run(s) fast"
说得很好     shuō de hěn hǎo    "speak(s) very well"</code></pre>
<h3>Common mistakes</h3>
<pre><code>✗ 他跑的很快。
✓ 他跑得很快。   Tā pǎo de hěn kuài.   "He runs very fast." (complement after verb → 得)

✗ 他高兴的说。
✓ 他高兴地说。   Tā gāoxìng de shuō.   "He said it happily." (adverbial before verb → 地)

✗ 我地书。
✓ 我的书。       wǒ de shū.            "my book" (noun modifier → 的)</code></pre>
<div class="callout"><span class="badge">Memory trick</span> 的 sits right before a NOUN. 地 sits right before a VERB (adverbial). 得 sits right after a VERB, introducing "how well/how much" (a complement). If you can ask "how?" about what follows, and it's the word right before that answer, it's usually 得.</div>`,
    `<span class="eyebrow">CHG401c · Chương 2 · Bài 2.1</span>
<h2>Phân biệt 的 / 得 / 地</h2>
<p class="lead">Cả ba chữ đều đọc là <strong>de</strong> (thanh nhẹ) nên người học tiếng Việt/Anh rất hay viết lẫn, vì tiếng Việt không có sự phân biệt tương ứng. Mỗi chữ gắn với một loại từ khác nhau.</p>
<h3>的 (de) — đứng TRƯỚC DANH TỪ: sở hữu / định ngữ</h3>
<pre><code>我的书       wǒ de shū        "sách của tôi"
漂亮的花     piàoliang de huā  "bông hoa đẹp"</code></pre>
<h3>地 (de) — đứng TRƯỚC ĐỘNG TỪ: trạng ngữ chỉ cách thức</h3>
<pre><code>认真地学习   rènzhēn de xuéxí   "học một cách nghiêm túc"
高兴地说     gāoxìng de shuō    "nói một cách vui vẻ"</code></pre>
<h3>得 (de) — đứng SAU ĐỘNG TỪ: nối với bổ ngữ mức độ/kết quả</h3>
<pre><code>跑得快       pǎo de kuài        "chạy nhanh"
说得很好     shuō de hěn hǎo    "nói rất tốt"</code></pre>
<h3>Lỗi thường gặp</h3>
<pre><code>✗ 他跑的很快。
✓ 他跑得很快。   Tā pǎo de hěn kuài.   "Anh ấy chạy rất nhanh." (bổ ngữ sau động từ → dùng 得)

✗ 他高兴的说。
✓ 他高兴地说。   Tā gāoxìng de shuō.   "Anh ấy nói một cách vui vẻ." (trạng ngữ trước động từ → dùng 地)

✗ 我地书。
✓ 我的书。       wǒ de shū.            "sách của tôi" (định ngữ trước danh từ → dùng 的)</code></pre>
<div class="callout"><span class="badge">Mẹo nhớ</span> 的 luôn đứng ngay trước DANH TỪ. 地 luôn đứng ngay trước ĐỘNG TỪ (trạng ngữ cách thức). 得 luôn đứng ngay SAU ĐỘNG TỪ, mở đầu phần trả lời cho câu hỏi "làm thế nào/đến mức nào" (bổ ngữ). Nếu phần sau trả lời được câu hỏi "thế nào?", chữ nối nó với động từ thường là 得.</div>`,
  ]]);

const c2q = quiz('chg401c-quiz-2', 'Quiz 2 — 的/得/地|||Quiz 2 — 的/得/地', [
  { id: 'q1', question: 'Chọn câu đúng (nghĩa: "Anh ấy chạy rất nhanh")', options: ['他跑的很快。', '他跑地很快。', '他跑得很快。', '他很快跑的。'], correctIndex: 2, explanation: 'Bổ ngữ mức độ sau động từ nối bằng 得: 他跑得很快 (Tā pǎo de hěn kuài).' },
  { id: 'q2', question: 'Chọn câu đúng (nghĩa: "Anh ấy nói một cách vui vẻ")', options: ['他高兴的说。', '他高兴地说。', '他高兴得说。', '他说高兴地。'], correctIndex: 1, explanation: 'Trạng ngữ cách thức trước động từ nối bằng 地: 他高兴地说 (Tā gāoxìng de shuō).' },
  { id: 'q3', question: '"我___书" (sách của tôi) điền chữ nào?', options: ['得', '地', '的', 'Cả 3 đều được'], correctIndex: 2, explanation: 'Định ngữ sở hữu trước danh từ dùng 的: 我的书 (wǒ de shū).' },
]);

// ── Chapter 3 — 了1 vs 了2 ───────────────────────────────────────────────
const c3 = doc('chg401c-3-1-le1-le2', '3.1 — 了1 (completed action) vs 了2 (new situation)|||3.1 — 了1 (hành động hoàn thành) và 了2 (tình huống mới)',
  '了 đứng ngay sau động từ (了1) đánh dấu hành động đã hoàn thành; 了 đứng cuối câu (了2) đánh dấu tình huống/trạng thái MỚI; phủ định dùng 没(有) và BỎ 了.',
  [[
    `<span class="eyebrow">CHG401c · Chapter 3 · Lesson 3.1</span>
<h2>了1 (completed action) vs 了2 (new situation)</h2>
<p class="lead">Chinese has two different "了" that look identical but do different jobs. Confusing them — or forgetting the negation rule — is one of the most common beginner errors.</p>
<h3>了1 — right after the verb: the action is completed</h3>
<pre><code>我吃了饭。     Wǒ chīle fàn.       "I ate / have eaten."
我学了三年汉语。 Wǒ xuéle sān nián Hànyǔ.  "I've studied Chinese for 3 years."</code></pre>
<h3>了2 — at the END of the sentence: a NEW situation / change of state</h3>
<pre><code>我是学生了。   Wǒ shì xuéshēng le.  "I'm a student now." (I wasn't before)
天黑了。       Tiān hēi le.         "It's gotten dark." (it wasn't dark before)</code></pre>
<p>The two can appear together, marking both completion AND a new state: <strong>我吃了饭了</strong> (Wǒ chīle fàn le) — "I've already eaten (so I'm no longer hungry / we can go now)."</p>
<h3>The negation trap</h3>
<p>To negate a completed action, use <strong>没(有)</strong> and <strong>drop</strong> 了 entirely — never use 不 with a completed action, and never keep 了 after 没.</p>
<pre><code>✗ 我没吃了饭。
✓ 我没(有)吃饭。   Wǒ méi(yǒu) chīfàn.   "I haven't eaten." (了 disappears under 没)

✗ 我不吃了饭。
✓ 我没吃饭。</code></pre>
<div class="callout"><span class="badge">Quick test</span> If 了 is glued to the verb → ask "is the action done?" (了1). If 了 is the very last word of the sentence → ask "did something just change?" (了2). If you're negating with 没, 了 must vanish.</div>`,
    `<span class="eyebrow">CHG401c · Chương 3 · Bài 3.1</span>
<h2>了1 (hành động hoàn thành) và 了2 (tình huống mới)</h2>
<p class="lead">Tiếng Trung có hai chữ "了" trông giống hệt nhau nhưng làm hai việc khác nhau. Nhầm lẫn giữa hai loại — hoặc quên quy tắc phủ định — là một trong những lỗi phổ biến nhất của người mới học.</p>
<h3>了1 — ngay sau động từ: hành động đã hoàn thành</h3>
<pre><code>我吃了饭。       Wǒ chīle fàn.             "Tôi đã ăn cơm."
我学了三年汉语。 Wǒ xuéle sān nián Hànyǔ.  "Tôi đã học tiếng Trung được 3 năm."</code></pre>
<h3>了2 — ở CUỐI câu: một tình huống/trạng thái MỚI</h3>
<pre><code>我是学生了。   Wǒ shì xuéshēng le.  "Bây giờ tôi là học sinh rồi." (trước đây chưa phải)
天黑了。       Tiān hēi le.         "Trời tối rồi." (trước đó chưa tối)</code></pre>
<p>Hai loại có thể xuất hiện cùng lúc, đánh dấu vừa hoàn thành vừa trạng thái mới: <strong>我吃了饭了</strong> (Wǒ chīle fàn le) — "Tôi ăn cơm rồi (nên giờ hết đói/có thể đi được rồi)."</p>
<h3>Bẫy phủ định</h3>
<p>Muốn phủ định một hành động đã hoàn thành, dùng <strong>没(有)</strong> và <strong>bỏ hẳn</strong> chữ 了 — không bao giờ dùng 不 với hành động đã hoàn thành, và không bao giờ giữ 了 sau 没.</p>
<pre><code>✗ 我没吃了饭。
✓ 我没(有)吃饭。   Wǒ méi(yǒu) chīfàn.   "Tôi chưa ăn cơm." (了 biến mất khi có 没)

✗ 我不吃了饭。
✓ 我没吃饭。</code></pre>
<div class="callout"><span class="badge">Cách kiểm tra nhanh</span> Nếu 了 dính liền sau động từ → hỏi "hành động đã xong chưa?" (了1). Nếu 了 là chữ cuối cùng của câu → hỏi "có gì vừa thay đổi không?" (了2). Nếu đang phủ định bằng 没 thì 了 phải biến mất.</div>`,
  ]]);

const c3q = quiz('chg401c-quiz-3', 'Quiz 3 — 了1 vs 了2|||Quiz 3 — 了1 và 了2', [
  { id: 'q1', question: 'Câu "我吃了饭" — chữ 了 ở đây là loại nào?', options: ['了2, đánh dấu tình huống mới', '了1, đánh dấu hành động đã hoàn thành', 'Không phải trợ từ 了', 'Cả hai loại cùng lúc'], correctIndex: 1, explanation: '了 dính liền sau động từ 吃 → 了1, đánh dấu hành động đã hoàn thành.' },
  { id: 'q2', question: 'Muốn nói "Tôi chưa ăn cơm" (phủ định hành động), câu nào đúng?', options: ['我不吃了饭。', '我没吃了饭。', '我没(有)吃饭。', '我吃没饭了。'], correctIndex: 2, explanation: 'Phủ định hành động đã/đang xảy ra dùng 没(有) và BỎ 了: 我没(有)吃饭 (Wǒ méi(yǒu) chīfàn).' },
  { id: 'q3', question: 'Câu "天黑了" thể hiện điều gì?', options: ['Hành động chỉnh trời vừa hoàn thành', 'Một tình huống/trạng thái MỚI vừa xảy ra (trời vừa tối)', 'Phủ định', 'Câu hỏi'], correctIndex: 1, explanation: '了 ở cuối câu (了2) đánh dấu trạng thái mới: trước đó trời chưa tối, giờ đã tối.' },
]);

// ── Chapter 4 — 会/能/可以 ───────────────────────────────────────────────
const c4 = doc('chg401c-4-1-hui-neng-keyi', '4.1 — 会 vs 能 vs 可以 (modal verbs)|||4.1 — Phân biệt 会 / 能 / 可以',
  '会: kỹ năng học được; 能: khả năng thể chất/hoàn cảnh cho phép; 可以: sự cho phép. Ba động từ năng nguyện dễ nhầm khi dịch "can/could/may".',
  [[
    `<span class="eyebrow">CHG401c · Chapter 4 · Lesson 4.1</span>
<h2>会 vs 能 vs 可以 (modal verbs)</h2>
<p class="lead">English/Vietnamese collapse "can / could / may" into one word each, but Chinese splits ability into three different modal verbs. Picking the wrong one is a classic beginner error.</p>
<h3>会 (huì) — a LEARNED skill (or future likelihood)</h3>
<pre><code>我会说汉语。   Wǒ huì shuō Hànyǔ.   "I can speak Chinese." (I learned it)
明天会下雨。   Míngtiān huì xiàyǔ.  "It will (probably) rain tomorrow."</code></pre>
<h3>能 (néng) — physical ability or a circumstance that allows/prevents something</h3>
<pre><code>我能喝十杯水。   Wǒ néng hē shí bēi shuǐ.   "I can drink ten cups of water." (physical capacity)
今天我不能去。   Jīntiān wǒ bù néng qù.     "I can't go today." (circumstance — e.g. I'm busy)</code></pre>
<h3>可以 (kěyǐ) — PERMISSION ("may")</h3>
<pre><code>你可以进来。   Nǐ kěyǐ jìnlái.   "You may come in."
我可以问一下吗？ Wǒ kěyǐ wèn yíxià ma?  "May I ask something?"</code></pre>
<h3>Common mistakes</h3>
<pre><code>✗ 我会进来吗？   (asking permission with 会 — wrong)
✓ 我可以进来吗？  Wǒ kěyǐ jìnlái ma?   "May I come in?"

✗ 明天可以下雨。 (weather likelihood with 可以 — wrong)
✓ 明天会下雨。</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Learned skill / prediction → 会. Physical capacity or circumstance → 能. Asking or granting permission → 可以. When two overlap (e.g. ability due to rule, "swimming is allowed here") 能 and 可以 can both work — but permission questions ("may I...?") should default to 可以.</div>`,
    `<span class="eyebrow">CHG401c · Chương 4 · Bài 4.1</span>
<h2>Phân biệt 会 / 能 / 可以</h2>
<p class="lead">Tiếng Việt/Anh gộp chung "can / could / may" vào một từ, nhưng tiếng Trung tách khả năng thành ba động từ năng nguyện khác nhau. Chọn sai là lỗi kinh điển của người mới học.</p>
<h3>会 (huì) — kỹ năng ĐÃ HỌC được (hoặc khả năng xảy ra trong tương lai)</h3>
<pre><code>我会说汉语。   Wǒ huì shuō Hànyǔ.   "Tôi biết nói tiếng Trung." (đã học được)
明天会下雨。   Míngtiān huì xiàyǔ.  "Mai (chắc) sẽ mưa."</code></pre>
<h3>能 (néng) — khả năng thể chất, hoặc hoàn cảnh cho phép/không cho phép</h3>
<pre><code>我能喝十杯水。   Wǒ néng hē shí bēi shuǐ.   "Tôi uống được mười cốc nước." (khả năng thể chất)
今天我不能去。   Jīntiān wǒ bù néng qù.     "Hôm nay tôi không đi được." (do hoàn cảnh, vd bận việc)</code></pre>
<h3>可以 (kěyǐ) — SỰ CHO PHÉP ("được phép")</h3>
<pre><code>你可以进来。   Nǐ kěyǐ jìnlái.   "Bạn được phép vào."
我可以问一下吗？ Wǒ kěyǐ wèn yíxià ma?  "Tôi hỏi một chút được không?"</code></pre>
<h3>Lỗi thường gặp</h3>
<pre><code>✗ 我会进来吗？   (dùng 会 để xin phép — sai)
✓ 我可以进来吗？  Wǒ kěyǐ jìnlái ma?   "Tôi vào được không?"

✗ 明天可以下雨。 (dùng 可以 cho khả năng thời tiết — sai)
✓ 明天会下雨。</code></pre>
<div class="callout"><span class="badge">Ghi nhớ nhanh</span> Kỹ năng đã học / dự đoán → 会. Khả năng thể chất hoặc hoàn cảnh → 能. Xin phép hoặc cho phép → 可以. Khi hai nghĩa chồng nhau (vd khả năng do quy định cho phép, "ở đây được bơi") thì 能 và 可以 đều dùng được — nhưng câu hỏi xin phép ("... được không?") nên mặc định dùng 可以.</div>`,
  ]]);

const c4q = quiz('chg401c-quiz-4', 'Quiz 4 — 会/能/可以|||Quiz 4 — 会/能/可以', [
  { id: 'q1', question: '"Tôi biết nói tiếng Trung" (kỹ năng đã học) dịch đúng là?', options: ['我能说汉语。', '我可以说汉语。', '我会说汉语。', '我要说汉语。'], correctIndex: 2, explanation: 'Kỹ năng học được dùng 会: 我会说汉语 (Wǒ huì shuō Hànyǔ).' },
  { id: 'q2', question: '"Tôi vào được không?" (xin phép) dịch đúng là?', options: ['我会进来吗？', '我可以进来吗？', '我能进来吗？(chỉ đúng nếu hỏi khả năng thể chất)', '我进来会吗？'], correctIndex: 1, explanation: 'Xin phép dùng 可以: 我可以进来吗？(Wǒ kěyǐ jìnlái ma?)' },
  { id: 'q3', question: '"Hôm nay tôi không đi được" (vì bận việc, hoàn cảnh) dịch đúng là?', options: ['今天我不会去。', '今天我不可以去。', '今天我不能去。', '今天我去不会。'], correctIndex: 2, explanation: 'Hoàn cảnh ngăn cản dùng 能: 今天我不能去 (Jīntiān wǒ bù néng qù).' },
]);

// ── Chapter 5 — 又/再/还 ────────────────────────────────────────────────
const c5 = doc('chg401c-5-1-you-zai-hai', '5.1 — 又 vs 再 vs 还 (near-synonym adverbs)|||5.1 — Phân biệt 又 / 再 / 还',
  '又: "lại" cho việc ĐÃ xảy ra (quá khứ); 再: "lại/nữa" cho việc CHƯA xảy ra (tương lai); 还: "vẫn/còn/thêm". Cả ba đều dịch mơ hồ là "again/still" nên rất dễ lẫn.',
  [[
    `<span class="eyebrow">CHG401c · Chapter 5 · Lesson 5.1</span>
<h2>又 vs 再 vs 还 (near-synonym adverbs)</h2>
<p class="lead">All three can be glossed as "again" or "still" in English, which is exactly why learners mix them up. The key is: has the repeated action ALREADY happened, or NOT YET?</p>
<h3>又 (yòu) — "again", for something that ALREADY happened (past, realized repetition)</h3>
<pre><code>他昨天又迟到了。   Tā zuótiān yòu chídào le.   "He was late again yesterday."</code></pre>
<h3>再 (zài) — "again / once more", for something NOT YET realized (future, request, condition)</h3>
<pre><code>请再说一遍。   Qǐng zài shuō yí biàn.   "Please say it again."
明天再来。     Míngtiān zài lái.        "Come again tomorrow."</code></pre>
<h3>还 (hái) — "still / also / in addition"</h3>
<pre><code>我还没吃饭。     Wǒ hái méi chīfàn.   "I still haven't eaten."
他还想去。       Tā hái xiǎng qù.     "He still wants to go."
我要一个包子，还要一杯豆浆。   Wǒ yào yí ge bāozi, hái yào yì bēi dòujiāng.   "I'll have a bun, and also a soy milk."</code></pre>
<h3>Common mistakes</h3>
<pre><code>✗ 明天我又去。    (又 used for a future repetition — wrong)
✓ 明天我再去。    Míngtiān wǒ zài qù.   "I'll go again tomorrow."

✗ 他再来了吗？    (再 used for a completed past event — wrong)
✓ 他又来了吗？    Tā yòu lái le ma?     "Did he come again?"</code></pre>
<div class="callout"><span class="badge">One-line test</span> Did it already happen? → 又. Hasn't happened yet (a plan/request/condition)? → 再. Neither "again", more like "still/also"? → 还.</div>`,
    `<span class="eyebrow">CHG401c · Chương 5 · Bài 5.1</span>
<h2>Phân biệt 又 / 再 / 还</h2>
<p class="lead">Cả ba đều có thể dịch mơ hồ là "lại/nữa/vẫn" nên người học rất hay lẫn lộn. Chìa khoá là: việc lặp lại đó ĐÃ xảy ra rồi, hay CHƯA xảy ra?</p>
<h3>又 (yòu) — "lại", cho việc ĐÃ xảy ra (quá khứ, lặp lại có thật)</h3>
<pre><code>他昨天又迟到了。   Tā zuótiān yòu chídào le.   "Hôm qua anh ấy lại đến muộn."</code></pre>
<h3>再 (zài) — "lại/nữa", cho việc CHƯA xảy ra (tương lai, lời đề nghị, điều kiện)</h3>
<pre><code>请再说一遍。   Qǐng zài shuō yí biàn.   "Xin nói lại một lần nữa."
明天再来。     Míngtiān zài lái.        "Mai lại đến nhé."</code></pre>
<h3>还 (hái) — "vẫn / còn / thêm"</h3>
<pre><code>我还没吃饭。     Wǒ hái méi chīfàn.   "Tôi vẫn chưa ăn cơm."
他还想去。       Tā hái xiǎng qù.     "Anh ấy vẫn muốn đi."
我要一个包子，还要一杯豆浆。   Wǒ yào yí ge bāozi, hái yào yì bēi dòujiāng.   "Tôi lấy một cái bánh bao, và thêm một cốc sữa đậu nành."</code></pre>
<h3>Lỗi thường gặp</h3>
<pre><code>✗ 明天我又去。    (dùng 又 cho việc lặp lại trong tương lai — sai)
✓ 明天我再去。    Míngtiān wǒ zài qù.   "Mai tôi lại đi."

✗ 他再来了吗？    (dùng 再 cho việc đã xảy ra rồi — sai)
✓ 他又来了吗？    Tā yòu lái le ma?     "Anh ấy lại đến (rồi) à?"</code></pre>
<div class="callout"><span class="badge">Kiểm tra nhanh</span> Việc đó đã xảy ra rồi? → 又. Chưa xảy ra (kế hoạch/đề nghị/điều kiện)? → 再. Không phải "lại" mà nghiêng về "vẫn/còn/thêm"? → 还.</div>`,
  ]]);

const c5q = quiz('chg401c-quiz-5', 'Quiz 5 — 又/再/还|||Quiz 5 — 又/再/还', [
  { id: 'q1', question: '"Hôm qua anh ấy lại đến muộn" (đã xảy ra) dịch đúng là?', options: ['他昨天再迟到了。', '他昨天又迟到了。', '他昨天还迟到了。', '他昨天迟到又了。'], correctIndex: 1, explanation: 'Việc đã xảy ra rồi dùng 又: 他昨天又迟到了 (Tā zuótiān yòu chídào le).' },
  { id: 'q2', question: '"Xin nói lại một lần nữa" (lời đề nghị, chưa xảy ra) dịch đúng là?', options: ['请又说一遍。', '请还说一遍。', '请再说一遍。', '请说再一遍。'], correctIndex: 2, explanation: 'Lời đề nghị cho việc chưa xảy ra dùng 再: 请再说一遍 (Qǐng zài shuō yí biàn).' },
  { id: 'q3', question: '"Tôi vẫn chưa ăn cơm" dịch đúng là?', options: ['我又没吃饭。', '我再没吃饭。', '我还没吃饭。', '我没还吃饭。'], correctIndex: 2, explanation: '"Vẫn chưa" dùng 还: 我还没吃饭 (Wǒ hái méi chīfàn).' },
]);

// ── Chapter 6 — measure words & complex attributives ──────────────────────
const c6 = doc('chg401c-6-1-measure-words', '6.1 — Measure words & complex attributives|||6.1 — Lượng từ & định ngữ phức',
  'Lượng từ (量词) bắt buộc giữa số đếm và danh từ, mỗi nhóm danh từ có lượng từ riêng; thứ tự khi định ngữ xếp chồng: sở hữu + chỉ định/số lượng + mô tả(的) + loại + danh từ chính.',
  [[
    `<span class="eyebrow">CHG401c · Chapter 6 · Lesson 6.1</span>
<h2>Measure words &amp; complex attributives</h2>
<p class="lead">Chinese nouns can't be counted directly — a <strong>measure word</strong> (量词, "classifier") must sit between the number and the noun. There's no single default: each group of nouns takes its own measure word.</p>
<h3>Common measure words</h3>
<pre><code>个 gè    general-purpose (people, most everyday objects)
本 běn   bound/printed things: books, magazines
张 zhāng  flat objects: paper, tickets, tables, photos
件 jiàn   items of clothing, matters/affairs
只 zhī    animals
条 tiáo   long thin things: rivers, roads, fish, trousers</code></pre>
<h3>Common mistakes</h3>
<pre><code>✗ 一个书。
✓ 一本书。   yì běn shū.    "one book"

✗ 三个衣服。
✓ 三件衣服。 sān jiàn yīfu.  "three items of clothing"</code></pre>
<h3>Stacking attributives (定语) in the right order</h3>
<p>When several modifiers pile up before a noun, the order is roughly: <strong>possessive → demonstrative/quantity (+ measure word) → descriptive attribute (+ 的) → category noun → head noun</strong>. A category/material noun right before the head noun usually attaches WITHOUT 的.</p>
<pre><code>我的  那  三本         很有意思的     中文    书
(possessive)(demonstr.)(quantity+measure)(descriptive+的)(category, no 的)(head noun)
"wǒ de nà sān běn hěn yǒuyìsi de Zhōngwén shū"
= "those three very interesting Chinese books of mine"</code></pre>
<div class="callout"><span class="badge">Fix strategy</span> Learn measure words by NOUN GROUP, not one at a time (books/magazines → 本; clothes/matters → 件; animals → 只). When stacking modifiers, keep possession first and the noun's own category (like "Chinese", "wooden") glued directly to the head noun with no 的.</div>`,
    `<span class="eyebrow">CHG401c · Chương 6 · Bài 6.1</span>
<h2>Lượng từ &amp; định ngữ phức</h2>
<p class="lead">Danh từ tiếng Trung không đếm trực tiếp được — phải có một <strong>lượng từ</strong> (量词) đứng giữa số đếm và danh từ. Không có lượng từ mặc định chung: mỗi nhóm danh từ đi với lượng từ riêng.</p>
<h3>Các lượng từ thường gặp</h3>
<pre><code>个 gè    dùng chung (người, phần lớn vật thông thường)
本 běn   vật đóng thành cuốn: sách, tạp chí
张 zhāng  vật phẳng: giấy, vé, bàn, ảnh
件 jiàn   quần áo (từng món), sự việc
只 zhī    động vật
条 tiáo   vật dài mảnh: sông, đường, cá, quần</code></pre>
<h3>Lỗi thường gặp</h3>
<pre><code>✗ 一个书。
✓ 一本书。   yì běn shū.    "một cuốn sách"

✗ 三个衣服。
✓ 三件衣服。 sān jiàn yīfu.  "ba bộ/món quần áo"</code></pre>
<h3>Xếp đúng thứ tự khi định ngữ chồng nhiều lớp</h3>
<p>Khi nhiều thành phần bổ nghĩa cùng đứng trước một danh từ, thứ tự đại thể là: <strong>sở hữu → chỉ định/số lượng (+ lượng từ) → định ngữ mô tả (+ 的) → danh từ chỉ loại → danh từ chính</strong>. Danh từ chỉ loại/chất liệu đứng ngay trước danh từ chính thường KHÔNG cần 的.</p>
<pre><code>我的   那    三本            很有意思的      中文     书
(sở hữu)(chỉ định)(số lượng+lượng từ)(mô tả+的)(loại, không 的)(danh từ chính)
"wǒ de nà sān běn hěn yǒuyìsi de Zhōngwén shū"
= "ba cuốn sách tiếng Trung rất thú vị đó của tôi"</code></pre>
<div class="callout"><span class="badge">Mẹo sửa lỗi</span> Học lượng từ theo NHÓM DANH TỪ chứ không học lẻ từng từ (sách/tạp chí → 本; quần áo/sự việc → 件; động vật → 只). Khi định ngữ chồng nhiều lớp, giữ phần sở hữu ở đầu, và danh từ chỉ loại (như "tiếng Trung", "bằng gỗ") gắn liền ngay trước danh từ chính, không cần 的.</div>`,
  ]]);

const c6q = quiz('chg401c-quiz-6', 'Quiz 6 — Measure words|||Quiz 6 — Lượng từ', [
  { id: 'q1', question: '"Một cuốn sách" dịch đúng là?', options: ['一个书。', '一本书。', '一张书。', '一件书。'], correctIndex: 1, explanation: 'Sách/tạp chí dùng lượng từ 本: 一本书 (yì běn shū).' },
  { id: 'q2', question: '"Ba món quần áo" dịch đúng là?', options: ['三个衣服。', '三只衣服。', '三件衣服。', '三条衣服。'], correctIndex: 2, explanation: 'Quần áo (từng món) dùng lượng từ 件: 三件衣服 (sān jiàn yīfu).' },
  { id: 'q3', question: 'Trong cụm "我的那三本很有意思的中文书", vì sao "中文" không có 的 phía sau?', options: ['Vì 中文 là động từ', 'Vì danh từ chỉ loại/chất liệu đứng sát danh từ chính thường không cần 的', 'Vì câu sai ngữ pháp', 'Vì 中文 luôn không dùng được với 的'], correctIndex: 1, explanation: 'Danh từ chỉ loại (như 中文) gắn trực tiếp vào danh từ chính, không cần 的; 的 chỉ dùng cho phần định ngữ mô tả phía trước nó (很有意思的).' },
]);

// ── Chapter 7 — 把-sentence vs normal sentence ─────────────────────────────
const c7 = doc('chg401c-7-1-ba-sentence', '7.1 — 把-sentences vs normal sentences|||7.1 — Câu 把 và câu thường',
  'Câu 把 (Chủ ngữ + 把 + Tân ngữ XÁC ĐỊNH + Động từ + bổ ngữ) nhấn kết quả xử lý một vật cụ thể; không dùng 把 với tân ngữ phiếm chỉ hoặc động từ tâm lý/tri giác.',
  [[
    `<span class="eyebrow">CHG401c · Chapter 7 · Lesson 7.1</span>
<h2>把-sentences vs normal sentences</h2>
<p class="lead">The <strong>把 (bǎ) construction</strong> restructures a sentence to emphasize what happens TO a specific, definite object — "disposal" of that object. It is required whenever the verb has a resultative/directional complement describing what happened to a known object.</p>
<h3>The structure</h3>
<pre><code>Subject + 把 + [definite] Object + Verb + Complement/Result</code></pre>
<pre><code>我把书放在桌子上。   Wǒ bǎ shū fàng zài zhuōzi shàng.   "I put the book on the table."
把门关上。            Bǎ mén guān shàng.                  "Close the door (all the way)."</code></pre>
<p>Compare with the plain verb, which only names the action without stating where the object ends up:</p>
<pre><code>关门。   Guān mén.   "Close the door." (generic action, no result stated)</code></pre>
<h3>Two hard rules learners break</h3>
<pre><code>✗ 我把一本书买了。    (indefinite object "a book" — 把 needs a SPECIFIC, known object)
✓ 我买了一本书。      Wǒ mǎile yì běn shū.   "I bought a book." (normal sentence, no 把)

✗ 我把他喜欢。        (喜欢 is a mental/stative verb — no "disposal" effect, cannot take 把)
✓ 我喜欢他。          Wǒ xǐhuan tā.          "I like him."</code></pre>
<div class="callout"><span class="badge">When to reach for 把</span> Use 把 only when ALL of these hold: the object is specific/known to the listener, the verb has a complement showing a concrete result/location/change, and the verb is an action verb (not a mental/perception verb like 喜欢, 知道, 看见). Otherwise, use the plain SVO sentence.</div>`,
    `<span class="eyebrow">CHG401c · Chương 7 · Bài 7.1</span>
<h2>Câu 把 và câu thường</h2>
<p class="lead">Kết cấu <strong>把 (bǎ)</strong> đảo lại cấu trúc câu để nhấn mạnh điều xảy ra VỚI một vật cụ thể, xác định — "xử lý" vật đó. Bắt buộc dùng 把 khi động từ có bổ ngữ kết quả/xu hướng mô tả điều đã xảy ra với một vật đã biết.</p>
<h3>Cấu trúc</h3>
<pre><code>Chủ ngữ + 把 + Tân ngữ [xác định] + Động từ + Bổ ngữ/Kết quả</code></pre>
<pre><code>我把书放在桌子上。   Wǒ bǎ shū fàng zài zhuōzi shàng.   "Tôi đặt quyển sách lên bàn."
把门关上。            Bǎ mén guān shàng.                  "Đóng cửa lại (hẳn)."</code></pre>
<p>So với động từ thường, chỉ nêu hành động mà không nói vật kết thúc ở đâu:</p>
<pre><code>关门。   Guān mén.   "Đóng cửa." (hành động chung chung, không nói kết quả)</code></pre>
<h3>Hai quy tắc cứng người học hay phạm</h3>
<pre><code>✗ 我把一本书买了。    (tân ngữ phiếm chỉ "một quyển sách" — 把 cần tân ngữ CỤ THỂ, đã biết)
✓ 我买了一本书。      Wǒ mǎile yì běn shū.   "Tôi đã mua một quyển sách." (câu thường, không dùng 把)

✗ 我把他喜欢。        (喜欢 là động từ tâm lý — không có tác động "xử lý", không dùng được với 把)
✓ 我喜欢他。          Wǒ xǐhuan tā.          "Tôi thích anh ấy."</code></pre>
<div class="callout"><span class="badge">Khi nào dùng 把</span> Chỉ dùng 把 khi TẤT CẢ các điều sau đúng: tân ngữ cụ thể/đã biết với người nghe, động từ có bổ ngữ nêu rõ kết quả/nơi chốn/sự thay đổi, và động từ là động từ hành động (không phải động từ tâm lý/tri giác như 喜欢, 知道, 看见). Ngoài các trường hợp đó, dùng câu Chủ-Động-Tân bình thường.</div>`,
  ]]);

const c7q = quiz('chg401c-quiz-7', 'Quiz 7 — Câu 把|||Quiz 7 — Câu 把', [
  { id: 'q1', question: '"Tôi đặt quyển sách lên bàn" dịch đúng là?', options: ['我放书在桌子上。', '我把书放在桌子上。', '我把书放。', '书把我放在桌子上。'], correctIndex: 1, explanation: 'Có bổ ngữ kết quả nơi chốn (放在桌子上) với tân ngữ xác định (书) → phải dùng câu 把: 我把书放在桌子上。' },
  { id: 'q2', question: 'Câu nào SAI vì tân ngữ phiếm chỉ ("một quyển sách", chưa xác định)?', options: ['我买了一本书。', '我把一本书买了。', '我把那本书买了。', '我买书了。'], correctIndex: 1, explanation: '把 chỉ dùng với tân ngữ CỤ THỂ/đã biết. "一本书" là phiếm chỉ nên không dùng 把 được — phải nói 我买了一本书。' },
  { id: 'q3', question: 'Vì sao "我把他喜欢" sai?', options: ['把 chỉ dùng với danh từ chỉ vật, không dùng với người', '喜欢 là động từ tâm lý, không có "kết quả xử lý" nên không dùng được với 把', 'Thiếu lượng từ', 'Thiếu 了'], correctIndex: 1, explanation: '把 đòi hỏi động từ hành động có bổ ngữ kết quả; 喜欢 là động từ tâm lý/trạng thái nên không dùng được với 把 — câu đúng là 我喜欢他。' },
]);

// ── Chapter 8 — Review: correcting a paragraph ─────────────────────────────
const c8 = doc('chg401c-8-1-review-errors', '8.1 — Review: correcting a Vietnamese learner\'s essay|||8.1 — Ôn tập: chữa bài viết của người Việt học tiếng Trung',
  'Tổng hợp và chữa một đoạn văn ngắn mắc đủ 7 loại lỗi đã học: trật tự từ, 的/得/地, 了1/了2, 会/能/可以, 又/再/还, lượng từ, câu 把.',
  [[
    `<span class="eyebrow">CHG401c · Chapter 8 · Lesson 8.1 · Review</span>
<h2>Correcting a Vietnamese learner's essay</h2>
<p class="lead">This chapter puts everything together: a short paragraph containing one instance of each error type from Chapters 1–7, followed by the corrected version and a line-by-line explanation.</p>
<h3>Original (with errors)</h3>
<pre><code>①我去昨天北京，我很高兴的。②我买了一个书，我把一本书看了。
③我会说汉语吗？你可以进来吗，我说不能。④他昨天再迟到了，
我还没吃了饭。⑤我地朋友说得很快。</code></pre>
<h3>Corrected version</h3>
<pre><code>①我昨天去了北京，我很高兴。
②我买了一本书，我看了那本书。
③我可以进来吗？你能进来吗，我说可以。
④他昨天又迟到了，我还没吃饭。
⑤我的朋友说得很快。</code></pre>
<h3>Error map</h3>
<pre><code>① 去昨天 → 昨天去    (Ch.1 word order: time before verb)
   高兴的 → 高兴      (的 wrongly used where no adverbial/complement is needed)
② 一个书 → 一本书    (Ch.6 measure word: books take 本)
   把一本书看了 → 看了那本书  (Ch.7: 把 needs a definite object, not "a book")
③ 我会说汉语吗？(confusing 会 for permission) → 我可以进来吗？ (Ch.4: permission = 可以)
   我说不能 → 我说可以           (granting permission = 可以, not 不能)
④ 再迟到 → 又迟到    (Ch.5: already happened = 又, not 再)
   没吃了饭 → 没吃饭   (Ch.3: 没 + verb, drop 了)
⑤ 我地朋友 → 我的朋友 (Ch.2: possessive before noun = 的, not 地)</code></pre>
<div class="callout"><span class="badge">Study tip</span> When you write in Chinese, re-read every sentence and ask three questions: (1) is every adverbial before the verb? (2) is 的/得/地 matched to noun/complement/verb-adverbial correctly? (3) does 了 survive a 没 negation (it shouldn't)? These three checks catch most of the errors in this course.</div>`,
    `<span class="eyebrow">CHG401c · Chương 8 · Bài 8.1 · Ôn tập</span>
<h2>Chữa bài viết của một người Việt học tiếng Trung</h2>
<p class="lead">Chương này gom hết lại: một đoạn văn ngắn mắc đủ mỗi loại lỗi một lần từ Chương 1–7, kèm bản sửa và giải thích từng lỗi.</p>
<h3>Bản gốc (có lỗi)</h3>
<pre><code>①我去昨天北京，我很高兴的。②我买了一个书，我把一本书看了。
③我会说汉语吗？你可以进来吗，我说不能。④他昨天再迟到了，
我还没吃了饭。⑤我地朋友说得很快。</code></pre>
<h3>Bản đã sửa</h3>
<pre><code>①我昨天去了北京，我很高兴。
②我买了一本书，我看了那本书。
③我可以进来吗？你能进来吗，我说可以。
④他昨天又迟到了，我还没吃饭。
⑤我的朋友说得很快。</code></pre>
<h3>Bảng đối chiếu lỗi</h3>
<pre><code>① 去昨天 → 昨天去    (Ch.1 trật tự từ: thời gian trước động từ)
   高兴的 → 高兴      (的 dùng thừa, không có định ngữ/bổ ngữ nào cần nối)
② 一个书 → 一本书    (Ch.6 lượng từ: sách dùng 本)
   把一本书看了 → 看了那本书  (Ch.7: 把 cần tân ngữ xác định, không phải "một quyển sách")
③ 我会说汉语吗？(nhầm 会 cho việc xin phép) → 我可以进来吗？ (Ch.4: xin phép = 可以)
   我说不能 → 我说可以           (cho phép = 可以, không phải 不能)
④ 再迟到 → 又迟到    (Ch.5: việc đã xảy ra rồi = 又, không phải 再)
   没吃了饭 → 没吃饭   (Ch.3: 没 + động từ, bỏ 了)
⑤ 我地朋友 → 我的朋友 (Ch.2: định ngữ sở hữu trước danh từ = 的, không phải 地)</code></pre>
<div class="callout"><span class="badge">Mẹo học</span> Khi viết tiếng Trung, hãy đọc lại từng câu và tự hỏi ba câu: (1) mọi trạng ngữ đã đứng trước động từ chưa? (2) 的/得/地 đã khớp đúng danh từ/bổ ngữ/trạng ngữ trước động từ chưa? (3) 了 có còn sót lại sau khi phủ định bằng 没 không (không được sót)? Ba câu hỏi này bắt được phần lớn lỗi trong môn học này.</div>`,
  ]]);

const c8q = quiz('chg401c-quiz-8', 'Quiz 8 — Ôn tập tổng hợp|||Quiz 8 — Review', [
  { id: 'q1', question: 'Câu "我去昨天北京，我很高兴的" mắc mấy loại lỗi nào?', options: ['Chỉ lỗi lượng từ', 'Lỗi trật tự từ (thời gian sau động từ) và dùng thừa 的', 'Chỉ lỗi 了1/了2', 'Không có lỗi'], correctIndex: 1, explanation: '去昨天 sai trật tự (phải là 昨天去); 高兴的 dùng thừa 的 vì không có định ngữ/bổ ngữ nào cần nối ở đây — câu đúng: 我昨天去了北京，我很高兴。' },
  { id: 'q2', question: '"你可以进来吗，我说不能" sai ở đâu?', options: ['可以 dùng sai chỗ hỏi', '不能 dùng sai khi TRẢ LỜI cho phép — nên dùng 可以', 'Cả câu đều đúng', '吗 thừa'], correctIndex: 1, explanation: 'Khi CHO PHÉP, trả lời bằng 可以 (không phải 不能, vốn diễn tả "không có khả năng/hoàn cảnh không cho"): 我说可以。' },
  { id: 'q3', question: '"我还没吃了饭" cần sửa thế nào?', options: ['Bỏ 还', 'Bỏ 了 sau 吃: 我还没吃饭', 'Đổi 没 thành 不', 'Thêm 了 vào cuối câu'], correctIndex: 1, explanation: 'Phủ định hành động bằng 没 phải bỏ 了: 我还没吃饭 (Wǒ hái méi chīfàn).' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CHG401c',
    slug: 'chg401c-chinese-grammar',
    title: 'Chinese Grammar',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHG401c.webp',
    shortDescription: 'Practical Chinese grammar: word-order fixes, 的/得/地, 了1 vs 了2, 会/能/可以, 又/再/还, measure words & complex attributives, 把-sentences, and correcting common learner mistakes — right/wrong examples in Hanzi + pinyin.|||Ngữ pháp tiếng Trung thực hành: sửa lỗi trật tự từ, phân biệt 的/得/地, 了1 và 了2, 会/能/可以, 又/再/还, lượng từ & định ngữ phức, câu 把 và câu thường — kèm ví dụ đúng/sai (chữ Hán + pinyin).',
    description: 'Môn <strong>CHG401c — Chinese Grammar (bản thực hành)</strong> khác môn CHG401 (ngữ pháp hệ thống theo từ loại): bản này xoáy vào <strong>các điểm ngữ pháp dễ nhầm nhất</strong> của người Việt học tiếng Trung — trật tự từ, 的/得/地, 了1/了2, 会/能/可以, 又/再/还, lượng từ &amp; định ngữ phức, câu 把. Mỗi chương có ví dụ câu <strong>ĐÚNG/SAI</strong> bằng chữ Hán kèm pinyin có dấu thanh và dịch nghĩa, chương cuối chữa một bài viết mẫu mắc đủ các lỗi đã học. Trích dẫn tinh thần 对外汉语教学语法, Common Chinese Grammar Errors, AllSet Chinese Grammar Wiki.',
    whatYouLearn: 'Đặt đúng trạng ngữ thời gian/tần suất/mức độ/nơi chốn trước động từ; phân biệt 的 (danh từ)/地 (trước động từ)/得 (sau động từ); 了1 (hoàn thành) vs 了2 (tình huống mới) và quy tắc phủ định bằng 没; chọn đúng 会/能/可以 theo kỹ năng/khả năng/sự cho phép; phân biệt 又 (đã xảy ra)/再 (chưa xảy ra)/还 (vẫn/còn); dùng đúng lượng từ theo nhóm danh từ và thứ tự định ngữ phức; nhận biết khi nào bắt buộc dùng câu 把 và khi nào không; tự chữa lỗi ngữ pháp trong bài viết của chính mình.',
    requirements: 'Đã học xong ngữ pháp cơ bản/hệ thống (từ loại, thành phần câu — như CHG401) hoặc tương đương HSK2-3. Biết đọc pinyin có dấu thanh.',
  },
  sections: [
    { title: 'Chương 1 — Trật tự từ|||Chapter 1 — Word order', description: 'Trạng ngữ thời gian/mức độ/tần suất/nơi chốn trước động từ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — 的/得/地|||Chapter 2 — 的/得/地', description: 'Định ngữ danh từ, trạng ngữ cách thức, bổ ngữ mức độ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — 了1 và 了2|||Chapter 3 — 了1 vs 了2', description: 'Hoàn thành vs tình huống mới; phủ định bằng 没.', lessons: [c3, c3q] },
    { title: 'Chương 4 — 会/能/可以|||Chapter 4 — 会/能/可以', description: 'Kỹ năng, khả năng, sự cho phép.', lessons: [c4, c4q] },
    { title: 'Chương 5 — 又/再/还|||Chapter 5 — 又/再/还', description: 'Đã xảy ra vs chưa xảy ra vs vẫn/còn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Lượng từ & định ngữ phức|||Chapter 6 — Measure words & attributives', description: 'Lượng từ theo nhóm danh từ, thứ tự định ngữ chồng lớp.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Câu 把 và câu thường|||Chapter 7 — 把-sentences', description: 'Khi nào bắt buộc dùng 把, lỗi hay gặp.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập: chữa bài viết|||Chapter 8 — Review: correcting an essay', description: 'Chữa một đoạn văn mắc đủ các lỗi đã học.', lessons: [c8, c8q] },
  ],
};
