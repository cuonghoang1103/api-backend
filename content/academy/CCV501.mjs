/**
 * CCV501 — Contrastive Linguistics: Chinese–Vietnamese (Ngôn ngữ học Đối chiếu
 * Trung - Việt). Ngành Ngôn ngữ Trung, Kỳ 7, trình độ cao.
 * Trích dẫn tham khảo (KHÔNG upload PDF): "对比语言学" (Contrastive Linguistics);
 * "Ngôn ngữ học đối chiếu" (Bùi Mạnh Hùng); "汉越语对比研究".
 * 8 chương đối chiếu: (1) tổng quan & phương pháp, (2) ngữ âm/thanh điệu,
 * (3) từ vựng & lớp từ Hán-Việt, (4) cấu tạo từ, (5) ngữ pháp (trật tự từ,
 * hư từ, lượng từ), (6) cú pháp câu, (7) ngữ dụng & văn hoá, (8) ứng dụng —
 * lỗi giao thoa, dạy-dịch & ôn tập.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('ccv501-1-1-overview-method', '1.1 — Contrastive linguistics: aims & method|||1.1 — Ngôn ngữ học đối chiếu: mục tiêu & phương pháp',
  'Ngôn ngữ học đối chiếu là gì; khác so sánh-lịch sử ra sao; ba bước của Lado (miêu tả – đối lập – so sánh); vì sao Trung-Việt là cặp đối chiếu tự nhiên dù khác ngữ hệ.',
  [[
    `<span class="eyebrow">CCV501 · Chapter 1 · Lesson 1.1</span>
<h2>What is contrastive linguistics?</h2>
<p class="lead"><strong>Contrastive linguistics</strong> (对比语言学 duìbǐ yǔyánxué) systematically compares two (or more) languages — here <strong>Chinese</strong> and <strong>Vietnamese</strong> — at every level (phonology, lexicon, grammar, pragmatics) to find <em>similarities</em> and <em>differences</em>, and to explain why learners of one make certain errors in the other.</p>
<h3>Contrastive vs. comparative linguistics</h3>
<ul>
<li><strong>Comparative linguistics</strong> is <em>diachronic</em> and <em>genetic</em>: it reconstructs a common ancestor of related languages (e.g. Chinese within Sino-Tibetan).</li>
<li><strong>Contrastive linguistics</strong> is <em>synchronic</em>: it compares languages as they are today, whether or not they are related. Chinese and Vietnamese belong to <em>different</em> families yet are compared constantly — because centuries of contact and typological similarity make the comparison useful.</li>
</ul>
<h3>Method: Lado's three steps</h3>
<p>Robert Lado's Contrastive Analysis Hypothesis (CAH) proposes: <strong>(1) description</strong> — describe each language on its own terms; <strong>(2) juxtaposition</strong> — line up equivalent units; <strong>(3) comparison</strong> — state the similarities/differences and predict learning difficulty (structures that differ most predict the most learner errors).</p>
<pre><code>Typology at a glance:
             Chinese (汉语)          Vietnamese (tiếng Việt)
 Family      Sino-Tibetan            Austroasiatic
 Morphology  isolating/analytic      isolating/analytic
 Syllable    tends monosyllabic      tends monosyllabic
 Tones       4 (+ neutral tone)      6
 Word order  SVO, modifier+noun      SVO, noun+modifier
</code></pre>
<div class="callout"><span class="badge">Why compare these two</span> Chinese and Vietnamese are genetically unrelated but typologically alike — both isolating, tonal, monosyllabic-morpheme languages — which is exactly what makes their differences (word order, tone count, classifiers) so visible and so often the source of learner error.</div>`,
    `<span class="eyebrow">CCV501 · Chương 1 · Bài 1.1</span>
<h2>Ngôn ngữ học đối chiếu là gì?</h2>
<p class="lead"><strong>Ngôn ngữ học đối chiếu</strong> (对比语言学 duìbǐ yǔyánxué) so sánh có hệ thống hai (hay nhiều) ngôn ngữ — ở đây là <strong>tiếng Trung</strong> và <strong>tiếng Việt</strong> — trên mọi bình diện (ngữ âm, từ vựng, ngữ pháp, ngữ dụng) để tìm ra <em>điểm giống</em> và <em>điểm khác</em>, từ đó giải thích vì sao người học ngôn ngữ này hay mắc lỗi khi dùng ngôn ngữ kia.</p>
<h3>Đối chiếu (contrastive) khác so sánh lịch sử (comparative) thế nào</h3>
<ul>
<li><strong>Ngôn ngữ học so sánh - lịch sử (comparative)</strong> mang tính <em>lịch đại</em> và <em>cội nguồn</em>: phục dựng ngôn ngữ gốc chung của các ngôn ngữ có quan hệ họ hàng (vd tiếng Hán trong ngữ hệ Hán-Tạng).</li>
<li><strong>Ngôn ngữ học đối chiếu (contrastive)</strong> mang tính <em>đồng đại</em>: so sánh các ngôn ngữ ở trạng thái hiện tại, bất kể có họ hàng hay không. Tiếng Trung và tiếng Việt thuộc hai ngữ hệ <em>khác nhau</em> (Hán-Tạng và Nam Á) nhưng vẫn được đối chiếu liên tục — vì hàng thế kỷ tiếp xúc và sự tương đồng loại hình khiến việc so sánh rất hữu ích.</li>
</ul>
<h3>Phương pháp: ba bước của Lado</h3>
<p>Giả thuyết Phân tích đối chiếu (Contrastive Analysis Hypothesis - CAH) của Robert Lado gồm: <strong>(1) miêu tả</strong> — miêu tả từng ngôn ngữ theo đúng bản chất của nó; <strong>(2) đối lập/xếp cạnh</strong> — đặt các đơn vị tương đương cạnh nhau; <strong>(3) so sánh</strong> — nêu điểm giống/khác và dự đoán độ khó khi học (cấu trúc càng khác nhau càng dễ gây lỗi cho người học).</p>
<pre><code>Loại hình nhìn nhanh:
             Tiếng Trung (汉语)       Tiếng Việt
 Ngữ hệ      Hán - Tạng               Nam Á (Austroasiatic)
 Hình thái   đơn lập/phân tích tính   đơn lập/phân tích tính
 Âm tiết     thiên về đơn âm tiết     thiên về đơn âm tiết
 Thanh điệu  4 thanh (+ khinh thanh)  6 thanh
 Trật tự từ  SVO, định ngữ+danh từ    SVO, danh từ+định ngữ
</code></pre>
<div class="callout"><span class="badge">Vì sao đối chiếu đúng cặp này</span> Tiếng Trung và tiếng Việt không cùng ngữ hệ nhưng giống nhau về loại hình — đều đơn lập, có thanh điệu, hình vị đơn âm tiết — chính điều đó khiến những chỗ khác nhau (trật tự từ, số lượng thanh, lượng từ) càng dễ thấy và càng hay là nguồn gây lỗi cho người học.</div>`,
  ]]);

const c1q = quiz('ccv501-quiz-1', 'Quiz 1 — Aims & method|||Quiz 1 — Mục tiêu & phương pháp', [
  { id: 'q1', question: 'Ngôn ngữ học đối chiếu (contrastive linguistics) mang tính chất nào?', options: ['Lịch đại và cội nguồn', 'Đồng đại, so sánh trạng thái hiện tại', 'Chỉ so sánh ngôn ngữ cùng họ', 'Chỉ nghiên cứu ngữ âm'], correctIndex: 1, explanation: 'Đối chiếu là đồng đại — so sánh các ngôn ngữ ở trạng thái hiện tại, bất kể có họ hàng hay không.' },
  { id: 'q2', question: 'Ba bước trong phương pháp của Lado là gì?', options: ['Miêu tả – Đối lập – So sánh', 'Nghe – Nói – Đọc', 'Dịch – Học – Kiểm tra', 'Ngữ âm – Từ vựng – Ngữ pháp'], correctIndex: 0, explanation: 'CAH của Lado: miêu tả từng ngôn ngữ, xếp cạnh đơn vị tương đương, rồi so sánh để dự đoán lỗi.' },
  { id: 'q3', question: 'Điểm chung về loại hình giữa tiếng Trung và tiếng Việt là gì?', options: ['Cùng ngữ hệ Hán-Tạng', 'Đều là ngôn ngữ đơn lập, có thanh điệu', 'Đều biến đổi hình thái qua đuôi từ', 'Không có điểm chung nào'], correctIndex: 1, explanation: 'Dù khác ngữ hệ, cả hai đều đơn lập/phân tích tính, có thanh điệu, hình vị đơn âm tiết.' },
]);

const c2 = doc('ccv501-2-1-phonology-tones', '2.1 — Phonology: Mandarin 4 tones vs Vietnamese 6 tones|||2.1 — Ngữ âm: 4 thanh tiếng Trung vs 6 thanh tiếng Việt',
  'Cấu trúc âm tiết; kho thanh điệu 4 thanh (Chao) vs 6 thanh; không ánh xạ 1-1; lỗi thường gặp khi học chéo.',
  [[
    `<span class="eyebrow">CCV501 · Chapter 2 · Lesson 2.1</span>
<h2>Phonology: tone systems in contrast</h2>
<h3>Syllable structure</h3>
<p>Both languages build words from <strong>tightly-structured monosyllables</strong>: a Mandarin syllable = (Initial)+(Medial glide)+Final vowel/nasal+<strong>Tone</strong>; a Vietnamese syllable = Initial consonant+(glide)+Vowel nucleus+(Final consonant, incl. glottal stop /ʔ/)+<strong>Tone</strong>. Neither language allows the consonant clusters or codas common in English.</p>
<h3>Tone inventories</h3>
<pre><code>Mandarin — 4 tones (+ neutral/轻声), Chao letters (5 = high pitch):
 T1 mā  55   (level, high)     — 妈 "mẹ"
 T2 má  35   (rising)          — 麻 "cây gai"
 T3 mǎ  214  (dipping/low)     — 马 "ngựa"
 T4 mà  51   (falling)         — 骂 "mắng"

Vietnamese — 6 thanh:
 ngang  33    level                  — ma  "con ma"
 huyền  21    low falling            — mà  "liên từ mà"
 sắc    24/35 rising                 — má  "gò má"
 hỏi    313   dipping-rising         — mả  "ngôi mả"
 ngã    35(broken) rising-glottalized — mã "mã số"
 nặng   21(glottal) low-glottal      — mạ  "cây mạ"
</code></pre>
<p>Both languages use pitch to distinguish otherwise-identical syllables — mā/má/mǎ/mà in Mandarin vs ma/mà/má/mả/mã/mạ in Vietnamese is the textbook minimal-set example on both sides. But the <strong>mapping is not 1-to-1</strong>: Vietnamese has two more contrastive tones, and two of them (ngã, nặng) add a <em>glottalized/creaky</em> quality that Mandarin tones never have.</p>
<h3>Consequence for learners</h3>
<p>A Vietnamese learner of Mandarin must <em>merge</em> six tone categories into four; a Chinese learner of Vietnamese must <em>split</em> Mandarin's tone space into six, and additionally produce a glottal stop for nặng and creaky voice for ngã — sounds absent from Mandarin.</p>
<div class="callout"><span class="badge">Common error</span> Chinese learners often flatten <strong>ngã</strong> toward <strong>sắc</strong> and <strong>nặng</strong> toward <strong>huyền</strong>, because Mandarin has no glottalized tone to map them onto.</div>`,
    `<span class="eyebrow">CCV501 · Chương 2 · Bài 2.1</span>
<h2>Ngữ âm: đối chiếu hệ thống thanh điệu</h2>
<h3>Cấu trúc âm tiết</h3>
<p>Cả hai ngôn ngữ đều dựng từ những <strong>âm tiết có cấu trúc chặt</strong>: âm tiết tiếng Trung = (thanh mẫu/phụ âm đầu)+(âm đệm)+nguyên âm/vần cuối mũi+<strong>thanh điệu</strong>; âm tiết tiếng Việt = phụ âm đầu+(âm đệm)+âm chính (nguyên âm)+(âm cuối, kể cả tắc thanh hầu /ʔ/)+<strong>thanh điệu</strong>. Cả hai đều không cho phép tổ hợp phụ âm đầu/cuối phức tạp như tiếng Anh.</p>
<h3>Kho thanh điệu</h3>
<pre><code>Tiếng Trung — 4 thanh (+ khinh thanh/轻声), ký hiệu Chao (5=cao nhất):
 T1 mā  55   (ngang, cao)        — 妈 "mẹ"
 T2 má  35   (đi lên)            — 麻 "cây gai"
 T3 mǎ  214  (trũng xuống-lên)   — 马 "ngựa"
 T4 mà  51   (đi xuống)          — 骂 "mắng"

Tiếng Việt — 6 thanh:
 ngang  33     bằng phẳng             — ma  "con ma"
 huyền  21     đi xuống thấp          — mà  "liên từ mà"
 sắc    24/35  đi lên                 — má  "gò má"
 hỏi    313    trũng rồi lên          — mả  "ngôi mả"
 ngã    35(gãy) lên kèm nghẹn         — mã  "mã số"
 nặng   21(tắc) thấp kèm tắc hầu      — mạ  "cây mạ"
</code></pre>
<p>Cả hai ngôn ngữ dùng cao độ để phân biệt các âm tiết vốn giống hệt nhau về phụ âm/nguyên âm — mā/má/mǎ/mà trong tiếng Trung và ma/mà/má/mả/mã/mạ trong tiếng Việt đều là ví dụ kinh điển kiểu này. Nhưng <strong>không có ánh xạ 1-1</strong>: tiếng Việt có thêm hai thanh, và hai trong số đó (ngã, nặng) mang thêm chất giọng <em>nghẹn/tắc thanh hầu</em> mà tiếng Trung hoàn toàn không có.</p>
<h3>Hệ quả cho người học</h3>
<p>Người Việt học tiếng Trung phải <em>gộp</em> sáu phạm trù thanh điệu lại còn bốn; người Trung học tiếng Việt phải <em>tách</em> không gian thanh điệu ra thành sáu, và còn phải tạo tắc thanh hầu cho thanh nặng, giọng nghẹn cho thanh ngã — những âm sắc không tồn tại trong tiếng Trung.</p>
<div class="callout"><span class="badge">Lỗi thường gặp</span> Người Trung học tiếng Việt hay đọc lẫn <strong>ngã</strong> thành <strong>sắc</strong> và <strong>nặng</strong> thành <strong>huyền</strong>, vì tiếng Trung không có thanh điệu nghẹn để họ ánh xạ vào.</div>`,
  ]]);

const c2q = quiz('ccv501-quiz-2', 'Quiz 2 — Tone systems|||Quiz 2 — Hệ thống thanh điệu', [
  { id: 'q1', question: 'Tiếng Trung phổ thông có bao nhiêu thanh điệu cơ bản (chưa tính khinh thanh)?', options: ['3', '4', '5', '6'], correctIndex: 1, explanation: 'Tiếng Trung phổ thông có 4 thanh cơ bản (T1-T4), cộng khinh thanh không tính là thanh riêng.' },
  { id: 'q2', question: 'Tiếng Việt có bao nhiêu thanh điệu?', options: ['4', '5', '6', '7'], correctIndex: 2, explanation: 'Tiếng Việt chuẩn có 6 thanh: ngang, huyền, sắc, hỏi, ngã, nặng.' },
  { id: 'q3', question: 'Vì sao người Trung học tiếng Việt hay đọc sai thanh ngã/nặng?', options: ['Vì tiếng Việt không có phụ âm đầu', 'Vì tiếng Trung không có thanh điệu mang chất tắc thanh hầu/nghẹn giọng', 'Vì tiếng Việt không dùng thanh điệu', 'Vì tiếng Trung có nhiều thanh hơn tiếng Việt'], correctIndex: 1, explanation: 'Ngã và nặng có chất giọng nghẹn/tắc thanh hầu — thứ tiếng Trung hoàn toàn không có nên khó ánh xạ.' },
]);

const c3 = doc('ccv501-3-1-sino-vietnamese-lexicon', '3.1 — Lexicon: the Sino-Vietnamese layer (汉越词)|||3.1 — Từ vựng: lớp từ Hán-Việt (汉越词)',
  '60-70% từ vựng tiếng Việt gốc Hán; âm Hán Việt cố định theo từng chữ; hai lớp từ song song (thuần Việt/Hán Việt); bẫy "bạn giả".',
  [[
    `<span class="eyebrow">CCV501 · Chapter 3 · Lesson 3.1</span>
<h2>Lexicon: the Sino-Vietnamese layer (汉越词)</h2>
<p class="lead">An estimated <strong>60-70% of Vietnamese vocabulary</strong> has a Chinese origin, read with a fixed, regular Vietnamese pronunciation of each Chinese character — the <strong>Sino-Vietnamese reading</strong> (âm Hán Việt). This is not casual borrowing but a whole parallel reading system, fossilized from Middle Chinese roughly a thousand years ago, still productive in law, science, and formal registers today.</p>
<h3>Character-by-character correspondence</h3>
<pre><code>汉字   pinyin    âm Hán Việt   nghĩa thuần Việt
天     tiān      thiên         trời
地     dì        địa           đất
人     rén       nhân          người
山     shān      sơn           núi
水     shuǐ      thuỷ          nước

国家   guójiā    quốc gia      đất nước
文化   wénhuà    văn hoá       (không có từ thuần Việt gọn tương đương)
经济   jīngjì    kinh tế       (không có từ thuần Việt gọn tương đương)
历史   lìshǐ     lịch sử       chuyện xưa
</code></pre>
<h3>Two parallel vocabularies</h3>
<p>Vietnamese speakers usually command <strong>two words for one concept</strong>: a native (thuần Việt) word, colloquial and concrete, and a Sino-Vietnamese word, more formal/abstract — mirroring how English pairs a Germanic word with a Latin/Greek one (<em>ask</em> vs <em>inquire</em>). Compare 母親 mǔqīn "mẹ" (native) / "mẫu thân" (Sino-Vietnamese, literary); the Chinese word itself supplies the formal register directly.</p>
<div class="callout"><span class="badge">False friends</span> Not every Sino-Vietnamese reading keeps the modern Chinese meaning. <strong>老婆</strong> lǎopó means "wife" (informal) in modern Mandarin, but its Sino-Vietnamese reading <strong>"lão bà"</strong> means "old woman" in Vietnamese — same characters, drifted meaning. Contrastive lexicon work must check <em>current</em> meaning on both sides, never just the reading.</div>`,
    `<span class="eyebrow">CCV501 · Chương 3 · Bài 3.1</span>
<h2>Từ vựng: lớp từ Hán-Việt (汉越词)</h2>
<p class="lead">Ước tính <strong>60-70% từ vựng tiếng Việt</strong> có gốc Hán, được đọc theo một cách phát âm tiếng Việt cố định, có quy luật cho từng chữ Hán — gọi là <strong>âm Hán Việt</strong>. Đây không phải vay mượn tuỳ tiện mà là cả một hệ thống đọc song song, hoá thạch từ tiếng Hán trung cổ khoảng một nghìn năm trước, và vẫn còn sinh sản trong luật pháp, khoa học, văn phong trang trọng ngày nay.</p>
<h3>Đối ứng từng chữ Hán</h3>
<pre><code>汉字   pinyin    âm Hán Việt   nghĩa thuần Việt
天     tiān      thiên         trời
地     dì        địa           đất
人     rén       nhân          người
山     shān      sơn           núi
水     shuǐ      thuỷ          nước

国家   guójiā    quốc gia      đất nước
文化   wénhuà    văn hoá       (không có từ thuần Việt gọn tương đương)
经济   jīngjì    kinh tế       (không có từ thuần Việt gọn tương đương)
历史   lìshǐ     lịch sử       chuyện xưa
</code></pre>
<h3>Hai lớp từ vựng song song</h3>
<p>Người Việt thường có <strong>hai từ cho một khái niệm</strong>: một từ thuần Việt, khẩu ngữ và cụ thể, và một từ Hán Việt, trang trọng/trừu tượng hơn — giống cách tiếng Anh có cặp từ gốc Germanic và gốc Latin/Hy Lạp (<em>ask</em> so với <em>inquire</em>). So sánh 母親 mǔqīn "mẹ" (thuần Việt) / "mẫu thân" (Hán Việt, văn chương); bản thân từ tiếng Trung đã trực tiếp mang sắc thái trang trọng đó.</p>
<div class="callout"><span class="badge">Bẫy "bạn giả" (false friends)</span> Không phải âm Hán Việt nào cũng giữ nguyên nghĩa tiếng Trung hiện đại. <strong>老婆</strong> lǎopó trong tiếng Trung hiện đại nghĩa là "vợ" (thân mật), nhưng đọc theo âm Hán Việt <strong>"lão bà"</strong> trong tiếng Việt lại nghĩa là "bà già" — cùng chữ Hán, nghĩa đã trôi dạt. Khi đối chiếu từ vựng phải luôn kiểm nghĩa <em>hiện hành</em> ở cả hai bên, không chỉ dựa vào cách đọc.</div>`,
  ]]);

const c3q = quiz('ccv501-quiz-3', 'Quiz 3 — Sino-Vietnamese lexicon|||Quiz 3 — Từ Hán-Việt', [
  { id: 'q1', question: 'Âm Hán Việt là gì?', options: ['Tiếng Trung hiện đại', 'Cách đọc tiếng Việt cố định cho từng chữ Hán, hoá thạch từ tiếng Hán trung cổ', 'Phương ngữ Quảng Đông', 'Chữ Nôm'], correctIndex: 1, explanation: 'Âm Hán Việt là hệ thống đọc song song, cố định theo từng chữ Hán, còn dùng đến nay.' },
  { id: 'q2', question: 'Khoảng bao nhiêu phần trăm từ vựng tiếng Việt có gốc Hán?', options: ['10-20%', '30-40%', '60-70%', '90-100%'], correctIndex: 2, explanation: 'Ước tính khoảng 60-70% từ vựng tiếng Việt có gốc Hán (lớp từ Hán-Việt).' },
  { id: 'q3', question: '老婆 (lǎopó) nghĩa là "vợ" trong tiếng Trung hiện đại, nhưng âm Hán Việt "lão bà" trong tiếng Việt nghĩa là gì?', options: ['Cùng nghĩa "vợ" — không đổi', '"Bà già" — bẫy từ giả (false friend), nghĩa đã trôi dạt', 'Không có âm Hán Việt cho từ này', '"Ông già"'], correctIndex: 1, explanation: 'Cùng chữ Hán nhưng nghĩa đã trôi dạt: tiếng Trung "vợ", âm Hán Việt lại thành "bà già".' },
]);

const c4 = doc('ccv501-4-1-word-formation', '4.1 — Word formation: compounding & reduplication|||4.1 — Cấu tạo từ: từ ghép & từ láy',
  'Từ ghép chính-phụ đảo trật tự (định ngữ+trung tâm vs trung tâm+định ngữ); từ ghép đẳng lập song song; từ lặp tiếng Trung vs từ láy tiếng Việt.',
  [[
    `<span class="eyebrow">CCV501 · Chapter 4 · Lesson 4.1</span>
<h2>Word formation: compounding &amp; reduplication</h2>
<h3>Compound order: the mirror-image rule</h3>
<p>Both languages build most new words by <strong>compounding</strong> two morphemes, but the <strong>internal order flips</strong>: Chinese modifier-head compounds put the modifier <em>first</em> (偏正式), while the equivalent Vietnamese compound puts the head noun <em>first</em>, modifier after.</p>
<pre><code>Chinese (modifier + head)     Vietnamese (head + modifier)
红花  hónghuā  "red-flower"    hoa đỏ    "flower-red"
电脑  diànnǎo  "electric-brain" máy tính  "machine-compute" (calque, reordered)
飞机  fēijī    "fly-machine"   máy bay   "machine-fly"     (reordered)
黑板  hēibǎn   "black-board"   bảng đen  "board-black"
</code></pre>
<p>Coordinate compounds (联合式, two near-synonyms joined) exist symmetrically in both: 朋友 péngyou "bạn bè" (friend-friend), 房屋 fángwū "nhà cửa" (house-house) — order is fixed by convention in each language, not by grammar rules.</p>
<h3>Reduplication (叠词 vs từ láy)</h3>
<p>Chinese reduplication (AA, ABB) mostly repeats an existing free morpheme to add a grammatical/semantic nuance — distributive "each", intensification, or a diminutive/affectionate tone: 天天 tiāntiān "ngày ngày/mỗi ngày", 高高兴兴 gāogāoxìngxìng "vui vẻ".</p>
<p>Vietnamese <strong>từ láy</strong> is a much larger, more productive class: full reduplication (láy toàn bộ: <em>xa xa</em>, <em>đo đỏ</em>) and partial reduplication (láy bộ phận, sharing only the initial consonant or the rhyme: <em>lấp lánh</em>, <em>bâng khuâng</em>) — many từ láy have <strong>no free-standing base morpheme</strong> at all, a pattern Chinese reduplication does not have.</p>
<div class="callout"><span class="badge">Contrastive point</span> Getting compound word order backwards (saying "*đỏ hoa" instead of "hoa đỏ") is one of the most persistent errors Chinese-speaking learners of Vietnamese make — and the mirror-image error happens to Vietnamese speakers learning Chinese.</div>`,
    `<span class="eyebrow">CCV501 · Chương 4 · Bài 4.1</span>
<h2>Cấu tạo từ: từ ghép &amp; từ láy</h2>
<h3>Trật tự từ ghép: quy luật soi gương</h3>
<p>Cả hai ngôn ngữ tạo từ mới chủ yếu bằng cách <strong>ghép hai hình vị</strong>, nhưng <strong>trật tự bên trong bị đảo ngược</strong>: từ ghép chính-phụ tiếng Trung đặt định ngữ <em>trước</em> (偏正式), còn từ ghép tương đương trong tiếng Việt đặt danh từ trung tâm <em>trước</em>, định ngữ theo sau.</p>
<pre><code>Tiếng Trung (định ngữ + trung tâm)   Tiếng Việt (trung tâm + định ngữ)
红花  hónghuā  "đỏ-hoa"               hoa đỏ    "hoa-đỏ"
电脑  diànnǎo  "điện-não"             máy tính  "máy-tính" (dịch phỏng, đảo trật tự)
飞机  fēijī    "bay-máy"              máy bay   "máy-bay"  (đảo trật tự)
黑板  hēibǎn   "đen-bảng"             bảng đen  "bảng-đen"
</code></pre>
<p>Từ ghép đẳng lập (联合式, ghép hai từ gần nghĩa) tồn tại đối xứng ở cả hai ngôn ngữ: 朋友 péngyou "bạn bè" (bạn-bạn), 房屋 fángwū "nhà cửa" (nhà-nhà) — trật tự do quy ước riêng từng ngôn ngữ, không do quy tắc ngữ pháp chung.</p>
<h3>Từ láy (叠词 vs từ láy)</h3>
<p>Từ lặp tiếng Trung (dạng AA, ABB) chủ yếu lặp lại một hình vị tự do sẵn có để thêm sắc thái ngữ pháp/ngữ nghĩa — phân bố "mỗi", nhấn mạnh, hay sắc thái nhỏ nhẹ/thân mật: 天天 tiāntiān "ngày ngày/mỗi ngày", 高高兴兴 gāogāoxìngxìng "vui vẻ".</p>
<p>Tiếng Việt có lớp <strong>từ láy</strong> lớn hơn và sinh sản nhiều hơn hẳn: láy toàn bộ (<em>xa xa</em>, <em>đo đỏ</em>) và láy bộ phận (chỉ giữ phụ âm đầu hoặc phần vần: <em>lấp lánh</em>, <em>bâng khuâng</em>) — rất nhiều từ láy <strong>không có hình vị gốc đứng độc lập</strong>, kiểu này tiếng Trung không có.</p>
<div class="callout"><span class="badge">Điểm đối chiếu</span> Đảo ngược trật tự từ ghép (nói "*đỏ hoa" thay vì "hoa đỏ") là một trong những lỗi dai dẳng nhất của người nói tiếng Trung học tiếng Việt — và lỗi soi gương y hệt xảy ra với người Việt học tiếng Trung.</div>`,
  ]]);

const c4q = quiz('ccv501-quiz-4', 'Quiz 4 — Word formation|||Quiz 4 — Cấu tạo từ', [
  { id: 'q1', question: 'Từ ghép chính-phụ 红花 (hónghuā) trong tiếng Trung đặt định ngữ ở đâu so với trung tâm?', options: ['Sau trung tâm', 'Trước trung tâm', 'Không có trật tự cố định', 'Chỉ dùng độc lập'], correctIndex: 1, explanation: 'Từ ghép chính-phụ tiếng Trung (偏正式) đặt định ngữ trước, trung tâm sau: 红(đỏ)+花(hoa).' },
  { id: 'q2', question: "Từ ghép tương đương trong tiếng Việt (vd 'hoa đỏ') đặt trung tâm ở đâu?", options: ['Sau định ngữ', 'Trước định ngữ', 'Giữa hai định ngữ', 'Không có trung tâm'], correctIndex: 1, explanation: 'Tiếng Việt đảo ngược trật tự: trung tâm (hoa) đứng trước, định ngữ (đỏ) đứng sau.' },
  { id: 'q3', question: 'Đặc điểm nào của từ láy tiếng Việt mà từ lặp tiếng Trung KHÔNG có?', options: ['Luôn có nghĩa nhấn mạnh', 'Nhiều từ láy không có hình vị gốc đứng độc lập', 'Luôn là danh từ', 'Luôn viết bằng chữ Hán'], correctIndex: 1, explanation: 'Từ láy tiếng Việt (vd "bâng khuâng") thường không có hình vị gốc mang nghĩa riêng — từ lặp tiếng Trung luôn dựa trên một hình vị tự do có sẵn.' },
]);

const c5 = doc('ccv501-5-1-grammar-order-classifiers', '5.1 — Grammar: word order, function words & classifiers|||5.1 — Ngữ pháp: trật tự từ, hư từ & lượng từ',
  'Cụm sở hữu đảo trật tự (的/của); lượng từ — nét chung hiếm nhưng không khớp 1-1; thể (aspect) 了 vs đã/rồi.',
  [[
    `<span class="eyebrow">CCV501 · Chapter 5 · Lesson 5.1</span>
<h2>Grammar: word order, function words &amp; classifiers</h2>
<h3>Possessive phrases: another mirror</h3>
<pre><code>Chinese:     我 的  书       (I - DE - book)
Vietnamese:  sách của tôi   (book - of - I)
</code></pre>
<p>The possessive marker <strong>的 de</strong> and Vietnamese <strong>của</strong> play the same grammatical role, but the whole phrase is reversed — consistent with the modifier-before-head (Chinese) vs. head-before-modifier (Vietnamese) pattern already seen in compounds.</p>
<h3>Classifiers — a shared, rare typological feature</h3>
<p>Both languages require a <strong>classifier / measure word</strong> (量词 liàngcí / loại từ) between a number and a noun — a feature most European languages lack entirely:</p>
<pre><code>一个人   yí gè rén    một người       (个/cái~người: person)
一本书   yì běn shū   một quyển sách  (本/quyển: bound volume)
一只猫   yì zhī māo   một con mèo     (只/con: animal)
一张桌子 yì zhāng zhuōzi một cái bàn  (张/cái: flat/table)
</code></pre>
<p>The system exists on both sides, but the <strong>choice of classifier for a given noun rarely matches</strong> one-to-one, so learners must memorize new noun-classifier pairs rather than just translate 个 → cái.</p>
<h3>Aspect vs. tense: 了 le and đã/rồi</h3>
<p>Neither language marks tense on the verb; both mark <strong>aspect</strong> instead. Mandarin <strong>了 le</strong> marks a completed action/change of state; Vietnamese splits this into <strong>đã</strong> (before the verb, completion) and <strong>rồi</strong> (after the clause, "already"), which can co-occur (đã ăn rồi).</p>
<div class="callout"><span class="badge">Common error</span> Learners often insert a 了-equivalent after every Vietnamese "đã/rồi" they try to translate, over-marking aspect where Mandarin would leave the verb bare (e.g. in habitual or future contexts).</div>`,
    `<span class="eyebrow">CCV501 · Chương 5 · Bài 5.1</span>
<h2>Ngữ pháp: trật tự từ, hư từ &amp; lượng từ</h2>
<h3>Cụm sở hữu: lại một tấm gương nữa</h3>
<pre><code>Tiếng Trung:  我 的  书       (tôi - CỦA - sách)
Tiếng Việt:   sách của tôi   (sách - của - tôi)
</code></pre>
<p>Trợ từ sở hữu <strong>的 de</strong> và <strong>của</strong> trong tiếng Việt giữ cùng vai trò ngữ pháp, nhưng cả cụm bị đảo ngược — khớp với khuôn mẫu định ngữ-trước-trung tâm (tiếng Trung) và trung tâm-trước-định ngữ (tiếng Việt) đã thấy ở từ ghép.</p>
<h3>Lượng từ — nét chung hiếm gặp về loại hình</h3>
<p>Cả hai ngôn ngữ đều bắt buộc có <strong>lượng từ/loại từ</strong> (量词 liàngcí / loại từ) đứng giữa số từ và danh từ — đặc điểm mà đa số ngôn ngữ châu Âu hoàn toàn không có:</p>
<pre><code>一个人   yí gè rén    một người       (个/cái~người: chỉ người)
一本书   yì běn shū   một quyển sách  (本/quyển: vật có tập)
一只猫   yì zhī māo   một con mèo     (只/con: động vật)
一张桌子 yì zhāng zhuōzi một cái bàn  (张/cái: vật phẳng/bàn)
</code></pre>
<p>Hệ thống này tồn tại ở cả hai bên, nhưng <strong>lượng từ được chọn cho một danh từ cụ thể hiếm khi khớp 1-1</strong>, nên người học phải học thuộc từng cặp danh từ-lượng từ mới, chứ không thể dịch máy móc 个 → cái.</p>
<h3>Thể (aspect) khác thì (tense): 了 le và đã/rồi</h3>
<p>Cả hai ngôn ngữ đều không đánh dấu thì trên động từ; cả hai đánh dấu <strong>thể (aspect)</strong> thay vào đó. <strong>了 le</strong> trong tiếng Trung đánh dấu hành động hoàn thành/thay đổi trạng thái; tiếng Việt tách việc này thành <strong>đã</strong> (trước động từ, chỉ hoàn thành) và <strong>rồi</strong> (cuối câu, "đã xong"), hai từ này có thể cùng xuất hiện (đã ăn rồi).</p>
<div class="callout"><span class="badge">Lỗi thường gặp</span> Người học hay chèn tương đương của 了 sau mỗi từ "đã/rồi" họ định dịch, đánh dấu thể quá mức ở những chỗ tiếng Trung lẽ ra để động từ trần (như ngữ cảnh thói quen hoặc tương lai).</div>`,
  ]]);

const c5q = quiz('ccv501-quiz-5', 'Quiz 5 — Word order & classifiers|||Quiz 5 — Trật tự từ & lượng từ', [
  { id: 'q1', question: "Trong cụm sở hữu, trật tự tiếng Trung '我的书' so với tiếng Việt 'sách của tôi' như thế nào?", options: ['Giống hệt nhau', 'Đảo ngược nhau, do định ngữ và trung tâm đổi chỗ', 'Tiếng Việt không có từ sở hữu', 'Tiếng Trung không dùng trợ từ sở hữu'], correctIndex: 1, explanation: "'我的书' = tôi-của-sách, 'sách của tôi' = sách-của-tôi — cả cụm đảo ngược nhau." },
  { id: 'q2', question: 'Lượng từ (量词/loại từ) là đặc điểm ngữ pháp như thế nào?', options: ['Chỉ có ở tiếng Trung', 'Chỉ có ở tiếng Việt', 'Có ở cả hai ngôn ngữ nhưng cách chọn không khớp 1-1', 'Không tồn tại ở ngôn ngữ nào'], correctIndex: 2, explanation: 'Cả hai đều bắt buộc dùng lượng từ, nhưng lượng từ cho từng danh từ hiếm khi khớp nhau 1-1.' },
  { id: 'q3', question: '了 (le) trong tiếng Trung tương ứng gần nhất với cặp từ nào trong tiếng Việt?', options: ['Của/mà', 'Đã/rồi', 'Không/chưa', 'Rất/quá'], correctIndex: 1, explanation: '了 đánh dấu hoàn thành/thay đổi trạng thái, tương ứng với đã (trước động từ) và rồi (cuối câu) trong tiếng Việt.' },
]);

const c6 = doc('ccv501-6-1-syntax-topic-comparison-passive', '6.1 — Syntax: topic-fronting, comparison & passive|||6.1 — Cú pháp: đề ngữ, so sánh & bị động',
  'Tính đề ngữ nổi trội chung; vị trí từ so sánh 比 vs hơn đảo ngược; câu bị động 被 trung tính vs bị/được phân theo lợi-hại.',
  [[
    `<span class="eyebrow">CCV501 · Chapter 6 · Lesson 6.1</span>
<h2>Syntax: topic-fronting, comparison &amp; passive</h2>
<h3>Topic-prominence</h3>
<p>Both Chinese and Vietnamese are <strong>topic-prominent</strong> languages: an element can be fronted as the sentence's "topic" even when it is not the grammatical subject — something far more restricted in English.</p>
<pre><code>这本书 我 看过 了。   zhè běn shū wǒ kànguo le.
(this book, I have read [it])
Quyển sách này tôi đọc rồi.
(this book, I read already)
</code></pre>
<h3>Comparative construction: marker position flips</h3>
<pre><code>Chinese:     A 比 B 高。     (A - BǏ - B - tall)   =  A比B高
Vietnamese:  A cao hơn B.   (A - tall - HƠN - B)
</code></pre>
<p>Mandarin's comparative marker <strong>比 bǐ</strong> sits <em>before</em> the adjective; Vietnamese's <strong>hơn</strong> sits <em>after</em> it — the standard of comparison (B) comes last in both, but the marker's position relative to the adjective is reversed.</p>
<h3>Passive voice: 被 bèi vs bị / được</h3>
<p>Mandarin's passive marker <strong>被 bèi</strong> is largely neutral in tone but historically leans toward unfortunate events. Vietnamese instead <strong>splits the passive by evaluation</strong>: <strong>bị</strong> for adverse/unwanted events, <strong>được</strong> for favorable ones — a semantic distinction Mandarin's 被 does not grammaticalize at all.</p>
<pre><code>他被打了。       tā bèi dǎ le.             Anh ấy bị đánh.               (bất lợi -> bị)
他被选为班长。   tā bèi xuǎn wéi bānzhǎng.  Anh ấy được chọn làm lớp trưởng. (có lợi -> được)
</code></pre>
<div class="callout"><span class="badge">Contrastive point</span> A single Chinese 被-construction can translate into either bị or được in Vietnamese — the choice depends entirely on whether the event is good or bad for the subject, information 被 itself does not encode.</div>`,
    `<span class="eyebrow">CCV501 · Chương 6 · Bài 6.1</span>
<h2>Cú pháp: đề ngữ đứng đầu câu, so sánh &amp; bị động</h2>
<h3>Tính đề ngữ nổi trội (topic-prominent)</h3>
<p>Cả tiếng Trung và tiếng Việt đều là ngôn ngữ <strong>thiên về đề ngữ (topic-prominent)</strong>: một thành phần có thể được đưa lên đầu câu làm "đề ngữ" dù nó không phải là chủ ngữ ngữ pháp — điều mà tiếng Anh hạn chế hơn nhiều.</p>
<pre><code>这本书 我 看过 了。   zhè běn shū wǒ kànguo le.
(quyển sách này, tôi đã đọc [nó])
Quyển sách này tôi đọc rồi.
</code></pre>
<h3>Cấu trúc so sánh: vị trí từ so sánh bị đảo</h3>
<pre><code>Tiếng Trung:  A 比 B 高。     (A - BỈ - B - cao)   =  A比B高
Tiếng Việt:   A cao hơn B.   (A - cao - HƠN - B)
</code></pre>
<p>Từ so sánh <strong>比 bǐ</strong> trong tiếng Trung đứng <em>trước</em> tính từ; từ <strong>hơn</strong> trong tiếng Việt đứng <em>sau</em> tính từ — chuẩn so sánh (B) đứng cuối ở cả hai câu, nhưng vị trí của từ so sánh so với tính từ thì đảo ngược nhau.</p>
<h3>Câu bị động: 被 bèi so với bị / được</h3>
<p>Trợ từ bị động <strong>被 bèi</strong> trong tiếng Trung phần lớn trung tính về sắc thái, dù về mặt lịch sử thiên về việc bất lợi. Tiếng Việt thì <strong>tách câu bị động theo đánh giá lợi/hại</strong>: <strong>bị</strong> cho việc bất lợi/không mong muốn, <strong>được</strong> cho việc có lợi — một sự phân biệt ngữ nghĩa mà 被 trong tiếng Trung hoàn toàn không ngữ pháp hoá.</p>
<pre><code>他被打了。       tā bèi dǎ le.             Anh ấy bị đánh.               (bất lợi -> bị)
他被选为班长。   tā bèi xuǎn wéi bānzhǎng.  Anh ấy được chọn làm lớp trưởng. (có lợi -> được)
</code></pre>
<div class="callout"><span class="badge">Điểm đối chiếu</span> Một cấu trúc 被 duy nhất trong tiếng Trung có thể dịch thành bị hoặc được trong tiếng Việt — lựa chọn hoàn toàn phụ thuộc việc đó tốt hay xấu cho chủ thể, thông tin mà bản thân 被 không hề mã hoá.</div>`,
  ]]);

const c6q = quiz('ccv501-quiz-6', 'Quiz 6 — Topic, comparison & passive|||Quiz 6 — Đề ngữ, so sánh & bị động', [
  { id: 'q1', question: "Đề ngữ (topic) trong câu '这本书我看过了' / 'Quyển sách này tôi đọc rồi' đứng ở đâu?", options: ['Cuối câu', 'Đầu câu, dù không phải chủ ngữ ngữ pháp', 'Giữa động từ và tân ngữ', 'Không xuất hiện'], correctIndex: 1, explanation: 'Cả hai ngôn ngữ là topic-prominent: thành phần được nhấn mạnh đứng đầu câu dù không phải chủ ngữ.' },
  { id: 'q2', question: "Trong câu so sánh, từ 'hơn' tiếng Việt đứng ở đâu so với tính từ, khác gì với 比 (bǐ) tiếng Trung?", options: ['Hơn đứng trước tính từ, giống 比', 'Hơn đứng sau tính từ, còn 比 đứng trước tính từ', 'Cả hai đều đứng sau tính từ', 'Cả hai đều đứng trước tính từ'], correctIndex: 1, explanation: "'A cao hơn B': hơn đứng sau tính từ 'cao'. 'A比B高': 比 đứng trước tính từ 'cao'." },
  { id: 'q3', question: '被 (bèi) trong tiếng Trung có thể dịch thành "bị" hoặc "được" trong tiếng Việt tuỳ vào điều gì?', options: ['Tuỳ vào thì của câu', 'Tuỳ vào việc đó có lợi hay bất lợi cho chủ thể', 'Tuỳ vào độ dài câu', 'Không thể dịch được'], correctIndex: 1, explanation: 'Tiếng Việt phân biệt bị (bất lợi) / được (có lợi) — phân biệt mà 被 trong tiếng Trung không có.' },
]);

const c7 = doc('ccv501-7-1-pragmatics-culture', '7.1 — Pragmatics & communicative culture|||7.1 — Ngữ dụng & văn hoá giao tiếp',
  'Xưng hô: 你/您 hai mức vs hệ họ hàng không trung tính; chào hỏi "ăn cơm chưa" hội tụ; khiêm tốn/từ chối gián tiếp khi khen.',
  [[
    `<span class="eyebrow">CCV501 · Chapter 7 · Lesson 7.1</span>
<h2>Pragmatics &amp; communicative culture</h2>
<h3>Address terms: no neutral "you"</h3>
<p>Mandarin has a simple two-way pronoun distinction, <strong>你 nǐ</strong> (informal) / <strong>您 nín</strong> (polite/formal). Vietnamese has <strong>no neutral second-person pronoun</strong> at all in daily speech: speakers must choose a <strong>kinship term</strong> (anh, chị, em, cô, chú, bác, ông, bà…) based on the interlocutor's relative age, gender and social standing — even with total strangers. Chinese speakers learning Vietnamese must learn to constantly recalculate address terms that Mandarin handles with one fixed word.</p>
<h3>Shared greeting culture</h3>
<p>Despite the language difference, a shared East Asian communicative norm shows up as a pragmatic <em>similarity</em>: asking about eating as a greeting, not a real question.</p>
<pre><code>你吃饭了吗？   nǐ chī fàn le ma?   "Have you eaten?"
Ăn cơm chưa?                        "Have you eaten?"
</code></pre>
<p>Both are formulaic greetings, not literal inquiries about hunger — a rare case where pragmatics converges even though the languages and grammars diverge sharply.</p>
<h3>Modesty &amp; indirect refusal</h3>
<p>Both cultures favor <strong>self-deprecating responses to compliments</strong> rather than the direct "thank you" common in English:</p>
<pre><code>哪里哪里！        nǎlǐ nǎlǐ!        "Not at all! (lit. where, where)"
Có gì đâu / đâu có.                 "It's nothing."
</code></pre>
<div class="callout"><span class="badge">Contrastive point</span> Pragmatic transfer runs both ways: a Vietnamese speaker's elaborate kinship-based address system feels over-personal to a Chinese listener used to 你/您, while a Chinese speaker's flat 你 can sound rude or distant to a Vietnamese listener expecting a kinship term.</div>`,
    `<span class="eyebrow">CCV501 · Chương 7 · Bài 7.1</span>
<h2>Ngữ dụng &amp; văn hoá giao tiếp</h2>
<h3>Cách xưng hô: không có "you" trung tính</h3>
<p>Tiếng Trung có hệ đại từ nhân xưng ngôi hai đơn giản, hai mức: <strong>你 nǐ</strong> (thân mật) / <strong>您 nín</strong> (lịch sự/trang trọng). Tiếng Việt lại <strong>không có đại từ ngôi hai trung tính</strong> nào trong lời nói hằng ngày: người nói phải chọn một <strong>từ xưng hô theo quan hệ họ hàng</strong> (anh, chị, em, cô, chú, bác, ông, bà…) dựa trên tuổi tác, giới tính và vị thế xã hội tương đối của người nghe — kể cả với người hoàn toàn xa lạ. Người Trung học tiếng Việt phải học cách liên tục tính lại cách xưng hô, trong khi tiếng Trung xử lý việc này chỉ bằng một từ cố định.</p>
<h3>Văn hoá chào hỏi có điểm chung</h3>
<p>Dù ngôn ngữ khác nhau, một chuẩn giao tiếp chung của Đông Á lại hiện ra như một <em>điểm giống</em> về ngữ dụng: hỏi về việc ăn cơm như một lời chào, không phải câu hỏi thật.</p>
<pre><code>你吃饭了吗？   nǐ chī fàn le ma?   "Ăn cơm chưa?"
Ăn cơm chưa?                        "Ăn cơm chưa?"
</code></pre>
<p>Cả hai đều là lời chào theo khuôn mẫu, không phải hỏi thật về việc đói hay no — một trường hợp hiếm hoi mà ngữ dụng hội tụ dù ngôn ngữ và ngữ pháp khác biệt rõ rệt.</p>
<h3>Khiêm tốn &amp; từ chối gián tiếp</h3>
<p>Cả hai nền văn hoá đều ưa <strong>đáp lại lời khen bằng cách hạ thấp bản thân</strong> hơn là nói "cảm ơn" trực tiếp như tiếng Anh hay làm:</p>
<pre><code>哪里哪里！        nǎlǐ nǎlǐ!        "Đâu có, đâu có!" (nghĩa đen: "đâu, đâu")
Có gì đâu / đâu có.                 "Có gì đâu."
</code></pre>
<div class="callout"><span class="badge">Điểm đối chiếu</span> Giao thoa ngữ dụng xảy ra theo cả hai chiều: hệ xưng hô theo họ hàng phức tạp của tiếng Việt khiến người nghe Trung Quốc (quen với 你/您) thấy quá riêng tư, trong khi cách gọi 你 phẳng lì của người Trung lại khiến người nghe Việt (đang chờ một từ xưng hô họ hàng) thấy có vẻ cộc lốc hoặc xa cách.</div>`,
  ]]);

const c7q = quiz('ccv501-quiz-7', 'Quiz 7 — Pragmatics & culture|||Quiz 7 — Ngữ dụng & văn hoá', [
  { id: 'q1', question: 'Điểm khác biệt lớn nhất về xưng hô ngôi hai giữa tiếng Trung và tiếng Việt là gì?', options: ['Tiếng Trung không có đại từ ngôi hai', 'Tiếng Việt dùng từ xưng hô theo họ hàng thay vì một đại từ trung tính như 你/您', 'Tiếng Việt cũng chỉ có hai mức như tiếng Trung', 'Cả hai đều dùng chung một hệ thống'], correctIndex: 1, explanation: 'Tiếng Trung có 你/您 (2 mức cố định); tiếng Việt phải chọn từ họ hàng theo tuổi/vị thế người nghe.' },
  { id: 'q2', question: "Câu '你吃饭了吗？' / 'Ăn cơm chưa?' trong giao tiếp thường mang nghĩa gì?", options: ['Hỏi thật xem người kia có đói không', 'Một lời chào theo khuôn mẫu, không hỏi thật', 'Lời mời ăn cơm chính thức', 'Câu cấm kỵ trong giao tiếp'], correctIndex: 1, explanation: 'Đây là lời chào theo khuôn mẫu chung của văn hoá Đông Á, không phải câu hỏi thật.' },
  { id: 'q3', question: 'Cách đáp lại lời khen phổ biến ở cả hai văn hoá Trung-Việt là gì?', options: ['Nói cảm ơn trực tiếp và dài dòng', 'Im lặng không đáp', "Hạ thấp bản thân/phủ nhận khéo (vd 'đâu có', 哪里哪里)", 'Khen lại ngay lập tức'], correctIndex: 2, explanation: 'Cả hai văn hoá đều ưa cách đáp khiêm tốn, hạ thấp bản thân thay vì nhận lời khen trực tiếp.' },
]);

const c8 = doc('ccv501-8-1-interference-teaching-review', '8.1 — Application: interference errors, teaching & translation|||8.1 — Ứng dụng: lỗi giao thoa, dạy học & dịch thuật',
  'Năm loại lỗi giao thoa lặp lại; bẫy "bạn giả" khi dịch; chiến lược dạy dựa trên điểm giống, luyện trọng tâm điểm khác; bảng ôn tập toàn môn.',
  [[
    `<span class="eyebrow">CCV501 · Chapter 8 · Lesson 8.1</span>
<h2>Application: interference errors, teaching &amp; translation</h2>
<h3>Negative transfer — a checklist</h3>
<p>Contrastive analysis predicts learner errors at exactly the points where the two languages differ. Five recurring types, drawn from chapters 2-6:</p>
<pre><code>1. Tone: Chinese learners flatten Vietnamese ngã/nặng toward sắc/huyền (Ch.2)
2. Compound/phrase order: "*đỏ hoa" for "hoa đỏ" (Ch.4-5)
3. Possessive order: "*của tôi sách" for "sách của tôi" (Ch.5)
4. Classifier mismatch: using 个/cái for every noun instead of the
   noun-specific classifier (con, quyển, cái, chiếc…) (Ch.5)
5. Aspect over-marking: inserting 了-equivalents (đã/rồi) where
   Mandarin would leave the verb bare (Ch.5)
</code></pre>
<h3>False friends in translation</h3>
<p>The Sino-Vietnamese layer (Ch.3) is a double-edged sword for translators: it makes many terms transparent (国家 guójiā → quốc gia, word-for-word) but also hides <strong>false friends</strong> whose meaning has drifted (老婆 lǎopó "wife" ≠ "lão bà" "old woman"). A translator must verify <em>current usage</em>, never assume the Sino-Vietnamese reading still matches.</p>
<h3>Teaching strategy</h3>
<p>Because both languages share classifiers, topic-prominence, and an SVO backbone, teaching can <strong>build on genuine similarities</strong> (classifiers, aspect-not-tense, topic-fronting) while giving <strong>focused, repeated drills</strong> exactly at the points contrastive analysis flags as high-risk: tone mapping, compound/possessive word order, and false-friend vocabulary.</p>
<div class="callout"><span class="badge">Review — the whole course in one table</span></div>
<pre><code>Level        Chinese                    Vietnamese                  Ch.
Phonology    4 tones                    6 tones (2 glottalized)      2
Lexicon      source of 汉越词           60-70% Sino-Vietnamese       3
Word form.   modifier+head compound     head+modifier compound       4
Grammar      的-possessive, mod+N       của-possessive, N+mod        5
Syntax       比 before adjective        hơn after adjective          6
             被 (neutral)               bị (adverse) / được (favor)  6
Pragmatics   你/您 (2-way)              kinship-based address        7
</code></pre>`,
    `<span class="eyebrow">CCV501 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng: lỗi giao thoa, dạy học &amp; dịch thuật</h2>
<h3>Giao thoa tiêu cực (negative transfer) — bảng kiểm</h3>
<p>Phân tích đối chiếu dự đoán lỗi người học đúng ở những chỗ hai ngôn ngữ khác nhau. Năm loại lỗi lặp lại, rút từ chương 2-6:</p>
<pre><code>1. Thanh điệu: người Trung đọc lẫn ngã/nặng của tiếng Việt thành
   sắc/huyền (Chương 2)
2. Trật tự từ ghép/cụm từ: "*đỏ hoa" thay vì "hoa đỏ" (Chương 4-5)
3. Trật tự sở hữu: "*của tôi sách" thay vì "sách của tôi" (Chương 5)
4. Lẫn lượng từ: dùng 个/cái cho mọi danh từ thay vì lượng từ riêng
   của từng danh từ (con, quyển, cái, chiếc…) (Chương 5)
5. Đánh dấu thể quá mức: chèn tương đương của 了 (đã/rồi) ở chỗ
   tiếng Trung lẽ ra để động từ trần (Chương 5)
</code></pre>
<h3>Bẫy "bạn giả" khi dịch</h3>
<p>Lớp từ Hán-Việt (Chương 3) là con dao hai lưỡi cho người dịch: nó khiến nhiều thuật ngữ trong suốt, dịch được từng chữ (国家 guójiā → quốc gia) nhưng cũng giấu những <strong>bẫy từ giả</strong> đã trôi nghĩa (老婆 lǎopó "vợ" ≠ "lão bà" "bà già"). Người dịch phải kiểm <em>cách dùng hiện hành</em>, không bao giờ mặc định âm Hán Việt vẫn còn khớp nghĩa.</p>
<h3>Chiến lược dạy học</h3>
<p>Vì cả hai ngôn ngữ đều có lượng từ, tính đề ngữ nổi trội và khung SVO, việc dạy có thể <strong>dựa vào những điểm giống thật sự</strong> (lượng từ, thể chứ không phải thì, đề ngữ đứng đầu câu) đồng thời <strong>luyện tập lặp lại có trọng tâm</strong> đúng những chỗ phân tích đối chiếu đã cảnh báo là nguy cơ cao: ánh xạ thanh điệu, trật tự từ ghép/sở hữu, và từ vựng bẫy-giả.</p>
<div class="callout"><span class="badge">Ôn tập — cả môn học trong một bảng</span></div>
<pre><code>Bình diện    Tiếng Trung                 Tiếng Việt                   Chg.
Ngữ âm       4 thanh                     6 thanh (2 thanh có tắc)      2
Từ vựng      nguồn gốc của 汉越词        60-70% là từ Hán-Việt         3
Cấu tạo từ   định ngữ+trung tâm          trung tâm+định ngữ            4
Ngữ pháp     的-sở hữu, định ngữ+DT      của-sở hữu, DT+định ngữ       5
Cú pháp      比 đứng trước tính từ       hơn đứng sau tính từ          6
             被 (trung tính)             bị (bất lợi) / được (có lợi)  6
Ngữ dụng     你/您 (hai mức)             xưng hô theo họ hàng          7
</code></pre>`,
  ]]);

const c8q = quiz('ccv501-quiz-8', 'Quiz 8 — Interference & review|||Quiz 8 — Giao thoa & ôn tập', [
  { id: 'q1', question: "Lỗi 'đảo ngược trật tự' phổ biến của người Trung khi nói tiếng Việt là gì?", options: ["Nói 'hoa đỏ' đúng chuẩn", "Nói '*đỏ hoa' thay vì 'hoa đỏ', áp trật tự định ngữ+trung tâm của tiếng Trung", 'Không dùng tính từ', 'Chỉ dùng danh từ đơn'], correctIndex: 1, explanation: 'Người Trung hay áp trật tự định ngữ+trung tâm quen thuộc của tiếng Trung sang tiếng Việt, gây lỗi trật tự ngược.' },
  { id: 'q2', question: 'Vì sao lớp từ Hán-Việt vừa giúp vừa gây bẫy cho người dịch?', options: ['Vì nó không tồn tại trong thực tế', "Vì nhiều từ dịch được sát nghĩa từng chữ, nhưng một số đã trôi nghĩa thành 'bạn giả'", 'Vì tiếng Trung không có từ Hán Việt', 'Vì nó chỉ dùng trong văn nói'], correctIndex: 1, explanation: 'Từ Hán-Việt giúp dịch trong suốt phần lớn trường hợp, nhưng một số từ đã trôi nghĩa và trở thành bẫy "bạn giả".' },
  { id: 'q3', question: 'Chiến lược dạy học hiệu quả theo phân tích đối chiếu là gì?', options: ['Dạy tất cả các điểm như nhau, không phân biệt', 'Chỉ dạy phát âm, bỏ qua ngữ pháp', 'Dựa vào điểm giống thật sự, luyện tập trọng tâm vào chỗ khác biệt dễ gây lỗi', 'Dịch từng từ một cách máy móc'], correctIndex: 2, explanation: 'Phân tích đối chiếu cho phép tận dụng điểm giống và tập trung luyện đúng những điểm khác biệt dễ gây lỗi.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'CCV501',
    slug: 'ccv501-contrastive-linguistics-chinesevietnamese',
    title: 'Contrastive Linguistics: Chinese–Vietnamese',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CCV501.webp',
    shortDescription: 'Chinese–Vietnamese contrastive linguistics: tones, Sino-Vietnamese lexicon, word formation, grammar (word order, classifiers), syntax, pragmatics & interference errors — theory with parallel Hanzi+pinyin–Vietnamese examples, 8 chapters, quizzes.|||Ngôn ngữ học đối chiếu Trung-Việt: thanh điệu, từ Hán-Việt, cấu tạo từ, ngữ pháp (trật tự từ, lượng từ), cú pháp, ngữ dụng & lỗi giao thoa — lý thuyết kèm ví dụ song song chữ Hán+pinyin và tiếng Việt, 8 chương, quiz.',
    description: 'Môn <strong>CCV501 — Contrastive Linguistics: Chinese–Vietnamese</strong> (Ngôn ngữ học Đối chiếu Trung - Việt, ngành Ngôn ngữ Trung, kỳ 7, trình độ cao) đối chiếu tiếng Trung và tiếng Việt qua 8 chương: <strong>tổng quan &amp; phương pháp</strong> (Lado) → <strong>ngữ âm-thanh điệu</strong> (4 thanh vs 6 thanh) → <strong>từ vựng &amp; lớp từ Hán-Việt</strong> (汉越词) → <strong>cấu tạo từ</strong> (từ ghép, từ láy) → <strong>ngữ pháp</strong> (trật tự từ, hư từ, lượng từ) → <strong>cú pháp câu</strong> (đề ngữ, so sánh, bị động) → <strong>ngữ dụng &amp; văn hoá giao tiếp</strong> → <strong>ứng dụng</strong>: lỗi giao thoa, dạy-dịch &amp; ôn tập. Mỗi chương có ví dụ song song chữ Hán (UTF-8) + pinyin + tiếng Việt, và quiz kiểm tra. Tham khảo: "对比语言学" (Contrastive Linguistics), "Ngôn ngữ học đối chiếu" (Bùi Mạnh Hùng), "汉越语对比研究".',
    whatYouLearn: 'Phân biệt ngôn ngữ học đối chiếu (đồng đại) và so sánh-lịch sử (lịch đại); ba bước phân tích đối chiếu của Lado; hệ thống thanh điệu 4 vs 6 thanh và điểm không tương ứng; lớp từ Hán-Việt (âm Hán Việt, hai lớp từ vựng song song, bẫy "bạn giả"); trật tự từ ghép/cụm sở hữu đảo ngược (định ngữ+trung tâm vs trung tâm+định ngữ); hệ lượng từ chung nhưng không khớp 1-1; thể (aspect) 了 vs đã/rồi; cú pháp đề ngữ, so sánh (比 vs hơn), bị động (被 vs bị/được); ngữ dụng xưng hô & văn hoá giao tiếp; nhận diện và sửa lỗi giao thoa (interference) khi dạy và dịch.',
    requirements: 'Đã hoàn thành các môn tiếng Trung nền tảng (HSK trung cấp trở lên) và có kiến thức tiếng Việt bản ngữ hoặc tương đương. Nên có nền tảng ngôn ngữ học đại cương. Xem điều kiện tiên quyết chính thức trong khung chương trình ngành Ngôn ngữ Trung trên FLM.',
  },
  sections: [
    { title: 'Chương 1 — Tổng quan & phương pháp|||Chapter 1 — Overview & method', description: 'Contrastive linguistics là gì, khác comparative, ba bước của Lado.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ngữ âm & thanh điệu|||Chapter 2 — Phonology & tones', description: '4 thanh tiếng Trung vs 6 thanh tiếng Việt, không ánh xạ 1-1.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Từ vựng & lớp từ Hán-Việt|||Chapter 3 — Lexicon & Sino-Vietnamese layer', description: 'Âm Hán Việt, hai lớp từ song song, bẫy "bạn giả".', lessons: [c3, c3q] },
    { title: 'Chương 4 — Cấu tạo từ|||Chapter 4 — Word formation', description: 'Từ ghép đảo trật tự, từ lặp vs từ láy.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Ngữ pháp: trật tự từ, hư từ, lượng từ|||Chapter 5 — Grammar: order, function words, classifiers', description: 'Sở hữu đảo trật tự, lượng từ chung, thể 了 vs đã/rồi.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cú pháp câu & cách diễn đạt|||Chapter 6 — Sentence syntax & expression', description: 'Đề ngữ, so sánh 比/hơn, bị động 被/bị-được.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Ngữ dụng & văn hoá giao tiếp|||Chapter 7 — Pragmatics & communicative culture', description: 'Xưng hô, chào hỏi, khiêm tốn khi đáp lời khen.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng: lỗi giao thoa, dạy-dịch & ôn tập|||Chapter 8 — Application: interference, teaching & review', description: 'Năm loại lỗi giao thoa, bẫy dịch thuật, bảng ôn tập toàn môn.', lessons: [c8, c8q] },
  ],
};
