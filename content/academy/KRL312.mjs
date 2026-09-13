/**
 * KRL312 — Intermediate Korean 1 (Tiếng Hàn trung cấp 1). Khối Ngôn ngữ Hàn FPTU, Kỳ 4.
 * NỐI TIẾP KRL222 — Elementary Korean 4. Giáo trình chuẩn: 세종한국어 Sejong Korean 4;
 * trình độ TOPIK II sơ (đầu trung cấp).
 * MÔN NGÔN NGỮ — mỗi bài: từ vựng, ngữ pháp + mẫu câu (chú ý chia đuôi/bất quy tắc,
 * bị động/sử động), hội thoại, ghi chú. Hangul + Revised Romanization + nghĩa tiếng Việt.
 * bi(e,v): e = trình bày Hàn+Anh, v = giải thích tiếng Việt.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp của bài.', quiz: { timeLimitSeconds: 300, questions } });

/* ── Tài liệu ────────────────────────────────────────────────────────────── */
const taiLieu = doc('krl312-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình Sejong Korean 4 / Ewha, app TOPIK ONE / Anki, từ điển Naver, YouTube, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">KRL312 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need for <strong>Intermediate Korean 1</strong> — building on the purpose, choice, concession, conjecture, reported speech and honorifics of <strong>KRL222</strong> toward negative causation, purpose clauses, discovery, addition, wishes, states of pretence and the passive &amp; causative — in one place. The official FPTU giáo trình &amp; slides live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbooks</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 4</em> — King Sejong Institute (free PDF &amp; audio)</a></li>
<li><em>Ewha Korean 3</em> — Ewha Womans University Press</li>
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
<li><strong>Review KRL222</strong> — purpose (기 위해서, 을 겸), choice (거나, 든지), concession (아/어도, 더라도), conjecture (나 보다, 는 것 같다), reported speech (다면서요), honorifics (드리다, 께서).</li>
<li><strong>Say why &amp; so that</strong> — negative cause 느라고, 는 바람에; purpose 도록; make/let 게 하다.</li>
<li><strong>Notice &amp; add up</strong> — discovery 더니, 았/었더니; addition 을 뿐만 아니라, 는 데다가; trade-off 는 대신에, 는 김에.</li>
<li><strong>Wish &amp; reshape verbs</strong> — wishes 았/었으면 하다, 기를 바라다; states 는 척하다, 은 셈이다; passive &amp; causative 이/히/리/기; aim at solid TOPIK II.</li>
</ol></div>`,
    `<span class="eyebrow">KRL312 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho <strong>Tiếng Hàn trung cấp 1</strong> — dựng tiếp trên mục đích, lựa chọn, nhượng bộ, phỏng đoán, tường thuật và kính ngữ của <strong>KRL222</strong> để tiến tới nguyên nhân tiêu cực, mệnh đề mục đích, phát hiện, bổ sung, mong ước, trạng thái giả vờ và thể bị động &amp; sử động — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình</h3>
<ul>
<li><a href="https://www.sejonghakdang.org/" target="_blank" rel="noopener"><em>세종한국어 Sejong Korean 4</em> — Viện King Sejong (PDF &amp; audio miễn phí)</a></li>
<li><em>Ewha Korean 3</em> — NXB Đại học Ewha</li>
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
<li><strong>Ôn lại KRL222</strong> — mục đích (기 위해서, 을 겸), lựa chọn (거나, 든지), nhượng bộ (아/어도, 더라도), phỏng đoán (나 보다, 는 것 같다), tường thuật (다면서요), kính ngữ (드리다, 께서).</li>
<li><strong>Nói nguyên nhân &amp; để</strong> — nguyên nhân tiêu cực 느라고, 는 바람에; mục đích 도록; khiến/để 게 하다.</li>
<li><strong>Nhận ra &amp; cộng dồn</strong> — phát hiện 더니, 았/었더니; bổ sung 을 뿐만 아니라, 는 데다가; đánh đổi 는 대신에, 는 김에.</li>
<li><strong>Mong ước &amp; nắn động từ</strong> — mong ước 았/었으면 하다, 기를 바라다; trạng thái 는 척하다, 은 셈이다; bị động &amp; sử động 이/히/리/기; hướng tới TOPIK II vững.</li>
</ol></div>`,
  ]]);

/* ── Giới thiệu môn ──────────────────────────────────────────────────────── */
const intro = doc('krl312-0-1-overview', 'Course overview: from KRL222 onward|||Tổng quan: nối tiếp từ KRL222',
  'Mục tiêu môn (đầu trung cấp, TOPIK II), nhắc lại nền tảng KRL222, và bản đồ ngữ pháp 8 bài.',
  [[
    `<span class="eyebrow">KRL312 · Lesson 0.1 · Overview</span>
<h2>Intermediate Korean 1</h2>
<p class="lead">This course continues <strong>Elementary Korean 4 (KRL222)</strong>. You already state purpose (기 위해서), offer choices (거나, 든지), concede (아/어도, 더라도), make guesses (나 보다, 는 것 같다), relay hearsay (다면서요) and use advanced honorifics (드리다, 께서). Now you will <strong>express negative causes, set purpose clauses, report a discovery, stack facts, weigh trade-offs, voice wishes, describe pretence and states, and reshape verbs into the passive and causative</strong> — the core of <strong>early intermediate (TOPIK II)</strong> Korean.</p>
<h3>What KRL222 gave you</h3>
<p>KRL222 built the late-elementary base: purpose &amp; intent, comparison &amp; choice, concession &amp; condition, conjecture, advanced reported speech, states &amp; continuation, exclamation, and the honorific system. This course assumes all of that.</p>
<h3>Roadmap of the 8 lessons</h3>
<p>Negative cause (느라고, 는 바람에) → purpose &amp; making (도록, 게 하다) → discovery (더니, 았/었더니) → addition (을 뿐만 아니라, 는 데다가) → trade-off &amp; opportunity (는 대신에, 는 김에) → wishes (았/었으면 하다, 기를 바라다) → pretence &amp; near-equivalence (는 척하다, 은 셈이다) → passive &amp; causative (피동/사동: 이/히/리/기). Bilingual Korean-Vietnamese, with vocabulary tables, grammar notes, short dialogues and a quiz each lesson.</p>
<div class="callout"><span class="badge">Politeness level</span> This course keeps the <strong>해요체</strong> (polite -요 style) and adds the plain <strong>declarative style</strong> in reading. The passive (피동) and causative (사동) in Lesson 8 use the infixes <strong>이/히/리/기</strong> — learn the common verbs by heart, because not every verb takes them.</div>`,
    `<span class="eyebrow">KRL312 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Hàn trung cấp 1</h2>
<p class="lead">Môn này nối tiếp <strong>Tiếng Hàn sơ cấp 4 (KRL222)</strong>. Bạn đã nêu được mục đích (기 위해서), đưa lựa chọn (거나, 든지), nhượng bộ (아/어도, 더라도), phỏng đoán (나 보다, 는 것 같다), thuật tin nghe được (다면서요) và dùng kính ngữ nâng cao (드리다, 께서). Giờ bạn sẽ <strong>diễn đạt nguyên nhân tiêu cực, đặt mệnh đề mục đích, kể lại phát hiện, cộng dồn thông tin, cân nhắc đánh đổi, nói lên mong ước, tả sự giả vờ và trạng thái, và nắn động từ sang thể bị động và sử động</strong> — cốt lõi của tiếng Hàn <strong>đầu trung cấp (TOPIK II)</strong>.</p>
<h3>KRL222 đã cho bạn gì</h3>
<p>KRL222 dựng nền cuối sơ cấp: mục đích &amp; dự định, so sánh &amp; lựa chọn, nhượng bộ &amp; điều kiện, phỏng đoán, tường thuật gián tiếp nâng cao, trạng thái &amp; tiếp diễn, cảm thán, và hệ kính ngữ. Môn này giả định bạn đã nắm hết.</p>
<h3>Bản đồ 8 bài</h3>
<p>Nguyên nhân tiêu cực (느라고, 는 바람에) → mục đích &amp; khiến (도록, 게 하다) → phát hiện (더니, 았/었더니) → bổ sung (을 뿐만 아니라, 는 데다가) → đánh đổi &amp; tiện thể (는 대신에, 는 김에) → mong ước (았/었으면 하다, 기를 바라다) → giả vờ &amp; coi như (는 척하다, 은 셈이다) → bị động &amp; sử động (피동/사동: 이/히/리/기). Song ngữ Hàn-Việt, có bảng từ vựng, ghi chú ngữ pháp, hội thoại ngắn và quiz mỗi bài.</p>
<div class="callout"><span class="badge">Bậc lịch sự</span> Môn này giữ <strong>해요체</strong> (thể lịch sự đuôi -요) và bổ sung <strong>thể tường thuật nguyên dạng</strong> khi đọc. Thể bị động (피동) và sử động (사동) ở Bài 8 dùng phụ tố <strong>이/히/리/기</strong> — hãy học thuộc các động từ thường gặp, vì không phải động từ nào cũng nhận chúng.</div>`,
  ]]);

/* ── Bài 1 — Nguyên nhân tiêu cực ───────────────────────────────────────── */
const b1 = doc('krl312-1-1-negative-cause', 'Lesson 1 — Negative cause|||Bài 1 — Nguyên nhân tiêu cực',
  'V + 느라고 (mải làm... nên không), V + 는 바람에 (vì... bất ngờ nên hậu quả xấu).',
  [[
    `<span class="eyebrow">KRL312 · Lesson 1</span>
<h2>Negative cause (느라고, 는 바람에)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>야근하다</td><td>yageunhada</td><td>to work overtime</td></tr>
<tr><td>지각하다</td><td>jigakhada</td><td>to be late (for)</td></tr>
<tr><td>놓치다</td><td>nochida</td><td>to miss (a bus, chance)</td></tr>
<tr><td>밤새다</td><td>bamsaeda</td><td>to stay up all night</td></tr>
<tr><td>정신없다</td><td>jeongsineopda</td><td>to be hectic, frantic</td></tr>
<tr><td>서두르다</td><td>seodureuda</td><td>to hurry (르 irregular)</td></tr>
</tbody></table>
<h3>Grammar — because of (busy) doing, because of (unexpectedly) doing</h3>
<ul>
<li><strong>V + 느라고</strong> = as a result of being busy doing V, (I could not / failed to do) something; SAME subject, action verb, usually a negative outcome: 게임하느라고, 일하느라고.</li>
<li><strong>V + 는 바람에</strong> = because of V (an unexpected, external event) something bad happened; mostly used with a PAST result: 늦잠을 자는 바람에, 길이 막히는 바람에.</li>
</ul>
<pre><code>어제 야근하느라고 친구 생일을 잊어버렸어요. eoje yageunhaneurago chingu saeng-il-eul ijeobeoryeosseoyo. = I was so busy with overtime yesterday that I forgot my friend's birthday.
버스를 놓치는 바람에 회의에 지각했어요. beoseureul nochineun baram-e hoeui-e jigakhaesseoyo. = Because I (unexpectedly) missed the bus, I was late for the meeting.
아이가 우는 바람에 잠을 못 잤어요. aiga uneun baram-e jam-eul mot jasseoyo. = The baby cried, so I could not sleep.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 왜 이렇게 피곤해 보여요? (Wae ireoke pigonhae boyeoyo?)</p>
<p><strong>B:</strong> 어제 시험 공부하느라고 밤을 새웠어요. 그런데 늦잠을 자는 바람에 첫 수업도 놓쳤어요. (Eoje siheom gongbuhaneurago bam-eul saewosseoyo. Geureonde neutjam-eul janeun baram-e cheot sueop-do nochyeosseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 느라고 needs the SAME subject in both clauses and an action verb that takes time; the result is usually "couldn't" or a mild negative. 는 바람에 blames an unexpected outside event and almost always ends in the past tense with a bad result. Neither takes a command or suggestion in the second clause.</div>`,
    `<span class="eyebrow">KRL312 · Bài 1</span>
<h2>Nguyên nhân tiêu cực (느라고, 는 바람에)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>야근하다</td><td>yageunhada</td><td>làm thêm giờ</td></tr>
<tr><td>지각하다</td><td>jigakhada</td><td>đi muộn, đến trễ</td></tr>
<tr><td>놓치다</td><td>nochida</td><td>bỏ lỡ (xe, cơ hội)</td></tr>
<tr><td>밤새다</td><td>bamsaeda</td><td>thức trắng đêm</td></tr>
<tr><td>정신없다</td><td>jeongsineopda</td><td>bận rối, tối tăm mặt mũi</td></tr>
<tr><td>서두르다</td><td>seodureuda</td><td>vội vàng (bất quy tắc 르)</td></tr>
</tbody></table>
<h3>Ngữ pháp — mải làm... nên không, vì... bất ngờ nên hỏng</h3>
<ul>
<li><strong>V + 느라고</strong> = vì mải làm V nên (đã không / không thể) làm việc khác; CÙNG chủ ngữ, động từ hành động, hậu quả thường tiêu cực: 게임하느라고, 일하느라고.</li>
<li><strong>V + 는 바람에</strong> = vì V (một việc bất ngờ, bên ngoài) nên xảy ra chuyện xấu; hầu hết dùng với kết quả QUÁ KHỨ: 늦잠을 자는 바람에, 길이 막히는 바람에.</li>
</ul>
<pre><code>어제 야근하느라고 친구 생일을 잊어버렸어요. eoje yageunhaneurago chingu saeng-il-eul ijeobeoryeosseoyo. = Vì mải làm thêm giờ hôm qua nên tôi quên mất sinh nhật bạn.
버스를 놓치는 바람에 회의에 지각했어요. beoseureul nochineun baram-e hoeui-e jigakhaesseoyo. = Vì (bất ngờ) lỡ mất xe buýt nên tôi đến họp muộn.
아이가 우는 바람에 잠을 못 잤어요. aiga uneun baram-e jam-eul mot jasseoyo. = Vì đứa bé khóc nên tôi không ngủ được.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 왜 이렇게 피곤해 보여요? (Wae ireoke pigonhae boyeoyo?)</p>
<p><strong>B:</strong> 어제 시험 공부하느라고 밤을 새웠어요. 그런데 늦잠을 자는 바람에 첫 수업도 놓쳤어요. (Eoje siheom gongbuhaneurago bam-eul saewosseoyo. Geureonde neutjam-eul janeun baram-e cheot sueop-do nochyeosseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 느라고 cần CÙNG chủ ngữ ở cả hai vế và động từ hành động tốn thời gian; kết quả thường là "không thể" hoặc điều tiêu cực nhẹ. 는 바람에 quy cho một việc bất ngờ bên ngoài và gần như luôn kết ở thì quá khứ với kết quả xấu. Cả hai không nhận mệnh lệnh hay đề nghị ở vế sau.</div>`,
  ]]);
const b1q = quiz('krl312-quiz-1', 'Quiz 1 — Negative cause|||Quiz 1 — Nguyên nhân tiêu cực', [
  { id: 'q1', question: 'Which pattern blames an UNEXPECTED outside event for a bad result?|||Cấu trúc nào quy hậu quả xấu cho một việc BẤT NGỜ bên ngoài?', options: ['-느라고', '-는 바람에', '-기 위해서', '-도록'], correctIndex: 1, explanation: 'V + 는 바람에 = vì (việc bất ngờ) nên hỏng; thường kết ở quá khứ.' },
  { id: 'q2', question: '"게임하느라고 숙제를 못 했어요" means…|||"게임하느라고 숙제를 못 했어요" nghĩa là gì?', options: ['I did homework in order to play games|||Tôi làm bài để chơi game', 'I was busy playing games so I could not do homework|||Vì mải chơi game nên tôi không làm được bài', 'I play games and do homework|||Tôi chơi game và làm bài', 'If I play games I do homework|||Nếu chơi game thì tôi làm bài'], correctIndex: 1, explanation: 'V + 느라고 = vì mải làm V nên không làm được việc khác (cùng chủ ngữ).' },
  { id: 'q3', question: '느라고 requires the two clauses to have…|||느라고 đòi hai vế phải có…', options: ['different subjects|||chủ ngữ khác nhau', 'the same subject|||cùng một chủ ngữ', 'an adjective|||một tính từ', 'a command|||một mệnh lệnh'], correctIndex: 1, explanation: '느라고 cần CÙNG chủ ngữ và động từ hành động; vế sau không dùng mệnh lệnh.' },
]);

/* ── Bài 2 — Mục đích & khiến ───────────────────────────────────────────── */
const b2 = doc('krl312-2-1-purpose-make', 'Lesson 2 — Purpose & making|||Bài 2 — Mục đích & khiến',
  'V + 도록 (để, đến mức, cho đến khi), V + 게 하다 (khiến/để ai làm — sử động phân tích).',
  [[
    `<span class="eyebrow">KRL312 · Lesson 2</span>
<h2>Purpose &amp; making (도록, 게 하다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>규칙</td><td>gyuchik</td><td>rule, regulation</td></tr>
<tr><td>조심하다</td><td>josimhada</td><td>to be careful</td></tr>
<tr><td>알아듣다</td><td>aradeutda</td><td>to understand (by ear, ㄷ irregular)</td></tr>
<tr><td>실수하다</td><td>silsuhada</td><td>to make a mistake</td></tr>
<tr><td>습관</td><td>seupgwan</td><td>habit</td></tr>
<tr><td>참다</td><td>chamda</td><td>to endure, hold back</td></tr>
</tbody></table>
<h3>Grammar — so that / until, and make/let someone do</h3>
<ul>
<li><strong>V + 도록</strong> = so that / in order that (goal), to the extent that, or until: 잊지 않도록 메모하세요. 목이 아프도록 노래했어요.</li>
<li><strong>V + 게 하다</strong> = make / let someone do (periphrastic causative): the doer takes 을/를 or 에게; 아이를 자게 하다, 학생들에게 발표하게 하다. Compare 게 되다 = to end up (V).</li>
</ul>
<pre><code>감기에 걸리지 않도록 옷을 따뜻하게 입으세요. gamgi-e geolliji antorok os-eul ttatteuthage ibeuseyo. = Dress warmly so that you do not catch a cold.
뒷사람도 알아들을 수 있도록 크게 말해 주세요. dwitsaram-do aradeureul su itdorok keuge malhae juseyo. = Please speak up so that the people behind can understand too.
선생님이 학생들을 조용히 하게 했어요. seonsaengnim-i haksaengdeur-eul joyonghi hage haesseoyo. = The teacher made the students be quiet.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 아이가 채소를 안 먹어서 걱정이에요. (Aiga chaesoreul an meogeoseo geokjeong-ieyo.)</p>
<p><strong>B:</strong> 골고루 먹도록 조금씩 주세요. 억지로 다 먹게 하면 더 싫어할 거예요. (Golgoru meokdorok jogeumssik juseyo. Eokjiro da meokge hamyeon deo sireohal geoyeyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 도록 sets a goal or a limit ("so that", "until", "to the point of") and, unlike 게, attaches straight to the verb stem. 게 하다 is the "analytic" causative — it works with almost any verb, so you use it when there is no morphological causative (Lesson 8). 게 되다 is different: it means "to come/turn out to (V)".</div>`,
    `<span class="eyebrow">KRL312 · Bài 2</span>
<h2>Mục đích &amp; khiến (도록, 게 하다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>규칙</td><td>gyuchik</td><td>quy tắc, nội quy</td></tr>
<tr><td>조심하다</td><td>josimhada</td><td>cẩn thận</td></tr>
<tr><td>알아듣다</td><td>aradeutda</td><td>nghe hiểu (bất quy tắc ㄷ)</td></tr>
<tr><td>실수하다</td><td>silsuhada</td><td>mắc lỗi, sơ suất</td></tr>
<tr><td>습관</td><td>seupgwan</td><td>thói quen</td></tr>
<tr><td>참다</td><td>chamda</td><td>chịu đựng, nhịn</td></tr>
</tbody></table>
<h3>Ngữ pháp — để / đến mức / cho đến khi, và khiến ai làm</h3>
<ul>
<li><strong>V + 도록</strong> = để / nhằm (mục đích), đến mức, hoặc cho đến khi: 잊지 않도록 메모하세요. 목이 아프도록 노래했어요.</li>
<li><strong>V + 게 하다</strong> = khiến / để ai đó làm (sử động phân tích): người thực hiện lấy 을/를 hoặc 에게; 아이를 자게 하다, 학생들에게 발표하게 하다. So với 게 되다 = rốt cuộc (V).</li>
</ul>
<pre><code>감기에 걸리지 않도록 옷을 따뜻하게 입으세요. gamgi-e geolliji antorok os-eul ttatteuthage ibeuseyo. = Hãy mặc ấm để không bị cảm.
뒷사람도 알아들을 수 있도록 크게 말해 주세요. dwitsaram-do aradeureul su itdorok keuge malhae juseyo. = Hãy nói to để người phía sau cũng nghe hiểu được.
선생님이 학생들을 조용히 하게 했어요. seonsaengnim-i haksaengdeur-eul joyonghi hage haesseoyo. = Cô giáo bắt học sinh giữ im lặng.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 아이가 채소를 안 먹어서 걱정이에요. (Aiga chaesoreul an meogeoseo geokjeong-ieyo.)</p>
<p><strong>B:</strong> 골고루 먹도록 조금씩 주세요. 억지로 다 먹게 하면 더 싫어할 거예요. (Golgoru meokdorok jogeumssik juseyo. Eokjiro da meokge hamyeon deo sireohal geoyeyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 도록 nêu mục tiêu hoặc giới hạn ("để", "cho đến khi", "đến mức") và, khác với 게, gắn thẳng vào gốc động từ. 게 하다 là sử động "phân tích" — dùng được với hầu hết động từ, nên dùng khi không có sử động biến hình (Bài 8). 게 되다 thì khác: nghĩa "rốt cuộc / dần thành (V)".</div>`,
  ]]);
const b2q = quiz('krl312-quiz-2', 'Quiz 2 — Purpose & making|||Quiz 2 — Mục đích & khiến', [
  { id: 'q1', question: 'Which attaches straight to a verb stem to mean "so that / until"?|||Đuôi nào gắn thẳng vào gốc động từ nghĩa "để / cho đến khi"?', options: ['-도록', '-는 바람에', '-느라고', '-는 김에'], correctIndex: 0, explanation: 'V + 도록 = để / đến mức / cho đến khi: 잊지 않도록 = để không quên.' },
  { id: 'q2', question: '"학생들을 발표하게 했어요" means…|||"학생들을 발표하게 했어요" nghĩa là gì?', options: ['the students presented by themselves|||học sinh tự thuyết trình', '(someone) made the students present|||(ai đó) bắt học sinh thuyết trình', 'the students want to present|||học sinh muốn thuyết trình', 'the students could not present|||học sinh không thể thuyết trình'], correctIndex: 1, explanation: 'V + 게 하다 = khiến/để ai làm (sử động phân tích): 발표하게 했어요 = bắt (họ) thuyết trình.' },
  { id: 'q3', question: 'Which one means "to end up / come to (V)", NOT "make (V)"?|||Đâu là "rốt cuộc / dần thành (V)", KHÔNG phải "khiến (V)"?', options: ['-게 하다', '-게 되다', '-도록 하다', '-느라고'], correctIndex: 1, explanation: '게 되다 = rốt cuộc / dần trở nên; 게 하다 = khiến ai làm. Đừng lẫn hai cái.' },
]);

/* ── Bài 3 — Phát hiện ──────────────────────────────────────────────────── */
const b3 = doc('krl312-3-1-discovery', 'Lesson 3 — Discovery & retrospective|||Bài 3 — Phát hiện (더니, 았/었더니)',
  'V/A + 더니 (quan sát người khác rồi thì), V + 았/었더니 (tôi làm X rồi phát hiện Y).',
  [[
    `<span class="eyebrow">KRL312 · Lesson 3</span>
<h2>Discovery (더니, 았/었더니)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>발견하다</td><td>balgyeonhada</td><td>to discover, find</td></tr>
<tr><td>변하다</td><td>byeonhada</td><td>to change, turn into</td></tr>
<tr><td>예전</td><td>yejeon</td><td>the past, old days</td></tr>
<tr><td>살이 빠지다</td><td>sar-i ppajida</td><td>to lose weight</td></tr>
<tr><td>갑자기</td><td>gapjagi</td><td>suddenly</td></tr>
<tr><td>기분</td><td>gibun</td><td>mood, feeling</td></tr>
</tbody></table>
<h3>Grammar — I observed X and then, I did X and then found</h3>
<ul>
<li><strong>V/A + 더니</strong> = (I saw/heard) someone else do X and then Y happened, or X used to be so but now Y (contrast); subject is usually 2nd/3rd person: 동생이 밥을 많이 먹더니 배가 아프대요. 어제는 춥더니 오늘은 따뜻하네요.</li>
<li><strong>V + 았/었더니</strong> = I (1st person) did X, and then (I found / it resulted in) Y: 운동을 했더니 기분이 좋아졌어요. 창문을 열었더니 눈이 왔어요.</li>
</ul>
<pre><code>언니가 매일 운동하더니 살이 많이 빠졌어요. eonniga maeil undonghadeoni sar-i mani ppajyeosseoyo. = My sister kept exercising every day, and (I noticed) she lost a lot of weight.
아침을 안 먹었더니 지금 너무 배가 고파요. achim-eul an meogeotdeoni jigeum neomu baega gopayo. = I skipped breakfast, and now I am really hungry.
문을 열었더니 눈이 오고 있었어요. mun-eul yeoreotdeoni nun-i ogo isseosseoyo. = I opened the door, and (found) it was snowing.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 민수 씨 얼굴이 안 좋아 보여요. (Minsu ssi eolgur-i an joa boyeoyo.)</p>
<p><strong>B:</strong> 어제 밤늦게까지 일하더니 오늘 몸살이 났대요. 저도 커피를 많이 마셨더니 잠이 안 와요. (Eoje bamneutgekkaji ilhadeoni oneul momsar-i natdaeyo. Jeodo keopireul mani masyeotdeoni jam-i an wayo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> Use 더니 when you REPORT what you saw of someone/something else (2nd/3rd person), often with a contrast between before and after. Use 았/었더니 when YOU did the first action and then discovered or caused the second — the first clause is almost always 1st person. Do not mix the subjects up.</div>`,
    `<span class="eyebrow">KRL312 · Bài 3</span>
<h2>Phát hiện (더니, 았/었더니)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>발견하다</td><td>balgyeonhada</td><td>phát hiện, tìm ra</td></tr>
<tr><td>변하다</td><td>byeonhada</td><td>thay đổi, biến đổi</td></tr>
<tr><td>예전</td><td>yejeon</td><td>ngày trước, trước kia</td></tr>
<tr><td>살이 빠지다</td><td>sar-i ppajida</td><td>sụt cân, giảm cân</td></tr>
<tr><td>갑자기</td><td>gapjagi</td><td>đột nhiên, bỗng dưng</td></tr>
<tr><td>기분</td><td>gibun</td><td>tâm trạng, cảm giác</td></tr>
</tbody></table>
<h3>Ngữ pháp — quan sát người khác rồi thì, tôi làm rồi phát hiện</h3>
<ul>
<li><strong>V/A + 더니</strong> = (tôi thấy/nghe) người khác làm X rồi Y xảy ra, hoặc trước kia X mà giờ Y (tương phản); chủ ngữ thường là ngôi 2/3: 동생이 밥을 많이 먹더니 배가 아프대요. 어제는 춥더니 오늘은 따뜻하네요.</li>
<li><strong>V + 았/었더니</strong> = tôi (ngôi 1) đã làm X, rồi (tôi thấy / dẫn đến) Y: 운동을 했더니 기분이 좋아졌어요. 창문을 열었더니 눈이 왔어요.</li>
</ul>
<pre><code>언니가 매일 운동하더니 살이 많이 빠졌어요. eonniga maeil undonghadeoni sar-i mani ppajyeosseoyo. = Chị tôi ngày nào cũng tập nên (tôi thấy) đã sụt cân nhiều.
아침을 안 먹었더니 지금 너무 배가 고파요. achim-eul an meogeotdeoni jigeum neomu baega gopayo. = Vì tôi không ăn sáng nên giờ đói quá.
문을 열었더니 눈이 오고 있었어요. mun-eul yeoreotdeoni nun-i ogo isseosseoyo. = Tôi mở cửa ra thì (thấy) tuyết đang rơi.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 민수 씨 얼굴이 안 좋아 보여요. (Minsu ssi eolgur-i an joa boyeoyo.)</p>
<p><strong>B:</strong> 어제 밤늦게까지 일하더니 오늘 몸살이 났대요. 저도 커피를 많이 마셨더니 잠이 안 와요. (Eoje bamneutgekkaji ilhadeoni oneul momsar-i natdaeyo. Jeodo keopireul mani masyeotdeoni jam-i an wayo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Dùng 더니 khi bạn KỂ điều mình thấy ở người/vật khác (ngôi 2/3), thường có tương phản trước-sau. Dùng 았/었더니 khi CHÍNH BẠN làm hành động đầu rồi phát hiện hoặc gây ra điều thứ hai — vế đầu gần như luôn ngôi 1. Đừng lẫn chủ ngữ hai vế.</div>`,
  ]]);
const b3q = quiz('krl312-quiz-3', 'Quiz 3 — Discovery|||Quiz 3 — Phát hiện', [
  { id: 'q1', question: 'Which ending is normally used with a 1st-person first action leading to a result?|||Đuôi nào dùng khi CHÍNH BẠN (ngôi 1) làm hành động đầu dẫn đến kết quả?', options: ['-더니', '-았/었더니', '-느라고', '-도록'], correctIndex: 1, explanation: 'V + 았/었더니 = tôi làm X rồi phát hiện/dẫn đến Y (vế đầu ngôi 1).' },
  { id: 'q2', question: '"동생이 밥을 많이 먹더니 배가 아프대요" — the first clause subject is…|||"동생이 밥을 많이 먹더니 배가 아프대요" — chủ ngữ vế đầu là…', options: ['myself (1st person)|||chính tôi (ngôi 1)', 'my younger sibling (observed)|||em tôi (được quan sát)', 'nobody|||không ai', 'the listener|||người nghe'], correctIndex: 1, explanation: '더니 kể điều quan sát ở ngôi 2/3; ở đây là 동생 (em) mà người nói thấy.' },
  { id: 'q3', question: '"운동을 했더니 기분이 좋아졌어요" means…|||"운동을 했더니 기분이 좋아졌어요" nghĩa là gì?', options: ['I exercised in order to feel good|||Tôi tập để thấy khoẻ', 'I exercised, and then my mood improved|||Tôi tập xong thì tâm trạng tốt lên', 'if I exercise my mood improves|||nếu tập thì tâm trạng tốt lên', 'I want to exercise|||Tôi muốn tập'], correctIndex: 1, explanation: '았/었더니 nối hành động của tôi với kết quả phát hiện sau đó.' },
]);

/* ── Bài 4 — Bổ sung ────────────────────────────────────────────────────── */
const b4 = doc('krl312-4-1-addition', 'Lesson 4 — Not only... but also|||Bài 4 — Không chỉ... mà còn',
  'V/A + 을 뿐만 아니라 (không chỉ... mà còn), V/A + 는 데다가 (thêm vào đó, lại còn).',
  [[
    `<span class="eyebrow">KRL312 · Lesson 4</span>
<h2>Not only... but also (을 뿐만 아니라, 는 데다가)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>성실하다</td><td>seongsilhada</td><td>to be diligent, sincere</td></tr>
<tr><td>부지런하다</td><td>bujireonhada</td><td>to be hardworking</td></tr>
<tr><td>실력</td><td>sillyeok</td><td>ability, skill</td></tr>
<tr><td>분위기</td><td>bunwigi</td><td>atmosphere, mood</td></tr>
<tr><td>편리하다</td><td>pyeollihada</td><td>to be convenient</td></tr>
<tr><td>가격</td><td>gagyeok</td><td>price</td></tr>
</tbody></table>
<h3>Grammar — not only... but also, on top of that</h3>
<ul>
<li><strong>V/A + -(으)ㄹ 뿐만 아니라, N일 뿐만 아니라</strong> = not only... but also (adds a second, same-direction point): 그 식당은 음식이 맛있을 뿐만 아니라 값도 싸요.</li>
<li><strong>V + 는 데다가, A + -(으)ㄴ 데다가, N인 데다가</strong> = on top of / in addition (the second fact reinforces the first): 비가 오는 데다가 바람도 불어요.</li>
</ul>
<pre><code>그 사람은 성실할 뿐만 아니라 실력도 좋아요. geu saram-eun seongsilhal ppunman anira sillyeok-do joayo. = That person is not only diligent but also skilled.
이 카페는 조용한 데다가 커피도 맛있어요. i kape-neun joyonghan deda-ga keopi-do masisseoyo. = This cafe is quiet, and on top of that the coffee is delicious.
그 집은 넓은 데다가 가격도 싸서 인기가 많아요. geu jib-eun neolbeun deda-ga gagyeok-do ssaseo ingiga manayo. = That place is spacious and on top of that cheap, so it is popular.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 새로 온 동료는 어때요? (Saero on dongnyoneun eottaeyo?)</p>
<p><strong>B:</strong> 아주 좋아요. 일을 잘할 뿐만 아니라 성격도 좋아요. 그리고 부지런한 데다가 친절하기까지 해요. (Aju joayo. Ir-eul jalhal ppunman anira seonggyeok-do joayo. Geurigo bujireonhan deda-ga chinjeolhagikkaji haeyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> Both patterns ADD a second fact of the SAME polarity — two good points, or two bad points, never one of each. 을 뿐만 아니라 sounds a little more formal/written; 는 데다가 is common in speech and often pairs with 도 ("also"). For adjectives use 은 데다가; for present-tense verbs use 는 데다가.</div>`,
    `<span class="eyebrow">KRL312 · Bài 4</span>
<h2>Không chỉ... mà còn (을 뿐만 아니라, 는 데다가)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>성실하다</td><td>seongsilhada</td><td>chăm chỉ, thành thật</td></tr>
<tr><td>부지런하다</td><td>bujireonhada</td><td>siêng năng</td></tr>
<tr><td>실력</td><td>sillyeok</td><td>thực lực, năng lực</td></tr>
<tr><td>분위기</td><td>bunwigi</td><td>bầu không khí</td></tr>
<tr><td>편리하다</td><td>pyeollihada</td><td>tiện lợi</td></tr>
<tr><td>가격</td><td>gagyeok</td><td>giá cả</td></tr>
</tbody></table>
<h3>Ngữ pháp — không chỉ... mà còn, thêm vào đó</h3>
<ul>
<li><strong>V/A + -(으)ㄹ 뿐만 아니라, N일 뿐만 아니라</strong> = không chỉ... mà còn (thêm một điểm cùng chiều): 그 식당은 음식이 맛있을 뿐만 아니라 값도 싸요.</li>
<li><strong>V + 는 데다가, A + -(으)ㄴ 데다가, N인 데다가</strong> = thêm vào đó / lại còn (vế sau củng cố vế trước): 비가 오는 데다가 바람도 불어요.</li>
</ul>
<pre><code>그 사람은 성실할 뿐만 아니라 실력도 좋아요. geu saram-eun seongsilhal ppunman anira sillyeok-do joayo. = Người đó không chỉ chăm chỉ mà năng lực cũng giỏi.
이 카페는 조용한 데다가 커피도 맛있어요. i kape-neun joyonghan deda-ga keopi-do masisseoyo. = Quán cà phê này yên tĩnh, lại còn cà phê ngon nữa.
그 집은 넓은 데다가 가격도 싸서 인기가 많아요. geu jib-eun neolbeun deda-ga gagyeok-do ssaseo ingiga manayo. = Chỗ đó rộng rãi, lại còn rẻ nên rất được ưa chuộng.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 새로 온 동료는 어때요? (Saero on dongnyoneun eottaeyo?)</p>
<p><strong>B:</strong> 아주 좋아요. 일을 잘할 뿐만 아니라 성격도 좋아요. 그리고 부지런한 데다가 친절하기까지 해요. (Aju joayo. Ir-eul jalhal ppunman anira seonggyeok-do joayo. Geurigo bujireonhan deda-ga chinjeolhagikkaji haeyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Cả hai cấu trúc đều THÊM một điểm CÙNG chiều — hai điểm tốt, hoặc hai điểm xấu, không lẫn tốt-xấu. 을 뿐만 아니라 nghe trang trọng/văn viết hơn; 는 데다가 thông dụng khi nói và hay đi với 도 ("cũng"). Tính từ dùng 은 데다가; động từ hiện tại dùng 는 데다가.</div>`,
  ]]);
const b4q = quiz('krl312-quiz-4', 'Quiz 4 — Not only... but also|||Quiz 4 — Không chỉ... mà còn', [
  { id: 'q1', question: 'Both 을 뿐만 아니라 and 는 데다가 add a second fact that is…|||Cả 을 뿐만 아니라 và 는 데다가 đều thêm một ý thứ hai…', options: ['of the opposite polarity|||ngược chiều', 'of the same polarity (both good or both bad)|||cùng chiều (cùng tốt hoặc cùng xấu)', 'always a question|||luôn là câu hỏi', 'always in the past|||luôn ở quá khứ'], correctIndex: 1, explanation: 'Hai cấu trúc bổ sung điểm CÙNG chiều — không lẫn tốt với xấu.' },
  { id: 'q2', question: '조용하다 (adjective) + 데다가 becomes…|||조용하다 (tính từ) + 데다가 thành…', options: ['조용하는 데다가', '조용한 데다가', '조용할 데다가', '조용더니'], correctIndex: 1, explanation: 'Tính từ lấy -(으)ㄴ 데다가: 조용하다 → 조용한 데다가.' },
  { id: 'q3', question: '"맛있을 뿐만 아니라 값도 싸요" means…|||"맛있을 뿐만 아니라 값도 싸요" nghĩa là gì?', options: ['it is delicious but expensive|||ngon nhưng đắt', 'not only delicious but also cheap|||không chỉ ngon mà còn rẻ', 'delicious or cheap|||ngon hoặc rẻ', 'neither delicious nor cheap|||không ngon cũng không rẻ'], correctIndex: 1, explanation: '을 뿐만 아니라 = không chỉ... mà còn; ở đây thêm điểm tốt (rẻ).' },
]);

/* ── Bài 5 — Đánh đổi & tiện thể ────────────────────────────────────────── */
const b5 = doc('krl312-5-1-instead-while', 'Lesson 5 — Instead of & while at it|||Bài 5 — Thay vì & tiện thể',
  'V + 는 대신에 (thay vì / bù lại), V + 는 김에 (nhân tiện, tiện thể làm luôn).',
  [[
    `<span class="eyebrow">KRL312 · Lesson 5</span>
<h2>Instead of &amp; while at it (는 대신에, 는 김에)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>대신</td><td>daesin</td><td>instead, in place of</td></tr>
<tr><td>들르다</td><td>deulleuda</td><td>to drop by (르 irregular)</td></tr>
<tr><td>부탁하다</td><td>butakhada</td><td>to ask a favor</td></tr>
<tr><td>처리하다</td><td>cheorihada</td><td>to handle, process</td></tr>
<tr><td>외식하다</td><td>oesikhada</td><td>to eat out</td></tr>
<tr><td>챙기다</td><td>chaenggida</td><td>to take/pack along, look after</td></tr>
</tbody></table>
<h3>Grammar — instead of / in return for, and while you are at it</h3>
<ul>
<li><strong>V + 는 대신(에), A + -(으)ㄴ 대신에, N 대신(에)</strong> = instead of / in place of, or in return for (trade-off): 운동하는 대신에 집안일을 했어요. 월급이 많은 대신에 일이 힘들어요.</li>
<li><strong>V + 는 김에</strong> = while / since you are already doing V (take the opportunity): 마트에 가는 김에 우유 좀 사다 주세요. 청소하는 김에 창문도 닦았어요.</li>
</ul>
<pre><code>외식하는 대신에 집에서 요리했어요. oesikhaneun daesin-e jib-eseo yorihaesseoyo. = Instead of eating out, I cooked at home.
이 일은 힘든 대신에 돈을 많이 벌 수 있어요. i ir-eun himdeun daesin-e don-eul mani beol su isseoyo. = This job is hard, but in return you can earn a lot.
은행에 가는 김에 우체국에도 들렀어요. eunhaeng-e ganeun gim-e ucheguk-edo deulleosseoyo. = Since I was going to the bank anyway, I dropped by the post office too.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 편의점에 가는 김에 저 커피 한 잔만 사다 주세요. (Pyeonuijeom-e ganeun gim-e jeo keopi han janman sada juseyo.)</p>
<p><strong>B:</strong> 네, 좋아요. 그런데 오늘은 커피 대신에 차를 마시는 게 어때요? (Ne, joayo. Geureonde oneureun keopi daesin-e chareul masineun ge eottaeyo?)</p>
</div>
<div class="callout"><span class="badge">Note</span> 는 대신에 shows a swap ("instead of A, B") or a trade-off ("A, but in return B"). 는 김에 means you add B onto A because you are already doing A — both clauses share the same subject and B is usually the smaller, opportunistic task. Do not use 는 김에 for two equally planned actions.</div>`,
    `<span class="eyebrow">KRL312 · Bài 5</span>
<h2>Thay vì &amp; tiện thể (는 대신에, 는 김에)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>대신</td><td>daesin</td><td>thay vì, thay cho</td></tr>
<tr><td>들르다</td><td>deulleuda</td><td>ghé qua (bất quy tắc 르)</td></tr>
<tr><td>부탁하다</td><td>butakhada</td><td>nhờ vả</td></tr>
<tr><td>처리하다</td><td>cheorihada</td><td>xử lý, giải quyết</td></tr>
<tr><td>외식하다</td><td>oesikhada</td><td>ăn ngoài, đi ăn tiệm</td></tr>
<tr><td>챙기다</td><td>chaenggida</td><td>mang theo, lo liệu</td></tr>
</tbody></table>
<h3>Ngữ pháp — thay vì / bù lại, và nhân tiện đang làm</h3>
<ul>
<li><strong>V + 는 대신(에), A + -(으)ㄴ 대신에, N 대신(에)</strong> = thay vì / thay cho, hoặc bù lại (đánh đổi): 운동하는 대신에 집안일을 했어요. 월급이 많은 대신에 일이 힘들어요.</li>
<li><strong>V + 는 김에</strong> = tiện thể / nhân lúc đang làm V (nắm cơ hội): 마트에 가는 김에 우유 좀 사다 주세요. 청소하는 김에 창문도 닦았어요.</li>
</ul>
<pre><code>외식하는 대신에 집에서 요리했어요. oesikhaneun daesin-e jib-eseo yorihaesseoyo. = Thay vì đi ăn ngoài, tôi nấu ăn ở nhà.
이 일은 힘든 대신에 돈을 많이 벌 수 있어요. i ir-eun himdeun daesin-e don-eul mani beol su isseoyo. = Việc này tuy vất vả nhưng bù lại kiếm được nhiều tiền.
은행에 가는 김에 우체국에도 들렀어요. eunhaeng-e ganeun gim-e ucheguk-edo deulleosseoyo. = Nhân tiện đi ngân hàng, tôi ghé luôn bưu điện.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 편의점에 가는 김에 저 커피 한 잔만 사다 주세요. (Pyeonuijeom-e ganeun gim-e jeo keopi han janman sada juseyo.)</p>
<p><strong>B:</strong> 네, 좋아요. 그런데 오늘은 커피 대신에 차를 마시는 게 어때요? (Ne, joayo. Geureonde oneureun keopi daesin-e chareul masineun ge eottaeyo?)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 는 대신에 chỉ sự thay thế ("thay vì A, làm B") hoặc đánh đổi ("A, nhưng bù lại B"). 는 김에 nghĩa bạn làm thêm B nhân lúc đang làm A — hai vế cùng chủ ngữ và B thường là việc nhỏ, nắm cơ hội. Đừng dùng 는 김에 cho hai việc đều được lên kế hoạch ngang nhau.</div>`,
  ]]);
const b5q = quiz('krl312-quiz-5', 'Quiz 5 — Instead & while at it|||Quiz 5 — Thay vì & tiện thể', [
  { id: 'q1', question: 'Which means "while I am already doing A, I also do B"?|||Đâu là "nhân lúc đang làm A, làm luôn B"?', options: ['-는 대신에', '-는 김에', '-는 데다가', '-느라고'], correctIndex: 1, explanation: 'V + 는 김에 = tiện thể / nhân lúc đang làm A thì làm luôn B.' },
  { id: 'q2', question: '"외식하는 대신에 집에서 요리했어요" means…|||"외식하는 대신에 집에서 요리했어요" nghĩa là gì?', options: ['I ate out and cooked at home|||Tôi vừa ăn ngoài vừa nấu ở nhà', 'instead of eating out, I cooked at home|||Thay vì ăn ngoài, tôi nấu ở nhà', 'I want to eat out|||Tôi muốn ăn ngoài', 'because I ate out, I cooked|||Vì ăn ngoài nên tôi nấu'], correctIndex: 1, explanation: '는 대신에 = thay vì / thay cho; ở đây thay việc ăn ngoài bằng nấu nhà.' },
  { id: 'q3', question: '"월급이 많은 대신에 일이 힘들어요" expresses…|||"월급이 많은 대신에 일이 힘들어요" diễn đạt gì?', options: ['a pure choice|||một lựa chọn thuần tuý', 'a trade-off (high pay, but hard work)|||sự đánh đổi (lương cao nhưng việc vất vả)', 'a wish|||mong muốn', 'a command|||mệnh lệnh'], correctIndex: 1, explanation: '는 대신에 còn diễn đạt đánh đổi: được cái này thì bù lại cái kia.' },
]);

/* ── Bài 6 — Mong ước ───────────────────────────────────────────────────── */
const b6 = doc('krl312-6-1-wishes', 'Lesson 6 — Wishes & hopes|||Bài 6 — Mong ước',
  'V/A + 았/었으면 하다·좋겠다 (ước gì, giá mà), V + 기를 바라다 (mong rằng — trang trọng).',
  [[
    `<span class="eyebrow">KRL312 · Lesson 6</span>
<h2>Wishes &amp; hopes (았/었으면 하다, 기를 바라다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>바라다</td><td>barada</td><td>to hope, wish</td></tr>
<tr><td>소원</td><td>sowon</td><td>a wish, one's dearest hope</td></tr>
<tr><td>이루다</td><td>iruda</td><td>to achieve, fulfill</td></tr>
<tr><td>성공하다</td><td>seonggonghada</td><td>to succeed</td></tr>
<tr><td>건강하다</td><td>geonganghada</td><td>to be healthy</td></tr>
<tr><td>평화</td><td>pyeonghwa</td><td>peace</td></tr>
</tbody></table>
<h3>Grammar — I wish that..., I hope that...</h3>
<ul>
<li><strong>V/A + 았/었으면 하다 / 았/었으면 좋겠다</strong> = I wish / it would be nice if (a desire; the 았/었 here is NOT past): 여행을 갔으면 좋겠어요. 시간이 많았으면 해요.</li>
<li><strong>V + 기를 바라다 (바랍니다)</strong> = to hope that (more formal, used in speeches, letters, greetings): 건강하시기를 바랍니다. 꿈을 이루기를 바라요.</li>
</ul>
<pre><code>이번 시험에 꼭 합격했으면 좋겠어요. ibeon siheom-e kkok hapgyeokhaesseumyeon joketsseoyo. = I really hope I pass this exam.
주말에 날씨가 좀 좋았으면 해요. jumar-e nalssiga jom joasseumyeon haeyo. = I wish the weather would be nice this weekend.
새해에도 늘 건강하시기를 바랍니다. saehae-edo neul geonganghasigireul baramnida. = I wish you continued good health in the new year, too.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 새해 소원이 뭐예요? (Saehae sowon-i mwoyeyo?)</p>
<p><strong>B:</strong> 가족이 모두 건강했으면 좋겠어요. 그리고 올해는 꼭 취직에 성공하기를 바라요. (Gajog-i modu geonganghaesseumyeon joketsseoyo. Geurigo olhae-neun kkok chwijig-e seonggonghagireul barayo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> In 았/었으면 좋겠다 the 았/었 does NOT mean past time — it marks the wish as something desired or contrary to fact. 았/었으면 하다 is a softer, quieter version of the same wish. 기를 바라다 is more formal and written; you will see 바랍니다 in cards and speeches. Do not translate the 았/었 as "did".</div>`,
    `<span class="eyebrow">KRL312 · Bài 6</span>
<h2>Mong ước (았/었으면 하다, 기를 바라다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>바라다</td><td>barada</td><td>mong, ước</td></tr>
<tr><td>소원</td><td>sowon</td><td>điều ước, nguyện vọng</td></tr>
<tr><td>이루다</td><td>iruda</td><td>thực hiện, đạt được</td></tr>
<tr><td>성공하다</td><td>seonggonghada</td><td>thành công</td></tr>
<tr><td>건강하다</td><td>geonganghada</td><td>khoẻ mạnh</td></tr>
<tr><td>평화</td><td>pyeonghwa</td><td>hoà bình</td></tr>
</tbody></table>
<h3>Ngữ pháp — ước gì, mong rằng</h3>
<ul>
<li><strong>V/A + 았/었으면 하다 / 았/었으면 좋겠다</strong> = ước gì / giá mà (mong muốn; 았/었 ở đây KHÔNG phải quá khứ): 여행을 갔으면 좋겠어요. 시간이 많았으면 해요.</li>
<li><strong>V + 기를 바라다 (바랍니다)</strong> = mong rằng (trang trọng hơn, dùng trong diễn văn, thư, lời chúc): 건강하시기를 바랍니다. 꿈을 이루기를 바라요.</li>
</ul>
<pre><code>이번 시험에 꼭 합격했으면 좋겠어요. ibeon siheom-e kkok hapgyeokhaesseumyeon joketsseoyo. = Ước gì lần này tôi nhất định đỗ kỳ thi.
주말에 날씨가 좀 좋았으면 해요. jumar-e nalssiga jom joasseumyeon haeyo. = Giá mà cuối tuần trời đẹp một chút.
새해에도 늘 건강하시기를 바랍니다. saehae-edo neul geonganghasigireul baramnida. = Kính chúc (ngài) năm mới cũng luôn mạnh khoẻ.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 새해 소원이 뭐예요? (Saehae sowon-i mwoyeyo?)</p>
<p><strong>B:</strong> 가족이 모두 건강했으면 좋겠어요. 그리고 올해는 꼭 취직에 성공하기를 바라요. (Gajog-i modu geonganghaesseumyeon joketsseoyo. Geurigo olhae-neun kkok chwijig-e seonggonghagireul barayo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Trong 았/었으면 좋겠다, phần 았/었 KHÔNG chỉ thời quá khứ — nó đánh dấu điều mong muốn hoặc trái với thực tế. 았/었으면 하다 là cách nói mong ước nhẹ nhàng, kín đáo hơn. 기를 바라다 trang trọng và thiên văn viết; bạn sẽ gặp 바랍니다 trên thiệp và trong diễn văn. Đừng dịch 았/었 thành "đã".</div>`,
  ]]);
const b6q = quiz('krl312-quiz-6', 'Quiz 6 — Wishes|||Quiz 6 — Mong ước', [
  { id: 'q1', question: 'In 합격했으면 좋겠어요, the 았/었 marks…|||Trong 합격했으면 좋겠어요, phần 았/었 đánh dấu…', options: ['past tense (already passed)|||thì quá khứ (đã đỗ)', 'a wish / desired thing (not past)|||điều mong muốn (không phải quá khứ)', 'a command|||mệnh lệnh', 'a question|||câu hỏi'], correctIndex: 1, explanation: 'Trong 았/었으면 좋겠다, 았/었 đánh dấu mong ước, KHÔNG phải quá khứ.' },
  { id: 'q2', question: 'Which is the MORE FORMAL "I hope that" used in greetings/speeches?|||Đâu là "mong rằng" TRANG TRỌNG hơn, dùng trong lời chúc/diễn văn?', options: ['-았/었으면 해요', '-기를 바랍니다', '-나 봐요', '-는 김에'], correctIndex: 1, explanation: 'V + 기를 바랍니다 = mong rằng (trang trọng): 건강하시기를 바랍니다.' },
  { id: 'q3', question: '"시간이 많았으면 해요" means…|||"시간이 많았으면 해요" nghĩa là gì?', options: ['I had a lot of time|||Tôi đã có nhiều thời gian', 'I wish I had a lot of time|||Ước gì tôi có nhiều thời gian', 'do I have time?|||tôi có thời gian không?', 'I must have time|||Tôi phải có thời gian'], correctIndex: 1, explanation: '았/었으면 하다 = ước gì / giá mà; 많았으면 해요 = ước gì có nhiều (thời gian).' },
]);

/* ── Bài 7 — Giả vờ & coi như ───────────────────────────────────────────── */
const b7 = doc('krl312-7-1-pretend-count', 'Lesson 7 — Pretence & near-equivalence|||Bài 7 — Giả vờ & coi như',
  'V + 는 척하다 / (으)ㄴ 척하다 (giả vờ), V + (으)ㄴ 셈이다 / 는 셈이다 (coi như, gần như).',
  [[
    `<span class="eyebrow">KRL312 · Lesson 7</span>
<h2>Pretence &amp; near-equivalence (는 척하다, 은 셈이다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>척하다</td><td>cheokhada</td><td>to pretend (to)</td></tr>
<tr><td>속이다</td><td>sogida</td><td>to deceive, trick</td></tr>
<tr><td>거의</td><td>geoui</td><td>almost, nearly</td></tr>
<tr><td>완성하다</td><td>wanseonghada</td><td>to complete, finish</td></tr>
<tr><td>사실</td><td>sasil</td><td>fact, in fact</td></tr>
<tr><td>모르다</td><td>moreuda</td><td>to not know (르 irregular)</td></tr>
</tbody></table>
<h3>Grammar — pretend to, and it counts as / is practically</h3>
<ul>
<li><strong>V + 는 척하다 / -(으)ㄴ 척하다, A + -(으)ㄴ 척하다</strong> = pretend to (reality differs; 체하다 is a synonym): 자는 척하다, 모른 척하다, 안 아픈 척하다.</li>
<li><strong>V + -(으)ㄴ 셈이다 / 는 셈이다, A + -(으)ㄴ 셈이다</strong> = it amounts to / counts as / is practically (a summary or estimate): 다 끝난 셈이에요. 이 정도면 성공한 셈이에요.</li>
</ul>
<pre><code>동생은 숙제를 다 한 척했지만 사실은 안 했어요. dongsaeng-eun sukje-reul da han cheokhaetjiman sasireun an haesseoyo. = My brother pretended he had finished the homework, but in fact he had not.
길에서 아는 사람을 봤지만 모른 척했어요. gir-eseo aneun saram-eul bwatjiman moreun cheokhaesseoyo. = I saw someone I knew on the street but pretended not to know them.
한 과만 더 하면 이 책을 다 읽은 셈이에요. han gwaman deo hamyeon i chaeg-eul da ilgeun semieyo. = If I do just one more chapter, I will have practically read the whole book.</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 보고서 다 썼어요? (Bogoseo da sseosseoyo?)</p>
<p><strong>B:</strong> 거의 다 썼어요. 결론만 남았으니까 다 쓴 셈이에요. 아까 부장님이 물어봤을 때는 바쁜 척했어요. (Geoui da sseosseoyo. Gyeollonman namasseunikka da sseun semieyo. Akka bujangnim-i mureobwasseul ttae-neun bappeun cheokhaesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> 는 척하다 (= 체하다) marks a deliberate act that hides the truth — the verb before it takes the same tense form as a noun-modifier (자는, 잔, 잘). 은 셈이다 does NOT mean something really happened; it says the situation is close enough to count as done. Past-completed action + 셈이다 uses -(으)ㄴ (읽은 셈이다).</div>`,
    `<span class="eyebrow">KRL312 · Bài 7</span>
<h2>Giả vờ &amp; coi như (는 척하다, 은 셈이다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>척하다</td><td>cheokhada</td><td>giả vờ, giả bộ</td></tr>
<tr><td>속이다</td><td>sogida</td><td>lừa, đánh lừa</td></tr>
<tr><td>거의</td><td>geoui</td><td>hầu như, gần như</td></tr>
<tr><td>완성하다</td><td>wanseonghada</td><td>hoàn thành</td></tr>
<tr><td>사실</td><td>sasil</td><td>sự thật, thực ra</td></tr>
<tr><td>모르다</td><td>moreuda</td><td>không biết (bất quy tắc 르)</td></tr>
</tbody></table>
<h3>Ngữ pháp — giả vờ, và coi như / gần như</h3>
<ul>
<li><strong>V + 는 척하다 / -(으)ㄴ 척하다, A + -(으)ㄴ 척하다</strong> = giả vờ (thực tế khác đi; 체하다 là từ đồng nghĩa): 자는 척하다, 모른 척하다, 안 아픈 척하다.</li>
<li><strong>V + -(으)ㄴ 셈이다 / 는 셈이다, A + -(으)ㄴ 셈이다</strong> = coi như / xem như / gần như (tổng kết hoặc ước lượng): 다 끝난 셈이에요. 이 정도면 성공한 셈이에요.</li>
</ul>
<pre><code>동생은 숙제를 다 한 척했지만 사실은 안 했어요. dongsaeng-eun sukje-reul da han cheokhaetjiman sasireun an haesseoyo. = Em tôi giả vờ đã làm xong bài tập nhưng thật ra chưa làm.
길에서 아는 사람을 봤지만 모른 척했어요. gir-eseo aneun saram-eul bwatjiman moreun cheokhaesseoyo. = Tôi thấy người quen ngoài đường nhưng giả vờ không biết.
한 과만 더 하면 이 책을 다 읽은 셈이에요. han gwaman deo hamyeon i chaeg-eul da ilgeun semieyo. = Chỉ cần học thêm một bài nữa thì coi như đã đọc hết cuốn sách này.</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 보고서 다 썼어요? (Bogoseo da sseosseoyo?)</p>
<p><strong>B:</strong> 거의 다 썼어요. 결론만 남았으니까 다 쓴 셈이에요. 아까 부장님이 물어봤을 때는 바쁜 척했어요. (Geoui da sseosseoyo. Gyeollonman namasseunikka da sseun semieyo. Akka bujangnim-i mureobwasseul ttae-neun bappeun cheokhaesseoyo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 는 척하다 (= 체하다) đánh dấu hành động cố ý che giấu sự thật — động từ trước nó chia theo dạng định ngữ như bổ nghĩa danh từ (자는, 잔, 잘). 은 셈이다 KHÔNG có nghĩa việc thực sự đã xảy ra; nó nói tình huống đủ gần để coi như đã xong. Hành động đã hoàn tất + 셈이다 dùng -(으)ㄴ (읽은 셈이다).</div>`,
  ]]);
const b7q = quiz('krl312-quiz-7', 'Quiz 7 — Pretence & near-equivalence|||Quiz 7 — Giả vờ & coi như', [
  { id: 'q1', question: '"모른 척했어요" means…|||"모른 척했어요" nghĩa là gì?', options: ['I really did not know|||Tôi thật sự không biết', 'I pretended not to know|||Tôi giả vờ không biết', 'I want to know|||Tôi muốn biết', 'I will know|||Tôi sẽ biết'], correctIndex: 1, explanation: 'V + (으)ㄴ 척하다 = giả vờ; 모른 척하다 = giả vờ không biết (thực ra biết).' },
  { id: 'q2', question: '"다 끝난 셈이에요" tells us the task is…|||"다 끝난 셈이에요" cho biết công việc…', options: ['completely, literally finished|||đã xong hoàn toàn theo nghĩa đen', 'practically / as good as finished|||coi như / gần như đã xong', 'not started|||chưa bắt đầu', 'impossible|||không thể làm'], correctIndex: 1, explanation: '은 셈이다 = coi như / gần như; đủ gần để xem như đã xong, chưa hẳn xong 100%.' },
  { id: 'q3', question: '척하다 has a common synonym that also means "to pretend":|||척하다 có một từ đồng nghĩa cũng nghĩa "giả vờ":', options: ['체하다', '바라다', '들르다', '변하다'], correctIndex: 0, explanation: '체하다 = 척하다 = giả vờ: 자는 척하다 = 자는 체하다.' },
]);

/* ── Bài 8 — Bị động & sử động ──────────────────────────────────────────── */
const b8 = doc('krl312-8-1-passive-causative', 'Lesson 8 — Passive & causative|||Bài 8 — Bị động & sử động',
  'Bị động 이/히/리/기 (được/bị: 보이다, 먹히다, 열리다, 들리다), sử động (khiến: 먹이다, 입히다, 재우다).',
  [[
    `<span class="eyebrow">KRL312 · Lesson 8</span>
<h2>Passive &amp; causative (피동 · 사동: 이/히/리/기)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>보이다</td><td>boida</td><td>to be seen / to show (보다)</td></tr>
<tr><td>들리다</td><td>deullida</td><td>to be heard (듣다, passive)</td></tr>
<tr><td>열리다</td><td>yeollida</td><td>to be opened (열다, passive)</td></tr>
<tr><td>잡히다</td><td>japhida</td><td>to be caught (잡다, passive)</td></tr>
<tr><td>먹이다</td><td>meogida</td><td>to feed (먹다, causative)</td></tr>
<tr><td>재우다</td><td>jaeuda</td><td>to put to sleep (자다, causative)</td></tr>
</tbody></table>
<h3>Grammar — being done to, and making someone do</h3>
<ul>
<li><strong>피동 (passive)</strong> = stem + 이/히/리/기: 보다 → 보이다, 듣다 → 들리다, 열다 → 열리다, 잡다 → 잡히다, 안다 → 안기다. The agent takes 에게/한테 (people) or 에 (things): 쥐가 고양이에게 잡혔어요.</li>
<li><strong>사동 (causative)</strong> = stem + 이/히/리/기/우/구/추: 먹다 → 먹이다 (feed), 입다 → 입히다 (dress), 울다 → 울리다 (make cry), 자다 → 재우다 (put to sleep), 서다 → 세우다 (make stand/stop), 타다 → 태우다 (give a ride).</li>
</ul>
<pre><code>창문이 바람에 저절로 열렸어요. changmun-i baram-e jeojeollo yeollyeosseoyo. = The window opened by itself in the wind. (passive)
멀리서 음악 소리가 들려요. meolliseo eumak soriga deullyeoyo. = Music can be heard from far away. (passive)
엄마가 아기에게 우유를 먹여요. eommaga agi-ege uyureul meogyeoyo. = The mother feeds the baby milk. (causative)
아이에게 따뜻한 옷을 입혔어요. ai-ege ttatteuthan os-eul iphyeosseoyo. = I dressed the child in warm clothes. (causative)</code></pre>
<h3>Dialogue</h3>
<div class="dialogue">
<p><strong>A:</strong> 여기에서 바다가 보여요? (Yeogieseo badaga boyeoyo?)</p>
<p><strong>B:</strong> 네, 창문을 여니까 바다가 잘 보여요. 파도 소리도 들려요. 아기를 재우고 나서 같이 봐요. (Ne, changmun-eul yeonikka badaga jal boyeoyo. Pado sorido deullyeoyo. Agireul jaeugo naseo gachi bwayo.)</p>
</div>
<div class="callout"><span class="badge">Note</span> The same letters 이/히/리/기 build BOTH voices, so meaning and sentence shape tell them apart: the passive subject undergoes the action (문이 열리다 = the door is opened), while the causative subject makes another do or undergo it (밥을 먹이다 = to feed someone). Not every verb takes these infixes — many use 게 하다 (Lesson 2) or 아/어지다 instead. Learn the common forms as vocabulary.</div>`,
    `<span class="eyebrow">KRL312 · Bài 8</span>
<h2>Bị động &amp; sử động (피동 · 사동: 이/히/리/기)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>보이다</td><td>boida</td><td>được thấy / cho thấy (보다)</td></tr>
<tr><td>들리다</td><td>deullida</td><td>được nghe thấy (듣다, bị động)</td></tr>
<tr><td>열리다</td><td>yeollida</td><td>được mở ra (열다, bị động)</td></tr>
<tr><td>잡히다</td><td>japhida</td><td>bị bắt (잡다, bị động)</td></tr>
<tr><td>먹이다</td><td>meogida</td><td>cho ăn (먹다, sử động)</td></tr>
<tr><td>재우다</td><td>jaeuda</td><td>cho ngủ, ru ngủ (자다, sử động)</td></tr>
</tbody></table>
<h3>Ngữ pháp — bị/được tác động, và khiến ai làm</h3>
<ul>
<li><strong>피동 (bị động)</strong> = gốc + 이/히/리/기: 보다 → 보이다, 듣다 → 들리다, 열다 → 열리다, 잡다 → 잡히다, 안다 → 안기다. Tác nhân lấy 에게/한테 (người) hoặc 에 (vật): 쥐가 고양이에게 잡혔어요.</li>
<li><strong>사동 (sử động)</strong> = gốc + 이/히/리/기/우/구/추: 먹다 → 먹이다 (cho ăn), 입다 → 입히다 (mặc cho), 울다 → 울리다 (làm khóc), 자다 → 재우다 (cho ngủ), 서다 → 세우다 (dừng lại/dựng), 타다 → 태우다 (cho đi nhờ).</li>
</ul>
<pre><code>창문이 바람에 저절로 열렸어요. changmun-i baram-e jeojeollo yeollyeosseoyo. = Cửa sổ tự mở ra vì gió. (bị động)
멀리서 음악 소리가 들려요. meolliseo eumak soriga deullyeoyo. = Từ xa nghe thấy tiếng nhạc. (bị động)
엄마가 아기에게 우유를 먹여요. eommaga agi-ege uyureul meogyeoyo. = Mẹ cho em bé uống sữa. (sử động)
아이에게 따뜻한 옷을 입혔어요. ai-ege ttatteuthan os-eul iphyeosseoyo. = Tôi mặc áo ấm cho đứa bé. (sử động)</code></pre>
<h3>Hội thoại</h3>
<div class="dialogue">
<p><strong>A:</strong> 여기에서 바다가 보여요? (Yeogieseo badaga boyeoyo?)</p>
<p><strong>B:</strong> 네, 창문을 여니까 바다가 잘 보여요. 파도 소리도 들려요. 아기를 재우고 나서 같이 봐요. (Ne, changmun-eul yeonikka badaga jal boyeoyo. Pado sorido deullyeoyo. Agireul jaeugo naseo gachi bwayo.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Cùng các chữ 이/히/리/기 dựng nên CẢ HAI thể, nên phải dựa vào nghĩa và cấu trúc câu để phân biệt: chủ ngữ bị động chịu tác động (문이 열리다 = cửa được mở), còn chủ ngữ sử động khiến người/vật khác làm hoặc chịu (밥을 먹이다 = cho ai ăn). Không phải động từ nào cũng nhận phụ tố này — nhiều động từ dùng 게 하다 (Bài 2) hoặc 아/어지다. Hãy học thuộc các dạng thường gặp như từ vựng.</div>`,
  ]]);
const b8q = quiz('krl312-quiz-8', 'Quiz 8 — Passive & causative|||Quiz 8 — Bị động & sử động', [
  { id: 'q1', question: 'The passive/causative infixes are…|||Các phụ tố bị động/sử động là…', options: ['이/히/리/기', '느라고/바람에', '더니/더라', '뿐만/데다가'], correctIndex: 0, explanation: 'Bị động dùng 이/히/리/기; sử động thêm cả 우/구/추. Học thuộc từng động từ.' },
  { id: 'q2', question: '"문이 열렸어요" is which voice?|||"문이 열렸어요" thuộc thể nào?', options: ['active (someone opened it)|||chủ động (ai đó mở)', 'passive (the door was opened)|||bị động (cửa được mở)', 'causative (made it open)|||sử động (khiến mở)', 'a wish|||mong ước'], correctIndex: 1, explanation: '열다 → 열리다 (bị động): 문이 열렸어요 = cửa được/bị mở.' },
  { id: 'q3', question: '"아기에게 밥을 먹여요" means…|||"아기에게 밥을 먹여요" nghĩa là gì?', options: ['the baby eats rice|||em bé tự ăn cơm', '(someone) feeds the baby rice|||(ai đó) cho em bé ăn cơm', 'the rice is eaten|||cơm bị ăn hết', 'the baby is hungry|||em bé đói'], correctIndex: 1, explanation: '먹다 → 먹이다 (sử động): 밥을 먹여요 = cho (em bé) ăn cơm.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'KRL312',
    slug: 'krl312-intermediate-korean-1',
    title: 'Intermediate Korean 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KRL312.webp',
    shortDescription: 'Intermediate Korean 1, after KRL222: cause (느라고, 는 바람에), purpose (도록, 게 하다), discovery (더니, 았더니), addition (뿐만 아니라), wishes (았으면 하다), pretending (는 척하다) & passive/causative (이/히/리/기). Sejong Korean 4, early TOPIK II.|||Tiếng Hàn trung cấp 1, nối tiếp KRL222: nguyên nhân (느라고, 바람에), mục đích (도록), phát hiện (더니), bổ sung (뿐만 아니라), mong ước (았으면 하다), giả vờ (척하다) & bị động/sử động (이/히/리/기). Sejong 4, TOPIK II sơ.',
    description: 'Môn <strong>KRL312 — Intermediate Korean 1</strong> (Tiếng Hàn trung cấp 1, Kỳ 4, ngành Ngôn ngữ Hàn) nối tiếp <strong>KRL222</strong>. Từ nền mục đích, lựa chọn, nhượng bộ, phỏng đoán, tường thuật và kính ngữ, môn này mở sang trung cấp: <strong>nguyên nhân tiêu cực</strong> (느라고, 는 바람에) → <strong>mục đích &amp; khiến</strong> (도록, 게 하다) → <strong>phát hiện</strong> (더니, 았/었더니) → <strong>bổ sung</strong> (을 뿐만 아니라, 는 데다가) → <strong>đánh đổi &amp; tiện thể</strong> (는 대신에, 는 김에) → <strong>mong ước</strong> (았/었으면 하다, 기를 바라다) → <strong>giả vờ &amp; coi như</strong> (는 척하다, 은 셈이다) → <strong>bị động &amp; sử động</strong> (피동/사동: 이/히/리/기). Bám giáo trình Sejong Korean 4 / Ewha, song ngữ Hàn-Việt, có bảng từ vựng, ngữ pháp, hội thoại và quiz mỗi bài. Trình độ TOPIK II sơ (đầu trung cấp).',
    whatYouLearn: 'Diễn đạt nguyên nhân tiêu cực với 느라고 và 는 바람에; đặt mục đích bằng 도록 và khiến ai làm bằng 게 하다; kể lại quan sát với 더니 và phát hiện của mình với 았/었더니; cộng dồn thông tin bằng 을 뿐만 아니라 và 는 데다가; cân nhắc đánh đổi 는 대신에 và làm việc tiện thể 는 김에; nói lên mong ước qua 았/었으면 하다 và 기를 바라다; tả sự giả vờ 는 척하다 và ước lượng 은 셈이다; và nắn động từ sang thể bị động (피동) cùng sử động (사동) với các phụ tố 이/히/리/기.',
    requirements: 'Đã học xong KRL222 (Elementary Korean 4) hoặc tương đương: nắm mục đích (기 위해서, 을 겸), lựa chọn (거나, 든지), nhượng bộ (아/어도, 더라도), phỏng đoán (나 보다, 는 것 같다), tường thuật (다면서요), kính ngữ (드리다, 께서), và động từ bất quy tắc ㄷ/ㅂ/ㅅ/르. Cần luyện nói hội thoại thành tiếng mỗi ngày.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Sejong 4/Ewha, từ điển Naver, app, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp KRL222, mục tiêu TOPIK II, bản đồ 8 bài.', lessons: [intro] },
    { title: 'Bài 1 — Nguyên nhân tiêu cực|||Lesson 1 — Negative cause', description: '느라고, 는 바람에.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Mục đích & khiến|||Lesson 2 — Purpose & making', description: '도록, 게 하다.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Phát hiện|||Lesson 3 — Discovery', description: '더니, 았/었더니.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Không chỉ... mà còn|||Lesson 4 — Not only... but also', description: '을 뿐만 아니라, 는 데다가.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Thay vì & tiện thể|||Lesson 5 — Instead & while at it', description: '는 대신에, 는 김에.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Mong ước|||Lesson 6 — Wishes', description: '았/었으면 하다, 기를 바라다.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Giả vờ & coi như|||Lesson 7 — Pretence & near-equivalence', description: '는 척하다, 은 셈이다.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Bị động & sử động|||Lesson 8 — Passive & causative', description: '피동/사동: 이/히/리/기.', lessons: [b8, b8q] },
  ],
};
