/**
 * KRL112 — Elementary Korean 1 (Tiếng Hàn sơ cấp 1). Khối Ngôn ngữ Hàn FPTU, Kỳ 1.
 * Giáo trình chuẩn: 세종한국어 Sejong Korean 1 (King Sejong Institute) / Ewha Korean;
 * trình độ TOPIK I sơ cấp. MÔN NGÔN NGỮ — mỗi bài: từ vựng, ngữ pháp, hội thoại,
 * ghi chú chữ viết/phát âm. Hangul + Revised Romanization + nghĩa tiếng Việt.
 * bi(e,v): e = trình bày Hàn+Anh, v = giải thích tiếng Việt.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 300, questions } });

/* ── Tài liệu ────────────────────────────────────────────────────────────── */
const taiLieu = doc('krl112-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình Sejong Korean 1 / Ewha, app TOPIK ONE / Anki, Naver dictionary, YouTube, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">KRL112 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to start <strong>Elementary Korean 1</strong> — the Hangul alphabet, greetings, basic particles and everyday verbs — in one place. The official FPTU giáo trình &amp; slides live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbooks</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 1</em> — King Sejong Institute (free PDF &amp; audio)</a></li>
<li><em>Ewha Korean 1-1</em> — Ewha Womans University Press</li>
</ul>
<h3>🌐 Dictionaries &amp; apps</h3>
<ul>
<li><a href="https://korean.dict.naver.com/" target="_blank" rel="noopener">Naver Korean Dictionary (한국어사전)</a></li>
<li>TOPIK ONE (mobile) — TOPIK I vocabulary &amp; grammar drills</li>
<li>Anki — spaced-repetition flashcards for Hangul &amp; vocab</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — beginner grammar &amp; listening</li>
<li><a href="https://www.youtube.com/@GoBillyKorean" target="_blank" rel="noopener">Go! Billy Korean</a> — Hangul &amp; pronunciation from zero</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Read Hangul first</strong> — master the 40 letters and syllable blocks before anything else; it unlocks everything.</li>
<li><strong>Core survival Korean</strong> — greetings, 이에요/예요, this/that, numbers &amp; time.</li>
<li><strong>Build sentences</strong> — subject/topic/object particles, 아요/어요 present tense, past &amp; negation.</li>
<li><strong>Speak</strong> — practise short dialogues aloud; aim at TOPIK I listening &amp; reading.</li>
</ol></div>`,
    `<span class="eyebrow">KRL112 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để bắt đầu <strong>Tiếng Hàn sơ cấp 1</strong> — bảng chữ Hangul, chào hỏi, trợ từ cơ bản và động từ hằng ngày — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 1</em> — Viện King Sejong (PDF &amp; audio miễn phí)</a></li>
<li><em>Ewha Korean 1-1</em> — NXB Đại học Ewha</li>
</ul>
<h3>🌐 Từ điển &amp; ứng dụng</h3>
<ul>
<li><a href="https://korean.dict.naver.com/" target="_blank" rel="noopener">Từ điển Naver (한국어사전)</a></li>
<li>TOPIK ONE (điện thoại) — luyện từ vựng &amp; ngữ pháp TOPIK I</li>
<li>Anki — thẻ ghi nhớ lặp lại ngắt quãng cho Hangul &amp; từ vựng</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — ngữ pháp &amp; nghe cho người mới</li>
<li><a href="https://www.youtube.com/@GoBillyKorean" target="_blank" rel="noopener">Go! Billy Korean</a> — Hangul &amp; phát âm từ số 0</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Đọc được Hangul trước</strong> — thuộc 40 chữ cái và cách ghép âm tiết trước mọi thứ khác; nó mở khoá tất cả.</li>
<li><strong>Tiếng Hàn sinh tồn</strong> — chào hỏi, 이에요/예요, đại từ chỉ định, số &amp; giờ.</li>
<li><strong>Dựng câu</strong> — trợ từ chủ ngữ/chủ đề/tân ngữ, thì hiện tại 아요/어요, quá khứ &amp; phủ định.</li>
<li><strong>Nói</strong> — luyện hội thoại ngắn thành tiếng; hướng tới nghe &amp; đọc trình độ TOPIK I.</li>
</ol></div>`,
  ]]);

/* ── Giới thiệu môn ──────────────────────────────────────────────────────── */
const intro = doc('krl112-0-1-overview', 'Course overview: how to learn Korean|||Tổng quan: cách học tiếng Hàn',
  'Mục tiêu môn (nhập môn TOPIK I), giới thiệu bảng chữ Hangul, và cách học tiếng Hàn hiệu quả.',
  [[
    `<span class="eyebrow">KRL112 · Lesson 0.1 · Overview</span>
<h2>Elementary Korean 1</h2>
<p class="lead">This course takes you from <strong>zero to your first Korean sentences</strong>. You will read and write <strong>Hangul (한글)</strong>, greet people, introduce yourself, count, tell the time, describe where things are, and talk about everyday actions in the present and past — the core of the <strong>TOPIK I</strong> beginner level.</p>
<h3>Why Hangul is easy</h3>
<p>Korean is written in <strong>Hangul</strong>, a scientific alphabet of just <strong>40 letters</strong> (14 basic consonants + 10 basic vowels, plus a few combinations). Letters stack into <strong>syllable blocks</strong> — you can learn to read it in days, not years.</p>
<h3>Roadmap</h3>
<p>Hangul &amp; sound rules → greetings → this/that (이것/그것/저것) → numbers &amp; time → place &amp; existence (있어요/없어요) → present-tense verbs (아요/어요/해요) → past &amp; negation → going, coming &amp; inviting. Bilingual Korean-Vietnamese, with vocabulary tables, grammar notes, short dialogues and a quiz each lesson.</p>
<div class="callout"><span class="badge">Politeness level</span> This course uses the <strong>해요체</strong> (polite -요 style) and <strong>합니다체</strong> (formal) — the safe, respectful speech you will use with teachers, strangers and colleagues.</div>`,
    `<span class="eyebrow">KRL112 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Hàn sơ cấp 1</h2>
<p class="lead">Môn này đưa bạn từ <strong>số 0 đến những câu tiếng Hàn đầu tiên</strong>. Bạn sẽ đọc và viết <strong>Hangul (한글)</strong>, chào hỏi, tự giới thiệu, đếm số, xem giờ, tả vị trí đồ vật và nói về hoạt động hằng ngày ở hiện tại và quá khứ — phần cốt lõi của trình độ sơ cấp <strong>TOPIK I</strong>.</p>
<h3>Vì sao Hangul dễ</h3>
<p>Tiếng Hàn viết bằng <strong>Hangul</strong>, một bảng chữ khoa học chỉ gồm <strong>40 chữ cái</strong> (14 phụ âm cơ bản + 10 nguyên âm cơ bản, cùng vài tổ hợp). Các chữ ghép thành <strong>khối âm tiết</strong> — bạn đọc được nó trong vài ngày, không phải vài năm.</p>
<h3>Lộ trình</h3>
<p>Hangul &amp; quy tắc phát âm → chào hỏi → đây/đó/kia (이것/그것/저것) → số &amp; giờ → địa điểm &amp; tồn tại (있어요/없어요) → động từ hiện tại (아요/어요/해요) → quá khứ &amp; phủ định → đi, đến &amp; mời. Song ngữ Hàn-Việt, có bảng từ vựng, ghi chú ngữ pháp, hội thoại ngắn và quiz mỗi bài.</p>
<div class="callout"><span class="badge">Bậc lịch sự</span> Môn này dùng <strong>해요체</strong> (thể lịch sự đuôi -요) và <strong>합니다체</strong> (trang trọng) — cách nói an toàn, tôn trọng, dùng với thầy cô, người lạ và đồng nghiệp.</div>`,
  ]]);

/* ── Bài 1 — Hangul ──────────────────────────────────────────────────────── */
const b1 = doc('krl112-1-1-hangul', 'Lesson 1 — The Hangul alphabet|||Bài 1 — Bảng chữ Hangul',
  'Nguyên âm cơ bản/đôi, phụ âm, quy tắc ghép khối âm tiết, và batchim (phụ âm cuối).',
  [[
    `<span class="eyebrow">KRL112 · Lesson 1</span>
<h2>The Hangul alphabet (한글)</h2>
<h3>Basic vowels</h3>
<table><thead><tr><th>한글</th><th>Romanization</th><th>Sound</th></tr></thead><tbody>
<tr><td>ㅏ</td><td>a</td><td>"a" in father</td></tr>
<tr><td>ㅓ</td><td>eo</td><td>"u" in but</td></tr>
<tr><td>ㅗ</td><td>o</td><td>"o" in more</td></tr>
<tr><td>ㅜ</td><td>u</td><td>"oo" in moon</td></tr>
<tr><td>ㅡ</td><td>eu</td><td>"oo" in good (lips flat)</td></tr>
<tr><td>ㅣ</td><td>i</td><td>"ee" in see</td></tr>
</tbody></table>
<p>Adding a stroke gives the <strong>y-vowels</strong>: ㅑ ya, ㅕ yeo, ㅛ yo, ㅠ yu. Combined vowels include ㅐ ae, ㅔ e, ㅘ wa, ㅝ wo.</p>
<h3>Basic consonants</h3>
<table><thead><tr><th>한글</th><th>Romanization</th></tr></thead><tbody>
<tr><td>ㄱ</td><td>g / k</td></tr>
<tr><td>ㄴ</td><td>n</td></tr>
<tr><td>ㄷ</td><td>d / t</td></tr>
<tr><td>ㄹ</td><td>r / l</td></tr>
<tr><td>ㅁ</td><td>m</td></tr>
<tr><td>ㅂ</td><td>b / p</td></tr>
<tr><td>ㅅ</td><td>s</td></tr>
<tr><td>ㅇ</td><td>silent / ng</td></tr>
<tr><td>ㅈ</td><td>j</td></tr>
<tr><td>ㅎ</td><td>h</td></tr>
</tbody></table>
<h3>Building syllable blocks</h3>
<p>Every syllable is a <strong>block</strong> of consonant + vowel, optionally with a final consonant. The letter <strong>ㅇ is silent</strong> at the start of a block, so a vowel-initial sound is written with ㅇ as a placeholder.</p>
<pre><code>ㄱ + ㅏ = 가 (ga)
ㄴ + ㅏ = 나 (na)   "I / me" (casual)
ㅇ + ㅏ = 아 (a)    ㅇ is silent here
ㅎ + ㅏ + ㄴ = 한 (han)   final ㄴ = batchim</code></pre>
<h3>Batchim — the final consonant</h3>
<p>A consonant under the block is a <strong>batchim (받침)</strong>. Korea = 한국 (han-guk): the ㄱ under 국 is a batchim. Batchim are pronounced with only <strong>7 representative sounds</strong>, so ㅅ, ㅆ, ㅈ at the end all sound like a soft "t".</p>
<div class="callout"><span class="badge">Note</span> 한국 = Korea (hanguk); 한국어 = Korean language (hangugeo). Read left-to-right, top-to-bottom inside each block.</div>`,
    `<span class="eyebrow">KRL112 · Bài 1</span>
<h2>Bảng chữ Hangul (한글)</h2>
<h3>Nguyên âm cơ bản</h3>
<table><thead><tr><th>한글</th><th>Phiên âm</th><th>Cách đọc</th></tr></thead><tbody>
<tr><td>ㅏ</td><td>a</td><td>"a" trong "ba"</td></tr>
<tr><td>ㅓ</td><td>eo</td><td>gần "ơ"</td></tr>
<tr><td>ㅗ</td><td>o</td><td>"ô"</td></tr>
<tr><td>ㅜ</td><td>u</td><td>"u"</td></tr>
<tr><td>ㅡ</td><td>eu</td><td>"ư" (môi dẹt)</td></tr>
<tr><td>ㅣ</td><td>i</td><td>"i"</td></tr>
</tbody></table>
<p>Thêm một nét thì thành <strong>nguyên âm y</strong>: ㅑ ya, ㅕ yeo, ㅛ yo, ㅠ yu. Nguyên âm ghép có ㅐ ae, ㅔ e, ㅘ wa, ㅝ wo.</p>
<h3>Phụ âm cơ bản</h3>
<table><thead><tr><th>한글</th><th>Phiên âm</th></tr></thead><tbody>
<tr><td>ㄱ</td><td>g / k</td></tr>
<tr><td>ㄴ</td><td>n</td></tr>
<tr><td>ㄷ</td><td>d / t</td></tr>
<tr><td>ㄹ</td><td>r / l</td></tr>
<tr><td>ㅁ</td><td>m</td></tr>
<tr><td>ㅂ</td><td>b / p</td></tr>
<tr><td>ㅅ</td><td>s</td></tr>
<tr><td>ㅇ</td><td>câm / ng</td></tr>
<tr><td>ㅈ</td><td>j</td></tr>
<tr><td>ㅎ</td><td>h</td></tr>
</tbody></table>
<h3>Ghép khối âm tiết</h3>
<p>Mỗi âm tiết là một <strong>khối</strong> gồm phụ âm + nguyên âm, có thể kèm phụ âm cuối. Chữ <strong>ㅇ câm</strong> khi đứng đầu khối, nên âm bắt đầu bằng nguyên âm vẫn phải viết ㅇ làm chỗ đệm.</p>
<pre><code>ㄱ + ㅏ = 가 (ga)
ㄴ + ㅏ = 나 (na)   "tôi / tớ" (thân mật)
ㅇ + ㅏ = 아 (a)    ㅇ ở đây câm
ㅎ + ㅏ + ㄴ = 한 (han)   ㄴ cuối = batchim</code></pre>
<h3>Batchim — phụ âm cuối</h3>
<p>Phụ âm nằm dưới khối gọi là <strong>batchim (받침)</strong>. Hàn Quốc = 한국 (han-guk): chữ ㄱ dưới 국 là batchim. Batchim chỉ đọc thành <strong>7 âm đại diện</strong>, nên ㅅ, ㅆ, ㅈ ở cuối đều nghe như âm "t" nhẹ.</p>
<div class="callout"><span class="badge">Ghi chú</span> 한국 = Hàn Quốc (hanguk); 한국어 = tiếng Hàn (hangugeo). Đọc trong mỗi khối từ trái sang phải, trên xuống dưới.</div>`,
  ]]);
const b1q = quiz('krl112-quiz-1', 'Quiz 1 — Hangul|||Quiz 1 — Bảng chữ Hangul', [
  { id: 'q1', question: 'Which sound is the vowel ㅏ closest to?|||Nguyên âm ㅏ đọc gần âm nào?', options: ['"ee" (see)', '"a" (father)', '"oo" (moon)', '"aw" (more)'], correctIndex: 1, explanation: 'ㅏ = a, như "a" trong "ba".' },
  { id: 'q2', question: 'At the START of a syllable block, the letter ㅇ is…|||Ở ĐẦU một khối âm tiết, chữ ㅇ thì…', options: ['pronounced "ng"|||đọc là "ng"', 'pronounced "o"|||đọc là "o"', 'silent (a placeholder)|||câm (chỗ đệm)', 'pronounced "h"|||đọc là "h"'], correctIndex: 2, explanation: 'ㅇ đầu khối câm; cuối khối mới đọc "ng".' },
  { id: 'q3', question: 'The final consonant under a syllable block is called…|||Phụ âm cuối dưới khối âm tiết gọi là…', options: ['batchim (받침)', 'Hangul', 'Hanja', 'jamo'], correctIndex: 0, explanation: 'Batchim = phụ âm cuối, chỉ đọc thành 7 âm đại diện.' },
]);

/* ── Bài 2 — Chào hỏi ────────────────────────────────────────────────────── */
const b2 = doc('krl112-2-1-greetings', 'Lesson 2 — Greetings & introductions|||Bài 2 — Chào hỏi & giới thiệu',
  '안녕하세요, 감사합니다, 저는 〜입니다; cách xưng hô và tự giới thiệu.',
  [[
    `<span class="eyebrow">KRL112 · Lesson 2</span>
<h2>Greetings &amp; introductions</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>안녕하세요</td><td>annyeonghaseyo</td><td>hello</td></tr>
<tr><td>안녕히 가세요</td><td>annyeonghi gaseyo</td><td>goodbye (to one leaving)</td></tr>
<tr><td>안녕히 계세요</td><td>annyeonghi gyeseyo</td><td>goodbye (to one staying)</td></tr>
<tr><td>감사합니다</td><td>gamsahamnida</td><td>thank you</td></tr>
<tr><td>죄송합니다</td><td>joesonghamnida</td><td>sorry</td></tr>
<tr><td>네 / 아니요</td><td>ne / aniyo</td><td>yes / no</td></tr>
<tr><td>저</td><td>jeo</td><td>I / me (humble)</td></tr>
</tbody></table>
<h3>Grammar — 저는 N입니다 (I am N)</h3>
<p><strong>저는</strong> (jeoneun) = "as for me"; <strong>N입니다</strong> (imnida) = "am/is N" in formal speech. To meet someone: <strong>만나서 반갑습니다</strong> (mannaseo bangapseumnida — nice to meet you).</p>
<pre><code>저는 투안입니다.  jeoneun Tuan-imnida.  = I am Tuan.
저는 학생입니다.  jeoneun haksaeng-imnida. = I am a student.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 안녕하세요? 저는 민수입니다. (Annyeonghaseyo? Jeoneun Minsu-imnida.)</p>
<p><strong>B:</strong> 안녕하세요? 만나서 반갑습니다. (Annyeonghaseyo? Mannaseo bangapseumnida.)</p>
</div>
<div class="callout"><span class="badge">Writing &amp; sound</span> 안녕하세요 is written with a question-like rising tone even without "?". The final ㅂ in 반갑습니다 links into the next sound, so it sounds like "bangapsseumnida".</div>`,
    `<span class="eyebrow">KRL112 · Bài 2</span>
<h2>Chào hỏi &amp; giới thiệu</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>안녕하세요</td><td>annyeonghaseyo</td><td>xin chào</td></tr>
<tr><td>안녕히 가세요</td><td>annyeonghi gaseyo</td><td>tạm biệt (nói với người rời đi)</td></tr>
<tr><td>안녕히 계세요</td><td>annyeonghi gyeseyo</td><td>tạm biệt (nói với người ở lại)</td></tr>
<tr><td>감사합니다</td><td>gamsahamnida</td><td>cảm ơn</td></tr>
<tr><td>죄송합니다</td><td>joesonghamnida</td><td>xin lỗi</td></tr>
<tr><td>네 / 아니요</td><td>ne / aniyo</td><td>vâng / không</td></tr>
<tr><td>저</td><td>jeo</td><td>tôi (khiêm nhường)</td></tr>
</tbody></table>
<h3>Ngữ pháp — 저는 N입니다 (Tôi là N)</h3>
<p><strong>저는</strong> (jeoneun) = "còn tôi thì"; <strong>N입니다</strong> (imnida) = "là N" ở thể trang trọng. Khi gặp ai đó: <strong>만나서 반갑습니다</strong> (mannaseo bangapseumnida — rất vui được gặp).</p>
<pre><code>저는 투안입니다.  jeoneun Tuan-imnida.  = Tôi là Tuấn.
저는 학생입니다.  jeoneun haksaeng-imnida. = Tôi là sinh viên.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 안녕하세요? 저는 민수입니다. (Annyeonghaseyo? Jeoneun Minsu-imnida.)</p>
<p><strong>B:</strong> 안녕하세요? 만나서 반갑습니다. (Annyeonghaseyo? Mannaseo bangapseumnida.)</p>
</div>
<div class="callout"><span class="badge">Chữ viết &amp; phát âm</span> 안녕하세요 dù không có "?" vẫn đọc lên giọng như câu hỏi. Âm ㅂ cuối trong 반갑습니다 nối sang âm sau, nghe thành "bangapsseumnida".</div>`,
  ]]);
const b2q = quiz('krl112-quiz-2', 'Quiz 2 — Greetings|||Quiz 2 — Chào hỏi', [
  { id: 'q1', question: 'What does "감사합니다" mean?|||"감사합니다" nghĩa là gì?', options: ['hello|||xin chào', 'thank you|||cảm ơn', 'sorry|||xin lỗi', 'goodbye|||tạm biệt'], correctIndex: 1, explanation: '감사합니다 (gamsahamnida) = cảm ơn.' },
  { id: 'q2', question: 'How do you say "I am a student" (formal)?|||Nói "Tôi là sinh viên" (trang trọng) là?', options: ['저는 학생입니다', '학생이 저입니다', '저는 학생만입니다', '학생 안녕하세요'], correctIndex: 0, explanation: '저는(tôi) + 학생(sinh viên) + 입니다(là) = 저는 학생입니다.' },
  { id: 'q3', question: 'To someone who is STAYING, the person leaving says…|||Với người ĐANG Ở LẠI, người rời đi nói câu nào?', options: ['안녕히 가세요', '안녕히 계세요', '만나서 반갑습니다', '죄송합니다'], correctIndex: 1, explanation: '안녕히 계세요 (gyeseyo) = nói với người ở lại; 가세요 nói với người rời đi.' },
]);

/* ── Bài 3 — Đây là gì ───────────────────────────────────────────────────── */
const b3 = doc('krl112-3-1-this-that', 'Lesson 3 — What is this?|||Bài 3 — Đây là cái gì?',
  '이것/그것/저것, trợ từ 이/가 và 은/는, đuôi 입니다 và 이에요/예요.',
  [[
    `<span class="eyebrow">KRL112 · Lesson 3</span>
<h2>What is this? (이것이 무엇입니까?)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>이것</td><td>igeot</td><td>this (thing, near me)</td></tr>
<tr><td>그것</td><td>geugeot</td><td>that (thing, near you)</td></tr>
<tr><td>저것</td><td>jeogeot</td><td>that (thing, over there)</td></tr>
<tr><td>무엇 / 뭐</td><td>mueot / mwo</td><td>what</td></tr>
<tr><td>책</td><td>chaek</td><td>book</td></tr>
<tr><td>가방</td><td>gabang</td><td>bag</td></tr>
</tbody></table>
<h3>Grammar — particles &amp; "to be"</h3>
<ul>
<li><strong>이/가</strong> (subject): 이 after a consonant, 가 after a vowel.</li>
<li><strong>은/는</strong> (topic): 은 after a consonant, 는 after a vowel.</li>
<li><strong>이에요/예요</strong> (polite "is"): 이에요 after a consonant, 예요 after a vowel. Formal form = <strong>입니다</strong>.</li>
</ul>
<pre><code>이것은 책이에요.   igeoseun chaeg-ieyo.   = This is a book.  (책 ends in consonant -> 이에요)
저것은 가방이에요. jeogeoseun gabang-ieyo. = That over there is a bag.
이것이 뭐예요?     igeosi mwo-yeyo?        = What is this?  (뭐 ends in vowel -> 예요)</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 이것이 뭐예요? (Igeosi mwo-yeyo?)</p>
<p><strong>B:</strong> 그것은 한국어 책이에요. (Geugeoseun hangugeo chaeg-ieyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 이/그/저 map to here/there/over-there just like 여기/거기/저기 in Lesson 5 — the same three-way distance system.</div>`,
    `<span class="eyebrow">KRL112 · Bài 3</span>
<h2>Đây là cái gì? (이것이 무엇입니까?)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>이것</td><td>igeot</td><td>cái này (gần tôi)</td></tr>
<tr><td>그것</td><td>geugeot</td><td>cái đó (gần bạn)</td></tr>
<tr><td>저것</td><td>jeogeot</td><td>cái kia (đằng xa)</td></tr>
<tr><td>무엇 / 뭐</td><td>mueot / mwo</td><td>cái gì</td></tr>
<tr><td>책</td><td>chaek</td><td>sách</td></tr>
<tr><td>가방</td><td>gabang</td><td>cặp / túi</td></tr>
</tbody></table>
<h3>Ngữ pháp — trợ từ &amp; "là"</h3>
<ul>
<li><strong>이/가</strong> (chủ ngữ): 이 sau phụ âm, 가 sau nguyên âm.</li>
<li><strong>은/는</strong> (chủ đề): 은 sau phụ âm, 는 sau nguyên âm.</li>
<li><strong>이에요/예요</strong> ("là", lịch sự): 이에요 sau phụ âm, 예요 sau nguyên âm. Thể trang trọng = <strong>입니다</strong>.</li>
</ul>
<pre><code>이것은 책이에요.   igeoseun chaeg-ieyo.   = Đây là quyển sách.  (책 kết thúc bằng phụ âm -> 이에요)
저것은 가방이에요. jeogeoseun gabang-ieyo. = Cái đằng kia là cái cặp.
이것이 뭐예요?     igeosi mwo-yeyo?        = Đây là cái gì?  (뭐 kết thúc bằng nguyên âm -> 예요)</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 이것이 뭐예요? (Igeosi mwo-yeyo?)</p>
<p><strong>B:</strong> 그것은 한국어 책이에요. (Geugeoseun hangugeo chaeg-ieyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 이/그/저 tương ứng đây/đó/kia, giống hệt 여기/거기/저기 ở Bài 5 — cùng một hệ ba mức khoảng cách.</div>`,
  ]]);
const b3q = quiz('krl112-quiz-3', 'Quiz 3 — This/that|||Quiz 3 — Đại từ chỉ định', [
  { id: 'q1', question: 'What does "이것" mean?|||"이것" nghĩa là gì?', options: ['that over there|||cái kia (đằng xa)', 'this (near me)|||cái này (gần tôi)', 'what|||cái gì', 'here|||ở đây'], correctIndex: 1, explanation: '이것 = cái này (gần người nói); 그것 gần người nghe; 저것 đằng xa.' },
  { id: 'q2', question: 'After a noun ending in a VOWEL, which copula ending?|||Sau danh từ kết thúc bằng NGUYÊN ÂM, dùng đuôi "là" nào?', options: ['이에요', '예요', '입니까', '이가'], correctIndex: 1, explanation: '예요 sau nguyên âm, 이에요 sau phụ âm.' },
  { id: 'q3', question: 'Topic particle 은/는 for "저" (ends in a vowel)?|||Trợ từ chủ đề 은/는 cho "저" (kết thúc bằng nguyên âm)?', options: ['저은', '저는', '저이', '저를'], correctIndex: 1, explanation: '저 kết thúc bằng nguyên âm nên dùng 는 → 저는.' },
]);

/* ── Bài 4 — Số & thời gian ─────────────────────────────────────────────── */
const b4 = doc('krl112-4-1-numbers-time', 'Lesson 4 — Numbers & time|||Bài 4 — Số & thời gian',
  'Hai hệ số (Hán-Hàn / thuần Hàn), giờ 시 và phút 분, ngày tháng năm.',
  [[
    `<span class="eyebrow">KRL112 · Lesson 4</span>
<h2>Numbers &amp; time</h2>
<h3>Two number systems</h3>
<table><thead><tr><th>Number</th><th>Native (thuần Hàn)</th><th>Sino (Hán-Hàn)</th></tr></thead><tbody>
<tr><td>1</td><td>하나 (hana)</td><td>일 (il)</td></tr>
<tr><td>2</td><td>둘 (dul)</td><td>이 (i)</td></tr>
<tr><td>3</td><td>셋 (set)</td><td>삼 (sam)</td></tr>
<tr><td>4</td><td>넷 (net)</td><td>사 (sa)</td></tr>
<tr><td>5</td><td>다섯 (daseot)</td><td>오 (o)</td></tr>
<tr><td>10</td><td>열 (yeol)</td><td>십 (sip)</td></tr>
</tbody></table>
<h3>Grammar — telling time</h3>
<p>Hours use <strong>native numbers + 시 (si)</strong>; minutes use <strong>sino numbers + 분 (bun)</strong>. Note 하나/둘/셋/넷 shorten to 한/두/세/네 before a counter. 오전 = AM, 오후 = PM.</p>
<pre><code>한 시      han si       = 1 o'clock   (native 하나 -> 한)
세 시 삼십 분  se si samsip bun = 3:30       (native hour + sino minute)
오후 두 시   ohu du si    = 2 PM</code></pre>
<h3>Dates</h3>
<p>Dates use <strong>sino numbers</strong>: 년 (nyeon = year), 월 (wol = month), 일 (il = day). Two are irregular: June = <strong>유월</strong> (yuwol, not 육월), October = <strong>시월</strong> (siwol, not 십월).</p>
<pre><code>2025년 6월 15일  = icheon-isip-o-nyeon yuwol sibo-il  (June 15, 2025)</code></pre>
<div class="callout"><span class="badge">Note</span> Age, hours and counting objects → native numbers; dates, money, minutes and phone numbers → sino numbers.</div>`,
    `<span class="eyebrow">KRL112 · Bài 4</span>
<h2>Số &amp; thời gian</h2>
<h3>Hai hệ đếm số</h3>
<table><thead><tr><th>Số</th><th>Thuần Hàn</th><th>Hán-Hàn</th></tr></thead><tbody>
<tr><td>1</td><td>하나 (hana)</td><td>일 (il)</td></tr>
<tr><td>2</td><td>둘 (dul)</td><td>이 (i)</td></tr>
<tr><td>3</td><td>셋 (set)</td><td>삼 (sam)</td></tr>
<tr><td>4</td><td>넷 (net)</td><td>사 (sa)</td></tr>
<tr><td>5</td><td>다섯 (daseot)</td><td>오 (o)</td></tr>
<tr><td>10</td><td>열 (yeol)</td><td>십 (sip)</td></tr>
</tbody></table>
<h3>Ngữ pháp — xem giờ</h3>
<p>Giờ dùng <strong>số thuần Hàn + 시 (si)</strong>; phút dùng <strong>số Hán-Hàn + 분 (bun)</strong>. Chú ý 하나/둘/셋/넷 rút gọn thành 한/두/세/네 trước danh từ đếm. 오전 = sáng (AM), 오후 = chiều (PM).</p>
<pre><code>한 시      han si       = 1 giờ   (thuần Hàn 하나 -> 한)
세 시 삼십 분  se si samsip bun = 3 giờ 30  (giờ thuần Hàn + phút Hán-Hàn)
오후 두 시   ohu du si    = 2 giờ chiều</code></pre>
<h3>Ngày tháng</h3>
<p>Ngày tháng dùng <strong>số Hán-Hàn</strong>: 년 (nyeon = năm), 월 (wol = tháng), 일 (il = ngày). Hai tháng bất quy tắc: tháng 6 = <strong>유월</strong> (yuwol, không phải 육월), tháng 10 = <strong>시월</strong> (siwol, không phải 십월).</p>
<pre><code>2025년 6월 15일  = icheon-isip-o-nyeon yuwol sibo-il  (ngày 15 tháng 6, 2025)</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Tuổi, giờ và đếm đồ vật → số thuần Hàn; ngày tháng, tiền, phút và số điện thoại → số Hán-Hàn.</div>`,
  ]]);
const b4q = quiz('krl112-quiz-4', 'Quiz 4 — Numbers & time|||Quiz 4 — Số & thời gian', [
  { id: 'q1', question: 'Counting HOURS (시) uses which number system?|||Đếm GIỜ (시) dùng hệ số nào?', options: ['Sino-Korean (일, 이, 삼)|||Hán-Hàn (일, 이, 삼)', 'Native Korean (하나, 둘, 셋)|||thuần Hàn (하나, 둘, 셋)', 'both equally|||cả hai như nhau', 'no numbers|||không dùng số'], correctIndex: 1, explanation: 'Giờ 시 dùng số thuần Hàn; phút 분 dùng số Hán-Hàn.' },
  { id: 'q2', question: 'Before a counter, "하나" (1) shortens to…|||Trước danh từ đếm, "하나" (1) rút gọn thành…', options: ['한', '하', '할', '하난'], correctIndex: 0, explanation: '하나→한, 둘→두, 셋→세, 넷→네 khi đứng trước danh từ đếm (한 시).' },
  { id: 'q3', question: 'Which is the correct word for "June"?|||"Tháng 6" viết đúng là?', options: ['육월', '유월', '여섯월', '육십월'], correctIndex: 1, explanation: 'Tháng 6 bất quy tắc: 유월 (yuwol); tháng 10 là 시월.' },
]);

/* ── Bài 5 — Địa điểm & tồn tại ─────────────────────────────────────────── */
const b5 = doc('krl112-5-1-place-existence', 'Lesson 5 — Place & existence|||Bài 5 — Địa điểm & tồn tại',
  '여기/거기/저기, 있어요/없어요, và trợ từ 에 (vị trí) so với 에서 (nơi hành động).',
  [[
    `<span class="eyebrow">KRL112 · Lesson 5</span>
<h2>Place &amp; existence</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>여기 / 거기 / 저기</td><td>yeogi / geogi / jeogi</td><td>here / there / over there</td></tr>
<tr><td>있어요</td><td>isseoyo</td><td>there is / to have</td></tr>
<tr><td>없어요</td><td>eopseoyo</td><td>there isn't / to not have</td></tr>
<tr><td>어디</td><td>eodi</td><td>where</td></tr>
<tr><td>학교</td><td>hakgyo</td><td>school</td></tr>
<tr><td>집</td><td>jip</td><td>house / home</td></tr>
</tbody></table>
<h3>Grammar — 에 vs 에서, 있어요/없어요</h3>
<ul>
<li><strong>N에</strong> (e) marks a <em>location of existence</em> or a destination: "at / to".</li>
<li><strong>N에서</strong> (eseo) marks where an <em>action</em> happens: "at / from".</li>
<li><strong>있어요</strong> = exists / have; <strong>없어요</strong> = does not exist / don't have.</li>
</ul>
<pre><code>책이 책상에 있어요.   chaeg-i chaeksang-e isseoyo. = The book is on the desk.
학교에 도서관이 있어요? hakgyo-e doseogwan-i isseoyo? = Is there a library at school?
집에서 공부해요.       jib-eseo gongbuhaeyo.        = I study at home. (action -> 에서)</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 화장실이 어디에 있어요? (Hwajangsil-i eodi-e isseoyo?)</p>
<p><strong>B:</strong> 저기에 있어요. (Jeogi-e isseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> Use 에 for "being somewhere" (있어요/없어요) and 에서 for "doing something somewhere" — mixing them up is the most common beginner slip.</div>`,
    `<span class="eyebrow">KRL112 · Bài 5</span>
<h2>Địa điểm &amp; tồn tại</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>여기 / 거기 / 저기</td><td>yeogi / geogi / jeogi</td><td>ở đây / ở đó / ở kia</td></tr>
<tr><td>있어요</td><td>isseoyo</td><td>có / ở (tồn tại)</td></tr>
<tr><td>없어요</td><td>eopseoyo</td><td>không có / không ở</td></tr>
<tr><td>어디</td><td>eodi</td><td>ở đâu</td></tr>
<tr><td>학교</td><td>hakgyo</td><td>trường học</td></tr>
<tr><td>집</td><td>jip</td><td>nhà</td></tr>
</tbody></table>
<h3>Ngữ pháp — 에 và 에서, 있어요/없어요</h3>
<ul>
<li><strong>N에</strong> (e) chỉ <em>vị trí tồn tại</em> hoặc điểm đến: "ở / đến".</li>
<li><strong>N에서</strong> (eseo) chỉ nơi <em>diễn ra hành động</em>: "tại / từ".</li>
<li><strong>있어요</strong> = có / ở; <strong>없어요</strong> = không có / không ở.</li>
</ul>
<pre><code>책이 책상에 있어요.   chaeg-i chaeksang-e isseoyo. = Quyển sách ở trên bàn.
학교에 도서관이 있어요? hakgyo-e doseogwan-i isseoyo? = Ở trường có thư viện không?
집에서 공부해요.       jib-eseo gongbuhaeyo.        = Tôi học ở nhà. (hành động -> 에서)</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 화장실이 어디에 있어요? (Hwajangsil-i eodi-e isseoyo?)</p>
<p><strong>B:</strong> 저기에 있어요. (Jeogi-e isseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Dùng 에 cho "ở đâu đó" (있어요/없어요) và 에서 cho "làm gì đó ở đâu" — nhầm hai cái này là lỗi phổ biến nhất của người mới.</div>`,
  ]]);
const b5q = quiz('krl112-quiz-5', 'Quiz 5 — Place & existence|||Quiz 5 — Địa điểm & tồn tại', [
  { id: 'q1', question: 'What does "없어요" mean?|||"없어요" nghĩa là gì?', options: ['there is / have|||có / tồn tại', 'there is not / do not have|||không có / không ở', 'where|||ở đâu', 'go|||đi'], correctIndex: 1, explanation: '있어요 = có; 없어요 = không có / không tồn tại.' },
  { id: 'q2', question: 'For "I study AT HOME", which particle after 집?|||Câu "Tôi học Ở NHÀ" dùng trợ từ nào sau 집?', options: ['집에', '집에서', '집을', '집이'], correctIndex: 1, explanation: 'Hành động (học) diễn ra tại nơi → dùng 에서: 집에서 공부해요.' },
  { id: 'q3', question: 'Which word means "over there" (far from both)?|||Từ nào nghĩa "ở kia" (xa cả hai người)?', options: ['여기', '거기', '저기', '어디'], correctIndex: 2, explanation: '여기 đây, 거기 đó, 저기 kia (xa cả hai người).' },
]);

/* ── Bài 6 — Động từ hiện tại ───────────────────────────────────────────── */
const b6 = doc('krl112-6-1-present-verbs', 'Lesson 6 — Present-tense verbs|||Bài 6 — Động từ hiện tại',
  'Chia đuôi 아요/어요/해요, trợ từ tân ngữ 을/를, và các hoạt động hằng ngày.',
  [[
    `<span class="eyebrow">KRL112 · Lesson 6</span>
<h2>Present-tense verbs (아요/어요/해요)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>가다</td><td>gada</td><td>to go</td></tr>
<tr><td>먹다</td><td>meokda</td><td>to eat</td></tr>
<tr><td>마시다</td><td>masida</td><td>to drink</td></tr>
<tr><td>보다</td><td>boda</td><td>to see / watch</td></tr>
<tr><td>공부하다</td><td>gongbuhada</td><td>to study</td></tr>
<tr><td>밥 / 물</td><td>bap / mul</td><td>rice, meal / water</td></tr>
</tbody></table>
<h3>Grammar — the polite present -요</h3>
<p>Drop 다 from the verb, then add an ending based on the stem's last vowel:</p>
<ul>
<li>Stem vowel ㅏ or ㅗ → <strong>아요</strong>: 가다 → 가요 (gayo), 보다 → 봐요 (bwayo).</li>
<li>Any other vowel → <strong>어요</strong>: 먹다 → 먹어요 (meogeoyo), 마시다 → 마셔요 (masyeoyo).</li>
<li>하다 verbs → <strong>해요</strong>: 공부하다 → 공부해요 (gongbuhaeyo).</li>
</ul>
<p>The object takes <strong>을/를</strong>: 을 after a consonant, 를 after a vowel.</p>
<pre><code>밥을 먹어요.    bab-eul meogeoyo.  = I eat rice.   (밥 + 을)
커피를 마셔요.  keopireul masyeoyo. = I drink coffee. (커피 + 를)
한국어를 공부해요. hangugeoreul gongbuhaeyo. = I study Korean.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 지금 뭐 해요? (Jigeum mwo haeyo?)</p>
<p><strong>B:</strong> 커피를 마셔요. (Keopireul masyeoyo.)</p>
</div>
<div class="callout"><span class="badge">Sound note</span> 마시다 + 어요 contracts: 마시어요 → 마셔요. The -요 present covers both "I do" and "do you?" — only the rising tone changes.</div>`,
    `<span class="eyebrow">KRL112 · Bài 6</span>
<h2>Động từ hiện tại (아요/어요/해요)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>가다</td><td>gada</td><td>đi</td></tr>
<tr><td>먹다</td><td>meokda</td><td>ăn</td></tr>
<tr><td>마시다</td><td>masida</td><td>uống</td></tr>
<tr><td>보다</td><td>boda</td><td>xem / nhìn</td></tr>
<tr><td>공부하다</td><td>gongbuhada</td><td>học</td></tr>
<tr><td>밥 / 물</td><td>bap / mul</td><td>cơm / nước</td></tr>
</tbody></table>
<h3>Ngữ pháp — hiện tại lịch sự -요</h3>
<p>Bỏ 다 khỏi động từ, rồi thêm đuôi tuỳ nguyên âm cuối của gốc:</p>
<ul>
<li>Nguyên âm gốc là ㅏ hoặc ㅗ → <strong>아요</strong>: 가다 → 가요 (gayo), 보다 → 봐요 (bwayo).</li>
<li>Nguyên âm khác → <strong>어요</strong>: 먹다 → 먹어요 (meogeoyo), 마시다 → 마셔요 (masyeoyo).</li>
<li>Động từ 하다 → <strong>해요</strong>: 공부하다 → 공부해요 (gongbuhaeyo).</li>
</ul>
<p>Tân ngữ đi với <strong>을/를</strong>: 을 sau phụ âm, 를 sau nguyên âm.</p>
<pre><code>밥을 먹어요.    bab-eul meogeoyo.  = Tôi ăn cơm.   (밥 + 을)
커피를 마셔요.  keopireul masyeoyo. = Tôi uống cà phê. (커피 + 를)
한국어를 공부해요. hangugeoreul gongbuhaeyo. = Tôi học tiếng Hàn.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 지금 뭐 해요? (Jigeum mwo haeyo?)</p>
<p><strong>B:</strong> 커피를 마셔요. (Keopireul masyeoyo.)</p>
</div>
<div class="callout"><span class="badge">Chú ý phát âm</span> 마시다 + 어요 rút gọn: 마시어요 → 마셔요. Đuôi -요 vừa là "tôi làm" vừa là "bạn làm không?" — chỉ khác ở giọng lên cuối câu.</div>`,
  ]]);
const b6q = quiz('krl112-quiz-6', 'Quiz 6 — Present verbs|||Quiz 6 — Động từ hiện tại', [
  { id: 'q1', question: 'The polite present of 가다 (to go) is…|||Hiện tại lịch sự của 가다 (đi) là…', options: ['가어요', '가요', '가해요', '가에요'], correctIndex: 1, explanation: 'Gốc 가 có nguyên âm ㅏ → 아요, rút gọn thành 가요.' },
  { id: 'q2', question: 'Verbs ending in 하다 conjugate to which ending?|||Động từ 하다 (làm/học...) chia thành đuôi nào?', options: ['하아요', '하어요', '해요', '하요'], correctIndex: 2, explanation: '하다 luôn thành 해요 (bất quy tắc): 공부하다 → 공부해요.' },
  { id: 'q3', question: 'The object "밥" (ends in a consonant) takes which particle?|||Tân ngữ "밥" (kết thúc phụ âm) đi với trợ từ nào?', options: ['밥를', '밥을', '밥이', '밥에'], correctIndex: 1, explanation: '을 sau phụ âm, 를 sau nguyên âm → 밥을 먹어요.' },
]);

/* ── Bài 7 — Quá khứ & phủ định ─────────────────────────────────────────── */
const b7 = doc('krl112-7-1-past-negation', 'Lesson 7 — Past tense & negation|||Bài 7 — Quá khứ & phủ định',
  'Đuôi quá khứ 았어요/었어요, phủ định 안 / 못, và liên từ 그리고 / 하지만.',
  [[
    `<span class="eyebrow">KRL112 · Lesson 7</span>
<h2>Past tense &amp; negation</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>어제 / 오늘</td><td>eoje / oneul</td><td>yesterday / today</td></tr>
<tr><td>안</td><td>an</td><td>not (simple negation)</td></tr>
<tr><td>못</td><td>mot</td><td>cannot (unable)</td></tr>
<tr><td>그리고</td><td>geurigo</td><td>and</td></tr>
<tr><td>하지만</td><td>hajiman</td><td>but</td></tr>
</tbody></table>
<h3>Grammar — past -았어요/었어요</h3>
<p>Same vowel rule as the present, plus 었/았 before -어요:</p>
<ul>
<li>ㅏ/ㅗ stem → <strong>았어요</strong>: 가다 → 갔어요 (gasseoyo).</li>
<li>other → <strong>었어요</strong>: 먹다 → 먹었어요 (meogeosseoyo).</li>
<li>하다 → <strong>했어요</strong>: 공부하다 → 공부했어요 (gongbuhaesseoyo).</li>
</ul>
<p>Negation: <strong>안 + verb</strong> = "does not"; <strong>못 + verb</strong> = "cannot". For N+하다 verbs, 안 goes between: 공부 안 해요.</p>
<pre><code>어제 학교에 갔어요.   eoje hakgyo-e gasseoyo.   = I went to school yesterday.
밥을 안 먹었어요.     bab-eul an meogeosseoyo. = I did not eat.
오늘은 바빠요. 하지만 괜찮아요. = I'm busy today. But it's okay.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 어제 뭐 했어요? (Eoje mwo haesseoyo?)</p>
<p><strong>B:</strong> 친구를 만났어요. 그리고 영화를 봤어요. (Chingureul mannasseoyo. Geurigo yeonghwareul bwasseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 안 = you choose not to; 못 = you are unable to. "못 갔어요" = I couldn't go (something stopped me), not "I didn't go".</div>`,
    `<span class="eyebrow">KRL112 · Bài 7</span>
<h2>Quá khứ &amp; phủ định</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>어제 / 오늘</td><td>eoje / oneul</td><td>hôm qua / hôm nay</td></tr>
<tr><td>안</td><td>an</td><td>không (phủ định thường)</td></tr>
<tr><td>못</td><td>mot</td><td>không thể (bất khả)</td></tr>
<tr><td>그리고</td><td>geurigo</td><td>và</td></tr>
<tr><td>하지만</td><td>hajiman</td><td>nhưng</td></tr>
</tbody></table>
<h3>Ngữ pháp — quá khứ -았어요/었어요</h3>
<p>Cùng quy tắc nguyên âm như hiện tại, thêm 았/었 trước -어요:</p>
<ul>
<li>Gốc ㅏ/ㅗ → <strong>았어요</strong>: 가다 → 갔어요 (gasseoyo).</li>
<li>Khác → <strong>었어요</strong>: 먹다 → 먹었어요 (meogeosseoyo).</li>
<li>하다 → <strong>했어요</strong>: 공부하다 → 공부했어요 (gongbuhaesseoyo).</li>
</ul>
<p>Phủ định: <strong>안 + động từ</strong> = "không"; <strong>못 + động từ</strong> = "không thể". Với động từ N+하다, 안 chèn vào giữa: 공부 안 해요.</p>
<pre><code>어제 학교에 갔어요.   eoje hakgyo-e gasseoyo.   = Hôm qua tôi đã đi học.
밥을 안 먹었어요.     bab-eul an meogeosseoyo. = Tôi đã không ăn.
오늘은 바빠요. 하지만 괜찮아요. = Hôm nay tôi bận. Nhưng không sao.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 어제 뭐 했어요? (Eoje mwo haesseoyo?)</p>
<p><strong>B:</strong> 친구를 만났어요. 그리고 영화를 봤어요. (Chingureul mannasseoyo. Geurigo yeonghwareul bwasseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 안 = chủ động không làm; 못 = không có khả năng. "못 갔어요" = tôi đã không thể đi (bị cản), khác với "tôi không đi".</div>`,
  ]]);
const b7q = quiz('krl112-quiz-7', 'Quiz 7 — Past & negation|||Quiz 7 — Quá khứ & phủ định', [
  { id: 'q1', question: 'The polite PAST of 먹다 (to eat) is…|||Quá khứ lịch sự của 먹다 (ăn) là…', options: ['먹아요', '먹었어요', '먹겠어요', '먹어요'], correctIndex: 1, explanation: 'Gốc 먹 không phải ㅏ/ㅗ → 었어요: 먹었어요.' },
  { id: 'q2', question: 'Which word negates as "CANNOT" (unable)?|||Từ nào phủ định "KHÔNG THỂ" (bất khả)?', options: ['안', '못', '하지만', '그리고'], correctIndex: 1, explanation: '못 = không thể/bất khả; 안 = phủ định thường.' },
  { id: 'q3', question: 'What does "하지만" mean?|||"하지만" nghĩa là gì?', options: ['and|||và', 'but|||nhưng', 'so|||vì vậy', 'or|||hoặc'], correctIndex: 1, explanation: '하지만 = nhưng; 그리고 = và.' },
]);

/* ── Bài 8 — Đi lại & mời ────────────────────────────────────────────────── */
const b8 = doc('krl112-8-1-going-inviting', 'Lesson 8 — Going & inviting|||Bài 8 — Đi lại & lời mời',
  '가다/오다, cấu trúc N에 가다, -고 싶다 (muốn), và -(으)ㄹ까요 / -(으)ㅂ시다 (mời/rủ).',
  [[
    `<span class="eyebrow">KRL112 · Lesson 8</span>
<h2>Going, coming &amp; inviting</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>가다 / 오다</td><td>gada / oda</td><td>to go / to come</td></tr>
<tr><td>식당</td><td>sikdang</td><td>restaurant</td></tr>
<tr><td>같이</td><td>gachi</td><td>together</td></tr>
<tr><td>먹다</td><td>meokda</td><td>to eat</td></tr>
<tr><td>주말</td><td>jumal</td><td>weekend</td></tr>
</tbody></table>
<h3>Grammar — destination, wanting, suggesting</h3>
<ul>
<li><strong>N에 가다/오다</strong>: go/come TO a place. 학교에 가요 (hakgyo-e gayo) = I go to school.</li>
<li><strong>-고 싶다</strong>: want to (do). 가고 싶어요 (gago sipeoyo) = I want to go.</li>
<li><strong>-(으)ㄹ까요?</strong>: shall we? 갈까요? (galkkayo). <strong>-(으)ㅂ시다</strong>: let's. 갑시다 (gapsida).</li>
</ul>
<pre><code>주말에 어디에 가고 싶어요?  jumal-e eodi-e gago sipeoyo? = Where do you want to go this weekend?
식당에 같이 갈까요?         sikdang-e gachi galkkayo?     = Shall we go to a restaurant together?
네, 좋아요. 갑시다!         ne, joayo. gapsida!            = Yes, sounds good. Let's go!</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 주말에 뭐 하고 싶어요? (Jumal-e mwo hago sipeoyo?)</p>
<p><strong>B:</strong> 영화를 보고 싶어요. 같이 볼까요? (Yeonghwareul bogo sipeoyo. Gachi bolkkayo?)</p>
</div>
<div class="callout"><span class="badge">Note</span> -(으)ㄹ까요 asks for the listener's opinion ("shall we?"); -(으)ㅂ시다 states the group decision ("let's"). Both attach to the verb stem after dropping 다.</div>`,
    `<span class="eyebrow">KRL112 · Bài 8</span>
<h2>Đi, đến &amp; lời mời</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>가다 / 오다</td><td>gada / oda</td><td>đi / đến</td></tr>
<tr><td>식당</td><td>sikdang</td><td>quán ăn / nhà hàng</td></tr>
<tr><td>같이</td><td>gachi</td><td>cùng nhau</td></tr>
<tr><td>먹다</td><td>meokda</td><td>ăn</td></tr>
<tr><td>주말</td><td>jumal</td><td>cuối tuần</td></tr>
</tbody></table>
<h3>Ngữ pháp — điểm đến, mong muốn, rủ rê</h3>
<ul>
<li><strong>N에 가다/오다</strong>: đi/đến MỘT nơi. 학교에 가요 (hakgyo-e gayo) = tôi đi học.</li>
<li><strong>-고 싶다</strong>: muốn (làm). 가고 싶어요 (gago sipeoyo) = tôi muốn đi.</li>
<li><strong>-(으)ㄹ까요?</strong>: mình... nhé? 갈까요? (galkkayo). <strong>-(으)ㅂ시다</strong>: nào cùng. 갑시다 (gapsida).</li>
</ul>
<pre><code>주말에 어디에 가고 싶어요?  jumal-e eodi-e gago sipeoyo? = Cuối tuần bạn muốn đi đâu?
식당에 같이 갈까요?         sikdang-e gachi galkkayo?     = Mình đi quán ăn cùng nhau nhé?
네, 좋아요. 갑시다!         ne, joayo. gapsida!            = Vâng, hay đó. Đi thôi!</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 주말에 뭐 하고 싶어요? (Jumal-e mwo hago sipeoyo?)</p>
<p><strong>B:</strong> 영화를 보고 싶어요. 같이 볼까요? (Yeonghwareul bogo sipeoyo. Gachi bolkkayo?)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> -(으)ㄹ까요 hỏi ý người nghe ("mình... nhé?"); -(으)ㅂ시다 nêu quyết định chung ("nào cùng"). Cả hai gắn vào gốc động từ sau khi bỏ 다.</div>`,
  ]]);
const b8q = quiz('krl112-quiz-8', 'Quiz 8 — Going & inviting|||Quiz 8 — Đi lại & lời mời', [
  { id: 'q1', question: 'Which pattern means "want to (do)"?|||Cấu trúc "muốn (làm gì)" là?', options: ['-고 싶다', '-을까요', '-ㅂ시다', '-지만'], correctIndex: 0, explanation: '동사 + 고 싶다 = muốn làm: 가고 싶어요 (muốn đi).' },
  { id: 'q2', question: 'In "학교에 가요", the particle 에 marks…|||Trong "학교에 가요", trợ từ 에 chỉ gì?', options: ['the object|||tân ngữ', 'the destination (go TO school)|||điểm đến (đi ĐẾN trường)', 'the topic|||chủ đề', 'past time|||thời gian quá khứ'], correctIndex: 1, explanation: 'N에 가다 = đi ĐẾN nơi N; 에 đánh dấu điểm đến.' },
  { id: 'q3', question: 'To suggest "shall we go together?", which ending?|||Rủ "mình cùng đi... nhé?" dùng đuôi nào?', options: ['-았어요', '-(으)ㄹ까요?', '-입니다', '-이에요'], correctIndex: 1, explanation: '-(으)ㄹ까요? hỏi ý rủ rê (갈까요?); -(으)ㅂ시다 là "nào cùng".' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'KRL112',
    slug: 'krl112-elementary-korean-1',
    title: 'Elementary Korean 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KRL112.webp',
    shortDescription: 'Elementary Korean 1: the Hangul alphabet, greetings, this/that, numbers & time, place & existence, present-tense verbs (아요/어요), past & negation, going & inviting. Bilingual Korean-Vietnamese: vocabulary, grammar, dialogues & quizzes. TOPIK I level.|||Tiếng Hàn sơ cấp 1: bảng chữ Hangul, chào hỏi, đại từ chỉ định, số & thời gian, địa điểm & tồn tại, động từ hiện tại (아요/어요), quá khứ & phủ định, đi lại & lời mời. Song ngữ Hàn-Việt: từ vựng, ngữ pháp, hội thoại & quiz. Trình độ TOPIK I.',
    description: 'Môn <strong>KRL112 — Elementary Korean 1</strong> (Tiếng Hàn sơ cấp 1, Kỳ 1, ngành Ngôn ngữ Hàn) đưa bạn từ số 0 đến những câu tiếng Hàn đầu tiên. Từ <strong>bảng chữ Hangul</strong> (nguyên âm, phụ âm, ghép âm tiết, batchim) → <strong>chào hỏi &amp; giới thiệu</strong> → <strong>đại từ chỉ định</strong> (이것/그것/저것, trợ từ 이/가, 은/는) → <strong>số &amp; thời gian</strong> → <strong>địa điểm &amp; tồn tại</strong> (있어요/없어요, 에/에서) → <strong>động từ hiện tại</strong> (아요/어요/해요) → <strong>quá khứ &amp; phủ định</strong> → <strong>đi lại &amp; lời mời</strong> (-고 싶다, -을까요/-읍시다). Bám giáo trình Sejong Korean 1 / Ewha, song ngữ Hàn-Việt, có bảng từ vựng, ngữ pháp, hội thoại và quiz mỗi bài. Trình độ TOPIK I.',
    whatYouLearn: 'Đọc &amp; viết Hangul (nguyên âm, phụ âm, batchim); chào hỏi &amp; tự giới thiệu (입니다, 이에요/예요); đại từ chỉ định 이것/그것/저것 và trợ từ 이/가, 은/는, 을/를; hai hệ số (thuần Hàn / Hán-Hàn), giờ 시 &amp; phút 분, ngày tháng; địa điểm 여기/거기/저기, tồn tại 있어요/없어요, trợ từ 에/에서; chia động từ hiện tại 아요/어요/해요; quá khứ 았어요/었어요, phủ định 안/못; cấu trúc mong muốn -고 싶다 và rủ rê -을까요/-읍시다.',
    requirements: 'Không cần biết trước tiếng Hàn. Chỉ cần chăm luyện đọc Hangul mỗi ngày và luyện nói hội thoại thành tiếng.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Sejong/Ewha, từ điển Naver, app, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mục tiêu TOPIK I, Hangul, cách học tiếng Hàn.', lessons: [intro] },
    { title: 'Bài 1 — Bảng chữ Hangul|||Lesson 1 — The Hangul alphabet', description: 'Nguyên âm, phụ âm, ghép âm tiết, batchim.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Chào hỏi|||Lesson 2 — Greetings', description: '안녕하세요, 감사합니다, 저는 〜입니다.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Đây là gì|||Lesson 3 — What is this?', description: '이것/그것/저것, 이/가, 은/는, 이에요/예요.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Số & thời gian|||Lesson 4 — Numbers & time', description: 'Số thuần Hàn/Hán-Hàn, 시/분, ngày tháng.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Địa điểm & tồn tại|||Lesson 5 — Place & existence', description: '여기/거기/저기, 있어요/없어요, 에/에서.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Động từ hiện tại|||Lesson 6 — Present verbs', description: '아요/어요/해요, 을/를, hoạt động hằng ngày.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Quá khứ & phủ định|||Lesson 7 — Past & negation', description: '았어요/었어요, 안/못, 그리고/하지만.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Đi lại & mời|||Lesson 8 — Going & inviting', description: '가다/오다, 에 가다, -고 싶다, -을까요/-읍시다.', lessons: [b8, b8q] },
  ],
};
