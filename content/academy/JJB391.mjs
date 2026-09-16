/**
 * JJB391 — Japanese for JLPT/BJT. Khung 8 chương luyện thi (syl): tổng quan
 * JLPT N5-N1 & BJT, từ vựng (語彙) N2-N1, kanji (漢字) N2-N1, ngữ pháp
 * (文法) N2 & N1, đọc hiểu (読解), nghe hiểu (聴解), BJT thương mại & luyện
 * đề tổng hợp. Giáo trình trích dẫn: Shin Kanzen Master N2-N1, TRY! JLPT,
 * BJT công thức. Song ngữ + kana/kanji UTF-8 + romaji + nghĩa Việt/Anh.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('jjb391-1-1-overview', '1.1 — JLPT & BJT overview, format & strategy|||1.1 — Tổng quan JLPT & BJT, cấu trúc đề & chiến lược',
  'Các bậc JLPT N5-N1, cấu trúc đề N2/N1 (điểm sàn từng phần), BJT chấm theo thang 0-800 xếp hạng J5-J1+, chiến lược học cả khoá.',
  [[
    `<span class="eyebrow">JJB391 · Chapter 1 · Lesson 1.1</span>
<h2>JLPT (N5-N1) &amp; BJT: overview, format &amp; strategy</h2>
<p class="lead">This course targets <strong>JLPT N2-N1</strong> and the <strong>BJT (Business Japanese Test)</strong> — the two certificates most often required to work in a Japanese-speaking environment. Chapter 1 maps out both exams so you know exactly what you are training for.</p>
<h3>JLPT levels</h3>
<ul>
<li><strong>N5-N4</strong> — everyday survival Japanese.</li>
<li><strong>N3</strong> — bridge level, daily-life topics with some abstraction.</li>
<li><strong>N2</strong> — general newspaper-level topics; the common bar for skilled-worker visas and many jobs.</li>
<li><strong>N1</strong> — abstract, logically complex writing, wide vocabulary/grammar, native-speed listening; the top certificate.</li>
</ul>
<h3>N2 / N1 test structure</h3>
<pre><code>N2:  言語知識(文字・語彙・文法)・読解   105 min   180 pts total
     聴解 (listening)               50 min
     Pass: total &gt;= 90/180 AND every section &gt;= its own minimum ("基準点")
N1:  言語知識(文字・語彙・文法)・読解   110 min   180 pts total
     聴解 (listening)               60 min
     Pass: total &gt;= 100/180 AND every section &gt;= its own minimum
</code></pre>
<div class="callout"><span class="badge">The trap</span> A high total score does NOT guarantee a pass — JLPT fails you if ANY single section (vocab/grammar/reading, or listening) falls below its own minimum, even when your total clears the bar.</div>
<h3>BJT — Business Japanese Test</h3>
<p>The <strong>BJT</strong> measures Japanese used <em>at work</em>: phone calls, e-mails, meetings, negotiation, keigo (honorific speech), listening and reading combined in one integrated section. It is scored <strong>0-800</strong> and mapped to bands <strong>J5 (beginner) → J1+ (near-native business fluency)</strong>, rather than pass/fail.</p>
<h3>Strategy for this course</h3>
<ol>
<li>Chapters 2-3 build the N2-N1 vocabulary/kanji base the exam assumes you already have.</li>
<li>Chapters 4-5 drill the grammar patterns that actually recur on past papers.</li>
<li>Chapters 6-7 train reading and listening <em>technique</em>, not just language.</li>
<li>Chapter 8 applies everything to BJT-style business scenarios and full mock tests.</li>
</ol>`,
    `<span class="eyebrow">JJB391 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan JLPT (N5-N1) &amp; BJT, cấu trúc đề &amp; chiến lược</h2>
<p class="lead">Môn này luyện thi <strong>JLPT N2-N1</strong> và <strong>BJT (Business Japanese Test)</strong> — hai chứng chỉ được yêu cầu nhiều nhất khi làm việc trong môi trường nói tiếng Nhật. Chương 1 vẽ bản đồ cả hai kỳ thi để bạn biết chính xác mình đang luyện cho cái gì.</p>
<h3>Các bậc JLPT</h3>
<ul>
<li><strong>N5-N4</strong> — tiếng Nhật sinh hoạt cơ bản hằng ngày.</li>
<li><strong>N3</strong> — bậc cầu nối, chủ đề đời sống có phần trừu tượng.</li>
<li><strong>N2</strong> — chủ đề tổng quát mức báo chí; ngưỡng phổ biến cho visa kỹ năng đặc định và nhiều việc làm.</li>
<li><strong>N1</strong> — văn bản trừu tượng, lập luận phức tạp, vốn từ/ngữ pháp rộng, nghe tốc độ người bản xứ; chứng chỉ cao nhất.</li>
</ul>
<h3>Cấu trúc đề N2 / N1</h3>
<pre><code>N2:  言語知識(文字・語彙・文法)・読解   105 phút   tổng 180 điểm
     聴解 (nghe hiểu)               50 phút
     Đậu: tổng &gt;= 90/180 VÀ mỗi phần &gt;= điểm sàn ("基準点") riêng
N1:  言語知識(文字・語彙・文法)・読解   110 phút   tổng 180 điểm
     聴解 (nghe hiểu)               60 phút
     Đậu: tổng &gt;= 100/180 VÀ mỗi phần &gt;= điểm sàn riêng
</code></pre>
<div class="callout"><span class="badge">Cái bẫy</span> Tổng điểm cao KHÔNG đảm bảo đậu — JLPT đánh rớt nếu BẤT KỲ phần nào (từ vựng/ngữ pháp/đọc hiểu, hoặc nghe) dưới điểm sàn riêng của phần đó, dù tổng điểm đã đủ.</div>
<h3>BJT — Business Japanese Test</h3>
<p><strong>BJT</strong> đo tiếng Nhật dùng <em>trong công việc</em>: gọi điện, email, họp, đàm phán, kính ngữ — nghe và đọc gộp chung trong một phần thi tích hợp. Đề chấm theo thang <strong>0-800</strong> và quy về các hạng <strong>J5 (mới bắt đầu) → J1+ (gần bản xứ trong công việc)</strong>, thay vì đậu/rớt.</p>
<h3>Chiến lược cho cả môn</h3>
<ol>
<li>Chương 2-3 dựng nền từ vựng/kanji N2-N1 mà đề thi mặc định bạn đã biết.</li>
<li>Chương 4-5 luyện đúng các mẫu ngữ pháp thật sự lặp lại trong đề thi thật.</li>
<li>Chương 6-7 luyện KỸ NĂNG đọc hiểu và nghe hiểu, không chỉ luyện ngôn ngữ.</li>
<li>Chương 8 áp dụng tất cả vào tình huống thương mại kiểu BJT và đề thi thử đầy đủ.</li>
</ol>`,
  ]]);

const c1q = quiz('jjb391-quiz-1', 'Quiz 1 — JLPT & BJT overview|||Quiz 1 — Tổng quan JLPT & BJT', [
  { id: 'q1', question: 'Vì sao thí sinh JLPT N2/N1 có thể rớt dù TỔNG điểm đủ?', options: ['Vì đề thi chấm ngẫu nhiên', 'Vì một phần thi (vd nghe) dưới điểm sàn riêng của phần đó', 'Vì phải thi lại mỗi năm', 'Vì tổng điểm không tính phần nghe'], correctIndex: 1, explanation: 'JLPT có điểm sàn (基準点) riêng cho từng phần; dưới sàn một phần là rớt dù tổng đủ.' },
  { id: 'q2', question: 'BJT chấm điểm theo hình thức nào?', options: ['Đậu/Rớt như JLPT', 'Thang điểm 0-800, quy về hạng J5 → J1+', 'Chỉ có 2 mức Pass/Fail', 'Không chấm điểm, chỉ nhận xét'], correctIndex: 1, explanation: 'BJT dùng thang 0-800 và quy về các hạng từ J5 (thấp) đến J1+ (cao nhất).' },
  { id: 'q3', question: 'Phần 言語知識・読解 của đề N1 kéo dài bao lâu?', options: ['50 phút', '60 phút', '105 phút', '110 phút'], correctIndex: 3, explanation: 'N1: 言語知識(文字・語彙・文法)・読解 dài 110 phút; 聴解 dài 60 phút.' },
]);

const c2 = doc('jjb391-2-1-vocab', '2.1 — Vocabulary (語彙) N2-N1: compounds, Sino-Japanese, loanwords|||2.1 — Từ vựng (語彙) N2-N1: từ ghép, từ Hán, ngoại lai',
  'Từ ghép Hán 2 kanji (音読み), phân biệt đồng âm khác nghĩa, từ ngoại lai カタカナ語, mẹo học theo nhóm chủ đề & cặp đối nghĩa.',
  [[
    `<span class="eyebrow">JJB391 · Chapter 2 · Lesson 2.1</span>
<h2>Vocabulary (語彙) N2-N1</h2>
<p>N2-N1 vocabulary is mostly <strong>two-kanji compounds read with 音読み (on'yomi)</strong> — abstract, "newspaper-style" words. Recognizing the kanji lets you guess meaning even for words you have never heard.</p>
<h3>Core N2-N1 compound vocabulary</h3>
<pre><code>影響  えいきょう  eikyou    anh hưởng / influence
状況  じょうきょう joukyou   tinh huong / situation
対応  たいおう    taiou     doi ung, xu ly / respond, handle
検討  けんとう    kentou    xem xet, can nhac / consider
維持  いじ        iji       duy tri / maintain
増加  ぞうか      zouka     gia tang / increase   (⇔ 減少 genshou)
減少  げんしょう  genshou   giam sut / decrease
</code></pre>
<h3>Loanwords (カタカナ語)</h3>
<pre><code>インフラ      infura        ha tang / infrastructure
カテゴリー    kategorii     hang muc / category
モチベーション mochibeeshon  dong luc / motivation
</code></pre>
<h3>Watch the homophones (同音異義語)</h3>
<p>Same reading <code>いし (ishi)</code>, three unrelated meanings: <strong>意志</strong> (will/intent), <strong>医師</strong> (doctor), <strong>石</strong> (stone). Context — and the kanji — is what disambiguates them; this is exactly why 語彙 questions test kanji recognition, not just sound.</p>
<div class="callout"><span class="badge">Study method</span> Group words by <strong>topic</strong> (economy, society, environment) and by <strong>opposite pairs</strong> (増加⇔減少) instead of an alphabetical list — it mirrors how they show up in reading passages, and pairs are twice as memorable.</div>`,
    `<span class="eyebrow">JJB391 · Chương 2 · Bài 2.1</span>
<h2>Từ vựng (語彙) N2-N1</h2>
<p>Từ vựng N2-N1 phần lớn là <strong>từ ghép 2 kanji đọc theo 音読み (âm Hán)</strong> — mang tính trừu tượng, "kiểu báo chí". Nhận được mặt kanji là đoán được nghĩa dù chưa từng nghe từ đó.</p>
<h3>Từ ghép Hán trọng tâm N2-N1</h3>
<pre><code>影響  えいきょう  eikyou    anh huong (danh tu)
状況  じょうきょう joukyou   tinh huong, hien trang
対応  たいおう    taiou     doi ung, xu ly
検討  けんとう    kentou    xem xet, can nhac
維持  いじ        iji       duy tri
増加  ぞうか      zouka     gia tang   (⇔ 減少 genshou giam sut)
減少  げんしょう  genshou   giam sut
</code></pre>
<h3>Từ ngoại lai (カタカナ語)</h3>
<pre><code>インフラ      infura        ha tang (infrastructure)
カテゴリー    kategorii     hang muc (category)
モチベーション mochibeeshon  dong luc (motivation)
</code></pre>
<h3>Cẩn thận đồng âm khác nghĩa (同音異義語)</h3>
<p>Cùng đọc <code>いし (ishi)</code>, ba nghĩa khác hẳn nhau: <strong>意志</strong> (ý chí), <strong>医師</strong> (bác sĩ), <strong>石</strong> (hòn đá). Ngữ cảnh — và mặt kanji — mới là thứ phân biệt được chúng; đây chính là lý do câu hỏi 語彙 kiểm tra khả năng nhận kanji, không chỉ nghe âm.</p>
<div class="callout"><span class="badge">Cách học</span> Nhóm từ theo <strong>chủ đề</strong> (kinh tế, xã hội, môi trường) và theo <strong>cặp đối nghĩa</strong> (増加⇔減少) thay vì học theo danh sách A-Z — vừa giống cách chúng xuất hiện trong bài đọc, vừa dễ nhớ gấp đôi nhờ đi theo cặp.</div>`,
  ]]);

const c2q = quiz('jjb391-quiz-2', 'Quiz 2 — Vocabulary N2-N1|||Quiz 2 — Từ vựng N2-N1', [
  { id: 'q1', question: 'Từ 検討 (けんとう) có nghĩa gần nhất là gì?', options: ['Ảnh hưởng', 'Xem xét, cân nhắc', 'Duy trì', 'Gia tăng'], correctIndex: 1, explanation: '検討(kentou) = xem xét, cân nhắc kỹ trước khi quyết định.' },
  { id: 'q2', question: 'Từ nào dưới đây là từ ngoại lai (カタカナ語)?', options: ['状況', 'インフラ', '対応', '減少'], correctIndex: 1, explanation: 'インフラ (infura) là từ vay mượn từ tiếng Anh "infrastructure", viết bằng katakana.' },
  { id: 'q3', question: 'Cùng đọc là "いし", từ nào KHÔNG cùng nghĩa với hai từ còn lại?', options: ['意志 (ý chí)', '医師 (bác sĩ)', '石 (hòn đá)', 'Cả ba đều khác nghĩa nhau'], correctIndex: 3, explanation: '意志/医師/石 là 3 từ đồng âm khác nghĩa hoàn toàn — chỉ phân biệt được nhờ kanji và ngữ cảnh.' },
]);

const c3 = doc('jjb391-3-1-kanji', '3.1 — Kanji (漢字) N2-N1: readings & memorization|||3.1 — Kanji (漢字) N2-N1: âm đọc & cách nhớ',
  '音読み (dùng trong từ ghép) vs 訓読み (dùng đơn lẻ); nhóm bộ thủ (部首) để đoán nghĩa/cách đọc; mẹo ghi nhớ & ôn tập theo SRS.',
  [[
    `<span class="eyebrow">JJB391 · Chapter 3 · Lesson 3.1</span>
<h2>Kanji (漢字) N2-N1</h2>
<h3>音読み vs 訓読み</h3>
<p><strong>音読み (on'yomi)</strong> — the Chinese-derived reading, used inside two-kanji <em>compounds</em> (経済 keizai). <strong>訓読み (kun'yomi)</strong> — the native Japanese reading, used when a kanji stands <em>alone</em> with okurigana (経る heru "to pass/elapse"). N2-N1 tests weight 音読み heavily because that's how compound vocabulary is built.</p>
<h3>Radicals (部首) as a memory shortcut</h3>
<p>Kanji sharing a radical often share a semantic field — group them instead of memorizing one by one:</p>
<pre><code>言 (words):   語 (ngu - language)  話 (thoai - talk)  説 (thuyet - explain)  論 (luan - argue)  討 (thao - discuss)
氵/水 (water): 済 (te - settle)     減 (giam - decrease) 温 (on - warm)      況 (huong - situation)
</code></pre>
<h3>Worked kanji</h3>
<pre><code>経  けい  kei   kinh  |  済  ざい/さい  zai/sai  te   ->  経済  けいざい  keizai   kinh te
環  かん  kan   vong  |  境  きょう      kyou      canh ->  環境  かんきょう kankyou  moi truong
増  ぞう  zou   tang  |  傾  けい        kei       khuynh -> 傾向 けいこう  keikou   xu huong
</code></pre>
<h3>How to actually memorize them</h3>
<ol>
<li>Break an unfamiliar kanji into components you already know, and invent a short story linking them to the meaning.</li>
<li>Write it by hand, in correct stroke order, several times — muscle memory sticks longer than staring.</li>
<li>Review with spaced repetition (e.g. Anki) instead of a fixed list — you spend time exactly where you keep forgetting.</li>
</ol>`,
    `<span class="eyebrow">JJB391 · Chương 3 · Bài 3.1</span>
<h2>Kanji (漢字) N2-N1</h2>
<h3>音読み và 訓読み</h3>
<p><strong>音読み (âm Hán)</strong> — âm đọc gốc Hán, dùng bên trong <em>từ ghép</em> 2 kanji (経済 keizai). <strong>訓読み (âm thuần Nhật)</strong> — dùng khi kanji đứng <em>một mình</em> kèm okurigana (経る heru "trôi qua"). Đề N2-N1 nặng về 音読み vì đó là cách từ vựng ghép được tạo ra.</p>
<h3>Bộ thủ (部首) — lối tắt để nhớ</h3>
<p>Các kanji cùng bộ thủ thường cùng một trường nghĩa — nên nhóm lại thay vì học rời từng chữ:</p>
<pre><code>言 (loi noi): 語 (ngu)  話 (thoai)  説 (thuyet)  論 (luan)  討 (thao)
氵/水 (nuoc): 済 (te - hoan tat)  減 (giam)  温 (on - am)  況 (huong - tinh huong)
</code></pre>
<h3>Kanji ví dụ có lời giải</h3>
<pre><code>経  けい  kei   kinh  |  済  ざい/さい  zai/sai  te    -> 経済  けいざい  keizai   kinh te
環  かん  kan   vong  |  境  きょう      kyou     canh  -> 環境  かんきょう kankyou  moi truong
増  ぞう  zou   tang  |  傾  けい        kei      khuynh -> 傾向 けいこう  keikou   xu huong
</code></pre>
<h3>Cách nhớ thật sự hiệu quả</h3>
<ol>
<li>Chia kanji lạ thành các bộ phận đã biết, ghép thành một câu chuyện ngắn liên tưởng tới nghĩa.</li>
<li>Viết tay đúng thứ tự nét, lặp lại vài lần — trí nhớ cơ bắp bám lâu hơn chỉ nhìn.</li>
<li>Ôn theo lặp lại ngắt quãng (vd Anki) thay vì học theo danh sách cố định — dồn thời gian đúng chỗ hay quên.</li>
</ol>`,
  ]]);

const c3q = quiz('jjb391-quiz-3', 'Quiz 3 — Kanji N2-N1|||Quiz 3 — Kanji N2-N1', [
  { id: 'q1', question: '音読み (on\'yomi) thường được dùng khi nào?', options: ['Khi kanji đứng một mình kèm okurigana', 'Bên trong từ ghép 2 kanji gốc Hán', 'Chỉ trong tên riêng', 'Chỉ trong văn nói thân mật'], correctIndex: 1, explanation: '音読み là âm Hán, dùng trong các từ ghép như 経済(keizai), 環境(kankyou).' },
  { id: 'q2', question: 'Việc nhóm kanji theo bộ thủ (部首) giúp ích gì?', options: ['Giúp viết nhanh hơn không cần đúng nét', 'Gợi ý nhóm nghĩa hoặc âm đọc liên quan giữa các kanji', 'Thay thế hoàn toàn việc học từ vựng', 'Chỉ có tác dụng với chữ Hiragana'], correctIndex: 1, explanation: 'Kanji cùng bộ thủ (vd 言, 氵) thường liên quan về nghĩa hoặc gợi ý cách đọc.' },
  { id: 'q3', question: '環境 (từ ghép của 環 và 境) đọc là gì và nghĩa là gì?', options: ['けいざい keizai — kinh tế', 'かんきょう kankyou — môi trường', 'けいこう keikou — xu hướng', 'ぞうか zouka — gia tăng'], correctIndex: 1, explanation: '環境 đọc là かんきょう (kankyou), nghĩa là "môi trường".' },
]);

const c4 = doc('jjb391-4-1-grammar-n2', '4.1 — Grammar (文法) N2: high-frequency patterns|||4.1 — Ngữ pháp (文法) N2: mẫu ngữ pháp trọng tâm',
  '8 mẫu ngữ pháp N2 hay gặp nhất trong đề thi thật: において, にもかかわらず, わけではない, 一方で, さえ~ば, に応じて, ざるを得ない, を通じて.',
  [[
    `<span class="eyebrow">JJB391 · Chapter 4 · Lesson 4.1</span>
<h2>Grammar (文法) N2</h2>
<p>These eight patterns recur constantly on N2 past papers — learn the <strong>meaning + one example</strong> for each rather than the abstract rule alone.</p>
<pre><code>~において/における   tai, trong (pham vi)     現代社会において    trong xa hoi hien dai
~にもかかわらず      mac du, bat chap         雨にもかかわらず出かけた  mac du mua van ra ngoai
~わけではない        khong co nghia la, khong han  嫌いなわけではない  khong phai la ghet
~一方で              mat khac                便利な一方で危険もある  tien loi nhung cung co nguy hiem
~さえ~ば             chi can ... la duoc      練習さえすればできる  chi can luyen tap la lam duoc
~に応じて            tuy theo                 状況に応じて対応する  xu ly tuy theo tinh huong
~ざるを得ない        buoc phai, khong the khong  認めざるを得ない  buoc phai thua nhan
~を通じて/を通して   thong qua                経験を通じて学ぶ    hoc thong qua kinh nghiem
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> N2 grammar questions test <strong>meaning nuance</strong>, not memorized forms — ~わけではない and a flat negative look similar but ~わけではない always implies "not entirely", so watch for that softening nuance in the answer choices.</div>`,
    `<span class="eyebrow">JJB391 · Chương 4 · Bài 4.1</span>
<h2>Ngữ pháp (文法) N2</h2>
<p>Tám mẫu này lặp lại liên tục trong đề N2 thật — học <strong>nghĩa + một ví dụ</strong> cho mỗi mẫu thay vì chỉ học công thức trừu tượng.</p>
<pre><code>~において/における   tai, o, trong (pham vi)   現代社会において    tai xa hoi hien dai
~にもかかわらず      mac du, bat chap          雨にもかかわらず出かけた  mac du mua van ra ngoai
~わけではない        khong co nghia la, khong han  嫌いなわけではない  khong phai la ghet
~一方で              mat khac                 便利な一方で危険もある  tien loi nhung cung co nguy hiem
~さえ~ば             chi can ... la duoc       練習さえすればできる  chi can luyen tap la lam duoc
~に応じて            tuy theo                  状況に応じて対応する  xu ly tuy theo tinh huong
~ざるを得ない        buoc phai, khong the khong  認めざるを得ない  buoc phai thua nhan
~を通じて/を通して   thong qua                 経験を通じて学ぶ    hoc thong qua kinh nghiem
</code></pre>
<div class="callout"><span class="badge">Mẹo làm bài</span> Câu hỏi ngữ pháp N2 kiểm tra <strong>sắc thái nghĩa</strong>, không chỉ công thức thuộc lòng — ~わけではない trông giống phủ định thường nhưng luôn mang nghĩa "không hẳn hoàn toàn", để ý sắc thái làm mềm này trong các đáp án.</div>`,
  ]]);

const c4q = quiz('jjb391-quiz-4', 'Quiz 4 — Grammar N2|||Quiz 4 — Ngữ pháp N2', [
  { id: 'q1', question: 'Mẫu ~わけではない mang sắc thái nào?', options: ['Phủ định hoàn toàn, tuyệt đối', 'Không có nghĩa là / không hẳn (phủ định một phần)', 'Khẳng định mạnh', 'Chỉ dùng trong văn viết trang trọng'], correctIndex: 1, explanation: '~わけではない luôn mang nghĩa "không hẳn/không hoàn toàn", làm mềm câu phủ định.' },
  { id: 'q2', question: 'Mẫu nào có nghĩa "chỉ cần ... là được"?', options: ['~に応じて', '~さえ~ば', '~を通じて', '~一方で'], correctIndex: 1, explanation: '~さえ~ば: chỉ cần điều kiện đó xảy ra là đủ, vd 練習さえすればできる.' },
  { id: 'q3', question: '~ざるを得ない diễn tả điều gì?', options: ['Sự lựa chọn tự do', 'Buộc phải làm, không thể không làm', 'Sự nghi ngờ', 'Lời mời lịch sự'], correctIndex: 1, explanation: '~ざるを得ない = bị hoàn cảnh ép buộc, không còn lựa chọn nào khác.' },
]);

const c5 = doc('jjb391-5-1-grammar-n1', '5.1 — Grammar (文法) N1: advanced patterns & written style|||5.1 — Ngữ pháp (文法) N1: mẫu nâng cao & văn viết',
  '6 mẫu N1 khó (をもって, にたえない, 始末だ, ずにはおかない, べからず, ものか) và văn viết trang trọng んがため/べく/ならでは.',
  [[
    `<span class="eyebrow">JJB391 · Chapter 5 · Lesson 5.1</span>
<h2>Grammar (文法) N1</h2>
<p>N1 grammar leans formal and literary — many patterns only appear in writing (文語), not spoken Japanese.</p>
<pre><code>~をもって            bang, voi (trang trong)   本日をもって終了します  ket thuc ke tu hom nay
~にたえない          khong chiu noi / vo cung  見るにたえない        khong no nhin
~始末だ              ket cuc la (tieu cuc)     遅刻した挙句、寝坊する始末だ  ret cuc la ngu quen
~ずにはおかない      nhat dinh se               感動させずにはおかない  chac chan se gay xuc dong
~べからず            cam, khong duoc (van viet) 芝生に入るべからず    cam vao bai co
[nghi van]+ものか    lam gi co chuyen, tuyet doi khong  そんなことがあるものか  lam gi co chuyen do
</code></pre>
<h3>Written style (文語) building blocks</h3>
<pre><code>~んがため(に)   = ~ために (trang trong hon)     成功せんがために努力する
~べく           = ~するために                    合格すべく勉強する
~ならでは       chi co o, dac trung rieng cua    この店ならではの味
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> N1's reading passages and the 文法 section quote formal writing (editorials, official notices) — these patterns are how you recognize the register, not just the meaning.</div>`,
    `<span class="eyebrow">JJB391 · Chương 5 · Bài 5.1</span>
<h2>Ngữ pháp (文法) N1</h2>
<p>Ngữ pháp N1 nghiêng về trang trọng và văn chương — nhiều mẫu chỉ xuất hiện trong văn viết (文語), không dùng khi nói.</p>
<pre><code>~をもって            bang, voi (trang trong)    本日をもって終了します  ket thuc ke tu hom nay
~にたえない          khong chiu noi / rat        見るにたえない        khong no nhin
~始末だ              ket cuc la (mang y tieu cuc) 遅刻した挙句、寝坊する始末だ  ket cuc la ngu quen
~ずにはおかない      nhat dinh se, chac chan se  感動させずにはおかない  chac chan se gay xuc dong
~べからず            cam, khong duoc (van viet)  芝生に入るべからず    cam vao bai co
[dang nghi van]+ものか  lam gi co chuyen, tuyet doi khong  そんなことがあるものか  lam gi co chuyen do
</code></pre>
<h3>Khối văn viết (文語) nền tảng</h3>
<pre><code>~んがため(に)   = ~ために (trang trong hon)      成功せんがために努力する
~べく           = ~するために                     合格すべく勉強する
~ならでは       chi co rieng o, dac trung cua     この店ならではの味
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Bài đọc và phần 文法 của N1 trích dẫn văn phong trang trọng (xã luận, thông báo chính thức) — các mẫu này giúp bạn nhận ra văn phong đó, không chỉ hiểu nghĩa đơn thuần.</div>`,
  ]]);

const c5q = quiz('jjb391-quiz-5', 'Quiz 5 — Grammar N1|||Quiz 5 — Ngữ pháp N1', [
  { id: 'q1', question: 'Mẫu ~べからず (văn viết) mang nghĩa gì?', options: ['Khuyến khích, nên làm', 'Cấm, không được làm', 'Hỏi ý kiến lịch sự', 'Diễn tả khả năng'], correctIndex: 1, explanation: '~べからず là dạng cấm đoán trang trọng, hay gặp trên biển báo/thông báo viết.' },
  { id: 'q2', question: '~んがため(に) tương đương với mẫu ngữ pháp cơ bản nào?', options: ['~ように', '~ために', '~のに', '~ばかりに'], correctIndex: 1, explanation: '~んがため(に) là dạng văn viết trang trọng của ~ために (để, nhằm mục đích).' },
  { id: 'q3', question: 'Mẫu ~にたえない thường diễn tả điều gì?', options: ['Sự cho phép', 'Cảm xúc rất mạnh / không chịu nổi', 'Khả năng làm việc gì đó dễ dàng', 'Một lời hứa'], correctIndex: 1, explanation: '~にたえない diễn tả cảm xúc mãnh liệt, thường là không chịu đựng nổi (vd 見るにたえない).' },
]);

const c6 = doc('jjb391-6-1-reading', '6.1 — Reading (読解): skills & question types|||6.1 — Đọc hiểu (読解): kỹ năng & dạng câu hỏi',
  '4 dạng câu hỏi đọc hiểu: 内容理解, 統合理解, 主張理解, 情報検索; kỹ thuật đọc câu hỏi trước, gạch từ khóa, bắt từ nối chuyển ý.',
  [[
    `<span class="eyebrow">JJB391 · Chapter 6 · Lesson 6.1</span>
<h2>Reading (読解)</h2>
<h3>The four question types</h3>
<ul>
<li><strong>内容理解</strong> (content comprehension) — short/medium/long passages, straightforward "what does the text say" questions.</li>
<li><strong>統合理解</strong> (integrated comprehension) — two short texts on the same topic; questions ask you to compare their viewpoints.</li>
<li><strong>主張理解</strong> (opinion/argument comprehension, long text) — identify the author's stance and the logic behind it, not just facts.</li>
<li><strong>情報検索</strong> (information retrieval) — a flyer, table, or ad; find one specific piece of information, no deep reading required.</li>
</ul>
<h3>Technique</h3>
<pre><code>1. Read the QUESTIONS and answer choices FIRST, then the passage — you read with a target.
2. Underline repeated key terms — they usually anchor the correct answer.
3. Watch discourse connectors: しかし/ところが (but) つまり (in short) したがって (therefore) 一方 (meanwhile)
   -> questions love to test exactly what happens right after one of these.
4. For 情報検索, SCAN for the one fact asked — do not read the whole flyer.
</code></pre>
<div class="callout"><span class="badge">Time budget</span> With reading squeezed into ~105-110 minutes together with vocab/grammar, spend seconds on 情報検索 and save your minutes for 主張理解/統合理解, which need real thinking time.</div>`,
    `<span class="eyebrow">JJB391 · Chương 6 · Bài 6.1</span>
<h2>Đọc hiểu (読解)</h2>
<h3>Bốn dạng câu hỏi</h3>
<ul>
<li><strong>内容理解</strong> (hiểu nội dung) — đoạn ngắn/vừa/dài, câu hỏi trực tiếp "văn bản nói gì".</li>
<li><strong>統合理解</strong> (hiểu tổng hợp) — hai đoạn văn ngắn cùng chủ đề; câu hỏi yêu cầu so sánh quan điểm giữa chúng.</li>
<li><strong>主張理解</strong> (hiểu lập luận, đoạn dài) — nhận ra quan điểm và lập luận của tác giả, không chỉ dữ kiện.</li>
<li><strong>情報検索</strong> (tìm kiếm thông tin) — tờ rơi, bảng biểu, quảng cáo; chỉ cần tìm ĐÚNG một thông tin cần, không cần đọc sâu.</li>
</ul>
<h3>Kỹ thuật làm bài</h3>
<pre><code>1. Đọc CÂU HỎI và các đáp án TRƯỚC, rồi mới đọc đoạn văn — đọc có mục tiêu rõ.
2. Gạch chân các từ khóa lặp lại — thường là chỗ neo của đáp án đúng.
3. Chú ý từ nối chuyển ý: しかし/ところが (nhưng)  つまり (tóm lại)  したがって (do đó)  一方 (mặt khác)
   -> câu hỏi rất hay xoáy vào đúng đoạn ngay SAU những từ nối này.
4. Với 情報検索, chỉ QUÉT tìm đúng dữ kiện được hỏi — đừng đọc hết cả tờ rơi.
</code></pre>
<div class="callout"><span class="badge">Phân bổ thời gian</span> Đọc hiểu bị dồn chung vào ~105-110 phút cùng từ vựng/ngữ pháp, nên làm 情報検索 thật nhanh và dành thời gian cho 主張理解/統合理解 — hai dạng cần suy nghĩ thật sự.</div>`,
  ]]);

const c6q = quiz('jjb391-quiz-6', 'Quiz 6 — Reading|||Quiz 6 — Đọc hiểu', [
  { id: 'q1', question: 'Dạng câu hỏi so sánh quan điểm giữa hai đoạn văn cùng chủ đề gọi là gì?', options: ['内容理解', '統合理解', '主張理解', '情報検索'], correctIndex: 1, explanation: '統合理解 (hiểu tổng hợp) yêu cầu so sánh hai văn bản ngắn cùng chủ đề.' },
  { id: 'q2', question: 'Khi làm dạng 情報検索, nên làm gì?', options: ['Đọc kỹ toàn bộ tờ rơi từ đầu đến cuối', 'Quét nhanh tìm đúng thông tin được hỏi', 'Bỏ qua câu hỏi này vì luôn khó', 'Dịch toàn bộ sang tiếng Việt trước'], correctIndex: 1, explanation: '情報検索 chỉ cần tìm một dữ kiện cụ thể, quét (scan) là đủ, không cần đọc sâu.' },
  { id: 'q3', question: 'Từ nối nào báo hiệu ý sắp nói NGƯỢC với ý trước đó?', options: ['つまり', 'したがって', 'しかし', '一方で đơn thuần liệt kê'], correctIndex: 2, explanation: 'しかし (nhưng) và ところが báo hiệu sự chuyển ý ngược lại — điểm câu hỏi hay khai thác.' },
]);

const c7 = doc('jjb391-7-1-listening', '7.1 — Listening (聴解): skills & question types|||7.1 — Nghe hiểu (聴解): kỹ năng & dạng bài',
  '5 dạng nghe: 課題理解, ポイント理解, 概要理解, 即時応答, 統合理解; mẹo nghe một lần duy nhất, ghi chú, không mất tập trung dây chuyền.',
  [[
    `<span class="eyebrow">JJB391 · Chapter 7 · Lesson 7.1</span>
<h2>Listening (聴解)</h2>
<h3>The five question types</h3>
<ul>
<li><strong>課題理解</strong> (task comprehension) — listen to a situation, choose the NEXT action the person must take.</li>
<li><strong>ポイント理解</strong> (point comprehension) — you get to read the question first, then listen for the specific point that answers it.</li>
<li><strong>概要理解</strong> (gist comprehension) — no choices shown beforehand; grasp the overall topic/point after listening to the whole thing.</li>
<li><strong>即時応答</strong> (immediate response) — a short utterance; pick the natural reply, tests reflexes more than vocabulary.</li>
<li><strong>統合理解</strong> (integrated comprehension) — combine information from multiple speakers to answer.</li>
</ul>
<h3>Technique</h3>
<pre><code>1. Audio plays ONCE only — there is no replay. Commit to listening actively from second one.
2. Jot down numbers, proper names, and times the instant you hear them — memory alone fails under pressure.
3. If you miss one question, guess quickly and move on — don't let it cost you the next question too.
4. For ポイント理解, use the reading-time BEFORE audio starts to underline what the question is really asking.
</code></pre>
<div class="callout"><span class="badge">No do-overs</span> Unlike reading, you cannot go back in 聴解 — the exam rewards someone who recovers fast from one missed question, not someone who never misses.</div>`,
    `<span class="eyebrow">JJB391 · Chương 7 · Bài 7.1</span>
<h2>Nghe hiểu (聴解)</h2>
<h3>Năm dạng câu hỏi</h3>
<ul>
<li><strong>課題理解</strong> (hiểu nhiệm vụ) — nghe một tình huống, chọn HÀNH ĐỘNG tiếp theo người đó cần làm.</li>
<li><strong>ポイント理解</strong> (hiểu trọng điểm) — được đọc câu hỏi trước, sau đó nghe tìm đúng điểm trả lời cho câu hỏi.</li>
<li><strong>概要理解</strong> (hiểu khái quát) — không có lựa chọn hiện sẵn trước; nắm chủ đề/ý chính sau khi nghe hết.</li>
<li><strong>即時応答</strong> (phản xạ tức thì) — một câu ngắn, chọn phản hồi tự nhiên nhất; kiểm tra phản xạ hơn là vốn từ.</li>
<li><strong>統合理解</strong> (hiểu tổng hợp) — kết hợp thông tin từ nhiều người nói để trả lời.</li>
</ul>
<h3>Kỹ thuật làm bài</h3>
<pre><code>1. Băng chỉ phát MỘT LẦN DUY NHẤT — không có phát lại. Tập trung nghe ngay từ giây đầu.
2. Ghi chú ngay số liệu, tên riêng, mốc thời gian khi vừa nghe thấy — chỉ nhớ trong đầu sẽ rơi rụng khi áp lực.
3. Nếu lỡ mất một câu, đoán nhanh rồi tiếp tục — đừng để nó kéo theo mất luôn câu kế tiếp.
4. Với ポイント理解, tận dụng thời gian đọc TRƯỚC khi băng phát để gạch chân đúng ý câu hỏi đang hỏi.
</code></pre>
<div class="callout"><span class="badge">Không có cơ hội sửa</span> Khác với đọc hiểu, 聴解 không cho quay lại — đề thi thưởng cho người phục hồi nhanh sau khi lỡ một câu, chứ không phải người không bao giờ sai.</div>`,
  ]]);

const c7q = quiz('jjb391-quiz-7', 'Quiz 7 — Listening|||Quiz 7 — Nghe hiểu', [
  { id: 'q1', question: 'Dạng nghe không hiển thị lựa chọn trước, chỉ cần nắm ý chính sau khi nghe hết là dạng nào?', options: ['課題理解', 'ポイント理解', '概要理解', '即時応答'], correctIndex: 2, explanation: '概要理解 (hiểu khái quát) không có lựa chọn hiện sẵn, thí sinh tự nắm chủ đề/ý chính.' },
  { id: 'q2', question: 'Đề nghe JLPT có phát lại đoạn âm thanh không?', options: ['Có, phát 2 lần', 'Có, phát đến khi thí sinh yêu cầu dừng', 'Không, chỉ phát đúng một lần', 'Chỉ phát lại phần 概要理解'], correctIndex: 2, explanation: 'Tất cả các dạng nghe trong JLPT đều chỉ phát một lần duy nhất, không có phát lại.' },
  { id: 'q3', question: 'Dạng 課題理解 yêu cầu thí sinh chọn điều gì?', options: ['Cảm xúc của người nói', 'Hành động cần làm tiếp theo', 'Số lượng người tham gia hội thoại', 'Ý nghĩa của một từ khó'], correctIndex: 1, explanation: '課題理解 kiểm tra khả năng nghe hiểu và xác định đúng hành động/nhiệm vụ cần làm tiếp theo.' },
]);

const c8 = doc('jjb391-8-1-bjt', '8.1 — BJT business Japanese & mixed mock tests|||8.1 — BJT tiếng Nhật thương mại & luyện đề tổng hợp',
  'BJT tích hợp nghe-đọc theo tình huống công việc; 3 tầng kính ngữ 尊敬語/謙譲語/丁寧語; phương pháp luyện đề tổng hợp có review theo nhóm lỗi.',
  [[
    `<span class="eyebrow">JJB391 · Chapter 8 · Lesson 8.1</span>
<h2>BJT business Japanese &amp; mock tests</h2>
<h3>BJT format</h3>
<p>BJT blends listening and reading into work scenarios: phone calls, e-mail exchanges, meeting minutes, negotiation, apology/complaint handling. Success depends heavily on <strong>keigo (敬語)</strong> — the honorific system used constantly at work.</p>
<h3>The three tiers of keigo</h3>
<pre><code>尊敬語 (sonkeigo)   ton kinh - dung khi noi ve HANH DONG cua nguoi khac/cap tren/khach hang
  いらっしゃる  = 行く/来る/いる      ご覧になる = 見る       おっしゃる = 言う
謙譲語 (kenjougo)   khiem nhuong - dung cho HANH DONG cua BAN THAN khi noi voi be tren
  伺う         = 行く/聞く/尋ねる     申し上げる = 言う       いたす    = する
丁寧語 (teineigo)   lich su chuan - dung moi luc voi nguoi ngoai/khach hang
  です／ます   ございます
</code></pre>
<div class="callout"><span class="badge">Common mistake</span> Never use 尊敬語 for your own action, or 謙譲語 for the other person's action — mixing the two directions is the single most common keigo error, and BJT tests exactly this.</div>
<h3>How to run a full mock test</h3>
<ol>
<li>Sit the mock under real timing — no pausing, no re-listening.</li>
<li>Score it, then review mistakes GROUPED by cause (vocab gap / grammar gap / missed reading connector / mis-heard number) rather than one by one.</li>
<li>Shadow the listening scripts you missed — repeating them out loud trains the reflex, not just the memory.</li>
</ol>`,
    `<span class="eyebrow">JJB391 · Chương 8 · Bài 8.1</span>
<h2>BJT tiếng Nhật thương mại &amp; luyện đề tổng hợp</h2>
<h3>Cấu trúc đề BJT</h3>
<p>BJT gộp chung nghe và đọc vào các tình huống công việc: gọi điện, trao đổi email, biên bản họp, đàm phán, xử lý phàn nàn/xin lỗi. Kết quả phụ thuộc rất nhiều vào <strong>kính ngữ (敬語)</strong> — hệ thống dùng liên tục trong môi trường công sở.</p>
<h3>Ba tầng kính ngữ</h3>
<pre><code>尊敬語 (sonkeigo)   ton kinh - dung khi noi ve HANH DONG cua nguoi khac/cap tren/khach hang
  いらっしゃる  = 行く/来る/いる       ご覧になる = 見る        おっしゃる = 言う
謙譲語 (kenjougo)   khiem nhuong - dung cho HANH DONG cua BAN THAN khi noi voi be tren
  伺う         = 行く/聞く/尋ねる      申し上げる = 言う        いたす    = する
丁寧語 (teineigo)   lich su chuan - dung moi luc voi nguoi ngoai, khach hang
  です／ます   ございます
</code></pre>
<div class="callout"><span class="badge">Lỗi hay gặp nhất</span> Tuyệt đối không dùng 尊敬語 cho hành động của CHÍNH MÌNH, hay 謙譲語 cho hành động của NGƯỜI KHÁC — nhầm chiều là lỗi kính ngữ phổ biến nhất, và BJT kiểm tra đúng chỗ này.</div>
<h3>Cách luyện đề tổng hợp đúng cách</h3>
<ol>
<li>Làm đề thử đúng thời gian thật — không tạm dừng, không nghe lại.</li>
<li>Chấm điểm rồi review lỗi theo NHÓM nguyên nhân (thiếu từ vựng / hổng ngữ pháp / bỏ sót từ nối khi đọc / nghe nhầm số liệu) thay vì xem từng câu rời rạc.</li>
<li>Shadowing (nhại lại) đúng các đoạn nghe đã sai — nói lại thành tiếng luyện phản xạ, không chỉ luyện trí nhớ.</li>
</ol>`,
  ]]);

const c8q = quiz('jjb391-quiz-8', 'Quiz 8 — BJT & mock tests|||Quiz 8 — BJT & luyện đề', [
  { id: 'q1', question: 'いらっしゃる thuộc tầng kính ngữ nào và dùng khi nào?', options: ['謙譲語, dùng cho hành động của bản thân', '尊敬語, dùng cho hành động của người khác/cấp trên', '丁寧語, dùng mọi lúc', 'Không thuộc hệ kính ngữ nào'], correctIndex: 1, explanation: 'いらっしゃる là 尊敬語 (tôn kính), thay cho 行く/来る/いる khi nói về người khác.' },
  { id: 'q2', question: '伺う là dạng khiêm nhường (謙譲語) của những động từ nào?', options: ['食べる/飲む', '行く/聞く/尋ねる', '見る/読む', '書く/話す'], correctIndex: 1, explanation: '伺う là 謙譲語, dùng thay cho 行く (đi), 聞く (hỏi/nghe), 尋ねる (hỏi thăm) khi nói về hành động của bản thân với người trên.' },
  { id: 'q3', question: 'Điểm khác biệt chính giữa BJT và JLPT là gì?', options: ['BJT chỉ thi viết, không thi nói', 'BJT tập trung tình huống công việc/thương mại, chấm theo thang 0-800 xếp hạng thay vì đậu/rớt', 'BJT không có phần nghe', 'BJT chỉ dành cho người mới học tiếng Nhật'], correctIndex: 1, explanation: 'BJT đo năng lực tiếng Nhật dùng trong công việc, chấm điểm 0-800 quy về hạng J5-J1+, khác cơ chế đậu/rớt của JLPT.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'JJB391',
    slug: 'jjb391-japanese-for-jlptbjt',
    title: 'Japanese for JLPT/BJT',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/JJB391.webp',
    shortDescription: 'JLPT N2-N1 & BJT prep: format & strategy, N2-N1 vocab & kanji, N2/N1 grammar, reading & listening technique, business Japanese with keigo drills & mock tests. Bilingual, with tables and quizzes.|||Luyện thi JLPT N2-N1 & BJT: cấu trúc & chiến lược, từ vựng và kanji N2-N1, ngữ pháp N2 và N1, kỹ năng đọc-nghe hiểu, tiếng Nhật thương mại với kính ngữ và đề luyện tổng hợp. Song ngữ, có bảng ví dụ và quiz.',
    description: 'Môn <strong>JJB391 — Japanese for JLPT/BJT</strong> (kỳ 7) luyện thi <strong>JLPT N2-N1</strong> và <strong>BJT (Business Japanese Test)</strong>. Từ <strong>tổng quan cấu trúc đề &amp; chiến lược</strong> → <strong>từ vựng (語彙)</strong> và <strong>kanji (漢字)</strong> N2-N1 → <strong>ngữ pháp (文法) N2</strong> và <strong>N1 nâng cao/văn viết</strong> → kỹ năng <strong>đọc hiểu (読解)</strong> và <strong>nghe hiểu (聴解)</strong> → <strong>tiếng Nhật thương mại BJT</strong> (kính ngữ, tình huống công sở) và luyện đề tổng hợp. Trích dẫn giáo trình Shin Kanzen Master N2-N1, TRY! JLPT, BJT công thức; song ngữ, có kana/kanji + romaji + nghĩa Việt/Anh, bảng ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Cấu trúc & điểm sàn đề JLPT N2/N1, thang điểm & xếp hạng BJT (J5-J1+); từ vựng Hán 2 kanji, đồng âm khác nghĩa, từ ngoại lai カタカナ語; kanji 音読み/訓読み, nhóm bộ thủ, mẹo ghi nhớ; ngữ pháp N2 trọng tâm (において, にもかかわらず, わけではない, さえ~ば, ざるを得ない...); ngữ pháp N1 nâng cao & văn viết (をもって, にたえない, べからず, んがため...); kỹ thuật đọc hiểu 4 dạng câu hỏi; kỹ thuật nghe hiểu 5 dạng câu hỏi; kính ngữ 尊敬語/謙譲語/丁寧語 & tình huống BJT; phương pháp luyện đề tổng hợp.',
    requirements: 'Đã có nền tiếng Nhật tương đương N3 trở lên (đọc được kana thông thạo, biết khoảng 300-500 kanji cơ bản). Nên chuẩn bị sách Shin Kanzen Master hoặc TRY! JLPT N2/N1 để luyện thêm ngoài các bảng ví dụ trong môn.',
  },
  sections: [
    { title: 'Chương 1 — Tổng quan JLPT & BJT|||Chapter 1 — JLPT & BJT overview', description: 'Các bậc JLPT, cấu trúc đề N2/N1, BJT, chiến lược học.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Từ vựng (語彙) N2-N1|||Chapter 2 — Vocabulary (語彙) N2-N1', description: 'Từ ghép Hán, đồng âm khác nghĩa, từ ngoại lai.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kanji (漢字) N2-N1|||Chapter 3 — Kanji (漢字) N2-N1', description: 'Âm đọc, bộ thủ, mẹo ghi nhớ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ngữ pháp (文法) N2|||Chapter 4 — Grammar (文法) N2', description: '8 mẫu ngữ pháp N2 trọng tâm.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Ngữ pháp (文法) N1|||Chapter 5 — Grammar (文法) N1', description: 'Mẫu nâng cao & văn viết trang trọng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đọc hiểu (読解)|||Chapter 6 — Reading (読解)', description: '4 dạng câu hỏi & kỹ thuật làm bài.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Nghe hiểu (聴解)|||Chapter 7 — Listening (聴解)', description: '5 dạng câu hỏi & kỹ thuật làm bài.', lessons: [c7, c7q] },
    { title: 'Chương 8 — BJT thương mại & luyện đề|||Chapter 8 — BJT & mock tests', description: 'Kính ngữ, tình huống công việc, luyện đề tổng hợp.', lessons: [c8, c8q] },
  ],
};
