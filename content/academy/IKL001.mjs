/**
 * IKL001 — Introduction to Korean / Nhập môn tiếng Hàn. Ngành Ngôn ngữ Hàn, kỳ 1.
 * Trình độ nhập môn TOPIK I (sơ cấp 1). Giáo trình tham khảo: "서울대 한국어
 * (Seoul National University Korean) 1A", "Sejong Korean (세종한국어) 1", TOPIK I.
 * 8 chương: bảng chữ cái Hangeul → âm tiết & patchim → chào hỏi & giới thiệu →
 * số đếm & ngày giờ → trợ từ & 이다 → động/tính từ 아요/어요 → mua sắm/ăn uống/sinh
 * hoạt → ôn tập & TOPIK I. Song ngữ EN/VI, chữ Hàn (Hangeul) UTF-8 + romaja.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('ikl001-1-1-hangeul-alphabet', '1.1 — The Hangeul alphabet: vowels & consonants|||1.1 — Bảng chữ cái Hangeul: nguyên âm & phụ âm',
  '10 nguyên âm cơ bản (모음) & 14 phụ âm cơ bản (자음), cách ghép thành âm tiết (가, 나…), lịch sử chữ Hangeul của vua Sejong.',
  [[
    `<span class="eyebrow">IKL001 · Chapter 1 · Lesson 1.1</span>
<h2>The Hangeul alphabet: vowels &amp; consonants</h2>
<p class="lead"><strong>Hangeul (한글)</strong> is the Korean writing system, created under King Sejong the Great and published in 1446. Unlike Chinese characters, Hangeul is a true <strong>featural alphabet</strong> — each letter (자모, jamo) stands for one sound, and letters combine into square syllable blocks rather than being written in a row.</p>
<h3>10 basic vowels (기본 모음)</h3>
<pre><code>ㅏ a     ㅑ ya    ㅓ eo    ㅕ yeo   ㅗ o
ㅛ yo    ㅜ u     ㅠ yu    ㅡ eu    ㅣ i
</code></pre>
<h3>14 basic consonants (기본 자음)</h3>
<pre><code>ㄱ g/k   ㄴ n     ㄷ d/t   ㄹ r/l   ㅁ m    ㅂ b/p   ㅅ s
ㅇ (silent as initial) / ng   ㅈ j   ㅊ ch   ㅋ k   ㅌ t   ㅍ p   ㅎ h
</code></pre>
<h3>Building a syllable block</h3>
<p>A Hangeul syllable always groups <strong>consonant + vowel</strong> (plus an optional final consonant) into one block. Combine ㄱ (g) with ㅏ (a) and you get <strong>가 (ga)</strong>; swap the vowel for ㅜ (u) and you get <strong>구 (gu)</strong>. This building-block logic is why Hangeul is famously learnable in a single afternoon.</p>
<pre><code>가 ga    나 na    다 da    라 ra    마 ma
바 ba    사 sa    아 a     자 ja    하 ha
</code></pre>
<div class="callout"><span class="badge">Why Hangeul is famous</span> Linguists often call it one of the most scientific alphabets in the world — the shape of ㄱ mimics the tongue blocking the back of the throat, and ㅁ mimics a closed mouth. The shapes were designed to match how each sound is made.</div>`,
    `<span class="eyebrow">IKL001 · Chương 1 · Bài 1.1</span>
<h2>Bảng chữ cái Hangeul: nguyên âm &amp; phụ âm</h2>
<p class="lead"><strong>Hangeul (한글)</strong> là hệ chữ viết của tiếng Hàn, được vua Sejong Đại đế cho ra đời và công bố năm 1446. Khác với chữ Hán, Hangeul là một <strong>bảng chữ cái ghi âm</strong> thực thụ — mỗi chữ cái (자모, jamo) đại diện một âm, và các chữ cái ghép lại thành khối âm tiết vuông thay vì viết thành hàng.</p>
<h3>10 nguyên âm cơ bản (기본 모음)</h3>
<pre><code>ㅏ a     ㅑ ya    ㅓ eo    ㅕ yeo   ㅗ o
ㅛ yo    ㅜ u     ㅠ yu    ㅡ eu    ㅣ i
</code></pre>
<h3>14 phụ âm cơ bản (기본 자음)</h3>
<pre><code>ㄱ g/k   ㄴ n     ㄷ d/t   ㄹ r/l   ㅁ m    ㅂ b/p   ㅅ s
ㅇ (câm khi đứng đầu) / ng   ㅈ j   ㅊ ch   ㅋ k   ㅌ t   ㅍ p   ㅎ h
</code></pre>
<h3>Ghép thành âm tiết</h3>
<p>Một âm tiết Hangeul luôn ghép <strong>phụ âm + nguyên âm</strong> (kèm phụ âm cuối tuỳ chọn) thành một khối. Ghép ㄱ (g) với ㅏ (a) ra <strong>가 (ga)</strong>; đổi nguyên âm thành ㅜ (u) ra <strong>구 (gu)</strong>. Cách ghép khối này là lý do Hangeul nổi tiếng học được trong một buổi chiều.</p>
<pre><code>가 ga    나 na    다 da    라 ra    마 ma
바 ba    사 sa    아 a     자 ja    하 ha
</code></pre>
<div class="callout"><span class="badge">Vì sao Hangeul nổi tiếng</span> Nhiều nhà ngôn ngữ học gọi đây là một trong những bảng chữ cái khoa học nhất thế giới — hình chữ ㄱ mô phỏng lưỡi chặn phía sau họng, chữ ㅁ mô phỏng miệng khép lại. Hình dáng chữ được thiết kế khớp với cách phát âm.</div>`,
  ]]);

const c1q = quiz('ikl001-quiz-1', 'Quiz 1 — Hangeul alphabet|||Quiz 1 — Bảng chữ cái Hangeul', [
  { id: 'q1', question: 'Âm tiết 가 (ga) được ghép từ phụ âm và nguyên âm nào?', options: ['ㄴ + ㅏ', 'ㄱ + ㅏ', 'ㄱ + ㅓ', 'ㄷ + ㅣ'], correctIndex: 1, explanation: '가 = ㄱ (g) + ㅏ (a) = ga.' },
  { id: 'q2', question: 'Ai là người cho ra đời chữ Hangeul, công bố năm 1446?', options: ['Vua Sejong Đại đế', 'Vua Sejo', 'Vua Taejong', 'Không rõ tác giả'], correctIndex: 0, explanation: 'Hangeul do vua Sejong Đại đế tạo ra và công bố năm 1446.' },
  { id: 'q3', question: 'Nguyên âm cơ bản ㅓ đọc (romaja) là?', options: ['a', 'o', 'eo', 'eu'], correctIndex: 2, explanation: 'ㅓ = eo (khác với ㅗ = o và ㅡ = eu).' },
]);

const c2 = doc('ikl001-2-1-syllables-patchim', '2.1 — Syllables, patchim & pronunciation rules|||2.1 — Âm tiết, patchim (받침) & quy tắc phát âm',
  'Patchim (phụ âm cuối, 받침): 7 âm đại diện, 7 âm cuối tận biến; liên âm 연음 khi có trợ từ bắt đầu bằng nguyên âm.',
  [[
    `<span class="eyebrow">IKL001 · Chapter 2 · Lesson 2.1</span>
<h2>Syllables, patchim &amp; pronunciation rules</h2>
<h3>What is patchim (받침)?</h3>
<p>A Korean syllable block can end in a <strong>final consonant</strong>, called <strong>patchim (받침)</strong>, written below the vowel: 밥 (bap = rice) has patchim ㅂ; 산 (san = mountain) has patchim ㄴ; 강 (gang = river) has patchim ㅇ.</p>
<h3>Only 7 patchim sounds exist</h3>
<p>No matter which consonant is written as patchim, it is pronounced as one of only <strong>7 representative sounds</strong>:</p>
<pre><code>ㄱ,ㄲ,ㅋ          -&gt; sounds like [k]   (부엌 buoek "kitchen" ends [k])
ㄴ                -&gt; [n]
ㄷ,ㅅ,ㅆ,ㅈ,ㅊ,ㅌ,ㅎ -&gt; sounds like [t]   (옷 ot "clothes" ends [t])
ㄹ                -&gt; [l]
ㅁ                -&gt; [m]
ㅂ,ㅍ             -&gt; sounds like [p]   (밥 bap "rice" ends [p])
ㅇ                -&gt; [ng]
</code></pre>
<h3>Liaison (연음) — the patchim "moves"</h3>
<p>When a syllable with patchim is followed by one starting with the silent ㅇ (i.e. any vowel-initial particle), the patchim sound <strong>carries over</strong> to become the initial sound of the next syllable — this is called <strong>연음 (yeoneum, liaison)</strong>:</p>
<pre><code>밥이  bap + i   -&gt; pronounced  ba-bi   (rice + subject particle)
산이  san + i   -&gt; pronounced  sa-ni   (mountain + subject particle)
음악  eum + ak  -&gt; pronounced  eu-mak  (music)
</code></pre>
<div class="callout"><span class="badge">Practice tip</span> Read patchim words out loud with a following particle (이, 을, 에) — liaison is one of the biggest gaps between "reading Hangeul letter-by-letter" and sounding natural.</div>`,
    `<span class="eyebrow">IKL001 · Chương 2 · Bài 2.1</span>
<h2>Âm tiết, patchim &amp; quy tắc phát âm</h2>
<h3>Patchim (받침) là gì?</h3>
<p>Một khối âm tiết tiếng Hàn có thể kết thúc bằng <strong>phụ âm cuối</strong>, gọi là <strong>patchim (받침)</strong>, viết bên dưới nguyên âm: 밥 (bap = cơm) có patchim ㅂ; 산 (san = núi) có patchim ㄴ; 강 (gang = sông) có patchim ㅇ.</p>
<h3>Chỉ có 7 âm patchim</h3>
<p>Dù viết phụ âm nào làm patchim, nó chỉ được đọc thành một trong <strong>7 âm đại diện</strong>:</p>
<pre><code>ㄱ,ㄲ,ㅋ          -&gt; đọc như [k]   (부엌 buoek "nhà bếp" đọc kết [k])
ㄴ                -&gt; [n]
ㄷ,ㅅ,ㅆ,ㅈ,ㅊ,ㅌ,ㅎ -&gt; đọc như [t]   (옷 ot "quần áo" đọc kết [t])
ㄹ                -&gt; [l]
ㅁ                -&gt; [m]
ㅂ,ㅍ             -&gt; đọc như [p]   (밥 bap "cơm" đọc kết [p])
ㅇ                -&gt; [ng]
</code></pre>
<h3>Liên âm (연음) — patchim "chuyển" sang tiếng sau</h3>
<p>Khi âm tiết có patchim đứng trước một âm tiết bắt đầu bằng ㅇ câm (tức trợ từ bắt đầu bằng nguyên âm), âm patchim <strong>chuyển sang</strong> làm phụ âm đầu của âm tiết sau — gọi là <strong>연음 (yeoneum, liên âm)</strong>:</p>
<pre><code>밥이  bap + i   -&gt; đọc là  ba-bi   (cơm + trợ từ chủ ngữ)
산이  san + i   -&gt; đọc là  sa-ni   (núi + trợ từ chủ ngữ)
음악  eum + ak  -&gt; đọc là  eu-mak  (âm nhạc)
</code></pre>
<div class="callout"><span class="badge">Mẹo luyện</span> Đọc to các từ có patchim kèm trợ từ theo sau (이, 을, 에) — liên âm là một trong những khoảng cách lớn nhất giữa "đọc Hangeul từng chữ" và nói tự nhiên.</div>`,
  ]]);

const c2q = quiz('ikl001-quiz-2', 'Quiz 2 — Syllables & patchim|||Quiz 2 — Âm tiết & patchim', [
  { id: 'q1', question: 'Patchim của từ 밥 (bap = cơm) được đọc thành âm nào?', options: ['[k]', '[n]', '[p]', '[t]'], correctIndex: 2, explanation: 'Patchim ㅂ (và ㅍ) luôn đọc thành âm [p].' },
  { id: 'q2', question: 'Dù viết bằng phụ âm nào, patchim tiếng Hàn chỉ đọc thành bao nhiêu âm đại diện?', options: ['3', '5', '7', '14'], correctIndex: 2, explanation: 'Chỉ có 7 âm patchim đại diện: k, n, t, l, m, p, ng.' },
  { id: 'q3', question: '「산이」 (san + trợ từ 이) được đọc liền theo quy tắc liên âm (연음) là?', options: ['san-i (tách rời)', 'sa-ni', 'san-ni', 'sa-i'], correctIndex: 1, explanation: 'Patchim ㄴ của 산 chuyển sang làm phụ âm đầu của 이 -> sa-ni.' },
]);

const c3 = doc('ikl001-3-1-greetings-intro', '3.1 — Greetings & self-introduction|||3.1 — Chào hỏi & giới thiệu bản thân',
  '안녕하세요 (xin chào), cảm ơn/xin lỗi, mẫu giới thiệu bản thân 저는 [tên]입니다/이에요, 만나서 반갑습니다.',
  [[
    `<span class="eyebrow">IKL001 · Chapter 3 · Lesson 3.1</span>
<h2>Greetings &amp; self-introduction</h2>
<h3>Everyday greetings</h3>
<pre><code>안녕하세요.        annyeong-haseyo.        = Hello. (polite, anytime)
안녕히 가세요.     annyeonghi gaseyo.      = Goodbye. (to someone leaving)
안녕히 계세요.     annyeonghi gyeseyo.     = Goodbye. (to someone staying)
감사합니다.        gamsa-hamnida.          = Thank you. (formal)
고맙습니다.        gomap-seumnida.         = Thank you. (also polite)
죄송합니다.        joesong-hamnida.        = I'm sorry. (formal)
</code></pre>
<h3>Introducing yourself</h3>
<p>The pattern <strong>저는 [name]입니다</strong> or the softer <strong>저는 [name]이에요/예요</strong> means "I am [name]". 저 (jeo) is the humble "I", and 는 marks it as the topic.</p>
<pre><code>저는 티엔입니다.        jeo-neun Tien-imnida.       = I am Tien. (formal)
저는 티엔이에요.        jeo-neun Tien-ieyo.         = I am Tien. (polite, casual)
저는 베트남 사람이에요.  jeo-neun Beteunam saram-ieyo. = I am Vietnamese.
만나서 반갑습니다.       mannaseo bangap-seumnida.   = Nice to meet you.
</code></pre>
<h3>Mini dialogue</h3>
<pre><code>A: 안녕하세요. 저는 민수예요.
   annyeong-haseyo. jeo-neun Minsu-yeyo.
   = Hello. I'm Minsu.
B: 안녕하세요. 저는 티엔이에요. 만나서 반갑습니다.
   annyeong-haseyo. jeo-neun Tien-ieyo. mannaseo bangap-seumnida.
   = Hello. I'm Tien. Nice to meet you.
</code></pre>
<div class="callout"><span class="badge">Note</span> 이에요/예요 pick the ending by the last sound of the name: after a consonant use 이에요 (민수예요 is an exception — 수 ends in a vowel so it takes 예요); after a vowel use 예요.</div>`,
    `<span class="eyebrow">IKL001 · Chương 3 · Bài 3.1</span>
<h2>Chào hỏi &amp; giới thiệu bản thân</h2>
<h3>Chào hỏi thường dùng</h3>
<pre><code>안녕하세요.        annyeong-haseyo.        = Xin chào. (lịch sự, dùng mọi lúc)
안녕히 가세요.     annyeonghi gaseyo.      = Tạm biệt. (nói với người đang đi)
안녕히 계세요.     annyeonghi gyeseyo.     = Tạm biệt. (nói với người ở lại)
감사합니다.        gamsa-hamnida.          = Cảm ơn. (trang trọng)
고맙습니다.        gomap-seumnida.         = Cảm ơn. (cũng lịch sự)
죄송합니다.        joesong-hamnida.        = Xin lỗi. (trang trọng)
</code></pre>
<h3>Giới thiệu bản thân</h3>
<p>Mẫu câu <strong>저는 [tên]입니다</strong> hoặc mềm hơn <strong>저는 [tên]이에요/예요</strong> nghĩa là "Tôi là [tên]". 저 (jeo) là "tôi" khiêm nhường, và 는 đánh dấu đây là chủ đề câu.</p>
<pre><code>저는 티엔입니다.        jeo-neun Tien-imnida.       = Tôi là Tiên. (trang trọng)
저는 티엔이에요.        jeo-neun Tien-ieyo.         = Tôi là Tiên. (lịch sự, thân mật)
저는 베트남 사람이에요.  jeo-neun Beteunam saram-ieyo. = Tôi là người Việt Nam.
만나서 반갑습니다.       mannaseo bangap-seumnida.   = Rất vui được gặp bạn.
</code></pre>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 안녕하세요. 저는 민수예요.
   annyeong-haseyo. jeo-neun Minsu-yeyo.
   = Xin chào. Mình là Minsu.
B: 안녕하세요. 저는 티엔이에요. 만나서 반갑습니다.
   annyeong-haseyo. jeo-neun Tien-ieyo. mannaseo bangap-seumnida.
   = Xin chào. Mình là Tiên. Rất vui được gặp bạn.
</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> 이에요/예요 chọn theo âm cuối của tên: sau phụ âm dùng 이에요 (riêng 민수예요 là ngoại lệ vì 수 kết thúc bằng nguyên âm nên dùng 예요); sau nguyên âm dùng 예요.</div>`,
  ]]);

const c3q = quiz('ikl001-quiz-3', 'Quiz 3 — Greetings & self-intro|||Quiz 3 — Chào hỏi & giới thiệu', [
  { id: 'q1', question: '「안녕하세요」nghĩa là gì?', options: ['Cảm ơn', 'Xin chào', 'Xin lỗi', 'Tạm biệt'], correctIndex: 1, explanation: '안녕하세요 là lời chào lịch sự, dùng được mọi lúc trong ngày.' },
  { id: 'q2', question: 'Mẫu câu giới thiệu tên đúng theo bài học là?', options: ['저는 [tên]입니다', '이것은 [tên]이에요', '[tên]가 저예요', '저를 [tên]입니다'], correctIndex: 0, explanation: '저는 (chủ đề "tôi") + [tên] + 입니다/이에요 = "Tôi là [tên]".' },
  { id: 'q3', question: '「만나서 반갑습니다」nghĩa là?', options: ['Tạm biệt nhé', 'Rất vui được gặp bạn', 'Bạn tên gì?', 'Xin lỗi vì đến trễ'], correctIndex: 1, explanation: 'Câu nói xã giao khi mới gặp mặt, sau phần tự giới thiệu.' },
]);

const c4 = doc('ikl001-4-1-numbers-time', '4.1 — Numbers (Sino- & native Korean), dates & time|||4.1 — Số đếm (Hán-Hàn & thuần Hàn), ngày giờ',
  'Số Hán-Hàn (일이삼사오…) dùng cho ngày/tiền/phút/số điện thoại; số thuần Hàn (하나둘셋…) dùng cho tuổi/đồ vật/giờ.',
  [[
    `<span class="eyebrow">IKL001 · Chapter 4 · Lesson 4.1</span>
<h2>Numbers, dates &amp; time</h2>
<h3>Two number systems</h3>
<p>Korean uniquely uses <strong>two</strong> counting systems side by side — you must know which one a situation calls for.</p>
<h3>Sino-Korean numbers (한자어 숫자) 1–10</h3>
<pre><code>일 il(1)  이 i(2)  삼 sam(3)  사 sa(4)   오 o(5)
육 yuk(6) 칠 chil(7) 팔 pal(8) 구 gu(9)  십 sip(10)
</code></pre>
<p>Used for: <strong>dates</strong> (년/월/일), <strong>money</strong> (원), <strong>phone numbers</strong>, <strong>minutes</strong> (분), and counting beyond 100.</p>
<h3>Native Korean numbers (고유어 숫자) 1–10</h3>
<pre><code>하나 hana(1)  둘 dul(2)   셋 set(3)   넷 net(4)   다섯 daseot(5)
여섯 yeoseot(6) 일곱 ilgop(7) 여덟 yeodeol(8) 아홉 ahop(9) 열 yeol(10)
</code></pre>
<p>Used for: <strong>counting objects/people/age</strong> (살 = years old), and <strong>hours</strong> (시). Note: 하나·둘·셋·넷·스물 shorten to 한·두·세·네·스무 right before a counter (한 개 = one item).</p>
<h3>Telling time — the two systems combine</h3>
<pre><code>3시 30분  =  세 시 삼십 분   (se si sam-sip bun)
             ^native (hour)   ^Sino-Korean (minute)
           = 3:30 / half past three
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> HOUR (시) = native numbers (한 시, 두 시, 세 시…); MINUTE (분) = Sino-Korean numbers (일 분, 이 분, 삼십 분…). Mixing them up is a classic beginner mistake.</div>`,
    `<span class="eyebrow">IKL001 · Chương 4 · Bài 4.1</span>
<h2>Số đếm, ngày &amp; giờ</h2>
<h3>Hai hệ số đếm</h3>
<p>Tiếng Hàn có điểm đặc biệt là dùng song song <strong>hai</strong> hệ số đếm — phải biết tình huống nào dùng hệ nào.</p>
<h3>Số Hán-Hàn (한자어 숫자) 1–10</h3>
<pre><code>일 il(1)  이 i(2)  삼 sam(3)  사 sa(4)   오 o(5)
육 yuk(6) 칠 chil(7) 팔 pal(8) 구 gu(9)  십 sip(10)
</code></pre>
<p>Dùng cho: <strong>ngày tháng</strong> (년/월/일), <strong>tiền</strong> (원), <strong>số điện thoại</strong>, <strong>phút</strong> (분), và đếm từ trăm trở lên.</p>
<h3>Số thuần Hàn (고유어 숫자) 1–10</h3>
<pre><code>하나 hana(1)  둘 dul(2)   셋 set(3)   넷 net(4)   다섯 daseot(5)
여섯 yeoseot(6) 일곱 ilgop(7) 여덟 yeodeol(8) 아홉 ahop(9) 열 yeol(10)
</code></pre>
<p>Dùng cho: <strong>đếm đồ vật/người/tuổi</strong> (살 = tuổi), và <strong>giờ</strong> (시). Lưu ý: 하나·둘·셋·넷·스물 rút gọn thành 한·두·세·네·스무 ngay trước lượng từ (한 개 = một cái).</p>
<h3>Nói giờ — hai hệ số kết hợp</h3>
<pre><code>3시 30분  =  세 시 삼십 분   (se si sam-sip bun)
             ^thuần Hàn (giờ) ^Hán-Hàn (phút)
           = 3 giờ 30 phút
</code></pre>
<div class="callout"><span class="badge">Ghi nhớ</span> GIỜ (시) = số thuần Hàn (한 시, 두 시, 세 시…); PHÚT (분) = số Hán-Hàn (일 분, 이 분, 삼십 분…). Nhầm lẫn hai hệ số là lỗi kinh điển của người mới học.</div>`,
  ]]);

const c4q = quiz('ikl001-quiz-4', 'Quiz 4 — Numbers & time|||Quiz 4 — Số đếm & giờ', [
  { id: 'q1', question: 'Khi nói GIỜ (시), người Hàn dùng hệ số đếm nào?', options: ['Số Hán-Hàn (일, 이, 삼…)', 'Số thuần Hàn (하나, 둘, 셋…)', 'Cả hai như nhau', 'Không dùng số'], correctIndex: 1, explanation: 'Giờ (시) luôn dùng số thuần Hàn: 한 시, 두 시, 세 시…' },
  { id: 'q2', question: 'Số Hán-Hàn 삼 (sam) dùng để đếm phút thì có nghĩa là?', options: ['1 phút', '3 phút', '10 phút', '30 phút'], correctIndex: 1, explanation: '삼 (sam) = 3 trong hệ Hán-Hàn, dùng cho phút, tiền, ngày tháng.' },
  { id: 'q3', question: '「한 개」(han gae = một cái) là dạng rút gọn trước lượng từ của số nào?', options: ['일 (il)', '하나 (hana)', '둘 (dul)', '열 (yeol)'], correctIndex: 1, explanation: '하나 rút gọn thành 한 khi đứng ngay trước lượng từ như 개.' },
]);

const c5 = doc('ikl001-5-1-particles-ida', '5.1 — Basic particles (은/는, 이/가, 을/를) & the copula 이다|||5.1 — Trợ từ cơ bản (은/는, 이/가, 을/를) & câu 이다',
  '은/는 (chủ đề), 이/가 (chủ ngữ), 을/를 (tân ngữ); động từ 이다 (là) chia thành 이에요/예요, phủ định 아니에요.',
  [[
    `<span class="eyebrow">IKL001 · Chapter 5 · Lesson 5.1</span>
<h2>Basic particles &amp; the copula 이다</h2>
<h3>Three core particles</h3>
<table><thead><tr><th>Particle</th><th>After consonant</th><th>After vowel</th><th>Role</th></tr></thead><tbody>
<tr><td>은/는</td><td>은 (eun)</td><td>는 (neun)</td><td>topic marker ("as for…")</td></tr>
<tr><td>이/가</td><td>이 (i)</td><td>가 (ga)</td><td>subject marker</td></tr>
<tr><td>을/를</td><td>을 (eul)</td><td>를 (reul)</td><td>object marker</td></tr>
</tbody></table>
<pre><code>저는 학생이에요.     jeo-neun haksaeng-ieyo.     = As for me, I'm a student.
이것이 책이에요.     igeos-i chaeg-ieyo.         = This is a book. (subject)
저는 밥을 먹어요.    jeo-neun bab-eul meogeoyo.  = I eat rice. (object)
</code></pre>
<h3>The copula 이다 ("to be")</h3>
<p><strong>이다</strong> attaches directly to a noun to mean "is/am/are". Its polite present form is 이에요 (after consonant) / 예요 (after vowel):</p>
<pre><code>이것은 책이에요.   igeos-eun chaeg-ieyo.  = This is a book.  (책 ends in consonant -&gt; 이에요)
저는 의사예요.     jeo-neun uisa-yeyo.    = I am a doctor.   (의사 ends in vowel -&gt; 예요)
</code></pre>
<h3>Negating 이다: 이/가 아니에요</h3>
<pre><code>이것은 책이 아니에요.   igeos-eun chaeg-i anieyo.   = This is not a book.
저는 학생이 아니에요.   jeo-neun haksaeng-i anieyo. = I am not a student.
</code></pre>
<div class="callout"><span class="badge">은/는 vs 이/가</span> 은/는 introduces or contrasts a topic ("As for me…"); 이/가 marks the grammatical subject, often for new information or emphasis. Beginners can start with 은/는 for "I" and "you" in most sentences.</div>`,
    `<span class="eyebrow">IKL001 · Chương 5 · Bài 5.1</span>
<h2>Trợ từ cơ bản &amp; câu 이다</h2>
<h3>Ba trợ từ cốt lõi</h3>
<table><thead><tr><th>Trợ từ</th><th>Sau phụ âm</th><th>Sau nguyên âm</th><th>Vai trò</th></tr></thead><tbody>
<tr><td>은/는</td><td>은 (eun)</td><td>는 (neun)</td><td>đánh dấu chủ đề ("còn về…")</td></tr>
<tr><td>이/가</td><td>이 (i)</td><td>가 (ga)</td><td>đánh dấu chủ ngữ</td></tr>
<tr><td>을/를</td><td>을 (eul)</td><td>를 (reul)</td><td>đánh dấu tân ngữ</td></tr>
</tbody></table>
<pre><code>저는 학생이에요.     jeo-neun haksaeng-ieyo.     = Còn tôi thì là sinh viên.
이것이 책이에요.     igeos-i chaeg-ieyo.         = Cái này là sách. (chủ ngữ)
저는 밥을 먹어요.    jeo-neun bab-eul meogeoyo.  = Tôi ăn cơm. (tân ngữ)
</code></pre>
<h3>Động từ 이다 ("là")</h3>
<p><strong>이다</strong> gắn thẳng vào danh từ để nghĩa "là". Thể lịch sự hiện tại là 이에요 (sau phụ âm) / 예요 (sau nguyên âm):</p>
<pre><code>이것은 책이에요.   igeos-eun chaeg-ieyo.  = Cái này là sách.  (책 kết thúc phụ âm -&gt; 이에요)
저는 의사예요.     jeo-neun uisa-yeyo.    = Tôi là bác sĩ.    (의사 kết thúc nguyên âm -&gt; 예요)
</code></pre>
<h3>Phủ định 이다: 이/가 아니에요</h3>
<pre><code>이것은 책이 아니에요.   igeos-eun chaeg-i anieyo.   = Cái này không phải là sách.
저는 학생이 아니에요.   jeo-neun haksaeng-i anieyo. = Tôi không phải là sinh viên.
</code></pre>
<div class="callout"><span class="badge">은/는 vs 이/가</span> 은/는 giới thiệu hoặc đối chiếu chủ đề ("Còn tôi thì…"); 이/가 đánh dấu chủ ngữ ngữ pháp, thường cho thông tin mới hoặc nhấn mạnh. Người mới học có thể bắt đầu dùng 은/는 cho "tôi"/"bạn" trong hầu hết câu.</div>`,
  ]]);

const c5q = quiz('ikl001-quiz-5', 'Quiz 5 — Particles & 이다|||Quiz 5 — Trợ từ & 이다', [
  { id: 'q1', question: 'Trợ từ nào đánh dấu tân ngữ (object) trong câu 저는 밥을 먹어요?', options: ['는', '을', '이', '가'], correctIndex: 1, explanation: '을/를 đánh dấu tân ngữ; 밥 (cơm) kết thúc phụ âm nên dùng 을.' },
  { id: 'q2', question: '이것은 책이에요. Vì sao dùng 이에요 mà không phải 예요?', options: ['책 kết thúc bằng nguyên âm', '책 kết thúc bằng phụ âm', 'Không có quy tắc', '이에요 dùng cho câu hỏi'], correctIndex: 1, explanation: '책 kết thúc phụ âm ㄱ nên dùng 이에요; danh từ kết thúc nguyên âm mới dùng 예요.' },
  { id: 'q3', question: 'Câu phủ định của 이다 ("là") được tạo bằng?', options: ['안 + động từ', '이/가 아니에요', '지 않아요', '못 + động từ'], correctIndex: 1, explanation: 'Phủ định riêng của 이다 là [danh từ] + 이/가 아니에요, không dùng 안/지 않다.' },
]);

const c6 = doc('ikl001-6-1-verbs-adjectives-ayo-eoyo', '6.1 — Verbs, adjectives & the 아요/어요 ending|||6.1 — Động từ, tính từ & đuôi câu 아요/어요',
  'Quy tắc chọn 아요 (nguyên âm ㅏ/ㅗ) hay 어요 (còn lại), 하다→해요; tính từ chia y hệt động từ.',
  [[
    `<span class="eyebrow">IKL001 · Chapter 6 · Lesson 6.1</span>
<h2>Verbs, adjectives &amp; the 아요/어요 ending</h2>
<h3>Every verb starts from a dictionary form ending in -다</h3>
<p>To speak politely in the present tense, drop 다 and add 아요 or 어요, chosen by the <strong>last vowel of the stem</strong>:</p>
<pre><code>Stem's last vowel ㅏ or ㅗ   -&gt; add 아요
Any other vowel             -&gt; add 어요
하다 (irregular)             -&gt; becomes 해요
</code></pre>
<h3>Verb examples</h3>
<pre><code>가다 (to go)   가 + 아요  -&gt; 가요    ga-yo    = go / goes
좋다 (to be good) 좋 + 아요 -&gt; 좋아요 joh-ayo  = is good
먹다 (to eat)  먹 + 어요  -&gt; 먹어요  meog-eoyo = eat
읽다 (to read) 읽 + 어요  -&gt; 읽어요  ilg-eoyo  = read
공부하다 (to study) -&gt; 공부해요  gongbu-haeyo = study (하다 verb)
</code></pre>
<h3>Adjectives (형용사) conjugate the same way</h3>
<pre><code>작다 (to be small) 작 + 아요 -&gt; 작아요  jag-ayo  = is small
크다  (to be big)   크 + 어요 -&gt; 커요    keo-yo   = is big  (ㅡ drops, irregular)
예쁘다 (to be pretty) -&gt; 예뻐요  yeppeo-yo          = is pretty (ㅡ drops, irregular)
</code></pre>
<div class="callout"><span class="badge">Same ending, two word classes</span> Korean adjectives behave grammatically like verbs — they take the exact same 아요/어요 present-tense ending, unlike English where adjectives need a separate "to be".</div>`,
    `<span class="eyebrow">IKL001 · Chương 6 · Bài 6.1</span>
<h2>Động từ, tính từ &amp; đuôi câu 아요/어요</h2>
<h3>Mọi động từ đều bắt đầu từ dạng từ điển kết thúc bằng -다</h3>
<p>Để nói lịch sự ở thì hiện tại, bỏ 다 và thêm 아요 hoặc 어요, chọn theo <strong>nguyên âm cuối của thân từ</strong>:</p>
<pre><code>Nguyên âm cuối thân từ là ㅏ hoặc ㅗ  -&gt; thêm 아요
Nguyên âm khác                        -&gt; thêm 어요
하다 (bất quy tắc)                     -&gt; thành 해요
</code></pre>
<h3>Ví dụ động từ</h3>
<pre><code>가다 (đi)   가 + 아요  -&gt; 가요    ga-yo    = đi
좋다 (tốt/thích) 좋 + 아요 -&gt; 좋아요 joh-ayo = tốt/thích
먹다 (ăn)   먹 + 어요  -&gt; 먹어요  meog-eoyo = ăn
읽다 (đọc)  읽 + 어요  -&gt; 읽어요  ilg-eoyo  = đọc
공부하다 (học) -&gt; 공부해요  gongbu-haeyo = học (động từ 하다)
</code></pre>
<h3>Tính từ (형용사) chia y hệt động từ</h3>
<pre><code>작다 (nhỏ)  작 + 아요 -&gt; 작아요  jag-ayo  = nhỏ
크다  (to)   크 + 어요 -&gt; 커요    keo-yo   = to  (rụng ㅡ, bất quy tắc)
예쁘다 (đẹp) -&gt; 예뻐요  yeppeo-yo          = đẹp (rụng ㅡ, bất quy tắc)
</code></pre>
<div class="callout"><span class="badge">Cùng một đuôi, hai loại từ</span> Tính từ tiếng Hàn hoạt động về ngữ pháp giống hệt động từ — chia cùng đuôi 아요/어요 ở thì hiện tại, khác với tiếng Việt/Anh vốn cần động từ "là/to be" riêng.</div>`,
  ]]);

const c6q = quiz('ikl001-quiz-6', 'Quiz 6 — Verbs & 아요/어요|||Quiz 6 — Động từ & 아요/어요', [
  { id: 'q1', question: 'Động từ 가다 (đi) chia ở thì hiện tại lịch sự là?', options: ['가어요', '가요', '가해요', '갔요'], correctIndex: 1, explanation: '가다 có nguyên âm cuối ㅏ nên thêm 아요, rút gọn thành 가요.' },
  { id: 'q2', question: 'Động từ 먹다 (ăn) dùng đuôi 아요 hay 어요?', options: ['아요, vì kết thúc ㅓ', '어요, vì nguyên âm 어 không phải ㅏ/ㅗ', 'Cả hai đều sai', 'Không chia được'], correctIndex: 1, explanation: '먹 có nguyên âm ㅓ (không phải ㅏ/ㅗ) nên dùng 어요 -> 먹어요.' },
  { id: 'q3', question: '하다 (làm) là động từ bất quy tắc, chia thành?', options: ['하아요', '하어요', '해요', '하다요'], correctIndex: 2, explanation: '하다 luôn chia thành 해요, không theo quy tắc 아요/어요 thông thường.' },
]);

const c7 = doc('ikl001-7-1-shopping-eating-daily', '7.1 — Shopping, eating & daily life|||7.1 — Mua sắm, ăn uống & sinh hoạt hằng ngày',
  '얼마예요? (bao nhiêu tiền), 주세요 (cho tôi/làm ơn), gọi món ăn, và động từ sinh hoạt hằng ngày.',
  [[
    `<span class="eyebrow">IKL001 · Chapter 7 · Lesson 7.1</span>
<h2>Shopping, eating &amp; daily life</h2>
<h3>Shopping (쇼핑)</h3>
<pre><code>이거 얼마예요?     igeo eolma-yeyo?      = How much is this?
이거 주세요.       igeo juseyo.          = Please give me this. / I'll take this.
너무 비싸요.       neomu bissayo.        = It's too expensive.
좀 깎아 주세요.    jom kkakka juseyo.    = Please give me a discount.
</code></pre>
<h3>Eating out (식당에서)</h3>
<pre><code>메뉴 좀 보여 주세요.   menyu jom boyeo juseyo.  = Please show me the menu.
이거 하나 주세요.      igeo hana juseyo.        = One of this, please.
맛있어요!              masi-sseoyo!             = It's delicious!
배고파요.              baegopayo.               = I'm hungry.
물 좀 주세요.          mul jom juseyo.          = Water, please.
</code></pre>
<h3>Daily routine (하루 일과) verbs</h3>
<pre><code>일어나다   ireonada   = to wake up      -&gt; 일어나요
씻다       ssitda     = to wash         -&gt; 씻어요
밥을 먹다  bab-eul meokda = to eat a meal -&gt; 밥을 먹어요
학교에 가다 hakgyo-e gada = to go to school -&gt; 학교에 가요
집에 오다  jib-e oda  = to come home    -&gt; 집에 와요
자다       jada       = to sleep        -&gt; 자요
</code></pre>
<div class="callout"><span class="badge">주세요 does a lot of work</span> Attach 주세요 ("please give/do") after a noun or a verb stem's -아/어 form to politely ask for almost anything — a key survival pattern for shops, restaurants, and daily errands.</div>`,
    `<span class="eyebrow">IKL001 · Chương 7 · Bài 7.1</span>
<h2>Mua sắm, ăn uống &amp; sinh hoạt hằng ngày</h2>
<h3>Mua sắm (쇼핑)</h3>
<pre><code>이거 얼마예요?     igeo eolma-yeyo?      = Cái này bao nhiêu tiền?
이거 주세요.       igeo juseyo.          = Cho tôi cái này. / Tôi lấy cái này.
너무 비싸요.       neomu bissayo.        = Đắt quá.
좀 깎아 주세요.    jom kkakka juseyo.    = Giảm giá giúp tôi với.
</code></pre>
<h3>Ăn uống ở nhà hàng (식당에서)</h3>
<pre><code>메뉴 좀 보여 주세요.   menyu jom boyeo juseyo.  = Cho tôi xem thực đơn.
이거 하나 주세요.      igeo hana juseyo.        = Cho tôi một phần này.
맛있어요!              masi-sseoyo!             = Ngon quá!
배고파요.              baegopayo.               = Tôi đói bụng.
물 좀 주세요.          mul jom juseyo.          = Cho tôi xin nước.
</code></pre>
<h3>Động từ sinh hoạt hằng ngày (하루 일과)</h3>
<pre><code>일어나다   ireonada   = thức dậy       -&gt; 일어나요
씻다       ssitda     = rửa mặt/tắm    -&gt; 씻어요
밥을 먹다  bab-eul meokda = ăn cơm      -&gt; 밥을 먹어요
학교에 가다 hakgyo-e gada = đi học      -&gt; 학교에 가요
집에 오다  jib-e oda  = về nhà         -&gt; 집에 와요
자다       jada       = ngủ            -&gt; 자요
</code></pre>
<div class="callout"><span class="badge">주세요 dùng được rất nhiều việc</span> Gắn 주세요 ("làm ơn cho/làm") sau danh từ hoặc dạng -아/어 của thân động từ để lịch sự nhờ gần như mọi việc — mẫu câu sống còn khi đi chợ, ăn uống, việc vặt hằng ngày.</div>`,
  ]]);

const c7q = quiz('ikl001-quiz-7', 'Quiz 7 — Shopping & daily life|||Quiz 7 — Mua sắm & sinh hoạt', [
  { id: 'q1', question: '「이거 얼마예요?」nghĩa là gì?', options: ['Cái này ngon không?', 'Cái này bao nhiêu tiền?', 'Cái này ở đâu?', 'Cho tôi cái này'], correctIndex: 1, explanation: '얼마예요? = giá bao nhiêu, dùng khi mua sắm.' },
  { id: 'q2', question: 'Mẫu 주세요 gắn sau danh từ hoặc động từ dùng để?', options: ['Phủ định câu', 'Lịch sự nhờ/yêu cầu điều gì đó', 'Hỏi giờ', 'Chào tạm biệt'], correctIndex: 1, explanation: '주세요 = "làm ơn cho/làm", mẫu nhờ vả lịch sự rất thông dụng.' },
  { id: 'q3', question: '「일어나다」(ireonada) nghĩa là?', options: ['Đi ngủ', 'Thức dậy', 'Về nhà', 'Ăn cơm'], correctIndex: 1, explanation: '일어나다 = thức dậy, một động từ sinh hoạt hằng ngày cơ bản.' },
]);

const c8 = doc('ikl001-8-1-review-topik', '8.1 — Review: basic dialogue & getting ready for TOPIK I|||8.1 — Ôn tập: hội thoại cơ bản & chuẩn bị TOPIK I',
  'Hội thoại tổng hợp (chào hỏi, giới thiệu, mua sắm), cấu trúc kỳ thi TOPIK I (Nghe + Đọc, sơ cấp 1-2).',
  [[
    `<span class="eyebrow">IKL001 · Chapter 8 · Lesson 8.1</span>
<h2>Review: basic dialogue &amp; getting ready for TOPIK I</h2>
<h3>Full review dialogue</h3>
<pre><code>A: 안녕하세요. 저는 하나예요. 만나서 반갑습니다.
   = Hello. I'm Hana. Nice to meet you.
B: 안녕하세요. 저는 티엔이에요. 저는 베트남 사람이에요.
   = Hello. I'm Tien. I'm Vietnamese.
A: 지금 몇 시예요?
   = What time is it now?
B: 세 시 삼십 분이에요. 같이 식당에 가요.
   = It's 3:30. Let's go to a restaurant together.
A: 좋아요! 이거 얼마예요?
   = Great! (at the restaurant) How much is this?
B: 오천 원이에요. 맛있어요!
   = It's 5,000 won. It's delicious!
</code></pre>
<h3>What TOPIK I tests</h3>
<p><strong>TOPIK I (한국어능력시험 I)</strong> is the beginner-level Korean proficiency test, split into two grades: <strong>Level 1</strong> (sơ cấp 1) and <strong>Level 2</strong> (sơ cấp 2). It has <strong>2 sections only — Listening and Reading</strong> (no speaking/writing at this level), 100 multiple-choice questions total, about 100 minutes.</p>
<pre><code>TOPIK I structure:
  듣기 (Listening)  40 questions, ~40 minutes
  읽기 (Reading)     60 questions, ~60 minutes
  Score: 0-200 total.  Level 1: 80+.  Level 2: 140+.
</code></pre>
<h3>What this course covered — a quick map</h3>
<p>Hangeul alphabet → syllables &amp; patchim → greetings &amp; self-intro → numbers &amp; time → particles &amp; 이다 → verbs/adjectives with 아요/어요 → shopping &amp; daily life. Together these cover the core vocabulary and grammar patterns that recur across TOPIK I's listening and reading passages.</p>
<div class="callout"><span class="badge">Next step</span> Keep building vocabulary in topic chunks (numbers, food, places, daily verbs), read patchim words aloud for liaison practice, and try official TOPIK I sample tests (available on topik.go.kr) under timed conditions.</div>`,
    `<span class="eyebrow">IKL001 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập: hội thoại cơ bản &amp; chuẩn bị TOPIK I</h2>
<h3>Hội thoại ôn tập tổng hợp</h3>
<pre><code>A: 안녕하세요. 저는 하나예요. 만나서 반갑습니다.
   = Xin chào. Mình là Hana. Rất vui được gặp bạn.
B: 안녕하세요. 저는 티엔이에요. 저는 베트남 사람이에요.
   = Xin chào. Mình là Tiên. Mình là người Việt Nam.
A: 지금 몇 시예요?
   = Bây giờ mấy giờ rồi?
B: 세 시 삼십 분이에요. 같이 식당에 가요.
   = 3 giờ 30 rồi. Cùng đi ăn nhà hàng đi.
A: 좋아요! 이거 얼마예요?
   = Được đó! (ở nhà hàng) Cái này bao nhiêu tiền?
B: 오천 원이에요. 맛있어요!
   = 5.000 won thôi. Ngon lắm!
</code></pre>
<h3>TOPIK I kiểm tra những gì</h3>
<p><strong>TOPIK I (한국어능력시험 I)</strong> là kỳ thi năng lực tiếng Hàn trình độ sơ cấp, chia làm hai bậc: <strong>Sơ cấp 1</strong> và <strong>Sơ cấp 2</strong>. Chỉ có <strong>2 phần — Nghe và Đọc</strong> (không có Nói/Viết ở trình độ này), tổng 100 câu trắc nghiệm, khoảng 100 phút.</p>
<pre><code>Cấu trúc TOPIK I:
  듣기 (Nghe)   40 câu, ~40 phút
  읽기 (Đọc)     60 câu, ~60 phút
  Điểm: 0-200 tổng.  Sơ cấp 1: từ 80.  Sơ cấp 2: từ 140.
</code></pre>
<h3>Bản đồ những gì môn học đã đi qua</h3>
<p>Bảng chữ cái Hangeul → âm tiết &amp; patchim → chào hỏi &amp; giới thiệu bản thân → số đếm &amp; giờ → trợ từ &amp; 이다 → động/tính từ với 아요/어요 → mua sắm &amp; sinh hoạt hằng ngày. Tất cả gộp lại là từ vựng và mẫu ngữ pháp cốt lõi lặp lại xuyên suốt các đoạn nghe/đọc của TOPIK I.</p>
<div class="callout"><span class="badge">Bước tiếp theo</span> Tiếp tục học từ vựng theo cụm chủ đề (số đếm, món ăn, địa điểm, động từ hằng ngày), đọc to các từ có patchim để luyện liên âm, và thử đề mẫu TOPIK I chính thức (trên topik.go.kr) trong điều kiện bấm giờ.</div>`,
  ]]);

const c8q = quiz('ikl001-quiz-8', 'Quiz 8 — Review & TOPIK I|||Quiz 8 — Ôn tập & TOPIK I', [
  { id: 'q1', question: 'TOPIK I gồm những phần thi nào?', options: ['Nghe & Nói', 'Nghe & Đọc', 'Đọc & Viết', 'Nghe, Nói, Đọc, Viết'], correctIndex: 1, explanation: 'TOPIK I (sơ cấp) chỉ có 2 phần: Nghe (듣기) và Đọc (읽기), không có Nói/Viết.' },
  { id: 'q2', question: 'TOPIK I có tổng cộng bao nhiêu câu hỏi?', options: ['40', '60', '100', '200'], correctIndex: 2, explanation: '40 câu Nghe + 60 câu Đọc = 100 câu trắc nghiệm.' },
  { id: 'q3', question: 'Trong hội thoại ôn tập, 「세 시 삼십 분이에요」nghĩa là?', options: ['5.000 won', '3 giờ 30 phút', 'Rất vui được gặp bạn', 'Cái này bao nhiêu tiền'], correctIndex: 1, explanation: '세 시 (giờ, số thuần Hàn) + 삼십 분 (phút, số Hán-Hàn) = 3 giờ 30.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'IKL001',
    slug: 'ikl001-nhap-mon-tieng-han',
    title: 'Introduction to Korean',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IKL001.webp',
    shortDescription: 'Introduction to Korean (TOPIK I level) — Hangeul alphabet, syllables & patchim, greetings & self-intro, Sino-/native numbers & time, particles (은/는, 이/가, 을/를) & 이다, verb/adjective endings 아요/어요, shopping & daily life, TOPIK I review.|||Nhập môn tiếng Hàn (trình độ TOPIK I) — bảng chữ cái Hangeul, âm tiết & patchim, chào hỏi & tự giới thiệu, số đếm & giờ, trợ từ (은/는, 이/가, 을/를) & 이다, đuôi động/tính từ 아요/어요, mua sắm & sinh hoạt, ôn tập TOPIK I.',
    description: 'Môn <strong>IKL001 — Introduction to Korean / Nhập môn tiếng Hàn</strong> (ngành Ngôn ngữ Hàn, kỳ 1) đưa bạn từ con số 0 lên trình độ <strong>TOPIK I (sơ cấp 1)</strong>. Bám theo tinh thần giáo trình <strong>서울대 한국어 1A</strong> và <strong>Sejong Korean 1</strong>: <strong>bảng chữ cái Hangeul</strong> (모음/자음) → <strong>âm tiết &amp; patchim</strong> (받침, liên âm 연음) → <strong>chào hỏi &amp; giới thiệu bản thân</strong> (안녕하세요, 저는…) → <strong>số đếm Hán-Hàn/thuần Hàn &amp; ngày giờ</strong> → <strong>trợ từ cơ bản</strong> (은/는, 이/가, 을/를) &amp; câu <strong>이다</strong> → <strong>động từ, tính từ &amp; đuôi 아요/어요</strong> → <strong>mua sắm, ăn uống &amp; sinh hoạt hằng ngày</strong> → <strong>ôn tập &amp; chuẩn bị TOPIK I</strong>. Song ngữ Việt/Anh, có chữ Hàn (Hangeul) thật + phiên âm romaja + quiz mỗi chương.',
    whatYouLearn: '10 nguyên âm & 14 phụ âm Hangeul, ghép âm tiết; patchim (받침) & 7 âm đại diện, liên âm 연음; chào hỏi & tự giới thiệu (안녕하세요, 저는…이에요); số Hán-Hàn (일이삼…) & thuần Hàn (하나둘셋…), nói giờ; trợ từ 은/는·이/가·을/를 & động từ 이다 (이에요/예요, 아니에요); chia động/tính từ hiện tại 아요/어요 (하다→해요); mẫu câu mua sắm (얼마예요?, 주세요) & ăn uống & sinh hoạt hằng ngày; cấu trúc kỳ thi TOPIK I (Nghe + Đọc).',
    requirements: 'Không cần biết tiếng Hàn trước đó. Phù hợp người mới bắt đầu, hướng tới trình độ TOPIK I sơ cấp 1.',
  },
  sections: [
    { title: 'Chương 1 — Bảng chữ cái Hangeul|||Chapter 1 — Hangeul alphabet', description: 'Nguyên âm (모음) & phụ âm (자음) cơ bản, ghép âm tiết.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Âm tiết & patchim|||Chapter 2 — Syllables & patchim', description: 'Patchim (받침), 7 âm đại diện, liên âm 연음.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chào hỏi & giới thiệu bản thân|||Chapter 3 — Greetings & self-introduction', description: '안녕하세요, mẫu giới thiệu tên, hội thoại chào hỏi.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Số đếm & ngày giờ|||Chapter 4 — Numbers & time', description: 'Số Hán-Hàn & thuần Hàn, cách nói giờ.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Trợ từ cơ bản & câu 이다|||Chapter 5 — Basic particles & the copula 이다', description: '은/는, 이/가, 을/를; 이에요/예요, phủ định 아니에요.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Động từ, tính từ & đuôi 아요/어요|||Chapter 6 — Verbs, adjectives & 아요/어요', description: 'Quy tắc chia 아요/어요, 하다→해요, tính từ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Mua sắm, ăn uống & sinh hoạt hằng ngày|||Chapter 7 — Shopping, eating & daily life', description: '얼마예요?, 주세요, gọi món, động từ sinh hoạt.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập & chuẩn bị TOPIK I|||Chapter 8 — Review & TOPIK I preparation', description: 'Hội thoại tổng hợp, cấu trúc kỳ thi TOPIK I.', lessons: [c8, c8q] },
  ],
};
