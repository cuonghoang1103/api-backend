/**
 * CRW101 — Chinese Reading & Writing Skills 1. Giáo trình FLM (syl): HSK
 * Standard Course 1-2 (读写) + Chinese Characters: A Genealogy and Dictionary
 * (Harbaugh). Trọng tâm ĐỌC-VIẾT chữ Hán: nét, bộ thủ, cấu tạo chữ, đọc đoạn
 * ngắn, viết câu/đoạn — trình độ HSK1-2. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('crw101-0-1-overview', 'Course overview: Chinese Reading & Writing Skills 1|||Tổng quan: Kỹ năng Đọc - Viết tiếng Trung 1',
  'Môn kỹ năng đọc-viết chữ Hán, trình độ HSK1-2: nét cơ bản, bộ thủ, cấu tạo chữ, đọc đoạn ngắn, viết câu đơn giản.',
  [[
    `<span class="eyebrow">CRW101 · Lesson 0.1 · Overview</span>
<h2>Chinese Reading &amp; Writing Skills 1</h2>
<p class="lead">This course builds your <strong>reading and writing</strong> skills for Chinese characters (汉字 hànzì) at <strong>HSK1-2</strong> level. Unlike a general course that mixes all four skills, CRW101 focuses on the written system: how strokes are drawn, how characters are built from radicals, how to read short passages, and how to write simple sentences.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Chapters 1-3</strong> — the writing system: strokes &amp; stroke order (笔顺), radicals (部首), pictographs &amp; ideographs (象形字/会意字).</li>
<li><strong>Chapters 4-5</strong> — reading short passages and writing simple sentences with 是/有/在.</li>
<li><strong>Chapters 6-8</strong> — phono-semantic characters (形声字) to expand vocabulary fast, reading with fill-in-the-blank, and writing a short self-introduction paragraph.</li>
</ul>
<h3>Why characters, not just pinyin</h3>
<p>Pinyin tells you the <em>sound</em>; the character tells you the <em>meaning</em> and connects to a whole family of related characters through its radical. Learning strokes and radicals first makes every later character easier to remember, read, and write correctly.</p>`,
    `<span class="eyebrow">CRW101 · Bài 0.1 · Tổng quan</span>
<h2>Kỹ năng Đọc - Viết tiếng Trung 1</h2>
<p class="lead">Môn này xây kỹ năng <strong>đọc và viết</strong> chữ Hán (汉字 hànzì) ở trình độ <strong>HSK1-2</strong>. Khác với môn tổng hợp gộp cả bốn kỹ năng, CRW101 tập trung vào hệ thống chữ viết: nét được viết ra sao, chữ được ghép từ bộ thủ thế nào, cách đọc đoạn ngắn, và cách viết câu đơn giản.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Chương 1-3</strong> — hệ thống chữ viết: nét &amp; bút thuận (笔顺), bộ thủ (部首), chữ tượng hình &amp; hội ý (象形字/会意字).</li>
<li><strong>Chương 4-5</strong> — đọc đoạn ngắn và viết câu đơn giản với 是/有/在.</li>
<li><strong>Chương 6-8</strong> — chữ hình thanh (形声字) để mở rộng vốn chữ nhanh, đọc kèm điền từ, và viết đoạn văn giới thiệu bản thân ngắn.</li>
</ul>
<h3>Vì sao học chữ, không chỉ pinyin</h3>
<p>Pinyin cho biết <em>âm đọc</em>; chữ Hán cho biết <em>nghĩa</em> và nối với cả một họ chữ liên quan qua bộ thủ của nó. Học nét và bộ thủ trước giúp mọi chữ sau này dễ nhớ, dễ đọc và viết đúng hơn.</p>`,
  ]]);

const c1 = doc('crw101-1-1-strokes', '1.1 — Basic strokes & stroke order rules (笔顺)|||1.1 — Nét cơ bản & quy tắc bút thuận (笔顺)',
  'Bảy nét cơ bản (横竖撇捺点提钩), sáu quy tắc bút thuận cốt lõi, ví dụ minh hoạ từng quy tắc.',
  [[
    `<span class="eyebrow">CRW101 · Chapter 1 · Lesson 1.1</span>
<h2>Basic strokes &amp; stroke order rules (笔顺)</h2>
<h3>Seven basic strokes</h3>
<pre><code>横 héng   ngang            horizontal   —   (一)
竖 shù    so               vertical     |   (十)
撇 piě    phay             left-falling ノ  (人)
捺 nà     mac               right-falling  (人)
点 dian   cham              dot          ·   (小)
提 ti     hat               rising       /   (打)
钩 gou    moc               hook         J   (小)
</code></pre>
<p>Every character, however complex, is built from these seven strokes combined in a fixed order — get the order right and the character looks correct AND is easier to remember.</p>
<h3>Six core stroke-order rules</h3>
<pre><code>1. Horizontal before vertical   先横后竖   十 (heng then shu)
2. Left-falling before right-falling  先撇后捺  人 (pie then na)
3. Top before bottom            从上到下   三
4. Left before right            从左到右   川
5. Outside before inside        从外到内   月
6. Middle before the two sides  先中间后两边 小
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Chinese input methods, dictionaries by stroke count, and handwriting recognition all rely on a STANDARD stroke order — writing characters out of order is a common beginner mistake that native speakers notice immediately.</div>`,
    `<span class="eyebrow">CRW101 · Chương 1 · Bài 1.1</span>
<h2>Nét cơ bản &amp; quy tắc bút thuận (笔顺)</h2>
<h3>Bảy nét cơ bản</h3>
<pre><code>横 héng   ngang             nét ngang     —   (一)
竖 shù    số                nét sổ        |   (十)
撇 piě    phẩy              nét phẩy      ノ  (人)
捺 nà     mác               nét mác          (人)
点 diǎn   chấm              nét chấm      ·   (小)
提 tí     hất               nét hất       /   (打)
钩 gōu    móc               nét móc       J   (小)
</code></pre>
<p>Mọi chữ Hán, dù phức tạp đến đâu, đều dựng từ bảy nét này ghép theo thứ tự cố định — viết đúng thứ tự thì chữ vừa đúng dáng vừa dễ nhớ hơn.</p>
<h3>Sáu quy tắc bút thuận cốt lõi</h3>
<pre><code>1. Ngang trước, sổ sau        先横后竖   十
2. Phẩy trước, mác sau        先撇后捺   人
3. Trên trước, dưới sau       从上到下   三
4. Trái trước, phải sau       从左到右   川
5. Ngoài trước, trong sau     从外到内   月
6. Giữa trước, hai bên sau    先中间后两边 小
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Bộ gõ tiếng Trung, tra từ điển theo số nét, và nhận dạng chữ viết tay đều dựa vào một bút thuận CHUẨN — viết sai thứ tự là lỗi người mới hay mắc và người bản ngữ nhận ra ngay.</div>`,
  ]]);

const c1q = quiz('crw101-quiz-1', 'Quiz 1 — Strokes & stroke order|||Quiz 1 — Nét & bút thuận', [
  { id: 'q1', question: 'Nét 丿 (phẩy) trong chữ 人 gọi tên pinyin là gì?', options: ['héng', 'piě', 'nà', 'diǎn'], correctIndex: 1, explanation: '撇 đọc là piě, nghĩa là nét phẩy đi xuống bên trái.' },
  { id: 'q2', question: 'Quy tắc bút thuận nào áp dụng khi viết chữ 三?', options: ['Trái trước, phải sau', 'Trên trước, dưới sau', 'Ngoài trước, trong sau', 'Giữa trước, hai bên sau'], correctIndex: 1, explanation: '三 gồm ba nét ngang xếp trên xuống dưới, viết theo quy tắc trên trước dưới sau.' },
  { id: 'q3', question: 'Chữ 人 minh hoạ quy tắc bút thuận nào?', options: ['Ngang trước, sổ sau', 'Phẩy trước, mác sau', 'Trái trước, phải sau', 'Giữa trước, hai bên sau'], correctIndex: 1, explanation: '人 gồm một nét phẩy rồi một nét mác — viết phẩy trước, mác sau.' },
]);

const c2 = doc('crw101-2-1-radicals', '2.1 — Common radicals & character formation (部首)|||2.1 — Bộ thủ thường gặp & cấu tạo chữ Hán (部首)',
  'Tám bộ thủ thường gặp (氵亻女木口日心讠), nghĩa của bộ thủ, ví dụ chữ ghép từ mỗi bộ.',
  [[
    `<span class="eyebrow">CRW101 · Chapter 2 · Lesson 2.1</span>
<h2>Common radicals &amp; character formation (部首)</h2>
<p class="lead">A <strong>radical (部首 bùshǒu)</strong> is a recurring component that usually hints at a character meaning. Learning radicals turns memorizing thousands of characters into recognizing a few hundred building blocks.</p>
<h3>Eight radicals every beginner needs</h3>
<pre><code>氵(水) shui  nuoc/water     -&gt; 河 he (song/river), 海 hai (bien/sea)
亻(人) ren   nguoi/person   -&gt; 你 ni (ban/you), 他 ta (anh ay/he)
女     nu    nu/woman       -&gt; 好 hao (tot/good), 妈 ma (me/mom)
木     mu    moc/wood, tree -&gt; 林 lin (rung/forest), 校 xiao (truong/school)
口     kou   khau/mouth     -&gt; 叫 jiao (goi/call), 名 ming (ten/name)
日     ri    nhat/sun, day  -&gt; 明 ming (sang/bright), 时 shi (gio/time)
忄(心) xin   tam/heart      -&gt; 想 xiang (nghi/think), 忙 mang (ban/busy)
讠(言) yan   ngon/speech    -&gt; 说 shuo (noi/speak), 语 yu (ngon ngu/language)
</code></pre>
<h3>How to read the table</h3>
<p>Each row: the radical shown two ways (compact form used inside a character, then its standalone character in brackets) — pinyin — meaning — two example characters that contain it. Notice <code>氵</code> is the compressed left-side form of <code>水</code> (water); the same happens with <code>忄</code> for <code>心</code> (heart) and <code>讠</code> for <code>言</code> (speech).</p>
<div class="callout"><span class="badge">Study tip</span> When you meet a new character, first spot its radical and guess the meaning category (water-related? person-related? speech-related?) before looking up the exact word — this is exactly how native readers guess unfamiliar characters.</div>`,
    `<span class="eyebrow">CRW101 · Chương 2 · Bài 2.1</span>
<h2>Bộ thủ thường gặp &amp; cấu tạo chữ Hán (部首)</h2>
<p class="lead">Một <strong>bộ thủ (部首 bùshǒu)</strong> là thành phần lặp lại, thường gợi ý về nghĩa của chữ. Học bộ thủ biến việc nhớ hàng nghìn chữ Hán thành việc nhận ra vài trăm khối ghép quen thuộc.</p>
<h3>Tám bộ thủ người mới cần biết</h3>
<pre><code>氵(水) shuǐ  nước           -&gt; 河 hé (sông), 海 hǎi (biển)
亻(人) rén   người          -&gt; 你 nǐ (bạn), 他 tā (anh ấy)
女     nǚ    nữ             -&gt; 好 hǎo (tốt), 妈 mā (mẹ)
木     mù    mộc, cây       -&gt; 林 lín (rừng), 校 xiào (trường)
口     kǒu   khẩu, miệng    -&gt; 叫 jiào (gọi), 名 míng (tên)
日     rì    nhật, mặt trời -&gt; 明 míng (sáng), 时 shí (giờ)
忄(心) xīn   tâm, trái tim  -&gt; 想 xiǎng (nghĩ), 忙 máng (bận)
讠(言) yán   ngôn, lời nói  -&gt; 说 shuō (nói), 语 yǔ (ngôn ngữ)
</code></pre>
<h3>Cách đọc bảng</h3>
<p>Mỗi dòng: bộ thủ viết hai dạng (dạng rút gọn nằm trong chữ, rồi chữ đứng riêng trong ngoặc) — pinyin — nghĩa — hai chữ ví dụ có chứa nó. Để ý <code>氵</code> là dạng rút gọn bên trái của <code>水</code> (nước); tương tự <code>忄</code> của <code>心</code> (tâm) và <code>讠</code> của <code>言</code> (ngôn).</p>
<div class="callout"><span class="badge">Mẹo học</span> Gặp chữ mới, hãy tìm bộ thủ trước và đoán nhóm nghĩa (liên quan nước? liên quan người? liên quan lời nói?) trước khi tra nghĩa chính xác — đây đúng là cách người bản ngữ đoán chữ lạ.</div>`,
  ]]);

const c2q = quiz('crw101-quiz-2', 'Quiz 2 — Radicals & character formation|||Quiz 2 — Bộ thủ & cấu tạo chữ', [
  { id: 'q1', question: 'Bộ thủ 氵trong chữ 河 (sông) là dạng rút gọn của chữ nào?', options: ['木 (mộc)', '水 (thuỷ)', '女 (nữ)', '心 (tâm)'], correctIndex: 1, explanation: '氵 là dạng rút gọn bên trái của 水 (nước), xuất hiện trong các chữ liên quan tới nước.' },
  { id: 'q2', question: 'Bộ thủ 讠(言) mang nghĩa gì và thường xuất hiện trong chữ nào?', options: ['Người - 你', 'Lời nói - 说', 'Cây cối - 林', 'Mặt trời - 明'], correctIndex: 1, explanation: '讠(言) nghĩa là ngôn, lời nói; xuất hiện trong 说 (nói), 语 (ngôn ngữ).' },
  { id: 'q3', question: 'Chữ 忙 (bận) chứa bộ thủ nào?', options: ['忄 (tâm)', '口 (khẩu)', '日 (nhật)', '亻(nhân)'], correctIndex: 0, explanation: '忙 gồm bộ 忄 (tâm, trái tim) ghép với phần 亡, liên quan cảm giác/trạng thái tâm lý.' },
]);

const c3 = doc('crw101-3-1-pictograph-ideograph', '3.1 — Pictographs & ideographs (象形字/会意字)|||3.1 — Chữ tượng hình & hội ý (象形字/会意字)',
  'Chữ tượng hình (vẽ hình vật thật): 日月山水人木火; chữ hội ý (ghép nghĩa hai bộ phận): 休明从林森好.',
  [[
    `<span class="eyebrow">CRW101 · Chapter 3 · Lesson 3.1</span>
<h2>Pictographs &amp; ideographs (象形字/会意字)</h2>
<h3>Pictographs (象形字 xiàngxíngzì) — drawn from real shapes</h3>
<pre><code>日 ri   sun, day     -&gt; original shape: a circle with a dot (the sun)
月 yue  moon, month  -&gt; a crescent shape
山 shan mountain     -&gt; three peaks
水 shui water        -&gt; flowing streams
人 ren  person       -&gt; a walking figure, side view
木 mu   tree, wood    -&gt; trunk with branches and roots
火 huo  fire         -&gt; rising flames
</code></pre>
<h3>Ideographs (会意字 huìyìzì) — meaning + meaning</h3>
<p>These combine two (or more) simple characters so their MEANINGS add up to a new idea:</p>
<pre><code>休 xiu  rest      = 亻(person) + 木(tree)   -&gt; a person leaning on a tree = resting
明 ming bright    = 日(sun) + 月(moon)      -&gt; sun and moon together = brightness
从 cong follow    = 人 + 人                 -&gt; one person following another
林 lin  forest    = 木 + 木                 -&gt; two trees = a small forest
森 sen  dense forest = 木 + 木 + 木          -&gt; three trees = a dense forest
好 hao  good      = 女(woman) + 子(child)   -&gt; woman with child = good
</code></pre>
<div class="callout"><span class="badge">The pattern to remember</span> Pictographs (象形) draw ONE real object. Ideographs (会意) combine the MEANING of two or more existing characters. Both are a small fraction of all characters, but they are the easiest to remember visually — a great foundation before phono-semantic characters in Chapter 6.</div>`,
    `<span class="eyebrow">CRW101 · Chương 3 · Bài 3.1</span>
<h2>Chữ tượng hình &amp; hội ý (象形字/会意字)</h2>
<h3>Chữ tượng hình (象形字 xiàngxíngzì) — vẽ theo hình thật</h3>
<pre><code>日 rì   mặt trời, ngày -&gt; hình gốc: vòng tròn có chấm giữa (mặt trời)
月 yuè  mặt trăng, tháng -&gt; hình lưỡi liềm
山 shān núi            -&gt; ba đỉnh núi
水 shuǐ nước           -&gt; dòng chảy uốn lượn
人 rén  người          -&gt; hình người đang bước, nhìn nghiêng
木 mù   cây, mộc       -&gt; thân cây có cành và rễ
火 huǒ  lửa            -&gt; ngọn lửa bốc lên
</code></pre>
<h3>Chữ hội ý (会意字 huìyìzì) — nghĩa cộng nghĩa</h3>
<p>Loại chữ này ghép hai (hoặc hơn) chữ đơn giản để NGHĨA của chúng cộng lại thành một ý mới:</p>
<pre><code>休 xiū  nghỉ ngơi  = 亻(người) + 木(cây)    -&gt; người tựa vào cây = nghỉ ngơi
明 míng sáng       = 日(mặt trời) + 月(mặt trăng) -&gt; mặt trời và mặt trăng = sáng
从 cóng theo, tòng = 人 + 人                -&gt; một người theo sau người kia
林 lín  rừng nhỏ   = 木 + 木                -&gt; hai cây = rừng nhỏ
森 sēn  rừng rậm   = 木 + 木 + 木           -&gt; ba cây = rừng rậm
好 hǎo  tốt        = 女(nữ) + 子(con)       -&gt; người mẹ bên con = tốt
</code></pre>
<div class="callout"><span class="badge">Quy luật cần nhớ</span> Chữ tượng hình (象形) vẽ MỘT vật thật. Chữ hội ý (会意) ghép NGHĨA của hai hay nhiều chữ có sẵn. Cả hai chỉ chiếm phần nhỏ trong tổng số chữ Hán, nhưng lại dễ nhớ bằng hình ảnh nhất — nền tảng tốt trước khi học chữ hình thanh ở Chương 6.</div>`,
  ]]);

const c3q = quiz('crw101-quiz-3', 'Quiz 3 — Pictographs & ideographs|||Quiz 3 — Tượng hình & hội ý', [
  { id: 'q1', question: 'Chữ 明 (sáng) được ghép từ hai bộ phận nào và thuộc loại chữ gì?', options: ['木+木, chữ hình thanh', '日+月, chữ hội ý', '女+子, chữ tượng hình', '亻+木, chữ hội ý'], correctIndex: 1, explanation: '明 = 日 (mặt trời) + 月 (mặt trăng), nghĩa cộng nghĩa = sáng, thuộc chữ hội ý.' },
  { id: 'q2', question: 'Chữ nào dưới đây là chữ TƯỢNG HÌNH (vẽ theo hình vật thật)?', options: ['休 (nghỉ)', '好 (tốt)', '山 (núi)', '林 (rừng)'], correctIndex: 2, explanation: '山 vẽ trực tiếp hình ba đỉnh núi, là ví dụ điển hình của chữ tượng hình.' },
  { id: 'q3', question: 'Chữ 休 (nghỉ ngơi) mang ý nghĩa nào từ cách ghép bộ phận của nó?', options: ['Người ngồi cạnh nước', 'Người tựa vào cây', 'Người đi giữa núi', 'Người nhìn mặt trời'], correctIndex: 1, explanation: '休 = 亻(người) + 木(cây): hình ảnh người dựa vào cây để nghỉ.' },
]);

const c4 = doc('crw101-4-1-reading-comprehension', '4.1 — Reading short sentences & passages (family & daily life)|||4.1 — Đọc hiểu câu & đoạn ngắn (gia đình, hằng ngày)',
  'Đọc đoạn văn ngắn giới thiệu gia đình, từ vựng theo pinyin, câu hỏi đọc hiểu.',
  [[
    `<span class="eyebrow">CRW101 · Chapter 4 · Lesson 4.1</span>
<h2>Reading short sentences &amp; passages</h2>
<h3>Sample passage — my family</h3>
<pre><code>我叫王明。我是学生。
Wo jiao Wang Ming. Wo shi xuesheng.
(I am called Wang Ming. I am a student.)

我家有四口人：爸爸、妈妈、姐姐和我。
Wo jia you si kou ren: baba, mama, jiejie he wo.
(My family has four people: dad, mom, older sister and me.)

爸爸是老师，妈妈是医生。
Baba shi laoshi, mama shi yisheng.
(Dad is a teacher, mom is a doctor.)

姐姐在大学学习。我们家很幸福。
Jiejie zai daxue xuexi. Women jia hen xingfu.
(Older sister studies at university. Our family is very happy.)
</code></pre>
<h3>Key vocabulary</h3>
<pre><code>家 jia    family, home       口 kou   (measure word for family members)
爸爸 baba dad                妈妈 mama mom
姐姐 jiejie older sister      老师 laoshi teacher
医生 yisheng doctor          大学 daxue university
学习 xuexi to study          幸福 xingfu happy, blessed
</code></pre>
<h3>Comprehension questions</h3>
<ol>
<li>How many people are in Wang Ming family? (Answer: four — 四口人.)</li>
<li>What is dad job? (Answer: teacher — 老师.)</li>
<li>Where does older sister study? (Answer: at university — 在大学.)</li>
</ol>
<div class="callout"><span class="badge">Reading strategy</span> Do not translate word by word on the first pass. Read the whole sentence, spot known characters (family words, verbs 是/有/在), and guess the rest from context — then check details.</div>`,
    `<span class="eyebrow">CRW101 · Chương 4 · Bài 4.1</span>
<h2>Đọc hiểu câu &amp; đoạn ngắn</h2>
<h3>Đoạn văn mẫu — gia đình tôi</h3>
<pre><code>我叫王明。我是学生。
Wǒ jiào Wáng Míng. Wǒ shì xuésheng.
(Tôi tên là Vương Minh. Tôi là học sinh.)

我家有四口人：爸爸、妈妈、姐姐和我。
Wǒ jiā yǒu sì kǒu rén: bàba, māma, jiějie hé wǒ.
(Nhà tôi có bốn người: bố, mẹ, chị gái và tôi.)

爸爸是老师，妈妈是医生。
Bàba shì lǎoshī, māma shì yīshēng.
(Bố là giáo viên, mẹ là bác sĩ.)

姐姐在大学学习。我们家很幸福。
Jiějie zài dàxué xuéxí. Wǒmen jiā hěn xìngfú.
(Chị gái học ở đại học. Gia đình tôi rất hạnh phúc.)
</code></pre>
<h3>Từ vựng chính</h3>
<pre><code>家 jiā    gia đình, nhà        口 kǒu   (lượng từ đếm người trong nhà)
爸爸 bàba bố                   妈妈 māma mẹ
姐姐 jiějie chị gái             老师 lǎoshī giáo viên
医生 yīshēng bác sĩ            大学 dàxué đại học
学习 xuéxí học tập             幸福 xìngfú hạnh phúc
</code></pre>
<h3>Câu hỏi đọc hiểu</h3>
<ol>
<li>Nhà Vương Minh có mấy người? (Đáp án: bốn người — 四口人.)</li>
<li>Nghề nghiệp của bố là gì? (Đáp án: giáo viên — 老师.)</li>
<li>Chị gái học ở đâu? (Đáp án: ở đại học — 在大学.)</li>
</ol>
<div class="callout"><span class="badge">Chiến lược đọc</span> Đừng dịch từng chữ ở lượt đọc đầu. Đọc trọn câu, nhận ra chữ đã biết (từ chỉ gia đình, động từ 是/有/在), đoán phần còn lại theo ngữ cảnh — rồi mới kiểm tra chi tiết.</div>`,
  ]]);

const c4q = quiz('crw101-quiz-4', 'Quiz 4 — Reading comprehension|||Quiz 4 — Đọc hiểu', [
  { id: 'q1', question: 'Theo đoạn văn, nhà Vương Minh có bao nhiêu người?', options: ['Ba người', 'Bốn người', 'Năm người', 'Hai người'], correctIndex: 1, explanation: '"我家有四口人" nghĩa là nhà tôi có bốn người.' },
  { id: 'q2', question: 'Từ 医生 (yīshēng) trong đoạn văn có nghĩa là gì?', options: ['Giáo viên', 'Bác sĩ', 'Học sinh', 'Kỹ sư'], correctIndex: 1, explanation: '医生 yīshēng nghĩa là bác sĩ; mẹ trong đoạn văn làm nghề này.' },
  { id: 'q3', question: 'Bộ thủ 口 trong "四口人" ở đây đóng vai trò gì?', options: ['Bộ thủ chỉ miệng', 'Lượng từ đếm người trong gia đình', 'Động từ', 'Tính từ'], correctIndex: 1, explanation: 'Ở đây 口 dùng làm lượng từ đếm số người trong nhà, không mang nghĩa "miệng".' },
]);

const c5 = doc('crw101-5-1-simple-sentences', '5.1 — Writing simple sentences with 是/有/在|||5.1 — Viết câu đơn giản với 是/有/在',
  'Ba động từ nền tảng: 是 (là), 有 (có), 在 (ở); mẫu câu khẳng định, phủ định, câu hỏi.',
  [[
    `<span class="eyebrow">CRW101 · Chapter 5 · Lesson 5.1</span>
<h2>Writing simple sentences with 是/有/在</h2>
<h3>是 shi — to be (identity, equivalence)</h3>
<pre><code>我是学生。       Wo shi xuesheng.       I am a student.
他不是老师。     Ta bu shi laoshi.      He is not a teacher.
你是学生吗？     Ni shi xuesheng ma?    Are you a student?
</code></pre>
<h3>有 you — to have / there is</h3>
<pre><code>我有一本书。     Wo you yi ben shu.     I have a book.
我没有弟弟。     Wo mei you didi.       I do not have a younger brother.
你有姐姐吗？     Ni you jiejie ma?      Do you have an older sister?
</code></pre>
<h3>在 zai — to be at (location)</h3>
<pre><code>我在学校。       Wo zai xuexiao.        I am at school.
他不在家。       Ta bu zai jia.         He is not at home.
你在哪里？       Ni zai nali?           Where are you?
</code></pre>
<h3>Negation cheat sheet</h3>
<pre><code>是 -&gt; negate with 不是   (NOT 没是)
有 -&gt; negate with 没有   (NOT 不有)
在 -&gt; negate with 不在   (NOT 没在)
</code></pre>
<div class="callout"><span class="badge">Common mistake</span> 有 is the ONLY one of the three negated with 没 instead of 不 — this single exception trips up almost every beginner, write it out until it feels automatic.</div>`,
    `<span class="eyebrow">CRW101 · Chương 5 · Bài 5.1</span>
<h2>Viết câu đơn giản với 是/有/在</h2>
<h3>是 shì — là (đồng nhất, xác định)</h3>
<pre><code>我是学生。       Wǒ shì xuésheng.       Tôi là học sinh.
他不是老师。     Tā bú shì lǎoshī.      Anh ấy không phải là giáo viên.
你是学生吗？     Nǐ shì xuésheng ma?    Bạn có phải là học sinh không?
</code></pre>
<h3>有 yǒu — có (sở hữu / tồn tại)</h3>
<pre><code>我有一本书。     Wǒ yǒu yī běn shū.     Tôi có một quyển sách.
我没有弟弟。     Wǒ méiyǒu dìdi.        Tôi không có em trai.
你有姐姐吗？     Nǐ yǒu jiějie ma?      Bạn có chị gái không?
</code></pre>
<h3>在 zài — ở, tại (vị trí)</h3>
<pre><code>我在学校。       Wǒ zài xuéxiào.        Tôi ở trường.
他不在家。       Tā bú zài jiā.         Anh ấy không ở nhà.
你在哪里？       Nǐ zài nǎlǐ?           Bạn đang ở đâu?
</code></pre>
<h3>Bảng phủ định cần nhớ</h3>
<pre><code>是 -&gt; phủ định bằng 不是   (KHÔNG dùng 没是)
有 -&gt; phủ định bằng 没有   (KHÔNG dùng 不有)
在 -&gt; phủ định bằng 不在   (KHÔNG dùng 没在)
</code></pre>
<div class="callout"><span class="badge">Lỗi thường gặp</span> 有 là động từ DUY NHẤT trong ba từ này phủ định bằng 没 thay vì 不 — đúng ngoại lệ nhỏ này khiến hầu hết người mới nhầm, hãy viết đi viết lại tới khi thành phản xạ.</div>`,
  ]]);

const c5q = quiz('crw101-quiz-5', 'Quiz 5 — Simple sentences 是/有/在|||Quiz 5 — Câu đơn giản 是/有/在', [
  { id: 'q1', question: 'Phủ định đúng của "我有弟弟" (tôi có em trai) là gì?', options: ['我不有弟弟', '我没有弟弟', '我不是弟弟', '我没在弟弟'], correctIndex: 1, explanation: '有 phủ định bằng 没有, không dùng 不有.' },
  { id: 'q2', question: 'Câu "我在学校" dùng động từ 在 để diễn tả điều gì?', options: ['Sở hữu', 'Vị trí, nơi chốn', 'Xác định danh tính', 'Thời gian'], correctIndex: 1, explanation: '在 diễn tả vị trí — tôi đang ở đâu, ở đây là ở trường.' },
  { id: 'q3', question: 'Câu hỏi đúng ngữ pháp để hỏi "bạn có phải là học sinh không?" là câu nào?', options: ['你是学生吗？', '你有学生吗？', '你在学生吗？', '你不学生吗？'], correctIndex: 0, explanation: 'Dùng 是 + 吗 để hỏi về danh tính/xác định: 你是学生吗？' },
]);

const c6 = doc('crw101-6-1-phono-semantic', '6.1 — Phono-semantic characters & vocabulary expansion (形声字)|||6.1 — Chữ hình thanh & mở rộng vốn chữ (形声字)',
  'Chữ hình thanh = bộ nghĩa + bộ âm; nhóm chữ chung âm 马 mǎ (妈吗骂) và chung âm 青 qīng (清情请晴).',
  [[
    `<span class="eyebrow">CRW101 · Chapter 6 · Lesson 6.1</span>
<h2>Phono-semantic characters (形声字)</h2>
<p class="lead">Over 80 percent of all Chinese characters are <strong>phono-semantic (形声字 xíngshēngzì)</strong>: one part hints at the MEANING (the radical), the other part hints at the SOUND (the phonetic). Once you know one phonetic family, you can guess the pronunciation of many new characters.</p>
<h3>Family built on 马 (ma) — sound</h3>
<pre><code>妈 ma   = 女(woman, meaning) + 马(ma, sound)   -&gt; mom
吗 ma   = 口(mouth, meaning) + 马(ma, sound)   -&gt; question particle
骂 ma   = 口口(mouth x2, meaning) + 马(sound)  -&gt; to scold
</code></pre>
<h3>Family built on 青 (qing) — sound</h3>
<pre><code>清 qing = 氵(water, meaning) + 青(qing, sound) -&gt; clear (water)
情 qing = 忄(heart, meaning) + 青(qing, sound) -&gt; feeling, emotion
请 qing = 讠(speech, meaning) + 青(qing, sound) -&gt; please, to invite
晴 qing = 日(sun, meaning) + 青(qing, sound)   -&gt; sunny, clear sky
</code></pre>
<h3>How to use this pattern</h3>
<p>When you meet an unfamiliar character: (1) split it into radical + phonetic, (2) the radical narrows the MEANING category, (3) the phonetic gives a hint at the SOUND (often the same or a close reading). This is not perfect — sound shifts over centuries — but it works often enough to be the single best guessing strategy for HSK1-2 vocabulary.</p>
<div class="callout"><span class="badge">Practice</span> Look at 请/情/清/晴 side by side: same phonetic 青, four different radicals, four related-but-different meanings. This is the fastest way to grow your character count without memorizing each one from scratch.</div>`,
    `<span class="eyebrow">CRW101 · Chương 6 · Bài 6.1</span>
<h2>Chữ hình thanh (形声字)</h2>
<p class="lead">Hơn 80% tổng số chữ Hán là <strong>chữ hình thanh (形声字 xíngshēngzì)</strong>: một phần gợi ý NGHĨA (bộ thủ), phần còn lại gợi ý ÂM ĐỌC (thanh phù). Biết một họ chữ theo âm, bạn có thể đoán cách đọc của nhiều chữ mới.</p>
<h3>Họ chữ theo âm 马 (mǎ)</h3>
<pre><code>妈 mā   = 女(nữ, nghĩa) + 马(mǎ, âm)     -&gt; mẹ
吗 ma   = 口(khẩu, nghĩa) + 马(mǎ, âm)   -&gt; trợ từ nghi vấn
骂 mà   = 口口(khẩu x2, nghĩa) + 马(âm)  -&gt; mắng, chửi
</code></pre>
<h3>Họ chữ theo âm 青 (qīng)</h3>
<pre><code>清 qīng = 氵(thuỷ, nghĩa) + 青(qīng, âm)  -&gt; trong (nước trong)
情 qíng = 忄(tâm, nghĩa) + 青(qīng, âm)   -&gt; tình cảm, cảm xúc
请 qǐng = 讠(ngôn, nghĩa) + 青(qīng, âm)  -&gt; xin mời, làm ơn
晴 qíng = 日(nhật, nghĩa) + 青(qīng, âm)  -&gt; trời quang, nắng đẹp
</code></pre>
<h3>Cách áp dụng quy luật này</h3>
<p>Gặp chữ lạ: (1) tách thành bộ thủ + thanh phù, (2) bộ thủ thu hẹp NHÓM NGHĨA, (3) thanh phù gợi ý ÂM ĐỌC (thường giống hoặc gần với âm gốc). Cách này không hoàn hảo — âm đọc đổi theo thời gian — nhưng đủ hiệu quả để làm chiến lược đoán chữ tốt nhất cho vốn từ HSK1-2.</p>
<div class="callout"><span class="badge">Luyện tập</span> Nhìn 请/情/清/晴 cạnh nhau: cùng thanh phù 青, bốn bộ thủ khác nhau, bốn nghĩa liên quan nhưng khác nhau. Đây là cách nhanh nhất để tăng vốn chữ mà không phải học thuộc từng chữ từ đầu.</div>`,
  ]]);

const c6q = quiz('crw101-quiz-6', 'Quiz 6 — Phono-semantic characters|||Quiz 6 — Chữ hình thanh', [
  { id: 'q1', question: 'Trong chữ 妈 (mẹ), phần nào đóng vai trò gợi ý ÂM ĐỌC?', options: ['女 (nữ)', '马 (mǎ)', 'Cả hai phần', 'Không phần nào'], correctIndex: 1, explanation: '妈 = 女(nghĩa: nữ) + 马(âm: mǎ) — 马 là thanh phù gợi âm đọc mā.' },
  { id: 'q2', question: 'Bốn chữ 请/情/清/晴 có điểm chung nào theo cấu tạo?', options: ['Chung bộ thủ, khác thanh phù', 'Chung thanh phù 青, khác bộ thủ', 'Đều là chữ tượng hình', 'Đều là chữ hội ý'], correctIndex: 1, explanation: 'Cả bốn chữ dùng chung thanh phù 青 (qīng) nhưng khác bộ thủ nên khác nghĩa.' },
  { id: 'q3', question: 'Chữ 晴 (trời quang, nắng) mang bộ thủ nào và vì sao?', options: ['氵vì liên quan nước', '日 vì liên quan mặt trời/ngày', '心 vì liên quan cảm xúc', '口 vì liên quan lời nói'], correctIndex: 1, explanation: '晴 dùng bộ 日 (mặt trời) vì nghĩa liên quan tới thời tiết nắng, trời quang.' },
]);

const c7 = doc('crw101-7-1-cloze-reading', '7.1 — Reading short passages & fill-in-the-blank|||7.1 — Đọc đoạn văn ngắn & điền từ',
  'Đoạn văn về một ngày bình thường, ngân hàng từ để điền vào chỗ trống, đáp án gợi ý.',
  [[
    `<span class="eyebrow">CRW101 · Chapter 7 · Lesson 7.1</span>
<h2>Reading short passages &amp; fill-in-the-blank</h2>
<h3>Passage with blanks — my day</h3>
<pre><code>我每天七点起床。我___学生，我___学校学习。
Wo meitian qi dian qichuang. Wo ___ xuesheng, wo ___ xuexiao xuexi.

中午我___一个小时休息。晚上我在家___书。
Zhongwu wo ___ yi ge xiaoshi xiuxi. Wanshang wo zai jia ___ shu.
</code></pre>
<h3>Word bank</h3>
<pre><code>是 shi   在 zai   有 you   看 kan
</code></pre>
<h3>Suggested answers</h3>
<pre><code>我每天七点起床。我是学生，我在学校学习。
中午我有一个小时休息。晚上我在家看书。

(I get up at 7 every day. I am a student, I study at school.
At noon I have one hour to rest. In the evening I read at home.)
</code></pre>
<div class="callout"><span class="badge">How to solve cloze passages</span> Read the WHOLE sentence first to find the grammatical role of the blank: identity -&gt; 是, location -&gt; 在, possession/duration -&gt; 有, action -&gt; a verb like 看. Filling blanks by grammar role, not guessing, is the reliable method.</div>`,
    `<span class="eyebrow">CRW101 · Chương 7 · Bài 7.1</span>
<h2>Đọc đoạn văn ngắn &amp; điền từ</h2>
<h3>Đoạn văn có chỗ trống — một ngày của tôi</h3>
<pre><code>我每天七点起床。我___学生，我___学校学习。
Wǒ měitiān qī diǎn qǐchuáng. Wǒ ___ xuésheng, wǒ ___ xuéxiào xuéxí.

中午我___一个小时休息。晚上我在家___书。
Zhōngwǔ wǒ ___ yī gè xiǎoshí xiūxi. Wǎnshang wǒ zài jiā ___ shū.
</code></pre>
<h3>Ngân hàng từ</h3>
<pre><code>是 shì   在 zài   有 yǒu   看 kàn
</code></pre>
<h3>Đáp án gợi ý</h3>
<pre><code>我每天七点起床。我是学生，我在学校学习。
中午我有一个小时休息。晚上我在家看书。

(Mỗi ngày tôi dậy lúc 7 giờ. Tôi là học sinh, tôi học ở trường.
Buổi trưa tôi có một tiếng nghỉ ngơi. Buổi tối tôi đọc sách ở nhà.)
</code></pre>
<div class="callout"><span class="badge">Cách giải đoạn điền từ</span> Đọc trọn câu trước để tìm VAI TRÒ NGỮ PHÁP của chỗ trống: xác định danh tính -&gt; 是, vị trí -&gt; 在, sở hữu/khoảng thời gian -&gt; 有, hành động -&gt; động từ như 看. Điền theo vai trò ngữ pháp, không đoán mò, là cách làm chắc chắn.</div>`,
  ]]);

const c7q = quiz('crw101-quiz-7', 'Quiz 7 — Cloze reading|||Quiz 7 — Đọc điền từ', [
  { id: 'q1', question: 'Chỗ trống trong "我___学生" (tôi ___ học sinh) nên điền từ nào?', options: ['在', '有', '是', '看'], correctIndex: 2, explanation: 'Câu xác định danh tính (tôi LÀ học sinh) dùng 是.' },
  { id: 'q2', question: 'Chỗ trống trong "我___学校学习" (tôi ___ trường học tập) nên điền từ nào?', options: ['是', '在', '有', '看'], correctIndex: 1, explanation: 'Câu diễn tả vị trí (ở trường) dùng 在.' },
  { id: 'q3', question: 'Chỗ trống trong "中午我___一个小时休息" nên điền từ nào?', options: ['是', '在', '有', '看'], correctIndex: 2, explanation: 'Diễn tả có một khoảng thời gian (một tiếng) dùng 有.' },
]);

const c8 = doc('crw101-8-1-self-intro-review', '8.1 — Writing a self-introduction paragraph & HSK2 character review|||8.1 — Viết đoạn văn giới thiệu bản thân & ôn tập chữ Hán HSK2',
  'Mẫu câu để viết đoạn giới thiệu bản thân, bảng ôn tập 20 chữ Hán HSK1-2 theo bộ thủ.',
  [[
    `<span class="eyebrow">CRW101 · Chapter 8 · Lesson 8.1</span>
<h2>Writing a self-introduction paragraph</h2>
<h3>Template</h3>
<pre><code>大家好，我叫___。我是___人。我___岁。
Dajia hao, wo jiao ___. Wo shi ___ ren. Wo ___ sui.

我在___学习。我家有___口人。我喜欢___。
Wo zai ___ xuexi. Wo jia you ___ kou ren. Wo xihuan ___.
</code></pre>
<h3>Filled-in example</h3>
<pre><code>大家好，我叫陈红。我是越南人。我十八岁。
Dajia hao, wo jiao Chen Hong. Wo shi Yuenan ren. Wo shiba sui.

我在FPT大学学习。我家有五口人。我喜欢看书和运动。
Wo zai FPT daxue xuexi. Wo jia you wu kou ren. Wo xihuan kanshu he yundong.

(Hello everyone, I am called Chen Hong. I am Vietnamese. I am 18 years old.
I study at FPT University. My family has 5 people. I like reading and sports.)
</code></pre>
<h3>HSK1-2 character review, grouped by radical</h3>
<pre><code>亻(person):  你 ni(you)  他 ta(he)  们 men(plural marker)
女 (woman):  好 hao(good) 妈 ma(mom) 姐 jie(older sister)
氵(water):   河 he(river) 没 mei(not have) 汉 han(Han/Chinese)
木 (tree):   林 lin(forest) 校 xiao(school) 本 ben(measure word: book)
口 (mouth):  叫 jiao(call) 名 ming(name) 吗 ma(question particle)
日 (sun):    明 ming(bright) 是 shi(is, contains 日) 时 shi(time)
心/忄(heart): 想 xiang(think) 忙 mang(busy) 情 qing(feeling)
</code></pre>
<div class="callout"><span class="badge">Course wrap-up</span> You now recognize strokes, radicals, pictographs, ideographs and phono-semantic characters — and can read short passages and write simple paragraphs. This foundation carries directly into CRW102 and HSK2-3 reading.</div>`,
    `<span class="eyebrow">CRW101 · Chương 8 · Bài 8.1</span>
<h2>Viết đoạn văn giới thiệu bản thân</h2>
<h3>Mẫu câu</h3>
<pre><code>大家好，我叫___。我是___人。我___岁。
Dàjiā hǎo, wǒ jiào ___. Wǒ shì ___ rén. Wǒ ___ suì.

我在___学习。我家有___口人。我喜欢___。
Wǒ zài ___ xuéxí. Wǒ jiā yǒu ___ kǒu rén. Wǒ xǐhuan ___.
</code></pre>
<h3>Ví dụ điền sẵn</h3>
<pre><code>大家好，我叫陈红。我是越南人。我十八岁。
Dàjiā hǎo, wǒ jiào Chén Hóng. Wǒ shì Yuènán rén. Wǒ shíbā suì.

我在FPT大学学习。我家有五口人。我喜欢看书和运动。
Wǒ zài FPT dàxué xuéxí. Wǒ jiā yǒu wǔ kǒu rén. Wǒ xǐhuan kànshū hé yùndòng.

(Xin chào mọi người, tôi tên là Trần Hồng. Tôi là người Việt Nam. Tôi mười tám tuổi.
Tôi học ở đại học FPT. Nhà tôi có năm người. Tôi thích đọc sách và thể thao.)
</code></pre>
<h3>Ôn tập chữ Hán HSK1-2 theo bộ thủ</h3>
<pre><code>亻(người):  你 nǐ(bạn)  他 tā(anh ấy)  们 men(hậu tố số nhiều)
女 (nữ):    好 hǎo(tốt) 妈 mā(mẹ)     姐 jiě(chị gái)
氵(thuỷ):   河 hé(sông) 没 méi(không có) 汉 hàn(Hán/tiếng Trung)
木 (mộc):   林 lín(rừng) 校 xiào(trường) 本 běn(lượng từ: quyển sách)
口 (khẩu):  叫 jiào(gọi) 名 míng(tên)  吗 ma(trợ từ nghi vấn)
日 (nhật):  明 míng(sáng) 是 shì(là, chứa bộ 日) 时 shí(giờ)
心/忄(tâm): 想 xiǎng(nghĩ) 忙 máng(bận) 情 qíng(tình cảm)
</code></pre>
<div class="callout"><span class="badge">Tổng kết môn học</span> Bạn nay đã nhận biết được nét, bộ thủ, chữ tượng hình, hội ý và hình thanh — và đọc được đoạn ngắn, viết được đoạn văn đơn giản. Nền tảng này nối thẳng sang CRW102 và đọc hiểu HSK2-3.</div>`,
  ]]);

const c8q = quiz('crw101-quiz-8', 'Quiz 8 — Self-intro & HSK2 review|||Quiz 8 — Giới thiệu bản thân & ôn HSK2', [
  { id: 'q1', question: 'Mẫu câu nào dùng đúng để nói "tôi mười tám tuổi"?', options: ['我十八在。', '我十八岁。', '我十八是。', '我十八有。'], correctIndex: 1, explanation: 'Tuổi tác dùng số + 岁 (suì), không cần động từ 是: 我十八岁。' },
  { id: 'q2', question: 'Chữ 姐 (chị gái) mang bộ thủ nào?', options: ['亻(nhân)', '女 (nữ)', '木 (mộc)', '口 (khẩu)'], correctIndex: 1, explanation: '姐 thuộc bộ 女 (nữ), cùng nhóm với 好, 妈.' },
  { id: 'q3', question: 'Câu "我家有五口人" dùng cấu trúc nào đã học ở Chương 5?', options: ['是 để xác định danh tính', '在 để chỉ vị trí', '有 để diễn tả sở hữu/số lượng', '看 để diễn tả hành động'], correctIndex: 2, explanation: '有 dùng để nói "có bao nhiêu người/vật" — nhà tôi CÓ năm người.' },
]);

const taiLieu = doc('crw101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình HSK Standard Course (FLM), sách tham khảo, tài liệu chính thức miễn phí, YouTube, công cụ tra chữ, lộ trình tự học.',
  [[
    `<span class="eyebrow">CRW101 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Chinese reading &amp; writing at HSK1-2 — strokes, radicals, character formation, reading and writing simple sentences — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for CRW101 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account. Primary textbook referenced: <em>HSK Standard Course 1-2 (读写)</em>.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>HSK Standard Course 1</em> &amp; <em>HSK Standard Course 2</em> (读写, reading &amp; writing volumes) — Beijing Language and Culture University Press</li>
<li><a href="https://www.strokeorder.com/" target="_blank" rel="noopener"><em>Chinese Characters: A Genealogy and Dictionary</em> — Rick Harbaugh, companion site strokeorder.com</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.chinesetest.cn/" target="_blank" rel="noopener">Chinese Test (HSK official site) — syllabus &amp; vocabulary lists</a></li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary — character lookup, stroke order animation</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — HSK1-2 character &amp; grammar lessons</li>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — reading practice at beginner level</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Dictionary</a> — look up characters, radicals, stroke order</li>
<li><a href="https://hanzicraft.com/" target="_blank" rel="noopener">Hanzicraft</a> — character breakdown by radical &amp; component</li>
<li><a href="https://www.digmandarin.com/chinese-radicals-chart.html" target="_blank" rel="noopener">DigMandarin Radicals Chart</a> — full radical reference table</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — seven basic strokes, six stroke-order rules, eight common radicals.</li>
<li><strong>Practice</strong> — trace pictographs &amp; ideographs (Chapter 3), write sentences with 是/有/在 (Chapter 5) daily.</li>
<li><strong>Go deeper</strong> — learn phonetic families (Chapter 6) to expand vocabulary faster than rote memorization.</li>
<li><strong>Job-ready</strong> — read short passages fluently and write a full self-introduction paragraph without a template.</li>
</ol></div>`,
    `<span class="eyebrow">CRW101 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học đọc-viết chữ Hán trình độ HSK1-2 — nét, bộ thủ, cấu tạo chữ, đọc và viết câu đơn giản — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CRW101 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU. Giáo trình chính được trích dẫn: <em>HSK Standard Course 1-2 (读写)</em>.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>HSK Standard Course 1</em> &amp; <em>HSK Standard Course 2</em> (tập đọc-viết 读写) — NXB Đại học Ngôn ngữ Văn hoá Bắc Kinh</li>
<li><a href="https://www.strokeorder.com/" target="_blank" rel="noopener"><em>Chinese Characters: A Genealogy and Dictionary</em> — Rick Harbaugh, trang đồng hành strokeorder.com</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.chinesetest.cn/" target="_blank" rel="noopener">Chinese Test (trang chính thức HSK) — khung chương trình &amp; danh sách từ vựng</a></li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">Từ điển MDBG — tra chữ, hoạt hình bút thuận</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — bài giảng chữ &amp; ngữ pháp HSK1-2</li>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — luyện đọc trình độ mới bắt đầu</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">Từ điển MDBG</a> — tra chữ, bộ thủ, bút thuận</li>
<li><a href="https://hanzicraft.com/" target="_blank" rel="noopener">Hanzicraft</a> — phân tích chữ theo bộ thủ &amp; thành phần</li>
<li><a href="https://www.digmandarin.com/chinese-radicals-chart.html" target="_blank" rel="noopener">Bảng bộ thủ DigMandarin</a> — bảng tra bộ thủ đầy đủ</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — bảy nét cơ bản, sáu quy tắc bút thuận, tám bộ thủ thường gặp.</li>
<li><strong>Luyện tập</strong> — tập viết chữ tượng hình &amp; hội ý (Chương 3), viết câu với 是/有/在 (Chương 5) mỗi ngày.</li>
<li><strong>Đào sâu</strong> — học các họ chữ hình thanh (Chương 6) để mở rộng vốn chữ nhanh hơn học vẹt.</li>
<li><strong>Sẵn sàng đi tiếp</strong> — đọc trôi chảy đoạn ngắn và viết được đoạn giới thiệu bản thân hoàn chỉnh không cần mẫu.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'CRW101',
    slug: 'crw101-chinese-reading-writing-skills-1',
    title: 'Chinese Reading & Writing Skills 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CRW101.webp',
    shortDescription: 'Chinese character reading & writing at HSK1-2 — strokes & stroke order, radicals, pictographs & ideographs, reading short passages, writing simple sentences (是/有/在), phono-semantic characters, cloze reading, and a self-introduction paragraph.|||Đọc-viết chữ Hán trình độ HSK1-2 — nét & bút thuận, bộ thủ, chữ tượng hình & hội ý, đọc đoạn ngắn, viết câu đơn giản (是/有/在), chữ hình thanh, đọc điền từ, và đoạn văn giới thiệu bản thân.',
    description: 'Môn <strong>CRW101 — Chinese Reading &amp; Writing Skills 1</strong> (kỳ 1, ngành Ngôn ngữ Trung) rèn kỹ năng <strong>đọc và viết chữ Hán</strong> ở trình độ HSK1-2. Từ <strong>nét cơ bản &amp; bút thuận</strong> (笔顺) → <strong>bộ thủ</strong> (部首) → <strong>chữ tượng hình &amp; hội ý</strong> (象形字/会意字) → <strong>đọc đoạn ngắn</strong> (gia đình, hằng ngày) → <strong>viết câu đơn giản</strong> (是/有/在) → <strong>chữ hình thanh</strong> (形声字) mở rộng vốn chữ → <strong>đọc điền từ</strong> → <strong>viết đoạn văn giới thiệu bản thân</strong> &amp; ôn tập chữ Hán HSK2. Bám giáo trình HSK Standard Course 1-2 (读写), song ngữ, có bảng chữ, ví dụ đọc-viết và quiz mỗi chương.',
    whatYouLearn: 'Bảy nét cơ bản & sáu quy tắc bút thuận; tám bộ thủ thường gặp & cách chúng gợi ý nghĩa; chữ tượng hình (日月山水人木火) & chữ hội ý (休明从林森好); đọc hiểu đoạn văn ngắn chủ đề gia đình/hằng ngày; viết câu với 是/有/在 và phủ định đúng; chữ hình thanh (形声字) qua các họ âm 马/青 để mở rộng vốn chữ nhanh; đọc điền từ (cloze); viết đoạn văn giới thiệu bản thân hoàn chỉnh; ôn tập 20+ chữ Hán HSK1-2 theo bộ thủ.',
    requirements: 'Không yêu cầu biết chữ Hán trước. Nên làm quen bảng pinyin & thanh điệu cơ bản (có thể học song song ở môn nghe-nói CLS101).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình HSK Standard Course trên FLM, sách, tài liệu chính thức, YouTube, công cụ tra chữ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Kỹ năng đọc-viết chữ Hán, trình độ HSK1-2, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Nét cơ bản & bút thuận|||Chapter 1 — Basic strokes & stroke order', description: 'Bảy nét cơ bản, sáu quy tắc bút thuận.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Bộ thủ & cấu tạo chữ|||Chapter 2 — Radicals & character formation', description: 'Tám bộ thủ thường gặp, ví dụ chữ ghép.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tượng hình & hội ý|||Chapter 3 — Pictographs & ideographs', description: 'Chữ vẽ hình thật & chữ ghép nghĩa.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đọc hiểu câu & đoạn ngắn|||Chapter 4 — Reading short passages', description: 'Đoạn văn gia đình, từ vựng, câu hỏi đọc hiểu.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Viết câu đơn giản 是/有/在|||Chapter 5 — Writing simple sentences', description: 'Ba động từ nền tảng, khẳng định, phủ định, câu hỏi.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chữ hình thanh & mở rộng vốn chữ|||Chapter 6 — Phono-semantic characters', description: 'Nghĩa + âm, họ chữ 马 và 青.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đọc đoạn văn & điền từ|||Chapter 7 — Reading & fill-in-the-blank', description: 'Đoạn văn có chỗ trống, ngân hàng từ, đáp án.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Viết đoạn giới thiệu & ôn HSK2|||Chapter 8 — Self-intro & HSK2 review', description: 'Mẫu câu giới thiệu bản thân, ôn 20+ chữ Hán.', lessons: [c8, c8q] },
  ],
};
