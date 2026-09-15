/**
 * CPL401 — Phonetics - Lexicology - Chinese Character. Khối Ngôn ngữ Trung
 * FPTU, kỳ 4. MÔN LÝ THUYẾT NGÔN NGỮ (linguistics của tiếng Trung), KHÔNG phải
 * môn tiếng tổng hợp: 8 chương theo 3 phần — Ngữ âm (ch.1-2) → Từ vựng
 * (ch.3-5) → Văn tự Hán (ch.6-8). Trích dẫn giáo trình 现代汉语 (Huang Borong
 * & Liao Xudong) và 汉字学, KHÔNG upload PDF. Giữ NGUYÊN slug/semester/
 * courseCode/thumb. ⚠️ KHÔNG backtick lồng/${}; trong HTML content "&" →
 * "&amp;". Tiếng Việt + pinyin có dấu thanh thật, chữ Hán UTF-8.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 420, questions } });

const c1 = doc('cpl401-1-1-phonological-system', 'Chapter 1 — Chinese phonological system: initials, finals, tones &amp; pinyin|||Chương 1 — Hệ thống ngữ âm tiếng Trung: thanh mẫu, vận mẫu, thanh điệu &amp; pinyin',
  'Thanh mẫu (phụ âm đầu), vận mẫu (phần vần), thanh điệu tiếng Trung phổ thông; cách pinyin ghi âm hệ thống này.',
  [[
    `<span class="eyebrow">CPL401 · Chapter 1 · Phonology</span>
<h2>The Chinese phonological system: initials, finals, tones &amp; pinyin</h2>
<p class="lead">Modern Standard Chinese (普通话 Pǔtōnghuà) syllables are built from three parts: an <strong>initial</strong> (声母 shēngmǔ), a <strong>final</strong> (韵母 yùnmǔ), and a <strong>tone</strong> (声调 shēngdiào). <strong>Pinyin</strong> (拼音) is the official Latin transcription that spells this system out.</p>
<h3>Initials (声母 shēngmǔ)</h3>
<p>21 consonant initials, grouped by place/manner of articulation:</p>
<pre><code>Labials     b  p  m  f
Alveolars   d  t  n  l
Velars      g  k  h
Palatals    j  q  x
Retroflex   zh ch sh r
Sibilants   z  c  s
</code></pre>
<p>Some pairs differ only by <strong>aspiration</strong> (a puff of air): b/p, d/t, g/k, j/q, zh/ch, z/c — not by voicing as in English.</p>
<h3>Finals (韵母 yùnmǔ)</h3>
<p>6 simple vowels <strong>a o e i u ü</strong>, plus compound finals (diphthongs/triphthongs: ai, ei, ao, ou, ia, ua…) and nasal finals (an, en, in, un, ang, eng, ing, ong…).</p>
<h3>Tones (声调 shēngdiào)</h3>
<p>Standard Chinese has 4 lexical tones, marked over the main vowel:</p>
<pre><code>mā  1st  high level        妈  (mother)
má  2nd  rising            麻  (hemp)
mǎ  3rd  dip then rising   马  (horse)
mà  4th  falling           骂  (to scold)
</code></pre>
<div class="callout"><span class="badge">Same syllable, different word</span> mā/má/mǎ/mà are four completely different words — tone is not decoration, it is part of the phoneme string, exactly like an initial or a final.</div>`,
    `<span class="eyebrow">CPL401 · Chương 1 · Ngữ âm học</span>
<h2>Hệ thống ngữ âm tiếng Trung: thanh mẫu, vận mẫu, thanh điệu &amp; pinyin</h2>
<p class="lead">Âm tiết tiếng Trung phổ thông (普通话 Pǔtōnghuà) gồm ba phần: <strong>thanh mẫu</strong> (声母 shēngmǔ, phụ âm đầu), <strong>vận mẫu</strong> (韵母 yùnmǔ, phần vần) và <strong>thanh điệu</strong> (声调 shēngdiào). <strong>Pinyin</strong> (拼音) là hệ ghi âm La-tinh chính thức thể hiện hệ thống này.</p>
<h3>Thanh mẫu (声母)</h3>
<p>21 phụ âm đầu, chia theo vị trí/cách phát âm:</p>
<pre><code>Môi          b  p  m  f
Đầu lưỡi     d  t  n  l
Cuống lưỡi   g  k  h
Mặt lưỡi     j  q  x
Uốn lưỡi     zh ch sh r
Xát-tắc      z  c  s
</code></pre>
<p>Một số cặp chỉ khác nhau ở <strong>bật hơi</strong> (aspiration — một luồng hơi bật ra): b/p, d/t, g/k, j/q, zh/ch, z/c — KHÔNG phải khác nhau ở hữu thanh/vô thanh như tiếng Anh.</p>
<h3>Vận mẫu (韵母)</h3>
<p>6 nguyên âm đơn <strong>a o e i u ü</strong>, cộng vận mẫu ghép (nguyên âm đôi/ba: ai, ei, ao, ou, ia, ua…) và vận mẫu mũi (an, en, in, un, ang, eng, ing, ong…).</p>
<h3>Thanh điệu (声调)</h3>
<p>Tiếng Trung phổ thông có 4 thanh điệu từ vựng, đánh dấu trên nguyên âm chính:</p>
<pre><code>mā  Thanh 1  ngang cao          妈  (mẹ)
má  Thanh 2  đi lên             麻  (cây gai/vải đũi)
mǎ  Thanh 3  xuống rồi lên      马  (con ngựa)
mà  Thanh 4  xuống mạnh         骂  (mắng, chửi)
</code></pre>
<div class="callout"><span class="badge">Cùng âm tiết, khác từ</span> mā/má/mǎ/mà là bốn từ hoàn toàn khác nhau — thanh điệu không phải trang trí, nó là một phần của chuỗi âm vị, giống hệt thanh mẫu hay vận mẫu.</div>`,
  ]]);

const c1q = quiz('cpl401-quiz-1', 'Quiz 1 — Phonological system|||Quiz 1 — Hệ thống ngữ âm', [
  { id: 'q1', question: '声母 (shēngmǔ) trong hệ thống ngữ âm tiếng Trung là gì?', options: ['Phụ âm đầu (thanh mẫu)', 'Phần vần (vận mẫu)', 'Thanh điệu', 'Trọng âm'], correctIndex: 0, explanation: '声母 (shēngmǔ) chính là thanh mẫu — phần phụ âm đầu của âm tiết.' },
  { id: 'q2', question: 'Các cặp b/p, d/t, g/k, j/q, zh/ch, z/c khác nhau chủ yếu ở đặc điểm nào?', options: ['Hữu thanh / vô thanh', 'Bật hơi (aspiration)', 'Trường độ nguyên âm', 'Vị trí lưỡi trước/sau'], correctIndex: 1, explanation: 'Các cặp này chỉ khác ở bật hơi (một luồng hơi bật ra), không phải hữu thanh/vô thanh như trong tiếng Anh.' },
  { id: 'q3', question: 'mā, má, mǎ, mà (妈/麻/马/骂) khác nhau ở điểm gì?', options: ['Chỉ khác thanh điệu, nhưng là 4 từ/nghĩa hoàn toàn khác nhau', 'Chỉ là 4 cách viết khác nhau của cùng một từ', 'Khác thanh mẫu', 'Khác vận mẫu'], correctIndex: 0, explanation: 'Bốn âm tiết này cùng thanh mẫu m- và vận mẫu -a, chỉ khác thanh điệu, nhưng thanh điệu khác thì nghĩa khác hoàn toàn.' },
]);

const c2 = doc('cpl401-2-1-syllable-tone-sandhi', 'Chapter 2 — Syllables, tone sandhi &amp; phonological phenomena: neutral tone &amp; érhuà|||Chương 2 — Âm tiết, biến điệu &amp; hiện tượng ngữ âm: nhẹ hoá &amp; nhi hoá',
  'Cấu trúc âm tiết; quy tắc biến điệu (thanh 3+3, 不, 一); nhẹ hoá (轻声) ở trợ từ; nhi hoá (儿化).',
  [[
    `<span class="eyebrow">CPL401 · Chapter 2 · Syllable &amp; sandhi</span>
<h2>Syllables, tone sandhi &amp; phonological phenomena: neutral tone &amp; érhuà</h2>
<h3>Syllable structure</h3>
<p>A Chinese syllable = (initial) + final + tone. Some finals stand alone with a "zero initial" (e.g. ā, ér). Every syllable normally corresponds to one written character (汉字).</p>
<h3>Tone sandhi (声调变化 — biến điệu)</h3>
<ul>
<li><strong>3rd + 3rd → 2nd + 3rd</strong>: 你好 nǐhǎo is actually pronounced <em>níhǎo</em> — two 3rd tones in a row, the first surfaces as 2nd.</li>
<li><strong>不 bù before a 4th-tone syllable → bú</strong>: 不是 bú shì (is not).</li>
<li><strong>一 yī sandhi</strong>: before a 4th-tone syllable it becomes yí (一定 yídìng); as an adverb before other tones it often becomes yì (一起 yìqǐ); as a bare number it stays yī.</li>
</ul>
<h3>Neutral tone (轻声 qīngshēng — nhẹ hoá)</h3>
<p>Certain grammatical particles and suffixes lose their full tone and are pronounced short and light: 吗 ma (question particle), 了 le (aspect particle), 的 de (attributive particle), 们 men (plural suffix: 我们 wǒmen).</p>
<h3>Érhuà (儿化 — nhi hoá)</h3>
<p>Adding the suffix 儿 -r retroflexes the end of the previous syllable instead of being pronounced as a separate syllable: 花儿 huā + ér → <strong>huār</strong> (flower, colloquial/affectionate flavor), 玩儿 wán + ér → <strong>wánr</strong> (to play). Common in Beijing Mandarin, rarer in southern varieties and formal writing.</p>
<div class="callout"><span class="badge">Not free variation</span> Tone sandhi and érhuà are systematic rules, not optional style — a learner who says nǐhǎo with two full 3rd tones, or reads 儿 as a full extra syllable, will sound noticeably foreign.</div>`,
    `<span class="eyebrow">CPL401 · Chương 2 · Âm tiết &amp; biến điệu</span>
<h2>Âm tiết, biến điệu &amp; hiện tượng ngữ âm: nhẹ hoá &amp; nhi hoá</h2>
<h3>Cấu trúc âm tiết</h3>
<p>Một âm tiết tiếng Trung = (thanh mẫu) + vận mẫu + thanh điệu. Một số vận mẫu đứng độc lập với "thanh mẫu rỗng" (vd ā, ér). Mỗi âm tiết thường ứng với một chữ Hán (汉字).</p>
<h3>Biến điệu (声调变化)</h3>
<ul>
<li><strong>Thanh 3 + thanh 3 → thanh 2 + thanh 3</strong>: 你好 nǐhǎo thực tế đọc thành <em>níhǎo</em> — hai thanh 3 liên tiếp, âm tiết đầu chuyển thành thanh 2.</li>
<li><strong>不 bù trước âm tiết thanh 4 → bú</strong>: 不是 bú shì (không phải).</li>
<li><strong>一 yī biến điệu</strong>: trước âm tiết thanh 4 thành yí (一定 yídìng); khi làm phó từ trước các thanh khác thường thành yì (一起 yìqǐ); khi là số đếm đơn thuần vẫn giữ yī.</li>
</ul>
<h3>Nhẹ hoá (轻声 qīngshēng)</h3>
<p>Một số trợ từ ngữ pháp và hậu tố mất thanh điệu đầy đủ, đọc ngắn và nhẹ: 吗 ma (trợ từ nghi vấn), 了 le (trợ từ động thái), 的 de (trợ từ định ngữ), 们 men (hậu tố số nhiều: 我们 wǒmen).</p>
<h3>Nhi hoá (儿化)</h3>
<p>Thêm hậu tố 儿 -r làm uốn lưỡi phần cuối âm tiết trước, không đọc thành âm tiết riêng: 花儿 huā + ér → <strong>huār</strong> (bông hoa, sắc thái khẩu ngữ/thân mật), 玩儿 wán + ér → <strong>wánr</strong> (chơi). Phổ biến trong tiếng Bắc Kinh, ít gặp hơn ở phương ngữ phía nam và văn viết trang trọng.</p>
<div class="callout"><span class="badge">Không phải biến thể tự do</span> Biến điệu và nhi hoá là quy tắc có hệ thống, không phải cách đọc tuỳ ý — người học đọc 你好 với hai thanh 3 đầy đủ, hoặc đọc 儿 thành một âm tiết riêng, sẽ nghe rất "ngoại".</div>`,
  ]]);

const c2q = quiz('cpl401-quiz-2', 'Quiz 2 — Tone sandhi &amp; phonological phenomena|||Quiz 2 — Biến điệu &amp; hiện tượng ngữ âm', [
  { id: 'q1', question: '"你好" phát âm chuẩn theo quy tắc biến điệu là gì?', options: ['nǐhǎo, giữ nguyên hai thanh 3', 'níhǎo, thanh 3 của âm tiết đầu chuyển thành thanh 2', 'nǐhao, âm tiết đầu nhẹ hoá', 'nìhǎo, thanh 4 rồi thanh 3'], correctIndex: 1, explanation: 'Quy tắc biến điệu: hai thanh 3 liên tiếp thì âm tiết đầu đổi thành thanh 2 — 你好 đọc thành níhǎo.' },
  { id: 'q2', question: '轻声 (nhẹ hoá) thường áp dụng cho trường hợp nào?', options: ['Mọi âm tiết trong câu', 'Các trợ từ ngữ pháp/hậu tố như 吗, 了, 的, 们', 'Chỉ danh từ riêng', 'Chỉ số đếm từ 1 đến 10'], correctIndex: 1, explanation: 'Nhẹ hoá xảy ra ở các trợ từ ngữ pháp và một số hậu tố — chúng mất thanh điệu đầy đủ, đọc ngắn và nhẹ.' },
  { id: 'q3', question: '儿化 (nhi hoá) là hiện tượng gì?', options: ['Thêm một âm tiết đầy đủ 儿 sau từ', 'Biến phần cuối âm tiết trước thành âm uốn lưỡi -r, không tách thành âm tiết riêng', 'Đổi thanh điệu của âm tiết trước', 'Bỏ hẳn thanh mẫu của âm tiết trước'], correctIndex: 1, explanation: '儿化 nhập 儿 vào cuối âm tiết trước thành âm uốn lưỡi -r, ví dụ 花儿 huā+ér → huār, không đọc thành hai âm tiết.' },
]);

const c3 = doc('cpl401-3-1-word-formation', 'Chapter 3 — Chinese words &amp; word formation: simple, compound &amp; reduplicated words|||Chương 3 — Từ &amp; cấu tạo từ tiếng Trung: từ đơn, từ ghép &amp; từ láy',
  'Từ đơn (单纯词) và liên miên từ; từ ghép (合成词): ghép nghĩa và phụ tố; từ láy (叠词).',
  [[
    `<span class="eyebrow">CPL401 · Chapter 3 · Lexicology</span>
<h2>Chinese words &amp; word formation: simple, compound &amp; reduplicated words</h2>
<h3>Simple words (单纯词 dānchúncí)</h3>
<p>Made of a single morpheme (语素 yǔsù). Most are one syllable: 天 tiān (sky), 地 dì (earth), 水 shuǐ (water). A smaller class, <strong>联绵词 liánmiáncí</strong>, is bisyllabic but still ONE morpheme — the two syllables cannot be split and re-meant separately: 蝴蝶 húdié (butterfly), 葡萄 pútáo (grape).</p>
<h3>Compound words (合成词 héchéngcí)</h3>
<p>Built from ≥2 morphemes, two main routes:</p>
<ul>
<li><strong>Compounding (复合式)</strong> — combine two root morphemes: coordinate/联合 朋友 péngyou (friend); modifier-head/偏正 火车 huǒchē (lit. "fire-vehicle" = train); verb-object/动宾 关心 guānxīn (lit. "close-heart" = to care about); subject-predicate/主谓 地震 dìzhèn (lit. "earth-shakes" = earthquake); verb-complement/补充 说明 shuōmíng (lit. "speak-clear" = to explain).</li>
<li><strong>Affixation (附加式)</strong> — a root plus a fixed affix: prefixes 老- (老师 lǎoshī, teacher), 阿- (阿姨 āyí, auntie); suffixes -子 (桌子 zhuōzi, table), -儿 (花儿 huār), -头 (石头 shítou, stone).</li>
</ul>
<h3>Reduplicated words (叠词 diécí)</h3>
<p>A morpheme (or pair) repeated for emphasis, vividness or grammatical softening: AA 人人 rénrén (everyone), 天天 tiāntiān (every day); AABB 高高兴兴 gāogāoxìngxìng (happily); with adjectives, reduplication often softens: 慢慢 mànmàn (slowly, gently).</p>
<div class="callout"><span class="badge">Why this matters</span> Knowing the internal structure of a compound (e.g. 火车 = "fire-vehicle") makes new vocabulary far easier to guess and remember than treating each word as an opaque string of sounds.</div>`,
    `<span class="eyebrow">CPL401 · Chương 3 · Từ vựng học</span>
<h2>Từ &amp; cấu tạo từ tiếng Trung: từ đơn, từ ghép &amp; từ láy</h2>
<h3>Từ đơn (单纯词 dānchúncí)</h3>
<p>Chỉ gồm một hình vị (语素 yǔsù). Đa số là một âm tiết: 天 tiān (trời), 地 dì (đất), 水 shuǐ (nước). Một nhóm nhỏ hơn, <strong>联绵词 liánmiáncí</strong>, có hai âm tiết nhưng vẫn là MỘT hình vị duy nhất — không thể tách hai âm tiết ra để gán nghĩa riêng: 蝴蝶 húdié (con bướm), 葡萄 pútáo (quả nho).</p>
<h3>Từ ghép (合成词 héchéngcí)</h3>
<p>Gồm ≥2 hình vị, hai cách tạo chính:</p>
<ul>
<li><strong>Ghép nghĩa (复合式)</strong> — kết hợp hai hình vị gốc: liên hợp/联合 朋友 péngyou (bạn bè); chính phụ/偏正 火车 huǒchē (nghĩa gốc "xe-lửa" = tàu hoả); động tân/动宾 关心 guānxīn (nghĩa gốc "đóng-tim" = quan tâm); chủ vị/主谓 地震 dìzhèn (nghĩa gốc "đất-rung" = động đất); động bổ/补充 说明 shuōmíng (nghĩa gốc "nói-rõ" = giải thích).</li>
<li><strong>Phụ gia (附加式)</strong> — một hình vị gốc cộng phụ tố cố định: tiền tố 老- (老师 lǎoshī, giáo viên), 阿- (阿姨 āyí, dì/cô); hậu tố -子 (桌子 zhuōzi, cái bàn), -儿 (花儿 huār), -头 (石头 shítou, hòn đá).</li>
</ul>
<h3>Từ láy (叠词 diécí)</h3>
<p>Một hình vị (hoặc một cặp) được lặp lại để nhấn mạnh, gợi hình hoặc làm mềm ngữ pháp: dạng AA 人人 rénrén (mọi người), 天天 tiāntiān (mỗi ngày); dạng AABB 高高兴兴 gāogāoxìngxìng (vui vẻ); với tính từ, láy thường làm nghĩa dịu hơn: 慢慢 mànmàn (chầm chậm).</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Biết cấu tạo bên trong một từ ghép (vd 火车 = "xe-lửa") giúp đoán và nhớ từ mới dễ hơn nhiều so với coi mỗi từ là một chuỗi âm vô nghĩa.</div>`,
  ]]);

const c3q = quiz('cpl401-quiz-3', 'Quiz 3 — Word formation|||Quiz 3 — Cấu tạo từ', [
  { id: 'q1', question: '"联绵词" (liánmiáncí, ví dụ 蝴蝶 húdié) được phân loại là loại từ nào?', options: ['Từ ghép 2 hình vị', 'Từ đơn 2 âm tiết (chỉ 1 hình vị)', 'Từ láy', 'Từ mượn'], correctIndex: 1, explanation: '联绵词 có hai âm tiết nhưng chỉ mang một hình vị duy nhất, không tách nghĩa được — nên vẫn xếp vào từ đơn.' },
  { id: 'q2', question: '"火车" (huǒchē, tàu hoả) là từ ghép theo kiểu quan hệ nào?', options: ['Liên hợp (联合)', 'Chính phụ (偏正)', 'Chủ vị (主谓)', 'Động bổ (补充)'], correctIndex: 1, explanation: '火车 = 火 (lửa, thành phần phụ bổ nghĩa) + 车 (xe, thành phần chính) — quan hệ chính phụ/偏正.' },
  { id: 'q3', question: '"人人" (rénrén, mọi người) thuộc loại cấu tạo từ nào?', options: ['Từ ghép chính phụ', 'Từ đơn', 'Từ láy (叠词)', 'Từ phái sinh bằng phụ tố'], correctIndex: 2, explanation: '人人 là hình vị 人 được lặp lại (dạng AA) để nhấn mạnh nghĩa "mọi/từng người" — đây là từ láy.' },
]);

const c4 = doc('cpl401-4-1-word-meaning', 'Chapter 4 — Word meaning, polysemy, synonymy &amp; antonymy|||Chương 4 — Nghĩa từ, đa nghĩa, đồng nghĩa &amp; trái nghĩa',
  'Nghĩa gốc và nghĩa phụ (sắc thái); từ đa nghĩa (多义词); đồng nghĩa (同义词) và trái nghĩa (反义词) có mức độ/bổ sung.',
  [[
    `<span class="eyebrow">CPL401 · Chapter 4 · Semantics</span>
<h2>Word meaning, polysemy, synonymy &amp; antonymy</h2>
<h3>Denotation &amp; connotation</h3>
<p>词义 (cíyì, word meaning) has a core <strong>denotative</strong> meaning (理性意义) and often a <strong>connotative</strong> layer (色彩意义) — positive, negative, or formal/colloquial. E.g. 死 sǐ (to die, neutral/blunt) vs 逝世 shìshì (to pass away, formal/respectful) vs 牺牲 xīshēng (to sacrifice one's life, heroic).</p>
<h3>Polysemy (多义词 duōyìcí)</h3>
<p>One word-form, several related meanings linked by extension: <strong>老 lǎo</strong> — literally "old" (老人 lǎorén, old person), but also a respectful prefix before a surname (老王 Lǎo Wáng), and an intensifier meaning "always" (他老是迟到 tā lǎoshì chídào, he is always late).</p>
<h3>Synonyms (同义词 tóngyìcí)</h3>
<p>Near-synonyms usually differ in register, scope or collocation, not raw meaning: 变化 biànhuà (change, neutral/general) vs 转变 zhuǎnbiàn (transform, a shift in stance/direction) vs 变革 biàngé (reform, formal/systemic). Choosing the right one is a lexicology skill, not a coin-flip.</p>
<h3>Antonyms (反义词 fǎnyìcí)</h3>
<p>Two main kinds: <strong>gradable</strong> pairs on a scale (大 dà "big" — 小 xiǎo "small"; 快 kuài "fast" — 慢 màn "slow") and <strong>complementary</strong> pairs with no middle ground (男 nán "male" — 女 nǚ "female"; 生 shēng "alive" — 死 sǐ "dead").</p>
<div class="callout"><span class="badge">Dictionary trap</span> A bilingual dictionary often lists one gloss per word — but 老 alone already spans "old", an informal title prefix, and "always". Always check example sentences, not just the gloss.</div>`,
    `<span class="eyebrow">CPL401 · Chương 4 · Ngữ nghĩa học</span>
<h2>Nghĩa từ, đa nghĩa, đồng nghĩa &amp; trái nghĩa</h2>
<h3>Nghĩa biểu vật &amp; sắc thái</h3>
<p>词义 (cíyì, nghĩa của từ) có một nghĩa <strong>lý tính</strong> cốt lõi (理性意义) và thường kèm lớp <strong>sắc thái</strong> (色彩意义) — tích cực, tiêu cực, hoặc trang trọng/khẩu ngữ. Vd: 死 sǐ (chết, trung tính/thẳng) so với 逝世 shìshì (từ trần, trang trọng/tôn kính) so với 牺牲 xīshēng (hy sinh, oai hùng).</p>
<h3>Từ đa nghĩa (多义词 duōyìcí)</h3>
<p>Một hình thức từ mang nhiều nghĩa có liên quan, nghĩa sau phát sinh từ nghĩa trước: <strong>老 lǎo</strong> — nghĩa gốc là "già" (老人 lǎorén, người già), nhưng cũng là tiền tố kính trọng trước họ (老王 Lǎo Wáng), và làm phó từ nhấn mạnh nghĩa "luôn luôn" (他老是迟到 tā lǎoshì chídào, anh ấy luôn đến muộn).</p>
<h3>Đồng nghĩa (同义词 tóngyìcí)</h3>
<p>Các từ gần nghĩa thường khác nhau ở mức độ trang trọng, phạm vi hoặc khả năng kết hợp, không khác ở nghĩa gốc: 变化 biànhuà (thay đổi, trung tính/chung) so với 转变 zhuǎnbiàn (chuyển biến, nhấn vào sự đổi hướng/lập trường) so với 变革 biàngé (biến cách, trang trọng/mang tính hệ thống). Chọn đúng từ là kỹ năng từ vựng học, không phải may rủi.</p>
<h3>Trái nghĩa (反义词 fǎnyìcí)</h3>
<p>Hai loại chính: cặp <strong>có mức độ</strong> nằm trên một thang (大 dà "to" — 小 xiǎo "nhỏ"; 快 kuài "nhanh" — 慢 màn "chậm") và cặp <strong>bổ sung</strong> không có khoảng giữa (男 nán "nam" — 女 nǚ "nữ"; 生 shēng "sống" — 死 sǐ "chết").</p>
<div class="callout"><span class="badge">Cạm bẫy từ điển</span> Từ điển song ngữ thường chỉ ghi một nghĩa cho mỗi từ — nhưng riêng 老 đã trải từ "già" đến tiền tố xưng hô thân mật đến phó từ "luôn luôn". Luôn kiểm tra câu ví dụ, không chỉ nghĩa dịch.</div>`,
  ]]);

const c4q = quiz('cpl401-quiz-4', 'Quiz 4 — Word meaning|||Quiz 4 — Nghĩa từ', [
  { id: 'q1', question: '"多义词" (duōyìcí) là gì?', options: ['Từ có nhiều cách viết khác nhau', 'Một hình thức từ mang nhiều nghĩa có liên quan với nhau', 'Hai từ khác nhau nhưng đồng nghĩa', 'Một từ và từ trái nghĩa của nó'], correctIndex: 1, explanation: '多义词 là một từ (một hình thức ngữ âm/chữ viết) mang nhiều nghĩa phát sinh có liên quan, như 老 (già → tiền tố kính trọng → luôn luôn).' },
  { id: 'q2', question: 'Cặp "大 (dà) — 小 (xiǎo)" là loại từ trái nghĩa nào?', options: ['Bổ sung, không có khoảng giữa', 'Có mức độ (gradable), có thể so sánh hơn/kém', 'Đồng nghĩa', 'Đa nghĩa'], correctIndex: 1, explanation: '大/小 nằm trên một thang độ liên tục (có thể "hơi to", "rất nhỏ"...) nên là cặp trái nghĩa có mức độ, khác với cặp bổ sung như 男/女.' },
  { id: 'q3', question: 'Khác biệt giữa 变化 (biànhuà) và 变革 (biàngé) chủ yếu nằm ở đâu?', options: ['Nghĩa gốc hoàn toàn khác nhau', 'Sắc thái, mức độ trang trọng và phạm vi sử dụng', 'Cách viết chữ Hán của thanh mẫu', 'Thanh điệu của âm tiết đầu'], correctIndex: 1, explanation: 'Cả hai đều liên quan đến "thay đổi", nhưng 变革 trang trọng hơn và nhấn vào sự thay đổi có hệ thống, còn 变化 trung tính và chung hơn.' },
]);

const c5 = doc('cpl401-5-1-idioms-vocabulary-growth', 'Chapter 5 — Idioms, set phrases &amp; vocabulary development|||Chương 5 — Thành ngữ, quán ngữ &amp; sự phát triển từ vựng',
  'Thành ngữ (成语), quán ngữ (惯用语), tục ngữ (谚语/俗语); từ mới, từ vựng mạng, từ mượn phiên âm (外来词).',
  [[
    `<span class="eyebrow">CPL401 · Chapter 5 · Vocabulary growth</span>
<h2>Idioms, set phrases &amp; vocabulary development</h2>
<h3>Idioms (成语 chéngyǔ)</h3>
<p>Fixed four-character expressions, mostly from classical texts, fables or history, with a meaning that cannot be derived word-by-word: <strong>守株待兔 shǒu zhū dài tù</strong> (lit. "guard the tree stump, wait for a rabbit" — waiting passively for luck instead of acting), <strong>画蛇添足 huà shé tiān zú</strong> (lit. "draw a snake and add feet" — to ruin something by overdoing it).</p>
<h3>Set/colloquial phrases (惯用语 guànyòngyǔ)</h3>
<p>Shorter and more colloquial than 成语, usually 3 syllables, often verb-object structured and figurative: 走后门 zǒu hòumén (lit. "go through the back door" — to use connections), 炒冷饭 chǎo lěngfàn (lit. "fry cold rice" — to rehash old material).</p>
<h3>Proverbs &amp; common sayings (谚语 yànyǔ / 俗语 súyǔ)</h3>
<p>Folk wisdom in full-sentence form: 早起的鸟儿有虫吃 zǎoqǐ de niǎor yǒu chóng chī ("the early bird gets the worm").</p>
<h3>How the lexicon keeps growing</h3>
<ul>
<li><strong>New words (新词 xīncí)</strong> for new things: 网红 wǎnghóng (internet celebrity/influencer).</li>
<li><strong>Internet/pop vocabulary (网络语言)</strong>: 内卷 nèijuǎn (involution — exhausting internal competition), 躺平 tǎngpíng (lit. "lie flat" — opting out of the rat race).</li>
<li><strong>Loanwords (外来词 wàiláicí)</strong>, mostly phonetic transliterations: 沙发 shāfā (sofa), 咖啡 kāfēi (coffee), 巴士 bāshì (bus).</li>
</ul>
<div class="callout"><span class="badge">成语 vs 惯用语</span> 成语 is literary, fixed, usually 4 characters, opaque without knowing the story; 惯用语 is colloquial, shorter, and its figurative meaning is usually guessable from the words themselves.</div>`,
    `<span class="eyebrow">CPL401 · Chương 5 · Phát triển từ vựng</span>
<h2>Thành ngữ, quán ngữ &amp; sự phát triển từ vựng</h2>
<h3>Thành ngữ (成语 chéngyǔ)</h3>
<p>Cụm cố định 4 chữ, đa phần bắt nguồn từ điển tích, ngụ ngôn hoặc lịch sử, nghĩa không thể suy trực tiếp từ từng chữ: <strong>守株待兔 shǒu zhū dài tù</strong> (nghĩa gốc "giữ gốc cây đợi thỏ" — ngồi chờ vận may thay vì hành động), <strong>画蛇添足 huà shé tiān zú</strong> (nghĩa gốc "vẽ rắn thêm chân" — làm hỏng việc vì thừa thãi).</p>
<h3>Quán ngữ (惯用语 guànyòngyǔ)</h3>
<p>Ngắn hơn và khẩu ngữ hơn 成语, thường 3 âm tiết, hay có cấu trúc động-tân và mang tính ẩn dụ: 走后门 zǒu hòumén (nghĩa gốc "đi cửa sau" — dùng quan hệ/chạy chọt), 炒冷饭 chǎo lěngfàn (nghĩa gốc "xào cơm nguội" — nhắc lại chuyện cũ).</p>
<h3>Tục ngữ &amp; ngạn ngữ (谚语 yànyǔ / 俗语 súyǔ)</h3>
<p>Kinh nghiệm dân gian ở dạng câu hoàn chỉnh: 早起的鸟儿有虫吃 zǎoqǐ de niǎor yǒu chóng chī ("chim dậy sớm có sâu ăn").</p>
<h3>Từ vựng phát triển thế nào</h3>
<ul>
<li><strong>Từ mới (新词 xīncí)</strong> đặt ra cho sự vật mới: 网红 wǎnghóng (người nổi tiếng trên mạng).</li>
<li><strong>Từ vựng mạng/thời sự (网络语言)</strong>: 内卷 nèijuǎn (cuộn nội — cạnh tranh nội bộ kiệt sức), 躺平 tǎngpíng (nghĩa gốc "nằm thẳng" — buông bỏ cuộc đua).</li>
<li><strong>Từ mượn phiên âm (外来词 wàiláicí)</strong>: 沙发 shāfā (sofa), 咖啡 kāfēi (cà phê), 巴士 bāshì (bus).</li>
</ul>
<div class="callout"><span class="badge">成语 khác 惯用语</span> 成语 mang tính văn học, cố định, thường 4 chữ, không biết điển tích thì không hiểu nghĩa; 惯用语 khẩu ngữ hơn, ngắn hơn, và nghĩa ẩn dụ thường đoán được ngay từ các chữ trong đó.</div>`,
  ]]);

const c5q = quiz('cpl401-quiz-5', 'Quiz 5 — Idioms &amp; vocabulary growth|||Quiz 5 — Thành ngữ &amp; phát triển từ vựng', [
  { id: 'q1', question: '"成语" (chéngyǔ) thường có đặc điểm gì?', options: ['Tự do thay đổi từ ngữ tuỳ ý', 'Cố định, thường 4 chữ, gốc từ điển tích/lịch sử', 'Chỉ dùng trong văn nói suồng sã', 'Luôn là từ vay mượn nước ngoài'], correctIndex: 1, explanation: '成语 là cụm cố định, thường 4 chữ, phần lớn bắt nguồn từ điển tích/ngụ ngôn/lịch sử — nghĩa không suy trực tiếp từ từng chữ được.' },
  { id: 'q2', question: '"沙发" (shāfā, ghế sofa) là ví dụ của loại từ nào?', options: ['Thành ngữ', 'Từ láy', 'Từ mượn phiên âm (外来词)', 'Từ đơn hai hình vị (联绵词)'], correctIndex: 2, explanation: '沙发 mô phỏng âm "sofa" của tiếng nước ngoài, không mang nghĩa gốc của 沙 (cát) hay 发 (phát) — đây là từ mượn phiên âm.' },
  { id: 'q3', question: '"躺平" (tǎngpíng) là ví dụ của loại từ vựng nào?', options: ['Thành ngữ cổ điển', 'Từ vựng mạng/thời sự mới (网络语言)', 'Quán ngữ cổ từ điển tích', 'Từ trái nghĩa có mức độ'], correctIndex: 1, explanation: '躺平 là từ mới xuất hiện trên mạng xã hội Trung Quốc, chỉ tâm lý buông bỏ cạnh tranh — thuộc lớp từ vựng mạng đang phát triển.' },
]);

const c6 = doc('cpl401-6-1-origins-evolution-hanzi', 'Chapter 6 — Origins &amp; evolution of Chinese characters: oracle bones to regular script|||Chương 6 — Nguồn gốc &amp; diễn biến chữ Hán: từ giáp cốt văn đến khải thư',
  'Diễn biến chữ Hán: giáp cốt văn (甲骨文) → kim văn (金文) → triện thư (篆书) → lệ thư (隶书) → khải thư (楷书).',
  [[
    `<span class="eyebrow">CPL401 · Chapter 6 · Character history</span>
<h2>Origins &amp; evolution of Chinese characters: oracle bones to regular script</h2>
<p class="lead">汉字 (Hànzì) evolved over more than 3,000 years through a sequence of script styles, each shaped by its writing material and era.</p>
<pre><code>甲骨文 jiǎgǔwén   Oracle bone script     ~1250-1050 BCE  (Shang: carved on turtle shell/ox bone)
金文   jīnwén     Bronze inscriptions    ~1046-221 BCE   (cast on ritual bronze vessels)
篆书   zhuànshū   Seal script            大篆 (Zhou) -> 小篆 (Qin, standardized by Li Si, 221 BCE)
隶书   lìshū      Clerical script        Han dynasty -- strokes flattened for the brush
楷书   kǎishū     Regular script         from Han/Wei-Jin onward -- the modern standard
</code></pre>
<h3>What changed at each step</h3>
<ul>
<li><strong>甲骨文 → 金文</strong>: from angular carved lines to rounder cast forms.</li>
<li><strong>金文 → 篆书</strong>: the Qin unification (221 BCE) standardized regional variants into one script, 小篆, across the empire.</li>
<li><strong>篆书 → 隶书</strong>: the brush replaced the knife/stylus; curved seal-script lines became flat horizontal/vertical strokes — the single biggest jump toward the modern look.</li>
<li><strong>隶书 → 楷书</strong>: strokes settled into the fixed shapes still taught today; 楷书 has been the print/handwriting standard for roughly 1,800 years.</li>
</ul>
<p>Two cursive-adjacent styles, 草书 cǎoshū (cursive) and 行书 xíngshū (semi-cursive/running), developed alongside 楷书 as calligraphic registers rather than replacement stages.</p>
<div class="callout"><span class="badge">One character, one long history</span> 马 (mǎ, horse) began as a pictograph of a horse's mane and legs in 甲骨文, and its traditional 楷书 form 馬 still keeps the four legs as four dots at the bottom.</div>`,
    `<span class="eyebrow">CPL401 · Chương 6 · Lịch sử văn tự</span>
<h2>Nguồn gốc &amp; diễn biến chữ Hán: từ giáp cốt văn đến khải thư</h2>
<p class="lead">汉字 (chữ Hán) đã trải qua hơn 3.000 năm phát triển qua nhiều kiểu chữ, mỗi kiểu chịu ảnh hưởng của vật liệu viết và thời đại.</p>
<pre><code>甲骨文 jiǎgǔwén   Giáp cốt văn      ~1250-1050 TCN  (nhà Thương: khắc trên mai rùa/xương bò)
金文   jīnwén     Kim văn           ~1046-221 TCN   (đúc trên đồ đồng nghi lễ)
篆书   zhuànshū   Triện thư         大篆 (nhà Chu) -> 小篆 (nhà Tần, Lý Tư chuẩn hoá, 221 TCN)
隶书   lìshū      Lệ thư            nhà Hán -- nét được làm thẳng để viết bằng bút lông
楷书   kǎishū     Khải thư          từ Hán/Ngụy-Tấn về sau -- chuẩn hiện đại
</code></pre>
<h3>Mỗi bước thay đổi những gì</h3>
<ul>
<li><strong>甲骨文 → 金文</strong>: từ nét khắc góc cạnh sang hình dáng tròn hơn do đúc khuôn.</li>
<li><strong>金文 → 篆书</strong>: sau khi thống nhất Trung Quốc (221 TCN), nhà Tần chuẩn hoá các biến thể vùng miền thành một kiểu chữ chung — 小篆 — trên toàn đế quốc.</li>
<li><strong>篆书 → 隶书</strong>: bút lông thay cho dao/bút khắc; nét cong của triện thư biến thành nét ngang/dọc thẳng — bước nhảy lớn nhất hướng tới hình dạng chữ Hán hiện đại.</li>
<li><strong>隶书 → 楷书</strong>: nét chữ định hình cố định như ngày nay vẫn dạy; 楷书 là chuẩn in ấn/viết tay khoảng 1.800 năm nay.</li>
</ul>
<p>Hai kiểu gần với thảo thư, 草书 cǎoshū (thảo thư) và 行书 xíngshū (hành thư), phát triển song song với 楷书 như các thể viết thư pháp, không phải các giai đoạn thay thế.</p>
<div class="callout"><span class="badge">Một chữ, một lịch sử dài</span> 马 (mǎ, con ngựa) khởi đầu là hình vẽ bờm và chân ngựa trong 甲骨文, và dạng phồn thể 馬 trong khải thư vẫn giữ bốn chân ngựa dưới dạng bốn dấu chấm ở đáy chữ.</div>`,
  ]]);

const c6q = quiz('cpl401-quiz-6', 'Quiz 6 — Origins &amp; evolution of characters|||Quiz 6 — Nguồn gốc &amp; diễn biến chữ Hán', [
  { id: 'q1', question: 'Sắp xếp đúng trình tự các kiểu chữ Hán từ cổ đến hiện đại?', options: ['楷书 → 隶书 → 篆书 → 甲骨文', '甲骨文 → 金文 → 篆书 → 隶书 → 楷书', '金文 → 甲骨文 → 楷书 → 隶书', '篆书 → 甲骨文 → 隶书 → 楷书'], correctIndex: 1, explanation: 'Trình tự đúng là giáp cốt văn (甲骨文) → kim văn (金文) → triện thư (篆书) → lệ thư (隶书) → khải thư (楷书).' },
  { id: 'q2', question: 'Ai chủ trì việc chuẩn hoá chữ viết thành 小篆 sau khi nhà Tần thống nhất Trung Quốc (221 TCN)?', options: ['Lý Tư (李斯), theo lệnh Tần Thuỷ Hoàng', 'Khổng Tử', 'Võ Tắc Thiên', 'Không ai — tự phát triển tự nhiên, không có chính sách nào'], correctIndex: 0, explanation: 'Tần Thuỷ Hoàng ra lệnh thống nhất chữ viết, và thừa tướng Lý Tư (李斯) chủ trì việc chuẩn hoá thành 小篆 (tiểu triện) trên toàn đế quốc.' },
  { id: 'q3', question: 'Bước chuyển nào được coi là thay đổi lớn nhất hướng tới hình dạng chữ Hán hiện đại (nét cong triện thư đổi thành nét thẳng ngang/dọc)?', options: ['甲骨文 → 金文', '篆书 → 隶书', '隶书 → 楷书', '楷书 → 草书'], correctIndex: 1, explanation: 'Khi triện thư (篆书) chuyển sang lệ thư (隶书), bút lông thay cho dao khắc, nét cong triện thư trở thành nét ngang/dọc thẳng — bước nhảy lớn nhất về hình dạng.' },
]);

const c7 = doc('cpl401-7-1-liushu-radicals', 'Chapter 7 — Character formation: the Six Categories (六书) &amp; radicals (部首)|||Chương 7 — Cấu tạo chữ Hán: lục thư (六书) &amp; bộ thủ (部首)',
  'Lục thư (六书): tượng hình, chỉ sự, hội ý, hình thanh, chuyển chú, giả tá; bộ thủ (部首) và cách tra chữ.',
  [[
    `<span class="eyebrow">CPL401 · Chapter 7 · Character structure</span>
<h2>Character formation: the Six Categories (六书) &amp; radicals (部首)</h2>
<h3>六书 liùshū — the six traditional categories</h3>
<table>
<tr><th>Category</th><th>Meaning</th><th>Example</th></tr>
<tr><td>象形 xiàngxíng</td><td>pictograph — draws the object's shape</td><td>山 shān (mountain), 日 rì (sun), 木 mù (tree)</td></tr>
<tr><td>指事 zhǐshì</td><td>indicative — an abstract symbol/diagram</td><td>上 shàng (up), 下 xià (down)</td></tr>
<tr><td>会意 huìyì</td><td>compound ideograph — combine meanings</td><td>休 xiū (rest) = 人 (person) + 木 (tree); 明 míng (bright) = 日 (sun) + 月 (moon)</td></tr>
<tr><td>形声 xíngshēng</td><td>phono-semantic — one part meaning, one part sound</td><td>妈 mā (mother) = 女 nǚ (meaning: female) + 马 mǎ (sound: mǎ→mā)</td></tr>
<tr><td>转注 zhuǎnzhù</td><td>derivative cognate — related characters share root meaning</td><td>老 lǎo / 考 kǎo (both relate to "old/aged")</td></tr>
<tr><td>假借 jiǎjiè</td><td>phonetic loan — borrow an existing character for its sound</td><td>来 lái, originally a wheat pictograph, borrowed for "to come" (same sound)</td></tr>
</table>
<p>形声 (phono-semantic) characters make up roughly 80% of all 汉字 — by far the most productive category, which is why spotting the <strong>semantic radical</strong> and the <strong>phonetic component</strong> inside a character is the single most useful decoding skill.</p>
<h3>部首 bùshǒu — radicals</h3>
<p>The 214 <strong>Kangxi radicals</strong> (康熙部首) are the indexing keys used to look characters up in a dictionary, and they usually carry the semantic side of a 形声 character:</p>
<pre><code>氵 (water)    河 hé river, 海 hǎi sea, 汗 hàn sweat
木 (wood)     树 shù tree, 林 lín forest, 桌 zhuō table
火 (fire)     烧 shāo to burn, 灯 dēng lamp, 炒 chǎo to fry
心/忄 (heart)  想 xiǎng to think, 情 qíng feeling, 快 kuài happy/fast
</code></pre>
<div class="callout"><span class="badge">Decoding a new character</span> See 河 (hé, river)? 氵 tells you it is water-related; 可 (kě) tells you it sounds close to "hé/kě". That two-part logic works for the majority of characters you will meet.</div>`,
    `<span class="eyebrow">CPL401 · Chương 7 · Cấu tạo chữ</span>
<h2>Cấu tạo chữ Hán: lục thư (六书) &amp; bộ thủ (部首)</h2>
<h3>六书 (lục thư) — sáu loại cấu tạo chữ Hán truyền thống</h3>
<table>
<tr><th>Loại</th><th>Ý nghĩa</th><th>Ví dụ</th></tr>
<tr><td>象形 xiàngxíng (tượng hình)</td><td>vẽ theo hình dạng của vật</td><td>山 shān (núi), 日 rì (mặt trời), 木 mù (cây)</td></tr>
<tr><td>指事 zhǐshì (chỉ sự)</td><td>ký hiệu/sơ đồ trừu tượng</td><td>上 shàng (trên), 下 xià (dưới)</td></tr>
<tr><td>会意 huìyì (hội ý)</td><td>ghép nghĩa của các bộ phận</td><td>休 xiū (nghỉ) = 人 (người) + 木 (cây); 明 míng (sáng) = 日 (mặt trời) + 月 (mặt trăng)</td></tr>
<tr><td>形声 xíngshēng (hình thanh)</td><td>một phần chỉ nghĩa, một phần chỉ âm</td><td>妈 mā (mẹ) = 女 nǚ (nghĩa: nữ) + 马 mǎ (âm: mǎ→mā)</td></tr>
<tr><td>转注 zhuǎnzhù (chuyển chú)</td><td>các chữ liên quan chia sẻ nghĩa gốc</td><td>老 lǎo / 考 kǎo (đều liên quan đến "già/cao tuổi")</td></tr>
<tr><td>假借 jiǎjiè (giả tá)</td><td>mượn chữ có sẵn để lấy âm</td><td>来 lái, nguyên là hình vẽ cây lúa mạch, mượn để chỉ "đến" (cùng âm)</td></tr>
</table>
<p>Chữ 形声 (hình thanh) chiếm khoảng 80% tổng số 汉字 — loại năng sản nhất, vì vậy nhận diện được <strong>bộ mang nghĩa</strong> và <strong>phần mang âm</strong> trong một chữ là kỹ năng đọc-đoán chữ hữu ích nhất.</p>
<h3>部首 (bộ thủ)</h3>
<p>214 <strong>bộ thủ Khang Hy</strong> (康熙部首) là các khoá tra chữ trong từ điển, và thường mang phần nghĩa của một chữ hình thanh:</p>
<pre><code>氵 (nước)     河 hé sông, 海 hǎi biển, 汗 hàn mồ hôi
木 (gỗ)       树 shù cây, 林 lín rừng, 桌 zhuō cái bàn
火 (lửa)      烧 shāo đốt, 灯 dēng đèn, 炒 chǎo xào
心/忄 (tim)    想 xiǎng nghĩ, 情 qíng tình cảm, 快 kuài vui/nhanh
</code></pre>
<div class="callout"><span class="badge">Đoán một chữ mới</span> Thấy 河 (hé, sông)? 氵 báo cho biết chữ liên quan đến nước; 可 (kě) báo âm đọc gần "hé/kě". Cách suy luận hai phần này áp dụng được cho phần lớn chữ Hán bạn sẽ gặp.</div>`,
  ]]);

const c7q = quiz('cpl401-quiz-7', 'Quiz 7 — Liushu &amp; radicals|||Quiz 7 — Lục thư &amp; bộ thủ', [
  { id: 'q1', question: 'Chữ "妈" (mā, mẹ) = 女 + 马 thuộc loại nào trong lục thư?', options: ['象形 (tượng hình)', '会意 (hội ý)', '形声 (hình thanh)', '假借 (giả tá)'], correctIndex: 2, explanation: '妈 gồm 女 (mang nghĩa: nữ) và 马 (mang âm: mǎ→mā) — đúng cấu trúc một-phần-nghĩa một-phần-âm của 形声.' },
  { id: 'q2', question: 'Loại chữ nào chiếm khoảng 80% tổng số chữ Hán hiện có?', options: ['象形 (tượng hình)', '指事 (chỉ sự)', '形声 (hình thanh)', '假借 (giả tá)'], correctIndex: 2, explanation: '形声 là loại năng sản nhất trong lục thư, chiếm khoảng 80% chữ Hán, vì có thể ghép tự do một bộ nghĩa với một bộ âm.' },
  { id: 'q3', question: '部首 (bùshǒu, bộ thủ) dùng để làm gì?', options: ['Chỉ thanh điệu của chữ', 'Là khoá tra chữ trong từ điển, thường mang phần nghĩa', 'Chỉ cách phát âm chính xác của chữ', 'Chỉ số nét bút bắt buộc phải viết'], correctIndex: 1, explanation: '214 bộ thủ Khang Hy là hệ thống khoá để tra chữ trong từ điển, và trong một chữ hình thanh, bộ thủ thường là phần mang nghĩa.' },
]);

const c8 = doc('cpl401-8-1-simplified-traditional', 'Chapter 8 — Simplified vs traditional characters &amp; modern standardization|||Chương 8 — Chữ giản thể vs phồn thể &amp; chuẩn hoá chữ Hán hiện đại',
  'Giản thể (简体字) và phồn thể (繁体字); các cách giản hoá chữ Hán; mốc chuẩn hoá 1956/1986/2013.',
  [[
    `<span class="eyebrow">CPL401 · Chapter 8 · Simplified vs traditional</span>
<h2>Simplified vs traditional characters &amp; modern standardization</h2>
<h3>繁体字 vs 简体字</h3>
<p><strong>繁体字 fántǐzì</strong> (traditional characters) are the historical forms carried on from 楷书; <strong>简体字 jiǎntǐzì</strong> (simplified characters) are officially reduced forms promoted in Mainland China from 1956 onward to speed up literacy.</p>
<h3>Simplification methods</h3>
<ul>
<li><strong>Reduce strokes</strong> of the same shape: 語 (14 strokes) → 语 (9 strokes), yǔ, "language".</li>
<li><strong>Adopt cursive shapes as the new standard (草书楷化)</strong>: 書 → 书 (shū, book/write).</li>
<li><strong>Merge two or more traditional characters into one simplified form</strong>: 髮 (hair) and 發 (to emit/develop) both simplify to <strong>发</strong> — context now disambiguates 头发 tóufa (hair) from 发展 fāzhǎn (development).</li>
<li><strong>Homophone substitution</strong>: 穀 (grain) simplified using the simpler, same-sound 谷 (valley).</li>
</ul>
<h3>Everyday examples</h3>
<pre><code>Traditional  Simplified  pinyin    meaning
愛           爱          ài        love     (心 "heart" dropped from inside)
車           车          chē       car/cart
國           国          guó       country
飛           飞          fēi       to fly
馬           马          mǎ        horse
</code></pre>
<h3>Standardization timeline</h3>
<p><strong>1956</strong> — 汉字简化方案 (Chinese Character Simplification Scheme) first promulgated in the PRC. <strong>1986</strong> — the scheme reaffirmed after a brief, unpopular "second round" was withdrawn. <strong>2013</strong> — 通用规范汉字表 (List of Commonly Used Standardized Characters, 8,105 characters) became the current official reference.</p>
<h3>Where each is used today</h3>
<p><strong>Simplified</strong>: Mainland China, Singapore. <strong>Traditional</strong>: Taiwan, Hong Kong, Macau, and much of the overseas Chinese diaspora.</p>
<div class="callout"><span class="badge">Not a different language</span> Simplified and traditional characters write the SAME Mandarin — same grammar, same pronunciation, same vocabulary. The difference is graphemic, though a few merges (like 发) genuinely need context to disambiguate.</div>`,
    `<span class="eyebrow">CPL401 · Chương 8 · Giản thể vs phồn thể</span>
<h2>Chữ giản thể vs phồn thể &amp; chuẩn hoá chữ Hán hiện đại</h2>
<h3>繁体字 vs 简体字</h3>
<p><strong>繁体字 fántǐzì</strong> (chữ phồn thể) là hình thức lịch sử nối tiếp từ khải thư; <strong>简体字 jiǎntǐzì</strong> (chữ giản thể) là hình thức được rút gọn chính thức, ban hành ở Trung Quốc đại lục từ năm 1956 để tăng tốc độ biết chữ.</p>
<h3>Các cách giản hoá</h3>
<ul>
<li><strong>Giảm số nét</strong> trong cùng một hình: 語 (14 nét) → 语 (9 nét), yǔ, "ngôn ngữ".</li>
<li><strong>Dùng dạng thảo thư làm chuẩn mới (草书楷化)</strong>: 書 → 书 (shū, sách/viết).</li>
<li><strong>Gộp hai hay nhiều chữ phồn thể vào một chữ giản thể</strong>: 髮 (tóc) và 發 (phát ra/phát triển) đều giản hoá thành <strong>发</strong> — nay dựa vào ngữ cảnh để phân biệt 头发 tóufa (tóc) với 发展 fāzhǎn (phát triển).</li>
<li><strong>Thay bằng chữ đồng âm đơn giản hơn</strong>: 穀 (lúa, hạt cốc) giản hoá dùng chữ 谷 (thung lũng) đơn giản hơn, cùng âm.</li>
</ul>
<h3>Ví dụ thường gặp</h3>
<pre><code>Phồn thể     Giản thể    pinyin    Nghĩa
愛           爱          ài        yêu     (bỏ bộ 心 "tim" bên trong)
車           车          chē       xe
國           国          guó       nước, quốc gia
飛           飞          fēi       bay
馬           马          mǎ        ngựa
</code></pre>
<h3>Các mốc chuẩn hoá</h3>
<p><strong>1956</strong> — 汉字简化方案 (Phương án giản hoá chữ Hán) được ban hành lần đầu ở Trung Quốc. <strong>1986</strong> — phương án được khẳng định lại sau khi một "vòng hai" giản hoá không được ưa chuộng bị rút lại. <strong>2013</strong> — 通用规范汉字表 (Bảng chữ Hán chuẩn thông dụng, 8.105 chữ) trở thành bảng tham chiếu chính thức hiện hành.</p>
<h3>Nơi mỗi kiểu chữ được dùng ngày nay</h3>
<p><strong>Giản thể</strong>: Trung Quốc đại lục, Singapore. <strong>Phồn thể</strong>: Đài Loan, Hồng Kông, Ma Cao, và phần lớn cộng đồng người Hoa hải ngoại.</p>
<div class="callout"><span class="badge">Không phải hai ngôn ngữ khác nhau</span> Chữ giản thể và phồn thể ghi lại CÙNG một tiếng Quan Thoại — cùng ngữ pháp, cùng cách đọc, cùng từ vựng. Khác biệt chỉ ở hình chữ, tuy một số trường hợp gộp chữ (như 发) thật sự cần ngữ cảnh để phân biệt.</div>`,
  ]]);

const c8q = quiz('cpl401-quiz-8', 'Quiz 8 — Simplified vs traditional characters|||Quiz 8 — Giản thể vs phồn thể', [
  { id: 'q1', question: '简体字 (chữ giản thể) được nhà nước Trung Quốc ban hành chính thức lần đầu vào năm nào?', options: ['1919', '1949', '1956', '1986'], correctIndex: 2, explanation: 'Năm 1956, 汉字简化方案 (Phương án giản hoá chữ Hán) được ban hành lần đầu tiên tại Trung Quốc đại lục.' },
  { id: 'q2', question: 'Trường hợp 髮 và 發 cùng giản hoá thành "发" là ví dụ của phương pháp giản hoá nào?', options: ['Giảm số nét trong cùng một hình', 'Gộp nhiều chữ phồn thể vào một chữ giản thể', 'Thay bằng chữ đồng âm khác nghĩa', 'Dùng dạng thảo thư làm chuẩn mới'], correctIndex: 1, explanation: '髮 (tóc) và 發 (phát triển) là hai chữ phồn thể khác nhau nhưng cùng được gộp thành một chữ giản thể duy nhất là 发.' },
  { id: 'q3', question: 'Chữ giản thể và chữ phồn thể khác nhau chủ yếu ở điểm nào?', options: ['Ngữ pháp và từ vựng hoàn toàn khác nhau', 'Cách phát âm khác nhau', 'Chỉ khác hình chữ (số nét/hình dạng), cùng ghi một tiếng Quan Thoại', 'Là hai phương ngữ khác nhau của tiếng Trung'], correctIndex: 2, explanation: 'Giản thể và phồn thể chỉ khác về hình dạng chữ viết; ngữ pháp, cách đọc và từ vựng của tiếng Quan Thoại đều giữ nguyên, trừ vài trường hợp gộp chữ cần ngữ cảnh.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CPL401',
    slug: 'cpl401-phonetics-lexicology-chinese-character',
    title: 'Phonetics - Lexicology - Chinese Character',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CPL401.webp',
    shortDescription: 'Chinese linguistics: phonetics (initials, finals, tones), lexicology (word formation, meaning, idioms) and Chinese characters (evolution, the six categories, radicals, simplified vs traditional).|||Ngôn ngữ học tiếng Trung: ngữ âm (thanh mẫu, vận mẫu, thanh điệu), từ vựng (cấu tạo từ, nghĩa từ, thành ngữ) và văn tự Hán (diễn biến chữ, lục thư, bộ thủ, giản thể - phồn thể).',
    description: 'Môn <strong>CPL401 — Phonetics - Lexicology - Chinese Character</strong> thuộc khung chương trình ngành Ngôn ngữ Trung, kỳ 4.<br><br>Academy đã tạo sẵn môn này để bạn tra được mã môn, tên môn và vị trí trong lộ trình. <strong>Phần bài giảng chưa được dựng</strong> — khi có, toàn bộ nội dung sẽ được xây từ chính giáo trình của trường.',
    whatYouLearn: 'Chưa có nội dung. Xem giáo trình chính thức trên FLM (flm.fpt.edu.vn) để biết chuẩn đầu ra của môn.',
    requirements: 'Xem điều kiện tiên quyết trong khung chương trình ngành Ngôn ngữ Trung trên FLM.',
  },
  sections: [
    { title: 'Chương 1 — Hệ thống ngữ âm|||Chapter 1 — Phonological system', description: 'Thanh mẫu, vận mẫu, thanh điệu, pinyin.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Âm tiết &amp; biến điệu|||Chapter 2 — Syllable &amp; tone sandhi', description: 'Biến điệu, nhẹ hoá, nhi hoá.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Từ &amp; cấu tạo từ|||Chapter 3 — Words &amp; word formation', description: 'Từ đơn, từ ghép, từ láy.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Nghĩa từ|||Chapter 4 — Word meaning', description: 'Đa nghĩa, đồng nghĩa, trái nghĩa.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thành ngữ &amp; phát triển từ vựng|||Chapter 5 — Idioms &amp; vocabulary growth', description: 'Thành ngữ, quán ngữ, tục ngữ, từ mới.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nguồn gốc chữ Hán|||Chapter 6 — Origins of Chinese characters', description: 'Giáp cốt văn đến khải thư.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Cấu tạo chữ Hán|||Chapter 7 — Character structure', description: 'Lục thư, bộ thủ.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Giản thể &amp; phồn thể|||Chapter 8 — Simplified &amp; traditional', description: 'Giản hoá chữ Hán, chuẩn hoá hiện đại.', lessons: [c8, c8q] },
  ],
};
