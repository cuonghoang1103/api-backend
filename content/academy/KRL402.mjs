/**
 * KRL402 — Intermediate Korean 3 (Tiếng Hàn trung cấp 3). Khối Ngôn ngữ Hàn FPTU, Kỳ 5.
 * NỐI TIẾP KRL322 — Intermediate Korean 2. Giáo trình chuẩn: 세종한국어 Sejong Korean 6;
 * trình độ TOPIK II (trung – cao cấp).
 * MÔN NGÔN NGỮ — mỗi bài: từ vựng, ngữ pháp + mẫu câu (chú ý chia đuôi/bất quy tắc,
 * hoà thanh 아/어), hội thoại, ghi chú. Hangul + Revised Romanization + nghĩa tiếng Việt.
 * bi(e,v): e = trình bày Hàn+Anh, v = giải thích tiếng Việt.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 300, questions } });

/* ── Tài liệu ────────────────────────────────────────────────────────────── */
const taiLieu = doc('krl402-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình Sejong Korean 6 / Ewha, app TOPIK ONE / Anki, từ điển Naver, YouTube, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">KRL402 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need for <strong>Intermediate Korean 3</strong> — building on the strong concession, contrast, inevitability, supposition, extent, ending-up, recollection and similes of <strong>KRL322</strong> toward condition, past counterfactuals, plausibility, backdrop, near-misses, far-from, disruptive cause and counterfactual concession — in one place. The official FPTU giáo trình &amp; slides live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbooks</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 6</em> — King Sejong Institute (free PDF &amp; audio)</a></li>
<li><em>Ewha Korean 5</em> — Ewha Womans University Press</li>
</ul>
<h3>🌐 Dictionaries &amp; apps</h3>
<ul>
<li><a href="https://korean.dict.naver.com/" target="_blank" rel="noopener">Naver Korean Dictionary (한국어사전)</a></li>
<li>TOPIK ONE (mobile) — TOPIK II vocabulary &amp; grammar drills</li>
<li>Anki — spaced-repetition flashcards for vocab &amp; verb endings</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — intermediate grammar &amp; listening</li>
<li><a href="https://www.youtube.com/@GoBillyKorean" target="_blank" rel="noopener">Go! Billy Korean</a> — grammar &amp; pronunciation</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Review KRL322</strong> — strong concession (더라도, 아/어 봤자), contrast (는 반면에, 는 데 반해), inevitability (기 마련이다), supposition (는 셈치고, 은 셈이다), extent (을 정도로, 을 만큼), ending-up (고 말다, 아/어 버리다), recollection (더라, 던데요), similes (다시피, 듯이).</li>
<li><strong>Set conditions &amp; look back</strong> — condition 는 한, 는 이상; past counterfactual 았/었더라면; plausibility 을 법하다, 음직하다.</li>
<li><strong>Frame the situation</strong> — backdrop 는 가운데, 와중에; near-miss 을락 말락, 을 듯 말 듯; far-from 기는커녕, 은커녕.</li>
<li><strong>Give cause &amp; concede</strong> — disruptive cause 는 통에, 느라고; counterfactual concession 았/었던들, 던들; aim at solid TOPIK II.</li>
</ol></div>`,
    `<span class="eyebrow">KRL402 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho <strong>Tiếng Hàn trung cấp 3</strong> — dựng tiếp trên nhượng bộ mạnh, tương phản, tất yếu, giả định, mức độ, rốt cuộc, hồi tưởng và so sánh của <strong>KRL322</strong> để tiến tới điều kiện, giả định quá khứ, tính hợp lý, bối cảnh, chực-mà-chưa, nói-gì-đến, nguyên nhân rối ren và nhượng bộ trái thực tế — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 6</em> — Viện King Sejong (PDF &amp; audio miễn phí)</a></li>
<li><em>Ewha Korean 5</em> — NXB Đại học Ewha</li>
</ul>
<h3>🌐 Từ điển &amp; ứng dụng</h3>
<ul>
<li><a href="https://korean.dict.naver.com/" target="_blank" rel="noopener">Từ điển Naver (한국어사전)</a></li>
<li>TOPIK ONE (điện thoại) — luyện từ vựng &amp; ngữ pháp TOPIK II</li>
<li>Anki — thẻ ghi nhớ lặp lại ngắt quãng cho từ vựng &amp; đuôi động từ</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — ngữ pháp &amp; nghe trung cấp</li>
<li><a href="https://www.youtube.com/@GoBillyKorean" target="_blank" rel="noopener">Go! Billy Korean</a> — ngữ pháp &amp; phát âm</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Ôn lại KRL322</strong> — nhượng bộ mạnh (더라도, 아/어 봤자), tương phản (는 반면에, 는 데 반해), tất yếu (기 마련이다), giả định (는 셈치고, 은 셈이다), mức độ (을 정도로, 을 만큼), rốt cuộc (고 말다, 아/어 버리다), hồi tưởng (더라, 던데요), so sánh (다시피, 듯이).</li>
<li><strong>Đặt điều kiện &amp; nhìn lại</strong> — điều kiện 는 한, 는 이상; giả định quá khứ 았/었더라면; hợp lý 을 법하다, 음직하다.</li>
<li><strong>Dựng bối cảnh</strong> — bối cảnh 는 가운데, 와중에; chực mà chưa 을락 말락, 을 듯 말 듯; nói gì đến 기는커녕, 은커녕.</li>
<li><strong>Nêu nguyên nhân &amp; nhượng bộ</strong> — nguyên nhân rối ren 는 통에, 느라고; nhượng bộ trái thực tế 았/었던들, 던들; hướng tới TOPIK II vững.</li>
</ol></div>`,
  ]]);

/* ── Giới thiệu môn ──────────────────────────────────────────────────────── */
const intro = doc('krl402-0-1-overview', 'Course overview: from KRL322 onward|||Tổng quan: nối tiếp từ KRL322',
  'Mục tiêu môn (trung cấp, TOPIK II), nhắc lại nền tảng KRL322, và bản đồ ngữ pháp 8 bài.',
  [[
    `<span class="eyebrow">KRL402 · Lesson 0.1 · Overview</span>
<h2>Intermediate Korean 3</h2>
<p class="lead">This course continues <strong>Intermediate Korean 2 (KRL322)</strong>. You already make strong concessions (더라도, 아/어 봤자), draw contrasts (는 반면에), state what is inevitable (기 마련이다), argue from a supposition (는 셈치고), measure degree (을 정도로), describe how things end up (고 말다), recall first-hand experience (더라) and build similes (다시피, 듯이). Now you will <strong>set conditions, imagine an unreal past, judge what is plausible, frame a backdrop, describe a near-miss, dismiss with far-from, give a disruptive cause, and concede an unreal past</strong> — the upper edge of <strong>intermediate (TOPIK II)</strong> Korean.</p>
<h3>What KRL322 gave you</h3>
<p>KRL322 built the mid-intermediate base: strong concession, contrast, inevitability, supposition, extent, ending-up, recollection and similes. This course assumes all of that.</p>
<h3>Roadmap of the 8 lessons</h3>
<p>Condition (는 한, 는 이상) → past counterfactual (았/었더라면) → plausibility (을 법하다, 음직하다) → backdrop (는 가운데, 와중에) → near-miss (을락 말락, 을 듯 말 듯) → far-from (기는커녕, 은커녕) → disruptive cause (는 통에, 느라고) → counterfactual concession (았/었던들, 던들). Bilingual Korean-Vietnamese, with vocabulary tables, grammar notes, short dialogues and a quiz each lesson.</p>
<div class="callout"><span class="badge">Politeness level</span> This course keeps the <strong>해요체</strong> (polite -요 style) and the formal <strong>합니다체</strong> for the news-style and written patterns (는 가운데, 았/었던들). Several patterns carry a strong feeling — regret (았/었더라면), dismissal (기는커녕), frustration (는 통에) — rather than plain information; the notes flag that nuance, because it is what separates upper TOPIK II from mid-intermediate Korean.</div>`,
    `<span class="eyebrow">KRL402 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Hàn trung cấp 3</h2>
<p class="lead">Môn này nối tiếp <strong>Tiếng Hàn trung cấp 2 (KRL322)</strong>. Bạn đã nhượng bộ mạnh (더라도, 아/어 봤자), dựng tương phản (는 반면에), nêu điều tất yếu (기 마련이다), lập luận từ giả định (는 셈치고), đo mức độ (을 정도로), tả cách sự việc kết thúc (고 말다), hồi tưởng điều tận mắt (더라) và tạo phép so sánh (다시피, 듯이). Giờ bạn sẽ <strong>đặt điều kiện, hình dung một quá khứ không thật, đánh giá điều hợp lý, dựng bối cảnh, tả trạng thái chực-mà-chưa, phủ định bằng nói-gì-đến, nêu nguyên nhân rối ren, và nhượng bộ một quá khứ trái thực tế</strong> — ngưỡng trên của tiếng Hàn <strong>trung cấp (TOPIK II)</strong>.</p>
<h3>KRL322 đã cho bạn gì</h3>
<p>KRL322 dựng nền giữa trung cấp: nhượng bộ mạnh, tương phản, tất yếu, giả định, mức độ, rốt cuộc, hồi tưởng và so sánh. Môn này giả định bạn đã nắm hết.</p>
<h3>Bản đồ 8 bài</h3>
<p>Điều kiện (는 한, 는 이상) → giả định quá khứ (았/었더라면) → hợp lý (을 법하다, 음직하다) → bối cảnh (는 가운데, 와중에) → chực mà chưa (을락 말락, 을 듯 말 듯) → nói gì đến (기는커녕, 은커녕) → nguyên nhân rối ren (는 통에, 느라고) → nhượng bộ trái thực tế (았/었던들, 던들). Song ngữ Hàn-Việt, có bảng từ vựng, ghi chú ngữ pháp, hội thoại ngắn và quiz mỗi bài.</p>
<div class="callout"><span class="badge">Bậc lịch sự</span> Môn này giữ <strong>해요체</strong> (thể lịch sự đuôi -요) và dùng thêm <strong>합니다체</strong> trang trọng cho các cấu trúc kiểu bản tin, văn viết (는 가운데, 았/었던들). Nhiều cấu trúc mang sắc thái tình cảm mạnh — tiếc nuối (았/었더라면), gạt phăng (기는커녕), bực bội (는 통에) — chứ không chỉ đưa thông tin thuần; phần ghi chú nêu rõ sắc thái đó, vì đây chính là thứ tách TOPIK II cao khỏi trung cấp giữa.</div>`,
  ]]);

/* ── Bài 1 — Điều kiện: một khi / miễn là ───────────────────────────────── */
const b1 = doc('krl402-1-1-condition', 'Lesson 1 — As long as / given that|||Bài 1 — Một khi, miễn là',
  'V + 는 한 (chừng nào còn, miễn là), V + (으)ㄴ/는 이상 (một khi đã, đã... thì).',
  [[
    `<span class="eyebrow">KRL402 · Lesson 1</span>
<h2>As long as / given that (는 한, 는 이상)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>규칙</td><td>gyuchik</td><td>rule, regulation</td></tr>
<tr><td>지키다</td><td>jikida</td><td>to keep, observe</td></tr>
<tr><td>약속</td><td>yaksok</td><td>promise, appointment</td></tr>
<tr><td>책임</td><td>chaegim</td><td>responsibility</td></tr>
<tr><td>최선</td><td>choeseon</td><td>one&apos;s best</td></tr>
<tr><td>허락하다</td><td>heorakhada</td><td>to permit, allow</td></tr>
</tbody></table>
<h3>Grammar — as long as, and now that / given that</h3>
<ul>
<li><strong>V + 는 한</strong> = as long as / so long as (the condition holds, so does the result): 규칙을 지키는 한 문제없어요. 내가 살아 있는 한 포기하지 않을 거예요.</li>
<li><strong>V + -(으)ㄴ/는 이상, N인 이상</strong> = now that / given that (state a premise, then draw an obligation or sure result); pairs with -아/어야 하다, -겠-: 약속한 이상 꼭 지켜야 해요. 학생인 이상 공부해야죠.</li>
</ul>
<pre><code>건강을 지키는 한 무엇이든 할 수 있어요. geongang-eul jikineun han mueosideun hal su isseoyo. = As long as you keep your health, you can do anything.
학생인 이상 공부를 열심히 해야 해요. haksaeng-in isang gongbureul yeolsimhi haeya haeyo. = Given that you are a student, you must study hard.
시작한 이상 최선을 다하겠습니다. sijakhan isang choeseoneul dahagesseumnida. = Now that I have started, I will do my best.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 이 프로젝트, 정말 끝낼 수 있을까요? (I peurojekteu, jeongmal kkeutnael su isseulkkayo?)</p>
<p><strong>B:</strong> 우리가 포기하지 않는 한 반드시 끝낼 수 있어요. 맡은 이상 책임을 다해야죠. (Uriga pogihaji anneun han bandeusi kkeutnael su isseoyo. Mateun isang chaegim-eul dahaeyajyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 는 한 sets a CONDITION that must stay true — "for as long as X, then Y" — and often appears with a negative inside (포기하지 않는 한 = as long as we do not give up). 는 이상 states an accepted PREMISE and draws a natural obligation or certainty from it, so the second clause typically carries -아/어야 하다 or -겠-. Use -(으)ㄴ 이상 for a completed premise (약속한 이상), N인 이상 for a noun (학생인 이상).</div>`,
    `<span class="eyebrow">KRL402 · Bài 1</span>
<h2>Một khi, miễn là (는 한, 는 이상)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>규칙</td><td>gyuchik</td><td>quy tắc, nội quy</td></tr>
<tr><td>지키다</td><td>jikida</td><td>giữ, tuân thủ</td></tr>
<tr><td>약속</td><td>yaksok</td><td>lời hứa, cuộc hẹn</td></tr>
<tr><td>책임</td><td>chaegim</td><td>trách nhiệm</td></tr>
<tr><td>최선</td><td>choeseon</td><td>sự cố gắng hết sức</td></tr>
<tr><td>허락하다</td><td>heorakhada</td><td>cho phép</td></tr>
</tbody></table>
<h3>Ngữ pháp — chừng nào còn, và một khi đã / đã... thì</h3>
<ul>
<li><strong>V + 는 한</strong> = miễn là / chừng nào còn (điều kiện còn giữ thì kết quả còn đúng): 규칙을 지키는 한 문제없어요. 내가 살아 있는 한 포기하지 않을 거예요.</li>
<li><strong>V + -(으)ㄴ/는 이상, N인 이상</strong> = một khi đã / đã... thì (nêu tiền đề rồi rút ra bổn phận hoặc kết quả tất nhiên); hay đi với -아/어야 하다, -겠-: 약속한 이상 꼭 지켜야 해요. 학생인 이상 공부해야죠.</li>
</ul>
<pre><code>건강을 지키는 한 무엇이든 할 수 있어요. geongang-eul jikineun han mueosideun hal su isseoyo. = Miễn là giữ được sức khoẻ thì làm gì cũng được.
학생인 이상 공부를 열심히 해야 해요. haksaeng-in isang gongbureul yeolsimhi haeya haeyo. = Đã là học sinh thì phải học hành chăm chỉ.
시작한 이상 최선을 다하겠습니다. sijakhan isang choeseoneul dahagesseumnida. = Một khi đã bắt đầu, tôi sẽ cố gắng hết sức.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 이 프로젝트, 정말 끝낼 수 있을까요? (I peurojekteu, jeongmal kkeutnael su isseulkkayo?)</p>
<p><strong>B:</strong> 우리가 포기하지 않는 한 반드시 끝낼 수 있어요. 맡은 이상 책임을 다해야죠. (Uriga pogihaji anneun han bandeusi kkeutnael su isseoyo. Mateun isang chaegim-eul dahaeyajyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 는 한 đặt một ĐIỀU KIỆN phải luôn đúng — "chừng nào còn X thì Y" — và hay có phủ định bên trong (포기하지 않는 한 = miễn là không bỏ cuộc). 는 이상 nêu một TIỀN ĐỀ đã được chấp nhận rồi rút ra bổn phận hay điều tất nhiên, nên vế sau thường mang -아/어야 하다 hoặc -겠-. Dùng -(으)ㄴ 이상 cho tiền đề đã hoàn tất (약속한 이상), N인 이상 cho danh từ (학생인 이상).</div>`,
  ]]);
const b1q = quiz('krl402-quiz-1', 'Quiz 1 — As long as / given that|||Quiz 1 — Một khi, miễn là', [
  { id: 'q1', question: 'Which sets a CONDITION that must stay true ("for as long as X")?|||Đâu đặt một ĐIỀU KIỆN phải luôn đúng ("chừng nào còn X")?', options: ['-는 한', '-는 이상', '-더라면', '-는 통에'], correctIndex: 0, explanation: 'V + 는 한 = miễn là / chừng nào còn; điều kiện còn giữ thì kết quả còn đúng.' },
  { id: 'q2', question: 'After 는 이상, the second clause usually carries…|||Sau 는 이상, vế sau thường mang…', options: ['a plain fact only|||chỉ một sự thật thuần', 'obligation or certainty (-아/어야 하다, -겠-)|||bổn phận hoặc điều tất nhiên (-아/어야 하다, -겠-)', 'a question|||một câu hỏi', 'a wish|||một mong ước'], correctIndex: 1, explanation: '는 이상 nêu tiền đề rồi rút ra bổn phận/kết quả tất nhiên: 약속한 이상 지켜야 해요.' },
  { id: 'q3', question: '학생 (noun) + 이상 becomes…|||학생 (danh từ) + 이상 thành…', options: ['학생는 이상', '학생인 이상', '학생을 이상', '학생던 이상'], correctIndex: 1, explanation: 'Danh từ lấy N인 이상: 학생 → 학생인 이상 = đã là học sinh thì.' },
]);

/* ── Bài 2 — Giả định quá khứ ───────────────────────────────────────────── */
const b2 = doc('krl402-2-1-past-counterfactual', 'Lesson 2 — If only I had…|||Bài 2 — Giả định quá khứ',
  'V/A + 았/었더라면 (giá mà đã..., nếu khi trước đã... thì; trái thực tế, tiếc nuối).',
  [[
    `<span class="eyebrow">KRL402 · Lesson 2</span>
<h2>If only I had (았/었더라면)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>미리</td><td>miri</td><td>in advance, beforehand</td></tr>
<tr><td>서두르다</td><td>seodureuda</td><td>to hurry (르 irregular)</td></tr>
<tr><td>조심하다</td><td>josimhada</td><td>to be careful</td></tr>
<tr><td>실패하다</td><td>silpaehada</td><td>to fail</td></tr>
<tr><td>기회</td><td>gihoe</td><td>chance, opportunity</td></tr>
<tr><td>놓치다</td><td>nochida</td><td>to miss, let slip</td></tr>
</tbody></table>
<h3>Grammar — if (only) it had been / had happened</h3>
<ul>
<li><strong>V/A + 았/었더라면</strong> = if (back then) it had (been)... (contrary to past fact, with regret); the second clause is usually -았/었을 텐데(요) or -았/었을 거예요: 조금만 일찍 출발했더라면 기차를 놓치지 않았을 거예요.</li>
<li>Vowel harmony: 갔더라면, 먹었더라면, 했더라면. Different from 았/었으면 (a wish, KRL312): 더라면 stresses the regret over what did NOT happen.</li>
</ul>
<pre><code>조금만 더 조심했더라면 사고가 안 났을 거예요. jogeumman deo josimhaetdeoramyeon sagoga an nasseul geoyeyo. = If I had been a bit more careful, the accident would not have happened.
그때 그 기회를 잡았더라면 지금쯤 성공했을 텐데요. geuttae geu gihoereul jabatdeoramyeon jigeumjjeum seonggonghaesseul tende-yo. = If I had seized that chance then, I would have succeeded by now.
미리 알았더라면 도와줬을 거예요. miri aratdeoramyeon dowajwosseul geoyeyo. = If I had known in advance, I would have helped.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 시험 결과가 안 좋아서 너무 속상해요. (Siheom gyeolgwaga an joaseo neomu soksanghaeyo.)</p>
<p><strong>B:</strong> 조금만 더 일찍 준비했더라면 좋았을 텐데요. 그래도 다음 기회가 또 있잖아요. (Jogeumman deo iljjik junbihaetdeoramyeon joasseul tende-yo. Geuraedo da-eum gihoega tto itjanhayo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 았/었더라면 talks about something that did NOT happen in the past (contrary to fact) and voices regret or a what-if. It always sits in the past and pairs with a past-hypothetical result (-았/었을 텐데, -았/었을 거예요). Compare 았/었으면 하다 (a present wish): 더라면 looks BACK with regret at an unchangeable past, not forward at a hope.</div>`,
    `<span class="eyebrow">KRL402 · Bài 2</span>
<h2>Giả định quá khứ (았/었더라면)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>미리</td><td>miri</td><td>trước, từ trước</td></tr>
<tr><td>서두르다</td><td>seodureuda</td><td>vội vàng (bất quy tắc 르)</td></tr>
<tr><td>조심하다</td><td>josimhada</td><td>cẩn thận</td></tr>
<tr><td>실패하다</td><td>silpaehada</td><td>thất bại</td></tr>
<tr><td>기회</td><td>gihoe</td><td>cơ hội</td></tr>
<tr><td>놓치다</td><td>nochida</td><td>bỏ lỡ, để tuột</td></tr>
</tbody></table>
<h3>Ngữ pháp — giá mà (khi trước) đã... thì</h3>
<ul>
<li><strong>V/A + 았/었더라면</strong> = giá mà (khi trước) đã... thì (trái với thực tế quá khứ, kèm tiếc nuối); vế sau thường -았/었을 텐데(요) hoặc -았/었을 거예요: 조금만 일찍 출발했더라면 기차를 놓치지 않았을 거예요.</li>
<li>Hoà thanh: 갔더라면, 먹었더라면, 했더라면. Khác 았/었으면 (mong ước, KRL312): 더라면 nhấn sự tiếc nuối về điều đã KHÔNG xảy ra.</li>
</ul>
<pre><code>조금만 더 조심했더라면 사고가 안 났을 거예요. jogeumman deo josimhaetdeoramyeon sagoga an nasseul geoyeyo. = Giá mà cẩn thận thêm một chút thì tai nạn đã không xảy ra.
그때 그 기회를 잡았더라면 지금쯤 성공했을 텐데요. geuttae geu gihoereul jabatdeoramyeon jigeumjjeum seonggonghaesseul tende-yo. = Giá mà khi đó chớp lấy cơ hội ấy thì giờ này đã thành công rồi.
미리 알았더라면 도와줬을 거예요. miri aratdeoramyeon dowajwosseul geoyeyo. = Giá mà biết trước thì tôi đã giúp rồi.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 시험 결과가 안 좋아서 너무 속상해요. (Siheom gyeolgwaga an joaseo neomu soksanghaeyo.)</p>
<p><strong>B:</strong> 조금만 더 일찍 준비했더라면 좋았을 텐데요. 그래도 다음 기회가 또 있잖아요. (Jogeumman deo iljjik junbihaetdeoramyeon joasseul tende-yo. Geuraedo da-eum gihoega tto itjanhayo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 았/었더라면 nói về điều đã KHÔNG xảy ra trong quá khứ (trái thực tế), bày tỏ tiếc nuối hoặc giả định "giá mà". Nó luôn ở thì quá khứ và đi với vế sau giả định quá khứ (-았/었을 텐데, -았/었을 거예요). So với 았/었으면 하다 (mong ước ở hiện tại): 더라면 NHÌN LẠI với sự tiếc nuối về một quá khứ không đổi được, không hướng tới một mong muốn phía trước.</div>`,
  ]]);
const b2q = quiz('krl402-quiz-2', 'Quiz 2 — If only I had|||Quiz 2 — Giả định quá khứ', [
  { id: 'q1', question: '았/었더라면 refers to something that…|||았/었더라면 nói về điều…', options: ['is happening now|||đang xảy ra bây giờ', 'did NOT happen in the past (contrary to fact)|||đã KHÔNG xảy ra trong quá khứ (trái thực tế)', 'will surely happen|||chắc chắn sẽ xảy ra', 'happens every day|||xảy ra mỗi ngày'], correctIndex: 1, explanation: '더라면 là giả định trái thực tế quá khứ, kèm tiếc nuối.' },
  { id: 'q2', question: 'The second clause of a 더라면 sentence usually ends in…|||Vế sau của câu 더라면 thường kết thúc bằng…', options: ['-(으)ㄹ 거예요 (future)|||-(으)ㄹ 거예요 (tương lai)', '-았/었을 텐데 / -았/었을 거예요|||-았/었을 텐데 / -았/었을 거예요', '-고 있어요|||-고 있어요', '-(으)세요|||-(으)세요'], correctIndex: 1, explanation: 'Vế sau là giả định quá khứ: -았/었을 텐데(요), -았/었을 거예요.' },
  { id: 'q3', question: 'How does 았/었더라면 differ from 았/었으면 하다?|||았/었더라면 khác 았/었으면 하다 ở chỗ nào?', options: ['same meaning|||nghĩa giống hệt', '더라면 looks back with regret; 았/었으면 하다 is a present wish|||더라면 nhìn lại tiếc nuối; 았/었으면 하다 là mong ước hiện tại', '더라면 is a command|||더라면 là mệnh lệnh', '더라면 is only for the future|||더라면 chỉ dùng cho tương lai'], correctIndex: 1, explanation: '더라면 tiếc nuối về quá khứ không đổi được; 았/었으면 하다 là mong ước phía trước.' },
]);

/* ── Bài 3 — Có vẻ hợp lý ───────────────────────────────────────────────── */
const b3 = doc('krl402-3-1-plausible', 'Lesson 3 — Plausible / likely|||Bài 3 — Có vẻ hợp lý',
  'V + (으)ㄹ 법하다 (nghe cũng có lý, rất có thể), (으)ㅁ직하다 (đáng..., có thể có thật).',
  [[
    `<span class="eyebrow">KRL402 · Lesson 3</span>
<h2>Plausible / likely (을 법하다, 음직하다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>가능성</td><td>ganeungseong</td><td>possibility, likelihood</td></tr>
<tr><td>충분히</td><td>chungbunhi</td><td>sufficiently, quite</td></tr>
<tr><td>소문</td><td>somun</td><td>rumor</td></tr>
<tr><td>상황</td><td>sanghwang</td><td>situation</td></tr>
<tr><td>반응</td><td>baneung</td><td>reaction, response</td></tr>
<tr><td>당연하다</td><td>dangyeonhada</td><td>to be natural, obvious</td></tr>
</tbody></table>
<h3>Grammar — it is plausible that, and worth / likely to be</h3>
<ul>
<li><strong>V + -(으)ㄹ 법하다</strong> = it is plausible / one could well expect that; it makes sense: 그럴 법한 이야기예요. 화가 날 법도 해요.</li>
<li><strong>-(으)ㅁ직하다</strong> = worth (doing) / likely to be so; mostly fixed words: 먹음직하다 (looks appetizing), 믿음직하다 (reliable), 있음직하다 (plausible that it exists), 바람직하다 (desirable).</li>
</ul>
<pre><code>그런 소문이 날 법도 해요. geureon somuni nal beopdo haeyo. = It is quite plausible that such a rumor would spread.
누구나 한 번쯤 실수할 법한 일이에요. nuguna han beonjjeum silsuhal beopan iri-eyo. = It is the kind of mistake anyone could plausibly make once.
음식이 아주 먹음직해 보여요. eumsig-i aju meogeumjikae boyeoyo. = The food looks really appetizing.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 그 사람이 회사를 그만뒀다는 소문 들었어요? (Geu sarami hoesareul geumandwotdaneun somun deureosseoyo?)</p>
<p><strong>B:</strong> 네, 요즘 힘들어 보였으니까 그럴 법도 해요. 그래도 좀 더 믿음직한 사람에게 확인해 봐야겠어요. (Ne, yojeum himdeureo boyeosseunikka geureol beopdo haeyo. Geuraedo jom deo mideumjikan saram-ege hwaginhae bwayagesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> -(으)ㄹ 법하다 judges something as plausible, reasonable, easy to imagine — it often appears as 그럴 법하다 / -도 하다. -(으)ㅁ직하다 is largely lexicalized: learn it through the fixed words 먹음직하다, 믿음직하다, 있음직하다, 바람직하다 rather than attaching it freely, and note it carries a sense of worth or likelihood ("worth eating", "worth trusting").</div>`,
    `<span class="eyebrow">KRL402 · Bài 3</span>
<h2>Có vẻ hợp lý (을 법하다, 음직하다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>가능성</td><td>ganeungseong</td><td>khả năng, tính khả thi</td></tr>
<tr><td>충분히</td><td>chungbunhi</td><td>đủ, khá</td></tr>
<tr><td>소문</td><td>somun</td><td>tin đồn</td></tr>
<tr><td>상황</td><td>sanghwang</td><td>tình huống, hoàn cảnh</td></tr>
<tr><td>반응</td><td>baneung</td><td>phản ứng</td></tr>
<tr><td>당연하다</td><td>dangyeonhada</td><td>đương nhiên, hiển nhiên</td></tr>
</tbody></table>
<h3>Ngữ pháp — nghe cũng có lý, và đáng... / có thể có thật</h3>
<ul>
<li><strong>V + -(으)ㄹ 법하다</strong> = có vẻ hợp lý / rất có thể / cũng dễ hiểu thôi: 그럴 법한 이야기예요. 화가 날 법도 해요.</li>
<li><strong>-(으)ㅁ직하다</strong> = đáng (làm) / có thể có thật; phần lớn là từ đã cố định: 먹음직하다 (trông ngon, đáng ăn), 믿음직하다 (đáng tin cậy), 있음직하다 (có thể có thật), 바람직하다 (đáng mong muốn).</li>
</ul>
<pre><code>그런 소문이 날 법도 해요. geureon somuni nal beopdo haeyo. = Có tin đồn như vậy cũng là chuyện dễ xảy ra thôi.
누구나 한 번쯤 실수할 법한 일이에요. nuguna han beonjjeum silsuhal beopan iri-eyo. = Đây là kiểu lỗi mà ai cũng có thể mắc một lần.
음식이 아주 먹음직해 보여요. eumsig-i aju meogeumjikae boyeoyo. = Món ăn trông thật ngon miệng.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 그 사람이 회사를 그만뒀다는 소문 들었어요? (Geu sarami hoesareul geumandwotdaneun somun deureosseoyo?)</p>
<p><strong>B:</strong> 네, 요즘 힘들어 보였으니까 그럴 법도 해요. 그래도 좀 더 믿음직한 사람에게 확인해 봐야겠어요. (Ne, yojeum himdeureo boyeosseunikka geureol beopdo haeyo. Geuraedo jom deo mideumjikan saram-ege hwaginhae bwayagesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> -(으)ㄹ 법하다 đánh giá một việc là hợp lý, dễ hình dung, nghe cũng có lý — hay xuất hiện dạng 그럴 법하다 / -도 하다. -(으)ㅁ직하다 phần lớn đã đông cứng thành từ vựng: hãy học qua các từ quen 먹음직하다, 믿음직하다, 있음직하다, 바람직하다 thay vì ghép tự do, và nhớ nó mang nghĩa "đáng.../có giá trị" ("đáng ăn", "đáng tin").</div>`,
  ]]);
const b3q = quiz('krl402-quiz-3', 'Quiz 3 — Plausible / likely|||Quiz 3 — Có vẻ hợp lý', [
  { id: 'q1', question: 'What does V + (으)ㄹ 법하다 express?|||V + (으)ㄹ 법하다 diễn đạt gì?', options: ['a strong command|||một mệnh lệnh mạnh', 'that something is plausible / reasonable|||rằng một việc là hợp lý, dễ xảy ra', 'a completed action|||một hành động đã hoàn tất', 'a firm refusal|||một sự từ chối dứt khoát'], correctIndex: 1, explanation: '(으)ㄹ 법하다 = có vẻ hợp lý, nghe cũng có lý: 그럴 법하다.' },
  { id: 'q2', question: 'Which is TRUE of -(으)ㅁ직하다?|||Điều nào ĐÚNG về -(으)ㅁ직하다?', options: ['it attaches freely to any verb|||ghép tự do với mọi động từ', 'it is mostly fixed words (먹음직하다, 믿음직하다)|||phần lớn là từ đã cố định (먹음직하다, 믿음직하다)', 'it means the same as -더라도|||nghĩa như -더라도', 'it only marks the past|||chỉ đánh dấu quá khứ'], correctIndex: 1, explanation: '-(으)ㅁ직하다 phần lớn đã cố định: 먹음직하다, 믿음직하다, 있음직하다, 바람직하다.' },
  { id: 'q3', question: '먹음직해 보여요 means the food…|||먹음직해 보여요 nghĩa là món ăn…', options: ['is already eaten|||đã bị ăn hết', 'looks appetizing / worth eating|||trông ngon, đáng ăn', 'tastes bad|||dở', 'is too expensive|||quá đắt'], correctIndex: 1, explanation: '먹음직하다 = trông ngon miệng, đáng ăn.' },
]);

/* ── Bài 4 — Bối cảnh: giữa lúc ─────────────────────────────────────────── */
const b4 = doc('krl402-4-1-amid', 'Lesson 4 — In the midst of|||Bài 4 — Giữa lúc',
  'V + 는 가운데 / N 가운데 (giữa lúc, trong bối cảnh), N/V + 와중에 (giữa lúc rối ren).',
  [[
    `<span class="eyebrow">KRL402 · Lesson 4</span>
<h2>In the midst of (는 가운데, 와중에)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>관심</td><td>gwansim</td><td>interest, attention</td></tr>
<tr><td>위기</td><td>wigi</td><td>crisis</td></tr>
<tr><td>논란</td><td>nollan</td><td>controversy, dispute</td></tr>
<tr><td>참석하다</td><td>chamseokhada</td><td>to attend</td></tr>
<tr><td>진행되다</td><td>jinhaengdoeda</td><td>to proceed, be under way</td></tr>
<tr><td>혼란</td><td>hollan</td><td>confusion, chaos</td></tr>
</tbody></table>
<h3>Grammar — amid, and in the thick of (a chaotic time)</h3>
<ul>
<li><strong>V + 는 가운데, N 가운데</strong> = amid / while / in the context of (neutral, formal, news-like): 많은 사람들이 지켜보는 가운데 행사가 열렸어요. N 가운데 also = among.</li>
<li><strong>N + 와중에, V + 는 와중에</strong> = in the midst of (a chaotic, busy time): 바쁜 와중에도 시간을 내 주셔서 감사합니다. 전쟁의 와중에 가족을 잃었어요.</li>
</ul>
<pre><code>국민들의 관심이 집중된 가운데 회의가 시작되었어요. gungmindeur-ui gwansim-i jipjungdoen gaunde hoeuiga sijakdoeeosseoyo. = The meeting began amid the public&apos;s focused attention.
경제 위기가 계속되는 가운데 물가도 계속 올랐어요. gyeongje wigiga gyesokdoeneun gaunde mulgado gyesok ollasseoyo. = Amid the ongoing economic crisis, prices kept rising.
이사하는 와중에 물건을 몇 개 잃어버렸어요. isahaneun wajung-e mulgeon-eul myeot gae ireobeoryeosseoyo. = In the midst of moving house, I lost a few things.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 어제 시상식은 잘 끝났어요? (Eoje sisangsig-eun jal kkeunnasseoyo?)</p>
<p><strong>B:</strong> 네, 많은 취재진이 지켜보는 가운데 성공적으로 끝났어요. 준비하는 와중에 문제가 좀 있었지만 잘 넘겼어요. (Ne, maneun chwijaejin-i jikyeoboneun gaunde seonggongjeogeuro kkeunnasseoyo. Junbihaneun wajung-e munjega jom isseotjiman jal neomgyeosseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> Both mean "in the midst of". 는 가운데 is neutral and formal — common in news ("amid the attention/watch of...") — and N 가운데 can also mean "among". 와중에 always implies a CHAOTIC, busy, unsettled situation, so it pairs with 바쁜, 전쟁, 이사, 사고. Do not use 와중에 for a calm backdrop; reach for 는 가운데 there.</div>`,
    `<span class="eyebrow">KRL402 · Bài 4</span>
<h2>Giữa lúc (는 가운데, 와중에)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>관심</td><td>gwansim</td><td>sự quan tâm</td></tr>
<tr><td>위기</td><td>wigi</td><td>khủng hoảng, nguy cơ</td></tr>
<tr><td>논란</td><td>nollan</td><td>tranh cãi, tranh luận</td></tr>
<tr><td>참석하다</td><td>chamseokhada</td><td>tham dự</td></tr>
<tr><td>진행되다</td><td>jinhaengdoeda</td><td>được tiến hành</td></tr>
<tr><td>혼란</td><td>hollan</td><td>sự hỗn loạn</td></tr>
</tbody></table>
<h3>Ngữ pháp — giữa lúc / trong bối cảnh, và giữa lúc rối ren</h3>
<ul>
<li><strong>V + 는 가운데, N 가운데</strong> = giữa lúc / trong khi / trong bối cảnh (trung tính, trang trọng, giống bản tin): 많은 사람들이 지켜보는 가운데 행사가 열렸어요. N 가운데 còn = trong số.</li>
<li><strong>N + 와중에, V + 는 와중에</strong> = giữa lúc (rối ren, bận rộn): 바쁜 와중에도 시간을 내 주셔서 감사합니다. 전쟁의 와중에 가족을 잃었어요.</li>
</ul>
<pre><code>국민들의 관심이 집중된 가운데 회의가 시작되었어요. gungmindeur-ui gwansim-i jipjungdoen gaunde hoeuiga sijakdoeeosseoyo. = Giữa lúc sự quan tâm của người dân dồn cả vào, cuộc họp bắt đầu.
경제 위기가 계속되는 가운데 물가도 계속 올랐어요. gyeongje wigiga gyesokdoeneun gaunde mulgado gyesok ollasseoyo. = Giữa lúc khủng hoảng kinh tế còn tiếp diễn, vật giá cũng cứ tăng.
이사하는 와중에 물건을 몇 개 잃어버렸어요. isahaneun wajung-e mulgeon-eul myeot gae ireobeoryeosseoyo. = Giữa lúc dọn nhà bận rộn, tôi làm mất mấy món đồ.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 어제 시상식은 잘 끝났어요? (Eoje sisangsig-eun jal kkeunnasseoyo?)</p>
<p><strong>B:</strong> 네, 많은 취재진이 지켜보는 가운데 성공적으로 끝났어요. 준비하는 와중에 문제가 좀 있었지만 잘 넘겼어요. (Ne, maneun chwijaejin-i jikyeoboneun gaunde seonggongjeogeuro kkeunnasseoyo. Junbihaneun wajung-e munjega jom isseotjiman jal neomgyeosseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Cả hai nghĩa "giữa lúc". 는 가운데 trung tính, trang trọng — hay gặp trong bản tin ("giữa sự quan tâm/theo dõi của...") — và N 가운데 còn nghĩa "trong số". 와중에 luôn gợi một tình huống RỐI REN, bận rộn, không suôn sẻ, nên hợp với 바쁜, 전쟁, 이사, 사고. Đừng dùng 와중에 cho bối cảnh êm ả; chỗ đó dùng 는 가운데.</div>`,
  ]]);
const b4q = quiz('krl402-quiz-4', 'Quiz 4 — In the midst of|||Quiz 4 — Giữa lúc', [
  { id: 'q1', question: 'Which is neutral/formal and common in news ("amid the attention of...")?|||Đâu trung tính, trang trọng, hay gặp trong bản tin ("giữa sự quan tâm của...")?', options: ['-는 가운데', '-와중에', '-는 통에', '-던들'], correctIndex: 0, explanation: '는 가운데 trung tính, trang trọng; N 가운데 còn nghĩa "trong số".' },
  { id: 'q2', question: '와중에 always implies a situation that is…|||와중에 luôn gợi một tình huống…', options: ['calm and peaceful|||êm ả, yên bình', 'chaotic / busy / unsettled|||rối ren, bận rộn, không suôn sẻ', 'in the far future|||ở tương lai xa', 'purely imaginary|||hoàn toàn tưởng tượng'], correctIndex: 1, explanation: '와중에 = giữa lúc rối ren, bận rộn: 바쁜 와중에, 전쟁의 와중에.' },
  { id: 'q3', question: 'N + 가운데 can ALSO mean…|||N + 가운데 còn có thể nghĩa là…', options: ['among (a group)|||trong số (một nhóm)', 'without|||không có', 'instead of|||thay vì', 'in order to|||để mà'], correctIndex: 0, explanation: 'N 가운데 = trong số: 여러 사람 가운데 = trong số nhiều người.' },
]);

/* ── Bài 5 — Chực mà chưa ───────────────────────────────────────────────── */
const b5 = doc('krl402-5-1-almost', 'Lesson 5 — Almost but not quite|||Bài 5 — Chực mà chưa',
  'V + (으)ㄹ락 말락 하다 (chực... mà chưa, chập chờn), V + (으)ㄹ 듯 말 듯 하다 (mập mờ, như mà không).',
  [[
    `<span class="eyebrow">KRL402 · Lesson 5</span>
<h2>Almost but not quite (을락 말락, 을 듯 말 듯)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>잠들다</td><td>jamdeulda</td><td>to fall asleep</td></tr>
<tr><td>정상</td><td>jeongsang</td><td>summit, top</td></tr>
<tr><td>닿다</td><td>data</td><td>to touch, reach</td></tr>
<tr><td>표정</td><td>pyojeong</td><td>facial expression</td></tr>
<tr><td>희미하다</td><td>huimihada</td><td>to be faint, dim</td></tr>
<tr><td>눈물</td><td>nunmul</td><td>tears</td></tr>
</tbody></table>
<h3>Grammar — on the verge of, and seeming to yet not</h3>
<ul>
<li><strong>V + -(으)ㄹ락 말락 하다</strong> = almost... but not quite; keeps flickering between doing and not: 잠이 들락 말락 해요. 손이 천장에 닿을락 말락 해요.</li>
<li><strong>V + -(으)ㄹ 듯 말 듯 하다</strong> = seeming to... yet not; ambiguous, hard to pin down: 알 듯 말 듯 해요. 웃을 듯 말 듯 한 표정을 지었어요.</li>
</ul>
<pre><code>너무 피곤해서 잠이 들락 말락 했어요. neomu pigonhaeseo jami deullak mallak haesseoyo. = I was so tired that I kept almost falling asleep.
그 사람 이름이 기억이 날 듯 말 듯 해요. geu saram ireumi gieogi nal deut mal deut haeyo. = That person&apos;s name is right on the tip of my tongue.
그녀는 눈물이 날락 말락 한 얼굴로 웃었어요. geunyeoneun nunmuri nallak mallak han eolgullo useosseoyo. = She smiled with a face on the verge of tears.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 어제 설명한 문법, 이제 이해됐어요? (Eoje seolmyeonghan munbeop, ije ihaedwaesseoyo?)</p>
<p><strong>B:</strong> 솔직히 알 듯 말 듯 해요. 예문을 보면 알 것 같다가도 다시 헷갈려요. (Soljikhi al deut mal deut haeyo. Yemun-eul bomyeon al geot gatdagado dasi hetgallyeoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> Both describe a state hovering between "yes" and "no", and both end in 하다. -(으)ㄹ락 말락 leans toward an action or event that keeps almost happening and stopping (잠이 들락 말락, 비가 올락 말락) — a physical near-miss. -(으)ㄹ 듯 말 듯 leans toward AMBIGUITY that is hard to judge (알 듯 말 듯, 웃을 듯 말 듯) — a blurred impression.</div>`,
    `<span class="eyebrow">KRL402 · Bài 5</span>
<h2>Chực mà chưa (을락 말락, 을 듯 말 듯)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>잠들다</td><td>jamdeulda</td><td>ngủ thiếp đi</td></tr>
<tr><td>정상</td><td>jeongsang</td><td>đỉnh (núi)</td></tr>
<tr><td>닿다</td><td>data</td><td>chạm tới, với tới</td></tr>
<tr><td>표정</td><td>pyojeong</td><td>nét mặt, biểu cảm</td></tr>
<tr><td>희미하다</td><td>huimihada</td><td>mờ nhạt, lờ mờ</td></tr>
<tr><td>눈물</td><td>nunmul</td><td>nước mắt</td></tr>
</tbody></table>
<h3>Ngữ pháp — chực... mà chưa, và như mà lại không</h3>
<ul>
<li><strong>V + -(으)ㄹ락 말락 하다</strong> = chực... mà chưa; cứ chập chờn giữa làm và không: 잠이 들락 말락 해요. 손이 천장에 닿을락 말락 해요.</li>
<li><strong>V + -(으)ㄹ 듯 말 듯 하다</strong> = như... mà lại không; mập mờ, khó xác định rõ: 알 듯 말 듯 해요. 웃을 듯 말 듯 한 표정을 지었어요.</li>
</ul>
<pre><code>너무 피곤해서 잠이 들락 말락 했어요. neomu pigonhaeseo jami deullak mallak haesseoyo. = Mệt quá nên tôi cứ chập chờn chực ngủ thiếp đi.
그 사람 이름이 기억이 날 듯 말 듯 해요. geu saram ireumi gieogi nal deut mal deut haeyo. = Tên người đó cứ chực nhớ ra mà chưa nhớ nổi.
그녀는 눈물이 날락 말락 한 얼굴로 웃었어요. geunyeoneun nunmuri nallak mallak han eolgullo useosseoyo. = Cô ấy cười với gương mặt chực trào nước mắt.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 어제 설명한 문법, 이제 이해됐어요? (Eoje seolmyeonghan munbeop, ije ihaedwaesseoyo?)</p>
<p><strong>B:</strong> 솔직히 알 듯 말 듯 해요. 예문을 보면 알 것 같다가도 다시 헷갈려요. (Soljikhi al deut mal deut haeyo. Yemun-eul bomyeon al geot gatdagado dasi hetgallyeoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Cả hai tả trạng thái LẤP LỬNG giữa "có" và "không", và đều kết thúc bằng 하다. -(으)ㄹ락 말락 nghiêng về một hành động/hiện tượng cứ chực xảy ra rồi lại thôi (잠이 들락 말락, 비가 올락 말락) — sự chập chờn cụ thể. -(으)ㄹ 듯 말 듯 nghiêng về sự MẬP MỜ khó phán đoán (알 듯 말 듯, 웃을 듯 말 듯) — một ấn tượng nhoè nhoẹt.</div>`,
  ]]);
const b5q = quiz('krl402-quiz-5', 'Quiz 5 — Almost but not quite|||Quiz 5 — Chực mà chưa', [
  { id: 'q1', question: 'Both patterns end in which verb?|||Cả hai cấu trúc đều kết thúc bằng động từ nào?', options: ['되다', '하다', '보다', '주다'], correctIndex: 1, explanation: '을락 말락 하다 / 을 듯 말 듯 하다 — cả hai đều đi với 하다.' },
  { id: 'q2', question: 'For an action that keeps ALMOST happening then stopping, use…|||Với hành động cứ CHỰC xảy ra rồi lại thôi, dùng…', options: ['-(으)ㄹ락 말락', '-(으)ㄹ 듯 말 듯', '-는 가운데', '-기는커녕'], correctIndex: 0, explanation: '을락 말락 = chực... mà chưa: 잠이 들락 말락, 비가 올락 말락.' },
  { id: 'q3', question: '"알 듯 말 듯 해요" means…|||"알 듯 말 듯 해요" nghĩa là gì?', options: ['I understand it completely|||tôi hiểu hoàn toàn', 'I sort of get it but not quite (ambiguous)|||hiểu mà lại không hiểu rõ (mập mờ)', 'I do not understand at all|||chẳng hiểu gì cả', 'I want to understand|||tôi muốn hiểu'], correctIndex: 1, explanation: '을 듯 말 듯 = mập mờ, như hiểu mà lại chưa hiểu rõ.' },
]);

/* ── Bài 6 — Nói gì đến ─────────────────────────────────────────────────── */
const b6 = doc('krl402-6-1-far-from', 'Lesson 6 — Far from / let alone|||Bài 6 — Nói gì đến',
  'V/A + 기는커녕 (nói gì đến chuyện...), N + 은/는커녕 (đừng nói đến N).',
  [[
    `<span class="eyebrow">KRL402 · Lesson 6</span>
<h2>Far from / let alone (기는커녕, 은커녕)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>칭찬</td><td>chingchan</td><td>praise, compliment</td></tr>
<tr><td>혼나다</td><td>honnada</td><td>to get scolded</td></tr>
<tr><td>오히려</td><td>ohiryeo</td><td>rather, on the contrary</td></tr>
<tr><td>도움</td><td>doum</td><td>help, aid</td></tr>
<tr><td>해결하다</td><td>haegyeolhada</td><td>to solve, resolve</td></tr>
<tr><td>쌓이다</td><td>ssaida</td><td>to pile up, accumulate</td></tr>
</tbody></table>
<h3>Grammar — far from V-ing, and let alone N</h3>
<ul>
<li><strong>V/A + 기는커녕</strong> = far from V-ing / let alone; even the smaller thing in the second clause fails, often with 도/조차: 쉬기는커녕 밥 먹을 시간도 없었어요.</li>
<li><strong>N + 은/는커녕</strong> = let alone N / far from N: 칭찬은커녕 오히려 혼만 났어요. 돈은커녕 밥값도 없어요.</li>
</ul>
<pre><code>일이 줄기는커녕 오히려 더 늘었어요. iri julgineunkeonyeo ohiryeo deo neureosseoyo. = Far from decreasing, the work actually increased.
도와주기는커녕 방해만 했어요. dowajugineunkeonyeo banghaeman haesseoyo. = Far from helping, he only got in the way.
여행은커녕 주말에 쉬지도 못했어요. yeohaengeunkeonyeo jumar-e swijido mothaesseoyo. = Let alone travelling, I could not even rest on the weekend.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 이번 프로젝트 끝나고 좀 쉬었어요? (Ibeon peurojekteu kkeutnago jom swieosseoyo?)</p>
<p><strong>B:</strong> 쉬기는커녕 새 프로젝트가 바로 시작됐어요. 칭찬은커녕 일만 더 쌓였고요. (Swigineunkeonyeo sae peurojekteuga baro sijakdwaesseoyo. Chingchaneunkeonyeo ilman deo ssaideotgoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 기는커녕 / 은커녕 stress that the expected big thing did not happen — and that even the SMALLER thing in the second clause is impossible too, so the second clause usually carries 도, 조차 or 만. Use 은/는커녕 after a noun and 기는커녕 after a verb or adjective. It very often pairs with 오히려 ("on the contrary, it even...").</div>`,
    `<span class="eyebrow">KRL402 · Bài 6</span>
<h2>Nói gì đến (기는커녕, 은커녕)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>칭찬</td><td>chingchan</td><td>lời khen</td></tr>
<tr><td>혼나다</td><td>honnada</td><td>bị mắng, bị la</td></tr>
<tr><td>오히려</td><td>ohiryeo</td><td>trái lại, ngược lại</td></tr>
<tr><td>도움</td><td>doum</td><td>sự giúp đỡ</td></tr>
<tr><td>해결하다</td><td>haegyeolhada</td><td>giải quyết</td></tr>
<tr><td>쌓이다</td><td>ssaida</td><td>chất đống, dồn lại</td></tr>
</tbody></table>
<h3>Ngữ pháp — nói gì đến chuyện V, và đừng nói đến N</h3>
<ul>
<li><strong>V/A + 기는커녕</strong> = nói gì đến chuyện... / đừng nói là...; đến cả điều nhỏ hơn ở vế sau cũng không, hay đi với 도/조차: 쉬기는커녕 밥 먹을 시간도 없었어요.</li>
<li><strong>N + 은/는커녕</strong> = đừng nói đến N / nói gì đến N: 칭찬은커녕 오히려 혼만 났어요. 돈은커녕 밥값도 없어요.</li>
</ul>
<pre><code>일이 줄기는커녕 오히려 더 늘었어요. iri julgineunkeonyeo ohiryeo deo neureosseoyo. = Đừng nói giảm, việc còn tăng thêm là khác.
도와주기는커녕 방해만 했어요. dowajugineunkeonyeo banghaeman haesseoyo. = Nói gì đến giúp, anh ta chỉ toàn cản trở.
여행은커녕 주말에 쉬지도 못했어요. yeohaengeunkeonyeo jumar-e swijido mothaesseoyo. = Đừng nói đi du lịch, cuối tuần nghỉ cũng chẳng được.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 이번 프로젝트 끝나고 좀 쉬었어요? (Ibeon peurojekteu kkeutnago jom swieosseoyo?)</p>
<p><strong>B:</strong> 쉬기는커녕 새 프로젝트가 바로 시작됐어요. 칭찬은커녕 일만 더 쌓였고요. (Swigineunkeonyeo sae peurojekteuga baro sijakdwaesseoyo. Chingchaneunkeonyeo ilman deo ssaideotgoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 기는커녕 / 은커녕 nhấn: điều lớn (được mong đợi) đã không xảy ra — và đến cả điều NHỎ HƠN ở vế sau cũng không, nên vế sau hay có 도, 조차 hoặc 만. Dùng 은/는커녕 sau danh từ, 기는커녕 sau động từ hay tính từ. Rất hay đi cùng 오히려 ("trái lại, còn...").</div>`,
  ]]);
const b6q = quiz('krl402-quiz-6', 'Quiz 6 — Far from / let alone|||Quiz 6 — Nói gì đến', [
  { id: 'q1', question: 'What do 기는커녕 / 은커녕 stress?|||기는커녕 / 은커녕 nhấn điều gì?', options: ['the big thing happened easily|||điều lớn xảy ra dễ dàng', 'far from the big thing — even the smaller thing failed|||đừng nói điều lớn — đến điều nhỏ hơn cũng không', 'two things happening together|||hai việc cùng xảy ra', 'a polite request|||một lời đề nghị lịch sự'], correctIndex: 1, explanation: '기는커녕 / 은커녕 = nói gì đến điều lớn, đến cả điều nhỏ hơn cũng không.' },
  { id: 'q2', question: 'After a NOUN, which form do you use?|||Sau một DANH TỪ, dùng dạng nào?', options: ['-기는커녕', '-은/는커녕', '-을락 말락', '-더라면'], correctIndex: 1, explanation: 'Danh từ dùng 은/는커녕: 돈은커녕, 칭찬은커녕. Động/tính từ dùng 기는커녕.' },
  { id: 'q3', question: '기는커녕 / 은커녕 very often pairs with which adverb?|||기는커녕 / 은커녕 rất hay đi với trạng từ nào?', options: ['오히려 (on the contrary)|||오히려 (trái lại)', '아마 (probably)|||아마 (có lẽ)', '드디어 (finally)|||드디어 (cuối cùng)', '반드시 (surely)|||반드시 (nhất định)'], correctIndex: 0, explanation: '오히려 = trái lại, còn...; hợp với sắc thái phủ định của 기는커녕.' },
]);

/* ── Bài 7 — Vì hỗn loạn nên ────────────────────────────────────────────── */
const b7 = doc('krl402-7-1-disruptive-cause', 'Lesson 7 — Because of the fuss / being busy|||Bài 7 — Vì hỗn loạn, vì mải',
  'V + 는 통에 (vì sự lộn xộn của... nên), V + 느라고 (vì mải... nên, cùng chủ ngữ).',
  [[
    `<span class="eyebrow">KRL402 · Lesson 7</span>
<h2>Because of the fuss / being busy (는 통에, 느라고)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>떠들다</td><td>tteodeulda</td><td>to make noise, chatter</td></tr>
<tr><td>집중하다</td><td>jipjunghada</td><td>to concentrate</td></tr>
<tr><td>정신없다</td><td>jeongsineopda</td><td>to be hectic, frantic</td></tr>
<tr><td>몰리다</td><td>mollida</td><td>to be crowded, rushed</td></tr>
<tr><td>밀리다</td><td>millida</td><td>to be backed up, delayed</td></tr>
<tr><td>챙기다</td><td>chaenggida</td><td>to pack, take care of</td></tr>
</tbody></table>
<h3>Grammar — owing to the commotion, and busy V-ing</h3>
<ul>
<li><strong>V + 는 통에</strong> = because of the disorder / commotion of... (a chaotic outside situation causes a bad result): 옆 사람이 떠드는 통에 집중을 못 했어요.</li>
<li><strong>V + 느라고</strong> = because one is busy V-ing (same subject, overlapping time, usually a negative result); action verbs only: 게임을 하느라고 숙제를 못 했어요.</li>
</ul>
<pre><code>아이들이 뛰어다니는 통에 정신이 하나도 없었어요. aideur-i ttwieodannineun tong-e jeongsini hanado eopseosseoyo. = With the kids running around, I could not think straight at all.
아침에 늦잠을 자는 통에 지하철을 놓쳤어요. achim-e neutjam-eul janeun tong-e jihacheor-eul nochyeosseoyo. = Because I overslept in the morning, I missed the subway.
시험 준비를 하느라고 이틀 동안 잠을 못 잤어요. siheom junbireul haneurago iteul dong-an jam-eul mot jasseoyo. = Because I was busy preparing for the exam, I could not sleep for two days.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 왜 이렇게 피곤해 보여요? (Wae ireoke pigonhae boyeoyo?)</p>
<p><strong>B:</strong> 어젯밤에 옆집이 시끄럽게 하는 통에 한숨도 못 잤어요. 게다가 발표 준비를 하느라고 새벽까지 깨어 있었고요. (Eojetbam-e yeopjib-i sikkeureopge haneun tong-e hansumdo mot jasseoyo. Gedaga balpyo junbireul haneurago saebyeokkkaji kkaeeo isseotgoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> Both give a cause with a usually negative result. 는 통에 blames a CHAOTIC, noisy, disorderly situation — often caused by someone or something else — for the bad outcome you suffer. 느라고 says YOU were busy doing one action (same subject, same time span) and so could not do another; it takes action verbs only, and its second clause cannot be a command or a suggestion.</div>`,
    `<span class="eyebrow">KRL402 · Bài 7</span>
<h2>Vì hỗn loạn, vì mải (는 통에, 느라고)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>떠들다</td><td>tteodeulda</td><td>làm ồn, nói huyên thuyên</td></tr>
<tr><td>집중하다</td><td>jipjunghada</td><td>tập trung</td></tr>
<tr><td>정신없다</td><td>jeongsineopda</td><td>rối bời, tối mắt tối mũi</td></tr>
<tr><td>몰리다</td><td>mollida</td><td>bị dồn, ùa vào</td></tr>
<tr><td>밀리다</td><td>millida</td><td>bị dồn ứ, chậm trễ</td></tr>
<tr><td>챙기다</td><td>chaenggida</td><td>thu dọn, mang theo</td></tr>
</tbody></table>
<h3>Ngữ pháp — vì sự lộn xộn của..., và vì mải làm...</h3>
<ul>
<li><strong>V + 는 통에</strong> = vì (sự lộn xộn/ầm ĩ của)... nên (một hoàn cảnh rối ren bên ngoài gây kết quả xấu): 옆 사람이 떠드는 통에 집중을 못 했어요.</li>
<li><strong>V + 느라고</strong> = vì mải (làm)... nên (cùng chủ ngữ, hai việc cùng khoảng thời gian, kết quả thường tiêu cực); chỉ dùng với động từ hành động: 게임을 하느라고 숙제를 못 했어요.</li>
</ul>
<pre><code>아이들이 뛰어다니는 통에 정신이 하나도 없었어요. aideur-i ttwieodannineun tong-e jeongsini hanado eopseosseoyo. = Vì lũ trẻ chạy nhảy loạn xạ nên tôi rối cả đầu.
아침에 늦잠을 자는 통에 지하철을 놓쳤어요. achim-e neutjam-eul janeun tong-e jihacheor-eul nochyeosseoyo. = Vì sáng ngủ nướng nên tôi lỡ chuyến tàu điện ngầm.
시험 준비를 하느라고 이틀 동안 잠을 못 잤어요. siheom junbireul haneurago iteul dong-an jam-eul mot jasseoyo. = Vì mải ôn thi nên hai ngày liền tôi không ngủ được.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 왜 이렇게 피곤해 보여요? (Wae ireoke pigonhae boyeoyo?)</p>
<p><strong>B:</strong> 어젯밤에 옆집이 시끄럽게 하는 통에 한숨도 못 잤어요. 게다가 발표 준비를 하느라고 새벽까지 깨어 있었고요. (Eojetbam-e yeopjib-i sikkeureopge haneun tong-e hansumdo mot jasseoyo. Gedaga balpyo junbireul haneurago saebyeokkkaji kkaeeo isseotgoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Cả hai nêu NGUYÊN NHÂN dẫn tới kết quả thường tiêu cực. 는 통에 đổ lỗi cho một tình huống RỐI REN, ồn ào, lộn xộn — thường do người/việc khác gây ra — khiến mình chịu hậu quả. 느라고 nói CHÍNH MÌNH mải làm một việc (cùng chủ ngữ, cùng khoảng thời gian) nên không làm được việc khác; chỉ gắn với động từ hành động, và vế sau không được là câu mệnh lệnh hay rủ rê.</div>`,
  ]]);
const b7q = quiz('krl402-quiz-7', 'Quiz 7 — Because of the fuss / being busy|||Quiz 7 — Vì hỗn loạn, vì mải', [
  { id: 'q1', question: 'Which blames a CHAOTIC / noisy outside situation for a bad result?|||Đâu đổ lỗi cho một tình huống RỐI REN, ồn ào bên ngoài?', options: ['-는 통에', '-느라고', '-는 한', '-던들'], correctIndex: 0, explanation: '는 통에 = vì sự lộn xộn/ầm ĩ của... nên chịu hậu quả xấu.' },
  { id: 'q2', question: 'V + 느라고 requires that the two clauses have…|||V + 느라고 đòi hỏi hai vế phải có…', options: ['different subjects|||chủ ngữ khác nhau', 'the SAME subject and overlapping time|||CÙNG chủ ngữ và cùng khoảng thời gian', 'a future tense|||thì tương lai', 'a question form|||dạng câu hỏi'], correctIndex: 1, explanation: '느라고 dùng cùng chủ ngữ, hai việc cùng lúc; chỉ với động từ hành động.' },
  { id: 'q3', question: 'The clause after 느라고 CANNOT be…|||Vế sau 느라고 KHÔNG thể là…', options: ['a negative result|||một kết quả tiêu cực', 'a command or a suggestion|||một câu mệnh lệnh hay rủ rê', 'a past-tense statement|||một câu ở thì quá khứ', 'a reason|||một lý do'], correctIndex: 1, explanation: 'Vế sau 느라고 không dùng mệnh lệnh/rủ rê: 공부하느라고 자세요 (sai).' },
]);

/* ── Bài 8 — Dù đã... thì (nhượng bộ trái thực tế) ──────────────────────── */
const b8 = doc('krl402-8-1-counterfactual-concession', 'Lesson 8 — Even if it had|||Bài 8 — Dù đã... thì',
  'V/A + 았/었던들 / 던들 (dù (khi trước) đã... đi nữa thì cũng; trang trọng, văn viết).',
  [[
    `<span class="eyebrow">KRL402 · Lesson 8</span>
<h2>Even if it had (았/었던들, 던들)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>결과</td><td>gyeolgwa</td><td>result, outcome</td></tr>
<tr><td>벌어지다</td><td>beoreojida</td><td>to happen, occur</td></tr>
<tr><td>막다</td><td>makda</td><td>to prevent, block</td></tr>
<tr><td>이미</td><td>imi</td><td>already</td></tr>
<tr><td>돌이키다</td><td>dorikida</td><td>to turn back, undo</td></tr>
<tr><td>소용없다</td><td>soyongeopda</td><td>to be useless, no use</td></tr>
</tbody></table>
<h3>Grammar — even if (back then) it had been / happened</h3>
<ul>
<li><strong>V/A + 았/었던들</strong> = even if (back then) it had (been)... (counterfactual concession about the past; the result is unavoidable, usually negative); formal, literary, pairs with 아무리: 아무리 노력했던들 결과는 같았을 거예요.</li>
<li>Contrast with 았/었더라면 (Lesson 2): 더라면 = if only it had (regret, the result WOULD change); 던들 = even if it had (concession, the result would NOT change).</li>
</ul>
<pre><code>그때 알았던들 무엇을 할 수 있었겠어요? geuttae aratdeondeul mueos-eul hal su isseotgesseoyo? = Even if I had known then, what could I have done?
아무리 서둘렀던들 이미 늦었을 거예요. amuri seodulleotdeondeul imi neujeosseul geoyeyo. = Even if I had hurried, it would already have been too late.
그가 사과했던들 상황이 달라지지는 않았을 것이다. geuga sagwahaetdeondeul sanghwang-i dallajijineun anasseul geosida. = Even if he had apologized, the situation would not have changed.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 그때 우리가 조금만 더 노력했더라면 이길 수 있었을까요? (Geuttae uriga jogeumman deo noryeokhaetdeoramyeon igil su isseosseulkkayo?)</p>
<p><strong>B:</strong> 글쎄요. 솔직히 아무리 노력했던들 상대가 너무 강해서 이기기 힘들었을 거예요. (Geulsseyo. Soljikhi amuri noryeokhaetdeondeul sangdaega neomu ganghaeseo igigi himdeureosseul geoyeyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 았/었던들 is a FORMAL, rather literary and old-fashioned pattern meaning "even if it had...". It concedes an unreal past and insists the result would have stayed the same (usually bad or unavoidable), so it often pairs with 아무리. The key contrast with Lesson 2: 았/었더라면 regrets that the past was not different (wishing the result WOULD change), while 았/었던들 argues the result would NOT change even if the past had been different.</div>`,
    `<span class="eyebrow">KRL402 · Bài 8</span>
<h2>Dù đã... thì (았/었던들, 던들)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>결과</td><td>gyeolgwa</td><td>kết quả</td></tr>
<tr><td>벌어지다</td><td>beoreojida</td><td>xảy ra, diễn ra</td></tr>
<tr><td>막다</td><td>makda</td><td>ngăn chặn</td></tr>
<tr><td>이미</td><td>imi</td><td>đã, đã rồi</td></tr>
<tr><td>돌이키다</td><td>dorikida</td><td>xoay chuyển, làm lại</td></tr>
<tr><td>소용없다</td><td>soyongeopda</td><td>vô ích, không có tác dụng</td></tr>
</tbody></table>
<h3>Ngữ pháp — dù (khi trước) đã... đi nữa thì cũng</h3>
<ul>
<li><strong>V/A + 았/었던들</strong> = dù (khi trước) đã... đi nữa thì cũng (nhượng bộ trái thực tế quá khứ; kết quả bất khả kháng, thường tiêu cực); trang trọng, văn viết, hay đi với 아무리: 아무리 노력했던들 결과는 같았을 거예요.</li>
<li>Phân biệt với 았/었더라면 (Bài 2): 더라면 = giá mà đã... thì (tiếc nuối, kết quả LẼ RA đổi khác); 던들 = dù đã... thì (nhượng bộ, kết quả VẪN không đổi).</li>
</ul>
<pre><code>그때 알았던들 무엇을 할 수 있었겠어요? geuttae aratdeondeul mueos-eul hal su isseotgesseoyo? = Dù khi đó có biết thì tôi cũng làm được gì chứ?
아무리 서둘렀던들 이미 늦었을 거예요. amuri seodulleotdeondeul imi neujeosseul geoyeyo. = Dù có vội đến mấy thì cũng đã muộn mất rồi.
그가 사과했던들 상황이 달라지지는 않았을 것이다. geuga sagwahaetdeondeul sanghwang-i dallajijineun anasseul geosida. = Dù anh ta có xin lỗi thì tình hình cũng chẳng đổi khác.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 그때 우리가 조금만 더 노력했더라면 이길 수 있었을까요? (Geuttae uriga jogeumman deo noryeokhaetdeoramyeon igil su isseosseulkkayo?)</p>
<p><strong>B:</strong> 글쎄요. 솔직히 아무리 노력했던들 상대가 너무 강해서 이기기 힘들었을 거예요. (Geulsseyo. Soljikhi amuri noryeokhaetdeondeul sangdaega neomu ganghaeseo igigi himdeureosseul geoyeyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 았/었던들 là cấu trúc TRANG TRỌNG, thiên văn viết, hơi cổ, nghĩa "dù đã... đi nữa thì cũng". Nó nhượng bộ một quá khứ trái thực tế và khẳng định kết quả vẫn thế (thường xấu hoặc bất khả kháng), nên hay đi với 아무리. Chỗ khác then chốt với Bài 2: 았/었더라면 tiếc rằng GIÁ MÀ quá khứ khác đi (mong kết quả đổi), còn 았/었던들 khẳng định DÙ quá khứ có khác đi thì kết quả VẪN không đổi.</div>`,
  ]]);
const b8q = quiz('krl402-quiz-8', 'Quiz 8 — Even if it had|||Quiz 8 — Dù đã... thì', [
  { id: 'q1', question: 'What is the register of 았/었던들?|||았/었던들 thuộc văn phong nào?', options: ['casual slang|||tiếng lóng thân mật', 'formal, literary, old-fashioned|||trang trọng, văn viết, hơi cổ', 'baby talk|||cách nói trẻ con', 'a command form|||dạng mệnh lệnh'], correctIndex: 1, explanation: '았/었던들 là cấu trúc trang trọng, thiên văn viết, hơi cổ.' },
  { id: 'q2', question: 'How does 았/었던들 differ from 았/었더라면 (Lesson 2)?|||았/었던들 khác 았/었더라면 (Bài 2) thế nào?', options: ['they are identical|||giống hệt nhau', '더라면 = if only (result would change); 던들 = even if (result would NOT change)|||더라면 = giá mà (kết quả đổi); 던들 = dù đã (kết quả VẪN không đổi)', '던들 is only future|||던들 chỉ dùng tương lai', '더라면 is a command|||더라면 là mệnh lệnh'], correctIndex: 1, explanation: '더라면 tiếc nuối mong kết quả đổi; 던들 nhượng bộ, kết quả vẫn không đổi.' },
  { id: 'q3', question: '았/었던들 often pairs with which word?|||았/었던들 hay đi cùng từ nào?', options: ['아무리 (no matter how)|||아무리 (dù... đến mấy)', '드디어 (finally)|||드디어 (cuối cùng)', '방금 (just now)|||방금 (vừa nãy)', '항상 (always)|||항상 (luôn luôn)'], correctIndex: 0, explanation: '아무리 ... 았/었던들 = dù có... đến mấy đi nữa thì cũng.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'KRL402',
    slug: 'krl402-intermediate-korean-3',
    title: 'Intermediate Korean 3',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KRL402.webp',
    shortDescription: 'Intermediate Korean 3, after KRL322: condition (는 한, 는 이상), past counterfactual (았/었더라면), plausibility (을 법하다), amid (가운데, 와중에), almost (을락 말락), far from (기는커녕), disruptive cause (는 통에) & even if it had (던들). Sejong 6, TOPIK II.|||Tiếng Hàn trung cấp 3, nối tiếp KRL322: điều kiện (는 한, 는 이상), giả định quá khứ (았/었더라면), hợp lý (을 법하다), giữa lúc (가운데, 와중에), chực mà chưa (을락 말락), nói gì đến (기는커녕), nguyên nhân rối ren (는 통에) & dù đã (던들). Sejong 6, TOPIK II.',
    description: 'Môn <strong>KRL402 — Intermediate Korean 3</strong> (Tiếng Hàn trung cấp 3, Kỳ 5, ngành Ngôn ngữ Hàn) nối tiếp <strong>KRL322</strong>. Từ nền nhượng bộ, tương phản, tất yếu, giả định, mức độ, rốt cuộc, hồi tưởng và so sánh, môn này chạm ngưỡng trên của trung cấp: <strong>điều kiện</strong> (는 한, 는 이상) → <strong>giả định quá khứ</strong> (았/었더라면) → <strong>tính hợp lý</strong> (을 법하다, 음직하다) → <strong>bối cảnh</strong> (는 가운데, 와중에) → <strong>chực mà chưa</strong> (을락 말락, 을 듯 말 듯) → <strong>nói gì đến</strong> (기는커녕, 은커녕) → <strong>nguyên nhân rối ren</strong> (는 통에, 느라고) → <strong>nhượng bộ trái thực tế</strong> (았/었던들, 던들). Bám giáo trình Sejong Korean 6 / Ewha, song ngữ Hàn-Việt, có bảng từ vựng, ngữ pháp, hội thoại và quiz mỗi bài. Trình độ TOPIK II (trung – cao cấp).',
    whatYouLearn: 'Đặt điều kiện với 는 한 và 는 이상; hình dung một quá khứ không thật bằng 았/었더라면; đánh giá điều hợp lý qua 을 법하다 và 음직하다; dựng bối cảnh với 는 가운데 và 와중에; tả trạng thái chực mà chưa bằng 을락 말락 và 을 듯 말 듯; phủ định bằng 기는커녕 và 은커녕; nêu nguyên nhân rối ren qua 는 통에 và 느라고; và nhượng bộ một quá khứ trái thực tế với 았/었던들. Kèm từ vựng chủ đề học thuật, xã hội, thời sự TOPIK II.',
    requirements: 'Đã học xong KRL322 (Intermediate Korean 2) hoặc tương đương: nắm nhượng bộ mạnh (더라도, 아/어 봤자), tương phản (는 반면에), tất yếu (기 마련이다), giả định (는 셈치고), mức độ (을 정도로), rốt cuộc (고 말다), hồi tưởng (더라, 던데요), so sánh (다시피, 듯이), và hoà thanh 아/어 khi chia đuôi. Cần luyện nói hội thoại thành tiếng mỗi ngày.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Sejong 6/Ewha, từ điển Naver, app, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp KRL322, mục tiêu TOPIK II, bản đồ 8 bài.', lessons: [intro] },
    { title: 'Bài 1 — Một khi, miễn là|||Lesson 1 — As long as / given that', description: '는 한, 는 이상.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Giả định quá khứ|||Lesson 2 — If only I had', description: '았/었더라면.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Có vẻ hợp lý|||Lesson 3 — Plausible / likely', description: '을 법하다, 음직하다.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Giữa lúc|||Lesson 4 — In the midst of', description: '는 가운데, 와중에.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Chực mà chưa|||Lesson 5 — Almost but not quite', description: '을락 말락, 을 듯 말 듯.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Nói gì đến|||Lesson 6 — Far from / let alone', description: '기는커녕, 은커녕.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Vì hỗn loạn, vì mải|||Lesson 7 — Because of the fuss / being busy', description: '는 통에, 느라고.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Dù đã... thì|||Lesson 8 — Even if it had', description: '았/었던들, 던들.', lessons: [b8, b8q] },
  ],
};
