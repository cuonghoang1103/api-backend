/**
 * KRL222 — Elementary Korean 4 (Tiếng Hàn sơ cấp 4). Khối Ngôn ngữ Hàn FPTU, Kỳ 3.
 * NỐI TIẾP KRL212 — Elementary Korean 3. Giáo trình chuẩn: 세종한국어 Sejong Korean 3
 * (→ Ewha); trình độ TOPIK I cuối → TOPIK II đầu.
 * MÔN NGÔN NGỮ — mỗi bài: từ vựng, ngữ pháp + mẫu câu (chú ý chia đuôi/bất quy tắc),
 * hội thoại, ghi chú. Hangul + Revised Romanization + nghĩa tiếng Việt.
 * bi(e,v): e = trình bày Hàn+Anh, v = giải thích tiếng Việt.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 300, questions } });

/* ── Tài liệu ────────────────────────────────────────────────────────────── */
const taiLieu = doc('krl222-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình Sejong Korean 3 / Ewha, app TOPIK ONE / Anki, Naver dictionary, YouTube, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">KRL222 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need for <strong>Elementary Korean 4</strong> — building on the connectors, indirect speech, honorifics and irregular verbs from <strong>KRL212</strong> toward purpose, choice, concession, conjecture, reported speech, states, exclamation and advanced honorifics — in one place. The official FPTU giáo trình &amp; slides live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbooks</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 3</em> — King Sejong Institute (free PDF &amp; audio)</a></li>
<li><em>Ewha Korean 2-3</em> — Ewha Womans University Press</li>
</ul>
<h3>🌐 Dictionaries &amp; apps</h3>
<ul>
<li><a href="https://korean.dict.naver.com/" target="_blank" rel="noopener">Naver Korean Dictionary (한국어사전)</a></li>
<li>TOPIK ONE (mobile) — TOPIK I-II vocabulary &amp; grammar drills</li>
<li>Anki — spaced-repetition flashcards for vocab &amp; verb endings</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — intermediate grammar &amp; listening</li>
<li><a href="https://www.youtube.com/@GoBillyKorean" target="_blank" rel="noopener">Go! Billy Korean</a> — grammar &amp; pronunciation</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Review KRL212</strong> — connectors (는데, 다가), indirect speech (다고 하다), irregular verbs (ㄷ/ㅂ/ㅅ/르), the retrospective 더.</li>
<li><strong>Say why</strong> — purpose 기 위해서, 으려면, 을 겸; choose with 거나, 든지, 는 게 좋겠다.</li>
<li><strong>Suppose &amp; concede</strong> — concession 아/어도, 더라도; conjecture 나 보다, 는 것 같다, 을 텐데, 겠.</li>
<li><strong>Speak naturally</strong> — reported speech 다면서요, states 아/어 있다·는 중이다, exclamation 네요·잖아요·거든요, honorifics 드리다·께서; aim at early TOPIK II.</li>
</ol></div>`,
    `<span class="eyebrow">KRL222 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho <strong>Tiếng Hàn sơ cấp 4</strong> — dựng tiếp trên các liên từ, câu tường thuật, kính ngữ và động từ bất quy tắc của <strong>KRL212</strong> để tiến tới mục đích, lựa chọn, nhượng bộ, phỏng đoán, tường thuật, trạng thái, cảm thán và kính ngữ nâng cao — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 3</em> — Viện King Sejong (PDF &amp; audio miễn phí)</a></li>
<li><em>Ewha Korean 2-3</em> — NXB Đại học Ewha</li>
</ul>
<h3>🌐 Từ điển &amp; ứng dụng</h3>
<ul>
<li><a href="https://korean.dict.naver.com/" target="_blank" rel="noopener">Từ điển Naver (한국어사전)</a></li>
<li>TOPIK ONE (điện thoại) — luyện từ vựng &amp; ngữ pháp TOPIK I-II</li>
<li>Anki — thẻ ghi nhớ lặp lại ngắt quãng cho từ vựng &amp; đuôi động từ</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — ngữ pháp &amp; nghe trung cấp</li>
<li><a href="https://www.youtube.com/@GoBillyKorean" target="_blank" rel="noopener">Go! Billy Korean</a> — ngữ pháp &amp; phát âm</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Ôn lại KRL212</strong> — liên từ (는데, 다가), tường thuật gián tiếp (다고 하다), động từ bất quy tắc (ㄷ/ㅂ/ㅅ/르), hồi tưởng 더.</li>
<li><strong>Nói lý do</strong> — mục đích 기 위해서, 으려면, 을 겸; lựa chọn với 거나, 든지, 는 게 좋겠다.</li>
<li><strong>Giả định &amp; nhượng bộ</strong> — nhượng bộ 아/어도, 더라도; phỏng đoán 나 보다, 는 것 같다, 을 텐데, 겠.</li>
<li><strong>Nói tự nhiên</strong> — tường thuật 다면서요, trạng thái 아/어 있다·는 중이다, cảm thán 네요·잖아요·거든요, kính ngữ 드리다·께서; hướng tới TOPIK II đầu.</li>
</ol></div>`,
  ]]);

/* ── Giới thiệu môn ──────────────────────────────────────────────────────── */
const intro = doc('krl222-0-1-overview', 'Course overview: from KRL212 onward|||Tổng quan: nối tiếp từ KRL212',
  'Mục tiêu môn (bước sang TOPIK II), nhắc lại nền tảng KRL212, và bản đồ ngữ pháp 8 bài.',
  [[
    `<span class="eyebrow">KRL222 · Lesson 0.1 · Overview</span>
<h2>Elementary Korean 4</h2>
<p class="lead">This course continues <strong>Elementary Korean 3 (KRL212)</strong>. You already link clauses (는데, 다가), report what others say (다고 하다), handle the ㄷ/ㅂ/ㅅ/르 irregular verbs and the retrospective 더. Now you will <strong>state purpose and intent, offer choices, concede a point, make educated guesses, relay and confirm hearsay, describe resulting states and habits, add exclamation and emphasis, and use advanced honorifics</strong> — the bridge from <strong>TOPIK I</strong> into <strong>early TOPIK II</strong>.</p>
<h3>What KRL212 gave you</h3>
<p>KRL212 built the intermediate base: connectors 는데·다가·(으)면서, indirect quotation 다고/라고 하다, the four irregular verb groups, the noun-modifying 던 and retrospective 더라고요. This course assumes all of that.</p>
<h3>Roadmap of the 8 lessons</h3>
<p>Purpose &amp; intent (기 위해서, 으려면, 을 겸) → comparison &amp; choice (보다, 는 게 좋겠다, 거나, 든지) → concession &amp; condition (아/어도, 더라도, 는다면) → conjecture (나 보다, 는 것 같다, 을 텐데, 겠) → advanced reported speech (다고요, 라고 하다, 다면서요) → states &amp; continuation (아/어 있다, 는 중이다, 곤 하다) → exclamation &amp; emphasis (군요/네요, 잖아요, 거든요) → advanced honorifics (으시, 드리다, 께서, 님). Bilingual Korean-Vietnamese, with vocabulary tables, grammar notes, short dialogues and a quiz each lesson.</p>
<div class="callout"><span class="badge">Politeness level</span> This course keeps the <strong>해요체</strong> (polite -요 style) and deepens the honorific system with the humble verb <strong>드리다</strong>, the honorific subject particle <strong>께서</strong> and the honorific dative <strong>께</strong>, so you can speak respectfully in real situations.</div>`,
    `<span class="eyebrow">KRL222 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Hàn sơ cấp 4</h2>
<p class="lead">Môn này nối tiếp <strong>Tiếng Hàn sơ cấp 3 (KRL212)</strong>. Bạn đã nối được mệnh đề (는데, 다가), thuật lại lời người khác (다고 하다), xử lý được các động từ bất quy tắc ㄷ/ㅂ/ㅅ/르 và đuôi hồi tưởng 더. Giờ bạn sẽ <strong>nêu mục đích và dự định, đưa ra lựa chọn, nhượng bộ một điểm, phỏng đoán có cơ sở, thuật lại và xác nhận tin nghe được, tả trạng thái và thói quen, thêm cảm thán và nhấn mạnh, và dùng kính ngữ nâng cao</strong> — chiếc cầu từ <strong>TOPIK I</strong> sang <strong>TOPIK II đầu</strong>.</p>
<h3>KRL212 đã cho bạn gì</h3>
<p>KRL212 dựng nền trung cấp: liên từ 는데·다가·(으)면서, tường thuật gián tiếp 다고/라고 하다, bốn nhóm động từ bất quy tắc, đuôi định ngữ 던 và hồi tưởng 더라고요. Môn này giả định bạn đã nắm hết.</p>
<h3>Bản đồ 8 bài</h3>
<p>Mục đích &amp; dự định (기 위해서, 으려면, 을 겸) → so sánh &amp; lựa chọn (보다, 는 게 좋겠다, 거나, 든지) → nhượng bộ &amp; điều kiện (아/어도, 더라도, 는다면) → phỏng đoán (나 보다, 는 것 같다, 을 텐데, 겠) → tường thuật gián tiếp nâng cao (다고요, 라고 하다, 다면서요) → trạng thái &amp; tiếp diễn (아/어 있다, 는 중이다, 곤 하다) → cảm thán &amp; nhấn mạnh (군요/네요, 잖아요, 거든요) → kính ngữ nâng cao (으시, 드리다, 께서, 님). Song ngữ Hàn-Việt, có bảng từ vựng, ghi chú ngữ pháp, hội thoại ngắn và quiz mỗi bài.</p>
<div class="callout"><span class="badge">Bậc lịch sự</span> Môn này giữ <strong>해요체</strong> (thể lịch sự đuôi -요) và đào sâu hệ kính ngữ với động từ khiêm nhường <strong>드리다</strong>, trợ từ chủ ngữ kính ngữ <strong>께서</strong> và trợ từ tặng cách kính ngữ <strong>께</strong>, để bạn nói tôn trọng trong tình huống thật.</div>`,
  ]]);

/* ── Bài 1 — Mục đích & dự định nâng cao ────────────────────────────────── */
const b1 = doc('krl222-1-1-purpose-intent', 'Lesson 1 — Purpose & intent|||Bài 1 — Mục đích & dự định nâng cao',
  'V + 기 위해서 (để), V + 으려면 (nếu định/muốn), V + 을 겸 (tiện thể, làm một công đôi việc).',
  [[
    `<span class="eyebrow">KRL222 · Lesson 1</span>
<h2>Purpose &amp; intent (기 위해서, 으려면, 을 겸)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>합격하다</td><td>hapgyeokhada</td><td>to pass (an exam)</td></tr>
<tr><td>유학하다</td><td>yuhakhada</td><td>to study abroad</td></tr>
<tr><td>연습하다</td><td>yeonseuphada</td><td>to practice</td></tr>
<tr><td>목적</td><td>mokjeok</td><td>purpose, goal</td></tr>
<tr><td>건강</td><td>geongang</td><td>health</td></tr>
<tr><td>겸</td><td>gyeom</td><td>also, doubling as</td></tr>
</tbody></table>
<h3>Grammar — in order to, if you intend to, while also</h3>
<ul>
<li><strong>V + 기 위해(서)</strong> = in order to (deliberate purpose); with a noun use <strong>N을/를 위해(서)</strong>: 합격하기 위해서, 가족을 위해서.</li>
<li><strong>V + -(으)려면</strong> = if you intend/want to (condition for a goal): after a vowel 하려면, after a consonant 먹으려면.</li>
<li><strong>V + -(으)ㄹ 겸 (해서)</strong> = doing one thing while also doing another: 운동도 할 겸, 친구도 만날 겸.</li>
</ul>
<pre><code>시험에 합격하기 위해서 열심히 공부해요. siheom-e hapgyeokhagi wihaeseo yeolsimhi gongbuhaeyo. = I study hard in order to pass the exam.
한국에서 유학하려면 한국어를 배워야 해요. hangug-eseo yuhakharyeomyeon hangugeoreul baewoya haeyo. = If you intend to study in Korea, you must learn Korean.
바람도 쐴 겸 산책을 해요. baram-do soel gyeom sanchaeg-eul haeyo. = I take a walk, and also to get some fresh air.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 왜 그렇게 열심히 공부해요? (Wae geureoke yeolsimhi gongbuhaeyo?)</p>
<p><strong>B:</strong> 장학금을 받기 위해서요. 유학하려면 돈이 많이 필요하거든요. (Janghakgeum-eul batgi wihaeseoyo. Yuhakharyeomyeon don-i mani piryohageodeunyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 기 위해서 takes a VERB stem + 기; for a noun switch to 을/를 위해서. 으려면 is "if you intend to", so its second clause is usually advice or a requirement (아야 하다). 을 겸 pairs two purposes for one action.</div>`,
    `<span class="eyebrow">KRL222 · Bài 1</span>
<h2>Mục đích &amp; dự định (기 위해서, 으려면, 을 겸)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>합격하다</td><td>hapgyeokhada</td><td>đỗ, đậu (kỳ thi)</td></tr>
<tr><td>유학하다</td><td>yuhakhada</td><td>du học</td></tr>
<tr><td>연습하다</td><td>yeonseuphada</td><td>luyện tập</td></tr>
<tr><td>목적</td><td>mokjeok</td><td>mục đích</td></tr>
<tr><td>건강</td><td>geongang</td><td>sức khoẻ</td></tr>
<tr><td>겸</td><td>gyeom</td><td>kiêm, tiện thể</td></tr>
</tbody></table>
<h3>Ngữ pháp — để, nếu định/muốn, tiện thể</h3>
<ul>
<li><strong>V + 기 위해(서)</strong> = để (mục đích có chủ ý); với danh từ dùng <strong>N을/를 위해(서)</strong>: 합격하기 위해서, 가족을 위해서.</li>
<li><strong>V + -(으)려면</strong> = nếu định/muốn (điều kiện để đạt mục tiêu): sau nguyên âm 하려면, sau phụ âm 먹으려면.</li>
<li><strong>V + -(으)ㄹ 겸 (해서)</strong> = làm một việc tiện thể làm luôn việc khác: 운동도 할 겸, 친구도 만날 겸.</li>
</ul>
<pre><code>시험에 합격하기 위해서 열심히 공부해요. siheom-e hapgyeokhagi wihaeseo yeolsimhi gongbuhaeyo. = Để đỗ kỳ thi, tôi học chăm chỉ.
한국에서 유학하려면 한국어를 배워야 해요. hangug-eseo yuhakharyeomyeon hangugeoreul baewoya haeyo. = Nếu muốn du học ở Hàn thì phải học tiếng Hàn.
바람도 쐴 겸 산책을 해요. baram-do soel gyeom sanchaeg-eul haeyo. = Tôi đi dạo, tiện thể hóng gió luôn.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 왜 그렇게 열심히 공부해요? (Wae geureoke yeolsimhi gongbuhaeyo?)</p>
<p><strong>B:</strong> 장학금을 받기 위해서요. 유학하려면 돈이 많이 필요하거든요. (Janghakgeum-eul batgi wihaeseoyo. Yuhakharyeomyeon don-i mani piryohageodeunyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 기 위해서 đi với GỐC ĐỘNG TỪ + 기; với danh từ đổi sang 을/를 위해서. 으려면 nghĩa "nếu định", nên mệnh đề sau thường là lời khuyên hoặc điều kiện bắt buộc (아야 하다). 을 겸 ghép hai mục đích cho một hành động.</div>`,
  ]]);
const b1q = quiz('krl222-quiz-1', 'Quiz 1 — Purpose & intent|||Quiz 1 — Mục đích & dự định', [
  { id: 'q1', question: 'Which pattern means "in order to (do)"?|||Cấu trúc nào nghĩa "để (làm gì)"?', options: ['-기 위해서', '-을 겸', '-으려면', '-거든요'], correctIndex: 0, explanation: 'V + 기 위해서 = để (mục đích): 합격하기 위해서 = để đỗ.' },
  { id: 'q2', question: '유학하다 + -(으)려면 becomes…|||유학하다 + -(으)려면 thành…', options: ['유학하으려면', '유학하려면', '유학으려면', '유학하려서'], correctIndex: 1, explanation: '하다 kết thúc bằng nguyên âm → 려면: 유학하려면 = nếu muốn du học.' },
  { id: 'q3', question: '"친구도 만날 겸 서울에 가요" means…|||"친구도 만날 겸 서울에 가요" nghĩa là gì?', options: ['I go to Seoul because of a friend|||Tôi đi Seoul vì bạn', 'I go to Seoul, and also to meet a friend|||Tôi đi Seoul, tiện thể gặp bạn luôn', 'I want to meet a friend in Seoul|||Tôi muốn gặp bạn ở Seoul', 'If I meet a friend I go to Seoul|||Nếu gặp bạn tôi đi Seoul'], correctIndex: 1, explanation: '-(으)ㄹ 겸 = tiện thể; ghép hai mục đích cho một hành động.' },
]);

/* ── Bài 2 — So sánh & lựa chọn ─────────────────────────────────────────── */
const b2 = doc('krl222-2-1-compare-choose', 'Lesson 2 — Comparison & choice|||Bài 2 — So sánh & lựa chọn',
  'N보다 (hơn), V + 는 게 좋겠다 (nên/thà), V + 거나 (hoặc), 든지 (bất kỳ... cũng).',
  [[
    `<span class="eyebrow">KRL222 · Lesson 2</span>
<h2>Comparison &amp; choice (보다, 는 게 좋겠다, 거나, 든지)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>고르다</td><td>goreuda</td><td>to choose (르 irregular)</td></tr>
<tr><td>선택하다</td><td>seontaekhada</td><td>to select</td></tr>
<tr><td>결정하다</td><td>gyeoljeonghada</td><td>to decide</td></tr>
<tr><td>차라리</td><td>charari</td><td>rather, sooner</td></tr>
<tr><td>아무거나</td><td>amugeona</td><td>anything (at all)</td></tr>
<tr><td>메뉴</td><td>menyu</td><td>menu</td></tr>
</tbody></table>
<h3>Grammar — more than, had better, or, any</h3>
<ul>
<li><strong>N보다 (더)</strong> = more than (review): 이것보다 저것이 더 좋아요.</li>
<li><strong>V + 는 게 좋겠다</strong> = had better / it would be better to: 지금 가는 게 좋겠어요.</li>
<li><strong>V + 거나</strong> = or (verbs); <strong>N(이)나</strong> = or (nouns): 읽거나 보거나, 커피나 차.</li>
<li><strong>V/N + 든지 (든가)</strong> = whether... or / any-: 뭐든지, 언제든지, 가든지 말든지.</li>
</ul>
<pre><code>이 옷보다 저 옷이 더 예뻐요. i otboda jeo os-i deo yeppeoyo. = That outfit is prettier than this one.
비가 오니까 집에 있는 게 좋겠어요. biga onikka jib-e inneun ge joketsseoyo. = Since it is raining, we had better stay home.
주말에 영화를 보거나 책을 읽어요. jumar-e yeonghwareul bogeona chaeg-eul ilgeoyo. = On weekends I watch a movie or read a book.
저는 뭐든지 다 잘 먹어요. jeoneun mwodeunji da jal meogeoyo. = I eat anything (at all) well.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 커피하고 차 중에서 뭘 마실래요? (Keopihago cha jung-eseo mwol masillaeyo?)</p>
<p><strong>B:</strong> 아무거나 괜찮아요. 차라리 시원한 걸로 고르는 게 좋겠어요. (Amugeona gwaenchanayo. Charari siwonhan geollo goreuneun ge joketsseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 좋겠어요 uses the 겠 of supposition — it softens "should/had better" into advice. 고르다 is 르-irregular: 고르 + 아요 → 골라요. Use 거나 to join verbs and 이나 to join nouns; 든지 stresses "it does not matter which".</div>`,
    `<span class="eyebrow">KRL222 · Bài 2</span>
<h2>So sánh &amp; lựa chọn (보다, 는 게 좋겠다, 거나, 든지)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>고르다</td><td>goreuda</td><td>chọn (bất quy tắc 르)</td></tr>
<tr><td>선택하다</td><td>seontaekhada</td><td>lựa chọn</td></tr>
<tr><td>결정하다</td><td>gyeoljeonghada</td><td>quyết định</td></tr>
<tr><td>차라리</td><td>charari</td><td>thà rằng, thà là</td></tr>
<tr><td>아무거나</td><td>amugeona</td><td>cái gì cũng được</td></tr>
<tr><td>메뉴</td><td>menyu</td><td>thực đơn</td></tr>
</tbody></table>
<h3>Ngữ pháp — hơn, nên/thà, hoặc, bất kỳ</h3>
<ul>
<li><strong>N보다 (더)</strong> = hơn (ôn tập): 이것보다 저것이 더 좋아요.</li>
<li><strong>V + 는 게 좋겠다</strong> = nên / thì hơn / tốt hơn là: 지금 가는 게 좋겠어요.</li>
<li><strong>V + 거나</strong> = hoặc (động từ); <strong>N(이)나</strong> = hoặc (danh từ): 읽거나 보거나, 커피나 차.</li>
<li><strong>V/N + 든지 (든가)</strong> = ... nào cũng / bất kỳ: 뭐든지, 언제든지, 가든지 말든지.</li>
</ul>
<pre><code>이 옷보다 저 옷이 더 예뻐요. i otboda jeo os-i deo yeppeoyo. = Bộ đồ kia đẹp hơn bộ này.
비가 오니까 집에 있는 게 좋겠어요. biga onikka jib-e inneun ge joketsseoyo. = Trời mưa nên ở nhà thì hơn.
주말에 영화를 보거나 책을 읽어요. jumar-e yeonghwareul bogeona chaeg-eul ilgeoyo. = Cuối tuần tôi xem phim hoặc đọc sách.
저는 뭐든지 다 잘 먹어요. jeoneun mwodeunji da jal meogeoyo. = Tôi món gì cũng ăn được hết.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 커피하고 차 중에서 뭘 마실래요? (Keopihago cha jung-eseo mwol masillaeyo?)</p>
<p><strong>B:</strong> 아무거나 괜찮아요. 차라리 시원한 걸로 고르는 게 좋겠어요. (Amugeona gwaenchanayo. Charari siwonhan geollo goreuneun ge joketsseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 좋겠어요 dùng 겠 phỏng đoán — biến "nên/thì hơn" thành lời khuyên. 고르다 là bất quy tắc 르: 고르 + 아요 → 골라요. Dùng 거나 để nối động từ, 이나 để nối danh từ; 든지 nhấn "cái nào cũng được".</div>`,
  ]]);
const b2q = quiz('krl222-quiz-2', 'Quiz 2 — Comparison & choice|||Quiz 2 — So sánh & lựa chọn', [
  { id: 'q1', question: 'Which ending joins two VERBS with "or"?|||Đuôi nào nối hai ĐỘNG TỪ bằng "hoặc"?', options: ['-보다', '-거나', '-든지', '-는 게 좋겠다'], correctIndex: 1, explanation: 'V + 거나 = hoặc (nối động từ): 보거나 읽거나. Danh từ dùng 이나.' },
  { id: 'q2', question: '"집에 있는 게 좋겠어요" means…|||"집에 있는 게 좋겠어요" nghĩa là gì?', options: ['I must stay home|||Tôi bắt buộc ở nhà', 'we had better stay home|||ở nhà thì hơn', 'I want to stay home|||Tôi muốn ở nhà', 'I stayed home|||Tôi đã ở nhà'], correctIndex: 1, explanation: '는 게 좋겠다 = nên / thì hơn (lời khuyên): ở nhà thì hơn.' },
  { id: 'q3', question: '"뭐든지 다 좋아요" means…|||"뭐든지 다 좋아요" nghĩa là gì?', options: ['nothing is good|||không gì tốt cả', 'anything is fine|||cái gì cũng được', 'what is good?|||cái gì tốt?', 'this one is good|||cái này tốt'], correctIndex: 1, explanation: '든지 = ...nào cũng; 뭐든지 = cái gì cũng, bất kể là gì.' },
]);

/* ── Bài 3 — Nhượng bộ & điều kiện ──────────────────────────────────────── */
const b3 = doc('krl222-3-1-concession-condition', 'Lesson 3 — Concession & condition|||Bài 3 — Nhượng bộ & điều kiện',
  'V/A + 아/어도 (dù), V/A + 더라도 (dù cho, giả sử), V + 는다면·A + 다면 (nếu giả sử).',
  [[
    `<span class="eyebrow">KRL222 · Lesson 3</span>
<h2>Concession &amp; condition (아/어도, 더라도, 는다면)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>포기하다</td><td>pogihada</td><td>to give up</td></tr>
<tr><td>노력하다</td><td>noryeokhada</td><td>to make an effort</td></tr>
<tr><td>아무리</td><td>amuri</td><td>no matter how</td></tr>
<tr><td>힘들다</td><td>himdeulda</td><td>to be hard, tough</td></tr>
<tr><td>부자</td><td>buja</td><td>rich person</td></tr>
<tr><td>끝까지</td><td>kkeutkkaji</td><td>to the end</td></tr>
</tbody></table>
<h3>Grammar — even if (real), even if (stronger), if (hypothetical)</h3>
<ul>
<li><strong>V/A + 아/어도</strong> = even if / even though (real or likely): 비가 와도, 바빠도, 힘들어도. Often paired with 아무리.</li>
<li><strong>V/A + 더라도</strong> = even if / even supposing (stronger, more hypothetical than 아/어도): 힘들더라도, 실패하더라도.</li>
<li><strong>V + -ㄴ/는다면, A + 다면, N(이)라면</strong> = if (hypothetical supposition): 간다면, 있다면, 부자라면.</li>
</ul>
<pre><code>아무리 바빠도 아침은 꼭 먹어요. amuri bappado achim-eun kkok meogeoyo. = No matter how busy I am, I always eat breakfast.
힘들더라도 끝까지 노력하세요. himdeuldeorado kkeutkkaji noryeokhaseyo. = Even if it is hard, please make an effort to the end.
시간이 있다면 여행을 가고 싶어요. sigan-i itdamyeon yeohaeng-eul gago sipeoyo. = If I had time, I would like to travel.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 시험이 너무 어려워요. 포기하고 싶어요. (Siheom-i neomu eoryeowoyo. Pogihago sipeoyo.)</p>
<p><strong>B:</strong> 아무리 어려워도 포기하지 마세요. 지금 그만두면 나중에 후회할 거예요. (Amuri eoryeowodo pogihaji maseyo. Jigeum geumandumyeon najunge huhoehal geoyeyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 아/어도 concedes something real or likely; 더라도 supposes an extreme or unreal case, so it feels stronger. 는다면 is a hypothetical "if" — compare the everyday 으면 from KRL122, which covers real, repeatable conditions.</div>`,
    `<span class="eyebrow">KRL222 · Bài 3</span>
<h2>Nhượng bộ &amp; điều kiện (아/어도, 더라도, 는다면)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>포기하다</td><td>pogihada</td><td>từ bỏ</td></tr>
<tr><td>노력하다</td><td>noryeokhada</td><td>nỗ lực</td></tr>
<tr><td>아무리</td><td>amuri</td><td>dù... thế nào đi nữa</td></tr>
<tr><td>힘들다</td><td>himdeulda</td><td>vất vả, khó khăn</td></tr>
<tr><td>부자</td><td>buja</td><td>người giàu</td></tr>
<tr><td>끝까지</td><td>kkeutkkaji</td><td>đến cùng</td></tr>
</tbody></table>
<h3>Ngữ pháp — dù (thực), dù cho (mạnh hơn), nếu (giả sử)</h3>
<ul>
<li><strong>V/A + 아/어도</strong> = dù / mặc dù (thực tế hoặc dễ xảy ra): 비가 와도, 바빠도, 힘들어도. Hay đi với 아무리.</li>
<li><strong>V/A + 더라도</strong> = dù cho / dù có... đi nữa (mạnh, giả định hơn 아/어도): 힘들더라도, 실패하더라도.</li>
<li><strong>V + -ㄴ/는다면, A + 다면, N(이)라면</strong> = nếu (giả định): 간다면, 있다면, 부자라면.</li>
</ul>
<pre><code>아무리 바빠도 아침은 꼭 먹어요. amuri bappado achim-eun kkok meogeoyo. = Dù bận đến đâu tôi cũng luôn ăn sáng.
힘들더라도 끝까지 노력하세요. himdeuldeorado kkeutkkaji noryeokhaseyo. = Dù vất vả đến đâu cũng hãy nỗ lực đến cùng.
시간이 있다면 여행을 가고 싶어요. sigan-i itdamyeon yeohaeng-eul gago sipeoyo. = Nếu có thời gian, tôi muốn đi du lịch.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 시험이 너무 어려워요. 포기하고 싶어요. (Siheom-i neomu eoryeowoyo. Pogihago sipeoyo.)</p>
<p><strong>B:</strong> 아무리 어려워도 포기하지 마세요. 지금 그만두면 나중에 후회할 거예요. (Amuri eoryeowodo pogihaji maseyo. Jigeum geumandumyeon najunge huhoehal geoyeyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 아/어도 nhượng bộ điều có thật hoặc dễ xảy ra; 더라도 giả định trường hợp cực đoan hoặc không có thật nên nghe mạnh hơn. 는다면 là "nếu" giả định — so với 으면 (KRL122) dùng cho điều kiện thật, lặp lại được.</div>`,
  ]]);
const b3q = quiz('krl222-quiz-3', 'Quiz 3 — Concession & condition|||Quiz 3 — Nhượng bộ & điều kiện', [
  { id: 'q1', question: '어렵다 + 아/어도 (even if hard) becomes…|||어렵다 + 아/어도 (dù khó) thành…', options: ['어렵아도', '어려워도', '어렵어도', '어려도'], correctIndex: 1, explanation: '어렵다 là bất quy tắc ㅂ: 어렵 → 어려우 + 어도 → 어려워도.' },
  { id: 'q2', question: 'Which is the STRONGER, more hypothetical "even if"?|||Đâu là "dù" MẠNH hơn, mang tính giả định hơn?', options: ['-아/어도', '-더라도', '-는데', '-으니까'], correctIndex: 1, explanation: '-더라도 giả định trường hợp cực đoan, mạnh hơn -아/어도 (thực tế/dễ xảy ra).' },
  { id: 'q3', question: '"시간이 있다면" means…|||"시간이 있다면" nghĩa là gì?', options: ['because there is time|||vì có thời gian', 'if I had time (hypothetical)|||nếu có thời gian (giả định)', 'when there is time|||khi có thời gian', 'even though there is time|||dù có thời gian'], correctIndex: 1, explanation: '-는다면/-다면 = nếu (giả định); 있다면 = nếu có.' },
]);

/* ── Bài 4 — Phỏng đoán ─────────────────────────────────────────────────── */
const b4 = doc('krl222-4-1-conjecture', 'Lesson 4 — Conjecture|||Bài 4 — Phỏng đoán',
  'V + 나 보다·A + (으)ㄴ가 보다 (hình như), 는 것 같다 (có vẻ), 을 텐데 (chắc là mà), 겠 (chắc/hẳn).',
  [[
    `<span class="eyebrow">KRL222 · Lesson 4</span>
<h2>Conjecture (나 보다, 는 것 같다, 을 텐데, 겠)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>막히다</td><td>makhida</td><td>to be blocked, jammed</td></tr>
<tr><td>피곤하다</td><td>pigonhada</td><td>to be tired</td></tr>
<tr><td>도착하다</td><td>dochakhada</td><td>to arrive</td></tr>
<tr><td>연락</td><td>yeollak</td><td>contact, a call/message</td></tr>
<tr><td>아마</td><td>ama</td><td>probably, maybe</td></tr>
<tr><td>표정</td><td>pyojeong</td><td>facial expression</td></tr>
</tbody></table>
<h3>Grammar — it seems, I think, must be, would be</h3>
<ul>
<li><strong>V + 나 보다 / A + -(으)ㄴ가 보다</strong> = it seems (inference from evidence): 오나 봐요, 아픈가 봐요.</li>
<li><strong>V + 는 것 같다 / A + -(으)ㄴ 것 같다</strong> = it seems / I think: past 온 것 같아요, future 올 것 같아요.</li>
<li><strong>V/A + -(으)ㄹ 텐데</strong> = it must/would be (supposition, with an implied "but/so"): 바쁠 텐데, 힘들 텐데.</li>
<li><strong>V/A + 겠</strong> = conjecture "must be / looks": 맛있겠어요, 피곤하겠어요.</li>
</ul>
<pre><code>길이 막히나 봐요. gir-i makhina bwayo. = It seems the road is jammed.
저 사람은 학생인 것 같아요. jeo saram-eun haksaeng-in geot gatayo. = That person seems to be a student.
지금쯤 도착했을 텐데 연락이 없어요. jigeumjjeum dochakhaesseul tende yeollag-i eopseoyo. = They must have arrived by now, but there is no word.
많이 피곤하겠어요. mani pigonhagetsseoyo. = You must be very tired.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 민수 씨가 아직 안 왔어요. (Minsu ssiga ajik an wasseoyo.)</p>
<p><strong>B:</strong> 길이 막히나 봐요. 아마 조금 늦을 것 같아요. (Gir-i makhina bwayo. Ama jogeum neujeul geot gatayo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 나 보다 / (으)ㄴ가 보다 infers from visible evidence; 는 것 같다 is a softer, all-purpose "I think". 을 텐데 carries an implied contrast or worry ("...but", "...so what should we do?"). 겠 is the same 겠 you saw in future/intention, here used for a guess.</div>`,
    `<span class="eyebrow">KRL222 · Bài 4</span>
<h2>Phỏng đoán (나 보다, 는 것 같다, 을 텐데, 겠)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>막히다</td><td>makhida</td><td>bị tắc, kẹt</td></tr>
<tr><td>피곤하다</td><td>pigonhada</td><td>mệt</td></tr>
<tr><td>도착하다</td><td>dochakhada</td><td>đến nơi</td></tr>
<tr><td>연락</td><td>yeollak</td><td>liên lạc</td></tr>
<tr><td>아마</td><td>ama</td><td>có lẽ, chắc là</td></tr>
<tr><td>표정</td><td>pyojeong</td><td>vẻ mặt</td></tr>
</tbody></table>
<h3>Ngữ pháp — hình như, có vẻ, chắc là, hẳn là</h3>
<ul>
<li><strong>V + 나 보다 / A + -(으)ㄴ가 보다</strong> = hình như (suy từ dấu hiệu): 오나 봐요, 아픈가 봐요.</li>
<li><strong>V + 는 것 같다 / A + -(으)ㄴ 것 같다</strong> = có vẻ / tôi nghĩ: quá khứ 온 것 같아요, tương lai 올 것 같아요.</li>
<li><strong>V/A + -(으)ㄹ 텐데</strong> = chắc là / hẳn là (kèm ngụ ý "mà/nên"): 바쁠 텐데, 힘들 텐데.</li>
<li><strong>V/A + 겠</strong> = phỏng đoán "chắc là / trông": 맛있겠어요, 피곤하겠어요.</li>
</ul>
<pre><code>길이 막히나 봐요. gir-i makhina bwayo. = Hình như đường đang tắc.
저 사람은 학생인 것 같아요. jeo saram-eun haksaeng-in geot gatayo. = Người kia có vẻ là học sinh.
지금쯤 도착했을 텐데 연락이 없어요. jigeumjjeum dochakhaesseul tende yeollag-i eopseoyo. = Giờ này chắc đã đến rồi mà không thấy liên lạc.
많이 피곤하겠어요. mani pigonhagetsseoyo. = Chắc bạn mệt lắm.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 민수 씨가 아직 안 왔어요. (Minsu ssiga ajik an wasseoyo.)</p>
<p><strong>B:</strong> 길이 막히나 봐요. 아마 조금 늦을 것 같아요. (Gir-i makhina bwayo. Ama jogeum neujeul geot gatayo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 나 보다 / (으)ㄴ가 보다 suy từ dấu hiệu nhìn thấy; 는 것 같다 là "tôi nghĩ" nhẹ hơn, dùng chung. 을 텐데 mang ngụ ý tương phản hoặc lo lắng ("...mà", "...thì sao đây?"). 겠 chính là 겠 bạn gặp ở tương lai/ý chí, ở đây dùng để đoán.</div>`,
  ]]);
const b4q = quiz('krl222-quiz-4', 'Quiz 4 — Conjecture|||Quiz 4 — Phỏng đoán', [
  { id: 'q1', question: '"길이 막히나 봐요" means…|||"길이 막히나 봐요" nghĩa là gì?', options: ['the road is not blocked|||đường không tắc', 'it seems the road is jammed|||hình như đường đang tắc', 'please block the road|||hãy chặn đường', 'the road was blocked|||đường đã bị chặn'], correctIndex: 1, explanation: 'V + 나 보다 = hình như (suy từ dấu hiệu); 막히나 봐요 = hình như đang tắc.' },
  { id: 'q2', question: 'Which adds an implied "but/so" to a guess (would/must be)?|||Đâu là đuôi phỏng đoán kèm ngụ ý "mà/nên"?', options: ['-는 것 같다', '-을 텐데', '-나 보다', '-거나'], correctIndex: 1, explanation: '-(으)ㄹ 텐데 = chắc là... (kèm tương phản/lo lắng ngầm).' },
  { id: 'q3', question: '"많이 피곤하겠어요" expresses…|||"많이 피곤하겠어요" diễn đạt gì?', options: ['a command|||mệnh lệnh', 'a guess "you must be tired"|||phỏng đoán "chắc bạn mệt"', 'a past fact|||sự việc quá khứ', 'a wish|||mong muốn'], correctIndex: 1, explanation: '겠 dùng để đoán: 피곤하겠어요 = chắc/hẳn là mệt.' },
]);

/* ── Bài 5 — Kể lại & tường thuật gián tiếp nâng cao ────────────────────── */
const b5 = doc('krl222-5-1-reported-speech', 'Lesson 5 — Advanced reported speech|||Bài 5 — Tường thuật gián tiếp nâng cao',
  'Ôn V + ㄴ/는다고 하다·라고 하다 (thuật lại), 다고요? (nhắc/xác nhận), 다면서요? (nghe nói... phải không).',
  [[
    `<span class="eyebrow">KRL222 · Lesson 5</span>
<h2>Advanced reported speech (다고 하다, 다고요, 다면서요)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>소식</td><td>sosik</td><td>news, word</td></tr>
<tr><td>결혼하다</td><td>gyeolhonhada</td><td>to marry</td></tr>
<tr><td>전하다</td><td>jeonhada</td><td>to convey, pass on</td></tr>
<tr><td>사실</td><td>sasil</td><td>fact, truth</td></tr>
<tr><td>축하하다</td><td>chukahada</td><td>to congratulate</td></tr>
<tr><td>졸업하다</td><td>joreophada</td><td>to graduate</td></tr>
</tbody></table>
<h3>Grammar — quoting, echoing, confirming hearsay</h3>
<ul>
<li>Review indirect quote: <strong>V + -ㄴ/는다고 하다</strong>, <strong>A + 다고 하다</strong>, <strong>N(이)라고 하다</strong>: 온다고 했어요, 좋다고 했어요, 학생이라고 했어요.</li>
<li><strong>V/A + 다고요? (-냐고요? / -라고요?)</strong> = echoing or confirming ("You/I said...?"): 뭐라고요?, 간다고요?</li>
<li><strong>V/A + 다면서요? / N(이)라면서요?</strong> = "I heard that... (right?)" — confirming something heard from elsewhere: 결혼한다면서요?, 학생이라면서요?</li>
</ul>
<pre><code>친구가 내일 온다고 했어요. chinguga naeil ondago haesseoyo. = My friend said they will come tomorrow.
네? 지금 간다고요? ne? jigeum gandagoyo? = Sorry? You are saying you are going now?
곧 결혼한다면서요? 축하해요! got gyeolhonhandamyeonseoyo? chukahaeyo! = I hear you are getting married soon, right? Congratulations!</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 민지 씨가 이번에 졸업한다면서요? (Minji ssiga ibeone joreophandamyeonseoyo?)</p>
<p><strong>B:</strong> 네, 맞아요. 다음 달에 졸업한다고 했어요. (Ne, majayo. Daeum dar-e joreophandago haesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 다고 하다 simply reports a statement. 다고요? echoes back what was just said, to check or express surprise. 다면서요? confirms hearsay you got from someone else — the speaker expects a "yes". Verb present takes 는다/ㄴ다; adjectives and 이다 take plain 다.</div>`,
    `<span class="eyebrow">KRL222 · Bài 5</span>
<h2>Tường thuật gián tiếp nâng cao (다고 하다, 다고요, 다면서요)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>소식</td><td>sosik</td><td>tin tức</td></tr>
<tr><td>결혼하다</td><td>gyeolhonhada</td><td>kết hôn</td></tr>
<tr><td>전하다</td><td>jeonhada</td><td>truyền đạt, chuyển lời</td></tr>
<tr><td>사실</td><td>sasil</td><td>sự thật</td></tr>
<tr><td>축하하다</td><td>chukahada</td><td>chúc mừng</td></tr>
<tr><td>졸업하다</td><td>joreophada</td><td>tốt nghiệp</td></tr>
</tbody></table>
<h3>Ngữ pháp — thuật lại, nhắc lại, xác nhận tin nghe được</h3>
<ul>
<li>Ôn tường thuật gián tiếp: <strong>V + -ㄴ/는다고 하다</strong>, <strong>A + 다고 하다</strong>, <strong>N(이)라고 하다</strong>: 온다고 했어요, 좋다고 했어요, 학생이라고 했어요.</li>
<li><strong>V/A + 다고요? (-냐고요? / -라고요?)</strong> = nhắc lại hoặc xác nhận ("Bạn/tôi bảo... á?"): 뭐라고요?, 간다고요?</li>
<li><strong>V/A + 다면서요? / N(이)라면서요?</strong> = "nghe nói... phải không?" — xác nhận điều nghe từ nơi khác: 결혼한다면서요?, 학생이라면서요?</li>
</ul>
<pre><code>친구가 내일 온다고 했어요. chinguga naeil ondago haesseoyo. = Bạn tôi nói ngày mai sẽ đến.
네? 지금 간다고요? ne? jigeum gandagoyo? = Sao cơ? Bạn bảo giờ đi á?
곧 결혼한다면서요? 축하해요! got gyeolhonhandamyeonseoyo? chukahaeyo! = Nghe nói bạn sắp cưới phải không? Chúc mừng!</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 민지 씨가 이번에 졸업한다면서요? (Minji ssiga ibeone joreophandamyeonseoyo?)</p>
<p><strong>B:</strong> 네, 맞아요. 다음 달에 졸업한다고 했어요. (Ne, majayo. Daeum dar-e joreophandago haesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 다고 하다 chỉ thuật lại một câu nói. 다고요? nhắc lại điều vừa nghe để kiểm hoặc tỏ bất ngờ. 다면서요? xác nhận tin nghe từ người khác — người nói mong nhận "vâng". Động từ hiện tại lấy 는다/ㄴ다; tính từ và 이다 lấy 다 nguyên dạng.</div>`,
  ]]);
const b5q = quiz('krl222-quiz-5', 'Quiz 5 — Reported speech|||Quiz 5 — Tường thuật gián tiếp', [
  { id: 'q1', question: 'How do you report "My friend said they will come"?|||Thuật lại "Bạn tôi nói sẽ đến" là?', options: ['친구가 온다고 했어요', '친구가 오나 봐요', '친구가 올 텐데요', '친구가 오거든요'], correctIndex: 0, explanation: 'V + -ㄴ/는다고 하다 = thuật lại; 온다고 했어요 = nói sẽ đến.' },
  { id: 'q2', question: '"결혼한다면서요?" means…|||"결혼한다면서요?" nghĩa là gì?', options: ['Will you marry me?|||Cưới tôi nhé?', 'I heard you are getting married, right?|||Nghe nói bạn sắp cưới phải không?', 'Do not get married|||Đừng cưới', 'I am getting married|||Tôi sắp cưới'], correctIndex: 1, explanation: '-다면서요? = xác nhận tin nghe được; mong người nghe trả lời "vâng".' },
  { id: 'q3', question: '"지금 간다고요?" is used to…|||"지금 간다고요?" dùng để…', options: ['give a command|||ra mệnh lệnh', 'echo/confirm what was just said|||nhắc lại/xác nhận điều vừa nghe', 'ask permission|||xin phép', 'state a plan|||nêu kế hoạch'], correctIndex: 1, explanation: '-다고요? nhắc lại lời vừa nghe để kiểm hoặc tỏ ngạc nhiên.' },
]);

/* ── Bài 6 — Trạng thái & tiếp diễn ─────────────────────────────────────── */
const b6 = doc('krl222-6-1-state-continuation', 'Lesson 6 — States & continuation|||Bài 6 — Trạng thái & tiếp diễn',
  'V + 아/어 있다 (trạng thái sau hành động), V + 는 중이다 (đang giữa lúc), V + 곤 하다 (hay/thường).',
  [[
    `<span class="eyebrow">KRL222 · Lesson 6</span>
<h2>States &amp; continuation (아/어 있다, 는 중이다, 곤 하다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>켜지다 / 꺼지다</td><td>kyeojida / kkeojida</td><td>to turn on / off (by itself)</td></tr>
<tr><td>열리다</td><td>yeollida</td><td>to be opened, open up</td></tr>
<tr><td>회의</td><td>hoeui</td><td>meeting</td></tr>
<tr><td>눕다</td><td>nupda</td><td>to lie down (ㅂ irregular)</td></tr>
<tr><td>가끔</td><td>gakkeum</td><td>sometimes</td></tr>
<tr><td>늦잠</td><td>neutjam</td><td>oversleeping, a lie-in</td></tr>
</tbody></table>
<h3>Grammar — resulting state, in the middle of, habitually</h3>
<ul>
<li><strong>V + 아/어 있다</strong> = a state that lasts after an action (intransitive verbs): 앉아 있어요, 문이 열려 있어요, 불이 켜져 있어요. Compare 고 있다 (action in progress).</li>
<li><strong>V + 는 중이다 / N + 중이다</strong> = in the middle of: 공부하는 중이에요, 회의 중이에요.</li>
<li><strong>V + 곤 하다</strong> = do (something) repeatedly / used to: 가끔 산책하곤 해요, 늦잠을 자곤 해요.</li>
</ul>
<pre><code>불이 켜져 있어요. bur-i kyeojyeo isseoyo. = The light is on. (resulting state)
지금 밥을 먹는 중이에요. jigeum bab-eul meongneun jung-ieyo. = I am in the middle of eating.
주말에는 늦잠을 자곤 해요. jumar-eneun neutjam-eul jagon haeyo. = On weekends I tend to sleep in.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 사무실에 아직 사람이 있어요? (Samusir-e ajik saram-i isseoyo?)</p>
<p><strong>B:</strong> 네, 불이 켜져 있어요. 아마 회의 중인 것 같아요. (Ne, bur-i kyeojyeo isseoyo. Ama hoeui jung-in geot gatayo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 아/어 있다 describes a lasting state and takes no object (문이 열려 있다 = the door is open); 고 있다 describes an action underway (문을 열고 있다 = is opening the door). 는 중이다 stresses "right in the middle", and 곤 하다 marks a repeated habit.</div>`,
    `<span class="eyebrow">KRL222 · Bài 6</span>
<h2>Trạng thái &amp; tiếp diễn (아/어 있다, 는 중이다, 곤 하다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>켜지다 / 꺼지다</td><td>kyeojida / kkeojida</td><td>tự bật / tắt</td></tr>
<tr><td>열리다</td><td>yeollida</td><td>mở ra, được mở</td></tr>
<tr><td>회의</td><td>hoeui</td><td>cuộc họp</td></tr>
<tr><td>눕다</td><td>nupda</td><td>nằm (bất quy tắc ㅂ)</td></tr>
<tr><td>가끔</td><td>gakkeum</td><td>thỉnh thoảng</td></tr>
<tr><td>늦잠</td><td>neutjam</td><td>ngủ nướng, ngủ dậy muộn</td></tr>
</tbody></table>
<h3>Ngữ pháp — trạng thái còn lại, đang giữa lúc, hay/thường</h3>
<ul>
<li><strong>V + 아/어 있다</strong> = trạng thái kéo dài sau hành động (động từ nội động): 앉아 있어요, 문이 열려 있어요, 불이 켜져 있어요. So với 고 있다 (hành động đang diễn ra).</li>
<li><strong>V + 는 중이다 / N + 중이다</strong> = đang giữa lúc: 공부하는 중이에요, 회의 중이에요.</li>
<li><strong>V + 곤 하다</strong> = hay/thường làm (lặp lại): 가끔 산책하곤 해요, 늦잠을 자곤 해요.</li>
</ul>
<pre><code>불이 켜져 있어요. bur-i kyeojyeo isseoyo. = Đèn đang bật. (trạng thái còn lại)
지금 밥을 먹는 중이에요. jigeum bab-eul meongneun jung-ieyo. = Tôi đang trong lúc ăn cơm.
주말에는 늦잠을 자곤 해요. jumar-eneun neutjam-eul jagon haeyo. = Cuối tuần tôi hay ngủ nướng.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 사무실에 아직 사람이 있어요? (Samusir-e ajik saram-i isseoyo?)</p>
<p><strong>B:</strong> 네, 불이 켜져 있어요. 아마 회의 중인 것 같아요. (Ne, bur-i kyeojyeo isseoyo. Ama hoeui jung-in geot gatayo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 아/어 있다 tả trạng thái kéo dài và không có tân ngữ (문이 열려 있다 = cửa đang mở); 고 있다 tả hành động đang tiến hành (문을 열고 있다 = đang mở cửa). 는 중이다 nhấn "ngay giữa lúc", còn 곤 하다 đánh dấu thói quen lặp lại.</div>`,
  ]]);
const b6q = quiz('krl222-quiz-6', 'Quiz 6 — States & continuation|||Quiz 6 — Trạng thái & tiếp diễn', [
  { id: 'q1', question: '"문이 열려 있어요" means…|||"문이 열려 있어요" nghĩa là gì?', options: ['someone is opening the door|||ai đó đang mở cửa', 'the door is (in the state of being) open|||cửa đang mở (trạng thái)', 'please open the door|||hãy mở cửa', 'the door will open|||cửa sẽ mở'], correctIndex: 1, explanation: 'V + 아/어 있다 = trạng thái còn lại sau hành động; 열려 있다 = đang ở trạng thái mở.' },
  { id: 'q2', question: 'How do you say "I am in the middle of studying"?|||Nói "Tôi đang trong lúc học" là?', options: ['공부하곤 해요', '공부하는 중이에요', '공부해 있어요', '공부하다면서요'], correctIndex: 1, explanation: 'V + 는 중이다 = đang giữa lúc; 공부하는 중이에요.' },
  { id: 'q3', question: '-곤 하다 expresses…|||-곤 하다 diễn đạt gì?', options: ['a single past action|||một hành động quá khứ đơn', 'a repeated habit / used to|||thói quen lặp lại / hay làm', 'a resulting state|||trạng thái còn lại', 'an order|||mệnh lệnh'], correctIndex: 1, explanation: 'V + 곤 하다 = hay/thường làm; 산책하곤 해요 = hay đi dạo.' },
]);

/* ── Bài 7 — Cảm thán & nhấn mạnh ───────────────────────────────────────── */
const b7 = doc('krl222-7-1-exclamation-emphasis', 'Lesson 7 — Exclamation & emphasis|||Bài 7 — Cảm thán & nhấn mạnh',
  'A + 군요·V + 는군요 và 네요 (cảm thán, nhận ra), 잖아요 (mà, như đã biết), 거든요 (vì, bạn biết đấy).',
  [[
    `<span class="eyebrow">KRL222 · Lesson 7</span>
<h2>Exclamation &amp; emphasis (군요/네요, 잖아요, 거든요)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>놀라다</td><td>nollada</td><td>to be surprised</td></tr>
<tr><td>대단하다</td><td>daedanhada</td><td>to be amazing, great</td></tr>
<tr><td>벌써</td><td>beolsseo</td><td>already</td></tr>
<tr><td>사실은</td><td>sasireun</td><td>actually, in fact</td></tr>
<tr><td>그렇구나</td><td>geureokuna</td><td>oh, I see (casual)</td></tr>
<tr><td>정말</td><td>jeongmal</td><td>really, truly</td></tr>
</tbody></table>
<h3>Grammar — realizing, reminding, giving a reason</h3>
<ul>
<li><strong>A + 군요 / V + 는군요</strong> and colloquial <strong>네요</strong> = exclamation on realizing something: 예쁘군요!, 잘하는군요!, 맛있네요!</li>
<li><strong>V/A + 잖아요</strong> = as you know / remember (reminding of shared knowledge): 어제 말했잖아요, 비싸잖아요.</li>
<li><strong>V/A + 거든요</strong> = you see / because (giving background the listener did not know): 배가 고프거든요, 약속이 있거든요.</li>
</ul>
<pre><code>와, 한국어를 정말 잘하시네요! wa, hangugeoreul jeongmal jalhasineyo! = Wow, you really speak Korean well!
제가 어제 말했잖아요. jega eoje malhaetjanayo. = I told you yesterday, remember?
왜 안 먹어요? — 배가 안 고프거든요. wae an meogeoyo? — baega an gopeugeodeunyo. = Why aren't you eating? — Because I'm not hungry, you see.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 벌써 다 끝냈어요? 대단하네요! (Beolsseo da kkeutnaesseoyo? Daedanhaneyo!)</p>
<p><strong>B:</strong> 사실은 어제 미리 준비했거든요. (Sasireun eoje miri junbihaetgeodeunyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 네요 and 군요 both mark fresh realization; 네요 is warmer and more common in speech. 잖아요 reminds the listener of something you both already know (can sound reproachful). 거든요 supplies a reason the listener did not know — do not use it for facts they clearly already know.</div>`,
    `<span class="eyebrow">KRL222 · Bài 7</span>
<h2>Cảm thán &amp; nhấn mạnh (군요/네요, 잖아요, 거든요)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>놀라다</td><td>nollada</td><td>ngạc nhiên</td></tr>
<tr><td>대단하다</td><td>daedanhada</td><td>tuyệt vời, cừ</td></tr>
<tr><td>벌써</td><td>beolsseo</td><td>đã... rồi</td></tr>
<tr><td>사실은</td><td>sasireun</td><td>thật ra</td></tr>
<tr><td>그렇구나</td><td>geureokuna</td><td>à ra vậy (thân mật)</td></tr>
<tr><td>정말</td><td>jeongmal</td><td>thật sự, thật là</td></tr>
</tbody></table>
<h3>Ngữ pháp — nhận ra, nhắc lại, nêu lý do</h3>
<ul>
<li><strong>A + 군요 / V + 는군요</strong> và dạng khẩu ngữ <strong>네요</strong> = cảm thán khi vừa nhận ra: 예쁘군요!, 잘하는군요!, 맛있네요!</li>
<li><strong>V/A + 잖아요</strong> = mà / như đã biết (nhắc điều cả hai cùng biết): 어제 말했잖아요, 비싸잖아요.</li>
<li><strong>V/A + 거든요</strong> = bạn biết đấy / vì (nêu bối cảnh người nghe chưa biết): 배가 고프거든요, 약속이 있거든요.</li>
</ul>
<pre><code>와, 한국어를 정말 잘하시네요! wa, hangugeoreul jeongmal jalhasineyo! = Ồ, bạn nói tiếng Hàn giỏi thật đấy!
제가 어제 말했잖아요. jega eoje malhaetjanayo. = Tôi đã nói với bạn hôm qua rồi mà.
왜 안 먹어요? — 배가 안 고프거든요. wae an meogeoyo? — baega an gopeugeodeunyo. = Sao không ăn? — Tại tôi không đói mà.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 벌써 다 끝냈어요? 대단하네요! (Beolsseo da kkeutnaesseoyo? Daedanhaneyo!)</p>
<p><strong>B:</strong> 사실은 어제 미리 준비했거든요. (Sasireun eoje miri junbihaetgeodeunyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 네요 và 군요 đều đánh dấu vừa nhận ra; 네요 ấm hơn và hay dùng khi nói. 잖아요 nhắc người nghe điều cả hai đã biết (có thể nghe như trách nhẹ). 거든요 cung cấp lý do người nghe chưa biết — đừng dùng cho điều họ rõ ràng đã biết.</div>`,
  ]]);
const b7q = quiz('krl222-quiz-7', 'Quiz 7 — Exclamation & emphasis|||Quiz 7 — Cảm thán & nhấn mạnh', [
  { id: 'q1', question: 'Which ending is a warm, spoken exclamation "oh, it is...!"?|||Đuôi nào là cảm thán khẩu ngữ ấm áp "ồ, ... thật!"?', options: ['-네요', '-잖아요', '-거든요', '-는다면'], correctIndex: 0, explanation: '-네요 (và -군요) = cảm thán khi vừa nhận ra; 맛있네요! = ngon thật!' },
  { id: 'q2', question: '"어제 말했잖아요" means…|||"어제 말했잖아요" nghĩa là gì?', options: ['I did not say it yesterday|||Hôm qua tôi không nói', 'I told you yesterday, remember?|||Tôi đã nói với bạn hôm qua rồi mà', 'Please tell me yesterday|||Hãy nói với tôi hôm qua', 'Did you say it yesterday?|||Bạn đã nói hôm qua à?'], correctIndex: 1, explanation: '-잖아요 = nhắc điều cả hai đã biết; 말했잖아요 = đã nói rồi mà.' },
  { id: 'q3', question: '-거든요 is used to…|||-거든요 dùng để…', options: ['give a command|||ra mệnh lệnh', 'supply a reason the listener did not know|||nêu lý do người nghe chưa biết', 'ask a question|||đặt câu hỏi', 'report hearsay|||thuật lại tin đồn'], correctIndex: 1, explanation: '-거든요 = vì / bạn biết đấy, cung cấp bối cảnh mới cho người nghe.' },
]);

/* ── Bài 8 — Kính ngữ & lịch sự nâng cao ────────────────────────────────── */
const b8 = doc('krl222-8-1-advanced-honorifics', 'Lesson 8 — Advanced honorifics|||Bài 8 — Kính ngữ & lịch sự nâng cao',
  'Ôn -(으)시-, khiêm nhường 드리다 (và 여쭤보다), trợ từ kính ngữ 께서·께, hậu tố 님.',
  [[
    `<span class="eyebrow">KRL222 · Lesson 8</span>
<h2>Advanced honorifics (으시, 드리다, 께서, 님)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>사장님</td><td>sajangnim</td><td>company president, boss</td></tr>
<tr><td>부모님</td><td>bumonim</td><td>parents (honorific)</td></tr>
<tr><td>말씀</td><td>malsseum</td><td>words (honorific of 말)</td></tr>
<tr><td>드리다</td><td>deurida</td><td>to give (humble of 주다)</td></tr>
<tr><td>여쭤보다</td><td>yeojjwoboda</td><td>to ask (humble of 묻다)</td></tr>
<tr><td>손님</td><td>sonnim</td><td>guest, customer</td></tr>
</tbody></table>
<h3>Grammar — respect the subject, humble the speaker</h3>
<ul>
<li><strong>V + -(으)시-</strong> = subject honorific (review): 가시다 → 가세요, 읽으시다 → 읽으세요; special 있다 → 계시다, 먹다 → 드시다, 자다 → 주무시다.</li>
<li><strong>N께서</strong> = honorific subject particle (replaces 이/가); <strong>N께</strong> = honorific of 에게/한테 (to): 선생님께서, 부모님께.</li>
<li><strong>V + 아/어 드리다</strong> = humbly do for a respected person (humble of 아/어 주다): 도와 드리다, 알려 드리다, 사 드리다. 님 attaches to titles: 선생님, 사장님, 손님.</li>
</ul>
<pre><code>부모님께서 오셨어요. bumonimkkeseo osyeosseoyo. = My parents came. (honorific)
제가 선생님께 선물을 드렸어요. jega seonsaengnimkke seonmur-eul deuryeosseoyo. = I gave a gift to the teacher. (humble)
제가 도와 드릴게요. jega dowa deurilgeyo. = Let me help you. (humble)</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 사장님께서 지금 안 계세요. (Sajangnimkkeseo jigeum an gyeseyo.)</p>
<p><strong>B:</strong> 그럼 제가 나중에 다시 연락 드릴게요. (Geureom jega najunge dasi yeollak deurilgeyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> Raise the SUBJECT with 으시 + 께서 (부모님께서 오셨어요), but lower YOURSELF with humble verbs like 드리다 and 여쭤보다 when the action reaches a respected person. 께 is the honorific "to"; attach 님 to titles (선생님, 사장님) to show respect.</div>`,
    `<span class="eyebrow">KRL222 · Bài 8</span>
<h2>Kính ngữ &amp; lịch sự nâng cao (으시, 드리다, 께서, 님)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>사장님</td><td>sajangnim</td><td>giám đốc, sếp</td></tr>
<tr><td>부모님</td><td>bumonim</td><td>bố mẹ (kính ngữ)</td></tr>
<tr><td>말씀</td><td>malsseum</td><td>lời nói (kính ngữ của 말)</td></tr>
<tr><td>드리다</td><td>deurida</td><td>biếu, tặng (khiêm nhường của 주다)</td></tr>
<tr><td>여쭤보다</td><td>yeojjwoboda</td><td>hỏi (khiêm nhường của 묻다)</td></tr>
<tr><td>손님</td><td>sonnim</td><td>khách</td></tr>
</tbody></table>
<h3>Ngữ pháp — tôn chủ ngữ, hạ mình người nói</h3>
<ul>
<li><strong>V + -(으)시-</strong> = kính ngữ chủ ngữ (ôn tập): 가시다 → 가세요, 읽으시다 → 읽으세요; đặc biệt 있다 → 계시다, 먹다 → 드시다, 자다 → 주무시다.</li>
<li><strong>N께서</strong> = trợ từ chủ ngữ kính ngữ (thay 이/가); <strong>N께</strong> = kính ngữ của 에게/한테 (cho, tới): 선생님께서, 부모님께.</li>
<li><strong>V + 아/어 드리다</strong> = khiêm nhường "làm giúp người trên" (khiêm của 아/어 주다): 도와 드리다, 알려 드리다, 사 드리다. 님 gắn vào chức danh: 선생님, 사장님, 손님.</li>
</ul>
<pre><code>부모님께서 오셨어요. bumonimkkeseo osyeosseoyo. = Bố mẹ tôi đã đến. (kính ngữ)
제가 선생님께 선물을 드렸어요. jega seonsaengnimkke seonmur-eul deuryeosseoyo. = Tôi đã biếu thầy món quà. (khiêm nhường)
제가 도와 드릴게요. jega dowa deurilgeyo. = Để tôi giúp cho ạ. (khiêm nhường)</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 사장님께서 지금 안 계세요. (Sajangnimkkeseo jigeum an gyeseyo.)</p>
<p><strong>B:</strong> 그럼 제가 나중에 다시 연락 드릴게요. (Geureom jega najunge dasi yeollak deurilgeyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Nâng CHỦ NGỮ bằng 으시 + 께서 (부모님께서 오셨어요), nhưng HẠ MÌNH bằng động từ khiêm nhường như 드리다 và 여쭤보다 khi hành động hướng tới người trên. 께 là "cho/tới" kính ngữ; gắn 님 vào chức danh (선생님, 사장님) để tỏ tôn trọng.</div>`,
  ]]);
const b8q = quiz('krl222-quiz-8', 'Quiz 8 — Advanced honorifics|||Quiz 8 — Kính ngữ nâng cao', [
  { id: 'q1', question: 'The honorific subject particle (replacing 이/가) is…|||Trợ từ chủ ngữ kính ngữ (thay 이/가) là…', options: ['께', '께서', '한테', '에서'], correctIndex: 1, explanation: 'N께서 = trợ từ chủ ngữ kính ngữ; 부모님께서 오셨어요.' },
  { id: 'q2', question: '드리다 is the humble form of which verb?|||드리다 là dạng khiêm nhường của động từ nào?', options: ['주다 (to give)|||주다 (cho)', '받다 (to receive)|||받다 (nhận)', '먹다 (to eat)|||먹다 (ăn)', '가다 (to go)|||가다 (đi)'], correctIndex: 0, explanation: '드리다 = khiêm nhường của 주다 (cho/biếu), dùng khi trao cho người trên.' },
  { id: 'q3', question: '"제가 도와 드릴게요" means…|||"제가 도와 드릴게요" nghĩa là gì?', options: ['Please help me|||Hãy giúp tôi', 'Let me help you (humble)|||Để tôi giúp cho ạ (khiêm nhường)', 'I cannot help|||Tôi không giúp được', 'Did you help?|||Bạn đã giúp à?'], correctIndex: 1, explanation: 'V + 아/어 드리다 = làm giúp người trên (khiêm nhường); 도와 드릴게요 = để tôi giúp cho ạ.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'KRL222',
    slug: 'krl222-elementary-korean-4',
    title: 'Elementary Korean 4',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KRL222.webp',
    shortDescription: 'Elementary Korean 4, after KRL212: purpose (기 위해서, 으려면), choice (거나, 든지), concession (아/어도, 더라도), conjecture (나 보다, 는 것 같다), reported speech (다면서요), states (아/어 있다) and honorifics (드리다, 께서). Sejong Korean 3, TOPIK I-II.|||Tiếng Hàn sơ cấp 4, nối tiếp KRL212: mục đích (기 위해서), lựa chọn (거나, 든지), nhượng bộ (아/어도, 더라도), phỏng đoán (나 보다, 는 것 같다), tường thuật (다면서요), trạng thái (아/어 있다) và kính ngữ (드리다, 께서). Sejong Korean 3, TOPIK I-II.',
    description: 'Môn <strong>KRL222 — Elementary Korean 4</strong> (Tiếng Hàn sơ cấp 4, Kỳ 3, ngành Ngôn ngữ Hàn) nối tiếp <strong>KRL212</strong>. Từ nền liên từ, tường thuật gián tiếp, kính ngữ và động từ bất quy tắc, môn này mở rộng: <strong>mục đích &amp; dự định</strong> (기 위해서, 으려면, 을 겸) → <strong>so sánh &amp; lựa chọn</strong> (보다, 는 게 좋겠다, 거나, 든지) → <strong>nhượng bộ &amp; điều kiện</strong> (아/어도, 더라도, 는다면) → <strong>phỏng đoán</strong> (나 보다, 는 것 같다, 을 텐데, 겠) → <strong>tường thuật gián tiếp nâng cao</strong> (다고요, 라고 하다, 다면서요) → <strong>trạng thái &amp; tiếp diễn</strong> (아/어 있다, 는 중이다, 곤 하다) → <strong>cảm thán &amp; nhấn mạnh</strong> (군요/네요, 잖아요, 거든요) → <strong>kính ngữ nâng cao</strong> (으시, 드리다, 께서, 님). Bám giáo trình Sejong Korean 3 / Ewha, song ngữ Hàn-Việt, có bảng từ vựng, ngữ pháp, hội thoại và quiz mỗi bài. Trình độ TOPIK I cuối → TOPIK II đầu.',
    whatYouLearn: 'Nêu mục đích 기 위해서, dự định 으려면 và làm một công đôi việc 을 겸; đưa lựa chọn với 거나·든지 và khuyên bằng 는 게 좋겠다; nhượng bộ với 아/어도·더라도 và giả định với 는다면; phỏng đoán bằng 나 보다, 는 것 같다, 을 텐데 và 겠; thuật lại lời nói (다고 하다), nhắc lại (다고요) và xác nhận tin nghe được (다면서요); tả trạng thái 아/어 있다, đang giữa lúc 는 중이다 và thói quen 곤 하다; thêm cảm thán 군요/네요, nhắc 잖아요 và nêu lý do 거든요; và dùng kính ngữ nâng cao 으시·께서·께, khiêm nhường 드리다 cùng hậu tố 님.',
    requirements: 'Đã học xong KRL212 (Elementary Korean 3) hoặc tương đương: nối được mệnh đề (는데, 다가), tường thuật gián tiếp cơ bản (다고 하다), động từ bất quy tắc ㄷ/ㅂ/ㅅ/르, kính ngữ 으시. Cần luyện nói hội thoại thành tiếng mỗi ngày.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Sejong 3/Ewha, từ điển Naver, app, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp KRL212, mục tiêu TOPIK II, bản đồ 8 bài.', lessons: [intro] },
    { title: 'Bài 1 — Mục đích & dự định|||Lesson 1 — Purpose & intent', description: '기 위해서, 으려면, 을 겸.', lessons: [b1, b1q] },
    { title: 'Bài 2 — So sánh & lựa chọn|||Lesson 2 — Comparison & choice', description: '보다, 는 게 좋겠다, 거나, 든지.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Nhượng bộ & điều kiện|||Lesson 3 — Concession & condition', description: '아/어도, 더라도, 는다면.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Phỏng đoán|||Lesson 4 — Conjecture', description: '나 보다, 는 것 같다, 을 텐데, 겠.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Tường thuật gián tiếp|||Lesson 5 — Reported speech', description: '다고 하다, 다고요, 다면서요.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Trạng thái & tiếp diễn|||Lesson 6 — States & continuation', description: '아/어 있다, 는 중이다, 곤 하다.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Cảm thán & nhấn mạnh|||Lesson 7 — Exclamation & emphasis', description: '군요/네요, 잖아요, 거든요.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Kính ngữ nâng cao|||Lesson 8 — Advanced honorifics', description: '으시, 드리다, 께서, 님.', lessons: [b8, b8q] },
  ],
};
