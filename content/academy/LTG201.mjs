/**
 * LTG201 — Introduction to Linguistics (Nhập môn Ngôn ngữ học). Ngành Ngôn
 * ngữ Trung, FPTU, Kỳ 3. Giáo trình trích dẫn (KHÔNG upload PDF): "An
 * Introduction to Language" (Fromkin, Rodman & Hyams), "Contemporary
 * Linguistics" (O Grady), 《语言学纲要》(叶蜚声). 8 chương ngôn ngữ học đại
 * cương, giảng tiếng Việt + thuật ngữ Anh, ví dụ đa ngôn ngữ có liên hệ
 * tiếng Trung/Việt/Anh. Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('ltg201-0-1-overview', 'Course overview: Introduction to Linguistics|||Tổng quan: Nhập môn Ngôn ngữ học',
  'Ngôn ngữ học là gì, các phân ngành, vì sao quan trọng cho sinh viên ngành Ngôn ngữ Trung.',
  [[
    `<span class="eyebrow">LTG201 · Lesson 0.1 · Overview</span>
<h2>Introduction to Linguistics</h2>
<p class="lead">This course is the scientific study of <strong>human language</strong> — not how to speak a particular language, but how language itself works as a system, and how it varies across languages including Chinese, Vietnamese and English. You will learn the core sub-fields: sounds (<strong>phonetics/phonology</strong>), word structure (<strong>morphology</strong>), sentence structure (<strong>syntax</strong>), meaning (<strong>semantics/pragmatics</strong>), language in society (<strong>sociolinguistics</strong>), language change and typology, and how language is acquired.</p>
<h3>Why it matters for a Chinese-language major</h3>
<p>Chinese (Mandarin) and Vietnamese are typologically very different from English — both are largely <strong>isolating/analytic</strong> languages with little inflection, tones carrying meaning, and topic-prominent sentence structure. Linguistics gives you the vocabulary to describe precisely <em>why</em> Chinese "feels" different from English, and why some structures transfer easily between Chinese and Vietnamese but not into English.</p>
<h3>Roadmap</h3>
<p>Nature &amp; functions of language → phonetics &amp; phonology → morphology → syntax → semantics &amp; pragmatics → sociolinguistics → language change, families &amp; typology → acquisition, language &amp; thought.</p>`,
    `<span class="eyebrow">LTG201 · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn Ngôn ngữ học</h2>
<p class="lead">Môn này nghiên cứu khoa học về <strong>ngôn ngữ loài người</strong> — không phải học nói một thứ tiếng cụ thể, mà tìm hiểu ngôn ngữ vận hành như một hệ thống thế nào, và khác nhau ra sao giữa các ngôn ngữ, trong đó có tiếng Trung, tiếng Việt và tiếng Anh. Bạn sẽ học các phân ngành cốt lõi: âm thanh (<strong>ngữ âm học/âm vị học</strong>), cấu tạo từ (<strong>hình thái học</strong>), cấu trúc câu (<strong>cú pháp học</strong>), nghĩa (<strong>ngữ nghĩa học/ngữ dụng học</strong>), ngôn ngữ trong xã hội (<strong>xã hội ngôn ngữ học</strong>), biến đổi ngôn ngữ &amp; loại hình, và cách ngôn ngữ được thụ đắc.</p>
<h3>Vì sao quan trọng với sinh viên ngành Ngôn ngữ Trung</h3>
<p>Tiếng Trung (Mandarin/普通话) và tiếng Việt khác tiếng Anh về mặt loại hình rất nhiều — cả hai đều là ngôn ngữ <strong>đơn lập/phân tích tính (isolating/analytic)</strong>, gần như không biến hình từ, có thanh điệu (tone) mang nghĩa, và cấu trúc câu thiên về chủ đề (topic-prominent). Ngôn ngữ học cho bạn từ vựng để mô tả chính xác <em>vì sao</em> tiếng Trung "cảm giác" khác tiếng Anh, và vì sao một số cấu trúc chuyển dễ dàng giữa tiếng Trung và tiếng Việt nhưng không chuyển được sang tiếng Anh.</p>
<h3>Lộ trình</h3>
<p>Bản chất &amp; chức năng ngôn ngữ → ngữ âm &amp; âm vị học → hình thái học → cú pháp học → ngữ nghĩa &amp; ngữ dụng học → xã hội ngôn ngữ học → biến đổi ngôn ngữ, ngữ hệ &amp; loại hình → thụ đắc ngôn ngữ, ngôn ngữ &amp; tư duy.</p>`,
  ]]);

const c1 = doc('ltg201-1-1-nature-function', '1.1 — What is language? Nature & functions|||1.1 — Ngôn ngữ là gì? Bản chất & chức năng',
  'Đặc trưng thiết kế ngôn ngữ (Hockett): võ đoán, hai tầng, sản sinh, dời chuyển, truyền thụ văn hoá; chức năng ngôn ngữ.',
  [[
    `<span class="eyebrow">LTG201 · Chapter 1 · Lesson 1.1</span>
<h2>What is language? Nature &amp; functions</h2>
<h3>Design features (Hockett)</h3>
<ul>
<li><strong>Arbitrariness</strong> — the link between a sound (signifier) and its meaning (signified) is a social convention, not a natural resemblance. The same referent gets unrelated sound shapes: English <em>dog</em>, Vietnamese <em>chó</em>, Chinese 狗 <em>gǒu</em> — three unrelated sound sequences, one concept.</li>
<li><strong>Duality of patterning</strong> — language has two layers: a small set of meaningless sounds (phonemes) combine into a huge set of meaningful units (morphemes/words). /k/ /æ/ /t/ mean nothing alone; <em>cat</em> means something.</li>
<li><strong>Productivity (creativity)</strong> — speakers produce and understand sentences they have never heard before, by combining a finite set of rules and units.</li>
<li><strong>Displacement</strong> — language can refer to things not present in time or space (the past, the future, imaginary things) — unlike most animal alarm calls, tied to the here-and-now.</li>
<li><strong>Cultural transmission</strong> — a language is learned from a surrounding community, not fixed by biology; a Chinese baby raised in an English-speaking home grows up speaking English.</li>
</ul>
<h3>Functions of language</h3>
<ul>
<li><strong>Referential</strong> — conveying information ("It is raining").</li>
<li><strong>Expressive</strong> — showing the speaker's feelings ("Wow!").</li>
<li><strong>Directive</strong> — getting someone to do something (requests, commands).</li>
<li><strong>Phatic</strong> — maintaining social contact rather than exchanging information (small talk: "How are you?" / Chinese 你吃了吗? <em>nǐ chī le ma</em>, literally "Have you eaten?", used as a greeting, not a real question about food).</li>
</ul>
<pre><code>Sign = Signifier (sound/form) + Signified (concept)
 EN: /dɒg/         ---
 VI: chó           }--- same concept, arbitrary forms
 ZH: 狗 gǒu         ---
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Language is a system of arbitrary, dual-patterned signs that lets humans talk about anything, anywhere, anytime — and every human language, however different it looks, shares these design features.</div>`,
    `<span class="eyebrow">LTG201 · Chương 1 · Bài 1.1</span>
<h2>Ngôn ngữ là gì? Bản chất &amp; chức năng</h2>
<h3>Đặc trưng thiết kế (Hockett)</h3>
<ul>
<li><strong>Tính võ đoán (arbitrariness)</strong> — mối liên hệ giữa âm thanh (cái biểu đạt) và nghĩa (cái được biểu đạt) là quy ước xã hội, không phải sự giống nhau tự nhiên. Cùng một sự vật mang những hình thức âm thanh không liên quan: tiếng Anh <em>dog</em>, tiếng Việt <em>chó</em>, tiếng Trung 狗 <em>gǒu</em> — ba chuỗi âm không liên quan, một khái niệm.</li>
<li><strong>Tính hai tầng (duality of patterning)</strong> — ngôn ngữ có hai lớp: một tập nhỏ âm vô nghĩa (âm vị/phoneme) kết hợp thành một tập khổng lồ đơn vị có nghĩa (hình vị/từ). /k/ /æ/ /t/ đứng riêng vô nghĩa; <em>cat</em> thì có nghĩa.</li>
<li><strong>Tính sản sinh (productivity)</strong> — người nói tạo ra và hiểu được những câu chưa từng nghe, bằng cách kết hợp một tập hữu hạn quy tắc và đơn vị.</li>
<li><strong>Tính dời chuyển (displacement)</strong> — ngôn ngữ có thể nói về thứ không hiện diện ở đây và bây giờ (quá khứ, tương lai, điều tưởng tượng) — khác với hầu hết tiếng kêu báo động của động vật, chỉ gắn với "ở đây, ngay lúc này".</li>
<li><strong>Tính truyền thụ văn hoá (cultural transmission)</strong> — một ngôn ngữ được học từ cộng đồng xung quanh, không do sinh học quyết định; một em bé gốc Hoa lớn lên trong gia đình nói tiếng Anh sẽ nói tiếng Anh.</li>
</ul>
<h3>Chức năng của ngôn ngữ</h3>
<ul>
<li><strong>Chức năng quy chiếu (referential)</strong> — truyền tải thông tin ("Trời đang mưa").</li>
<li><strong>Chức năng biểu cảm (expressive)</strong> — bộc lộ cảm xúc người nói ("Ôi!").</li>
<li><strong>Chức năng cầu khiến (directive)</strong> — khiến ai đó làm gì (yêu cầu, mệnh lệnh).</li>
<li><strong>Chức năng giao tiếp xã giao (phatic)</strong> — duy trì quan hệ xã hội hơn là trao đổi thông tin (chào hỏi xã giao: "Dạo này thế nào?" / tiếng Trung 你吃了吗? <em>nǐ chī le ma</em>, nghĩa đen "Ăn cơm chưa?", dùng như lời chào chứ không thật sự hỏi về việc ăn).</li>
</ul>
<pre><code>Ký hiệu = Cái biểu đạt (âm/hình thức) + Cái được biểu đạt (khái niệm)
 EN: /dɒg/          ---
 VI: chó            }--- cùng khái niệm, hình thức võ đoán
 ZH: 狗 gǒu          ---
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Ngôn ngữ là hệ thống ký hiệu võ đoán, hai tầng, cho phép con người nói về bất cứ điều gì, ở đâu, lúc nào — và mọi ngôn ngữ loài người, dù khác nhau đến đâu, đều chia sẻ những đặc trưng thiết kế này.</div>`,
  ]]);

const c1q = quiz('ltg201-quiz-1', 'Quiz 1 — Nature & functions of language|||Quiz 1 — Bản chất & chức năng ngôn ngữ', [
  { id: 'q1', question: 'Mối liên hệ giữa âm thanh và nghĩa trong ngôn ngữ loài người mang tính gì?', options: ['Tất yếu tự nhiên', 'Võ đoán (arbitrary)', 'Tượng thanh hoàn toàn', 'Do ngữ pháp quy định'], correctIndex: 1, explanation: 'Quan hệ tín hiệu-nghĩa là quy ước xã hội (arbitrariness), trừ một số ít từ tượng thanh.' },
  { id: 'q2', question: 'Đặc trưng nào cho phép người nói tạo câu chưa từng nghe trước đó?', options: ['Tính dời chuyển', 'Tính truyền thụ văn hoá', 'Tính sản sinh (productivity)', 'Tính hai tầng'], correctIndex: 2, explanation: 'Productivity: kết hợp hữu hạn quy tắc/đơn vị để tạo câu mới vô hạn.' },
  { id: 'q3', question: 'Câu tiếng Trung 你吃了吗? (nǐ chī le ma) khi dùng như lời chào thể hiện chức năng nào?', options: ['Chức năng quy chiếu', 'Chức năng cầu khiến', 'Chức năng giao tiếp xã giao (phatic)', 'Chức năng biểu cảm'], correctIndex: 2, explanation: 'Dùng để duy trì quan hệ xã hội, không thật sự hỏi thông tin về việc ăn uống.' },
]);

const c2 = doc('ltg201-2-1-phonetics-phonology', '2.1 — Phonetics & phonology|||2.1 — Ngữ âm học & âm vị học',
  'IPA, đặc điểm ngữ âm; âm vị vs biến thể; thanh điệu tiếng Trung & Việt, cặp tối thiểu.',
  [[
    `<span class="eyebrow">LTG201 · Chapter 2 · Lesson 2.1</span>
<h2>Phonetics &amp; phonology</h2>
<h3>Phonetics — the physical sounds</h3>
<p><strong>Phonetics</strong> studies the physical production and properties of speech sounds. Consonants are classified by <strong>place of articulation</strong> (bilabial, alveolar, velar…) and <strong>manner of articulation</strong> (stop, fricative, nasal…); vowels by tongue height/backness and lip rounding. The <strong>IPA</strong> (International Phonetic Alphabet) gives one symbol per sound, independent of spelling.</p>
<h3>Tone — a phonetic feature that carries meaning</h3>
<p>In <strong>Mandarin Chinese</strong>, pitch (tone) is not just intonation — it changes the meaning of a word. The classic example, all built on the syllable <em>ma</em>:</p>
<pre><code>妈 mā  (tone 1, level)     "mother"
麻 má  (tone 2, rising)    "hemp"
马 mǎ  (tone 3, dip-rise)  "horse"
骂 mà  (tone 4, falling)   "to scold"
吗 ma  (neutral tone)      question particle
</code></pre>
<p><strong>Vietnamese</strong> also has lexical tone — six tones (ngang, huyền, sắc, hỏi, ngã, nặng), e.g. <em>ma</em> (ghost), <em>má</em> (mother/cheek), <em>mà</em> (but), <em>mả</em> (grave), <em>mã</em> (code, Sino-Vietnamese), <em>mạ</em> (rice seedling) — six different words from the same consonant+vowel, distinguished only by tone. <strong>English</strong> has no lexical tone; pitch there only signals intonation (question vs statement), not word identity.</p>
<h3>Phonology — the sound system</h3>
<p><strong>Phonology</strong> studies how sounds function as a system in a given language: which sounds are contrastive (<strong>phonemes</strong>, changing meaning) vs which are just automatic variants of the same phoneme (<strong>allophones</strong>, never changing meaning). A <strong>minimal pair</strong> — two words differing by exactly one sound, e.g. English <em>pin</em>/<em>bin</em> — proves /p/ and /b/ are separate phonemes in English. In Mandarin, <em>bā</em> 八 "eight" vs <em>pā</em> 趴 "to lie prone" is a minimal pair for aspiration, which is contrastive in Chinese but only allophonic in English (the /p/ in <em>spin</em> is unaspirated, in <em>pin</em> aspirated — same phoneme, no meaning change).</p>
<div class="callout"><span class="badge">Cross-language contrast</span> Chinese and Vietnamese both use <strong>tone</strong> phonemically; English does not. Chinese and English both use <strong>aspiration</strong> contrastively for some consonants, in different ways from each other and from Vietnamese.</div>`,
    `<span class="eyebrow">LTG201 · Chương 2 · Bài 2.1</span>
<h2>Ngữ âm học &amp; âm vị học</h2>
<h3>Ngữ âm học — âm thanh vật lý</h3>
<p><strong>Ngữ âm học (phonetics)</strong> nghiên cứu cách tạo ra và đặc tính vật lý của âm lời nói. Phụ âm phân loại theo <strong>vị trí cấu âm</strong> (môi-môi, lợi, ngạc mềm…) và <strong>phương thức cấu âm</strong> (âm tắc, âm xát, âm mũi…); nguyên âm theo độ nâng/lùi của lưỡi và độ tròn môi. <strong>IPA</strong> (bảng phiên âm quốc tế) cho mỗi âm một ký hiệu riêng, độc lập với chữ viết.</p>
<h3>Thanh điệu — đặc điểm ngữ âm mang nghĩa</h3>
<p>Trong <strong>tiếng Quan Thoại (Mandarin)</strong>, cao độ (thanh điệu) không chỉ là ngữ điệu — nó đổi nghĩa của từ. Ví dụ kinh điển, cùng âm tiết <em>ma</em>:</p>
<pre><code>妈 mā  (thanh 1, bằng)        "mẹ"
麻 má  (thanh 2, lên)         "cây gai"
马 mǎ  (thanh 3, xuống-lên)   "ngựa"
骂 mà  (thanh 4, xuống)       "mắng"
吗 ma  (thanh nhẹ)            trợ từ nghi vấn
</code></pre>
<p><strong>Tiếng Việt</strong> cũng có thanh điệu từ vựng — sáu thanh (ngang, huyền, sắc, hỏi, ngã, nặng), vd <em>ma</em> (con ma), <em>má</em> (mẹ/gò má), <em>mà</em> (liên từ), <em>mả</em> (mộ), <em>mã</em> (mã số, Hán-Việt), <em>mạ</em> (cây lúa non) — sáu từ khác nhau chỉ từ cùng một tổ hợp phụ âm+nguyên âm, phân biệt bằng thanh điệu. <strong>Tiếng Anh</strong> không có thanh điệu từ vựng; cao độ ở đó chỉ báo hiệu ngữ điệu (câu hỏi vs câu kể), không đổi nhận diện từ.</p>
<h3>Âm vị học — hệ thống âm</h3>
<p><strong>Âm vị học (phonology)</strong> nghiên cứu cách âm hoạt động như một hệ thống trong một ngôn ngữ cụ thể: âm nào có tính đối lập (<strong>âm vị/phoneme</strong>, đổi nghĩa) và âm nào chỉ là biến thể tự động của cùng một âm vị (<strong>biến thể/allophone</strong>, không bao giờ đổi nghĩa). Một <strong>cặp tối thiểu (minimal pair)</strong> — hai từ khác nhau đúng một âm, vd tiếng Anh <em>pin</em>/<em>bin</em> — chứng minh /p/ và /b/ là hai âm vị riêng trong tiếng Anh. Trong tiếng Quan Thoại, <em>bā</em> 八 "tám" vs <em>pā</em> 趴 "nằm sấp" là cặp tối thiểu về bật hơi, đối lập trong tiếng Trung nhưng chỉ là biến thể trong tiếng Anh (/p/ trong <em>spin</em> không bật hơi, trong <em>pin</em> bật hơi — cùng một âm vị, không đổi nghĩa).</p>
<div class="callout"><span class="badge">Đối chiếu liên ngôn ngữ</span> Tiếng Trung và tiếng Việt đều dùng <strong>thanh điệu</strong> ở cấp âm vị; tiếng Anh thì không. Tiếng Trung và tiếng Anh đều dùng <strong>bật hơi</strong> mang tính đối lập với một số phụ âm, nhưng theo cách khác nhau và khác cả tiếng Việt.</div>`,
  ]]);

const c2q = quiz('ltg201-quiz-2', 'Quiz 2 — Phonetics & phonology|||Quiz 2 — Ngữ âm & âm vị học', [
  { id: 'q1', question: 'Trong tiếng Quan Thoại, âm tiết ma với 4 thanh điệu khác nhau (mā, má, mǎ, mà) cho kết quả gì?', options: ['Vẫn là một từ duy nhất', 'Bốn từ khác nghĩa hoàn toàn', 'Chỉ khác ngữ điệu câu, không đổi nghĩa', 'Không tồn tại trong tiếng Trung'], correctIndex: 1, explanation: 'Thanh điệu ở cấp âm vị: đổi thanh là đổi từ, không chỉ đổi ngữ điệu.' },
  { id: 'q2', question: 'Hai từ khác nhau đúng một âm, dùng để chứng minh hai âm đó là hai âm vị phân biệt, gọi là gì?', options: ['Biến thể (allophone)', 'Cặp tối thiểu (minimal pair)', 'Nguyên âm đôi', 'Phụ âm tắc'], correctIndex: 1, explanation: 'Minimal pair, vd pin/bin, chứng minh /p/ và /b/ là hai âm vị.' },
  { id: 'q3', question: 'Điểm khác biệt lớn giữa tiếng Anh và tiếng Trung/Việt về ngữ âm là gì?', options: ['Tiếng Anh không có phụ âm', 'Tiếng Trung/Việt dùng thanh điệu để phân biệt nghĩa từ, tiếng Anh thì không', 'Tiếng Anh không có nguyên âm', 'Tiếng Trung không có phụ âm tắc'], correctIndex: 1, explanation: 'Tone là âm vị trong tiếng Trung/Việt, chỉ là ngữ điệu trong tiếng Anh.' },
]);

const c3 = doc('ltg201-3-1-morphology', '3.1 — Morphology|||3.1 — Hình thái học',
  'Hình vị tự do/ràng buộc, biến hình vs phái sinh; tiếng Trung/Việt đơn lập; ghép từ.',
  [[
    `<span class="eyebrow">LTG201 · Chapter 3 · Lesson 3.1</span>
<h2>Morphology — word structure</h2>
<h3>Morphemes</h3>
<p>A <strong>morpheme</strong> is the smallest unit that carries meaning or grammatical function. <em>Cats</em> = <em>cat</em> (free morpheme, can stand alone) + <em>-s</em> (bound morpheme, plural). <strong>Inflection</strong> changes grammatical properties without creating a new word (<em>walk → walked</em>, tense); <strong>derivation</strong> creates a new word, often a new part of speech (<em>happy → happiness</em>, adjective → noun).</p>
<h3>Chinese &amp; Vietnamese: isolating/analytic languages</h3>
<p>Chinese and Vietnamese have almost <strong>no inflectional morphology</strong>: verbs do not change for tense/person/number, nouns do not change for number/case. Grammatical meaning is carried by separate words and word order instead, e.g. the Chinese aspect particle <strong>了</strong> le marks completion (我吃了 <em>wǒ chī le</em>, "I ate/have eaten") rather than an ending like English <em>-ed</em>. Vietnamese works the same way: <em>tôi đã ăn</em> uses the separate word <em>đã</em> (past marker), not a suffix.</p>
<h3>Compounding is highly productive</h3>
<p>Where English often borrows Greco-Latin roots for new concepts, Chinese typically <strong>compounds native morphemes</strong> transparently: 电 <em>diàn</em> "electric" + 脑 <em>nǎo</em> "brain" = 电脑 <em>diànnǎo</em> "computer" ("electric brain"); 火 <em>huǒ</em> "fire" + 车 <em>chē</em> "vehicle" = 火车 <em>huǒchē</em> "train". Vietnamese, having absorbed a large layer of Sino-Vietnamese vocabulary, mirrors this: <em>hoả xa</em> (fire-vehicle, formal for train) alongside the native compound <em>xe lửa</em> (vehicle-fire).</p>
<pre><code>EN (concatenative, inflection): walk + -ed -> walked
ZH (isolating, particle):        我  吃  了     -> "I ate"
                                  wǒ  chī  le
VI (isolating, separate word):   tôi đã  ăn    -> "I ate"
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Because Chinese and Vietnamese are both isolating, many structures map onto each other word-for-word — but neither maps onto English inflection, the single biggest source of grammar mistakes for Chinese/Vietnamese speakers learning English tense marking.</div>`,
    `<span class="eyebrow">LTG201 · Chương 3 · Bài 3.1</span>
<h2>Hình thái học — cấu tạo từ</h2>
<h3>Hình vị (morpheme)</h3>
<p>Một <strong>hình vị</strong> là đơn vị nhỏ nhất mang nghĩa hoặc chức năng ngữ pháp. <em>Cats</em> = <em>cat</em> (hình vị tự do, đứng độc lập được) + <em>-s</em> (hình vị ràng buộc, số nhiều). <strong>Biến hình (inflection)</strong> đổi thuộc tính ngữ pháp mà không tạo từ mới (<em>walk → walked</em>, thì); <strong>phái sinh (derivation)</strong> tạo từ mới, thường đổi từ loại (<em>happy → happiness</em>, tính từ → danh từ).</p>
<h3>Tiếng Trung &amp; tiếng Việt: ngôn ngữ đơn lập/phân tích tính</h3>
<p>Tiếng Trung và tiếng Việt gần như <strong>không có biến hình</strong>: động từ không đổi theo thì/ngôi/số, danh từ không đổi theo số/cách. Nghĩa ngữ pháp được thể hiện bằng từ riêng và trật tự từ thay vì phụ tố, vd trợ từ thể (aspect) <strong>了</strong> le đánh dấu hoàn thành trong tiếng Trung (我吃了 <em>wǒ chī le</em>, "tôi đã ăn") thay vì một hậu tố như <em>-ed</em> trong tiếng Anh. Tiếng Việt cũng vậy: <em>tôi đã ăn</em> dùng từ riêng <em>đã</em> (đánh dấu quá khứ), không phải hậu tố.</p>
<h3>Ghép từ rất sản sinh</h3>
<p>Trong khi tiếng Anh hay mượn gốc Hy-La cho khái niệm mới, tiếng Trung thường <strong>ghép các hình vị bản ngữ</strong> một cách trong suốt: 电 <em>diàn</em> "điện" + 脑 <em>nǎo</em> "não" = 电脑 <em>diànnǎo</em> "máy tính" ("não điện"); 火 <em>huǒ</em> "lửa" + 车 <em>chē</em> "xe" = 火车 <em>huǒchē</em> "tàu hoả". Tiếng Việt, do hấp thụ một lớp từ Hán-Việt lớn, cũng phản chiếu điều này: <em>hoả xa</em> (lửa-xe, trang trọng, chỉ tàu hoả) song song với từ ghép thuần Việt <em>xe lửa</em>.</p>
<pre><code>EN (kết hợp phụ tố, biến hình): walk + -ed -> walked
ZH (đơn lập, trợ từ):            我  吃  了     -> "tôi đã ăn"
                                  wǒ  chī  le
VI (đơn lập, từ riêng):          tôi đã  ăn    -> "tôi đã ăn"
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Vì tiếng Trung và tiếng Việt đều đơn lập, nhiều cấu trúc ánh xạ từ-đối-từ giữa hai ngôn ngữ — nhưng không ánh xạ được sang biến hình tiếng Anh, nguồn lỗi ngữ pháp lớn nhất khi người Trung/Việt học chia thì tiếng Anh.</div>`,
  ]]);

const c3q = quiz('ltg201-quiz-3', 'Quiz 3 — Morphology|||Quiz 3 — Hình thái học', [
  { id: 'q1', question: 'Hình vị (morpheme) là gì?', options: ['Đơn vị âm nhỏ nhất', 'Đơn vị nhỏ nhất mang nghĩa hoặc chức năng ngữ pháp', 'Một câu hoàn chỉnh', 'Một âm tiết bất kỳ'], correctIndex: 1, explanation: 'Morpheme là đơn vị ngữ nghĩa/ngữ pháp nhỏ nhất, khác âm vị (đơn vị âm).' },
  { id: 'q2', question: 'Tiếng Trung và tiếng Việt được xếp vào loại hình nào về hình thái học?', options: ['Chắp dính (agglutinative)', 'Hoà kết/biến hình (inflectional)', 'Đơn lập/phân tích tính (isolating/analytic)', 'Đa tổng hợp (polysynthetic)'], correctIndex: 2, explanation: 'Gần như không biến hình; nghĩa ngữ pháp do từ riêng và trật tự từ đảm nhiệm.' },
  { id: 'q3', question: 'Từ 电脑 (diànnǎo, máy tính) trong tiếng Trung được tạo ra bằng cách nào?', options: ['Thêm hậu tố biến hình', 'Ghép hai hình vị có nghĩa (điện + não)', 'Vay mượn nguyên gốc từ tiếng Anh', 'Đổi thanh điệu của một từ có sẵn'], correctIndex: 1, explanation: 'Ghép hình vị bản ngữ trong suốt là cách tạo từ mới rất sản sinh trong tiếng Trung.' },
]);

const c4 = doc('ltg201-4-1-syntax', '4.1 — Syntax|||4.1 — Cú pháp học',
  'Thành tố, cây cú pháp; loại hình trật tự từ SVO; chủ đề hoá trong tiếng Trung/Việt.',
  [[
    `<span class="eyebrow">LTG201 · Chapter 4 · Lesson 4.1</span>
<h2>Syntax — sentence structure</h2>
<h3>Constituents &amp; phrase structure</h3>
<p><strong>Syntax</strong> studies how words combine into phrases and sentences. Sentences are not flat strings of words but hierarchical — words group into <strong>constituents</strong> (noun phrases, verb phrases) that behave as units. Tree diagrams and phrase-structure rules (S → NP VP) represent this hierarchy.</p>
<h3>Word order typology</h3>
<p>Languages are classified by the basic order of Subject, Verb and Object. English, Mandarin Chinese and Vietnamese are all basically <strong>SVO</strong> (Subject-Verb-Object): <em>I eat rice</em> / 我吃饭 <em>wǒ chī fàn</em> / <em>tôi ăn cơm</em> — the same S-V-O order across all three, which is why basic sentence order transfers easily between them.</p>
<h3>Chinese &amp; Vietnamese are topic-prominent</h3>
<p>Beyond basic SVO, Chinese (and to a lesser extent Vietnamese) frequently fronts a <strong>topic</strong> — what the sentence is about — before the comment, even when the topic is not the grammatical subject: 这本书我看过了 <em>zhè běn shū wǒ kàn guò le</em>, literally "this book, I have read [it]" — the object <em>this book</em> is topicalized to the front. English can do this too (topicalization) but far less often; it typically keeps SVO order and uses passive voice instead ("This book has been read by me").</p>
<pre><code>Topic-comment (ZH): [这本书]Topic  [我看过了]Comment
                     this book     I have read (it)
EN default:          I have read this book.   (SVO, no fronting)
</code></pre>
<div class="callout"><span class="badge">Transfer tip</span> Basic SVO order transfers cleanly between Chinese, Vietnamese and English — but topic-fronting does not; a literal word-for-word translation of a Chinese topic sentence often sounds unnatural in English.</div>`,
    `<span class="eyebrow">LTG201 · Chương 4 · Bài 4.1</span>
<h2>Cú pháp học — cấu trúc câu</h2>
<h3>Thành tố &amp; cấu trúc cụm từ</h3>
<p><strong>Cú pháp học (syntax)</strong> nghiên cứu cách từ kết hợp thành cụm từ và câu. Câu không phải chuỗi từ phẳng mà có tính tầng bậc — các từ nhóm lại thành <strong>thành tố (constituent)</strong> (cụm danh từ, cụm động từ) hoạt động như một khối. Sơ đồ cây và quy tắc cấu trúc cụm từ (S → NP VP) biểu diễn tính tầng bậc này.</p>
<h3>Loại hình trật tự từ</h3>
<p>Ngôn ngữ được phân loại theo trật tự cơ bản của Chủ ngữ, Động từ và Tân ngữ. Tiếng Anh, tiếng Quan Thoại và tiếng Việt đều cơ bản là <strong>SVO</strong> (Chủ-Động-Tân): <em>I eat rice</em> / 我吃饭 <em>wǒ chī fàn</em> / <em>tôi ăn cơm</em> — cùng trật tự S-V-O ở cả ba ngôn ngữ, đó là lý do trật tự câu cơ bản chuyển dễ dàng giữa chúng.</p>
<h3>Tiếng Trung &amp; tiếng Việt thiên về chủ đề</h3>
<p>Ngoài trật tự SVO cơ bản, tiếng Trung (và ở mức độ ít hơn, tiếng Việt) thường đưa <strong>chủ đề (topic)</strong> — điều câu nói đang nói về — lên đầu câu trước phần bình luận, kể cả khi chủ đề không phải là chủ ngữ ngữ pháp: 这本书我看过了 <em>zhè běn shū wǒ kàn guò le</em>, nghĩa đen "quyển sách này, tôi đã xem [nó] rồi" — tân ngữ <em>quyển sách này</em> được chủ đề hoá lên đầu. Tiếng Anh cũng làm được điều này (topicalization) nhưng ít hơn nhiều; nó thường giữ trật tự SVO và dùng thể bị động thay thế ("This book has been read by me").</p>
<pre><code>Chủ đề-bình luận (ZH): [这本书]Chủ đề  [我看过了]Bình luận
                        quyển sách này  tôi đã xem (nó)
EN mặc định:            I have read this book.   (SVO, không đảo)
</code></pre>
<div class="callout"><span class="badge">Mẹo chuyển di</span> Trật tự SVO cơ bản chuyển sạch giữa tiếng Trung, tiếng Việt và tiếng Anh — nhưng chủ đề hoá thì không; dịch nguyên văn từng-từ một câu chủ đề tiếng Trung sang tiếng Anh thường nghe không tự nhiên.</div>`,
  ]]);

const c4q = quiz('ltg201-quiz-4', 'Quiz 4 — Syntax|||Quiz 4 — Cú pháp học', [
  { id: 'q1', question: 'Tiếng Anh, tiếng Trung và tiếng Việt đều có trật tự từ cơ bản nào?', options: ['SOV', 'VSO', 'SVO', 'OSV'], correctIndex: 2, explanation: 'Cả ba ngôn ngữ đều cơ bản là Chủ-Động-Tân (SVO).' },
  { id: 'q2', question: 'Câu 这本书我看过了 (zhè běn shū wǒ kàn guò le) đưa thành phần nào lên đầu câu?', options: ['Chủ ngữ ngữ pháp', 'Chủ đề (topic), vốn là tân ngữ', 'Vị ngữ', 'Trạng ngữ chỉ thời gian'], correctIndex: 1, explanation: 'Tân ngữ "quyển sách này" được chủ đề hoá lên đầu câu, dù không phải chủ ngữ.' },
  { id: 'q3', question: 'Đơn vị gồm nhiều từ hoạt động như một khối trong câu (vd cụm danh từ) gọi là gì?', options: ['Hình vị', 'Âm vị', 'Thành tố/cụm từ (constituent)', 'Nguyên âm'], correctIndex: 2, explanation: 'Constituent: nhóm từ hoạt động như một đơn vị cú pháp duy nhất.' },
]);

const c5 = doc('ltg201-5-1-semantics-pragmatics', '5.1 — Semantics & pragmatics|||5.1 — Ngữ nghĩa & ngữ dụng học',
  'Đa nghĩa, đồng âm, đồng nghĩa; nguyên tắc hợp tác Grice; ý hợp (意合) vs hình hợp (形合).',
  [[
    `<span class="eyebrow">LTG201 · Chapter 5 · Lesson 5.1</span>
<h2>Semantics &amp; pragmatics</h2>
<h3>Semantics — meaning encoded in language</h3>
<p><strong>Semantics</strong> studies literal, context-independent meaning. Key relations: <strong>synonymy</strong> (different words, similar meaning: <em>big/large</em>), <strong>polysemy</strong> (one word, multiple related senses, e.g. <em>head</em> of a person / <em>head</em> of a company), <strong>homonymy</strong> (same form, historically unrelated meanings: <em>bank</em> of a river vs <em>bank</em> that holds money), and <strong>ambiguity</strong> (a sentence with more than one possible meaning).</p>
<h3>Pragmatics — meaning in context</h3>
<p><strong>Pragmatics</strong> studies meaning that depends on context, speaker intention and shared assumptions — what is <em>implied</em>, not literally said. Grice's <strong>cooperative principle</strong> and its maxims (quantity, quality, relation, manner) explain how "Can you pass the salt?" is understood as a request, not a literal question about ability.</p>
<h3>A parataxis contrast: Chinese 意合 vs English 形合</h3>
<p>Chinese famously relies on <strong>意合 yìhé</strong> ("meaning-connection", parataxis) — clauses are juxtaposed and the logical relation (cause, condition, contrast) is left for the hearer to infer from context, often without an explicit connective: 下雨了，我们不去了 <em>xià yǔ le, wǒmen bù qù le</em>, literally "rain fell, we not go" = "Since it is raining, we are not going." English relies more on <strong>形合 xínghé</strong> ("form-connection", hypotaxis) — the logical relation is usually spelled out with an explicit conjunction ("<em>Since</em> it is raining, we are not going"). Vietnamese sits closer to Chinese, tolerating similar juxtaposition, but often still prefers an explicit connective like <em>vì...nên</em>.</p>
<pre><code>ZH (parataxis, implicit relation): 下雨了，我们不去了。
EN (hypotaxis, explicit relation): Since it is raining, we are not going.
</code></pre>
<div class="callout"><span class="badge">Practical payoff</span> Vietnamese learners of Chinese can often drop connectives that English grammar would force them to keep — but must remember English usually wants that connective made explicit.</div>`,
    `<span class="eyebrow">LTG201 · Chương 5 · Bài 5.1</span>
<h2>Ngữ nghĩa &amp; ngữ dụng học</h2>
<h3>Ngữ nghĩa học — nghĩa được mã hoá trong ngôn ngữ</h3>
<p><strong>Ngữ nghĩa học (semantics)</strong> nghiên cứu nghĩa đen, độc lập ngữ cảnh. Các quan hệ then chốt: <strong>đồng nghĩa (synonymy)</strong> (từ khác nhau, nghĩa gần giống: <em>big/large</em>), <strong>đa nghĩa (polysemy)</strong> (một từ, nhiều nghĩa liên quan, vd <em>head</em> "đầu người" / <em>head</em> "người đứng đầu công ty"), <strong>đồng âm (homonymy)</strong> (cùng hình thức, nghĩa không liên quan về mặt lịch sử: <em>bank</em> "bờ sông" vs <em>bank</em> "ngân hàng"), và <strong>đa nghĩa mơ hồ (ambiguity)</strong> (một câu có nhiều hơn một cách hiểu).</p>
<h3>Ngữ dụng học — nghĩa trong ngữ cảnh</h3>
<p><strong>Ngữ dụng học (pragmatics)</strong> nghiên cứu nghĩa phụ thuộc ngữ cảnh, ý định người nói và giả định chung — điều được <em>hàm ý</em>, không nói ra trực tiếp. <strong>Nguyên tắc hợp tác</strong> của Grice và các phương châm (lượng, chất, quan yếu, cách thức) giải thích vì sao "Can you pass the salt?" (Bạn chuyền muối được không?) được hiểu là lời yêu cầu, không phải câu hỏi về khả năng.</p>
<h3>Đối chiếu tính liên kết: 意合 tiếng Trung vs 形合 tiếng Anh</h3>
<p>Tiếng Trung nổi tiếng dựa vào <strong>意合 yìhé</strong> ("liên kết ý", ý hợp) — các mệnh đề đặt cạnh nhau và quan hệ logic (nguyên nhân, điều kiện, tương phản) được để người nghe tự suy ra từ ngữ cảnh, thường không có liên từ tường minh: 下雨了，我们不去了 <em>xià yǔ le, wǒmen bù qù le</em>, nghĩa đen "trời mưa rồi, chúng tôi không đi" = "Vì trời mưa nên chúng tôi không đi." Tiếng Anh dựa nhiều hơn vào <strong>形合 xínghé</strong> ("liên kết hình thức", hình hợp) — quan hệ logic thường được nói rõ bằng liên từ tường minh ("<em>Since</em> it is raining, we are not going"). Tiếng Việt gần với tiếng Trung hơn, chấp nhận cách đặt cạnh tương tự, nhưng vẫn thường thích dùng liên từ tường minh như <em>vì...nên</em>.</p>
<pre><code>ZH (ý hợp, quan hệ ngầm):    下雨了，我们不去了。
EN (hình hợp, quan hệ rõ):  Since it is raining, we are not going.
</code></pre>
<div class="callout"><span class="badge">Ứng dụng thực tế</span> Người Việt học tiếng Trung thường bỏ được liên từ mà ngữ pháp tiếng Anh buộc phải giữ — nhưng cần nhớ tiếng Anh thường muốn liên từ đó được nói rõ.</div>`,
  ]]);

const c5q = quiz('ltg201-quiz-5', 'Quiz 5 — Semantics & pragmatics|||Quiz 5 — Ngữ nghĩa & ngữ dụng học', [
  { id: 'q1', question: 'Từ head vừa có nghĩa "đầu người" vừa có nghĩa "người đứng đầu công ty" là ví dụ của hiện tượng nào?', options: ['Đồng âm (homonymy)', 'Đa nghĩa (polysemy)', 'Đồng nghĩa (synonymy)', 'Ẩn dụ ngữ pháp'], correctIndex: 1, explanation: 'Polysemy: một từ, nhiều nghĩa có liên quan với nhau về mặt ý niệm.' },
  { id: 'q2', question: 'Câu "Can you pass the salt?" được hiểu như lời yêu cầu chứ không phải câu hỏi về khả năng — thuộc phân ngành nào?', options: ['Ngữ âm học', 'Hình thái học', 'Ngữ dụng học (pragmatics)', 'Âm vị học'], correctIndex: 2, explanation: 'Pragmatics nghiên cứu nghĩa phụ thuộc ngữ cảnh và ý định người nói (hàm ý).' },
  { id: 'q3', question: 'Câu tiếng Trung 下雨了，我们不去了 không dùng liên từ tường minh mà vẫn hiểu được quan hệ nhân quả — đây là đặc điểm gì?', options: ['Hình hợp (hypotaxis, kiểu tiếng Anh)', 'Ý hợp (parataxis, 意合) đặc trưng của tiếng Trung', 'Không có ngữ pháp', 'Đảo ngữ'], correctIndex: 1, explanation: 'Yìhé: quan hệ logic để ngữ cảnh gánh, không cần liên từ tường minh.' },
]);

const c6 = doc('ltg201-6-1-sociolinguistics', '6.1 — Language & society|||6.1 — Ngôn ngữ & xã hội',
  'Phương ngữ, sociolect, register; phương ngữ tiếng Hán vs vùng miền tiếng Việt; ngôn ngữ chuẩn, song thể ngữ.',
  [[
    `<span class="eyebrow">LTG201 · Chapter 6 · Lesson 6.1</span>
<h2>Language &amp; society (sociolinguistics)</h2>
<h3>Dialect, sociolect, register</h3>
<p>A <strong>dialect</strong> is a regional or social variety of a language, differing in pronunciation, vocabulary and sometimes grammar. A <strong>sociolect</strong> is a variety associated with a social group (class, age). A <strong>register</strong> is a style chosen for a situation (formal vs casual) — the same speaker uses a different register writing an email to a professor versus texting a friend.</p>
<h3>Chinese dialects: one writing system, many spoken varieties</h3>
<p>What are called "Chinese dialects" (汉语方言 <em>Hànyǔ fāngyán</em>) — Mandarin (官话), Cantonese (粤语), Wu (吴语), Min (闽语), Hakka (客家话)… — are, by the ordinary linguistic test of <strong>mutual intelligibility</strong>, closer to separate languages: a Mandarin speaker and a Cantonese speaker generally cannot understand each other's spoken words. They are called "dialects" of one Chinese language mainly for political/cultural reasons and because they share one logographic <strong>writing system</strong> (Hanzi) — a sociolinguistic, not a purely linguistic, classification.</p>
<h3>Vietnamese regional varieties</h3>
<p>Vietnamese also has three broad regional varieties — Northern (Bắc), Central (Trung) and Southern (Nam) — differing mainly in pronunciation (e.g. how <em>tr-</em>/<em>ch-</em> or the six tones are realized) and some vocabulary, but they remain mutually intelligible, unlike Mandarin vs Cantonese.</p>
<h3>Standard language &amp; diglossia</h3>
<p>A <strong>standard language</strong> (e.g. Standard Mandarin/普通话, based on Beijing pronunciation) is a variety chosen — usually for political and educational reasons, not linguistic superiority — as the norm for schools and media. <strong>Diglossia</strong> is when a community uses two varieties for different functions (e.g. a formal/literary variety for writing and a colloquial one for speaking).</p>
<div class="callout"><span class="badge">Key distinction</span> "Language vs dialect" is not a purely linguistic line — it is drawn as much by politics, identity and writing systems as by mutual intelligibility. Chinese "dialects" are the textbook example.</div>`,
    `<span class="eyebrow">LTG201 · Chương 6 · Bài 6.1</span>
<h2>Ngôn ngữ &amp; xã hội (xã hội ngôn ngữ học)</h2>
<h3>Phương ngữ, sociolect, register</h3>
<p>Một <strong>phương ngữ (dialect)</strong> là biến thể vùng miền hoặc xã hội của một ngôn ngữ, khác nhau về phát âm, từ vựng và đôi khi ngữ pháp. Một <strong>xã hội ngữ (sociolect)</strong> là biến thể gắn với một nhóm xã hội (giai tầng, độ tuổi). Một <strong>phong cách chức năng (register)</strong> là phong cách được chọn theo tình huống (trang trọng vs thân mật) — cùng một người nói dùng register khác nhau khi viết email cho giáo sư so với nhắn tin cho bạn.</p>
<h3>Phương ngữ tiếng Hán: một hệ chữ viết, nhiều biến thể nói</h3>
<p>Cái được gọi là "phương ngữ tiếng Hán" (汉语方言 <em>Hànyǔ fāngyán</em>) — Quan Thoại (官话), Quảng Đông (粤语), Ngô (吴语), Mân (闽语), Khách Gia (客家话)… — theo tiêu chí ngôn ngữ học thông thường là <strong>khả năng hiểu lẫn nhau (mutual intelligibility)</strong>, thực chất gần với những ngôn ngữ riêng biệt hơn: người nói Quan Thoại và người nói Quảng Đông thường không hiểu được lời nói của nhau. Chúng được gọi là "phương ngữ" của một tiếng Hán chủ yếu vì lý do chính trị/văn hoá và vì dùng chung một hệ <strong>chữ viết</strong> biểu ý (chữ Hán) — một cách phân loại mang tính xã hội ngôn ngữ học, không thuần tuý ngôn ngữ học.</p>
<h3>Các vùng miền tiếng Việt</h3>
<p>Tiếng Việt cũng có ba vùng miền lớn — Bắc, Trung, Nam — khác nhau chủ yếu về phát âm (vd cách thể hiện <em>tr-</em>/<em>ch-</em> hay sáu thanh điệu) và một số từ vựng, nhưng vẫn hiểu được lẫn nhau, khác với trường hợp Quan Thoại vs Quảng Đông.</p>
<h3>Ngôn ngữ chuẩn &amp; song thể ngữ</h3>
<p>Một <strong>ngôn ngữ chuẩn (standard language)</strong> (vd Quan Thoại chuẩn/普通话, dựa trên phát âm Bắc Kinh) là một biến thể được chọn — thường vì lý do chính trị và giáo dục, không phải vì ưu việt ngôn ngữ học — làm chuẩn cho trường học và truyền thông. <strong>Song thể ngữ (diglossia)</strong> là khi một cộng đồng dùng hai biến thể cho hai chức năng khác nhau (vd biến thể trang trọng/văn chương khi viết và biến thể khẩu ngữ khi nói).</p>
<div class="callout"><span class="badge">Phân biệt then chốt</span> Ranh giới "ngôn ngữ vs phương ngữ" không thuần tuý ngôn ngữ học — nó được vẽ bởi chính trị, bản sắc và hệ chữ viết cũng nhiều như bởi khả năng hiểu lẫn nhau. Phương ngữ tiếng Hán là ví dụ kinh điển.</div>`,
  ]]);

const c6q = quiz('ltg201-quiz-6', 'Quiz 6 — Language & society|||Quiz 6 — Ngôn ngữ & xã hội', [
  { id: 'q1', question: 'Người nói tiếng Quan Thoại và người nói tiếng Quảng Đông nói chuyện bằng khẩu ngữ thì thường:', options: ['Hiểu nhau hoàn toàn vì cùng một ngôn ngữ', 'Không hiểu nhau — về ngôn ngữ học gần như hai ngôn ngữ khác nhau, dù dùng chung chữ Hán', 'Chỉ khác nhau về thanh điệu', 'Không có gì khác biệt'], correctIndex: 1, explanation: 'Kiểm bằng mutual intelligibility, Quan Thoại và Quảng Đông không hiểu lời nói của nhau.' },
  { id: 'q2', question: 'Việc gọi Quan Thoại và Quảng Đông là hai phương ngữ của một tiếng Hán chủ yếu dựa trên tiêu chí nào?', options: ['Khả năng hiểu lẫn nhau khi nói', 'Chính trị/văn hoá và việc dùng chung một hệ chữ viết', 'Ngữ pháp giống hệt nhau', 'Thanh điệu giống hệt nhau'], correctIndex: 1, explanation: 'Đây là cách phân loại xã hội ngôn ngữ học, không dựa trên mutual intelligibility.' },
  { id: 'q3', question: 'Phong cách ngôn ngữ thay đổi theo tình huống giao tiếp (trang trọng/thân mật) gọi là gì?', options: ['Phương ngữ (dialect)', 'Xã hội ngữ (sociolect)', 'Phong cách chức năng (register)', 'Song thể ngữ (diglossia)'], correctIndex: 2, explanation: 'Register là biến thể chọn theo tình huống giao tiếp, không theo vùng hay nhóm xã hội cố định.' },
]);

const c7 = doc('ltg201-7-1-change-family-typology', '7.1 — Language change, families & typology|||7.1 — Biến đổi, ngữ hệ & loại hình',
  'Biến đổi ngôn ngữ; ngữ hệ Hán-Tạng/Nam Á/Ấn-Âu; loại hình đơn lập/chắp dính/hoà kết/đa tổng hợp.',
  [[
    `<span class="eyebrow">LTG201 · Chapter 7 · Lesson 7.1</span>
<h2>Language change, families &amp; typology</h2>
<h3>Language change is constant</h3>
<p>All living languages change over time — in sound (sound shifts), meaning (semantic shift) and grammar (grammaticalization). This is normal, not decay; Old English is unintelligible to modern English speakers, and Old Chinese (上古汉语) had a very different sound system from modern Mandarin.</p>
<h3>Language families</h3>
<p>Related languages descend from a common ancestor and form a <strong>language family</strong>, established by systematic sound correspondences and shared basic vocabulary, not by similarity alone.</p>
<pre><code>English    -> Indo-European family -> Germanic branch
Mandarin   -> Sino-Tibetan family  -> Sinitic branch
Vietnamese -> Austroasiatic family -> Vietic branch
</code></pre>
<p>A common misconception: because Vietnamese has absorbed a huge layer of <strong>Sino-Vietnamese vocabulary</strong> (từ Hán-Việt, roughly a third to over half the lexicon depending on register) and even tones, it is sometimes assumed to be a Sino-Tibetan language. It is not — genetically Vietnamese belongs to the <strong>Austroasiatic</strong> family (related to Khmer and Munda languages), and the Chinese-derived material is a massive layer of <strong>borrowing</strong> due to a millennium of Chinese rule and cultural contact, not common ancestry.</p>
<h3>Typology: classifying by structure, not ancestry</h3>
<p>Independent of family, languages can be classified <strong>typologically</strong> by how they build words:</p>
<pre><code>Isolating (little/no affixation): Mandarin Chinese, Vietnamese
Agglutinative (affixes stack, one meaning each): Japanese, Korean, Turkish
Fusional/inflectional (one affix, many meanings): Latin, Russian
Polysynthetic (a whole sentence in one word): many Native American languages
</code></pre>
<p>Chinese and Vietnamese therefore share a <strong>typology</strong> (isolating) despite belonging to two entirely different <strong>families</strong> (Sino-Tibetan vs Austroasiatic) — family and typology are independent classifications, and their convergence here is due to prolonged contact, not shared ancestry.</p>
<div class="callout"><span class="badge">Key idea</span> "Family" = genetic descent (proven by regular sound correspondences); "typology" = structural resemblance (can arise from contact or coincidence). Chinese and Vietnamese are typologically alike but genetically unrelated.</div>`,
    `<span class="eyebrow">LTG201 · Chương 7 · Bài 7.1</span>
<h2>Biến đổi ngôn ngữ, ngữ hệ &amp; loại hình</h2>
<h3>Ngôn ngữ biến đổi không ngừng</h3>
<p>Mọi ngôn ngữ đang sống đều biến đổi theo thời gian — về âm (biến đổi ngữ âm), nghĩa (biến đổi ngữ nghĩa) và ngữ pháp (ngữ pháp hoá). Đây là điều bình thường, không phải suy thoái; tiếng Anh cổ không thể hiểu được với người nói tiếng Anh hiện đại, và tiếng Hán thượng cổ (上古汉语) có hệ thống âm rất khác tiếng Quan Thoại hiện đại.</p>
<h3>Ngữ hệ (language family)</h3>
<p>Các ngôn ngữ có quan hệ họ hàng cùng bắt nguồn từ một tổ tiên chung và tạo thành một <strong>ngữ hệ</strong>, được xác lập bằng những tương ứng âm có hệ thống và từ vựng cơ bản chung, chứ không chỉ dựa vào sự giống nhau bề mặt.</p>
<pre><code>Tiếng Anh   -> Ngữ hệ Ấn-Âu (Indo-European) -> nhánh Germanic
Quan Thoại  -> Ngữ hệ Hán-Tạng (Sino-Tibetan) -> nhánh Hán (Sinitic)
Tiếng Việt  -> Ngữ hệ Nam Á (Austroasiatic)  -> nhánh Việt (Vietic)
</code></pre>
<p>Một ngộ nhận phổ biến: vì tiếng Việt hấp thụ một lớp <strong>từ Hán-Việt</strong> khổng lồ (khoảng một phần ba đến hơn một nửa từ vựng tuỳ register) và cả thanh điệu, nên đôi khi bị coi là ngôn ngữ Hán-Tạng. Không phải vậy — về mặt di truyền, tiếng Việt thuộc ngữ hệ <strong>Nam Á (Austroasiatic)</strong> (họ hàng với tiếng Khmer và các ngôn ngữ Munda), và lớp từ gốc Hán là một lớp <strong>vay mượn</strong> khổng lồ do cả nghìn năm bị đô hộ và tiếp xúc văn hoá với Trung Quốc, không phải do cùng tổ tiên.</p>
<h3>Loại hình học: phân loại theo cấu trúc, không theo nguồn gốc</h3>
<p>Độc lập với ngữ hệ, ngôn ngữ có thể được phân loại theo <strong>loại hình (typology)</strong> dựa trên cách cấu tạo từ:</p>
<pre><code>Đơn lập (ít/không phụ tố): tiếng Quan Thoại, tiếng Việt
Chắp dính (phụ tố xếp chồng, mỗi cái một nghĩa): tiếng Nhật, Hàn, Thổ
Hoà kết/biến hình (một phụ tố mang nhiều nghĩa): tiếng Latin, Nga
Đa tổng hợp (cả một câu gói trong một từ): nhiều ngôn ngữ bản địa châu Mỹ
</code></pre>
<p>Vì vậy tiếng Trung và tiếng Việt chia sẻ cùng một <strong>loại hình</strong> (đơn lập) dù thuộc hai <strong>ngữ hệ</strong> hoàn toàn khác nhau (Hán-Tạng vs Nam Á) — ngữ hệ và loại hình là hai cách phân loại độc lập, và sự trùng hợp ở đây là do tiếp xúc lâu dài, không phải do cùng nguồn gốc.</p>
<div class="callout"><span class="badge">Ý chính</span> "Ngữ hệ" = quan hệ huyết thống (chứng minh bằng tương ứng âm đều đặn); "loại hình" = giống nhau về cấu trúc (có thể do tiếp xúc hoặc trùng hợp). Tiếng Trung và tiếng Việt giống nhau về loại hình nhưng không họ hàng về ngữ hệ.</div>`,
  ]]);

const c7q = quiz('ltg201-quiz-7', 'Quiz 7 — Change, family & typology|||Quiz 7 — Biến đổi, ngữ hệ & loại hình', [
  { id: 'q1', question: 'Tiếng Việt về mặt ngữ hệ (di truyền) thuộc ngữ hệ nào?', options: ['Hán-Tạng (Sino-Tibetan)', 'Nam Á (Austroasiatic)', 'Ấn-Âu (Indo-European)', 'Nam Đảo (Austronesian)'], correctIndex: 1, explanation: 'Tiếng Việt thuộc ngữ hệ Nam Á, họ hàng với tiếng Khmer, dù vay mượn rất nhiều từ Hán.' },
  { id: 'q2', question: 'Lớp từ Hán-Việt khổng lồ trong tiếng Việt là kết quả của điều gì, KHÔNG chứng minh nguồn gốc chung?', options: ['Vay mượn (borrowing) do tiếp xúc văn hoá/lịch sử lâu dài với Trung Quốc', 'Tiếng Việt vốn thuộc ngữ hệ Hán-Tạng', 'Trùng hợp ngẫu nhiên hoàn toàn', 'Do quy tắc ngữ pháp giống nhau'], correctIndex: 0, explanation: 'Vay mượn từ vựng không đồng nghĩa với quan hệ họ hàng ngữ hệ (phải có tương ứng âm hệ thống).' },
  { id: 'q3', question: 'Tiếng Trung và tiếng Việt đều được xếp là ngôn ngữ đơn lập (isolating) theo tiêu chí nào?', options: ['Ngữ hệ (nguồn gốc chung)', 'Loại hình học (typology) — cách cấu tạo từ, ít/không biến hình', 'Địa lý', 'Hệ chữ viết'], correctIndex: 1, explanation: 'Isolating là một phân loại loại hình học, độc lập với ngữ hệ.' },
]);

const c8 = doc('ltg201-8-1-acquisition-thought-review', '8.1 — Acquisition, language & thought, review|||8.1 — Thụ đắc, ngôn ngữ & tư duy, ôn tập',
  'Thụ đắc ngôn ngữ thứ nhất & thứ hai, chuyển di ngôn ngữ; giả thuyết Sapir-Whorf; bảng ôn tập 8 chương.',
  [[
    `<span class="eyebrow">LTG201 · Chapter 8 · Lesson 8.1</span>
<h2>Language acquisition, language &amp; thought, review</h2>
<h3>First language acquisition</h3>
<p>Children acquire their native language rapidly and without formal instruction, passing through predictable stages (babbling → one-word → two-word → telegraphic → full grammar) at similar ages across languages, including tonal languages like Mandarin and Vietnamese, where children master lexical tone very early — often before they master all consonants.</p>
<h3>Second language acquisition</h3>
<p><strong>Interlanguage</strong> is a learner's evolving, systematic (not random) approximation of the target language, often shaped by <strong>transfer</strong> from the first language. A Vietnamese or Chinese learner of English typically transfers SVO order easily (it already matches) but struggles with English tense inflection (<em>-ed</em>, <em>-s</em>) precisely because Chinese/Vietnamese mark tense with separate particles/words, not suffixes (see Chapter 3) — a textbook case of negative transfer at the morphology level, not a "careless mistake."</p>
<h3>Language &amp; thought: the Sapir-Whorf hypothesis</h3>
<p>Does the language you speak shape how you think? The <strong>strong version</strong> (linguistic determinism — language rigidly determines thought) is now rejected by most linguists. The <strong>weak version</strong> (linguistic relativity — language habitually influences perception/attention, without making other thoughts impossible) has some experimental support: e.g. speakers of languages with obligatory grammatical gender or richer color-term systems show measurable differences in categorization tasks, without being unable to perceive what their language does not name.</p>
<h3>Course review — the eight lenses on language</h3>
<pre><code>1. Nature & functions   -> what language IS, and what it is FOR
2. Phonetics/phonology  -> sounds and how they pattern (tone: ZH/VI yes, EN no)
3. Morphology           -> word structure (ZH/VI isolating vs EN inflecting)
4. Syntax               -> sentence structure (SVO shared; topic-fronting ZH/VI)
5. Semantics/pragmatics -> literal meaning vs meaning-in-context (意合 vs 形合)
6. Sociolinguistics     -> language varying by region/group/situation
7. Change, family, typology -> ZH & VI: different family, same typology
8. Acquisition & thought -> how language is learned, and how it may shape thought
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> Most exam questions test whether you can NAME the right sub-field for a given phenomenon (e.g. "tone → phonology", "topic-fronting → syntax", "意合 → pragmatics/semantics") — review the table above before the test.</div>`,
    `<span class="eyebrow">LTG201 · Chương 8 · Bài 8.1</span>
<h2>Thụ đắc ngôn ngữ, ngôn ngữ &amp; tư duy, ôn tập</h2>
<h3>Thụ đắc ngôn ngữ thứ nhất</h3>
<p>Trẻ em thụ đắc tiếng mẹ đẻ rất nhanh và không cần dạy dỗ chính quy, trải qua các giai đoạn có thể đoán trước (bập bẹ → một từ → hai từ → điện tín → ngữ pháp đầy đủ) ở độ tuổi tương tự nhau giữa các ngôn ngữ, kể cả ngôn ngữ có thanh điệu như tiếng Quan Thoại và tiếng Việt, nơi trẻ nắm được thanh điệu từ vựng rất sớm — thường trước khi nắm hết mọi phụ âm.</p>
<h3>Thụ đắc ngôn ngữ thứ hai</h3>
<p><strong>Liên ngữ (interlanguage)</strong> là hệ thống ngôn ngữ đang phát triển, có tính hệ thống (không ngẫu nhiên) của người học, gần đúng dần với ngôn ngữ đích, thường bị chi phối bởi <strong>chuyển di (transfer)</strong> từ tiếng mẹ đẻ. Người Việt hoặc người Trung học tiếng Anh thường chuyển di trật tự SVO dễ dàng (vì đã khớp sẵn) nhưng gặp khó với biến hình thì tiếng Anh (<em>-ed</em>, <em>-s</em>) chính vì tiếng Trung/Việt đánh dấu thì bằng trợ từ/từ riêng, không bằng hậu tố (xem Chương 3) — một trường hợp kinh điển của chuyển di tiêu cực (negative transfer) ở cấp hình thái học, không phải "lỗi bất cẩn."</p>
<h3>Ngôn ngữ &amp; tư duy: giả thuyết Sapir-Whorf</h3>
<p>Ngôn ngữ bạn nói có định hình cách bạn tư duy không? <strong>Phiên bản mạnh</strong> (tất định luận ngôn ngữ — ngôn ngữ quyết định cứng nhắc tư duy) hiện bị đa số nhà ngôn ngữ học bác bỏ. <strong>Phiên bản yếu</strong> (tương đối luận ngôn ngữ — ngôn ngữ có xu hướng ảnh hưởng tới nhận thức/chú ý, mà không khiến các suy nghĩ khác thành bất khả) có một số bằng chứng thực nghiệm ủng hộ: vd người nói ngôn ngữ có giống ngữ pháp bắt buộc hoặc hệ thống từ chỉ màu phong phú hơn cho thấy khác biệt đo được trong nhiệm vụ phân loại, mà vẫn không hề mất khả năng nhận biết những gì ngôn ngữ của họ không đặt tên.</p>
<h3>Ôn tập môn học — tám lăng kính nhìn ngôn ngữ</h3>
<pre><code>1. Bản chất & chức năng -> ngôn ngữ LÀ gì, và DÙNG ĐỂ LÀM GÌ
2. Ngữ âm/âm vị học      -> âm và cách chúng thành hệ thống (tone: ZH/VI có, EN không)
3. Hình thái học         -> cấu tạo từ (ZH/VI đơn lập vs EN biến hình)
4. Cú pháp học           -> cấu trúc câu (chung SVO; chủ đề hoá riêng ZH/VI)
5. Ngữ nghĩa/ngữ dụng    -> nghĩa đen vs nghĩa theo ngữ cảnh (意合 vs 形合)
6. Xã hội ngôn ngữ học   -> ngôn ngữ biến đổi theo vùng/nhóm/tình huống
7. Biến đổi, ngữ hệ, loại hình -> ZH & VI: khác ngữ hệ, cùng loại hình
8. Thụ đắc & tư duy      -> ngôn ngữ được học ra sao, và có thể định hình tư duy thế nào
</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> Phần lớn câu hỏi thi kiểm tra bạn có GỌI ĐÚNG TÊN phân ngành cho một hiện tượng cho trước không (vd "thanh điệu → âm vị học", "chủ đề hoá → cú pháp học", "意合 → ngữ dụng/ngữ nghĩa học") — ôn lại bảng trên trước khi thi.</div>`,
  ]]);

const c8q = quiz('ltg201-quiz-8', 'Quiz 8 — Acquisition & review|||Quiz 8 — Thụ đắc & ôn tập', [
  { id: 'q1', question: 'Người Việt học tiếng Anh thường gặp khó khi chia động từ theo thì (thêm -ed, -s) — nguyên nhân sâu xa (theo chương Hình thái học) là gì?', options: ['Tiếng Việt không có động từ', 'Tiếng Việt đánh dấu thì bằng từ riêng (đã, sẽ...) chứ không bằng phụ tố như tiếng Anh', 'Tiếng Việt không có khái niệm thời gian', 'Người Việt không học ngữ pháp'], correctIndex: 1, explanation: 'Chuyển di tiêu cực: tiếng Việt đơn lập, tiếng Anh biến hình — cấu trúc không khớp nhau.' },
  { id: 'q2', question: 'Giả thuyết Sapir-Whorf phiên bản MẠNH (linguistic determinism) phát biểu điều gì, và hiện được nhìn nhận ra sao?', options: ['Ngôn ngữ chỉ ảnh hưởng nhẹ tới tư duy — được đa số chấp nhận', 'Ngôn ngữ quyết định cứng nhắc tư duy — bị đa số nhà ngôn ngữ học bác bỏ', 'Tư duy quyết định hoàn toàn ngôn ngữ', 'Ngôn ngữ và tư duy không liên quan gì nhau'], correctIndex: 1, explanation: 'Phiên bản mạnh bị bác bỏ; chỉ phiên bản yếu (tương đối luận) có một số bằng chứng.' },
  { id: 'q3', question: 'Hiện tượng trẻ em nói tiếng Quan Thoại/tiếng Việt nắm được thanh điệu rất sớm liên quan tới phân ngành nào?', options: ['Cú pháp học', 'Thụ đắc ngôn ngữ giao với ngữ âm/âm vị học', 'Xã hội ngôn ngữ học', 'Ngữ nghĩa học'], correctIndex: 1, explanation: 'Đây là hiện tượng thụ đắc ngôn ngữ (Chương 8) áp dụng lên đối tượng thanh điệu (Chương 2).' },
]);

const taiLieu = doc('ltg201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Giáo trình tham khảo (Fromkin, O’Grady, 语言学纲要), tài liệu IPA, YouTube, công cụ tra cứu, lộ trình tự học.',
  [[
    `<span class="eyebrow">LTG201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Introduction to Linguistics — sounds, words, sentences, meaning, society, change and acquisition — in one place, with Chinese/Vietnamese/English contrastive examples. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal references cited (not uploaded).</p>
<h3>📘 Cited textbooks</h3>
<ul>
<li><em>An Introduction to Language</em> — Fromkin, Rodman &amp; Hyams (the standard English-language intro-linguistics textbook).</li>
<li><em>Contemporary Linguistics: An Introduction</em> — O Grady et al.</li>
<li>《语言学纲要》(<em>Yǔyánxué Gāngyào</em>, "Outline of Linguistics") — 叶蜚声 (Ye Feisheng) et al., the standard Chinese-language linguistics textbook used across mainland Chinese universities.</li>
</ul>
<h3>📗 Official / free documentation</h3>
<ul>
<li><a href="https://linguistics.mit.edu/" target="_blank" rel="noopener">MIT Linguistics — open resources</a></li>
<li><a href="https://www.internationalphoneticassociation.org/content/full-ipa-chart" target="_blank" rel="noopener">Full IPA chart (International Phonetic Association)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Linguistic_typology" target="_blank" rel="noopener">Linguistic typology — overview</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Langfocus" target="_blank" rel="noopener">Langfocus</a> — accessible comparative linguistics, incl. Chinese &amp; Vietnamese</li>
<li><a href="https://www.youtube.com/@NativLang" target="_blank" rel="noopener">NativLang</a> — history &amp; structure of languages and writing systems</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.internationalphoneticassociation.org/IPAcharts/inter_chart_2018/IPA_2018.html" target="_blank" rel="noopener">Interactive IPA chart</a> — click a symbol to hear it</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — pinyin, tone, characters for every example in this course</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — design features, phonetics/phonology basics, morphology types, SVO &amp; phrase structure.</li>
<li><strong>Practice</strong> — for every new Chinese vocabulary word from your other courses, ask: is this isolating? tonal? a compound? Apply Chapters 2-4 to material you already study.</li>
<li><strong>Go deeper</strong> — semantics/pragmatics (意合 vs 形合), sociolinguistics (dialect vs language), typology vs family.</li>
<li><strong>Exam-ready</strong> — redo the Chapter 8 review table until you can name the right sub-field for any example instantly.</li>
</ol></div>`,
    `<span class="eyebrow">LTG201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Nhập môn Ngôn ngữ học — âm, từ, câu, nghĩa, xã hội, biến đổi và thụ đắc — gom về một chỗ, với ví dụ đối chiếu Trung/Việt/Anh. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là tài liệu tham khảo miễn phí, hợp pháp (chỉ trích dẫn, không upload).</p>
<h3>📘 Giáo trình được trích dẫn</h3>
<ul>
<li><em>An Introduction to Language</em> — Fromkin, Rodman &amp; Hyams (giáo trình nhập môn ngôn ngữ học tiếng Anh chuẩn).</li>
<li><em>Contemporary Linguistics: An Introduction</em> — O Grady và cộng sự.</li>
<li>《语言学纲要》(<em>Yǔyánxué Gāngyào</em>, "Cương yếu Ngôn ngữ học") — 叶蜚声 (Diệp Phỉ Thanh) và cộng sự, giáo trình ngôn ngữ học tiếng Trung chuẩn dùng trong các đại học Trung Quốc đại lục.</li>
</ul>
<h3>📗 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://linguistics.mit.edu/" target="_blank" rel="noopener">MIT Linguistics — tài liệu mở</a></li>
<li><a href="https://www.internationalphoneticassociation.org/content/full-ipa-chart" target="_blank" rel="noopener">Bảng IPA đầy đủ (Hiệp hội Ngữ âm Quốc tế)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Linguistic_typology" target="_blank" rel="noopener">Loại hình học ngôn ngữ — tổng quan</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Langfocus" target="_blank" rel="noopener">Langfocus</a> — ngôn ngữ học so sánh dễ hiểu, có tiếng Trung &amp; Việt</li>
<li><a href="https://www.youtube.com/@NativLang" target="_blank" rel="noopener">NativLang</a> — lịch sử &amp; cấu trúc ngôn ngữ và hệ chữ viết</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.internationalphoneticassociation.org/IPAcharts/inter_chart_2018/IPA_2018.html" target="_blank" rel="noopener">Bảng IPA tương tác</a> — bấm vào ký hiệu để nghe âm</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">Từ điển Trung MDBG</a> — pinyin, thanh điệu, chữ Hán cho mọi ví dụ trong môn</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — đặc trưng thiết kế, ngữ âm/âm vị cơ bản, các kiểu hình thái học, SVO &amp; cấu trúc cụm từ.</li>
<li><strong>Luyện tập</strong> — với mỗi từ vựng tiếng Trung mới học ở môn khác, tự hỏi: từ này đơn lập? có thanh điệu? là từ ghép? Áp dụng Chương 2-4 vào chính nội dung đang học.</li>
<li><strong>Đào sâu</strong> — ngữ nghĩa/ngữ dụng (意合 vs 形合), xã hội ngôn ngữ học (ngôn ngữ vs phương ngữ), loại hình vs ngữ hệ.</li>
<li><strong>Sẵn sàng thi</strong> — làm lại bảng ôn tập Chương 8 tới khi gọi đúng tên phân ngành cho bất kỳ ví dụ nào ngay lập tức.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'LTG201',
    slug: 'ltg201-introduction-to-linguistics',
    title: 'Introduction to linguistics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/LTG201.webp',
    shortDescription: 'The scientific study of human language — sounds, words, sentences, meaning, society, change & acquisition — with Chinese/Vietnamese/English contrastive examples throughout. 8 chapters, worked examples & quizzes.|||Nghiên cứu khoa học về ngôn ngữ — ngữ âm, từ, câu, nghĩa, xã hội, biến đổi & thụ đắc — với ví dụ đối chiếu Trung-Việt-Anh xuyên suốt. 8 chương, ví dụ & quiz mỗi chương.',
    description: 'Môn <strong>LTG201 — Introduction to Linguistics</strong> (kỳ 3, ngành Ngôn ngữ Trung) là nhập môn khoa học về <strong>ngôn ngữ loài người</strong>. Từ <strong>bản chất &amp; chức năng ngôn ngữ</strong> → <strong>ngữ âm học &amp; âm vị học</strong> (thanh điệu tiếng Trung/Việt) → <strong>hình thái học</strong> (tiếng Trung/Việt đơn lập) → <strong>cú pháp học</strong> (SVO, chủ đề hoá) → <strong>ngữ nghĩa &amp; ngữ dụng học</strong> (意合 vs 形合) → <strong>xã hội ngôn ngữ học</strong> (phương ngữ tiếng Hán) → <strong>biến đổi ngôn ngữ, ngữ hệ &amp; loại hình</strong> (Hán-Tạng vs Nam Á) → <strong>thụ đắc ngôn ngữ &amp; ngôn ngữ-tư duy</strong>. Bám giáo trình Fromkin/O Grady và 《语言学纲要》, có ví dụ đối chiếu Trung-Việt-Anh và quiz mỗi chương.',
    whatYouLearn: 'Đặc trưng & chức năng ngôn ngữ (võ đoán, dời chuyển, sản sinh); ngữ âm/IPA & âm vị học (thanh điệu ZH/VI, âm vị vs biến thể); hình thái học (đơn lập ZH/VI vs biến hình EN, ghép từ); cú pháp học (SVO, chủ đề hoá); ngữ nghĩa/ngữ dụng (đa nghĩa, hàm ý, ý hợp/hình hợp); xã hội ngôn ngữ học (phương ngữ tiếng Hán, register); ngữ hệ & loại hình (Hán-Tạng vs Nam Á); thụ đắc ngôn ngữ & giả thuyết Sapir-Whorf.',
    requirements: 'Không yêu cầu kiến thức ngôn ngữ học trước đó. Nên đang học hoặc đã học tiếng Trung sơ cấp để theo được các ví dụ đối chiếu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình tham khảo, tài liệu chính thức, YouTube, công cụ, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Ngôn ngữ học là gì, vì sao quan trọng cho ngành Ngôn ngữ Trung.', lessons: [intro] },
    { title: 'Chương 1 — Ngôn ngữ là gì?|||Chapter 1 — What is language?', description: 'Đặc trưng thiết kế & chức năng ngôn ngữ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ngữ âm & âm vị học|||Chapter 2 — Phonetics & phonology', description: 'IPA, thanh điệu tiếng Trung/Việt, âm vị vs biến thể.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hình thái học|||Chapter 3 — Morphology', description: 'Hình vị, biến hình vs đơn lập, ghép từ tiếng Trung/Việt.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Cú pháp học|||Chapter 4 — Syntax', description: 'Thành tố, trật tự từ SVO, chủ đề hoá trong tiếng Trung/Việt.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Ngữ nghĩa & ngữ dụng học|||Chapter 5 — Semantics & pragmatics', description: 'Nghĩa từ vựng, hàm ý, ý hợp vs hình hợp.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ngôn ngữ & xã hội|||Chapter 6 — Language & society', description: 'Phương ngữ, sociolect, register, ngôn ngữ chuẩn.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Biến đổi, ngữ hệ & loại hình|||Chapter 7 — Change, family & typology', description: 'Ngữ hệ Hán-Tạng/Nam Á/Ấn-Âu, loại hình đơn lập/chắp dính/hoà kết.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Thụ đắc & ôn tập|||Chapter 8 — Acquisition & review', description: 'Thụ đắc ngôn ngữ, ngôn ngữ & tư duy, tổng kết 8 chương.', lessons: [c8, c8q] },
  ],
};
