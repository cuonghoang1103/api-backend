/**
 * KRL502 — Advanced Korean 1 (Tiếng Hàn nâng cao 1). Khối Ngôn ngữ Hàn FPTU, Kỳ 7.
 * NỐI TIẾP KRL402 — Intermediate Korean 3. Giáo trình chuẩn: 서울대 한국어 5-6 (Seoul
 * National Univ. Korean 5-6), 이화 한국어 5 (Ewha Korean 5); trình độ TOPIK II (5-6급 — CAO).
 * MÔN NÂNG CAO — không lặp sơ/trung cấp: từ vựng học thuật/trừu tượng, ngữ pháp trang
 * trọng/văn viết, văn bản dài (đoạn văn/bài xã luận), thành ngữ & sự thành ngữ (사자성어).
 * bi(e,v): e = trình bày Hàn+Anh, v = giải thích tiếng Việt. Quiz: tiếng Việt thuần.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & ngữ pháp nâng cao của chương.', quiz: { timeLimitSeconds: 360, questions } });

/* ── Tài liệu ────────────────────────────────────────────────────────────── */
const taiLieu = doc('krl502-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình Seoul National Korean 5-6 / Ewha Korean 5, trang chính thức TOPIK, từ điển Naver, YouTube nâng cao, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">KRL502 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">This is <strong>Advanced Korean 1</strong> — the jump from intermediate (KRL402) into <strong>TOPIK II upper level (5-6급)</strong>: academic vocabulary, formal/written grammar, editorials, and long text. The official FPTU giáo trình &amp; slides live on <strong>FLM</strong>; below are free, legal resources for self-study at this level.</p>
<h3>📘 Textbooks</h3>
<ul>
<li><em>서울대 한국어 5-6 (Seoul National University Korean 5-6)</em> — Language Education Institute, SNU</li>
<li><em>이화 한국어 5 (Ewha Korean 5)</em> — Ewha Womans University Press</li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://www.topik.go.kr/" target="_blank" rel="noopener">TOPIK official site (topik.go.kr)</a> — past papers &amp; TOPIK II 5-6급 sample tests</li>
<li><a href="https://korean.dict.naver.com/" target="_blank" rel="noopener">Naver Korean Dictionary (한국어사전)</a> — Hanja breakdown for 사자성어</li>
</ul>
<h3>▶️ YouTube channels (advanced)</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — advanced grammar &amp; nuance</li>
<li><a href="https://www.youtube.com/@KBSNEWS" target="_blank" rel="noopener">KBS News</a> — real news broadcasts for listening practice</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Society &amp; economy</strong> — contemporary social issues (은/는 셈이다, 기 마련이다), employment &amp; globalization vocabulary.</li>
<li><strong>Science &amp; culture</strong> — technology/future forecasting (을 전망이다), Korean traditional culture &amp; hallyu.</li>
<li><strong>Abstract language &amp; media style</strong> — psychological/emotional expression, editorial &amp; argumentative writing (을 뿐만 아니라, 는 반면에).</li>
<li><strong>Idioms &amp; TOPIK 5-6 review</strong> — 사자성어/속담, essay structure (서론-본론-결론), academic reading strategies.</li>
</ol></div>`,
    `<span class="eyebrow">KRL502 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Đây là <strong>Tiếng Hàn nâng cao 1</strong> — bước nhảy từ trung cấp (KRL402) lên <strong>TOPIK II bậc cao (5-6급)</strong>: từ vựng học thuật, ngữ pháp trang trọng/văn viết, bài xã luận và văn bản dài. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp cho việc tự học ở trình độ này.</p>
<h3>📘 Giáo trình</h3>
<ul>
<li><em>서울대 한국어 5-6 (Đại học Quốc gia Seoul, Hàn Quốc 5-6)</em> — Viện Giáo dục Ngôn ngữ SNU</li>
<li><em>이화 한국어 5 (Ewha Korean 5)</em> — NXB Đại học Ewha</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.topik.go.kr/" target="_blank" rel="noopener">Trang chính thức TOPIK (topik.go.kr)</a> — đề thi cũ &amp; đề mẫu TOPIK II bậc 5-6</li>
<li><a href="https://korean.dict.naver.com/" target="_blank" rel="noopener">Từ điển Naver (한국어사전)</a> — tra Hán tự cho 사자성어</li>
</ul>
<h3>▶️ Kênh YouTube (nâng cao)</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — ngữ pháp nâng cao &amp; sắc thái</li>
<li><a href="https://www.youtube.com/@KBSNEWS" target="_blank" rel="noopener">KBS News</a> — bản tin thật để luyện nghe</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Xã hội &amp; kinh tế</strong> — vấn đề xã hội đương đại (은/는 셈이다, 기 마련이다), từ vựng việc làm &amp; toàn cầu hoá.</li>
<li><strong>Khoa học &amp; văn hoá</strong> — dự báo công nghệ/tương lai (을 전망이다), văn hoá truyền thống Hàn &amp; làn sóng Hallyu.</li>
<li><strong>Ngôn ngữ trừu tượng &amp; văn phong báo chí</strong> — biểu đạt tâm lý/cảm xúc, văn nghị luận (을 뿐만 아니라, 는 반면에).</li>
<li><strong>Thành ngữ &amp; ôn tập TOPIK 5-6</strong> — 사자성어/속담, cấu trúc bài luận (서론-본론-결론), chiến lược đọc hiểu học thuật.</li>
</ol></div>`,
  ]]);

/* ── Giới thiệu môn ──────────────────────────────────────────────────────── */
const intro = doc('krl502-0-1-overview', 'Course overview: from KRL402 to TOPIK II upper level|||Tổng quan: từ KRL402 lên TOPIK II bậc cao',
  'Mục tiêu môn (nâng cao, TOPIK 5-6), nhắc lại nền KRL402, bản đồ ngữ pháp 8 chương, và bậc lịch sự trang trọng.',
  [[
    `<span class="eyebrow">KRL502 · Chapter 0.1 · Overview</span>
<h2>Advanced Korean 1</h2>
<p class="lead">This course continues <strong>Intermediate Korean 3 (KRL402)</strong> and pushes into <strong>TOPIK II upper level (5-6급)</strong> — the register used in newspapers, essays and academic writing. You already handle condition, past counterfactual, plausibility, backdrop, near-miss, far-from, disruptive cause and counterfactual concession. Now you will speak about <strong>society, economy, science, culture, abstract feelings, and argumentative writing</strong> at a level a Korean adult reading the newspaper would use.</p>
<h3>What KRL402 gave you</h3>
<p>KRL402 reached the upper edge of intermediate grammar: 는 한/는 이상, 았/었더라면, 을 법하다, 는 가운데/와중에, 을락 말락, 기는커녕, 는 통에, 았/었던들. This course assumes fluent command of all of that and moves the FOCUS from grammar drilling to <strong>topic-based academic &amp; media Korean</strong>.</p>
<h3>Roadmap of the 8 chapters</h3>
<p>Society &amp; contemporary issues (은/는 셈이다, 기 마련이다) → economy, employment &amp; globalization → science, technology &amp; the future → culture, arts &amp; Korean tradition → abstract language &amp; emotional expression → argumentative &amp; journalistic style (을 뿐만 아니라, 는 반면에) → advanced idioms &amp; proverbs (사자성어, 속담) → TOPIK 5-6 review: advanced essay writing &amp; academic reading. Bilingual Korean-Vietnamese-English, with vocabulary tables, grammar notes, passages and a quiz each chapter.</p>
<div class="callout"><span class="badge">Register at this level</span> From here on, most model sentences use the <strong>formal 격식체 (합니다체)</strong> and written style, because that is the register of news, essays and official documents — the actual target of TOPIK 5-6. Casual 해요체 still appears in dialogues, but the exam and this course grade you on whether you can PRODUCE the formal register, not just recognize it.</div>`,
    `<span class="eyebrow">KRL502 · Chương 0.1 · Tổng quan</span>
<h2>Tiếng Hàn nâng cao 1</h2>
<p class="lead">Môn này nối tiếp <strong>Tiếng Hàn trung cấp 3 (KRL402)</strong> và tiến lên <strong>TOPIK II bậc cao (5-6급)</strong> — văn phong dùng trong báo chí, bài luận và văn bản học thuật. Bạn đã xử lý được điều kiện, giả định quá khứ, tính hợp lý, bối cảnh, chực-mà-chưa, nói-gì-đến, nguyên nhân rối ren và nhượng bộ trái thực tế. Giờ bạn sẽ nói về <strong>xã hội, kinh tế, khoa học, văn hoá, cảm xúc trừu tượng và văn nghị luận</strong> ở mức một người Hàn trưởng thành đọc báo dùng hằng ngày.</p>
<h3>KRL402 đã cho bạn gì</h3>
<p>KRL402 chạm ngưỡng trên của ngữ pháp trung cấp: 는 한/는 이상, 았/었더라면, 을 법하다, 는 가운데/와중에, 을락 말락, 기는커녕, 는 통에, 았/었던들. Môn này giả định bạn đã nắm vững toàn bộ, và chuyển TRỌNG TÂM từ luyện ngữ pháp sang <strong>tiếng Hàn học thuật &amp; báo chí theo chủ đề</strong>.</p>
<h3>Bản đồ 8 chương</h3>
<p>Xã hội &amp; vấn đề đương đại (은/는 셈이다, 기 마련이다) → kinh tế, việc làm &amp; toàn cầu hoá → khoa học, công nghệ &amp; tương lai → văn hoá, nghệ thuật &amp; truyền thống Hàn → ngôn ngữ trừu tượng &amp; biểu đạt cảm xúc → văn phong nghị luận &amp; báo chí (을 뿐만 아니라, 는 반면에) → thành ngữ &amp; tục ngữ nâng cao (사자성어, 속담) → ôn tập TOPIK 5-6: viết luận nâng cao &amp; đọc hiểu học thuật. Song ngữ Hàn-Việt-Anh, có bảng từ vựng, ghi chú ngữ pháp, đoạn văn và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Bậc lịch sự ở trình độ này</span> Từ đây trở đi, phần lớn câu mẫu dùng <strong>격식체 (thể 합니다체) trang trọng</strong> và văn viết, vì đó là văn phong của báo chí, bài luận và văn bản hành chính — đúng thứ TOPIK 5-6 nhắm tới. 해요체 thân mật vẫn xuất hiện trong hội thoại, nhưng kỳ thi và môn này chấm điểm ở việc bạn có TẠO RA được bậc trang trọng hay không, chứ không chỉ nhận ra nó.</div>`,
  ]]);

/* ── Chương 1 — Xã hội & vấn đề đương đại ───────────────────────────────── */
const c1 = doc('krl502-1-1-society', 'Chapter 1 — Society & contemporary issues|||Chương 1 — Xã hội & vấn đề đương đại',
  '고령화, 저출산, 양극화, 다문화 사회, 세대 차이; N + (이)ㄴ/는 셈이다 (coi như là), V/A + 기 마련이다 (lẽ đương nhiên, tất nhiên phải).',
  [[
    `<span class="eyebrow">KRL502 · Chapter 1</span>
<h2>Society &amp; contemporary issues (은/는 셈이다, 기 마련이다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>고령화</td><td>goryeonghwa</td><td>aging (of a population)</td></tr>
<tr><td>저출산</td><td>jeochulsan</td><td>low birthrate</td></tr>
<tr><td>양극화</td><td>yanggeukhwa</td><td>polarization</td></tr>
<tr><td>소외 계층</td><td>soui gyecheung</td><td>marginalized/underprivileged class</td></tr>
<tr><td>공동체</td><td>gongdongche</td><td>community</td></tr>
<tr><td>다문화 사회</td><td>damunhwa sahoe</td><td>multicultural society</td></tr>
<tr><td>세대 차이</td><td>sedae chai</td><td>generation gap</td></tr>
<tr><td>사회적 약자</td><td>sahoejeok yakja</td><td>the socially vulnerable</td></tr>
</tbody></table>
<h3>Grammar — as good as / it's only natural that</h3>
<ul>
<li><strong>N + (이)ㄴ/는 셈이다</strong> = it amounts to / it's practically the same as (a subjective judgment that a situation is "as good as" something, even if not literally true): 인구의 절반이 노인인 셈이다. 이 정도면 성공한 셈이에요.</li>
<li><strong>V/A + 기 마련이다</strong> = it is only natural that / bound to (states a universal truth or inevitable tendency, often about society or human nature): 사회가 고령화되면 문제가 생기기 마련이다. 사람은 누구나 실수하기 마련이다.</li>
</ul>
<pre><code>이제 노인 인구가 전체의 4분의 1인 셈이다. ije noin ingu-ga jeonchee-ui sabun-ui il-in shem-ida. = At this point, roughly a quarter of the whole population is elderly.
저출산이 계속되면 노동력이 부족해지기 마련이다. jeochulsani gyesokdoemyeon nodongnyeogi bujokhaejigi maryeonida. = If the low birthrate continues, a labor shortage is bound to occur.
양극화가 심해지면 사회 갈등이 생기기 마련이에요. yanggeukhwaga simhaejimyeon sahoe galdeungi saenggigi maryeonieoyo. = When polarization deepens, social conflict is only natural to arise.</code></pre>
<h3>Passage</h3>
<div class="dialogue">
<p>한국 사회는 빠르게 고령화되고 있으며, 저출산 문제와 맞물려 노동력 부족이 심각해지는 셈이다. 동시에 소득 양극화가 커지면서 사회적 약자와 소외 계층에 대한 관심이 커지고 있다. 다양한 배경의 사람들이 함께 사는 다문화 사회로 변해 가는 만큼, 세대 차이를 좁히고 공동체 의식을 회복하려는 노력이 필요해지기 마련이다.</p>
</div>
<div class="callout"><span class="badge">Note</span> 셈이다 is a SUBJECTIVE, evaluative "as good as" judgment — the speaker is doing rough mental arithmetic (4분의 1인 셈이다 = "you could say it's a quarter"). 기 마련이다 states an INEVITABLE, near-universal tendency, so it pairs naturally with generic subjects (사람은 누구나, 사회가) rather than one specific person or event.</div>`,
    `<span class="eyebrow">KRL502 · Chương 1</span>
<h2>Xã hội &amp; vấn đề đương đại (은/는 셈이다, 기 마련이다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>고령화</td><td>goryeonghwa</td><td>già hoá dân số</td></tr>
<tr><td>저출산</td><td>jeochulsan</td><td>tỉ lệ sinh thấp</td></tr>
<tr><td>양극화</td><td>yanggeukhwa</td><td>sự phân cực</td></tr>
<tr><td>소외 계층</td><td>soui gyecheung</td><td>tầng lớp bị bỏ rơi/thiệt thòi</td></tr>
<tr><td>공동체</td><td>gongdongche</td><td>cộng đồng</td></tr>
<tr><td>다문화 사회</td><td>damunhwa sahoe</td><td>xã hội đa văn hoá</td></tr>
<tr><td>세대 차이</td><td>sedae chai</td><td>khoảng cách thế hệ</td></tr>
<tr><td>사회적 약자</td><td>sahoejeok yakja</td><td>người yếu thế trong xã hội</td></tr>
</tbody></table>
<h3>Ngữ pháp — coi như là / lẽ đương nhiên là</h3>
<ul>
<li><strong>N + (이)ㄴ/는 셈이다</strong> = coi như là / kể như là (đánh giá chủ quan rằng tình huống "gần như" đúng vậy, dù không hoàn toàn chính xác): 인구의 절반이 노인인 셈이다. 이 정도면 성공한 셈이에요.</li>
<li><strong>V/A + 기 마련이다</strong> = lẽ đương nhiên / tất nhiên phải (nêu một sự thật phổ quát hay xu hướng tất yếu, thường về xã hội hay bản chất con người): 사회가 고령화되면 문제가 생기기 마련이다. 사람은 누구나 실수하기 마련이다.</li>
</ul>
<pre><code>이제 노인 인구가 전체의 4분의 1인 셈이다. ije noin ingu-ga jeonchee-ui sabun-ui il-in shem-ida. = Giờ dân số cao tuổi coi như chiếm một phần tư tổng dân số.
저출산이 계속되면 노동력이 부족해지기 마련이다. jeochulsani gyesokdoemyeon nodongnyeogi bujokhaejigi maryeonida. = Nếu tỉ lệ sinh thấp tiếp diễn thì thiếu hụt lao động là điều tất nhiên.
양극화가 심해지면 사회 갈등이 생기기 마련이에요. yanggeukhwaga simhaejimyeon sahoe galdeungi saenggigi maryeonieoyo. = Khi phân cực trầm trọng hơn thì mâu thuẫn xã hội tất nhiên nảy sinh.</code></pre>
<h3>Đoạn văn</h3>
<div class="dialogue">
<p>한국 사회는 빠르게 고령화되고 있으며, 저출산 문제와 맞물려 노동력 부족이 심각해지는 셈이다. 동시에 소득 양극화가 커지면서 사회적 약자와 소외 계층에 대한 관심이 커지고 있다. 다양한 배경의 사람들이 함께 사는 다문화 사회로 변해 가는 만큼, 세대 차이를 좁히고 공동체 의식을 회복하려는 노력이 필요해지기 마련이다.</p>
<p class="ml-vi-note">(Dịch: Xã hội Hàn Quốc đang già hoá nhanh chóng, và cùng với vấn đề tỉ lệ sinh thấp, tình trạng thiếu lao động coi như đang trở nên nghiêm trọng. Đồng thời, khi phân cực thu nhập ngày càng lớn, sự quan tâm dành cho người yếu thế và tầng lớp bị bỏ rơi cũng tăng lên. Khi xã hội chuyển dần thành xã hội đa văn hoá với những người có nền tảng khác nhau cùng sinh sống, nỗ lực thu hẹp khoảng cách thế hệ và khôi phục ý thức cộng đồng tất nhiên trở nên cần thiết.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 셈이다 là đánh giá CHỦ QUAN kiểu "coi như, kể như" — người nói đang nhẩm tính tương đối (4분의 1인 셈이다 = "coi như một phần tư"). 기 마련이다 nêu một xu hướng TẤT YẾU, gần như phổ quát, nên hay đi với chủ ngữ chung chung (사람은 누구나, 사회가) chứ không phải một người/sự việc cụ thể.</div>`,
  ]]);
const c1q = quiz('krl502-quiz-1', 'Quiz 1 — Society & contemporary issues|||Quiz 1 — Xã hội & vấn đề đương đại', [
  { id: 'q1', question: '"인구의 절반이 노인인 셈이다" mang nghĩa nào?', options: ['Chắc chắn 100% dân số là người già', 'Coi như/kể như một nửa dân số là người già (đánh giá tương đối)', 'Một nửa dân số sắp thành người già trong tương lai', 'Không có người già nào cả'], correctIndex: 1, explanation: '(이)ㄴ/는 셈이다 là đánh giá chủ quan kiểu "coi như là", không phải con số chính xác tuyệt đối.' },
  { id: 'q2', question: 'Cấu trúc nào diễn tả một xu hướng TẤT YẾU, gần như phổ quát (vd "ai cũng có lúc mắc lỗi")?', options: ['-(으)ㄴ/는 셈이다', '-기 마련이다', '-았/었더라면', '-는 통에'], correctIndex: 1, explanation: 'V/A + 기 마련이다 nêu sự thật phổ quát/tất yếu, hay đi với chủ ngữ chung chung như 사람은 누구나.' },
  { id: 'q3', question: 'Từ nào có nghĩa "tỉ lệ sinh thấp"?', options: ['고령화', '저출산', '양극화', '세대 차이'], correctIndex: 1, explanation: '저출산 (jeochulsan) = tỉ lệ sinh thấp; 고령화 = già hoá dân số; 양극화 = phân cực.' },
]);

/* ── Chương 2 — Kinh tế, việc làm & toàn cầu hoá ────────────────────────── */
const c2 = doc('krl502-2-1-economy', 'Chapter 2 — Economy, employment & globalization|||Chương 2 — Kinh tế, việc làm & toàn cầu hoá',
  '경제 성장, 실업률, 세계화, 취업난, 경쟁력; V + 는 한편으로 (mặt khác, đồng thời), N/V + 에 따라(서) (theo đà, tuỳ theo mà).',
  [[
    `<span class="eyebrow">KRL502 · Chapter 2</span>
<h2>Economy, employment &amp; globalization (는 한편으로, 에 따라)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>경제 성장</td><td>gyeongje seongjang</td><td>economic growth</td></tr>
<tr><td>실업률</td><td>sireomnyul</td><td>unemployment rate</td></tr>
<tr><td>세계화</td><td>segyehwa</td><td>globalization</td></tr>
<tr><td>다국적 기업</td><td>dagukjeok gieop</td><td>multinational corporation</td></tr>
<tr><td>취업난</td><td>chwieomnan</td><td>job-seeking difficulty</td></tr>
<tr><td>경쟁력</td><td>gyeongjaengnyeok</td><td>competitiveness</td></tr>
<tr><td>무역</td><td>muyeok</td><td>trade</td></tr>
<tr><td>노동 시장</td><td>nodong sijang</td><td>labor market</td></tr>
</tbody></table>
<h3>Grammar — on the other hand / while also, and depending on</h3>
<ul>
<li><strong>V + 는 한편으로</strong> = while at the same time / on the other hand (two things happening in parallel, one balancing the other): 정부는 경제 성장을 추진하는 한편으로 실업 문제도 해결하려 한다.</li>
<li><strong>N/V + 에 따라(서)</strong> = according to / depending on (an outcome that varies with a changing factor): 세계화가 진행됨에 따라 무역 규모가 커지고 있다. 경쟁력에 따라 기업의 성패가 갈린다.</li>
</ul>
<pre><code>정부는 수출을 늘리는 한편으로 국내 고용도 지키려 한다. jeongbuneun suchul-eul neullineun hanpyeoneuro gungnae goyongdo jikiryeo handa. = The government is boosting exports while also trying to protect domestic employment.
경제가 세계화됨에 따라 취업난은 더 복잡한 문제가 되었다. gyeongjega segyehwadoemyeo chwieomnaneun deo bokjaphan munjega doeeotda. = As the economy has globalized, the job-seeking crunch has become a more complex problem.
기업의 경쟁력에 따라 노동 시장의 판도가 달라진다. gieob-ui gyeongjaengnyeoge ttara nodong sijang-ui pandoga dallajinda. = The landscape of the labor market changes depending on a company's competitiveness.</code></pre>
<h3>Passage</h3>
<div class="dialogue">
<p>세계화가 빠르게 진행됨에 따라 다국적 기업들의 영향력이 커지고, 무역 규모도 크게 늘어났다. 그러나 경제 성장을 이루는 한편으로 실업률과 취업난이라는 그늘도 함께 커지고 있다. 결국 한 나라의 경쟁력은 노동 시장이 이러한 변화에 얼마나 유연하게 대응하느냐에 따라 결정된다고 할 수 있다.</p>
</div>
<div class="callout"><span class="badge">Note</span> 는 한편으로 links two actions of the SAME subject happening side by side, often one positive and one that needs balancing — a classic editorial move ("while doing A, it must also do B"). 에 따라(서) marks a VARYING factor that a result tracks; do not confuse with 에 의하면 (according to a source, for reported speech).</div>`,
    `<span class="eyebrow">KRL502 · Chương 2</span>
<h2>Kinh tế, việc làm &amp; toàn cầu hoá (는 한편으로, 에 따라)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>경제 성장</td><td>gyeongje seongjang</td><td>tăng trưởng kinh tế</td></tr>
<tr><td>실업률</td><td>sireomnyul</td><td>tỉ lệ thất nghiệp</td></tr>
<tr><td>세계화</td><td>segyehwa</td><td>toàn cầu hoá</td></tr>
<tr><td>다국적 기업</td><td>dagukjeok gieop</td><td>tập đoàn đa quốc gia</td></tr>
<tr><td>취업난</td><td>chwieomnan</td><td>khó khăn tìm việc</td></tr>
<tr><td>경쟁력</td><td>gyeongjaengnyeok</td><td>năng lực cạnh tranh</td></tr>
<tr><td>무역</td><td>muyeok</td><td>thương mại</td></tr>
<tr><td>노동 시장</td><td>nodong sijang</td><td>thị trường lao động</td></tr>
</tbody></table>
<h3>Ngữ pháp — mặt khác/đồng thời, và tuỳ theo mà</h3>
<ul>
<li><strong>V + 는 한편으로</strong> = mặt khác / đồng thời (hai việc song song, một việc cân bằng cho việc kia): 정부는 경제 성장을 추진하는 한편으로 실업 문제도 해결하려 한다.</li>
<li><strong>N/V + 에 따라(서)</strong> = theo, tuỳ theo (kết quả thay đổi theo một yếu tố biến động): 세계화가 진행됨에 따라 무역 규모가 커지고 있다. 경쟁력에 따라 기업의 성패가 갈린다.</li>
</ul>
<pre><code>정부는 수출을 늘리는 한편으로 국내 고용도 지키려 한다. jeongbuneun suchul-eul neullineun hanpyeoneuro gungnae goyongdo jikiryeo handa. = Chính phủ vừa đẩy mạnh xuất khẩu, mặt khác vừa cố giữ việc làm trong nước.
경제가 세계화됨에 따라 취업난은 더 복잡한 문제가 되었다. gyeongjega segyehwadoemyeo chwieomnaneun deo bokjaphan munjega doeeotda. = Khi kinh tế toàn cầu hoá, tình trạng khó tìm việc trở thành vấn đề phức tạp hơn.
기업의 경쟁력에 따라 노동 시장의 판도가 달라진다. gieob-ui gyeongjaengnyeoge ttara nodong sijang-ui pandoga dallajinda. = Cục diện thị trường lao động thay đổi tuỳ theo năng lực cạnh tranh của doanh nghiệp.</code></pre>
<h3>Đoạn văn</h3>
<div class="dialogue">
<p>세계화가 빠르게 진행됨에 따라 다국적 기업들의 영향력이 커지고, 무역 규모도 크게 늘어났다. 그러나 경제 성장을 이루는 한편으로 실업률과 취업난이라는 그늘도 함께 커지고 있다. 결국 한 나라의 경쟁력은 노동 시장이 이러한 변화에 얼마나 유연하게 대응하느냐에 따라 결정된다고 할 수 있다.</p>
<p class="ml-vi-note">(Dịch: Khi toàn cầu hoá diễn ra nhanh chóng, ảnh hưởng của các tập đoàn đa quốc gia ngày càng lớn, quy mô thương mại cũng tăng mạnh. Tuy nhiên, cùng lúc đạt được tăng trưởng kinh tế, mặt trái là tỉ lệ thất nghiệp và tình trạng khó tìm việc cũng lớn dần lên. Suy cho cùng, năng lực cạnh tranh của một quốc gia được quyết định bởi việc thị trường lao động ứng phó linh hoạt đến đâu trước những thay đổi này.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 는 한편으로 nối hai hành động của CÙNG một chủ thể diễn ra song song, thường một cái tích cực và một cái cần cân bằng — lối viết xã luận kinh điển ("vừa làm A, vừa phải làm B"). 에 따라(서) đánh dấu một yếu tố BIẾN ĐỘNG mà kết quả bám theo; đừng nhầm với 에 의하면 (theo nguồn tin, dùng khi tường thuật).</div>`,
  ]]);
const c2q = quiz('krl502-quiz-2', 'Quiz 2 — Economy, employment & globalization|||Quiz 2 — Kinh tế, việc làm & toàn cầu hoá', [
  { id: 'q1', question: '"정부는 경제 성장을 추진하는 한편으로 실업 문제도 해결하려 한다" nghĩa là?', options: ['Chính phủ chỉ lo tăng trưởng kinh tế, bỏ mặc thất nghiệp', 'Chính phủ vừa thúc đẩy tăng trưởng, mặt khác vừa cố giải quyết thất nghiệp', 'Chính phủ đã giải quyết xong thất nghiệp rồi mới tăng trưởng', 'Tăng trưởng kinh tế gây ra thất nghiệp'], correctIndex: 1, explanation: '는 한편으로 nối hai hành động song song của cùng chủ thể, một việc cân bằng việc kia.' },
  { id: 'q2', question: 'Cấu trúc nào diễn tả "kết quả thay đổi tuỳ theo một yếu tố"?', options: ['-는 한편으로', '-에 따라(서)', '-을 뿐만 아니라', '-기 마련이다'], correctIndex: 1, explanation: 'N/V + 에 따라(서) = theo, tuỳ theo; kết quả biến động theo yếu tố đó.' },
  { id: 'q3', question: '취업난 nghĩa là gì?', options: ['Tăng trưởng kinh tế', 'Khó khăn tìm việc', 'Toàn cầu hoá', 'Năng lực cạnh tranh'], correctIndex: 1, explanation: '취업난 (chwieomnan) = khó khăn/khủng hoảng tìm việc làm.' },
]);

/* ── Chương 3 — Khoa học, công nghệ & tương lai ─────────────────────────── */
const c3 = doc('krl502-3-1-science-tech', 'Chapter 3 — Science, technology & the future|||Chương 3 — Khoa học, công nghệ & tương lai',
  '인공지능, 자동화, 4차 산업혁명, 지속 가능성; N/V + (으)ㄹ 전망이다 (dự báo/triển vọng sẽ), V + 기에 이르다 (đến mức, đi đến chỗ).',
  [[
    `<span class="eyebrow">KRL502 · Chapter 3</span>
<h2>Science, technology &amp; the future (을 전망이다, 기에 이르다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>인공지능</td><td>ingongjineung</td><td>artificial intelligence (AI)</td></tr>
<tr><td>자동화</td><td>jadonghwa</td><td>automation</td></tr>
<tr><td>첨단 기술</td><td>cheomdan gisul</td><td>cutting-edge technology</td></tr>
<tr><td>4차 산업혁명</td><td>sacha saneophyeongmyeong</td><td>the 4th industrial revolution</td></tr>
<tr><td>혁신</td><td>hyeoksin</td><td>innovation</td></tr>
<tr><td>윤리적 문제</td><td>yullijeok munje</td><td>ethical issue</td></tr>
<tr><td>지속 가능성</td><td>jisok ganeungseong</td><td>sustainability</td></tr>
<tr><td>대체하다</td><td>daechehada</td><td>to replace</td></tr>
</tbody></table>
<h3>Grammar — it is forecast/expected that, and it has come to the point that</h3>
<ul>
<li><strong>N/V + (으)ㄹ 전망이다</strong> = it is forecast/expected that (used for expert predictions, reports, news about future trends): 인공지능이 여러 산업을 대체할 전망이다.</li>
<li><strong>V + 기에 이르다</strong> = to reach the point of / go so far as to (a gradual process arriving at a significant, often extreme, result): 자동화가 확산되면서 일부 직업은 사라지기에 이르렀다.</li>
</ul>
<pre><code>전문가들은 인공지능 시장이 계속 성장할 전망이라고 밝혔다. jeonmungadeureun ingongjineung sijangi gyesok seongjanghal jeonmang-irago balkhyeotda. = Experts stated that the AI market is forecast to keep growing.
자동화 기술이 발전함에 따라 일부 공장은 사람 없이 운영되기에 이르렀다. jadonghwa gisuri baljeonhame ttara ilbu gongjangeun saram eopsi unyeongdoegie ireureotda. = As automation technology has advanced, some factories have reached the point of running without people.
4차 산업혁명은 지속 가능성 문제도 함께 해결해야 할 전망이다. sacha saneophyeongmyeongeun jisok ganeungseong munjedo hamkke haegyeolhaeya hal jeonmang-ida. = The 4th industrial revolution is expected to have to solve sustainability issues as well.</code></pre>
<h3>Passage</h3>
<div class="dialogue">
<p>4차 산업혁명 시대를 맞아 인공지능과 자동화 같은 첨단 기술이 빠르게 발전하고 있다. 전문가들은 앞으로 십 년 안에 인공지능이 여러 분야의 일자리를 대체할 전망이라고 말한다. 그러나 기술 혁신이 지나치게 빨라지면서 개인정보 보호나 일자리 상실 같은 윤리적 문제가 심각한 사회적 갈등으로 번지기에 이르렀다. 따라서 기술 발전과 지속 가능성을 함께 고민해야 할 때다.</p>
</div>
<div class="callout"><span class="badge">Note</span> 을 전망이다 is the standard NEWS/REPORT verb for a forecast — you will see it constantly in economic and tech articles, almost always with 전문가들은/… 라고 밝혔다 (experts stated). 기에 이르다 signals that a gradual change has escalated to a NOTABLE, often surprising endpoint — stronger than simply "-게 되다" (came to be).</div>`,
    `<span class="eyebrow">KRL502 · Chương 3</span>
<h2>Khoa học, công nghệ &amp; tương lai (을 전망이다, 기에 이르다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>인공지능</td><td>ingongjineung</td><td>trí tuệ nhân tạo (AI)</td></tr>
<tr><td>자동화</td><td>jadonghwa</td><td>tự động hoá</td></tr>
<tr><td>첨단 기술</td><td>cheomdan gisul</td><td>công nghệ tiên tiến</td></tr>
<tr><td>4차 산업혁명</td><td>sacha saneophyeongmyeong</td><td>cách mạng công nghiệp 4.0</td></tr>
<tr><td>혁신</td><td>hyeoksin</td><td>đổi mới sáng tạo</td></tr>
<tr><td>윤리적 문제</td><td>yullijeok munje</td><td>vấn đề đạo đức</td></tr>
<tr><td>지속 가능성</td><td>jisok ganeungseong</td><td>tính bền vững</td></tr>
<tr><td>대체하다</td><td>daechehada</td><td>thay thế</td></tr>
</tbody></table>
<h3>Ngữ pháp — dự báo/triển vọng sẽ, và đi đến mức</h3>
<ul>
<li><strong>N/V + (으)ㄹ 전망이다</strong> = dự báo/triển vọng sẽ (dùng cho dự đoán của chuyên gia, báo cáo, tin tức về xu hướng tương lai): 인공지능이 여러 산업을 대체할 전망이다.</li>
<li><strong>V + 기에 이르다</strong> = đi đến mức / đến chỗ (một quá trình dần dần dẫn tới một kết quả đáng kể, thường là cực đoan): 자동화가 확산되면서 일부 직업은 사라지기에 이르렀다.</li>
</ul>
<pre><code>전문가들은 인공지능 시장이 계속 성장할 전망이라고 밝혔다. jeonmungadeureun ingongjineung sijangi gyesok seongjanghal jeonmang-irago balkhyeotda. = Các chuyên gia cho biết thị trường AI được dự báo sẽ tiếp tục tăng trưởng.
자동화 기술이 발전함에 따라 일부 공장은 사람 없이 운영되기에 이르렀다. jadonghwa gisuri baljeonhame ttara ilbu gongjangeun saram eopsi unyeongdoegie ireureotda. = Khi công nghệ tự động hoá phát triển, một số nhà máy đã đi đến chỗ vận hành không cần người.
4차 산업혁명은 지속 가능성 문제도 함께 해결해야 할 전망이다. sacha saneophyeongmyeongeun jisok ganeungseong munjedo hamkke haegyeolhaeya hal jeonmang-ida. = Cách mạng công nghiệp 4.0 được dự báo sẽ phải giải quyết luôn cả vấn đề bền vững.</code></pre>
<h3>Đoạn văn</h3>
<div class="dialogue">
<p>4차 산업혁명 시대를 맞아 인공지능과 자동화 같은 첨단 기술이 빠르게 발전하고 있다. 전문가들은 앞으로 십 년 안에 인공지능이 여러 분야의 일자리를 대체할 전망이라고 말한다. 그러나 기술 혁신이 지나치게 빨라지면서 개인정보 보호나 일자리 상실 같은 윤리적 문제가 심각한 사회적 갈등으로 번지기에 이르렀다. 따라서 기술 발전과 지속 가능성을 함께 고민해야 할 때다.</p>
<p class="ml-vi-note">(Dịch: Bước vào thời đại cách mạng công nghiệp 4.0, các công nghệ tiên tiến như trí tuệ nhân tạo và tự động hoá đang phát triển nhanh chóng. Các chuyên gia cho rằng trong vòng mười năm tới, AI được dự báo sẽ thay thế việc làm ở nhiều lĩnh vực. Tuy nhiên, khi đổi mới công nghệ diễn ra quá nhanh, những vấn đề đạo đức như bảo vệ thông tin cá nhân hay mất việc làm đã đi đến chỗ lan rộng thành mâu thuẫn xã hội nghiêm trọng. Vì vậy, đây là lúc cần cân nhắc cả phát triển công nghệ lẫn tính bền vững.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 을 전망이다 là động từ TIN TỨC/BÁO CÁO chuẩn cho dự báo — bạn sẽ gặp liên tục trong bài báo kinh tế và công nghệ, gần như luôn đi cùng 전문가들은/… 라고 밝혔다 (chuyên gia cho biết). 기에 이르다 báo hiệu một thay đổi dần dần đã leo thang tới một ĐIỂM ĐÁNG CHÚ Ý, thường bất ngờ — mạnh hơn "-게 되다" (trở nên) đơn thuần.</div>`,
  ]]);
const c3q = quiz('krl502-quiz-3', 'Quiz 3 — Science, technology & the future|||Quiz 3 — Khoa học, công nghệ & tương lai', [
  { id: 'q1', question: 'Cấu trúc nào thường dùng trong tin tức để đưa ra DỰ BÁO của chuyên gia?', options: ['-을 전망이다', '-는 셈이다', '-는 한편으로', '-을 따름이다'], correctIndex: 0, explanation: 'N/V + (으)ㄹ 전망이다 = dự báo/triển vọng sẽ, hay đi kèm 전문가들은 … 라고 밝혔다.' },
  { id: 'q2', question: '"일부 직업은 사라지기에 이르렀다" mang sắc thái gì?', options: ['Một vài công việc CÓ THỂ biến mất trong tương lai', 'Một quá trình dần dần đã ĐI ĐẾN MỨC một số công việc thực sự biến mất', 'Không công việc nào biến mất cả', 'Công việc biến mất rồi lại xuất hiện'], correctIndex: 1, explanation: 'V + 기에 이르다 = đi đến chỗ/đến mức, diễn tả một quá trình dần dần dẫn tới kết quả đáng kể.' },
  { id: 'q3', question: '지속 가능성 nghĩa là gì?', options: ['Trí tuệ nhân tạo', 'Tự động hoá', 'Tính bền vững', 'Đổi mới sáng tạo'], correctIndex: 2, explanation: '지속 가능성 (jisok ganeungseong) = tính bền vững, sustainability.' },
]);

/* ── Chương 4 — Văn hoá, nghệ thuật & truyền thống Hàn ──────────────────── */
const c4 = doc('krl502-4-1-culture-arts', 'Chapter 4 — Culture, arts & Korean tradition|||Chương 4 — Văn hoá, nghệ thuật & truyền thống Hàn',
  '전통문화, 한류, 무형문화재, 계승하다, 정체성; V + 는 듯싶다 (dường như, có vẻ), V + (으)ㄹ 만하다 (đáng để, xứng đáng).',
  [[
    `<span class="eyebrow">KRL502 · Chapter 4</span>
<h2>Culture, arts &amp; Korean tradition (는 듯싶다, 을 만하다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>전통문화</td><td>jeontongmunhwa</td><td>traditional culture</td></tr>
<tr><td>한류</td><td>hallyu</td><td>the Korean Wave</td></tr>
<tr><td>무형문화재</td><td>muhyeongmunhwajae</td><td>intangible cultural heritage</td></tr>
<tr><td>계승하다</td><td>gyeseunghada</td><td>to inherit, pass down</td></tr>
<tr><td>예술적 가치</td><td>yesuljeok gachi</td><td>artistic value</td></tr>
<tr><td>정체성</td><td>jeongcheseong</td><td>identity</td></tr>
<tr><td>명절</td><td>myeongjeol</td><td>traditional holiday</td></tr>
<tr><td>조화를 이루다</td><td>johwareul iruda</td><td>to achieve harmony</td></tr>
</tbody></table>
<h3>Grammar — it seems / it would seem that, and worth doing</h3>
<ul>
<li><strong>V/A + 는(은/ㄴ) 듯싶다</strong> = it seems / it would seem that (a soft, literary guess, gentler and more tentative than 는 것 같다): 전통과 현대가 조화를 이루는 듯싶다.</li>
<li><strong>V + (으)ㄹ 만하다</strong> = to be worth doing / deserve to be (something merits the effort or is impressive enough to warrant a reaction): 한번 방문할 만한 무형문화재 전시가 열렸다.</li>
</ul>
<pre><code>한류가 확산되면서 전통문화에 대한 관심도 함께 커지는 듯싶다. hallyuga hwaksandoemyeonseo jeontongmunhwae daehan gwansimdo hamkke keojineun deutsipda. = As hallyu spreads, interest in traditional culture also seems to be growing.
이 공연은 한 번쯤 볼 만한 가치가 있는 작품이다. i gongyeoneun han beonjjeum bol manhan gachiga inneun jakpumida. = This performance is a work worth seeing at least once.
젊은 세대가 명절 풍습을 계승하는 듯싶지만 아직 부족한 점도 많다. jeolmeun sedaega myeongjeol pungseub-eul gyeseunghaneun deutsipjiman ajik bujokhan jeomdo manta. = The younger generation would seem to be carrying on holiday customs, but there is still much lacking.</code></pre>
<h3>Passage</h3>
<div class="dialogue">
<p>최근 한류가 세계적으로 확산되면서 한국의 전통문화와 무형문화재에 대한 관심도 함께 커지는 듯싶다. 판소리나 탈춤 같은 전통 예술은 예술적 가치가 높아 한 번쯤 접해 볼 만하다. 다만 급격한 현대화 속에서 젊은 세대가 전통을 온전히 계승하기는 쉽지 않으며, 전통과 현대적 정체성이 조화를 이루는 방법을 계속 고민해야 할 듯싶다.</p>
</div>
<div class="callout"><span class="badge">Note</span> 는 듯싶다 is a SOFTER, more literary hedge than -는 것 같다 — appropriate for essays and reflective writing where you don't want to sound too certain. 을 만하다 marks something as MERITING an action or reaction (볼 만하다 = worth watching); it is not the same as 을 수 있다 (ability) — 만하다 is about value/worthiness, not capability.</div>`,
    `<span class="eyebrow">KRL502 · Chương 4</span>
<h2>Văn hoá, nghệ thuật &amp; truyền thống Hàn (는 듯싶다, 을 만하다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>전통문화</td><td>jeontongmunhwa</td><td>văn hoá truyền thống</td></tr>
<tr><td>한류</td><td>hallyu</td><td>làn sóng Hàn Quốc</td></tr>
<tr><td>무형문화재</td><td>muhyeongmunhwajae</td><td>di sản văn hoá phi vật thể</td></tr>
<tr><td>계승하다</td><td>gyeseunghada</td><td>kế thừa, lưu truyền</td></tr>
<tr><td>예술적 가치</td><td>yesuljeok gachi</td><td>giá trị nghệ thuật</td></tr>
<tr><td>정체성</td><td>jeongcheseong</td><td>bản sắc, căn tính</td></tr>
<tr><td>명절</td><td>myeongjeol</td><td>ngày lễ truyền thống</td></tr>
<tr><td>조화를 이루다</td><td>johwareul iruda</td><td>đạt được sự hài hoà</td></tr>
</tbody></table>
<h3>Ngữ pháp — dường như/có vẻ, và đáng để</h3>
<ul>
<li><strong>V/A + 는(은/ㄴ) 듯싶다</strong> = dường như / có vẻ (một phỏng đoán nhẹ nhàng, mang tính văn viết, mềm hơn 는 것 같다): 전통과 현대가 조화를 이루는 듯싶다.</li>
<li><strong>V + (으)ㄹ 만하다</strong> = đáng để / xứng đáng (điều gì đó xứng đáng công sức hoặc đủ ấn tượng để tạo phản ứng): 한번 방문할 만한 무형문화재 전시가 열렸다.</li>
</ul>
<pre><code>한류가 확산되면서 전통문화에 대한 관심도 함께 커지는 듯싶다. hallyuga hwaksandoemyeonseo jeontongmunhwae daehan gwansimdo hamkke keojineun deutsipda. = Khi làn sóng Hàn Quốc lan rộng, sự quan tâm dành cho văn hoá truyền thống dường như cũng tăng theo.
이 공연은 한 번쯤 볼 만한 가치가 있는 작품이다. i gongyeoneun han beonjjeum bol manhan gachiga inneun jakpumida. = Buổi biểu diễn này là tác phẩm đáng xem thử ít nhất một lần.
젊은 세대가 명절 풍습을 계승하는 듯싶지만 아직 부족한 점도 많다. jeolmeun sedaega myeongjeol pungseub-eul gyeseunghaneun deutsipjiman ajik bujokhan jeomdo manta. = Có vẻ như thế hệ trẻ đang kế thừa phong tục ngày lễ, nhưng vẫn còn nhiều điểm thiếu sót.</code></pre>
<h3>Đoạn văn</h3>
<div class="dialogue">
<p>최근 한류가 세계적으로 확산되면서 한국의 전통문화와 무형문화재에 대한 관심도 함께 커지는 듯싶다. 판소리나 탈춤 같은 전통 예술은 예술적 가치가 높아 한 번쯤 접해 볼 만하다. 다만 급격한 현대화 속에서 젊은 세대가 전통을 온전히 계승하기는 쉽지 않으며, 전통과 현대적 정체성이 조화를 이루는 방법을 계속 고민해야 할 듯싶다.</p>
<p class="ml-vi-note">(Dịch: Gần đây, khi làn sóng Hàn Quốc lan rộng toàn cầu, sự quan tâm dành cho văn hoá truyền thống và di sản văn hoá phi vật thể của Hàn Quốc dường như cũng tăng lên. Các loại hình nghệ thuật truyền thống như pansori hay múa mặt nạ có giá trị nghệ thuật cao, đáng để tiếp xúc thử một lần. Tuy nhiên, giữa quá trình hiện đại hoá nhanh chóng, việc thế hệ trẻ kế thừa trọn vẹn truyền thống không hề dễ dàng, và có vẻ vẫn cần tiếp tục trăn trở về cách hài hoà giữa truyền thống và bản sắc hiện đại.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 는 듯싶다 là cách phỏng đoán MỀM hơn, mang tính văn viết hơn -는 것 같다 — phù hợp cho bài luận và văn viết suy ngẫm khi không muốn tỏ ra quá chắc chắn. 을 만하다 đánh dấu điều gì đó XỨNG ĐÁNG với một hành động/phản ứng (볼 만하다 = đáng xem); khác với 을 수 있다 (khả năng) — 만하다 nói về giá trị/sự xứng đáng, không phải năng lực.</div>`,
  ]]);
const c4q = quiz('krl502-quiz-4', 'Quiz 4 — Culture, arts & Korean tradition|||Quiz 4 — Văn hoá, nghệ thuật & truyền thống Hàn', [
  { id: 'q1', question: 'So với -는 것 같다, cấu trúc -는 듯싶다 có sắc thái gì?', options: ['Chắc chắn tuyệt đối, không phải phỏng đoán', 'Mềm hơn, mang tính văn viết/suy ngẫm hơn, ít chắc chắn hơn', 'Chỉ dùng trong khẩu ngữ suồng sã', 'Là dạng mệnh lệnh'], correctIndex: 1, explanation: '는 듯싶다 là cách phỏng đoán mềm, văn viết, phù hợp bài luận và suy ngẫm.' },
  { id: 'q2', question: '"이 공연은 볼 만하다" nghĩa là?', options: ['Buổi biểu diễn CÓ THỂ xem được (về mặt kỹ thuật)', 'Buổi biểu diễn ĐÁNG để xem, xứng đáng công sức', 'Buổi biểu diễn không đáng xem', 'Buổi biểu diễn bị cấm xem'], correctIndex: 1, explanation: 'V + (으)ㄹ 만하다 = đáng để làm gì, nói về giá trị/sự xứng đáng chứ không phải khả năng.' },
  { id: 'q3', question: '무형문화재 nghĩa là gì?', options: ['Làn sóng Hàn Quốc', 'Di sản văn hoá phi vật thể', 'Bản sắc dân tộc', 'Ngày lễ truyền thống'], correctIndex: 1, explanation: '무형문화재 (muhyeongmunhwajae) = di sản văn hoá phi vật thể (intangible cultural heritage).' },
]);

/* ── Chương 5 — Ngôn ngữ trừu tượng & biểu đạt tâm lý, cảm xúc ──────────── */
const c5 = doc('krl502-5-1-abstract-emotion', 'Chapter 5 — Abstract language & psychological/emotional expression|||Chương 5 — Ngôn ngữ trừu tượng & biểu đạt tâm lý, cảm xúc',
  '성취감, 좌절감, 자존감, 무력감; V/A + (으)ㄴ/는 나머지 (đến nỗi, do quá... mà), N/V + (으)ㄹ 따름이다 (chỉ là, chỉ đơn thuần là).',
  [[
    `<span class="eyebrow">KRL502 · Chapter 5</span>
<h2>Abstract language &amp; emotional expression (나머지, 따름이다)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>심리적 부담</td><td>simnijeok budam</td><td>psychological burden</td></tr>
<tr><td>성취감</td><td>seongchwigam</td><td>sense of accomplishment</td></tr>
<tr><td>좌절감</td><td>jwajeolgam</td><td>sense of frustration</td></tr>
<tr><td>자존감</td><td>jajongam</td><td>self-esteem</td></tr>
<tr><td>무력감</td><td>muryeokgam</td><td>sense of helplessness</td></tr>
<tr><td>애틋하다</td><td>aeteutada</td><td>tender, heart-wrenching</td></tr>
<tr><td>뿌듯하다</td><td>ppudeutada</td><td>to feel proud/fulfilled</td></tr>
<tr><td>울컥하다</td><td>ulkeokhada</td><td>to be suddenly choked up</td></tr>
</tbody></table>
<h3>Grammar — so much so that / to the extent that, and merely / nothing but</h3>
<ul>
<li><strong>V/A + (으)ㄴ/는 나머지</strong> = so ... that, as a result of (excessive degree) (an extreme state or action leads directly to an unwanted result): 너무 긴장한 나머지 할 말을 잊어버렸다.</li>
<li><strong>N/V + (으)ㄹ 따름이다</strong> = merely / nothing but / simply (a modest, understated way of limiting a statement to just one thing, often after praise or apology): 그저 최선을 다했을 따름이다.</li>
</ul>
<pre><code>발표 중 너무 긴장한 나머지 목소리가 떨렸다. balpyo jung neomu ginjanghan namaji moksoriga tteollyeotda. = During the presentation, I was so nervous that my voice trembled.
합격 소식을 듣고 너무 기쁜 나머지 눈물이 났다. hapgyeok sosigeul deutgo neomu gippeun namaji nunmuri natda. = Hearing the news of passing, I was so happy that tears came.
저는 그저 맡은 일을 했을 따름입니다. jeoneun geujeo mateun ireul haesseul ttareumimnida. = I merely did the job I was given, nothing more.</code></pre>
<h3>Passage</h3>
<div class="dialogue">
<p>오랫동안 준비한 시험에 떨어진 후, 그는 좌절감과 무력감에 시달렸다. 너무 실망한 나머지 한동안 아무것도 손에 잡히지 않았다고 한다. 그러나 주변 사람들의 애틋한 위로 덕분에 다시 일어설 힘을 얻었고, 마침내 합격했을 때는 뿌듯한 마음에 울컥하지 않을 수 없었다. 그는 인터뷰에서 "저는 그저 포기하지 않았을 따름입니다."라고 말했다.</p>
</div>
<div class="callout"><span class="badge">Note</span> (으)ㄴ/는 나머지 always links an EXCESSIVE cause to a resulting state, usually unwanted or surprising — think "so X that Y happened as a side effect." (으)ㄹ 따름이다 is a humble, self-limiting closer — Koreans often use it after being praised, to downplay their own role (그저 ~했을 따름입니다).</div>`,
    `<span class="eyebrow">KRL502 · Chương 5</span>
<h2>Ngôn ngữ trừu tượng &amp; biểu đạt cảm xúc (나머지, 따름이다)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>심리적 부담</td><td>simnijeok budam</td><td>gánh nặng tâm lý</td></tr>
<tr><td>성취감</td><td>seongchwigam</td><td>cảm giác thành tựu</td></tr>
<tr><td>좌절감</td><td>jwajeolgam</td><td>cảm giác thất vọng, nản chí</td></tr>
<tr><td>자존감</td><td>jajongam</td><td>lòng tự trọng</td></tr>
<tr><td>무력감</td><td>muryeokgam</td><td>cảm giác bất lực</td></tr>
<tr><td>애틋하다</td><td>aeteutada</td><td>tha thiết, xúc động</td></tr>
<tr><td>뿌듯하다</td><td>ppudeutada</td><td>tự hào, mãn nguyện</td></tr>
<tr><td>울컥하다</td><td>ulkeokhada</td><td>chợt nghẹn ngào</td></tr>
</tbody></table>
<h3>Ngữ pháp — đến nỗi/do quá... mà, và chỉ là/chỉ đơn thuần</h3>
<ul>
<li><strong>V/A + (으)ㄴ/는 나머지</strong> = đến nỗi, do quá... mà (một trạng thái/hành động ở mức cực đoan dẫn thẳng tới một kết quả không mong muốn): 너무 긴장한 나머지 할 말을 잊어버렸다.</li>
<li><strong>N/V + (으)ㄹ 따름이다</strong> = chỉ là / chỉ đơn thuần là (cách nói khiêm tốn, giới hạn phát ngôn vào đúng một điều, hay dùng sau lời khen hoặc lời xin lỗi): 그저 최선을 다했을 따름이다.</li>
</ul>
<pre><code>발표 중 너무 긴장한 나머지 목소리가 떨렸다. balpyo jung neomu ginjanghan namaji moksoriga tteollyeotda. = Trong lúc thuyết trình, tôi hồi hộp đến nỗi giọng nói run lên.
합격 소식을 듣고 너무 기쁜 나머지 눈물이 났다. hapgyeok sosigeul deutgo neomu gippeun namaji nunmuri natda. = Nghe tin đỗ, tôi vui đến nỗi bật khóc.
저는 그저 맡은 일을 했을 따름입니다. jeoneun geujeo mateun ireul haesseul ttareumimnida. = Tôi chỉ đơn thuần làm việc được giao mà thôi.</code></pre>
<h3>Đoạn văn</h3>
<div class="dialogue">
<p>오랫동안 준비한 시험에 떨어진 후, 그는 좌절감과 무력감에 시달렸다. 너무 실망한 나머지 한동안 아무것도 손에 잡히지 않았다고 한다. 그러나 주변 사람들의 애틋한 위로 덕분에 다시 일어설 힘을 얻었고, 마침내 합격했을 때는 뿌듯한 마음에 울컥하지 않을 수 없었다. 그는 인터뷰에서 "저는 그저 포기하지 않았을 따름입니다."라고 말했다.</p>
<p class="ml-vi-note">(Dịch: Sau khi trượt kỳ thi đã chuẩn bị suốt thời gian dài, anh ấy chìm trong cảm giác thất vọng và bất lực. Nghe nói anh ấy thất vọng đến nỗi một thời gian không làm được việc gì cả. Nhưng nhờ những lời an ủi tha thiết từ mọi người xung quanh, anh có lại được sức mạnh để đứng dậy, và cuối cùng khi đỗ, anh không khỏi nghẹn ngào vì mãn nguyện. Anh nói trong buổi phỏng vấn: "Tôi chỉ đơn thuần là đã không bỏ cuộc mà thôi.")</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> (으)ㄴ/는 나머지 luôn nối một nguyên nhân ở mức CỰC ĐOAN với một trạng thái kết quả, thường không mong muốn hoặc bất ngờ — kiểu "quá X đến nỗi Y xảy ra như hệ quả." (으)ㄹ 따름이다 là cách kết câu khiêm tốn, tự giới hạn — người Hàn hay dùng sau khi được khen, để hạ thấp vai trò của mình (그저 ~했을 따름입니다).</div>`,
  ]]);
const c5q = quiz('krl502-quiz-5', 'Quiz 5 — Abstract language & emotional expression|||Quiz 5 — Ngôn ngữ trừu tượng & biểu đạt cảm xúc', [
  { id: 'q1', question: 'Cấu trúc -(으)ㄴ/는 나머지 diễn tả điều gì?', options: ['Một nguyên nhân ở mức cực đoan dẫn tới kết quả (thường không mong muốn)', 'Một lời mời lịch sự', 'Một dự báo của chuyên gia', 'Một phép so sánh nhẹ nhàng'], correctIndex: 0, explanation: '(으)ㄴ/는 나머지 = đến nỗi/do quá... mà, nối nguyên nhân cực đoan với kết quả.' },
  { id: 'q2', question: '"그저 최선을 다했을 따름입니다" thể hiện thái độ gì của người nói?', options: ['Tự cao, khoe khoang thành tích', 'Khiêm tốn, tự giới hạn công lao của mình', 'Tức giận, phản đối', 'Nghi ngờ, không chắc chắn'], correctIndex: 1, explanation: '(으)ㄹ 따름이다 là cách nói khiêm tốn, hay dùng sau khi được khen để hạ thấp vai trò bản thân.' },
  { id: 'q3', question: '무력감 nghĩa là gì?', options: ['Cảm giác thành tựu', 'Cảm giác bất lực', 'Lòng tự trọng', 'Cảm giác thất vọng'], correctIndex: 1, explanation: '무력감 (muryeokgam) = cảm giác bất lực, sense of helplessness.' },
]);

/* ── Chương 6 — Văn phong nghị luận & báo chí ───────────────────────────── */
const c6 = doc('krl502-6-1-argumentative-journalistic', 'Chapter 6 — Argumentative & journalistic style|||Chương 6 — Văn phong nghị luận & báo chí',
  '여론, 보도하다, 논란이 되다, 실태, 규제; V/A + (으)ㄹ 뿐만 아니라 (không những... mà còn), V/A + 는 반면에 (mặt khác, trái lại).',
  [[
    `<span class="eyebrow">KRL502 · Chapter 6</span>
<h2>Argumentative &amp; journalistic style (뿐만 아니라, 는 반면에)</h2>
<h3>Vocabulary</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>여론</td><td>yeoron</td><td>public opinion</td></tr>
<tr><td>보도하다</td><td>bodohada</td><td>to report (news)</td></tr>
<tr><td>논란이 되다</td><td>nollani doeda</td><td>to become controversial</td></tr>
<tr><td>실태</td><td>siltae</td><td>the actual state/status quo</td></tr>
<tr><td>대두되다</td><td>daedudoeda</td><td>to emerge, come to the fore</td></tr>
<tr><td>규제</td><td>gyuje</td><td>regulation</td></tr>
<tr><td>이해관계</td><td>ihaegwangye</td><td>interests, stakes</td></tr>
<tr><td>사설</td><td>saseol</td><td>editorial</td></tr>
</tbody></table>
<h3>Grammar — not only... but also, and while / whereas</h3>
<ul>
<li><strong>V/A + (으)ㄹ 뿐만 아니라</strong> = not only ... but also (adds a second, often stronger, point — a staple of formal argumentation): 이 정책은 효과가 없을 뿐만 아니라 부작용까지 낳고 있다.</li>
<li><strong>V/A + 는 반면에</strong> = while / whereas / on the other hand (a formal, written contrast between two clauses, stronger and more written than -지만): 찬성하는 여론이 있는 반면에 강하게 반대하는 목소리도 있다.</li>
</ul>
<pre><code>새 규제는 시장을 위축시킬 뿐만 아니라 소비자 불만도 키우고 있다. sae gyujeneun sijang-eul wichuksikil ppunman anira sobija bulmando kiugo itda. = The new regulation not only shrinks the market but also fuels consumer complaints.
전문가들은 규제에 찬성하는 반면에 기업들은 강하게 반발하고 있다. jeonmungadeureun gyujee chanseonghaneun banmyeone gieopdeureun ganghage banbalhago itda. = Experts favor the regulation, whereas businesses are strongly pushing back.
이 사설은 실태를 정확히 보도했을 뿐만 아니라 대안까지 제시했다. i saseoreun siltaereul jeonghwakhi bodohaesseul ppunman anira daeankkaji jesihaetda. = This editorial not only accurately reported the actual situation but also offered an alternative.</code></pre>
<h3>Passage</h3>
<div class="dialogue">
<p>최근 한 신문 사설은 배달 플랫폼 노동자의 실태를 집중 보도했다. 이 문제는 임금 격차뿐만 아니라 안전 문제까지 얽혀 있어 사회적으로 논란이 되었다. 노동자 단체는 정부의 강력한 규제를 요구하는 반면에, 업계는 과도한 규제가 일자리를 줄일 것이라며 반대한다. 이처럼 서로 다른 이해관계가 대두되면서 여론도 크게 갈리고 있다.</p>
</div>
<div class="callout"><span class="badge">Note</span> 을 뿐만 아니라 STACKS a second reason on top of the first — always positive-additive in structure even when the content is negative ("not only bad, but also worse"). 는 반면에 is the FORMAL written cousin of -지만: it explicitly sets up two contrasting parties or facts, and appears constantly in editorials to present both sides before an argument's conclusion.</div>`,
    `<span class="eyebrow">KRL502 · Chương 6</span>
<h2>Văn phong nghị luận &amp; báo chí (뿐만 아니라, 는 반면에)</h2>
<h3>Từ vựng</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>여론</td><td>yeoron</td><td>dư luận</td></tr>
<tr><td>보도하다</td><td>bodohada</td><td>đưa tin, tường thuật</td></tr>
<tr><td>논란이 되다</td><td>nollani doeda</td><td>trở thành đề tài tranh cãi</td></tr>
<tr><td>실태</td><td>siltae</td><td>thực trạng</td></tr>
<tr><td>대두되다</td><td>daedudoeda</td><td>nổi lên, xuất hiện</td></tr>
<tr><td>규제</td><td>gyuje</td><td>quy định, sự quản chế</td></tr>
<tr><td>이해관계</td><td>ihaegwangye</td><td>lợi ích liên quan, quyền lợi</td></tr>
<tr><td>사설</td><td>saseol</td><td>bài xã luận</td></tr>
</tbody></table>
<h3>Ngữ pháp — không những... mà còn, và mặt khác/trái lại</h3>
<ul>
<li><strong>V/A + (으)ㄹ 뿐만 아니라</strong> = không những... mà còn (thêm một luận điểm thứ hai, thường mạnh hơn — cấu trúc chủ lực của văn nghị luận trang trọng): 이 정책은 효과가 없을 뿐만 아니라 부작용까지 낳고 있다.</li>
<li><strong>V/A + 는 반면에</strong> = mặt khác / trái lại (đối lập trang trọng, mang tính văn viết giữa hai vế, mạnh và trang trọng hơn -지만): 찬성하는 여론이 있는 반면에 강하게 반대하는 목소리도 있다.</li>
</ul>
<pre><code>새 규제는 시장을 위축시킬 뿐만 아니라 소비자 불만도 키우고 있다. sae gyujeneun sijang-eul wichuksikil ppunman anira sobija bulmando kiugo itda. = Quy định mới không những làm co hẹp thị trường mà còn khiến người tiêu dùng bất mãn hơn.
전문가들은 규제에 찬성하는 반면에 기업들은 강하게 반발하고 있다. jeonmungadeureun gyujee chanseonghaneun banmyeone gieopdeureun ganghage banbalhago itda. = Các chuyên gia ủng hộ quy định, trong khi trái lại các doanh nghiệp phản đối mạnh mẽ.
이 사설은 실태를 정확히 보도했을 뿐만 아니라 대안까지 제시했다. i saseoreun siltaereul jeonghwakhi bodohaesseul ppunman anira daeankkaji jesihaetda. = Bài xã luận này không những đưa tin chính xác về thực trạng mà còn đề xuất cả giải pháp.</code></pre>
<h3>Đoạn văn</h3>
<div class="dialogue">
<p>최근 한 신문 사설은 배달 플랫폼 노동자의 실태를 집중 보도했다. 이 문제는 임금 격차뿐만 아니라 안전 문제까지 얽혀 있어 사회적으로 논란이 되었다. 노동자 단체는 정부의 강력한 규제를 요구하는 반면에, 업계는 과도한 규제가 일자리를 줄일 것이라며 반대한다. 이처럼 서로 다른 이해관계가 대두되면서 여론도 크게 갈리고 있다.</p>
<p class="ml-vi-note">(Dịch: Gần đây, một bài xã luận trên báo đã tập trung đưa tin về thực trạng của người lao động trên các nền tảng giao hàng. Vấn đề này không những liên quan đến chênh lệch tiền lương mà còn liên quan đến cả vấn đề an toàn, nên đã trở thành đề tài tranh cãi trong xã hội. Các tổ chức lao động yêu cầu chính phủ quản chế mạnh tay, trong khi trái lại giới doanh nghiệp phản đối vì cho rằng quy định quá mức sẽ làm giảm việc làm. Khi những lợi ích trái ngược nhau như vậy nổi lên, dư luận cũng bị chia rẽ mạnh.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> 을 뿐만 아니라 CHỒNG thêm một lý do thứ hai lên lý do đầu — luôn mang cấu trúc cộng dồn tích cực dù nội dung tiêu cực ("không những tệ, mà còn tệ hơn"). 는 반면에 là "người anh em" TRANG TRỌNG, văn viết của -지만: nó đặt rõ hai phía/sự kiện đối lập, xuất hiện liên tục trong xã luận để trình bày cả hai mặt trước khi đi đến kết luận.</div>`,
  ]]);
const c6q = quiz('krl502-quiz-6', 'Quiz 6 — Argumentative & journalistic style|||Quiz 6 — Văn phong nghị luận & báo chí', [
  { id: 'q1', question: 'Cấu trúc -(으)ㄹ 뿐만 아니라 dùng để làm gì?', options: ['Đối lập hai ý trái ngược nhau', 'Thêm một luận điểm thứ hai, thường mạnh hơn luận điểm đầu ("không những... mà còn")', 'Đưa ra một dự báo của chuyên gia', 'Diễn tả một quá khứ không có thật'], correctIndex: 1, explanation: 'V/A + (으)ㄹ 뿐만 아니라 = không những... mà còn, cộng dồn thêm luận điểm.' },
  { id: 'q2', question: 'So với -지만, cấu trúc -는 반면에 có gì khác?', options: ['Nghĩa hoàn toàn khác, không liên quan', 'Là bản trang trọng, văn viết hơn, thường dùng trong xã luận để đối lập hai phía rõ ràng', 'Chỉ dùng trong khẩu ngữ thân mật', 'Chỉ dùng ở thì quá khứ'], correctIndex: 1, explanation: '는 반면에 là dạng trang trọng, văn viết của -지만, hay dùng trong bài xã luận.' },
  { id: 'q3', question: '사설 nghĩa là gì?', options: ['Dư luận', 'Bài xã luận', 'Quy định, quản chế', 'Thực trạng'], correctIndex: 1, explanation: '사설 (saseol) = bài xã luận (editorial) trên báo.' },
]);

/* ── Chương 7 — Thành ngữ, tục ngữ & quán ngữ nâng cao ──────────────────── */
const c7 = doc('krl502-7-1-idioms-proverbs', 'Chapter 7 — Advanced idioms, proverbs & set phrases|||Chương 7 — Thành ngữ, tục ngữ & quán ngữ nâng cao',
  '사자성어 (유비무환, 자업자득, 고진감래, 새옹지마); 속담 (원숭이도 나무에서 떨어진다, 소 잃고 외양간 고친다, 하늘의 별 따기).',
  [[
    `<span class="eyebrow">KRL502 · Chapter 7</span>
<h2>Advanced idioms, proverbs &amp; set phrases (사자성어, 속담)</h2>
<h3>Four-character Sino-Korean idioms (사자성어)</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>유비무환</td><td>yubimuhwan</td><td>if you are prepared, there is no worry</td></tr>
<tr><td>자업자득</td><td>jaeopjadeuk</td><td>reap what you sow (you brought it on yourself)</td></tr>
<tr><td>고진감래</td><td>gojingamnae</td><td>after hardship comes sweetness (no pain, no gain)</td></tr>
<tr><td>새옹지마</td><td>saeongjima</td><td>a blessing in disguise (fortune is unpredictable)</td></tr>
</tbody></table>
<h3>Proverbs (속담)</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>원숭이도 나무에서 떨어진다</td><td>wonsungido namueseo tteoreojinda</td><td>even a monkey falls from a tree (experts make mistakes too)</td></tr>
<tr><td>소 잃고 외양간 고친다</td><td>so ilko oeyangan gochinda</td><td>fix the barn after losing the cow (too little too late)</td></tr>
<tr><td>하늘의 별 따기</td><td>haneur-ui byeol ttagi</td><td>as hard as plucking a star from the sky (extremely difficult)</td></tr>
</tbody></table>
<h3>Grammar note — how idioms slot into a sentence</h3>
<ul>
<li>사자성어 usually act as a NOUN or set adverbial phrase: N + (이)라는 말처럼, N + 인 셈이다: 유비무환이라는 말처럼 미리 대비해야 한다.</li>
<li>속담 are full sentences quoted as-is, often introduced by -듯이/처럼 or -(이)라는 말이 있다: "소 잃고 외양간 고친다"는 말이 있듯이, 사고 후에야 안전 규정을 강화했다.</li>
</ul>
<pre><code>유비무환이라는 말처럼, 재난에 미리 대비하는 것이 중요하다. yubimuhwan-irago malcheoreom, jaenane miri daebihaneun geosi jungyohada. = As the saying "preparedness prevents disaster" goes, preparing for disasters in advance is important.
그는 원숭이도 나무에서 떨어진다는 말처럼 실수를 했지만 곧 극복했다. geuneun wonsungido namueseo tteoreojindaneun malcheoreom silsureul haetjiman got geukbokhaetda. = He made a mistake — even experts slip up sometimes — but soon overcame it.
합격은 하늘의 별 따기처럼 어려웠지만 결국 고진감래였다. hapgyeogeun haneur-ui byeol ttagicheoreom eoryeowotjiman gyeolguk gojingamnaeeotda. = Passing felt as hard as plucking a star from the sky, but in the end, hardship gave way to sweetness.</code></pre>
<h3>Passage</h3>
<div class="dialogue">
<p>회사는 화재 사고 이후에야 소방 시설을 점검했다. "소 잃고 외양간 고친다"는 말처럼 뒤늦은 대응이었다. 직원들은 유비무환의 자세로 평소에 안전 교육을 받아야 한다고 입을 모았다. 한 직원은 몇 년간 힘든 시기를 견딘 끝에 승진했는데, 그는 이를 두고 고진감래라며 웃었다. 인생은 새옹지마라는 말처럼 언제 어떤 일이 생길지 아무도 모른다.</p>
</div>
<div class="callout"><span class="badge">Note</span> TOPIK 5-6 reading passages quote proverbs and 사자성어 directly without translation, so recognizing them by sound and Hanja root (자업자득: 自業自得 = one's own deed, one's own gain) is essential. In writing, drop one into a conclusion sentence — "결국 유비무환이 중요하다는 것을 깨달았다" — to sound like an educated native speaker.</div>`,
    `<span class="eyebrow">KRL502 · Chương 7</span>
<h2>Thành ngữ, tục ngữ &amp; quán ngữ nâng cao (사자성어, 속담)</h2>
<h3>Thành ngữ 4 chữ Hán-Hàn (사자성어)</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>유비무환</td><td>yubimuhwan</td><td>có chuẩn bị trước thì không lo (hữu bị vô hoạn)</td></tr>
<tr><td>자업자득</td><td>jaeopjadeuk</td><td>tự làm tự chịu (tự nghiệp tự đắc)</td></tr>
<tr><td>고진감래</td><td>gojingamnae</td><td>khổ tận cam lai (qua khổ sẽ tới ngọt)</td></tr>
<tr><td>새옹지마</td><td>saeongjima</td><td>tái ông thất mã (hoạ phúc khôn lường)</td></tr>
</tbody></table>
<h3>Tục ngữ (속담)</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>원숭이도 나무에서 떨어진다</td><td>wonsungido namueseo tteoreojinda</td><td>khỉ leo cây cũng có lúc rơi (chuyên gia cũng có lúc sai)</td></tr>
<tr><td>소 잃고 외양간 고친다</td><td>so ilko oeyangan gochinda</td><td>mất bò mới lo làm chuồng (quá muộn)</td></tr>
<tr><td>하늘의 별 따기</td><td>haneur-ui byeol ttagi</td><td>khó như hái sao trên trời (cực kỳ khó)</td></tr>
</tbody></table>
<h3>Ghi chú ngữ pháp — cách chèn thành ngữ vào câu</h3>
<ul>
<li>사자성어 thường đóng vai trò DANH TỪ hoặc cụm trạng ngữ cố định: N + (이)라는 말처럼, N + 인 셈이다: 유비무환이라는 말처럼 미리 대비해야 한다.</li>
<li>속담 được trích dẫn nguyên câu, thường mở đầu bằng -듯이/처럼 hoặc -(이)라는 말이 있다: "소 잃고 외양간 고친다"는 말이 있듯이, 사고 후에야 안전 규정을 강화했다.</li>
</ul>
<pre><code>유비무환이라는 말처럼, 재난에 미리 대비하는 것이 중요하다. yubimuhwan-irago malcheoreom, jaenane miri daebihaneun geosi jungyohada. = Như câu "hữu bị vô hoạn", việc chuẩn bị trước cho thiên tai là quan trọng.
그는 원숭이도 나무에서 떨어진다는 말처럼 실수를 했지만 곧 극복했다. geuneun wonsungido namueseo tteoreojindaneun malcheoreom silsureul haetjiman got geukbokhaetda. = Anh ấy mắc lỗi — đúng kiểu "khỉ leo cây cũng có lúc rơi" — nhưng đã sớm vượt qua.
합격은 하늘의 별 따기처럼 어려웠지만 결국 고진감래였다. hapgyeogeun haneur-ui byeol ttagicheoreom eoryeowotjiman gyeolguk gojingamnaeeotda. = Việc đỗ khó như hái sao trên trời, nhưng cuối cùng khổ tận cam lai.</code></pre>
<h3>Đoạn văn</h3>
<div class="dialogue">
<p>회사는 화재 사고 이후에야 소방 시설을 점검했다. "소 잃고 외양간 고친다"는 말처럼 뒤늦은 대응이었다. 직원들은 유비무환의 자세로 평소에 안전 교육을 받아야 한다고 입을 모았다. 한 직원은 몇 년간 힘든 시기를 견딘 끝에 승진했는데, 그는 이를 두고 고진감래라며 웃었다. 인생은 새옹지마라는 말처럼 언제 어떤 일이 생길지 아무도 모른다.</p>
<p class="ml-vi-note">(Dịch: Công ty chỉ kiểm tra thiết bị phòng cháy sau khi xảy ra hoả hoạn. Đúng như câu "mất bò mới lo làm chuồng", đó là phản ứng quá muộn. Nhân viên đồng lòng cho rằng cần được đào tạo an toàn thường xuyên với tinh thần chuẩn bị trước. Một nhân viên sau nhiều năm chịu đựng giai đoạn khó khăn đã được thăng chức, anh ấy cười nói đó là khổ tận cam lai. Cuộc đời như câu "tái ông thất mã", không ai biết chuyện gì sẽ xảy ra khi nào.)</p>
</div>
<div class="callout"><span class="badge">Ghi chú</span> Bài đọc TOPIK 5-6 trích tục ngữ và 사자성어 trực tiếp mà không dịch, nên nhận diện được qua âm và gốc Hán tự (자업자득: 自業自得 = tự nghiệp tự đắc) là điều bắt buộc. Khi viết luận, chèn một câu vào phần kết — "결국 유비무환이 중요하다는 것을 깨달았다" — để nghe tự nhiên như người bản xứ có học thức.</div>`,
  ]]);
const c7q = quiz('krl502-quiz-7', 'Quiz 7 — Advanced idioms, proverbs & set phrases|||Quiz 7 — Thành ngữ, tục ngữ & quán ngữ nâng cao', [
  { id: 'q1', question: '유비무환 mang ý nghĩa gì?', options: ['Tự làm tự chịu', 'Có chuẩn bị trước thì không lo (hữu bị vô hoạn)', 'Khổ tận cam lai', 'Tái ông thất mã'], correctIndex: 1, explanation: '유비무환 (hữu bị vô hoạn) = có chuẩn bị trước thì không phải lo lắng về sau.' },
  { id: 'q2', question: 'Câu tục ngữ "소 잃고 외양간 고친다" tương ứng với thành ngữ Việt nào?', options: ['Có công mài sắt có ngày nên kim', 'Mất bò mới lo làm chuồng', 'Nước đến chân mới nhảy (đúng ý nghĩa gần nhất trong 4 lựa chọn là mất bò...)', 'Một cây làm chẳng nên non'], correctIndex: 1, explanation: '소 잃고 외양간 고친다 = mất bò mới lo làm chuồng, chỉ hành động khắc phục quá muộn sau khi sự việc đã xảy ra.' },
  { id: 'q3', question: '새옹지마 mang ý nghĩa gần nhất với câu nào trong tiếng Việt?', options: ['Tái ông thất mã, hoạ phúc khôn lường', 'Con giun xéo lắm cũng quằn', 'Ăn quả nhớ kẻ trồng cây', 'Gieo gió gặt bão'], correctIndex: 0, explanation: '새옹지마 chính là điển tích "tái ông thất mã" — phúc hoạ khó lường trước, xui có thể hoá may.' },
]);

/* ── Chương 8 — Ôn tập TOPIK 5-6 ────────────────────────────────────────── */
const c8 = doc('krl502-8-1-topik-review', 'Chapter 8 — TOPIK 5-6 review: advanced essay writing & academic reading|||Chương 8 — Ôn tập TOPIK 5-6: viết luận nâng cao & đọc hiểu học thuật',
  'Cấu trúc bài luận 서론-본론-결론; liên từ nghị luận (따라서, 그럼에도 불구하고, 뿐만 아니라, 반면); chiến lược đọc hiểu văn bản học thuật.',
  [[
    `<span class="eyebrow">KRL502 · Chapter 8</span>
<h2>TOPIK 5-6 review: advanced essay writing &amp; academic reading</h2>
<h3>Essay structure — 서론 (introduction) / 본론 (body) / 결론 (conclusion)</h3>
<ul>
<li><strong>서론</strong> — state the issue and your position briefly; often opens with 최근 …이/가 사회적 문제로 대두되고 있다 (recently, X has emerged as a social issue).</li>
<li><strong>본론</strong> — give 2-3 supporting points using this chapter's connectives: 첫째, … 뿐만 아니라 … 둘째, … 반면에 … Cite cause with 는 통에/느라고 (Ch7 of KRL402), consequence with 는 나머지 (Ch5).</li>
<li><strong>결론</strong> — restate your position and give a forward-looking call to action, often with 따라서, 그러므로, 앞으로 …해야 할 것이다.</li>
</ul>
<h3>Key argumentative connectives to review</h3>
<table><thead><tr><th>한국어</th><th>Romanization</th><th>Meaning</th></tr></thead><tbody>
<tr><td>따라서</td><td>ttaraseo</td><td>therefore, accordingly</td></tr>
<tr><td>그럼에도 불구하고</td><td>geureomedo bulguhago</td><td>nevertheless, despite that</td></tr>
<tr><td>뿐만 아니라</td><td>ppunman anira</td><td>not only... but also</td></tr>
<tr><td>반면(에)</td><td>banmyeon(e)</td><td>whereas, on the other hand</td></tr>
<tr><td>결과적으로</td><td>gyeolgwajeogeuro</td><td>as a result</td></tr>
</tbody></table>
<h3>Sample outline (기후 변화 대응 — coping with climate change)</h3>
<pre><code>서론: 최근 기후 변화가 전 지구적 문제로 대두되고 있다.
본론1: 이상 기후는 농업 생산량을 줄일 뿐만 아니라 인명 피해까지 낳고 있다.
본론2: 각국이 대응책을 마련하는 반면에, 실질적인 실행은 여전히 부족하다.
결론: 그럼에도 불구하고 지속 가능한 정책을 지금 시작해야 하며, 따라서 개인의 실천도 중요하다.</code></pre>
<h3>Academic reading strategy</h3>
<p>TOPIK II reading passages at 5-6급 are often excerpts of editorials or reports. Read the FIRST and LAST sentence of each paragraph first — the topic sentence usually states the claim, and the closing sentence often restates it with 따라서/결국. Underline connectives (뿐만 아니라, 반면에, 그럼에도 불구하고) — they mark exactly where the argument turns.</p>
<div class="callout"><span class="badge">Exam tip</span> Graders reward VARIETY: mixing 은/는 셈이다, 기 마련이다, 을 전망이다, 뿐만 아니라, 는 반면에 across one essay signals command of this course's whole toolkit, not just one favorite pattern repeated.</div>`,
    `<span class="eyebrow">KRL502 · Chương 8</span>
<h2>Ôn tập TOPIK 5-6: viết luận nâng cao &amp; đọc hiểu học thuật</h2>
<h3>Cấu trúc bài luận — 서론 (mở bài) / 본론 (thân bài) / 결론 (kết bài)</h3>
<ul>
<li><strong>서론</strong> — nêu vấn đề và lập trường của bạn ngắn gọn; thường mở đầu bằng 최근 …이/가 사회적 문제로 대두되고 있다 (gần đây, X đang nổi lên như một vấn đề xã hội).</li>
<li><strong>본론</strong> — đưa ra 2-3 luận điểm dùng liên từ của chương này: 첫째, … 뿐만 아니라 … 둘째, … 반면에 … Nêu nguyên nhân bằng 는 통에/느라고 (Chương 7 KRL402), hệ quả bằng 는 나머지 (Chương 5).</li>
<li><strong>결론</strong> — nhắc lại lập trường và đưa ra lời kêu gọi hướng tới tương lai, thường dùng 따라서, 그러므로, 앞으로 …해야 할 것이다.</li>
</ul>
<h3>Liên từ nghị luận then chốt cần ôn</h3>
<table><thead><tr><th>한국어</th><th>Phiên âm</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>따라서</td><td>ttaraseo</td><td>vì vậy, do đó</td></tr>
<tr><td>그럼에도 불구하고</td><td>geureomedo bulguhago</td><td>dù vậy, bất chấp điều đó</td></tr>
<tr><td>뿐만 아니라</td><td>ppunman anira</td><td>không những... mà còn</td></tr>
<tr><td>반면(에)</td><td>banmyeon(e)</td><td>trái lại, mặt khác</td></tr>
<tr><td>결과적으로</td><td>gyeolgwajeogeuro</td><td>kết quả là, rốt cuộc</td></tr>
</tbody></table>
<h3>Dàn ý mẫu (기후 변화 대응 — ứng phó biến đổi khí hậu)</h3>
<pre><code>서론: 최근 기후 변화가 전 지구적 문제로 대두되고 있다.
본론1: 이상 기후는 농업 생산량을 줄일 뿐만 아니라 인명 피해까지 낳고 있다.
본론2: 각국이 대응책을 마련하는 반면에, 실질적인 실행은 여전히 부족하다.
결론: 그럼에도 불구하고 지속 가능한 정책을 지금 시작해야 하며, 따라서 개인의 실천도 중요하다.</code></pre>
<h3>Chiến lược đọc hiểu học thuật</h3>
<p>Bài đọc TOPIK II bậc 5-6급 thường là trích đoạn xã luận hoặc báo cáo. Đọc câu ĐẦU và câu CUỐI của mỗi đoạn trước — câu chủ đề thường nêu luận điểm, câu kết thường nhắc lại bằng 따라서/결국. Gạch chân các liên từ (뿐만 아니라, 반면에, 그럼에도 불구하고) — chúng đánh dấu chính xác chỗ lập luận chuyển hướng.</p>
<div class="callout"><span class="badge">Mẹo thi</span> Giám khảo đánh giá cao sự ĐA DẠNG: trộn 은/는 셈이다, 기 마련이다, 을 전망이다, 뿐만 아니라, 는 반면에 trong cùng một bài luận cho thấy bạn làm chủ toàn bộ công cụ của môn này, chứ không chỉ lặp một mẫu câu ưa thích.</div>`,
  ]]);
const c8q = quiz('krl502-quiz-8', 'Quiz 8 — TOPIK 5-6 review: essay & academic reading|||Quiz 8 — Ôn tập TOPIK 5-6: viết luận & đọc hiểu', [
  { id: 'q1', question: 'Trong cấu trúc bài luận 서론-본론-결론, phần 결론 (kết bài) thường dùng liên từ nào?', options: ['따라서, 그러므로', '반면에', '뿐만 아니라', '는 통에'], correctIndex: 0, explanation: '결론 thường nhắc lại lập trường và đưa hướng tương lai bằng 따라서/그러므로.' },
  { id: 'q2', question: 'Khi đọc một đoạn văn học thuật TOPIK 5-6, nên chú ý nhất vào đâu để nắm nhanh luận điểm?', options: ['Chỉ đọc câu giữa đoạn', 'Câu ĐẦU và câu CUỐI mỗi đoạn, cùng các liên từ nối ý', 'Chỉ đếm số từ trong đoạn', 'Bỏ qua liên từ vì không quan trọng'], correctIndex: 1, explanation: 'Câu đầu nêu luận điểm, câu cuối thường nhắc lại bằng 따라서/결국; liên từ đánh dấu chỗ lập luận chuyển hướng.' },
  { id: 'q3', question: '그럼에도 불구하고 nghĩa là gì?', options: ['Vì vậy, do đó', 'Dù vậy, bất chấp điều đó', 'Không những... mà còn', 'Trái lại, mặt khác'], correctIndex: 1, explanation: '그럼에도 불구하고 (geureomedo bulguhago) = dù vậy, bất chấp điều đó (nevertheless).' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'KRL502',
    slug: 'krl502-advanced-korean-1',
    title: 'Advanced Korean 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KRL502.webp',
    shortDescription: 'Advanced Korean 1 (TOPIK 5-6): society, economy & globalization, science & tech, culture & arts, abstract/emotional language, argumentative/journalistic style, advanced idioms (사자성어, 속담) & TOPIK essay/reading review. 서울대 한국어 5-6, 이화 5.|||Tiếng Hàn nâng cao 1 (TOPIK 5-6): xã hội, kinh tế & toàn cầu hoá, khoa học công nghệ, văn hoá nghệ thuật, ngôn ngữ trừu tượng/cảm xúc, văn nghị luận báo chí, thành ngữ tục ngữ (사자성어, 속담) & ôn luyện viết luận/đọc hiểu TOPIK. 서울대 한국어 5-6, 이화 5.',
    description: 'Môn <strong>KRL502 — Advanced Korean 1</strong> (Tiếng Hàn nâng cao 1, Kỳ 7, ngành Ngôn ngữ Hàn) nối tiếp <strong>KRL402</strong>, đưa trình độ lên <strong>TOPIK II bậc cao (5-6급)</strong>. Từ <strong>xã hội &amp; vấn đề đương đại</strong> (은/는 셈이다, 기 마련이다) → <strong>kinh tế, việc làm &amp; toàn cầu hoá</strong> (는 한편으로, 에 따라) → <strong>khoa học, công nghệ &amp; tương lai</strong> (을 전망이다, 기에 이르다) → <strong>văn hoá, nghệ thuật &amp; truyền thống Hàn</strong> (는 듯싶다, 을 만하다) → <strong>ngôn ngữ trừu tượng &amp; biểu đạt cảm xúc</strong> (는 나머지, 을 따름이다) → <strong>văn phong nghị luận &amp; báo chí</strong> (을 뿐만 아니라, 는 반면에) → <strong>thành ngữ, tục ngữ nâng cao</strong> (사자성어, 속담) → <strong>ôn tập TOPIK 5-6</strong>: viết luận nâng cao &amp; đọc hiểu học thuật. Bám giáo trình 서울대 한국어 5-6 / 이화 한국어 5, song ngữ Hàn-Việt-Anh, có bảng từ vựng, ngữ pháp, đoạn văn/hội thoại và quiz mỗi chương.',
    whatYouLearn: 'Đánh giá tình huống bằng 은/는 셈이다 và nêu xu hướng tất yếu bằng 기 마련이다; nối hành động song song với 는 한편으로 và diễn tả biến động theo yếu tố với 에 따라; đưa ra dự báo bằng 을 전망이다 và mô tả quá trình leo thang bằng 기에 이르다; phỏng đoán mềm bằng 는 듯싶다 và khen sự xứng đáng bằng 을 만하다; diễn tả nguyên nhân cực đoan bằng 는 나머지 và khiêm tốn giới hạn bằng 을 따름이다; lập luận không những...mà còn (뿐만 아니라) và đối lập trang trọng (는 반면에); nhận diện và dùng 사자성어/속담 nâng cao trong văn viết; dựng bài luận 서론-본론-결론 và áp dụng chiến lược đọc hiểu văn bản học thuật TOPIK 5-6.',
    requirements: 'Đã học xong KRL402 (Intermediate Korean 3) hoặc tương đương: nắm vững 는 한/는 이상, 았/었더라면, 을 법하다, 는 가운데/와중에, 을락 말락, 기는커녕, 는 통에, 았/었던들, và bậc lịch sự 해요체/합니다체. Cần đọc báo/xã luận tiếng Hàn thường xuyên và luyện viết đoạn văn mỗi tuần.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình 서울대 한국어 5-6/이화 5, trang TOPIK chính thức, từ điển Naver, YouTube nâng cao, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp KRL402, mục tiêu TOPIK 5-6, bản đồ 8 chương, bậc lịch sự trang trọng.', lessons: [intro] },
    { title: 'Chương 1 — Xã hội & vấn đề đương đại|||Chapter 1 — Society & contemporary issues', description: '은/는 셈이다, 기 마련이다.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kinh tế, việc làm & toàn cầu hoá|||Chapter 2 — Economy, employment & globalization', description: '는 한편으로, 에 따라.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Khoa học, công nghệ & tương lai|||Chapter 3 — Science, technology & the future', description: '을 전망이다, 기에 이르다.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Văn hoá, nghệ thuật & truyền thống Hàn|||Chapter 4 — Culture, arts & Korean tradition', description: '는 듯싶다, 을 만하다.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Ngôn ngữ trừu tượng & biểu đạt cảm xúc|||Chapter 5 — Abstract language & emotional expression', description: '는 나머지, 을 따름이다.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Văn phong nghị luận & báo chí|||Chapter 6 — Argumentative & journalistic style', description: '을 뿐만 아니라, 는 반면에.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thành ngữ, tục ngữ nâng cao|||Chapter 7 — Advanced idioms & proverbs', description: '사자성어, 속담.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập TOPIK 5-6|||Chapter 8 — TOPIK 5-6 review', description: 'Viết luận nâng cao, đọc hiểu học thuật.', lessons: [c8, c8q] },
  ],
};
