/**
 * KRL122 — Elementary Korean 2 (Tiếng Hàn sơ cấp 2). Khối Ngôn ngữ Hàn FPTU, Kỳ 2.
 * NỐI TIẾP KRL112 — Elementary Korean 1. Giáo trình chuẩn: 세종한국어 Sejong Korean 1
 * (nửa sau) → Sejong Korean 2 / Ewha Korean; trình độ TOPIK I sơ cấp.
 * MÔN NGÔN NGỮ — mỗi bài: từ vựng, ngữ pháp + mẫu câu (chú ý chia đuôi), hội thoại,
 * ghi chú. Hangul + Revised Romanization + nghĩa tiếng Việt.
 * bi(e,v): e = trình bày Hàn+Anh, v = giải thích tiếng Việt.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 300, questions } });

/* ── Tài liệu ────────────────────────────────────────────────────────────── */
const taiLieu = doc('krl122-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình Sejong Korean 1-2 / Ewha, app TOPIK ONE / Anki, Naver dictionary, YouTube, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">KRL122 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need for <strong>Elementary Korean 2</strong> — building on the Hangul, particles and present tense from <strong>KRL112</strong> toward tenses, wanting, ability, verb modifiers, comparison, conditions and honorifics — in one place. The official FPTU giáo trình &amp; slides live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbooks</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 1 (second half) → 2</em> — King Sejong Institute (free PDF &amp; audio)</a></li>
<li><em>Ewha Korean 1-2</em> — Ewha Womans University Press</li>
</ul>
<h3>🌐 Dictionaries &amp; apps</h3>
<ul>
<li><a href="https://korean.dict.naver.com/" target="_blank" rel="noopener">Naver Korean Dictionary (한국어사전)</a></li>
<li>TOPIK ONE (mobile) — TOPIK I vocabulary &amp; grammar drills</li>
<li>Anki — spaced-repetition flashcards for vocab &amp; verb endings</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — beginner grammar &amp; listening</li>
<li><a href="https://www.youtube.com/@GoBillyKorean" target="_blank" rel="noopener">Go! Billy Korean</a> — grammar &amp; pronunciation</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Review KRL112</strong> — Hangul, 이에요/예요, particles 이/가·은/는·을/를, present tense 아요/어요/해요, past 았/었어요.</li>
<li><strong>Grow the verb</strong> — future 을 거예요, wanting 고 싶다, trying 아/어 보다, ability 을 수 있다.</li>
<li><strong>Link ideas</strong> — reasons 아서/어서, contrast 지만·는데, conditions 으면, time clauses 을 때·기 전에.</li>
<li><strong>Speak politely</strong> — commands 으세요, suggestions 읍시다, honorifics 으시다; aim at TOPIK I.</li>
</ol></div>`,
    `<span class="eyebrow">KRL122 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho <strong>Tiếng Hàn sơ cấp 2</strong> — dựng tiếp trên Hangul, trợ từ và thì hiện tại của <strong>KRL112</strong> để tiến tới các thì, mong muốn, khả năng, định ngữ động từ, so sánh, điều kiện và kính ngữ — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 1 (nửa sau) → 2</em> — Viện King Sejong (PDF &amp; audio miễn phí)</a></li>
<li><em>Ewha Korean 1-2</em> — NXB Đại học Ewha</li>
</ul>
<h3>🌐 Từ điển &amp; ứng dụng</h3>
<ul>
<li><a href="https://korean.dict.naver.com/" target="_blank" rel="noopener">Từ điển Naver (한국어사전)</a></li>
<li>TOPIK ONE (điện thoại) — luyện từ vựng &amp; ngữ pháp TOPIK I</li>
<li>Anki — thẻ ghi nhớ lặp lại ngắt quãng cho từ vựng &amp; đuôi động từ</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — ngữ pháp &amp; nghe cho người mới</li>
<li><a href="https://www.youtube.com/@GoBillyKorean" target="_blank" rel="noopener">Go! Billy Korean</a> — ngữ pháp &amp; phát âm</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Ôn lại KRL112</strong> — Hangul, 이에요/예요, trợ từ 이/가·은/는·을/를, hiện tại 아요/어요/해요, quá khứ 았/었어요.</li>
<li><strong>Mở rộng động từ</strong> — tương lai 을 거예요, mong muốn 고 싶다, thử 아/어 보다, khả năng 을 수 있다.</li>
<li><strong>Nối ý</strong> — lý do 아서/어서, tương phản 지만·는데, điều kiện 으면, mệnh đề thời gian 을 때·기 전에.</li>
<li><strong>Nói lịch sự</strong> — mệnh lệnh 으세요, rủ 읍시다, kính ngữ 으시다; hướng tới TOPIK I.</li>
</ol></div>`,
  ]]);

/* ── Giới thiệu môn ──────────────────────────────────────────────────────── */
const intro = doc('krl122-0-1-overview', 'Course overview: from KRL112 onward|||Tổng quan: nối tiếp từ KRL112',
  'Mục tiêu môn (hoàn thiện TOPIK I), nhắc lại nền tảng KRL112, và bản đồ ngữ pháp 8 bài.',
  [[
    `<span class="eyebrow">KRL122 · Lesson 0.1 · Overview</span>
<h2>Elementary Korean 2</h2>
<p class="lead">This course continues <strong>Elementary Korean 1 (KRL112)</strong>. You already read Hangul, use the copula 이에요/예요, the particles 이/가·은/는·을/를, the polite present 아요/어요/해요 and the past 았/었어요. Now you will <strong>talk about the future and plans, express wanting and trying, give reasons, state ability and permission, describe nouns with verb clauses, compare things, set conditions, and speak with honorifics</strong> — completing the <strong>TOPIK I</strong> beginner grammar.</p>
<h3>What KRL112 gave you</h3>
<p>KRL112 is the foundation: the 40 Hangul letters and batchim, greetings and 입니다, this/that (이것/그것/저것), the two number systems, place &amp; existence (있어요/없어요), the polite present tense and simple past. This course assumes all of that.</p>
<h3>Roadmap of the 8 lessons</h3>
<p>Past &amp; plans (을 거예요) → wanting &amp; trying (고 싶다, 아/어 보다) → reasons &amp; contrast (아서/어서, 지만, 는데) → ability &amp; permission (을 수 있다, 아도 되다) → verb modifiers &amp; time (는/은/을, 을 때, 기 전에) → comparison (보다, 제일) → conditions &amp; commands (으면, 으세요, 읍시다) → honorifics &amp; ongoing action (으시다, 고 있다, 아/어 주다). Bilingual Korean-Vietnamese, with vocabulary tables, grammar notes, short dialogues and a quiz each lesson.</p>
<div class="callout"><span class="badge">Politeness level</span> This course keeps the <strong>해요체</strong> (polite -요 style) and adds the <strong>subject honorific 으시</strong> and honorific words (계시다, 드시다) so you can speak respectfully about elders and teachers.</div>`,
    `<span class="eyebrow">KRL122 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Hàn sơ cấp 2</h2>
<p class="lead">Môn này nối tiếp <strong>Tiếng Hàn sơ cấp 1 (KRL112)</strong>. Bạn đã đọc được Hangul, dùng đuôi "là" 이에요/예요, các trợ từ 이/가·은/는·을/를, thì hiện tại lịch sự 아요/어요/해요 và quá khứ 았/었어요. Giờ bạn sẽ <strong>nói về tương lai và kế hoạch, diễn đạt mong muốn và thử, nêu lý do, nói khả năng và cho phép, tả danh từ bằng mệnh đề động từ, so sánh, đặt điều kiện, và nói kính ngữ</strong> — hoàn thiện ngữ pháp sơ cấp <strong>TOPIK I</strong>.</p>
<h3>KRL112 đã cho bạn gì</h3>
<p>KRL112 là nền: 40 chữ Hangul và batchim, chào hỏi và 입니다, đại từ chỉ định (이것/그것/저것), hai hệ đếm số, địa điểm &amp; tồn tại (있어요/없어요), thì hiện tại lịch sự và quá khứ đơn. Môn này giả định bạn đã nắm hết.</p>
<h3>Bản đồ 8 bài</h3>
<p>Quá khứ &amp; kế hoạch (을 거예요) → muốn &amp; thử (고 싶다, 아/어 보다) → lý do &amp; tương phản (아서/어서, 지만, 는데) → khả năng &amp; cho phép (을 수 있다, 아도 되다) → định ngữ động từ &amp; thời gian (는/은/을, 을 때, 기 전에) → so sánh (보다, 제일) → điều kiện &amp; mệnh lệnh (으면, 으세요, 읍시다) → kính ngữ &amp; hành động tiếp diễn (으시다, 고 있다, 아/어 주다). Song ngữ Hàn-Việt, có bảng từ vựng, ghi chú ngữ pháp, hội thoại ngắn và quiz mỗi bài.</p>
<div class="callout"><span class="badge">Bậc lịch sự</span> Môn này giữ <strong>해요체</strong> (thể lịch sự đuôi -요) và thêm <strong>kính ngữ chủ ngữ 으시</strong> cùng các từ kính ngữ (계시다, 드시다) để bạn nói tôn trọng về người lớn tuổi và thầy cô.</div>`,
  ]]);

/* ── Bài 1 — Quá khứ & kế hoạch ─────────────────────────────────────────── */
const b1 = doc('krl122-1-1-past-plans', 'Lesson 1 — Past & plans|||Bài 1 — Quá khứ & kế hoạch',
  'Ôn quá khứ 았어요/었어요 và học tương lai/dự định 을 거예요 (chú ý sau nguyên âm/phụ âm).',
  [[
    `<span class="eyebrow">KRL122 · Lesson 1</span>
<h2>Past &amp; plans (을 거예요)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>어제 / 내일</td><td>eoje / naeil</td><td>yesterday / tomorrow</td></tr>
<tr><td>주말</td><td>jumal</td><td>weekend</td></tr>
<tr><td>방학</td><td>banghak</td><td>school vacation</td></tr>
<tr><td>여행</td><td>yeohaeng</td><td>trip, travel</td></tr>
<tr><td>계획</td><td>gyehoek</td><td>plan</td></tr>
<tr><td>쉬다</td><td>swida</td><td>to rest</td></tr>
</tbody></table>
<h3>Grammar — review past, learn future -(으)ㄹ 거예요</h3>
<p>Review: past = <strong>았어요/었어요</strong> (하다 → 했어요). Future / intention = <strong>-(으)ㄹ 거예요</strong>: after a vowel add <strong>ㄹ 거예요</strong>, after a consonant add <strong>을 거예요</strong>, 하다 → <strong>할 거예요</strong>.</p>
<ul>
<li>가다 → 갈 거예요 (gal geoyeyo) = will go</li>
<li>먹다 → 먹을 거예요 (meogeul geoyeyo) = will eat</li>
<li>공부하다 → 공부할 거예요 (gongbuhal geoyeyo) = will study</li>
</ul>
<pre><code>어제 친구를 만났어요.   eoje chingureul mannasseoyo. = I met a friend yesterday.
주말에 뭐 할 거예요?    jumal-e mwo hal geoyeyo?     = What will you do this weekend?
방학에 여행을 갈 거예요. banghag-e yeohaeng-eul gal geoyeyo. = I will travel in the vacation.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 주말에 뭐 할 거예요? (Jumal-e mwo hal geoyeyo?)</p>
<p><strong>B:</strong> 집에서 쉴 거예요. 어제 많이 바빴어요. (Jib-eseo swil geoyeyo. Eoje mani bappasseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 거예요 is spelled 거예요 but sounds like "geoyeyo". Use 을 거예요 for plans and predictions; the plain present 아요/어요 is for right-now facts.</div>`,
    `<span class="eyebrow">KRL122 · Bài 1</span>
<h2>Quá khứ &amp; kế hoạch (을 거예요)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>어제 / 내일</td><td>eoje / naeil</td><td>hôm qua / ngày mai</td></tr>
<tr><td>주말</td><td>jumal</td><td>cuối tuần</td></tr>
<tr><td>방학</td><td>banghak</td><td>kỳ nghỉ (của trường)</td></tr>
<tr><td>여행</td><td>yeohaeng</td><td>chuyến đi, du lịch</td></tr>
<tr><td>계획</td><td>gyehoek</td><td>kế hoạch</td></tr>
<tr><td>쉬다</td><td>swida</td><td>nghỉ ngơi</td></tr>
</tbody></table>
<h3>Ngữ pháp — ôn quá khứ, học tương lai -(으)ㄹ 거예요</h3>
<p>Ôn: quá khứ = <strong>았어요/었어요</strong> (하다 → 했어요). Tương lai / dự định = <strong>-(으)ㄹ 거예요</strong>: sau nguyên âm thêm <strong>ㄹ 거예요</strong>, sau phụ âm thêm <strong>을 거예요</strong>, 하다 → <strong>할 거예요</strong>.</p>
<ul>
<li>가다 → 갈 거예요 (gal geoyeyo) = sẽ đi</li>
<li>먹다 → 먹을 거예요 (meogeul geoyeyo) = sẽ ăn</li>
<li>공부하다 → 공부할 거예요 (gongbuhal geoyeyo) = sẽ học</li>
</ul>
<pre><code>어제 친구를 만났어요.   eoje chingureul mannasseoyo. = Hôm qua tôi đã gặp bạn.
주말에 뭐 할 거예요?    jumal-e mwo hal geoyeyo?     = Cuối tuần bạn sẽ làm gì?
방학에 여행을 갈 거예요. banghag-e yeohaeng-eul gal geoyeyo. = Kỳ nghỉ tôi sẽ đi du lịch.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 주말에 뭐 할 거예요? (Jumal-e mwo hal geoyeyo?)</p>
<p><strong>B:</strong> 집에서 쉴 거예요. 어제 많이 바빴어요. (Jib-eseo swil geoyeyo. Eoje mani bappasseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 거예요 viết là 거예요 nhưng đọc "geoyeyo". Dùng 을 거예요 cho kế hoạch và dự đoán; thì hiện tại 아요/어요 là cho sự việc ngay lúc này.</div>`,
  ]]);
const b1q = quiz('krl122-quiz-1', 'Quiz 1 — Past & plans|||Quiz 1 — Quá khứ & kế hoạch', [
  { id: 'q1', question: 'The future of 가다 (to go) is…|||Tương lai của 가다 (đi) là…', options: ['가을 거예요', '갈 거예요', '가었어요', '가 거예요'], correctIndex: 1, explanation: '가 kết thúc bằng nguyên âm → ㄹ 거예요 = 갈 거예요.' },
  { id: 'q2', question: 'After a noun/stem ending in a CONSONANT, the future ending is…|||Sau gốc kết thúc bằng PHỤ ÂM, đuôi tương lai là…', options: ['ㄹ 거예요', '을 거예요', '았어요', '이에요'], correctIndex: 1, explanation: 'Sau phụ âm dùng 을 거예요 (먹다 → 먹을 거예요); sau nguyên âm dùng ㄹ 거예요.' },
  { id: 'q3', question: 'What does "어제 친구를 만났어요" mean?|||"어제 친구를 만났어요" nghĩa là gì?', options: ['I will meet a friend tomorrow|||Ngày mai tôi sẽ gặp bạn', 'I met a friend yesterday|||Hôm qua tôi đã gặp bạn', 'I want to meet a friend|||Tôi muốn gặp bạn', 'I meet a friend every day|||Ngày nào tôi cũng gặp bạn'], correctIndex: 1, explanation: '어제 = hôm qua, 만났어요 = đã gặp (quá khứ của 만나다).' },
]);

/* ── Bài 2 — Muốn & thử ─────────────────────────────────────────────────── */
const b2 = doc('krl122-2-1-want-try', 'Lesson 2 — Wanting & trying|||Bài 2 — Muốn & thử',
  'V + 고 싶다 (muốn), V + 아/어 보다 (thử), V + 을게요 (sẽ, hứa/ý chí).',
  [[
    `<span class="eyebrow">KRL122 · Lesson 2</span>
<h2>Wanting &amp; trying (고 싶다, 아/어 보다, 을게요)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>사다</td><td>sada</td><td>to buy</td></tr>
<tr><td>입다</td><td>ipda</td><td>to wear (clothes)</td></tr>
<tr><td>배우다</td><td>baeuda</td><td>to learn</td></tr>
<tr><td>한복</td><td>hanbok</td><td>hanbok (Korean dress)</td></tr>
<tr><td>한번</td><td>hanbeon</td><td>once, give it a try</td></tr>
<tr><td>제가</td><td>jega</td><td>I (humble subject)</td></tr>
</tbody></table>
<h3>Grammar — desire, attempt, promise</h3>
<ul>
<li><strong>V + 고 싶다</strong> = want to: 먹고 싶어요 (meokgo sipeoyo) = I want to eat.</li>
<li><strong>V + 아/어 보다</strong> = try doing: 아 보다 after ㅏ/ㅗ, 어 보다 otherwise. 먹어 보다 = try eating, 입어 보다 = try wearing.</li>
<li><strong>V + -(으)ㄹ게요</strong> = I will (promise / intention): 갈게요 (galgeyo), 먹을게요 (meogeulgeyo), 할게요 (halgeyo).</li>
</ul>
<pre><code>한복을 입어 보고 싶어요.  hanbog-eul ibeo bogo sipeoyo. = I want to try wearing a hanbok.
이거 한번 먹어 보세요.    igeo hanbeon meogeo boseyo.   = Try eating this once.
제가 할게요.             jega halgeyo.                 = I'll do it.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 뭘 배우고 싶어요? (Mwol baeugo sipeoyo?)</p>
<p><strong>B:</strong> 한국 요리를 배우고 싶어요. 제가 한번 만들어 볼게요. (Hanguk yorireul baeugo sipeoyo. Jega hanbeon mandeureo bolgeyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 고 싶다 uses 싶어요/싶었어요 like an adjective. 을게요 is a promise the speaker controls, so it is only used with "I" — never ask "you 을게요?".</div>`,
    `<span class="eyebrow">KRL122 · Bài 2</span>
<h2>Muốn &amp; thử (고 싶다, 아/어 보다, 을게요)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>사다</td><td>sada</td><td>mua</td></tr>
<tr><td>입다</td><td>ipda</td><td>mặc (quần áo)</td></tr>
<tr><td>배우다</td><td>baeuda</td><td>học</td></tr>
<tr><td>한복</td><td>hanbok</td><td>hanbok (trang phục Hàn)</td></tr>
<tr><td>한번</td><td>hanbeon</td><td>một lần, thử xem</td></tr>
<tr><td>제가</td><td>jega</td><td>tôi (chủ ngữ khiêm nhường)</td></tr>
</tbody></table>
<h3>Ngữ pháp — mong muốn, thử, hứa</h3>
<ul>
<li><strong>V + 고 싶다</strong> = muốn: 먹고 싶어요 (meokgo sipeoyo) = tôi muốn ăn.</li>
<li><strong>V + 아/어 보다</strong> = thử làm: 아 보다 sau ㅏ/ㅗ, 어 보다 các trường hợp khác. 먹어 보다 = ăn thử, 입어 보다 = mặc thử.</li>
<li><strong>V + -(으)ㄹ게요</strong> = tôi sẽ (hứa / ý chí): 갈게요 (galgeyo), 먹을게요 (meogeulgeyo), 할게요 (halgeyo).</li>
</ul>
<pre><code>한복을 입어 보고 싶어요.  hanbog-eul ibeo bogo sipeoyo. = Tôi muốn thử mặc hanbok.
이거 한번 먹어 보세요.    igeo hanbeon meogeo boseyo.   = Thử ăn cái này một lần đi.
제가 할게요.             jega halgeyo.                 = Để tôi làm cho.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 뭘 배우고 싶어요? (Mwol baeugo sipeoyo?)</p>
<p><strong>B:</strong> 한국 요리를 배우고 싶어요. 제가 한번 만들어 볼게요. (Hanguk yorireul baeugo sipeoyo. Jega hanbeon mandeureo bolgeyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 고 싶다 chia 싶어요/싶었어요 như tính từ. 을게요 là lời hứa do người nói quyết định, nên chỉ dùng với "tôi" — không hỏi "bạn 을게요?".</div>`,
  ]]);
const b2q = quiz('krl122-quiz-2', 'Quiz 2 — Wanting & trying|||Quiz 2 — Muốn & thử', [
  { id: 'q1', question: 'Which pattern means "want to (do)"?|||Cấu trúc "muốn (làm gì)" là?', options: ['-아/어 보다', '-고 싶다', '-을게요', '-을 거예요'], correctIndex: 1, explanation: 'V + 고 싶다 = muốn làm: 먹고 싶어요 (muốn ăn).' },
  { id: 'q2', question: '"먹어 보세요" means…|||"먹어 보세요" nghĩa là gì?', options: ['Please do not eat|||Xin đừng ăn', 'I will eat|||Tôi sẽ ăn', 'Please try eating (it)|||Hãy ăn thử đi', 'I want to eat|||Tôi muốn ăn'], correctIndex: 2, explanation: '아/어 보다 = thử làm; 먹어 보세요 = hãy ăn thử.' },
  { id: 'q3', question: '"제가 할게요" (-을게요) expresses…|||"제가 할게요" (-을게요) diễn đạt gì?', options: ['a question to the listener|||câu hỏi cho người nghe', 'the speaker\'s promise/intention|||lời hứa/ý chí của người nói', 'a past event|||sự việc quá khứ', 'permission|||sự cho phép'], correctIndex: 1, explanation: '-을게요 là ý chí/lời hứa của người nói, chỉ dùng với "tôi".' },
]);

/* ── Bài 3 — Lý do & tương phản ─────────────────────────────────────────── */
const b3 = doc('krl122-3-1-reason-contrast', 'Lesson 3 — Reason & contrast|||Bài 3 — Lý do & tương phản',
  'V/A + 아서/어서 (vì), A/V + 지만 (nhưng), V/A + 는데/은데 (bối cảnh, tương phản).',
  [[
    `<span class="eyebrow">KRL122 · Lesson 3</span>
<h2>Reason &amp; contrast (아서/어서, 지만, 는데)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>아프다</td><td>apeuda</td><td>to be sick / hurt</td></tr>
<tr><td>바쁘다</td><td>bappeuda</td><td>to be busy</td></tr>
<tr><td>비싸다</td><td>bissada</td><td>to be expensive</td></tr>
<tr><td>병원</td><td>byeongwon</td><td>hospital / clinic</td></tr>
<tr><td>그래서 / 그런데</td><td>geuraeseo / geureonde</td><td>so / but, by the way</td></tr>
</tbody></table>
<h3>Grammar — because, but, background</h3>
<ul>
<li><strong>V/A + 아서/어서</strong> = because: 아파서 (because sick), 바빠서 (because busy — 바쁘다 loses ㅡ), 좋아서 (because good).</li>
<li><strong>A/V + 지만</strong> = but: 예쁘지만 (pretty but), 비싸지만 (expensive but).</li>
<li><strong>V + 는데 / A + (으)ㄴ데</strong> = background or soft contrast: 가는데, 좋은데 (good but / good so…).</li>
</ul>
<pre><code>배가 아파서 병원에 갔어요. baega apaseo byeongwon-e gasseoyo. = I went to the clinic because my stomach hurt.
이 옷은 예쁘지만 비싸요.   i oseun yeppeujiman bissayo.       = These clothes are pretty but expensive.
날씨가 좋은데 산책할까요?   nalssiga joeunde sanchaekhalkkayo? = The weather is nice, so shall we take a walk?</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 왜 안 왔어요? (Wae an wasseoyo?)</p>
<p><strong>B:</strong> 어제 너무 바빠서 못 왔어요. 미안해요. (Eoje neomu bappaseo mot wasseoyo. Mianhaeyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 아서/어서 drops tense — never say 갔아서; put the past only on the final verb. 아프다·바쁘다 are 으-irregular: the ㅡ vanishes before 아/어 (아파서, 바빠서).</div>`,
    `<span class="eyebrow">KRL122 · Bài 3</span>
<h2>Lý do &amp; tương phản (아서/어서, 지만, 는데)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>아프다</td><td>apeuda</td><td>đau / ốm</td></tr>
<tr><td>바쁘다</td><td>bappeuda</td><td>bận</td></tr>
<tr><td>비싸다</td><td>bissada</td><td>đắt</td></tr>
<tr><td>병원</td><td>byeongwon</td><td>bệnh viện / phòng khám</td></tr>
<tr><td>그래서 / 그런데</td><td>geuraeseo / geureonde</td><td>vì vậy / nhưng, mà</td></tr>
</tbody></table>
<h3>Ngữ pháp — vì, nhưng, bối cảnh</h3>
<ul>
<li><strong>V/A + 아서/어서</strong> = vì: 아파서 (vì đau), 바빠서 (vì bận — 바쁘다 rụng ㅡ), 좋아서 (vì thích).</li>
<li><strong>A/V + 지만</strong> = nhưng: 예쁘지만 (đẹp nhưng), 비싸지만 (đắt nhưng).</li>
<li><strong>V + 는데 / A + (으)ㄴ데</strong> = nêu bối cảnh hoặc tương phản nhẹ: 가는데, 좋은데 (đẹp mà / đẹp nên…).</li>
</ul>
<pre><code>배가 아파서 병원에 갔어요. baega apaseo byeongwon-e gasseoyo. = Vì đau bụng nên tôi đã đến phòng khám.
이 옷은 예쁘지만 비싸요.   i oseun yeppeujiman bissayo.       = Áo này đẹp nhưng đắt.
날씨가 좋은데 산책할까요?   nalssiga joeunde sanchaekhalkkayo? = Trời đẹp mà, mình đi dạo nhé?</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 왜 안 왔어요? (Wae an wasseoyo?)</p>
<p><strong>B:</strong> 어제 너무 바빠서 못 왔어요. 미안해요. (Eoje neomu bappaseo mot wasseoyo. Mianhaeyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 아서/어서 không mang thì — đừng nói 갔아서; chỉ đặt quá khứ ở động từ cuối. 아프다·바쁘다 là bất quy tắc 으: ㅡ rụng trước 아/어 (아파서, 바빠서).</div>`,
  ]]);
const b3q = quiz('krl122-quiz-3', 'Quiz 3 — Reason & contrast|||Quiz 3 — Lý do & tương phản', [
  { id: 'q1', question: 'Which connector means "because"?|||Liên từ nào nghĩa "vì/bởi vì"?', options: ['-지만', '-아서/어서', '-을게요', '-고 싶다'], correctIndex: 1, explanation: '-아서/어서 nối lý do: 아파서 = vì đau.' },
  { id: 'q2', question: '바쁘다 + 아서 becomes…|||바쁘다 + 아서 thành…', options: ['바쁘아서', '바뻐서', '바빠서', '바쁴서'], correctIndex: 2, explanation: '으-bất quy tắc: ㅡ rụng, 바쁘 + 아서 → 바빠서.' },
  { id: 'q3', question: '"이 옷은 예쁘지만 비싸요" means…|||"이 옷은 예쁘지만 비싸요" nghĩa là gì?', options: ['pretty and cheap|||đẹp và rẻ', 'pretty but expensive|||đẹp nhưng đắt', 'ugly but cheap|||xấu nhưng rẻ', 'expensive so pretty|||đắt nên đẹp'], correctIndex: 1, explanation: '-지만 = nhưng; 예쁘지만 비싸요 = đẹp nhưng đắt.' },
]);

/* ── Bài 4 — Khả năng & cho phép ────────────────────────────────────────── */
const b4 = doc('krl122-4-1-ability-permission', 'Lesson 4 — Ability & permission|||Bài 4 — Khả năng & cho phép',
  'V + 을 수 있다/없다 (có thể), V + 아도/어도 되다 (được phép), V + 으면 안 되다 (không được).',
  [[
    `<span class="eyebrow">KRL122 · Lesson 4</span>
<h2>Ability &amp; permission (을 수 있다, 아도 되다, 으면 안 되다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>운전하다</td><td>unjeonhada</td><td>to drive</td></tr>
<tr><td>수영하다</td><td>suyeonghada</td><td>to swim</td></tr>
<tr><td>앉다</td><td>anda</td><td>to sit</td></tr>
<tr><td>사진을 찍다</td><td>sajineul jjikda</td><td>to take a photo</td></tr>
<tr><td>담배를 피우다</td><td>dambaereul piuda</td><td>to smoke</td></tr>
</tbody></table>
<h3>Grammar — can, may, must not</h3>
<ul>
<li><strong>V + -(으)ㄹ 수 있다/없다</strong> = can / cannot: 할 수 있어요, 갈 수 있어요, 먹을 수 없어요.</li>
<li><strong>V + 아도/어도 되다</strong> = may, it's OK to: 가도 돼요, 먹어도 돼요, 앉아도 돼요.</li>
<li><strong>V + -(으)면 안 되다</strong> = must not: 찍으면 안 돼요, 피우면 안 돼요.</li>
</ul>
<pre><code>한국어를 할 수 있어요.    hangugeoreul hal su isseoyo.     = I can speak Korean.
여기 앉아도 돼요?        yeogi anjado dwaeyo?             = May I sit here?
여기에서 사진을 찍으면 안 돼요. yeogieseo sajineul jjigeumyeon an dwaeyo. = You must not take photos here.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 여기에서 수영할 수 있어요? (Yeogieseo suyeonghal su isseoyo?)</p>
<p><strong>B:</strong> 아니요, 여기에서 수영하면 안 돼요. (Aniyo, yeogieseo suyeonghamyeon an dwaeyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 아도/어도 되다 asks or grants permission; -(으)면 안 되다 forbids. Both share the vowel rule you already know from 아요/어요.</div>`,
    `<span class="eyebrow">KRL122 · Bài 4</span>
<h2>Khả năng &amp; cho phép (을 수 있다, 아도 되다, 으면 안 되다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>운전하다</td><td>unjeonhada</td><td>lái xe</td></tr>
<tr><td>수영하다</td><td>suyeonghada</td><td>bơi</td></tr>
<tr><td>앉다</td><td>anda</td><td>ngồi</td></tr>
<tr><td>사진을 찍다</td><td>sajineul jjikda</td><td>chụp ảnh</td></tr>
<tr><td>담배를 피우다</td><td>dambaereul piuda</td><td>hút thuốc</td></tr>
</tbody></table>
<h3>Ngữ pháp — có thể, được phép, không được</h3>
<ul>
<li><strong>V + -(으)ㄹ 수 있다/없다</strong> = có thể / không thể: 할 수 있어요, 갈 수 있어요, 먹을 수 없어요.</li>
<li><strong>V + 아도/어도 되다</strong> = được phép, không sao: 가도 돼요, 먹어도 돼요, 앉아도 돼요.</li>
<li><strong>V + -(으)면 안 되다</strong> = không được: 찍으면 안 돼요, 피우면 안 돼요.</li>
</ul>
<pre><code>한국어를 할 수 있어요.    hangugeoreul hal su isseoyo.     = Tôi có thể nói tiếng Hàn.
여기 앉아도 돼요?        yeogi anjado dwaeyo?             = Tôi ngồi đây được không?
여기에서 사진을 찍으면 안 돼요. yeogieseo sajineul jjigeumyeon an dwaeyo. = Ở đây không được chụp ảnh.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 여기에서 수영할 수 있어요? (Yeogieseo suyeonghal su isseoyo?)</p>
<p><strong>B:</strong> 아니요, 여기에서 수영하면 안 돼요. (Aniyo, yeogieseo suyeonghamyeon an dwaeyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 아도/어도 되다 để hỏi hoặc cho phép; -(으)면 안 되다 để cấm. Cả hai theo đúng quy tắc nguyên âm bạn đã biết từ 아요/어요.</div>`,
  ]]);
const b4q = quiz('krl122-quiz-4', 'Quiz 4 — Ability & permission|||Quiz 4 — Khả năng & cho phép', [
  { id: 'q1', question: 'How do you say "I can speak Korean"?|||Nói "Tôi có thể nói tiếng Hàn" là?', options: ['한국어를 할 거예요', '한국어를 할 수 있어요', '한국어를 하고 싶어요', '한국어를 하면 안 돼요'], correctIndex: 1, explanation: '-(으)ㄹ 수 있다 = có thể; 할 수 있어요 = có thể làm/nói.' },
  { id: 'q2', question: '"여기 앉아도 돼요?" asks…|||"여기 앉아도 돼요?" hỏi gì?', options: ['Must I sit here?|||Tôi bắt buộc ngồi đây à?', 'May I sit here?|||Tôi ngồi đây được không?', 'Can you sit here?|||Bạn ngồi đây được chứ?', 'Did I sit here?|||Tôi đã ngồi đây à?'], correctIndex: 1, explanation: '아도/어도 되다 = xin phép; 앉아도 돼요? = ngồi đây được không?' },
  { id: 'q3', question: '"찍으면 안 돼요" means…|||"찍으면 안 돼요" nghĩa là gì?', options: ['you may take photos|||được chụp ảnh', 'you must not take photos|||không được chụp ảnh', 'please take a photo|||hãy chụp ảnh', 'I can take photos|||tôi có thể chụp ảnh'], correctIndex: 1, explanation: '-(으)면 안 되다 = không được; 찍으면 안 돼요 = không được chụp.' },
]);

/* ── Bài 5 — Định ngữ & thời gian ───────────────────────────────────────── */
const b5 = doc('krl122-5-1-modifiers-time', 'Lesson 5 — Verb modifiers & time|||Bài 5 — Định ngữ & thời gian',
  'Định ngữ động từ 는/은/을, mệnh đề 을 때 (khi), 기 전에 (trước khi), 은 후에 (sau khi).',
  [[
    `<span class="eyebrow">KRL122 · Lesson 5</span>
<h2>Verb modifiers &amp; time (는/은/을, 을 때, 기 전에)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>읽다</td><td>ikda</td><td>to read</td></tr>
<tr><td>재미있다</td><td>jaemiitda</td><td>to be fun / interesting</td></tr>
<tr><td>이를 닦다</td><td>ireul dakda</td><td>to brush one's teeth</td></tr>
<tr><td>자다</td><td>jada</td><td>to sleep</td></tr>
<tr><td>이야기하다</td><td>iyagihada</td><td>to talk, chat</td></tr>
</tbody></table>
<h3>Grammar — verb modifying a noun + time clauses</h3>
<ul>
<li>Present <strong>V + 는</strong>: 읽는 책 = the book (I) am reading; past <strong>V + (으)ㄴ</strong>: 읽은 책 = the book (I) read; future <strong>V + (으)ㄹ</strong>: 읽을 책 = the book (I) will read.</li>
<li><strong>V + -(으)ㄹ 때</strong> = when: 밥을 먹을 때 (when eating), 갈 때 (when going).</li>
<li><strong>V + 기 전에</strong> = before: 자기 전에 (before sleeping). <strong>V + -(으)ㄴ 후에</strong> = after: 먹은 후에 (after eating).</li>
</ul>
<pre><code>지금 읽는 책이 재미있어요.  jigeum ingneun chaeg-i jaemiisseoyo. = The book I'm reading now is fun.
밥을 먹을 때 이야기해요.    bab-eul meogeul ttae iyagihaeyo.     = We talk when we eat.
자기 전에 이를 닦아요.      jagi jeon-e ireul dakkayo.            = I brush my teeth before sleeping.
밥을 먹은 후에 커피를 마셔요. bab-eul meogeun hu-e keopireul masyeoyo. = After eating I drink coffee.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 어제 본 영화가 어땠어요? (Eoje bon yeonghwaga eottaesseoyo?)</p>
<p><strong>B:</strong> 재미있었어요. 자기 전에 또 보고 싶어요. (Jaemiisseosseoyo. Jagi jeon-e tto bogo sipeoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 읽는 is read "ingneun" (batchim ㄺ + 는). Modifiers come BEFORE the noun, unlike English relative clauses: 읽는 책 = "the reading book" = the book being read.</div>`,
    `<span class="eyebrow">KRL122 · Bài 5</span>
<h2>Định ngữ &amp; thời gian (는/은/을, 을 때, 기 전에)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>읽다</td><td>ikda</td><td>đọc</td></tr>
<tr><td>재미있다</td><td>jaemiitda</td><td>thú vị, vui</td></tr>
<tr><td>이를 닦다</td><td>ireul dakda</td><td>đánh răng</td></tr>
<tr><td>자다</td><td>jada</td><td>ngủ</td></tr>
<tr><td>이야기하다</td><td>iyagihada</td><td>trò chuyện, nói chuyện</td></tr>
</tbody></table>
<h3>Ngữ pháp — động từ bổ nghĩa danh từ + mệnh đề thời gian</h3>
<ul>
<li>Hiện tại <strong>V + 는</strong>: 읽는 책 = quyển sách (đang) đọc; quá khứ <strong>V + (으)ㄴ</strong>: 읽은 책 = quyển sách đã đọc; tương lai <strong>V + (으)ㄹ</strong>: 읽을 책 = quyển sách sẽ đọc.</li>
<li><strong>V + -(으)ㄹ 때</strong> = khi: 밥을 먹을 때 (khi ăn cơm), 갈 때 (khi đi).</li>
<li><strong>V + 기 전에</strong> = trước khi: 자기 전에 (trước khi ngủ). <strong>V + -(으)ㄴ 후에</strong> = sau khi: 먹은 후에 (sau khi ăn).</li>
</ul>
<pre><code>지금 읽는 책이 재미있어요.  jigeum ingneun chaeg-i jaemiisseoyo. = Quyển sách đang đọc bây giờ thú vị.
밥을 먹을 때 이야기해요.    bab-eul meogeul ttae iyagihaeyo.     = Khi ăn cơm thì trò chuyện.
자기 전에 이를 닦아요.      jagi jeon-e ireul dakkayo.            = Trước khi ngủ thì đánh răng.
밥을 먹은 후에 커피를 마셔요. bab-eul meogeun hu-e keopireul masyeoyo. = Sau khi ăn thì uống cà phê.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 어제 본 영화가 어땠어요? (Eoje bon yeonghwaga eottaesseoyo?)</p>
<p><strong>B:</strong> 재미있었어요. 자기 전에 또 보고 싶어요. (Jaemiisseosseoyo. Jagi jeon-e tto bogo sipeoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 읽는 đọc là "ingneun" (batchim ㄺ + 는). Định ngữ đứng TRƯỚC danh từ, khác mệnh đề quan hệ tiếng Anh: 읽는 책 = "quyển sách đang được đọc".</div>`,
  ]]);
const b5q = quiz('krl122-quiz-5', 'Quiz 5 — Modifiers & time|||Quiz 5 — Định ngữ & thời gian', [
  { id: 'q1', question: 'Present verb-modifier ending on a noun (e.g. 읽_ 책) is…|||Đuôi định ngữ động từ hiện tại (vd 읽_ 책) là…', options: ['-은', '-는', '-을', '-고'], correctIndex: 1, explanation: 'Hiện tại dùng -는: 읽는 책 = quyển sách đang đọc.' },
  { id: 'q2', question: '"밥을 먹을 때" means…|||"밥을 먹을 때" nghĩa là gì?', options: ['before eating|||trước khi ăn', 'after eating|||sau khi ăn', 'when eating|||khi ăn', 'because of eating|||vì ăn'], correctIndex: 2, explanation: '-(으)ㄹ 때 = khi; 먹을 때 = khi ăn.' },
  { id: 'q3', question: 'How do you say "before sleeping"?|||"Trước khi ngủ" nói là?', options: ['잔 후에', '자기 전에', '잘 때', '자는데'], correctIndex: 1, explanation: 'V + 기 전에 = trước khi; 자기 전에 = trước khi ngủ. 은 후에 = sau khi.' },
]);

/* ── Bài 6 — So sánh & mức độ ───────────────────────────────────────────── */
const b6 = doc('krl122-6-1-comparison', 'Lesson 6 — Comparison & degree|||Bài 6 — So sánh & mức độ',
  'So sánh N보다 (더), cực cấp 제일/가장, và biến đổi trạng thái A + 아/어지다.',
  [[
    `<span class="eyebrow">KRL122 · Lesson 6</span>
<h2>Comparison &amp; degree (보다, 제일/가장, 아/어지다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>크다 / 작다</td><td>keuda / jakda</td><td>to be big / small</td></tr>
<tr><td>비싸다 / 싸다</td><td>bissada / ssada</td><td>expensive / cheap</td></tr>
<tr><td>따뜻하다</td><td>ttatteuthada</td><td>to be warm</td></tr>
<tr><td>날씨</td><td>nalssi</td><td>weather</td></tr>
<tr><td>더 / 제일 (가장)</td><td>deo / jeil (gajang)</td><td>more / most</td></tr>
</tbody></table>
<h3>Grammar — comparative, superlative, becoming</h3>
<ul>
<li><strong>N보다 (더)</strong> = more than: A가 B보다 더 커요 = A is bigger than B.</li>
<li><strong>제일 / 가장</strong> = the most: 제일 좋아요 (best), 가장 커요 (biggest).</li>
<li><strong>A + 아/어지다</strong> = to become: 커지다 (get big), 좋아지다 (get better), 따뜻해지다 (become warm).</li>
</ul>
<pre><code>서울이 부산보다 더 커요.   seour-i busanboda deo keoyo.    = Seoul is bigger than Busan.
이 영화가 제일 재미있어요. i yeonghwaga jeil jaemiisseoyo. = This movie is the most fun.
날씨가 따뜻해졌어요.       nalssiga ttatteuthaejyeosseoyo. = The weather has become warm.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 커피하고 차 중에서 뭐가 더 좋아요? (Keopihago cha jung-eseo mwoga deo joayo?)</p>
<p><strong>B:</strong> 저는 커피가 제일 좋아요. (Jeoneun keopiga jeil joayo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 보다 marks the thing compared against, and 더 ("more") is optional. For "the most", 제일 and 가장 are interchangeable; 제일 is more common in speech.</div>`,
    `<span class="eyebrow">KRL122 · Bài 6</span>
<h2>So sánh &amp; mức độ (보다, 제일/가장, 아/어지다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>크다 / 작다</td><td>keuda / jakda</td><td>to / nhỏ</td></tr>
<tr><td>비싸다 / 싸다</td><td>bissada / ssada</td><td>đắt / rẻ</td></tr>
<tr><td>따뜻하다</td><td>ttatteuthada</td><td>ấm áp</td></tr>
<tr><td>날씨</td><td>nalssi</td><td>thời tiết</td></tr>
<tr><td>더 / 제일 (가장)</td><td>deo / jeil (gajang)</td><td>hơn / nhất</td></tr>
</tbody></table>
<h3>Ngữ pháp — so sánh hơn, so sánh nhất, biến đổi</h3>
<ul>
<li><strong>N보다 (더)</strong> = hơn: A가 B보다 더 커요 = A to hơn B.</li>
<li><strong>제일 / 가장</strong> = nhất: 제일 좋아요 (thích nhất), 가장 커요 (to nhất).</li>
<li><strong>A + 아/어지다</strong> = trở nên: 커지다 (to ra), 좋아지다 (tốt lên), 따뜻해지다 (ấm lên).</li>
</ul>
<pre><code>서울이 부산보다 더 커요.   seour-i busanboda deo keoyo.    = Seoul to hơn Busan.
이 영화가 제일 재미있어요. i yeonghwaga jeil jaemiisseoyo. = Phim này thú vị nhất.
날씨가 따뜻해졌어요.       nalssiga ttatteuthaejyeosseoyo. = Thời tiết đã trở nên ấm hơn.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 커피하고 차 중에서 뭐가 더 좋아요? (Keopihago cha jung-eseo mwoga deo joayo?)</p>
<p><strong>B:</strong> 저는 커피가 제일 좋아요. (Jeoneun keopiga jeil joayo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 보다 đánh dấu vật bị đem ra so, còn 더 ("hơn") là tuỳ chọn. Với "nhất", 제일 và 가장 dùng thay nhau được; 제일 hay gặp hơn khi nói.</div>`,
  ]]);
const b6q = quiz('krl122-quiz-6', 'Quiz 6 — Comparison|||Quiz 6 — So sánh & mức độ', [
  { id: 'q1', question: 'In "A가 B보다 커요", the particle 보다 means…|||Trong "A가 B보다 커요", trợ từ 보다 nghĩa là?', options: ['the most|||nhất', 'more than (compared to)|||hơn (so với)', 'and|||và', 'because|||vì'], correctIndex: 1, explanation: 'N보다 = hơn/so với; A가 B보다 커요 = A to hơn B.' },
  { id: 'q2', question: 'Which word means "the most"?|||Từ nào nghĩa "nhất"?', options: ['더', '보다', '제일', '아주'], correctIndex: 2, explanation: '제일 (hoặc 가장) = nhất; 더 = hơn.' },
  { id: 'q3', question: '따뜻하다 + 아/어지다 (became warm) is…|||따뜻하다 + 아/어지다 (đã ấm lên) là…', options: ['따뜻하지다', '따뜻해졌어요', '따뜻았어요', '따뜻고 있어요'], correctIndex: 1, explanation: '하다 → 해지다; quá khứ 따뜻해졌어요 = đã trở nên ấm.' },
]);

/* ── Bài 7 — Điều kiện & mệnh lệnh ──────────────────────────────────────── */
const b7 = doc('krl122-7-1-condition-command', 'Lesson 7 — Conditions & commands|||Bài 7 — Điều kiện & mệnh lệnh',
  'Điều kiện -(으)면 (nếu), mệnh lệnh lịch sự -(으)세요, rủ -(으)ㅂ시다, cấm -지 마세요.',
  [[
    `<span class="eyebrow">KRL122 · Lesson 7</span>
<h2>Conditions &amp; commands (으면, 으세요, 읍시다, 지 마세요)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>시간</td><td>sigan</td><td>time</td></tr>
<tr><td>전화하다</td><td>jeonhwahada</td><td>to call (phone)</td></tr>
<tr><td>점심</td><td>jeomsim</td><td>lunch</td></tr>
<tr><td>떠들다</td><td>tteodeulda</td><td>to be noisy, make a fuss</td></tr>
<tr><td>도서관</td><td>doseogwan</td><td>library</td></tr>
</tbody></table>
<h3>Grammar — if, please do, let's, please don't</h3>
<ul>
<li><strong>V/A + -(으)면</strong> = if: 있으면 (if there is), 비가 오면 (if it rains).</li>
<li><strong>V + -(으)세요</strong> = please do (polite command): 앉으세요, 오세요, 읽으세요.</li>
<li><strong>V + -(으)ㅂ시다</strong> = let's: 갑시다, 먹읍시다. <strong>V + 지 마세요</strong> = please don't: 떠들지 마세요.</li>
</ul>
<pre><code>시간이 있으면 전화하세요.   sigan-i isseumyeon jeonhwahaseyo. = If you have time, please call.
같이 점심을 먹읍시다.       gachi jeomsim-eul meogeupsida.    = Let's have lunch together.
도서관에서 떠들지 마세요.   doseogwan-eseo tteodeulji maseyo. = Please don't be noisy in the library.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 내일 비가 오면 어떻게 할까요? (Naeil biga omyeon eotteoke halkkayo?)</p>
<p><strong>B:</strong> 비가 오면 집에서 쉽시다. (Biga omyeon jib-eseo swipsida.)</p>
</div>
<div class="callout"><span class="badge">Note</span> -(으)세요 is the everyday polite command; 지 마세요 is its negative. -(으)ㅂ시다 ("let's") sounds a bit direct to elders — with seniors prefer -(으)ㄹ까요? ("shall we?").</div>`,
    `<span class="eyebrow">KRL122 · Bài 7</span>
<h2>Điều kiện &amp; mệnh lệnh (으면, 으세요, 읍시다, 지 마세요)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>시간</td><td>sigan</td><td>thời gian</td></tr>
<tr><td>전화하다</td><td>jeonhwahada</td><td>gọi điện</td></tr>
<tr><td>점심</td><td>jeomsim</td><td>bữa trưa</td></tr>
<tr><td>떠들다</td><td>tteodeulda</td><td>làm ồn, nhốn nháo</td></tr>
<tr><td>도서관</td><td>doseogwan</td><td>thư viện</td></tr>
</tbody></table>
<h3>Ngữ pháp — nếu, hãy, nào cùng, xin đừng</h3>
<ul>
<li><strong>V/A + -(으)면</strong> = nếu: 있으면 (nếu có), 비가 오면 (nếu trời mưa).</li>
<li><strong>V + -(으)세요</strong> = hãy (mệnh lệnh lịch sự): 앉으세요, 오세요, 읽으세요.</li>
<li><strong>V + -(으)ㅂ시다</strong> = nào cùng: 갑시다, 먹읍시다. <strong>V + 지 마세요</strong> = xin đừng: 떠들지 마세요.</li>
</ul>
<pre><code>시간이 있으면 전화하세요.   sigan-i isseumyeon jeonhwahaseyo. = Nếu có thời gian hãy gọi điện.
같이 점심을 먹읍시다.       gachi jeomsim-eul meogeupsida.    = Nào cùng ăn trưa.
도서관에서 떠들지 마세요.   doseogwan-eseo tteodeulji maseyo. = Xin đừng làm ồn trong thư viện.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 내일 비가 오면 어떻게 할까요? (Naeil biga omyeon eotteoke halkkayo?)</p>
<p><strong>B:</strong> 비가 오면 집에서 쉽시다. (Biga omyeon jib-eseo swipsida.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> -(으)세요 là mệnh lệnh lịch sự thường ngày; 지 마세요 là dạng phủ định. -(으)ㅂ시다 ("nào cùng") hơi trực tiếp với người lớn — với người trên hãy dùng -(으)ㄹ까요? ("mình... nhé?").</div>`,
  ]]);
const b7q = quiz('krl122-quiz-7', 'Quiz 7 — Conditions & commands|||Quiz 7 — Điều kiện & mệnh lệnh', [
  { id: 'q1', question: 'Which ending means "if"?|||Đuôi nào nghĩa "nếu"?', options: ['-(으)면', '-(으)세요', '-(으)ㅂ시다', '-지 마세요'], correctIndex: 0, explanation: '-(으)면 = nếu; 비가 오면 = nếu trời mưa.' },
  { id: 'q2', question: '"떠들지 마세요" means…|||"떠들지 마세요" nghĩa là gì?', options: ['please be noisy|||hãy làm ồn', 'let\'s be noisy|||nào cùng làm ồn', 'please don\'t be noisy|||xin đừng làm ồn', 'can I be noisy?|||tôi làm ồn được không?'], correctIndex: 2, explanation: 'V + 지 마세요 = xin đừng; 떠들지 마세요 = đừng làm ồn.' },
  { id: 'q3', question: 'How do you say "Let\'s eat lunch together"?|||Nói "Nào cùng ăn trưa" là?', options: ['점심을 먹으세요', '점심을 먹읍시다', '점심을 먹으면', '점심을 먹지 마세요'], correctIndex: 1, explanation: '-(으)ㅂ시다 = nào cùng; 먹읍시다 = nào cùng ăn.' },
]);

/* ── Bài 8 — Kính ngữ & tường thuật ─────────────────────────────────────── */
const b8 = doc('krl122-8-1-honorifics', 'Lesson 8 — Honorifics & ongoing action|||Bài 8 — Kính ngữ & tường thuật cơ bản',
  'Kính ngữ chủ ngữ -(으)시다 (và 계시다/드시다), tiếp diễn V + 고 있다, giúp đỡ V + 아/어 주다.',
  [[
    `<span class="eyebrow">KRL122 · Lesson 8</span>
<h2>Honorifics &amp; ongoing action (으시다, 고 있다, 아/어 주다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>할아버지 / 할머니</td><td>harabeoji / halmeoni</td><td>grandfather / grandmother</td></tr>
<tr><td>선생님</td><td>seonsaengnim</td><td>teacher</td></tr>
<tr><td>신문</td><td>sinmun</td><td>newspaper</td></tr>
<tr><td>계시다</td><td>gyesida</td><td>to be (honorific of 있다)</td></tr>
<tr><td>드시다</td><td>deusida</td><td>to eat (honorific of 먹다)</td></tr>
</tbody></table>
<h3>Grammar — respect, progressive, doing a favor</h3>
<ul>
<li><strong>V + -(으)시</strong> = subject honorific: 가시다 → 가세요, 읽으시다 → 읽으세요, 하시다 → 하세요. Special words: 있다 → 계시다, 먹다 → 드시다.</li>
<li><strong>V + 고 있다</strong> = be -ing (ongoing): 밥을 먹고 있어요 = I am eating.</li>
<li><strong>V + 아/어 주다</strong> = do (something) for someone: 도와주다 (help), 사 주다 (buy for), 찍어 주다 (take a photo for).</li>
</ul>
<pre><code>할아버지께서 신문을 읽으세요. harabeojikkeseo sinmun-eul ilgeuseyo. = Grandfather is reading the newspaper. (honorific)
친구가 밥을 먹고 있어요.     chinguga bab-eul meokgo isseoyo.      = My friend is eating.
사진 좀 찍어 주세요.         sajin jom jjigeo juseyo.               = Please take a photo for me.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 선생님 지금 뭐 하세요? (Seonsaengnim jigeum mwo haseyo?)</p>
<p><strong>B:</strong> 교실에 계세요. 책을 읽고 계세요. (Gyosir-e gyeseyo. Chaeg-eul ilgo gyeseyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> For elders, use the honorific subject particle 께서 (not 이/가) and add 으시: 할아버지께서 …읽으세요. Honorific 계시다 replaces 있다, so "is reading (respected)" = 읽고 계세요.</div>`,
    `<span class="eyebrow">KRL122 · Bài 8</span>
<h2>Kính ngữ &amp; tường thuật (으시다, 고 있다, 아/어 주다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>할아버지 / 할머니</td><td>harabeoji / halmeoni</td><td>ông / bà</td></tr>
<tr><td>선생님</td><td>seonsaengnim</td><td>thầy / cô giáo</td></tr>
<tr><td>신문</td><td>sinmun</td><td>báo</td></tr>
<tr><td>계시다</td><td>gyesida</td><td>ở (kính ngữ của 있다)</td></tr>
<tr><td>드시다</td><td>deusida</td><td>ăn/dùng (kính ngữ của 먹다)</td></tr>
</tbody></table>
<h3>Ngữ pháp — tôn kính, tiếp diễn, làm giúp</h3>
<ul>
<li><strong>V + -(으)시</strong> = kính ngữ chủ ngữ: 가시다 → 가세요, 읽으시다 → 읽으세요, 하시다 → 하세요. Từ đặc biệt: 있다 → 계시다, 먹다 → 드시다.</li>
<li><strong>V + 고 있다</strong> = đang (tiếp diễn): 밥을 먹고 있어요 = tôi đang ăn cơm.</li>
<li><strong>V + 아/어 주다</strong> = làm (gì đó) giúp ai: 도와주다 (giúp đỡ), 사 주다 (mua cho), 찍어 주다 (chụp ảnh giúp).</li>
</ul>
<pre><code>할아버지께서 신문을 읽으세요. harabeojikkeseo sinmun-eul ilgeuseyo. = Ông đang đọc báo. (kính ngữ)
친구가 밥을 먹고 있어요.     chinguga bab-eul meokgo isseoyo.      = Bạn tôi đang ăn cơm.
사진 좀 찍어 주세요.         sajin jom jjigeo juseyo.               = Chụp giúp tôi tấm ảnh với.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 선생님 지금 뭐 하세요? (Seonsaengnim jigeum mwo haseyo?)</p>
<p><strong>B:</strong> 교실에 계세요. 책을 읽고 계세요. (Gyosir-e gyeseyo. Chaeg-eul ilgo gyeseyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Với người lớn, dùng trợ từ kính ngữ 께서 (thay 이/가) và thêm 으시: 할아버지께서 …읽으세요. Kính ngữ 계시다 thay cho 있다, nên "đang đọc (kính)" = 읽고 계세요.</div>`,
  ]]);
const b8q = quiz('krl122-quiz-8', 'Quiz 8 — Honorifics|||Quiz 8 — Kính ngữ & tường thuật', [
  { id: 'q1', question: 'The honorific of 있다 (to be/exist) is…|||Kính ngữ của 있다 (ở/tồn tại) là…', options: ['드시다', '계시다', '주무시다', '하시다'], correctIndex: 1, explanation: '있다 → 계시다 (kính ngữ); 먹다 → 드시다; 자다 → 주무시다.' },
  { id: 'q2', question: '"밥을 먹고 있어요" means…|||"밥을 먹고 있어요" nghĩa là gì?', options: ['I will eat|||Tôi sẽ ăn', 'I ate|||Tôi đã ăn', 'I am eating (right now)|||Tôi đang ăn (ngay lúc này)', 'I want to eat|||Tôi muốn ăn'], correctIndex: 2, explanation: 'V + 고 있다 = đang làm; 먹고 있어요 = đang ăn.' },
  { id: 'q3', question: '"사진 좀 찍어 주세요" asks someone to…|||"사진 좀 찍어 주세요" nhờ ai đó làm gì?', options: ['stop taking photos|||ngừng chụp ảnh', 'take a photo for me|||chụp ảnh giúp tôi', 'buy a photo|||mua ảnh', 'look at a photo|||nhìn ảnh'], correctIndex: 1, explanation: 'V + 아/어 주다 = làm giúp; 찍어 주세요 = chụp (ảnh) giúp tôi.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'KRL122',
    slug: 'krl122-elementary-korean-2',
    title: 'Elementary Korean 2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KRL122.webp',
    shortDescription: 'Elementary Korean 2, following KRL112: plans (을 거예요), wanting & trying (고 싶다), reasons (아서/어서), ability & permission (을 수 있다), verb modifiers, comparison, conditions & commands (으세요), honorifics (으시다). Bilingual Korean-Vietnamese, TOPIK I.|||Tiếng Hàn sơ cấp 2, nối tiếp KRL112: kế hoạch (을 거예요), muốn & thử (고 싶다), lý do (아서/어서), khả năng & cho phép (을 수 있다), định ngữ & mệnh đề thời gian, so sánh, điều kiện & mệnh lệnh (으세요), kính ngữ (으시다, 고 있다). Song ngữ Hàn-Việt, TOPIK I.',
    description: 'Môn <strong>KRL122 — Elementary Korean 2</strong> (Tiếng Hàn sơ cấp 2, Kỳ 2, ngành Ngôn ngữ Hàn) nối tiếp <strong>KRL112</strong>. Từ nền Hangul, trợ từ và thì hiện tại/quá khứ, môn này mở rộng: <strong>quá khứ &amp; kế hoạch</strong> (을 거예요) → <strong>muốn &amp; thử</strong> (고 싶다, 아/어 보다, 을게요) → <strong>lý do &amp; tương phản</strong> (아서/어서, 지만, 는데) → <strong>khả năng &amp; cho phép</strong> (을 수 있다, 아도 되다, 으면 안 되다) → <strong>định ngữ động từ &amp; thời gian</strong> (는/은/을, 을 때, 기 전에) → <strong>so sánh</strong> (보다, 제일, 아/어지다) → <strong>điều kiện &amp; mệnh lệnh</strong> (으면, 으세요, 읍시다, 지 마세요) → <strong>kính ngữ &amp; tường thuật</strong> (으시다, 고 있다, 아/어 주다). Bám giáo trình Sejong Korean 1-2 / Ewha, song ngữ Hàn-Việt, có bảng từ vựng, ngữ pháp, hội thoại và quiz mỗi bài. Trình độ TOPIK I.',
    whatYouLearn: 'Dùng thì tương lai/dự định 을 거예요; diễn đạt mong muốn 고 싶다, thử 아/어 보다, ý chí 을게요; nối câu bằng lý do 아서/어서, tương phản 지만·는데; nói khả năng 을 수 있다/없다, cho phép 아도 되다 và cấm 으면 안 되다; tạo định ngữ động từ 는/은/을 và mệnh đề thời gian 을 때·기 전에·은 후에; so sánh 보다·제일 và biến đổi 아/어지다; đặt điều kiện 으면, ra mệnh lệnh lịch sự 으세요, rủ 읍시다, cấm 지 마세요; và nói kính ngữ 으시다 (계시다, 드시다), tiếp diễn 고 있다, giúp đỡ 아/어 주다.',
    requirements: 'Đã học xong KRL112 (Elementary Korean 1) hoặc tương đương: đọc thành thạo Hangul, biết trợ từ cơ bản, thì hiện tại 아요/어요/해요 và quá khứ 았/었어요. Cần luyện nói hội thoại thành tiếng mỗi ngày.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Sejong 1-2/Ewha, từ điển Naver, app, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp KRL112, mục tiêu TOPIK I, bản đồ 8 bài.', lessons: [intro] },
    { title: 'Bài 1 — Quá khứ & kế hoạch|||Lesson 1 — Past & plans', description: 'Ôn 았/었어요, tương lai 을 거예요.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Muốn & thử|||Lesson 2 — Wanting & trying', description: '고 싶다, 아/어 보다, 을게요.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Lý do & tương phản|||Lesson 3 — Reason & contrast', description: '아서/어서, 지만, 는데.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Khả năng & cho phép|||Lesson 4 — Ability & permission', description: '을 수 있다/없다, 아도 되다, 으면 안 되다.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Định ngữ & thời gian|||Lesson 5 — Modifiers & time', description: '는/은/을 định ngữ, 을 때, 기 전에/은 후에.', lessons: [b5, b5q] },
    { title: 'Bài 6 — So sánh & mức độ|||Lesson 6 — Comparison', description: '보다, 제일/가장, 아/어지다.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Điều kiện & mệnh lệnh|||Lesson 7 — Conditions & commands', description: '으면, 으세요, 읍시다, 지 마세요.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Kính ngữ & tường thuật|||Lesson 8 — Honorifics', description: '으시다, 계시다/드시다, 고 있다, 아/어 주다.', lessons: [b8, b8q] },
  ],
};
