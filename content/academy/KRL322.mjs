/**
 * KRL322 — Intermediate Korean 2 (Tiếng Hàn trung cấp 2). Khối Ngôn ngữ Hàn FPTU, Kỳ 4.
 * NỐI TIẾP KRL312 — Intermediate Korean 1. Giáo trình chuẩn: 세종한국어 Sejong Korean 5;
 * trình độ TOPIK II (trung cấp).
 * MÔN NGÔN NGỮ — mỗi bài: từ vựng, ngữ pháp + mẫu câu (chú ý chia đuôi/bất quy tắc,
 * hoà thanh 아/어), hội thoại, ghi chú. Hangul + Revised Romanization + nghĩa tiếng Việt.
 * bi(e,v): e = trình bày Hàn+Anh, v = giải thích tiếng Việt.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 300, questions } });

/* ── Tài liệu ────────────────────────────────────────────────────────────── */
const taiLieu = doc('krl322-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình Sejong Korean 5 / Ewha, app TOPIK ONE / Anki, từ điển Naver, YouTube, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">KRL322 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need for <strong>Intermediate Korean 2</strong> — building on the negative cause, purpose, discovery, addition, wishes, pretence and passive &amp; causative of <strong>KRL312</strong> toward strong concession, contrast, inevitability, supposition, extent, ending-up, recollection and similes — in one place. The official FPTU giáo trình &amp; slides live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbooks</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 5</em> — King Sejong Institute (free PDF &amp; audio)</a></li>
<li><em>Ewha Korean 4</em> — Ewha Womans University Press</li>
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
<li><strong>Review KRL312</strong> — negative cause (느라고, 는 바람에), purpose (도록, 게 하다), discovery (더니, 았/었더니), addition (을 뿐만 아니라), wishes (았/었으면 하다), pretence (는 척하다), passive &amp; causative (이/히/리/기).</li>
<li><strong>Concede &amp; contrast</strong> — strong concession 더라도, 아/어 봤자; contrast 는 반면에, 는 데 반해.</li>
<li><strong>State truths &amp; suppose</strong> — inevitability 기 마련이다, 게 마련이다; supposition 는 셈치고, 은 셈이다; extent 을 정도로, 을 만큼.</li>
<li><strong>End up, recall &amp; compare</strong> — ending-up 고 말다, 아/어 버리다; recollection 더라, 던데요; similes 다시피, 듯이; aim at solid TOPIK II.</li>
</ol></div>`,
    `<span class="eyebrow">KRL322 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho <strong>Tiếng Hàn trung cấp 2</strong> — dựng tiếp trên nguyên nhân tiêu cực, mục đích, phát hiện, bổ sung, mong ước, giả vờ và thể bị động &amp; sử động của <strong>KRL312</strong> để tiến tới nhượng bộ mạnh, tương phản, tất yếu, giả định, mức độ, rốt cuộc, hồi tưởng và so sánh — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 5</em> — Viện King Sejong (PDF &amp; audio miễn phí)</a></li>
<li><em>Ewha Korean 4</em> — NXB Đại học Ewha</li>
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
<li><strong>Ôn lại KRL312</strong> — nguyên nhân tiêu cực (느라고, 는 바람에), mục đích (도록, 게 하다), phát hiện (더니, 았/었더니), bổ sung (을 뿐만 아니라), mong ước (았/었으면 하다), giả vờ (는 척하다), bị động &amp; sử động (이/히/리/기).</li>
<li><strong>Nhượng bộ &amp; tương phản</strong> — nhượng bộ mạnh 더라도, 아/어 봤자; tương phản 는 반면에, 는 데 반해.</li>
<li><strong>Nêu chân lý &amp; giả định</strong> — tất yếu 기 마련이다, 게 마련이다; giả định 는 셈치고, 은 셈이다; mức độ 을 정도로, 을 만큼.</li>
<li><strong>Rốt cuộc, hồi tưởng &amp; so sánh</strong> — rốt cuộc 고 말다, 아/어 버리다; hồi tưởng 더라, 던데요; so sánh 다시피, 듯이; hướng tới TOPIK II vững.</li>
</ol></div>`,
  ]]);

/* ── Giới thiệu môn ──────────────────────────────────────────────────────── */
const intro = doc('krl322-0-1-overview', 'Course overview: from KRL312 onward|||Tổng quan: nối tiếp từ KRL312',
  'Mục tiêu môn (trung cấp, TOPIK II), nhắc lại nền tảng KRL312, và bản đồ ngữ pháp 8 bài.',
  [[
    `<span class="eyebrow">KRL322 · Lesson 0.1 · Overview</span>
<h2>Intermediate Korean 2</h2>
<p class="lead">This course continues <strong>Intermediate Korean 1 (KRL312)</strong>. You already express negative causes (느라고, 는 바람에), set purpose (도록, 게 하다), report a discovery (더니), stack facts (을 뿐만 아니라), voice wishes (았/었으면 하다), describe pretence (는 척하다) and reshape verbs into the passive and causative (이/히/리/기). Now you will <strong>make strong concessions, draw contrasts, state what is inevitable, argue from a supposition, measure degree, describe how things end up, recall first-hand experience, and build similes</strong> — the heart of <strong>intermediate (TOPIK II)</strong> Korean.</p>
<h3>What KRL312 gave you</h3>
<p>KRL312 built the early-intermediate base: negative cause, purpose &amp; making, discovery, addition, trade-off, wishes, pretence and the passive &amp; causative. This course assumes all of that.</p>
<h3>Roadmap of the 8 lessons</h3>
<p>Strong concession (더라도, 아/어 봤자) → contrast (는 반면에, 는 데 반해) → inevitability (기 마련이다, 게 마련이다) → supposition (는 셈치고, 은 셈이다) → extent (을 정도로, 을 만큼) → ending-up (고 말다, 아/어 버리다) → recollection (더라, 던데요) → similes (다시피, 듯이). Bilingual Korean-Vietnamese, with vocabulary tables, grammar notes, short dialogues and a quiz each lesson.</p>
<div class="callout"><span class="badge">Politeness level</span> This course keeps the <strong>해요체</strong> (polite -요 style) and adds the plain <strong>반말</strong> forms needed for 더라 in Lesson 7. Several patterns carry a feeling (regret, futility, resignation) rather than plain information — the notes flag that nuance, because it is what separates TOPIK II from beginner Korean.</div>`,
    `<span class="eyebrow">KRL322 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Hàn trung cấp 2</h2>
<p class="lead">Môn này nối tiếp <strong>Tiếng Hàn trung cấp 1 (KRL312)</strong>. Bạn đã diễn đạt được nguyên nhân tiêu cực (느라고, 는 바람에), đặt mục đích (도록, 게 하다), kể lại phát hiện (더니), cộng dồn thông tin (을 뿐만 아니라), nói lên mong ước (았/었으면 하다), tả sự giả vờ (는 척하다) và nắn động từ sang bị động, sử động (이/히/리/기). Giờ bạn sẽ <strong>nhượng bộ mạnh, dựng tương phản, nêu điều tất yếu, lập luận từ một giả định, đo mức độ, tả cách sự việc kết thúc, hồi tưởng trải nghiệm tận mắt, và tạo phép so sánh</strong> — cốt lõi của tiếng Hàn <strong>trung cấp (TOPIK II)</strong>.</p>
<h3>KRL312 đã cho bạn gì</h3>
<p>KRL312 dựng nền đầu trung cấp: nguyên nhân tiêu cực, mục đích &amp; khiến, phát hiện, bổ sung, đánh đổi, mong ước, giả vờ và thể bị động &amp; sử động. Môn này giả định bạn đã nắm hết.</p>
<h3>Bản đồ 8 bài</h3>
<p>Nhượng bộ mạnh (더라도, 아/어 봤자) → tương phản (는 반면에, 는 데 반해) → tất yếu (기 마련이다, 게 마련이다) → giả định (는 셈치고, 은 셈이다) → mức độ (을 정도로, 을 만큼) → rốt cuộc (고 말다, 아/어 버리다) → hồi tưởng (더라, 던데요) → so sánh (다시피, 듯이). Song ngữ Hàn-Việt, có bảng từ vựng, ghi chú ngữ pháp, hội thoại ngắn và quiz mỗi bài.</p>
<div class="callout"><span class="badge">Bậc lịch sự</span> Môn này giữ <strong>해요체</strong> (thể lịch sự đuôi -요) và bổ sung dạng <strong>반말</strong> cần cho 더라 ở Bài 7. Nhiều cấu trúc mang một sắc thái tình cảm (tiếc nuối, vô ích, buông xuôi) chứ không chỉ đưa thông tin thuần — phần ghi chú nêu rõ sắc thái đó, vì đây chính là thứ tách TOPIK II khỏi tiếng Hàn sơ cấp.</div>`,
  ]]);

/* ── Bài 1 — Nhượng bộ mạnh ─────────────────────────────────────────────── */
const b1 = doc('krl322-1-1-strong-concession', 'Lesson 1 — Strong concession|||Bài 1 — Nhượng bộ mạnh',
  'V/A + 더라도 (dù có... đi nữa thì cũng), V + 아/어 봤자 (có... cũng vô ích).',
  [[
    `<span class="eyebrow">KRL322 · Lesson 1</span>
<h2>Strong concession (더라도, 아/어 봤자)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>소용없다</td><td>soyongeopda</td><td>to be useless, no use</td></tr>
<tr><td>포기하다</td><td>pogihada</td><td>to give up</td></tr>
<tr><td>노력하다</td><td>noryeokhada</td><td>to make an effort, try</td></tr>
<tr><td>어차피</td><td>eochapi</td><td>anyway, in any case</td></tr>
<tr><td>아무리</td><td>amuri</td><td>no matter how (much)</td></tr>
<tr><td>후회하다</td><td>huhoehada</td><td>to regret</td></tr>
</tbody></table>
<h3>Grammar — even if / even though, and it is no use even if</h3>
<ul>
<li><strong>V/A + 더라도</strong> = even if / even though (stronger, more hypothetical than 아/어도); often paired with 아무리: 비가 오더라도 갈 거예요. 아무리 바쁘더라도.</li>
<li><strong>V + 아/어 봤자</strong> = even if one tries/does V, it is pointless; result is usually futile: 지금 가 봤자 늦었어요. 말해 봤자 소용없어요. Vowel harmony: 가 봤자, 먹어 봤자, 해 봤자.</li>
</ul>
<pre><code>아무리 바쁘더라도 아침은 꼭 먹어야 해요. amuri bappeudeorado achim-eun kkok meogeoya haeyo. = No matter how busy you are, you must eat breakfast.
지금 서두르더라도 기차를 놓칠 거예요. jigeum seodureudeorado gichareul nochil geoyeyo. = Even if you hurry now, you will miss the train.
이제 와서 후회해 봤자 소용없어요. ije waseo huhoehae bwatja soyongeopseoyo. = It is no use regretting now.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 시험이 내일인데 지금부터 공부하면 될까요? (Siheom-i naeirinde jigeumbuteo gongbuhamyeon doelkkayo?)</p>
<p><strong>B:</strong> 솔직히 지금 시작해 봤자 큰 도움은 안 될 거예요. 그래도 아무리 시간이 없더라도 중요한 것만이라도 봐요. (Soljikhi jigeum sijakhae bwatja keun doum-eun an doel geoyeyo. Geuraedo amuri sigan-i eopdeorado jungyohan geonmanirado bwayo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 더라도 is a stronger, more hypothetical "even if" than 아/어도 — it stresses that the result holds no matter what, and pairs naturally with 아무리. 아/어 봤자 says the attempt is not worth it: the second clause is almost always negative or futile (소용없다, 안 되다, 늦다). Follow vowel harmony: ㅏ/ㅗ stems take 아 봤자, others 어 봤자, 하다 becomes 해 봤자.</div>`,
    `<span class="eyebrow">KRL322 · Bài 1</span>
<h2>Nhượng bộ mạnh (더라도, 아/어 봤자)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>소용없다</td><td>soyongeopda</td><td>vô ích, không có tác dụng</td></tr>
<tr><td>포기하다</td><td>pogihada</td><td>từ bỏ</td></tr>
<tr><td>노력하다</td><td>noryeokhada</td><td>nỗ lực, cố gắng</td></tr>
<tr><td>어차피</td><td>eochapi</td><td>dù sao (thì cũng)</td></tr>
<tr><td>아무리</td><td>amuri</td><td>dù... đến mấy</td></tr>
<tr><td>후회하다</td><td>huhoehada</td><td>hối hận</td></tr>
</tbody></table>
<h3>Ngữ pháp — dù có... đi nữa, và có... cũng vô ích</h3>
<ul>
<li><strong>V/A + 더라도</strong> = dù có... đi nữa thì cũng (mạnh và giả định hơn 아/어도); hay đi với 아무리: 비가 오더라도 갈 거예요. 아무리 바쁘더라도.</li>
<li><strong>V + 아/어 봤자</strong> = có làm V thì cũng vô ích; kết quả thường vô nghĩa: 지금 가 봤자 늦었어요. 말해 봤자 소용없어요. Hoà thanh: 가 봤자, 먹어 봤자, 해 봤자.</li>
</ul>
<pre><code>아무리 바쁘더라도 아침은 꼭 먹어야 해요. amuri bappeudeorado achim-eun kkok meogeoya haeyo. = Dù bận đến mấy cũng nhất định phải ăn sáng.
지금 서두르더라도 기차를 놓칠 거예요. jigeum seodureudeorado gichareul nochil geoyeyo. = Dù giờ có vội thì cũng sẽ lỡ tàu thôi.
이제 와서 후회해 봤자 소용없어요. ije waseo huhoehae bwatja soyongeopseoyo. = Giờ có hối hận cũng vô ích.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 시험이 내일인데 지금부터 공부하면 될까요? (Siheom-i naeirinde jigeumbuteo gongbuhamyeon doelkkayo?)</p>
<p><strong>B:</strong> 솔직히 지금 시작해 봤자 큰 도움은 안 될 거예요. 그래도 아무리 시간이 없더라도 중요한 것만이라도 봐요. (Soljikhi jigeum sijakhae bwatja keun doum-eun an doel geoyeyo. Geuraedo amuri sigan-i eopdeorado jungyohan geonmanirado bwayo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 더라도 là "dù có" mạnh và giả định hơn 아/어도 — nhấn rằng kết quả vẫn giữ nguyên bất kể thế nào, và hay đi cùng 아무리. 아/어 봤자 nói rằng cố cũng không đáng: vế sau gần như luôn tiêu cực hoặc vô ích (소용없다, 안 되다, 늦다). Theo hoà thanh: gốc ㅏ/ㅗ lấy 아 봤자, còn lại 어 봤자, 하다 thành 해 봤자.</div>`,
  ]]);
const b1q = quiz('krl322-quiz-1', 'Quiz 1 — Strong concession|||Quiz 1 — Nhượng bộ mạnh', [
  { id: 'q1', question: 'Which pattern says the attempt is POINTLESS / no use?|||Cấu trúc nào nói việc cố gắng là VÔ ÍCH?', options: ['-더라도', '-아/어 봤자', '-는 반면에', '-도록'], correctIndex: 1, explanation: 'V + 아/어 봤자 = có làm cũng vô ích; vế sau thường tiêu cực (소용없다).' },
  { id: 'q2', question: '"아무리 바쁘더라도 밥은 먹어야 해요" means…|||"아무리 바쁘더라도 밥은 먹어야 해요" nghĩa là gì?', options: ['because I am busy I eat|||vì bận nên tôi ăn', 'no matter how busy, you must eat|||dù bận đến mấy cũng phải ăn', 'if I am busy I do not eat|||nếu bận thì không ăn', 'I want to eat because I am busy|||tôi muốn ăn vì bận'], correctIndex: 1, explanation: '아무리 + 더라도 = dù... đến mấy đi nữa thì cũng.' },
  { id: 'q3', question: '하다 + 아/어 봤자 becomes…|||하다 + 아/어 봤자 thành…', options: ['하아 봤자', '해 봤자', '하어 봤자', '했 봤자'], correctIndex: 1, explanation: 'Hoà thanh: 하다 → 해 봤자 (ví dụ 말해 봤자, 후회해 봤자).' },
]);

/* ── Bài 2 — Tương phản ─────────────────────────────────────────────────── */
const b2 = doc('krl322-2-1-contrast', 'Lesson 2 — Contrast (whereas)|||Bài 2 — Tương phản',
  'V + 는 반면(에) / A + (으)ㄴ 반면에 (ngược lại, trong khi đó), 는 데 반해 (trái với).',
  [[
    `<span class="eyebrow">KRL322 · Lesson 2</span>
<h2>Contrast (는 반면에, 는 데 반해)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>장점</td><td>jangjeom</td><td>strong point, advantage</td></tr>
<tr><td>단점</td><td>danjeom</td><td>weak point, drawback</td></tr>
<tr><td>늘다</td><td>neulda</td><td>to increase, grow</td></tr>
<tr><td>줄다</td><td>julda</td><td>to decrease, shrink</td></tr>
<tr><td>물가</td><td>mulga</td><td>prices (cost of living)</td></tr>
<tr><td>반대로</td><td>bandaero</td><td>conversely, on the contrary</td></tr>
</tbody></table>
<h3>Grammar — whereas / on the other hand, in contrast to</h3>
<ul>
<li><strong>V + 는 반면(에), A + -(으)ㄴ 반면에, N인 반면에</strong> = whereas / on the other hand (two contrasting facts): 형은 활발한 반면에 동생은 조용해요.</li>
<li><strong>V + 는 데 반해, A + -(으)ㄴ 데 반해, N인 데 반해</strong> = in contrast to / as opposed to (a little more written): 수출은 느는 데 반해 수입은 줄었어요.</li>
</ul>
<pre><code>이 휴대폰은 기능이 많은 반면에 값이 비싸요. i hyudaepon-eun gineung-i manheun banmyeon-e gaps-i bissayo. = This phone has many features, whereas it is expensive.
도시는 편리한 데 반해 물가가 비싸요. dosineun pyeollihan de banhae mulgaga bissayo. = The city is convenient, in contrast prices are high.
그 일은 돈을 많이 버는 반면에 스트레스가 심해요. geu ir-eun don-eul mani beoneun banmyeon-e seuteureseuga simhaeyo. = That job earns a lot, but on the other hand it is very stressful.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 시골 생활은 어때요? (Sigol saenghwar-eun eottaeyo?)</p>
<p><strong>B:</strong> 공기가 맑고 조용한 반면에 편의 시설이 좀 부족해요. 도시는 편리한 데 반해 너무 복잡하고요. (Gonggiga malkgo joyonghan banmyeon-e pyeonui siseor-i jom bujokhaeyo. Dosineun pyeollihan de banhae neomu bokjaphagoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> Both 는 반면에 and 는 데 반해 mark a contrast between two facts — usually one good side and one bad side, or two subjects that differ. Conjugate by word class: present verb takes 는, adjective takes -(으)ㄴ, noun takes 인. They are near synonyms; 는 데 반해 sounds slightly more formal or written. Unlike Lesson 4 of KRL312 (addition), these connect OPPOSITE points, not same-direction ones.</div>`,
    `<span class="eyebrow">KRL322 · Bài 2</span>
<h2>Tương phản (는 반면에, 는 데 반해)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>장점</td><td>jangjeom</td><td>ưu điểm</td></tr>
<tr><td>단점</td><td>danjeom</td><td>nhược điểm</td></tr>
<tr><td>늘다</td><td>neulda</td><td>tăng lên</td></tr>
<tr><td>줄다</td><td>julda</td><td>giảm đi</td></tr>
<tr><td>물가</td><td>mulga</td><td>vật giá, giá cả sinh hoạt</td></tr>
<tr><td>반대로</td><td>bandaero</td><td>ngược lại, trái lại</td></tr>
</tbody></table>
<h3>Ngữ pháp — ngược lại / trong khi đó, trái với</h3>
<ul>
<li><strong>V + 는 반면(에), A + -(으)ㄴ 반면에, N인 반면에</strong> = ngược lại / trong khi đó (hai điều tương phản): 형은 활발한 반면에 동생은 조용해요.</li>
<li><strong>V + 는 데 반해, A + -(으)ㄴ 데 반해, N인 데 반해</strong> = trái với / ngược với (thiên văn viết hơn): 수출은 느는 데 반해 수입은 줄었어요.</li>
</ul>
<pre><code>이 휴대폰은 기능이 많은 반면에 값이 비싸요. i hyudaepon-eun gineung-i manheun banmyeon-e gaps-i bissayo. = Điện thoại này nhiều chức năng, ngược lại giá thì đắt.
도시는 편리한 데 반해 물가가 비싸요. dosineun pyeollihan de banhae mulgaga bissayo. = Thành phố tiện lợi, trái lại vật giá lại đắt.
그 일은 돈을 많이 버는 반면에 스트레스가 심해요. geu ir-eun don-eul mani beoneun banmyeon-e seuteureseuga simhaeyo. = Công việc đó kiếm được nhiều tiền, nhưng đổi lại rất căng thẳng.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 시골 생활은 어때요? (Sigol saenghwar-eun eottaeyo?)</p>
<p><strong>B:</strong> 공기가 맑고 조용한 반면에 편의 시설이 좀 부족해요. 도시는 편리한 데 반해 너무 복잡하고요. (Gonggiga malkgo joyonghan banmyeon-e pyeonui siseor-i jom bujokhaeyo. Dosineun pyeollihan de banhae neomu bokjaphagoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Cả 는 반면에 và 는 데 반해 đều đánh dấu tương phản giữa hai sự việc — thường một mặt tốt một mặt xấu, hoặc hai chủ thể khác nhau. Chia theo từ loại: động từ hiện tại lấy 는, tính từ lấy -(으)ㄴ, danh từ lấy 인. Hai cái gần đồng nghĩa; 는 데 반해 nghe trang trọng/văn viết hơn. Khác với Bài 4 của KRL312 (bổ sung), cấu trúc này nối hai ý NGƯỢC chiều, không phải cùng chiều.</div>`,
  ]]);
const b2q = quiz('krl322-quiz-2', 'Quiz 2 — Contrast|||Quiz 2 — Tương phản', [
  { id: 'q1', question: 'Both 는 반면에 and 는 데 반해 connect two facts that are…|||Cả 는 반면에 và 는 데 반해 nối hai ý…', options: ['same direction (both good)|||cùng chiều (đều tốt)', 'opposite / contrasting|||ngược chiều, tương phản', 'in sequence|||theo trình tự', 'cause and effect|||nhân quả'], correctIndex: 1, explanation: '반면에 / 데 반해 dùng để đối chiếu hai điều NGƯỢC nhau.' },
  { id: 'q2', question: '많다 (adjective) + 반면에 becomes…|||많다 (tính từ) + 반면에 thành…', options: ['많는 반면에', '많은 반면에', '많을 반면에', '많던 반면에'], correctIndex: 1, explanation: 'Tính từ lấy -(으)ㄴ 반면에: 많다 → 많은 반면에.' },
  { id: 'q3', question: '"편리한 데 반해 물가가 비싸요" means…|||"편리한 데 반해 물가가 비싸요" nghĩa là gì?', options: ['convenient and also cheap|||tiện lợi và lại rẻ', 'convenient, but in contrast prices are high|||tiện lợi, nhưng trái lại vật giá đắt', 'inconvenient and expensive|||bất tiện và đắt', 'convenient because cheap|||tiện lợi vì rẻ'], correctIndex: 1, explanation: '는 데 반해 = trái với; nêu mặt tốt rồi tương phản với mặt xấu.' },
]);

/* ── Bài 3 — Tất yếu ────────────────────────────────────────────────────── */
const b3 = doc('krl322-3-1-inevitable', 'Lesson 3 — It is only natural|||Bài 3 — Tất yếu, đương nhiên',
  'V/A + 기 마련이다 / 게 마련이다 (đương nhiên là, tất yếu sẽ, vốn là vậy).',
  [[
    `<span class="eyebrow">KRL322 · Lesson 3</span>
<h2>It is only natural (기 마련이다, 게 마련이다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>실수하다</td><td>silsuhada</td><td>to make a mistake</td></tr>
<tr><td>익숙하다</td><td>iksukhada</td><td>to be familiar, used to</td></tr>
<tr><td>세월</td><td>sewol</td><td>time, the years</td></tr>
<tr><td>결국</td><td>gyeolguk</td><td>in the end, eventually</td></tr>
<tr><td>나이가 들다</td><td>naiga deulda</td><td>to grow old, age</td></tr>
<tr><td>정이 들다</td><td>jeong-i deulda</td><td>to grow attached, fond</td></tr>
</tbody></table>
<h3>Grammar — it is natural / bound to be so</h3>
<ul>
<li><strong>V/A + 기 마련이다</strong> = it is natural / inevitable that; bound to happen: 사람은 누구나 늙기 마련이에요. 처음에는 실수하기 마련이에요.</li>
<li><strong>V/A + 게 마련이다</strong> = the SAME meaning as 기 마련이다 (a common variant): 노력하면 성공하게 마련이에요.</li>
</ul>
<pre><code>오래된 물건은 고장 나기 마련이에요. oraedoen mulgeon-eun gojang nagi maryeonieyo. = Old things are bound to break down.
열심히 연습하면 실력이 늘기 마련이에요. yeolsimhi yeonseuphamyeon sillyeog-i neulgi maryeonieyo. = If you practice hard, your skill is bound to improve.
자주 만나면 정이 들게 마련이에요. jaju mannamyeon jeong-i deulge maryeonieyo. = If you meet often, you naturally grow attached.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 요즘 실수를 너무 많이 해서 속상해요. (Yojeum silsureul neomu mani haeseo soksanghaeyo.)</p>
<p><strong>B:</strong> 너무 걱정하지 마세요. 새 일을 시작하면 누구나 실수하기 마련이에요. 시간이 지나면 익숙해지게 마련이고요. (Neomu geokjeonghaji maseyo. Sae ir-eul sijakhamyeon nuguna silsuhagi maryeonieyo. Sigan-i jinamyeon iksukhaejige maryeonigoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 기 마련이다 and 게 마련이다 mean exactly the same thing — "it is only natural / inevitable that". They state a general truth, so the pattern itself stays in the present (마련이에요 / 마련입니다); put any time reference in the surrounding words, not on 마련이다. It pairs well with 누구나, 원래 and 결국. Do not use it for a one-off event — only for what is generally, predictably true.</div>`,
    `<span class="eyebrow">KRL322 · Bài 3</span>
<h2>Tất yếu, đương nhiên (기 마련이다, 게 마련이다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>실수하다</td><td>silsuhada</td><td>mắc lỗi</td></tr>
<tr><td>익숙하다</td><td>iksukhada</td><td>quen thuộc, thành thạo</td></tr>
<tr><td>세월</td><td>sewol</td><td>năm tháng, thời gian</td></tr>
<tr><td>결국</td><td>gyeolguk</td><td>rốt cuộc, cuối cùng</td></tr>
<tr><td>나이가 들다</td><td>naiga deulda</td><td>có tuổi, già đi</td></tr>
<tr><td>정이 들다</td><td>jeong-i deulda</td><td>nảy tình cảm, thân thiết</td></tr>
</tbody></table>
<h3>Ngữ pháp — đương nhiên / tất yếu sẽ như vậy</h3>
<ul>
<li><strong>V/A + 기 마련이다</strong> = đương nhiên là / tất yếu sẽ; vốn phải xảy ra: 사람은 누구나 늙기 마련이에요. 처음에는 실수하기 마련이에요.</li>
<li><strong>V/A + 게 마련이다</strong> = nghĩa GIỐNG HỆT 기 마련이다 (biến thể thường gặp): 노력하면 성공하게 마련이에요.</li>
</ul>
<pre><code>오래된 물건은 고장 나기 마련이에요. oraedoen mulgeon-eun gojang nagi maryeonieyo. = Đồ dùng lâu năm thì đương nhiên sẽ hỏng.
열심히 연습하면 실력이 늘기 마련이에요. yeolsimhi yeonseuphamyeon sillyeog-i neulgi maryeonieyo. = Chăm luyện tập thì thực lực tất yếu sẽ tăng.
자주 만나면 정이 들게 마련이에요. jaju mannamyeon jeong-i deulge maryeonieyo. = Gặp nhau thường xuyên thì đương nhiên sẽ nảy sinh tình cảm.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 요즘 실수를 너무 많이 해서 속상해요. (Yojeum silsureul neomu mani haeseo soksanghaeyo.)</p>
<p><strong>B:</strong> 너무 걱정하지 마세요. 새 일을 시작하면 누구나 실수하기 마련이에요. 시간이 지나면 익숙해지게 마련이고요. (Neomu geokjeonghaji maseyo. Sae ir-eul sijakhamyeon nuguna silsuhagi maryeonieyo. Sigan-i jinamyeon iksukhaejige maryeonigoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 기 마련이다 và 게 마련이다 nghĩa hệt nhau — "đương nhiên / tất yếu là như vậy". Chúng nêu một chân lý chung, nên bản thân cấu trúc giữ ở hiện tại (마련이에요 / 마련입니다); mọi mốc thời gian đặt ở phần chữ xung quanh, không đặt lên 마련이다. Cấu trúc hợp với 누구나, 원래, 결국. Đừng dùng cho một sự việc đơn lẻ — chỉ dùng cho điều nói chung, có thể đoán trước là đúng.</div>`,
  ]]);
const b3q = quiz('krl322-quiz-3', 'Quiz 3 — It is only natural|||Quiz 3 — Tất yếu', [
  { id: 'q1', question: 'What does V + 기 마련이다 express?|||V + 기 마련이다 diễn đạt gì?', options: ['a wish|||một mong ước', 'something natural / inevitable|||điều đương nhiên, tất yếu', 'a command|||một mệnh lệnh', 'an unexpected event|||một việc bất ngờ'], correctIndex: 1, explanation: '기 마련이다 = đương nhiên / tất yếu sẽ như vậy; nêu chân lý chung.' },
  { id: 'q2', question: '게 마련이다 compared with 기 마련이다 is…|||게 마련이다 so với 기 마련이다 thì…', options: ['the opposite meaning|||nghĩa ngược lại', 'the same meaning (a variant)|||nghĩa giống hệt (biến thể)', 'only for the past|||chỉ dùng cho quá khứ', 'only for questions|||chỉ dùng cho câu hỏi'], correctIndex: 1, explanation: '게 마련이다 = 기 마련이다, chỉ là cách nói khác cùng nghĩa.' },
  { id: 'q3', question: '"처음에는 실수하기 마련이에요" means…|||"처음에는 실수하기 마련이에요" nghĩa là gì?', options: ['do not make mistakes at first|||lúc đầu đừng mắc lỗi', 'it is natural to make mistakes at first|||lúc đầu mắc lỗi là chuyện đương nhiên', 'I made a mistake at first|||lúc đầu tôi đã mắc lỗi', 'I hope to avoid mistakes|||tôi mong tránh được lỗi'], correctIndex: 1, explanation: '기 마련이다 nêu điều tất yếu: mới bắt đầu thì mắc lỗi là chuyện thường.' },
]);

/* ── Bài 4 — Giả định, coi như ──────────────────────────────────────────── */
const b4 = doc('krl322-4-1-suppose-count', 'Lesson 4 — Suppose & counts as|||Bài 4 — Coi như, giả định',
  'V + 는/은 셈치고 (cứ coi như, làm như thể), V/A + (으)ㄴ/는 셈이다 (coi như, gần như là).',
  [[
    `<span class="eyebrow">KRL322 · Lesson 4</span>
<h2>Suppose &amp; counts as (는 셈치고, 은 셈이다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>속다</td><td>sokda</td><td>to be fooled, deceived</td></tr>
<tr><td>절약하다</td><td>jeoryakhada</td><td>to save, economize</td></tr>
<tr><td>저축하다</td><td>jeochukhada</td><td>to save up (money)</td></tr>
<tr><td>기부하다</td><td>gibuhada</td><td>to donate</td></tr>
<tr><td>손해</td><td>sonhae</td><td>loss, damage</td></tr>
<tr><td>경험</td><td>gyeongheom</td><td>experience</td></tr>
</tbody></table>
<h3>Grammar — suppose that (for the sake of), and it amounts to</h3>
<ul>
<li><strong>V + 는 셈치고 / -(으)ㄴ 셈치고</strong> = treat it as if / suppose that (a basis for acting): 속는 셈치고 한번 해 보세요. 저금하는 셈치고 모아요.</li>
<li><strong>V/A + -(으)ㄴ 셈이다 / 는 셈이다</strong> = it amounts to / counts as / is practically (summary or estimate): 이 정도면 다 한 셈이에요.</li>
</ul>
<pre><code>속는 셈치고 이 방법을 한번 써 보세요. sokneun semchigo i bangbeob-eul hanbeon sseo boseyo. = Give this method a try, as if you have nothing to lose.
운동하는 셈치고 계단으로 올라가요. undonghaneun semchigo gyedaneuro ollagayo. = Take the stairs, treating it as a bit of exercise.
결론만 남았으니까 보고서를 다 쓴 셈이에요. gyeollonman namasseunikka bogoseoreul da sseun semieyo. = Only the conclusion is left, so the report is practically done.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 이 강좌가 좀 비싼데 들을까 말까 고민이에요. (I gangjwaga jom bissande deureulkka malkka gominieyo.)</p>
<p><strong>B:</strong> 속는 셈치고 한번 들어 보세요. 안 맞으면 경험을 쌓은 셈이잖아요. (Sokneun semchigo hanbeon deureo boseyo. An majeumyeon gyeongheom-eul ssaeun semijanhayo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 셈치다 and 셈이다 look alike but do different jobs. 는 셈치고 = "treat it as if / suppose that", giving you a reason to act even when reality differs (속는 셈치고 = give it a shot even if it fails). 은 셈이다 = "it amounts to / is practically" — a summary or estimate, not a claim that it literally happened. For a completed action before 셈이다, use -(으)ㄴ (쓴 셈이다).</div>`,
    `<span class="eyebrow">KRL322 · Bài 4</span>
<h2>Coi như, giả định (는 셈치고, 은 셈이다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>속다</td><td>sokda</td><td>bị lừa</td></tr>
<tr><td>절약하다</td><td>jeoryakhada</td><td>tiết kiệm</td></tr>
<tr><td>저축하다</td><td>jeochukhada</td><td>để dành, gửi tiết kiệm</td></tr>
<tr><td>기부하다</td><td>gibuhada</td><td>quyên góp</td></tr>
<tr><td>손해</td><td>sonhae</td><td>thiệt hại, lỗ</td></tr>
<tr><td>경험</td><td>gyeongheom</td><td>kinh nghiệm</td></tr>
</tbody></table>
<h3>Ngữ pháp — cứ coi như (để mà làm), và coi như / gần như là</h3>
<ul>
<li><strong>V + 는 셈치고 / -(으)ㄴ 셈치고</strong> = cứ coi như / làm như thể (lấy làm cơ sở để hành động): 속는 셈치고 한번 해 보세요. 저금하는 셈치고 모아요.</li>
<li><strong>V/A + -(으)ㄴ 셈이다 / 는 셈이다</strong> = coi như / xem như / gần như là (tổng kết hoặc ước lượng): 이 정도면 다 한 셈이에요.</li>
</ul>
<pre><code>속는 셈치고 이 방법을 한번 써 보세요. sokneun semchigo i bangbeob-eul hanbeon sseo boseyo. = Cứ coi như bị lừa mà thử phương pháp này một lần xem.
운동하는 셈치고 계단으로 올라가요. undonghaneun semchigo gyedaneuro ollagayo. = Coi như tập thể dục nên tôi đi thang bộ.
결론만 남았으니까 보고서를 다 쓴 셈이에요. gyeollonman namasseunikka bogoseoreul da sseun semieyo. = Chỉ còn phần kết luận nên báo cáo coi như đã xong.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 이 강좌가 좀 비싼데 들을까 말까 고민이에요. (I gangjwaga jom bissande deureulkka malkka gominieyo.)</p>
<p><strong>B:</strong> 속는 셈치고 한번 들어 보세요. 안 맞으면 경험을 쌓은 셈이잖아요. (Sokneun semchigo hanbeon deureo boseyo. An majeumyeon gyeongheom-eul ssaeun semijanhayo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 셈치다 và 셈이다 nhìn giống nhau nhưng làm việc khác nhau. 는 셈치고 = "cứ coi như / làm như thể", cho bạn một lý do để hành động dù thực tế khác đi (속는 셈치고 = cứ thử dù có thể hỏng). 은 셈이다 = "coi như / gần như là" — một tổng kết hay ước lượng, không khẳng định việc đã thực sự xảy ra. Với hành động đã hoàn tất trước 셈이다, dùng -(으)ㄴ (쓴 셈이다).</div>`,
  ]]);
const b4q = quiz('krl322-quiz-4', 'Quiz 4 — Suppose & counts as|||Quiz 4 — Coi như, giả định', [
  { id: 'q1', question: 'Which gives a REASON TO ACT ("treat it as if, and do it")?|||Đâu là "cứ coi như... mà làm" (lý do để hành động)?', options: ['-는 셈치고', '-은 셈이다', '-기 마련이다', '-는 반면에'], correctIndex: 0, explanation: 'V + 는 셈치고 = cứ coi như... mà làm; 속는 셈치고 = cứ coi như bị lừa mà thử.' },
  { id: 'q2', question: '"다 쓴 셈이에요" tells us the report is…|||"다 쓴 셈이에요" cho biết báo cáo…', options: ['not started|||chưa bắt đầu', 'practically / as good as done|||coi như / gần như đã xong', 'literally 100% finished and printed|||đã in xong 100% theo nghĩa đen', 'lost|||bị mất'], correctIndex: 1, explanation: '은 셈이다 = coi như / gần như; đủ gần để xem là đã xong.' },
  { id: 'q3', question: '"운동하는 셈치고 계단으로 올라가요" means…|||"운동하는 셈치고 계단으로 올라가요" nghĩa là gì?', options: ['I exercise then take the stairs|||tôi tập rồi mới đi thang bộ', 'I take the stairs, treating it as exercise|||tôi đi thang bộ, coi như tập thể dục', 'I cannot exercise on the stairs|||tôi không tập được ở cầu thang', 'I take the elevator to exercise|||tôi đi thang máy để tập'], correctIndex: 1, explanation: '는 셈치고 = coi như (một việc) để lấy đó làm lý do hành động.' },
]);

/* ── Bài 5 — Mức độ ─────────────────────────────────────────────────────── */
const b5 = doc('krl322-5-1-extent', 'Lesson 5 — To the extent that|||Bài 5 — Đến mức',
  'V/A + (으)ㄹ 정도로 (đến mức), V/A + (으)ㄹ 만큼 (đến mức / bằng như).',
  [[
    `<span class="eyebrow">KRL322 · Lesson 5</span>
<h2>To the extent that (을 정도로, 을 만큼)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>정도</td><td>jeongdo</td><td>degree, extent</td></tr>
<tr><td>터지다</td><td>teojida</td><td>to burst, explode</td></tr>
<tr><td>쓰러지다</td><td>sseureojida</td><td>to collapse, fall down</td></tr>
<tr><td>소리치다</td><td>sorichida</td><td>to shout, cry out</td></tr>
<tr><td>참다</td><td>chamda</td><td>to endure, hold back</td></tr>
<tr><td>셀 수 없다</td><td>sel su eopda</td><td>to be countless</td></tr>
</tbody></table>
<h3>Grammar — to such a degree that, as much as</h3>
<ul>
<li><strong>V/A + -(으)ㄹ 정도로</strong> = to the extent / degree that: 눈물이 날 정도로 웃었어요. 발이 아플 정도로 걸었어요.</li>
<li><strong>V/A + -(으)ㄹ 만큼</strong> = to the extent that / as much as: 배가 터질 만큼 먹었어요. 만큼 also compares with a noun: 형만큼 키가 커요 (as tall as my brother).</li>
</ul>
<pre><code>발이 아플 정도로 많이 걸었어요. bar-i apeul jeongdoro mani georeosseoyo. = I walked so much that my feet hurt.
목이 아플 만큼 크게 소리쳤어요. mog-i apeul mankeum keuge sorichyeosseoyo. = I shouted so loudly that my throat hurt.
믿을 수 없을 정도로 실력이 늘었어요. mideul su eopseul jeongdoro sillyeog-i neureosseoyo. = His skill improved to an unbelievable degree.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 어제 콘서트 어땠어요? (Eoje konseoteu eottaesseoyo?)</p>
<p><strong>B:</strong> 정말 최고였어요. 목이 다 쉴 정도로 소리를 질렀어요. 사람도 셀 수 없을 만큼 많이 왔고요. (Jeongmal choegoyeosseoyo. Mog-i da swil jeongdoro sorireul jilleosseoyo. Saramdo sel su eopseul mankeum mani watgoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> Both -(으)ㄹ 정도로 and -(으)ㄹ 만큼 mean "to such a degree that", and in that sense are largely interchangeable. Note the adnominal ending is the future/potential -(으)ㄹ, even about the past (아플 정도로 걸었어요). 만큼 has one extra job that 정도로 does not: after a noun it makes an equal comparison (나만큼 = as much as me, 이만큼 = this much).</div>`,
    `<span class="eyebrow">KRL322 · Bài 5</span>
<h2>Đến mức (을 정도로, 을 만큼)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>정도</td><td>jeongdo</td><td>mức độ</td></tr>
<tr><td>터지다</td><td>teojida</td><td>vỡ, nổ tung</td></tr>
<tr><td>쓰러지다</td><td>sseureojida</td><td>ngã quỵ, gục xuống</td></tr>
<tr><td>소리치다</td><td>sorichida</td><td>hét lên, la lớn</td></tr>
<tr><td>참다</td><td>chamda</td><td>chịu đựng, nhịn</td></tr>
<tr><td>셀 수 없다</td><td>sel su eopda</td><td>không đếm xuể</td></tr>
</tbody></table>
<h3>Ngữ pháp — đến mức mà, bằng như</h3>
<ul>
<li><strong>V/A + -(으)ㄹ 정도로</strong> = đến mức / tới độ: 눈물이 날 정도로 웃었어요. 발이 아플 정도로 걸었어요.</li>
<li><strong>V/A + -(으)ㄹ 만큼</strong> = đến mức / bằng như: 배가 터질 만큼 먹었어요. 만큼 còn so sánh với danh từ: 형만큼 키가 커요 (cao bằng anh trai).</li>
</ul>
<pre><code>발이 아플 정도로 많이 걸었어요. bar-i apeul jeongdoro mani georeosseoyo. = Tôi đi bộ nhiều đến mức đau cả chân.
목이 아플 만큼 크게 소리쳤어요. mog-i apeul mankeum keuge sorichyeosseoyo. = Tôi hét lớn đến mức đau cả cổ họng.
믿을 수 없을 정도로 실력이 늘었어요. mideul su eopseul jeongdoro sillyeog-i neureosseoyo. = Thực lực của anh ấy tiến bộ đến mức khó tin.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 어제 콘서트 어땠어요? (Eoje konseoteu eottaesseoyo?)</p>
<p><strong>B:</strong> 정말 최고였어요. 목이 다 쉴 정도로 소리를 질렀어요. 사람도 셀 수 없을 만큼 많이 왔고요. (Jeongmal choegoyeosseoyo. Mog-i da swil jeongdoro sorireul jilleosseoyo. Saramdo sel su eopseul mankeum mani watgoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Cả -(으)ㄹ 정도로 và -(으)ㄹ 만큼 đều nghĩa "đến mức mà", và ở nghĩa này gần như thay thế được cho nhau. Lưu ý đuôi định ngữ là -(으)ㄹ (tương lai/khả năng), dù nói về quá khứ (아플 정도로 걸었어요). 만큼 có thêm một việc mà 정도로 không có: sau danh từ nó tạo phép so sánh ngang bằng (나만큼 = bằng tôi, 이만큼 = bằng chừng này).</div>`,
  ]]);
const b5q = quiz('krl322-quiz-5', 'Quiz 5 — To the extent that|||Quiz 5 — Đến mức', [
  { id: 'q1', question: 'The adnominal ending before 정도로 / 만큼 (degree meaning) is…|||Đuôi định ngữ trước 정도로 / 만큼 (nghĩa mức độ) là…', options: ['-는', '-(으)ㄹ', '-던', '-았/었'], correctIndex: 1, explanation: 'Dùng -(으)ㄹ dù nói về quá khứ: 발이 아플 정도로 걸었어요.' },
  { id: 'q2', question: 'Which can ALSO make an equal comparison after a noun (as much as)?|||Đâu còn dùng sau danh từ để so sánh ngang bằng (bằng như)?', options: ['-정도로', '-만큼', '-마련이다', '-셈치고'], correctIndex: 1, explanation: '만큼 sau danh từ = ngang bằng: 나만큼, 형만큼 키가 커요.' },
  { id: 'q3', question: '"발이 아플 정도로 많이 걸었어요" means…|||"발이 아플 정도로 많이 걸었어요" nghĩa là gì?', options: ['I walked because my feet hurt|||tôi đi vì đau chân', 'I walked so much that my feet hurt|||tôi đi nhiều đến mức đau chân', 'my feet hurt so I stopped|||đau chân nên tôi dừng', 'I want to walk more|||tôi muốn đi thêm'], correctIndex: 1, explanation: '을 정도로 = đến mức: đi nhiều tới độ đau chân.' },
]);

/* ── Bài 6 — Rốt cuộc, mất rồi ──────────────────────────────────────────── */
const b6 = doc('krl322-6-1-end-up', 'Lesson 6 — Ending up|||Bài 6 — Rốt cuộc, mất rồi',
  'V + 고 말다 (rốt cuộc đã..., cuối cùng đành), V + 아/어 버리다 (làm...mất rồi, xong sạch).',
  [[
    `<span class="eyebrow">KRL322 · Lesson 6</span>
<h2>Ending up (고 말다, 아/어 버리다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>잃어버리다</td><td>ireobeorida</td><td>to lose (something)</td></tr>
<tr><td>잊어버리다</td><td>ijeobeorida</td><td>to forget completely</td></tr>
<tr><td>깨지다</td><td>kkaejida</td><td>to break, be shattered</td></tr>
<tr><td>넘어지다</td><td>neomeojida</td><td>to fall down, trip</td></tr>
<tr><td>떨어뜨리다</td><td>tteoreotteurida</td><td>to drop (something)</td></tr>
<tr><td>쏟다</td><td>ssotda</td><td>to spill, pour out</td></tr>
</tbody></table>
<h3>Grammar — end up doing, and do completely (off)</h3>
<ul>
<li><strong>V + 고 말다</strong> = end up (V-ing) in the end (often unintended, with regret, or with resolve): 결국 울고 말았어요. 참지 못하고 웃고 말았어요.</li>
<li><strong>V + 아/어 버리다</strong> = do V completely / all up (leaving relief or loss): 다 먹어 버렸어요. 지갑을 잃어버렸어요. Vowel harmony: 아 버리다, 어 버리다, 해 버리다.</li>
</ul>
<pre><code>너무 피곤해서 지하철에서 잠들고 말았어요. neomu pigonhaeseo jihacheor-eseo jamdeulgo marasseoyo. = I was so tired that I ended up falling asleep on the subway.
참으려고 했지만 결국 웃고 말았어요. chameuryeogo haetjiman gyeolguk utgo marasseoyo. = I tried to hold back, but ended up laughing.
배가 고파서 케이크를 다 먹어 버렸어요. baega gopaseo keikeureul da meogeo beoryeosseoyo. = I was hungry, so I ate the whole cake up.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 얼굴이 안 좋아 보여요. 무슨 일 있어요? (Eolgur-i an joa boyeoyo. Museun il isseoyo?)</p>
<p><strong>B:</strong> 아끼던 컵을 떨어뜨려서 깨뜨리고 말았어요. 그리고 화가 나서 남은 커피도 다 쏟아 버렸어요. (Akkideon keob-eul tteoreotteuryeoseo kkaetteurigo marasseoyo. Geurigo hwaga naseo nameun keopido da ssoda beoryeosseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 고 말다 stresses the final RESULT — "it came to that in the end", usually against your wishes (regret) or with strong resolve. 아/어 버리다 stresses COMPLETION and the feeling left behind: relief that a burden is gone, or regret that something is lost for good. Many are fixed words: 잃어버리다 (lose), 잊어버리다 (forget). Both often take 결국 or 다.</div>`,
    `<span class="eyebrow">KRL322 · Bài 6</span>
<h2>Rốt cuộc, mất rồi (고 말다, 아/어 버리다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>잃어버리다</td><td>ireobeorida</td><td>đánh mất</td></tr>
<tr><td>잊어버리다</td><td>ijeobeorida</td><td>quên mất</td></tr>
<tr><td>깨지다</td><td>kkaejida</td><td>bị vỡ, bể</td></tr>
<tr><td>넘어지다</td><td>neomeojida</td><td>ngã, vấp ngã</td></tr>
<tr><td>떨어뜨리다</td><td>tteoreotteurida</td><td>làm rơi</td></tr>
<tr><td>쏟다</td><td>ssotda</td><td>làm đổ, đổ ra</td></tr>
</tbody></table>
<h3>Ngữ pháp — rốt cuộc đã..., và làm... mất rồi</h3>
<ul>
<li><strong>V + 고 말다</strong> = rốt cuộc đã / cuối cùng đành (thường ngoài ý muốn, kèm tiếc nuối, hoặc thể hiện quyết tâm): 결국 울고 말았어요. 참지 못하고 웃고 말았어요.</li>
<li><strong>V + 아/어 버리다</strong> = làm V xong sạch / ... mất rồi (để lại cảm giác nhẹ nhõm hoặc mất mát): 다 먹어 버렸어요. 지갑을 잃어버렸어요. Hoà thanh: 아 버리다, 어 버리다, 해 버리다.</li>
</ul>
<pre><code>너무 피곤해서 지하철에서 잠들고 말았어요. neomu pigonhaeseo jihacheor-eseo jamdeulgo marasseoyo. = Mệt quá nên rốt cuộc tôi ngủ gục luôn trên tàu điện ngầm.
참으려고 했지만 결국 웃고 말았어요. chameuryeogo haetjiman gyeolguk utgo marasseoyo. = Tôi cố nhịn nhưng cuối cùng vẫn bật cười.
배가 고파서 케이크를 다 먹어 버렸어요. baega gopaseo keikeureul da meogeo beoryeosseoyo. = Đói quá nên tôi ăn sạch cả cái bánh.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 얼굴이 안 좋아 보여요. 무슨 일 있어요? (Eolgur-i an joa boyeoyo. Museun il isseoyo?)</p>
<p><strong>B:</strong> 아끼던 컵을 떨어뜨려서 깨뜨리고 말았어요. 그리고 화가 나서 남은 커피도 다 쏟아 버렸어요. (Akkideon keob-eul tteoreotteuryeoseo kkaetteurigo marasseoyo. Geurigo hwaga naseo nameun keopido da ssoda beoryeosseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 고 말다 nhấn KẾT QUẢ cuối cùng — "rốt cuộc đã thành ra vậy", thường ngoài ý muốn (tiếc nuối) hoặc kèm quyết tâm. 아/어 버리다 nhấn sự HOÀN TẤT và cảm giác để lại: nhẹ nhõm vì trút được gánh nặng, hoặc tiếc vì mất hẳn. Nhiều từ đã cố định: 잃어버리다 (đánh mất), 잊어버리다 (quên mất). Cả hai hay đi với 결국 hoặc 다.</div>`,
  ]]);
const b6q = quiz('krl322-quiz-6', 'Quiz 6 — Ending up|||Quiz 6 — Rốt cuộc, mất rồi', [
  { id: 'q1', question: 'Which stresses the FINAL RESULT ("ended up, in the end")?|||Đâu nhấn KẾT QUẢ cuối cùng ("rốt cuộc đã...")?', options: ['-고 말다', '-기 마련이다', '-는 반면에', '-을 정도로'], correctIndex: 0, explanation: 'V + 고 말다 = rốt cuộc đã / cuối cùng đành, thường ngoài ý muốn.' },
  { id: 'q2', question: '"케이크를 다 먹어 버렸어요" adds the nuance of…|||"케이크를 다 먹어 버렸어요" thêm sắc thái…', options: ['just starting to eat|||vừa mới bắt đầu ăn', 'completely finishing it off (relief/regret)|||ăn sạch, xong hẳn (nhẹ nhõm/tiếc)', 'sharing the cake|||chia bánh', 'not eating it|||không ăn'], correctIndex: 1, explanation: '아/어 버리다 = làm xong sạch, để lại cảm giác nhẹ nhõm hoặc tiếc.' },
  { id: 'q3', question: '잊다 + 아/어 버리다 becomes the fixed word…|||잊다 + 아/어 버리다 thành từ cố định…', options: ['잊고 말다', '잊어버리다', '잊는 척하다', '잊을 만큼'], correctIndex: 1, explanation: '잊어버리다 = quên mất (từ đã cố định), tương tự 잃어버리다 = đánh mất.' },
]);

/* ── Bài 7 — Hồi tưởng, nói lại ─────────────────────────────────────────── */
const b7 = doc('krl322-7-1-retrospective', 'Lesson 7 — Recalling experience|||Bài 7 — Hồi tưởng, nói lại',
  'V/A + 더라 (반말: tôi thấy... đấy), V/A + 던데요 (kể lại tận mắt, mời phản hồi).',
  [[
    `<span class="eyebrow">KRL322 · Lesson 7</span>
<h2>Recalling experience (더라, 던데요)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>경치</td><td>gyeongchi</td><td>scenery, view</td></tr>
<tr><td>붐비다</td><td>bumbida</td><td>to be crowded, packed</td></tr>
<tr><td>신선하다</td><td>sinseonhada</td><td>to be fresh</td></tr>
<tr><td>인상적이다</td><td>insangjeogida</td><td>to be impressive</td></tr>
<tr><td>친절하다</td><td>chinjeolhada</td><td>to be kind, friendly</td></tr>
<tr><td>기억나다</td><td>gieoknada</td><td>to come to mind, recall</td></tr>
</tbody></table>
<h3>Grammar — I saw/experienced it (and I am telling you)</h3>
<ul>
<li><strong>V/A + 더라</strong> = plain (반말) recollection of what you personally saw/heard/felt: 그 영화 정말 재미있더라. The polite equivalent is 더라고(요): 재미있더라고요.</li>
<li><strong>V/A + 던데요</strong> = recall a first-hand impression as background, inviting a reaction (polite): 그 식당 음식이 맛있던데요.</li>
</ul>
<pre><code>어제 명동에 갔는데 사람이 정말 많더라. eoje myeongdong-e gatneunde saram-i jeongmal mandeora. = I went to Myeongdong yesterday and there were really a lot of people.
그 카페는 분위기가 참 좋던데요. geu kape-neun bunwigiga cham jotdeonyo. = That cafe had a really nice atmosphere, you know.
민수 씨가 노래를 정말 잘하더라고요. minsu ssiga norereul jeongmal jalhadeoragoyo. = Minsu sang really well, I noticed.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 지난주에 부산에 다녀왔다면서요? 어땠어요? (Jinanju-e busan-e danyeowatdamyeonseoyo? Eottaesseoyo?)</p>
<p><strong>B:</strong> 바다가 정말 예쁘더라고요. 회도 신선하고 값도 싸던데요. 사람이 좀 많던데 그래도 갈 만했어요. (Badaga jeongmal yeppeudeoragoyo. Hoedo sinseonhago gapdo ssadeonyo. Saram-i jom mandeonde geuraedo gal manhaesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> The marker 더 signals a FIRST-HAND recollection — something you yourself witnessed in the past. 더라 is plain speech; its polite form is 더라고(요), and 던데요 adds a soft "background + reaction" nuance. Because it reports your own perception, the described subject is usually 2nd or 3rd person; use it for what you saw, not for facts you only heard second-hand (for those use 대요 / 다고 해요).</div>`,
    `<span class="eyebrow">KRL322 · Bài 7</span>
<h2>Hồi tưởng, nói lại (더라, 던데요)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>경치</td><td>gyeongchi</td><td>phong cảnh</td></tr>
<tr><td>붐비다</td><td>bumbida</td><td>đông đúc, chật ních</td></tr>
<tr><td>신선하다</td><td>sinseonhada</td><td>tươi, tươi mới</td></tr>
<tr><td>인상적이다</td><td>insangjeogida</td><td>ấn tượng</td></tr>
<tr><td>친절하다</td><td>chinjeolhada</td><td>thân thiện, tử tế</td></tr>
<tr><td>기억나다</td><td>gieoknada</td><td>nhớ ra, sực nhớ</td></tr>
</tbody></table>
<h3>Ngữ pháp — chính tôi đã thấy/trải qua (và kể lại)</h3>
<ul>
<li><strong>V/A + 더라</strong> = hồi tưởng ở dạng 반말 điều mình tận mắt thấy/nghe/cảm: 그 영화 정말 재미있더라. Dạng lịch sự là 더라고(요): 재미있더라고요.</li>
<li><strong>V/A + 던데요</strong> = kể lại ấn tượng tận mắt làm nền, mời người nghe phản hồi (lịch sự): 그 식당 음식이 맛있던데요.</li>
</ul>
<pre><code>어제 명동에 갔는데 사람이 정말 많더라. eoje myeongdong-e gatneunde saram-i jeongmal mandeora. = Hôm qua tôi đến Myeongdong, người đông thật đấy.
그 카페는 분위기가 참 좋던데요. geu kape-neun bunwigiga cham jotdeonyo. = Cái quán cà phê đó không khí dễ chịu lắm đấy.
민수 씨가 노래를 정말 잘하더라고요. minsu ssiga norereul jeongmal jalhadeoragoyo. = Anh Minsu hát hay thật, tôi thấy vậy đấy.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 지난주에 부산에 다녀왔다면서요? 어땠어요? (Jinanju-e busan-e danyeowatdamyeonseoyo? Eottaesseoyo?)</p>
<p><strong>B:</strong> 바다가 정말 예쁘더라고요. 회도 신선하고 값도 싸던데요. 사람이 좀 많던데 그래도 갈 만했어요. (Badaga jeongmal yeppeudeoragoyo. Hoedo sinseonhago gapdo ssadeonyo. Saram-i jom mandeonde geuraedo gal manhaesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Phụ tố 더 báo hiệu một hồi tưởng TẬN MẮT — điều chính bạn đã chứng kiến trong quá khứ. 더라 là dạng nói trống (반말); dạng lịch sự là 더라고(요), còn 던데요 thêm sắc thái nhẹ "làm nền + chờ phản hồi". Vì kể lại điều mình cảm nhận, chủ ngữ được tả thường là ngôi 2 hoặc 3; dùng cho điều bạn tận mắt thấy, không dùng cho tin chỉ nghe lại (tin nghe lại dùng 대요 / 다고 해요).</div>`,
  ]]);
const b7q = quiz('krl322-quiz-7', 'Quiz 7 — Recalling experience|||Quiz 7 — Hồi tưởng, nói lại', [
  { id: 'q1', question: 'The marker 더 signals that the speaker…|||Phụ tố 더 báo hiệu người nói…', options: ['heard it second-hand|||nghe lại từ người khác', 'witnessed it first-hand in the past|||tận mắt chứng kiến trong quá khứ', 'is guessing|||đang phỏng đoán', 'is giving a command|||đang ra lệnh'], correctIndex: 1, explanation: '더 = hồi tưởng điều CHÍNH MÌNH đã tận mắt thấy/nghe/cảm.' },
  { id: 'q2', question: 'The polite form of the plain 더라 is…|||Dạng lịch sự của 더라 (반말) là…', options: ['더라고요', '더라도', '던 셈이다', '기 마련이다'], correctIndex: 0, explanation: '더라 (반말) → 더라고(요) (lịch sự): 재미있더라 → 재미있더라고요.' },
  { id: 'q3', question: 'For a fact you only HEARD from someone else, you should use…|||Với điều chỉ NGHE LẠI từ người khác, nên dùng…', options: ['-더라', '-대요 / 다고 해요', '-던데요', '-더라고요'], correctIndex: 1, explanation: '더라 chỉ dùng cho điều tận mắt; tin nghe lại dùng 대요 / 다고 해요.' },
]);

/* ── Bài 8 — So sánh (như, giống như) ───────────────────────────────────── */
const b8 = doc('krl322-8-1-as-like', 'Lesson 8 — As & like|||Bài 8 — Như, giống như',
  'V + 다시피 (như bạn biết/thấy/nói), V/A + 듯이 (như thể, y như, giống như).',
  [[
    `<span class="eyebrow">KRL322 · Lesson 8</span>
<h2>As &amp; like (다시피, 듯이)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>짐작하다</td><td>jimjakhada</td><td>to guess, surmise</td></tr>
<tr><td>예상하다</td><td>yesanghada</td><td>to expect, anticipate</td></tr>
<tr><td>마치</td><td>machi</td><td>as if, just like</td></tr>
<tr><td>흐르다</td><td>heureuda</td><td>to flow (르 irregular)</td></tr>
<tr><td>쏟아지다</td><td>ssodajida</td><td>to pour down, gush</td></tr>
<tr><td>자료</td><td>jaryo</td><td>materials, data</td></tr>
</tbody></table>
<h3>Grammar — as (you know/see), and just as / as if</h3>
<ul>
<li><strong>V + 다시피</strong> = as (you) know/see/said; used with 알다, 보다, 말하다, 듣다, 짐작하다: 아시다시피, 보시다시피, 말했다시피.</li>
<li><strong>V/A + 듯이 (듯)</strong> = (just) as / as if; often with 마치: 물 쓰듯이 돈을 써요. 비 오듯이 땀이 났어요. Completed action uses 았/었듯이.</li>
</ul>
<pre><code>아시다시피 다음 주에 시험이 있습니다. asidasipi da-eum ju-e siheom-i itseumnida. = As you know, there is an exam next week.
보시다시피 교실이 너무 좁습니다. bosidasipi gyosir-i neomu jopseumnida. = As you can see, the classroom is too small.
그는 마치 화가 난 듯이 문을 쾅 닫았어요. geuneun machi hwaga nan deusi mun-eul kwang dadasseoyo. = He shut the door with a bang as if he were angry.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 발표 정말 잘 들었어요. (Balpyo jeongmal jal deureosseoyo.)</p>
<p><strong>B:</strong> 감사합니다. 아까 말씀드렸다시피 자료는 이메일로 보내 드릴게요. 다들 예상했듯이 결과가 아주 좋았어요. (Gamsahamnida. Akka malsseumdeuryeotdasipi jaryoneun imeillo bonae deurilgeyo. Dadeul yesanghaetdeusi gyeolgwaga aju joasseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> -다시피 appeals to what the listener already knows or can see, so it only attaches to a small set of perception/speech verbs (알다, 보다, 듣다, 말하다, 짐작하다). -듯이 draws a resemblance ("(just) as / as if") and works with almost any verb or adjective, frequently paired with 마치; drop 이 for the shorter 듯. For a comparison to a completed action, use 았/었듯이 (예상했듯이 = just as we expected).</div>`,
    `<span class="eyebrow">KRL322 · Bài 8</span>
<h2>Như, giống như (다시피, 듯이)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>짐작하다</td><td>jimjakhada</td><td>phỏng đoán, ước chừng</td></tr>
<tr><td>예상하다</td><td>yesanghada</td><td>dự đoán, lường trước</td></tr>
<tr><td>마치</td><td>machi</td><td>như thể, y như</td></tr>
<tr><td>흐르다</td><td>heureuda</td><td>chảy (bất quy tắc 르)</td></tr>
<tr><td>쏟아지다</td><td>ssodajida</td><td>trút xuống, đổ xuống</td></tr>
<tr><td>자료</td><td>jaryo</td><td>tài liệu, dữ liệu</td></tr>
</tbody></table>
<h3>Ngữ pháp — như (bạn biết/thấy), và y như / như thể</h3>
<ul>
<li><strong>V + 다시피</strong> = như (bạn) biết/thấy/nói; dùng với 알다, 보다, 말하다, 듣다, 짐작하다: 아시다시피, 보시다시피, 말했다시피.</li>
<li><strong>V/A + 듯이 (듯)</strong> = (y) như / như thể; hay đi với 마치: 물 쓰듯이 돈을 써요. 비 오듯이 땀이 났어요. Hành động đã hoàn tất dùng 았/었듯이.</li>
</ul>
<pre><code>아시다시피 다음 주에 시험이 있습니다. asidasipi da-eum ju-e siheom-i itseumnida. = Như quý vị đã biết, tuần sau có kỳ thi.
보시다시피 교실이 너무 좁습니다. bosidasipi gyosir-i neomu jopseumnida. = Như quý vị thấy đấy, phòng học quá chật.
그는 마치 화가 난 듯이 문을 쾅 닫았어요. geuneun machi hwaga nan deusi mun-eul kwang dadasseoyo. = Anh ta đóng sầm cửa như thể đang tức giận.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 발표 정말 잘 들었어요. (Balpyo jeongmal jal deureosseoyo.)</p>
<p><strong>B:</strong> 감사합니다. 아까 말씀드렸다시피 자료는 이메일로 보내 드릴게요. 다들 예상했듯이 결과가 아주 좋았어요. (Gamsahamnida. Akka malsseumdeuryeotdasipi jaryoneun imeillo bonae deurilgeyo. Dadeul yesanghaetdeusi gyeolgwaga aju joasseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> -다시피 dựa vào điều người nghe đã biết hoặc trông thấy, nên chỉ gắn với một nhóm nhỏ động từ tri giác/lời nói (알다, 보다, 듣다, 말하다, 짐작하다). -듯이 tạo phép so sánh giống nhau ("(y) như / như thể") và dùng được với hầu hết động từ, tính từ, hay đi với 마치; bỏ 이 thành dạng ngắn 듯. So sánh với hành động đã hoàn tất thì dùng 았/었듯이 (예상했듯이 = đúng như đã dự đoán).</div>`,
  ]]);
const b8q = quiz('krl322-quiz-8', 'Quiz 8 — As & like|||Quiz 8 — Như, giống như', [
  { id: 'q1', question: '"아시다시피" means…|||"아시다시피" nghĩa là gì?', options: ['if you know|||nếu bạn biết', 'as you know|||như bạn đã biết', 'because you know|||vì bạn biết', 'do you know?|||bạn có biết không?'], correctIndex: 1, explanation: 'V + 다시피 = như (bạn) biết/thấy: 아시다시피 = như quý vị đã biết.' },
  { id: 'q2', question: 'Which pattern works with almost any verb and pairs with 마치 (as if)?|||Cấu trúc nào dùng với hầu hết động từ và đi với 마치 (như thể)?', options: ['-다시피', '-듯이', '-기 마련이다', '-고 말다'], correctIndex: 1, explanation: '듯이 = (y) như / như thể; 마치 ... 듯이. 다시피 chỉ đi với vài động từ tri giác.' },
  { id: 'q3', question: '"비 오듯이 땀이 났어요" means…|||"비 오듯이 땀이 났어요" nghĩa là gì?', options: ['it rained and I sweated|||trời mưa và tôi đổ mồ hôi', 'sweat poured like rain|||mồ hôi tuôn như mưa', 'I sweated because of the rain|||tôi đổ mồ hôi vì mưa', 'I hope it rains|||tôi mong trời mưa'], correctIndex: 1, explanation: '듯이 = như: 비 오듯이 = (tuôn) như mưa rơi.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'KRL322',
    slug: 'krl322-intermediate-korean-2',
    title: 'Intermediate Korean 2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KRL322.webp',
    shortDescription: 'Intermediate Korean 2, after KRL312: strong concession (더라도, 봤자), contrast (반면에), inevitability (기 마련이다), supposition (셈치고), extent (을 정도로), ending up (고 말다), recollection (더라, 던데요) & similes (다시피, 듯이). Sejong 5, TOPIK II.|||Tiếng Hàn trung cấp 2, nối tiếp KRL312: nhượng bộ (더라도, 봤자), tương phản (반면에), tất yếu (기 마련이다), coi như (셈치고), đến mức (을 정도로), rốt cuộc (고 말다), hồi tưởng (더라, 던데요) & so sánh (다시피, 듯이). Sejong 5, TOPIK II.',
    description: 'Môn <strong>KRL322 — Intermediate Korean 2</strong> (Tiếng Hàn trung cấp 2, Kỳ 4, ngành Ngôn ngữ Hàn) nối tiếp <strong>KRL312</strong>. Từ nền nguyên nhân, mục đích, phát hiện, bổ sung, mong ước, giả vờ và bị động/sử động, môn này đi sâu vào trung cấp: <strong>nhượng bộ mạnh</strong> (더라도, 아/어 봤자) → <strong>tương phản</strong> (는 반면에, 는 데 반해) → <strong>tất yếu</strong> (기 마련이다, 게 마련이다) → <strong>giả định &amp; coi như</strong> (는 셈치고, 은 셈이다) → <strong>mức độ</strong> (을 정도로, 을 만큼) → <strong>rốt cuộc</strong> (고 말다, 아/어 버리다) → <strong>hồi tưởng</strong> (더라, 던데요) → <strong>so sánh</strong> (다시피, 듯이). Bám giáo trình Sejong Korean 5 / Ewha, song ngữ Hàn-Việt, có bảng từ vựng, ngữ pháp, hội thoại và quiz mỗi bài. Trình độ TOPIK II (trung cấp).',
    whatYouLearn: 'Nhượng bộ mạnh với 더라도 và nói việc cố cũng vô ích bằng 아/어 봤자; dựng tương phản qua 는 반면에 và 는 데 반해; nêu điều tất yếu bằng 기 마련이다 và 게 마련이다; lập luận từ giả định 는 셈치고 và ước lượng 은 셈이다; đo mức độ với 을 정도로 và 을 만큼; tả cách sự việc kết thúc qua 고 말다 và 아/어 버리다; hồi tưởng điều tận mắt bằng 더라 và 던데요; và tạo phép so sánh với 다시피 và 듯이. Kèm từ vựng chủ đề xã hội, kinh tế, văn hoá TOPIK II.',
    requirements: 'Đã học xong KRL312 (Intermediate Korean 1) hoặc tương đương: nắm nguyên nhân tiêu cực (느라고, 는 바람에), mục đích (도록, 게 하다), phát hiện (더니), bổ sung (을 뿐만 아니라), mong ước (았/었으면 하다), giả vờ (는 척하다), bị động &amp; sử động (이/히/리/기), và hoà thanh 아/어 khi chia đuôi. Cần luyện nói hội thoại thành tiếng mỗi ngày.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Sejong 5/Ewha, từ điển Naver, app, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp KRL312, mục tiêu TOPIK II, bản đồ 8 bài.', lessons: [intro] },
    { title: 'Bài 1 — Nhượng bộ mạnh|||Lesson 1 — Strong concession', description: '더라도, 아/어 봤자.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Tương phản|||Lesson 2 — Contrast', description: '는 반면에, 는 데 반해.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Tất yếu|||Lesson 3 — It is only natural', description: '기 마련이다, 게 마련이다.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Coi như, giả định|||Lesson 4 — Suppose & counts as', description: '는 셈치고, 은 셈이다.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Đến mức|||Lesson 5 — To the extent that', description: '을 정도로, 을 만큼.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Rốt cuộc, mất rồi|||Lesson 6 — Ending up', description: '고 말다, 아/어 버리다.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Hồi tưởng, nói lại|||Lesson 7 — Recalling experience', description: '더라, 던데요.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Như, giống như|||Lesson 8 — As & like', description: '다시피, 듯이.', lessons: [b8, b8q] },
  ],
};
