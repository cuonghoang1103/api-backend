/**
 * KRL212 — Elementary Korean 3 (Tiếng Hàn sơ cấp 3). Khối Ngôn ngữ Hàn FPTU, Kỳ 3.
 * NỐI TIẾP KRL122 — Elementary Korean 2. Giáo trình chuẩn: 세종한국어 Sejong Korean
 * 2-3 / Ewha Korean; trình độ TOPIK I cuối → TOPIK II đầu.
 * MÔN NGÔN NGỮ — mỗi bài: từ vựng, ngữ pháp + mẫu câu (chú ý bất quy tắc), hội thoại,
 * ghi chú. Hangul + Revised Romanization + nghĩa tiếng Việt.
 * bi(e,v): e = trình bày Hàn+Anh, v = giải thích tiếng Việt.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 300, questions } });

/* ── Tài liệu ────────────────────────────────────────────────────────────── */
const taiLieu = doc('krl212-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình Sejong Korean 2-3 / Ewha, app TOPIK ONE / Anki, Naver dictionary, YouTube, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">KRL212 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need for <strong>Elementary Korean 3</strong> — building on the plans, reasons, ability and verb modifiers from <strong>KRL122</strong> toward intentions, advanced reasons, experience, the irregular verbs, indirect quotation, comparison-by-degree, wishes and retrospective modifiers — in one place. The official FPTU giáo trình &amp; slides live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbooks</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 2 → 3</em> — King Sejong Institute (free PDF &amp; audio)</a></li>
<li><em>Ewha Korean 2-3</em> — Ewha Womans University Press</li>
</ul>
<h3>🌐 Dictionaries &amp; apps</h3>
<ul>
<li><a href="https://korean.dict.naver.com/" target="_blank" rel="noopener">Naver Korean Dictionary (한국어사전)</a></li>
<li>TOPIK ONE (mobile) — TOPIK I-II vocabulary &amp; grammar drills</li>
<li>Anki — spaced-repetition flashcards for vocab &amp; irregular conjugation</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — grammar &amp; listening</li>
<li><a href="https://www.youtube.com/@GoBillyKorean" target="_blank" rel="noopener">Go! Billy Korean</a> — grammar &amp; pronunciation</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Review KRL122</strong> — future 을 거예요, wanting 고 싶다, reasons 아서/어서, ability 을 수 있다, modifiers 는/은/을, honorifics 으시다.</li>
<li><strong>Refine intent &amp; reason</strong> — 으려고 하다, 기로 하다, 을 것 같다, 으니까, 기 때문에.</li>
<li><strong>Master the irregulars</strong> — ㅂ (덥다 → 더워요), ㄷ (듣다 → 들어요), ㄹ 탈락, 으 탈락; then indirect quotation 다고 하다.</li>
<li><strong>Speak with nuance</strong> — 처럼·만큼, 았/었으면 좋겠다, 아/어야 하다, 던/았던; aim at TOPIK II.</li>
</ol></div>`,
    `<span class="eyebrow">KRL212 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho <strong>Tiếng Hàn sơ cấp 3</strong> — dựng tiếp trên kế hoạch, lý do, khả năng và định ngữ động từ của <strong>KRL122</strong> để tiến tới ý định, lý do nâng cao, trải nghiệm, các bất quy tắc, trích dẫn gián tiếp, so sánh mức độ, giả định và định ngữ hồi tưởng — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 2 → 3</em> — Viện King Sejong (PDF &amp; audio miễn phí)</a></li>
<li><em>Ewha Korean 2-3</em> — NXB Đại học Ewha</li>
</ul>
<h3>🌐 Từ điển &amp; ứng dụng</h3>
<ul>
<li><a href="https://korean.dict.naver.com/" target="_blank" rel="noopener">Từ điển Naver (한국어사전)</a></li>
<li>TOPIK ONE (điện thoại) — luyện từ vựng &amp; ngữ pháp TOPIK I-II</li>
<li>Anki — thẻ ghi nhớ lặp lại ngắt quãng cho từ vựng &amp; chia bất quy tắc</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — ngữ pháp &amp; nghe</li>
<li><a href="https://www.youtube.com/@GoBillyKorean" target="_blank" rel="noopener">Go! Billy Korean</a> — ngữ pháp &amp; phát âm</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Ôn lại KRL122</strong> — tương lai 을 거예요, muốn 고 싶다, lý do 아서/어서, khả năng 을 수 있다, định ngữ 는/은/을, kính ngữ 으시다.</li>
<li><strong>Tinh chỉnh ý định &amp; lý do</strong> — 으려고 하다, 기로 하다, 을 것 같다, 으니까, 기 때문에.</li>
<li><strong>Nắm chắc bất quy tắc</strong> — ㅂ (덥다 → 더워요), ㄷ (듣다 → 들어요), ㄹ 탈락, 으 탈락; rồi trích dẫn gián tiếp 다고 하다.</li>
<li><strong>Nói có sắc thái</strong> — 처럼·만큼, 았/었으면 좋겠다, 아/어야 하다, 던/았던; hướng tới TOPIK II.</li>
</ol></div>`,
  ]]);

/* ── Giới thiệu môn ──────────────────────────────────────────────────────── */
const intro = doc('krl212-0-1-overview', 'Course overview: from KRL122 onward|||Tổng quan: nối tiếp từ KRL122',
  'Mục tiêu môn (từ TOPIK I cuối lên TOPIK II đầu), nhắc lại nền KRL122, và bản đồ ngữ pháp 8 bài.',
  [[
    `<span class="eyebrow">KRL212 · Lesson 0.1 · Overview</span>
<h2>Elementary Korean 3</h2>
<p class="lead">This course continues <strong>Elementary Korean 2 (KRL122)</strong>. You already use the future 을 거예요, wanting 고 싶다, reasons 아서/어서, ability 을 수 있다, verb modifiers 는/은/을 and honorifics 으시다. Now you will <strong>state intentions and decisions, give richer reasons, talk about experiences, conjugate the irregular verbs, report what others said, compare by degree, express wishes and obligations, and use retrospective modifiers and nominalization</strong> — bridging from the end of <strong>TOPIK I</strong> into <strong>TOPIK II</strong>.</p>
<h3>What KRL122 gave you</h3>
<p>KRL122 is the foundation: the future 을 거예요, 고 싶다·아/어 보다, reasons 아서/어서·지만·는데, ability 을 수 있다·아도 되다, verb-noun modifiers, comparison 보다·제일, conditions 으면·으세요·읍시다, and honorifics 으시다·고 있다. This course assumes all of that.</p>
<h3>Roadmap of the 8 lessons</h3>
<p>Plans &amp; intentions (으려고 하다, 기로 하다, 을 것 같다) → advanced reasons &amp; contrast (으니까, 는데, 기 때문에) → experience &amp; change (아/어 본 적이 있다, 게 되다) → irregular verbs (ㅂ, ㄷ, ㄹ 탈락, 으 탈락) → indirect quotation (다고/냐고/자고/라고 하다) → adverbs &amp; degree (게, 처럼, 만큼) → conditions &amp; wishes (으면, 았/었으면 좋겠다, 아/어야 하다) → tense modifiers &amp; nominalization (던/았던, 기/는 것, 는 중이다). Bilingual Korean-Vietnamese, with vocabulary tables, grammar notes, short dialogues and a quiz each lesson.</p>
<div class="callout"><span class="badge">Politeness level</span> This course keeps the <strong>해요체</strong> (polite -요 style) and the <strong>subject honorific 으시</strong> from KRL122, while adding indirect speech and the irregular conjugations that TOPIK II reading and listening demand.</div>`,
    `<span class="eyebrow">KRL212 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Hàn sơ cấp 3</h2>
<p class="lead">Môn này nối tiếp <strong>Tiếng Hàn sơ cấp 2 (KRL122)</strong>. Bạn đã dùng được thì tương lai 을 거예요, mong muốn 고 싶다, lý do 아서/어서, khả năng 을 수 있다, định ngữ động từ 는/은/을 và kính ngữ 으시다. Giờ bạn sẽ <strong>nói ý định và quyết định, nêu lý do sâu hơn, kể về trải nghiệm, chia các động từ bất quy tắc, thuật lại lời người khác, so sánh mức độ, diễn đạt ước muốn và bổn phận, và dùng định ngữ hồi tưởng cùng danh từ hoá</strong> — bắc cầu từ cuối <strong>TOPIK I</strong> sang <strong>TOPIK II</strong>.</p>
<h3>KRL122 đã cho bạn gì</h3>
<p>KRL122 là nền: thì tương lai 을 거예요, 고 싶다·아/어 보다, lý do 아서/어서·지만·는데, khả năng 을 수 있다·아도 되다, định ngữ động từ, so sánh 보다·제일, điều kiện 으면·으세요·읍시다, và kính ngữ 으시다·고 있다. Môn này giả định bạn đã nắm hết.</p>
<h3>Bản đồ 8 bài</h3>
<p>Kế hoạch &amp; ý định (으려고 하다, 기로 하다, 을 것 같다) → lý do &amp; tương phản nâng cao (으니까, 는데, 기 때문에) → trải nghiệm &amp; thay đổi (아/어 본 적이 있다, 게 되다) → động từ bất quy tắc (ㅂ, ㄷ, ㄹ 탈락, 으 탈락) → trích dẫn gián tiếp (다고/냐고/자고/라고 하다) → trạng từ &amp; mức độ (게, 처럼, 만큼) → điều kiện &amp; giả định (으면, 았/었으면 좋겠다, 아/어야 하다) → định ngữ thời &amp; danh từ hoá (던/았던, 기/는 것, 는 중이다). Song ngữ Hàn-Việt, có bảng từ vựng, ghi chú ngữ pháp, hội thoại ngắn và quiz mỗi bài.</p>
<div class="callout"><span class="badge">Bậc lịch sự</span> Môn này giữ <strong>해요체</strong> (thể lịch sự đuôi -요) và <strong>kính ngữ chủ ngữ 으시</strong> từ KRL122, đồng thời thêm lời nói gián tiếp và các cách chia bất quy tắc mà phần đọc-nghe TOPIK II đòi hỏi.</div>`,
  ]]);

/* ── Bài 1 — Kế hoạch & ý định ──────────────────────────────────────────── */
const b1 = doc('krl212-1-1-plans-intentions', 'Lesson 1 — Plans & intentions|||Bài 1 — Kế hoạch & ý định',
  'Ý định 으려고 하다, quyết định 기로 하다, phỏng đoán 을 것 같다 (chú ý sau nguyên âm/phụ âm).',
  [[
    `<span class="eyebrow">KRL212 · Lesson 1</span>
<h2>Plans &amp; intentions (으려고 하다, 기로 하다, 을 것 같다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>계획을 세우다</td><td>gyehoegeul sewuda</td><td>to make a plan</td></tr>
<tr><td>약속</td><td>yaksok</td><td>promise, appointment</td></tr>
<tr><td>표</td><td>pyo</td><td>ticket</td></tr>
<tr><td>예매하다</td><td>yemaehada</td><td>to book (in advance)</td></tr>
<tr><td>결정하다</td><td>gyeoljeonghada</td><td>to decide</td></tr>
<tr><td>곧</td><td>got</td><td>soon</td></tr>
</tbody></table>
<h3>Grammar — intention, decision, conjecture</h3>
<ul>
<li><strong>V + -(으)려고 하다</strong> = intend / plan to: after a vowel/ㄹ add 려고 하다, after a consonant add 으려고 하다. 가다 → 가려고 해요, 먹다 → 먹으려고 해요.</li>
<li><strong>V + 기로 하다</strong> = decide / agree to: 여행을 가기로 했어요 = (I) decided to travel.</li>
<li><strong>V/A + -(으)ㄹ 것 같다</strong> = it seems / probably will: 비가 올 것 같아요. Present 는 것 같다, past 은 것 같다.</li>
</ul>
<pre><code>방학에 여행을 가려고 해요.  banghag-e yeohaeng-eul garyeogo haeyo. = I plan to travel in the vacation.
친구하고 만나기로 했어요.   chinguhago mannagiro haesseoyo.        = I decided to meet a friend.
내일 비가 올 것 같아요.     naeil biga ol geot gatayo.             = It looks like it will rain tomorrow.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 주말에 뭐 하려고 해요? (Jumal-e mwo haryeogo haeyo?)</p>
<p><strong>B:</strong> 영화를 보러 가기로 했어요. 표도 예매했어요. (Yeonghwareul boreo gagiro haesseoyo. Pyodo yemaehaesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 으려고 하다 states the speaker's own intention; 기로 하다 marks a firm decision or agreement (often shared). 을 것 같다 is a soft guess — for a present state use 는 것 같다 (비가 오는 것 같아요).</div>`,
    `<span class="eyebrow">KRL212 · Bài 1</span>
<h2>Kế hoạch &amp; ý định (으려고 하다, 기로 하다, 을 것 같다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>계획을 세우다</td><td>gyehoegeul sewuda</td><td>lập kế hoạch</td></tr>
<tr><td>약속</td><td>yaksok</td><td>lời hứa, cuộc hẹn</td></tr>
<tr><td>표</td><td>pyo</td><td>vé</td></tr>
<tr><td>예매하다</td><td>yemaehada</td><td>đặt trước (vé)</td></tr>
<tr><td>결정하다</td><td>gyeoljeonghada</td><td>quyết định</td></tr>
<tr><td>곧</td><td>got</td><td>sắp, ngay</td></tr>
</tbody></table>
<h3>Ngữ pháp — ý định, quyết định, phỏng đoán</h3>
<ul>
<li><strong>V + -(으)려고 하다</strong> = định / dự tính làm: sau nguyên âm/ㄹ thêm 려고 하다, sau phụ âm thêm 으려고 하다. 가다 → 가려고 해요, 먹다 → 먹으려고 해요.</li>
<li><strong>V + 기로 하다</strong> = quyết định / thống nhất làm: 여행을 가기로 했어요 = (tôi) đã quyết định đi du lịch.</li>
<li><strong>V/A + -(으)ㄹ 것 같다</strong> = có vẻ / chắc sẽ: 비가 올 것 같아요. Hiện tại 는 것 같다, quá khứ 은 것 같다.</li>
</ul>
<pre><code>방학에 여행을 가려고 해요.  banghag-e yeohaeng-eul garyeogo haeyo. = Kỳ nghỉ tôi định đi du lịch.
친구하고 만나기로 했어요.   chinguhago mannagiro haesseoyo.        = Tôi đã hẹn gặp bạn.
내일 비가 올 것 같아요.     naeil biga ol geot gatayo.             = Có vẻ ngày mai trời sẽ mưa.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 주말에 뭐 하려고 해요? (Jumal-e mwo haryeogo haeyo?)</p>
<p><strong>B:</strong> 영화를 보러 가기로 했어요. 표도 예매했어요. (Yeonghwareul boreo gagiro haesseoyo. Pyodo yemaehaesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 으려고 하다 nêu ý định của chính người nói; 기로 하다 đánh dấu một quyết định chắc chắn hoặc sự thống nhất (thường chung). 을 것 같다 là phỏng đoán nhẹ — với trạng thái hiện tại dùng 는 것 같다 (비가 오는 것 같아요).</div>`,
  ]]);
const b1q = quiz('krl212-quiz-1', 'Quiz 1 — Plans & intentions|||Quiz 1 — Kế hoạch & ý định', [
  { id: 'q1', question: '"I intend to go" is…|||"Tôi định đi" là…', options: ['가기로 해요', '가려고 해요', '갈 것 같아요', '갈게요'], correctIndex: 1, explanation: '-(으)려고 하다 = định/dự tính; 가다 → 가려고 해요.' },
  { id: 'q2', question: 'Which pattern means "decided to (do)"?|||Cấu trúc "đã quyết định làm" là?', options: ['-(으)려고 하다', '-기로 하다', '-(으)ㄹ 것 같다', '-고 싶다'], correctIndex: 1, explanation: 'V + 기로 하다 = quyết định/thống nhất: 가기로 했어요.' },
  { id: 'q3', question: '"내일 비가 올 것 같아요" means…|||"내일 비가 올 것 같아요" nghĩa là gì?', options: ['It rained yesterday|||Hôm qua trời đã mưa', 'It seems it will rain tomorrow|||Có vẻ ngày mai trời sẽ mưa', 'I want it to rain|||Tôi muốn trời mưa', 'It never rains|||Trời không bao giờ mưa'], correctIndex: 1, explanation: '-(으)ㄹ 것 같다 = phỏng đoán; 올 것 같아요 = có vẻ sẽ mưa.' },
]);

/* ── Bài 2 — Lý do & tương phản nâng cao ────────────────────────────────── */
const b2 = doc('krl212-2-1-reason-advanced', 'Lesson 2 — Advanced reasons & contrast|||Bài 2 — Lý do & tương phản nâng cao',
  'Lý do 으니까 (dùng được với mệnh lệnh), bối cảnh/tương phản 는데/은데, lý do mạnh 기 때문에.',
  [[
    `<span class="eyebrow">KRL212 · Lesson 2</span>
<h2>Advanced reasons &amp; contrast (으니까, 는데, 기 때문에)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>길이 막히다</td><td>giri makhida</td><td>the road is jammed</td></tr>
<tr><td>피곤하다</td><td>pigonhada</td><td>to be tired</td></tr>
<tr><td>감기</td><td>gamgi</td><td>a cold (illness)</td></tr>
<tr><td>걸리다</td><td>geollida</td><td>to catch (a cold), take (time)</td></tr>
<tr><td>우산</td><td>usan</td><td>umbrella</td></tr>
</tbody></table>
<h3>Grammar — because (subjective), background, because (strong)</h3>
<ul>
<li><strong>V/A + -(으)니까</strong> = because / since — can lead into a command or suggestion: 비가 오니까 우산을 가져가세요.</li>
<li><strong>V + 는데 / A + -(으)ㄴ데</strong> = background or soft contrast: 한국어를 배우는데 아주 재미있어요.</li>
<li><strong>N + 때문에 / V·A + 기 때문에</strong> = because (strong, objective): 감기 때문에, 잠을 못 잤기 때문에.</li>
</ul>
<pre><code>길이 막히니까 지하철로 가요.  giri makhinikka jihacheollo gayo.   = Since the road is jammed, let's take the subway.
감기 때문에 학교에 못 갔어요. gamgi ttaemune hakgyo-e mot gasseoyo. = Because of a cold, I couldn't go to school.
한국어를 배우는데 아주 재미있어요. hangugeoreul baeuneunde aju jaemiisseoyo. = I'm learning Korean, and it's really fun.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 오늘 왜 이렇게 피곤해요? (Oneul wae ireoke pigonhaeyo?)</p>
<p><strong>B:</strong> 어제 잠을 못 잤기 때문에 피곤해요. (Eoje jameul mot jatgi ttaemune pigonhaeyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> Only 으니까 (not 아서/어서) can come before a command or suggestion, and it can carry tense (왔으니까). 기 때문에 is a strong, objective reason and is NOT used with commands.</div>`,
    `<span class="eyebrow">KRL212 · Bài 2</span>
<h2>Lý do &amp; tương phản nâng cao (으니까, 는데, 기 때문에)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>길이 막히다</td><td>giri makhida</td><td>tắc đường</td></tr>
<tr><td>피곤하다</td><td>pigonhada</td><td>mệt mỏi</td></tr>
<tr><td>감기</td><td>gamgi</td><td>bệnh cảm</td></tr>
<tr><td>걸리다</td><td>geollida</td><td>bị (cảm), mất (thời gian)</td></tr>
<tr><td>우산</td><td>usan</td><td>ô, dù</td></tr>
</tbody></table>
<h3>Ngữ pháp — vì (chủ quan), bối cảnh, vì (mạnh)</h3>
<ul>
<li><strong>V/A + -(으)니까</strong> = vì / bởi vì — dẫn được vào mệnh lệnh hoặc đề nghị: 비가 오니까 우산을 가져가세요.</li>
<li><strong>V + 는데 / A + -(으)ㄴ데</strong> = nêu bối cảnh hoặc tương phản nhẹ: 한국어를 배우는데 아주 재미있어요.</li>
<li><strong>N + 때문에 / V·A + 기 때문에</strong> = vì (mạnh, khách quan): 감기 때문에, 잠을 못 잤기 때문에.</li>
</ul>
<pre><code>길이 막히니까 지하철로 가요.  giri makhinikka jihacheollo gayo.   = Vì tắc đường nên mình đi tàu điện ngầm.
감기 때문에 학교에 못 갔어요. gamgi ttaemune hakgyo-e mot gasseoyo. = Vì bị cảm nên tôi không đi học được.
한국어를 배우는데 아주 재미있어요. hangugeoreul baeuneunde aju jaemiisseoyo. = Tôi đang học tiếng Hàn, mà rất thú vị.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 오늘 왜 이렇게 피곤해요? (Oneul wae ireoke pigonhaeyo?)</p>
<p><strong>B:</strong> 어제 잠을 못 잤기 때문에 피곤해요. (Eoje jameul mot jatgi ttaemune pigonhaeyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Chỉ 으니까 (không phải 아서/어서) dẫn được vào mệnh lệnh hay đề nghị, và mang được thì (왔으니까). 기 때문에 là lý do mạnh, khách quan và KHÔNG dùng với mệnh lệnh.</div>`,
  ]]);
const b2q = quiz('krl212-quiz-2', 'Quiz 2 — Advanced reasons|||Quiz 2 — Lý do & tương phản', [
  { id: 'q1', question: 'Which reason connector can be followed by a command/suggestion?|||Liên từ lý do nào có thể đi trước mệnh lệnh/đề nghị?', options: ['-아서/어서', '-(으)니까', '-기 때문에', '-는데'], correctIndex: 1, explanation: '-(으)니까 dùng được trước mệnh lệnh: 오니까 가세요. 아서/어서 thì không.' },
  { id: 'q2', question: '"감기 때문에 학교에 못 갔어요" means…|||"감기 때문에 학교에 못 갔어요" nghĩa là gì?', options: ['I went to school despite a cold|||Dù bị cảm tôi vẫn đi học', 'Because of a cold, I couldn\'t go to school|||Vì bị cảm nên tôi không đi học được', 'I caught a cold at school|||Tôi bị cảm ở trường', 'School was closed|||Trường đóng cửa'], correctIndex: 1, explanation: 'N + 때문에 = vì (lý do); 감기 때문에 = vì bị cảm.' },
  { id: 'q3', question: 'In "한국어를 배우는데…", the ending 는데 mainly gives…|||Trong "한국어를 배우는데…", đuôi 는데 chủ yếu để…', options: ['a command|||ra mệnh lệnh', 'background / soft contrast|||nêu bối cảnh / tương phản nhẹ', 'a wish|||một ước muốn', 'past tense|||thì quá khứ'], correctIndex: 1, explanation: '-는데/은데 nêu bối cảnh hoặc tương phản nhẹ trước mệnh đề sau.' },
]);

/* ── Bài 3 — Trải nghiệm & thử ──────────────────────────────────────────── */
const b3 = doc('krl212-3-1-experience', 'Lesson 3 — Experience & change|||Bài 3 — Trải nghiệm & thử',
  'Kinh nghiệm 아/어 본 적이 있다/없다, thay đổi do hoàn cảnh 게 되다 (ôn 아/어 보다).',
  [[
    `<span class="eyebrow">KRL212 · Lesson 3</span>
<h2>Experience &amp; change (아/어 본 적이 있다, 게 되다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>경험</td><td>gyeongheom</td><td>experience</td></tr>
<tr><td>외국</td><td>oeguk</td><td>foreign country</td></tr>
<tr><td>김치</td><td>gimchi</td><td>kimchi</td></tr>
<tr><td>처음</td><td>cheoeum</td><td>the first time</td></tr>
<tr><td>한 번도</td><td>han beondo</td><td>not even once</td></tr>
</tbody></table>
<h3>Grammar — have you ever…, end up / come to…</h3>
<ul>
<li><strong>V + 아/어 본 적이 있다/없다</strong> = have / have never done (experience): 가 본 적이 있어요, 먹어 본 적이 없어요.</li>
<li><strong>V + 게 되다</strong> = come to / end up (change by circumstance, not one's own will): 한국에서 살게 되었어요.</li>
<li>(review) <strong>V + 아/어 보다</strong> = try doing: 먹어 보다, 입어 보다.</li>
</ul>
<pre><code>한국 음식을 먹어 본 적이 있어요? hanguk eumsigeul meogeo bon jeog-i isseoyo? = Have you ever eaten Korean food?
아니요, 한 번도 먹어 본 적이 없어요. aniyo, han beondo meogeo bon jeog-i eopseoyo. = No, I've never eaten it, not once.
드라마를 보고 한국어를 좋아하게 되었어요. deuramareul bogo hangugeoreul joahage doeeosseoyo. = After watching dramas, I came to like Korean.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 김치를 만들어 본 적이 있어요? (Gimchireul mandeureo bon jeog-i isseoyo?)</p>
<p><strong>B:</strong> 네, 작년에 처음 만들어 봤어요. 그때부터 자주 만들게 됐어요. (Ne, jangnyeon-e cheoeum mandeureo bwasseoyo. Geuttaebuteo jaju mandeulge dwaesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 아/어 본 적이 있다 states an experience ("have ever…"), which is different from a plain past 았/었어요 (a single fact). 게 되다 stresses a change caused by circumstances, unlike 기로 하다 (your own decision).</div>`,
    `<span class="eyebrow">KRL212 · Bài 3</span>
<h2>Trải nghiệm &amp; thử (아/어 본 적이 있다, 게 되다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>경험</td><td>gyeongheom</td><td>kinh nghiệm, trải nghiệm</td></tr>
<tr><td>외국</td><td>oeguk</td><td>nước ngoài</td></tr>
<tr><td>김치</td><td>gimchi</td><td>kim chi</td></tr>
<tr><td>처음</td><td>cheoeum</td><td>lần đầu tiên</td></tr>
<tr><td>한 번도</td><td>han beondo</td><td>không một lần nào</td></tr>
</tbody></table>
<h3>Ngữ pháp — đã từng…, rốt cuộc / đâm ra…</h3>
<ul>
<li><strong>V + 아/어 본 적이 있다/없다</strong> = đã từng / chưa từng làm (kinh nghiệm): 가 본 적이 있어요, 먹어 본 적이 없어요.</li>
<li><strong>V + 게 되다</strong> = trở nên / rốt cuộc (thay đổi do hoàn cảnh, không do ý mình): 한국에서 살게 되었어요.</li>
<li>(ôn) <strong>V + 아/어 보다</strong> = thử làm: 먹어 보다, 입어 보다.</li>
</ul>
<pre><code>한국 음식을 먹어 본 적이 있어요? hanguk eumsigeul meogeo bon jeog-i isseoyo? = Bạn đã từng ăn món Hàn chưa?
아니요, 한 번도 먹어 본 적이 없어요. aniyo, han beondo meogeo bon jeog-i eopseoyo. = Không, tôi chưa ăn lần nào.
드라마를 보고 한국어를 좋아하게 되었어요. deuramareul bogo hangugeoreul joahage doeeosseoyo. = Xem phim xong tôi đâm ra thích tiếng Hàn.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 김치를 만들어 본 적이 있어요? (Gimchireul mandeureo bon jeog-i isseoyo?)</p>
<p><strong>B:</strong> 네, 작년에 처음 만들어 봤어요. 그때부터 자주 만들게 됐어요. (Ne, jangnyeon-e cheoeum mandeureo bwasseoyo. Geuttaebuteo jaju mandeulge dwaesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 아/어 본 적이 있다 nói về kinh nghiệm ("đã từng…"), khác với quá khứ đơn 았/었어요 (một sự việc đơn lẻ). 게 되다 nhấn thay đổi do hoàn cảnh, khác 기로 하다 (do chính mình quyết).</div>`,
  ]]);
const b3q = quiz('krl212-quiz-3', 'Quiz 3 — Experience & change|||Quiz 3 — Trải nghiệm & thử', [
  { id: 'q1', question: 'Which pattern asks "have you ever (done)?"|||Cấu trúc hỏi "đã từng làm chưa?" là?', options: ['-게 되다', '-아/어 본 적이 있다', '-으려고 하다', '-기로 하다'], correctIndex: 1, explanation: 'V + 아/어 본 적이 있다 = kinh nghiệm "đã từng"; 먹어 본 적이 있어요?' },
  { id: 'q2', question: '-게 되다 mainly expresses…|||-게 되다 chủ yếu diễn đạt gì?', options: ['a personal decision|||quyết định của bản thân', 'a change caused by circumstances|||thay đổi do hoàn cảnh', 'a command|||mệnh lệnh', 'a wish|||ước muốn'], correctIndex: 1, explanation: '게 되다 = rốt cuộc/đâm ra do hoàn cảnh, không do ý mình.' },
  { id: 'q3', question: '"먹어 본 적이 없어요" means…|||"먹어 본 적이 없어요" nghĩa là gì?', options: ['I ate it|||Tôi đã ăn nó', 'I have never eaten it|||Tôi chưa từng ăn nó', 'I want to eat it|||Tôi muốn ăn nó', 'I must eat it|||Tôi phải ăn nó'], correctIndex: 1, explanation: '본 적이 없다 = chưa từng; 먹어 본 적이 없어요 = chưa từng ăn.' },
]);

/* ── Bài 4 — Động từ bất quy tắc ────────────────────────────────────────── */
const b4 = doc('krl212-4-1-irregular-verbs', 'Lesson 4 — Irregular verbs|||Bài 4 — Động từ bất quy tắc',
  'Bốn bất quy tắc chính: ㅂ (덥다→더워요), ㄷ (듣다→들어요), ㄹ 탈락, 으 탈락.',
  [[
    `<span class="eyebrow">KRL212 · Lesson 4</span>
<h2>Irregular verbs (ㅂ, ㄷ, ㄹ 탈락, 으 탈락)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>덥다 / 춥다</td><td>deopda / chupda</td><td>to be hot / cold (weather)</td></tr>
<tr><td>맵다</td><td>maepda</td><td>to be spicy</td></tr>
<tr><td>듣다</td><td>deutda</td><td>to listen, hear</td></tr>
<tr><td>걷다</td><td>geotda</td><td>to walk</td></tr>
<tr><td>살다</td><td>salda</td><td>to live</td></tr>
</tbody></table>
<h3>Grammar — the four common irregulars</h3>
<ul>
<li><strong>ㅂ 불규칙</strong>: ㅂ → 우 before 아/어/으. 덥다 → 더워요, 춥다 → 추워요, 쉽다 → 쉬워요. (Exceptions 돕다 → 도와요, 곱다 → 고와요 use 오.)</li>
<li><strong>ㄷ 불규칙</strong>: ㄷ → ㄹ before a vowel. 듣다 → 들어요, 걷다 → 걸어요, 묻다 → 물어요. (닫다, 받다 are REGULAR.)</li>
<li><strong>ㄹ 탈락</strong>: ㄹ drops before ㄴ/ㅂ/ㅅ. 살다 → 삽니다, 사세요, 사는 사람; 만들다 → 만드세요.</li>
<li><strong>으 탈락</strong>: ㅡ drops before 아/어. 쓰다 → 써요, 아프다 → 아파요, 바쁘다 → 바빠요.</li>
</ul>
<pre><code>오늘 날씨가 너무 더워요.  oneul nalssiga neomu deowoyo. = The weather is too hot today. (ㅂ)
저는 음악을 자주 들어요.  jeoneun eumageul jaju deureoyo. = I often listen to music. (ㄷ)
어디에 사세요?           eodie saseyo?                  = Where do you live? (ㄹ 탈락)
편지를 써요.             pyeonjireul sseoyo.            = I write a letter. (으 탈락)</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 한국어가 어려워요? (Hangugeoga eoryeowoyo?)</p>
<p><strong>B:</strong> 조금 어렵지만 재미있어요. 매일 라디오를 들어요. (Jogeum eoryeopjiman jaemiisseoyo. Maeil radioreul deureoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> Not every ㅂ/ㄷ verb is irregular — 닫다, 받다, 좁다 are REGULAR, so learn each verb. ㅂ → 우 and ㄷ → ㄹ apply only BEFORE a vowel; before a consonant (지만, 고) the stem is unchanged: 어렵고, 듣고.</div>`,
    `<span class="eyebrow">KRL212 · Bài 4</span>
<h2>Động từ bất quy tắc (ㅂ, ㄷ, ㄹ 탈락, 으 탈락)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>덥다 / 춥다</td><td>deopda / chupda</td><td>nóng / lạnh (thời tiết)</td></tr>
<tr><td>맵다</td><td>maepda</td><td>cay</td></tr>
<tr><td>듣다</td><td>deutda</td><td>nghe</td></tr>
<tr><td>걷다</td><td>geotda</td><td>đi bộ</td></tr>
<tr><td>살다</td><td>salda</td><td>sống</td></tr>
</tbody></table>
<h3>Ngữ pháp — bốn bất quy tắc thường gặp</h3>
<ul>
<li><strong>ㅂ 불규칙</strong>: ㅂ → 우 trước 아/어/으. 덥다 → 더워요, 춥다 → 추워요, 쉽다 → 쉬워요. (Ngoại lệ 돕다 → 도와요, 곱다 → 고와요 dùng 오.)</li>
<li><strong>ㄷ 불규칙</strong>: ㄷ → ㄹ trước nguyên âm. 듣다 → 들어요, 걷다 → 걸어요, 묻다 → 물어요. (닫다, 받다 là QUY TẮC.)</li>
<li><strong>ㄹ 탈락</strong>: ㄹ rụng trước ㄴ/ㅂ/ㅅ. 살다 → 삽니다, 사세요, 사는 사람; 만들다 → 만드세요.</li>
<li><strong>으 탈락</strong>: ㅡ rụng trước 아/어. 쓰다 → 써요, 아프다 → 아파요, 바쁘다 → 바빠요.</li>
</ul>
<pre><code>오늘 날씨가 너무 더워요.  oneul nalssiga neomu deowoyo. = Hôm nay trời nóng quá. (ㅂ)
저는 음악을 자주 들어요.  jeoneun eumageul jaju deureoyo. = Tôi hay nghe nhạc. (ㄷ)
어디에 사세요?           eodie saseyo?                  = Bạn sống ở đâu? (ㄹ 탈락)
편지를 써요.             pyeonjireul sseoyo.            = Tôi viết thư. (으 탈락)</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 한국어가 어려워요? (Hangugeoga eoryeowoyo?)</p>
<p><strong>B:</strong> 조금 어렵지만 재미있어요. 매일 라디오를 들어요. (Jogeum eoryeopjiman jaemiisseoyo. Maeil radioreul deureoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Không phải động từ ㅂ/ㄷ nào cũng bất quy tắc — 닫다, 받다, 좁다 là QUY TẮC, nên phải nhớ theo từng từ. ㅂ → 우 và ㄷ → ㄹ chỉ áp dụng TRƯỚC nguyên âm; trước phụ âm (지만, 고) gốc giữ nguyên: 어렵고, 듣고.</div>`,
  ]]);
const b4q = quiz('krl212-quiz-4', 'Quiz 4 — Irregular verbs|||Quiz 4 — Động từ bất quy tắc', [
  { id: 'q1', question: '덥다 (hot) + 어요 becomes…|||덥다 (nóng) + 어요 thành…', options: ['덥어요', '더어요', '더워요', '덥워요'], correctIndex: 2, explanation: 'ㅂ 불규칙: ㅂ → 우, 덥 + 어요 → 더워요.' },
  { id: 'q2', question: '듣다 (to listen) + 어요 becomes…|||듣다 (nghe) + 어요 thành…', options: ['듣어요', '들어요', '듣워요', '드러요'], correctIndex: 1, explanation: 'ㄷ 불규칙: ㄷ → ㄹ trước nguyên âm, 듣 + 어요 → 들어요.' },
  { id: 'q3', question: 'Which change is the 으-dropping (으 탈락)?|||Biến đổi nào là 으 탈락?', options: ['살다 → 삽니다', '듣다 → 들어요', '바쁘다 → 바빠요', '덥다 → 더워요'], correctIndex: 2, explanation: '으 탈락: ㅡ rụng trước 아/어; 바쁘 + 아요 → 바빠요.' },
]);

/* ── Bài 5 — Trích dẫn gián tiếp ────────────────────────────────────────── */
const b5 = doc('krl212-5-1-indirect-quotation', 'Lesson 5 — Indirect quotation|||Bài 5 — Trích dẫn gián tiếp',
  'Thuật lại: trần thuật 다고 하다, câu hỏi 냐고, mệnh lệnh 라고, rủ rê 자고 하다.',
  [[
    `<span class="eyebrow">KRL212 · Lesson 5</span>
<h2>Indirect quotation (다고 하다, 냐고/자고/라고 하다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>말하다</td><td>malhada</td><td>to say, speak</td></tr>
<tr><td>소식</td><td>sosik</td><td>news, word</td></tr>
<tr><td>준비하다</td><td>junbihada</td><td>to prepare</td></tr>
<tr><td>도착하다</td><td>dochakhada</td><td>to arrive</td></tr>
<tr><td>먼저</td><td>meonjeo</td><td>first, ahead</td></tr>
</tbody></table>
<h3>Grammar — reporting statements, questions, commands, suggestions</h3>
<ul>
<li><strong>Statement</strong>: V + 는/ㄴ다고 하다, A + 다고 하다, N + (이)라고 하다: 간다고 해요, 좋다고 해요, 학생이라고 해요. Past → 았/었다고 하다.</li>
<li><strong>Question</strong>: V/A + (느)냐고 하다: 언제 오냐고 물어봤어요.</li>
<li><strong>Command</strong>: V + (으)라고 하다: 빨리 오라고 했어요.</li>
<li><strong>Suggestion</strong>: V + 자고 하다: 같이 가자고 했어요.</li>
</ul>
<pre><code>친구가 내일 온다고 했어요.   chinguga naeil ondago haesseoyo.   = My friend said he'll come tomorrow.
선생님이 숙제를 하라고 하셨어요. seonsaengnim-i sukjereul harago hasyeosseoyo. = The teacher told us to do homework.
친구가 같이 밥을 먹자고 했어요. chinguga gachi babeul meokjago haesseoyo.  = My friend suggested eating together.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 민수 씨가 뭐라고 했어요? (Minsu ssiga mworago haesseoyo?)</p>
<p><strong>B:</strong> 오늘은 바쁘다고 했어요. 먼저 시작하라고 했어요. (Oneureun bappeudago haesseoyo. Meonjeo sijakharago haesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> Present-tense verbs add 는다/ㄴ다 (먹는다고/간다고), but adjectives take only 다고 (좋다고). Questions use 냐고, commands 라고, suggestions 자고. The past is always 았/었다고 regardless of word type.</div>`,
    `<span class="eyebrow">KRL212 · Bài 5</span>
<h2>Trích dẫn gián tiếp (다고 하다, 냐고/자고/라고 하다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>말하다</td><td>malhada</td><td>nói</td></tr>
<tr><td>소식</td><td>sosik</td><td>tin tức</td></tr>
<tr><td>준비하다</td><td>junbihada</td><td>chuẩn bị</td></tr>
<tr><td>도착하다</td><td>dochakhada</td><td>đến nơi</td></tr>
<tr><td>먼저</td><td>meonjeo</td><td>trước, trước tiên</td></tr>
</tbody></table>
<h3>Ngữ pháp — thuật lại trần thuật, câu hỏi, mệnh lệnh, rủ rê</h3>
<ul>
<li><strong>Trần thuật</strong>: V + 는/ㄴ다고 하다, A + 다고 하다, N + (이)라고 하다: 간다고 해요, 좋다고 해요, 학생이라고 해요. Quá khứ → 았/었다고 하다.</li>
<li><strong>Câu hỏi</strong>: V/A + (느)냐고 하다: 언제 오냐고 물어봤어요.</li>
<li><strong>Mệnh lệnh</strong>: V + (으)라고 하다: 빨리 오라고 했어요.</li>
<li><strong>Rủ rê</strong>: V + 자고 하다: 같이 가자고 했어요.</li>
</ul>
<pre><code>친구가 내일 온다고 했어요.   chinguga naeil ondago haesseoyo.   = Bạn tôi nói ngày mai sẽ đến.
선생님이 숙제를 하라고 하셨어요. seonsaengnim-i sukjereul harago hasyeosseoyo. = Thầy bảo chúng tôi làm bài tập.
친구가 같이 밥을 먹자고 했어요. chinguga gachi babeul meokjago haesseoyo.  = Bạn rủ cùng đi ăn cơm.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 민수 씨가 뭐라고 했어요? (Minsu ssiga mworago haesseoyo?)</p>
<p><strong>B:</strong> 오늘은 바쁘다고 했어요. 먼저 시작하라고 했어요. (Oneureun bappeudago haesseoyo. Meonjeo sijakharago haesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Động từ hiện tại thêm 는다/ㄴ다 (먹는다고/간다고), nhưng tính từ chỉ lấy 다고 (좋다고). Câu hỏi dùng 냐고, mệnh lệnh 라고, rủ rê 자고. Quá khứ luôn là 았/었다고 bất kể loại từ.</div>`,
  ]]);
const b5q = quiz('krl212-quiz-5', 'Quiz 5 — Indirect quotation|||Quiz 5 — Trích dẫn gián tiếp', [
  { id: 'q1', question: 'To report a COMMAND, you use…|||Để thuật lại một MỆNH LỆNH, dùng…', options: ['-다고 하다', '-(으)라고 하다', '-자고 하다', '-냐고 하다'], correctIndex: 1, explanation: 'Mệnh lệnh gián tiếp = V + (으)라고 하다: 오라고 했어요.' },
  { id: 'q2', question: 'To report "let\'s…", you use…|||Để thuật lại "nào cùng…", dùng…', options: ['-자고 하다', '-라고 하다', '-냐고 하다', '-다고 하다'], correctIndex: 0, explanation: 'Rủ rê gián tiếp = V + 자고 하다: 가자고 했어요.' },
  { id: 'q3', question: 'For a noun statement (e.g. "he is a student"), the ending is…|||Với câu trần thuật danh từ (vd "cậu ấy là học sinh"), đuôi là…', options: ['-는다고', '-(이)라고', '-냐고', '-자고'], correctIndex: 1, explanation: 'N + (이)라고 하다: 학생이라고 했어요.' },
]);

/* ── Bài 6 — Trạng từ & mức độ ──────────────────────────────────────────── */
const b6 = doc('krl212-6-1-adverbs-degree', 'Lesson 6 — Adverbs & degree|||Bài 6 — Trạng từ & mức độ',
  'Trạng từ hoá 게, so sánh 처럼 (như) và 만큼 (bằng mức), phỏng đoán lý do 아/어서 그런지.',
  [[
    `<span class="eyebrow">KRL212 · Lesson 6</span>
<h2>Adverbs &amp; degree (게, 처럼, 만큼)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>가수</td><td>gasu</td><td>singer</td></tr>
<tr><td>어른</td><td>eoreun</td><td>adult, grown-up</td></tr>
<tr><td>글씨</td><td>geulssi</td><td>handwriting</td></tr>
<tr><td>깨끗하다</td><td>kkaekkeuthada</td><td>to be clean</td></tr>
<tr><td>복잡하다</td><td>bokjaphada</td><td>to be crowded, complicated</td></tr>
</tbody></table>
<h3>Grammar — adverb form, like/as, as much as, maybe because</h3>
<ul>
<li><strong>A + 게</strong> = turns an adjective into an adverb: 크다 → 크게, 조용하다 → 조용하게, 맛있다 → 맛있게. 방을 깨끗하게 청소해요.</li>
<li><strong>N + 처럼</strong> = like / as: 가수처럼 노래를 잘해요.</li>
<li><strong>N + 만큼</strong> = as much as / to the extent of: 저도 형만큼 키가 커요.</li>
<li><strong>V/A + 아/어서 그런지</strong> = maybe because: 비가 와서 그런지 좀 추워요.</li>
</ul>
<pre><code>글씨를 예쁘게 써요.        geulssireul yeppeuge sseoyo.        = (Someone) writes neatly.
동생이 어른처럼 말해요.    dongsaeng-i eoreuncheoreom malhaeyo. = My sibling talks like an adult.
비가 와서 그런지 좀 추워요. biga waseo geureonji jom chuwoyo.   = Maybe because it rained, it's a bit cold.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 한국어를 정말 잘하네요! (Hangugeoreul jeongmal jalhaneyo!)</p>
<p><strong>B:</strong> 아니에요. 열심히 공부해서 그런지 조금 늘었어요. (Anieyo. Yeolsimhi gongbuhaeseo geureonji jogeum neureosseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 게 attaches to an adjective stem (하다 → 하게), unlike fixed adverbs (빨리, 천천히). 처럼 = "just like", 만큼 = "to the same degree". 아/어서 그런지 guesses at a reason (not certain).</div>`,
    `<span class="eyebrow">KRL212 · Bài 6</span>
<h2>Trạng từ &amp; mức độ (게, 처럼, 만큼)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>가수</td><td>gasu</td><td>ca sĩ</td></tr>
<tr><td>어른</td><td>eoreun</td><td>người lớn</td></tr>
<tr><td>글씨</td><td>geulssi</td><td>chữ viết</td></tr>
<tr><td>깨끗하다</td><td>kkaekkeuthada</td><td>sạch sẽ</td></tr>
<tr><td>복잡하다</td><td>bokjaphada</td><td>đông đúc, phức tạp</td></tr>
</tbody></table>
<h3>Ngữ pháp — trạng từ hoá, như, bằng mức, chắc tại</h3>
<ul>
<li><strong>A + 게</strong> = biến tính từ thành trạng từ: 크다 → 크게, 조용하다 → 조용하게, 맛있다 → 맛있게. 방을 깨끗하게 청소해요.</li>
<li><strong>N + 처럼</strong> = như / giống: 가수처럼 노래를 잘해요.</li>
<li><strong>N + 만큼</strong> = bằng / tới mức: 저도 형만큼 키가 커요.</li>
<li><strong>V/A + 아/어서 그런지</strong> = chắc tại / có lẽ vì: 비가 와서 그런지 좀 추워요.</li>
</ul>
<pre><code>글씨를 예쁘게 써요.        geulssireul yeppeuge sseoyo.        = (Ai đó) viết chữ đẹp.
동생이 어른처럼 말해요.    dongsaeng-i eoreuncheoreom malhaeyo. = Em tôi nói năng như người lớn.
비가 와서 그런지 좀 추워요. biga waseo geureonji jom chuwoyo.   = Chắc tại mưa nên hơi lạnh.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 한국어를 정말 잘하네요! (Hangugeoreul jeongmal jalhaneyo!)</p>
<p><strong>B:</strong> 아니에요. 열심히 공부해서 그런지 조금 늘었어요. (Anieyo. Yeolsimhi gongbuhaeseo geureonji jogeum neureosseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 게 gắn vào gốc tính từ (하다 → 하게), khác các trạng từ có sẵn (빨리, 천천히). 처럼 = "giống như", 만큼 = "bằng mức". 아/어서 그런지 là phỏng đoán lý do (không chắc chắn).</div>`,
  ]]);
const b6q = quiz('krl212-quiz-6', 'Quiz 6 — Adverbs & degree|||Quiz 6 — Trạng từ & mức độ', [
  { id: 'q1', question: 'The adverb form of 조용하다 (quiet) is…|||Dạng trạng từ của 조용하다 (yên tĩnh) là…', options: ['조용히다', '조용하게', '조용처럼', '조용만큼'], correctIndex: 1, explanation: 'A + 게 → trạng từ: 조용하다 → 조용하게.' },
  { id: 'q2', question: '"가수처럼 노래해요" — 처럼 means…|||"가수처럼 노래해요" — 처럼 nghĩa là?', options: ['as much as|||bằng mức', 'like / as|||như / giống', 'because|||vì', 'more than|||hơn'], correctIndex: 1, explanation: 'N + 처럼 = như/giống; 가수처럼 = như ca sĩ.' },
  { id: 'q3', question: '아/어서 그런지 adds the nuance of…|||아/어서 그런지 thêm sắc thái gì?', options: ['a certain fact|||sự thật chắc chắn', 'maybe because (a guessed reason)|||chắc tại (lý do phỏng đoán)', 'a command|||mệnh lệnh', 'a wish|||ước muốn'], correctIndex: 1, explanation: '아/어서 그런지 = chắc tại/có lẽ vì — phỏng đoán, không chắc.' },
]);

/* ── Bài 7 — Điều kiện & giả định ───────────────────────────────────────── */
const b7 = doc('krl212-7-1-condition-wish', 'Lesson 7 — Conditions & wishes|||Bài 7 — Điều kiện & giả định',
  'Ôn sâu điều kiện 으면, ước muốn 았/었으면 좋겠다, bổn phận 아/어야 하다/되다.',
  [[
    `<span class="eyebrow">KRL212 · Lesson 7</span>
<h2>Conditions &amp; wishes (으면, 았/었으면 좋겠다, 아/어야 하다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>시험</td><td>siheom</td><td>exam, test</td></tr>
<tr><td>합격하다</td><td>hapgyeokhada</td><td>to pass (an exam)</td></tr>
<tr><td>건강</td><td>geongang</td><td>health</td></tr>
<tr><td>내다</td><td>naeda</td><td>to submit, hand in</td></tr>
<tr><td>꼭</td><td>kkok</td><td>surely, without fail</td></tr>
</tbody></table>
<h3>Grammar — if, I wish, must</h3>
<ul>
<li><strong>V/A + -(으)면</strong> (review) = if: 열심히 공부하면 합격할 거예요.</li>
<li><strong>V/A + 았/었으면 좋겠다</strong> = I wish / I hope: 시험에 합격했으면 좋겠어요; 건강했으면 좋겠어요.</li>
<li><strong>V + 아/어야 하다(되다)</strong> = must, have to: 지금 가야 해요; 매일 운동해야 돼요.</li>
</ul>
<pre><code>열심히 공부하면 시험에 합격할 거예요. yeolsimhi gongbuhamyeon siheome hapgyeokhal geoyeyo. = If you study hard, you'll pass the exam.
건강했으면 좋겠어요.       geonganghaesseumyeon jokesseoyo. = I hope (you/I) stay healthy.
내일까지 숙제를 내야 해요. naeilkkaji sukjereul naeya haeyo. = I have to hand in the homework by tomorrow.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 시험이 곧 있는데 걱정이에요. (Siheom-i got inneunde geokjeongieyo.)</p>
<p><strong>B:</strong> 매일 조금씩 공부해야 해요. 꼭 합격했으면 좋겠어요. (Maeil jogeumssik gongbuhaeya haeyo. Kkok hapgyeokhaesseumyeon jokesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 았/었으면 좋겠다 uses the PAST form (았/었) even for a present or future wish — it's a hypothetical, not a real past. 아/어야 하다 and 아/어야 되다 mean the same; 되다 sounds more colloquial in speech.</div>`,
    `<span class="eyebrow">KRL212 · Bài 7</span>
<h2>Điều kiện &amp; giả định (으면, 았/었으면 좋겠다, 아/어야 하다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>시험</td><td>siheom</td><td>kỳ thi, bài kiểm tra</td></tr>
<tr><td>합격하다</td><td>hapgyeokhada</td><td>đỗ, đậu (kỳ thi)</td></tr>
<tr><td>건강</td><td>geongang</td><td>sức khỏe</td></tr>
<tr><td>내다</td><td>naeda</td><td>nộp</td></tr>
<tr><td>꼭</td><td>kkok</td><td>nhất định, chắc chắn</td></tr>
</tbody></table>
<h3>Ngữ pháp — nếu, ước gì, phải</h3>
<ul>
<li><strong>V/A + -(으)면</strong> (ôn) = nếu: 열심히 공부하면 합격할 거예요.</li>
<li><strong>V/A + 았/었으면 좋겠다</strong> = ước gì / mong: 시험에 합격했으면 좋겠어요; 건강했으면 좋겠어요.</li>
<li><strong>V + 아/어야 하다(되다)</strong> = phải: 지금 가야 해요; 매일 운동해야 돼요.</li>
</ul>
<pre><code>열심히 공부하면 시험에 합격할 거예요. yeolsimhi gongbuhamyeon siheome hapgyeokhal geoyeyo. = Nếu học chăm sẽ đỗ kỳ thi.
건강했으면 좋겠어요.       geonganghaesseumyeon jokesseoyo. = Mong (bạn/tôi) luôn khỏe mạnh.
내일까지 숙제를 내야 해요. naeilkkaji sukjereul naeya haeyo. = Tôi phải nộp bài tập trước ngày mai.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 시험이 곧 있는데 걱정이에요. (Siheom-i got inneunde geokjeongieyo.)</p>
<p><strong>B:</strong> 매일 조금씩 공부해야 해요. 꼭 합격했으면 좋겠어요. (Maeil jogeumssik gongbuhaeya haeyo. Kkok hapgyeokhaesseumyeon jokesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 았/었으면 좋겠다 dùng dạng QUÁ KHỨ (았/었) dù nói về ước muốn hiện tại hay tương lai — đây là giả định, không phải quá khứ thật. 아/어야 하다 và 아/어야 되다 nghĩa như nhau; 되다 nghe thân mật hơn khi nói.</div>`,
  ]]);
const b7q = quiz('krl212-quiz-7', 'Quiz 7 — Conditions & wishes|||Quiz 7 — Điều kiện & giả định', [
  { id: 'q1', question: '"I have to go now" is…|||"Bây giờ tôi phải đi" là…', options: ['지금 가면 돼요', '지금 가야 해요', '지금 갈 것 같아요', '지금 가려고 해요'], correctIndex: 1, explanation: 'V + 아/어야 하다 = phải; 가야 해요 = phải đi.' },
  { id: 'q2', question: 'The wish pattern 좋겠다 combines with which verb form?|||Cấu trúc ước muốn 좋겠다 đi với dạng động từ nào?', options: ['present -는다', 'past -았/었으면', 'future -을', 'command -(으)세요'], correctIndex: 1, explanation: '았/었으면 좋겠다 dùng dạng quá khứ (giả định), dù nói về hiện tại/tương lai.' },
  { id: 'q3', question: '"합격했으면 좋겠어요" means…|||"합격했으면 좋겠어요" nghĩa là gì?', options: ['I passed the exam|||Tôi đã đỗ kỳ thi', 'I hope (I) pass|||Mong (tôi) đỗ', 'I must pass|||Tôi phải đỗ', 'I will pass|||Tôi sẽ đỗ'], correctIndex: 1, explanation: '았/었으면 좋겠다 = ước/mong; 합격했으면 좋겠어요 = mong được đỗ.' },
]);

/* ── Bài 8 — Định ngữ thời & danh từ hoá ────────────────────────────────── */
const b8 = doc('krl212-8-1-modifiers-nominalization', 'Lesson 8 — Tense modifiers & nominalization|||Bài 8 — Định ngữ thời & danh từ hoá',
  'Định ngữ hồi tưởng 던/았던, danh từ hoá 기 và 는 것, hành động đang giữa chừng 는 중이다.',
  [[
    `<span class="eyebrow">KRL212 · Lesson 8</span>
<h2>Tense modifiers &amp; nominalization (던/았던, 기/는 것, 는 중이다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>식당</td><td>sikdang</td><td>restaurant, eatery</td></tr>
<tr><td>예전</td><td>yejeon</td><td>the old days, before</td></tr>
<tr><td>취미</td><td>chwimi</td><td>hobby</td></tr>
<tr><td>수영</td><td>suyeong</td><td>swimming</td></tr>
<tr><td>그리다</td><td>geurida</td><td>to draw</td></tr>
</tbody></table>
<h3>Grammar — retrospective modifier, nominalization, in the middle of</h3>
<ul>
<li><strong>V/A + 던 / 았(었)던</strong> = retrospective modifier (used to / recalled): 자주 가던 식당, 어제 만났던 사람.</li>
<li><strong>Nominalizer V + 기</strong> = the act of (often after 좋아하다/싫어하다/시작하다): 저는 수영하기를 좋아해요.</li>
<li><strong>V + 는 것</strong> = the fact / act of: 한국어를 배우는 것이 재미있어요.</li>
<li><strong>V + 는 중이다</strong> = to be in the middle of: 지금 숙제를 하는 중이에요.</li>
</ul>
<pre><code>예전에 자주 가던 식당이에요.  yejeon-e jaju gadeon sikdangieyo.        = It's the restaurant I often went to before.
저는 수영하기를 좋아해요.     jeoneun suyeonghagireul joahaeyo.        = I like swimming.
한국어를 배우는 것이 재미있어요. hangugeoreul baeuneun geosi jaemiisseoyo. = Learning Korean is fun.
지금 숙제를 하는 중이에요.    jigeum sukjereul haneun jung-ieyo.       = I'm in the middle of homework now.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 취미가 뭐예요? (Chwimiga mwoyeyo?)</p>
<p><strong>B:</strong> 저는 그림 그리기를 좋아해요. 지금도 그림을 그리는 중이에요. (Jeoneun geurim geurigireul joahaeyo. Jigeumdo geurimeul geurineun jung-ieyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 던 recalls a past habit or ongoing state (자주 가던), while 았던 stresses a completed, recalled action (한 번 갔던). Nominalizer 기 makes "the act of" (often after 좋아하다), while 는 것 is more flexible as a subject/object. 는 중이다 works only with action verbs.</div>`,
    `<span class="eyebrow">KRL212 · Bài 8</span>
<h2>Định ngữ thời &amp; danh từ hoá (던/았던, 기/는 것, 는 중이다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>식당</td><td>sikdang</td><td>quán ăn, nhà hàng</td></tr>
<tr><td>예전</td><td>yejeon</td><td>trước kia, hồi xưa</td></tr>
<tr><td>취미</td><td>chwimi</td><td>sở thích</td></tr>
<tr><td>수영</td><td>suyeong</td><td>bơi lội</td></tr>
<tr><td>그리다</td><td>geurida</td><td>vẽ</td></tr>
</tbody></table>
<h3>Ngữ pháp — định ngữ hồi tưởng, danh từ hoá, đang giữa chừng</h3>
<ul>
<li><strong>V/A + 던 / 았(었)던</strong> = định ngữ hồi tưởng (từng / nhớ lại): 자주 가던 식당, 어제 만났던 사람.</li>
<li><strong>Danh từ hoá V + 기</strong> = việc làm gì (thường sau 좋아하다/싫어하다/시작하다): 저는 수영하기를 좋아해요.</li>
<li><strong>V + 는 것</strong> = việc / điều: 한국어를 배우는 것이 재미있어요.</li>
<li><strong>V + 는 중이다</strong> = đang giữa chừng: 지금 숙제를 하는 중이에요.</li>
</ul>
<pre><code>예전에 자주 가던 식당이에요.  yejeon-e jaju gadeon sikdangieyo.        = Đây là quán ăn hồi xưa hay lui tới.
저는 수영하기를 좋아해요.     jeoneun suyeonghagireul joahaeyo.        = Tôi thích bơi.
한국어를 배우는 것이 재미있어요. hangugeoreul baeuneun geosi jaemiisseoyo. = Việc học tiếng Hàn rất thú vị.
지금 숙제를 하는 중이에요.    jigeum sukjereul haneun jung-ieyo.       = Bây giờ tôi đang làm bài tập.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 취미가 뭐예요? (Chwimiga mwoyeyo?)</p>
<p><strong>B:</strong> 저는 그림 그리기를 좋아해요. 지금도 그림을 그리는 중이에요. (Jeoneun geurim geurigireul joahaeyo. Jigeumdo geurimeul geurineun jung-ieyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 던 gợi thói quen hay trạng thái tiếp diễn trong quá khứ (자주 가던), còn 았던 nhấn việc đã hoàn tất và nhớ lại (한 번 갔던). Danh từ hoá 기 tạo "việc làm gì" (thường sau 좋아하다), còn 는 것 linh hoạt hơn khi làm chủ ngữ/tân ngữ. 는 중이다 chỉ dùng với động từ hành động.</div>`,
  ]]);
const b8q = quiz('krl212-quiz-8', 'Quiz 8 — Modifiers & nominalization|||Quiz 8 — Định ngữ & danh từ hoá', [
  { id: 'q1', question: 'Which ending is the retrospective modifier ("used to / recalled")?|||Đuôi nào là định ngữ hồi tưởng ("từng / nhớ lại")?', options: ['-는', '-던', '-을', '-기'], correctIndex: 1, explanation: 'V/A + 던 gợi hồi tưởng: 자주 가던 식당 = quán hồi xưa hay đến.' },
  { id: 'q2', question: '"숙제를 하는 중이에요" means…|||"숙제를 하는 중이에요" nghĩa là gì?', options: ['I will do homework|||Tôi sẽ làm bài tập', 'I finished homework|||Tôi làm xong bài tập', 'I\'m in the middle of homework|||Tôi đang giữa chừng làm bài tập', 'I hate homework|||Tôi ghét bài tập'], correctIndex: 2, explanation: 'V + 는 중이다 = đang giữa chừng làm; 하는 중이에요 = đang làm dở.' },
  { id: 'q3', question: 'In "책 읽기를 좋아해요", 읽기 is nominalized with…|||Trong "책 읽기를 좋아해요", 읽기 được danh từ hoá bằng…', options: ['-는 것', '-기', '-던', '-게'], correctIndex: 1, explanation: 'Danh từ hoá bằng -기: 읽기 = việc đọc; thường đi với 좋아하다.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'KRL212',
    slug: 'krl212-elementary-korean-3',
    title: 'Elementary Korean 3',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KRL212.webp',
    shortDescription: 'Elementary Korean 3, following KRL122: plans (으려고 하다), advanced reasons (으니까), experience (아/어 본 적이 있다), the irregular verbs (ㅂ/ㄷ/ㄹ/으), indirect quotation (다고 하다), adverbs (처럼), wishes (았으면 좋겠다), retrospective modifiers. Korean-Vietnamese, TOPIK I to II.|||Tiếng Hàn sơ cấp 3, nối tiếp KRL122: kế hoạch (으려고 하다), lý do (으니까), trải nghiệm (본 적이 있다), bất quy tắc (ㅂ/ㄷ/ㄹ/으), trích dẫn gián tiếp (다고 하다), trạng từ (처럼), giả định (았으면 좋겠다), danh từ hoá. Hàn-Việt, TOPIK I lên II.',
    description: 'Môn <strong>KRL212 — Elementary Korean 3</strong> (Tiếng Hàn sơ cấp 3, Kỳ 3, ngành Ngôn ngữ Hàn) nối tiếp <strong>KRL122</strong>. Từ nền kế hoạch, lý do, khả năng và định ngữ động từ, môn này mở rộng: <strong>kế hoạch &amp; ý định</strong> (으려고 하다, 기로 하다, 을 것 같다) → <strong>lý do &amp; tương phản nâng cao</strong> (으니까, 는데, 기 때문에) → <strong>trải nghiệm &amp; thử</strong> (아/어 본 적이 있다, 게 되다) → <strong>động từ bất quy tắc</strong> (ㅂ, ㄷ, ㄹ 탈락, 으 탈락) → <strong>trích dẫn gián tiếp</strong> (다고/냐고/자고/라고 하다) → <strong>trạng từ &amp; mức độ</strong> (게, 처럼, 만큼) → <strong>điều kiện &amp; giả định</strong> (으면, 았/었으면 좋겠다, 아/어야 하다) → <strong>định ngữ thời &amp; danh từ hoá</strong> (던/았던, 기/는 것, 는 중이다). Bám giáo trình Sejong Korean 2-3 / Ewha, song ngữ Hàn-Việt, có bảng từ vựng, ngữ pháp, hội thoại và quiz mỗi bài. Trình độ TOPIK I cuối lên TOPIK II đầu.',
    whatYouLearn: 'Nói ý định 으려고 하다, quyết định 기로 하다, phỏng đoán 을 것 같다; nêu lý do bằng 으니까 (dùng được với mệnh lệnh) và 기 때문에, dùng 는데 nêu bối cảnh; kể trải nghiệm 아/어 본 적이 있다/없다 và thay đổi 게 되다; chia bốn bất quy tắc ㅂ (덥다→더워요), ㄷ (듣다→들어요), ㄹ 탈락 và 으 탈락; thuật lại lời người khác 다고/냐고/자고/라고 하다; tạo trạng từ 게, so sánh 처럼·만큼, phỏng đoán 아/어서 그런지; đặt điều kiện 으면, diễn đạt ước muốn 았/었으면 좋겠다 và bổn phận 아/어야 하다; và dùng định ngữ hồi tưởng 던/았던, danh từ hoá 기·는 것, hành động tiếp diễn 는 중이다.',
    requirements: 'Đã học xong KRL122 (Elementary Korean 2) hoặc tương đương: dùng được thì tương lai 을 거예요, mong muốn 고 싶다, lý do 아서/어서, khả năng 을 수 있다, định ngữ động từ 는/은/을 và kính ngữ 으시다. Cần luyện nói hội thoại thành tiếng mỗi ngày.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Sejong 2-3/Ewha, từ điển Naver, app, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp KRL122, mục tiêu TOPIK I→II, bản đồ 8 bài.', lessons: [intro] },
    { title: 'Bài 1 — Kế hoạch & ý định|||Lesson 1 — Plans & intentions', description: '으려고 하다, 기로 하다, 을 것 같다.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Lý do & tương phản nâng cao|||Lesson 2 — Advanced reasons', description: '으니까, 는데, 기 때문에.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Trải nghiệm & thử|||Lesson 3 — Experience & change', description: '아/어 본 적이 있다, 게 되다.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Động từ bất quy tắc|||Lesson 4 — Irregular verbs', description: 'ㅂ, ㄷ, ㄹ 탈락, 으 탈락.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Trích dẫn gián tiếp|||Lesson 5 — Indirect quotation', description: '다고/냐고/자고/라고 하다.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Trạng từ & mức độ|||Lesson 6 — Adverbs & degree', description: '게, 처럼, 만큼, 아/어서 그런지.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Điều kiện & giả định|||Lesson 7 — Conditions & wishes', description: '으면, 았/었으면 좋겠다, 아/어야 하다.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Định ngữ thời & danh từ hoá|||Lesson 8 — Modifiers & nominalization', description: '던/았던, 기/는 것, 는 중이다.', lessons: [b8, b8q] },
  ],
};
